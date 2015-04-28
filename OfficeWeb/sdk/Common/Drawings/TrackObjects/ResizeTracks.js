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
function CreatePenBrushForChartTrack() {
    return ExecuteNoHistory(function () {
        var brush = new CUniFill();
        brush.setFill(new CSolidFill());
        brush.fill.setColor(new CUniColor());
        brush.fill.color.RGBA = {
            R: 255,
            G: 255,
            B: 255,
            A: 255
        };
        brush.fill.color.setColor(new CRGBColor());
        brush.fill.color.color.RGBA = {
            R: 255,
            G: 255,
            B: 255,
            A: 255
        };
        var pen = new CLn();
        pen.setFill(new CUniFill());
        pen.Fill.setFill(new CSolidFill());
        pen.Fill.fill.setColor(new CUniColor());
        pen.Fill.fill.color.setColor(new CRGBColor());
        return {
            brush: brush,
            pen: pen
        };
    },
    this, []);
}
function ResizeTrackShapeImage(originalObject, cardDirection) {
    ExecuteNoHistory(function () {
        this.originalObject = originalObject;
        this.numberHandle = originalObject.getNumByCardDirection(cardDirection);
        this.pageIndex = null;
        var numberHandle = this.numberHandle;
        this.flipH = originalObject.flipH;
        this.flipV = originalObject.flipV;
        var _flip_h = originalObject.flipH;
        var _flip_v = originalObject.flipV;
        var _half_height = originalObject.extY * 0.5;
        var _half_width = originalObject.extX * 0.5;
        var _sin = Math.sin(originalObject.rot);
        var _cos = Math.cos(originalObject.rot);
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
        this.aspect = this.bAspect === true ? this.originalObject.getAspect(_translated_num_handle) : 0;
        this.sin = _sin;
        this.cos = _cos;
        this.translatetNumberHandle = _translated_num_handle;
        switch (_translated_num_handle) {
        case 0:
            case 1:
            this.fixedPointX = (_half_width * _cos - _half_height * _sin) + _half_width + originalObject.x;
            this.fixedPointY = (_half_width * _sin + _half_height * _cos) + _half_height + originalObject.y;
            break;
        case 2:
            case 3:
            this.fixedPointX = (-_half_width * _cos - _half_height * _sin) + _half_width + originalObject.x;
            this.fixedPointY = (-_half_width * _sin + _half_height * _cos) + _half_height + originalObject.y;
            break;
        case 4:
            case 5:
            this.fixedPointX = (-_half_width * _cos + _half_height * _sin) + _half_width + originalObject.x;
            this.fixedPointY = (-_half_width * _sin - _half_height * _cos) + _half_height + originalObject.y;
            break;
        case 6:
            case 7:
            this.fixedPointX = (_half_width * _cos + _half_height * _sin) + _half_width + originalObject.x;
            this.fixedPointY = (_half_width * _sin - _half_height * _cos) + _half_height + originalObject.y;
            break;
        }
        this.mod = this.translatetNumberHandle % 4;
        this.centerPointX = originalObject.x + _half_width;
        this.centerPointY = originalObject.y + _half_height;
        this.originalExtX = originalObject.extX;
        this.originalExtY = originalObject.extY;
        this.originalFlipH = _flip_h;
        this.originalFlipV = _flip_v;
        this.usedExtX = this.originalExtX === 0 ? (0.01) : this.originalExtX;
        this.usedExtY = this.originalExtY === 0 ? (0.01) : this.originalExtY;
        this.resizedExtX = this.originalExtX;
        this.resizedExtY = this.originalExtY;
        this.resizedflipH = _flip_h;
        this.resizedflipV = _flip_v;
        this.resizedPosX = originalObject.x;
        this.resizedPosY = originalObject.y;
        this.resizedRot = originalObject.rot;
        this.transform = originalObject.transform.CreateDublicate();
        this.geometry = !(originalObject.getObjectType() === historyitem_type_ChartSpace) && originalObject.spPr && originalObject.spPr.geometry ? originalObject.spPr.geometry.createDuplicate() : (function () {
            var geometry = CreateGeometry("rect");
            geometry.Recalculate(5, 5);
            return geometry;
        })();
        if (!originalObject.isChart()) {
            this.brush = originalObject.brush;
            this.pen = originalObject.pen;
        } else {
            var pen_brush = CreatePenBrushForChartTrack();
            this.brush = pen_brush.brush;
            this.pen = pen_brush.pen;
        }
        this.isLine = originalObject.spPr && originalObject.spPr.geometry && originalObject.spPr.geometry.preset === "line";
        this.bChangeCoef = this.translatetNumberHandle % 2 === 0 && this.originalFlipH !== this.originalFlipV;
        this.overlayObject = new OverlayObject(this.geometry, this.resizedExtX, this.resizedExtY, this.brush, this.pen, this.transform);
        this.track = function (kd1, kd2, e) {
            if (!e.CtrlKey) {
                this.resize(kd1, kd2, e.ShiftKey);
            } else {
                this.resizeRelativeCenter(kd1, kd2, e.ShiftKey);
            }
        };
        this.resize = function (kd1, kd2, ShiftKey) {
            var _cos = this.cos;
            var _sin = this.sin;
            var _real_height, _real_width;
            var _abs_height, _abs_width;
            var _new_resize_half_width;
            var _new_resize_half_height;
            var _new_used_half_width;
            var _new_used_half_height;
            var _temp;
            if ((ShiftKey === true || window.AscAlwaysSaveAspectOnResizeTrack === true) && this.bAspect === true) {
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
                    if (!this.isLine) {
                        this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE ? _abs_width : MIN_SHAPE_SIZE;
                    } else {
                        this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE ? _abs_width : 0;
                    }
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
                if (!this.isLine) {
                    this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE ? _abs_height : MIN_SHAPE_SIZE;
                } else {
                    this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE ? _abs_height : 0;
                }
                this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE || this.isLine ? _abs_height : MIN_SHAPE_SIZE;
                if (_real_height < 0) {
                    this.resizedflipV = !this.originalFlipV;
                    if (this.isLine && ShiftKey) {
                        this.resizedflipH = !this.originalFlipH;
                    }
                } else {
                    this.resizedflipV = this.originalFlipV;
                    if (this.isLine && ShiftKey && this.resizedflipH !== this.originalFlipH) {
                        this.resizedflipV = !this.originalFlipV;
                    }
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
                    this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE ? _abs_height : (this.isLine ? 0 : MIN_SHAPE_SIZE);
                    if (_real_height < 0) {
                        this.resizedflipV = !this.originalFlipV;
                    } else {
                        this.resizedflipV = this.originalFlipV;
                    }
                }
                _real_width = this.usedExtX * kd1;
                _abs_width = Math.abs(_real_width);
                this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE ? _abs_width : (this.isLine ? 0 : MIN_SHAPE_SIZE);
                if (_real_width < 0) {
                    this.resizedflipH = !this.originalFlipH;
                    if (this.isLine && ShiftKey) {
                        this.resizedflipV = !this.originalFlipV;
                    }
                } else {
                    this.resizedflipH = this.originalFlipH;
                    if (this.isLine && ShiftKey && this.resizedflipV !== this.originalFlipV) {
                        this.resizedflipH = !this.originalFlipH;
                    }
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
                    this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE ? _abs_width : (this.isLine ? 0 : MIN_SHAPE_SIZE);
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
                this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE ? _abs_height : (this.isLine ? 0 : MIN_SHAPE_SIZE);
                if (_real_height < 0) {
                    this.resizedflipV = !this.originalFlipV;
                    if (this.isLine && ShiftKey) {
                        this.resizedflipH = !this.originalFlipH;
                    }
                } else {
                    this.resizedflipV = this.originalFlipV;
                    if (this.isLine && ShiftKey && this.resizedflipH !== this.originalFlipH) {
                        this.resizedflipV = !this.originalFlipV;
                    }
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
                    this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE ? _abs_height : (this.isLine ? 0 : MIN_SHAPE_SIZE);
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
                this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE ? _abs_width : (this.isLine ? 0 : MIN_SHAPE_SIZE);
                if (_real_width < 0) {
                    this.resizedflipH = !this.originalFlipH;
                    if (this.isLine && ShiftKey) {
                        this.resizedflipV = !this.originalFlipV;
                    }
                } else {
                    this.resizedflipH = this.originalFlipH;
                    if (this.isLine && ShiftKey && this.resizedflipV !== this.originalFlipV) {
                        this.resizedflipH = !this.originalFlipH;
                    }
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
            this.overlayObject.updateExtents(this.resizedExtX, this.resizedExtY);
            var _transform = this.transform;
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
            if (this.originalObject.group) {
                global_MatrixTransformer.MultiplyAppend(_transform, this.originalObject.group.transform);
            }
            if (this.originalObject.parent) {
                var parent_shape = this.originalObject.parent.isShapeChild && this.originalObject.parent.isShapeChild(true);
                if (parent_shape) {
                    global_MatrixTransformer.MultiplyAppend(_transform, parent_shape.transformText);
                }
            }
        };
        this.resizeRelativeCenter = function (kd1, kd2, ShiftKey) {
            if (this.isLine) {
                this.resize(kd1, kd2, ShiftKey);
                return;
            }
            kd1 = 2 * kd1 - 1;
            kd2 = 2 * kd2 - 1;
            var _real_height, _real_width;
            var _abs_height, _abs_width;
            if ((ShiftKey === true || window.AscAlwaysSaveAspectOnResizeTrack === true) && this.bAspect === true) {
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
                    this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.isLine ? _abs_width : MIN_SHAPE_SIZE;
                    this.resizedflipH = _real_width < 0 ? !this.originalFlipH : this.originalFlipH;
                } else {
                    _temp = kd1;
                    kd1 = kd2;
                    kd2 = _temp;
                }
                _real_height = this.usedExtY * kd2;
                _abs_height = Math.abs(_real_height);
                this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE || this.isLine ? _abs_height : MIN_SHAPE_SIZE;
                this.resizedflipV = _real_height < 0 ? !this.originalFlipV : this.originalFlipV;
            } else {
                if (this.mod === 2) {
                    _temp = kd1;
                    kd1 = kd2;
                    kd2 = _temp;
                    _real_height = this.usedExtY * kd2;
                    _abs_height = Math.abs(_real_height);
                    this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE || this.isLine ? _abs_height : MIN_SHAPE_SIZE;
                    this.resizedflipV = _real_height < 0 ? !this.originalFlipV : this.originalFlipV;
                }
                _real_width = this.usedExtX * kd1;
                _abs_width = Math.abs(_real_width);
                this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.isLine ? _abs_width : MIN_SHAPE_SIZE;
                this.resizedflipH = _real_width < 0 ? !this.originalFlipH : this.originalFlipH;
            }
            this.resizedPosX = this.centerPointX - this.resizedExtX * 0.5;
            this.resizedPosY = this.centerPointY - this.resizedExtY * 0.5;
            this.geometry.Recalculate(this.resizedExtX, this.resizedExtY);
            this.overlayObject.updateExtents(this.resizedExtX, this.resizedExtY);
            var _transform = this.transform;
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
            if (this.originalObject.group) {
                global_MatrixTransformer.MultiplyAppend(_transform, this.originalObject.group.transform);
            }
            if (this.originalObject.parent) {
                var parent_shape = this.originalObject.parent.isShapeChild && this.originalObject.parent.isShapeChild(true);
                if (parent_shape) {
                    global_MatrixTransformer.MultiplyAppend(_transform, parent_shape.transformText);
                }
            }
        };
        this.draw = function (overlay, transform) {
            if (isRealNumber(this.originalObject.selectStartPage) && overlay.SetCurrentPage) {
                overlay.SetCurrentPage(this.originalObject.selectStartPage);
            }
            this.overlayObject.draw(overlay, transform);
        };
        this.getBounds = function () {
            var boundsChecker = new CSlideBoundsChecker();
            var tr = this.transform;
            var parent_shape = this.originalObject && this.originalObject.parent && this.originalObject.parent.isShapeChild && this.originalObject.parent.isShapeChild(true);
            if (parent_shape) {
                tr = tr.CreateDublicate();
                global_MatrixTransformer.MultiplyAppend(tr, parent_shape.invertTransformText);
            }
            this.draw(boundsChecker, parent_shape ? tr : null);
            var arr_p_x = [];
            var arr_p_y = [];
            arr_p_x.push(tr.TransformPointX(0, 0));
            arr_p_y.push(tr.TransformPointY(0, 0));
            arr_p_x.push(tr.TransformPointX(this.resizedExtX, 0));
            arr_p_y.push(tr.TransformPointY(this.resizedExtX, 0));
            arr_p_x.push(tr.TransformPointX(this.resizedExtX, this.resizedExtY));
            arr_p_y.push(tr.TransformPointY(this.resizedExtX, this.resizedExtY));
            arr_p_x.push(tr.TransformPointX(0, this.resizedExtY));
            arr_p_y.push(tr.TransformPointY(0, this.resizedExtY));
            arr_p_x.push(boundsChecker.Bounds.min_x);
            arr_p_x.push(boundsChecker.Bounds.max_x);
            arr_p_y.push(boundsChecker.Bounds.min_y);
            arr_p_y.push(boundsChecker.Bounds.max_y);
            boundsChecker.Bounds.min_x = Math.min.apply(Math, arr_p_x);
            boundsChecker.Bounds.max_x = Math.max.apply(Math, arr_p_x);
            boundsChecker.Bounds.min_y = Math.min.apply(Math, arr_p_y);
            boundsChecker.Bounds.max_y = Math.max.apply(Math, arr_p_y);
            boundsChecker.Bounds.posX = this.resizedPosX;
            boundsChecker.Bounds.posY = this.resizedPosY;
            boundsChecker.Bounds.extX = this.resizedExtX;
            boundsChecker.Bounds.extY = this.resizedExtY;
            return boundsChecker.Bounds;
        };
        this.trackEnd = function (bWord) {
            var scale_coefficients, ch_off_x, ch_off_y;
            if (this.originalObject.group) {
                scale_coefficients = this.originalObject.group.getResultScaleCoefficients();
                ch_off_x = this.originalObject.group.spPr.xfrm.chOffX;
                ch_off_y = this.originalObject.group.spPr.xfrm.chOffY;
            } else {
                scale_coefficients = {
                    cx: 1,
                    cy: 1
                };
                ch_off_x = 0;
                ch_off_y = 0;
                if (bWord) {
                    this.resizedPosX = 0;
                    this.resizedPosY = 0;
                }
            }
            CheckSpPrXfrm(this.originalObject);
            var xfrm = this.originalObject.spPr.xfrm;
            xfrm.setOffX(this.resizedPosX / scale_coefficients.cx + ch_off_x);
            xfrm.setOffY(this.resizedPosY / scale_coefficients.cy + ch_off_y);
            xfrm.setExtX(this.resizedExtX / scale_coefficients.cx);
            xfrm.setExtY(this.resizedExtY / scale_coefficients.cy);
            if (this.originalObject.getObjectType() !== historyitem_type_ChartSpace) {
                xfrm.setFlipH(this.resizedflipH);
                xfrm.setFlipV(this.resizedflipV);
            }
            this.originalObject.checkDrawingBaseCoords();
        };
    },
    this, []);
}
function ResizeTrackGroup(originalObject, cardDirection, parentTrack) {
    ExecuteNoHistory(function () {
        this.original = originalObject;
        this.originalObject = originalObject;
        this.parentTrack = parentTrack;
        var numberHandle;
        if (isRealNumber(cardDirection)) {
            this.numberHandle = originalObject.getNumByCardDirection(cardDirection);
            numberHandle = this.numberHandle;
        }
        this.x = originalObject.x;
        this.y = originalObject.y;
        this.extX = originalObject.extX;
        this.extY = originalObject.extY;
        this.rot = originalObject.rot;
        this.flipH = originalObject.flipH;
        this.flipV = originalObject.flipV;
        this.transform = originalObject.transform.CreateDublicate();
        this.bSwapCoef = !(checkNormalRotate(this.rot));
        this.childs = [];
        var a = originalObject.spTree;
        for (var i = 0; i < a.length; ++i) {
            if (a[i].isGroup()) {
                this.childs[i] = new ResizeTrackGroup(a[i], null, this);
            } else {
                this.childs[i] = new ShapeForResizeInGroup(a[i], this);
            }
        }
        if (typeof numberHandle === "number") {
            var _translated_num_handle;
            var _flip_h = this.flipH;
            var _flip_v = this.flipV;
            var _sin = Math.sin(this.rot);
            var _cos = Math.cos(this.rot);
            var _half_width = this.extX * 0.5;
            var _half_height = this.extY * 0.5;
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
            this.aspect = this.bAspect === true ? this.original.getAspect(_translated_num_handle) : 0;
            this.sin = _sin;
            this.cos = _cos;
            this.translatetNumberHandle = _translated_num_handle;
            switch (_translated_num_handle) {
            case 0:
                case 1:
                this.fixedPointX = (_half_width * _cos - _half_height * _sin) + _half_width + this.x;
                this.fixedPointY = (_half_width * _sin + _half_height * _cos) + _half_height + this.y;
                break;
            case 2:
                case 3:
                this.fixedPointX = (-_half_width * _cos - _half_height * _sin) + _half_width + this.x;
                this.fixedPointY = (-_half_width * _sin + _half_height * _cos) + _half_height + this.y;
                break;
            case 4:
                case 5:
                this.fixedPointX = (-_half_width * _cos + _half_height * _sin) + _half_width + this.x;
                this.fixedPointY = (-_half_width * _sin - _half_height * _cos) + _half_height + this.y;
                break;
            case 6:
                case 7:
                this.fixedPointX = (_half_width * _cos + _half_height * _sin) + _half_width + this.x;
                this.fixedPointY = (_half_width * _sin - _half_height * _cos) + _half_height + this.y;
                break;
            }
            this.mod = this.translatetNumberHandle % 4;
            this.centerPointX = this.x + _half_width;
            this.centerPointY = this.y + _half_height;
            this.lineFlag = false;
            this.originalExtX = this.extX;
            this.originalExtY = this.extY;
            this.originalFlipH = _flip_h;
            this.originalFlipV = _flip_v;
            this.usedExtX = this.originalExtX === 0 ? (0.01) : this.originalExtX;
            this.usedExtY = this.originalExtY === 0 ? (0.01) : this.originalExtY;
            this.resizedExtX = this.originalExtX;
            this.resizedExtY = this.originalExtY;
            this.resizedflipH = _flip_h;
            this.resizedflipV = _flip_v;
            this.resizedPosX = this.x;
            this.resizedPosY = this.y;
            this.resizedRot = this.rot;
            this.bChangeCoef = this.translatetNumberHandle % 2 === 0 && this.originalFlipH !== this.originalFlipV;
        }
        if (this.parentTrack) {
            this.centerDistX = this.x + this.extX * 0.5 - this.parentTrack.extX * 0.5;
            this.centerDistY = this.y + this.extY * 0.5 - this.parentTrack.extY * 0.5;
        }
        this.track = function (kd1, kd2, e) {
            if (!e.CtrlKey) {
                this.resize(kd1, kd2, e.ShiftKey);
            } else {
                this.resizeRelativeCenter(kd1, kd2, e.ShiftKey);
            }
        };
        this.resize = function (kd1, kd2, ShiftKey) {
            var _cos = this.cos;
            var _sin = this.sin;
            var _real_height, _real_width;
            var _abs_height, _abs_width;
            var _new_resize_half_width;
            var _new_resize_half_height;
            var _new_used_half_width;
            var _new_used_half_height;
            var _temp;
            if ((ShiftKey === true || window.AscAlwaysSaveAspectOnResizeTrack === true) && this.bAspect === true) {
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
            this.x = this.resizedPosX;
            this.y = this.resizedPosY;
            this.extX = this.resizedExtX;
            this.extY = this.resizedExtY;
            this.flipH = this.resizedflipH;
            this.flipV = this.resizedflipV;
            var _transform = this.transform;
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
            var xfrm = this.original.spPr.xfrm;
            var kw = this.resizedExtX / xfrm.extX;
            var kh = this.resizedExtY / xfrm.extY;
            for (var i = 0; i < this.childs.length; ++i) {
                var cur_child = this.childs[i];
                cur_child.updateSize(kw, kh);
            }
        };
        this.resizeRelativeCenter = function (kd1, kd2, ShiftKey) {
            kd1 = 2 * kd1 - 1;
            kd2 = 2 * kd2 - 1;
            var _real_height, _real_width;
            var _abs_height, _abs_width;
            if ((ShiftKey === true || window.AscAlwaysSaveAspectOnResizeTrack === true) && this.bAspect === true) {
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
            this.x = this.resizedPosX;
            this.y = this.resizedPosY;
            this.extX = this.resizedExtX;
            this.extY = this.resizedExtY;
            this.flipH = this.resizedflipH;
            this.flipV = this.resizedflipV;
            var _transform = this.transform;
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
            var xfrm = this.original.spPr.xfrm;
            var kw = this.resizedExtX / xfrm.extX;
            var kh = this.resizedExtY / xfrm.extY;
            for (var i = 0; i < this.childs.length; ++i) {
                this.childs[i].updateSize(kw, kh);
            }
        };
        this.updateSize = function (kw, kh) {
            var _kw, _kh;
            if (this.bSwapCoef) {
                _kw = kh;
                _kh = kw;
            } else {
                _kw = kw;
                _kh = kh;
            }
            var xfrm = this.original.spPr.xfrm;
            this.extX = xfrm.extX * _kw;
            this.extY = xfrm.extY * _kh;
            this.x = this.centerDistX * kw + this.parentTrack.extX * 0.5 - this.extX * 0.5;
            this.y = this.centerDistY * kh + this.parentTrack.extY * 0.5 - this.extY * 0.5;
            this.transform.Reset();
            var t = this.transform;
            global_MatrixTransformer.TranslateAppend(t, -this.extX * 0.5, -this.extY * 0.5);
            if (xfrm.flipH == null ? false : xfrm.flipH) {
                global_MatrixTransformer.ScaleAppend(t, -1, 1);
            }
            if (xfrm.flipV == null ? false : xfrm.flipV) {
                global_MatrixTransformer.ScaleAppend(t, 1, -1);
            }
            global_MatrixTransformer.RotateRadAppend(t, xfrm.rot == null ? 0 : -xfrm.rot);
            global_MatrixTransformer.TranslateAppend(t, this.x + this.extX * 0.5, this.y + this.extY * 0.5);
            global_MatrixTransformer.MultiplyAppend(t, this.parentTrack.transform);
            for (var i = 0; i < this.childs.length; ++i) {
                this.childs[i].updateSize(_kw, _kh);
            }
        };
        this.draw = function (graphics) {
            if (isRealNumber(this.originalObject.selectStartPage) && graphics.SetCurrentPage) {
                graphics.SetCurrentPage(this.originalObject.selectStartPage);
            }
            for (var i = 0; i < this.childs.length; ++i) {
                this.childs[i].draw(graphics);
            }
        };
        this.getBounds = function () {
            var boundsChecker = new CSlideBoundsChecker();
            this.draw(boundsChecker);
            var tr = this.transform;
            var arr_p_x = [];
            var arr_p_y = [];
            arr_p_x.push(tr.TransformPointX(0, 0));
            arr_p_y.push(tr.TransformPointY(0, 0));
            arr_p_x.push(tr.TransformPointX(this.resizedExtX, 0));
            arr_p_y.push(tr.TransformPointY(this.resizedExtX, 0));
            arr_p_x.push(tr.TransformPointX(this.resizedExtX, this.resizedExtY));
            arr_p_y.push(tr.TransformPointY(this.resizedExtX, this.resizedExtY));
            arr_p_x.push(tr.TransformPointX(0, this.resizedExtY));
            arr_p_y.push(tr.TransformPointY(0, this.resizedExtY));
            arr_p_x.push(boundsChecker.Bounds.min_x);
            arr_p_x.push(boundsChecker.Bounds.max_x);
            arr_p_y.push(boundsChecker.Bounds.min_y);
            arr_p_y.push(boundsChecker.Bounds.max_y);
            boundsChecker.Bounds.min_x = Math.min.apply(Math, arr_p_x);
            boundsChecker.Bounds.max_x = Math.max.apply(Math, arr_p_x);
            boundsChecker.Bounds.min_y = Math.min.apply(Math, arr_p_y);
            boundsChecker.Bounds.max_y = Math.max.apply(Math, arr_p_y);
            boundsChecker.Bounds.posX = this.resizedPosX;
            boundsChecker.Bounds.posY = this.resizedPosY;
            boundsChecker.Bounds.extX = this.resizedExtX;
            boundsChecker.Bounds.extY = this.resizedExtY;
            return boundsChecker.Bounds;
        };
        this.trackEnd = function (bWord) {
            if (!isRealObject(this.original.group)) {
                this.original.normalize();
            }
            if (!this.original.spPr) {
                this.original.setSpPr(new CSpPr());
            }
            if (!this.original.spPr.xfrm) {
                this.original.spPr.setXfrm(new CXfrm());
                this.original.spPr.xfrm.setParent(this.original.spPr);
            }
            var xfrm = this.original.spPr.xfrm;
            if (bWord) {
                this.x = 0;
                this.y = 0;
            }
            xfrm.setOffX(this.x);
            xfrm.setOffY(this.y);
            xfrm.setExtX(this.extX);
            xfrm.setExtY(this.extY);
            xfrm.setChExtX(this.extX);
            xfrm.setChExtY(this.extY);
            xfrm.setFlipH(this.flipH);
            xfrm.setFlipV(this.flipV);
            for (var i = 0; i < this.childs.length; ++i) {
                this.childs[i].trackEnd();
            }
            this.original.checkDrawingBaseCoords();
        };
    },
    this, []);
}
function ShapeForResizeInGroup(originalObject, parentTrack) {
    ExecuteNoHistory(function () {
        this.originalObject = originalObject;
        this.parentTrack = parentTrack;
        this.x = originalObject.x;
        this.y = originalObject.y;
        this.extX = originalObject.extX;
        this.extY = originalObject.extY;
        this.rot = originalObject.rot;
        this.flipH = originalObject.flipH;
        this.flipV = originalObject.flipV;
        this.transform = originalObject.transform.CreateDublicate();
        this.bSwapCoef = !(checkNormalRotate(this.rot));
        this.centerDistX = this.x + this.extX * 0.5 - this.parentTrack.extX * 0.5;
        this.centerDistY = this.y + this.extY * 0.5 - this.parentTrack.extY * 0.5;
        this.geometry = !(originalObject.getObjectType() === historyitem_type_ChartSpace) && originalObject.spPr.geometry !== null ? originalObject.spPr.geometry.createDuplicate() : null;
        if (this.geometry) {
            this.geometry.Recalculate(this.extX, this.extY);
        }
        this.overlayObject = new OverlayObject(this.geometry, this.extX, this.extY, originalObject.brush, originalObject.pen, this.transform);
        this.updateSize = function (kw, kh) {
            var _kw, _kh;
            if (this.bSwapCoef) {
                _kw = kh;
                _kh = kw;
            } else {
                _kw = kw;
                _kh = kh;
            }
            this.extX = this.originalObject.extX * _kw;
            this.extY = this.originalObject.extY * _kh;
            this.x = this.centerDistX * kw + this.parentTrack.extX * 0.5 - this.extX * 0.5;
            this.y = this.centerDistY * kh + this.parentTrack.extY * 0.5 - this.extY * 0.5;
            this.overlayObject.updateExtents(this.extX, this.extY);
            this.transform.Reset();
            var t = this.transform;
            global_MatrixTransformer.TranslateAppend(t, -this.extX * 0.5, -this.extY * 0.5);
            if (this.flipH) {
                global_MatrixTransformer.ScaleAppend(t, -1, 1);
            }
            if (this.flipV) {
                global_MatrixTransformer.ScaleAppend(t, 1, -1);
            }
            global_MatrixTransformer.RotateRadAppend(t, -this.rot);
            global_MatrixTransformer.TranslateAppend(t, this.x + this.extX * 0.5, this.y + this.extY * 0.5);
            global_MatrixTransformer.MultiplyAppend(t, this.parentTrack.transform);
        };
        this.draw = function (overlay) {
            this.overlayObject.draw(overlay);
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
        this.trackEnd = function () {
            if (!this.originalObject.spPr.xfrm) {
                this.originalObject.spPr.setXfrm(new CXfrm());
                this.originalObject.spPr.xfrm.setParent(this.originalObject.spPr);
            }
            var xfrm = this.originalObject.spPr.xfrm;
            xfrm.setOffX(this.x);
            xfrm.setOffY(this.y);
            xfrm.setExtX(this.extX);
            xfrm.setExtY(this.extY);
        };
        this.updateTransform = function () {
            this.transform.Reset();
            var t = this.transform;
            global_MatrixTransformer.TranslateAppend(t, -this.extX * 0.5, -this.extY * 0.5);
            if (this.flipH) {
                global_MatrixTransformer.ScaleAppend(t, -1, 1);
            }
            if (this.flipV) {
                global_MatrixTransformer.ScaleAppend(t, 1, -1);
            }
            global_MatrixTransformer.RotateRadAppend(t, -this.rot);
            global_MatrixTransformer.TranslateAppend(t, this.x + this.extX * 0.5, this.y + this.extY * 0.5);
            if (this.parentTrack) {
                global_MatrixTransformer.MultiplyAppend(t, this.parentTrack.transform);
            }
        };
    },
    this, []);
}