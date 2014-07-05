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
function ResizeTrackShapeImage(originalObject, cardDirection) {
    this.originalObject = originalObject;
    this.numberHandle = originalObject.getNumByCardDirection(cardDirection);
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
    this.geometry = originalObject.spPr.geometry ? originalObject.spPr.geometry.createDuplicate() : (function () {
        var geometry = CreateGeometry("rect");
        geometry.Init(5, 5);
        return geometry;
    })();
    this.brush = originalObject.brush;
    this.pen = originalObject.pen;
    this.isLine = originalObject.spPr.geometry && originalObject.spPr.geometry.preset === "line";
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
        if (ShiftKey === true && this.bAspect === true) {
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
                this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.isLine ? _abs_width : MIN_SHAPE_SIZE;
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
                this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE || this.isLine ? _abs_height : MIN_SHAPE_SIZE;
                if (_real_height < 0) {
                    this.resizedflipV = !this.originalFlipV;
                } else {
                    this.resizedflipV = this.originalFlipV;
                }
            }
            _real_width = this.usedExtX * kd1;
            _abs_width = Math.abs(_real_width);
            this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.isLine ? _abs_width : MIN_SHAPE_SIZE;
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
                this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.isLine ? _abs_width : MIN_SHAPE_SIZE;
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
            this.resizedPosX = this.fixedPointX + (_new_used_half_width * _cos - _new_used_half_height * _sin) - _new_resize_half_width;
            this.resizedPosY = this.fixedPointY + (_new_used_half_width * _sin + _new_used_half_height * _cos) - _new_resize_half_height;
            break;
        case 6:
            case 7:
            if (this.translatetNumberHandle === 6) {
                _real_height = this.usedExtY * kd1;
                _abs_height = Math.abs(_real_height);
                this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE || this.isLine ? _abs_height : MIN_SHAPE_SIZE;
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
            this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.isLine ? _abs_width : MIN_SHAPE_SIZE;
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
        if (ShiftKey === true && this.bAspect === true) {
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
    this.getBoundsRect = function () {
        var t = this.transform;
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
    this.trackEnd = function () {
        this.originalObject.setXfrm(this.resizedPosX, this.resizedPosY, this.resizedExtX, this.resizedExtY, null, this.resizedflipH, this.resizedflipV);
    };
}
function ResizeTrackShapeImageInGroup(originalObject, cardDirection) {
    this.originalObject = originalObject;
    this.numberHandle = originalObject.getNumByCardDirection(cardDirection);
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
    this.geometry = originalObject.spPr.geometry.createDuplicate();
    this.brush = originalObject.brush;
    this.pen = originalObject.pen;
    this.isLine = originalObject.spPr.geometry && originalObject.spPr.geometry.preset === "line";
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
        if (ShiftKey === true && this.bAspect === true) {
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
                this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.isLine ? _abs_width : MIN_SHAPE_SIZE;
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
            this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE || this.isLine ? _abs_height : MIN_SHAPE_SIZE;
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
                this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE || this.isLine ? _abs_height : MIN_SHAPE_SIZE;
                if (_real_height < 0) {
                    this.resizedflipV = !this.originalFlipV;
                } else {
                    this.resizedflipV = this.originalFlipV;
                }
            }
            _real_width = this.usedExtX * kd1;
            _abs_width = Math.abs(_real_width);
            this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.isLine ? _abs_width : MIN_SHAPE_SIZE;
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
                this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.isLine ? _abs_width : MIN_SHAPE_SIZE;
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
            this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE || this.isLine ? _abs_height : MIN_SHAPE_SIZE;
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
                this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE || this.isLine ? _abs_height : MIN_SHAPE_SIZE;
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
            this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.isLine ? _abs_width : MIN_SHAPE_SIZE;
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
        global_MatrixTransformer.MultiplyAppend(_transform, this.originalObject.group.getTransformMatrix());
    };
    this.resizeRelativeCenter = function (kd1, kd2, ShiftKey) {
        kd1 = 2 * kd1 - 1;
        kd2 = 2 * kd2 - 1;
        var _real_height, _real_width;
        var _abs_height, _abs_width;
        if (ShiftKey === true && this.bAspect === true) {
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
                this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE ? _abs_width : MIN_SHAPE_SIZE;
                this.resizedflipH = _real_width < 0 ? !this.originalFlipH : this.originalFlipH;
            } else {
                _temp = kd1;
                kd1 = kd2;
                kd2 = _temp;
            }
            _real_height = this.usedExtY * kd2;
            _abs_height = Math.abs(_real_height);
            this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE ? _abs_height : MIN_SHAPE_SIZE;
            this.resizedflipV = _real_height < 0 ? !this.originalFlipV : this.originalFlipV;
        } else {
            if (this.mod === 2) {
                _temp = kd1;
                kd1 = kd2;
                kd2 = _temp;
                _real_height = this.usedExtY * kd2;
                _abs_height = Math.abs(_real_height);
                this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE ? _abs_height : MIN_SHAPE_SIZE;
                this.resizedflipV = _real_height < 0 ? !this.originalFlipV : this.originalFlipV;
            }
            _real_width = this.usedExtX * kd1;
            _abs_width = Math.abs(_real_width);
            this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE ? _abs_width : MIN_SHAPE_SIZE;
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
        global_MatrixTransformer.MultiplyAppend(_transform, this.originalObject.group.getTransformMatrix());
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
    this.getBoundsRect = function () {
        var t = this.transform;
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
    this.trackEnd = function () {
        var scale_scale_coefficients = this.originalObject.group.getResultScaleCoefficients();
        var xfrm = this.originalObject.group.spPr.xfrm;
        this.originalObject.setOffset(this.resizedPosX / scale_scale_coefficients.cx + xfrm.chOffX, this.resizedPosY / scale_scale_coefficients.cy + xfrm.chOffY);
        this.originalObject.setExtents(this.resizedExtX / scale_scale_coefficients.cx, this.resizedExtY / scale_scale_coefficients.cy);
        this.originalObject.setFlips(this.resizedflipH, this.resizedflipV);
    };
}
function ResizeTrackGroup(originalObject, cardDirection, parentTrack) {
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
    this.bSwapCoef = !(this.rot < Math.PI * 0.25 || this.rot > Math.PI * 1.75 || (this.rot > Math.PI * 0.75 && this.rot < Math.PI * 1.25));
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
        if (ShiftKey === true && this.bAspect === true) {
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
        if (ShiftKey === true && this.bAspect === true) {
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
        for (var i = 0; i < this.childs.length; ++i) {
            this.childs[i].draw(graphics);
        }
    };
    this.getBoundsRect = function () {
        var t = this.transform;
        var min_x, max_x, min_y, max_y;
        min_x = t.TransformPointX(0, 0);
        max_x = min_x;
        min_y = t.TransformPointY(0, 0);
        max_y = min_y;
        var arr = [{
            x: this.extX,
            y: 0
        },
        {
            x: this.extX,
            y: this.extY
        },
        {
            x: 0,
            y: this.extY
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
    this.trackEnd = function () {
        if (!isRealObject(this.original.group)) {
            this.original.normalize();
        }
        this.original.setOffset(this.x, this.y);
        this.original.setExtents(this.extX, this.extY);
        this.original.setChildExtents(this.extX, this.extY);
        this.original.setFlips(this.flipH, this.flipV);
        for (var i = 0; i < this.childs.length; ++i) {
            this.childs[i].trackEnd();
        }
    };
}
function ShapeForResizeInGroup(originalObject, parentTrack) {
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
    this.bSwapCoef = !(this.rot < Math.PI * 0.25 || this.rot > Math.PI * 1.75 || (this.rot > Math.PI * 0.75 && this.rot < Math.PI * 1.25));
    this.centerDistX = this.x + this.extX * 0.5 - this.parentTrack.extX * 0.5;
    this.centerDistY = this.y + this.extY * 0.5 - this.parentTrack.extY * 0.5;
    this.geometry = originalObject.spPr.geometry !== null ? originalObject.spPr.geometry.createDuplicate() : null;
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
        if (this.geometry) {
            this.geometry.Recalculate(this.extX, this.extY);
        }
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
        this.originalObject.setOffset(this.x, this.y);
        this.originalObject.setExtents(this.extX, this.extY);
        if (this.originalObject.spPr.geometry !== null) {
            this.originalObject.spPr.geometry.Recalculate(this.extX, this.extY);
        }
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
}
function ResizeTrackChart(originalObject, cardDirection) {
    this.originalObject = originalObject;
    this.numberHandle = originalObject.getNumByCardDirection(cardDirection);
    var numberHandle = this.numberHandle;
    this.flipH = false;
    this.flipV = false;
    var _flip_h = false;
    var _flip_v = false;
    var _half_height = originalObject.extY * 0.5;
    var _half_width = originalObject.extX * 0.5;
    var _sin = Math.sin(0);
    var _cos = Math.cos(0);
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
    this.resizedRot = 0;
    this.transform = originalObject.transform.CreateDublicate();
    this.geometry = originalObject.spPr.geometry.createDuplicate();
    this.brush = originalObject.brush;
    this.pen = originalObject.pen;
    this.geometry = CreateGeometry("rect");
    this.geometry.Init(this.originalObject.extX, this.originalObject.extY);
    this.geometry.Recalculate(this.originalObject.extX, this.originalObject.extY);
    this.brush = new CUniFill();
    this.brush.fill = new CSolidFill();
    this.brush.fill.color = new CUniColor();
    this.brush.fill.color.RGBA = {
        R: 255,
        G: 255,
        B: 255,
        A: 255
    };
    this.brush.fill.color.color = new CRGBColor();
    this.brush.fill.color.color.RGBA = {
        R: 255,
        G: 255,
        B: 255,
        A: 255
    };
    this.pen = new CLn();
    this.pen.Fill = new CUniFill();
    this.pen.Fill.fill = new CSolidFill();
    this.pen.Fill.fill.color = new CUniColor();
    this.pen.Fill.fill.color.color = new CRGBColor();
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
        if (ShiftKey === true && this.bAspect === true) {
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
                this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE ? _abs_width : MIN_SHAPE_SIZE;
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
            this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE ? _abs_height : MIN_SHAPE_SIZE;
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
                this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE ? _abs_height : MIN_SHAPE_SIZE;
                if (_real_height < 0) {
                    this.resizedflipV = !this.originalFlipV;
                } else {
                    this.resizedflipV = this.originalFlipV;
                }
            }
            _real_width = this.usedExtX * kd1;
            _abs_width = Math.abs(_real_width);
            this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE ? _abs_width : MIN_SHAPE_SIZE;
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
                this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE ? _abs_width : MIN_SHAPE_SIZE;
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
            this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE ? _abs_height : MIN_SHAPE_SIZE;
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
                this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE ? _abs_height : MIN_SHAPE_SIZE;
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
            this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE ? _abs_width : MIN_SHAPE_SIZE;
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
    };
    this.resizeRelativeCenter = function (kd1, kd2, ShiftKey) {
        kd1 = 2 * kd1 - 1;
        kd2 = 2 * kd2 - 1;
        var _real_height, _real_width;
        var _abs_height, _abs_width;
        if (ShiftKey === true && this.bAspect === true) {
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
                this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE ? _abs_width : MIN_SHAPE_SIZE;
                this.resizedflipH = _real_width < 0 ? !this.originalFlipH : this.originalFlipH;
            } else {
                _temp = kd1;
                kd1 = kd2;
                kd2 = _temp;
            }
            _real_height = this.usedExtY * kd2;
            _abs_height = Math.abs(_real_height);
            this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE ? _abs_height : MIN_SHAPE_SIZE;
            this.resizedflipV = _real_height < 0 ? !this.originalFlipV : this.originalFlipV;
        } else {
            if (this.mod === 2) {
                _temp = kd1;
                kd1 = kd2;
                kd2 = _temp;
                _real_height = this.usedExtY * kd2;
                _abs_height = Math.abs(_real_height);
                this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE ? _abs_height : MIN_SHAPE_SIZE;
                this.resizedflipV = _real_height < 0 ? !this.originalFlipV : this.originalFlipV;
            }
            _real_width = this.usedExtX * kd1;
            _abs_width = Math.abs(_real_width);
            this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE ? _abs_width : MIN_SHAPE_SIZE;
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
    this.getBoundsRect = function () {
        var t = this.transform;
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
    this.trackEnd = function () {
        this.originalObject.x = this.resizedPosX;
        this.originalObject.y = this.resizedPosY;
        this.originalObject.extX = this.resizedExtX;
        this.originalObject.extY = this.resizedExtY;
        this.originalObject.setOffset(this.resizedPosX, this.resizedPosY);
        this.originalObject.setExtents(this.resizedExtX, this.resizedExtY);
    };
}