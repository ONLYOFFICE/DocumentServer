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
 var historyitem_Unknown = 0;
var historyitem_Document_AddItem = 1;
var historyitem_Document_RemoveItem = 2;
var historyitem_Document_Margin = 3;
var historyitem_Document_PageSize = 4;
var historyitem_Document_Orientation = 5;
var historyitem_Document_DefaultTab = 6;
var historyitem_Paragraph_AddItem = 1;
var historyitem_Paragraph_RemoveItem = 2;
var historyitem_Paragraph_Numbering = 3;
var historyitem_Paragraph_Align = 4;
var historyitem_Paragraph_Ind_First = 5;
var historyitem_Paragraph_Ind_Right = 6;
var historyitem_Paragraph_Ind_Left = 7;
var historyitem_Paragraph_ContextualSpacing = 8;
var historyitem_Paragraph_KeepLines = 9;
var historyitem_Paragraph_KeepNext = 10;
var historyitem_Paragraph_PageBreakBefore = 11;
var historyitem_Paragraph_Spacing_Line = 12;
var historyitem_Paragraph_Spacing_LineRule = 13;
var historyitem_Paragraph_Spacing_Before = 14;
var historyitem_Paragraph_Spacing_After = 15;
var historyitem_Paragraph_Spacing_AfterAutoSpacing = 16;
var historyitem_Paragraph_Spacing_BeforeAutoSpacing = 17;
var historyitem_Paragraph_Shd_Value = 18;
var historyitem_Paragraph_Shd_Color = 19;
var historyitem_Paragraph_WidowControl = 20;
var historyitem_Paragraph_Tabs = 21;
var historyitem_Paragraph_PStyle = 22;
var historyitem_Paragraph_DocNext = 23;
var historyitem_Paragraph_DocPrev = 24;
var historyitem_Paragraph_Parent = 25;
var historyitem_Paragraph_Borders_Between = 26;
var historyitem_Paragraph_Borders_Bottom = 27;
var historyitem_Paragraph_Borders_Left = 28;
var historyitem_Paragraph_Borders_Right = 29;
var historyitem_Paragraph_Borders_Top = 30;
var historyitem_Paragraph_Pr = 31;
var historyitem_Paragraph_PresentationPr_Bullet = 32;
var historyitem_Paragraph_PresentationPr_Level = 33;
var historyitem_Paragraph_FramePr = 34;
var historyitem_Paragraph_PresentationBullet = 35;
var historyitem_TextPr_Change = 1;
var historyitem_TextPr_Bold = 2;
var historyitem_TextPr_Italic = 3;
var historyitem_TextPr_Strikeout = 4;
var historyitem_TextPr_Underline = 5;
var historyitem_TextPr_FontFamily = 6;
var historyitem_TextPr_FontSize = 7;
var historyitem_TextPr_Color = 8;
var historyitem_TextPr_VertAlign = 9;
var historyitem_TextPr_HighLight = 10;
var historyitem_TextPr_RStyle = 11;
var historyitem_TextPr_Spacing = 12;
var historyitem_TextPr_DStrikeout = 13;
var historyitem_TextPr_Caps = 14;
var historyitem_TextPr_SmallCaps = 15;
var historyitem_TextPr_Position = 16;
var historyitem_TextPr_Value = 17;
var historyitem_TextPr_Unifill = 18;
var historyitem_TextPr_RFonts = 19;
var historyitem_TextPr_Lang = 20;
var historyitem_Drawing_Size = 1;
var historyitem_Drawing_Url = 2;
var historyitem_Drawing_DrawingType = 3;
var historyitem_Drawing_WrappingType = 4;
var historyitem_Drawing_Distance = 5;
var historyitem_Drawing_AllowOverlap = 6;
var historyitem_Drawing_PositionH = 7;
var historyitem_Drawing_PositionV = 8;
var historyitem_Drawing_AbsoluteTransform = 9;
var historyitem_Drawing_BehindDoc = 10;
var historyitem_Drawing_SetZIndex = 11;
var historyitem_Drawing_SetGraphicObject = 12;
var historyitem_CalculateAfterPaste = 13;
var historyitem_DrawingObjects_AddItem = 1;
var historyitem_DrawingObjects_RemoveItem = 2;
var historyitem_FlowObjects_AddItem = 1;
var historyitem_FlowObjects_RemoveItem = 2;
var historyitem_FlowImage_Position = 1;
var historyitem_FlowImage_Size = 2;
var historyitem_FlowImage_Paddings = 3;
var historyitem_FlowImage_PageNum = 4;
var historyitem_FlowImage_Url = 5;
var historyitem_FlowImage_Parent = 6;
var historyitem_Table_DocNext = 1;
var historyitem_Table_DocPrev = 2;
var historyitem_Table_Parent = 3;
var historyitem_Table_TableW = 4;
var historyitem_Table_TableCellMar = 5;
var historyitem_Table_TableAlign = 6;
var historyitem_Table_TableInd = 7;
var historyitem_Table_TableBorder_Left = 8;
var historyitem_Table_TableBorder_Top = 9;
var historyitem_Table_TableBorder_Right = 10;
var historyitem_Table_TableBorder_Bottom = 11;
var historyitem_Table_TableBorder_InsideH = 12;
var historyitem_Table_TableBorder_InsideV = 13;
var historyitem_Table_TableShd = 14;
var historyitem_Table_Inline = 15;
var historyitem_Table_AddRow = 16;
var historyitem_Table_RemoveRow = 17;
var historyitem_Table_TableGrid = 18;
var historyitem_Table_TableLook = 19;
var historyitem_Table_TableStyleRowBandSize = 20;
var historyitem_Table_TableStyleColBandSize = 21;
var historyitem_Table_TableStyle = 22;
var historyitem_Table_AllowOverlap = 23;
var historyitem_Table_PositionH = 24;
var historyitem_Table_PositionV = 25;
var historyitem_Table_Distance = 26;
var historyitem_Table_Pr = 27;
var historyitem_Table_TableLayout = 28;
var historyitem_Table_SetStyleIndex = 29;
var historyitem_TableRow_Before = 1;
var historyitem_TableRow_After = 2;
var historyitem_TableRow_CellSpacing = 3;
var historyitem_TableRow_Height = 4;
var historyitem_TableRow_AddCell = 5;
var historyitem_TableRow_RemoveCell = 6;
var historyitem_TableRow_TableHeader = 7;
var historyitem_TableRow_Pr = 8;
var historyitem_TableCell_GridSpan = 1;
var historyitem_TableCell_Margins = 2;
var historyitem_TableCell_Shd = 3;
var historyitem_TableCell_VMerge = 4;
var historyitem_TableCell_Border_Left = 5;
var historyitem_TableCell_Border_Right = 6;
var historyitem_TableCell_Border_Top = 7;
var historyitem_TableCell_Border_Bottom = 8;
var historyitem_TableCell_VAlign = 9;
var historyitem_TableCell_W = 10;
var historyitem_DocumentContent_AddItem = 1;
var historyitem_DocumentContent_RemoveItem = 2;
var historyitem_FlowTable_Position = 1;
var historyitem_FlowTable_Paddings = 2;
var historyitem_FlowTable_PageNum = 3;
var historyitem_FlowTable_Parent = 4;
var historyitem_HdrFtrController_AddItem = 1;
var historyitem_HdrFtrController_RemoveItem = 2;
var historyitem_HdrFtr_BoundY2 = 1;
var historyitem_AbstractNum_LvlChange = 1;
var historyitem_AbstractNum_TextPrChange = 2;
var historyitem_TableId_Add = 1;
var historyitem_TableId_Reset = 2;
var historyitem_Comments_Add = 1;
var historyitem_Comments_Remove = 2;
var historyitem_Comment_Change = 1;
var historyitem_Comment_TypeInfo = 2;
var historyitem_Comment_Position = 3;
var historyitem_Hyperlink_Value = 1;
var historyitem_Hyperlink_ToolTip = 2;
var historyitem_AddNewGraphicObject = 0;
var historyitem_RemoveGraphicObject = 1;
var historyitem_SetGuideValue = 0;
var historyitem_SetAdjustmentValue = 1;
var historyitem_RemoveFromSpTree = 0;
var historyitem_AddToSlideSpTree = 1;
var historyitem_AddSlideLocks = 2;
var historyitem_ChangeBg = 3;
var historyitem_ChangeTiming = 4;
var historyitem_SetLayout = 5;
var historyitem_SetSlideNum = 6;
var historyitem_ShapeAdd = 7;
var historyitem_SetCSldName = 8;
var historyitem_SetClrMapOverride = 9;
var historyitem_SetShow = 10;
var historyitem_SetShowPhAnim = 11;
var historyitem_SetShowMasterSp = 12;
var historyitem_AddComment = 13;
var historyitem_RemoveComment = 14;
var historyitem_MoveComment = 15;
var historyitem_SetTxStyles = 16;
var historyitem_AddLayout = 17;
var historyitem_SetLayoutMatchingName = 18;
var historyitem_SetLayoutMaster = 19;
var historyitem_SetLayoutType = 20;
var historyitem_SetMasterTheme = 21;
var historyitem_SetSlideComments = 22;
var historyitem_SetSlideSizes = 23;
var historyitem_PropLockerSetId = 0;
var historyitem_Presenattion_AddSlide = 1;
var historyitem_Presenattion_RemoveSlide = 2;
var historyitem_Presenattion_SlideSize = 3;
var historyitem_Presenattion_AddSlideMaster = 4;
var historyitem_SetAbsoluteTransform = 0;
var historyitem_SetXfrmShape = 1;
var historyitem_SetRotate = 2;
var historyitem_SetSizes = 3;
var historyitem_SetSizesInGroup = 4;
var historyitem_SetAdjValue = 5;
var historyitem_SetMainGroup = 7;
var historyitem_SetGroup = 8;
var historyitem_InitShape = 9;
var historyitem_AddGraphicObject = 10;
var historyitem_AddToSpTree = 11;
var historyitem_ChangeDiagram = 12;
var historyitem_Init2Shape = 13;
var historyitem_ChangeFill = 14;
var historyitem_ChangeLine = 15;
var historyitem_ChangePresetGeom = 16;
var historyitem_CreatePolyine = 17;
var historyitem_AddDocContent = 18;
var historyitem_SetSizes2 = 19;
var historyitem_RemoveFromSpTree = 20;
var historyitem_RemoveFromArrGraphicObj = 21;
var historyitem_RemoveFromArrGraphicObj2 = 22;
var historyitem_MoveShapeInArray = 23;
var historyitem_UpadteSpTreeBefore = 24;
var historyitem_UpadteSpTreeAfter = 25;
var historyitem_ChangeDiagram2 = 26;
var historyitem_SwapGrObject = 27;
var historyitem_SetSpPr = 28;
var historyitem_SetStyle = 29;
var historyitem_SetBodyPr = 30;
var historyitem_SetTextBoxContent = 31;
var historyitem_SetRasterImage2 = 32;
var historyitem_CalculateAfterCopyInGroup = 33;
var historyitem_SetVerticalShapeAlign = 34;
var historyitem_SetParent = 35;
var historyitem_SetShapeRot = 0;
var historyitem_SetShapeOffset = 1;
var historyitem_SetShapeExtents = 2;
var historyitem_SetShapeFlips = 3;
var historyitem_SetShapeParent = 4;
var historyitem_SetShapeChildOffset = 5;
var historyitem_SetShapeChildExtents = 6;
var historyitem_SetShapeSetFill = 7;
var historyitem_SetShapeSetLine = 8;
var historyitem_SetShapeSetGeometry = 9;
var historyitem_SetShapeBodyPr = 10;
var historyitem_SetSetNvSpPr = 11;
var historyitem_SetSetSpPr = 12;
var historyitem_SetSetStyle = 13;
var historyitem_SetTextBody = 14;
var historyitem_SetBlipFill = 15;
var historyitem_AddToGroupSpTree = 16;
var historyitem_SetSpGroup = 17;
var historyitem_SetSpParent = 18;
var historyitem_SetGraphicObject = 19;
var historyitem_RemoveFromSpTreeGroup = 20;
var historyitem_AutoShapes_SwapGraphicObjects = 21;
var historyitem_AutoShapes_AddChart = 22;
var historyitem_AutoShapes_SetChartTitleType = 23;
var historyitem_AutoShapes_SetChartGroup = 24;
var historyitem_AutoShapes_AddXAxis = 25;
var historyitem_AutoShapes_AddYAxis = 26;
var historyitem_AutoShapes_AddTitle = 27;
var historyitem_AutoShapes_SetChartTitleOverlay = 28;
var historyitem_AutoShapes_SetChartTitleTxBody = 29;
var historyitem_SetCahrtLayout = 1000;
var historyitem_SetShape = 0;
var historyitem_SetDocContent = 1;
var historyitem_SetLstStyle = 2;
var historyitem_ChangeColorScheme = 0;
var historyitem_ChangeFontScheme = 1;
var historyitem_ChangeFmtScheme = 2;
var historyitem_AddHdrFtrGrObjects = 0;
var historyitem_AddHdr = 0;
var historyitem_AddFtr = 1;
var historyitem_RemoveHdr = 2;
var historyitem_RemoveFtr = 3;
var historyitem_InternalChanges = 6;
var historyitem_GroupRecalculate = 32;
var historyitem_AddNewPoint = 0;
var historyitem_RemovePoint = 1;
var historyitem_MovePoint = 2;
var historyitem_UpdateWrapSizes = 3;
var historyitem_ChangePolygon = 4;
var historyitem_State_Unknown = 0;
var historyitem_State_Document = 1;
var historyitem_State_DocumentContent = 2;
var historyitem_State_Paragraph = 3;
var historyitem_State_Table = 4;
var historyrecalctype_Inline = 0;
var historyrecalctype_Flow = 1;
var historyrecalctype_HdrFtr = 2;
var historyitem_type_Unknown = 0;
var historyitem_type_TableId = 1;
var historyitem_type_Document = 2;
var historyitem_type_Paragraph = 3;
var historyitem_type_TextPr = 4;
var historyitem_type_Drawing = 5;
var historyitem_type_DrawingObjects = 6;
var historyitem_type_FlowObjects = 7;
var historyitem_type_FlowImage = 8;
var historyitem_type_Table = 9;
var historyitem_type_TableRow = 10;
var historyitem_type_TableCell = 11;
var historyitem_type_DocumentContent = 12;
var historyitem_type_FlowTable = 13;
var historyitem_type_HdrFtrController = 14;
var historyitem_type_HdrFtr = 15;
var historyitem_type_AbstractNum = 16;
var historyitem_type_Comment = 17;
var historyitem_type_Comments = 18;
var historyitem_type_Shape = 19;
var historyitem_type_Image = 20;
var historyitem_type_GroupShapes = 21;
var historyitem_type_Geometry = 22;
var historyitem_type_WrapPolygon = 23;
var historyitem_type_Chart = 24;
var historyitem_type_HdrFtrGrObjects = 25;
var historyitem_type_GrObjects = 26;
var historyitem_type_Hyperlink = 27;
var historyitem_type_ChartTitle = 28;
var historyitem_type_PropLocker = 29;
var historyitem_type_Slide = 30;
var historyitem_type_Layout = 31;
var historyitem_type_TextBody = 32;
var historyitem_type_GraphicFrame = 33;
var historyitem_type_Theme = 34;
var historyitem_type_SlideMaster = 35;
var historyitem_type_SlideComments = 36;
function CHistory(Document) {
    this.Index = -1;
    this.SavedIndex = -1;
    this.Points = new Array();
    this.Document = Document;
    this.RecalculateData = {
        Inline: {
            Pos: -1,
            PageNum: 0
        },
        Flow: new Array(),
        HdrFtr: new Array()
    };
    this.TurnOffHistory = false;
    this.BinaryWriter = new CMemory();
}
CHistory.prototype = {
    Is_Clear: function () {
        if (this.Points.length <= 0) {
            return true;
        }
        return false;
    },
    Clear: function () {
        this.Index = -1;
        this.SavedIndex = -1;
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
    Undo: function () {
        this.Check_UninonLastPoints();
        if (true != this.Can_Undo()) {
            return null;
        }
        if (this.Index === this.Points.length - 1) {
            this.LastState = this.Document.Get_SelectionState();
        }
        var Point = this.Points[this.Index--];
        this.Internal_RecalcData_Clear();
        for (var Index = Point.Items.length - 1; Index >= 0; Index--) {
            var Item = Point.Items[Index];
            Item.Class.Undo(Item.Data);
            Item.Class.Refresh_RecalcData(Item.Data);
        }
        this.Document.Set_SelectionState(Point.State);
        return this.RecalculateData;
    },
    Redo: function () {
        if (true != this.Can_Redo()) {
            return null;
        }
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
    Create_NewPoint: function () {
        this.Clear_Additional();
        this.Check_UninonLastPoints();
        var State = this.Document.Get_SelectionState();
        var Items = new Array();
        var Time = new Date().getTime();
        this.Points[++this.Index] = {
            State: State,
            Items: Items,
            Time: Time,
            Additional: {}
        };
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
        var Binary_Pos = this.BinaryWriter.GetCurPosition();
        Class.Save_Changes(Data, this.BinaryWriter);
        var Binary_Len = this.BinaryWriter.GetCurPosition() - Binary_Pos;
        var Item = {
            Class: Class,
            Data: Data,
            Binary: {
                Pos: Binary_Pos,
                Len: Binary_Len
            }
        };
        this.Points[this.Index].Items.push(Item);
        if ((Class instanceof CPresentation && (historyitem_Presenattion_AddSlide === Data.Type || historyitem_Presenattion_RemoveSlide === Data.Type)) || (Class instanceof Slide && (historyitem_RemoveFromSpTree === Data.Type || historyitem_AddToSlideSpTree === Data.Type || historyitem_ShapeAdd === Data.Type)) || Class instanceof SlideComments) {
            var bAdd = ((Class instanceof CPresentation && historyitem_Presenattion_AddSlide === Data.Type) || (Class instanceof SlideComments && historyitem_AddComment === Data.Type) || (Class instanceof Slide && (historyitem_AddToSlideSpTree === Data.Type || historyitem_ShapeAdd === Data.Type))) ? true : false;
            var Count = 1;
            var ContentChanges = new CContentChangesElement((bAdd == true ? contentchanges_Add : contentchanges_Remove), Data.Pos, Count, Item);
            Class.Add_ContentChanges(ContentChanges);
            CollaborativeEditing.Add_NewDC(Class);
        }
    },
    Internal_RecalcData_Clear: function () {
        this.RecalculateData = {
            Inline: {
                Pos: -1,
                PageNum: 0
            },
            Flow: new Array(),
            HdrFtr: new Array()
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
            if (Data.Data.Pos < this.RecalculateData.Inline.Pos || this.RecalculateData.Inline.Pos < 0) {
                this.RecalculateData.Inline.Pos = Data.Data.Pos;
                this.RecalculateData.Inline.PageNum = Data.Data.PageNum;
            }
            break;
        }
    },
    Check_UninonLastPoints: function () {
        if (this.Points.length < 2 || this.SavedIndex >= this.Points.length - 2) {
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
        this.Points.splice(this.Points.length - 2, 2, NewPoint);
        if (this.Index >= this.Points.length) {
            this.Index = this.Points.length - 1;
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
    },
    Have_Changes: function () {
        if (this.Index != this.SavedIndex) {
            return true;
        }
        return false;
    },
    Get_RecalcData: function () {
        if (this.Index >= 0) {
            var Point = this.Points[this.Index];
            this.Internal_RecalcData_Clear();
            for (var Index = 0; Index < Point.Items.length; Index++) {
                var Item = Point.Items[Index];
                Item.Class.Refresh_RecalcData(Item.Data);
            }
        }
        return this.RecalculateData;
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
            this.Points[this.Index].Additional = new Object();
        }
    },
    Get_EditingTime: function (dTime) {
        var Count = this.Points.length;
        var TimeLine = new Array();
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