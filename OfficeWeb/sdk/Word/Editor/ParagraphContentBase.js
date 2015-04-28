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
function CParagraphContentBase() {}
function CParagraphContentWithContentBase() {
    CParagraphContentWithContentBase.superclass.constructor.call(this);
    this.Lines = [0];
    this.StartLine = -1;
    this.StartRange = -1;
}
Asc.extendClass(CParagraphContentWithContentBase, CParagraphContentBase);
CParagraphContentWithContentBase.prototype.Recalculate_Reset = function (StartRange, StartLine) {
    this.StartLine = StartLine;
    this.StartRange = StartRange;
    this.protected_ClearLines();
};
CParagraphContentWithContentBase.prototype.protected_ClearLines = function () {
    this.Lines = [0];
};
CParagraphContentWithContentBase.prototype.protected_GetRangeOffset = function (LineIndex, RangeIndex) {
    return (1 + this.Lines[0] + this.Lines[1 + LineIndex] + RangeIndex * 2);
};
CParagraphContentWithContentBase.prototype.protected_GetRangeStartPos = function (LineIndex, RangeIndex) {
    return this.Lines[this.protected_GetRangeOffset(LineIndex, RangeIndex)];
};
CParagraphContentWithContentBase.prototype.protected_GetRangeEndPos = function (LineIndex, RangeIndex) {
    return this.Lines[this.protected_GetRangeOffset(LineIndex, RangeIndex) + 1];
};
CParagraphContentWithContentBase.prototype.protected_GetLinesCount = function () {
    return this.Lines[0];
};
CParagraphContentWithContentBase.prototype.protected_GetRangesCount = function (LineIndex) {
    if (LineIndex === this.Lines[0] - 1) {
        return (this.Lines.length - this.Lines[1 + LineIndex] - (this.Lines[0] + 1)) / 2;
    } else {
        return (this.Lines[1 + LineIndex + 1] - this.Lines[1 + LineIndex]) / 2;
    }
};
CParagraphContentWithContentBase.prototype.protected_AddRange = function (LineIndex, RangeIndex) {
    if (this.Lines[0] >= LineIndex + 1) {
        var RangeOffset = this.protected_GetRangeOffset(LineIndex, 0) + RangeIndex * 2;
        this.Lines.splice(RangeOffset, this.Lines.length - RangeOffset);
        if (this.Lines[0] !== LineIndex + 1 && 0 === RangeIndex) {
            this.Lines.splice(LineIndex + 1, this.Lines[0] - LineIndex);
        } else {
            if (this.Lines[0] !== LineIndex + 1 && 0 !== RangeIndex) {
                this.Lines.splice(LineIndex + 2, this.Lines[0] - LineIndex - 1);
                this.Lines[0] = LineIndex + 1;
            }
        }
    }
    if (0 === RangeIndex) {
        if (this.Lines[0] !== LineIndex + 1) {
            var OffsetValue = this.Lines.length - LineIndex - 1;
            this.Lines.splice(LineIndex + 1, 0, OffsetValue);
            this.Lines[0] = LineIndex + 1;
        }
    }
    var RangeOffset = 1 + this.Lines[0] + this.Lines[LineIndex + 1] + RangeIndex * 2;
    this.Lines[RangeOffset + 0] = 0;
    this.Lines[RangeOffset + 1] = 0;
    if (0 !== LineIndex || 0 !== RangeIndex) {
        return this.Lines[RangeOffset - 1];
    } else {
        return 0;
    }
};
CParagraphContentWithContentBase.prototype.protected_FillRange = function (LineIndex, RangeIndex, StartPos, EndPos) {
    var RangeOffset = this.protected_GetRangeOffset(LineIndex, RangeIndex);
    this.Lines[RangeOffset + 0] = StartPos;
    this.Lines[RangeOffset + 1] = EndPos;
};
CParagraphContentWithContentBase.prototype.protected_FillRangeEndPos = function (LineIndex, RangeIndex, EndPos) {
    var RangeOffset = this.protected_GetRangeOffset(LineIndex, RangeIndex);
    this.Lines[RangeOffset + 1] = EndPos;
};
CParagraphContentWithContentBase.prototype.protected_UpdateSpellChecking = function () {
    if (undefined !== this.Paragraph && null !== this.Paragraph) {
        this.Paragraph.RecalcInfo.Set_Type_0_Spell(pararecalc_0_Spell_All);
    }
};