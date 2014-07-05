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
 var WRAP_TEXT_SIDE_BOTH_SIDES = 0;
var WRAP_TEXT_SIDE_LARGEST = 1;
var WRAP_TEXT_SIDE_LEFT = 2;
var WRAP_TEXT_SIDE_RIGHT = 3;
var APPROXIMATE_ANGLE = 0.3;
function CWrapPolygon(wordGraphicObject) {
    this.wordGraphicObject = wordGraphicObject;
    this.arrPoints = [];
    this.relativeArrPoints = [];
    this.wrapSide = WRAP_TEXT_SIDE_BOTH_SIDES;
    this.distL = 2.54;
    this.distR = 2.54;
    this.distT = 2.54;
    this.distB = 2.54;
    this.left = null;
    this.top = null;
    this.right = null;
    this.bottom = null;
    this.rightField = X_Right_Field;
    this.leftField = X_Left_Field;
    this.rect_flag = false;
    this.edited = false;
    g_oTableId.Add(this, g_oIdCounter.Get_NewId());
}
CWrapPolygon.prototype = {
    Get_Id: function () {
        return this.Id;
    },
    writeToBinaryForCopyPaste: function (w) {
        w.WriteBool(this.edited);
        w.WriteLong(this.wrapSide);
        w.WriteLong(this.relativeArrPoints.length);
        for (var i = 0; i < this.relativeArrPoints.length; ++i) {
            w.WriteDouble(this.relativeArrPoints[i].x);
            w.WriteDouble(this.relativeArrPoints[i].y);
        }
    },
    readFromBinaryForCopyPaste: function (r) {
        this.edited = r.GetBool();
        this.wrapSide = r.GetLong();
        var count = r.GetLong();
        for (var i = 0; i < count; ++i) {
            this.relativeArrPoints[i] = {};
            this.relativeArrPoints[i].x = r.GetDouble();
            this.relativeArrPoints[i].y = r.GetDouble();
        }
    },
    Write_ToBinary2: function (writer) {
        writer.WriteLong(historyitem_type_WrapPolygon);
        writer.WriteString2(this.wordGraphicObject.Get_Id());
        writer.WriteString2(this.Get_Id());
    },
    Read_FromBinary2: function (reader) {
        var link_data = {};
        link_data.wordGraphicObject = reader.GetString2();
        this.Id = reader.GetString2();
        CollaborativeEditing.Add_NewObject(this);
        CollaborativeEditing.Add_LinkData(this, link_data);
    },
    Load_LinkData: function (data) {
        this.wordGraphicObject = g_oTableId.Get_ById(data.wordGraphicObject);
        if (this.wordGraphicObject != null) {
            this.wordGraphicObject.wrappingPolygon = this;
        }
    },
    getIntersection: function (y) {
        var min_x = null;
        var max_x = null;
        var cur_max_x;
        var cur_min_x;
        var point_count = this.arrPoints.length;
        for (var point_index = 1; point_index < point_count; ++point_index) {
            var point0 = this.arrPoints[point_index - 1];
            var point1 = this.arrPoints[point_index];
            if (! (point0.y > y && point1.y > y || point0.y < y && point1.y < y)) {
                if (point0.y === point1.y) {
                    cur_max_x = Math.max(point0.x, point1.x);
                    cur_min_x = Math.min(point0.x, point1.x);
                } else {
                    if (point0.x === point1.x) {
                        cur_max_x = point0.x;
                        cur_min_x = point0.x;
                    } else {
                        cur_max_x = ((y - point0.y) / (point1.y - point0.y)) * (point1.x - point0.x) + point0.x;
                        cur_min_x = cur_max_x;
                    }
                }
                if (max_x === null) {
                    max_x = cur_max_x;
                    min_x = cur_min_x;
                } else {
                    if (cur_max_x > max_x) {
                        max_x = cur_max_x;
                    }
                    if (cur_min_x < min_x) {
                        min_x = cur_min_x;
                    }
                }
            }
        }
        point0 = this.arrPoints[point_count - 1];
        point1 = this.arrPoints[0];
        if (! (point0.y > y && point1.y > y || point0.y < y && point1.y < y)) {
            if (point0.y === point1.y) {
                cur_max_x = Math.max(point0.x, point1.x);
                cur_min_x = Math.min(point0.x, point1.x);
            } else {
                if (point0.x === point1.x) {
                    cur_max_x = point0.x;
                    cur_min_x = point0.x;
                } else {
                    cur_max_x = ((y - point0.y) / (point1.y - point0.y)) * (point1.x - point0.x) + point0.x;
                    cur_min_x = cur_max_x;
                }
            }
            if (max_x === null) {
                max_x = cur_max_x;
                min_x = cur_min_x;
            } else {
                if (cur_max_x > max_x) {
                    max_x = cur_max_x;
                }
                if (cur_min_x < min_x) {
                    min_x = cur_min_x;
                }
            }
        }
        return {
            max: max_x,
            min: min_x
        };
    },
    getArrayWrapIntervals: function (x0, y0, x1, y1, LeftField, RightField, ret) {
        if (y1 < this.top || y0 > this.bottom) {
            return ret;
        }
        var ret2 = [];
        switch (this.wordGraphicObject.wrappingType) {
        case WRAPPING_TYPE_NONE:
            return ret;
        case WRAPPING_TYPE_SQUARE:
            switch (this.wrapSide) {
            case WRAP_TEXT_SIDE_BOTH_SIDES:
                ret2.push({
                    X0: this.left,
                    X1: this.right,
                    Y1: y1
                });
                break;
            case WRAP_TEXT_SIDE_LARGEST:
                if (this.rightField - this.right > 0 && this.rightField - this.right > this.left - this.leftField) {
                    ret2.push({
                        X0: this.leftField,
                        X1: this.right,
                        Y1: this.bottom
                    });
                } else {
                    if (this.left - this.leftField > 0 && this.left - this.leftField > this.rightField - this.right) {
                        ret2.push({
                            X0: this.left,
                            X1: this.rightField,
                            Y1: this.bottom
                        });
                    }
                }
                break;
            case WRAP_TEXT_SIDE_LEFT:
                if (this.left > this.leftField) {
                    ret2.push({
                        X0: this.left,
                        X1: this.rightField,
                        Y1: this.bottom
                    });
                }
                break;
            case WRAP_TEXT_SIDE_RIGHT:
                if (this.right < this.rightField) {
                    ret2.push({
                        X0: this.leftField,
                        X1: this.right,
                        Y1: this.bottom
                    });
                }
                break;
            }
            break;
        case WRAPPING_TYPE_TOP_AND_BOTTOM:
            ret2.push({
                X0: x0,
                X1: x1,
                Y1: this.bottom
            });
            break;
        case WRAPPING_TYPE_THROUGH:
            case WRAPPING_TYPE_TIGHT:
            var intersection_top = this.getIntersection(y0);
            var intersection_bottom = this.getIntersection(y1);
            var max_x = null;
            var min_x = null;
            if (intersection_top.max !== null) {
                max_x = intersection_top.max;
            }
            if (intersection_top.min !== null) {
                min_x = intersection_top.min;
            }
            if (intersection_bottom.max !== null) {
                if (max_x === null) {
                    max_x = intersection_bottom.max;
                } else {
                    if (intersection_bottom.max > max_x) {
                        max_x = intersection_bottom.max;
                    }
                }
            }
            if (intersection_bottom.min !== null) {
                if (min_x === null) {
                    min_x = intersection_bottom.min;
                } else {
                    if (intersection_bottom.min < min_x) {
                        min_x = intersection_bottom.min;
                    }
                }
            }
            var arr_points = this.arrPoints;
            var point_count = arr_points.length;
            var between_flag = false;
            for (var point_index = 0; point_index < point_count; ++point_index) {
                var cur_point = arr_points[point_index];
                if (cur_point.y > y0 && cur_point.y < y1) {
                    between_flag = true;
                    if (max_x === null) {
                        max_x = cur_point.x;
                    } else {
                        if (max_x < cur_point.x) {
                            max_x = cur_point.x;
                        }
                    }
                    if (min_x === null) {
                        min_x = cur_point.x;
                    } else {
                        if (min_x > cur_point.x) {
                            min_x = cur_point.x;
                        }
                    }
                }
            }
            if (max_x !== null && min_x !== null) {
                max_x += this.wordGraphicObject.Distance.R;
                min_x -= this.wordGraphicObject.Distance.L;
                switch (this.wrapSide) {
                case WRAP_TEXT_SIDE_BOTH_SIDES:
                    ret2.push({
                        X0: min_x,
                        X1: max_x,
                        Y1: y1
                    });
                    break;
                case WRAP_TEXT_SIDE_LARGEST:
                    if (this.rightField - max_x > 0 && this.rightField - max_x > min_x - this.leftField) {
                        ret2.push({
                            X0: this.leftField,
                            X1: max_x,
                            Y1: y1
                        });
                    } else {
                        if (min_x - this.leftField > 0 && min_x - this.leftField > this.rightField - max_x) {
                            ret2.push({
                                X0: min_x,
                                X1: this.rightField,
                                Y1: y1
                            });
                        }
                    }
                    break;
                case WRAP_TEXT_SIDE_LEFT:
                    ret2.push({
                        X0: Math.max(min_x, this.leftField),
                        X1: this.rightField,
                        Y1: y1
                    });
                    break;
                case WRAP_TEXT_SIDE_RIGHT:
                    ret2.push({
                        X0: this.leftField,
                        X1: Math.min(max_x, this.rightField),
                        Y1: y1
                    });
                    break;
                }
            }
            break;
        }
        ret2.sort(function (a, b) {
            return a.X0 - b.X0;
        });
        if (ret2.length > 0 && (this.wordGraphicObject.wrappingType === WRAPPING_TYPE_SQUARE || this.wordGraphicObject.wrappingType === WRAPPING_TYPE_TIGHT || this.wordGraphicObject.wrappingType === WRAPPING_TYPE_THROUGH)) {
            var dx = this.wordGraphicObject.wrappingType === WRAPPING_TYPE_SQUARE ? 6.35 : 3.175;
            if (ret2[0].X0 < LeftField + dx) {
                ret2[0].X0 = x0;
            }
            ret2.sort(function (a, b) {
                return a.X1 - b.X1;
            });
            if (ret2[ret2.length - 1].X1 > RightField - dx) {
                ret2[ret2.length - 1].X1 = x1;
            }
        }
        for (var s = 0; s < ret2.length; ++s) {
            ret2[s].typeLeft = this.wordGraphicObject.wrappingType;
            ret2[s].typeRight = this.wordGraphicObject.wrappingType;
        }
        for (s = 0; s < ret2.length; ++s) {
            ret.push(ret2[s]);
        }
        return ret;
    },
    isRect: function () {
        if (this.arrPoints.length === 4) {
            if (Math.abs(this.arrPoints[0].y - this.arrPoints[1].y) < 0.01 && Math.abs(this.arrPoints[1].x - this.arrPoints[2].x) < 0.01 && Math.abs(this.arrPoints[2].y - this.arrPoints[3].y) < 0.01 && Math.abs(this.arrPoints[3].x - this.arrPoints[0].x) < 0.01 || Math.abs(this.arrPoints[0].x - this.arrPoints[1].x) < 0.01 && Math.abs(this.arrPoints[1].y - this.arrPoints[2].y) < 0.01 && Math.abs(this.arrPoints[2].x - this.arrPoints[3].x) < 0.01 && Math.abs(this.arrPoints[3].y - this.arrPoints[0].y) < 0.01) {
                return true;
            }
        }
        return false;
    },
    calculate: function () {
        var arrPolygons = this.wordGraphicObject.getArrayWrapPolygons();
        var transform = this.wordGraphicObject.getTransformMatrix();
        var arrEdges = [];
        var arrPoints = [];
        var polygonsCount = arrPolygons.length;
        for (var polygon_index = 0; polygon_index < polygonsCount; ++polygon_index) {
            var cur_polygon = arrPolygons[polygon_index];
            var curLen = cur_polygon.length;
            if (curLen < 2) {
                continue;
            }
            var polygon_point0 = new CPolygonPoint();
            polygon_point0.x = transform.TransformPointX(cur_polygon[0].x, cur_polygon[0].y);
            polygon_point0.y = transform.TransformPointY(cur_polygon[0].x, cur_polygon[0].y);
            arrPoints.push(polygon_point0);
            for (var point_index = 1; point_index < curLen; ++point_index) {
                var transformed_x1 = transform.TransformPointX(cur_polygon[point_index].x, cur_polygon[point_index].y);
                var transformed_y1 = transform.TransformPointY(cur_polygon[point_index].x, cur_polygon[point_index].y);
                if (Math.abs(transformed_x1 - polygon_point0.x) < APPROXIMATE_EPSILON && Math.abs(transformed_y1 - polygon_point0.y) < APPROXIMATE_EPSILON) {
                    continue;
                }
                var _prev = polygon_point0;
                polygon_point0 = new CPolygonPoint();
                polygon_point0.x = transformed_x1;
                polygon_point0.y = transformed_y1;
                arrPoints.push(polygon_point0);
                arrEdges.push(new GraphEdge(_prev, polygon_point0));
            }
        }
        if (arrPoints.length < 2) {
            this.arrPoints.length = 0;
            this.relativeArrPoints.length = 0;
            return;
        }
        arrEdges.sort(function (a, b) {
            return Math.min(a.point1.y, a.point2.y) - Math.min(b.point1.y, b.point2.y);
        });
        arrPoints.sort(function (a, b) {
            return a.y - b.y;
        });
        for (point_index = 0; point_index < arrPoints.length; ++point_index) {
            var cur_point = arrPoints[point_index];
            for (var point_index2 = point_index + 1; point_index2 < arrPoints.length - 1; ++point_index2) {
                if (Math.abs(arrPoints[point_index2].y - cur_point.y) < APPROXIMATE_EPSILON2 && Math.abs(arrPoints[point_index2].x - cur_point.x) < APPROXIMATE_EPSILON2) {
                    arrPoints.splice(point_index2, 1);
                    --point_index2;
                } else {
                    if (Math.abs(arrPoints[point_index2].y - cur_point.y) >= APPROXIMATE_EPSILON2) {
                        break;
                    }
                }
            }
        }
        var left_path_arr = [];
        var right_path_arr = [];
        var cur_start_index = 0;
        var cur_x_min, cur_x_max;
        var cur_y;
        var x_min = null,
        x_max = null;
        var edgesCount = arrEdges.length;
        for (point_index = 0; point_index < arrPoints.length; ++point_index) {
            cur_point = arrPoints[point_index];
            cur_x_min = cur_point.x;
            cur_x_max = cur_point.x;
            cur_y = cur_point.y;
            for (var edge_index = cur_start_index; edge_index < edgesCount; ++edge_index) {
                if (arrEdges[edge_index].point2.y >= cur_y) {
                    cur_start_index = edge_index;
                    break;
                }
            }
            for (edge_index = cur_start_index; edge_index < edgesCount; ++edge_index) {
                var cur_edge = arrEdges[edge_index];
                var inter = cur_edge.getIntersectionPointX(cur_y);
                if (inter != null) {
                    if (inter.count == 1) {
                        if (inter.x1 < cur_x_min) {
                            cur_x_min = inter.x1;
                        }
                        if (inter.x1 > cur_x_max) {
                            cur_x_max = inter.x1;
                        }
                    } else {
                        if (inter.x1 < cur_x_min) {
                            cur_x_min = inter.x1;
                        }
                        if (inter.x2 > cur_x_max) {
                            cur_x_max = inter.x2;
                        }
                    }
                }
            }
            if (cur_x_max <= cur_x_min) {
                var t_min, t_max;
                t_min = Math.min(cur_x_min, cur_x_max) - 2;
                t_max = Math.max(cur_x_min, cur_x_max) + 2;
                cur_x_max = t_max;
                cur_x_min = t_min;
            }
            left_path_arr.push({
                x: cur_x_min,
                y: cur_y
            });
            right_path_arr.push({
                x: cur_x_max,
                y: cur_y
            });
            if (x_max === null) {
                x_max = cur_x_max;
            } else {
                if (cur_x_max > x_max) {
                    x_max = cur_x_max;
                }
            }
            if (x_min === null) {
                x_min = cur_x_min;
            } else {
                if (cur_x_min < x_min) {
                    x_min = cur_x_min;
                }
            }
        }
        for (point_index = 1; point_index < left_path_arr.length - 1; ++point_index) {
            var point_prev = left_path_arr[point_index - 1];
            var point_last = left_path_arr[point_index + 1];
            var dx_prev = point_prev.x - left_path_arr[point_index].x;
            var dy_prev = point_prev.y - left_path_arr[point_index].y;
            var dx_last = point_last.x - left_path_arr[point_index].x;
            var dy_last = point_last.y - left_path_arr[point_index].y;
            var l_prev = Math.sqrt(dx_prev * dx_prev + dy_prev * dy_prev);
            var l_last = Math.sqrt(dx_last * dx_last + dy_last * dy_last);
            if (l_prev === 0 || l_last === 0) {
                left_path_arr.splice(point_index, 1);
                --point_index;
            }
            if (l_prev < APPROXIMATE_EPSILON3 && l_last < APPROXIMATE_EPSILON3 && Math.abs(Math.acos((dx_last * dx_prev + dy_last * dy_prev) / (l_last * l_prev)) - Math.PI) < APPROXIMATE_ANGLE) {
                left_path_arr.splice(point_index, 1);
                --point_index;
            }
        }
        for (point_index = 1; point_index < right_path_arr.length - 1; ++point_index) {
            point_prev = right_path_arr[point_index - 1];
            point_last = right_path_arr[point_index + 1];
            dx_prev = point_prev.x - right_path_arr[point_index].x;
            dy_prev = point_prev.y - right_path_arr[point_index].y;
            dx_last = point_last.x - right_path_arr[point_index].x;
            dy_last = point_last.y - right_path_arr[point_index].y;
            l_prev = Math.sqrt(dx_prev * dx_prev + dy_prev * dy_prev);
            l_last = Math.sqrt(dx_last * dx_last + dy_last * dy_last);
            if (l_prev === 0 || l_last === 0) {
                right_path_arr.splice(point_index, 1);
                --point_index;
            }
            if (l_prev < APPROXIMATE_EPSILON3 && l_last < APPROXIMATE_EPSILON3 && Math.abs(Math.acos((dx_last * dx_prev + dy_last * dy_prev) / (l_last * l_prev)) - Math.PI) < APPROXIMATE_ANGLE) {
                right_path_arr.splice(point_index, 1);
                --point_index;
            }
        }
        this.arrPoints = [];
        this.arrPoints.push(left_path_arr[0]);
        for (point_index = 0; point_index < right_path_arr.length; ++point_index) {
            this.arrPoints.push(right_path_arr[point_index]);
        }
        for (point_index = left_path_arr.length - 1; point_index > 0; --point_index) {
            this.arrPoints.push(left_path_arr[point_index]);
        }
        var bounds = this.wordGraphicObject.getBounds();
        if (bounds.l < x_min) {
            this.left = bounds.l - this.wordGraphicObject.Distance.L;
        } else {
            this.left = x_min - this.wordGraphicObject.Distance.L;
        }
        if (bounds.r > x_max) {
            this.right = bounds.r + this.wordGraphicObject.Distance.R;
        } else {
            this.right = x_max + this.wordGraphicObject.Distance.R;
        }
        if (!isRealObject(left_path_arr[0]) || !(typeof left_path_arr[0].y === "number")) {
            this.top = bounds.t - this.wordGraphicObject.Distance.T;
        } else {
            this.top = left_path_arr[0].y - this.wordGraphicObject.Distance.T;
        }
        if (!isRealObject(left_path_arr[left_path_arr.length - 1]) || !(typeof left_path_arr[left_path_arr.length - 1].y === "number")) {
            this.bottom = bounds.b + this.wordGraphicObject.Distance.B;
        } else {
            this.bottom = left_path_arr[left_path_arr.length - 1].y + this.wordGraphicObject.Distance.B;
        }
        this.calculateAbsToRel(this.wordGraphicObject.getTransformMatrix());
        this.rect_flag = this.isRect();
    },
    calculateRelToAbs: function (transform) {
        if (this.relativeArrPoints.length === 0) {
            this.arrPoints.length = 0;
            return;
        }
        var relArr = this.relativeArrPoints;
        var absArr = this.arrPoints;
        absArr.length = 0;
        for (var point_index = 0; point_index < relArr.length; ++point_index) {
            var rel_point = relArr[point_index];
            var tr_x = transform.TransformPointX(rel_point.x, rel_point.y);
            var tr_y = transform.TransformPointY(rel_point.x, rel_point.y);
            absArr[point_index] = {
                x: tr_x,
                y: tr_y
            };
        }
        var min_x, max_x, min_y, max_y;
        min_x = absArr[0].x;
        max_x = min_x;
        min_y = absArr[0].y;
        max_y = min_y;
        for (point_index = 0; point_index < absArr.length; ++point_index) {
            var absPoint = absArr[point_index];
            if (min_x > absPoint.x) {
                min_x = absPoint.x;
            }
            if (max_x < absPoint.x) {
                max_x = absPoint.x;
            }
            if (min_y > absPoint.y) {
                min_y = absPoint.y;
            }
            if (max_y < absPoint.y) {
                max_y = absPoint.y;
            }
        }
        var bounds = this.wordGraphicObject.getBounds();
        if (bounds.l < min_x) {
            this.left = bounds.l - this.wordGraphicObject.Distance.L;
        } else {
            this.left = min_x - this.wordGraphicObject.Distance.L;
        }
        if (bounds.r > max_x) {
            this.right = bounds.r + this.wordGraphicObject.Distance.R;
        } else {
            this.right = max_x + this.wordGraphicObject.Distance.R;
        }
        if (bounds.t < min_y) {
            this.top = bounds.t - this.wordGraphicObject.Distance.T;
        } else {
            this.top = min_y - this.wordGraphicObject.Distance.T;
        }
        if (bounds.b > max_y) {
            this.bottom = bounds.b + this.wordGraphicObject.Distance.B;
        } else {
            this.bottom = max_y + this.wordGraphicObject.Distance.B;
        }
        this.rect_flag = this.isRect();
    },
    calculateAbsToRel: function (transform) {
        if (this.arrPoints.length === 0) {
            this.relativeArrPoints.length = 0;
            return;
        }
        var invert_transform = global_MatrixTransformer.Invert(transform);
        var relArr = this.relativeArrPoints;
        var absArr = this.arrPoints;
        relArr.length = 0;
        for (var point_index = 0; point_index < absArr.length; ++point_index) {
            var abs_point = absArr[point_index];
            var tr_x = invert_transform.TransformPointX(abs_point.x, abs_point.y);
            var tr_y = invert_transform.TransformPointY(abs_point.x, abs_point.y);
            relArr[point_index] = {
                x: tr_x,
                y: tr_y
            };
        }
        var min_x, max_x, min_y, max_y;
        min_x = absArr[0].x;
        max_x = min_x;
        min_y = absArr[0].y;
        max_y = min_y;
        for (point_index = 0; point_index < absArr.length; ++point_index) {
            var absPoint = absArr[point_index];
            if (min_x > absPoint.x) {
                min_x = absPoint.x;
            }
            if (max_x < absPoint.x) {
                max_x = absPoint.x;
            }
            if (min_y > absPoint.y) {
                min_y = absPoint.y;
            }
            if (max_y < absPoint.y) {
                max_y = absPoint.y;
            }
        }
        var bounds = this.wordGraphicObject.getBounds();
        if (bounds.l < min_x) {
            this.left = bounds.l - this.wordGraphicObject.Distance.L;
        } else {
            this.left = min_x - this.wordGraphicObject.Distance.L;
        }
        if (bounds.r > max_x) {
            this.right = bounds.r + this.wordGraphicObject.Distance.R;
        } else {
            this.right = max_x + this.wordGraphicObject.Distance.R;
        }
        if (bounds.t < min_y) {
            this.top = bounds.t - this.wordGraphicObject.Distance.T;
        } else {
            this.top = min_y - this.wordGraphicObject.Distance.T;
        }
        if (bounds.b > max_y) {
            this.bottom = bounds.b + this.wordGraphicObject.Distance.B;
        } else {
            this.bottom = max_y + this.wordGraphicObject.Distance.B;
        }
        this.rect_flag = this.isRect();
    },
    updateSizes: function (kw, kh) {
        if (!this.edited) {
            return;
        } else {
            History.Add(this, {
                Type: historyitem_UpdateWrapSizes,
                kw: kw,
                kh: kh
            });
            for (var i = 0; i < this.relativeArrPoints.length; ++i) {
                var p = this.relativeArrPoints[i];
                p.x *= kw;
                p.y *= kh;
            }
            this.calculateRelToAbs(this.wordGraphicObject.getTransformMatrix());
        }
    },
    Undo: function (data) {
        switch (data.Type) {
        case historyitem_ChangePolygon:
            this.edited = data.oldEdited;
            this.relativeArrPoints.length = 0;
            for (var i = 0; i < data.oldRelArr.length; ++i) {
                this.relativeArrPoints[i] = {
                    x: data.oldRelArr[i].x,
                    y: data.oldRelArr[i].y
                };
            }
            this.calculateRelToAbs(this.wordGraphicObject.getTransformMatrix());
            break;
        case historyitem_RemovePoint:
            this.edited = data.oldValueEdited;
            this.relativeArrPoints.splice(data.pointNum, 0, {
                x: data.pointRelX,
                y: data.pointRelY
            });
            this.calculateRelToAbs(this.wordGraphicObject.getTransformMatrix());
            break;
        case historyitem_AddNewPoint:
            this.edited = data.oldEdited;
            this.relativeArrPoints.splice(data.num, 1);
            this.calculateRelToAbs(this.wordGraphicObject.getTransformMatrix());
            break;
        case historyitem_MovePoint:
            this.edited = data.oldEdited;
            this.arrPoints[data.pointIndex] = {
                x: data.oldX,
                y: data.oldY
            };
            this.calculateAbsToRel(this.wordGraphicObject.getTransformMatrix());
            break;
        case historyitem_UpdateWrapSizes:
            var kw = 1 / data.kw;
            var kh = 1 / data.kh;
            for (var i = 0; i < this.relativeArrPoints.length; ++i) {
                var p = this.relativeArrPoints[i];
                p.x *= kw;
                p.y *= kh;
            }
            this.calculateRelToAbs(this.wordGraphicObject.getTransformMatrix());
            break;
        }
    },
    Redo: function (data) {
        switch (data.Type) {
        case historyitem_ChangePolygon:
            this.edited = true;
            this.relativeArrPoints.length = 0;
            for (var i = 0; i < data.oldRelArr.length; ++i) {
                this.relativeArrPoints[i] = {
                    x: data.newRelArr[i].x,
                    y: data.newRelArr[i].y
                };
            }
            this.calculateRelToAbs(this.wordGraphicObject.getTransformMatrix());
            break;
        case historyitem_RemovePoint:
            this.edited = true;
            this.arrPoints.splice(data.pointNum, 1);
            this.calculateAbsToRel(this.wordGraphicObject.getTransformMatrix());
            break;
        case historyitem_AddNewPoint:
            this.edited = true;
            this.relativeArrPoints.splice(data.num, 0, {
                x: data.pointX,
                y: data.pointY
            });
            this.calculateRelToAbs(this.wordGraphicObject.getTransformMatrix());
            break;
        case historyitem_MovePoint:
            this.edited = true;
            this.arrPoints[data.pointIndex] = {
                x: data.newX,
                y: data.newY
            };
            this.calculateAbsToRel(this.wordGraphicObject.getTransformMatrix());
            break;
        case historyitem_UpdateWrapSizes:
            var kw = data.kw;
            var kh = data.kh;
            for (var i = 0; i < this.relativeArrPoints.length; ++i) {
                var p = this.relativeArrPoints[i];
                p.x *= kw;
                p.y *= kh;
            }
            this.calculateRelToAbs(this.wordGraphicObject.getTransformMatrix());
            break;
        }
    },
    Save_Changes: function (data, writer) {
        writer.WriteLong(historyitem_type_WrapPolygon);
        writer.WriteLong(data.Type);
        switch (data.Type) {
        case historyitem_ChangePolygon:
            writer.WriteLong(data.newRelArr.length);
            for (var i = 0; i < data.newRelArr.length; ++i) {
                writer.WriteDouble(data.newRelArr[i].x);
                writer.WriteDouble(data.newRelArr[i].y);
            }
            break;
        case historyitem_RemovePoint:
            writer.WriteLong(data.pointNum);
            break;
        case historyitem_AddNewPoint:
            writer.WriteLong(data.num);
            writer.WriteDouble(data.pointX);
            writer.WriteDouble(data.pointY);
            break;
        case historyitem_MovePoint:
            writer.WriteLong(data.pointIndex);
            writer.WriteDouble(data.newX);
            writer.WriteDouble(data.newY);
            break;
        case historyitem_UpdateWrapSizes:
            writer.WriteDouble(data.kw);
            writer.WriteDouble(data.kh);
            break;
        }
    },
    Load_Changes: function (reader) {
        if (reader.GetLong() !== historyitem_type_WrapPolygon) {
            return;
        }
        switch (reader.GetLong()) {
        case historyitem_ChangePolygon:
            this.edited = true;
            var count = reader.GetLong();
            this.relativeArrPoints.length = 0;
            for (var i = 0; i < count; ++i) {
                var x = reader.GetDouble();
                var y = reader.GetDouble();
                this.relativeArrPoints[i] = {
                    x: x,
                    y: y
                };
            }
            break;
        case historyitem_RemovePoint:
            this.edited = true;
            this.arrPoints.splice(reader.GetLong(), 1);
            break;
        case historyitem_AddNewPoint:
            this.edited = true;
            var num = reader.GetLong();
            var x = reader.GetDouble();
            var y = reader.GetDouble();
            this.relativeArrPoints.splice(num, 0, {
                x: x,
                y: y
            });
            this.calculateRelToAbs(this.wordGraphicObject.getTransformMatrix());
            break;
        case historyitem_MovePoint:
            this.edited = true;
            var pointIndex = reader.GetLong();
            var x = reader.GetDouble();
            var y = reader.GetDouble();
            this.arrPoints[pointIndex] = {
                x: x,
                y: y
            };
            this.calculateAbsToRel(this.wordGraphicObject.getTransformMatrix());
            break;
        case historyitem_UpdateWrapSizes:
            var kw = reader.GetDouble();
            var kh = reader.GetDouble();
            for (var i = 0; i < this.relativeArrPoints.length; ++i) {
                var p = this.relativeArrPoints[i];
                p.x *= kw;
                p.y *= kh;
            }
            break;
        }
    },
    Refresh_RecalcData: function (Data) {
        if (isRealObject(this.wordGraphicObject)) {
            this.wordGraphicObject.Refresh_RecalcData();
        }
    },
    Refresh_RecalcData2: function () {
        if (isRealObject(this.wordGraphicObject)) {
            History.RecalcData_Add({
                Type: historyrecalctype_Flow,
                Data: this.wordGraphicObject
            });
        }
    }
};
function CPolygonPoint() {
    this.x = +0;
    this.y = +0;
}
function CWrapManager(graphicPage) {
    this.graphicPage = graphicPage;
    this.arrGraphicObjects = graphicPage.wrappingObjects;
}
CWrapManager.prototype = {
    checkRanges: function (x0, y0, x1, y1, Y0sp, Y1Ssp, LeftField, RightField, hdrFtrRa, docContent) {
        var arrGraphicObjects = this.arrGraphicObjects;
        var objects_count = arrGraphicObjects.length;
        var arr_intervals = [];
        if (docContent == null) {
            for (var index = 0; index < objects_count; ++index) {
                arrGraphicObjects[index].getArrayWrapIntervals(x0, y0, x1, y1, Y0sp, Y1Ssp, LeftField, RightField, arr_intervals);
            }
            var arrFlowTables = this.graphicPage.flowTables;
            for (index = 0; index < arrFlowTables.length; ++index) {
                var cur_float_table = arrFlowTables[index];
                if (y1 < cur_float_table.Y - cur_float_table.Distance.T || y0 > cur_float_table.Y + cur_float_table.H + cur_float_table.Distance.B) {
                    continue;
                }
                arr_intervals.push({
                    X0: cur_float_table.X - cur_float_table.Distance.L,
                    X1: cur_float_table.X + cur_float_table.W + cur_float_table.Distance.R,
                    Y1: cur_float_table.Y + cur_float_table.H + cur_float_table.Distance.B
                });
            }
        } else {
            if (!docContent.Is_HdrFtr()) {
                for (index = 0; index < objects_count; ++index) {
                    if (arrGraphicObjects[index].DocumentContent === docContent) {
                        arrGraphicObjects[index].getArrayWrapIntervals(x0, y0, x1, y1, Y0sp, Y1Ssp, LeftField, RightField, arr_intervals);
                    }
                }
                arrFlowTables = this.graphicPage.flowTables;
                for (index = 0; index < arrFlowTables.length; ++index) {
                    cur_float_table = arrFlowTables[index];
                    if (cur_float_table.Table.Parent === docContent) {
                        if (y1 < cur_float_table.Y - cur_float_table.Distance.T || y0 > cur_float_table.Y + cur_float_table.H + cur_float_table.Distance.B) {
                            continue;
                        }
                        arr_intervals.push({
                            X0: cur_float_table.X - cur_float_table.Distance.L,
                            X1: cur_float_table.X + cur_float_table.W + cur_float_table.Distance.R,
                            Y1: cur_float_table.Y + cur_float_table.H + cur_float_table.Distance.B
                        });
                    }
                }
            } else {
                var pageIndex = this.graphicPage.pageIndex;
                var graphic_objects = this.graphicPage.graphicObjects;
                var hdr_footer_objects;
                var bFirst = (0 === pageIndex ? true : false);
                var bEven = (pageIndex % 2 === 1 ? true : false);
                if (bFirst) {
                    hdr_footer_objects = graphic_objects.firstPage;
                } else {
                    if (bEven) {
                        hdr_footer_objects = graphic_objects.evenPage;
                    } else {
                        hdr_footer_objects = graphic_objects.oddPage;
                    }
                }
                if (hdr_footer_objects != null) {
                    arrGraphicObjects = hdr_footer_objects.wrappingArray;
                    for (index = 0; index < arrGraphicObjects.length; ++index) {
                        if (arrGraphicObjects[index].DocumentContent === docContent) {
                            arrGraphicObjects[index].getArrayWrapIntervals(x0, y0, x1, y1, Y0sp, Y1Ssp, LeftField, RightField, arr_intervals);
                        }
                    }
                    arrFlowTables = hdr_footer_objects.floatTables;
                    for (index = 0; index < arrFlowTables.length; ++index) {
                        cur_float_table = arrFlowTables[index];
                        if (cur_float_table.Table.Parent === docContent) {
                            if (y1 < cur_float_table.Y - cur_float_table.Distance.T || y0 > cur_float_table.Y + cur_float_table.H + cur_float_table.Distance.B) {
                                continue;
                            }
                            arr_intervals.push({
                                X0: cur_float_table.X - cur_float_table.Distance.L,
                                X1: cur_float_table.X + cur_float_table.W + cur_float_table.Distance.R,
                                Y1: cur_float_table.Y + cur_float_table.H + cur_float_table.Distance.B
                            });
                        }
                    }
                }
            }
        }
        for (index = 0; index < hdrFtrRa.length; ++index) {
            arr_intervals.push(hdrFtrRa[index]);
        }
        arr_intervals.sort(function (a, b) {
            return a.X0 - b.X0;
        });
        for (var s = 0; s < arr_intervals.length - 1; ++s) {
            var int0 = arr_intervals[s];
            var int1 = arr_intervals[s + 1];
            var dist;
            if (int0.typeRight === WRAPPING_TYPE_SQUARE || int0.typeRight === WRAPPING_TYPE_TIGHT || int0.typeRight === WRAPPING_TYPE_THROUGH || int1.typeLeft === WRAPPING_TYPE_SQUARE || int1.typeLeft === WRAPPING_TYPE_TIGHT || int1.typeLeft === WRAPPING_TYPE_THROUGH) {
                dist = (int0.typeRight === WRAPPING_TYPE_TIGHT || int0.typeRight === WRAPPING_TYPE_THROUGH) || (int1.typeLeft === WRAPPING_TYPE_TIGHT || int1.typeLeft === WRAPPING_TYPE_THROUGH) ? 3.175 : 6.35;
                var d = arr_intervals[s + 1].X0 - arr_intervals[s].X1;
                if (d > 0 && d < dist) {
                    int0.X1 = int1.X1;
                    int0.Y1 = Math.min(int0.Y1, int1.Y1);
                    int0.typeRight = int1.typeRight;
                    arr_intervals.splice(s + 1, 1);
                    --s;
                }
            }
        }
        for (var interval_index = 0; interval_index < arr_intervals.length; ++interval_index) {
            var cur_interval = arr_intervals[interval_index];
            for (var interval_index2 = interval_index + 1; interval_index2 < arr_intervals.length; ++interval_index2) {
                var cur_interval2 = arr_intervals[interval_index2];
                if (cur_interval2.X0 <= cur_interval.X1) {
                    if (cur_interval2.X1 > cur_interval.X1) {
                        cur_interval.X1 = cur_interval2.X1;
                        cur_interval.Y1 = Math.min(cur_interval.Y1, cur_interval2.Y1);
                    }
                    arr_intervals.splice(interval_index2, 1);
                    --interval_index2;
                } else {
                    break;
                }
            }
        }
        return arr_intervals;
    }
};
function CTrackWrapPolygon(originalWrapPolygon, pointNum) {
    this.originalWrapPolygon = originalWrapPolygon;
    this.pointNum = pointNum;
    this.curPage = originalWrapPolygon.wordGraphicObject.pageIndex;
    var arr_points = this.originalWrapPolygon.arrPoints;
    if (this.pointNum === 0) {
        this.point1 = arr_points[arr_points.length - 1];
        this.point2 = arr_points[1];
    } else {
        if (this.pointNum === arr_points.length - 1) {
            this.point1 = arr_points[arr_points.length - 2];
            this.point2 = arr_points[0];
        } else {
            this.point1 = arr_points[this.pointNum - 1];
            this.point2 = arr_points[this.pointNum + 1];
        }
    }
    this.curPosX = arr_points[this.pointNum].x;
    this.curPosY = arr_points[this.pointNum].y;
    this.matrix = new CMatrix();
    this.track = function (x, y) {
        this.curPosX = x;
        this.curPosY = y;
    };
    this.draw = function (overlay) {
        overlay.SetCurrentPage(this.curPage);
        overlay.DrawEditWrapPointsTrackLines([this.point1, {
            x: this.curPosX,
            y: this.curPosY
        },
        this.point2], this.matrix);
        overlay.ds();
    };
    this.trackEnd = function () {
        var point = this.originalWrapPolygon.arrPoints[this.pointNum];
        var data = {
            Type: historyitem_ChangePolygon
        };
        var wrap_polygon = this.originalWrapPolygon;
        data.oldEdited = wrap_polygon.edited;
        data.oldRelArr = [];
        for (var i = 0; i < wrap_polygon.relativeArrPoints.length; ++i) {
            data.oldRelArr[i] = {
                x: wrap_polygon.relativeArrPoints[i].x,
                y: wrap_polygon.relativeArrPoints[i].y
            };
        }
        point.x = this.curPosX;
        point.y = this.curPosY;
        this.originalWrapPolygon.edited = true;
        this.originalWrapPolygon.calculateAbsToRel(this.originalWrapPolygon.wordGraphicObject.getTransformMatrix());
        data.newRelArr = [];
        for (i = 0; i < wrap_polygon.relativeArrPoints.length; ++i) {
            data.newRelArr[i] = {
                x: wrap_polygon.relativeArrPoints[i].x,
                y: wrap_polygon.relativeArrPoints[i].y
            };
        }
        History.Add(wrap_polygon, data);
    };
}