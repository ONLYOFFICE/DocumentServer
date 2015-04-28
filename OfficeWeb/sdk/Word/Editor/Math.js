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
var g_dMathArgSizeKoeff_1 = 0.76;
var g_dMathArgSizeKoeff_2 = 0.76 * 0.855;
var g_oMathSettings = {};
function MathMenu(type) {
    this.Type = para_Math;
    this.Menu = type;
}
MathMenu.prototype = {
    Get_Type: function () {
        return this.Type;
    }
};
function ParaMath() {
    ParaMath.superclass.constructor.call(this);
    this.Id = g_oIdCounter.Get_NewId();
    this.Type = para_Math;
    this.Jc = undefined;
    this.Root = new CMathContent();
    this.Root.bRoot = true;
    this.Root.ParentElement = this;
    this.X = 0;
    this.Y = 0;
    this.ParaMathRPI = new CMathRecalculateInfo();
    this.bSelectionUse = false;
    this.Paragraph = null;
    this.NearPosArray = [];
    this.Width = 0;
    this.WidthVisible = 0;
    this.Height = 0;
    this.Ascent = 0;
    this.Descent = 0;
    this.DefaultTextPr = new CTextPr();
    this.DefaultTextPr.FontFamily = {
        Name: "Cambria Math",
        Index: -1
    };
    this.DefaultTextPr.RFonts.Set_All("Cambria Math", -1);
    g_oTableId.Add(this, this.Id);
}
Asc.extendClass(ParaMath, CParagraphContentWithContentBase);
ParaMath.prototype.Get_Type = function () {
    return this.Type;
};
ParaMath.prototype.Get_Id = function () {
    return this.Id;
};
ParaMath.prototype.Copy = function (Selected) {
    var NewMath = new ParaMath();
    NewMath.Root.bRoot = true;
    if (Selected) {
        var result = this.GetSelectContent();
        result.Content.CopyTo(NewMath.Root, Selected);
    } else {
        this.Root.CopyTo(NewMath.Root, Selected);
    }
    NewMath.SetNeedResize();
    NewMath.Root.Correct_Content(true);
    return NewMath;
};
ParaMath.prototype.Set_Paragraph = function (Paragraph) {
    this.Paragraph = Paragraph;
};
ParaMath.prototype.Get_Text = function (Text) {
    Text.Text = null;
};
ParaMath.prototype.Is_Empty = function () {
    if (this.Root.Content.length <= 0) {
        return true;
    }
    if (1 === this.Root.Content.length) {
        return this.Root.Content[0].Is_Empty({
            SkipPlcHldr: true
        });
    }
    return false;
};
ParaMath.prototype.Is_CheckingNearestPos = function () {
    return this.Root.Is_CheckingNearestPos();
};
ParaMath.prototype.Is_StartFromNewLine = function () {
    return false;
};
ParaMath.prototype.Get_TextPr = function (_ContentPos, Depth) {
    var TextPr = new CTextPr();
    var mTextPr = this.Root.Get_TextPr(_ContentPos, Depth);
    TextPr.Merge(mTextPr);
    return TextPr;
};
ParaMath.prototype.Get_CompiledTextPr = function (Copy) {
    var oContent = this.GetSelectContent();
    var mTextPr = oContent.Content.Get_CompiledTextPr(Copy);
    return mTextPr;
};
ParaMath.prototype.Add = function (Item) {
    this.ParaMathRPI.NeedResize = true;
    var Type = Item.Type;
    var oSelectedContent = this.GetSelectContent();
    var oContent = oSelectedContent.Content;
    var StartPos = oSelectedContent.Start;
    var Run = oContent.Content[StartPos];
    if (para_Math_Run !== Run.Type) {
        return;
    }
    var NewElement = null;
    if (para_Text === Type) {
        if (oContent.bRoot == false && Run.IsPlaceholder()) {
            var ctrPrp = oContent.Parent.Get_CtrPrp();
            Run.Apply_TextPr(ctrPrp, undefined, true);
        }
        if (Item.Value == 38) {
            NewElement = new CMathAmp();
            Run.Add(NewElement, true);
        } else {
            NewElement = new CMathText(false);
            NewElement.add(Item.Value);
            Run.Add(NewElement, true);
        }
    } else {
        if (para_Space === Type) {
            NewElement = new CMathText(false);
            NewElement.addTxt(" ");
            Run.Add(NewElement, true);
        } else {
            if (para_Math === Type) {
                var ContentPos = new CParagraphContentPos();
                if (this.bSelectionUse == true) {
                    this.Get_ParaContentPos(true, true, ContentPos);
                } else {
                    this.Get_ParaContentPos(false, false, ContentPos);
                }
                var TextPr = this.Root.GetMathTextPrForMenu(ContentPos, 0);
                var RightRun = Run.Split2(Run.State.ContentPos);
                oContent.Internal_Content_Add(StartPos + 1, RightRun, false);
                oContent.CurPos = StartPos + 1;
                RightRun.Cursor_MoveToStartPos();
                var lng = oContent.Content.length;
                oContent.Load_FromMenu(Item.Menu, this.Paragraph);
                var lng2 = oContent.Content.length;
                var Pos_ApplyTextPr = {
                    StartPos: StartPos + 1,
                    EndPos: StartPos + lng2 - lng
                };
                TextPr.RFonts.Set_All("Cambria Math", -1);
                oContent.Apply_TextPr(TextPr, undefined, false, Pos_ApplyTextPr);
            }
        }
    }
    if ((para_Text === Type || para_Space === Type) && null !== NewElement) {
        oContent.Process_AutoCorrect(NewElement);
    }
    oContent.Correct_Content(true);
};
ParaMath.prototype.Remove = function (Direction, bOnAddText) {
    this.ParaMathRPI.NeedResize = true;
    var oSelectedContent = this.GetSelectContent();
    var nStartPos = oSelectedContent.Start;
    var nEndPos = oSelectedContent.End;
    var oContent = oSelectedContent.Content;
    if (nStartPos === nEndPos) {
        var oElement = oContent.getElem(nStartPos);
        if (para_Math_Run === oElement.Type) {
            if ((true === oElement.IsPlaceholder()) || (false === oElement.Remove(Direction) && true !== this.bSelectionUse)) {
                if ((Direction > 0 && oContent.Content.length - 1 === nStartPos) || (Direction < 0 && 0 === nStartPos)) {
                    if (oContent.bRoot) {
                        return false;
                    }
                    oContent.ParentElement.Select_WholeElement();
                    return true;
                }
                if (Direction > 0) {
                    var oNextElement = oContent.getElem(nStartPos + 1);
                    if (para_Math_Run === oNextElement.Type) {
                        oNextElement.Cursor_MoveToStartPos();
                        oNextElement.Remove(1);
                        if (oNextElement.Is_Empty()) {
                            oContent.Correct_Content();
                            oContent.Correct_ContentPos(1);
                        }
                        this.Selection_Remove();
                    } else {
                        oContent.Select_ElementByPos(nStartPos + 1, true);
                    }
                } else {
                    var oPrevElement = oContent.getElem(nStartPos - 1);
                    if (para_Math_Run === oPrevElement.Type) {
                        oPrevElement.Cursor_MoveToEndPos();
                        oPrevElement.Remove(-1);
                        if (oPrevElement.Is_Empty()) {
                            oContent.Correct_Content();
                            oContent.Correct_ContentPos(-1);
                        }
                        this.Selection_Remove();
                    } else {
                        oContent.Select_ElementByPos(nStartPos - 1, true);
                    }
                }
            } else {
                if (oElement.Is_Empty()) {
                    oContent.CurPos = nStartPos;
                    oContent.Correct_Content();
                    oContent.Correct_ContentPos(-1);
                }
                this.Selection_Remove();
            }
            return true;
        } else {
            oContent.Remove_FromContent(nStartPos, 1);
            oContent.CurPos = nStartPos;
            if (para_Math_Run === oContent.Content[nStartPos].Type) {
                oContent.Content[nStartPos].Cursor_MoveToStartPos();
            }
            oContent.Correct_Content();
            oContent.Correct_ContentPos(-1);
            this.Selection_Remove();
        }
    } else {
        if (nStartPos > nEndPos) {
            var nTemp = nEndPos;
            nEndPos = nStartPos;
            nStartPos = nTemp;
        }
        var oStartElement = oContent.getElem(nStartPos);
        var oEndElement = oContent.getElem(nEndPos);
        if (para_Math_Run === oEndElement.Type) {
            oEndElement.Remove(Direction);
        } else {
            oContent.Remove_FromContent(nEndPos, 1);
        }
        oContent.Remove_FromContent(nStartPos + 1, nEndPos - nStartPos - 1);
        if (para_Math_Run === oStartElement.Type) {
            oStartElement.Remove(Direction);
        } else {
            oContent.Remove_FromContent(nStartPos, 1);
        }
        oContent.CurPos = nStartPos;
        oContent.Correct_Content();
        oContent.Correct_ContentPos(Direction);
        this.Selection_Remove();
    }
};
ParaMath.prototype.GetSelectContent = function () {
    return this.Root.GetSelectContent();
};
ParaMath.prototype.Get_CurrentParaPos = function () {
    var nLinesCount = this.protected_GetLinesCount();
    for (var nLineIndex = 0; nLineIndex < nLinesCount; nLineIndex++) {
        var nRangesCount = this.protected_GetRangesCount(nLineIndex);
        for (var nRangeIndex = 0; nRangeIndex < nRangesCount; nRangeIndex++) {
            var nEndPos = this.protected_GetRangeEndPos(nLineIndex, nRangeIndex);
            if (nEndPos > 0) {
                return new CParaPos(0 === nLineIndex ? this.StartRange + nRangeIndex : nRangeIndex, this.StartLine + nLineIndex, 0, 0);
            }
        }
    }
    return new CParaPos(this.StartRange, this.StartLine, 0, 0);
};
ParaMath.prototype.Apply_TextPr = function (TextPr, IncFontSize, ApplyToAll) {
    this.ParaMathRPI.NeedResize = true;
    if (ApplyToAll == true) {
        this.Root.Apply_TextPr(TextPr, IncFontSize, true);
    } else {
        var content = this.GetSelectContent().Content;
        var NewTextPr = new CTextPr();
        var bSetInRoot = false;
        if (IncFontSize == undefined) {
            if (TextPr.Underline !== undefined) {
                NewTextPr.Underline = TextPr.Underline;
                bSetInRoot = true;
            }
            if (TextPr.FontSize !== undefined && content.IsNormalTextInRuns() == false) {
                NewTextPr.FontSize = TextPr.FontSize;
                bSetInRoot = true;
            }
            content.Apply_TextPr(TextPr, IncFontSize, ApplyToAll);
            if (bSetInRoot) {
                this.Root.Apply_TextPr(NewTextPr, IncFontSize, true);
            }
        } else {
            if (content.IsNormalTextInRuns() == false) {
                this.Root.Apply_TextPr(TextPr, IncFontSize, true);
            } else {
                content.Apply_TextPr(TextPr, IncFontSize, ApplyToAll);
            }
        }
    }
};
ParaMath.prototype.Clear_TextPr = function () {};
ParaMath.prototype.Check_NearestPos = function (ParaNearPos, Depth) {
    this.Root.Check_NearestPos(ParaNearPos, Depth);
};
ParaMath.prototype.Get_DrawingObjectRun = function (Id) {
    return null;
};
ParaMath.prototype.Get_DrawingObjectContentPos = function (Id, ContentPos, Depth) {
    return false;
};
ParaMath.prototype.Get_Layout = function (DrawingLayout, UseContentPos, ContentPos, Depth) {
    if (true === UseContentPos) {
        DrawingLayout.Layout = true;
    } else {
        DrawingLayout.X += this.Width;
    }
};
ParaMath.prototype.Get_NextRunElements = function (RunElements, UseContentPos, Depth) {};
ParaMath.prototype.Get_PrevRunElements = function (RunElements, UseContentPos, Depth) {};
ParaMath.prototype.Collect_DocumentStatistics = function (ParaStats) {};
ParaMath.prototype.Create_FontMap = function (Map) {
    this.Root.Create_FontMap(Map);
};
ParaMath.prototype.Get_AllFontNames = function (AllFonts) {
    AllFonts["Cambria Math"] = true;
    this.Root.Get_AllFontNames(AllFonts);
};
ParaMath.prototype.Get_SelectedElementsInfo = function (Info) {
    Info.Set_Math(this);
};
ParaMath.prototype.Get_SelectedText = function (bAll, bClearText) {
    if (true === bAll || true === this.Selection_IsUse()) {
        if (true === bClearText) {
            return null;
        }
        return "";
    }
    return "";
};
ParaMath.prototype.Get_SelectionDirection = function () {
    return this.Root.Get_SelectionDirection();
};
ParaMath.prototype.Clear_TextFormatting = function (DefHyper) {};
ParaMath.prototype.Can_AddDropCap = function () {
    return false;
};
ParaMath.prototype.Get_TextForDropCap = function (DropCapText, UseContentPos, ContentPos, Depth) {
    if (true === DropCapText.Check) {
        DropCapText.Mixed = true;
    }
};
ParaMath.prototype.Get_StartTabsCount = function (TabsCounter) {
    return false;
};
ParaMath.prototype.Remove_StartTabs = function (TabsCounter) {
    return false;
};
ParaMath.prototype.Add_ToContent = function (Pos, Item, UpdatePosition) {};
ParaMath.prototype.Recalculate_Range = function (PRS, ParaPr, Depth) {
    if (this.Paragraph !== PRS.Paragraph) {
        this.Paragraph = PRS.Paragraph;
        this.protected_UpdateSpellChecking();
    }
    var CurLine = PRS.Line - this.StartLine;
    var CurRange = (0 === CurLine ? PRS.Range - this.StartRange : PRS.Range);
    var Para = PRS.Paragraph;
    var ParaLine = PRS.Line;
    var ParaRange = PRS.Range;
    var RPI = new CRPI();
    RPI.MergeMathInfo(this.ParaMathRPI);
    RPI.PRS = PRS;
    var ArgSize = new CMathArgSize();
    if (PRS.NewRange == false) {
        this.Root.Recalculate_Reset(PRS.Range, PRS.Line);
    }
    if (RPI.NeedResize) {
        this.Root.Set_Paragraph(Para);
        this.Root.Set_ParaMath(this, null);
        this.Root.PreRecalc(null, this, ArgSize, RPI);
        this.Root.Resize(g_oTextMeasurer, RPI);
        var pos = new CMathPosition();
        pos.x = 0;
        pos.y = 0;
        this.Root.setPosition(pos);
    } else {
        this.Root.Resize_2(g_oTextMeasurer, null, this, RPI, ArgSize);
    }
    this.ParaMathRPI.ClearRecalculate();
    var OldLineTextAscent = PRS.LineTextAscent;
    var OldLineTextAscent2 = PRS.LineTextAscent2;
    var OldLineTextDescent = PRS.LineTextDescent;
    this.Width = this.Root.size.width;
    this.Height = this.Root.size.height;
    this.WidthVisible = this.Root.size.width;
    this.Ascent = this.Root.size.ascent;
    this.Descent = this.Root.size.height - this.Root.size.ascent;
    var RangeStartPos = this.protected_AddRange(CurLine, CurRange);
    var RangeEndPos = 0;
    PRS.StartWord = true;
    var LetterLen = this.Width;
    if (true !== PRS.Word) {
        if (true !== PRS.FirstItemOnLine || false === Para.Internal_Check_Ranges(ParaLine, ParaRange)) {
            if (PRS.X + PRS.SpaceLen + LetterLen > PRS.XEnd) {
                PRS.NewRange = true;
            }
        }
        if (true !== PRS.NewRange) {
            PRS.Set_LineBreakPos(0);
            PRS.WordLen = this.Width;
            PRS.Word = true;
        }
    } else {
        if (PRS.X + PRS.SpaceLen + PRS.WordLen + LetterLen > PRS.XEnd) {
            if (true === PRS.FirstItemOnLine) {
                if (false === Para.Internal_Check_Ranges(ParaLine, ParaRange)) {
                    PRS.MoveToLBP = true;
                    PRS.NewRange = true;
                } else {
                    PRS.EmptyLine = false;
                    PRS.NewRange = true;
                }
            } else {
                PRS.MoveToLBP = true;
                PRS.NewRange = true;
            }
        }
        if (true !== PRS.NewRange) {
            PRS.WordLen += LetterLen;
        }
    }
    if (true !== PRS.NewRange) {
        RangeEndPos = this.Root.Content.length;
        if (PRS.LineAscent < this.Ascent) {
            PRS.LineAscent = this.Ascent;
        }
        if (PRS.LineDescent < this.Descent) {
            PRS.LineDescent = this.Descent;
        }
    } else {
        PRS.LineTextAscent = OldLineTextAscent;
        PRS.LineTextAscent2 = OldLineTextAscent2;
        PRS.LineTextDescent = OldLineTextDescent;
    }
    this.protected_FillRange(CurLine, CurRange, RangeStartPos, RangeEndPos);
};
ParaMath.prototype.Recalculate_Set_RangeEndPos = function (PRS, PRP, Depth) {
    var CurLine = PRS.Line - this.StartLine;
    var CurRange = (0 === CurLine ? PRS.Range - this.StartRange : PRS.Range);
    var CurPos = PRP.Get(Depth);
    this.protected_FillRangeEndPos(CurLine, CurRange, CurPos);
};
ParaMath.prototype.Recalculate_Range_Width = function (PRSC, _CurLine, _CurRange) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    if (EndPos >= 1) {
        PRSC.Letters++;
        if (true !== PRSC.Word) {
            PRSC.Word = true;
            PRSC.Words++;
        }
        PRSC.Range.W += this.Width;
        PRSC.Range.W += PRSC.SpaceLen;
        PRSC.SpaceLen = 0;
        if (PRSC.Words > 1) {
            PRSC.Spaces += PRSC.SpacesCount;
        } else {
            PRSC.SpacesSkip += PRSC.SpacesCount;
        }
        PRSC.SpacesCount = 0;
    }
};
ParaMath.prototype.Recalculate_Range_Spaces = function (PRSA, _CurLine, _CurRange, _CurPage) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    if (EndPos >= 1) {
        if (0 !== PRSA.LettersSkip) {
            this.WidthVisible = this.Width;
            PRSA.LettersSkip--;
        } else {
            this.WidthVisible = this.Width + PRSA.JustifyWord;
        }
        this.X = PRSA.X;
        this.Y = PRSA.Y - this.Root.size.ascent;
        PRSA.X += this.WidthVisible;
        PRSA.LastW = this.WidthVisible;
    }
};
ParaMath.prototype.Recalculate_PageEndInfo = function (PRSI, _CurLine, _CurRange) {};
ParaMath.prototype.Save_RecalculateObject = function (Copy) {
    var RecalcObj = new CRunRecalculateObject(this.StartLine, this.StartRange);
    RecalcObj.Save_Lines(this, Copy);
    return RecalcObj;
};
ParaMath.prototype.Load_RecalculateObject = function (RecalcObj) {
    RecalcObj.Load_Lines(this);
};
ParaMath.prototype.Prepare_RecalculateObject = function () {
    this.protected_ClearLines();
};
ParaMath.prototype.Is_EmptyRange = function (_CurLine, _CurRange) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    if (EndPos >= 1) {
        return false;
    }
    return true;
};
ParaMath.prototype.Check_Range_OnlyMath = function (Checker, CurRange, CurLine) {
    if (null !== Checker.Math) {
        Checker.Math = null;
        Checker.Result = false;
    } else {
        Checker.Math = this;
    }
};
ParaMath.prototype.Check_MathPara = function (Checker) {
    Checker.Found = true;
    Checker.Result = false;
};
ParaMath.prototype.Check_PageBreak = function () {
    return false;
};
ParaMath.prototype.Check_BreakPageEnd = function (PBChecker) {
    return true;
};
ParaMath.prototype.Get_ParaPosByContentPos = function (ContentPos, Depth) {
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
ParaMath.prototype.Recalculate_CurPos = function (_X, Y, CurrentRun, _CurRange, _CurLine, _CurPage, UpdateCurPos, UpdateTarget, ReturnTarget) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    var result = {
        X: _X + this.Root.size.width
    };
    if (EndPos >= 1 && CurrentRun == true) {
        result = this.Root.Recalculate_CurPos(_X, Y, CurrentRun, _CurRange, _CurLine, _CurPage, UpdateCurPos, UpdateTarget, ReturnTarget);
    }
    return result;
};
ParaMath.prototype.Refresh_RecalcData = function (Data) {
    this.Paragraph.Refresh_RecalcData2(0);
};
ParaMath.prototype.Refresh_RecalcData2 = function (Data) {
    this.Paragraph.Refresh_RecalcData2(0);
};
ParaMath.prototype.Recalculate_MinMaxContentWidth = function (MinMax) {
    if (true === this.NeedResize) {
        var RPI = new CRPI();
        RPI.MergeMathInfo(this.ParaMathRPI);
        RPI.NeedResize = true;
        RPI.PRS = this.Paragraph.m_oPRSW;
        this.Root.PreRecalc(null, this, new CMathArgSize(), RPI);
        this.Root.Resize(g_oTextMeasurer, RPI);
        this.Width = this.Root.size.width;
    }
    if (false === MinMax.bWord) {
        MinMax.bWord = true;
        MinMax.nWordLen = this.Width;
    } else {
        MinMax.nWordLen += this.Width;
    }
    if (MinMax.nSpaceLen > 0) {
        MinMax.nCurMaxWidth += MinMax.nSpaceLen;
        MinMax.nSpaceLen = 0;
    }
    MinMax.nCurMaxWidth += this.Width;
};
ParaMath.prototype.Get_Range_VisibleWidth = function (RangeW, _CurLine, _CurRange) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    if (EndPos >= 1) {
        RangeW.W += this.Width;
    }
};
ParaMath.prototype.Shift_Range = function (Dx, Dy, _CurLine, _CurRange) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    if (EndPos >= 1) {
        this.X += Dx;
        this.Y += Dy;
    }
};
ParaMath.prototype.Set_Inline = function (value) {
    if (value !== this.ParaMathRPI.bInline) {
        this.ParaMathRPI.bChangeInline = true;
        this.ParaMathRPI.NeedResize = true;
        this.ParaMathRPI.bInline = value;
    }
};
ParaMath.prototype.Get_Inline = function () {
    return this.ParaMathRPI.bInline;
};
ParaMath.prototype.Is_Inline = function () {
    return this.ParaMathRPI.bInline;
};
ParaMath.prototype.Get_Align = function () {
    if (undefined !== this.Jc) {
        return this.Jc;
    }
    return align_Center;
};
ParaMath.prototype.Set_Align = function (Align) {
    if (align_Center !== Align && align_Left !== Align && align_Right !== Align) {
        Align = align_Center;
    }
    if (this.Jc !== Align) {
        History.Add(this, new CChangesMathParaJc(Align, this.Jc));
        this.raw_SetAlign(Align);
    }
};
ParaMath.prototype.raw_SetAlign = function (Align) {
    this.Jc = Align;
    this.SetNeedResize();
};
ParaMath.prototype.SetNeedResize = function () {
    this.ParaMathRPI.NeedResize = true;
};
ParaMath.prototype.SetRecalcCtrPrp = function (Class) {
    if (this.Root.Content.length > 0 && this.ParaMathRPI.bRecalcCtrPrp == false) {
        this.ParaMathRPI.bRecalcCtrPrp = this.Root.Content[0] == Class;
    }
};
ParaMath.prototype.MathToImageConverter = function (bCopy, _canvasInput, _widthPx, _heightPx, raster_koef) {
    var bTurnOnId = false,
    bTurnOnHistory = false;
    if (false === g_oTableId.m_bTurnOff) {
        g_oTableId.m_bTurnOff = true;
        bTurnOnId = true;
    }
    if (true === History.Is_On()) {
        bTurnOnHistory = true;
        History.TurnOff();
    }
    var oldDefTabStop = Default_Tab_Stop;
    Default_Tab_Stop = 1;
    var hdr = new CHeaderFooter(editor.WordControl.m_oLogicDocument.HdrFtr, editor.WordControl.m_oLogicDocument, editor.WordControl.m_oDrawingDocument, hdrftr_Header);
    var _dc = hdr.Content;
    var par = new Paragraph(editor.WordControl.m_oDrawingDocument, _dc, 0, 0, 0, 0, false);
    if (bCopy) {
        par.Internal_Content_Add(0, this.Copy(false), false);
    } else {
        par.Internal_Content_Add(0, this, false);
    }
    _dc.Internal_Content_Add(0, par, false);
    par.Set_Align(align_Left);
    par.Set_Tabs(new CParaTabs());
    var _ind = new CParaInd();
    _ind.FirstLine = 0;
    _ind.Left = 0;
    _ind.Right = 0;
    par.Set_Ind(_ind, false);
    var _sp = new CParaSpacing();
    _sp.Line = 1;
    _sp.LineRule = linerule_Auto;
    _sp.Before = 0;
    _sp.BeforeAutoSpacing = false;
    _sp.After = 0;
    _sp.AfterAutoSpacing = false;
    par.Set_Spacing(_sp, false);
    _dc.Reset(0, 0, 10000, 10000);
    _dc.Recalculate_Page(0, true);
    _dc.Reset(0, 0, par.Lines[0].Ranges[0].W + 0.001, 10000);
    _dc.Recalculate_Page(0, true);
    Default_Tab_Stop = oldDefTabStop;
    if (true === bTurnOnId) {
        g_oTableId.m_bTurnOff = false;
    }
    if (true === bTurnOnHistory) {
        History.TurnOn();
    }
    window.IsShapeToImageConverter = true;
    var dKoef = g_dKoef_mm_to_pix;
    var w_mm = this.Width;
    var h_mm = this.Height;
    var w_px = (w_mm * dKoef) >> 0;
    var h_px = (h_mm * dKoef) >> 0;
    if (undefined !== raster_koef) {
        w_px *= raster_koef;
        h_px *= raster_koef;
        if (undefined !== _widthPx) {
            _widthPx *= raster_koef;
        }
        if (undefined !== _heightPx) {
            _heightPx *= raster_koef;
        }
    }
    var _canvas = (_canvasInput === undefined) ? document.createElement("canvas") : _canvasInput;
    _canvas.width = (undefined == _widthPx) ? w_px : _widthPx;
    _canvas.height = (undefined == _heightPx) ? h_px : _heightPx;
    var _ctx = _canvas.getContext("2d");
    var g = new CGraphics();
    g.init(_ctx, w_px, h_px, w_mm, h_mm);
    g.m_oFontManager = g_fontManager;
    g.m_oCoordTransform.tx = 0;
    g.m_oCoordTransform.ty = 0;
    if (_widthPx !== undefined && _heightPx !== undefined) {
        g.m_oCoordTransform.tx = (_widthPx - w_px) / 2;
        g.m_oCoordTransform.ty = (_heightPx - h_px) / 2;
    }
    g.transform(1, 0, 0, 1, 0, 0);
    par.Draw(0, g);
    window.IsShapeToImageConverter = false;
    if (undefined === _canvasInput) {
        var _ret = {
            ImageNative: _canvas,
            ImageUrl: ""
        };
        try {
            _ret.ImageUrl = _canvas.toDataURL("image/png");
        } catch(err) {
            _ret.ImageUrl = "";
        }
        return _ret;
    }
    return null;
};
ParaMath.prototype.GetFirstRPrp = function () {
    return this.Root.getFirstRPrp(this);
};
ParaMath.prototype.GetShiftCenter = function (oMeasure, font) {
    oMeasure.SetFont(font);
    var metrics = oMeasure.Measure2Code(8727);
    return 0.6 * metrics.Height;
};
ParaMath.prototype.GetPlh = function (oMeasure, font) {
    oMeasure.SetFont(font);
    return oMeasure.Measure2Code(11034).Height;
};
ParaMath.prototype.GetA = function (oMeasure, font) {
    oMeasure.SetFont(font);
    return oMeasure.Measure2Code(97).Height;
};
ParaMath.prototype.SetMathProperties = function (props) {
    if (props.naryLim == NARY_UndOvr || props.naryLim == NARY_SubSup) {
        this.MathPr.naryLim = props.naryLim;
    }
    if (props.intLim == NARY_UndOvr || props.intLim == NARY_SubSup) {
        this.MathPr.intLim = props.intLim;
    }
    if (props.brkBin == BREAK_BEFORE || props.brkBin == BREAK_AFTER || props.brkBin == BREAK_REPEAT) {
        this.MathPr.brkBin = props.brkBin;
    }
    if (props.brkSubBin == BREAK_MIN_MIN || props.brkSubBin == BREAK_PLUS_MIN || props.brkSubBin == BREAK_MIN_PLUS) {
        this.MathPr.brkSubBin = props.brkSubBin;
    }
    if (props.smallFrac == true || props.smallFrac == false) {
        this.MathPr.smallFrac = props.smallFrac;
    }
    if (props.wrapIndent + 0 == props.wrapIndent && isNaN(props.wrapIndent)) {
        this.MathPr.wrapIndent = props.wrapIndent / 1440;
    }
    if (props.wrapRight == true || props.wrapRight == false) {
        this.MathPr.wrapRight = props.wrapRight;
    }
    this.MathPr.defJc = props.defJc;
    this.MathPr.dispDef = props.dispDef;
    this.MathPr.lMargin = props.lMargin;
    this.MathPr.rMargin = props.rMargin;
    this.MathPr.mathFont = props.mathFont;
    this.MathPr.interSp = props.interSp;
    this.MathPr.intraSp = intraSp;
    this.MathPr.postSp = props.postSp;
    this.MathPr.preSp = props.preSp;
};
ParaMath.prototype.GetMathPr = function () {
    return this.MathPr;
};
ParaMath.prototype.Get_Default_TPrp = function () {
    return this.DefaultTextPr;
};
ParaMath.prototype.Draw_HighLights = function (PDSH) {
    var CurLine = PDSH.Line - this.StartLine;
    var CurRange = (0 === CurLine ? PDSH.Range - this.StartRange : PDSH.Range);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    var X = PDSH.X;
    var Y0 = PDSH.Y0;
    var Y1 = PDSH.Y1;
    if (EndPos >= 1) {
        var Comm = PDSH.Save_Comm();
        var Coll = PDSH.Save_Coll();
        this.Root.Draw_HighLights(PDSH, false);
        var CommFirst = PDSH.Comm.Get_Next();
        var CollFirst = PDSH.Coll.Get_Next();
        PDSH.Load_Comm(Comm);
        PDSH.Load_Coll(Coll);
        if (null !== CommFirst) {
            var CommentsCount = PDSH.Comments.length;
            var CommentId = (CommentsCount > 0 ? PDSH.Comments[CommentsCount - 1] : null);
            var CommentsFlag = PDSH.CommentsFlag;
            var Bounds = this.Root.Get_Bounds();
            Comm.Add(Bounds.Y, Bounds.Y + Bounds.H, Bounds.X, Bounds.X + Bounds.W, 0, 0, 0, 0, {
                Active: CommentsFlag === comments_ActiveComment ? true : false,
                CommentId: CommentId
            });
        }
        if (null !== CollFirst) {
            var Bounds = this.Root.Get_Bounds();
            Coll.Add(Bounds.Y, Bounds.Y + Bounds.H, Bounds.X, Bounds.X + Bounds.W, 0, CollFirst.r, CollFirst.g, CollFirst.b);
        }
    }
    PDSH.Y0 = Y0;
    PDSH.Y1 = Y1;
};
ParaMath.prototype.Draw_Elements = function (PDSE) {
    var CurLine = PDSE.Line - this.StartLine;
    var CurRange = (0 === CurLine ? PDSE.Range - this.StartRange : PDSE.Range);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    if (EndPos >= 1) {
        PDSE.Y -= this.Ascent;
        this.Root.draw(PDSE.X, PDSE.Y, PDSE.Graphics, PDSE);
        PDSE.Y += this.Ascent;
        PDSE.X += this.Width;
    }
};
ParaMath.prototype.Draw_Lines = function (PDSL) {
    var CurLine = PDSL.Line - this.StartLine;
    var CurRange = (0 === CurLine ? PDSL.Range - this.StartRange : PDSL.Range);
    var StartPos = this.protected_GetRangeStartPos(CurLine, CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    if (EndPos >= 1) {
        var FirstRPrp = this.GetFirstRPrp();
        var Para = PDSL.Paragraph;
        var aUnderline = PDSL.Underline;
        var X = PDSL.X;
        var Y = PDSL.Baseline;
        var UndOff = PDSL.UnderlineOffset;
        var UnderlineY = Y + UndOff;
        var LineW = (FirstRPrp.FontSize / 18) * g_dKoef_pt_to_mm;
        var BgColor = PDSL.BgColor;
        if (undefined !== FirstRPrp.Shd && shd_Nil !== FirstRPrp.Shd.Value) {
            BgColor = FirstRPrp.Shd.Get_Color(Para);
        }
        var AutoColor = (undefined != BgColor && false === BgColor.Check_BlackAutoColor() ? new CDocumentColor(255, 255, 255, false) : new CDocumentColor(0, 0, 0, false));
        var CurColor, RGBA, Theme = this.Paragraph.Get_Theme(),
        ColorMap = this.Paragraph.Get_ColorMap();
        if (true === PDSL.VisitedHyperlink && (undefined === FirstRPrp.Color && undefined === FirstRPrp.Unifill)) {
            CurColor = new CDocumentColor(128, 0, 151);
        } else {
            if (true === FirstRPrp.Color.Auto && !FirstRPrp.Unifill) {
                CurColor = new CDocumentColor(AutoColor.r, AutoColor.g, AutoColor.b);
            } else {
                if (FirstRPrp.Unifill) {
                    FirstRPrp.Unifill.check(Theme, ColorMap);
                    RGBA = FirstRPrp.Unifill.getRGBAColor();
                    CurColor = new CDocumentColor(RGBA.R, RGBA.G, RGBA.B);
                } else {
                    CurColor = new CDocumentColor(FirstRPrp.Color.r, FirstRPrp.Color.g, FirstRPrp.Color.b);
                }
            }
        }
        if (true === FirstRPrp.Underline) {
            aUnderline.Add(UnderlineY, UnderlineY, X, X + this.Width, LineW, CurColor.r, CurColor.g, CurColor.b);
        }
        this.Root.Draw_Lines(PDSL);
        PDSL.X = this.X + this.Width;
    }
};
ParaMath.prototype.Is_CursorPlaceable = function () {
    return true;
};
ParaMath.prototype.Cursor_Is_Start = function () {
    return this.Root.Cursor_Is_Start();
};
ParaMath.prototype.Cursor_Is_NeededCorrectPos = function () {
    return false;
};
ParaMath.prototype.Cursor_Is_End = function () {
    return this.Root.Cursor_Is_End();
};
ParaMath.prototype.Cursor_MoveToStartPos = function () {
    this.Root.Cursor_MoveToStartPos();
};
ParaMath.prototype.Cursor_MoveToEndPos = function (SelectFromEnd) {
    this.Root.Cursor_MoveToEndPos(SelectFromEnd);
};
ParaMath.prototype.Get_ParaContentPosByXY = function (SearchPos, Depth, _CurLine, _CurRange, StepEnd, Flag) {
    var Result = false;
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    if (EndPos >= 1) {
        var Dx = this.Root.size.width;
        var D = SearchPos.X - SearchPos.CurX;
        var CurX = SearchPos.CurX;
        Result = this.Root.Get_ParaContentPosByXY(SearchPos, Depth, _CurLine, _CurRange, StepEnd);
        if (D >= -0.001 && D <= Dx + 0.001) {
            SearchPos.InText = true;
            SearchPos.DiffX = 0.001;
            SearchPos.InTextPos.Copy_FromDepth(SearchPos.Pos, Depth);
        }
        SearchPos.CurX = CurX + Dx;
    }
    return Result;
};
ParaMath.prototype.Get_ParaContentPos = function (bSelection, bStart, ContentPos) {
    this.Root.Get_ParaContentPos(bSelection, bStart, ContentPos);
};
ParaMath.prototype.Set_ParaContentPos = function (ContentPos, Depth) {
    this.Root.Set_ParaContentPos(ContentPos, Depth);
};
ParaMath.prototype.Get_PosByElement = function (Class, ContentPos, Depth, UseRange, Range, Line) {
    if (this === Class) {
        return true;
    }
    return false;
};
ParaMath.prototype.Get_ElementByPos = function (ContentPos, Depth) {
    return this.Root.Get_ElementByPos(ContentPos, Depth);
};
ParaMath.prototype.Get_PosByDrawing = function (Id, ContentPos, Depth) {
    return false;
};
ParaMath.prototype.Get_RunElementByPos = function (ContentPos, Depth) {
    return null;
};
ParaMath.prototype.Get_LastRunInRange = function (_CurLine, _CurRange) {
    return null;
};
ParaMath.prototype.Get_LeftPos = function (SearchPos, ContentPos, Depth, UseContentPos) {
    return this.Root.Get_LeftPos(SearchPos, ContentPos, Depth, UseContentPos, false);
};
ParaMath.prototype.Get_RightPos = function (SearchPos, ContentPos, Depth, UseContentPos, StepEnd) {
    return this.Root.Get_RightPos(SearchPos, ContentPos, Depth, UseContentPos, StepEnd, false);
};
ParaMath.prototype.Get_WordStartPos = function (SearchPos, ContentPos, Depth, UseContentPos) {
    this.Root.Get_WordStartPos(SearchPos, ContentPos, Depth, UseContentPos, false);
};
ParaMath.prototype.Get_WordEndPos = function (SearchPos, ContentPos, Depth, UseContentPos, StepEnd) {
    this.Root.Get_WordEndPos(SearchPos, ContentPos, Depth, UseContentPos, StepEnd, false);
};
ParaMath.prototype.Get_EndRangePos = function (_CurLine, _CurRange, SearchPos, Depth) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    if (EndPos >= 1) {
        this.Root.Get_EndPos(false, SearchPos.Pos, Depth);
        return true;
    }
    return false;
};
ParaMath.prototype.Get_StartRangePos = function (_CurLine, _CurRange, SearchPos, Depth) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    if (EndPos >= 1) {
        this.Root.Get_StartPos(SearchPos.Pos, Depth);
        return true;
    }
    return false;
};
ParaMath.prototype.Get_StartRangePos2 = function (_CurLine, _CurRange, ContentPos, Depth) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    if (EndPos >= 1) {
        return this.Root.Get_StartPos(ContentPos, Depth);
    }
    return false;
};
ParaMath.prototype.Get_StartPos = function (ContentPos, Depth) {
    this.Root.Get_StartPos(ContentPos, Depth);
};
ParaMath.prototype.Get_EndPos = function (BehindEnd, ContentPos, Depth) {
    this.Root.Get_EndPos(BehindEnd, ContentPos, Depth);
};
ParaMath.prototype.Set_SelectionContentPos = function (StartContentPos, EndContentPos, Depth, StartFlag, EndFlag) {
    this.Root.Set_SelectionContentPos(StartContentPos, EndContentPos, Depth, StartFlag, EndFlag);
    this.bSelectionUse = true;
};
ParaMath.prototype.Selection_IsUse = function () {
    return this.bSelectionUse;
};
ParaMath.prototype.Selection_Stop = function () {};
ParaMath.prototype.Selection_Remove = function () {
    this.bSelectionUse = false;
    this.Root.Selection_Remove();
};
ParaMath.prototype.Select_All = function (Direction) {
    this.bSelectionUse = true;
    this.Root.Select_All();
};
ParaMath.prototype.Selection_DrawRange = function (_CurLine, _CurRange, SelectionDraw) {
    var CurLine = _CurLine - this.StartLine;
    var CurRange = (0 === CurLine ? _CurRange - this.StartRange : _CurRange);
    var EndPos = this.protected_GetRangeEndPos(CurLine, CurRange);
    if (EndPos >= 1) {
        if (true === this.bSelectionUse) {
            var oSelectedContent = this.GetSelectContent();
            oSelectedContent.Content.Selection_DrawRange(_CurLine, _CurRange, SelectionDraw);
        } else {
            if (true === SelectionDraw.FindStart) {
                SelectionDraw.StartX += this.Width;
            }
        }
    }
};
ParaMath.prototype.Selection_IsEmpty = function (CheckEnd) {
    return this.Root.Selection_IsEmpty();
};
ParaMath.prototype.Selection_IsPlaceholder = function () {
    var bPlaceholder = false;
    var result = this.GetSelectContent(),
    SelectContent = result.Content;
    var start = result.Start,
    end = result.End;
    if (start == end) {
        bPlaceholder = SelectContent.IsPlaceholder();
    }
    return bPlaceholder;
};
ParaMath.prototype.Selection_CheckParaEnd = function () {
    return false;
};
ParaMath.prototype.Selection_CheckParaContentPos = function (ContentPos, Depth, bStart, bEnd) {
    return this.Root.Selection_CheckParaContentPos(ContentPos, Depth, bStart, bEnd);
};
ParaMath.prototype.Is_SelectedAll = function (Props) {
    return this.Root.Is_SelectedAll(Props);
};
ParaMath.prototype.Selection_CorrectLeftPos = function (Direction) {
    return false;
};
ParaMath.prototype.Undo = function (Data) {
    Data.Undo(this);
};
ParaMath.prototype.Redo = function (Data) {
    Data.Redo(this);
};
ParaMath.prototype.Save_Changes = function (Data, Writer) {
    WriteChanges_ToBinary(Data, Writer);
};
ParaMath.prototype.Load_Changes = function (Reader) {
    ReadChanges_FromBinary(Reader, this);
};
ParaMath.prototype.Write_ToBinary2 = function (Writer) {
    Writer.WriteLong(historyitem_type_Math);
    Writer.WriteString2(this.Id);
    Writer.WriteLong(this.Type);
    Writer.WriteString2(this.Root.Id);
};
ParaMath.prototype.Read_FromBinary2 = function (Reader) {
    this.Id = Reader.GetString2();
    this.Type = Reader.GetLong();
    this.Root = g_oTableId.Get_ById(Reader.GetString2());
    this.Root.bRoot = true;
    this.Root.ParentElement = this;
};
ParaMath.prototype.Get_ContentSelection = function () {
    var oContent = this.GetSelectContent().Content;
    if (oContent.bRoot) {
        return null;
    }
    var X = oContent.pos.x + this.X;
    var Y = oContent.pos.y + this.Y;
    return {
        X: X,
        Y: Y,
        W: oContent.size.width,
        H: oContent.size.height
    };
};
ParaMath.prototype.Recalc_RunsCompiledPr = function () {
    this.Root.Recalc_RunsCompiledPr();
};
ParaMath.prototype.Is_InInnerContent = function () {
    var oContent = this.GetSelectContent().Content;
    if (oContent.bRoot) {
        return false;
    }
    return true;
};
ParaMath.prototype.Handle_AddNewLine = function () {
    var ContentPos = new CParagraphContentPos();
    var CurrContent = this.GetSelectContent().Content;
    if (true === CurrContent.bRoot) {
        return false;
    }
    CurrContent.Get_ParaContentPos(this.bSelectionUse, true, ContentPos);
    var NeedRecalculate = false;
    if (MATH_EQ_ARRAY === CurrContent.ParentElement.kind) {
        var NewContent = CurrContent.Parent.addRow();
        CurrContent.SplitContent(NewContent, ContentPos, 0);
        NewContent.Correct_Content(true);
        CurrContent.Correct_Content(true);
        NewContent.Cursor_MoveToStartPos();
        NeedRecalculate = true;
    } else {
        if (MATH_MATRIX !== CurrContent.ParentElement.kind) {
            var ctrPrp = CurrContent.Parent.CtrPrp.Copy();
            var props = {
                row: 2,
                ctrPrp: ctrPrp
            };
            var EqArray = new CEqArray(props);
            var FirstContent = EqArray.getElementMathContent(0);
            var SecondContent = EqArray.getElementMathContent(1);
            CurrContent.SplitContent(SecondContent, ContentPos, 0);
            CurrContent.CopyTo(FirstContent, false);
            var Run = CurrContent.getElem(0);
            Run.Remove_FromContent(0, Run.Content.length, true);
            CurrContent.Remove_FromContent(1, CurrContent.Content.length);
            CurrContent.Add_ToContent(1, EqArray);
            CurrContent.Correct_Content(true);
            var CurrentContent = new CParagraphContentPos();
            this.Get_ParaContentPos(false, false, CurrentContent);
            var RightContentPos = new CParagraphSearchPos();
            this.Get_RightPos(RightContentPos, CurrentContent, 0, true);
            this.Set_ParaContentPos(RightContentPos.Pos, 0);
            EqArray.CurPos = 1;
            SecondContent.Cursor_MoveToStartPos();
            NeedRecalculate = true;
        }
    }
    if (true === NeedRecalculate) {
        this.SetNeedResize();
    }
    return NeedRecalculate;
};
ParaMath.prototype.Split = function (ContentPos, Depth) {
    var NewParaMath = new ParaMath();
    NewParaMath.Jc = this.Jc;
    this.Root.SplitContent(NewParaMath.Root, ContentPos, Depth);
    return NewParaMath;
};
ParaMath.prototype.Make_AutoCorrect = function () {
    return false;
};
ParaMath.prototype.Get_Bounds = function () {
    if (undefined === this.Paragraph || null === this.Paragraph) {
        return {
            X: this.X,
            Y: this.Y,
            W: this.Width,
            H: this.Height,
            Page: 0
        };
    } else {
        var LinesCount = this.protected_GetLinesCount();
        var CurLine = this.StartLine + LinesCount - 1;
        var CurPage = this.Paragraph.Get_PageByLine(CurLine);
        var Y = this.Paragraph.Pages[CurPage].Y + this.Paragraph.Lines[CurLine].Top;
        var H = this.Paragraph.Lines[CurLine].Bottom - this.Paragraph.Lines[CurLine].Top;
        return {
            X: this.X,
            Y: Y,
            W: this.Width,
            H: H,
            Page: this.Paragraph.Get_StartPage_Absolute() + CurPage
        };
    }
};
ParaMath.prototype.Document_UpdateInterfaceState = function () {
    var SelectedContent = this.GetSelectContent();
    var MathContent = SelectedContent.Content;
    var MathProps = new CMathProp();
    if (MathContent.bRoot) {
        MathProps.Type = c_oAscMathInterfaceType.Common;
        MathProps.Pr = null;
    } else {
        if (undefined !== MathContent.ParentElement && null !== MathContent.ParentElement) {
            MathContent.ParentElement.Document_UpdateInterfaceState(MathProps);
        }
    }
    editor.sync_MathPropCallback(MathProps);
};
ParaMath.prototype.Is_ContentUse = function (MathContent) {
    if (this.Root === MathContent) {
        return true;
    }
    return false;
};
var historyitem_Math_AddItem = 1;
var historyitem_Math_RemoveItem = 2;
var historyitem_Math_CtrPrpFSize = 3;
var historyitem_Math_ParaJc = 4;
var historyitem_Math_CtrPrpShd = 5;
var historyitem_Math_AddItems_ToMathBase = 6;
var historyitem_Math_EqArrayPr = 7;
var historyitem_Math_CtrPrpColor = 8;
var historyitem_Math_CtrPrpUnifill = 9;
var historyitem_Math_CtrPrpUnderline = 10;
var historyitem_Math_CtrPrpStrikeout = 11;
var historyitem_Math_CtrPrpDoubleStrikeout = 12;
var historyitem_Math_CtrPrpItalic = 13;
var historyitem_Math_CtrPrpBold = 14;
var historyitem_Math_RFontsAscii = 15;
var historyitem_Math_RFontsHAnsi = 16;
var historyitem_Math_RFontsCS = 17;
var historyitem_Math_RFontsEastAsia = 18;
var historyitem_Math_RFontsHint = 19;
function ReadChanges_FromBinary(Reader, Class) {
    var Type = Reader.GetLong();
    var Changes = null;
    switch (Type) {
    case historyitem_Math_CtrPrpFSize:
        Changes = new CChangesMathFontSize();
        break;
    case historyitem_Math_ParaJc:
        Changes = new CChangesMathParaJc();
        break;
    case historyitem_Math_CtrPrpShd:
        Changes = new CChangesMathShd();
        break;
    case historyitem_Math_AddItems_ToMathBase:
        Changes = new CChangesMathAddItems();
        break;
    case historyitem_Math_CtrPrpColor:
        Changes = new CChangesMathColor();
        break;
    case historyitem_Math_CtrPrpUnifill:
        Changes = new CChangesMathUnifill();
        break;
    case historyitem_Math_CtrPrpUnderline:
        Changes = new CChangesMathUnderline();
        break;
    case historyitem_Math_CtrPrpStrikeout:
        Changes = new CChangesMathStrikeout();
        break;
    case historyitem_Math_CtrPrpDoubleStrikeout:
        Changes = new CChangesMath_DoubleStrikeout();
        break;
    case historyitem_Math_CtrPrpItalic:
        Changes = new CChangesMathItalic();
        break;
    case historyitem_Math_CtrPrpBold:
        Changes = new CChangesMathBold();
        break;
    case historyitem_Math_RFontsAscii:
        Changes = new CChangesMath_RFontsAscii();
        break;
    case historyitem_Math_RFontsHAnsi:
        Changes = new CChangesMath_RFontsHAnsi();
        break;
    case historyitem_Math_RFontsCS:
        Changes = new CChangesMath_RFontsCS();
        break;
    case historyitem_Math_RFontsEastAsia:
        Changes = new CChangesMath_RFontsEastAsia();
        break;
    case historyitem_Math_RFontsHint:
        Changes = new CChangesMath_RFontsHint();
        break;
    }
    if (null !== Changes) {
        Changes.Load_Changes(Reader, Class);
    }
}
function WriteChanges_ToBinary(Changes, Writer) {
    Writer.WriteLong(Changes.Type);
    Changes.Save_Changes(Writer);
}
function CChangesMathFontSize(NewValue, OldValue) {
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMathFontSize.prototype.Type = historyitem_Math_CtrPrpFSize;
CChangesMathFontSize.prototype.Undo = function (Class) {
    Class.raw_SetFontSize(this.Old);
};
CChangesMathFontSize.prototype.Redo = function (Class) {
    Class.raw_SetFontSize(this.New);
};
CChangesMathFontSize.prototype.Save_Changes = function (Writer) {
    if (undefined === this.New) {
        Writer.WriteBool(true);
    } else {
        Writer.WriteBool(false);
        Writer.WriteLong(this.New);
    }
};
CChangesMathFontSize.prototype.Load_Changes = function (Reader, Class) {
    if (true === Reader.GetBool()) {
        this.New = undefined;
    } else {
        this.New = Reader.GetLong();
    }
    this.Redo(Class);
};
function CChangesMathShd(NewValue, OldValue) {
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMathShd.prototype.Type = historyitem_Math_CtrPrpShd;
CChangesMathShd.prototype.Undo = function (Class) {
    Class.raw_SetShd(this.Old);
};
CChangesMathShd.prototype.Redo = function (Class) {
    Class.raw_SetShd(this.New);
};
CChangesMathShd.prototype.Save_Changes = function (Writer) {
    if (undefined !== this.New) {
        Writer.WriteBool(false);
        this.New.Write_ToBinary(Writer);
    } else {
        Writer.WriteBool(true);
    }
};
CChangesMathShd.prototype.Load_Changes = function (Reader, Class) {
    if (Reader.GetBool() == false) {
        this.New = new CDocumentShd();
        this.New.Read_FromBinary(Reader);
    } else {
        this.New = undefined;
    }
    this.Redo(Class);
};
function CChangesMathColor(NewValue, OldValue) {
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMathColor.prototype.Type = historyitem_Math_CtrPrpColor;
CChangesMathColor.prototype.Undo = function (Class) {
    Class.raw_SetColor(this.Old);
};
CChangesMathColor.prototype.Redo = function (Class) {
    Class.raw_SetColor(this.New);
};
CChangesMathColor.prototype.Save_Changes = function (Writer) {
    if (undefined !== this.New) {
        Writer.WriteBool(false);
        this.New.Write_ToBinary(Writer);
    } else {
        Writer.WriteBool(true);
    }
};
CChangesMathColor.prototype.Load_Changes = function (Reader, Class) {
    if (Reader.GetBool() == false) {
        this.New = new CDocumentColor(0, 0, 0, false);
        this.New.Read_FromBinary(Reader);
    } else {
        this.New = undefined;
    }
    this.Redo(Class);
};
function CChangesMathUnifill(NewValue, OldValue) {
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMathUnifill.prototype.Type = historyitem_Math_CtrPrpUnifill;
CChangesMathUnifill.prototype.Undo = function (Class) {
    Class.raw_SetUnifill(this.Old);
};
CChangesMathUnifill.prototype.Redo = function (Class) {
    Class.raw_SetUnifill(this.New);
};
CChangesMathUnifill.prototype.Save_Changes = function (Writer) {
    if (undefined !== this.New) {
        Writer.WriteBool(false);
        this.New.Write_ToBinary(Writer);
    } else {
        Writer.WriteBool(true);
    }
};
CChangesMathUnifill.prototype.Load_Changes = function (Reader, Class) {
    if (Reader.GetBool() == false) {
        this.New = new CUniFill();
        this.New.Read_FromBinary(Reader);
    } else {
        this.New = undefined;
    }
    this.Redo(Class);
};
function CChangesMathUnderline(NewValue, OldValue) {
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMathUnderline.prototype.Type = historyitem_Math_CtrPrpUnderline;
CChangesMathUnderline.prototype.Undo = function (Class) {
    Class.raw_SetUnderline(this.Old);
};
CChangesMathUnderline.prototype.Redo = function (Class) {
    Class.raw_SetUnderline(this.New);
};
CChangesMathUnderline.prototype.Save_Changes = function (Writer) {
    if (undefined === this.New) {
        Writer.WriteBool(true);
    } else {
        Writer.WriteBool(false);
        Writer.WriteBool(this.New);
    }
};
CChangesMathUnderline.prototype.Load_Changes = function (Reader, Class) {
    if (true === Reader.GetBool()) {
        this.New = undefined;
    } else {
        this.New = Reader.GetBool();
    }
    this.Redo(Class);
};
function CChangesMathStrikeout(NewValue, OldValue) {
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMathStrikeout.prototype.Type = historyitem_Math_CtrPrpStrikeout;
CChangesMathStrikeout.prototype.Undo = function (Class) {
    Class.raw_SetStrikeout(this.Old);
};
CChangesMathStrikeout.prototype.Redo = function (Class) {
    Class.raw_SetStrikeout(this.New);
};
CChangesMathStrikeout.prototype.Save_Changes = function (Writer) {
    if (undefined === this.New) {
        Writer.WriteBool(true);
    } else {
        Writer.WriteBool(false);
        Writer.WriteBool(this.New);
    }
};
CChangesMathStrikeout.prototype.Load_Changes = function (Reader, Class) {
    if (true === Reader.GetBool()) {
        this.New = undefined;
    } else {
        this.New = Reader.GetBool();
    }
    this.Redo(Class);
};
function CChangesMath_DoubleStrikeout(NewValue, OldValue) {
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMath_DoubleStrikeout.prototype.Type = historyitem_Math_CtrPrpDoubleStrikeout;
CChangesMath_DoubleStrikeout.prototype.Undo = function (Class) {
    Class.raw_Set_DoubleStrikeout(this.Old);
};
CChangesMath_DoubleStrikeout.prototype.Redo = function (Class) {
    Class.raw_Set_DoubleStrikeout(this.New);
};
CChangesMath_DoubleStrikeout.prototype.Save_Changes = function (Writer) {
    if (undefined === this.New) {
        Writer.WriteBool(true);
    } else {
        Writer.WriteBool(false);
        Writer.WriteBool(this.New);
    }
};
CChangesMath_DoubleStrikeout.prototype.Load_Changes = function (Reader, Class) {
    if (true === Reader.GetBool()) {
        this.New = undefined;
    } else {
        this.New = Reader.GetBool();
    }
    this.Redo(Class);
};
function CChangesMathItalic(NewValue, OldValue) {
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMathItalic.prototype.Type = historyitem_Math_CtrPrpItalic;
CChangesMathItalic.prototype.Undo = function (Class) {
    Class.raw_SetItalic(this.Old);
};
CChangesMathItalic.prototype.Redo = function (Class) {
    Class.raw_SetItalic(this.New);
};
CChangesMathItalic.prototype.Save_Changes = function (Writer) {
    if (undefined === this.New) {
        Writer.WriteBool(true);
    } else {
        Writer.WriteBool(false);
        Writer.WriteBool(this.New);
    }
};
CChangesMathItalic.prototype.Load_Changes = function (Reader, Class) {
    if (true === Reader.GetBool()) {
        this.New = undefined;
    } else {
        this.New = Reader.GetBool();
    }
    this.Redo(Class);
};
function CChangesMathBold(NewValue, OldValue) {
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMathBold.prototype.Type = historyitem_Math_CtrPrpBold;
CChangesMathBold.prototype.Undo = function (Class) {
    Class.raw_SetBold(this.Old);
};
CChangesMathBold.prototype.Redo = function (Class) {
    Class.raw_SetBold(this.New);
};
CChangesMathBold.prototype.Save_Changes = function (Writer) {
    if (undefined === this.New) {
        Writer.WriteBool(true);
    } else {
        Writer.WriteBool(false);
        Writer.WriteBool(this.New);
    }
};
CChangesMathBold.prototype.Load_Changes = function (Reader, Class) {
    if (true === Reader.GetBool()) {
        this.New = undefined;
    } else {
        this.New = Reader.GetBool();
    }
    this.Redo(Class);
};
function CChangesMath_RFontsAscii(NewValue, OldValue) {
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMath_RFontsAscii.prototype.Type = historyitem_Math_RFontsAscii;
CChangesMath_RFontsAscii.prototype.Undo = function (Class) {
    Class.raw_SetRFontsAscii(this.Old);
};
CChangesMath_RFontsAscii.prototype.Redo = function (Class) {
    Class.raw_SetRFontsAscii(this.New);
};
CChangesMath_RFontsAscii.prototype.Save_Changes = function (Writer) {
    if (undefined === this.New) {
        Writer.WriteBool(true);
    } else {
        Writer.WriteBool(false);
        Writer.WriteString2(this.New.Name);
    }
};
CChangesMath_RFontsAscii.prototype.Load_Changes = function (Reader, Class) {
    if (true === Reader.GetBool()) {
        this.New = undefined;
    } else {
        this.New = {
            Name: Reader.GetString2(),
            Index: -1
        };
    }
    this.Redo(Class);
};
function CChangesMath_RFontsHAnsi(NewValue, OldValue) {
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMath_RFontsHAnsi.prototype.Type = historyitem_Math_RFontsHAnsi;
CChangesMath_RFontsHAnsi.prototype.Undo = function (Class) {
    Class.raw_SetRFontsHAnsi(this.Old);
};
CChangesMath_RFontsHAnsi.prototype.Redo = function (Class) {
    Class.raw_SetRFontsHAnsi(this.New);
};
CChangesMath_RFontsHAnsi.prototype.Save_Changes = function (Writer) {
    if (undefined === this.New) {
        Writer.WriteBool(true);
    } else {
        Writer.WriteBool(false);
        Writer.WriteString2(this.New.Name);
    }
};
CChangesMath_RFontsHAnsi.prototype.Load_Changes = function (Reader, Class) {
    if (true === Reader.GetBool()) {
        this.New = undefined;
    } else {
        this.New = {
            Name: Reader.GetString2(),
            Index: -1
        };
    }
    this.Redo(Class);
};
function CChangesMath_RFontsCS(NewValue, OldValue) {
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMath_RFontsCS.prototype.Type = historyitem_Math_RFontsCS;
CChangesMath_RFontsCS.prototype.Undo = function (Class) {
    Class.raw_SetRFontsCS(this.Old);
};
CChangesMath_RFontsCS.prototype.Redo = function (Class) {
    Class.raw_SetRFontsCS(this.New);
};
CChangesMath_RFontsCS.prototype.Save_Changes = function (Writer) {
    if (undefined === this.New) {
        Writer.WriteBool(true);
    } else {
        Writer.WriteBool(false);
        Writer.WriteString2(this.New.Name);
    }
};
CChangesMath_RFontsCS.prototype.Load_Changes = function (Reader, Class) {
    if (true === Reader.GetBool()) {
        this.New = undefined;
    } else {
        this.New = {
            Name: Reader.GetString2(),
            Index: -1
        };
    }
    this.Redo(Class);
};
function CChangesMath_RFontsEastAsia(NewValue, OldValue) {
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMath_RFontsEastAsia.prototype.Type = historyitem_Math_RFontsEastAsia;
CChangesMath_RFontsEastAsia.prototype.Undo = function (Class) {
    Class.raw_SetRFontsEastAsia(this.Old);
};
CChangesMath_RFontsEastAsia.prototype.Redo = function (Class) {
    Class.raw_SetRFontsEastAsia(this.New);
};
CChangesMath_RFontsEastAsia.prototype.Save_Changes = function (Writer) {
    if (undefined === this.New) {
        Writer.WriteBool(true);
    } else {
        Writer.WriteBool(false);
        Writer.WriteString2(this.New.Name);
    }
};
CChangesMath_RFontsEastAsia.prototype.Load_Changes = function (Reader, Class) {
    if (true === Reader.GetBool()) {
        this.New = undefined;
    } else {
        this.New = {
            Name: Reader.GetString2(),
            Index: -1
        };
    }
    this.Redo(Class);
};
function CChangesMath_RFontsHint(NewValue, OldValue) {
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMath_RFontsHint.prototype.Type = historyitem_Math_RFontsHint;
CChangesMath_RFontsHint.prototype.Undo = function (Class) {
    Class.raw_SetRFontsHint(this.Old);
};
CChangesMath_RFontsHint.prototype.Redo = function (Class) {
    Class.raw_SetRFontsHint(this.New);
};
CChangesMath_RFontsHint.prototype.Save_Changes = function (Writer) {
    if (undefined === this.New) {
        Writer.WriteBool(true);
    } else {
        Writer.WriteBool(false);
        Writer.WriteLong(this.New);
    }
};
CChangesMath_RFontsHint.prototype.Load_Changes = function (Reader, Class) {
    if (true === Reader.GetBool()) {
        this.New = undefined;
    } else {
        this.New = Reader.GetLong();
    }
    this.Redo(Class);
};
function CChangesMathAddItems(Pos, Items) {
    this.Pos = Pos;
    this.Items = Items;
}
CChangesMathAddItems.prototype.Type = historyitem_Math_AddItems_ToMathBase;
CChangesMathAddItems.prototype.Undo = function (Class) {
    Class.raw_RemoveFromContent(this.Pos, this.Items.length);
};
CChangesMathAddItems.prototype.Redo = function (Class) {
    Class.raw_AddToContent(this.Pos, this.Items, false);
};
CChangesMathAddItems.prototype.Save_Changes = function (Writer) {
    var Count = this.Items.length;
    Writer.WriteLong(Count);
    Writer.WriteLong(this.Pos);
    for (var Index = 0; Index < Count; Index++) {
        Writer.WriteString2(this.Items[Index].Get_Id());
    }
};
CChangesMathAddItems.prototype.Load_Changes = function (Reader, Class) {
    var Count = Reader.GetLong();
    this.Pos = Reader.GetLong();
    this.Items = [];
    for (var Index = 0; Index < Count; Index++) {
        var Element = g_oTableId.Get_ById(Reader.GetString2());
        if (null !== Element) {
            this.Items.push(Element);
        }
    }
    this.Redo(Class);
};
function CChangesMathParaJc(NewValue, OldValue) {
    this.New = NewValue;
    this.Old = OldValue;
}
CChangesMathParaJc.prototype.Type = historyitem_Math_ParaJc;
CChangesMathParaJc.prototype.Undo = function (Class) {
    Class.raw_SetAlign(this.Old);
};
CChangesMathParaJc.prototype.Redo = function (Class) {
    Class.raw_SetAlign(this.New);
};
CChangesMathParaJc.prototype.Save_Changes = function (Writer) {
    if (undefined === this.New) {
        Writer.WriteBool(true);
    } else {
        Writer.WriteBool(false);
        Writer.WriteLong(this.New);
    }
};
CChangesMathParaJc.prototype.Load_Changes = function (Reader, Class) {
    if (true === Reader.GetBool()) {
        this.New = undefined;
    } else {
        this.New = Reader.GetLong();
    }
    this.Redo(Class);
};
function CChangesMathEqArrayPr(NewPr, OldPr) {
    this.New = NewPr;
    this.Old = OldPr;
}
CChangesMathEqArrayPr.prototype.Type = historyitem_Math_EqArrayPr;
CChangesMathEqArrayPr.prototype.Undo = function (Class) {
    Class.raw_SetPr(this.Old);
};
CChangesMathEqArrayPr.prototype.Redo = function (Class) {
    Class.raw_SetPr(this.New);
};
CChangesMathEqArrayPr.prototype.Save_Changes = function (Writer) {
    if (undefined === this.New) {
        Writer.WriteBool(true);
    } else {
        Writer.WriteBool(false);
        this.New.Write_ToBinary(Writer);
    }
};
CChangesMathEqArrayPr.prototype.Load_Changes = function (Reader, Class) {
    if (true === Reader.GetBool()) {
        this.New = undefined;
    } else {
        this.New = new CMathEqArrPr();
        this.New.Read_FromBinary(Reader);
    }
    this.Redo(Class);
};
function MatGetKoeffArgSize(FontSize, ArgSize) {
    var FontKoef = 1;
    if (ArgSize == -1) {
        FontKoef = g_dMathArgSizeKoeff_1;
    } else {
        if (ArgSize == -2) {
            FontKoef = g_dMathArgSizeKoeff_2;
        }
    }
    if (1 !== FontKoef) {
        FontKoef = (((FontSize * FontKoef * 2 + 0.5) | 0) / 2) / FontSize;
    }
    return FontKoef;
}
function CMathRecalculateInfo() {
    this.NeedResize = true;
    this.bChangeInline = true;
    this.bRecalcCtrPrp = false;
    this.bInline = false;
}
CMathRecalculateInfo.prototype.ClearRecalculate = function () {
    this.NeedResize = false;
    this.bRecalcCtrPrp = false;
    this.bChangeInline = false;
};