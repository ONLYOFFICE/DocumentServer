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
 function MoveTrackGroup(originalGroup, majorOffsetX, majorOffsetY) {
    this.originalGroup = originalGroup;
    this.posX = originalGroup.absOffsetX;
    this.posY = originalGroup.absOffsetY;
    this.pageIndex = originalGroup.pageIndex;
    this.flipH = originalGroup.absFlipH;
    this.flipV = originalGroup.absFlipV;
    this.horCenter = originalGroup.absExtX * 0.5;
    this.verCenter = originalGroup.absExtY * 0.5;
    this.rot = originalGroup.absRot;
    this.majorOffsetX = majorOffsetX;
    this.majorOffsetY = majorOffsetY;
    this.transformMatrix = originalGroup.transform.CreateDublicate();
    this.graphicObjects = [];
    for (var _shape_index = 0; _shape_index < originalGroup.arrGraphicObjects.length; ++_shape_index) {
        this.graphicObjects[_shape_index] = this.originalGroup.arrGraphicObjects[_shape_index].createObjectForDrawOnOverlayInGroup();
    }
    this.track = function (posX, posY, pageIndex) {
        this.posX = posX + this.majorOffsetX;
        this.posY = posY + this.majorOffsetY;
        this.pageIndex = pageIndex;
        this.calculateTransformMatrix();
        for (var _shape_index = 0; _shape_index < this.graphicObjects.length; ++_shape_index) {
            this.graphicObjects[_shape_index].pageIndex = pageIndex;
            this.graphicObjects[_shape_index].calculateFullTransform(this.transformMatrix);
        }
    };
    this.draw = function (overlay) {
        for (var _shape_index = 0; _shape_index < this.graphicObjects.length; ++_shape_index) {
            this.graphicObjects[_shape_index].draw(overlay);
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
        var t_x, t_y;
        var or_sp = this.originalGroup;
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
        this.boolChangePos = true;
        this.originalGroup.updatePosition(this.posX, this.posY);
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
function ResizeTrackGroup(originalGroup, numberHandle, pageIndex) {
    this.pageIndex = pageIndex;
    this.originalGroup = originalGroup;
    this.originalOffsetX = originalGroup.absOffsetX;
    this.originalOffsetY = originalGroup.absOffsetY;
    this.originalExtX = originalGroup.absExtX;
    this.originalExtY = originalGroup.absExtY;
    this.originalFlipH = originalGroup.absFlipH;
    this.originalFlipV = originalGroup.absFlipV;
    this.originalRot = originalGroup.absRot;
    this.resizedOffsetX = originalGroup.absOffsetX;
    this.resizedOffsetY = originalGroup.absOffsetY;
    this.resizedPosX = this.resizedOffsetX;
    this.resizedPosY = this.resizedOffsetY;
    this.resizedExtX = originalGroup.absExtX;
    this.resizedExtY = originalGroup.absExtY;
    this.usedExtX = this.originalExtX === 0 ? 0.01 : this.originalExtX;
    this.usedExtY = this.originalExtY === 0 ? 0.01 : this.originalExtY;
    this.resizedFlipH = originalGroup.absFlipH;
    this.resizedFlipV = originalGroup.absFlipV;
    this.resizedRot = originalGroup.absRot;
    var _translated_num_handle;
    if (!this.originalFlipH && !this.originalFlipV) {
        _translated_num_handle = numberHandle;
    } else {
        if (this.originalFlipH && !this.originalFlipV) {
            _translated_num_handle = TRANSLATE_HANDLE_FLIP_H[numberHandle];
        } else {
            if (!this.originalFlipH && this.originalFlipV) {
                _translated_num_handle = TRANSLATE_HANDLE_FLIP_V[numberHandle];
            } else {
                _translated_num_handle = TRANSLATE_HANDLE_FLIP_H_AND_FLIP_V[numberHandle];
            }
        }
    }
    this.translatetNumberHandle = _translated_num_handle;
    this.bAspect = typeof numberHandle === "number" && numberHandle % 2 === 0;
    this.aspect = this.bAspect === true ? this.originalGroup.getAspect(_translated_num_handle) : 0;
    this.sin = Math.sin(this.originalRot);
    this.cos = Math.cos(this.originalRot);
    var _half_width = this.originalExtX * 0.5;
    var _half_height = this.originalExtY * 0.5;
    var _sin = this.sin;
    var _cos = this.cos;
    switch (_translated_num_handle) {
    case 0:
        case 1:
        this.fixedPointX = (_half_width * _cos - _half_height * _sin) + _half_width + this.originalOffsetX;
        this.fixedPointY = (_half_width * _sin + _half_height * _cos) + _half_height + this.originalOffsetY;
        break;
    case 2:
        case 3:
        this.fixedPointX = (-_half_width * _cos - _half_height * _sin) + _half_width + this.originalOffsetX;
        this.fixedPointY = (-_half_width * _sin + _half_height * _cos) + _half_height + this.originalOffsetY;
        break;
    case 4:
        case 5:
        this.fixedPointX = (-_half_width * _cos + _half_height * _sin) + _half_width + this.originalOffsetX;
        this.fixedPointY = (-_half_width * _sin - _half_height * _cos) + _half_height + this.originalOffsetY;
        break;
    case 6:
        case 7:
        this.fixedPointX = (_half_width * _cos + _half_height * _sin) + _half_width + this.originalOffsetX;
        this.fixedPointY = (_half_width * _sin - _half_height * _cos) + _half_height + this.originalOffsetY;
        break;
    }
    this.mod = this.translatetNumberHandle % 4;
    this.centerPointX = this.originalOffsetX + _half_width;
    this.centerPointY = this.originalOffsetY + _half_height;
    this.transformMatrix = originalGroup.transform.CreateDublicate();
    this.bChangeCoef = this.translatetNumberHandle % 2 === 0 && this.originalFlipH !== this.originalFlipV;
    this.childTracks = [];
    var _original_sp_tree = originalGroup.spTree;
    var _original_count = _original_sp_tree.length;
    for (var _original_index = 0; _original_index < _original_count; ++_original_index) {
        this.childTracks.push(_original_sp_tree[_original_index].createObjectForResizeInGroup());
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
                this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_width : MIN_SHAPE_SIZE;
                if (_real_width < 0) {
                    this.resizedFlipH = !this.originalFlipH;
                } else {
                    this.resizedFlipH = this.originalFlipH;
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
                this.resizedFlipV = !this.originalFlipV;
            } else {
                this.resizedFlipV = this.originalFlipV;
            }
            _new_resize_half_width = this.resizedExtX * 0.5;
            _new_resize_half_height = this.resizedExtY * 0.5;
            if (this.resizedFlipH !== this.originalFlipH) {
                _new_used_half_width = -_new_resize_half_width;
            } else {
                _new_used_half_width = _new_resize_half_width;
            }
            if (this.resizedFlipV !== this.originalFlipV) {
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
                    this.resizedFlipV = !this.originalFlipV;
                } else {
                    this.resizedFlipV = this.originalFlipV;
                }
            }
            _real_width = this.usedExtX * kd1;
            _abs_width = Math.abs(_real_width);
            this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_width : MIN_SHAPE_SIZE;
            if (_real_width < 0) {
                this.resizedFlipH = !this.originalFlipH;
            } else {
                this.resizedFlipH = this.originalFlipH;
            }
            _new_resize_half_width = this.resizedExtX * 0.5;
            _new_resize_half_height = this.resizedExtY * 0.5;
            if (this.resizedFlipH !== this.originalFlipH) {
                _new_used_half_width = -_new_resize_half_width;
            } else {
                _new_used_half_width = _new_resize_half_width;
            }
            if (this.resizedFlipV !== this.originalFlipV) {
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
                    this.resizedFlipH = !this.originalFlipH;
                } else {
                    this.resizedFlipH = this.originalFlipH;
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
                this.resizedFlipV = !this.originalFlipV;
            } else {
                this.resizedFlipV = this.originalFlipV;
            }
            _new_resize_half_width = this.resizedExtX * 0.5;
            _new_resize_half_height = this.resizedExtY * 0.5;
            if (this.resizedFlipH !== this.originalFlipH) {
                _new_used_half_width = -_new_resize_half_width;
            } else {
                _new_used_half_width = _new_resize_half_width;
            }
            if (this.resizedFlipV !== this.originalFlipV) {
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
                    this.resizedFlipV = !this.originalFlipV;
                } else {
                    this.resizedFlipV = this.originalFlipV;
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
                this.resizedFlipH = !this.originalFlipH;
            } else {
                this.resizedFlipH = this.originalFlipH;
            }
            _new_resize_half_width = this.resizedExtX * 0.5;
            _new_resize_half_height = this.resizedExtY * 0.5;
            if (this.resizedFlipH !== this.originalFlipH) {
                _new_used_half_width = -_new_resize_half_width;
            } else {
                _new_used_half_width = _new_resize_half_width;
            }
            if (this.resizedFlipV !== this.originalFlipV) {
                _new_used_half_height = -_new_resize_half_height;
            } else {
                _new_used_half_height = _new_resize_half_height;
            }
            this.resizedPosX = this.fixedPointX + (-_new_used_half_width * _cos - _new_used_half_height * _sin) - _new_resize_half_width;
            this.resizedPosY = this.fixedPointY + (-_new_used_half_width * _sin + _new_used_half_height * _cos) - _new_resize_half_height;
            break;
        }
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
        global_MatrixTransformer.TranslateAppend(_transform, this.resizedPosX, this.resizedPosY);
        global_MatrixTransformer.TranslateAppend(_transform, _horizontal_center, _vertical_center);
        var _kw = this.resizedExtX / this.originalExtX;
        var _kh = this.resizedExtY / this.originalExtY;
        for (var _child_index = 0; _child_index < this.childTracks.length; ++_child_index) {
            this.childTracks[_child_index].changeSizes(_kw, _kh, _horizontal_center, _vertical_center);
            this.childTracks[_child_index].calculateTransformMatrix(_transform);
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
                this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_width : MIN_SHAPE_SIZE;
                this.resizedFlipH = _real_width < 0 ? !this.originalFlipH : this.originalFlipH;
            } else {
                _temp = kd1;
                kd1 = kd2;
                kd2 = _temp;
            }
            _real_height = this.usedExtY * kd2;
            _abs_height = Math.abs(_real_height);
            this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_height : MIN_SHAPE_SIZE;
            this.resizedFlipV = _real_height < 0 ? !this.originalFlipV : this.originalFlipV;
        } else {
            if (this.mod === 2) {
                _temp = kd1;
                kd1 = kd2;
                kd2 = _temp;
                _real_height = this.usedExtY * kd2;
                _abs_height = Math.abs(_real_height);
                this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_height : MIN_SHAPE_SIZE;
                this.resizedFlipV = _real_height < 0 ? !this.originalFlipV : this.originalFlipV;
            }
            _real_width = this.usedExtX * kd1;
            _abs_width = Math.abs(_real_width);
            this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_width : MIN_SHAPE_SIZE;
            this.resizedFlipH = _real_width < 0 ? !this.originalFlipH : this.originalFlipH;
        }
        this.resizedPosX = this.centerPointX - this.resizedExtX * 0.5;
        this.resizedPosY = this.centerPointY - this.resizedExtY * 0.5;
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
        global_MatrixTransformer.TranslateAppend(_transform, this.resizedPosX, this.resizedPosY);
        global_MatrixTransformer.TranslateAppend(_transform, _horizontal_center, _vertical_center);
        var _kw = this.resizedExtX / this.originalExtX;
        var _kh = this.resizedExtY / this.originalExtY;
        for (var _child_index = 0; _child_index < this.childTracks.length; ++_child_index) {
            this.childTracks[_child_index].changeSizes(_kw, _kh, _horizontal_center, _vertical_center);
            this.childTracks[_child_index].calculateTransformMatrix(_transform);
        }
    };
    this.draw = function (overlay) {
        overlay.SetCurrentPage(this.pageIndex);
        for (var _child_index = 0; _child_index < this.childTracks.length; ++_child_index) {
            this.childTracks[_child_index].draw(overlay);
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
        var arr = [{
            x: this.resizedPosX,
            y: 0
        },
        {
            x: this.resizedPosX,
            y: this.resizedPosY
        },
        {
            x: 0,
            y: this.resizedPosY
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
        var bChange = this.resizedExtX !== this.originalGroup.absExtX || this.resizedExtY !== this.originalGroup.absExtY || this.resizedOffsetX !== this.resizedPosX || this.resizedOffsetY !== this.resizedPosY || this.resizedFlipH !== this.originalGroup.absFlipH || this.resizedFlipV !== this.originalGroup.absFlipV;
        if (bChange) {
            this.boolChangePos = true;
            this.originalGroup.setSizes(this.resizedPosX, this.resizedPosY, this.resizedExtX, this.resizedExtY, this.resizedFlipH, this.resizedFlipV, this.childTracks);
        } else {
            this.boolChangePos = false;
        }
    };
}
function RotateTrackGroup(originalGroup, pageIndex) {
    this.originalGroup = originalGroup;
    this.pageIndex = pageIndex;
    this.originalRot = this.originalGroup.absRot;
    this.rot = this.originalGroup.absRot;
    this.transformMatrix = this.originalGroup.transform.CreateDublicate();
    this.graphicObjects = [];
    for (var _shape_index = 0; _shape_index < originalGroup.arrGraphicObjects.length; ++_shape_index) {
        this.graphicObjects[_shape_index] = this.originalGroup.arrGraphicObjects[_shape_index].createObjectForDrawOnOverlayInGroup();
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
        for (var _shape_index = 0; _shape_index < this.graphicObjects.length; ++_shape_index) {
            this.graphicObjects[_shape_index].pageIndex = pageIndex;
            this.graphicObjects[_shape_index].calculateFullTransform(this.transformMatrix);
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
        var max_x, min_x, max_y, min_y;
        max_x = t.TransformPointX(0, 0);
        min_x = max_x;
        max_y = t.TransformPointY(0, 0);
        min_y = max_y;
        var or_sp = this.originalGroup;
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
        for (var i = 0; i < arr.length; ++i) {
            var p = arr[i];
            var t_x = t.TransformPointX(p.x, p.y);
            var t_y = t.TransformPointY(p.x, p.y);
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
    this.calculateTransformMatrix = function () {
        var _transform = this.transformMatrix;
        _transform.Reset();
        var _horizontal_center = this.originalGroup.absExtX * 0.5;
        var _vertical_center = this.originalGroup.absExtY * 0.5;
        global_MatrixTransformer.TranslateAppend(_transform, -_horizontal_center, -_vertical_center);
        if (this.originalGroup.absFlipH) {
            global_MatrixTransformer.ScaleAppend(_transform, -1, 1);
        }
        if (this.originalGroup.absFlipV) {
            global_MatrixTransformer.ScaleAppend(_transform, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(_transform, -this.rot);
        global_MatrixTransformer.TranslateAppend(_transform, this.originalGroup.absOffsetX, this.originalGroup.absOffsetY);
        global_MatrixTransformer.TranslateAppend(_transform, _horizontal_center, _vertical_center);
    };
    this.draw = function (overlay) {
        for (var _shape_index = 0; _shape_index < this.graphicObjects.length; ++_shape_index) {
            this.graphicObjects[_shape_index].draw(overlay);
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
    this.trackEnd = function () {
        if (this.rot !== this.originalGroup.absRot) {
            this.originalGroup.setXfrm(null, null, null, null, this.rot, null, null);
            this.originalGroup.setAbsoluteTransform(null, null, null, null, this.rot, null, null);
            this.originalGroup.recalculate();
        }
        this.boolChangePos = true;
    };
}