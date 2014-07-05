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
 function XYAdjustmentTrack(originalShape, adjIndex) {
    this.originalShape = originalShape;
    this.geometry = originalShape.spPr.geometry.createDuplicate();
    this.adjastment = this.geometry.ahXYLst[adjIndex];
    this.shapeWidth = this.originalShape.extX;
    this.shapeHeight = this.originalShape.extY;
    this.xFlag = false;
    this.yFlag = false;
    this.refX = null;
    this.refY = null;
    if (this.adjastment !== null && typeof this.adjastment === "object") {
        var _ref_x = this.adjastment.gdRefX;
        var _gd_lst = this.geometry.gdLst;
        if (typeof _ref_x === "string" && typeof _gd_lst[_ref_x] === "number" && typeof this.adjastment.minX === "number" && typeof this.adjastment.maxX === "number") {
            _gd_lst[_ref_x] = this.adjastment.minX;
            this.geometry.Recalculate(this.shapeWidth, this.shapeHeight);
            this.minRealX = this.adjastment.posX;
            _gd_lst[_ref_x] = this.adjastment.maxX;
            this.geometry.Recalculate(this.shapeWidth, this.shapeHeight);
            this.maxRealX = this.adjastment.posX;
            this.maximalRealX = Math.max(this.maxRealX, this.minRealX);
            this.minimalRealX = Math.min(this.maxRealX, this.minRealX);
            this.minimalRealativeX = Math.min(this.adjastment.minX, this.adjastment.maxX);
            this.maximalRealativeX = Math.max(this.adjastment.minX, this.adjastment.maxX);
            if (this.maximalRealX - this.minimalRealX > 0) {
                this.coeffX = (this.adjastment.maxX - this.adjastment.minX) / (this.maxRealX - this.minRealX);
                this.xFlag = true;
            }
        }
        var _ref_y = this.adjastment.gdRefY;
        if (typeof _ref_y === "string" && typeof _gd_lst[_ref_y] === "number" && typeof this.adjastment.minY === "number" && typeof this.adjastment.maxY === "number") {
            _gd_lst[_ref_y] = this.adjastment.minY;
            this.geometry.Recalculate(this.shapeWidth, this.shapeHeight);
            this.minRealY = this.adjastment.posY;
            _gd_lst[_ref_y] = this.adjastment.maxY;
            this.geometry.Recalculate(this.shapeWidth, this.shapeHeight);
            this.maxRealY = this.adjastment.posY;
            this.maximalRealY = Math.max(this.maxRealY, this.minRealY);
            this.minimalRealY = Math.min(this.maxRealY, this.minRealY);
            this.minimalRealativeY = Math.min(this.adjastment.minY, this.adjastment.maxY);
            this.maximalRealativeY = Math.max(this.adjastment.minY, this.adjastment.maxY);
            if (this.maximalRealY - this.minimalRealY > 0) {
                this.coeffY = (this.adjastment.maxY - this.adjastment.minY) / (this.maxRealY - this.minRealY);
                this.yFlag = true;
            }
        }
        if (this.xFlag) {
            this.refX = _ref_x;
        }
        if (this.yFlag) {
            this.refY = _ref_y;
        }
    }
    this.overlayObject = new OverlayObject(this.geometry, originalShape.extX, originalShape.extY, originalShape.brush, originalShape.pen, originalShape.transform);
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
    this.track = function (posX, posY) {
        var invert_transform = this.originalShape.invertTransform;
        var _relative_x = invert_transform.TransformPointX(posX, posY);
        var _relative_y = invert_transform.TransformPointY(posX, posY);
        var bRecalculate = false;
        if (this.xFlag) {
            var _new_x = this.adjastment.minX + this.coeffX * (_relative_x - this.minRealX);
            if (_new_x <= this.maximalRealativeX && _new_x >= this.minimalRealativeX) {
                if (this.geometry.gdLst[this.adjastment.gdRefX] !== _new_x) {
                    bRecalculate = true;
                }
                this.geometry.gdLst[this.adjastment.gdRefX] = _new_x;
            } else {
                if (_new_x > this.maximalRealativeX) {
                    if (this.geometry.gdLst[this.adjastment.gdRefX] !== this.maximalRealativeX) {
                        bRecalculate = true;
                    }
                    this.geometry.gdLst[this.adjastment.gdRefX] = this.maximalRealativeX;
                } else {
                    if (this.geometry.gdLst[this.adjastment.gdRefX] !== this.minimalRealativeX) {
                        bRecalculate = true;
                    }
                    this.geometry.gdLst[this.adjastment.gdRefX] = this.minimalRealativeX;
                }
            }
        }
        if (this.yFlag) {
            var _new_y = this.adjastment.minY + this.coeffY * (_relative_y - this.minRealY);
            if (_new_y <= this.maximalRealativeY && _new_y >= this.minimalRealativeY) {
                if (this.geometry.gdLst[this.adjastment.gdRefY] !== _new_y) {
                    bRecalculate = true;
                }
                this.geometry.gdLst[this.adjastment.gdRefY] = _new_y;
            } else {
                if (_new_y > this.maximalRealativeY) {
                    if (this.geometry.gdLst[this.adjastment.gdRefY] !== this.maximalRealativeY) {
                        bRecalculate = true;
                    }
                    this.geometry.gdLst[this.adjastment.gdRefY] = this.maximalRealativeY;
                } else {
                    if (this.geometry.gdLst[this.adjastment.gdRefY] !== this.minimalRealativeY) {
                        bRecalculate = true;
                    }
                    this.geometry.gdLst[this.adjastment.gdRefY] = this.minimalRealativeY;
                }
            }
        }
        if (bRecalculate) {
            this.geometry.Recalculate(this.shapeWidth, this.shapeHeight);
        }
    };
    this.trackEnd = function () {
        this.originalShape.setAdjustmentValue(this.refX, this.geometry.gdLst[this.adjastment.gdRefX], this.refY, this.geometry.gdLst[this.adjastment.gdRefY]);
    };
}
function PolarAdjustmentTrack(originalShape, adjIndex) {
    this.originalShape = originalShape;
    this.geometry = originalShape.spPr.geometry.createDuplicate();
    this.adjastment = this.geometry.ahPolarLst[adjIndex];
    this.shapeWidth = this.originalShape.extX;
    this.shapeHeight = this.originalShape.extY;
    this.radiusFlag = false;
    this.angleFlag = false;
    this.refR = null;
    this.refAng = null;
    if (this.adjastment !== null && typeof this.adjastment === "object") {
        var _ref_r = this.adjastment.gdRefR;
        var _gd_lst = this.geometry.gdLst;
        if (typeof _ref_r === "string" && typeof _gd_lst[_ref_r] === "number" && typeof this.adjastment.minR === "number" && typeof this.adjastment.maxR === "number") {
            _gd_lst[_ref_r] = this.adjastment.minR;
            this.geometry.Recalculate(this.shapeWidth, this.shapeHeight);
            var _dx = this.adjastment.posX - this.shapeWidth * 0.5;
            var _dy = this.adjastment.posY - this.shapeWidth * 0.5;
            this.minRealR = Math.sqrt(_dx * _dx + _dy * _dy);
            _gd_lst[_ref_r] = this.adjastment.maxR;
            this.geometry.Recalculate(this.shapeWidth, this.shapeHeight);
            _dx = this.adjastment.posX - this.shapeWidth * 0.5;
            _dy = this.adjastment.posY - this.shapeHeight * 0.5;
            this.maxRealR = Math.sqrt(_dx * _dx + _dy * _dy);
            this.maximalRealRadius = Math.max(this.maxRealR, this.minRealR);
            this.minimalRealRadius = Math.min(this.maxRealR, this.minRealR);
            this.minimalRealativeRadius = Math.min(this.adjastment.minR, this.adjastment.maxR);
            this.maximalRealativeRadius = Math.max(this.adjastment.minR, this.adjastment.maxR);
            if (this.maximalRealRadius - this.minimalRealRadius > 0) {
                this.coeffR = (this.adjastment.maxR - this.adjastment.minR) / (this.maxRealR - this.minRealR);
                this.radiusFlag = true;
            }
        }
        var _ref_ang = this.adjastment.gdRefAng;
        if (typeof _ref_ang === "string" && typeof _gd_lst[_ref_ang] === "number" && typeof this.adjastment.minAng === "number" && typeof this.adjastment.maxAng === "number") {
            this.angleFlag = true;
            this.minimalAngle = Math.min(this.adjastment.minAng, this.adjastment.maxAng);
            this.maximalAngle = Math.max(this.adjastment.minAng, this.adjastment.maxAng);
        }
        if (this.radiusFlag) {
            this.refR = _ref_r;
        }
        if (this.angleFlag) {
            this.refAng = _ref_ang;
        }
    }
    this.overlayObject = new OverlayObject(this.geometry, this.originalShape.extX, this.originalShape.extY, this.originalShape.brush, this.originalShape.pen, this.originalShape.transform);
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
    this.track = function (posX, posY) {
        var _temp_x = posX - this.xLT;
        var _temp_y = posY - this.yLT;
        var _sin = this.sin;
        var _cos = this.cos;
        var invert_transform = this.originalShape.invertTransform;
        var _relative_x = invert_transform.TransformPointX(posX, posY);
        var _relative_y = invert_transform.TransformPointY(posX, posY);
        var _pos_x_relative_center = _relative_x - this.shapeHeight * 0.5;
        var _pos_y_relative_center = _relative_y - this.shapeWidth * 0.5;
        if (this.radiusFlag) {
            var _radius = Math.sqrt(_pos_x_relative_center * _pos_x_relative_center + _pos_y_relative_center * _pos_y_relative_center);
            var _new_radius = this.adjastment.minR + this.coeffR * (_radius - this.minRealR);
            if (_new_radius <= this.maximalRealativeRadius && _new_radius >= this.minimalRealativeRadius) {
                this.geometry.gdLst[this.adjastment.gdRefR] = _new_radius;
            } else {
                if (_new_radius > this.maximalRealativeRadius) {
                    this.geometry.gdLst[this.adjastment.gdRefR] = this.maximalRealativeRadius;
                } else {
                    this.geometry.gdLst[this.adjastment.gdRefR] = this.minimalRealativeRadius;
                }
            }
        }
        if (this.angleFlag) {
            var _angle = Math.atan2(_pos_y_relative_center, _pos_x_relative_center);
            while (_angle < 0) {
                _angle += 2 * Math.PI;
            }
            while (_angle >= 2 * Math.PI) {
                _angle -= 2 * Math.PI;
            }
            _angle *= cToDeg;
            if (_angle >= this.minimalAngle && _angle <= this.maximalAngle) {
                this.geometry.gdLst[this.adjastment.gdRefAng] = _angle;
            } else {
                if (_angle >= this.maximalAngle) {
                    this.geometry.gdLst[this.adjastment.gdRefAng] = this.maximalAngle;
                } else {
                    if (_angle <= this.minimalAngle) {
                        this.geometry.gdLst[this.adjastment.gdRefAng] = this.minimalAngle;
                    }
                }
            }
        }
        this.geometry.Recalculate(this.shapeWidth, this.shapeHeight);
    };
    this.trackEnd = function () {
        this.originalShape.setAdjustmentValue(this.refR, this.geometry.gdLst[this.adjastment.gdRefR], this.refAng, this.geometry.gdLst[this.adjastment.gdRefAng]);
    };
}