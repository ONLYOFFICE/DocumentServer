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
 function CDocumentContent(Parent, DrawingDocument, X, Y, XLimit, YLimit, Split, TurnOffInnerWrap) {
    this.Id = g_oIdCounter.Get_NewId();
    this.CurPage = 0;
    this.StartPage = 0;
    this.X = X;
    this.Y = Y;
    this.XLimit = XLimit;
    this.YLimit = YLimit;
    this.Parent = Parent;
    this.DrawingDocument = DrawingDocument;
    this.LogicDocument = editor.WordControl.m_oLogicDocument;
    if ("undefined" === typeof(TurnOffInnerWrap)) {
        TurnOffInnerWrap = false;
    }
    this.TurnOffInnerWrap = TurnOffInnerWrap;
    this.Pages = new Array();
    this.RecalcInfo = new CDocumentRecalcInfo();
    this.Split = Split;
    this.Content = new Array();
    this.Content[0] = new Paragraph(DrawingDocument, this, 0, X, Y, XLimit, YLimit);
    this.Content[0].Set_DocumentNext(null);
    this.Content[0].Set_DocumentPrev(null);
    this.CurPos = {
        X: 0,
        Y: 0,
        ContentPos: 0,
        RealX: 0,
        RealY: 0,
        Type: docpostype_Content,
        TableMove: 0
    };
    this.Selection = {
        Start: false,
        Use: false,
        StartPos: 0,
        EndPos: 0,
        Flag: selectionflag_Common,
        Data: null
    };
    this.DrawingObjects = this.LogicDocument.DrawingObjects;
    this.Styles = editor.WordControl.m_oLogicDocument.Get_Styles();
    this.Numbering = editor.WordControl.m_oLogicDocument.Get_Numbering();
    this.ClipInfo = {
        X0: null,
        X1: null
    };
    this.ApplyToAll = false;
    this.TurnOffRecalc = false;
    this.m_oContentChanges = new CContentChanges();
    g_oTableId.Add(this, this.Id);
}
CDocumentContent.prototype = {
    Set_Id: function (newId) {
        g_oTableId.Reset_Id(this, newId, this.Id);
        this.Id = newId;
    },
    Get_Id: function () {
        return this.Id;
    },
    Copy: function (Parent) {
        var DC = new CDocumentContent(Parent, this.DrawingDocument, 0, 0, 0, 0, this.Split, this.TurnOffInnerWrap);
        DC.Internal_Content_RemoveAll();
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            DC.Internal_Content_Add(Index, this.Content[Index].Copy(DC), false);
        }
        return DC;
    },
    Copy2: function (OtherDC) {
        this.Internal_Content_RemoveAll();
        var Count = OtherDC.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            this.Internal_Content_Add(Index, OtherDC.Content[Index].Copy(this), false);
        }
    },
    Get_PageContentStartPos: function (PageNum) {
        return this.Parent.Get_PageContentStartPos(PageNum);
    },
    Get_PageLimits: function (PageIndex) {
        if (true === this.Parent.Is_Cell()) {
            var Margins = this.Parent.Get_Margins();
            var Y = this.Pages[PageIndex].Y - Margins.Top.W;
            var YLimit = this.Pages[PageIndex].YLimit + Margins.Bottom.W;
            var X = this.Pages[PageIndex].X - Margins.Left.W;
            var XLimit = this.Pages[PageIndex].XLimit + Margins.Right.W;
            return {
                X: X,
                XLimit: XLimit,
                Y: Y,
                YLimit: YLimit
            };
        } else {
            return {
                X: 0,
                Y: 0,
                XLimit: Page_Width,
                YLimit: Page_Height
            };
        }
    },
    Get_PageFields: function (PageIndex) {
        if (true === this.Parent.Is_Cell() || this.Parent instanceof WordShape) {
            if (PageIndex < this.Pages.length && PageIndex >= 0) {
                var Y = this.Pages[PageIndex].Y;
                var YLimit = this.Pages[PageIndex].YLimit;
                var X = this.Pages[PageIndex].X;
                var XLimit = this.Pages[PageIndex].XLimit;
                return {
                    X: X,
                    XLimit: XLimit,
                    Y: Y,
                    YLimit: YLimit
                };
            } else {
                return {
                    X: 0,
                    XLimit: Page_Width,
                    Y: 0,
                    YLimit: Page_Height
                };
            }
        } else {
            return {
                X: X_Left_Field,
                Y: Y_Top_Field,
                XLimit: X_Right_Field,
                YLimit: Y_Bottom_Field
            };
        }
    },
    Get_EmptyHeight: function () {
        var Count = this.Content.length;
        if (Count <= 0) {
            return 0;
        }
        var Element = this.Content[Count - 1];
        if (type_Paragraph === Element.GetType()) {
            return Element.Get_EmptyHeight();
        } else {
            return 0;
        }
    },
    CheckRange: function (X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf, PageNum_rel, Inner) {
        if (undefined === Inner) {
            Inner = true;
        }
        if ((false === this.TurnOffInnerWrap && true === Inner) || (false === Inner)) {
            return this.LogicDocument.DrawingObjects.CheckRange(X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf, PageNum_rel + this.Get_StartPage_Absolute(), [], this);
        }
        return [];
    },
    Is_PointInDrawingObjects: function (X, Y, Page_Abs) {
        return this.LogicDocument.DrawingObjects.pointInObjInDocContent(this, X, Y, Page_Abs);
    },
    Get_Numbering: function () {
        return this.Parent.Get_Numbering();
    },
    Internal_GetNumInfo: function (ParaId, NumPr) {
        this.NumInfoCounter++;
        var NumInfo = new Array(NumPr.Lvl + 1);
        for (var Index = 0; Index < NumInfo.length; Index++) {
            NumInfo[Index] = 0;
        }
        var Restart = -1;
        var AbstractNum = null;
        if ("undefined" != typeof(this.Numbering) && null != (AbstractNum = this.Numbering.Get_AbstractNum(NumPr.NumId))) {
            Restart = AbstractNum.Lvl[NumPr.Lvl].Restart;
        }
        for (var Index = 0; Index < this.Content.length; Index++) {
            var Item = this.Content[Index];
            var ItemNumPr = null;
            if (type_Paragraph == Item.GetType() && undefined != (ItemNumPr = Item.Numbering_Get()) && ItemNumPr.NumId == NumPr.NumId) {
                if ("undefined" == typeof(NumInfo[ItemNumPr.Lvl])) {
                    NumInfo[ItemNumPr.Lvl] = 0;
                } else {
                    NumInfo[ItemNumPr.Lvl]++;
                }
                if (0 != Restart && ItemNumPr.Lvl < NumPr.Lvl && (-1 == Restart || ItemNumPr.Lvl <= (Restart - 1))) {
                    NumInfo[NumPr.Lvl] = 0;
                }
                for (var Index2 = ItemNumPr.Lvl - 1; Index2 >= 0; Index2--) {
                    if ("undefined" == typeof(NumInfo[Index2]) || 0 == NumInfo[Index2]) {
                        NumInfo[Index2] = 1;
                    }
                }
            }
            if (ParaId == Item.GetId()) {
                break;
            }
        }
        return NumInfo;
    },
    Get_Styles: function () {
        return this.Styles;
    },
    Get_TableStyleForPara: function () {
        return this.Parent.Get_TableStyleForPara();
    },
    Recalc_AllParagraphs_CompiledPr: function () {
        var Count = this.Content.length;
        for (var Pos = 0; Pos < Count; Pos++) {
            var Item = this.Content[Pos];
            if (type_Paragraph === Item.GetType()) {
                Item.Recalc_CompiledPr();
            }
        }
    },
    Set_CurrentElement: function (Index) {
        var ContentPos = Math.max(0, Math.min(this.Content.length - 1, Index));
        this.CurPos.Type = docpostype_Content;
        this.Selection_Remove();
        this.CurPos.ContentPos = Math.max(0, Math.min(this.Content.length - 1, Index));
        if (true === this.Content[ContentPos].Is_SelectionUse()) {
            this.Selection.Use = true;
            this.Selection.StartPos = ContentPos;
            this.Selection.EndPos = ContentPos;
        }
        this.Parent.Set_CurrentElement();
    },
    Is_ThisElementCurrent: function () {
        return this.Parent.Is_ThisElementCurrent();
    },
    Content_GetPrev: function (Id) {
        var Index = this.Internal_Content_Find(Id);
        if (Index > 0) {
            return this.Content[Index - 1];
        }
        return null;
    },
    Content_GetNext: function (Id) {
        var Index = this.Internal_Content_Find(Id);
        if (-1 != Index && Index < this.Content.length - 1) {
            return this.Content[Index + 1];
        }
        return null;
    },
    Get_NearestPos: function (Page_Abs, X, Y, bAnchor, Drawing) {
        var Page_Rel = this.Get_Page_Relative(Page_Abs);
        var bInText = (null === this.Is_InText(X, Y, Page_Rel) ? false : true);
        var nInDrawing = this.LogicDocument.DrawingObjects.isPointInDrawingObjects(X, Y, Page_Abs, this);
        if (true != bAnchor) {
            var NearestPos = this.LogicDocument.DrawingObjects.getNearestPos(X, Y, Page_Abs, Drawing);
            if ((nInDrawing === DRAWING_ARRAY_TYPE_BEFORE || nInDrawing === DRAWING_ARRAY_TYPE_INLINE || (false === bInText && nInDrawing >= 0)) && null != NearestPos) {
                return NearestPos;
            }
        }
        var ContentPos = this.Internal_GetContentPosByXY(X, Y, Page_Rel);
        if (true != bAnchor && (0 < ContentPos || Page_Rel > 0) && ContentPos === this.Pages[Page_Rel].Pos && this.Pages[Page_Rel].EndPos > this.Pages[Page_Rel].Pos && type_Paragraph === this.Content[ContentPos].GetType() && true === this.Content[ContentPos].Is_ContentOnFirstPage()) {
            ContentPos++;
        }
        return this.Content[ContentPos].Get_NearestPos(Page_Rel, X, Y, bAnchor, Drawing);
    },
    Is_TableCellContent: function () {
        return this.Parent.Is_Cell();
    },
    Is_InTable: function (bReturnTopTable) {
        return this.Parent.Is_InTable(bReturnTopTable);
    },
    Is_TopDocument: function (bReturnTopDocument) {
        return this.Parent.Is_TopDocument(bReturnTopDocument);
    },
    Is_UseInDocument: function (Id) {
        var bUse = false;
        if (null != Id) {
            var Count = this.Content.length;
            for (var Index = 0; Index < Count; Index++) {
                if (Id === this.Content[Index].Get_Id()) {
                    bUse = true;
                    break;
                }
            }
        } else {
            bUse = true;
        }
        if (true === bUse && null != this.Parent) {
            return this.Parent.Is_UseInDocument(this.Get_Id());
        }
        return false;
    },
    Is_HdrFtr: function (bReturnHdrFtr) {
        return this.Parent.Is_HdrFtr(bReturnHdrFtr);
    },
    Is_DrawingShape: function () {
        return this.Parent.Is_DrawingShape();
    },
    Selection_Is_OneElement: function () {
        if (true === this.Selection.Use && this.CurPos.Type === docpostype_Content && this.Selection.Flag === selectionflag_Common && this.Selection.StartPos === this.Selection.EndPos) {
            return true;
        }
        return false;
    },
    Selection_Is_TableBorderMove: function () {
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.DrawingObjects.selectionIsTableBorder();
        } else {
            if (null != this.Selection.Data && true === this.Selection.Data.TableBorder && type_Table == this.Content[this.Selection.Data.Pos].GetType()) {
                return true;
            }
        }
        return false;
    },
    Check_TableCoincidence: function (Table) {
        return this.Parent.Check_TableCoincidence(Table);
    },
    Reset: function (X, Y, XLimit, YLimit) {
        this.X = X;
        this.Y = Y;
        this.XLimit = XLimit;
        this.YLimit = YLimit;
        if (0 === this.CurPos.X && 0 === this.CurPos.Y) {
            this.CurPos.X = X;
            this.CurPos.Y = Y;
            this.CurPos.RealX = X;
            this.CurPos.RealY = Y;
        }
    },
    Recalculate: function () {
        editor.WordControl.m_oLogicDocument.bRecalcDocContent = true;
        editor.WordControl.m_oLogicDocument.recalcDocumentConten = this;
        editor.WordControl.m_oLogicDocument.Recalculate();
    },
    Reset_RecalculateCache: function () {
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            this.Content[Index].Reset_RecalculateCache();
        }
    },
    Recalculate_: function (bForceRecalc, LastChangeIndex) {
        if (true === this.TurnOffRecalc || true === editor.WordControl.m_oLogicDocument.TurnOffRecalc) {
            return;
        }
        if ("undefined" === typeof(bForceRecalc)) {
            bForceRecalc = false;
        }
        if ("undefined" === typeof(LastChangeIndex)) {
            LastChangeIndex = 0;
        }
        var OldPages = this.Pages.length;
        var OldBottom = new Array();
        for (var Index = 0; Index < OldPages; Index++) {
            OldBottom[Index] = this.Pages[Index].Bounds.Bottom;
        }
        var Old_FlowObjects = new Array();
        for (var Index = 0; Index < this.Pages.length; Index++) {
            Old_FlowObjects[Index] = this.Pages[Index].FlowObjects;
        }
        this.Pages.length = 0;
        this.Pages[0] = {
            Pos: 0,
            X: this.X,
            Y: this.Y,
            XLimit: this.XLimit,
            YLimit: this.YLimit,
            Bounds: {
                Left: this.X,
                Top: this.Y,
                Right: this.XLimit,
                Bottom: this.Y
            },
            FlowObjects: Old_FlowObjects[0]
        };
        var Count = this.Content.length;
        var X = this.X;
        var Y = this.Y;
        var CurPage = 0;
        for (var Index = 0; Index < Count; Index++) {
            var Element = this.Content[Index];
            Element.Set_DocumentIndex(Index);
            if (Index >= LastChangeIndex) {
                Element.TurnOff_RecalcEvent();
                Element.Reset(X, Y, this.Pages[CurPage].XLimit, this.Pages[CurPage].YLimit, CurPage);
                Element.Recalculate();
                Element.TurnOn_RecalcEvent();
            }
            var bNewPage = false;
            var Temp = CurPage;
            for (; CurPage < Temp + Element.Pages.length - 1;) {
                this.Pages[CurPage].Bounds.Bottom = Element.Pages[CurPage - Temp].Bounds.Bottom;
                if ("undefined" == typeof(this.Pages[++CurPage])) {
                    this.Pages[CurPage] = new Object();
                }
                var StartPos = this.Get_PageContentStartPos(CurPage);
                this.Pages[CurPage] = {
                    Pos: Index,
                    X: StartPos.X,
                    Y: StartPos.Y,
                    XLimit: StartPos.XLimit,
                    YLimit: StartPos.YLimit,
                    Bounds: {
                        Left: StartPos.X,
                        Top: StartPos.Y,
                        Right: StartPos.XLimit,
                        Bottom: StartPos.Y
                    }
                };
                if ("undefined" != typeof(Old_FlowObjects[CurPage]) && null != Old_FlowObjects[CurPage]) {
                    this.Pages[CurPage].FlowObjects = Old_FlowObjects[CurPage];
                } else {
                    this.Pages[CurPage].FlowObjects = new FlowObjects(this, CurPage);
                }
                bNewPage = true;
            }
            this.Pages[CurPage].Bounds.Bottom = Element.Pages[Element.Pages.length - 1].Bounds.Bottom;
            if (false === bNewPage) {
                Y += Element.Bounds.Bottom - Element.Bounds.Top;
            } else {
                Y = this.Get_PageContentStartPos(CurPage).Y;
                Y += Element.Bounds.Bottom - Y;
            }
        }
        var NewPages = this.Pages.length;
        var NewBottom = new Array();
        for (var Index = 0; Index < NewPages; Index++) {
            NewBottom[Index] = this.Pages[Index].Bounds.Bottom;
        }
        var bChange = ((OldPages != NewPages) ? true : false);
        if (false === bChange) {
            for (var Index = 0; Index < OldPages; Index++) {
                if (Math.abs(OldBottom[Index] - NewBottom[Index]) > 0.01) {
                    bChange = true;
                    break;
                }
            }
        }
        this.Parent.OnContentRecalculate(bChange, bForceRecalc);
    },
    Recalculate_Page: function (PageIndex, bStart) {
        if (0 === PageIndex && true === bStart) {
            this.RecalcInfo.FlowObject = null;
            this.RecalcInfo.FlowObjectPageBreakBefore = false;
        }
        var StartIndex = 0;
        if (PageIndex > 0) {
            StartIndex = this.Pages[PageIndex - 1].EndPos;
        }
        if (true === bStart) {
            this.Pages.length = PageIndex;
            this.Pages[PageIndex] = new CDocumentPage();
            this.Pages[PageIndex].Pos = StartIndex;
            this.LogicDocument.DrawingObjects.resetDrawingArrays(this.Get_StartPage_Absolute() + PageIndex, this);
        }
        var Count = this.Content.length;
        var StartPos;
        if (0 === PageIndex) {
            StartPos = {
                X: this.X,
                Y: this.Y,
                XLimit: this.XLimit,
                YLimit: this.YLimit
            };
        } else {
            StartPos = this.Get_PageContentStartPos(PageIndex);
        }
        this.Pages[PageIndex].Update_Limits(StartPos);
        var X = StartPos.X;
        var StartY = StartPos.Y;
        var Y = StartY;
        var YLimit = StartPos.YLimit;
        var XLimit = StartPos.XLimit;
        var Result = recalcresult2_End;
        for (var Index = StartIndex; Index < Count; Index++) {
            var Element = this.Content[Index];
            Element.TurnOff_RecalcEvent();
            var RecalcResult = recalcresult_NextElement;
            var bFlowTable = false;
            if (type_Table === Element.GetType() && true != Element.Is_Inline()) {
                bFlowTable = true;
                if (null === this.RecalcInfo.FlowObject) {
                    if ((0 === Index && 0 === PageIndex) || Index != StartIndex) {
                        Element.Set_DocumentIndex(Index);
                        Element.Reset(X, Y, XLimit, YLimit, PageIndex);
                    }
                    this.RecalcInfo.FlowObjectPage = 0;
                    this.RecalcInfo.FlowObject = Element;
                    this.RecalcInfo.RecalcResult = Element.Recalculate_Page(PageIndex);
                    this.DrawingObjects.addFloatTable(new CFlowTable2(Element, PageIndex));
                    RecalcResult = recalcresult_CurPage;
                } else {
                    if (Element === this.RecalcInfo.FlowObject) {
                        if (Element.PageNum > PageIndex || (this.RecalcInfo.FlowObjectPage <= 0 && Element.PageNum < PageIndex) || Element.PageNum === PageIndex) {
                            if (true === this.RecalcInfo.FlowObjectPageBreakBefore) {
                                Element.Set_DocumentIndex(Index);
                                Element.Reset(X, Page_Height, XLimit, Page_Height, PageIndex);
                                Element.Recalculate_Page(PageIndex);
                                this.RecalcInfo.FlowObjectPage++;
                                RecalcResult = recalcresult_NextPage;
                            } else {
                                if ((0 === Index && 0 === PageIndex) || Index != StartIndex) {
                                    Element.Set_DocumentIndex(Index);
                                    Element.Reset(X, Y, XLimit, YLimit, PageIndex);
                                }
                                RecalcResult = Element.Recalculate_Page(PageIndex);
                                if (((0 === Index && 0 === PageIndex) || Index != StartIndex) && true != Element.Is_ContentOnFirstPage()) {
                                    this.DrawingObjects.removeFloatTableById(PageIndex, Element.Get_Id());
                                    this.RecalcInfo.FlowObjectPageBreakBefore = true;
                                    RecalcResult = recalcresult_CurPage;
                                } else {
                                    this.RecalcInfo.FlowObjectPage++;
                                    if (recalcresult_NextElement === RecalcResult) {
                                        this.RecalcInfo.FlowObject = null;
                                        this.RecalcInfo.FlowObjectPageBreakBefore = false;
                                        this.RecalcInfo.FlowObjectPage = 0;
                                        this.RecalcInfo.RecalcResult = recalcresult_NextElement;
                                    }
                                }
                            }
                        } else {
                            RecalcResult = Element.Recalculate_Page(PageIndex);
                            this.DrawingObjects.addFloatTable(new CFlowTable2(Element, PageIndex));
                            if (recalcresult_NextElement === RecalcResult) {
                                this.RecalcInfo.FlowObject = null;
                                this.RecalcInfo.FlowObjectPageBreakBefore = false;
                                this.RecalcInfo.RecalcResult = recalcresult_NextElement;
                            }
                        }
                    } else {
                        RecalcResult = recalcresult_NextElement;
                    }
                }
            } else {
                if ((0 === Index && 0 === PageIndex) || Index != StartIndex) {
                    Element.Set_DocumentIndex(Index);
                    Element.Reset(X, Y, XLimit, YLimit, PageIndex);
                }
                RecalcResult = Element.Recalculate_Page(PageIndex);
            }
            Element.TurnOn_RecalcEvent();
            if (true != bFlowTable) {
                var Bounds = Element.Get_PageBounds(PageIndex - Element.Get_StartPage_Relative());
                Y = Bounds.Bottom;
            }
            if (recalcresult_CurPage === RecalcResult) {
                return this.Recalculate_Page(PageIndex, false);
            } else {
                if (recalcresult_NextElement === RecalcResult) {} else {
                    if (recalcresult_NextPage === RecalcResult) {
                        this.Pages[PageIndex].EndPos = Index;
                        Result = recalcresult2_NextPage;
                        break;
                    }
                }
            }
        }
        this.Pages[PageIndex].Bounds.Left = X;
        this.Pages[PageIndex].Bounds.Top = StartY;
        this.Pages[PageIndex].Bounds.Right = XLimit;
        this.Pages[PageIndex].Bounds.Bottom = Y;
        if (Index >= Count) {
            this.Pages[PageIndex].EndPos = Count - 1;
            if (undefined != this.Parent.OnEndRecalculate_Page) {
                this.Parent.OnEndRecalculate_Page(true);
            }
        } else {
            if (undefined != this.Parent.OnEndRecalculate_Page) {
                this.Parent.OnEndRecalculate_Page(false);
            }
        }
        return Result;
    },
    Recalculate_MinMaxContentWidth: function () {
        var Min = 0;
        var Max = 0;
        var Count = this.Content.length;
        for (var Pos = 0; Pos < Count; Pos++) {
            var Element = this.Content[Pos];
            var CurMinMax = Element.Recalculate_MinMaxContentWidth();
            if (Min < CurMinMax.Min) {
                Min = CurMinMax.Min;
            }
            if (Max < CurMinMax.Max) {
                Max = CurMinMax.Max;
            }
        }
        return {
            Min: Min,
            Max: Max
        };
    },
    Recalculate_AllTables: function () {
        var Count = this.Content.length;
        for (var Pos = 0; Pos < Count; Pos++) {
            var Item = this.Content[Pos];
            if (type_Table === Item.GetType()) {
                Item.Recalculate_AllTables();
            }
        }
    },
    ReDraw: function (StartPage, EndPage) {
        if ("undefined" === typeof(StartPage)) {
            StartPage = this.Get_StartPage_Absolute();
        }
        if ("undefined" === typeof(EndPage)) {
            EndPage = StartPage + this.Pages.length - 1;
        }
        this.Parent.OnContentReDraw(StartPage, EndPage);
    },
    OnContentRecalculate: function (bNeedRecalc, PageNum, DocumentIndex) {
        if (false === bNeedRecalc) {
            this.Parent.OnContentRecalculate(false, false);
        } else {
            this.Recalculate(false, DocumentIndex + 1);
        }
    },
    OnContentReDraw: function (StartPage, EndPage) {
        this.Parent.OnContentReDraw(StartPage, EndPage);
    },
    Draw: function (nPageIndex, pGraphics) {
        var PageNum = nPageIndex - this.StartPage;
        if (PageNum < 0 || PageNum >= this.Pages.length) {
            return;
        }
        var Bounds = this.Pages[PageNum].Bounds;
        var bClip = false;
        if (null != this.ClipInfo.X0 && null != this.ClipInfo.X1) {
            pGraphics.SaveGrState();
            pGraphics.AddClipRect(this.ClipInfo.X0, Bounds.Top, Math.abs(this.ClipInfo.X1 - this.ClipInfo.X0), Bounds.Bottom - Bounds.Top);
            bClip = true;
        }
        var Page_StartPos = this.Pages[PageNum].Pos;
        var Page_EndPos = this.Pages[PageNum].EndPos;
        for (var Index = Page_StartPos; Index <= Page_EndPos; Index++) {
            this.Content[Index].Draw(PageNum, pGraphics);
        }
        if (true === bClip) {
            pGraphics.RestoreGrState();
        }
    },
    Get_AllDrawingObjects: function (DrawingObjs) {
        if (undefined === DrawingObjs) {
            DrawingObjs = new Array();
        }
        var Count = this.Content.length;
        for (var Pos = 0; Pos < Count; Pos++) {
            var Item = this.Content[Pos];
            Item.Get_AllDrawingObjects(DrawingObjs);
        }
        return DrawingObjs;
    },
    Shift: function (PageIndex, Dx, Dy) {
        this.Pages[PageIndex].Shift(Dx, Dy);
        if (null != this.ClipInfo.X0) {
            this.ClipInfo.X0 += Dx;
        }
        if (null != this.ClipInfo.X1) {
            this.ClipInfo.X1 += Dx;
        }
        var StartPos = this.Pages[PageIndex].Pos;
        var EndPos = this.Pages[PageIndex].EndPos;
        for (var Index = StartPos; Index <= EndPos; Index++) {
            var Element = this.Content[Index];
            var ElementPageIndex = 0;
            if (StartPos === Index) {
                ElementPageIndex = PageIndex - Element.Get_StartPage_Relative();
            }
            Element.Shift(ElementPageIndex, Dx, Dy);
        }
    },
    RecalculateCurPos: function () {
        if (docpostype_Content === this.CurPos.Type) {
            if (this.CurPos.ContentPos >= 0 && undefined != this.Content[this.CurPos.ContentPos]) {
                this.Internal_CheckCurPage();
                if (this.CurPage > 0 && true === this.Parent.Is_HdrFtr(false)) {
                    this.CurPage = 0;
                    this.DrawingDocument.TargetEnd();
                } else {
                    this.Content[this.CurPos.ContentPos].RecalculateCurPos();
                }
            }
        } else {
            this.LogicDocument.DrawingObjects.recalculateCurPos();
        }
    },
    Get_PageBounds: function (PageNum) {
        if (this.Pages.length <= 0) {
            return {
                Top: 0,
                Left: 0,
                Right: 0,
                Bottom: 0
            };
        }
        if (PageNum < 0 || PageNum > this.Pages.length) {
            return this.Pages[0].Bounds;
        }
        var Bounds = this.Pages[PageNum].Bounds;
        if (true != this.Is_HdrFtr(false)) {
            var AllDrawingObjects = this.Get_AllDrawingObjects();
            var Count = AllDrawingObjects.length;
            for (var Index = 0; Index < Count; Index++) {
                var Obj = AllDrawingObjects[Index];
                if (true === Obj.Use_TextWrap() && Obj.Y + Obj.H > Bounds.Bottom) {
                    Bounds.Bottom = Obj.Y + Obj.H;
                }
            }
            var Count = this.Content.length;
            for (var Index = 0; Index < Count; Index++) {
                var Element = this.Content[Index];
                if (type_Table === Element.GetType() && true != Element.Is_Inline()) {
                    var TableBounds = Element.Get_PageBounds(PageNum - Element.PageNum);
                    if (TableBounds.Bottom > Bounds.Bottom) {
                        Bounds.Bottom = TableBounds.Bottom;
                    }
                }
            }
        }
        return Bounds;
    },
    Get_PagesCount: function () {
        return this.Pages.length;
    },
    Get_SummaryHeight: function () {
        var Height = 0;
        for (var Page = 0; Page < this.Get_PagesCount(); Page++) {
            var Bounds = this.Get_PageBounds(Page);
            Height += Bounds.Bottom - Bounds.Top;
        }
        return Height;
    },
    Get_FirstParagraph: function () {
        if (type_Paragraph == this.Content[0].GetType()) {
            return this.Content[0];
        } else {
            if (type_Table == this.Content[0].GetType()) {
                return this.Content[0].Get_FirstParagraph();
            }
        }
        return null;
    },
    Get_AllParagraphs_ByNumbering: function (NumPr, ParaArray) {
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            var Element = this.Content[Index];
            Element.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
        }
    },
    HdrFtr_AddPageNum: function (Align, StyleId) {
        this.Selection_Remove();
        this.CurPos = {
            X: 0,
            Y: 0,
            ContentPos: 0,
            RealX: 0,
            RealY: 0,
            Type: docpostype_Content
        };
        this.Selection.Use = false;
        this.Internal_Content_RemoveAll();
        var Para1 = new Paragraph(this.DrawingDocument, this, 0, this.X, this.Y, this.XLimit, this.YLimit);
        var Para2 = new Paragraph(this.DrawingDocument, this, 0, this.X, this.Y, this.XLimit, this.YLimit);
        this.Internal_Content_Add(0, Para1);
        this.Internal_Content_Add(1, Para2);
        Para1.Set_DocumentPrev(null);
        Para1.Set_DocumentNext(Para2);
        Para2.Set_DocumentPrev(Para1);
        Para2.Set_DocumentNext(null);
        Para1.Style_Add(StyleId);
        Para2.Style_Add(StyleId);
        Para1.Set_Align(Align, false);
        Para1.Add(new ParaPageNum());
        this.Recalculate();
    },
    Clear_Content: function () {
        this.Selection_Remove();
        this.CurPos = {
            X: 0,
            Y: 0,
            ContentPos: 0,
            RealX: 0,
            RealY: 0,
            Type: docpostype_Content
        };
        this.Selection.Use = false;
        this.Internal_Content_RemoveAll();
        var Para = new Paragraph(this.DrawingDocument, this, 0, this.X, this.Y, this.XLimit, this.YLimit);
        this.Internal_Content_Add(0, Para);
    },
    Add_Content: function (OtherContent) {
        if ("object" != typeof(OtherContent) || 0 >= OtherContent.Content.length || true === OtherContent.Is_Empty()) {
            return;
        }
        if (true === this.Is_Empty()) {
            this.Internal_Content_RemoveAll();
            for (var Index = 0; Index < OtherContent.Content.length; Index++) {
                this.Internal_Content_Add(Index, OtherContent.Content[Index]);
            }
        } else {
            this.Content[this.Content.length - 1].Set_DocumentNext(OtherContent.Content[0]);
            OtherContent.Content[0].Set_DocumentPrev(this.Content[this.Content.length - 1]);
            for (var Index = 0; Index < OtherContent.Content.length; Index++) {
                this.Internal_Content_Add(this.Content.length, OtherContent.Content[Index]);
            }
        }
    },
    Is_Empty: function () {
        if (this.Content.length > 1 || type_Table === this.Content[0].GetType()) {
            return false;
        }
        return this.Content[0].IsEmpty();
    },
    Is_CurrentElementTable: function () {
        if (docpostype_DrawingObjects == this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.isCurrentElementTable();
        } else {
            if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
                return true;
            }
        }
        return false;
    },
    Is_CurrentElementParagraph: function () {
        if (docpostype_DrawingObjects == this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.isCurrentElementParagraph();
        } else {
            if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
                return false;
            }
        }
        return true;
    },
    Get_CurrentParagraph: function () {
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.getCurrentParagraph();
        } else {
            if (true === this.Selection.Use) {
                return null;
            }
            if (this.CurPos.ContentPos < 0) {
                return null;
            }
            var Item = this.Content[this.CurPos.ContentPos];
            if (type_Paragraph === Item.GetType()) {
                return Item;
            } else {
                if (type_Table === Item.GetType()) {
                    return Item.Get_CurrentParagraph();
                }
            }
        }
        return null;
    },
    Is_ContentOnFirstPage: function () {
        var Element = this.Content[0];
        return Element.Is_ContentOnFirstPage();
    },
    Start_FromNewPage: function () {
        this.Pages.length = 1;
        this.Pages[0] = new CDocumentPage();
        var Element = this.Content[0];
        Element.Start_FromNewPage();
    },
    Is_TableBorder: function (X, Y, PageNum_Abs) {
        var TempPNum = PageNum_Abs - this.Get_StartPage_Absolute();
        if (TempPNum < 0 || TempPNum >= this.Pages.length) {
            TempPNum = 0;
        }
        var ContentPos = this.Internal_GetContentPosByXY(X, Y, TempPNum);
        var Item = this.Content[ContentPos];
        if (type_Table == Item.GetType()) {
            return Item.Is_TableBorder(X, Y, PageNum_Abs);
        }
        return null;
    },
    Is_InText: function (X, Y, PageNum_Abs) {
        var TempPNum = PageNum_Abs - this.Get_StartPage_Absolute();
        if (TempPNum < 0 || TempPNum >= this.Pages.length) {
            TempPNum = 0;
        }
        var ContentPos = this.Internal_GetContentPosByXY(X, Y, TempPNum);
        var Item = this.Content[ContentPos];
        return Item.Is_InText(X, Y, PageNum_Abs);
    },
    Is_InDrawing: function (X, Y, Page_Abs) {
        if (-1 != this.DrawingObjects.isPointInDrawingObjects(X, Y, Page_Abs, this)) {
            return true;
        } else {
            var TempPNum = Page_Abs - this.Get_StartPage_Absolute();
            if (TempPNum < 0 || TempPNum >= this.Pages.length) {
                TempPNum = 0;
            }
            var ContentPos = this.Internal_GetContentPosByXY(X, Y, TempPNum);
            var Item = this.Content[ContentPos];
            if (type_Table == Item.GetType()) {
                return Item.Is_InDrawing(X, Y, Page_Abs);
            }
            return false;
        }
    },
    Get_CurrentPage_Absolute: function () {
        if (docpostype_DrawingObjects == this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.getCurrentPageAbsolute();
        } else {
            if (this.CurPos.ContentPos >= 0) {
                return this.Content[this.CurPos.ContentPos].Get_CurrentPage_Absolute();
            }
        }
    },
    DocumentSearch: function (Str, Type) {
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            var Element = this.Content[Index];
            Element.DocumentSearch(Str, Type);
        }
    },
    DocumentStatistics: function (Stats) {
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            var Element = this.Content[Index];
            Element.DocumentStatistics(Stats);
        }
    },
    Document_CreateFontMap: function (FontMap) {
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            var Element = this.Content[Index];
            Element.Document_CreateFontMap(FontMap);
        }
    },
    Document_CreateFontCharMap: function (FontCharMap) {
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            var Element = this.Content[Index];
            Element.Document_CreateFontCharMap(FontCharMap);
        }
    },
    Document_Get_AllFontNames: function (AllFonts) {
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            var Element = this.Content[Index];
            Element.Document_Get_AllFontNames(AllFonts);
        }
    },
    Document_UpdateInterfaceState: function () {
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            var drawin_objects = this.LogicDocument.DrawingObjects;
            if (drawin_objects.curState.id === STATES_ID_TEXT_ADD || drawin_objects.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
                this.LogicDocument.Interface_Update_DrawingPr();
                drawin_objects.documentUpdateInterfaceState();
            } else {
                drawin_objects.documentUpdateInterfaceState();
                this.LogicDocument.Interface_Update_DrawingPr();
            }
            return;
        } else {
            if ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType())) {
                this.Interface_Update_TablePr();
                if (true == this.Selection.Use) {
                    this.Content[this.Selection.StartPos].Document_UpdateInterfaceState();
                } else {
                    this.Content[this.CurPos.ContentPos].Document_UpdateInterfaceState();
                }
            } else {
                this.Interface_Update_ParaPr();
                this.Interface_Update_TextPr();
                if ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Paragraph == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Paragraph == this.Content[this.CurPos.ContentPos].GetType())) {
                    if (true == this.Selection.Use) {
                        this.Content[this.Selection.StartPos].Document_UpdateInterfaceState();
                    } else {
                        this.Content[this.CurPos.ContentPos].Document_UpdateInterfaceState();
                    }
                }
            }
        }
    },
    Document_UpdateRulersState: function (CurPage) {
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            this.DrawingDocument.Set_RulerState_Paragraph(null);
            this.LogicDocument.DrawingObjects.documentUpdateRulersState(CurPage);
        } else {
            if (true === this.Selection.Use) {
                if (this.Selection.StartPos == this.Selection.EndPos && type_Table === this.Content[this.Selection.StartPos].GetType()) {
                    this.Content[this.Selection.StartPos].Document_UpdateRulersState(CurPage);
                }
            } else {
                var Item = this.Content[this.CurPos.ContentPos];
                if (type_Table === Item.GetType()) {
                    Item.Document_UpdateRulersState(CurPage);
                }
            }
        }
    },
    Cursor_MoveToStartPos: function () {
        this.Selection.Start = false;
        this.Selection.Use = false;
        this.Selection.StartPos = 0;
        this.Selection.EndPos = 0;
        this.Selection.Flag = selectionflag_Common;
        this.CurPos.ContentPos = 0;
        this.CurPos.Type = docpostype_Content;
        this.Content[0].Cursor_MoveToStartPos();
    },
    Cursor_MoveToEndPos: function () {
        this.Selection.Start = false;
        this.Selection.Use = false;
        this.Selection.StartPos = 0;
        this.Selection.EndPos = 0;
        this.Selection.Flag = selectionflag_Common;
        this.CurPos.ContentPos = this.Content.length - 1;
        this.CurPos.Type = docpostype_Content;
        this.Content[this.CurPos.ContentPos].Cursor_MoveToEndPos();
    },
    Cursor_MoveUp_To_LastRow: function (X, Y, AddToSelect) {
        if (true === AddToSelect) {
            return;
        }
        this.Set_CurPosXY(X, Y);
        this.CurPos.ContentPos = this.Content.length - 1;
        this.Content[this.CurPos.ContentPos].Cursor_MoveUp_To_LastRow(X, Y, false);
    },
    Cursor_MoveDown_To_FirstRow: function (X, Y, AddToSelect) {
        if (true === AddToSelect) {
            return;
        }
        this.Set_CurPosXY(X, Y);
        this.CurPos.ContentPos = 0;
        this.Content[this.CurPos.ContentPos].Cursor_MoveDown_To_FirstRow(X, Y, false);
    },
    Cursor_MoveToCell: function (bNext) {
        if (true === this.ApplyToAll) {
            if (1 === this.Content.length && type_Table === this.Content[0].GetType()) {
                this.Content[0].Cursor_MoveToCell(bNext);
            }
        } else {
            if (docpostype_DrawingObjects == this.CurPos.Type) {
                this.LogicDocument.DrawingObjects.cursorMoveToCell(bNext);
            } else {
                if (true === this.Selection.Use) {
                    if (this.Selection.StartPos === this.Selection.EndPos && type_Table === this.Content[this.Selection.StartPos].GetType()) {
                        this.Content[this.Selection.StartPos].Cursor_MoveToCell(bNext);
                    }
                } else {
                    if (type_Table === this.Content[this.CurPos.ContentPos].GetType()) {
                        this.Content[this.CurPos.ContentPos].Cursor_MoveToCell(bNext);
                    }
                }
            }
        }
    },
    Set_ClipInfo: function (X0, X1) {
        this.ClipInfo.X0 = X0;
        this.ClipInfo.X1 = X1;
    },
    Set_ApplyToAll: function (bValue) {
        this.ApplyToAll = bValue;
    },
    Get_ApplyToAll: function () {
        return this.ApplyToAll;
    },
    Update_CursorType: function (X, Y, PageNum_Abs) {
        var PageNum = PageNum_Abs - this.Get_StartPage_Absolute();
        if (PageNum < 0 || PageNum >= this.Pages.length) {
            return this.DrawingDocument.SetCursorType("default", new CMouseMoveData());
        }
        var bInText = (null === this.Is_InText(X, Y, PageNum_Abs) ? false : true);
        var bTableBorder = (null === this.Is_TableBorder(X, Y, PageNum_Abs) ? false : true);
        if (this.Parent instanceof CHeaderFooter && true === this.LogicDocument.DrawingObjects.updateCursorType(PageNum_Abs, X, Y, MouseEvent, (true === bInText || true === bTableBorder ? true : false))) {
            return;
        }
        var ContentPos = this.Internal_GetContentPosByXY(X, Y, PageNum);
        var Item = this.Content[ContentPos];
        Item.Update_CursorType(X, Y, PageNum);
    },
    Add_NewParagraph: function () {
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.DrawingObjects.addNewParagraph();
        } else {
            if (this.CurPos.ContentPos < 0) {
                return false;
            }
            if (true === this.Selection.Use) {
                this.Remove(1, true);
            }
            var Item = this.Content[this.CurPos.ContentPos];
            if (type_Paragraph == Item.GetType()) {
                if (undefined != Item.Numbering_Get() && true === Item.IsEmpty()) {
                    Item.Numbering_Remove();
                    Item.Set_Ind({
                        FirstLine: undefined,
                        Left: undefined,
                        Right: Item.Pr.Ind.Right
                    },
                    true);
                } else {
                    var NewParagraph = new Paragraph(this.DrawingDocument, this, 0, 0, 0, X_Left_Field, Y_Bottom_Field);
                    if (true === Item.Cursor_IsEnd()) {
                        var StyleId = Item.Style_Get();
                        var NextId = undefined;
                        if (undefined != StyleId) {
                            var Styles = this.Parent.Get_Styles();
                            NextId = Styles.Get_Next(StyleId);
                            if (null === NextId) {
                                NextId = StyleId;
                            }
                        }
                        if (StyleId === NextId) {
                            Item.Continue(NewParagraph);
                        } else {
                            if (NextId === this.Get_Styles().Get_Default_Paragraph()) {
                                NewParagraph.Style_Remove();
                            } else {
                                NewParagraph.Style_Add_Open(NextId);
                            }
                        }
                    } else {
                        Item.Split(NewParagraph);
                    }
                    this.Internal_Content_Add(this.CurPos.ContentPos + 1, NewParagraph);
                    this.CurPos.ContentPos++;
                    this.ContentLastChangePos = this.CurPos.ContentPos - 1;
                }
                this.Recalculate();
            } else {
                if (type_Table == Item.GetType()) {
                    if (0 === this.CurPos.ContentPos && Item.Cursor_IsStart(true)) {
                        var NewParagraph = new Paragraph(this.DrawingDocument, this, 0, 0, 0, X_Left_Field, Y_Bottom_Field);
                        this.Internal_Content_Add(0, NewParagraph);
                        this.CurPos.ContentPos = 0;
                        this.Recalculate();
                    } else {
                        Item.Add_NewParagraph();
                    }
                }
            }
        }
    },
    Extend_ToPos: function (X, Y) {
        var LastPara = this.Content[this.Content.length - 1];
        var LastPara2 = LastPara;
        History.Create_NewPoint();
        History.Set_Additional_ExtendDocumentToPos();
        while (true) {
            var NewParagraph = new Paragraph(this.DrawingDocument, this, 0, 0, 0, X_Left_Field, Y_Bottom_Field);
            var StyleId = LastPara.Style_Get();
            var NextId = undefined;
            if (undefined != StyleId) {
                NextId = this.Styles.Get_Next(StyleId);
                if (null === NextId || undefined === NextId) {
                    NextId = StyleId;
                }
            }
            if (NextId === this.Styles.Get_Default_Paragraph()) {
                NewParagraph.Style_Remove();
            } else {
                NewParagraph.Style_Add_Open(NextId);
            }
            if (undefined != LastPara.TextPr.Value.FontSize) {
                NewParagraph.TextPr.Set_FontSize(LastPara.TextPr.Value.FontSize);
                NewParagraph.Internal_Content_Add(0, new ParaTextPr({
                    FontSize: LastPara.TextPr.Value.FontSize,
                    FontSizeCS: LastPara.TextPr.Value.FontSize
                }));
            }
            LastPara.Set_DocumentNext(NewParagraph);
            NewParagraph.Set_DocumentPrev(LastPara);
            NewParagraph.Set_DocumentIndex(LastPara.Index + 1);
            var CurPage = LastPara.Pages.length - 1;
            var X0 = LastPara.Pages[CurPage].X;
            var Y0 = LastPara.Pages[CurPage].Bounds.Bottom;
            var XLimit = LastPara.Pages[CurPage].XLimit;
            var YLimit = LastPara.Pages[CurPage].YLimit;
            var PageNum = LastPara.PageNum;
            NewParagraph.Reset(X0, Y0, XLimit, YLimit, PageNum);
            var RecalcResult = NewParagraph.Recalculate_Page(PageNum);
            if (recalcresult_NextElement != RecalcResult) {
                LastPara.Next = null;
                break;
            }
            this.Internal_Content_Add(this.Content.length, NewParagraph);
            if (NewParagraph.Pages[0].Bounds.Bottom > Y) {
                break;
            }
            LastPara = NewParagraph;
        }
        LastPara = this.Content[this.Content.length - 1];
        if (LastPara != LastPara2 || false === this.LogicDocument.Document_Is_SelectionLocked(changestype_None, {
            Type: changestype_2_Element_and_Type,
            Element: LastPara,
            CheckType: changestype_Paragraph_Content
        })) {
            LastPara.Extend_ToPos(X);
        }
        LastPara.Cursor_MoveToEndPos();
        LastPara.Document_SetThisElementCurrent();
        this.LogicDocument.Recalculate();
    },
    Add_InlineImage: function (W, H, Img, Chart, bFlow) {
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.DrawingObjects.addInlineImage(W, H, Img, Chart, bFlow);
        } else {
            if (true == this.Selection.Use) {
                this.Remove(1, true);
            }
            var Item = this.Content[this.CurPos.ContentPos];
            if (type_Paragraph == Item.GetType()) {
                var Drawing;
                if (!isRealObject(Chart)) {
                    var Drawing = new ParaDrawing(W, H, null, this.DrawingDocument, this);
                    var Image = new WordImage(Drawing, this, this.DrawingDocument, null);
                    Drawing.Set_GraphicObject(Image);
                    Image.init(Img, W, H, Chart);
                } else {
                    Drawing = Chart;
                }
                if (true === bFlow) {
                    Drawing.Set_DrawingType(drawing_Anchor);
                    Drawing.Set_WrappingType(WRAPPING_TYPE_SQUARE);
                    Drawing.Set_BehindDoc(false);
                    Drawing.Set_Distance(3.2, 0, 3.2, 0);
                    Drawing.Set_PositionH(c_oAscRelativeFromH.Column, false, 0);
                    Drawing.Set_PositionV(c_oAscRelativeFromV.Paragraph, false, 0);
                }
                this.Paragraph_Add(Drawing);
                this.Select_DrawingObject(Drawing.Get_Id());
            } else {
                if (type_Table == Item.GetType()) {
                    Item.Add_InlineImage(W, H, Img, Chart, bFlow);
                }
            }
        }
    },
    Edit_Chart: function (Chart) {
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.editChart(Chart);
        }
    },
    Add_InlineTable: function (Cols, Rows) {
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.addInlineTable(Cols, Rows);
        } else {
            if (this.CurPos.ContentPos < 0) {
                return false;
            }
            if (true == this.Selection.Use) {
                this.Remove(1, true);
            }
            var Item = this.Content[this.CurPos.ContentPos];
            switch (Item.GetType()) {
            case type_Paragraph:
                var W = 0;
                if (true === this.Is_TableCellContent()) {
                    W = this.XLimit - this.X;
                } else {
                    W = (this.XLimit - this.X + 2 * 1.9);
                }
                W = Math.max(W, Cols * 2 * 1.9);
                var Grid = [];
                for (var Index = 0; Index < Cols; Index++) {
                    Grid[Index] = W / Cols;
                }
                var NewTable = new CTable(this.DrawingDocument, this, true, 0, 0, 0, this.X, this.YLimit, Rows, Cols, Grid);
                if (true === Item.Cursor_IsEnd()) {
                    NewTable.Cursor_MoveToStartPos();
                    this.Internal_Content_Add(this.CurPos.ContentPos + 1, NewTable);
                    this.CurPos.ContentPos++;
                    this.Recalculate();
                } else {
                    var NewParagraph = new Paragraph(this.DrawingDocument, this, 0, 0, 0, X_Left_Field, Y_Bottom_Field);
                    Item.Split(NewParagraph);
                    this.Internal_Content_Add(this.CurPos.ContentPos + 1, NewParagraph);
                    NewTable.Cursor_MoveToStartPos();
                    this.Internal_Content_Add(this.CurPos.ContentPos + 1, NewTable);
                    this.CurPos.ContentPos++;
                    this.Recalculate();
                }
                break;
            case type_Table:
                Item.Add_InlineTable(Cols, Rows);
                break;
            }
        }
    },
    Paragraph_Add: function (ParaItem, bRecalculate) {
        if (true === this.ApplyToAll) {
            if (para_TextPr === ParaItem.Type) {
                for (var Index = 0; Index < this.Content.length; Index++) {
                    var Item = this.Content[Index];
                    Item.Set_ApplyToAll(true);
                    Item.Add(ParaItem);
                    Item.Set_ApplyToAll(false);
                }
            }
            return;
        }
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.paragraphAdd(ParaItem, bRecalculate);
        } else {
            if (true === this.Selection.Use) {
                var Type = ParaItem.Type;
                switch (Type) {
                case para_NewLine:
                    case para_Text:
                    case para_Space:
                    this.Remove(1, true);
                    break;
                case para_TextPr:
                    switch (this.Selection.Flag) {
                    case selectionflag_Common:
                        var StartPos = this.Selection.StartPos;
                        var EndPos = this.Selection.EndPos;
                        if (EndPos < StartPos) {
                            var Temp = StartPos;
                            StartPos = EndPos;
                            EndPos = Temp;
                        }
                        for (var Index = StartPos; Index <= EndPos; Index++) {
                            this.Content[Index].Add(ParaItem.Copy());
                        }
                        if (false != bRecalculate) {
                            if (true === ParaItem.Value.Check_NeedRecalc()) {
                                this.ContentLastChangePos = StartPos;
                                this.Recalculate();
                            } else {
                                var StartPage = this.Content[StartPos].Get_StartPage_Absolute();
                                var EndPage = this.Content[EndPos].Get_StartPage_Absolute() + this.Content[EndPos].Pages.length - 1;
                                this.ReDraw(StartPage, EndPage);
                            }
                        }
                        break;
                    case selectionflag_Numbering:
                        if (null == this.Selection.Data || this.Selection.Data.length <= 0) {
                            break;
                        }
                        if (undefined != ParaItem.Value.FontFamily) {
                            var FName = ParaItem.Value.FontFamily.Name;
                            var FIndex = ParaItem.Value.FontFamily.Index;
                            ParaItem.Value.RFonts = new CRFonts();
                            ParaItem.Value.RFonts.Ascii = {
                                Name: FName,
                                Index: FIndex
                            };
                            ParaItem.Value.RFonts.EastAsia = {
                                Name: FName,
                                Index: FIndex
                            };
                            ParaItem.Value.RFonts.HAnsi = {
                                Name: FName,
                                Index: FIndex
                            };
                            ParaItem.Value.RFonts.CS = {
                                Name: FName,
                                Index: FIndex
                            };
                        }
                        var NumPr = this.Content[this.Selection.Data[0]].Numbering_Get();
                        var AbstrNum = this.Numbering.Get_AbstractNum(NumPr.NumId);
                        AbstrNum.Apply_TextPr(NumPr.Lvl, ParaItem.Value);
                        if (false != bRecalculate) {
                            this.ContentLastChangePos = this.Selection.Data[0];
                            this.Recalculate();
                        }
                        break;
                    }
                    return;
                }
            }
            var Item = this.Content[this.CurPos.ContentPos];
            var ItemType = Item.GetType();
            if (para_NewLine === ParaItem.Type && break_Page === ParaItem.BreakType) {
                if (type_Paragraph === ItemType) {
                    if (true === Item.Cursor_IsStart()) {
                        this.Add_NewParagraph();
                        this.Content[this.CurPos.ContentPos - 1].Add(ParaItem);
                        this.Content[this.CurPos.ContentPos - 1].Clear_Formatting();
                        this.ContentLastChangePos = this.CurPos.ContentPos - 1;
                    } else {
                        this.Add_NewParagraph();
                        this.Add_NewParagraph();
                        this.Content[this.CurPos.ContentPos - 1].Add(ParaItem);
                        this.Content[this.CurPos.ContentPos - 1].Clear_Formatting();
                        this.ContentLastChangePos = this.CurPos.ContentPos - 2;
                    }
                    if (false != bRecalculate) {
                        this.Recalculate();
                        Item.CurPos.RealX = Item.CurPos.X;
                        Item.CurPos.RealY = Item.CurPos.Y;
                    }
                } else {
                    return;
                }
            } else {
                Item.Add(ParaItem);
                if (false != bRecalculate) {
                    if (para_TextPr === ParaItem.Type && false === ParaItem.Value.Check_NeedRecalc()) {
                        var StartPage = Item.Get_StartPage_Absolute();
                        var EndPage = StartPage + Item.Pages.length - 1;
                        this.ReDraw(StartPage, EndPage);
                    } else {
                        this.Recalculate();
                    }
                    if (type_Paragraph === ItemType) {
                        Item.CurPos.RealX = Item.CurPos.X;
                        Item.CurPos.RealY = Item.CurPos.Y;
                    }
                }
            }
        }
    },
    Paragraph_ClearFormatting: function () {
        if (true === this.ApplyToAll) {
            for (var Index = 0; Index < this.Content.length; Index++) {
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                if (type_Table === Item.GetType()) {
                    Item.Paragraph_ClearFormatting();
                } else {
                    if (type_Paragraph === Item.GetType()) {
                        Item.Clear_Formatting();
                        Item.Clear_TextFormatting();
                    }
                }
                Item.Set_ApplyToAll(false);
            }
            return;
        }
        if (docpostype_DrawingObjects == this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.paragraphClearFormatting();
        } else {
            if (true === this.Selection.Use) {
                if (selectionflag_Common === this.Selection.Flag) {
                    var StartPos = this.Selection.StartPos;
                    var EndPos = this.Selection.EndPos;
                    if (StartPos > EndPos) {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos = Temp;
                    }
                    for (var Index = StartPos; Index <= EndPos; Index++) {
                        var Item = this.Content[Index];
                        if (type_Table === Item.GetType()) {
                            Item.Paragraph_ClearFormatting();
                        } else {
                            if (type_Paragraph === Item.GetType()) {
                                Item.Clear_Formatting();
                                Item.Clear_TextFormatting();
                            }
                        }
                    }
                    this.Recalculate();
                }
            } else {
                var Item = this.Content[this.CurPos.ContentPos];
                if (type_Table === Item.GetType()) {
                    Item.Paragraph_ClearFormatting();
                } else {
                    if (type_Paragraph === Item.GetType()) {
                        Item.Clear_Formatting();
                        Item.Clear_TextFormatting();
                        this.Recalculate();
                    }
                }
            }
        }
    },
    Remove: function (Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd) {
        if (true === this.ApplyToAll) {
            this.Internal_Content_RemoveAll();
            this.Internal_Content_Add(0, new Paragraph(this.DrawingDocument, this, 0, this.X, this.Y, this.XLimit, this.YLimit));
            this.CurPos = {
                X: 0,
                Y: 0,
                ContentPos: 0,
                RealX: 0,
                RealY: 0,
                Type: docpostype_Content
            };
            this.Selection = {
                Start: false,
                Use: false,
                StartPos: 0,
                EndPos: 0,
                Flag: selectionflag_Common,
                Data: null
            };
            return;
        }
        if (undefined === bRemoveOnlySelection) {
            bRemoveOnlySelection = false;
        }
        if (undefined === bOnTextAdd) {
            bOnTextAdd = false;
        }
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.remove(Count, bOnlyText, bRemoveOnlySelection);
        } else {
            if (this.CurPos.ContentPos < 0) {
                return false;
            }
            this.Remove_NumberingSelection();
            if (true === this.Selection.Use) {
                var StartPos = this.Selection.StartPos;
                var EndPos = this.Selection.EndPos;
                if (EndPos < StartPos) {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos = Temp;
                }
                this.Selection_Clear();
                this.Selection.Use = false;
                if (StartPos != EndPos) {
                    var StartType = this.Content[StartPos].GetType();
                    var EndType = this.Content[EndPos].GetType();
                    var bStartEmpty, bEndEmpty;
                    if (true === bOnTextAdd && type_Table == EndType) {
                        this.CurPos.ContentPos = StartPos;
                        return this.Cursor_MoveLeft(false, false);
                    }
                    if (type_Paragraph == StartType) {
                        this.Content[StartPos].Remove(1, true);
                        bStartEmpty = this.Content[StartPos].IsEmpty();
                    } else {
                        if (type_Table == StartType) {
                            bStartEmpty = !(this.Content[StartPos].Row_Remove2());
                        }
                    }
                    if (type_Paragraph == EndType) {
                        this.Content[EndPos].Remove(1, true);
                        bEndEmpty = this.Content[EndPos].IsEmpty();
                    } else {
                        if (type_Table == EndType) {
                            bEndEmpty = !(this.Content[EndPos].Row_Remove2());
                        }
                    }
                    if (true != bStartEmpty && true != bEndEmpty) {
                        this.Internal_Content_Remove(StartPos + 1, EndPos - StartPos - 1);
                        this.CurPos.ContentPos = StartPos;
                        if (type_Paragraph == StartType && type_Paragraph == EndType) {
                            this.Content[StartPos].CurPos.ContentPos = this.Content[StartPos].Internal_GetEndPos();
                            this.Remove(1, true);
                        } else {
                            this.CurPos.ContentPos = StartPos + 1;
                            this.Content[StartPos + 1].Cursor_MoveToStartPos();
                        }
                    } else {
                        if (true != bStartEmpty) {
                            if (true === bOnTextAdd && type_Table === StartType) {
                                this.Internal_Content_Remove(StartPos + 1, EndPos - StartPos - 1);
                                this.CurPos.ContentPos = StartPos + 1;
                                this.Content[StartPos + 1].Cursor_MoveToStartPos();
                            } else {
                                this.Internal_Content_Remove(StartPos + 1, EndPos - StartPos);
                                if (type_Paragraph == StartType) {
                                    this.CurPos.ContentPos = StartPos;
                                    this.Content[StartPos].CurPos.ContentPos = this.Content[StartPos].Internal_GetEndPos();
                                } else {
                                    if (type_Table == StartType) {
                                        this.CurPos.ContentPos = StartPos + 1;
                                        this.Content[StartPos + 1].Cursor_MoveToStartPos();
                                    }
                                }
                            }
                        } else {
                            if (true != bEndEmpty) {
                                this.Internal_Content_Remove(StartPos, EndPos - StartPos);
                                this.CurPos.ContentPos = StartPos;
                                this.Content[StartPos].Cursor_MoveToStartPos();
                            } else {
                                if (true === bOnTextAdd) {
                                    this.Internal_Content_Remove(StartPos, EndPos - StartPos);
                                    this.CurPos.ContentPos = StartPos;
                                    this.Content[StartPos].Cursor_MoveToStartPos();
                                } else {
                                    if (0 === StartPos && (EndPos - StartPos + 1) >= this.Content.length) {
                                        var NewPara = new Paragraph(this.DrawingDocument, this, 0, 0, 0, this.XLimit, this.YLimit);
                                        this.Internal_Content_Add(0, NewPara);
                                        this.Internal_Content_Remove(1, this.Content.length - 1);
                                    } else {
                                        this.Internal_Content_Remove(StartPos, EndPos - StartPos + 1);
                                    }
                                    if (StartPos >= this.Content.length) {
                                        this.CurPos.ContentPos = this.Content.length - 1;
                                        this.Content[this.CurPos.ContentPos].CurPos.ContentPos = this.Content[this.CurPos.ContentPos].Internal_GetEndPos();
                                    } else {
                                        this.CurPos.ContentPos = StartPos;
                                        this.Content[StartPos].Cursor_MoveToStartPos();
                                    }
                                }
                            }
                        }
                    }
                } else {
                    this.CurPos.ContentPos = StartPos;
                    if (Count < 0 && type_Table === this.Content[StartPos].GetType() && table_Selection_Cell === this.Content[StartPos].Selection.Type && true != bOnTextAdd) {
                        this.Table_RemoveRow();
                    } else {
                        if (false === this.Content[StartPos].Remove(Count, true, bRemoveOnlySelection, bOnTextAdd)) {
                            if (true != bOnTextAdd) {
                                if (true === this.Content[StartPos].IsEmpty() && this.Content.length > 1) {
                                    this.Internal_Content_Remove(StartPos, 1);
                                    if (StartPos >= this.Content.length) {
                                        this.CurPos.ContentPos = this.Content.length - 1;
                                        this.Content[this.CurPos.ContentPos].CurPos.ContentPos = this.Content[this.CurPos.ContentPos].Internal_GetEndPos();
                                    } else {
                                        this.CurPos.ContentPos = StartPos;
                                        this.Content[StartPos].Cursor_MoveToStartPos();
                                    }
                                    this.Recalculate();
                                    return;
                                } else {
                                    if (this.CurPos.ContentPos < this.Content.length - 1 && type_Paragraph == this.Content[this.CurPos.ContentPos + 1]) {
                                        this.Content[StartPos].Concat(this.Content[StartPos + 1]);
                                        this.Internal_Content_Remove(StartPos + 1, 1);
                                    }
                                }
                            }
                        }
                    }
                }
                this.Content[this.CurPos.ContentPos].Selection_Remove();
                this.Recalculate();
            } else {
                if (true === bRemoveOnlySelection || true === bOnTextAdd) {
                    return;
                }
                if (type_Paragraph == this.Content[this.CurPos.ContentPos].GetType()) {
                    var bNumbering = (undefined != this.Content[this.CurPos.ContentPos].Numbering_Get() ? true : false);
                    if (false === this.Content[this.CurPos.ContentPos].Remove(Count, bOnlyText)) {
                        if (Count < 0) {
                            if (this.CurPos.ContentPos > 0 && type_Paragraph == this.Content[this.CurPos.ContentPos - 1].GetType()) {
                                if (true === this.Content[this.CurPos.ContentPos - 1].IsEmpty()) {
                                    this.Internal_Content_Remove(this.CurPos.ContentPos - 1, 1);
                                    this.CurPos.ContentPos--;
                                    this.Content[this.CurPos.ContentPos].Cursor_MoveToStartPos();
                                } else {
                                    var Prev = this.Content[this.CurPos.ContentPos - 1];
                                    var NewPos = Prev.Content.length - 2;
                                    Prev.Concat(this.Content[this.CurPos.ContentPos]);
                                    this.Internal_Content_Remove(this.CurPos.ContentPos, 1);
                                    this.CurPos.ContentPos--;
                                    this.Content[this.CurPos.ContentPos].CurPos.ContentPos = NewPos;
                                }
                            }
                        } else {
                            if (Count > 0) {
                                if (this.CurPos.ContentPos < this.Content.length - 1 && type_Paragraph == this.Content[this.CurPos.ContentPos + 1].GetType()) {
                                    if (true === this.Content[this.CurPos.ContentPos].IsEmpty()) {
                                        this.Internal_Content_Remove(this.CurPos.ContentPos, 1);
                                        this.Content[this.CurPos.ContentPos].Cursor_MoveToStartPos();
                                    } else {
                                        var Cur = this.Content[this.CurPos.ContentPos];
                                        Cur.Concat(this.Content[this.CurPos.ContentPos + 1]);
                                        this.Internal_Content_Remove(this.CurPos.ContentPos + 1, 1);
                                    }
                                } else {
                                    if (true == this.Content[this.CurPos.ContentPos].IsEmpty() && this.CurPos.ContentPos == this.Content.length - 1 && this.CurPos.ContentPos != 0 && type_Table != this.Content[this.CurPos.ContentPos - 1].GetType()) {
                                        this.Internal_Content_Remove(this.CurPos.ContentPos, 1);
                                        this.CurPos.ContentPos--;
                                    }
                                }
                            }
                        }
                        this.ContentLastChangePos = this.CurPos.ContentPos;
                        this.Recalculate();
                    } else {
                        if (true === bNumbering && undefined == this.Content[this.CurPos.ContentPos].Numbering_Get()) {
                            this.ContentLastChangePos = this.CurPos.ContentPos - 1;
                            this.Recalculate();
                        } else {
                            this.ContentLastChangePos = this.CurPos.ContentPos;
                            this.Recalculate();
                        }
                    }
                    var Item = this.Content[this.CurPos.ContentPos];
                    if (type_Paragraph == Item.GetType()) {
                        Item.CurPos.RealX = Item.CurPos.X;
                        Item.CurPos.RealY = Item.CurPos.Y;
                    }
                } else {
                    if (type_Table == this.Content[this.CurPos.ContentPos].GetType()) {
                        this.Content[this.CurPos.ContentPos].Remove(Count, bOnlyText);
                    }
                }
            }
        }
    },
    Cursor_GetPos: function () {
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.cursorGetPos();
        } else {
            if (true === this.Selection.Use) {
                if (selectionflag_Common === this.Selection.Flag) {
                    return this.Content[this.Selection.EndPos].Cursor_GetPos();
                }
                return {
                    X: 0,
                    Y: 0
                };
            } else {
                return this.Content[this.CurPos.ContentPos].Cursor_GetPos();
            }
        }
    },
    Cursor_MoveLeft: function (AddToSelect, Word) {
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.cursorMoveLeft(AddToSelect, Word);
        } else {
            if (this.CurPos.ContentPos < 0) {
                return false;
            }
            var ReturnValue = true;
            this.Remove_NumberingSelection();
            if (true === this.Selection.Use) {
                if (true === AddToSelect) {
                    if (false === this.Content[this.Selection.EndPos].Cursor_MoveLeft(1, true, Word)) {
                        if (0 != this.Selection.EndPos) {
                            this.Selection.EndPos--;
                            this.CurPos.ContentPos = this.Selection.EndPos;
                            var Item = this.Content[this.Selection.EndPos];
                            if (type_Paragraph == Item.GetType()) {
                                if (false === Item.Is_SelectionUse()) {
                                    Item.CurPos.ContentPos = Item.Content.length - 1;
                                    Item.Selection.Use = true;
                                    Item.Selection.StartPos = Item.Content.length - 1;
                                    Item.Selection.EndPos = Item.Content.length - 1;
                                }
                                Item.Cursor_MoveLeft(1, true, Word);
                            } else {
                                if (type_Table == Item.GetType()) {
                                    if (false === Item.Is_SelectionUse()) {
                                        var LastRow = Item.Content[Item.Content.length - 1];
                                        Item.Selection.Use = true;
                                        Item.Selection.Type = table_Selection_Cell;
                                        Item.Selection.StartPos.Pos = {
                                            Row: LastRow.Index,
                                            Cell: LastRow.Get_CellsCount() - 1
                                        };
                                        Item.Selection.EndPos.Pos = {
                                            Row: LastRow.Index,
                                            Cell: 0
                                        };
                                        Item.CurCell = LastRow.Get_Cell(0);
                                        Item.Selection.Data = new Array();
                                        for (var CellIndex = 0; CellIndex < LastRow.Get_CellsCount(); CellIndex++) {
                                            Item.Selection.Data.push({
                                                Cell: CellIndex,
                                                Row: LastRow.Index
                                            });
                                        }
                                    } else {
                                        Item.Cursor_MoveLeft(1, true, Word);
                                    }
                                }
                            }
                        } else {
                            ReturnValue = false;
                        }
                    }
                    if (this.Selection.EndPos != this.Selection.StartPos && false === this.Content[this.Selection.EndPos].Selection.Use) {
                        this.Selection.EndPos--;
                        this.CurPos.ContentPos = this.Selection.EndPos;
                    }
                    if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse()) {
                        this.Selection.Use = false;
                        this.CurPos.ContentPos = this.Selection.EndPos;
                    }
                } else {
                    var Start = this.Selection.StartPos;
                    if (Start > this.Selection.EndPos) {
                        Start = this.Selection.EndPos;
                    }
                    this.CurPos.ContentPos = Start;
                    this.Content[this.CurPos.ContentPos].Cursor_MoveLeft(1, false, Word);
                    this.Selection_Remove();
                }
            } else {
                if (true === AddToSelect) {
                    this.Selection.Use = true;
                    this.Selection.StartPos = this.CurPos.ContentPos;
                    this.Selection.EndPos = this.CurPos.ContentPos;
                    if (false === this.Content[this.CurPos.ContentPos].Cursor_MoveLeft(1, true, Word)) {
                        if (0 != this.CurPos.ContentPos) {
                            this.CurPos.ContentPos--;
                            var Item = this.Content[this.CurPos.ContentPos];
                            this.Selection.EndPos = this.CurPos.ContentPos;
                            if (type_Paragraph == Item.GetType()) {
                                if (false === Item.Is_SelectionUse()) {
                                    Item.CurPos.ContentPos = Item.Content.length - 1;
                                    Item.Selection.Use = true;
                                    Item.Selection.StartPos = Item.Content.length - 1;
                                    Item.Selection.EndPos = Item.Content.length - 1;
                                }
                                Item.Cursor_MoveLeft(1, true, Word);
                            } else {
                                if (type_Table == Item.GetType()) {
                                    if (false === Item.Is_SelectionUse()) {
                                        var LastRow = Item.Content[Item.Content.length - 1];
                                        Item.Selection.Use = true;
                                        Item.Selection.Type = table_Selection_Cell;
                                        Item.Selection.StartPos.Pos = {
                                            Row: LastRow.Index,
                                            Cell: LastRow.Get_CellsCount() - 1
                                        };
                                        Item.Selection.EndPos.Pos = {
                                            Row: LastRow.Index,
                                            Cell: 0
                                        };
                                        Item.CurCell = LastRow.Get_Cell(0);
                                        Item.Selection.Data = new Array();
                                        for (var CellIndex = 0; CellIndex < LastRow.Get_CellsCount(); CellIndex++) {
                                            Item.Selection.Data.push({
                                                Cell: CellIndex,
                                                Row: LastRow.Index
                                            });
                                        }
                                    } else {
                                        Item.Cursor_MoveLeft(1, true, Word);
                                    }
                                }
                            }
                        } else {
                            ReturnValue = false;
                        }
                    }
                    if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse()) {
                        this.Selection.Use = false;
                        this.CurPos.ContentPos = this.Selection.EndPos;
                    }
                } else {
                    if (false === this.Content[this.CurPos.ContentPos].Cursor_MoveLeft(1, false, Word)) {
                        if (0 != this.CurPos.ContentPos) {
                            this.CurPos.ContentPos--;
                            this.Content[this.CurPos.ContentPos].Cursor_MoveToEndPos();
                        } else {
                            ReturnValue = false;
                        }
                    }
                }
            }
            return ReturnValue;
        }
    },
    Cursor_MoveRight: function (AddToSelect, Word) {
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.cursorMoveRight(AddToSelect, Word);
        } else {
            if (this.CurPos.ContentPos < 0) {
                return false;
            }
            var ReturnValue = true;
            this.Remove_NumberingSelection();
            if (true === this.Selection.Use) {
                if (true === AddToSelect) {
                    if (false === this.Content[this.Selection.EndPos].Cursor_MoveRight(1, true, Word)) {
                        if (this.Content.length - 1 != this.Selection.EndPos) {
                            this.Selection.EndPos++;
                            this.CurPos.ContentPos = this.Selection.EndPos;
                            var Item = this.Content[this.Selection.EndPos];
                            if (type_Paragraph === Item.GetType()) {
                                if (false === Item.Is_SelectionUse()) {
                                    var StartPos = Item.Internal_GetStartPos();
                                    Item.CurPos.ContentPos = StartPos;
                                    Item.Selection.Use = true;
                                    Item.Selection.StartPos = StartPos;
                                    Item.Selection.EndPos = StartPos;
                                }
                                Item.Cursor_MoveRight(1, true, Word);
                            } else {
                                if (type_Table === Item.GetType()) {
                                    if (false === Item.Is_SelectionUse()) {
                                        var FirstRow = Item.Content[0];
                                        Item.Selection.Use = true;
                                        Item.Selection.Type = table_Selection_Cell;
                                        Item.Selection.StartPos.Pos = {
                                            Row: 0,
                                            Cell: 0
                                        };
                                        Item.Selection.EndPos.Pos = {
                                            Row: 0,
                                            Cell: FirstRow.Get_CellsCount() - 1
                                        };
                                        Item.CurCell = FirstRow.Get_Cell(FirstRow.Get_CellsCount() - 1);
                                        Item.Selection.Data = new Array();
                                        for (var CellIndex = 0; CellIndex < FirstRow.Get_CellsCount(); CellIndex++) {
                                            Item.Selection.Data.push({
                                                Cell: CellIndex,
                                                Row: 0
                                            });
                                        }
                                    } else {
                                        Item.Cursor_MoveRight(1, true, Word);
                                    }
                                }
                            }
                        } else {
                            ReturnValue = false;
                        }
                    }
                    if (this.Selection.EndPos != this.Selection.StartPos && false === this.Content[this.Selection.EndPos].Is_SelectionUse()) {
                        this.Selection.EndPos++;
                        this.CurPos.ContentPos = this.Selection.EndPos;
                    }
                    if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse()) {
                        this.Selection.Use = false;
                        this.CurPos.ContentPos = this.Selection.EndPos;
                    }
                } else {
                    var End = this.Selection.EndPos;
                    if (End < this.Selection.StartPos) {
                        End = this.Selection.StartPos;
                    }
                    this.CurPos.ContentPos = End;
                    this.Content[this.CurPos.ContentPos].Cursor_MoveRight(1, false, Word);
                    this.Selection_Remove();
                }
            } else {
                if (true === AddToSelect) {
                    this.Selection.Use = true;
                    this.Selection.StartPos = this.CurPos.ContentPos;
                    this.Selection.EndPos = this.CurPos.ContentPos;
                    if (false === this.Content[this.CurPos.ContentPos].Cursor_MoveRight(1, true, Word)) {
                        if (this.Content.length - 1 != this.CurPos.ContentPos) {
                            this.CurPos.ContentPos++;
                            var Item = this.Content[this.CurPos.ContentPos];
                            this.Selection.EndPos = this.CurPos.ContentPos;
                            if (type_Paragraph === Item.GetType()) {
                                if (false === Item.Is_SelectionUse()) {
                                    var StartPos = Item.Internal_GetStartPos();
                                    Item.CurPos.ContentPos = StartPos;
                                    Item.Selection.Use = true;
                                    Item.Selection.StartPos = StartPos;
                                    Item.Selection.EndPos = StartPos;
                                }
                                Item.Cursor_MoveRight(1, true, Word);
                            } else {
                                if (type_Table === Item.GetType()) {
                                    if (false === Item.Is_SelectionUse()) {
                                        var FirstRow = Item.Content[0];
                                        Item.Selection.Use = true;
                                        Item.Selection.Type = table_Selection_Cell;
                                        Item.Selection.StartPos.Pos = {
                                            Row: 0,
                                            Cell: 0
                                        };
                                        Item.Selection.EndPos.Pos = {
                                            Row: 0,
                                            Cell: FirstRow.Get_CellsCount() - 1
                                        };
                                        Item.CurCell = FirstRow.Get_Cell(FirstRow.Get_CellsCount() - 1);
                                        Item.Selection.Data = new Array();
                                        for (var CellIndex = 0; CellIndex < FirstRow.Get_CellsCount(); CellIndex++) {
                                            Item.Selection.Data.push({
                                                Cell: CellIndex,
                                                Row: 0
                                            });
                                        }
                                    } else {
                                        Item.Cursor_MoveRight(1, true, Word);
                                    }
                                }
                            }
                        } else {
                            ReturnValue = false;
                        }
                    }
                    if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse()) {
                        this.Selection.Use = false;
                        this.CurPos.ContentPos = this.Selection.EndPos;
                    }
                } else {
                    if (false === this.Content[this.CurPos.ContentPos].Cursor_MoveRight(1, false, Word)) {
                        if (this.Content.length - 1 != this.CurPos.ContentPos) {
                            this.CurPos.ContentPos++;
                            this.Content[this.CurPos.ContentPos].Cursor_MoveToStartPos();
                        } else {
                            ReturnValue = false;
                        }
                    }
                }
            }
            return ReturnValue;
        }
    },
    Cursor_MoveUp: function (AddToSelect) {
        if (docpostype_DrawingObjects == this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.cursorMoveUp(AddToSelect);
        } else {
            if (this.CurPos.ContentPos < 0) {
                return false;
            }
            var ReturnValue = true;
            this.Remove_NumberingSelection();
            if (true === this.Selection.Use) {
                if (true === AddToSelect) {
                    var Item = this.Content[this.Selection.EndPos];
                    if (false === Item.Cursor_MoveUp(1, true)) {
                        if (0 != this.Selection.EndPos) {
                            var TempXY = Item.Get_CurPosXY();
                            this.CurPos.RealX = TempXY.X;
                            this.CurPos.RealY = TempXY.Y;
                            this.Selection.EndPos--;
                            Item = this.Content[this.Selection.EndPos];
                            Item.Cursor_MoveUp_To_LastRow(this.CurPos.RealX, this.CurPos.RealY, true);
                        } else {
                            ReturnValue = false;
                        }
                    }
                    if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse()) {
                        this.Selection.Use = false;
                    }
                    this.CurPos.ContentPos = this.Selection.EndPos;
                } else {
                    var Start = this.Selection.StartPos;
                    if (Start > this.Selection.EndPos) {
                        Start = this.Selection.EndPos;
                    }
                    this.CurPos.ContentPos = Start;
                    var Item = this.Content[this.CurPos.ContentPos];
                    if (false === this.Content[this.CurPos.ContentPos].Cursor_MoveUp(1, false)) {
                        if (0 != this.CurPos.ContentPos) {
                            var TempXY = Item.Get_CurPosXY();
                            this.CurPos.RealX = TempXY.X;
                            this.CurPos.RealY = TempXY.Y;
                            this.CurPos.ContentPos--;
                            Item = this.Content[this.CurPos.ContentPos];
                            Item.Cursor_MoveUp_To_LastRow(this.CurPos.RealX, this.CurPos.RealY, false);
                        } else {
                            ReturnValue = false;
                        }
                    }
                    this.Selection_Remove();
                }
            } else {
                if (true === AddToSelect) {
                    this.Selection.Use = true;
                    this.Selection.StartPos = this.CurPos.ContentPos;
                    this.Selection.EndPos = this.CurPos.ContentPos;
                    var Item = this.Content[this.CurPos.ContentPos];
                    if (false === Item.Cursor_MoveUp(1, true)) {
                        if (0 != this.CurPos.ContentPos) {
                            var TempXY = Item.Get_CurPosXY();
                            this.CurPos.RealX = TempXY.X;
                            this.CurPos.RealY = TempXY.Y;
                            this.CurPos.ContentPos--;
                            Item = this.Content[this.CurPos.ContentPos];
                            Item.Cursor_MoveUp_To_LastRow(this.CurPos.RealX, this.CurPos.RealY, true);
                            this.Selection.EndPos = this.CurPos.ContentPos;
                        } else {
                            ReturnValue = false;
                        }
                    }
                    if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse()) {
                        this.Selection.Use = false;
                    }
                    this.CurPos.ContentPos = this.Selection.EndPos;
                } else {
                    var Item = this.Content[this.CurPos.ContentPos];
                    if (false === Item.Cursor_MoveUp(1, false)) {
                        if (0 != this.CurPos.ContentPos) {
                            var TempXY = Item.Get_CurPosXY();
                            this.CurPos.RealX = TempXY.X;
                            this.CurPos.RealY = TempXY.Y;
                            this.CurPos.ContentPos--;
                            Item = this.Content[this.CurPos.ContentPos];
                            Item.Cursor_MoveUp_To_LastRow(this.CurPos.RealX, this.CurPos.RealY, false);
                        } else {
                            ReturnValue = false;
                        }
                    }
                }
            }
            return ReturnValue;
        }
    },
    Cursor_MoveDown: function (AddToSelect) {
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.cursorMoveDown(AddToSelect);
        } else {
            if (docpostype_Content === this.CurPos.Type) {
                if (this.CurPos.ContentPos < 0) {
                    return false;
                }
                var ReturnValue = true;
                this.Remove_NumberingSelection();
                if (true === this.Selection.Use) {
                    if (true === AddToSelect) {
                        var Item = this.Content[this.Selection.EndPos];
                        if (false === Item.Cursor_MoveDown(1, true)) {
                            if (this.Content.length - 1 != this.Selection.EndPos) {
                                var TempXY = Item.Get_CurPosXY();
                                this.CurPos.RealX = TempXY.X;
                                this.CurPos.RealY = TempXY.Y;
                                this.Selection.EndPos++;
                                Item = this.Content[this.Selection.EndPos];
                                Item.Cursor_MoveDown_To_FirstRow(this.CurPos.RealX, this.CurPos.RealY, true);
                            } else {
                                ReturnValue = false;
                            }
                        }
                        if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse()) {
                            this.Selection.Use = false;
                        }
                        this.CurPos.ContentPos = this.Selection.EndPos;
                    } else {
                        var End = this.Selection.EndPos;
                        if (End < this.Selection.StartPos) {
                            End = this.Selection.StartPos;
                        }
                        this.CurPos.ContentPos = End;
                        var Item = this.Content[this.CurPos.ContentPos];
                        if (false === this.Content[this.CurPos.ContentPos].Cursor_MoveDown(1, false)) {
                            if (this.Content.length - 1 != this.CurPos.ContentPos) {
                                var TempXY = Item.Get_CurPosXY();
                                this.CurPos.RealX = TempXY.X;
                                this.CurPos.RealY = TempXY.Y;
                                this.CurPos.ContentPos++;
                                Item = this.Content[this.CurPos.ContentPos];
                                Item.Cursor_MoveDown_To_FirstRow(this.CurPos.RealX, this.CurPos.RealY, false);
                            } else {
                                ReturnValue = false;
                            }
                        }
                        this.Selection_Remove();
                    }
                } else {
                    if (true === AddToSelect) {
                        this.Selection.Use = true;
                        this.Selection.StartPos = this.CurPos.ContentPos;
                        this.Selection.EndPos = this.CurPos.ContentPos;
                        var Item = this.Content[this.CurPos.ContentPos];
                        if (false === Item.Cursor_MoveDown(1, true)) {
                            if (this.Content.length - 1 != this.CurPos.ContentPos) {
                                var TempXY = Item.Get_CurPosXY();
                                this.CurPos.RealX = TempXY.X;
                                this.CurPos.RealY = TempXY.Y;
                                this.CurPos.ContentPos++;
                                Item = this.Content[this.CurPos.ContentPos];
                                Item.Cursor_MoveDown_To_FirstRow(this.CurPos.RealX, this.CurPos.RealY, true);
                                this.Selection.EndPos = this.CurPos.ContentPos;
                            } else {
                                ReturnValue = false;
                            }
                        }
                        if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse()) {
                            this.Selection.Use = false;
                        }
                        this.CurPos.ContentPos = this.Selection.EndPos;
                    } else {
                        var Item = this.Content[this.CurPos.ContentPos];
                        if (false === Item.Cursor_MoveDown(1, AddToSelect)) {
                            if (this.Content.length - 1 != this.CurPos.ContentPos) {
                                var TempXY = Item.Get_CurPosXY();
                                this.CurPos.RealX = TempXY.X;
                                this.CurPos.RealY = TempXY.Y;
                                this.CurPos.ContentPos++;
                                Item = this.Content[this.CurPos.ContentPos];
                                Item.Cursor_MoveDown_To_FirstRow(this.CurPos.RealX, this.CurPos.RealY, false);
                            } else {
                                ReturnValue = false;
                            }
                        }
                    }
                }
                return ReturnValue;
            }
        }
    },
    Cursor_MoveEndOfLine: function (AddToSelect) {
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.cursorMoveEndOfLine(AddToSelect);
        } else {
            if (this.CurPos.ContentPos < 0) {
                return false;
            }
            this.Remove_NumberingSelection();
            if (true === this.Selection.Use) {
                if (true === AddToSelect) {
                    var Item = this.Content[this.Selection.EndPos];
                    Item.Cursor_MoveEndOfLine(AddToSelect);
                    if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse()) {
                        this.Selection.Use = false;
                        this.CurPos.ContentPos = this.Selection.EndPos;
                    }
                } else {
                    var Pos = (this.Selection.EndPos >= this.Selection.StartPos ? this.Selection.EndPos : this.Selection.StartPos);
                    this.CurPos.ContentPos = Pos;
                    var Item = this.Content[Pos];
                    Item.Cursor_MoveEndOfLine(AddToSelect);
                    this.Selection_Remove();
                }
            } else {
                if (true === AddToSelect) {
                    this.Selection.Use = true;
                    this.Selection.StartPos = this.CurPos.ContentPos;
                    this.Selection.EndPos = this.CurPos.ContentPos;
                    var Item = this.Content[this.CurPos.ContentPos];
                    Item.Cursor_MoveEndOfLine(AddToSelect);
                    if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse()) {
                        this.Selection.Use = false;
                        this.CurPos.ContentPos = this.Selection.EndPos;
                    }
                } else {
                    var Item = this.Content[this.CurPos.ContentPos];
                    Item.Cursor_MoveEndOfLine(AddToSelect);
                }
            }
        }
    },
    Cursor_MoveStartOfLine: function (AddToSelect) {
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.cursorMoveStartOfLine(AddToSelect);
        } else {
            if (this.CurPos.ContentPos < 0) {
                return false;
            }
            this.Remove_NumberingSelection();
            if (true === this.Selection.Use) {
                if (true === AddToSelect) {
                    var Item = this.Content[this.Selection.EndPos];
                    Item.Cursor_MoveStartOfLine(AddToSelect);
                    if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse()) {
                        this.Selection.Use = false;
                        this.CurPos.ContentPos = this.Selection.EndPos;
                    }
                } else {
                    var Pos = (this.Selection.StartPos <= this.Selection.EndPos ? this.Selection.StartPos : this.Selection.EndPos);
                    this.CurPos.ContentPos = Pos;
                    var Item = this.Content[Pos];
                    Item.Cursor_MoveStartOfLine(AddToSelect);
                    this.Selection_Remove();
                }
            } else {
                if (true === AddToSelect) {
                    this.Selection.Use = true;
                    this.Selection.StartPos = this.CurPos.ContentPos;
                    this.Selection.EndPos = this.CurPos.ContentPos;
                    var Item = this.Content[this.CurPos.ContentPos];
                    Item.Cursor_MoveStartOfLine(AddToSelect);
                    if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse()) {
                        this.Selection.Use = false;
                        this.CurPos.ContentPos = this.Selection.EndPos;
                    }
                } else {
                    var Item = this.Content[this.CurPos.ContentPos];
                    Item.Cursor_MoveStartOfLine(AddToSelect);
                }
            }
        }
    },
    Cursor_MoveAt: function (X, Y, AddToSelect, bRemoveOldSelection, PageNum_Abs) {
        if (undefined != PageNum_Abs) {
            this.CurPage = PageNum_Abs - this.Get_StartPage_Absolute();
        }
        if (false != bRemoveOldSelection) {
            this.Remove_NumberingSelection();
        }
        if (true === this.Selection.Use) {
            if (true === AddToSelect) {
                this.Selection_SetEnd(X, Y, true);
            } else {
                this.Selection_Remove();
                var ContentPos = this.Internal_GetContentPosByXY(X, Y);
                this.CurPos.ContentPos = ContentPos;
                this.Content[ContentPos].Cursor_MoveAt(X, Y, false, false, this.CurPage);
                this.Interface_Update_ParaPr();
                this.Interface_Update_TextPr();
            }
        } else {
            if (true === AddToSelect) {
                this.Selection.Use = true;
                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Content[this.CurPos.ContentPos].Selection.Use = true;
                this.Content[this.CurPos.ContentPos].Selection.StartPos = this.Content[this.CurPos.ContentPos].CurPos.ContentPos;
                this.Selection_SetEnd(X, Y, true);
            } else {
                var ContentPos = this.Internal_GetContentPosByXY(X, Y);
                this.CurPos.ContentPos = ContentPos;
                this.Content[ContentPos].Cursor_MoveAt(X, Y, false, false, this.CurPage);
                this.Interface_Update_ParaPr();
                this.Interface_Update_TextPr();
            }
        }
    },
    Cursor_IsStart: function (bOnlyPara) {
        if (undefined === bOnlyPara) {
            bOnlyPara = false;
        }
        if (true === bOnlyPara && true != this.Is_CurrentElementParagraph()) {
            return false;
        }
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return false;
        } else {
            if (false != this.Selection.Use || 0 != this.CurPos.ContentPos) {
                return false;
            }
        }
        var Item = this.Content[0];
        return Item.Cursor_IsStart();
    },
    Get_CurPosXY: function () {
        return {
            X: this.CurPos.RealX,
            Y: this.CurPos.RealY
        };
    },
    Set_CurPosXY: function (X, Y) {
        this.CurPos.RealX = X;
        this.CurPos.RealY = Y;
    },
    Is_SelectionUse: function () {
        if (true == this.Selection.Use) {
            return true;
        }
        return false;
    },
    Is_TextSelectionUse: function () {
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.isTextSelectionUse();
        }
        return this.Is_SelectionUse();
    },
    Get_SelectedText: function (bClearText) {
        if (true === this.ApplyToAll) {
            if (true === bClearText && this.Content.length <= 1) {
                this.Content[0].Set_ApplyToAll(true);
                var ResultText = this.Content[0].Get_SelectedText(true);
                this.Content[0].Set_ApplyToAll(false);
                return ResultText;
            } else {
                if (true != bClearText) {
                    var ResultText = "";
                    var Count = this.Content.length;
                    for (var Index = 0; Index < Count; Index++) {
                        this.Content[Index].Set_ApplyToAll(true);
                        ResultText += this.Content[Index].Get_SelectedText(false);
                        this.Content[Index].Set_ApplyToAll(false);
                    }
                    return ResultText;
                }
            }
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return this.LogicDocument.DrawingObjects.getSelectedText(bClearText);
            }
            if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && selectionflag_Common === this.Selection.Flag) || false === this.Selection.Use)) {
                if (true === bClearText && (this.Selection.StartPos === this.Selection.EndPos || false === this.Selection.Use)) {
                    var Pos = (true == this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos);
                    return this.Content[Pos].Get_SelectedText(true);
                } else {
                    if (false === bClearText) {
                        var StartPos = (true == this.Selection.Use ? Math.min(this.Selection.StartPos, this.Selection.EndPos) : this.CurPos.ContentPos);
                        var EndPos = (true == this.Selection.Use ? Math.max(this.Selection.StartPos, this.Selection.EndPos) : this.CurPos.ContentPos);
                        var ResultText = "";
                        for (var Index = StartPos; Index <= EndPos; Index++) {
                            ResultText += this.Content[Index].Get_SelectedText(false);
                        }
                        return ResultText;
                    }
                }
            }
        }
        return null;
    },
    Get_SelectedElementsInfo: function (Info) {
        if (true === this.ApplyToAll) {
            var Count = this.Content.length;
            if (Count > 1) {
                Info.Set_MixedSelection();
            } else {
                if (Count === 1) {
                    this.Content[0].Get_SelectedElementsInfo(Info);
                }
            }
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                this.LogicDocument.DrawingObjects.getSelectedElementsInfo(Info);
            } else {
                if (selectionflag_Numbering === this.Selection.Flag) {
                    if (! (null == this.Selection.Data || this.Selection.Data.length <= 0)) {
                        var CurPara = this.Content[this.Selection.Data[0]];
                        for (var Index = 0; Index < this.Selection.Data.length; Index++) {
                            if (this.CurPos.ContentPos === this.Selection.Data[Index]) {
                                CurPara = this.Content[this.Selection.Data[Index]];
                            }
                        }
                        CurPara.Get_SelectedElementsInfo(Info);
                    }
                } else {
                    if (true === this.Selection.Use) {
                        if (this.Selection.StartPos != this.Selection.EndPos) {
                            Info.Set_MixedSelection();
                        } else {
                            this.Content[this.Selection.StartPos].Get_SelectedElementsInfo(Info);
                        }
                    } else {
                        this.Content[this.CurPos.ContentPos].Get_SelectedElementsInfo(Info);
                    }
                }
            }
        }
    },
    Set_ParagraphAlign: function (Align) {
        if (true === this.ApplyToAll) {
            for (var Index = 0; Index < this.Content.length; Index++) {
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                if (type_Paragraph == Item.GetType()) {
                    Item.Set_Align(Align, false);
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.TurnOff_RecalcEvent();
                        Item.Set_ParagraphAlign(Align);
                        Item.TurnOn_RecalcEvent();
                    }
                }
                Item.Set_ApplyToAll(false);
            }
            return;
        }
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.setParagraphAlign(Align);
        } else {
            if (this.CurPos.ContentPos < 0) {
                return false;
            }
            if (true === this.Selection.Use) {
                var StartPos = this.Selection.StartPos;
                var EndPos = this.Selection.EndPos;
                if (EndPos < StartPos) {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos = Temp;
                }
                for (var Index = StartPos; Index <= EndPos; Index++) {
                    var Item = this.Content[Index];
                    if (type_Paragraph == Item.GetType()) {
                        Item.Set_Align(Align, true);
                    } else {
                        if (type_Table == Item.GetType()) {
                            Item.TurnOff_RecalcEvent();
                            Item.Set_ParagraphAlign(Align);
                            Item.TurnOn_RecalcEvent();
                        }
                    }
                }
                this.Parent.OnContentRecalculate(false);
                return;
            }
            var Item = this.Content[this.CurPos.ContentPos];
            if (type_Paragraph == Item.GetType()) {
                Item.Set_Align(Align, true);
                this.Parent.OnContentRecalculate(false);
            } else {
                if (type_Table == Item.GetType()) {
                    Item.Set_ParagraphAlign(Align);
                }
            }
        }
    },
    Set_ParagraphSpacing: function (Spacing) {
        if (true === this.ApplyToAll) {
            for (var Index = 0; Index < this.Content.length; Index++) {
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                if (type_Paragraph == Item.GetType()) {
                    Item.Set_Spacing(Spacing, false);
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.TurnOff_RecalcEvent();
                        Item.Set_ParagraphSpacing(Spacing);
                        Item.TurnOn_RecalcEvent();
                    }
                }
                Item.Set_ApplyToAll(false);
            }
            return;
        }
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.setParagraphSpacing(Spacing);
        } else {
            if (this.CurPos.ContentPos < 0) {
                return false;
            }
            if (true === this.Selection.Use) {
                var StartPos = this.Selection.StartPos;
                var EndPos = this.Selection.EndPos;
                if (EndPos < StartPos) {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos = Temp;
                }
                for (var Index = StartPos; Index <= EndPos; Index++) {
                    var Item = this.Content[Index];
                    if (type_Paragraph == Item.GetType()) {
                        Item.Set_Spacing(Spacing, false);
                    } else {
                        if (type_Table == Item.GetType()) {
                            Item.TurnOff_RecalcEvent();
                            Item.Set_ParagraphSpacing(Spacing);
                            Item.TurnOn_RecalcEvent();
                        }
                    }
                }
                this.ContentLastChangePos = StartPos;
                this.Recalculate();
                return;
            }
            var Item = this.Content[this.CurPos.ContentPos];
            if (type_Paragraph == Item.GetType()) {
                Item.Set_Spacing(Spacing, false);
                this.ContentLastChangePos = this.CurPos.ContentPos;
                this.Recalculate();
            } else {
                if (type_Table == Item.GetType()) {
                    Item.Set_ParagraphSpacing(Spacing);
                }
            }
        }
    },
    Set_ParagraphIndent: function (Ind) {
        if (true === this.ApplyToAll) {
            for (var Index = 0; Index < this.Content.length; Index++) {
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                if (type_Paragraph == Item.GetType()) {
                    var NumPr = null;
                    if ("number" == typeof(Ind.ChangeLevel) && 0 != Ind.ChangeLevel && undefined != (NumPr = Item.Numbering_Get())) {
                        if (Ind.ChangeLevel > 0) {
                            Item.Numbering_Add(NumPr.NumId, Math.min(8, NumPr.Lvl + 1));
                        } else {
                            Item.Numbering_Add(NumPr.NumId, Math.max(0, NumPr.Lvl - 1));
                        }
                    } else {
                        Item.Set_Ind(Ind, false);
                    }
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.TurnOff_RecalcEvent();
                        Item.Set_ParagraphIndent(Ind);
                        Item.TurnOn_RecalcEvent();
                    }
                }
                Item.Set_ApplyToAll(false);
            }
            return;
        }
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.setParagraphIndent(Ind);
        } else {
            if (this.CurPos.ContentPos < 0) {
                return false;
            }
            if (true === this.Selection.Use) {
                var StartPos = this.Selection.StartPos;
                var EndPos = this.Selection.EndPos;
                if (EndPos < StartPos) {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos = Temp;
                }
                for (var Index = StartPos; Index <= EndPos; Index++) {
                    var Item = this.Content[Index];
                    if (type_Paragraph == Item.GetType()) {
                        var NumPr = null;
                        if ("number" == typeof(Ind.ChangeLevel) && 0 != Ind.ChangeLevel && undefined != (NumPr = Item.Numbering_Get())) {
                            if (Ind.ChangeLevel > 0) {
                                Item.Numbering_Add(NumPr.NumId, Math.min(8, NumPr.Lvl + 1));
                            } else {
                                Item.Numbering_Add(NumPr.NumId, Math.max(0, NumPr.Lvl - 1));
                            }
                        } else {
                            Item.Set_Ind(Ind, false);
                        }
                    } else {
                        if (type_Table == Item.GetType()) {
                            Item.TurnOff_RecalcEvent();
                            Item.Set_ParagraphIndent(Ind);
                            Item.TurnOn_RecalcEvent();
                        }
                    }
                }
                this.ContentLastChangePos = StartPos;
                this.Recalculate();
                this.Interface_Update_ParaPr();
                return;
            }
            var Item = this.Content[this.CurPos.ContentPos];
            if (type_Paragraph == Item.GetType()) {
                var NumPr = null;
                if ("number" == typeof(Ind.ChangeLevel) && 0 != Ind.ChangeLevel && undefined != (NumPr = Item.Numbering_Get())) {
                    if (Ind.ChangeLevel > 0) {
                        Item.Numbering_Add(NumPr.NumId, Math.min(8, NumPr.Lvl + 1));
                    } else {
                        Item.Numbering_Add(NumPr.NumId, Math.max(0, NumPr.Lvl - 1));
                    }
                } else {
                    Item.Set_Ind(Ind, false);
                }
                this.ContentLastChangePos = this.CurPos.ContentPos;
                this.Recalculate();
                this.Interface_Update_ParaPr();
            } else {
                if (type_Table == Item.GetType()) {
                    Item.Set_ParagraphIndent(Ind);
                }
            }
        }
    },
    Set_ParagraphNumbering: function (NumInfo) {
        if (true === this.ApplyToAll) {
            return;
        }
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.setParagraphNumbering(NumInfo);
        } else {
            if (this.CurPos.ContentPos < 0) {
                return false;
            }
            if (true === this.Selection.Use && selectionflag_Numbering !== this.Selection.Flag) {
                if (this.Selection.StartPos === this.Selection.EndPos && type_Table === this.Content[this.Selection.StartPos].GetType()) {
                    this.Content[this.Selection.StartPos].Set_ParagraphNumbering(NumInfo);
                    return true;
                }
                var StartPos = this.Selection.StartPos;
                var EndPos = this.Selection.EndPos;
                if (EndPos < StartPos) {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos = Temp;
                }
                if (NumInfo.SubType < 0) {
                    for (var Index = StartPos; Index <= EndPos; Index++) {
                        if (type_Paragraph == this.Content[Index].GetType()) {
                            this.Content[Index].Numbering_Remove();
                        } else {
                            if (type_Table == this.Content[Index].GetType()) {
                                this.Content[Index].TurnOff_RecalcEvent();
                                this.Content[Index].Set_ParagraphNumbering(NumInfo);
                                this.Content[Index].TurnOn_RecalcEvent();
                            }
                        }
                    }
                } else {
                    switch (NumInfo.Type) {
                    case 0:
                        if (0 === NumInfo.SubType) {
                            var Prev = this.Content[StartPos - 1];
                            var NumId = null;
                            var NumLvl = 0;
                            if ("undefined" != typeof(Prev) && null != Prev && type_Paragraph === Prev.GetType()) {
                                var PrevNumPr = Prev.Numbering_Get();
                                if (undefined != PrevNumPr && true === this.Numbering.Check_Format(PrevNumPr.NumId, PrevNumPr.Lvl, numbering_numfmt_Bullet)) {
                                    NumId = PrevNumPr.NumId;
                                    NumLvl = PrevNumPr.Lvl;
                                }
                            }
                            if (null === NumId) {
                                NumId = this.Numbering.Create_AbstractNum();
                                NumLvl = 0;
                                this.Numbering.Get_AbstractNum(NumId).Create_Default_Bullet();
                            }
                            for (var Index = StartPos; Index <= EndPos; Index++) {
                                var OldNumPr = null;
                                if (type_Paragraph === this.Content[Index].GetType()) {
                                    if (undefined != (OldNumPr = this.Content[Index].Numbering_Get())) {
                                        this.Content[Index].Numbering_Add(NumId, OldNumPr.Lvl);
                                    } else {
                                        this.Content[Index].Numbering_Add(NumId, NumLvl);
                                    }
                                } else {
                                    if (type_Table == this.Content[Index].GetType()) {
                                        this.Content[Index].TurnOff_RecalcEvent();
                                        this.Content[Index].Set_ParagraphNumbering(NumInfo);
                                        this.Content[Index].TurnOn_RecalcEvent();
                                    }
                                }
                            }
                        } else {
                            var bDiffLvl = false;
                            var bDiffId = false;
                            var PrevLvl = null;
                            var PrevId = null;
                            for (var Index = StartPos; Index <= EndPos; Index++) {
                                var NumPr = null;
                                if (type_Paragraph === this.Content[Index].GetType() && undefined != (NumPr = this.Content[Index].Numbering_Get())) {
                                    if (null === PrevLvl) {
                                        PrevLvl = NumPr.Lvl;
                                    }
                                    if (null === PrevId) {
                                        PrevId = NumPr.NumId;
                                    }
                                    if (PrevId != NumPr.NumId) {
                                        bDiffId = true;
                                    }
                                    if (PrevLvl != NumPr.Lvl) {
                                        bDiffLvl = true;
                                        break;
                                    }
                                } else {
                                    if ((type_Paragraph === this.Content[Index].GetType() && undefined === NumPr) || type_Table === this.Content[Index].GetType()) {
                                        bDiffLvl = true;
                                        break;
                                    }
                                }
                            }
                            var LvlText = "";
                            var LvlTextPr = new CTextPr();
                            LvlTextPr.RFonts.Set_All("Times New Roman", -1);
                            switch (NumInfo.SubType) {
                            case 1:
                                LvlText = String.fromCharCode(183);
                                LvlTextPr.RFonts.Set_All("Symbol", -1);
                                break;
                            case 2:
                                LvlText = "o";
                                LvlTextPr.RFonts.Set_All("Courier New", -1);
                                break;
                            case 3:
                                LvlText = String.fromCharCode(167);
                                LvlTextPr.RFonts.Set_All("Wingdings", -1);
                                break;
                            case 4:
                                LvlText = String.fromCharCode(118);
                                LvlTextPr.RFonts.Set_All("Wingdings", -1);
                                break;
                            case 5:
                                LvlText = String.fromCharCode(216);
                                LvlTextPr.RFonts.Set_All("Wingdings", -1);
                                break;
                            case 6:
                                LvlText = String.fromCharCode(252);
                                LvlTextPr.RFonts.Set_All("Wingdings", -1);
                                break;
                            case 7:
                                LvlText = String.fromCharCode(168);
                                LvlTextPr.RFonts.Set_All("Symbol", -1);
                                break;
                            }
                            var NumId = null;
                            if (true === bDiffLvl) {
                                NumId = this.Numbering.Create_AbstractNum();
                                var AbstractNum = this.Numbering.Get_AbstractNum(NumId);
                                AbstractNum.Create_Default_Bullet();
                                AbstractNum.Set_Lvl_Bullet(0, LvlText, LvlTextPr);
                            } else {
                                if (true === bDiffId || true != this.Numbering.Check_Format(PrevId, PrevLvl, numbering_numfmt_Bullet)) {
                                    NumId = this.Numbering.Create_AbstractNum();
                                    var AbstractNum = this.Numbering.Get_AbstractNum(NumId);
                                    AbstractNum.Create_Default_Bullet();
                                    AbstractNum.Set_Lvl_Bullet(PrevLvl, LvlText, LvlTextPr);
                                } else {
                                    NumId = this.Numbering.Create_AbstractNum();
                                    var OldAbstractNum = this.Numbering.Get_AbstractNum(PrevId);
                                    var NewAbstractNum = this.Numbering.Get_AbstractNum(NumId);
                                    NewAbstractNum.Copy(OldAbstractNum);
                                    NewAbstractNum.Set_Lvl_Bullet(PrevLvl, LvlText, LvlTextPr);
                                }
                            }
                            for (var Index = StartPos; Index <= EndPos; Index++) {
                                var OldNumPr = null;
                                if (type_Paragraph === this.Content[Index].GetType()) {
                                    if (undefined != (OldNumPr = this.Content[Index].Numbering_Get())) {
                                        this.Content[Index].Numbering_Add(NumId, OldNumPr.Lvl);
                                    } else {
                                        this.Content[Index].Numbering_Add(NumId, 0);
                                    }
                                } else {
                                    if (type_Table == this.Content[Index].GetType()) {
                                        this.Content[Index].TurnOff_RecalcEvent();
                                        this.Content[Index].Set_ParagraphNumbering(NumInfo);
                                        this.Content[Index].TurnOn_RecalcEvent();
                                    }
                                }
                            }
                        }
                        break;
                    case 1:
                        if (0 === NumInfo.SubType) {
                            var Prev = this.Content[StartPos - 1];
                            var NumId = null;
                            var NumLvl = 0;
                            if ("undefined" != typeof(Prev) && null != Prev && type_Paragraph === Prev.GetType()) {
                                var PrevNumPr = Prev.Numbering_Get();
                                if (undefined != PrevNumPr && true === this.Numbering.Check_Format(PrevNumPr.NumId, PrevNumPr.Lvl, numbering_numfmt_Decimal)) {
                                    NumId = PrevNumPr.NumId;
                                    NumLvl = PrevNumPr.Lvl;
                                }
                            }
                            if (null === NumId) {
                                NumId = this.Numbering.Create_AbstractNum();
                                NumLvl = 0;
                                this.Numbering.Get_AbstractNum(NumId).Create_Default_Numbered();
                            }
                            for (var Index = StartPos; Index <= EndPos; Index++) {
                                var OldNumPr = null;
                                if (type_Paragraph === this.Content[Index].GetType()) {
                                    if (undefined != (OldNumPr = this.Content[Index].Numbering_Get())) {
                                        this.Content[Index].Numbering_Add(NumId, OldNumPr.Lvl);
                                    } else {
                                        this.Content[Index].Numbering_Add(NumId, NumLvl);
                                    }
                                } else {
                                    if (type_Table === this.Content[Index].GetType()) {
                                        this.Content[Index].TurnOff_RecalcEvent();
                                        this.Content[Index].Set_ParagraphNumbering(NumInfo);
                                        this.Content[Index].TurnOn_RecalcEvent();
                                    }
                                }
                            }
                        } else {
                            var bDiffLvl = false;
                            var bDiffId = false;
                            var PrevLvl = null;
                            var PrevId = null;
                            for (var Index = StartPos; Index <= EndPos; Index++) {
                                var NumPr = null;
                                if (type_Paragraph === this.Content[Index].GetType() && undefined != (NumPr = this.Content[Index].Numbering_Get())) {
                                    if (null === PrevLvl) {
                                        PrevLvl = NumPr.Lvl;
                                    }
                                    if (null === PrevId) {
                                        PrevId = NumPr.NumId;
                                    }
                                    if (PrevId != NumPr.NumId) {
                                        bDiffId = true;
                                    }
                                    if (PrevLvl != NumPr.Lvl) {
                                        bDiffLvl = true;
                                        break;
                                    }
                                } else {
                                    if ((type_Paragraph === this.Content[Index].GetType() && undefined === NumPr) || type_Table === this.Content[Index].GetType()) {
                                        bDiffLvl = true;
                                        break;
                                    }
                                }
                            }
                            var AbstractNum = null;
                            var ChangeLvl = 0;
                            var NumId = null;
                            if (true === bDiffLvl) {
                                NumId = this.Numbering.Create_AbstractNum();
                                AbstractNum = this.Numbering.Get_AbstractNum(NumId);
                                AbstractNum.Create_Default_Numbered();
                                ChangeLvl = 0;
                            } else {
                                if (true === bDiffId || true != this.Numbering.Check_Format(PrevId, PrevLvl, numbering_numfmt_Decimal)) {
                                    NumId = this.Numbering.Create_AbstractNum();
                                    AbstractNum = this.Numbering.Get_AbstractNum(NumId);
                                    AbstractNum.Create_Default_Numbered();
                                    ChangeLvl = PrevLvl;
                                } else {
                                    NumId = this.Numbering.Create_AbstractNum();
                                    var OldAbstractNum = this.Numbering.Get_AbstractNum(PrevId);
                                    AbstractNum = this.Numbering.Get_AbstractNum(NumId);
                                    AbstractNum.Copy(OldAbstractNum);
                                    ChangeLvl = PrevLvl;
                                }
                            }
                            switch (NumInfo.SubType) {
                            case 1:
                                AbstractNum.Set_Lvl_Numbered_2(ChangeLvl);
                                break;
                            case 2:
                                AbstractNum.Set_Lvl_Numbered_1(ChangeLvl);
                                break;
                            case 3:
                                AbstractNum.Set_Lvl_Numbered_5(ChangeLvl);
                                break;
                            case 4:
                                AbstractNum.Set_Lvl_Numbered_6(ChangeLvl);
                                break;
                            case 5:
                                AbstractNum.Set_Lvl_Numbered_7(ChangeLvl);
                                break;
                            case 6:
                                AbstractNum.Set_Lvl_Numbered_8(ChangeLvl);
                                break;
                            case 7:
                                AbstractNum.Set_Lvl_Numbered_9(ChangeLvl);
                                break;
                            }
                            for (var Index = StartPos; Index <= EndPos; Index++) {
                                var OldNumPr = null;
                                if (type_Paragraph === this.Content[Index].GetType()) {
                                    if (undefined != (OldNumPr = this.Content[Index].Numbering_Get())) {
                                        this.Content[Index].Numbering_Add(NumId, OldNumPr.Lvl);
                                    } else {
                                        this.Content[Index].Numbering_Add(NumId, 0);
                                    }
                                } else {
                                    if (type_Table === this.Content[Index].GetType()) {
                                        this.Content[Index].TurnOff_RecalcEvent();
                                        this.Content[Index].Set_ParagraphNumbering(NumInfo);
                                        this.Content[Index].TurnOn_RecalcEvent();
                                    }
                                }
                            }
                        }
                        break;
                    case 2:
                        var NumId = this.Numbering.Create_AbstractNum();
                        var AbstractNum = this.Numbering.Get_AbstractNum(NumId);
                        switch (NumInfo.SubType) {
                        case 1:
                            AbstractNum.Create_Default_Multilevel_1();
                            break;
                        case 2:
                            AbstractNum.Create_Default_Multilevel_2();
                            break;
                        case 3:
                            AbstractNum.Create_Default_Multilevel_3();
                            break;
                        }
                        for (var Index = StartPos; Index <= EndPos; Index++) {
                            var OldNumPr = null;
                            if (type_Paragraph === this.Content[Index].GetType()) {
                                if (undefined != (OldNumPr = this.Content[Index].Numbering_Get())) {
                                    this.Content[Index].Numbering_Add(NumId, OldNumPr.Lvl);
                                } else {
                                    this.Content[Index].Numbering_Add(NumId, 0);
                                }
                            } else {
                                if (type_Table === this.Content[Index].GetType()) {
                                    this.Content[Index].TurnOff_RecalcEvent();
                                    this.Content[Index].Set_ParagraphNumbering(NumInfo);
                                    this.Content[Index].TurnOn_RecalcEvent();
                                }
                            }
                        }
                        break;
                    }
                }
                this.ContentLastChangePos = StartPos - 1;
                this.Recalculate();
                return;
            }
            var Item = this.Content[this.CurPos.ContentPos];
            if (type_Paragraph == Item.GetType()) {
                var FirstChange = 0;
                if (NumInfo.SubType < 0) {
                    Item.Numbering_Remove();
                    if (selectionflag_Numbering === this.Selection.Flag) {
                        Item.Document_SetThisElementCurrent();
                    }
                } else {
                    if (selectionflag_Numbering === this.Selection.Flag && 0 === NumInfo.SubType) {
                        NumInfo.SubType = 1;
                    }
                    switch (NumInfo.Type) {
                    case 0:
                        if (0 === NumInfo.SubType) {
                            var NumPr = Item.Numbering_Get();
                            if (undefined != (NumPr = Item.Numbering_Get())) {
                                var AbstractNum = this.Numbering.Get_AbstractNum(NumPr.NumId);
                                if (false === this.Numbering.Check_Format(NumPr.NumId, NumPr.Lvl, numbering_numfmt_Bullet)) {
                                    AbstractNum.Create_Default_Bullet();
                                    FirstChange = 0;
                                    var bFirstChange = false;
                                    for (var Index = 0; Index < this.Content.length; Index++) {
                                        if (true === this.Content[Index].Numbering_IsUse(NumPr.NumId, NumPr.Lvl)) {
                                            if (false === bFirstChange) {
                                                FirstChange = Index;
                                                bFirstChange = true;
                                            }
                                            this.Content[Index].Recalc_CompileParaPr();
                                        }
                                    }
                                }
                            } else {
                                var Prev = this.Content[StartPos - 1];
                                var NumId = null;
                                var NumLvl = 0;
                                if ("undefined" != typeof(Prev) && null != Prev && type_Paragraph === Prev.GetType()) {
                                    var PrevNumPr = Prev.Numbering_Get();
                                    if (undefined != PrevNumPr && true === this.Numbering.Check_Format(PrevNumPr.NumId, PrevNumPr.Lvl, numbering_numfmt_Bullet)) {
                                        NumId = PrevNumPr.NumId;
                                        NumLvl = PrevNumPr.Lvl;
                                    }
                                }
                                if (null === NumId) {
                                    NumId = this.Numbering.Create_AbstractNum();
                                    NumLvl = 0;
                                    this.Numbering.Get_AbstractNum(NumId).Create_Default_Bullet();
                                }
                                if (type_Paragraph === Item.GetType()) {
                                    var OldNumPr = Item.Numbering_Get();
                                    if (undefined != OldNumPr) {
                                        Item.Numbering_Add(NumId, OldNumPr.Lvl);
                                    } else {
                                        Item.Numbering_Add(NumId, NumLvl);
                                    }
                                } else {
                                    Item.Numbering_Add(NumId, NumLvl);
                                }
                                FirstChange = this.CurPos.ContentPos - 1;
                            }
                        } else {
                            var LvlText = "";
                            var LvlTextPr = new CTextPr();
                            LvlTextPr.RFonts.Set_All("Times New Roman", -1);
                            switch (NumInfo.SubType) {
                            case 1:
                                LvlText = String.fromCharCode(183);
                                LvlTextPr.RFonts.Set_All("Symbol", -1);
                                break;
                            case 2:
                                LvlText = "o";
                                LvlTextPr.RFonts.Set_All("Courier New", -1);
                                break;
                            case 3:
                                LvlText = String.fromCharCode(167);
                                LvlTextPr.RFonts.Set_All("Wingdings", -1);
                                break;
                            case 4:
                                LvlText = String.fromCharCode(118);
                                LvlTextPr.RFonts.Set_All("Wingdings", -1);
                                break;
                            case 5:
                                LvlText = String.fromCharCode(216);
                                LvlTextPr.RFonts.Set_All("Wingdings", -1);
                                break;
                            case 6:
                                LvlText = String.fromCharCode(252);
                                LvlTextPr.RFonts.Set_All("Wingdings", -1);
                                break;
                            case 7:
                                LvlText = String.fromCharCode(168);
                                LvlTextPr.RFonts.Set_All("Symbol", -1);
                                break;
                            }
                            var NumPr = null;
                            if (undefined != (NumPr = Item.Numbering_Get())) {
                                var AbstractNum = this.Numbering.Get_AbstractNum(NumPr.NumId);
                                AbstractNum.Set_Lvl_Bullet(NumPr.Lvl, LvlText, LvlTextPr);
                                FirstChange = 0;
                                var bFirstChange = false;
                                for (var Index = 0; Index < this.Content.length; Index++) {
                                    if (true === this.Content[Index].Numbering_IsUse(NumPr.NumId, NumPr.Lvl)) {
                                        if (false === bFirstChange) {
                                            FirstChange = Index;
                                            bFirstChange = true;
                                        }
                                        this.Content[Index].Recalc_CompileParaPr();
                                    }
                                }
                            } else {
                                var NumId = this.Numbering.Create_AbstractNum();
                                var AbstractNum = this.Numbering.Get_AbstractNum(NumId);
                                AbstractNum.Create_Default_Bullet();
                                AbstractNum.Set_Lvl_Bullet(0, LvlText, LvlTextPr);
                                Item.Numbering_Add(NumId, 0);
                                FirstChange = this.CurPos.ContentPos - 1;
                            }
                        }
                        break;
                    case 1:
                        if (0 === NumInfo.SubType) {
                            var NumPr = Item.Numbering_Get();
                            if (undefined != (NumPr = Item.Numbering_Get())) {
                                var AbstractNum = this.Numbering.Get_AbstractNum(NumPr.NumId);
                                if (false === this.Numbering.Check_Format(NumPr.NumId, NumPr.Lvl, numbering_numfmt_Decimal)) {
                                    AbstractNum.Create_Default_Numbered();
                                    FirstChange = 0;
                                    var bFirstChange = false;
                                    for (var Index = 0; Index < this.Content.length; Index++) {
                                        if (true === this.Content[Index].Numbering_IsUse(NumPr.NumId, NumPr.Lvl)) {
                                            if (false === bFirstChange) {
                                                FirstChange = Index;
                                                bFirstChange = true;
                                            }
                                            this.Content[Index].Recalc_CompileParaPr();
                                        }
                                    }
                                }
                            } else {
                                var Prev = this.Content[StartPos - 1];
                                var NumId = null;
                                var NumLvl = 0;
                                if ("undefined" != typeof(Prev) && null != Prev && type_Paragraph === Prev.GetType()) {
                                    var PrevNumPr = Prev.Numbering_Get();
                                    if (undefined != PrevNumPr && true === this.Numbering.Check_Format(PrevNumPr.NumId, PrevNumPr.Lvl, numbering_numfmt_Decimal)) {
                                        NumId = PrevNumPr.NumId;
                                        NumLvl = PrevNumPr.Lvl;
                                    }
                                }
                                if (null === NumId) {
                                    NumId = this.Numbering.Create_AbstractNum();
                                    NumLvl = 0;
                                    this.Numbering.Get_AbstractNum(NumId).Create_Default_Numbered();
                                }
                                if (type_Paragraph === Item.GetType()) {
                                    var OldNumPr = Item.Numbering_Get();
                                    if (undefined != (OldNumPr)) {
                                        Item.Numbering_Add(NumId, OldNumPr.Lvl);
                                    } else {
                                        Item.Numbering_Add(NumId, NumLvl);
                                    }
                                } else {
                                    Item.Numbering_Add(NumId, NumLvl);
                                }
                                FirstChange = this.CurPos.ContentPos - 1;
                            }
                        } else {
                            var NumPr = null;
                            var AbstractNum = null;
                            var ChangeLvl = 0;
                            if (undefined != (NumPr = Item.Numbering_Get())) {
                                AbstractNum = this.Numbering.Get_AbstractNum(NumPr.NumId);
                                ChangeLvl = NumPr.Lvl;
                            } else {
                                var NumId = this.Numbering.Create_AbstractNum();
                                AbstractNum = this.Numbering.Get_AbstractNum(NumId);
                                AbstractNum.Create_Default_Numbered();
                                ChangeLvl = 0;
                            }
                            switch (NumInfo.SubType) {
                            case 1:
                                AbstractNum.Set_Lvl_Numbered_2(ChangeLvl);
                                break;
                            case 2:
                                AbstractNum.Set_Lvl_Numbered_1(ChangeLvl);
                                break;
                            case 3:
                                AbstractNum.Set_Lvl_Numbered_5(ChangeLvl);
                                break;
                            case 4:
                                AbstractNum.Set_Lvl_Numbered_6(ChangeLvl);
                                break;
                            case 5:
                                AbstractNum.Set_Lvl_Numbered_7(ChangeLvl);
                                break;
                            case 6:
                                AbstractNum.Set_Lvl_Numbered_8(ChangeLvl);
                                break;
                            case 7:
                                AbstractNum.Set_Lvl_Numbered_9(ChangeLvl);
                                break;
                            }
                            if (null != NumPr) {
                                FirstChange = 0;
                                var bFirstChange = false;
                                for (var Index = 0; Index < this.Content.length; Index++) {
                                    if (true === this.Content[Index].Numbering_IsUse(NumPr.NumId, NumPr.Lvl)) {
                                        if (false === bFirstChange) {
                                            FirstChange = Index;
                                            bFirstChange = true;
                                        }
                                        this.Content[Index].Recalc_CompileParaPr();
                                    }
                                }
                            } else {
                                Item.Numbering_Add(NumId, 0);
                                FirstChange = this.CurPos.ContentPos - 1;
                            }
                        }
                        break;
                    case 2:
                        var NumId = null;
                        var NumPr = null;
                        var AbstractNum = null;
                        if (undefined != (NumPr = Item.Numbering_Get())) {
                            AbstractNum = this.Numbering.Get_AbstractNum(NumPr.NumId);
                        } else {
                            NumId = this.Numbering.Create_AbstractNum();
                            AbstractNum = this.Numbering.Get_AbstractNum(NumId);
                        }
                        switch (NumInfo.SubType) {
                        case 1:
                            AbstractNum.Create_Default_Multilevel_1();
                            break;
                        case 2:
                            AbstractNum.Create_Default_Multilevel_2();
                            break;
                        case 3:
                            AbstractNum.Create_Default_Multilevel_3();
                            break;
                        }
                        if (null != NumPr) {
                            FirstChange = 0;
                            var bFirstChange = false;
                            for (var Index = 0; Index < this.Content.length; Index++) {
                                if (true === this.Content[Index].Numbering_IsUse(NumPr.NumId)) {
                                    if (false === bFirstChange) {
                                        FirstChange = Index;
                                        bFirstChange = true;
                                    }
                                    this.Content[Index].Recalc_CompileParaPr();
                                }
                            }
                        } else {
                            Item.Numbering_Add(NumId, 0);
                            FirstChange = this.CurPos.ContentPos - 1;
                        }
                        break;
                    }
                }
                this.ContentLastChangePos = FirstChange;
                this.Recalculate();
                this.Interface_Update_ParaPr();
            } else {
                if (type_Table == Item.GetType()) {
                    Item.Set_ParagraphNumbering(NumInfo);
                }
            }
        }
    },
    Set_ParagraphShd: function (Shd) {
        if (true === this.ApplyToAll) {
            for (var Index = 0; Index < this.Content.length; Index++) {
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                if (type_Paragraph == Item.GetType()) {
                    Item.Set_Shd(Shd);
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.TurnOff_RecalcEvent();
                        Item.Set_ParagraphShd(Shd);
                        Item.TurnOn_RecalcEvent();
                    }
                }
                Item.Set_ApplyToAll(false);
            }
            return;
        }
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.setParagraphShd(Shd);
        } else {
            if (this.CurPos.ContentPos < 0) {
                return false;
            }
            if (true === this.Selection.Use) {
                switch (this.Selection.Flag) {
                case selectionflag_Common:
                    var StartPos = this.Selection.StartPos;
                    var EndPos = this.Selection.EndPos;
                    if (EndPos < StartPos) {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos = Temp;
                    }
                    for (var Index = StartPos; Index <= EndPos; Index++) {
                        var Item = this.Content[Index];
                        if (type_Paragraph == Item.GetType()) {
                            Item.Set_Shd(Shd);
                        } else {
                            if (type_Table == Item.GetType()) {
                                Item.TurnOff_RecalcEvent();
                                Item.Set_ParagraphShd(Shd);
                                Item.TurnOn_RecalcEvent();
                            }
                        }
                    }
                    this.Parent.OnContentRecalculate(false);
                    break;
                case selectionflag_Numbering:
                    break;
                }
                return;
            }
            var Item = this.Content[this.CurPos.ContentPos];
            if (type_Paragraph == Item.GetType()) {
                Item.Set_Shd(Shd);
                this.Parent.OnContentRecalculate(false);
            } else {
                if (type_Table == Item.GetType()) {
                    Item.Set_ParagraphShd(Shd);
                }
            }
        }
    },
    Set_ParagraphStyle: function (Name) {
        var Styles = this.Parent.Get_Styles();
        var StyleId = Styles.Get_StyleIdByName(Name);
        if (true === this.ApplyToAll) {
            for (var Index = 0; Index < this.Content.length; Index++) {
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                if (type_Paragraph == Item.GetType()) {
                    Item.Style_Add(StyleId);
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.TurnOff_RecalcEvent();
                        Item.Set_ParagraphStyle(Name);
                        Item.TurnOn_RecalcEvent();
                    }
                }
                Item.Set_ApplyToAll(false);
            }
            return;
        }
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.setParagraphStyle(Name);
        } else {
            if (this.CurPos.ContentPos < 0) {
                return false;
            }
            if (true === this.Selection.Use) {
                if (selectionflag_Numbering === this.Selection.Flag) {
                    this.Interface_Update_ParaPr();
                    return false;
                }
                var StartPos = this.Selection.StartPos;
                var EndPos = this.Selection.EndPos;
                if (EndPos < StartPos) {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos = Temp;
                }
                for (var Index = StartPos; Index <= EndPos; Index++) {
                    var Item = this.Content[Index];
                    if (type_Paragraph == Item.GetType()) {
                        Item.Style_Add(StyleId);
                    } else {
                        if (type_Table == Item.GetType()) {
                            Item.TurnOff_RecalcEvent();
                            Item.Set_ParagraphStyle(Name);
                            Item.TurnOn_RecalcEvent();
                        }
                    }
                }
                this.ContentLastChangePos = StartPos;
                this.Recalculate();
                return;
            }
            var Item = this.Content[this.CurPos.ContentPos];
            if (type_Paragraph == Item.GetType()) {
                Item.Style_Add(StyleId);
                this.ContentLastChangePos = this.CurPos.ContentPos;
                this.Recalculate();
            } else {
                if (type_Table == Item.GetType()) {
                    Item.TurnOff_RecalcEvent();
                    Item.Set_ParagraphStyle(Name);
                    Item.TurnOn_RecalcEvent();
                    this.ContentLastChangePos = Math.max(this.CurPos.ContentPos - 1, 0);
                    this.Recalculate();
                }
            }
        }
    },
    Set_ParagraphTabs: function (Tabs) {
        if (true === this.ApplyToAll) {
            for (var Index = 0; Index < this.Content.length; Index++) {
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                if (type_Paragraph == Item.GetType()) {
                    Item.Set_Tabs(Tabs);
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.TurnOff_RecalcEvent();
                        Item.Set_ParagraphTabs(Tabs);
                        Item.TurnOn_RecalcEvent();
                    }
                }
                Item.Set_ApplyToAll(false);
            }
            return;
        }
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.setParagraphTabs(Tabs);
        } else {
            if (this.CurPos.ContentPos < 0) {
                return false;
            }
            if (true === this.Selection.Use) {
                var StartPos = this.Selection.StartPos;
                var EndPos = this.Selection.EndPos;
                if (EndPos < StartPos) {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos = Temp;
                }
                for (var Index = StartPos; Index <= EndPos; Index++) {
                    var Item = this.Content[Index];
                    if (type_Paragraph == Item.GetType()) {
                        Item.Set_Tabs(Tabs);
                    } else {
                        if (type_Table == Item.GetType()) {
                            Item.TurnOff_RecalcEvent();
                            Item.Set_ParagraphTabs(Tabs);
                            Item.TurnOn_RecalcEvent();
                        }
                    }
                }
                this.ContentLastChangePos = StartPos;
                this.Recalculate();
                editor.Update_ParaTab(Default_Tab_Stop, Tabs);
                return;
            }
            var Item = this.Content[this.CurPos.ContentPos];
            if (type_Paragraph == Item.GetType()) {
                Item.Set_Tabs(Tabs);
                this.ContentLastChangePos = this.CurPos.ContentPos;
                this.Recalculate();
                editor.Update_ParaTab(Default_Tab_Stop, Tabs);
            } else {
                if (type_Table == Item.GetType()) {
                    Item.Set_ParagraphTabs(Tabs);
                    editor.Update_ParaTab(Default_Tab_Stop, Tabs);
                }
            }
        }
    },
    Set_ParagraphContextualSpacing: function (Value) {
        if (true === this.ApplyToAll) {
            for (var Index = 0; Index < this.Content.length; Index++) {
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                if (type_Paragraph == Item.GetType()) {
                    Item.Set_ContextualSpacing(Value);
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.TurnOff_RecalcEvent();
                        Item.Set_ParagraphContextualSpacing(Value);
                        Item.TurnOn_RecalcEvent();
                    }
                }
                Item.Set_ApplyToAll(false);
            }
            return;
        }
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.setParagraphContextualSpacing(Value);
        } else {
            if (this.CurPos.ContentPos < 0) {
                return false;
            }
            if (true === this.Selection.Use) {
                var StartPos = this.Selection.StartPos;
                var EndPos = this.Selection.EndPos;
                if (EndPos < StartPos) {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos = Temp;
                }
                for (var Index = StartPos; Index <= EndPos; Index++) {
                    var Item = this.Content[Index];
                    if (type_Paragraph == Item.GetType()) {
                        Item.Set_ContextualSpacing(Value);
                    } else {
                        if (type_Table == Item.GetType()) {
                            Item.TurnOff_RecalcEvent();
                            Item.Set_ParagraphContextualSpacing(Value);
                            Item.TurnOn_RecalcEvent();
                        }
                    }
                }
                this.ContentLastChangePos = StartPos;
                this.Recalculate();
                return;
            }
            var Item = this.Content[this.CurPos.ContentPos];
            if (type_Paragraph == Item.GetType()) {
                Item.Set_ContextualSpacing(Value);
                this.ContentLastChangePos = this.CurPos.ContentPos;
                this.Recalculate();
            } else {
                if (type_Table == Item.GetType()) {
                    Item.Set_ParagraphContextualSpacing(Value);
                }
            }
        }
    },
    Set_ParagraphPageBreakBefore: function (Value) {},
    Set_ParagraphKeepLines: function (Value) {
        if (true === this.ApplyToAll) {
            for (var Index = 0; Index < this.Content.length; Index++) {
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                if (type_Paragraph == Item.GetType()) {
                    Item.Set_KeepLines(Value);
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.TurnOff_RecalcEvent();
                        Item.Set_ParagraphKeepLines(Value);
                        Item.TurnOn_RecalcEvent();
                    }
                }
                Item.Set_ApplyToAll(false);
            }
            return;
        }
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.setParagraphKeepLines(Value);
        } else {
            if (this.CurPos.ContentPos < 0) {
                return false;
            }
            if (true === this.Selection.Use) {
                var StartPos = this.Selection.StartPos;
                var EndPos = this.Selection.EndPos;
                if (EndPos < StartPos) {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos = Temp;
                }
                for (var Index = StartPos; Index <= EndPos; Index++) {
                    var Item = this.Content[Index];
                    if (type_Paragraph == Item.GetType()) {
                        Item.Set_KeepLines(Value);
                    } else {
                        if (type_Table == Item.GetType()) {
                            Item.TurnOff_RecalcEvent();
                            Item.Set_ParagraphKeepLines(Value);
                            Item.TurnOn_RecalcEvent();
                        }
                    }
                }
                this.ContentLastChangePos = StartPos;
                this.Recalculate();
                return;
            }
            var Item = this.Content[this.CurPos.ContentPos];
            if (type_Paragraph == Item.GetType()) {
                Item.Set_KeepLines(Value);
                this.ContentLastChangePos = this.CurPos.ContentPos;
                this.Recalculate();
            } else {
                if (type_Table == Item.GetType()) {
                    Item.Set_ParagraphKeepLines(Value);
                }
            }
        }
    },
    Set_ParagraphKeepNext: function (Value) {
        if (true === this.ApplyToAll) {
            for (var Index = 0; Index < this.Content.length; Index++) {
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                if (type_Paragraph == Item.GetType()) {
                    Item.Set_KeepNext(Value);
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.TurnOff_RecalcEvent();
                        Item.Set_ParagraphKeepNext(Value);
                        Item.TurnOn_RecalcEvent();
                    }
                }
                Item.Set_ApplyToAll(false);
            }
            return;
        }
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.setParagraphKeepNext(Value);
        } else {
            if (this.CurPos.ContentPos < 0) {
                return false;
            }
            if (true === this.Selection.Use) {
                var StartPos = this.Selection.StartPos;
                var EndPos = this.Selection.EndPos;
                if (EndPos < StartPos) {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos = Temp;
                }
                for (var Index = StartPos; Index <= EndPos; Index++) {
                    var Item = this.Content[Index];
                    if (type_Paragraph == Item.GetType()) {
                        Item.Set_KeepNext(Value);
                    } else {
                        if (type_Table == Item.GetType()) {
                            Item.TurnOff_RecalcEvent();
                            Item.Set_ParagraphKeepNext(Value);
                            Item.TurnOn_RecalcEvent();
                        }
                    }
                }
                this.ContentLastChangePos = StartPos;
                this.Recalculate();
                return;
            }
            var Item = this.Content[this.CurPos.ContentPos];
            if (type_Paragraph == Item.GetType()) {
                Item.Set_KeepNext(Value);
                this.ContentLastChangePos = this.CurPos.ContentPos;
                this.Recalculate();
            } else {
                if (type_Table == Item.GetType()) {
                    Item.Set_ParagraphKeepNext(Value);
                }
            }
        }
    },
    Set_ParagraphWidowControl: function (Value) {
        if (true === this.ApplyToAll) {
            for (var Index = 0; Index < this.Content.length; Index++) {
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                if (type_Paragraph == Item.GetType()) {
                    Item.Set_WidowControl(Value);
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.TurnOff_RecalcEvent();
                        Item.Set_ParagraphWidowControl(Value);
                        Item.TurnOn_RecalcEvent();
                    }
                }
                Item.Set_ApplyToAll(false);
            }
            return;
        }
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.setParagraphWidowControl(Value);
        } else {
            if (this.CurPos.ContentPos < 0) {
                return false;
            }
            if (true === this.Selection.Use) {
                var StartPos = this.Selection.StartPos;
                var EndPos = this.Selection.EndPos;
                if (EndPos < StartPos) {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos = Temp;
                }
                for (var Index = StartPos; Index <= EndPos; Index++) {
                    var Item = this.Content[Index];
                    if (type_Paragraph == Item.GetType()) {
                        Item.Set_WidowControl(Value);
                    } else {
                        if (type_Table == Item.GetType()) {
                            Item.TurnOff_RecalcEvent();
                            Item.Set_ParagraphWidowControl(Value);
                            Item.TurnOn_RecalcEvent();
                        }
                    }
                }
                this.ContentLastChangePos = StartPos;
                this.Recalculate();
                return;
            }
            var Item = this.Content[this.CurPos.ContentPos];
            if (type_Paragraph == Item.GetType()) {
                Item.Set_WidowControl(Value);
                this.ContentLastChangePos = this.CurPos.ContentPos;
                this.Recalculate();
            } else {
                if (type_Table == Item.GetType()) {
                    Item.Set_ParagraphWidowControl(Value);
                }
            }
        }
    },
    Set_ParagraphBorders: function (Borders) {
        if (true === this.ApplyToAll) {
            for (var Index = 0; Index < this.Content.length; Index++) {
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                if (type_Paragraph == Item.GetType()) {
                    Item.Set_Borders(Borders);
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.TurnOff_RecalcEvent();
                        Item.Set_ParagraphBorders(Borders);
                        Item.TurnOn_RecalcEvent();
                    }
                }
                Item.Set_ApplyToAll(false);
            }
            return;
        }
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.setParagraphBorders(Borders);
        } else {
            if (this.CurPos.ContentPos < 0) {
                return false;
            }
            if (true === this.Selection.Use) {
                switch (this.Selection.Flag) {
                case selectionflag_Common:
                    var StartPos = this.Selection.StartPos;
                    var EndPos = this.Selection.EndPos;
                    if (EndPos < StartPos) {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos = Temp;
                    }
                    for (var Index = StartPos; Index <= EndPos; Index++) {
                        var Item = this.Content[Index];
                        if (type_Paragraph == Item.GetType()) {
                            Item.Set_Borders(Borders);
                        } else {
                            if (type_Table == Item.GetType()) {
                                Item.TurnOff_RecalcEvent();
                                Item.Set_ParagraphBorders(Borders);
                                Item.TurnOn_RecalcEvent();
                            }
                        }
                    }
                    this.Recalculate();
                    return;
                case selectionflag_Numbering:
                    break;
                }
                return;
            }
            var Item = this.Content[this.CurPos.ContentPos];
            if (type_Paragraph == Item.GetType()) {
                var StartPos = Item.Index;
                var EndPos = Item.Index;
                var CurBrd = Item.Get_CompiledPr().ParaPr.Brd;
                while (true != CurBrd.First) {
                    StartPos--;
                    if (StartPos < 0) {
                        StartPos = 0;
                        break;
                    }
                    var TempItem = this.Content[StartPos];
                    if (type_Paragraph != TempItem.GetType()) {
                        StartPos++;
                        break;
                    }
                    CurBrd = TempItem.Get_CompiledPr().ParaPr.Brd;
                }
                CurBrd = Item.Get_CompiledPr().ParaPr.Brd;
                while (true != CurBrd.Last) {
                    EndPos++;
                    if (EndPos >= this.Content.length) {
                        EndPos = this.Content.length - 1;
                        break;
                    }
                    var TempItem = this.Content[EndPos];
                    if (type_Paragraph != TempItem.GetType()) {
                        EndPos--;
                        break;
                    }
                    CurBrd = TempItem.Get_CompiledPr().ParaPr.Brd;
                }
                for (var Index = StartPos; Index <= EndPos; Index++) {
                    this.Content[Index].Set_Borders(Borders);
                }
                this.Recalculate();
            } else {
                if (type_Table == Item.GetType()) {
                    Item.Set_ParagraphBorders(Borders);
                }
            }
        }
    },
    Paragraph_IncDecFontSize: function (bIncrease) {
        if (true === this.ApplyToAll) {
            for (var Index = 0; Index < this.Content.length; Index++) {
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                if (type_Paragraph == Item.GetType()) {
                    Item.IncDec_FontSize(bIncrease);
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.TurnOff_RecalcEvent();
                        Item.Paragraph_IncDecFontSize(bIncrease);
                        Item.TurnOn_RecalcEvent();
                    }
                }
                Item.Set_ApplyToAll(false);
            }
            return;
        }
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.paragraphIncDecFontSize(bIncrease);
        } else {
            if (this.CurPos.ContentPos < 0) {
                return false;
            }
            if (true === this.Selection.Use) {
                switch (this.Selection.Flag) {
                case selectionflag_Common:
                    var StartPos = this.Selection.StartPos;
                    var EndPos = this.Selection.EndPos;
                    if (EndPos < StartPos) {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos = Temp;
                    }
                    for (var Index = StartPos; Index <= EndPos; Index++) {
                        var Item = this.Content[Index];
                        if (type_Paragraph == Item.GetType()) {
                            Item.IncDec_FontSize(bIncrease);
                        } else {
                            if (type_Table == Item.GetType()) {
                                Item.TurnOff_RecalcEvent();
                                Item.Paragraph_IncDecFontSize(bIncrease);
                                Item.TurnOn_RecalcEvent();
                            }
                        }
                    }
                    this.ContentLastChangePos = StartPos;
                    this.Recalculate();
                    return;
                case selectionflag_Numbering:
                    break;
                }
                return;
            }
            var Item = this.Content[this.CurPos.ContentPos];
            if (type_Paragraph == Item.GetType()) {
                if (true === Item.IncDec_FontSize(bIncrease)) {
                    this.ContentLastChangePos = this.CurPos.ContentPos;
                    this.Recalculate();
                }
            } else {
                if (type_Table == Item.GetType()) {
                    Item.Paragraph_IncDecFontSize(bIncrease);
                }
            }
        }
    },
    Paragraph_IncDecIndent: function (bIncrease) {
        if (true === this.ApplyToAll) {
            for (var Index = 0; Index < this.Content.length; Index++) {
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                if (type_Paragraph == Item.GetType()) {
                    Item.IncDec_Indent(bIncrease);
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.TurnOff_RecalcEvent();
                        Item.Paragraph_IncDecIndent(bIncrease);
                        Item.TurnOn_RecalcEvent();
                    }
                }
                Item.Set_ApplyToAll(false);
            }
            return;
        }
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            if (true != this.LogicDocument.DrawingObjects.isSelectedText()) {
                var ParaDrawing = this.LogicDocument.DrawingObjects.getMajorParaDrawing();
                if (null != ParaDrawing) {
                    var Paragraph = ParaDrawing.Parent;
                    Paragraph.IncDec_Indent(bIncrease);
                    this.Recalculate();
                }
            } else {
                this.DrawingObjects.paragraphIncDecIndent(bIncrease);
            }
            return;
        } else {
            if (this.CurPos.ContentPos < 0) {
                return false;
            }
            if (true === this.Selection.Use) {
                switch (this.Selection.Flag) {
                case selectionflag_Common:
                    var StartPos = this.Selection.StartPos;
                    var EndPos = this.Selection.EndPos;
                    if (EndPos < StartPos) {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos = Temp;
                    }
                    for (var Index = StartPos; Index <= EndPos; Index++) {
                        var Item = this.Content[Index];
                        if (type_Paragraph == Item.GetType()) {
                            Item.IncDec_Indent(bIncrease);
                        } else {
                            if (type_Table == Item.GetType()) {
                                Item.TurnOff_RecalcEvent();
                                Item.Paragraph_IncDecIndent(bIncrease);
                                Item.TurnOn_RecalcEvent();
                            }
                        }
                    }
                    this.ContentLastChangePos = StartPos;
                    this.Recalculate();
                    return;
                case selectionflag_Numbering:
                    break;
                }
                return;
            }
            var Item = this.Content[this.CurPos.ContentPos];
            if (type_Paragraph == Item.GetType()) {
                Item.IncDec_Indent(bIncrease);
                this.ContentLastChangePos = this.CurPos.ContentPos;
                this.Recalculate();
            } else {
                if (type_Table == Item.GetType()) {
                    Item.Paragraph_IncDecIndent(bIncrease);
                }
            }
        }
    },
    Paragraph_Format_Paste: function (TextPr, ParaPr, ApplyPara) {
        if (true === this.ApplyToAll) {
            for (var Index = 0; Index < this.Content.length; Index++) {
                var Item = this.Content[Index];
                Item.Set_ApplyToAll(true);
                if (type_Paragraph == Item.GetType()) {
                    Item.Paragraph_Format_Paste(TextPr, ParaPr, true);
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.TurnOff_RecalcEvent();
                        Item.Paragraph_Format_Paste(TextPr, ParaPr, true);
                        Item.TurnOn_RecalcEvent();
                    }
                }
                Item.Set_ApplyToAll(false);
            }
            return;
        }
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.paragraphFormatPaste(TextPr, ParaPr, ApplyPara);
        } else {
            if (true === this.Selection.Use) {
                switch (this.Selection.Flag) {
                case selectionflag_Numbering:
                    return;
                case selectionflag_Common:
                    var Start = this.Selection.StartPos;
                    var End = this.Selection.EndPos;
                    if (Start > End) {
                        Start = this.Selection.EndPos;
                        End = this.Selection.StartPos;
                    }
                    for (var Pos = Start; Pos <= End; Pos++) {
                        this.Content[Pos].Paragraph_Format_Paste(TextPr, ParaPr, (Start === End ? false : true));
                    }
                    this.Recalculate();
                    break;
                }
            } else {
                this.Content[this.CurPos.ContentPos].Paragraph_Format_Paste(TextPr, ParaPr, true);
                this.Recalculate();
            }
        }
    },
    Set_ImageProps: function (Props) {
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            this.LogicDocument.DrawingObjects.setProps(Props);
            this.Document_UpdateInterfaceState();
        } else {
            if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
                if (true == this.Selection.Use) {
                    this.Content[this.Selection.StartPos].Set_ImageProps(Props);
                } else {
                    this.Content[this.CurPos.ContentPos].Set_ImageProps(Props);
                }
            }
        }
    },
    Set_TableProps: function (Props) {
        if (true === this.ApplyToAll) {
            return false;
        }
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.setTableProps(Props);
        } else {
            var Pos = -1;
            if (true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) {
                Pos = this.Selection.StartPos;
            } else {
                if (false === this.Selection.Use && type_Table === this.Content[this.CurPos.ContentPos].GetType()) {
                    Pos = this.CurPos.ContentPos;
                }
            }
            if (-1 != Pos) {
                var Table = this.Content[Pos];
                return Table.Set_Props(Props);
            }
            return false;
        }
    },
    Get_Paragraph_ParaPr: function () {
        var Result_ParaPr = new CParaPr();
        if (true === this.ApplyToAll) {
            var StartPr, Pr;
            if (type_Paragraph == this.Content[0].GetType()) {
                StartPr = this.Content[0].Get_CompiledPr2().ParaPr;
                Pr = StartPr.Copy();
                Pr.Locked = this.Content[0].Lock.Is_Locked();
            } else {
                if (type_Table == this.Content[0].GetType()) {
                    StartPr = this.Content[0].Get_Paragraph_ParaPr();
                    Pr = StartPr.Copy();
                    Pr.Locked = StartPr.Locked;
                }
            }
            for (var Index = 1; Index < this.Content.length; Index++) {
                var Item = this.Content[Index];
                var TempPr;
                if (type_Paragraph == Item.GetType()) {
                    TempPr = Item.Get_CompiledPr2(false).ParaPr.Copy();
                    TempPr.Locked = Item.Lock.Is_Locked();
                } else {
                    if (type_Table == Item.GetType()) {
                        TempPr = Item.Get_Paragraph_ParaPr();
                    }
                }
                Pr = Pr.Compare(TempPr);
            }
            if (Pr.Ind.Left == UnknownValue) {
                Pr.Ind.Left = StartPr.Ind.Left;
            }
            if (Pr.Ind.Right == UnknownValue) {
                Pr.Ind.Right = StartPr.Ind.Right;
            }
            if (Pr.Ind.FirstLine == UnknownValue) {
                Pr.Ind.FirstLine = StartPr.Ind.FirstLine;
            }
            Result_ParaPr = Pr;
            Result_ParaPr.CanAddTable = (true === Pr.Locked ? false : true);
            return Result_ParaPr;
        }
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.getParagraphParaPr();
        } else {
            if (true === this.Selection.Use && selectionflag_Common === this.Selection.Flag) {
                var StartPos = this.Selection.StartPos;
                var EndPos = this.Selection.EndPos;
                if (EndPos < StartPos) {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos = Temp;
                }
                var StartPr, Pr;
                if (type_Paragraph == this.Content[StartPos].GetType()) {
                    StartPr = this.Content[StartPos].Get_CompiledPr2(false).ParaPr;
                    Pr = StartPr.Copy();
                    Pr.Locked = this.Content[StartPos].Lock.Is_Locked();
                } else {
                    if (type_Table == this.Content[StartPos].GetType()) {
                        StartPr = this.Content[StartPos].Get_Paragraph_ParaPr();
                        Pr = StartPr.Copy();
                        Pr.Locked = StartPr.Locked;
                    }
                }
                for (var Index = StartPos + 1; Index <= EndPos; Index++) {
                    var Item = this.Content[Index];
                    var TempPr;
                    if (type_Paragraph == Item.GetType()) {
                        TempPr = Item.Get_CompiledPr2(false).ParaPr;
                        TempPr.Locked = Item.Lock.Is_Locked();
                    } else {
                        if (type_Table == Item.GetType()) {
                            TempPr = Item.Get_Paragraph_ParaPr();
                        }
                    }
                    Pr = Pr.Compare(TempPr);
                }
                if (undefined === Pr.Ind.Left) {
                    Pr.Ind.Left = StartPr.Ind.Left;
                }
                if (undefined === Pr.Ind.Right) {
                    Pr.Ind.Right = StartPr.Ind.Right;
                }
                if (undefined === Pr.Ind.FirstLine) {
                    Pr.Ind.FirstLine = StartPr.Ind.FirstLine;
                }
                Result_ParaPr = Pr;
                Result_ParaPr.CanAddTable = (true === Locked ? false : true);
            } else {
                var Item = this.Content[this.CurPos.ContentPos];
                if (type_Paragraph == Item.GetType()) {
                    var ParaPr = Item.Get_CompiledPr2(false).ParaPr;
                    var Locked = Item.Lock.Is_Locked();
                    Result_ParaPr = ParaPr.Copy();
                    Result_ParaPr.Locked = Locked;
                    Result_ParaPr.CanAddTable = ((true === Locked) ? ((true === Item.Cursor_IsEnd()) ? true : false) : true);
                } else {
                    if (type_Table == Item.GetType()) {
                        Result_ParaPr = Item.Get_Paragraph_ParaPr();
                    }
                }
            }
            return Result_ParaPr;
        }
    },
    Get_Paragraph_TextPr: function () {
        var Result_TextPr = null;
        if (true === this.ApplyToAll) {
            var VisTextPr;
            this.Content[0].Set_ApplyToAll(true);
            if (type_Paragraph == this.Content[0].GetType()) {
                VisTextPr = this.Content[0].Selection_CalculateTextPr();
            } else {
                if (type_Table == this.Content[0].GetType()) {
                    VisTextPr = this.Content[0].Get_Paragraph_TextPr();
                }
            }
            this.Content[0].Set_ApplyToAll(false);
            for (var Index = 1; Index < this.Content.length; Index++) {
                var Item = this.Content[Index];
                var CurPr;
                Item.Set_ApplyToAll(true);
                if (type_Paragraph == Item.GetType()) {
                    CurPr = Item.Selection_CalculateTextPr();
                } else {
                    if (type_Table == Item.GetType()) {
                        CurPr = Item.Get_Paragraph_TextPr();
                    }
                }
                Item.Set_ApplyToAll(false);
                VisTextPr = VisTextPr.Compare(CurPr);
            }
            Result_TextPr = VisTextPr;
            return Result_TextPr;
        }
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.getParagraphTextPr();
        } else {
            if (true === this.Selection.Use) {
                var VisTextPr;
                switch (this.Selection.Flag) {
                case selectionflag_Common:
                    var StartPos = this.Selection.StartPos;
                    var EndPos = this.Selection.EndPos;
                    if (EndPos < StartPos) {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos = Temp;
                    }
                    if (type_Paragraph == this.Content[StartPos].GetType()) {
                        VisTextPr = this.Content[StartPos].Selection_CalculateTextPr();
                    } else {
                        if (type_Table == this.Content[StartPos].GetType()) {
                            VisTextPr = this.Content[StartPos].Get_Paragraph_TextPr();
                        }
                    }
                    for (var Index = StartPos + 1; Index <= EndPos; Index++) {
                        var Item = this.Content[Index];
                        var CurPr;
                        if (type_Paragraph == Item.GetType()) {
                            CurPr = Item.Selection_CalculateTextPr();
                        } else {
                            if (type_Table == Item.GetType()) {
                                CurPr = Item.Get_Paragraph_TextPr();
                            }
                        }
                        VisTextPr = VisTextPr.Compare(CurPr);
                    }
                    break;
                case selectionflag_Numbering:
                    if (null == this.Selection.Data || this.Selection.Data.length <= 0) {
                        break;
                    }
                    var CurPara = this.Content[this.Selection.Data[0]];
                    for (var Index = 0; Index < this.Selection.Data.length; Index++) {
                        if (this.CurPos.ContentPos === this.Selection.Data[Index]) {
                            CurPara = this.Content[this.Selection.Data[Index]];
                        }
                    }
                    VisTextPr = CurPara.Internal_Get_NumberingTextPr();
                    break;
                }
                Result_TextPr = VisTextPr;
            } else {
                var Item = this.Content[this.CurPos.ContentPos];
                if (type_Paragraph == Item.GetType()) {
                    Result_TextPr = Item.Internal_CalculateTextPr(Item.CurPos.ContentPos - 1);
                } else {
                    if (type_Table == Item.GetType()) {
                        Result_TextPr = Item.Get_Paragraph_TextPr();
                    }
                }
            }
            return Result_TextPr;
        }
    },
    Get_Paragraph_TextPr_Copy: function () {
        var Result_TextPr = null;
        if (true === this.ApplyToAll) {
            var Item = this.Content[0];
            if (type_Paragraph == Item.GetType()) {
                Item.Cursor_MoveToStartPos();
                Result_TextPr = Item.Internal_CalculateTextPr(Item.CurPos.ContentPos - 1);
            } else {
                if (type_Table == Item.GetType()) {
                    Result_TextPr = Item.Get_Paragraph_TextPr_Copy();
                }
            }
            return Result_TextPr;
        }
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.getParagraphTextPrCopy();
        } else {
            if (true === this.Selection.Use) {
                var VisTextPr;
                switch (this.Selection.Flag) {
                case selectionflag_Common:
                    var StartPos = this.Selection.StartPos;
                    if (this.Selection.EndPos < StartPos) {
                        StartPos = this.Selection.EndPos;
                    }
                    var Item = this.Content[StartPos];
                    if (type_Paragraph == Item.GetType()) {
                        var StartPos_item = Item.Selection.StartPos;
                        if (Item.Selection.EndPos < StartPos_item) {
                            StartPos_item = Item.Selection.EndPos;
                        }
                        VisTextPr = Item.Internal_CalculateTextPr(StartPos_item - 1);
                    } else {
                        if (type_Table == Item.GetType()) {
                            VisTextPr = Item.Get_Paragraph_TextPr_Copy();
                        }
                    }
                    break;
                case selectionflag_Numbering:
                    if (null == this.Selection.Data || this.Selection.Data.length <= 0) {
                        break;
                    }
                    var NumPr = this.Content[this.Selection.Data[0]].Numbering_Get();
                    VisTextPr = this.Numbering.Get_AbstractNum(NumPr.NumId).Lvl[NumPr.Lvl].TextPr;
                    break;
                }
                Result_TextPr = VisTextPr;
            } else {
                var Item = this.Content[this.CurPos.ContentPos];
                if (type_Paragraph == Item.GetType()) {
                    Result_TextPr = Item.Internal_CalculateTextPr(Item.CurPos.ContentPos - 1);
                } else {
                    if (type_Table == Item.GetType()) {
                        Result_TextPr = Item.Get_Paragraph_TextPr_Copy();
                    }
                }
            }
            return Result_TextPr;
        }
    },
    Get_Paragraph_ParaPr_Copy: function () {
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.getParagraphParaPrCopy();
        } else {
            var Result_ParaPr = null;
            if (docpostype_Content == this.CurPos.Type) {
                if (true === this.Selection.Use) {
                    switch (this.Selection.Flag) {
                    case selectionflag_Common:
                        var StartPos = this.Selection.StartPos;
                        if (this.Selection.EndPos < StartPos) {
                            StartPos = this.Selection.EndPos;
                        }
                        var Item = this.Content[StartPos];
                        Result_ParaPr = Item.Get_Paragraph_ParaPr_Copy();
                        break;
                    case selectionflag_Numbering:
                        if (null == this.Selection.Data || this.Selection.Data.length <= 0) {
                            break;
                        }
                        var NumPr = this.Content[this.Selection.Data[0]].Numbering_Get();
                        Result_ParaPr = this.Numbering.Get_AbstractNum(NumPr.NumId).Lvl[NumPr.Lvl].ParaPr;
                        break;
                    }
                } else {
                    var Item = this.Content[this.CurPos.ContentPos];
                    Result_ParaPr = Item.Get_Paragraph_ParaPr_Copy();
                }
            }
            return Result_ParaPr;
        }
    },
    Interface_Update_ParaPr: function () {
        var ParaPr = this.Get_Paragraph_ParaPr();
        if (null != ParaPr) {
            ParaPr.CanAddDropCap = false;
            if (undefined != ParaPr.Tabs) {
                editor.Update_ParaTab(Default_Tab_Stop, ParaPr.Tabs);
            }
            editor.UpdateParagraphProp(ParaPr);
        }
    },
    Interface_Update_TextPr: function () {
        var TextPr = this.Get_Paragraph_TextPr();
        if (null != TextPr) {
            editor.UpdateTextPr(TextPr);
        }
    },
    Interface_Update_DrawingPr: function (Flag) {
        var ImagePr = new Object();
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            ImagePr = this.LogicDocument.DrawingObjects.getProps();
        }
        if (true === Flag) {
            return ImagePr;
        } else {
            editor.sync_ImgPropCallback(ImagePr);
        }
    },
    Interface_Update_TablePr: function (Flag) {
        var TablePr = null;
        if (docpostype_DrawingObjects == this.CurPos.Type) {
            TablePr = this.LogicDocument.DrawingObjects.getTableProps();
        } else {
            if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
                if (true == this.Selection.Use) {
                    TablePr = this.Content[this.Selection.StartPos].Get_Props();
                } else {
                    TablePr = this.Content[this.CurPos.ContentPos].Get_Props();
                }
            }
        }
        if (true === Flag) {
            return TablePr;
        } else {
            if (null != TablePr) {
                editor.sync_TblPropCallback(TablePr);
            }
        }
    },
    Selection_Remove: function () {
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.resetSelection();
        } else {
            if (true === this.Selection.Use) {
                switch (this.Selection.Flag) {
                case selectionflag_Common:
                    var Start = this.Selection.StartPos;
                    var End = this.Selection.EndPos;
                    if (Start > End) {
                        var Temp = Start;
                        Start = End;
                        End = Temp;
                    }
                    Start = Math.max(0, Start);
                    End = Math.min(this.Content.length - 1, End);
                    for (var Index = Start; Index <= End; Index++) {
                        this.Content[Index].Selection_Remove();
                    }
                    this.Selection.Use = false;
                    this.Selection.Start = false;
                    break;
                case selectionflag_Numbering:
                    if (null == this.Selection.Data) {
                        break;
                    }
                    for (var Index = 0; Index < this.Selection.Data.length; Index++) {
                        this.Content[this.Selection.Data[Index]].Selection_Remove();
                    }
                    this.Selection.Use = false;
                    this.Selection.Start = false;
                    this.Selection.Flag = selectionflag_Common;
                    break;
                }
            }
            this.Selection.StartPos = 0;
            this.Selection.EndPos = 0;
        }
    },
    Selection_Draw_Page: function (Page_abs) {
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            this.LogicDocument.DrawingObjects.drawSelectionPage(Page_abs);
        } else {
            var CurPage = Page_abs - this.Get_StartPage_Absolute();
            if (CurPage < 0 || CurPage >= this.Pages.length) {
                return;
            }
            var Pos_start = this.Pages[CurPage].Pos;
            var Pos_end = this.Pages[CurPage].EndPos;
            if (true === this.Selection.Use) {
                switch (this.Selection.Flag) {
                case selectionflag_Common:
                    var Start = this.Selection.StartPos;
                    var End = this.Selection.EndPos;
                    if (Start > End) {
                        Start = this.Selection.EndPos;
                        End = this.Selection.StartPos;
                    }
                    var Start = Math.max(Start, Pos_start);
                    var End = Math.min(End, Pos_end);
                    for (var Index = Start; Index <= End; Index++) {
                        this.Content[Index].Selection_Draw_Page(Page_abs);
                    }
                    break;
                case selectionflag_Numbering:
                    if (null == this.Selection.Data) {
                        break;
                    }
                    var Count = this.Selection.Data.length;
                    for (var Index = 0; Index < Count; Index++) {
                        if (this.Selection.Data[Index] <= Pos_end && this.Selection.Data[Index] >= Pos_start) {
                            this.Content[this.Selection.Data[Index]].Selection_Draw_Page(Page_abs);
                        }
                    }
                    break;
                }
            }
        }
    },
    Selection_Clear: function () {
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.resetSelection();
        } else {
            if (true === this.Selection.Use) {
                switch (this.Selection.Flag) {
                case selectionflag_Common:
                    var Start = this.Selection.StartPos;
                    var End = this.Selection.EndPos;
                    if (Start > End) {
                        var Temp = Start;
                        Start = End;
                        End = Temp;
                    }
                    for (var Index = Start; Index <= End; Index++) {
                        this.Content[Index].Selection_Clear();
                    }
                    break;
                case selectionflag_Numbering:
                    if (null == this.Selection.Data) {
                        break;
                    }
                    for (var Index = 0; Index < this.Selection.Data.length; Index++) {
                        this.Content[this.Selection.Data[Index]].Selection_Clear();
                    }
                    break;
                }
            }
        }
    },
    Selection_SetStart: function (X, Y, PageIndex, MouseEvent) {
        if (PageIndex - this.StartPage >= this.Pages.length) {
            return;
        }
        this.CurPage = PageIndex - this.StartPage;
        var bInText = (null === this.Is_InText(X, Y, this.CurPage + this.Get_StartPage_Absolute()) ? false : true);
        var bTableBorder = (null === this.Is_TableBorder(X, Y, this.CurPage + this.Get_StartPage_Absolute()) ? false : true);
        var nInDrawing = this.LogicDocument.DrawingObjects.isPointInDrawingObjects(X, Y, this.CurPage + this.Get_StartPage_Absolute(), this);
        if (this.Parent instanceof CHeaderFooter && (nInDrawing === DRAWING_ARRAY_TYPE_BEFORE || nInDrawing === DRAWING_ARRAY_TYPE_INLINE || (false === bTableBorder && false === bInText && nInDrawing >= 0))) {
            if (docpostype_DrawingObjects != this.CurPos.Type) {
                this.Selection_Remove();
            }
            this.DrawingDocument.TargetEnd();
            this.DrawingDocument.SetCurrentPage(this.CurPage + this.Get_StartPage_Absolute());
            var HdrFtr = this.Is_HdrFtr(true);
            if (null === HdrFtr) {
                this.LogicDocument.Selection.Use = true;
                this.LogicDocument.Selection.Start = true;
                this.LogicDocument.Selection.Flag = selectionflag_Common;
                this.LogicDocument.CurPos.Type = docpostype_DrawingObjects;
            } else {
                HdrFtr.Content.Selection.Use = true;
                HdrFtr.Content.Selection.Start = true;
                HdrFtr.Content.Selection.Flag = selectionflag_Common;
                HdrFtr.Content.CurPos.Type = docpostype_DrawingObjects;
            }
            this.LogicDocument.DrawingObjects.OnMouseDown(MouseEvent, X, Y, this.CurPage + this.Get_StartPage_Absolute());
        } else {
            var bOldSelectionIsCommon = true;
            if (docpostype_DrawingObjects === this.CurPos.Type && true != this.Is_InDrawing(X, Y, this.CurPage + this.Get_StartPage_Absolute())) {
                this.LogicDocument.DrawingObjects.resetSelection();
                bOldSelectionIsCommon = false;
            }
            var ContentPos = this.Internal_GetContentPosByXY(X, Y);
            if (docpostype_Content != this.CurPos.Type) {
                this.CurPos.Type = docpostype_Content;
                this.CurPos.ContentPos = ContentPos;
                bOldSelectionIsCommon = false;
            }
            var SelectionUse_old = this.Selection.Use;
            var Item = this.Content[ContentPos];
            var bTableBorder = false;
            if (type_Table == Item.GetType()) {
                bTableBorder = (null != Item.Is_TableBorder(X, Y, this.CurPage + this.Get_StartPage_Absolute()) ? true : false);
            }
            if (! (true === SelectionUse_old && true === MouseEvent.ShiftKey && true === bOldSelectionIsCommon)) {
                if ((selectionflag_Common != this.Selection.Flag) || (true === this.Selection.Use && MouseEvent.ClickCount <= 1 && true != bTableBorder)) {
                    this.Selection_Remove();
                }
            }
            this.Selection.Use = true;
            this.Selection.Start = true;
            this.Selection.Flag = selectionflag_Common;
            if (true === SelectionUse_old && true === MouseEvent.ShiftKey && true === bOldSelectionIsCommon) {
                this.Selection_SetEnd(X, Y, {
                    Type: g_mouse_event_type_up,
                    ClickCount: 1
                });
                this.Selection.Use = true;
                this.Selection.Start = true;
                this.Selection.EndPos = ContentPos;
                this.Selection.Data = null;
            } else {
                Item.Selection_SetStart(X, Y, this.CurPage, MouseEvent);
                Item.Selection_SetEnd(X, Y, this.CurPage, {
                    Type: g_mouse_event_type_move,
                    ClickCount: 1
                });
                if (! (type_Table == Item.GetType() && true == bTableBorder)) {
                    this.Selection.Use = true;
                    this.Selection.StartPos = ContentPos;
                    this.Selection.EndPos = ContentPos;
                    this.Selection.Data = null;
                    this.CurPos.ContentPos = ContentPos;
                    if (type_Paragraph === Item.GetType() && true === MouseEvent.CtrlKey) {
                        var Hyperlink = Item.Check_Hyperlink(X, Y, this.CurPage);
                        if (null != Hyperlink) {
                            this.Selection.Data = {
                                Hyperlink: true,
                                Value: Hyperlink
                            };
                        }
                    }
                } else {
                    this.Selection.Data = {
                        TableBorder: true,
                        Pos: ContentPos,
                        Selection: SelectionUse_old
                    };
                }
            }
        }
    },
    Selection_SetEnd: function (X, Y, PageIndex, MouseEvent) {
        if (PageIndex - this.StartPage >= this.Pages.length) {
            return;
        }
        this.CurPage = PageIndex - this.StartPage;
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            if (g_mouse_event_type_up == MouseEvent.Type) {
                this.LogicDocument.DrawingObjects.OnMouseUp(MouseEvent, X, Y, this.CurPage + this.Get_StartPage_Absolute());
                this.Selection.Start = false;
                this.Selection.Use = true;
            } else {
                this.LogicDocument.DrawingObjects.OnMouseMove(MouseEvent, X, Y, this.CurPage + this.Get_StartPage_Absolute());
            }
            return;
        }
        if (selectionflag_Numbering === this.Selection.Flag) {
            return;
        }
        if (null != this.Selection.Data && true === this.Selection.Data.TableBorder && type_Table == this.Content[this.Selection.Data.Pos].GetType()) {
            var Item = this.Content[this.Selection.Data.Pos];
            Item.Selection_SetEnd(X, Y, this.CurPage, MouseEvent);
            if (g_mouse_event_type_up == MouseEvent.Type) {
                this.Selection.Start = false;
                if (true != this.Selection.Data.Selection) {
                    this.Selection.Use = false;
                }
                this.Selection.Data = null;
            }
            return;
        }
        if (false === this.Selection.Use) {
            return;
        }
        var ContentPos = this.Internal_GetContentPosByXY(X, Y);
        this.Selection_Clear();
        var OldPos = this.CurPos.ContentPos;
        var OldInnerPos = null;
        if (type_Paragraph === this.Content[OldPos].GetType()) {
            OldInnerPos = this.Content[OldPos].CurPos.ContentPos;
        } else {
            OldInnerPos = this.Content[OldPos].CurCell;
        }
        this.CurPos.ContentPos = ContentPos;
        var OldEndPos = this.Selection.EndPos;
        this.Selection.EndPos = ContentPos;
        if (OldEndPos < this.Selection.StartPos && OldEndPos < this.Selection.EndPos) {
            var TempLimit = Math.min(this.Selection.StartPos, this.Selection.EndPos);
            for (var Index = OldEndPos; Index < TempLimit; Index++) {
                this.Content[Index].Selection.Use = false;
                this.Content[Index].Selection.Start = false;
            }
        } else {
            if (OldEndPos > this.Selection.StartPos && OldEndPos > this.Selection.EndPos) {
                var TempLimit = Math.max(this.Selection.StartPos, this.Selection.EndPos);
                for (var Index = TempLimit + 1; Index <= OldEndPos; Index++) {
                    this.Content[Index].Selection.Use = false;
                    this.Content[Index].Selection.Start = false;
                }
            }
        }
        var Direction = (ContentPos > this.Selection.StartPos ? 1 : (ContentPos < this.Selection.StartPos ? -1 : 0));
        if (g_mouse_event_type_up == MouseEvent.Type) {
            this.Selection.Start = false;
            if (0 != Direction) {
                this.Content[this.Selection.StartPos].Selection_Stop(X, Y, this.CurPage, MouseEvent);
            }
        }
        var Start, End;
        if (0 == Direction) {
            var Item = this.Content[this.Selection.StartPos];
            var ItemType = Item.GetType();
            Item.Selection_SetEnd(X, Y, this.CurPage, MouseEvent);
            if (false === Item.Selection.Use) {
                this.Selection.Use = false;
                if (null != this.Selection.Data && true === this.Selection.Data.Hyperlink) {
                    editor.sync_HyperlinkClickCallback(this.Selection.Data.Value.Get_Value());
                    this.Selection.Data.Value.Set_Visited(true);
                    for (var PageIdx = Item.Get_StartPage_Absolute(); PageIdx < Item.Get_StartPage_Absolute() + Item.Pages.length; PageIdx++) {
                        this.DrawingDocument.OnRecalculatePage(PageIdx, this.DrawingDocument.m_oLogicDocument.Pages[PageIdx]);
                    }
                    this.DrawingDocument.OnEndRecalculate(false, true);
                }
            } else {
                this.Selection.Use = true;
            }
            return;
        } else {
            if (Direction > 0) {
                Start = this.Selection.StartPos;
                End = this.Selection.EndPos;
            } else {
                End = this.Selection.StartPos;
                Start = this.Selection.EndPos;
            }
        }
        if (Direction > 0 && type_Paragraph === this.Content[Start].GetType() && true === this.Content[Start].Selection_IsEmpty() && this.Content[Start].Selection.StartPos == this.Content[Start].Content.length - 1) {
            this.Content[Start].Selection.StartPos = this.Content[Start].Internal_GetEndPos();
            this.Content[Start].Selection.EndPos = this.Content[Start].Content.length - 1;
        }
        this.Content[ContentPos].Selection_SetEnd(X, Y, this.CurPage, MouseEvent);
        for (var Index = Start; Index <= End; Index++) {
            var Item = this.Content[Index];
            var ItemType = Item.GetType();
            Item.Selection.Use = true;
            switch (Index) {
            case Start:
                if (type_Paragraph === ItemType) {
                    if (Direction > 0) {
                        Item.Selection.EndPos = Item.Content.length - 1;
                    } else {
                        Item.Selection.StartPos = Item.Content.length - 1;
                    }
                } else {
                    var Row = Item.Content.length - 1;
                    var Cell = Item.Content[Row].Get_CellsCount() - 1;
                    var Pos = {
                        Row: Row,
                        Cell: Cell
                    };
                    if (Direction > 0) {
                        Item.Selection.EndPos.Pos = Pos;
                    } else {
                        Item.Selection.StartPos.Pos = Pos;
                    }
                    Item.Internal_Selection_UpdateCells();
                }
                break;
            case End:
                if (type_Paragraph === ItemType) {
                    if (Direction > 0) {
                        Item.Selection.StartPos = Item.Internal_GetStartPos();
                    } else {
                        Item.Selection.EndPos = Item.Internal_GetStartPos();
                    }
                } else {
                    var Pos = {
                        Row: 0,
                        Cell: 0
                    };
                    if (Direction > 0) {
                        Item.Selection.StartPos.Pos = Pos;
                    } else {
                        Item.Selection.EndPos.Pos = Pos;
                    }
                    Item.Internal_Selection_UpdateCells();
                }
                break;
            default:
                if (type_Paragraph === ItemType) {
                    if (Direction > 0) {
                        Item.Selection.StartPos = Item.Internal_GetStartPos();
                        Item.Selection.EndPos = Item.Content.length - 1;
                    } else {
                        Item.Selection.EndPos = Item.Internal_GetStartPos();
                        Item.Selection.StartPos = Item.Content.length - 1;
                    }
                } else {
                    var Row = Item.Content.length - 1;
                    var Cell = Item.Content[Row].Get_CellsCount() - 1;
                    var Pos0 = {
                        Row: 0,
                        Cell: 0
                    };
                    var Pos1 = {
                        Row: Row,
                        Cell: Cell
                    };
                    if (Direction > 0) {
                        Item.Selection.StartPos.Pos = Pos0;
                        Item.Selection.EndPos.Pos = Pos1;
                    } else {
                        Item.Selection.EndPos.Pos = Pos0;
                        Item.Selection.StartPos.Pos = Pos1;
                    }
                    Item.Internal_Selection_UpdateCells();
                }
                break;
            }
        }
    },
    Selection_Stop: function (X, Y, PageIndex, MouseEvent) {
        if (true != this.Selection.Use) {
            return;
        }
        var PageNum = PageIndex;
        var _Y = Y;
        var _X = X;
        if (PageNum < 0) {
            PageNum = 0;
            _Y = -1;
            _X = -1;
        } else {
            if (PageNum >= this.Pages.length) {
                PageNum = this.Pages.length - 1;
                _Y = this.Pages[PageNum].YLimit + 1;
                _X = this.Pages[PageNum].XLimit + 1;
            } else {
                if (0 === PageNum && Y < this.Pages[0].Bounds.Top) {
                    _X = -1;
                } else {
                    if (this.Pages.length - 1 === PageNum && Y > this.Pages[this.Pages.length - 1].Bounds.Bottom) {
                        _X = this.Pages[this.Pages.length - 1].XLimit + 1;
                    }
                }
            }
        }
        var _MouseEvent = {
            ClickCount: 1,
            Type: g_mouse_event_type_up
        };
        this.Selection_SetEnd(_X, _Y, PageNum + this.StartPage, _MouseEvent);
    },
    Selection_Check: function (X, Y, Page_Abs) {
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.DrawingObjects.selectionCheck(X, Y, Page_Abs);
        } else {
            if (true === this.Selection.Use) {
                switch (this.Selection.Flag) {
                case selectionflag_Common:
                    var Start = this.Selection.StartPos;
                    var End = this.Selection.EndPos;
                    if (Start > End) {
                        Start = this.Selection.EndPos;
                        End = this.Selection.StartPos;
                    }
                    var ContentPos = this.Internal_GetContentPosByXY(X, Y, Page_Abs);
                    if (ContentPos > Start && ContentPos < End) {
                        return true;
                    } else {
                        if (ContentPos < Start || ContentPos > End) {
                            return false;
                        } else {
                            return this.Content[ContentPos].Selection_Check(X, Y, Page_Abs);
                        }
                    }
                    return false;
                case selectionflag_Numbering:
                    return false;
                }
                return false;
            }
            return false;
        }
    },
    Selection_IsEmpty: function (bCheckHidden) {
        if (docpostype_DrawingObjects === this.DrawingObjects) {
            return this.LogicDocument.DrawingObjects.selectionIsEmpty(bCheckHidden);
        } else {
            if (true === this.Selection.Use) {
                if (selectionflag_Numbering == this.Selection.Flag) {
                    return false;
                } else {
                    if (null != this.Selection.Data && true === this.Selection.Data.TableBorder && type_Table == this.Content[this.Selection.Data.Pos].GetType()) {
                        return false;
                    } else {
                        if (this.Selection.StartPos === this.Selection.EndPos) {
                            return this.Content[this.Selection.StartPos].Selection_IsEmpty(bCheckHidden);
                        } else {
                            return false;
                        }
                    }
                }
            }
            return true;
        }
    },
    Select_All: function () {
        if (docpostype_DrawingObjects === this.CurPos.Type && true === this.DrawingObjects.isSelectedText()) {
            this.DrawingObjects.selectAll();
        } else {
            if (true === this.Selection.Use) {
                this.Selection_Remove();
            }
            this.CurPos.Type = docpostype_Content;
            this.Selection.Use = true;
            this.Selection.Start = false;
            this.Selection.Flag = selectionflag_Common;
            this.Selection.StartPos = 0;
            this.Selection.EndPos = this.Content.length - 1;
            for (var Index = 0; Index < this.Content.length; Index++) {
                this.Content[Index].Select_All();
            }
        }
    },
    Select_DrawingObject: function (Id) {
        this.Selection_Remove();
        this.DrawingDocument.TargetEnd();
        this.DrawingDocument.SetCurrentPage(this.Get_StartPage_Absolute() + this.CurPage);
        this.Parent.Set_CurrentElement();
        var HdrFtr = this.Is_HdrFtr(true);
        if (null != HdrFtr) {
            HdrFtr.Content.CurPos.Type = docpostype_DrawingObjects;
        } else {
            this.LogicDocument.CurPos.Type = docpostype_DrawingObjects;
        }
        this.LogicDocument.Selection.Use = true;
        this.LogicDocument.Selection.Start = false;
        this.LogicDocument.DrawingObjects.selectById(Id, this.Get_StartPage_Absolute() + this.CurPage);
        editor.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
        editor.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
    },
    Document_SelectNumbering: function (NumPr) {
        this.Selection_Remove();
        this.Selection.Use = true;
        this.Selection.Flag = selectionflag_Numbering;
        this.Selection.Data = new Array();
        for (var Index = 0; Index < this.Content.length; Index++) {
            var Item = this.Content[Index];
            var ItemNumPr = null;
            if (type_Paragraph == Item.GetType() && undefined != (ItemNumPr = Item.Numbering_Get()) && ItemNumPr.NumId == NumPr.NumId && ItemNumPr.Lvl == NumPr.Lvl) {
                this.Selection.Data.push(Index);
                Item.Selection_SelectNumbering();
            }
        }
        this.DrawingDocument.SelectEnabled(true);
        this.LogicDocument.Document_UpdateSelectionState();
        this.Interface_Update_ParaPr();
        this.Interface_Update_TextPr();
    },
    Remove_NumberingSelection: function () {
        if (true === this.Selection.Use && selectionflag_Numbering == this.Selection.Flag) {
            this.Selection_Remove();
        }
    },
    Table_AddRow: function (bBefore) {
        if (docpostype_DrawingObjects == this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.tableAddRow(bBefore);
        } else {
            if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
                var Pos = 0;
                if (true === this.Selection.Use) {
                    Pos = this.Selection.StartPos;
                } else {
                    Pos = this.CurPos.ContentPos;
                }
                this.Content[Pos].Row_Add(bBefore);
                if (false === this.Selection.Use && true === this.Content[Pos].Is_SelectionUse()) {
                    this.Selection.Use = true;
                    this.Selection.StartPos = Pos;
                    this.Selection.EndPos = Pos;
                }
                return true;
            }
        }
        return false;
    },
    Table_AddCol: function (bBefore) {
        if (docpostype_DrawingObjects == this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.tableAddCol(bBefore);
        } else {
            if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
                var Pos = 0;
                if (true === this.Selection.Use) {
                    Pos = this.Selection.StartPos;
                } else {
                    Pos = this.CurPos.ContentPos;
                }
                this.Content[Pos].Col_Add(bBefore);
                if (false === this.Selection.Use && true === this.Content[Pos].Is_SelectionUse()) {
                    this.Selection.Use = true;
                    this.Selection.StartPos = Pos;
                    this.Selection.EndPos = Pos;
                }
                return true;
            }
        }
        return false;
    },
    Table_RemoveRow: function () {
        if (docpostype_DrawingObjects == this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.tableRemoveRow();
        } else {
            if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
                var Pos = 0;
                if (true === this.Selection.Use) {
                    Pos = this.Selection.StartPos;
                } else {
                    Pos = this.CurPos.ContentPos;
                }
                if (false === this.Content[Pos].Row_Remove()) {
                    this.Table_RemoveTable();
                }
                return true;
            }
        }
        return false;
    },
    Table_RemoveCol: function () {
        if (docpostype_DrawingObjects == this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.tableRemoveCol();
        } else {
            if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
                var Pos = 0;
                if (true === this.Selection.Use) {
                    Pos = this.Selection.StartPos;
                } else {
                    Pos = this.CurPos.ContentPos;
                }
                if (false === this.Content[Pos].Col_Remove()) {
                    this.Table_RemoveTable();
                }
                return true;
            }
        }
        return false;
    },
    Table_MergeCells: function () {
        if (docpostype_DrawingObjects == this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.tableMergeCells();
        } else {
            if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
                var Pos = 0;
                if (true === this.Selection.Use) {
                    Pos = this.Selection.StartPos;
                } else {
                    Pos = this.CurPos.ContentPos;
                }
                this.Content[Pos].Cell_Merge();
                return true;
            }
        }
        return false;
    },
    Table_SplitCell: function (Cols, Rows) {
        if (docpostype_DrawingObjects == this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.tableSplitCell();
        } else {
            if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
                var Pos = 0;
                if (true === this.Selection.Use) {
                    Pos = this.Selection.StartPos;
                } else {
                    Pos = this.CurPos.ContentPos;
                }
                this.Content[Pos].Cell_Split(Rows, Cols);
                return true;
            }
        }
        return false;
    },
    Table_RemoveTable: function () {
        if (docpostype_DrawingObjects == this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.tableRemoveTable();
        } else {
            if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
                var Pos;
                if (true === this.Selection.Use) {
                    Pos = this.Selection.StartPos;
                } else {
                    Pos = this.CurPos.ContentPos;
                }
                var Table = this.Content[Pos];
                if (true === Table.Is_InnerTable()) {
                    Table.Remove_InnerTable();
                } else {
                    this.Selection_Remove();
                    Table.PreDelete();
                    this.Internal_Content_Remove(Pos, 1);
                    if (Pos >= this.Content.length - 1) {
                        Pos--;
                    }
                    if (Pos < 0) {
                        Pos = 0;
                    }
                    this.CurPos.Type = docpostype_Content;
                    this.CurPos.ContentPos = Pos;
                    this.Content[Pos].Cursor_MoveToStartPos();
                    this.Recalculate();
                }
                return true;
            }
        }
        return false;
    },
    Table_Select: function (Type) {
        if (docpostype_DrawingObjects == this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.tableSelect(Type);
        } else {
            if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
                var Pos = 0;
                if (true === this.Selection.Use) {
                    Pos = this.Selection.StartPos;
                } else {
                    Pos = this.CurPos.ContentPos;
                }
                this.Content[Pos].Table_Select(Type);
                if (false === this.Selection.Use && true === this.Content[Pos].Is_SelectionUse()) {
                    this.Selection.Use = true;
                    this.Selection.StartPos = Pos;
                    this.Selection.EndPos = Pos;
                }
                return true;
            }
        }
        return false;
    },
    Table_CheckMerge: function () {
        if (docpostype_DrawingObjects == this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.tableCheckMerge();
        } else {
            if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
                var Pos = 0;
                if (true === this.Selection.Use) {
                    Pos = this.Selection.StartPos;
                } else {
                    Pos = this.CurPos.ContentPos;
                }
                return this.Content[Pos].Check_Merge();
            }
        }
        return false;
    },
    Table_CheckSplit: function () {
        if (docpostype_DrawingObjects == this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.tableCheckSplit();
        } else {
            if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
                var Pos = 0;
                if (true === this.Selection.Use) {
                    Pos = this.Selection.StartPos;
                } else {
                    Pos = this.CurPos.ContentPos;
                }
                return this.Content[Pos].Check_Split();
            }
        }
        return false;
    },
    Internal_GetContentPosByXY: function (X, Y, PageNum) {
        if (undefined === PageNum) {
            PageNum = this.CurPage;
        }
        PageNum = Math.min(PageNum, this.Pages.length - 1);
        var FlowTable = this.LogicDocument.DrawingObjects.getTableByXY(X, Y, PageNum + this.Get_StartPage_Absolute(), this);
        if (null != FlowTable) {
            return FlowTable.Table.Index;
        }
        var StartPos = this.Pages[PageNum].Pos;
        var EndPos = this.Content.length - 1;
        if (PageNum < this.Pages.length - 1) {
            EndPos = Math.min(this.Pages[PageNum + 1].Pos, EndPos);
        }
        var InlineElements = new Array();
        for (var Index = StartPos; Index <= EndPos; Index++) {
            var Item = this.Content[Index];
            if (type_Table != Item.GetType() || false != Item.Is_Inline()) {
                InlineElements.push(Index);
            }
        }
        var Count = InlineElements.length;
        if (Count <= 0) {
            return StartPos;
        }
        for (var Pos = 0; Pos < Count - 1; Pos++) {
            var Item = this.Content[InlineElements[Pos + 1]];
            if (Y < Item.Pages[0].Bounds.Top) {
                return InlineElements[Pos];
            }
            if (Item.Pages.length > 1) {
                if ((type_Paragraph === Item.GetType() && Item.Pages[0].FirstLine != Item.Pages[1].FirstLine) || (type_Table === Item.GetType() && true === Item.RowsInfo[0].FirstPage)) {
                    return InlineElements[Pos + 1];
                }
                return InlineElements[Pos];
            }
            if (Pos === Count - 2) {
                return InlineElements[Count - 1];
            }
        }
        return InlineElements[0];
    },
    Internal_Content_Find: function (Id) {
        for (var Index = 0; Index < this.Content.length; Index++) {
            if (this.Content[Index].GetId() === Id) {
                return Index;
            }
        }
        return -1;
    },
    Internal_CheckCurPage: function () {
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            this.CurPage = 0;
        } else {
            if (docpostype_Content === this.CurPos.Type) {
                if (true === this.Selection.Use) {
                    this.CurPage = this.Content[this.Selection.EndPos].Get_CurrentPage_Relative();
                } else {
                    if (this.CurPos.ContentPos >= 0) {
                        this.CurPage = this.Content[this.CurPos.ContentPos].Get_CurrentPage_Relative();
                    }
                }
            }
        }
    },
    Internal_Content_Add: function (Position, NewObject, bCheckTable) {
        if (Position < 0 || Position > this.Content.length) {
            return;
        }
        var PrevObj = this.Content[Position - 1];
        var NextObj = this.Content[Position];
        if ("undefined" == typeof(PrevObj)) {
            PrevObj = null;
        }
        if ("undefined" == typeof(NextObj)) {
            NextObj = null;
        }
        History.Add(this, {
            Type: historyitem_DocumentContent_AddItem,
            Pos: Position,
            Item: NewObject
        });
        this.Content.splice(Position, 0, NewObject);
        NewObject.Set_Parent(this);
        NewObject.Set_DocumentNext(NextObj);
        NewObject.Set_DocumentPrev(PrevObj);
        if (null != PrevObj) {
            PrevObj.Set_DocumentNext(NewObject);
        }
        if (null != NextObj) {
            NextObj.Set_DocumentPrev(NewObject);
        }
        if (Position <= this.CurPos.TableMove) {
            this.CurPos.TableMove++;
        }
        if (false != bCheckTable && type_Table == this.Content[this.Content.length - 1].GetType()) {
            this.Internal_Content_Add(this.Content.length, new Paragraph(this.DrawingDocument, this, 0, 50, 50, this.XLimit, this.YLimit));
        }
    },
    Internal_Content_Remove: function (Position, Count) {
        if (Position < 0 || Position >= this.Content.length || Count <= 0) {
            return;
        }
        var PrevObj = this.Content[Position - 1];
        var NextObj = this.Content[Position + Count];
        if ("undefined" == typeof(PrevObj)) {
            PrevObj = null;
        }
        if ("undefined" == typeof(NextObj)) {
            NextObj = null;
        }
        for (var Index = 0; Index < Count; Index++) {
            this.Content[Position + Index].PreDelete();
        }
        History.Add(this, {
            Type: historyitem_DocumentContent_RemoveItem,
            Pos: Position,
            Items: this.Content.slice(Position, Position + Count)
        });
        this.Content.splice(Position, Count);
        if (null != PrevObj) {
            PrevObj.Set_DocumentNext(NextObj);
        }
        if (null != NextObj) {
            NextObj.Set_DocumentPrev(PrevObj);
        }
        if (type_Table == this.Content[this.Content.length - 1].GetType()) {
            this.Internal_Content_Add(this.Content.length, new Paragraph(this.DrawingDocument, this, 0, 50, 50, this.XLimit, this.YLimit));
        }
    },
    Clear_ContentChanges: function () {
        this.m_oContentChanges.Clear();
    },
    Add_ContentChanges: function (Changes) {
        this.m_oContentChanges.Add(Changes);
    },
    Refresh_ContentChanges: function () {
        this.m_oContentChanges.Refresh();
    },
    Internal_Content_RemoveAll: function () {
        History.Add(this, {
            Type: historyitem_DocumentContent_RemoveItem,
            Pos: 0,
            Items: this.Content.slice(0, this.Content.length)
        });
        this.Content = new Array();
    },
    Get_StartPage_Absolute: function () {
        return this.Parent.Get_StartPage_Absolute() + this.Get_StartPage_Relative();
    },
    Get_StartPage_Relative: function () {
        return this.StartPage;
    },
    Set_StartPage: function (StartPage) {
        this.StartPage = StartPage;
    },
    Get_Page_Relative: function (AbsPage) {
        return Math.min(this.Pages.length - 1, Math.max(AbsPage - this.StartPage, 0));
    },
    Undo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_DocumentContent_AddItem:
            this.Content.splice(Data.Pos, 1);
            break;
        case historyitem_DocumentContent_RemoveItem:
            var Pos = Data.Pos;
            var Array_start = this.Content.slice(0, Pos);
            var Array_end = this.Content.slice(Pos);
            this.Content = Array_start.concat(Data.Items, Array_end);
            break;
        }
    },
    Redo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_DocumentContent_AddItem:
            var Pos = Data.Pos;
            this.Content.splice(Pos, 0, Data.Item);
            break;
        case historyitem_DocumentContent_RemoveItem:
            this.Content.splice(Data.Pos, Data.Items.length);
            break;
        }
    },
    Get_SelectionState: function () {
        var DocState = new Object();
        DocState.CurPos = {
            X: this.CurPos.X,
            Y: this.CurPos.Y,
            ContentPos: this.CurPos.ContentPos,
            RealX: this.CurPos.RealX,
            RealY: this.CurPos.RealY,
            Type: this.CurPos.Type
        };
        DocState.Selection = {
            Start: this.Selection.Start,
            Use: this.Selection.Use,
            StartPos: this.Selection.StartPos,
            EndPos: this.Selection.EndPos,
            Flag: this.Selection.Flag,
            Data: this.Selection.Data
        };
        DocState.CurPage = this.CurPage;
        var State = null;
        if (true === editor.isStartAddShape && docpostype_DrawingObjects === this.CurPos.Type) {
            DocState.CurPos.Type = docpostype_Content;
            DocState.Selection.Start = false;
            DocState.Selection.Use = false;
            this.Content[DocState.CurPos.ContentPos].Selection_Remove();
            State = this.Content[this.CurPos.ContentPos].Get_SelectionState();
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                State = this.LogicDocument.DrawingObjects.getSelectionState();
            } else {
                if (docpostype_Content === this.CurPos.Type) {
                    if (true === this.Selection.Use) {
                        if (selectionflag_Numbering == this.Selection.Flag) {
                            State = new Array();
                        } else {
                            var StartPos = this.Selection.StartPos;
                            var EndPos = this.Selection.EndPos;
                            if (StartPos > EndPos) {
                                var Temp = StartPos;
                                StartPos = EndPos;
                                EndPos = Temp;
                            }
                            State = new Array();
                            var TempState = new Array();
                            for (var Index = StartPos; Index <= EndPos; Index++) {
                                TempState.push(this.Content[Index].Get_SelectionState());
                            }
                            State.push(TempState);
                        }
                    } else {
                        State = this.Content[this.CurPos.ContentPos].Get_SelectionState();
                    }
                }
            }
        }
        State.push(DocState);
        return State;
    },
    Set_SelectionState: function (State, StateIndex) {
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            this.LogicDocument.DrawingObjects.resetSelection();
        }
        if (State.length <= 0) {
            return;
        }
        var DocState = State[StateIndex];
        this.CurPos = {
            X: DocState.CurPos.X,
            Y: DocState.CurPos.Y,
            ContentPos: DocState.CurPos.ContentPos,
            RealX: DocState.CurPos.RealX,
            RealY: DocState.CurPos.RealY,
            Type: DocState.CurPos.Type
        };
        this.Selection = {
            Start: DocState.Selection.Start,
            Use: DocState.Selection.Use,
            StartPos: DocState.Selection.StartPos,
            EndPos: DocState.Selection.EndPos,
            Flag: DocState.Selection.Flag,
            Data: DocState.Selection.Data
        };
        this.CurPage = DocState.CurPage;
        var NewStateIndex = StateIndex - 1;
        if (docpostype_DrawingObjects == this.CurPos.Type) {
            this.LogicDocument.DrawingObjects.setSelectionState(State, NewStateIndex);
        } else {
            if (true === this.Selection.Use) {
                if (selectionflag_Numbering == this.Selection.Flag) {} else {
                    var StartPos = this.Selection.StartPos;
                    var EndPos = this.Selection.EndPos;
                    if (StartPos > EndPos) {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos = Temp;
                    }
                    var CurState = State[NewStateIndex];
                    for (var Index = StartPos; Index <= EndPos; Index++) {
                        this.Content[Index].Set_SelectionState(CurState[Index - StartPos], CurState[Index - StartPos].length - 1);
                    }
                }
            } else {
                this.Content[this.CurPos.ContentPos].Set_SelectionState(State, NewStateIndex);
            }
        }
    },
    Get_ParentObject_or_DocumentPos: function () {
        return this.Parent.Get_ParentObject_or_DocumentPos();
    },
    Refresh_RecalcData: function (Data) {
        var bNeedRecalc = false;
        var Type = Data.Type;
        var CurPage = 0;
        switch (Type) {
        case historyitem_DocumentContent_AddItem:
            case historyitem_DocumentContent_RemoveItem:
            for (CurPage = this.Pages.length - 1; CurPage > 0; CurPage--) {
                if (Data.Pos > this.Pages[CurPage].Pos) {
                    break;
                }
            }
            bNeedRecalc = true;
            break;
        }
        this.Refresh_RecalcData2(0, CurPage);
    },
    Refresh_RecalcData2: function (Index, Page_rel) {
        this.Parent.Refresh_RecalcData2(this.StartPage + Page_rel);
    },
    Hyperlink_Add: function (HyperProps) {
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.hyperlinkAdd(HyperProps);
        } else {
            if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos) || (false == this.Selection.Use))) {
                var Pos = (true == this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos);
                this.Content[Pos].Hyperlink_Add(HyperProps);
                this.Recalculate();
            }
        }
    },
    Hyperlink_Modify: function (HyperProps) {
        if (docpostype_DrawingObjects == this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.hyperlinkModify(HyperProps);
        } else {
            if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos) || (false == this.Selection.Use))) {
                var Pos = (true == this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos);
                if (true === this.Content[Pos].Hyperlink_Modify(HyperProps)) {
                    this.Recalculate();
                }
            }
        }
    },
    Hyperlink_Remove: function () {
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.hyperlinkRemove();
        } else {
            if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos) || (false == this.Selection.Use))) {
                var Pos = (true == this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos);
                this.Content[Pos].Hyperlink_Remove();
            }
        }
    },
    Hyperlink_CanAdd: function (bCheckInHyperlink) {
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.hyperlinkCanAdd(bCheckInHyperlink);
        } else {
            if (true === this.Selection.Use) {
                switch (this.Selection.Flag) {
                case selectionflag_Numbering:
                    return false;
                case selectionflag_Common:
                    if (this.Selection.StartPos != this.Selection.EndPos) {
                        return false;
                    }
                    return this.Content[this.Selection.StartPos].Hyperlink_CanAdd(bCheckInHyperlink);
                }
            } else {
                return this.Content[this.CurPos.ContentPos].Hyperlink_CanAdd(bCheckInHyperlink);
            }
        }
        return false;
    },
    Hyperlink_Check: function (bCheckEnd) {
        if (docpostype_DrawingObjects == this.CurPos.Type) {
            return this.LogicDocument.DrawingObjects.hyperlinkCheck(bCheckEnd);
        } else {
            if (true === this.Selection.Use) {
                switch (this.Selection.Flag) {
                case selectionflag_Numbering:
                    return null;
                case selectionflag_Common:
                    if (this.Selection.StartPos != this.Selection.EndPos) {
                        return null;
                    }
                    return this.Content[this.Selection.StartPos].Hyperlink_Check(bCheckEnd);
                }
            } else {
                return this.Content[this.CurPos.ContentPos].Hyperlink_Check(bCheckEnd);
            }
        }
        return null;
    },
    Document_Is_SelectionLocked: function (CheckType) {
        if (true === this.ApplyToAll) {
            var Count = this.Content.length;
            for (var Index = 0; Index < Count; Index++) {
                this.Content[Index].Set_ApplyToAll(true);
                this.Content[Index].Document_Is_SelectionLocked(CheckType);
                this.Content[Index].Set_ApplyToAll(false);
            }
            return;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                this.LogicDocument.DrawingObjects.documentIsSelectionLocked(CheckType);
            } else {
                if (docpostype_Content == this.CurPos.Type) {
                    switch (this.Selection.Flag) {
                    case selectionflag_Common:
                        if (true === this.Selection.Use) {
                            var StartPos = (this.Selection.StartPos > this.Selection.EndPos ? this.Selection.EndPos : this.Selection.StartPos);
                            var EndPos = (this.Selection.StartPos > this.Selection.EndPos ? this.Selection.StartPos : this.Selection.EndPos);
                            if (StartPos != EndPos && changestype_Delete === CheckType) {
                                CheckType = changestype_Remove;
                            }
                            for (var Index = StartPos; Index <= EndPos; Index++) {
                                this.Content[Index].Document_Is_SelectionLocked(CheckType);
                            }
                        } else {
                            var CurElement = this.Content[this.CurPos.ContentPos];
                            if (changestype_Document_Content_Add === CheckType && type_Paragraph === CurElement.GetType() && true === CurElement.Cursor_IsEnd()) {
                                CollaborativeEditing.Add_CheckLock(false);
                            } else {
                                this.Content[this.CurPos.ContentPos].Document_Is_SelectionLocked(CheckType);
                            }
                        }
                        break;
                    case selectionflag_Numbering:
                        var NumPr = this.Content[this.Selection.Data[0]].Numbering_Get();
                        if (null != NumPr) {
                            var AbstrNum = this.Numbering.Get_AbstractNum(NumPr.NumId);
                            AbstrNum.Document_Is_SelectionLocked(CheckType);
                        }
                        break;
                    }
                }
            }
        }
    },
    Save_Changes: function (Data, Writer) {
        Writer.WriteLong(historyitem_type_DocumentContent);
        var Type = Data.Type;
        Writer.WriteLong(Type);
        switch (Type) {
        case historyitem_DocumentContent_AddItem:
            var bArray = Data.UseArray;
            var Count = 1;
            Writer.WriteLong(Count);
            for (var Index = 0; Index < Count; Index++) {
                if (true === bArray) {
                    Writer.WriteLong(Data.PosArray[Index]);
                } else {
                    Writer.WriteLong(Data.Pos + Index);
                }
                Writer.WriteString2(Data.Item.Get_Id());
            }
            break;
        case historyitem_DocumentContent_RemoveItem:
            var bArray = Data.UseArray;
            var Count = Data.Items.length;
            var StartPos = Writer.GetCurPosition();
            Writer.Skip(4);
            var RealCount = Count;
            for (var Index = 0; Index < Count; Index++) {
                if (true === bArray) {
                    if (false === Data.PosArray[Index]) {
                        RealCount--;
                    } else {
                        Writer.WriteLong(Data.PosArray[Index]);
                    }
                } else {
                    Writer.WriteLong(Data.Pos);
                }
            }
            var EndPos = Writer.GetCurPosition();
            Writer.Seek(StartPos);
            Writer.WriteLong(RealCount);
            Writer.Seek(EndPos);
            break;
        }
        return Writer;
    },
    Save_Changes2: function (Data, Writer) {
        var bRetValue = false;
        var Type = Data.Type;
        switch (Type) {
        case historyitem_DocumentContent_AddItem:
            break;
        case historyitem_DocumentContent_RemoveItem:
            break;
        }
        return bRetValue;
    },
    Load_Changes: function (Reader, Reader2) {
        var ClassType = Reader.GetLong();
        if (historyitem_type_DocumentContent != ClassType) {
            return;
        }
        var Type = Reader.GetLong();
        switch (Type) {
        case historyitem_DocumentContent_AddItem:
            var Count = Reader.GetLong();
            for (var Index = 0; Index < Count; Index++) {
                var Pos = this.m_oContentChanges.Check(contentchanges_Add, Reader.GetLong());
                var Element = g_oTableId.Get_ById(Reader.GetString2());
                if (null != Element) {
                    if (Pos > 0) {
                        this.Content[Pos - 1].Next = Element;
                        Element.Prev = this.Content[Pos - 1];
                    }
                    if (Pos <= this.Content.length - 1) {
                        this.Content[Pos].Prev = Element;
                        Element.Next = this.Content[Pos];
                    }
                    this.Content.splice(Pos, 0, Element);
                }
            }
            break;
        case historyitem_DocumentContent_RemoveItem:
            var Count = Reader.GetLong();
            for (var Index = 0; Index < Count; Index++) {
                var Pos = this.m_oContentChanges.Check(contentchanges_Remove, Reader.GetLong());
                if (false === Pos) {
                    continue;
                }
                this.Content.splice(Pos, 1);
                if (Pos > 0) {
                    if (Pos <= this.Content.length - 1) {
                        this.Content[Pos - 1].Next = this.Content[Pos];
                        this.Content[Pos].Prev = this.Content[Pos - 1];
                    } else {
                        this.Content[Pos - 1].Next = null;
                    }
                } else {
                    if (Pos <= this.Content.length - 1) {
                        this.Content[Pos].Prev = null;
                    }
                }
            }
            break;
        }
        return true;
    },
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(historyitem_type_DocumentContent);
        Writer.WriteString2(this.Id);
        Writer.WriteLong(this.StartPage);
        Writer.WriteString2(this.Parent.Get_Id());
        Writer.WriteBool(this.TurnOffInnerWrap);
        Writer.WriteBool(this.Split);
        var Count = this.Content.length;
        Writer.WriteLong(Count);
        for (var Index = 0; Index < Count; Index++) {
            Writer.WriteString2(this.Content[Index].Get_Id());
        }
    },
    Read_FromBinary2: function (Reader) {
        var LinkData = new Object();
        this.Id = Reader.GetString2();
        this.StartPage = Reader.GetLong();
        LinkData.Parent = Reader.GetString2();
        this.TurnOffInnerWrap = Reader.GetBool();
        this.Split = Reader.GetBool();
        var Count = Reader.GetLong();
        this.Content = new Array();
        for (var Index = 0; Index < Count; Index++) {
            var Element = g_oTableId.Get_ById(Reader.GetString2());
            if (null != Element) {
                this.Content.push(Element);
            }
        }
        CollaborativeEditing.Add_LinkData(this, LinkData);
        this.DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
    },
    Load_LinkData: function (LinkData) {
        if ("undefined" != typeof(LinkData.Parent)) {
            this.Parent = g_oTableId.Get_ById(LinkData.Parent);
        }
    },
    Add_Comment: function (Comment, bStart, bEnd) {
        if (true === this.ApplyToAll) {
            if (this.Content.length <= 1 && true === bStart && true === bEnd) {
                this.Content[0].Set_ApplyToAll(true);
                this.Content[0].Add_Comment(Comment, true, true);
                this.Content[0].Set_ApplyToAll(false);
            } else {
                if (true === bStart) {
                    this.Content[0].Set_ApplyToAll(true);
                    this.Content[0].Add_Comment(Comment, true, false);
                    this.Content[0].Set_ApplyToAll(false);
                }
                if (true === bEnd) {
                    this.Content[this.Content.length - 1].Set_ApplyToAll(true);
                    this.Content[this.Content.length - 1].Add_Comment(Comment, false, true);
                    this.Content[this.Content.length - 1].Set_ApplyToAll(true);
                }
            }
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return this.LogicDocument.DrawingObjects.addComment(Comment);
            } else {
                if (selectionflag_Numbering === this.Selection.Flag) {
                    return;
                }
                if (true === this.Selection.Use) {
                    var StartPos, EndPos;
                    if (this.Selection.StartPos < this.Selection.EndPos) {
                        StartPos = this.Selection.StartPos;
                        EndPos = this.Selection.EndPos;
                    } else {
                        StartPos = this.Selection.EndPos;
                        EndPos = this.Selection.StartPos;
                    }
                    if (true === bStart) {
                        this.Content[StartPos].Add_Comment(Comment, true, false);
                    }
                    if (true === bEnd) {
                        this.Content[EndPos].Add_Comment(Comment, false, true);
                    }
                } else {
                    this.Content[this.CurPos.ContentPos].Add_Comment(Comment, bStart, bEnd);
                }
            }
        }
    },
    CanAdd_Comment: function () {
        if (true === this.ApplyToAll) {
            if (this.Content.length > 1) {
                return true;
            } else {
                return this.Content[0].CanAdd_Comment();
            }
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                if (true != this.LogicDocument.DrawingObjects.isSelectedText()) {
                    return true;
                } else {
                    return this.LogicDocument.DrawingObjects.canAddComment();
                }
            } else {
                switch (this.Selection.Flag) {
                case selectionflag_Numbering:
                    return false;
                case selectionflag_Common:
                    if (true === this.Selection.Use && this.Selection.StartPos != this.Selection.EndPos) {
                        return true;
                    } else {
                        var Pos = (this.Selection.Use === true ? this.Selection.StartPos : this.CurPos.ContentPos);
                        var Element = this.Content[Pos];
                        return Element.CanAdd_Comment();
                    }
                }
            }
        }
        return false;
    }
};