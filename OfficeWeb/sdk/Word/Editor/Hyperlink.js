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
function ParaHyperlink() {
    ParaRun.superclass.constructor.call(this);
    this.Id = g_oIdCounter.Get_NewId();
    this.Type = para_Hyperlink;
    this.Value = "";
    this.Visited = false;
    this.ToolTip = "";
    this.State = new CParaRunState();
    this.Selection = this.State.Selection;
    this.Content = [];
    this.m_oContentChanges = new CContentChanges();
    this.NearPosArray = [];
    this.SearchMarks = [];
    this.SpellingMarks = [];
    g_oTableId.Add(this, this.Id);
}
Asc.extendClass(ParaHyperlink, CParagraphContentWithContentBase);
ParaHyperlink.prototype.Get_Id = function () {
    return this.Id;
};
ParaHyperlink.prototype.Clear_ContentChanges = function () {
    this.m_oContentChanges.Clear();
};
ParaHyperlink.prototype.Add_ContentChanges = function (Changes) {
    this.m_oContentChanges.Add(Changes);
};
ParaHyperlink.prototype.Refresh_ContentChanges = function () {
    this.m_oContentChanges.Refresh();
};
ParaHyperlink.prototype.Copy = function (Selected) {
    var NewHyperlink = new ParaHyperlink();
    NewHyperlink.Set_Value(this.Value);
    NewHyperlink.Set_ToolTip(this.ToolTip);
    NewHyperlink.Visited = this.Visited;
    var StartPos = 0;
    var EndPos = this.Content.length - 1;
    if (true === Selected && true === this.State.Selection.Use) {
        StartPos = this.State.Selection.StartPos;
        EndPos = this.State.Selection.EndPos;
        if (StartPos > EndPos) {
            StartPos = this.State.Selection.EndPos;
            EndPos = this.State.Selection.StartPos;
        }
    }
    for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
        var Item = this.Content[CurPos];
        if (StartPos === CurPos || EndPos === CurPos) {
            NewHyperlink.Add_ToContent(CurPos - StartPos, Item.Copy(Selected));
        } else {
            NewHyperlink.Add_ToContent(CurPos - StartPos, Item.Copy(false));
        }
    }
    return NewHyperlink;
};
ParaHyperlink.prototype.Recalc_RunsCompiledPr = function () {
    var Count = this.Content.length;
    for (var Pos = 0; Pos < Count; Pos++) {
        var Element = this.Content[Pos];
        if (Element.Recalc_RunsCompiledPr) {
            Element.Recalc_RunsCompiledPr();
        }
    }
};
ParaHyperlink.prototype.Get_AllDrawingObjects = function (DrawingObjs) {
    var Count = this.Content.length;
    for (var Index = 0; Index < Count; Index++) {
        var Item = this.Content[Index];
        if (para_Run === Item.Type || para_Hyperlink === Item.Type) {
            Item.Get_AllDrawingObjects(DrawingObjs);
        }
    }
};
ParaHyperlink.prototype.Set_Paragraph = function (Paragraph) {
    this.Paragraph = Paragraph;
    var ContentLen = this.Content.length;
    for (var CurPos = 0; CurPos < ContentLen; CurPos++) {
        this.Content[CurPos].Set_Paragraph(Paragraph);
    }
};
ParaHyperlink.prototype.Is_Empty = function () {
    var ContentLen = this.Content.length;
    for (var Index = 0; Index < ContentLen; Index++) {
        if (false === this.Content[Index].Is_Empty()) {
            return false;
        }
    }
    return true;
};
ParaHyperlink.prototype.Is_CheckingNearestPos = function () {
    if (this.NearPosArray.length > 0) {
        return true;
    }
    return false;
};
ParaHyperlink.prototype.Is_StartFromNewLine = function () {
    if (this.Content.length < 0) {
        return false;
    }
    return this.Content[0].Is_StartFromNewLine();
};
ParaHyperlink.prototype.Get_SelectedElementsInfo = function (Info) {
    Info.Set_Hyperlink(this);
    var Selection = this.State.Selection;
    if (true === Selection.Use && Selection.StartPos === Selection.EndPos && this.Content[Selection.EndPos].Get_SelectedElementsInfo) {
        this.Content[Selection.EndPos].Get_SelectedElementsInfo(Info);
    } else {
        if (false === Selection.Use && this.Content[this.State.ContentPos].Get_SelectedElementsInfo) {
            this.Content[this.State.ContentPos].Get_SelectedElementsInfo(Info);
        }
    }
};
ParaHyperlink.prototype.Get_SelectedText = function (bAll, bClearText) {
    var Str = "";
    var Count = this.Content.length;
    for (var Pos = 0; Pos < Count; Pos++) {
        var _Str = this.Content[Pos].Get_SelectedText(bAll, bClearText);
        if (null === _Str) {
            return null;
        }
        Str += _Str;
    }
    return Str;
};
ParaHyperlink.prototype.Get_SelectionDirection = function () {
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
};
ParaHyperlink.prototype.Get_TextPr = function (_ContentPos, Depth) {
    if (undefined === _ContentPos) {
        return this.Content[0].Get_TextPr();
    } else {
        return this.Content[_ContentPos.Get(Depth)].Get_TextPr(_ContentPos, Depth + 1);
    }
};
ParaHyperlink.prototype.Get_CompiledTextPr = function (Copy) {
    var TextPr = null;
    if (true === this.State.Selection) {
        var StartPos = this.State.Selection.StartPos;
        var EndPos = this.State.Selection.EndPos;
        if (StartPos > EndPos) {
            StartPos = this.State.Selection.EndPos;
            EndPos = this.State.Selection.StartPos;
        }
        TextPr = this.Content[StartPos].Get_CompiledTextPr(Copy);
        while (null === TextPr && StartPos < EndPos) {
            StartPos++;
            TextPr = this.Content[StartPos].Get_CompiledTextPr(Copy);
        }
        for (var CurPos = StartPos + 1; CurPos <= EndPos; CurPos++) {
            var CurTextPr = this.Content[CurPos].Get_CompiledPr(false);
            if (null !== CurTextPr) {
                TextPr = TextPr.Compare(CurTextPr);
            }
        }
    } else {
        var CurPos = this.State.ContentPos;
        if (CurPos >= 0 && CurPos < this.Content.length) {
            TextPr = this.Content[CurPos].Get_CompiledTextPr(Copy);
        }
    }
    return TextPr;
};
ParaHyperlink.prototype.Check_Content = function () {
    if (this.Content.length <= 0) {
        this.Add_ToContent(0, new ParaRun(), false);
    }
};
ParaHyperlink.prototype.Add_ToContent = function (Pos, Item, UpdatePosition) {
    if (para_Hyperlink === Item.Type) {
        for (var ItemPos = 0, Count = Item.Content.length; ItemPos < Count; ItemPos++) {
            this.Add_ToContent(Pos + ItemPos, Item.Content[ItemPos], UpdatePosition);
        }
        return;
    }
    History.Add(this, {
        Type: historyitem_Hyperlink_AddItem,
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
            if (Pos === this.Content.length - 1 && LinesCount - 1 === CurLine) {
                this.protected_FillRangeEndPos(CurLine, RangesCount - 1, this.protected_GetRangeEndPos(CurLine, RangesCount - 1) + 1);
            }
        }
    }
    var NearPosLen = this.NearPosArray.length;
    for (var Index = 0; Index < NearPosLen; Index++) {
        var HyperNearPos = this.NearPosArray[Index];
        var ContentPos = HyperNearPos.NearPos.ContentPos;
        var Depth = HyperNearPos.Depth;
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
};
ParaHyperlink.prototype.Remove_FromContent = function (Pos, Count, UpdatePosition) {
    var DeletedItems = this.Content.slice(Pos, Pos + Count);
    History.Add(this, {
        Type: historyitem_Hyperlink_RemoveItem,
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
                    if (this.State.Selection.EndPos >= Pos) {
                        this.State.Selection.EndPos = Math.max(0, Pos - 1);
                    }
                }
            } else {
                if (this.State.Selection.StartPos >= Pos + Count) {
                    this.State.Selection.StartPos -= Count;
                } else {
                    if (this.State.Selection.StartPos >= Pos) {
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
        var HyperNearPos = this.NearPosArray[Index];
        var ContentPos = HyperNearPos.NearPos.ContentPos;
        var Depth = HyperNearPos.Depth;
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
};
ParaHyperlink.prototype.Add = function (Item) {
    switch (Item.Type) {
    case para_Run:
        var CurItem = this.Content[this.State.ContentPos];
        switch (CurItem.Type) {
        case para_Run:
            var NewRun = CurItem.Split2(CurItem.State.ContentPos);
            this.Internal_Content_Add(CurPos + 1, Item);
            this.Internal_Content_Add(CurPos + 2, NewRun);
            this.State.ContentPos = CurPos + 1;
            break;
        default:
            this.Content[this.State.ContentPos].Add(Item);
            break;
        }
        break;
    case para_Math:
        var ContentPos = new CParagraphContentPos();
        this.Get_ParaContentPos(false, false, ContentPos);
        var CurPos = ContentPos.Get(0);
        if (para_Math !== this.Content[CurPos].Type) {
            var NewElement = this.Content[CurPos].Split(ContentPos, 1);
            if (null !== NewElement) {
                this.Add_ToContent(CurPos + 1, NewElement, true);
            }
            var Elem = new ParaMath();
            Elem.Root.Load_FromMenu(Item.Menu, this);
            Elem.Root.Correct_Content(true);
            this.Add_ToContent(CurPos + 1, Elem, true);
            this.State.ContentPos = CurPos + 1;
            this.Content[this.State.ContentPos].Cursor_MoveToEndPos(false);
        } else {
            this.Content[CurPos].Add(Item);
        }
        break;
    default:
        this.Content[this.State.ContentPos].Add(Item);
        break;
    }
};
ParaHyperlink.prototype.Remove = function (Direction, bOnAddText) {
    var Selection = this.State.Selection;
    if (true === Selection.Use) {
        var StartPos = Selection.StartPos;
        var EndPos = Selection.EndPos;
        if (StartPos > EndPos) {
            StartPos = Selection.EndPos;
            EndPos = Selection.StartPos;
        }
        if (StartPos === EndPos) {
            this.Content[StartPos].Remove(Direction, bOnAddText);
            if (StartPos !== this.Content.length - 1 && true === this.Content[StartPos].Is_Empty()) {
                this.Remove_FromContent(StartPos, 1, true);
            }
        } else {
            this.Content[EndPos].Remove(Direction, bOnAddText);
            if (EndPos !== this.Content.length - 1 && true === this.Content[EndPos].Is_Empty()) {
                this.Remove_FromContent(EndPos, 1, true);
            }
            for (var CurPos = EndPos - 1; CurPos > StartPos; CurPos--) {
                this.Remove_FromContent(CurPos, 1, true);
            }
            this.Content[StartPos].Remove(Direction, bOnAddText);
            if (true === this.Content[StartPos].Is_Empty()) {
                this.Remove_FromContent(StartPos, 1, true);
            }
        }
        this.Selection_Remove();
        this.State.ContentPos = StartPos;
    } else {
        var ContentPos = this.State.ContentPos;
        if (true === this.Cursor_Is_Start() || true === this.Cursor_Is_End()) {
            this.Select_All();
        } else {
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
                return false;
            } else {
                if (ContentPos !== this.Content.length - 1 && true === this.Content[ContentPos].Is_Empty()) {
                    this.Remove_FromContent(ContentPos, 1, true);
                }
                this.State.ContentPos = ContentPos;
            }
        }
    }
    return true;
};
ParaHyperlink.prototype.Get_CurrentParaPos = function () {
    var CurPos = this.State.ContentPos;
    if (CurPos >= 0 && CurPos < this.Content.length) {
        return this.Content[CurPos].Get_CurrentParaPos();
    }
    return new CParaPos(this.StartRange, this.StartLine, 0, 0);
};
ParaHyperlink.prototype.Apply_TextPr = function (TextPr, IncFontSize, ApplyToAll) {
    if (true === ApplyToAll) {
        var ContentLen = this.Content.length;
        for (var CurPos = 0; CurPos < ContentLen; CurPos++) {
            this.Content[CurPos].Apply_TextPr(TextPr, IncFontSize, true);
        }
    } else {
        var Selection = this.State.Selection;
        if (true === Selection.Use) {
            var StartPos = Selection.StartPos;
            var EndPos = Selection.EndPos;
            if (StartPos === EndPos) {
                var NewElements = this.Content[EndPos].Apply_TextPr(TextPr, IncFontSize, false);
                if (para_Run === this.Content[EndPos].Type) {
                    var CenterRunPos = this.Internal_ReplaceRun(EndPos, NewElements);
                    if (StartPos === this.State.ContentPos) {
                        this.State.ContentPos = CenterRunPos;
                    }
                    Selection.StartPos = CenterRunPos;
                    Selection.EndPos = CenterRunPos;
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
                var NewElements = this.Content[EndPos].Apply_TextPr(TextPr, IncFontSize, false);
                if (para_Run === this.Content[EndPos].Type) {
                    this.Internal_ReplaceRun(EndPos, NewElements);
                }
                var NewElements = this.Content[StartPos].Apply_TextPr(TextPr, IncFontSize, false);
                if (para_Run === this.Content[StartPos].Type) {
                    this.Internal_ReplaceRun(StartPos, NewElements);
                }
                if (Selection.StartPos < Selection.EndPos && true === this.Content[Selection.StartPos].Selection_IsEmpty()) {
                    Selection.StartPos++;
                } else {
                    if (Selection.EndPos < Selection.StartPos && true === this.Content[Selection.EndPos].Selection_IsEmpty()) {
                        Selection.EndPos++;
                    }
                }
                if (Selection.StartPos < Selection.EndPos && true === this.Content[Selection.EndPos].Selection_IsEmpty()) {
                    Selection.EndPos--;
                } else {
                    if (Selection.EndPos < Selection.StartPos && true === this.Content[Selection.StartPos].Selection_IsEmpty()) {
                        Selection.StartPos--;
                    }
                }
            }
        } else {
            var Pos = this.State.ContentPos;
            var Element = this.Content[Pos];
            var NewElements = Element.Apply_TextPr(TextPr, IncFontSize, false);
            if (para_Run === Element.Type) {
                var CenterRunPos = this.Internal_ReplaceRun(Pos, NewElements);
                this.State.ContentPos = CenterRunPos;
            }
        }
    }
};
ParaHyperlink.prototype.Internal_ReplaceRun = function (Pos, NewRuns) {
    var LRun = NewRuns[0];
    var CRun = NewRuns[1];
    var RRun = NewRuns[2];
    var CenterRunPos = Pos;
    if (null !== LRun) {
        this.Add_ToContent(Pos + 1, CRun, true);
        CenterRunPos = Pos + 1;
    } else {}
    if (null !== RRun) {
        this.Add_ToContent(CenterRunPos + 1, RRun, true);
    }
    return CenterRunPos;
};
ParaHyperlink.prototype.Clear_TextPr = function () {
    var HyperlinkStyle = null;
    if (undefined !== this.Paragraph && null !== this.Paragraph) {
        var Styles = this.Paragraph.Parent.Get_Styles();
        HyperlinkStyle = Styles.Get_Default_Hyperlink();
    }
    var Count = this.Content.length;
    for (var Index = 0; Index < Count; Index++) {
        var Item = this.Content[Index];
        Item.Clear_TextPr();
        if (para_Run === Item.Type && null !== HyperlinkStyle) {
            Item.Set_RStyle(HyperlinkStyle);
        }
    }
};
ParaHyperlink.prototype.Check_NearestPos = function (ParaNearPos, Depth) {
    var HyperNearPos = new CParagraphElementNearPos();
    HyperNearPos.NearPos = ParaNearPos.NearPos;
    HyperNearPos.Depth = Depth;
    this.NearPosArray.push(HyperNearPos);
    ParaNearPos.Classes.push(this);
    var CurPos = ParaNearPos.NearPos.ContentPos.Get(Depth);
    this.Content[CurPos].Check_NearestPos(ParaNearPos, Depth + 1);
};
ParaHyperlink.prototype.Get_DrawingObjectRun = function (Id) {
    var Run = null;
    var ContentLen = this.Content.length;
    for (var CurPos = 0; CurPos < ContentLen; CurPos++) {
        var Element = this.Content[CurPos];
        Run = Element.Get_DrawingObjectRun(Id);
        if (null !== Run) {
            return Run;
        }
    }
    return Run;
};
ParaHyperlink.prototype.Get_DrawingObjectContentPos = function (Id, ContentPos, Depth) {
    var ContentLen = this.Content.length;
    for (var Index = 0; Index < ContentLen; Index++) {
        var Element = this.Content[Index];
        if (true === Element.Get_DrawingObjectContentPos(Id, ContentPos, Depth + 1)) {
            ContentPos.Update2(Index, Depth);
            return true;
        }
    }
    return false;
};
ParaHyperlink.prototype.Get_Layout = function (DrawingLayout, UseContentPos, ContentPos, Depth) {
    var CurLine = DrawingLayout.Line - this.StartLine;
    var CurRange = (0 === CurLine ? DrawingLayout.Range - this.StartRange : DrawingLayout.Range);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    var CurContentPos = (true === UseContentPos ? ContentPos.Get(Depth) : -1);
    for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
        this.Content[CurPos].Get_Layout(DrawingLayout, (CurPos === CurContentPos ? true : false), ContentPos, Depth + 1);
        if (true === DrawingLayout.Layout) {
            return;
        }
    }
};
ParaHyperlink.prototype.Get_NextRunElements = function (RunElements, UseContentPos, Depth) {
    var CurPos = (true === UseContentPos ? RunElements.ContentPos.Get(Depth) : 0);
    var ContentLen = this.Content.length;
    this.Content[CurPos].Get_NextRunElements(RunElements, UseContentPos, Depth + 1);
    if (RunElements.Count <= 0) {
        return;
    }
    CurPos++;
    while (CurPos < ContentLen) {
        this.Content[CurPos].Get_NextRunElements(RunElements, false, Depth + 1);
        if (RunElements.Count <= 0) {
            break;
        }
        CurPos++;
    }
};
ParaHyperlink.prototype.Get_PrevRunElements = function (RunElements, UseContentPos, Depth) {
    var CurPos = (true === UseContentPos ? RunElements.ContentPos.Get(Depth) : this.Content.length - 1);
    this.Content[CurPos].Get_PrevRunElements(RunElements, UseContentPos, Depth + 1);
    if (RunElements.Count <= 0) {
        return;
    }
    CurPos--;
    while (CurPos >= 0) {
        this.Content[CurPos].Get_PrevRunElements(RunElements, false, Depth + 1);
        if (RunElements.Count <= 0) {
            break;
        }
        CurPos--;
    }
};
ParaHyperlink.prototype.Collect_DocumentStatistics = function (ParaStats) {
    var Count = this.Content.length;
    for (var Index = 0; Index < Count; Index++) {
        this.Content[Index].Collect_DocumentStatistics(ParaStats);
    }
};
ParaHyperlink.prototype.Create_FontMap = function (Map) {
    var Count = this.Content.length;
    for (var Index = 0; Index < Count; Index++) {
        this.Content[Index].Create_FontMap(Map);
    }
};
ParaHyperlink.prototype.Get_AllFontNames = function (AllFonts) {
    var Count = this.Content.length;
    for (var Index = 0; Index < Count; Index++) {
        this.Content[Index].Get_AllFontNames(AllFonts);
    }
};
ParaHyperlink.prototype.Clear_TextFormatting = function (DefHyper) {
    var Count = this.Content.length;
    for (var Pos = 0; Pos < Count; Pos++) {
        var Item = this.Content[Pos];
        Item.Clear_TextFormatting(DefHyper);
        if (para_Run === Item.Type) {
            Item.Set_RStyle(DefHyper);
        }
    }
};
ParaHyperlink.prototype.Can_AddDropCap = function () {
    var Count = this.Content.length;
    for (var Pos = 0; Pos < Count; Pos++) {
        var TempRes = this.Content[Pos].Can_AddDropCap();
        if (null !== TempRes) {
            return TempRes;
        }
    }
    return null;
};
ParaHyperlink.prototype.Get_TextForDropCap = function (DropCapText, UseContentPos, ContentPos, Depth) {
    var EndPos = (true === UseContentPos ? ContentPos.Get(Depth) : this.Content.length - 1);
    for (var Pos = 0; Pos <= EndPos; Pos++) {
        this.Content[Pos].Get_TextForDropCap(DropCapText, (true === UseContentPos && Pos === EndPos ? true : false), ContentPos, Depth + 1);
        if (true === DropCapText.Mixed && (true === DropCapText.Check || DropCapText.Runs.length > 0)) {
            return;
        }
    }
};
ParaHyperlink.prototype.Get_StartTabsCount = function (TabsCounter) {
    var ContentLen = this.Content.length;
    for (var Pos = 0; Pos < ContentLen; Pos++) {
        var Element = this.Content[Pos];
        if (false === Element.Get_StartTabsCount(TabsCounter)) {
            return false;
        }
    }
    return true;
};
ParaHyperlink.prototype.Remove_StartTabs = function (TabsCounter) {
    var ContentLen = this.Content.length;
    for (var Pos = 0; Pos < ContentLen; Pos++) {
        var Element = this.Content[Pos];
        if (false === Element.Remove_StartTabs(TabsCounter)) {
            return false;
        }
    }
    return true;
};
ParaHyperlink.prototype.Split = function (ContentPos, Depth) {
    var NewHyperlink = new ParaHyperlink();
    NewHyperlink.Set_Value(this.Value);
    NewHyperlink.Set_ToolTip(this.ToolTip);
    var CurPos = ContentPos.Get(Depth);
    var TextPr = this.Get_TextPr(ContentPos, Depth);
    var NewElement = this.Content[CurPos].Split(ContentPos, Depth + 1);
    if (null === NewElement) {
        NewElement = new ParaRun();
        NewElement.Set_Pr(TextPr.Copy());
    }
    var NewContent = this.Content.slice(CurPos + 1);
    this.Remove_FromContent(CurPos + 1, this.Content.length - CurPos - 1, false);
    var Count = NewContent.length;
    for (var Pos = 0; Pos < Count; Pos++) {
        NewHyperlink.Add_ToContent(Pos, NewContent[Pos], false);
    }
    NewHyperlink.Add_ToContent(0, NewElement, false);
    return NewHyperlink;
};
ParaHyperlink.prototype.Split2 = function (CurPos) {
    var NewRun = new ParaRun(this.Paragraph);
    NewRun.Set_Pr(this.Pr.Copy());
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
                MarkElement.ClassesS[Mark.Depth] = NewRun;
                MarkElement.StartPos.Data[Mark.Depth] -= CurPos;
            } else {
                MarkElement.ClassesE[Mark.Depth] = NewRun;
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
ParaHyperlink.prototype.Recalculate_Range = function (PRS, ParaPr, Depth) {
    if (this.Paragraph !== PRS.Paragraph) {
        this.Paragraph = PRS.Paragraph;
        this.protected_UpdateSpellChecking();
    }
    var CurLine = PRS.Line - this.StartLine;
    var CurRange = (0 === CurLine ? PRS.Range - this.StartRange : PRS.Range);
    var RangeStartPos = this.protected_AddRange(CurLine, CurRange);
    var RangeEndPos = 0;
    var ContentLen = this.Content.length;
    var Pos = RangeStartPos;
    for (; Pos < ContentLen; Pos++) {
        var Item = this.Content[Pos];
        if (para_Math === Item.Type) {
            Item.Set_Inline(true);
        }
        if ((0 === Pos && 0 === CurLine && 0 === CurRange) || Pos !== RangeStartPos) {
            Item.Recalculate_Reset(PRS.Range, PRS.Line);
        }
        PRS.Update_CurPos(Pos, Depth);
        Item.Recalculate_Range(PRS, ParaPr, Depth + 1);
        if (true === PRS.NewRange) {
            RangeEndPos = Pos;
            break;
        }
    }
    if (Pos >= ContentLen) {
        RangeEndPos = Pos - 1;
    }
    this.protected_FillRange(CurLine, CurRange, RangeStartPos, RangeEndPos);
};
ParaHyperlink.prototype.Recalculate_Set_RangeEndPos = function (PRS, PRP, Depth) {
    var CurLine = PRS.Line - this.StartLine;
    var CurRange = (0 === CurLine ? PRS.Range - this.StartRange : PRS.Range);
    var CurPos = PRP.Get(Depth);
    this.protected_FillRangeEndPos(CurLine, CurRange, CurPos);
    this.Content[CurPos].Recalculate_Set_RangeEndPos(PRS, PRP, Depth + 1);
};
ParaHyperlink.prototype.Recalculate_Range_Width = function (PRSC, _CurLine, _CurRange) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
        this.Content[CurPos].Recalculate_Range_Width(PRSC, _CurLine, _CurRange);
    }
};
ParaHyperlink.prototype.Recalculate_Range_Spaces = function (PRSA, _CurLine, _CurRange, _CurPage) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
        this.Content[CurPos].Recalculate_Range_Spaces(PRSA, _CurLine, _CurRange, _CurPage);
    }
};
ParaHyperlink.prototype.Recalculate_PageEndInfo = function (PRSI, _CurLine, _CurRange) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
        this.Content[CurPos].Recalculate_PageEndInfo(PRSI, _CurLine, _CurRange);
    }
};
ParaHyperlink.prototype.Save_RecalculateObject = function (Copy) {
    var RecalcObj = new CRunRecalculateObject(this.StartLine, this.StartRange);
    RecalcObj.Save_Lines(this, Copy);
    RecalcObj.Save_Content(this, Copy);
    return RecalcObj;
};
ParaHyperlink.prototype.Load_RecalculateObject = function (RecalcObj) {
    RecalcObj.Load_Lines(this);
    RecalcObj.Load_Content(this);
};
ParaHyperlink.prototype.Prepare_RecalculateObject = function () {
    this.protected_ClearLines();
    var Count = this.Content.length;
    for (var Index = 0; Index < Count; Index++) {
        this.Content[Index].Prepare_RecalculateObject();
    }
};
ParaHyperlink.prototype.Is_EmptyRange = function (_CurLine, _CurRange) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
        if (false === this.Content[CurPos].Is_EmptyRange(_CurLine, _CurRange)) {
            return false;
        }
    }
    return true;
};
ParaHyperlink.prototype.Check_Range_OnlyMath = function (Checker, _CurRange, _CurLine) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
        this.Content[CurPos].Check_Range_OnlyMath(Checker, _CurRange, _CurLine);
        if (false === Checker.Result) {
            break;
        }
    }
};
ParaHyperlink.prototype.Check_MathPara = function (Checker) {
    Checker.Result = false;
    Checker.Found = true;
};
ParaHyperlink.prototype.Check_PageBreak = function () {
    var Count = this.Content.length;
    for (var Pos = 0; Pos < Count; Pos++) {
        if (true === this.Content[Pos].Check_PageBreak()) {
            return true;
        }
    }
    return false;
};
ParaHyperlink.prototype.Check_BreakPageEnd = function (PBChecker) {
    var ContentLen = this.Content.length;
    for (var CurPos = 0; CurPos < ContentLen; CurPos++) {
        var Element = this.Content[CurPos];
        if (true !== Element.Check_BreakPageEnd(PBChecker)) {
            return false;
        }
    }
    return true;
};
ParaHyperlink.prototype.Get_ParaPosByContentPos = function (ContentPos, Depth) {
    var Pos = ContentPos.Get(Depth);
    return this.Content[Pos].Get_ParaPosByContentPos(ContentPos, Depth + 1);
};
ParaHyperlink.prototype.Recalculate_CurPos = function (_X, Y, CurrentRun, _CurRange, _CurLine, _CurPage, UpdateCurPos, UpdateTarget, ReturnTarget) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var X = _X;
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
        var Item = this.Content[CurPos];
        var Res = Item.Recalculate_CurPos(X, Y, (true === CurrentRun && CurPos === this.State.ContentPos ? true : false), _CurRange, _CurLine, _CurPage, UpdateCurPos, UpdateTarget, ReturnTarget);
        if (true === CurrentRun && CurPos === this.State.ContentPos) {
            return Res;
        } else {
            X = Res.X;
        }
    }
    return {
        X: X
    };
};
ParaHyperlink.prototype.Refresh_RecalcData = function (Data) {
    if (undefined !== this.Paragraph && null !== this.Paragraph) {
        this.Paragraph.Refresh_RecalcData2(0);
    }
};
ParaHyperlink.prototype.Recalculate_MinMaxContentWidth = function (MinMax) {
    var Count = this.Content.length;
    for (var Pos = 0; Pos < Count; Pos++) {
        this.Content[Pos].Recalculate_MinMaxContentWidth(MinMax);
    }
};
ParaHyperlink.prototype.Get_Range_VisibleWidth = function (RangeW, _CurLine, _CurRange) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
        this.Content[CurPos].Get_Range_VisibleWidth(RangeW, _CurLine, _CurRange);
    }
};
ParaHyperlink.prototype.Shift_Range = function (Dx, Dy, _CurLine, _CurRange) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
        this.Content[CurPos].Shift_Range(Dx, Dy, _CurLine, _CurRange);
    }
};
ParaHyperlink.prototype.Draw_HighLights = function (PDSH) {
    var CurLine = PDSH.Line - this.StartLine;
    var CurRange = (0 === CurLine ? PDSH.Range - this.StartRange : PDSH.Range);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
        this.Content[CurPos].Draw_HighLights(PDSH);
    }
};
ParaHyperlink.prototype.Draw_Elements = function (PDSE) {
    PDSE.VisitedHyperlink = this.Visited;
    var CurLine = PDSE.Line - this.StartLine;
    var CurRange = (0 === CurLine ? PDSE.Range - this.StartRange : PDSE.Range);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
        this.Content[CurPos].Draw_Elements(PDSE);
    }
    PDSE.VisitedHyperlink = false;
};
ParaHyperlink.prototype.Draw_Lines = function (PDSL) {
    PDSL.VisitedHyperlink = this.Visited;
    var CurLine = PDSL.Line - this.StartLine;
    var CurRange = (0 === CurLine ? PDSL.Range - this.StartRange : PDSL.Range);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
        this.Content[CurPos].Draw_Lines(PDSL);
    }
    PDSL.VisitedHyperlink = false;
};
ParaHyperlink.prototype.Is_CursorPlaceable = function () {
    return true;
};
ParaHyperlink.prototype.Cursor_Is_Start = function () {
    var ContentLen = this.Content.length;
    var CurPos = 0;
    while (CurPos < this.State.ContentPos && CurPos < this.Content.length - 1) {
        if (true === this.Content[CurPos].Is_Empty()) {
            CurPos++;
        } else {
            return false;
        }
    }
    return this.Content[CurPos].Cursor_Is_Start();
};
ParaHyperlink.prototype.Cursor_Is_NeededCorrectPos = function () {
    return false;
};
ParaHyperlink.prototype.Cursor_Is_End = function () {
    var CurPos = this.Content.length - 1;
    while (CurPos > this.State.ContentPos && CurPos > 0) {
        if (true === this.Content[CurPos].Is_Empty()) {
            CurPos--;
        } else {
            return false;
        }
    }
    return this.Content[CurPos].Cursor_Is_End();
};
ParaHyperlink.prototype.Cursor_MoveToStartPos = function () {
    this.State.ContentPos = 0;
    if (this.Content.length > 0) {
        this.Content[0].Cursor_MoveToStartPos();
    }
};
ParaHyperlink.prototype.Cursor_MoveToEndPos = function (SelectFromEnd) {
    var ContentLen = this.Content.length;
    if (ContentLen > 0) {
        this.State.ContentPos = ContentLen - 1;
        this.Content[ContentLen - 1].Cursor_MoveToEndPos(SelectFromEnd);
    }
};
ParaHyperlink.prototype.Get_ParaContentPosByXY = function (SearchPos, Depth, _CurLine, _CurRange, StepEnd) {
    var Result = false;
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
        var Item = this.Content[CurPos];
        if (false === SearchPos.InText) {
            SearchPos.InTextPos.Update2(CurPos, Depth);
        }
        if (true === Item.Get_ParaContentPosByXY(SearchPos, Depth + 1, _CurLine, _CurRange, StepEnd)) {
            SearchPos.Pos.Update2(CurPos, Depth);
            Result = true;
        }
    }
    return Result;
};
ParaHyperlink.prototype.Get_ParaContentPos = function (bSelection, bStart, ContentPos) {
    var Pos = (true === bSelection ? (true === bStart ? this.State.Selection.StartPos : this.State.Selection.EndPos) : this.State.ContentPos);
    ContentPos.Add(Pos);
    this.Content[Pos].Get_ParaContentPos(bSelection, bStart, ContentPos);
};
ParaHyperlink.prototype.Set_ParaContentPos = function (ContentPos, Depth) {
    var Pos = ContentPos.Get(Depth);
    if (Pos >= this.Content.length) {
        Pos = this.Content.length - 1;
    }
    if (Pos < 0) {
        Pos = 0;
    }
    this.State.ContentPos = Pos;
    this.Content[Pos].Set_ParaContentPos(ContentPos, Depth + 1);
};
ParaHyperlink.prototype.Get_PosByElement = function (Class, ContentPos, Depth, UseRange, Range, Line) {
    if (this === Class) {
        return true;
    }
    var ContentPos = new CParagraphContentPos();
    var StartPos = 0;
    var EndPos = this.Content.length - 1;
    if (true === UseRange) {
        var CurLine = Line - this.StartLine;
        var CurRange = (0 === CurLine ? Range - this.StartRange : Range);
        if (CurLine >= 0 && CurLine < this.protected_GetLinesCount() && CurRange >= 0 && CurRange < this.protected_GetRangesCount(CurLine)) {
            StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
            EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
        }
    }
    for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
        var Element = this.Content[CurPos];
        ContentPos.Update(CurPos, Depth);
        if (true === Element.Get_PosByElement(Class, ContentPos, Depth + 1, true, CurRange, CurLine)) {
            return true;
        }
    }
    return false;
};
ParaHyperlink.prototype.Get_ElementByPos = function (ContentPos, Depth) {
    if (Depth + 1 >= ContentPos.Depth) {
        return this;
    }
    var CurPos = ContentPos.Get(Depth);
    return this.Content[CurPos].Get_ElementByPos(ContentPos, Depth + 1);
};
ParaHyperlink.prototype.Get_PosByDrawing = function (Id, ContentPos, Depth) {
    var Count = this.Content.length;
    for (var CurPos = 0; CurPos < Count; CurPos++) {
        var Element = this.Content[CurPos];
        ContentPos.Update(CurPos, Depth);
        if (true === Element.Get_PosByDrawing(Id, ContentPos, Depth + 1)) {
            return true;
        }
    }
    return false;
};
ParaHyperlink.prototype.Get_RunElementByPos = function (ContentPos, Depth) {
    if (undefined !== ContentPos) {
        var Pos = ContentPos.Get(Depth);
        return this.Content[Pos].Get_RunElementByPos(ContentPos, Depth + 1);
    } else {
        var Count = this.Content.length;
        if (Count <= 0) {
            return null;
        }
        var Pos = 0;
        var Element = this.Content[Pos];
        while (null === Element && Pos < Count - 1) {
            Element = this.Content[++Pos];
        }
        return Element;
    }
};
ParaHyperlink.prototype.Get_LastRunInRange = function (_CurLine, _CurRange) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    if (CurLine < this.protected_GetLinesCount() && CurRange < this.protected_GetRangesCount(CurLine)) {
        var LastItem = this.Content[this.protected_GetRangeEndPos(CurLine, CurRange)];
        if (undefined !== LastItem) {
            return LastItem.Get_LastRunInRange(_CurLine, _CurRange);
        }
    }
    return null;
};
ParaHyperlink.prototype.Get_LeftPos = function (SearchPos, ContentPos, Depth, UseContentPos) {
    var CurPos = (true === UseContentPos ? ContentPos.Get(Depth) : this.Content.length - 1);
    this.Content[CurPos].Get_LeftPos(SearchPos, ContentPos, Depth + 1, UseContentPos);
    SearchPos.Pos.Update(CurPos, Depth);
    if (true === SearchPos.Found) {
        return true;
    }
    CurPos--;
    while (CurPos >= 0) {
        this.Content[CurPos].Get_LeftPos(SearchPos, ContentPos, Depth + 1, false);
        SearchPos.Pos.Update(CurPos, Depth);
        if (true === SearchPos.Found) {
            return true;
        }
        CurPos--;
    }
    return false;
};
ParaHyperlink.prototype.Get_RightPos = function (SearchPos, ContentPos, Depth, UseContentPos, StepEnd) {
    var CurPos = (true === UseContentPos ? ContentPos.Get(Depth) : 0);
    this.Content[CurPos].Get_RightPos(SearchPos, ContentPos, Depth + 1, UseContentPos, StepEnd);
    SearchPos.Pos.Update(CurPos, Depth);
    if (true === SearchPos.Found) {
        return true;
    }
    CurPos++;
    var Count = this.Content.length;
    while (CurPos < this.Content.length) {
        this.Content[CurPos].Get_RightPos(SearchPos, ContentPos, Depth + 1, false, StepEnd);
        SearchPos.Pos.Update(CurPos, Depth);
        if (true === SearchPos.Found) {
            return true;
        }
        CurPos++;
    }
    return false;
};
ParaHyperlink.prototype.Get_WordStartPos = function (SearchPos, ContentPos, Depth, UseContentPos) {
    var CurPos = (true === UseContentPos ? ContentPos.Get(Depth) : this.Content.length - 1);
    this.Content[CurPos].Get_WordStartPos(SearchPos, ContentPos, Depth + 1, UseContentPos);
    if (true === SearchPos.UpdatePos) {
        SearchPos.Pos.Update(CurPos, Depth);
    }
    if (true === SearchPos.Found) {
        return;
    }
    CurPos--;
    var Count = this.Content.length;
    while (CurPos >= 0) {
        var OldUpdatePos = SearchPos.UpdatePos;
        this.Content[CurPos].Get_WordStartPos(SearchPos, ContentPos, Depth + 1, false);
        if (true === SearchPos.UpdatePos) {
            SearchPos.Pos.Update(CurPos, Depth);
        } else {
            SearchPos.UpdatePos = OldUpdatePos;
        }
        if (true === SearchPos.Found) {
            return;
        }
        CurPos--;
    }
};
ParaHyperlink.prototype.Get_WordEndPos = function (SearchPos, ContentPos, Depth, UseContentPos, StepEnd) {
    var CurPos = (true === UseContentPos ? ContentPos.Get(Depth) : 0);
    this.Content[CurPos].Get_WordEndPos(SearchPos, ContentPos, Depth + 1, UseContentPos, StepEnd);
    if (true === SearchPos.UpdatePos) {
        SearchPos.Pos.Update(CurPos, Depth);
    }
    if (true === SearchPos.Found) {
        return;
    }
    CurPos++;
    var Count = this.Content.length;
    while (CurPos < Count) {
        var OldUpdatePos = SearchPos.UpdatePos;
        this.Content[CurPos].Get_WordEndPos(SearchPos, ContentPos, Depth + 1, false, StepEnd);
        if (true === SearchPos.UpdatePos) {
            SearchPos.Pos.Update(CurPos, Depth);
        } else {
            SearchPos.UpdatePos = OldUpdatePos;
        }
        if (true === SearchPos.Found) {
            return;
        }
        CurPos++;
    }
};
ParaHyperlink.prototype.Get_EndRangePos = function (_CurLine, _CurRange, SearchPos, Depth) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    if (EndPos >= this.Content.length || EndPos < 0) {
        return false;
    }
    var Result = this.Content[EndPos].Get_EndRangePos(_CurLine, _CurRange, SearchPos, Depth + 1);
    if (true === Result) {
        SearchPos.Pos.Update(EndPos, Depth);
    }
    return Result;
};
ParaHyperlink.prototype.Get_StartRangePos = function (_CurLine, _CurRange, SearchPos, Depth) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    if (StartPos >= this.Content.length || StartPos < 0) {
        return false;
    }
    var Result = this.Content[StartPos].Get_StartRangePos(_CurLine, _CurRange, SearchPos, Depth + 1);
    if (true === Result) {
        SearchPos.Pos.Update(StartPos, Depth);
    }
    return Result;
};
ParaHyperlink.prototype.Get_StartRangePos2 = function (_CurLine, _CurRange, ContentPos, Depth) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var Pos = this.protected_GetRangeStartPos(CurLine, CurRange);
    ContentPos.Update(Pos, Depth);
    this.Content[Pos].Get_StartRangePos2(_CurLine, _CurRange, ContentPos, Depth + 1);
};
ParaHyperlink.prototype.Get_StartPos = function (ContentPos, Depth) {
    if (this.Content.length > 0) {
        ContentPos.Update(0, Depth);
        this.Content[0].Get_StartPos(ContentPos, Depth + 1);
    }
};
ParaHyperlink.prototype.Get_EndPos = function (BehindEnd, ContentPos, Depth) {
    var ContentLen = this.Content.length;
    if (ContentLen > 0) {
        ContentPos.Update(ContentLen - 1, Depth);
        this.Content[ContentLen - 1].Get_EndPos(BehindEnd, ContentPos, Depth + 1);
    }
};
ParaHyperlink.prototype.Set_SelectionContentPos = function (StartContentPos, EndContentPos, Depth, StartFlag, EndFlag) {
    var Selection = this.Selection;
    var OldStartPos = Selection.StartPos;
    var OldEndPos = Selection.EndPos;
    if (OldStartPos > OldEndPos) {
        OldStartPos = Selection.EndPos;
        OldEndPos = Selection.StartPos;
    }
    var StartPos = 0;
    switch (StartFlag) {
    case 1:
        StartPos = 0;
        break;
    case -1:
        StartPos = this.Content.length - 1;
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
        EndPos = this.Content.length - 1;
        break;
    case 0:
        EndPos = EndContentPos.Get(Depth);
        break;
    }
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
    Selection.Use = true;
    Selection.StartPos = StartPos;
    Selection.EndPos = EndPos;
    if (StartPos != EndPos) {
        this.Content[StartPos].Set_SelectionContentPos(StartContentPos, null, Depth + 1, StartFlag, StartPos > EndPos ? 1 : -1);
        this.Content[EndPos].Set_SelectionContentPos(null, EndContentPos, Depth + 1, StartPos > EndPos ? -1 : 1, EndFlag);
        var _StartPos = StartPos;
        var _EndPos = EndPos;
        var Direction = 1;
        if (_StartPos > _EndPos) {
            _StartPos = EndPos;
            _EndPos = StartPos;
            Direction = -1;
        }
        for (var CurPos = _StartPos + 1; CurPos < _EndPos; CurPos++) {
            this.Content[CurPos].Select_All(Direction);
        }
    } else {
        this.Content[StartPos].Set_SelectionContentPos(StartContentPos, EndContentPos, Depth + 1, StartFlag, EndFlag);
    }
};
ParaHyperlink.prototype.Selection_IsUse = function () {
    return this.State.Selection.Use;
};
ParaHyperlink.prototype.Selection_Stop = function () {};
ParaHyperlink.prototype.Selection_Remove = function () {
    var Selection = this.Selection;
    if (true === Selection.Use) {
        var StartPos = Selection.StartPos;
        var EndPos = Selection.EndPos;
        if (StartPos > EndPos) {
            StartPos = Selection.EndPos;
            EndPos = Selection.StartPos;
        }
        StartPos = Math.max(0, StartPos);
        EndPos = Math.min(this.Content.length - 1, EndPos);
        for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
            this.Content[CurPos].Selection_Remove();
        }
    }
    Selection.Use = false;
    Selection.StartPos = 0;
    Selection.EndPos = 0;
};
ParaHyperlink.prototype.Select_All = function (Direction) {
    var ContentLen = this.Content.length;
    var Selection = this.Selection;
    Selection.Use = true;
    if (-1 === Direction) {
        Selection.StartPos = ContentLen - 1;
        Selection.EndPos = 0;
    } else {
        Selection.StartPos = 0;
        Selection.EndPos = ContentLen - 1;
    }
    for (var CurPos = 0; CurPos < ContentLen; CurPos++) {
        this.Content[CurPos].Select_All(Direction);
    }
};
ParaHyperlink.prototype.Selection_DrawRange = function (_CurLine, _CurRange, SelectionDraw) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
        this.Content[CurPos].Selection_DrawRange(_CurLine, _CurRange, SelectionDraw);
    }
};
ParaHyperlink.prototype.Selection_IsEmpty = function (CheckEnd) {
    var StartPos = this.State.Selection.StartPos;
    var EndPos = this.State.Selection.EndPos;
    if (StartPos > EndPos) {
        StartPos = this.State.Selection.EndPos;
        EndPos = this.State.Selection.StartPos;
    }
    for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
        if (false === this.Content[CurPos].Selection_IsEmpty(CheckEnd)) {
            return false;
        }
    }
    return true;
};
ParaHyperlink.prototype.Selection_CheckParaEnd = function () {
    return false;
};
ParaHyperlink.prototype.Selection_CheckParaContentPos = function (ContentPos, Depth, bStart, bEnd) {
    var CurPos = ContentPos.Get(Depth);
    if (this.Selection.StartPos <= CurPos && CurPos <= this.Selection.EndPos) {
        return this.Content[CurPos].Selection_CheckParaContentPos(ContentPos, Depth + 1, bStart && this.Selection.StartPos === CurPos, bEnd && CurPos === this.Selection.EndPos);
    } else {
        if (this.Selection.EndPos <= CurPos && CurPos <= this.Selection.StartPos) {
            return this.Content[CurPos].Selection_CheckParaContentPos(ContentPos, Depth + 1, bStart && this.Selection.EndPos === CurPos, bEnd && CurPos === this.Selection.StartPos);
        }
    }
    return false;
};
ParaHyperlink.prototype.Is_SelectedAll = function (Props) {
    var Selection = this.State.Selection;
    if (false === Selection.Use && true !== this.Is_Empty(Props)) {
        return false;
    }
    var StartPos = Selection.StartPos;
    var EndPos = Selection.EndPos;
    if (EndPos < StartPos) {
        StartPos = Selection.EndPos;
        EndPos = Selection.StartPos;
    }
    for (var Pos = 0; Pos <= StartPos; Pos++) {
        if (false === this.Content[Pos].Is_SelectedAll(Props)) {
            return false;
        }
    }
    var Count = this.Content.length;
    for (var Pos = EndPos; Pos < Count; Pos++) {
        if (false === this.Content[Pos].Is_SelectedAll(Props)) {
            return false;
        }
    }
    return true;
};
ParaHyperlink.prototype.Selection_CorrectLeftPos = function (Direction) {
    if (false === this.Selection.Use || true === this.Is_Empty({
        SkipAnchor: true
    })) {
        return true;
    }
    var Selection = this.State.Selection;
    var StartPos = Math.min(Selection.StartPos, Selection.EndPos);
    var EndPos = Math.max(Selection.StartPos, Selection.EndPos);
    for (var Pos = 0; Pos < StartPos; Pos++) {
        if (true !== this.Content[Pos].Is_Empty({
            SkipAnchor: true
        })) {
            return false;
        }
    }
    for (var Pos = StartPos; Pos <= EndPos; Pos++) {
        if (true === this.Content[Pos].Selection_CorrectLeftPos(Direction)) {
            if (1 === Direction) {
                this.Selection.StartPos = Pos + 1;
            } else {
                this.Selection.EndPos = Pos + 1;
            }
            this.Content[Pos].Selection_Remove();
        } else {
            return false;
        }
    }
    return true;
};
ParaHyperlink.prototype.Get_Text = function (Text) {
    var ContentLen = this.Content.length;
    for (var CurPos = 0; CurPos < ContentLen; CurPos++) {
        this.Content[CurPos].Get_Text(Text);
    }
};
ParaHyperlink.prototype.Set_Visited = function (Value) {
    this.Visited = Value;
};
ParaHyperlink.prototype.Get_Visited = function () {
    return this.Visited;
};
ParaHyperlink.prototype.Set_ToolTip = function (ToolTip) {
    History.Add(this, {
        Type: historyitem_Hyperlink_ToolTip,
        New: ToolTip,
        Old: this.ToolTip
    });
    this.ToolTip = ToolTip;
};
ParaHyperlink.prototype.Get_ToolTip = function () {
    if (null === this.ToolTip) {
        if ("string" === typeof(this.Value)) {
            return this.Value;
        } else {
            return "";
        }
    } else {
        return this.ToolTip;
    }
};
ParaHyperlink.prototype.Get_Value = function () {
    return this.Value;
};
ParaHyperlink.prototype.Set_Value = function (Value) {
    History.Add(this, {
        Type: historyitem_Hyperlink_Value,
        New: Value,
        Old: this.Value
    });
    this.Value = Value;
};
ParaHyperlink.prototype.Undo = function (Data) {
    var Type = Data.Type;
    switch (Type) {
    case historyitem_Hyperlink_AddItem:
        this.Content.splice(Data.Pos, Data.EndPos - Data.Pos + 1);
        this.protected_UpdateSpellChecking();
        break;
    case historyitem_Hyperlink_RemoveItem:
        var Pos = Data.Pos;
        var Array_start = this.Content.slice(0, Pos);
        var Array_end = this.Content.slice(Pos);
        this.Content = Array_start.concat(Data.Items, Array_end);
        this.protected_UpdateSpellChecking();
        break;
    case historyitem_Hyperlink_Value:
        this.Value = Data.Old;
        break;
    case historyitem_Hyperlink_ToolTip:
        this.ToolTip = Data.Old;
        break;
    }
};
ParaHyperlink.prototype.Redo = function (Data) {
    var Type = Data.Type;
    switch (Type) {
    case historyitem_Hyperlink_AddItem:
        var Pos = Data.Pos;
        var Array_start = this.Content.slice(0, Pos);
        var Array_end = this.Content.slice(Pos);
        this.Content = Array_start.concat(Data.Items, Array_end);
        this.protected_UpdateSpellChecking();
        break;
    case historyitem_Hyperlink_RemoveItem:
        this.Content.splice(Data.Pos, Data.EndPos - Data.Pos + 1);
        this.protected_UpdateSpellChecking();
        break;
    case historyitem_Hyperlink_Value:
        this.Value = Data.New;
        break;
    case historyitem_Hyperlink_ToolTip:
        this.ToolTip = Data.New;
        break;
    }
};
ParaHyperlink.prototype.Save_Changes = function (Data, Writer) {
    Writer.WriteLong(historyitem_type_Hyperlink);
    var Type = Data.Type;
    Writer.WriteLong(Type);
    switch (Type) {
    case historyitem_Hyperlink_AddItem:
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
    case historyitem_Hyperlink_RemoveItem:
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
    case historyitem_Hyperlink_Value:
        Writer.WriteString2(Data.New);
        break;
    case historyitem_Hyperlink_ToolTip:
        Writer.WriteString2(Data.New);
        break;
    }
};
ParaHyperlink.prototype.Load_Changes = function (Reader) {
    var ClassType = Reader.GetLong();
    if (historyitem_type_Hyperlink != ClassType) {
        return;
    }
    var Type = Reader.GetLong();
    switch (Type) {
    case historyitem_Hyperlink_AddItem:
        var Count = Reader.GetLong();
        for (var Index = 0; Index < Count; Index++) {
            var Pos = this.m_oContentChanges.Check(contentchanges_Add, Reader.GetLong());
            var Element = g_oTableId.Get_ById(Reader.GetString2());
            if (null != Element) {
                this.Content.splice(Pos, 0, Element);
            }
        }
        this.protected_UpdateSpellChecking();
        break;
    case historyitem_Hyperlink_RemoveItem:
        var Count = Reader.GetLong();
        for (var Index = 0; Index < Count; Index++) {
            var ChangesPos = this.m_oContentChanges.Check(contentchanges_Remove, Reader.GetLong());
            if (false === ChangesPos) {
                continue;
            }
            this.Content.splice(ChangesPos, 1);
        }
        this.protected_UpdateSpellChecking();
        break;
    case historyitem_Hyperlink_Value:
        this.Value = Reader.GetString2();
        break;
    case historyitem_Hyperlink_ToolTip:
        this.ToolTip = Reader.GetString2();
        break;
    }
};
ParaHyperlink.prototype.Write_ToBinary2 = function (Writer) {
    Writer.WriteLong(historyitem_type_Hyperlink);
    Writer.WriteString2(this.Id);
    if (! (editor && editor.isDocumentEditor)) {
        this.Write_ToBinary2SpreadSheets(Writer);
        return;
    }
    Writer.WriteString2(this.Value);
    Writer.WriteString2(this.ToolTip);
    var Count = this.Content.length;
    Writer.WriteLong(Count);
    for (var Index = 0; Index < Count; Index++) {
        Writer.WriteString2(this.Content[Index].Get_Id());
    }
};
ParaHyperlink.prototype.Read_FromBinary2 = function (Reader) {
    this.Id = Reader.GetString2();
    this.Value = Reader.GetString2();
    this.ToolTip = Reader.GetString2();
    var Count = Reader.GetLong();
    this.Content = [];
    for (var Index = 0; Index < Count; Index++) {
        var Element = g_oTableId.Get_ById(Reader.GetString2());
        if (null !== Element) {
            this.Content.push(Element);
        }
    }
};
ParaHyperlink.prototype.Write_ToBinary2SpreadSheets = function (Writer) {
    Writer.WriteString2("");
    Writer.WriteString2("");
    Writer.WriteLong(0);
};
ParaHyperlink.prototype.Document_UpdateInterfaceState = function () {
    var HyperText = new CParagraphGetText();
    this.Get_Text(HyperText);
    var HyperProps = new CHyperlinkProperty(this);
    HyperProps.put_Text(HyperText.Text);
    editor.sync_HyperlinkPropCallback(HyperProps);
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
        var CurType = this.Content[this.State.ContentPos].Type;
        if (para_Hyperlink === CurType || para_Math === CurType) {
            this.Content[this.State.ContentPos].Document_UpdateInterfaceState();
        }
    }
};
function CParaHyperLinkStartState(HyperLink) {
    this.Value = HyperLink.Value;
    this.ToolTip = HyperLink.ToolTip;
    this.Content = [];
    for (var i = 0; i < HyperLink.Content.length; ++i) {
        this.Content.push(HyperLink.Content);
    }
}