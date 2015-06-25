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
var type_Paragraph = 1;
var UnknownValue = null;
function Paragraph(DrawingDocument, Parent, PageNum, X, Y, XLimit, YLimit, bFromPresentation) {
    this.Id = g_oIdCounter.Get_NewId();
    this.Prev = null;
    this.Next = null;
    this.Index = -1;
    this.Parent = Parent;
    this.PageNum = PageNum;
    this.X = X;
    this.Y = Y;
    this.XLimit = XLimit;
    this.YLimit = YLimit;
    this.CompiledPr = {
        Pr: null,
        NeedRecalc: true
    };
    this.Pr = new CParaPr();
    this.CalculatedFrame = {
        L: 0,
        T: 0,
        W: 0,
        H: 0,
        L2: 0,
        T2: 0,
        W2: 0,
        H2: 0,
        PageIndex: 0
    };
    this.TextPr = new ParaTextPr();
    this.TextPr.Parent = this;
    this.SectPr = undefined;
    this.Bounds = new CDocumentBounds(X, Y, XLimit, Y);
    this.RecalcInfo = new CParaRecalcInfo();
    this.Pages = [];
    this.Lines = [];
    if (! (bFromPresentation === true)) {
        this.Numbering = new ParaNumbering();
    } else {
        this.Numbering = new ParaPresentationNumbering();
    }
    this.ParaEnd = {
        Line: 0,
        Range: 0
    };
    this.CurPos = {
        X: 0,
        Y: 0,
        ContentPos: 0,
        Line: -1,
        Range: -1,
        RealX: 0,
        RealY: 0,
        PagesPos: 0
    };
    this.Selection = new CParagraphSelection();
    this.DrawingDocument = null;
    this.LogicDocument = null;
    this.bFromDocument = true;
    if (undefined !== DrawingDocument && null !== DrawingDocument) {
        this.DrawingDocument = DrawingDocument;
        this.LogicDocument = bFromPresentation ? null : this.DrawingDocument.m_oLogicDocument;
        this.bFromDocument = bFromPresentation === true ? false : !!this.LogicDocument;
    }
    this.ApplyToAll = false;
    this.Lock = new CLock();
    if (false === g_oIdCounter.m_bLoad) {}
    this.DeleteCommentOnRemove = true;
    this.m_oContentChanges = new CContentChanges();
    this.PresentationPr = {
        Level: 0,
        Bullet: new CPresentationBullet()
    };
    this.FontMap = {
        Map: {},
        NeedRecalc: true
    };
    this.SearchResults = {};
    this.SpellChecker = new CParaSpellChecker(this);
    this.NearPosArray = [];
    this.Content = [];
    var EndRun = new ParaRun(this);
    EndRun.Add_ToContent(0, new ParaEnd());
    this.Content[0] = EndRun;
    this.m_oPRSW = new CParagraphRecalculateStateWrap(this);
    this.m_oPRSC = new CParagraphRecalculateStateCounter();
    this.m_oPRSA = new CParagraphRecalculateStateAlign();
    this.m_oPRSI = new CParagraphRecalculateStateInfo();
    this.m_oPDSE = new CParagraphDrawStateElements();
    this.StartState = null;
    g_oTableId.Add(this, this.Id);
    if (bFromPresentation === true) {
        this.Save_StartState();
    }
}
Paragraph.prototype = {
    GetType: function () {
        return type_Paragraph;
    },
    Get_Type: function () {
        return type_Paragraph;
    },
    Save_StartState: function () {
        this.StartState = new CParagraphStartState(this);
    },
    GetId: function () {
        return this.Id;
    },
    SetId: function (newId) {
        g_oTableId.Reset_Id(this, newId, this.Id);
        this.Id = newId;
    },
    Get_Id: function () {
        return this.GetId();
    },
    Set_Id: function (newId) {
        return this.SetId(newId);
    },
    Use_Wrap: function () {
        if (true !== this.Is_Inline()) {
            return false;
        }
        return true;
    },
    Use_YLimit: function () {
        if (undefined != this.Get_FramePr() && this.Parent instanceof CDocument) {
            return false;
        }
        return true;
    },
    Set_Pr: function (oNewPr) {
        var Pr_old = this.Pr;
        var Pr_new = oNewPr;
        History.Add(this, {
            Type: historyitem_Paragraph_Pr,
            Old: Pr_old,
            New: Pr_new
        });
        this.Pr = oNewPr;
        this.Recalc_CompiledPr();
    },
    Copy: function (Parent, DrawingDocument) {
        var Para = new Paragraph(DrawingDocument ? DrawingDocument : this.DrawingDocument, Parent, 0, 0, 0, 0, 0, !this.bFromDocument);
        Para.Set_Pr(this.Pr.Copy());
        Para.TextPr.Set_Value(this.TextPr.Value.Copy());
        Para.Internal_Content_Remove2(0, Para.Content.length);
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            var Item = this.Content[Index];
            Para.Internal_Content_Add(Para.Content.length, Item.Copy(false), false);
        }
        var EndRun = new ParaRun(Para);
        EndRun.Add_ToContent(0, new ParaEnd());
        Para.Internal_Content_Add(Para.Content.length, EndRun, false);
        EndRun.Set_Pr(this.TextPr.Value.Copy());
        if (undefined !== this.SectPr) {
            var SectPr = new CSectionPr(this.SectPr.LogicDocument);
            SectPr.Copy(this.SectPr);
            Para.Set_SectionPr(SectPr);
        }
        Para.Selection_Remove();
        Para.Cursor_MoveToStartPos(false);
        return Para;
    },
    Copy2: function (Parent) {
        var Para = new Paragraph(this.DrawingDocument, Parent, 0, 0, 0, 0, 0, true);
        Para.Set_Pr(this.Pr.Copy());
        Para.TextPr.Set_Value(this.TextPr.Value.Copy());
        Para.Internal_Content_Remove2(0, Para.Content.length);
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            var Item = this.Content[Index];
            Para.Internal_Content_Add(Para.Content.length, Item.Copy2(), false);
        }
        Para.Selection_Remove();
        Para.Cursor_MoveToStartPos(false);
        return Para;
    },
    Get_FirstRunPr: function () {
        if (this.Content.length <= 0 || para_Run !== this.Content[0].Type) {
            return this.TextPr.Value.Copy();
        }
        return this.Content[0].Pr.Copy();
    },
    Get_FirstTextPr: function () {
        if (this.Content.length <= 0 || para_Run !== this.Content[0].Type) {
            return this.Get_CompiledPr2(false).TextPr;
        }
        return this.Content[0].Get_CompiledPr();
    },
    Get_AllDrawingObjects: function (DrawingObjs) {
        if (undefined === DrawingObjs) {
            DrawingObjs = [];
        }
        var Count = this.Content.length;
        for (var Pos = 0; Pos < Count; Pos++) {
            var Item = this.Content[Pos];
            if (para_Hyperlink === Item.Type || para_Run === Item.Type) {
                Item.Get_AllDrawingObjects(DrawingObjs);
            }
        }
        return DrawingObjs;
    },
    Get_AllComments: function (List) {
        if (undefined === List) {
            List = [];
        }
        var Len = this.Content.length;
        for (var Pos = 0; Pos < Len; Pos++) {
            var Item = this.Content[Pos];
            if (para_Comment === Item.Type) {
                List.push({
                    Comment: Item,
                    Paragraph: this
                });
            }
        }
        return List;
    },
    Get_AllMaths: function (List) {
        if (undefined === List) {
            List = [];
        }
        var Len = this.Content.length;
        for (var Pos = 0; Pos < Len; Pos++) {
            var Item = this.Content[Pos];
            if (para_Math === Item.Type) {
                List.push({
                    Math: Item,
                    Paragraph: this
                });
            }
        }
        return List;
    },
    Get_AllParagraphs_ByNumbering: function (NumPr, ParaArray) {
        var _NumPr = this.Numbering_Get();
        if (undefined != _NumPr && _NumPr.NumId === NumPr.NumId && (_NumPr.Lvl === NumPr.Lvl || undefined === NumPr.Lvl)) {
            ParaArray.push(this);
        }
        var Count = this.Content.length;
        for (var Pos = 0; Pos < Count; Pos++) {
            var Item = this.Content[Pos];
            if (para_Drawing === Item.Type) {
                Item.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
            }
        }
    },
    Get_PageBounds: function (PageIndex) {
        return this.Pages[PageIndex].Bounds;
    },
    Get_EmptyHeight: function () {
        var Pr = this.Get_CompiledPr();
        var EndTextPr = Pr.TextPr.Copy();
        EndTextPr.Merge(this.TextPr.Value);
        g_oTextMeasurer.SetTextPr(EndTextPr, this.Get_Theme());
        g_oTextMeasurer.SetFontSlot(fontslot_ASCII);
        return g_oTextMeasurer.GetHeight();
    },
    Get_Theme: function () {
        return this.Parent.Get_Theme();
    },
    Get_ColorMap: function () {
        return this.Parent.Get_ColorMap();
    },
    Reset: function (X, Y, XLimit, YLimit, PageNum) {
        this.X = X;
        this.Y = Y;
        this.XLimit = XLimit;
        this.YLimit = YLimit;
        this.PageNum = PageNum;
        if (true === this.Parent.RecalcInfo.Can_RecalcObject()) {
            var Ranges = this.Parent.CheckRange(X, Y, XLimit, Y, Y, Y, X, XLimit, this.PageNum, true);
            if (Ranges.length > 0) {
                if (Math.abs(Ranges[0].X0 - X) < 0.001) {
                    this.X_ColumnStart = Ranges[0].X1;
                } else {
                    this.X_ColumnStart = X;
                }
                if (Math.abs(Ranges[Ranges.length - 1].X1 - XLimit) < 0.001) {
                    this.X_ColumnEnd = Ranges[Ranges.length - 1].X0;
                } else {
                    this.X_ColumnEnd = XLimit;
                }
            } else {
                this.X_ColumnStart = X;
                this.X_ColumnEnd = XLimit;
            }
        }
    },
    CopyPr: function (OtherParagraph) {
        return this.CopyPr_Open(OtherParagraph);
    },
    CopyPr_Open: function (OtherParagraph) {
        OtherParagraph.X = this.X;
        OtherParagraph.XLimit = this.XLimit;
        if ("undefined" != typeof(OtherParagraph.NumPr)) {
            OtherParagraph.Numbering_Remove();
        }
        var NumPr = this.Numbering_Get();
        if (undefined != NumPr) {
            OtherParagraph.Numbering_Set(NumPr.NumId, NumPr.Lvl);
        }
        var oOldPr = OtherParagraph.Pr;
        OtherParagraph.Pr = this.Pr.Copy();
        History.Add(OtherParagraph, {
            Type: historyitem_Paragraph_Pr,
            Old: oOldPr,
            New: OtherParagraph.Pr
        });
        if (this.bFromDocument) {
            OtherParagraph.Style_Add(this.Style_Get(), true);
        }
        OtherParagraph.TextPr.Apply_TextPr(this.TextPr.Value);
    },
    Internal_Content_Add: function (Pos, Item, bCorrectPos) {
        History.Add(this, {
            Type: historyitem_Paragraph_AddItem,
            Pos: Pos,
            EndPos: Pos,
            Items: [Item]
        });
        this.Content.splice(Pos, 0, Item);
        if (this.CurPos.ContentPos >= Pos) {
            this.CurPos.ContentPos++;
            if (this.CurPos.ContentPos >= this.Content.length) {
                this.CurPos.ContentPos = this.Content.length - 1;
            }
        }
        if (this.Selection.StartPos >= Pos) {
            this.Selection.StartPos++;
            if (this.Selection.StartPos >= this.Content.length) {
                this.Selection.StartPos = this.Content.length - 1;
            }
        }
        if (this.Selection.EndPos >= Pos) {
            this.Selection.EndPos++;
            if (this.Selection.EndPos >= this.Content.length) {
                this.Selection.EndPos = this.Content.length - 1;
            }
        }
        var NearPosLen = this.NearPosArray.length;
        for (var Index = 0; Index < NearPosLen; Index++) {
            var ParaNearPos = this.NearPosArray[Index];
            var ParaContentPos = ParaNearPos.NearPos.ContentPos;
            if (ParaContentPos.Data[0] >= Pos) {
                ParaContentPos.Data[0]++;
            }
        }
        for (var Id in this.SearchResults) {
            var ContentPos = this.SearchResults[Id].StartPos;
            if (ContentPos.Data[0] >= Pos) {
                ContentPos.Data[0]++;
            }
            ContentPos = this.SearchResults[Id].EndPos;
            if (ContentPos.Data[0] >= Pos) {
                ContentPos.Data[0]++;
            }
        }
        var SpellingsCount = this.SpellChecker.Elements.length;
        for (var Pos = 0; Pos < SpellingsCount; Pos++) {
            var Element = this.SpellChecker.Elements[Pos];
            var ContentPos = Element.StartPos;
            if (ContentPos.Data[0] >= Pos) {
                ContentPos.Data[0]++;
            }
            ContentPos = Element.EndPos;
            if (ContentPos.Data[0] >= Pos) {
                ContentPos.Data[0]++;
            }
        }
        this.SpellChecker.Update_OnAdd(this, Pos, Item);
        Item.Set_Paragraph(this);
    },
    Add_ToContent: function (Pos, Item) {
        this.Internal_Content_Add(Pos, Item);
    },
    Remove_FromContent: function (Pos, Count) {
        this.Internal_Content_Remove2(Pos, Count);
    },
    Internal_Content_Concat: function (Items) {
        var StartPos = this.Content.length;
        this.Content = this.Content.concat(Items);
        History.Add(this, {
            Type: historyitem_Paragraph_AddItem,
            Pos: StartPos,
            EndPos: this.Content.length - 1,
            Items: Items
        });
        for (var CurPos = StartPos; CurPos < this.Content.length; CurPos++) {
            this.Content[CurPos].Set_Paragraph(this);
            if (this.Content[CurPos].Recalc_RunsCompiledPr) {
                this.Content[CurPos].Recalc_RunsCompiledPr();
            }
        }
        this.RecalcInfo.Set_Type_0_Spell(pararecalc_0_Spell_All);
    },
    Internal_Content_Remove: function (Pos) {
        var Item = this.Content[Pos];
        History.Add(this, {
            Type: historyitem_Paragraph_RemoveItem,
            Pos: Pos,
            EndPos: Pos,
            Items: [Item]
        });
        this.Content.splice(Pos, 1);
        if (this.Selection.StartPos > Pos) {
            this.Selection.StartPos--;
            if (this.Selection.StartPos < 0) {
                this.Selection.StartPos = 0;
            }
        }
        if (this.Selection.EndPos >= Pos) {
            this.Selection.EndPos--;
            if (this.Selection.EndPos < 0) {
                this.Selection.EndPos = 0;
            }
        }
        if (this.CurPos.ContentPos > Pos) {
            this.CurPos.ContentPos--;
            if (this.CurPos.ContentPos < 0) {
                this.CurPos.ContentPos = 0;
            }
        }
        var NearPosLen = this.NearPosArray.length;
        for (var Index = 0; Index < NearPosLen; Index++) {
            var ParaNearPos = this.NearPosArray[Index];
            var ParaContentPos = ParaNearPos.NearPos.ContentPos;
            if (ParaContentPos.Data[0] > Pos) {
                ParaContentPos.Data[0]--;
            }
        }
        for (var Id in this.SearchResults) {
            var ContentPos = this.SearchResults[Id].StartPos;
            if (ContentPos.Data[0] > Pos) {
                ContentPos.Data[0]--;
            }
            ContentPos = this.SearchResults[Id].EndPos;
            if (ContentPos.Data[0] > Pos) {
                ContentPos.Data[0]--;
            }
        }
        if (true === this.DeleteCommentOnRemove && para_Comment === Item.Type) {
            this.LogicDocument.Remove_Comment(Item.CommentId, true, false);
        }
        var SpellingsCount = this.SpellChecker.Elements.length;
        for (var Pos = 0; Pos < SpellingsCount; Pos++) {
            var Element = this.SpellChecker.Elements[Pos];
            var ContentPos = Element.StartPos;
            if (ContentPos.Data[0] > Pos) {
                ContentPos.Data[0]--;
            }
            ContentPos = Element.EndPos;
            if (ContentPos.Data[0] > Pos) {
                ContentPos.Data[0]--;
            }
        }
        this.SpellChecker.Update_OnRemove(this, Pos, 1);
    },
    Internal_Content_Remove2: function (Pos, Count) {
        var CommentsToDelete = [];
        if (true === this.DeleteCommentOnRemove && null !== this.LogicDocument) {
            var DocumentComments = this.LogicDocument.Comments;
            for (var Index = Pos; Index < Pos + Count; Index++) {
                var Item = this.Content[Index];
                if (para_Comment === Item.Type) {
                    var CommentId = Item.CommentId;
                    var Comment = DocumentComments.Get_ById(CommentId);
                    if (null != Comment) {
                        if (true === Item.Start) {
                            Comment.Set_StartId(null);
                        } else {
                            Comment.Set_EndId(null);
                        }
                    }
                    CommentsToDelete.push(CommentId);
                }
            }
        }
        var DeletedItems = this.Content.slice(Pos, Pos + Count);
        History.Add(this, {
            Type: historyitem_Paragraph_RemoveItem,
            Pos: Pos,
            EndPos: Pos + Count - 1,
            Items: DeletedItems
        });
        if (this.Selection.StartPos > Pos + Count) {
            this.Selection.StartPos -= Count;
        } else {
            if (this.Selection.StartPos > Pos) {
                this.Selection.StartPos = Pos;
            }
        }
        if (this.Selection.EndPos > Pos + Count) {
            this.Selection.EndPos -= Count;
        }
        if (this.Selection.EndPos > Pos) {
            this.Selection.EndPos = Pos;
        }
        if (this.CurPos.ContentPos > Pos + Count) {
            this.CurPos.ContentPos -= Count;
        } else {
            if (this.CurPos.ContentPos > Pos) {
                this.CurPos.ContentPos = Pos;
            }
        }
        var NearPosLen = this.NearPosArray.length;
        for (var Index = 0; Index < NearPosLen; Index++) {
            var ParaNearPos = this.NearPosArray[Index];
            var ParaContentPos = ParaNearPos.NearPos.ContentPos;
            if (ParaContentPos.Data[0] > Pos + Count) {
                ParaContentPos.Data[0] -= Count;
            } else {
                if (ParaContentPos.Data[0] > Pos) {
                    ParaContentPos.Data[0] = Math.max(0, Pos);
                }
            }
        }
        this.Content.splice(Pos, Count);
        var CountCommentsToDelete = CommentsToDelete.length;
        for (var Index = 0; Index < CountCommentsToDelete; Index++) {
            this.LogicDocument.Remove_Comment(CommentsToDelete[Index], true, false);
        }
        this.SpellChecker.Update_OnRemove(this, Pos, Count);
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
    Get_CurrentParaPos: function () {
        var ParaPos = this.Content[this.CurPos.ContentPos].Get_CurrentParaPos();
        if (-1 !== this.CurPos.Line) {
            ParaPos.Line = this.CurPos.Line;
            ParaPos.Range = this.CurPos.Range;
        }
        ParaPos.Page = this.Get_PageByLine(ParaPos.Line);
        return ParaPos;
    },
    Get_PageByLine: function (LineIndex) {
        for (var CurPage = this.Pages.length - 1; CurPage >= 0; CurPage--) {
            var Page = this.Pages[CurPage];
            if (LineIndex >= Page.StartLine && LineIndex <= Page.EndLine) {
                return CurPage;
            }
        }
        return 0;
    },
    Get_ParaPosByContentPos: function (ContentPos) {
        var ParaPos = this.Content[ContentPos.Get(0)].Get_ParaPosByContentPos(ContentPos, 1);
        var CurLine = ParaPos.Line;
        var PagesCount = this.Pages.length;
        for (var CurPage = PagesCount - 1; CurPage >= 0; CurPage--) {
            var Page = this.Pages[CurPage];
            if (CurLine >= Page.StartLine && CurLine <= Page.EndLine) {
                ParaPos.Page = CurPage;
                return ParaPos;
            }
        }
        return ParaPos;
    },
    Check_Range_OnlyMath: function (CurRange, CurLine) {
        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos = this.Lines[CurLine].Ranges[CurRange].EndPos;
        var Checker = new CParagraphMathRangeChecker();
        for (var Pos = StartPos; Pos <= EndPos; Pos++) {
            this.Content[Pos].Check_Range_OnlyMath(Checker, CurRange, CurLine);
            if (false === Checker.Result) {
                break;
            }
        }
        if (true !== Checker.Result || null === Checker.Math || true === Checker.Math.Get_Inline()) {
            return null;
        }
        return Checker.Math;
    },
    Check_MathPara: function (MathPos) {
        if (undefined === this.Content[MathPos] || para_Math !== this.Content[MathPos].Type) {
            return false;
        }
        var MathParaChecker = new CParagraphMathParaChecker();
        MathParaChecker.Direction = -1;
        for (var CurPos = MathPos - 1; CurPos >= 0; CurPos--) {
            if (this.Content[CurPos].Check_MathPara) {
                this.Content[CurPos].Check_MathPara(MathParaChecker);
                if (false !== MathParaChecker.Found) {
                    break;
                }
            }
        }
        if (true !== MathParaChecker.Found && undefined !== this.Numbering_Get()) {
            return false;
        }
        if (true !== MathParaChecker.Result) {
            return false;
        }
        MathParaChecker.Direction = 1;
        MathParaChecker.Found = false;
        var Count = this.Content.length;
        for (var CurPos = MathPos + 1; CurPos < Count; CurPos++) {
            if (this.Content[CurPos].Check_MathPara) {
                this.Content[CurPos].Check_MathPara(MathParaChecker);
                if (false !== MathParaChecker.Found) {
                    break;
                }
            }
        }
        if (true !== MathParaChecker.Result) {
            return false;
        }
        return true;
    },
    Get_EndInfo: function () {
        var PagesCount = this.Pages.length;
        if (PagesCount > 0) {
            return this.Pages[PagesCount - 1].EndInfo.Copy();
        } else {
            return null;
        }
    },
    Get_EndInfoByPage: function (CurPage) {
        if (CurPage < 0) {
            return this.Parent.Get_PrevElementEndInfo(this);
        } else {
            return this.Pages[CurPage].EndInfo.Copy();
        }
    },
    Recalculate_PageEndInfo: function (PRSW, CurPage) {
        var PrevInfo = (0 === CurPage ? this.Parent.Get_PrevElementEndInfo(this) : this.Pages[CurPage - 1].EndInfo.Copy());
        var PRSI = this.m_oPRSI;
        PRSI.Reset(PrevInfo);
        var StartLine = this.Pages[CurPage].StartLine;
        var EndLine = this.Pages[CurPage].EndLine;
        var LinesCount = this.Lines.length;
        for (var CurLine = StartLine; CurLine <= EndLine; CurLine++) {
            var RangesCount = this.Lines[CurLine].Ranges.length;
            for (var CurRange = 0; CurRange < RangesCount; CurRange++) {
                var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
                var EndPos = this.Lines[CurLine].Ranges[CurRange].EndPos;
                for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
                    this.Content[CurPos].Recalculate_PageEndInfo(PRSI, CurLine, CurRange);
                }
            }
        }
        this.Pages[CurPage].EndInfo.Comments = PRSI.Comments;
        if (PRSW) {
            this.Pages[CurPage].EndInfo.RunRecalcInfo = PRSW.RunRecalcInfoBreak;
        }
    },
    Update_EndInfo: function () {
        for (var CurPage = 0, PagesCount = this.Pages.length; CurPage < PagesCount; CurPage++) {
            this.Recalculate_PageEndInfo(null, CurPage);
        }
    },
    Recalculate_Drawing_AddPageBreak: function (CurLine, CurPage, RemoveDrawings) {
        if (true === RemoveDrawings) {
            for (var TempPage = 0; TempPage <= CurPage; TempPage++) {
                var DrawingsLen = this.Pages[TempPage].Drawings.length;
                for (var CurPos = 0; CurPos < DrawingsLen; CurPos++) {
                    var Item = this.Pages[TempPage].Drawings[CurPos];
                    this.Parent.DrawingObjects.removeById(Item.PageNum, Item.Get_Id());
                }
                this.Pages[TempPage].Drawings = [];
            }
        }
        this.Pages[CurPage].Set_EndLine(CurLine - 1);
        if (0 === CurLine) {
            this.Lines[-1] = new CParaLine(0);
        }
    },
    Check_PageBreak: function () {
        var Count = this.Content.length;
        for (var Pos = 0; Pos < Count; Pos++) {
            if (true === this.Content[Pos].Check_PageBreak()) {
                return true;
            }
        }
        return false;
    },
    Check_BreakPageEnd: function (Item) {
        var PBChecker = new CParagraphCheckPageBreakEnd(Item);
        var ContentLen = this.Content.length;
        for (var CurPos = 0; CurPos < ContentLen; CurPos++) {
            var Element = this.Content[CurPos];
            if (true !== Element.Check_BreakPageEnd(PBChecker)) {
                return false;
            }
        }
        return true;
    },
    Internal_Recalculate_CurPos: function (Pos, UpdateCurPos, UpdateTarget, ReturnTarget) {
        if (this.Lines.length <= 0) {
            return {
                X: 0,
                Y: 0,
                Height: 0,
                Internal: {
                    Line: 0,
                    Page: 0,
                    Range: 0
                }
            };
        }
        var LinePos = this.Get_CurrentParaPos();
        if (-1 === LinePos.Line) {
            return {
                X: 0,
                Y: 0,
                Height: 0,
                Internal: {
                    Line: 0,
                    Page: 0,
                    Range: 0
                }
            };
        }
        var CurLine = LinePos.Line;
        var CurRange = LinePos.Range;
        var CurPage = LinePos.Page;
        if (-1 != this.CurPos.Line) {
            CurLine = this.CurPos.Line;
            CurRange = this.CurPos.Range;
        }
        var X = this.Lines[CurLine].Ranges[CurRange].XVisible;
        var Y = this.Pages[CurPage].Y + this.Lines[CurLine].Y;
        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos = this.Lines[CurLine].Ranges[CurRange].EndPos;
        if (true === this.Numbering.Check_Range(CurRange, CurLine)) {
            X += this.Numbering.WidthVisible;
        }
        for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
            var Item = this.Content[CurPos];
            var Res = Item.Recalculate_CurPos(X, Y, (CurPos === this.CurPos.ContentPos ? true : false), CurRange, CurLine, CurPage, UpdateCurPos, UpdateTarget, ReturnTarget);
            if (CurPos === this.CurPos.ContentPos) {
                return Res;
            } else {
                X = Res.X;
            }
        }
        return {
            X: X,
            Y: Y,
            PageNum: CurPage + this.Get_StartPage_Absolute(),
            Internal: {
                Line: CurLine,
                Page: CurPage,
                Range: CurRange
            }
        };
    },
    Internal_UpdateCurPos: function (X, Y, CurPos, CurLine, CurPage, UpdateTarget) {
        this.CurPos.X = X;
        this.CurPos.Y = Y;
        this.CurPos.PagesPos = CurPage;
        if (true === UpdateTarget) {
            var CurTextPr = this.Internal_CalculateTextPr(CurPos);
            g_oTextMeasurer.SetTextPr(CurTextPr, this.Get_Theme());
            g_oTextMeasurer.SetFontSlot(fontslot_ASCII, CurTextPr.Get_FontKoef());
            var Height = g_oTextMeasurer.GetHeight();
            var Descender = Math.abs(g_oTextMeasurer.GetDescender());
            var Ascender = Height - Descender;
            this.DrawingDocument.SetTargetSize(Height);
            if (true === CurTextPr.Color.Auto) {
                var Pr = this.Get_CompiledPr();
                var BgColor = undefined;
                if (undefined !== Pr.ParaPr.Shd && shd_Nil !== Pr.ParaPr.Shd.Value) {
                    if (Pr.ParaPr.Shd.Unifill) {
                        Pr.ParaPr.Shd.Unifill.check(this.Get_Theme(), this.Get_ColorMap());
                        var RGBA = Pr.ParaPr.Shd.Unifill.getRGBAColor();
                        BgColor = new CDocumentColor(RGBA.R, RGBA.G, RGBA.B, false);
                    } else {
                        BgColor = Pr.ParaPr.Shd.Color;
                    }
                } else {
                    BgColor = this.Parent.Get_TextBackGroundColor();
                }
                var AutoColor = (undefined != BgColor && false === BgColor.Check_BlackAutoColor() ? new CDocumentColor(255, 255, 255, false) : new CDocumentColor(0, 0, 0, false));
                this.DrawingDocument.SetTargetColor(AutoColor.r, AutoColor.g, AutoColor.b);
            } else {
                this.DrawingDocument.SetTargetColor(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b);
            }
            var TargetY = Y - Ascender - CurTextPr.Position;
            switch (CurTextPr.VertAlign) {
            case vertalign_SubScript:
                TargetY -= CurTextPr.FontSize * g_dKoef_pt_to_mm * vertalign_Koef_Sub;
                break;
            case vertalign_SuperScript:
                TargetY -= CurTextPr.FontSize * g_dKoef_pt_to_mm * vertalign_Koef_Super;
                break;
            }
            var Page_Abs = this.Get_StartPage_Absolute() + CurPage;
            this.DrawingDocument.UpdateTarget(X, TargetY, Page_Abs);
            if (undefined != this.Get_FramePr()) {
                var __Y0 = TargetY,
                __Y1 = TargetY + Height;
                var ___Y0 = this.Pages[CurPage].Y + this.Lines[CurLine].Top;
                var ___Y1 = this.Pages[CurPage].Y + this.Lines[CurLine].Bottom;
                var __Y0 = Math.max(__Y0, ___Y0);
                var __Y1 = Math.min(__Y1, ___Y1);
                this.DrawingDocument.SetTargetSize(__Y1 - __Y0);
                this.DrawingDocument.UpdateTarget(X, __Y0, Page_Abs);
            }
        }
    },
    Internal_CompareBrd: function (Pr1, Pr2) {
        var Left_1 = Math.min(Pr1.Ind.Left, Pr1.Ind.Left + Pr1.Ind.FirstLine);
        var Right_1 = Pr1.Ind.Right;
        var Left_2 = Math.min(Pr2.Ind.Left, Pr2.Ind.Left + Pr2.Ind.FirstLine);
        var Right_2 = Pr2.Ind.Right;
        if (Math.abs(Left_1 - Left_2) > 0.001 || Math.abs(Right_1 - Right_2) > 0.001) {
            return false;
        }
        if (false === Pr1.Brd.Top.Compare(Pr2.Brd.Top) || false === Pr1.Brd.Bottom.Compare(Pr2.Brd.Bottom) || false === Pr1.Brd.Left.Compare(Pr2.Brd.Left) || false === Pr1.Brd.Right.Compare(Pr2.Brd.Right) || false === Pr1.Brd.Between.Compare(Pr2.Brd.Between)) {
            return false;
        }
        return true;
    },
    Internal_GetTabPos: function (X, ParaPr, CurPage) {
        var PRS = this.m_oPRSW;
        var PageStart = this.Parent.Get_PageContentStartPos(this.PageNum + CurPage, this.Index);
        if (undefined != this.Get_FramePr()) {
            PageStart.X = 0;
        } else {
            if (PRS.RangesCount > 0 && Math.abs(PRS.Ranges[0].X0 - PageStart.X) < 0.001) {
                PageStart.X = PRS.Ranges[0].X1;
            }
        }
        var TabsCount = ParaPr.Tabs.Get_Count();
        var TabsPos = [];
        var bCheckLeft = true;
        for (var Index = 0; Index < TabsCount; Index++) {
            var Tab = ParaPr.Tabs.Get(Index);
            var TabPos = Tab.Pos + PageStart.X;
            if (true === bCheckLeft && TabPos > PageStart.X + ParaPr.Ind.Left - 0.001) {
                TabsPos.push(new CParaTab(tab_Left, ParaPr.Ind.Left - 0.001));
                bCheckLeft = false;
            }
            if (tab_Clear != Tab.Value) {
                TabsPos.push(Tab);
            }
        }
        if (true === bCheckLeft) {
            TabsPos.push(new CParaTab(tab_Left, ParaPr.Ind.Left - 0.001));
        }
        TabsCount = TabsPos.length;
        var Tab = null;
        for (var Index = 0; Index < TabsCount; Index++) {
            var TempTab = TabsPos[Index];
            if (X < TempTab.Pos + PageStart.X + 0.001) {
                Tab = TempTab;
                break;
            }
        }
        var NewX = 0;
        if (null === Tab) {
            if (X < PageStart.X + ParaPr.Ind.Left) {
                NewX = PageStart.X + ParaPr.Ind.Left;
            } else {
                NewX = PageStart.X;
                while (X >= NewX - 0.001) {
                    NewX += Default_Tab_Stop;
                }
            }
        } else {
            NewX = Tab.Pos + PageStart.X + 0.001;
        }
        return {
            NewX: NewX,
            TabValue: (null === Tab ? tab_Left : Tab.Value)
        };
    },
    Internal_Is_NullBorders: function (Borders) {
        if (border_None != Borders.Top.Value || border_None != Borders.Bottom.Value || border_None != Borders.Left.Value || border_None != Borders.Right.Value || border_None != Borders.Between.Value) {
            return false;
        }
        return true;
    },
    Internal_Check_Ranges: function (CurLine, CurRange) {
        var Ranges = this.Lines[CurLine].Ranges;
        var RangesCount = Ranges.length;
        if (RangesCount <= 1) {
            return true;
        } else {
            if (2 === RangesCount) {
                var Range0 = Ranges[0];
                var Range1 = Ranges[1];
                if (Range0.XEnd - Range0.X < 0.001 && 1 === CurRange && Range1.XEnd - Range1.X >= 0.001) {
                    return true;
                } else {
                    if (Range1.XEnd - Range1.X < 0.001 && 0 === CurRange && Range0.XEnd - Range0.X >= 0.001) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                if (3 === RangesCount && 1 === CurRange) {
                    var Range0 = Ranges[0];
                    var Range2 = Ranges[2];
                    if (Range0.XEnd - Range0.X < 0.001 && Range2.XEnd - Range2.X < 0.001) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        }
    },
    Internal_Get_NumberingTextPr: function () {
        var Pr = this.Get_CompiledPr();
        var ParaPr = Pr.ParaPr;
        var NumPr = ParaPr.NumPr;
        if (undefined === NumPr || undefined === NumPr.NumId || 0 === NumPr.NumId || "0" === NumPr.NumId) {
            return new CTextPr();
        }
        var Numbering = this.Parent.Get_Numbering();
        var NumLvl = Numbering.Get_AbstractNum(NumPr.NumId).Lvl[NumPr.Lvl];
        var NumTextPr = this.Get_CompiledPr2(false).TextPr.Copy();
        NumTextPr.Merge(this.TextPr.Value);
        NumTextPr.Merge(NumLvl.TextPr);
        NumTextPr.FontFamily.Name = NumTextPr.RFonts.Ascii.Name;
        return NumTextPr;
    },
    Is_EmptyRange: function (CurLine, CurRange) {
        var Line = this.Lines[CurLine];
        var Range = Line.Ranges[CurRange];
        var StartPos = Range.StartPos;
        var EndPos = Range.EndPos;
        for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
            if (false === this.Content[CurPos].Is_EmptyRange(CurLine, CurRange)) {
                return false;
            }
        }
        return true;
    },
    Reset_RecalculateCache: function () {},
    RecalculateCurPos: function () {
        return this.Internal_Recalculate_CurPos(this.CurPos.ContentPos, true, true, false);
    },
    Recalculate_MinMaxContentWidth: function () {
        var MinMax = new CParagraphMinMaxContentWidth();
        var Count = this.Content.length;
        for (var Pos = 0; Pos < Count; Pos++) {
            var Item = this.Content[Pos];
            Item.Set_Paragraph(this);
            Item.Recalculate_MinMaxContentWidth(MinMax);
        }
        return {
            Min: (MinMax.nMinWidth > 0 ? MinMax.nMinWidth + 0.001 : 0),
            Max: (MinMax.nMaxWidth > 0 ? MinMax.nMaxWidth + 0.001 : 0)
        };
    },
    Draw: function (PageNum, pGraphics) {
        var CurPage = PageNum - this.PageNum;
        if (this.Pages[CurPage].EndLine < 0) {
            return;
        }
        var Pr = this.Get_CompiledPr();
        if (true !== this.Is_Inline()) {
            var FramePr = this.Get_FramePr();
            if (undefined != FramePr && this.Parent instanceof CDocument) {
                var PixelError = editor.WordControl.m_oLogicDocument.DrawingDocument.GetMMPerDot(1);
                var BoundsL = this.CalculatedFrame.L2 - PixelError;
                var BoundsT = this.CalculatedFrame.T2 - PixelError;
                var BoundsH = this.CalculatedFrame.H2 + 2 * PixelError;
                var BoundsW = this.CalculatedFrame.W2 + 2 * PixelError;
                pGraphics.SaveGrState();
                pGraphics.AddClipRect(BoundsL, BoundsT, BoundsW, BoundsH);
            }
        }
        var Theme = this.Get_Theme();
        var ColorMap = this.Get_ColorMap();
        var BgColor = undefined;
        if (undefined !== Pr.ParaPr.Shd && shd_Nil !== Pr.ParaPr.Shd.Value && true !== Pr.ParaPr.Shd.Color.Auto) {
            if (Pr.ParaPr.Shd.Unifill) {
                Pr.ParaPr.Shd.Unifill.check(this.Get_Theme(), this.Get_ColorMap());
                var RGBA = Pr.ParaPr.Shd.Unifill.getRGBAColor();
                BgColor = new CDocumentColor(RGBA.R, RGBA.G, RGBA.B, false);
            } else {
                BgColor = Pr.ParaPr.Shd.Color;
            }
        } else {
            BgColor = this.Parent.Get_TextBackGroundColor();
        }
        this.Internal_Draw_1(CurPage, pGraphics, Pr);
        this.Internal_Draw_2(CurPage, pGraphics, Pr);
        this.Internal_Draw_3(CurPage, pGraphics, Pr);
        this.Internal_Draw_4(CurPage, pGraphics, Pr, BgColor, Theme, ColorMap);
        this.Internal_Draw_5(CurPage, pGraphics, Pr, BgColor);
        this.Internal_Draw_6(CurPage, pGraphics, Pr);
        if (undefined != FramePr && this.Parent instanceof CDocument) {
            pGraphics.RestoreGrState();
        }
    },
    Internal_Draw_1: function (CurPage, pGraphics, Pr) {
        if (this.bFromDocument) {
            if (locktype_None != this.Lock.Get_Type()) {
                if ((CurPage > 0 || false === this.Is_StartFromNewPage() || null === this.Get_DocumentPrev())) {
                    var X_min = -1 + Math.min(this.Pages[CurPage].X, this.Pages[CurPage].X + Pr.ParaPr.Ind.Left, this.Pages[CurPage].X + Pr.ParaPr.Ind.Left + Pr.ParaPr.Ind.FirstLine);
                    var Y_top = this.Pages[CurPage].Bounds.Top;
                    var Y_bottom = this.Pages[CurPage].Bounds.Bottom;
                    if (true === editor.isCoMarksDraw || locktype_Mine != this.Lock.Get_Type()) {
                        pGraphics.DrawLockParagraph(this.Lock.Get_Type(), X_min, Y_top, Y_bottom);
                    }
                }
            }
        }
    },
    Internal_Draw_2: function (CurPage, pGraphics, Pr) {
        if (this.bFromDocument && true === editor.ShowParaMarks && ((0 === CurPage && (this.Pages.length <= 1 || this.Pages[1].FirstLine > 0)) || (1 === CurPage && this.Pages.length > 1 && this.Pages[1].FirstLine === 0)) && (true === Pr.ParaPr.KeepNext || true === Pr.ParaPr.KeepLines || true === Pr.ParaPr.PageBreakBefore)) {
            var SpecFont = {
                FontFamily: {
                    Name: "Arial",
                    Index: -1
                },
                FontSize: 12,
                Italic: false,
                Bold: false
            };
            var SpecSym = String.fromCharCode(9642);
            pGraphics.SetFont(SpecFont);
            pGraphics.b_color1(0, 0, 0, 255);
            var CurLine = this.Pages[CurPage].FirstLine;
            var CurRange = 0;
            var X = this.Lines[CurLine].Ranges[CurRange].XVisible;
            var Y = this.Pages[CurPage].Y + this.Lines[CurLine].Y;
            var SpecW = 2.5;
            var SpecX = Math.min(X, this.X) - SpecW;
            pGraphics.FillText(SpecX, Y, SpecSym);
        }
    },
    Internal_Draw_3: function (CurPage, pGraphics, Pr) {
        if (!this.bFromDocument) {
            return;
        }
        var bDrawBorders = this.Is_NeedDrawBorders();
        var PDSH = g_oPDSH;
        var _Page = this.Pages[CurPage];
        var DocumentComments = editor.WordControl.m_oLogicDocument.Comments;
        var Page_abs = CurPage + this.Get_StartPage_Absolute();
        var DrawComm = (DocumentComments.Is_Use() && true != editor.isViewMode);
        var DrawFind = editor.WordControl.m_oLogicDocument.SearchEngine.Selection;
        var DrawColl = (undefined === pGraphics.RENDERER_PDF_FLAG ? false : true);
        PDSH.Reset(this, pGraphics, DrawColl, DrawFind, DrawComm, this.Get_EndInfoByPage(CurPage - 1));
        var StartLine = _Page.StartLine;
        var EndLine = _Page.EndLine;
        for (var CurLine = StartLine; CurLine <= EndLine; CurLine++) {
            var _Line = this.Lines[CurLine];
            var _LineMetrics = _Line.Metrics;
            var EndLinePos = _Line.EndPos;
            var Y0 = (_Page.Y + _Line.Y - _LineMetrics.Ascent);
            var Y1 = (_Page.Y + _Line.Y + _LineMetrics.Descent);
            if (_LineMetrics.LineGap < 0) {
                Y1 += _LineMetrics.LineGap;
            }
            var RangesCount = _Line.Ranges.length;
            for (var CurRange = 0; CurRange < RangesCount; CurRange++) {
                var _Range = _Line.Ranges[CurRange];
                var X = _Range.XVisible;
                var StartPos = _Range.StartPos;
                var EndPos = _Range.EndPos;
                PDSH.Reset_Range(CurPage, CurLine, CurRange, X, Y0, Y1, _Range.Spaces);
                if (true === this.Numbering.Check_Range(CurRange, CurLine)) {
                    var NumberingType = this.Numbering.Type;
                    var NumberingItem = this.Numbering;
                    if (para_Numbering === NumberingType) {
                        var NumPr = Pr.ParaPr.NumPr;
                        if (undefined === NumPr || undefined === NumPr.NumId || 0 === NumPr.NumId || "0" === NumPr.NumId) {} else {
                            var Numbering = this.Parent.Get_Numbering();
                            var NumLvl = Numbering.Get_AbstractNum(NumPr.NumId).Lvl[NumPr.Lvl];
                            var NumJc = NumLvl.Jc;
                            var NumTextPr = this.Get_CompiledPr2(false).TextPr.Copy();
                            NumTextPr.Merge(this.TextPr.Value);
                            NumTextPr.Merge(NumLvl.TextPr);
                            var X_start = X;
                            if (align_Right === NumJc) {
                                X_start = X - NumberingItem.WidthNum;
                            } else {
                                if (align_Center === NumJc) {
                                    X_start = X - NumberingItem.WidthNum / 2;
                                }
                            }
                            if (highlight_None != NumTextPr.HighLight) {
                                PDSH.High.Add(Y0, Y1, X_start, X_start + NumberingItem.WidthNum + NumberingItem.WidthSuff, 0, NumTextPr.HighLight.r, NumTextPr.HighLight.g, NumTextPr.HighLight.b);
                            }
                        }
                    }
                    PDSH.X += this.Numbering.WidthVisible;
                }
                for (var Pos = StartPos; Pos <= EndPos; Pos++) {
                    var Item = this.Content[Pos];
                    Item.Draw_HighLights(PDSH);
                }
                if ((_Range.W > 0.001 || true === this.IsEmpty() || true !== this.Is_EmptyRange(CurLine, CurRange)) && ((this.Pages.length - 1 === CurPage) || (CurLine < this.Pages[CurPage + 1].FirstLine)) && shd_Clear === Pr.ParaPr.Shd.Value && (Pr.ParaPr.Shd.Unifill || (Pr.ParaPr.Shd.Color && true !== Pr.ParaPr.Shd.Color.Auto))) {
                    var TempX0 = this.Lines[CurLine].Ranges[CurRange].X;
                    if (0 === CurRange) {
                        TempX0 = Math.min(TempX0, this.Pages[CurPage].X + Pr.ParaPr.Ind.Left, this.Pages[CurPage].X + Pr.ParaPr.Ind.Left + Pr.ParaPr.Ind.FirstLine);
                    }
                    var TempX1 = this.Lines[CurLine].Ranges[CurRange].XEnd;
                    var TempTop = this.Lines[CurLine].Top;
                    var TempBottom = this.Lines[CurLine].Bottom;
                    if (0 === CurLine) {
                        var PrevEl = this.Get_DocumentPrev();
                        var PrevPr = null;
                        var PrevLeft = 0;
                        var PrevRight = 0;
                        var CurLeft = Math.min(Pr.ParaPr.Ind.Left, Pr.ParaPr.Ind.Left + Pr.ParaPr.Ind.FirstLine);
                        var CurRight = Pr.ParaPr.Ind.Right;
                        if (null != PrevEl && type_Paragraph === PrevEl.GetType()) {
                            PrevPr = PrevEl.Get_CompiledPr2();
                            PrevLeft = Math.min(PrevPr.ParaPr.Ind.Left, PrevPr.ParaPr.Ind.Left + PrevPr.ParaPr.Ind.FirstLine);
                            PrevRight = PrevPr.ParaPr.Ind.Right;
                        }
                        if (true === Pr.ParaPr.Brd.First) {
                            if (null === PrevEl || true === this.Is_StartFromNewPage() || null === PrevPr || shd_Nil === PrevPr.ParaPr.Shd.Value || PrevLeft != CurLeft || CurRight != PrevRight || false === this.Internal_Is_NullBorders(PrevPr.ParaPr.Brd) || false === this.Internal_Is_NullBorders(Pr.ParaPr.Brd)) {
                                if (false === this.Is_StartFromNewPage() || null === PrevEl) {
                                    TempTop += Pr.ParaPr.Spacing.Before;
                                }
                            }
                        }
                    }
                    if (this.Lines.length - 1 === CurLine) {
                        var NextEl = this.Get_DocumentNext();
                        var NextPr = null;
                        var NextLeft = 0;
                        var NextRight = 0;
                        var CurLeft = Math.min(Pr.ParaPr.Ind.Left, Pr.ParaPr.Ind.Left + Pr.ParaPr.Ind.FirstLine);
                        var CurRight = Pr.ParaPr.Ind.Right;
                        if (null != NextEl && type_Paragraph === NextEl.GetType()) {
                            NextPr = NextEl.Get_CompiledPr2();
                            NextLeft = Math.min(NextPr.ParaPr.Ind.Left, NextPr.ParaPr.Ind.Left + NextPr.ParaPr.Ind.FirstLine);
                            NextRight = NextPr.ParaPr.Ind.Right;
                        }
                        if (null != NextEl && type_Paragraph === NextEl.GetType() && true === NextEl.Is_StartFromNewPage()) {
                            TempBottom = this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
                        } else {
                            if (true === Pr.ParaPr.Brd.Last) {
                                if (null === NextEl || true === NextEl.Is_StartFromNewPage() || null === NextPr || shd_Nil === NextPr.ParaPr.Shd.Value || NextLeft != CurLeft || CurRight != NextRight || false === this.Internal_Is_NullBorders(NextPr.ParaPr.Brd) || false === this.Internal_Is_NullBorders(Pr.ParaPr.Brd)) {
                                    TempBottom -= Pr.ParaPr.Spacing.After;
                                }
                            }
                        }
                    }
                    if (0 === CurRange) {
                        if (Pr.ParaPr.Brd.Left.Value === border_Single) {
                            TempX0 -= 1 + Pr.ParaPr.Brd.Left.Size + Pr.ParaPr.Brd.Left.Space;
                        } else {
                            TempX0 -= 1;
                        }
                    }
                    if (this.Lines[CurLine].Ranges.length - 1 === CurRange) {
                        if (Pr.ParaPr.Brd.Right.Value === border_Single) {
                            TempX1 += 1 + Pr.ParaPr.Brd.Right.Size + Pr.ParaPr.Brd.Right.Space;
                        } else {
                            TempX1 += 1;
                        }
                    }
                    if (Pr.ParaPr.Shd.Unifill) {
                        Pr.ParaPr.Shd.Unifill.check(this.Get_Theme(), this.Get_ColorMap());
                        var RGBA = Pr.ParaPr.Shd.Unifill.getRGBAColor();
                        pGraphics.b_color1(RGBA.R, RGBA.G, RGBA.B, 255);
                    } else {
                        pGraphics.b_color1(Pr.ParaPr.Shd.Color.r, Pr.ParaPr.Shd.Color.g, Pr.ParaPr.Shd.Color.b, 255);
                    }
                    pGraphics.rect(TempX0, this.Pages[CurPage].Y + TempTop, TempX1 - TempX0, TempBottom - TempTop);
                    pGraphics.df();
                }
                var aShd = PDSH.Shd;
                var Element = aShd.Get_Next();
                while (null != Element) {
                    pGraphics.b_color1(Element.r, Element.g, Element.b, 255);
                    pGraphics.rect(Element.x0, Element.y0, Element.x1 - Element.x0, Element.y1 - Element.y0);
                    pGraphics.df();
                    Element = aShd.Get_Next();
                }
                var aHigh = PDSH.High;
                var Element = aHigh.Get_Next();
                while (null != Element) {
                    pGraphics.b_color1(Element.r, Element.g, Element.b, 255);
                    pGraphics.rect(Element.x0, Element.y0, Element.x1 - Element.x0, Element.y1 - Element.y0);
                    pGraphics.df();
                    Element = aHigh.Get_Next();
                }
                var aComm = PDSH.Comm;
                Element = (pGraphics.RENDERER_PDF_FLAG === true ? null : aComm.Get_Next());
                while (null != Element) {
                    if (Element.Additional.Active === true) {
                        pGraphics.b_color1(240, 200, 120, 255);
                    } else {
                        pGraphics.b_color1(248, 231, 195, 255);
                    }
                    pGraphics.rect(Element.x0, Element.y0, Element.x1 - Element.x0, Element.y1 - Element.y0);
                    pGraphics.df();
                    var TextTransform = this.Get_ParentTextTransform();
                    if (TextTransform) {
                        var _x0 = TextTransform.TransformPointX(Element.x0, Element.y0);
                        var _y0 = TextTransform.TransformPointY(Element.x0, Element.y0);
                        var _x1 = TextTransform.TransformPointX(Element.x1, Element.y1);
                        var _y1 = TextTransform.TransformPointY(Element.x1, Element.y1);
                        DocumentComments.Add_DrawingRect(_x0, _y0, _x1 - _x0, _y1 - _y0, Page_abs, Element.Additional.CommentId);
                    } else {
                        DocumentComments.Add_DrawingRect(Element.x0, Element.y0, Element.x1 - Element.x0, Element.y1 - Element.y0, Page_abs, Element.Additional.CommentId);
                    }
                    Element = aComm.Get_Next();
                }
                var aColl = PDSH.Coll;
                Element = aColl.Get_Next();
                while (null != Element) {
                    pGraphics.drawCollaborativeChanges(Element.x0, Element.y0, Element.x1 - Element.x0, Element.y1 - Element.y0, Element);
                    Element = aColl.Get_Next();
                }
                var aFind = PDSH.Find;
                Element = aFind.Get_Next();
                while (null != Element) {
                    pGraphics.drawSearchResult(Element.x0, Element.y0, Element.x1 - Element.x0, Element.y1 - Element.y0);
                    Element = aFind.Get_Next();
                }
            }
            if (true === bDrawBorders && ((this.Pages.length - 1 === CurPage) || (CurLine < this.Pages[CurPage + 1].FirstLine))) {
                var TempX0 = Math.min(this.Lines[CurLine].Ranges[0].X, this.Pages[CurPage].X + Pr.ParaPr.Ind.Left, this.Pages[CurPage].X + Pr.ParaPr.Ind.Left + Pr.ParaPr.Ind.FirstLine);
                var TempX1 = this.Lines[CurLine].Ranges[this.Lines[CurLine].Ranges.length - 1].XEnd;
                if (true === this.Is_LineDropCap()) {
                    TempX1 = TempX0 + this.Get_LineDropCapWidth();
                }
                var TempTop = this.Lines[CurLine].Top;
                var TempBottom = this.Lines[CurLine].Bottom;
                if (0 === CurLine) {
                    if (Pr.ParaPr.Brd.Top.Value === border_Single || shd_Clear === Pr.ParaPr.Shd.Value) {
                        if ((true === Pr.ParaPr.Brd.First && (0 === CurPage || true === this.Parent.Is_TableCellContent() || true === Pr.ParaPr.PageBreakBefore)) || (true !== Pr.ParaPr.Brd.First && ((0 === CurPage && null === this.Get_DocumentPrev()) || (1 === CurPage && true === this.Is_StartFromNewPage())))) {
                            TempTop += Pr.ParaPr.Spacing.Before;
                        }
                    }
                }
                if (this.Lines.length - 1 === CurLine) {
                    var NextEl = this.Get_DocumentNext();
                    if (null != NextEl && type_Paragraph === NextEl.GetType() && true === NextEl.Is_StartFromNewPage()) {
                        TempBottom = this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
                    } else {
                        if (true === Pr.ParaPr.Brd.Last && (Pr.ParaPr.Brd.Bottom.Value === border_Single || shd_Clear === Pr.ParaPr.Shd.Value)) {
                            TempBottom -= Pr.ParaPr.Spacing.After;
                        }
                    }
                }
                if (Pr.ParaPr.Brd.Right.Value === border_Single) {
                    var RGBA = Pr.ParaPr.Brd.Right.Get_Color(this);
                    pGraphics.p_color(RGBA.r, RGBA.g, RGBA.b, 255);
                    pGraphics.drawVerLine(c_oAscLineDrawingRule.Right, TempX1 + 1 + Pr.ParaPr.Brd.Right.Size + Pr.ParaPr.Brd.Right.Space, this.Pages[CurPage].Y + TempTop, this.Pages[CurPage].Y + TempBottom, Pr.ParaPr.Brd.Right.Size);
                }
                if (Pr.ParaPr.Brd.Left.Value === border_Single) {
                    var RGBA = Pr.ParaPr.Brd.Left.Get_Color(this);
                    pGraphics.p_color(RGBA.r, RGBA.g, RGBA.b, 255);
                    pGraphics.drawVerLine(c_oAscLineDrawingRule.Left, TempX0 - 1 - Pr.ParaPr.Brd.Left.Size - Pr.ParaPr.Brd.Left.Space, this.Pages[CurPage].Y + TempTop, this.Pages[CurPage].Y + TempBottom, Pr.ParaPr.Brd.Left.Size);
                }
            }
        }
    },
    Internal_Draw_4: function (CurPage, pGraphics, Pr, BgColor, Theme, ColorMap) {
        var PDSE = this.m_oPDSE;
        PDSE.Reset(this, pGraphics, BgColor, Theme, ColorMap);
        var StartLine = this.Pages[CurPage].StartLine;
        var EndLine = this.Pages[CurPage].EndLine;
        for (var CurLine = StartLine; CurLine <= EndLine; CurLine++) {
            var Line = this.Lines[CurLine];
            var RangesCount = Line.Ranges.length;
            for (var CurRange = 0; CurRange < RangesCount; CurRange++) {
                var Y = this.Pages[CurPage].Y + this.Lines[CurLine].Y;
                var X = this.Lines[CurLine].Ranges[CurRange].XVisible;
                var Range = Line.Ranges[CurRange];
                PDSE.Reset_Range(CurPage, CurLine, CurRange, X, Y);
                var StartPos = Range.StartPos;
                var EndPos = Range.EndPos;
                if (true === this.Numbering.Check_Range(CurRange, CurLine)) {
                    var NumberingItem = this.Numbering;
                    if (para_Numbering === NumberingItem.Type) {
                        var NumPr = Pr.ParaPr.NumPr;
                        if (undefined === NumPr || undefined === NumPr.NumId || 0 === NumPr.NumId || "0" === NumPr.NumId || (undefined !== this.Get_SectionPr() && true === this.IsEmpty())) {} else {
                            var Numbering = this.Parent.Get_Numbering();
                            var NumLvl = Numbering.Get_AbstractNum(NumPr.NumId).Lvl[NumPr.Lvl];
                            var NumSuff = NumLvl.Suff;
                            var NumJc = NumLvl.Jc;
                            var NumTextPr = this.Get_CompiledPr2(false).TextPr.Copy();
                            var TextPr_temp = this.TextPr.Value.Copy();
                            TextPr_temp.Underline = undefined;
                            NumTextPr.Merge(TextPr_temp);
                            NumTextPr.Merge(NumLvl.TextPr);
                            var X_start = X;
                            if (align_Right === NumJc) {
                                X_start = X - NumberingItem.WidthNum;
                            } else {
                                if (align_Center === NumJc) {
                                    X_start = X - NumberingItem.WidthNum / 2;
                                }
                            }
                            var AutoColor = (undefined != BgColor && false === BgColor.Check_BlackAutoColor() ? new CDocumentColor(255, 255, 255, false) : new CDocumentColor(0, 0, 0, false));
                            var RGBA;
                            if (NumTextPr.Unifill) {
                                NumTextPr.Unifill.check(PDSE.Theme, PDSE.ColorMap);
                                RGBA = NumTextPr.Unifill.getRGBAColor();
                                pGraphics.b_color1(RGBA.R, RGBA.G, RGBA.B, 255);
                            } else {
                                if (true === NumTextPr.Color.Auto) {
                                    pGraphics.b_color1(AutoColor.r, AutoColor.g, AutoColor.b, 255);
                                } else {
                                    pGraphics.b_color1(NumTextPr.Color.r, NumTextPr.Color.g, NumTextPr.Color.b, 255);
                                }
                            }
                            switch (NumJc) {
                            case align_Right:
                                NumberingItem.Draw(X - NumberingItem.WidthNum, Y, pGraphics, Numbering, NumTextPr, NumPr, PDSE.Theme);
                                break;
                            case align_Center:
                                NumberingItem.Draw(X - NumberingItem.WidthNum / 2, Y, pGraphics, Numbering, NumTextPr, NumPr, PDSE.Theme);
                                break;
                            case align_Left:
                                default:
                                NumberingItem.Draw(X, Y, pGraphics, Numbering, NumTextPr, NumPr, PDSE.Theme);
                                break;
                            }
                            if (true === editor.ShowParaMarks && numbering_suff_Tab === NumSuff) {
                                var TempWidth = NumberingItem.WidthSuff;
                                var TempRealWidth = 3.143;
                                var X1 = X;
                                switch (NumJc) {
                                case align_Right:
                                    break;
                                case align_Center:
                                    X1 += NumberingItem.WidthNum / 2;
                                    break;
                                case align_Left:
                                    default:
                                    X1 += NumberingItem.WidthNum;
                                    break;
                                }
                                var X0 = TempWidth / 2 - TempRealWidth / 2;
                                pGraphics.SetFont({
                                    FontFamily: {
                                        Name: "ASCW3",
                                        Index: -1
                                    },
                                    FontSize: 10,
                                    Italic: false,
                                    Bold: false
                                });
                                if (X0 > 0) {
                                    pGraphics.FillText2(X1 + X0, Y, String.fromCharCode(tab_Symbol), 0, TempWidth);
                                } else {
                                    pGraphics.FillText2(X1, Y, String.fromCharCode(tab_Symbol), TempRealWidth - TempWidth, TempWidth);
                                }
                            }
                            if (true === NumTextPr.Strikeout || true === NumTextPr.Underline) {
                                if (NumTextPr.Unifill) {
                                    pGraphics.p_color(RGBA.R, RGBA.G, RGBA.B, 255);
                                } else {
                                    if (true === NumTextPr.Color.Auto) {
                                        pGraphics.p_color(AutoColor.r, AutoColor.g, AutoColor.b, 255);
                                    } else {
                                        pGraphics.p_color(NumTextPr.Color.r, NumTextPr.Color.g, NumTextPr.Color.b, 255);
                                    }
                                }
                            }
                            if (true === NumTextPr.Strikeout) {
                                pGraphics.drawHorLine(0, (Y - NumTextPr.FontSize * g_dKoef_pt_to_mm * 0.27), X_start, X_start + NumberingItem.WidthNum, (NumTextPr.FontSize / 18) * g_dKoef_pt_to_mm);
                            }
                            if (true === NumTextPr.Underline) {
                                pGraphics.drawHorLine(0, (Y + this.Lines[CurLine].Metrics.TextDescent * 0.4), X_start, X_start + NumberingItem.WidthNum, (NumTextPr.FontSize / 18) * g_dKoef_pt_to_mm);
                            }
                        }
                    } else {
                        if (para_PresentationNumbering === this.Numbering.Type) {
                            if (true != this.IsEmpty()) {
                                if (Pr.ParaPr.Ind.FirstLine < 0) {
                                    NumberingItem.Draw(X, Y, pGraphics, this.Get_FirstTextPr(), PDSE);
                                } else {
                                    NumberingItem.Draw(this.X + Pr.ParaPr.Ind.Left, Y, pGraphics, this.Get_FirstTextPr(), PDSE);
                                }
                            }
                        }
                    }
                    PDSE.X += NumberingItem.WidthVisible;
                }
                for (var Pos = StartPos; Pos <= EndPos; Pos++) {
                    var Item = this.Content[Pos];
                    PDSE.CurPos.Update(Pos, 0);
                    Item.Draw_Elements(PDSE);
                }
            }
        }
    },
    Internal_Draw_5: function (CurPage, pGraphics, Pr, BgColor) {
        var PDSL = g_oPDSL;
        PDSL.Reset(this, pGraphics, BgColor);
        var Page = this.Pages[CurPage];
        var StartLine = Page.StartLine;
        var EndLine = Page.EndLine;
        PDSL.SpellingCounter = this.SpellChecker.Get_DrawingInfo(this.Get_PageStartPos(CurPage));
        for (var CurLine = StartLine; CurLine <= EndLine; CurLine++) {
            var Line = this.Lines[CurLine];
            var LineM = Line.Metrics;
            var Baseline = Page.Y + Line.Y;
            var UnderlineOffset = LineM.TextDescent * 0.4;
            PDSL.Reset_Line(CurPage, CurLine, Baseline, UnderlineOffset);
            var RangesCount = Line.Ranges.length;
            for (var CurRange = 0; CurRange < RangesCount; CurRange++) {
                var Range = Line.Ranges[CurRange];
                var X = Range.XVisible;
                PDSL.Reset_Range(CurRange, X, Range.Spaces);
                var StartPos = Range.StartPos;
                var EndPos = Range.EndPos;
                if (true === this.Numbering.Check_Range(CurRange, CurLine)) {
                    PDSL.X += this.Numbering.WidthVisible;
                }
                for (var Pos = StartPos; Pos <= EndPos; Pos++) {
                    PDSL.CurPos.Update(Pos, 0);
                    var Item = this.Content[Pos];
                    Item.Draw_Lines(PDSL);
                }
            }
            var aStrikeout = PDSL.Strikeout;
            var aDStrikeout = PDSL.DStrikeout;
            var aUnderline = PDSL.Underline;
            var aSpelling = PDSL.Spelling;
            var Element = aStrikeout.Get_Next();
            while (null != Element) {
                pGraphics.p_color(Element.r, Element.g, Element.b, 255);
                pGraphics.drawHorLine(c_oAscLineDrawingRule.Top, Element.y0, Element.x0, Element.x1, Element.w);
                Element = aStrikeout.Get_Next();
            }
            Element = aDStrikeout.Get_Next();
            while (null != Element) {
                pGraphics.p_color(Element.r, Element.g, Element.b, 255);
                pGraphics.drawHorLine2(c_oAscLineDrawingRule.Top, Element.y0, Element.x0, Element.x1, Element.w);
                Element = aDStrikeout.Get_Next();
            }
            aUnderline.Correct_w_ForUnderline();
            Element = aUnderline.Get_Next();
            while (null != Element) {
                pGraphics.p_color(Element.r, Element.g, Element.b, 255);
                pGraphics.drawHorLine(0, Element.y0, Element.x0, Element.x1, Element.w);
                Element = aUnderline.Get_Next();
            }
            if (this.bFromDocument && this.LogicDocument && true === this.LogicDocument.Spelling.Use) {
                pGraphics.p_color(255, 0, 0, 255);
                var SpellingW = editor.WordControl.m_oDrawingDocument.GetMMPerDot(1);
                Element = aSpelling.Get_Next();
                while (null != Element) {
                    pGraphics.DrawSpellingLine(Element.y0, Element.x0, Element.x1, SpellingW);
                    Element = aSpelling.Get_Next();
                }
            }
        }
    },
    Internal_Draw_6: function (CurPage, pGraphics, Pr) {
        if (true !== this.Is_NeedDrawBorders()) {
            return;
        }
        var bEmpty = this.IsEmpty();
        var X_left = Math.min(this.Pages[CurPage].X + Pr.ParaPr.Ind.Left, this.Pages[CurPage].X + Pr.ParaPr.Ind.Left + Pr.ParaPr.Ind.FirstLine);
        var X_right = this.Pages[CurPage].XLimit - Pr.ParaPr.Ind.Right;
        if (true === this.Is_LineDropCap()) {
            X_right = X_left + this.Get_LineDropCapWidth();
        }
        if (Pr.ParaPr.Brd.Left.Value === border_Single) {
            X_left -= 1 + Pr.ParaPr.Brd.Left.Space;
        } else {
            X_left -= 1;
        }
        if (Pr.ParaPr.Brd.Right.Value === border_Single) {
            X_right += 1 + Pr.ParaPr.Brd.Right.Space;
        } else {
            X_right += 1;
        }
        var LeftMW = -(border_Single === Pr.ParaPr.Brd.Left.Value ? Pr.ParaPr.Brd.Left.Size : 0);
        var RightMW = (border_Single === Pr.ParaPr.Brd.Right.Value ? Pr.ParaPr.Brd.Right.Size : 0);
        var RGBA;
        if (true === Pr.ParaPr.Brd.First && border_Single === Pr.ParaPr.Brd.Top.Value && ((0 === CurPage && (false === this.Is_StartFromNewPage() || null === this.Get_DocumentPrev())) || (1 === CurPage && true === this.Is_StartFromNewPage()))) {
            var Y_top = this.Pages[CurPage].Y;
            if (0 === CurPage || true === this.Parent.Is_TableCellContent() || true === Pr.ParaPr.PageBreakBefore) {
                Y_top += Pr.ParaPr.Spacing.Before;
            }
            RGBA = Pr.ParaPr.Brd.Top.Get_Color(this);
            pGraphics.p_color(RGBA.r, RGBA.g, RGBA.b, 255);
            var StartLine = this.Pages[CurPage].StartLine;
            var RangesCount = this.Lines[StartLine].Ranges.length;
            for (var CurRange = 0; CurRange < RangesCount; CurRange++) {
                var X0 = (0 === CurRange ? X_left : this.Lines[StartLine].Ranges[CurRange].X);
                var X1 = (RangesCount - 1 === CurRange ? X_right : this.Lines[StartLine].Ranges[CurRange].XEnd);
                if (false === this.Is_EmptyRange(StartLine, CurRange) || (true === bEmpty && 1 === RangesCount)) {
                    pGraphics.drawHorLineExt(c_oAscLineDrawingRule.Top, Y_top, X0, X1, Pr.ParaPr.Brd.Top.Size, LeftMW, RightMW);
                }
            }
        } else {
            if (false === Pr.ParaPr.Brd.First) {
                var bDraw = false;
                var Size = 0;
                var Y = 0;
                if (1 === CurPage && true === this.Is_StartFromNewPage() && border_Single === Pr.ParaPr.Brd.Top.Value) {
                    RGBA = Pr.ParaPr.Brd.Top.Get_Color(this);
                    pGraphics.p_color(RGBA.r, RGBA.g, RGBA.b, 255);
                    Size = Pr.ParaPr.Brd.Top.Size;
                    Y = this.Pages[CurPage].Y + this.Lines[this.Pages[CurPage].FirstLine].Top + Pr.ParaPr.Spacing.Before;
                    bDraw = true;
                } else {
                    if (0 === CurPage && false === this.Is_StartFromNewPage() && border_Single === Pr.ParaPr.Brd.Between.Value) {
                        RGBA = Pr.ParaPr.Brd.Between.Get_Color(this);
                        pGraphics.p_color(RGBA.r, RGBA.g, RGBA.b, 255);
                        Size = Pr.ParaPr.Brd.Between.Size;
                        Y = this.Pages[CurPage].Y + Pr.ParaPr.Spacing.Before;
                        bDraw = true;
                    }
                }
                if (true === bDraw) {
                    var StartLine = this.Pages[CurPage].StartLine;
                    var RangesCount = this.Lines[StartLine].Ranges.length;
                    for (var CurRange = 0; CurRange < RangesCount; CurRange++) {
                        var X0 = (0 === CurRange ? X_left : this.Lines[StartLine].Ranges[CurRange].X);
                        var X1 = (RangesCount - 1 === CurRange ? X_right : this.Lines[StartLine].Ranges[CurRange].XEnd);
                        if (false === this.Is_EmptyRange(StartLine, CurRange) || (true === bEmpty && 1 === RangesCount)) {
                            pGraphics.drawHorLineExt(c_oAscLineDrawingRule.Top, Y, X0, X1, Size, LeftMW, RightMW);
                        }
                    }
                }
            }
        }
        var CurLine = this.Pages[CurPage].EndLine;
        var bEnd = (this.Lines[CurLine].Info & paralineinfo_End ? true : false);
        if (true === bEnd && true === Pr.ParaPr.Brd.Last && border_Single === Pr.ParaPr.Brd.Bottom.Value) {
            var TempY = this.Pages[CurPage].Y;
            var NextEl = this.Get_DocumentNext();
            var DrawLineRule = c_oAscLineDrawingRule.Bottom;
            if (null != NextEl && type_Paragraph === NextEl.GetType() && true === NextEl.Is_StartFromNewPage()) {
                TempY = this.Pages[CurPage].Y + this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
                DrawLineRule = c_oAscLineDrawingRule.Top;
            } else {
                TempY = this.Pages[CurPage].Y + this.Lines[CurLine].Bottom - Pr.ParaPr.Spacing.After;
                DrawLineRule = c_oAscLineDrawingRule.Bottom;
            }
            RGBA = Pr.ParaPr.Brd.Bottom.Get_Color(this);
            pGraphics.p_color(RGBA.r, RGBA.g, RGBA.b, 255);
            var EndLine = this.Pages[CurPage].EndLine;
            var RangesCount = this.Lines[EndLine].Ranges.length;
            for (var CurRange = 0; CurRange < RangesCount; CurRange++) {
                var X0 = (0 === CurRange ? X_left : this.Lines[EndLine].Ranges[CurRange].X);
                var X1 = (RangesCount - 1 === CurRange ? X_right : this.Lines[EndLine].Ranges[CurRange].XEnd);
                if (false === this.Is_EmptyRange(EndLine, CurRange) || (true === bEmpty && 1 === RangesCount)) {
                    pGraphics.drawHorLineExt(DrawLineRule, TempY, X0, X1, Pr.ParaPr.Brd.Bottom.Size, LeftMW, RightMW);
                }
            }
        } else {
            if (true === bEnd && false === Pr.ParaPr.Brd.Last && border_Single === Pr.ParaPr.Brd.Bottom.Value) {
                var NextEl = this.Get_DocumentNext();
                if (null != NextEl && type_Paragraph === NextEl.GetType() && true === NextEl.Is_StartFromNewPage()) {
                    RGBA = Pr.ParaPr.Brd.Bottom.Get_Color(this);
                    pGraphics.p_color(RGBA.r, RGBA.g, RGBA.b, 255);
                    var EndLine = this.Pages[CurPage].EndLine;
                    var RangesCount = this.Lines[EndLine].Ranges.length;
                    for (var CurRange = 0; CurRange < RangesCount; CurRange++) {
                        var X0 = (0 === CurRange ? X_left : this.Lines[EndLine].Ranges[CurRange].X);
                        var X1 = (RangesCount - 1 === CurRange ? X_right : this.Lines[EndLine].Ranges[CurRange].XEnd);
                        if (false === this.Is_EmptyRange(EndLine, CurRange) || (true === bEmpty && 1 === RangesCount)) {
                            pGraphics.drawHorLineExt(c_oAscLineDrawingRule.Top, this.Pages[CurPage].Y + this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap, X0, X1, Pr.ParaPr.Brd.Bottom.Size, LeftMW, RightMW);
                        }
                    }
                }
            }
        }
    },
    Is_NeedDrawBorders: function () {
        if (true === this.IsEmpty() && undefined !== this.SectPr) {
            return false;
        }
        return true;
    },
    ReDraw: function () {
        this.Parent.OnContentReDraw(this.Get_StartPage_Absolute(), this.Get_StartPage_Absolute() + this.Pages.length - 1);
    },
    Shift: function (PageIndex, Dx, Dy) {
        if (0 === PageIndex) {
            this.X += Dx;
            this.Y += Dy;
            this.XLimit += Dx;
            this.YLimit += Dy;
        }
        var Page_abs = PageIndex + this.Get_StartPage_Absolute();
        this.Pages[PageIndex].Shift(Dx, Dy);
        var StartLine = this.Pages[PageIndex].StartLine;
        var EndLine = this.Pages[PageIndex].EndLine;
        for (var CurLine = StartLine; CurLine <= EndLine; CurLine++) {
            this.Lines[CurLine].Shift(Dx, Dy);
        }
        var Count = this.Content.length;
        for (var CurLine = StartLine; CurLine <= EndLine; CurLine++) {
            var Line = this.Lines[CurLine];
            var RangesCount = Line.Ranges.length;
            for (var CurRange = 0; CurRange < RangesCount; CurRange++) {
                var Range = Line.Ranges[CurRange];
                var StartPos = Range.StartPos;
                var EndPos = Range.EndPos;
                for (var Pos = StartPos; Pos <= EndPos; Pos++) {
                    var Item = this.Content[Pos];
                    Item.Shift_Range(Dx, Dy, CurLine, CurRange);
                }
            }
        }
    },
    Remove: function (nCount, bOnlyText, bRemoveOnlySelection, bOnAddText) {
        var Direction = nCount;
        var Result = true;
        if (true === this.Selection.Use) {
            var StartPos = this.Selection.StartPos;
            var EndPos = this.Selection.EndPos;
            if (StartPos > EndPos) {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos = Temp;
            }
            if (EndPos === this.Content.length - 1 && true === this.Content[EndPos].Selection_CheckParaEnd()) {
                Result = false;
                this.Set_SectionPr(undefined);
            }
            if (StartPos === EndPos) {
                this.Content[StartPos].Remove(nCount, bOnAddText);
                if (StartPos < this.Content.length - 2 && true === this.Content[StartPos].Is_Empty() && true !== this.Content[StartPos].Is_CheckingNearestPos()) {
                    if (this.Selection.StartPos === this.Selection.EndPos) {
                        this.Selection.Use = false;
                    }
                    this.Internal_Content_Remove(StartPos);
                    this.CurPos.ContentPos = StartPos;
                    this.Content[StartPos].Cursor_MoveToStartPos();
                    this.Correct_ContentPos2();
                }
            } else {
                var CommentsToDelete = {};
                for (var Pos = StartPos; Pos <= EndPos; Pos++) {
                    var Item = this.Content[Pos];
                    if (para_Comment === Item.Type) {
                        CommentsToDelete[Item.CommentId] = true;
                    }
                }
                this.DeleteCommentOnRemove = false;
                this.Content[EndPos].Remove(nCount, bOnAddText);
                if (EndPos < this.Content.length - 2 && true === this.Content[EndPos].Is_Empty() && true !== this.Content[EndPos].Is_CheckingNearestPos()) {
                    this.Internal_Content_Remove(EndPos);
                    this.CurPos.ContentPos = EndPos;
                    this.Content[EndPos].Cursor_MoveToStartPos();
                }
                this.Internal_Content_Remove2(StartPos + 1, EndPos - StartPos - 1);
                this.Content[StartPos].Remove(nCount, bOnAddText);
                if (StartPos < this.Content.length - 2 && true === this.Content[StartPos].Is_Empty() && true !== this.Content[StartPos].Is_CheckingNearestPos()) {
                    if (this.Selection.StartPos === this.Selection.EndPos) {
                        this.Selection.Use = false;
                    }
                    this.Internal_Content_Remove(StartPos);
                }
                this.Correct_ContentPos2();
                this.DeleteCommentOnRemove = true;
                for (var CommentId in CommentsToDelete) {
                    this.LogicDocument.Remove_Comment(CommentId, true, false);
                }
            }
            if (true !== this.Content[this.CurPos.ContentPos].Selection_IsUse()) {
                this.Selection_Remove();
                this.Correct_Content();
            } else {
                this.Selection.Use = true;
                this.Selection.Start = false;
                this.Selection.Flag = selectionflag_Common;
                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Selection.EndPos = this.CurPos.ContentPos;
                this.Correct_Content();
                this.Document_SetThisElementCurrent(false);
                return true;
            }
        } else {
            var ContentPos = this.CurPos.ContentPos;
            while (false === this.Content[ContentPos].Remove(Direction, bOnAddText)) {
                if (Direction < 0) {
                    ContentPos--;
                } else {
                    ContentPos++;
                }
                if (ContentPos < 0 || ContentPos >= this.Content.length) {
                    break;
                }
                if (Direction < 0) {
                    this.Content[ContentPos].Cursor_MoveToEndPos(false);
                } else {
                    this.Content[ContentPos].Cursor_MoveToStartPos();
                }
            }
            if (ContentPos < 0 || ContentPos >= this.Content.length) {
                Result = false;
            } else {
                if (true === this.Content[ContentPos].Selection_IsUse()) {
                    this.Selection.Use = true;
                    this.Selection.Start = false;
                    this.Selection.Flag = selectionflag_Common;
                    this.Selection.StartPos = ContentPos;
                    this.Selection.EndPos = ContentPos;
                    this.Correct_Content(ContentPos, ContentPos);
                    this.Document_SetThisElementCurrent(false);
                    return true;
                }
                if (ContentPos < this.Content.length - 2 && true === this.Content[ContentPos].Is_Empty()) {
                    this.Internal_Content_Remove(ContentPos);
                    this.CurPos.ContentPos = ContentPos;
                    this.Content[ContentPos].Cursor_MoveToStartPos();
                    this.Correct_ContentPos2();
                } else {
                    this.CurPos.ContentPos = ContentPos;
                }
            }
            this.Correct_Content(ContentPos, ContentPos);
            if (Direction < 0 && false === Result) {
                Result = true;
                var Pr = this.Get_CompiledPr2(false).ParaPr;
                if (undefined != this.Numbering_Get()) {
                    var NumPr = this.Numbering_Get();
                    if (0 === NumPr.Lvl) {
                        this.Numbering_Remove();
                        this.Set_Ind({
                            FirstLine: 0,
                            Left: Math.max(Pr.Ind.Left, Pr.Ind.Left + Pr.Ind.FirstLine)
                        },
                        false);
                    } else {
                        this.Numbering_IndDec_Level(false);
                    }
                } else {
                    if (numbering_presentationnumfrmt_None != this.PresentationPr.Bullet.Get_Type()) {
                        this.Remove_PresentationNumbering();
                    } else {
                        if (align_Right === Pr.Jc) {
                            this.Set_Align(align_Center);
                        } else {
                            if (align_Center === Pr.Jc) {
                                this.Set_Align(align_Left);
                            } else {
                                if (Math.abs(Pr.Ind.FirstLine) > 0.001) {
                                    if (Pr.Ind.FirstLine > 0) {
                                        this.Set_Ind({
                                            FirstLine: 0
                                        },
                                        false);
                                    } else {
                                        this.Set_Ind({
                                            Left: Pr.Ind.Left + Pr.Ind.FirstLine,
                                            FirstLine: 0
                                        },
                                        false);
                                    }
                                } else {
                                    if (Math.abs(Pr.Ind.Left) > 0.001) {
                                        this.Set_Ind({
                                            Left: 0
                                        },
                                        false);
                                    } else {
                                        Result = false;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return Result;
    },
    Remove_ParaEnd: function () {
        var ContentLen = this.Content.length;
        for (var CurPos = ContentLen - 1; CurPos >= 0; CurPos--) {
            var Element = this.Content[CurPos];
            if (para_Run === Element.Type && true === Element.Remove_ParaEnd()) {
                return;
            }
        }
    },
    Internal_FindForward: function (CurPos, arrId) {
        var LetterPos = CurPos;
        var bFound = false;
        var Type = para_Unknown;
        if (CurPos < 0 || CurPos >= this.Content.length) {
            return {
                Found: false
            };
        }
        while (!bFound) {
            Type = this.Content[LetterPos].Type;
            for (var Id = 0; Id < arrId.length; Id++) {
                if (arrId[Id] == Type) {
                    bFound = true;
                    break;
                }
            }
            if (bFound) {
                break;
            }
            LetterPos++;
            if (LetterPos > this.Content.length - 1) {
                break;
            }
        }
        return {
            LetterPos: LetterPos,
            Found: bFound,
            Type: Type
        };
    },
    Internal_FindBackward: function (CurPos, arrId) {
        var LetterPos = CurPos;
        var bFound = false;
        var Type = para_Unknown;
        if (CurPos < 0 || CurPos >= this.Content.length) {
            return {
                Found: false
            };
        }
        while (!bFound) {
            Type = this.Content[LetterPos].Type;
            for (var Id = 0; Id < arrId.length; Id++) {
                if (arrId[Id] == Type) {
                    bFound = true;
                    break;
                }
            }
            if (bFound) {
                break;
            }
            LetterPos--;
            if (LetterPos < 0) {
                break;
            }
        }
        return {
            LetterPos: LetterPos,
            Found: bFound,
            Type: Type
        };
    },
    Get_TextPr: function (_ContentPos) {
        var ContentPos = (undefined === _ContentPos ? this.Get_ParaContentPos(false, false) : _ContentPos);
        var CurPos = ContentPos.Get(0);
        return this.Content[CurPos].Get_TextPr(ContentPos, 1);
    },
    Internal_CalculateTextPr: function (LetterPos, StartPr) {
        var Pr;
        if ("undefined" != typeof(StartPr)) {
            Pr = this.Get_CompiledPr();
            StartPr.ParaPr = Pr.ParaPr;
            StartPr.TextPr = Pr.TextPr;
        } else {
            Pr = this.Get_CompiledPr2(false);
        }
        var TextPr = Pr.TextPr.Copy();
        if (LetterPos < 0) {
            return TextPr;
        }
        var Pos = this.Internal_FindBackward(LetterPos, [para_TextPr]);
        if (true === Pos.Found) {
            var CurTextPr = this.Content[Pos.LetterPos].Value;
            if (undefined != CurTextPr.RStyle) {
                var Styles = this.Parent.Get_Styles();
                var StyleTextPr = Styles.Get_Pr(CurTextPr.RStyle, styletype_Character).TextPr;
                TextPr.Merge(StyleTextPr);
            }
            TextPr.Merge(CurTextPr);
        }
        TextPr.FontFamily.Name = TextPr.RFonts.Ascii.Name;
        TextPr.FontFamily.Index = TextPr.RFonts.Ascii.Index;
        return TextPr;
    },
    Internal_GetLang: function (LetterPos) {
        var Lang = this.Get_CompiledPr2(false).TextPr.Lang.Copy();
        if (LetterPos < 0) {
            return Lang;
        }
        var Pos = this.Internal_FindBackward(LetterPos, [para_TextPr]);
        if (true === Pos.Found) {
            var CurTextPr = this.Content[Pos.LetterPos].Value;
            if (undefined != CurTextPr.RStyle) {
                var Styles = this.Parent.Get_Styles();
                var StyleTextPr = Styles.Get_Pr(CurTextPr.RStyle, styletype_Character).TextPr;
                Lang.Merge(StyleTextPr.Lang);
            }
            Lang.Merge(CurTextPr.Lang);
        }
        return Lang;
    },
    Internal_GetTextPr: function (LetterPos) {
        var TextPr = new CTextPr();
        if (LetterPos < 0) {
            return TextPr;
        }
        var Pos = this.Internal_FindBackward(LetterPos, [para_TextPr]);
        if (true === Pos.Found) {
            var CurTextPr = this.Content[Pos.LetterPos].Value;
            TextPr.Merge(CurTextPr);
        }
        return TextPr;
    },
    Add: function (Item) {
        Item.Parent = this;
        switch (Item.Get_Type()) {
        case para_Text:
            case para_Space:
            case para_PageNum:
            case para_Tab:
            case para_Drawing:
            case para_NewLine:
            this.Content[this.CurPos.ContentPos].Add(Item);
            break;
        case para_TextPr:
            var TextPr = Item.Value;
            if (undefined != TextPr.FontFamily) {
                var FName = TextPr.FontFamily.Name;
                var FIndex = TextPr.FontFamily.Index;
                TextPr.RFonts = new CRFonts();
                TextPr.RFonts.Ascii = {
                    Name: FName,
                    Index: FIndex
                };
                TextPr.RFonts.EastAsia = {
                    Name: FName,
                    Index: FIndex
                };
                TextPr.RFonts.HAnsi = {
                    Name: FName,
                    Index: FIndex
                };
                TextPr.RFonts.CS = {
                    Name: FName,
                    Index: FIndex
                };
            }
            if (true === this.ApplyToAll) {
                var ContentLen = this.Content.length;
                for (var CurPos = 0; CurPos < ContentLen; CurPos++) {
                    this.Content[CurPos].Apply_TextPr(TextPr, undefined, true);
                }
                this.TextPr.Apply_TextPr(TextPr);
            } else {
                if (true === this.Selection.Use) {
                    this.Apply_TextPr(TextPr);
                } else {
                    var CurParaPos = this.Get_ParaContentPos(false, false);
                    var CurPos = CurParaPos.Get(0);
                    var SearchLPos = new CParagraphSearchPos();
                    this.Get_LeftPos(SearchLPos, CurParaPos);
                    var RItem = this.Get_RunElementByPos(CurParaPos);
                    var LItem = (false === SearchLPos.Found ? null : this.Get_RunElementByPos(SearchLPos.Pos));
                    if (null === RItem || para_End === RItem.Type) {
                        this.Apply_TextPr(TextPr);
                        this.TextPr.Apply_TextPr(TextPr);
                    } else {
                        if (null !== RItem && null !== LItem && para_Text === RItem.Type && para_Text === LItem.Type && false === RItem.Is_Punctuation() && false === LItem.Is_Punctuation()) {
                            var SearchSPos = new CParagraphSearchPos();
                            var SearchEPos = new CParagraphSearchPos();
                            this.Get_WordStartPos(SearchSPos, CurParaPos);
                            this.Get_WordEndPos(SearchEPos, CurParaPos);
                            if (true !== SearchSPos.Found || true !== SearchEPos.Found) {
                                return;
                            }
                            this.Selection.Use = true;
                            this.Set_SelectionContentPos(SearchSPos.Pos, SearchEPos.Pos);
                            this.Apply_TextPr(TextPr);
                            this.Selection_Remove();
                        } else {
                            this.Apply_TextPr(TextPr);
                        }
                    }
                }
            }
            break;
        case para_Math:
            var ContentPos = this.Get_ParaContentPos(false, false);
            var CurPos = ContentPos.Get(0);
            if (para_Math !== this.Content[CurPos].Type && para_Hyperlink !== this.Content[CurPos].Type) {
                var NewElement = this.Content[CurPos].Split(ContentPos, 1);
                if (null !== NewElement) {
                    this.Internal_Content_Add(CurPos + 1, NewElement);
                }
                var Elem = new ParaMath();
                Elem.Root.Load_FromMenu(Item.Menu, this);
                Elem.Root.Correct_Content(true);
                this.Internal_Content_Add(CurPos + 1, Elem);
                this.CurPos.ContentPos = CurPos + 1;
                this.Content[this.CurPos.ContentPos].Cursor_MoveToEndPos(false);
            } else {
                this.Content[CurPos].Add(Item);
            }
            break;
        case para_Run:
            var ContentPos = this.Get_ParaContentPos(false, false);
            var CurPos = ContentPos.Get(0);
            var CurItem = this.Content[CurPos];
            switch (CurItem.Type) {
            case para_Run:
                var NewRun = CurItem.Split(ContentPos, 1);
                this.Internal_Content_Add(CurPos + 1, Item);
                this.Internal_Content_Add(CurPos + 2, NewRun);
                this.CurPos.ContentPos = CurPos + 1;
                break;
            case para_Math:
                case para_Hyperlink:
                CurItem.Add(Item);
                break;
            default:
                this.Internal_Content_Add(CurPos + 1, Item);
                this.CurPos.ContentPos = CurPos + 1;
                break;
            }
            Item.Cursor_MoveToEndPos(false);
            break;
        }
    },
    Add_Tab: function (bShift) {
        var NumPr = this.Numbering_Get();
        if (undefined !== this.Numbering_Get()) {
            this.Shift_NumberingLvl(bShift);
        } else {
            if (true === this.Is_SelectionUse()) {
                this.IncDec_Indent(!bShift);
            } else {
                var ParaPr = this.Get_CompiledPr2(false).ParaPr;
                var LD_PageFields = this.LogicDocument.Get_PageFields(this.Get_StartPage_Absolute());
                if (true != bShift) {
                    if (ParaPr.Ind.FirstLine < 0) {
                        this.Set_Ind({
                            FirstLine: 0
                        },
                        false);
                        this.CompiledPr.NeedRecalc = true;
                    } else {
                        if (ParaPr.Ind.FirstLine < 12.5) {
                            this.Set_Ind({
                                FirstLine: 12.5
                            },
                            false);
                            this.CompiledPr.NeedRecalc = true;
                        } else {
                            if (LD_PageFields.XLimit - LD_PageFields.X > ParaPr.Ind.Left + 25) {
                                this.Set_Ind({
                                    Left: ParaPr.Ind.Left + 12.5
                                },
                                false);
                                this.CompiledPr.NeedRecalc = true;
                            }
                        }
                    }
                } else {
                    if (ParaPr.Ind.FirstLine > 0) {
                        if (ParaPr.Ind.FirstLine > 12.5) {
                            this.Set_Ind({
                                FirstLine: ParaPr.Ind.FirstLine - 12.5
                            },
                            false);
                        } else {
                            this.Set_Ind({
                                FirstLine: 0
                            },
                            false);
                        }
                        this.CompiledPr.NeedRecalc = true;
                    } else {
                        var Left = ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
                        if (Left < 0) {
                            this.Set_Ind({
                                Left: -ParaPr.Ind.FirstLine
                            },
                            false);
                            this.CompiledPr.NeedRecalc = true;
                        } else {
                            if (Left > 12.5) {
                                this.Set_Ind({
                                    Left: ParaPr.Ind.Left - 12.5
                                },
                                false);
                            } else {
                                this.Set_Ind({
                                    Left: -ParaPr.Ind.FirstLine
                                },
                                false);
                            }
                            this.CompiledPr.NeedRecalc = true;
                        }
                    }
                }
            }
        }
    },
    Extend_ToPos: function (_X) {
        var CompiledPr = this.Get_CompiledPr2(false).ParaPr;
        var Page = this.Pages[this.Pages.length - 1];
        var X0 = Page.X;
        var X1 = Page.XLimit - X0;
        var X = _X - X0;
        var Align = CompiledPr.Jc;
        if (X < 0 || X > X1 || (X < 7.5 && align_Left === Align) || (X > X1 - 10 && align_Right === Align) || (Math.abs(X1 / 2 - X) < 10 && align_Center === Align)) {
            return false;
        }
        if (true === this.IsEmpty()) {
            if (align_Left !== Align) {
                this.Set_Align(align_Left);
            }
            if (Math.abs(X - X1 / 2) < 12.5) {
                this.Set_Align(align_Center);
                return true;
            } else {
                if (X > X1 - 12.5) {
                    this.Set_Align(align_Right);
                    return true;
                } else {
                    if (X < 17.5) {
                        this.Set_Ind({
                            FirstLine: 12.5
                        },
                        false);
                        return true;
                    }
                }
            }
        }
        var Tabs = CompiledPr.Tabs.Copy();
        if (Math.abs(X - X1 / 2) < 12.5) {
            Tabs.Add(new CParaTab(tab_Center, X1 / 2));
        } else {
            if (X > X1 - 12.5) {
                Tabs.Add(new CParaTab(tab_Right, X1 - 0.001));
            } else {
                Tabs.Add(new CParaTab(tab_Left, X));
            }
        }
        this.Set_Tabs(Tabs);
        this.Set_ParaContentPos(this.Get_EndPos(false), false, -1, -1);
        this.Add(new ParaTab());
        return true;
    },
    IncDec_FontSize: function (bIncrease) {
        if (true === this.ApplyToAll) {
            var ContentLen = this.Content.length;
            for (var CurPos = 0; CurPos < ContentLen; CurPos++) {
                this.Content[CurPos].Apply_TextPr(undefined, bIncrease, true);
            }
        } else {
            if (true === this.Selection.Use) {
                this.Apply_TextPr(undefined, bIncrease, false);
            } else {
                var CurParaPos = this.Get_ParaContentPos(false, false);
                var CurPos = CurParaPos.Get(0);
                var SearchLPos = new CParagraphSearchPos();
                this.Get_LeftPos(SearchLPos, CurParaPos);
                var RItem = this.Get_RunElementByPos(CurParaPos);
                var LItem = (false === SearchLPos.Found ? null : this.Get_RunElementByPos(SearchLPos.Pos));
                if (null === RItem || para_End === RItem.Type) {
                    this.Apply_TextPr(undefined, bIncrease, false);
                } else {
                    if (null !== RItem && null !== LItem && para_Text === RItem.Type && para_Text === LItem.Type && false === RItem.Is_Punctuation() && false === LItem.Is_Punctuation()) {
                        var SearchSPos = new CParagraphSearchPos();
                        var SearchEPos = new CParagraphSearchPos();
                        this.Get_WordStartPos(SearchSPos, CurParaPos);
                        this.Get_WordEndPos(SearchEPos, CurParaPos);
                        if (true !== SearchSPos.Found || true !== SearchEPos.Found) {
                            return;
                        }
                        this.Selection.Use = true;
                        this.Set_SelectionContentPos(SearchSPos.Pos, SearchEPos.Pos);
                        this.Apply_TextPr(undefined, bIncrease, false);
                        this.Selection_Remove();
                    } else {
                        this.Apply_TextPr(undefined, bIncrease, false);
                    }
                }
            }
        }
        return true;
    },
    Shift_NumberingLvl: function (bShift) {
        var NumPr = this.Numbering_Get();
        if (true != this.Selection.Use) {
            var NumId = NumPr.NumId;
            var Lvl = NumPr.Lvl;
            var NumInfo = this.Parent.Internal_GetNumInfo(this.Id, NumPr);
            if (0 === Lvl && NumInfo[Lvl] <= 1) {
                var Numbering = this.Parent.Get_Numbering();
                var AbstractNum = Numbering.Get_AbstractNum(NumId);
                var NumLvl = AbstractNum.Lvl[Lvl];
                var NumParaPr = NumLvl.ParaPr;
                var ParaPr = this.Get_CompiledPr2(false).ParaPr;
                if (undefined != NumParaPr.Ind && undefined != NumParaPr.Ind.Left) {
                    var NewX = ParaPr.Ind.Left;
                    if (true != bShift) {
                        NewX += Default_Tab_Stop;
                    } else {
                        NewX -= Default_Tab_Stop;
                        if (NewX < 0) {
                            NewX = 0;
                        }
                        if (ParaPr.Ind.FirstLine < 0 && NewX + ParaPr.Ind.FirstLine < 0) {
                            NewX = -ParaPr.Ind.FirstLine;
                        }
                    }
                    AbstractNum.Change_LeftInd(NewX);
                    History.Add(this, {
                        Type: historyitem_Paragraph_Ind_First,
                        Old: (undefined != this.Pr.Ind.FirstLine ? this.Pr.Ind.FirstLine : undefined),
                        New: undefined
                    });
                    History.Add(this, {
                        Type: historyitem_Paragraph_Ind_Left,
                        Old: (undefined != this.Pr.Ind.Left ? this.Pr.Ind.Left : undefined),
                        New: undefined
                    });
                    this.Pr.Ind.FirstLine = undefined;
                    this.Pr.Ind.Left = undefined;
                    this.CompiledPr.NeedRecalc = true;
                }
            } else {
                this.Numbering_IndDec_Level(!bShift);
            }
        } else {
            this.Numbering_IndDec_Level(!bShift);
        }
    },
    Can_IncreaseLevel: function (bIncrease) {
        var CurLevel = isRealNumber(this.Pr.Lvl) ? this.Pr.Lvl : 0,
        NewPr,
        OldPr = this.Get_CompiledPr2(false).TextPr,
        DeltaFontSize,
        i,
        j,
        RunPr;
        if (bIncrease) {
            if (CurLevel >= 8) {
                return false;
            }
            NewPr = this.Internal_CompiledParaPrPresentation(CurLevel + 1).TextPr;
        } else {
            if (CurLevel <= 0) {
                return false;
            }
            NewPr = this.Internal_CompiledParaPrPresentation(CurLevel - 1).TextPr;
        }
        DeltaFontSize = NewPr.FontSize - OldPr.FontSize;
        if (this.Pr.DefaultRunPr && isRealNumber(this.Pr.DefaultRunPr.FontSize)) {
            if (this.Pr.DefaultRunPr.FontSize + DeltaFontSize < 1) {
                return false;
            }
        }
        if (isRealNumber(this.TextPr.FontSize)) {
            if (this.TextPr.FontSize + DeltaFontSize < 1) {
                return false;
            }
        }
        for (i = 0; i < this.Content.length; ++i) {
            if (this.Content[i].Type === para_Run) {
                RunPr = this.Content[i].Get_CompiledPr();
                if (RunPr.FontSize + DeltaFontSize < 1) {
                    return false;
                }
            } else {
                if (this.Content[i].Type === para_Hyperlink) {
                    for (j = 0; j < this.Content[i].Content.length; ++j) {
                        RunPr = this.Content[i].Content[j].Get_CompiledPr();
                        if (RunPr.FontSize + DeltaFontSize < 1) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    },
    Increase_Level: function (bIncrease) {
        var CurLevel = isRealNumber(this.Pr.Lvl) ? this.Pr.Lvl : 0,
        NewPr,
        OldPr = this.Get_CompiledPr2(false).TextPr,
        DeltaFontSize,
        i,
        j,
        RunPr;
        if (bIncrease) {
            NewPr = this.Internal_CompiledParaPrPresentation(CurLevel + 1).TextPr;
            if (this.Pr.Ind && this.Pr.Ind.Left != undefined) {
                this.Set_Ind({
                    FirstLine: this.Pr.Ind.FirstLine,
                    Left: this.Pr.Ind.Left + 11.1125
                },
                false);
            }
            this.Set_PresentationLevel(CurLevel + 1);
        } else {
            NewPr = this.Internal_CompiledParaPrPresentation(CurLevel - 1).TextPr;
            if (this.Pr.Ind && this.Pr.Ind.Left != undefined) {
                this.Set_Ind({
                    FirstLine: this.Pr.Ind.FirstLine,
                    Left: this.Pr.Ind.Left - 11.1125
                },
                false);
            }
            this.Set_PresentationLevel(CurLevel - 1);
        }
        DeltaFontSize = NewPr.FontSize - OldPr.FontSize;
        if (DeltaFontSize !== 0) {
            if (this.Pr.DefaultRunPr && isRealNumber(this.Pr.DefaultRunPr.FontSize)) {
                var NewParaPr = this.Pr.Copy();
                NewParaPr.DefaultRunPr.FontSize += DeltaFontSize;
                this.Set_Pr(NewParaPr);
            }
            if (isRealNumber(this.TextPr.FontSize)) {
                this.TextPr.Set_FontSize(this.TextPr.FontSize + DeltaFontSize);
            }
            for (i = 0; i < this.Content.length; ++i) {
                if (this.Content[i].Type === para_Run) {
                    if (isRealNumber(this.Content[i].Pr.FontSize)) {
                        this.Content[i].Set_FontSize(this.Content[i].Pr.FontSize + DeltaFontSize);
                    }
                } else {
                    if (this.Content[i].Type === para_Hyperlink) {
                        for (j = 0; j < this.Content[i].Content.length; ++j) {
                            if (isRealNumber(this.Content[i].Content[j].Pr.FontSize)) {
                                this.Content[i].Content[j].Set_FontSize(this.Content[i].Content[j].Pr.FontSize + DeltaFontSize);
                            }
                        }
                    }
                }
            }
        }
    },
    IncDec_Indent: function (bIncrease) {
        if (undefined !== this.Numbering_Get()) {
            this.Shift_NumberingLvl(!bIncrease);
        } else {
            var ParaPr = this.Get_CompiledPr2(false).ParaPr;
            var LeftMargin = ParaPr.Ind.Left;
            if (UnknownValue === LeftMargin) {
                LeftMargin = 0;
            } else {
                if (LeftMargin < 0) {
                    this.Set_Ind({
                        Left: 0
                    },
                    false);
                    return;
                }
            }
            var LeftMargin_new = 0;
            if (true === bIncrease) {
                if (LeftMargin >= 0) {
                    LeftMargin = 12.5 * parseInt(10 * LeftMargin / 125);
                    LeftMargin_new = ((LeftMargin - (10 * LeftMargin) % 125 / 10) / 12.5 + 1) * 12.5;
                }
                if (LeftMargin_new < 0) {
                    LeftMargin_new = 12.5;
                }
            } else {
                var TempValue = (125 - (10 * LeftMargin) % 125);
                TempValue = (125 === TempValue ? 0 : TempValue);
                LeftMargin_new = Math.max(((LeftMargin + TempValue / 10) / 12.5 - 1) * 12.5, 0);
            }
            this.Set_Ind({
                Left: LeftMargin_new
            },
            false);
        }
        var NewPresLvl = (true === bIncrease ? Math.min(8, this.PresentationPr.Level + 1) : Math.max(0, this.PresentationPr.Level - 1));
        this.Set_PresentationLevel(NewPresLvl);
    },
    Correct_ContentPos: function (CorrectEndLinePos) {
        var Count = this.Content.length;
        var CurPos = this.CurPos.ContentPos;
        if (true === CorrectEndLinePos && true === this.Content[CurPos].Cursor_Is_End()) {
            var _CurPos = CurPos + 1;
            while (_CurPos < Count && true === this.Content[_CurPos].Is_Empty({
                SkipAnchor: true
            })) {
                _CurPos++;
            }
            if (_CurPos < Count && true === this.Content[_CurPos].Is_StartFromNewLine()) {
                CurPos = _CurPos;
                this.Content[CurPos].Cursor_MoveToStartPos();
            }
        }
        while (CurPos > 0 && true === this.Content[CurPos].Cursor_Is_NeededCorrectPos() && para_Run === this.Content[CurPos - 1].Type) {
            CurPos--;
            this.Content[CurPos].Cursor_MoveToEndPos();
        }
        this.CurPos.ContentPos = CurPos;
    },
    Correct_ContentPos2: function () {
        var Count = this.Content.length;
        var CurPos = Math.min(Math.max(0, this.CurPos.ContentPos), Count - 1);
        while (CurPos > 0 && false === this.Content[CurPos].Is_CursorPlaceable()) {
            CurPos--;
            this.Content[CurPos].Cursor_MoveToEndPos();
        }
        while (CurPos < Count && false === this.Content[CurPos].Is_CursorPlaceable()) {
            CurPos++;
            this.Content[CurPos].Cursor_MoveToStartPos(false);
        }
        while (CurPos > 0 && para_Run !== this.Content[CurPos].Type && para_Math !== this.Content[CurPos].Type && true === this.Content[CurPos].Cursor_Is_Start()) {
            if (false === this.Content[CurPos - 1].Is_CursorPlaceable()) {
                break;
            }
            CurPos--;
            this.Content[CurPos].Cursor_MoveToEndPos();
        }
        while (CurPos < Count && para_Run !== this.Content[CurPos].Type && para_Math !== this.Content[CurPos].Type && true === this.Content[CurPos].Cursor_Is_End()) {
            if (false === this.Content[CurPos + 1].Is_CursorPlaceable()) {
                break;
            }
            CurPos++;
            this.Content[CurPos].Cursor_MoveToStartPos(false);
        }
        this.private_CorrectCurPosRangeLine();
        this.CurPos.ContentPos = CurPos;
    },
    Get_ParaContentPos: function (bSelection, bStart) {
        var ContentPos = new CParagraphContentPos();
        var Pos = (true !== bSelection ? this.CurPos.ContentPos : (false !== bStart ? this.Selection.StartPos : this.Selection.EndPos));
        ContentPos.Add(Pos);
        this.Content[Pos].Get_ParaContentPos(bSelection, bStart, ContentPos);
        return ContentPos;
    },
    Set_ParaContentPos: function (ContentPos, CorrectEndLinePos, Line, Range) {
        var Pos = ContentPos.Get(0);
        if (Pos >= this.Content.length) {
            Pos = this.Content.length - 1;
        }
        if (Pos < 0) {
            Pos = 0;
        }
        this.CurPos.ContentPos = Pos;
        this.Content[Pos].Set_ParaContentPos(ContentPos, 1);
        this.Correct_ContentPos(CorrectEndLinePos);
        this.Correct_ContentPos2();
        this.CurPos.Line = Line;
        this.CurPos.Range = Range;
    },
    Set_SelectionContentPos: function (StartContentPos, EndContentPos, CorrectAnchor) {
        var Depth = 0;
        var Direction = 1;
        if (StartContentPos.Compare(EndContentPos) > 0) {
            Direction = -1;
        }
        var OldStartPos = Math.max(0, Math.min(this.Selection.StartPos, this.Content.length - 1));
        var OldEndPos = Math.max(0, Math.min(this.Selection.EndPos, this.Content.length - 1));
        if (OldStartPos > OldEndPos) {
            OldStartPos = this.Selection.EndPos;
            OldEndPos = this.Selection.StartPos;
        }
        var StartPos = StartContentPos.Get(Depth);
        var EndPos = EndContentPos.Get(Depth);
        this.Selection.StartPos = StartPos;
        this.Selection.EndPos = EndPos;
        if (OldStartPos < StartPos && OldStartPos < EndPos) {
            var TempLimit = Math.min(StartPos, EndPos);
            for (var CurPos = OldStartPos; CurPos < TempLimit; CurPos++) {
                this.Content[CurPos].Selection_Remove();
            }
        }
        if (OldEndPos > StartPos && OldEndPos > EndPos) {
            var TempLimit = Math.max(StartPos, EndPos);
            for (var CurPos = TempLimit + 1; CurPos <= OldEndPos; CurPos++) {
                this.Content[CurPos].Selection_Remove();
            }
        }
        if (StartPos === EndPos) {
            this.Content[StartPos].Set_SelectionContentPos(StartContentPos, EndContentPos, Depth + 1, 0, 0);
        } else {
            if (StartPos > EndPos) {
                this.Content[StartPos].Set_SelectionContentPos(StartContentPos, null, Depth + 1, 0, 1);
                this.Content[EndPos].Set_SelectionContentPos(null, EndContentPos, Depth + 1, -1, 0);
                for (var CurPos = EndPos + 1; CurPos < StartPos; CurPos++) {
                    this.Content[CurPos].Select_All(-1);
                }
            } else {
                this.Content[StartPos].Set_SelectionContentPos(StartContentPos, null, Depth + 1, 0, -1);
                this.Content[EndPos].Set_SelectionContentPos(null, EndContentPos, Depth + 1, 1, 0);
                for (var CurPos = StartPos + 1; CurPos < EndPos; CurPos++) {
                    this.Content[CurPos].Select_All(1);
                }
            }
        }
        if (false !== CorrectAnchor) {
            if (true === this.Selection_CheckParaEnd()) {
                var bNeedSelectAll = true;
                var StartPos = Math.min(this.Selection.StartPos, this.Selection.EndPos);
                for (var Pos = 0; Pos <= StartPos; Pos++) {
                    if (false === this.Content[Pos].Is_SelectedAll({
                        SkipAnchor: true
                    })) {
                        bNeedSelectAll = false;
                        break;
                    }
                }
                if (true === bNeedSelectAll) {
                    if (1 === Direction) {
                        this.Selection.StartPos = 0;
                    } else {
                        this.Selection.EndPos = 0;
                    }
                    for (var Pos = 0; Pos <= StartPos; Pos++) {
                        this.Content[Pos].Select_All(Direction);
                    }
                }
            } else {
                if (true !== this.Selection_IsEmpty(true) && ((1 === Direction && true === this.Selection.StartManually) || (1 !== Direction && true === this.Selection.EndManually))) {
                    var bNeedCorrectLeftPos = true;
                    var _StartPos = Math.min(StartPos, EndPos);
                    var _EndPos = Math.max(StartPos, EndPos);
                    for (var Pos = 0; Pos < StartPos; Pos++) {
                        if (true !== this.Content[Pos].Is_Empty({
                            SkipAnchor: true
                        })) {
                            bNeedCorrectLeftPos = false;
                            break;
                        }
                    }
                    if (true === bNeedCorrectLeftPos) {
                        for (var Pos = _StartPos; Pos <= EndPos; Pos++) {
                            if (true === this.Content[Pos].Selection_CorrectLeftPos(Direction)) {
                                if (1 === Direction) {
                                    if (Pos + 1 > this.Selection.EndPos) {
                                        break;
                                    }
                                    this.Selection.StartPos = Pos + 1;
                                } else {
                                    if (Pos + 1 > this.Selection.StartPos) {
                                        break;
                                    }
                                    this.Selection.EndPos = Pos + 1;
                                }
                                this.Content[Pos].Selection_Remove();
                            } else {
                                break;
                            }
                        }
                    }
                }
            }
        }
    },
    Get_ParaContentPosByXY: function (X, Y, PageNum, bYLine, StepEnd, bCenterMode) {
        var SearchPos = new CParagraphSearchPosXY();
        SearchPos.CenterMode = (undefined === bCenterMode ? true : bCenterMode);
        if (this.Lines.length <= 0) {
            return SearchPos;
        }
        var PNum = (PageNum === -1 || undefined === PageNum ? 0 : PageNum - this.PageNum);
        if (PNum >= this.Pages.length) {
            PNum = this.Pages.length - 1;
            bYLine = true;
            Y = this.Lines.length - 1;
        } else {
            if (PNum < 0) {
                PNum = 0;
                bYLine = true;
                Y = 0;
            }
        }
        var CurLine = 0;
        if (true === bYLine) {
            CurLine = Y;
        } else {
            CurLine = this.Pages[PNum].FirstLine;
            var bFindY = false;
            var CurLineY = this.Pages[PNum].Y + this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
            var LastLine = (PNum >= this.Pages.length - 1 ? this.Lines.length - 1 : this.Pages[PNum + 1].FirstLine - 1);
            while (!bFindY) {
                if (Y < CurLineY) {
                    break;
                }
                if (CurLine >= LastLine) {
                    break;
                }
                CurLine++;
                CurLineY = this.Lines[CurLine].Y + this.Pages[PNum].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
            }
        }
        var CurRange = 0;
        var RangesCount = this.Lines[CurLine].Ranges.length;
        if (RangesCount > 1) {
            for (; CurRange < RangesCount - 1; CurRange++) {
                var _CurRange = this.Lines[CurLine].Ranges[CurRange];
                var _NextRange = this.Lines[CurLine].Ranges[CurRange + 1];
                if (X < (_CurRange.XEnd + _NextRange.X) / 2) {
                    break;
                }
            }
        }
        if (CurRange >= RangesCount) {
            CurRange = Math.max(RangesCount - 1, 0);
        }
        var Range = this.Lines[CurLine].Ranges[CurRange];
        var StartPos = Range.StartPos;
        var EndPos = Range.EndPos;
        SearchPos.CurX = Range.XVisible;
        SearchPos.X = X;
        SearchPos.Y = Y;
        if (true === this.Numbering.Check_Range(CurRange, CurLine)) {
            var NumPr = this.Numbering_Get();
            if (para_Numbering === this.Numbering.Type && undefined !== NumPr && undefined !== NumPr.NumId && 0 !== NumPr.NumId && "0" !== NumPr.NumId) {
                var NumJc = this.Parent.Get_Numbering().Get_AbstractNum(NumPr.NumId).Lvl[NumPr.Lvl].Jc;
                var NumX0 = SearchPos.CurX;
                var NumX1 = SearchPos.CurX;
                switch (NumJc) {
                case align_Right:
                    NumX0 -= this.Numbering.WidthNum;
                    break;
                case align_Center:
                    NumX0 -= this.Numbering.WidthNum / 2;
                    NumX1 += this.Numbering.WidthNum / 2;
                    break;
                case align_Left:
                    default:
                    NumX1 += this.Numbering.WidthNum;
                    break;
                }
                if (SearchPos.X >= NumX0 && SearchPos.X <= NumX1) {
                    SearchPos.Numbering = true;
                }
            }
            SearchPos.CurX += this.Numbering.WidthVisible;
        }
        for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
            var Item = this.Content[CurPos];
            if (false === SearchPos.InText) {
                SearchPos.InTextPos.Update2(CurPos, 0);
            }
            if (true === Item.Get_ParaContentPosByXY(SearchPos, 1, CurLine, CurRange, StepEnd)) {
                SearchPos.Pos.Update2(CurPos, 0);
            }
        }
        if (true === SearchPos.InText && Y >= this.Pages[PNum].Y + this.Lines[CurLine].Y - this.Lines[CurLine].Metrics.Ascent - 0.01 && Y <= this.Pages[PNum].Y + this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap + 0.01) {
            SearchPos.InText = true;
        } else {
            SearchPos.InText = false;
        }
        if (SearchPos.DiffX > 1000000 - 1) {
            SearchPos.Line = -1;
            SearchPos.Range = -1;
        } else {
            SearchPos.Line = CurLine;
            SearchPos.Range = CurRange;
        }
        return SearchPos;
    },
    Cursor_GetPos: function () {
        return {
            X: this.CurPos.RealX,
            Y: this.CurPos.RealY
        };
    },
    Cursor_MoveLeft: function (Count, AddToSelect, Word) {
        if (true === this.Selection.Use) {
            var EndSelectionPos = this.Get_ParaContentPos(true, false);
            var StartSelectionPos = this.Get_ParaContentPos(true, true);
            if (true !== AddToSelect) {
                var SelectPos = StartSelectionPos;
                if (StartSelectionPos.Compare(EndSelectionPos) > 0) {
                    SelectPos = EndSelectionPos;
                }
                this.Selection_Remove();
                this.Set_ParaContentPos(SelectPos, true, -1, -1);
            } else {
                var SearchPos = new CParagraphSearchPos();
                SearchPos.ForSelection = true;
                if (true === Word) {
                    this.Get_WordStartPos(SearchPos, EndSelectionPos);
                } else {
                    this.Get_LeftPos(SearchPos, EndSelectionPos);
                }
                if (true === SearchPos.Found) {
                    this.Set_SelectionContentPos(StartSelectionPos, SearchPos.Pos);
                } else {
                    return false;
                }
            }
        } else {
            var SearchPos = new CParagraphSearchPos();
            var ContentPos = this.Get_ParaContentPos(false, false);
            if (true === AddToSelect) {
                SearchPos.ForSelection = true;
            }
            if (true === Word) {
                this.Get_WordStartPos(SearchPos, ContentPos);
            } else {
                this.Get_LeftPos(SearchPos, ContentPos);
            }
            if (true === AddToSelect) {
                if (true === SearchPos.Found) {
                    this.Selection.Use = true;
                    this.Set_SelectionContentPos(ContentPos, SearchPos.Pos);
                } else {
                    this.Selection.Use = false;
                    return false;
                }
            } else {
                if (true === SearchPos.Found) {
                    this.Set_ParaContentPos(SearchPos.Pos, true, -1, -1);
                } else {
                    return false;
                }
            }
        }
        if (true === this.Selection.Use) {
            var SelectionEndPos = this.Get_ParaContentPos(true, false);
            this.Set_ParaContentPos(SelectionEndPos, false, -1, -1);
        }
        this.Internal_Recalculate_CurPos(this.CurPos.ContentPos, true, false, false);
        this.CurPos.RealX = this.CurPos.X;
        this.CurPos.RealY = this.CurPos.Y;
        return true;
    },
    Cursor_MoveRight: function (Count, AddToSelect, Word) {
        if (true === this.Selection.Use) {
            var EndSelectionPos = this.Get_ParaContentPos(true, false);
            var StartSelectionPos = this.Get_ParaContentPos(true, true);
            if (true !== AddToSelect) {
                if (true === this.Selection_CheckParaEnd()) {
                    this.Selection_Remove();
                    this.Cursor_MoveToEndPos(false);
                    return false;
                } else {
                    var SelectPos = EndSelectionPos;
                    if (StartSelectionPos.Compare(EndSelectionPos) > 0) {
                        SelectPos = StartSelectionPos;
                    }
                    this.Selection_Remove();
                    this.Set_ParaContentPos(SelectPos, true, -1, -1);
                }
            } else {
                var SearchPos = new CParagraphSearchPos();
                SearchPos.ForSelection = true;
                if (true === Word) {
                    this.Get_WordEndPos(SearchPos, EndSelectionPos, true);
                } else {
                    this.Get_RightPos(SearchPos, EndSelectionPos, true);
                }
                if (true === SearchPos.Found) {
                    this.Set_SelectionContentPos(StartSelectionPos, SearchPos.Pos);
                } else {
                    return false;
                }
            }
        } else {
            var SearchPos = new CParagraphSearchPos();
            var ContentPos = this.Get_ParaContentPos(false, false);
            if (true === AddToSelect) {
                SearchPos.ForSelection = true;
            }
            if (true === Word) {
                this.Get_WordEndPos(SearchPos, ContentPos, AddToSelect);
            } else {
                this.Get_RightPos(SearchPos, ContentPos, AddToSelect);
            }
            if (true === AddToSelect) {
                if (true === SearchPos.Found) {
                    this.Selection.Use = true;
                    this.Set_SelectionContentPos(ContentPos, SearchPos.Pos);
                } else {
                    this.Selection.Use = false;
                    return false;
                }
            } else {
                if (true === SearchPos.Found) {
                    this.Set_ParaContentPos(SearchPos.Pos, true, -1, -1);
                } else {
                    return false;
                }
            }
        }
        if (true === this.Selection.Use) {
            var SelectionEndPos = this.Get_ParaContentPos(true, false);
            this.Set_ParaContentPos(SelectionEndPos, false, -1, -1);
        }
        this.Internal_Recalculate_CurPos(this.CurPos.ContentPos, true, false, false);
        this.CurPos.RealX = this.CurPos.X;
        this.CurPos.RealY = this.CurPos.Y;
        return true;
    },
    Cursor_MoveAt: function (X, Y, bLine, bDontChangeRealPos, PageNum) {
        var SearchPosXY = this.Get_ParaContentPosByXY(X, Y, PageNum, bLine, false);
        this.Set_ParaContentPos(SearchPosXY.Pos, false, SearchPosXY.Line, SearchPosXY.Range);
        this.Internal_Recalculate_CurPos(-1, false, false, false);
        if (bDontChangeRealPos != true) {
            this.CurPos.RealX = this.CurPos.X;
            this.CurPos.RealY = this.CurPos.Y;
        }
        if (true != bLine) {
            this.CurPos.RealX = X;
            this.CurPos.RealY = Y;
        }
    },
    Get_PosByElement: function (Class) {
        var ContentPos = new CParagraphContentPos();
        var CurRange = Class.StartRange;
        var CurLine = Class.StartLine;
        if (undefined !== this.Lines[CurLine] && undefined !== this.Lines[CurLine].Ranges[CurRange]) {
            var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
            var EndPos = this.Lines[CurLine].Ranges[CurRange].EndPos;
            for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
                var Element = this.Content[CurPos];
                ContentPos.Update(CurPos, 0);
                if (true === Element.Get_PosByElement(Class, ContentPos, 1, true, CurRange, CurLine)) {
                    return ContentPos;
                }
            }
        }
        var ContentLen = this.Content.length;
        for (var CurPos = 0; CurPos < ContentLen; CurPos++) {
            var Element = this.Content[CurPos];
            ContentPos.Update(CurPos, 0);
            if (true === Element.Get_PosByElement(Class, ContentPos, 1, false, -1, -1)) {
                return ContentPos;
            }
        }
        return null;
    },
    Get_RunElementByPos: function (ContentPos) {
        var CurPos = ContentPos.Get(0);
        var ContentLen = this.Content.length;
        var Element = this.Content[CurPos].Get_RunElementByPos(ContentPos, 1);
        while (null === Element) {
            CurPos++;
            if (CurPos >= ContentLen) {
                break;
            }
            Element = this.Content[CurPos].Get_RunElementByPos();
        }
        return Element;
    },
    Get_PageStartPos: function (CurPage) {
        var CurLine = this.Pages[CurPage].StartLine;
        var CurRange = 0;
        return this.Get_StartRangePos2(CurLine, CurRange);
    },
    Get_LeftPos: function (SearchPos, ContentPos) {
        var Depth = 0;
        var CurPos = ContentPos.Get(Depth);
        this.Content[CurPos].Get_LeftPos(SearchPos, ContentPos, Depth + 1, true);
        SearchPos.Pos.Update(CurPos, Depth);
        if (true === SearchPos.Found) {
            return true;
        }
        CurPos--;
        if (CurPos >= 0 && para_Math === this.Content[CurPos + 1].Type) {
            this.Content[CurPos].Get_EndPos(false, SearchPos.Pos, Depth + 1);
            SearchPos.Pos.Update(CurPos, Depth);
            SearchPos.Found = true;
            return true;
        }
        while (CurPos >= 0) {
            this.Content[CurPos].Get_LeftPos(SearchPos, ContentPos, Depth + 1, false);
            SearchPos.Pos.Update(CurPos, Depth);
            if (true === SearchPos.Found) {
                return true;
            }
            CurPos--;
        }
        return false;
    },
    Get_RightPos: function (SearchPos, ContentPos, StepEnd) {
        var Depth = 0;
        var CurPos = ContentPos.Get(Depth);
        this.Content[CurPos].Get_RightPos(SearchPos, ContentPos, Depth + 1, true, StepEnd);
        SearchPos.Pos.Update(CurPos, Depth);
        if (true === SearchPos.Found) {
            return true;
        }
        CurPos++;
        var Count = this.Content.length;
        if (CurPos < Count && para_Math === this.Content[CurPos - 1].Type) {
            this.Content[CurPos].Get_StartPos(SearchPos.Pos, Depth + 1);
            SearchPos.Pos.Update(CurPos, Depth);
            SearchPos.Found = true;
            return true;
        }
        while (CurPos < Count) {
            this.Content[CurPos].Get_RightPos(SearchPos, ContentPos, Depth + 1, false, StepEnd);
            SearchPos.Pos.Update(CurPos, Depth);
            if (true === SearchPos.Found) {
                return true;
            }
            CurPos++;
        }
        return false;
    },
    Get_WordStartPos: function (SearchPos, ContentPos) {
        var Depth = 0;
        var CurPos = ContentPos.Get(Depth);
        this.Content[CurPos].Get_WordStartPos(SearchPos, ContentPos, Depth + 1, true);
        if (true === SearchPos.UpdatePos) {
            SearchPos.Pos.Update(CurPos, Depth);
        }
        if (true === SearchPos.Found) {
            return;
        }
        CurPos--;
        var Count = this.Content.length;
        while (CurPos >= 0) {
            this.Content[CurPos].Get_WordStartPos(SearchPos, ContentPos, Depth + 1, false);
            if (true === SearchPos.UpdatePos) {
                SearchPos.Pos.Update(CurPos, Depth);
            }
            if (true === SearchPos.Found) {
                return;
            }
            CurPos--;
        }
        if (true === SearchPos.Shift) {
            SearchPos.Found = true;
        }
    },
    Get_WordEndPos: function (SearchPos, ContentPos, StepEnd) {
        var Depth = 0;
        var CurPos = ContentPos.Get(Depth);
        this.Content[CurPos].Get_WordEndPos(SearchPos, ContentPos, Depth + 1, true, StepEnd);
        if (true === SearchPos.UpdatePos) {
            SearchPos.Pos.Update(CurPos, Depth);
        }
        if (true === SearchPos.Found) {
            return;
        }
        CurPos++;
        var Count = this.Content.length;
        while (CurPos < Count) {
            this.Content[CurPos].Get_WordEndPos(SearchPos, ContentPos, Depth + 1, false, StepEnd);
            if (true === SearchPos.UpdatePos) {
                SearchPos.Pos.Update(CurPos, Depth);
            }
            if (true === SearchPos.Found) {
                return;
            }
            CurPos++;
        }
        if (true === SearchPos.Shift) {
            SearchPos.Found = true;
        }
    },
    Get_EndRangePos: function (SearchPos, ContentPos) {
        var LinePos = this.Get_ParaPosByContentPos(ContentPos);
        var CurLine = LinePos.Line;
        var CurRange = LinePos.Range;
        var Range = this.Lines[CurLine].Ranges[CurRange];
        var StartPos = Range.StartPos;
        var EndPos = Range.EndPos;
        SearchPos.Line = CurLine;
        SearchPos.Range = CurRange;
        for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
            var Item = this.Content[CurPos];
            if (true === Item.Get_EndRangePos(CurLine, CurRange, SearchPos, 1)) {
                SearchPos.Pos.Update(CurPos, 0);
            }
        }
    },
    Get_StartRangePos: function (SearchPos, ContentPos) {
        var LinePos = this.Get_ParaPosByContentPos(ContentPos);
        var CurLine = LinePos.Line;
        var CurRange = LinePos.Range;
        var Range = this.Lines[CurLine].Ranges[CurRange];
        var StartPos = Range.StartPos;
        var EndPos = Range.EndPos;
        SearchPos.Line = CurLine;
        SearchPos.Range = CurRange;
        for (var CurPos = EndPos; CurPos >= StartPos; CurPos--) {
            var Item = this.Content[CurPos];
            if (true === Item.Get_StartRangePos(CurLine, CurRange, SearchPos, 1)) {
                SearchPos.Pos.Update(CurPos, 0);
            }
        }
    },
    Get_StartRangePos2: function (CurLine, CurRange) {
        var ContentPos = new CParagraphContentPos();
        var Depth = 0;
        var Pos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        ContentPos.Update(Pos, Depth);
        this.Content[Pos].Get_StartRangePos2(CurLine, CurRange, ContentPos, Depth + 1);
        return ContentPos;
    },
    Get_StartPos: function () {
        var ContentPos = new CParagraphContentPos();
        var Depth = 0;
        ContentPos.Update(0, Depth);
        this.Content[0].Get_StartPos(ContentPos, Depth + 1);
        return ContentPos;
    },
    Get_EndPos: function (BehindEnd) {
        var ContentPos = new CParagraphContentPos();
        var Depth = 0;
        var ContentLen = this.Content.length;
        ContentPos.Update(ContentLen - 1, Depth);
        this.Content[ContentLen - 1].Get_EndPos(BehindEnd, ContentPos, Depth + 1);
        return ContentPos;
    },
    Get_EndPos2: function (BehindEnd) {
        var ContentPos = new CParagraphContentPos();
        var Depth = 0;
        var ContentLen = this.Content.length;
        var Pos;
        if (this.Content.length > 1) {
            Pos = ContentLen - 2;
        } else {
            Pos = ContentLen - 1;
        }
        ContentPos.Update(Pos, Depth);
        this.Content[Pos].Get_EndPos(BehindEnd, ContentPos, Depth + 1);
        return ContentPos;
    },
    Get_NextRunElements: function (RunElements) {
        var ContentPos = RunElements.ContentPos;
        var CurPos = ContentPos.Get(0);
        var ContentLen = this.Content.length;
        this.Content[CurPos].Get_NextRunElements(RunElements, true, 1);
        if (RunElements.Count <= 0) {
            return;
        }
        CurPos++;
        while (CurPos < ContentLen) {
            this.Content[CurPos].Get_NextRunElements(RunElements, false, 1);
            if (RunElements.Count <= 0) {
                break;
            }
            CurPos++;
        }
    },
    Get_PrevRunElements: function (RunElements) {
        var ContentPos = RunElements.ContentPos;
        var CurPos = ContentPos.Get(0);
        this.Content[CurPos].Get_PrevRunElements(RunElements, true, 1);
        if (RunElements.Count <= 0) {
            return;
        }
        CurPos--;
        while (CurPos >= 0) {
            this.Content[CurPos].Get_PrevRunElements(RunElements, false, 1);
            if (RunElements.Count <= 0) {
                break;
            }
            CurPos--;
        }
    },
    Cursor_MoveUp: function (Count, AddToSelect) {
        var Result = true;
        if (true === this.Selection.Use) {
            var SelectionStartPos = this.Get_ParaContentPos(true, true);
            var SelectionEndPos = this.Get_ParaContentPos(true, false);
            if (true === AddToSelect) {
                var LinePos = this.Get_ParaPosByContentPos(SelectionEndPos);
                var CurLine = LinePos.Line;
                if (0 == CurLine) {
                    EndPos = this.Get_StartPos();
                    Result = false;
                } else {
                    this.Cursor_MoveAt(this.CurPos.RealX, CurLine - 1, true, true);
                    EndPos = this.Get_ParaContentPos(false, false);
                }
                this.Selection.Use = true;
                this.Set_SelectionContentPos(SelectionStartPos, EndPos);
            } else {
                var TopPos = SelectionStartPos;
                if (SelectionStartPos.Compare(SelectionEndPos) > 0) {
                    TopPos = SelectionEndPos;
                }
                var LinePos = this.Get_ParaPosByContentPos(TopPos);
                var CurLine = LinePos.Line;
                var CurRange = LinePos.Range;
                this.Set_ParaContentPos(TopPos, false, CurLine, CurRange);
                this.Internal_Recalculate_CurPos(0, true, false, false);
                this.CurPos.RealX = this.CurPos.X;
                this.CurPos.RealY = this.CurPos.Y;
                this.Selection_Remove();
                if (0 == CurLine) {
                    return false;
                } else {
                    this.Cursor_MoveAt(this.CurPos.RealX, CurLine - 1, true, true);
                }
            }
        } else {
            var LinePos = this.Get_CurrentParaPos();
            var CurLine = LinePos.Line;
            if (true === AddToSelect) {
                var StartPos = this.Get_ParaContentPos(false, false);
                var EndPos = null;
                if (0 == CurLine) {
                    EndPos = this.Get_StartPos();
                    Result = false;
                } else {
                    this.Cursor_MoveAt(this.CurPos.RealX, CurLine - 1, true, true);
                    EndPos = this.Get_ParaContentPos(false, false);
                }
                this.Selection.Use = true;
                this.Set_SelectionContentPos(StartPos, EndPos);
            } else {
                if (0 == CurLine) {
                    return false;
                } else {
                    this.Cursor_MoveAt(this.CurPos.RealX, CurLine - 1, true, true);
                }
            }
        }
        return Result;
    },
    Cursor_MoveDown: function (Count, AddToSelect) {
        var Result = true;
        if (true === this.Selection.Use) {
            var SelectionStartPos = this.Get_ParaContentPos(true, true);
            var SelectionEndPos = this.Get_ParaContentPos(true, false);
            if (true === AddToSelect) {
                var LinePos = this.Get_ParaPosByContentPos(SelectionEndPos);
                var CurLine = LinePos.Line;
                if (this.Lines.length - 1 == CurLine) {
                    EndPos = this.Get_EndPos(true);
                    Result = false;
                } else {
                    this.Cursor_MoveAt(this.CurPos.RealX, CurLine + 1, true, true);
                    EndPos = this.Get_ParaContentPos(false, false);
                }
                this.Selection.Use = true;
                this.Set_SelectionContentPos(SelectionStartPos, EndPos);
            } else {
                var BottomPos = SelectionEndPos;
                if (SelectionStartPos.Compare(SelectionEndPos) > 0) {
                    BottomPos = SelectionStartPos;
                }
                var LinePos = this.Get_ParaPosByContentPos(BottomPos);
                var CurLine = LinePos.Line;
                var CurRange = LinePos.Range;
                this.Set_ParaContentPos(BottomPos, false, CurLine, CurRange);
                this.Internal_Recalculate_CurPos(0, true, false, false);
                this.CurPos.RealX = this.CurPos.X;
                this.CurPos.RealY = this.CurPos.Y;
                this.Selection_Remove();
                if (this.Lines.length - 1 == CurLine) {
                    return false;
                } else {
                    this.Cursor_MoveAt(this.CurPos.RealX, CurLine + 1, true, true);
                }
            }
        } else {
            var LinePos = this.Get_CurrentParaPos();
            var CurLine = LinePos.Line;
            if (true === AddToSelect) {
                var StartPos = this.Get_ParaContentPos(false, false);
                var EndPos = null;
                if (this.Lines.length - 1 == CurLine) {
                    EndPos = this.Get_EndPos(true);
                    Result = false;
                } else {
                    this.Cursor_MoveAt(this.CurPos.RealX, CurLine + 1, true, true);
                    EndPos = this.Get_ParaContentPos(false, false);
                }
                this.Selection.Use = true;
                this.Set_SelectionContentPos(StartPos, EndPos);
            } else {
                if (this.Lines.length - 1 == CurLine) {
                    return false;
                } else {
                    this.Cursor_MoveAt(this.CurPos.RealX, CurLine + 1, true, true);
                }
            }
        }
        return Result;
    },
    Cursor_MoveEndOfLine: function (AddToSelect) {
        if (true === this.Selection.Use) {
            var EndSelectionPos = this.Get_ParaContentPos(true, false);
            var StartSelectionPos = this.Get_ParaContentPos(true, true);
            if (true === AddToSelect) {
                var SearchPos = new CParagraphSearchPos();
                this.Get_EndRangePos(SearchPos, EndSelectionPos);
                this.Set_SelectionContentPos(StartSelectionPos, SearchPos.Pos);
            } else {
                var RightPos = EndSelectionPos;
                if (EndSelectionPos.Compare(StartSelectionPos) < 0) {
                    RightPos = StartSelectionPos;
                }
                var SearchPos = new CParagraphSearchPos();
                this.Get_EndRangePos(SearchPos, RightPos);
                this.Selection_Remove();
                this.Set_ParaContentPos(SearchPos.Pos, false, SearchPos.Line, SearchPos.Range);
            }
        } else {
            var SearchPos = new CParagraphSearchPos();
            var ContentPos = this.Get_ParaContentPos(false, false);
            this.Get_EndRangePos(SearchPos, ContentPos);
            if (true === AddToSelect) {
                this.Selection.Use = true;
                this.Set_SelectionContentPos(ContentPos, SearchPos.Pos);
            } else {
                this.Set_ParaContentPos(SearchPos.Pos, false, SearchPos.Line, SearchPos.Range);
            }
        }
        if (true === this.Selection.Use) {
            var SelectionEndPos = this.Get_ParaContentPos(true, false);
            this.Set_ParaContentPos(SelectionEndPos, false, -1, -1);
        }
        this.Internal_Recalculate_CurPos(this.CurPos.ContentPos, true, false, false);
        this.CurPos.RealX = this.CurPos.X;
        this.CurPos.RealY = this.CurPos.Y;
    },
    Cursor_MoveStartOfLine: function (AddToSelect) {
        if (true === this.Selection.Use) {
            var EndSelectionPos = this.Get_ParaContentPos(true, false);
            var StartSelectionPos = this.Get_ParaContentPos(true, true);
            if (true === AddToSelect) {
                var SearchPos = new CParagraphSearchPos();
                this.Get_StartRangePos(SearchPos, EndSelectionPos);
                this.Set_SelectionContentPos(StartSelectionPos, SearchPos.Pos);
            } else {
                var LeftPos = StartSelectionPos;
                if (StartSelectionPos.Compare(EndSelectionPos) > 0) {
                    LeftPos = EndSelectionPos;
                }
                var SearchPos = new CParagraphSearchPos();
                this.Get_StartRangePos(SearchPos, LeftPos);
                this.Selection_Remove();
                this.Set_ParaContentPos(SearchPos.Pos, false, SearchPos.Line, SearchPos.Range);
            }
        } else {
            var SearchPos = new CParagraphSearchPos();
            var ContentPos = this.Get_ParaContentPos(false, false);
            this.Get_StartRangePos(SearchPos, ContentPos);
            if (true === AddToSelect) {
                this.Selection.Use = true;
                this.Set_SelectionContentPos(ContentPos, SearchPos.Pos);
            } else {
                this.Set_ParaContentPos(SearchPos.Pos, false, SearchPos.Line, SearchPos.Range);
            }
        }
        if (true === this.Selection.Use) {
            var SelectionEndPos = this.Get_ParaContentPos(true, false);
            this.Set_ParaContentPos(SelectionEndPos, false, -1, -1);
        }
        this.Internal_Recalculate_CurPos(this.CurPos.ContentPos, true, false, false);
        this.CurPos.RealX = this.CurPos.X;
        this.CurPos.RealY = this.CurPos.Y;
    },
    Cursor_MoveToStartPos: function (AddToSelect) {
        if (true === AddToSelect) {
            var StartPos = null;
            if (true === this.Selection.Use) {
                StartPos = this.Get_ParaContentPos(true, true);
            } else {
                StartPos = this.Get_ParaContentPos(false, false);
            }
            var EndPos = this.Get_StartPos();
            this.Selection.Use = true;
            this.Selection.Start = false;
            this.Set_SelectionContentPos(StartPos, EndPos);
        } else {
            this.Selection_Remove();
            this.CurPos.ContentPos = 0;
            this.Content[0].Cursor_MoveToStartPos();
            this.Correct_ContentPos(false);
            this.Correct_ContentPos2();
        }
    },
    Cursor_MoveToEndPos: function (AddToSelect, StartSelectFromEnd) {
        if (true === AddToSelect) {
            var StartPos = null;
            if (true === this.Selection.Use) {
                StartPos = this.Get_ParaContentPos(true, true);
            } else {
                StartPos = this.Get_ParaContentPos(false, false);
            }
            var EndPos = this.Get_EndPos(true);
            this.Selection.Use = true;
            this.Selection.Start = false;
            this.Set_SelectionContentPos(StartPos, EndPos);
        } else {
            if (true === StartSelectFromEnd) {
                this.Selection.Use = true;
                this.Selection.Start = false;
                this.Selection.StartPos = this.Content.length - 1;
                this.Selection.EndPos = this.Content.length - 1;
                this.CurPos.ContentPos = this.Content.length - 1;
                this.Content[this.CurPos.ContentPos].Cursor_MoveToEndPos(true);
            } else {
                this.Selection_Remove();
                this.CurPos.ContentPos = this.Content.length - 1;
                this.Content[this.CurPos.ContentPos].Cursor_MoveToEndPos();
                this.Correct_ContentPos(false);
                this.Correct_ContentPos2();
            }
        }
    },
    Cursor_MoveToNearPos: function (NearPos) {
        this.Set_ParaContentPos(NearPos.ContentPos, true, -1, -1);
        this.Selection.Use = true;
        this.Set_SelectionContentPos(NearPos.ContentPos, NearPos.ContentPos);
        var SelectionStartPos = this.Get_ParaContentPos(true, true);
        var SelectionEndPos = this.Get_ParaContentPos(true, false);
        if (0 === SelectionStartPos.Compare(SelectionEndPos)) {
            this.Selection_Remove();
        }
    },
    Cursor_MoveUp_To_LastRow: function (X, Y, AddToSelect) {
        this.CurPos.RealX = X;
        this.CurPos.RealY = Y;
        this.Cursor_MoveAt(X, this.Lines.length - 1, true, true, this.PageNum);
        if (true === AddToSelect) {
            if (false === this.Selection.Use) {
                this.Selection.Use = true;
                this.Set_SelectionContentPos(this.Get_EndPos(true), this.Get_ParaContentPos(false, false));
            } else {
                this.Set_SelectionContentPos(this.Get_ParaContentPos(true, true), this.Get_ParaContentPos(false, false));
            }
        }
    },
    Cursor_MoveDown_To_FirstRow: function (X, Y, AddToSelect) {
        this.CurPos.RealX = X;
        this.CurPos.RealY = Y;
        var CurContentPos = this.Cursor_MoveAt(X, 0, true, true, this.PageNum);
        if (true === AddToSelect) {
            if (false === this.Selection.Use) {
                this.Selection.Use = true;
                this.Set_SelectionContentPos(this.Get_StartPos(), this.Get_ParaContentPos(false, false));
            } else {
                this.Set_SelectionContentPos(this.Get_ParaContentPos(true, true), this.Get_ParaContentPos(false, false));
            }
        }
    },
    Cursor_MoveTo_Drawing: function (Id, bBefore) {
        if (undefined === bBefore) {
            bBefore = true;
        }
        var ContentPos = new CParagraphContentPos();
        var ContentLen = this.Content.length;
        var bFind = false;
        for (var CurPos = 0; CurPos < ContentLen; CurPos++) {
            var Element = this.Content[CurPos];
            ContentPos.Update(CurPos, 0);
            if (true === Element.Get_PosByDrawing(Id, ContentPos, 1)) {
                bFind = true;
                break;
            }
        }
        if (false === bFind || ContentPos.Depth <= 0) {
            return;
        }
        if (true != bBefore) {
            ContentPos.Data[ContentPos.Depth - 1]++;
        }
        this.Selection_Remove();
        this.Set_ParaContentPos(ContentPos, false, -1, -1);
        this.RecalculateCurPos();
        this.CurPos.RealX = this.CurPos.X;
        this.CurPos.RealY = this.CurPos.Y;
    },
    Set_ContentPos: function (Pos, bCorrectPos, Line) {
        this.CurPos.ContentPos = Math.max(0, Math.min(this.Content.length - 1, Pos));
        this.CurPos.Line = (undefined === Line ? -1 : Line);
        if (false != bCorrectPos) {
            this.Internal_Correct_ContentPos();
        }
    },
    Internal_Correct_ContentPos: function () {
        var Count = this.Content.length;
        var CurPos = this.CurPos.ContentPos;
        var TempPos = CurPos;
        while (TempPos >= 0 && TempPos < Count && undefined === this.Content[TempPos].CurLine) {
            TempPos--;
        }
        var CurLine = (this.CurPos.Line === -1 ? (TempPos >= 0 && TempPos < Count ? this.Content[TempPos].CurLine : -1) : this.CurPos.Line);
        while (CurPos < Count - 1) {
            var Item = this.Content[CurPos];
            var ItemType = Item.Type;
            if (para_Text === ItemType || para_Space === ItemType || para_End === ItemType || para_Tab === ItemType || (para_Drawing === ItemType && true === Item.Is_Inline()) || para_PageNum === ItemType || para_NewLine === ItemType || para_HyperlinkStart === ItemType || para_Math === ItemType) {
                break;
            }
            CurPos++;
        }
        while (CurPos > 0) {
            CurPos--;
            var Item = this.Content[CurPos];
            var ItemType = Item.Type;
            var bEnd = false;
            if (para_Text === ItemType || para_Space === ItemType || para_End === ItemType || para_Tab === ItemType || (para_Drawing === ItemType && true === Item.Is_Inline()) || para_PageNum === ItemType || para_NewLine === ItemType || para_Math === ItemType) {
                this.CurPos.ContentPos = CurPos + 1;
                bEnd = true;
            } else {
                if (para_HyperlinkEnd === ItemType) {
                    while (CurPos < Count - 1 && para_TextPr === this.Content[CurPos + 1].Type) {
                        CurPos++;
                    }
                    this.CurPos.ContentPos = CurPos + 1;
                    bEnd = true;
                }
            }
            if (true === bEnd) {
                TempPos = CurPos;
                while (TempPos >= 0 && TempPos < Count && undefined === this.Content[TempPos].CurLine) {
                    TempPos--;
                }
                var NewLine = (TempPos >= 0 && TempPos < Count ? this.Content[TempPos].CurLine : -1);
                if (NewLine != CurLine && -1 != CurLine) {
                    this.CurPos.Line = CurLine;
                }
                return;
            }
        }
        if (CurPos <= 0) {
            CurPos = 0;
            while (para_TextPr === this.Content[CurPos].Type || para_CollaborativeChangesEnd === this.Content[CurPos].Type || para_CollaborativeChangesStart === this.Content[CurPos].Type) {
                CurPos++;
            }
            this.CurPos.ContentPos = CurPos;
        }
    },
    Get_CurPosXY: function () {
        return {
            X: this.CurPos.RealX,
            Y: this.CurPos.RealY
        };
    },
    Is_SelectionUse: function () {
        return this.Selection.Use;
    },
    Internal_GetStartPos: function () {
        var oPos = this.Internal_FindForward(0, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_End, para_Math]);
        if (true === oPos.Found) {
            return oPos.LetterPos;
        }
        return 0;
    },
    Internal_GetEndPos: function () {
        var Res = this.Internal_FindBackward(this.Content.length - 1, [para_End]);
        if (true === Res.Found) {
            return Res.LetterPos;
        }
        return 0;
    },
    Correct_Content: function (_StartPos, _EndPos) {
        var StartPos = (undefined === _StartPos ? 0 : Math.max(_StartPos - 1, 0));
        var EndPos = (undefined === _EndPos ? this.Content.length - 1 : Math.min(_EndPos + 1, this.Content.length - 1));
        var CommentsToDelete = [];
        for (var CurPos = EndPos; CurPos >= StartPos; CurPos--) {
            var CurElement = this.Content[CurPos];
            if ((para_Hyperlink === CurElement.Type || para_Math === CurElement.Type) && true === CurElement.Is_Empty() && true !== CurElement.Is_CheckingNearestPos()) {
                this.Internal_Content_Remove(CurPos);
                CurPos++;
            } else {
                if (para_Comment === CurElement.Type && false === CurElement.Start) {
                    var CommentId = CurElement.CommentId;
                    for (var CurPos2 = CurPos - 1; CurPos2 >= 0; CurPos2--) {
                        var CurElement2 = this.Content[CurPos2];
                        if (para_Comment === CurElement2.Type && CommentId === CurElement2.CommentId) {
                            CommentsToDelete.push(CommentId);
                            break;
                        } else {
                            if (true !== CurElement2.Is_Empty()) {
                                break;
                            }
                        }
                    }
                } else {
                    if (para_Run !== CurElement.Type) {
                        if (CurPos === this.Content.length - 1 || para_Run !== this.Content[CurPos + 1].Type || CurPos === this.Content.length - 2) {
                            var NewRun = new ParaRun(this);
                            this.Internal_Content_Add(CurPos + 1, NewRun);
                        }
                        if (StartPos === CurPos && (0 === CurPos || para_Run !== this.Content[CurPos - 1].Type)) {
                            var NewRun = new ParaRun(this);
                            this.Internal_Content_Add(CurPos, NewRun);
                        }
                    } else {
                        if (true === CurElement.Is_Empty() && (0 < CurPos || para_Run !== this.Content[CurPos].Type) && CurPos < this.Content.length - 1 && para_Run === this.Content[CurPos + 1].Type) {
                            this.Internal_Content_Remove(CurPos);
                        }
                    }
                }
            }
        }
        var CommentsCount = CommentsToDelete.length;
        for (var CommentIndex = 0; CommentIndex < CommentsCount; CommentIndex++) {
            this.LogicDocument.Remove_Comment(CommentsToDelete[CommentIndex], true, false);
        }
        if (1 === this.Content.length || para_Run !== this.Content[this.Content.length - 2].Type) {
            var NewRun = new ParaRun(this);
            NewRun.Set_Pr(this.TextPr.Value.Copy());
            this.Internal_Content_Add(this.Content.length - 1, NewRun);
        }
        this.Correct_ContentPos2();
    },
    Apply_TextPr: function (TextPr, IncFontSize) {
        if (true === this.Selection.Use) {
            var StartPos = this.Selection.StartPos;
            var EndPos = this.Selection.EndPos;
            if (StartPos === EndPos) {
                var NewElements = this.Content[EndPos].Apply_TextPr(TextPr, IncFontSize, false);
                if (para_Run === this.Content[EndPos].Type) {
                    var CenterRunPos = this.Internal_ReplaceRun(EndPos, NewElements);
                    if (StartPos === this.CurPos.ContentPos) {
                        this.CurPos.ContentPos = CenterRunPos;
                    }
                    this.Selection.StartPos = CenterRunPos;
                    this.Selection.EndPos = CenterRunPos;
                }
            } else {
                var Direction = 1;
                if (StartPos > EndPos) {
                    var Temp = StartPos;
                    StartPos = EndPos;
                    EndPos = Temp;
                    Direction = -1;
                }
                for (var CurPos = StartPos + 1; CurPos < EndPos; CurPos++) {
                    this.Content[CurPos].Apply_TextPr(TextPr, IncFontSize, false);
                }
                var bCorrectContent = false;
                var NewElements = this.Content[EndPos].Apply_TextPr(TextPr, IncFontSize, false);
                if (para_Run === this.Content[EndPos].Type) {
                    this.Internal_ReplaceRun(EndPos, NewElements);
                    bCorrectContent = true;
                }
                var NewElements = this.Content[StartPos].Apply_TextPr(TextPr, IncFontSize, false);
                if (para_Run === this.Content[StartPos].Type) {
                    this.Internal_ReplaceRun(StartPos, NewElements);
                    bCorrectContent = true;
                }
                if (true === bCorrectContent) {
                    this.Correct_Content();
                }
            }
        } else {
            var Pos = this.CurPos.ContentPos;
            var Element = this.Content[Pos];
            var NewElements = Element.Apply_TextPr(TextPr, IncFontSize, false);
            if (para_Run === Element.Type) {
                var CenterRunPos = this.Internal_ReplaceRun(Pos, NewElements);
                this.CurPos.ContentPos = CenterRunPos;
                this.CurPos.Line = -1;
            }
            if (true === this.Cursor_IsEnd()) {
                if (undefined === IncFontSize) {
                    this.TextPr.Apply_TextPr(TextPr);
                } else {
                    var EndTextPr = this.Get_CompiledPr2(false).TextPr.Copy();
                    EndTextPr.Merge(this.TextPr.Value);
                    this.TextPr.Set_FontSize(FontSize_IncreaseDecreaseValue(IncFontSize, EndTextPr.FontSize));
                }
                var LastElement = this.Content[this.Content.length - 1];
                if (para_Run === Element.Type) {
                    LastElement.Set_Pr(this.TextPr.Value.Copy());
                }
            }
        }
    },
    Internal_ReplaceRun: function (Pos, NewRuns) {
        var LRun = NewRuns[0];
        var CRun = NewRuns[1];
        var RRun = NewRuns[2];
        var CenterRunPos = Pos;
        if (null !== LRun) {
            this.Internal_Content_Add(Pos + 1, CRun);
            CenterRunPos = Pos + 1;
        } else {}
        if (null !== RRun) {
            this.Internal_Content_Add(CenterRunPos + 1, RRun);
        }
        return CenterRunPos;
    },
    Check_Hyperlink: function (X, Y, PageNum) {
        var SearchPosXY = this.Get_ParaContentPosByXY(X, Y, PageNum, false, false);
        var CurPos = SearchPosXY.Pos.Get(0);
        if (true === SearchPosXY.InText && para_Hyperlink === this.Content[CurPos].Type) {
            return this.Content[CurPos];
        }
        return null;
    },
    Hyperlink_Add: function (HyperProps) {
        if (true === this.Selection.Use) {
            var Hyperlink = new ParaHyperlink();
            if (undefined != HyperProps.Value && null != HyperProps.Value) {
                Hyperlink.Set_Value(HyperProps.Value);
            }
            if (undefined != HyperProps.ToolTip && null != HyperProps.ToolTip) {
                Hyperlink.Set_ToolTip(HyperProps.ToolTip);
            }
            var StartContentPos = this.Get_ParaContentPos(true, true);
            var EndContentPos = this.Get_ParaContentPos(true, false);
            if (StartContentPos.Compare(EndContentPos) > 0) {
                var Temp = StartContentPos;
                StartContentPos = EndContentPos;
                EndContentPos = Temp;
            }
            var StartPos = StartContentPos.Get(0);
            var EndPos = EndContentPos.Get(0);
            var CommentsToDelete = {};
            for (var Pos = StartPos; Pos <= EndPos; Pos++) {
                var Item = this.Content[Pos];
                if (para_Comment === Item.Type) {
                    CommentsToDelete[Item.CommentId] = true;
                }
            }
            for (var CommentId in CommentsToDelete) {
                this.LogicDocument.Remove_Comment(CommentId, true, false);
            }
            StartContentPos = this.Get_ParaContentPos(true, true);
            EndContentPos = this.Get_ParaContentPos(true, false);
            if (StartContentPos.Compare(EndContentPos) > 0) {
                var Temp = StartContentPos;
                StartContentPos = EndContentPos;
                EndContentPos = Temp;
            }
            StartPos = StartContentPos.Get(0);
            EndPos = EndContentPos.Get(0);
            if (this.Content.length - 1 === EndPos && true === this.Selection_CheckParaEnd()) {
                EndContentPos = this.Get_EndPos(false);
                EndPos = EndContentPos.Get(0);
            }
            var NewElementE = this.Content[EndPos].Split(EndContentPos, 1);
            var NewElementS = this.Content[StartPos].Split(StartContentPos, 1);
            var HyperPos = 0;
            Hyperlink.Add_ToContent(HyperPos++, NewElementS);
            for (var CurPos = StartPos + 1; CurPos <= EndPos; CurPos++) {
                Hyperlink.Add_ToContent(HyperPos++, this.Content[CurPos]);
            }
            this.Internal_Content_Remove2(StartPos + 1, EndPos - StartPos);
            this.Internal_Content_Add(StartPos + 1, Hyperlink);
            this.Internal_Content_Add(StartPos + 2, NewElementE);
            this.Selection.StartPos = StartPos + 1;
            this.Selection.EndPos = StartPos + 1;
            Hyperlink.Select_All();
            var TextPr = new CTextPr();
            TextPr.Color = null;
            TextPr.Underline = null;
            TextPr.RStyle = editor && editor.isDocumentEditor ? editor.WordControl.m_oLogicDocument.Get_Styles().Get_Default_Hyperlink() : null;
            if (!this.bFromDocument) {
                TextPr.Unifill = CreateUniFillSchemeColorWidthTint(11, 0);
                TextPr.Underline = true;
            }
            Hyperlink.Apply_TextPr(TextPr, undefined, false);
        } else {
            if (null !== HyperProps.Text && "" !== HyperProps.Text) {
                var ContentPos = this.Get_ParaContentPos(false, false);
                var CurPos = ContentPos.Get(0);
                var TextPr = this.Get_TextPr(ContentPos);
                if (undefined !== HyperProps.TextPr && null !== HyperProps.TextPr) {
                    TextPr = HyperProps.TextPr;
                }
                var Hyperlink = new ParaHyperlink();
                if (undefined != HyperProps.Value && null != HyperProps.Value) {
                    Hyperlink.Set_Value(HyperProps.Value);
                }
                if (undefined != HyperProps.ToolTip && null != HyperProps.ToolTip) {
                    Hyperlink.Set_ToolTip(HyperProps.ToolTip);
                }
                var HyperRun = new ParaRun(this);
                Hyperlink.Add_ToContent(0, HyperRun, false);
                if (this.bFromDocument) {
                    var Styles = editor.WordControl.m_oLogicDocument.Get_Styles();
                    HyperRun.Set_Pr(TextPr.Copy());
                    HyperRun.Set_Color(undefined);
                    HyperRun.Set_Underline(undefined);
                    HyperRun.Set_RStyle(Styles.Get_Default_Hyperlink());
                } else {
                    HyperRun.Set_Pr(TextPr.Copy());
                    HyperRun.Set_Color(undefined);
                    HyperRun.Set_Unifill(CreateUniFillSchemeColorWidthTint(11, 0));
                    HyperRun.Set_Underline(true);
                }
                for (var NewPos = 0; NewPos < HyperProps.Text.length; NewPos++) {
                    var Char = HyperProps.Text.charAt(NewPos);
                    if (" " == Char) {
                        HyperRun.Add_ToContent(NewPos, new ParaSpace(), false);
                    } else {
                        HyperRun.Add_ToContent(NewPos, new ParaText(Char), false);
                    }
                }
                var NewElement = this.Content[CurPos].Split(ContentPos, 1);
                if (null !== NewElement) {
                    this.Internal_Content_Add(CurPos + 1, NewElement);
                }
                this.Internal_Content_Add(CurPos + 1, Hyperlink);
                this.CurPos.ContentPos = CurPos + 1;
                Hyperlink.Cursor_MoveToEndPos(false);
            }
        }
        this.Correct_Content();
    },
    Hyperlink_Modify: function (HyperProps) {
        var HyperPos = -1;
        if (true === this.Selection.Use) {
            var StartPos = this.Selection.StartPos;
            var EndPos = this.Selection.EndPos;
            if (StartPos > EndPos) {
                StartPos = this.Selection.EndPos;
                EndPos = this.Selection.StartPos;
            }
            for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
                var Element = this.Content[CurPos];
                if (true !== Element.Selection_IsEmpty() && para_Hyperlink !== Element.Type) {
                    break;
                } else {
                    if (true !== Element.Selection_IsEmpty() && para_Hyperlink === Element.Type) {
                        if (-1 === HyperPos) {
                            HyperPos = CurPos;
                        } else {
                            break;
                        }
                    }
                }
            }
            if (this.Selection.StartPos === this.Selection.EndPos && para_Hyperlink === this.Content[this.Selection.StartPos].Type) {
                HyperPos = this.Selection.StartPos;
            }
        } else {
            if (para_Hyperlink === this.Content[this.CurPos.ContentPos].Type) {
                HyperPos = this.CurPos.ContentPos;
            }
        }
        if (-1 != HyperPos) {
            var Hyperlink = this.Content[HyperPos];
            if (undefined != HyperProps.Value && null != HyperProps.Value) {
                Hyperlink.Set_Value(HyperProps.Value);
            }
            if (undefined != HyperProps.ToolTip && null != HyperProps.ToolTip) {
                Hyperlink.Set_ToolTip(HyperProps.ToolTip);
            }
            if (null != HyperProps.Text) {
                var TextPr = Hyperlink.Get_TextPr();
                Hyperlink.Remove_FromContent(0, Hyperlink.Content.length);
                var HyperRun = new ParaRun(this);
                Hyperlink.Add_ToContent(0, HyperRun, false);
                if (this.bFromDocument) {
                    var Styles = editor.WordControl.m_oLogicDocument.Get_Styles();
                    HyperRun.Set_Pr(TextPr.Copy());
                    HyperRun.Set_Color(undefined);
                    HyperRun.Set_Underline(undefined);
                    HyperRun.Set_RStyle(Styles.Get_Default_Hyperlink());
                } else {
                    HyperRun.Set_Pr(TextPr.Copy());
                    HyperRun.Set_Color(undefined);
                    HyperRun.Set_Unifill(CreateUniFillSchemeColorWidthTint(11, 0));
                    HyperRun.Set_Underline(true);
                }
                for (var NewPos = 0; NewPos < HyperProps.Text.length; NewPos++) {
                    var Char = HyperProps.Text.charAt(NewPos);
                    if (" " == Char) {
                        HyperRun.Add_ToContent(NewPos, new ParaSpace(), false);
                    } else {
                        HyperRun.Add_ToContent(NewPos, new ParaText(Char), false);
                    }
                }
                if (true === this.Selection.Use) {
                    this.Selection.StartPos = HyperPos;
                    this.Selection.EndPos = HyperPos;
                    Hyperlink.Select_All();
                } else {
                    this.CurPos.ContentPos = HyperPos;
                    Hyperlink.Cursor_MoveToEndPos(false);
                }
                return true;
            }
            return false;
        }
        return false;
    },
    Hyperlink_Remove: function () {
        var HyperPos = -1;
        if (true === this.Selection.Use) {
            var StartPos = this.Selection.StartPos;
            var EndPos = this.Selection.EndPos;
            if (StartPos > EndPos) {
                StartPos = this.Selection.EndPos;
                EndPos = this.Selection.StartPos;
            }
            for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
                var Element = this.Content[CurPos];
                if (true !== Element.Selection_IsEmpty() && para_Hyperlink !== Element.Type) {
                    break;
                } else {
                    if (true !== Element.Selection_IsEmpty() && para_Hyperlink === Element.Type) {
                        if (-1 === HyperPos) {
                            HyperPos = CurPos;
                        } else {
                            break;
                        }
                    }
                }
            }
            if (this.Selection.StartPos === this.Selection.EndPos && para_Hyperlink === this.Content[this.Selection.StartPos].Type) {
                HyperPos = this.Selection.StartPos;
            }
        } else {
            if (para_Hyperlink === this.Content[this.CurPos.ContentPos].Type) {
                HyperPos = this.CurPos.ContentPos;
            }
        }
        if (-1 !== HyperPos) {
            var Hyperlink = this.Content[HyperPos];
            var ContentLen = Hyperlink.Content.length;
            this.Internal_Content_Remove(HyperPos);
            var TextPr = new CTextPr();
            TextPr.RStyle = null;
            TextPr.Underline = null;
            TextPr.Color = null;
            TextPr.Unifill = null;
            for (var CurPos = 0; CurPos < ContentLen; CurPos++) {
                var Element = Hyperlink.Content[CurPos];
                this.Internal_Content_Add(HyperPos + CurPos, Element);
                Element.Apply_TextPr(TextPr, undefined, true);
            }
            if (true === this.Selection.Use) {
                this.Selection.StartPos = HyperPos + Hyperlink.State.Selection.StartPos;
                this.Selection.EndPos = HyperPos + Hyperlink.State.Selection.EndPos;
            } else {
                this.CurPos.ContentPos = HyperPos + Hyperlink.State.ContentPos;
            }
            return true;
        }
        return false;
    },
    Hyperlink_CanAdd: function (bCheckInHyperlink) {
        if (true === bCheckInHyperlink) {
            if (true === this.Selection.Use) {
                var StartPos = this.Selection.StartPos;
                var EndPos = this.Selection.EndPos;
                if (EndPos < StartPos) {
                    StartPos = this.Selection.EndPos;
                    EndPos = this.Selection.StartPos;
                }
                for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
                    var Element = this.Content[CurPos];
                    if (para_Hyperlink === Element.Type || para_Math === Element.Type) {
                        return false;
                    }
                }
                return true;
            } else {
                var CurType = this.Content[this.CurPos.ContentPos].Type;
                if (para_Hyperlink === CurType || para_Math === CurType) {
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            if (true === this.Selection.Use) {
                var StartPos = this.Selection.StartPos;
                var EndPos = this.Selection.EndPos;
                if (EndPos < StartPos) {
                    StartPos = this.Selection.EndPos;
                    EndPos = this.Selection.StartPos;
                }
                var bHyper = false;
                for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
                    var Element = this.Content[CurPos];
                    if ((true === bHyper && para_Hyperlink === Element.Type) || para_Math === Element.Type) {
                        return false;
                    } else {
                        if (true !== bHyper && para_Hyperlink === Element.Type) {
                            bHyper = true;
                        }
                    }
                }
                return true;
            } else {
                var CurType = this.Content[this.CurPos.ContentPos].Type;
                if (para_Math === CurType) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    },
    Hyperlink_Check: function (bCheckEnd) {
        var Hyper = null;
        if (true === this.Selection.Use) {} else {
            var Element = this.Content[this.CurPos.ContentPos];
            if (para_Hyperlink === Element.Type) {
                Hyper = Element;
            }
        }
        return Hyper;
    },
    Selection_SetStart: function (X, Y, PageNum, bTableBorder) {
        if (true === this.Selection.Use) {
            this.Selection_Remove();
        }
        var SearchPosXY = this.Get_ParaContentPosByXY(X, Y, PageNum, false, true);
        var SearchPosXY2 = this.Get_ParaContentPosByXY(X, Y, PageNum, false, false);
        this.Selection.Use = true;
        this.Selection.Start = true;
        this.Selection.Flag = selectionflag_Common;
        this.Selection.StartManually = true;
        this.Set_ParaContentPos(SearchPosXY2.Pos, true, SearchPosXY2.Line, SearchPosXY2.Range);
        this.Set_SelectionContentPos(SearchPosXY.Pos, SearchPosXY.Pos);
    },
    Selection_SetEnd: function (X, Y, PageNum, MouseEvent, bTableBorder) {
        var PagesCount = this.Pages.length;
        if (this.bFromDocument && false === editor.isViewMode && null === this.Parent.Is_HdrFtr(true) && null == this.Get_DocumentNext() && PageNum - this.PageNum >= PagesCount - 1 && Y > this.Pages[PagesCount - 1].Bounds.Bottom && MouseEvent.ClickCount >= 2) {
            return this.Parent.Extend_ToPos(X, Y);
        }
        this.CurPos.RealX = X;
        this.CurPos.RealY = Y;
        this.Selection.EndManually = true;
        var SearchPosXY = this.Get_ParaContentPosByXY(X, Y, PageNum, false, true);
        var SearchPosXY2 = this.Get_ParaContentPosByXY(X, Y, PageNum, false, false);
        this.Set_ParaContentPos(SearchPosXY2.Pos, true, SearchPosXY2.Line, SearchPosXY2.Range);
        if (true === SearchPosXY.End || true === this.Is_Empty()) {
            var LastRange = this.Lines[this.Lines.length - 1].Ranges[this.Lines[this.Lines.length - 1].Ranges.length - 1];
            if (PageNum - this.PageNum >= PagesCount - 1 && X > LastRange.W && MouseEvent.ClickCount >= 2 && Y <= this.Pages[PagesCount - 1].Bounds.Bottom) {
                if (this.bFromDocument && false === editor.isViewMode && false === editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_None, {
                    Type: changestype_2_Element_and_Type,
                    Element: this,
                    CheckType: changestype_Paragraph_Content
                })) {
                    History.Create_NewPoint(historydescription_Document_ParagraphExtendToPos);
                    History.Set_Additional_ExtendDocumentToPos();
                    if (true === this.Extend_ToPos(X)) {
                        this.Cursor_MoveToEndPos();
                        this.Document_SetThisElementCurrent(true);
                        editor.WordControl.m_oLogicDocument.Recalculate();
                        return;
                    } else {
                        History.Remove_LastPoint();
                    }
                }
            }
        }
        this.Set_SelectionContentPos(this.Get_ParaContentPos(true, true), SearchPosXY.Pos);
        var SelectionStartPos = this.Get_ParaContentPos(true, true);
        var SelectionEndPos = this.Get_ParaContentPos(true, false);
        if (0 === SelectionStartPos.Compare(SelectionEndPos) && g_mouse_event_type_up === MouseEvent.Type) {
            var NumPr = this.Numbering_Get();
            if (true === SearchPosXY.Numbering && undefined != NumPr) {
                this.Set_ParaContentPos(this.Get_StartPos(), true, -1, -1);
                this.Parent.Update_ConentIndexing();
                this.Parent.Document_SelectNumbering(NumPr, this.Index);
            } else {
                var ClickCounter = MouseEvent.ClickCount % 2;
                if (1 >= MouseEvent.ClickCount) {
                    this.Selection_Remove();
                } else {
                    if (0 == ClickCounter) {
                        var SearchPosS = new CParagraphSearchPos();
                        var SearchPosE = new CParagraphSearchPos();
                        this.Get_WordEndPos(SearchPosE, SearchPosXY.Pos);
                        this.Get_WordStartPos(SearchPosS, SearchPosE.Pos);
                        var StartPos = (true === SearchPosS.Found ? SearchPosS.Pos : this.Get_StartPos());
                        var EndPos = (true === SearchPosE.Found ? SearchPosE.Pos : this.Get_EndPos(false));
                        this.Selection.Use = true;
                        this.Set_SelectionContentPos(StartPos, EndPos);
                    } else {
                        this.Select_All(1);
                    }
                }
            }
        }
    },
    Selection_Stop: function (X, Y, PageNum, MouseEvent) {
        this.Selection.Start = false;
        var StartPos = this.Selection.StartPos;
        var EndPos = this.Selection.EndPos;
        if (StartPos > EndPos) {
            StartPos = this.Selection.EndPos;
            EndPos = this.Selection.StartPos;
        }
        for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
            this.Content[CurPos].Selection_Stop();
        }
    },
    Selection_Remove: function () {
        if (true === this.Selection.Use) {
            var StartPos = this.Selection.StartPos;
            var EndPos = this.Selection.EndPos;
            if (StartPos > EndPos) {
                StartPos = this.Selection.EndPos;
                EndPos = this.Selection.StartPos;
            }
            StartPos = Math.max(0, StartPos);
            EndPos = Math.min(this.Content.length - 1, EndPos);
            for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
                this.Content[CurPos].Selection_Remove();
            }
        }
        this.Selection.Use = false;
        this.Selection.Start = false;
        this.Selection.Flag = selectionflag_Common;
        this.Selection.StartPos = 0;
        this.Selection.EndPos = 0;
        this.Selection_Clear();
    },
    Selection_Clear: function () {},
    Selection_Draw_Page: function (Page_abs) {
        if (true != this.Selection.Use) {
            return;
        }
        var CurPage = Page_abs - this.Get_StartPage_Absolute();
        if (CurPage < 0 || CurPage >= this.Pages.length) {
            return;
        }
        if (0 === CurPage && this.Pages[0].EndLine < 0) {
            return;
        }
        switch (this.Selection.Flag) {
        case selectionflag_Common:
            var StartPos = this.Selection.StartPos;
            var EndPos = this.Selection.EndPos;
            if (StartPos > EndPos) {
                StartPos = this.Selection.EndPos;
                EndPos = this.Selection.StartPos;
            }
            var _StartLine = this.Pages[CurPage].StartLine;
            var _EndLine = this.Pages[CurPage].EndLine;
            if (StartPos > this.Lines[_EndLine].Get_EndPos() || EndPos < this.Lines[_StartLine].Get_StartPos()) {
                return;
            } else {
                StartPos = Math.max(StartPos, this.Lines[_StartLine].Get_StartPos());
                EndPos = Math.min(EndPos, (_EndLine != this.Lines.length - 1 ? this.Lines[_EndLine].Get_EndPos() : this.Content.length - 1));
            }
            var DrawSelection = new CParagraphDrawSelectionRange();
            var bInline = this.Is_Inline();
            for (var CurLine = _StartLine; CurLine <= _EndLine; CurLine++) {
                var Line = this.Lines[CurLine];
                var RangesCount = Line.Ranges.length;
                DrawSelection.StartY = this.Pages[CurPage].Y + this.Lines[CurLine].Top;
                DrawSelection.H = this.Lines[CurLine].Bottom - this.Lines[CurLine].Top;
                for (var CurRange = 0; CurRange < RangesCount; CurRange++) {
                    var Range = Line.Ranges[CurRange];
                    var RStartPos = Range.StartPos;
                    var REndPos = Range.EndPos;
                    if (StartPos > REndPos || EndPos < RStartPos) {
                        continue;
                    }
                    DrawSelection.StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                    DrawSelection.W = 0;
                    DrawSelection.FindStart = true;
                    if (CurLine === this.Numbering.Line && CurRange === this.Numbering.Range) {
                        DrawSelection.StartX += this.Numbering.WidthVisible;
                    }
                    for (var CurPos = RStartPos; CurPos <= REndPos; CurPos++) {
                        var Item = this.Content[CurPos];
                        Item.Selection_DrawRange(CurLine, CurRange, DrawSelection);
                    }
                    var StartX = DrawSelection.StartX;
                    var W = DrawSelection.W;
                    var StartY = DrawSelection.StartY;
                    var H = DrawSelection.H;
                    if (true !== bInline) {
                        var Frame_X_min = this.CalculatedFrame.L2;
                        var Frame_Y_min = this.CalculatedFrame.T2;
                        var Frame_X_max = this.CalculatedFrame.L2 + this.CalculatedFrame.W2;
                        var Frame_Y_max = this.CalculatedFrame.T2 + this.CalculatedFrame.H2;
                        StartX = Math.min(Math.max(Frame_X_min, StartX), Frame_X_max);
                        StartY = Math.min(Math.max(Frame_Y_min, StartY), Frame_Y_max);
                        W = Math.min(W, Frame_X_max - StartX);
                        H = Math.min(H, Frame_Y_max - StartY);
                    }
                    if (W > 0.001) {
                        this.DrawingDocument.AddPageSelection(Page_abs, StartX, StartY, W, H);
                    }
                }
            }
            break;
        case selectionflag_Numbering:
            var ParaNum = this.Numbering;
            var NumberingRun = ParaNum.Run;
            if (null === NumberingRun) {
                break;
            }
            var CurLine = ParaNum.Line;
            var CurRange = ParaNum.Range;
            if (CurLine < this.Pages[CurPage].StartLine || CurLine > this.Pages[CurPage].EndLine) {
                break;
            }
            var SelectY = this.Lines[CurLine].Top + this.Pages[CurPage].Y;
            var SelectX = this.Lines[CurLine].Ranges[CurRange].XVisible;
            var SelectW = ParaNum.WidthVisible;
            var SelectH = this.Lines[CurLine].Bottom - this.Lines[CurLine].Top;
            var NumPr = this.Numbering_Get();
            var NumJc = this.Parent.Get_Numbering().Get_AbstractNum(NumPr.NumId).Lvl[NumPr.Lvl].Jc;
            switch (NumJc) {
            case align_Center:
                SelectX = this.Lines[CurLine].Ranges[CurRange].XVisible - ParaNum.WidthNum / 2;
                SelectW = ParaNum.WidthVisible + ParaNum.WidthNum / 2;
                break;
            case align_Right:
                SelectX = this.Lines[CurLine].Ranges[CurRange].XVisible - ParaNum.WidthNum;
                SelectW = ParaNum.WidthVisible + ParaNum.WidthNum;
                break;
            case align_Left:
                default:
                SelectX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                SelectW = ParaNum.WidthVisible;
                break;
            }
            this.DrawingDocument.AddPageSelection(Page_abs, SelectX, SelectY, SelectW, SelectH);
            break;
        }
    },
    Selection_CheckParaEnd: function () {
        if (true !== this.Selection.Use) {
            return false;
        }
        var EndPos = (this.Selection.StartPos > this.Selection.EndPos ? this.Selection.StartPos : this.Selection.EndPos);
        return this.Content[EndPos].Selection_CheckParaEnd();
    },
    Selection_Check: function (X, Y, Page_Abs, NearPos) {
        var SelSP = this.Get_ParaContentPos(true, true);
        var SelEP = this.Get_ParaContentPos(true, false);
        if (SelSP.Compare(SelEP) > 0) {
            var Temp = SelSP;
            SelSP = SelEP;
            SelEP = Temp;
        }
        if (undefined !== NearPos) {
            if (this === NearPos.Paragraph && ((true === this.Selection.Use && true === this.Selection_CheckParaContentPos(NearPos.ContentPos)) || true === this.ApplyToAll)) {
                return true;
            }
            return false;
        } else {
            var PageIndex = Page_Abs - this.Get_StartPage_Absolute();
            if (PageIndex < 0 || PageIndex >= this.Pages.length || true != this.Selection.Use) {
                return false;
            }
            var SearchPosXY = this.Get_ParaContentPosByXY(X, Y, PageIndex + this.PageNum, false, false, false);
            if (true === SearchPosXY.InText) {
                return this.Selection_CheckParaContentPos(SearchPosXY.InTextPos);
            }
            return false;
        }
        return false;
    },
    Selection_CheckParaContentPos: function (ContentPos) {
        var CurPos = ContentPos.Get(0);
        if (this.Selection.StartPos <= CurPos && CurPos <= this.Selection.EndPos) {
            return this.Content[CurPos].Selection_CheckParaContentPos(ContentPos, 1, this.Selection.StartPos === CurPos, CurPos === this.Selection.EndPos);
        } else {
            (this.Selection.EndPos <= CurPos && CurPos <= this.Selection.StartPos);
        }
        return this.Content[CurPos].Selection_CheckParaContentPos(ContentPos, 1, this.Selection.EndPos === CurPos, CurPos === this.Selection.StartPos);
        return false;
    },
    Selection_CalculateTextPr: function () {
        if (true === this.Selection.Use || true === this.ApplyToAll) {
            var StartPos = this.Selection.StartPos;
            var EndPos = this.Selection.EndPos;
            if (true === this.ApplyToAll) {
                StartPos = 0;
                EndPos = this.Content.length - 1;
            }
            if (StartPos > EndPos) {
                var Temp = EndPos;
                EndPos = StartPos;
                StartPos = Temp;
            }
            if (EndPos >= this.Content.length) {
                EndPos = this.Content.length - 1;
            }
            if (StartPos < 0) {
                StartPos = 0;
            }
            if (StartPos == EndPos) {
                return this.Internal_CalculateTextPr(StartPos);
            }
            while (this.Content[StartPos].Type == para_TextPr) {
                StartPos++;
            }
            var oEnd = this.Internal_FindBackward(EndPos - 1, [para_Text, para_Space]);
            if (oEnd.Found) {
                EndPos = oEnd.LetterPos;
            } else {
                while (this.Content[EndPos].Type == para_TextPr) {
                    EndPos--;
                }
            }
            var TextPr_start = this.Internal_CalculateTextPr(StartPos);
            var TextPr_vis = TextPr_start;
            for (var Pos = StartPos + 1; Pos < EndPos; Pos++) {
                var Item = this.Content[Pos];
                if (para_TextPr == Item.Type && Pos < this.Content.length - 1 && para_TextPr != this.Content[Pos + 1].Type) {
                    var TextPr_cur = this.Internal_CalculateTextPr(Pos);
                    TextPr_vis = TextPr_vis.Compare(TextPr_cur);
                }
            }
            return TextPr_vis;
        } else {
            return new CTextPr();
        }
    },
    Selection_SelectNumbering: function () {
        if (undefined != this.Numbering_Get()) {
            this.Selection.Use = true;
            this.Selection.Flag = selectionflag_Numbering;
        }
    },
    Selection_SetBegEnd: function (StartSelection, StartPara) {
        var ContentPos = (true === StartPara ? this.Get_StartPos() : this.Get_EndPos(true));
        if (true === StartSelection) {
            this.Selection.StartManually = false;
            this.Set_SelectionContentPos(ContentPos, this.Get_ParaContentPos(true, false));
        } else {
            this.Selection.EndManually = false;
            this.Set_SelectionContentPos(this.Get_ParaContentPos(true, true), ContentPos);
        }
    },
    Select_All: function (Direction) {
        var Count = this.Content.length;
        this.Selection.Use = true;
        var StartPos = null,
        EndPos = null;
        if (-1 === Direction) {
            StartPos = this.Get_EndPos(true);
            EndPos = this.Get_StartPos();
        } else {
            StartPos = this.Get_StartPos();
            EndPos = this.Get_EndPos(true);
        }
        this.Selection.StartManually = false;
        this.Selection.EndManually = false;
        this.Set_SelectionContentPos(StartPos, EndPos);
    },
    Select_Math: function (ParaMath) {
        for (var nPos = 0, nCount = this.Content.length; nPos < nCount; nPos++) {
            if (this.Content[nPos] === ParaMath) {
                this.Selection.Use = true;
                this.Selection.StartManually = false;
                this.Selection.EndManually = false;
                this.Selection.StartPos = nPos;
                this.Selection.EndPos = nPos;
                this.Selection.Flag = selectionflag_Common;
                this.Document_SetThisElementCurrent(false);
                return;
            }
        }
    },
    Get_SelectionBounds: function () {
        var X0 = this.X,
        X1 = this.XLimit,
        Y = this.Y,
        Page = this.Get_StartPage_Absolute();
        var BeginRect = null;
        var EndRect = null;
        var StartPage_abs = this.Get_StartPage_Absolute();
        var StartPage = 0,
        EndPage = 0;
        var _StartX = null,
        _StartY = null,
        _EndX = null,
        _EndY = null;
        if (true === this.Selection.Use) {
            var StartPos = this.Selection.StartPos;
            var EndPos = this.Selection.EndPos;
            if (StartPos > EndPos) {
                StartPos = this.Selection.EndPos;
                EndPos = this.Selection.StartPos;
            }
            var LinesCount = this.Lines.length;
            var StartLine = -1;
            var EndLine = -1;
            for (var CurLine = 0; CurLine < LinesCount; CurLine++) {
                if (-1 === StartLine && StartPos >= this.Lines[CurLine].Get_StartPos() && StartPos <= this.Lines[CurLine].Get_EndPos()) {
                    StartLine = CurLine;
                }
                if (EndPos >= this.Lines[CurLine].Get_StartPos() && EndPos <= this.Lines[CurLine].Get_EndPos()) {
                    EndLine = CurLine;
                }
            }
            StartLine = Math.min(Math.max(0, StartLine), LinesCount - 1);
            EndLine = Math.min(Math.max(0, EndLine), LinesCount - 1);
            StartPage = this.private_GetPageByLine(StartLine);
            EndPage = this.private_GetPageByLine(EndLine);
            var PagesCount = this.Pages.length;
            var DrawSelection = new CParagraphDrawSelectionRange();
            DrawSelection.Draw = false;
            for (var CurLine = StartLine; CurLine <= EndLine; CurLine++) {
                var Line = this.Lines[CurLine];
                var RangesCount = Line.Ranges.length;
                var CurPage = this.private_GetPageByLine(CurLine);
                DrawSelection.StartY = this.Pages[CurPage].Y + this.Lines[CurLine].Top;
                DrawSelection.H = this.Lines[CurLine].Bottom - this.Lines[CurLine].Top;
                var Result = null;
                for (var CurRange = 0; CurRange < RangesCount; CurRange++) {
                    var Range = Line.Ranges[CurRange];
                    var RStartPos = Range.StartPos;
                    var REndPos = Range.EndPos;
                    if (StartPos > REndPos || EndPos < RStartPos) {
                        continue;
                    }
                    DrawSelection.StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                    DrawSelection.W = 0;
                    DrawSelection.FindStart = true;
                    if (CurLine === this.Numbering.Line && CurRange === this.Numbering.Range) {
                        DrawSelection.StartX += this.Numbering.WidthVisible;
                    }
                    for (var CurPos = RStartPos; CurPos <= REndPos; CurPos++) {
                        var Item = this.Content[CurPos];
                        Item.Selection_DrawRange(CurLine, CurRange, DrawSelection);
                    }
                    var StartX = DrawSelection.StartX;
                    var W = DrawSelection.W;
                    var StartY = DrawSelection.StartY;
                    var H = DrawSelection.H;
                    if (W > 0.001) {
                        X0 = StartX;
                        X1 = StartX + W;
                        Y = StartY;
                        Page = CurPage + StartPage_abs;
                        if (null === BeginRect) {
                            BeginRect = {
                                X: StartX,
                                Y: StartY,
                                W: W,
                                H: H,
                                Page: Page
                            };
                        }
                        EndRect = {
                            X: StartX,
                            Y: StartY,
                            W: W,
                            H: H,
                            Page: Page
                        };
                    }
                    if (null === _StartX) {
                        _StartX = StartX;
                        _StartY = StartY;
                    }
                    _EndX = StartX;
                    _EndY = StartY;
                }
            }
        }
        if (null === BeginRect) {
            BeginRect = {
                X: _StartX === null ? this.Pages[StartPage].X : _StartX,
                Y: _StartY === null ? this.Pages[StartPage].Y : _StartY,
                W: 0,
                H: 0,
                Page: StartPage_abs + StartPage
            };
        }
        if (null === EndRect) {
            EndRect = {
                X: _EndX === null ? this.Pages[StartPage].X : _EndX,
                Y: _EndY === null ? this.Pages[StartPage].Y : _EndY,
                W: 0,
                H: 0,
                Page: StartPage_abs + EndPage
            };
        }
        return {
            Start: BeginRect,
            End: EndRect,
            Direction: this.Get_SelectionDirection()
        };
    },
    Get_SelectionDirection: function () {
        if (true !== this.Selection.Use) {
            return 0;
        }
        if (this.Selection.StartPos < this.Selection.EndPos) {
            return 1;
        } else {
            if (this.Selection.StartPos > this.Selection.EndPos) {
                return -1;
            }
        }
        return this.Content[this.Selection.StartPos].Get_SelectionDirection();
    },
    Get_SelectionAnchorPos: function () {
        var X0 = this.X,
        X1 = this.XLimit,
        Y = this.Y,
        Page = this.Get_StartPage_Absolute();
        if (true === this.ApplyToAll) {} else {
            if (true === this.Selection.Use) {
                var StartPos = this.Selection.StartPos;
                var EndPos = this.Selection.EndPos;
                if (StartPos > EndPos) {
                    StartPos = this.Selection.EndPos;
                    EndPos = this.Selection.StartPos;
                }
                var LinesCount = this.Lines.length;
                var StartLine = -1;
                var EndLine = -1;
                for (var CurLine = 0; CurLine < LinesCount; CurLine++) {
                    if (-1 === StartLine && StartPos >= this.Lines[CurLine].Get_StartPos() && StartPos <= this.Lines[CurLine].Get_EndPos()) {
                        StartLine = CurLine;
                    }
                    if (EndPos >= this.Lines[CurLine].Get_StartPos() && EndPos <= this.Lines[CurLine].Get_EndPos()) {
                        EndLine = CurLine;
                    }
                }
                StartLine = Math.min(Math.max(0, StartLine), LinesCount - 1);
                EndLine = Math.min(Math.max(0, EndLine), LinesCount - 1);
                var PagesCount = this.Pages.length;
                var DrawSelection = new CParagraphDrawSelectionRange();
                DrawSelection.Draw = false;
                for (var CurLine = StartLine; CurLine <= EndLine; CurLine++) {
                    var Line = this.Lines[CurLine];
                    var RangesCount = Line.Ranges.length;
                    var CurPage = 0;
                    for (; CurPage < PagesCount; CurPage++) {
                        if (CurLine >= this.Pages[CurPage].StartLine && CurLine <= this.Pages[CurPage].EndLine) {
                            break;
                        }
                    }
                    CurPage = Math.min(PagesCount - 1, CurPage);
                    DrawSelection.StartY = this.Pages[CurPage].Y + this.Lines[CurLine].Top;
                    DrawSelection.H = this.Lines[CurLine].Bottom - this.Lines[CurLine].Top;
                    var Result = null;
                    for (var CurRange = 0; CurRange < RangesCount; CurRange++) {
                        var Range = Line.Ranges[CurRange];
                        var RStartPos = Range.StartPos;
                        var REndPos = Range.EndPos;
                        if (StartPos > REndPos || EndPos < RStartPos) {
                            continue;
                        }
                        DrawSelection.StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                        DrawSelection.W = 0;
                        DrawSelection.FindStart = true;
                        if (CurLine === this.Numbering.Line && CurRange === this.Numbering.Range) {
                            DrawSelection.StartX += this.Numbering.WidthVisible;
                        }
                        for (var CurPos = RStartPos; CurPos <= REndPos; CurPos++) {
                            var Item = this.Content[CurPos];
                            Item.Selection_DrawRange(CurLine, CurRange, DrawSelection);
                        }
                        var StartX = DrawSelection.StartX;
                        var W = DrawSelection.W;
                        var StartY = DrawSelection.StartY;
                        var H = DrawSelection.H;
                        var StartX = DrawSelection.StartX;
                        var W = DrawSelection.W;
                        var StartY = DrawSelection.StartY;
                        var H = DrawSelection.H;
                        if (W > 0.001) {
                            X0 = StartX;
                            X1 = StartX + W;
                            Y = StartY;
                            Page = CurPage + this.Get_StartPage_Absolute();
                            if (null === Result) {
                                Result = {
                                    X0: X0,
                                    X1: X1,
                                    Y: Y,
                                    Page: Page
                                };
                            } else {
                                Result.X0 = Math.min(Result.X0, X0);
                                Result.X1 = Math.max(Result.X1, X1);
                            }
                        }
                    }
                    if (null !== Result) {
                        return Result;
                    }
                }
            } else {
                X0 = this.CurPos.X;
                X1 = this.CurPos.X;
                Y = this.CurPos.Y;
                Page = this.Get_StartPage_Absolute() + this.CurPos.PagesPos;
            }
        }
        return {
            X0: X0,
            X1: X1,
            Y: Y,
            Page: this.Get_StartPage_Absolute()
        };
    },
    Get_SelectedText: function (bClearText) {
        var Str = "";
        var Count = this.Content.length;
        for (var Pos = 0; Pos < Count; Pos++) {
            var _Str = this.Content[Pos].Get_SelectedText(true === this.ApplyToAll, bClearText);
            if (null === _Str) {
                return null;
            }
            Str += _Str;
        }
        return Str;
    },
    Get_SelectedElementsInfo: function (Info) {
        Info.Set_Paragraph(this);
        if (true === this.Selection.Use && this.Selection.StartPos === this.Selection.EndPos && this.Content[this.Selection.EndPos].Get_SelectedElementsInfo) {
            this.Content[this.Selection.EndPos].Get_SelectedElementsInfo(Info);
        } else {
            if (false === this.Selection.Use && this.Content[this.CurPos.ContentPos].Get_SelectedElementsInfo) {
                this.Content[this.CurPos.ContentPos].Get_SelectedElementsInfo(Info);
            }
        }
    },
    Get_SelectedContent: function (DocContent) {
        if (true !== this.Selection.Use) {
            return;
        }
        var StartPos = this.Selection.StartPos;
        var EndPos = this.Selection.EndPos;
        if (StartPos > EndPos) {
            StartPos = this.Selection.EndPos;
            EndPos = this.Selection.StartPos;
        }
        var Para = null;
        if (true === this.Selection_IsFromStart() && true === this.Selection_CheckParaEnd()) {
            Para = this.Copy(this.Parent);
            DocContent.Add(new CSelectedElement(Para, true));
        } else {
            Para = new Paragraph(this.DrawingDocument, this.Parent, 0, 0, 0, 0, 0, !this.bFromDocument);
            Para.Set_Pr(this.Pr.Copy());
            Para.TextPr.Set_Value(this.TextPr.Value.Copy());
            for (var Pos = StartPos; Pos <= EndPos; Pos++) {
                var Item = this.Content[Pos];
                if (StartPos === Pos || EndPos === Pos) {
                    Para.Internal_Content_Add(Pos - StartPos, Item.Copy(true), false);
                } else {
                    Para.Internal_Content_Add(Pos - StartPos, Item.Copy(false), false);
                }
            }
            if (undefined !== this.SectPr) {
                var SectPr = new CSectionPr(this.SectPr.LogicDocument);
                SectPr.Copy(this.SectPr);
                Para.Set_SectionPr(SectPr);
            }
            DocContent.Add(new CSelectedElement(Para, false));
        }
    },
    Get_Paragraph_TextPr: function () {
        var TextPr;
        if (true === this.ApplyToAll) {
            this.Select_All(1);
            var StartPos = 0;
            var Count = this.Content.length;
            while (true !== this.Content[StartPos].Is_CursorPlaceable() && StartPos < Count - 1) {
                StartPos++;
            }
            TextPr = this.Content[StartPos].Get_CompiledTextPr(true);
            var Count = this.Content.length;
            for (var CurPos = StartPos + 1; CurPos < Count; CurPos++) {
                var TempTextPr = this.Content[CurPos].Get_CompiledTextPr(false);
                if (null !== TempTextPr && undefined !== TempTextPr && true !== this.Content[CurPos].Selection_IsEmpty()) {
                    TextPr = TextPr.Compare(TempTextPr);
                }
            }
            this.Selection_Remove();
        } else {
            if (true === this.Selection.Use) {
                var StartPos = this.Selection.StartPos;
                var EndPos = this.Selection.EndPos;
                if (StartPos > EndPos) {
                    StartPos = this.Selection.EndPos;
                    EndPos = this.Selection.StartPos;
                }
                if (StartPos === EndPos && this.Content.length - 1 === EndPos) {
                    TextPr = this.Get_CompiledPr2(false).TextPr.Copy();
                    TextPr.Merge(this.TextPr.Value);
                } else {
                    var bCheckParaEnd = false;
                    if (this.Content.length - 1 === EndPos && true !== this.Content[EndPos].Selection_IsEmpty(true)) {
                        EndPos--;
                        bCheckParaEnd = true;
                    }
                    var OldStartPos = StartPos;
                    while (true === this.Content[StartPos].Selection_IsEmpty() && StartPos < EndPos) {
                        StartPos++;
                    }
                    while (true !== this.Content[StartPos].Is_CursorPlaceable() && StartPos > OldStartPos) {
                        StartPos--;
                    }
                    TextPr = this.Content[StartPos].Get_CompiledTextPr(true);
                    if (null === TextPr) {
                        TextPr = this.Get_CompiledPr2(false).TextPr.Copy();
                        TextPr.Merge(this.TextPr.Value);
                    }
                    for (var CurPos = StartPos + 1; CurPos <= EndPos; CurPos++) {
                        var TempTextPr = this.Content[CurPos].Get_CompiledTextPr(false);
                        if (null === TextPr || undefined === TextPr) {
                            TextPr = TempTextPr;
                        } else {
                            if (null !== TempTextPr && undefined !== TempTextPr && true !== this.Content[CurPos].Selection_IsEmpty()) {
                                TextPr = TextPr.Compare(TempTextPr);
                            }
                        }
                    }
                    if (true === bCheckParaEnd) {
                        var EndTextPr = this.Get_CompiledPr2(false).TextPr.Copy();
                        EndTextPr.Merge(this.TextPr.Value);
                        TextPr = TextPr.Compare(EndTextPr);
                    }
                }
            } else {
                TextPr = this.Content[this.CurPos.ContentPos].Get_CompiledTextPr(true);
            }
        }
        if (null === TextPr || undefined === TextPr) {
            TextPr = this.TextPr.Value.Copy();
        }
        if (undefined !== TextPr.RFonts && null !== TextPr.RFonts) {
            TextPr.FontFamily = TextPr.RFonts.Ascii;
        }
        return TextPr;
    },
    IsEmpty: function (Props) {
        var Pr = {
            SkipEnd: true
        };
        if (undefined !== Props) {
            if (undefined !== Props.SkipNewLine) {
                Pr.SkipNewLine = true;
            }
        }
        var ContentLen = this.Content.length;
        for (var CurPos = 0; CurPos < ContentLen; CurPos++) {
            if (false === this.Content[CurPos].Is_Empty(Pr)) {
                return false;
            }
        }
        return true;
    },
    Is_Empty: function () {
        return this.IsEmpty();
    },
    Is_InText: function (X, Y, PageNum_Abs) {
        var PageNum = PageNum_Abs - this.Get_StartPage_Absolute();
        if (PageNum < 0 || PageNum >= this.Pages.length) {
            return null;
        }
        var SearchPosXY = this.Get_ParaContentPosByXY(X, Y, PageNum, false, false);
        if (true === SearchPosXY.InText) {
            return this;
        }
        return null;
    },
    Is_UseInDocument: function () {
        if (null != this.Parent) {
            return this.Parent.Is_UseInDocument(this.Get_Id());
        }
        return false;
    },
    Selection_IsEmpty: function (bCheckHidden) {
        if (undefined === bCheckHidden) {
            bCheckHidden = true;
        }
        if (true === this.Selection.Use) {
            var StartPos = this.Selection.StartPos;
            var EndPos = this.Selection.EndPos;
            if (StartPos > EndPos) {
                EndPos = this.Selection.StartPos;
                StartPos = this.Selection.EndPos;
            }
            for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
                if (true !== this.Content[CurPos].Selection_IsEmpty(bCheckHidden)) {
                    return false;
                }
            }
        }
        return true;
    },
    Get_StartTabsCount: function (TabsCounter) {
        var ContentLen = this.Content.length;
        for (var Pos = 0; Pos < ContentLen; Pos++) {
            var Element = this.Content[Pos];
            if (false === Element.Get_StartTabsCount(TabsCounter)) {
                return false;
            }
        }
        return true;
    },
    Remove_StartTabs: function (TabsCounter) {
        var ContentLen = this.Content.length;
        for (var Pos = 0; Pos < ContentLen; Pos++) {
            var Element = this.Content[Pos];
            if (false === Element.Remove_StartTabs(TabsCounter)) {
                return false;
            }
        }
        return true;
    },
    Numbering_Add: function (NumId, Lvl) {
        var ParaPr = this.Get_CompiledPr2(false).ParaPr;
        var NumPr_old = this.Numbering_Get();
        var SelectionUse = this.Is_SelectionUse();
        var SelectedOneElement = (this.Parent.Selection_Is_OneElement() === 0 ? true : false);
        if (true === SelectionUse && true !== SelectedOneElement && true === this.Is_Empty()) {
            return;
        }
        this.Numbering_Remove();
        var TabsCounter = new CParagraphTabsCounter();
        this.Get_StartTabsCount(TabsCounter);
        var TabsCount = TabsCounter.Count;
        var TabsPos = TabsCounter.Pos;
        var X = ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
        var LeftX = X;
        if (TabsCount > 0 && ParaPr.Ind.FirstLine < 0) {
            X = ParaPr.Ind.Left;
            LeftX = X;
            TabsCount--;
        }
        var ParaTabsCount = ParaPr.Tabs.Get_Count();
        while (TabsCount) {
            var TabFound = false;
            for (var TabIndex = 0; TabIndex < ParaTabsCount; TabIndex++) {
                var Tab = ParaPr.Tabs.Get(TabIndex);
                if (Tab.Pos > X) {
                    X = Tab.Pos;
                    TabFound = true;
                    break;
                }
            }
            if (false === TabFound) {
                var NewX = 0;
                while (X >= NewX) {
                    NewX += Default_Tab_Stop;
                }
                X = NewX;
            }
            TabsCount--;
        }
        var Numbering = this.Parent.Get_Numbering();
        var AbstractNum = Numbering.Get_AbstractNum(NumId);
        if (undefined === NumPr_old) {
            if (true === SelectedOneElement || false === SelectionUse) {
                var Prev = this.Get_DocumentPrev();
                var PrevNumbering = (null != Prev ? (type_Paragraph === Prev.GetType() ? Prev.Numbering_Get() : undefined) : undefined);
                if (undefined != PrevNumbering && NumId === PrevNumbering.NumId && Lvl === PrevNumbering.Lvl) {
                    var NewFirstLine = Prev.Pr.Ind.FirstLine;
                    var NewLeft = Prev.Pr.Ind.Left;
                    History.Add(this, {
                        Type: historyitem_Paragraph_Ind_First,
                        Old: (undefined != this.Pr.Ind.FirstLine ? this.Pr.Ind.FirstLine : undefined),
                        New: NewFirstLine
                    });
                    History.Add(this, {
                        Type: historyitem_Paragraph_Ind_Left,
                        Old: (undefined != this.Pr.Ind.Left ? this.Pr.Ind.Left : undefined),
                        New: NewLeft
                    });
                    this.Pr.Ind.FirstLine = NewFirstLine;
                    this.Pr.Ind.Left = NewLeft;
                } else {
                    var NumLvl = AbstractNum.Lvl[Lvl];
                    var NumParaPr = NumLvl.ParaPr;
                    if (undefined != NumParaPr.Ind && undefined != NumParaPr.Ind.Left) {
                        AbstractNum.Change_LeftInd(X + NumParaPr.Ind.Left);
                        History.Add(this, {
                            Type: historyitem_Paragraph_Ind_First,
                            Old: (undefined != this.Pr.Ind.FirstLine ? this.Pr.Ind.FirstLine : undefined),
                            New: undefined
                        });
                        History.Add(this, {
                            Type: historyitem_Paragraph_Ind_Left,
                            Old: (undefined != this.Pr.Ind.Left ? this.Pr.Ind.Left : undefined),
                            New: undefined
                        });
                        this.Pr.Ind.FirstLine = undefined;
                        this.Pr.Ind.Left = undefined;
                    }
                }
                this.Pr.NumPr = new CNumPr();
                this.Pr.NumPr.Set(NumId, Lvl);
                History.Add(this, {
                    Type: historyitem_Paragraph_Numbering,
                    Old: NumPr_old,
                    New: this.Pr.NumPr
                });
            } else {
                var LvlFound = -1;
                var LvlsCount = AbstractNum.Lvl.length;
                for (var LvlIndex = 0; LvlIndex < LvlsCount; LvlIndex++) {
                    var NumLvl = AbstractNum.Lvl[LvlIndex];
                    var NumParaPr = NumLvl.ParaPr;
                    if (undefined != NumParaPr.Ind && undefined != NumParaPr.Ind.Left && X <= NumParaPr.Ind.Left) {
                        LvlFound = LvlIndex;
                        break;
                    }
                }
                if (-1 === LvlFound) {
                    LvlFound = LvlsCount - 1;
                }
                if (undefined != this.Pr.Ind && undefined != NumParaPr.Ind && undefined != NumParaPr.Ind.Left) {
                    History.Add(this, {
                        Type: historyitem_Paragraph_Ind_First,
                        Old: (undefined != this.Pr.Ind.FirstLine ? this.Pr.Ind.FirstLine : undefined),
                        New: undefined
                    });
                    History.Add(this, {
                        Type: historyitem_Paragraph_Ind_Left,
                        Old: (undefined != this.Pr.Ind.Left ? this.Pr.Ind.Left : undefined),
                        New: undefined
                    });
                    this.Pr.Ind.FirstLine = undefined;
                    this.Pr.Ind.Left = undefined;
                }
                this.Pr.NumPr = new CNumPr();
                this.Pr.NumPr.Set(NumId, LvlFound);
                History.Add(this, {
                    Type: historyitem_Paragraph_Numbering,
                    Old: NumPr_old,
                    New: this.Pr.NumPr
                });
            }
            TabsCounter.Count = TabsCount;
            this.Remove_StartTabs(TabsCounter);
        } else {
            this.Pr.NumPr = new CNumPr();
            this.Pr.NumPr.Set(NumId, Lvl);
            History.Add(this, {
                Type: historyitem_Paragraph_Numbering,
                Old: NumPr_old,
                New: this.Pr.NumPr
            });
            var Left = (NumPr_old.Lvl === Lvl ? undefined : ParaPr.Ind.Left);
            var FirstLine = (NumPr_old.Lvl === Lvl ? undefined : ParaPr.Ind.FirstLine);
            History.Add(this, {
                Type: historyitem_Paragraph_Ind_First,
                Old: (undefined != this.Pr.Ind.FirstLine ? this.Pr.Ind.FirstLine : undefined),
                New: Left
            });
            History.Add(this, {
                Type: historyitem_Paragraph_Ind_Left,
                Old: (undefined != this.Pr.Ind.Left ? this.Pr.Ind.Left : undefined),
                New: FirstLine
            });
            this.Pr.Ind.FirstLine = FirstLine;
            this.Pr.Ind.Left = Left;
        }
        if (undefined === this.Style_Get()) {
            if (this.bFromDocument) {
                this.Style_Add(this.Parent.Get_Styles().Get_Default_ParaList());
            }
        }
        this.CompiledPr.NeedRecalc = true;
    },
    Numbering_Set: function (NumId, Lvl) {
        var NumPr_old = this.Pr.NumPr;
        this.Pr.NumPr = new CNumPr();
        this.Pr.NumPr.Set(NumId, Lvl);
        History.Add(this, {
            Type: historyitem_Paragraph_Numbering,
            Old: NumPr_old,
            New: this.Pr.NumPr
        });
        this.CompiledPr.NeedRecalc = true;
    },
    Numbering_IndDec_Level: function (bIncrease) {
        var NumPr = this.Numbering_Get();
        if (undefined != NumPr) {
            var NewLvl;
            if (true === bIncrease) {
                NewLvl = Math.min(8, NumPr.Lvl + 1);
            } else {
                NewLvl = Math.max(0, NumPr.Lvl - 1);
            }
            this.Pr.NumPr = new CNumPr();
            this.Pr.NumPr.Set(NumPr.NumId, NewLvl);
            History.Add(this, {
                Type: historyitem_Paragraph_Numbering,
                Old: NumPr,
                New: this.Pr.NumPr
            });
            this.CompiledPr.NeedRecalc = true;
        }
    },
    Numbering_Add_Open: function (NumId, Lvl) {
        this.Pr.NumPr = new CNumPr();
        this.Pr.NumPr.Set(NumId, Lvl);
        this.CompiledPr.NeedRecalc = true;
    },
    Numbering_Get: function () {
        var NumPr = this.Get_CompiledPr2(false).ParaPr.NumPr;
        if (undefined != NumPr && 0 != NumPr.NumId) {
            return NumPr.Copy();
        }
        return undefined;
    },
    Numbering_Remove: function () {
        var OldNumPr = this.Numbering_Get();
        var NewNumPr = undefined;
        if (undefined != this.CompiledPr.Pr.ParaPr.StyleNumPr) {
            NewNumPr = new CNumPr();
            NewNumPr.Set(0, 0);
        }
        History.Add(this, {
            Type: historyitem_Paragraph_Numbering,
            Old: undefined != this.Pr.NumPr ? this.Pr.NumPr : undefined,
            New: NewNumPr
        });
        this.Pr.NumPr = NewNumPr;
        if (undefined != this.Pr.Ind && undefined != OldNumPr) {
            if (undefined === this.Pr.Ind.FirstLine || Math.abs(this.Pr.Ind.FirstLine) < 0.001) {
                if (undefined != OldNumPr && undefined != OldNumPr.NumId) {
                    var Lvl = this.Parent.Get_Numbering().Get_AbstractNum(OldNumPr.NumId).Lvl[OldNumPr.Lvl];
                    if (undefined != Lvl && undefined != Lvl.ParaPr.Ind && undefined != Lvl.ParaPr.Ind.Left) {
                        var CurParaPr = this.Get_CompiledPr2(false).ParaPr;
                        var Left = CurParaPr.Ind.Left + CurParaPr.Ind.FirstLine;
                        var NumLeftCorrection = (undefined != Lvl.ParaPr.Ind.FirstLine ? Math.abs(Lvl.ParaPr.Ind.FirstLine) : 0);
                        var NewFirstLine = 0;
                        var NewLeft = Left < 0 ? Left : Math.max(0, Left - NumLeftCorrection);
                        History.Add(this, {
                            Type: historyitem_Paragraph_Ind_Left,
                            New: NewLeft,
                            Old: this.Pr.Ind.Left
                        });
                        History.Add(this, {
                            Type: historyitem_Paragraph_Ind_First,
                            New: NewFirstLine,
                            Old: this.Pr.Ind.FirstLine
                        });
                        this.Pr.Ind.Left = NewLeft;
                        this.Pr.Ind.FirstLine = NewFirstLine;
                    }
                }
            } else {
                if (this.Pr.Ind.FirstLine < 0) {
                    History.Add(this, {
                        Type: historyitem_Paragraph_Ind_First,
                        New: 0,
                        Old: this.Pr.Ind.FirstLine
                    });
                    this.Pr.Ind.FirstLine = 0;
                } else {
                    if (undefined != this.Pr.Ind.Left && this.Pr.Ind.FirstLine > 0) {
                        History.Add(this, {
                            Type: historyitem_Paragraph_Ind_Left,
                            New: this.Pr.Ind.Left + this.Pr.Ind.FirstLine,
                            Old: this.Pr.Ind.Left
                        });
                        History.Add(this, {
                            Type: historyitem_Paragraph_Ind_First,
                            New: 0,
                            Old: this.Pr.Ind.FirstLine
                        });
                        this.Pr.Ind.Left += this.Pr.Ind.FirstLine;
                        this.Pr.Ind.FirstLine = 0;
                    }
                }
            }
        }
        var StyleId = this.Style_Get();
        var NumStyleId = this.Parent.Get_Styles().Get_Default_ParaList();
        if (StyleId === NumStyleId) {
            this.Style_Remove();
        }
        this.CompiledPr.NeedRecalc = true;
    },
    Numbering_IsUse: function (NumId, Lvl) {
        var bLvl = (undefined === Lvl ? false : true);
        var NumPr = this.Numbering_Get();
        if (undefined != NumPr && NumId === NumPr.NumId && (false === bLvl || Lvl === NumPr.Lvl)) {
            return true;
        }
        return false;
    },
    Add_PresentationNumbering: function (_Bullet) {
        var ParaPr = this.Get_CompiledPr2(false).ParaPr;
        var OldType = ParaPr.Bullet ? ParaPr.Bullet.getBulletType() : numbering_presentationnumfrmt_None;
        var NewType = _Bullet ? _Bullet.getBulletType() : numbering_presentationnumfrmt_None;
        var Bullet = _Bullet ? _Bullet.createDuplicate() : undefined;
        History.Add(this, {
            Type: historyitem_Paragraph_PresentationPr_Bullet,
            New: Bullet,
            Old: this.Pr.Bullet
        });
        this.Pr.Bullet = Bullet;
        this.CompiledPr.NeedRecalc = true;
        if (OldType != NewType) {
            var ParaPr = this.Get_CompiledPr2(false).ParaPr;
            var LeftInd = Math.min(ParaPr.Ind.Left, ParaPr.Ind.Left + ParaPr.Ind.FirstLine);
            if (numbering_presentationnumfrmt_None === NewType) {
                this.Set_Ind({
                    FirstLine: 0,
                    Left: LeftInd
                });
            } else {
                if (numbering_presentationnumfrmt_RomanLcPeriod === NewType || numbering_presentationnumfrmt_RomanUcPeriod === NewType) {
                    this.Set_Ind({
                        Left: LeftInd + 15.9,
                        FirstLine: -15.9
                    });
                } else {
                    this.Set_Ind({
                        Left: LeftInd + 14.3,
                        FirstLine: -14.3
                    });
                }
            }
        }
    },
    Get_PresentationNumbering: function () {
        this.Get_CompiledPr2(false);
        return this.PresentationPr.Bullet;
    },
    Remove_PresentationNumbering: function () {
        var Bullet = new CBullet();
        Bullet.bulletType = new CBulletType();
        Bullet.bulletType.type = BULLET_TYPE_BULLET_NONE;
        this.Add_PresentationNumbering(Bullet);
    },
    Set_PresentationLevel: function (Level) {
        if (this.Pr.Lvl != Level) {
            History.Add(this, {
                Type: historyitem_Paragraph_PresentationPr_Level,
                Old: this.Pr.Lvl,
                New: Level
            });
            this.Pr.Lvl = Level;
            this.CompiledPr.NeedRecalc = true;
            this.Recalc_RunsCompiledPr();
        }
    },
    Get_CompiledPr: function () {
        var Pr = this.Get_CompiledPr2();
        var StyleId = this.Style_Get();
        var NumPr = this.Numbering_Get();
        var FramePr = this.Get_FramePr();
        var PrevEl = this.Get_DocumentPrev();
        var NextEl = this.Get_DocumentNext();
        if (undefined !== FramePr) {
            if (null === PrevEl || type_Paragraph !== PrevEl.GetType()) {
                PrevEl = null;
            } else {
                var PrevFramePr = PrevEl.Get_FramePr();
                if (undefined === PrevFramePr || true !== FramePr.Compare(PrevFramePr)) {
                    PrevEl = null;
                }
            }
            if (null === NextEl || type_Paragraph !== NextEl.GetType()) {
                NextEl = null;
            } else {
                var NextFramePr = NextEl.Get_FramePr();
                if (undefined === NextFramePr || true !== FramePr.Compare(NextFramePr)) {
                    NextEl = null;
                }
            }
        } else {
            while (null !== PrevEl && type_Paragraph === PrevEl.GetType() && undefined !== PrevEl.Get_FramePr()) {
                PrevEl = PrevEl.Get_DocumentPrev();
            }
            while (null !== NextEl && type_Paragraph === NextEl.GetType() && undefined !== NextEl.Get_FramePr()) {
                NextEl = NextEl.Get_DocumentNext();
            }
        }
        if (null != PrevEl && type_Paragraph === PrevEl.GetType()) {
            var PrevStyle = PrevEl.Style_Get();
            var Prev_Pr = PrevEl.Get_CompiledPr2(false).ParaPr;
            var Prev_After = Prev_Pr.Spacing.After;
            var Prev_AfterAuto = Prev_Pr.Spacing.AfterAutoSpacing;
            var Cur_Before = Pr.ParaPr.Spacing.Before;
            var Cur_BeforeAuto = Pr.ParaPr.Spacing.BeforeAutoSpacing;
            var Prev_NumPr = PrevEl.Numbering_Get();
            if (PrevStyle === StyleId && true === Pr.ParaPr.ContextualSpacing) {
                Pr.ParaPr.Spacing.Before = 0;
            } else {
                if (true === Cur_BeforeAuto && PrevStyle === StyleId && undefined != Prev_NumPr && undefined != NumPr && Prev_NumPr.NumId === NumPr.NumId) {
                    Pr.ParaPr.Spacing.Before = 0;
                } else {
                    Cur_Before = this.Internal_CalculateAutoSpacing(Cur_Before, Cur_BeforeAuto, this);
                    Prev_After = this.Internal_CalculateAutoSpacing(Prev_After, Prev_AfterAuto, this);
                    if (true === Prev_Pr.ContextualSpacing && PrevStyle === StyleId) {
                        Prev_After = 0;
                    }
                    Pr.ParaPr.Spacing.Before = Math.max(Prev_After, Cur_Before) - Prev_After;
                }
            }
            if (false === this.Internal_Is_NullBorders(Pr.ParaPr.Brd) && true === this.Internal_CompareBrd(Prev_Pr, Pr.ParaPr) && undefined === PrevEl.Get_SectionPr()) {
                Pr.ParaPr.Brd.First = false;
            } else {
                Pr.ParaPr.Brd.First = true;
            }
        } else {
            if (null === PrevEl) {
                if (true === this.Parent.Is_TableCellContent() && true === Pr.ParaPr.ContextualSpacing) {
                    var Cell = this.Parent.Parent;
                    var PrevEl = Cell.Get_LastParagraphPrevCell();
                    if ((null !== PrevEl && type_Paragraph === PrevEl.GetType() && PrevEl.Style_Get() === StyleId) || (null === PrevEl && undefined === StyleId)) {
                        Pr.ParaPr.Spacing.Before = 0;
                    }
                } else {
                    if (true === Pr.ParaPr.Spacing.BeforeAutoSpacing || !(this.bFromDocument === true)) {
                        Pr.ParaPr.Spacing.Before = 0;
                    }
                }
            } else {
                if (type_Table === PrevEl.GetType()) {
                    if (true === Pr.ParaPr.Spacing.BeforeAutoSpacing) {
                        Pr.ParaPr.Spacing.Before = 14 * g_dKoef_pt_to_mm;
                    }
                }
            }
        }
        if (null != NextEl) {
            if (type_Paragraph === NextEl.GetType()) {
                var NextStyle = NextEl.Style_Get();
                var Next_Pr = NextEl.Get_CompiledPr2(false).ParaPr;
                var Next_Before = Next_Pr.Spacing.Before;
                var Next_BeforeAuto = Next_Pr.Spacing.BeforeAutoSpacing;
                var Cur_After = Pr.ParaPr.Spacing.After;
                var Cur_AfterAuto = Pr.ParaPr.Spacing.AfterAutoSpacing;
                var Next_NumPr = NextEl.Numbering_Get();
                if (NextStyle === StyleId && true === Pr.ParaPr.ContextualSpacing) {
                    Pr.ParaPr.Spacing.After = 0;
                } else {
                    if (true === Cur_AfterAuto && NextStyle === StyleId && undefined != Next_NumPr && undefined != NumPr && Next_NumPr.NumId === NumPr.NumId) {
                        Pr.ParaPr.Spacing.After = 0;
                    } else {
                        Pr.ParaPr.Spacing.After = this.Internal_CalculateAutoSpacing(Cur_After, Cur_AfterAuto, this);
                    }
                }
                if (false === this.Internal_Is_NullBorders(Pr.ParaPr.Brd) && true === this.Internal_CompareBrd(Next_Pr, Pr.ParaPr) && undefined === this.Get_SectionPr() && (undefined === NextEl.Get_SectionPr() || true !== NextEl.IsEmpty())) {
                    Pr.ParaPr.Brd.Last = false;
                } else {
                    Pr.ParaPr.Brd.Last = true;
                }
            } else {
                if (type_Table === NextEl.GetType()) {
                    var TableFirstParagraph = NextEl.Get_FirstParagraph();
                    if (null != TableFirstParagraph && undefined != TableFirstParagraph) {
                        var NextStyle = TableFirstParagraph.Style_Get();
                        var Next_Before = TableFirstParagraph.Get_CompiledPr2(false).ParaPr.Spacing.Before;
                        var Next_BeforeAuto = TableFirstParagraph.Get_CompiledPr2(false).ParaPr.Spacing.BeforeAutoSpacing;
                        var Cur_After = Pr.ParaPr.Spacing.After;
                        var Cur_AfterAuto = Pr.ParaPr.Spacing.AfterAutoSpacing;
                        if (NextStyle === StyleId && true === Pr.ParaPr.ContextualSpacing) {
                            Cur_After = this.Internal_CalculateAutoSpacing(Cur_After, Cur_AfterAuto, this);
                            Next_Before = this.Internal_CalculateAutoSpacing(Next_Before, Next_BeforeAuto, this);
                            Pr.ParaPr.Spacing.After = Math.max(Next_Before, Cur_After) - Cur_After;
                        } else {
                            Pr.ParaPr.Spacing.After = this.Internal_CalculateAutoSpacing(Pr.ParaPr.Spacing.After, Cur_AfterAuto, this);
                        }
                    }
                }
            }
        } else {
            if (true === this.Parent.Is_TableCellContent() && true === Pr.ParaPr.ContextualSpacing) {
                var Cell = this.Parent.Parent;
                var NextEl = Cell.Get_FirstParagraphNextCell();
                if ((null !== NextEl && type_Paragraph === NextEl.GetType() && NextEl.Style_Get() === StyleId) || (null === NextEl && StyleId === undefined)) {
                    Pr.ParaPr.Spacing.After = 0;
                }
            } else {
                if (! (this.bFromDocument === true)) {
                    Pr.ParaPr.Spacing.After = 0;
                } else {
                    Pr.ParaPr.Spacing.After = this.Internal_CalculateAutoSpacing(Pr.ParaPr.Spacing.After, Pr.ParaPr.Spacing.AfterAutoSpacing, this);
                }
            }
        }
        return Pr;
    },
    Recalc_CompiledPr: function () {
        this.CompiledPr.NeedRecalc = true;
    },
    Recalc_RunsCompiledPr: function () {
        var Count = this.Content.length;
        for (var Pos = 0; Pos < Count; Pos++) {
            var Element = this.Content[Pos];
            if (Element.Recalc_RunsCompiledPr) {
                Element.Recalc_RunsCompiledPr();
            }
        }
    },
    Get_CompiledPr2: function (bCopy) {
        this.Internal_CompileParaPr();
        if (false === bCopy) {
            return this.CompiledPr.Pr;
        } else {
            var Pr = {};
            Pr.TextPr = this.CompiledPr.Pr.TextPr.Copy();
            Pr.ParaPr = this.CompiledPr.Pr.ParaPr.Copy();
            return Pr;
        }
    },
    Internal_CompileParaPr: function () {
        if (true === this.CompiledPr.NeedRecalc) {
            if (undefined !== this.Parent && null !== this.Parent) {
                this.CompiledPr.Pr = this.Internal_CompileParaPr2();
                if (!this.bFromDocument) {
                    this.PresentationPr.Level = isRealNumber(this.Pr.Lvl) ? this.Pr.Lvl : 0;
                    this.PresentationPr.Bullet = this.CompiledPr.Pr.ParaPr.Get_PresentationBullet();
                    this.Numbering.Bullet = this.PresentationPr.Bullet;
                }
                this.CompiledPr.NeedRecalc = false;
            } else {
                if (undefined === this.CompiledPr.Pr || null === this.CompiledPr.Pr) {
                    this.CompiledPr.Pr = {
                        ParaPr: new CParaPr(),
                        TextPr: new CTextPr()
                    };
                    this.CompiledPr.Pr.ParaPr.Init_Default();
                    this.CompiledPr.Pr.TextPr.Init_Default();
                }
                this.CompiledPr.NeedRecalc = true;
            }
        }
    },
    Internal_CompileParaPr2: function () {
        if (this.bFromDocument) {
            var Styles = this.Parent.Get_Styles();
            var Numbering = this.Parent.Get_Numbering();
            var TableStyle = this.Parent.Get_TableStyleForPara();
            var ShapeStyle = this.Parent.Get_ShapeStyleForPara();
            var StyleId = this.Style_Get();
            var Pr = Styles.Get_Pr(StyleId, styletype_Paragraph, TableStyle, ShapeStyle);
            if (undefined != Pr.ParaPr.NumPr) {
                Pr.ParaPr.StyleNumPr = Pr.ParaPr.NumPr.Copy();
            }
            var Lvl = -1;
            if (undefined != this.Pr.NumPr) {
                if (undefined != this.Pr.NumPr.NumId && 0 != this.Pr.NumPr.NumId) {
                    Lvl = this.Pr.NumPr.Lvl;
                    if (Lvl >= 0 && Lvl <= 8) {
                        Pr.ParaPr.Merge(Numbering.Get_ParaPr(this.Pr.NumPr.NumId, this.Pr.NumPr.Lvl));
                    } else {
                        Lvl = -1;
                        Pr.ParaPr.NumPr = undefined;
                    }
                } else {
                    if (0 === this.Pr.NumPr.NumId) {
                        Pr.ParaPr.Ind.Left = 0;
                        Pr.ParaPr.Ind.FirstLine = 0;
                    }
                }
            } else {
                if (undefined != Pr.ParaPr.NumPr) {
                    if (undefined != Pr.ParaPr.NumPr.NumId && 0 != Pr.ParaPr.NumPr.NumId) {
                        var AbstractNum = Numbering.Get_AbstractNum(Pr.ParaPr.NumPr.NumId);
                        Lvl = AbstractNum.Get_LvlByStyle(StyleId);
                        if (-1 != Lvl) {} else {
                            Pr.ParaPr.NumPr = undefined;
                        }
                    }
                }
            }
            Pr.ParaPr.StyleTabs = (undefined != Pr.ParaPr.Tabs ? Pr.ParaPr.Tabs.Copy() : new CParaTabs());
            Pr.ParaPr.Merge(this.Pr);
            if (-1 != Lvl && undefined != Pr.ParaPr.NumPr) {
                Pr.ParaPr.NumPr.Lvl = Lvl;
            }
            if (undefined === this.Pr.FramePr) {
                Pr.ParaPr.FramePr = undefined;
            } else {
                Pr.ParaPr.FramePr = this.Pr.FramePr.Copy();
            }
            return Pr;
        } else {
            return this.Internal_CompiledParaPrPresentation();
        }
    },
    Internal_CompiledParaPrPresentation: function (Lvl) {
        var _Lvl = isRealNumber(Lvl) ? Lvl : (isRealNumber(this.Pr.Lvl) ? this.Pr.Lvl : 0);
        var styleObject = this.Parent.Get_Styles(_Lvl);
        var Styles = styleObject.styles;
        var Pr = Styles.Get_Pr(styleObject.lastId, styletype_Paragraph, null);
        var TableStyle = this.Parent.Get_TableStyleForPara();
        if (TableStyle && TableStyle.TextPr) {
            Pr.TextPr.Merge(TableStyle.TextPr);
        }
        Pr.ParaPr.StyleTabs = (undefined != Pr.ParaPr.Tabs ? Pr.ParaPr.Tabs.Copy() : new CParaTabs());
        Pr.ParaPr.Merge(this.Pr);
        if (this.Pr.DefaultRunPr) {
            Pr.TextPr.Merge(this.Pr.DefaultRunPr);
        }
        Pr.TextPr.Color.Auto = false;
        return Pr;
    },
    Recalc_CompileParaPr: function () {
        this.CompiledPr.NeedRecalc = true;
    },
    Internal_CalculateAutoSpacing: function (Value, UseAuto, Para) {
        var Result = Value;
        if (true === UseAuto) {
            if (true === Para.Parent.Is_TableCellContent()) {
                Result = 0;
            } else {
                Result = 14 * g_dKoef_pt_to_mm;
            }
        }
        return Result;
    },
    Get_Paragraph_TextPr_Copy: function () {
        var TextPr;
        if (true === this.ApplyToAll) {
            this.Select_All(1);
            var Count = this.Content.length;
            var StartPos = 0;
            while (true === this.Content[StartPos].Selection_IsEmpty() && StartPos < Count) {
                StartPos++;
            }
            TextPr = this.Content[StartPos].Get_CompiledTextPr(true);
            this.Selection_Remove();
        } else {
            if (true === this.Selection.Use) {
                var StartPos = this.Selection.StartPos;
                var EndPos = this.Selection.EndPos;
                if (StartPos > EndPos) {
                    StartPos = this.Selection.EndPos;
                    EndPos = this.Selection.StartPos;
                }
                while (true === this.Content[StartPos].Selection_IsEmpty() && StartPos < EndPos) {
                    StartPos++;
                }
                TextPr = this.Content[StartPos].Get_CompiledTextPr(true);
            } else {
                TextPr = this.Content[this.CurPos.ContentPos].Get_CompiledTextPr(true);
            }
        }
        return TextPr;
    },
    Get_Paragraph_ParaPr_Copy: function () {
        var ParaPr = this.Pr.Copy();
        return ParaPr;
    },
    Paragraph_Format_Paste: function (TextPr, ParaPr, ApplyPara) {
        if (null != TextPr) {
            this.Add(new ParaTextPr(TextPr));
        }
        var _ApplyPara = ApplyPara;
        if (false === _ApplyPara) {
            if (true === this.Selection.Use) {
                _ApplyPara = true;
                var Start = this.Selection.StartPos;
                var End = this.Selection.EndPos;
                if (Start > End) {
                    Start = this.Selection.EndPos;
                    End = this.Selection.StartPos;
                }
                if (true === this.Internal_FindForward(End, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_End, para_Math]).Found) {
                    _ApplyPara = false;
                } else {
                    if (true === this.Internal_FindBackward(Start - 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_End, para_Math]).Found) {
                        _ApplyPara = false;
                    }
                }
            } else {
                _ApplyPara = true;
            }
        }
        if (true === _ApplyPara && null != ParaPr) {
            if (undefined != ParaPr.Ind) {
                this.Set_Ind(ParaPr.Ind, false);
            }
            if (undefined != ParaPr.Jc) {
                this.Set_Align(ParaPr.Jc);
            }
            if (undefined != ParaPr.Spacing) {
                this.Set_Spacing(ParaPr.Spacing, false);
            }
            if (undefined != ParaPr.PageBreakBefore) {
                this.Set_PageBreakBefore(ParaPr.PageBreakBefore);
            }
            if (undefined != ParaPr.KeepLines) {
                this.Set_KeepLines(ParaPr.KeepLines);
            }
            if (undefined != ParaPr.ContextualSpacing) {
                this.Set_ContextualSpacing(ParaPr.ContextualSpacing);
            }
            if (undefined != ParaPr.Shd) {
                this.Set_Shd(ParaPr.Shd, false);
            }
            if (this.bFromDocument) {
                if (undefined != ParaPr.NumPr) {
                    this.Numbering_Set(ParaPr.NumPr.NumId, ParaPr.NumPr.Lvl);
                } else {
                    this.Numbering_Remove();
                }
                if (undefined != ParaPr.PStyle) {
                    this.Style_Add(ParaPr.PStyle, true);
                } else {
                    this.Style_Remove();
                }
                if (undefined != ParaPr.Brd) {
                    this.Set_Borders(ParaPr.Brd);
                }
            } else {
                History.Add(this, {
                    Type: historyitem_Paragraph_PresentationPr_Bullet,
                    New: ParaPr.Bullet,
                    Old: this.Pr.Bullet
                });
                this.Pr.Bullet = ParaPr.Bullet;
                this.CompiledPr.NeedRecalc = true;
            }
        }
    },
    Style_Get: function () {
        if (undefined != this.Pr.PStyle) {
            return this.Pr.PStyle;
        }
        return undefined;
    },
    Style_Add: function (Id, bDoNotDeleteProps) {
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
        var Id_old = this.Pr.PStyle;
        if (undefined === this.Pr.PStyle) {
            Id_old = null;
        } else {
            this.Style_Remove();
        }
        if (null === Id) {
            return;
        }
        if (Id != this.Parent.Get_Styles().Get_Default_Paragraph()) {
            History.Add(this, {
                Type: historyitem_Paragraph_PStyle,
                Old: Id_old,
                New: Id
            });
            this.Pr.PStyle = Id;
        }
        this.CompiledPr.NeedRecalc = true;
        this.Recalc_RunsCompiledPr();
        if (true === bDoNotDeleteProps) {
            return;
        }
        var DefNumId = this.Parent.Get_Styles().Get_Default_ParaList();
        if (Id != DefNumId && (Id_old != DefNumId || Id != this.Parent.Get_Styles().Get_Default_Paragraph())) {
            this.Numbering_Remove();
            this.Set_ContextualSpacing(undefined);
            this.Set_Ind(new CParaInd(), true);
            this.Set_Align(undefined);
            this.Set_KeepLines(undefined);
            this.Set_KeepNext(undefined);
            this.Set_PageBreakBefore(undefined);
            this.Set_Spacing(new CParaSpacing(), true);
            this.Set_Shd(undefined, true);
            this.Set_WidowControl(undefined);
            this.Set_Tabs(new CParaTabs());
            this.Set_Border(undefined, historyitem_Paragraph_Borders_Between);
            this.Set_Border(undefined, historyitem_Paragraph_Borders_Bottom);
            this.Set_Border(undefined, historyitem_Paragraph_Borders_Left);
            this.Set_Border(undefined, historyitem_Paragraph_Borders_Right);
            this.Set_Border(undefined, historyitem_Paragraph_Borders_Top);
            for (var Index = 0; Index < this.Content.length; Index++) {
                this.Content[Index].Clear_TextPr();
            }
            this.TextPr.Clear_Style();
        }
    },
    Style_Add_Open: function (Id) {
        this.Pr.PStyle = Id;
        this.CompiledPr.NeedRecalc = true;
    },
    Style_Remove: function () {
        if (undefined != this.Pr.PStyle) {
            History.Add(this, {
                Type: historyitem_Paragraph_PStyle,
                Old: this.Pr.PStyle,
                New: undefined
            });
            this.Pr.PStyle = undefined;
        }
        this.CompiledPr.NeedRecalc = true;
        this.Recalc_RunsCompiledPr();
    },
    Cursor_IsEnd: function (_ContentPos) {
        var ContentPos = (undefined === _ContentPos ? this.Get_ParaContentPos(false, false) : _ContentPos);
        var SearchPos = new CParagraphSearchPos();
        this.Get_RightPos(SearchPos, ContentPos, false);
        if (true === SearchPos.Found) {
            return false;
        } else {
            return true;
        }
    },
    Cursor_IsStart: function (_ContentPos) {
        var ContentPos = (undefined === _ContentPos ? this.Get_ParaContentPos(false, false) : _ContentPos);
        var SearchPos = new CParagraphSearchPos();
        this.Get_LeftPos(SearchPos, ContentPos);
        if (true === SearchPos.Found) {
            return false;
        } else {
            return true;
        }
    },
    Selection_IsFromStart: function () {
        if (true === this.Is_SelectionUse()) {
            var StartPos = this.Get_ParaContentPos(true, true);
            var EndPos = this.Get_ParaContentPos(true, false);
            if (StartPos.Compare(EndPos) > 0) {
                StartPos = EndPos;
            }
            if (true != this.Cursor_IsStart(StartPos)) {
                return false;
            }
            return true;
        }
        return false;
    },
    Clear_Formatting: function () {
        if (this.bFromDocument) {
            var HdrFtr = this.Parent.Is_HdrFtr(true);
            if (null !== HdrFtr) {
                var Styles = this.Parent.Get_Styles();
                var HdrFtrStyle = null;
                if (hdrftr_Header === HdrFtr.Type) {
                    HdrFtrStyle = Styles.Get_Default_Header();
                } else {
                    HdrFtrStyle = Styles.Get_Default_Footer();
                }
                if (null !== HdrFtrStyle) {
                    this.Style_Add(HdrFtrStyle, true);
                } else {
                    this.Style_Remove();
                }
            } else {
                this.Style_Remove();
            }
            this.Numbering_Remove();
        }
        this.Set_ContextualSpacing(undefined);
        this.Set_Ind(new CParaInd(), true);
        this.Set_Align(undefined, false);
        this.Set_KeepLines(undefined);
        this.Set_KeepNext(undefined);
        this.Set_PageBreakBefore(undefined);
        this.Set_Spacing(new CParaSpacing(), true);
        this.Set_Shd(new CDocumentShd(), true);
        this.Set_WidowControl(undefined);
        this.Set_Tabs(new CParaTabs());
        this.Set_Border(undefined, historyitem_Paragraph_Borders_Between);
        this.Set_Border(undefined, historyitem_Paragraph_Borders_Bottom);
        this.Set_Border(undefined, historyitem_Paragraph_Borders_Left);
        this.Set_Border(undefined, historyitem_Paragraph_Borders_Right);
        this.Set_Border(undefined, historyitem_Paragraph_Borders_Top);
        this.CompiledPr.NeedRecalc = true;
    },
    Clear_TextFormatting: function () {
        var Styles, DefHyper;
        if (this.bFromDocument) {
            Styles = this.Parent.Get_Styles();
            DefHyper = Styles.Get_Default_Hyperlink();
        }
        for (var Index = 0; Index < this.Content.length; Index++) {
            var Item = this.Content[Index];
            Item.Clear_TextFormatting(DefHyper);
        }
        this.TextPr.Clear_Style();
    },
    Set_Ind: function (Ind, bDeleteUndefined) {
        if (undefined === this.Pr.Ind) {
            this.Pr.Ind = new CParaInd();
        }
        if ((undefined != Ind.FirstLine || true === bDeleteUndefined) && this.Pr.Ind.FirstLine !== Ind.FirstLine) {
            History.Add(this, {
                Type: historyitem_Paragraph_Ind_First,
                New: Ind.FirstLine,
                Old: (undefined != this.Pr.Ind.FirstLine ? this.Pr.Ind.FirstLine : undefined)
            });
            this.Pr.Ind.FirstLine = Ind.FirstLine;
        }
        if ((undefined != Ind.Left || true === bDeleteUndefined) && this.Pr.Ind.Left !== Ind.Left) {
            History.Add(this, {
                Type: historyitem_Paragraph_Ind_Left,
                New: Ind.Left,
                Old: (undefined != this.Pr.Ind.Left ? this.Pr.Ind.Left : undefined)
            });
            this.Pr.Ind.Left = Ind.Left;
        }
        if ((undefined != Ind.Right || true === bDeleteUndefined) && this.Pr.Ind.Right !== Ind.Right) {
            History.Add(this, {
                Type: historyitem_Paragraph_Ind_Right,
                New: Ind.Right,
                Old: (undefined != this.Pr.Ind.Right ? this.Pr.Ind.Right : undefined)
            });
            this.Pr.Ind.Right = Ind.Right;
        }
        this.CompiledPr.NeedRecalc = true;
    },
    Set_Spacing: function (Spacing, bDeleteUndefined) {
        if (undefined === this.Pr.Spacing) {
            this.Pr.Spacing = new CParaSpacing();
        }
        if ((undefined != Spacing.Line || true === bDeleteUndefined) && this.Pr.Spacing.Line !== Spacing.Line) {
            History.Add(this, {
                Type: historyitem_Paragraph_Spacing_Line,
                New: Spacing.Line,
                Old: (undefined != this.Pr.Spacing.Line ? this.Pr.Spacing.Line : undefined)
            });
            this.Pr.Spacing.Line = Spacing.Line;
        }
        if ((undefined != Spacing.LineRule || true === bDeleteUndefined) && this.Pr.Spacing.LineRule !== Spacing.LineRule) {
            History.Add(this, {
                Type: historyitem_Paragraph_Spacing_LineRule,
                New: Spacing.LineRule,
                Old: (undefined != this.Pr.Spacing.LineRule ? this.Pr.Spacing.LineRule : undefined)
            });
            this.Pr.Spacing.LineRule = Spacing.LineRule;
        }
        if ((undefined != Spacing.Before || true === bDeleteUndefined) && this.Pr.Spacing.Before !== Spacing.Before) {
            History.Add(this, {
                Type: historyitem_Paragraph_Spacing_Before,
                New: Spacing.Before,
                Old: (undefined != this.Pr.Spacing.Before ? this.Pr.Spacing.Before : undefined)
            });
            this.Pr.Spacing.Before = Spacing.Before;
        }
        if ((undefined != Spacing.After || true === bDeleteUndefined) && this.Pr.Spacing.After !== Spacing.After) {
            History.Add(this, {
                Type: historyitem_Paragraph_Spacing_After,
                New: Spacing.After,
                Old: (undefined != this.Pr.Spacing.After ? this.Pr.Spacing.After : undefined)
            });
            this.Pr.Spacing.After = Spacing.After;
        }
        if ((undefined != Spacing.AfterAutoSpacing || true === bDeleteUndefined) && this.Pr.Spacing.AfterAutoSpacing !== Spacing.AfterAutoSpacing) {
            History.Add(this, {
                Type: historyitem_Paragraph_Spacing_AfterAutoSpacing,
                New: Spacing.AfterAutoSpacing,
                Old: (undefined != this.Pr.Spacing.AfterAutoSpacing ? this.Pr.Spacing.AfterAutoSpacing : undefined)
            });
            this.Pr.Spacing.AfterAutoSpacing = Spacing.AfterAutoSpacing;
        }
        if ((undefined != Spacing.BeforeAutoSpacing || true === bDeleteUndefined) && this.Pr.Spacing.BeforeAutoSpacing !== Spacing.BeforeAutoSpacing) {
            History.Add(this, {
                Type: historyitem_Paragraph_Spacing_BeforeAutoSpacing,
                New: Spacing.BeforeAutoSpacing,
                Old: (undefined != this.Pr.Spacing.BeforeAutoSpacing ? this.Pr.Spacing.BeforeAutoSpacing : undefined)
            });
            this.Pr.Spacing.BeforeAutoSpacing = Spacing.BeforeAutoSpacing;
        }
        this.CompiledPr.NeedRecalc = true;
    },
    Set_Align: function (Align) {
        if (this.Pr.Jc != Align) {
            History.Add(this, {
                Type: historyitem_Paragraph_Align,
                New: Align,
                Old: (undefined != this.Pr.Jc ? this.Pr.Jc : undefined)
            });
            this.Pr.Jc = Align;
            this.CompiledPr.NeedRecalc = true;
        }
    },
    Set_Shd: function (_Shd, bDeleteUndefined) {
        if (undefined === _Shd) {
            if (undefined != this.Pr.Shd) {
                History.Add(this, {
                    Type: historyitem_Paragraph_Shd,
                    New: undefined,
                    Old: this.Pr.Shd
                });
                this.Pr.Shd = undefined;
            }
        } else {
            var Shd = new CDocumentShd();
            Shd.Set_FromObject(_Shd);
            if (undefined === this.Pr.Shd) {
                this.Pr.Shd = new CDocumentShd();
            }
            if ((undefined != Shd.Value || true === bDeleteUndefined) && this.Pr.Shd.Value !== Shd.Value) {
                History.Add(this, {
                    Type: historyitem_Paragraph_Shd_Value,
                    New: Shd.Value,
                    Old: (undefined != this.Pr.Shd.Value ? this.Pr.Shd.Value : undefined)
                });
                this.Pr.Shd.Value = Shd.Value;
            }
            if (undefined != Shd.Color || true === bDeleteUndefined) {
                History.Add(this, {
                    Type: historyitem_Paragraph_Shd_Color,
                    New: Shd.Color,
                    Old: (undefined != this.Pr.Shd.Color ? this.Pr.Shd.Color : undefined)
                });
                this.Pr.Shd.Color = Shd.Color;
            }
            if (undefined != Shd.Unifill || true === bDeleteUndefined) {
                History.Add(this, {
                    Type: historyitem_Paragraph_Shd_Unifill,
                    New: Shd.Unifill,
                    Old: (undefined != this.Pr.Shd.Unifill ? this.Pr.Shd.Unifill : undefined)
                });
                this.Pr.Shd.Unifill = Shd.Unifill;
            }
        }
        this.CompiledPr.NeedRecalc = true;
    },
    Set_Tabs: function (Tabs) {
        var _Tabs = new CParaTabs();
        var StyleTabs = this.Get_CompiledPr2(false).ParaPr.StyleTabs;
        for (var Index = 0; Index < Tabs.Tabs.length; Index++) {
            var Value = StyleTabs.Get_Value(Tabs.Tabs[Index].Pos);
            if (-1 === Value) {
                _Tabs.Add(Tabs.Tabs[Index]);
            }
        }
        for (var Index = 0; Index < StyleTabs.Tabs.length; Index++) {
            var Value = _Tabs.Get_Value(StyleTabs.Tabs[Index].Pos);
            if (tab_Clear != StyleTabs.Tabs[Index] && -1 === Value) {
                _Tabs.Add(new CParaTab(tab_Clear, StyleTabs.Tabs[Index].Pos));
            }
        }
        History.Add(this, {
            Type: historyitem_Paragraph_Tabs,
            New: _Tabs,
            Old: this.Pr.Tabs
        });
        this.Pr.Tabs = _Tabs;
        this.CompiledPr.NeedRecalc = true;
    },
    Set_ContextualSpacing: function (Value) {
        if (Value != this.Pr.ContextualSpacing) {
            History.Add(this, {
                Type: historyitem_Paragraph_ContextualSpacing,
                New: Value,
                Old: (undefined != this.Pr.ContextualSpacing ? this.Pr.ContextualSpacing : undefined)
            });
            this.Pr.ContextualSpacing = Value;
            this.CompiledPr.NeedRecalc = true;
        }
    },
    Set_PageBreakBefore: function (Value) {
        if (Value != this.Pr.PageBreakBefore) {
            History.Add(this, {
                Type: historyitem_Paragraph_PageBreakBefore,
                New: Value,
                Old: (undefined != this.Pr.PageBreakBefore ? this.Pr.PageBreakBefore : undefined)
            });
            this.Pr.PageBreakBefore = Value;
            this.CompiledPr.NeedRecalc = true;
        }
    },
    Set_KeepLines: function (Value) {
        if (Value != this.Pr.KeepLines) {
            History.Add(this, {
                Type: historyitem_Paragraph_KeepLines,
                New: Value,
                Old: (undefined != this.Pr.KeepLines ? this.Pr.KeepLines : undefined)
            });
            this.Pr.KeepLines = Value;
            this.CompiledPr.NeedRecalc = true;
        }
    },
    Set_KeepNext: function (Value) {
        if (Value != this.Pr.KeepNext) {
            History.Add(this, {
                Type: historyitem_Paragraph_KeepNext,
                New: Value,
                Old: (undefined != this.Pr.KeepNext ? this.Pr.KeepNext : undefined)
            });
            this.Pr.KeepNext = Value;
            this.CompiledPr.NeedRecalc = true;
        }
    },
    Set_WidowControl: function (Value) {
        if (Value != this.Pr.WidowControl) {
            History.Add(this, {
                Type: historyitem_Paragraph_WidowControl,
                New: Value,
                Old: (undefined != this.Pr.WidowControl ? this.Pr.WidowControl : undefined)
            });
            this.Pr.WidowControl = Value;
            this.CompiledPr.NeedRecalc = true;
        }
    },
    Set_Borders: function (Borders) {
        if (undefined === Borders) {
            return;
        }
        var OldBorders = this.Get_CompiledPr2(false).ParaPr.Brd;
        if (undefined != Borders.Between) {
            var NewBorder = undefined;
            if (undefined != Borders.Between.Value) {
                NewBorder = new CDocumentBorder();
                NewBorder.Color = (undefined != Borders.Between.Color ? new CDocumentColor(Borders.Between.Color.r, Borders.Between.Color.g, Borders.Between.Color.b) : new CDocumentColor(OldBorders.Between.Color.r, OldBorders.Between.Color.g, OldBorders.Between.Color.b));
                NewBorder.Space = (undefined != Borders.Between.Space ? Borders.Between.Space : OldBorders.Between.Space);
                NewBorder.Size = (undefined != Borders.Between.Size ? Borders.Between.Size : OldBorders.Between.Size);
                NewBorder.Value = (undefined != Borders.Between.Value ? Borders.Between.Value : OldBorders.Between.Value);
                NewBorder.Unifill = (undefined != Borders.Between.Unifill ? Borders.Between.Unifill.createDuplicate() : OldBorders.Between.Unifill);
            }
            History.Add(this, {
                Type: historyitem_Paragraph_Borders_Between,
                New: NewBorder,
                Old: this.Pr.Brd.Between
            });
            this.Pr.Brd.Between = NewBorder;
        }
        if (undefined != Borders.Top) {
            var NewBorder = undefined;
            if (undefined != Borders.Top.Value) {
                NewBorder = new CDocumentBorder();
                NewBorder.Color = (undefined != Borders.Top.Color ? new CDocumentColor(Borders.Top.Color.r, Borders.Top.Color.g, Borders.Top.Color.b) : new CDocumentColor(OldBorders.Top.Color.r, OldBorders.Top.Color.g, OldBorders.Top.Color.b));
                NewBorder.Space = (undefined != Borders.Top.Space ? Borders.Top.Space : OldBorders.Top.Space);
                NewBorder.Size = (undefined != Borders.Top.Size ? Borders.Top.Size : OldBorders.Top.Size);
                NewBorder.Value = (undefined != Borders.Top.Value ? Borders.Top.Value : OldBorders.Top.Value);
                NewBorder.Unifill = (undefined != Borders.Top.Unifill ? Borders.Top.Unifill.createDuplicate() : OldBorders.Top.Unifill);
            }
            History.Add(this, {
                Type: historyitem_Paragraph_Borders_Top,
                New: NewBorder,
                Old: this.Pr.Brd.Top
            });
            this.Pr.Brd.Top = NewBorder;
        }
        if (undefined != Borders.Right) {
            var NewBorder = undefined;
            if (undefined != Borders.Right.Value) {
                NewBorder = new CDocumentBorder();
                NewBorder.Color = (undefined != Borders.Right.Color ? new CDocumentColor(Borders.Right.Color.r, Borders.Right.Color.g, Borders.Right.Color.b) : new CDocumentColor(OldBorders.Right.Color.r, OldBorders.Right.Color.g, OldBorders.Right.Color.b));
                NewBorder.Space = (undefined != Borders.Right.Space ? Borders.Right.Space : OldBorders.Right.Space);
                NewBorder.Size = (undefined != Borders.Right.Size ? Borders.Right.Size : OldBorders.Right.Size);
                NewBorder.Value = (undefined != Borders.Right.Value ? Borders.Right.Value : OldBorders.Right.Value);
                NewBorder.Unifill = (undefined != Borders.Right.Unifill ? Borders.Right.Unifill.createDuplicate() : OldBorders.Right.Unifill);
            }
            History.Add(this, {
                Type: historyitem_Paragraph_Borders_Right,
                New: NewBorder,
                Old: this.Pr.Brd.Right
            });
            this.Pr.Brd.Right = NewBorder;
        }
        if (undefined != Borders.Bottom) {
            var NewBorder = undefined;
            if (undefined != Borders.Bottom.Value) {
                NewBorder = new CDocumentBorder();
                NewBorder.Color = (undefined != Borders.Bottom.Color ? new CDocumentColor(Borders.Bottom.Color.r, Borders.Bottom.Color.g, Borders.Bottom.Color.b) : new CDocumentColor(OldBorders.Bottom.Color.r, OldBorders.Bottom.Color.g, OldBorders.Bottom.Color.b));
                NewBorder.Space = (undefined != Borders.Bottom.Space ? Borders.Bottom.Space : OldBorders.Bottom.Space);
                NewBorder.Size = (undefined != Borders.Bottom.Size ? Borders.Bottom.Size : OldBorders.Bottom.Size);
                NewBorder.Value = (undefined != Borders.Bottom.Value ? Borders.Bottom.Value : OldBorders.Bottom.Value);
                NewBorder.Unifill = (undefined != Borders.Bottom.Unifill ? Borders.Bottom.Unifill.createDuplicate() : OldBorders.Bottom.Unifill);
            }
            History.Add(this, {
                Type: historyitem_Paragraph_Borders_Bottom,
                New: NewBorder,
                Old: this.Pr.Brd.Bottom
            });
            this.Pr.Brd.Bottom = NewBorder;
        }
        if (undefined != Borders.Left) {
            var NewBorder = undefined;
            if (undefined != Borders.Left.Value) {
                NewBorder = new CDocumentBorder();
                NewBorder.Color = (undefined != Borders.Left.Color ? new CDocumentColor(Borders.Left.Color.r, Borders.Left.Color.g, Borders.Left.Color.b) : new CDocumentColor(OldBorders.Left.Color.r, OldBorders.Left.Color.g, OldBorders.Left.Color.b));
                NewBorder.Space = (undefined != Borders.Left.Space ? Borders.Left.Space : OldBorders.Left.Space);
                NewBorder.Size = (undefined != Borders.Left.Size ? Borders.Left.Size : OldBorders.Left.Size);
                NewBorder.Value = (undefined != Borders.Left.Value ? Borders.Left.Value : OldBorders.Left.Value);
                NewBorder.Unifill = (undefined != Borders.Left.Unifill ? Borders.Left.Unifill.createDuplicate() : OldBorders.Left.Unifill);
            }
            History.Add(this, {
                Type: historyitem_Paragraph_Borders_Left,
                New: NewBorder,
                Old: this.Pr.Brd.Left
            });
            this.Pr.Brd.Left = NewBorder;
        }
        this.CompiledPr.NeedRecalc = true;
    },
    Set_Border: function (Border, HistoryType) {
        var OldValue;
        switch (HistoryType) {
        case historyitem_Paragraph_Borders_Between:
            OldValue = this.Pr.Brd.Between;
            this.Pr.Brd.Between = Border;
            break;
        case historyitem_Paragraph_Borders_Bottom:
            OldValue = this.Pr.Brd.Bottom;
            this.Pr.Brd.Bottom = Border;
            break;
        case historyitem_Paragraph_Borders_Left:
            OldValue = this.Pr.Brd.Left;
            this.Pr.Brd.Left = Border;
            break;
        case historyitem_Paragraph_Borders_Right:
            OldValue = this.Pr.Brd.Right;
            this.Pr.Brd.Right = Border;
            break;
        case historyitem_Paragraph_Borders_Top:
            OldValue = this.Pr.Brd.Top;
            this.Pr.Brd.Top = Border;
            break;
        }
        History.Add(this, {
            Type: HistoryType,
            New: Border,
            Old: OldValue
        });
        this.CompiledPr.NeedRecalc = true;
    },
    Is_StartFromNewPage: function () {
        if ((this.Pages.length > 1 && 0 === this.Pages[1].FirstLine) || (1 === this.Pages.length && -1 === this.Pages[0].EndLine) || (null === this.Get_DocumentPrev())) {
            return true;
        }
        return false;
    },
    Get_DrawingObjectRun: function (Id) {
        var Run = null;
        var ContentLen = this.Content.length;
        for (var Index = 0; Index < ContentLen; Index++) {
            var Element = this.Content[Index];
            Run = Element.Get_DrawingObjectRun(Id);
            if (null !== Run) {
                return Run;
            }
        }
        return Run;
    },
    Remove_DrawingObject: function (Id) {
        for (var Index = 0; Index < this.Content.length; Index++) {
            var Item = this.Content[Index];
            if (para_Drawing === Item.Type && Id === Item.Get_Id()) {
                var HdrFtr = this.Parent.Is_HdrFtr(true);
                if (null != HdrFtr && true != Item.Is_Inline()) {
                    HdrFtr.RecalcInfo.NeedRecalc = true;
                }
                this.Internal_Content_Remove(Index);
                return Index;
            }
        }
        return -1;
    },
    Get_DrawingObjectContentPos: function (Id) {
        var ContentPos = new CParagraphContentPos();
        var ContentLen = this.Content.length;
        for (var Index = 0; Index < ContentLen; Index++) {
            var Element = this.Content[Index];
            if (true === Element.Get_DrawingObjectContentPos(Id, ContentPos, 1)) {
                ContentPos.Update2(Index, 0);
                return ContentPos;
            }
        }
        return null;
    },
    Internal_CorrectAnchorPos: function (Result, Drawing) {
        var RelH = Drawing.PositionH.RelativeFrom;
        var RelV = Drawing.PositionV.RelativeFrom;
        var ContentPos = 0;
        if (c_oAscRelativeFromH.Character != RelH || c_oAscRelativeFromV.Line != RelV) {
            var CurLine = Result.Internal.Line;
            if (c_oAscRelativeFromV.Line != RelV) {
                var CurPage = Result.Internal.Page;
                CurLine = this.Pages[CurPage].StartLine;
            }
            Result.X = this.Lines[CurLine].Ranges[0].X - 3.8;
        }
        if (c_oAscRelativeFromV.Line != RelV) {
            var CurPage = Result.Internal.Page;
            var CurLine = this.Pages[CurPage].StartLine;
            Result.Y = this.Pages[CurPage].Y + this.Lines[CurLine].Y - this.Lines[CurLine].Metrics.Ascent;
        }
        if (c_oAscRelativeFromH.Character === RelH) {} else {
            if (c_oAscRelativeFromV.Line === RelV) {} else {
                if (0 === Result.Internal.Page) {
                    Result.ContentPos = this.Get_StartPos();
                }
            }
        }
    },
    Get_NearestPos: function (PageNum, X, Y, bAnchor, Drawing) {
        var SearchPosXY = this.Get_ParaContentPosByXY(X, Y, PageNum, false, false);
        this.Set_ParaContentPos(SearchPosXY.Pos, true, SearchPosXY.Line, SearchPosXY.Range);
        var ContentPos = this.Get_ParaContentPos(false, false);
        ContentPos = this.private_CorrectNearestPos(ContentPos, bAnchor, Drawing);
        var Result = this.Internal_Recalculate_CurPos(ContentPos, false, false, true);
        Result.ContentPos = ContentPos;
        Result.SearchPos = SearchPosXY.Pos;
        Result.Paragraph = this;
        if (true === bAnchor && undefined != Drawing && null != Drawing) {
            this.Internal_CorrectAnchorPos(Result, Drawing);
        }
        return Result;
    },
    private_CorrectNearestPos: function (ContentPos, Anchor, Drawing) {
        if (undefined !== Drawing && null !== Drawing) {
            var CurPos = ContentPos.Get(0);
            if (para_Math === this.Content[CurPos].Type) {
                if (CurPos > 0) {
                    CurPos--;
                    ContentPos = new CParagraphContentPos();
                    ContentPos.Update(CurPos, 0);
                    this.Content[CurPos].Get_EndPos(false, ContentPos, 1);
                    this.Set_ParaContentPos(ContentPos, false, -1, -1);
                } else {
                    CurPos++;
                    ContentPos = new CParagraphContentPos();
                    ContentPos.Update(CurPos, 0);
                    this.Content[CurPos].Get_StartPos(ContentPos, 1);
                    this.Set_ParaContentPos(ContentPos, false, -1, -1);
                }
            }
        }
        return ContentPos;
    },
    Check_NearestPos: function (NearPos) {
        var ParaNearPos = new CParagraphNearPos();
        ParaNearPos.NearPos = NearPos;
        var Count = this.NearPosArray.length;
        for (var Index = 0; Index < Count; Index++) {
            if (this.NearPosArray[Index].NearPos === NearPos) {
                return;
            }
        }
        this.NearPosArray.push(ParaNearPos);
        ParaNearPos.Classes.push(this);
        var CurPos = NearPos.ContentPos.Get(0);
        this.Content[CurPos].Check_NearestPos(ParaNearPos, 1);
    },
    Clear_NearestPosArray: function () {
        var ArrayLen = this.NearPosArray.length;
        for (var Pos = 0; Pos < ArrayLen; Pos++) {
            var ParaNearPos = this.NearPosArray[Pos];
            var ArrayLen2 = ParaNearPos.Classes.length;
            for (var Pos2 = 1; Pos2 < ArrayLen2; Pos2++) {
                var Class = ParaNearPos.Classes[Pos2];
                Class.NearPosArray = [];
            }
        }
        this.NearPosArray = [];
    },
    Get_ParaNearestPos: function (NearPos) {
        var ArrayLen = this.NearPosArray.length;
        for (var Pos = 0; Pos < ArrayLen; Pos++) {
            var ParaNearPos = this.NearPosArray[Pos];
            if (NearPos === ParaNearPos.NearPos) {
                return ParaNearPos;
            }
        }
        return null;
    },
    Get_Layout: function (ContentPos, Drawing) {
        var LinePos = this.Get_ParaPosByContentPos(ContentPos);
        var CurLine = LinePos.Line;
        var CurRange = LinePos.Range;
        var CurPage = LinePos.Page;
        var X = this.Lines[CurLine].Ranges[CurRange].XVisible;
        var Y = this.Pages[CurPage].Y + this.Lines[CurLine].Y;
        if (true === this.Numbering.Check_Range(CurRange, CurLine)) {
            X += this.Numbering.WidthVisible;
        }
        var DrawingLayout = new CParagraphDrawingLayout(Drawing, this, X, Y, CurLine, CurRange, CurPage);
        var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
        var EndPos = this.Lines[CurLine].Ranges[CurRange].EndPos;
        var CurContentPos = ContentPos.Get(0);
        for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
            this.Content[CurPos].Get_Layout(DrawingLayout, (CurPos === CurContentPos ? true : false), ContentPos, 1);
            if (true === DrawingLayout.Layout) {
                var LogicDocument = this.LogicDocument;
                var LD_PageLimits = LogicDocument.Get_PageLimits(CurPage);
                var LD_PageFields = LogicDocument.Get_PageFields(CurPage);
                var Page_Width = LD_PageLimits.XLimit;
                var Page_Height = LD_PageLimits.YLimit;
                var X_Left_Field = LD_PageFields.X;
                var Y_Top_Field = LD_PageFields.Y;
                var X_Right_Field = LD_PageFields.XLimit;
                var Y_Bottom_Field = LD_PageFields.YLimit;
                var X_Left_Margin = X_Left_Field;
                var X_Right_Margin = Page_Width - X_Right_Field;
                var Y_Bottom_Margin = Page_Height - Y_Bottom_Field;
                var Y_Top_Margin = Y_Top_Field;
                var Para = DrawingLayout.Paragraph;
                var CurPage = DrawingLayout.Page;
                var Drawing = DrawingLayout.Drawing;
                var DrawingObjects = this.Parent.DrawingObjects;
                var PageLimits = this.Parent.Get_PageLimits(this.PageNum + CurPage);
                var PageFields = this.Parent.Get_PageFields(this.PageNum + CurPage);
                var ColumnStartX = (0 === CurPage ? this.X_ColumnStart : this.Pages[CurPage].X);
                var ColumnEndX = (0 === CurPage ? this.X_ColumnEnd : this.Pages[CurPage].XLimit);
                var Top_Margin = Y_Top_Margin;
                var Bottom_Margin = Y_Bottom_Margin;
                var Page_H = Page_Height;
                if (true === this.Parent.Is_TableCellContent() && undefined != Drawing && true == Drawing.Use_TextWrap()) {
                    Top_Margin = 0;
                    Bottom_Margin = 0;
                    Page_H = 0;
                }
                if (undefined != Drawing && true != Drawing.Use_TextWrap()) {
                    PageFields = LD_PageFields;
                    PageLimits = LD_PageLimits;
                }
                var Layout = new CParagraphLayout(DrawingLayout.X, DrawingLayout.Y, this.Get_StartPage_Absolute() + CurPage, DrawingLayout.LastW, ColumnStartX, ColumnEndX, X_Left_Margin, X_Right_Margin, Page_Width, Top_Margin, Bottom_Margin, Page_H, PageFields.X, PageFields.Y, this.Pages[CurPage].Y + this.Lines[CurLine].Y - this.Lines[CurLine].Metrics.Ascent, this.Pages[CurPage].Y);
                return {
                    ParagraphLayout: Layout,
                    PageLimits: PageLimits
                };
            }
        }
        return null;
    },
    Get_AnchorPos: function (Drawing) {
        var ContentPos = this.Get_DrawingObjectContentPos(Drawing.Get_Id());
        if (null === ContentPos) {
            return {
                X: 0,
                Y: 0,
                Height: 0
            };
        }
        var ParaPos = this.Get_ParaPosByContentPos(ContentPos);
        this.Set_ParaContentPos(ContentPos, false, -1, -1);
        var Result = this.Internal_Recalculate_CurPos(ContentPos, false, false, true);
        Result.Paragraph = this;
        Result.ContentPos = ContentPos;
        this.Internal_CorrectAnchorPos(Result, Drawing);
        return Result;
    },
    Set_DocumentNext: function (Object) {
        History.Add(this, {
            Type: historyitem_Paragraph_DocNext,
            New: Object,
            Old: this.Next
        });
        this.Next = Object;
    },
    Set_DocumentPrev: function (Object) {
        History.Add(this, {
            Type: historyitem_Paragraph_DocPrev,
            New: Object,
            Old: this.Prev
        });
        this.Prev = Object;
    },
    Get_DocumentNext: function () {
        return this.Next;
    },
    Get_DocumentPrev: function () {
        return this.Prev;
    },
    Set_DocumentIndex: function (Index) {
        this.Index = Index;
    },
    Set_Parent: function (ParentObject) {
        History.Add(this, {
            Type: historyitem_Paragraph_Parent,
            New: ParentObject,
            Old: this.Parent
        });
        this.Parent = ParentObject;
    },
    Get_Parent: function () {
        return this.Parent;
    },
    Is_ContentOnFirstPage: function () {
        if (this.Pages[0].EndLine < 0) {
            return false;
        }
        return true;
    },
    Get_CurrentPage_Absolute: function () {
        this.Internal_Recalculate_CurPos(this.CurPos.ContentPos, true, false, false);
        return (this.Get_StartPage_Absolute() + this.CurPos.PagesPos);
    },
    Get_CurrentPage_Relative: function () {
        this.Internal_Recalculate_CurPos(this.CurPos.ContentPos, true, false, false);
        return (this.PageNum + this.CurPos.PagesPos);
    },
    DocumentStatistics: function (Stats) {
        var ParaStats = new CParagraphStatistics(Stats);
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            var Item = this.Content[Index];
            Item.Collect_DocumentStatistics(ParaStats);
        }
        var NumPr = this.Numbering_Get();
        if (undefined != NumPr) {
            ParaStats.EmptyParagraph = false;
            var AbstractNum = this.Parent.Get_Numbering().Get_AbstractNum(NumPr.NumId);
            if (undefined !== AbstractNum && null !== AbstractNum) {
                AbstractNum.DocumentStatistics(NumPr.Lvl, Stats);
            }
        }
        if (false === ParaStats.EmptyParagraph) {
            Stats.Add_Paragraph();
        }
    },
    TurnOff_RecalcEvent: function () {
        this.TurnOffRecalcEvent = true;
    },
    TurnOn_RecalcEvent: function () {
        this.TurnOffRecalcEvent = false;
    },
    Set_ApplyToAll: function (bValue) {
        this.ApplyToAll = bValue;
    },
    Get_ApplyToAll: function () {
        return this.ApplyToAll;
    },
    Get_ParentTextTransform: function () {
        var CurDocContent = this.Parent;
        while (CurDocContent.Is_TableCellContent()) {
            CurDocContent = CurDocContent.Parent.Row.Table.Parent;
        }
        if (CurDocContent.Parent && CurDocContent.Parent.transformText) {
            return CurDocContent.Parent.transformText;
        }
        if (CurDocContent.Parent && CurDocContent.Parent.parent && CurDocContent.Parent.parent.transformText) {
            return CurDocContent.Parent.parent.transformText;
        }
        if (CurDocContent.transformText) {
            return CurDocContent.transformText;
        }
        return null;
    },
    Update_CursorType: function (X, Y, PageIndex) {
        var text_transform = this.Get_ParentTextTransform();
        var MMData = new CMouseMoveData();
        var Coords = this.DrawingDocument.ConvertCoordsToCursorWR(X, Y, this.Get_StartPage_Absolute() + (PageIndex - this.PageNum), text_transform);
        MMData.X_abs = Coords.X;
        MMData.Y_abs = Coords.Y;
        var Hyperlink = this.Check_Hyperlink(X, Y, PageIndex);
        var PNum = PageIndex - this.PageNum;
        if (null != Hyperlink && (PNum >= 0 && PNum < this.Pages.length && Y <= this.Pages[PNum].Bounds.Bottom && Y >= this.Pages[PNum].Bounds.Top)) {
            MMData.Type = c_oAscMouseMoveDataTypes.Hyperlink;
            MMData.Hyperlink = new CHyperlinkProperty(Hyperlink);
        } else {
            MMData.Type = c_oAscMouseMoveDataTypes.Common;
        }
        if (null != Hyperlink && true === global_keyboardEvent.CtrlKey) {
            this.DrawingDocument.SetCursorType("pointer", MMData);
        } else {
            this.DrawingDocument.SetCursorType("default", MMData);
        }
        var PNum = Math.max(0, Math.min(PageIndex - this.PageNum, this.Pages.length - 1));
        var Bounds = this.Pages[PNum].Bounds;
        if (true === this.Lock.Is_Locked() && X < Bounds.Right && X > Bounds.Left && Y > Bounds.Top && Y < Bounds.Bottom) {
            var _X = this.Pages[PNum].X;
            var _Y = this.Pages[PNum].Y;
            var MMData = new CMouseMoveData();
            var Coords = this.DrawingDocument.ConvertCoordsToCursorWR(_X, _Y, this.Get_StartPage_Absolute() + (PageIndex - this.PageNum), text_transform);
            MMData.X_abs = Coords.X - 5;
            MMData.Y_abs = Coords.Y;
            MMData.Type = c_oAscMouseMoveDataTypes.LockedObject;
            MMData.UserId = this.Lock.Get_UserId();
            MMData.HaveChanges = this.Lock.Have_Changes();
            MMData.LockedObjectType = c_oAscMouseMoveLockedObjectType.Common;
            editor.sync_MouseMoveCallback(MMData);
        }
    },
    Document_CreateFontMap: function (FontMap) {
        if (true === this.FontMap.NeedRecalc) {
            this.FontMap.Map = {};
            this.Internal_CompileParaPr();
            var FontScheme = this.Get_Theme().themeElements.fontScheme;
            var CurTextPr = this.CompiledPr.Pr.TextPr.Copy();
            CurTextPr.Document_CreateFontMap(this.FontMap.Map, FontScheme);
            CurTextPr.Merge(this.TextPr.Value);
            CurTextPr.Document_CreateFontMap(this.FontMap.Map, FontScheme);
            var Count = this.Content.length;
            for (var Index = 0; Index < Count; Index++) {
                this.Content[Index].Create_FontMap(this.FontMap.Map);
            }
            this.FontMap.NeedRecalc = false;
        }
        for (var Key in this.FontMap.Map) {
            FontMap[Key] = this.FontMap.Map[Key];
        }
    },
    Document_CreateFontCharMap: function (FontCharMap) {
        this.Internal_CompileParaPr();
        var CurTextPr = this.CompiledPr.Pr.TextPr.Copy();
        FontCharMap.StartFont(CurTextPr.FontFamily.Name, CurTextPr.Bold, CurTextPr.Italic, CurTextPr.FontSize);
        for (var Index = 0; Index < this.Content.length; Index++) {
            var Item = this.Content[Index];
            if (para_TextPr === Item.Type) {
                CurTextPr = this.CompiledPr.Pr.TextPr.Copy();
                var _CurTextPr = Item.Value;
                if (undefined != _CurTextPr.RStyle) {
                    var Styles = this.Parent.Get_Styles();
                    var StyleTextPr = Styles.Get_Pr(_CurTextPr.RStyle, styletype_Character).TextPr;
                    CurTextPr.Merge(StyleTextPr);
                }
                CurTextPr.Merge(_CurTextPr);
                FontCharMap.StartFont(CurTextPr.FontFamily.Name, CurTextPr.Bold, CurTextPr.Italic, CurTextPr.FontSize);
            } else {
                if (para_Text === Item.Type) {
                    FontCharMap.AddChar(Item.Value);
                } else {
                    if (para_Space === Item.Type) {
                        FontCharMap.AddChar(" ");
                    } else {
                        if (para_Numbering === Item.Type) {
                            var ParaPr = this.CompiledPr.Pr.ParaPr;
                            var NumPr = ParaPr.NumPr;
                            if (undefined === NumPr || undefined === NumPr.NumId || 0 === NumPr.NumId || "0" === NumPr.NumId) {
                                continue;
                            }
                            var Numbering = this.Parent.Get_Numbering();
                            var NumInfo = this.Parent.Internal_GetNumInfo(this.Id, NumPr);
                            var NumTextPr = this.CompiledPr.Pr.TextPr.Copy();
                            NumTextPr.Merge(this.TextPr.Value);
                            NumTextPr.Merge(NumLvl.TextPr);
                            Numbering.Document_CreateFontCharMap(FontCharMap, NumTextPr, NumPr, NumInfo);
                            FontCharMap.StartFont(CurTextPr.FontFamily.Name, CurTextPr.Bold, CurTextPr.Italic, CurTextPr.FontSize);
                        } else {
                            if (para_PageNum === Item.Type) {
                                Item.Document_CreateFontCharMap(FontCharMap);
                            }
                        }
                    }
                }
            }
        }
        CurTextPr.Merge(this.TextPr.Value);
    },
    Document_Get_AllFontNames: function (AllFonts) {
        this.TextPr.Value.Document_Get_AllFontNames(AllFonts);
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            this.Content[Index].Get_AllFontNames(AllFonts);
        }
    },
    Document_UpdateRulersState: function () {
        if (true === this.Is_Inline()) {
            this.LogicDocument.Document_UpdateRulersStateBySection();
        } else {
            var Frame = this.CalculatedFrame;
            this.Parent.DrawingDocument.Set_RulerState_Paragraph({
                L: Frame.L,
                T: Frame.T,
                R: Frame.L + Frame.W,
                B: Frame.T + Frame.H,
                PageIndex: Frame.PageIndex,
                Frame: this
            },
            false);
        }
    },
    Document_UpdateInterfaceState: function () {
        var StartPos, EndPos;
        if (true === this.Selection.Use) {
            StartPos = this.Get_ParaContentPos(true, true);
            EndPos = this.Get_ParaContentPos(true, false);
        } else {
            var CurPos = this.Get_ParaContentPos(false, false);
            StartPos = CurPos;
            EndPos = CurPos;
        }
        if (this.bFromDocument && this.LogicDocument && true === this.LogicDocument.Spelling.Use && selectionflag_Numbering !== this.Selection.Flag) {
            this.SpellChecker.Document_UpdateInterfaceState(StartPos, EndPos);
        }
        if (true === this.Selection.Use) {
            var StartPos = this.Selection.StartPos;
            var EndPos = this.Selection.EndPos;
            if (StartPos > EndPos) {
                StartPos = this.Selection.EndPos;
                EndPos = this.Selection.StartPos;
            }
            for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
                var Element = this.Content[CurPos];
                if (true !== Element.Selection_IsEmpty() && (para_Hyperlink === Element.Type || para_Math === Element.Type)) {
                    Element.Document_UpdateInterfaceState();
                }
            }
        } else {
            var CurType = this.Content[this.CurPos.ContentPos].Type;
            if (para_Hyperlink === CurType || para_Math === CurType) {
                this.Content[this.CurPos.ContentPos].Document_UpdateInterfaceState();
            }
        }
    },
    PreDelete: function () {
        for (var Index = 0; Index < this.Content.length; Index++) {
            var Item = this.Content[Index];
            if (para_Comment === Item.Type) {
                this.LogicDocument.Remove_Comment(Item.CommentId, true, false);
            }
        }
    },
    Get_StartPage_Absolute: function () {
        return this.Parent.Get_StartPage_Absolute() + this.Get_StartPage_Relative();
    },
    Get_StartPage_Relative: function () {
        return this.PageNum;
    },
    Document_SetThisElementCurrent: function (bUpdateStates) {
        this.Parent.Update_ConentIndexing();
        this.Parent.Set_CurrentElement(this.Index, bUpdateStates);
    },
    Is_ThisElementCurrent: function () {
        var Parent = this.Parent;
        Parent.Update_ConentIndexing();
        if (docpostype_Content === Parent.CurPos.Type && false === Parent.Selection.Use && this.Index === Parent.CurPos.ContentPos && Parent.Content[this.Index] === this) {
            return this.Parent.Is_ThisElementCurrent();
        }
        return false;
    },
    Is_Inline: function () {
        if (undefined != this.Pr.FramePr && c_oAscYAlign.Inline !== this.Pr.FramePr.YAlign) {
            return false;
        }
        return true;
    },
    Get_FramePr: function () {
        return this.Pr.FramePr;
    },
    Set_FramePr: function (FramePr, bDelete) {
        var FramePr_old = this.Pr.FramePr;
        if (undefined === bDelete) {
            bDelete = false;
        }
        if (true === bDelete) {
            this.Pr.FramePr = undefined;
            History.Add(this, {
                Type: historyitem_Paragraph_FramePr,
                Old: FramePr_old,
                New: undefined
            });
            this.CompiledPr.NeedRecalc = true;
            return;
        }
        var FrameParas = this.Internal_Get_FrameParagraphs();
        if (true === FramePr.FromDropCapMenu && 1 === FrameParas.length) {
            var NewFramePr = FramePr_old.Copy();
            if (undefined != FramePr.DropCap) {
                var OldLines = NewFramePr.Lines;
                NewFramePr.Init_Default_DropCap(FramePr.DropCap === c_oAscDropCap.Drop ? true : false);
                NewFramePr.Lines = OldLines;
            }
            if (undefined != FramePr.Lines) {
                var AnchorPara = this.Get_FrameAnchorPara();
                if (null === AnchorPara || AnchorPara.Lines.length <= 0) {
                    return;
                }
                var Before = AnchorPara.Get_CompiledPr().ParaPr.Spacing.Before;
                var LineH = AnchorPara.Lines[0].Bottom - AnchorPara.Lines[0].Top - Before;
                var LineTA = AnchorPara.Lines[0].Metrics.TextAscent2;
                var LineTD = AnchorPara.Lines[0].Metrics.TextDescent + AnchorPara.Lines[0].Metrics.LineGap;
                this.Set_Spacing({
                    LineRule: linerule_Exact,
                    Line: FramePr.Lines * LineH
                },
                false);
                this.Update_DropCapByLines(this.Internal_CalculateTextPr(this.Internal_GetStartPos()), FramePr.Lines, LineH, LineTA, LineTD, Before);
                NewFramePr.Lines = FramePr.Lines;
            }
            if (undefined != FramePr.FontFamily) {
                var FF = new ParaTextPr({
                    RFonts: {
                        Ascii: {
                            Name: FramePr.FontFamily.Name,
                            Index: -1
                        }
                    }
                });
                this.Select_All();
                this.Add(FF);
                this.Selection_Remove();
            }
            if (undefined != FramePr.HSpace) {
                NewFramePr.HSpace = FramePr.HSpace;
            }
            this.Pr.FramePr = NewFramePr;
        } else {
            var NewFramePr = FramePr_old.Copy();
            if (undefined != FramePr.H) {
                NewFramePr.H = FramePr.H;
            }
            if (undefined != FramePr.HAnchor) {
                NewFramePr.HAnchor = FramePr.HAnchor;
            }
            if (undefined != FramePr.HRule) {
                NewFramePr.HRule = FramePr.HRule;
            }
            if (undefined != FramePr.HSpace) {
                NewFramePr.HSpace = FramePr.HSpace;
            }
            if (undefined != FramePr.Lines) {
                NewFramePr.Lines = FramePr.Lines;
            }
            if (undefined != FramePr.VAnchor) {
                NewFramePr.VAnchor = FramePr.VAnchor;
            }
            if (undefined != FramePr.VSpace) {
                NewFramePr.VSpace = FramePr.VSpace;
            }
            NewFramePr.W = FramePr.W;
            if (undefined != FramePr.X) {
                NewFramePr.X = FramePr.X;
                NewFramePr.XAlign = undefined;
            }
            if (undefined != FramePr.XAlign) {
                NewFramePr.XAlign = FramePr.XAlign;
                NewFramePr.X = undefined;
            }
            if (undefined != FramePr.Y) {
                NewFramePr.Y = FramePr.Y;
                NewFramePr.YAlign = undefined;
            }
            if (undefined != FramePr.YAlign) {
                NewFramePr.YAlign = FramePr.YAlign;
                NewFramePr.Y = undefined;
            }
            if (undefined !== FramePr.Wrap) {
                if (false === FramePr.Wrap) {
                    NewFramePr.Wrap = wrap_NotBeside;
                } else {
                    if (true === FramePr.Wrap) {
                        NewFramePr.Wrap = wrap_Around;
                    } else {
                        NewFramePr.Wrap = FramePr.Wrap;
                    }
                }
            }
            this.Pr.FramePr = NewFramePr;
        }
        if (undefined != FramePr.Brd) {
            var Count = FrameParas.length;
            for (var Index = 0; Index < Count; Index++) {
                FrameParas[Index].Set_Borders(FramePr.Brd);
            }
        }
        if (undefined != FramePr.Shd) {
            var Count = FrameParas.length;
            for (var Index = 0; Index < Count; Index++) {
                FrameParas[Index].Set_Shd(FramePr.Shd);
            }
        }
        History.Add(this, {
            Type: historyitem_Paragraph_FramePr,
            Old: FramePr_old,
            New: this.Pr.FramePr
        });
        this.CompiledPr.NeedRecalc = true;
    },
    Set_FramePr2: function (FramePr) {
        History.Add(this, {
            Type: historyitem_Paragraph_FramePr,
            Old: this.Pr.FramePr,
            New: FramePr
        });
        this.Pr.FramePr = FramePr;
        this.CompiledPr.NeedRecalc = true;
    },
    Set_FrameParaPr: function (Para) {
        Para.CopyPr(this);
        Para.Set_Ind({
            FirstLine: 0
        },
        false);
        this.Set_Spacing({
            After: 0
        },
        false);
        this.Set_Ind({
            Right: 0
        },
        false);
        this.Numbering_Remove();
    },
    Get_FrameBounds: function (FrameX, FrameY, FrameW, FrameH) {
        var X0 = FrameX,
        Y0 = FrameY,
        X1 = FrameX + FrameW,
        Y1 = FrameY + FrameH;
        var Paras = this.Internal_Get_FrameParagraphs();
        var Count = Paras.length;
        var FramePr = this.Get_FramePr();
        if (0 >= Count) {
            return {
                X: X0,
                Y: Y0,
                W: X1 - X0,
                H: Y1 - Y0
            };
        }
        for (var Index = 0; Index < Count; Index++) {
            var Para = Paras[Index];
            var ParaPr = Para.Get_CompiledPr2(false).ParaPr;
            var Brd = ParaPr.Brd;
            var _X0 = X0 + ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
            if (undefined != Brd.Left && border_None != Brd.Left.Value) {
                _X0 -= Brd.Left.Size + Brd.Left.Space + 1;
            }
            if (_X0 < X0) {
                X0 = _X0;
            }
            var _X1 = X1 - ParaPr.Ind.Right;
            if (undefined != Brd.Right && border_None != Brd.Right.Value) {
                _X1 += Brd.Right.Size + Brd.Right.Space + 1;
            }
            if (_X1 > X1) {
                X1 = _X1;
            }
        }
        var _Y1 = Y1;
        var BottomBorder = Paras[Count - 1].Get_CompiledPr2(false).ParaPr.Brd.Bottom;
        if (undefined != BottomBorder && border_None != BottomBorder.Value) {
            _Y1 += BottomBorder.Size + BottomBorder.Space;
        }
        if (_Y1 > Y1 && (heightrule_Auto === FramePr.HRule || (heightrule_AtLeast === FramePr.HRule && FrameH >= FramePr.H))) {
            Y1 = _Y1;
        }
        return {
            X: X0,
            Y: Y0,
            W: X1 - X0,
            H: Y1 - Y0
        };
    },
    Set_CalculatedFrame: function (L, T, W, H, L2, T2, W2, H2, PageIndex) {
        this.CalculatedFrame.T = T;
        this.CalculatedFrame.L = L;
        this.CalculatedFrame.W = W;
        this.CalculatedFrame.H = H;
        this.CalculatedFrame.T2 = T2;
        this.CalculatedFrame.L2 = L2;
        this.CalculatedFrame.W2 = W2;
        this.CalculatedFrame.H2 = H2;
        this.CalculatedFrame.PageIndex = PageIndex;
    },
    Get_CalculatedFrame: function () {
        return this.CalculatedFrame;
    },
    Internal_Get_FrameParagraphs: function () {
        var FrameParas = [];
        var FramePr = this.Get_FramePr();
        if (undefined === FramePr) {
            return FrameParas;
        }
        FrameParas.push(this);
        var Prev = this.Get_DocumentPrev();
        while (null != Prev) {
            if (type_Paragraph === Prev.GetType()) {
                var PrevFramePr = Prev.Get_FramePr();
                if (undefined != PrevFramePr && true === FramePr.Compare(PrevFramePr)) {
                    FrameParas.push(Prev);
                    Prev = Prev.Get_DocumentPrev();
                } else {
                    break;
                }
            } else {
                break;
            }
        }
        var Next = this.Get_DocumentNext();
        while (null != Next) {
            if (type_Paragraph === Next.GetType()) {
                var NextFramePr = Next.Get_FramePr();
                if (undefined != NextFramePr && true === FramePr.Compare(NextFramePr)) {
                    FrameParas.push(Next);
                    Next = Next.Get_DocumentNext();
                } else {
                    break;
                }
            } else {
                break;
            }
        }
        return FrameParas;
    },
    Is_LineDropCap: function () {
        var FrameParas = this.Internal_Get_FrameParagraphs();
        if (1 !== FrameParas.length || 1 !== this.Lines.length) {
            return false;
        }
        return true;
    },
    Get_LineDropCapWidth: function () {
        var W = this.Lines[0].Ranges[0].W;
        var ParaPr = this.Get_CompiledPr2(false).ParaPr;
        W += ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
        return W;
    },
    Change_Frame: function (X, Y, W, H, PageIndex) {
        var LogicDocument = editor.WordControl.m_oLogicDocument;
        var FramePr = this.Get_FramePr();
        if (undefined === FramePr || (Math.abs(Y - this.CalculatedFrame.T) < 0.001 && Math.abs(X - this.CalculatedFrame.L) < 0.001 && Math.abs(W - this.CalculatedFrame.W) < 0.001 && Math.abs(H - this.CalculatedFrame.H) < 0.001 && PageIndex === this.CalculatedFrame.PageIndex)) {
            return;
        }
        var FrameParas = this.Internal_Get_FrameParagraphs();
        if (false === LogicDocument.Document_Is_SelectionLocked(changestype_None, {
            Type: changestype_2_ElementsArray_and_Type,
            Elements: FrameParas,
            CheckType: changestype_Paragraph_Content
        })) {
            History.Create_NewPoint(historydescription_Document_ParagraphChangeFrame);
            var NewFramePr = FramePr.Copy();
            if (Math.abs(X - this.CalculatedFrame.L) > 0.001) {
                NewFramePr.X = X;
                NewFramePr.XAlign = undefined;
                NewFramePr.HAnchor = c_oAscHAnchor.Page;
            }
            if (Math.abs(Y - this.CalculatedFrame.T) > 0.001) {
                NewFramePr.Y = Y;
                NewFramePr.YAlign = undefined;
                NewFramePr.VAnchor = c_oAscVAnchor.Page;
            }
            if (Math.abs(W - this.CalculatedFrame.W) > 0.001) {
                NewFramePr.W = W;
            }
            if (Math.abs(H - this.CalculatedFrame.H) > 0.001) {
                if (undefined != FramePr.DropCap && dropcap_None != FramePr.DropCap && 1 === FrameParas.length) {
                    var PageH = this.LogicDocument.Get_PageLimits(PageIndex).YLimit;
                    var _H = Math.min(H, PageH);
                    NewFramePr.Lines = this.Update_DropCapByHeight(_H);
                    NewFramePr.HRule = linerule_Exact;
                    NewFramePr.H = H;
                } else {
                    if (H <= this.CalculatedFrame.H) {
                        NewFramePr.HRule = linerule_Exact;
                    } else {
                        NewFramePr.HRule = linerule_AtLeast;
                    }
                    NewFramePr.H = H;
                }
            }
            var Count = FrameParas.length;
            for (var Index = 0; Index < Count; Index++) {
                var Para = FrameParas[Index];
                Para.Set_FramePr(NewFramePr, false);
            }
            LogicDocument.Recalculate();
            LogicDocument.Document_UpdateInterfaceState();
            LogicDocument.Document_UpdateRulersState();
        }
    },
    Supplement_FramePr: function (FramePr) {
        if (undefined != FramePr.DropCap && dropcap_None != FramePr.DropCap) {
            var _FramePr = this.Get_FramePr();
            var FirstFramePara = this;
            var Prev = FirstFramePara.Get_DocumentPrev();
            while (null != Prev) {
                if (type_Paragraph === Prev.GetType()) {
                    var PrevFramePr = Prev.Get_FramePr();
                    if (undefined != PrevFramePr && true === _FramePr.Compare(PrevFramePr)) {
                        FirstFramePara = Prev;
                        Prev = Prev.Get_DocumentPrev();
                    } else {
                        break;
                    }
                } else {
                    break;
                }
            }
            var TextPr = FirstFramePara.Get_FirstRunPr();
            if (undefined === TextPr.RFonts || undefined === TextPr.RFonts.Ascii) {
                TextPr = this.Get_CompiledPr2(false).TextPr;
            }
            FramePr.FontFamily = {
                Name: TextPr.RFonts.Ascii.Name,
                Index: TextPr.RFonts.Ascii.Index
            };
        }
        var FrameParas = this.Internal_Get_FrameParagraphs();
        var Count = FrameParas.length;
        var ParaPr = FrameParas[0].Get_CompiledPr2(false).ParaPr.Copy();
        for (var Index = 1; Index < Count; Index++) {
            var TempPr = FrameParas[Index].Get_CompiledPr2(false).ParaPr;
            ParaPr = ParaPr.Compare(TempPr);
        }
        FramePr.Brd = ParaPr.Brd;
        FramePr.Shd = ParaPr.Shd;
    },
    Can_AddDropCap: function () {
        var Count = this.Content.length;
        for (var Pos = 0; Pos < Count; Pos++) {
            var TempRes = this.Content[Pos].Can_AddDropCap();
            if (null !== TempRes) {
                return TempRes;
            }
        }
        return false;
    },
    Get_TextForDropCap: function (DropCapText, UseContentPos, ContentPos, Depth) {
        var EndPos = (true === UseContentPos ? ContentPos.Get(Depth) : this.Content.length - 1);
        for (var Pos = 0; Pos <= EndPos; Pos++) {
            this.Content[Pos].Get_TextForDropCap(DropCapText, (true === UseContentPos && Pos === EndPos ? true : false), ContentPos, Depth + 1);
            if (true === DropCapText.Mixed && (true === DropCapText.Check || DropCapText.Runs.length > 0)) {
                return;
            }
        }
    },
    Split_DropCap: function (NewParagraph) {
        var DropCapText = new CParagraphGetDropCapText();
        if (true == this.Selection.Use && 0 === this.Parent.Selection_Is_OneElement()) {
            var SelSP = this.Get_ParaContentPos(true, true);
            var SelEP = this.Get_ParaContentPos(true, false);
            if (0 <= SelSP.Compare(SelEP)) {
                SelEP = SelSP;
            }
            DropCapText.Check = true;
            this.Get_TextForDropCap(DropCapText, true, SelEP, 0);
            DropCapText.Check = false;
            this.Get_TextForDropCap(DropCapText, true, SelEP, 0);
        } else {
            DropCapText.Mixed = true;
            DropCapText.Check = false;
            this.Get_TextForDropCap(DropCapText, false);
        }
        var Count = DropCapText.Text.length;
        var PrevRun = null;
        var CurrRun = null;
        for (var Pos = 0, ParaPos = 0, RunPos = 0; Pos < Count; Pos++) {
            if (PrevRun !== DropCapText.Runs[Pos]) {
                PrevRun = DropCapText.Runs[Pos];
                CurrRun = new ParaRun(NewParagraph);
                CurrRun.Set_Pr(DropCapText.Runs[Pos].Pr.Copy());
                NewParagraph.Internal_Content_Add(ParaPos++, CurrRun, false);
                RunPos = 0;
            }
            CurrRun.Add_ToContent(RunPos++, DropCapText.Text[Pos], false);
        }
        if (Count > 0) {
            return DropCapText.Runs[Count - 1].Get_CompiledPr(true);
        }
        return null;
    },
    Update_DropCapByLines: function (TextPr, Count, LineH, LineTA, LineTD, Before) {
        if (null === TextPr) {
            return;
        }
        this.Set_Spacing({
            Before: Before,
            After: 0,
            LineRule: linerule_Exact,
            Line: Count * LineH - 0.001
        },
        false);
        var FontSize = 72;
        TextPr.FontSize = FontSize;
        g_oTextMeasurer.SetTextPr(TextPr, this.Get_Theme());
        g_oTextMeasurer.SetFontSlot(fontslot_ASCII, 1);
        var TMetrics = {
            Ascent: null,
            Descent: null
        };
        this.private_RecalculateTextMetrics(TMetrics);
        var TDescent = TMetrics.Descent;
        var TAscent = TMetrics.Ascent;
        var THeight = 0;
        if (null === TAscent || null === TDescent) {
            THeight = g_oTextMeasurer.GetHeight();
        } else {
            THeight = -TDescent + TAscent;
        }
        var EmHeight = THeight;
        var NewEmHeight = (Count - 1) * LineH + LineTA;
        var Koef = NewEmHeight / EmHeight;
        var NewFontSize = TextPr.FontSize * Koef;
        TextPr.FontSize = parseInt(NewFontSize * 2) / 2;
        g_oTextMeasurer.SetTextPr(TextPr, this.Get_Theme());
        g_oTextMeasurer.SetFontSlot(fontslot_ASCII, 1);
        var TNewMetrics = {
            Ascent: null,
            Descent: null
        };
        this.private_RecalculateTextMetrics(TNewMetrics);
        var TNewDescent = TNewMetrics.Descent;
        var TNewAscent = TNewMetrics.Ascent;
        var TNewHeight = 0;
        if (null === TNewAscent || null === TNewDescent) {
            TNewHeight = g_oTextMeasurer.GetHeight();
        } else {
            TNewHeight = -TNewDescent + TNewAscent;
        }
        var Descent = g_oTextMeasurer.GetDescender();
        var Ascent = g_oTextMeasurer.GetAscender();
        var Dy = Descent * (LineH * Count) / (Ascent - Descent) + TNewHeight - TNewAscent + LineTD;
        var PTextPr = new ParaTextPr({
            RFonts: {
                Ascii: {
                    Name: TextPr.RFonts.Ascii.Name,
                    Index: -1
                }
            },
            FontSize: TextPr.FontSize,
            Position: Dy
        });
        this.Select_All();
        this.Add(PTextPr);
        this.Selection_Remove();
    },
    Update_DropCapByHeight: function (_Height) {
        var AnchorPara = this.Get_FrameAnchorPara();
        if (null === AnchorPara || AnchorPara.Lines.length <= 0) {
            return 1;
        }
        var Before = AnchorPara.Get_CompiledPr().ParaPr.Spacing.Before;
        var LineH = AnchorPara.Lines[0].Bottom - AnchorPara.Lines[0].Top - Before;
        var LineTA = AnchorPara.Lines[0].Metrics.TextAscent2;
        var LineTD = AnchorPara.Lines[0].Metrics.TextDescent + AnchorPara.Lines[0].Metrics.LineGap;
        var Height = _Height - Before;
        this.Set_Spacing({
            LineRule: linerule_Exact,
            Line: Height
        },
        false);
        var LinesCount = Math.ceil(Height / LineH);
        var TextPr = this.Internal_CalculateTextPr(this.Internal_GetStartPos());
        g_oTextMeasurer.SetTextPr(TextPr, this.Get_Theme());
        g_oTextMeasurer.SetFontSlot(fontslot_ASCII, 1);
        var TMetrics = {
            Ascent: null,
            Descent: null
        };
        this.private_RecalculateTextMetrics(TMetrics);
        var TDescent = TMetrics.Descent;
        var TAscent = TMetrics.Ascent;
        var THeight = 0;
        if (null === TAscent || null === TDescent) {
            THeight = g_oTextMeasurer.GetHeight();
        } else {
            THeight = -TDescent + TAscent;
        }
        var Koef = (Height - LineTD) / THeight;
        var NewFontSize = TextPr.FontSize * Koef;
        TextPr.FontSize = parseInt(NewFontSize * 2) / 2;
        g_oTextMeasurer.SetTextPr(TextPr, this.Get_Theme());
        g_oTextMeasurer.SetFontSlot(fontslot_ASCII, 1);
        var TNewMetrics = {
            Ascent: null,
            Descent: null
        };
        this.private_RecalculateTextMetrics(TNewMetrics);
        var TNewDescent = TNewMetrics.Descent;
        var TNewAscent = TNewMetrics.Ascent;
        var TNewHeight = 0;
        if (null === TNewAscent || null === TNewDescent) {
            TNewHeight = g_oTextMeasurer.GetHeight();
        } else {
            TNewHeight = -TNewDescent + TNewAscent;
        }
        var Descent = g_oTextMeasurer.GetDescender();
        var Ascent = g_oTextMeasurer.GetAscender();
        var Dy = Descent * (Height) / (Ascent - Descent) + TNewHeight - TNewAscent + LineTD;
        var PTextPr = new ParaTextPr({
            RFonts: {
                Ascii: {
                    Name: TextPr.RFonts.Ascii.Name,
                    Index: -1
                }
            },
            FontSize: TextPr.FontSize,
            Position: Dy
        });
        this.Select_All();
        this.Add(PTextPr);
        this.Selection_Remove();
        return LinesCount;
    },
    Get_FrameAnchorPara: function () {
        var FramePr = this.Get_FramePr();
        if (undefined === FramePr) {
            return null;
        }
        var Next = this.Get_DocumentNext();
        while (null != Next) {
            if (type_Paragraph === Next.GetType()) {
                var NextFramePr = Next.Get_FramePr();
                if (undefined === NextFramePr || false === FramePr.Compare(NextFramePr)) {
                    return Next;
                }
            }
            Next = Next.Get_DocumentNext();
        }
        return Next;
    },
    Split: function (NewParagraph, Pos) {
        NewParagraph.DeleteCommentOnRemove = false;
        this.DeleteCommentOnRemove = false;
        this.Selection_Remove();
        NewParagraph.Selection_Remove();
        var ContentPos = this.Get_ParaContentPos(false, false);
        var CurPos = ContentPos.Get(0);
        var TextPr = this.Get_TextPr(ContentPos);
        var NewElement = this.Content[CurPos].Split(ContentPos, 1);
        if (null === NewElement) {
            NewElement = new ParaRun(NewParagraph);
            NewElement.Set_Pr(TextPr.Copy());
        }
        var NewContent = this.Content.slice(CurPos + 1);
        this.Internal_Content_Remove2(CurPos + 1, this.Content.length - CurPos - 1);
        var EndRun = new ParaRun(this);
        EndRun.Add_ToContent(0, new ParaEnd());
        this.Internal_Content_Add(this.Content.length, EndRun);
        NewParagraph.Internal_Content_Remove2(0, NewParagraph.Content.length);
        NewParagraph.Internal_Content_Concat(NewContent);
        NewParagraph.Internal_Content_Add(0, NewElement);
        NewParagraph.Correct_Content();
        NewParagraph.TextPr.Value = this.TextPr.Value.Copy();
        this.CopyPr(NewParagraph);
        var SectPr = this.Get_SectionPr();
        if (undefined !== SectPr) {
            this.Set_SectionPr(undefined);
            NewParagraph.Set_SectionPr(SectPr);
        }
        this.Cursor_MoveToEndPos(false, false);
        NewParagraph.Cursor_MoveToStartPos(false);
        NewParagraph.DeleteCommentOnRemove = true;
        this.DeleteCommentOnRemove = true;
    },
    Concat: function (Para) {
        this.DeleteCommentOnRemove = false;
        Para.DeleteCommentOnRemove = false;
        this.Remove_ParaEnd();
        var NearPosCount = Para.NearPosArray.length;
        for (var Pos = 0; Pos < NearPosCount; Pos++) {
            var ParaNearPos = Para.NearPosArray[Pos];
            ParaNearPos.Classes[0] = this;
            ParaNearPos.NearPos.Paragraph = this;
            ParaNearPos.NearPos.ContentPos.Data[0] += this.Content.length;
            this.NearPosArray.push(ParaNearPos);
        }
        var NewContent = Para.Content.slice(0);
        this.Internal_Content_Concat(NewContent);
        Para.Internal_Content_Remove2(0, Para.Content.length);
        this.Set_SectionPr(undefined);
        var SectPr = Para.Get_SectionPr();
        if (undefined !== SectPr) {
            Para.Set_SectionPr(undefined);
            this.Set_SectionPr(SectPr);
        }
        this.DeleteCommentOnRemove = true;
        Para.DeleteCommentOnRemove = true;
    },
    Continue: function (NewParagraph) {
        this.CopyPr(NewParagraph);
        var TextPr;
        if (this.bFromDocument) {
            TextPr = this.Get_TextPr(this.Get_EndPos(false));
        } else {
            TextPr = this.Get_TextPr(this.Get_EndPos2(false));
        }
        NewParagraph.Internal_Content_Add(0, new ParaRun(NewParagraph));
        NewParagraph.Correct_Content();
        NewParagraph.Cursor_MoveToStartPos(false);
        for (var Pos = 0, Count = NewParagraph.Content.length; Pos < Count; Pos++) {
            if (para_Run === NewParagraph.Content[Pos].Type) {
                NewParagraph.Content[Pos].Set_Pr(TextPr.Copy());
            }
        }
        NewParagraph.TextPr.Value = this.TextPr.Value.Copy();
    },
    Undo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_Paragraph_AddItem:
            var StartPos = Data.Pos;
            var EndPos = Data.EndPos;
            this.Content.splice(StartPos, EndPos - StartPos + 1);
            break;
        case historyitem_Paragraph_RemoveItem:
            var Pos = Data.Pos;
            var Array_start = this.Content.slice(0, Pos);
            var Array_end = this.Content.slice(Pos);
            this.Content = Array_start.concat(Data.Items, Array_end);
            break;
        case historyitem_Paragraph_Numbering:
            var Old = Data.Old;
            if (undefined != Old) {
                this.Pr.NumPr = Old;
            } else {
                this.Pr.NumPr = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Align:
            this.Pr.Jc = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Ind_First:
            if (undefined === this.Pr.Ind) {
                this.Pr.Ind = new CParaSpacing();
            }
            this.Pr.Ind.FirstLine = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Ind_Left:
            if (undefined === this.Pr.Ind) {
                this.Pr.Ind = new CParaSpacing();
            }
            this.Pr.Ind.Left = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Ind_Right:
            if (undefined === this.Pr.Ind) {
                this.Pr.Ind = new CParaSpacing();
            }
            this.Pr.Ind.Right = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_ContextualSpacing:
            this.Pr.ContextualSpacing = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_KeepLines:
            this.Pr.KeepLines = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_KeepNext:
            this.Pr.KeepNext = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_PageBreakBefore:
            this.Pr.PageBreakBefore = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_Line:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.Line = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_LineRule:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.LineRule = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_Before:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.Before = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_After:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.After = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_AfterAutoSpacing:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.AfterAutoSpacing = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_BeforeAutoSpacing:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.BeforeAutoSpacing = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Shd_Value:
            if (undefined != Data.Old && undefined === this.Pr.Shd) {
                this.Pr.Shd = new CDocumentShd();
            }
            if (undefined != Data.Old) {
                this.Pr.Shd.Value = Data.Old;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Shd_Color:
            if (undefined != Data.Old && undefined === this.Pr.Shd) {
                this.Pr.Shd = new CDocumentShd();
            }
            if (undefined != Data.Old) {
                this.Pr.Shd.Color = Data.Old;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Shd_Unifill:
            if (undefined != Data.Old && undefined === this.Pr.Shd) {
                this.Pr.Shd = new CDocumentShd();
            }
            if (undefined != Data.Old) {
                this.Pr.Shd.Unifill = Data.Old;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Shd:
            this.Pr.Shd = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_WidowControl:
            this.Pr.WidowControl = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Tabs:
            this.Pr.Tabs = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_PStyle:
            var Old = Data.Old;
            if (undefined != Old) {
                this.Pr.PStyle = Old;
            } else {
                this.Pr.PStyle = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            this.Recalc_RunsCompiledPr();
            break;
        case historyitem_Paragraph_DocNext:
            this.Next = Data.Old;
            break;
        case historyitem_Paragraph_DocPrev:
            this.Prev = Data.Old;
            break;
        case historyitem_Paragraph_Parent:
            this.Parent = Data.Old;
            break;
        case historyitem_Paragraph_Borders_Between:
            this.Pr.Brd.Between = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Bottom:
            this.Pr.Brd.Bottom = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Left:
            this.Pr.Brd.Left = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Right:
            this.Pr.Brd.Right = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Top:
            this.Pr.Brd.Top = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Pr:
            var Old = Data.Old;
            if (undefined != Old) {
                this.Pr = Old;
            } else {
                this.Pr = new CParaPr();
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_PresentationPr_Bullet:
            this.Pr.Bullet = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_PresentationPr_Level:
            this.Pr.Lvl = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            this.Recalc_RunsCompiledPr();
            break;
        case historyitem_Paragraph_FramePr:
            this.Pr.FramePr = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_SectionPr:
            this.SectPr = Data.Old;
            this.LogicDocument.Update_SectionsInfo();
            break;
        }
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
        this.RecalcInfo.Set_Type_0_Spell(pararecalc_0_Spell_All);
    },
    Redo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_Paragraph_AddItem:
            var Pos = Data.Pos;
            var Array_start = this.Content.slice(0, Pos);
            var Array_end = this.Content.slice(Pos);
            this.Content = Array_start.concat(Data.Items, Array_end);
            break;
        case historyitem_Paragraph_RemoveItem:
            var StartPos = Data.Pos;
            var EndPos = Data.EndPos;
            this.Content.splice(StartPos, EndPos - StartPos + 1);
            break;
        case historyitem_Paragraph_Numbering:
            var New = Data.New;
            if (undefined != New) {
                this.Pr.NumPr = New;
            } else {
                this.Pr.NumPr = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Align:
            this.Pr.Jc = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Ind_First:
            if (undefined === this.Pr.Ind) {
                this.Pr.Ind = new CParaInd();
            }
            this.Pr.Ind.FirstLine = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Ind_Left:
            if (undefined === this.Pr.Ind) {
                this.Pr.Ind = new CParaInd();
            }
            this.Pr.Ind.Left = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Ind_Right:
            if (undefined === this.Pr.Ind) {
                this.Pr.Ind = new CParaInd();
            }
            this.Pr.Ind.Right = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_ContextualSpacing:
            this.Pr.ContextualSpacing = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_KeepLines:
            this.Pr.KeepLines = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_KeepNext:
            this.Pr.KeepNext = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_PageBreakBefore:
            this.Pr.PageBreakBefore = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_Line:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.Line = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_LineRule:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.LineRule = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_Before:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.Before = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_After:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.After = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_AfterAutoSpacing:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.AfterAutoSpacing = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_BeforeAutoSpacing:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.BeforeAutoSpacing = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Shd_Value:
            if (undefined != Data.New && undefined === this.Pr.Shd) {
                this.Pr.Shd = new CDocumentShd();
            }
            if (undefined != Data.New) {
                this.Pr.Shd.Value = Data.New;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Shd_Color:
            if (undefined != Data.New && undefined === this.Pr.Shd) {
                this.Pr.Shd = new CDocumentShd();
            }
            if (undefined != Data.New) {
                this.Pr.Shd.Color = Data.New;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Shd_Unifill:
            if (undefined != Data.New && undefined === this.Pr.Shd) {
                this.Pr.Shd = new CDocumentShd();
            }
            if (undefined != Data.New) {
                this.Pr.Shd.Unifill = Data.New;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Shd:
            this.Pr.Shd = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_WidowControl:
            this.Pr.WidowControl = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Tabs:
            this.Pr.Tabs = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_PStyle:
            var New = Data.New;
            if (undefined != New) {
                this.Pr.PStyle = New;
            } else {
                this.Pr.PStyle = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            this.Recalc_RunsCompiledPr();
            break;
        case historyitem_Paragraph_DocNext:
            this.Next = Data.New;
            break;
        case historyitem_Paragraph_DocPrev:
            this.Prev = Data.New;
            break;
        case historyitem_Paragraph_Parent:
            this.Parent = Data.New;
            break;
        case historyitem_Paragraph_Borders_Between:
            this.Pr.Brd.Between = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Bottom:
            this.Pr.Brd.Bottom = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Left:
            this.Pr.Brd.Left = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Right:
            this.Pr.Brd.Right = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Top:
            this.Pr.Brd.Top = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Pr:
            var New = Data.New;
            if (undefined != New) {
                this.Pr = New;
            } else {
                this.Pr = new CParaPr();
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_PresentationPr_Bullet:
            this.Pr.Bullet = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_PresentationPr_Level:
            this.Pr.Lvl = Data.New;
            this.CompiledPr.NeedRecalc = true;
            this.Recalc_RunsCompiledPr();
            break;
        case historyitem_Paragraph_FramePr:
            this.Pr.FramePr = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_SectionPr:
            this.SectPr = Data.New;
            this.LogicDocument.Update_SectionsInfo();
            break;
        }
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
        this.RecalcInfo.Set_Type_0_Spell(pararecalc_0_Spell_All);
    },
    Get_SelectionState: function () {
        var ParaState = {};
        ParaState.CurPos = {
            X: this.CurPos.X,
            Y: this.CurPos.Y,
            Line: this.CurPos.Line,
            ContentPos: this.Get_ParaContentPos(false, false),
            RealX: this.CurPos.RealX,
            RealY: this.CurPos.RealY,
            PagesPos: this.CurPos.PagesPos
        };
        ParaState.Selection = {
            Start: this.Selection.Start,
            Use: this.Selection.Use,
            StartPos: 0,
            EndPos: 0,
            Flag: this.Selection.Flag
        };
        if (true === this.Selection.Use) {
            ParaState.Selection.StartPos = this.Get_ParaContentPos(true, true);
            ParaState.Selection.EndPos = this.Get_ParaContentPos(true, false);
        }
        return [ParaState];
    },
    Set_SelectionState: function (State, StateIndex) {
        if (State.length <= 0) {
            return;
        }
        var ParaState = State[StateIndex];
        this.CurPos.X = ParaState.CurPos.X;
        this.CurPos.Y = ParaState.CurPos.Y;
        this.CurPos.Line = ParaState.CurPos.Line;
        this.CurPos.RealX = ParaState.CurPos.RealX;
        this.CurPos.RealY = ParaState.CurPos.RealY;
        this.CurPos.PagesPos = ParaState.CurPos.PagesPos;
        this.Set_ParaContentPos(ParaState.CurPos.ContentPos, true, -1, -1);
        this.Selection_Remove();
        this.Selection.Start = ParaState.Selection.Start;
        this.Selection.Use = ParaState.Selection.Use;
        this.Selection.Flag = ParaState.Selection.Flag;
        if (true === this.Selection.Use) {
            this.Set_SelectionContentPos(ParaState.Selection.StartPos, ParaState.Selection.EndPos);
        }
    },
    Get_ParentObject_or_DocumentPos: function () {
        this.Parent.Update_ConentIndexing();
        return this.Parent.Get_ParentObject_or_DocumentPos(this.Index);
    },
    Refresh_RecalcData: function (Data) {
        var Type = Data.Type;
        var bNeedRecalc = false;
        var CurPage = 0;
        switch (Type) {
        case historyitem_Paragraph_AddItem:
            case historyitem_Paragraph_RemoveItem:
            for (CurPage = this.Pages.length - 1; CurPage > 0; CurPage--) {
                if (Data.Pos > this.Lines[this.Pages[CurPage].StartLine].Get_StartPos()) {
                    break;
                }
            }
            this.RecalcInfo.Set_Type_0(pararecalc_0_All);
            bNeedRecalc = true;
            break;
        case historyitem_Paragraph_Numbering:
            case historyitem_Paragraph_PStyle:
            case historyitem_Paragraph_Pr:
            case historyitem_Paragraph_PresentationPr_Bullet:
            case historyitem_Paragraph_PresentationPr_Level:
            this.RecalcInfo.Set_Type_0(pararecalc_0_All);
            bNeedRecalc = true;
            break;
        case historyitem_Paragraph_Align:
            case historyitem_Paragraph_Ind_First:
            case historyitem_Paragraph_Ind_Left:
            case historyitem_Paragraph_Ind_Right:
            case historyitem_Paragraph_ContextualSpacing:
            case historyitem_Paragraph_KeepLines:
            case historyitem_Paragraph_KeepNext:
            case historyitem_Paragraph_PageBreakBefore:
            case historyitem_Paragraph_Spacing_Line:
            case historyitem_Paragraph_Spacing_LineRule:
            case historyitem_Paragraph_Spacing_Before:
            case historyitem_Paragraph_Spacing_After:
            case historyitem_Paragraph_Spacing_AfterAutoSpacing:
            case historyitem_Paragraph_Spacing_BeforeAutoSpacing:
            case historyitem_Paragraph_WidowControl:
            case historyitem_Paragraph_Tabs:
            case historyitem_Paragraph_Parent:
            case historyitem_Paragraph_Borders_Between:
            case historyitem_Paragraph_Borders_Bottom:
            case historyitem_Paragraph_Borders_Left:
            case historyitem_Paragraph_Borders_Right:
            case historyitem_Paragraph_Borders_Top:
            case historyitem_Paragraph_FramePr:
            bNeedRecalc = true;
            break;
        case historyitem_Paragraph_Shd_Value:
            case historyitem_Paragraph_Shd_Color:
            case historyitem_Paragraph_Shd_Unifill:
            case historyitem_Paragraph_Shd:
            case historyitem_Paragraph_DocNext:
            case historyitem_Paragraph_DocPrev:
            break;
        }
        if (true === bNeedRecalc) {
            var Prev = this.Get_DocumentPrev();
            if (0 === CurPage && null != Prev && type_Paragraph === Prev.GetType() && true === Prev.Get_CompiledPr2(false).ParaPr.KeepNext) {
                Prev.Refresh_RecalcData2(Prev.Pages.length - 1);
            }
            return this.Refresh_RecalcData2(CurPage);
        }
    },
    Refresh_RecalcData2: function (CurPage) {
        if (undefined === CurPage) {
            CurPage = 0;
        }
        if (this.Index >= 0) {
            this.Parent.Refresh_RecalcData2(this.Index, this.PageNum + CurPage);
        }
    },
    Save_Changes: function (Data, Writer) {
        Writer.WriteLong(historyitem_type_Paragraph);
        var Type = Data.Type;
        Writer.WriteLong(Type);
        switch (Type) {
        case historyitem_Paragraph_AddItem:
            var bArray = Data.UseArray;
            var Count = Data.Items.length;
            Writer.WriteLong(Count);
            for (var Index = 0; Index < Count; Index++) {
                if (true === bArray) {
                    Writer.WriteLong(Data.PosArray[Index]);
                } else {
                    Writer.WriteLong(Data.Pos + Index);
                }
                Writer.WriteString2(Data.Items[Index].Get_Id());
            }
            break;
        case historyitem_Paragraph_RemoveItem:
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
        case historyitem_Paragraph_Numbering:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Data.New.Write_ToBinary(Writer);
            }
            break;
        case historyitem_Paragraph_Ind_First:
            case historyitem_Paragraph_Ind_Left:
            case historyitem_Paragraph_Ind_Right:
            case historyitem_Paragraph_Spacing_Line:
            case historyitem_Paragraph_Spacing_Before:
            case historyitem_Paragraph_Spacing_After:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Writer.WriteDouble(Data.New);
            }
            break;
        case historyitem_Paragraph_Align:
            case historyitem_Paragraph_Spacing_LineRule:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Writer.WriteLong(Data.New);
            }
            break;
        case historyitem_Paragraph_ContextualSpacing:
            case historyitem_Paragraph_KeepLines:
            case historyitem_Paragraph_KeepNext:
            case historyitem_Paragraph_PageBreakBefore:
            case historyitem_Paragraph_Spacing_AfterAutoSpacing:
            case historyitem_Paragraph_Spacing_BeforeAutoSpacing:
            case historyitem_Paragraph_WidowControl:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Writer.WriteBool(Data.New);
            }
            break;
        case historyitem_Paragraph_Shd_Value:
            var New = Data.New;
            if (undefined != New) {
                Writer.WriteBool(false);
                Writer.WriteByte(Data.New);
            } else {
                Writer.WriteBool(true);
            }
            break;
        case historyitem_Paragraph_Shd_Color:
            case historyitem_Paragraph_Shd_Unifill:
            var New = Data.New;
            if (undefined != New) {
                Writer.WriteBool(false);
                Data.New.Write_ToBinary(Writer);
            } else {
                Writer.WriteBool(true);
            }
            break;
        case historyitem_Paragraph_Shd:
            var New = Data.New;
            if (undefined != New) {
                Writer.WriteBool(false);
                Data.New.Write_ToBinary(Writer);
            } else {
                Writer.WriteBool(true);
            }
            break;
        case historyitem_Paragraph_Tabs:
            if (undefined != Data.New) {
                Writer.WriteBool(false);
                Data.New.Write_ToBinary(Writer);
            } else {
                Writer.WriteBool(true);
            }
            break;
        case historyitem_Paragraph_PStyle:
            if (undefined != Data.New) {
                Writer.WriteBool(false);
                Writer.WriteString2(Data.New);
            } else {
                Writer.WriteBool(true);
            }
            break;
        case historyitem_Paragraph_DocNext:
            case historyitem_Paragraph_DocPrev:
            case historyitem_Paragraph_Parent:
            break;
        case historyitem_Paragraph_Borders_Between:
            case historyitem_Paragraph_Borders_Bottom:
            case historyitem_Paragraph_Borders_Left:
            case historyitem_Paragraph_Borders_Right:
            case historyitem_Paragraph_Borders_Top:
            if (undefined != Data.New) {
                Writer.WriteBool(false);
                Data.New.Write_ToBinary(Writer);
            } else {
                Writer.WriteBool(true);
            }
            break;
        case historyitem_Paragraph_Pr:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Data.New.Write_ToBinary(Writer);
            }
            break;
        case historyitem_Paragraph_PresentationPr_Bullet:
            if (Data.New) {
                Writer.WriteBool(true);
                Data.New.Write_ToBinary(Writer);
            } else {
                Writer.WriteBool(false);
            }
            break;
        case historyitem_Paragraph_PresentationPr_Level:
            Writer.WriteLong(Data.New);
            break;
        case historyitem_Paragraph_FramePr:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Data.New.Write_ToBinary(Writer);
            }
            break;
        case historyitem_Paragraph_SectionPr:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Writer.WriteString2(Data.New.Get_Id());
            }
            break;
        }
        return Writer;
    },
    Load_Changes: function (Reader) {
        var ClassType = Reader.GetLong();
        if (historyitem_type_Paragraph != ClassType) {
            return;
        }
        var Type = Reader.GetLong();
        switch (Type) {
        case historyitem_Paragraph_AddItem:
            var Count = Reader.GetLong();
            for (var Index = 0; Index < Count; Index++) {
                var Pos = this.m_oContentChanges.Check(contentchanges_Add, Reader.GetLong());
                var Element = g_oTableId.Get_ById(Reader.GetString2());
                if (null != Element) {
                    if (para_Comment === Element.Type) {
                        var Comment = g_oTableId.Get_ById(Element.CommentId);
                        if (null != Comment && Comment instanceof CComment) {
                            if (true === Element.Start) {
                                Comment.Set_StartId(this.Get_Id());
                            } else {
                                Comment.Set_EndId(this.Get_Id());
                            }
                        }
                        Element.Set_Paragraph(this);
                    }
                    this.Content.splice(Pos, 0, Element);
                    if (Element.Recalc_RunsCompiledPr) {
                        Element.Recalc_RunsCompiledPr();
                    }
                }
            }
            this.private_ResetSelection();
            break;
        case historyitem_Paragraph_RemoveItem:
            var Count = Reader.GetLong();
            for (var Index = 0; Index < Count; Index++) {
                var ChangesPos = this.m_oContentChanges.Check(contentchanges_Remove, Reader.GetLong());
                if (false === ChangesPos) {
                    continue;
                }
                this.Content.splice(ChangesPos, 1);
            }
            this.private_ResetSelection();
            break;
        case historyitem_Paragraph_Numbering:
            if (true === Reader.GetBool()) {
                this.Pr.NumPr = undefined;
            } else {
                this.Pr.NumPr = new CNumPr();
                this.Pr.NumPr.Read_FromBinary(Reader);
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Align:
            if (true === Reader.GetBool()) {
                this.Pr.Jc = undefined;
            } else {
                this.Pr.Jc = Reader.GetLong();
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Ind_First:
            if (undefined === this.Pr.Ind) {
                this.Pr.Ind = new CParaInd();
            }
            if (true === Reader.GetBool()) {
                this.Pr.Ind.FirstLine = undefined;
            } else {
                this.Pr.Ind.FirstLine = Reader.GetDouble();
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Ind_Left:
            if (undefined === this.Pr.Ind) {
                this.Pr.Ind = new CParaInd();
            }
            if (true === Reader.GetBool()) {
                this.Pr.Ind.Left = undefined;
            } else {
                this.Pr.Ind.Left = Reader.GetDouble();
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Ind_Right:
            if (undefined === this.Pr.Ind) {
                this.Pr.Ind = new CParaInd();
            }
            if (true === Reader.GetBool()) {
                this.Pr.Ind.Right = undefined;
            } else {
                this.Pr.Ind.Right = Reader.GetDouble();
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_ContextualSpacing:
            if (true === Reader.GetBool()) {
                this.Pr.ContextualSpacing = undefined;
            } else {
                this.Pr.ContextualSpacing = Reader.GetBool();
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_KeepLines:
            if (false === Reader.GetBool()) {
                this.Pr.KeepLines = Reader.GetBool();
            } else {
                this.Pr.KeepLines = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_KeepNext:
            if (false === Reader.GetBool()) {
                this.Pr.KeepNext = Reader.GetBool();
            } else {
                this.Pr.KeepNext = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_PageBreakBefore:
            if (false === Reader.GetBool()) {
                this.Pr.PageBreakBefore = Reader.GetBool();
            } else {
                this.Pr.PageBreakBefore = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_Line:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            if (false === Reader.GetBool()) {
                this.Pr.Spacing.Line = Reader.GetDouble();
            } else {
                this.Pr.Spacing.Line = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_LineRule:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            if (false === Reader.GetBool()) {
                this.Pr.Spacing.LineRule = Reader.GetLong();
            } else {
                this.Pr.Spacing.LineRule = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_Before:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            if (false === Reader.GetBool()) {
                this.Pr.Spacing.Before = Reader.GetDouble();
            } else {
                this.Pr.Spacing.Before = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_After:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            if (false === Reader.GetBool()) {
                this.Pr.Spacing.After = Reader.GetDouble();
            } else {
                this.Pr.Spacing.After = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_AfterAutoSpacing:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            if (false === Reader.GetBool()) {
                this.Pr.Spacing.AfterAutoSpacing = Reader.GetBool();
            } else {
                this.Pr.Spacing.AfterAutoSpacing = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_BeforeAutoSpacing:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            if (false === Reader.GetBool()) {
                this.Pr.Spacing.AfterAutoSpacing = Reader.GetBool();
            } else {
                this.Pr.Spacing.BeforeAutoSpacing = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Shd_Value:
            if (false === Reader.GetBool()) {
                if (undefined === this.Pr.Shd) {
                    this.Pr.Shd = new CDocumentShd();
                }
                this.Pr.Shd.Value = Reader.GetByte();
            } else {
                if (undefined != this.Pr.Shd) {
                    this.Pr.Shd.Value = undefined;
                }
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Shd_Color:
            if (false === Reader.GetBool()) {
                if (undefined === this.Pr.Shd) {
                    this.Pr.Shd = new CDocumentShd();
                }
                this.Pr.Shd.Color = new CDocumentColor(0, 0, 0);
                this.Pr.Shd.Color.Read_FromBinary(Reader);
            } else {
                if (undefined != this.Pr.Shd) {
                    this.Pr.Shd.Color = undefined;
                }
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Shd_Unifill:
            if (false === Reader.GetBool()) {
                if (undefined === this.Pr.Shd) {
                    this.Pr.Shd = new CDocumentShd();
                }
                this.Pr.Shd.Unifill = new CUniFill();
                this.Pr.Shd.Unifill.Read_FromBinary(Reader);
            } else {
                if (undefined != this.Pr.Shd) {
                    this.Pr.Shd.Unifill = undefined;
                }
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Shd:
            if (false === Reader.GetBool()) {
                this.Pr.Shd = new CDocumentShd();
                this.Pr.Shd.Read_FromBinary(Reader);
            } else {
                this.Pr.Shd = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_WidowControl:
            if (false === Reader.GetBool()) {
                this.Pr.WidowControl = Reader.GetBool();
            } else {
                this.Pr.WidowControl = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Tabs:
            if (false === Reader.GetBool()) {
                this.Pr.Tabs = new CParaTabs();
                this.Pr.Tabs.Read_FromBinary(Reader);
            } else {
                this.Pr.Tabs = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_PStyle:
            if (false === Reader.GetBool()) {
                this.Pr.PStyle = Reader.GetString2();
            } else {
                this.Pr.PStyle = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            this.Recalc_RunsCompiledPr();
            break;
        case historyitem_Paragraph_DocNext:
            break;
        case historyitem_Paragraph_DocPrev:
            break;
        case historyitem_Paragraph_Parent:
            break;
        case historyitem_Paragraph_Borders_Between:
            if (false === Reader.GetBool()) {
                this.Pr.Brd.Between = new CDocumentBorder();
                this.Pr.Brd.Between.Read_FromBinary(Reader);
            } else {
                this.Pr.Brd.Between = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Bottom:
            if (false === Reader.GetBool()) {
                this.Pr.Brd.Bottom = new CDocumentBorder();
                this.Pr.Brd.Bottom.Read_FromBinary(Reader);
            } else {
                this.Pr.Brd.Bottom = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Left:
            if (false === Reader.GetBool()) {
                this.Pr.Brd.Left = new CDocumentBorder();
                this.Pr.Brd.Left.Read_FromBinary(Reader);
            } else {
                this.Pr.Brd.Left = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Right:
            if (false === Reader.GetBool()) {
                this.Pr.Brd.Right = new CDocumentBorder();
                this.Pr.Brd.Right.Read_FromBinary(Reader);
            } else {
                this.Pr.Brd.Right = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Top:
            if (false === Reader.GetBool()) {
                this.Pr.Brd.Top = new CDocumentBorder();
                this.Pr.Brd.Top.Read_FromBinary(Reader);
            } else {
                this.Pr.Brd.Top = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Pr:
            if (true === Reader.GetBool()) {
                this.Pr = new CParaPr();
            } else {
                this.Pr = new CParaPr();
                this.Pr.Read_FromBinary(Reader);
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_PresentationPr_Bullet:
            if (Reader.GetBool()) {
                this.Pr.Bullet = new CBullet();
                this.Pr.Bullet.Read_FromBinary(Reader);
            } else {
                this.Pr.Bullet = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_PresentationPr_Level:
            this.Pr.Lvl = Reader.GetLong();
            this.CompiledPr.NeedRecalc = true;
            this.Recalc_RunsCompiledPr();
            break;
        case historyitem_Paragraph_FramePr:
            if (false === Reader.GetBool()) {
                this.Pr.FramePr = new CFramePr();
                this.Pr.FramePr.Read_FromBinary(Reader);
            } else {
                this.Pr.FramePr = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_SectionPr:
            this.SectPr = (true === Reader.GetBool() ? undefined : g_oTableId.Get_ById(Reader.GetString2()));
            this.LogicDocument.Update_SectionsInfo();
            break;
        }
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
        this.RecalcInfo.Set_Type_0_Spell(pararecalc_0_Spell_All);
    },
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(historyitem_type_Paragraph);
        Writer.WriteString2("" + this.Id);
        var PrForWrite, TextPrForWrite;
        if (this.StartState) {
            PrForWrite = this.StartState.Pr;
            TextPrForWrite = this.StartState.TextPr;
        } else {
            PrForWrite = this.Pr;
            TextPrForWrite = this.TextPr;
        }
        PrForWrite.Write_ToBinary(Writer);
        Writer.WriteString2("" + TextPrForWrite.Get_Id());
        var Count = this.Content.length;
        Writer.WriteLong(Count);
        for (var Index = 0; Index < Count; Index++) {
            Writer.WriteString2("" + this.Content[Index].Get_Id());
        }
        Writer.WriteBool(this.bFromDocument);
    },
    Read_FromBinary2: function (Reader) {
        this.Id = Reader.GetString2();
        this.Pr = new CParaPr();
        this.Pr.Read_FromBinary(Reader);
        this.TextPr = g_oTableId.Get_ById(Reader.GetString2());
        this.Content = [];
        var Count = Reader.GetLong();
        for (var Index = 0; Index < Count; Index++) {
            var Element = g_oTableId.Get_ById(Reader.GetString2());
            if (null != Element) {
                this.Content.push(Element);
            }
        }
        CollaborativeEditing.Add_NewObject(this);
        this.bFromDocument = Reader.GetBool();
        if (!this.bFromDocument) {
            this.Numbering = new ParaPresentationNumbering();
        }
        if (this.bFromDocument || (editor && editor.WordControl && editor.WordControl.m_oDrawingDocument)) {
            var DrawingDocument = editor.WordControl.m_oDrawingDocument;
            if (undefined !== DrawingDocument && null !== DrawingDocument) {
                this.DrawingDocument = DrawingDocument;
                this.LogicDocument = this.bFromDocument ? this.DrawingDocument.m_oLogicDocument : null;
            }
        } else {
            CollaborativeEditing.Add_LinkData(this, {});
        }
    },
    Load_LinkData: function (LinkData) {
        if (this.Parent && this.Parent.Parent && this.Parent.Parent.getDrawingDocument) {
            this.DrawingDocument = this.Parent.Parent.getDrawingDocument();
        }
    },
    Clear_CollaborativeMarks: function () {},
    Get_SelectionState2: function () {
        var ParaState = {};
        ParaState.Id = this.Get_Id();
        ParaState.CurPos = {
            X: this.CurPos.X,
            Y: this.CurPos.Y,
            Line: this.CurPos.Line,
            ContentPos: this.Get_ParaContentPos(false, false),
            RealX: this.CurPos.RealX,
            RealY: this.CurPos.RealY,
            PagesPos: this.CurPos.PagesPos
        };
        ParaState.Selection = {
            Start: this.Selection.Start,
            Use: this.Selection.Use,
            StartPos: 0,
            EndPos: 0,
            Flag: this.Selection.Flag
        };
        if (true === this.Selection.Use) {
            ParaState.Selection.StartPos = this.Get_ParaContentPos(true, true);
            ParaState.Selection.EndPos = this.Get_ParaContentPos(true, false);
        }
        return ParaState;
    },
    Set_SelectionState2: function (ParaState) {
        this.CurPos.X = ParaState.CurPos.X;
        this.CurPos.Y = ParaState.CurPos.Y;
        this.CurPos.Line = ParaState.CurPos.Line;
        this.CurPos.RealX = ParaState.CurPos.RealX;
        this.CurPos.RealY = ParaState.CurPos.RealY;
        this.CurPos.PagesPos = ParaState.CurPos.PagesPos;
        this.Set_ParaContentPos(ParaState.CurPos.ContentPos, true, -1, -1);
        this.Selection_Remove();
        this.Selection.Start = ParaState.Selection.Start;
        this.Selection.Use = ParaState.Selection.Use;
        this.Selection.Flag = ParaState.Selection.Flag;
        if (true === this.Selection.Use) {
            this.Set_SelectionContentPos(ParaState.Selection.StartPos, ParaState.Selection.EndPos);
        }
    },
    Add_Comment: function (Comment, bStart, bEnd) {
        if (true == this.ApplyToAll) {
            if (true === bEnd) {
                var EndContentPos = this.Get_EndPos(false);
                var CommentEnd = new ParaComment(false, Comment.Get_Id());
                var EndPos = EndContentPos.Get(0);
                if (para_Run === this.Content[EndPos].Type) {
                    var NewElement = this.Content[EndPos].Split(EndContentPos, 1);
                    if (null !== NewElement) {
                        this.Internal_Content_Add(EndPos + 1, NewElement);
                    }
                }
                this.Internal_Content_Add(EndPos + 1, CommentEnd);
            }
            if (true === bStart) {
                var StartContentPos = this.Get_StartPos();
                var CommentStart = new ParaComment(true, Comment.Get_Id());
                var StartPos = StartContentPos.Get(0);
                if (para_Run === this.Content[StartPos].Type) {
                    var NewElement = this.Content[StartPos].Split(StartContentPos, 1);
                    if (null !== NewElement) {
                        this.Internal_Content_Add(StartPos + 1, NewElement);
                    }
                    this.Internal_Content_Add(StartPos + 1, CommentStart);
                } else {
                    this.Internal_Content_Add(StartPos, CommentStart);
                }
            }
        } else {
            if (true === this.Selection.Use) {
                var StartContentPos = this.Get_ParaContentPos(true, true);
                var EndContentPos = this.Get_ParaContentPos(true, false);
                if (StartContentPos.Compare(EndContentPos) > 0) {
                    var Temp = StartContentPos;
                    StartContentPos = EndContentPos;
                    EndContentPos = Temp;
                }
                if (true === bEnd) {
                    var CommentEnd = new ParaComment(false, Comment.Get_Id());
                    var EndPos = EndContentPos.Get(0);
                    if (para_Run === this.Content[EndPos].Type) {
                        var NewElement = this.Content[EndPos].Split(EndContentPos, 1);
                        if (null !== NewElement) {
                            this.Internal_Content_Add(EndPos + 1, NewElement);
                        }
                    }
                    this.Internal_Content_Add(EndPos + 1, CommentEnd);
                    this.Selection.EndPos = EndPos + 1;
                }
                if (true === bStart) {
                    var CommentStart = new ParaComment(true, Comment.Get_Id());
                    var StartPos = StartContentPos.Get(0);
                    if (para_Run === this.Content[StartPos].Type) {
                        var NewElement = this.Content[StartPos].Split(StartContentPos, 1);
                        if (null !== NewElement) {
                            this.Internal_Content_Add(StartPos + 1, NewElement);
                            NewElement.Select_All();
                        }
                        this.Internal_Content_Add(StartPos + 1, CommentStart);
                        this.Selection.StartPos = StartPos + 1;
                    } else {
                        this.Internal_Content_Add(StartPos, CommentStart);
                        this.Selection.StartPos = StartPos;
                    }
                }
            } else {
                var ContentPos = this.Get_ParaContentPos(false, false);
                if (true === bEnd) {
                    var CommentEnd = new ParaComment(false, Comment.Get_Id());
                    var EndPos = ContentPos.Get(0);
                    if (para_Run === this.Content[EndPos].Type) {
                        var NewElement = this.Content[EndPos].Split(ContentPos, 1);
                        if (null !== NewElement) {
                            this.Internal_Content_Add(EndPos + 1, NewElement);
                        }
                    }
                    this.Internal_Content_Add(EndPos + 1, CommentEnd);
                }
                if (true === bStart) {
                    var CommentStart = new ParaComment(true, Comment.Get_Id());
                    var StartPos = ContentPos.Get(0);
                    if (para_Run === this.Content[StartPos].Type) {
                        var NewElement = this.Content[StartPos].Split(ContentPos, 1);
                        if (null !== NewElement) {
                            this.Internal_Content_Add(StartPos + 1, NewElement);
                        }
                        this.Internal_Content_Add(StartPos + 1, CommentStart);
                    } else {
                        this.Internal_Content_Add(StartPos, CommentStart);
                    }
                }
            }
        }
        this.Correct_Content();
    },
    Add_Comment2: function (Comment, ObjectId) {},
    CanAdd_Comment: function () {
        if (true === this.Selection.Use && true != this.Selection_IsEmpty()) {
            return true;
        }
        return false;
    },
    Remove_CommentMarks: function (Id) {
        var Count = this.Content.length;
        for (var Pos = 0; Pos < Count; Pos++) {
            var Item = this.Content[Pos];
            if (para_Comment === Item.Type && Id === Item.CommentId) {
                this.Internal_Content_Remove(Pos);
                Pos--;
                Count--;
            }
        }
    },
    Replace_MisspelledWord: function (Word, WordId) {
        var Element = this.SpellChecker.Elements[WordId];
        var Class = Element.StartRun;
        if (para_Run !== Class.Type || Element.StartPos.Data.Depth <= 0) {
            return;
        }
        var RunPos = Element.StartPos.Data[Element.StartPos.Depth - 1];
        var Len = Word.length;
        for (var Pos = 0; Pos < Len; Pos++) {
            Class.Add_ToContent(RunPos + Pos, (32 === Word.charCodeAt(Pos) ? new ParaSpace() : new ParaText(Word[Pos])));
        }
        var StartPos = Element.StartPos;
        var EndPos = Element.EndPos;
        var CommentsToDelete = {};
        var EPos = EndPos.Get(0);
        var SPos = StartPos.Get(0);
        for (var Pos = SPos; Pos <= EPos; Pos++) {
            var Item = this.Content[Pos];
            if (para_Comment === Item.Type) {
                CommentsToDelete[Item.CommentId] = true;
            }
        }
        for (var CommentId in CommentsToDelete) {
            this.LogicDocument.Remove_Comment(CommentId, true, false);
        }
        this.Set_SelectionContentPos(StartPos, EndPos);
        this.Selection.Use = true;
        this.Selection.Flag = selectionflag_Common;
        this.Remove();
        this.Selection_Remove();
        this.Set_ParaContentPos(StartPos, true, -1, -1);
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
        Element.Checked = null;
    },
    Ignore_MisspelledWord: function (WordId) {
        var Element = this.SpellChecker.Elements[WordId];
        Element.Checked = true;
        this.ReDraw();
    },
    Get_SectionPr: function () {
        return this.SectPr;
    },
    Set_SectionPr: function (SectPr) {
        if (this.LogicDocument !== this.Parent) {
            return;
        }
        if (SectPr !== this.SectPr) {
            History.Add(this, {
                Type: historyitem_Paragraph_SectionPr,
                Old: this.SectPr,
                New: SectPr
            });
            this.SectPr = SectPr;
            this.LogicDocument.Update_SectionsInfo();
            if (this.Content.length > 0 && para_Run === this.Content[this.Content.length - 1].Type) {
                var LastRun = this.Content[this.Content.length - 1];
                LastRun.RecalcInfo.Measure = true;
            }
        }
    },
    Get_LastRangeVisibleBounds: function () {
        var CurLine = this.Lines.length - 1;
        var CurPage = this.Pages.length - 1;
        var Line = this.Lines[CurLine];
        var RangesCount = Line.Ranges.length;
        var RangeW = new CParagraphRangeVisibleWidth();
        var CurRange = 0;
        for (; CurRange < RangesCount; CurRange++) {
            var Range = Line.Ranges[CurRange];
            var StartPos = Range.StartPos;
            var EndPos = Range.EndPos;
            RangeW.W = 0;
            RangeW.End = false;
            if (true === this.Numbering.Check_Range(CurRange, CurLine)) {
                RangeW.W += this.Numbering.WidthVisible;
            }
            for (var Pos = StartPos; Pos <= EndPos; Pos++) {
                var Item = this.Content[Pos];
                Item.Get_Range_VisibleWidth(RangeW, CurLine, CurRange);
            }
            if (true === RangeW.End || CurRange === RangesCount - 1) {
                break;
            }
        }
        var Y = this.Pages[CurPage].Y + this.Lines[CurLine].Top;
        var H = this.Lines[CurLine].Bottom - this.Lines[CurLine].Top;
        var X = this.Lines[CurLine].Ranges[CurRange].XVisible;
        var W = RangeW.W;
        var B = this.Lines[CurLine].Y - this.Lines[CurLine].Top;
        var XLimit = this.XLimit - this.Get_CompiledPr2(false).ParaPr.Ind.Right;
        return {
            X: X,
            Y: Y,
            W: W,
            H: H,
            BaseLine: B,
            XLimit: XLimit
        };
    }
};
Paragraph.prototype.private_ResetSelection = function () {
    this.Selection.StartPos = 0;
    this.Selection.EndPos = 0;
    this.Selection.StartManually = false;
    this.Selection.EndManually = false;
    this.CurPos.ContentPos = 0;
};
Paragraph.prototype.private_CorrectCurPosRangeLine = function () {
    if (-1 !== this.CurPos.Line) {
        return;
    }
    var ParaCurPos = this.Get_ParaContentPos(false, false);
    var Ranges = this.Get_RangesByPos(ParaCurPos);
    this.CurPos.Line = -1;
    this.CurPos.Range = -1;
    for (var Index = 0, Count = Ranges.length; Index < Count; Index++) {
        var RangeIndex = Ranges[Index].Range;
        var LineIndex = Ranges[Index].Line;
        if (undefined !== this.Lines[LineIndex] && undefined !== this.Lines[LineIndex].Ranges[RangeIndex]) {
            var Range = this.Lines[LineIndex].Ranges[RangeIndex];
            if (Range.W > 0) {
                this.CurPos.Line = LineIndex;
                this.CurPos.Range = RangeIndex;
                break;
            }
        }
    }
};
Paragraph.prototype.Get_RangesByPos = function (ContentPos) {
    var Run = this.Get_ElementByPos(ContentPos);
    if (null === Run || para_Run !== Run.Type) {
        return [];
    }
    return Run.Get_RangesByPos(ContentPos.Get(ContentPos.Depth - 1));
};
Paragraph.prototype.Get_ElementByPos = function (ContentPos) {
    if (ContentPos.Depth <= 1) {
        return this;
    }
    var CurPos = ContentPos.Get(0);
    return this.Content[CurPos].Get_ElementByPos(ContentPos, 1);
};
Paragraph.prototype.private_RecalculateTextMetrics = function (TextMetrics) {
    for (var Index = 0, Count = this.Content.length; Index < Count; Index++) {
        if (this.Content[Index].Recalculate_Measure2) {
            this.Content[Index].Recalculate_Measure2(TextMetrics);
        }
    }
};
Paragraph.prototype.private_GetPageByLine = function (CurLine) {
    var CurPage = 0;
    var PagesCount = this.Pages.length;
    for (; CurPage < PagesCount; CurPage++) {
        if (CurLine >= this.Pages[CurPage].StartLine && CurLine <= this.Pages[CurPage].EndLine) {
            break;
        }
    }
    return Math.min(PagesCount - 1, CurPage);
};
var pararecalc_0_All = 0;
var pararecalc_0_None = 1;
var pararecalc_0_Spell_All = 0;
var pararecalc_0_Spell_Pos = 1;
var pararecalc_0_Spell_Lang = 2;
var pararecalc_0_Spell_None = 3;
function CParaRecalcInfo() {
    this.Recalc_0_Type = pararecalc_0_All;
    this.Recalc_0_Spell = {
        Type: pararecalc_0_All,
        StartPos: 0,
        EndPos: 0
    };
}
CParaRecalcInfo.prototype = {
    Set_Type_0: function (Type) {
        this.Recalc_0_Type = Type;
    },
    Set_Type_0_Spell: function (Type, StartPos, EndPos) {
        if (pararecalc_0_Spell_All === this.Recalc_0_Spell.Type) {
            return;
        } else {
            if (pararecalc_0_Spell_None === this.Recalc_0_Spell.Type || pararecalc_0_Spell_Lang === this.Recalc_0_Spell.Type) {
                this.Recalc_0_Spell.Type = Type;
                if (pararecalc_0_Spell_Pos === Type) {
                    this.Recalc_0_Spell.StartPos = StartPos;
                    this.Recalc_0_Spell.EndPos = EndPos;
                }
            } else {
                if (pararecalc_0_Spell_Pos === this.Recalc_0_Spell.Type) {
                    if (pararecalc_0_Spell_All === Type) {
                        this.Recalc_0_Spell.Type = Type;
                    } else {
                        if (pararecalc_0_Spell_Pos === Type) {
                            this.Recalc_0_Spell.StartPos = Math.min(StartPos, this.Recalc_0_Spell.StartPos);
                            this.Recalc_0_Spell.EndPos = Math.max(EndPos, this.Recalc_0_Spell.EndPos);
                        }
                    }
                }
            }
        }
    },
    Update_Spell_OnChange: function (Pos, Count, bAdd) {
        if (pararecalc_0_Spell_Pos === this.Recalc_0_Spell.Type) {
            if (true === bAdd) {
                if (this.Recalc_0_Spell.StartPos > Pos) {
                    this.Recalc_0_Spell.StartPos++;
                }
                if (this.Recalc_0_Spell.EndPos >= Pos) {
                    this.Recalc_0_Spell.EndPos++;
                }
            } else {
                if (this.Recalc_0_Spell.StartPos > Pos) {
                    if (this.Recalc_0_Spell.StartPos > Pos + Count) {
                        this.Recalc_0_Spell.StartPos -= Count;
                    } else {
                        this.Recalc_0_Spell.StartPos = Pos;
                    }
                }
                if (this.Recalc_0_Spell.EndPos >= Pos) {
                    if (this.Recalc_0_Spell.EndPos >= Pos + Count) {
                        this.Recalc_0_Spell.EndPos -= Count;
                    } else {
                        this.Recalc_0_Spell.EndPos = Math.max(0, Pos - 1);
                    }
                }
            }
        }
    }
};
function CDocumentBounds(Left, Top, Right, Bottom) {
    this.Bottom = Bottom;
    this.Left = Left;
    this.Right = Right;
    this.Top = Top;
}
CDocumentBounds.prototype = {
    Shift: function (Dx, Dy) {
        this.Bottom += Dy;
        this.Top += Dy;
        this.Left += Dx;
        this.Right += Dx;
    },
    Compare: function (Other) {
        if (Math.abs(Other.Bottom - this.Bottom) > 0.001 || Math.abs(Other.Top - this.Top) > 0.001 || Math.abs(Other.Left - this.Left) > 0.001 || Math.abs(Other.Right - this.Right)) {
            return false;
        }
        return true;
    }
};
function CParagraphPageEndInfo() {
    this.Comments = [];
    this.RunRecalcInfo = null;
}
CParagraphPageEndInfo.prototype = {
    Copy: function () {
        var NewPageEndInfo = new CParagraphPageEndInfo();
        var CommentsCount = this.Comments.length;
        for (var Index = 0; Index < CommentsCount; Index++) {
            NewPageEndInfo.Comments.push(this.Comments[Index]);
        }
        return NewPageEndInfo;
    }
};
function CParaPos(Range, Line, Page, Pos) {
    this.Range = Range;
    this.Line = Line;
    this.Page = Page;
    this.Pos = Pos;
}
function CParaDrawingRangeLinesElement(y0, y1, x0, x1, w, r, g, b, Additional) {
    this.y0 = y0;
    this.y1 = y1;
    this.x0 = x0;
    this.x1 = x1;
    this.w = w;
    this.r = r;
    this.g = g;
    this.b = b;
    this.Additional = Additional;
}
function CParaDrawingRangeLines() {
    this.Elements = [];
}
CParaDrawingRangeLines.prototype = {
    Clear: function () {
        this.Elements = [];
    },
    Add: function (y0, y1, x0, x1, w, r, g, b, Additional) {
        this.Elements.push(new CParaDrawingRangeLinesElement(y0, y1, x0, x1, w, r, g, b, Additional));
    },
    Get_Next: function () {
        var Count = this.Elements.length;
        if (Count <= 0) {
            return null;
        }
        var Element = this.Elements[Count - 1];
        Count--;
        while (Count > 0) {
            var PrevEl = this.Elements[Count - 1];
            if (Math.abs(PrevEl.y0 - Element.y0) < 0.001 && Math.abs(PrevEl.y1 - Element.y1) < 0.001 && Math.abs(PrevEl.x1 - Element.x0) < 0.001 && Math.abs(PrevEl.w - Element.w) < 0.001 && PrevEl.r === Element.r && PrevEl.g === Element.g && PrevEl.b === Element.b && ((undefined === PrevEl.Additional && undefined === Element.Additional) || (undefined !== PrevEl.Additional && undefined !== Element.Additional && PrevEl.Additional.Active === Element.Additional.Active))) {
                Element.x0 = PrevEl.x0;
                Count--;
            } else {
                break;
            }
        }
        this.Elements.length = Count;
        return Element;
    },
    Correct_w_ForUnderline: function () {
        var Count = this.Elements.length;
        if (Count <= 0) {
            return;
        }
        var CurElements = [];
        for (var Index = 0; Index < Count; Index++) {
            var Element = this.Elements[Index];
            var CurCount = CurElements.length;
            if (0 === CurCount) {
                CurElements.push(Element);
            } else {
                var PrevEl = CurElements[CurCount - 1];
                if (Math.abs(PrevEl.y0 - Element.y0) < 0.001 && Math.abs(PrevEl.y1 - Element.y1) < 0.001 && Math.abs(PrevEl.x1 - Element.x0) < 0.001) {
                    if (Element.w > PrevEl.w) {
                        for (var Index2 = 0; Index2 < CurCount; Index2++) {
                            CurElements[Index2].w = Element.w;
                        }
                    } else {
                        Element.w = PrevEl.w;
                    }
                    CurElements.push(Element);
                } else {
                    CurElements.length = 0;
                    CurElements.push(Element);
                }
            }
        }
    }
};
function CParagraphSelection() {
    this.Start = false;
    this.Use = false;
    this.StartPos = 0;
    this.EndPos = 0;
    this.Flag = selectionflag_Common;
    this.StartManually = true;
    this.EndManually = true;
}
CParagraphSelection.prototype = {
    Set_StartPos: function (Pos1, Pos2) {
        this.StartPos = Pos1;
    },
    Set_EndPos: function (Pos1, Pos2) {
        this.EndPos = Pos1;
    }
};
function CParagraphContentPos() {
    this.Data = [0, 0, 0];
    this.Depth = 0;
    this.bPlaceholder = false;
}
CParagraphContentPos.prototype = {
    Add: function (Pos) {
        this.Data[this.Depth] = Pos;
        this.Depth++;
    },
    Update: function (Pos, Depth) {
        this.Data[Depth] = Pos;
        this.Depth = Depth + 1;
    },
    Update2: function (Pos, Depth) {
        this.Data[Depth] = Pos;
    },
    Set: function (OtherPos) {
        var Len = OtherPos.Depth;
        for (var Pos = 0; Pos < Len; Pos++) {
            this.Data[Pos] = OtherPos.Data[Pos];
        }
        this.Depth = OtherPos.Depth;
        if (this.Data.length > this.Depth) {
            this.Data.length = this.Depth;
        }
    },
    Get: function (Depth) {
        return this.Data[Depth];
    },
    Get_Depth: function () {
        return this.Depth - 1;
    },
    Decrease_Depth: function (nCount) {
        this.Depth = Math.max(0, this.Depth - nCount);
    },
    Copy: function () {
        var PRPos = new CParagraphContentPos();
        var Count = this.Data.length;
        for (var Index = 0; Index < Count; Index++) {
            PRPos.Add(this.Data[Index]);
        }
        PRPos.Depth = this.Depth;
        return PRPos;
    },
    Copy_FromDepth: function (ContentPos, Depth) {
        var Count = ContentPos.Data.length;
        for (var CurDepth = Depth; CurDepth < Count; CurDepth++) {
            this.Update2(ContentPos.Data[CurDepth], CurDepth);
        }
        this.Depth = ContentPos.Depth;
    },
    Compare: function (Pos) {
        var CurDepth = 0;
        var Len1 = this.Data.length;
        var Len2 = Pos.Data.length;
        var LenMin = Math.min(Len1, Len2);
        while (CurDepth < LenMin) {
            if (this.Data[CurDepth] === Pos.Data[CurDepth]) {
                CurDepth++;
                continue;
            } else {
                if (this.Data[CurDepth] > Pos.Data[CurDepth]) {
                    return 1;
                } else {
                    return -1;
                }
            }
        }
        if (Len1 !== Len2) {
            return -1;
        }
        return 0;
    }
};
function CParagraphDrawStateHightlights() {
    this.Page = 0;
    this.Line = 0;
    this.Range = 0;
    this.CurPos = new CParagraphContentPos();
    this.DrawColl = false;
    this.High = new CParaDrawingRangeLines();
    this.Coll = new CParaDrawingRangeLines();
    this.Find = new CParaDrawingRangeLines();
    this.Comm = new CParaDrawingRangeLines();
    this.Shd = new CParaDrawingRangeLines();
    this.DrawComments = true;
    this.Comments = [];
    this.CommentsFlag = comments_NoComment;
    this.SearchCounter = 0;
    this.Paragraph = undefined;
    this.Graphics = undefined;
    this.X = 0;
    this.Y0 = 0;
    this.Y1 = 0;
    this.Spaces = 0;
}
CParagraphDrawStateHightlights.prototype = {
    Reset: function (Paragraph, Graphics, DrawColl, DrawFind, DrawComments, PageEndInfo) {
        this.Paragraph = Paragraph;
        this.Graphics = Graphics;
        this.DrawColl = DrawColl;
        this.DrawFind = DrawFind;
        this.CurPos = new CParagraphContentPos();
        this.SearchCounter = 0;
        this.DrawComments = DrawComments;
        if (null !== PageEndInfo) {
            this.Comments = PageEndInfo.Comments;
        } else {
            this.Comments = [];
        }
        this.Check_CommentsFlag();
    },
    Reset_Range: function (Page, Line, Range, X, Y0, Y1, SpacesCount) {
        this.Page = Page;
        this.Line = Line;
        this.Range = Range;
        this.High.Clear();
        this.Coll.Clear();
        this.Find.Clear();
        this.Comm.Clear();
        this.X = X;
        this.Y0 = Y0;
        this.Y1 = Y1;
        this.Spaces = SpacesCount;
    },
    Add_Comment: function (Id) {
        if (true === this.DrawComments) {
            this.Comments.push(Id);
            this.Check_CommentsFlag();
        }
    },
    Remove_Comment: function (Id) {
        if (true === this.DrawComments) {
            var CommentsLen = this.Comments.length;
            for (var CurPos = 0; CurPos < CommentsLen; CurPos++) {
                if (this.Comments[CurPos] === Id) {
                    this.Comments.splice(CurPos, 1);
                    break;
                }
            }
            this.Check_CommentsFlag();
        }
    },
    Check_CommentsFlag: function () {
        var Para = this.Paragraph;
        var DocumentComments = Para.LogicDocument.Comments;
        var CurComment = DocumentComments.Get_CurrentId();
        var CommLen = this.Comments.length;
        this.CommentsFlag = (CommLen > 0 ? comments_NonActiveComment : comments_NoComment);
        for (var CurPos = 0; CurPos < CommLen; CurPos++) {
            if (CurComment === this.Comments[CurPos]) {
                this.CommentsFlag = comments_ActiveComment;
                break;
            }
        }
    },
    Save_Coll: function () {
        var Coll = this.Coll;
        this.Coll = new CParaDrawingRangeLines();
        return Coll;
    },
    Save_Comm: function () {
        var Comm = this.Comm;
        this.Comm = new CParaDrawingRangeLines();
        return Comm;
    },
    Load_Coll: function (Coll) {
        this.Coll = Coll;
    },
    Load_Comm: function (Comm) {
        this.Comm = Comm;
    }
};
function CParagraphDrawStateElements() {
    this.Paragraph = undefined;
    this.Graphics = undefined;
    this.BgColor = undefined;
    this.Theme = undefined;
    this.ColorMap = undefined;
    this.CurPos = new CParagraphContentPos();
    this.VisitedHyperlink = false;
    this.Page = 0;
    this.Line = 0;
    this.Range = 0;
    this.X = 0;
    this.Y = 0;
}
CParagraphDrawStateElements.prototype = {
    Reset: function (Paragraph, Graphics, BgColor, Theme, ColorMap) {
        this.Paragraph = Paragraph;
        this.Graphics = Graphics;
        this.BgColor = BgColor;
        this.Theme = Theme;
        this.ColorMap = ColorMap;
        this.VisitedHyperlink = false;
        this.CurPos = new CParagraphContentPos();
    },
    Reset_Range: function (Page, Line, Range, X, Y) {
        this.Page = Page;
        this.Line = Line;
        this.Range = Range;
        this.X = X;
        this.Y = Y;
    }
};
function CParagraphDrawStateLines() {
    this.Paragraph = undefined;
    this.Graphics = undefined;
    this.BgColor = undefined;
    this.CurPos = new CParagraphContentPos();
    this.VisitedHyperlink = false;
    this.Strikeout = new CParaDrawingRangeLines();
    this.DStrikeout = new CParaDrawingRangeLines();
    this.Underline = new CParaDrawingRangeLines();
    this.Spelling = new CParaDrawingRangeLines();
    this.SpellingCounter = 0;
    this.Page = 0;
    this.Line = 0;
    this.Range = 0;
    this.X = 0;
    this.BaseLine = 0;
    this.UnderlineOffset = 0;
    this.Spaces = 0;
}
CParagraphDrawStateLines.prototype = {
    Reset: function (Paragraph, Graphics, BgColor) {
        this.Paragraph = Paragraph;
        this.Graphics = Graphics;
        this.BgColor = BgColor;
        this.VisitedHyperlink = false;
        this.CurPos = new CParagraphContentPos();
        this.SpellingCounter = 0;
    },
    Reset_Line: function (Page, Line, Baseline, UnderlineOffset) {
        this.Page = Page;
        this.Line = Line;
        this.Baseline = Baseline;
        this.UnderlineOffset = UnderlineOffset;
        this.Strikeout.Clear();
        this.DStrikeout.Clear();
        this.Underline.Clear();
        this.Spelling.Clear();
    },
    Reset_Range: function (Range, X, Spaces) {
        this.Range = Range;
        this.X = X;
        this.Spaces = Spaces;
    }
};
var g_oPDSH = new CParagraphDrawStateHightlights();
var g_oPDSL = new CParagraphDrawStateLines();
function CParagraphSearchPos() {
    this.Pos = new CParagraphContentPos();
    this.Found = false;
    this.Line = -1;
    this.Range = -1;
    this.Stage = 0;
    this.Shift = false;
    this.Punctuation = false;
    this.First = true;
    this.UpdatePos = false;
    this.ForSelection = false;
}
function CParagraphSearchPosXY() {
    this.Pos = new CParagraphContentPos();
    this.InTextPos = new CParagraphContentPos();
    this.CenterMode = true;
    this.CurX = 0;
    this.CurY = 0;
    this.X = 0;
    this.Y = 0;
    this.DiffX = 1000000;
    this.NumberingDiffX = 1000000;
    this.Line = 0;
    this.Range = 0;
    this.InText = false;
    this.Numbering = false;
    this.End = false;
}
function CParagraphDrawSelectionRange() {
    this.StartX = 0;
    this.W = 0;
    this.StartY = 0;
    this.H = 0;
    this.FindStart = true;
    this.Draw = true;
}
function CParagraphCheckPageBreakEnd(PageBreak) {
    this.PageBreak = PageBreak;
    this.FindPB = true;
}
function CParagraphGetText() {
    this.Text = "";
}
function CParagraphNearPos() {
    this.NearPos = null;
    this.Classes = [];
}
function CParagraphElementNearPos() {
    this.NearPos = null;
    this.Depth = 0;
}
function CParagraphDrawingLayout(Drawing, Paragraph, X, Y, Line, Range, Page) {
    this.Paragraph = Paragraph;
    this.Drawing = Drawing;
    this.Line = Line;
    this.Range = Range;
    this.Page = Page;
    this.X = X;
    this.Y = Y;
    this.LastW = 0;
    this.Layout = false;
}
function CParagraphGetDropCapText() {
    this.Runs = [];
    this.Text = [];
    this.Mixed = false;
    this.Check = true;
}
function CRunRecalculateObject(StartLine, StartRange) {
    this.StartLine = StartLine;
    this.StartRange = StartRange;
    this.Lines = [];
    this.Content = [];
}
CRunRecalculateObject.prototype = {
    Save_Lines: function (Obj, Copy) {
        if (true === Copy) {
            var Lines = Obj.Lines;
            var Count = Obj.Lines.length;
            for (var Index = 0; Index < Count; Index++) {
                this.Lines[Index] = Lines[Index];
            }
        } else {
            this.Lines = Obj.Lines;
        }
    },
    Save_Content: function (Obj, Copy) {
        var Content = Obj.Content;
        var ContentLen = Content.length;
        for (var Index = 0; Index < ContentLen; Index++) {
            this.Content[Index] = Content[Index].Save_RecalculateObject(Copy);
        }
    },
    Load_Lines: function (Obj) {
        Obj.StartLine = this.StartLine;
        Obj.StartRange = this.StartRange;
        Obj.Lines = this.Lines;
    },
    Load_Content: function (Obj) {
        var Count = Obj.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            Obj.Content[Index].Load_RecalculateObject(this.Content[Index]);
        }
    },
    Save_RunContent: function (Run, Copy) {
        var ContentLen = Run.Content.length;
        for (var Index = 0, Index2 = 0; Index < ContentLen; Index++) {
            var Item = Run.Content[Index];
            if (para_PageNum === Item.Type || para_Drawing === Item.Type) {
                this.Content[Index2++] = Item.Save_RecalculateObject(Copy);
            }
        }
    },
    Load_RunContent: function (Run) {
        var Count = Run.Content.length;
        for (var Index = 0, Index2 = 0; Index < Count; Index++) {
            var Item = Run.Content[Index];
            if (para_PageNum === Item.Type || para_Drawing === Item.Type) {
                Item.Load_RecalculateObject(this.Content[Index2++]);
            }
        }
    },
    Get_DrawingFlowPos: function (FlowPos) {
        var Count = this.Content.length;
        for (var Index = 0, Index2 = 0; Index < Count; Index++) {
            var Item = this.Content[Index];
            if (para_Drawing === Item.Type && undefined !== Item.FlowPos) {
                FlowPos.push(Item.FlowPos);
            }
        }
    },
    Compare: function (_CurLine, _CurRange, OtherLinesInfo) {
        var OLI = OtherLinesInfo;
        var CurLine = _CurLine - this.StartLine;
        var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
        if ((0 === this.Lines.length || 0 === this.LinesLength) && (0 === OLI.Lines.length || 0 === OLI.LinesLength)) {
            return true;
        }
        if (this.StartLine !== OLI.StartLine || this.StartRange !== OLI.StartRange || CurLine < 0 || CurLine >= this.private_Get_LinesCount() || CurLine >= OLI.protected_GetLinesCount() || CurRange < 0 || CurRange >= this.private_Get_RangesCount(CurLine) || CurRange >= OLI.protected_GetRangesCount(CurLine)) {
            return false;
        }
        var ThisSP = this.private_Get_RangeStartPos(CurLine, CurRange);
        var ThisEP = this.private_Get_RangeEndPos(CurLine, CurRange);
        var OtherSP = OLI.protected_GetRangeStartPos(CurLine, CurRange);
        var OtherEP = OLI.protected_GetRangeEndPos(CurLine, CurRange);
        if (ThisSP !== OtherSP || ThisEP !== OtherEP) {
            return false;
        }
        if (((OLI.Content === undefined || para_Run === OLI.Type) && this.Content.length > 0) || (OLI.Content !== undefined && para_Run !== OLI.Type && OLI.Content.length !== this.Content.length)) {
            return false;
        }
        var ContentLen = this.Content.length;
        var StartPos = ThisSP;
        var EndPos = Math.min(ContentLen - 1, ThisEP);
        for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
            if (false === this.Content[CurPos].Compare(_CurLine, _CurRange, OLI.Content[CurPos])) {
                return false;
            }
        }
        return true;
    },
    private_Get_RangeOffset: function (LineIndex, RangeIndex) {
        return (1 + this.Lines[0] + this.Lines[1 + LineIndex] + RangeIndex * 2);
    },
    private_Get_RangeStartPos: function (LineIndex, RangeIndex) {
        return this.Lines[this.private_Get_RangeOffset(LineIndex, RangeIndex)];
    },
    private_Get_RangeEndPos: function (LineIndex, RangeIndex) {
        return this.Lines[this.private_Get_RangeOffset(LineIndex, RangeIndex) + 1];
    },
    private_Get_LinesCount: function () {
        return this.Lines[0];
    },
    private_Get_RangesCount: function (LineIndex) {
        if (LineIndex === this.Lines[0] - 1) {
            return (this.Lines.length - this.Lines[1 + LineIndex]) / 2;
        } else {
            return (this.Lines[1 + LineIndex + 1] - this.Lines[1 + LineIndex]) / 2;
        }
    }
};
function CParagraphRunElements(ContentPos, Count) {
    this.ContentPos = ContentPos;
    this.Elements = [];
    this.Count = Count;
}
function CParagraphStatistics(Stats) {
    this.Stats = Stats;
    this.EmptyParagraph = true;
    this.Word = false;
    this.Symbol = false;
    this.Space = false;
    this.NewWord = false;
}
function CParagraphMinMaxContentWidth() {
    this.bWord = false;
    this.nWordLen = 0;
    this.nSpaceLen = 0;
    this.nMinWidth = 0;
    this.nMaxWidth = 0;
    this.nCurMaxWidth = 0;
}
function CParagraphRangeVisibleWidth() {
    this.End = false;
    this.W = 0;
}
function CParagraphMathRangeChecker() {
    this.Math = null;
    this.Result = true;
}
function CParagraphMathParaChecker() {
    this.Found = false;
    this.Result = true;
    this.Direction = 0;
}
function CParagraphStartState(Paragraph) {
    this.Pr = Paragraph.Pr.Copy();
    this.TextPr = Paragraph.TextPr;
    this.Content = [];
    for (var i = 0; i < Paragraph.Content.length; ++i) {
        this.Content.push(Paragraph.Content[i]);
    }
}
function CParagraphTabsCounter() {
    this.Count = 0;
    this.Pos = [];
}