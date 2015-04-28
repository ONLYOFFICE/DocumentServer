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
var historyitem_Unknown = 0;
var historyitem_Workbook_SheetAdd = 1;
var historyitem_Workbook_SheetRemove = 2;
var historyitem_Workbook_SheetMove = 3;
var historyitem_Workbook_SheetPositions = 4;
var historyitem_Workbook_ChangeColorScheme = 5;
var historyitem_Workbook_AddFont = 6;
var historyitem_Worksheet_RemoveCell = 1;
var historyitem_Worksheet_RemoveRows = 2;
var historyitem_Worksheet_RemoveCols = 3;
var historyitem_Worksheet_AddRows = 4;
var historyitem_Worksheet_AddCols = 5;
var historyitem_Worksheet_ShiftCellsLeft = 6;
var historyitem_Worksheet_ShiftCellsTop = 7;
var historyitem_Worksheet_ShiftCellsRight = 8;
var historyitem_Worksheet_ShiftCellsBottom = 9;
var historyitem_Worksheet_ColProp = 10;
var historyitem_Worksheet_RowProp = 11;
var historyitem_Worksheet_Sort = 12;
var historyitem_Worksheet_MoveRange = 13;
var historyitem_Worksheet_Merge = 14;
var historyitem_Worksheet_Unmerge = 15;
var historyitem_Worksheet_SetHyperlink = 16;
var historyitem_Worksheet_RemoveHyperlink = 17;
var historyitem_Worksheet_Rename = 18;
var historyitem_Worksheet_Hide = 19;
var historyitem_Worksheet_CreateRow = 20;
var historyitem_Worksheet_CreateCol = 21;
var historyitem_Worksheet_CreateCell = 22;
var historyitem_Worksheet_SetViewSettings = 23;
var historyitem_Worksheet_RemoveCellFormula = 24;
var historyitem_Worksheet_ChangeMerge = 25;
var historyitem_Worksheet_ChangeHyperlink = 26;
var historyitem_Worksheet_SetTabColor = 27;
var historyitem_Worksheet_ChangeFrozenCell = 30;
var historyitem_RowCol_Fontname = 1;
var historyitem_RowCol_Fontsize = 2;
var historyitem_RowCol_Fontcolor = 3;
var historyitem_RowCol_Bold = 4;
var historyitem_RowCol_Italic = 5;
var historyitem_RowCol_Underline = 6;
var historyitem_RowCol_Strikeout = 7;
var historyitem_RowCol_FontAlign = 8;
var historyitem_RowCol_AlignVertical = 9;
var historyitem_RowCol_AlignHorizontal = 10;
var historyitem_RowCol_Fill = 11;
var historyitem_RowCol_Border = 12;
var historyitem_RowCol_ShrinkToFit = 13;
var historyitem_RowCol_Wrap = 14;
var historyitem_RowCol_NumFormat = 15;
var historyitem_RowCol_SetFont = 16;
var historyitem_RowCol_Angle = 17;
var historyitem_RowCol_SetStyle = 18;
var historyitem_RowCol_SetCellStyle = 19;
var historyitem_Cell_Fontname = 1;
var historyitem_Cell_Fontsize = 2;
var historyitem_Cell_Fontcolor = 3;
var historyitem_Cell_Bold = 4;
var historyitem_Cell_Italic = 5;
var historyitem_Cell_Underline = 6;
var historyitem_Cell_Strikeout = 7;
var historyitem_Cell_FontAlign = 8;
var historyitem_Cell_AlignVertical = 9;
var historyitem_Cell_AlignHorizontal = 10;
var historyitem_Cell_Fill = 11;
var historyitem_Cell_Border = 12;
var historyitem_Cell_ShrinkToFit = 13;
var historyitem_Cell_Wrap = 14;
var historyitem_Cell_Numformat = 15;
var historyitem_Cell_ChangeValue = 16;
var historyitem_Cell_ChangeArrayValueFormat = 17;
var historyitem_Cell_SetStyle = 18;
var historyitem_Cell_SetFont = 19;
var historyitem_Cell_SetQuotePrefix = 20;
var historyitem_Cell_Angle = 21;
var historyitem_Cell_Style = 22;
var historyitem_Comment_Add = 1;
var historyitem_Comment_Remove = 2;
var historyitem_Comment_Change = 3;
var historyitem_AutoFilter_Add = 1;
var historyitem_AutoFilter_Sort = 2;
var historyitem_AutoFilter_Empty = 3;
var historyitem_AutoFilter_ApplyDF = 4;
var historyitem_AutoFilter_ApplyMF = 5;
var historyitem_AutoFilter_Move = 6;
var historyitem_AutoFilter_CleanAutoFilter = 7;
function CHistory(workbook) {
    this.workbook = workbook;
    this.Index = -1;
    this.SavePoint = null;
    this.Points = [];
    this.CurPoint = null;
    this.IsModify = null;
    this.TurnOffHistory = 0;
    this.Transaction = 0;
    this.LocalChange = false;
    this.RecIndex = -1;
    this.lastDrawingObjects = null;
    this.LastState = null;
    this.LoadFonts = {};
    this.HasLoadFonts = false;
    this.SavedIndex = null;
}
CHistory.prototype.Clear = function () {
    this.Index = -1;
    this.SavePoint = null;
    this.Points.length = 0;
    this.CurPoint = null;
    this.IsModify = null;
    this.TurnOffHistory = 0;
    this.Transaction = 0;
    this.LoadFonts = {};
    this.HasLoadFonts = false;
    this.SavedIndex = null;
    this._sendCanUndoRedo();
};
CHistory.prototype.Can_Undo = function () {
    return ((null != this.CurPoint && this.CurPoint.Items.length > 0) || this.Index >= 0);
};
CHistory.prototype.Can_Redo = function () {
    return ((null == this.CurPoint || 0 == this.CurPoint.Items.length) && this.Points.length > 0 && this.Index < this.Points.length - 1);
};
CHistory.prototype.Undo = function () {
    if (true != this.Can_Undo()) {
        return;
    }
    if (this.Index === this.Points.length - 1) {
        this.LastState = this.workbook.handlers.trigger("getSelectionState");
    }
    this._checkCurPoint();
    var Point = this.Points[this.Index--];
    var oRedoObjectParam = new Asc.RedoObjectParam();
    this.UndoRedoPrepare(oRedoObjectParam, true);
    for (var Index = Point.Items.length - 1; Index >= 0; Index--) {
        var Item = Point.Items[Index];
        if (!Item.Class.Read_FromBinary2) {
            Item.Class.Undo(Item.Type, Item.Data, Item.SheetId);
        } else {
            Item.Class.Undo(Item.Data);
        }
        this._addRedoObjectParam(oRedoObjectParam, Item);
    }
    this.UndoRedoEnd(Point, oRedoObjectParam, true);
};
CHistory.prototype.UndoRedoPrepare = function (oRedoObjectParam, bUndo) {
    if (this.Is_On()) {
        oRedoObjectParam.bIsOn = true;
        this.TurnOff();
    }
    lockDraw(this.workbook);
    if (bUndo) {
        this.workbook.bUndoChanges = true;
    } else {
        this.workbook.bRedoChanges = true;
    }
    if (!window["NATIVE_EDITOR_ENJINE"]) {
        var wsViews = Asc["editor"].wb.wsViews;
        for (var i = 0; i < wsViews.length; ++i) {
            if (wsViews[i] && wsViews[i].objectRender && wsViews[i].objectRender.controller) {
                wsViews[i].objectRender.controller.resetSelection();
            }
            if (wsViews[i] && wsViews[i].isChartAreaEditMode) {
                wsViews[i].isChartAreaEditMode = false;
                wsViews[i].arrActiveChartsRanges = [];
            }
        }
    }
};
CHistory.prototype.RedoAdd = function (oRedoObjectParam, Class, Type, sheetid, range, Data, LocalChange) {
    var bNeedOff = false;
    if (false == this.Is_On()) {
        this.TurnOn();
        bNeedOff = true;
    }
    this.Add(Class, Type, sheetid, range, Data, LocalChange);
    if (bNeedOff) {
        this.TurnOff();
    }
    if (Class && !Class.Load_Changes) {
        Class.Redo(Type, Data, sheetid);
    } else {
        if (!Data.isDrawingCollaborativeData) {
            Class.Redo(Data);
        } else {
            Data.oBinaryReader.Seek2(Data.nPos);
            if (!Class) {
                Class = g_oTableId.Get_ById(Data.sChangedObjectId);
                if (Class) {
                    this.Add(Class, Type, sheetid, range, Data, LocalChange);
                }
            }
            if (Class) {
                Class.Load_Changes(Data.oBinaryReader, null, new CDocumentColor(255, 255, 255));
            }
        }
    }
    this._addRedoObjectParam(oRedoObjectParam, this.CurPoint.Items[this.CurPoint.Items.length - 1]);
};
CHistory.prototype.CheckXfrmChanges = function (xfrm) {};
CHistory.prototype.RedoExecute = function (Point, oRedoObjectParam) {
    for (var Index = 0; Index < Point.Items.length; Index++) {
        var Item = Point.Items[Index];
        if (!Item.Class.Load_Changes) {
            Item.Class.Redo(Item.Type, Item.Data, Item.SheetId);
        } else {
            if (!Item.Data.isDrawingCollaborativeData) {
                Item.Class.Redo(Item.Data);
            } else {
                Item.Data.oBinaryReader.Seek(Item.Data.nPos);
                Item.Class.Load_Changes(Item.Data.oBinaryReader, null, new CDocumentColor(255, 255, 255));
            }
        }
        this._addRedoObjectParam(oRedoObjectParam, Item);
    }
    CollaborativeEditing.Apply_LinkData();
    var wsViews = Asc["editor"].wb.wsViews;
    this.Get_RecalcData(Point);
    for (var i = 0; i < wsViews.length; ++i) {
        if (wsViews[i] && wsViews[i].objectRender && wsViews[i].objectRender.controller) {
            wsViews[i].objectRender.controller.recalculate2(undefined);
        }
    }
};
CHistory.prototype.UndoRedoEnd = function (Point, oRedoObjectParam, bUndo) {
    var wsViews, i, oState = null,
    bCoaut = false;
    if (!bUndo && null == Point) {
        this._checkCurPoint();
        Point = this.Points[this.Index];
        CollaborativeEditing.Apply_LinkData();
        bCoaut = true;
        if (!window["NATIVE_EDITOR_ENJINE"]) {
            this.Get_RecalcData(Point);
            wsViews = Asc["editor"].wb.wsViews;
            for (i = 0; i < wsViews.length; ++i) {
                if (wsViews[i] && wsViews[i].objectRender && wsViews[i].objectRender.controller) {
                    wsViews[i].objectRender.controller.recalculate2(true);
                }
            }
        }
    }
    if (null != Point) {
        if (bUndo) {
            gUndoInsDelCellsFlag = true;
        }
        if (oRedoObjectParam.bUpdateWorksheetByModel) {
            this.workbook.handlers.trigger("updateWorksheetByModel");
        }
        if (!bCoaut) {
            oState = bUndo ? Point.SelectionState : ((this.Index === this.Points.length - 1) ? this.LastState : this.Points[this.Index + 1].SelectionState);
        }
        if (this.workbook.bCollaborativeChanges) {
            this.workbook.handlers.trigger("showWorksheet", this.workbook.getActive());
        } else {
            var nSheetId = (null !== oState) ? oState[0].worksheetId : ((this.workbook.bRedoChanges && null != Point.RedoSheetId) ? Point.RedoSheetId : Point.UndoSheetId);
            if (null !== nSheetId) {
                this.workbook.handlers.trigger("showWorksheet", nSheetId);
            }
        }
        for (i in Point.UpdateRigions) {
            this.workbook.handlers.trigger("cleanCellCache", i, {
                "0": Point.UpdateRigions[i]
            },
            false, true, oRedoObjectParam.bAddRemoveRowCol);
        }
        for (i in oRedoObjectParam.oChangeWorksheetUpdate) {
            this.workbook.handlers.trigger("changeWorksheetUpdate", oRedoObjectParam.oChangeWorksheetUpdate[i], {
                lockDraw: true
            });
        }
        if (oRedoObjectParam.bOnSheetsChanged) {
            this.workbook.handlers.trigger("asc_onSheetsChanged");
        }
        for (i in oRedoObjectParam.oOnUpdateTabColor) {
            var curSheet = this.workbook.getWorksheetById(i);
            if (curSheet) {
                this.workbook.handlers.trigger("asc_onUpdateTabColor", curSheet.getIndex());
            }
        }
        if (!window["NATIVE_EDITOR_ENJINE"]) {
            this.Get_RecalcData(Point);
            wsViews = Asc["editor"].wb.wsViews;
            for (i = 0; i < wsViews.length; ++i) {
                if (wsViews[i] && wsViews[i].objectRender && wsViews[i].objectRender.controller) {
                    wsViews[i].objectRender.controller.recalculate2(undefined);
                }
            }
        }
        if (bUndo) {
            if (Point.SelectionState) {
                this.workbook.handlers.trigger("setSelectionState", Point.SelectionState);
            } else {
                this.workbook.handlers.trigger("setSelection", Point.SelectRange.clone(), false);
            }
        } else {
            if (null !== oState && oState[0] && oState[0].focus) {
                this.workbook.handlers.trigger("setSelectionState", oState);
            } else {
                var oSelectRange = null;
                if (null != Point.SelectRangeRedo) {
                    oSelectRange = Point.SelectRangeRedo;
                } else {
                    if (null != Point.SelectRange) {
                        oSelectRange = Point.SelectRange;
                    }
                }
                if (null != oSelectRange) {
                    this.workbook.handlers.trigger("setSelection", oSelectRange.clone());
                }
            }
        }
        if (oRedoObjectParam.oOnUpdateSheetViewSettings[this.workbook.getWorksheet(this.workbook.getActive()).getId()]) {
            this.workbook.handlers.trigger("asc_onUpdateSheetViewSettings");
        }
        this._sendCanUndoRedo();
        if (bUndo) {
            this.workbook.bUndoChanges = false;
        } else {
            this.workbook.bRedoChanges = false;
        }
        if (oRedoObjectParam.bIsReInit) {
            this.workbook.handlers.trigger("reInit");
        }
        this.workbook.handlers.trigger("drawWS");
        if (bUndo) {
            if (isRealObject(this.lastDrawingObjects)) {
                this.lastDrawingObjects.sendGraphicObjectProps();
                this.lastDrawingObjects = null;
            }
        }
    }
    if (!window["NATIVE_EDITOR_ENJINE"]) {
        var wsView = window["Asc"]["editor"].wb.getWorksheet();
        if (wsView && wsView.objectRender && wsView.objectRender.controller) {
            wsView.objectRender.controller.updateOverlay();
        }
    }
    buildRecalc(this.workbook);
    unLockDraw(this.workbook);
    if (oRedoObjectParam.bIsOn) {
        this.TurnOn();
    }
};
CHistory.prototype.Redo = function () {
    if (true != this.Can_Redo()) {
        return;
    }
    var oRedoObjectParam = new Asc.RedoObjectParam();
    this.UndoRedoPrepare(oRedoObjectParam, false);
    this.CurPoint = null;
    var Point = this.Points[++this.Index];
    this.RedoExecute(Point, oRedoObjectParam);
    this.UndoRedoEnd(Point, oRedoObjectParam, false);
};
CHistory.prototype._addRedoObjectParam = function (oRedoObjectParam, Point) {
    if (g_oUndoRedoWorksheet === Point.Class && historyitem_Worksheet_SetViewSettings === Point.Type) {
        oRedoObjectParam.bIsReInit = true;
        oRedoObjectParam.oOnUpdateSheetViewSettings[Point.SheetId] = Point.SheetId;
    } else {
        if (g_oUndoRedoWorksheet === Point.Class && (historyitem_Worksheet_RowProp == Point.Type || historyitem_Worksheet_ColProp == Point.Type)) {
            oRedoObjectParam.oChangeWorksheetUpdate[Point.SheetId] = Point.SheetId;
        } else {
            if (g_oUndoRedoWorkbook === Point.Class && (historyitem_Workbook_SheetAdd === Point.Type || historyitem_Workbook_SheetRemove === Point.Type || historyitem_Workbook_SheetMove === Point.Type || historyitem_Workbook_SheetPositions === Point.Type)) {
                oRedoObjectParam.bUpdateWorksheetByModel = true;
                oRedoObjectParam.bOnSheetsChanged = true;
            } else {
                if (g_oUndoRedoWorksheet === Point.Class && (historyitem_Worksheet_Rename === Point.Type || historyitem_Worksheet_Hide === Point.Type)) {
                    oRedoObjectParam.bOnSheetsChanged = true;
                } else {
                    if (g_oUndoRedoWorksheet === Point.Class && historyitem_Worksheet_SetTabColor === Point.Type) {
                        oRedoObjectParam.oOnUpdateTabColor[Point.SheetId] = Point.SheetId;
                    } else {
                        if (g_oUndoRedoWorksheet === Point.Class && historyitem_Worksheet_ChangeFrozenCell === Point.Type) {
                            oRedoObjectParam.oOnUpdateSheetViewSettings[Point.SheetId] = Point.SheetId;
                        } else {
                            if (g_oUndoRedoWorksheet === Point.Class && (historyitem_Worksheet_RemoveRows === Point.Type || historyitem_Worksheet_RemoveCols === Point.Type || historyitem_Worksheet_AddRows === Point.Type || historyitem_Worksheet_AddCols === Point.Type)) {
                                oRedoObjectParam.bAddRemoveRowCol = true;
                            }
                        }
                    }
                }
            }
        }
    }
};
CHistory.prototype.Get_RecalcData = function (Point2) {
    var Point;
    if (Point2) {
        Point = Point2;
    } else {
        Point = this.CurPoint;
    }
    if (Point) {
        for (var Index = 0; Index < Point.Items.length; Index++) {
            var Item = Point.Items[Index];
            if (Item.Class && Item.Class.Refresh_RecalcData) {
                Item.Class.Refresh_RecalcData(Item.Data);
            }
            if (Item.Type === historyitem_Workbook_ChangeColorScheme) {
                var wsViews = Asc["editor"].wb.wsViews;
                for (var i = 0; i < wsViews.length; ++i) {
                    if (wsViews[i] && wsViews[i].objectRender && wsViews[i].objectRender.controller) {
                        wsViews[i].objectRender.controller.RefreshAfterChangeColorScheme();
                    }
                }
            }
        }
    }
};
CHistory.prototype.Reset_RecalcIndex = function () {
    this.RecIndex = this.Index;
};
CHistory.prototype.Set_Additional_ExtendDocumentToPos = function () {};
CHistory.prototype.Check_UninonLastPoints = function () {
    if (this.Points.length < 2) {
        return;
    }
    var Point1 = this.Points[this.Points.length - 2];
    var Point2 = this.Points[this.Points.length - 1];
    if (Point1.Items.length > 63) {
        return;
    }
    var PrevItem = null;
    var Class = null;
    for (var Index = 0; Index < Point1.Items.length; Index++) {
        var Item = Point1.Items[Index];
        if (null === Class) {
            Class = Item.Class;
        } else {
            if (Class != Item.Class || "undefined" === typeof(Class.Check_HistoryUninon) || false === Class.Check_HistoryUninon(PrevItem.Data, Item.Data)) {
                return;
            }
        }
        PrevItem = Item;
    }
    for (var Index = 0; Index < Point2.Items.length; Index++) {
        var Item = Point2.Items[Index];
        if (Class != Item.Class || "undefined" === typeof(Class.Check_HistoryUninon) || false === Class.Check_HistoryUninon(PrevItem.Data, Item.Data)) {
            return;
        }
        PrevItem = Item;
    }
    var NewPoint = {
        State: Point1.State,
        Items: Point1.Items.concat(Point2.Items),
        Time: Point1.Time,
        Additional: {}
    };
    if (this.SavedIndex >= this.Points.length - 2 && null !== this.SavedIndex) {
        this.SavedIndex = this.Points.length - 3;
    }
    this.Points.splice(this.Points.length - 2, 2, NewPoint);
    if (this.Index >= this.Points.length) {
        var DiffIndex = -this.Index + (this.Points.length - 1);
        this.Index += DiffIndex;
        this.RecIndex += Math.max(-1, this.RecIndex + DiffIndex);
    }
};
CHistory.prototype.Create_NewPoint = function () {
    if (0 !== this.TurnOffHistory || 0 !== this.Transaction) {
        return;
    }
    if (null !== this.SavedIndex && this.Index < this.SavedIndex) {
        this.SavedIndex = this.Index;
    }
    this._checkCurPoint();
    var Items = [];
    var UpdateRigions = {};
    var Time = new Date().getTime();
    var UndoSheetId = null,
    oSelectionState = this.workbook.handlers.trigger("getSelectionState");
    var oSelectRange = this.workbook.handlers.trigger("getSelection");
    var wsActive = this.workbook.getWorksheet(this.workbook.getActive());
    if (wsActive) {
        UndoSheetId = wsActive.getId();
    }
    this.CurPoint = {
        Items: Items,
        UpdateRigions: UpdateRigions,
        UndoSheetId: UndoSheetId,
        RedoSheetId: null,
        SelectRange: oSelectRange,
        SelectRangeRedo: oSelectRange,
        Time: Time,
        SelectionState: oSelectionState
    };
    this._addFonts(true);
};
CHistory.prototype.Add = function (Class, Type, sheetid, range, Data, LocalChange) {
    if (0 !== this.TurnOffHistory) {
        return;
    }
    if (null == this.CurPoint) {
        return;
    }
    var oCurPoint = this.CurPoint;
    var Item;
    if (this.RecIndex >= this.Index) {
        this.RecIndex = this.Index - 1;
    }
    if (Class && !Class.Save_Changes) {
        Item = {
            Class: Class,
            Type: Type,
            SheetId: sheetid,
            Range: null,
            Data: Data,
            LocalChange: this.LocalChange
        };
    } else {
        Item = {
            Class: Class,
            Type: Type.Type,
            SheetId: sheetid,
            Range: null,
            Data: Type,
            LocalChange: this.LocalChange
        };
    }
    if (null != range) {
        Item.Range = range.clone();
    }
    if (null != LocalChange) {
        Item.LocalChange = LocalChange;
    }
    oCurPoint.Items.push(Item);
    if (null != range && null != sheetid) {
        var updateRange = oCurPoint.UpdateRigions[sheetid];
        if (null != updateRange) {
            updateRange.union2(range);
        } else {
            updateRange = range.clone();
        }
        oCurPoint.UpdateRigions[sheetid] = updateRange;
    }
    if (null != sheetid) {
        oCurPoint.UndoSheetId = sheetid;
    }
    if (1 == oCurPoint.Items.length) {
        this._sendCanUndoRedo();
    }
};
CHistory.prototype._sendCanUndoRedo = function () {
    this.workbook.handlers.trigger("setCanUndo", this.Can_Undo());
    this.workbook.handlers.trigger("setCanRedo", this.Can_Redo());
    var IsModify = this.Is_Modified();
    if (this.IsModify != IsModify) {
        this.IsModify = IsModify;
        this.workbook.handlers.trigger("setDocumentModified", this.IsModify);
    }
};
CHistory.prototype._checkCurPoint = function () {
    if (null != this.CurPoint && this.CurPoint.Items.length > 0) {
        this.Points[++this.Index] = this.CurPoint;
        this.Points.length = this.Index + 1;
        this.CurPoint = null;
    }
};
CHistory.prototype.SetSelection = function (range) {
    if (0 !== this.TurnOffHistory) {
        return;
    }
    if (null == this.CurPoint) {
        return;
    }
    this.CurPoint.SelectRange = range;
};
CHistory.prototype.SetSelectionRedo = function (range) {
    if (0 !== this.TurnOffHistory) {
        return;
    }
    if (null == this.CurPoint) {
        return;
    }
    this.CurPoint.SelectRangeRedo = range;
};
CHistory.prototype.GetSelection = function () {
    var oRes = null;
    if (null != this.CurPoint) {
        oRes = this.CurPoint.SelectRange;
    }
    return oRes;
};
CHistory.prototype.GetSelectionRedo = function () {
    var oRes = null;
    if (null != this.CurPoint) {
        oRes = this.CurPoint.SelectRangeRedo;
    }
    return oRes;
};
CHistory.prototype.SetSheetRedo = function (sheetId) {
    if (0 !== this.TurnOffHistory) {
        return;
    }
    if (null == this.CurPoint) {
        return;
    }
    this.CurPoint.RedoSheetId = sheetId;
};
CHistory.prototype.SetSheetUndo = function (sheetId) {
    if (0 !== this.TurnOffHistory) {
        return;
    }
    if (null == this.CurPoint) {
        return;
    }
    this.CurPoint.UndoSheetId = sheetId;
};
CHistory.prototype.TurnOff = function () {
    this.TurnOffHistory++;
};
CHistory.prototype.TurnOn = function () {
    this.TurnOffHistory--;
    if (this.TurnOffHistory < 0) {
        this.TurnOffHistory = 0;
    }
};
CHistory.prototype.StartTransaction = function () {
    this.Transaction++;
};
CHistory.prototype.EndTransaction = function () {
    this.Transaction--;
    if (this.Transaction < 0) {
        this.Transaction = 0;
    }
};
CHistory.prototype.IsEndTransaction = function () {
    return (0 === this.Transaction);
};
CHistory.prototype.Is_On = function () {
    return (0 === this.TurnOffHistory);
};
CHistory.prototype.Save = function () {
    this.SavePoint = null;
    if (null != this.CurPoint && this.CurPoint.Items.length > 0) {
        this.SavePoint = this.CurPoint;
    } else {
        if (this.Index >= 0 && this.Index < this.Points.length) {
            this.SavePoint = this.Points[this.Index];
        }
    }
    var IsModify = this.Is_Modified();
    if (this.IsModify != IsModify) {
        this.IsModify = IsModify;
        this.workbook.handlers.trigger("setDocumentModified", this.IsModify);
    }
};
CHistory.prototype.Reset_SavedIndex = function () {
    this.SavedIndex = this.Index;
};
CHistory.prototype.Get_DeleteIndex = function () {
    var DeletePointIndex = null !== this.SavedIndex ? Math.min(this.SavedIndex + 1, this.Index + 1) : null;
    if (null === DeletePointIndex) {
        return null;
    }
    var DeleteIndex = 0;
    for (var i = 0; i < DeletePointIndex; ++i) {
        DeleteIndex += this.Points[i].Items.length;
        DeleteIndex += 1;
    }
    return DeleteIndex;
};
CHistory.prototype.Is_Modified = function () {
    if (null != this.CurPoint && this.CurPoint.Items.length > 0) {
        if (null != this.SavePoint) {
            return this.CurPoint != this.SavePoint;
        } else {
            return true;
        }
    } else {
        if (this.Index >= 0 && this.Index < this.Points.length) {
            if (null != this.SavePoint) {
                return this.Points[this.Index] != this.SavePoint;
            } else {
                return true;
            }
        } else {
            if (null != this.SavePoint) {
                return true;
            }
        }
    }
    return false;
};
CHistory.prototype.GetSerializeArray = function () {
    var aRes = [];
    this._checkCurPoint();
    var i = 0;
    if (null != this.SavedIndex) {
        i = this.SavedIndex + 1;
    }
    for (; i <= this.Index; ++i) {
        var point = this.Points[i];
        var aPointChanges = [];
        for (var j = 0, length2 = point.Items.length; j < length2; ++j) {
            var elem = point.Items[j];
            aPointChanges.push(new UndoRedoItemSerializable(elem.Class, elem.Type, elem.SheetId, elem.Range, elem.Data, elem.LocalChange));
        }
        aRes.push(aPointChanges);
    }
    return aRes;
};
CHistory.prototype.ChangeActionsEndToStart = function () {
    if (null != this.CurPoint && this.CurPoint.Items.length > 0) {
        var endAction = this.CurPoint.Items.pop();
        this.CurPoint.Items.unshift(endAction);
    }
};
CHistory.prototype.loadFonts = function (fonts) {
    for (var i = 0; i < fonts.length; ++i) {
        this.LoadFonts[fonts[i].name] = 1;
        this.HasLoadFonts = true;
    }
    this._addFonts(false);
};
CHistory.prototype._addFonts = function (isCreateNew) {
    if (this.HasLoadFonts && (isCreateNew || !this.IsEndTransaction())) {
        var arrFonts = [];
        for (var i in this.LoadFonts) {
            arrFonts.push(i);
        }
        this.Add(g_oUndoRedoWorkbook, historyitem_Workbook_AddFont, null, null, new UndoRedoData_SingleProperty(arrFonts));
        this.LoadFonts = {};
        this.HasLoadFonts = false;
    }
};