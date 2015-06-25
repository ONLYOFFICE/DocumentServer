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
function CHistory(Document) {
    this.Index = -1;
    this.SavedIndex = null;
    this.ForceSave = false;
    this.RecIndex = -1;
    this.Points = [];
    this.Document = Document;
    this.RecalculateData = {
        Inline: {
            Pos: -1,
            PageNum: 0
        },
        Flow: [],
        HdrFtr: [],
        Drawings: {
            All: false,
            Map: {},
            ThemeInfo: null
        }
    };
    this.TurnOffHistory = false;
    this.MinorChanges = false;
    this.BinaryWriter = new CMemory();
    this.FileCheckSum = 0;
    this.FileSize = 0;
}
CHistory.prototype = {
    Update_FileDescription: function (oStream) {
        var pData = oStream.data;
        var nSize = oStream.size;
        this.FileCheckSum = g_oCRC32.Calculate_ByByteArray(pData, nSize);
        this.FileSize = nSize;
    },
    Update_PointInfoItem: function (PointIndex, StartPoint, LastPoint, SumIndex, DeletedIndex) {
        var Point = this.Points[PointIndex];
        if (Point) {
            var Class = g_oTableId;
            if (Point.Items.length > 0) {
                var FirstItem = Point.Items[0];
                if (FirstItem.Class === Class && historyitem_TableId_Description === FirstItem.Data.Type) {
                    Point.Items.splice(0, 1);
                }
            }
            var Data = {
                Type: historyitem_TableId_Description,
                FileCheckSum: this.FileCheckSum,
                FileSize: this.FileSize,
                Description: Point.Description,
                ItemsCount: Point.Items.length,
                PointIndex: PointIndex,
                StartPoint: StartPoint,
                LastPoint: LastPoint,
                SumIndex: SumIndex,
                DeletedIndex: DeletedIndex
            };
            var Binary_Pos = this.BinaryWriter.GetCurPosition();
            this.BinaryWriter.WriteString2(Class.Get_Id());
            Class.Save_Changes(Data, this.BinaryWriter);
            var Binary_Len = this.BinaryWriter.GetCurPosition() - Binary_Pos;
            var Item = {
                Class: Class,
                Data: Data,
                Binary: {
                    Pos: Binary_Pos,
                    Len: Binary_Len
                },
                NeedRecalc: false
            };
            Point.Items.splice(0, 0, Item);
        }
    },
    Is_Clear: function () {
        if (this.Points.length <= 0) {
            return true;
        }
        return false;
    },
    Clear: function () {
        this.Index = -1;
        this.SavedIndex = null;
        this.ForceSave = false;
        this.Points.length = 0;
        this.Internal_RecalcData_Clear();
    },
    Can_Undo: function () {
        if (this.Index >= 0) {
            return true;
        }
        return false;
    },
    Can_Redo: function () {
        if (this.Points.length > 0 && this.Index < this.Points.length - 1) {
            return true;
        }
        return false;
    },
    Undo: function (Options) {
        this.Check_UninonLastPoints();
        if (true != this.Can_Undo()) {
            return null;
        }
        if (editor) {
            editor.setUserAlive();
        }
        if (this.Index === this.Points.length - 1) {
            this.LastState = this.Document.Get_SelectionState();
        }
        this.Document.Selection_Remove();
        this.Internal_RecalcData_Clear();
        var Point = null;
        if (undefined !== Options && null !== Options && true === Options.All) {
            while (this.Index >= 0) {
                Point = this.Points[this.Index--];
                for (var Index = Point.Items.length - 1; Index >= 0; Index--) {
                    var Item = Point.Items[Index];
                    Item.Class.Undo(Item.Data);
                    Item.Class.Refresh_RecalcData(Item.Data);
                }
            }
        } else {
            Point = this.Points[this.Index--];
            for (var Index = Point.Items.length - 1; Index >= 0; Index--) {
                var Item = Point.Items[Index];
                Item.Class.Undo(Item.Data);
                Item.Class.Refresh_RecalcData(Item.Data);
            }
        }
        if (null != Point) {
            this.Document.Set_SelectionState(Point.State);
        }
        return this.RecalculateData;
    },
    Redo: function () {
        if (true != this.Can_Redo()) {
            return null;
        }
        if (editor) {
            editor.setUserAlive();
        }
        this.Document.Selection_Remove();
        var Point = this.Points[++this.Index];
        this.Internal_RecalcData_Clear();
        for (var Index = 0; Index < Point.Items.length; Index++) {
            var Item = Point.Items[Index];
            Item.Class.Redo(Item.Data);
            Item.Class.Refresh_RecalcData(Item.Data);
        }
        var State = null;
        if (this.Index === this.Points.length - 1) {
            State = this.LastState;
        } else {
            State = this.Points[this.Index + 1].State;
        }
        this.Document.Set_SelectionState(State);
        return this.RecalculateData;
    },
    Create_NewPoint: function (Description) {
        if (this.Index < this.SavedIndex && null !== this.SavedIndex) {
            this.SavedIndex = this.Index;
            this.ForceSave = true;
        }
        this.Clear_Additional();
        this.Check_UninonLastPoints();
        var State = this.Document.Get_SelectionState();
        var Items = [];
        var Time = new Date().getTime();
        this.Points[++this.Index] = {
            State: State,
            Items: Items,
            Time: Time,
            Additional: {},
            Description: Description
        };
        this.Points.length = this.Index + 1;
    },
    Remove_LastPoint: function () {
        this.Index--;
        this.Points.length = this.Index + 1;
    },
    Clear_Redo: function () {
        this.Points.length = this.Index + 1;
    },
    Add: function (Class, Data) {
        if (true === this.TurnOffHistory) {
            return;
        }
        if (this.Index < 0) {
            return;
        }
        if (editor) {
            editor.setUserAlive();
        }
        if (this.RecIndex >= this.Index) {
            this.RecIndex = this.Index - 1;
        }
        var Binary_Pos = this.BinaryWriter.GetCurPosition();
        this.BinaryWriter.WriteString2(Class.Get_Id());
        Class.Save_Changes(Data, this.BinaryWriter);
        var Binary_Len = this.BinaryWriter.GetCurPosition() - Binary_Pos;
        var Item = {
            Class: Class,
            Data: Data,
            Binary: {
                Pos: Binary_Pos,
                Len: Binary_Len
            },
            NeedRecalc: !this.MinorChanges
        };
        this.Points[this.Index].Items.push(Item);
        var bZIndexManager = !(typeof ZIndexManager === "undefined");
        var bPresentation = !(typeof CPresentation === "undefined");
        var bSlide = !(typeof Slide === "undefined");
        if ((Class instanceof CDocument && (historyitem_Document_AddItem === Data.Type || historyitem_Document_RemoveItem === Data.Type)) || (Class instanceof CDocumentContent && (historyitem_DocumentContent_AddItem === Data.Type || historyitem_DocumentContent_RemoveItem === Data.Type)) || (Class instanceof CTable && (historyitem_Table_AddRow === Data.Type || historyitem_Table_RemoveRow === Data.Type)) || (Class instanceof CTableRow && (historyitem_TableRow_AddCell === Data.Type || historyitem_TableRow_RemoveCell === Data.Type)) || (Class instanceof Paragraph && (historyitem_Paragraph_AddItem === Data.Type || historyitem_Paragraph_RemoveItem === Data.Type)) || (Class instanceof ParaHyperlink && (historyitem_Hyperlink_AddItem === Data.Type || historyitem_Hyperlink_RemoveItem === Data.Type)) || (Class instanceof ParaRun && (historyitem_ParaRun_AddItem === Data.Type || historyitem_ParaRun_RemoveItem === Data.Type)) || (bZIndexManager && Class instanceof ZIndexManager && (historyitem_ZIndexManagerRemoveItem === Data.Type || historyitem_ZIndexManagerAddItem === Data.Type)) || (bPresentation && Class instanceof CPresentation && (historyitem_Presentation_AddSlide === Data.Type || historyitem_Presentation_RemoveSlide === Data.Type)) || (bSlide && Class instanceof Slide && (historyitem_SlideAddToSpTree === Data.Type || historyitem_SlideRemoveFromSpTree === Data.Type))) {
            var bAdd = ((Class instanceof CDocument && historyitem_Document_AddItem === Data.Type) || (Class instanceof CDocumentContent && historyitem_DocumentContent_AddItem === Data.Type) || (Class instanceof CTable && historyitem_Table_AddRow === Data.Type) || (Class instanceof CTableRow && historyitem_TableRow_AddCell === Data.Type) || (Class instanceof Paragraph && historyitem_Paragraph_AddItem === Data.Type) || (Class instanceof ParaHyperlink && historyitem_Hyperlink_AddItem === Data.Type) || (Class instanceof ParaRun && historyitem_ParaRun_AddItem === Data.Type) || (bZIndexManager && Class instanceof ZIndexManager && historyitem_ZIndexManagerAddItem === Data.Type) || (bPresentation && Class instanceof CPresentation && (historyitem_Presentation_AddSlide === Data.Type)) || (bSlide && Class instanceof Slide && (historyitem_SlideAddToSpTree === Data.Type))) ? true : false;
            var Count = 1;
            if ((Class instanceof Paragraph) || (Class instanceof ParaHyperlink) || (Class instanceof ParaRun) || (Class instanceof CDocument && historyitem_Document_RemoveItem === Data.Type) || (Class instanceof CDocumentContent && historyitem_DocumentContent_RemoveItem === Data.Type)) {
                Count = Data.Items.length;
            }
            var ContentChanges = new CContentChangesElement((bAdd == true ? contentchanges_Add : contentchanges_Remove), Data.Pos, Count, Item);
            Class.Add_ContentChanges(ContentChanges);
            CollaborativeEditing.Add_NewDC(Class);
        }
        if (CollaborativeEditing.AddPosExtChanges && Class instanceof CXfrm) {
            if (historyitem_Xfrm_SetOffX === Data.Type || historyitem_Xfrm_SetOffY === Data.Type || historyitem_Xfrm_SetExtX === Data.Type || historyitem_Xfrm_SetExtY === Data.Type || historyitem_Xfrm_SetChOffX === Data.Type || historyitem_Xfrm_SetChOffY === Data.Type || historyitem_Xfrm_SetChExtX === Data.Type || historyitem_Xfrm_SetChExtY === Data.Type) {
                CollaborativeEditing.AddPosExtChanges(Item, historyitem_Xfrm_SetOffX === Data.Type || historyitem_Xfrm_SetExtX === Data.Type || historyitem_Xfrm_SetChOffX === Data.Type || historyitem_Xfrm_SetChExtX === Data.Type);
            }
        }
    },
    Internal_RecalcData_Clear: function () {
        this.RecalculateData = {
            Inline: {
                Pos: -1,
                PageNum: 0
            },
            Flow: [],
            HdrFtr: [],
            Drawings: {
                All: false,
                Map: {},
                ThemeInfo: null
            }
        };
    },
    RecalcData_Add: function (Data) {
        if ("undefined" === typeof(Data) || null === Data) {
            return;
        }
        switch (Data.Type) {
        case historyrecalctype_Flow:
            var bNew = true;
            for (var Index = 0; Index < this.RecalculateData.Flow.length; Index++) {
                if (this.RecalculateData.Flow[Index] === Data.Data) {
                    bNew = false;
                    break;
                }
            }
            if (true === bNew) {
                this.RecalculateData.Flow.push(Data.Data);
            }
            break;
        case historyrecalctype_HdrFtr:
            if (null === Data.Data) {
                break;
            }
            var bNew = true;
            for (var Index = 0; Index < this.RecalculateData.HdrFtr.length; Index++) {
                if (this.RecalculateData.HdrFtr[Index] === Data.Data) {
                    bNew = false;
                    break;
                }
            }
            if (true === bNew) {
                this.RecalculateData.HdrFtr.push(Data.Data);
            }
            break;
        case historyrecalctype_Inline:
            if ((Data.Data.Pos < this.RecalculateData.Inline.Pos) || (Data.Data.Pos === this.RecalculateData.Inline.Pos && Data.Data.PageNum < this.RecalculateData.Inline.PageNum) || this.RecalculateData.Inline.Pos < 0) {
                this.RecalculateData.Inline.Pos = Data.Data.Pos;
                this.RecalculateData.Inline.PageNum = Data.Data.PageNum;
            }
            break;
        case historyrecalctype_Drawing:
            if (!this.RecalculateData.Drawings.All) {
                if (Data.All) {
                    this.RecalculateData.Drawings.All = true;
                } else {
                    if (Data.Theme) {
                        this.RecalculateData.Drawings.ThemeInfo = {
                            Theme: true,
                            ArrInd: Data.ArrInd
                        };
                    } else {
                        if (Data.ColorScheme) {
                            this.RecalculateData.Drawings.ThemeInfo = {
                                ColorScheme: true,
                                ArrInd: Data.ArrInd
                            };
                        } else {
                            this.RecalculateData.Drawings.Map[Data.Object.Get_Id()] = Data.Object;
                        }
                    }
                }
            }
            break;
        }
    },
    Check_UninonLastPoints: function () {
        if (true === this.Document.TurnOffRecalc) {
            return;
        }
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
            Additional: {},
            Description: historydescription_Document_AddLetter
        };
        if (this.SavedIndex >= this.Points.length - 2 && null !== this.SavedIndex) {
            this.SavedIndex = this.Points.length - 3;
            this.ForceSave = true;
        }
        this.Points.splice(this.Points.length - 2, 2, NewPoint);
        if (this.Index >= this.Points.length) {
            var DiffIndex = -this.Index + (this.Points.length - 1);
            this.Index += DiffIndex;
            this.RecIndex = Math.max(-1, this.RecIndex + DiffIndex);
        }
    },
    TurnOff: function () {
        this.TurnOffHistory = true;
    },
    TurnOn: function () {
        this.TurnOffHistory = false;
    },
    Is_On: function () {
        return (false === this.TurnOffHistory ? true : false);
    },
    Reset_SavedIndex: function () {
        this.SavedIndex = this.Index;
        this.ForceSave = false;
    },
    Have_Changes: function () {
        if (-1 === this.Index && null === this.SavedIndex && false === this.ForceSave) {
            return false;
        }
        if (this.Index != this.SavedIndex || true === this.ForceSave) {
            return true;
        }
        return false;
    },
    Get_RecalcData: function () {
        if (this.Index >= 0) {
            this.Internal_RecalcData_Clear();
            for (var Pos = this.RecIndex + 1; Pos <= this.Index; Pos++) {
                var Point = this.Points[Pos];
                for (var Index = 0; Index < Point.Items.length; Index++) {
                    var Item = Point.Items[Index];
                    if (true === Item.NeedRecalc) {
                        Item.Class.Refresh_RecalcData(Item.Data);
                    }
                }
            }
        }
        return this.RecalculateData;
    },
    Reset_RecalcIndex: function () {
        this.RecIndex = this.Index;
    },
    Is_SimpleChanges: function () {
        var Count, Items;
        if (this.Index - this.RecIndex !== 1 && this.RecIndex >= -1) {
            Items = [];
            Count = 0;
            for (var PointIndex = this.RecIndex + 1; PointIndex <= this.Index; PointIndex++) {
                Items = Items.concat(this.Points[PointIndex].Items);
                Count += this.Points[PointIndex].Items.length;
            }
        } else {
            if (this.Index >= 0) {
                var Point = this.Points[this.Index];
                Count = Point.Items.length;
                Items = Point.Items;
            } else {
                return [];
            }
        }
        if (Items.length > 0) {
            var Class = Items[0].Class;
            for (var Index = 1; Index < Count; Index++) {
                var Item = Items[Index];
                if (Class !== Item.Class) {
                    return [];
                }
            }
            if (Class instanceof ParaRun && Class.Is_SimpleChanges(Items)) {
                return [Items[0]];
            }
        }
        return [];
    },
    Set_Additional_ExtendDocumentToPos: function () {
        if (this.Index >= 0) {
            this.Points[this.Index].Additional.ExtendDocumentToPos = true;
        }
    },
    Is_ExtendDocumentToPos: function () {
        if (undefined === this.Points[this.Index] || undefined === this.Points[this.Index].Additional || undefined === this.Points[this.Index].Additional.ExtendDocumentToPos) {
            return false;
        }
        return true;
    },
    Clear_Additional: function () {
        if (this.Index >= 0) {
            this.Points[this.Index].Additional = {};
        }
        if (true === editor.isMarkerFormat) {
            editor.sync_MarkerFormatCallback(false);
        }
    },
    Get_EditingTime: function (dTime) {
        var Count = this.Points.length;
        var TimeLine = [];
        for (var Index = 0; Index < Count; Index++) {
            var PointTime = this.Points[Index].Time;
            TimeLine.push({
                t0: PointTime - dTime,
                t1: PointTime
            });
        }
        Count = TimeLine.length;
        for (var Index = 1; Index < Count; Index++) {
            var CurrEl = TimeLine[Index];
            var PrevEl = TimeLine[Index - 1];
            if (CurrEl.t0 <= PrevEl.t1) {
                PrevEl.t1 = CurrEl.t1;
                TimeLine.splice(Index, 1);
                Index--;
                Count--;
            }
        }
        Count = TimeLine.length;
        var OverallTime = 0;
        for (var Index = 0; Index < Count; Index++) {
            OverallTime += TimeLine[Index].t1 - TimeLine[Index].t0;
        }
        return OverallTime;
    }
};
var History = null;
function CRC32() {
    this.m_aTable = [];
    this.private_InitTable();
}
CRC32.prototype.private_InitTable = function () {
    var CRC_POLY = 3988292384;
    var nChar;
    for (var nIndex = 0; nIndex < 256; nIndex++) {
        nChar = nIndex;
        for (var nCounter = 0; nCounter < 8; nCounter++) {
            nChar = ((nChar & 1) ? ((nChar >>> 1) ^ CRC_POLY) : (nChar >>> 1));
        }
        this.m_aTable[nIndex] = nChar;
    }
};
CRC32.prototype.Calculate_ByString = function (sStr, nSize) {
    var CRC_MASK = 3523407757;
    var nCRC = 0 ^ (-1);
    for (var nIndex = 0; nIndex < nSize; nIndex++) {
        nCRC = this.m_aTable[(nCRC ^ sStr.charCodeAt(nIndex)) & 255] ^ (nCRC >>> 8);
        nCRC ^= CRC_MASK;
    }
    return (nCRC ^ (-1)) >>> 0;
};
CRC32.prototype.Calculate_ByByteArray = function (aArray, nSize) {
    var CRC_MASK = 3523407757;
    var nCRC = 0 ^ (-1);
    for (var nIndex = 0; nIndex < nSize; nIndex++) {
        nCRC = (nCRC >>> 8) ^ this.m_aTable[(nCRC ^ aArray[nIndex]) & 255];
        nCRC ^= CRC_MASK;
    }
    return (nCRC ^ (-1)) >>> 0;
};
var g_oCRC32 = new CRC32();