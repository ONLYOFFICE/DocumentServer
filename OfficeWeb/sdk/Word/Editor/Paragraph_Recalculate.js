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
Paragraph.prototype.Recalculate_FastWholeParagraph = function () {
    if (true === this.Parent.Is_HdrFtr(false)) {
        return [];
    }
    if (undefined === this.Parent || true === this.Parent.Is_TableCellContent()) {
        return [];
    }
    if (this.LogicDocument && true === this.LogicDocument.Pages[this.Get_StartPage_Absolute()].Check_EndSectionPara(this)) {
        return [];
    }
    if (1 === this.Lines.length && true !== this.Is_Inline()) {
        return [];
    }
    if (1 === this.Pages.length) {
        var PageNum = this.Get_StartPage_Relative();
        var OldBounds = this.Pages[0].Bounds;
        var FastRecalcResult = this.Recalculate_Page(PageNum, true);
        if (FastRecalcResult === recalcresult_NextElement && 1 === this.Pages.length && true === this.Pages[0].Bounds.Compare(OldBounds)) {
            var PageNum_abs = this.Get_StartPage_Absolute();
            return [PageNum_abs];
        }
    } else {
        if (2 === this.Pages.length) {
            var OldBounds_0 = this.Pages[0].Bounds;
            var OldBounds_1 = this.Pages[1].Bounds;
            var OldStartFromNewPage = this.Pages[0].StartLine < 0 ? true : false;
            var OldLinesCount_0 = this.Pages[0].EndLine - this.Pages[0].StartLine + 1;
            var OldLinesCount_1 = this.Pages[1].EndLine - this.Pages[1].StartLine + 1;
            var PageNum = this.Get_StartPage_Relative();
            var FastRecalcResult = this.Recalculate_Page(PageNum, true);
            if (FastRecalcResult !== recalcresult_NextPage) {
                return [];
            }
            FastRecalcResult = this.Recalculate_Page(PageNum + 1);
            if (FastRecalcResult !== recalcresult_NextElement) {
                return [];
            }
            if (2 !== this.Pages.length || true !== this.Pages[0].Bounds.Compare(OldBounds_0) || true !== this.Pages[1].Bounds.Compare(OldBounds_1)) {
                return [];
            }
            var StartFromNewPage = this.Pages[0].StartLine < 0 ? true : false;
            if (StartFromNewPage !== OldStartFromNewPage) {
                return [];
            }
            if (true !== StartFromNewPage) {
                var LinesCount_0 = this.Pages[0].EndLine - this.Pages[0].StartLine + 1;
                var LinesCount_1 = this.Pages[1].EndLine - this.Pages[1].StartLine + 1;
                if ((OldLinesCount_0 <= 2 || LinesCount_0 <= 2) && OldLinesCount_0 !== LinesCount_0) {
                    return [];
                }
                if ((OldLinesCount_1 <= 2 || LinesCount_1 <= 2) && OldLinesCount_1 !== LinesCount_1) {
                    return [];
                }
            }
            var PageNum_abs = this.Get_StartPage_Absolute();
            if (true === StartFromNewPage) {
                return [PageNum_abs + 1];
            } else {
                return [PageNum_abs, PageNum_abs + 1];
            }
        }
    }
    return [];
};
Paragraph.prototype.Recalculate_FastRange = function (SimpleChanges) {
    if (true === this.Parent.Is_HdrFtr(false)) {
        return -1;
    }
    var Run = SimpleChanges[0].Class;
    var ParaPos = Run.Get_SimpleChanges_ParaPos(SimpleChanges);
    if (null === ParaPos) {
        return -1;
    }
    var Line = ParaPos.Line;
    var Range = ParaPos.Range;
    if (undefined === this.Parent || true === this.Parent.Is_TableCellContent()) {
        return -1;
    }
    if (true === this.Lines[Line].RangeY) {
        return -1;
    }
    if (this.Lines[Line].Info & paralineinfo_BreakPage || (this.Lines[Line].Info & paralineinfo_Empty && this.Lines[Line].Info & paralineinfo_End)) {
        return -1;
    }
    var NumPr = this.Get_CompiledPr2(false).ParaPr.NumPr;
    if (null !== this.Numbering.Item && (Line < this.Numbering.Line || (Line === this.Numbering.Line && Range <= this.Numbering.Range)) && (undefined !== NumPr && undefined !== NumPr.NumId && 0 !== NumPr.NumId && "0" !== NumPr.NumId)) {
        return -1;
    }
    if (0 === Line && 0 === Range && undefined !== this.Get_SectionPr()) {
        return -1;
    }
    if (1 === this.Lines.length && true !== this.Is_Inline()) {
        return -1;
    }
    var PrevLine = Line;
    var PrevRange = Range;
    while (PrevLine >= 0) {
        PrevRange--;
        if (PrevRange < 0) {
            PrevLine--;
            if (PrevLine < 0) {
                break;
            }
            PrevRange = this.Lines[PrevLine].Ranges.length - 1;
        }
        if (true === this.Is_EmptyRange(PrevLine, PrevRange)) {
            continue;
        } else {
            break;
        }
    }
    if (PrevLine < 0) {
        PrevLine = Line;
        PrevRange = Range;
    }
    var NextLine = Line;
    var NextRange = Range;
    var LinesCount = this.Lines.length;
    while (NextLine <= LinesCount - 1) {
        NextRange++;
        if (NextRange > this.Lines[NextLine].Ranges.length - 1) {
            NextLine++;
            if (NextLine > LinesCount - 1) {
                break;
            }
            NextRange = 0;
        }
        if (true === this.Is_EmptyRange(NextLine, NextRange)) {
            continue;
        } else {
            break;
        }
    }
    if (NextLine > LinesCount - 1) {
        NextLine = Line;
        NextRange = Range;
    }
    var CurLine = PrevLine;
    var CurRange = PrevRange;
    var Result;
    while ((CurLine < NextLine) || (CurLine === NextLine && CurRange <= NextRange)) {
        var TempResult = this.private_RecalculateFastRange(CurRange, CurLine);
        if (-1 === TempResult) {
            return -1;
        }
        if (CurLine === Line && CurRange === Range) {
            Result = TempResult;
        }
        CurRange++;
        if (CurRange > this.Lines[CurLine].Ranges.length - 1) {
            CurLine++;
            CurRange = 0;
        }
    }
    this.CurPos.Line = -1;
    this.CurPos.Range = -1;
    this.Internal_CheckSpelling();
    return Result;
};
Paragraph.prototype.Recalculate_Page = function (PageIndex) {
    this.Clear_NearestPosArray();
    this.CurPos.Line = -1;
    this.CurPos.Range = -1;
    this.FontMap.NeedRecalc = true;
    this.Internal_CheckSpelling();
    var CurPage = PageIndex - this.PageNum;
    var RecalcResult = this.private_RecalculatePage(CurPage);
    if (true === this.Parent.RecalcInfo.WidowControlReset) {
        this.Parent.RecalcInfo.Reset();
    }
    return RecalcResult;
};
Paragraph.prototype.Save_RecalculateObject = function () {
    var RecalcObj = new CParagraphRecalculateObject();
    RecalcObj.Save(this);
    return RecalcObj;
};
Paragraph.prototype.Load_RecalculateObject = function (RecalcObj) {
    RecalcObj.Load(this);
};
Paragraph.prototype.Prepare_RecalculateObject = function () {
    this.Pages = [];
    this.Lines = [];
    var Count = this.Content.length;
    for (var Index = 0; Index < Count; Index++) {
        this.Content[Index].Prepare_RecalculateObject();
    }
};
Paragraph.prototype.Start_FromNewPage = function () {
    this.Pages.length = 1;
    this.Pages[0].Set_EndLine(-1);
    this.Lines[-1] = new CParaLine(0);
};
Paragraph.prototype.private_RecalculateFastRange = function (CurRange, CurLine) {
    var PRS = this.m_oPRSW;
    var XStart, YStart, XLimit, YLimit;
    var CurPage = 0;
    var PagesLen = this.Pages.length;
    for (var TempPage = 0; TempPage < PagesLen; TempPage++) {
        var __Page = this.Pages[TempPage];
        if (CurLine <= __Page.EndLine && CurLine >= __Page.FirstLine) {
            CurPage = TempPage;
            break;
        }
    }
    if (-1 === CurPage) {
        return -1;
    }
    var ParaPr = this.Get_CompiledPr2(false).ParaPr;
    if (0 === CurPage) {
        XStart = this.X;
        YStart = this.Y;
        XLimit = this.XLimit;
        YLimit = this.YLimit;
    } else {
        var PageStart = this.Parent.Get_PageContentStartPos(this.PageNum + CurPage, this.Index);
        XStart = PageStart.X;
        YStart = PageStart.Y;
        XLimit = PageStart.XLimit;
        YLimit = PageStart.YLimit;
    }
    PRS.XStart = XStart;
    PRS.YStart = YStart;
    PRS.XLimit = XLimit - ParaPr.Ind.Right;
    PRS.YLimit = YLimit;
    PRS.Reset_Line();
    PRS.Page = 0;
    PRS.Line = CurLine;
    PRS.Range = CurRange;
    PRS.RangesCount = this.Lines[CurLine].Ranges.length - 1;
    PRS.Paragraph = this;
    var RangesCount = PRS.RangesCount;
    var Line = this.Lines[CurLine];
    var Range = Line.Ranges[CurRange];
    var StartPos = Range.StartPos;
    var EndPos = Range.EndPos;
    PRS.Reset_Range(Range.X, Range.XEnd);
    var ContentLen = this.Content.length;
    for (var Pos = StartPos; Pos <= EndPos; Pos++) {
        var Item = this.Content[Pos];
        if (para_Math === Item.Type) {
            Item.Set_Inline(true === this.Check_MathPara(Pos) ? false : true);
        }
        PRS.Update_CurPos(Pos, 0);
        var SavedLines = Item.Save_RecalculateObject(true);
        Item.Recalculate_Range(PRS, ParaPr, 1);
        if ((true === PRS.NewRange && Pos !== EndPos) || (Pos === EndPos && true !== PRS.NewRange)) {
            return -1;
        } else {
            if (Pos === EndPos && true === PRS.NewRange && true === PRS.MoveToLBP) {
                var BreakPos = PRS.LineBreakPos.Get(0);
                if (BreakPos !== Pos) {
                    return -1;
                } else {
                    Item.Recalculate_Set_RangeEndPos(PRS, PRS.LineBreakPos, 1);
                }
            }
        }
        if (false === SavedLines.Compare(CurLine, CurRange, Item)) {
            return -1;
        }
        Item.Load_RecalculateObject(SavedLines, this);
    }
    if (recalcresult_NextElement !== this.private_RecalculateLineAlign(CurLine, CurPage, PRS, ParaPr, true)) {
        return -1;
    }
    return this.Get_StartPage_Absolute() + CurPage;
};
Paragraph.prototype.private_RecalculatePage = function (CurPage) {
    var PRS = this.m_oPRSW;
    PRS.Page = CurPage;
    PRS.RunRecalcInfoLast = (0 === CurPage ? null : this.Pages[CurPage - 1].EndInfo.RunRecalcInfo);
    PRS.RunRecalcInfoBreak = PRS.RunRecalcInfoLast;
    var Pr = this.Get_CompiledPr();
    var ParaPr = Pr.ParaPr;
    var CurLine = (CurPage > 0 ? this.Pages[CurPage - 1].EndLine + 1 : 0);
    if (false === this.private_RecalculatePageKeepNext(CurLine, CurPage, PRS, ParaPr)) {
        return PRS.RecalcResult;
    }
    this.private_RecalculatePageXY(CurLine, CurPage, PRS, ParaPr);
    if (false === this.private_RecalculatePageBreak(CurLine, CurPage, PRS, ParaPr)) {
        return PRS.RecalcResult;
    }
    PRS.Reset_Ranges();
    PRS.Reset_PageBreak();
    var RecalcResult;
    while (true) {
        PRS.Line = CurLine;
        PRS.RecalcResult = recalcresult_NextLine;
        this.private_RecalculateLine(CurLine, CurPage, PRS, ParaPr);
        RecalcResult = PRS.RecalcResult;
        if (recalcresult_NextLine === RecalcResult) {
            CurLine++;
            PRS.Reset_Ranges();
            PRS.Reset_PageBreak();
            PRS.Reset_RunRecalcInfo();
        } else {
            if (recalcresult_CurLine === RecalcResult) {
                PRS.Restore_RunRecalcInfo();
            } else {
                if (recalcresult_NextElement === RecalcResult || recalcresult_NextPage === RecalcResult) {
                    break;
                } else {
                    if (recalcresult_CurPagePara === RecalcResult) {
                        RecalcResult = this.private_RecalculatePage(CurPage);
                        break;
                    } else {
                        return RecalcResult;
                    }
                }
            }
        }
    }
    this.Recalculate_PageEndInfo(PRS, CurPage);
    return RecalcResult;
};
Paragraph.prototype.private_RecalculatePageKeepNext = function (CurLine, CurPage, PRS, ParaPr) {
    if (1 === CurPage && this.Pages[0].EndLine < 0 && this.Parent instanceof CDocument && false === ParaPr.PageBreakBefore) {
        var Curr = this.Get_DocumentPrev();
        while (null != Curr && type_Paragraph === Curr.GetType() && undefined === Curr.Get_SectionPr()) {
            var CurrKeepNext = Curr.Get_CompiledPr2(false).ParaPr.KeepNext;
            if ((true === CurrKeepNext && Curr.Pages.length > 1) || false === CurrKeepNext || true !== Curr.Is_Inline() || true === Curr.Check_PageBreak()) {
                break;
            } else {
                var Prev = Curr.Get_DocumentPrev();
                if (null === Prev || type_Paragraph != Prev.GetType() || undefined !== Prev.Get_SectionPr()) {
                    break;
                }
                var PrevKeepNext = Prev.Get_CompiledPr2(false).ParaPr.KeepNext;
                if (false === PrevKeepNext) {
                    if (true === this.Parent.RecalcInfo.Can_RecalcObject()) {
                        this.Parent.RecalcInfo.Set_KeepNext(Curr);
                        PRS.RecalcResult = recalcresult_PrevPage;
                        return false;
                    } else {
                        break;
                    }
                } else {
                    Curr = Prev;
                }
            }
        }
    }
    return true;
};
Paragraph.prototype.private_RecalculatePageXY = function (CurLine, CurPage, PRS, ParaPr) {
    var XStart, YStart, XLimit, YLimit;
    if (0 === CurPage || (undefined != this.Get_FramePr() && this.LogicDocument === this.Parent)) {
        XStart = this.X;
        YStart = this.Y;
        XLimit = this.XLimit;
        YLimit = this.YLimit;
    } else {
        var PageStart = this.Parent.Get_PageContentStartPos(this.PageNum + CurPage, this.Index);
        XStart = PageStart.X;
        YStart = PageStart.Y;
        XLimit = PageStart.XLimit;
        YLimit = PageStart.YLimit;
    }
    PRS.XStart = XStart;
    PRS.YStart = YStart;
    PRS.XLimit = XLimit - ParaPr.Ind.Right;
    PRS.YLimit = YLimit;
    PRS.Y = YStart;
    this.Pages.length = CurPage + 1;
    this.Pages[CurPage] = new CParaPage(XStart, YStart, XLimit, YLimit, CurLine);
};
Paragraph.prototype.private_RecalculatePageBreak = function (CurLine, CurPage, PRS, ParaPr) {
    if (this.Parent instanceof CDocument) {
        if (0 === CurPage && true === ParaPr.PageBreakBefore) {
            var bNeedPageBreak = true;
            var Prev = this.Get_DocumentPrev();
            if ((true === this.IsEmpty() && undefined !== this.Get_SectionPr()) || null === Prev) {
                bNeedPageBreak = false;
            } else {
                if (this.Parent === this.LogicDocument && type_Paragraph === Prev.GetType() && undefined !== Prev.Get_SectionPr()) {
                    var PrevSectPr = Prev.Get_SectionPr();
                    var CurSectPr = this.LogicDocument.SectionsInfo.Get_SectPr(this.Index).SectPr;
                    if (section_type_Continuous !== CurSectPr.Get_Type() || true !== CurSectPr.Compare_PageSize(PrevSectPr)) {
                        bNeedPageBreak = false;
                    }
                }
            }
            if (true === bNeedPageBreak) {
                this.Pages[CurPage].Set_EndLine(CurLine - 1);
                if (0 === CurLine) {
                    this.Lines[-1] = new CParaLine(0);
                }
                PRS.RecalcResult = recalcresult_NextPage;
                return false;
            }
        } else {
            if (true === this.Parent.RecalcInfo.Check_KeepNext(this) && 0 === CurPage && null != this.Get_DocumentPrev()) {
                this.Parent.RecalcInfo.Reset();
                this.Pages[CurPage].Set_EndLine(CurLine - 1);
                if (0 === CurLine) {
                    this.Lines[-1] = new CParaLine(0);
                }
                PRS.RecalcResult = recalcresult_NextPage;
                return false;
            }
        }
    }
    if (PRS.YStart > PRS.YLimit - 0.001 && (CurLine != this.Pages[CurPage].FirstLine || (0 === CurPage && (null != this.Get_DocumentPrev() || true === this.Parent.Is_TableCellContent()))) && true === this.Use_YLimit()) {
        this.Pages[CurPage].Set_EndLine(CurLine - 1);
        if (0 === CurLine) {
            this.Lines[-1] = new CParaLine(0);
        }
        PRS.RecalcResult = recalcresult_NextPage;
        return false;
    }
    return true;
};
Paragraph.prototype.private_RecalculateLine = function (CurLine, CurPage, PRS, ParaPr) {
    this.ParaEnd.Line = -1;
    this.ParaEnd.Range = -1;
    this.Lines.length = CurLine + 1;
    this.Lines[CurLine] = new CParaLine();
    if (false === this.private_RecalculateLineWidow(CurLine, CurPage, PRS, ParaPr)) {
        return;
    }
    this.private_RecalculateLineFillRanges(CurLine, CurPage, PRS, ParaPr);
    if (false === this.private_RecalculateLineRanges(CurLine, CurPage, PRS, ParaPr)) {
        return;
    }
    this.private_RecalculateLineInfo(CurLine, CurPage, PRS, ParaPr);
    this.private_RecalculateLineMetrics(CurLine, CurPage, PRS, ParaPr);
    this.private_RecalculateLinePosition(CurLine, CurPage, PRS, ParaPr);
    if (false === this.private_RecalculateLineBottomBound(CurLine, CurPage, PRS, ParaPr)) {
        return;
    }
    if (false === this.private_RecalculateLineCheckRanges(CurLine, CurPage, PRS, ParaPr)) {
        return;
    }
    if (false === this.private_RecalculateLineBreakPageEnd(CurLine, CurPage, PRS, ParaPr)) {
        return;
    }
    this.private_RecalculateLineBaseLine(CurLine, CurPage, PRS, ParaPr);
    if (false === this.private_RecalculateLineCheckRangeY(CurLine, CurPage, PRS, ParaPr)) {
        return;
    }
    if (recalcresult_NextElement !== this.private_RecalculateLineAlign(CurLine, CurPage, PRS, ParaPr, false)) {
        return;
    }
    if (false === this.private_RecalculateLineEnd(CurLine, CurPage, PRS, ParaPr)) {
        return;
    }
};
Paragraph.prototype.private_RecalculateLineWidow = function (CurLine, CurPage, PRS, ParaPr) {
    if (this.Parent instanceof CDocument && true === this.Parent.RecalcInfo.Check_WidowControl(this, CurLine)) {
        this.Parent.RecalcInfo.Reset_WidowControl();
        this.Pages[CurPage].Set_EndLine(CurLine - 1);
        if (0 === CurLine) {
            this.Lines[-1] = new CParaLine(0);
        }
        PRS.RecalcResult = recalcresult_NextPage;
        return false;
    }
    return true;
};
Paragraph.prototype.private_RecalculateLineFillRanges = function (CurLine, CurPage, PRS, ParaPr) {
    this.Lines[CurLine].Info = 0;
    var Ranges = PRS.Ranges;
    var RangesCount = PRS.RangesCount;
    PRS.Reset_Line();
    var UseFirstLine = true;
    for (var TempCurLine = CurLine - 1; TempCurLine >= 0; TempCurLine--) {
        var TempInfo = this.Lines[TempCurLine].Info;
        if (! (TempInfo & paralineinfo_BreakPage) || !(TempInfo & paralineinfo_Empty)) {
            UseFirstLine = false;
            break;
        }
    }
    PRS.UseFirstLine = UseFirstLine;
    this.Lines[CurLine].Reset();
    this.Lines[CurLine].Add_Range((true === UseFirstLine ? PRS.XStart + ParaPr.Ind.Left + ParaPr.Ind.FirstLine : PRS.XStart + ParaPr.Ind.Left), (RangesCount == 0 ? PRS.XLimit : Ranges[0].X0));
    for (var Index = 1; Index < Ranges.length + 1; Index++) {
        this.Lines[CurLine].Add_Range(Ranges[Index - 1].X1, (RangesCount == Index ? PRS.XLimit : Ranges[Index].X0));
    }
    if (true === PRS.RangeY) {
        PRS.RangeY = false;
        this.Lines[CurLine].Info |= paralineinfo_RangeY;
    }
};
Paragraph.prototype.private_RecalculateLineRanges = function (CurLine, CurPage, PRS, ParaPr) {
    var RangesCount = PRS.RangesCount;
    var CurRange = 0;
    while (CurRange <= RangesCount) {
        PRS.Range = CurRange;
        this.private_RecalculateRange(CurRange, CurLine, CurPage, RangesCount, PRS, ParaPr);
        if (true === PRS.ForceNewPage || true === PRS.NewPage) {
            this.Lines[CurLine].Ranges.length = CurRange + 1;
            break;
        }
        if (-1 === this.ParaEnd.Line && true === PRS.End) {
            this.ParaEnd.Line = CurLine;
            this.ParaEnd.Range = CurRange;
        }
        if (recalcresult_NextPage === PRS.RecalcResult) {
            return false;
        }
        CurRange++;
    }
    return true;
};
Paragraph.prototype.private_RecalculateLineInfo = function (CurLine, CurPage, PRS, ParaPr) {
    if (true === PRS.BreakPageLine || true === PRS.SkipPageBreak) {
        this.Lines[CurLine].Info |= paralineinfo_BreakPage;
    }
    if (true === PRS.EmptyLine) {
        this.Lines[CurLine].Info |= paralineinfo_Empty;
    }
    if (true === PRS.End) {
        this.Lines[CurLine].Info |= paralineinfo_End;
    }
};
Paragraph.prototype.private_RecalculateLineMetrics = function (CurLine, CurPage, PRS, ParaPr) {
    if (true === PRS.EmptyLine || PRS.LineAscent < 0.001) {
        var LastItem = (true === PRS.End ? this.Content[this.Content.length - 1] : this.Content[this.Lines[CurLine].Ranges[this.Lines[CurLine].Ranges.length - 1].EndPos]);
        if (true === PRS.End) {
            var EndTextPr = this.Get_CompiledPr2(false).TextPr.Copy();
            EndTextPr.Merge(this.TextPr.Value);
            g_oTextMeasurer.SetTextPr(EndTextPr, this.Get_Theme());
            g_oTextMeasurer.SetFontSlot(fontslot_ASCII);
            var EndTextHeight = g_oTextMeasurer.GetHeight();
            var EndTextDescent = Math.abs(g_oTextMeasurer.GetDescender());
            var EndTextAscent = EndTextHeight - EndTextDescent;
            var EndTextAscent2 = g_oTextMeasurer.GetAscender();
            PRS.LineTextAscent = EndTextAscent;
            PRS.LineTextAscent2 = EndTextAscent2;
            PRS.LineTextDescent = EndTextDescent;
            if (PRS.LineAscent < EndTextAscent) {
                PRS.LineAscent = EndTextAscent;
            }
            if (PRS.LineDescent < EndTextDescent) {
                PRS.LineDescent = EndTextDescent;
            }
        } else {
            if (undefined !== LastItem) {
                var LastRun = LastItem.Get_LastRunInRange(PRS.Line, PRS.Range);
                if (undefined !== LastRun && null !== LastRun) {
                    if (PRS.LineTextAscent < LastRun.TextAscent) {
                        PRS.LineTextAscent = LastRun.TextAscent;
                    }
                    if (PRS.LineTextAscent2 < LastRun.TextAscent2) {
                        PRS.LineTextAscent2 = LastRun.TextAscent2;
                    }
                    if (PRS.LineTextDescent < LastRun.TextDescent) {
                        PRS.LineTextDescent = LastRun.TextDescent;
                    }
                    if (PRS.LineAscent < LastRun.TextAscent) {
                        PRS.LineAscent = LastRun.TextAscent;
                    }
                    if (PRS.LineDescent < LastRun.TextDescent) {
                        PRS.LineDescent = LastRun.TextDescent;
                    }
                }
            }
        }
    }
    this.Lines[CurLine].Metrics.Update(PRS.LineTextAscent, PRS.LineTextAscent2, PRS.LineTextDescent, PRS.LineAscent, PRS.LineDescent, ParaPr);
};
Paragraph.prototype.private_RecalculateLinePosition = function (CurLine, CurPage, PRS, ParaPr) {
    var BaseLineOffset = 0;
    if (CurLine === this.Pages[CurPage].FirstLine) {
        BaseLineOffset = this.Lines[CurLine].Metrics.Ascent;
        if (0 === CurLine) {
            if (0 === CurPage || true === this.Parent.Is_TableCellContent() || true === ParaPr.PageBreakBefore) {
                BaseLineOffset += ParaPr.Spacing.Before;
            }
            if ((true === ParaPr.Brd.First || 1 === CurPage) && border_Single === ParaPr.Brd.Top.Value) {
                BaseLineOffset += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
            } else {
                if (false === ParaPr.Brd.First && border_Single === ParaPr.Brd.Between.Value) {
                    BaseLineOffset += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
                }
            }
        }
        PRS.BaseLineOffset = BaseLineOffset;
    } else {
        BaseLineOffset = PRS.BaseLineOffset;
    }
    var Top, Bottom;
    var Top2, Bottom2;
    var PrevBottom = this.Pages[CurPage].Bounds.Bottom;
    if (this.Lines[CurLine].Info & paralineinfo_RangeY) {
        Top = PRS.Y;
        Top2 = PRS.Y;
        if (0 === CurLine) {
            if (0 === CurPage || true === this.Parent.Is_TableCellContent()) {
                Top2 = Top + ParaPr.Spacing.Before;
                Bottom2 = Top + ParaPr.Spacing.Before + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent;
                if (true === ParaPr.Brd.First && border_Single === ParaPr.Brd.Top.Value) {
                    Top2 += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                    Bottom2 += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                } else {
                    if (false === ParaPr.Brd.First && border_Single === ParaPr.Brd.Between.Value) {
                        Top2 += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
                        Bottom2 += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
                    }
                }
            } else {
                Bottom2 = Top + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent;
                if (border_Single === ParaPr.Brd.Top.Value) {
                    Top2 += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                    Bottom2 += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                }
            }
        } else {
            Bottom2 = Top + this.Lines[CurLine].Metrics.Ascent + this.Lines[CurLine].Metrics.Descent;
        }
    } else {
        if (0 !== CurLine) {
            if (CurLine !== this.Pages[CurPage].FirstLine) {
                Top = PRS.Y + BaseLineOffset + this.Lines[CurLine - 1].Metrics.Descent + this.Lines[CurLine - 1].Metrics.LineGap;
                Top2 = Top;
                Bottom2 = Top + this.Lines[CurLine].Metrics.Ascent + this.Lines[CurLine].Metrics.Descent;
            } else {
                Top = this.Pages[CurPage].Y;
                Top2 = Top;
                Bottom2 = Top + this.Lines[CurLine].Metrics.Ascent + this.Lines[CurLine].Metrics.Descent;
            }
        } else {
            Top = PRS.Y;
            Top2 = PRS.Y;
            if (0 === CurPage || true === this.Parent.Is_TableCellContent() || true === ParaPr.PageBreakBefore) {
                Top2 = Top + ParaPr.Spacing.Before;
                Bottom2 = Top + ParaPr.Spacing.Before + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent;
                if (true === ParaPr.Brd.First && border_Single === ParaPr.Brd.Top.Value) {
                    Top2 += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                    Bottom2 += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                } else {
                    if (false === ParaPr.Brd.First && border_Single === ParaPr.Brd.Between.Value) {
                        Top2 += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
                        Bottom2 += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
                    }
                }
            } else {
                Bottom2 = Top + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent;
                if (border_Single === ParaPr.Brd.Top.Value) {
                    Top2 += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                    Bottom2 += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                }
            }
        }
    }
    Bottom = Bottom2;
    Bottom += this.Lines[CurLine].Metrics.LineGap;
    if (true === PRS.End) {
        Bottom += ParaPr.Spacing.After;
        if (true === ParaPr.Brd.Last && border_Single === ParaPr.Brd.Bottom.Value) {
            Bottom += ParaPr.Brd.Bottom.Size + ParaPr.Brd.Bottom.Space;
        } else {
            if (border_Single === ParaPr.Brd.Between.Value) {
                Bottom += ParaPr.Brd.Between.Space;
            }
        }
        if (false === this.Parent.Is_TableCellContent() && Bottom > this.YLimit && Bottom - this.YLimit <= ParaPr.Spacing.After) {
            Bottom = this.YLimit;
        }
    }
    if (CurLine === this.Pages[CurPage].FirstLine && !(this.Lines[CurLine].Info & paralineinfo_RangeY)) {
        this.Pages[CurPage].Bounds.Top = Top;
    }
    this.Pages[CurPage].Bounds.Bottom = Bottom;
    this.Lines[CurLine].Top = Top - this.Pages[CurPage].Y;
    this.Lines[CurLine].Bottom = Bottom - this.Pages[CurPage].Y;
    PRS.LineTop = Top;
    PRS.LineBottom = Bottom;
    PRS.LineTop2 = Top2;
    PRS.LineBottom2 = Bottom2;
    PRS.LinePrevBottom = PrevBottom;
};
Paragraph.prototype.private_RecalculateLineBottomBound = function (CurLine, CurPage, PRS, ParaPr) {
    var Top = PRS.LineTop;
    var Bottom2 = PRS.LineBottom;
    if (true === this.Parent.Is_TableCellContent()) {
        Bottom2 = PRS.LineBottom;
    }
    var LineInfo = this.Lines[CurLine].Info;
    var BreakPageLineEmpty = (LineInfo & paralineinfo_BreakPage && LineInfo & paralineinfo_Empty && !(LineInfo & paralineinfo_End) ? true : false);
    PRS.BreakPageLineEmpty = BreakPageLineEmpty;
    if (true === this.Use_YLimit() && (Top > this.YLimit || Bottom2 > this.YLimit) && (CurLine != this.Pages[CurPage].FirstLine || (0 === CurPage && (null != this.Get_DocumentPrev() || true === this.Parent.Is_TableCellContent()))) && false === BreakPageLineEmpty) {
        if (this.Parent instanceof CDocument && true === this.Parent.RecalcInfo.Can_RecalcObject() && true === ParaPr.WidowControl && CurLine - this.Pages[CurPage].StartLine <= 1 && CurLine >= 1 && true != PRS.BreakPageLine && (0 === CurPage && null != this.Get_DocumentPrev())) {
            this.Recalculate_Drawing_AddPageBreak(0, 0, true);
            this.Parent.RecalcInfo.Set_WidowControl(this, CurLine - 1);
            PRS.RecalcResult = recalcresult_CurPage;
            return false;
        } else {
            if (true === ParaPr.KeepLines && null != this.Get_DocumentPrev() && true != this.Parent.Is_TableCellContent() && 0 === CurPage) {
                CurLine = 0;
            }
            this.Pages[CurPage].Bounds.Bottom = PRS.LinePrevBottom;
            this.Pages[CurPage].Set_EndLine(CurLine - 1);
            if (0 === CurLine) {
                this.Lines[-1] = new CParaLine(0);
            }
            PRS.RecalcResult = recalcresult_NextPage;
            return false;
        }
    }
    return true;
};
Paragraph.prototype.private_RecalculateLineCheckRanges = function (CurLine, CurPage, PRS, ParaPr) {
    var Left = (0 !== CurLine ? this.X + ParaPr.Ind.Left : this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine);
    var Right = this.XLimit - ParaPr.Ind.Right;
    var Top = PRS.LineTop;
    var Bottom = PRS.LineBottom;
    var Top2 = PRS.LineTop2;
    var Bottom2 = PRS.LineBottom2;
    var PageFields = this.Parent.Get_PageFields(this.PageNum + CurPage);
    var Ranges = PRS.Ranges;
    var Ranges2;
    if (true === this.Use_Wrap()) {
        Ranges2 = this.Parent.CheckRange(Left, Top, Right, Bottom, Top2, Bottom2, PageFields.X, PageFields.XLimit, this.PageNum + CurPage, true);
    } else {
        Ranges2 = [];
    }
    if (-1 === FlowObjects_CompareRanges(Ranges, Ranges2) && true === FlowObjects_CheckInjection(Ranges, Ranges2) && false === PRS.BreakPageLineEmpty) {
        PRS.Ranges = Ranges2;
        PRS.RangesCount = Ranges2.length;
        PRS.RecalcResult = recalcresult_CurLine;
        if (this.Lines[CurLine].Info & paralineinfo_RangeY) {
            PRS.RangeY = true;
        }
        return false;
    }
    return true;
};
Paragraph.prototype.private_RecalculateLineBaseLine = function (CurLine, CurPage, PRS, ParaPr) {
    if (this.Lines[CurLine].Info & paralineinfo_RangeY) {
        this.Lines[CurLine].Y = PRS.Y - this.Pages[CurPage].Y;
        PRS.BaseLineOffset = this.Lines[CurLine].Metrics.Ascent;
    } else {
        if (CurLine > 0) {
            if (CurLine != this.Pages[CurPage].FirstLine && (true === PRS.End || true !== PRS.EmptyLine || PRS.RangesCount <= 0 || true === PRS.NewPage)) {
                PRS.Y += this.Lines[CurLine - 1].Metrics.Descent + this.Lines[CurLine - 1].Metrics.LineGap + this.Lines[CurLine].Metrics.Ascent;
            }
            this.Lines[CurLine].Y = PRS.Y - this.Pages[CurPage].Y;
        } else {
            this.Lines[0].Y = 0;
        }
    }
    this.Lines[CurLine].Y += PRS.BaseLineOffset;
    if (this.Lines[CurLine].Metrics.LineGap < 0) {
        this.Lines[CurLine].Y += this.Lines[CurLine].Metrics.LineGap;
    }
};
Paragraph.prototype.private_RecalculateLineCheckRangeY = function (CurLine, CurPage, PRS, ParaPr) {
    if (recalcresult_NextPage === PRS.RecalcResult) {
        return false;
    }
    if (true !== PRS.End && true === PRS.EmptyLine && PRS.RangesCount > 0) {
        var Ranges = PRS.Ranges;
        var RangesMaxY = Ranges[0].Y1;
        for (var Index = 1; Index < Ranges.length; Index++) {
            if (RangesMaxY > Ranges[Index].Y1) {
                RangesMaxY = Ranges[Index].Y1;
            }
        }
        if (Math.abs(RangesMaxY - PRS.Y) < 0.001) {
            PRS.Y = RangesMaxY + 1;
        } else {
            PRS.Y = RangesMaxY + 0.001;
        }
        PRS.RangeY = true;
        PRS.Reset_Ranges();
        PRS.RecalcResult = recalcresult_CurLine;
        return false;
    }
    return true;
};
Paragraph.prototype.private_RecalculateLineBreakPageEnd = function (CurLine, CurPage, PRS, ParaPr) {
    if (true === PRS.NewPage && true === this.Check_BreakPageEnd(PRS.PageBreak)) {
        PRS.PageBreak.Flags.NewLine = false;
        PRS.ExtendBoundToBottom = true;
        PRS.SkipPageBreak = true;
        PRS.RecalcResult = recalcresult_CurLine;
        return false;
    }
};
Paragraph.prototype.private_RecalculateLineEnd = function (CurLine, CurPage, PRS, ParaPr) {
    if (true === PRS.NewPage) {
        if (true === this.Check_BreakPageEnd(PRS.PageBreak)) {
            PRS.PageBreak.Flags.NewLine = false;
            PRS.ExtendBoundToBottom = true;
            PRS.SkipPageBreak = true;
            PRS.RecalcResult = recalcresult_CurLine;
            return false;
        }
        this.Pages[CurPage].Set_EndLine(CurLine);
        PRS.RecalcResult = recalcresult_NextPage;
        return false;
    }
    if (true !== PRS.End) {
        if (true === PRS.ForceNewPage) {
            this.Pages[CurPage].Set_EndLine(CurLine - 1);
            if (0 === CurLine) {
                this.Lines[-1] = new CParaLine();
            }
            PRS.RecalcResult = recalcresult_NextPage;
            return false;
        }
    } else {
        if (PRS.Range < PRS.RangesCount) {
            this.Lines[CurLine].Ranges.length = PRS.Range + 1;
        }
        if (true === ParaPr.WidowControl && CurLine === this.Pages[CurPage].StartLine && CurLine >= 1) {
            var BreakPagePrevLine = (this.Lines[CurLine - 1].Info & paralineinfo_BreakPage) | 0;
            if (this.Parent instanceof CDocument && true === this.Parent.RecalcInfo.Can_RecalcObject() && 0 === BreakPagePrevLine && (1 === CurPage && null != this.Get_DocumentPrev()) && this.Lines[CurLine - 1].Ranges.length <= 1) {
                this.Recalculate_Drawing_AddPageBreak(0, 0, true);
                this.Parent.RecalcInfo.Set_WidowControl(this, (CurLine > 2 ? CurLine - 1 : 0));
                PRS.RecalcResult = recalcresult_PrevPage;
                return false;
            }
        }
        if (true === PRS.ExtendBoundToBottom) {
            this.Pages[CurPage].Bounds.Bottom = this.Pages[CurPage].YLimit;
            if (para_End === this.Numbering.Item.Type) {
                this.Numbering.Item = null;
                this.Numbering.Run = null;
                this.Numbering.Line = -1;
                this.Numbering.Range = -1;
            }
        }
        this.Pages[CurPage].Set_EndLine(CurLine);
        PRS.RecalcResult = recalcresult_NextElement;
    }
    return true;
};
Paragraph.prototype.private_RecalculateLineAlign = function (CurLine, CurPage, PRS, ParaPr, Fast) {
    var PRSW = PRS;
    var PRSC = this.m_oPRSC;
    var PRSA = this.m_oPRSA;
    PRSA.Paragraph = this;
    PRSA.LastW = 0;
    PRSA.RecalcFast = Fast;
    PRSA.RecalcResult = recalcresult_NextElement;
    PRSA.PageY = this.Pages[CurPage].Bounds.Top;
    var Line = this.Lines[CurLine];
    var RangesCount = Line.Ranges.length;
    for (var CurRange = 0; CurRange < RangesCount; CurRange++) {
        var Range = Line.Ranges[CurRange];
        var StartPos = Range.StartPos;
        var EndPos = Range.EndPos;
        PRSC.Reset(this, Range);
        PRSC.Range.W = 0;
        if (true === this.Numbering.Check_Range(CurRange, CurLine)) {
            PRSC.Range.W += this.Numbering.WidthVisible;
        }
        for (var Pos = StartPos; Pos <= EndPos; Pos++) {
            var Item = this.Content[Pos];
            Item.Recalculate_Range_Width(PRSC, CurLine, CurRange);
        }
        var JustifyWord = 0;
        var JustifySpace = 0;
        var RangeWidth = Range.XEnd - Range.X;
        var X = 0;
        var ParaMath = this.Check_Range_OnlyMath(CurRange, CurLine);
        if (null !== ParaMath) {
            var Math_Jc = ParaMath.Get_Align();
            var Math_X = (1 === RangesCount ? this.Pages[CurPage].X + ParaPr.Ind.Left : Range.X);
            var Math_XLimit = (1 === RangesCount ? this.Pages[CurPage].XLimit - ParaPr.Ind.Right : Range.XEnd);
            switch (Math_Jc) {
            case align_Left:
                X = Math_X;
                break;
            case align_Right:
                X = Math_XLimit - ParaMath.Width;
                break;
            case align_Center:
                X = Math.max(Math_X + (Math_XLimit - Math_X - ParaMath.Width) / 2, Math_X);
                break;
            }
        } else {
            switch (ParaPr.Jc) {
            case align_Left:
                X = Range.X;
                break;
            case align_Right:
                X = Math.max(Range.X + RangeWidth - Range.W, Range.X);
                break;
            case align_Center:
                X = Math.max(Range.X + (RangeWidth - Range.W) / 2, Range.X);
                break;
            case align_Justify:
                X = Range.X;
                if (1 == PRSC.Words) {
                    if (1 == RangesCount && !(Line.Info & paralineinfo_End)) {
                        if (RangeWidth - Range.W <= 0.05 * RangeWidth && PRSC.Letters > 1) {
                            JustifyWord = (RangeWidth - Range.W) / (PRSC.Letters - 1);
                        }
                    } else {
                        if (0 == CurRange || (Line.Info & paralineinfo_End && CurRange == RangesCount - 1)) {} else {
                            if (CurRange == RangesCount - 1) {
                                X = Range.X + RangeWidth - Range.W;
                            } else {
                                X = Range.X + (RangeWidth - Range.W) / 2;
                            }
                        }
                    }
                } else {
                    if (PRSC.Spaces > 0 && (!(Line.Info & paralineinfo_End) || CurRange != Line.Ranges.length - 1)) {
                        JustifySpace = (RangeWidth - Range.W) / PRSC.Spaces;
                    } else {
                        JustifySpace = 0;
                    }
                }
                break;
            default:
                X = Range.X;
                break;
            }
            if (CurLine === this.ParaEnd.Line && CurRange === this.ParaEnd.Range) {
                JustifyWord = 0;
                JustifySpace = 0;
            }
        }
        Range.Spaces = PRSC.Spaces + PRSC.SpacesSkip;
        PRSA.X = X;
        PRSA.Y = this.Pages[CurPage].Y + this.Lines[CurLine].Y;
        PRSA.XEnd = Range.XEnd;
        PRSA.JustifyWord = JustifyWord;
        PRSA.JustifySpace = JustifySpace;
        PRSA.SpacesCounter = PRSC.Spaces;
        PRSA.SpacesSkip = PRSC.SpacesSkip;
        PRSA.LettersSkip = PRSC.LettersSkip;
        PRSA.RecalcResult = recalcresult_NextElement;
        this.Lines[CurLine].Ranges[CurRange].XVisible = X;
        if (0 === CurRange) {
            this.Lines[CurLine].X = X - PRSW.XStart;
        }
        if (true === this.Numbering.Check_Range(CurRange, CurLine)) {
            PRSA.X += this.Numbering.WidthVisible;
        }
        for (var Pos = StartPos; Pos <= EndPos; Pos++) {
            var Item = this.Content[Pos];
            Item.Recalculate_Range_Spaces(PRSA, CurLine, CurRange, CurPage);
            if (recalcresult_NextElement !== PRSA.RecalcResult) {
                PRSW.RecalcResult = PRSA.RecalcResult;
                return PRSA.RecalcResult;
            }
        }
    }
    return PRSA.RecalcResult;
};
Paragraph.prototype.private_RecalculateRange = function (CurRange, CurLine, CurPage, RangesCount, PRS, ParaPr) {
    var StartPos = 0;
    if (0 === CurLine && 0 === CurRange) {
        StartPos = 0;
    } else {
        if (CurRange > 0) {
            StartPos = this.Lines[CurLine].Ranges[CurRange - 1].EndPos;
        } else {
            StartPos = this.Lines[CurLine - 1].Ranges[this.Lines[CurLine - 1].Ranges.length - 1].EndPos;
        }
    }
    var Line = this.Lines[CurLine];
    var Range = Line.Ranges[CurRange];
    this.Lines[CurLine].Set_RangeStartPos(CurRange, StartPos);
    if (true === PRS.UseFirstLine && 0 !== CurRange && true === PRS.EmptyLine) {
        if (ParaPr.Ind.FirstLine < 0) {
            Range.X += ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
        } else {
            Range.X += ParaPr.Ind.FirstLine;
        }
    }
    var X = Range.X;
    var XEnd = (CurRange == RangesCount ? PRS.XLimit : PRS.Ranges[CurRange].X0);
    PRS.Reset_Range(X, XEnd);
    var ContentLen = this.Content.length;
    var Pos = StartPos;
    for (; Pos < ContentLen; Pos++) {
        var Item = this.Content[Pos];
        if (para_Math === Item.Type) {
            Item.Set_Inline(true === this.Check_MathPara(Pos) ? false : true);
        }
        if ((0 === Pos && 0 === CurLine && 0 === CurRange) || Pos !== StartPos) {
            Item.Recalculate_Reset(CurRange, CurLine);
        }
        PRS.Update_CurPos(Pos, 0);
        Item.Recalculate_Range(PRS, ParaPr, 1);
        if (true === PRS.NewRange) {
            break;
        }
    }
    if (Pos >= ContentLen) {
        Pos = ContentLen - 1;
    }
    if (recalcresult_NextLine === PRS.RecalcResult) {
        if (true === PRS.MoveToLBP) {
            this.private_RecalculateRangeEndPos(PRS, PRS.LineBreakPos, 0);
        } else {
            this.Lines[CurLine].Set_RangeEndPos(CurRange, Pos);
        }
    }
};
Paragraph.prototype.private_RecalculateRangeEndPos = function (PRS, PRP, Depth) {
    var CurLine = PRS.Line;
    var CurRange = PRS.Range;
    var CurPos = PRP.Get(Depth);
    this.Content[CurPos].Recalculate_Set_RangeEndPos(PRS, PRP, Depth + 1);
    this.Lines[CurLine].Set_RangeEndPos(CurRange, CurPos);
};
var ERecalcPageType = {
    START: 0,
    ELEMENT: 1,
    Y: 2
};
function CRecalcPageType() {
    this.Type = ERecalcPageType.START;
    this.Element = null;
    this.Y = -1;
}
CRecalcPageType.prototype.Reset = function () {
    this.Type = ERecalcPageType.START;
    this.Element = null;
    this.Y = -1;
};
CRecalcPageType.prototype.Set_Element = function (Element) {
    this.Type = ERecalcPageType.Element;
    this.Element = Element;
};
CRecalcPageType.prototype.Set_Y = function (Y) {
    this.Type = ERecalcPageType.Y;
    this.Y = Y;
};
var paralineinfo_BreakPage = 1;
var paralineinfo_Empty = 2;
var paralineinfo_End = 4;
var paralineinfo_RangeY = 8;
function CParaLine() {
    this.Y = 0;
    this.Top = 0;
    this.Bottom = 0;
    this.Metrics = new CParaLineMetrics();
    this.Ranges = [];
    this.Info = 0;
}
CParaLine.prototype = {
    Add_Range: function (X, XEnd) {
        this.Ranges.push(new CParaLineRange(X, XEnd));
    },
    Shift: function (Dx, Dy) {
        for (var CurRange = 0, RangesCount = this.Ranges.length; CurRange < RangesCount; CurRange++) {
            this.Ranges[CurRange].Shift(Dx, Dy);
        }
    },
    Get_StartPos: function () {
        return this.Ranges[0].StartPos;
    },
    Get_EndPos: function () {
        return this.Ranges[this.Ranges.length - 1].EndPos;
    },
    Set_RangeStartPos: function (CurRange, StartPos) {
        this.Ranges[CurRange].StartPos = StartPos;
    },
    Set_RangeEndPos: function (CurRange, EndPos) {
        this.Ranges[CurRange].EndPos = EndPos;
    },
    Copy: function () {
        var NewLine = new CParaLine();
        NewLine.Y = this.Y;
        NewLine.Top = this.Top;
        NewLine.Bottom = this.Bottom;
        NewLine.Metrics.Ascent = this.Ascent;
        NewLine.Metrics.Descent = this.Descent;
        NewLine.Metrics.TextAscent = this.TextAscent;
        NewLine.Metrics.TextAscent2 = this.TextAscent2;
        NewLine.Metrics.TextDescent = this.TextDescent;
        NewLine.Metrics.LineGap = this.LineGap;
        for (var CurRange = 0, RangesCount = this.Ranges.length; CurRange < RangesCount; CurRange++) {
            NewLine.Ranges[CurRange] = this.Ranges[CurRange].Copy();
        }
        NewLine.Info = this.Info;
        return NewLine;
    },
    Reset: function () {
        this.Top = 0;
        this.Bottom = 0;
        this.Metrics = new CParaLineMetrics();
        this.Ranges = [];
        this.Info = 0;
    }
};
function CParaLineMetrics() {
    this.Ascent = 0;
    this.Descent = 0;
    this.TextAscent = 0;
    this.TextAscent2 = 0;
    this.TextDescent = 0;
    this.LineGap = 0;
}
CParaLineMetrics.prototype = {
    Update: function (TextAscent, TextAscent2, TextDescent, Ascent, Descent, ParaPr) {
        if (TextAscent > this.TextAscent) {
            this.TextAscent = TextAscent;
        }
        if (TextAscent2 > this.TextAscent2) {
            this.TextAscent2 = TextAscent2;
        }
        if (TextDescent > this.TextDescent) {
            this.TextDescent = TextDescent;
        }
        if (Ascent > this.Ascent) {
            this.Ascent = Ascent;
        }
        if (Descent > this.Descent) {
            this.Descent = Descent;
        }
        if (this.Ascent < this.TextAscent) {
            this.Ascent = this.TextAscent;
        }
        if (this.Descent < this.TextDescent) {
            this.Descent = this.TextDescent;
        }
        this.LineGap = this.Recalculate_LineGap(ParaPr, this.TextAscent, this.TextDescent);
        if (linerule_AtLeast === ParaPr.Spacing.LineRule && (this.Ascent + this.Descent + this.LineGap) > (this.TextAscent + this.TextDescent)) {
            this.Ascent = this.Ascent + this.LineGap;
            this.LineGap = 0;
        }
    },
    Recalculate_LineGap: function (ParaPr, TextAscent, TextDescent) {
        var LineGap = 0;
        switch (ParaPr.Spacing.LineRule) {
        case linerule_Auto:
            LineGap = (TextAscent + TextDescent) * (ParaPr.Spacing.Line - 1);
            break;
        case linerule_Exact:
            var ExactValue = Math.max(25.4 / 72, ParaPr.Spacing.Line);
            LineGap = ExactValue - (TextAscent + TextDescent);
            var Gap = this.Ascent + this.Descent - ExactValue;
            if (Gap > 0) {
                var DescentDiff = this.Descent - this.TextDescent;
                if (DescentDiff > 0) {
                    if (DescentDiff < Gap) {
                        this.Descent = this.TextDescent;
                        Gap -= DescentDiff;
                    } else {
                        this.Descent -= Gap;
                        Gap = 0;
                    }
                }
                var AscentDiff = this.Ascent - this.TextAscent;
                if (AscentDiff > 0) {
                    if (AscentDiff < Gap) {
                        this.Ascent = this.TextAscent;
                        Gap -= AscentDiff;
                    } else {
                        this.Ascent -= Gap;
                        Gap = 0;
                    }
                }
                if (Gap > 0) {
                    var OldTA = this.TextAscent;
                    var OldTD = this.TextDescent;
                    var Sum = OldTA + OldTD;
                    this.Ascent = OldTA * (Sum - Gap) / Sum;
                    this.Descent = OldTD * (Sum - Gap) / Sum;
                }
            } else {
                this.Ascent -= Gap;
            }
            LineGap = 0;
            break;
        case linerule_AtLeast:
            var LineGap1 = ParaPr.Spacing.Line;
            var LineGap2 = TextAscent + TextDescent;
            if (Math.abs(LineGap2) < 0.001) {
                LineGap = 0;
            } else {
                LineGap = Math.max(LineGap1, LineGap2) - (TextAscent + TextDescent);
            }
            break;
        }
        return LineGap;
    }
};
function CParaLineRange(X, XEnd) {
    this.X = X;
    this.XVisible = 0;
    this.XEnd = XEnd;
    this.StartPos = 0;
    this.EndPos = 0;
    this.W = 0;
    this.Spaces = 0;
}
CParaLineRange.prototype = {
    Shift: function (Dx, Dy) {
        this.X += Dx;
        this.XEnd += Dx;
        this.XVisible += Dx;
    },
    Copy: function () {
        var NewRange = new CParaLineRange();
        NewRange.X = this.X;
        NewRange.XVisible = this.XVisible;
        NewRange.XEnd = this.XEnd;
        NewRange.StartPos = this.StartPos;
        NewRange.EndPos = this.EndPos;
        NewRange.W = this.W;
        NewRange.Spaces = this.Spaces;
        return NewRange;
    }
};
function CParaPage(X, Y, XLimit, YLimit, FirstLine) {
    this.X = X;
    this.Y = Y;
    this.XLimit = XLimit;
    this.YLimit = YLimit;
    this.FirstLine = FirstLine;
    this.Bounds = new CDocumentBounds(X, Y, XLimit, Y);
    this.StartLine = FirstLine;
    this.EndLine = FirstLine;
    this.TextPr = null;
    this.Drawings = [];
    this.EndInfo = new CParagraphPageEndInfo();
}
CParaPage.prototype = {
    Reset: function (X, Y, XLimit, YLimit, FirstLine) {
        this.X = X;
        this.Y = Y;
        this.XLimit = XLimit;
        this.YLimit = YLimit;
        this.FirstLine = FirstLine;
        this.Bounds = new CDocumentBounds(X, Y, XLimit, Y);
        this.StartLine = FirstLine;
        this.Drawings = [];
    },
    Shift: function (Dx, Dy) {
        this.X += Dx;
        this.Y += Dy;
        this.XLimit += Dx;
        this.YLimit += Dy;
        this.Bounds.Shift(Dx, Dy);
    },
    Set_EndLine: function (EndLine) {
        this.EndLine = EndLine;
    },
    Add_Drawing: function (Item) {
        this.Drawings.push(Item);
    },
    Copy: function () {
        var NewPage = new CParaPage();
        NewPage.X = this.X;
        NewPage.Y = this.Y;
        NewPage.XLimit = this.XLimit;
        NewPage.YLimit = this.YLimit;
        NewPage.FirstLine = this.FirstLine;
        NewPage.Bounds.Left = this.Bounds.Left;
        NewPage.Bounds.Right = this.Bounds.Right;
        NewPage.Bounds.Top = this.Bounds.Top;
        NewPage.Bounds.Bottom = this.Bounds.Bottom;
        NewPage.StartLine = this.StartLine;
        NewPage.EndLine = this.EndLine;
        var Count = this.Drawings.length;
        for (var Index = 0; Index < Count; Index++) {
            NewPage.Drawings.push(this.Drawings[Index]);
        }
        NewPage.EndInfo = this.EndInfo.Copy();
        return NewPage;
    }
};
function CParagraphRecalculateTabInfo() {
    this.TabPos = 0;
    this.X = 0;
    this.Value = -1;
    this.Item = null;
}
CParagraphRecalculateTabInfo.prototype = {
    Reset: function () {
        this.TabPos = 0;
        this.X = 0;
        this.Value = -1;
        this.Item = null;
    }
};
function CParagraphRecalculateStateWrap(Para) {
    this.Paragraph = Para;
    this.Page = 0;
    this.Line = 0;
    this.Range = 0;
    this.Ranges = [];
    this.RangesCount = 0;
    this.FirstItemOnLine = true;
    this.EmptyLine = true;
    this.StartWord = false;
    this.Word = false;
    this.AddNumbering = true;
    this.BreakPageLine = false;
    this.UseFirstLine = false;
    this.BreakPageLineEmpty = false;
    this.ExtendBoundToBottom = false;
    this.WordLen = 0;
    this.SpaceLen = 0;
    this.SpacesCount = 0;
    this.LastTab = new CParagraphRecalculateTabInfo();
    this.LineTextAscent = 0;
    this.LineTextDescent = 0;
    this.LineTextAscent2 = 0;
    this.LineAscent = 0;
    this.LineDescent = 0;
    this.LineTop = 0;
    this.LineBottom = 0;
    this.LineTop2 = 0;
    this.LineBottom2 = 0;
    this.LinePrevBottom = 0;
    this.X = 0;
    this.XEnd = 0;
    this.Y = 0;
    this.XStart = 0;
    this.YStart = 0;
    this.XLimit = 0;
    this.YLimit = 0;
    this.NewPage = false;
    this.NewRange = false;
    this.End = false;
    this.RangeY = false;
    this.CurPos = new CParagraphContentPos();
    this.NumberingPos = new CParagraphContentPos();
    this.MoveToLBP = false;
    this.LineBreakPos = new CParagraphContentPos();
    this.PageBreak = null;
    this.SkipPageBreak = false;
    this.RunRecalcInfoLast = null;
    this.RunRecalcInfoBreak = null;
    this.BaseLineOffset = 0;
    this.RecalcResult = 0;
}
CParagraphRecalculateStateWrap.prototype = {
    Reset_Line: function () {
        this.RecalcResult = recalcresult_NextLine;
        this.EmptyLine = true;
        this.BreakPageLine = false;
        this.End = false;
        this.UseFirstLine = false;
        this.LineTextAscent = 0;
        this.LineTextAscent2 = 0;
        this.LineTextDescent = 0;
        this.LineAscent = 0;
        this.LineDescent = 0;
        this.NewPage = false;
        this.ForceNewPage = false;
    },
    Reset_Range: function (X, XEnd) {
        this.LastTab.Reset();
        this.SpaceLen = 0;
        this.WordLen = 0;
        this.SpacesCount = 0;
        this.Word = false;
        this.FirstItemOnLine = true;
        this.StartWord = false;
        this.NewRange = false;
        this.X = X;
        this.XEnd = XEnd;
        this.MoveToLBP = false;
        this.LineBreakPos = new CParagraphContentPos();
    },
    Set_LineBreakPos: function (PosObj) {
        this.LineBreakPos.Set(this.CurPos);
        this.LineBreakPos.Add(PosObj);
    },
    Set_NumberingPos: function (PosObj, Item) {
        this.NumberingPos.Set(this.CurPos);
        this.NumberingPos.Add(PosObj);
        this.Paragraph.Numbering.Pos = this.NumberingPos;
        this.Paragraph.Numbering.Item = Item;
    },
    Update_CurPos: function (PosObj, Depth) {
        this.CurPos.Update(PosObj, Depth);
    },
    Reset_Ranges: function () {
        this.Ranges = [];
        this.RangesCount = 0;
    },
    Reset_PageBreak: function () {
        this.PageBreak = null;
        this.SkipPageBreak = false;
        this.ExtendBoundToBottom = false;
    },
    Reset_RunRecalcInfo: function () {
        this.RunRecalcInfoBreak = this.RunRecalcInfoLast;
    },
    Restore_RunRecalcInfo: function () {
        this.RunRecalcInfoLast = this.RunRecalcInfoBreak;
    }
};
function CParagraphRecalculateStateCounter() {
    this.Paragraph = undefined;
    this.Range = undefined;
    this.Word = false;
    this.SpaceLen = 0;
    this.SpacesCount = 0;
    this.Words = 0;
    this.Spaces = 0;
    this.Letters = 0;
    this.SpacesSkip = 0;
    this.LettersSkip = 0;
}
CParagraphRecalculateStateCounter.prototype = {
    Reset: function (Paragraph, Range) {
        this.Paragraph = Paragraph;
        this.Range = Range;
        this.Word = false;
        this.SpaceLen = 0;
        this.SpacesCount = 0;
        this.Words = 0;
        this.Spaces = 0;
        this.Letters = 0;
        this.SpacesSkip = 0;
        this.LettersSkip = 0;
    }
};
function CParagraphRecalculateStateAlign() {
    this.X = 0;
    this.Y = 0;
    this.XEnd = 0;
    this.JustifyWord = 0;
    this.JustifySpace = 0;
    this.SpacesCounter = 0;
    this.SpacesSkip = 0;
    this.LettersSkip = 0;
    this.LastW = 0;
    this.Paragraph = undefined;
    this.RecalcResult = 0;
    this.CurPage = 0;
    this.PageY = 0;
    this.RecalcFast = false;
    this.RecalcFast2 = false;
}
function CParagraphRecalculateStateInfo() {
    this.Comments = [];
}
CParagraphRecalculateStateInfo.prototype = {
    Reset: function (PrevInfo) {
        if (null !== PrevInfo && undefined !== PrevInfo) {
            this.Comments = PrevInfo.Comments;
        } else {
            this.Comments = [];
        }
    },
    Add_Comment: function (Id) {
        this.Comments.push(Id);
    },
    Remove_Comment: function (Id) {
        var CommentsLen = this.Comments.length;
        for (var CurPos = 0; CurPos < CommentsLen; CurPos++) {
            if (this.Comments[CurPos] === Id) {
                this.Comments.splice(CurPos, 1);
                break;
            }
        }
    }
};
function CParagraphRecalculateObject() {
    this.X = 0;
    this.Y = 0;
    this.XLimit = 0;
    this.YLimit = 0;
    this.Pages = [];
    this.Lines = [];
    this.Content = [];
}
CParagraphRecalculateObject.prototype = {
    Save: function (Para) {
        this.X = Para.X;
        this.Y = Para.Y;
        this.XLimit = Para.XLimit;
        this.YLimit = Para.YLimit;
        this.Pages = Para.Pages;
        this.Lines = Para.Lines;
        var Content = Para.Content;
        var Count = Content.length;
        for (var Index = 0; Index < Count; Index++) {
            this.Content[Index] = Content[Index].Save_RecalculateObject();
        }
    },
    Load: function (Para) {
        Para.X = this.X;
        Para.Y = this.Y;
        Para.XLimit = this.XLimit;
        Para.YLimit = this.YLimit;
        Para.Pages = this.Pages;
        Para.Lines = this.Lines;
        var Count = Para.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            Para.Content[Index].Load_RecalculateObject(this.Content[Index], Para);
        }
    },
    Get_DrawingFlowPos: function (FlowPos) {
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            this.Content[Index].Get_DrawingFlowPos(FlowPos);
        }
    }
};