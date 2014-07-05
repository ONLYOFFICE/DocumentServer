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
 function CTrackPolarAdjObject(originalShape, adjIndex, pageIndex) {
    this.originalShape = originalShape;
    this.adjIndex = adjIndex;
    this.pageIndex = pageIndex;
    this.transformMatrix = originalShape.transformMatrix;
    this.geometry = originalShape.spPr.geometry.createDuplicate();
    this.adjastment = this.geometry.ahPolarLst[adjIndex];
    this.shapeWidth = this.originalShape.absExtX;
    this.shapeHeight = this.originalShape.absExtY;
    this.shapeCentrX = this.shapeWidth * 0.5;
    this.shapeCentrY = this.shapeHeight * 0.5;
    this.flipH = this.originalShape.absFlipH;
    this.flipV = this.originalShape.absFlipV;
    this.sin = Math.sin(this.originalShape.absRot);
    this.cos = Math.cos(this.originalShape.absRot);
    this.xLT = -this.shapeCentrX * this.cos + this.shapeCentrY * this.sin + this.originalShape.absOffsetX + this.shapeCentrX;
    this.yLT = -this.shapeCentrX * this.sin - this.shapeCentrY * this.cos + this.originalShape.absOffsetY + this.shapeCentrY;
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
            var _dx = this.adjastment.posX - this.shapeCentrX;
            var _dy = this.adjastment.posY - this.shapeCentrY;
            this.minRealR = Math.sqrt(_dx * _dx + _dy * _dy);
            _gd_lst[_ref_r] = this.adjastment.maxR;
            this.geometry.Recalculate(this.shapeWidth, this.shapeHeight);
            _dx = this.adjastment.posX - this.shapeCentrX;
            _dy = this.adjastment.posY - this.shapeCentrY;
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
    this.objectForOverlay = new ObjectForShapeDrawer(this.geometry, this.originalShape.absExtX, this.originalShape.absExtY, this.originalShape.brush, this.originalShape.pen, this.originalShape.transform);
    this.draw = function (overlay) {
        overlay.SetCurrentPage(this.pageIndex);
        overlay.transform3(this.originalShape.transform);
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
    this.track = function (posX, posY) {
        var _temp_x = posX - this.xLT;
        var _temp_y = posY - this.yLT;
        var _sin = this.sin;
        var _cos = this.cos;
        var _relative_x = _temp_x * _cos + _temp_y * _sin;
        var _relative_y = -_temp_x * _sin + _temp_y * _cos;
        if (this.flipH) {
            _relative_x = this.shapeWidth - _relative_x;
        }
        if (this.flipV) {
            _relative_y = this.shapeHeight - _relative_y;
        }
        var _pos_x_relative_center = _relative_x - this.shapeCentrX;
        var _pos_y_relative_center = _relative_y - this.shapeCentrY;
        var bRecalculate = false;
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
function CTrackXYAdjObject(originalShape, adjIndex, pageIndex) {
    this.originalShape = originalShape;
    this.adjIndex = adjIndex;
    this.pageIndex = pageIndex;
    this.transformMatrix = originalShape.transformMatrix;
    this.geometry = originalShape.spPr.geometry.createDuplicate();
    this.adjastment = this.geometry.ahXYLst[adjIndex];
    this.shapeWidth = this.originalShape.absExtX;
    this.shapeHeight = this.originalShape.absExtY;
    this.shapeCentrX = this.shapeWidth * 0.5;
    this.shapeCentrY = this.shapeHeight * 0.5;
    this.flipH = this.originalShape.absFlipH;
    this.flipV = this.originalShape.absFlipV;
    this.sin = Math.sin(this.originalShape.absRot);
    this.cos = Math.cos(this.originalShape.absRot);
    this.xLT = -this.shapeCentrX * this.cos + this.shapeCentrY * this.sin + this.originalShape.absOffsetX + this.shapeCentrX;
    this.yLT = -this.shapeCentrX * this.sin - this.shapeCentrY * this.cos + this.originalShape.absOffsetY + this.shapeCentrY;
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
    this.objectForOverlay = new ObjectForShapeDrawer(this.geometry, this.originalShape.absExtX, this.originalShape.absExtY, this.originalShape.brush, this.originalShape.pen, this.originalShape.transform);
    this.draw = function (overlay) {
        overlay.SetCurrentPage(this.pageIndex);
        overlay.transform3(this.originalShape.transform);
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
    this.track = function (posX, posY) {
        var _temp_x = posX - this.xLT;
        var _temp_y = posY - this.yLT;
        var _sin = this.sin;
        var _cos = this.cos;
        var _relative_x = _temp_x * _cos + _temp_y * _sin;
        var _relative_y = -_temp_x * _sin + _temp_y * _cos;
        if (this.flipH) {
            _relative_x = this.shapeWidth - _relative_x;
        }
        if (this.flipV) {
            _relative_y = this.shapeHeight - _relative_y;
        }
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
function CTrackHandleObject(originalGraphicObject, cardDirection, pageIndex) {
    this.originalGraphicObject = originalGraphicObject;
    this.cardDirection = cardDirection;
    this.pageIndex = pageIndex;
    this.init = function () {
        this.handleNum = this.originalGraphicObject.cardDirectionToNumber(this.cardDirection);
        this.trackGraphicObject = this.originalGraphicObject.createTrackObjectForResize(this.handleNum, this.pageIndex);
    };
    this.track = function (kd1, kd2, event) {
        if (!event.CtrlKey) {
            this.trackGraphicObject.resize(kd1, kd2, event.ShiftKey);
        } else {
            this.trackGraphicObject.resizeRelativeCenter(kd1, kd2, event.ShiftKey);
        }
    };
    this.getBounds = function () {
        return this.trackGraphicObject.getBounds();
    };
    this.getBoundsRect = function () {
        return this.trackGraphicObject.getBoundsRect();
    };
    this.draw = function (graphics) {
        this.trackGraphicObject.draw(graphics);
    };
    this.trackEnd = function () {
        this.trackGraphicObject.endTrack();
    };
}
function CTrackRotateObject(graphicObject, pageIndex) {
    this.originalGraphicObject = graphicObject;
    this.trackObject = null;
    this.pageIndex = pageIndex;
    this.init = function () {
        this.trackObject = this.originalGraphicObject.createTrackObjectForRotate(this.pageIndex);
    };
    this.modify = function (angle, shiftKey) {
        this.trackObject.track(angle, shiftKey);
    };
    this.draw = function (overlay) {
        this.trackObject.draw(overlay);
    };
    this.getBounds = function () {
        return this.trackObject.getBounds();
    };
    this.getBoundsRect = function () {
        return this.trackObject.getBoundsRect();
    };
    this.trackEnd = function () {
        this.trackObject.trackEnd();
    };
}
function CTrackMoveObject(originalGraphicObject, majorOffsetX, majorOffsetY, graphicObjects, startPageIndex) {
    this.originalGraphicObject = originalGraphicObject;
    this.majorOffsetX = majorOffsetX;
    this.majorOffsetY = majorOffsetY;
    this.graphicObjects = graphicObjects;
    this.curPageIndex = startPageIndex;
    this.trackGraphicObject = null;
    this.init = function () {
        this.trackGraphicObject = this.originalGraphicObject.createTrackObjectForMove(this.majorOffsetX, this.majorOffsetY);
    };
    this.track = function (x, y, pageIndex) {
        this.curPageIndex = pageIndex;
        this.trackGraphicObject.track(x, y, pageIndex);
    };
    this.draw = function (overlay) {
        overlay.SetCurrentPage(this.curPageIndex);
        this.trackGraphicObject.draw(overlay);
    };
    this.getBounds = function () {
        return this.trackGraphicObject.getBounds();
    };
    this.getBoundsRect = function () {
        return this.trackGraphicObject.getBoundsRect();
    };
    this.trackEnd = function (e, pageIndex) {
        this.trackGraphicObject.trackEnd(e, true);
        if (e.CtrlKey && isRealObject(this.trackGraphicObject.originalShape)) {
            this.originalGraphicObject = this.trackGraphicObject.originalShape.parent;
        } else {
            if (e.CtrlKey && isRealObject(this.trackGraphicObject.original)) {
                this.originalGraphicObject = this.trackGraphicObject.original.parent;
            }
        }
        if (this.originalGraphicObject.selected) {
            this.originalGraphicObject.select(pageIndex);
        }
    };
}
function CTrackNewObject(shape, isLinePreset, startX, startY, pageShapes, pageIndex) {
    this.originalShape = shape;
    this.isLinePreset = isLinePreset;
    this.startPosX = startX;
    this.startPosY = startY;
    this.pageShapes = pageShapes;
    this.pageIndex = pageIndex;
    this.trackShape = null;
    this.init = function () {
        this.trackShape = new NewTrackShape(this.originalShape, this.startPosX, this.startPosY, this.isLinePreset, this.pageShapes, this.pageIndex);
    };
    this.draw = function (overlay) {
        this.trackShape.draw(overlay);
    };
    this.modify = function (x, y, ctrlKey, shiftKey) {
        this.trackShape.modify(x, y, ctrlKey, shiftKey);
    };
    this.endTrack = function () {
        this.trackShape.endTrack();
    };
    this.getBounds = function () {
        return this.trackShape.getBounds();
    };
}
function CTrackNewObject2(presetGeom, pen, brush, startX, startY, pageIndex) {
    this.presetGeom = presetGeom;
    this.startPosX = startX;
    this.startPosY = startY;
    this.pageIndex = pageIndex;
    this.geometry = null;
    this.checkLine = CheckLinePreset(presetGeom);
    this.objectForOverlay = null;
    this.pen = pen;
    this.brush = brush;
    this.flipH = null;
    this.flipV = null;
    this.posX = null;
    this.posY = null;
    this.absExtX = null;
    this.absExtY = null;
    this.transformMatrix = null;
    this.presetGeom = presetGeom;
    this.propCoefficient = typeof SHAPE_ASPECTS[presetGeom] === "number" ? SHAPE_ASPECTS[presetGeom] : 1;
    this.invPropCoefficient = 1 / this.propCoefficient;
    this.init = function (x, y) {
        if (this.startX < x) {
            this.posX = this.startPosX;
            if (x - this.startX > MIN_SHAPE_SIZE || this.checkLine) {
                this.absExtX = x - this.startX;
            } else {
                this.absExtX = MIN_SHAPE_SIZE;
            }
            this.flipH = false;
        } else {
            if (this.startX - x > MIN_SHAPE_SIZE || this.checkLine) {
                this.absExtX = this.startX - x;
            } else {
                this.absExtX = MIN_SHAPE_SIZE;
            }
            this.posX = this.startX - this.absExtX;
            this.flipH = this.checkLine;
        }
        if (this.startY < y) {
            this.posY = this.startPosY;
            if (y - this.startY > MIN_SHAPE_SIZE || this.checkLine) {
                this.absExtY = y - this.startY;
            } else {
                this.absExtY = MIN_SHAPE_SIZE;
            }
            this.flipV = false;
        } else {
            if (this.startY - y > MIN_SHAPE_SIZE || this.checkLine) {
                this.absExtY = this.startY - y;
            } else {
                this.absExtY = MIN_SHAPE_SIZE;
            }
            this.posY = this.startY - this.absExtY;
            this.flipV = this.checkLine;
        }
        this.geometry = CreateGeometry(this.presetGeom);
        this.geometry.Init(this.absExtX, this.absExtY);
        this.transformMatrix = new CMatrix();
        this.calculateTransform();
        this.objectForOverlay = new ObjectForShapeDrawer(this.geometry, this.absExtX, this.absExtY, this.brush, this.pen, this.transformMatrix);
    };
    this.modify = function (x, y, ctrlKey, shiftKey) {
        var _finished_x = x,
        _finished_y = y;
        var _real_dist_x = _finished_x - this.startPosX;
        var _abs_dist_x = Math.abs(_real_dist_x);
        var _real_dist_y = _finished_y - this.startPosY;
        var _abs_dist_y = Math.abs(_real_dist_y);
        if ((!ctrlKey && !shiftKey) || (this.checkLine && !shiftKey)) {
            if (_real_dist_x >= 0) {
                this.posX = this.startPosX;
                this.flipH = false;
            } else {
                this.posX = _abs_dist_x >= MIN_SHAPE_SIZE || this.checkLine ? x : this.startPosX - MIN_SHAPE_SIZE;
                if (this.checkLine) {
                    this.flipH = true;
                }
            }
            if (_real_dist_y >= 0) {
                this.posY = this.startPosY;
                this.flipV = false;
            } else {
                this.posY = _abs_dist_y >= MIN_SHAPE_SIZE || this.checkLine ? y : this.startPosY - MIN_SHAPE_SIZE;
                if (this.checkLine) {
                    this.flipV = true;
                }
            }
            this.absExtX = _abs_dist_x >= MIN_SHAPE_SIZE || this.checkLine ? _abs_dist_x : MIN_SHAPE_SIZE;
            this.absExtY = _abs_dist_y >= MIN_SHAPE_SIZE || this.checkLine ? _abs_dist_y : MIN_SHAPE_SIZE;
            this.geometry.Recalculate(this.absExtX, this.absExtY);
        } else {
            if (ctrlKey && !shiftKey) {
                if (_abs_dist_x >= MIN_SHAPE_SIZE_DIV2) {
                    this.posX = this.startPosX - _abs_dist_x;
                    this.absExtX = 2 * _abs_dist_x;
                } else {
                    this.posX = this.startPosX - MIN_SHAPE_SIZE_DIV2;
                    this.absExtX = MIN_SHAPE_SIZE;
                }
                if (_abs_dist_y >= MIN_SHAPE_SIZE_DIV2) {
                    this.posY = this.startPosY - _abs_dist_y;
                    this.absExtY = 2 * _abs_dist_y;
                } else {
                    this.posY = this.startPosY - MIN_SHAPE_SIZE_DIV2;
                    this.absExtY = MIN_SHAPE_SIZE;
                }
                this.geometry.Recalculate(this.absExtX, this.absExtY);
            } else {
                if (!ctrlKey && shiftKey) {
                    var _new_aspect;
                    var _new_width, _new_height;
                    if (this.checkLine) {} else {
                        _new_aspect = _abs_dist_x / _abs_dist_y;
                        if (_new_aspect >= this.propCoefficient) {
                            _new_width = _abs_dist_x;
                            _new_height = _abs_dist_x * this.invPropCoefficient;
                        } else {
                            _new_height = _real_dist_y;
                            _new_width = _real_dist_y * this.propCoefficient;
                        }
                        this.absExtX = _new_width;
                        this.absExtY = _new_height;
                        if (_real_dist_x >= 0) {
                            this.posX = this.startPosX;
                        } else {
                            this.posX = this.startPosX - this.absExtX;
                        }
                        if (_real_dist_y >= 0) {
                            this.posY = this.startPosY;
                        } else {
                            this.posY = this.startPosY - this.absExtY;
                        }
                    }
                    this.geometry.Recalculate(this.absExtX, this.absExtY);
                } else {
                    if (ctrlKey && shiftKey) {}
                }
            }
        }
        this.extX = this.absExtX;
        this.extY = this.absExtY;
        this.calculateTransform();
    };
    this.calculateTransform = function () {
        var _new_transform = this.transformMatrix;
        _new_transform.Reset();
        if (this.flipH || this.flipV) {
            var _horizontal_center = this.absExtX * 0.5;
            var _vertical_center = this.absExtY * 0.5;
            _new_transform.Translate(-_horizontal_center, -_vertical_center, MATRIX_ORDER_APPEND);
            if (this.flipH) {
                global_MatrixTransformer.ScaleAppend(_new_transform, -1, 1);
            }
            if (this.flipV) {
                global_MatrixTransformer.ScaleAppend(_new_transform, 1, -1);
            }
            _new_transform.Translate(_horizontal_center, _vertical_center, MATRIX_ORDER_APPEND);
        }
        _new_transform.Translate(this.posX, this.posY, MATRIX_ORDER_APPEND);
        this.transformMatrix = _new_transform;
    };
    this.endTrack = function () {};
    this.draw = function (overlay) {
        overlay.SetCurrentPage(this.pageIndex);
        overlay.transform3(this.transformMatrix);
        this.objectForOverlay.updateTransform(this.absExtX, this.absExtY, this.transformMatrix);
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
}
function CTrackMoveObjectInGroup(originalObject, majorOffsetX, majorOffsetY) {
    this.originalObject = originalObject;
    this.majorOffsetX = -majorOffsetX;
    this.majorOffsetY = -majorOffsetY;
    this.trackObject = null;
    this.init = function () {
        this.trackObject = this.originalObject.createTrackObjectForMoveInGroup(this.majorOffsetX, this.majorOffsetY);
    };
    this.track = function (posX, posY) {
        this.trackObject.track(posX, posY);
    };
    this.draw = function (overlay) {
        this.trackObject.draw(overlay);
    };
    this.trackEnd = function () {
        this.trackObject.trackEnd();
    };
    this.getBounds = function () {
        return this.trackObject.getBounds();
    };
}
function MoveTrackInGroup(original) {
    this.original = original;
    var xfrm = original.spPr.xfrm;
    this.x = xfrm.absExtX;
    this.y = xfrm.absExtY;
    this.startX = xfrm.offX;
    this.startY = xfrm.offY;
    this.transform = original.transform.CreateDublicate();
    this.geometry = original.spPr.geometry;
    if (typeof CChartAsGroup != "undefined" && original instanceof CChartAsGroup) {
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
        this.pen = original.pen;
        this.brush = original.brush;
    }
    this.objectForOverlay = new ObjectForShapeDrawer(this.geometry, xfrm.absExtX, xfrm.absExtY, this.brush, this.pen, this.transform);
    this.inv = global_MatrixTransformer.Invert(original.group.transform);
    this.draw = function (overlay) {
        overlay.SetCurrentPage(this.original.pageIndex);
        overlay.transform3(this.transform);
        var shape_drawer = new CShapeDrawer();
        shape_drawer.fromShape2(this.objectForOverlay, overlay, this.geometry);
        shape_drawer.draw(this.geometry);
    };
    this.track = function (stX, stY, x, y) {
        var st_x_t = this.inv.TransformPointX(stX, stY);
        var st_y_t = this.inv.TransformPointY(stX, stY);
        var x_t = this.inv.TransformPointX(x, y);
        var y_t = this.inv.TransformPointY(x, y);
        this.x = this.startX + x_t - st_x_t;
        this.y = this.startY + y_t - st_y_t;
        this.calculateTransform();
    };
    this.calculateTransform = function () {
        var t = this.transform;
        t.Reset();
        var xfrm = this.original.spPr.xfrm;
        global_MatrixTransformer.TranslateAppend(t, -xfrm.extX * 0.5, -xfrm.extY * 0.5);
        if (xfrm.flipH == null ? false : xfrm.flipH) {
            global_MatrixTransformer.ScaleAppend(t, -1, 1);
        }
        if (xfrm.flipV == null ? false : xfrm.flipV) {
            global_MatrixTransformer.ScaleAppend(t, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(t, xfrm.rot == null ? 0 : -xfrm.rot);
        global_MatrixTransformer.TranslateAppend(t, this.x + xfrm.extX * 0.5, this.y + xfrm.extY * 0.5);
        global_MatrixTransformer.MultiplyAppend(t, this.original.group.transform);
    };
    this.trackEnd = function (e) {
        if (isRealObject(e) && e.CtrlKey) {
            var para_drawing = new ParaDrawing(10, 10, null, editor.WordControl.m_oLogicDocument.DrawingDocument, null, null);
            var copy = this.original.copy(null, this.original.group);
            History.Add(copy, {
                Type: historyitem_CalculateAfterCopyInGroup
            });
            this.original.group.addGraphicObject(copy);
            copy.calculateAfterOpen();
            copy.setXfrm(this.x, this.y, null, null, null, null, null);
            copy.setAbsoluteTransform(this.x, this.y, null, null, null, null, null);
            para_drawing.Set_GraphicObject(copy);
        } else {
            this.original.setXfrm(this.x, this.y, null, null, null, null, null);
            this.original.setAbsoluteTransform(this.x, this.y, null, null, null, null, null);
        }
    };
}
function ObjectForShapeDrawer(geometry, extX, extY, brush, pen, transform) {
    this.geometry = geometry;
    this.ext = {};
    this.ext.cx = extX;
    this.ext.cy = extY;
    this.brush = brush;
    this.pen = pen;
    this.TransformMatrix = transform;
    this.updateTransform = function (extX, extY, transform) {
        this.ext.cx = extX;
        this.ext.cy = extY;
        this.transform = transform;
    };
    this.check_bounds = function (boundsChecker) {
        if (this.geometry) {
            this.geometry.check_bounds(boundsChecker);
        } else {
            boundsChecker._s();
            boundsChecker._m(0, 0);
            boundsChecker._l(this.ext.cx, 0);
            boundsChecker._l(this.ext.cx, this.ext.cy);
            boundsChecker._l(0, this.ext.cy);
            boundsChecker._z();
            boundsChecker._e();
        }
    };
}
function MoveTitleInChart(originalObject) {
    this.originalObject = originalObject;
    this.x = null;
    this.y = null;
    this.transform = new CMatrix();
    var pen = new CLn();
    pen.Fill = new CUniFill();
    pen.Fill.fill = new CSolidFill();
    pen.Fill.fill.color = new CUniColor();
    pen.Fill.fill.color.color = new CRGBColor();
    this.overlayObject = new OverlayObject(this.originalObject.spPr.geometry, this.originalObject.extX, this.originalObject.extY, this.originalObject.brush, pen, this.transform);
    this.inv = global_MatrixTransformer.Invert(originalObject.chartGroup.transform);
    this.inv.tx = 0;
    this.inv.ty = 0;
    this.pageIndex = 0;
    this.draw = function (overlay) {
        this.overlayObject.draw(overlay, this.pageIndex);
    };
    this.track = function (dx, dy, pageIndex) {
        var dx_t = this.inv.TransformPointX(dx, dy);
        var dy_t = this.inv.TransformPointY(dx, dy);
        this.x = this.originalObject.x + dx_t;
        this.y = this.originalObject.y + dy_t;
        if (this.x + this.originalObject.extX > this.originalObject.chartGroup.absExtX) {
            this.x = this.originalObject.chartGroup.absExtX - this.originalObject.extX;
        }
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.y + this.originalObject.extY > this.originalObject.chartGroup.absExtY) {
            this.y = this.originalObject.chartGroup.absExtY - this.originalObject.extY;
        }
        if (this.y < 0) {
            this.y = 0;
        }
        this.pageIndex = pageIndex;
        this.calculateTransform();
    };
    this.getOriginalBoundsRect = function () {
        return this.originalObject.getRectBounds();
    };
    this.calculateTransform = function () {
        var t = this.transform;
        t.Reset();
        global_MatrixTransformer.TranslateAppend(t, -this.originalObject.extX * 0.5, -this.originalObject.extY * 0.5);
        global_MatrixTransformer.TranslateAppend(t, this.x + this.originalObject.extX * 0.5, this.y + this.originalObject.extY * 0.5);
        global_MatrixTransformer.MultiplyAppend(t, this.originalObject.chartGroup.getTransform());
    };
    this.trackEnd = function () {
        History.Add(this.originalObject.chartGroup, {
            Type: historyitem_AutoShapes_RecalculateChartUndo
        });
        this.originalObject.setPosition(this.x, this.y);
        this.originalObject.chartGroup.recalculate();
        History.Add(this.originalObject.chartGroup, {
            Type: historyitem_AutoShapes_RecalculateChartRedo
        });
    };
}
function MoveTrackChart(originalObject) {
    this.originalObject = originalObject;
    this.transform = new CMatrix();
    this.x = null;
    this.y = null;
    var geometry = CreateGeometry("rect");
    geometry.Init(this.originalObject.absExtX, this.originalObject.absExtY);
    geometry.Recalculate(this.originalObject.absExtX, this.originalObject.absExtY);
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
    this.overlayObject = new OverlayObject(this.originalObject.spPr.geometry, this.originalObject.absExtX, this.originalObject.absExtY, brush, pen, this.transform);
    this.getOriginalBoundsRect = function () {
        return this.originalObject.getRectBounds();
    };
    this.track = function (dx, dy) {
        var original = this.originalObject;
        this.x = original.x + dx;
        this.y = original.y + dy;
        this.transform.Reset();
        var hc = original.absExtX * 0.5;
        var vc = original.absExtY * 0.5;
        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);
        global_MatrixTransformer.TranslateAppend(this.transform, this.x + hc, this.y + vc);
    };
    this.draw = function (overlay) {
        this.overlayObject.draw(overlay);
    };
    this.trackEnd = function () {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.originalObject.Id, new UndoRedoDataShapeRecalc()), null);
        this.originalObject.x = this.x;
        this.originalObject.y = this.y;
        this.originalObject.updateDrawingBaseCoordinates();
        this.originalObject.setPosition(this.x, this.y);
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.originalObject.Id, new UndoRedoDataShapeRecalc()), null);
        this.originalObject.recalculateTransform();
        this.originalObject.calculateTransformTextMatrix();
    };
}
function OverlayObject(geometry, extX, extY, brush, pen, transform) {
    this.geometry = geometry;
    this.ext = {};
    this.ext.cx = extX;
    this.ext.cy = extY;
    this.brush = brush;
    this.pen = pen;
    this.TransformMatrix = transform;
    this.shapeDrawer = new CShapeDrawer();
    this.updateTransform = function (extX, extY, transform) {
        this.ext.cx = extX;
        this.ext.cy = extY;
        this.transform = transform;
    };
    this.updateExtents = function (extX, extY) {
        this.ext.cx = extX;
        this.ext.cy = extY;
        this.geometry.Recalculate(extX, extY);
    };
    this.updateTransformMatrix = function (transform) {
        this.TransformMatrix = transform;
    };
    this.draw = function (overlay, pageIndex) {
        overlay.SetCurrentPage(pageIndex);
        overlay.SaveGrState();
        overlay.SetIntegerGrid(false);
        overlay.transform3(this.TransformMatrix, false);
        this.shapeDrawer.fromShape2(this, overlay, this.geometry);
        this.shapeDrawer.draw(this.geometry);
        overlay.RestoreGrState();
    };
    this.check_bounds = function (boundsChecker) {
        if (this.geometry) {
            this.geometry.check_bounds(boundsChecker);
        } else {
            boundsChecker._s();
            boundsChecker._m(0, 0);
            boundsChecker._l(this.ext.cx, 0);
            boundsChecker._l(this.ext.cx, this.ext.cy);
            boundsChecker._l(0, this.ext.cy);
            boundsChecker._z();
            boundsChecker._e();
        }
    };
}