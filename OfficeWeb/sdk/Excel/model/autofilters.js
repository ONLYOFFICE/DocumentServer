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
 var gUndoInsDelCellsFlag = true;
(function ($, window, undefined) {
    var prot;
    var turnOnProcessingSpecSymbols = true;
    var startRedo = false;
    function AutoFiltersOptionsElements(val, visible) {
        if (! (this instanceof AutoFiltersOptionsElements)) {
            return new AutoFiltersOptionsElements(val, visible);
        }
        this.Properties = {
            val: 0,
            visible: 1
        };
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
    function AutoFiltersOptions() {
        if (! (this instanceof AutoFiltersOptions)) {
            return new AutoFiltersOptions();
        }
        this.Properties = {
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
    function AddFormatTableOptions() {
        if (! (this instanceof AddFormatTableOptions)) {
            return new AddFormatTableOptions();
        }
        this.Properties = {
            range: 0,
            isTitle: 1
        };
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
        if (! (this instanceof AutoFilters)) {
            return new AutoFilters();
        }
        this.worksheet = currentSheet;
        return this;
    }
    AutoFilters.prototype = {
        constructor: AutoFilters,
        applyAutoFilter: function (type, autoFiltersObject, ar) {
            History.Create_NewPoint();
            History.SetSelection(new Asc.Range(ar.c1, ar.r1, ar.c2, ar.r2));
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
        addAutoFilter: function (lTable, ar, openFilter, isTurnOffHistory, addFormatTableOptionsObj) {
            var ws = this.worksheet;
            var bIsActiveSheet = this._isActiveSheet();
            var bIsOpenFilter = undefined !== openFilter;
            var activeCells = Asc.clone(ar);
            var aWs = this._getCurrentWS();
            var paramsForCallBack;
            var paramsForCallBackAdd;
            var filterChange;
            if (openFilter != undefined) {
                History.TurnOff();
            }
            var t = this;
            var newRes;
            var rangeShift1;
            var rangeShift;
            var selectionTable;
            var result;
            var isInsertButton = true;
            var startCell;
            var endCell;
            var rangeFilter;
            var splitRange;
            if (!addFormatTableOptionsObj) {
                addNameColumn = true;
            } else {
                if (typeof addFormatTableOptionsObj == "object") {
                    ref = addFormatTableOptionsObj.asc_getRange();
                    addNameColumn = !addFormatTableOptionsObj.asc_getIsTitle();
                    var newRange = this._refToRange(ref);
                    if (newRange) {
                        activeCells = newRange;
                    }
                } else {
                    if (addFormatTableOptionsObj) {
                        addNameColumn = false;
                    }
                }
            }
            ws.expandColsOnScroll(true);
            ws.expandRowsOnScroll(true);
            var onAddAutoFiltersCallback = function (success) {
                if (success || isTurnOffHistory) {
                    if (isTurnOffHistory) {
                        History.TurnOff();
                    }
                    History.Create_NewPoint();
                    if (selectionTable) {
                        History.SetSelectionRedo(new Asc.Range(selectionTable.c1, selectionTable.r1, selectionTable.c2, selectionTable.r2));
                    }
                    History.SetSelection(new Asc.Range(ar.c1, ar.r1, ar.c2, ar.r2));
                    History.StartTransaction();
                    if (paramsForCallBack) {
                        switch (paramsForCallBack) {
                        case "changeStyle":
                            var cloneFilterOld = Asc.clone(filterChange);
                            filterChange.TableStyleInfo.Name = lTable;
                            splitRange = filterChange.Ref.split(":");
                            t._setColorStyleTable(splitRange[0], splitRange[1], filterChange);
                            startCell = t._idToRange(splitRange[0]);
                            endCell = t._idToRange(splitRange[1]);
                            rangeFilter = new Asc.Range(startCell.c1, startCell.r1, endCell.c1, endCell.r1);
                            if (bIsActiveSheet && !bIsOpenFilter) {
                                ws._updateCellsRange(rangeFilter, c_oAscCanChangeColWidth.none);
                            }
                            t._addHistoryObj(cloneFilterOld, historyitem_AutoFilter_Add, {
                                activeCells: activeCells,
                                lTable: lTable
                            });
                            History.EndTransaction();
                            if (isTurnOffHistory) {
                                History.TurnOn();
                            }
                            return true;
                            break;
                        case "deleteFilter":
                            var isReDrawFilter = false;
                            if (apocal.all) {
                                newRes = {
                                    result: allAutoFilters[apocal.num].result,
                                    isVis: false
                                };
                                result = newRes.result;
                                changesElemHistory = Asc.clone(aWs.AutoFilter);
                                delete aWs.AutoFilter;
                            } else {
                                if (aWs.AutoFilter) {
                                    newRes = {
                                        result: allAutoFilters[apocal.num - 1].result,
                                        isVis: false
                                    };
                                    changesElemHistory = Asc.clone(aWs.TableParts[apocal.num - 1]);
                                    delete aWs.TableParts[apocal.num - 1].AutoFilter;
                                    isReDrawFilter = Asc.clone(aWs.TableParts[apocal.num - 1]);
                                } else {
                                    newRes = {
                                        result: allAutoFilters[apocal.num].result,
                                        isVis: false
                                    };
                                    changesElemHistory = Asc.clone(aWs.TableParts[apocal.num]);
                                    delete aWs.TableParts[apocal.num].AutoFilter;
                                    isReDrawFilter = Asc.clone(aWs.TableParts[apocal.num]);
                                }
                            }
                            t._addHistoryObj(changesElemHistory, historyitem_AutoFilter_Add, {
                                activeCells: activeCells,
                                lTable: lTable
                            });
                            var isHidden;
                            var isInsert = false;
                            for (var i = apocal.range.r1; i <= apocal.range.r2; i++) {
                                isHidden = ws.model._getRow(i).hd;
                                if (isHidden) {
                                    ws.model.setRowHidden(false, i, i);
                                    isInsert = true;
                                }
                            }
                            if (bIsActiveSheet) {
                                t._addButtonAF(newRes, bIsOpenFilter);
                            }
                            if (isReDrawFilter && isReDrawFilter.TableColumns && isReDrawFilter.result) {
                                t._reDrawCurrentFilter(null, null, isReDrawFilter);
                            }
                            if (!apocal.changeAllFOnTable) {
                                if (isInsert && bIsActiveSheet && !bIsOpenFilter) {
                                    ws.isChanged = true;
                                    ws.changeWorksheet("update");
                                }
                                History.EndTransaction();
                                if (isTurnOffHistory) {
                                    History.TurnOn();
                                }
                                return true;
                            }
                            break;
                        case "changeAllFOnTable":
                            newRes = {
                                result: allAutoFilters[apocal.num].result,
                                isVis: false
                            };
                            changesElemHistory = Asc.clone(aWs.AutoFilter);
                            delete aWs.AutoFilter;
                            if (addNameColumn && rangeShift && !isTurnOffHistory) {
                                rangeShift.addCellsShiftBottom();
                                ws.cellCommentator.updateCommentsDependencies(true, 4, rangeShift.bbox);
                                ws.objectRender.updateDrawingObject(true, 4, rangeShift.bbox);
                            }
                            for (var col = activeCells.c1; col <= activeCells.c2; col++) {
                                var cell = new CellAddress(activeCells.r1, col, 0);
                                var strNum = null;
                                if (addNameColumn) {
                                    var range = ws.model.getCell(cell);
                                    strNum = "Column" + (col - activeCells.c1 + 1).toString();
                                    if (!isTurnOffHistory) {
                                        range.setValue(strNum);
                                    }
                                } else {
                                    var range = ws.model.getCell(cell);
                                    strNum = range.getValue();
                                }
                                tableColumns[j] = {
                                    Name: strNum
                                };
                                j++;
                            }
                            var cloneAC = Asc.clone(activeCells);
                            if (addNameColumn) {
                                activeCells.r2 = activeCells.r2 + 1;
                                cloneAC.r1 = cloneAC.r1 + 1;
                                cloneAC.r2 = cloneAC.r1;
                                cloneAC.c2 = cloneAC.c1;
                            }
                            var n = 0;
                            result = [];
                            for (col = activeCells.c1; col <= activeCells.c2; col++) {
                                var idCell = new CellAddress(activeCells.r1, col, 0);
                                var idCellNext = new CellAddress(activeCells.r2, col, 0);
                                result[n] = {
                                    x: ws.cols[col].left,
                                    y: ws.rows[activeCells.r1].top,
                                    width: ws.cols[col].width,
                                    height: ws.rows[activeCells.r1].height,
                                    id: idCell.getID(),
                                    idNext: idCellNext.getID()
                                };
                                n++;
                            }
                            if (openFilter == undefined) {
                                t._addNewFilter(result, tableColumns, aWs, isAll, lTable);
                            }
                            if (!isAll) {
                                t._setColorStyleTable(result[0].id, result[result.length - 1].idNext, aWs.TableParts[aWs.TableParts.length - 1], null, true);
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
                                    aWs.AutoFilter = {};
                                    aWs.AutoFilter.result = result;
                                    aWs.AutoFilter.Ref = result[0].id + ":" + result[result.length - 1].idNext;
                                }
                            }
                            newRes = {
                                result: result,
                                isVis: true
                            };
                            changesElemHistory.refTable = result[0].id + ":" + result[result.length - 1].idNext;
                            if (addNameColumn) {
                                changesElemHistory.addColumn = true;
                            }
                            t._addHistoryObj(changesElemHistory, historyitem_AutoFilter_Add, {
                                activeCells: cloneAC,
                                lTable: lTable,
                                addFormatTableOptionsObj: addFormatTableOptionsObj
                            });
                            if (isInsertButton) {
                                if (bIsActiveSheet) {
                                    t._addButtonAF(newRes, bIsOpenFilter);
                                }
                            } else {
                                if (!t.allButtonAF) {
                                    t.allButtonAF = [];
                                }
                            }
                            if (arn && bIsActiveSheet && !bIsOpenFilter) {
                                if (openFilter == undefined) {
                                    ws.isChanged = true;
                                    arn.c1 = arn.c1 - 1;
                                    arn.c2 = arn.c2 - 1;
                                    arn.r1 = arn.r1 - 1;
                                    arn.r2 = arn.r2 - 1;
                                    ws.setSelection(arn, true);
                                }
                                rangeFilter = new Asc.Range(activeCells.c1, activeCells.r1, activeCells.c2, activeCells.r2);
                                ws._updateCellsRange(rangeFilter, c_oAscCanChangeColWidth.none);
                            }
                            History.EndTransaction();
                            if (isTurnOffHistory) {
                                History.TurnOn();
                            }
                            return true;
                        case "changeStyleWithoutFilter":
                            changesElemHistory = Asc.clone(filterChange);
                            filterChange.TableStyleInfo.Name = lTable;
                            splitRange = filterChange.Ref.split(":");
                            t._setColorStyleTable(splitRange[0], splitRange[1], filterChange);
                            startCell = t._idToRange(splitRange[0]);
                            endCell = t._idToRange(splitRange[1]);
                            rangeFilter = new Asc.Range(startCell.c1, startCell.r1, endCell.c1, endCell.r1);
                            t._addHistoryObj(changesElemHistory, historyitem_AutoFilter_Add, {
                                activeCells: activeCells,
                                lTable: lTable
                            });
                            if (bIsActiveSheet && !bIsOpenFilter) {
                                ws._updateCellsRange(rangeFilter, c_oAscCanChangeColWidth.none);
                            }
                            History.EndTransaction();
                            if (isTurnOffHistory) {
                                History.TurnOn();
                            }
                            return true;
                            break;
                        case "setStyleTableForAutoFilter":
                            changesElemHistory = Asc.clone(allAutoFilters[apocal.num - 1]);
                            var ref = allAutoFilters[apocal.num - 1].Ref;
                            allAutoFilters[apocal.num - 1].AutoFilter = {
                                Ref: allAutoFilters[apocal.num - 1].Ref
                            };
                            break;
                        case "setStyleTableForAutoFilter1":
                            changesElemHistory = Asc.clone(allAutoFilters[apocal.num]);
                            var ref = allAutoFilters[apocal.num].Ref;
                            allAutoFilters[apocal.num].AutoFilter = {
                                Ref: allAutoFilters[apocal.num].Ref
                            };
                            break;
                        }
                        if (paramsForCallBack == "setStyleTableForAutoFilter1" || paramsForCallBack == "setStyleTableForAutoFilter") {
                            t._addHistoryObj(changesElemHistory, historyitem_AutoFilter_Add, {
                                activeCells: activeCells,
                                lTable: lTable
                            });
                            if (bIsActiveSheet) {
                                t._addButtonAF(newRes, bIsOpenFilter);
                            }
                            if (ref) {
                                splitRange = ref.split(":");
                                startCell = t._idToRange(splitRange[0]);
                                endCell = t._idToRange(splitRange[1]);
                                rangeFilter = new Asc.Range(startCell.c1, startCell.r1, endCell.c1, endCell.r1);
                            } else {
                                rangeFilter = ws.visibleRange;
                            }
                            if (arn && bIsActiveSheet && !bIsOpenFilter) {
                                ws._updateCellsRange(rangeFilter, c_oAscCanChangeColWidth.none);
                            }
                            History.EndTransaction();
                            if (isTurnOffHistory) {
                                History.TurnOn();
                            }
                            return true;
                        }
                    } else {
                        if (paramsForCallBackAdd) {
                            switch (paramsForCallBackAdd) {
                            case "addTableFilterOneCell":
                                if (!isTurnOffHistory && addNameColumn) {
                                    rangeShift.addCellsShiftBottom();
                                    ws.cellCommentator.updateCommentsDependencies(true, 4, rangeShift.bbox);
                                    ws.objectRender.updateDrawingObject(true, 4, rangeShift.bbox);
                                }
                                if (lTable) {
                                    if (addNameColumn && !isTurnOffHistory) {
                                        ws.model.getRange3(mainAdjacentCells.r1, mainAdjacentCells.c1, mainAdjacentCells.r2 + 1, mainAdjacentCells.c2).unmerge();
                                    } else {
                                        ws.model.getRange3(mainAdjacentCells.r1, mainAdjacentCells.c1, mainAdjacentCells.r2, mainAdjacentCells.c2).unmerge();
                                    }
                                }
                                if (addNameColumn) {
                                    for (col = mainAdjacentCells.c1; col <= mainAdjacentCells.c2; col++) {
                                        var cell = new CellAddress(mainAdjacentCells.r1, col, 0);
                                        var strNum = null;
                                        var range = ws.model.getCell(cell);
                                        var strNum = "Column" + (col - mainAdjacentCells.c1 + 1).toString();
                                        if (!isTurnOffHistory) {
                                            range.setValue(strNum);
                                        }
                                        tableColumns[j] = {
                                            Name: strNum
                                        };
                                        j++;
                                    }
                                } else {
                                    tableColumns = t._generateColumnNameWithoutTitle(mainAdjacentCells, isTurnOffHistory);
                                }
                                if (addNameColumn && !isTurnOffHistory) {
                                    mainAdjacentCells.r2 = mainAdjacentCells.r2 + 1;
                                }
                                break;
                            case "addTableFilterManyCells":
                                if (!isTurnOffHistory && addNameColumn) {
                                    rangeShift.addCellsShiftBottom();
                                    ws.cellCommentator.updateCommentsDependencies(true, 4, rangeShift.bbox);
                                    ws.objectRender.updateDrawingObject(true, 4, rangeShift.bbox);
                                }
                                if (lTable) {
                                    if (addNameColumn && !isTurnOffHistory) {
                                        ws.model.getRange3(activeCells.r1, activeCells.c1, activeCells.r2 + 1, activeCells.c2).unmerge();
                                    } else {
                                        ws.model.getRange3(activeCells.r1, activeCells.c1, activeCells.r2, activeCells.c2).unmerge();
                                    }
                                }
                                if (addNameColumn) {
                                    for (col = activeCells.c1; col <= activeCells.c2; col++) {
                                        var cell = new CellAddress(activeCells.r1, col, 0);
                                        var strNum = null;
                                        var range = ws.model.getCell(cell);
                                        var strNum = "Column" + (col - activeCells.c1 + 1).toString();
                                        if (!isTurnOffHistory) {
                                            range.setValue(strNum);
                                        }
                                        tableColumns[j] = {
                                            Name: strNum
                                        };
                                        j++;
                                    }
                                } else {
                                    tableColumns = t._generateColumnNameWithoutTitle(activeCells, isTurnOffHistory);
                                }
                                if (addNameColumn && !isTurnOffHistory) {
                                    activeCells.r2 = activeCells.r2 + 1;
                                }
                                break;
                            }
                            if (paramsForCallBackAdd == "addTableFilterOneCell" || paramsForCallBackAdd == "addAutoFilterOneCell") {
                                if (paramsForCallBackAdd == "addAutoFilterOneCell" && t._isEmptyRange(activeCells, true)) {
                                    ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterDataRangeError, c_oAscError.Level.NoCritical);
                                    return;
                                }
                                result = [];
                                var isEndRowEmpty = true;
                                for (col = mainAdjacentCells.c1; col <= mainAdjacentCells.c2; col++) {
                                    if (isEndRowEmpty && ws.model.getCell(new CellAddress(mainAdjacentCells.r2, col, 0)).getCells()[0].getValue() != "") {
                                        isEndRowEmpty = false;
                                    }
                                }
                                if (isEndRowEmpty && !lTable && mainAdjacentCells.r1 != mainAdjacentCells.r2) {
                                    mainAdjacentCells.r2 = mainAdjacentCells.r2 - 1;
                                }
                                if (mainAdjacentCells) {
                                    var curCell;
                                    var n = 0;
                                    for (col = mainAdjacentCells.c1; col <= mainAdjacentCells.c2; col++) {
                                        var idCell = new CellAddress(mainAdjacentCells.r1, col, 0);
                                        var idCellNext = new CellAddress(mainAdjacentCells.r2, col, 0);
                                        curCell = ws.model.getCell(idCell).getCells();
                                        result[n] = {
                                            x: ws.cols[col] ? ws.cols[col].left : null,
                                            y: ws.rows[mainAdjacentCells.r1] ? ws.rows[mainAdjacentCells.r1].top : null,
                                            width: ws.cols[col] ? ws.cols[col].width : null,
                                            height: ws.rows[mainAdjacentCells.r1] ? ws.rows[mainAdjacentCells.r1].height : null,
                                            id: idCell.getID(),
                                            idNext: idCellNext.getID()
                                        };
                                        n++;
                                    }
                                } else {
                                    if (val != "" && !mainAdjacentCells && !lTable) {
                                        var idCell = new CellAddress(activeCells.r1, activeCells.c1, 0);
                                        var idCellNext = new CellAddress(activeCells.r2, activeCells.c2, 0);
                                        result[0] = {
                                            x: ws.cols[activeCells.c1] ? ws.cols[activeCells.c1].left : null,
                                            y: ws.rows[activeCells.r1] ? ws.rows[activeCells.r1].top : null,
                                            width: ws.cols[activeCells.c1] ? ws.cols[activeCells.c1].width : null,
                                            height: ws.rows[activeCells.c1] ? ws.rows[activeCells.c1].height : null,
                                            id: idCell.getID(),
                                            idNext: idCellNext.getID()
                                        };
                                    } else {
                                        if (val == "" && !mainAdjacentCells || (lTable && !mainAdjacentCells)) {
                                            if (lTable) {
                                                var idCell = new CellAddress(activeCells.r1, activeCells.c1, 0);
                                                var idCellNext = new CellAddress(activeCells.r2 + 1, activeCells.c2, 0);
                                                result[0] = {
                                                    x: ws.cols[activeCells.c1] ? ws.cols[activeCells.c1].left : null,
                                                    y: ws.rows[activeCells.r1] ? ws.rows[activeCells.r1].top : null,
                                                    width: ws.cols[activeCells.c1] ? ws.cols[activeCells.c1].width : null,
                                                    height: ws.rows[activeCells.c1] ? ws.rows[activeCells.c1].height : null,
                                                    id: idCell.getID(),
                                                    idNext: idCellNext.getID()
                                                };
                                            } else {
                                                ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterDataRangeError, c_oAscError.Level.NoCritical);
                                                History.EndTransaction();
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
                                    if (paramsForCallBackAdd == "addAutoFilterManyCells" && t._isEmptyRange(activeCells)) {
                                        ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterDataRangeError, c_oAscError.Level.NoCritical);
                                        return;
                                    }
                                    var n = 0;
                                    result = [];
                                    for (col = activeCells.c1; col <= activeCells.c2; col++) {
                                        var idCell = new CellAddress(activeCells.r1, col, 0);
                                        var idCellNext = new CellAddress(activeCells.r2, col, 0);
                                        result[n] = {
                                            x: ws.cols[col] ? ws.cols[col].left : null,
                                            y: ws.rows[activeCells.r1] ? ws.rows[activeCells.r1].top : null,
                                            width: ws.cols[col] ? ws.cols[col].width : null,
                                            height: ws.rows[activeCells.r1] ? ws.rows[activeCells.r1].height : null,
                                            id: idCell.getID(),
                                            idNext: idCellNext.getID()
                                        };
                                        n++;
                                    }
                                }
                            }
                        }
                    }
                    if (openFilter == undefined) {
                        t._addNewFilter(result, tableColumns, aWs, isAll, lTable);
                    }
                    if (!isAll) {
                        t._setColorStyleTable(result[0].id, result[result.length - 1].idNext, aWs.TableParts[aWs.TableParts.length - 1], null, true);
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
                                aWs.AutoFilter = {};
                            }
                            aWs.AutoFilter.result = result;
                            aWs.AutoFilter.Ref = result[0].id + ":" + result[result.length - 1].idNext;
                        }
                    }
                    newRes = {
                        result: result,
                        isVis: true
                    };
                    var ref = {
                        Ref: result[0].id + ":" + result[result.length - 1].idNext
                    };
                    if (addNameColumn && addFormatTableOptionsObj) {
                        addFormatTableOptionsObj.range = ref;
                    }
                    t._addHistoryObj(ref, historyitem_AutoFilter_Add, {
                        activeCells: activeCells,
                        lTable: lTable,
                        addFormatTableOptionsObj: addFormatTableOptionsObj
                    });
                    if (isInsertButton) {
                        if (bIsActiveSheet) {
                            t._addButtonAF(newRes, bIsOpenFilter);
                        } else {
                            t._addButtonAF(newRes, true);
                        }
                    } else {
                        if (!t.allButtonAF) {
                            t.allButtonAF = [];
                        }
                    }
                    if (arn && bIsActiveSheet && !bIsOpenFilter) {
                        if (openFilter == undefined) {
                            ws.isChanged = true;
                            arn.c1 = arn.c1 - 1;
                            arn.c2 = arn.c2 - 1;
                            arn.r1 = arn.r1 - 1;
                            arn.r2 = arn.r2 - 1;
                            ws.setSelection(arn, true);
                        }
                        rangeFilter = new Asc.Range(arn.c1, arn.r1, arn.c2, arn.r2);
                        ws._updateCellsRange(rangeFilter, c_oAscCanChangeColWidth.none);
                    }
                    History.EndTransaction();
                    if (isTurnOffHistory) {
                        History.TurnOn();
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
                var apocal = this._searchFilters(activeCells, isAll, aWs);
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
                        rangeShift = ws.model.getRange(new CellAddress(filterChange.Ref.split(":")[0]), new CellAddress(filterChange.Ref.split(":")[1]));
                        paramsForCallBack = "changeStyle";
                        rangeShift1 = t._getAscRange(rangeShift.bbox);
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
                            rangeShift = ws.model.getRange(new CellAddress(currentFil.Ref.split(":")[0]), new CellAddress(currentFil.Ref.split(":")[1]));
                            if (apocal.changeAllFOnTable) {
                                var startCells = this._idToRange(currentFil.Ref.split(":")[0]);
                                var endCells = this._idToRange(currentFil.Ref.split(":")[1]);
                                activeCells = {
                                    r1: startCells.r1,
                                    r2: endCells.r1,
                                    c1: startCells.c1,
                                    c2: endCells.c1
                                };
                                var rowAdd = 0;
                                var tableColumns = [];
                                var j = 0;
                                rangeShift = ws.model.getRange(new CellAddress(activeCells.r1, activeCells.c1, 0), new CellAddress(activeCells.r1, activeCells.c2, 0));
                                if (addNameColumn) {
                                    rowAdd = 1;
                                }
                                paramsForCallBack = "changeAllFOnTable";
                                rangeShift1 = t._getAscRange(activeCells, rowAdd);
                                selectionTable = Asc.clone(rangeShift1);
                            } else {
                                paramsForCallBack = "deleteFilter";
                                rangeShift1 = t._getAscRange(rangeShift.bbox);
                            }
                            if (isTurnOffHistory) {
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
                                    rangeShift = ws.model.getRange(new CellAddress(filterChange.Ref.split(":")[0]), new CellAddress(filterChange.Ref.split(":")[1]));
                                    paramsForCallBack = "changeStyleWithoutFilter";
                                    rangeShift1 = t._getAscRange(rangeShift.bbox);
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
                                        rangeShift = ws.model.getRange(new CellAddress(ourFilter.Ref.split(":")[0]), new CellAddress(ourFilter.Ref.split(":")[1]));
                                        paramsForCallBack = "setStyleTableForAutoFilter";
                                        rangeShift1 = t._getAscRange(rangeShift.bbox);
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
                                        rangeShift = ws.model.getRange(new CellAddress(ourFilter.Ref.split(":")[0]), new CellAddress(ourFilter.Ref.split(":")[1]));
                                        paramsForCallBack = "setStyleTableForAutoFilter1";
                                        rangeShift1 = t._getAscRange(rangeShift.bbox);
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
            if (openFilter != undefined) {
                if (openFilter == "all") {
                    if (aWs.AutoFilter.Ref == "" || !aWs.AutoFilter.Ref) {
                        return;
                    }
                    var allFil = aWs.AutoFilter.Ref.split(":");
                    var sCell = ws.model.getCell(new CellAddress(allFil[0]));
                    var eCell = ws.model.getCell(new CellAddress(allFil[1]));
                    var n = 0;
                    result = [];
                    var startCol = sCell.first.col - 1;
                    var endCol = eCell.first.col - 1;
                    if (ws.cols.length < eCell.first.col) {
                        ws.expandColsOnScroll(false, true, eCell.first.col);
                    }
                    if (ws.rows.length < eCell.first.row) {
                        ws.expandColsOnScroll(false, true, eCell.first.row);
                    }
                    for (var col = startCol; col <= endCol; col++) {
                        var idCell = new CellAddress(sCell.first.row - 1, col, 0);
                        var idCellNext = new CellAddress(eCell.first.row - 1, col, 0);
                        var cellId = idCell.getID();
                        result[n] = {
                            x: ws.cols[col].left,
                            y: ws.rows[sCell.first.row - 1].top,
                            width: ws.cols[col].width,
                            height: ws.rows[startCol].height,
                            id: cellId,
                            idNext: idCellNext.getID(),
                            showButton: this._isShowButton(aWs.AutoFilter.FilterColumns, col - startCol)
                        };
                        n++;
                    }
                } else {
                    if (aWs.TableParts[openFilter].Ref == "" || !aWs.TableParts[openFilter].Ref) {
                        return;
                    }
                    var allFil = aWs.TableParts[openFilter].Ref.split(":");
                    var sCell = ws.model.getCell(new CellAddress(allFil[0]));
                    var eCell = ws.model.getCell(new CellAddress(allFil[1]));
                    var n = 0;
                    result = [];
                    var startCol = sCell.first.col - 1;
                    var endCol = eCell.first.col - 1;
                    for (col = startCol; col <= endCol; col++) {
                        var idCell = new CellAddress(sCell.first.row - 1, col, 0);
                        var idCellNext = new CellAddress(eCell.first.row - 1, col, 0);
                        var cellId = idCell.getID();
                        result[n] = {
                            x: ws.cols[col].left,
                            y: ws.rows[sCell.first.row - 1].top,
                            width: ws.cols[col].width,
                            height: ws.rows[startCol].height,
                            id: cellId,
                            idNext: idCellNext.getID()
                        };
                        n++;
                    }
                }
            } else {
                if (activeCells.r1 == activeCells.r2 && activeCells.c1 == activeCells.c2) {
                    var mainCell = ws.model.getCell(new CellAddress(activeCells.r1, activeCells.c1, 0)).getCells();
                    var val = mainCell[0].getValue();
                    var mainAdjacentCells = this._getAdjacentCellsAF(activeCells, aWs);
                    rangeShift = ws.model.getRange(new CellAddress(mainAdjacentCells.r1, mainAdjacentCells.c1, 0), new CellAddress(mainAdjacentCells.r1, mainAdjacentCells.c2, 0));
                    var rowAdd = 0;
                    if (lTable) {
                        if (!mainAdjacentCells) {
                            mainAdjacentCells = activeCells;
                        }
                        var tableColumns = [];
                        var j = 0;
                        if (addNameColumn && !isTurnOffHistory) {
                            rowAdd = 1;
                        }
                        paramsForCallBackAdd = "addTableFilterOneCell";
                    } else {
                        paramsForCallBackAdd = "addAutoFilterOneCell";
                    }
                    rangeShift1 = t._getAscRange(mainAdjacentCells, rowAdd);
                    if (lTable) {
                        selectionTable = Asc.clone(rangeShift1);
                    }
                    if (isTurnOffHistory) {
                        onAddAutoFiltersCallback(true);
                    } else {
                        ws._isLockedCells(rangeShift1, null, onAddAutoFiltersCallback);
                    }
                    return;
                } else {
                    rangeShift = ws.model.getRange(new CellAddress(activeCells.r1, activeCells.c1, 0), new CellAddress(activeCells.r1, activeCells.c2, 0));
                    var rowAdd = 0;
                    if (lTable) {
                        var tableColumns = [];
                        var j = 0;
                        if (addNameColumn && !isTurnOffHistory) {
                            rowAdd = 1;
                        }
                        paramsForCallBackAdd = "addTableFilterManyCells";
                    } else {
                        paramsForCallBackAdd = "addAutoFilterManyCells";
                    }
                    rangeShift1 = t._getAscRange(activeCells, rowAdd);
                    if (lTable) {
                        selectionTable = Asc.clone(rangeShift1);
                    }
                    if (isTurnOffHistory) {
                        onAddAutoFiltersCallback(true);
                    } else {
                        ws._isLockedCells(rangeShift1, null, onAddAutoFiltersCallback);
                    }
                    return;
                }
            }
            if (!isAll && openFilter != undefined) {
                this._setColorStyleTable(result[0].id, result[result.length - 1].idNext, aWs.TableParts[openFilter]);
                var firstCell = ws.model.getCell(new CellAddress((result[0].id)));
                var endCell = ws.model.getCell(new CellAddress((result[result.length - 1].idNext)));
                var arn = {
                    r1: firstCell.first.row,
                    r2: endCell.first.row,
                    c1: firstCell.first.col,
                    c2: endCell.first.col
                };
            }
            if (openFilter != undefined) {
                var sortRange;
                var sortCol;
                var descending;
                if (openFilter == "all") {
                    aWs.AutoFilter.result = result;
                    var sortOptios = aWs.AutoFilter.SortState;
                } else {
                    if (!aWs.TableParts[openFilter].AutoFilter) {
                        isInsertButton = false;
                    }
                    aWs.TableParts[openFilter].result = result;
                    var sortOptios = aWs.TableParts[openFilter].SortState;
                }
            }
            if (openFilter != undefined) {
                newRes = {
                    result: result,
                    isVis: true
                };
                var ref = {
                    Ref: result[0].id + ":" + result[result.length - 1].idNext
                };
                if (isInsertButton) {
                    this._addButtonAF(newRes, bIsOpenFilter);
                    this.drawAutoF(true);
                } else {
                    if (!this.allButtonAF) {
                        this.allButtonAF = [];
                    }
                }
                if (openFilter != undefined) {
                    History.TurnOn();
                }
                return true;
            }
        },
        isButtonAFClick: function (x, y) {
            if (!this.allButtonAF) {
                return false;
            }
            var ws = this.worksheet;
            var buttons = this.allButtonAF;
            var kof = 96 / 72;
            var zoom = ws.getZoom();
            var width = 13 * zoom;
            var height = 13 * zoom;
            for (var i = 0; i < buttons.length; i++) {
                var width2 = (buttons[i].x) * kof + width;
                var width1 = (buttons[i].x) * kof;
                var height1 = (buttons[i].y) * kof;
                var height2 = (buttons[i].y + height) * kof;
                if (x >= width1 && x <= width2 && y >= height1 && y <= height2 && height1 >= ws.rows[0].top && width1 >= ws.cols[0].left) {
                    return "pointer";
                }
            }
        },
        autoFocusClick: function (x, y) {
            if (!this.allButtonAF) {
                return;
            }
            var ws = this.worksheet;
            var buttons = this.allButtonAF;
            var kof = 96 / 72;
            var zoom = ws.getZoom();
            var width = 13 * zoom;
            var height = 13 * zoom;
            for (var i = 0; i < buttons.length; i++) {
                var width2 = (buttons[i].x) * kof + width;
                var width1 = (buttons[i].x) * kof;
                var height1 = (buttons[i].y) * kof;
                var height2 = (buttons[i].y + height) * kof;
                if (x >= width1 && x <= width2 && y >= height1 && y <= height2 && height1 >= ws.rows[0].top && width1 >= ws.cols[0].left) {
                    this._showAutoFilterDialog(buttons[i], kof);
                    return;
                }
            }
        },
        drawAutoF: function (isNotDraw) {
            var buttons = this.allButtonAF;
            var ws = this.worksheet;
            if (buttons && this._isNeedDrawButton()) {
                var activeButtonFilter = [];
                var passiveButtonFilter = [];
                var newButtons = [];
                var l = 0;
                for (var i = 0; i < buttons.length; i++) {
                    var range = ws.model.getCell(new CellAddress(buttons[i].id)).getCells();
                    var col = range[0].oId.col - 1;
                    var row = range[0].oId.row - 1;
                    var sDiffx = ws.cols[ws.visibleRange.c1].left - ws.cols[0].left;
                    var sDiffy = ws.rows[ws.visibleRange.r1].top - ws.rows[0].top;
                    var width = 13;
                    var height = 13;
                    var rowHeight = ws.rows[row].height;
                    if (rowHeight < height) {
                        width = width * (rowHeight / height);
                        height = rowHeight;
                    }
                    var x1 = (ws.cols[col].left + ws.cols[col].width - width - sDiffx - 0.5) * ws.getZoom();
                    var y1 = (ws.rows[row].top + ws.rows[row].height - height - sDiffy - 0.5) * ws.getZoom();
                    buttons[i].x = x1;
                    buttons[i].y = y1;
                    buttons[i].x1 = ws.cols[col].left - sDiffx;
                    buttons[i].y1 = ws.rows[row].top - sDiffy;
                    buttons[i].width = ws.cols[col].width;
                    buttons[i].height = ws.rows[row].height;
                    var isSetFilter = false;
                    var activeCells = this._idToRange(buttons[i].id);
                    var indexFilter = this._findArrayFromAllFilter3(activeCells, buttons[i].id);
                    if (indexFilter != undefined && indexFilter.toString().search(":") > -1) {
                        newButtons[l] = buttons[i];
                        l++;
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
                        var filters;
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
                        if (isSetFilter) {
                            activeButtonFilter[activeButtonFilter.length] = buttons[i];
                        } else {
                            passiveButtonFilter[passiveButtonFilter.length] = buttons[i];
                        }
                        var sortState = undefined;
                        if (curFilForSort.SortState) {
                            if (curFilForSort.SortState.SortConditions && curFilForSort.SortState.SortConditions.length != 0 && curFilForSort.SortState.SortConditions[0].Ref.split(":")[0] == buttons[i].id) {
                                if (curFilForSort.SortState.SortConditions[0].ConditionDescending) {
                                    sortState = false;
                                } else {
                                    sortState = true;
                                }
                            }
                        }
                        var filOptions = {
                            sortState: sortState,
                            isSetFilter: isSetFilter,
                            row: row,
                            col: col
                        };
                        if (buttons[i].x1 >= ws.cols[0].left && buttons[i].y1 >= ws.rows[0].top && !isNotDraw) {
                            this._drawButton(x1, y1, filOptions);
                        }
                    }
                }
                this.allButtonAF = newButtons;
                for (k = 0; k < passiveButtonFilter.length + activeButtonFilter.length; k++) {
                    if (activeButtonFilter[k]) {
                        buttons[k] = activeButtonFilter[k];
                    } else {
                        buttons[k] = passiveButtonFilter[k - activeButtonFilter.length];
                    }
                }
            }
        },
        insertColumn: function (type, val, ar, insertType) {
            var activeCells;
            var DeleteColumns = (insertType == c_oAscDeleteOptions.DeleteColumns && type == "delCell") ? true : false;
            if (typeof val == "object") {
                activeCells = Asc.clone(val);
                val = activeCells.c2 - activeCells.c1 + 1;
            } else {
                activeCells = ar;
                if (!val) {
                    val = activeCells.c2 - activeCells.c1 + 1;
                }
            }
            if (DeleteColumns) {
                activeCells.r1 = 0;
                activeCells.r2 = this.worksheet.nRowsCount - 1;
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
            this._changeFiltersAfterColumn(colInsert, val, "insCol", activeCells);
        },
        insertRows: function (type, val, ar, insertType) {
            var activeCells;
            var DeleteRows = (insertType == c_oAscDeleteOptions.DeleteRows && type == "delCell") ? true : false;
            if (typeof val == "object") {
                activeCells = Asc.clone(val);
                val = activeCells.r2 - activeCells.r1 + 1;
            } else {
                activeCells = ar;
                if (!val) {
                    val = activeCells.r2 - activeCells.r1 + 1;
                }
            }
            if (DeleteRows) {
                activeCells.c1 = 0;
                activeCells.c2 = this.worksheet.nColsCount - 1;
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
            this._changeFiltersAfterColumn(colInsert, val, "insRow", activeCells);
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
            var newStartId;
            var t = this;
            var selectionRange;
            var onSortAutoFilterCallback = function (success) {
                if (success) {
                    if (isTurnOffHistory) {
                        History.TurnOff();
                    }
                    History.Create_NewPoint();
                    History.StartTransaction();
                    if (!currentFilter.SortState) {
                        currentFilter.SortState = {
                            Ref: currentFilter.Ref,
                            SortConditions: []
                        };
                        currentFilter.SortState.SortConditions[0] = {};
                    }
                    if (!currentFilter.SortState.SortConditions[0]) {
                        currentFilter.SortState.SortConditions[0] = {};
                    }
                    currentFilter.SortState.SortConditions[0].Ref = cellId + ":" + newEndId;
                    currentFilter.SortState.SortConditions[0].ConditionDescending = type;
                    var sortCol = curCell.c1;
                    sortRange.sort(type, sortCol);
                    if (currentFilter.TableStyleInfo) {
                        t._setColorStyleTable(currentFilter.Ref.split(":")[0], currentFilter.Ref.split(":")[1], currentFilter);
                    }
                    t._addHistoryObj(oldFilter, historyitem_AutoFilter_Sort, {
                        activeCells: activeCells,
                        type: type,
                        cellId: cellId
                    });
                    History.EndTransaction();
                    History.SetSelection(selectionRange);
                    ws._cleanCache(selectionRange);
                    ws.isChanged = true;
                    ws.changeWorksheet("update");
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
                    sortRange.sort(type, sortCol);
                    if (currentFilter.TableStyleInfo) {
                        t._setColorStyleTable(currentFilter.Ref.split(":")[0], currentFilter.Ref.split(":")[1], currentFilter);
                    }
                    History.EndTransaction();
                    History.SetSelection(selectionRange);
                    ws._cleanCache(selectionRange);
                    ws.isChanged = true;
                    ws.changeWorksheet("update");
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
                var filter = t._searchFilters(activeRange, null, aWs);
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
                        var splitRef = curFilter.Ref.split(":");
                        var startCellFilter = this._idToRange(splitRef[0]);
                        var endCellFilter = this._idToRange(splitRef[1]);
                        if (activeRange.r1 == activeRange.r2 && activeRange.c1 == activeRange.c2) {
                            for (var i = 0; i < curFilter.result.length; i++) {
                                var rangeCol = t._idToRange(curFilter.result[i].id);
                                if (rangeCol.c1 == activeRange.c1) {
                                    cellId = curFilter.result[i].id;
                                    break;
                                }
                            }
                        } else {
                            if (startCellFilter.r1 == activeRange.r1 && startCellFilter.c1 == activeRange.c1 && endCellFilter.r1 == activeRange.r2 && endCellFilter.c1 == activeRange.c2) {
                                cellId = splitRef[0];
                            } else {
                                if (startCellFilter.r1 == activeRange.r1) {
                                    var newStartCell = {
                                        r1: activeRange.r1 + 1,
                                        c1: activeRange.c1
                                    };
                                    sortCol = activeRange.c1;
                                    newStartId = t._rangeToId(newStartCell);
                                    newEndId = t._rangeToId({
                                        r1: activeRange.r2,
                                        c1: activeRange.c2
                                    });
                                    sortRange = ws.model.getRange(new CellAddress(newStartId), new CellAddress(newEndId));
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
                    } else {
                        ws.setSelectionInfo("sort", type);
                        return;
                    }
                }
            }
            activeCells = t._idToRange(cellId);
            var indexFilter = t._findArrayFromAllFilter3(activeCells, cellId);
            var filtersOp = indexFilter.split(":");
            if (filtersOp[0] == "all") {
                currentFilter = aWs.AutoFilter;
            } else {
                currentFilter = aWs.TableParts[filtersOp[0]];
            }
            oldFilter = Asc.clone(currentFilter);
            var rangeCell = currentFilter.Ref.split(":");
            var startCell = t._idToRange(rangeCell[0]);
            var endCell = t._idToRange(rangeCell[1]);
            curCell = t._idToRange(cellId);
            curCell.r1 = endCell.r1;
            selectionRange = new Asc.Range(startCell.c1, startCell.r1 + 1, endCell.c2, endCell.r2);
            newEndId = t._rangeToId(curCell);
            startCell.r1 = startCell.r1 + 1;
            newStartId = t._rangeToId(startCell);
            sortRange = ws.model.getRange(new CellAddress(newStartId), new CellAddress(rangeCell[1]));
            var sortRange1 = t._getAscRange(sortRange.bbox);
            if (isTurnOffHistory) {
                onSortAutoFilterCallback(true);
            } else {
                ws._isLockedCells(sortRange1, null, onSortAutoFilterCallback);
            }
        },
        isEmptyAutoFilters: function (ar, turnOnHistory, insCells, deleteFilterAfterDeleteColRow) {
            if (turnOnHistory) {
                History.TurnOn();
                History.Create_NewPoint();
            }
            History.StartTransaction();
            var aWs = this._getCurrentWS();
            var activeCells = ar;
            if (aWs.AutoFilter) {
                var oRange = aWs.getRange2(aWs.AutoFilter.Ref);
                var bbox = oRange.getBBox0();
                if (activeCells.r1 <= bbox.r1 && activeCells.r2 >= bbox.r2 && activeCells.c1 <= bbox.c1 && activeCells.c2 >= bbox.c2) {
                    var oldFilter = Asc.clone(aWs.AutoFilter);
                    aWs.AutoFilter = null;
                    aWs.setRowHidden(false, bbox.r1, bbox.r2);
                    if (insCells) {
                        oldFilter.insCells = true;
                    }
                    this._addHistoryObj(oldFilter, historyitem_AutoFilter_Empty, {
                        activeCells: activeCells
                    });
                }
            }
            if (aWs.TableParts) {
                var newTableParts = [];
                var k = 0;
                for (var i = 0; i < aWs.TableParts.length; i++) {
                    var oCurFilter = Asc.clone(aWs.TableParts[i]);
                    var oRange = aWs.getRange2(oCurFilter.Ref);
                    if (insCells) {
                        oCurFilter.insCells = true;
                    }
                    var bbox = oRange.getBBox0();
                    if (activeCells.r1 <= bbox.r1 && activeCells.r2 >= bbox.r2 && activeCells.c1 <= bbox.c1 && activeCells.c2 >= bbox.c2) {
                        oRange.setTableStyle(null);
                        aWs.setRowHidden(false, bbox.r1, bbox.r2);
                        this._addHistoryObj(oCurFilter, historyitem_AutoFilter_Empty, {
                            activeCells: activeCells
                        },
                        deleteFilterAfterDeleteColRow);
                    } else {
                        newTableParts[k] = oCurFilter;
                        k++;
                    }
                }
                aWs.TableParts = newTableParts;
            }
            History.EndTransaction();
            if (turnOnHistory) {
                History.TurnOff();
            }
        },
        getTablePictures: function (wb) {
            var canvas = document.createElement("canvas");
            canvas.width = "61";
            canvas.height = "46";
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
                            image: this._drawSmallIconTable(canvas, customStyles[i])
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
                            image: this._drawSmallIconTable(canvas, defaultStyles[i])
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
                this.addAutoFilter(data.lTable, data.activeCells, undefined, true, data.addFormatTableOptionsObj);
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
            }
            startRedo = false;
            History.TurnOn();
        },
        Undo: function (type, data) {
            var ws = data.worksheet;
            var aWs = this._getCurrentWS();
            data = data.undo;
            var cloneData = Asc.clone(data);
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
                        if (cloneData.refTable == aWs.TableParts[l].Ref) {
                            this._cleanStyleTable(aWs, cloneData.refTable);
                            aWs.TableParts.splice(l, 1);
                        }
                    }
                }
            }
            if (cloneData.FilterColumns || cloneData.AutoFilter || cloneData.result) {
                if (cloneData.Ref) {
                    var isEn = false;
                    if (aWs.AutoFilter && aWs.AutoFilter.Ref == cloneData.Ref) {
                        this._reDrawCurrentFilter(cloneData.FilterColumns, cloneData.result);
                        aWs.AutoFilter = cloneData;
                        isEn = true;
                    } else {
                        if (aWs.TableParts) {
                            for (var l = 0; l < aWs.TableParts.length; l++) {
                                if (cloneData.Ref == aWs.TableParts[l].Ref) {
                                    var cloneResult = Asc.clone(cloneData.result);
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
                            var splitRange = cloneData.Ref.split(":");
                            this._setColorStyleTable(splitRange[0], splitRange[1], cloneData, null, true);
                            this._addButtonAF({
                                result: cloneData.result,
                                isVis: true
                            });
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
                if (cloneData.oldFilter) {
                    if (aWs.AutoFilter && this._rangeHitInAnRange(this._refToRange(cloneData.oldFilter.Ref), this._refToRange(aWs.AutoFilter.Ref))) {
                        aWs.AutoFilter = cloneData.oldFilter;
                        this._addButtonAF({
                            result: cloneData.oldFilter.result,
                            isVis: true
                        });
                    } else {
                        if (aWs.TableParts) {
                            for (var l = 0; l < aWs.TableParts.length; l++) {
                                if (this._rangeHitInAnRange(this._refToRange(cloneData.oldFilter.Ref), this._refToRange(aWs.TableParts[l].Ref))) {
                                    aWs.TableParts[l] = cloneData.oldFilter;
                                    this._addButtonAF({
                                        result: cloneData.oldFilter.result,
                                        isVis: true
                                    });
                                    var splitRange = cloneData.oldFilter.Ref.split(":");
                                    this._setColorStyleTable(splitRange[0], splitRange[1], cloneData.oldFilter, null, true);
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    if (cloneData.Ref) {
                        if (aWs.AutoFilter && aWs.AutoFilter.Ref == cloneData.Ref) {
                            delete aWs.AutoFilter;
                        } else {
                            if (aWs.TableParts) {
                                for (var l = 0; l < aWs.TableParts.length; l++) {
                                    if (cloneData.Ref == aWs.TableParts[l].Ref) {
                                        this._cleanStyleTable(aWs, cloneData.Ref);
                                        aWs.TableParts.splice(l, 1);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            ws.changeWorksheet("update");
            ws.isChanged = true;
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
            var aWs = this._getCurrentWS();
            var tableParts = aWs.TableParts;
            if (tableParts) {
                for (var i = 0; i < tableParts.length; i++) {
                    var currentFilter = tableParts[i];
                    if (currentFilter && currentFilter.Ref) {
                        var ref = currentFilter.Ref.split(":");
                        var startId = this._idToRange(ref[0]);
                        var endId = this._idToRange(ref[1]);
                        var tableRange = {
                            r1: startId.r1,
                            c1: startId.c1,
                            r2: endId.r1,
                            c2: endId.c1
                        };
                        if (this._rangeHitInAnRange(range, tableRange)) {
                            this._setColorStyleTable(ref[0], ref[1], currentFilter);
                        }
                    }
                }
            }
        },
        searchRangeInTableParts: function (range) {
            var aWs = this._getCurrentWS();
            var tableRange;
            if (aWs.TableParts) {
                for (var i = 0; i < aWs.TableParts.length; i++) {
                    if (aWs.TableParts[i].Ref) {
                        var ref = aWs.TableParts[i].Ref.split(":");
                        var startRange = this._idToRange(ref[0]);
                        var endRange = this._idToRange(ref[1]);
                        tableRange = {
                            r1: startRange.r1,
                            r2: endRange.r1,
                            c1: startRange.c1,
                            c2: endRange.c1
                        };
                    }
                    if (this._rangeHitInAnRange(range, tableRange)) {
                        return true;
                    }
                }
            }
            return false;
        },
        getAddFormatTableOptions: function (activeCells) {
            var ws = this.worksheet;
            var aWs = this._getCurrentWS();
            var objOptions = new AddFormatTableOptions();
            var alreadyAddFilter = this._searchFilters(activeCells, false, aWs);
            if ((alreadyAddFilter && alreadyAddFilter.changeStyle) || (alreadyAddFilter && !alreadyAddFilter.containsFilter && !alreadyAddFilter.all)) {
                return false;
            }
            var mainAdjacentCells;
            if (alreadyAddFilter && alreadyAddFilter.changeAllFOnTable && alreadyAddFilter.range) {
                mainAdjacentCells = alreadyAddFilter.range;
            } else {
                if (activeCells.r1 == activeCells.r2 && activeCells.c1 == activeCells.c2) {
                    mainAdjacentCells = this._getAdjacentCellsAF(activeCells, aWs);
                } else {
                    mainAdjacentCells = Asc.clone(activeCells);
                }
            }
            var isTitle = this._isAddNameColumn(mainAdjacentCells);
            objOptions.asc_setIsTitle(isTitle);
            var firstCellId = this._rangeToId(mainAdjacentCells);
            var endCellId = this._rangeToId({
                r1: mainAdjacentCells.r2,
                c1: mainAdjacentCells.c2,
                r2: mainAdjacentCells.r2,
                c2: mainAdjacentCells.c2
            });
            var sListName = ws.model.getName();
            var ref = sListName + "!" + firstCellId + ":" + endCellId;
            objOptions.asc_setRange(ref);
            this.AddFormatTableOptions = objOptions;
            return objOptions;
        },
        isActiveCellsCrossHalfFTable: function (activeCells, val, prop, bUndoRedo) {
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
            var result = true;
            if (DeleteColumns || DeleteRows) {
                var newActiveRange;
                if (DeleteRows) {
                    newActiveRange = {
                        c1: ws.visibleRange.c1,
                        c2: ws.visibleRange.c2,
                        r1: activeCells.r1,
                        r2: activeCells.r2
                    };
                } else {
                    newActiveRange = {
                        c1: activeCells.c1,
                        c2: activeCells.c2,
                        r1: ws.visibleRange.r1,
                        r2: ws.visibleRange.r2
                    };
                }
                if (tableParts) {
                    var tableRange;
                    var isExp = false;
                    var isPart = false;
                    for (var i = 0; i < tableParts.length; i++) {
                        tableRange = this._refToRange(tableParts[i].Ref);
                        if (this._rangeHitInAnRange(newActiveRange, tableRange)) {
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
                                        isPart = true;
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
                    tableRange = this._refToRange(tableParts[i].Ref);
                    isExp = false;
                    if (this._rangeHitInAnRange(activeCells, tableRange)) {
                        if (activeCells.c1 <= tableRange.c1 && activeCells.r1 <= tableRange.r1 && activeCells.c2 >= tableRange.c2 && activeCells.r2 >= tableRange.r2) {
                            result = "changeAutoFilter";
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
                                if (!bUndoRedo) {
                                    ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
                                }
                                return false;
                            }
                        }
                    } else {
                        if (DeleteCellsAndShiftLeft) {
                            if (tableRange.c1 > activeCells.c1 && (tableRange.r1 < activeCells.r1 || tableRange.r2 > activeCells.r2)) {
                                if (!bUndoRedo) {
                                    ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
                                }
                                return false;
                            }
                        } else {
                            if (DeleteCellsAndShiftTop) {
                                if (tableRange.r1 > activeCells.r1 && (tableRange.c1 < activeCells.c1 || tableRange.c2 > activeCells.c2)) {
                                    if (!bUndoRedo) {
                                        ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
                                    }
                                    return false;
                                }
                            } else {
                                if (InsertCellsAndShiftRight) {
                                    if (tableRange.c1 > activeCells.c1 && (tableRange.r1 < activeCells.r1 || tableRange.r2 > activeCells.r2)) {
                                        if (!bUndoRedo) {
                                            ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
                                        }
                                        return false;
                                    }
                                } else {
                                    if (tableRange.r1 > activeCells.r1 && (tableRange.c1 < activeCells.c1 || tableRange.c2 > activeCells.c2)) {
                                        if (!bUndoRedo) {
                                            ws.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.AutoFilterChangeFormatTableError, c_oAscError.Level.NoCritical);
                                        }
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                    if (DeleteCellsAndShiftLeft && tableRange.c1 > activeCells.c1 && tableRange.r1 >= activeCells.r1 && tableRange.r2 <= activeCells.r2) {
                        result = "changeAutoFilter";
                    } else {
                        if (DeleteCellsAndShiftTop && tableRange.r1 > activeCells.r1 && tableRange.c1 >= activeCells.c1 && tableRange.c2 <= activeCells.c2) {
                            result = "changeAutoFilter";
                        } else {
                            if (InsertCellsAndShiftRight && tableRange.c1 >= activeCells.c1 && tableRange.r1 >= activeCells.r1 && tableRange.r2 <= activeCells.r2) {
                                result = "changeAutoFilter";
                            } else {
                                if (InsertCellsAndShiftDown && tableRange.r1 >= activeCells.r1 && tableRange.c1 >= activeCells.c1 && tableRange.c2 <= activeCells.c2) {
                                    result = "changeAutoFilter";
                                }
                            }
                        }
                    }
                }
            }
            if ((DeleteCellsAndShiftLeft || DeleteCellsAndShiftTop || InsertCellsAndShiftDown || InsertCellsAndShiftRight) && autoFilter) {
                tableRange = this._refToRange(autoFilter.Ref);
                if (this._rangeHitInAnRange(activeCells, tableRange)) {
                    if (activeCells.c1 <= tableRange.c1 && activeCells.r1 <= tableRange.r1 && activeCells.c2 >= tableRange.c2 && activeCells.r2 >= tableRange.r2) {
                        result = "changeAutoFilter";
                    }
                }
                if (activeCells.c2 < tableRange.c1 && activeCells.r1 <= tableRange.r1 && activeCells.r2 >= tableRange.r2) {
                    result = "changeAutoFilter";
                } else {
                    if (activeCells.r2 < tableRange.r1 && activeCells.c1 <= tableRange.c1 && activeCells.c2 >= tableRange.c2) {
                        result = "changeAutoFilter";
                    }
                }
            }
            return result;
        },
        _applyDigitalFilter: function (ar, autoFiltersObject) {
            var ws = this.worksheet;
            var aWs = this._getCurrentWS();
            var conFilter = autoFiltersObject;
            var activeCells = this._idToRange(conFilter.cellId);
            var indexFilter = this._findArrayFromAllFilter3(activeCells, conFilter.cellId);
            var filtersOp = indexFilter.split(":");
            var currentFilter;
            if (filtersOp[0] == "all") {
                currentFilter = aWs.AutoFilter;
            } else {
                currentFilter = aWs.TableParts[filtersOp[0]];
            }
            var startIdCell = currentFilter.result[filtersOp[1]].id;
            var endIdCell = currentFilter.result[filtersOp[1]].idNext;
            var startRange = ws.model.getCell(new CellAddress(startIdCell));
            var endRange = ws.model.getCell(new CellAddress(endIdCell));
            var isMerged = startRange.hasMerged();
            var startCell = this._idToRange(startIdCell);
            if (isMerged && startCell.c1 != isMerged.c1) {
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
                var cell = ws.model.getCell(new CellAddress(i, startRange.first.col - 1, 0));
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
            var oldFilter = Asc.clone(currentFilter);
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
                cellId = autoFiltersObject.cellId;
                array = Asc.clone(autoFiltersObject.result);
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
            var oldFilter = Asc.clone(filterObj);
            var cell = ws.model.getCell(new CellAddress(activeCells.r1, activeCells.c1, 0));
            var rangeStart = this._idToRange(ref.split(":")[0]);
            if (newAcCells.c1 == (rangeStart.c1 + parseInt(filtersOp[1]))) {
                var isMerged = cell.hasMerged();
                if (isMerged) {
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
                if (isMerged && activeCells.c1 != isMerged.c1) {
                    activeCells.c1 = isMerged.c1;
                } else {
                    isMerged = false;
                }
                var lengthRows = array.length;
                if (ref && ref.split(":")[1]) {
                    lengthRows = this._idToRange(ref.split(":")[1]).r1 - this._idToRange(ref.split(":")[0]).r1;
                }
                var allFilterOpenElements = true;
                for (var s = 0; s < array.length; s++) {
                    if (array[s].visible == false) {
                        allFilterOpenElements = false;
                        break;
                    }
                }
                for (var m = 0; m < lengthRows; m++) {
                    var val = ws.model._getCell(activeCells.r1 + m + 1, activeCells.c1).getValue();
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
            var newArray = [];
            var cellAdd = 1;
            var rowNew = 0;
            for (var i = 0; i < array.length; i++) {
                row = i + activeCells.r1 + cellAdd;
                if (array[i] == false) {
                    allFilterOpenElements = false;
                }
                if (array[i] == "rep") {
                    var mainVal = ws.model.getCell(new CellAddress(activeCells.r1 + i + 1, activeCells.c1, 0)).getCells()[0].getValue();
                    for (var k = 0; k < array.length; k++) {
                        if (array[k] == false || array[k] == true) {
                            var val2 = ws.model.getCell(new CellAddress(activeCells.r1 + k + 1, activeCells.c1, 0)).getCells()[0].getValue();
                            if (val2 == mainVal) {
                                array[i] = array[k];
                                break;
                            }
                        }
                    }
                }
                if (array[i] == false || array[i] == "hidden") {
                    if (!ws.model._getRow(row).hd) {
                        ws.model.setRowHidden(true, row, row);
                    }
                } else {
                    if (array[i] == true) {
                        var isHidden = ws.model._getRow(row).hd;
                        var alreadyHidden = false;
                        if (isHidden) {
                            ws.model.setRowHidden(false, row, row);
                        }
                    }
                }
            }
            var isPress;
            if (customFilter) {
                isPress = true;
            } else {
                var allVis = true;
                for (var i = 0; i < array.length; i++) {
                    if (allFilterOpenElements) {
                        break;
                    }
                    var cell = ws.model.getCell(new CellAddress(activeCells.r1 + i + 1, activeCells.c1, 0));
                    var valActive = cell.getValue();
                    var arrVal;
                    if (isCurFilter == undefined || !currentFilter[isCurFilter].Filters) {
                        if (isCurFilter == undefined) {
                            isCurFilter = currentFilter.length;
                        }
                        if (currentFilter[isCurFilter]) {
                            currentFilter[isCurFilter].ColId = filtersOp[1];
                            currentFilter[isCurFilter].Filters = {};
                        } else {
                            currentFilter[isCurFilter] = {
                                ColId: filtersOp[1],
                                Filters: {}
                            };
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
                            if (this._dataFilterParse(arrVal[h], valActive)) {
                                isConsist = h;
                            }
                        }
                        if (isConsist == undefined) {
                            var dataVal = NumFormat.prototype.parseDate(valActive);
                            valActive = {
                                DateTimeGrouping: 1,
                                Day: dataVal.d,
                                Month: dataVal.month + 1,
                                Year: dataVal.year
                            };
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
                        var isBlank;
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
                isPress = true;
                if (allVis || allFilterOpenElements) {
                    if (currentFilter[isCurFilter] && currentFilter[isCurFilter].ShowButton == false) {
                        currentFilter[isCurFilter].Filters = null;
                        currentFilter[isCurFilter].CustomFiltersObj = null;
                    } else {
                        currentFilter.splice(isCurFilter, 1);
                    }
                    isPress = false;
                }
            }
            if (!customFilter) {
                this._addHistoryObj(oldFilter, historyitem_AutoFilter_ApplyMF, {
                    activeCells: ar,
                    autoFiltersObject: autoFiltersObject
                });
            }
            ws.isChanged = true;
            this._reDrawFilters();
            this.drawAutoF();
        },
        _getAutoFilterArray: function (cell) {
            var nextCell;
            var activeCells;
            var curId = cell.id;
            var nextId = cell.idNext;
            var ws = this.worksheet;
            cell = ws.model.getCell(new CellAddress(curId)).getCells();
            activeCells = {
                c1: ws.model.getCell(new CellAddress(curId)).first.col - 1,
                r1: ws.model.getCell(new CellAddress(curId)).first.row - 1,
                c2: ws.model.getCell(new CellAddress(nextId)).first.col - 1,
                r2: ws.model.getCell(new CellAddress(nextId)).first.row - 1
            };
            var indexFilter = this._findArrayFromAllFilter3(activeCells, curId);
            var result = this._getArrayOpenCells(indexFilter, curId);
            return result;
        },
        _getAdjacentCellsAF: function (ar, aWs) {
            var ws = this.worksheet;
            var cell = ws.model.getCell(new CellAddress(ar.r1, ar.c1, 0)).getCells();
            var cloneActiveRange = Asc.clone(ar);
            var isEnd = true;
            var range;
            var merged;
            var valueMerg;
            var rowNum = cloneActiveRange.r1;
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
                    cell = ws.model._getCell(n, k);
                    if (k >= cloneActiveRange.c1 && k <= cloneActiveRange.c2 && n >= cloneActiveRange.r1 && n <= cloneActiveRange.r2) {
                        continue;
                    }
                    range = ws.model.getCell(new CellAddress(n + 1, k + 1));
                    if (! (n == ar.r1 && k == ar.c1) && range) {
                        merged = range.hasMerged();
                        valueMerg = null;
                        if (merged) {
                            valueMerg = ws.model.getRange(new CellAddress(merged.r1 + 1, merged.c1 + 1), new CellAddress(merged.r2 + 1, merged.c2 + 1)).getValue();
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
                                cell = ws.model._getCell(n, k);
                            }
                        }
                    }
                    if (cell.getValueWithoutFormat() != "" || (valueMerg != null && valueMerg != "")) {
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
                }
            }
            if (ar.r1 == cloneActiveRange.r1) {
                for (var n = cloneActiveRange.c1; n <= cloneActiveRange.c2; n++) {
                    cell = ws.model._getCell(cloneActiveRange.r1, n);
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
                        cell = ws.model._getCell(cloneActiveRange.r2, n);
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
                    cell = ws.model._getCell(n, cloneActiveRange.c1);
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
                        cell = ws.model._getCell(n, cloneActiveRange.c2);
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
                var newRange = {};
                for (var i = 0; i < oldFilters.length; i++) {
                    if (!oldFilters[i].Ref || oldFilters[i].Ref == "") {
                        continue;
                    }
                    var fromCellId = oldFilters[i].Ref.split(":")[0];
                    var toCellId = oldFilters[i].Ref.split(":")[1];
                    var startId = ws.model.getCell(new CellAddress(fromCellId));
                    var endId = ws.model.getCell(new CellAddress(toCellId));
                    var oldRange = {
                        r1: startId.first.row - 1,
                        c1: startId.first.col - 1,
                        r2: endId.first.row - 1,
                        c2: endId.first.col - 1
                    };
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
            ws._trigger("setAutoFiltersDialog", autoFilterObject);
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
            var zoom = ws.getZoom();
            var x1 = x1 / zoom;
            var y1 = y1 / zoom;
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
            ws.drawingCtx.beginPath().moveTo(x, y).lineTo(x, y1).setStrokeStyle("#787878").stroke();
            ws.drawingCtx.beginPath().lineTo(x + halfSize, y1).lineTo(x, y1 + meanLine).lineTo(x - halfSize, y1).lineTo(x, y1).setFillStyle("#787878").fill();
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
            ws.drawingCtx.beginPath().moveTo(x, y).lineTo(x + size, y).lineTo(x + halfSize, y + meanLine).lineTo(x, y).setFillStyle("#787878").fill();
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
            var turnOnAllSym = true;
            if (!turnOnAllSym && valLog[0] && typeof valLog[0] == "string" && (valLog[0].split("?").length > 1 || valLog[0].split("*").length > 1) && (conFilter.filterDisableSpecSymbols1 || this._getPositionSpecSymbols(valLog[0]) != null)) {
                trueStr = "";
                for (var i = 0; i < valLog[0].length; i++) {
                    if (valLog[0][i] != "?" && valLog[0][i] != "*") {
                        trueStr += valLog[0][i];
                    }
                }
                valLog[0] = trueStr;
            }
            if (!turnOnAllSym && typeof valLog[1] == "string" && valLog[1] && (valLog[1].split("?").length > 1 || valLog[1].split("*").length > 1) && (conFilter.filterDisableSpecSymbols1 || this._getPositionSpecSymbols(valLog[1]) != null)) {
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
                var checkComplexSymbols = this._parseComplexSpecSymbols(val, arrLog[s], valLog[s], type);
                var filterVal;
                if (checkComplexSymbols != null) {
                    result[s] = checkComplexSymbols;
                } else {
                    if (arrLog[s] == ECustomFilter.customfilterEqual || arrLog[s] == ECustomFilter.customfilterNotEqual) {
                        val = val.toString();
                        filterVal = valLog[s].toString();
                        if (arrLog[s] == ECustomFilter.customfilterEqual) {
                            if (val == filterVal || valWithFormat == filterVal) {
                                result[s] = true;
                            }
                        } else {
                            if (arrLog[s] == ECustomFilter.customfilterNotEqual) {
                                if (val != filterVal || valWithFormat != filterVal) {
                                    result[s] = true;
                                }
                            }
                        }
                    } else {
                        if (arrLog[s] == ECustomFilter.customfilterGreaterThan || arrLog[s] == ECustomFilter.customfilterGreaterThanOrEqual || arrLog[s] == ECustomFilter.customfilterLessThan || arrLog[s] == ECustomFilter.customfilterLessThanOrEqual) {
                            filterVal = parseFloat(valLog[s]);
                            if (g_oFormatParser && g_oFormatParser.parse && g_oFormatParser.parse(valLog[s]) != null) {
                                filterVal = g_oFormatParser.parse(valLog[s]).value;
                            }
                            if (isNaN(filterVal)) {
                                filterVal = "";
                            } else {
                                switch (arrLog[s]) {
                                case ECustomFilter.customfilterGreaterThan:
                                    if (val > filterVal) {
                                        result[s] = true;
                                    }
                                    break;
                                case ECustomFilter.customfilterGreaterThanOrEqual:
                                    if (val >= filterVal) {
                                        result[s] = true;
                                    }
                                    break;
                                case ECustomFilter.customfilterLessThan:
                                    if (val < valLog[s]) {
                                        result[s] = true;
                                    }
                                    break;
                                case ECustomFilter.customfilterLessThanOrEqual:
                                    if (val <= filterVal) {
                                        result[s] = true;
                                    }
                                    break;
                                }
                            }
                        } else {
                            if (arrLog[s] == 7 || arrLog[s] == 8 || arrLog[s] == 9 || arrLog[s] == 10 || arrLog[s] == 11 || arrLog[s] == 12 || arrLog[s] == 13) {
                                filterVal = valLog[s];
                                var newVal = val;
                                if (!isNaN(parseFloat(newVal))) {
                                    newVal = valWithFormat;
                                }
                                var position;
                                switch (arrLog[s]) {
                                case 7:
                                    if (type == 1) {
                                        if (newVal.search("?") || newVal.search("*")) {
                                            if (newVal.search(filterVal) == 0) {
                                                result[s] = true;
                                            }
                                        }
                                    }
                                    break;
                                case 8:
                                    if (type == 1) {
                                        if (newVal.search(filterVal) != 0) {
                                            result[s] = true;
                                        }
                                    } else {
                                        result[s] = true;
                                    }
                                    break;
                                case 9:
                                    position = newVal.length - filterVal.length;
                                    if (type == 1) {
                                        if (newVal.lastIndexOf(filterVal) == position && position > 0) {
                                            result[s] = true;
                                        }
                                    }
                                    break;
                                case 10:
                                    position = newVal.length - filterVal.length;
                                    if (type == 1) {
                                        if (newVal.lastIndexOf(filterVal) != position && position > 0) {
                                            result[s] = true;
                                        }
                                    } else {
                                        result[s] = true;
                                    }
                                    break;
                                case 11:
                                    if (type == 1) {
                                        if (newVal.search(filterVal) != -1) {
                                            result[s] = true;
                                        }
                                    }
                                    break;
                                case 12:
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
        _searchFilters: function (activeCells, isAll, aWs) {
            var ws = this.worksheet;
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
                var cCell = allF[i].Ref.split(":");
                var fromCell = ws.model.getCell(new CellAddress(cCell[0]));
                var toCell = ws.model.getCell(new CellAddress(cCell[1]));
                var range = {
                    c1: fromCell.first.col - 1,
                    r1: fromCell.first.row - 1,
                    c2: toCell.first.col - 1,
                    r2: toCell.first.row - 1
                };
                if (!allF[i].AutoFilter && !allF[i].TableStyleInfo) {
                    numAll = {
                        num: i,
                        range: range,
                        all: true
                    };
                }
                if (activeCells.c1 >= range.c1 && activeCells.c2 <= range.c2 && activeCells.r1 >= range.r1 && activeCells.r2 <= range.r2) {
                    var curRange = Asc.clone(range);
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
                            num = {
                                num: i,
                                range: range,
                                all: true
                            };
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
                var ref = aWs.AutoFilter.Ref.split(":");
                var sCell = ws.model.getCell(new CellAddress(ref[0]));
                var eCell = ws.model.getCell(new CellAddress(ref[1]));
                var rangeFilter = {
                    c1: sCell.first.col - 1,
                    c2: eCell.first.col - 1,
                    r1: sCell.first.row - 1,
                    r2: eCell.first.row - 1
                };
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
                    var ref = tableParts[tP].Ref.split(":");
                    var sCell = ws.model.getCell(new CellAddress(ref[0]));
                    var eCell = ws.model.getCell(new CellAddress(ref[1]));
                    var rangeFilter = {
                        c1: sCell.first.col - 1,
                        c2: eCell.first.col - 1,
                        r1: sCell.first.row - 1,
                        r2: eCell.first.row - 1
                    };
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
        _addButtonAF: function (arr, bIsOpenFilter) {
            if (arr.result) {
                var ws = this.worksheet;
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
                                    for (aF = 0; aF < this.allButtonAF.length; aF++) {
                                        if (this.allButtonAF[aF].id == arr.result[i].id) {
                                            this.allButtonAF[aF] = arr.result[i];
                                            this.allButtonAF[aF].inFilter = arr.result[0].id + ":" + arr.result[arr.result.length - 1].idNext;
                                            isInsert = true;
                                            break;
                                        }
                                    }
                                }
                                if (!isInsert) {
                                    this.allButtonAF[leng + n] = arr.result[i];
                                    this.allButtonAF[leng + n].inFilter = arr.result[0].id + ":" + arr.result[arr.result.length - 1].idNext;
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
                if (!bIsOpenFilter) {
                    ws.changeWorksheet("update");
                    ws.isChanged = true;
                }
            }
        },
        _cleanStyleTable: function (aWs, sRef) {
            var oRange = aWs.getRange2(sRef);
            oRange.setTableStyle(null);
        },
        _setColorStyleTable: function (id, idNext, options, isOpenFilter, isSetVal) {
            var ws = this.worksheet;
            var firstCellAddress = new CellAddress(id);
            var endCellAddress = new CellAddress(idNext);
            var bbox = {
                r1: firstCellAddress.getRow0(),
                c1: firstCellAddress.getCol0(),
                r2: endCellAddress.getRow0(),
                c2: endCellAddress.getCol0()
            };
            var maxValCol = 20000;
            var maxValRow = 100000;
            if ((bbox.r2 - bbox.r1) > maxValRow) {
                bbox.r2 = bbox.r1 + maxValRow;
            }
            if ((bbox.c2 - bbox.c1) > maxValCol) {
                bbox.c2 = bbox.c1 + maxValCol;
            }
            var style = Asc.clone(options.TableStyleInfo);
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
                            range.setNumFormat("@");
                        }
                    }
                }
                var aNoHiddenCol = new Array();
                for (var i = bbox.c1; i <= bbox.c2; i++) {
                    var col = ws.model._getColNoEmpty(i);
                    if (null == col || true != col.hd) {
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
                var aNoHiddenRow = new Array();
                for (var i = bbox.r1; i <= bbox.r2; i++) {
                    var row = ws.model._getRowNoEmpty(i);
                    if (null == row || true != row.hd) {
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
                        var cell = ws.model._getCell(nRowIndexAbs, nColIndexAbs);
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
            var ws = this.worksheet;
            var aWs = this._getCurrentWS();
            var currentFilter;
            var numFilter;
            var curIndex = index.split(":");
            var opFil;
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
                    currentFilter.AutoFilter = {};
                }
                if (!currentFilter.AutoFilter.FilterColumns) {
                    currentFilter.AutoFilter.FilterColumns = [];
                }
                opFil = currentFilter.AutoFilter.FilterColumns;
            }
            var idDigitalFilter = false;
            var min;
            if (opFil) {
                var isFilterCol = false;
                var result = [];
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
                                var cell = ws.model.getCell(new CellAddress(nRow, col, 0));
                                var val = cell.getValueWithFormat();
                                var val2 = cell.getValueWithoutFormat();
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
                                            if (this._dataFilterParse(dataValues[nVal], val2)) {
                                                result[nC].val = val;
                                                result[nC].val2 = val2;
                                                if (result[nC].visible != "hidden") {
                                                    result[nC].visible = true;
                                                }
                                                break;
                                            } else {
                                                result[nC].val = val;
                                                result[nC].val2 = val2;
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
                                            if (this._dataFilterParse(dataValues[nVal], val2)) {
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
                                var cell = ws.model.getCell(new CellAddress(nRow, col, 0));
                                var val = cell.getValueWithFormat();
                                var val2 = cell.getValueWithoutFormat();
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
                                    var cell = ws.model.getCell(new CellAddress(nRow, col, 0));
                                    var val = cell.getValueWithFormat();
                                    var val2 = cell.getValueWithoutFormat();
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
                                        sortTop10 = top10Arr.sort(function sortArr(a, b) {
                                            return b - a;
                                        });
                                    } else {
                                        sortTop10 = top10Arr.sort();
                                    }
                                    var nC = 0;
                                    if (sortTop10.length > top10Filter.Val - 1) {
                                        var limit = sortTop10[top10Filter.Val - 1];
                                        for (nRow = startRow + 1; nRow <= endRow; nRow++) {
                                            var cell = ws.model.getCell(new CellAddress(nRow, col, 0));
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
                    var filterStart = ws.model.getCell(new CellAddress(ref.split(":")[0]));
                    var filterEnd = ws.model.getCell(new CellAddress(ref.split(":")[1]));
                    var cell = ws.model.getCell(new CellAddress(buttonId));
                    var isMerged = cell.hasMerged();
                    if (isMerged) {
                        var range = this._idToRange(buttonId);
                        range.c1 = isMerged.c1;
                        buttonId = this._rangeToId(range);
                    }
                    var col = ws.model.getCell(new CellAddress(buttonId)).first.col - 1;
                    var startRow = filterStart.first.row;
                    var endRow = filterEnd.first.row - 1;
                    var nC = 0;
                    for (var s = startRow; s <= endRow; s++) {
                        var cell = ws.model.getCell(new CellAddress(s, col, 0));
                        if (!result[nC]) {
                            result[nC] = new AutoFiltersOptionsElements();
                        }
                        result[nC].val = cell.getValueWithFormat();
                        result[nC].val2 = cell.getValueWithoutFormat();
                        if (result[nC].visible != "hidden") {
                            result[nC].visible = true;
                        }
                        if (result[nC].visible != "hidden") {
                            if (ws.model._getRow(s).hd) {
                                result[nC].visible = "hidden";
                            }
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
            }
        },
        _addNewFilter: function (val, tableColumns, aWs, isAll, style) {
            if (isAll) {
                if (!aWs.AutoFilter) {
                    aWs.AutoFilter = {
                        result: val,
                        Ref: val[0].id + ":" + val[val.length - 1].idNext
                    };
                }
                var startCol = this._idToRange(val[0].id);
                var endCol = this._idToRange(val[val.length - 1].idNext);
                var row = startCol.r1;
                var cell;
                for (var col = startCol.c1; col <= endCol.c1; col++) {
                    cell = aWs.getCell(new CellAddress(row, col, 0));
                    var isMerged = cell.hasMerged();
                    if (isMerged && isMerged.c2 != col) {
                        if (!aWs.AutoFilter.FilterColumns) {
                            aWs.AutoFilter.FilterColumns = [];
                        }
                        aWs.AutoFilter.FilterColumns[aWs.AutoFilter.FilterColumns.length] = {
                            ColId: col - startCol.c1,
                            ShowButton: false
                        };
                        aWs.AutoFilter.result[col - startCol.c1].showButton = false;
                    }
                }
                return aWs.AutoFilter;
            } else {
                if (!aWs.TableParts) {
                    aWs.TableParts = [];
                }
                var ref = val[0].id + ":" + val[val.length - 1].idNext;
                aWs.TableParts[aWs.TableParts.length] = {
                    result: val,
                    Ref: ref,
                    AutoFilter: {
                        Ref: ref
                    },
                    TableStyleInfo: {
                        Name: style,
                        ShowColumnStripes: false,
                        ShowFirstColumn: false,
                        ShowLastColumn: false,
                        ShowRowStripes: true
                    },
                    TableColumns: tableColumns,
                    DisplayName: aWs.workbook.oNameGenerator.getNextTableName(aWs, ref)
                };
                return aWs.TableParts[aWs.TableParts.length - 1];
            }
        },
        _idToRange: function (id) {
            var cell = new CellAddress(id);
            var range = {
                r1: cell.row - 1,
                c1: cell.col - 1,
                r2: cell.row - 1,
                c2: cell.col - 1
            };
            return range;
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
            var result = {
                ColId: colId,
                CustomFiltersObj: {}
            };
            if (valFilter.filter1 && valFilter.valFilter1 != null && valFilter.valFilter1 != undefined) {
                result.CustomFiltersObj = {};
                result.CustomFiltersObj.CustomFilters = [];
                result.CustomFiltersObj.CustomFilters[0] = {
                    Operator: valFilter.filter1,
                    Val: valFilter.valFilter1
                };
            }
            if (valFilter.filter2 && valFilter.valFilter2 != null && valFilter.valFilter2 != undefined) {
                if (result.CustomFiltersObj.CustomFilters[0]) {
                    result.CustomFiltersObj.CustomFilters[1] = {
                        Operator: valFilter.filter2,
                        Val: valFilter.valFilter2
                    };
                    if (valFilter.isChecked == true) {
                        result.CustomFiltersObj.And = true;
                    }
                } else {
                    result.CustomFiltersObj = {};
                    result.CustomFiltersObj.CustomFilters = [];
                    result.CustomFiltersObj.CustomFilters[0] = {
                        Operator: valFilter.filter2,
                        Val: valFilter.valFilter2
                    };
                }
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
                    var isMerged = ws.model.getCell(new CellAddress(startCell.r1, startCell.c1, 0)).hasMerged();
                    if (isMerged) {
                        startCell.c1 = isMerged.c1;
                    }
                }
                for (var m = startCell.r1 + 1; m <= endCell.r1; m++) {
                    var cell = ws.model.getCell(new CellAddress(m, startCell.c1, 0)).getCells()[0];
                    var val = ws.model.getCell(new CellAddress(m, startCell.c1, 0)).getValue();
                    var type = cell.getType();
                    var valWithFormat = ws.model.getCell(new CellAddress(m, startCell.c1, 0)).getValueWithFormat();
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
                        var isMerged = ws.model.getCell(new CellAddress(startCell.r1, startCell.c1, 0)).hasMerged();
                        if (isMerged) {
                            startCell.c1 = isMerged.c1;
                        }
                    }
                    for (var m = startCell.r1 + 1; m <= endCell.r1; m++) {
                        var val = ws.model.getCell(new CellAddress(m, startCell.c1, 0)).getValue();
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
                            var isMerged = ws.model.getCell(new CellAddress(startCell.r1, startCell.c1, 0)).hasMerged();
                            if (isMerged) {
                                startCell.c1 = isMerged.c1;
                            }
                        }
                        for (var m = startCell.r1 + 1; m <= endCell.r1; m++) {
                            var val = ws.model.getCell(new CellAddress(m, startCell.c1, 0)).getCells()[0].getValue();
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
                    if (buttons[num].hiddenRows[row] && !isCurrenCell) {
                        return "hidden";
                    }
                } else {
                    if (customFil == undefined) {
                        isCurrenCell = false;
                        if (!isCurrenCell && cellId == buttons[num].id) {
                            isCurrenCell = true;
                        }
                        if (buttons[num].hiddenRows[row]) {
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
                if (customFil != undefined && buttons[num].inFilter == customFil) {
                    isCurrenCell = false;
                    if (!isCurrenCell && cellId == buttons[num].id) {
                        isCurrenCell = true;
                    }
                    if (buttons[num].hiddenRows[row] && !isCurrenCell) {
                        return "hidden";
                    }
                } else {
                    if (customFil == undefined && ref == buttons[num].inFilter) {
                        isCurrenCell = false;
                        if (!isCurrenCell && cellId == buttons[num].id) {
                            isCurrenCell = true;
                        }
                        if (buttons[num].hiddenRows[row]) {
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
        _changeFiltersAfterColumn: function (col, val, type, activeCells) {
            History.TurnOff();
            var aWs = this._getCurrentWS();
            var bUndoChanges = this.worksheet.model.workbook.bUndoChanges;
            if (aWs.AutoFilter) {
                var ref = aWs.AutoFilter.Ref.split(":");
                var doNotChangesHeadString = false;
                var options = {
                    ref: ref,
                    val: val,
                    type: type,
                    col: col
                };
                this._changeFilterAfterInsertColumn(options, type, activeCells);
            }
            if (aWs.TableParts && aWs.TableParts.length > 0) {
                var length;
                for (var lT = 0; lT < aWs.TableParts.length; lT++) {
                    var ref = aWs.TableParts[lT].Ref.split(":");
                    var options = {
                        ref: ref,
                        val: val,
                        type: type,
                        col: col,
                        index: lT
                    };
                    length = aWs.TableParts.length;
                    this._changeFilterAfterInsertColumn(options, type, activeCells);
                    if (length > aWs.TableParts.length) {
                        lT--;
                    }
                }
            }
            this._reDrawFilters();
            History.TurnOn();
        },
        _changeFilterAfterInsertColumn: function (options, type, activeCells) {
            var ref = options.ref,
            val = options.val,
            col = options.col,
            index = options.index;
            var range = {};
            var startRange = this._idToRange(ref[0]);
            var endRange = this._idToRange(ref[1]);
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
            if (startRangeCell < colStart && endRangeCell > colEnd) {
                this._editFilterAfterInsertColumn(range, val, col, type, activeCells);
            } else {
                if (startRangeCell <= colStart && endRangeCell >= colEnd) {
                    if (val < 0) {
                        this._editFilterAfterInsertColumn(range, val, col, type, activeCells);
                    } else {
                        if (startRangeCell < colStart) {
                            this._editFilterAfterInsertColumn(range, val, col, type, activeCells);
                        } else {
                            this._editFilterAfterInsertColumn(range, val, undefined, type, activeCells);
                        }
                    }
                } else {
                    if ((colEnd <= startRangeCell && val > 0) || (colEnd < startRangeCell && val < 0)) {
                        this._editFilterAfterInsertColumn(range, val, undefined, type, activeCells);
                    } else {
                        if ((colStart < startRangeCell && colEnd > startRangeCell && colEnd <= endRangeCell) || (colEnd <= startRangeCell && val < 0)) {
                            if (val < 0) {
                                var valNew = startRangeCell - colEnd - 1;
                                var val2 = colStart - startRangeCell;
                                var retVal = this._editFilterAfterInsertColumn(range, valNew, startRangeCell, type);
                                if (!retVal) {
                                    this._editFilterAfterInsertColumn(range, val2, undefined, type, activeCells);
                                }
                            } else {
                                this._editFilterAfterInsertColumn(range, val, undefined, type, activeCells);
                            }
                        } else {
                            if ((colStart >= startRangeCell && colStart <= endRangeCell && colEnd >= endRangeCell) || (colStart >= startRangeCell && colStart <= endRangeCell && colEnd > endRangeCell && val < 0)) {
                                if (val < 0) {
                                    valNew = colStart - endRangeCell - 1;
                                } else {
                                    valNew = val;
                                }
                                this._editFilterAfterInsertColumn(range, valNew, colStart, type, activeCells);
                            } else {
                                if (colStart < startRangeCell && colEnd > endRangeCell) {
                                    if (val < 0) {
                                        var valNew = startRangeCell - endRangeCell - 1;
                                        var colNew = startRangeCell;
                                        this._editFilterAfterInsertColumn(range, valNew, colNew, type, activeCells);
                                    } else {
                                        this._editFilterAfterInsertColumn(range, val, undefined, type, activeCells);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        _editFilterAfterInsertColumn: function (cRange, val, col, type, activeCells) {
            var bUndoChanges = this.worksheet.model.workbook.bUndoChanges;
            var bRedoChanges = this.worksheet.model.workbook.bRedoChanges;
            var ws = this.worksheet;
            var aWs = this._getCurrentWS();
            var filter;
            var filterColums;
            var buttons = this.allButtonAF;
            if (cRange.index == "all") {
                filter = aWs.AutoFilter;
                filterColums = filter.FilterColumns;
            } else {
                filter = aWs.TableParts[cRange.index];
                if (filter.AutoFilter) {
                    filterColums = filter.AutoFilter.FilterColumns;
                }
            }
            var oldFilter = Asc.clone(filter);
            if (val < 0) {
                var activeRange = ws.activeRange;
                if (activeCells && typeof activeCells == "object") {
                    activeRange = Asc.Range(activeCells.c1, activeCells.r1, activeCells.c2, activeCells.r2);
                }
                var splitRefFilter = filter.Ref.split(":");
                var startCell = this._idToRange(splitRefFilter[0]);
                var endCell = this._idToRange(splitRefFilter[1]);
                var isDelFilter = false;
                if (activeRange.contains(startCell.c1, startCell.r1) && activeRange.contains(startCell.c1, endCell.r1) && activeRange.contains(endCell.c1, startCell.r1) && activeRange.contains(endCell.c1, endCell.r1)) {
                    isDelFilter = true;
                } else {
                    if (type == "insRow" && activeRange.r1 == startCell.r1 && activeRange.r2 == endCell.r1 && activeRange.c1 >= startCell.c1 && activeRange.c2 <= endCell.c1) {
                        isDelFilter = true;
                    } else {
                        if (type != "insRow" && activeRange.c1 == startCell.c1 && activeRange.c2 == endCell.c1 && activeRange.r1 >= startCell.r1 && activeRange.r2 <= endCell.r1) {
                            isDelFilter = true;
                        }
                    }
                }
                if (isDelFilter) {
                    activeRange = {
                        r1: startCell.r1,
                        c1: startCell.c1,
                        r2: endCell.r1,
                        c2: endCell.c1
                    };
                    this.isEmptyAutoFilters(activeRange, true, true, true);
                    return true;
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
                filter.Ref = this._rangeToId(cRange.start) + ":" + this._rangeToId(cRange.end);
                if (filter.result && filter.result.length > 0) {
                    var insertIndexes = [];
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
                        if (buttons && buttons.length) {
                            for (var b = 0; b < buttons.length; b++) {
                                if (buttons[b].id == curFilter.id && !insertIndexes[b]) {
                                    buttons[b].inFilter = filter.Ref;
                                    buttons[b].id = id;
                                    buttons[b].idNext = nextId;
                                    insertIndexes[b] = true;
                                    break;
                                }
                            }
                        }
                        curFilter.inFilter = filter.Ref;
                        curFilter.id = id;
                        curFilter.idNext = nextId;
                    }
                }
                filter.Ref = this._rangeToId(cRange.start) + ":" + this._rangeToId(cRange.end);
            } else {
                if (type == "insRow") {
                    cRange.end.r1 = cRange.end.r1 + val;
                } else {
                    cRange.end.c1 = cRange.end.c1 + val;
                }
                var inFilter = this._rangeToId(cRange.start) + ":" + this._rangeToId(cRange.end);
                var cloneFilterColums = Asc.clone(filterColums);
                if (filter.result && filter.result.length > 0) {
                    var changeNum = [];
                    var newResult = [];
                    var n = 0;
                    var isChangeColumn = false;
                    var insertIndexes = [];
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
                                newResult[n] = {
                                    x: curFilter.x,
                                    y: curFilter.y,
                                    width: curFilter.width,
                                    height: curFilter.height,
                                    id: id,
                                    idNext: nextId
                                };
                                newResult[n].hiddenRows = [];
                                var num = 1;
                                this._changeContentButton(newResult[n], num, "add", inFilter);
                                n++;
                            }
                            if (val < 0) {
                                this._changeContentButton(curFilter, Math.abs(val), "del", inFilter);
                                if (filterColums) {
                                    for (var zF = filR; zF < filR + Math.abs(val); zF++) {
                                        for (var s = 0; s < cloneFilterColums.length; s++) {
                                            if (zF == cloneFilterColums[s].ColId) {
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
                        }
                    }
                    if (cloneFilterColums) {
                        if (cRange.index == "all") {
                            filter.FilterColumns = cloneFilterColums;
                            filter.Ref = inFilter;
                        } else {
                            if (filter.AutoFilter) {
                                filter.AutoFilter.FilterColumns = cloneFilterColums;
                            }
                            filter.AutoFilter.Ref = inFilter;
                        }
                    }
                    if (filter.TableColumns && type != "insRow") {
                        var newTableColumn = [];
                        var startCell = col - this._idToRange(inFilter.split(":")[0]).c1;
                        var isN = 0;
                        if (newResult.length < filter.TableColumns.length) {
                            filter.TableColumns.splice(startCell, filter.TableColumns.length - newResult.length);
                        } else {
                            for (var l = 0; l < newResult.length; l++) {
                                var columnValue = filter.TableColumns[isN].Name;
                                if (startCell == l) {
                                    for (var s = 0; s < val; s++) {
                                        var range2 = this._idToRange(newResult[0].id);
                                        if (s != 0) {
                                            l = l + 1;
                                        }
                                        var tempArray = newTableColumn.concat(filter.TableColumns);
                                        var newNameColumn = this._generateColumnName(tempArray, startCell - 1);
                                        newTableColumn[l] = {
                                            Name: newNameColumn
                                        };
                                        ws.model.getCell(new CellAddress(range2.r1, range2.c1 + l, 0)).setValue(newNameColumn);
                                    }
                                } else {
                                    newTableColumn[l] = {
                                        Name: columnValue
                                    };
                                    isN++;
                                }
                            }
                            filter.TableColumns = newTableColumn;
                        }
                    }
                    filter.result = newResult;
                    filter.Ref = inFilter;
                    if (val > 0) {
                        this._addButtonAF(newResult);
                    }
                }
                if (!bUndoChanges && !bRedoChanges && val < 0) {
                    History.TurnOn();
                    History.StartTransaction();
                    var changeElement = {
                        oldFilter: oldFilter
                    };
                    this._addHistoryObj(changeElement, null, null, true);
                    History.EndTransaction();
                }
            }
        },
        _changeContentButton: function (array, val, type, inFilter) {
            var ws = this.worksheet;
            var buttons = this.allButtonAF;
            if (type == "add") {
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
                                    var isHidden = ws.model._getRow(rez + cells.r1 + 1).hd;
                                    if (result[rez].visible == false && isHidden) {
                                        ws.model.setRowHidden(false, rez + cells.r1 + 1, rez + cells.r1 + 1);
                                    }
                                }
                            }
                            buttons.splice(but, 1);
                            break;
                        }
                    }
                }
            }
        },
        _reDrawFilters: function (turnOffHistory) {
            if (turnOffHistory) {
                History.TurnOff();
            }
            var ws = this.worksheet;
            var aWs = this._getCurrentWS();
            if (aWs.TableParts && aWs.TableParts.length > 0) {
                for (var tP = 0; tP < aWs.TableParts.length; tP++) {
                    var ref = aWs.TableParts[tP].Ref.split(":");
                    this._setColorStyleTable(ref[0], ref[1], aWs.TableParts[tP]);
                }
            }
            ws._updateCellsRange(ws.visibleRange, c_oAscCanChangeColWidth.none);
            if (turnOffHistory) {
                History.TurnOn();
            }
        },
        _sortArrayMinMax: function (elements) {
            elements.sort(function sortArr(a, b) {
                return a["val2"] - b["val2"];
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
        _setStyleForTextInTable: function (range, style) {
            if (!style) {
                return;
            }
            range.setFontname(style.fn);
            range.setFontsize(style.fs);
            range.setBold(style.b);
            range.setItalic(style.i);
            range.setUnderline(style.u);
            range.setStrikeout(style.s);
            range.setFontcolor(style.c);
        },
        _drawSmallIconTable: function (canvas, style, tableParts) {
            var ws = this.worksheet;
            var ctx = canvas.getContext("2d");
            if (style == undefined) {
                style = "TableStyleLight1";
            }
            if (typeof style == "object") {
                styleOptions = style;
            } else {
                styleOptions = ws.model.workbook.TableStyles.AllStyles[style];
            }
            var styleInfo = false;
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
            var ySize = 46;
            var xSize = 61;
            var stepY = ySize / 5;
            var stepX = xSize / 5;
            var defaultColorBackground;
            if (styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill) {
                defaultColorBackground = Asc.parseColor(styleOptions.wholeTable.dxf.fill.getRgbOrNull()).color;
            } else {
                defaultColorBackground = "#FFFFFF";
            }
            if (styleOptions != undefined) {
                if (styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill) {
                    ctx.fillStyle = "white";
                    ctx.fillRect(0, 0, xSize, ySize);
                } else {
                    ctx.fillStyle = "white";
                    ctx.fillRect(0, 0, xSize, ySize);
                }
                if (styleInfo.ShowColumnStripes) {
                    for (k = 0; k < 6; k++) {
                        var color = defaultColorBackground;
                        if ((k) % 2 == 0) {
                            if (styleOptions.firstColumnStripe && styleOptions.firstColumnStripe.dxf.fill) {
                                color = Asc.parseColor(styleOptions.firstColumnStripe.dxf.fill.bg).color;
                            } else {
                                if (styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill) {
                                    color = Asc.parseColor(styleOptions.wholeTable.dxf.fill.bg).color;
                                }
                            }
                        } else {
                            if (styleOptions.secondColumnStripe && styleOptions.secondColumnStripe.dxf.fill) {
                                color = Asc.parseColor(styleOptions.secondColumnStripe.dxf.fill.bg).color;
                            } else {
                                if (styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill) {
                                    color = Asc.parseColor(styleOptions.wholeTable.dxf.fill.bg).color;
                                }
                            }
                        }
                        ctx.fillStyle = color;
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
                                if (styleOptions.firstRowStripe && styleOptions.firstRowStripe.dxf.fill) {
                                    color = Asc.parseColor(styleOptions.firstRowStripe.dxf.fill.getRgbOrNull()).color;
                                }
                            } else {
                                if (styleOptions.secondRowStripe && styleOptions.secondRowStripe.dxf.fill) {
                                    color = Asc.parseColor(styleOptions.secondRowStripe.dxf.fill.getRgbOrNull()).color;
                                } else {
                                    if (styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill) {
                                        color = Asc.parseColor(styleOptions.wholeTable.dxf.fill.getRgbOrNull()).color;
                                    }
                                }
                            }
                            if (color != null) {
                                ctx.fillStyle = color;
                                if (k == 1) {
                                    ctx.fillRect(0, Math.floor(k * stepY) + 1, xSize, stepY);
                                } else {
                                    if (k == 3) {
                                        ctx.fillRect(0, Math.floor(k * stepY), xSize, Math.floor(stepY));
                                    } else {
                                        ctx.fillRect(0, k * stepY, xSize, stepY);
                                    }
                                }
                            }
                        } else {
                            var color = null;
                            if ((k + 1) % 2 != 0) {
                                if (styleOptions.firstRowStripe && styleOptions.firstRowStripe.dxf.fill) {
                                    color = Asc.parseColor(styleOptions.firstRowStripe.dxf.fill.getRgbOrNull()).color;
                                }
                            } else {
                                if (styleOptions.secondRowStripe && styleOptions.secondRowStripe.dxf.fill) {
                                    color = Asc.parseColor(styleOptions.secondRowStripe.dxf.fill.getRgbOrNull()).color;
                                } else {
                                    if (styleOptions.wholeTable && styleOptions.wholeTable.dxf.fill) {
                                        color = Asc.parseColor(styleOptions.wholeTable.dxf.fill.getRgbOrNull()).color;
                                    }
                                }
                            }
                            if (color != null) {
                                ctx.fillStyle = color;
                                ctx.fillRect(0, Math.floor(k * stepY), xSize, stepY);
                            }
                        }
                    }
                }
                if (styleInfo.ShowFirstColumn && styleOptions.firstColumn) {
                    if (styleOptions.firstColumn && styleOptions.firstColumn.dxf.fill) {
                        ctx.fillStyle = Asc.parseColor(styleOptions.firstColumn.dxf.fill.getRgbOrNull()).color;
                    } else {
                        ctx.fillStyle = defaultColorBackground;
                    }
                    ctx.fillRect(0, 0, stepX, ySize);
                }
                if (styleInfo.ShowLastColumn) {
                    var color = null;
                    if (styleOptions.lastColumn && styleOptions.lastColumn.dxf.fill) {
                        color = Asc.parseColor(styleOptions.lastColumn.dxf.fill.getRgbOrNull()).color;
                    }
                    if (color != null) {
                        ctx.fillStyle = color;
                        ctx.fillRect(4 * stepX, 0, stepX, ySize);
                    }
                }
                if (styleOptions) {
                    if (styleOptions.headerRow && styleOptions.headerRow.dxf.fill) {
                        ctx.fillStyle = Asc.parseColor(styleOptions.headerRow.dxf.fill.getRgbOrNull()).color;
                    } else {
                        ctx.fillStyle = defaultColorBackground;
                    }
                    ctx.fillRect(0, 0, xSize, Math.ceil(stepY));
                }
                if (styleInfo.TotalsRowCount) {
                    var color = null;
                    if (styleOptions.totalRow && styleOptions.totalRow.dxf.fill) {
                        color = Asc.parseColor(styleOptions.totalRow.dxf.fill.getRgbOrNull()).color;
                    } else {
                        color = defaultColorBackground;
                    }
                    ctx.fillStyle = color;
                    ctx.fillRect(0, Math.floor(stepY * 4), xSize, Math.floor(stepY) + 1);
                }
                if (styleOptions.firstHeaderCell && styleInfo.ShowFirstColumn) {
                    if (styleOptions.firstHeaderCell && styleOptions.firstHeaderCell.dxf.fill) {
                        ctx.fillStyle = Asc.parseColor(styleOptions.firstHeaderCell.dxf.fill.getRgbOrNull()).color;
                    } else {
                        ctx.fillStyle = defaultColorBackground;
                    }
                    ctx.fillRect(0, 0, stepX, stepY);
                }
                if (styleOptions.lastHeaderCell && styleInfo.ShowLastColumn) {
                    if (styleOptions.lastHeaderCell && styleOptions.lastHeaderCell.dxf.fill) {
                        ctx.fillStyle = Asc.parseColor(styleOptions.lastHeaderCell.dxf.fill.getRgbOrNull()).color;
                    } else {
                        ctx.fillStyle = defaultColorBackground;
                    }
                    ctx.fillRect(4 * stepX, 0, stepX, stepY);
                }
                if (styleOptions.firstTotalCell && styleInfo.TotalsRowCount && styleInfo.ShowFirstColumn) {
                    if (styleOptions.firstTotalCell && styleOptions.firstTotalCell.dxf.fill) {
                        ctx.fillStyle = Asc.parseColor(styleOptions.firstTotalCell.dxf.fill.getRgbOrNull()).color;
                    } else {
                        ctx.fillStyle = defaultColorBackground;
                    }
                    ctx.fillRect(0, 4 * stepY, stepX, stepY);
                }
                if (styleOptions.lastTotalCell && styleInfo.TotalsRowCount && styleInfo.ShowLastColumn) {
                    if (styleOptions.lastTotalCell && styleOptions.lastTotalCell.dxf.fill) {
                        ctx.fillStyle = Asc.parseColor(styleOptions.lastTotalCell.dxf.fill.getRgbOrNull()).color;
                    } else {
                        ctx.fillStyle = defaultColorBackground;
                    }
                    ctx.fillRect(4 * stepX, 4 * stepY, stepX, ySize);
                }
            } else {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, xSize, ySize);
            }
            if (styleOptions != undefined) {
                ctx.lineWidth = 1;
                ctx.beginPath();
                if (styleOptions.wholeTable && styleOptions.wholeTable.dxf.border) {
                    var borders = styleOptions.wholeTable.dxf.border;
                    if (borders.t.s !== c_oAscBorderStyles.None) {
                        ctx.strokeStyle = Asc.parseColor(borders.t.getRgbOrNull()).color;
                        ctx.moveTo(0.5, 0.5);
                        ctx.lineTo(Math.floor(xSize) + 0.5, 0.5);
                    }
                    if (borders.b.s !== c_oAscBorderStyles.None) {
                        ctx.strokeStyle = Asc.parseColor(borders.b.getRgbOrNull()).color;
                        ctx.moveTo(0, Math.floor(ySize) - 0.5);
                        ctx.lineTo(Math.floor(xSize) + 0.5, Math.floor(ySize) - 0.5);
                    }
                    if (borders.l.s !== c_oAscBorderStyles.None) {
                        ctx.strokeStyle = Asc.parseColor(borders.l.getRgbOrNull()).color;
                        ctx.moveTo(0.5, 0.5);
                        ctx.lineTo(0.5, Math.floor(ySize) + 0.5);
                    }
                    if (borders.r.s !== c_oAscBorderStyles.None) {
                        ctx.strokeStyle = Asc.parseColor(borders.r.getRgbOrNull()).color;
                        ctx.moveTo(Math.floor(xSize) - 0.5, 0.5);
                        ctx.lineTo(Math.floor(xSize) - 0.5, Math.floor(ySize) + 0.5);
                    }
                    if (borders.ih.s !== c_oAscBorderStyles.None) {
                        ctx.strokeStyle = Asc.parseColor(borders.ih.getRgbOrNull()).color;
                        for (var n = 1; n < 5; n++) {
                            ctx.moveTo(0.5, Math.floor(stepY * n) + 0.5);
                            ctx.lineTo(Math.floor(xSize) + 0.5, Math.floor(stepY * n) + 0.5);
                        }
                        ctx.stroke();
                    }
                    if (borders.iv.s !== c_oAscBorderStyles.None) {
                        ctx.strokeStyle = Asc.parseColor(borders.iv.getRgbOrNull()).color;
                        for (var n = 1; n < 5; n++) {
                            ctx.moveTo(Math.floor(stepX * n) + 0.5, 0.5);
                            ctx.lineTo(Math.floor(stepX * n) + 0.5, Math.floor(ySize) + 0.5);
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
                            ctx.moveTo(0, Math.floor(stepY * n) + 0.5);
                            ctx.lineTo(xSize, Math.floor(stepY * n) + 0.5);
                        }
                        ctx.stroke();
                    }
                }
                if (styleOptions.totalRow && styleInfo.TotalsRowCount && styleOptions.totalRow.dxf.border) {
                    var border = styleOptions.totalRow.dxf.border;
                    if (border.t.s !== c_oAscBorderStyles.None) {
                        ctx.strokeStyle = Asc.parseColor(border.t.getRgbOrNull()).color;
                        ctx.moveTo(xSize, 0.5);
                        ctx.lineTo(xSize, Math.floor(ySize) + 0.5);
                    }
                }
                if (styleOptions.headerRow && styleOptions.headerRow.dxf.border) {
                    var border = styleOptions.headerRow.dxf.border;
                    if (border.t.s !== c_oAscBorderStyles.None) {
                        ctx.strokeStyle = Asc.parseColor(border.t.getRgbOrNull()).color;
                        ctx.moveTo(0, 0.5);
                        ctx.lineTo(xSize, 0.5);
                    }
                    if (border.b.s !== c_oAscBorderStyles.None) {
                        ctx.strokeStyle = Asc.parseColor(border.b.getRgbOrNull()).color;
                        ctx.moveTo(0, Math.floor(stepY) + 0.5);
                        ctx.lineTo(xSize, Math.floor(stepY) + 0.5);
                    }
                    ctx.stroke();
                }
                ctx.closePath();
            }
            var defaultColor;
            if (!styleOptions || !styleOptions.wholeTable || !styleOptions.wholeTable.dxf.font) {
                defaultColor = 0;
            } else {
                defaultColor = styleOptions.wholeTable.dxf.font.getRgbOrNull();
            }
            for (n = 1; n < 6; n++) {
                ctx.beginPath();
                var color = null;
                if (n == 1 && styleOptions && styleOptions.headerRow && styleOptions.headerRow.dxf.font) {
                    color = styleOptions.headerRow.dxf.font.getRgbOrNull();
                } else {
                    if (n == 5 && styleOptions && styleOptions.totalRow && styleOptions.totalRow.dxf.font) {
                        color = styleOptions.totalRow.dxf.font.getRgbOrNull();
                    } else {
                        if (styleOptions && styleOptions.headerRow && styleInfo.ShowRowStripes) {
                            if ((n == 2 || (n == 5 && !styleOptions.totalRow)) && styleOptions.firstRowStripe && styleOptions.firstRowStripe.dxf.font) {
                                color = styleOptions.firstRowStripe.dxf.font.getRgbOrNull();
                            } else {
                                if (n == 3 && styleOptions.secondRowStripe && styleOptions.secondRowStripe.dxf.font) {
                                    color = styleOptions.secondRowStripe.dxf.font.getRgbOrNull();
                                } else {
                                    color = defaultColor;
                                }
                            }
                        } else {
                            if (styleOptions && !styleOptions.headerRow && styleInfo.ShowRowStripes) {
                                if ((n == 1 || n == 3 || (n == 5 && !styleOptions.totalRow)) && styleOptions.firstRowStripe && styleOptions.firstRowStripe.dxf.font) {
                                    color = styleOptions.firstRowStripe.dxf.font.getRgbOrNull();
                                } else {
                                    if ((n == 2 || n == 4) && styleOptions.secondRowStripe && styleOptions.secondRowStripe.dxf.font) {
                                        color = styleOptions.secondRowStripe.dxf.font.getRgbOrNull();
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
                ctx.strokeStyle = Asc.parseColor(color).color;
                var k = 0;
                var strY = Math.floor(n * stepY - stepY / 2) + 0.5;
                while (k < 6) {
                    ctx.moveTo(Math.floor(k * stepX) + 3, strY);
                    ctx.lineTo(Math.floor(k * stepX) + 10, strY);
                    k++;
                }
                ctx.stroke();
                ctx.closePath();
            }
            var result = canvas.toDataURL();
            return result;
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
        _cloneArray: function (array) {
            if (!array) {
                return array;
            }
            var newArr = [];
            for (var i = 0; i < array.length; i++) {
                newArr[i] = array[i];
            }
            return newArr;
        },
        _cloneAutoFilter: function (obj) {
            if (!obj) {
                return obj;
            }
            var newObj = {
                Ref: obj.Ref,
                result: obj.result ? this._cloneArray(obj.result) : null,
                TableColumns: obj.TableColumns ? obj.TableColumns : null,
                FilterColumns: obj.FilterColumns ? obj.FilterColumns : null,
                DisplayName: obj.DisplayName ? obj.DisplayName : null,
                TableStyleInfo: obj.TableStyleInfo ? obj.TableStyleInfo : null,
                AutoFilter: obj.AutoFilter ? obj.AutoFilter : null,
                SortState: obj.SortState ? obj.SortState : null
            };
            return newObj;
        },
        _removeTableByName: function (name) {
            var ws = this.worksheet;
            if (undefined === name) {
                delete ws.AutoFilter;
                return;
            }
            var oTables = ws.TableParts;
            if (!oTables) {
                return;
            }
            var i = 0;
            for (; i < oTables.length; ++i) {
                if (name === oTables[i].DisplayName) {
                    oTables.splice(i, 1);
                    return;
                }
            }
        },
        _addHistoryObj: function (oldObj, type, redoObject, deleteFilterAfterDeleteColRow) {
            var ws = this.worksheet;
            var oHistoryObject = new UndoRedoData_AutoFilter();
            oHistoryObject.undo = oldObj;
            if (redoObject) {
                oHistoryObject.activeCells = Asc.clone(redoObject.activeCells);
                oHistoryObject.lTable = redoObject.lTable;
                oHistoryObject.type = redoObject.type;
                oHistoryObject.cellId = redoObject.cellId;
                oHistoryObject.autoFiltersObject = redoObject.autoFiltersObject;
                oHistoryObject.addFormatTableOptionsObj = redoObject.addFormatTableOptionsObj;
                oHistoryObject.moveFrom = redoObject.arnFrom;
                oHistoryObject.moveTo = redoObject.arnTo;
            } else {
                oHistoryObject.activeCells = Asc.clone(ws.activeRange);
                type = null;
            }
            History.Add(g_oUndoRedoAutoFilters, type, ws.model.getId(), null, oHistoryObject);
            if (deleteFilterAfterDeleteColRow) {
                History.ChangeActionsEndToStart();
            }
        },
        _isAddNameColumn: function (range) {
            var result = false;
            var ws = this.worksheet;
            if (range.r1 != range.r2) {
                for (var col = range.c1; col <= range.c2; col++) {
                    var valFirst = ws.model.getCell(new CellAddress(range.r1, col, 0));
                    if (valFirst != "") {
                        for (var row = range.r1; row <= range.r1 + 2; row++) {
                            var cell = ws.model.getCell(new CellAddress(row, col, 0));
                            var type = cell.getType();
                            if (type == 1) {
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
            if (result && result[0]) {
                var startRow = this._idToRange(result[0].id).r1;
                var endRow = this._idToRange(result[0].idNext).r1;
                for (var row = startRow; row <= endRow; row++) {
                    if (ws.model._getRow(row).hd) {
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
                            if (arrHiddens[row] != undefined && arrHiddens[row] == true && !ws.model._getRow(row).hd) {
                                ws.model.setRowHidden(true, row, row);
                            }
                        }
                    }
                }
            }
            if (tableParts) {
                var aWs = this._getCurrentWS();
                var ref = tableParts.Ref.split(":");
                this._setColorStyleTable(ref[0], ref[1], tableParts);
            }
        },
        _getAscRange: function (bbox, rowAdd) {
            if (!rowAdd) {
                rowAdd = 0;
            }
            return Asc.Range(bbox.c1, bbox.r1, bbox.c2, bbox.r2 + rowAdd);
        },
        _rangeHitInAnRange: function (range, tableRange) {
            for (var r = range.r1; r <= range.r2; r++) {
                for (var c = range.c1; c <= range.c2; c++) {
                    if (tableRange.r1 <= r && tableRange.r2 >= r && tableRange.c1 <= c && tableRange.c2 >= c) {
                        return true;
                    }
                }
            }
            return false;
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
                if (nameStart[1] && nameEnd[1] && !isNaN(parseInt(nameStart[1])) && !isNaN(parseInt(nameEnd[1])) && ((parseInt(nameStart[1]) + 1) == parseInt(nameEnd[1]))) {
                    isSequence = true;
                }
            }
            if (indexInsertColumn == undefined || !isSequence) {
                var name;
                for (var i = 0; i < tableColumns.length; i++) {
                    if (tableColumns[i].Name) {
                        name = tableColumns[i].Name.split("Column");
                    }
                    if (name[1] && !isNaN(parseFloat(name[1])) && index == parseFloat(name[1])) {
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
                if (name[1] && !isNaN(parseFloat(name[1]))) {
                    index = parseFloat(name[1]) + 1;
                }
                for (var i = 0; i < tableColumns.length; i++) {
                    if (tableColumns[i].Name) {
                        name = tableColumns[i].Name.split("Column");
                    }
                    if (name[1] && !isNaN(parseFloat(name[1])) && index == parseFloat(name[1])) {
                        index = parseInt((index - 1) + "2");
                        i = -1;
                    }
                }
                return "Column" + index;
            }
        },
        _generateColumnNameWithoutTitle: function (range, isTurnOffHistory) {
            var ws = this.worksheet;
            var tableColumns = [];
            var cell;
            var val;
            var index;
            for (var col1 = range.c1; col1 <= range.c2; col1++) {
                cell = ws.model.getCell(new CellAddress(range.r1, col1, 0));
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
                tableColumns[col1 - range.c1] = {
                    Name: valNew
                };
            }
            return tableColumns;
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
                    var ref = filter.Ref.split(":");
                    var startRange = this._idToRange(ref[0]);
                    var endRange = this._idToRange(ref[1]);
                    var tableRange = new Asc.Range(startRange.c1, startRange.r1, endRange.c2, startRange.r1);
                    var intersection = range.intersection(tableRange);
                    if (intersection != null) {
                        for (var j = tableRange.c1; j <= tableRange.c2; j++) {
                            cell = ws.model.getCell(new CellAddress(startRange.r1, j, 0));
                            val = cell.getValue();
                            if (val != "" && intersection.c1 <= j && intersection.c2 >= j) {
                                filter.TableColumns[j - tableRange.c1].Name = val;
                            } else {
                                if (val == "") {
                                    generateName = this._generateColumnName(filter.TableColumns);
                                    cell.setValue(generateName);
                                    filter.TableColumns[j - tableRange.c1].Name = generateName;
                                }
                            }
                        }
                    }
                }
            }
        },
        _moveAutoFilters: function (arnTo, arnFrom, data) {
            var ws = this.worksheet;
            var aWs = this._getCurrentWS();
            if (arnTo == null && arnFrom == null && data) {
                arnTo = data.moveFrom ? data.moveFrom : null;
                arnFrom = data.moveTo ? data.moveTo : null;
                data = data.undo;
                if (arnTo == null || arnFrom == null) {
                    return;
                }
            }
            var findFilters = this._searchFiltersInRange(arnFrom, aWs);
            if (findFilters) {
                var diffCol = arnTo.c1 - arnFrom.c1;
                var diffRow = arnTo.r1 - arnFrom.r1;
                var ref;
                var parseRef;
                var range;
                var newRange;
                var newRef;
                var oCurFilter;
                for (var i = 0; i < findFilters.length; i++) {
                    if (!oCurFilter) {
                        oCurFilter = [];
                    }
                    oCurFilter[i] = Asc.clone(findFilters[i]);
                    ref = findFilters[i].Ref;
                    range = this._refToRange(ref);
                    newRange = Asc.Range(range.c1 + diffCol, range.r1 + diffRow, range.c2 + diffCol, range.r2 + diffRow);
                    newRef = this._rangeToRef(newRange);
                    findFilters[i].Ref = newRef;
                    if (findFilters[i].AutoFilter) {
                        findFilters[i].AutoFilter.Ref = newRef;
                    }
                    if (!data && findFilters[i].AutoFilter && findFilters[i].AutoFilter.FilterColumns) {
                        delete findFilters[i].AutoFilter.FilterColumns;
                    } else {
                        if (!data && findFilters[i] && findFilters[i].FilterColumns) {
                            delete findFilters[i].FilterColumns;
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
                    if (this.allButtonAF) {
                        var buttons = this.allButtonAF;
                        for (var n = 0; n < buttons.length; n++) {
                            var id;
                            var idNext;
                            if (buttons[n].inFilter == ref && findFilters[i] && findFilters[i].result && findFilters[i].result.length) {
                                for (var b = 0; b < findFilters[i].result.length; b++) {
                                    if (buttons[n].id == findFilters[i].result[b].id) {
                                        id = this._shiftId(buttons[n].id, diffCol, diffRow);
                                        idNext = this._shiftId(buttons[n].idNext, diffCol, diffRow);
                                        findFilters[i].result[b].id = id;
                                        findFilters[i].result[b].idNext = idNext;
                                        break;
                                    }
                                }
                                buttons[n].inFilter = newRef;
                                buttons[n].id = id ? id : this._shiftId(buttons[n].id, diffCol, diffRow);
                                buttons[n].idNext = idNext ? idNext : this._shiftId(buttons[n].idNext, diffCol, diffRow);
                            }
                        }
                    }
                    if (!data) {
                        this._addHistoryObj(oCurFilter, historyitem_AutoFilter_Move, {
                            worksheet: ws,
                            arnTo: arnTo,
                            arnFrom: arnFrom,
                            activeCells: ws.activeRange
                        });
                    }
                }
                this._reDrawFilters();
                this.drawAutoF();
            } else {
                if (arnTo) {
                    this.reDrawFilter(arnTo);
                }
                if (arnFrom) {
                    this.reDrawFilter(arnFrom);
                }
            }
        },
        _refToRange: function (ref) {
            if (typeof ref != "string") {
                return false;
            }
            var splitRef = ref.split("!");
            if (splitRef[1]) {
                ref = splitRef[1];
            }
            var parseRef = ref.split(":");
            if (parseRef[0] && parseRef[1]) {
                var startRange = this._idToRange(parseRef[0]);
                var endRange = this._idToRange(parseRef[1]);
                var range = Asc.Range(startRange.c1, startRange.r1, endRange.c1, endRange.r1);
                return range;
            }
            return false;
        },
        _rangeToRef: function (range) {
            if (range) {
                var startId = this._rangeToId({
                    r1: range.r1,
                    c1: range.c1
                });
                var endId = this._rangeToId({
                    r1: range.r2,
                    c1: range.c2
                });
                var ref = startId + ":" + endId;
                return ref;
            }
            return false;
        },
        _addBlankValues: function (aWs) {
            if (aWs.AutoFilter) {
                var filterColumns = aWs.AutoFilter.FilterColumns;
                for (var i = 0; i < filterColumns.length; i++) {
                    var filters = filterColumns[i].Filters;
                    if (filters && filters.Blank == true) {
                        filters.Values[filters.Values.length] = "";
                    }
                }
            }
            if (aWs.TableParts) {
                for (var i = 0; i < aWs.TableParts.length; i++) {
                    if (aWs.TableParts[i].AutoFilter) {
                        var filterColumns = aWs.TableParts[i].AutoFilter.FilterColumns;
                        for (var j = 0; j < filterColumns.length; j++) {
                            var filters = filterColumns[j].Filters;
                            if (filters && filters.Blank == true) {
                                filters.Values[filters.Values.length] = "";
                            }
                        }
                    }
                }
            }
        },
        _isShowButton: function (filterColumns, colId) {
            var result = true;
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
            if (!turnOnProcessingSpecSymbols) {
                return;
            }
            var filters = [autoFiltersOptions.filter1, autoFiltersOptions.filter2];
            var valFilters = [autoFiltersOptions.valFilter1, autoFiltersOptions.valFilter2];
            var result = null;
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
            if (!turnOnProcessingSpecSymbols) {
                return position;
            }
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
            if (!turnOnProcessingSpecSymbols) {
                return result;
            }
            if (filterVal != undefined && filter != undefined && (filterVal.indexOf("?") != -1 || filterVal.indexOf("*") != -1)) {
                var isEqual = false;
                var isStartWithVal = false;
                var isConsist = false;
                var isEndWith = false;
                var endBlockEqual = false;
                var endSpecSymbol;
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
                rangeFilter = this._refToRange(aWs.AutoFilter.Ref);
                if (range.c1 <= rangeFilter.c1 && range.r1 <= rangeFilter.r1 && range.c2 >= rangeFilter.c2 && range.r2 >= rangeFilter.r2) {
                    result[result.length] = aWs.AutoFilter;
                }
            }
            if (aWs.TableParts) {
                for (var k = 0; k < aWs.TableParts.length; k++) {
                    if (aWs.TableParts[k]) {
                        rangeFilter = this._refToRange(aWs.TableParts[k].Ref);
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
        _preMoveAutoFilters: function (arnFrom) {
            var aWs = this._getCurrentWS();
            var findFilters = this._searchFiltersInRange(arnFrom, aWs);
            if (findFilters) {
                for (var i = 0; i < findFilters.length; i++) {
                    this._openHiddenRows(findFilters[i]);
                }
            }
            this._reDrawFilters();
        },
        _openHiddenRows: function (filter) {
            var ws = this.worksheet;
            if (filter && this.allButtonAF) {
                var buttons = this.allButtonAF;
                for (var n = 0; n < buttons.length; n++) {
                    if (((filter.AutoFilter && buttons[n].inFilter == filter.AutoFilter.Ref) || buttons[n].inFilter == filter.Ref) && buttons[n].hiddenRows.length) {
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
        _isEmptyRange: function (activeCells, isAllAutoFilter) {
            var ws = this.worksheet;
            if (isAllAutoFilter && activeCells.r1 == activeCells.r2 && activeCells.c1 == activeCells.c2) {
                for (var n = activeCells.r1 - 1; n <= activeCells.r2 + 1; n++) {
                    if (n < 0) {
                        n = 0;
                    }
                    for (var k = activeCells.c1 - 1; k <= activeCells.c2 + 1; k++) {
                        if (k < 0) {
                            k = 0;
                        }
                        cell = ws.model._getCell(n, k);
                        if (cell.getValueWithoutFormat() != "") {
                            return false;
                        }
                    }
                }
            } else {
                for (var n = activeCells.r1; n <= activeCells.r2; n++) {
                    for (var k = activeCells.c1; k <= activeCells.c2; k++) {
                        cell = ws.model._getCell(n, k);
                        if (cell.getValueWithoutFormat() != "") {
                            return false;
                        }
                    }
                }
            }
            return true;
        },
        _isNeedDrawButton: function () {
            var ws = this.worksheet;
            var buttons = this.allButtonAF;
            var visibleRange = ws.visibleRange;
            var buttonCell;
            for (var i = 0; i < buttons.length; i++) {
                buttonRange = this._idToRange(buttons[i].id);
                if (buttonRange.r1 >= visibleRange.r1 && buttonRange.r1 <= visibleRange.r2 && buttonRange.c1 >= visibleRange.c1 && buttonRange.c1 <= visibleRange.c2) {
                    return true;
                }
            }
            return false;
        },
        _clearFormatTableStyle: function (range) {
            if (range && typeof range == "object") {
                var ws = this.worksheet;
                for (var i = range.r1; i <= range.r2; i++) {
                    for (var n = range.c1; n <= range.c2; n++) {
                        var cell = ws.model._getCell(i, n);
                        cell.setTableStyle(null);
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