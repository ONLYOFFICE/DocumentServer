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
var gUndoInsDelCellsFlag = true;
var maxValCol = 20000;
var maxValRow = 100000;
(function ($, window, undefined) {
    var prot;
    var startRedo = false;
    var g_oAutoFiltersOptionsElementsProperties = {
        val: 0,
        visible: 1
    };
    function AutoFiltersOptionsElements(val, visible) {
        if (! (this instanceof AutoFiltersOptionsElements)) {
            return new AutoFiltersOptionsElements(val, visible);
        }
        this.Properties = g_oAutoFiltersOptionsElementsProperties;
        this.val = val;
        this.val2 = null;
        this.visible = visible;
        this.rep = null;
    }
    AutoFiltersOptionsElements.prototype = {
        constructor: AutoFiltersOptionsElements,
        getType: function () {
            return UndoRedoDataTypes.AutoFiltersOptionsElements;
        },
        getProperties: function () {
            return this.Properties;
        },
        getProperty: function (nType) {
            switch (nType) {
            case this.Properties.val:
                return this.val;
                break;
            case this.Properties.visible:
                return this.visible;
                break;
            }
            return null;
        },
        setProperty: function (nType, value) {
            switch (nType) {
            case this.Properties.val:
                this.val = value;
                break;
            case this.Properties.visible:
                this.visible = value;
                break;
            }
        },
        clone: function () {
            var res = new AutoFiltersOptionsElements();
            res.val = this.val;
            res.val2 = this.val2;
            res.visible = this.visible;
            res.rep = this.rep;
            res.And = this.And;
            res.Properties = this.Properties;
            return res;
        },
        asc_getVal: function () {
            return this.val;
        },
        asc_getVisible: function () {
            return this.visible;
        },
        asc_setVal: function (val) {
            this.val = val;
        },
        asc_setVisible: function (val) {
            this.visible = val;
        }
    };
    function formatTablePictures(options) {
        if (! (this instanceof formatTablePictures)) {
            return new formatTablePictures(options);
        }
        this.name = options.name;
        this.displayName = options.displayName;
        this.type = options.type;
        this.image = options.image;
    }
    formatTablePictures.prototype = {
        constructor: formatTablePictures,
        asc_getName: function () {
            return this.name;
        },
        asc_getDisplayName: function () {
            return this.displayName;
        },
        asc_getType: function () {
            return this.type;
        },
        asc_getImage: function () {
            return this.image;
        }
    };
    var g_oAutoFiltersOptionsProperties = {
        cellId: 0,
        result: 1,
        filter1: 2,
        filter2: 3,
        valFilter1: 4,
        valFilter2: 5,
        isChecked: 6,
        left: 7,
        top: 8,
        sortVal: 9,
        width: 10,
        height: 11,
        isCustomFilter: 12
    };
    function AutoFiltersOptions() {
        if (! (this instanceof AutoFiltersOptions)) {
            return new AutoFiltersOptions();
        }
        this.Properties = g_oAutoFiltersOptionsProperties;
        this.cellId = null;
        this.result = null;
        this.isCustomFilter = null;
        this.filter1 = null;
        this.filter2 = null;
        this.valFilter1 = null;
        this.valFilter2 = null;
        this.isChecked = null;
        this.left = null;
        this.top = null;
        this.sortVal = null;
        this.width = null;
        this.height = null;
        return this;
    }
    AutoFiltersOptions.prototype = {
        constructor: AutoFiltersOptions,
        getType: function () {
            return UndoRedoDataTypes.AutoFiltersOptions;
        },
        getProperties: function () {
            return this.Properties;
        },
        getProperty: function (nType) {
            switch (nType) {
            case this.Properties.cellId:
                return this.cellId;
                break;
            case this.Properties.result:
                return this.result;
                break;
            case this.Properties.filter1:
                return this.filter1;
                break;
            case this.Properties.filter2:
                return this.filter2;
                break;
            case this.Properties.valFilter1:
                return this.valFilter1;
                break;
            case this.Properties.valFilter2:
                return this.valFilter2;
                break;
            case this.Properties.isChecked:
                return this.isChecked;
                break;
            case this.Properties.left:
                return this.left;
                break;
            case this.Properties.top:
                return this.top;
                break;
            case this.Properties.sortVal:
                return this.sortVal;
                break;
            case this.Properties.width:
                return this.width;
                break;
            case this.Properties.height:
                return this.height;
                break;
            case this.Properties.isCustomFilter:
                return this.isCustomFilter;
                break;
            }
            return null;
        },
        setProperty: function (nType, value) {
            switch (nType) {
            case this.Properties.cellId:
                this.cellId = value;
                break;
            case this.Properties.result:
                this.result = value;
                break;
            case this.Properties.filter1:
                this.filter1 = value;
                break;
            case this.Properties.filter2:
                this.filter2 = value;
                break;
            case this.Properties.valFilter1:
                this.valFilter1 = value;
                break;
            case this.Properties.valFilter2:
                this.valFilter2 = value;
                break;
            case this.Properties.isChecked:
                this.isChecked = value;
                break;
            case this.Properties.left:
                this.left = value;
                break;
            case this.Properties.top:
                this.top = value;
                break;
            case this.Properties.sortVal:
                this.sortVal = value;
                break;
            case this.Properties.width:
                this.width = value;
                break;
            case this.Properties.height:
                this.height = value;
                break;
            case this.Properties.isCustomFilter:
                this.isCustomFilter = value;
                break;
            }
        },
        asc_setCellId: function (cellId) {
            this.cellId = cellId;
        },
        asc_setResult: function (result) {
            this.result = result;
        },
        asc_setIsCustomFilter: function (isCustomFilter) {
            this.isCustomFilter = isCustomFilter;
        },
        asc_setFilter1: function (filter1) {
            this.filter1 = filter1;
        },
        asc_setFilter2: function (filter2) {
            this.filter2 = filter2;
        },
        asc_setValFilter1: function (valFilter1) {
            this.valFilter1 = valFilter1;
        },
        asc_setValFilter2: function (valFilter2) {
            this.valFilter2 = valFilter2;
        },
        asc_setIsChecked: function (isChecked) {
            this.isChecked = isChecked;
        },
        asc_setY: function (top) {
            this.top = top;
        },
        asc_setX: function (left) {
            this.left = left;
        },
        asc_setWidth: function (width) {
            this.width = width;
        },
        asc_setHeight: function (height) {
            this.height = height;
        },
        asc_setSortState: function (sortVal) {
            this.sortVal = sortVal;
        },
        asc_getCellId: function () {
            return this.cellId;
        },
        asc_getY: function () {
            return this.top;
        },
        asc_getX: function () {
            return this.left;
        },
        asc_getWidth: function () {
            return this.width;
        },
        asc_getHeight: function () {
            return this.height;
        },
        asc_getResult: function () {
            return this.result;
        },
        asc_getIsCustomFilter: function () {
            return this.isCustomFilter;
        },
        asc_getFilter1: function () {
            return this.filter1;
        },
        asc_getFilter2: function () {
            return this.filter2;
        },
        asc_getValFilter1: function () {
            return this.valFilter1;
        },
        asc_getValFilter2: function () {
            return this.valFilter2;
        },
        asc_getIsChecked: function () {
            return this.isChecked;
        },
        asc_getSortState: function () {
            return this.sortVal;
        }
    };
    var g_oAddFormatTableOptionsProperties = {
        range: 0,
        isTitle: 1
    };
    function AddFormatTableOptions() {
        if (! (this instanceof AddFormatTableOptions)) {
            return new AddFormatTableOptions();
        }
        this.Properties = g_oAddFormatTableOptionsProperties;
        this.range = null;
        this.isTitle = null;
        return this;
    }
    AddFormatTableOptions.prototype = {
        constructor: AddFormatTableOptions,
        getType: function () {
            return UndoRedoDataTypes.AddFormatTableOptions;
        },
        getProperties: function () {
            return this.Properties;
        },
        getProperty: function (nType) {
            switch (nType) {
            case this.Properties.range:
                return this.range;
                break;
            case this.Properties.isTitle:
                return this.isTitle;
                break;
            }
            return null;
        },
        setProperty: function (nType, value) {
            switch (nType) {
            case this.Properties.range:
                this.range = value;
                break;
            case this.Properties.isTitle:
                this.isTitle = value;
                break;
            }
        },
        asc_setRange: function (range) {
            this.range = range;
        },
        asc_setIsTitle: function (isTitle) {
            this.isTitle = isTitle;
        },
        asc_getRange: function () {
            return this.range;
        },
        asc_getIsTitle: function () {
            return this.isTitle;
        }
    };
    function AutoFilters(currentSheet) {
        this.worksheet = currentSheet;
        this.changeFilters = null;
        this.historyTempObj = null;
        this.m_oColor = new CColor(120, 120, 120);
        return this;
    }
    AutoFilters.prototype = {
        constructor: AutoFilters,
        applyAutoFilter: function (type, autoFiltersObject, ar) {
            History.Create_NewPoint();
            History.StartTransaction();
            switch (type) {
            case "mainFilter":
                this._applyMainFilter(ar, autoFiltersObject);
                break;
            case "digitalFilter":
                this._applyDigitalFilter(ar, autoFiltersObject);
                break;
            }
            History.EndTransaction();
        },
        addAutoFilter: function (lTable, ar, openFilter, isTurnOffHistory, addFormatTableOptionsObj, bWithoutFilter) {
            var ws = this.worksheet;
            var bIsActiveSheet = this._isActiveSheet();
            var bIsOpenFilter = undefined !== openFilter && null !== openFilter;
            var activeCells = null === ar ? null : ar.clone();
            var aWs = this._getCurrentWS();
            if (openFilter != undefined) {
                History.TurnOff();
            }
            var paramsForCallBack, paramsForCallBackAdd, filterChange, t = this,
            newRes, rangeShift1, rangeShift, selectionTable, result, isInsertButton = true;
            var rangeFilter, addNameColumn, ref;
            if (!addFormatTableOptionsObj) {
                addNameColumn = true;
            } else {
                if (typeof addFormatTableOptionsObj == "object") {
                    ref = addFormatTableOptionsObj.asc_getRange();
                    addNameColumn = !addFormatTableOptionsObj.asc_getIsTitle();
                    var newRange;
                    if (ref && ref.Ref) {
                        newRange = ref.Ref;
                    } else {
                        if (typeof ref == "string") {
                            newRange = Asc.g_oRangeCache.getAscRange(ref).clone();
                        }
                    }
                    if (newRange) {
                        activeCells = newRange;
                    }
                } else {
                    if (addFormatTableOptionsObj) {
                        addNameColumn = false;
                    }
                }
            }
            var onAddAutoFiltersCallback = function (success) {
                if (success || isTurnOffHistory) {
                    if (addNameColumn) {
                        ws.expandColsOnScroll(true);
                        ws.expandRowsOnScroll(true);
                    }
                    if (paramsForCallBack && paramsForCallBack === "changeAllFOnTable" && addNameColumn && !isTurnOffHistory) {
                        var isAddCellsShiftBottom = t._isAddCellsShiftBottom(activeCells);
                        if (isAddCellsShiftBottom === true) {
                            ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
                            return false;
                        } else {
                            if (isAddCellsShiftBottom === "error") {
                                ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
                                return false;
                            }
                        }
                    }
                    if (isTurnOffHistory) {
                        History.TurnOff();
                    }
                    History.Create_NewPoint();
                    History.StartTransaction();
                    if (selectionTable) {
                        var oSelection = History.GetSelection();
                        if (null != oSelection) {
                            oSelection = oSelection.clone();
                            oSelection.assign(selectionTable.c1, selectionTable.r1, selectionTable.c2, selectionTable.r2);
                            History.SetSelectionRedo(oSelection);
                        }
                    }
                    if (rangeShift && rangeShift.r1 != undefined) {
                        rangeShift = ws.model.getRange3(rangeShift.r1, rangeShift.c1, rangeShift.r1, rangeShift.c2);
                    }
                    var isUpdateRange = null;
                    var recalc = false;
                    var changeRows = false;
                    if (paramsForCallBack) {
                        switch (paramsForCallBack) {
                        case "changeStyle":
                            var cloneFilterOld = filterChange.clone(aWs);
                            filterChange.TableStyleInfo.Name = lTable;
                            rangeFilter = filterChange.Ref;
                            t._setColorStyleTable(rangeFilter, filterChange);
                            isUpdateRange = rangeFilter;
                            t._addHistoryObj(cloneFilterOld, historyitem_AutoFilter_Add, {
                                activeCells: activeCells,
                                lTable: lTable
                            },
                            null, rangeFilter);
                            break;
                        case "deleteFilter":
                            var isReDrawFilter = false;
                            if (apocal.all) {
                                newRes = {
                                    result: allAutoFilters[apocal.num].result,
                                    isVis: false
                                };
                                if (!aWs.AutoFilter) {
                                    History.EndTransaction();
                                    if (isTurnOffHistory) {
                                        History.TurnOn();
                                    }
                                    return;
                                }
                                result = newRes.result;
                                changesElemHistory = aWs.AutoFilter.clone();
                                aWs.AutoFilter = null;
                            } else {
                                if (aWs.AutoFilter) {
                                    newRes = {
                                        result: allAutoFilters[apocal.num - 1].result,
                                        isVis: false
                                    };
                                    changesElemHistory = aWs.TableParts[apocal.num - 1].clone(aWs);
                                    aWs.TableParts[apocal.num - 1].AutoFilter = null;
                                    isReDrawFilter = aWs.TableParts[apocal.num - 1].clone(aWs);
                                } else {
                                    newRes = {
                                        result: allAutoFilters[apocal.num].result,
                                        isVis: false
                                    };
                                    changesElemHistory = aWs.TableParts[apocal.num].clone(aWs);
                                    aWs.TableParts[apocal.num].AutoFilter = null;
                                    isReDrawFilter = aWs.TableParts[apocal.num].clone(aWs);
                                }
                            }
                            t._showButtonFlag(newRes.result);
                            t._addHistoryObj(changesElemHistory, historyitem_AutoFilter_Add, {
                                activeCells: activeCells,
                                lTable: lTable
                            },
                            null, changesElemHistory.Ref);
                            var isInsert = false;
                            if ((changesElemHistory.AutoFilter && changesElemHistory.AutoFilter.FilterColumns && changesElemHistory.AutoFilter.FilterColumns.length) || (changesElemHistory.FilterColumns && changesElemHistory.FilterColumns.length)) {
                                for (var i = apocal.range.r1; i <= apocal.range.r2; i++) {
                                    if (ws.model.getRowHidden(i)) {
                                        ws.model.setRowHidden(false, i, i);
                                        isInsert = true;
                                    }
                                }
                            }
                            if (bIsActiveSheet) {
                                t._addButtonAF(newRes);
                            }
                            if (isReDrawFilter && isReDrawFilter.TableColumns && isReDrawFilter.result) {
                                t._reDrawCurrentFilter(null, null, isReDrawFilter);
                            }
                            if (openFilter == undefined) {
                                t.drawAutoF();
                            }
                            isUpdateRange = changesElemHistory.Ref;
                            changeRows = true;
                            break;
                        case "changeAllFOnTable":
                            newRes = {
                                result: allAutoFilters[apocal.num].result,
                                isVis: false
                            };
                            changesElemHistory = aWs.AutoFilter.clone();
                            aWs.AutoFilter = null;
                            if (addNameColumn && rangeShift && !isTurnOffHistory) {
                                ws.model._moveRange(activeCells, new Asc.Range(activeCells.c1, activeCells.r1 + 1, activeCells.c2, activeCells.r2 + 1));
                                ws.cellCommentator.updateCommentsDependencies(true, 4, rangeShift.bbox);
                                ws.objectRender && ws.objectRender.updateDrawingObject(true, 4, rangeShift.bbox);
                            }
                            tableColumns = t._generateColumnNameWithoutTitle(activeCells);
                            var cloneAC = activeCells.clone();
                            if (addNameColumn) {
                                activeCells.r2 = activeCells.r2 + 1;
                                cloneAC.r1 = cloneAC.r1 + 1;
                                cloneAC.r2 = cloneAC.r1;
                                cloneAC.c2 = cloneAC.c1;
                            }
                            ws.model.getRange3(activeCells.r1, activeCells.c1, activeCells.r2, activeCells.c2).unmerge();
                            changeRows = true;
                            for (var i = activeCells.r1; i <= activeCells.r2; i++) {
                                if (ws.model.getRowHidden(i)) {
                                    ws.model.setRowHidden(false, i, i);
                                    isInsert = true;
                                }
                            }
                            var n = 0;
                            result = [];
                            for (col = activeCells.c1; col <= activeCells.c2; col++) {
                                var idCell = new CellAddress(activeCells.r1, col, 0);
                                var idCellNext = new CellAddress(activeCells.r2, col, 0);
                                result[n] = new Result();
                                result[n].x = ws.cols[col].left;
                                result[n].y = ws.rows[activeCells.r1].top;
                                result[n].width = ws.cols[col].width;
                                result[n].height = ws.rows[activeCells.r1].height;
                                result[n].id = idCell.getID();
                                result[n].idNext = idCellNext.getID();
                                n++;
                            }
                            if (openFilter == undefined) {
                                t._addNewFilter(result, tableColumns, aWs, isAll, lTable);
                            }
                            if (!isAll) {
                                t._setColorStyleTable(aWs.TableParts[aWs.TableParts.length - 1].Ref, aWs.TableParts[aWs.TableParts.length - 1], null, true);
                                var firstCell = ws.model.getCell(new CellAddress((result[0].id)));
                                var endCell = ws.model.getCell(new CellAddress((result[result.length - 1].idNext)));
                                var arn = {
                                    r1: firstCell.first.row,
                                    r2: endCell.first.row,
                                    c1: firstCell.first.col,
                                    c2: endCell.first.col
                                };
                            }
                            if (openFilter == undefined) {
                                if (isAll) {
                                    aWs.AutoFilter = new AutoFilter();
                                    aWs.AutoFilter.result = result;
                                    aWs.AutoFilter.Ref = new Asc.Range(activeCells.c1, activeCells.r1, activeCells.c2, activeCells.r2);
                                }
                            }
                            newRes = {
                                result: result,
                                isVis: true
                            };
                            changesElemHistory.refTable = new Asc.Range(activeCells.c1, activeCells.r1, activeCells.c2, activeCells.r2);
                            if (addNameColumn) {
                                changesElemHistory.addColumn = true;
                            }
                            t._addHistoryObj(changesElemHistory, historyitem_AutoFilter_Add, {
                                activeCells: cloneAC,
                                lTable: lTable,
                                addFormatTableOptionsObj: addFormatTableOptionsObj
                            },
                            null, changesElemHistory.refTable);
                            if (isInsertButton) {
                                if (bIsActiveSheet) {
                                    t._addButtonAF(newRes);
                                }
                            } else {
                                if (!t.allButtonAF) {
                                    t.allButtonAF = [];
                                }
                            }
                            if (arn && bIsActiveSheet && !bIsOpenFilter) {
                                if (openFilter == undefined) {
                                    arn.c1 = arn.c1 - 1;
                                    arn.c2 = arn.c2 - 1;
                                    arn.r1 = arn.r1 - 1;
                                    arn.r2 = arn.r2 - 1;
                                }
                            }
                            isUpdateRange = activeCells;
                            recalc = true;
                            break;
                        case "changeStyleWithoutFilter":
                            changesElemHistory = filterChange.clone(aWs);
                            filterChange.TableStyleInfo.Name = lTable;
                            rangeFilter = filterChange.Ref;
                            t._setColorStyleTable(rangeFilter, filterChange);
                            t._addHistoryObj(changesElemHistory, historyitem_AutoFilter_Add, {
                                activeCells: activeCells,
                                lTable: lTable
                            },
                            rangeFilter);
                            isUpdateRange = rangeFilter;
                            break;
                        case "setStyleTableForAutoFilter":
                            changesElemHistory = allAutoFilters[apocal.num - 1].clone(aWs);
                            var ref = allAutoFilters[apocal.num - 1].Ref;
                            allAutoFilters[apocal.num - 1].AutoFilter = new AutoFilter();
                            allAutoFilters[apocal.num - 1].AutoFilter.Ref = ref;
                            isUpdateRange = ref;
                            break;
                        case "setStyleTableForAutoFilter1":
                            changesElemHistory = allAutoFilters[apocal.num].clone(aWs);
                            var ref = allAutoFilters[apocal.num].Ref;
                            allAutoFilters[apocal.num].AutoFilter = new AutoFilter();
                            allAutoFilters[apocal.num].AutoFilter.Ref = allAutoFilters[apocal.num].Ref;
                            isUpdateRange = allAutoFilters[apocal.num].Ref;
                            break;
                        }
                        if (paramsForCallBack == "setStyleTableForAutoFilter1" || paramsForCallBack == "setStyleTableForAutoFilter") {
                            if (bIsActiveSheet) {
                                t._addButtonAF(newRes);
                            }
                            if (ref) {
                                rangeFilter = ref;
                            } else {
                                rangeFilter = ws.visibleRange;
                            }
                            t._addHistoryObj(changesElemHistory, historyitem_AutoFilter_Add, {
                                activeCells: activeCells,
                                lTable: lTable
                            },
                            null, rangeFilter);
                        }
                    } else {
                        if (paramsForCallBackAdd) {
                            if (paramsForCallBackAdd == "addTableFilterOneCell" || paramsForCallBackAdd == "addTableFilterManyCells") {
                                var tempCells = activeCells;
                                if (paramsForCallBackAdd == "addTableFilterOneCell") {
                                    tempCells = mainAdjacentCells;
                                }
                                if ((tempCells.r2 - tempCells.r1) > maxValRow) {
                                    tempCells.r2 = tempCells.r1 + maxValRow;
                                    if (addNameColumn) {
                                        tempCells.r2--;
                                    }
                                }
                                if ((tempCells.c2 - tempCells.c1) > maxValCol) {
                                    tempCells.c2 = tempCells.c1 + maxValCol;
                                }
                                if (!isTurnOffHistory && addNameColumn) {
                                    var isAddCellsShiftBottom = t._isAddCellsShiftBottom(tempCells);
                                    if (isAddCellsShiftBottom === true) {
                                        ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
                                        History.EndTransaction();
                                        if (isTurnOffHistory) {
                                            History.TurnOn();
                                        }
                                        return false;
                                        var selection = ws.activeRange;
                                        ws.setSelection(rangeShift.bbox);
                                        ws.changeWorksheet("insCell", 2);
                                        ws.setSelection(selection);
                                        ws.cellCommentator.updateCommentsDependencies(true, 4, rangeShift.bbox);
                                        ws.objectRender && ws.objectRender.updateDrawingObject(true, 4, rangeShift.bbox);
                                    } else {
                                        if (isAddCellsShiftBottom === "error") {
                                            ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
                                            History.EndTransaction();
                                            if (isTurnOffHistory) {
                                                History.TurnOn();
                                            }
                                            return false;
                                        } else {
                                            ws.model._moveRange(tempCells, new Asc.Range(tempCells.c1, tempCells.r1 + 1, tempCells.c2, tempCells.r2 + 1));
                                        }
                                    }
                                }
                                if (lTable) {
                                    if (addNameColumn && !isTurnOffHistory) {
                                        ws.model.getRange3(tempCells.r1, tempCells.c1, tempCells.r2 + 1, tempCells.c2).unmerge();
                                    } else {
                                        ws.model.getRange3(tempCells.r1, tempCells.c1, tempCells.r2, tempCells.c2).unmerge();
                                    }
                                    changeRows = true;
                                }
                                tableColumns = t._generateColumnsName(addNameColumn, tempCells, isTurnOffHistory);
                                if (addNameColumn && !isTurnOffHistory) {
                                    tempCells.r2 = tempCells.r2 + 1;
                                }
                            }
                            result = t._getResultAddFilter(paramsForCallBackAdd, activeCells, mainAdjacentCells, lTable);
                            if (result !== false) {
                                activeCells = result.activeCells;
                                mainAdjacentCells = result.mainAdjacentCells;
                                result = result.result;
                                if (! (paramsForCallBackAdd == "addTableFilterOneCell" || paramsForCallBackAdd == "addTableFilterManyCells")) {
                                    if (mainAdjacentCells) {
                                        isUpdateRange = mainAdjacentCells;
                                    } else {
                                        isUpdateRange = activeCells;
                                    }
                                }
                            } else {
                                ws.handlers.trigger("selectionChanged", ws.getSelectionInfo());
                                History.EndTransaction();
                                if (isTurnOffHistory) {
                                    History.TurnOn();
                                }
                                return false;
                            }
                        }
                    }
                    if (paramsForCallBackAdd) {
                        if (openFilter == undefined) {
                            t._addNewFilter(result, tableColumns, aWs, isAll, lTable, bWithoutFilter);
                        }
                        if (!isAll) {
                            t._setColorStyleTable(aWs.TableParts[aWs.TableParts.length - 1].Ref, aWs.TableParts[aWs.TableParts.length - 1], null, true);
                            var firstCell = ws.model.getCell(new CellAddress((result[0].id)));
                            var endCell = ws.model.getCell(new CellAddress((result[result.length - 1].idNext)));
                            var arn = {
                                r1: firstCell.first.row,
                                r2: endCell.first.row,
                                c1: firstCell.first.col,
                                c2: endCell.first.col
                            };
                        }
                        if (openFilter == undefined) {
                            if (isAll) {
                                if (!aWs.AutoFilter) {
                                    aWs.AutoFilter = new AutoFilter();
                                }
                                aWs.AutoFilter.result = result;
                                aWs.AutoFilter.Ref = Asc.g_oRangeCache.getAscRange(result[0].id + ":" + result[result.length - 1].idNext).clone();
                            }
                        }
                        newRes = {
                            result: result,
                            isVis: true
                        };
                        var ref = {
                            Ref: Asc.g_oRangeCache.getAscRange(result[0].id + ":" + result[result.length - 1].idNext).clone()
                        };
                        if (addNameColumn && addFormatTableOptionsObj) {
                            addFormatTableOptionsObj.range = ref;
                        }
                        t._addHistoryObj(ref, historyitem_AutoFilter_Add, {
                            activeCells: activeCells,
                            lTable: lTable,
                            addFormatTableOptionsObj: addFormatTableOptionsObj
                        },
                        null, ref.Ref, bWithoutFilter);
                        if (isInsertButton && !bWithoutFilter) {
                            t._addButtonAF(newRes);
                        } else {
                            if (!t.allButtonAF) {
                                t.allButtonAF = [];
                            }
                        }
                        if (arn && bIsActiveSheet && !bIsOpenFilter) {
                            if (openFilter == undefined) {
                                arn.c1 = arn.c1 - 1;
                                arn.c2 = arn.c2 - 1;
                                arn.r1 = arn.r1 - 1;
                                arn.r2 = arn.r2 - 1;
                            }
                            rangeFilter = new Asc.Range(arn.c1, arn.r1, arn.c2, arn.r2);
                        }
                        if (paramsForCallBackAdd && !bIsOpenFilter && !aWs.workbook.bCollaborativeChanges && !aWs.workbook.bUndoChanges && !aWs.workbook.bRedoChanges && (paramsForCallBackAdd == "addTableFilterOneCell" || paramsForCallBackAdd == "addTableFilterManyCells")) {
                            ws._onUpdateFormatTable(rangeFilter, true, changeRows);
                        } else {
                            if (isUpdateRange != null && paramsForCallBackAdd && !bIsOpenFilter && !aWs.workbook.bCollaborativeChanges && !aWs.workbook.bUndoChanges && !aWs.workbook.bRedoChanges) {
                                ws._onUpdateFormatTable(rangeFilter, null, changeRows);
                            }
                        }
                        History.EndTransaction();
                        if (isTurnOffHistory) {
                            History.TurnOn();
                        }
                    } else {
                        if (isUpdateRange != null && !bIsOpenFilter && !aWs.workbook.bCollaborativeChanges && !aWs.workbook.bUndoChanges && !aWs.workbook.bRedoChanges) {
                            ws._onUpdateFormatTable(isUpdateRange, recalc, changeRows);
                        }
                        History.EndTransaction();
                        if (isTurnOffHistory) {
                            History.TurnOn();
                        }
                    }
                    return true;
                } else {
                    return false;
                }
            };
            var isAll = true;
            if (lTable) {
                isAll = false;
            }
            if ((aWs.AutoFilter || aWs.TableParts) && openFilter == undefined) {
                var apocal = this._searchFilters(activeCells, isAll);
                var changesElemHistory = null;
                if (apocal == "error") {
                    ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterDataRangeError, c_oAscError.Level.NoCritical);
                    return false;
                } else {
                    if (apocal && apocal.changeStyle) {
                        var allAutoFilters = aWs.TableParts;
                        if (apocal.all) {
                            allAutoFilters = [aWs.AutoFilter];
                        }
                        if (aWs.AutoFilter) {
                            filterChange = allAutoFilters[apocal.num - 1];
                        } else {
                            filterChange = allAutoFilters[apocal.num];
                        }
                        rangeShift = filterChange.Ref;
                        paramsForCallBack = "changeStyle";
                        rangeShift1 = rangeShift;
                        if (isTurnOffHistory) {
                            onAddAutoFiltersCallback(true);
                        } else {
                            ws._isLockedCells(rangeShift1, null, onAddAutoFiltersCallback);
                        }
                        return;
                    } else {
                        if ((apocal && apocal.containsFilter != false && !lTable) || (apocal && apocal.changeAllFOnTable)) {
                            var allAutoFilters = aWs.TableParts;
                            if (apocal.all) {
                                allAutoFilters = [aWs.AutoFilter];
                            }
                            newRes = {};
                            var currentFil;
                            if (apocal.all) {
                                currentFil = allAutoFilters[apocal.num];
                            } else {
                                if (aWs.AutoFilter) {
                                    currentFil = allAutoFilters[apocal.num - 1];
                                } else {
                                    currentFil = allAutoFilters[apocal.num];
                                }
                            }
                            rangeShift = currentFil.Ref;
                            if (apocal.changeAllFOnTable) {
                                activeCells = currentFil.Ref;
                                var rowAdd = 0;
                                var tableColumns = [];
                                rangeShift = activeCells;
                                if (addNameColumn) {
                                    rowAdd = 1;
                                }
                                paramsForCallBack = "changeAllFOnTable";
                                rangeShift1 = t._getAscRange(activeCells, rowAdd);
                                selectionTable = rangeShift1.clone();
                            } else {
                                paramsForCallBack = "deleteFilter";
                                rangeShift1 = t._getAscRange(rangeShift);
                            }
                            if (isTurnOffHistory || paramsForCallBack === "deleteFilter") {
                                onAddAutoFiltersCallback(true);
                            } else {
                                ws._isLockedCells(rangeShift1, null, onAddAutoFiltersCallback);
                            }
                            return;
                        } else {
                            if (apocal && apocal.containsFilter == false) {
                                var allAutoFilters = aWs.TableParts;
                                if (apocal.all) {
                                    allAutoFilters = [aWs.AutoFilter];
                                }
                                if (!apocal.all && lTable) {
                                    if (aWs.AutoFilter) {
                                        filterChange = allAutoFilters[apocal.num - 1];
                                    } else {
                                        filterChange = allAutoFilters[apocal.num];
                                    }
                                    rangeShift = filterChange.Ref;
                                    paramsForCallBack = "changeStyleWithoutFilter";
                                    rangeShift1 = rangeShift;
                                    if (isTurnOffHistory) {
                                        onAddAutoFiltersCallback(true);
                                    } else {
                                        ws._isLockedCells(rangeShift1, null, onAddAutoFiltersCallback);
                                    }
                                    return;
                                } else {
                                    if (aWs.AutoFilter) {
                                        newRes = {
                                            result: allAutoFilters[apocal.num - 1].result,
                                            isVis: true
                                        };
                                        var ourFilter = allAutoFilters[apocal.num - 1];
                                        rangeShift = ourFilter.Ref;
                                        paramsForCallBack = "setStyleTableForAutoFilter";
                                        rangeShift1 = rangeShift;
                                        if (isTurnOffHistory) {
                                            onAddAutoFiltersCallback(true);
                                        } else {
                                            ws._isLockedCells(rangeShift1, null, onAddAutoFiltersCallback);
                                        }
                                        return;
                                    } else {
                                        newRes = {
                                            result: allAutoFilters[apocal.num].result,
                                            isVis: true
                                        };
                                        var ourFilter = allAutoFilters[apocal.num];
                                        rangeShift = ourFilter.Ref;
                                        paramsForCallBack = "setStyleTableForAutoFilter1";
                                        rangeShift1 = rangeShift;
                                        if (isTurnOffHistory) {
                                            onAddAutoFiltersCallback(true);
                                        } else {
                                            ws._isLockedCells(rangeShift1, null, onAddAutoFiltersCallback);
                                        }
                                        return;
                                    }
                                }
                            } else {
                                if (apocal && apocal.containsFilter == false && lTable) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
            var mergedRange;
            if (activeCells && activeCells != null) {
                mergedRange = ws.model.getRange3(activeCells.r1, activeCells.c1, activeCells.r2, activeCells.c2).hasMerged();
            }
            if (openFilter != undefined) {
                if (openFilter == "all") {
                    if (aWs.AutoFilter.Ref == "" || !aWs.AutoFilter.Ref) {
                        return;
                    }
                    allFil = aWs.AutoFilter.Ref;
                    var n = 0;
                    result = [];
                    var startCol = allFil.c1;
                    var endCol = allFil.c2;
                    var endRow = allFil.r2;
                    if (ws.cols.length <= endCol) {
                        ws.expandColsOnScroll(false, true, endCol + 1);
                    }
                    if (ws.rows.length <= endRow) {
                        ws.expandRowsOnScroll(false, true, endRow + 1);
                    }
                    for (var col = startCol; col <= endCol; col++) {
                        var idCell = new CellAddress(allFil.r1, col, 0);
                        var idCellNext = new CellAddress(allFil.r2, col, 0);
                        var cellId = idCell.getID();
                        result[n] = new Result();
                        result[n].x = ws.cols[col].left;
                        result[n].y = ws.rows[allFil.r1].top;
                        result[n].width = ws.cols[col].width;
                        result[n].height = ws.rows[allFil.r1].height;
                        result[n].id = cellId;
                        result[n].idNext = idCellNext.getID();
                        result[n].showButton = this._isShowButton(aWs.AutoFilter, col - startCol);
                        n++;
                    }
                } else {
                    if (aWs.TableParts[openFilter].Ref == "" || !aWs.TableParts[openFilter].Ref) {
                        return;
                    }
                    var allFil = aWs.TableParts[openFilter].Ref;
                    var n = 0;
                    result = [];
                    var startCol = allFil.c1;
                    var endCol = allFil.c2;
                    for (col = startCol; col <= endCol; col++) {
                        var idCell = new CellAddress(allFil.r1, col, 0);
                        var idCellNext = new CellAddress(allFil.r2, col, 0);
                        var cellId = idCell.getID();
                        result[n] = new Result();
                        result[n].x = ws.cols[col].left;
                        result[n].y = ws.rows[allFil.r1].top;
                        result[n].width = ws.cols[col].width;
                        result[n].height = ws.rows[allFil.r1].height;
                        result[n].id = cellId;
                        result[n].idNext = idCellNext.getID();
                        result[n].showButton = this._isShowButton(aWs.TableParts[openFilter].AutoFilter, col - startCol);
                        n++;
                    }
                }
            } else {
                if ((activeCells.r1 == activeCells.r2 && activeCells.c1 == activeCells.c2) || (!lTable && mergedRange && activeCells.r1 == mergedRange.r1 && activeCells.c1 == mergedRange.c1 && activeCells.r2 == mergedRange.r2 && activeCells.c2 == mergedRange.c2)) {
                    var mainAdjacentCells = this._getAdjacentCellsAF(activeCells, aWs);
                    rangeShift = ws.model.getRange3(mainAdjacentCells.r1, mainAdjacentCells.c1, mainAdjacentCells.r1, mainAdjacentCells.c2);
                    var rowAdd = 0;
                    if (lTable) {
                        if (!mainAdjacentCells) {
                            mainAdjacentCells = activeCells;
                        }
                        var tableColumns = [];
                        if (addNameColumn && !isTurnOffHistory) {
                            rowAdd = 1;
                        }
                        paramsForCallBackAdd = "addTableFilterOneCell";
                    } else {
                        paramsForCallBackAdd = "addAutoFilterOneCell";
                    }
                    rangeShift1 = t._getAscRange(mainAdjacentCells, rowAdd);
                    if (lTable) {
                        selectionTable = rangeShift1.clone();
                    }
                    if (isTurnOffHistory || !lTable) {
                        onAddAutoFiltersCallback(true);
                    } else {
                        ws._isLockedCells(rangeShift1, null, onAddAutoFiltersCallback);
                    }
                    return;
                } else {
                    rangeShift = ws.model.getRange3(activeCells.r1, activeCells.c1, activeCells.r1, activeCells.c2);
                    var rowAdd = 0;
                    if (lTable) {
                        var tableColumns = [];
                        if (addNameColumn && !isTurnOffHistory) {
                            rowAdd = 1;
                        }
                        paramsForCallBackAdd = "addTableFilterManyCells";
                    } else {
                        paramsForCallBackAdd = "addAutoFilterManyCells";
                    }
                    rangeShift1 = t._getAscRange(activeCells, rowAdd);
                    if (lTable) {
                        selectionTable = rangeShift1.clone();
                    }
                    if (isTurnOffHistory || !lTable) {
                        onAddAutoFiltersCallback(true);
                    } else {
                        ws._isLockedCells(rangeShift1, null, onAddAutoFiltersCallback);
                    }
                    return;
                }
            }
            if (!isAll && openFilter != undefined) {
                this._setColorStyleTable(aWs.TableParts[openFilter].Ref, aWs.TableParts[openFilter]);
            }
            if (openFilter != undefined) {
                if (openFilter == "all") {
                    aWs.AutoFilter.result = result;
                } else {
                    if (!aWs.TableParts[openFilter].AutoFilter) {
                        isInsertButton = false;
                    }
                    aWs.TableParts[openFilter].result = result;
                }
                newRes = {
                    result: result,
                    isVis: true
                };
                if (isInsertButton) {
                    this._addButtonAF(newRes);
                } else {
                    if (!this.allButtonAF) {
                        this.allButtonAF = [];
                    }
                }
                History.TurnOn();
                return true;
            }
        },
        checkCursor: function (x, y, offsetX, offsetY, frozenObj) {
            if (!this.allButtonAF) {
                return false;
            }
            var ws = this.worksheet;
            var offset = ws.getCellsOffset(1);
            var width = 11.25;
            var height = 11.25;
            var checkFrozenArea = this._checkClickFrozenArea(x, y, offsetX, offsetY, frozenObj);
            if (checkFrozenArea) {
                x = checkFrozenArea.x;
                y = checkFrozenArea.y;
            }
            var button;
            for (var i = 0; i < this.allButtonAF.length; i++) {
                button = this.allButtonAF[i];
                var x1 = button.x;
                var x2 = button.x + width;
                var y1 = button.y;
                var y2 = button.y + height;
                if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
                    return {
                        id: i,
                        target: c_oTargetType.FilterObject,
                        col: -1,
                        row: -1
                    };
                }
            }
            return false;
        },
        onAutoFilterClick: function (idFilter) {
            if (!this.allButtonAF) {
                return;
            }
            var kof = 96 / 72;
            this._showAutoFilterDialog(this.allButtonAF[idFilter], kof);
        },
        drawAutoF: function (updatedRange, offsetX, offsetY) {
            var buttons = this.allButtonAF;
            var ws = this.worksheet;
            var aWs = this._getCurrentWS();
            if (aWs.workbook.bUndoChanges || aWs.workbook.bRedoChanges) {
                return;
            }
            var filters;
            if (buttons) {
                for (var i = 0; i < buttons.length; i++) {
                    if (updatedRange && !this._isNeedDrawButton(buttons[i], updatedRange)) {
                        continue;
                    }
                    var oCell = new CellAddress(buttons[i].id);
                    var col = oCell.getCol0();
                    var row = oCell.getRow0();
                    var width = 13;
                    var height = 13;
                    var rowHeight = ws.rows[row].height;
                    if (rowHeight < height) {
                        width = width * (rowHeight / height);
                        height = rowHeight;
                    }
                    var x1 = ws.cols[col].left + ws.cols[col].width - width - 0.5;
                    var y1 = ws.rows[row].top + ws.rows[row].height - height - 0.5;
                    buttons[i].x = x1;
                    buttons[i].y = y1;
                    buttons[i].x1 = ws.cols[col].left;
                    buttons[i].y1 = ws.rows[row].top;
                    buttons[i].width = ws.cols[col].width;
                    buttons[i].height = ws.rows[row].height;
                    var isSetFilter = false;
                    filters = null;
                    var activeCells = this._idToRange(buttons[i].id);
                    var indexFilter = this._findArrayFromAllFilter3(activeCells, buttons[i].id);
                    if (indexFilter != undefined && indexFilter.toString().search(":") > -1) {
                        var aWs = this._getCurrentWS();
                        var filtersOp = indexFilter.split(":");
                        var currentFilter;
                        var curFilForSort;
                        if (filtersOp[0] == "all") {
                            currentFilter = aWs.AutoFilter;
                            curFilForSort = aWs.AutoFilter;
                        } else {
                            currentFilter = aWs.TableParts[filtersOp[0]].AutoFilter;
                            curFilForSort = aWs.TableParts[filtersOp[0]];
                        }
                        if (currentFilter && currentFilter.FilterColumns) {
                            filters = currentFilter.FilterColumns;
                            for (var k = 0; k < filters.length; k++) {
                                var colId = filters[k].ColId;
                                if (filters[k].ShowButton == false && currentFilter.result) {
                                    for (var sb = filters[k].ColId; sb < currentFilter.result.length; sb++) {
                                        if (currentFilter.result[sb].showButton != false) {
                                            colId = sb;
                                            break;
                                        }
                                    }
                                }
                                if (colId == filtersOp[1] && (filters[k].Filters != null || filters[k].CustomFiltersObj != null)) {
                                    isSetFilter = true;
                                    filters = filters[k];
                                    break;
                                }
                            }
                        } else {
                            isSetFilter = false;
                        }
                        var hiddenRowsObj = this._getHiddenRows(buttons[i].id, buttons[i].idNext, filters);
                        buttons[i].hiddenRows = hiddenRowsObj;
                        if (curFilForSort.result) {
                            for (var n = 0; n < curFilForSort.result.length; n++) {
                                if (curFilForSort.result[n].id == buttons[i].id) {
                                    curFilForSort.result[n].hiddenRows = hiddenRowsObj;
                                }
                            }
                        }
                        var sortState = undefined;
                        if (curFilForSort.SortState) {
                            if (curFilForSort.SortState.SortConditions && curFilForSort.SortState.SortConditions.length != 0 && curFilForSort.SortState.SortConditions[0].Ref.split(":")[0] == buttons[i].id) {
                                sortState = !curFilForSort.SortState.SortConditions[0].ConditionDescending;
                            }
                        }
                        var filOptions = {
                            sortState: sortState,
                            isSetFilter: isSetFilter,
                            row: row,
                            col: col
                        };
                        if (buttons[i].x1 >= ws.cols[0].left && buttons[i].y1 >= ws.rows[0].top) {
                            this._drawButton(x1 - offsetX, y1 - offsetY, filOptions);
                        }
                    }
                }
            }
        },
        insertColumn: function (type, val, insertType) {
            var activeCells;
            var DeleteColumns = ((insertType == c_oAscDeleteOptions.DeleteColumns && type == "delCell") || insertType == c_oAscInsertOptions.InsertColumns) ? true : false;
            activeCells = val.clone();
            val = activeCells.c2 - activeCells.c1 + 1;
            this.changeFilters = {};
            if (DeleteColumns) {
                activeCells.r1 = 0;
                activeCells.r2 = gc_nMaxRow - 1;
            }
            var colInsert = activeCells.c1;
            if (type == "insColBefore" || type == "insCell") {
                colInsert = activeCells.c1;
            } else {
                if (type == "insColAfter") {
                    colInsert = activeCells.c2 + 1;
                } else {
                    if (type == "delCell") {
                        val = activeCells.c1 - activeCells.c2 - 1;
                    }
                }
            }
            this.historyTempObj = {};
            this._changeFiltersAfterInsertCells(colInsert, val, "insCol", activeCells, insertType);
            this._addToHistoryFromTempObj();
            this._changeFiltersApply();
            this._updateButtonArray();
        },
        insertRows: function (type, val, insertType) {
            var activeCells;
            var DeleteRows = ((insertType == c_oAscDeleteOptions.DeleteRows && type == "delCell") || insertType == c_oAscInsertOptions.InsertRows) ? true : false;
            this.changeFilters = {};
            activeCells = val.clone();
            val = activeCells.r2 - activeCells.r1 + 1;
            if (DeleteRows) {
                activeCells.c1 = 0;
                activeCells.c2 = gc_nMaxCol - 1;
            }
            var colInsert = activeCells.r1;
            if (type == "insColBefore" || type == "insCell") {
                colInsert = activeCells.r1;
            } else {
                if (type == "insColAfter") {
                    colInsert = activeCells.r2 + 1;
                } else {
                    if (type == "delCell") {
                        val = activeCells.r1 - activeCells.r2 - 1;
                    }
                }
            }
            this.historyTempObj = {};
            this._changeFiltersAfterInsertCells(colInsert, val, "insRow", activeCells, insertType);
            this._addToHistoryFromTempObj();
            this._changeFiltersApply();
            this._updateButtonArray();
        },
        _addToHistoryFromTempObj: function () {
            History.StartTransaction();
            History.Create_NewPoint();
            var point;
            if (this.historyTempObj.changePoints && this.historyTempObj.changePoints.length) {
                for (var i = 0; i < this.historyTempObj.changePoints.length; i++) {
                    point = this.historyTempObj.changePoints[i];
                    this._addHistoryObj(point[0], point[1], point[2], point[3], point[4], point[5], point[6]);
                }
            }
            if (this.historyTempObj.emptyPoints && this.historyTempObj.emptyPoints.length) {
                for (var i = 0; i < this.historyTempObj.emptyPoints.length; i++) {
                    point = this.historyTempObj.emptyPoints[i];
                    this._addHistoryObj(point[0], point[1], point[2], point[3], point[4], point[5], point[6]);
                }
            }
            this.historyTempObj = null;
            History.EndTransaction();
        },
        _changeFiltersApply: function () {
            var aWs = this._getCurrentWS();
            if (this.changeFilters.AutoFilter) {
                aWs.AutoFilter = this.changeFilters.AutoFilter;
            }
            if (this.changeFilters.TableParts && this.changeFilters.TableParts.length && aWs.TableParts && aWs.TableParts.length) {
                for (var i = 0; i < this.changeFilters.TableParts.length; i++) {
                    for (var j = 0; j < aWs.TableParts.length; j++) {
                        if (this.changeFilters.TableParts[i].DisplayName == aWs.TableParts[j].DisplayName) {
                            if (aWs.TableParts[j].AutoFilter != null) {
                                this._addButtonAF({
                                    result: aWs.TableParts[j].result,
                                    isVis: false
                                });
                            }
                            aWs.TableParts[j] = this.changeFilters.TableParts[i].filter;
                            if (aWs.TableParts[j].AutoFilter != null) {
                                this._addButtonAF({
                                    result: aWs.TableParts[j].result,
                                    isVis: true
                                });
                            }
                            break;
                        }
                    }
                }
            }
            if (this.changeFilters.deleteFilters && this.changeFilters.deleteFilters.length) {
                for (var i = 0; i < this.changeFilters.deleteFilters.length; i++) {
                    if (this.changeFilters.deleteFilters[i] === undefined) {
                        aWs.AutoFilter = null;
                    } else {
                        if (aWs.TableParts) {
                            for (var j = 0; j < aWs.TableParts.length; j++) {
                                if (aWs.TableParts[j].DisplayName == this.changeFilters.deleteFilters[i]) {
                                    aWs.TableParts.splice(j, 1);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            this._reDrawFilters();
            this.changeFilters = null;
        },
        sortColFilter: function (type, cellId, ar, isTurnOffHistory) {
            var aWs = this._getCurrentWS();
            var ws = this.worksheet;
            var currentFilter;
            var curCell;
            var sortRange;
            var oldFilter;
            var activeCells;
            var newEndId;
            var t = this;
            var selectionRange;
            var sortCol;
            var onSortAutoFilterCallback = function (success) {
                if (success) {
                    if (isTurnOffHistory) {
                        History.TurnOff();
                    }
                    History.Create_NewPoint();
                    History.StartTransaction();
                    if (!currentFilter.SortState) {
                        currentFilter.SortState = new SortState();
                        currentFilter.SortState.Ref = currentFilter.Ref;
                        currentFilter.SortState.SortConditions = [];
                        currentFilter.SortState.SortConditions[0] = new SortCondition();
                    }
                    if (!currentFilter.SortState.SortConditions[0]) {
                        currentFilter.SortState.SortConditions[0] = new SortCondition();
                    }
                    currentFilter.SortState.SortConditions[0].Ref = cellId + ":" + newEndId;
                    currentFilter.SortState.SortConditions[0].ConditionDescending = type;
                    sortCol = curCell.c1;
                    var changes = sortRange.sort(type, sortCol);
                    ws.cellCommentator.sortComments(sortRange.bbox, changes);
                    if (currentFilter.TableStyleInfo) {
                        t._setColorStyleTable(currentFilter.Ref, currentFilter);
                    }
                    t._addHistoryObj(oldFilter, historyitem_AutoFilter_Sort, {
                        activeCells: activeCells,
                        type: type,
                        cellId: cellId
                    },
                    null, currentFilter.Ref);
                    History.EndTransaction();
                    if (!aWs.workbook.bUndoChanges && !aWs.workbook.bRedoChanges) {
                        ws._onUpdateFormatTable(sortRange.bbox, false);
                    }
                    if (isTurnOffHistory) {
                        History.TurnOn();
                    }
                } else {
                    return false;
                }
            };
            var standartSort = function (success) {
                if (success) {
                    if (isTurnOffHistory) {
                        History.TurnOff();
                    }
                    History.Create_NewPoint();
                    History.StartTransaction();
                    var changes = sortRange.sort(type, sortCol);
                    ws.cellCommentator.sortComments(sortRange.bbox, changes);
                    if (currentFilter.TableStyleInfo) {
                        t._setColorStyleTable(currentFilter.Ref, currentFilter);
                    }
                    History.EndTransaction();
                    if (!aWs.workbook.bUndoChanges && !aWs.workbook.bRedoChanges) {
                        ws._onUpdateFormatTable(sortRange.bbox, false);
                    }
                    if (isTurnOffHistory) {
                        History.TurnOn();
                    }
                } else {
                    return false;
                }
            };
            if (type == "ascending" || type == "descending") {
                var activeRange = ar;
                if (cellId) {
                    activeRange = t._idToRange(cellId);
                }
                var filter = t._searchFilters(activeRange, null);
                if (type == "ascending") {
                    type = true;
                } else {
                    type = false;
                }
                if (filter && filter == "error") {
                    return;
                } else {
                    if (filter) {
                        var allAutoFilters = aWs.TableParts;
                        if (filter.all) {
                            allAutoFilters = [aWs.AutoFilter];
                        }
                        var num = filter.num;
                        if (aWs.AutoFilter && !filter.all) {
                            num = filter.num - 1;
                        }
                        var curFilter = allAutoFilters[num];
                        var splitRef = curFilter.Ref;
                        if (activeRange.r1 == activeRange.r2 && activeRange.c1 == activeRange.c2) {
                            for (var i = 0; i < curFilter.result.length; i++) {
                                var rangeCol = t._idToRange(curFilter.result[i].id);
                                if (rangeCol.c1 == activeRange.c1) {
                                    cellId = curFilter.result[i].id;
                                    break;
                                }
                            }
                        } else {
                            if (splitRef.r1 == activeRange.r1 && splitRef.c1 == activeRange.c1 && splitRef.r2 == activeRange.r2 && splitRef.c2 == activeRange.c2) {
                                cellId = Asc.Range(splitRef.c1, splitRef.r1, splitRef.c1, splitRef.r1);
                            } else {
                                if (splitRef.r1 == activeRange.r1 && splitRef.containsRange(activeRange) && !curFilter.TableStyleInfo) {
                                    cellId = Asc.Range(activeRange.startCol, splitRef.r1, activeRange.startCol, splitRef.r1);
                                } else {
                                    if (splitRef.containsRange(activeRange) && curFilter.TableStyleInfo) {
                                        cellId = Asc.Range(activeRange.startCol, splitRef.r1, activeRange.startCol, splitRef.r1);
                                    } else {
                                        if (splitRef.r1 == activeRange.r1) {
                                            sortCol = activeRange.c1;
                                            sortRange = ws.model.getRange3(activeRange.r1 + 1, activeRange.c1, activeRange.r2, activeRange.c2);
                                            selectionRange = activeRange;
                                            var sortRange1 = t._getAscRange(sortRange.bbox);
                                            currentFilter = curFilter;
                                            if (isTurnOffHistory) {
                                                standartSort(true);
                                            } else {
                                                ws._isLockedCells(sortRange1, null, standartSort);
                                            }
                                            return;
                                        } else {
                                            ws.setSelectionInfo("sort", type);
                                            return;
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        ws.setSelectionInfo("sort", type);
                        return;
                    }
                }
            }
            if (typeof cellId !== "string") {
                cellId = t._rangeToId(cellId);
            }
            activeCells = t._idToRange(cellId);
            var indexFilter = t._findArrayFromAllFilter3(activeCells, cellId);
            var filtersOp = indexFilter.split(":");
            if (filtersOp[0] == "all") {
                currentFilter = aWs.AutoFilter;
            } else {
                currentFilter = aWs.TableParts[filtersOp[0]];
            }
            oldFilter = currentFilter.clone(aWs);
            var rangeCell = currentFilter.Ref;
            curCell = t._idToRange(cellId);
            curCell.r1 = rangeCell.r1;
            selectionRange = new Asc.Range(rangeCell.c1, rangeCell.r1 + 1, rangeCell.c2, rangeCell.r2);
            newEndId = t._rangeToId(curCell);
            sortRange = ws.model.getRange3(rangeCell.r1 + 1, rangeCell.c1, rangeCell.r2, rangeCell.c2);
            var sortRange1 = t._getAscRange(sortRange.bbox);
            if (isTurnOffHistory) {
                onSortAutoFilterCallback(true);
            } else {
                ws._isLockedCells(sortRange1, null, onSortAutoFilterCallback);
            }
        },
        isEmptyAutoFilters: function (ar, turnOnHistory, insCells, deleteFilterAfterDeleteColRow, exceptionArray, doNotChangeFilters) {
            if (turnOnHistory && !this.historyTempObj) {
                History.TurnOn();
                History.Create_NewPoint();
            }
            if (!this.historyTempObj) {
                History.StartTransaction();
            }
            var aWs = this._getCurrentWS();
            var activeCells = ar;
            if (aWs.AutoFilter) {
                var oRange = Range.prototype.createFromBBox(aWs, aWs.AutoFilter.Ref);
                var bbox = oRange.getBBox0();
                if (activeCells.r1 <= bbox.r1 && activeCells.r2 >= bbox.r1 && activeCells.c1 <= bbox.c1 && activeCells.c2 >= bbox.c2) {
                    var oldFilter = aWs.AutoFilter.clone();
                    if (doNotChangeFilters) {
                        if (!this.changeFilters.deleteFilters) {
                            this.changeFilters.deleteFilters = [];
                        }
                        this.changeFilters.deleteFilters[this.changeFilters.deleteFilters.length] = oldFilter.name;
                    } else {
                        aWs.AutoFilter = null;
                    }
                    aWs.setRowHidden(false, bbox.r1, bbox.r2);
                    if (insCells) {
                        oldFilter.insCells = true;
                    }
                    if (this.historyTempObj) {
                        this._addHistoryTempObj(oldFilter, historyitem_AutoFilter_Empty, {
                            activeCells: activeCells
                        },
                        null, oldFilter.Ref);
                    } else {
                        this._addHistoryObj(oldFilter, historyitem_AutoFilter_Empty, {
                            activeCells: activeCells
                        },
                        null, oldFilter.Ref);
                    }
                    this._isEmptyButtons(oldFilter.Ref);
                }
            }
            if (aWs.TableParts) {
                var newTableParts = [];
                var k = 0;
                for (var i = 0; i < aWs.TableParts.length; i++) {
                    var oCurFilter = aWs.TableParts[i].clone(aWs);
                    var oRange = Range.prototype.createFromBBox(aWs, oCurFilter.Ref);
                    if (insCells) {
                        oCurFilter.insCells = true;
                    }
                    var bbox = oRange.getBBox0();
                    if (activeCells.r1 <= bbox.r1 && activeCells.r2 >= bbox.r2 && activeCells.c1 <= bbox.c1 && activeCells.c2 >= bbox.c2 && !this._checkExceptionArray(oCurFilter.Ref, exceptionArray)) {
                        oRange.setTableStyle(null);
                        aWs.setRowHidden(false, bbox.r1, bbox.r2);
                        if (this.historyTempObj) {
                            this._addHistoryTempObj(oCurFilter, historyitem_AutoFilter_Empty, {
                                activeCells: activeCells
                            },
                            deleteFilterAfterDeleteColRow, bbox);
                        } else {
                            this._addHistoryObj(oCurFilter, historyitem_AutoFilter_Empty, {
                                activeCells: activeCells
                            },
                            deleteFilterAfterDeleteColRow, bbox);
                        }
                        this._isEmptyButtons(oCurFilter.Ref);
                        if (doNotChangeFilters) {
                            if (!this.changeFilters.deleteFilters) {
                                this.changeFilters.deleteFilters = [];
                            }
                            this.changeFilters.deleteFilters[this.changeFilters.deleteFilters.length] = aWs.TableParts[i].DisplayName;
                        }
                    } else {
                        newTableParts[k] = oCurFilter;
                        k++;
                    }
                }
                if (!doNotChangeFilters) {
                    aWs.TableParts = newTableParts;
                }
            }
            if (!this.historyTempObj) {
                History.EndTransaction();
            }
            if (turnOnHistory && !this.historyTempObj) {
                History.TurnOff();
            }
        },
        _deleteAutoFilter: function (turnOnHistory) {
            if (turnOnHistory) {
                History.TurnOn();
                History.Create_NewPoint();
            }
            History.StartTransaction();
            var aWs = this._getCurrentWS();
            var activeCells;
            if (aWs.AutoFilter) {
                var oRange = Range.prototype.createFromBBox(aWs, aWs.AutoFilter.Ref);
                var bbox = oRange.getBBox0();
                var oldFilter = aWs.AutoFilter.clone();
                activeCells = aWs.AutoFilter.Ref;
                aWs.AutoFilter = null;
                aWs.setRowHidden(false, bbox.r1, bbox.r2);
                this._addHistoryObj(oldFilter, historyitem_AutoFilter_Empty, {
                    activeCells: activeCells
                },
                null, activeCells);
            }
            if (activeCells) {
                this._isEmptyButtons(activeCells);
            }
            History.EndTransaction();
            if (turnOnHistory) {
                History.TurnOff();
            }
        },
        isApplyAutoFilterInCell: function (activeCell, clean) {
            var aWs = this._getCurrentWS();
            if (aWs.TableParts) {
                var tablePart;
                for (var i = 0; i < aWs.TableParts.length; i++) {
                    tablePart = aWs.TableParts[i];
                    if (tablePart.Ref && ((tablePart.AutoFilter && tablePart.AutoFilter.FilterColumns && tablePart.AutoFilter.FilterColumns.length) || (tablePart && tablePart.SortState && tablePart.SortState.SortConditions && tablePart.SortState.SortConditions[0]))) {
                        if (tablePart.Ref.containsRange(activeCell)) {
                            if (clean) {
                                this._cleanFilterColumnsAndSortState(tablePart, activeCell);
                            }
                            return true;
                        }
                    } else {
                        if (tablePart.Ref.containsRange(activeCell, activeCell)) {
                            return false;
                        }
                    }
                }
            }
            if (aWs.AutoFilter && ((aWs.AutoFilter.FilterColumns && aWs.AutoFilter.FilterColumns.length) || (aWs.AutoFilter.SortState && aWs.AutoFilter.SortState.SortConditions && aWs.AutoFilter.SortState.SortConditions[0]))) {
                if (clean) {
                    this._cleanFilterColumnsAndSortState(aWs.AutoFilter, activeCell);
                }
                return true;
            }
            return false;
        },
        _checkClickFrozenArea: function (x, y, offsetX, offsetY, frozenObj) {
            var ws = this.worksheet;
            var frosenPosX = frozenObj && frozenObj.cFrozen != undefined && ws.cols[frozenObj.cFrozen] ? ws.cols[frozenObj.cFrozen].left : null;
            var frosenPosY = frozenObj && frozenObj.rFrozen != undefined && ws.rows[frozenObj.rFrozen] ? ws.rows[frozenObj.rFrozen].top : null;
            var result;
            if (frosenPosX != null && frosenPosY != null && x < frosenPosX && y < frosenPosY) {
                result = {
                    x: x,
                    y: y
                };
            } else {
                if (frosenPosX != null && x < frosenPosX) {
                    result = {
                        x: x,
                        y: y + offsetY
                    };
                } else {
                    if (frosenPosY != null && y < frosenPosY) {
                        result = {
                            x: x + offsetX,
                            y: y
                        };
                    } else {
                        result = {
                            x: x + offsetX,
                            y: y + offsetY
                        };
                    }
                }
            }
            return result;
        },
        _checkExceptionArray: function (curRange, exceptionArray) {
            if (!curRange || !exceptionArray || (exceptionArray && !exceptionArray.length)) {
                return false;
            }
            for (var e = 0; e < exceptionArray.length; e++) {
                if (exceptionArray[e] && exceptionArray[e].Ref && exceptionArray[e].Ref.isEqual(curRange)) {
                    return true;
                }
            }
            return false;
        },
        _isEmptyButtons: function (ar) {
            if (!this.allButtonAF) {
                return;
            }
            var rangeButton;
            for (var i = 0; i < this.allButtonAF.length; i++) {
                rangeButton = this.allButtonAF[i].inFilter;
                if (rangeButton.r1 >= ar.r1 && rangeButton.r2 <= ar.r2 && rangeButton.c1 >= ar.c1 && rangeButton.c2 <= ar.c2) {
                    this.allButtonAF.splice(i, 1);
                    i--;
                }
            }
        },
        getTablePictures: function (wb, fmgrGraphics, oFont) {
            var styleThumbnailWidth = 61;
            var styleThumbnailHeight = 46;
            if (AscBrowser.isRetina) {
                styleThumbnailWidth <<= 1;
                styleThumbnailHeight <<= 1;
            }
            var canvas = document.createElement("canvas");
            canvas.width = styleThumbnailWidth;
            canvas.height = styleThumbnailHeight;
            var customStyles = wb.TableStyles.CustomStyles;
            var result = [];
            var options;
            var n = 0;
            if (customStyles) {
                for (var i in customStyles) {
                    if (customStyles[i].table) {
                        options = {
                            name: i,
                            displayName: customStyles[i].displayName,
                            type: "custom",
                            image: this._drawSmallIconTable(canvas, customStyles[i], fmgrGraphics, oFont)
                        };
                        result[n] = new formatTablePictures(options);
                        n++;
                    }
                }
            }
            var defaultStyles = wb.TableStyles.DefaultStyles;
            if (defaultStyles) {
                for (var i in defaultStyles) {
                    if (defaultStyles[i].table) {
                        options = {
                            name: i,
                            displayName: defaultStyles[i].displayName,
                            type: "default",
                            image: this._drawSmallIconTable(canvas, defaultStyles[i], fmgrGraphics, oFont)
                        };
                        result[n] = new formatTablePictures(options);
                        n++;
                    }
                }
            }
            return result;
        },
        Redo: function (type, data) {
            startRedo = true;
            History.TurnOff();
            switch (type) {
            case historyitem_AutoFilter_Add:
                this.addAutoFilter(data.lTable, data.activeCells, undefined, true, data.addFormatTableOptionsObj, data.bWithoutFilter);
                break;
            case historyitem_AutoFilter_Sort:
                this.sortColFilter(data.type, data.cellId, data.activeCells, true);
                break;
            case historyitem_AutoFilter_Empty:
                this.isEmptyAutoFilters(data.activeCells);
                break;
            case historyitem_AutoFilter_ApplyDF:
                this._applyDigitalFilter(data.activeCells, data.autoFiltersObject);
                break;
            case historyitem_AutoFilter_ApplyMF:
                this._applyMainFilter(data.activeCells, data.autoFiltersObject, undefined, undefined);
                break;
            case historyitem_AutoFilter_Move:
                this._moveAutoFilters(data.moveTo, data.moveFrom);
                break;
            case historyitem_AutoFilter_CleanAutoFilter:
                this.isApplyAutoFilterInCell(data.activeCells, true);
                break;
            }
            startRedo = false;
            History.TurnOn();
        },
        Undo: function (type, data) {
            var aWs = this._getCurrentWS();
            data = data.undo;
            var cloneData;
            if (data.clone) {
                cloneData = data.clone(aWs);
            } else {
                cloneData = data;
            }
            if (!cloneData) {
                return;
            }
            if (cloneData.insCells) {
                delete cloneData.insCells;
            }
            gUndoInsDelCellsFlag = false;
            if (cloneData.refTable) {
                if (aWs.TableParts) {
                    for (var l = 0; l < aWs.TableParts.length; l++) {
                        if (cloneData.refTable.isEqual(aWs.TableParts[l].Ref)) {
                            this._cleanStyleTable(aWs, cloneData.refTable);
                            aWs.TableParts.splice(l, 1);
                        }
                    }
                }
            }
            if (cloneData.FilterColumns || cloneData.AutoFilter || cloneData.result) {
                if (cloneData.Ref) {
                    var isEn = false;
                    if (aWs.AutoFilter && aWs.AutoFilter.Ref.isEqual(cloneData.Ref)) {
                        this._reDrawCurrentFilter(cloneData.FilterColumns, cloneData.result);
                        aWs.AutoFilter = cloneData;
                        this._reDrawFilters(aWs.AutoFilter.Ref);
                        isEn = true;
                    } else {
                        if (aWs.TableParts) {
                            for (var l = 0; l < aWs.TableParts.length; l++) {
                                if (cloneData.Ref.isEqual(aWs.TableParts[l].Ref)) {
                                    var cloneResult = [];
                                    for (var k = 0; k < cloneData.result.length; k++) {
                                        cloneResult[k] = cloneData.result[k].clone();
                                    }
                                    if (!aWs.TableParts[l].AutoFilter && cloneData.AutoFilter) {
                                        this._addButtonAF({
                                            result: cloneResult,
                                            isVis: true
                                        });
                                    } else {
                                        if (aWs.TableParts[l].AutoFilter && !cloneData.AutoFilter) {
                                            this._addButtonAF({
                                                result: aWs.TableParts[l].result,
                                                isVis: false
                                            });
                                        }
                                    }
                                    aWs.TableParts[l] = cloneData;
                                    if (cloneData.AutoFilter && cloneData.AutoFilter.FilterColumns) {
                                        this._reDrawCurrentFilter(cloneData.AutoFilter.FilterColumns, cloneData.result, aWs.TableParts[l]);
                                    } else {
                                        this._reDrawCurrentFilter(null, cloneData.result, aWs.TableParts[l]);
                                    }
                                    isEn = true;
                                    this._reDrawFilters(aWs.TableParts[l].Ref);
                                    break;
                                }
                            }
                        }
                    }
                    if (!isEn) {
                        if (cloneData.TableStyleInfo) {
                            if (!aWs.TableParts) {
                                aWs.TableParts = [];
                            }
                            aWs.TableParts[aWs.TableParts.length] = cloneData;
                            var splitRange = cloneData.Ref;
                            this._setColorStyleTable(splitRange, cloneData, null, true);
                            if (cloneData.AutoFilter != null) {
                                this._addButtonAF({
                                    result: cloneData.result,
                                    isVis: true
                                });
                            }
                        } else {
                            aWs.AutoFilter = cloneData;
                            this._addButtonAF({
                                result: cloneData.result,
                                isVis: true
                            });
                        }
                    }
                }
            } else {
                if (cloneData.oldFilter && cloneData.newFilterRef) {
                    if (aWs.AutoFilter && cloneData.newFilterRef && cloneData.newFilterRef.isEqual(aWs.AutoFilter.Ref)) {
                        if (aWs.AutoFilter.result) {
                            this._addButtonAF({
                                result: aWs.AutoFilter.result,
                                isVis: false
                            });
                        }
                        aWs.AutoFilter = cloneData.oldFilter;
                        this._addButtonAF({
                            result: cloneData.oldFilter.result,
                            isVis: true
                        });
                    } else {
                        if (aWs.TableParts) {
                            for (var l = 0; l < aWs.TableParts.length; l++) {
                                if (cloneData.newFilterRef && cloneData.newFilterRef.isEqual(aWs.TableParts[l].Ref)) {
                                    var isIntersectionTableParts = this._isIntersectionTableParts(aWs.TableParts[l].Ref);
                                    if (aWs.TableParts[l].AutoFilter != null && !isIntersectionTableParts) {
                                        this._addButtonAF({
                                            result: aWs.TableParts[l].result,
                                            isVis: false
                                        });
                                    }
                                    aWs.TableParts[l] = cloneData.oldFilter;
                                    if (aWs.TableParts[l].AutoFilter != null) {
                                        this._addButtonAF({
                                            result: cloneData.oldFilter.result,
                                            isVis: true
                                        });
                                    } else {
                                        if (aWs.TableParts[l].AutoFilter === null) {
                                            this._addButtonAF({
                                                result: cloneData.oldFilter.result,
                                                isVis: false
                                            });
                                        }
                                    }
                                    var splitRange = cloneData.oldFilter.Ref;
                                    var clearRange = new Range(aWs, cloneData.newFilterRef.r1, cloneData.newFilterRef.c1, cloneData.newFilterRef.r2, cloneData.newFilterRef.c2);
                                    clearRange.setTableStyle(null);
                                    this._setColorStyleTable(splitRange, cloneData.oldFilter, null, true);
                                    this._checkShowButtonsFlag(aWs.TableParts[l]);
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    if (cloneData.oldFilter) {
                        if (aWs.AutoFilter && cloneData.oldFilter.Ref.isIntersect(aWs.AutoFilter.Ref)) {
                            aWs.AutoFilter = cloneData.oldFilter;
                            this._addButtonAF({
                                result: cloneData.oldFilter.result,
                                isVis: true
                            });
                        } else {
                            if (aWs.TableParts) {
                                for (var l = 0; l < aWs.TableParts.length; l++) {
                                    if (cloneData.oldFilter.Ref.isIntersect(aWs.TableParts[l].Ref)) {
                                        aWs.TableParts[l] = cloneData.oldFilter;
                                        if (aWs.TableParts[l].AutoFilter != null) {
                                            this._addButtonAF({
                                                result: cloneData.oldFilter.result,
                                                isVis: true
                                            });
                                        }
                                        var splitRange = cloneData.oldFilter.Ref;
                                        this._setColorStyleTable(splitRange, cloneData.oldFilter, null, true);
                                        this._checkShowButtonsFlag(aWs.TableParts[l]);
                                        break;
                                    }
                                }
                            }
                        }
                    } else {
                        if (cloneData.Ref) {
                            if (aWs.AutoFilter && aWs.AutoFilter.Ref.isEqual(cloneData.Ref)) {
                                if (aWs.AutoFilter.result) {
                                    this._addButtonAF({
                                        result: aWs.AutoFilter.result,
                                        isVis: false
                                    });
                                }
                                aWs.AutoFilter = null;
                            } else {
                                if (aWs.TableParts) {
                                    for (var l = 0; l < aWs.TableParts.length; l++) {
                                        if (cloneData.Ref.isEqual(aWs.TableParts[l].Ref)) {
                                            this._cleanStyleTable(aWs, cloneData.Ref);
                                            if (aWs.TableParts[l].result) {
                                                this._addButtonAF({
                                                    result: aWs.TableParts[l].result,
                                                    isVis: false
                                                });
                                            }
                                            aWs.TableParts.splice(l, 1);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        getSizeButton: function (range) {
            var ws = this.worksheet;
            var result = null;
            if (this.allButtonAF) {
                var id = this._rangeToId(range);
                for (var i = 0; i < this.allButtonAF.length; i++) {
                    if (this.allButtonAF[i].id == id) {
                        var height = 11;
                        var width = 11;
                        var rowHeight = ws.rows[range.r1].height;
                        var index = 1;
                        if (rowHeight < height) {
                            index = rowHeight / height;
                            width = width * index;
                            height = rowHeight;
                        }
                        result = {
                            width: width,
                            height: height
                        };
                        return result;
                    }
                }
            }
            return result;
        },
        reDrawFilter: function (range) {
            if (!range) {
                return;
            }
            var aWs = this._getCurrentWS();
            var tableParts = aWs.TableParts;
            if (tableParts) {
                for (var i = 0; i < tableParts.length; i++) {
                    var currentFilter = tableParts[i];
                    if (currentFilter && currentFilter.Ref) {
                        var tableRange = currentFilter.Ref;
                        if (range.isIntersect(tableRange)) {
                            this._setColorStyleTable(tableRange, currentFilter);
                        }
                    }
                }
            }
        },
        searchRangeInTableParts: function (range) {
            var aWs = this._getCurrentWS();
            var containRangeId = -1,
            tableRange;
            var tableParts = aWs.TableParts;
            if (tableParts) {
                for (var i = 0; i < tableParts.length; ++i) {
                    if (! (tableRange = tableParts[i].Ref)) {
                        continue;
                    }
                    if (range.isIntersect(tableRange)) {
                        containRangeId = tableRange.containsRange(range) ? i : -2;
                        break;
                    }
                }
            }
            return containRangeId;
        },
        checkApplyFilterOrSort: function (tablePartId) {
            var aWs = this._getCurrentWS();
            var result = false;
            if (-1 !== tablePartId) {
                var tablePart = aWs.TableParts[tablePartId];
                if (tablePart.Ref && ((tablePart.AutoFilter && tablePart.AutoFilter.FilterColumns && tablePart.AutoFilter.FilterColumns.length) || (tablePart && tablePart.SortState && tablePart.SortState.SortConditions && tablePart.SortState.SortConditions[0]))) {
                    result = {
                        isFilterColumns: true,
                        isAutoFilter: true
                    };
                } else {
                    if (tablePart.Ref && tablePart.AutoFilter && tablePart.AutoFilter !== null) {
                        result = {
                            isFilterColumns: false,
                            isAutoFilter: true
                        };
                    } else {
                        result = {
                            isFilterColumns: false,
                            isAutoFilter: false
                        };
                    }
                }
            } else {
                if (aWs.AutoFilter && ((aWs.AutoFilter.FilterColumns && aWs.AutoFilter.FilterColumns.length && this._isFilterColumnsContainFilter(aWs.AutoFilter.FilterColumns)) || (aWs.AutoFilter.SortState && aWs.AutoFilter.SortState.SortConditions && aWs.AutoFilter.SortState.SortConditions[0]))) {
                    result = {
                        isFilterColumns: true,
                        isAutoFilter: true
                    };
                } else {
                    if (aWs.AutoFilter) {
                        result = {
                            isFilterColumns: false,
                            isAutoFilter: true
                        };
                    } else {
                        result = {
                            isFilterColumns: false,
                            isAutoFilter: false
                        };
                    }
                }
            }
            return result;
        },
        getAddFormatTableOptions: function (activeCells) {
            var aWs = this._getCurrentWS();
            var objOptions = new AddFormatTableOptions();
            var alreadyAddFilter = this._searchFilters(activeCells, false);
            if ((alreadyAddFilter && alreadyAddFilter.changeStyle) || (alreadyAddFilter && !alreadyAddFilter.containsFilter && !alreadyAddFilter.all)) {
                return false;
            }
            var mainAdjacentCells;
            if (alreadyAddFilter && alreadyAddFilter.all && activeCells && alreadyAddFilter.range && !activeCells.containsRange(alreadyAddFilter.range) && !alreadyAddFilter.changeAllFOnTable) {
                mainAdjacentCells = activeCells;
            } else {
                if (alreadyAddFilter && alreadyAddFilter.changeAllFOnTable && alreadyAddFilter.range) {
                    mainAdjacentCells = alreadyAddFilter.range;
                } else {
                    if (activeCells.r1 == activeCells.r2 && activeCells.c1 == activeCells.c2) {
                        mainAdjacentCells = this._getAdjacentCellsAF(activeCells, aWs);
                    } else {
                        mainAdjacentCells = activeCells;
                    }
                }
            }
            var isTitle = this._isAddNameColumn(mainAdjacentCells);
            objOptions.asc_setIsTitle(isTitle);
            var tmpRange = mainAdjacentCells.clone();
            tmpRange.r1Abs = tmpRange.c1Abs = tmpRange.r2Abs = tmpRange.c2Abs = true;
            objOptions.asc_setRange(tmpRange.getName());
            return objOptions;
        },
        checkRemoveTableParts: function (delRange, tableRange) {
            var result = true,
            firstRowRange;
            if (tableRange && delRange.containsRange(tableRange) == false) {
                firstRowRange = new Asc.Range(tableRange.c1, tableRange.r1, tableRange.c2, tableRange.r1);
                result = !firstRowRange.isIntersect(delRange);
            }
            return result;
        },
        isActiveCellsCrossHalfFTable: function (activeCells, val, prop) {
            var InsertCellsAndShiftDown = (val == c_oAscInsertOptions.InsertCellsAndShiftDown && prop == "insCell") ? true : false;
            var InsertCellsAndShiftRight = (val == c_oAscInsertOptions.InsertCellsAndShiftRight && prop == "insCell") ? true : false;
            var DeleteCellsAndShiftLeft = (val == c_oAscDeleteOptions.DeleteCellsAndShiftLeft && prop == "delCell") ? true : false;
            var DeleteCellsAndShiftTop = (val == c_oAscDeleteOptions.DeleteCellsAndShiftTop && prop == "delCell") ? true : false;
            var DeleteColumns = (val == c_oAscDeleteOptions.DeleteColumns && prop == "delCell") ? true : false;
            var DeleteRows = (val == c_oAscDeleteOptions.DeleteRows && prop == "delCell") ? true : false;
            var ws = this.worksheet;
            var aWs = this._getCurrentWS();
            var tableParts = aWs.TableParts;
            var autoFilter = aWs.AutoFilter;
            var result = null;
            if (DeleteColumns || DeleteRows) {
                var newActiveRange;
                if (DeleteRows) {
                    newActiveRange = new Asc.Range(0, activeCells.r1, ws.nColsCount - 1, activeCells.r2);
                } else {
                    newActiveRange = new Asc.Range(activeCells.c1, 0, activeCells.c2, ws.nRowsCount - 1);
                }
                if (tableParts) {
                    var tableRange;
                    var isExp = false;
                    var isPart = false;
                    for (var i = 0; i < tableParts.length; i++) {
                        tableRange = tableParts[i].Ref;
                        if (newActiveRange.isIntersect(tableRange)) {
                            if (isExp && isPart) {
                                ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
                                return false;
                            }
                            if (newActiveRange.c1 <= tableRange.c1 && newActiveRange.c2 >= tableRange.c2 && newActiveRange.r1 <= tableRange.r1 && newActiveRange.r2 >= tableRange.r2) {
                                isExp = true;
                                if (isPart) {
                                    ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
                                    return false;
                                }
                            } else {
                                if (isExp) {
                                    ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
                                    return false;
                                } else {
                                    if (isPart) {
                                        ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
                                        return false;
                                    } else {
                                        if (DeleteRows) {
                                            if (!this.checkRemoveTableParts(newActiveRange, tableRange)) {
                                                ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
                                                return false;
                                            } else {
                                                if (activeCells.r1 < tableRange.r1 && activeCells.r2 >= tableRange.r1 && activeCells.r2 < tableRange.r2) {
                                                    ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
                                                    return false;
                                                }
                                            }
                                        } else {
                                            if (DeleteColumns && activeCells.c1 < tableRange.c1 && activeCells.c2 >= tableRange.c1 && activeCells.c2 < tableRange.c2) {
                                                ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
                                                return false;
                                            } else {
                                                isPart = true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return result;
            }
            if (tableParts) {
                var tableRange;
                var isExp;
                for (var i = 0; i < tableParts.length; i++) {
                    tableRange = tableParts[i].Ref;
                    isExp = false;
                    if (activeCells.isIntersect(tableRange)) {
                        if (activeCells.c1 <= tableRange.c1 && activeCells.r1 <= tableRange.r1 && activeCells.c2 >= tableRange.c2 && activeCells.r2 >= tableRange.r2) {
                            result = true;
                        } else {
                            if (InsertCellsAndShiftDown) {
                                if (activeCells.c1 <= tableRange.c1 && activeCells.c2 >= tableRange.c2 && activeCells.r1 <= tableRange.r1) {
                                    isExp = true;
                                }
                            } else {
                                if (InsertCellsAndShiftRight) {
                                    if (activeCells.r1 <= tableRange.r1 && activeCells.r2 >= tableRange.r2 && activeCells.c1 <= tableRange.c1) {
                                        isExp = true;
                                    }
                                }
                            }
                            if (!isExp) {
                                ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
                                return false;
                            }
                        }
                    } else {
                        if (DeleteCellsAndShiftLeft) {
                            if (tableRange.c1 > activeCells.c1 && (((tableRange.r1 <= activeCells.r1 && tableRange.r2 >= activeCells.r1) || (tableRange.r1 <= activeCells.r2 && tableRange.r2 >= activeCells.r2)) && !(tableRange.r1 == activeCells.r1 && tableRange.r2 == activeCells.r2))) {
                                ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
                                return false;
                            }
                        } else {
                            if (DeleteCellsAndShiftTop) {
                                if (tableRange.r1 > activeCells.r1 && (((tableRange.c1 <= activeCells.c1 && tableRange.c2 >= activeCells.c1) || (tableRange.c1 <= activeCells.c2 && tableRange.c2 >= activeCells.c2)) && !(tableRange.c1 == activeCells.c1 && tableRange.c2 == activeCells.c2))) {
                                    ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
                                    return false;
                                }
                            } else {
                                if (InsertCellsAndShiftRight) {
                                    if (tableRange.c1 > activeCells.c1 && (((tableRange.r1 <= activeCells.r1 && tableRange.r2 >= activeCells.r1) || (tableRange.r1 <= activeCells.r2 && tableRange.r2 >= activeCells.r2)) && !(tableRange.r1 == activeCells.r1 && tableRange.r2 == activeCells.r2))) {
                                        ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
                                        return false;
                                    }
                                } else {
                                    if (tableRange.r1 > activeCells.r1 && (((tableRange.c1 <= activeCells.c1 && tableRange.c2 >= activeCells.c1) || (tableRange.c1 <= activeCells.c2 && tableRange.c2 >= activeCells.c2)) && !(tableRange.c1 >= activeCells.c1 && tableRange.c2 <= activeCells.c2))) {
                                        ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                    if (DeleteCellsAndShiftLeft && tableRange.c1 > activeCells.c1 && tableRange.r1 >= activeCells.r1 && tableRange.r2 <= activeCells.r2) {
                        result = true;
                    } else {
                        if (DeleteCellsAndShiftTop && tableRange.r1 > activeCells.r1 && tableRange.c1 >= activeCells.c1 && tableRange.c2 <= activeCells.c2) {
                            result = true;
                        } else {
                            if (InsertCellsAndShiftRight && tableRange.c1 >= activeCells.c1 && tableRange.r1 >= activeCells.r1 && tableRange.r2 <= activeCells.r2) {
                                result = true;
                            } else {
                                if (InsertCellsAndShiftDown && tableRange.r1 >= activeCells.r1 && tableRange.c1 >= activeCells.c1 && tableRange.c2 <= activeCells.c2) {
                                    result = true;
                                }
                            }
                        }
                    }
                }
            }
            if ((DeleteCellsAndShiftLeft || DeleteCellsAndShiftTop || InsertCellsAndShiftDown || InsertCellsAndShiftRight) && autoFilter) {
                tableRange = autoFilter.Ref;
                if (activeCells.isIntersect(tableRange)) {
                    if (activeCells.c1 <= tableRange.c1 && activeCells.r1 <= tableRange.r1 && activeCells.c2 >= tableRange.c2 && activeCells.r2 >= tableRange.r2) {
                        result = true;
                    } else {
                        if ((DeleteCellsAndShiftLeft || DeleteCellsAndShiftTop) && activeCells.c1 <= tableRange.c1 && activeCells.r1 <= tableRange.r1 && activeCells.c2 >= tableRange.c2 && activeCells.r2 >= tableRange.r1) {
                            result = true;
                        } else {
                            if (InsertCellsAndShiftDown && activeCells.c1 <= tableRange.c1 && activeCells.r1 <= tableRange.r1 && activeCells.c2 >= tableRange.c2 && activeCells.r2 >= tableRange.r1) {
                                result = true;
                            }
                        }
                    }
                }
                if ((InsertCellsAndShiftDown || DeleteCellsAndShiftTop) && tableRange.r1 > activeCells.r1 && (((tableRange.c1 <= activeCells.c1 && tableRange.c2 >= activeCells.c1) || (tableRange.c1 <= activeCells.c2 && tableRange.c2 >= activeCells.c2)) && !(tableRange.c1 >= activeCells.c1 && tableRange.c2 <= activeCells.c2))) {
                    ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
                    return false;
                }
                if (activeCells.c2 < tableRange.c1 && activeCells.r1 <= tableRange.r1 && activeCells.r2 >= tableRange.r2 && (DeleteCellsAndShiftLeft || InsertCellsAndShiftRight)) {
                    result = true;
                } else {
                    if (activeCells.r2 < tableRange.r1 && activeCells.c1 <= tableRange.c1 && activeCells.c2 >= tableRange.c2 && (InsertCellsAndShiftDown || DeleteCellsAndShiftTop)) {
                        result = true;
                    }
                }
            }
            return result;
        },
        isTablePartContainActiveRange: function () {
            var ws = this.worksheet;
            var aWs = this._getCurrentWS();
            var activeRange = ws.activeRange;
            var tableParts = aWs.TableParts;
            var tablePart;
            for (var i = 0; i < tableParts.length; i++) {
                tablePart = tableParts[i];
                if (tablePart && tablePart.Ref && tablePart.Ref.containsRange(activeRange) && !tablePart.Ref.isEqual(activeRange)) {
                    return true;
                }
            }
            return false;
        },
        _isIntersectionTableParts: function (range) {
            var ws = this.worksheet;
            var aWs = this._getCurrentWS();
            var tableParts = aWs.TableParts;
            var tablePart;
            for (var i = 0; i < tableParts.length; i++) {
                tablePart = tableParts[i];
                if (tablePart.Ref.intersection(range)) {
                    return true;
                }
            }
            return false;
        },
        _applyDigitalFilter: function (ar, autoFiltersObject) {
            var ws = this.worksheet;
            var aWs = this._getCurrentWS();
            var conFilter = autoFiltersObject;
            var activeCells = this._idToRange(conFilter.cellId);
            var indexFilter = this._findArrayFromAllFilter3(activeCells, conFilter.cellId);
            if (indexFilter === undefined) {
                return;
            }
            var filtersOp = indexFilter.split(":");
            var currentFilter, ref;
            if (filtersOp[0] == "all") {
                currentFilter = aWs.AutoFilter;
                ref = aWs.AutoFilter.Ref;
            } else {
                currentFilter = aWs.TableParts[filtersOp[0]];
                ref = aWs.TableParts[filtersOp[0]].AutoFilter.Ref;
            }
            var startIdCell = currentFilter.result[filtersOp[1]].id;
            var endIdCell = currentFilter.result[filtersOp[1]].idNext;
            var startRange = ws.model.getCell(new CellAddress(startIdCell));
            var endRange = ws.model.getCell(new CellAddress(endIdCell));
            var isMerged = startRange.hasMerged();
            var startCell = this._idToRange(startIdCell);
            if (isMerged && startCell.c1 != isMerged.c1 && ref && ref.containsRange(isMerged)) {
                var endCell = this._idToRange(endIdCell);
                var diff = startCell.c1 - isMerged.c1;
                filtersOp[1] = filtersOp[1] - diff;
                startCell.c1 = isMerged.c1;
                endCell.c1 = isMerged.c1;
                startIdCell = this._rangeToId(startCell);
                endIdCell = this._rangeToId(endCell);
                startRange = ws.model.getCell(new CellAddress(startIdCell));
                endRange = ws.model.getCell(new CellAddress(endIdCell));
                isMerged = true;
            } else {
                isMerged = false;
            }
            var arrayFil = [];
            if (conFilter.filter1 == null && conFilter.filter2 == null) {
                return;
            }
            var n = 0;
            for (var i = startRange.first.row; i < endRange.first.row; i++) {
                var cell = ws.model.getCell3(i, startRange.first.col - 1);
                var val = cell.getValue();
                var type = cell.getType();
                var valWithFormat = cell.getValueWithFormat();
                arrayFil[n] = this._getLogical(conFilter, {
                    type: type,
                    val: val,
                    valWithFormat: valWithFormat
                });
                var isHidden = this._isHiddenAnotherFilter(conFilter.cellId, i, currentFilter.Ref);
                if (isHidden != undefined) {
                    arrayFil[n] = isHidden;
                }
                n++;
            }
            var oldFilter = currentFilter.clone(aWs);
            this._addCustomFilters(filtersOp, aWs, conFilter, isMerged);
            this._addHistoryObj(oldFilter, historyitem_AutoFilter_ApplyDF, {
                activeCells: ar,
                autoFiltersObject: autoFiltersObject
            });
            arrayFil.cellId = conFilter.cellId;
            this._applyMainFilter(ar, autoFiltersObject, true, arrayFil);
        },
        _applyMainFilter: function (ar, autoFiltersObject, customFilter, array) {
            var activeCells;
            var ws = this.worksheet;
            var aWs = this._getCurrentWS();
            var cellId;
            var isArray = true;
            if (!array) {
                array = [];
                cellId = autoFiltersObject.cellId;
                for (var i = 0; i < autoFiltersObject.result.length; i++) {
                    array[i] = autoFiltersObject.result[i].clone();
                }
                isArray = false;
            } else {
                cellId = array.cellId;
            }
            if (cellId == undefined) {
                activeCells = ar;
            } else {
                var curCellId = cellId.split("af")[0];
                activeCells = {
                    c1: ws.model.getCell(new CellAddress(curCellId)).first.col - 1,
                    r1: ws.model.getCell(new CellAddress(curCellId)).first.row - 1
                };
            }
            var newAcCells = {
                r1: activeCells.r1,
                c1: activeCells.c1,
                r2: activeCells.r1,
                c2: activeCells.c1
            };
            var indexFilter = this._findArrayFromAllFilter3(newAcCells, cellId);
            if (indexFilter === undefined) {
                return;
            }
            var filtersOp = indexFilter.split(":");
            var currentFilter;
            var ref;
            var filterObj;
            if (filtersOp[0] == "all") {
                if (!aWs.AutoFilter.FilterColumns) {
                    aWs.AutoFilter.FilterColumns = [];
                }
                currentFilter = aWs.AutoFilter.FilterColumns;
                filterObj = aWs.AutoFilter;
                ref = aWs.AutoFilter.Ref;
            } else {
                if (!aWs.TableParts[filtersOp[0]].AutoFilter.FilterColumns) {
                    aWs.TableParts[filtersOp[0]].AutoFilter.FilterColumns = [];
                }
                currentFilter = aWs.TableParts[filtersOp[0]].AutoFilter.FilterColumns;
                ref = aWs.TableParts[filtersOp[0]].AutoFilter.Ref;
                filterObj = aWs.TableParts[filtersOp[0]];
            }
            var oldFilter = filterObj.clone(aWs);
            var cell = ws.model.getCell3(activeCells.r1, activeCells.c1);
            var filterRange = ref;
            var rangeStart = filterRange;
            if (newAcCells.c1 == (rangeStart.c1 + parseInt(filtersOp[1]))) {
                var isMerged = cell.hasMerged();
                if (isMerged && ref && ref.containsRange(isMerged)) {
                    var newCol = isMerged.c1 - rangeStart.c1;
                    filtersOp[1] = newCol;
                }
            }
            var isCurFilter;
            for (var l = 0; l < currentFilter.length; l++) {
                if (currentFilter[l].ColId == filtersOp[1]) {
                    isCurFilter = l;
                }
            }
            var isMerged = false;
            if (!isArray) {
                var newArray = [];
                var isMerged = cell.hasMerged();
                if (isMerged && activeCells.c1 != isMerged.c1 && ref && ref.containsRange(isMerged)) {
                    activeCells.c1 = isMerged.c1;
                } else {
                    isMerged = false;
                }
                var lengthRows = array.length;
                if (ref) {
                    lengthRows = filterRange.r2 - filterRange.r1;
                }
                var allFilterOpenElements = true;
                for (var s = 0; s < array.length; s++) {
                    if (array[s].visible == false) {
                        allFilterOpenElements = false;
                        break;
                    }
                }
                for (var m = 0; m < lengthRows; m++) {
                    var val = ws.model.getCell3(activeCells.r1 + m + 1, activeCells.c1).getValueWithFormat();
                    var anotherFilterHidden = this._isHiddenAnotherFilter2(curCellId, activeCells.r1 + m + 1, ref);
                    if (anotherFilterHidden == "hidden") {
                        newArray[m] = "hidden";
                    } else {
                        if (allFilterOpenElements) {
                            newArray[m] = true;
                        } else {
                            for (var s = 0; s < array.length; s++) {
                                if (array[s].val == val && array[s].visible != "hidden") {
                                    newArray[m] = array[s].visible;
                                    break;
                                }
                                if (s == array.length - 1 && newArray[m] == undefined) {
                                    newArray[m] = false;
                                }
                            }
                        }
                    }
                }
                array = newArray;
            }
            var row;
            var cellAdd = 1;
            for (var i = 0; i < array.length; i++) {
                row = i + activeCells.r1 + cellAdd;
                if (array[i] == false) {
                    allFilterOpenElements = false;
                }
                if (array[i] == "rep") {
                    var mainVal = ws.model.getCell3(activeCells.r1 + i + 1, activeCells.c1).getValueWithFormat();
                    for (var k = 0; k < array.length; k++) {
                        if (array[k] == false || array[k] == true) {
                            var val2 = ws.model.getCell3(activeCells.r1 + k + 1, activeCells.c1).getValueWithFormat();
                            if (val2 == mainVal) {
                                array[i] = array[k];
                                break;
                            }
                        }
                    }
                }
                if (array[i] == false || array[i] == "hidden") {
                    if (!ws.model.getRowHidden(row)) {
                        ws.model.setRowHidden(true, row, row);
                    }
                } else {
                    if (array[i] == true) {
                        if (ws.model.getRowHidden(row)) {
                            ws.model.setRowHidden(false, row, row);
                        }
                    }
                }
            }
            if (!customFilter) {
                var allVis = true;
                for (var i = 0; i < array.length; i++) {
                    if (allFilterOpenElements) {
                        break;
                    }
                    var cell = ws.model.getCell3(activeCells.r1 + i + 1, activeCells.c1);
                    var valActive = cell.getValueWithFormat();
                    var valWithoutFormat = cell.getValueWithoutFormat();
                    var arrVal;
                    if (isCurFilter == undefined || !currentFilter[isCurFilter].Filters) {
                        if (isCurFilter == undefined) {
                            isCurFilter = currentFilter.length;
                        }
                        if (currentFilter[isCurFilter]) {
                            currentFilter[isCurFilter].ColId = filtersOp[1];
                            currentFilter[isCurFilter].CustomFiltersObj = null;
                            currentFilter[isCurFilter].Filters = new Filters();
                        } else {
                            currentFilter[isCurFilter] = new FilterColumn();
                            currentFilter[isCurFilter].ColId = filtersOp[1];
                            currentFilter[isCurFilter].Filters = new Filters();
                        }
                        currentFilter[isCurFilter].Filters.Values = [];
                    }
                    if (isMerged) {
                        currentFilter[isCurFilter].ShowButton = false;
                    }
                    if (cell.getNumFormat().isDateTimeFormat()) {
                        if (!currentFilter[isCurFilter].Filters.Dates) {
                            currentFilter[isCurFilter].Filters.Dates = [];
                        }
                        arrVal = currentFilter[isCurFilter].Filters.Dates;
                        var isConsist = undefined;
                        for (var h = 0; h < arrVal.length; h++) {
                            if (this._dataFilterParse(arrVal[h], valWithoutFormat)) {
                                isConsist = h;
                            }
                        }
                        if (isConsist == undefined) {
                            var dataVal = NumFormat.prototype.parseDate(valWithoutFormat);
                            valActive = new DateGroupItem();
                            valActive.DateTimeGrouping = 1;
                            valActive.Day = dataVal.d;
                            valActive.Month = dataVal.month + 1;
                            valActive.Year = dataVal.year;
                        }
                        if (array[i] == true && isConsist == undefined) {
                            arrVal[arrVal.length] = valActive;
                        } else {
                            if (array[i] == false && isConsist != undefined) {
                                arrVal.splice(isConsist, 1);
                            }
                        }
                        if (array[i] == false) {
                            allVis = false;
                        }
                    } else {
                        arrVal = currentFilter[isCurFilter].Filters.Values;
                        var isConsist = undefined;
                        for (var h = 0; h < arrVal.length; h++) {
                            if (arrVal[h] == valActive) {
                                isConsist = h;
                            }
                        }
                        if ("" == valActive && array[i] == true && isConsist == undefined) {
                            currentFilter[isCurFilter].Filters.Blank = true;
                            currentFilter[isCurFilter].Filters.Values.splice(h, 1);
                            continue;
                        } else {
                            if ("" == valActive) {
                                currentFilter[isCurFilter].Filters.Blank = null;
                            }
                        }
                        if (array[i] == true && isConsist == undefined) {
                            arrVal[arrVal.length] = valActive;
                        } else {
                            if (array[i] == false && isConsist != undefined) {
                                arrVal.splice(isConsist, 1);
                            }
                        }
                        if (array[i] == false) {
                            allVis = false;
                        }
                    }
                }
                if (allVis || allFilterOpenElements) {
                    if (currentFilter[isCurFilter] && currentFilter[isCurFilter].ShowButton == false) {
                        currentFilter[isCurFilter].Filters = null;
                        currentFilter[isCurFilter].CustomFiltersObj = null;
                    } else {
                        currentFilter.splice(isCurFilter, 1);
                    }
                }
            }
            if (!customFilter) {
                this._addHistoryObj(oldFilter, historyitem_AutoFilter_ApplyMF, {
                    activeCells: ar,
                    autoFiltersObject: autoFiltersObject
                });
            }
            if (this.allButtonAF && this.allButtonAF.length && autoFiltersObject.cellId) {
                for (var i = 0; i < this.allButtonAF.length; i++) {
                    if (autoFiltersObject.cellId === this.allButtonAF[i].id) {
                        if (currentFilter && currentFilter[isCurFilter]) {
                            var hiddenRowsObj = this._getHiddenRows(this.allButtonAF[i].id, this.allButtonAF[i].idNext, currentFilter[isCurFilter]);
                            this.allButtonAF[i].hiddenRows = hiddenRowsObj;
                        } else {
                            this.allButtonAF[i].hiddenRows = null;
                        }
                        break;
                    }
                }
            }
            this._reDrawFilters();
            if (!aWs.workbook.bUndoChanges && !aWs.workbook.bRedoChanges) {
                ws._onUpdateFormatTable(oldFilter.Ref, false, true);
            }
        },
        _getAutoFilterArray: function (cell) {
            var curId = cell.id;
            var nextId = cell.idNext;
            var ws = this.worksheet;
            var activeCells = {
                c1: ws.model.getCell(new CellAddress(curId)).first.col - 1,
                r1: ws.model.getCell(new CellAddress(curId)).first.row - 1,
                c2: ws.model.getCell(new CellAddress(nextId)).first.col - 1,
                r2: ws.model.getCell(new CellAddress(nextId)).first.row - 1
            };
            var indexFilter = this._findArrayFromAllFilter3(activeCells, curId);
            return this._getArrayOpenCells(indexFilter, curId);
        },
        _checkValueInCells: function (n, k, cloneActiveRange) {
            var ws = this.worksheet;
            var cell = ws.model.getRange3(n, k, n, k);
            var isEmptyCell = cell.isEmptyText();
            var isEnd = true,
            range, merged, valueMerg;
            if (isEmptyCell) {
                merged = cell.hasMerged();
                valueMerg = null;
                if (merged) {
                    valueMerg = ws.model.getRange3(merged.r1, merged.c1, merged.r2, merged.c2).getValue();
                    if (valueMerg != null && valueMerg != "") {
                        if (merged.r1 < cloneActiveRange.r1) {
                            cloneActiveRange.r1 = merged.r1;
                            n = cloneActiveRange.r1 - 1;
                            isEnd = false;
                        }
                        if (merged.r2 > cloneActiveRange.r2) {
                            cloneActiveRange.r2 = merged.r2;
                            n = cloneActiveRange.r2 - 1;
                            isEnd = false;
                        }
                        if (merged.c1 < cloneActiveRange.c1) {
                            cloneActiveRange.c1 = merged.c1;
                            k = cloneActiveRange.c1 - 1;
                            isEnd = false;
                        }
                        if (merged.c2 > cloneActiveRange.c2) {
                            cloneActiveRange.c2 = merged.c2;
                            k = cloneActiveRange.c2 - 1;
                            isEnd = false;
                        }
                        if (n < 0) {
                            n = 0;
                        }
                        if (k < 0) {
                            k = 0;
                        }
                    }
                }
            }
            if (!isEmptyCell || (valueMerg != null && valueMerg != "")) {
                if (k < cloneActiveRange.c1) {
                    cloneActiveRange.c1 = k;
                    isEnd = false;
                } else {
                    if (k > cloneActiveRange.c2) {
                        cloneActiveRange.c2 = k;
                        isEnd = false;
                    }
                }
                if (n < cloneActiveRange.r1) {
                    cloneActiveRange.r1 = n;
                    isEnd = false;
                } else {
                    if (n > cloneActiveRange.r2) {
                        cloneActiveRange.r2 = n;
                        isEnd = false;
                    }
                }
            }
            return {
                isEmptyCell: isEmptyCell,
                isEnd: isEnd,
                cloneActiveRange: cloneActiveRange
            };
        },
        _getAdjacentCellsAF2: function (ar, aWs) {
            var ws = this.worksheet;
            var cloneActiveRange = ar.clone(true);
            var isEnd = false,
            cell, result;
            var prevActiveRange = {
                r1: cloneActiveRange.r1,
                c1: cloneActiveRange.c1,
                r2: cloneActiveRange.r2,
                c2: cloneActiveRange.c2
            };
            while (isEnd === false) {
                var isEndWhile = false;
                var n = cloneActiveRange.r1;
                var k = cloneActiveRange.c1 - 1;
                while (!isEndWhile) {
                    if (n < 0) {
                        n++;
                    }
                    if (k < 0) {
                        k++;
                    }
                    result = this._checkValueInCells(n, k, cloneActiveRange);
                    cloneActiveRange = result.cloneActiveRange;
                    if (n == 0) {
                        isEndWhile = true;
                    }
                    if (!result.isEmptyCell) {
                        k = cloneActiveRange.c1 - 1;
                        n--;
                    } else {
                        if (k == cloneActiveRange.c2 + 1) {
                            isEndWhile = true;
                        } else {
                            k++;
                        }
                    }
                }
                isEndWhile = false;
                n = cloneActiveRange.r2;
                k = cloneActiveRange.c1 - 1;
                while (!isEndWhile) {
                    if (n < 0) {
                        n++;
                    }
                    if (k < 0) {
                        k++;
                    }
                    result = this._checkValueInCells(n, k, cloneActiveRange);
                    cloneActiveRange = result.cloneActiveRange;
                    if (n == ws.nRowsCount) {
                        isEndWhile = true;
                    }
                    if (!result.isEmptyCell) {
                        k = cloneActiveRange.c1 - 1;
                        n++;
                    } else {
                        if (k == cloneActiveRange.c2 + 1) {
                            isEndWhile = true;
                        } else {
                            k++;
                        }
                    }
                }
                isEndWhile = false;
                n = cloneActiveRange.r1 - 1;
                k = cloneActiveRange.c1;
                while (!isEndWhile) {
                    if (n < 0) {
                        n++;
                    }
                    if (k < 0) {
                        k++;
                    }
                    result = this._checkValueInCells(n++, k, cloneActiveRange);
                    cloneActiveRange = result.cloneActiveRange;
                    if (k == 0) {
                        isEndWhile = true;
                    }
                    if (!result.isEmptyCell) {
                        n = cloneActiveRange.r1 - 1;
                        k--;
                    } else {
                        if (n == cloneActiveRange.r2 + 1) {
                            isEndWhile = true;
                        }
                    }
                }
                isEndWhile = false;
                n = cloneActiveRange.r1 - 1;
                k = cloneActiveRange.c2 + 1;
                while (!isEndWhile) {
                    if (n < 0) {
                        n++;
                    }
                    if (k < 0) {
                        k++;
                    }
                    result = this._checkValueInCells(n++, k, cloneActiveRange);
                    cloneActiveRange = result.cloneActiveRange;
                    if (k == ws.nColsCount) {
                        isEndWhile = true;
                    }
                    if (!result.isEmptyCell) {
                        n = cloneActiveRange.r1 - 1;
                        k++;
                    } else {
                        if (n == cloneActiveRange.r2 + 1) {
                            isEndWhile = true;
                        }
                    }
                }
                if (prevActiveRange.r1 == cloneActiveRange.r1 && prevActiveRange.c1 == cloneActiveRange.c1 && prevActiveRange.r2 == cloneActiveRange.r2 && prevActiveRange.c2 == cloneActiveRange.c2) {
                    isEnd = true;
                }
                prevActiveRange = {
                    r1: cloneActiveRange.r1,
                    c1: cloneActiveRange.c1,
                    r2: cloneActiveRange.r2,
                    c2: cloneActiveRange.c2
                };
            }
            if (ar.r1 == cloneActiveRange.r1) {
                for (var n = cloneActiveRange.c1; n <= cloneActiveRange.c2; n++) {
                    cell = ws.model.getRange3(cloneActiveRange.r1, n, cloneActiveRange.r1, n);
                    if (cell.getValueWithoutFormat() != "") {
                        break;
                    }
                    if (n == cloneActiveRange.c2 && cloneActiveRange.c2 > cloneActiveRange.c1) {
                        cloneActiveRange.r1++;
                    }
                }
            } else {
                if (ar.r1 == cloneActiveRange.r2) {
                    for (var n = cloneActiveRange.c1; n <= cloneActiveRange.c2; n++) {
                        cell = ws.model.getRange3(cloneActiveRange.r2, n, cloneActiveRange.r2, n);
                        if (cell.getValueWithoutFormat() != "") {
                            break;
                        }
                        if (n == cloneActiveRange.c2 && cloneActiveRange.r2 > cloneActiveRange.r1) {
                            cloneActiveRange.r2--;
                        }
                    }
                }
            }
            if (ar.c1 == cloneActiveRange.c1) {
                for (var n = cloneActiveRange.r1; n <= cloneActiveRange.r2; n++) {
                    cell = ws.model.getRange3(n, cloneActiveRange.c1, n, cloneActiveRange.c1);
                    if (cell.getValueWithoutFormat() != "") {
                        break;
                    }
                    if (n == cloneActiveRange.r2 && cloneActiveRange.r2 > cloneActiveRange.r1) {
                        cloneActiveRange.c1++;
                    }
                }
            } else {
                if (ar.c1 == cloneActiveRange.c2) {
                    for (var n = cloneActiveRange.r1; n <= cloneActiveRange.r2; n++) {
                        cell = ws.model.getRange3(n, cloneActiveRange.c2, n, cloneActiveRange.c2);
                        if (cell.getValueWithoutFormat() != "") {
                            break;
                        }
                        if (n == cloneActiveRange.r2 && cloneActiveRange.c2 > cloneActiveRange.c1) {
                            cloneActiveRange.c2--;
                        }
                    }
                }
            }
            if (aWs.AutoFilter || aWs.TableParts) {
                var oldFilters = [];
                if (aWs.AutoFilter) {
                    oldFilters[0] = aWs.AutoFilter;
                }
                if (aWs.TableParts) {
                    var s = 1;
                    if (!oldFilters[0]) {
                        s = 0;
                    }
                    for (k = 0; k < aWs.TableParts.length; k++) {
                        if (aWs.TableParts[k].AutoFilter) {
                            oldFilters[s] = aWs.TableParts[k];
                            s++;
                        }
                    }
                }
                var newRange = {},
                oldRange;
                for (var i = 0; i < oldFilters.length; i++) {
                    if (!oldFilters[i].Ref || oldFilters[i].Ref == "") {
                        continue;
                    }
                    oldRange = oldFilters[i].Ref;
                    if (cloneActiveRange.r1 <= oldRange.r1 && cloneActiveRange.r2 >= oldRange.r2 && cloneActiveRange.c1 <= oldRange.c1 && cloneActiveRange.c2 >= oldRange.c2) {
                        if (oldRange.r2 > ar.r1 && ar.c2 >= oldRange.c1 && ar.c2 <= oldRange.c2) {
                            newRange.r2 = oldRange.r1 - 1;
                        } else {
                            if (oldRange.r1 < ar.r2 && ar.c2 >= oldRange.c1 && ar.c2 <= oldRange.c2) {
                                newRange.r1 = oldRange.r2 + 1;
                            } else {
                                if (oldRange.c2 < ar.c1) {
                                    newRange.c1 = oldRange.c2 + 1;
                                } else {
                                    if (oldRange.c1 > ar.c2) {
                                        newRange.c2 = oldRange.c1 - 1;
                                    }
                                }
                            }
                        }
                    }
                }
                if (!newRange.r1) {
                    newRange.r1 = cloneActiveRange.r1;
                }
                if (!newRange.c1) {
                    newRange.c1 = cloneActiveRange.c1;
                }
                if (!newRange.r2) {
                    newRange.r2 = cloneActiveRange.r2;
                }
                if (!newRange.c2) {
                    newRange.c2 = cloneActiveRange.c2;
                }
                newRange = Asc.Range(newRange.c1, newRange.r1, newRange.c2, newRange.r2);
                cloneActiveRange = newRange;
            }
            if (cloneActiveRange) {
                return cloneActiveRange;
            } else {
                return ar;
            }
        },
        _getAdjacentCellsAF: function (ar, aWs) {
            var ws = this.worksheet;
            var cloneActiveRange = ar.clone(true);
            var isEnd = true,
            cell, range, merged, valueMerg, rowNum = cloneActiveRange.r1,
            isEmptyCell;
            var allRange = ws.model.getRange3(0, 0, ws.nRowsCount, ws.nColsCount);
            var isMergedCells = allRange.hasMerged();
            for (var n = cloneActiveRange.r1 - 1; n <= cloneActiveRange.r2 + 1; n++) {
                if (n < 0) {
                    continue;
                }
                if (!isEnd) {
                    rowNum = cloneActiveRange.r1;
                    if (cloneActiveRange.r1 > 0) {
                        n = cloneActiveRange.r1 - 1;
                    }
                    if (cloneActiveRange.c1 > 0) {
                        k = cloneActiveRange.c1 - 1;
                    }
                }
                if (n > cloneActiveRange.r1 && n < cloneActiveRange.r2 && k > cloneActiveRange.c1 && k < cloneActiveRange.c2) {
                    continue;
                }
                isEnd = true;
                for (var k = cloneActiveRange.c1 - 1; k <= cloneActiveRange.c2 + 1; k++) {
                    if (k < 0) {
                        continue;
                    }
                    if (k >= cloneActiveRange.c1 && k <= cloneActiveRange.c2 && n >= cloneActiveRange.r1 && n <= cloneActiveRange.r2) {
                        continue;
                    }
                    cell = ws.model.getRange3(n, k, n, k);
                    isEmptyCell = cell.isEmptyText();
                    if (! (n == ar.r1 && k == ar.c1) && isMergedCells != null && isEmptyCell) {
                        merged = cell.hasMerged();
                        valueMerg = null;
                        if (merged) {
                            valueMerg = ws.model.getRange3(merged.r1, merged.c1, merged.r2, merged.c2).getValue();
                            if (valueMerg != null && valueMerg != "") {
                                if (merged.r1 < cloneActiveRange.r1) {
                                    cloneActiveRange.r1 = merged.r1;
                                    n = cloneActiveRange.r1 - 1;
                                }
                                if (merged.r2 > cloneActiveRange.r2) {
                                    cloneActiveRange.r2 = merged.r2;
                                    n = cloneActiveRange.r2 - 1;
                                }
                                if (merged.c1 < cloneActiveRange.c1) {
                                    cloneActiveRange.c1 = merged.c1;
                                    k = cloneActiveRange.c1 - 1;
                                }
                                if (merged.c2 > cloneActiveRange.c2) {
                                    cloneActiveRange.c2 = merged.c2;
                                    k = cloneActiveRange.c2 - 1;
                                }
                                if (n < 0) {
                                    n = 0;
                                }
                                if (k < 0) {
                                    k = 0;
                                }
                                cell = ws.model.getRange3(n, k, n, k);
                            }
                        }
                    }
                    if ((!isEmptyCell || (valueMerg != null && valueMerg != "")) && cell.getTableStyle() == null && !(aWs.getRowHidden(cell.bbox.r1) && this.searchRangeInTableParts(cell.bbox) !== -1)) {
                        if (k < cloneActiveRange.c1) {
                            cloneActiveRange.c1 = k;
                            isEnd = false;
                            k = k - 2;
                        } else {
                            if (k > cloneActiveRange.c2) {
                                cloneActiveRange.c2 = k;
                                isEnd = false;
                            }
                        }
                        if (n < cloneActiveRange.r1) {
                            cloneActiveRange.r1 = n;
                            isEnd = false;
                        } else {
                            if (n > cloneActiveRange.r2) {
                                cloneActiveRange.r2 = n;
                                isEnd = false;
                            }
                        }
                    }
                }
            }
            var mergeCells;
            if (ar.r1 == cloneActiveRange.r1) {
                for (var n = cloneActiveRange.c1; n <= cloneActiveRange.c2; n++) {
                    cell = ws.model.getRange3(cloneActiveRange.r1, n, cloneActiveRange.r1, n);
                    if (cell.getValueWithoutFormat() != "") {
                        break;
                    }
                    if (n == cloneActiveRange.c2 && cloneActiveRange.r2 > cloneActiveRange.r1) {
                        cloneActiveRange.r1++;
                    }
                }
            } else {
                if (ar.r1 == cloneActiveRange.r2) {
                    for (var n = cloneActiveRange.c1; n <= cloneActiveRange.c2; n++) {
                        cell = ws.model.getRange3(cloneActiveRange.r2, n, cloneActiveRange.r2, n);
                        if (cell.getValueWithoutFormat() != "") {
                            break;
                        }
                        if (n == cloneActiveRange.c2 && cloneActiveRange.r2 > cloneActiveRange.r1) {
                            cloneActiveRange.r2--;
                        }
                    }
                }
            }
            if (ar.c1 == cloneActiveRange.c1) {
                for (var n = cloneActiveRange.r1; n <= cloneActiveRange.r2; n++) {
                    cell = ws.model.getRange3(n, cloneActiveRange.c1, n, cloneActiveRange.c1);
                    if (cell.getValueWithoutFormat() != "") {
                        break;
                    }
                    if (n == cloneActiveRange.r2 && cloneActiveRange.r2 > cloneActiveRange.r1) {
                        cloneActiveRange.c1++;
                    }
                }
            } else {
                if (ar.c1 == cloneActiveRange.c2) {
                    for (var n = cloneActiveRange.r1; n <= cloneActiveRange.r2; n++) {
                        cell = ws.model.getRange3(n, cloneActiveRange.c2, n, cloneActiveRange.c2);
                        if (cell.getValueWithoutFormat() != "") {
                            break;
                        }
                        if (n == cloneActiveRange.r2 && cloneActiveRange.c2 > cloneActiveRange.c1) {
                            mergeCells = ws.model.getRange3(n, cloneActiveRange.c2, n, cloneActiveRange.c2).hasMerged();
                            if (!mergeCells || mergeCells === null) {
                                cloneActiveRange.c2--;
                            } else {
                                if (ws.model.getRange3(mergeCells.r1, mergeCells.c1, mergeCells.r2, mergeCells.c2).getValue() == "") {
                                    cloneActiveRange.c2--;
                                }
                            }
                        }
                    }
                }
            }
            if (aWs.AutoFilter || aWs.TableParts) {
                var oldFilters = [];
                if (aWs.AutoFilter) {
                    oldFilters[0] = aWs.AutoFilter;
                }
                if (aWs.TableParts) {
                    var s = 1;
                    if (!oldFilters[0]) {
                        s = 0;
                    }
                    for (k = 0; k < aWs.TableParts.length; k++) {
                        if (aWs.TableParts[k].AutoFilter) {
                            oldFilters[s] = aWs.TableParts[k];
                            s++;
                        }
                    }
                }
                var newRange = {};
                for (var i = 0; i < oldFilters.length; i++) {
                    if (!oldFilters[i].Ref || oldFilters[i].Ref == "") {
                        continue;
                    }
                    var oldRange = oldFilters[i].Ref;
                    var intersection = oldRange.intersection ? oldRange.intersection(cloneActiveRange) : null;
                    if (cloneActiveRange.r1 <= oldRange.r1 && cloneActiveRange.r2 >= oldRange.r2 && cloneActiveRange.c1 <= oldRange.c1 && cloneActiveRange.c2 >= oldRange.c2) {
                        if (oldRange.r2 > ar.r1 && ar.c2 >= oldRange.c1 && ar.c2 <= oldRange.c2) {
                            newRange.r2 = oldRange.r1 - 1;
                        } else {
                            if (oldRange.r1 < ar.r2 && ar.c2 >= oldRange.c1 && ar.c2 <= oldRange.c2) {
                                newRange.r1 = oldRange.r2 + 1;
                            } else {
                                if (oldRange.c2 < ar.c1) {
                                    newRange.c1 = oldRange.c2 + 1;
                                } else {
                                    if (oldRange.c1 > ar.c2) {
                                        newRange.c2 = oldRange.c1 - 1;
                                    }
                                }
                            }
                        }
                    } else {
                        if (intersection) {
                            if (intersection.r1 >= cloneActiveRange.r1 && intersection.r1 <= cloneActiveRange.r2) {
                                cloneActiveRange.r2 = intersection.r1 - 1;
                                if (cloneActiveRange.r2 < cloneActiveRange.r1) {
                                    cloneActiveRange.r1 = cloneActiveRange.r2;
                                }
                            }
                        }
                    }
                }
                if (!newRange.r1) {
                    newRange.r1 = cloneActiveRange.r1;
                }
                if (!newRange.c1) {
                    newRange.c1 = cloneActiveRange.c1;
                }
                if (!newRange.r2) {
                    newRange.r2 = cloneActiveRange.r2;
                }
                if (!newRange.c2) {
                    newRange.c2 = cloneActiveRange.c2;
                }
                newRange = Asc.Range(newRange.c1, newRange.r1, newRange.c2, newRange.r2);
                cloneActiveRange = newRange;
            }
            if (cloneActiveRange) {
                return cloneActiveRange;
            } else {
                return ar;
            }
        },
        _showAutoFilterDialog: function (cell, kF) {
            var ws = this.worksheet;
            var elements = this._getAutoFilterArray(cell);
            if (!elements) {
                return;
            }
            elements = this._sortArrayMinMax(elements);
            var indexFilter = this._findArrayFromAllFilter3(this._idToRange(cell.id), cell.id);
            var aWs = this._getCurrentWS();
            var filtersOp = indexFilter.split(":");
            var currentFilter;
            var filter;
            if (filtersOp[0] == "all") {
                currentFilter = aWs.AutoFilter;
                filter = aWs.AutoFilter;
            } else {
                currentFilter = aWs.TableParts[filtersOp[0]].AutoFilter;
                filter = aWs.TableParts[filtersOp[0]];
            }
            var filters;
            if (currentFilter && currentFilter.FilterColumns) {
                filters = currentFilter.FilterColumns;
                for (var k = 0; k < filters.length; k++) {
                    if (filters[k].ColId == filtersOp[1]) {
                        filters = filters[k];
                        break;
                    }
                }
            }
            var autoFilterObject = new Asc.AutoFiltersOptions();
            if (filters && filters.CustomFiltersObj && filters.CustomFiltersObj.CustomFilters) {
                filter = filters.CustomFiltersObj.CustomFilters;
                var val1;
                var val2;
                var filter1;
                var filter2;
                var isCheked = filters.CustomFiltersObj.And;
                if (filter[0]) {
                    filter1 = filter[0].Operator;
                    val1 = filter[0].Val;
                }
                if (filter[1]) {
                    filter2 = filter[1].Operator;
                    val2 = filter[1].Val;
                }
                autoFilterObject.asc_setValFilter1(val1);
                autoFilterObject.asc_setValFilter2(val2);
                autoFilterObject.asc_setFilter1(filter1);
                autoFilterObject.asc_setFilter2(filter2);
                autoFilterObject.asc_setIsChecked(isCheked);
            }
            var sortVal = false;
            if (filter && filter.SortState && filter.SortState.SortConditions && filter.SortState.SortConditions[0]) {
                if (cell.id == filter.SortState.SortConditions[0].Ref.split(":")[0]) {
                    if (filter.SortState.SortConditions[0].ConditionDescending == false) {
                        sortVal = "descending";
                    } else {
                        sortVal = "ascending";
                    }
                }
            }
            var isCustomFilter = false;
            if (elements.dF) {
                isCustomFilter = true;
            }
            autoFilterObject.asc_setSortState(sortVal);
            autoFilterObject.asc_setCellId(cell.id);
            autoFilterObject.asc_setResult(elements);
            autoFilterObject.asc_setIsCustomFilter(isCustomFilter);
            autoFilterObject.asc_setY(cell.y1 * kF);
            autoFilterObject.asc_setX(cell.x1 * kF);
            autoFilterObject.asc_setWidth(cell.width * kF);
            autoFilterObject.asc_setHeight(cell.height * kF);
            ws.handlers.trigger("setAutoFiltersDialog", autoFilterObject);
        },
        _drawButton: function (x1, y1, options) {
            var ws = this.worksheet;
            var isSet = options.isSetFilter;
            var height = 11.25;
            var width = 11.25;
            var rowHeight = ws.rows[options.row].height;
            var colWidth = ws.cols[options.col].width;
            var index = 1;
            var diffX = 0;
            var diffY = 0;
            if ((colWidth - 2) < width && rowHeight < (height + 2)) {
                if (rowHeight < colWidth) {
                    index = rowHeight / height;
                    width = width * index;
                    height = rowHeight;
                } else {
                    index = colWidth / width;
                    diffY = width - colWidth;
                    diffX = width - colWidth;
                    width = colWidth;
                    height = height * index;
                }
            } else {
                if ((colWidth - 2) < width) {
                    index = colWidth / width;
                    diffY = width - colWidth;
                    diffX = width - colWidth + 2;
                    width = colWidth;
                    height = height * index;
                } else {
                    if (rowHeight < height) {
                        index = rowHeight / height;
                        width = width * index;
                        height = rowHeight;
                    }
                }
            }
            ws.drawingCtx.setFillStyle(ws.settings.cells.defaultState.background).setLineWidth(1).setStrokeStyle(ws.settings.cells.defaultState.border).fillRect(x1 + diffX, y1 + diffY, width, height).strokeRect(x1 + diffX, y1 + diffY, width, height);
            var upLeftXButton = x1 + diffX;
            var upLeftYButton = y1 + diffY;
            if (isSet) {
                var centerX = upLeftXButton + (width / 2);
                var heigthObj = Math.ceil((height / 2) / 0.75) * 0.75;
                var marginTop = Math.floor(((height - heigthObj) / 2) / 0.75) * 0.75;
                var coordY = upLeftYButton + heigthObj + marginTop;
                this._drawFilterMark(centerX, coordY, heigthObj, index);
            } else {
                var centerX = upLeftXButton + (width / 2);
                var centerY = upLeftYButton + (height / 2);
                this._drawFilterDreieck(centerX, centerY, index);
            }
        },
        _drawFilterMark: function (x, y, height, index) {
            var ws = this.worksheet;
            var size = 5.25 * index;
            var halfSize = Math.round((size / 2) / 0.75) * 0.75;
            var meanLine = Math.round((size * Math.sqrt(3) / 3) / 0.75) * 0.75;
            x = Math.round((x) / 0.75) * 0.75;
            y = Math.round((y) / 0.75) * 0.75;
            var y1 = y - height;
            ws.drawingCtx.beginPath().moveTo(x, y).lineTo(x, y1).setStrokeStyle(this.m_oColor).stroke();
            ws.drawingCtx.beginPath().lineTo(x + halfSize, y1).lineTo(x, y1 + meanLine).lineTo(x - halfSize, y1).lineTo(x, y1).setFillStyle(this.m_oColor).fill();
        },
        _drawFilterDreieck: function (x, y, index) {
            var ws = this.worksheet;
            var size = 5.25 * index;
            var leftDiff = size / 2;
            var upDiff = Math.round(((size * Math.sqrt(3)) / 6) / 0.75) * 0.75;
            x = Math.round((x - leftDiff) / 0.75) * 0.75;
            y = Math.round((y - upDiff) / 0.75) * 0.75;
            var meanLine = Math.round((size * Math.sqrt(3) / 3) / 0.75) * 0.75;
            var halfSize = Math.round((size / 2) / 0.75) * 0.75;
            ws.drawingCtx.beginPath().moveTo(x, y).lineTo(x + size, y).lineTo(x + halfSize, y + meanLine).lineTo(x, y).setFillStyle(this.m_oColor).fill();
        },
        _getLogical: function (conFilter, options) {
            var val = options.val;
            var type = options.type;
            var valWithFormat = options.valWithFormat;
            if (type == 0) {
                val = parseFloat(val);
            }
            var arrLog = [];
            arrLog[0] = conFilter.filter1;
            arrLog[1] = conFilter.filter2;
            var valLog = [];
            valLog[0] = conFilter.valFilter1;
            valLog[1] = conFilter.valFilter2;
            var trueStr;
            if (false && valLog[0] && typeof valLog[0] == "string" && (valLog[0].split("?").length > 1 || valLog[0].split("*").length > 1) && (conFilter.filterDisableSpecSymbols1 || this._getPositionSpecSymbols(valLog[0]) != null)) {
                trueStr = "";
                for (var i = 0; i < valLog[0].length; i++) {
                    if (valLog[0][i] != "?" && valLog[0][i] != "*") {
                        trueStr += valLog[0][i];
                    }
                }
                valLog[0] = trueStr;
            }
            if (false && typeof valLog[1] == "string" && valLog[1] && (valLog[1].split("?").length > 1 || valLog[1].split("*").length > 1) && (conFilter.filterDisableSpecSymbols1 || this._getPositionSpecSymbols(valLog[1]) != null)) {
                trueStr = "";
                for (var i = 0; i < valLog[1].length; i++) {
                    if (valLog[1][i] != "?" && valLog[1][i] != "*") {
                        trueStr += valLog[1][i];
                    }
                }
                valLog[1] = trueStr;
            }
            var result = [];
            for (var s = 0; s < arrLog.length; s++) {
                if (valLog[s] === undefined) {
                    valLog[s] = "";
                }
                var checkComplexSymbols = this._parseComplexSpecSymbols(val, arrLog[s], valLog[s], type);
                var filterVal;
                if (checkComplexSymbols != null) {
                    result[s] = checkComplexSymbols;
                } else {
                    if (arrLog[s] == c_oAscCustomAutoFilter.equals || arrLog[s] == c_oAscCustomAutoFilter.doesNotEqual) {
                        val = val.toString();
                        filterVal = valLog[s].toString();
                        if (arrLog[s] == c_oAscCustomAutoFilter.equals) {
                            if (val == filterVal || valWithFormat == filterVal) {
                                result[s] = true;
                            }
                        } else {
                            if (arrLog[s] == c_oAscCustomAutoFilter.doesNotEqual) {
                                if (val != filterVal || valWithFormat != filterVal) {
                                    result[s] = true;
                                }
                            }
                        }
                    } else {
                        if (arrLog[s] == c_oAscCustomAutoFilter.isGreaterThan || arrLog[s] == c_oAscCustomAutoFilter.isGreaterThanOrEqualTo || arrLog[s] == c_oAscCustomAutoFilter.isLessThan || arrLog[s] == c_oAscCustomAutoFilter.isLessThanOrEqualTo) {
                            filterVal = parseFloat(valLog[s]);
                            if (g_oFormatParser && g_oFormatParser.parse && g_oFormatParser.parse(valLog[s]) != null) {
                                filterVal = g_oFormatParser.parse(valLog[s]).value;
                            }
                            if (isNaN(filterVal)) {
                                filterVal = "";
                            } else {
                                switch (arrLog[s]) {
                                case c_oAscCustomAutoFilter.isGreaterThan:
                                    if (val > filterVal) {
                                        result[s] = true;
                                    }
                                    break;
                                case c_oAscCustomAutoFilter.isGreaterThanOrEqualTo:
                                    if (val >= filterVal) {
                                        result[s] = true;
                                    }
                                    break;
                                case c_oAscCustomAutoFilter.isLessThan:
                                    if (val < valLog[s]) {
                                        result[s] = true;
                                    }
                                    break;
                                case c_oAscCustomAutoFilter.isLessThanOrEqualTo:
                                    if (val <= filterVal) {
                                        result[s] = true;
                                    }
                                    break;
                                }
                            }
                        } else {
                            if (arrLog[s] == c_oAscCustomAutoFilter.beginsWith || arrLog[s] == c_oAscCustomAutoFilter.doesNotBeginWith || arrLog[s] == c_oAscCustomAutoFilter.endsWith || arrLog[s] == c_oAscCustomAutoFilter.doesNotEndWith || arrLog[s] == c_oAscCustomAutoFilter.contains || arrLog[s] == c_oAscCustomAutoFilter.doesNotContain) {
                                filterVal = valLog[s];
                                var newVal = val;
                                if (!isNaN(parseFloat(newVal))) {
                                    newVal = valWithFormat;
                                }
                                var position;
                                switch (arrLog[s]) {
                                case c_oAscCustomAutoFilter.beginsWith:
                                    if (type == 1) {
                                        if (newVal.search(filterVal) == 0) {
                                            result[s] = true;
                                        }
                                    }
                                    break;
                                case c_oAscCustomAutoFilter.doesNotBeginWith:
                                    if (type == 1) {
                                        if (newVal.search(filterVal) != 0) {
                                            result[s] = true;
                                        }
                                    } else {
                                        result[s] = true;
                                    }
                                    break;
                                case c_oAscCustomAutoFilter.endsWith:
                                    position = newVal.length - filterVal.length;
                                    if (type == 1) {
                                        if (newVal.lastIndexOf(filterVal) == position && position > 0) {
                                            result[s] = true;
                                        }
                                    }
                                    break;
                                case c_oAscCustomAutoFilter.doesNotEndWith:
                                    position = newVal.length - filterVal.length;
                                    if (type == 1) {
                                        if (newVal.lastIndexOf(filterVal) != position && position > 0) {
                                            result[s] = true;
                                        }
                                    } else {
                                        result[s] = true;
                                    }
                                    break;
                                case c_oAscCustomAutoFilter.contains:
                                    if (type == 1) {
                                        if (newVal.search(filterVal) != -1) {
                                            result[s] = true;
                                        }
                                    }
                                    break;
                                case c_oAscCustomAutoFilter.doesNotContain:
                                    if (type == 1) {
                                        if (newVal.search(filterVal) == -1) {
                                            result[s] = true;
                                        }
                                    } else {
                                        result[s] = true;
                                    }
                                    break;
                                }
                            }
                        }
                    }
                    if (!result[s]) {
                        if (filterVal == "" || arrLog[s] == null) {
                            result[s] = "hidden";
                        } else {
                            result[s] = false;
                        }
                    }
                }
            }
            if (conFilter.isChecked == false) {
                if ((result[0] == true && result[1] == true) || (result[0] == "hidden" && result[1] == true) || (result[0] == true && result[1] == "hidden")) {
                    return true;
                }
            } else {
                if ((result[0] == true || result[1] == true) || (result[0] == "hidden" && result[1] == true) || (result[0] == true && result[1] == "hidden")) {
                    return true;
                }
            }
            return false;
        },
        _searchFilters: function (activeCells, isAll) {
            var ws = this.worksheet;
            var aWs = this._getCurrentWS();
            var allF = [];
            if (aWs.AutoFilter) {
                allF[0] = aWs.AutoFilter;
            }
            if (aWs.TableParts) {
                var s = 1;
                if (!allF[0]) {
                    s = 0;
                }
                for (var k = 0; k < aWs.TableParts.length; k++) {
                    if (aWs.TableParts[k]) {
                        allF[s] = aWs.TableParts[k];
                        s++;
                    }
                }
            }
            var num = -1;
            var numAll = -1;
            if (typeof activeCells == "string") {
                var newCell = ws.model.getCell(new CellAddress(activeCells));
                if (newCell) {
                    var newActiveCell = {
                        c1: newCell.first.col - 1,
                        c2: newCell.first.col - 1,
                        r1: newCell.first.row - 1,
                        r2: newCell.first.row - 1
                    };
                    activeCells = newActiveCell;
                }
            }
            for (var i = 0; i < allF.length; i++) {
                if (!allF[i].Ref || allF[i].Ref == "") {
                    continue;
                }
                var cCell = allF[i].Ref;
                var range = cCell;
                if (!allF[i].AutoFilter && !allF[i].TableStyleInfo) {
                    numAll = {
                        num: i,
                        range: range,
                        all: true
                    };
                }
                if (activeCells.c1 >= range.c1 && activeCells.c2 <= range.c2 && activeCells.r1 >= range.r1 && activeCells.r2 <= range.r2) {
                    var curRange = range.clone();
                    if (allF[i].TableStyleInfo) {
                        if (!allF[i].AutoFilter) {
                            num = {
                                num: i,
                                range: range,
                                all: false,
                                containsFilter: false
                            };
                        } else {
                            if (isAll) {
                                num = {
                                    num: i,
                                    range: range,
                                    all: false,
                                    containsFilter: true
                                };
                            } else {
                                num = {
                                    num: i,
                                    range: range,
                                    all: false,
                                    changeStyle: true
                                };
                            }
                        }
                    } else {
                        if (!allF[i].AutoFilter) {
                            if (isAll === false && activeCells && range && !activeCells.containsRange(range) && !(range.containsRange(activeCells) && activeCells.c1 == activeCells.c2 && activeCells.r1 == activeCells.r2)) {
                                num = "error";
                            } else {
                                num = {
                                    num: i,
                                    range: range,
                                    all: true
                                };
                            }
                        } else {
                            num = {
                                num: i,
                                range: range,
                                all: false
                            };
                        }
                    }
                } else {
                    if (num == -1) {
                        if (this._crossRange(activeCells, range)) {
                            if (! (aWs.AutoFilter && i == 0 && isAll == true)) {
                                num = "error";
                            }
                        }
                    }
                }
            }
            if (!isAll && num != -1 && curRange && activeCells.c1 >= curRange.c1 && activeCells.c2 <= curRange.c2 && activeCells.r1 >= curRange.r1 && activeCells.r2 <= curRange.r2 && num.all == true) {
                num.changeAllFOnTable = true;
            }
            if (isAll && num == -1 && numAll == -1) {
                return false;
            } else {
                if (isAll && num == -1) {
                    return numAll;
                } else {
                    if (num != -1) {
                        return num;
                    }
                }
            }
        },
        _findArrayFromAllFilter3: function (range, id) {
            var ws = this.worksheet;
            var aWs = this._getCurrentWS();
            var index = undefined;
            if (aWs.AutoFilter) {
                var rangeFilter = aWs.AutoFilter.Ref;
                if (range.r1 >= rangeFilter.r1 && range.c1 >= rangeFilter.c1 && range.r2 <= rangeFilter.r2 && range.c2 <= rangeFilter.c2) {
                    var res = aWs.AutoFilter.result;
                    for (s = 0; s < res.length; s++) {
                        if (res[s].id == id) {
                            index = "all" + ":" + s;
                            break;
                        }
                    }
                    return index;
                }
            }
            if (aWs.TableParts) {
                var tableParts = aWs.TableParts;
                for (var tP = 0; tP < tableParts.length; tP++) {
                    var rangeFilter = tableParts[tP].Ref;
                    if (range.r1 >= rangeFilter.r1 && range.c1 >= rangeFilter.c1 && range.r2 <= rangeFilter.r2 && range.c2 <= rangeFilter.c2) {
                        index = tP;
                        break;
                    }
                }
                if (aWs.TableParts[index] == undefined) {
                    return undefined;
                }
                var res = aWs.TableParts[index].result;
                for (var s = 0; s < res.length; s++) {
                    if (res[s].id == id) {
                        index = index + ":" + s;
                        break;
                    }
                }
                return index;
            }
        },
        _addButtonAF: function (arr) {
            if (arr.result) {
                if (!this.allButtonAF) {
                    this.allButtonAF = [];
                }
                if (arr.isVis) {
                    var isButtonDraw = false;
                    if (!isButtonDraw) {
                        var leng = this.allButtonAF.length;
                        var n = 0;
                        var isInsert = false;
                        for (var i = 0; i < arr.result.length; i++) {
                            if (arr.result[i].showButton != false) {
                                isInsert = false;
                                if (leng) {
                                    for (var aF = 0; aF < this.allButtonAF.length; aF++) {
                                        if (this.allButtonAF[aF].id == arr.result[i].id) {
                                            this.allButtonAF[aF] = arr.result[i].clone();
                                            this.allButtonAF[aF].inFilter = Asc.g_oRangeCache.getAscRange(arr.result[0].id + ":" + arr.result[arr.result.length - 1].idNext).clone();
                                            isInsert = true;
                                            break;
                                        }
                                    }
                                }
                                if (!isInsert) {
                                    this.allButtonAF[leng + n] = arr.result[i].clone();
                                    this.allButtonAF[leng + n].inFilter = Asc.g_oRangeCache.getAscRange(arr.result[0].id + ":" + arr.result[arr.result.length - 1].idNext).clone();
                                    n++;
                                }
                            }
                        }
                    }
                } else {
                    var removeButtons = [];
                    for (var i = 0; i < this.allButtonAF.length; i++) {
                        for (var n = 0; n < arr.result.length; n++) {
                            if (this.allButtonAF[i] && this.allButtonAF[i].id == arr.result[n].id) {
                                removeButtons[i] = true;
                            }
                        }
                    }
                    for (var i = removeButtons.length - 1; i >= 0; i--) {
                        if (removeButtons[i]) {
                            this.allButtonAF.splice(i, 1);
                        }
                    }
                    if (!this.allButtonAF[0] && this.allButtonAF.length) {
                        this.allButtonAF.length = 0;
                    }
                }
            }
        },
        _cleanStyleTable: function (aWs, sRef) {
            var oRange = new Range(aWs, sRef.r1, sRef.c1, sRef.r2, sRef.c2);
            oRange.setTableStyle(null);
        },
        _setColorStyleTable: function (range, options, isOpenFilter, isSetVal) {
            var ws = this.worksheet;
            var bbox = range;
            if ((bbox.r2 - bbox.r1) > maxValRow) {
                bbox.r2 = bbox.r1 + maxValRow;
            }
            if ((bbox.c2 - bbox.c1) > maxValCol) {
                bbox.c2 = bbox.c1 + maxValCol;
            }
            var style = options.TableStyleInfo.clone();
            var styleForCurTable;
            var headerRowCount = 1;
            var totalsRowCount = 0;
            if (null != options.HeaderRowCount) {
                headerRowCount = options.HeaderRowCount;
            }
            if (null != options.TotalsRowCount) {
                totalsRowCount = options.TotalsRowCount;
            }
            if (style && style.Name && ws.model.workbook.TableStyles && ws.model.workbook.TableStyles.AllStyles && (styleForCurTable = ws.model.workbook.TableStyles.AllStyles[style.Name])) {
                if (true != isOpenFilter && headerRowCount > 0 && options.TableColumns) {
                    for (var ncol = bbox.c1; ncol <= bbox.c2; ncol++) {
                        var range = ws.model.getCell3(bbox.r1, ncol);
                        var num = ncol - bbox.c1;
                        var tableColumn = options.TableColumns[num];
                        if (null != tableColumn && null != tableColumn.Name && !startRedo && isSetVal) {
                            range.setValue(tableColumn.Name);
                            range.setType(CellValueType.String);
                        }
                    }
                }
                var aNoHiddenCol = [];
                for (var i = bbox.c1; i <= bbox.c2; i++) {
                    if (!ws.model.getColHidden(i)) {
                        aNoHiddenCol.push(i);
                    }
                }
                aNoHiddenCol.sort(fSortAscending);
                if (aNoHiddenCol.length > 0) {
                    if (aNoHiddenCol[0] != bbox.c1) {
                        style.ShowFirstColumn = false;
                    }
                    if (aNoHiddenCol[aNoHiddenCol.length - 1] != bbox.c2) {
                        style.ShowLastColumn = false;
                    }
                }
                var aNoHiddenRow = [];
                for (var i = bbox.r1; i <= bbox.r2; i++) {
                    var row = ws.model._getRowNoEmpty(i);
                    if (!ws.model.getRowHidden(i)) {
                        aNoHiddenRow.push(i);
                    }
                }
                aNoHiddenRow.sort(fSortAscending);
                if (aNoHiddenRow.length > 0) {
                    if (aNoHiddenRow[0] != bbox.r1) {
                        headerRowCount = 0;
                    }
                    if (aNoHiddenRow[aNoHiddenRow.length - 1] != bbox.r2) {
                        totalsRowCount = 0;
                    }
                }
                bbox = {
                    r1: 0,
                    c1: 0,
                    r2: aNoHiddenRow.length - 1,
                    c2: aNoHiddenCol.length - 1
                };
                for (var i = 0, length = aNoHiddenRow.length; i < length; i++) {
                    var nRowIndexAbs = aNoHiddenRow[i];
                    for (var j = 0, length2 = aNoHiddenCol.length; j < length2; j++) {
                        var nColIndexAbs = aNoHiddenCol[j];
                        var cell = ws.model.getRange3(nRowIndexAbs, nColIndexAbs, nRowIndexAbs, nColIndexAbs);
                        var dxf = styleForCurTable.getStyle(bbox, i, j, style, headerRowCount, totalsRowCount);
                        if (null != dxf) {
                            cell.setTableStyle(dxf);
                        }
                    }
                }
            }
        },
        _getCurrentWS: function () {
            var ws = this.worksheet;
            return ws.model;
        },
        _isActiveSheet: function () {
            var ws = this.worksheet;
            return ws.model.getIndex() === ws.model.workbook.getActive();
        },
        addFiltersAfterOpen: function () {
            var aWs = this._getCurrentWS();
            if (aWs && (aWs.AutoFilter || aWs.TableParts)) {
                if (aWs.AutoFilter) {
                    this.addAutoFilter(false, null, "all");
                }
                var tableParts = aWs.TableParts;
                if (tableParts) {
                    for (var numTP = 0; numTP < tableParts.length; numTP++) {
                        this.addAutoFilter(true, null, numTP);
                    }
                }
            }
        },
        _getArrayOpenCells: function (index, buttonId) {
            if (!index) {
                return;
            }
            var aWs = this._getCurrentWS(),
            currentFilter,
            numFilter,
            curIndex = index.split(":"),
            opFil;
            if (curIndex[0] == "all") {
                currentFilter = aWs.AutoFilter;
                numFilter = curIndex[1];
                if (!currentFilter.FilterColumns) {
                    currentFilter.FilterColumns = [];
                }
                opFil = currentFilter.FilterColumns;
            } else {
                currentFilter = aWs.TableParts[curIndex[0]];
                numFilter = curIndex[1];
                if (!currentFilter.AutoFilter) {
                    currentFilter.AutoFilter = new AutoFilter();
                }
                if (!currentFilter.AutoFilter.FilterColumns) {
                    currentFilter.AutoFilter.FilterColumns = [];
                }
                opFil = currentFilter.AutoFilter.FilterColumns;
            }
            if (opFil) {
                var result = this._getOpenAndClosedValues(numFilter, currentFilter, opFil, buttonId);
                return result;
            }
        },
        _getOpenAndClosedValues: function (numFilter, currentFilter, opFil, buttonId) {
            var isFilterCol = false,
            idDigitalFilter = false,
            result = [],
            ws = this.worksheet;
            for (var fN = 0; fN < opFil.length; fN++) {
                var curFilter = opFil[fN];
                if (curFilter && curFilter.Filters) {
                    if (curFilter.Filters.Values || curFilter.Filters.Dates) {
                        var filValue = curFilter.Filters.Values;
                        var dataValues = curFilter.Filters.Dates;
                        var isBlank = curFilter.Filters.Blank;
                        var nC = 0;
                        var acCell = currentFilter.result[curFilter.ColId];
                        if (acCell.showButton == false) {
                            for (var sb = curFilter.ColId + 1; sb < currentFilter.result.length; sb++) {
                                if (currentFilter.result[sb].showButton != false) {
                                    break;
                                }
                            }
                        }
                        if (sb && sb == numFilter) {
                            numFilter = curFilter.ColId;
                        }
                        var startRow = ws.model.getCell(new CellAddress(acCell.id)).first.row - 1;
                        var endRow = ws.model.getCell(new CellAddress(acCell.idNext)).first.row - 1;
                        var col = ws.model.getCell(new CellAddress(acCell.id)).first.col - 1;
                        var visible;
                        for (var nRow = startRow + 1; nRow <= endRow; nRow++) {
                            var cell = ws.model.getCell3(nRow, col);
                            var val, val2;
                            val = val2 = cell.getValueWithFormat();
                            var isDateFormatCell = cell.getNumFormat().isDateTimeFormat();
                            var valueWithoutFormat = cell.getValueWithoutFormat();
                            if (!result[nC]) {
                                result[nC] = new AutoFiltersOptionsElements();
                            }
                            if (curFilter.ColId == numFilter) {
                                var isFilterCol = true;
                                var isInput = false;
                                result[nC].val = val;
                                result[nC].val2 = val2;
                                visible = (result[nC].visible == "hidden") ? true : false;
                                if (filValue && filValue.length != 0) {
                                    for (var nVal = 0; nVal < filValue.length; nVal++) {
                                        if (val2 == "" && isBlank == null) {
                                            if (!visible) {
                                                result[nC].visible = false;
                                            }
                                        }
                                        if (val2 == "" && isBlank == true) {
                                            isInput = true;
                                            if (!visible) {
                                                result[nC].visible = true;
                                            }
                                            break;
                                        } else {
                                            if (filValue[nVal] == val2) {
                                                isInput = true;
                                                if (!visible) {
                                                    result[nC].visible = true;
                                                }
                                                break;
                                            } else {
                                                if (!visible) {
                                                    result[nC].visible = false;
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    if (filValue && filValue.length == 0 && val2 == "" && isBlank == true) {
                                        isInput = true;
                                        if (!visible) {
                                            result[nC].visible = true;
                                        }
                                    }
                                }
                                if (dataValues && dataValues.length != 0 && !isInput) {
                                    for (var nVal = 0; nVal < dataValues.length; nVal++) {
                                        result[nC].val = val;
                                        result[nC].val2 = val2;
                                        if (isDateFormatCell && this._dataFilterParse(dataValues[nVal], valueWithoutFormat)) {
                                            if (result[nC].visible != "hidden") {
                                                result[nC].visible = true;
                                            }
                                            break;
                                        } else {
                                            if (result[nC].visible != "hidden") {
                                                result[nC].visible = false;
                                            }
                                        }
                                    }
                                }
                            } else {
                                var check = false;
                                if (filValue.length == 0 && val == "" && isBlank == true) {
                                    check = true;
                                }
                                for (var nVal = 0; nVal < filValue.length; nVal++) {
                                    if ((filValue[nVal] == val2) || (val == "" && isBlank == true)) {
                                        check = true;
                                        break;
                                    }
                                }
                                if (dataValues) {
                                    for (var nVal = 0; nVal < dataValues.length; nVal++) {
                                        if (isDateFormatCell && this._dataFilterParse(dataValues[nVal], valueWithoutFormat)) {
                                            check = true;
                                            break;
                                        }
                                    }
                                }
                                if (!check) {
                                    result[nC].visible = "hidden";
                                }
                            }
                            if (result[nC].visible != "hidden") {
                                if (result[nC].val == undefined) {
                                    result[nC].val = val;
                                    result[nC].val2 = val2;
                                }
                            }
                            if (nC >= 1000) {
                                break;
                            } else {
                                nC++;
                            }
                        }
                    }
                } else {
                    if (curFilter && curFilter.CustomFiltersObj && curFilter.CustomFiltersObj.CustomFilters) {
                        var nC = 0;
                        var acCell = currentFilter.result[curFilter.ColId];
                        if (acCell.showButton == false) {
                            for (var sb = curFilter.ColId + 1; sb < currentFilter.result.length; sb++) {
                                if (currentFilter.result[sb].showButton != false) {
                                    break;
                                }
                            }
                        }
                        if (sb && sb == numFilter) {
                            numFilter = curFilter.ColId;
                        }
                        var startRow = ws.model.getCell(new CellAddress(acCell.id)).first.row - 1;
                        var endRow = ws.model.getCell(new CellAddress(acCell.idNext)).first.row - 1;
                        var col = ws.model.getCell(new CellAddress(acCell.id)).first.col - 1;
                        for (nRow = startRow + 1; nRow <= endRow; nRow++) {
                            var cell = ws.model.getCell3(nRow, col);
                            var val, val2;
                            val = val2 = cell.getValueWithFormat();
                            var type = cell.getType();
                            if (!result[nC]) {
                                result[nC] = new AutoFiltersOptionsElements();
                            }
                            if (curFilter.ColId == numFilter) {
                                var isFilterCol = true;
                                idDigitalFilter = true;
                                result[nC].rep = this._findCloneElement(result, val);
                                result[nC].val = val;
                                result[nC].val2 = val2;
                                if (result[nC].visible != "hidden") {
                                    result[nC].visible = false;
                                }
                            } else {
                                var check = false;
                                var filterCust = {
                                    filter1: curFilter.CustomFiltersObj.CustomFilters[0].Operator,
                                    filter2: curFilter.CustomFiltersObj.CustomFilters[1] ? curFilter.CustomFiltersObj.CustomFilters[1].Operator : undefined,
                                    valFilter1: curFilter.CustomFiltersObj.CustomFilters[0].Val,
                                    valFilter2: curFilter.CustomFiltersObj.CustomFilters[1] ? curFilter.CustomFiltersObj.CustomFilters[1].Val : undefined,
                                    isChecked: curFilter.CustomFiltersObj.And
                                };
                                if (!isNaN(parseFloat(val2))) {
                                    val2 = parseFloat(val2);
                                }
                                if (!this._getLogical(filterCust, {
                                    val: val2,
                                    type: type,
                                    valWithFormat: val
                                })) {
                                    result[nC].visible = "hidden";
                                }
                            }
                            this._isHiddenAnotherFilter(curFilter.ColId, nRow);
                            if (nC >= 1000) {
                                break;
                            } else {
                                nC++;
                            }
                        }
                    } else {
                        if (curFilter && curFilter.Top10) {
                            var nC = 0;
                            var acCell = currentFilter.result[curFilter.ColId];
                            var startRow = ws.model.getCell(new CellAddress(acCell.id)).first.row - 1;
                            var endRow = ws.model.getCell(new CellAddress(acCell.idNext)).first.row - 1;
                            var col = ws.model.getCell(new CellAddress(acCell.id)).first.col - 1;
                            var top10Arr = [];
                            for (nRow = startRow + 1; nRow <= endRow; nRow++) {
                                var cell = ws.model.getCell3(nRow, col);
                                var val, val2;
                                val = val2 = cell.getValueWithoutFormat();
                                if (!result[nC]) {
                                    result[nC] = new AutoFiltersOptionsElements();
                                }
                                if (curFilter.ColId == numFilter) {
                                    var isFilterCol = true;
                                    idDigitalFilter = true;
                                    result[nC].rep = this._findCloneElement(result, val);
                                    result[nC].val = val;
                                    result[nC].val2 = val2;
                                    if (result[nC].visible != "hidden") {
                                        result[nC].visible = false;
                                    }
                                } else {
                                    if (!isNaN(parseFloat(val2))) {
                                        val2 = parseFloat(val2);
                                    }
                                    top10Arr[nC] = val2;
                                }
                                this._isHiddenAnotherFilter(curFilter.ColId, nRow);
                                if (this._findCloneElement2(result, nC)) {
                                    result.splice(nC, 1);
                                } else {
                                    if (nC >= 1000) {
                                        break;
                                    } else {
                                        nC++;
                                    }
                                }
                            }
                            if (top10Arr.length != 0) {
                                var top10Filter = curFilter.Top10;
                                var sortTop10;
                                if (top10Filter.Top != false) {
                                    sortTop10 = top10Arr.sort(fSortDescending);
                                } else {
                                    sortTop10 = top10Arr.sort();
                                }
                                var nC = 0;
                                if (sortTop10.length > top10Filter.Val - 1) {
                                    var limit = sortTop10[top10Filter.Val - 1];
                                    for (nRow = startRow + 1; nRow <= endRow; nRow++) {
                                        var cell = ws.model.getCell3(nRow, col);
                                        var val2 = cell.getValueWithoutFormat();
                                        if (!isNaN(parseFloat(val2))) {
                                            val2 = parseFloat(val2);
                                        }
                                        if (top10Filter.Top == false) {
                                            if (val2 > limit) {
                                                result[nC].visible = "hidden";
                                            }
                                        } else {
                                            if (val2 < limit) {
                                                result[nC].visible = "hidden";
                                            }
                                        }
                                        if (this._findCloneElement2(result, nC)) {
                                            result.splice(nC, 1);
                                        } else {
                                            if (nC >= 1000) {
                                                break;
                                            } else {
                                                nC++;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (!isFilterCol) {
                var ref = currentFilter.Ref;
                var rangeFilter = ref;
                var cell = ws.model.getCell(new CellAddress(buttonId));
                var isMerged = cell.hasMerged();
                if (isMerged && ref && ref.containsRange(isMerged)) {
                    var range = this._idToRange(buttonId);
                    range.c1 = isMerged.c1;
                    buttonId = this._rangeToId(range);
                }
                var col = ws.model.getCell(new CellAddress(buttonId)).first.col - 1;
                var startRow = rangeFilter.r1 + 1;
                var endRow = rangeFilter.r2;
                var nC = 0;
                for (var s = startRow; s <= endRow; s++) {
                    var cell = ws.model.getCell3(s, col);
                    if (!result[nC]) {
                        result[nC] = new AutoFiltersOptionsElements();
                    }
                    result[nC].val2 = result[nC].val = cell.getValueWithFormat();
                    if (result[nC].visible != "hidden") {
                        result[nC].visible = ws.model.getRowHidden(s) ? "hidden" : true;
                    }
                    if (nC >= 1000) {
                        break;
                    } else {
                        nC++;
                    }
                }
            }
            for (var i = 0; i < result.length; i++) {
                if (this._findCloneElement2(result, i)) {
                    result.splice(i, 1);
                    i--;
                }
            }
            if (idDigitalFilter) {
                result.dF = true;
            }
            return result;
        },
        _addNewFilter: function (val, tableColumns, aWs, isAll, style, bWithoutFilter) {
            var newFilter, ref;
            if (isAll) {
                if (!aWs.AutoFilter) {
                    newFilter = new AutoFilter();
                    newFilter.result = val;
                    ref = Asc.g_oRangeCache.getAscRange(val[0].id + ":" + val[val.length - 1].idNext).clone();
                    newFilter.Ref = ref;
                    aWs.AutoFilter = newFilter;
                }
                var startCol = this._idToRange(val[0].id);
                var endCol = this._idToRange(val[val.length - 1].idNext);
                var row = startCol.r1;
                var cell, filterColumn;
                for (var col = startCol.c1; col <= endCol.c1; col++) {
                    cell = aWs.getCell3(row, col);
                    var isMerged = cell.hasMerged();
                    if (isMerged && isMerged.c2 != col) {
                        if (!aWs.AutoFilter.FilterColumns) {
                            aWs.AutoFilter.FilterColumns = [];
                        }
                        filterColumn = new FilterColumn();
                        filterColumn.ColId = col - startCol.c1;
                        filterColumn.ShowButton = false;
                        aWs.AutoFilter.FilterColumns[aWs.AutoFilter.FilterColumns.length] = filterColumn;
                        aWs.AutoFilter.result[col - startCol.c1].showButton = false;
                    }
                }
                return aWs.AutoFilter;
            } else {
                if (!aWs.TableParts) {
                    aWs.TableParts = [];
                }
                ref = Asc.g_oRangeCache.getAscRange(val[0].id + ":" + val[val.length - 1].idNext).clone();
                newFilter = new TablePart();
                newFilter.Ref = ref;
                newFilter.result = val;
                if (!bWithoutFilter) {
                    newFilter.AutoFilter = new AutoFilter();
                    newFilter.AutoFilter.Ref = ref;
                }
                newFilter.DisplayName = aWs.workbook.oNameGenerator.getNextTableName(aWs, ref);
                newFilter.TableStyleInfo = new TableStyleInfo();
                newFilter.TableStyleInfo.Name = style;
                newFilter.TableStyleInfo.ShowColumnStripes = false;
                newFilter.TableStyleInfo.ShowFirstColumn = false;
                newFilter.TableStyleInfo.ShowLastColumn = false;
                newFilter.TableStyleInfo.ShowRowStripes = true;
                newFilter.TableColumns = tableColumns;
                aWs.TableParts[aWs.TableParts.length] = newFilter;
                return aWs.TableParts[aWs.TableParts.length - 1];
            }
        },
        _idToRange: function (id) {
            var cell = new CellAddress(id);
            return Asc.Range(cell.col - 1, cell.row - 1, cell.col - 1, cell.row - 1);
        },
        _rangeToId: function (range) {
            var cell = new CellAddress(range.r1, range.c1, 0);
            return cell.getID();
        },
        _addCustomFilters: function (index, aWs, valFilter, isMerged) {
            var parIndex = index;
            var curFilter;
            if (parIndex[0] == "all") {
                curFilter = aWs.AutoFilter;
            } else {
                curFilter = aWs.TableParts[parIndex[0]].AutoFilter;
            }
            var isEn = undefined;
            if (curFilter.FilterColumns) {
                for (var l = 0; l < curFilter.FilterColumns.length; l++) {
                    if (curFilter.FilterColumns[l].ColId == parIndex[1]) {
                        isEn = l;
                    }
                }
                if (isEn == undefined) {
                    var length = curFilter.FilterColumns.length;
                    curFilter.FilterColumns[curFilter.FilterColumns.length] = this._addNewCustomFilter(valFilter, parIndex[1]);
                    if (isMerged) {
                        curFilter.FilterColumns[length].ShowButton = false;
                    }
                } else {
                    curFilter.FilterColumns[isEn] = this._addNewCustomFilter(valFilter, parIndex[1]);
                    if (isMerged) {
                        curFilter.FilterColumns[isEn].ShowButton = false;
                    }
                }
            } else {
                curFilter.FilterColumns = [];
                curFilter.FilterColumns[0] = this._addNewCustomFilter(valFilter, parIndex[1]);
                if (isMerged) {
                    curFilter.FilterColumns[0].ShowButton = false;
                }
            }
        },
        _addNewCustomFilter: function (valFilter, colId) {
            var result = new FilterColumns();
            result.ColId = colId;
            result.CustomFiltersObj = new CustomFilters();
            if (valFilter.filter1 && valFilter.valFilter1 !== null) {
                result.CustomFiltersObj = new CustomFilters();
                result.CustomFiltersObj.CustomFilters = [];
                result.CustomFiltersObj.CustomFilters[0] = new CustomFilter();
                result.CustomFiltersObj.CustomFilters[0].Operator = valFilter.filter1;
                result.CustomFiltersObj.CustomFilters[0].Val = valFilter.valFilter1;
            }
            if (valFilter.filter2 && valFilter.valFilter2 !== null) {
                if (result.CustomFiltersObj.CustomFilters[0]) {
                    result.CustomFiltersObj.CustomFilters[1] = new CustomFilter();
                    result.CustomFiltersObj.CustomFilters[1].Operator = valFilter.filter2;
                    result.CustomFiltersObj.CustomFilters[1].Val = valFilter.valFilter2;
                } else {
                    result.CustomFiltersObj = new CustomFilters();
                    result.CustomFiltersObj.CustomFilters = [];
                    result.CustomFiltersObj.CustomFilters[0] = new CustomFilter();
                    result.CustomFiltersObj.CustomFilters[0].Operator = valFilter.filter2;
                    result.CustomFiltersObj.CustomFilters[0].Val = valFilter.valFilter2;
                }
            }
            if (valFilter.isChecked == true && valFilter.filter2) {
                result.CustomFiltersObj.And = true;
            }
            return result;
        },
        _findCloneElement: function (arr, val) {
            for (var numCl = 0; numCl < arr.length; numCl++) {
                if (arr[numCl].val == val && arr[numCl].visible != "hidden") {
                    return true;
                }
            }
            return false;
        },
        _findCloneElement2: function (arr, index) {
            for (var k = 0; k < index; k++) {
                if (arr[k].val == arr[index].val && arr[k].visible != "hidden" && arr[index].visible != "hidden") {
                    return true;
                }
            }
            return false;
        },
        _getHiddenRows: function (id, idNext, filter) {
            var ws = this.worksheet;
            var startCell = this._idToRange(id);
            var endCell = this._idToRange(idNext);
            var result = [];
            if (filter && filter.CustomFiltersObj) {
                var customFilter = filter.CustomFiltersObj.CustomFilters;
                var filterCust = {
                    filter1: customFilter[0].Operator,
                    filter2: customFilter[1] ? customFilter[1].Operator : undefined,
                    valFilter1: customFilter[0].Val,
                    valFilter2: customFilter[1] ? customFilter[1].Val : undefined,
                    isChecked: filter.CustomFiltersObj.And
                };
                if (filter.ShowButton == false) {
                    var isMerged = ws.model.getCell3(startCell.r1, startCell.c1).hasMerged();
                    if (isMerged) {
                        startCell.c1 = isMerged.c1;
                    }
                }
                for (var m = startCell.r1 + 1; m <= endCell.r1; m++) {
                    var cell = ws.model.getCell3(m, startCell.c1);
                    var val = cell.getValue();
                    var type = cell.getType();
                    var valWithFormat = cell.getValueWithFormat();
                    if (!isNaN(parseFloat(val))) {
                        val = parseFloat(val);
                    }
                    if (!this._getLogical(filterCust, {
                        val: val,
                        type: type,
                        valWithFormat: valWithFormat
                    })) {
                        result[m] = true;
                    }
                }
            } else {
                if (filter && filter.Filters && filter.Filters.Dates && filter.Filters.Dates.length) {
                    var customFilter = filter.Filters.Dates;
                    var isBlank = filter.Filters.Blank;
                    if (filter.ShowButton == false) {
                        var isMerged = ws.model.getCell3(startCell.r1, startCell.c1).hasMerged();
                        if (isMerged) {
                            startCell.c1 = isMerged.c1;
                        }
                    }
                    for (var m = startCell.r1 + 1; m <= endCell.r1; m++) {
                        var val = ws.model.getCell3(m, startCell.c1).getValue();
                        var isVis = false;
                        var dataVal = NumFormat.prototype.parseDate(val);
                        for (var k = 0; k < customFilter.length; k++) {
                            if (dataVal.d == customFilter[k].Day && dataVal.month + 1 == customFilter[k].Month && dataVal.year == customFilter[k].Year) {
                                isVis = true;
                            }
                        }
                        if (val == "" && isBlank == true) {
                            isVis = true;
                        }
                        if (!isVis) {
                            result[m] = true;
                        }
                    }
                } else {
                    if (filter && filter.Filters) {
                        var customFilter = filter.Filters.Values;
                        var isBlank = filter.Filters.Blank;
                        if (filter.ShowButton == false) {
                            var isMerged = ws.model.getCell3(startCell.r1, startCell.c1).hasMerged();
                            if (isMerged) {
                                startCell.c1 = isMerged.c1;
                            }
                        }
                        for (var m = startCell.r1 + 1; m <= endCell.r1; m++) {
                            var val = ws.model.getCell3(m, startCell.c1).getValueWithFormat();
                            var isVis = false;
                            for (var k = 0; k < customFilter.length; k++) {
                                if (val == customFilter[k]) {
                                    isVis = true;
                                }
                            }
                            if (val == "" && isBlank == true) {
                                isVis = true;
                            }
                            if (!isVis) {
                                result[m] = true;
                            }
                        }
                    }
                }
            }
            return result;
        },
        _isHiddenAnotherFilter: function (cellId, row, customFil) {
            var buttons = this.allButtonAF;
            var isCurrenCell = false;
            for (var num = 0; num < buttons.length; num++) {
                if (customFil != undefined && buttons[num].inFilter == customFil) {
                    isCurrenCell = false;
                    if (!isCurrenCell && cellId == buttons[num].id) {
                        isCurrenCell = true;
                    }
                    if (buttons[num].hiddenRows && buttons[num].hiddenRows[row] && !isCurrenCell) {
                        return "hidden";
                    }
                } else {
                    if (customFil == undefined) {
                        isCurrenCell = false;
                        if (!isCurrenCell && cellId == buttons[num].id) {
                            isCurrenCell = true;
                        }
                        if (buttons[num].hiddenRows && buttons[num].hiddenRows[row]) {
                            if (!isCurrenCell && cellId == buttons[num].id) {
                                return false;
                            } else {
                                if (isCurrenCell && cellId != buttons[num].id) {
                                    return undefined;
                                } else {
                                    if (isCurrenCell) {
                                        continue;
                                    } else {
                                        return "hidden";
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return undefined;
        },
        _isHiddenAnotherFilter2: function (cellId, row, ref, customFil) {
            var buttons = this.allButtonAF;
            var isCurrenCell = false;
            for (var num = 0; num < buttons.length; num++) {
                if (customFil != undefined && customFil.isEqual(buttons[num].inFilter)) {
                    isCurrenCell = false;
                    if (!isCurrenCell && cellId == buttons[num].id) {
                        isCurrenCell = true;
                    }
                    if (buttons[num].hiddenRows[row] && !isCurrenCell) {
                        return "hidden";
                    }
                } else {
                    if (customFil == undefined && ref.isEqual(buttons[num].inFilter)) {
                        isCurrenCell = false;
                        if (!isCurrenCell && cellId == buttons[num].id) {
                            isCurrenCell = true;
                        }
                        if (null != buttons[num].hiddenRows && buttons[num].hiddenRows[row]) {
                            if (!isCurrenCell && cellId == buttons[num].id) {
                                return false;
                            } else {
                                if (isCurrenCell && cellId != buttons[num].id) {
                                    return undefined;
                                } else {
                                    if (isCurrenCell) {
                                        continue;
                                    } else {
                                        return "hidden";
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return undefined;
        },
        _changeFiltersAfterInsertCells: function (col, val, type, activeCells, insertType) {
            var aWs = this._getCurrentWS();
            if (val < 0) {
                this.isEmptyAutoFilters(activeCells, true, true, true);
            }
            History.TurnOff();
            if (aWs.AutoFilter) {
                var ref = aWs.AutoFilter.Ref;
                var options = {
                    ref: ref,
                    val: val,
                    type: type,
                    col: col
                };
                if (this._bCheckChangeFilter(type, insertType, activeCells, ref)) {
                    this._isChangeFilterAfterInsertCells(options, type, activeCells);
                }
            }
            if (aWs.TableParts && aWs.TableParts.length > 0) {
                var length;
                for (var lT = 0; lT < aWs.TableParts.length; lT++) {
                    var ref = aWs.TableParts[lT].Ref;
                    var options = {
                        ref: ref,
                        val: val,
                        type: type,
                        col: col,
                        index: lT
                    };
                    length = aWs.TableParts.length;
                    if (this._bCheckChangeFilter(type, insertType, activeCells, ref)) {
                        if (ref) {
                            var clearRange = new Range(aWs, ref.r1, ref.c1, ref.r2, ref.c2);
                            clearRange.setTableStyle(null);
                        }
                        this._isChangeFilterAfterInsertCells(options, type, activeCells);
                    }
                    if (length > aWs.TableParts.length) {
                        lT--;
                    }
                }
            }
            History.TurnOn();
        },
        _isChangeFilterAfterInsertCells: function (options, type, activeCells) {
            var ref = options.ref,
            val = options.val,
            col = options.col,
            index = options.index;
            var range = {};
            var aWs = this._getCurrentWS();
            var startRange = Asc.Range(ref.c1, ref.r1, ref.c1, ref.r1);
            var endRange = Asc.Range(ref.c2, ref.r2, ref.c2, ref.r2);
            range.start = startRange;
            range.end = endRange;
            if (index == undefined) {
                range.index = "all";
            } else {
                range.index = index;
            }
            var colStart = col;
            var colEnd = col + Math.abs(val) - 1;
            var startRangeCell = startRange.c1;
            var endRangeCell = endRange.c2;
            if (type == "insRow") {
                startRangeCell = startRange.r1;
                endRangeCell = endRange.r2;
            }
            var filter;
            if (range.index == "all") {
                filter = aWs.AutoFilter;
            } else {
                filter = aWs.TableParts[range.index];
            }
            var oldFilter = filter.clone(aWs);
            if (startRangeCell < colStart && endRangeCell > colEnd) {
                this._editFilterAfterInsertColumn(range, val, col, type, activeCells, false, oldFilter);
            } else {
                if (startRangeCell <= colStart && endRangeCell >= colEnd) {
                    if (val < 0) {
                        this._editFilterAfterInsertColumn(range, val, col, type, activeCells, false, oldFilter);
                    } else {
                        if (startRangeCell < colStart) {
                            this._editFilterAfterInsertColumn(range, val, col, type, activeCells, false, oldFilter);
                        } else {
                            this._editFilterAfterInsertColumn(range, val, undefined, type, activeCells, false, oldFilter);
                        }
                    }
                } else {
                    if ((colEnd <= startRangeCell && val > 0) || (colEnd < startRangeCell && val < 0)) {
                        if ((activeCells.c1 <= ref.c1 && activeCells.c2 >= ref.c2 && options.type == "insRow") || (activeCells.r1 <= ref.r1 && activeCells.r2 >= ref.r2 && options.type == "insCol")) {
                            this._editFilterAfterInsertColumn(range, val, undefined, type, activeCells, false, oldFilter);
                        }
                    } else {
                        if ((colStart < startRangeCell && colEnd > startRangeCell && colEnd <= endRangeCell) || (colEnd <= startRangeCell && val < 0)) {
                            if (val < 0) {
                                var valNew = startRangeCell - colEnd - 1;
                                var val2 = colStart - startRangeCell;
                                this._editFilterAfterInsertColumn(range, valNew, startRangeCell, type, activeCells, true);
                                this._editFilterAfterInsertColumn(range, val2, undefined, type, activeCells, false, oldFilter);
                            } else {
                                this._editFilterAfterInsertColumn(range, val, undefined, type, activeCells, false, oldFilter);
                            }
                        } else {
                            if (type == "insRow" && colStart <= startRangeCell && colEnd >= endRangeCell) {
                                this._editFilterAfterInsertColumn(range, val, undefined, type, activeCells, false, oldFilter);
                            } else {
                                if ((colStart > startRangeCell && colStart <= endRangeCell && colEnd >= endRangeCell && activeCells.r1 <= range.start.r1 && activeCells.r2 >= range.end.r1 && val > 0) || (colStart >= startRangeCell && colStart <= endRangeCell && colEnd > endRangeCell && val < 0)) {
                                    if (val < 0) {
                                        valNew = colStart - endRangeCell - 1;
                                    } else {
                                        valNew = val;
                                    }
                                    this._editFilterAfterInsertColumn(range, valNew, colStart, type, activeCells, false, oldFilter);
                                } else {
                                    if (colStart <= startRangeCell && colEnd > endRangeCell && activeCells.r1 <= range.start.r1 && activeCells.r2 >= range.end.r1) {
                                        if (val < 0) {
                                            var valNew = startRangeCell - endRangeCell - 1;
                                            var colNew = startRangeCell;
                                            this._editFilterAfterInsertColumn(range, valNew, colNew, type, activeCells, false, oldFilter);
                                        } else {
                                            this._editFilterAfterInsertColumn(range, val, undefined, type, activeCells, false, oldFilter);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        _editFilterAfterInsertColumn: function (cRange, val, col, type, activeCells, notAddToHistory, oldFilter) {
            var bUndoChanges = this.worksheet.model.workbook.bUndoChanges;
            var bRedoChanges = this.worksheet.model.workbook.bRedoChanges;
            var ws = this.worksheet;
            var aWs = this._getCurrentWS();
            var filter;
            var filterColums;
            if (cRange.index == "all") {
                filter = aWs.AutoFilter.clone(aWs);
                filterColums = filter.FilterColumns;
            } else {
                filter = aWs.TableParts[cRange.index].clone(aWs);
                if (filter.AutoFilter) {
                    filterColums = filter.AutoFilter.FilterColumns;
                }
            }
            if (col == null || col == undefined) {
                if (type == "insRow") {
                    cRange.start.r1 = cRange.start.r1 + val;
                    cRange.end.r1 = cRange.end.r1 + val;
                    if (cRange.start.r1 < 0) {
                        cRange.start.r1 = 0;
                    }
                    if (cRange.end.r1 < 0) {
                        cRange.end.r1 = 0;
                    }
                } else {
                    if ((cRange.start.c1 + val) >= 0) {
                        cRange.start.c1 = cRange.start.c1 + val;
                    }
                    if ((cRange.end.c1 + val) >= 0) {
                        cRange.end.c1 = cRange.end.c1 + val;
                    }
                    if (cRange.start.c1 < 0) {
                        cRange.start.c1 = 0;
                    }
                    if (cRange.end.c1 < 0) {
                        cRange.end.c1 = 0;
                    }
                }
                filter.Ref = Asc.Range(cRange.start.c1, cRange.start.r1, cRange.end.c1, cRange.end.r1);
                if (filter.result && filter.result.length > 0) {
                    for (var filR = 0; filR < filter.result.length; filR++) {
                        var curFilter = filter.result[filR];
                        var newFirstCol = this._idToRange(curFilter.id);
                        var newNextCol = this._idToRange(curFilter.idNext);
                        if (type == "insRow") {
                            newFirstCol.r1 = newFirstCol.r1 + val;
                            newNextCol.r1 = newNextCol.r1 + val;
                            if (newFirstCol.r1 < 0) {
                                newFirstCol.r1 = 0;
                            }
                            if (newNextCol.r1 < 0) {
                                newNextCol.r1 = 0;
                            }
                        } else {
                            if ((newFirstCol.c1 + val) >= 0) {
                                newFirstCol.c1 = newFirstCol.c1 + val;
                            }
                            if ((newNextCol.c1 + val) >= 0) {
                                newNextCol.c1 = newNextCol.c1 + val;
                            }
                            if (newFirstCol.c1 < 0) {
                                newFirstCol.c1 = 0;
                            }
                            if (newNextCol.c1 < 0) {
                                newNextCol.c1 = 0;
                            }
                        }
                        var id = this._rangeToId(newFirstCol);
                        var nextId = this._rangeToId(newNextCol);
                        curFilter.inFilter = filter.Ref;
                        curFilter.id = id;
                        curFilter.idNext = nextId;
                    }
                }
                filter.Ref = Asc.Range(cRange.start.c1, cRange.start.r1, cRange.end.c1, cRange.end.r1);
            } else {
                if (Asc.Range(cRange.start.c1, cRange.start.r1, cRange.end.c1, cRange.end.r1).intersection(activeCells)) {
                    if (type == "insRow") {
                        cRange.end.r1 = cRange.end.r1 + val;
                    } else {
                        cRange.end.c1 = cRange.end.c1 + val;
                    }
                    filter = this._changeInfoFilterAfterInsert(filter, type, col, cRange, val, filterColums);
                }
            }
            if (!bUndoChanges && !bRedoChanges && !notAddToHistory && oldFilter) {
                var changeElement = {
                    oldFilter: oldFilter,
                    newFilterRef: filter.Ref
                };
                this._addHistoryTempObj(changeElement, null, null, true, oldFilter.Ref, null, true);
            }
            if (cRange.index == "all") {
                this.changeFilters.AutoFilter = filter;
            } else {
                this.changeFilters.TableParts;
                if (!this.changeFilters.TableParts) {
                    this.changeFilters.TableParts = [];
                }
                this.changeFilters.TableParts[this.changeFilters.TableParts.length] = {
                    DisplayName: aWs.TableParts[cRange.index].DisplayName,
                    filter: filter
                };
            }
        },
        _changeInfoFilterAfterInsert: function (filter, type, col, cRange, val, filterColums) {
            var ws = this.worksheet;
            var inFilter = Asc.Range(cRange.start.c1, cRange.start.r1, cRange.end.c1, cRange.end.r1);
            var cloneFilterColums = [];
            if (filterColums) {
                for (var k = 0; k < filterColums.length; k++) {
                    cloneFilterColums[k] = filterColums[k].clone();
                }
            }
            if (filter.result && filter.result.length > 0) {
                var isInsertIntoMergeCell = false;
                if (type == "insCol" && val > 0) {
                    var tempRangeInsert = ws.model.getRange3(filter.Ref.r1, col, filter.Ref.r1, col);
                    if (tempRangeInsert.hasMerged()) {
                        isInsertIntoMergeCell = true;
                    }
                }
                var newResult = [];
                var n = 0;
                for (var filR = 0; filR < filter.result.length; filR++) {
                    var endCount = 0;
                    var curFilter = filter.result[filR];
                    var newFirstCol = this._idToRange(curFilter.id);
                    var newFirstColCell = newFirstCol.c1;
                    if (type == "insRow") {
                        newFirstColCell = newFirstCol.r1;
                    }
                    if (newFirstColCell == col) {
                        for (var insCol = 1; insCol <= val; insCol++) {
                            var localChangeCol = this._idToRange(curFilter.id);
                            var localNextCol = this._idToRange(curFilter.idNext);
                            if (type == "insRow") {
                                localChangeCol.r1 = localChangeCol.r1 + insCol - 1;
                                localNextCol.r1 = localNextCol.r1 + insCol - 1;
                            } else {
                                localChangeCol.c1 = localChangeCol.c1 + insCol - 1;
                                localNextCol.c1 = localNextCol.c1 + insCol - 1;
                            }
                            var id = this._rangeToId(localChangeCol);
                            var nextId = this._rangeToId(localNextCol);
                            newResult[n] = new Result();
                            newResult[n].x = curFilter.x;
                            newResult[n].y = curFilter.y;
                            newResult[n].width = curFilter.width;
                            newResult[n].height = curFilter.height;
                            newResult[n].id = id;
                            newResult[n].idNext = nextId;
                            newResult[n].inFilter = inFilter;
                            if (isInsertIntoMergeCell) {
                                newResult[n].showButton = false;
                            }
                            newResult[n].hiddenRows = [];
                            n++;
                        }
                        if (val < 0) {
                            if (filterColums) {
                                for (var zF = filR; zF < filR + Math.abs(val); zF++) {
                                    for (var s = 0; s < cloneFilterColums.length; s++) {
                                        if (zF == cloneFilterColums[s].ColId) {
                                            History.TurnOn();
                                            this._openHiddenRowsColId(filter.Ref, s);
                                            History.TurnOff();
                                            cloneFilterColums.splice(s, 1);
                                        }
                                    }
                                }
                            }
                            filR = filR + Math.abs(val) - 1;
                        } else {
                            var newNextCol = this._idToRange(curFilter.idNext);
                            if (type == "insRow") {
                                newFirstCol.r1 = newFirstCol.r1 + val;
                                newNextCol.r1 = newNextCol.r1 + val;
                            } else {
                                newFirstCol.c1 = newFirstCol.c1 + val;
                                newNextCol.c1 = newNextCol.c1 + val;
                            }
                            var id = this._rangeToId(newFirstCol);
                            var nextId = this._rangeToId(newNextCol);
                            curFilter.inFilter = inFilter;
                            curFilter.id = id;
                            curFilter.idNext = nextId;
                            newResult[n] = curFilter;
                            if (filterColums) {
                                for (var s = 0; s < filterColums.length; s++) {
                                    if (filterColums[s].ColId == filR && filR > endCount) {
                                        cloneFilterColums[s].ColId = filR + val;
                                        endCount = filR + val;
                                        break;
                                    }
                                }
                            }
                            n++;
                        }
                    } else {
                        if (newFirstColCell < col) {
                            if (type == "insRow") {
                                var newNextCol = this._idToRange(curFilter.idNext);
                                newNextCol.r1 = newNextCol.r1 + val;
                                var nextId = this._rangeToId(newNextCol);
                                curFilter.idNext = nextId;
                            }
                            curFilter.inFilter = inFilter;
                            newResult[n] = curFilter;
                            var oldId = curFilter.id;
                            n++;
                        } else {
                            var newNextCol = this._idToRange(curFilter.idNext);
                            if (type == "insRow") {
                                newFirstCol.r1 = newFirstCol.r1 + val;
                                newNextCol.r1 = newNextCol.r1 + val;
                            } else {
                                newFirstCol.c1 = newFirstCol.c1 + val;
                                newNextCol.c1 = newNextCol.c1 + val;
                            }
                            var id = this._rangeToId(newFirstCol);
                            var nextId = this._rangeToId(newNextCol);
                            var oldId = curFilter.id;
                            curFilter.inFilter = inFilter;
                            curFilter.id = id;
                            curFilter.idNext = nextId;
                            newResult[n] = curFilter;
                            if (filterColums) {
                                for (var s = 0; s < filterColums.length; s++) {
                                    if (cloneFilterColums[s] && filterColums[s].ColId == filR && filR > endCount) {
                                        cloneFilterColums[s].ColId = filR + val;
                                        endCount = filR + val;
                                        break;
                                    }
                                }
                            }
                            n++;
                        }
                    }
                }
                if (cloneFilterColums) {
                    if (isInsertIntoMergeCell) {
                        var filterColumn;
                        for (var i = col; i < col + val; i++) {
                            filterColumn = new FilterColumn();
                            filterColumn.ColId = i - filter.Ref.c1;
                            filterColumn.ShowButton = false;
                            cloneFilterColums.push(filterColumn);
                        }
                    }
                    if (cRange.index == "all") {
                        filter.FilterColumns = cloneFilterColums;
                        filter.Ref = inFilter;
                    } else {
                        if (filter.AutoFilter) {
                            filter.AutoFilter.FilterColumns = cloneFilterColums;
                            filter.AutoFilter.Ref = inFilter;
                        }
                    }
                }
                if (filter.TableColumns && type != "insRow") {
                    var newTableColumn = [];
                    var startCell = col - inFilter.c1;
                    var isN = 0;
                    if (newResult.length < filter.TableColumns.length) {
                        filter.TableColumns.splice(startCell, filter.TableColumns.length - newResult.length);
                    } else {
                        for (var l = 0; l < newResult.length; l++) {
                            if (startCell == l) {
                                for (var s = 0; s < val; s++) {
                                    var range2 = this._idToRange(newResult[0].id);
                                    if (s != 0) {
                                        l = l + 1;
                                    }
                                    var tempArray = newTableColumn.concat(filter.TableColumns);
                                    var newNameColumn = this._generateColumnName(tempArray, startCell - 1);
                                    newTableColumn[l] = new TableColumn();
                                    newTableColumn[l].Name = newNameColumn;
                                    ws.model.getCell3(range2.r1, range2.c1 + l).setValue(newNameColumn);
                                }
                            } else {
                                var columnValue = filter.TableColumns[isN].Name;
                                newTableColumn[l] = new TableColumn();
                                newTableColumn[l].Name = columnValue;
                                isN++;
                            }
                        }
                        filter.TableColumns = newTableColumn;
                    }
                }
                filter.result = newResult;
                filter.Ref = inFilter;
                return filter;
            }
        },
        _bCheckChangeFilter: function (type, insertType, activeCells, ref) {
            var result = false;
            if (insertType == c_oAscDeleteOptions.DeleteColumns || insertType == c_oAscDeleteOptions.DeleteRows) {
                result = true;
            } else {
                if (type == "insCol" && (insertType == c_oAscDeleteOptions.DeleteCellsAndShiftLeft || insertType == c_oAscDeleteOptions.DeleteCellsAndShiftTop) && activeCells.r1 <= ref.r1 && activeCells.r2 >= ref.r2) {
                    result = true;
                } else {
                    if (type == "insRow" && (insertType == c_oAscDeleteOptions.DeleteCellsAndShiftLeft || insertType == c_oAscDeleteOptions.DeleteCellsAndShiftTop) && activeCells.c1 <= ref.c1 && activeCells.c2 >= ref.c2) {
                        result = true;
                    } else {
                        if (insertType == undefined) {
                            result = true;
                        }
                    }
                }
            }
            return result;
        },
        _changeContentButton: function (array, val, type, inFilter, oldId) {
            var ws = this.worksheet;
            var buttons = this.allButtonAF;
            if (type == "add") {
                if (array.showButton === false) {
                    return;
                }
                for (var j = 0; j < val; j++) {
                    if (val != 1) {
                        var newFirstCol = this._idToRange(array.id);
                        var newNextCol = this._idToRange(array.idNext);
                        if (type == "insRow") {
                            newFirstCol.r1 = newFirstCol.r1 + j;
                            newNextCol.r1 = newNextCol.r1 + j;
                        } else {
                            newFirstCol.c1 = newFirstCol.c1 + j;
                            newNextCol.c1 = newNextCol.c1 + j;
                        }
                        var id = this._rangeToId(newFirstCol);
                        var nextId = this._rangeToId(newNextCol);
                        array.inFilter = filter.Ref;
                        array.id = id;
                        array.idNext = nextId;
                        array.hiddenRows = [];
                    }
                    buttons[buttons.length] = array;
                }
            } else {
                if (type == "del") {
                    for (var j = 0; j < val; j++) {
                        var newFirstCol = this._idToRange(array.id);
                        if (type == "insRow") {
                            newFirstCol.r1 = newFirstCol.c1 + j;
                        } else {
                            newFirstCol.c1 = newFirstCol.c1 + j;
                        }
                        var id = this._rangeToId(newFirstCol);
                        for (var but = 0; but < buttons.length; but++) {
                            if (id == buttons[but].id) {
                                var cells = this._idToRange(buttons[but].id);
                                var indexFilter = this._findArrayFromAllFilter3(cells, buttons[but].id);
                                if (indexFilter) {
                                    var result = this._getArrayOpenCells(indexFilter, buttons[but].id);
                                    for (var rez = 0; rez < result.length; rez++) {
                                        if (result[rez].visible == false && ws.model.getRowHidden(rez + cells.r1 + 1)) {
                                            ws.model.setRowHidden(false, rez + cells.r1 + 1, rez + cells.r1 + 1);
                                        }
                                    }
                                }
                                buttons.splice(but, 1);
                                break;
                            }
                        }
                    }
                } else {
                    if (type == "change") {
                        var isChange = false;
                        for (var j = 0; j < buttons.length; j++) {
                            if (oldId == buttons[j].id) {
                                buttons[j] = array;
                                isChange = true;
                            }
                        }
                    }
                }
            }
        },
        _reDrawFilters: function (exceptionRange) {
            var aWs = this._getCurrentWS();
            if (aWs.TableParts && aWs.TableParts.length > 0) {
                for (var tP = 0; tP < aWs.TableParts.length; tP++) {
                    var ref = aWs.TableParts[tP].Ref;
                    if (exceptionRange && !exceptionRange.isEqual(ref) && ((ref.r1 >= exceptionRange.r1 && ref.r1 <= exceptionRange.r2) || (ref.r2 >= exceptionRange.r1 && ref.r2 <= exceptionRange.r2))) {
                        this._setColorStyleTable(ref, aWs.TableParts[tP]);
                    } else {
                        if (!exceptionRange) {
                            this._setColorStyleTable(ref, aWs.TableParts[tP]);
                        }
                    }
                }
            }
        },
        _sortArrayMinMax: function (elements) {
            elements.sort(function sortArr(a, b) {
                return a.val2 - b.val2;
            });
            return elements;
        },
        _crossRange: function (sRange, bRange) {
            var isIn = false;
            var isOut = false;
            for (var c = sRange.c1; c <= sRange.c2; c++) {
                for (var r = sRange.r1; r <= sRange.r2; r++) {
                    if (r >= bRange.r1 && r <= bRange.r2 && c >= bRange.c1 && c <= bRange.c2) {
                        isIn = true;
                    } else {
                        isOut = true;
                    }
                }
            }
            if (isIn && isOut) {
                return true;
            }
            return false;
        },
        _drawSmallIconTable: function (canvas, style, fmgrGraphics, oFont) {
            var ws = this.worksheet;
            var ctx = new Asc.DrawingContext({
                canvas: canvas,
                units: 1,
                fmgrGraphics: fmgrGraphics,
                font: oFont
            });
            if (style == undefined) {
                style = "TableStyleLight1";
            }
            var styleOptions;
            if (typeof style == "object") {
                styleOptions = style;
            } else {
                styleOptions = ws.model.workbook.TableStyles.AllStyles[style];
            }
            var styleInfo = false;
            var tableParts = undefined;
            if (ws && tableParts) {
                styleInfo = {
                    ShowColumnStripes: tableParts.TableStyleInfo.ShowColumnStripes,
                    ShowFirstColumn: tableParts.TableStyleInfo.ShowFirstColumn,
                    ShowLastColumn: tableParts.TableStyleInfo.ShowLastColumn,
                    ShowRowStripes: tableParts.TableStyleInfo.ShowRowStripes,
                    TotalsRowCount: tableParts.TotalsRowCount
                };
            }
            if (!styleInfo) {
                styleInfo = {
                    ShowColumnStripes: false,
                    ShowFirstColumn: false,
                    ShowLastColumn: false,
                    ShowRowStripes: true,
                    TotalsRowCount: 0
                };
            }
            var pxToMM = 72 / 96;
            var ySize = 45 * pxToMM;
            var xSize = 61 * pxToMM;
            var stepY = (ySize) / 5;
            var stepX = (60 * pxToMM) / 5;
            var whiteColor = new CColor(255, 255, 255);
            var blackColor = new CColor(0, 0, 0);
            var defaultColorBackground;
            if (styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill) {
                defaultColorBackground = styleOptions.wholeTable.dxf.fill.bg;
            } else {
                defaultColorBackground = whiteColor;
            }
            if (styleOptions != undefined) {
                if (styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill && null != styleOptions.wholeTable.dxf.fill.bg) {
                    ctx.setFillStyle(styleOptions.wholeTable.dxf.fill.bg);
                    ctx.fillRect(0, 0, xSize, ySize);
                } else {
                    ctx.setFillStyle(whiteColor);
                    ctx.fillRect(0, 0, xSize, ySize);
                }
                if (styleInfo.ShowColumnStripes) {
                    for (k = 0; k < 6; k++) {
                        var color = defaultColorBackground;
                        if ((k) % 2 == 0) {
                            if (styleOptions.firstColumnStripe && styleOptions.firstColumnStripe.dxf.fill && null != styleOptions.firstColumnStripe.dxf.fill.bg) {
                                color = styleOptions.firstColumnStripe.dxf.fill.bg;
                            } else {
                                if (styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill && null != styleOptions.wholeTable.dxf.fill.bg) {
                                    color = styleOptions.wholeTable.dxf.fill.bg;
                                }
                            }
                        } else {
                            if (styleOptions.secondColumnStripe && styleOptions.secondColumnStripe.dxf.fill && null != styleOptions.secondColumnStripe.dxf.fill.bg) {
                                color = styleOptions.secondColumnStripe.dxf.fill.bg;
                            } else {
                                if (styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill && null != styleOptions.wholeTable.dxf.fill.bg) {
                                    color = styleOptions.wholeTable.dxf.fill.bg;
                                }
                            }
                        }
                        ctx.setFillStyle(color);
                        ctx.fillRect(k * stepX, 0, stepX, ySize);
                    }
                }
                if (styleInfo.ShowRowStripes) {
                    for (k = 0; k < 6; k++) {
                        var color = null;
                        if (styleOptions) {
                            if (k == 0) {
                                k++;
                            }
                            if ((k) % 2 != 0) {
                                if (styleOptions.firstRowStripe && styleOptions.firstRowStripe.dxf.fill && null != styleOptions.firstRowStripe.dxf.fill.bg) {
                                    color = styleOptions.firstRowStripe.dxf.fill.bg;
                                }
                            } else {
                                if (styleOptions.secondRowStripe && styleOptions.secondRowStripe.dxf.fill && null != styleOptions.secondRowStripe.dxf.fill.bg) {
                                    color = styleOptions.secondRowStripe.dxf.fill.bg;
                                } else {
                                    if (styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill && null != styleOptions.wholeTable.dxf.fill.bg) {
                                        color = styleOptions.wholeTable.dxf.fill.bg;
                                    }
                                }
                            }
                            if (color != null) {
                                ctx.setFillStyle(color);
                                if (k == 1) {
                                    ctx.fillRect(0, k * stepY, xSize, stepY);
                                } else {
                                    if (k == 3) {
                                        ctx.fillRect(0, k * stepY, xSize, stepY);
                                    } else {
                                        ctx.fillRect(0, k * stepY, xSize, stepY);
                                    }
                                }
                            }
                        } else {
                            var color = null;
                            if ((k + 1) % 2 != 0) {
                                if (styleOptions.firstRowStripe && styleOptions.firstRowStripe.dxf.fill && null != styleOptions.firstRowStripe.dxf.fill.bg) {
                                    color = styleOptions.firstRowStripe.dxf.fill.bg;
                                }
                            } else {
                                if (styleOptions.secondRowStripe && styleOptions.secondRowStripe.dxf.fill && null != styleOptions.secondRowStripe.dxf.fill.bg) {
                                    color = styleOptions.secondRowStripe.dxf.fill.bg;
                                } else {
                                    if (styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill && null != styleOptions.wholeTable.dxf.fill.bg) {
                                        color = styleOptions.wholeTable.dxf.fill.bg;
                                    }
                                }
                            }
                            if (color != null) {
                                ctx.setFillStyle(color);
                                ctx.fillRect(0, k * stepY, xSize, stepY);
                            }
                        }
                    }
                }
                if (styleInfo.ShowFirstColumn && styleOptions.firstColumn) {
                    if (styleOptions.firstColumn && styleOptions.firstColumn.dxf.fill && null != styleOptions.firstColumn.dxf.fill.bg) {
                        ctx.setFillStyle(styleOptions.firstColumn.dxf.fill.bg);
                    } else {
                        ctx.setFillStyle(defaultColorBackground);
                    }
                    ctx.fillRect(0, 0, stepX, ySize);
                }
                if (styleInfo.ShowLastColumn) {
                    var color = null;
                    if (styleOptions.lastColumn && styleOptions.lastColumn.dxf.fill && null != styleOptions.lastColumn.dxf.fill.bg) {
                        color = styleOptions.lastColumn.dxf.fill.bg;
                    }
                    if (color != null) {
                        ctx.setFillStyle(color);
                        ctx.fillRect(4 * stepX, 0, stepX, ySize);
                    }
                }
                if (styleOptions) {
                    if (styleOptions.headerRow && styleOptions.headerRow.dxf.fill && null != styleOptions.headerRow.dxf.fill.bg) {
                        ctx.setFillStyle(styleOptions.headerRow.dxf.fill.bg);
                    } else {
                        ctx.setFillStyle(defaultColorBackground);
                    }
                    ctx.fillRect(0, 0, xSize, stepY);
                }
                if (styleInfo.TotalsRowCount) {
                    var color = null;
                    if (styleOptions.totalRow && styleOptions.totalRow.dxf.fill && null != styleOptions.totalRow.dxf.fill.bg) {
                        color = styleOptions.totalRow.dxf.fill.bg;
                    } else {
                        color = defaultColorBackground;
                    }
                    ctx.setFillStyle(color);
                    ctx.fillRect(0, stepY * 4, xSize, stepY);
                }
                if (styleOptions.firstHeaderCell && styleInfo.ShowFirstColumn) {
                    if (styleOptions.firstHeaderCell && styleOptions.firstHeaderCell.dxf.fill && null != styleOptions.firstHeaderCell.dxf.fill.bg) {
                        ctx.setFillStyle(styleOptions.firstHeaderCell.dxf.fill.bg);
                    } else {
                        ctx.setFillStyle(defaultColorBackground);
                    }
                    ctx.fillRect(0, 0, stepX, stepY);
                }
                if (styleOptions.lastHeaderCell && styleInfo.ShowLastColumn) {
                    if (styleOptions.lastHeaderCell && styleOptions.lastHeaderCell.dxf.fill && null != styleOptions.lastHeaderCell.dxf.fill.bg) {
                        ctx.setFillStyle(styleOptions.lastHeaderCell.dxf.fill.bg);
                    } else {
                        ctx.setFillStyle(defaultColorBackground);
                    }
                    ctx.fillRect(4 * stepX, 0, stepX, stepY);
                }
                if (styleOptions.firstTotalCell && styleInfo.TotalsRowCount && styleInfo.ShowFirstColumn) {
                    if (styleOptions.firstTotalCell && styleOptions.firstTotalCell.dxf.fill && null != styleOptions.firstTotalCell.dxf.fill.bg) {
                        ctx.setFillStyle(styleOptions.firstTotalCell.dxf.fill.bg);
                    } else {
                        ctx.setFillStyle(defaultColorBackground);
                    }
                    ctx.fillRect(0, 4 * stepY, stepX, stepY);
                }
                if (styleOptions.lastTotalCell && styleInfo.TotalsRowCount && styleInfo.ShowLastColumn) {
                    if (styleOptions.lastTotalCell && styleOptions.lastTotalCell.dxf.fill && null != styleOptions.lastTotalCell.dxf.fill.bg) {
                        ctx.setFillStyle(styleOptions.lastTotalCell.dxf.fill.bg);
                    } else {
                        ctx.setFillStyle(defaultColorBackground);
                    }
                    ctx.fillRect(4 * stepX, 4 * stepY, stepX, ySize);
                }
            } else {
                ctx.setFillStyle(whiteColor);
                ctx.fillRect(0, 0, xSize, ySize);
            }
            if (styleOptions != undefined) {
                ctx.setLineWidth(1);
                ctx.beginPath();
                if (styleOptions.wholeTable && styleOptions.wholeTable.dxf.border) {
                    var borders = styleOptions.wholeTable.dxf.border;
                    if (borders.t.s !== c_oAscBorderStyles.None) {
                        ctx.setStrokeStyle(borders.t.c);
                        ctx.lineHor(0, 0, xSize);
                    }
                    if (borders.b.s !== c_oAscBorderStyles.None) {
                        ctx.setStrokeStyle(borders.b.c);
                        ctx.lineHor(0, ySize, xSize);
                    }
                    if (borders.l.s !== c_oAscBorderStyles.None) {
                        ctx.setStrokeStyle(borders.l.c);
                        ctx.lineVer(0, 0, ySize);
                    }
                    if (borders.r.s !== c_oAscBorderStyles.None) {
                        ctx.setStrokeStyle(borders.r.c);
                        ctx.lineVer(xSize - 1, 0, ySize);
                    }
                    if (borders.ih.s !== c_oAscBorderStyles.None) {
                        ctx.setStrokeStyle(borders.ih.c);
                        for (var n = 1; n < 5; n++) {
                            ctx.lineHor(0, stepY * n, xSize);
                        }
                        ctx.stroke();
                    }
                    if (borders.iv.s !== c_oAscBorderStyles.None) {
                        ctx.setStrokeStyle(borders.iv.c);
                        for (var n = 1; n < 5; n++) {
                            ctx.lineVer(stepX * n, 0, ySize);
                        }
                        ctx.stroke();
                    }
                }
                if (styleInfo.ShowRowStripes) {
                    var border;
                    if (styleOptions.firstRowStripe && styleOptions.firstRowStripe.dxf.border) {
                        border = styleOptions.firstRowStripe.dxf.border;
                    } else {
                        if (styleOptions.secondRowStripe && styleOptions.secondRowStripe.dxf.border) {
                            border = styleOptions.secondRowStripe.dxf.border;
                        }
                    }
                    if (border) {
                        for (n = 1; n < 5; n++) {
                            ctx.lineHor(0, stepY * n, xSize);
                        }
                        ctx.stroke();
                    }
                }
                if (styleOptions.totalRow && styleInfo.TotalsRowCount && styleOptions.totalRow.dxf.border) {
                    var border = styleOptions.totalRow.dxf.border;
                    if (border.t.s !== c_oAscBorderStyles.None) {
                        ctx.setStrokeStyle(border.t.c);
                        ctx.lineVer(0, xSize, ySize);
                    }
                }
                if (styleOptions.headerRow && styleOptions.headerRow.dxf.border) {
                    var border = styleOptions.headerRow.dxf.border;
                    if (border.t.s !== c_oAscBorderStyles.None) {
                        ctx.setStrokeStyle(border.t.c);
                        ctx.lineHor(0, 0, xSize);
                    }
                    if (border.b.s !== c_oAscBorderStyles.None) {
                        ctx.setStrokeStyle(border.b.c);
                        ctx.lineHor(0, stepY, xSize);
                    }
                    ctx.stroke();
                }
                ctx.closePath();
            }
            var defaultColor;
            if (!styleOptions || !styleOptions.wholeTable || !styleOptions.wholeTable.dxf.font) {
                defaultColor = blackColor;
            } else {
                defaultColor = styleOptions.wholeTable.dxf.font.c;
            }
            for (var n = 1; n < 6; n++) {
                ctx.beginPath();
                var color = null;
                if (n == 1 && styleOptions && styleOptions.headerRow && styleOptions.headerRow.dxf.font) {
                    color = styleOptions.headerRow.dxf.font.c;
                } else {
                    if (n == 5 && styleOptions && styleOptions.totalRow && styleOptions.totalRow.dxf.font) {
                        color = styleOptions.totalRow.dxf.font.c;
                    } else {
                        if (styleOptions && styleOptions.headerRow && styleInfo.ShowRowStripes) {
                            if ((n == 2 || (n == 5 && !styleOptions.totalRow)) && styleOptions.firstRowStripe && styleOptions.firstRowStripe.dxf.font) {
                                color = styleOptions.firstRowStripe.dxf.font.c;
                            } else {
                                if (n == 3 && styleOptions.secondRowStripe && styleOptions.secondRowStripe.dxf.font) {
                                    color = styleOptions.secondRowStripe.dxf.font.c;
                                } else {
                                    color = defaultColor;
                                }
                            }
                        } else {
                            if (styleOptions && !styleOptions.headerRow && styleInfo.ShowRowStripes) {
                                if ((n == 1 || n == 3 || (n == 5 && !styleOptions.totalRow)) && styleOptions.firstRowStripe && styleOptions.firstRowStripe.dxf.font) {
                                    color = styleOptions.firstRowStripe.dxf.font.c;
                                } else {
                                    if ((n == 2 || n == 4) && styleOptions.secondRowStripe && styleOptions.secondRowStripe.dxf.font) {
                                        color = styleOptions.secondRowStripe.dxf.font.c;
                                    } else {
                                        color = defaultColor;
                                    }
                                }
                            } else {
                                color = defaultColor;
                            }
                        }
                    }
                }
                ctx.setStrokeStyle(color);
                var k = 0;
                var strY = n * stepY - stepY / 2;
                while (k < 6) {
                    ctx.lineHor(k * stepX + 3 * pxToMM, strY, (k + 1) * stepX - 2 * pxToMM);
                    k++;
                }
                ctx.stroke();
                ctx.closePath();
            }
            return canvas.toDataURL("image/png");
        },
        _dataFilterParse: function (data, val) {
            var curData = NumFormat.prototype.parseDate(val);
            var result = false;
            switch (data.DateTimeGrouping) {
            case 1:
                if (data.Year == curData.year && data.Month == curData.month + 1 && data.Day == curData.d) {
                    result = true;
                }
                break;
            case 2:
                if (data.Year == curData.year && data.Month == curData.month + 1 && data.Day == curData.d && data.Hour == curData.hour + 1) {
                    result = true;
                }
                break;
            case 3:
                if (data.Year == curData.year && data.Month == curData.month + 1 && data.Day == curData.d && data.Hour == curData.hour + 1 && data.Minute == curData.min + 1) {
                    result = true;
                }
                break;
            case 4:
                if (data.Year == curData.year && data.Month == curData.month + 1) {
                    result = true;
                }
                break;
            case 5:
                if (data.Year == curData.year && data.Month == curData.month + 1 && data.Day == curData.d && data.Hour == curData.hour + 1 && data.Minute == curData.min + 1 && data.Second == curData.sec + 1) {
                    result = true;
                }
                break;
            case 6:
                if (data.Year == curData.year) {
                    result = true;
                }
                break;
            }
            return result;
        },
        _addHistoryObj: function (oldObj, type, redoObject, deleteFilterAfterDeleteColRow, activeHistoryRange, bWithoutFilter) {
            var ws = this.worksheet;
            var oHistoryObject = new UndoRedoData_AutoFilter();
            oHistoryObject.undo = oldObj;
            if (redoObject) {
                oHistoryObject.activeCells = redoObject.activeCells.clone();
                oHistoryObject.lTable = redoObject.lTable;
                oHistoryObject.type = redoObject.type;
                oHistoryObject.cellId = redoObject.cellId;
                oHistoryObject.autoFiltersObject = redoObject.autoFiltersObject;
                oHistoryObject.addFormatTableOptionsObj = redoObject.addFormatTableOptionsObj;
                oHistoryObject.moveFrom = redoObject.arnFrom;
                oHistoryObject.moveTo = redoObject.arnTo;
                oHistoryObject.bWithoutFilter = bWithoutFilter ? bWithoutFilter : false;
            } else {
                oHistoryObject.activeCells = ws.activeRange.clone();
                type = null;
            }
            if (!activeHistoryRange) {
                activeHistoryRange = null;
            }
            History.Add(g_oUndoRedoAutoFilters, type, ws.model.getId(), activeHistoryRange, oHistoryObject);
            if (deleteFilterAfterDeleteColRow) {
                History.ChangeActionsEndToStart();
            }
        },
        _addHistoryTempObj: function (oldObj, type, redoObject, deleteFilterAfterDeleteColRow, activeHistoryRange, bWithoutFilter, isNotEmpty) {
            if (!isNotEmpty) {
                if (!this.historyTempObj.emptyPoints) {
                    this.historyTempObj.emptyPoints = [];
                }
                this.historyTempObj.emptyPoints[this.historyTempObj.emptyPoints.length] = [oldObj, type, redoObject, deleteFilterAfterDeleteColRow, activeHistoryRange, bWithoutFilter, isNotEmpty];
            } else {
                if (!this.historyTempObj.changePoints) {
                    this.historyTempObj.changePoints = [];
                }
                this.historyTempObj.changePoints[this.historyTempObj.changePoints.length] = [oldObj, type, redoObject, deleteFilterAfterDeleteColRow, activeHistoryRange, bWithoutFilter, isNotEmpty];
            }
        },
        _isAddNameColumn: function (range) {
            var result = false;
            var ws = this.worksheet;
            if (range.r1 != range.r2) {
                for (var col = range.c1; col <= range.c2; col++) {
                    var valFirst = ws.model.getCell3(range.r1, col);
                    if (valFirst != "") {
                        for (var row = range.r1; row <= range.r1 + 2; row++) {
                            var cell = ws.model.getCell3(row, col);
                            var type = cell.getType();
                            if (type == CellValueType.String) {
                                result = true;
                                break;
                            }
                        }
                    }
                }
            }
            return result;
        },
        _reDrawCurrentFilter: function (fColumns, result, tableParts) {
            var ws = this.worksheet;
            var aWs = this._getCurrentWS();
            if (result && result[0]) {
                var startRow = this._idToRange(result[0].id).r1;
                var endRow = this._idToRange(result[0].idNext).r1;
                for (var row = startRow; row <= endRow; row++) {
                    if (ws.model.getRowHidden(row)) {
                        ws.model.setRowHidden(false, row, row);
                    }
                }
            }
            if (fColumns) {
                for (var i = 0; i < fColumns.length; i++) {
                    var index = fColumns[i].ColId;
                    if (result[index].showButton == false) {
                        for (var i = index; i < result.length; i++) {
                            if (result[i].showButton != false) {
                                break;
                            }
                        }
                        index = i;
                    }
                    if (result[index] && result[index].hiddenRows && result[index].hiddenRows.length != 0) {
                        var arrHiddens = result[index].hiddenRows;
                        for (var row = 0; row < arrHiddens.length; row++) {
                            if (arrHiddens[row] != undefined && arrHiddens[row] == true && !ws.model.getRowHidden(row)) {
                                ws.model.setRowHidden(true, row, row);
                            }
                        }
                    }
                }
            }
            if (tableParts) {
                var ref = tableParts.Ref;
                this._cleanStyleTable(aWs, ref);
                this._setColorStyleTable(ref, tableParts);
            }
        },
        _getAscRange: function (bbox, rowAdd) {
            if (!rowAdd) {
                rowAdd = 0;
            }
            return Asc.Range(bbox.c1, bbox.r1, bbox.c2, bbox.r2 + rowAdd);
        },
        _generateColumnName: function (tableColumns, indexInsertColumn) {
            var index = 1;
            var isSequence = false;
            if (indexInsertColumn != undefined) {
                if (indexInsertColumn < 0) {
                    indexInsertColumn = 0;
                }
                var nameStart;
                var nameEnd;
                if (tableColumns[indexInsertColumn] && tableColumns[indexInsertColumn].Name) {
                    nameStart = tableColumns[indexInsertColumn].Name.split("Column");
                }
                if (tableColumns[indexInsertColumn + 1] && tableColumns[indexInsertColumn + 1].Name) {
                    nameEnd = tableColumns[indexInsertColumn + 1].Name.split("Column");
                }
                if (nameStart && nameStart[1] && nameEnd && nameEnd[1] && !isNaN(parseInt(nameStart[1])) && !isNaN(parseInt(nameEnd[1])) && ((parseInt(nameStart[1]) + 1) == parseInt(nameEnd[1]))) {
                    isSequence = true;
                }
            }
            if (indexInsertColumn == undefined || !isSequence) {
                var name;
                for (var i = 0; i < tableColumns.length; i++) {
                    if (tableColumns[i].Name) {
                        name = tableColumns[i].Name.split("Column");
                    }
                    if (name && name[1] && !isNaN(parseFloat(name[1])) && index == parseFloat(name[1])) {
                        index++;
                        i = -1;
                    }
                }
                return "Column" + index;
            } else {
                var name;
                if (tableColumns[indexInsertColumn] && tableColumns[indexInsertColumn].Name) {
                    name = tableColumns[indexInsertColumn].Name.split("Column");
                }
                if (name && name[1] && !isNaN(parseFloat(name[1]))) {
                    index = parseFloat(name[1]) + 1;
                }
                for (var i = 0; i < tableColumns.length; i++) {
                    if (tableColumns[i].Name) {
                        name = tableColumns[i].Name.split("Column");
                    }
                    if (name && name[1] && !isNaN(parseFloat(name[1])) && index == parseFloat(name[1])) {
                        index = parseInt((index - 1) + "2");
                        i = -1;
                    }
                }
                return "Column" + index;
            }
        },
        _generateColumnNameWithoutTitle: function (range) {
            var ws = this.worksheet;
            var newTableColumn;
            var tableColumns = [];
            var cell;
            var val;
            for (var col1 = range.c1; col1 <= range.c2; col1++) {
                cell = ws.model.getCell3(range.r1, col1);
                val = cell.getValue();
                if (val == "") {
                    val = this._generateColumnName(tableColumns);
                }
                var index = 2;
                var valNew = val;
                for (var s = 0; s < tableColumns.length; s++) {
                    if (valNew == tableColumns[s].Name) {
                        valNew = val + index;
                        index++;
                        s = -1;
                    }
                }
                newTableColumn = new TableColumn();
                newTableColumn.Name = valNew;
                tableColumns[col1 - range.c1] = newTableColumn;
            }
            return tableColumns;
        },
        _generateColumnsName: function (addNameColumn, tempCells, isTurnOffHistory) {
            var tableColumns = [],
            j = 0,
            ws = this.worksheet,
            cell,
            range,
            strNum;
            if (addNameColumn) {
                for (var col = tempCells.c1; col <= tempCells.c2; col++) {
                    cell = new CellAddress(tempCells.r1, col, 0);
                    range = ws.model.getCell(cell);
                    strNum = "Column" + (col - tempCells.c1 + 1).toString();
                    if (!isTurnOffHistory) {
                        range.setValue(strNum);
                    }
                    tableColumns[j] = new TableColumn();
                    tableColumns[j].Name = strNum;
                    j++;
                }
            } else {
                tableColumns = this._generateColumnNameWithoutTitle(tempCells);
            }
            return tableColumns;
        },
        _getResultAddFilter: function (paramsForCallBackAdd, activeCells, mainAdjacentCells, lTable) {
            var result = [],
            isEndRowEmpty,
            ws = this.worksheet,
            idCell,
            idCellNext;
            if (paramsForCallBackAdd == "addTableFilterOneCell" || paramsForCallBackAdd == "addAutoFilterOneCell") {
                if (paramsForCallBackAdd == "addAutoFilterOneCell" && this._isEmptyRange(activeCells, true)) {
                    ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterDataRangeError, c_oAscError.Level.NoCritical);
                    return false;
                }
                isEndRowEmpty = true;
                for (var col = mainAdjacentCells.c1; col <= mainAdjacentCells.c2; col++) {
                    if (isEndRowEmpty && ws.model.getCell3(mainAdjacentCells.r2, col).getValue() != "") {
                        isEndRowEmpty = false;
                    }
                }
                if (isEndRowEmpty && !lTable && mainAdjacentCells.r1 != mainAdjacentCells.r2) {
                    mainAdjacentCells.r2 = mainAdjacentCells.r2 - 1;
                }
                if (mainAdjacentCells) {
                    var n = 0;
                    for (var col = mainAdjacentCells.c1; col <= mainAdjacentCells.c2; col++) {
                        idCell = new CellAddress(mainAdjacentCells.r1, col, 0);
                        idCellNext = new CellAddress(mainAdjacentCells.r2, col, 0);
                        result[n] = new Result();
                        result[n].x = ws.cols[col] ? ws.cols[col].left : null;
                        result[n].y = ws.rows[mainAdjacentCells.r1] ? ws.rows[mainAdjacentCells.r1].top : null;
                        result[n].width = ws.cols[col] ? ws.cols[col].width : null;
                        result[n].height = ws.rows[mainAdjacentCells.r1] ? ws.rows[mainAdjacentCells.r1].height : null;
                        result[n].id = idCell.getID();
                        result[n].idNext = idCellNext.getID();
                        n++;
                    }
                } else {
                    if (val != "" && !mainAdjacentCells && !lTable) {
                        idCell = new CellAddress(activeCells.r1, activeCells.c1, 0);
                        idCellNext = new CellAddress(activeCells.r2, activeCells.c2, 0);
                        result[0] = new Result();
                        result[0].x = ws.cols[activeCells.c1] ? ws.cols[activeCells.c1].left : null;
                        result[0].y = ws.rows[activeCells.r1] ? ws.rows[activeCells.r1].top : null;
                        result[0].width = ws.cols[activeCells.c1] ? ws.cols[activeCells.c1].width : null;
                        result[0].height = ws.rows[activeCells.r1] ? ws.rows[activeCells.r1].height : null;
                        result[0].id = idCell.getID();
                        result[0].idNext = idCellNext.getID();
                    } else {
                        if (val == "" && !mainAdjacentCells || (lTable && !mainAdjacentCells)) {
                            if (lTable) {
                                idCell = new CellAddress(activeCells.r1, activeCells.c1, 0);
                                idCellNext = new CellAddress(activeCells.r2 + 1, activeCells.c2, 0);
                                result[0] = new Result();
                                result[0].x = ws.cols[activeCells.c1] ? ws.cols[activeCells.c1].left : null;
                                result[0].y = ws.rows[activeCells.r1] ? ws.rows[activeCells.r1].top : null;
                                result[0].width = ws.cols[activeCells.c1] ? ws.cols[activeCells.c1].width : null;
                                result[0].height = ws.rows[activeCells.r1] ? ws.rows[activeCells.r1].height : null;
                                result[0].id = idCell.getID();
                                result[0].idNext = idCellNext.getID();
                            } else {
                                ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterDataRangeError, c_oAscError.Level.NoCritical);
                                return false;
                            }
                        }
                    }
                }
                if (mainAdjacentCells) {
                    activeCells = mainAdjacentCells;
                }
            } else {
                if (paramsForCallBackAdd == "addTableFilterManyCells" || paramsForCallBackAdd == "addAutoFilterManyCells") {
                    if (paramsForCallBackAdd == "addAutoFilterManyCells" && this._isEmptyRange(activeCells)) {
                        ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterDataRangeError, c_oAscError.Level.NoCritical);
                        return false;
                    }
                    var n = 0;
                    for (var col = activeCells.c1; col <= activeCells.c2; col++) {
                        idCell = new CellAddress(activeCells.r1, col, 0);
                        idCellNext = new CellAddress(activeCells.r2, col, 0);
                        result[n] = new Result();
                        result[n].x = ws.cols[col] ? ws.cols[col].left : null;
                        result[n].y = ws.rows[activeCells.r1] ? ws.rows[activeCells.r1].top : null;
                        result[n].width = ws.cols[col] ? ws.cols[col].width : null;
                        result[n].height = ws.rows[activeCells.r1] ? ws.rows[activeCells.r1].height : null;
                        result[n].id = idCell.getID();
                        result[n].idNext = idCellNext.getID();
                        n++;
                    }
                }
            }
            return {
                result: result,
                mainAdjacentCells: mainAdjacentCells,
                activeCells: activeCells
            };
        },
        _renameTableColumn: function (range) {
            var ws = this.worksheet;
            var aWs = this._getCurrentWS();
            var val;
            var cell;
            var generateName;
            if (aWs.TableParts) {
                for (var i = 0; i < aWs.TableParts.length; i++) {
                    var filter = aWs.TableParts[i];
                    var ref = filter.Ref;
                    var tableRange = new Asc.Range(ref.c1, ref.r1, ref.c2, ref.r1);
                    var intersection = range.intersection(tableRange);
                    if (intersection != null) {
                        for (var j = tableRange.c1; j <= tableRange.c2; j++) {
                            cell = ws.model.getCell3(ref.r1, j);
                            val = cell.getValue();
                            if (val != "" && intersection.c1 <= j && intersection.c2 >= j) {
                                filter.TableColumns[j - tableRange.c1].Name = val;
                                cell.setType(CellValueType.String);
                            } else {
                                if (val == "") {
                                    filter.TableColumns[j - tableRange.c1].Name = "";
                                    generateName = this._generateColumnName(filter.TableColumns);
                                    cell.setValue(generateName);
                                    cell.setType(CellValueType.String);
                                    filter.TableColumns[j - tableRange.c1].Name = generateName;
                                }
                            }
                        }
                    }
                }
            }
        },
        _moveAutoFilters: function (arnTo, arnFrom, data, copyRange) {
            var ws = this.worksheet;
            var aWs = this._getCurrentWS();
            var isUpdate;
            if (arnTo == null && arnFrom == null && data) {
                arnTo = data.moveFrom ? data.moveFrom : null;
                arnFrom = data.moveTo ? data.moveTo : null;
                data = data.undo;
                if (arnTo == null || arnFrom == null) {
                    return;
                }
            }
            var addRedo = false;
            if (copyRange) {
                this._cloneCtrlAutoFilters(arnTo, arnFrom);
            } else {
                var findFilters = this._searchFiltersInRange(arnFrom, aWs);
                if (findFilters) {
                    var diffCol = arnTo.c1 - arnFrom.c1;
                    var diffRow = arnTo.r1 - arnFrom.r1;
                    var ref;
                    var range;
                    var newRange;
                    var oCurFilter;
                    for (var i = 0; i < findFilters.length; i++) {
                        if (!oCurFilter) {
                            oCurFilter = [];
                        }
                        oCurFilter[i] = findFilters[i].clone(aWs);
                        ref = findFilters[i].Ref;
                        range = ref;
                        newRange = Asc.Range(range.c1 + diffCol, range.r1 + diffRow, range.c2 + diffCol, range.r2 + diffRow);
                        findFilters[i].Ref = newRange;
                        if (findFilters[i].AutoFilter) {
                            findFilters[i].AutoFilter.Ref = newRange;
                        }
                        isUpdate = false;
                        if ((findFilters[i].AutoFilter && findFilters[i].AutoFilter.FilterColumns && findFilters[i].AutoFilter.FilterColumns.length) || (findFilters[i].FilterColumns && findFilters[i].FilterColumns.length)) {
                            aWs.setRowHidden(false, ref.r1, ref.r2);
                            isUpdate = true;
                        }
                        if (!data && findFilters[i].AutoFilter && findFilters[i].AutoFilter.FilterColumns) {
                            findFilters[i].AutoFilter.FilterColumns = null;
                        } else {
                            if (!data && findFilters[i] && findFilters[i].FilterColumns) {
                                findFilters[i].FilterColumns = null;
                            } else {
                                if (data && data[i] && data[i].AutoFilter && data[i].AutoFilter.FilterColumns) {
                                    findFilters[i].AutoFilter.FilterColumns = data[i].AutoFilter.FilterColumns;
                                } else {
                                    if (data && data[i] && data[i].FilterColumns) {
                                        findFilters[i].FilterColumns = data[i].FilterColumns;
                                    }
                                }
                            }
                        }
                        var changeButtonArray = [];
                        var k = 0;
                        if (this.allButtonAF) {
                            var buttons = this.allButtonAF;
                            for (var n = 0; n < buttons.length; n++) {
                                var id;
                                var idNext;
                                if (buttons[n].inFilter.isEqual(ref) && findFilters[i] && findFilters[i].result && findFilters[i].result.length) {
                                    for (var b = 0; b < findFilters[i].result.length; b++) {
                                        if (buttons[n].id == findFilters[i].result[b].id) {
                                            id = this._shiftId(buttons[n].id, diffCol, diffRow);
                                            idNext = this._shiftId(buttons[n].idNext, diffCol, diffRow);
                                            break;
                                        }
                                    }
                                    changeButtonArray[n] = {
                                        inFilter: newRange,
                                        id: id ? id : this._shiftId(buttons[n].id, diffCol, diffRow),
                                        idNext: idNext ? idNext : this._shiftId(buttons[n].idNext, diffCol, diffRow)
                                    };
                                    k++;
                                    if (findFilters[i].result.length == k) {
                                        break;
                                    }
                                }
                            }
                        }
                        for (var b = 0; b < findFilters[i].result.length; b++) {
                            id = this._shiftId(findFilters[i].result[b].id, diffCol, diffRow);
                            idNext = this._shiftId(findFilters[i].result[b].idNext, diffCol, diffRow);
                            findFilters[i].result[b].id = id;
                            findFilters[i].result[b].idNext = idNext;
                        }
                        for (var b in changeButtonArray) {
                            if (buttons && buttons[b]) {
                                buttons[b].inFilter = changeButtonArray[b].inFilter;
                                buttons[b].id = changeButtonArray[b].id;
                                buttons[b].idNext = changeButtonArray[b].idNext;
                            }
                        }
                        if (oCurFilter[i].TableStyleInfo && oCurFilter[i] && findFilters[i]) {
                            this._cleanStyleTable(aWs, oCurFilter[i].Ref);
                            this._setColorStyleTable(findFilters[i].Ref, findFilters[i]);
                        }
                        if (!addRedo && !data) {
                            this._addHistoryObj(oCurFilter, historyitem_AutoFilter_Move, {
                                worksheet: ws,
                                arnTo: arnTo,
                                arnFrom: arnFrom,
                                activeCells: ws.activeRange
                            });
                            addRedo = true;
                        } else {
                            if (!data && addRedo) {
                                this._addHistoryObj(oCurFilter, historyitem_AutoFilter_Move);
                            }
                        }
                        if (isUpdate) {
                            ws._onUpdateFormatTable(range, null, true);
                        }
                    }
                }
            }
            var arnToRange = new Asc.Range(arnTo.c1, arnTo.r1, arnTo.c2, arnTo.r2);
            var intersectionRangeWithTableParts = this._intersectionRangeWithTableParts(arnToRange, aWs);
            if (intersectionRangeWithTableParts && intersectionRangeWithTableParts.length) {
                var tablePart;
                for (var i = 0; i < intersectionRangeWithTableParts.length; i++) {
                    tablePart = intersectionRangeWithTableParts[i];
                    this._setColorStyleTable(tablePart.Ref, tablePart);
                    ws.model.getRange3(tablePart.Ref.r1, tablePart.Ref.c1, tablePart.Ref.r2, tablePart.Ref.c2).unmerge();
                }
            }
        },
        _cloneCtrlAutoFilters: function (arnTo, arnFrom) {
            var ws = this.worksheet;
            var aWs = this._getCurrentWS();
            var findFilters = this._searchFiltersInRange(arnFrom, aWs);
            if (findFilters && findFilters.length) {
                var diffCol = arnTo.c1 - arnFrom.c1;
                var diffRow = arnTo.r1 - arnFrom.r1;
                var newRange, ref, bWithoutFilter;
                for (var i = 0; i < findFilters.length; i++) {
                    if (findFilters[i].TableStyleInfo) {
                        ref = findFilters[i].Ref;
                        newRange = Asc.Range(ref.c1 + diffCol, ref.r1 + diffRow, ref.c2 + diffCol, ref.r2 + diffRow);
                        bWithoutFilter = findFilters[i].AutoFilter === null ? true : false;
                        if (!ref.intersection(newRange) && !this._intersectionRangeWithTableParts(newRange, aWs, arnFrom)) {
                            this.addAutoFilter(findFilters[i].TableStyleInfo.Name, newRange, null, null, true, bWithoutFilter);
                        }
                    }
                }
            }
        },
        _isShowButton: function (autoFilter, colId) {
            var result = true;
            var filterColumns = (autoFilter && autoFilter.FilterColumns) ? autoFilter.FilterColumns : null;
            if (autoFilter == null || filterColumns == null) {
                return null;
            }
            if (filterColumns && filterColumns.length != 0) {
                for (var i = 0; i < filterColumns.length; i++) {
                    if (colId == filterColumns[i].ColId && !filterColumns[i].ShowButton) {
                        result = false;
                    }
                }
            }
            return result;
        },
        _isSpecValueCustomFilter: function (autoFiltersOptions) {
            var filters = [autoFiltersOptions.filter1, autoFiltersOptions.filter2];
            var valFilters = [autoFiltersOptions.valFilter1, autoFiltersOptions.valFilter2];
            var filterVal;
            var filter;
            for (var fil = 0; fil < filters.length; fil++) {
                filterVal = valFilters[fil];
                filter = filters[fil];
                if (filterVal && (filterVal.indexOf("?") != -1 || filterVal.indexOf("*") != -1)) {
                    var position = this._getPositionSpecSymbols(filterVal);
                    if (position == "start") {
                        if (filter == 6 || filter == 8 || filter == 10 || filter == 12) {
                            filter = 8;
                        } else {
                            filter = 7;
                        }
                        if (fil == 0) {
                            autoFiltersOptions.filterDisableSpecSymbols1 = true;
                        } else {
                            autoFiltersOptions.filterDisableSpecSymbols2 = true;
                        }
                    } else {
                        if (position == "end") {
                            if (filter == 6 || filter == 8 || filter == 10 || filter == 12) {
                                filter = 10;
                            } else {
                                filter = 9;
                            }
                            if (fil == 0) {
                                autoFiltersOptions.filterDisableSpecSymbols1 = true;
                            } else {
                                autoFiltersOptions.filterDisableSpecSymbols2 = true;
                            }
                        } else {
                            if (position == "center") {
                                if (filter == 6 || filter == 8 || filter == 10 || filter == 12) {
                                    filter = 12;
                                } else {
                                    filter = 11;
                                }
                                if (fil == 0) {
                                    autoFiltersOptions.filterDisableSpecSymbols1 = true;
                                } else {
                                    autoFiltersOptions.filterDisableSpecSymbols2 = true;
                                }
                            } else {}
                        }
                    }
                    if (fil == 0) {
                        autoFiltersOptions.filter1 = filter;
                    } else {
                        autoFiltersOptions.filter2 = filter;
                    }
                }
            }
        },
        _getPositionSpecSymbols: function (filterVal) {
            var position = null;
            var firstLetter;
            var firstSpecSymbol;
            var endLetter;
            var endSpecSymbol;
            for (var i = 0; i < filterVal.length; i++) {
                if ((filterVal[i] == "*" || filterVal[i] == "?") && firstSpecSymbol == undefined) {
                    firstSpecSymbol = i;
                } else {
                    if (firstLetter == undefined && filterVal[i] != "*" && filterVal[i] != "?") {
                        firstLetter = i;
                    }
                }
                if (filterVal[i] == "*" || filterVal[i] == "?") {
                    endSpecSymbol = i;
                } else {
                    endLetter = i;
                }
            }
            var centerSpecSymbols = false;
            for (var i = firstLetter; i <= endLetter; i++) {
                if (filterVal[i] == "*" || filterVal[i] == "?") {
                    centerSpecSymbols = true;
                }
            }
            if (!centerSpecSymbols && firstSpecSymbol == 0 && endLetter > endSpecSymbol && endSpecSymbol != filterVal.length - 1) {
                position = "start";
            } else {
                if (!centerSpecSymbols && endSpecSymbol == filterVal.length - 1 && firstSpecSymbol != 0) {
                    position = "end";
                } else {
                    if (!centerSpecSymbols && endSpecSymbol == filterVal.length - 1 && firstSpecSymbol == 0) {
                        position = "center";
                    }
                }
            }
            return position;
        },
        _parseComplexSpecSymbols: function (val, filter, filterVal, type) {
            var result = null;
            if (filterVal != undefined && filter != undefined && (filterVal.indexOf("?") != -1 || filterVal.indexOf("*") != -1)) {
                var isEqual = false;
                var isStartWithVal = false;
                var isConsist = false;
                var isEndWith = false;
                var endBlockEqual = false;
                var endSpecSymbol;
                var isConsistBlock;
                result = false;
                if (type == 1) {
                    var splitFilterVal = filterVal.split("*");
                    var positionPrevBlock = 0;
                    var firstEnter = false;
                    isConsist = true;
                    isStartWithVal = false;
                    isEqual = false;
                    isEndWith = false;
                    for (var i = 0; i < splitFilterVal.length; i++) {
                        if (splitFilterVal[i] != "") {
                            if (splitFilterVal[i].indexOf("?") == -1) {
                                firstEnter = true;
                                endSpecSymbol = false;
                                isConsistBlock = val.indexOf(splitFilterVal[i], positionPrevBlock);
                                if (isConsistBlock == 0) {
                                    isStartWithVal = true;
                                }
                                if (isConsistBlock == -1 || positionPrevBlock > isConsistBlock) {
                                    isConsist = false;
                                    break;
                                } else {
                                    positionPrevBlock = isConsistBlock + splitFilterVal[i].length;
                                    if (i == (splitFilterVal.length - 1)) {
                                        endBlockEqual = true;
                                    }
                                }
                            } else {
                                if (splitFilterVal[i].length != 1) {
                                    firstEnter = true;
                                    endSpecSymbol = false;
                                    var splitQuestion = splitFilterVal[i].split("?");
                                    var startText = 0;
                                    if (i == 0) {
                                        for (var k = 0; k < splitQuestion.length; k++) {
                                            if (splitQuestion[k] != "") {
                                                startText = k;
                                                break;
                                            }
                                        }
                                    }
                                    var tempPosition;
                                    for (var k = 0; k < splitQuestion.length; k++) {
                                        if (splitQuestion[k] == "") {
                                            tempPosition++;
                                        } else {
                                            tempPosition = val.indexOf(splitQuestion[k], positionPrevBlock);
                                        }
                                        if (tempPosition == startText) {
                                            isStartWithVal = true;
                                        }
                                        if (tempPosition != -1) {
                                            positionPrevBlock += splitQuestion[k].length;
                                            tempPosition += splitQuestion[k].length;
                                            if (i == (splitFilterVal.length - 1) && k == (splitQuestion.length - 1) && (tempPosition == (val.length))) {
                                                endBlockEqual = true;
                                            }
                                        } else {
                                            isConsist = false;
                                            break;
                                        }
                                    }
                                } else {
                                    if (!firstEnter) {
                                        isStartWithVal = true;
                                    } else {
                                        endSpecSymbol = true;
                                    }
                                }
                            }
                        } else {
                            if (!firstEnter) {
                                isStartWithVal = true;
                            } else {
                                endSpecSymbol = true;
                            }
                        }
                    }
                    if (isConsist && (positionPrevBlock == val.length || endSpecSymbol || endBlockEqual)) {
                        isEndWith = true;
                    }
                    if (isStartWithVal && isConsist) {
                        isStartWithVal = true;
                    } else {
                        isStartWithVal = false;
                    }
                    if (isConsist && isStartWithVal && isEndWith) {
                        isEqual = true;
                    }
                    if (val.length == 1) {
                        isEndWith = true;
                        isStartWithVal = true;
                        isEqual = true;
                        isConsist = true;
                    }
                }
                switch (filter) {
                case 1:
                    if (isEqual) {
                        result = true;
                    }
                    break;
                case 2:
                    if (type == 1 && !isEqual) {
                        result = true;
                    } else {
                        if (val > filterVal && !isEqual) {
                            result = true;
                        }
                    }
                    break;
                case 3:
                    if (val > filterVal || isEqual || type == 1) {
                        result = true;
                    }
                    break;
                case 4:
                    if (type == 1 && !isEqual) {
                        result = false;
                    } else {
                        if (val < filterVal && !isEqual) {
                            result = true;
                        }
                    }
                    break;
                case 5:
                    if ((val < filterVal && type != 1) || isEqual) {
                        result = true;
                    }
                    break;
                case 6:
                    if (!isEqual) {
                        result = true;
                    }
                    break;
                case 7:
                    if (isStartWithVal) {
                        result = true;
                    }
                    break;
                case 8:
                    if (!isStartWithVal) {
                        result = true;
                    }
                    break;
                case 9:
                    if (isEndWith) {
                        result = true;
                    }
                    break;
                case 10:
                    if (!isEndWith) {
                        result = true;
                    }
                    break;
                case 11:
                    if (isConsist) {
                        result = true;
                    }
                    break;
                case 12:
                    if (!isConsist) {
                        result = true;
                    }
                    break;
                }
                return result;
            }
        },
        _searchFiltersInRange: function (range, aWs) {
            var result = [];
            var rangeFilter;
            if (aWs.AutoFilter) {
                rangeFilter = aWs.AutoFilter.Ref;
                if (range.c1 <= rangeFilter.c1 && range.r1 <= rangeFilter.r1 && range.c2 >= rangeFilter.c2 && range.r2 >= rangeFilter.r2) {
                    result[result.length] = aWs.AutoFilter;
                }
            }
            if (aWs.TableParts) {
                for (var k = 0; k < aWs.TableParts.length; k++) {
                    if (aWs.TableParts[k]) {
                        rangeFilter = aWs.TableParts[k].Ref;
                        if (range.c1 <= rangeFilter.c1 && range.r1 <= rangeFilter.r1 && range.c2 >= rangeFilter.c2 && range.r2 >= rangeFilter.r2) {
                            result[result.length] = aWs.TableParts[k];
                        }
                    }
                }
            }
            if (!result.length) {
                result = false;
            }
            return result;
        },
        _intersectionRangeWithTableParts: function (range, aWs, exceptionRange) {
            var result = [];
            var rangeFilter;
            if (aWs.TableParts) {
                for (var k = 0; k < aWs.TableParts.length; k++) {
                    if (aWs.TableParts[k]) {
                        rangeFilter = aWs.TableParts[k].Ref;
                        if (range.intersection(rangeFilter) && !(range.containsRange(rangeFilter) && !(range.r1 === rangeFilter.r1 && range.c1 === rangeFilter.c1))) {
                            if (!exceptionRange || !(exceptionRange && exceptionRange.containsRange(rangeFilter))) {
                                result[result.length] = aWs.TableParts[k];
                            }
                        }
                    }
                }
            }
            if (!result.length) {
                result = false;
            }
            return result;
        },
        _shiftId: function (id, colShift, rowShift) {
            var result = false;
            if (id) {
                var range = this._idToRange(id);
                range.r1 = range.r1 + rowShift;
                range.c1 = range.c1 + colShift;
                result = this._rangeToId(range);
            }
            return result;
        },
        _preMoveAutoFilters: function (arnFrom, arnTo) {
            var aWs = this._getCurrentWS();
            var diffCol = arnTo.c1 - arnFrom.c1;
            var diffRow = arnTo.r1 - arnFrom.r1;
            var findFilters = this._searchFiltersInRange(arnFrom, aWs);
            if (findFilters) {
                for (var i = 0; i < findFilters.length; i++) {
                    var ref = findFilters[i].Ref;
                    var newRange = Asc.Range(ref.c1 + diffCol, ref.r1 + diffRow, ref.c2 + diffCol, ref.r2 + diffRow);
                    if (aWs.AutoFilter && aWs.AutoFilter.Ref && newRange.intersection(aWs.AutoFilter.Ref) && aWs.AutoFilter !== findFilters[i]) {
                        this._deleteAutoFilter();
                    }
                    var findFiltersFromTo = this._intersectionRangeWithTableParts(newRange, aWs, arnFrom);
                    if (findFiltersFromTo && findFiltersFromTo.length) {
                        this.isEmptyAutoFilters(ref);
                        continue;
                    }
                    this._openHiddenRows(findFilters[i]);
                }
            }
            var findFiltersTo = this._searchFiltersInRange(arnTo, aWs);
            if (arnTo && findFiltersTo) {
                for (var i = 0; i < findFiltersTo.length; i++) {
                    var ref = findFiltersTo[i].Ref;
                    if (arnTo.r1 === ref.r1 && arnTo.c1 === ref.c1) {
                        continue;
                    } else {
                        this.isEmptyAutoFilters(ref, null, null, null, findFilters);
                    }
                }
            }
        },
        _openHiddenRows: function (filter) {
            var ws = this.worksheet;
            if (filter && this.allButtonAF) {
                var buttons = this.allButtonAF;
                for (var n = 0; n < buttons.length; n++) {
                    if (((filter.AutoFilter && buttons[n].inFilter == filter.AutoFilter.Ref) || buttons[n].inFilter == filter.Ref) && buttons[n].hiddenRows && buttons[n].hiddenRows.length) {
                        var arrHiddens = buttons[n].hiddenRows;
                        for (var row = 0; row < arrHiddens.length; row++) {
                            if (arrHiddens[row] != undefined && arrHiddens[row] == true) {
                                ws.model.setRowHidden(false, row, row);
                            }
                        }
                    }
                }
            }
        },
        _openHiddenRowsColId: function (refFilter, ColId) {
            var ws = this.worksheet;
            if (refFilter && this.allButtonAF) {
                var buttons = this.allButtonAF;
                for (var n = 0; n < buttons.length; n++) {
                    var rangeButton = this._idToRange(buttons[n].id);
                    if ((buttons[n].inFilter.isEqual(refFilter)) && rangeButton.c1 === (ColId + refFilter.c1) && buttons[n].hiddenRows && buttons[n].hiddenRows.length) {
                        var arrHiddens = buttons[n].hiddenRows;
                        for (var row = 0; row < arrHiddens.length; row++) {
                            if (this._isHiddenAnotherFilter2(buttons[n].id, row, refFilter) !== "hidden" && arrHiddens[row] != undefined && arrHiddens[row] == true) {
                                ws.model.setRowHidden(false, row, row);
                            }
                        }
                    }
                }
            }
        },
        _isEmptyRange: function (activeCells, isAllAutoFilter) {
            var aWs = this._getCurrentWS();
            var ws = this.worksheet;
            var cell;
            if (isAllAutoFilter && activeCells.r1 == activeCells.r2 && activeCells.c1 == activeCells.c2) {
                for (var n = activeCells.r1 - 1; n <= activeCells.r2 + 1; n++) {
                    if (n < 0) {
                        n = 0;
                    }
                    for (var k = activeCells.c1 - 1; k <= activeCells.c2 + 1; k++) {
                        if (k < 0) {
                            k = 0;
                        }
                        cell = ws.model.getRange3(n, k, n, k);
                        if (cell.getValueWithoutFormat() != "" && this._intersectionRangeWithTableParts(cell.bbox, aWs) === false) {
                            return false;
                        }
                    }
                }
            } else {
                for (var n = activeCells.r1; n <= activeCells.r2; n++) {
                    for (var k = activeCells.c1; k <= activeCells.c2; k++) {
                        cell = ws.model.getRange3(n, k, n, k);
                        if (cell.getValueWithoutFormat() != "") {
                            return false;
                        }
                    }
                }
            }
            return true;
        },
        _isNeedDrawButton: function (button, range) {
            var buttonRange = this._idToRange(button.id);
            return range.contains(buttonRange.c1, buttonRange.r1);
        },
        _clearFormatTableStyle: function (range) {
            if (range && typeof range == "object") {
                var ws = this.worksheet;
                for (var i = range.r1; i <= range.r2; i++) {
                    for (var n = range.c1; n <= range.c2; n++) {
                        var cell = ws.model.getRange3(i, n, i, n);
                        cell.setTableStyle(null);
                    }
                }
            }
        },
        _showButtonFlag: function (result) {
            if (!result) {
                return;
            }
            for (var i = 0; i < result.length; i++) {
                if (result[i].showButton === false) {
                    result[i].showButton = true;
                }
            }
        },
        _checkShowButtonsFlag: function (autoFilter) {
            var button;
            var result = autoFilter.result;
            if (!result) {
                return;
            }
            for (var i = 0; i < this.allButtonAF.length; i++) {
                button = this.allButtonAF[i];
                for (var n = 0; n < result.length; n++) {
                    if (button && button.id == result[n].id && result[n].showButton === false) {
                        this.allButtonAF.splice(i, 1);
                        i--;
                    }
                }
            }
        },
        _cleanFilterColumnsAndSortState: function (autoFilterElement, activeCells) {
            var ws = this.worksheet;
            var aWs = this._getCurrentWS();
            var oldFilter = autoFilterElement.clone(aWs);
            if (autoFilterElement.SortState) {
                autoFilterElement.SortState = null;
            }
            aWs.setRowHidden(false, autoFilterElement.Ref.r1, autoFilterElement.Ref.r2);
            if (autoFilterElement.AutoFilter && autoFilterElement.AutoFilter.FilterColumns) {
                autoFilterElement.AutoFilter.FilterColumns = null;
            } else {
                if (autoFilterElement.FilterColumns) {
                    autoFilterElement.FilterColumns = null;
                }
            }
            this._addHistoryObj(oldFilter, historyitem_AutoFilter_CleanAutoFilter, {
                activeCells: activeCells
            },
            null, activeCells);
            this._reDrawFilters();
            if (!aWs.workbook.bUndoChanges && !aWs.workbook.bRedoChanges) {
                ws._onUpdateFormatTable(oldFilter.Ref, false, true);
            }
        },
        _isFilterColumnsContainFilter: function (filterColumns) {
            if (!filterColumns || !filterColumns.length) {
                return false;
            }
            var filterColumn;
            for (var k = 0; k < filterColumns.length; k++) {
                filterColumn = filterColumns[k];
                if (filterColumn && (filterColumn.ColorFilter || filterColumn.ColorFilter || filterColumn.CustomFiltersObj || filterColumn.DynamicFilter || filterColumn.Filters || filterColumn.Top10)) {
                    return true;
                }
            }
        },
        _isAddCellsShiftBottom: function (tempCells) {
            var cell, isEmptyCell, result = true;
            var ws = this.worksheet;
            var aWs = this._getCurrentWS();
            for (var i = tempCells.c1; i <= tempCells.c2; i++) {
                cell = ws.model.getRange3(tempCells.r2 + 1, i, tempCells.r2 + 1, i);
                isEmptyCell = cell.isEmptyText();
                if (!isEmptyCell) {
                    break;
                }
            }
            if (isEmptyCell) {
                result = false;
            } else {
                if (aWs.TableParts && aWs.TableParts.length) {
                    for (var i = 0; i < aWs.TableParts.length; i++) {
                        if ((aWs.TableParts[i].Ref.c1 < tempCells.c1 || aWs.TableParts[i].Ref.c2 > tempCells.c2) && aWs.TableParts[i].Ref.r1 >= tempCells.r2) {
                            result = "error";
                            break;
                        }
                    }
                }
                if (aWs.AutoFilter && result !== "error") {
                    if ((aWs.AutoFilter.Ref.c1 < tempCells.c1 || aWs.AutoFilter.Ref.c2 > tempCells.c2) && aWs.AutoFilter.Ref.r1 >= tempCells.r2) {
                        result = "error";
                    }
                }
            }
            return result;
        },
        _updateButtonArray: function () {
            var aWs = this._getCurrentWS();
            this.allButtonAF = [];
            if (aWs.AutoFilter) {
                var n = 0;
                for (var i = 0; i < aWs.AutoFilter.result.length; i++) {
                    if (aWs.AutoFilter.result[i].showButton != false) {
                        this.allButtonAF[n] = aWs.AutoFilter.result[i].clone();
                        this.allButtonAF[n].inFilter = aWs.AutoFilter.Ref.clone();
                        n++;
                    }
                }
            }
            if (aWs.TableParts && aWs.TableParts.length) {
                for (var i = 0; i < aWs.TableParts.length; i++) {
                    if (aWs.TableParts[i] && aWs.TableParts[i].AutoFilter) {
                        var tablePart = aWs.TableParts[i];
                        var n = this.allButtonAF.length;
                        for (var j = 0; j < tablePart.result.length; j++) {
                            if (tablePart.result[j].showButton != false) {
                                this.allButtonAF[n] = tablePart.result[j].clone();
                                this.allButtonAF[n].inFilter = tablePart.Ref.clone();
                                n++;
                            }
                        }
                    }
                }
            }
        }
    };
    window["Asc"].AutoFilters = AutoFilters;
    window["Asc"]["AutoFiltersOptions"] = window["Asc"].AutoFiltersOptions = AutoFiltersOptions;
    prot = AutoFiltersOptions.prototype;
    prot["asc_setCellId"] = prot.asc_setCellId;
    prot["asc_setResult"] = prot.asc_setResult;
    prot["asc_setIsCustomFilter"] = prot.asc_setIsCustomFilter;
    prot["asc_setFilter1"] = prot.asc_setFilter1;
    prot["asc_setFilter2"] = prot.asc_setFilter2;
    prot["asc_setValFilter1"] = prot.asc_setValFilter1;
    prot["asc_setValFilter2"] = prot.asc_setValFilter2;
    prot["asc_setIsChecked"] = prot.asc_setIsChecked;
    prot["asc_setSortState"] = prot.asc_setSortState;
    prot["asc_setY"] = prot.asc_setY;
    prot["asc_setX"] = prot.asc_setX;
    prot["asc_setWidth"] = prot.asc_setWidth;
    prot["asc_setHeight"] = prot.asc_setHeight;
    prot["asc_getCellId"] = prot.asc_getCellId;
    prot["asc_getY"] = prot.asc_getY;
    prot["asc_getX"] = prot.asc_getX;
    prot["asc_getHeight"] = prot.asc_getHeight;
    prot["asc_getWidth"] = prot.asc_getWidth;
    prot["asc_getResult"] = prot.asc_getResult;
    prot["asc_getIsCustomFilter"] = prot.asc_getIsCustomFilter;
    prot["asc_getFilter1"] = prot.asc_getFilter1;
    prot["asc_getFilter2"] = prot.asc_getFilter2;
    prot["asc_getValFilter1"] = prot.asc_getValFilter1;
    prot["asc_getValFilter2"] = prot.asc_getValFilter2;
    prot["asc_getIsChecked"] = prot.asc_getIsChecked;
    prot["asc_getSortState"] = prot.asc_getSortState;
    window["Asc"]["AutoFiltersOptionsElements"] = window["Asc"].AutoFiltersOptionsElements = AutoFiltersOptionsElements;
    prot = AutoFiltersOptionsElements.prototype;
    prot["asc_getVal"] = prot.asc_getVal;
    prot["asc_getVisible"] = prot.asc_getVisible;
    prot["asc_setVal"] = prot.asc_setVal;
    prot["asc_setVisible"] = prot.asc_setVisible;
    window["Asc"]["AddFormatTableOptions"] = window["Asc"].AddFormatTableOptions = AddFormatTableOptions;
    prot = AddFormatTableOptions.prototype;
    prot["asc_getRange"] = prot.asc_getRange;
    prot["asc_getIsTitle"] = prot.asc_getIsTitle;
    prot["asc_setRange"] = prot.asc_setRange;
    prot["asc_setIsTitle"] = prot.asc_setIsTitle;
    window["Asc"]["formatTablePictures"] = window["Asc"].formatTablePictures = formatTablePictures;
    prot = formatTablePictures.prototype;
    prot["asc_getName"] = prot.asc_getName;
    prot["asc_getDisplayName"] = prot.asc_getDisplayName;
    prot["asc_getType"] = prot.asc_getType;
    prot["asc_getImage"] = prot.asc_getImage;
})(jQuery, window);