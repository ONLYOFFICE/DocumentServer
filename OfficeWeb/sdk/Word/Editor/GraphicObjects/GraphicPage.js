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
 var DRAWING_ARRAY_TYPE_INLINE = 0;
var DRAWING_ARRAY_TYPE_BEHIND = 1;
var DRAWING_ARRAY_TYPE_WRAPPING = 2;
var DRAWING_ARRAY_TYPE_BEFORE = 3;
function CGraphicPage(pageIndex, graphicObjects) {
    this.pageIndex = pageIndex;
    this.graphicObjects = graphicObjects;
    this.drawingDocument = graphicObjects.drawingDocument;
    this.arrGraphicObjects = [];
    this.selectionInfo = {
        selectionArray: []
    };
    this.objectsMap = {};
    this.inlineObjects = [];
    this.behindDocObjects = [];
    this.wrappingObjects = [];
    this.beforeTextObjects = [];
    this.wrapManager = new CWrapManager(this);
    this.flowTables = [];
}
CGraphicPage.prototype = {
    redrawCharts: function () {
        var arr = [this.inlineObjects, this.behindDocObjects, this.wrappingObjects, this.beforeTextObjects];
        for (var i = 0; i < arr.length; ++i) {
            var cur_arr = arr[i];
            for (var j = 0; j < cur_arr.length; ++j) {
                if (typeof CChartAsGroup != "undefined" && cur_arr[j].GraphicObj instanceof CChartAsGroup) {
                    cur_arr[j].GraphicObj.recalculate();
                }
            }
        }
    },
    addFloatTable: function (table) {
        this.flowTables.push(table);
    },
    CheckRange: function (X0, Y0, X1, Y1, Y0sp, Y1Ssp, LeftField, RightField, HdrFtrRanges, docContent) {
        return this.wrapManager.checkRanges(X0, Y0, X1, Y1, Y0sp, Y1Ssp, LeftField, RightField, HdrFtrRanges, docContent);
    },
    removeFloatTableById: function (id) {
        for (var index = 0; index < this.flowTables.length; ++index) {
            if (this.flowTables[index].Id === id) {
                this.flowTables.splice(index, 1);
                return;
            }
        }
    },
    documentStatistics: function (Statistics) {
        var cur_array = this.inlineObjects;
        for (var i = 0; i < cur_array.length; ++i) {
            cur_array[i].documentStatistics(Statistics);
        }
        cur_array = this.behindDocObjects;
        for (i = 0; i < cur_array.length; ++i) {
            cur_array[i].documentStatistics(Statistics);
        }
        cur_array = this.wrappingObjects;
        for (i = 0; i < cur_array.length; ++i) {
            cur_array[i].documentStatistics(Statistics);
        }
        cur_array = this.beforeTextObjects;
        for (i = 0; i < cur_array.length; ++i) {
            cur_array[i].documentStatistics(Statistics);
        }
    },
    getObjectByXY: function (x, y) {
        for (var index = this.flowTables.length - 1; index > -1; - index) {
            var flow_table = this.flowTables[index];
            if (x >= flow_table.X && x <= flow_table.X + flow_table.W && y >= flow_table.Y && y <= flow_table.Y + flow_table.H) {
                return flow_table;
            }
        }
        for (index = this.beforeTextObjects.length; index > -1; --index) {
            if (this.beforeTextObjects[index].hit(x, y)) {
                return this.beforeTextObjects[index];
            }
        }
        for (index = this.wrappingObjects.length; index > -1; --index) {
            if (this.wrappingObjects[index].hit(x, y)) {
                return this.wrappingObjects[index];
            }
        }
        for (index = this.inlineObjects.length; index > -1; --index) {
            if (this.inlineObjects[index].hit(x, y)) {
                return this.inlineObjects[index];
            }
        }
        return null;
    },
    getTableByXY: function (x, y, documentContent) {
        for (var index = this.flowTables.length - 1; index > -1; --index) {
            if (this.flowTables[index].IsPointIn(x, y) && this.flowTables[index].Table.Parent === documentContent) {
                return this.flowTables[index];
            }
        }
        return null;
    },
    getObjectById: function (id, type) {
        if (!isNaN(type) && typeof type === "number") {
            var drawing_array;
            switch (type) {
            case DRAWING_ARRAY_TYPE_BEFORE:
                drawing_array = this.beforeTextObjects;
                break;
            case DRAWING_ARRAY_TYPE_BEHIND:
                drawing_array = this.behindDocObjects;
                break;
            case DRAWING_ARRAY_TYPE_INLINE:
                drawing_array = this.inlineObjects;
                break;
            case DRAWING_ARRAY_TYPE_WRAPPING:
                drawing_array = this.wrappingObjects;
                break;
            }
            if (Array.isArray(drawing_array)) {
                for (var index = 0; index < drawing_array.length; ++index) {
                    if (drawing_array[index].Get_Id() === id) {
                        return drawing_array[index];
                    }
                }
            }
        } else {
            drawing_array = this.beforeTextObjects;
            for (index = 0; index < drawing_array.length; ++index) {
                if (drawing_array[index].Get_Id() === id) {
                    return drawing_array[index];
                }
            }
            drawing_array = this.behindDocObjects;
            for (index = 0; index < drawing_array.length; ++index) {
                if (drawing_array[index].Get_Id() === id) {
                    return drawing_array[index];
                }
            }
            drawing_array = this.inlineObjects;
            for (index = 0; index < drawing_array.length; ++index) {
                if (drawing_array[index].Get_Id() === id) {
                    return drawing_array[index];
                }
            }
            drawing_array = this.wrappingObjects;
            for (index = 0; index < drawing_array.length; ++index) {
                if (drawing_array[index].Get_Id() === id) {
                    return drawing_array[index];
                }
            }
        }
        return null;
    },
    delObjectById: function (id, type) {
        if (!isNaN(type) && typeof type === "number") {
            var drawing_array;
            switch (type) {
            case DRAWING_ARRAY_TYPE_BEFORE:
                drawing_array = this.beforeTextObjects;
                break;
            case DRAWING_ARRAY_TYPE_BEHIND:
                drawing_array = this.behindDocObjects;
                break;
            case DRAWING_ARRAY_TYPE_INLINE:
                drawing_array = this.inlineObjects;
                break;
            case DRAWING_ARRAY_TYPE_WRAPPING:
                drawing_array = this.wrappingObjects;
                break;
            }
            if (Array.isArray(drawing_array)) {
                for (var index = 0; index < drawing_array.length; ++index) {
                    if (drawing_array[index].Get_Id() === id) {
                        return drawing_array.splice(index, 1);
                    }
                }
            }
        } else {
            drawing_array = this.beforeTextObjects;
            for (index = 0; index < drawing_array.length; ++index) {
                if (drawing_array[index].Get_Id() === id) {
                    return drawing_array.splice(index, 1);
                }
            }
            drawing_array = this.behindDocObjects;
            for (index = 0; index < drawing_array.length; ++index) {
                if (drawing_array[index].Get_Id() === id) {
                    return drawing_array.splice(index, 1);
                }
            }
            drawing_array = this.inlineObjects;
            for (index = 0; index < drawing_array.length; ++index) {
                if (drawing_array[index].Get_Id() === id) {
                    return drawing_array.splice(index, 1);
                }
            }
            drawing_array = this.wrappingObjects;
            for (index = 0; index < drawing_array.length; ++index) {
                if (drawing_array[index].Get_Id() === id) {
                    return drawing_array.splice(index, 1);
                }
            }
        }
        return null;
    },
    resetDrawingArrays: function (docContent) {
        if (!isRealObject(docContent) || docContent === editor.WordControl.m_oLogicDocument) {}
        if (isRealObject(docContent)) {
            if (docContent.Is_TopDocument()) {
                if (!docContent.Is_HdrFtr()) {
                    this.objectsMap = {};
                    this.inlineObjects.length = 0;
                    this.behindDocObjects.length = 0;
                    this.wrappingObjects.length = 0;
                    this.beforeTextObjects.length = 0;
                    this.flowTables.length = 0;
                } else {
                    var hdr_ftr;
                    if (this.pageIndex === 0) {
                        if (isRealObject(this.graphicObjects.firstPage)) {
                            hdr_ftr = this.graphicObjects.firstPage;
                        }
                    } else {
                        if (this.pageIndex % 2 === 1) {
                            hdr_ftr = this.graphicObjects.evenPage;
                        } else {
                            hdr_ftr = this.graphicObjects.oddPage;
                        }
                    }
                    if (isRealObject(hdr_ftr)) {
                        var arr = [hdr_ftr.behindDocArray, hdr_ftr.inlineArray, hdr_ftr.wrappingArray, hdr_ftr.beforeTextArray];
                        if (isRealObject(arr)) {
                            for (var i = 0; i < 4; ++i) {
                                var a = arr[i];
                                for (var j = a.length - 1; j > -1; --j) {
                                    o = a[j];
                                    if (isRealObject(o) && isRealObject(o.Parent) && isRealObject(o.Parent.Parent) && o.Parent.Parent === docContent) {
                                        a.splice(j, 1);
                                    }
                                }
                            }
                            a = hdr_ftr.floatTables;
                            for (var j = a.length - 1; j > -1; --j) {
                                o = a[j];
                                if (isRealObject(o) && isRealObject(o.Table) && isRealObject(o.Table.Parent) && o.Table.Parent === docContent) {
                                    a.splice(j, 1);
                                }
                            }
                        }
                    }
                }
            } else {
                for (var key in this.objectsMap) {
                    var o = this.objectsMap[key];
                    if (isRealObject(o) && isRealObject(o.Parent) && isRealObject(o.Parent.Parent)) {
                        if (o.Parent.Parent === docContent) {
                            delete this.objectsMap[key];
                        }
                    }
                }
                if (!docContent.Is_HdrFtr()) {
                    arr = [this.inlineObjects, this.behindDocObjects, this.wrappingObjects, this.beforeTextObjects];
                } else {
                    var hdr_ftr = null;
                    if (this.pageIndex === 0) {
                        hdr_ftr = this.graphicObjects.firstPage;
                    } else {
                        if (this.pageIndex % 2 === 1) {
                            hdr_ftr = this.graphicObjects.evenPage;
                        } else {
                            hdr_ftr = this.graphicObjects.oddPage;
                        }
                    }
                    if (isRealObject(hdr_ftr)) {
                        arr = [hdr_ftr.behindDocArray, hdr_ftr.inlineArray, hdr_ftr.wrappingArray, hdr_ftr.beforeTextArray];
                    }
                }
                if (isRealObject(arr)) {
                    for (var i = 0; i < 4; ++i) {
                        var a = arr[i];
                        for (var j = a.length - 1; j > -1; --j) {
                            o = a[j];
                            if (isRealObject(o) && isRealObject(o.Parent) && isRealObject(o.Parent.Parent) && o.Parent.Parent === docContent) {
                                a.splice(j, 1);
                            }
                        }
                    }
                    a = [];
                    if (!docContent.Is_HdrFtr()) {
                        a = this.flowTables;
                    } else {
                        if (isRealObject(hdr_ftr)) {
                            a = hdr_ftr.floatTables;
                        }
                    }
                    for (var j = a.length - 1; j > -1; --j) {
                        o = a[j];
                        if (isRealObject(o) && isRealObject(o.Table) && isRealObject(o.Table.Parent) && o.Table.Parent === docContent) {
                            a.splice(j, 1);
                        }
                    }
                }
            }
        }
    },
    draw: function (graphics) {
        for (var _object_index = 0; _object_index < this.inlineObjects.length; ++_object_index) {
            this.inlineObjects[_object_index].draw(graphics);
        }
        for (_object_index = 0; _object_index < this.wrappingObjects.length; ++_object_index) {
            this.wrappingObjects[_object_index].draw(graphics);
        }
        for (_object_index = 0; _object_index < this.beforeTextObjects.length; ++_object_index) {
            this.beforeTextObjects[_object_index].draw(graphics);
        }
        for (_object_index = 0; _object_index < this.behindDocObjects.length; ++_object_index) {
            this.behindDocObjects[_object_index].draw(graphics);
        }
    },
    drawSelect: function () {
        var _graphic_objects = this.selectionInfo.selectionArray;
        var _object_index;
        var _objects_count = _graphic_objects.length;
        var _graphic_object;
        for (_object_index = 0; _object_index < _objects_count; ++_object_index) {
            _graphic_object = _graphic_objects[_object_index].graphicObject;
            var _transform = _graphic_object.getTransformMatrix();
            if (_transform === null) {
                _transform = new CMatrix();
            }
            var _extensions = _graphic_object.getExtensions();
            if (_extensions === null) {
                _extensions = {
                    extX: 0,
                    extY: 0
                };
            }
            this.drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, _transform, 0, 0, _extensions.extX, _extensions.extY, false);
        }
    },
    selectionCheck: function (x, y) {},
    documentSearch: function (String, search_Common) {
        var hdr_ftr;
        if (this.pageIndex === 0) {
            hdr_ftr = this.graphicObjects.firstPage;
        } else {
            if (this.pageIndex % 2 === 1) {
                hdr_ftr = this.graphicObjects.evenPage;
            } else {
                hdr_ftr = this.graphicObjects.oddPage;
            }
        }
        var search_array = [];
        if (isRealObject(hdr_ftr)) {
            search_array = search_array.concat(hdr_ftr.behindDocArray);
            search_array = search_array.concat(hdr_ftr.wrappingArray);
            search_array = search_array.concat(hdr_ftr.inlineArray);
            search_array = search_array.concat(hdr_ftr.beforeTextArray);
        }
        search_array = search_array.concat(this.behindDocObjects);
        search_array = search_array.concat(this.wrappingObjects);
        search_array = search_array.concat(this.inlineObjects);
        search_array = search_array.concat(this.beforeTextObjects);
        for (var i = 0; i < search_array.length; ++i) {
            search_array[i].documentSearch(String, search_Common);
        }
    },
    addGraphicObject: function (graphicObject) {
        switch (graphicObject.getDrawingArrayType()) {
        case DRAWING_ARRAY_TYPE_INLINE:
            this.inlineObjects.push(graphicObject);
            break;
        case DRAWING_ARRAY_TYPE_BEHIND:
            this.behindDocObjects.push(graphicObject);
            this.behindDocObjects.sort(ComparisonByZIndexSimple);
            break;
        case DRAWING_ARRAY_TYPE_WRAPPING:
            this.wrappingObjects.push(graphicObject);
            this.wrappingObjects.sort(ComparisonByZIndexSimple);
            break;
        case DRAWING_ARRAY_TYPE_BEFORE:
            this.beforeTextObjects.push(graphicObject);
            this.beforeTextObjects.sort(ComparisonByZIndexSimple);
            break;
        }
    },
    drawBehindDoc: function (graphics) {
        for (var _object_index = 0; _object_index < this.behindDocObjects.length; ++_object_index) {
            this.behindDocObjects[_object_index].draw(graphics);
        }
        graphics.SetIntegerGrid(true);
    },
    drawWrappingObjects: function (graphics) {
        for (var _object_index = 0; _object_index < this.wrappingObjects.length; ++_object_index) {
            this.wrappingObjects[_object_index].draw(graphics);
        }
        graphics.SetIntegerGrid(true);
    },
    drawBeforeObjects: function (graphics) {
        for (var _object_index = 0; _object_index < this.beforeTextObjects.length; ++_object_index) {
            this.beforeTextObjects[_object_index].draw(graphics);
        }
        graphics.SetIntegerGrid(true);
    },
    drawInlineObjects: function (graphics) {
        for (var _object_index = 0; _object_index < this.inlineObjects.length; ++_object_index) {
            this.inlineObjects[_object_index].draw(graphics);
        }
        graphics.SetIntegerGrid(true);
    }
};
function ComparisonByZIndex(grObj1, grObj2) {
    if (grObj1 !== null && grObj2 !== null && typeof grObj1 === "object" && typeof grObj2 === "object") {
        if (typeof grObj1.RelativeHeight === "number" && typeof grObj2.RelativeHeight === "number") {
            return grObj1.RelativeHeight - grObj2.RelativeHeight;
        }
    }
    return 0;
}