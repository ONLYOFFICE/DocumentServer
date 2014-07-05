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
 function PolyLine(document, pageIndex) {
    this.document = document;
    this.pageIndex = pageIndex;
    this.arrPoint = [];
    this.Matrix = new CMatrixL();
    this.TransformMatrix = new CMatrixL();
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
    this.calculateLine();
    this.Draw = function (graphics) {
        graphics.SetIntegerGrid(false);
        graphics.transform3(this.Matrix);
        var shape_drawer = new CShapeDrawer();
        shape_drawer.fromShape(this, graphics);
        shape_drawer.draw(this);
    };
    this.draw = function (g) {
        if (this.arrPoint.length < 2) {
            return;
        }
        g._m(this.arrPoint[0].x, this.arrPoint[0].y);
        for (var i = 1; i < this.arrPoint.length; ++i) {
            g._l(this.arrPoint[i].x, this.arrPoint[i].y);
        }
        g.ds();
    };
    this.getLeftTopPoint = function () {
        if (this.arrPoint.length < 1) {
            return {
                x: 0,
                y: 0
            };
        }
        var xMax = this.arrPoint[0].x,
        yMax = this.arrPoint[0].y,
        xMin = xMax,
        yMin = yMax;
        var i;
        for (i = 1; i < this.arrPoint.length; ++i) {
            if (this.arrPoint[i].x > xMax) {
                xMax = this.arrPoint[i].x;
            }
            if (this.arrPoint[i].y > yMax) {
                yMax = this.arrPoint[i].y;
            }
            if (this.arrPoint[i].x < xMin) {
                xMin = this.arrPoint[i].x;
            }
            if (this.arrPoint[i].y < yMin) {
                yMin = this.arrPoint[i].y;
            }
        }
        return {
            x: xMin,
            y: yMin
        };
    };
    this.createShape = function (document) {
        var xMax = this.arrPoint[0].x,
        yMax = this.arrPoint[0].y,
        xMin = xMax,
        yMin = yMax;
        var i;
        var bClosed = false;
        if (this.arrPoint.length > 2) {
            var dx = this.arrPoint[0].x - this.arrPoint[this.arrPoint.length - 1].x;
            var dy = this.arrPoint[0].y - this.arrPoint[this.arrPoint.length - 1].y;
            if (Math.sqrt(dx * dx + dy * dy) < this.document.DrawingDocument.GetMMPerDot(3)) {
                bClosed = true;
            }
        }
        var _n = bClosed ? this.arrPoint.length - 1 : this.arrPoint.length;
        for (i = 1; i < _n; ++i) {
            if (this.arrPoint[i].x > xMax) {
                xMax = this.arrPoint[i].x;
            }
            if (this.arrPoint[i].y > yMax) {
                yMax = this.arrPoint[i].y;
            }
            if (this.arrPoint[i].x < xMin) {
                xMin = this.arrPoint[i].x;
            }
            if (this.arrPoint[i].y < yMin) {
                yMin = this.arrPoint[i].y;
            }
        }
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
        geometry.AddPathCommand(1, (this.arrPoint[0].x - xMin) + "", (this.arrPoint[0].y - yMin) + "");
        for (i = 1; i < _n; ++i) {
            geometry.AddPathCommand(2, (this.arrPoint[i].x - xMin) + "", (this.arrPoint[i].y - yMin) + "");
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
        data.commands.push({
            id: 1,
            x: (this.arrPoint[0].x - xMin) + "",
            y: (this.arrPoint[0].y - yMin) + ""
        });
        for (i = 1; i < _n; ++i) {
            data.commands.push({
                id: 2,
                x: (this.arrPoint[i].x - xMin) + "",
                y: (this.arrPoint[i].y - yMin) + ""
            });
        }
        History.Add(wordShape, data);
        History.Add(wordGraphicObject, {
            Type: historyitem_CalculateAfterPaste
        });
        return wordGraphicObject;
    };
}