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
 function CDrawingObjects() {
    this.Id = g_oIdCounter.Get_NewId();
    this.Objects = new Array();
    g_oTableId.Add(this, this.Id);
}
CDrawingObjects.prototype = {
    Set_Id: function (newId) {
        g_oTableId.Reset_Id(this, newId, this.Id);
        this.Id = newId;
    },
    Get_Id: function () {
        return this.Id;
    },
    Add: function (DrawingObj) {
        History.Add(this, {
            Type: historyitem_DrawingObjects_AddItem,
            Pos: this.Objects.length,
            Item: DrawingObj
        });
        this.Objects.push(DrawingObj);
        return this.Objects.length - 1;
    },
    Remove_ByPos: function (Pos) {
        History.Add(this, {
            Type: historyitem_DrawingObjects_RemoveItem,
            Pos: Pos,
            Items: [this.Objects[Pos]]
        });
        this.Objects.splice(Pos, 1);
    },
    IsPointIn: function (X, Y, PageIndex) {
        for (var Index = 0; Index < this.Objects.length; Index++) {
            if (true === this.Objects[Index].IsPointIn(X, Y, PageIndex)) {
                return Index;
            }
        }
        return -1;
    },
    Get_ById: function (Id) {
        for (var Index = 0; Index < this.Objects.length; Index++) {
            if (Id === this.Objects[Index].Get_Id()) {
                return this.Objects[Index];
            }
        }
        return null;
    },
    Get_ByIndex: function (Index) {
        if (Index < 0 || Index >= this.Objects.length) {
            return null;
        }
        return this.Objects[Index];
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
                Type: historyitem_DrawingObjects_RemoveItem,
                Pos: 0,
                Items: this.Objects
            });
            this.Objects = new Array();
        }
    },
    Get_Count: function () {
        return this.Objects.length;
    },
    Undo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_DrawingObjects_AddItem:
            this.Objects.splice(Data.Pos, 1);
            break;
        case historyitem_DrawingObjects_RemoveItem:
            var Array_start = this.Objects.slice(0, Data.Pos);
            var Array_end = this.Objects.slice(Data.Pos);
            this.Objects = Array_start.concat(Data.Items, Array_end);
            break;
        }
    },
    Redo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_DrawingObjects_AddItem:
            this.Objects.splice(Data.Pos, 0, Data.Item);
            break;
        case historyitem_DrawingObjects_RemoveItem:
            this.Objects.splice(Data.Pos, Data.Items.length);
            break;
        }
    },
    Save_Changes: function (Data, Writer) {
        Writer.WriteLong(historyitem_type_DrawingObjects);
        var Type = Data.Type;
        Writer.WriteLong(Type);
        switch (Type) {
        case historyitem_DrawingObjects_AddItem:
            if (0 === Data.Pos) {
                Writer.WriteString2("");
            } else {
                Writer.WriteString2(this.Objects[Data.Pos - 1].Get_Id());
            }
            Writer.WriteString2(Data.Item.Get_Id());
            break;
        case historyitem_DrawingObjects_RemoveItem:
            var Count = Data.Items.length;
            Writer.WriteLong(Count);
            for (var Index = 0; Index < Count; Index++) {
                Writer.WriteString2(Data.Items[Index].Get_Id());
            }
            break;
        }
        return Writer;
    },
    Load_Changes: function (Reader) {
        var ClassType = Reader.GetLong();
        if (historyitem_type_DrawingObjects != ClassType) {
            return;
        }
        var Type = Reader.GetLong();
        switch (Type) {
        case historyitem_DrawingObjects_AddItem:
            var PrevId = Reader.GetString2();
            var PrevPos = 0;
            if ("" != PrevId) {
                var ObjectCount = this.Objects.length;
                for (var Index = 0; Index < ObjectCount; Index++) {
                    if (this.Objects[Index].Get_Id() === PrevId) {
                        PrevPos = Index;
                        break;
                    }
                }
            }
            var LinkData = new Object();
            LinkData.Type = historyitem_DrawingObjects_AddItem;
            LinkData.Pos = PrevPos;
            LinkData.Id = Reader.GetString2();
            CollaborativeEditing.Add_LinkData(this, LinkData);
            break;
        case historyitem_DrawingObjects_RemoveItem:
            var Count = Reader.GetLong();
            for (var Index = 0; Index < Count; Index++) {
                var Id = Reader.GetString2();
                var ObjectCount = this.Objects.length;
                for (var Index = 0; Index < ObjectCount; Index++) {
                    if (this.Objects[Index].Get_Id() === Id) {
                        this.Objects.splice(Index, 1);
                        break;
                    }
                }
            }
            break;
        }
    },
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(historyitem_type_DrawingObjects);
        Writer.WriteString2(this.Id);
    },
    Read_FromBinary2: function (Reader) {
        this.Id = Reader.GetString2();
    },
    Load_LinkData: function (LinkData) {
        if (LinkData.Type === historyitem_DrawingObjects_AddItem) {
            var Object = g_oTableId.Get_ById(LinkData.Id);
            this.Objects.splice(LinkData.Pos, 0, Object);
        }
    }
};