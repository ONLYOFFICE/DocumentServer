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
function ParaRun(Paragraph, bMathRun) {
    ParaRun.superclass.constructor.call(this);
    this.Id = g_oIdCounter.Get_NewId();
    this.Type = para_Run;
    this.Paragraph = Paragraph;
    this.Pr = new CTextPr();
    this.Content = [];
    this.State = new CParaRunState();
    this.Selection = this.State.Selection;
    this.CompiledPr = new CTextPr();
    this.RecalcInfo = new CParaRunRecalcInfo();
    this.TextAscent = 0;
    this.TextAscent = 0;
    this.TextDescent = 0;
    this.TextHeight = 0;
    this.TextAscent2 = 0;
    this.Ascent = 0;
    this.Descent = 0;
    this.YOffset = 0;
    this.CollaborativeMarks = new CRunCollaborativeMarks();
    this.m_oContentChanges = new CContentChanges();
    this.NearPosArray = [];
    this.SearchMarks = [];
    this.SpellingMarks = [];
    if (bMathRun) {
        this.Type = para_Math_Run;
        this.ParaMath = null;
        this.Parent = null;
        this.ArgSize = 0;
        this.bEqqArray = false;
        this.size = new CMathSize();
        this.MathPrp = new CMPrp();
    }
    this.StartState = null;
    g_oTableId.Add(this, this.Id);
    if (this.Paragraph && !this.Paragraph.bFromDocument) {
        this.Save_StartState();
    }
}
Asc.extendClass(ParaRun, CParagraphContentWithContentBase);
ParaRun.prototype.Get_Type = function () {
    return this.Type;
};
ParaRun.prototype.Set_Id = function (newId) {
    g_oTableId.Reset_Id(this, newId, this.Id);
    this.Id = newId;
};
ParaRun.prototype.Get_Id = function () {
    return this.Id;
};
ParaRun.prototype.Get_Paragraph = function () {
    return this.Paragraph;
};
ParaRun.prototype.Set_Paragraph = function (Paragraph) {
    this.Paragraph = Paragraph;
};
ParaRun.prototype.Set_ParaMath = function (ParaMath) {
    this.ParaMath = ParaMath;
};
ParaRun.prototype.Save_StartState = function () {
    this.StartState = new CParaRunStartState(this);
};
ParaRun.prototype.Copy = function (Selected) {
    var bMath = this.Type == para_Math_Run ? true : false;
    var NewRun = new ParaRun(this.Paragraph, bMath);
    NewRun.Set_Pr(this.Pr.Copy());
    if (true === bMath) {
        NewRun.MathPrp = this.MathPrp.Copy();
    }
    var StartPos = 0;
    var EndPos = this.Content.length;
    if (true === Selected && true === this.State.Selection.Use) {
        StartPos = this.State.Selection.StartPos;
        EndPos = this.State.Selection.EndPos;
        if (StartPos > EndPos) {
            StartPos = this.State.Selection.EndPos;
            EndPos = this.State.Selection.StartPos;
        }
    } else {
        if (true === Selected && true !== this.State.Selection.Use) {
            EndPos = -1;
        }
    }
    for (var CurPos = StartPos; CurPos < EndPos; CurPos++) {
        var Item = this.Content[CurPos];
        if (para_End !== Item.Type) {
            NewRun.Add_ToContent(CurPos - StartPos, Item.Copy(), false);
        }
    }
    return NewRun;
};
ParaRun.prototype.Copy2 = function () {
    var NewRun = new ParaRun(this.Paragraph);
    NewRun.Set_Pr(this.Pr.Copy());
    var StartPos = 0;
    var EndPos = this.Content.length;
    for (var CurPos = StartPos; CurPos < EndPos; CurPos++) {
        var Item = this.Content[CurPos];
        NewRun.Add_ToContent(CurPos - StartPos, Item.Copy(), false);
    }
    return NewRun;
};
ParaRun.prototype.Get_AllDrawingObjects = function (DrawingObjs) {
    var Count = this.Content.length;
    for (var Index = 0; Index < Count; Index++) {
        var Item = this.Content[Index];
        if (para_Drawing === Item.Type) {
            DrawingObjs.push(Item);
        }
    }
};
ParaRun.prototype.Clear_ContentChanges = function () {
    this.m_oContentChanges.Clear();
};
ParaRun.prototype.Add_ContentChanges = function (Changes) {
    this.m_oContentChanges.Add(Changes);
};
ParaRun.prototype.Refresh_ContentChanges = function () {
    this.m_oContentChanges.Refresh();
};
ParaRun.prototype.Get_Text = function (Text) {
    if (null === Text.Text) {
        return;
    }
    var ContentLen = this.Content.length;
    for (var CurPos = 0; CurPos < ContentLen; CurPos++) {
        var Item = this.Content[CurPos];
        var ItemType = Item.Type;
        var bBreak = false;
        switch (ItemType) {
        case para_Drawing:
            case para_End:
            case para_PageNum:
            Text.Text = null;
            bBreak = true;
            break;
        case para_Text:
            Text.Text += String.fromCharCode(Item.Value);
            break;
        case para_Space:
            case para_Tab:
            Text.Text += " ";
            break;
        }
        if (true === bBreak) {
            break;
        }
    }
};
ParaRun.prototype.Is_Empty = function (Props) {
    var SkipAnchor = (undefined !== Props ? Props.SkipAnchor : false);
    var SkipEnd = (undefined !== Props ? Props.SkipEnd : false);
    var SkipPlcHldr = (undefined !== Props ? Props.SkipPlcHldr : false);
    var SkipNewLine = (undefined !== Props ? Props.SkipNewLine : false);
    var Count = this.Content.length;
    if (true !== SkipAnchor && true !== SkipEnd && true !== SkipPlcHldr && true !== SkipNewLine) {
        if (Count > 0) {
            return false;
        } else {
            return true;
        }
    } else {
        for (var CurPos = 0; CurPos < this.Content.length; CurPos++) {
            var Item = this.Content[CurPos];
            var ItemType = Item.Type;
            if ((true !== SkipAnchor || para_Drawing !== ItemType || false !== Item.Is_Inline()) && (true !== SkipEnd || para_End !== ItemType) && (true !== SkipPlcHldr || true !== Item.IsPlaceholder()) && (true !== SkipNewLine || para_NewLine !== ItemType)) {
                return false;
            }
        }
        return true;
    }
};
ParaRun.prototype.Is_CheckingNearestPos = function () {
    if (this.NearPosArray.length > 0) {
        return true;
    }
    return false;
};
ParaRun.prototype.Is_StartFromNewLine = function () {
    if (this.protected_GetLinesCount() < 2 || 0 !== this.protected_GetRangeStartPos(1, 0)) {
        return false;
    }
    return true;
};
ParaRun.prototype.Add = function (Item, bMath) {
    if (this.Paragraph && this.Paragraph.LogicDocument && true === this.Paragraph.LogicDocument.CheckLanguageOnTextAdd && editor && editor.asc_getKeyboardLanguage) {
        var nRequiredLanguage = editor.asc_getKeyboardLanguage();
        var nCurrentLanguage = this.Get_CompiledPr(false).Lang.Val;
        if (-1 !== nRequiredLanguage && nRequiredLanguage !== nCurrentLanguage) {
            var NewLang = new CLang();
            NewLang.Val = nRequiredLanguage;
            if (this.Is_Empty()) {
                this.Set_Lang(NewLang);
            } else {
                var Parent = this.Get_Parent();
                var RunPos = this.private_GetPosInParent();
                if (null !== Parent && -1 !== RunPos) {
                    var NewRun = new ParaRun(this.Paragraph, bMath);
                    NewRun.Set_Pr(this.Pr.Copy());
                    NewRun.Set_Lang(NewLang);
                    NewRun.Cursor_MoveToStartPos();
                    NewRun.Add(Item, bMath);
                    var CurPos = this.State.ContentPos;
                    if (0 === CurPos) {
                        Parent.Add_ToContent(RunPos, NewRun);
                    } else {
                        if (this.Content.length === CurPos) {
                            Parent.Add_ToContent(RunPos + 1, NewRun);
                        } else {
                            var RightRun = this.Split2(CurPos);
                            Parent.Add_ToContent(RunPos + 1, NewRun);
                            Parent.Add_ToContent(RunPos + 2, RightRun);
                        }
                    }
                    NewRun.Make_ThisElementCurrent();
                    return;
                }
            }
        }
    }
    this.Add_ToContent(this.State.ContentPos, Item, true, bMath);
};
ParaRun.prototype.Remove = function (Direction, bOnAddText) {
    var Selection = this.State.Selection;
    if (true === Selection.Use) {
        var StartPos = Selection.StartPos;
        var EndPos = Selection.EndPos;
        if (StartPos > EndPos) {
            var Temp = StartPos;
            StartPos = EndPos;
            EndPos = Temp;
        }
        if (true === this.Selection_CheckParaEnd()) {
            for (var CurPos = EndPos - 1; CurPos >= StartPos; CurPos--) {
                if (para_End !== this.Content[CurPos].Type) {
                    this.Remove_FromContent(CurPos, 1, true);
                }
            }
        } else {
            this.Remove_FromContent(StartPos, EndPos - StartPos, true);
        }
        this.Selection_Remove();
        this.State.ContentPos = StartPos;
    } else {
        var CurPos = this.State.ContentPos;
        if (Direction < 0) {
            while (CurPos > 0 && para_Drawing === this.Content[CurPos - 1].Type && false === this.Content[CurPos - 1].Is_Inline()) {
                CurPos--;
            }
            if (CurPos <= 0) {
                return false;
            }
            if (para_Drawing == this.Content[CurPos - 1].Type && true === this.Content[CurPos - 1].Is_Inline()) {
                return this.Paragraph.Parent.Select_DrawingObject(this.Content[CurPos - 1].Get_Id());
            }
            this.Remove_FromContent(CurPos - 1, 1, true);
            this.State.ContentPos = CurPos - 1;
        } else {
            if (CurPos >= this.Content.length || para_End === this.Content[CurPos].Type) {
                return false;
            }
            if (para_Drawing == this.Content[CurPos].Type && true === this.Content[CurPos].Is_Inline()) {
                return this.Paragraph.Parent.Select_DrawingObject(this.Content[CurPos].Get_Id());
            }
            this.Remove_FromContent(CurPos, 1, true);
            this.State.ContentPos = CurPos;
        }
    }
    return true;
};
ParaRun.prototype.Remove_ParaEnd = function () {
    var Pos = -1;
    var ContentLen = this.Content.length;
    for (var CurPos = 0; CurPos < ContentLen; CurPos++) {
        if (para_End === this.Content[CurPos].Type) {
            Pos = CurPos;
            break;
        }
    }
    if (-1 === Pos) {
        return false;
    }
    this.Remove_FromContent(Pos, ContentLen - Pos, true);
    return true;
};
ParaRun.prototype.Add_ToContent = function (Pos, Item, UpdatePosition, bMath) {
    History.Add(this, {
        Type: historyitem_ParaRun_AddItem,
        Pos: Pos,
        EndPos: Pos,
        Items: [Item]
    });
    this.Content.splice(Pos, 0, Item);
    if (true === UpdatePosition) {
        if (this.State.ContentPos >= Pos) {
            this.State.ContentPos++;
        }
        if (true === this.State.Selection.Use) {
            if (this.State.Selection.StartPos >= Pos) {
                this.State.Selection.StartPos++;
            }
            if (this.State.Selection.EndPos >= Pos) {
                this.State.Selection.EndPos++;
            }
        }
        var LinesCount = this.protected_GetLinesCount();
        for (var CurLine = 0; CurLine < LinesCount; CurLine++) {
            var RangesCount = this.protected_GetRangesCount(CurLine);
            for (var CurRange = 0; CurRange < RangesCount; CurRange++) {
                var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
                var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
                if (StartPos > Pos) {
                    StartPos++;
                }
                if (EndPos > Pos) {
                    EndPos++;
                }
                this.protected_FillRange(CurLine, CurRange, StartPos, EndPos);
            }
            if (Pos === this.Content.length - 1 && LinesCount - 1 === CurLine && !bMath) {
                this.protected_FillRangeEndPos(CurLine, RangesCount - 1, this.protected_GetRangeEndPos(CurLine, RangesCount - 1) + 1);
            }
        }
    }
    var NearPosLen = this.NearPosArray.length;
    for (var Index = 0; Index < NearPosLen; Index++) {
        var RunNearPos = this.NearPosArray[Index];
        var ContentPos = RunNearPos.NearPos.ContentPos;
        var Depth = RunNearPos.Depth;
        if (ContentPos.Data[Depth] >= Pos) {
            ContentPos.Data[Depth]++;
        }
    }
    var SearchMarksCount = this.SearchMarks.length;
    for (var Index = 0; Index < SearchMarksCount; Index++) {
        var Mark = this.SearchMarks[Index];
        var ContentPos = (true === Mark.Start ? Mark.SearchResult.StartPos : Mark.SearchResult.EndPos);
        var Depth = Mark.Depth;
        if (ContentPos.Data[Depth] >= Pos) {
            ContentPos.Data[Depth]++;
        }
    }
    var SpellingMarksCount = this.SpellingMarks.length;
    for (var Index = 0; Index < SpellingMarksCount; Index++) {
        var Mark = this.SpellingMarks[Index];
        var ContentPos = (true === Mark.Start ? Mark.Element.StartPos : Mark.Element.EndPos);
        var Depth = Mark.Depth;
        if (ContentPos.Data[Depth] >= Pos) {
            ContentPos.Data[Depth]++;
        }
    }
    this.protected_UpdateSpellChecking();
    this.CollaborativeMarks.Update_OnAdd(Pos);
    this.RecalcInfo.Measure = true;
};
ParaRun.prototype.Remove_FromContent = function (Pos, Count, UpdatePosition) {
    var DeletedItems = this.Content.slice(Pos, Pos + Count);
    History.Add(this, {
        Type: historyitem_Paragraph_RemoveItem,
        Pos: Pos,
        EndPos: Pos + Count - 1,
        Items: DeletedItems
    });
    this.Content.splice(Pos, Count);
    if (true === UpdatePosition) {
        if (this.State.ContentPos > Pos + Count) {
            this.State.ContentPos -= Count;
        } else {
            if (this.State.ContentPos > Pos) {
                this.State.ContentPos = Pos;
            }
        }
        if (true === this.State.Selection.Use) {
            if (this.State.Selection.StartPos <= this.State.Selection.EndPos) {
                if (this.State.Selection.StartPos > Pos + Count) {
                    this.State.Selection.StartPos -= Count;
                } else {
                    if (this.State.Selection.StartPos > Pos) {
                        this.State.Selection.StartPos = Pos;
                    }
                }
                if (this.State.Selection.EndPos >= Pos + Count) {
                    this.State.Selection.EndPos -= Count;
                } else {
                    if (this.State.Selection.EndPos > Pos) {
                        this.State.Selection.EndPos = Math.max(0, Pos - 1);
                    }
                }
            } else {
                if (this.State.Selection.StartPos >= Pos + Count) {
                    this.State.Selection.StartPos -= Count;
                } else {
                    if (this.State.Selection.StartPos > Pos) {
                        this.State.Selection.StartPos = Math.max(0, Pos - 1);
                    }
                }
                if (this.State.Selection.EndPos > Pos + Count) {
                    this.State.Selection.EndPos -= Count;
                } else {
                    if (this.State.Selection.EndPos > Pos) {
                        this.State.Selection.EndPos = Pos;
                    }
                }
            }
        }
        var LinesCount = this.protected_GetLinesCount();
        for (var CurLine = 0; CurLine < LinesCount; CurLine++) {
            var RangesCount = this.protected_GetRangesCount(CurLine);
            for (var CurRange = 0; CurRange < RangesCount; CurRange++) {
                var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
                var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
                if (StartPos > Pos + Count) {
                    StartPos -= Count;
                } else {
                    if (StartPos > Pos) {
                        StartPos = Math.max(0, Pos);
                    }
                }
                if (EndPos >= Pos + Count) {
                    EndPos -= Count;
                } else {
                    if (EndPos >= Pos) {
                        EndPos = Math.max(0, Pos);
                    }
                }
                this.protected_FillRange(CurLine, CurRange, StartPos, EndPos);
            }
        }
    }
    var NearPosLen = this.NearPosArray.length;
    for (var Index = 0; Index < NearPosLen; Index++) {
        var RunNearPos = this.NearPosArray[Index];
        var ContentPos = RunNearPos.NearPos.ContentPos;
        var Depth = RunNearPos.Depth;
        if (ContentPos.Data[Depth] > Pos + Count) {
            ContentPos.Data[Depth] -= Count;
        } else {
            if (ContentPos.Data[Depth] > Pos) {
                ContentPos.Data[Depth] = Math.max(0, Pos);
            }
        }
    }
    var SearchMarksCount = this.SearchMarks.length;
    for (var Index = 0; Index < SearchMarksCount; Index++) {
        var Mark = this.SearchMarks[Index];
        var ContentPos = (true === Mark.Start ? Mark.SearchResult.StartPos : Mark.SearchResult.EndPos);
        var Depth = Mark.Depth;
        if (ContentPos.Data[Depth] > Pos + Count) {
            ContentPos.Data[Depth] -= Count;
        } else {
            if (ContentPos.Data[Depth] > Pos) {
                ContentPos.Data[Depth] = Math.max(0, Pos);
            }
        }
    }
    var SpellingMarksCount = this.SpellingMarks.length;
    for (var Index = 0; Index < SpellingMarksCount; Index++) {
        var Mark = this.SpellingMarks[Index];
        var ContentPos = (true === Mark.Start ? Mark.Element.StartPos : Mark.Element.EndPos);
        var Depth = Mark.Depth;
        if (ContentPos.Data[Depth] > Pos + Count) {
            ContentPos.Data[Depth] -= Count;
        } else {
            if (ContentPos.Data[Depth] > Pos) {
                ContentPos.Data[Depth] = Math.max(0, Pos);
            }
        }
    }
    this.protected_UpdateSpellChecking();
    this.CollaborativeMarks.Update_OnRemove(Pos, Count);
    this.RecalcInfo.Measure = true;
};
ParaRun.prototype.Concat_ToContent = function (NewItems) {
    var StartPos = this.Content.length;
    this.Content = this.Content.concat(NewItems);
    History.Add(this, {
        Type: historyitem_ParaRun_AddItem,
        Pos: StartPos,
        EndPos: this.Content.length - 1,
        Items: NewItems,
        Color: false
    });
    this.RecalcInfo.Measure = true;
};
ParaRun.prototype.Get_CurrentParaPos = function () {
    var Pos = this.State.ContentPos;
    if (-1 === this.StartLine) {
        return new CParaPos(-1, -1, -1, -1);
    }
    var CurLine = 0;
    var CurRange = 0;
    var LinesCount = this.protected_GetLinesCount();
    for (; CurLine < LinesCount; CurLine++) {
        var RangesCount = this.protected_GetRangesCount(CurLine);
        for (CurRange = 0; CurRange < RangesCount; CurRange++) {
            var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
            var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
            if (Pos < EndPos && Pos >= StartPos) {
                return new CParaPos((CurLine === 0 ? CurRange + this.StartRange : CurRange), CurLine + this.StartLine, 0, 0);
            }
        }
    }
    return new CParaPos((LinesCount <= 1 ? this.protected_GetRangesCount(0) - 1 + this.StartRange : this.protected_GetRangesCount(LinesCount - 1) - 1), LinesCount - 1 + this.StartLine, 0, 0);
};
ParaRun.prototype.Get_ParaPosByContentPos = function (ContentPos, Depth) {
    var Pos = ContentPos.Get(Depth);
    var CurLine = 0;
    var CurRange = 0;
    var LinesCount = this.protected_GetLinesCount();
    for (; CurLine < LinesCount; CurLine++) {
        var RangesCount = this.protected_GetRangesCount(CurLine);
        for (CurRange = 0; CurRange < RangesCount; CurRange++) {
            var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
            var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
            if (Pos < EndPos && Pos >= StartPos) {
                return new CParaPos((CurLine === 0 ? CurRange + this.StartRange : CurRange), CurLine + this.StartLine, 0, 0);
            }
        }
    }
    return new CParaPos((LinesCount === 1 ? this.protected_GetRangesCount(0) - 1 + this.StartRange : this.protected_GetRangesCount(0) - 1), LinesCount - 1 + this.StartLine, 0, 0);
};
ParaRun.prototype.Recalculate_CurPos = function (X, Y, CurrentRun, _CurRange, _CurLine, CurPage, UpdateCurPos, UpdateTarget, ReturnTarget, PointsInfo) {
    var Para = this.Paragraph;
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    var Pos = StartPos;
    var _EndPos = (true === CurrentRun ? Math.min(EndPos, this.State.ContentPos) : EndPos);
    for (; Pos < _EndPos; Pos++) {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;
        switch (ItemType) {
        case para_Text:
            case para_Space:
            case para_Sym:
            case para_PageNum:
            case para_Tab:
            case para_End:
            case para_NewLine:
            case para_Math_Text:
            case para_Math_Placeholder:
            case para_Math_Ampersand:
            X += Item.Get_WidthVisible();
            break;
        case para_Drawing:
            if (drawing_Inline != Item.DrawingType) {
                break;
            }
            X += Item.Get_WidthVisible();
            break;
        }
    }
    if (true === CurrentRun && Pos === this.State.ContentPos) {
        if (true === UpdateCurPos) {
            Para.CurPos.X = X;
            Para.CurPos.Y = Y;
            Para.CurPos.PagesPos = CurPage;
            if (true === UpdateTarget) {
                var CurTextPr = this.Get_CompiledPr(false);
                g_oTextMeasurer.SetTextPr(CurTextPr, this.Paragraph.Get_Theme());
                g_oTextMeasurer.SetFontSlot(fontslot_ASCII, CurTextPr.Get_FontKoef());
                var Height = g_oTextMeasurer.GetHeight();
                var Descender = Math.abs(g_oTextMeasurer.GetDescender());
                var Ascender = Height - Descender;
                Para.DrawingDocument.SetTargetSize(Height);
                var RGBA;
                if (CurTextPr.Unifill) {
                    CurTextPr.Unifill.check(Para.Get_Theme(), Para.Get_ColorMap());
                    RGBA = CurTextPr.Unifill.getRGBAColor();
                    Para.DrawingDocument.SetTargetColor(RGBA.R, RGBA.G, RGBA.B);
                } else {
                    if (true === CurTextPr.Color.Auto) {
                        var Pr = Para.Get_CompiledPr();
                        var BgColor = undefined;
                        if (undefined !== Pr.ParaPr.Shd && shd_Nil !== Pr.ParaPr.Shd.Value) {
                            if (Pr.ParaPr.Shd.Unifill) {
                                Pr.ParaPr.Shd.Unifill.check(this.Paragraph.Get_Theme(), this.Paragraph.Get_ColorMap());
                                var RGBA = Pr.ParaPr.Shd.Unifill.getRGBAColor();
                                BgColor = new CDocumentColor(RGBA.R, RGBA.G, RGBA.B, false);
                            } else {
                                BgColor = Pr.ParaPr.Shd.Color;
                            }
                        } else {
                            BgColor = Para.Parent.Get_TextBackGroundColor();
                            if (undefined !== CurTextPr.Shd && shd_Nil !== CurTextPr.Shd.Value) {
                                BgColor = CurTextPr.Shd.Get_Color(this.Paragraph);
                            }
                        }
                        var AutoColor = (undefined != BgColor && false === BgColor.Check_BlackAutoColor() ? new CDocumentColor(255, 255, 255, false) : new CDocumentColor(0, 0, 0, false));
                        Para.DrawingDocument.SetTargetColor(AutoColor.r, AutoColor.g, AutoColor.b);
                    } else {
                        Para.DrawingDocument.SetTargetColor(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b);
                    }
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
                var Page_Abs = Para.Get_StartPage_Absolute() + CurPage;
                Para.DrawingDocument.UpdateTarget(X, TargetY, Page_Abs);
                if (undefined != Para.Get_FramePr()) {
                    var __Y0 = TargetY,
                    __Y1 = TargetY + Height;
                    var ___Y0 = Para.Pages[CurPage].Y + Para.Lines[CurLine].Top;
                    var ___Y1 = Para.Pages[CurPage].Y + Para.Lines[CurLine].Bottom;
                    __Y0 = Math.max(__Y0, ___Y0);
                    __Y1 = Math.min(__Y1, ___Y1);
                    Para.DrawingDocument.SetTargetSize(__Y1 - __Y0);
                    Para.DrawingDocument.UpdateTarget(X, __Y0, Page_Abs);
                }
                if (para_Math_Run === this.Type && null !== this.Parent && true !== this.Parent.bRoot) {
                    var oBounds = this.Parent.Get_Bounds();
                    var __Y0 = TargetY,
                    __Y1 = TargetY + Height;
                    var ___Y0 = oBounds.Y - 0.2 * oBounds.H;
                    var ___Y1 = oBounds.Y + 1.4 * oBounds.H;
                    __Y0 = Math.max(__Y0, ___Y0);
                    __Y1 = Math.min(__Y1, ___Y1);
                    Para.DrawingDocument.SetTargetSize(__Y1 - __Y0);
                    Para.DrawingDocument.UpdateTarget(X, __Y0, Page_Abs);
                }
            }
        }
        if (true === ReturnTarget) {
            var CurTextPr = this.Get_CompiledPr(false);
            g_oTextMeasurer.SetTextPr(CurTextPr, this.Paragraph.Get_Theme());
            g_oTextMeasurer.SetFontSlot(fontslot_ASCII, CurTextPr.Get_FontKoef());
            var Height = g_oTextMeasurer.GetHeight();
            var Descender = Math.abs(g_oTextMeasurer.GetDescender());
            var Ascender = Height - Descender;
            var TargetY = Y - Ascender - CurTextPr.Position;
            switch (CurTextPr.VertAlign) {
            case vertalign_SubScript:
                TargetY -= CurTextPr.FontSize * g_dKoef_pt_to_mm * vertalign_Koef_Sub;
                break;
            case vertalign_SuperScript:
                TargetY -= CurTextPr.FontSize * g_dKoef_pt_to_mm * vertalign_Koef_Super;
                break;
            }
            return {
                X: X,
                Y: TargetY,
                Height: Height,
                Internal: {
                    Line: CurLine,
                    Page: CurPage,
                    Range: CurRange
                }
            };
        } else {
            return {
                X: X,
                Y: Y,
                PageNum: CurPage + Para.Get_StartPage_Absolute(),
                Internal: {
                    Line: CurLine,
                    Page: CurPage,
                    Range: CurRange
                }
            };
        }
    }
    return {
        X: X,
        Y: Y,
        Internal: {
            Line: CurLine,
            Page: CurPage,
            Range: CurRange
        }
    };
};
ParaRun.prototype.Is_SimpleChanges = function (Changes) {
    if (para_Math_Run === this.Type) {
        return false;
    }
    var ParaPos = null;
    var Count = Changes.length;
    for (var Index = 0; Index < Count; Index++) {
        var Data = Changes[Index].Data;
        if (undefined === Data.Items || 1 !== Data.Items.length) {
            return false;
        }
        var Type = Data.Type;
        var Item = Data.Items[0];
        if (undefined === Item) {
            return false;
        }
        if (historyitem_ParaRun_AddItem !== Type && historyitem_ParaRun_RemoveItem !== Type) {
            return false;
        }
        var ItemType = Item.Type;
        if (para_Drawing === ItemType || para_NewLine === ItemType) {
            return false;
        }
        var CurParaPos = this.Get_SimpleChanges_ParaPos([Changes[Index]]);
        if (null === CurParaPos) {
            return false;
        }
        if (null === ParaPos) {
            ParaPos = CurParaPos;
        } else {
            if (ParaPos.Line !== CurParaPos.Line || ParaPos.Range !== CurParaPos.Range) {
                return false;
            }
        }
    }
    return true;
};
ParaRun.prototype.Get_SimpleChanges_ParaPos = function (Changes) {
    var Change = Changes[0].Data;
    var Type = Changes[0].Data.Type;
    var Pos = Change.Pos;
    var CurLine = 0;
    var CurRange = 0;
    var LinesCount = this.protected_GetLinesCount();
    for (; CurLine < LinesCount; CurLine++) {
        var RangesCount = this.protected_GetRangesCount(CurLine);
        for (CurRange = 0; CurRange < RangesCount; CurRange++) {
            var RangeStartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
            var RangeEndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
            if ((historyitem_ParaRun_AddItem === Type && Pos < RangeEndPos && Pos >= RangeStartPos) || (historyitem_ParaRun_RemoveItem === Type && Pos < RangeEndPos && Pos >= RangeStartPos) || (historyitem_ParaRun_RemoveItem === Type && Pos >= RangeEndPos && CurLine === LinesCount - 1 && CurRange === RangesCount - 1)) {
                if (RangeStartPos === RangeEndPos) {
                    return null;
                }
                return new CParaPos((CurLine === 0 ? CurRange + this.StartRange : CurRange), CurLine + this.StartLine, 0, 0);
            }
        }
    }
    if (this.protected_GetRangeStartPos(0, 0) === this.protected_GetRangeEndPos(0, 0)) {
        return null;
    }
    return new CParaPos(this.StartRange, this.StartLine, 0, 0);
};
ParaRun.prototype.Split = function (ContentPos, Depth) {
    var CurPos = ContentPos.Get(Depth);
    return this.Split2(CurPos);
};
ParaRun.prototype.Split2 = function (CurPos) {
    var bMathRun = this.Type == para_Math_Run;
    var NewRun = new ParaRun(this.Paragraph, bMathRun);
    NewRun.Set_Pr(this.Pr.Copy());
    if (bMathRun) {
        NewRun.Set_MathPr(this.MathPrp.Copy());
    }
    var CheckEndPos = -1;
    var CheckEndPos2 = Math.min(CurPos, this.Content.length);
    for (var Pos = 0; Pos < CheckEndPos2; Pos++) {
        if (para_End === this.Content[Pos].Type) {
            CheckEndPos = Pos;
            break;
        }
    }
    if (-1 !== CheckEndPos) {
        CurPos = CheckEndPos;
    }
    NewRun.Concat_ToContent(this.Content.slice(CurPos));
    this.Remove_FromContent(CurPos, this.Content.length - CurPos, true);
    var SpellingMarksCount = this.SpellingMarks.length;
    for (var Index = 0; Index < SpellingMarksCount; Index++) {
        var Mark = this.SpellingMarks[Index];
        var MarkPos = (true === Mark.Start ? Mark.Element.StartPos.Get(Mark.Depth) : Mark.Element.EndPos.Get(Mark.Depth));
        if (MarkPos >= CurPos) {
            var MarkElement = Mark.Element;
            if (true === Mark.Start) {
                MarkElement.StartPos.Data[Mark.Depth] -= CurPos;
            } else {
                MarkElement.EndPos.Data[Mark.Depth] -= CurPos;
            }
            NewRun.SpellingMarks.push(Mark);
            this.SpellingMarks.splice(Index, 1);
            SpellingMarksCount--;
            Index--;
        }
    }
    return NewRun;
};
ParaRun.prototype.Check_NearestPos = function (ParaNearPos, Depth) {
    var RunNearPos = new CParagraphElementNearPos();
    RunNearPos.NearPos = ParaNearPos.NearPos;
    RunNearPos.Depth = Depth;
    this.NearPosArray.push(RunNearPos);
    ParaNearPos.Classes.push(this);
};
ParaRun.prototype.Get_DrawingObjectRun = function (Id) {
    var ContentLen = this.Content.length;
    for (var CurPos = 0; CurPos < ContentLen; CurPos++) {
        var Element = this.Content[CurPos];
        if (para_Drawing === Element.Type && Id === Element.Get_Id()) {
            return this;
        }
    }
    return null;
};
ParaRun.prototype.Get_DrawingObjectContentPos = function (Id, ContentPos, Depth) {
    var ContentLen = this.Content.length;
    for (var CurPos = 0; CurPos < ContentLen; CurPos++) {
        var Element = this.Content[CurPos];
        if (para_Drawing === Element.Type && Id === Element.Get_Id()) {
            ContentPos.Update(CurPos, Depth);
            return true;
        }
    }
    return false;
};
ParaRun.prototype.Remove_DrawingObject = function (Id) {
    var ContentLen = this.Content.length;
    for (var CurPos = 0; CurPos < ContentLen; CurPos++) {
        var Element = this.Content[CurPos];
        if (para_Drawing === Element.Type && Id === Element.Get_Id()) {
            this.Remove_FromContent(CurPos, 1, true);
            return;
        }
    }
};
ParaRun.prototype.Get_Layout = function (DrawingLayout, UseContentPos, ContentPos, Depth) {
    var CurLine = DrawingLayout.Line - this.StartLine;
    var CurRange = (0 === CurLine ? DrawingLayout.Range - this.StartRange : DrawingLayout.Range);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    var CurContentPos = (true === UseContentPos ? ContentPos.Get(Depth) : -1);
    var CurPos = StartPos;
    for (; CurPos < EndPos; CurPos++) {
        if (CurContentPos === CurPos) {
            break;
        }
        var Item = this.Content[CurPos];
        var ItemType = Item.Type;
        var WidthVisible = Item.Get_WidthVisible();
        switch (ItemType) {
        case para_Text:
            case para_Space:
            case para_PageNum:
            DrawingLayout.LastW = WidthVisible;
            break;
        case para_Drawing:
            if (true === Item.Is_Inline() || true === DrawingLayout.Paragraph.Parent.Is_DrawingShape()) {
                DrawingLayout.LastW = WidthVisible;
            }
            break;
        }
        DrawingLayout.X += WidthVisible;
    }
    if (CurContentPos === CurPos) {
        DrawingLayout.Layout = true;
    }
};
ParaRun.prototype.Get_NextRunElements = function (RunElements, UseContentPos, Depth) {
    var StartPos = (true === UseContentPos ? RunElements.ContentPos.Get(Depth) : 0);
    var ContentLen = this.Content.length;
    for (var CurPos = StartPos; CurPos < ContentLen; CurPos++) {
        var Item = this.Content[CurPos];
        var ItemType = Item.Type;
        if (para_Text === ItemType || para_Space === ItemType || para_Tab === ItemType) {
            RunElements.Elements.push(Item);
            RunElements.Count--;
            if (RunElements.Count <= 0) {
                return;
            }
        }
    }
};
ParaRun.prototype.Get_PrevRunElements = function (RunElements, UseContentPos, Depth) {
    var StartPos = (true === UseContentPos ? RunElements.ContentPos.Get(Depth) - 1 : this.Content.length - 1);
    var ContentLen = this.Content.length;
    for (var CurPos = StartPos; CurPos >= 0; CurPos--) {
        var Item = this.Content[CurPos];
        var ItemType = Item.Type;
        if (para_Text === ItemType || para_Space === ItemType || para_Tab === ItemType) {
            RunElements.Elements.push(Item);
            RunElements.Count--;
            if (RunElements.Count <= 0) {
                return;
            }
        }
    }
};
ParaRun.prototype.Collect_DocumentStatistics = function (ParaStats) {
    var Count = this.Content.length;
    for (var Index = 0; Index < Count; Index++) {
        var Item = this.Content[Index];
        var ItemType = Item.Type;
        var bSymbol = false;
        var bSpace = false;
        var bNewWord = false;
        if ((para_Text === ItemType && false === Item.Is_NBSP()) || (para_PageNum === ItemType)) {
            if (false === ParaStats.Word) {
                bNewWord = true;
            }
            bSymbol = true;
            bSpace = false;
            ParaStats.Word = true;
            ParaStats.EmptyParagraph = false;
        } else {
            if ((para_Text === ItemType && true === Item.Is_NBSP()) || para_Space === ItemType || para_Tab === ItemType) {
                bSymbol = true;
                bSpace = true;
                ParaStats.Word = false;
            }
        }
        if (true === bSymbol) {
            ParaStats.Stats.Add_Symbol(bSpace);
        }
        if (true === bNewWord) {
            ParaStats.Stats.Add_Word();
        }
    }
};
ParaRun.prototype.Create_FontMap = function (Map, ArgSize) {
    if (undefined !== this.Paragraph && null !== this.Paragraph) {
        var TextPr;
        var FontSize, FontSizeCS;
        if (this.Type === para_Math_Run) {
            TextPr = this.Get_CompiledPr(false);
            FontSize = TextPr.FontSize;
            FontSizeCS = TextPr.FontSizeCS;
            if (null !== this.Parent && undefined !== this.Parent && null !== this.Parent.ParaMath && undefined !== this.Parent.ParaMath) {
                TextPr.FontSize *= MatGetKoeffArgSize(TextPr.FontSize, ArgSize.value);
                TextPr.FontSizeCS *= MatGetKoeffArgSize(TextPr.FontSizeCS, ArgSize.value);
            }
        } else {
            TextPr = this.Get_CompiledPr(false);
        }
        TextPr.Document_CreateFontMap(Map, this.Paragraph.Get_Theme().themeElements.fontScheme);
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            var Item = this.Content[Index];
            if (para_Drawing === Item.Type) {
                Item.documentCreateFontMap(Map);
            }
        }
        if (this.Type === para_Math_Run) {
            TextPr.FontSize = FontSize;
            TextPr.FontSizeCS = FontSizeCS;
        }
    }
};
ParaRun.prototype.Get_AllFontNames = function (AllFonts) {
    this.Pr.Document_Get_AllFontNames(AllFonts);
    var Count = this.Content.length;
    for (var Index = 0; Index < Count; Index++) {
        var Item = this.Content[Index];
        if (para_Drawing === Item.Type) {
            Item.documentGetAllFontNames(AllFonts);
        }
    }
};
ParaRun.prototype.Get_SelectedText = function (bAll, bClearText) {
    var StartPos = 0;
    var EndPos = 0;
    if (true === bAll) {
        StartPos = 0;
        EndPos = this.Content.length;
    } else {
        if (true === this.Selection.Use) {
            StartPos = this.State.Selection.StartPos;
            EndPos = this.State.Selection.EndPos;
            if (StartPos > EndPos) {
                var Temp = EndPos;
                EndPos = StartPos;
                StartPos = Temp;
            }
        }
    }
    var Str = "";
    for (var Pos = StartPos; Pos < EndPos; Pos++) {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;
        switch (ItemType) {
        case para_Drawing:
            case para_Numbering:
            case para_PresentationNumbering:
            case para_PageNum:
            if (true === bClearText) {
                return null;
            }
            break;
        case para_Text:
            Str += String.fromCharCode(Item.Value);
            break;
        case para_Space:
            case para_Tab:
            Str += " ";
            break;
        }
    }
    return Str;
};
ParaRun.prototype.Get_SelectionDirection = function () {
    if (true !== this.Selection.Use) {
        return 0;
    }
    if (this.Selection.StartPos <= this.Selection.EndPos) {
        return 1;
    }
    return -1;
};
ParaRun.prototype.Can_AddDropCap = function () {
    var Count = this.Content.length;
    for (var Pos = 0; Pos < Count; Pos++) {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;
        switch (ItemType) {
        case para_Text:
            return true;
        case para_Space:
            case para_Tab:
            case para_PageNum:
            return false;
        }
    }
    return null;
};
ParaRun.prototype.Get_TextForDropCap = function (DropCapText, UseContentPos, ContentPos, Depth) {
    var EndPos = (true === UseContentPos ? ContentPos.Get(Depth) : this.Content.length);
    for (var Pos = 0; Pos < EndPos; Pos++) {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;
        if (true === DropCapText.Check) {
            if (para_Space === ItemType || para_Tab === ItemType || para_PageNum === ItemType || para_Drawing === ItemType) {
                DropCapText.Mixed = true;
                return;
            }
        } else {
            if (para_Text === ItemType) {
                DropCapText.Runs.push(this);
                DropCapText.Text.push(Item);
                this.Remove_FromContent(Pos, 1, true);
                Pos--;
                EndPos--;
                if (true === DropCapText.Mixed) {
                    return;
                }
            }
        }
    }
};
ParaRun.prototype.Get_StartTabsCount = function (TabsCounter) {
    var ContentLen = this.Content.length;
    for (var Pos = 0; Pos < ContentLen; Pos++) {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;
        if (para_Tab === ItemType) {
            TabsCounter.Count++;
            TabsCounter.Pos.push(Pos);
        } else {
            if (para_Text === ItemType || para_Space === ItemType || (para_Drawing === ItemType && true === Item.Is_Inline()) || para_PageNum === ItemType || para_Math === ItemType) {
                return false;
            }
        }
    }
    return true;
};
ParaRun.prototype.Remove_StartTabs = function (TabsCounter) {
    var ContentLen = this.Content.length;
    for (var Pos = 0; Pos < ContentLen; Pos++) {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;
        if (para_Tab === ItemType) {
            this.Remove_FromContent(Pos, 1, true);
            TabsCounter.Count--;
            Pos--;
            ContentLen--;
        } else {
            if (para_Text === ItemType || para_Space === ItemType || (para_Drawing === ItemType && true === Item.Is_Inline()) || para_PageNum === ItemType || para_Math === ItemType) {
                return false;
            }
        }
    }
    return true;
};
ParaRun.prototype.Recalculate_MeasureContent = function () {
    if (false === this.RecalcInfo.Measure) {
        return;
    }
    var Pr = this.Get_CompiledPr(false);
    var Theme = this.Paragraph.Get_Theme();
    g_oTextMeasurer.SetTextPr(Pr, Theme);
    g_oTextMeasurer.SetFontSlot(fontslot_ASCII);
    this.TextHeight = g_oTextMeasurer.GetHeight();
    this.TextDescent = Math.abs(g_oTextMeasurer.GetDescender());
    this.TextAscent = this.TextHeight - this.TextDescent;
    this.TextAscent2 = g_oTextMeasurer.GetAscender();
    this.YOffset = Pr.Position;
    var ContentLength = this.Content.length;
    for (var Pos = 0; Pos < ContentLength; Pos++) {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;
        if (para_Drawing === ItemType) {
            Item.Parent = this.Paragraph;
            Item.DocumentContent = this.Paragraph.Parent;
            Item.DrawingDocument = this.Paragraph.Parent.DrawingDocument;
        }
        if (para_End === ItemType) {
            var EndTextPr = this.Paragraph.Get_CompiledPr2(false).TextPr.Copy();
            EndTextPr.Merge(this.Paragraph.TextPr.Value);
            g_oTextMeasurer.SetTextPr(EndTextPr, this.Paragraph.Get_Theme());
            Item.Measure(g_oTextMeasurer, EndTextPr);
            continue;
        }
        Item.Measure(g_oTextMeasurer, Pr);
        if (para_Drawing === Item.Type) {
            g_oTextMeasurer.SetTextPr(Pr, Theme);
            g_oTextMeasurer.SetFontSlot(fontslot_ASCII);
        }
    }
    this.RecalcInfo.Recalc = true;
    this.RecalcInfo.Measure = false;
};
ParaRun.prototype.Recalculate_Measure2 = function (Metrics) {
    var TAscent = Metrics.Ascent;
    var TDescent = Metrics.Descent;
    var Count = this.Content.length;
    for (var Index = 0; Index < Count; Index++) {
        var Item = this.Content[Index];
        var ItemType = Item.Type;
        if (para_Text === ItemType) {
            var Temp = g_oTextMeasurer.Measure2(String.fromCharCode(Item.Value));
            if (null === TAscent || TAscent < Temp.Ascent) {
                TAscent = Temp.Ascent;
            }
            if (null === TDescent || TDescent > Temp.Ascent - Temp.Height) {
                TDescent = Temp.Ascent - Temp.Height;
            }
        }
    }
    Metrics.Ascent = TAscent;
    Metrics.Descent = TDescent;
};
ParaRun.prototype.Recalculate_Range = function (PRS, ParaPr, Depth) {
    if (this.Paragraph !== PRS.Paragraph) {
        this.Paragraph = PRS.Paragraph;
        this.RecalcInfo.TextPr = true;
        this.RecalcInfo.Measure = true;
        this.protected_UpdateSpellChecking();
    }
    this.Recalculate_MeasureContent();
    var CurLine = PRS.Line - this.StartLine;
    var CurRange = (0 === CurLine ? PRS.Range - this.StartRange : PRS.Range);
    if (0 === CurRange && 0 === CurLine) {
        var PrevRecalcInfo = PRS.RunRecalcInfoLast;
        if (null === PrevRecalcInfo) {
            this.RecalcInfo.NumberingAdd = true;
        } else {
            this.RecalcInfo.NumberingAdd = PrevRecalcInfo.NumberingAdd;
        }
        this.RecalcInfo.NumberingUse = false;
        this.RecalcInfo.NumberingItem = null;
    }
    PRS.RunRecalcInfoLast = this.RecalcInfo;
    var RangeStartPos = this.protected_AddRange(CurLine, CurRange);
    var RangeEndPos = 0;
    var Para = PRS.Paragraph;
    var MoveToLBP = PRS.MoveToLBP;
    var NewRange = PRS.NewRange;
    var ForceNewPage = PRS.ForceNewPage;
    var NewPage = PRS.NewPage;
    var BreakPageLine = PRS.BreakPageLine;
    var End = PRS.End;
    var Word = PRS.Word;
    var StartWord = PRS.StartWord;
    var FirstItemOnLine = PRS.FirstItemOnLine;
    var EmptyLine = PRS.EmptyLine;
    var RangesCount = PRS.RangesCount;
    var SpaceLen = PRS.SpaceLen;
    var WordLen = PRS.WordLen;
    var X = PRS.X;
    var XEnd = PRS.XEnd;
    var ParaLine = PRS.Line;
    var ParaRange = PRS.Range;
    var LineRule = ParaPr.Spacing.LineRule;
    var Pos = RangeStartPos;
    var UpdateLineMetricsText = false;
    var ContentLen = this.Content.length;
    if (false === StartWord && true === FirstItemOnLine && XEnd - X < 0.001 && RangesCount > 0) {
        NewRange = true;
        RangeEndPos = Pos;
    } else {
        for (; Pos < ContentLen; Pos++) {
            var Item = this.Content[Pos];
            var ItemType = Item.Type;
            if (true === this.RecalcInfo.NumberingAdd && true === Item.Can_AddNumbering()) {
                var TempRes = this.Internal_Recalculate_Numbering(Item, PRS.Paragraph, ParaPr, X, PRS.LineAscent, PRS.Page, PRS.Line, PRS.Range);
                X = TempRes.X;
                PRS.LineAscent = TempRes.LineAscent;
            }
            switch (ItemType) {
            case para_Sym:
                case para_Text:
                StartWord = true;
                UpdateLineMetricsText = true;
                var LetterLen = Item.Width / TEXTWIDTH_DIVIDER;
                if (true !== Word) {
                    if (true !== FirstItemOnLine || false === Para.Internal_Check_Ranges(ParaLine, ParaRange)) {
                        if (X + SpaceLen + LetterLen > XEnd) {
                            NewRange = true;
                            RangeEndPos = Pos;
                        }
                    }
                    if (true !== NewRange) {
                        PRS.Set_LineBreakPos(Pos);
                        WordLen = LetterLen;
                        Word = true;
                    }
                } else {
                    if (X + SpaceLen + WordLen + LetterLen > XEnd) {
                        if (true === FirstItemOnLine) {
                            if (false === Para.Internal_Check_Ranges(ParaLine, ParaRange)) {
                                MoveToLBP = true;
                                NewRange = true;
                            } else {
                                EmptyLine = false;
                                X += WordLen;
                                NewRange = true;
                                RangeEndPos = Pos;
                            }
                        } else {
                            MoveToLBP = true;
                            NewRange = true;
                        }
                    }
                    if (true !== NewRange) {
                        WordLen += LetterLen;
                        if (Item.Flags & PARATEXT_FLAGS_SPACEAFTER) {
                            X += SpaceLen + WordLen;
                            Word = false;
                            FirstItemOnLine = false;
                            EmptyLine = false;
                            SpaceLen = 0;
                            WordLen = 0;
                        }
                    }
                }
                break;
            case para_Space:
                FirstItemOnLine = false;
                if (true === Word) {
                    X += SpaceLen + WordLen;
                    Word = false;
                    EmptyLine = false;
                    SpaceLen = 0;
                    WordLen = 0;
                }
                SpaceLen += Item.Width / TEXTWIDTH_DIVIDER;
                break;
            case para_Drawing:
                if (true === Item.Is_Inline() || true === Para.Parent.Is_DrawingShape()) {
                    if (true !== Item.Is_Inline()) {
                        Item.Set_DrawingType(drawing_Inline);
                    }
                    if (true === StartWord) {
                        FirstItemOnLine = false;
                    }
                    Item.YOffset = this.YOffset;
                    if (true === Word || WordLen > 0) {
                        X += SpaceLen + WordLen;
                        Word = false;
                        EmptyLine = false;
                        SpaceLen = 0;
                        WordLen = 0;
                    }
                    var DrawingWidth = Item.Get_Width();
                    if (X + SpaceLen + DrawingWidth > XEnd && (false === FirstItemOnLine || false === Para.Internal_Check_Ranges(ParaLine, ParaRange))) {
                        NewRange = true;
                        RangeEndPos = Pos;
                    } else {
                        if (linerule_Exact === LineRule) {
                            if (PRS.LineAscent < Item.Height) {
                                PRS.LineAscent = Item.Height;
                            }
                        } else {
                            if (PRS.LineAscent < Item.Height + this.YOffset) {
                                PRS.LineAscent = Item.Height + this.YOffset;
                            }
                            if (PRS.LineDescent < -this.YOffset) {
                                PRS.LineDescent = -this.YOffset;
                            }
                        }
                        X += SpaceLen + DrawingWidth;
                        FirstItemOnLine = false;
                        EmptyLine = false;
                    }
                    SpaceLen = 0;
                } else {
                    var LogicDocument = Para.Parent;
                    var LDRecalcInfo = LogicDocument.RecalcInfo;
                    var DrawingObjects = LogicDocument.DrawingObjects;
                    var CurPage = PRS.Page;
                    if (true === LDRecalcInfo.Check_FlowObject(Item) && true === LDRecalcInfo.Is_PageBreakBefore()) {
                        LDRecalcInfo.Reset();
                        if (null != Para.Get_DocumentPrev() && true != Para.Parent.Is_TableCellContent() && 0 === CurPage) {
                            Para.Recalculate_Drawing_AddPageBreak(0, 0, true);
                            PRS.RecalcResult = recalcresult_NextPage;
                            PRS.NewRange = true;
                            return;
                        } else {
                            if (ParaLine != Para.Pages[CurPage].FirstLine) {
                                Para.Recalculate_Drawing_AddPageBreak(CurLine, CurPage, false);
                                PRS.RecalcResult = recalcresult_NextPage;
                                PRS.NewRange = true;
                                return;
                            } else {
                                RangeEndPos = Pos;
                                NewRange = true;
                                ForceNewPage = true;
                            }
                        }
                        if (true === Word || WordLen > 0) {
                            X += SpaceLen + WordLen;
                            Word = false;
                            SpaceLen = 0;
                            WordLen = 0;
                        }
                    }
                }
                break;
            case para_PageNum:
                var LogicDocument = Para.LogicDocument;
                var SectionPage = LogicDocument.Get_SectionPageNumInfo2(PRS.Page + Para.Get_StartPage_Absolute()).CurPage;
                Item.Set_Page(SectionPage);
                if (true === Word || WordLen > 0) {
                    X += SpaceLen + WordLen;
                    Word = false;
                    EmptyLine = false;
                    SpaceLen = 0;
                    WordLen = 0;
                }
                if (true === StartWord) {
                    FirstItemOnLine = false;
                }
                UpdateLineMetricsText = true;
                var PageNumWidth = Item.Get_Width();
                if (X + SpaceLen + PageNumWidth > XEnd && (false === FirstItemOnLine || false === Para.Internal_Check_Ranges(ParaLine, ParaRange))) {
                    NewRange = true;
                    RangeEndPos = Pos;
                } else {
                    X += SpaceLen + PageNumWidth;
                    FirstItemOnLine = false;
                    EmptyLine = false;
                }
                SpaceLen = 0;
                break;
            case para_Tab:
                X = this.Internal_Recalculate_LastTab(PRS.LastTab, X, XEnd, Word, WordLen, SpaceLen);
                X += SpaceLen + WordLen;
                Word = false;
                SpaceLen = 0;
                WordLen = 0;
                var TabPos = Para.Internal_GetTabPos(X, ParaPr, PRS.Page);
                var NewX = TabPos.NewX;
                var TabValue = TabPos.TabValue;
                if (tab_Left !== TabValue) {
                    PRS.LastTab.TabPos = NewX;
                    PRS.LastTab.Value = TabValue;
                    PRS.LastTab.X = X;
                    PRS.LastTab.Item = Item;
                    Item.Width = 0;
                    Item.WidthVisible = 0;
                } else {
                    if (NewX > XEnd && (false === FirstItemOnLine || false === Para.Internal_Check_Ranges(ParaLine, ParaRange))) {
                        WordLen = NewX - X;
                        RangeEndPos = Pos;
                        NewRange = true;
                    } else {
                        Item.Width = NewX - X;
                        Item.WidthVisible = NewX - X;
                        X = NewX;
                    }
                }
                if (RangesCount === CurRange) {
                    if (true === StartWord) {
                        FirstItemOnLine = false;
                        EmptyLine = false;
                    }
                }
                PRS.Set_LineBreakPos(Pos);
                StartWord = true;
                Word = true;
                break;
            case para_NewLine:
                X = this.Internal_Recalculate_LastTab(PRS.LastTab, X, XEnd, Word, WordLen, SpaceLen);
                X += WordLen;
                if (true === Word) {
                    EmptyLine = false;
                    Word = false;
                    X += SpaceLen;
                    SpaceLen = 0;
                }
                if (break_Page === Item.BreakType) {
                    if (true === PRS.SkipPageBreak && Item === PRS.PageBreak) {
                        continue;
                    }
                    Item.Flags.NewLine = true;
                    if (! (Para.Parent instanceof CDocument) || true !== Para.Is_Inline()) {
                        Item.Flags.Use = false;
                        continue;
                    }
                    NewPage = true;
                    NewRange = true;
                    BreakPageLine = true;
                    PRS.PageBreak = Item;
                } else {
                    NewRange = true;
                    EmptyLine = false;
                }
                RangeEndPos = Pos + 1;
                break;
            case para_End:
                if (true === Word) {
                    FirstItemOnLine = false;
                    EmptyLine = false;
                }
                if (false === PRS.ExtendBoundToBottom) {
                    X += WordLen;
                    if (true === Word) {
                        X += SpaceLen;
                        SpaceLen = 0;
                        WordLen = 0;
                    }
                    X = this.Internal_Recalculate_LastTab(PRS.LastTab, X, XEnd, Word, WordLen, SpaceLen);
                }
                NewRange = true;
                End = true;
                RangeEndPos = Pos + 1;
                break;
            }
            if (true === NewRange) {
                break;
            }
        }
    }
    if (true === UpdateLineMetricsText) {
        if (PRS.LineTextAscent < this.TextAscent) {
            PRS.LineTextAscent = this.TextAscent;
        }
        if (PRS.LineTextAscent2 < this.TextAscent2) {
            PRS.LineTextAscent2 = this.TextAscent2;
        }
        if (PRS.LineTextDescent < this.TextDescent) {
            PRS.LineTextDescent = this.TextDescent;
        }
        if (linerule_Exact === LineRule) {
            if (PRS.LineAscent < this.TextAscent) {
                PRS.LineAscent = this.TextAscent;
            }
            if (PRS.LineDescent < this.TextDescent) {
                PRS.LineDescent = this.TextDescent;
            }
        } else {
            if (PRS.LineAscent < this.TextAscent + this.YOffset) {
                PRS.LineAscent = this.TextAscent + this.YOffset;
            }
            if (PRS.LineDescent < this.TextDescent - this.YOffset) {
                PRS.LineDescent = this.TextDescent - this.YOffset;
            }
        }
    }
    PRS.MoveToLBP = MoveToLBP;
    PRS.NewRange = NewRange;
    PRS.ForceNewPage = ForceNewPage;
    PRS.NewPage = NewPage;
    PRS.BreakPageLine = BreakPageLine;
    PRS.End = End;
    PRS.Word = Word;
    PRS.StartWord = StartWord;
    PRS.FirstItemOnLine = FirstItemOnLine;
    PRS.EmptyLine = EmptyLine;
    PRS.SpaceLen = SpaceLen;
    PRS.WordLen = WordLen;
    PRS.X = X;
    PRS.XEnd = XEnd;
    if (Pos >= ContentLen) {
        RangeEndPos = Pos;
    }
    this.protected_FillRange(CurLine, CurRange, RangeStartPos, RangeEndPos);
    this.RecalcInfo.Recalc = false;
};
ParaRun.prototype.Recalculate_Set_RangeEndPos = function (PRS, PRP, Depth) {
    var CurLine = PRS.Line - this.StartLine;
    var CurRange = (0 === CurLine ? PRS.Range - this.StartRange : PRS.Range);
    var CurPos = PRP.Get(Depth);
    this.protected_FillRangeEndPos(CurLine, CurRange, CurPos);
};
ParaRun.prototype.Recalculate_Range_Width = function (PRSC, _CurLine, _CurRange) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    for (var Pos = StartPos; Pos < EndPos; Pos++) {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;
        switch (ItemType) {
        case para_Sym:
            case para_Text:
            PRSC.Letters++;
            if (true !== PRSC.Word) {
                PRSC.Word = true;
                PRSC.Words++;
            }
            PRSC.Range.W += Item.Width / TEXTWIDTH_DIVIDER;
            PRSC.Range.W += PRSC.SpaceLen;
            PRSC.SpaceLen = 0;
            if (PRSC.Words > 1) {
                PRSC.Spaces += PRSC.SpacesCount;
            } else {
                PRSC.SpacesSkip += PRSC.SpacesCount;
            }
            PRSC.SpacesCount = 0;
            if (Item.Flags & PARATEXT_FLAGS_SPACEAFTER) {
                PRSC.Word = false;
            }
            break;
        case para_Space:
            if (true === PRSC.Word) {
                PRSC.Word = false;
                PRSC.SpacesCount = 1;
                PRSC.SpaceLen = Item.Width / TEXTWIDTH_DIVIDER;
            } else {
                PRSC.SpacesCount++;
                PRSC.SpaceLen += Item.Width / TEXTWIDTH_DIVIDER;
            }
            break;
        case para_Drawing:
            PRSC.Words++;
            PRSC.Range.W += PRSC.SpaceLen;
            if (PRSC.Words > 1) {
                PRSC.Spaces += PRSC.SpacesCount;
            } else {
                PRSC.SpacesSkip += PRSC.SpacesCount;
            }
            PRSC.Word = false;
            PRSC.SpacesCount = 0;
            PRSC.SpaceLen = 0;
            if (true === Item.Is_Inline() || true === PRSC.Paragraph.Parent.Is_DrawingShape()) {
                PRSC.Range.W += Item.Get_Width();
            }
            break;
        case para_PageNum:
            PRSC.Words++;
            PRSC.Range.W += PRSC.SpaceLen;
            if (PRSC.Words > 1) {
                PRSC.Spaces += PRSC.SpacesCount;
            } else {
                PRSC.SpacesSkip += PRSC.SpacesCount;
            }
            PRSC.Word = false;
            PRSC.SpacesCount = 0;
            PRSC.SpaceLen = 0;
            PRSC.Range.W += Item.Get_Width();
            break;
        case para_Tab:
            PRSC.Range.W += Item.Get_Width();
            PRSC.Range.W += PRSC.SpaceLen;
            PRSC.LettersSkip += PRSC.Letters;
            PRSC.SpacesSkip += PRSC.Spaces;
            PRSC.Words = 0;
            PRSC.Spaces = 0;
            PRSC.Letters = 0;
            PRSC.SpaceLen = 0;
            PRSC.SpacesCount = 0;
            PRSC.Word = false;
            break;
        case para_NewLine:
            if (true === PRSC.Word && PRSC.Words > 1) {
                PRSC.Spaces += PRSC.SpacesCount;
            }
            PRSC.SpacesCount = 0;
            PRSC.Word = false;
            break;
        case para_End:
            if (true === PRSC.Word) {
                PRSC.Spaces += PRSC.SpacesCount;
            }
            break;
        }
    }
};
ParaRun.prototype.Recalculate_Range_Spaces = function (PRSA, _CurLine, _CurRange, CurPage) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    for (var Pos = StartPos; Pos < EndPos; Pos++) {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;
        switch (ItemType) {
        case para_Sym:
            case para_Text:
            var WidthVisible = 0;
            if (0 !== PRSA.LettersSkip) {
                WidthVisible = Item.Width / TEXTWIDTH_DIVIDER;
                PRSA.LettersSkip--;
            } else {
                WidthVisible = Item.Width / TEXTWIDTH_DIVIDER + PRSA.JustifyWord;
            }
            Item.WidthVisible = (WidthVisible * TEXTWIDTH_DIVIDER) | 0;
            PRSA.X += WidthVisible;
            PRSA.LastW = WidthVisible;
            break;
        case para_Space:
            var WidthVisible = Item.Width / TEXTWIDTH_DIVIDER;
            if (0 !== PRSA.SpacesSkip) {
                PRSA.SpacesSkip--;
            } else {
                if (0 !== PRSA.SpacesCounter) {
                    WidthVisible += PRSA.JustifySpace;
                    PRSA.SpacesCounter--;
                }
            }
            Item.WidthVisible = (WidthVisible * TEXTWIDTH_DIVIDER) | 0;
            PRSA.X += WidthVisible;
            PRSA.LastW = WidthVisible;
            break;
        case para_Drawing:
            var Para = PRSA.Paragraph;
            var LogicDocument = this.Paragraph.LogicDocument;
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
            var DrawingObjects = Para.Parent.DrawingObjects;
            var PageLimits = Para.Parent.Get_PageLimits(Para.PageNum + CurPage);
            var PageFields = Para.Parent.Get_PageFields(Para.PageNum + CurPage);
            var ColumnStartX = (0 === CurPage ? Para.X_ColumnStart : Para.Pages[CurPage].X);
            var ColumnEndX = (0 === CurPage ? Para.X_ColumnEnd : Para.Pages[CurPage].XLimit);
            var Top_Margin = Y_Top_Margin;
            var Bottom_Margin = Y_Bottom_Margin;
            var Page_H = Page_Height;
            if (true === Para.Parent.Is_TableCellContent() && true == Item.Use_TextWrap()) {
                Top_Margin = 0;
                Bottom_Margin = 0;
                Page_H = 0;
            }
            if (true != Item.Use_TextWrap()) {
                PageFields.X = X_Left_Field;
                PageFields.Y = Y_Top_Field;
                PageFields.XLimit = X_Right_Field;
                PageFields.YLimit = Y_Bottom_Field;
                PageLimits.X = 0;
                PageLimits.Y = 0;
                PageLimits.XLimit = Page_Width;
                PageLimits.YLimit = Page_Height;
            }
            var PageLimitsOrigin = Para.Parent.Get_PageLimits(Para.PageNum + CurPage);
            if (true === Item.Is_Inline() || true === Para.Parent.Is_DrawingShape()) {
                Item.Update_Position(PRSA.Paragraph, new CParagraphLayout(PRSA.X, PRSA.Y, Para.Get_StartPage_Absolute() + CurPage, PRSA.LastW, ColumnStartX, ColumnEndX, X_Left_Margin, X_Right_Margin, Page_Width, Top_Margin, Bottom_Margin, Page_H, PageFields.X, PageFields.Y, Para.Pages[CurPage].Y + Para.Lines[CurLine].Y - Para.Lines[CurLine].Metrics.Ascent, Para.Pages[CurPage].Y), PageLimits, PageLimitsOrigin);
                Item.Reset_SavedPosition();
                PRSA.X += Item.WidthVisible;
                PRSA.LastW = Item.WidthVisible;
            } else {
                Para.Pages[CurPage].Add_Drawing(Item);
                if (true === PRSA.RecalcFast) {
                    break;
                }
                if (true === PRSA.RecalcFast2) {
                    var oRecalcObj = Item.Save_RecalculateObject();
                    var Page_abs = Para.Get_StartPage_Absolute() + CurPage;
                    Item.Update_Position(PRSA.Paragraph, new CParagraphLayout(PRSA.X, PRSA.Y, Page_abs, PRSA.LastW, ColumnStartX, ColumnEndX, X_Left_Margin, X_Right_Margin, Page_Width, Top_Margin, Bottom_Margin, Page_H, PageFields.X, PageFields.Y, Para.Pages[CurPage].Y + Para.Lines[CurLine].Y - Para.Lines[CurLine].Metrics.Ascent, Para.Pages[CurPage].Y), PageLimits, PageLimitsOrigin);
                    if (Math.abs(Item.X - oRecalcObj.X) > 0.001 || Math.abs(Item.Y - oRecalcObj.Y) > 0.001 || Item.PageNum !== oRecalcObj.PageNum) {
                        PRSA.RecalcResult = recalcresult_CurPage;
                        return;
                    }
                    break;
                }
                if (true === Item.Use_TextWrap()) {
                    var LogicDocument = Para.Parent;
                    var LDRecalcInfo = Para.Parent.RecalcInfo;
                    var Page_abs = Para.Get_StartPage_Absolute() + CurPage;
                    if (true === LDRecalcInfo.Can_RecalcObject()) {
                        Item.Update_Position(PRSA.Paragraph, new CParagraphLayout(PRSA.X, PRSA.Y, Page_abs, PRSA.LastW, ColumnStartX, ColumnEndX, X_Left_Margin, X_Right_Margin, Page_Width, Top_Margin, Bottom_Margin, Page_H, PageFields.X, PageFields.Y, Para.Pages[CurPage].Y + Para.Lines[CurLine].Y - Para.Lines[CurLine].Metrics.Ascent, Para.Pages[CurPage].Y), PageLimits, PageLimitsOrigin);
                        LDRecalcInfo.Set_FlowObject(Item, 0, recalcresult_NextElement, -1);
                        if (0 === PRSA.CurPage && Item.wrappingPolygon.top > PRSA.PageY + 0.001) {
                            PRSA.RecalcResult = recalcresult_CurPagePara;
                        } else {
                            PRSA.RecalcResult = recalcresult_CurPage;
                        }
                        return;
                    } else {
                        if (true === LDRecalcInfo.Check_FlowObject(Item)) {
                            if (Item.PageNum === Page_abs) {
                                LDRecalcInfo.Reset();
                                Item.Reset_SavedPosition();
                            } else {
                                if (true === Para.Parent.Is_TableCellContent()) {
                                    Item.Update_Position(PRSA.Paragraph, new CParagraphLayout(PRSA.X, PRSA.Y, Page_abs, PRSA.LastW, ColumnStartX, ColumnEndX, X_Left_Margin, X_Right_Margin, Page_Width, Top_Margin, Bottom_Margin, Page_H, PageFields.X, PageFields.Y, Para.Pages[CurPage].Y + Para.Lines[CurLine].Y - Para.Lines[CurLine].Metrics.Ascent, Para.Pages[CurPage].Y), PageLimits, PageLimitsOrigin);
                                    LDRecalcInfo.Set_FlowObject(Item, 0, recalcresult_NextElement, -1);
                                    LDRecalcInfo.Set_PageBreakBefore(false);
                                    PRSA.RecalcResult = recalcresult_CurPage;
                                    return;
                                } else {
                                    LDRecalcInfo.Set_PageBreakBefore(true);
                                    DrawingObjects.removeById(Item.PageNum, Item.Get_Id());
                                    PRSA.RecalcResult = recalcresult_PrevPage;
                                    return;
                                }
                            }
                        } else {}
                    }
                    continue;
                } else {
                    Item.Update_Position(PRSA.Paragraph, new CParagraphLayout(PRSA.X, PRSA.Y, Para.Get_StartPage_Absolute() + CurPage, PRSA.LastW, ColumnStartX, ColumnEndX, X_Left_Margin, X_Right_Margin, Page_Width, Top_Margin, Bottom_Margin, Page_H, PageFields.X, PageFields.Y, Para.Pages[CurPage].Y + Para.Lines[CurLine].Y - Para.Lines[CurLine].Metrics.Ascent, Para.Pages[CurPage].Y), PageLimits, PageLimitsOrigin);
                    Item.Reset_SavedPosition();
                }
            }
            break;
        case para_PageNum:
            PRSA.X += Item.WidthVisible;
            PRSA.LastW = Item.WidthVisible;
            break;
        case para_Tab:
            PRSA.X += Item.WidthVisible;
            break;
        case para_End:
            var SectPr = PRSA.Paragraph.Get_SectionPr();
            if (undefined !== SectPr) {
                var LogicDocument = PRSA.Paragraph.LogicDocument;
                var NextSectPr = LogicDocument.SectionsInfo.Get_SectPr(PRSA.Paragraph.Index + 1).SectPr;
                Item.Update_SectionPr(NextSectPr, PRSA.XEnd - PRSA.X);
            } else {
                Item.Clear_SectionPr();
            }
            PRSA.X += Item.Get_Width();
            break;
        case para_NewLine:
            if (break_Page === Item.BreakType) {
                Item.Update_String(PRSA.XEnd - PRSA.X);
            }
            PRSA.X += Item.WidthVisible;
            break;
        }
    }
};
ParaRun.prototype.Recalculate_PageEndInfo = function (PRSI, _CurLine, _CurRange) {};
ParaRun.prototype.Internal_Recalculate_Numbering = function (Item, Para, ParaPr, _X, _LineAscent, CurPage, CurLine, CurRange) {
    var X = _X,
    LineAscent = _LineAscent;
    var NumberingItem = Para.Numbering;
    var NumberingType = Para.Numbering.Type;
    if (para_Numbering === NumberingType) {
        var NumPr = ParaPr.NumPr;
        if (undefined === NumPr || undefined === NumPr.NumId || 0 === NumPr.NumId || "0" === NumPr.NumId || (undefined !== Para.Get_SectionPr() && true === Para.IsEmpty())) {
            NumberingItem.Measure(g_oTextMeasurer, undefined);
        } else {
            var Numbering = Para.Parent.Get_Numbering();
            var NumLvl = Numbering.Get_AbstractNum(NumPr.NumId).Lvl[NumPr.Lvl];
            var NumSuff = NumLvl.Suff;
            var NumJc = NumLvl.Jc;
            var NumInfo = Para.Parent.Internal_GetNumInfo(Para.Id, NumPr);
            var NumTextPr = Para.Get_CompiledPr2(false).TextPr.Copy();
            NumTextPr.Merge(Para.TextPr.Value);
            NumTextPr.Merge(NumLvl.TextPr);
            NumberingItem.Measure(g_oTextMeasurer, Numbering, NumInfo, NumTextPr, NumPr, Para.Get_Theme());
            if (LineAscent < NumberingItem.Height) {
                LineAscent = NumberingItem.Height;
            }
            switch (NumJc) {
            case align_Right:
                NumberingItem.WidthVisible = 0;
                break;
            case align_Center:
                NumberingItem.WidthVisible = NumberingItem.WidthNum / 2;
                break;
            case align_Left:
                default:
                NumberingItem.WidthVisible = NumberingItem.WidthNum;
                break;
            }
            X += NumberingItem.WidthVisible;
            switch (NumSuff) {
            case numbering_suff_Nothing:
                break;
            case numbering_suff_Space:
                var OldTextPr = g_oTextMeasurer.GetTextPr();
                var Theme = Para.Get_Theme();
                g_oTextMeasurer.SetTextPr(NumTextPr, Theme);
                g_oTextMeasurer.SetFontSlot(fontslot_ASCII);
                NumberingItem.WidthSuff = g_oTextMeasurer.Measure(" ").Width;
                g_oTextMeasurer.SetTextPr(OldTextPr, Theme);
                break;
            case numbering_suff_Tab:
                var NewX = Para.Internal_GetTabPos(X, ParaPr, CurPage).NewX;
                NumberingItem.WidthSuff = NewX - X;
                break;
            }
            NumberingItem.Width = NumberingItem.WidthNum;
            NumberingItem.WidthVisible += NumberingItem.WidthSuff;
            X += NumberingItem.WidthSuff;
        }
    } else {
        if (para_PresentationNumbering === NumberingType) {
            var Level = Para.PresentationPr.Level;
            var Bullet = Para.PresentationPr.Bullet;
            var BulletNum = 0;
            if (Bullet.Get_Type() >= numbering_presentationnumfrmt_ArabicPeriod) {
                var Prev = Para.Prev;
                while (null != Prev && type_Paragraph === Prev.GetType()) {
                    var PrevLevel = Prev.PresentationPr.Level;
                    var PrevBullet = Prev.Get_PresentationNumbering();
                    if (Level < PrevLevel) {
                        Prev = Prev.Prev;
                        continue;
                    } else {
                        if (Level > PrevLevel) {
                            break;
                        } else {
                            if (PrevBullet.Get_Type() === Bullet.Get_Type() && PrevBullet.Get_StartAt() === PrevBullet.Get_StartAt()) {
                                if (true != Prev.IsEmpty()) {
                                    BulletNum++;
                                }
                                Prev = Prev.Prev;
                            } else {
                                break;
                            }
                        }
                    }
                }
            }
            var FirstTextPr = Para.Get_FirstTextPr();
            NumberingItem.Bullet = Bullet;
            NumberingItem.BulletNum = BulletNum + 1;
            NumberingItem.Measure(g_oTextMeasurer, FirstTextPr, Para.Get_Theme());
            if (numbering_presentationnumfrmt_None != Bullet.Get_Type()) {
                if (ParaPr.Ind.FirstLine < 0) {
                    NumberingItem.WidthVisible = Math.max(NumberingItem.Width, Para.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine - X, Para.X + ParaPr.Ind.Left - X);
                } else {
                    NumberingItem.WidthVisible = Math.max(Para.X + ParaPr.Ind.Left + NumberingItem.Width - X, Para.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine - X, Para.X + ParaPr.Ind.Left - X);
                }
            }
            X += NumberingItem.WidthVisible;
        }
    }
    this.RecalcInfo.NumberingAdd = false;
    this.RecalcInfo.NumberingUse = true;
    this.RecalcInfo.NumberingItem = NumberingItem;
    NumberingItem.Item = Item;
    NumberingItem.Run = this;
    NumberingItem.Line = CurLine;
    NumberingItem.Range = CurRange;
    return {
        X: X,
        LineAscent: LineAscent
    };
};
ParaRun.prototype.Internal_Recalculate_LineMetrics = function (PRS, SpacingLineRule) {
    if (PRS.LineTextAscent < this.TextAscent) {
        PRS.LineTextAscent = this.TextAscent;
    }
    if (PRS.LineTextAscent2 < this.TextAscent2) {
        PRS.LineTextAscent2 = this.TextAscent2;
    }
    if (PRS.LineTextDescent < this.TextDescent) {
        PRS.LineTextDescent = this.TextDescent;
    }
    if (linerule_Exact === SpacingLineRule) {
        if (PRS.LineAscent < this.TextAscent) {
            PRS.LineAscent = this.TextAscent;
        }
        if (PRS.LineDescent < this.TextDescent) {
            PRS.LineDescent = this.TextDescent;
        }
    } else {
        if (PRS.LineAscent < this.TextAscent + this.YOffset) {
            PRS.LineAscent = this.TextAscent + this.YOffset;
        }
        if (PRS.LineDescent < this.TextDescent - this.YOffset) {
            PRS.LineDescent = this.TextDescent - this.YOffset;
        }
    }
};
ParaRun.prototype.Internal_Recalculate_LastTab = function (LastTab, X, XEnd, Word, WordLen, SpaceLen) {
    if (-1 !== LastTab.Value) {
        var TempXPos = X;
        if (true === Word || WordLen > 0) {
            TempXPos += SpaceLen + WordLen;
        }
        var TabItem = LastTab.Item;
        var TabStartX = LastTab.X;
        var TabRangeW = TempXPos - TabStartX;
        var TabValue = LastTab.Value;
        var TabPos = LastTab.TabPos;
        var TabCalcW = 0;
        if (tab_Right === TabValue) {
            TabCalcW = Math.max(TabPos - (TabStartX + TabRangeW), 0);
        } else {
            if (tab_Center === TabValue) {
                TabCalcW = Math.max(TabPos - (TabStartX + TabRangeW / 2), 0);
            }
        }
        if (X + TabCalcW > XEnd) {
            TabCalcW = XEnd - X;
        }
        TabItem.Width = TabCalcW;
        TabItem.WidthVisible = TabCalcW;
        LastTab.Reset();
        return X + TabCalcW;
    }
    return X;
};
ParaRun.prototype.Refresh_RecalcData = function (Data) {
    var Para = this.Paragraph;
    if (this.Type == para_Math_Run) {
        if (this.Parent !== null && this.Parent !== undefined) {
            this.Parent.Refresh_RecalcData();
        }
    } else {
        if (-1 !== this.StartLine && undefined !== Para) {
            var CurLine = this.StartLine;
            var PagesCount = Para.Pages.length;
            for (var CurPage = 0; CurPage < PagesCount; CurPage++) {
                var Page = Para.Pages[CurPage];
                if (Page.StartLine <= CurLine && Page.EndLine >= CurLine) {
                    Para.Refresh_RecalcData2(CurPage);
                    return;
                }
            }
            Para.Refresh_RecalcData2(0);
        }
    }
};
ParaRun.prototype.Save_RecalculateObject = function (Copy) {
    var RecalcObj = new CRunRecalculateObject(this.StartLine, this.StartRange);
    RecalcObj.Save_Lines(this, Copy);
    RecalcObj.Save_RunContent(this, Copy);
    return RecalcObj;
};
ParaRun.prototype.Load_RecalculateObject = function (RecalcObj) {
    RecalcObj.Load_Lines(this);
    RecalcObj.Load_RunContent(this);
};
ParaRun.prototype.Prepare_RecalculateObject = function () {
    this.protected_ClearLines();
    var Count = this.Content.length;
    for (var Index = 0; Index < Count; Index++) {
        var Item = this.Content[Index];
        var ItemType = Item.Type;
        if (para_PageNum === ItemType || para_Drawing === ItemType) {
            Item.Prepare_RecalculateObject();
        }
    }
};
ParaRun.prototype.Is_EmptyRange = function (_CurLine, _CurRange) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    if (EndPos <= StartPos) {
        return true;
    }
    return false;
};
ParaRun.prototype.Check_Range_OnlyMath = function (Checker, _CurRange, _CurLine) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    for (var Pos = StartPos; Pos < EndPos; Pos++) {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;
        if (para_End === ItemType || para_NewLine === ItemType || (para_Drawing === ItemType && true !== Item.Is_Inline())) {
            continue;
        } else {
            Checker.Result = false;
            Checker.Math = null;
            break;
        }
    }
};
ParaRun.prototype.Check_MathPara = function (Checker) {
    var Count = this.Content.length;
    if (Count <= 0) {
        return;
    }
    var Item = (Checker.Direction > 0 ? this.Content[0] : this.Content[Count - 1]);
    var ItemType = Item.Type;
    if (para_End === ItemType || para_NewLine === ItemType) {
        Checker.Result = true;
        Checker.Found = true;
    } else {
        Checker.Result = false;
        Checker.Found = true;
    }
};
ParaRun.prototype.Check_PageBreak = function () {
    var Count = this.Content.length;
    for (var Pos = 0; Pos < Count; Pos++) {
        var Item = this.Content[Pos];
        if (para_NewLine === Item.Type && break_Page === Item.BreakType) {
            return true;
        }
    }
    return false;
};
ParaRun.prototype.Check_BreakPageEnd = function (PBChecker) {
    var ContentLen = this.Content.length;
    for (var CurPos = 0; CurPos < ContentLen; CurPos++) {
        var Item = this.Content[CurPos];
        if (true === PBChecker.FindPB) {
            if (Item === PBChecker.PageBreak) {
                PBChecker.FindPB = false;
                PBChecker.PageBreak.Flags.NewLine = true;
            }
        } else {
            var ItemType = Item.Type;
            if (para_End === ItemType) {
                return true;
            } else {
                if (para_Drawing !== ItemType || drawing_Anchor !== Item.Get_DrawingType()) {
                    return false;
                }
            }
        }
    }
    return true;
};
ParaRun.prototype.Recalculate_MinMaxContentWidth = function (MinMax) {
    this.Recalculate_MeasureContent();
    var bWord = MinMax.bWord;
    var nWordLen = MinMax.nWordLen;
    var nSpaceLen = MinMax.nSpaceLen;
    var nMinWidth = MinMax.nMinWidth;
    var nMaxWidth = MinMax.nMaxWidth;
    var nCurMaxWidth = MinMax.nCurMaxWidth;
    var Count = this.Content.length;
    for (var Pos = 0; Pos < Count; Pos++) {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;
        switch (ItemType) {
        case para_Text:
            var ItemWidth = Item.Width / TEXTWIDTH_DIVIDER;
            if (false === bWord) {
                bWord = true;
                nWordLen = ItemWidth;
            } else {
                nWordLen += ItemWidth;
                if (Item.Flags & PARATEXT_FLAGS_SPACEAFTER) {
                    if (nMinWidth < nWordLen) {
                        nMinWidth = nWordLen;
                    }
                    bWord = false;
                    nWordLen = 0;
                }
            }
            if (nSpaceLen > 0) {
                nCurMaxWidth += nSpaceLen;
                nSpaceLen = 0;
            }
            nCurMaxWidth += ItemWidth;
            break;
        case para_Space:
            if (true === bWord) {
                if (nMinWidth < nWordLen) {
                    nMinWidth = nWordLen;
                }
                bWord = false;
                nWordLen = 0;
            }
            nSpaceLen += Item.Width / TEXTWIDTH_DIVIDER;
            break;
        case para_Drawing:
            if (true === bWord) {
                if (nMinWidth < nWordLen) {
                    nMinWidth = nWordLen;
                }
                bWord = false;
                nWordLen = 0;
            }
            if ((true === Item.Is_Inline() || true === this.Paragraph.Parent.Is_DrawingShape()) && Item.Width > nMinWidth) {
                nMinWidth = Item.Width;
            }
            if (nSpaceLen > 0) {
                nCurMaxWidth += nSpaceLen;
                nSpaceLen = 0;
            }
            if (true === Item.Is_Inline() || true === this.Paragraph.Parent.Is_DrawingShape()) {
                nCurMaxWidth += Item.Width;
            }
            break;
        case para_PageNum:
            if (true === bWord) {
                if (nMinWidth < nWordLen) {
                    nMinWidth = nWordLen;
                }
                bWord = false;
                nWordLen = 0;
            }
            if (Item.Width > nMinWidth) {
                nMinWidth = Item.Width;
            }
            if (nSpaceLen > 0) {
                nCurMaxWidth += nSpaceLen;
                nSpaceLen = 0;
            }
            nCurMaxWidth += Item.Width;
            break;
        case para_Tab:
            nWordLen += Item.Width;
            if (nMinWidth < nWordLen) {
                nMinWidth = nWordLen;
            }
            bWord = false;
            nWordLen = 0;
            if (nSpaceLen > 0) {
                nCurMaxWidth += nSpaceLen;
                nSpaceLen = 0;
            }
            nCurMaxWidth += Item.Width;
            break;
        case para_NewLine:
            if (nMinWidth < nWordLen) {
                nMinWidth = nWordLen;
            }
            bWord = false;
            nWordLen = 0;
            nSpaceLen = 0;
            if (nCurMaxWidth > nMaxWidth) {
                nMaxWidth = nCurMaxWidth;
            }
            nCurMaxWidth = 0;
            break;
        case para_End:
            if (nMinWidth < nWordLen) {
                nMinWidth = nWordLen;
            }
            if (nCurMaxWidth > nMaxWidth) {
                nMaxWidth = nCurMaxWidth;
            }
            break;
        }
    }
    MinMax.bWord = bWord;
    MinMax.nWordLen = nWordLen;
    MinMax.nSpaceLen = nSpaceLen;
    MinMax.nMinWidth = nMinWidth;
    MinMax.nMaxWidth = nMaxWidth;
    MinMax.nCurMaxWidth = nCurMaxWidth;
};
ParaRun.prototype.Get_Range_VisibleWidth = function (RangeW, _CurLine, _CurRange) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    for (var Pos = StartPos; Pos < EndPos; Pos++) {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;
        switch (ItemType) {
        case para_Sym:
            case para_Text:
            case para_Space:
            RangeW.W += Item.Get_WidthVisible();
            break;
        case para_Drawing:
            if (true === Item.Is_Inline()) {
                RangeW.W += Item.Width;
            }
            break;
        case para_PageNum:
            case para_Tab:
            RangeW.W += Item.Width;
            break;
        case para_NewLine:
            RangeW.W += Item.WidthVisible;
            break;
        case para_End:
            RangeW.W += Item.Get_WidthVisible();
            RangeW.End = true;
            break;
        }
    }
};
ParaRun.prototype.Shift_Range = function (Dx, Dy, _CurLine, _CurRange) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    for (var CurPos = StartPos; CurPos < EndPos; CurPos++) {
        var Item = this.Content[CurPos];
        if (para_Drawing === Item.Type) {
            Item.Shift(Dx, Dy);
        }
    }
};
ParaRun.prototype.Draw_HighLights = function (PDSH) {
    var pGraphics = PDSH.Graphics;
    var CurLine = PDSH.Line - this.StartLine;
    var CurRange = (0 === CurLine ? PDSH.Range - this.StartRange : PDSH.Range);
    var aHigh = PDSH.High;
    var aColl = PDSH.Coll;
    var aFind = PDSH.Find;
    var aComm = PDSH.Comm;
    var aShd = PDSH.Shd;
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    var Para = PDSH.Paragraph;
    var SearchResults = Para.SearchResults;
    var bDrawFind = PDSH.DrawFind;
    var bDrawColl = PDSH.DrawColl;
    var oShd = this.Get_CompiledPr(false).Shd;
    var bDrawShd = (oShd === undefined || shd_Nil === oShd.Value ? false : true);
    var ShdColor = (true === bDrawShd ? oShd.Get_Color(PDSH.Paragraph) : null);
    if (this.Type == para_Math_Run && this.IsPlaceholder()) {
        bDrawShd = false;
    }
    var X = PDSH.X;
    var Y0 = PDSH.Y0;
    var Y1 = PDSH.Y1;
    var CommentsCount = PDSH.Comments.length;
    var CommentId = (CommentsCount > 0 ? PDSH.Comments[CommentsCount - 1] : null);
    var CommentsFlag = PDSH.CommentsFlag;
    var HighLight = this.Get_CompiledPr(false).HighLight;
    var SearchMarksCount = this.SearchMarks.length;
    this.CollaborativeMarks.Init_Drawing();
    for (var Pos = StartPos; Pos < EndPos; Pos++) {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;
        var ItemWidthVisible = Item.Get_WidthVisible();
        for (var SPos = 0; SPos < SearchMarksCount; SPos++) {
            var Mark = this.SearchMarks[SPos];
            var MarkPos = Mark.SearchResult.StartPos.Get(Mark.Depth);
            if (Pos === MarkPos && true === Mark.Start) {
                PDSH.SearchCounter++;
            }
        }
        var DrawSearch = (PDSH.SearchCounter > 0 && true === bDrawFind ? true : false);
        var DrawColl = this.CollaborativeMarks.Check(Pos);
        if (true === bDrawShd) {
            aShd.Add(Y0, Y1, X, X + ItemWidthVisible, 0, ShdColor.r, ShdColor.g, ShdColor.b);
        }
        switch (ItemType) {
        case para_PageNum:
            case para_Drawing:
            case para_Tab:
            case para_Text:
            case para_Math_Text:
            case para_Math_Ampersand:
            case para_Sym:
            if (para_Drawing === ItemType && drawing_Anchor === Item.DrawingType) {
                break;
            }
            if (CommentsFlag != comments_NoComment) {
                aComm.Add(Y0, Y1, X, X + ItemWidthVisible, 0, 0, 0, 0, {
                    Active: CommentsFlag === comments_ActiveComment ? true : false,
                    CommentId: CommentId
                });
            } else {
                if (highlight_None != HighLight) {
                    aHigh.Add(Y0, Y1, X, X + ItemWidthVisible, 0, HighLight.r, HighLight.g, HighLight.b);
                }
            }
            if (true === DrawSearch) {
                aFind.Add(Y0, Y1, X, X + ItemWidthVisible, 0, 0, 0, 0);
            } else {
                if (null !== DrawColl) {
                    aColl.Add(Y0, Y1, X, X + ItemWidthVisible, 0, DrawColl.r, DrawColl.g, DrawColl.b);
                }
            }
            if (para_Drawing != ItemType || drawing_Anchor != Item.DrawingType) {
                X += ItemWidthVisible;
            }
            break;
        case para_Space:
            if (PDSH.Spaces > 0) {
                if (CommentsFlag != comments_NoComment) {
                    aComm.Add(Y0, Y1, X, X + ItemWidthVisible, 0, 0, 0, 0, {
                        Active: CommentsFlag === comments_ActiveComment ? true : false,
                        CommentId: CommentId
                    });
                } else {
                    if (highlight_None != HighLight) {
                        aHigh.Add(Y0, Y1, X, X + ItemWidthVisible, 0, HighLight.r, HighLight.g, HighLight.b);
                    }
                }
                PDSH.Spaces--;
            }
            if (true === DrawSearch) {
                aFind.Add(Y0, Y1, X, X + ItemWidthVisible, 0, 0, 0, 0);
            } else {
                if (null !== DrawColl) {
                    aColl.Add(Y0, Y1, X, X + ItemWidthVisible, 0, DrawColl.r, DrawColl.g, DrawColl.b);
                }
            }
            X += ItemWidthVisible;
            break;
        case para_End:
            if (null !== DrawColl) {
                aColl.Add(Y0, Y1, X, X + ItemWidthVisible, 0, DrawColl.r, DrawColl.g, DrawColl.b);
            }
            X += Item.Get_Width();
            break;
        case para_NewLine:
            X += ItemWidthVisible;
            break;
        }
        for (var SPos = 0; SPos < SearchMarksCount; SPos++) {
            var Mark = this.SearchMarks[SPos];
            var MarkPos = Mark.SearchResult.EndPos.Get(Mark.Depth);
            if (Pos + 1 === MarkPos && true !== Mark.Start) {
                PDSH.SearchCounter--;
            }
        }
    }
    PDSH.X = X;
};
ParaRun.prototype.Draw_Elements = function (PDSE) {
    var CurLine = PDSE.Line - this.StartLine;
    var CurRange = (0 === CurLine ? PDSE.Range - this.StartRange : PDSE.Range);
    var CurPage = PDSE.Page;
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    var Para = PDSE.Paragraph;
    var pGraphics = PDSE.Graphics;
    var BgColor = PDSE.BgColor;
    var Theme = PDSE.Theme;
    var FontScheme = Theme.themeElements.fontScheme;
    var X = PDSE.X;
    var Y = PDSE.Y;
    var CurTextPr = this.Get_CompiledPr(false);
    pGraphics.SetTextPr(CurTextPr, Theme);
    var InfoMathText;
    if (this.Type == para_Math_Run) {
        Y += this.size.ascent;
        var ArgSize = this.Parent.Compiled_ArgSz.value,
        bNormalText = this.IsNormalText();
        InfoMathText = new CMathInfoTextPr_2(CurTextPr, ArgSize, bNormalText);
    }
    if (undefined !== CurTextPr.Shd && shd_Nil !== CurTextPr.Shd.Value) {
        BgColor = CurTextPr.Shd.Get_Color(Para);
    }
    var AutoColor = (undefined != BgColor && false === BgColor.Check_BlackAutoColor() ? new CDocumentColor(255, 255, 255, false) : new CDocumentColor(0, 0, 0, false));
    var RGBA;
    if (CurTextPr.Unifill) {
        CurTextPr.Unifill.check(PDSE.Theme, PDSE.ColorMap);
        RGBA = CurTextPr.Unifill.getRGBAColor();
        if (true === PDSE.VisitedHyperlink && (undefined === this.Pr.Color && undefined === this.Pr.Unifill)) {
            G_O_VISITED_HLINK_COLOR.check(PDSE.Theme, PDSE.ColorMap);
            RGBA = G_O_VISITED_HLINK_COLOR.getRGBAColor();
            pGraphics.b_color1(RGBA.R, RGBA.G, RGBA.B, RGBA.A);
        } else {
            pGraphics.b_color1(RGBA.R, RGBA.G, RGBA.B, RGBA.A);
        }
    } else {
        if (true === PDSE.VisitedHyperlink && (undefined === this.Pr.Color && undefined === this.Pr.Unifill)) {
            G_O_VISITED_HLINK_COLOR.check(PDSE.Theme, PDSE.ColorMap);
            RGBA = G_O_VISITED_HLINK_COLOR.getRGBAColor();
            pGraphics.b_color1(RGBA.R, RGBA.G, RGBA.B, RGBA.A);
        } else {
            if (true === CurTextPr.Color.Auto) {
                pGraphics.b_color1(AutoColor.r, AutoColor.g, AutoColor.b, 255);
            } else {
                pGraphics.b_color1(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
            }
        }
    }
    for (var Pos = StartPos; Pos < EndPos; Pos++) {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;
        var TempY = Y;
        switch (CurTextPr.VertAlign) {
        case vertalign_SubScript:
            Y -= vertalign_Koef_Sub * CurTextPr.FontSize * g_dKoef_pt_to_mm;
            break;
        case vertalign_SuperScript:
            Y -= vertalign_Koef_Super * CurTextPr.FontSize * g_dKoef_pt_to_mm;
            break;
        }
        switch (ItemType) {
        case para_PageNum:
            case para_Drawing:
            case para_Tab:
            case para_Text:
            case para_Sym:
            if (para_Tab === ItemType) {
                pGraphics.p_color(0, 0, 0, 255);
                pGraphics.b_color1(0, 0, 0, 255);
            }
            if (para_Drawing != ItemType || drawing_Anchor != Item.DrawingType) {
                Item.Draw(X, Y - this.YOffset, pGraphics);
                X += Item.Get_WidthVisible();
            }
            if ((para_Drawing === ItemType && drawing_Inline === Item.DrawingType) || (para_Tab === ItemType)) {
                pGraphics.SetTextPr(CurTextPr, Theme);
                if (RGBA) {
                    pGraphics.b_color1(RGBA.R, RGBA.G, RGBA.B, 255);
                    pGraphics.p_color(RGBA.R, RGBA.G, RGBA.B, 255);
                } else {
                    if (true === CurTextPr.Color.Auto) {
                        pGraphics.b_color1(AutoColor.r, AutoColor.g, AutoColor.b, 255);
                        pGraphics.p_color(AutoColor.r, AutoColor.g, AutoColor.b, 255);
                    } else {
                        pGraphics.b_color1(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
                        pGraphics.p_color(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
                    }
                }
            }
            break;
        case para_Space:
            Item.Draw(X, Y - this.YOffset, pGraphics);
            X += Item.Get_WidthVisible();
            break;
        case para_End:
            var SectPr = Para.Get_SectionPr();
            if (undefined === SectPr) {
                var EndTextPr = Para.Get_CompiledPr2(false).TextPr.Copy();
                EndTextPr.Merge(Para.TextPr.Value);
                if (EndTextPr.Unifill) {
                    EndTextPr.Unifill.check(PDSE.Theme, PDSE.ColorMap);
                    var RGBAEnd = EndTextPr.Unifill.getRGBAColor();
                    pGraphics.SetTextPr(EndTextPr, PDSE.Theme);
                    pGraphics.b_color1(RGBAEnd.R, RGBAEnd.G, RGBAEnd.B, 255);
                } else {
                    pGraphics.SetTextPr(EndTextPr, PDSE.Theme);
                    if (true === EndTextPr.Color.Auto) {
                        pGraphics.b_color1(AutoColor.r, AutoColor.g, AutoColor.b, 255);
                    } else {
                        pGraphics.b_color1(EndTextPr.Color.r, EndTextPr.Color.g, EndTextPr.Color.b, 255);
                    }
                }
                var bEndCell = false;
                if (null === Para.Get_DocumentNext() && true === Para.Parent.Is_TableCellContent()) {
                    bEndCell = true;
                }
                Item.Draw(X, Y - this.YOffset, pGraphics, bEndCell);
            } else {
                Item.Draw(X, Y - this.YOffset, pGraphics, false);
            }
            X += Item.Get_Width();
            break;
        case para_NewLine:
            Item.Draw(X, Y - this.YOffset, pGraphics);
            X += Item.WidthVisible;
            break;
        case para_Math_Ampersand:
            case para_Math_Text:
            case para_Math_Placeholder:
            Item.draw(X, Y, pGraphics, InfoMathText);
            break;
        }
        Y = TempY;
    }
    PDSE.X = X;
};
ParaRun.prototype.Draw_Lines = function (PDSL) {
    var CurLine = PDSL.Line - this.StartLine;
    var CurRange = (0 === CurLine ? PDSL.Range - this.StartRange : PDSL.Range);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    var X = PDSL.X;
    var Y = PDSL.Baseline;
    var UndOff = PDSL.UnderlineOffset;
    var Para = PDSL.Paragraph;
    var aStrikeout = PDSL.Strikeout;
    var aDStrikeout = PDSL.DStrikeout;
    var aUnderline = PDSL.Underline;
    var aSpelling = PDSL.Spelling;
    var CurTextPr = this.Get_CompiledPr(false);
    var StrikeoutY = Y - this.YOffset;
    switch (CurTextPr.VertAlign) {
    case vertalign_Baseline:
        StrikeoutY += -CurTextPr.FontSize * g_dKoef_pt_to_mm * 0.27;
        break;
    case vertalign_SubScript:
        StrikeoutY += -CurTextPr.FontSize * vertalign_Koef_Size * g_dKoef_pt_to_mm * 0.27 - vertalign_Koef_Sub * CurTextPr.FontSize * g_dKoef_pt_to_mm;
        break;
    case vertalign_SuperScript:
        StrikeoutY += -CurTextPr.FontSize * vertalign_Koef_Size * g_dKoef_pt_to_mm * 0.27 - vertalign_Koef_Super * CurTextPr.FontSize * g_dKoef_pt_to_mm;
        break;
    }
    var UnderlineY = Y + UndOff - this.YOffset;
    var LineW = (CurTextPr.FontSize / 18) * g_dKoef_pt_to_mm;
    var BgColor = PDSL.BgColor;
    if (undefined !== CurTextPr.Shd && shd_Nil !== CurTextPr.Shd.Value) {
        BgColor = CurTextPr.Shd.Get_Color(Para);
    }
    var AutoColor = (undefined != BgColor && false === BgColor.Check_BlackAutoColor() ? new CDocumentColor(255, 255, 255, false) : new CDocumentColor(0, 0, 0, false));
    var CurColor, RGBA, Theme = this.Paragraph.Get_Theme(),
    ColorMap = this.Paragraph.Get_ColorMap();
    if (true === PDSL.VisitedHyperlink && (undefined === this.Pr.Color && undefined === this.Pr.Unifill)) {
        CurColor = new CDocumentColor(128, 0, 151);
    } else {
        if (true === CurTextPr.Color.Auto && !CurTextPr.Unifill) {
            CurColor = new CDocumentColor(AutoColor.r, AutoColor.g, AutoColor.b);
        } else {
            if (CurTextPr.Unifill) {
                CurTextPr.Unifill.check(Theme, ColorMap);
                RGBA = CurTextPr.Unifill.getRGBAColor();
                CurColor = new CDocumentColor(RGBA.R, RGBA.G, RGBA.B);
            } else {
                CurColor = new CDocumentColor(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b);
            }
        }
    }
    var SpellingMarksArray = {};
    var SpellingMarksCount = this.SpellingMarks.length;
    for (var SPos = 0; SPos < SpellingMarksCount; SPos++) {
        var Mark = this.SpellingMarks[SPos];
        if (false === Mark.Element.Checked) {
            if (true === Mark.Start) {
                var MarkPos = Mark.Element.StartPos.Get(Mark.Depth);
                if (undefined === SpellingMarksArray[MarkPos]) {
                    SpellingMarksArray[MarkPos] = 1;
                } else {
                    SpellingMarksArray[MarkPos] += 1;
                }
            } else {
                var MarkPos = Mark.Element.EndPos.Get(Mark.Depth);
                if (undefined === SpellingMarksArray[MarkPos]) {
                    SpellingMarksArray[MarkPos] = 2;
                } else {
                    SpellingMarksArray[MarkPos] += 2;
                }
            }
        }
    }
    for (var Pos = StartPos; Pos < EndPos; Pos++) {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;
        var ItemWidthVisible = Item.Get_WidthVisible();
        if (1 === SpellingMarksArray[Pos] || 3 === SpellingMarksArray[Pos]) {
            PDSL.SpellingCounter++;
        }
        switch (ItemType) {
        case para_End:
            case para_NewLine:
            X += ItemWidthVisible;
            break;
        case para_PageNum:
            case para_Drawing:
            case para_Tab:
            case para_Text:
            case para_Sym:
            if (para_Drawing != ItemType || drawing_Anchor != Item.DrawingType) {
                if (true === CurTextPr.DStrikeout) {
                    aDStrikeout.Add(StrikeoutY, StrikeoutY, X, X + ItemWidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b);
                } else {
                    if (true === CurTextPr.Strikeout) {
                        aStrikeout.Add(StrikeoutY, StrikeoutY, X, X + ItemWidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b);
                    }
                }
                if (true === CurTextPr.Underline) {
                    aUnderline.Add(UnderlineY, UnderlineY, X, X + ItemWidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b);
                }
                if (PDSL.SpellingCounter > 0) {
                    aSpelling.Add(UnderlineY, UnderlineY, X, X + ItemWidthVisible, LineW, 0, 0, 0);
                }
                X += ItemWidthVisible;
            }
            break;
        case para_Space:
            if (PDSL.Spaces > 0) {
                if (true === CurTextPr.DStrikeout) {
                    aDStrikeout.Add(StrikeoutY, StrikeoutY, X, X + ItemWidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b);
                } else {
                    if (true === CurTextPr.Strikeout) {
                        aStrikeout.Add(StrikeoutY, StrikeoutY, X, X + ItemWidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b);
                    }
                }
                if (true === CurTextPr.Underline) {
                    aUnderline.Add(UnderlineY, UnderlineY, X, X + ItemWidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b);
                }
                PDSL.Spaces--;
            }
            X += ItemWidthVisible;
            break;
        case para_Math_Text:
            case para_Math_Ampersand:
            if (true === CurTextPr.DStrikeout) {
                aDStrikeout.Add(StrikeoutY, StrikeoutY, X, X + ItemWidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b);
            } else {
                if (true === CurTextPr.Strikeout) {
                    aStrikeout.Add(StrikeoutY, StrikeoutY, X, X + ItemWidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b);
                }
            }
            X += ItemWidthVisible;
            break;
        case para_Math_Placeholder:
            var ctrPrp = this.Parent.GetCtrPrp();
            if (true === ctrPrp.DStrikeout) {
                aDStrikeout.Add(StrikeoutY, StrikeoutY, X, X + ItemWidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b);
            } else {
                if (true === ctrPrp.Strikeout) {
                    aStrikeout.Add(StrikeoutY, StrikeoutY, X, X + ItemWidthVisible, LineW, CurColor.r, CurColor.g, CurColor.b);
                }
            }
            X += ItemWidthVisible;
            break;
        }
        if (2 === SpellingMarksArray[Pos + 1] || 3 === SpellingMarksArray[Pos + 1]) {
            PDSL.SpellingCounter--;
        }
    }
    PDSL.X = X;
};
ParaRun.prototype.Is_CursorPlaceable = function () {
    return true;
};
ParaRun.prototype.Cursor_Is_Start = function () {
    if (this.State.ContentPos <= 0) {
        return true;
    }
    return false;
};
ParaRun.prototype.Cursor_Is_NeededCorrectPos = function () {
    if (true === this.Is_Empty(false)) {
        return true;
    }
    var NewRangeStart = false;
    var RangeEnd = false;
    var Pos = this.State.ContentPos;
    var LinesLen = this.protected_GetLinesCount();
    for (var CurLine = 0; CurLine < LinesLen; CurLine++) {
        var RangesLen = this.protected_GetRangesCount(CurLine);
        for (var CurRange = 0; CurRange < RangesLen; CurRange++) {
            var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
            var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
            if (0 !== CurLine || 0 !== CurRange) {
                if (Pos === StartPos) {
                    NewRangeStart = true;
                }
            }
            if (Pos === EndPos) {
                RangeEnd = true;
            }
        }
        if (true === NewRangeStart) {
            break;
        }
    }
    if (true !== NewRangeStart && true !== RangeEnd && true === this.Cursor_Is_Start()) {
        return true;
    }
    return false;
};
ParaRun.prototype.Cursor_Is_End = function () {
    if (this.State.ContentPos >= this.Content.length) {
        return true;
    }
    return false;
};
ParaRun.prototype.Cursor_MoveToStartPos = function () {
    this.State.ContentPos = 0;
};
ParaRun.prototype.Cursor_MoveToEndPos = function (SelectFromEnd) {
    if (true === SelectFromEnd) {
        var Selection = this.State.Selection;
        Selection.Use = true;
        Selection.StartPos = this.Content.length;
        Selection.EndPos = this.Content.length;
    } else {
        var CurPos = this.Content.length;
        while (CurPos > 0) {
            if (para_End === this.Content[CurPos - 1].Type) {
                CurPos--;
            } else {
                break;
            }
        }
        this.State.ContentPos = CurPos;
    }
};
ParaRun.prototype.Get_ParaContentPosByXY = function (SearchPos, Depth, _CurLine, _CurRange, StepEnd) {
    var Result = false;
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    var CurPos = StartPos;
    var bNotUpdate = SearchPos.InText && this.Type === para_Math_Run;
    for (; CurPos < EndPos; CurPos++) {
        var Item = this.Content[CurPos];
        var ItemType = Item.Type;
        var TempDx = 0;
        if (para_Drawing != ItemType || true === Item.Is_Inline()) {
            TempDx = Item.Get_WidthVisible();
        }
        var Diff = SearchPos.X - SearchPos.CurX;
        if ((Math.abs(Diff) < SearchPos.DiffX + 0.001 && (SearchPos.CenterMode || SearchPos.X > SearchPos.CurX)) && !bNotUpdate) {
            SearchPos.DiffX = Math.abs(Diff);
            SearchPos.Pos.Update(CurPos, Depth);
            Result = true;
            if (Diff >= -0.001 && Diff <= TempDx + 0.001) {
                SearchPos.InTextPos.Update(CurPos, Depth);
                SearchPos.InText = true;
            }
        }
        SearchPos.CurX += TempDx;
        Diff = SearchPos.X - SearchPos.CurX;
        if ((Math.abs(Diff) < SearchPos.DiffX + 0.001 && (SearchPos.CenterMode || SearchPos.X > SearchPos.CurX)) && !bNotUpdate) {
            if (para_End === ItemType) {
                SearchPos.End = true;
                if (true === StepEnd) {
                    SearchPos.Pos.Update(this.Content.length, Depth);
                    Result = true;
                }
            } else {
                if (CurPos === EndPos - 1 && para_NewLine != ItemType) {
                    SearchPos.Pos.Update(EndPos, Depth);
                    Result = true;
                }
            }
        }
    }
    if (SearchPos.DiffX > 1000000 - 1) {
        SearchPos.Pos.Update(StartPos, Depth);
        Result = true;
    }
    if (this.Type == para_Math_Run) {
        var Diff = SearchPos.X - SearchPos.CurX;
        if ((Math.abs(Diff) < SearchPos.DiffX + 0.001 && (SearchPos.CenterMode || SearchPos.X > SearchPos.CurX)) && !bNotUpdate) {
            SearchPos.DiffX = Math.abs(Diff);
            SearchPos.Pos.Update(CurPos, Depth);
            Result = true;
        }
    }
    return Result;
};
ParaRun.prototype.Get_ParaContentPos = function (bSelection, bStart, ContentPos) {
    var Pos = (true !== bSelection ? this.State.ContentPos : (false !== bStart ? this.State.Selection.StartPos : this.State.Selection.EndPos));
    ContentPos.Add(Pos);
};
ParaRun.prototype.Set_ParaContentPos = function (ContentPos, Depth) {
    var Pos = ContentPos.Get(Depth);
    var Count = this.Content.length;
    if (Pos > Count) {
        Pos = Count;
    }
    for (var TempPos = 0; TempPos < Pos; TempPos++) {
        if (para_End === this.Content[TempPos].Type) {
            Pos = TempPos;
            break;
        }
    }
    if (Pos < 0) {
        Pos = 0;
    }
    this.State.ContentPos = Pos;
};
ParaRun.prototype.Get_PosByElement = function (Class, ContentPos, Depth, UseRange, Range, Line) {
    if (this === Class) {
        return true;
    }
    return false;
};
ParaRun.prototype.Get_ElementByPos = function (ContentPos, Depth) {
    return this;
};
ParaRun.prototype.Get_PosByDrawing = function (Id, ContentPos, Depth) {
    var Count = this.Content.length;
    for (var CurPos = 0; CurPos < Count; CurPos++) {
        var Item = this.Content[CurPos];
        if (para_Drawing === Item.Type && Id === Item.Get_Id()) {
            ContentPos.Update(CurPos, Depth);
            return true;
        }
    }
    return false;
};
ParaRun.prototype.Get_RunElementByPos = function (ContentPos, Depth) {
    if (undefined !== ContentPos) {
        var CurPos = ContentPos.Get(Depth);
        var ContentLen = this.Content.length;
        if (CurPos >= this.Content.length || CurPos < 0) {
            return null;
        }
        return this.Content[CurPos];
    } else {
        if (this.Content.length > 0) {
            return this.Content[0];
        } else {
            return null;
        }
    }
};
ParaRun.prototype.Get_LastRunInRange = function (_CurLine, _CurRange) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    return this;
};
ParaRun.prototype.Get_LeftPos = function (SearchPos, ContentPos, Depth, UseContentPos) {
    var CurPos = (true === UseContentPos ? ContentPos.Get(Depth) : this.Content.length);
    while (true) {
        CurPos--;
        var Item = this.Content[CurPos];
        if (CurPos < 0 || para_Drawing !== Item.Type || false !== Item.Is_Inline()) {
            break;
        }
    }
    if (CurPos >= 0) {
        SearchPos.Found = true;
        SearchPos.Pos.Update(CurPos, Depth);
    }
};
ParaRun.prototype.Get_RightPos = function (SearchPos, ContentPos, Depth, UseContentPos, StepEnd) {
    var CurPos = (true === UseContentPos ? ContentPos.Get(Depth) : 0);
    var Count = this.Content.length;
    while (true) {
        CurPos++;
        if (Count === CurPos) {
            if (CurPos === 0) {
                return;
            }
            var PrevItem = this.Content[CurPos - 1];
            var PrevItemType = PrevItem.Type;
            if ((true !== StepEnd && para_End === PrevItemType) || (para_Drawing === PrevItemType && false === PrevItem.Is_Inline())) {
                return;
            }
            break;
        }
        if (CurPos > Count) {
            break;
        }
        var Item = this.Content[CurPos];
        var ItemType = Item.Type;
        if ((para_Drawing !== ItemType && (false !== StepEnd || para_End !== this.Content[CurPos - 1].Type)) || (para_Drawing === ItemType && false !== Item.Is_Inline())) {
            break;
        }
    }
    if (CurPos <= Count) {
        SearchPos.Found = true;
        SearchPos.Pos.Update(CurPos, Depth);
    }
};
ParaRun.prototype.Get_WordStartPos = function (SearchPos, ContentPos, Depth, UseContentPos) {
    var CurPos = (true === UseContentPos ? ContentPos.Get(Depth) - 1 : this.Content.length - 1);
    if (CurPos < 0) {
        return;
    }
    SearchPos.Shift = true;
    var NeedUpdate = false;
    if (0 === SearchPos.Stage) {
        while (true) {
            var Item = this.Content[CurPos];
            var Type = Item.Type;
            var bSpace = false;
            if (para_Space === Type || para_Tab === Type || (para_Text === Type && true === Item.Is_NBSP()) || (para_Drawing === Type && true !== Item.Is_Inline())) {
                bSpace = true;
            }
            if (true === bSpace) {
                CurPos--;
                if (CurPos < 0) {
                    return;
                }
            } else {
                if (para_Text !== this.Content[CurPos].Type && para_Math_Text !== this.Content[CurPos].Type) {
                    SearchPos.Pos.Update(CurPos, Depth);
                    SearchPos.Found = true;
                    SearchPos.UpdatePos = true;
                    return;
                }
                SearchPos.Pos.Update(CurPos, Depth);
                SearchPos.Stage = 1;
                SearchPos.Punctuation = this.Content[CurPos].Is_Punctuation();
                NeedUpdate = true;
                break;
            }
        }
    } else {
        CurPos = (true === UseContentPos ? ContentPos.Get(Depth) : this.Content.length);
    }
    while (CurPos > 0) {
        CurPos--;
        var Item = this.Content[CurPos];
        var TempType = Item.Type;
        if ((para_Text !== TempType && para_Math_Text !== TempType) || true === Item.Is_NBSP() || (true === SearchPos.Punctuation && true !== Item.Is_Punctuation()) || (false === SearchPos.Punctuation && false !== Item.Is_Punctuation())) {
            SearchPos.Found = true;
            break;
        } else {
            SearchPos.Pos.Update(CurPos, Depth);
            NeedUpdate = true;
        }
    }
    SearchPos.UpdatePos = NeedUpdate;
};
ParaRun.prototype.Get_WordEndPos = function (SearchPos, ContentPos, Depth, UseContentPos, StepEnd) {
    var CurPos = (true === UseContentPos ? ContentPos.Get(Depth) : 0);
    var ContentLen = this.Content.length;
    if (CurPos >= ContentLen) {
        return;
    }
    var NeedUpdate = false;
    if (0 === SearchPos.Stage) {
        while (true) {
            var Item = this.Content[CurPos];
            var Type = Item.Type;
            var bText = false;
            if ((para_Text === Type || para_Math_Text === Type) && true != Item.Is_NBSP() && (true === SearchPos.First || (SearchPos.Punctuation === Item.Is_Punctuation()))) {
                bText = true;
            }
            if (true === bText) {
                if (true === SearchPos.First) {
                    SearchPos.First = false;
                    SearchPos.Punctuation = Item.Is_Punctuation();
                }
                CurPos++;
                SearchPos.Shift = true;
                if (CurPos >= ContentLen) {
                    return;
                }
            } else {
                SearchPos.Stage = 1;
                if (true === SearchPos.First) {
                    if (para_End === Type) {
                        if (true === StepEnd) {
                            SearchPos.Pos.Update(CurPos + 1, Depth);
                            SearchPos.Found = true;
                            SearchPos.UpdatePos = true;
                        }
                        return;
                    }
                    CurPos++;
                    SearchPos.Shift = true;
                }
                break;
            }
        }
    }
    if (CurPos >= ContentLen) {
        return;
    }
    if (! (para_Space === this.Content[CurPos].Type || (para_Text === this.Content[CurPos].Type && true === this.Content[CurPos].Is_NBSP()))) {
        SearchPos.Pos.Update(CurPos, Depth);
        SearchPos.Found = true;
        SearchPos.UpdatePos = true;
    } else {
        while (CurPos < ContentLen - 1) {
            CurPos++;
            var Item = this.Content[CurPos];
            var TempType = Item.Type;
            if ((true !== StepEnd && para_End === TempType) || !(para_Space === TempType || (para_Text === TempType && true === Item.Is_NBSP()))) {
                SearchPos.Found = true;
                break;
            }
        }
        SearchPos.Pos.Update(CurPos, Depth);
        SearchPos.UpdatePos = true;
    }
};
ParaRun.prototype.Get_EndRangePos = function (_CurLine, _CurRange, SearchPos, Depth) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    var LastPos = -1;
    for (var CurPos = StartPos; CurPos < EndPos; CurPos++) {
        var Item = this.Content[CurPos];
        var ItemType = Item.Type;
        if (! ((para_Drawing === ItemType && true !== Item.Is_Inline()) || para_End === ItemType || (para_NewLine === ItemType && break_Line === Item.BreakType))) {
            LastPos = CurPos + 1;
        }
    }
    if (-1 !== LastPos) {
        SearchPos.Pos.Update(LastPos, Depth);
        return true;
    } else {
        return false;
    }
};
ParaRun.prototype.Get_StartRangePos = function (_CurLine, _CurRange, SearchPos, Depth) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    var FirstPos = -1;
    for (var CurPos = EndPos - 1; CurPos >= StartPos; CurPos--) {
        var Item = this.Content[CurPos];
        if (! (para_Drawing === Item.Type && true !== Item.Is_Inline())) {
            FirstPos = CurPos;
        }
    }
    if (-1 !== FirstPos) {
        SearchPos.Pos.Update(FirstPos, Depth);
        return true;
    } else {
        if (this.Type == para_Math_Run && this.Parent.Is_FirstComposition()) {
            SearchPos.Pos.Update(0, Depth);
            return true;
        } else {
            return false;
        }
    }
};
ParaRun.prototype.Get_StartRangePos2 = function (_CurLine, _CurRange, ContentPos, Depth) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var Pos = this.protected_GetRangeStartPos(CurLine, CurRange);
    ContentPos.Update(Pos, Depth);
};
ParaRun.prototype.Get_StartPos = function (ContentPos, Depth) {
    ContentPos.Update(0, Depth);
};
ParaRun.prototype.Get_EndPos = function (BehindEnd, ContentPos, Depth) {
    var ContentLen = this.Content.length;
    if (true === BehindEnd) {
        ContentPos.Update(ContentLen, Depth);
    } else {
        for (var CurPos = 0; CurPos < ContentLen; CurPos++) {
            if (para_End === this.Content[CurPos].Type) {
                ContentPos.Update(CurPos, Depth);
                return;
            }
        }
        ContentPos.Update(ContentLen, Depth);
    }
};
ParaRun.prototype.Set_SelectionContentPos = function (StartContentPos, EndContentPos, Depth, StartFlag, EndFlag) {
    var StartPos = 0;
    switch (StartFlag) {
    case 1:
        StartPos = 0;
        break;
    case -1:
        StartPos = this.Content.length;
        break;
    case 0:
        StartPos = StartContentPos.Get(Depth);
        break;
    }
    var EndPos = 0;
    switch (EndFlag) {
    case 1:
        EndPos = 0;
        break;
    case -1:
        EndPos = this.Content.length;
        break;
    case 0:
        EndPos = EndContentPos.Get(Depth);
        break;
    }
    var Selection = this.State.Selection;
    Selection.StartPos = StartPos;
    Selection.EndPos = EndPos;
    Selection.Use = true;
};
ParaRun.prototype.Set_SelectionAtEndPos = function () {
    this.Set_SelectionContentPos(null, null, 0, -1, -1);
};
ParaRun.prototype.Set_SelectionAtStartPos = function () {
    this.Set_SelectionContentPos(null, null, 0, 1, 1);
};
ParaRun.prototype.Selection_IsUse = function () {
    return this.State.Selection.Use;
};
ParaRun.prototype.Is_SelectedAll = function (Props) {
    var Selection = this.State.Selection;
    if (false === Selection.Use && true !== this.Is_Empty(Props)) {
        return false;
    }
    var SkipAnchor = Props.SkipAnchor;
    var SkipEnd = Props.SkipEnd;
    var StartPos = Selection.StartPos;
    var EndPos = Selection.EndPos;
    if (EndPos < StartPos) {
        StartPos = Selection.EndPos;
        EndPos = Selection.StartPos;
    }
    for (var Pos = 0; Pos < StartPos; Pos++) {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;
        if (! ((true === SkipAnchor && (para_Drawing === ItemType && true !== Item.Is_Inline())) || (true === SkipEnd && para_End === ItemType))) {
            return false;
        }
    }
    var Count = this.Content.length;
    for (var Pos = EndPos; Pos < Count; Pos++) {
        var Item = this.Content[Pos];
        var ItemType = Item.Type;
        if (! ((true === SkipAnchor && (para_Drawing === ItemType && true !== Item.Is_Inline())) || (true === SkipEnd && para_End === ItemType))) {
            return false;
        }
    }
    return true;
};
ParaRun.prototype.Selection_CorrectLeftPos = function (Direction) {
    if (false === this.Selection.Use || true === this.Is_Empty({
        SkipAnchor: true
    })) {
        return true;
    }
    var Selection = this.State.Selection;
    var StartPos = Math.min(Selection.StartPos, Selection.EndPos);
    var EndPos = Math.max(Selection.StartPos, Selection.EndPos);
    for (var Pos = 0; Pos < StartPos; Pos++) {
        var Item = this.Content[Pos];
        if (para_Drawing !== Item.Type || true === Item.Is_Inline()) {
            return false;
        }
    }
    for (var Pos = StartPos; Pos < EndPos; Pos++) {
        var Item = this.Content[Pos];
        if (para_Drawing === Item.Type && true !== Item.Is_Inline()) {
            if (1 === Direction) {
                Selection.StartPos = Pos + 1;
            } else {
                Selection.EndPos = Pos + 1;
            }
        } else {
            return false;
        }
    }
    return true;
};
ParaRun.prototype.Selection_Stop = function () {};
ParaRun.prototype.Selection_Remove = function () {
    var Selection = this.State.Selection;
    Selection.Use = false;
    Selection.StartPos = 0;
    Selection.EndPos = 0;
};
ParaRun.prototype.Select_All = function (Direction) {
    var Selection = this.State.Selection;
    Selection.Use = true;
    if (-1 === Direction) {
        Selection.StartPos = this.Content.length;
        Selection.EndPos = 0;
    } else {
        Selection.StartPos = 0;
        Selection.EndPos = this.Content.length;
    }
};
ParaRun.prototype.Selection_DrawRange = function (_CurLine, _CurRange, SelectionDraw, PointsInfo) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    var Selection = this.State.Selection;
    var SelectionUse = Selection.Use;
    var SelectionStartPos = Selection.StartPos;
    var SelectionEndPos = Selection.EndPos;
    if (SelectionStartPos > SelectionEndPos) {
        SelectionStartPos = Selection.EndPos;
        SelectionEndPos = Selection.StartPos;
    }
    var FindStart = SelectionDraw.FindStart;
    for (var CurPos = StartPos; CurPos < EndPos; CurPos++) {
        var Item = this.Content[CurPos];
        var ItemType = Item.Type;
        var DrawSelection = false;
        if (true === FindStart) {
            if (true === Selection.Use && CurPos >= SelectionStartPos && CurPos < SelectionEndPos) {
                FindStart = false;
                DrawSelection = true;
            } else {
                if (para_Drawing !== ItemType || true === Item.Is_Inline()) {
                    SelectionDraw.StartX += Item.Get_WidthVisible();
                }
            }
        } else {
            if (true === Selection.Use && CurPos >= SelectionStartPos && CurPos < SelectionEndPos) {
                DrawSelection = true;
            }
        }
        if (true === DrawSelection) {
            if (para_Drawing === ItemType && true !== Item.Is_Inline()) {
                if (true === SelectionDraw.Draw) {
                    Item.Draw_Selection();
                }
            } else {
                SelectionDraw.W += Item.Get_WidthVisible();
            }
        }
    }
    SelectionDraw.FindStart = FindStart;
};
ParaRun.prototype.Selection_IsEmpty = function (CheckEnd) {
    var Selection = this.State.Selection;
    if (true !== Selection.Use) {
        return true;
    }
    if (this.Type == para_Math_Run && this.IsPlaceholder()) {
        return true;
    }
    var StartPos = Selection.StartPos;
    var EndPos = Selection.EndPos;
    if (StartPos > EndPos) {
        StartPos = Selection.EndPos;
        EndPos = Selection.StartPos;
    }
    if (true === CheckEnd) {
        return (EndPos > StartPos ? false : true);
    } else {
        if (this.Type == para_Math_Run && this.Is_Empty()) {
            return false;
        } else {
            for (var CurPos = StartPos; CurPos < EndPos; CurPos++) {
                var ItemType = this.Content[CurPos].Type;
                if (para_End !== ItemType) {
                    return false;
                }
            }
        }
    }
    return true;
};
ParaRun.prototype.Selection_CheckParaEnd = function () {
    var Selection = this.State.Selection;
    if (true !== Selection.Use) {
        return false;
    }
    var StartPos = Selection.StartPos;
    var EndPos = Selection.EndPos;
    if (StartPos > EndPos) {
        StartPos = Selection.EndPos;
        EndPos = Selection.StartPos;
    }
    for (var CurPos = StartPos; CurPos < EndPos; CurPos++) {
        var Item = this.Content[CurPos];
        if (para_End === Item.Type) {
            return true;
        }
    }
    return false;
};
ParaRun.prototype.Selection_CheckParaContentPos = function (ContentPos, Depth, bStart, bEnd) {
    var CurPos = ContentPos.Get(Depth);
    if (this.Selection.StartPos <= this.Selection.EndPos && this.Selection.StartPos <= CurPos && CurPos <= this.Selection.EndPos) {
        if ((true !== bEnd) || (true === bEnd && CurPos !== this.Selection.EndPos)) {
            return true;
        }
    } else {
        if (this.Selection.StartPos > this.Selection.EndPos && this.Selection.EndPos <= CurPos && CurPos <= this.Selection.StartPos) {
            if ((true !== bEnd) || (true === bEnd && CurPos !== this.Selection.StartPos)) {
                return true;
            }
        }
    }
    return false;
};
ParaRun.prototype.Clear_TextFormatting = function (DefHyper) {
    this.Set_Bold(undefined);
    this.Set_Italic(undefined);
    this.Set_Strikeout(undefined);
    this.Set_Underline(undefined);
    this.Set_FontSize(undefined);
    this.Set_Color(undefined);
    this.Set_Unifill(undefined);
    this.Set_VertAlign(undefined);
    this.Set_Spacing(undefined);
    this.Set_DStrikeout(undefined);
    this.Set_Caps(undefined);
    this.Set_SmallCaps(undefined);
    this.Set_Position(undefined);
    this.Set_RFonts2(undefined);
    this.Set_RStyle(undefined);
    this.Set_Shd(undefined);
    this.Recalc_CompiledPr(true);
};
ParaRun.prototype.Get_TextPr = function () {
    return this.Pr.Copy();
};
ParaRun.prototype.Get_CompiledTextPr = function (Copy) {
    if (true === this.State.Selection.Use && true === this.Selection_CheckParaEnd()) {
        var ThisTextPr = this.Get_CompiledPr(true);
        var Para = this.Paragraph;
        var EndTextPr = Para.Get_CompiledPr2(false).TextPr.Copy();
        EndTextPr.Merge(Para.TextPr.Value);
        ThisTextPr = ThisTextPr.Compare(EndTextPr);
        return ThisTextPr;
    } else {
        return this.Get_CompiledPr(Copy);
    }
};
ParaRun.prototype.Recalc_CompiledPr = function (RecalcMeasure) {
    this.RecalcInfo.TextPr = true;
    if (true === RecalcMeasure) {
        this.RecalcInfo.Measure = true;
    }
    this.private_UpdateMathResize();
    this.private_RecalcCtrPrp();
};
ParaRun.prototype.Recalc_RunsCompiledPr = function () {
    this.Recalc_CompiledPr(true);
};
ParaRun.prototype.Get_CompiledPr = function (bCopy) {
    if (true === this.RecalcInfo.TextPr) {
        this.RecalcInfo.TextPr = false;
        this.CompiledPr = this.Internal_Compile_Pr();
    }
    if (false === bCopy) {
        return this.CompiledPr;
    } else {
        return this.CompiledPr.Copy();
    }
};
ParaRun.prototype.Internal_Compile_Pr = function () {
    if (undefined === this.Paragraph || null === this.Paragraph) {
        var TextPr = new CTextPr();
        TextPr.Init_Default();
        this.RecalcInfo.TextPr = true;
        return TextPr;
    }
    var TextPr = this.Paragraph.Get_CompiledPr2(false).TextPr.Copy();
    if (undefined != this.Pr.RStyle) {
        var Styles = this.Paragraph.Parent.Get_Styles();
        var StyleTextPr = Styles.Get_Pr(this.Pr.RStyle, styletype_Character).TextPr;
        TextPr.Merge(StyleTextPr);
    }
    if (this.Type == para_Math_Run) {
        if (undefined === this.Parent || null === this.Parent) {
            var TextPr = new CTextPr();
            TextPr.Init_Default();
            this.RecalcInfo.TextPr = true;
            return TextPr;
        }
        if (!this.IsNormalText()) {
            var Styles = this.Paragraph.Parent.Get_Styles();
            var StyleDefaultTextPr = Styles.Default.TextPr.Copy();
            var DefaultTextPr = new CTextPr();
            DefaultTextPr.RFonts.Set_All("Cambria Math", -1);
            Styles.Default.TextPr = DefaultTextPr;
            var StyleId = this.Paragraph.Style_Get();
            var Pr = Styles.Get_Pr(StyleId, styletype_Paragraph, null, null);
            TextPr.RFonts.Set_FromObject(Pr.TextPr.RFonts);
            Styles.Default.TextPr = StyleDefaultTextPr;
        }
        if (this.IsPlaceholder()) {
            TextPr.Merge(this.Parent.GetCtrPrp());
            TextPr.Merge(this.Pr);
        } else {
            TextPr.Merge(this.Pr);
            if (!this.IsNormalText()) {
                var MPrp = this.MathPrp.GetTxtPrp();
                TextPr.Merge(MPrp);
            }
        }
    } else {
        TextPr.Merge(this.Pr);
        if (this.Pr.Color && !this.Pr.Unifill) {
            TextPr.Unifill = undefined;
        }
    }
    TextPr.FontFamily.Name = TextPr.RFonts.Ascii.Name;
    TextPr.FontFamily.Index = TextPr.RFonts.Ascii.Index;
    return TextPr;
};
ParaRun.prototype.Set_Pr = function (TextPr) {
    var OldValue = this.Pr;
    this.Pr = TextPr;
    History.Add(this, {
        Type: historyitem_ParaRun_TextPr,
        New: TextPr,
        Old: OldValue
    });
    this.Recalc_CompiledPr(true);
    this.protected_UpdateSpellChecking();
};
ParaRun.prototype.Apply_TextPr = function (TextPr, IncFontSize, ApplyToAll) {
    if (true === ApplyToAll) {
        if (undefined === IncFontSize) {
            this.Apply_Pr(TextPr);
        } else {
            var _TextPr = new CTextPr();
            var CurTextPr = this.Get_CompiledPr(false);
            this.Set_FontSize(FontSize_IncreaseDecreaseValue(IncFontSize, CurTextPr.FontSize));
        }
        var bEnd = false;
        var Count = this.Content.length;
        for (var Pos = 0; Pos < Count; Pos++) {
            if (para_End === this.Content[Pos].Type) {
                bEnd = true;
                break;
            }
        }
        if (true === bEnd) {
            if (undefined === IncFontSize) {
                this.Paragraph.TextPr.Apply_TextPr(TextPr);
            } else {
                var Para = this.Paragraph;
                var EndTextPr = Para.Get_CompiledPr2(false).TextPr.Copy();
                EndTextPr.Merge(Para.TextPr.Value);
                Para.TextPr.Set_FontSize(FontSize_IncreaseDecreaseValue(IncFontSize, EndTextPr.FontSize));
            }
        }
    } else {
        var Result = [];
        var LRun = this,
        CRun = null,
        RRun = null;
        if (true === this.State.Selection.Use) {
            var StartPos = this.State.Selection.StartPos;
            var EndPos = this.State.Selection.EndPos;
            var Direction = 1;
            if (StartPos > EndPos) {
                var Temp = StartPos;
                StartPos = EndPos;
                EndPos = Temp;
                Direction = -1;
            }
            if (EndPos < this.Content.length) {
                RRun = LRun.Split_Run(EndPos);
            }
            if (StartPos > 0) {
                CRun = LRun.Split_Run(StartPos);
            } else {
                CRun = LRun;
                LRun = null;
            }
            if (null !== LRun) {
                LRun.Selection.Use = true;
                LRun.Selection.StartPos = LRun.Content.length;
                LRun.Selection.EndPos = LRun.Content.length;
            }
            CRun.Select_All(Direction);
            if (undefined === IncFontSize) {
                CRun.Apply_Pr(TextPr);
            } else {
                var _TextPr = new CTextPr();
                var CurTextPr = this.Get_CompiledPr(false);
                CRun.Set_FontSize(FontSize_IncreaseDecreaseValue(IncFontSize, CurTextPr.FontSize));
            }
            if (null !== RRun) {
                RRun.Selection.Use = true;
                RRun.Selection.StartPos = 0;
                RRun.Selection.EndPos = 0;
            }
            if (true === this.Selection_CheckParaEnd()) {
                if (undefined === IncFontSize) {
                    this.Paragraph.TextPr.Apply_TextPr(TextPr);
                } else {
                    var Para = this.Paragraph;
                    var EndTextPr = Para.Get_CompiledPr2(false).TextPr.Copy();
                    EndTextPr.Merge(Para.TextPr.Value);
                    Para.TextPr.Set_FontSize(FontSize_IncreaseDecreaseValue(IncFontSize, EndTextPr.FontSize));
                }
            }
        } else {
            var CurPos = this.State.ContentPos;
            if (CurPos < this.Content.length) {
                RRun = LRun.Split_Run(CurPos);
            }
            if (CurPos > 0) {
                CRun = LRun.Split_Run(CurPos);
            } else {
                CRun = LRun;
                LRun = null;
            }
            if (null !== LRun) {
                LRun.Selection_Remove();
            }
            CRun.Selection_Remove();
            CRun.Cursor_MoveToStartPos();
            if (undefined === IncFontSize) {
                CRun.Apply_Pr(TextPr);
            } else {
                var _TextPr = new CTextPr();
                var CurTextPr = this.Get_CompiledPr(false);
                CRun.Set_FontSize(FontSize_IncreaseDecreaseValue(IncFontSize, CurTextPr.FontSize));
            }
            if (null !== RRun) {
                RRun.Selection_Remove();
            }
        }
        Result.push(LRun);
        Result.push(CRun);
        Result.push(RRun);
        return Result;
    }
};
ParaRun.prototype.Split_Run = function (Pos) {
    var bMathRun = this.Type == para_Math_Run;
    var NewRun = new ParaRun(this.Paragraph, bMathRun);
    NewRun.Set_Pr(this.Pr.Copy());
    if (bMathRun) {
        NewRun.Set_MathPr(this.MathPrp.Copy());
    }
    var OldCrPos = this.State.ContentPos;
    var OldSSPos = this.State.Selection.StartPos;
    var OldSEPos = this.State.Selection.EndPos;
    NewRun.Concat_ToContent(this.Content.slice(Pos));
    this.Remove_FromContent(Pos, this.Content.length - Pos, true);
    if (OldCrPos >= Pos) {
        NewRun.State.ContentPos = OldCrPos - Pos;
        this.State.ContentPos = this.Content.length;
    } else {
        NewRun.State.ContentPos = 0;
    }
    if (OldSSPos >= Pos) {
        NewRun.State.Selection.StartPos = OldSSPos - Pos;
        this.State.Selection.StartPos = this.Content.length;
    } else {
        NewRun.State.Selection.StartPos = 0;
    }
    if (OldSEPos >= Pos) {
        NewRun.State.Selection.EndPos = OldSEPos - Pos;
        this.State.Selection.EndPos = this.Content.length;
    } else {
        NewRun.State.Selection.EndPos = 0;
    }
    var SpellingMarksCount = this.SpellingMarks.length;
    for (var Index = 0; Index < SpellingMarksCount; Index++) {
        var Mark = this.SpellingMarks[Index];
        var MarkPos = (true === Mark.Start ? Mark.Element.StartPos.Get(Mark.Depth) : Mark.Element.EndPos.Get(Mark.Depth));
        if (MarkPos >= Pos) {
            var MarkElement = Mark.Element;
            if (true === Mark.Start) {
                MarkElement.StartPos.Data[Mark.Depth] -= Pos;
            } else {
                MarkElement.EndPos.Data[Mark.Depth] -= Pos;
            }
            NewRun.SpellingMarks.push(Mark);
            this.SpellingMarks.splice(Index, 1);
            SpellingMarksCount--;
            Index--;
        }
    }
    return NewRun;
};
ParaRun.prototype.Clear_TextPr = function () {
    var NewTextPr = new CTextPr();
    NewTextPr.Lang = this.Pr.Lang.Copy();
    this.Set_Pr(NewTextPr);
};
ParaRun.prototype.Apply_Pr = function (TextPr) {
    if (this.Type == para_Math_Run && !this.IsNormalText()) {
        if (null === TextPr.Bold && null === TextPr.Italic) {
            this.Math_Apply_Style(undefined);
        } else {
            if (undefined != TextPr.Bold) {
                if (TextPr.Bold == true) {
                    if (this.MathPrp.sty == STY_ITALIC || this.MathPrp.sty == undefined) {
                        this.Math_Apply_Style(STY_BI);
                    } else {
                        if (this.MathPrp.sty == STY_PLAIN) {
                            this.Math_Apply_Style(STY_BOLD);
                        }
                    }
                } else {
                    if (TextPr.Bold == false || TextPr.Bold == null) {
                        if (this.MathPrp.sty == STY_BI || this.MathPrp.sty == undefined) {
                            this.Math_Apply_Style(STY_ITALIC);
                        } else {
                            if (this.MathPrp.sty == STY_BOLD) {
                                this.Math_Apply_Style(STY_PLAIN);
                            }
                        }
                    }
                }
            }
            if (undefined != TextPr.Italic) {
                if (TextPr.Italic == true) {
                    if (this.MathPrp.sty == STY_BOLD) {
                        this.Math_Apply_Style(STY_BI);
                    } else {
                        if (this.MathPrp.sty == STY_PLAIN || this.MathPrp.sty == undefined) {
                            this.Math_Apply_Style(STY_ITALIC);
                        }
                    }
                } else {
                    if (TextPr.Italic == false || TextPr.Italic == null) {
                        if (this.MathPrp.sty == STY_BI) {
                            this.Math_Apply_Style(STY_BOLD);
                        } else {
                            if (this.MathPrp.sty == STY_ITALIC || this.MathPrp.sty == undefined) {
                                this.Math_Apply_Style(STY_PLAIN);
                            }
                        }
                    }
                }
            }
        }
    } else {
        if (undefined != TextPr.Bold) {
            this.Set_Bold(null === TextPr.Bold ? undefined : TextPr.Bold);
        }
        if (undefined != TextPr.Italic) {
            this.Set_Italic(null === TextPr.Italic ? undefined : TextPr.Italic);
        }
    }
    if (undefined != TextPr.Strikeout) {
        this.Set_Strikeout(null === TextPr.Strikeout ? undefined : TextPr.Strikeout);
    }
    if (undefined !== TextPr.Underline) {
        this.Set_Underline(null === TextPr.Underline ? undefined : TextPr.Underline);
    }
    if (undefined != TextPr.FontSize) {
        this.Set_FontSize(null === TextPr.FontSize ? undefined : TextPr.FontSize);
    }
    if (undefined !== TextPr.Color && undefined === TextPr.Unifill) {
        this.Set_Color(null === TextPr.Color ? undefined : TextPr.Color);
        this.Set_Unifill(undefined);
    }
    if (undefined !== TextPr.Unifill) {
        this.Set_Unifill(null === TextPr.Unifill ? undefined : TextPr.Unifill);
        this.Set_Color(undefined);
    }
    if (undefined != TextPr.VertAlign) {
        this.Set_VertAlign(null === TextPr.VertAlign ? undefined : TextPr.VertAlign);
    }
    if (undefined != TextPr.HighLight) {
        this.Set_HighLight(null === TextPr.HighLight ? undefined : TextPr.HighLight);
    }
    if (undefined !== TextPr.RStyle) {
        this.Set_RStyle(null === TextPr.RStyle ? undefined : TextPr.RStyle);
    }
    if (undefined != TextPr.Spacing) {
        this.Set_Spacing(null === TextPr.Spacing ? undefined : TextPr.Spacing);
    }
    if (undefined != TextPr.DStrikeout) {
        this.Set_DStrikeout(null === TextPr.DStrikeout ? undefined : TextPr.DStrikeout);
    }
    if (undefined != TextPr.Caps) {
        this.Set_Caps(null === TextPr.Caps ? undefined : TextPr.Caps);
    }
    if (undefined != TextPr.SmallCaps) {
        this.Set_SmallCaps(null === TextPr.SmallCaps ? undefined : TextPr.SmallCaps);
    }
    if (undefined != TextPr.Position) {
        this.Set_Position(null === TextPr.Position ? undefined : TextPr.Position);
    }
    if (undefined != TextPr.RFonts) {
        if (this.Type == para_Math_Run && !this.IsNormalText()) {
            if (TextPr.RFonts.Ascii !== undefined || TextPr.RFonts.HAnsi !== undefined) {
                var RFonts = new CRFonts();
                RFonts.Set_All("Cambria Math", -1);
                this.Set_RFonts2(RFonts);
            }
        } else {
            this.Set_RFonts2(TextPr.RFonts);
        }
    }
    if (undefined != TextPr.Lang) {
        this.Set_Lang2(TextPr.Lang);
    }
    if (undefined !== TextPr.Shd) {
        this.Set_Shd(TextPr.Shd);
    }
};
ParaRun.prototype.Set_Bold = function (Value) {
    if (Value !== this.Pr.Bold) {
        var OldValue = this.Pr.Bold;
        this.Pr.Bold = Value;
        History.Add(this, {
            Type: historyitem_ParaRun_Bold,
            New: Value,
            Old: OldValue
        });
        this.Recalc_CompiledPr(true);
    }
};
ParaRun.prototype.Get_Bold = function () {
    return this.Get_CompiledPr(false).Bold;
};
ParaRun.prototype.Set_Italic = function (Value) {
    if (Value !== this.Pr.Italic) {
        var OldValue = this.Pr.Italic;
        this.Pr.Italic = Value;
        History.Add(this, {
            Type: historyitem_ParaRun_Italic,
            New: Value,
            Old: OldValue
        });
        this.Recalc_CompiledPr(true);
    }
};
ParaRun.prototype.Get_Italic = function () {
    return this.Get_CompiledPr(false).Italic;
};
ParaRun.prototype.Set_Strikeout = function (Value) {
    if (Value !== this.Pr.Strikeout) {
        var OldValue = this.Pr.Strikeout;
        this.Pr.Strikeout = Value;
        History.Add(this, {
            Type: historyitem_ParaRun_Strikeout,
            New: Value,
            Old: OldValue
        });
        this.Recalc_CompiledPr(false);
    }
};
ParaRun.prototype.Get_Strikeout = function () {
    return this.Get_CompiledPr(false).Strikeout;
};
ParaRun.prototype.Set_Underline = function (Value) {
    if (Value !== this.Pr.Underline) {
        var OldValue = this.Pr.Underline;
        this.Pr.Underline = Value;
        History.Add(this, {
            Type: historyitem_ParaRun_Underline,
            New: Value,
            Old: OldValue
        });
        this.Recalc_CompiledPr(false);
    }
};
ParaRun.prototype.Get_Underline = function () {
    return this.Get_CompiledPr(false).Underline;
};
ParaRun.prototype.Set_FontSize = function (Value) {
    if (Value !== this.Pr.FontSize) {
        var OldValue = this.Pr.FontSize;
        this.Pr.FontSize = Value;
        History.Add(this, {
            Type: historyitem_ParaRun_FontSize,
            New: Value,
            Old: OldValue
        });
        this.Recalc_CompiledPr(true);
    }
};
ParaRun.prototype.Get_FontSize = function () {
    return this.Get_CompiledPr(false).FontSize;
};
ParaRun.prototype.Set_Color = function (Value) {
    if ((undefined === Value && undefined !== this.Pr.Color) || (Value instanceof CDocumentColor && (undefined === this.Pr.Color || false === Value.Compare(this.Pr.Color)))) {
        var OldValue = this.Pr.Color;
        this.Pr.Color = Value;
        History.Add(this, {
            Type: historyitem_ParaRun_Color,
            New: Value,
            Old: OldValue
        });
        this.Recalc_CompiledPr(false);
    }
};
ParaRun.prototype.Set_Unifill = function (Value) {
    if ((undefined === Value && undefined !== this.Pr.Unifill) || (Value instanceof CUniFill && (undefined === this.Pr.Unifill || false === CompareUnifillBool(this.Pr.Unifill, Value)))) {
        var OldValue = this.Pr.Unifill;
        this.Pr.Unifill = Value;
        History.Add(this, {
            Type: historyitem_ParaRun_Unifill,
            New: Value,
            Old: OldValue
        });
        this.Recalc_CompiledPr(false);
    }
};
ParaRun.prototype.Get_Color = function () {
    return this.Get_CompiledPr(false).Color;
};
ParaRun.prototype.Set_VertAlign = function (Value) {
    if (Value !== this.Pr.VertAlign) {
        var OldValue = this.Pr.VertAlign;
        this.Pr.VertAlign = Value;
        History.Add(this, {
            Type: historyitem_ParaRun_VertAlign,
            New: Value,
            Old: OldValue
        });
        this.Recalc_CompiledPr(true);
    }
};
ParaRun.prototype.Get_VertAlign = function () {
    return this.Get_CompiledPr(false).VertAlign;
};
ParaRun.prototype.Set_HighLight = function (Value) {
    var OldValue = this.Pr.HighLight;
    if ((undefined === Value && undefined !== OldValue) || (highlight_None === Value && highlight_None !== OldValue) || (Value instanceof CDocumentColor && (undefined === OldValue || highlight_None === OldValue || false === Value.Compare(OldValue)))) {
        this.Pr.HighLight = Value;
        History.Add(this, {
            Type: historyitem_ParaRun_HighLight,
            New: Value,
            Old: OldValue
        });
        this.Recalc_CompiledPr(false);
    }
};
ParaRun.prototype.Get_HighLight = function () {
    return this.Get_CompiledPr(false).HighLight;
};
ParaRun.prototype.Set_RStyle = function (Value) {
    if (Value !== this.Pr.RStyle) {
        var OldValue = this.Pr.RStyle;
        this.Pr.RStyle = Value;
        History.Add(this, {
            Type: historyitem_ParaRun_RStyle,
            New: Value,
            Old: OldValue
        });
        this.Recalc_CompiledPr(true);
    }
};
ParaRun.prototype.Set_Spacing = function (Value) {
    if (Value !== this.Pr.Spacing) {
        var OldValue = this.Pr.Spacing;
        this.Pr.Spacing = Value;
        History.Add(this, {
            Type: historyitem_ParaRun_Spacing,
            New: Value,
            Old: OldValue
        });
        this.Recalc_CompiledPr(true);
    }
};
ParaRun.prototype.Get_Spacing = function () {
    return this.Get_CompiledPr(false).Spacing;
};
ParaRun.prototype.Set_DStrikeout = function (Value) {
    if (Value !== this.Pr.Value) {
        var OldValue = this.Pr.DStrikeout;
        this.Pr.DStrikeout = Value;
        History.Add(this, {
            Type: historyitem_ParaRun_DStrikeout,
            New: Value,
            Old: OldValue
        });
        this.Recalc_CompiledPr(false);
    }
};
ParaRun.prototype.Get_DStrikeout = function () {
    return this.Get_CompiledPr(false).DStrikeout;
};
ParaRun.prototype.Set_Caps = function (Value) {
    if (Value !== this.Pr.Caps) {
        var OldValue = this.Pr.Caps;
        this.Pr.Caps = Value;
        History.Add(this, {
            Type: historyitem_ParaRun_Caps,
            New: Value,
            Old: OldValue
        });
        this.Recalc_CompiledPr(true);
    }
};
ParaRun.prototype.Get_Caps = function () {
    return this.Get_CompiledPr(false).Caps;
};
ParaRun.prototype.Set_SmallCaps = function (Value) {
    if (Value !== this.Pr.SmallCaps) {
        var OldValue = this.Pr.SmallCaps;
        this.Pr.SmallCaps = Value;
        History.Add(this, {
            Type: historyitem_ParaRun_SmallCaps,
            New: Value,
            Old: OldValue
        });
        this.Recalc_CompiledPr(true);
    }
};
ParaRun.prototype.Get_SmallCaps = function () {
    return this.Get_CompiledPr(false).SmallCaps;
};
ParaRun.prototype.Set_Position = function (Value) {
    if (Value !== this.Pr.Position) {
        var OldValue = this.Pr.Position;
        this.Pr.Position = Value;
        History.Add(this, {
            Type: historyitem_ParaRun_Position,
            New: Value,
            Old: OldValue
        });
        this.Recalc_CompiledPr(false);
        this.YOffset = this.Get_Position();
    }
};
ParaRun.prototype.Get_Position = function () {
    return this.Get_CompiledPr(false).Position;
};
ParaRun.prototype.Set_RFonts = function (Value) {
    var OldValue = this.Pr.RFonts;
    this.Pr.RFonts = Value;
    History.Add(this, {
        Type: historyitem_ParaRun_RFonts,
        New: Value,
        Old: OldValue
    });
    this.Recalc_CompiledPr(true);
};
ParaRun.prototype.Get_RFonts = function () {
    return this.Get_CompiledPr(false).RFonts;
};
ParaRun.prototype.Set_RFonts2 = function (RFonts) {
    if (undefined != RFonts) {
        if (undefined != RFonts.Ascii) {
            this.Set_RFonts_Ascii(RFonts.Ascii);
        }
        if (undefined != RFonts.HAnsi) {
            this.Set_RFonts_HAnsi(RFonts.HAnsi);
        }
        if (undefined != RFonts.CS) {
            this.Set_RFonts_CS(RFonts.CS);
        }
        if (undefined != RFonts.EastAsia) {
            this.Set_RFonts_EastAsia(RFonts.EastAsia);
        }
        if (undefined != RFonts.Hint) {
            this.Set_RFonts_Hint(RFonts.Hint);
        }
    } else {
        this.Set_RFonts_Ascii(undefined);
        this.Set_RFonts_HAnsi(undefined);
        this.Set_RFonts_CS(undefined);
        this.Set_RFonts_EastAsia(undefined);
        this.Set_RFonts_Hint(undefined);
    }
};
ParaRun.prototype.Set_RFont_ForMathRun = function () {
    this.Set_RFonts_Ascii({
        Name: "Cambria Math",
        Index: -1
    });
    this.Set_RFonts_CS({
        Name: "Cambria Math",
        Index: -1
    });
    this.Set_RFonts_EastAsia({
        Name: "Cambria Math",
        Index: -1
    });
    this.Set_RFonts_HAnsi({
        Name: "Cambria Math",
        Index: -1
    });
};
ParaRun.prototype.Set_RFonts_Ascii = function (Value) {
    if (Value !== this.Pr.RFonts.Ascii) {
        var OldValue = this.Pr.RFonts.Ascii;
        this.Pr.RFonts.Ascii = Value;
        History.Add(this, {
            Type: historyitem_ParaRun_RFonts_Ascii,
            New: Value,
            Old: OldValue
        });
        this.Recalc_CompiledPr(true);
    }
};
ParaRun.prototype.Set_RFonts_HAnsi = function (Value) {
    if (Value !== this.Pr.RFonts.HAnsi) {
        var OldValue = this.Pr.RFonts.HAnsi;
        this.Pr.RFonts.HAnsi = Value;
        History.Add(this, {
            Type: historyitem_ParaRun_RFonts_HAnsi,
            New: Value,
            Old: OldValue
        });
        this.Recalc_CompiledPr(true);
    }
};
ParaRun.prototype.Set_RFonts_CS = function (Value) {
    if (Value !== this.Pr.RFonts.CS) {
        var OldValue = this.Pr.RFonts.CS;
        this.Pr.RFonts.CS = Value;
        History.Add(this, {
            Type: historyitem_ParaRun_RFonts_CS,
            New: Value,
            Old: OldValue
        });
        this.Recalc_CompiledPr(true);
    }
};
ParaRun.prototype.Set_RFonts_EastAsia = function (Value) {
    if (Value !== this.Pr.RFonts.EastAsia) {
        var OldValue = this.Pr.RFonts.EastAsia;
        this.Pr.RFonts.EastAsia = Value;
        History.Add(this, {
            Type: historyitem_ParaRun_RFonts_EastAsia,
            New: Value,
            Old: OldValue
        });
        this.Recalc_CompiledPr(true);
    }
};
ParaRun.prototype.Set_RFonts_Hint = function (Value) {
    if (Value !== this.Pr.RFonts.Hint) {
        var OldValue = this.Pr.RFonts.Hint;
        this.Pr.RFonts.Hint = Value;
        History.Add(this, {
            Type: historyitem_ParaRun_RFonts_Hint,
            New: Value,
            Old: OldValue
        });
        this.Recalc_CompiledPr(true);
    }
};
ParaRun.prototype.Set_Lang = function (Value) {
    var OldValue = this.Pr.Lang;
    this.Pr.Lang = new CLang();
    if (undefined != Value) {
        this.Pr.Lang.Set_FromObject(Value);
    }
    History.Add(this, {
        Type: historyitem_ParaRun_Lang,
        New: this.Pr.Lang,
        Old: OldValue
    });
    this.Recalc_CompiledPr(false);
};
ParaRun.prototype.Set_Lang2 = function (Lang) {
    if (undefined != Lang) {
        if (undefined != Lang.Bidi) {
            this.Set_Lang_Bidi(Lang.Bidi);
        }
        if (undefined != Lang.EastAsia) {
            this.Set_Lang_EastAsia(Lang.EastAsia);
        }
        if (undefined != Lang.Val) {
            this.Set_Lang_Val(Lang.Val);
        }
        this.protected_UpdateSpellChecking();
    }
};
ParaRun.prototype.Set_Lang_Bidi = function (Value) {
    if (Value !== this.Pr.Lang.Bidi) {
        var OldValue = this.Pr.Lang.Bidi;
        this.Pr.Lang.Bidi = Value;
        History.Add(this, {
            Type: historyitem_ParaRun_Lang_Bidi,
            New: Value,
            Old: OldValue
        });
        this.Recalc_CompiledPr(false);
    }
};
ParaRun.prototype.Set_Lang_EastAsia = function (Value) {
    if (Value !== this.Pr.Lang.EastAsia) {
        var OldValue = this.Pr.Lang.EastAsia;
        this.Pr.Lang.EastAsia = Value;
        History.Add(this, {
            Type: historyitem_ParaRun_Lang_EastAsia,
            New: Value,
            Old: OldValue
        });
        this.Recalc_CompiledPr(false);
    }
};
ParaRun.prototype.Set_Lang_Val = function (Value) {
    if (Value !== this.Pr.Lang.Val) {
        var OldValue = this.Pr.Lang.Val;
        this.Pr.Lang.Val = Value;
        History.Add(this, {
            Type: historyitem_ParaRun_Lang_Val,
            New: Value,
            Old: OldValue
        });
        this.Recalc_CompiledPr(false);
    }
};
ParaRun.prototype.Set_Shd = function (Shd) {
    if ((undefined === this.Pr.Shd && undefined === Shd) || (undefined !== this.Pr.Shd && undefined !== Shd && true === this.Pr.Shd.Compare(Shd))) {
        return;
    }
    var OldShd = this.Pr.Shd;
    if (undefined !== Shd) {
        this.Pr.Shd = new CDocumentShd();
        this.Pr.Shd.Set_FromObject(Shd);
    } else {
        this.Pr.Shd = undefined;
    }
    History.Add(this, {
        Type: historyitem_ParaRun_Shd,
        New: this.Pr.Shd,
        Old: OldShd
    });
    this.Recalc_CompiledPr(false);
};
ParaRun.prototype.Undo = function (Data) {
    var Type = Data.Type;
    switch (Type) {
    case historyitem_ParaRun_AddItem:
        this.Content.splice(Data.Pos, Data.EndPos - Data.Pos + 1);
        this.RecalcInfo.Measure = true;
        this.protected_UpdateSpellChecking();
        this.private_UpdateMathResize();
        break;
    case historyitem_ParaRun_RemoveItem:
        var Pos = Data.Pos;
        var Array_start = this.Content.slice(0, Pos);
        var Array_end = this.Content.slice(Pos);
        this.Content = Array_start.concat(Data.Items, Array_end);
        this.RecalcInfo.Measure = true;
        this.protected_UpdateSpellChecking();
        this.private_UpdateMathResize();
        break;
    case historyitem_ParaRun_TextPr:
        if (undefined != Data.Old) {
            this.Pr = Data.Old;
        } else {
            this.Pr = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_Bold:
        if (undefined != Data.Old) {
            this.Pr.Bold = Data.Old;
        } else {
            this.Pr.Bold = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_Italic:
        if (undefined != Data.Old) {
            this.Pr.Italic = Data.Old;
        } else {
            this.Pr.Italic = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_Strikeout:
        if (undefined != Data.Old) {
            this.Pr.Strikeout = Data.Old;
        } else {
            this.Pr.Strikeout = undefined;
        }
        this.Recalc_CompiledPr(false);
        break;
    case historyitem_ParaRun_Underline:
        if (undefined != Data.Old) {
            this.Pr.Underline = Data.Old;
        } else {
            this.Pr.Underline = undefined;
        }
        this.Recalc_CompiledPr(false);
        break;
    case historyitem_ParaRun_FontSize:
        if (undefined != Data.Old) {
            this.Pr.FontSize = Data.Old;
        } else {
            this.Pr.FontSize = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_Color:
        if (undefined != Data.Old) {
            this.Pr.Color = Data.Old;
        } else {
            this.Pr.Color = undefined;
        }
        this.Recalc_CompiledPr(false);
        break;
    case historyitem_ParaRun_Unifill:
        if (undefined != Data.Old) {
            this.Pr.Unifill = Data.Old;
        } else {
            this.Pr.Unifill = undefined;
        }
        this.Recalc_CompiledPr(false);
        break;
    case historyitem_ParaRun_VertAlign:
        if (undefined != Data.Old) {
            this.Pr.VertAlign = Data.Old;
        } else {
            this.Pr.VertAlign = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_HighLight:
        if (undefined != Data.Old) {
            this.Pr.HighLight = Data.Old;
        } else {
            this.Pr.HighLight = undefined;
        }
        this.Recalc_CompiledPr(false);
        break;
    case historyitem_ParaRun_RStyle:
        if (undefined != Data.Old) {
            this.Pr.RStyle = Data.Old;
        } else {
            this.Pr.RStyle = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_Spacing:
        if (undefined != Data.Old) {
            this.Pr.Spacing = Data.Old;
        } else {
            this.Pr.Spacing = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_DStrikeout:
        if (undefined != Data.Old) {
            this.Pr.DStrikeout = Data.Old;
        } else {
            this.Pr.DStrikeout = undefined;
        }
        this.Recalc_CompiledPr(false);
        break;
    case historyitem_ParaRun_Caps:
        if (undefined != Data.Old) {
            this.Pr.Caps = Data.Old;
        } else {
            this.Pr.Caps = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_SmallCaps:
        if (undefined != Data.Old) {
            this.Pr.SmallCaps = Data.Old;
        } else {
            this.Pr.SmallCaps = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_Position:
        if (undefined != Data.Old) {
            this.Pr.Position = Data.Old;
        } else {
            this.Pr.Position = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_RFonts:
        if (undefined != Data.Old) {
            this.Pr.RFonts = Data.Old;
        } else {
            this.Pr.RFonts = new CRFonts();
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_RFonts_Ascii:
        if (undefined != Data.Old) {
            this.Pr.RFonts.Ascii = Data.Old;
        } else {
            this.Pr.RFonts.Ascii = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_RFonts_HAnsi:
        if (undefined != Data.Old) {
            this.Pr.RFonts.HAnsi = Data.Old;
        } else {
            this.Pr.RFonts.HAnsi = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_RFonts_CS:
        if (undefined != Data.Old) {
            this.Pr.RFonts.CS = Data.Old;
        } else {
            this.Pr.RFonts.CS = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_RFonts_EastAsia:
        if (undefined != Data.Old) {
            this.Pr.RFonts.EastAsia = Data.Old;
        } else {
            this.Pr.RFonts.EastAsia = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_RFonts_Hint:
        if (undefined != Data.Old) {
            this.Pr.RFonts.Hint = Data.Old;
        } else {
            this.Pr.RFonts.Hint = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_Lang:
        if (undefined != Data.Old) {
            this.Pr.Lang = Data.Old;
        } else {
            this.Pr.Lang = new CLang();
        }
        this.Recalc_CompiledPr(false);
        this.protected_UpdateSpellChecking();
        break;
    case historyitem_ParaRun_Lang_Bidi:
        if (undefined != Data.Old) {
            this.Pr.Lang.Bidi = Data.Old;
        } else {
            this.Pr.Lang.Bidi = undefined;
        }
        this.Recalc_CompiledPr(false);
        this.protected_UpdateSpellChecking();
        break;
    case historyitem_ParaRun_Lang_EastAsia:
        if (undefined != Data.Old) {
            this.Pr.Lang.EastAsia = Data.Old;
        } else {
            this.Pr.Lang.EastAsia = undefined;
        }
        this.Recalc_CompiledPr(false);
        this.protected_UpdateSpellChecking();
        break;
    case historyitem_ParaRun_Lang_Val:
        if (undefined != Data.Old) {
            this.Pr.Lang.Val = Data.Old;
        } else {
            this.Pr.Lang.Val = undefined;
        }
        this.Recalc_CompiledPr(false);
        this.protected_UpdateSpellChecking();
        break;
    case historyitem_ParaRun_Shd:
        this.Pr.Shd = Data.Old;
        this.Recalc_CompiledPr(false);
        break;
    case historyitem_ParaRun_MathStyle:
        this.MathPrp.sty = Data.Old;
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_MathPrp:
        this.MathPrp = Data.Old;
        this.Recalc_CompiledPr(true);
        break;
    }
};
ParaRun.prototype.Redo = function (Data) {
    var Type = Data.Type;
    switch (Type) {
    case historyitem_ParaRun_AddItem:
        var Pos = Data.Pos;
        var Array_start = this.Content.slice(0, Pos);
        var Array_end = this.Content.slice(Pos);
        this.Content = Array_start.concat(Data.Items, Array_end);
        this.RecalcInfo.Measure = true;
        this.protected_UpdateSpellChecking();
        this.private_UpdateMathResize();
        break;
    case historyitem_ParaRun_RemoveItem:
        this.Content.splice(Data.Pos, Data.EndPos - Data.Pos + 1);
        this.RecalcInfo.Measure = true;
        this.protected_UpdateSpellChecking();
        this.private_UpdateMathResize();
        break;
    case historyitem_ParaRun_TextPr:
        if (undefined != Data.New) {
            this.Pr = Data.New;
        } else {
            this.Pr = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_Bold:
        if (undefined != Data.New) {
            this.Pr.Bold = Data.New;
        } else {
            this.Pr.Bold = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_Italic:
        if (undefined != Data.New) {
            this.Pr.Italic = Data.New;
        } else {
            this.Pr.Italic = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_Strikeout:
        if (undefined != Data.New) {
            this.Pr.Strikeout = Data.New;
        } else {
            this.Pr.Strikeout = undefined;
        }
        this.Recalc_CompiledPr(false);
        break;
    case historyitem_ParaRun_Underline:
        if (undefined != Data.New) {
            this.Pr.Underline = Data.New;
        } else {
            this.Pr.Underline = undefined;
        }
        this.Recalc_CompiledPr(false);
        break;
    case historyitem_ParaRun_FontSize:
        if (undefined != Data.New) {
            this.Pr.FontSize = Data.New;
        } else {
            this.Pr.FontSize = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_Color:
        if (undefined != Data.New) {
            this.Pr.Color = Data.New;
        } else {
            this.Pr.Color = undefined;
        }
        this.Recalc_CompiledPr(false);
        break;
    case historyitem_ParaRun_Unifill:
        if (undefined != Data.New) {
            this.Pr.Unifill = Data.New;
        } else {
            this.Pr.Unifill = undefined;
        }
        this.Recalc_CompiledPr(false);
        break;
    case historyitem_ParaRun_VertAlign:
        if (undefined != Data.New) {
            this.Pr.VertAlign = Data.New;
        } else {
            this.Pr.VertAlign = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_HighLight:
        if (undefined != Data.New) {
            this.Pr.HighLight = Data.New;
        } else {
            this.Pr.HighLight = undefined;
        }
        this.Recalc_CompiledPr(false);
        break;
    case historyitem_ParaRun_RStyle:
        if (undefined != Data.New) {
            this.Pr.RStyle = Data.New;
        } else {
            this.Pr.RStyle = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_Spacing:
        if (undefined != Data.New) {
            this.Pr.Spacing = Data.New;
        } else {
            this.Pr.Spacing = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_DStrikeout:
        if (undefined != Data.New) {
            this.Pr.DStrikeout = Data.New;
        } else {
            this.Pr.DStrikeout = undefined;
        }
        this.Recalc_CompiledPr(false);
        break;
    case historyitem_ParaRun_Caps:
        if (undefined != Data.New) {
            this.Pr.Caps = Data.New;
        } else {
            this.Pr.Caps = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_SmallCaps:
        if (undefined != Data.New) {
            this.Pr.SmallCaps = Data.New;
        } else {
            this.Pr.SmallCaps = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_Position:
        if (undefined != Data.New) {
            this.Pr.Position = Data.New;
        } else {
            this.Pr.Position = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_RFonts:
        if (undefined != Data.New) {
            this.Pr.RFonts = Data.New;
        } else {
            this.Pr.RFonts = new CRFonts();
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_RFonts_Ascii:
        if (undefined != Data.New) {
            this.Pr.RFonts.Ascii = Data.New;
        } else {
            this.Pr.RFonts.Ascii = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_RFonts_HAnsi:
        if (undefined != Data.New) {
            this.Pr.RFonts.HAnsi = Data.New;
        } else {
            this.Pr.RFonts.HAnsi = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_RFonts_CS:
        if (undefined != Data.New) {
            this.Pr.RFonts.CS = Data.New;
        } else {
            this.Pr.RFonts.CS = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_RFonts_EastAsia:
        if (undefined != Data.New) {
            this.Pr.RFonts.EastAsia = Data.New;
        } else {
            this.Pr.RFonts.EastAsia = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_RFonts_Hint:
        if (undefined != Data.New) {
            this.Pr.RFonts.Hint = Data.New;
        } else {
            this.Pr.RFonts.Hint = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_Lang:
        if (undefined != Data.New) {
            this.Pr.Lang = Data.New;
        } else {
            this.Pr.Lang = new CLang();
        }
        this.Recalc_CompiledPr(false);
        this.protected_UpdateSpellChecking();
        break;
    case historyitem_ParaRun_Lang_Bidi:
        if (undefined != Data.New) {
            this.Pr.Lang.Bidi = Data.New;
        } else {
            this.Pr.Lang.Bidi = undefined;
        }
        this.Recalc_CompiledPr(false);
        this.protected_UpdateSpellChecking();
        break;
    case historyitem_ParaRun_Lang_EastAsia:
        if (undefined != Data.New) {
            this.Pr.Lang.EastAsia = Data.New;
        } else {
            this.Pr.Lang.EastAsia = undefined;
        }
        this.Recalc_CompiledPr(false);
        this.protected_UpdateSpellChecking();
        break;
    case historyitem_ParaRun_Lang_Val:
        if (undefined != Data.New) {
            this.Pr.Lang.Val = Data.New;
        } else {
            this.Pr.Lang.Val = undefined;
        }
        this.Recalc_CompiledPr(false);
        this.protected_UpdateSpellChecking();
        break;
    case historyitem_ParaRun_Shd:
        this.Pr.Shd = Data.New;
        this.Recalc_CompiledPr(false);
        break;
    case historyitem_ParaRun_MathStyle:
        this.MathPrp.sty = Data.New;
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_MathPrp:
        this.MathPrp = Data.New;
        this.Recalc_CompiledPr(true);
        break;
    }
};
ParaRun.prototype.Check_HistoryUninon = function (Data1, Data2) {
    var Type1 = Data1.Type;
    var Type2 = Data2.Type;
    if (historyitem_ParaRun_AddItem === Type1 && historyitem_ParaRun_AddItem === Type2) {
        if (1 === Data1.Items.length && 1 === Data2.Items.length && Data1.Pos === Data2.Pos - 1 && para_Text === Data1.Items[0].Type && para_Text === Data2.Items[0].Type) {
            return true;
        }
    }
    return false;
};
ParaRun.prototype.Save_Changes = function (Data, Writer) {
    Writer.WriteLong(historyitem_type_ParaRun);
    var Type = Data.Type;
    Writer.WriteLong(Type);
    switch (Type) {
    case historyitem_ParaRun_AddItem:
        var bArray = Data.UseArray;
        var Count = Data.Items.length;
        if (false === Data.Color) {
            Writer.WriteBool(false);
        } else {
            Writer.WriteBool(true);
        }
        Writer.WriteLong(Count);
        for (var Index = 0; Index < Count; Index++) {
            if (true === bArray) {
                Writer.WriteLong(Data.PosArray[Index]);
            } else {
                Writer.WriteLong(Data.Pos + Index);
            }
            Data.Items[Index].Write_ToBinary(Writer);
        }
        break;
    case historyitem_ParaRun_RemoveItem:
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
    case historyitem_ParaRun_TextPr:
        this.Pr.Write_ToBinary(Writer);
        break;
    case historyitem_ParaRun_Bold:
        case historyitem_ParaRun_Italic:
        case historyitem_ParaRun_Strikeout:
        case historyitem_ParaRun_Underline:
        if (undefined != Data.New) {
            Writer.WriteBool(false);
            Writer.WriteBool(Data.New);
        } else {
            Writer.WriteBool(true);
        }
        break;
    case historyitem_ParaRun_FontSize:
        if (undefined != Data.New) {
            Writer.WriteBool(false);
            Writer.WriteDouble(Data.New);
        } else {
            Writer.WriteBool(true);
        }
        break;
    case historyitem_ParaRun_Color:
        if (undefined != Data.New) {
            Writer.WriteBool(false);
            Data.New.Write_ToBinary(Writer);
        } else {
            Writer.WriteBool(true);
        }
        break;
    case historyitem_ParaRun_Unifill:
        if (undefined != Data.New) {
            Writer.WriteBool(false);
            Data.New.Write_ToBinary(Writer);
        } else {
            Writer.WriteBool(true);
        }
        break;
    case historyitem_ParaRun_VertAlign:
        if (undefined != Data.New) {
            Writer.WriteBool(false);
            Writer.WriteLong(Data.New);
        } else {
            Writer.WriteBool(true);
        }
        break;
    case historyitem_ParaRun_HighLight:
        if (undefined != Data.New) {
            Writer.WriteBool(false);
            if (highlight_None != Data.New) {
                Writer.WriteBool(false);
                Data.New.Write_ToBinary(Writer);
            } else {
                Writer.WriteBool(true);
            }
        } else {
            Writer.WriteBool(true);
        }
        break;
    case historyitem_ParaRun_RStyle:
        if (undefined != Data.New) {
            Writer.WriteBool(false);
            Writer.WriteString2(Data.New);
        } else {
            Writer.WriteBool(true);
        }
        break;
    case historyitem_ParaRun_Spacing:
        case historyitem_ParaRun_Position:
        if (undefined != Data.New) {
            Writer.WriteBool(false);
            Writer.WriteDouble(Data.New);
        } else {
            Writer.WriteBool(true);
        }
        break;
    case historyitem_ParaRun_DStrikeout:
        case historyitem_ParaRun_Caps:
        case historyitem_ParaRun_SmallCaps:
        if (undefined != Data.New) {
            Writer.WriteBool(false);
            Writer.WriteBool(Data.New);
        } else {
            Writer.WriteBool(true);
        }
        break;
    case historyitem_ParaRun_RFonts:
        if (undefined != Data.New) {
            Writer.WriteBool(false);
            Data.New.Write_ToBinary(Writer);
        } else {
            Writer.WriteBool(true);
        }
        break;
    case historyitem_ParaRun_RFonts_Ascii:
        case historyitem_ParaRun_RFonts_HAnsi:
        case historyitem_ParaRun_RFonts_CS:
        case historyitem_ParaRun_RFonts_EastAsia:
        if (undefined != Data.New) {
            Writer.WriteBool(false);
            Writer.WriteString2(Data.New.Name);
        } else {
            Writer.WriteBool(true);
        }
        break;
    case historyitem_ParaRun_RFonts_Hint:
        if (undefined != Data.New) {
            Writer.WriteBool(false);
            Writer.WriteLong(Data.New);
        } else {
            Writer.WriteBool(true);
        }
        break;
    case historyitem_ParaRun_Lang:
        if (undefined != Data.New) {
            Writer.WriteBool(false);
            Data.New.Write_ToBinary(Writer);
        } else {
            Writer.WriteBool(true);
        }
        break;
    case historyitem_ParaRun_Lang_Bidi:
        case historyitem_ParaRun_Lang_EastAsia:
        case historyitem_ParaRun_Lang_Val:
        if (undefined != Data.New) {
            Writer.WriteBool(false);
            Writer.WriteLong(Data.New);
        } else {
            Writer.WriteBool(true);
        }
        break;
    case historyitem_ParaRun_Shd:
        if (undefined !== Data.New) {
            Writer.WriteBool(false);
            Data.New.Write_ToBinary(Writer);
        } else {
            Writer.WriteBool(true);
        }
        break;
    case historyitem_ParaRun_MathStyle:
        if (undefined != Data.New) {
            Writer.WriteBool(false);
            Writer.WriteLong(Data.New);
        } else {
            Writer.WriteBool(true);
        }
        break;
    case historyitem_ParaRun_MathPrp:
        var StartPos = Writer.GetCurPosition();
        Writer.Skip(4);
        var Flags = 0;
        if (undefined != this.MathPrp.aln) {
            Writer.WriteBool(this.MathPrp.aln);
            Flags |= 1;
        }
        if (undefined != this.MathPrp.brk) {
            Writer.WriteBool(this.MathPrp.brk);
            Flags |= 2;
        }
        if (undefined != this.MathPrp.lit) {
            Writer.WriteBool(this.MathPrp.lit);
            Flags |= 4;
        }
        if (undefined != this.MathPrp.nor) {
            Writer.WriteBool(this.MathPrp.nor);
            Flags |= 8;
        }
        if (undefined != this.MathPrp.scr) {
            Writer.WriteLong(this.MathPrp.scr);
            Flags |= 16;
        }
        if (undefined != this.MathPrp.sty) {
            Writer.WriteLong(this.MathPrp.sty);
            Flags |= 32;
        }
        var EndPos = Writer.GetCurPosition();
        Writer.Seek(StartPos);
        Writer.WriteLong(Flags);
        Writer.Seek(EndPos);
        break;
    }
    return Writer;
};
ParaRun.prototype.Load_Changes = function (Reader, Reader2, Color) {
    var ClassType = Reader.GetLong();
    if (historyitem_type_ParaRun != ClassType) {
        return;
    }
    var Type = Reader.GetLong();
    switch (Type) {
    case historyitem_ParaRun_AddItem:
        var bColorChanges = Reader.GetBool();
        var Count = Reader.GetLong();
        for (var Index = 0; Index < Count; Index++) {
            var Pos = this.m_oContentChanges.Check(contentchanges_Add, Reader.GetLong());
            var Element = ParagraphContent_Read_FromBinary(Reader);
            if (null != Element) {
                if (true === bColorChanges && null !== Color) {
                    this.CollaborativeMarks.Update_OnAdd(Pos);
                    this.CollaborativeMarks.Add(Pos, Pos + 1, Color);
                    CollaborativeEditing.Add_ChangedClass(this);
                }
                this.Content.splice(Pos, 0, Element);
            }
        }
        this.RecalcInfo.Measure = true;
        this.protected_UpdateSpellChecking();
        this.private_UpdateMathResize();
        break;
    case historyitem_ParaRun_RemoveItem:
        var Count = Reader.GetLong();
        for (var Index = 0; Index < Count; Index++) {
            var ChangesPos = this.m_oContentChanges.Check(contentchanges_Remove, Reader.GetLong());
            if (false === ChangesPos) {
                continue;
            }
            this.CollaborativeMarks.Update_OnRemove(ChangesPos, 1);
            this.Content.splice(ChangesPos, 1);
        }
        this.RecalcInfo.Measure = true;
        this.protected_UpdateSpellChecking();
        this.private_UpdateMathResize();
        break;
    case historyitem_ParaRun_TextPr:
        this.Pr = new CTextPr();
        this.Pr.Read_FromBinary(Reader);
        break;
    case historyitem_ParaRun_Bold:
        if (true === Reader.GetBool()) {
            this.Pr.Bold = undefined;
        } else {
            this.Pr.Bold = Reader.GetBool();
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_Italic:
        if (true === Reader.GetBool()) {
            this.Pr.Italic = undefined;
        } else {
            this.Pr.Italic = Reader.GetBool();
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_Strikeout:
        if (true === Reader.GetBool()) {
            this.Pr.Strikeout = undefined;
        } else {
            this.Pr.Strikeout = Reader.GetBool();
        }
        this.Recalc_CompiledPr(false);
        break;
    case historyitem_ParaRun_Underline:
        if (true != Reader.GetBool()) {
            this.Pr.Underline = Reader.GetBool();
        } else {
            this.Pr.Underline = undefined;
        }
        this.Recalc_CompiledPr(false);
        break;
    case historyitem_ParaRun_FontSize:
        if (true != Reader.GetBool()) {
            this.Pr.FontSize = Reader.GetDouble();
        } else {
            this.Pr.FontSize = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_Color:
        if (true != Reader.GetBool()) {
            this.Pr.Color = new CDocumentColor(0, 0, 0, false);
            this.Pr.Color.Read_FromBinary(Reader);
        } else {
            this.Pr.Color = undefined;
        }
        this.Recalc_CompiledPr(false);
        break;
    case historyitem_ParaRun_Unifill:
        if (true != Reader.GetBool()) {
            var unifill = new CUniFill();
            unifill.Read_FromBinary(Reader);
            this.Pr.Unifill = unifill;
        } else {
            this.Pr.Unifill = undefined;
        }
        this.Recalc_CompiledPr(false);
        break;
    case historyitem_ParaRun_VertAlign:
        if (true != Reader.GetBool()) {
            this.Pr.VertAlign = Reader.GetLong();
        } else {
            this.Pr.VertAlign = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_HighLight:
        if (true != Reader.GetBool()) {
            if (true != Reader.GetBool()) {
                this.Pr.HighLight = new CDocumentColor(0, 0, 0);
                this.Pr.HighLight.Read_FromBinary(Reader);
            } else {
                this.Pr.HighLight = highlight_None;
            }
        } else {
            this.Pr.HighLight = undefined;
        }
        this.Recalc_CompiledPr(false);
        break;
    case historyitem_ParaRun_RStyle:
        if (true != Reader.GetBool()) {
            this.Pr.RStyle = Reader.GetString2();
        } else {
            this.Pr.RStyle = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_Spacing:
        if (true != Reader.GetBool()) {
            this.Pr.Spacing = Reader.GetDouble();
        } else {
            this.Pr.Spacing = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_DStrikeout:
        if (true != Reader.GetBool()) {
            this.Pr.DStrikeout = Reader.GetBool();
        } else {
            this.Pr.DStrikeout = undefined;
        }
        this.Recalc_CompiledPr(false);
        break;
    case historyitem_ParaRun_Caps:
        if (true != Reader.GetBool()) {
            this.Pr.Caps = Reader.GetBool();
        } else {
            this.Pr.Caps = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_SmallCaps:
        if (true != Reader.GetBool()) {
            this.Pr.SmallCaps = Reader.GetBool();
        } else {
            this.Pr.SmallCaps = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_Position:
        if (true != Reader.GetBool()) {
            this.Pr.Position = Reader.GetDouble();
        } else {
            this.Pr.Position = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_RFonts:
        if (false === Reader.GetBool()) {
            this.Pr.RFonts = new CRFonts();
            this.Pr.RFonts.Read_FromBinary(Reader);
        } else {
            this.Pr.RFonts = new CRFonts();
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_RFonts_Ascii:
        if (false === Reader.GetBool()) {
            this.Pr.RFonts.Ascii = {
                Name: Reader.GetString2(),
                Index: -1
            };
        } else {
            this.Pr.RFonts.Ascii = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_RFonts_HAnsi:
        if (false === Reader.GetBool()) {
            this.Pr.RFonts.HAnsi = {
                Name: Reader.GetString2(),
                Index: -1
            };
        } else {
            this.Pr.RFonts.HAnsi = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_RFonts_CS:
        if (false === Reader.GetBool()) {
            this.Pr.RFonts.CS = {
                Name: Reader.GetString2(),
                Index: -1
            };
        } else {
            this.Pr.RFonts.CS = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_RFonts_EastAsia:
        if (false === Reader.GetBool()) {
            this.Pr.RFonts.EastAsia = {
                Name: Reader.GetString2(),
                Index: -1
            };
        } else {
            this.Pr.RFonts.EastAsia = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_RFonts_Hint:
        if (false === Reader.GetBool()) {
            this.Pr.RFonts.Hint = Reader.GetLong();
        } else {
            this.Pr.RFonts.Hint = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_Lang:
        if (false === Reader.GetBool()) {
            this.Pr.Lang = new CLang();
            this.Pr.Lang.Read_FromBinary(Reader);
        } else {
            this.Pr.Lang = new CLang();
        }
        this.Recalc_CompiledPr(true);
        this.protected_UpdateSpellChecking();
        break;
    case historyitem_ParaRun_Lang_Bidi:
        if (false === Reader.GetBool()) {
            this.Pr.Lang.Bidi = Reader.GetLong();
        } else {
            this.Pr.Lang.Bidi = undefined;
        }
        this.Recalc_CompiledPr(true);
        this.protected_UpdateSpellChecking();
        break;
    case historyitem_ParaRun_Lang_EastAsia:
        if (false === Reader.GetBool()) {
            this.Pr.Lang.EastAsia = Reader.GetLong();
        } else {
            this.Pr.Lang.EastAsia = undefined;
        }
        this.Recalc_CompiledPr(true);
        this.protected_UpdateSpellChecking();
        break;
    case historyitem_ParaRun_Lang_Val:
        if (false === Reader.GetBool()) {
            this.Pr.Lang.Val = Reader.GetLong();
        } else {
            this.Pr.Lang.Val = undefined;
        }
        this.Recalc_CompiledPr(true);
        this.protected_UpdateSpellChecking();
        break;
    case historyitem_ParaRun_Shd:
        if (false === Reader.GetBool()) {
            this.Pr.Shd = new CDocumentShd();
            this.Pr.Shd.Read_FromBinary(Reader);
        } else {
            this.Pr.Shd = undefined;
        }
        this.Recalc_CompiledPr(false);
        break;
    case historyitem_ParaRun_MathStyle:
        if (false === Reader.GetBool()) {
            this.MathPrp.sty = Reader.GetLong();
        } else {
            this.MathPrp.sty = undefined;
        }
        this.Recalc_CompiledPr(true);
        break;
    case historyitem_ParaRun_MathPrp:
        var Flags = Reader.GetLong();
        if (Flags & 1) {
            this.MathPrp.aln = Reader.GetBool();
        }
        if (Flags & 2) {
            this.MathPrp.brk = Reader.GetBool();
        }
        if (Flags & 4) {
            this.MathPrp.lit = Reader.GetBool();
        }
        if (Flags & 8) {
            this.MathPrp.nor = Reader.GetBool();
        }
        if (Flags & 16) {
            this.MathPrp.scr = Reader.GetLong();
        }
        if (Flags & 32) {
            this.MathPrp.sty = Reader.GetLong();
        }
        this.Recalc_CompiledPr(true);
        break;
    }
};
ParaRun.prototype.Write_ToBinary2 = function (Writer) {
    Writer.WriteLong(historyitem_type_ParaRun);
    Writer.WriteLong(this.Type);
    var ParagraphToWrite, PrToWrite, ContentToWrite;
    if (this.StartState) {
        ParagraphToWrite = this.StartState.Paragraph;
        PrToWrite = this.StartState.Pr;
        ContentToWrite = this.StartState.Content;
    } else {
        ParagraphToWrite = this.Paragraph;
        PrToWrite = this.Pr;
        ContentToWrite = this.Content;
    }
    Writer.WriteString2(this.Id);
    Writer.WriteString2(null !== ParagraphToWrite && undefined !== ParagraphToWrite ? ParagraphToWrite.Get_Id() : "");
    PrToWrite.Write_ToBinary(Writer);
    var Count = ContentToWrite.length;
    Writer.WriteLong(Count);
    for (var Index = 0; Index < Count; Index++) {
        var Item = ContentToWrite[Index];
        Item.Write_ToBinary(Writer);
    }
};
ParaRun.prototype.Read_FromBinary2 = function (Reader) {
    this.Type = Reader.GetLong();
    this.Id = Reader.GetString2();
    this.Paragraph = g_oTableId.Get_ById(Reader.GetString2());
    this.Pr = new CTextPr();
    this.Pr.Read_FromBinary(Reader);
    if (para_Math_Run == this.Type) {
        this.MathPrp = new CMPrp();
        this.size = new CMathSize();
    }
    if (undefined !== editor && true === editor.isDocumentEditor) {
        var Count = Reader.GetLong();
        this.Content = [];
        for (var Index = 0; Index < Count; Index++) {
            var Element = ParagraphContent_Read_FromBinary(Reader);
            if (null !== Element) {
                this.Content.push(Element);
            }
        }
    }
};
ParaRun.prototype.Clear_CollaborativeMarks = function () {
    this.CollaborativeMarks.Clear();
};
ParaRun.prototype.private_UpdateMathResize = function () {
    if (para_Math_Run === this.Type && undefined !== this.Parent && null !== this.Parent && null !== this.Parent.ParaMath) {
        this.Parent.ParaMath.SetNeedResize();
    }
};
ParaRun.prototype.private_RecalcCtrPrp = function () {
    if (para_Math_Run === this.Type && undefined !== this.Parent && null !== this.Parent && null !== this.Parent.ParaMath) {
        this.Parent.ParaMath.SetRecalcCtrPrp(this);
    }
};
function CParaRunSelection() {
    this.Use = false;
    this.StartPos = 0;
    this.EndPos = 0;
}
function CParaRunState() {
    this.Selection = new CParaRunSelection();
    this.ContentPos = 0;
}
function CParaRunRecalcInfo() {
    this.TextPr = true;
    this.Measure = true;
    this.Recalc = true;
    this.RunLen = 0;
    this.NumberingItem = null;
    this.NumberingUse = false;
    this.NumberingAdd = true;
}
CParaRunRecalcInfo.prototype = {
    Reset: function () {
        this.TextPr = true;
        this.Measure = true;
        this.Recalc = true;
        this.RunLen = 0;
    }
};
function CParaRunRange(StartPos, EndPos) {
    this.StartPos = StartPos;
    this.EndPos = EndPos;
}
function CParaRunLine() {
    this.Ranges = [];
    this.Ranges[0] = new CParaRunRange(0, 0);
    this.RangesLength = 0;
}
CParaRunLine.prototype = {
    Add_Range: function (RangeIndex, StartPos, EndPos) {
        if (0 !== RangeIndex) {
            this.Ranges[RangeIndex] = new CParaRunRange(StartPos, EndPos);
            this.RangesLength = RangeIndex + 1;
        } else {
            this.Ranges[0].StartPos = StartPos;
            this.Ranges[0].EndPos = EndPos;
            this.RangesLength = 1;
        }
        if (this.Ranges.length > this.RangesLength) {
            this.Ranges.legth = this.RangesLength;
        }
    },
    Copy: function () {
        var NewLine = new CParaRunLine();
        NewLine.RangesLength = this.RangesLength;
        for (var CurRange = 0; CurRange < this.RangesLength; CurRange++) {
            var Range = this.Ranges[CurRange];
            NewLine.Ranges[CurRange] = new CParaRunRange(Range.StartPos, Range.EndPos);
        }
        return NewLine;
    },
    Compare: function (OtherLine, CurRange) {
        if (this.RangesLength <= CurRange || OtherLine.RangesLength <= CurRange) {
            return false;
        }
        var OtherRange = OtherLine.Ranges[CurRange];
        var ThisRange = this.Ranges[CurRange];
        if (OtherRange.StartPos !== ThisRange.StartPos || OtherRange.EndPos !== ThisRange.EndPos) {
            return false;
        }
        return true;
    }
};
var pararun_CollaborativeMark_Start = 0;
var pararun_CollaborativeMark_End = 1;
function CParaRunCollaborativeMark(Pos, Type) {
    this.Pos = Pos;
    this.Type = Type;
}
function FontSize_IncreaseDecreaseValue(bIncrease, Value) {
    var Sizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
    var NewValue = Value;
    if (true === bIncrease) {
        if (Value < Sizes[0]) {
            if (Value >= Sizes[0] - 1) {
                NewValue = Sizes[0];
            } else {
                NewValue = Math.floor(Value + 1);
            }
        } else {
            if (Value >= Sizes[Sizes.length - 1]) {
                NewValue = Math.min(300, Math.floor(Value / 10 + 1) * 10);
            } else {
                for (var Index = 0; Index < Sizes.length; Index++) {
                    if (Value < Sizes[Index]) {
                        NewValue = Sizes[Index];
                        break;
                    }
                }
            }
        }
    } else {
        if (Value <= Sizes[0]) {
            NewValue = Math.max(Math.floor(Value - 1), 1);
        } else {
            if (Value > Sizes[Sizes.length - 1]) {
                if (Value <= Math.floor(Sizes[Sizes.length - 1] / 10 + 1) * 10) {
                    NewValue = Sizes[Sizes.length - 1];
                } else {
                    NewValue = Math.floor(Math.ceil(Value / 10) - 1) * 10;
                }
            } else {
                for (var Index = Sizes.length - 1; Index >= 0; Index--) {
                    if (Value > Sizes[Index]) {
                        NewValue = Sizes[Index];
                        break;
                    }
                }
            }
        }
    }
    return NewValue;
}
function CRunCollaborativeMarks() {
    this.Ranges = [];
    this.DrawingObj = {};
}
CRunCollaborativeMarks.prototype = {
    Add: function (PosS, PosE, Color) {
        var Count = this.Ranges.length;
        for (var Index = 0; Index < Count; Index++) {
            var Range = this.Ranges[Index];
            if (PosS > Range.PosE) {
                continue;
            } else {
                if (PosS >= Range.PosS && PosS <= Range.PosE && PosE >= Range.PosS && PosE <= Range.PosE) {
                    if (true !== Color.Compare(Range.Color)) {
                        var _PosE = Range.PosE;
                        Range.PosE = PosS;
                        this.Ranges.splice(Index + 1, 0, new CRunCollaborativeRange(PosS, PosE, Color));
                        this.Ranges.splice(Index + 2, 0, new CRunCollaborativeRange(PosE, _PosE, Range.Color));
                    }
                    return;
                } else {
                    if (PosE < Range.PosS) {
                        this.Ranges.splice(Index, 0, new CRunCollaborativeRange(PosS, PosE, Color));
                        return;
                    } else {
                        if (PosS < Range.PosS && PosE > Range.PosE) {
                            Range.PosS = PosS;
                            Range.PosE = PosE;
                            Range.Color = Color;
                            return;
                        } else {
                            if (PosS < Range.PosS) {
                                if (true === Color.Compare(Range.Color)) {
                                    Range.PosS = PosS;
                                } else {
                                    Range.PosS = PosE;
                                    this.Ranges.splice(Index, 0, new CRunCollaborativeRange(PosS, PosE, Color));
                                }
                                return;
                            } else {
                                if (true === Color.Compare(Range.Color)) {
                                    Range.PosE = PosE;
                                } else {
                                    Range.PosE = PosS;
                                    this.Ranges.splice(Index + 1, 0, new CRunCollaborativeRange(PosS, PosE, Color));
                                }
                                return;
                            }
                        }
                    }
                }
            }
        }
        this.Ranges.push(new CRunCollaborativeRange(PosS, PosE, Color));
    },
    Update_OnAdd: function (Pos) {
        var Count = this.Ranges.length;
        for (var Index = 0; Index < Count; Index++) {
            var Range = this.Ranges[Index];
            if (Pos <= Range.PosS) {
                Range.PosS++;
                Range.PosE++;
            } else {
                if (Pos > Range.PosS && Pos < Range.PosE) {
                    var NewRange = new CRunCollaborativeRange(Pos + 1, Range.PosE + 1, Range.Color.Copy());
                    this.Ranges.splice(Index + 1, 0, NewRange);
                    Range.PosE = Pos;
                    Count++;
                    Index++;
                }
            }
        }
    },
    Update_OnRemove: function (Pos, Count) {
        var Len = this.Ranges.length;
        for (var Index = 0; Index < Len; Index++) {
            var Range = this.Ranges[Index];
            var PosE = Pos + Count;
            if (Pos < Range.PosS) {
                if (PosE <= Range.PosS) {
                    Range.PosS -= Count;
                    Range.PosE -= Count;
                } else {
                    if (PosE >= Range.PosE) {
                        this.Ranges.splice(Index, 1);
                        Len--;
                        Index--;
                        continue;
                    } else {
                        Range.PosS = Pos;
                        Range.PosE -= Count;
                    }
                }
            } else {
                if (Pos >= Range.PosS && Pos < Range.PosE) {
                    if (PosE >= Range.PosE) {
                        Range.PosE = Pos;
                    } else {
                        Range.PosE -= Count;
                    }
                } else {
                    continue;
                }
            }
        }
    },
    Clear: function () {
        this.Ranges = [];
    },
    Init_Drawing: function () {
        this.DrawingObj = {};
        var Count = this.Ranges.length;
        for (var CurPos = 0; CurPos < Count; CurPos++) {
            var Range = this.Ranges[CurPos];
            for (var Pos = Range.PosS; Pos < Range.PosE; Pos++) {
                this.DrawingObj[Pos] = Range.Color;
            }
        }
    },
    Check: function (Pos) {
        if (undefined !== this.DrawingObj[Pos]) {
            return this.DrawingObj[Pos];
        }
        return null;
    }
};
function CRunCollaborativeRange(PosS, PosE, Color) {
    this.PosS = PosS;
    this.PosE = PosE;
    this.Color = Color;
}
ParaRun.prototype.Math_SetPosition = function (pos) {
    var w = 0;
    for (var i = 0; i < this.Content.length; i++) {
        var NewPos = new CMathPosition();
        NewPos.x = pos.x + w;
        NewPos.y = pos.y - this.size.ascent;
        this.Content[i].setPosition(NewPos);
        w += this.Content[i].size.width;
    }
};
ParaRun.prototype.Math_Draw = function (x, y, pGraphics) {
    var X = x;
    var Y = y + this.size.ascent;
    var oWPrp = this.Get_CompiledPr(false);
    var Font = {
        Bold: oWPrp.Bold,
        Italic: oWPrp.Italic,
        FontFamily: {
            Name: oWPrp.FontFamily.Name,
            Index: oWPrp.FontFamily.Index
        },
        FontSize: MathApplyArgSize(oWPrp.FontSize, this.Parent.Compiled_ArgSz.value)
    };
    if (this.IsMathematicalText()) {
        Font.Italic = false;
        Font.Bold = false;
    }
    pGraphics.SetFont(Font);
    pGraphics.b_color1(0, 0, 0, 255);
    for (var i = 0; i < this.Content.length; i++) {
        this.Content[i].draw(X, Y, pGraphics);
    }
};
ParaRun.prototype.Math_Recalculate = function (oMeasure, RPI, WidthPoints) {
    var RangeStartPos = 0;
    var RangeEndPos = this.Content.length;
    this.protected_AddRange(0, 0);
    this.protected_FillRange(0, 0, RangeStartPos, RangeEndPos);
    if (RPI.NeedResize) {
        var oWPrp = this.Get_CompiledPr(false);
        var Theme = this.Paragraph.Get_Theme();
        var ArgSize = this.Parent.Compiled_ArgSz.value,
        bNormalText = this.IsNormalText();
        g_oTextMeasurer.SetTextPr(oWPrp, Theme);
        var InfoMathText = new CMathInfoTextPr_2(oWPrp, ArgSize, bNormalText);
        this.bEqqArray = RPI.bEqqArray;
        this.size.SetZero();
        var widthCurr = 0,
        ascent = 0,
        descent = 0;
        var Lng = this.Content.length;
        for (var i = 0; i < Lng; i++) {
            this.Content[i].Resize(oMeasure, RPI, InfoMathText);
            var oSize = this.Content[i].size;
            widthCurr = oSize.width;
            this.size.width += widthCurr;
            var oDescent = oSize.height - oSize.ascent;
            ascent = ascent > oSize.ascent ? ascent : oSize.ascent;
            descent = descent < oDescent ? oDescent : descent;
            if (RPI.bEqqArray) {
                if (this.Content[i].Type !== para_Math_Ampersand) {
                    WidthPoints.UpdatePoint(widthCurr);
                } else {
                    WidthPoints.AddNewAlignRange();
                }
            }
        }
        this.size.ascent = ascent;
        this.size.height = ascent + descent;
        this.TextHeight = g_oTextMeasurer.GetHeight();
        this.TextDescent = Math.abs(g_oTextMeasurer.GetDescender());
        this.TextAscent = this.TextHeight - this.TextDescent;
        this.TextAscent2 = g_oTextMeasurer.GetAscender();
    }
    if (RPI.PRS.LineTextAscent < this.TextAscent) {
        RPI.PRS.LineTextAscent = this.TextAscent;
    }
    if (RPI.PRS.LineTextAscent2 < this.TextAscent2) {
        RPI.PRS.LineTextAscent2 = this.TextAscent2;
    }
    if (RPI.PRS.LineTextDescent < this.TextDescent) {
        RPI.PRS.LineTextDescent = this.TextDescent;
    }
};
ParaRun.prototype.Math_Apply_Style = function (Value) {
    if (Value !== this.MathPrp.sty) {
        var OldValue = this.MathPrp.sty;
        this.MathPrp.sty = Value;
        History.Add(this, {
            Type: historyitem_ParaRun_MathStyle,
            New: Value,
            Old: OldValue
        });
        this.Recalc_CompiledPr(true);
    }
};
ParaRun.prototype.IsNormalText = function () {
    var comp_MPrp = this.MathPrp.GetCompiled_ScrStyles();
    return comp_MPrp.nor === true;
};
ParaRun.prototype.IsMathematicalText = function () {
    var MathText = !this.IsNormalText();
    var bMFont = this.Get_CompiledPr(false).FontFamily.Name == "Cambria Math";
    return MathText && bMFont;
};
ParaRun.prototype.getPropsForWrite = function () {
    var wRPrp = this.Pr.Copy(),
    mathRPrp = this.MathPrp.getPropsForWrite();
    return {
        wRPrp: wRPrp,
        mathRPrp: mathRPrp
    };
};
ParaRun.prototype.Math_PreRecalc = function (Parent, ParaMath, ArgSize, RPI, GapsInfo) {
    this.Parent = Parent;
    this.Paragraph = ParaMath.Paragraph;
    var FontSize = this.Get_CompiledPr(false).FontSize;
    for (var Pos = 0; Pos < this.Content.length; Pos++) {
        if (!this.Content[Pos].IsAlignPoint()) {
            GapsInfo.setGaps(this.Content[Pos], FontSize);
        }
        this.Content[Pos].PreRecalc(this);
    }
};
ParaRun.prototype.IsPlaceholder = function () {
    return this.Content.length == 1 && this.Content[0].IsPlaceholder();
};
ParaRun.prototype.fillPlaceholders = function () {
    var placeholder = new CMathText(false);
    placeholder.fillPlaceholders();
    this.Add_ToContent(0, placeholder, false);
};
ParaRun.prototype.Math_Correct_Content = function () {
    for (var i = 0; i < this.Content.length; i++) {
        if (this.Content[i].Type == para_Math_Placeholder) {
            this.Remove_FromContent(i, 1, true);
        }
    }
};
ParaRun.prototype.Set_MathPr = function (MPrp) {
    var OldValue = this.MathPrp;
    this.MathPrp = MPrp;
    History.Add(this, {
        Type: historyitem_ParaRun_MathPrp,
        New: MPrp,
        Old: OldValue
    });
    this.Recalc_CompiledPr(true);
};
ParaRun.prototype.Set_MathTextPr2 = function (TextPr, MathPr) {
    this.Set_Pr(TextPr.Copy());
    this.Set_MathPr(MathPr.Copy());
};
ParaRun.prototype.IsAccent = function () {
    return this.Parent.IsAccent();
};
ParaRun.prototype.GetCompiled_ScrStyles = function () {
    return this.MathPrp.GetCompiled_ScrStyles();
};
ParaRun.prototype.IsEqqArray = function () {
    return this.Parent.IsEqqArray();
};
ParaRun.prototype.Math_GetInfoLetter = function (Info) {
    if (this.Content.length == 1) {
        var Compiled_MPrp = this.MathPrp.GetCompiled_ScrStyles();
        Info.sty = Compiled_MPrp.sty;
        Info.scr = Compiled_MPrp.scr;
        this.Content[0].getInfoLetter(Info);
    } else {
        Info.Result = false;
    }
};
ParaRun.prototype.GetMathTextPrForMenu = function () {
    var TextPr = new CTextPr();
    if (this.IsPlaceholder()) {
        TextPr.Merge(this.Parent.GetCtrPrp());
    }
    TextPr.Merge(this.Pr);
    var MathTextPr = this.MathPrp.Copy();
    var BI = MathTextPr.GetBoldItalic();
    TextPr.Italic = BI.Italic;
    TextPr.Bold = BI.Bold;
    return TextPr;
};
ParaRun.prototype.ApplyPoints = function (PointsInfo) {
    if (this.bEqqArray) {
        this.size.width = 0;
        for (var Pos = 0; Pos < this.Content.length; Pos++) {
            if (this.Content[Pos].Type == para_Math_Ampersand) {
                PointsInfo.NextAlignRange();
                this.Content[Pos].size.width = PointsInfo.GetAlign();
            }
            this.size.width += this.Content[Pos].size.width;
        }
    }
};
ParaRun.prototype.Get_TextForAutoCorrect = function (AutoCorrectEngine, RunPos) {
    var ActionElement = AutoCorrectEngine.Get_ActionElement();
    var nCount = this.Content.length;
    for (var nPos = 0; nPos < nCount; nPos++) {
        var Item = this.Content[nPos];
        if (para_Math_Text === Item.Type) {
            AutoCorrectEngine.Add_Text(String.fromCharCode(Item.value), this, nPos, RunPos);
        }
        if (Item === ActionElement) {
            AutoCorrectEngine.Stop_CollectText();
            break;
        }
    }
    if (null === AutoCorrectEngine.TextPr) {
        AutoCorrectEngine.TextPr = this.Pr.Copy();
    }
    if (null == AutoCorrectEngine.MathPr) {
        AutoCorrectEngine.MathPr = this.MathPrp.Copy();
    }
};
ParaRun.prototype.IsShade = function () {
    var oShd = this.Get_CompiledPr(false).Shd;
    return ! (oShd === undefined || shd_Nil === oShd.Value);
};
ParaRun.prototype.Get_RangesByPos = function (Pos) {
    var Ranges = [];
    var LinesCount = this.protected_GetLinesCount();
    for (var LineIndex = 0; LineIndex < LinesCount; LineIndex++) {
        var RangesCount = this.protected_GetRangesCount(LineIndex);
        for (var RangeIndex = 0; RangeIndex < RangesCount; RangeIndex++) {
            var StartPos = this.protected_GetRangeStartPos(LineIndex, RangeIndex);
            var EndPos = this.protected_GetRangeEndPos(LineIndex, RangeIndex);
            if (StartPos <= Pos && Pos <= EndPos) {
                Ranges.push({
                    Range: (LineIndex === 0 ? RangeIndex + this.StartRange : RangeIndex),
                    Line: LineIndex + this.StartLine
                });
            }
        }
    }
    return Ranges;
};
ParaRun.prototype.Get_Parent = function () {
    if (!this.Paragraph) {
        return null;
    }
    var ContentPos = this.Paragraph.Get_PosByElement(this);
    if (null == ContentPos || undefined == ContentPos || ContentPos.Get_Depth() < 0) {
        return null;
    }
    ContentPos.Decrease_Depth(1);
    return this.Paragraph.Get_ElementByPos(ContentPos);
};
ParaRun.prototype.private_GetPosInParent = function (_Parent) {
    var Parent = (_Parent ? _Parent : this.Get_Parent());
    if (!Parent) {
        return -1;
    }
    var RunPos = -1;
    for (var Pos = 0, Count = Parent.Content.length; Pos < Count; Pos++) {
        if (this === Parent.Content[Pos]) {
            RunPos = Pos;
            break;
        }
    }
    return RunPos;
};
ParaRun.prototype.Make_ThisElementCurrent = function () {
    if (this.Paragraph) {
        var ContentPos = this.Paragraph.Get_PosByElement(this);
        ContentPos.Add(this.State.ContentPos);
        this.Paragraph.Set_ParaContentPos(ContentPos, true, -1, -1);
        this.Paragraph.Document_SetThisElementCurrent(false);
    }
};
function CParaRunStartState(Run) {
    this.Paragraph = Run.Paragraph;
    this.Pr = Run.Pr.Copy();
    this.Content = [];
    for (var i = 0; i < Run.Content.length; ++i) {
        this.Content.push(Run.Content[i]);
    }
}