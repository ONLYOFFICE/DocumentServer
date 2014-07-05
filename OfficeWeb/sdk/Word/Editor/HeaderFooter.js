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
 var hdrftr_Header = 1;
var hdrftr_Footer = 2;
var hdrftr_Default = 1;
var hdrftr_Even = 2;
var hdrftr_First = 3;
function CHeaderFooter(Parent, LogicDocument, DrawingDocument, Type, BoundY2) {
    this.Id = g_oIdCounter.Get_NewId();
    this.Parent = Parent;
    this.DrawingDocument = DrawingDocument;
    this.LogicDocument = LogicDocument;
    if ("undefined" != typeof(LogicDocument) && null != LogicDocument) {
        if (Type === hdrftr_Header) {
            this.Content = new CDocumentContent(this, DrawingDocument, X_Left_Field, BoundY2, X_Right_Field, Page_Height / 2, false, true);
            this.Content.Content[0].Style_Add(this.Get_Styles().Get_Default_Header());
        } else {
            this.Content = new CDocumentContent(this, DrawingDocument, X_Left_Field, Y_Bottom_Field + 15, X_Right_Field, Page_Height, false, true);
            this.Content.Content[0].Style_Add(this.Get_Styles().Get_Default_Footer());
        }
    }
    this.Type = Type;
    this.BoundY = -1;
    this.BoundY2 = BoundY2;
    this.DocumentRecalc = true;
    this.RecalcInfo = {
        NeedRecalc: true,
        OldBounds: null,
        OldFlowPos: null
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
    Recalculate: function () {
        var bChanges = false;
        var OldBounds = null;
        var OldFlowPos = new Array();
        var OldSumH = 0;
        if (true === this.RecalcInfo.NeedRecalc) {
            this.RecalcInfo.NeedRecalc = false;
            bChanges = true;
        } else {
            OldSumH = this.Content.Get_SummaryHeight();
            OldBounds = this.Content.Get_PageBounds(0);
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
                    OldFlowPos.push(FlowPos);
                }
            }
        }
        var CurPage = 0;
        var RecalcResult = recalcresult2_NextPage;
        while (recalcresult2_End != RecalcResult) {
            RecalcResult = this.Content.Recalculate_Page(CurPage++, true);
        }
        if (false === bChanges) {
            var NewBounds = this.Content.Get_PageBounds(0);
            if (Math.abs(NewBounds.Bottom - OldBounds.Bottom) > 0.001) {
                bChanges = true;
            }
        }
        if (false === bChanges) {
            var NewFlowPos = new Array();
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
        if (true === bChanges) {
            this.Internal_RecalculateBounds();
        }
        return bChanges;
    },
    Reset_RecalculateCache: function () {
        this.Content.Reset_RecalculateCache();
    },
    Internal_RecalculateBounds: function () {
        if (this.Type === hdrftr_Header) {
            var Bottom = this.Get_Bounds().Bottom;
            var BoundY = Y_Top_Field;
            if (Bottom >= 0 && Bottom > Y_Top_Field) {
                BoundY = Bottom;
            }
            if (this.BoundY < 0 || (Math.abs(BoundY - this.BoundY) > 0.01)) {
                this.BoundY = BoundY;
            }
        } else {
            var Bounds = this.Get_Bounds();
            var SummaryHeight = this.Content.Get_SummaryHeight();
            var Top = Bounds.Top;
            var Bottom = Top + SummaryHeight;
            if (Math.abs(Bottom - this.BoundY2) > 0.001) {
                if (Bottom - Top < Page_Height / 3) {
                    this.Content.Reset(X_Left_Field, this.BoundY2 - (Bottom - Top), X_Right_Field, Page_Height);
                } else {
                    if (Top - 2 / 3 * Page_Height > 0.001) {
                        this.Content.Reset(X_Left_Field, 2 / 3 * Page_Height, X_Right_Field, Page_Height);
                    }
                }
                this.Recalculate();
                return;
            }
            var BoundY = Y_Bottom_Field;
            if (Top >= 0 && Top < Y_Bottom_Field) {
                BoundY = Top;
            }
            if (this.BoundY < 0 || (Math.abs(BoundY - this.BoundY) > 0.01)) {
                this.BoundY = BoundY;
            }
        }
        if (this.Type === hdrftr_Header) {
            this.DrawingDocument.Set_RulerState_HdrFtr(true, this.BoundY2, Math.max(this.BoundY, Y_Top_Field));
        } else {
            var Top = this.Get_Bounds().Top;
            this.DrawingDocument.Set_RulerState_HdrFtr(false, Top, Page_Height);
        }
    },
    Get_Styles: function () {
        return this.LogicDocument.Get_Styles();
    },
    Get_TableStyleForPara: function () {
        return null;
    },
    Get_PageContentStartPos: function () {
        return {
            X: X_Left_Field,
            Y: 0,
            XLimit: X_Right_Field,
            YLimit: 0
        };
    },
    Set_CurrentElement: function () {
        this.Parent.CurHdrFtr = this;
        this.LogicDocument.CurPos.Type = docpostype_HdrFtr;
        this.LogicDocument.Document_UpdateInterfaceState();
        this.LogicDocument.Document_UpdateRulersState();
        this.LogicDocument.Document_UpdateSelectionState();
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
        var OldStartPage = this.Content.Get_StartPage_Relative();
        this.Content.Set_StartPage(nPageIndex);
        this.Content.Draw(nPageIndex, pGraphics);
        this.Content.Set_StartPage(OldStartPage);
    },
    OnContentRecalculate: function (bChange, bForceRecalc) {
        this.LogicDocument.NeedUpdateTarget = true;
        var bNeedDocRecalc = false;
        if (true === bChange) {
            if (this.Type === hdrftr_Header) {
                var Bottom = this.Get_Bounds().Bottom;
                var BoundY = Y_Top_Field;
                if (Bottom >= 0 && Bottom > Y_Top_Field) {
                    BoundY = Bottom;
                }
                if (this.BoundY < 0 || (Math.abs(BoundY - this.BoundY) > 0.01)) {
                    this.BoundY = BoundY;
                    bNeedDocRecalc = true;
                }
            } else {
                var Bounds = this.Get_Bounds();
                var SummaryHeight = this.Content.Get_SummaryHeight();
                var Top = Bounds.Top;
                var Bottom = Top + SummaryHeight;
                if (Math.abs(Bottom - this.BoundY2) > 0.001) {
                    if (Bottom - Top < Page_Height / 3) {
                        this.Content.Reset(X_Left_Field, this.BoundY2 - (Bottom - Top), X_Right_Field, Page_Height);
                    } else {
                        if (Top - 2 / 3 * Page_Height > 0.001) {
                            this.Content.Reset(X_Left_Field, 2 / 3 * Page_Height, X_Right_Field, Page_Height);
                        }
                    }
                    this.Content.Recalculate();
                    return;
                }
                var BoundY = Y_Bottom_Field;
                if (Top >= 0 && Top < Y_Bottom_Field) {
                    BoundY = Top;
                }
                if (this.BoundY < 0 || (Math.abs(BoundY - this.BoundY) > 0.01)) {
                    this.BoundY = BoundY;
                    bNeedDocRecalc = true;
                }
            }
            if (this.Type === hdrftr_Header) {
                this.DrawingDocument.Set_RulerState_HdrFtr(true, this.BoundY2, Math.max(this.BoundY, Y_Top_Field));
            } else {
                var Top = this.Get_Bounds().Top;
                this.DrawingDocument.Set_RulerState_HdrFtr(false, Top, Page_Height);
            }
        }
        if (false === this.DocumentRecalc) {
            this.Document_UpdateRulersState();
            return;
        }
        if (true === bNeedDocRecalc || true === bForceRecalc) {
            this.LogicDocument.ContentLastChangePos = 0;
            this.LogicDocument.Recalculate();
        } else {
            this.DrawingDocument.ClearCachePages();
            this.DrawingDocument.FirePaint();
        }
        this.Document_UpdateRulersState();
    },
    OnContentReDraw: function (StartPage, EndPage) {
        this.DrawingDocument.ClearCachePages();
        this.DrawingDocument.FirePaint();
    },
    RecalculateCurPos: function () {
        this.Content.RecalculateCurPos();
    },
    Get_NearestPos: function (X, Y, bAnchor, Drawing) {
        return this.Content.Get_NearestPos(this.Content.StartPage, X, Y, bAnchor, Drawing);
    },
    Get_Numbering: function () {
        return this.LogicDocument.Get_Numbering();
    },
    Get_Styles: function () {
        return this.LogicDocument.Get_Styles();
    },
    Get_Bounds: function () {
        return this.Content.Get_PageBounds(0);
    },
    UpdateMargins: function (bNoRecalc, bNoSaveHistory) {
        this.Content.X = X_Left_Field;
        this.Content.XLimit = X_Right_Field;
        if (hdrftr_Footer === this.Type) {
            if (true !== bNoSaveHistory) {
                History.Add(this, {
                    Type: historyitem_HdrFtr_BoundY2,
                    Old: this.BoundY2,
                    New: Page_Height - Y_Default_Footer
                });
            }
            this.BoundY2 = Page_Height - Y_Default_Footer;
        }
        if (true != bNoRecalc) {
            this.DocumentRecalc = false;
            this.Recalculate();
            if (hdrftr_Footer === this.Type) {
                var Bounds = this.Get_Bounds();
                var SummaryHeight = this.Content.Get_SummaryHeight();
                var Top = Bounds.Top;
                var Bottom = Top + SummaryHeight;
                if (Math.abs(Bottom - this.BoundY2) > 0.001) {
                    if (Bottom - Top < Page_Height / 3) {
                        this.Content.Reset(X_Left_Field, this.BoundY2 - (Bottom - Top), X_Right_Field, Page_Height);
                    } else {
                        if (Top - 2 / 3 * Page_Height > 0.001) {
                            this.Content.Reset(X_Left_Field, 2 / 3 * Page_Height, X_Right_Field, Page_Height);
                        }
                    }
                    this.Content.Recalculate();
                }
            }
            this.DocumentRecalc = true;
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
    Set_BoundY2: function (Value, bRecalculate) {
        History.Add(this, {
            Type: historyitem_HdrFtr_BoundY2,
            Old: this.BoundY2,
            New: Value
        });
        this.BoundY2 = Value;
        if (this.Type === hdrftr_Header) {
            this.Content.Reset(X_Left_Field, this.BoundY2, X_Right_Field, Page_Height / 2);
            if (false != bRecalculate) {
                this.Content.Recalculate();
            }
        } else {
            var Bounds = this.Get_Bounds();
            var SummaryHeight = this.Content.Get_SummaryHeight();
            var Top = Bounds.Top;
            var Bottom = Top + SummaryHeight;
            if (Bottom - Top < Page_Height / 3) {
                this.Content.Reset(X_Left_Field, this.BoundY2 - (Bottom - Top), X_Right_Field, Page_Height);
                if (false != bRecalculate) {
                    this.Content.Recalculate();
                }
            } else {}
        }
        if (true === bRecalculate) {
            this.Internal_RecalculateBounds();
        }
    },
    Update_CursorType: function (X, Y, PageNum_Abs) {
        if (PageNum_Abs != this.Content.Get_StartPage_Absolute()) {
            this.DrawingDocument.SetCursorType("default", new CMouseMoveData());
        } else {
            return this.Content.Update_CursorType(X, Y, PageNum_Abs);
        }
    },
    Is_TableBorder: function (X, Y, PageNum_Abs) {
        this.Content.Set_StartPage(PageNum_Abs);
        return this.Content.Is_TableBorder(X, Y, PageNum_Abs);
    },
    Is_InText: function (X, Y, PageNum_Abs) {
        this.Content.Set_StartPage(PageNum_Abs);
        return this.Content.Is_InText(X, Y, PageNum_Abs);
    },
    Is_InDrawing: function (X, Y, PageNum_Abs) {
        this.Content.Set_StartPage(PageNum_Abs);
        return this.Content.Is_InDrawing(X, Y, PageNum_Abs);
    },
    Document_UpdateInterfaceState: function () {
        this.Content.Document_UpdateInterfaceState();
    },
    Document_UpdateRulersState: function () {
        if (this.Type === hdrftr_Header) {
            this.DrawingDocument.Set_RulerState_HdrFtr(true, this.BoundY2, Math.max(this.BoundY, Y_Top_Field));
        } else {
            var Top = this.Get_Bounds().Top;
            this.DrawingDocument.Set_RulerState_HdrFtr(false, Top, Page_Height);
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
    Add_FlowImage: function (W, H, Img) {
        this.Content.Add_FlowImage(W, H, Img);
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
    Cursor_MoveAt: function (X, Y, PageIndex, AddToSelect, bRemoveOldSelection) {
        this.Content.Set_StartPage(PageIndex);
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
        this.Content.Set_StartPage(PageIndex);
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
        this.Content.Set_StartPage(PageIndex);
        return this.Content.Selection_SetEnd(X, Y, PageIndex, MouseEvent);
    },
    Selection_Is_TableBorderMove: function () {
        return this.Content.Selection_Is_TableBorderMove();
    },
    Selection_Check: function (X, Y, Page_Abs) {
        var HdrFtrPage = this.Content.Get_StartPage_Absolute();
        if (HdrFtrPage === Page_Abs) {
            return this.Content.Selection_Check(X, Y, Page_Abs);
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
        this.Recalculate();
    },
    Table_AddCol: function (bBefore) {
        this.Content.Table_AddCol(bBefore);
        this.Recalculate();
    },
    Table_RemoveRow: function () {
        this.Content.Table_RemoveRow();
        this.Recalculate();
    },
    Table_RemoveCol: function () {
        this.Content.Table_RemoveCol();
        this.Recalculate();
    },
    Table_MergeCells: function () {
        this.Content.Table_MergeCells();
        this.Recalculate();
    },
    Table_SplitCell: function (Cols, Rows) {
        this.Content.Table_SplitCell(Cols, Rows);
        this.Recalculate();
    },
    Table_RemoveTable: function () {
        this.Content.Table_RemoveTable();
        this.Recalculate();
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
    Undo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_HdrFtr_BoundY2:
            this.BoundY2 = Data.Old;
            if (this.Type === hdrftr_Header) {
                this.Content.Reset(X_Left_Field, this.BoundY2, X_Right_Field, Page_Height / 2);
            } else {
                var Bounds = this.Get_Bounds();
                var SummaryHeight = this.Content.Get_SummaryHeight();
                var Top = Bounds.Top;
                var Bottom = Top + SummaryHeight;
                if (Bottom - Top < Page_Height / 3) {
                    this.Content.Reset(X_Left_Field, this.BoundY2 - (Bottom - Top), X_Right_Field, Page_Height);
                } else {
                    this.Content.Reset(X_Left_Field, 2 / 3 * Page_Height, X_Right_Field, Page_Height);
                }
            }
            break;
        }
    },
    Redo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_HdrFtr_BoundY2:
            this.BoundY2 = Data.New;
            if (this.Type === hdrftr_Header) {
                this.Content.Reset(X_Left_Field, this.BoundY2, X_Right_Field, Page_Height / 2);
            } else {
                var SummaryHeight = this.Content.Get_SummaryHeight();
                if (SummaryHeight < Page_Height / 3) {
                    this.Content.Reset(X_Left_Field, this.BoundY2 - SummaryHeight, X_Right_Field, Page_Height);
                } else {
                    this.Content.Reset(X_Left_Field, 2 / 3 * Page_Height, X_Right_Field, Page_Height);
                }
            }
            break;
        }
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
        History.RecalcData_Add({
            Type: historyrecalctype_HdrFtr,
            Data: this
        });
    },
    DocumentSearch: function (SearchString, Type) {
        this.Content.DocumentSearch(SearchString, Type);
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
    Save_Changes: function (Data, Writer) {
        Writer.WriteLong(historyitem_type_HdrFtrController);
        var Type = Data.Type;
        Writer.WriteLong(Type);
        switch (Type) {
        case historyitem_HdrFtr_BoundY2:
            Writer.WriteDouble(Data.New);
            break;
        }
        return Writer;
    },
    Save_Changes2: function (Data, Writer) {
        return false;
    },
    Load_Changes: function (Reader, Reader2) {
        var ClassType = Reader.GetLong();
        if (historyitem_type_HdrFtrController != ClassType) {
            return;
        }
        var Type = Reader.GetLong();
        switch (Type) {
        case historyitem_HdrFtr_BoundY2:
            this.BoundY2 = Reader.GetDouble();
            if (this.Type === hdrftr_Header) {
                this.Content.Reset(X_Left_Field, this.BoundY2, X_Right_Field, Page_Height / 2);
            } else {
                var SummaryHeight = this.Content.Get_SummaryHeight();
                if (SummaryHeight < Page_Height / 3) {
                    this.Content.Reset(X_Left_Field, this.BoundY2 - SummaryHeight, X_Right_Field, Page_Height);
                } else {
                    this.Content.Reset(X_Left_Field, 2 / 3 * Page_Height, X_Right_Field, Page_Height);
                }
            }
            break;
        }
    },
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(historyitem_type_HdrFtr);
        Writer.WriteString2(this.Id);
        Writer.WriteLong(this.Type);
        Writer.WriteDouble(this.BoundY);
        Writer.WriteDouble(this.BoundY2);
        Writer.WriteString2(this.Content.Get_Id());
    },
    Read_FromBinary2: function (Reader) {
        var LogicDocument = editor.WordControl.m_oLogicDocument;
        this.Parent = LogicDocument.HdrFtr;
        this.DrawingDocument = LogicDocument.DrawingDocument;
        this.LogicDocument = LogicDocument;
        this.Id = Reader.GetString2();
        this.Type = Reader.GetLong();
        this.BoundY = Reader.GetDouble();
        this.BoundY2 = Reader.GetDouble();
        this.Content = g_oTableId.Get_ById(Reader.GetString2());
        if (this.Type === hdrftr_Header) {
            this.Content.Reset(X_Left_Field, this.BoundY2, X_Right_Field, Page_Height / 2);
        } else {
            var SummaryHeight = this.Content.Get_SummaryHeight();
            if (SummaryHeight < Page_Height / 3) {
                this.Content.Reset(X_Left_Field, this.BoundY2 - SummaryHeight, X_Right_Field, Page_Height);
            } else {
                this.Content.Reset(X_Left_Field, 2 / 3 * Page_Height, X_Right_Field, Page_Height);
            }
        }
    },
    Load_LinkData: function (LinkData) {},
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
    this.Content = new Array();
    this.Content[0] = {
        Header: {
            First: null,
            Even: null,
            Odd: null
        },
        Footer: {
            First: null,
            Even: null,
            Odd: null
        }
    };
    this.CurHdrFtr = null;
    this.Pages = new Array();
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
    AddHeaderOrFooter: function (Type, PageType) {
        this.LogicDocument.DrawingObjects.AddHeaderOrFooter(Type, PageType);
        var BoundY2 = Y_Default_Header;
        if (Type === hdrftr_Footer) {
            BoundY2 = Page_Height - Y_Default_Footer;
        }
        var Content_old = {
            Header: {
                First: this.Content[0].Header.First,
                Even: this.Content[0].Header.Even,
                Odd: this.Content[0].Header.Odd
            },
            Footer: {
                First: this.Content[0].Footer.First,
                Even: this.Content[0].Footer.Even,
                Odd: this.Content[0].Footer.Odd
            }
        };
        var HdrFtr = new CHeaderFooter(this, this.LogicDocument, this.DrawingDocument, Type, BoundY2);
        switch (Type) {
        case hdrftr_Footer:
            switch (PageType) {
            case hdrftr_Default:
                if (null === this.Content[0].Footer.First) {
                    this.Content[0].Footer.First = HdrFtr;
                }
                if (null === this.Content[0].Footer.Even) {
                    this.Content[0].Footer.Even = HdrFtr;
                }
                this.Content[0].Footer.Odd = HdrFtr;
                break;
            case hdrftr_Even:
                this.Content[0].Footer.Even = HdrFtr;
                break;
            case hdrftr_First:
                this.Content[0].Footer.First = HdrFtr;
                break;
            }
            break;
        case hdrftr_Header:
            switch (PageType) {
            case hdrftr_Default:
                if (null === this.Content[0].Header.First) {
                    this.Content[0].Header.First = HdrFtr;
                }
                if (null === this.Content[0].Header.Even) {
                    this.Content[0].Header.Even = HdrFtr;
                }
                this.Content[0].Header.Odd = HdrFtr;
                break;
            case hdrftr_Even:
                this.Content[0].Header.Even = HdrFtr;
                break;
            case hdrftr_First:
                this.Content[0].Header.First = HdrFtr;
                break;
            }
            break;
        }
        History.Add(this, {
            Type: historyitem_HdrFtrController_AddItem,
            Old: Content_old,
            New: this.Content[0]
        });
        this.LogicDocument.Recalculate();
        this.CurHdrFtr = this.Internal_GetContentByXY(0, 0, this.CurPage);
        this.CurHdrFtr.Cursor_MoveAt(0, 0, this.CurPage, false, false);
        return HdrFtr;
    },
    RemoveHeaderOrFooter: function (Type, PageType) {
        this.LogicDocument.DrawingObjects.RemoveHeaderOrFooter(Type, PageType);
        var Content_old = {
            Header: {
                First: this.Content[0].Header.First,
                Even: this.Content[0].Header.Even,
                Odd: this.Content[0].Header.Odd
            },
            Footer: {
                First: this.Content[0].Footer.First,
                Even: this.Content[0].Footer.Even,
                Odd: this.Content[0].Footer.Odd
            }
        };
        switch (Type) {
        case hdrftr_Footer:
            switch (PageType) {
            case hdrftr_Default:
                var HdrFtr = this.Content[0].Footer.Odd;
                if (HdrFtr === this.Content[0].Footer.First) {
                    this.Content[0].Footer.First = null;
                }
                if (HdrFtr === this.Content[0].Footer.Even) {
                    this.Content[0].Footer.Even = null;
                }
                this.Content[0].Footer.Odd = null;
                break;
            case hdrftr_Even:
                if (this.Content[0].Footer.Odd != this.Content[0].Footer.Even) {
                    this.Content[0].Footer.Even = this.Content[0].Footer.Odd;
                }
                break;
            case hdrftr_First:
                if (this.Content[0].Footer.Odd != this.Content[0].Footer.First) {
                    this.Content[0].Footer.First = this.Content[0].Footer.Odd;
                }
                break;
            }
            break;
        case hdrftr_Header:
            switch (PageType) {
            case hdrftr_Default:
                var HdrFtr = this.Content[0].Header.Odd;
                if (HdrFtr === this.Content[0].Header.First) {
                    this.Content[0].Header.First = null;
                }
                if (HdrFtr === this.Content[0].Header.Even) {
                    this.Content[0].Header.Even = null;
                }
                this.Content[0].Header.Odd = null;
                break;
            case hdrftr_Even:
                if (this.Content[0].Header.Odd != this.Content[0].Header.Even) {
                    if (this.Content[0].Header.Even === this.Content[0].Header.First) {
                        this.Content[0].Header.First = this.Content[0].Header.Odd;
                    }
                    this.Content[0].Header.Even = this.Content[0].Header.Odd;
                }
                break;
            case hdrftr_First:
                if (this.Content[0].Header.Odd != this.Content[0].Header.First) {
                    this.Content[0].Header.First = this.Content[0].Header.Odd;
                }
                break;
            }
            break;
        }
        History.Add(this, {
            Type: historyitem_HdrFtrController_AddItem,
            Old: Content_old,
            New: this.Content[0]
        });
        this.CurHdrFtr = this.Internal_GetContentByXY(0, 0, this.CurPage);
        this.CurHdrFtr.Cursor_MoveAt(0, 0, this.CurPage, false, false);
        this.LogicDocument.ContentLastChangePos = 0;
        this.LogicDocument.Recalculate();
    },
    AddPageNum: function (PageIndex, AlignV, AlignH) {
        var bFirst = (0 === PageIndex ? true : false);
        var bEven = (PageIndex % 2 === 1 ? true : false);
        var Header = null;
        var Footer = null;
        if (true === bFirst) {
            Header = this.Content[0].Header.First;
            Footer = this.Content[0].Footer.First;
        } else {
            if (true === bEven) {
                Header = this.Content[0].Header.Even;
                Footer = this.Content[0].Footer.Even;
            } else {
                Header = this.Content[0].Header.Odd;
                Footer = this.Content[0].Footer.Odd;
            }
        }
        switch (AlignV) {
        case hdrftr_Header:
            if (null === Header) {
                Header = this.AddHeaderOrFooter(hdrftr_Header, hdrftr_Default);
            }
            Header.AddPageNum(AlignH);
            break;
        case hdrftr_Footer:
            if (null === Footer) {
                Footer = this.AddHeaderOrFooter(hdrftr_Footer, hdrftr_Default);
            }
            Footer.AddPageNum(AlignH);
            break;
        }
    },
    Get_CurPage: function () {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Content.Get_StartPage_Absolute();
        }
        return 0;
    },
    Set_Distance: function (Value, PageHeight) {
        if (null != this.CurHdrFtr) {
            if (this.CurHdrFtr.Type === hdrftr_Header) {
                this.CurHdrFtr.Set_BoundY2(Value, true);
            } else {
                this.CurHdrFtr.Set_BoundY2(PageHeight - Value, true);
            }
        }
    },
    Set_Bounds: function (Y0, Y1) {
        if (null != this.CurHdrFtr) {
            if (hdrftr_Header === this.CurHdrFtr.Type) {
                if (Y_Top_Field != Y1) {
                    this.CurHdrFtr.DocumentRecalc = false;
                    History.Add(this.LogicDocument, {
                        Type: historyitem_Document_Margin,
                        Fields_old: {
                            Left: X_Left_Field,
                            Right: X_Right_Field,
                            Top: Y_Top_Field,
                            Bottom: Y_Bottom_Field
                        },
                        Fields_new: {
                            Left: X_Left_Field,
                            Right: X_Right_Field,
                            Top: Y1,
                            Bottom: Y_Bottom_Field
                        },
                        Recalc_Margins: false
                    });
                    Y_Top_Field = Y1;
                    this.CurHdrFtr.Set_BoundY2(Y0, true);
                    this.LogicDocument.ContentLastChangePos = 0;
                    this.LogicDocument.Recalculate();
                    this.CurHdrFtr.DocumentRecalc = true;
                } else {
                    this.CurHdrFtr.Set_BoundY2(Y0, true);
                }
                this.DrawingDocument.Set_RulerState_HdrFtr(true, this.CurHdrFtr.BoundY2, Math.max(this.CurHdrFtr.BoundY, Y_Top_Field));
            } else {
                var Bounds = this.CurHdrFtr.Get_Bounds();
                var BoundY2 = Y0 + (Bounds.Bottom - Bounds.Top);
                this.CurHdrFtr.Set_BoundY2(BoundY2, true);
                Bounds = this.CurHdrFtr.Get_Bounds();
                this.DrawingDocument.Set_RulerState_HdrFtr(false, Bounds.Top, Page_Height);
            }
        }
    },
    Get_Props: function () {
        if (null != this.CurHdrFtr) {
            var Pr = new Object();
            Pr.Type = this.CurHdrFtr.Type;
            if (hdrftr_Footer === Pr.Type) {
                Pr.Position = Page_Height - this.CurHdrFtr.BoundY2;
            } else {
                Pr.Position = this.CurHdrFtr.BoundY2;
            }
            if (this.Content[0].Footer.First != this.Content[0].Footer.Odd) {
                Pr.DifferentFirst = true;
            } else {
                Pr.DifferentFirst = false;
            }
            if (this.Content[0].Footer.Odd != this.Content[0].Footer.Even) {
                Pr.DifferentEvenOdd = true;
            } else {
                Pr.DifferentEvenOdd = false;
            }
            Pr.Locked = this.Lock.Is_Locked();
            return Pr;
        } else {
            return null;
        }
    },
    Set_CurHdrFtr_ById: function (Id) {
        if (null != this.Content[0].Header.First && Id === this.Content[0].Header.First.Get_Id()) {
            this.CurHdrFtr = this.Content[0].Header.First;
            this.CurHdrFtr.Content.Cursor_MoveToStartPos();
            return true;
        } else {
            if (null != this.Content[0].Header.Odd && Id === this.Content[0].Header.Odd.Get_Id()) {
                this.CurHdrFtr = this.Content[0].Header.Odd;
                this.CurHdrFtr.Content.Cursor_MoveToStartPos();
                return true;
            } else {
                if (null != this.Content[0].Header.Even && Id === this.Content[0].Header.Even.Get_Id()) {
                    this.CurHdrFtr = this.Content[0].Header.Even;
                    this.CurHdrFtr.Content.Cursor_MoveToStartPos();
                    return true;
                } else {
                    if (null != this.Content[0].Footer.First && Id === this.Content[0].Footer.First.Get_Id()) {
                        this.CurHdrFtr = this.Content[0].Footer.First;
                        this.CurHdrFtr.Content.Cursor_MoveToStartPos();
                        return true;
                    } else {
                        if (null != this.Content[0].Footer.Odd && Id === this.Content[0].Footer.Odd.Get_Id()) {
                            this.CurHdrFtr = this.Content[0].Footer.Odd;
                            this.CurHdrFtr.Content.Cursor_MoveToStartPos();
                            return true;
                        } else {
                            if (null != this.Content[0].Footer.Even && Id === this.Content[0].Footer.Even.Get_Id()) {
                                this.CurHdrFtr = this.Content[0].Footer.Even;
                                this.CurHdrFtr.Content.Cursor_MoveToStartPos();
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    },
    RecalculateCurPos: function () {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.RecalculateCurPos();
        }
    },
    Recalculate: function () {
        if (null != this.Content[0].Header.First) {
            this.Content[0].Header.First.Recalculate();
        }
        if (null != this.Content[0].Header.Odd && this.Content[0].Header.Odd !== this.Content[0].Header.First) {
            this.Content[0].Header.Odd.Recalculate();
        }
        if (null != this.Content[0].Header.Even && this.Content[0].Header.Even !== this.Content[0].Header.Odd && this.Content[0].Header.Even != this.Content[0].Header.First) {
            this.Content[0].Header.Even.Recalculate();
        }
        if (null != this.Content[0].Footer.First) {
            this.Content[0].Footer.First.Recalculate();
        }
        if (null != this.Content[0].Footer.Odd && this.Content[0].Footer.Odd !== this.Content[0].Footer.First) {
            this.Content[0].Footer.Odd.Recalculate();
        }
        if (null != this.Content[0].Footer.Even && this.Content[0].Footer.Even !== this.Content[0].Footer.Odd && this.Content[0].Footer.Even != this.Content[0].Footer.First) {
            this.Content[0].Footer.Even.Recalculate();
        }
    },
    Reset_RecalculateCache: function () {
        if (null != this.Content[0].Header.First) {
            this.Content[0].Header.First.Reset_RecalculateCache();
        }
        if (null != this.Content[0].Header.Odd && this.Content[0].Header.Odd !== this.Content[0].Header.First) {
            this.Content[0].Header.Odd.Reset_RecalculateCache();
        }
        if (null != this.Content[0].Header.Even && this.Content[0].Header.Even !== this.Content[0].Header.Odd && this.Content[0].Header.Even != this.Content[0].Header.First) {
            this.Content[0].Header.Even.Reset_RecalculateCache();
        }
        if (null != this.Content[0].Footer.First) {
            this.Content[0].Footer.First.Reset_RecalculateCache();
        }
        if (null != this.Content[0].Footer.Odd && this.Content[0].Footer.Odd !== this.Content[0].Footer.First) {
            this.Content[0].Footer.Odd.Reset_RecalculateCache();
        }
        if (null != this.Content[0].Footer.Even && this.Content[0].Footer.Even !== this.Content[0].Footer.Odd && this.Content[0].Footer.Even != this.Content[0].Footer.First) {
            this.Content[0].Footer.Even.Reset_RecalculateCache();
        }
    },
    Draw: function (nPageIndex, pGraphics) {
        var bHeader = true;
        var bFirst = (0 === nPageIndex ? true : false);
        var bEven = (nPageIndex % 2 === 1 ? true : false);
        var Ptr = null;
        if (true === bHeader) {
            Ptr = this.Content[0].Header;
        } else {
            Ptr = this.Content[0].Footer;
        }
        if (true === bFirst) {
            if (null != this.Content[0].Header.First) {
                this.Content[0].Header.First.Draw(nPageIndex, pGraphics);
            }
            if (null != this.Content[0].Footer.First) {
                this.Content[0].Footer.First.Draw(nPageIndex, pGraphics);
            }
        } else {
            if (true === bEven) {
                if (null != this.Content[0].Header.Even) {
                    this.Content[0].Header.Even.Draw(nPageIndex, pGraphics);
                }
                if (null != this.Content[0].Footer.Even) {
                    this.Content[0].Footer.Even.Draw(nPageIndex, pGraphics);
                }
            } else {
                if (null != this.Content[0].Header.Odd) {
                    this.Content[0].Header.Odd.Draw(nPageIndex, pGraphics);
                }
                if (null != this.Content[0].Footer.Odd) {
                    this.Content[0].Footer.Odd.Draw(nPageIndex, pGraphics);
                }
            }
        }
    },
    CheckRange: function (X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf, PageIndex) {
        var bFirst = (0 === PageIndex ? true : false);
        var bEven = (PageIndex % 2 === 1 ? true : false);
        var Header = null;
        var Footer = null;
        if (true === bFirst) {
            Header = this.Content[0].Header.First;
            Footer = this.Content[0].Footer.First;
        } else {
            if (true === bEven) {
                Header = this.Content[0].Header.Even;
                Footer = this.Content[0].Footer.Even;
            } else {
                Header = this.Content[0].Header.Odd;
                Footer = this.Content[0].Footer.Odd;
            }
        }
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
    Get_HeaderBottomPos: function (PageIndex) {
        var HdrFtr = this.Internal_GetContentByXY(0, 0, PageIndex);
        if (null != HdrFtr && hdrftr_Header === HdrFtr.Type) {
            return HdrFtr.Get_Bounds().Bottom;
        }
        return -1;
    },
    Get_FooterTopPos: function (PageIndex) {
        var HdrFtr = this.Internal_GetContentByXY(0, Page_Height, PageIndex);
        if (null != HdrFtr && hdrftr_Footer === HdrFtr.Type) {
            return HdrFtr.Get_Bounds().Top;
        }
        return -1;
    },
    UpdateMargins: function (Index, bNoRecalc, bNoSaveHistory) {
        var SectHdrFtr = this.Content[Index];
        var Headers = SectHdrFtr.Header;
        var Footers = SectHdrFtr.Footer;
        if (Headers.First != Headers.Odd && Headers.First != Headers.Even && null != Headers.First) {
            Headers.First.UpdateMargins(bNoRecalc, bNoSaveHistory);
        }
        if (Headers.Even != Headers.Odd && null != Headers.Even) {
            Headers.Even.UpdateMargins(bNoRecalc, bNoSaveHistory);
        }
        if (null != Headers.Odd) {
            Headers.Odd.UpdateMargins(bNoRecalc, bNoSaveHistory);
        }
        if (Footers.First != Footers.Odd && Footers.First != Footers.Even && null != Footers.First) {
            Footers.First.UpdateMargins(bNoRecalc, bNoSaveHistory);
        }
        if (Footers.Even != Footers.Odd && null != Footers.Even) {
            Footers.Even.UpdateMargins(bNoRecalc, bNoSaveHistory);
        }
        if (null != Footers.Odd) {
            Footers.Odd.UpdateMargins(bNoRecalc, bNoSaveHistory);
        }
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
        if (null != this.Content[0].Header.First && Id === this.Content[0].Header.First.Get_Id()) {
            return true;
        }
        if (null != this.Content[0].Header.Even && Id === this.Content[0].Header.Even.Get_Id()) {
            return true;
        }
        if (null != this.Content[0].Header.Odd && Id === this.Content[0].Header.Odd.Get_Id()) {
            return true;
        }
        if (null != this.Content[0].Footer.First && Id === this.Content[0].Footer.First.Get_Id()) {
            return true;
        }
        if (null != this.Content[0].Footer.Even && Id === this.Content[0].Footer.Even.Get_Id()) {
            return true;
        }
        if (null != this.Content[0].Footer.Odd && Id === this.Content[0].Footer.Odd.Get_Id()) {
            return true;
        }
        return false;
    },
    Check_Page: function (HdrFtr, PageIndex) {
        var bHeader = (HdrFtr.Type === hdrftr_Header ? true : false);
        var bFirst = (0 === PageIndex ? true : false);
        var bEven = (PageIndex % 2 === 1 ? true : false);
        if (true === bFirst) {
            if ((true === bHeader && HdrFtr === this.Content[0].Header.First) || (true != bHeader && HdrFtr === this.Content[0].Footer.First)) {
                return true;
            }
        } else {
            if (true === bEven) {
                if ((true === bHeader && HdrFtr === this.Content[0].Header.Even) || (true != bHeader && HdrFtr === this.Content[0].Footer.Even)) {
                    return true;
                }
            } else {
                if ((true === bHeader && HdrFtr === this.Content[0].Header.Odd) || (true != bHeader && HdrFtr === this.Content[0].Footer.Odd)) {
                    return true;
                }
            }
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
    Add_NewParagraph: function () {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Add_NewParagraph();
        }
    },
    Add_FlowImage: function (W, H, Img) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Add_FlowImage(W, H, Img);
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
    Cursor_MoveAt: function (X, Y, AddToSelect) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Cursor_MoveAt(X, Y, AddToSelect);
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
    Get_AllParagraphs_ByNumbering: function (NumPr, ParaArray) {
        var SectHdrFtr = this.Content[0];
        var Headers = SectHdrFtr.Header;
        var Footers = SectHdrFtr.Footer;
        if (Headers.First != Headers.Odd && Headers.First != Headers.Even && null != Headers.First) {
            Headers.First.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
        }
        if (Headers.Even != Headers.Odd && null != Headers.Even) {
            Headers.Even.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
        }
        if (null != Headers.Odd) {
            Headers.Odd.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
        }
        if (Footers.First != Footers.Odd && Footers.First != Footers.Even && null != Footers.First) {
            Footers.First.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
        }
        if (Footers.Even != Footers.Odd && null != Footers.Even) {
            Footers.Even.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
        }
        if (null != Footers.Odd) {
            Footers.Odd.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
        }
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
        var bFirst = (0 === PageIndex ? true : false);
        var bEven = (PageIndex % 2 === 1 ? true : false);
        var TempHdrFtr = null;
        var PageMetrics = this.LogicDocument.Get_PageContentStartPos(PageIndex);
        if (MouseEvent.ClickCount >= 2 && true != editor.isStartAddShape && !(Y <= PageMetrics.Y || (((true === bFirst && null != (TempHdrFtr = this.Content[0].Header.First)) || (true === bEven && null != (TempHdrFtr = this.Content[0].Header.Even)) || (false === bEven && null != (TempHdrFtr = this.Content[0].Header.Odd))) && true === TempHdrFtr.Is_PointInDrawingObjects(X, Y))) && !(Y >= PageMetrics.YLimit || (((true === bFirst && null != (TempHdrFtr = this.Content[0].Footer.First)) || (true === bEven && null != (TempHdrFtr = this.Content[0].Footer.Even)) || (false === bEven && null != (TempHdrFtr = this.Content[0].Footer.Odd))) && true === TempHdrFtr.Is_PointInDrawingObjects(X, Y)))) {
            if (null != this.CurHdrFtr) {
                this.CurHdrFtr.Selection_Remove();
            }
            MouseEvent.ClickCount = 1;
            return false;
        }
        this.CurPage = PageIndex;
        var bHeader = null;
        if (Y <= PageMetrics.Y || (((true === bFirst && null != (TempHdrFtr = this.Content[0].Header.First)) || (true === bEven && null != (TempHdrFtr = this.Content[0].Header.Even)) || (false === bEven && null != (TempHdrFtr = this.Content[0].Header.Odd))) && true === TempHdrFtr.Is_PointInDrawingObjects(X, Y)) || true === editor.isStartAddShape) {
            bHeader = true;
            if ((null === this.Content[0].Header.First && true === bFirst) || (null === this.Content[0].Header.Even && true === bEven) || (null === this.Content[0].Header.Odd && false === bEven)) {
                if (false === editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_HdrFtr)) {
                    this.LogicDocument.CurPos.Type = docpostype_Content;
                    History.Create_NewPoint();
                    this.LogicDocument.CurPos.Type = docpostype_HdrFtr;
                    this.AddHeaderOrFooter(hdrftr_Header, hdrftr_Default);
                } else {
                    return false;
                }
            }
        } else {
            if (Y >= PageMetrics.YLimit || (((true === bFirst && null != (TempHdrFtr = this.Content[0].Footer.First)) || (true === bEven && null != (TempHdrFtr = this.Content[0].Footer.Even)) || (false === bEven && null != (TempHdrFtr = this.Content[0].Footer.Odd))) && true === TempHdrFtr.Is_PointInDrawingObjects(X, Y))) {
                bHeader = false;
                if ((null === this.Content[0].Footer.First && true === bFirst) || (null === this.Content[0].Footer.Even && true === bEven) || (null === this.Content[0].Footer.Odd && false === bEven)) {
                    if (false === editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_HdrFtr)) {
                        this.LogicDocument.CurPos.Type = docpostype_Content;
                        History.Create_NewPoint();
                        this.LogicDocument.CurPos.Type = docpostype_HdrFtr;
                        this.AddHeaderOrFooter(hdrftr_Footer, hdrftr_Default);
                    } else {
                        return false;
                    }
                }
            }
        }
        if (null === bHeader) {
            this.WaitMouseDown = true;
            return true;
        } else {
            this.WaitMouseDown = false;
        }
        var Ptr = null;
        if (true === bHeader) {
            Ptr = this.Content[0].Header;
        } else {
            Ptr = this.Content[0].Footer;
        }
        var OldHdrFtr = this.CurHdrFtr;
        if (true === bFirst) {
            this.CurHdrFtr = Ptr.First;
        } else {
            if (true === bEven) {
                this.CurHdrFtr = Ptr.Even;
            } else {
                this.CurHdrFtr = Ptr.Odd;
            }
        }
        if (null != OldHdrFtr && (OldHdrFtr != this.CurHdrFtr || OldPage != this.CurPage)) {
            OldHdrFtr.Selection_Remove();
        }
        if (null != this.CurHdrFtr) {
            if (null != bHeader && (OldHdrFtr != this.CurHdrFtr || true === bActivate)) {
                if (true === bHeader) {
                    this.DrawingDocument.Set_RulerState_HdrFtr(true, this.CurHdrFtr.BoundY2, Math.max(this.CurHdrFtr.BoundY, Y_Top_Field));
                } else {
                    var Top = this.CurHdrFtr.Get_Bounds().Top;
                    this.DrawingDocument.Set_RulerState_HdrFtr(false, Top, Page_Height);
                }
            }
            this.CurHdrFtr.Selection_SetStart(X, Y, PageIndex, MouseEvent);
            if (true === bActivate) {
                var NewMouseEvent = new Object();
                NewMouseEvent.Type = g_mouse_event_type_up;
                NewMouseEvent.ClickCount = 1;
                this.CurHdrFtr.Selection_SetEnd(X, Y, PageIndex, NewMouseEvent);
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
                    ResY = Page_Height + 10;
                } else {
                    if (PageIndex < this.CurPage) {
                        ResY = -10;
                    }
                }
                PageIndex = this.CurPage;
            }
            this.CurHdrFtr.Selection_SetEnd(X, ResY, PageIndex, MouseEvent);
            if (false === this.ChangeCurPageOnEnd) {
                this.CurHdrFtr.Content.Set_StartPage(this.CurPage);
            }
        }
    },
    Selection_Is_TableBorderMove: function () {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Selection_Is_TableBorderMove();
        }
        return false;
    },
    Selection_Check: function (X, Y, Page_Abs) {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Selection_Check(X, Y, Page_Abs);
        }
    },
    Select_All: function () {
        if (null != this.CurHdrFtr) {
            return this.CurHdrFtr.Select_All();
        }
    },
    Get_NearestPos: function (PageNum, X, Y, bAnchor, Drawing) {
        var HdrFtr = this.Internal_GetContentByXY(X, Y, PageNum);
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
        var bFirst = (0 === PageIndex ? true : false);
        var bEven = (PageIndex % 2 === 1 ? true : false);
        var Header = null;
        var Footer = null;
        if (true === bFirst) {
            Header = this.Content[0].Header.First;
            Footer = this.Content[0].Footer.First;
        } else {
            if (true === bEven) {
                Header = this.Content[0].Header.Even;
                Footer = this.Content[0].Footer.Even;
            } else {
                Header = this.Content[0].Header.Odd;
                Footer = this.Content[0].Footer.Odd;
            }
        }
        if (Y <= Page_Height / 2 && null != Header) {
            return Header;
        } else {
            if (Y >= Page_Height / 2 && null != Footer) {
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
        var HdrFtrState = new Object();
        HdrFtrState.CurHdrFtr = this.CurHdrFtr;
        var State = null;
        if (null != this.CurHdrFtr) {
            State = this.CurHdrFtr.Content.Get_SelectionState();
        } else {
            State = new Array();
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
    Undo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_HdrFtrController_AddItem:
            this.Content[0] = Data.Old;
            break;
        case historyitem_HdrFtrController_RemoveItem:
            this.Content[0] = Data.Old;
            break;
        }
    },
    Redo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_HdrFtrController_AddItem:
            this.Content[0] = Data.New;
            break;
        case historyitem_HdrFtrController_RemoveItem:
            this.Content[0] = Data.New;
            break;
        }
    },
    Refresh_RecalcData: function (Data) {
        if (null != this.Content[0].Header.First) {
            History.RecalcData_Add({
                Type: historyrecalctype_HdrFtr,
                Data: this.Content[0].Header.First
            });
        }
        if (null != this.Content[0].Header.Even) {
            History.RecalcData_Add({
                Type: historyrecalctype_HdrFtr,
                Data: this.Content[0].Header.Even
            });
        }
        if (null != this.Content[0].Header.Odd) {
            History.RecalcData_Add({
                Type: historyrecalctype_HdrFtr,
                Data: this.Content[0].Header.Odd
            });
        }
        if (null != this.Content[0].Footer.First) {
            History.RecalcData_Add({
                Type: historyrecalctype_HdrFtr,
                Data: this.Content[0].Footer.First
            });
        }
        if (null != this.Content[0].Footer.Even) {
            History.RecalcData_Add({
                Type: historyrecalctype_HdrFtr,
                Data: this.Content[0].Footer.Even
            });
        }
        if (null != this.Content[0].Footer.Odd) {
            History.RecalcData_Add({
                Type: historyrecalctype_HdrFtr,
                Data: this.Content[0].Footer.Odd
            });
        }
    },
    DocumentSearch: function (SearchString) {
        var bHdr_first = false;
        var bHdr_even = false;
        if (this.Content[0].Header.First != this.Content[0].Header.Odd) {
            bHdr_first = true;
        }
        if (this.Content[0].Header.Even != this.Content[0].Header.Odd) {
            bHdr_even = true;
        }
        if (true === bHdr_even && true === bHdr_first) {
            if (null != this.Content[0].Header.First) {
                this.Content[0].Header.First.DocumentSearch(SearchString, search_Header | search_HdrFtr_First);
            }
            if (null != this.Content[0].Header.Even) {
                this.Content[0].Header.Even.DocumentSearch(SearchString, search_Header | search_HdrFtr_Even);
            }
            if (null != this.Content[0].Header.Odd) {
                this.Content[0].Header.Odd.DocumentSearch(SearchString, search_Header | search_HdrFtr_Odd_no_First);
            }
        } else {
            if (true === bHdr_even) {
                if (null != this.Content[0].Header.Even) {
                    this.Content[0].Header.Even.DocumentSearch(SearchString, search_Header | search_HdrFtr_Even);
                }
                if (null != this.Content[0].Header.Odd) {
                    this.Content[0].Header.Odd.DocumentSearch(SearchString, search_Header | search_HdrFtr_Odd);
                }
            } else {
                if (true === bHdr_first) {
                    if (null != this.Content[0].Header.First) {
                        this.Content[0].Header.First.DocumentSearch(SearchString, search_Header | search_HdrFtr_First);
                    }
                    if (null != this.Content[0].Header.Odd) {
                        this.Content[0].Header.Odd.DocumentSearch(SearchString, search_Header | search_HdrFtr_All_no_First);
                    }
                } else {
                    if (null != this.Content[0].Header.Odd) {
                        this.Content[0].Header.Odd.DocumentSearch(SearchString, search_Header | search_HdrFtr_All);
                    }
                }
            }
        }
        var bFtr_first = false;
        var bFtr_even = false;
        if (this.Content[0].Footer.First != this.Content[0].Footer.Odd) {
            bFtr_first = true;
        }
        if (this.Content[0].Footer.Even != this.Content[0].Footer.Odd) {
            bFtr_even = true;
        }
        if (true === bFtr_even && true === bFtr_first) {
            if (null != this.Content[0].Footer.First) {
                this.Content[0].Footer.First.DocumentSearch(SearchString, search_Footer | search_HdrFtr_First);
            }
            if (null != this.Content[0].Footer.Even) {
                this.Content[0].Footer.Even.DocumentSearch(SearchString, search_Footer | search_HdrFtr_Even);
            }
            if (null != this.Content[0].Footer.Odd) {
                this.Content[0].Footer.Odd.DocumentSearch(SearchString, search_Footer | search_HdrFtr_Odd_no_First);
            }
        } else {
            if (true === bFtr_even) {
                if (null != this.Content[0].Footer.Even) {
                    this.Content[0].Footer.Even.DocumentSearch(SearchString, search_Footer | search_HdrFtr_Even);
                }
                if (null != this.Content[0].Footer.Odd) {
                    this.Content[0].Footer.Odd.DocumentSearch(SearchString, search_Footer | search_HdrFtr_Odd);
                }
            } else {
                if (true === bFtr_first) {
                    if (null != this.Content[0].Footer.First) {
                        this.Content[0].Footer.First.DocumentSearch(SearchString, search_Footer | search_HdrFtr_First);
                    }
                    if (null != this.Content[0].Footer.Odd) {
                        this.Content[0].Footer.Odd.DocumentSearch(SearchString, search_Footer | search_HdrFtr_All_no_First);
                    }
                } else {
                    if (null != this.Content[0].Footer.Odd) {
                        this.Content[0].Footer.Odd.DocumentSearch(SearchString, search_Footer | search_HdrFtr_All);
                    }
                }
            }
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
    Document_CreateFontMap: function (FontMap) {
        var bHdr_first = false;
        var bHdr_even = false;
        if (this.Content[0].Header.First != this.Content[0].Header.Odd) {
            bHdr_first = true;
        }
        if (this.Content[0].Header.Even != this.Content[0].Header.Odd) {
            bHdr_even = true;
        }
        if (true === bHdr_even && true === bHdr_first) {
            if (null != this.Content[0].Header.First) {
                this.Content[0].Header.First.Document_CreateFontMap(FontMap);
            }
            if (null != this.Content[0].Header.Even) {
                this.Content[0].Header.Even.Document_CreateFontMap(FontMap);
            }
            if (null != this.Content[0].Header.Odd) {
                this.Content[0].Header.Odd.Document_CreateFontMap(FontMap);
            }
        } else {
            if (true === bHdr_even) {
                if (null != this.Content[0].Header.Even) {
                    this.Content[0].Header.Even.Document_CreateFontMap(FontMap);
                }
                if (null != this.Content[0].Header.Odd) {
                    this.Content[0].Header.Odd.Document_CreateFontMap(FontMap);
                }
            } else {
                if (true === bHdr_first) {
                    if (null != this.Content[0].Header.First) {
                        this.Content[0].Header.First.Document_CreateFontMap(FontMap);
                    }
                    if (null != this.Content[0].Header.Odd) {
                        this.Content[0].Header.Odd.Document_CreateFontMap(FontMap);
                    }
                } else {
                    if (null != this.Content[0].Header.Odd) {
                        this.Content[0].Header.Odd.Document_CreateFontMap(FontMap);
                    }
                }
            }
        }
        var bFtr_first = false;
        var bFtr_even = false;
        if (this.Content[0].Footer.First != this.Content[0].Footer.Odd) {
            bFtr_first = true;
        }
        if (this.Content[0].Footer.Even != this.Content[0].Footer.Odd) {
            bFtr_even = true;
        }
        if (true === bFtr_even && true === bFtr_first) {
            if (null != this.Content[0].Footer.First) {
                this.Content[0].Footer.First.Document_CreateFontMap(FontMap);
            }
            if (null != this.Content[0].Footer.Even) {
                this.Content[0].Footer.Even.Document_CreateFontMap(FontMap);
            }
            if (null != this.Content[0].Footer.Odd) {
                this.Content[0].Footer.Odd.Document_CreateFontMap(FontMap);
            }
        } else {
            if (true === bFtr_even) {
                if (null != this.Content[0].Footer.Even) {
                    this.Content[0].Footer.Even.Document_CreateFontMap(FontMap);
                }
                if (null != this.Content[0].Footer.Odd) {
                    this.Content[0].Footer.Odd.Document_CreateFontMap(FontMap);
                }
            } else {
                if (true === bFtr_first) {
                    if (null != this.Content[0].Footer.First) {
                        this.Content[0].Footer.First.Document_CreateFontMap(FontMap);
                    }
                    if (null != this.Content[0].Footer.Odd) {
                        this.Content[0].Footer.Odd.Document_CreateFontMap(FontMap);
                    }
                } else {
                    if (null != this.Content[0].Footer.Odd) {
                        this.Content[0].Footer.Odd.Document_CreateFontMap(FontMap);
                    }
                }
            }
        }
    },
    Document_CreateFontCharMap: function (FontMap) {
        var bHdr_first = false;
        var bHdr_even = false;
        if (this.Content[0].Header.First != this.Content[0].Header.Odd) {
            bHdr_first = true;
        }
        if (this.Content[0].Header.Even != this.Content[0].Header.Odd) {
            bHdr_even = true;
        }
        if (true === bHdr_even && true === bHdr_first) {
            if (null != this.Content[0].Header.First) {
                this.Content[0].Header.First.Document_CreateFontCharMap(FontMap);
            }
            if (null != this.Content[0].Header.Even) {
                this.Content[0].Header.Even.Document_CreateFontCharMap(FontMap);
            }
            if (null != this.Content[0].Header.Odd) {
                this.Content[0].Header.Odd.Document_CreateFontCharMap(FontMap);
            }
        } else {
            if (true === bHdr_even) {
                if (null != this.Content[0].Header.Even) {
                    this.Content[0].Header.Even.Document_CreateFontCharMap(FontMap);
                }
                if (null != this.Content[0].Header.Odd) {
                    this.Content[0].Header.Odd.Document_CreateFontCharMap(FontMap);
                }
            } else {
                if (true === bHdr_first) {
                    if (null != this.Content[0].Header.First) {
                        this.Content[0].Header.First.Document_CreateFontCharMap(FontMap);
                    }
                    if (null != this.Content[0].Header.Odd) {
                        this.Content[0].Header.Odd.Document_CreateFontCharMap(FontMap);
                    }
                } else {
                    if (null != this.Content[0].Header.Odd) {
                        this.Content[0].Header.Odd.Document_CreateFontCharMap(FontMap);
                    }
                }
            }
        }
        var bFtr_first = false;
        var bFtr_even = false;
        if (this.Content[0].Footer.First != this.Content[0].Footer.Odd) {
            bFtr_first = true;
        }
        if (this.Content[0].Footer.Even != this.Content[0].Footer.Odd) {
            bFtr_even = true;
        }
        if (true === bFtr_even && true === bFtr_first) {
            if (null != this.Content[0].Footer.First) {
                this.Content[0].Footer.First.Document_CreateFontCharMap(FontMap);
            }
            if (null != this.Content[0].Footer.Even) {
                this.Content[0].Footer.Even.Document_CreateFontCharMap(FontMap);
            }
            if (null != this.Content[0].Footer.Odd) {
                this.Content[0].Footer.Odd.Document_CreateFontCharMap(FontMap);
            }
        } else {
            if (true === bFtr_even) {
                if (null != this.Content[0].Footer.Even) {
                    this.Content[0].Footer.Even.Document_CreateFontCharMap(FontMap);
                }
                if (null != this.Content[0].Footer.Odd) {
                    this.Content[0].Footer.Odd.Document_CreateFontCharMap(FontMap);
                }
            } else {
                if (true === bFtr_first) {
                    if (null != this.Content[0].Footer.First) {
                        this.Content[0].Footer.First.Document_CreateFontCharMap(FontMap);
                    }
                    if (null != this.Content[0].Footer.Odd) {
                        this.Content[0].Footer.Odd.Document_CreateFontCharMap(FontMap);
                    }
                } else {
                    if (null != this.Content[0].Footer.Odd) {
                        this.Content[0].Footer.Odd.Document_CreateFontCharMap(FontMap);
                    }
                }
            }
        }
    },
    Document_Get_AllFontNames: function (AllFonts) {
        var bHdr_first = false;
        var bHdr_even = false;
        if (this.Content[0].Header.First != this.Content[0].Header.Odd) {
            bHdr_first = true;
        }
        if (this.Content[0].Header.Even != this.Content[0].Header.Odd) {
            bHdr_even = true;
        }
        if (true === bHdr_even && true === bHdr_first) {
            if (null != this.Content[0].Header.First) {
                this.Content[0].Header.First.Document_Get_AllFontNames(AllFonts);
            }
            if (null != this.Content[0].Header.Even) {
                this.Content[0].Header.Even.Document_Get_AllFontNames(AllFonts);
            }
            if (null != this.Content[0].Header.Odd) {
                this.Content[0].Header.Odd.Document_Get_AllFontNames(AllFonts);
            }
        } else {
            if (true === bHdr_even) {
                if (null != this.Content[0].Header.Even) {
                    this.Content[0].Header.Even.Document_Get_AllFontNames(AllFonts);
                }
                if (null != this.Content[0].Header.Odd) {
                    this.Content[0].Header.Odd.Document_Get_AllFontNames(AllFonts);
                }
            } else {
                if (true === bHdr_first) {
                    if (null != this.Content[0].Header.First) {
                        this.Content[0].Header.First.Document_Get_AllFontNames(AllFonts);
                    }
                    if (null != this.Content[0].Header.Odd) {
                        this.Content[0].Header.Odd.Document_Get_AllFontNames(AllFonts);
                    }
                } else {
                    if (null != this.Content[0].Header.Odd) {
                        this.Content[0].Header.Odd.Document_Get_AllFontNames(AllFonts);
                    }
                }
            }
        }
        var bFtr_first = false;
        var bFtr_even = false;
        if (this.Content[0].Footer.First != this.Content[0].Footer.Odd) {
            bFtr_first = true;
        }
        if (this.Content[0].Footer.Even != this.Content[0].Footer.Odd) {
            bFtr_even = true;
        }
        if (true === bFtr_even && true === bFtr_first) {
            if (null != this.Content[0].Footer.First) {
                this.Content[0].Footer.First.Document_Get_AllFontNames(AllFonts);
            }
            if (null != this.Content[0].Footer.Even) {
                this.Content[0].Footer.Even.Document_Get_AllFontNames(AllFonts);
            }
            if (null != this.Content[0].Footer.Odd) {
                this.Content[0].Footer.Odd.Document_Get_AllFontNames(AllFonts);
            }
        } else {
            if (true === bFtr_even) {
                if (null != this.Content[0].Footer.Even) {
                    this.Content[0].Footer.Even.Document_Get_AllFontNames(AllFonts);
                }
                if (null != this.Content[0].Footer.Odd) {
                    this.Content[0].Footer.Odd.Document_Get_AllFontNames(AllFonts);
                }
            } else {
                if (true === bFtr_first) {
                    if (null != this.Content[0].Footer.First) {
                        this.Content[0].Footer.First.Document_Get_AllFontNames(AllFonts);
                    }
                    if (null != this.Content[0].Footer.Odd) {
                        this.Content[0].Footer.Odd.Document_Get_AllFontNames(AllFonts);
                    }
                } else {
                    if (null != this.Content[0].Footer.Odd) {
                        this.Content[0].Footer.Odd.Document_Get_AllFontNames(AllFonts);
                    }
                }
            }
        }
    },
    Document_Is_SelectionLocked: function (CheckType) {
        this.Lock.Check(this.Get_Id());
    },
    Save_Changes: function (Data, Writer) {
        Writer.WriteLong(historyitem_type_HdrFtrController);
        var Type = Data.Type;
        Writer.WriteLong(Type);
        switch (Type) {
        case historyitem_HdrFtrController_AddItem:
            case historyitem_HdrFtrController_RemoveItem:
            var HeaderFlag = 0;
            if (null != Data.New.Header.First) {
                HeaderFlag |= 1;
            }
            if (null != Data.New.Header.Even) {
                HeaderFlag |= 2;
            }
            if (null != Data.New.Header.Odd) {
                HeaderFlag |= 4;
            }
            if (Data.New.Header.First === Data.New.Header.Even) {
                HeaderFlag |= 8;
            }
            if (Data.New.Header.First === Data.New.Header.Odd) {
                HeaderFlag |= 16;
            }
            if (Data.New.Header.Even === Data.New.Header.Odd) {
                HeaderFlag |= 32;
            }
            Writer.WriteLong(HeaderFlag);
            if (HeaderFlag & 1) {
                Writer.WriteString2(Data.New.Header.First.Get_Id());
            }
            if (HeaderFlag & 2 && !(HeaderFlag & 8)) {
                Writer.WriteString2(Data.New.Header.Even.Get_Id());
            }
            if (HeaderFlag & 4 && !(HeaderFlag & 16) && !(HeaderFlag & 32)) {
                Writer.WriteString2(Data.New.Header.Odd.Get_Id());
            }
            var FooterFlag = 0;
            if (null != Data.New.Footer.First) {
                FooterFlag |= 1;
            }
            if (null != Data.New.Footer.Even) {
                FooterFlag |= 2;
            }
            if (null != Data.New.Footer.Odd) {
                FooterFlag |= 4;
            }
            if (Data.New.Footer.First === Data.New.Footer.Even) {
                FooterFlag |= 8;
            }
            if (Data.New.Footer.First === Data.New.Footer.Odd) {
                FooterFlag |= 16;
            }
            if (Data.New.Footer.Even === Data.New.Footer.Odd) {
                FooterFlag |= 32;
            }
            Writer.WriteLong(FooterFlag);
            if (FooterFlag & 1) {
                Writer.WriteString2(Data.New.Footer.First.Get_Id());
            }
            if (FooterFlag & 2 && !(FooterFlag & 8)) {
                Writer.WriteString2(Data.New.Footer.Even.Get_Id());
            }
            if (FooterFlag & 4 && !(FooterFlag & 16) && !(FooterFlag & 32)) {
                Writer.WriteString2(Data.New.Footer.Odd.Get_Id());
            }
            break;
        }
        return Writer;
    },
    Save_Changes2: function (Data, Writer) {
        return false;
    },
    Load_Changes: function (Reader, Reader2) {
        var ClassType = Reader.GetLong();
        if (historyitem_type_HdrFtrController != ClassType) {
            return;
        }
        var Type = Reader.GetLong();
        switch (Type) {
        case historyitem_HdrFtrController_AddItem:
            case historyitem_HdrFtrController_RemoveItem:
            var HeaderFlag = Reader.GetLong();
            if (HeaderFlag & 1) {
                this.Content[0].Header.First = g_oTableId.Get_ById(Reader.GetString2());
            } else {
                this.Content[0].Header.First = null;
            }
            if (HeaderFlag & 2) {
                if (! (HeaderFlag & 8)) {
                    this.Content[0].Header.Even = g_oTableId.Get_ById(Reader.GetString2());
                } else {
                    this.Content[0].Header.Even = this.Content[0].Header.First;
                }
            } else {
                this.Content[0].Header.Even = null;
            }
            if (HeaderFlag & 4) {
                if (! (HeaderFlag & 16) && !(HeaderFlag & 32)) {
                    this.Content[0].Header.Odd = g_oTableId.Get_ById(Reader.GetString2());
                } else {
                    if (! (HeaderFlag & 16)) {
                        this.Content[0].Header.Odd = this.Content[0].Header.First;
                    } else {
                        this.Content[0].Header.Odd = this.Content[0].Header.Even;
                    }
                }
            } else {
                this.Content[0].Header.Odd = null;
            }
            var FooterFlag = Reader.GetLong();
            if (FooterFlag & 1) {
                this.Content[0].Footer.First = g_oTableId.Get_ById(Reader.GetString2());
            } else {
                this.Content[0].Footer.First = null;
            }
            if (FooterFlag & 2) {
                if (! (FooterFlag & 8)) {
                    this.Content[0].Footer.Even = g_oTableId.Get_ById(Reader.GetString2());
                } else {
                    this.Content[0].Footer.Even = this.Content[0].Footer.First;
                }
            } else {
                this.Content[0].Footer.Even = null;
            }
            if (FooterFlag & 4) {
                if (! (FooterFlag & 16) && !(FooterFlag & 32)) {
                    this.Content[0].Footer.Odd = g_oTableId.Get_ById(Reader.GetString2());
                } else {
                    if (FooterFlag & 16) {
                        this.Content[0].Footer.Odd = this.Content[0].Footer.First;
                    } else {
                        this.Content[0].Footer.Odd = this.Content[0].Footer.Even;
                    }
                }
            } else {
                this.Content[0].Footer.Odd = null;
            }
            break;
        }
    },
    Load_LinkData: function (LinkData) {},
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
    }
};