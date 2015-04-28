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
var hdrftr_Header = 1;
var hdrftr_Footer = 2;
var hdrftr_Default = 1;
var hdrftr_Even = 2;
var hdrftr_First = 3;
function CHeaderFooter(Parent, LogicDocument, DrawingDocument, Type) {
    this.Id = g_oIdCounter.Get_NewId();
    this.Parent = Parent;
    this.DrawingDocument = DrawingDocument;
    this.LogicDocument = LogicDocument;
    if ("undefined" != typeof(LogicDocument) && null != LogicDocument) {
        if (Type === hdrftr_Header) {
            this.Content = new CDocumentContent(this, DrawingDocument, 0, 0, 0, 0, false, true);
            this.Content.Content[0].Style_Add(this.Get_Styles().Get_Default_Header());
        } else {
            this.Content = new CDocumentContent(this, DrawingDocument, 0, 0, 0, 0, false, true);
            this.Content.Content[0].Style_Add(this.Get_Styles().Get_Default_Footer());
        }
    }
    this.Type = Type;
    this.RecalcInfo = {
        CurPage: -1,
        RecalcObj: {},
        NeedRecalc: {},
        SectPr: {}
    };
    g_oTableId.Add(this, this.Id);
}
CHeaderFooter.prototype = {
    Set_Id: function (newId) {
        g_oTableId.Reset_Id(this, newId, this.Id);
        this.Id = newId;
    },
    Get_Id: function () {
        return this.Id;
    },
    Get_Theme: function () {
        return this.LogicDocument.Get_Theme();
    },
    Get_ColorMap: function () {
        return this.LogicDocument.Get_ColorMap();
    },
    Copy: function () {
        var NewHdrFtr = new CHeaderFooter(this.Parent, this.LogicDocument, this.DrawingDocument, this.Type);
        NewHdrFtr.Content.Copy2(this.Content);
        return NewHdrFtr;
    },
    Set_Page: function (Page_abs) {
        if (Page_abs !== this.RecalcInfo.CurPage && undefined !== this.LogicDocument.Pages[Page_abs]) {
            var HdrFtrController = this.Parent;
            var HdrFtrPage = this.Parent.Pages[Page_abs];
            if (undefined === HdrFtrPage || (this !== HdrFtrPage.Header && this !== HdrFtrPage.Footer)) {
                return;
            }
            var RecalcObj = this.RecalcInfo.RecalcObj[Page_abs];
            if (undefined !== RecalcObj) {
                this.RecalcInfo.CurPage = Page_abs;
                this.Content.Load_RecalculateObject(RecalcObj);
            }
        }
    },
    Is_NeedRecalculate: function (Page_abs) {
        var PageNumInfo = this.LogicDocument.Get_SectionPageNumInfo(Page_abs);
        if (true === PageNumInfo.Compare(this.RecalcInfo.NeedRecalc[Page_abs]) && undefined !== this.RecalcInfo.RecalcObj[Page_abs]) {
            return false;
        }
        return true;
    },
    Recalculate: function (Page_abs, SectPr) {
        var bChanges = false;
        var RecalcObj = this.RecalcInfo.RecalcObj[Page_abs];
        var OldSumH = 0;
        var OldBounds = null;
        var OldFlowPos = [];
        if (undefined === RecalcObj) {
            bChanges = true;
        } else {
            OldSumH = RecalcObj.Get_SummaryHeight();
            OldBounds = RecalcObj.Get_PageBounds(0);
            RecalcObj.Get_DrawingFlowPos(OldFlowPos);
        }
        this.Content.Set_StartPage(Page_abs);
        this.Content.Prepare_RecalculateObject();
        var CurPage = 0;
        var RecalcResult = recalcresult2_NextPage;
        while (recalcresult2_End != RecalcResult) {
            RecalcResult = this.Content.Recalculate_Page(CurPage++, true);
        }
        this.RecalcInfo.RecalcObj[Page_abs] = this.Content.Save_RecalculateObject();
        this.RecalcInfo.NeedRecalc[Page_abs] = this.LogicDocument.Get_SectionPageNumInfo(Page_abs);
        this.RecalcInfo.SectPr[Page_abs] = SectPr;
        if (false === bChanges) {
            var NewBounds = this.Content.Get_PageBounds(0);
            if ((Math.abs(NewBounds.Bottom - OldBounds.Bottom) > 0.001 && hdrftr_Header === this.Type) || (Math.abs(NewBounds.Top - OldBounds.Top) > 0.001 && hdrftr_Footer === this.Type)) {
                bChanges = true;
            }
        }
        if (false === bChanges) {
            var NewFlowPos = [];
            var AllDrawingObjects = this.Content.Get_AllDrawingObjects();
            var Count = AllDrawingObjects.length;
            for (var Index = 0; Index < Count; Index++) {
                var Obj = AllDrawingObjects[Index];
                if (drawing_Anchor === Obj.Get_DrawingType() && true === Obj.Use_TextWrap()) {
                    var FlowPos = {
                        X: Obj.X - Obj.Distance.L,
                        Y: Obj.Y - Obj.Distance.T,
                        W: Obj.W + Obj.Distance.R,
                        H: Obj.H + Obj.Distance.B
                    };
                    NewFlowPos.push(FlowPos);
                }
            }
            Count = NewFlowPos.length;
            if (Count != OldFlowPos.length) {
                bChanges = true;
            } else {
                for (var Index = 0; Index < Count; Index++) {
                    var OldObj = OldFlowPos[Index];
                    var NewObj = NewFlowPos[Index];
                    if (Math.abs(OldObj.X - NewObj.X) > 0.001 || Math.abs(OldObj.Y - NewObj.Y) > 0.001 || Math.abs(OldObj.H - NewObj.H) > 0.001 || Math.abs(OldObj.W - NewObj.W) > 0.001) {
                        bChanges = true;
                        break;
                    }
                }
            }
        }
        if (false === bChanges) {
            var NewSumH = this.Content.Get_SummaryHeight();
            if (Math.abs(OldSumH - NewSumH) > 0.001) {
                bChanges = true;
            }
        }
        if (-1 === this.RecalcInfo.CurPage || false === this.LogicDocument.Get_SectionPageNumInfo(this.RecalcInfo.CurPage).Compare(this.RecalcInfo.NeedRecalc[this.RecalcInfo.CurPage])) {
            this.RecalcInfo.CurPage = Page_abs;
            if (docpostype_HdrFtr === this.LogicDocument.CurPos.Type) {
                this.LogicDocument.Document_UpdateSelectionState();
                this.LogicDocument.Document_UpdateInterfaceState();
            }
        } else {
            var RecalcObj = this.RecalcInfo.RecalcObj[this.RecalcInfo.CurPage];
            this.Content.Load_RecalculateObject(RecalcObj);
        }
        return bChanges;
    },
    Recalculate2: function (Page_abs) {
        this.Content.Set_StartPage(Page_abs);
        this.Content.Prepare_RecalculateObject();
        var CurPage = 0;
        var RecalcResult = recalcresult2_NextPage;
        while (recalcresult2_End != RecalcResult) {
            RecalcResult = this.Content.Recalculate_Page(CurPage++, true);
        }
    },
    Reset_RecalculateCache: function () {
        this.Refresh_RecalcData2();
        this.Content.Reset_RecalculateCache();
    },
    Get_Styles: function () {
        return this.LogicDocument.Get_Styles();
    },
    Get_TableStyleForPara: function () {
        return null;
    },
    Get_ShapeStyleForPara: function () {
        return null;
    },
    Get_TextBackGroundColor: function () {
        return undefined;
    },
    Get_PageContentStartPos: function () {
        return {
            X: this.Content.X,
            Y: 0,
            XLimit: this.Content.XLimit,
            YLimit: 0
        };
    },
    Set_CurrentElement: function (bUpdateStates) {
        var PageIndex = -1;
        for (var Key in this.Parent.Pages) {
            var PIndex = Key | 0;
            if ((this === this.Parent.Pages[PIndex].Header || this === this.Parent.Pages[PIndex].Footer) && (-1 === PageIndex || PageIndex > PIndex)) {
                PageIndex = PIndex;
            }
        }
        if (-1 === PageIndex) {
            return;
        }
        this.Parent.CurHdrFtr = this;
        this.Parent.WaitMouseDown = true;
        this.Parent.CurPage = PageIndex;
        var OldDocPosType = this.LogicDocument.CurPos.Type;
        this.LogicDocument.CurPos.Type = docpostype_HdrFtr;
        if (true === bUpdateStates) {
            this.Set_Page(PageIndex);
            this.LogicDocument.Document_UpdateInterfaceState();
            this.LogicDocument.Document_UpdateRulersState();
            this.LogicDocument.Document_UpdateSelectionState();
        }
        if (docpostype_HdrFtr !== OldDocPosType) {
            this.DrawingDocument.ClearCachePages();
            this.DrawingDocument.FirePaint();
        }
    },
    Is_ThisElementCurrent: function () {
        if (this === this.Parent.CurHdrFtr && docpostype_HdrFtr === this.LogicDocument.CurPos.Type) {
            return true;
        }
        return false;
    },
    Reset: function (X, Y, XLimit, YLimit) {
        this.Content.Reset(X, Y, XLimit, YLimit);
    },
    Draw: function (nPageIndex, pGraphics) {
        this.Content.Draw(nPageIndex, pGraphics);
    },
    OnContentRecalculate: function (bChange, bForceRecalc) {
        return;
    },
    OnContentReDraw: function (StartPage, EndPage) {
        this.DrawingDocument.ClearCachePages();
        this.DrawingDocument.FirePaint();
    },
    RecalculateCurPos: function () {
        if (-1 !== this.RecalcInfo.CurPage) {
            return this.Content.RecalculateCurPos();
        }
        return null;
    },
    Get_NearestPos: function (X, Y, bAnchor, Drawing) {
        return this.Content.Get_NearestPos(this.Content.StartPage, X, Y, bAnchor, Drawing);
    },
    Get_Numbering: function () {
        return this.LogicDocument.Get_Numbering();
    },
    Get_Bounds: function () {
        return this.Content.Get_PageBounds(0);
    },
    Get_DividingLine: function (PageIndex) {
        var OldPage = this.RecalcInfo.CurPage;
        this.Set_Page(PageIndex);
        var Bounds = this.Get_Bounds();
        if (-1 !== OldPage) {
            this.Set_Page(OldPage);
        }
        if (hdrftr_Footer === this.Type) {
            return Bounds.Top;
        } else {
            return Bounds.Bottom;
        }
    },
    Is_PointInDrawingObjects: function (X, Y) {
        return this.Content.Is_PointInDrawingObjects(X, Y, this.Content.Get_StartPage_Absolute());
    },
    CheckRange: function (X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf) {
        return this.Content.CheckRange(X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf, 0, false);
    },
    AddPageNum: function (Align) {
        var StyleId = null;
        if (this.Type === hdrftr_Header) {
            StyleId = this.Get_Styles().Get_Default_Header();
        } else {
            StyleId = this.Get_Styles().Get_Default_Footer();
        }
        this.Content.HdrFtr_AddPageNum(Align, StyleId);
    },
    Is_Cell: function () {
        return false;
    },
    Is_HdrFtr: function (bReturnHdrFtr) {
        if (true === bReturnHdrFtr) {
            return this;
        }
        return true;
    },
    Is_DrawingShape: function () {
        return false;
    },
    Is_TopDocument: function (bReturnTopDocument) {
        if (true === bReturnTopDocument) {
            return this.Content;
        }
        return true;
    },
    Is_InTable: function (bReturnTopTable) {
        if (true === bReturnTopTable) {
            return null;
        }
        return false;
    },
    Is_SelectionUse: function () {
        return this.Content.Is_SelectionUse();
    },
    Is_TextSelectionUse: function () {
        return this.Content.Is_TextSelectionUse();
    },
    Is_UseInDocument: function (Id) {
        if (null != this.Parent) {
            return this.Parent.Is_UseInDocument(this.Get_Id());
        }
        return false;
    },
    Check_Page: function (PageIndex) {
        return this.Parent.Check_Page(this, PageIndex);
    },
    Get_CurPosXY: function () {
        return this.Content.Get_CurPosXY();
    },
    Get_SelectedText: function (bClearText) {
        return this.Content.Get_SelectedText(bClearText);
    },
    Get_SelectedElementsInfo: function (Info) {
        this.Content.Get_SelectedElementsInfo(Info);
    },
    Get_SelectedContent: function (SelectedContent) {
        this.Content.Get_SelectedContent(SelectedContent);
    },
    Update_CursorType: function (X, Y, PageNum_Abs) {
        if (PageNum_Abs != this.Content.Get_StartPage_Absolute()) {
            this.DrawingDocument.SetCursorType("default", new CMouseMoveData());
        } else {
            return this.Content.Update_CursorType(X, Y, PageNum_Abs);
        }
    },
    Is_TableBorder: function (X, Y, PageNum_Abs) {
        this.Set_Page(PageNum_Abs);
        return this.Content.Is_TableBorder(X, Y, PageNum_Abs);
    },
    Is_InText: function (X, Y, PageNum_Abs) {
        this.Set_Page(PageNum_Abs);
        return this.Content.Is_InText(X, Y, PageNum_Abs);
    },
    Is_InDrawing: function (X, Y, PageNum_Abs) {
        this.Set_Page(PageNum_Abs);
        return this.Content.Is_InDrawing(X, Y, PageNum_Abs);
    },
    Document_UpdateInterfaceState: function () {
        this.Content.Document_UpdateInterfaceState();
    },
    Document_UpdateRulersState: function () {
        if (-1 === this.RecalcInfo.CurPage) {
            return;
        }
        var Index = this.LogicDocument.Pages[this.RecalcInfo.CurPage].Pos;
        var SectPr = this.LogicDocument.SectionsInfo.Get_SectPr(Index).SectPr;
        var Bounds = this.Get_Bounds();
        if (this.Type === hdrftr_Header) {
            this.DrawingDocument.Set_RulerState_HdrFtr(true, Bounds.Top, Math.max(Bounds.Bottom, SectPr.Get_PageMargin_Top()));
        } else {
            this.DrawingDocument.Set_RulerState_HdrFtr(false, Bounds.Top, SectPr.Get_PageHeight());
        }
        this.Content.Document_UpdateRulersState(this.Content.Get_StartPage_Absolute());
    },
    Document_UpdateSelectionState: function () {
        if (docpostype_DrawingObjects == this.Content.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.documentUpdateSelectionState();
        } else {
            if (true === this.Content.Is_SelectionUse()) {
                if (selectionflag_Numbering == this.Content.Selection.Flag) {
                    this.DrawingDocument.TargetEnd();
                    this.DrawingDocument.SelectEnabled(true);
                    this.DrawingDocument.SelectClear();
                    this.DrawingDocument.SelectShow();
                } else {
                    if (null != this.Content.Selection.Data && true === this.Content.Selection.Data.TableBorder && type_Table == this.Content.Content[this.Content.Selection.Data.Pos].GetType()) {
                        this.DrawingDocument.TargetEnd();
                    } else {
                        if (false === this.Content.Selection_IsEmpty()) {
                            this.DrawingDocument.TargetEnd();
                            this.DrawingDocument.SelectEnabled(true);
                            this.DrawingDocument.SelectClear();
                            this.DrawingDocument.SelectShow();
                        } else {
                            this.DrawingDocument.SelectEnabled(false);
                            this.RecalculateCurPos();
                            this.DrawingDocument.TargetStart();
                            this.DrawingDocument.TargetShow();
                        }
                    }
                }
            } else {
                this.DrawingDocument.SelectEnabled(false);
                this.RecalculateCurPos();
                this.DrawingDocument.TargetStart();
                this.DrawingDocument.TargetShow();
            }
        }
    },
    Add_NewParagraph: function () {
        this.Content.Add_NewParagraph();
    },
    Add_InlineImage: function (W, H, Img, Chart, bFlow) {
        this.Content.Add_InlineImage(W, H, Img, Chart, bFlow);
    },
    Edit_Chart: function (Chart) {
        this.Content.Edit_Chart(Chart);
    },
    Add_InlineTable: function (Cols, Rows) {
        this.Content.Add_InlineTable(Cols, Rows);
    },
    Paragraph_Add: function (ParaItem, bRecalculate) {
        this.Content.Paragraph_Add(ParaItem, bRecalculate);
    },
    Paragraph_ClearFormatting: function () {
        this.Content.Paragraph_ClearFormatting();
    },
    Paragraph_Format_Paste: function (TextPr, ParaPr, ApplyPara) {
        this.Content.Paragraph_Format_Paste(TextPr, ParaPr, ApplyPara);
    },
    Remove: function (Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd) {
        this.Content.Remove(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd);
    },
    Cursor_GetPos: function () {
        return this.Content.Cursor_GetPos();
    },
    Cursor_MoveLeft: function (AddToSelect, Word) {
        var bRetValue = this.Content.Cursor_MoveLeft(AddToSelect, Word);
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
        return bRetValue;
    },
    Cursor_MoveRight: function (AddToSelect, Word) {
        var bRetValue = this.Content.Cursor_MoveRight(AddToSelect, Word);
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
        return bRetValue;
    },
    Cursor_MoveUp: function (AddToSelect) {
        var bRetValue = this.Content.Cursor_MoveUp(AddToSelect);
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
        return bRetValue;
    },
    Cursor_MoveDown: function (AddToSelect) {
        var bRetValue = this.Content.Cursor_MoveDown(AddToSelect);
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
        return bRetValue;
    },
    Cursor_MoveEndOfLine: function (AddToSelect) {
        var bRetValue = this.Content.Cursor_MoveEndOfLine(AddToSelect);
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
        return bRetValue;
    },
    Cursor_MoveStartOfLine: function (AddToSelect) {
        var bRetValue = this.Content.Cursor_MoveStartOfLine(AddToSelect);
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
        return bRetValue;
    },
    Cursor_MoveToStartPos: function (AddToSelect) {
        var bRetValue = this.Content.Cursor_MoveToStartPos(AddToSelect);
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
        return bRetValue;
    },
    Cursor_MoveToEndPos: function (AddToSelect) {
        var bRetValue = this.Content.Cursor_MoveToEndPos(AddToSelect);
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
        return bRetValue;
    },
    Cursor_MoveAt: function (X, Y, PageIndex, AddToSelect, bRemoveOldSelection) {
        this.Set_Page(PageIndex);
        return this.Content.Cursor_MoveAt(X, Y, AddToSelect, bRemoveOldSelection);
    },
    Cursor_MoveToCell: function (bNext) {
        this.Content.Cursor_MoveToCell(bNext);
    },
    Set_ParagraphAlign: function (Align) {
        return this.Content.Set_ParagraphAlign(Align);
    },
    Set_ParagraphSpacing: function (Spacing) {
        return this.Content.Set_ParagraphSpacing(Spacing);
    },
    Set_ParagraphIndent: function (Ind) {
        return this.Content.Set_ParagraphIndent(Ind);
    },
    Set_ParagraphNumbering: function (NumInfo) {
        return this.Content.Set_ParagraphNumbering(NumInfo);
    },
    Set_ParagraphShd: function (Shd) {
        return this.Content.Set_ParagraphShd(Shd);
    },
    Set_ParagraphStyle: function (Name) {
        return this.Content.Set_ParagraphStyle(Name);
    },
    Set_ParagraphTabs: function (Tabs) {
        return this.Content.Set_ParagraphTabs(Tabs);
    },
    Set_ParagraphContextualSpacing: function (Value) {
        return this.Content.Set_ParagraphContextualSpacing(Value);
    },
    Set_ParagraphPageBreakBefore: function (Value) {
        return this.Content.Set_ParagraphPageBreakBefore(Value);
    },
    Set_ParagraphKeepLines: function (Value) {
        return this.Content.Set_ParagraphKeepLines(Value);
    },
    Set_ParagraphKeepNext: function (Value) {
        return this.Content.Set_ParagraphKeepNext(Value);
    },
    Set_ParagraphWidowControl: function (Value) {
        return this.Content.Set_ParagraphWidowControl(Value);
    },
    Set_ParagraphBorders: function (Value) {
        return this.Content.Set_ParagraphBorders(Value);
    },
    Paragraph_IncDecFontSize: function (bIncrease) {
        return this.Content.Paragraph_IncDecFontSize(bIncrease);
    },
    Paragraph_IncDecIndent: function (bIncrease) {
        return this.Content.Paragraph_IncDecIndent(bIncrease);
    },
    Set_ImageProps: function (Props) {
        return this.Content.Set_ImageProps(Props);
    },
    Set_TableProps: function (Props) {
        return this.Content.Set_TableProps(Props);
    },
    Get_Paragraph_ParaPr: function () {
        return this.Content.Get_Paragraph_ParaPr();
    },
    Get_Paragraph_TextPr: function () {
        return this.Content.Get_Paragraph_TextPr();
    },
    Get_Paragraph_TextPr_Copy: function () {
        return this.Content.Get_Paragraph_TextPr_Copy();
    },
    Get_Paragraph_ParaPr_Copy: function () {
        return this.Content.Get_Paragraph_ParaPr_Copy();
    },
    Get_AllParagraphs_ByNumbering: function (NumPr, ParaArray) {
        return this.Content.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
    },
    Get_PrevElementEndInfo: function (CurElement) {
        return null;
    },
    Selection_Remove: function () {
        return this.Content.Selection_Remove();
    },
    Selection_Draw_Page: function (Page_abs) {
        return this.Content.Selection_Draw_Page(Page_abs, true, true);
    },
    Selection_Clear: function () {
        return this.Content.Selection_Clear();
    },
    Selection_SetStart: function (X, Y, PageIndex, MouseEvent) {
        this.Set_Page(PageIndex);
        if (true === editor.isStartAddShape) {
            this.Content.CurPos.Type = docpostype_DrawingObjects;
            this.Content.Selection.Use = true;
            this.Content.Selection.Start = true;
            if (true != this.LogicDocument.DrawingObjects.isPolylineAddition()) {
                this.LogicDocument.DrawingObjects.startAddShape(editor.addShapePreset);
            }
            this.LogicDocument.DrawingObjects.OnMouseDown(MouseEvent, X, Y, PageIndex);
        } else {
            return this.Content.Selection_SetStart(X, Y, PageIndex, MouseEvent);
        }
    },
    Selection_SetEnd: function (X, Y, PageIndex, MouseEvent) {
        this.Set_Page(PageIndex);
        return this.Content.Selection_SetEnd(X, Y, PageIndex, MouseEvent);
    },
    Selection_Is_TableBorderMove: function () {
        return this.Content.Selection_Is_TableBorderMove();
    },
    Selection_Check: function (X, Y, Page_Abs, NearPos) {
        var HdrFtrPage = this.Content.Get_StartPage_Absolute();
        if (undefined !== NearPos || HdrFtrPage === Page_Abs) {
            return this.Content.Selection_Check(X, Y, Page_Abs, NearPos);
        }
        return false;
    },
    Select_All: function () {
        return this.Content.Select_All();
    },
    Get_CurrentParagraph: function () {
        return this.Content.Get_CurrentParagraph();
    },
    Get_StartPage_Absolute: function () {
        return 0;
    },
    Get_StartPage_Relative: function () {
        return 0;
    },
    Table_AddRow: function (bBefore) {
        this.Content.Table_AddRow(bBefore);
    },
    Table_AddCol: function (bBefore) {
        this.Content.Table_AddCol(bBefore);
    },
    Table_RemoveRow: function () {
        this.Content.Table_RemoveRow();
    },
    Table_RemoveCol: function () {
        this.Content.Table_RemoveCol();
    },
    Table_MergeCells: function () {
        this.Content.Table_MergeCells();
    },
    Table_SplitCell: function (Cols, Rows) {
        this.Content.Table_SplitCell(Cols, Rows);
    },
    Table_RemoveTable: function () {
        this.Content.Table_RemoveTable();
    },
    Table_Select: function (Type) {
        this.Content.Table_Select(Type);
    },
    Table_CheckMerge: function () {
        return this.Content.Table_CheckMerge();
    },
    Table_CheckSplit: function () {
        return this.Content.Table_CheckSplit();
    },
    Check_TableCoincidence: function (Table) {
        return false;
    },
    Get_ParentObject_or_DocumentPos: function () {
        return {
            Type: historyrecalctype_HdrFtr,
            Data: this
        };
    },
    Refresh_RecalcData: function (Data) {
        this.Refresh_RecalcData2();
    },
    Refresh_RecalcData2: function () {
        this.RecalcInfo.NeedRecalc = {};
        this.RecalcInfo.SectPr = {};
        this.RecalcInfo.CurPage = -1;
        History.RecalcData_Add({
            Type: historyrecalctype_HdrFtr,
            Data: this
        });
    },
    Refresh_RecalcData_BySection: function (SectPr) {
        var MinPageIndex = -1;
        for (var PageIndex in this.RecalcInfo.NeedRecalc) {
            if (SectPr === this.RecalcInfo.SectPr[PageIndex] && (-1 === MinPageIndex || PageIndex < MinPageIndex)) {
                MinPageIndex = PageIndex;
            }
        }
        for (var PageIndex in this.RecalcInfo.NeedRecalc) {
            if (PageIndex >= MinPageIndex) {
                delete this.RecalcInfo.NeedRecalc[PageIndex];
                delete this.RecalcInfo.SectPr[PageIndex];
            }
        }
    },
    Hyperlink_Add: function (HyperProps) {
        this.Content.Hyperlink_Add(HyperProps);
    },
    Hyperlink_Modify: function (HyperProps) {
        this.Content.Hyperlink_Modify(HyperProps);
    },
    Hyperlink_Remove: function () {
        this.Content.Hyperlink_Remove();
    },
    Hyperlink_CanAdd: function (bCheckInHyperlink) {
        return this.Content.Hyperlink_CanAdd(bCheckInHyperlink);
    },
    Hyperlink_Check: function (bCheckEnd) {
        return this.Content.Hyperlink_Check(bCheckEnd);
    },
    Document_CreateFontMap: function (FontMap) {
        this.Content.Document_CreateFontMap(FontMap);
    },
    Document_CrateFontCharMap: function (FontCharMap) {
        this.Content.Document_CreateFontCharMap(FontCharMap);
    },
    Document_Get_AllFontNames: function (AllFonts) {
        this.Content.Document_Get_AllFontNames(AllFonts);
    },
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(historyitem_type_HdrFtr);
        Writer.WriteString2(this.Id);
        Writer.WriteLong(this.Type);
        Writer.WriteString2(this.Content.Get_Id());
    },
    Read_FromBinary2: function (Reader) {
        var LogicDocument = editor.WordControl.m_oLogicDocument;
        this.Parent = LogicDocument.HdrFtr;
        this.DrawingDocument = LogicDocument.DrawingDocument;
        this.LogicDocument = LogicDocument;
        this.Id = Reader.GetString2();
        this.Type = Reader.GetLong();
        this.Content = g_oTableId.Get_ById(Reader.GetString2());
    },
    Add_Comment: function (Comment) {
        this.Content.Add_Comment(Comment, true, true);
    },
    CanAdd_Comment: function () {
        return this.Content.CanAdd_Comment();
    }
};
function CHeaderFooterController(LogicDocument, DrawingDocument) {
    this.Id = g_oIdCounter.Get_NewId();
    this.DrawingDocument = DrawingDocument;
    this.LogicDocument = LogicDocument;
    this.CurHdrFtr = null;
    this.Pages = {};
    this.CurPage = 0;
    this.ChangeCurPageOnEnd = true;
    this.WaitMouseDown = true;
    this.Lock = new CLock();
    g_oTableId.Add(this, this.Id);
}
CHeaderFooterController.prototype = {
    Set_Id: function (newId) {
        g_oTableId.Reset_Id(this, newId, this.Id);
        this.Id = newId;
    },
    Get_Id: function () {
        return this.Id;
    },
    Set_CurHdrFtr: function (HdrFtr) {
        if (null !== this.CurHdrFtr) {
            this.CurHdrFtr.Selection_Remove();
        }
        this.CurHdrFtr = HdrFtr;
    },
    GoTo_NextHdrFtr: function () {
        var CurHdrFtr = this.CurHdrFtr;
        if (null === CurHdrFtr || -1 === CurHdrFtr.RecalcInfo.CurPage) {
            return;
        }
        var CurPage = CurHdrFtr.RecalcInfo.CurPage;
        var Pages = this.Pages;
        if (hdrftr_Header === CurHdrFtr.Type && undefined !== Pages[CurPage].Footer) {
            CurHdrFtr = Pages[CurPage].Footer;
        } else {
            CurHdrFtr = null;
        }
        while (null === CurHdrFtr) {
            CurPage++;
            if (undefined === Pages[CurPage]) {
                break;
            } else {
                if (undefined !== Pages[CurPage].Header && null !== Pages[CurPage].Header) {
                    CurHdrFtr = Pages[CurPage].Header;
                } else {
                    if (undefined !== Pages[CurPage].Footer && null !== Pages[CurPage].Footer) {
                        CurHdrFtr = Pages[CurPage].Footer;
                    }
                }
            }
        }
        if (null !== CurHdrFtr) {
            this.CurHdrFtr = CurHdrFtr;
            CurHdrFtr.Set_Page(CurPage);
            CurHdrFtr.Content.Cursor_MoveToStartPos(false);
            return true;
        }
        return false;
    },
    GoTo_PrevHdrFtr: function () {
        var CurHdrFtr = this.CurHdrFtr;
        if (null === CurHdrFtr || -1 === CurHdrFtr.RecalcInfo.CurPage) {
            return;
        }
        var CurPage = CurHdrFtr.RecalcInfo.CurPage;
        var Pages = this.Pages;
        if (hdrftr_Footer === CurHdrFtr.Type && undefined !== Pages[CurPage].Header) {
            CurHdrFtr = Pages[CurPage].Header;
        } else {
            CurHdrFtr = null;
        }
        while (null === CurHdrFtr) {
            CurPage--;
            if (undefined === Pages[CurPage]) {
                return;
            } else {
                if (undefined !== Pages[CurPage].Footer && null !== Pages[CurPage].Footer) {
                    CurHdrFtr = Pages[CurPage].Footer;
                } else {
                    if (undefined !== Pages[CurPage].Header && null !== Pages[CurPage].Header) {
                        CurHdrFtr = Pages[CurPage].Header;
                    }
                }
            }
        }
        if (null !== CurHdrFtr) {
            this.CurHdrFtr = CurHdrFtr;
            CurHdrFtr.Set_Page(CurPage);
            CurHdrFtr.Content.Cursor_MoveToStartPos(false);
            return true;
        }
        return false;
    },
    Get_CurPage: function () {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Content.Get_StartPage_Absolute();
        }
        return 0;
    },
    Get_Props: function () {
        if (null != this.CurHdrFtr && -1 !== this.CurHdrFtr.RecalcInfo.CurPage) {
            var Pr = {};
            Pr.Type = this.CurHdrFtr.Type;
            if (undefined === this.LogicDocument.Pages[this.CurHdrFtr.RecalcInfo.CurPage]) {
                return Pr;
            }
            var Index = this.LogicDocument.Pages[this.CurHdrFtr.RecalcInfo.CurPage].Pos;
            var SectPr = this.LogicDocument.SectionsInfo.Get_SectPr(Index).SectPr;
            if (hdrftr_Footer === Pr.Type) {
                Pr.Position = SectPr.Get_PageMargins_Footer();
            } else {
                Pr.Position = SectPr.Get_PageMargins_Header();
            }
            Pr.DifferentFirst = SectPr.Get_TitlePage();
            Pr.DifferentEvenOdd = EvenAndOddHeaders;
            if (SectPr === this.LogicDocument.SectionsInfo.Get_SectPr2(0).SectPr) {
                Pr.LinkToPrevious = null;
            } else {
                var PageIndex = this.CurHdrFtr.RecalcInfo.CurPage;
                var SectionPageInfo = this.LogicDocument.Get_SectionPageNumInfo(PageIndex);
                var bFirst = (true === SectionPageInfo.bFirst && true === SectPr.Get_TitlePage() ? true : false);
                var bEven = (true === SectionPageInfo.bEven && true === EvenAndOddHeaders ? true : false);
                var bHeader = (hdrftr_Header === this.CurHdrFtr.Type ? true : false);
                Pr.LinkToPrevious = (null === SectPr.Get_HdrFtr(bHeader, bFirst, bEven) ? true : false);
            }
            Pr.Locked = this.Lock.Is_Locked();
            return Pr;
        } else {
            return null;
        }
    },
    Set_CurHdrFtr_ById: function (Id) {
        var HdrFtr = g_oTableId.Get_ById(Id);
        if (-1 === this.LogicDocument.SectionsInfo.Find_ByHdrFtr(HdrFtr)) {
            return false;
        }
        this.CurHdrFtr = HdrFtr;
        HdrFtr.Content.Cursor_MoveToStartPos();
        return true;
    },
    RecalculateCurPos: function () {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.RecalculateCurPos();
        }
        return null;
    },
    Recalculate: function (PageIndex) {
        var SectionPageInfo = this.LogicDocument.Get_SectionPageNumInfo(PageIndex);
        var bFirst = SectionPageInfo.bFirst;
        var bEven = SectionPageInfo.bEven;
        var HdrFtr = this.LogicDocument.Get_SectionHdrFtr(PageIndex, bFirst, bEven);
        var Header = HdrFtr.Header;
        var Footer = HdrFtr.Footer;
        var SectPr = HdrFtr.SectPr;
        this.Pages[PageIndex] = new CHdrFtrPage();
        this.Pages[PageIndex].Header = Header;
        this.Pages[PageIndex].Footer = Footer;
        var X, XLimit;
        var X = SectPr.Get_PageMargin_Left();
        var XLimit = SectPr.Get_PageWidth() - SectPr.Get_PageMargin_Right();
        var bRecalcHeader = false;
        var HeaderDrawings, HeaderTables, FooterDrawings, FooterTables;
        if (null !== Header) {
            if (true === Header.Is_NeedRecalculate(PageIndex)) {
                var Y = SectPr.Get_PageMargins_Header();
                var YLimit = SectPr.Get_PageHeight() / 2;
                Header.Reset(X, Y, XLimit, YLimit);
                bRecalcHeader = Header.Recalculate(PageIndex, SectPr);
            } else {
                if (-1 === Header.RecalcInfo.CurPage) {
                    Header.Set_Page(PageIndex);
                }
            }
            HeaderDrawings = Header.Content.Get_AllDrawingObjects([]);
            HeaderTables = Header.Content.Get_AllFloatElements();
        }
        var bRecalcFooter = false;
        if (null !== Footer) {
            if (true === Footer.Is_NeedRecalculate(PageIndex)) {
                var Y = 0;
                var YLimit = SectPr.Get_PageHeight();
                Footer.Reset(X, Y, XLimit, YLimit);
                Footer.Recalculate2(PageIndex);
                var SummaryHeight = Footer.Content.Get_SummaryHeight();
                Y = Math.max(2 * YLimit / 3, YLimit - SectPr.Get_PageMargins_Footer() - SummaryHeight);
                Footer.Reset(X, Y, XLimit, YLimit);
                bRecalcFooter = Footer.Recalculate(PageIndex, SectPr);
            } else {
                if (-1 === Footer.RecalcInfo.CurPage) {
                    Footer.Set_Page(PageIndex);
                }
            }
            FooterDrawings = Footer.Content.Get_AllDrawingObjects([]);
            FooterTables = Footer.Content.Get_AllFloatElements();
        }
        this.LogicDocument.DrawingObjects.mergeDrawings(PageIndex, HeaderDrawings, HeaderTables, FooterDrawings, FooterTables);
        if (true === bRecalcHeader || true === bRecalcFooter) {
            return true;
        }
        return false;
    },
    Draw: function (nPageIndex, pGraphics) {
        var Header = this.Pages[nPageIndex].Header;
        var Footer = this.Pages[nPageIndex].Footer;
        var OldPageHdr = Header && Header.RecalcInfo.CurPage;
        var OldPageFtr = Footer && Footer.RecalcInfo.CurPage;
        Header && Header.Set_Page(nPageIndex);
        Footer && Footer.Set_Page(nPageIndex);
        this.LogicDocument.DrawingObjects.drawBehindDocHdrFtr(nPageIndex, pGraphics);
        this.LogicDocument.DrawingObjects.drawWrappingObjectsHdrFtr(nPageIndex, pGraphics);
        if (null !== Header) {
            Header.Draw(nPageIndex, pGraphics);
        }
        if (null !== Footer) {
            Footer.Draw(nPageIndex, pGraphics);
        }
        this.LogicDocument.DrawingObjects.drawBeforeObjectsHdrFtr(nPageIndex, pGraphics);
        Header && Header.Set_Page(OldPageHdr);
        Footer && Footer.Set_Page(OldPageFtr);
    },
    CheckRange: function (X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf, PageIndex) {
        if (undefined === this.Pages[PageIndex]) {
            return [];
        }
        var Header = this.Pages[PageIndex].Header;
        var Footer = this.Pages[PageIndex].Footer;
        var HeaderRange = [];
        var FooterRange = [];
        if (null != Header) {
            HeaderRange = Header.CheckRange(X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf);
        }
        if (null != Footer) {
            FooterRange = Footer.CheckRange(X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf);
        }
        return HeaderRange.concat(FooterRange);
    },
    Get_HdrFtrLines: function (PageIndex) {
        var Header = null;
        var Footer = null;
        if (undefined !== this.Pages[PageIndex]) {
            Header = this.Pages[PageIndex].Header;
            Footer = this.Pages[PageIndex].Footer;
        }
        var Top = null;
        if (null !== Header) {
            Top = Header.Get_DividingLine(PageIndex);
        }
        var Bottom = null;
        if (null !== Footer) {
            Bottom = Footer.Get_DividingLine(PageIndex);
        }
        return {
            Top: Top,
            Bottom: Bottom
        };
    },
    Update_CursorType: function (X, Y, PageNum_Abs) {
        if (true === this.Lock.Is_Locked()) {
            var PageLimits = this.LogicDocument.Get_PageContentStartPos(PageNum_Abs);
            var MMData_header = new CMouseMoveData();
            var Coords = this.DrawingDocument.ConvertCoordsToCursorWR(PageLimits.X, PageLimits.Y, PageNum_Abs);
            MMData_header.X_abs = Coords.X;
            MMData_header.Y_abs = Coords.Y + 2;
            MMData_header.Type = c_oAscMouseMoveDataTypes.LockedObject;
            MMData_header.UserId = this.Lock.Get_UserId();
            MMData_header.HaveChanges = this.Lock.Have_Changes();
            MMData_header.LockedObjectType = c_oAscMouseMoveLockedObjectType.Header;
            editor.sync_MouseMoveCallback(MMData_header);
            var MMData_footer = new CMouseMoveData();
            Coords = this.DrawingDocument.ConvertCoordsToCursorWR(PageLimits.X, PageLimits.YLimit, PageNum_Abs);
            MMData_footer.X_abs = Coords.X;
            MMData_footer.Y_abs = Coords.Y - 2;
            MMData_footer.Type = c_oAscMouseMoveDataTypes.LockedObject;
            MMData_footer.UserId = this.Lock.Get_UserId();
            MMData_footer.HaveChanges = this.Lock.Have_Changes();
            MMData_footer.LockedObjectType = c_oAscMouseMoveLockedObjectType.Footer;
            editor.sync_MouseMoveCallback(MMData_footer);
        }
        if (null != this.CurHdrFtr) {
            if (true === this.LogicDocument.DrawingObjects.pointInSelectedObject(X, Y, PageNum_Abs)) {
                var NewPos = this.DrawingDocument.ConvertCoordsToAnotherPage(X, Y, PageNum_Abs, this.CurPage);
                var _X = NewPos.X;
                var _Y = NewPos.Y;
                return this.CurHdrFtr.Update_CursorType(_X, _Y, this.CurPage);
            } else {
                return this.CurHdrFtr.Update_CursorType(X, Y, PageNum_Abs);
            }
        }
    },
    Is_TableBorder: function (X, Y, PageNum_Abs) {
        var HdrFtr = this.Internal_GetContentByXY(X, Y, PageNum_Abs);
        if (null != HdrFtr) {
            return HdrFtr.Is_TableBorder(X, Y, PageNum_Abs);
        }
        return null;
    },
    Is_InText: function (X, Y, PageNum_Abs) {
        var HdrFtr = this.Internal_GetContentByXY(X, Y, PageNum_Abs);
        if (null != HdrFtr) {
            return HdrFtr.Is_InText(X, Y, PageNum_Abs);
        }
        return null;
    },
    Is_InDrawing: function (X, Y, PageNum_Abs) {
        var HdrFtr = this.Internal_GetContentByXY(X, Y, PageNum_Abs);
        if (null != HdrFtr) {
            return HdrFtr.Is_InDrawing(X, Y, PageNum_Abs);
        }
        return null;
    },
    Document_UpdateInterfaceState: function () {
        if (null != this.CurHdrFtr) {
            this.CurHdrFtr.Document_UpdateInterfaceState();
        }
    },
    Document_UpdateRulersState: function (CurPage) {
        if (null != this.CurHdrFtr) {
            this.CurHdrFtr.Document_UpdateRulersState(CurPage);
        }
    },
    Document_UpdateSelectionState: function () {
        if (null != this.CurHdrFtr) {
            this.CurHdrFtr.Document_UpdateSelectionState();
        }
    },
    Is_SelectionUse: function () {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Is_SelectionUse();
        }
        return false;
    },
    Is_TextSelectionUse: function () {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Is_TextSelectionUse();
        }
        return false;
    },
    Is_UseInDocument: function (Id) {
        var HdrFtr = g_oTableId.Get_ById(Id);
        if (-1 === this.LogicDocument.SectionsInfo.Find_ByHdrFtr(HdrFtr)) {
            return false;
        }
        return true;
    },
    Check_Page: function (HdrFtr, PageIndex) {
        var Header = this.Pages[PageIndex].Header;
        var Footer = this.Pages[PageIndex].Footer;
        if (HdrFtr === Header || HdrFtr === Footer) {
            return true;
        }
        return false;
    },
    Get_CurPosXY: function () {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Get_CurPosXY();
        }
        return {
            X: 0,
            Y: 0
        };
    },
    Get_SelectedText: function (bClearText) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Get_SelectedText(bClearText);
        }
        return null;
    },
    Get_SelectedElementsInfo: function (Info) {
        if (null != this.CurHdrFtr) {
            this.CurHdrFtr.Get_SelectedElementsInfo(Info);
        }
    },
    Get_SelectedContent: function (SelectedContent) {
        if (null != this.CurHdrFtr) {
            this.CurHdrFtr.Get_SelectedContent(SelectedContent);
        }
    },
    Add_NewParagraph: function () {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Add_NewParagraph();
        }
    },
    Add_InlineImage: function (W, H, Img, Chart, bFlow) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Add_InlineImage(W, H, Img, Chart, bFlow);
        }
    },
    Edit_Chart: function (Chart) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Edit_Chart(Chart);
        }
    },
    Add_InlineTable: function (Cols, Rows) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Add_InlineTable(Cols, Rows);
        }
    },
    Paragraph_Add: function (ParaItem, bRecalculate) {
        if (para_NewLine === ParaItem.Type && break_Page === ParaItem.BreakType) {
            return;
        }
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Paragraph_Add(ParaItem, bRecalculate);
        }
    },
    Paragraph_ClearFormatting: function () {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Paragraph_ClearFormatting();
        }
    },
    Paragraph_Format_Paste: function (TextPr, ParaPr, ApplyPara) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Paragraph_Format_Paste(TextPr, ParaPr, ApplyPara);
        }
    },
    Remove: function (Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Remove(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd);
        }
    },
    Cursor_GetPos: function () {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Cursor_GetPos();
        }
    },
    Cursor_MoveLeft: function (AddToSelect, Word) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Cursor_MoveLeft(AddToSelect, Word);
        }
    },
    Cursor_MoveRight: function (AddToSelect, Word) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Cursor_MoveRight(AddToSelect, Word);
        }
    },
    Cursor_MoveUp: function (AddToSelect) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Cursor_MoveUp(AddToSelect);
        }
    },
    Cursor_MoveDown: function (AddToSelect) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Cursor_MoveDown(AddToSelect);
        }
    },
    Cursor_MoveEndOfLine: function (AddToSelect) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Cursor_MoveEndOfLine(AddToSelect);
        }
    },
    Cursor_MoveStartOfLine: function (AddToSelect) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Cursor_MoveStartOfLine(AddToSelect);
        }
    },
    Cursor_MoveAt: function (X, Y, PageIndex, AddToSelect) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Cursor_MoveAt(X, Y, PageIndex, AddToSelect);
        }
    },
    Cursor_MoveToStartPos: function (AddToSelect) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Cursor_MoveToStartPos(AddToSelect);
        }
    },
    Cursor_MoveToEndPos: function (AddToSelect) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Cursor_MoveToEndPos(AddToSelect);
        }
    },
    Cursor_MoveToCell: function (bNext) {
        if (null != this.CurHdrFtr) {
            this.CurHdrFtr.Cursor_MoveToCell(bNext);
        }
    },
    Set_ParagraphAlign: function (Align) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Set_ParagraphAlign(Align);
        }
    },
    Set_ParagraphSpacing: function (Spacing) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Set_ParagraphSpacing(Spacing);
        }
    },
    Set_ParagraphIndent: function (Ind) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Set_ParagraphIndent(Ind);
        }
    },
    Set_ParagraphNumbering: function (NumInfo) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Set_ParagraphNumbering(NumInfo);
        }
    },
    Set_ParagraphShd: function (Shd) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Set_ParagraphShd(Shd);
        }
    },
    Set_ParagraphStyle: function (Name) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Set_ParagraphStyle(Name);
        }
    },
    Set_ParagraphTabs: function (Tabs) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Set_ParagraphTabs(Tabs);
        }
    },
    Set_ParagraphContextualSpacing: function (Value) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Set_ParagraphContextualSpacing(Value);
        }
    },
    Set_ParagraphPageBreakBefore: function (Value) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Set_ParagraphPageBreakBefore(Value);
        }
    },
    Set_ParagraphKeepLines: function (Value) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Set_ParagraphKeepLines(Value);
        }
    },
    Set_ParagraphKeepNext: function (Value) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Set_ParagraphKeepNext(Value);
        }
    },
    Set_ParagraphWidowControl: function (Value) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Set_ParagraphWidowControl(Value);
        }
    },
    Set_ParagraphBorders: function (Value) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Set_ParagraphBorders(Value);
        }
    },
    Paragraph_IncDecFontSize: function (bIncrease) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Paragraph_IncDecFontSize(bIncrease);
        }
    },
    Paragraph_IncDecIndent: function (bIncrease) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Paragraph_IncDecIndent(bIncrease);
        }
    },
    Set_ImageProps: function (Props) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Set_ImageProps(Props);
        }
    },
    Set_TableProps: function (Props) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Set_TableProps(Props);
        }
    },
    Get_Paragraph_ParaPr: function () {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Get_Paragraph_ParaPr();
        }
    },
    Get_Paragraph_TextPr: function () {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Get_Paragraph_TextPr();
        }
    },
    Get_Paragraph_TextPr_Copy: function () {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Get_Paragraph_TextPr_Copy();
        }
        return null;
    },
    Get_Paragraph_ParaPr_Copy: function () {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Get_Paragraph_ParaPr_Copy();
        }
        return null;
    },
    Selection_Remove: function () {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Selection_Remove();
        }
    },
    Selection_Draw_Page: function (Page_abs) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Selection_Draw_Page(Page_abs);
        }
    },
    Selection_Clear: function () {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Selection_Clear();
        }
    },
    Selection_SetStart: function (X, Y, PageIndex, MouseEvent, bActivate) {
        if (true === this.LogicDocument.DrawingObjects.pointInSelectedObject(X, Y, PageIndex)) {
            var NewPos = this.DrawingDocument.ConvertCoordsToAnotherPage(X, Y, PageIndex, this.CurPage);
            var _X = NewPos.X;
            var _Y = NewPos.Y;
            this.CurHdrFtr.Selection_SetStart(_X, _Y, this.CurPage, MouseEvent);
            this.ChangeCurPageOnEnd = false;
            this.WaitMouseDown = false;
            return true;
        }
        this.ChangeCurPageOnEnd = true;
        var OldPage = this.CurPage;
        var TempHdrFtr = null;
        var PageMetrics = this.LogicDocument.Get_PageContentStartPos(PageIndex);
        if (MouseEvent.ClickCount >= 2 && true != editor.isStartAddShape && !(Y <= PageMetrics.Y || (null !== (TempHdrFtr = this.Pages[PageIndex].Header) && true === TempHdrFtr.Is_PointInDrawingObjects(X, Y))) && !(Y >= PageMetrics.YLimit || (null !== (TempHdrFtr = this.Pages[PageIndex].Footer) && true === TempHdrFtr.Is_PointInDrawingObjects(X, Y)))) {
            if (null != this.CurHdrFtr) {
                this.CurHdrFtr.Selection_Remove();
            }
            MouseEvent.ClickCount = 1;
            return false;
        }
        this.CurPage = PageIndex;
        var HdrFtr = null;
        if (Y <= PageMetrics.Y || (null !== (TempHdrFtr = this.Pages[PageIndex].Header) && true === TempHdrFtr.Is_PointInDrawingObjects(X, Y)) || true === editor.isStartAddShape) {
            if (null === this.Pages[PageIndex].Header) {
                if (false === editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_HdrFtr)) {
                    this.LogicDocument.CurPos.Type = docpostype_Content;
                    History.Create_NewPoint(historydescription_Document_AddHeader);
                    this.LogicDocument.CurPos.Type = docpostype_HdrFtr;
                    HdrFtr = this.LogicDocument.Create_SectionHdrFtr(hdrftr_Header, PageIndex);
                    this.LogicDocument.Recalculate();
                } else {
                    return false;
                }
            } else {
                HdrFtr = this.Pages[PageIndex].Header;
            }
        } else {
            if (Y >= PageMetrics.YLimit || (null !== (TempHdrFtr = this.Pages[PageIndex].Footer) && true === TempHdrFtr.Is_PointInDrawingObjects(X, Y))) {
                if (null === this.Pages[PageIndex].Footer) {
                    if (false === editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_HdrFtr)) {
                        this.LogicDocument.CurPos.Type = docpostype_Content;
                        History.Create_NewPoint(historydescription_Document_AddFooter);
                        this.LogicDocument.CurPos.Type = docpostype_HdrFtr;
                        HdrFtr = this.LogicDocument.Create_SectionHdrFtr(hdrftr_Footer, PageIndex);
                        this.LogicDocument.Recalculate();
                    } else {
                        return false;
                    }
                } else {
                    HdrFtr = this.Pages[PageIndex].Footer;
                }
            }
        }
        if (null === HdrFtr) {
            this.WaitMouseDown = true;
            return true;
        } else {
            this.WaitMouseDown = false;
        }
        var OldHdrFtr = this.CurHdrFtr;
        this.CurHdrFtr = HdrFtr;
        if (null != OldHdrFtr && (OldHdrFtr != this.CurHdrFtr || OldPage != this.CurPage)) {
            OldHdrFtr.Selection_Remove();
        }
        if (null != this.CurHdrFtr) {
            this.CurHdrFtr.Selection_SetStart(X, Y, PageIndex, MouseEvent);
            if (true === bActivate) {
                var NewMouseEvent = {};
                NewMouseEvent.Type = g_mouse_event_type_up;
                NewMouseEvent.ClickCount = 1;
                this.CurHdrFtr.Selection_SetEnd(X, Y, PageIndex, NewMouseEvent);
                this.CurHdrFtr.Content.Cursor_MoveToStartPos(false);
            }
        }
        return true;
    },
    Selection_SetEnd: function (X, Y, PageIndex, MouseEvent) {
        if (true === this.WaitMouseDown) {
            return;
        }
        if (null != this.CurHdrFtr) {
            var ResY = Y;
            if (docpostype_DrawingObjects != this.CurHdrFtr.Content.CurPos.Type) {
                if (PageIndex > this.CurPage) {
                    ResY = this.LogicDocument.Get_PageLimits(this.CurPage).YLimit + 10;
                } else {
                    if (PageIndex < this.CurPage) {
                        ResY = -10;
                    }
                }
                PageIndex = this.CurPage;
            }
            this.CurHdrFtr.Selection_SetEnd(X, ResY, PageIndex, MouseEvent);
            if (false === this.ChangeCurPageOnEnd) {
                this.CurHdrFtr.Set_Page(this.CurPage);
            }
        }
    },
    Selection_Is_TableBorderMove: function () {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Selection_Is_TableBorderMove();
        }
        return false;
    },
    Selection_Check: function (X, Y, Page_Abs, NearPos) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Selection_Check(X, Y, Page_Abs, NearPos);
        }
    },
    Selection_IsEmpty: function (bCheckHidden) {
        if (null !== this.CurHdrFtr) {
            return this.CurHdrFtr.Content.Selection_IsEmpty(bCheckHidden);
        }
        return true;
    },
    Select_All: function () {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Select_All();
        }
    },
    Get_NearestPos: function (PageNum, X, Y, bAnchor, Drawing) {
        var HdrFtr = (true === editor.isStartAddShape ? this.CurHdrFtr : this.Internal_GetContentByXY(X, Y, PageNum));
        if (null != HdrFtr) {
            return HdrFtr.Get_NearestPos(X, Y, bAnchor, Drawing);
        } else {
            return {
                X: -1,
                Y: -1,
                Height: -1
            };
        }
    },
    Get_CurrentParagraph: function () {
        return this.CurHdrFtr.Get_CurrentParagraph();
    },
    Internal_GetContentByXY: function (X, Y, PageIndex) {
        var Header = null;
        var Footer = null;
        if (undefined !== this.Pages[PageIndex]) {
            Header = this.Pages[PageIndex].Header;
            Footer = this.Pages[PageIndex].Footer;
        }
        var PageH = this.LogicDocument.Get_PageLimits(PageIndex).YLimit;
        if (Y <= PageH / 2 && null != Header) {
            return Header;
        } else {
            if (Y >= PageH / 2 && null != Footer) {
                return Footer;
            } else {
                if (null != Header) {
                    return Header;
                } else {
                    return Footer;
                }
            }
        }
        return null;
    },
    Table_AddRow: function (bBefore) {
        if (null != this.CurHdrFtr) {
            this.CurHdrFtr.Table_AddRow(bBefore);
        }
    },
    Table_AddCol: function (bBefore) {
        if (null != this.CurHdrFtr) {
            this.CurHdrFtr.Table_AddCol(bBefore);
        }
    },
    Table_RemoveRow: function () {
        if (null != this.CurHdrFtr) {
            this.CurHdrFtr.Table_RemoveRow();
        }
    },
    Table_RemoveCol: function () {
        if (null != this.CurHdrFtr) {
            this.CurHdrFtr.Table_RemoveCol();
        }
    },
    Table_MergeCells: function () {
        if (null != this.CurHdrFtr) {
            this.CurHdrFtr.Table_MergeCells();
        }
    },
    Table_SplitCell: function (Cols, Rows) {
        if (null != this.CurHdrFtr) {
            this.CurHdrFtr.Table_SplitCell(Cols, Rows);
        }
    },
    Table_RemoveTable: function () {
        if (null != this.CurHdrFtr) {
            this.CurHdrFtr.Table_RemoveTable();
        }
    },
    Table_Select: function (Type) {
        if (null != this.CurHdrFtr) {
            this.CurHdrFtr.Table_Select(Type);
        }
    },
    Table_CheckMerge: function () {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Table_CheckMerge();
        }
    },
    Table_CheckSplit: function () {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Table_CheckSplit();
        }
    },
    Get_SelectionState: function () {
        var HdrFtrState = {};
        HdrFtrState.CurHdrFtr = this.CurHdrFtr;
        var State = null;
        if (null != this.CurHdrFtr) {
            State = this.CurHdrFtr.Content.Get_SelectionState();
        } else {
            State = [];
        }
        State.push(HdrFtrState);
        return State;
    },
    Set_SelectionState: function (State, StateIndex) {
        if (State.length <= 0) {
            return;
        }
        var HdrFtrState = State[StateIndex];
        this.CurHdrFtr = HdrFtrState.CurHdrFtr;
        if (null != this.CurHdrFtr) {
            this.CurHdrFtr.Content.Set_SelectionState(State, StateIndex - 1);
        }
    },
    Hyperlink_Add: function (HyperProps) {
        if (null != this.CurHdrFtr) {
            this.CurHdrFtr.Hyperlink_Add(HyperProps);
        }
    },
    Hyperlink_Modify: function (HyperProps) {
        if (null != this.CurHdrFtr) {
            this.CurHdrFtr.Hyperlink_Modify(HyperProps);
        }
    },
    Hyperlink_Remove: function () {
        if (null != this.CurHdrFtr) {
            this.CurHdrFtr.Hyperlink_Remove();
        }
    },
    Hyperlink_CanAdd: function (bCheckInHyperlink) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Hyperlink_CanAdd(bCheckInHyperlink);
        }
        return false;
    },
    Hyperlink_Check: function (bCheckEnd) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Hyperlink_Check(bCheckEnd);
        }
        return null;
    },
    Add_Comment: function (Comment) {
        if (null != this.CurHdrFtr) {
            Comment.Set_TypeInfo(comment_type_HdrFtr, this.CurHdrFtr);
            this.CurHdrFtr.Add_Comment(Comment);
        }
    },
    CanAdd_Comment: function () {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.CanAdd_Comment();
        }
        return false;
    },
    Get_SelectionAnchorPos: function () {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Content.Get_SelectionAnchorPos();
        }
        return {
            X: 0,
            Y: 0,
            Page: 0
        };
    }
};
function CHdrFtrPage() {
    this.Header = null;
    this.Footer = null;
}