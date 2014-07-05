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
 var K = 1 / 4;
var mt = 0,
lt = 1,
cb = 2,
cl = 3;
function SplineCommandMoveTo(x, y) {
    this.id = 0;
    this.x = x;
    this.y = y;
}
function SplineCommandLineTo(x, y) {
    this.id = 1;
    this.x = x;
    this.y = y;
    this.changePoint = function (x, y) {
        this.x = x;
        this.y = y;
    };
}
function SplineCommandBezier(x1, y1, x2, y2, x3, y3) {
    this.id = 2;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.x3 = x3;
    this.y3 = y3;
    this.changeLastPoint = function (x, y) {
        this.x3 = x;
        this.y3 = y;
        this.x2 = this.x1 + (this.x3 - this.x1) * 0.5;
        this.y2 = this.y1 + (this.y3 - this.y1) * 0.5;
    };
}
function Spline(pageIndex, document) {
    this.path = [];
    this.pageIndex = pageIndex;
    this.document = document;
    this.Matrix = new CMatrix();
    this.TransformMatrix = new CMatrix();
    this.style = CreateDefaultShapeStyle();
    this.calculateLine = function () {
        var _calculated_line;
        var _theme = this.document.theme;
        var colorMap = this.document.clrSchemeMap.color_map;
        if (colorMap == null) {
            colorMap = GenerateDefaultColorMap().color_map;
        }
        var RGBA = {
            R: 0,
            G: 0,
            B: 0,
            A: 255
        };
        if (_theme !== null && typeof _theme === "object" && typeof _theme.getLnStyle === "function" && this.style !== null && typeof this.style === "object" && this.style.lnRef !== null && typeof this.style.lnRef === "object" && typeof this.style.lnRef.idx === "number" && this.style.lnRef.Color !== null && typeof this.style.lnRef.Color.Calculate === "function") {
            _calculated_line = _theme.getLnStyle(this.style.lnRef.idx);
            this.style.lnRef.Color.Calculate(_theme, colorMap, {
                R: 0,
                G: 0,
                B: 0,
                A: 255
            });
            RGBA = this.style.lnRef.Color.RGBA;
        } else {
            _calculated_line = new CLn();
        }
        if (_calculated_line.Fill != null) {
            _calculated_line.Fill.calculate(_theme, colorMap, RGBA);
        }
        this.pen = _calculated_line;
    };
    this.pen = null;
    this.calculateLine();
    this.Draw = function (graphics) {
        graphics.SetCurrentPage(this.pageIndex);
        graphics.SetIntegerGrid(false);
        graphics.transform3(this.Matrix);
        var shape_drawer = new CShapeDrawer();
        shape_drawer.fromShape(this, graphics);
        shape_drawer.draw(this);
    };
    this.draw = function (g) {
        for (var i = 0; i < this.path.length; ++i) {
            var lastX, lastY;
            switch (this.path[i].id) {
            case 0:
                g._m(this.path[i].x, this.path[i].y);
                lastX = this.path[i].x;
                lastY = this.path[i].y;
                break;
            case 1:
                g._l(this.path[i].x, this.path[i].y);
                lastX = this.path[i].x;
                lastY = this.path[i].y;
                break;
            case 2:
                g._c(this.path[i].x1, this.path[i].y1, this.path[i].x2, this.path[i].y2, this.path[i].x3, this.path[i].y3);
                lastX = this.path[i].x3;
                lastY = this.path[i].y3;
                break;
            }
        }
        g.ds();
    };
    this.getLeftTopPoint = function () {
        if (this.path.length < 1) {
            return {
                x: 0,
                y: 0
            };
        }
        var min_x = this.path[0].x;
        var max_x = min_x;
        var min_y = this.path[0].y;
        var max_y = min_y;
        var last_x = this.path[0].x,
        last_y = this.path[0].y;
        for (var index = 1; index < this.path.length; ++index) {
            var path_command = this.path[index];
            if (path_command.id === 1) {
                if (min_x > path_command.x) {
                    min_x = path_command.x;
                }
                if (max_x < path_command.x) {
                    max_x = path_command.x;
                }
                if (min_y > path_command.y) {
                    min_y = path_command.y;
                }
                if (max_y < path_command.y) {
                    max_y = path_command.y;
                }
            } else {
                var bezier_polygon = partition_bezier4(last_x, last_y, path_command.x1, path_command.y1, path_command.x2, path_command.y2, path_command.x3, path_command.y3, APPROXIMATE_EPSILON);
                for (var point_index = 1; point_index < bezier_polygon.length; ++point_index) {
                    var cur_point = bezier_polygon[point_index];
                    if (min_x > cur_point.x) {
                        min_x = cur_point.x;
                    }
                    if (max_x < cur_point.x) {
                        max_x = cur_point.x;
                    }
                    if (min_y > cur_point.y) {
                        min_y = cur_point.y;
                    }
                    if (max_y < cur_point.y) {
                        max_y = cur_point.y;
                    }
                }
            }
        }
        return {
            x: min_x,
            y: min_y
        };
    };
    this.createShape = function (document) {
        var xMax = this.path[0].x,
        yMax = this.path[0].y,
        xMin = xMax,
        yMin = yMax;
        var i;
        var bClosed = false;
        if (this.path.length > 2) {
            var dx = this.path[0].x - this.path[this.path.length - 1].x3;
            var dy = this.path[0].y - this.path[this.path.length - 1].y3;
            if (Math.sqrt(dx * dx + dy * dy) < 3) {
                bClosed = true;
                this.path[this.path.length - 1].x3 = this.path[0].x;
                this.path[this.path.length - 1].y3 = this.path[0].y;
                if (this.path.length > 3) {
                    var vx = (this.path[1].x3 - this.path[this.path.length - 2].x3) / 6;
                    var vy = (this.path[1].y3 - this.path[this.path.length - 2].y3) / 6;
                } else {
                    vx = -(this.path[1].y3 - this.path[0].y) / 6;
                    vy = (this.path[1].x3 - this.path[0].x) / 6;
                }
                this.path[1].x1 = this.path[0].x + vx;
                this.path[1].y1 = this.path[0].y + vy;
                this.path[this.path.length - 1].x2 = this.path[0].x - vx;
                this.path[this.path.length - 1].y2 = this.path[0].y - vy;
            }
        }
        var min_x = this.path[0].x;
        var max_x = min_x;
        var min_y = this.path[0].y;
        var max_y = min_y;
        var last_x = this.path[0].x,
        last_y = this.path[0].y;
        for (var index = 1; index < this.path.length; ++index) {
            var path_command = this.path[index];
            if (path_command.id === 1) {
                if (min_x > path_command.x) {
                    min_x = path_command.x;
                }
                if (max_x < path_command.x) {
                    max_x = path_command.x;
                }
                if (min_y > path_command.y) {
                    min_y = path_command.y;
                }
                if (max_y < path_command.y) {
                    max_y = path_command.y;
                }
                last_x = path_command.x;
                last_y = path_command.y;
            } else {
                var bezier_polygon = partition_bezier4(last_x, last_y, path_command.x1, path_command.y1, path_command.x2, path_command.y2, path_command.x3, path_command.y3, APPROXIMATE_EPSILON);
                for (var point_index = 1; point_index < bezier_polygon.length; ++point_index) {
                    var cur_point = bezier_polygon[point_index];
                    if (min_x > cur_point.x) {
                        min_x = cur_point.x;
                    }
                    if (max_x < cur_point.x) {
                        max_x = cur_point.x;
                    }
                    if (min_y > cur_point.y) {
                        min_y = cur_point.y;
                    }
                    if (max_y < cur_point.y) {
                        max_y = cur_point.y;
                    }
                    last_x = path_command.x3;
                    last_y = path_command.y3;
                }
            }
        }
        xMin = min_x;
        xMax = max_x;
        yMin = min_y;
        yMax = max_y;
        var wordGraphicObject = new ParaDrawing(null, null, null, document.DrawingDocument, null, document);
        var wordShape = new WordShape(wordGraphicObject, document, document.DrawingDocument, null);
        wordGraphicObject.Set_GraphicObject(wordShape);
        wordShape.pageIndex = this.pageIndex;
        wordShape.setAbsoluteTransform(xMin, yMin, xMax - xMin, yMax - yMin, 0, false, false);
        wordShape.setXfrm(0, 0, xMax - xMin, yMax - yMin, 0, false, false);
        wordShape.style = CreateDefaultShapeStyle();
        var geometry = new CGeometry();
        geometry.AddPathCommand(0, undefined, bClosed ? "norm" : "none", undefined, xMax - xMin, yMax - yMin);
        geometry.AddRect("l", "t", "r", "b");
        for (i = 0; i < this.path.length; ++i) {
            switch (this.path[i].id) {
            case 0:
                geometry.AddPathCommand(1, (this.path[i].x - xMin) + "", (this.path[i].y - yMin) + "");
                break;
            case 1:
                geometry.AddPathCommand(2, (this.path[i].x - xMin) + "", (this.path[i].y - yMin) + "");
                break;
            case 2:
                geometry.AddPathCommand(5, (this.path[i].x1 - xMin) + "", (this.path[i].y1 - yMin) + "", (this.path[i].x2 - xMin) + "", (this.path[i].y2 - yMin) + "", (this.path[i].x3 - xMin) + "", (this.path[i].y3 - yMin) + "");
                break;
            }
        }
        if (bClosed) {
            geometry.AddPathCommand(6);
        }
        geometry.Init(xMax - xMin, yMax - yMin);
        wordShape.spPr.geometry = geometry;
        wordShape.calculate();
        wordShape.calculateTransformMatrix();
        wordGraphicObject.setZIndex();
        wordGraphicObject.setPageIndex(this.pageIndex);
        var data = {
            Type: historyitem_CreatePolyine
        };
        data.xMax = xMax;
        data.xMin = xMin;
        data.yMax = yMax;
        data.yMin = yMin;
        data.bClosed = bClosed;
        data.commands = [];
        for (i = 0; i < this.path.length; ++i) {
            switch (this.path[i].id) {
            case 0:
                data.commands.push({
                    id: 1,
                    x: (this.path[i].x - xMin) + "",
                    y: (this.path[i].y - yMin) + ""
                });
                break;
            case 1:
                data.commands.push({
                    id: 2,
                    x: (this.path[i].x - xMin) + "",
                    y: (this.path[i].y - yMin) + ""
                });
                break;
            case 2:
                data.commands.push({
                    id: 5,
                    x0: (this.path[i].x1 - xMin) + "",
                    y0: (this.path[i].y1 - yMin) + "",
                    x1: (this.path[i].x2 - xMin) + "",
                    y1: (this.path[i].y2 - yMin) + "",
                    x2: (this.path[i].x3 - xMin) + "",
                    y2: (this.path[i].y3 - yMin) + ""
                });
                break;
            }
        }
        History.Add(wordShape, data);
        History.Add(wordGraphicObject, {
            Type: historyitem_CalculateAfterPaste
        });
        return wordGraphicObject;
    };
}