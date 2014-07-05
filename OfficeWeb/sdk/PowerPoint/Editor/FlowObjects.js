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
 var flowobject_Image = 1;
var flowobject_Table = 2;
var flowobject_Shape = 3;
var flowobject_Text_Rect = 4;
function Sort_Ranges_X0(A, B) {
    if (!A.X0 || !B.X0) {
        return 0;
    }
    if (A.X0 < B.X0) {
        return -1;
    } else {
        if (A.X0 > B.X0) {
            return 1;
        }
    }
    return 0;
}
function FlowObjects_CheckInjection(Range1, Range2) {
    for (var Index = 0; Index < Range1.length; Index++) {
        var R1 = Range1[Index];
        var bInject = false;
        for (var Index2 = 0; Index2 < Range2.length; Index2++) {
            var R2 = Range2[Index2];
            if (R1.X0 >= R2.X0 && R1.X0 <= R2.X1 && R1.X1 >= R2.X0 && R1.X1 <= R2.X1) {
                bInject = true;
            }
        }
        if (!bInject) {
            return false;
        }
    }
    return true;
}
function FlowObjects_CompareRanges(Range1, Range2) {
    if (Range1.length < Range2.length) {
        return -1;
    } else {
        if (Range1.length > Range2.length) {
            return -1;
        }
    }
    for (var Index = 0; Index < Range1.length; Index++) {
        if (Math.abs(Range1[Index].X0 - Range2[Index].X0) > 0.001 || Math.abs(Range1[Index].X1 - Range2[Index].X1)) {
            return -1;
        }
    }
    return 0;
}
function FlowObjects(Parent, PageNum) {
    this.Objects = new Array();
    this.Parent = Parent;
    this.PageNum = PageNum;
}
FlowObjects.prototype = {
    Merge: function (FlowObjects) {},
    Add: function (Item) {
        if (flowobject_Table != Item.Get_Type() || 0 === Item.PageController) {
            History.Add(this, {
                Type: historyitem_FlowObjects_AddItem,
                Pos: this.Internal_Get_ClearPos(this.Objects.length),
                Item: Item
            });
        }
        this.Objects.push(Item);
        return this.Objects.length - 1;
    },
    Remove_ByPos: function (Pos) {
        var Object = this.Objects[Pos];
        if (flowobject_Table != Object.Get_Type() || 0 === Object.PageController) {
            var ClearPos = this.Internal_Get_ClearPos(Pos);
            History.Add(this, {
                Type: historyitem_FlowObjects_RemoveItem,
                Pos: ClearPos,
                EndPos: ClearPos,
                Items: [this.Objects[Pos]]
            });
        }
        this.Objects.splice(Pos, 1);
    },
    IsPointIn: function (X, Y) {
        for (var Index = this.Objects.length - 1; Index > -1; Index--) {
            if (true === this.Objects[Index].IsPointIn(X, Y)) {
                return Index;
            }
        }
        return -1;
    },
    CheckRange: function (X0, Y0, X1, Y1, StartArray) {
        var Ranges = new Array();
        if ("undefined" != typeof(StartArray) && null != StartArray) {
            Ranges = StartArray;
        }
        for (var Index = 0; Index < this.Objects.length; Index++) {
            var Object = this.Objects[Index];
            var ObjX = Object.X;
            var ObjY = Object.Y;
            var Paddings = Object.Paddings;
            if (flowobject_Table === Object.Get_Type() && false === Object.CheckRange_OnFirstPage()) {
                continue;
            }
            if (ObjY - Paddings.Top <= Y1 && ObjY + Object.H + Paddings.Bottom >= Y0 && ObjX - Paddings.Left <= X1 && ObjX + Object.W + Paddings.Right >= X0) {
                Ranges.push({
                    X0: ObjX - Paddings.Left,
                    X1: ObjX + Object.W + Paddings.Right
                });
            }
        }
        Ranges.sort(Sort_Ranges_X0);
        var Pos = 1;
        while (Pos < Ranges.length) {
            if (Ranges[Pos].X0 <= Ranges[Pos - 1].X1) {
                var TempX0 = Ranges[Pos - 1].X0;
                var TempX1 = Math.max(Ranges[Pos].X1, Ranges[Pos - 1].X1);
                Ranges.splice(Pos - 1, 2, {
                    X0: TempX0,
                    X1: TempX1
                });
            } else {
                Pos++;
            }
        }
        while (Ranges.length > 0) {
            if (Ranges[0].X1 < X0) {
                Ranges.splice(0, 1);
                continue;
            } else {
                if (Ranges[0].X0 < X0) {
                    Ranges[0].X0 = X0;
                }
            }
            break;
        }
        while (Ranges.length > 0) {
            if (Ranges[Ranges.length - 1].X0 > X1) {
                Ranges.splice(Ranges.length - 1, 1);
                continue;
            } else {
                if (Ranges[Ranges.length - 1].X1 > X1) {
                    Ranges[Ranges.length - 1].X1 = X1;
                }
            }
            break;
        }
        return Ranges;
    },
    Hide: function () {
        for (var Index = 0; Index < this.Objects.length; Index++) {
            if (this.Objects[Index].Hide) {
                this.Objects[Index].Hide();
            }
        }
    },
    Show: function (Context) {
        for (var Index = 0; Index < this.Objects.length; Index++) {
            if (this.Objects[Index].Draw) {
                this.Objects[Index].Draw(Context);
            }
        }
    },
    Find: function (Id, Remove) {
        for (var Index = 0; Index < this.Objects.length; Index++) {
            if (Id === this.Objects[Index].Get_Id()) {
                var FlowObj = this.Objects[Index];
                if (true === Remove) {
                    this.Remove_ByPos(Index);
                }
                return FlowObj;
            }
        }
    },
    Get_ByIndex: function (Index) {
        if (Index < 0 || Index >= this.Objects.length) {
            return null;
        }
        return this.Objects[Index];
    },
    Get_Index_ById: function (Id) {
        for (var Index = 0; Index < this.Objects.length; Index++) {
            if (Id === this.Objects[Index].Get_Id()) {
                return Index;
            }
        }
        return -1;
    },
    Remove_ById: function (Id) {
        for (var Index = 0; Index < this.Objects.length; Index++) {
            if (Id === this.Objects[Index].Get_Id()) {
                this.Remove_ByPos(Index);
            }
        }
    },
    Remove_All: function () {
        if (this.Objects.length > 0) {
            History.Add(this, {
                Type: historyitem_FlowObjects_RemoveItem,
                Pos: this.Internal_Get_ClearPos(0),
                EndPos: this.Internal_Get_ClearPos(this.Objects.length - 1),
                Items: [this.Objects]
            });
            this.Objects = new Array();
        }
    },
    DocumentSearch: function (Str) {
        for (var Index = 0; Index < this.Objects.length; Index++) {
            if (flowobject_Table === this.Objects[Index].Get_Type()) {
                this.Objects[Index].DocumentSearch(Str);
            }
        }
    },
    DocumentStatistics: function (Stats) {
        for (var Index = 0; Index < this.Objects.length; Index++) {
            if (flowobject_Table === this.Objects[Index].Get_Type()) {
                this.Objects[Index].Table.DocumentStatistics(Stats);
            }
        }
    },
    Document_CreateFontMap: function (FontMap) {
        for (var Index = 0; Index < this.Objects.length; Index++) {
            if (flowobject_Table === this.Objects[Index].Get_Type()) {
                this.Objects[Index].Document_CreateFontMap(FontMap);
            }
        }
    },
    Internal_Get_ClearPos: function (Pos) {
        var Counter = 0;
        for (var Index = 0; Index <= Math.min(Pos, this.Objects.length - 1); Index++) {
            var Object = this.Objects[Index];
            if (flowobject_Table === Object.Get_Type() && 0 != Object.PageController) {
                Counter++;
            }
        }
        return Pos - Counter;
    },
    Internal_Get_RealPos: function (Pos) {
        var Counter = Pos;
        for (var Index = 0; Index <= Math.min(Counter, this.Objects.length - 1); Index++) {
            var Object = this.Objects[Index];
            if (flowobject_Table === Object.Get_Type() && 0 != Object.PageController) {
                Counter++;
            }
        }
        return Counter;
    },
    Undo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_FlowObjects_AddItem:
            var Pos = this.Internal_Get_RealPos(Data.Pos);
            this.Objects.splice(Pos, 1);
            break;
        case historyitem_FlowObjects_RemoveItem:
            var Pos = this.Internal_Get_RealPos(Data.Pos);
            var Array_start = this.Objects.slice(0, Pos);
            var Array_end = this.Objects.slice(Pos);
            this.Objects = Array_start.concat(Data.Items, Array_end);
            break;
        }
        History.RecalcData_Add(this.Get_ParentObject_or_DocumentPos());
    },
    Redo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_FlowObjects_AddItem:
            var Pos = this.Internal_Get_RealPos(Data.Pos);
            this.Objects.splice(Pos, 0, Data.Item);
            break;
        case historyitem_FlowObjects_RemoveItem:
            var StartPos = this.Internal_Get_RealPos(Data.Pos);
            var EndPos = this.Internal_Get_RealPos(Data.EndPos);
            this.Objects.splice(StartPos, EndPos - StartPos + 1);
            break;
        }
        History.RecalcData_Add(this.Get_ParentObject_or_DocumentPos());
    },
    Get_ParentObject_or_DocumentPos: function () {
        var Pos = 0;
        if (this.Parent != null && this.PageNum != null) {
            Pos = this.Parent.Pages[this.PageNum].Pos;
        }
        return {
            Type: historyrecalctype_Inline,
            Data: Pos
        };
    }
};
function FlowImage(Id, X, Y, W, H, Img, DrawingDocument, PageNum, Parent) {
    this.X = X;
    this.Y = Y;
    this.H = H;
    this.W = W;
    this.Paddings = {
        Left: 0,
        Right: 0,
        Top: 0,
        Bottom: 0
    };
    this.Id = Id;
    this.PageNum = PageNum;
    this.Img = Img;
    this.DrawingDocument = DrawingDocument;
    this.Parent = Parent;
    this.Bounds = {
        Top: null,
        Bottom: null,
        Left: null,
        Right: null
    };
    this.ImageTrackType = 0;
}
FlowImage.prototype = {
    Get_Type: function () {
        return flowobject_Image;
    },
    Get_Id: function () {
        return this.Id;
    },
    Get_PageNum: function () {
        return this.PageNum;
    },
    IsPointIn: function (X, Y) {
        if (this.Y <= Y && this.Y + this.H >= Y && this.X <= X && this.X + this.W >= X) {
            return true;
        }
        return false;
    },
    Draw: function (Context) {
        Context.drawImage(this.Img, this.X, this.Y, this.W, this.H);
    },
    Focus: function () {
        this.DrawingDocument.StartTrackImage(this, this.X, this.Y, this.W, this.H, this.ImageTrackType, this.PageNum);
    },
    Blur: function () {
        this.DrawingDocument.EndTrack();
    },
    Move_Start: function (X, Y) {},
    Move: function (X, Y) {},
    Move_End: function (X, Y) {},
    Update: function () {
        this.DrawingDocument.StartTrackImage(this, this.X, this.Y, this.W, this.H, this.ImageTrackType, this.PageNum);
    },
    Track_Draw: function (Left, Top, Right, Bottom) {
        this.DrawingDocument.m_oTrackObject.DrawImageInTrack(this.Img, Left, Top, Right, Bottom);
    },
    Track_End: function (PageNum, X, Y, W, H) {
        this.Set_Position(X, Y);
        this.Set_Size(W, H);
        this.DrawingDocument.SetCurrentPage(PageNum);
        this.DrawingDocument.StartTrackImage(this, this.X, this.Y, this.W, this.H, this.ImageTrackType, PageNum);
        this.Parent.FlowImage_Move(this.Id, this.PageNum, this.PageNum);
        this.Set_PageNum(PageNum);
    },
    Select_This: function () {
        var Padding = this.DrawingDocument.GetMMPerDot(6);
        this.DrawingDocument.AddPageSelection(this.PageNum, this.X - Padding, this.Y - Padding, this.W + 2 * Padding, this.H + 2 * Padding);
    },
    Set_Position: function (X, Y) {
        History.Add(this, {
            Type: historyitem_FlowImage_Position,
            New: {
                X: X,
                Y: Y
            },
            Old: {
                X: this.X,
                Y: this.Y
            }
        });
        this.X = X;
        this.Y = Y;
    },
    Set_Size: function (W, H) {
        History.Add(this, {
            Type: historyitem_FlowImage_Size,
            New: {
                W: W,
                H: H
            },
            Old: {
                W: this.W,
                H: this.H
            }
        });
        this.W = W;
        this.H = H;
    },
    Set_Paddings: function (Left, Right, Top, Bottom) {
        History.Add(this, {
            Type: historyitem_FlowImage_Paddings,
            New: {
                Left: null != Left ? Left : this.Paddings.Left,
                Right: null != Right ? Right : this.Paddings.Right,
                Top: null != Top ? Top : this.Paddings.Top,
                Bottom: null != Bottom ? Bottom : this.Paddings.Bottom
            },
            Old: {
                Left: this.Paddings.Left,
                Right: this.Paddings.Right,
                Top: this.Paddings.Top,
                Bottom: this.Paddings.Bottom
            }
        });
        this.Paddings.Left = Left;
        this.Paddings.Right = Right;
        this.Paddings.Top = Top;
        this.Paddings.Bottom = Bottom;
    },
    Set_PageNum: function (PageNum) {
        History.Add(this, {
            Type: historyitem_FlowImage_PageNum,
            New: PageNum,
            Old: this.PageNum
        });
        this.PageNum = PageNum;
    },
    Set_Url: function (Img) {
        History.Add(this, {
            Type: historyitem_FlowImage_Url,
            New: Img,
            Old: this.Img
        });
        this.Img = Img;
    },
    Set_Parent: function (Parent) {
        History.Add(this, {
            Type: historyitem_FlowImage_Parent,
            New: Parent,
            Old: Parent
        });
        this.Parent = Parent;
    },
    Undo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_FlowImage_Position:
            this.X = Data.Old.X;
            this.Y = Data.Old.Y;
            break;
        case historyitem_FlowImage_Size:
            this.W = Data.Old.W;
            this.H = Data.Old.H;
            break;
        case historyitem_FlowImage_Paddings:
            this.Paddings.Left = Data.Old.Left;
            this.Paddings.Right = Data.Old.Right;
            this.Paddings.Top = Data.Old.Top;
            this.Paddings.Bottom = Data.Old.Bottom;
            break;
        case historyitem_FlowImage_PageNum:
            this.PageNum = Data.Old;
            break;
        case historyitem_FlowImage_Url:
            this.Img = Data.Old;
            break;
        case historyitem_FlowImage_Parent:
            this.Parent = Data.Old;
            break;
        }
        History.RecalcData_Add(this.Get_ParentObject_or_DocumentPos());
    },
    Redo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_FlowImage_Position:
            this.X = Data.New.X;
            this.Y = Data.New.Y;
            break;
        case historyitem_FlowImage_Size:
            this.W = Data.New.W;
            this.H = Data.New.H;
            break;
        case historyitem_FlowImage_Paddings:
            this.Paddings.Left = Data.New.Left;
            this.Paddings.Right = Data.New.Right;
            this.Paddings.Top = Data.New.Top;
            this.Paddings.Bottom = Data.New.Bottom;
            break;
        case historyitem_FlowImage_PageNum:
            this.PageNum = Data.New;
            break;
        case historyitem_FlowImage_Url:
            this.Img = Data.New;
            break;
        case historyitem_FlowImage_Parent:
            this.Parent = Data.New;
            break;
        }
        History.RecalcData_Add(this.Get_ParentObject_or_DocumentPos());
    },
    Get_ParentObject_or_DocumentPos: function () {
        return {
            Type: historyrecalctype_Flow,
            Data: this
        };
    }
};
function FlowTable(PageController, Table, DrawingDocument, LogicDocument, X, Y, XLimit, YLimit, PageNum, Rows, Cols, TableGrid, Id, bRecalculate) {
    this.DrawingDocument = DrawingDocument;
    this.LogicDocument = LogicDocument;
    this.Parent = LogicDocument;
    this.PageNum = PageNum;
    this.Id = Id;
    this.Paddings = {
        Left: 0,
        Right: 0,
        Top: 0,
        Bottom: 0
    };
    if ("undefined" === typeof(Table) || null === Table) {
        this.Table = new CTable(DrawingDocument, this, false, PageNum, X, Y, XLimit, YLimit, Rows, Cols, TableGrid, Id);
    } else {
        this.Table = Table;
    }
    this.X = X;
    this.Y = Y;
    this.XLimit = XLimit;
    this.YLimit = YLimit;
    this.H = this.YLimit - this.Y;
    this.W = this.XLimit - this.X;
    this.TopObject = this;
    this.PageController = PageController;
    this.TurnOffRecalc = false;
    if (0 === PageController) {
        this.Pages = new Array();
        this.Pages[0] = this.Id;
        this.TurnOffRecalc = true;
        if (true === bRecalculate) {
            this.Table.Recalculate();
        }
        this.TurnOffRecalc = false;
        this.Internal_UpdatePages(0);
    }
}
FlowTable.prototype = {
    Get_Type: function () {
        return flowobject_Table;
    },
    Get_Id: function () {
        return this.Id;
    },
    Get_PageNum: function () {
        return this.PageNum;
    },
    Get_Styles: function () {
        return this.LogicDocument.Get_Styles();
    },
    Get_Numbering: function () {
        return this.LogicDocument.Get_Numbering();
    },
    Set_CurrentElement: function (Index) {
        if (0 != this.PageController) {
            this.TopObject.Set_CurrentElement(Index);
        }
        var Doc = this.LogicDocument;
        var FlowPos = Doc.Pages[this.PageNum].FlowObjects.Get_Index_ById(this.Id);
        if (-1 === FlowPos) {
            return;
        }
        if (Doc.CurPos.Type == docpostype_FlowObjects) {
            Doc.Selection.Data.FlowObject.Blur();
        }
        Doc.Selection_Remove();
        Doc.CurPos.Type = docpostype_FlowObjects;
        Doc.CurPos.ContentPos = FlowPos;
        Doc.CurPage = this.PageNum;
        Doc.Selection.Start = false;
        Doc.Selection.Use = true;
        Doc.Selection.Flag = selectionflag_Common;
        Doc.Selection.Data = {
            PageNum: Doc.CurPage,
            FlowObject: this,
            Pos: FlowPos
        };
        Doc.Document_UpdateInterfaceState();
        Doc.Document_UpdateRulersState();
        Doc.Document_UpdateSelectionState();
    },
    DeleteThis: function () {
        if (0 != this.PageController) {
            return this.TopObject.DeleteThis();
        }
        for (var Index = 0; Index < this.Pages.length; Index++) {
            var PageFlowObjects = this.LogicDocument.Pages[this.PageNum + Index].FlowObjects;
            PageFlowObjects.Remove_ById(this.Pages[Index]);
        }
        return this.PageNum;
    },
    Recalculate: function (bFromUndoRedo) {
        this.Table.Recalculate();
        if (true != bFromUndoRedo) {
            this.Internal_UpdatePages(0);
        }
    },
    OnContentRecalculate: function (bNeedDocumentRecalc, PageNum, DocumentIndex) {
        if (true === this.TurnOffRecalc) {
            return;
        }
        if (0 != this.PageController) {
            return this.TopObject.OnContentRecalculate(bNeedDocumentRecalc, PageNum);
        }
        this.Internal_UpdatePages(PageNum);
        this.LogicDocument.NeedUpdateTarget = true;
        if (bNeedDocumentRecalc) {
            this.LogicDocument.ContentLastChangePos = this.LogicDocument.Pages[this.PageNum + PageNum].Pos;
            this.LogicDocument.Recalculate();
        } else {
            for (var Index = PageNum; Index < this.Pages.length; Index++) {
                this.DrawingDocument.OnRecalculatePage(this.PageNum + Index, this.LogicDocument.Pages[this.PageNum + Index]);
            }
            this.DrawingDocument.OnEndRecalculate(false, true);
        }
    },
    RecalculateCurPos: function () {
        this.Table.RecalculateCurPos();
    },
    Get_NearestPos: function (PageNum, X, Y) {
        return this.Table.Get_NearestPos(PageNum, X, Y);
    },
    Get_PageContentStartPos: function (PageNum) {
        return this.LogicDocument.Get_PageContentStartPos(this.PageNum + PageNum);
    },
    Update_Position: function (X, Y) {
        this.X = X;
        this.Y = Y;
    },
    Update_Position2: function (X, Y, PageNum) {
        this.X = X;
        this.Y = Y;
        this.LogicDocument.DrawingDocument.OnRecalculatePage(this.PageNum, this.LogicDocument.Slides[this.PageNum]);
        this.LogicDocument.DrawingDocument.OnEndRecalculate(false, false);
    },
    Update_CursorType: function (X, Y, PageNum) {
        return this.Table.Update_CursorType(X, Y, PageNum);
    },
    DocumentSearch: function (Str) {
        this.Table.DocumentSearch(Str);
    },
    Document_CreateFontMap: function (FontMap) {
        this.Table.Document_CreateFontMap(FontMap);
    },
    Document_UpdateInterfaceState: function () {
        this.Table.Document_UpdateInterfaceState();
    },
    Document_UpdateSelectionState: function () {
        if (true === this.Table.Is_SelectionUse()) {
            if (table_Selection_Border === this.Table.Selection.Type2 || table_Selection_Border_InnerTable === this.Table.Selection.Type2) {
                this.DrawingDocument.TargetEnd();
            } else {
                this.DrawingDocument.TargetEnd();
                this.DrawingDocument.SelectEnabled(true);
                this.DrawingDocument.SelectClear();
                this.Table.Selection_Draw();
                this.DrawingDocument.SelectShow();
            }
        } else {
            this.Table.RecalculateCurPos();
            this.DrawingDocument.SelectEnabled(false);
            this.DrawingDocument.TargetStart();
            this.DrawingDocument.TargetShow();
        }
    },
    Add_InlineObjectXY: function (Drawing, X, Y, PageNum) {
        return this.LogicDocument.Add_InlineObjectXY(Drawing, X, Y, PageNum);
    },
    Add_InlineTableXY: function (Table, X, Y, PageNum_Abs) {
        return this.LogicDocument.Add_InlineTableXY(Table, X, Y, PageNum_Abs);
    },
    Is_TopDocument: function () {
        return true;
    },
    Get_StartPage_Absolute: function () {
        return this.Parent.Get_StartPage_Absolute();
    },
    CheckRange_OnFirstPage: function () {
        if (0 != this.PageController || 1 === this.Table.Pages.length || (this.Table.Pages.length > 1 && (0 != this.Table.Pages[1].FirstRow || true === this.Table.RowsInfo[0].FirstPage))) {
            return true;
        }
        return false;
    },
    IsPointIn: function (X, Y) {
        if (true === this.CheckRange_OnFirstPage()) {
            if (this.Y <= Y && this.Y + this.H >= Y && this.X <= X && this.X + this.W >= X) {
                return true;
            }
        }
        return false;
    },
    Draw: function (pGraphics) {
        this.Table.Draw(this.PageNum + this.PageController, pGraphics);
    },
    Focus: function (X, Y) {},
    Blur: function () {
        this.Table.Selection_Remove();
    },
    Move_Start: function (X, Y, MouseEvent) {
        this.Table.Selection_SetStart(X, Y, this.PageController + this.PageNum, MouseEvent);
    },
    Selection_SetStart: function (X, Y, MouseEvent) {
        this.Table.Selection_SetStart(X, Y, this.PageController + this.PageNum, MouseEvent);
    },
    Move: function (X, Y, PageNum, MouseEvent) {
        this.Table.Selection_SetEnd(X, Y, PageNum, MouseEvent);
    },
    Move_End: function (X, Y, PageNum, MouseEvent) {
        this.Table.Selection_SetEnd(X, Y, PageNum, MouseEvent);
        this.Table.Selection_Stop(X, Y, PageNum, MouseEvent);
    },
    Selection_Draw: function () {
        this.Table.Selection_Draw();
    },
    Selection_Remove: function () {
        this.Table.Selection_Remove();
    },
    Selection_Is_OneElement: function () {
        return true;
    },
    Internal_Update: function () {
        this.Table.Recalculate();
        this.Internal_UpdateBounds();
    },
    Internal_UpdateBounds: function () {
        var Bounds = this.Table.Get_PageBounds(this.PageController);
        this.W = Bounds.Right - Bounds.Left;
        this.H = Bounds.Bottom - Bounds.Top;
        if (0 === this.PageController) {
            for (var Index = 1; Index < this.Pages.length; Index++) {
                var PageFlowObjects = this.LogicDocument.Pages[this.PageNum + Index].FlowObjects;
                var FlowObject = PageFlowObjects.Get_ById(this.Pages[Index]);
                FlowObject.Internal_UpdateBounds();
            }
        }
    },
    Internal_UpdatePages: function (PageNum) {
        for (var Index = (PageNum > 0 ? PageNum : 1); Index < this.Pages.length; Index++) {
            var PageFlowObjects = this.LogicDocument.Pages[this.PageNum + Index].FlowObjects;
            PageFlowObjects.Remove_ById(this.Pages[Index]);
        }
        this.Pages.length = (PageNum > 0 ? PageNum : 1);
        var PagesCount = this.Table.Get_PagesCount();
        for (var Index = PageNum; Index < PagesCount; Index++) {
            var Bounds = this.Table.Get_PageBounds(Index);
            if (0 === Index) {
                this.W = Bounds.Right - Bounds.Left;
                this.H = Bounds.Bottom - Bounds.Top;
            } else {
                var NewId = ++this.LogicDocument.IdCounter;
                var NewFlowTable = new FlowTable(Index, this.Table, this.DrawingDocument, this.LogicDocument, Bounds.Left, Bounds.Top, Bounds.Right, Bounds.Bottom, this.PageNum, 0, 0, null, NewId, true);
                NewFlowTable.TopObject = this;
                if ("undefined" === typeof(this.LogicDocument.Pages[this.PageNum + Index])) {
                    this.LogicDocument.Pages[this.PageNum + Index] = new Object();
                    this.LogicDocument.Pages[this.PageNum + Index].FlowObjects = new FlowObjects(this.LogicDocument, this.PageNum + Index);
                    this.LogicDocument.Pages[this.PageNum + Index].Width = Page_Width;
                    this.LogicDocument.Pages[this.PageNum + Index].Height = Page_Height;
                    this.LogicDocument.Pages[this.PageNum + Index].Margins = {
                        Left: X_Left_Field,
                        Right: X_Right_Field,
                        Top: Y_Top_Field,
                        Bottom: Y_Bottom_Field
                    };
                    this.LogicDocument.Pages[this.PageNum + Index].Pos = 0;
                }
                this.LogicDocument.Pages[this.PageNum + Index].FlowObjects.Add(NewFlowTable);
                this.Pages[Index] = NewId;
            }
        }
    },
    Add_NewParagraph: function () {
        this.Table.Add_NewParagraph();
    },
    Add_FlowImage: function (W, H, Img) {
        this.Table.Add_FlowImage(W, H, Img);
    },
    Add_InlineImage: function (W, H, Img) {
        this.Table.Add_InlineImage(W, H, Img);
    },
    Add_InlineObject: function (Obj) {
        this.Table.Add_InlineObject(Obj);
    },
    Add_InlineTable2: function (Table) {
        this.Table.Add_InlineTable2(Table);
    },
    Paragraph_Add: function (ParaItem, bRecalculate) {
        if (para_NewLine === ParaItem.Type && break_Page === ParaItem.BreakType) {
            return;
        }
        this.Table.Paragraph_Add(ParaItem, bRecalculate);
    },
    Remove: function (Count, bOnlyText, bRemoveOnlySelection) {
        this.Table.Remove(Count, bOnlyText, bRemoveOnlySelection);
    },
    Cursor_MoveAt: function (X, Y, PageNum) {
        return this.Table.Cursor_MoveAt(X, Y, false, false, PageNum);
    },
    Cursor_MoveLeft: function (AddToSelect) {
        return this.Table.Cursor_MoveLeft(1, AddToSelect);
    },
    Cursor_MoveRight: function (AddToSelect) {
        return this.Table.Cursor_MoveRight(1, AddToSelect);
    },
    Cursor_MoveUp: function (AddToSelect) {
        return this.Table.Cursor_MoveUp(1, AddToSelect);
    },
    Cursor_MoveDown: function (AddToSelect) {
        return this.Table.Cursor_MoveDown(1, AddToSelect);
    },
    Cursor_MoveEndOfLine: function (AddToSelect) {
        return this.Table.Cursor_MoveEndOfLine(AddToSelect);
    },
    Cursor_MoveStartOfLine: function (AddToSelect) {
        return this.Table.Cursor_MoveStartOfLine(AddToSelect);
    },
    Set_ParagraphAlign: function (Align) {
        return this.Table.Set_ParagraphAlign(Align);
    },
    Set_ParagraphSpacing: function (Spacing) {
        return this.Table.Set_ParagraphSpacing(Spacing);
    },
    Set_ParagraphIndent: function (Ind) {
        return this.Table.Set_ParagraphIndent(Ind);
    },
    Set_ParagraphNumbering: function (NumInfo) {
        return this.Table.Set_ParagraphNumbering(NumInfo);
    },
    Set_ParagraphShd: function (Shd) {
        return this.Table.Set_ParagraphShd(Shd);
    },
    Set_ParagraphStyle: function (Name) {
        return this.Table.Set_ParagraphStyle(Name);
    },
    Set_ParagraphTabs: function (Tabs) {
        return this.Table.Set_ParagraphTabs(Tabs);
    },
    Set_ParagraphContextualSpacing: function (Value) {
        return this.Table.Set_ParagraphContextualSpacing(Value);
    },
    Set_ParagraphPageBreakBefore: function (Value) {
        return this.Table.Set_ParagraphPageBreakBefore(Value);
    },
    Set_ParagraphKeepLines: function (Value) {
        return this.Table.Set_ParagraphKeepLines(Value);
    },
    Get_ParagraphIndent: function () {
        return this.Table.Get_ParagraphIndent();
    },
    Get_CurrentParagraph: function () {
        return this.Table.Get_CurrentParagraph();
    },
    Set_Position: function (X, Y) {
        this.X = X;
        this.Y = Y;
    },
    Set_Paddings: function (Left, Right, Top, Bottom) {
        this.Paddings.Left = Left;
        this.Paddings.Right = Right;
        this.Paddings.Top = Top;
        this.Paddings.Bottom = Bottom;
    },
    Set_PageNum: function (PageNum) {
        this.PageNum = PageNum;
    },
    Set_Parent: function (Parent) {
        this.Parent = Parent;
    },
    Undo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_FlowTable_Position:
            this.X = Data.Old.X;
            this.Y = Data.Old.Y;
            this.Table.X = this.X;
            this.Table.Y = this.Y;
            this.Pages[0].X = this.X;
            this.Pages[0].Y = this.Y;
            break;
        case historyitem_FlowTable_Paddings:
            this.Paddings.Left = Data.Old.Left;
            this.Paddings.Right = Data.Old.Right;
            this.Paddings.Top = Data.Old.Top;
            this.Paddings.Bottom = Data.Old.Bottom;
            break;
        case historyitem_FlowTable_PageNum:
            this.PageNum = Data.Old;
            this.Table.PageNum = Data.Old;
            break;
        case historyitem_FlowTable_Parent:
            this.Parent = Data.Old;
            break;
        }
        History.RecalcData_Add(this.Get_ParentObject_or_DocumentPos());
    },
    Redo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_FlowTable_Position:
            this.X = Data.New.X;
            this.Y = Data.New.Y;
            this.Table.X = this.X;
            this.Table.Y = this.Y;
            this.Pages[0].X = this.X;
            this.Pages[0].Y = this.Y;
            break;
        case historyitem_FlowTable_Paddings:
            this.Paddings.Left = Data.New.Left;
            this.Paddings.Right = Data.New.Right;
            this.Paddings.Top = Data.New.Top;
            this.Paddings.Bottom = Data.New.Bottom;
            break;
        case historyitem_FlowTable_PageNum:
            this.PageNum = Data.New;
            this.Table.PageNum = Data.New;
            break;
        case historyitem_FlowTable_Parent:
            this.Parent = Data.New;
            break;
        }
        History.RecalcData_Add(this.Get_ParentObject_or_DocumentPos());
    },
    Get_ParentObject_or_DocumentPos: function () {
        if (0 != this.PageController) {
            return this.TopObject.Get_ParentObject_or_DocumentPos();
        } else {
            return {
                Type: historyrecalctype_Flow,
                Data: this
            };
        }
    }
};