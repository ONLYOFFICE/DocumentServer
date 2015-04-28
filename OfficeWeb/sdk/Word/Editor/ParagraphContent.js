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
var para_Unknown = -1;
var para_Empty = 0;
var para_Text = 1;
var para_Space = 2;
var para_TextPr = 3;
var para_End = 4;
var para_NewLine = 16;
var para_NewLineRendered = 17;
var para_InlineBreak = 18;
var para_PageBreakRendered = 19;
var para_Numbering = 20;
var para_Tab = 21;
var para_Drawing = 22;
var para_PageNum = 23;
var para_FlowObjectAnchor = 24;
var para_HyperlinkStart = 25;
var para_HyperlinkEnd = 32;
var para_CollaborativeChangesStart = 33;
var para_CollaborativeChangesEnd = 34;
var para_CommentStart = 35;
var para_CommentEnd = 36;
var para_PresentationNumbering = 37;
var para_Math = 38;
var para_Run = 39;
var para_Sym = 40;
var para_Comment = 41;
var para_Hyperlink = 48;
var para_Math_Run = 49;
var para_Math_Placeholder = 50;
var para_Math_Composition = 51;
var para_Math_Text = 52;
var para_Math_Ampersand = 53;
var break_Line = 1;
var break_Page = 2;
var nbsp_charcode = 160;
var nbsp_string = String.fromCharCode(160);
var sp_string = String.fromCharCode(50);
var g_aPunctuation = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0];
g_aPunctuation[171] = 1;
g_aPunctuation[187] = 1;
g_aPunctuation[8211] = 1;
g_aPunctuation[8220] = 1;
g_aPunctuation[8221] = 1;
g_aPunctuation[8230] = 1;
var g_aNumber = [];
g_aNumber[48] = 1;
g_aNumber[49] = 1;
g_aNumber[50] = 1;
g_aNumber[51] = 1;
g_aNumber[52] = 1;
g_aNumber[53] = 1;
g_aNumber[54] = 1;
g_aNumber[55] = 1;
g_aNumber[56] = 1;
g_aNumber[57] = 1;
var g_aSpecialSymbols = [];
g_aSpecialSymbols[174] = 1;
var PARATEXT_FLAGS_MASK = 4294967295;
var PARATEXT_FLAGS_FONTKOEF_SCRIPT = 1;
var PARATEXT_FLAGS_FONTKOEF_SMALLCAPS = 2;
var PARATEXT_FLAGS_SPACEAFTER = 65536;
var PARATEXT_FLAGS_CAPITALS = 131072;
var PARATEXT_FLAGS_NON_FONTKOEF_SCRIPT = PARATEXT_FLAGS_MASK ^ PARATEXT_FLAGS_FONTKOEF_SCRIPT;
var PARATEXT_FLAGS_NON_FONTKOEF_SMALLCAPS = PARATEXT_FLAGS_MASK ^ PARATEXT_FLAGS_FONTKOEF_SMALLCAPS;
var PARATEXT_FLAGS_NON_SPACEAFTER = PARATEXT_FLAGS_MASK ^ PARATEXT_FLAGS_SPACEAFTER;
var PARATEXT_FLAGS_NON_CAPITALS = PARATEXT_FLAGS_MASK ^ PARATEXT_FLAGS_CAPITALS;
var TEXTWIDTH_DIVIDER = 16384;
function ParaText(value) {
    this.Value = (undefined !== value ? value.charCodeAt(0) : 0);
    this.Width = 0 | 0;
    this.WidthVisible = 0 | 0;
    this.Flags = 0 | 0;
    this.Set_SpaceAfter(45 === this.Value);
}
ParaText.prototype = {
    Type: para_Text,
    Get_Type: function () {
        return para_Text;
    },
    Set_CharCode: function (CharCode) {
        this.Value = CharCode;
        this.Set_SpaceAfter(45 === this.Value);
    },
    Draw: function (X, Y, Context) {
        var CharCode = this.Value;
        var FontKoef = 1;
        if (this.Flags & PARATEXT_FLAGS_FONTKOEF_SCRIPT && this.Flags & PARATEXT_FLAGS_FONTKOEF_SMALLCAPS) {
            FontKoef = smallcaps_and_script_koef;
        } else {
            if (this.Flags & PARATEXT_FLAGS_FONTKOEF_SCRIPT) {
                FontKoef = vertalign_Koef_Size;
            } else {
                if (this.Flags & PARATEXT_FLAGS_FONTKOEF_SMALLCAPS) {
                    FontKoef = smallcaps_Koef;
                }
            }
        }
        Context.SetFontSlot(((this.Flags >> 8) & 255), FontKoef);
        var ResultCharCode = (this.Flags & PARATEXT_FLAGS_CAPITALS ? (String.fromCharCode(CharCode).toUpperCase()).charCodeAt(0) : CharCode);
        if (true === this.Is_NBSP() && editor && editor.ShowParaMarks) {
            Context.FillText(X, Y, String.fromCharCode(176));
        } else {
            Context.FillTextCode(X, Y, ResultCharCode);
        }
    },
    Measure: function (Context, TextPr) {
        var bCapitals = false;
        var CharCode = this.Value;
        var ResultCharCode = CharCode;
        if (true === TextPr.Caps || true === TextPr.SmallCaps) {
            this.Flags |= PARATEXT_FLAGS_CAPITALS;
            ResultCharCode = (String.fromCharCode(CharCode).toUpperCase()).charCodeAt(0);
            bCapitals = (ResultCharCode === CharCode ? true : false);
        } else {
            this.Flags &= PARATEXT_FLAGS_NON_CAPITALS;
            bCapitals = false;
        }
        if (TextPr.VertAlign !== vertalign_Baseline) {
            this.Flags |= PARATEXT_FLAGS_FONTKOEF_SCRIPT;
        } else {
            this.Flags &= PARATEXT_FLAGS_NON_FONTKOEF_SCRIPT;
        }
        if (true != TextPr.Caps && true === TextPr.SmallCaps && false === bCapitals) {
            this.Flags |= PARATEXT_FLAGS_FONTKOEF_SMALLCAPS;
        } else {
            this.Flags &= PARATEXT_FLAGS_NON_FONTKOEF_SMALLCAPS;
        }
        var Hint = TextPr.RFonts.Hint;
        var bCS = TextPr.CS;
        var bRTL = TextPr.RTL;
        var lcid = TextPr.Lang.EastAsia;
        var FontSlot = g_font_detector.Get_FontClass(ResultCharCode, Hint, lcid, bCS, bRTL);
        var Flags_0Byte = (this.Flags >> 0) & 255;
        var Flags_2Byte = (this.Flags >> 16) & 255;
        this.Flags = Flags_0Byte | ((FontSlot & 255) << 8) | (Flags_2Byte << 16);
        var FontKoef = 1;
        if (this.Flags & PARATEXT_FLAGS_FONTKOEF_SCRIPT && this.Flags & PARATEXT_FLAGS_FONTKOEF_SMALLCAPS) {
            FontKoef = smallcaps_and_script_koef;
        } else {
            if (this.Flags & PARATEXT_FLAGS_FONTKOEF_SCRIPT) {
                FontKoef = vertalign_Koef_Size;
            } else {
                if (this.Flags & PARATEXT_FLAGS_FONTKOEF_SMALLCAPS) {
                    FontKoef = smallcaps_Koef;
                }
            }
        }
        var FontSize = TextPr.FontSize;
        if (1 !== FontKoef) {
            FontKoef = (((FontSize * FontKoef * 2 + 0.5) | 0) / 2) / FontSize;
        }
        Context.SetFontSlot(FontSlot, FontKoef);
        var Temp = Context.MeasureCode(ResultCharCode);
        var ResultWidth = (Math.max((Temp.Width + TextPr.Spacing), 0) * TEXTWIDTH_DIVIDER) | 0;
        this.Width = ResultWidth;
        this.WidthVisible = ResultWidth;
    },
    Get_Width: function () {
        return (this.Width / TEXTWIDTH_DIVIDER);
    },
    Get_WidthVisible: function () {
        return (this.WidthVisible / TEXTWIDTH_DIVIDER);
    },
    Set_WidthVisible: function (WidthVisible) {
        this.WidthVisible = (WidthVisible * TEXTWIDTH_DIVIDER) | 0;
    },
    Is_RealContent: function () {
        return true;
    },
    Can_AddNumbering: function () {
        return true;
    },
    Copy: function () {
        return new ParaText(String.fromCharCode(this.Value));
    },
    Is_NBSP: function () {
        return (this.Value === nbsp_charcode ? true : false);
    },
    Is_Punctuation: function () {
        if (1 === g_aPunctuation[this.Value]) {
            return true;
        }
        return false;
    },
    Is_Number: function () {
        if (1 === g_aNumber[this.Value]) {
            return true;
        }
        return false;
    },
    Is_SpecialSymbol: function () {
        if (1 === g_aSpecialSymbols[this.Value]) {
            return true;
        }
        return false;
    },
    Is_SpaceAfter: function () {
        return (this.Flags & PARATEXT_FLAGS_SPACEAFTER ? true : false);
    },
    Get_CharForSpellCheck: function (bCaps) {
        if (8217 === this.Value) {
            return String.fromCharCode(39);
        } else {
            if (true === bCaps) {
                return (String.fromCharCode(this.Value)).toUpperCase();
            } else {
                return String.fromCharCode(this.Value);
            }
        }
    },
    Set_SpaceAfter: function (bSpaceAfter) {
        if (bSpaceAfter) {
            this.Flags |= PARATEXT_FLAGS_SPACEAFTER;
        } else {
            this.Flags &= PARATEXT_FLAGS_NON_SPACEAFTER;
        }
    },
    Write_ToBinary: function (Writer) {
        Writer.WriteLong(para_Text);
        Writer.WriteLong(this.Value);
    },
    Read_FromBinary: function (Reader) {
        this.Value = Reader.GetLong();
    }
};
function ParaSpace() {
    this.Flags = 0 | 0;
    this.Width = 0 | 0;
    this.WidthVisible = 0 | 0;
}
ParaSpace.prototype = {
    Type: para_Space,
    Get_Type: function () {
        return para_Space;
    },
    Draw: function (X, Y, Context) {
        if (undefined !== editor && editor.ShowParaMarks) {
            Context.SetFontSlot(fontslot_ASCII, this.Get_FontKoef());
            Context.FillText(X, Y, String.fromCharCode(183));
        }
    },
    Measure: function (Context, TextPr) {
        this.Set_FontKoef_Script(TextPr.VertAlign !== vertalign_Baseline ? true : false);
        this.Set_FontKoef_SmallCaps(true != TextPr.Caps && true === TextPr.SmallCaps ? true : false);
        var FontKoef = this.Get_FontKoef();
        var FontSize = TextPr.FontSize;
        if (1 !== FontKoef) {
            FontKoef = (((FontSize * FontKoef * 2 + 0.5) | 0) / 2) / FontSize;
        }
        Context.SetFontSlot(fontslot_ASCII, FontKoef);
        var Temp = Context.MeasureCode(32);
        var ResultWidth = (Math.max((Temp.Width + TextPr.Spacing), 0) * 16384) | 0;
        this.Width = ResultWidth;
    },
    Get_FontKoef: function () {
        if (this.Flags & PARATEXT_FLAGS_FONTKOEF_SCRIPT && this.Flags & PARATEXT_FLAGS_FONTKOEF_SMALLCAPS) {
            return smallcaps_and_script_koef;
        } else {
            if (this.Flags & PARATEXT_FLAGS_FONTKOEF_SCRIPT) {
                return vertalign_Koef_Size;
            } else {
                if (this.Flags & PARATEXT_FLAGS_FONTKOEF_SMALLCAPS) {
                    return smallcaps_Koef;
                } else {
                    return 1;
                }
            }
        }
    },
    Set_FontKoef_Script: function (bScript) {
        if (bScript) {
            this.Flags |= PARATEXT_FLAGS_FONTKOEF_SCRIPT;
        } else {
            this.Flags &= PARATEXT_FLAGS_NON_FONTKOEF_SCRIPT;
        }
    },
    Set_FontKoef_SmallCaps: function (bSmallCaps) {
        if (bSmallCaps) {
            this.Flags |= PARATEXT_FLAGS_FONTKOEF_SMALLCAPS;
        } else {
            this.Flags &= PARATEXT_FLAGS_NON_FONTKOEF_SMALLCAPS;
        }
    },
    Get_Width: function () {
        return (this.Width / TEXTWIDTH_DIVIDER);
    },
    Get_WidthVisible: function () {
        return (this.WidthVisible / TEXTWIDTH_DIVIDER);
    },
    Set_WidthVisible: function (WidthVisible) {
        this.WidthVisible = (WidthVisible * TEXTWIDTH_DIVIDER) | 0;
    },
    Is_RealContent: function () {
        return true;
    },
    Can_AddNumbering: function () {
        return true;
    },
    Copy: function () {
        return new ParaSpace();
    },
    Write_ToBinary: function (Writer) {
        Writer.WriteLong(para_Space);
        Writer.WriteLong(this.Value);
    },
    Read_FromBinary: function (Reader) {
        this.Value = Reader.GetLong();
    }
};
function ParaSym(Char, FontFamily) {
    this.Type = para_Sym;
    this.FontFamily = FontFamily;
    this.Char = Char;
    this.FontSlot = fontslot_ASCII;
    this.FontKoef = 1;
    this.Width = 0;
    this.Height = 0;
    this.WidthVisible = 0;
}
ParaSym.prototype = {
    Draw: function (X, Y, Context, TextPr) {
        var CurTextPr = TextPr.Copy();
        switch (this.FontSlot) {
        case fontslot_ASCII:
            CurTextPr.RFonts.Ascii = {
                Name: this.FontFamily,
                Index: -1
            };
            break;
        case fontslot_CS:
            CurTextPr.RFonts.CS = {
                Name: this.FontFamily,
                Index: -1
            };
            break;
        case fontslot_EastAsia:
            CurTextPr.RFonts.EastAsia = {
                Name: this.FontFamily,
                Index: -1
            };
            break;
        case fontslot_HAnsi:
            CurTextPr.RFonts.HAnsi = {
                Name: this.FontFamily,
                Index: -1
            };
            break;
        }
        Context.SetTextPr(CurTextPr);
        Context.SetFontSlot(this.FontSlot, this.FontKoef);
        Context.FillText(X, Y, String.fromCharCode(this.Char));
        Context.SetTextPr(TextPr);
    },
    Measure: function (Context, TextPr) {
        this.FontKoef = TextPr.Get_FontKoef();
        var Hint = TextPr.RFonts.Hint;
        var bCS = TextPr.CS;
        var bRTL = TextPr.RTL;
        var lcid = TextPr.Lang.EastAsia;
        this.FontSlot = g_font_detector.Get_FontClass(this.CalcValue.charCodeAt(0), Hint, lcid, bCS, bRTL);
        var CurTextPr = TextPr.Copy();
        switch (this.FontSlot) {
        case fontslot_ASCII:
            CurTextPr.RFonts.Ascii = {
                Name: this.FontFamily,
                Index: -1
            };
            break;
        case fontslot_CS:
            CurTextPr.RFonts.CS = {
                Name: this.FontFamily,
                Index: -1
            };
            break;
        case fontslot_EastAsia:
            CurTextPr.RFonts.EastAsia = {
                Name: this.FontFamily,
                Index: -1
            };
            break;
        case fontslot_HAnsi:
            CurTextPr.RFonts.HAnsi = {
                Name: this.FontFamily,
                Index: -1
            };
            break;
        }
        Context.SetTextPr(CurTextPr);
        Context.SetFontSlot(this.FontSlot, this.FontKoef);
        var Temp = Context.Measure(this.CalcValue);
        Context.SetTextPr(TextPr);
        Temp.Width = Math.max(Temp.Width + TextPr.Spacing, 0);
        this.Width = Temp.Width;
        this.Height = Temp.Height;
        this.WidthVisible = Temp.Width;
    },
    Is_RealContent: function () {
        return true;
    },
    Can_AddNumbering: function () {
        return true;
    },
    Copy: function () {
        return new ParaSym(this.Char, this.FontFamily);
    },
    Write_ToBinary: function (Writer) {
        Writer.WriteLong(this.Type);
        Writer.WriteString2(this.FontFamily);
        Writer.WriteLong(this.Char);
    },
    Read_FromBinary: function (Reader) {
        this.FontFamily = Reader.GetString2();
        this.Char = Reader.GetLong();
    }
};
function ParaTextPr(Props) {
    this.Id = g_oIdCounter.Get_NewId();
    this.Type = para_TextPr;
    this.Value = new CTextPr();
    this.Parent = null;
    this.CalcValue = this.Value;
    this.Width = 0;
    this.Height = 0;
    this.WidthVisible = 0;
    if ("object" == typeof(Props)) {
        this.Value.Set_FromObject(Props);
    }
    g_oTableId.Add(this, this.Id);
}
ParaTextPr.prototype = {
    Type: para_TextPr,
    Get_Type: function () {
        return para_TextPr;
    },
    Draw: function () {},
    Measure: function () {
        this.Width = 0;
        this.Height = 0;
        this.WidthVisible = 0;
    },
    Copy: function () {
        var ParaTextPr_new = new ParaTextPr();
        ParaTextPr_new.Set_Value(this.Value);
        return ParaTextPr_new;
    },
    Is_RealContent: function () {
        return true;
    },
    Can_AddNumbering: function () {
        return false;
    },
    Set_Id: function (newId) {
        g_oTableId.Reset_Id(this, newId, this.Id);
        this.Id = newId;
    },
    Get_Id: function () {
        return this.Id;
    },
    Apply_TextPr: function (TextPr) {
        if (undefined != TextPr.Bold) {
            this.Set_Bold(TextPr.Bold);
        }
        if (undefined != TextPr.Italic) {
            this.Set_Italic(TextPr.Italic);
        }
        if (undefined != TextPr.Strikeout) {
            this.Set_Strikeout(TextPr.Strikeout);
        }
        if (undefined != TextPr.Underline) {
            this.Set_Underline(TextPr.Underline);
        }
        if (undefined != TextPr.FontFamily) {
            this.Set_FontFamily(TextPr.FontFamily);
        }
        if (undefined != TextPr.FontSize) {
            this.Set_FontSize(TextPr.FontSize);
        }
        if (undefined != TextPr.FontSizeCS) {
            this.Set_FontSizeCS(TextPr.FontSizeCS);
        }
        if (undefined != TextPr.Color) {
            this.Set_Color(TextPr.Color);
            this.Set_Unifill(undefined);
        }
        if (undefined != TextPr.VertAlign) {
            this.Set_VertAlign(TextPr.VertAlign);
        }
        if (undefined != TextPr.HighLight) {
            this.Set_HighLight(TextPr.HighLight);
        }
        if (undefined != TextPr.RStyle) {
            this.Set_RStyle(TextPr.RStyle);
        }
        if (undefined != TextPr.Spacing) {
            this.Set_Spacing(TextPr.Spacing);
        }
        if (undefined != TextPr.DStrikeout) {
            this.Set_DStrikeout(TextPr.DStrikeout);
        }
        if (undefined != TextPr.Caps) {
            this.Set_Caps(TextPr.Caps);
        }
        if (undefined != TextPr.SmallCaps) {
            this.Set_SmallCaps(TextPr.SmallCaps);
        }
        if (undefined != TextPr.Position) {
            this.Set_Position(TextPr.Position);
        }
        if (undefined != TextPr.RFonts) {
            this.Set_RFonts2(TextPr.RFonts);
        }
        if (undefined != TextPr.Lang) {
            this.Set_Lang(TextPr.Lang);
        }
        if (undefined != TextPr.Unifill) {
            this.Set_Unifill(TextPr.Unifill.createDuplicate());
            this.Set_Color(undefined);
        }
    },
    Clear_Style: function () {
        if (undefined != this.Value.Bold) {
            this.Set_Bold(undefined);
        }
        if (undefined != this.Value.Italic) {
            this.Set_Italic(undefined);
        }
        if (undefined != this.Value.Strikeout) {
            this.Set_Strikeout(undefined);
        }
        if (undefined != this.Value.Underline) {
            this.Set_Underline(undefined);
        }
        if (undefined != this.Value.FontSize) {
            this.Set_FontSize(undefined);
        }
        if (undefined != this.Value.Color) {
            this.Set_Color(undefined);
        }
        if (undefined != this.Value.Unifill) {
            this.Set_Unifill(undefined);
        }
        if (undefined != this.Value.VertAlign) {
            this.Set_VertAlign(undefined);
        }
        if (undefined != this.Value.HighLight) {
            this.Set_HighLight(undefined);
        }
        if (undefined != this.Value.RStyle) {
            this.Set_RStyle(undefined);
        }
        if (undefined != this.Value.Spacing) {
            this.Set_Spacing(undefined);
        }
        if (undefined != this.Value.DStrikeout) {
            this.Set_DStrikeout(undefined);
        }
        if (undefined != this.Value.Caps) {
            this.Set_Caps(undefined);
        }
        if (undefined != this.Value.SmallCaps) {
            this.Set_SmallCaps(undefined);
        }
        if (undefined != this.Value.Position) {
            this.Set_Position(undefined);
        }
        if (undefined != this.Value.RFonts.Ascii) {
            this.Set_RFonts_Ascii(undefined);
        }
        if (undefined != this.Value.RFonts.HAnsi) {
            this.Set_RFonts_HAnsi(undefined);
        }
        if (undefined != this.Value.RFonts.CS) {
            this.Set_RFonts_CS(undefined);
        }
        if (undefined != this.Value.RFonts.EastAsia) {
            this.Set_RFonts_EastAsia(undefined);
        }
        if (undefined != this.Value.RFonts.Hint) {
            this.Set_RFonts_Hint(undefined);
        }
    },
    Set_Prop: function (Prop, Value) {
        var OldValue = (undefined != this.Value[Prop] ? this.Value[Prop] : undefined);
        this.Value[Prop] = Value;
        History.Add(this, {
            Type: historyitem_TextPr_Change,
            Prop: Prop,
            New: Value,
            Old: OldValue
        });
    },
    Delete_Prop: function (Prop) {
        if (undefined === this.Value[Prop]) {
            return;
        }
        var OldValue = this.Value[Prop];
        this.Value[Prop] = undefined;
        History.Add(this, {
            Type: historyitem_TextPr_Change,
            Prop: Prop,
            New: null,
            Old: OldValue
        });
    },
    Set_Bold: function (Value) {
        var OldValue = (undefined != this.Value.Bold ? this.Value.Bold : undefined);
        if (undefined != Value) {
            this.Value.Bold = Value;
        } else {
            this.Value.Bold = undefined;
        }
        History.Add(this, {
            Type: historyitem_TextPr_Bold,
            New: Value,
            Old: OldValue
        });
    },
    Set_Italic: function (Value) {
        var OldValue = (undefined != this.Value.Italic ? this.Value.Italic : undefined);
        if (undefined != Value) {
            this.Value.Italic = Value;
        } else {
            this.Value.Italic = undefined;
        }
        History.Add(this, {
            Type: historyitem_TextPr_Italic,
            New: Value,
            Old: OldValue
        });
    },
    Set_Strikeout: function (Value) {
        var OldValue = (undefined != this.Value.Strikeout ? this.Value.Strikeout : undefined);
        if (undefined != Value) {
            this.Value.Strikeout = Value;
        } else {
            this.Value.Strikeout = undefined;
        }
        History.Add(this, {
            Type: historyitem_TextPr_Strikeout,
            New: Value,
            Old: OldValue
        });
    },
    Set_Underline: function (Value) {
        var OldValue = (undefined != this.Value.Underline ? this.Value.Underline : undefined);
        if (undefined != Value) {
            this.Value.Underline = Value;
        } else {
            this.Value.Underline = undefined;
        }
        History.Add(this, {
            Type: historyitem_TextPr_Underline,
            New: Value,
            Old: OldValue
        });
    },
    Set_FontFamily: function (Value) {
        var OldValue = (undefined != this.Value.FontFamily ? this.Value.FontFamily : undefined);
        if (undefined != Value) {
            this.Value.FontFamily = Value;
        } else {
            this.Value.FontFamily = undefined;
        }
        History.Add(this, {
            Type: historyitem_TextPr_FontFamily,
            New: Value,
            Old: OldValue
        });
    },
    Set_FontSize: function (Value) {
        var OldValue = (undefined != this.Value.FontSize ? this.Value.FontSize : undefined);
        if (undefined != Value) {
            this.Value.FontSize = Value;
        } else {
            this.Value.FontSize = undefined;
        }
        History.Add(this, {
            Type: historyitem_TextPr_FontSize,
            New: Value,
            Old: OldValue
        });
    },
    Set_FontSizeCS: function (Value) {
        var OldValue = (undefined != this.Value.FontSizeCS ? this.Value.FontSizeCS : undefined);
        if (undefined != Value) {
            this.Value.FontSizeCS = Value;
        } else {
            this.Value.FontSizeCS = undefined;
        }
        History.Add(this, {
            Type: historyitem_TextPr_FontSizeCS,
            New: Value,
            Old: OldValue
        });
    },
    Set_Color: function (Value) {
        var OldValue = (undefined != this.Value.Color ? this.Value.Color : undefined);
        if (undefined != Value) {
            this.Value.Color = Value;
        } else {
            this.Value.Color = undefined;
        }
        History.Add(this, {
            Type: historyitem_TextPr_Color,
            New: Value,
            Old: OldValue
        });
    },
    Set_VertAlign: function (Value) {
        var OldValue = (undefined != this.Value.VertAlign ? this.Value.VertAlign : undefined);
        if (undefined != Value) {
            this.Value.VertAlign = Value;
        } else {
            this.Value.VertAlign = undefined;
        }
        History.Add(this, {
            Type: historyitem_TextPr_VertAlign,
            New: Value,
            Old: OldValue
        });
    },
    Set_HighLight: function (Value) {
        var OldValue = (undefined != this.Value.HighLight ? this.Value.HighLight : undefined);
        if (undefined != Value) {
            this.Value.HighLight = Value;
        } else {
            this.Value.HighLight = undefined;
        }
        History.Add(this, {
            Type: historyitem_TextPr_HighLight,
            New: Value,
            Old: OldValue
        });
    },
    Set_RStyle: function (Value) {
        var OldValue = (undefined != this.Value.RStyle ? this.Value.RStyle : undefined);
        if (undefined != Value) {
            this.Value.RStyle = Value;
        } else {
            this.Value.RStyle = undefined;
        }
        History.Add(this, {
            Type: historyitem_TextPr_RStyle,
            New: Value,
            Old: OldValue
        });
    },
    Set_Spacing: function (Value) {
        var OldValue = (undefined != this.Value.Spacing ? this.Value.Spacing : undefined);
        if (undefined != Value) {
            this.Value.Spacing = Value;
        } else {
            this.Value.Spacing = undefined;
        }
        History.Add(this, {
            Type: historyitem_TextPr_Spacing,
            New: Value,
            Old: OldValue
        });
    },
    Set_DStrikeout: function (Value) {
        var OldValue = (undefined != this.Value.DStrikeout ? this.Value.DStrikeout : undefined);
        if (undefined != Value) {
            this.Value.DStrikeout = Value;
        } else {
            this.Value.DStrikeout = undefined;
        }
        History.Add(this, {
            Type: historyitem_TextPr_DStrikeout,
            New: Value,
            Old: OldValue
        });
    },
    Set_Caps: function (Value) {
        var OldValue = (undefined != this.Value.Caps ? this.Value.Caps : undefined);
        if (undefined != Value) {
            this.Value.Caps = Value;
        } else {
            this.Value.Caps = undefined;
        }
        History.Add(this, {
            Type: historyitem_TextPr_Caps,
            New: Value,
            Old: OldValue
        });
    },
    Set_SmallCaps: function (Value) {
        var OldValue = (undefined != this.Value.SmallCaps ? this.Value.SmallCaps : undefined);
        if (undefined != Value) {
            this.Value.SmallCaps = Value;
        } else {
            this.Value.SmallCaps = undefined;
        }
        History.Add(this, {
            Type: historyitem_TextPr_SmallCaps,
            New: Value,
            Old: OldValue
        });
    },
    Set_Position: function (Value) {
        var OldValue = (undefined != this.Value.Position ? this.Value.Position : undefined);
        if (undefined != Value) {
            this.Value.Position = Value;
        } else {
            this.Value.Position = undefined;
        }
        History.Add(this, {
            Type: historyitem_TextPr_Position,
            New: Value,
            Old: OldValue
        });
    },
    Set_Value: function (Value) {
        var OldValue = this.Value;
        this.Value = Value;
        History.Add(this, {
            Type: historyitem_TextPr_Value,
            New: Value,
            Old: OldValue
        });
    },
    Set_RFonts: function (Value) {
        var OldValue = this.RFonts.Value;
        if (undefined != Value) {
            this.Value.RFonts = Value;
        } else {
            this.Value.RFonts = new CRFonts();
        }
        History.Add(this, {
            Type: historyitem_TextPr_RFonts,
            New: Value,
            Old: OldValue
        });
    },
    Set_RFonts2: function (RFonts) {
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
        }
    },
    Set_RFonts_Ascii: function (Value) {
        var OldValue = this.Value.RFonts.Ascii;
        if (undefined != Value) {
            this.Value.RFonts.Ascii = Value;
        } else {
            this.Value.RFonts.Ascii = undefined;
        }
        History.Add(this, {
            Type: historyitem_TextPr_RFonts_Ascii,
            New: Value,
            Old: OldValue
        });
    },
    Set_RFonts_HAnsi: function (Value) {
        var OldValue = this.Value.RFonts.HAnsi;
        if (undefined != Value) {
            this.Value.RFonts.HAnsi = Value;
        } else {
            this.Value.RFonts.HAnsi = undefined;
        }
        History.Add(this, {
            Type: historyitem_TextPr_RFonts_HAnsi,
            New: Value,
            Old: OldValue
        });
    },
    Set_RFonts_CS: function (Value) {
        var OldValue = this.Value.RFonts.CS;
        if (undefined != Value) {
            this.Value.RFonts.CS = Value;
        } else {
            this.Value.RFonts.CS = undefined;
        }
        History.Add(this, {
            Type: historyitem_TextPr_RFonts_CS,
            New: Value,
            Old: OldValue
        });
    },
    Set_RFonts_EastAsia: function (Value) {
        var OldValue = this.Value.RFonts.EastAsia;
        if (undefined != Value) {
            this.Value.RFonts.EastAsia = Value;
        } else {
            this.Value.RFonts.EastAsia = undefined;
        }
        History.Add(this, {
            Type: historyitem_TextPr_RFonts_EastAsia,
            New: Value,
            Old: OldValue
        });
    },
    Set_RFonts_Hint: function (Value) {
        var OldValue = this.Value.RFonts.Hint;
        if (undefined != Value) {
            this.Value.RFonts.Hint = Value;
        } else {
            this.Value.RFonts.Hint = undefined;
        }
        History.Add(this, {
            Type: historyitem_TextPr_RFonts_Hint,
            New: Value,
            Old: OldValue
        });
    },
    Set_Lang: function (Value) {
        var OldValue = this.Value.Lang;
        var NewValue = new CLang();
        if (undefined != Value) {
            NewValue.Set_FromObject(Value);
        }
        this.Value.Lang = NewValue;
        History.Add(this, {
            Type: historyitem_TextPr_Lang,
            New: NewValue,
            Old: OldValue
        });
    },
    Set_Lang_Bidi: function (Value) {
        var OldValue = this.Value.Lang.Bidi;
        if (undefined != Value) {
            this.Value.Lang.Bidi = Value;
        } else {
            this.Value.Lang.Bidi = undefined;
        }
        History.Add(this, {
            Type: historyitem_TextPr_Lang_Bidi,
            New: Value,
            Old: OldValue
        });
    },
    Set_Lang_EastAsia: function (Value) {
        var OldValue = this.Value.Lang.EastAsia;
        if (undefined != Value) {
            this.Value.Lang.EastAsia = Value;
        } else {
            this.Value.Lang.EastAsia = undefined;
        }
        History.Add(this, {
            Type: historyitem_TextPr_Lang_EastAsia,
            New: Value,
            Old: OldValue
        });
    },
    Set_Lang_Val: function (Value) {
        var OldValue = this.Value.Lang.Val;
        if (undefined != Value) {
            this.Value.Lang.Val = Value;
        } else {
            this.Value.Lang.Val = undefined;
        }
        History.Add(this, {
            Type: historyitem_TextPr_Lang_Val,
            New: Value,
            Old: OldValue
        });
    },
    Set_Unifill: function (Value) {
        var OldValue = this.Value.Unifill;
        if (undefined != Value) {
            this.Value.Unifill = Value;
        } else {
            this.Value.Unifill = undefined;
        }
        History.Add(this, {
            Type: historyitem_TextPr_Unifill,
            New: Value,
            Old: OldValue
        });
    },
    Undo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_TextPr_Change:
            if (undefined != Data.Old) {
                this.Value[Data.Prop] = Data.Old;
            } else {
                this.Value[Data.Prop] = undefined;
            }
            break;
        case historyitem_TextPr_Bold:
            if (undefined != Data.Old) {
                this.Value.Bold = Data.Old;
            } else {
                this.Value.Bold = undefined;
            }
            break;
        case historyitem_TextPr_Italic:
            if (undefined != Data.Old) {
                this.Value.Italic = Data.Old;
            } else {
                this.Value.Italic = undefined;
            }
            break;
        case historyitem_TextPr_Strikeout:
            if (undefined != Data.Old) {
                this.Value.Strikeout = Data.Old;
            } else {
                this.Value.Strikeout = undefined;
            }
            break;
        case historyitem_TextPr_Underline:
            if (undefined != Data.Old) {
                this.Value.Underline = Data.Old;
            } else {
                this.Value.Underline = undefined;
            }
            break;
        case historyitem_TextPr_FontFamily:
            if (undefined != Data.Old) {
                this.Value.FontFamily = Data.Old;
            } else {
                this.Value.FontFamily = undefined;
            }
            break;
        case historyitem_TextPr_FontSize:
            if (undefined != Data.Old) {
                this.Value.FontSize = Data.Old;
            } else {
                this.Value.FontSize = undefined;
            }
            break;
        case historyitem_TextPr_FontSizeCS:
            if (undefined != Data.Old) {
                this.Value.FontSizeCS = Data.Old;
            } else {
                this.Value.FontSizeCS = undefined;
            }
            break;
        case historyitem_TextPr_Color:
            if (undefined != Data.Old) {
                this.Value.Color = Data.Old;
            } else {
                this.Value.Color = undefined;
            }
            break;
        case historyitem_TextPr_VertAlign:
            if (undefined != Data.Old) {
                this.Value.VertAlign = Data.Old;
            } else {
                this.Value.VertAlign = undefined;
            }
            break;
        case historyitem_TextPr_HighLight:
            if (undefined != Data.Old) {
                this.Value.HighLight = Data.Old;
            } else {
                this.Value.HighLight = undefined;
            }
            break;
        case historyitem_TextPr_RStyle:
            if (undefined != Data.Old) {
                this.Value.RStyle = Data.Old;
            } else {
                this.Value.RStyle = undefined;
            }
            break;
        case historyitem_TextPr_Spacing:
            if (undefined != Data.Old) {
                this.Value.Spacing = Data.Old;
            } else {
                this.Value.Spacing = undefined;
            }
            break;
        case historyitem_TextPr_DStrikeout:
            if (undefined != Data.Old) {
                this.Value.DStrikeout = Data.Old;
            } else {
                this.Value.DStrikeout = undefined;
            }
            break;
        case historyitem_TextPr_Caps:
            if (undefined != Data.Old) {
                this.Value.Caps = Data.Old;
            } else {
                this.Value.Caps = undefined;
            }
            break;
        case historyitem_TextPr_SmallCaps:
            if (undefined != Data.Old) {
                this.Value.SmallCaps = Data.Old;
            } else {
                this.Value.SmallCaps = undefined;
            }
            break;
        case historyitem_TextPr_Position:
            if (undefined != Data.Old) {
                this.Value.Position = Data.Old;
            } else {
                this.Value.Position = undefined;
            }
            break;
        case historyitem_TextPr_Value:
            this.Value = Data.Old;
            break;
        case historyitem_TextPr_RFonts:
            if (undefined != Data.Old) {
                this.Value.RFonts = Data.Old;
            } else {
                this.Value.RFonts = new CRFonts();
            }
            break;
        case historyitem_TextPr_Lang:
            if (undefined != Data.Old) {
                this.Value.Lang = Data.Old;
            } else {
                this.Value.Lang = new CLang();
            }
            break;
        case historyitem_TextPr_RFonts_Ascii:
            if (undefined != Data.Old) {
                this.Value.RFonts.Ascii = Data.Old;
            } else {
                this.Value.RFonts.Ascii = undefined;
            }
            break;
        case historyitem_TextPr_RFonts_HAnsi:
            if (undefined != Data.Old) {
                this.Value.RFonts.Ascii = Data.Old;
            } else {
                this.Value.RFonts.Ascii = undefined;
            }
            break;
        case historyitem_TextPr_RFonts_CS:
            if (undefined != Data.Old) {
                this.Value.RFonts.Ascii = Data.Old;
            } else {
                this.Value.RFonts.Ascii = undefined;
            }
            break;
        case historyitem_TextPr_RFonts_EastAsia:
            if (undefined != Data.Old) {
                this.Value.RFonts.Ascii = Data.Old;
            } else {
                this.Value.RFonts.Ascii = undefined;
            }
            break;
        case historyitem_TextPr_RFonts_Hint:
            if (undefined != Data.Old) {
                this.Value.RFonts.Ascii = Data.Old;
            } else {
                this.Value.RFonts.Ascii = undefined;
            }
            break;
        case historyitem_TextPr_Lang_Bidi:
            if (undefined != Data.Old) {
                this.Value.Lang.Bidi = Data.Old;
            } else {
                this.Value.Lang.Bidi = undefined;
            }
            break;
        case historyitem_TextPr_Lang_EastAsia:
            if (undefined != Data.Old) {
                this.Value.Lang.EastAsia = Data.Old;
            } else {
                this.Value.Lang.EastAsia = undefined;
            }
            break;
        case historyitem_TextPr_Lang_Val:
            if (undefined != Data.Old) {
                this.Value.Lang.Val = Data.Old;
            } else {
                this.Value.Lang.Val = undefined;
            }
            break;
        case historyitem_TextPr_Unifill:
            if (undefined != Data.Old) {
                this.Value.Unifill = Data.Old;
            } else {
                this.Value.Unifill = undefined;
            }
            break;
        }
    },
    Redo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_TextPr_Change:
            if (undefined != Data.New) {
                this.Value[Data.Prop] = Data.New;
            } else {
                this.Value[Data.Prop] = undefined;
            }
            break;
        case historyitem_TextPr_Bold:
            if (undefined != Data.New) {
                this.Value.Bold = Data.New;
            } else {
                this.Value.Bold = undefined;
            }
            break;
        case historyitem_TextPr_Italic:
            if (undefined != Data.New) {
                this.Value.Italic = Data.New;
            } else {
                this.Value.Italic = undefined;
            }
            break;
        case historyitem_TextPr_Strikeout:
            if (undefined != Data.New) {
                this.Value.Strikeout = Data.New;
            } else {
                this.Value.Strikeout = undefined;
            }
            break;
        case historyitem_TextPr_Underline:
            if (undefined != Data.New) {
                this.Value.Underline = Data.New;
            } else {
                this.Value.Underline = undefined;
            }
            break;
        case historyitem_TextPr_FontFamily:
            if (undefined != Data.New) {
                this.Value.FontFamily = Data.New;
            } else {
                this.Value.FontFamily = undefined;
            }
            break;
        case historyitem_TextPr_FontSize:
            if (undefined != Data.New) {
                this.Value.FontSize = Data.New;
            } else {
                this.Value.FontSize = undefined;
            }
            break;
        case historyitem_TextPr_FontSizeCS:
            if (undefined != Data.New) {
                this.Value.FontSizeCS = Data.New;
            } else {
                this.Value.FontSizeCS = undefined;
            }
            break;
        case historyitem_TextPr_Color:
            if (undefined != Data.New) {
                this.Value.Color = Data.New;
            } else {
                this.Value.Color = undefined;
            }
            break;
        case historyitem_TextPr_VertAlign:
            if (undefined != Data.New) {
                this.Value.VertAlign = Data.New;
            } else {
                this.Value.VertAlign = undefined;
            }
            break;
        case historyitem_TextPr_HighLight:
            if (undefined != Data.New) {
                this.Value.HighLight = Data.New;
            } else {
                this.Value.HighLight = undefined;
            }
            break;
        case historyitem_TextPr_RStyle:
            if (undefined != Data.New) {
                this.Value.RStyle = Data.New;
            } else {
                this.Value.RStyle = undefined;
            }
            break;
        case historyitem_TextPr_Spacing:
            if (undefined != Data.New) {
                this.Value.Spacing = Data.New;
            } else {
                this.Value.Spacing = undefined;
            }
            break;
        case historyitem_TextPr_DStrikeout:
            if (undefined != Data.New) {
                this.Value.DStrikeout = Data.New;
            } else {
                this.Value.DStrikeout = undefined;
            }
            break;
        case historyitem_TextPr_Caps:
            if (undefined != Data.New) {
                this.Value.Caps = Data.New;
            } else {
                this.Value.Caps = undefined;
            }
            break;
        case historyitem_TextPr_SmallCaps:
            if (undefined != Data.New) {
                this.Value.SmallCaps = Data.New;
            } else {
                this.Value.SmallCaps = undefined;
            }
            break;
        case historyitem_TextPr_Position:
            if (undefined != Data.New) {
                this.Value.Position = Data.New;
            } else {
                this.Value.Position = undefined;
            }
            break;
        case historyitem_TextPr_Value:
            this.Value = Data.New;
            break;
        case historyitem_TextPr_RFonts:
            if (undefined != Data.New) {
                this.Value.RFonts = Data.New;
            } else {
                this.Value.RFonts = new CRFonts();
            }
            break;
        case historyitem_TextPr_Lang:
            if (undefined != Data.New) {
                this.Value.Lang = Data.New;
            } else {
                this.Value.Lang = new CLang();
            }
            break;
        case historyitem_TextPr_RFonts_Ascii:
            if (undefined != Data.New) {
                this.Value.RFonts.Ascii = Data.New;
            } else {
                this.Value.RFonts.Ascii = undefined;
            }
            break;
        case historyitem_TextPr_RFonts_HAnsi:
            if (undefined != Data.New) {
                this.Value.RFonts.Ascii = Data.New;
            } else {
                this.Value.RFonts.Ascii = undefined;
            }
            break;
        case historyitem_TextPr_RFonts_CS:
            if (undefined != Data.New) {
                this.Value.RFonts.Ascii = Data.New;
            } else {
                this.Value.RFonts.Ascii = undefined;
            }
            break;
        case historyitem_TextPr_RFonts_EastAsia:
            if (undefined != Data.New) {
                this.Value.RFonts.Ascii = Data.New;
            } else {
                this.Value.RFonts.Ascii = undefined;
            }
            break;
        case historyitem_TextPr_RFonts_Hint:
            if (undefined != Data.New) {
                this.Value.RFonts.Ascii = Data.New;
            } else {
                this.Value.RFonts.Ascii = undefined;
            }
            break;
        case historyitem_TextPr_Lang_Bidi:
            if (undefined != Data.New) {
                this.Value.Lang.Bidi = Data.New;
            } else {
                this.Value.Lang.Bidi = undefined;
            }
            break;
        case historyitem_TextPr_Lang_EastAsia:
            if (undefined != Data.New) {
                this.Value.Lang.EastAsia = Data.New;
            } else {
                this.Value.Lang.EastAsia = undefined;
            }
            break;
        case historyitem_TextPr_Lang_Val:
            if (undefined != Data.New) {
                this.Value.Lang.Val = Data.New;
            } else {
                this.Value.Lang.Val = undefined;
            }
            break;
        case historyitem_TextPr_Unifill:
            if (undefined != Data.New) {
                this.Value.Unifill = Data.New;
            } else {
                this.Value.Unifill = undefined;
            }
            break;
        }
    },
    Get_ParentObject_or_DocumentPos: function () {
        if (null != this.Parent) {
            return this.Parent.Get_ParentObject_or_DocumentPos();
        }
    },
    Refresh_RecalcData: function (Data) {
        if (undefined !== this.Parent && null !== this.Parent) {
            this.Parent.Refresh_RecalcData2();
        }
    },
    Write_ToBinary: function (Writer) {
        Writer.WriteLong(this.Type);
        Writer.WriteString2(this.Id);
    },
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(historyitem_type_TextPr);
        Writer.WriteLong(this.Type);
        Writer.WriteString2(this.Id);
        this.Value.Write_ToBinary(Writer);
    },
    Read_FromBinary2: function (Reader) {
        this.Type = Reader.GetLong();
        this.Id = Reader.GetString2();
        this.Value.Clear();
        this.Value.Read_FromBinary(Reader);
    },
    Save_Changes: function (Data, Writer) {
        Writer.WriteLong(historyitem_type_TextPr);
        var Type = Data.Type;
        Writer.WriteLong(Type);
        switch (Type) {
        case historyitem_TextPr_Change:
            var TextPr = new CTextPr();
            TextPr[Data.Prop] = Data.New;
            TextPr.Write_ToBinary(Writer);
            break;
        case historyitem_TextPr_Bold:
            case historyitem_TextPr_Italic:
            case historyitem_TextPr_Strikeout:
            case historyitem_TextPr_Underline:
            if (undefined != Data.New) {
                Writer.WriteBool(false);
                Writer.WriteBool(Data.New);
            } else {
                Writer.WriteBool(true);
            }
            break;
        case historyitem_TextPr_FontFamily:
            if (undefined != Data.New) {
                Writer.WriteBool(false);
                Writer.WriteString2(Data.New.Name);
            } else {
                Writer.WriteBool(true);
            }
            break;
        case historyitem_TextPr_FontSize:
            case historyitem_TextPr_FontSizeCS:
            if (undefined != Data.New) {
                Writer.WriteBool(false);
                Writer.WriteDouble(Data.New);
            } else {
                Writer.WriteBool(true);
            }
            break;
        case historyitem_TextPr_Color:
            case historyitem_TextPr_Unifill:
            if (undefined != Data.New) {
                Writer.WriteBool(false);
                Data.New.Write_ToBinary(Writer);
            } else {
                Writer.WriteBool(true);
            }
            break;
        case historyitem_TextPr_VertAlign:
            if (undefined != Data.New) {
                Writer.WriteBool(false);
                Writer.WriteLong(Data.New);
            } else {
                Writer.WriteBool(true);
            }
            break;
        case historyitem_TextPr_HighLight:
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
        case historyitem_TextPr_RStyle:
            if (undefined != Data.New) {
                Writer.WriteBool(false);
                Writer.WriteString2(Data.New);
            } else {
                Writer.WriteBool(true);
            }
            break;
        case historyitem_TextPr_Spacing:
            case historyitem_TextPr_Position:
            if (undefined != Data.New) {
                Writer.WriteBool(false);
                Writer.WriteDouble(Data.New);
            } else {
                Writer.WriteBool(true);
            }
            break;
        case historyitem_TextPr_DStrikeout:
            case historyitem_TextPr_Caps:
            case historyitem_TextPr_SmallCaps:
            if (undefined != Data.New) {
                Writer.WriteBool(false);
                Writer.WriteBool(Data.New);
            } else {
                Writer.WriteBool(true);
            }
            break;
        case historyitem_TextPr_Value:
            Data.New.Write_ToBinary(Writer);
            break;
        case historyitem_TextPr_RFonts:
            if (undefined != Data.New) {
                Writer.WriteBool(false);
                Data.New.Write_ToBinary(Writer);
            } else {
                Writer.WriteBool(true);
            }
            break;
        case historyitem_TextPr_Lang:
            if (undefined != Data.New) {
                Writer.WriteBool(false);
                Data.New.Write_ToBinary(Writer);
            } else {
                Writer.WriteBool(true);
            }
            break;
        case historyitem_TextPr_RFonts_Ascii:
            case historyitem_TextPr_RFonts_HAnsi:
            case historyitem_TextPr_RFonts_CS:
            case historyitem_TextPr_RFonts_EastAsia:
            if (undefined != Data.New) {
                Writer.WriteBool(false);
                Writer.WriteString2(Data.New.Name);
            } else {
                Writer.WriteBool(true);
            }
            break;
        case historyitem_TextPr_RFonts_Hint:
            if (undefined != Data.New) {
                Writer.WriteBool(false);
                Writer.WriteLong(Data.New);
            } else {
                Writer.WriteBool(true);
            }
            break;
        case historyitem_TextPr_Lang_Bidi:
            case historyitem_TextPr_Lang_EastAsia:
            case historyitem_TextPr_Lang_Val:
            if (undefined != Data.New) {
                Writer.WriteBool(false);
                Writer.WriteLong(Data.New);
            } else {
                Writer.WriteBool(true);
            }
            break;
        }
        return Writer;
    },
    Load_Changes: function (Reader) {
        var ClassType = Reader.GetLong();
        if (historyitem_type_TextPr != ClassType) {
            return;
        }
        var Type = Reader.GetLong();
        switch (Type) {
        case historyitem_TextPr_Change:
            var TextPr = new CTextPr();
            TextPr.Read_FromBinary(Reader);
            this.Value.Merge(TextPr);
            break;
        case historyitem_TextPr_Bold:
            if (true === Reader.GetBool()) {
                this.Value.Bold = undefined;
            } else {
                this.Value.Bold = Reader.GetBool();
            }
            break;
        case historyitem_TextPr_Italic:
            if (true === Reader.GetBool()) {
                this.Value.Italic = undefined;
            } else {
                this.Value.Italic = Reader.GetBool();
            }
            break;
        case historyitem_TextPr_Strikeout:
            if (true === Reader.GetBool()) {
                this.Value.Strikeout = undefined;
            } else {
                this.Value.Strikeout = Reader.GetBool();
            }
            break;
        case historyitem_TextPr_Underline:
            if (true != Reader.GetBool()) {
                this.Value.Underline = Reader.GetBool();
            } else {
                this.Value.Underline = undefined;
            }
            break;
        case historyitem_TextPr_FontFamily:
            if (true != Reader.GetBool()) {
                this.Value.FontFamily = {
                    Name: Reader.GetString2(),
                    Index: -1
                };
            } else {
                this.Value.FontFamily = undefined;
            }
            break;
        case historyitem_TextPr_FontSize:
            if (true != Reader.GetBool()) {
                this.Value.FontSize = Reader.GetDouble();
            } else {
                this.Value.FontSize = undefined;
            }
            break;
        case historyitem_TextPr_FontSizeCS:
            if (true != Reader.GetBool()) {
                this.Value.FontSizeCS = Reader.GetDouble();
            } else {
                this.Value.FontSizeCS = undefined;
            }
            break;
        case historyitem_TextPr_Color:
            if (true != Reader.GetBool()) {
                var r = Reader.GetByte();
                var g = Reader.GetByte();
                var b = Reader.GetByte();
                this.Value.Color = new CDocumentColor(r, g, b);
            } else {
                this.Value.Color = undefined;
            }
            break;
        case historyitem_TextPr_Unifill:
            if (true != Reader.GetBool()) {
                var unifill = new CUniFill();
                unifill.Read_FromBinary(Reader);
                this.Value.Unifill = unifill;
            } else {
                this.Value.Unifill = undefined;
            }
            break;
        case historyitem_TextPr_VertAlign:
            if (true != Reader.GetBool()) {
                this.Value.VertAlign = Reader.GetLong();
            } else {
                this.Value.VertAlign = undefined;
            }
            break;
        case historyitem_TextPr_HighLight:
            if (true != Reader.GetBool()) {
                if (true != Reader.GetBool()) {
                    this.Value.HighLight = new CDocumentColor(0, 0, 0);
                    this.Value.HighLight.Read_FromBinary(Reader);
                } else {
                    this.Value.HighLight = highlight_None;
                }
            } else {
                this.Value.HighLight = undefined;
            }
            break;
        case historyitem_TextPr_RStyle:
            if (true != Reader.GetBool()) {
                this.Value.RStyle = Reader.GetString2();
            } else {
                this.Value.RStyle = undefined;
            }
            break;
        case historyitem_TextPr_Spacing:
            if (true != Reader.GetBool()) {
                this.Value.Spacing = Reader.GetDouble();
            } else {
                this.Value.Spacing = undefined;
            }
            break;
        case historyitem_TextPr_DStrikeout:
            if (true != Reader.GetBool()) {
                this.Value.DStrikeout = Reader.GetBool();
            } else {
                this.Value.DStrikeout = undefined;
            }
            break;
        case historyitem_TextPr_Caps:
            if (true != Reader.GetBool()) {
                this.Value.Caps = Reader.GetBool();
            } else {
                this.Value.Caps = undefined;
            }
            break;
        case historyitem_TextPr_SmallCaps:
            if (true != Reader.GetBool()) {
                this.Value.SmallCaps = Reader.GetBool();
            } else {
                this.Value.SmallCaps = undefined;
            }
            break;
        case historyitem_TextPr_Position:
            if (true != Reader.GetBool()) {
                this.Value.Position = Reader.GetDouble();
            } else {
                this.Value.Position = undefined;
            }
            break;
        case historyitem_TextPr_Value:
            this.Value = new CTextPr();
            this.Value.Read_FromBinary(Reader);
            break;
        case historyitem_TextPr_RFonts:
            if (false === Reader.GetBool()) {
                this.Value.RFonts = new CRFonts();
                this.Value.RFonts.Read_FromBinary(Reader);
            } else {
                this.Value.RFonts = new CRFonts();
            }
            break;
        case historyitem_TextPr_Lang:
            if (false === Reader.GetBool()) {
                this.Value.Lang = new CLang();
                this.Value.Lang.Read_FromBinary(Reader);
            } else {
                this.Value.Lang = new CLang();
            }
            break;
        case historyitem_TextPr_RFonts_Ascii:
            if (false === Reader.GetBool()) {
                this.Value.RFonts.Ascii = {
                    Name: Reader.GetString2(),
                    Index: -1
                };
            } else {
                this.Value.RFonts.Ascii = undefined;
            }
            break;
        case historyitem_TextPr_RFonts_HAnsi:
            if (false === Reader.GetBool()) {
                this.Value.RFonts.HAnsi = {
                    Name: Reader.GetString2(),
                    Index: -1
                };
            } else {
                this.Value.RFonts.HAnsi = undefined;
            }
            break;
        case historyitem_TextPr_RFonts_CS:
            if (false === Reader.GetBool()) {
                this.Value.RFonts.CS = {
                    Name: Reader.GetString2(),
                    Index: -1
                };
            } else {
                this.Value.RFonts.CS = undefined;
            }
            break;
        case historyitem_TextPr_RFonts_EastAsia:
            if (false === Reader.GetBool()) {
                this.Value.RFonts.EastAsia = {
                    Name: Reader.GetString2(),
                    Index: -1
                };
            } else {
                this.Value.RFonts.Ascii = undefined;
            }
            break;
        case historyitem_TextPr_RFonts_Hint:
            if (false === Reader.GetBool()) {
                this.Value.RFonts.Hint = Reader.GetLong();
            } else {
                this.Value.RFonts.Hint = undefined;
            }
            break;
        case historyitem_TextPr_Lang_Bidi:
            if (false === Reader.GetBool()) {
                this.Value.Lang.Bidi = Reader.GetLong();
            } else {
                this.Value.Lang.Bidi = undefined;
            }
            break;
        case historyitem_TextPr_Lang_EastAsia:
            if (false === Reader.GetBool()) {
                this.Value.Lang.EastAsia = Reader.GetLong();
            } else {
                this.Value.Lang.EastAsia = undefined;
            }
            break;
        case historyitem_TextPr_Lang_Val:
            if (false === Reader.GetBool()) {
                this.Value.Lang.Val = Reader.GetLong();
            } else {
                this.Value.Lang.Val = undefined;
            }
            break;
        }
    }
};
function ParaEnd() {
    this.SectionPr = null;
    this.WidthVisible = 0 | 0;
}
ParaEnd.prototype = {
    Type: para_End,
    Get_Type: function () {
        return para_End;
    },
    Draw: function (X, Y, Context, bEndCell) {
        if (undefined !== editor && editor.ShowParaMarks) {
            Context.SetFontSlot(fontslot_ASCII);
            if (null !== this.SectionPr) {
                Context.b_color1(0, 0, 0, 255);
                Context.p_color(0, 0, 0, 255);
                Context.SetFont({
                    FontFamily: {
                        Name: "Courier New",
                        Index: -1
                    },
                    FontSize: 8,
                    Italic: false,
                    Bold: false
                });
                var Widths = this.SectionPr.Widths;
                var strSectionBreak = this.SectionPr.Str;
                var Len = strSectionBreak.length;
                for (var Index = 0; Index < Len; Index++) {
                    Context.FillText(X, Y, strSectionBreak[Index]);
                    X += Widths[Index];
                }
            } else {
                if (true === bEndCell) {
                    Context.FillText(X, Y, String.fromCharCode(164));
                } else {
                    Context.FillText(X, Y, String.fromCharCode(182));
                }
            }
        }
    },
    Measure: function (Context, bEndCell) {
        Context.SetFontSlot(fontslot_ASCII);
        if (true === bEndCell) {
            this.WidthVisible = (Context.Measure(String.fromCharCode(164)).Width * TEXTWIDTH_DIVIDER) | 0;
        } else {
            this.WidthVisible = (Context.Measure(String.fromCharCode(182)).Width * TEXTWIDTH_DIVIDER) | 0;
        }
    },
    Get_Width: function () {
        return 0;
    },
    Get_WidthVisible: function () {
        return (this.WidthVisible / TEXTWIDTH_DIVIDER);
    },
    Set_WidthVisible: function (WidthVisible) {
        this.WidthVisible = (WidthVisible * TEXTWIDTH_DIVIDER) | 0;
    },
    Update_SectionPr: function (SectionPr, W) {
        var Type = SectionPr.Type;
        var strSectionBreak = "";
        switch (Type) {
        case section_type_Column:
            strSectionBreak = " Section Break (Column) ";
            break;
        case section_type_Continuous:
            strSectionBreak = " Section Break (Continuous) ";
            break;
        case section_type_EvenPage:
            strSectionBreak = " Section Break (Even Page) ";
            break;
        case section_type_NextPage:
            strSectionBreak = " Section Break (Next Page) ";
            break;
        case section_type_OddPage:
            strSectionBreak = " Section Break (Odd Page) ";
            break;
        }
        g_oTextMeasurer.SetFont({
            FontFamily: {
                Name: "Courier New",
                Index: -1
            },
            FontSize: 8,
            Italic: false,
            Bold: false
        });
        var Widths = [];
        var nStrWidth = 0;
        var Len = strSectionBreak.length;
        for (var Index = 0; Index < Len; Index++) {
            var Val = g_oTextMeasurer.Measure(strSectionBreak[Index]).Width;
            nStrWidth += Val;
            Widths[Index] = Val;
        }
        var strSymbol = ":";
        var nSymWidth = g_oTextMeasurer.Measure(strSymbol).Width * 2 / 3;
        var strResult = "";
        if (W - 6 * nSymWidth >= nStrWidth) {
            var Count = parseInt((W - nStrWidth) / (2 * nSymWidth));
            var strResult = strSectionBreak;
            for (var Index = 0; Index < Count; Index++) {
                strResult = strSymbol + strResult + strSymbol;
                Widths.splice(0, 0, nSymWidth);
                Widths.splice(Widths.length, 0, nSymWidth);
            }
        } else {
            var Count = parseInt(W / nSymWidth);
            for (var Index = 0; Index < Count; Index++) {
                strResult += strSymbol;
                Widths[Index] = nSymWidth;
            }
        }
        var ResultW = 0;
        var Count = Widths.length;
        for (var Index = 0; Index < Count; Index++) {
            ResultW += Widths[Index];
        }
        var AddW = 0;
        if (ResultW < W && Count > 1) {
            AddW = (W - ResultW) / (Count - 1);
        }
        for (var Index = 0; Index < Count - 1; Index++) {
            Widths[Index] += AddW;
        }
        this.SectionPr = {};
        this.SectionPr.OldWidth = this.Width;
        this.SectionPr.Str = strResult;
        this.SectionPr.Widths = Widths;
        var _W = (W * TEXTWIDTH_DIVIDER) | 0;
        this.WidthVisible = _W;
    },
    Clear_SectionPr: function () {
        this.SectionPr = null;
    },
    Is_RealContent: function () {
        return true;
    },
    Can_AddNumbering: function () {
        return true;
    },
    Copy: function () {
        return new ParaEnd();
    },
    Write_ToBinary: function (Writer) {
        Writer.WriteLong(para_End);
    },
    Read_FromBinary: function (Reader) {}
};
function ParaNewLine(BreakType) {
    this.BreakType = BreakType;
    this.Flags = {};
    this.Flags.Use = true;
    if (break_Page === this.BreakType) {
        this.Flags.NewLine = true;
    }
    this.Height = 0;
    this.Width = 0;
    this.WidthVisible = 0;
}
ParaNewLine.prototype = {
    Type: para_NewLine,
    Get_Type: function () {
        return para_NewLine;
    },
    Draw: function (X, Y, Context) {
        if (false === this.Flags.Use) {
            return;
        }
        if (undefined !== editor && editor.ShowParaMarks) {
            switch (this.BreakType) {
            case break_Line:
                Context.b_color1(0, 0, 0, 255);
                Context.SetFont({
                    FontFamily: {
                        Name: "ASCW3",
                        Index: -1
                    },
                    FontSize: 10,
                    Italic: false,
                    Bold: false
                });
                Context.FillText(X, Y, String.fromCharCode(56));
                break;
            case break_Page:
                var strPageBreak = this.Flags.BreakPageInfo.Str;
                var Widths = this.Flags.BreakPageInfo.Widths;
                Context.b_color1(0, 0, 0, 255);
                Context.SetFont({
                    FontFamily: {
                        Name: "Courier New",
                        Index: -1
                    },
                    FontSize: 8,
                    Italic: false,
                    Bold: false
                });
                var Len = strPageBreak.length;
                for (var Index = 0; Index < Len; Index++) {
                    Context.FillText(X, Y, strPageBreak[Index]);
                    X += Widths[Index];
                }
                break;
            }
        }
    },
    Measure: function (Context) {
        if (false === this.Flags.Use) {
            this.Width = 0;
            this.WidthVisible = 0;
            this.Height = 0;
            return;
        }
        switch (this.BreakType) {
        case break_Line:
            this.Width = 0;
            this.Height = 0;
            Context.SetFont({
                FontFamily: {
                    Name: "ASCW3",
                    Index: -1
                },
                FontSize: 10,
                Italic: false,
                Bold: false
            });
            var Temp = Context.Measure(String.fromCharCode(56));
            this.WidthVisible = Temp.Width * 1.7;
            break;
        case break_Page:
            this.Width = 0;
            this.Height = 0;
            break;
        }
    },
    Get_Width: function () {
        return this.Width;
    },
    Get_WidthVisible: function () {
        return this.WidthVisible;
    },
    Set_WidthVisible: function (WidthVisible) {
        this.WidthVisible = WidthVisible;
    },
    Update_String: function (_W) {
        if (false === this.Flags.Use) {
            this.Width = 0;
            this.WidthVisible = 0;
            this.Height = 0;
            return;
        }
        if (break_Page === this.BreakType) {
            var W = (false === this.Flags.NewLine ? 50 : _W);
            g_oTextMeasurer.SetFont({
                FontFamily: {
                    Name: "Courier New",
                    Index: -1
                },
                FontSize: 8,
                Italic: false,
                Bold: false
            });
            var Widths = [];
            var nStrWidth = 0;
            var strBreakPage = " Page Break ";
            var Len = strBreakPage.length;
            for (var Index = 0; Index < Len; Index++) {
                var Val = g_oTextMeasurer.Measure(strBreakPage[Index]).Width;
                nStrWidth += Val;
                Widths[Index] = Val;
            }
            var strSymbol = String.fromCharCode("0x00B7");
            var nSymWidth = g_oTextMeasurer.Measure(strSymbol).Width * 2 / 3;
            var strResult = "";
            if (W - 6 * nSymWidth >= nStrWidth) {
                var Count = parseInt((W - nStrWidth) / (2 * nSymWidth));
                var strResult = strBreakPage;
                for (var Index = 0; Index < Count; Index++) {
                    strResult = strSymbol + strResult + strSymbol;
                    Widths.splice(0, 0, nSymWidth);
                    Widths.splice(Widths.length, 0, nSymWidth);
                }
            } else {
                var Count = parseInt(W / nSymWidth);
                for (var Index = 0; Index < Count; Index++) {
                    strResult += strSymbol;
                    Widths[Index] = nSymWidth;
                }
            }
            var ResultW = 0;
            var Count = Widths.length;
            for (var Index = 0; Index < Count; Index++) {
                ResultW += Widths[Index];
            }
            var AddW = 0;
            if (ResultW < W && Count > 1) {
                AddW = (W - ResultW) / (Count - 1);
            }
            for (var Index = 0; Index < Count - 1; Index++) {
                Widths[Index] += AddW;
            }
            this.Flags.BreakPageInfo = {};
            this.Flags.BreakPageInfo.Str = strResult;
            this.Flags.BreakPageInfo.Widths = Widths;
            this.Width = W;
            this.WidthVisible = W;
        }
    },
    Is_RealContent: function () {
        return true;
    },
    Can_AddNumbering: function () {
        if (break_Line === this.BreakType) {
            return true;
        }
        return false;
    },
    Copy: function () {
        return new ParaNewLine(this.BreakType);
    },
    Is_NewLine: function () {
        if (break_Line === this.BreakType || (break_Page === this.BreakType && true === this.Flags.NewLine)) {
            return true;
        }
        return false;
    },
    Write_ToBinary: function (Writer) {
        Writer.WriteLong(para_NewLine);
        Writer.WriteLong(this.BreakType);
        if (break_Page === this.BreakType) {
            Writer.WriteBool(this.Flags.NewLine);
        }
    },
    Read_FromBinary: function (Reader) {
        this.BreakType = Reader.GetLong();
        if (break_Page === this.BreakType) {
            this.Flags = {
                NewLine: Reader.GetBool()
            };
        }
    }
};
function ParaNumbering() {
    this.Type = para_Numbering;
    this.Item = null;
    this.Run = null;
    this.Line = 0;
    this.Range = 0;
    this.Internal = {
        NumInfo: undefined
    };
}
ParaNumbering.prototype = {
    Type: para_Numbering,
    Draw: function (X, Y, Context, Numbering, TextPr, NumPr, Theme) {
        Numbering.Draw(NumPr.NumId, NumPr.Lvl, X, Y, Context, this.Internal.NumInfo, TextPr, Theme);
    },
    Measure: function (Context, Numbering, NumInfo, TextPr, NumPr, Theme) {
        this.Internal.NumInfo = NumInfo;
        this.Width = 0;
        this.Height = 0;
        this.WidthVisible = 0;
        this.WidthNum = 0;
        this.WidthSuff = 0;
        if (undefined === Numbering) {
            return {
                Width: this.Width,
                Height: this.Height,
                WidthVisible: this.WidthVisible
            };
        }
        var Temp = Numbering.Measure(NumPr.NumId, NumPr.Lvl, Context, NumInfo, TextPr, Theme);
        this.Width = Temp.Width;
        this.WidthVisible = Temp.Width;
        this.WidthNum = Temp.Width;
        this.WidthSuff = 0;
        this.Height = Temp.Ascent;
    },
    Check_Range: function (Range, Line) {
        if (null !== this.Item && null !== this.Run && Range === this.Range && Line === this.Line) {
            return true;
        }
        return false;
    },
    Is_RealContent: function () {
        return true;
    },
    Can_AddNumbering: function () {
        return false;
    },
    Copy: function () {
        return new ParaNumbering();
    },
    Write_ToBinary: function (Writer) {
        Writer.WriteLong(this.Type);
    },
    Read_FromBinary: function (Reader) {}
};
var tab_Clear = 0;
var tab_Left = 1;
var tab_Right = 2;
var tab_Center = 3;
var tab_Symbol = 34;
function ParaTab() {
    this.TabType = tab_Left;
    this.Width = 0;
    this.WidthVisible = 0;
    this.RealWidth = 0;
}
ParaTab.prototype = {
    Type: para_Tab,
    Get_Type: function () {
        return para_Tab;
    },
    Draw: function (X, Y, Context) {
        if (typeof(editor) !== "undefined" && editor.ShowParaMarks) {
            var X0 = this.Width / 2 - this.RealWidth / 2;
            Context.SetFont({
                FontFamily: {
                    Name: "ASCW3",
                    Index: -1
                },
                FontSize: 10,
                Italic: false,
                Bold: false
            });
            if (X0 > 0) {
                Context.FillText2(X + X0, Y, String.fromCharCode(tab_Symbol), 0, this.Width);
            } else {
                Context.FillText2(X, Y, String.fromCharCode(tab_Symbol), this.RealWidth - this.Width, this.Width);
            }
        }
    },
    Measure: function (Context) {
        Context.SetFont({
            FontFamily: {
                Name: "ASCW3",
                Index: -1
            },
            FontSize: 10,
            Italic: false,
            Bold: false
        });
        this.RealWidth = Context.Measure(String.fromCharCode(tab_Symbol)).Width;
    },
    Get_Width: function () {
        return this.Width;
    },
    Get_WidthVisible: function () {
        return this.WidthVisible;
    },
    Set_WidthVisible: function (WidthVisible) {
        this.WidthVisible = WidthVisible;
    },
    Is_RealContent: function () {
        return true;
    },
    Can_AddNumbering: function () {
        return true;
    },
    Copy: function () {
        return new ParaTab();
    },
    Write_ToBinary: function (Writer) {
        Writer.WriteLong(para_Tab);
        Writer.WriteLong(this.TabType);
    },
    Read_FromBinary: function (Reader) {
        this.TabType = Reader.GetLong();
    }
};
var drawing_Inline = 1;
var drawing_Anchor = 2;
function CParagraphLayout(X, Y, PageNum, LastItemW, ColumnStartX, ColumnEndX, Left_Margin, Right_Margin, Page_W, Top_Margin, Bottom_Margin, Page_H, MarginH, MarginV, LineTop, ParagraphTop) {
    this.X = X;
    this.Y = Y;
    this.PageNum = PageNum;
    this.LastItemW = LastItemW;
    this.ColumnStartX = ColumnStartX;
    this.ColumnEndX = ColumnEndX;
    this.Left_Margin = Left_Margin;
    this.Right_Margin = Right_Margin;
    this.Page_W = Page_W;
    this.Top_Margin = Top_Margin;
    this.Bottom_Margin = Bottom_Margin;
    this.Page_H = Page_H;
    this.Margin_H = MarginH;
    this.Margin_V = MarginV;
    this.LineTop = LineTop;
    this.ParagraphTop = ParagraphTop;
}
function CAnchorPosition() {
    this.CalcX = 0;
    this.CalcY = 0;
    this.YOffset = 0;
    this.W = 0;
    this.H = 0;
    this.X = 0;
    this.Y = 0;
    this.PageNum = 0;
    this.LastItemW = 0;
    this.ColumnStartX = 0;
    this.ColumnEndX = 0;
    this.Left_Margin = 0;
    this.Right_Margin = 0;
    this.Page_W = 0;
    this.Top_Margin = 0;
    this.Bottom_Margin = 0;
    this.Page_H = 0;
    this.Margin_H = 0;
    this.Margin_V = 0;
    this.LineTop = 0;
    this.ParagraphTop = 0;
    this.Page_X = 0;
    this.Page_Y = 0;
}
CAnchorPosition.prototype = {
    Set: function (W, H, YOffset, ParaLayout, PageLimits) {
        this.W = W;
        this.H = H;
        this.YOffset = YOffset;
        this.X = ParaLayout.X;
        this.Y = ParaLayout.Y;
        this.PageNum = ParaLayout.PageNum;
        this.LastItemW = ParaLayout.LastItemW;
        this.ColumnStartX = ParaLayout.ColumnStartX;
        this.ColumnEndX = ParaLayout.ColumnEndX;
        this.Left_Margin = ParaLayout.Left_Margin;
        this.Right_Margin = ParaLayout.Right_Margin;
        this.Page_W = ParaLayout.Page_W;
        this.Top_Margin = ParaLayout.Top_Margin;
        this.Bottom_Margin = ParaLayout.Bottom_Margin;
        this.Page_H = ParaLayout.Page_H;
        this.Margin_H = ParaLayout.Margin_H;
        this.Margin_V = ParaLayout.Margin_V;
        this.LineTop = ParaLayout.LineTop;
        this.ParagraphTop = ParaLayout.ParagraphTop;
        this.Page_X = PageLimits.X;
        this.Page_Y = PageLimits.Y;
    },
    Calculate_X: function (bInline, RelativeFrom, bAlign, Value) {
        if (true === bInline) {
            this.CalcX = this.X;
        } else {
            switch (RelativeFrom) {
            case c_oAscRelativeFromH.Character:
                var _X = this.X - this.LastItemW;
                if (true === bAlign) {
                    switch (Value) {
                    case c_oAscAlignH.Center:
                        this.CalcX = _X - this.W / 2;
                        break;
                    case c_oAscAlignH.Inside:
                        case c_oAscAlignH.Outside:
                        case c_oAscAlignH.Left:
                        this.CalcX = _X;
                        break;
                    case c_oAscAlignH.Right:
                        this.CalcX = _X - this.W;
                        break;
                    }
                } else {
                    this.CalcX = _X + Value;
                }
                break;
            case c_oAscRelativeFromH.Column:
                if (true === bAlign) {
                    switch (Value) {
                    case c_oAscAlignH.Center:
                        this.CalcX = (this.ColumnEndX + this.ColumnStartX - this.W) / 2;
                        break;
                    case c_oAscAlignH.Inside:
                        case c_oAscAlignH.Outside:
                        case c_oAscAlignH.Left:
                        this.CalcX = this.ColumnStartX;
                        break;
                    case c_oAscAlignH.Right:
                        this.CalcX = this.ColumnEndX - this.W;
                        break;
                    }
                } else {
                    this.CalcX = this.ColumnStartX + Value;
                }
                break;
            case c_oAscRelativeFromH.InsideMargin:
                case c_oAscRelativeFromH.LeftMargin:
                case c_oAscRelativeFromH.OutsideMargin:
                if (true === bAlign) {
                    switch (Value) {
                    case c_oAscAlignH.Center:
                        this.CalcX = (this.Left_Margin - this.W) / 2;
                        break;
                    case c_oAscAlignH.Inside:
                        case c_oAscAlignH.Outside:
                        case c_oAscAlignH.Left:
                        this.CalcX = 0;
                        break;
                    case c_oAscAlignH.Right:
                        this.CalcX = this.Left_Margin - this.W;
                        break;
                    }
                } else {
                    this.CalcX = Value;
                }
                break;
            case c_oAscRelativeFromH.Margin:
                var X_s = this.Left_Margin;
                var X_e = this.Page_W - this.Right_Margin;
                if (true === bAlign) {
                    switch (Value) {
                    case c_oAscAlignH.Center:
                        this.CalcX = (X_e + X_s - this.W) / 2;
                        break;
                    case c_oAscAlignH.Inside:
                        case c_oAscAlignH.Outside:
                        case c_oAscAlignH.Left:
                        this.CalcX = X_s;
                        break;
                    case c_oAscAlignH.Right:
                        this.CalcX = X_e - this.W;
                        break;
                    }
                } else {
                    this.CalcX = this.Margin_H + Value;
                }
                break;
            case c_oAscRelativeFromH.Page:
                if (true === bAlign) {
                    switch (Value) {
                    case c_oAscAlignH.Center:
                        this.CalcX = (this.Page_W - this.W) / 2;
                        break;
                    case c_oAscAlignH.Inside:
                        case c_oAscAlignH.Outside:
                        case c_oAscAlignH.Left:
                        this.CalcX = 0;
                        break;
                    case c_oAscAlignH.Right:
                        this.CalcX = this.Page_W - this.W;
                        break;
                    }
                } else {
                    this.CalcX = Value + this.Page_X;
                }
                break;
            case c_oAscRelativeFromH.RightMargin:
                var X_s = this.Page_W - this.Right_Margin;
                var X_e = this.Page_W;
                if (true === bAlign) {
                    switch (Value) {
                    case c_oAscAlignH.Center:
                        this.CalcX = (X_e + X_s - this.W) / 2;
                        break;
                    case c_oAscAlignH.Inside:
                        case c_oAscAlignH.Outside:
                        case c_oAscAlignH.Left:
                        this.CalcX = X_s;
                        break;
                    case c_oAscAlignH.Right:
                        this.CalcX = X_e - this.W;
                        break;
                    }
                } else {
                    this.CalcX = X_s + Value;
                }
                break;
            }
        }
        return this.CalcX;
    },
    Calculate_Y: function (bInline, RelativeFrom, bAlign, Value) {
        if (true === bInline) {
            this.CalcY = this.Y - this.H - this.YOffset;
        } else {
            switch (RelativeFrom) {
            case c_oAscRelativeFromV.BottomMargin:
                case c_oAscRelativeFromV.InsideMargin:
                case c_oAscRelativeFromV.OutsideMargin:
                var _Y = this.Page_H - this.Bottom_Margin;
                if (true === bAlign) {
                    switch (Value) {
                    case c_oAscAlignV.Bottom:
                        case c_oAscAlignV.Outside:
                        this.CalcY = this.Page_H - this.H;
                        break;
                    case c_oAscAlignV.Center:
                        this.CalcY = (_Y + this.Page_H - this.H) / 2;
                        break;
                    case c_oAscAlignV.Inside:
                        case c_oAscAlignV.Top:
                        this.CalcY = _Y;
                        break;
                    }
                } else {
                    this.CalcY = _Y + Value;
                }
                break;
            case c_oAscRelativeFromV.Line:
                var _Y = this.LineTop;
                if (true === bAlign) {
                    switch (Value) {
                    case c_oAscAlignV.Bottom:
                        case c_oAscAlignV.Outside:
                        this.CalcY = _Y - this.H;
                        break;
                    case c_oAscAlignV.Center:
                        this.CalcY = _Y - this.H / 2;
                        break;
                    case c_oAscAlignV.Inside:
                        case c_oAscAlignV.Top:
                        this.CalcY = _Y;
                        break;
                    }
                } else {
                    this.CalcY = _Y + Value;
                }
                break;
            case c_oAscRelativeFromV.Margin:
                var Y_s = this.Top_Margin;
                var Y_e = this.Page_H - this.Bottom_Margin;
                if (true === bAlign) {
                    switch (Value) {
                    case c_oAscAlignV.Bottom:
                        case c_oAscAlignV.Outside:
                        this.CalcY = Y_e - this.H;
                        break;
                    case c_oAscAlignV.Center:
                        this.CalcY = (Y_s + Y_e - this.H) / 2;
                        break;
                    case c_oAscAlignV.Inside:
                        case c_oAscAlignV.Top:
                        this.CalcY = Y_s;
                        break;
                    }
                } else {
                    this.CalcY = this.Margin_V + Value;
                }
                break;
            case c_oAscRelativeFromV.Page:
                if (true === bAlign) {
                    switch (Value) {
                    case c_oAscAlignV.Bottom:
                        case c_oAscAlignV.Outside:
                        this.CalcY = this.Page_H - this.H;
                        break;
                    case c_oAscAlignV.Center:
                        this.CalcY = (this.Page_H - this.H) / 2;
                        break;
                    case c_oAscAlignV.Inside:
                        case c_oAscAlignV.Top:
                        this.CalcY = 0;
                        break;
                    }
                } else {
                    this.CalcY = Value + this.Page_Y;
                }
                break;
            case c_oAscRelativeFromV.Paragraph:
                var _Y = this.ParagraphTop;
                if (true === bAlign) {
                    this.CalcY = _Y;
                } else {
                    this.CalcY = _Y + Value;
                }
                break;
            case c_oAscRelativeFromV.TopMargin:
                var Y_s = 0;
                var Y_e = this.Top_Margin;
                if (true === bAlign) {
                    switch (Value) {
                    case c_oAscAlignV.Bottom:
                        case c_oAscAlignV.Outside:
                        this.CalcY = Y_e - this.H;
                        break;
                    case c_oAscAlignV.Center:
                        this.CalcY = (Y_s + Y_e - this.H) / 2;
                        break;
                    case c_oAscAlignV.Inside:
                        case c_oAscAlignV.Top:
                        this.CalcY = Y_s;
                        break;
                    }
                } else {
                    this.CalcY = Y_s + Value;
                }
                break;
            }
        }
        return this.CalcY;
    },
    Correct_Values: function (bInline, PageLimits, AllowOverlap, UseTextWrap, OtherFlowObjects) {
        if (true != bInline) {
            var X_min = PageLimits.X;
            var Y_min = PageLimits.Y;
            var X_max = PageLimits.XLimit;
            var Y_max = PageLimits.YLimit;
            var W = this.W;
            var H = this.H;
            var CurX = this.CalcX;
            var CurY = this.CalcY;
            var bBreak = false;
            while (true != bBreak) {
                bBreak = true;
                for (var Index = 0; Index < OtherFlowObjects.length; Index++) {
                    var Drawing = OtherFlowObjects[Index];
                    if ((false === AllowOverlap || false === Drawing.AllowOverlap) && true === Drawing.Use_TextWrap() && true === UseTextWrap && (CurX <= Drawing.X + Drawing.W && CurX + W >= Drawing.X && CurY <= Drawing.Y + Drawing.H && CurY + H >= Drawing.Y)) {
                        if (Drawing.X + Drawing.W < X_max - W - 0.001) {
                            CurX = Drawing.X + Drawing.W + 0.001;
                        } else {
                            CurX = this.CalcX;
                            CurY = Drawing.Y + Drawing.H + 0.001;
                        }
                        bBreak = false;
                    }
                }
            }
            if (true === UseTextWrap) {
                if (CurX + W > X_max) {
                    CurX = X_max - W;
                }
                if (CurX < X_min) {
                    CurX = X_min;
                }
                if (CurY + H > Y_max) {
                    CurY = Y_max - H;
                }
                if (CurY < Y_min) {
                    CurY = Y_min;
                }
            }
            this.CalcX = CurX;
            this.CalcY = CurY;
        }
    },
    Calculate_X_Value: function (RelativeFrom) {
        var Value = 0;
        switch (RelativeFrom) {
        case c_oAscRelativeFromH.Character:
            Value = this.CalcX - this.X + this.LastItemW;
            break;
        case c_oAscRelativeFromH.Column:
            Value = this.CalcX - this.ColumnStartX;
            break;
        case c_oAscRelativeFromH.InsideMargin:
            case c_oAscRelativeFromH.LeftMargin:
            case c_oAscRelativeFromH.OutsideMargin:
            Value = this.CalcX;
            break;
        case c_oAscRelativeFromH.Margin:
            Value = this.CalcX - this.Margin_H;
            break;
        case c_oAscRelativeFromH.Page:
            Value = this.CalcX - this.Page_X;
            break;
        case c_oAscRelativeFromH.RightMargin:
            Value = this.CalcX - this.Page_W + this.Right_Margin;
            break;
        }
        return Value;
    },
    Calculate_Y_Value: function (RelativeFrom) {
        var Value = 0;
        switch (RelativeFrom) {
        case c_oAscRelativeFromV.BottomMargin:
            case c_oAscRelativeFromV.InsideMargin:
            case c_oAscRelativeFromV.OutsideMargin:
            Value = this.CalcY - this.Page_H + this.Bottom_Margin;
            break;
        case c_oAscRelativeFromV.Line:
            Value = this.CalcY - this.LineTop;
            break;
        case c_oAscRelativeFromV.Margin:
            Value = this.CalcY - this.Margin_V;
            break;
        case c_oAscRelativeFromV.Page:
            Value = this.CalcY - this.Page_Y;
            break;
        case c_oAscRelativeFromV.Paragraph:
            Value = this.CalcY - this.ParagraphTop;
            break;
        case c_oAscRelativeFromV.TopMargin:
            Value = this.CalcY;
            break;
        }
        return Value;
    }
};
var WRAPPING_TYPE_NONE = 0;
var WRAPPING_TYPE_SQUARE = 1;
var WRAPPING_TYPE_THROUGH = 2;
var WRAPPING_TYPE_TIGHT = 3;
var WRAPPING_TYPE_TOP_AND_BOTTOM = 4;
var MOVE_DELTA = 1e-07;
var HOR_REL_POS_TYPE_CHAR = 0;
var HOR_REL_POS_TYPE_COLUMN = 1;
var HOR_REL_POS_TYPE_INSIDE_MARGIN = 2;
var HOR_REL_POS_TYPE_LEFT_MARGIN = 3;
var HOR_REL_POS_TYPE_MARGIN = 4;
var HOR_REL_POS_TYPE_OUTSIDE_MARGIN = 5;
var HOR_REL_POS_TYPE_PAGE = 6;
var HOR_REL_POS_TYPE_RIGHT_MARGIN = 7;
var VER_REL_POS_TYPE_BOTTOM_MARGIN = 0;
var VER_REL_POS_TYPE_INSIDE_MARGIN = 1;
var VER_REL_POS_TYPE_LINE = 2;
var VER_REL_POS_TYPE_MARGIN = 3;
var VER_REL_POS_TYPE_OUTSIDE_MARGIN = 4;
var VER_REL_POS_TYPE_PAGE = 5;
var VER_REL_POS_TYPE_PARAGRAPH = 6;
var VER_REL_POS_TYPE_TOP_MARGIN = 7;
var POSITIONING_TYPE_ALIGN = 0;
var POSITIONING_TYPE_OFF = 1;
var WRAP_HIT_TYPE_POINT = 0;
var WRAP_HIT_TYPE_SECTION = 1;
function ParaDrawing(W, H, GraphicObj, DrawingDocument, DocumentContent, Parent) {
    this.Id = g_oIdCounter.Get_NewId();
    this.Lock = new CLock();
    if (false === g_oIdCounter.m_bLoad) {
        this.Lock.Set_Type(locktype_Mine, false);
        if (typeof CollaborativeEditing !== "undefined") {
            CollaborativeEditing.Add_Unlock2(this);
        }
    }
    this.DrawingType = drawing_Inline;
    this.GraphicObj = GraphicObj;
    this.X = 0;
    this.Y = 0;
    this.W = W;
    this.H = H;
    this.PageNum = 0;
    this.YOffset = 0;
    this.DocumentContent = DocumentContent;
    this.DrawingDocument = DrawingDocument;
    this.Parent = Parent;
    this.Distance = {
        T: 0,
        B: 0,
        L: 0,
        R: 0
    };
    this.LayoutInCell = true;
    this.RelativeHeight = undefined;
    this.SimplePos = {
        Use: false,
        X: 0,
        Y: 0
    };
    this.Extent = {
        W: W,
        H: H
    };
    this.AllowOverlap = true;
    this.PositionH = {
        RelativeFrom: c_oAscRelativeFromH.Column,
        Align: false,
        Value: 0
    };
    this.PositionV = {
        RelativeFrom: c_oAscRelativeFromV.Paragraph,
        Align: false,
        Value: 0
    };
    this.PositionH_Old = undefined;
    this.PositionV_Old = undefined;
    this.Internal_Position = new CAnchorPosition();
    this.selectX = 0;
    this.selectY = 0;
    this.wrappingType = WRAPPING_TYPE_THROUGH;
    if (typeof CWrapPolygon !== "undefined") {
        this.wrappingPolygon = new CWrapPolygon(this);
    }
    this.document = editor.WordControl.m_oLogicDocument;
    this.drawingDocument = DrawingDocument;
    this.graphicObjects = editor.WordControl.m_oLogicDocument.DrawingObjects;
    this.selected = false;
    this.behindDoc = false;
    this.bNoNeedToAdd = false;
    this.pageIndex = -1;
    this.snapArrayX = [];
    this.snapArrayY = [];
    this.bNeedUpdateWH = true;
    g_oTableId.Add(this, this.Id);
    if (this.graphicObjects) {
        this.graphicObjects.addGraphicObject(this);
    }
}
ParaDrawing.prototype = {
    Type: para_Drawing,
    Get_Type: function () {
        return para_Drawing;
    },
    Get_Width: function () {
        return this.Width;
    },
    Get_WidthVisible: function () {
        return this.WidthVisible;
    },
    Set_WidthVisible: function (WidthVisible) {
        this.WidthVisible = WidthVisible;
    },
    Get_SelectedContent: function (SelectedContent) {
        if (this.GraphicObj && this.GraphicObj.Get_SelectedContent) {
            this.GraphicObj.Get_SelectedContent(SelectedContent);
        }
    },
    Search_GetId: function (bNext, bCurrent) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.Search_GetId === "function") {
            return this.GraphicObj.Search_GetId(bNext, bCurrent);
        }
        return null;
    },
    canRotate: function () {
        return isRealObject(this.GraphicObj) && typeof this.GraphicObj.canRotate == "function" && this.GraphicObj.canRotate();
    },
    Get_Props: function (OtherProps) {
        var Props = {};
        Props.Width = this.GraphicObj.extX;
        Props.Height = this.GraphicObj.extY;
        if (drawing_Inline === this.DrawingType) {
            Props.WrappingStyle = c_oAscWrapStyle2.Inline;
        } else {
            if (WRAPPING_TYPE_NONE === this.wrappingType) {
                Props.WrappingStyle = (this.behindDoc === true ? c_oAscWrapStyle2.Behind : c_oAscWrapStyle2.InFront);
            } else {
                switch (this.wrappingType) {
                case WRAPPING_TYPE_SQUARE:
                    Props.WrappingStyle = c_oAscWrapStyle2.Square;
                    break;
                case WRAPPING_TYPE_TIGHT:
                    Props.WrappingStyle = c_oAscWrapStyle2.Tight;
                    break;
                case WRAPPING_TYPE_THROUGH:
                    Props.WrappingStyle = c_oAscWrapStyle2.Through;
                    break;
                case WRAPPING_TYPE_TOP_AND_BOTTOM:
                    Props.WrappingStyle = c_oAscWrapStyle2.TopAndBottom;
                    break;
                default:
                    Props.WrappingStyle = c_oAscWrapStyle2.Inline;
                    break;
                }
            }
        }
        if (drawing_Inline === this.DrawingType) {
            Props.Paddings = {
                Left: 3.2,
                Right: 3.2,
                Top: 0,
                Bottom: 0
            };
        } else {
            Props.Paddings = {
                Left: this.Distance.L,
                Right: this.Distance.R,
                Top: this.Distance.T,
                Bottom: this.Distance.B
            };
        }
        Props.AllowOverlap = this.AllowOverlap;
        Props.Position = {
            X: this.X,
            Y: this.Y
        };
        Props.PositionH = {
            RelativeFrom: this.PositionH.RelativeFrom,
            UseAlign: this.PositionH.Align,
            Align: (true === this.PositionH.Align ? this.PositionH.Value : undefined),
            Value: (true === this.PositionH.Align ? 0 : this.PositionH.Value)
        };
        Props.PositionV = {
            RelativeFrom: this.PositionV.RelativeFrom,
            UseAlign: this.PositionV.Align,
            Align: (true === this.PositionV.Align ? this.PositionV.Value : undefined),
            Value: (true === this.PositionV.Align ? 0 : this.PositionV.Value)
        };
        Props.Internal_Position = this.Internal_Position;
        var ParentParagraph = this.Get_ParentParagraph();
        if (ParentParagraph) {
            Props.Locked = ParentParagraph.Lock.Is_Locked();
            if (ParentParagraph) {
                if (undefined != ParentParagraph.Parent && true === ParentParagraph.Parent.Is_DrawingShape()) {
                    Props.CanBeFlow = false;
                }
            }
        }
        if (null != OtherProps && undefined != OtherProps) {
            if (undefined === OtherProps.Width || 0.001 > Math.abs(Props.Width - OtherProps.Width)) {
                Props.Width = undefined;
            }
            if (undefined === OtherProps.Height || 0.001 > Math.abs(Props.Height - OtherProps.Height)) {
                Props.Height = undefined;
            }
            if (undefined === OtherProps.WrappingStyle || Props.WrappingStyle != OtherProps.WrappingStyle) {
                Props.WrappingStyle = undefined;
            }
            if (undefined === OtherProps.ImageUrl || Props.ImageUrl != OtherProps.ImageUrl) {
                Props.ImageUrl = undefined;
            }
            if (undefined === OtherProps.Paddings.Left || 0.001 > Math.abs(Props.Paddings.Left - OtherProps.Paddings.Left)) {
                Props.Paddings.Left = undefined;
            }
            if (undefined === OtherProps.Paddings.Right || 0.001 > Math.abs(Props.Paddings.Right - OtherProps.Paddings.Right)) {
                Props.Paddings.Right = undefined;
            }
            if (undefined === OtherProps.Paddings.Top || 0.001 > Math.abs(Props.Paddings.Top - OtherProps.Paddings.Top)) {
                Props.Paddings.Top = undefined;
            }
            if (undefined === OtherProps.Paddings.Bottom || 0.001 > Math.abs(Props.Paddings.Bottom - OtherProps.Paddings.Bottom)) {
                Props.Paddings.Bottom = undefined;
            }
            if (undefined === OtherProps.AllowOverlap || Props.AllowOverlap != OtherProps.AllowOverlap) {
                Props.AllowOverlap = undefined;
            }
            if (undefined === OtherProps.Position.X || 0.001 > Math.abs(Props.Position.X - OtherProps.Position.X)) {
                Props.Position.X = undefined;
            }
            if (undefined === OtherProps.Position.Y || 0.001 > Math.abs(Props.Position.Y - OtherProps.Position.Y)) {
                Props.Position.Y = undefined;
            }
            if (undefined === OtherProps.PositionH.RelativeFrom || Props.PositionH.RelativeFrom != OtherProps.PositionH.RelativeFrom) {
                Props.PositionH.RelativeFrom = undefined;
            }
            if (undefined === OtherProps.PositionH.UseAlign || Props.PositionH.UseAlign != OtherProps.PositionH.UseAlign) {
                Props.PositionH.UseAlign = undefined;
            }
            if (Props.PositionH.RelativeFrom === OtherProps.PositionH.RelativeFrom && Props.PositionH.UseAlign === OtherProps.PositionH.UseAlign) {
                if (true != Props.PositionH.UseAlign && 0.001 > Math.abs(Props.PositionH.Value - OtherProps.PositionH.Value)) {
                    Props.PositionH.Value = undefined;
                }
                if (true === Props.PositionH.UseAlign && Props.PositionH.Align != OtherProps.PositionH.Align) {
                    Props.PositionH.Align = undefined;
                }
            }
            if (undefined === OtherProps.PositionV.RelativeFrom || Props.PositionV.RelativeFrom != OtherProps.PositionV.RelativeFrom) {
                Props.PositionV.RelativeFrom = undefined;
            }
            if (undefined === OtherProps.PositionV.UseAlign || Props.PositionV.UseAlign != OtherProps.PositionV.UseAlign) {
                Props.PositionV.UseAlign = undefined;
            }
            if (Props.PositionV.RelativeFrom === OtherProps.PositionV.RelativeFrom && Props.PositionV.UseAlign === OtherProps.PositionV.UseAlign) {
                if (true != Props.PositionV.UseAlign && 0.001 > Math.abs(Props.PositionV.Value - OtherProps.PositionV.Value)) {
                    Props.PositionV.Value = undefined;
                }
                if (true === Props.PositionV.UseAlign && Props.PositionV.Align != OtherProps.PositionV.Align) {
                    Props.PositionV.Align = undefined;
                }
            }
            if (false === OtherProps.Locked) {
                Props.Locked = false;
            }
            if (false === OtherProps.CanBeFlow || false === Props.CanBeFlow) {
                Props.CanBeFlow = false;
            } else {
                Props.CanBeFlow = true;
            }
        }
        return Props;
    },
    getXfrmExtX: function () {
        if (isRealObject(this.GraphicObj) && isRealObject(this.GraphicObj.spPr) && isRealObject(this.GraphicObj.spPr.xfrm)) {
            return this.GraphicObj.spPr.xfrm.extX;
        }
        if (isRealNumber(this.W)) {
            return this.W;
        }
        return 0;
    },
    getXfrmExtY: function () {
        if (isRealObject(this.GraphicObj) && isRealObject(this.GraphicObj.spPr) && isRealObject(this.GraphicObj.spPr.xfrm)) {
            return this.GraphicObj.spPr.xfrm.extY;
        }
        if (isRealNumber(this.H)) {
            return this.H;
        }
        return 0;
    },
    Search: function (Str, Props, SearchEngine, Type) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.Search === "function") {
            this.GraphicObj.Search(Str, Props, SearchEngine, Type);
        }
    },
    Set_Props: function (Props) {
        if (undefined != Props.WrappingStyle) {
            if (drawing_Inline === this.DrawingType && c_oAscWrapStyle2.Inline != Props.WrappingStyle && undefined === Props.Paddings) {
                this.Set_Distance(3.2, 0, 3.2, 0);
            }
            this.Set_DrawingType(c_oAscWrapStyle2.Inline === Props.WrappingStyle ? drawing_Inline : drawing_Anchor);
            if (c_oAscWrapStyle2.Inline === Props.WrappingStyle) {
                if (isRealObject(this.GraphicObj.bounds) && isRealNumber(this.GraphicObj.bounds.w) && isRealNumber(this.GraphicObj.bounds.h)) {
                    this.Update_Size(this.GraphicObj.bounds.w, this.GraphicObj.bounds.h);
                }
            }
            if (c_oAscWrapStyle2.Behind === Props.WrappingStyle || c_oAscWrapStyle2.InFront === Props.WrappingStyle) {
                this.Set_WrappingType(WRAPPING_TYPE_NONE);
                this.Set_BehindDoc(c_oAscWrapStyle2.Behind === Props.WrappingStyle ? true : false);
            } else {
                switch (Props.WrappingStyle) {
                case c_oAscWrapStyle2.Square:
                    this.Set_WrappingType(WRAPPING_TYPE_SQUARE);
                    break;
                case c_oAscWrapStyle2.Tight:
                    this.Set_WrappingType(WRAPPING_TYPE_TIGHT);
                    break;
                case c_oAscWrapStyle2.Through:
                    this.Set_WrappingType(WRAPPING_TYPE_THROUGH);
                    break;
                case c_oAscWrapStyle2.TopAndBottom:
                    this.Set_WrappingType(WRAPPING_TYPE_TOP_AND_BOTTOM);
                    break;
                default:
                    this.Set_WrappingType(WRAPPING_TYPE_SQUARE);
                    break;
                }
                this.Set_BehindDoc(false);
            }
        }
        if (undefined != Props.Paddings) {
            this.Set_Distance(Props.Paddings.Left, Props.Paddings.Top, Props.Paddings.Right, Props.Paddings.Bottom);
        }
        if (undefined != Props.AllowOverlap) {
            this.Set_AllowOverlap(Props.AllowOverlap);
        }
        var bNeedUpdateWH = false,
        newW = this.W,
        newH = this.H;
        if (undefined != Props.PositionH) {
            this.Set_PositionH(Props.PositionH.RelativeFrom, Props.PositionH.UseAlign, (true === Props.PositionH.UseAlign ? Props.PositionH.Align : Props.PositionH.Value));
            if (Props.PositionH.UseAlign) {
                bNeedUpdateWH = true;
                if (isRealObject(this.GraphicObj.bounds) && isRealNumber(this.GraphicObj.bounds.w)) {
                    newW = this.GraphicObj.bounds.w;
                }
            }
        }
        if (undefined != Props.PositionV) {
            this.Set_PositionV(Props.PositionV.RelativeFrom, Props.PositionV.UseAlign, (true === Props.PositionV.UseAlign ? Props.PositionV.Align : Props.PositionV.Value));
            if (this.PositionV.UseAlign) {
                bNeedUpdateWH = true;
                if (isRealObject(this.GraphicObj.bounds) && isRealNumber(this.GraphicObj.bounds.h)) {
                    newH = this.GraphicObj.bounds.h;
                }
            }
        }
        if (bNeedUpdateWH) {
            this.Update_Size(newW, newH);
        }
    },
    Draw: function (X, Y, pGraphics, pageIndex, align) {
        if (drawing_Inline === this.DrawingType) {
            pGraphics.shapePageIndex = pageIndex;
            this.draw(pGraphics, pageIndex);
            pGraphics.shapePageIndex = null;
        }
    },
    Measure: function (Context) {
        if (this.bNeedUpdateWH || (!this.W || !this.H)) {
            this.updateWidthHeight();
        }
        this.Width = this.W;
        this.Height = this.H;
        this.WidthVisible = this.W;
    },
    Measure2: function (Context) {
        this.Width = this.W;
        this.Height = this.H;
        this.WidthVisible = this.W;
    },
    Save_RecalculateObject: function (Copy) {
        var DrawingObj = {};
        DrawingObj.Type = this.Type;
        DrawingObj.DrawingType = this.DrawingType;
        DrawingObj.WrappingType = this.wrappingType;
        if (drawing_Anchor === this.Get_DrawingType() && true === this.Use_TextWrap()) {
            DrawingObj.FlowPos = {
                X: this.X - this.Distance.L,
                Y: this.Y - this.Distance.T,
                W: this.W + this.Distance.R,
                H: this.H + this.Distance.B
            };
        }
        DrawingObj.PageNum = this.PageNum;
        DrawingObj.X = this.X;
        DrawingObj.Y = this.Y;
        DrawingObj.spRecaclcObject = this.GraphicObj.getRecalcObject();
        return DrawingObj;
    },
    Load_RecalculateObject: function (RecalcObj) {
        this.updatePosition3(RecalcObj.PageNum, RecalcObj.X, RecalcObj.Y);
        this.GraphicObj.setRecalcObject(RecalcObj.spRecaclcObject);
    },
    Prepare_RecalculateObject: function () {},
    Is_RealContent: function () {
        return true;
    },
    Can_AddNumbering: function () {
        if (drawing_Inline === this.DrawingType) {
            return true;
        }
        return false;
    },
    Copy: function () {
        var c = new ParaDrawing(this.W, this.H, null, editor.WordControl.m_oLogicDocument.DrawingDocument, null, null);
        c.Set_DrawingType(this.DrawingType);
        if (isRealObject(this.GraphicObj)) {
            c.Set_GraphicObject(this.GraphicObj.copy());
            c.GraphicObj.setParent(c);
        }
        var d = this.Distance;
        c.Set_PositionH(this.PositionH.RelativeFrom, this.PositionH.Align, this.PositionH.Value);
        c.Set_PositionV(this.PositionV.RelativeFrom, this.PositionV.Align, this.PositionV.Value);
        c.Set_Distance(d.L, d.T, d.R, d.B);
        c.Set_AllowOverlap(this.AllowOverlap);
        c.Set_WrappingType(this.wrappingType);
        if (this.wrappingPolygon) {
            c.wrappingPolygon.fromOther(this.wrappingPolygon);
        }
        c.Set_BehindDoc(this.behindDoc);
        c.Update_Size(this.W, this.H);
        return c;
    },
    Set_Id: function (newId) {
        g_oTableId.Reset_Id(this, newId, this.Id);
        this.Id = newId;
    },
    Set_GraphicObject: function (graphicObject) {
        var data = {
            Type: historyitem_Drawing_SetGraphicObject
        };
        if (isRealObject(this.GraphicObj)) {
            data.oldId = this.GraphicObj.Get_Id();
        } else {
            data.oldId = null;
        }
        if (isRealObject(graphicObject)) {
            data.newId = graphicObject.Get_Id();
        } else {
            data.newId = null;
        }
        History.Add(this, data);
        if (graphicObject.handleUpdateExtents) {
            graphicObject.handleUpdateExtents();
        }
        this.GraphicObj = graphicObject;
    },
    Get_Id: function () {
        return this.Id;
    },
    setParagraphTabs: function (tabs) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphTabs === "function") {
            this.GraphicObj.setParagraphTabs(tabs);
        }
    },
    Selection_Is_TableBorderMove: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.Selection_Is_TableBorderMove === "function") {
            return this.GraphicObj.Selection_Is_TableBorderMove();
        }
        return false;
    },
    Update_Position: function (Paragraph, ParaLayout, PageLimits, PageLimitsOrigin) {
        if (undefined != this.PositionH_Old) {
            this.PositionH.RelativeFrom = this.PositionH_Old.RelativeFrom2;
            this.PositionH.Align = this.PositionH_Old.Align2;
            this.PositionH.Value = this.PositionH_Old.Value2;
        }
        if (undefined != this.PositionV_Old) {
            this.PositionV.RelativeFrom = this.PositionV_Old.RelativeFrom2;
            this.PositionV.Align = this.PositionV_Old.Align2;
            this.PositionV.Value = this.PositionV_Old.Value2;
        }
        this.Parent = Paragraph;
        this.DocumentContent = this.Parent.Parent;
        var PageNum = ParaLayout.PageNum;
        var OtherFlowObjects = editor.WordControl.m_oLogicDocument.DrawingObjects.getAllFloatObjectsOnPage(PageNum, this.Parent.Parent);
        var bInline = (drawing_Inline === this.DrawingType ? true : false);
        var W, H;
        if (this.Is_Inline()) {
            W = this.GraphicObj.bounds.w;
            H = this.GraphicObj.bounds.h;
        } else {
            if (this.PositionH.Align) {
                W = this.GraphicObj.bounds.w;
            } else {
                W = this.getXfrmExtX();
            }
            if (this.PositionV.Align) {
                H = this.GraphicObj.bounds.h;
            } else {
                H = this.getXfrmExtY();
            }
        }
        this.Internal_Position.Set(W, H, this.YOffset, ParaLayout, PageLimitsOrigin);
        this.Internal_Position.Calculate_X(bInline, this.PositionH.RelativeFrom, this.PositionH.Align, this.PositionH.Value);
        this.Internal_Position.Calculate_Y(bInline, this.PositionV.RelativeFrom, this.PositionV.Align, this.PositionV.Value);
        this.Internal_Position.Correct_Values(bInline, PageLimits, this.AllowOverlap, this.Use_TextWrap(), OtherFlowObjects);
        var OldPageNum = this.PageNum;
        this.PageNum = PageNum;
        this.X = this.Internal_Position.CalcX;
        this.Y = this.Internal_Position.CalcY;
        if (undefined != this.PositionH_Old) {
            this.PositionH.RelativeFrom = this.PositionH_Old.RelativeFrom;
            this.PositionH.Align = this.PositionH_Old.Align;
            this.PositionH.Value = this.PositionH_Old.Value;
            var Value = this.Internal_Position.Calculate_X_Value(this.PositionH_Old.RelativeFrom);
            this.Set_PositionH(this.PositionH_Old.RelativeFrom, false, Value);
            this.X = this.Internal_Position.Calculate_X(bInline, this.PositionH.RelativeFrom, this.PositionH.Align, this.PositionH.Value);
        }
        if (undefined != this.PositionV_Old) {
            this.PositionV.RelativeFrom = this.PositionV_Old.RelativeFrom;
            this.PositionV.Align = this.PositionV_Old.Align;
            this.PositionV.Value = this.PositionV_Old.Value;
            var Value = this.Internal_Position.Calculate_Y_Value(this.PositionV_Old.RelativeFrom);
            this.Set_PositionV(this.PositionV_Old.RelativeFrom, false, Value);
            this.Y = this.Internal_Position.Calculate_Y(bInline, this.PositionV.RelativeFrom, this.PositionV.Align, this.PositionV.Value, PageLimitsOrigin);
        }
        this.updatePosition3(this.PageNum, this.X, this.Y, OldPageNum);
    },
    Reset_SavedPosition: function () {
        this.PositionV_Old = undefined;
        this.PositionH_Old = undefined;
    },
    setParagraphBorders: function (val) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphBorders === "function") {
            this.GraphicObj.setParagraphBorders(val);
        }
    },
    deselect: function () {
        this.selected = false;
        if (this.GraphicObj && this.GraphicObj.deselect) {
            this.GraphicObj.deselect();
        }
    },
    updatePosition3: function (pageIndex, x, y, oldPageNum) {
        this.graphicObjects.removeById(pageIndex, this.Get_Id());
        if (isRealNumber(oldPageNum)) {
            this.graphicObjects.removeById(oldPageNum, this.Get_Id());
        }
        this.setPageIndex(pageIndex);
        if (typeof this.GraphicObj.setStartPage === "function") {
            this.GraphicObj.setStartPage(pageIndex, this.DocumentContent && this.DocumentContent.Is_HdrFtr());
        }
        var bInline = this.Is_Inline();
        var _x = (this.PositionH.Align || bInline) ? x - this.GraphicObj.bounds.x : x;
        var _y = (this.PositionV.Align || bInline) ? y - this.GraphicObj.bounds.y : y;
        if (! (this.DocumentContent && this.DocumentContent.Is_HdrFtr() && this.DocumentContent.Get_StartPage_Absolute() !== pageIndex)) {
            this.graphicObjects.addObjectOnPage(pageIndex, this.GraphicObj);
            this.bNoNeedToAdd = false;
        } else {
            this.bNoNeedToAdd = true;
        }
        this.selectX = x;
        this.selectY = y;
        if (this.GraphicObj.bNeedUpdatePosition || !(isRealNumber(this.GraphicObj.posX) && isRealNumber(this.GraphicObj.posY)) || !(Math.abs(this.GraphicObj.posX - _x) < MOVE_DELTA && Math.abs(this.GraphicObj.posY - _y) < MOVE_DELTA)) {
            this.GraphicObj.updatePosition(_x, _y);
        }
        if (this.GraphicObj.bNeedUpdatePosition || !(isRealNumber(this.wrappingPolygon.posX) && isRealNumber(this.wrappingPolygon.posY)) || !(Math.abs(this.wrappingPolygon.posX - _x) < MOVE_DELTA && Math.abs(this.wrappingPolygon.posY - _y) < MOVE_DELTA)) {
            this.wrappingPolygon.updatePosition(_x, _y);
        }
        this.calculateSnapArrays();
    },
    Set_XYForAdd2: function (X, Y) {
        this.Set_PositionH(c_oAscRelativeFromH.Column, false, 0);
        this.Set_PositionV(c_oAscRelativeFromV.Paragraph, false, 0);
        this.PositionH_Old = {
            RelativeFrom: this.PositionH.RelativeFrom,
            Align: this.PositionH.Align,
            Value: this.PositionH.Value
        };
        this.PositionV_Old = {
            RelativeFrom: this.PositionV.RelativeFrom,
            Align: this.PositionV.Align,
            Value: this.PositionV.Value
        };
        this.PositionH.RelativeFrom = c_oAscRelativeFromH.Page;
        this.PositionH.Align = false;
        this.PositionH.Value = X;
        this.PositionV.RelativeFrom = c_oAscRelativeFromV.Page;
        this.PositionV.Align = false;
        this.PositionV.Value = Y;
    },
    calculateAfterChangeTheme: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.calculateAfterChangeTheme === "function") {
            this.GraphicObj.calculateAfterChangeTheme();
        }
    },
    selectionIsEmpty: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.selectionIsEmpty === "function") {
            return this.GraphicObj.selectionIsEmpty();
        }
        return false;
    },
    recalculateDocContent: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.recalculateDocContent === "function") {
            return this.GraphicObj.recalculateDocContent();
        }
    },
    Shift: function (Dx, Dy) {
        this.X += Dx;
        this.Y += Dy;
        this.updatePosition3(this.PageNum, this.X, this.Y);
    },
    Update_Size: function (W, H) {
        History.Add(this, {
            Type: historyitem_Drawing_Size,
            New: {
                W: W,
                H: H
            },
            Old: {
                W: this.W,
                H: this.H
            }
        });
        this.W = W;
        this.H = H;
        this.Measure2();
    },
    Set_Url: function (Img) {
        History.Add(this, {
            Type: historyitem_Drawing_Url,
            New: Img,
            Old: this.GraphicObj.Img
        });
        this.GraphicObj.Img = Img;
    },
    Set_DrawingType: function (DrawingType) {
        History.Add(this, {
            Type: historyitem_Drawing_DrawingType,
            New: DrawingType,
            Old: this.DrawingType
        });
        this.DrawingType = DrawingType;
    },
    Set_WrappingType: function (WrapType) {
        History.Add(this, {
            Type: historyitem_Drawing_WrappingType,
            New: WrapType,
            Old: this.wrappingType
        });
        this.wrappingType = WrapType;
    },
    Set_BehindDoc: function (BehindDoc) {
        History.Add(this, {
            Type: historyitem_Drawing_BehindDoc,
            New: BehindDoc,
            Old: this.behindDoc
        });
        this.behindDoc = BehindDoc;
    },
    Set_Distance: function (L, T, R, B) {
        if (null === L || undefined === L) {
            L = this.Distance.L;
        }
        if (null === T || undefined === T) {
            T = this.Distance.T;
        }
        if (null === R || undefined === R) {
            R = this.Distance.R;
        }
        if (null === B || undefined === B) {
            B = this.Distance.B;
        }
        History.Add(this, {
            Type: historyitem_Drawing_Distance,
            Old: {
                Left: this.Distance.L,
                Top: this.Distance.T,
                Right: this.Distance.R,
                Bottom: this.Distance.B
            },
            New: {
                Left: L,
                Top: T,
                Right: R,
                Bottom: B
            }
        });
        this.Distance.L = L;
        this.Distance.R = R;
        this.Distance.T = T;
        this.Distance.B = B;
    },
    updateWidthHeight: function () {
        if (isRealObject(this.GraphicObj)) {
            this.GraphicObj.recalculate();
            var bounds = this.getBounds();
            this.W = bounds.r - bounds.l;
            this.H = bounds.b - bounds.t;
            this.l = bounds.l;
            this.t = bounds.t;
            this.r = bounds.r;
            this.b = bounds.b;
        }
        this.bNeedUpdateWH = false;
    },
    Set_AllowOverlap: function (AllowOverlap) {
        History.Add(this, {
            Type: historyitem_Drawing_AllowOverlap,
            Old: this.AllowOverlap,
            New: AllowOverlap
        });
        this.AllowOverlap = AllowOverlap;
    },
    Set_PositionH: function (RelativeFrom, Align, Value) {
        History.Add(this, {
            Type: historyitem_Drawing_PositionH,
            Old: {
                RelativeFrom: this.PositionH.RelativeFrom,
                Align: this.PositionH.Align,
                Value: this.PositionH.Value
            },
            New: {
                RelativeFrom: RelativeFrom,
                Align: Align,
                Value: Value
            }
        });
        this.PositionH.RelativeFrom = RelativeFrom;
        this.PositionH.Align = Align;
        this.PositionH.Value = Value;
    },
    Set_PositionV: function (RelativeFrom, Align, Value) {
        History.Add(this, {
            Type: historyitem_Drawing_PositionV,
            Old: {
                RelativeFrom: this.PositionV.RelativeFrom,
                Align: this.PositionV.Align,
                Value: this.PositionV.Value
            },
            New: {
                RelativeFrom: RelativeFrom,
                Align: Align,
                Value: Value
            }
        });
        this.PositionV.RelativeFrom = RelativeFrom;
        this.PositionV.Align = Align;
        this.PositionV.Value = Value;
    },
    canTakeOutPage: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.canTakeOutPage === "function") {
            return this.GraphicObj.canTakeOutPage();
        }
        return false;
    },
    Set_XYForAdd: function (X, Y, NearPos, PageNum) {
        if (null !== NearPos) {
            var Layout = NearPos.Paragraph.Get_Layout(NearPos.ContentPos, this);
            var _W = (this.PositionH.Align ? this.W : this.getXfrmExtX());
            var _H = (this.PositionV.Align ? this.H : this.getXfrmExtY());
            this.Internal_Position.Set(_W, _H, this.YOffset, Layout.ParagraphLayout, Layout.PageLimits);
            this.Internal_Position.Calculate_X(false, c_oAscRelativeFromH.Page, false, X - Layout.PageLimits.X);
            this.Internal_Position.Calculate_Y(false, c_oAscRelativeFromV.Page, false, Y - Layout.PageLimits.Y);
            this.Internal_Position.Correct_Values(false, Layout.PageLimits, this.AllowOverlap, this.Use_TextWrap(), []);
            this.PageNum = PageNum;
            this.X = this.Internal_Position.CalcX;
            this.Y = this.Internal_Position.CalcY;
            var ValueX = this.Internal_Position.Calculate_X_Value(this.PositionH.RelativeFrom);
            this.Set_PositionH(this.PositionH.RelativeFrom, false, ValueX);
            this.X = this.Internal_Position.Calculate_X(false, this.PositionH.RelativeFrom, this.PositionH.Align, this.PositionH.Value);
            var ValueY = this.Internal_Position.Calculate_Y_Value(this.PositionV.RelativeFrom);
            this.Set_PositionV(this.PositionV.RelativeFrom, false, ValueY);
            this.Y = this.Internal_Position.Calculate_Y(false, this.PositionV.RelativeFrom, this.PositionV.Align, this.PositionV.Value);
        }
    },
    Get_DrawingType: function () {
        return this.DrawingType;
    },
    Is_Inline: function () {
        return (drawing_Inline === this.DrawingType ? true : false);
    },
    Use_TextWrap: function () {
        return (drawing_Anchor === this.DrawingType && !(this.wrappingType === WRAPPING_TYPE_NONE));
    },
    Draw_Selection: function () {
        var Padding = this.DrawingDocument.GetMMPerDot(6);
        this.DrawingDocument.AddPageSelection(this.PageNum, this.selectX - Padding, this.selectY - Padding, this.W + 2 * Padding, this.H + 2 * Padding);
    },
    OnEnd_MoveInline: function (NearPos) {
        NearPos.Paragraph.Check_NearestPos(NearPos);
        var RunPr = this.Remove_FromDocument(false);
        this.Add_ToDocument(NearPos, true, RunPr);
    },
    OnEnd_ResizeInline: function (W, H) {
        var LogicDocument = editor.WordControl.m_oLogicDocument;
        if (true) {
            this.Update_Size(W, H);
            LogicDocument.Recalculate();
        } else {
            LogicDocument.Document_UpdateSelectionState();
        }
    },
    OnEnd_ChangeFlow: function (X, Y, PageNum, W, H, NearPos, bMove, bLast) {
        this.Update_Size(W, H);
        if (true === bMove && null !== NearPos) {
            var Layout = NearPos.Paragraph.Get_Layout(NearPos.ContentPos, this);
            var _W = this.W;
            var _H = this.H;
            this.Internal_Position.Set(_W, _H, this.YOffset, Layout.ParagraphLayout, Layout.PageLimits);
            this.Internal_Position.Calculate_X(false, c_oAscRelativeFromH.Page, false, X - Layout.PageLimits.X);
            this.Internal_Position.Calculate_Y(false, c_oAscRelativeFromV.Page, false, Y - Layout.PageLimits.X);
            this.Internal_Position.Correct_Values(false, Layout.PageLimits, this.AllowOverlap, this.Use_TextWrap(), []);
            this.PageNum = PageNum;
            this.X = this.Internal_Position.CalcX;
            this.Y = this.Internal_Position.CalcY;
            var ValueX = this.Internal_Position.Calculate_X_Value(this.PositionH.RelativeFrom);
            this.Set_PositionH(this.PositionH.RelativeFrom, false, ValueX);
            this.X = this.Internal_Position.Calculate_X(false, this.PositionH.RelativeFrom, this.PositionH.Align, this.PositionH.Value);
            var ValueY = this.Internal_Position.Calculate_Y_Value(this.PositionV.RelativeFrom);
            this.Set_PositionV(this.PositionV.RelativeFrom, false, ValueY);
            this.Y = this.Internal_Position.Calculate_Y(false, this.PositionV.RelativeFrom, this.PositionV.Align, this.PositionV.Value);
            NearPos.Paragraph.Check_NearestPos(NearPos);
            this.Remove_FromDocument(false);
            this.Add_ToDocument(NearPos, false);
        }
        if (true === bLast) {
            editor.WordControl.m_oLogicDocument.Recalculate();
        }
    },
    GoTo_Text: function (bBefore, bUpdateStates) {
        if (undefined != this.Parent && null != this.Parent) {
            this.Parent.Cursor_MoveTo_Drawing(this.Id, bBefore);
            this.Parent.Document_SetThisElementCurrent(undefined === bUpdateStates ? true : bUpdateStates);
        }
    },
    Remove_FromDocument: function (bRecalculate) {
        var Result = null;
        var Run = this.Parent.Get_DrawingObjectRun(this.Id);
        if (null !== Run) {
            Run.Remove_DrawingObject(this.Id);
            Result = Run.Get_TextPr();
        }
        if (false != bRecalculate) {
            editor.WordControl.m_oLogicDocument.Recalculate();
        }
        return Result;
    },
    Get_ParentParagraph: function () {
        if (this.Parent instanceof Paragraph) {
            return this.Parent;
        }
        if (this.Parent instanceof ParaRun) {
            return this.Parent.Paragraph;
        }
        return null;
    },
    Add_ToDocument: function (NearPos, bRecalculate, RunPr) {
        NearPos.Paragraph.Check_NearestPos(NearPos);
        var LogicDocument = this.DrawingDocument.m_oLogicDocument;
        var Para = new Paragraph(this.DrawingDocument, LogicDocument);
        var DrawingRun = new ParaRun(Para);
        DrawingRun.Add_ToContent(0, this);
        if (undefined !== RunPr) {
            DrawingRun.Set_Pr(RunPr.Copy());
        }
        Para.Add_ToContent(0, DrawingRun);
        var SelectedElement = new CSelectedElement(Para, false);
        var SelectedContent = new CSelectedContent();
        SelectedContent.Add(SelectedElement);
        SelectedContent.Set_MoveDrawing(true);
        NearPos.Paragraph.Parent.Insert_Content(SelectedContent, NearPos);
        if (false != bRecalculate) {
            LogicDocument.Recalculate();
        }
    },
    Add_ToDocument2: function (Paragraph) {
        var DrawingRun = new ParaRun(Paragraph);
        DrawingRun.Add_ToContent(0, this);
        Paragraph.Add_ToContent(0, DrawingRun);
    },
    Update_CursorType: function (X, Y, PageIndex) {
        this.DrawingDocument.SetCursorType("move", new CMouseMoveData());
        if (null != this.Parent) {
            var Lock = this.Parent.Lock;
            if (true === Lock.Is_Locked()) {
                var PNum = Math.max(0, Math.min(PageIndex - this.Parent.PageNum, this.Parent.Pages.length - 1));
                var _X = this.Parent.Pages[PNum].X;
                var _Y = this.Parent.Pages[PNum].Y;
                var MMData = new CMouseMoveData();
                var Coords = this.DrawingDocument.ConvertCoordsToCursorWR(_X, _Y, this.Parent.Get_StartPage_Absolute() + (PageIndex - this.Parent.PageNum));
                MMData.X_abs = Coords.X - 5;
                MMData.Y_abs = Coords.Y;
                MMData.Type = c_oAscMouseMoveDataTypes.LockedObject;
                MMData.UserId = Lock.Get_UserId();
                MMData.HaveChanges = Lock.Have_Changes();
                MMData.LockedObjectType = c_oAscMouseMoveLockedObjectType.Common;
                editor.sync_MouseMoveCallback(MMData);
            }
        }
    },
    Get_AnchorPos: function () {
        return this.Parent.Get_AnchorPos(this);
    },
    Undo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_Drawing_Size:
            this.W = Data.Old.W;
            this.H = Data.Old.H;
            this.Measure2();
            break;
        case historyitem_Drawing_Url:
            this.GraphicObj.Img = Data.Old;
            break;
        case historyitem_Drawing_DrawingType:
            this.DrawingType = Data.Old;
            break;
        case historyitem_Drawing_WrappingType:
            this.wrappingType = Data.Old;
            break;
        case historyitem_Drawing_Distance:
            this.Distance.L = Data.Old.Left;
            this.Distance.T = Data.Old.Top;
            this.Distance.R = Data.Old.Right;
            this.Distance.B = Data.Old.Bottom;
            this.GraphicObj && this.GraphicObj.recalcWrapPolygon && this.GraphicObj.recalcWrapPolygon();
            break;
        case historyitem_Drawing_AllowOverlap:
            this.AllowOverlap = Data.Old;
            break;
        case historyitem_Drawing_PositionH:
            this.PositionH.RelativeFrom = Data.Old.RelativeFrom;
            this.PositionH.Align = Data.Old.Align;
            this.PositionH.Value = Data.Old.Value;
            break;
        case historyitem_Drawing_PositionV:
            this.PositionV.RelativeFrom = Data.Old.RelativeFrom;
            this.PositionV.Align = Data.Old.Align;
            this.PositionV.Value = Data.Old.Value;
            break;
        case historyitem_Drawing_BehindDoc:
            this.behindDoc = Data.Old;
            break;
        case historyitem_Drawing_SetGraphicObject:
            if (this.GraphicObj != null) {}
            if (Data.oldId != null) {
                this.GraphicObj = g_oTableId.Get_ById(Data.oldId);
            } else {
                this.GraphicObj = null;
            }
            if (isRealObject(this.GraphicObj)) {
                this.GraphicObj.handleUpdateExtents && this.GraphicObj.handleUpdateExtents();
            }
            break;
        case historyitem_SetSimplePos:
            this.SimplePos.Use = Data.oldUse;
            this.SimplePos.X = Data.oldX;
            this.SimplePos.Y = Data.oldY;
            break;
        case historyitem_SetExtent:
            this.Extent.W = Data.oldW;
            this.Extent.H = Data.oldH;
            break;
        case historyitem_SetWrapPolygon:
            this.wrappingPolygon = Data.oldW;
            break;
        }
    },
    Redo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_Drawing_Size:
            this.W = Data.New.W;
            this.H = Data.New.H;
            this.Measure2();
            break;
        case historyitem_Drawing_Url:
            this.GraphicObj.Img = Data.New;
            break;
        case historyitem_Drawing_DrawingType:
            this.DrawingType = Data.New;
            break;
        case historyitem_Drawing_WrappingType:
            this.wrappingType = Data.New;
            break;
        case historyitem_Drawing_Distance:
            this.Distance.L = Data.New.Left;
            this.Distance.T = Data.New.Top;
            this.Distance.R = Data.New.Right;
            this.Distance.B = Data.New.Bottom;
            this.GraphicObj && this.GraphicObj.recalcWrapPolygon && this.GraphicObj.recalcWrapPolygon();
            break;
        case historyitem_Drawing_AllowOverlap:
            this.AllowOverlap = Data.New;
            break;
        case historyitem_Drawing_PositionH:
            this.PositionH.RelativeFrom = Data.New.RelativeFrom;
            this.PositionH.Align = Data.New.Align;
            this.PositionH.Value = Data.New.Value;
            break;
        case historyitem_Drawing_PositionV:
            this.PositionV.RelativeFrom = Data.New.RelativeFrom;
            this.PositionV.Align = Data.New.Align;
            this.PositionV.Value = Data.New.Value;
            break;
        case historyitem_Drawing_BehindDoc:
            this.behindDoc = Data.New;
            break;
        case historyitem_Drawing_SetGraphicObject:
            if (this.GraphicObj != null) {}
            if (Data.newId != null) {
                this.GraphicObj = g_oTableId.Get_ById(Data.newId);
            } else {
                this.GraphicObj = null;
            }
            if (isRealObject(this.GraphicObj)) {
                this.GraphicObj.handleUpdateExtents && this.GraphicObj.handleUpdateExtents();
            }
            break;
        case historyitem_SetSimplePos:
            this.SimplePos.Use = Data.newUse;
            this.SimplePos.X = Data.newX;
            this.SimplePos.Y = Data.newY;
            break;
        case historyitem_SetExtent:
            this.Extent.W = Data.newW;
            this.Extent.H = Data.newH;
            break;
        case historyitem_SetWrapPolygon:
            this.wrappingPolygon = Data.newW;
            break;
        }
    },
    Get_ParentObject_or_DocumentPos: function () {
        if (this.Parent != null) {
            return this.Parent.Get_ParentObject_or_DocumentPos();
        }
    },
    Refresh_RecalcData: function (Data) {
        if (undefined != this.Parent && null != this.Parent) {
            if (Data && Data.Type === historyitem_Drawing_Distance) {
                this.GraphicObj && this.GraphicObj.recalcWrapPolygon && this.GraphicObj.recalcWrapPolygon();
                this.GraphicObj && this.GraphicObj.addToRecalculate();
            }
            return this.Parent.Refresh_RecalcData2();
        }
    },
    hyperlinkCheck: function (bCheck) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.hyperlinkCheck === "function") {
            return this.GraphicObj.hyperlinkCheck(bCheck);
        }
        return null;
    },
    hyperlinkCanAdd: function (bCheckInHyperlink) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.hyperlinkCanAdd === "function") {
            return this.GraphicObj.hyperlinkCanAdd(bCheckInHyperlink);
        }
        return false;
    },
    hyperlinkRemove: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.hyperlinkCanAdd === "function") {
            return this.GraphicObj.hyperlinkRemove();
        }
        return false;
    },
    hyperlinkModify: function (HyperProps) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.hyperlinkModify === "function") {
            return this.GraphicObj.hyperlinkModify(HyperProps);
        }
    },
    hyperlinkAdd: function (HyperProps) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.hyperlinkAdd === "function") {
            return this.GraphicObj.hyperlinkAdd(HyperProps);
        }
    },
    documentStatistics: function (stat) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.documentStatistics === "function") {
            this.GraphicObj.documentStatistics(stat);
        }
    },
    documentCreateFontCharMap: function (fontMap) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.documentCreateFontCharMap === "function") {
            this.GraphicObj.documentCreateFontCharMap(fontMap);
        }
    },
    documentCreateFontMap: function (fontMap) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.documentCreateFontMap === "function") {
            this.GraphicObj.documentCreateFontMap(fontMap);
        }
    },
    tableCheckSplit: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.tableCheckSplit === "function") {
            return this.GraphicObj.tableCheckSplit();
        }
        return false;
    },
    tableCheckMerge: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.tableCheckMerge === "function") {
            return this.GraphicObj.tableCheckMerge();
        }
        return false;
    },
    tableSelect: function (Type) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.tableSelect === "function") {
            return this.GraphicObj.tableSelect(Type);
        }
    },
    tableRemoveTable: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.tableRemoveTable === "function") {
            return this.GraphicObj.tableRemoveTable();
        }
    },
    tableSplitCell: function (Cols, Rows) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.tableSplitCell === "function") {
            return this.GraphicObj.tableSplitCell(Cols, Rows);
        }
    },
    tableMergeCells: function (Cols, Rows) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.tableMergeCells === "function") {
            return this.GraphicObj.tableMergeCells(Cols, Rows);
        }
    },
    tableRemoveCol: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.tableRemoveCol === "function") {
            return this.GraphicObj.tableRemoveCol();
        }
    },
    tableAddCol: function (bBefore) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.tableAddCol === "function") {
            return this.GraphicObj.tableAddCol(bBefore);
        }
    },
    tableRemoveRow: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.tableRemoveRow === "function") {
            return this.GraphicObj.tableRemoveRow();
        }
    },
    tableAddRow: function (bBefore) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.tableAddRow === "function") {
            return this.GraphicObj.tableAddRow(bBefore);
        }
    },
    getCurrentParagraph: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getCurrentParagraph === "function") {
            return this.GraphicObj.getCurrentParagraph();
        }
        return null;
    },
    getSelectedText: function (bClearText) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getSelectedText === "function") {
            return this.GraphicObj.getSelectedText(bClearText);
        }
        return "";
    },
    getCurPosXY: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getCurPosXY === "function") {
            return this.GraphicObj.getCurPosXY();
        }
        return {
            X: 0,
            Y: 0
        };
    },
    setParagraphKeepLines: function (Value) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphKeepLines === "function") {
            return this.GraphicObj.setParagraphKeepLines(Value);
        }
    },
    setParagraphKeepNext: function (Value) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphKeepNext === "function") {
            return this.GraphicObj.setParagraphKeepNext(Value);
        }
    },
    setParagraphWidowControl: function (Value) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphWidowControl === "function") {
            return this.GraphicObj.setParagraphWidowControl(Value);
        }
    },
    setParagraphPageBreakBefore: function (Value) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphPageBreakBefore === "function") {
            return this.GraphicObj.setParagraphPageBreakBefore(Value);
        }
    },
    isTextSelectionUse: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.isTextSelectionUse === "function") {
            return this.GraphicObj.isTextSelectionUse();
        }
        return false;
    },
    paragraphFormatPaste: function (CopyTextPr, CopyParaPr, Bool) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.isTextSelectionUse === "function") {
            return this.GraphicObj.paragraphFormatPaste(CopyTextPr, CopyParaPr, Bool);
        }
    },
    getNearestPos: function (x, y, pageIndex) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getNearestPos === "function") {
            return this.GraphicObj.getNearestPos(x, y, pageIndex);
        }
        return null;
    },
    Save_Changes: function (Data, Writer) {
        Writer.WriteLong(historyitem_type_Drawing);
        var Type = Data.Type;
        Writer.WriteLong(Type);
        switch (Type) {
        case historyitem_Drawing_Size:
            Writer.WriteDouble(Data.New.W);
            Writer.WriteDouble(Data.New.H);
            break;
        case historyitem_Drawing_Url:
            Writer.WriteString2(Data.New);
            break;
        case historyitem_Drawing_DrawingType:
            Writer.WriteLong(Data.New);
            break;
        case historyitem_Drawing_WrappingType:
            Writer.WriteLong(Data.New);
            break;
        case historyitem_Drawing_Distance:
            Writer.WriteDouble(Data.New.Left);
            Writer.WriteDouble(Data.New.Top);
            Writer.WriteDouble(Data.New.Right);
            Writer.WriteDouble(Data.New.Bottom);
            break;
        case historyitem_Drawing_AllowOverlap:
            Writer.WriteBool(Data.New);
            break;
        case historyitem_Drawing_PositionH:
            case historyitem_Drawing_PositionV:
            Writer.WriteLong(Data.New.RelativeFrom);
            Writer.WriteBool(Data.New.Align);
            if (true === Data.New.Align) {
                Writer.WriteLong(Data.New.Value);
            } else {
                Writer.WriteDouble(Data.New.Value);
            }
            break;
        case historyitem_Drawing_BehindDoc:
            Writer.WriteBool(Data.New);
            break;
        case historyitem_Drawing_SetGraphicObject:
            Writer.WriteBool(Data.newId != null);
            if (Data.newId != null) {
                Writer.WriteString2(Data.newId);
            }
            break;
        case historyitem_SetSimplePos:
            Writer.WriteBool(Data.newUse);
            Writer.WriteBool(typeof Data.newX === "number");
            if (typeof Data.newX === "number") {
                Writer.WriteDouble(Data.newX);
            }
            Writer.WriteBool(typeof Data.newY === "number");
            if (typeof Data.newY === "number") {
                Writer.WriteDouble(Data.newY);
            }
            break;
        case historyitem_SetExtent:
            Writer.WriteBool(typeof Data.newW === "number");
            if (typeof Data.newW === "number") {
                Writer.WriteDouble(Data.newW);
            }
            Writer.WriteBool(typeof Data.newH === "number");
            if (typeof Data.newH === "number") {
                Writer.WriteDouble(Data.newH);
            }
            break;
        case historyitem_SetWrapPolygon:
            writeObject(Writer, Data.newW);
            break;
        }
        return Writer;
    },
    Load_Changes: function (Reader) {
        var ClassType = Reader.GetLong();
        if (historyitem_type_Drawing != ClassType) {
            return;
        }
        var Type = Reader.GetLong();
        switch (Type) {
        case historyitem_Drawing_Size:
            this.W = Reader.GetDouble();
            this.H = Reader.GetDouble();
            this.bNeedUpdateWH = true;
            this.Measure2();
            break;
        case historyitem_Drawing_Url:
            this.GraphicObj.Img = Reader.GetString2();
            break;
        case historyitem_Drawing_DrawingType:
            this.DrawingType = Reader.GetLong();
            break;
        case historyitem_Drawing_WrappingType:
            this.wrappingType = Reader.GetLong();
            break;
        case historyitem_Drawing_Distance:
            this.Distance.L = Reader.GetDouble();
            this.Distance.T = Reader.GetDouble();
            this.Distance.R = Reader.GetDouble();
            this.Distance.B = Reader.GetDouble();
            this.GraphicObj && this.GraphicObj.recalcWrapPolygon && this.GraphicObj.recalcWrapPolygon();
            break;
        case historyitem_Drawing_AllowOverlap:
            this.AllowOverlap = Reader.GetBool();
            break;
        case historyitem_Drawing_PositionH:
            this.PositionH.RelativeFrom = Reader.GetLong();
            this.PositionH.Align = Reader.GetBool();
            if (true === this.PositionH.Align) {
                this.PositionH.Value = Reader.GetLong();
            } else {
                this.PositionH.Value = Reader.GetDouble();
            }
            break;
        case historyitem_Drawing_PositionV:
            this.PositionV.RelativeFrom = Reader.GetLong();
            this.PositionV.Align = Reader.GetBool();
            if (true === this.PositionV.Align) {
                this.PositionV.Value = Reader.GetLong();
            } else {
                this.PositionV.Value = Reader.GetDouble();
            }
            break;
        case historyitem_Drawing_BehindDoc:
            this.behindDoc = Reader.GetBool();
            break;
        case historyitem_Drawing_SetGraphicObject:
            if (Reader.GetBool()) {
                this.GraphicObj = g_oTableId.Get_ById(Reader.GetString2());
            } else {
                this.GraphicObj = null;
            }
            if (isRealObject(this.GraphicObj)) {
                this.GraphicObj.handleUpdateExtents && this.GraphicObj.handleUpdateExtents();
            }
            break;
        case historyitem_SetSimplePos:
            this.SimplePos.Use = Reader.GetBool();
            if (Reader.GetBool()) {
                this.SimplePos.X = Reader.GetDouble();
            }
            if (Reader.GetBool()) {
                this.SimplePos.Y = Reader.GetDouble();
            }
            break;
        case historyitem_SetExtent:
            if (Reader.GetBool()) {
                this.Extent.W = Reader.GetDouble();
            }
            if (Reader.GetBool()) {
                this.Extent.H = Reader.GetDouble();
            }
            break;
        case historyitem_SetWrapPolygon:
            this.wrappingPolygon = readObject(Reader);
            break;
        }
    },
    Write_ToBinary: function (Writer) {
        Writer.WriteLong(this.Type);
        Writer.WriteString2(this.Id);
    },
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(historyitem_type_Drawing);
        Writer.WriteString2(this.Id);
        writeDouble(Writer, this.W);
        writeDouble(Writer, this.H);
        writeObject(Writer, this.GraphicObj);
        writeObject(Writer, this.DocumentContent);
        writeObject(Writer, this.Parent);
        writeObject(Writer, this.wrappingPolygon);
    },
    Read_FromBinary2: function (Reader) {
        this.Id = Reader.GetString2();
        this.DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
        this.W = readDouble(Reader);
        this.H = readDouble(Reader);
        this.GraphicObj = readObject(Reader);
        this.DocumentContent = readObject(Reader);
        this.Parent = readObject(Reader);
        this.wrappingPolygon = readObject(Reader);
        if (this.wrappingPolygon) {
            this.wrappingPolygon.wordGraphicObject = this;
        }
        this.Extent.W = this.W;
        this.Extent.H = this.H;
        this.drawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
        this.document = editor.WordControl.m_oLogicDocument;
        this.graphicObjects = editor.WordControl.m_oLogicDocument.DrawingObjects;
        this.graphicObjects.objectsMap["_" + this.Get_Id()] = this;
        g_oTableId.Add(this, this.Id);
    },
    Load_LinkData: function () {},
    getPageIndex: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getPageIndex === "function") {
            return this.GraphicObj.getPageIndex();
        }
        return -1;
    },
    draw: function (graphics, pageIndex) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.draw === "function") {
            graphics.SaveGrState();
            this.GraphicObj.draw(graphics);
            graphics.RestoreGrState();
        }
    },
    drawAdjustments: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.drawAdjustments === "function") {
            this.GraphicObj.drawAdjustments();
        }
    },
    getTransformMatrix: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getTransformMatrix === "function") {
            return this.GraphicObj.getTransformMatrix();
        }
        return null;
    },
    getOwnTransform: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getOwnTransform === "function") {
            return this.GraphicObj.getOwnTransform();
        }
        return null;
    },
    getExtensions: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getExtensions === "function") {
            return this.GraphicObj.getExtensions();
        }
        return null;
    },
    isGroup: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.isGroup === "function") {
            return this.GraphicObj.isGroup();
        }
        return false;
    },
    isShapeChild: function (bRetShape) {
        if (!this.Is_Inline()) {
            return bRetShape ? null : false;
        }
        var cur_doc_content = this.DocumentContent;
        while (cur_doc_content.Is_TableCellContent()) {
            cur_doc_content = cur_doc_content.Parent.Row.Table.Parent;
        }
        if (isRealObject(cur_doc_content.Parent) && typeof cur_doc_content.Parent.getObjectType === "function" && cur_doc_content.Parent.getObjectType() === historyitem_type_Shape) {
            return bRetShape ? cur_doc_content.Parent : true;
        }
        return bRetShape ? null : false;
    },
    getParentShape: function () {
        if (!this.Is_Inline()) {
            return null;
        }
        var cur_doc_content = this.DocumentContent;
        while (cur_doc_content.Is_TableCellContent()) {
            cur_doc_content = cur_doc_content.Parent.Row.Table.Parent;
        }
        if (isRealObject(cur_doc_content.Parent) && typeof cur_doc_content.Parent.isShape === "function") {
            return cur_doc_content.Parent;
        }
        return null;
    },
    checkShapeChildAndGetTopParagraph: function (paragraph) {
        var parent_paragraph = !paragraph ? this.Get_ParentParagraph() : paragraph;
        var parent_doc_content = parent_paragraph.Parent;
        if (parent_doc_content.Parent instanceof CShape) {
            if (!parent_doc_content.Parent.group) {
                return parent_doc_content.Parent.parent.Get_ParentParagraph();
            } else {
                var top_group = parent_doc_content.Parent.group;
                while (top_group.group) {
                    top_group = top_group.group;
                }
                return top_group.parent.Get_ParentParagraph();
            }
        } else {
            if (parent_doc_content.Is_TableCellContent()) {
                var top_doc_content = parent_doc_content;
                while (top_doc_content.Is_TableCellContent()) {
                    top_doc_content = top_doc_content.Parent.Row.Table.Parent;
                }
                if (top_doc_content.Parent instanceof CShape) {
                    if (!top_doc_content.Parent.group) {
                        return top_doc_content.Parent.parent.Get_ParentParagraph();
                    } else {
                        var top_group = top_doc_content.Parent.group;
                        while (top_group.group) {
                            top_group = top_group.group;
                        }
                        return top_group.parent.Get_ParentParagraph();
                    }
                } else {
                    return parent_paragraph;
                }
            }
        }
        return parent_paragraph;
    },
    getArrContentDrawingObjects: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getArrContentDrawingObjects === "function") {
            return this.GraphicObj.getArrContentDrawingObjects();
        }
        return [];
    },
    getSpTree: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getSpTree === "function") {
            return this.GraphicObj.getSpTree();
        }
        return [];
    },
    setZIndex2: function (zIndex) {
        this.RelativeHeight = zIndex;
    },
    hitToAdj: function (x, y) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.hitToAdj === "function") {
            return this.GraphicObj.hitToAdj(x, y);
        }
        return {
            hit: false,
            adjPolarFlag: null,
            adjNum: null
        };
    },
    hitToHandle: function (x, y) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.hitToHandle === "function") {
            return this.GraphicObj.hitToHandle(x, y);
        }
        return {
            hit: false,
            handleRotate: false,
            handleNum: null
        };
    },
    hit: function (x, y) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.hit === "function") {
            return this.GraphicObj.hit(x, y);
        }
        return false;
    },
    hitToTextRect: function (x, y) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.hitToTextRect === "function") {
            return this.GraphicObj.hitToTextRect(x, y);
        }
        return false;
    },
    hitToPath: function (x, y) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.hitToPath === "function") {
            return this.GraphicObj.hitToPath(x, y);
        }
        return false;
    },
    numberToCardDirection: function (handleNumber) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.numberToCardDirection === "function") {
            return this.GraphicObj.numberToCardDirection(handleNumber);
        }
        return null;
    },
    cursorGetPos: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorGetPos === "function") {
            return this.GraphicObj.cursorGetPos();
        }
        return {
            X: 0,
            Y: 0
        };
    },
    cardDirectionToNumber: function (cardDirection) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.cardDirectionToNumber === "function") {
            return this.GraphicObj.cardDirectionToNumber(cardDirection);
        }
        return null;
    },
    getAbsolutePosition: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getAbsolutePosition === "function") {
            return this.GraphicObj.getAbsolutePosition();
        }
        return null;
    },
    getResizeCoefficients: function (handleNum, x, y) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getResizeCoefficients === "function") {
            return this.GraphicObj.getResizeCoefficients(handleNum, x, y);
        }
        return {
            kd1: 1,
            kd2: 1
        };
    },
    getAllParagraphParaPr: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getAllParagraphParaPr === "function") {
            return this.GraphicObj.getAllParagraphParaPr();
        }
        return null;
    },
    getAllParagraphTextPr: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getAllParagraphTextPr === "function") {
            return this.GraphicObj.getAllParagraphTextPr();
        }
        return null;
    },
    getParagraphParaPr: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getParagraphParaPr === "function") {
            return this.GraphicObj.getParagraphParaPr();
        }
        return null;
    },
    getParagraphTextPr: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getParagraphTextPr === "function") {
            return this.GraphicObj.getParagraphTextPr();
        }
        return null;
    },
    getAngle: function (x, y) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getAngle === "function") {
            return this.GraphicObj.getAngle(x, y);
        }
        return 0;
    },
    calculateSnapArrays: function () {
        this.GraphicObj.snapArrayX.length = 0;
        this.GraphicObj.snapArrayY.length = 0;
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.calculateSnapArrays === "function") {
            this.GraphicObj.calculateSnapArrays(this.GraphicObj.snapArrayX, this.GraphicObj.snapArrayY);
        }
    },
    calculateAdjPolarRange: function (adjIndex) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.calculateAdjPolarRange === "function") {
            this.GraphicObj.calculateAdjPolarRange(adjIndex);
        }
    },
    calculateAdjXYRange: function (adjIndex) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.calculateAdjXYRange === "function") {
            this.GraphicObj.calculateAdjXYRange(adjIndex);
        }
    },
    checkAdjModify: function (adjPolarFlag, adjNum, compareShape) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.checkAdjModify === "function") {
            return this.GraphicObj.checkAdjModify(adjPolarFlag, adjNum, compareShape);
        }
        return false;
    },
    createTrackObjectForMove: function (majorOffsetX, majorOffsetY) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.createTrackObjectForMove === "function") {
            return this.GraphicObj.createTrackObjectForMove(majorOffsetX, majorOffsetY);
        }
        return null;
    },
    createTrackObjectForResize: function (handleNumber, pageIndex) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.createTrackObjectForResize === "function") {
            return this.GraphicObj.createTrackObjectForResize(handleNumber, pageIndex);
        }
        return null;
    },
    createTrackObjectForRotate: function (pageIndex) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.createTrackObjectForRotate === "function") {
            return this.GraphicObj.createTrackObjectForRotate(pageIndex);
        }
        return null;
    },
    recalculateCurPos: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.recalculateCurPos === "function") {
            this.GraphicObj.recalculateCurPos();
        }
    },
    setPageIndex: function (newPageIndex) {
        this.pageIndex = newPageIndex;
        this.PageNum = newPageIndex;
    },
    Get_AllParagraphs_ByNumbering: function (NumPr, ParaArray) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.Get_AllParagraphs_ByNumbering === "function") {
            this.GraphicObj.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
        }
    },
    getTableProps: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getTableProps === "function") {
            return this.GraphicObj.getTableProps();
        }
        return null;
    },
    canGroup: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.canGroup === "function") {
            return this.GraphicObj.canGroup();
        }
        return false;
    },
    canUnGroup: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.canGroup === "function") {
            return this.GraphicObj.canUnGroup();
        }
        return false;
    },
    select: function (pageIndex) {
        this.selected = true;
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.select === "function") {
            this.GraphicObj.select(pageIndex);
        }
    },
    paragraphClearFormatting: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.paragraphAdd === "function") {
            this.GraphicObj.paragraphClearFormatting();
        }
    },
    paragraphAdd: function (paraItem, bRecalculate) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.paragraphAdd === "function") {
            this.GraphicObj.paragraphAdd(paraItem, bRecalculate);
        }
    },
    setParagraphShd: function (Shd) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphShd === "function") {
            this.GraphicObj.setParagraphShd(Shd);
        }
    },
    getArrayWrapPolygons: function () {
        if ((isRealObject(this.GraphicObj) && typeof this.GraphicObj.getArrayWrapPolygons === "function")) {
            return this.GraphicObj.getArrayWrapPolygons();
        }
        return [];
    },
    getArrayWrapIntervals: function (x0, y0, x1, y1, Y0Sp, Y1Sp, LeftField, RightField, arr_intervals) {
        if (this.wrappingType === WRAPPING_TYPE_THROUGH || this.wrappingType === WRAPPING_TYPE_TIGHT) {
            y0 = Y0Sp;
            y1 = Y1Sp;
        }
        this.wrappingPolygon.wordGraphicObject = this;
        return this.wrappingPolygon.getArrayWrapIntervals(x0, y0, x1, y1, LeftField, RightField, arr_intervals);
    },
    setAllParagraphNumbering: function (numInfo) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.addInlineTable === "function") {
            this.GraphicObj.setAllParagraphNumbering(numInfo);
        }
    },
    addNewParagraph: function (bRecalculate) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.addNewParagraph === "function") {
            this.GraphicObj.addNewParagraph(bRecalculate);
        }
    },
    addInlineTable: function (cols, rows) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.addInlineTable === "function") {
            this.GraphicObj.addInlineTable(cols, rows);
        }
    },
    applyTextPr: function (paraItem, bRecalculate) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.applyTextPr === "function") {
            this.GraphicObj.applyTextPr(paraItem, bRecalculate);
        }
    },
    allIncreaseDecFontSize: function (bIncrease) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.allIncreaseDecFontSize === "function") {
            this.GraphicObj.allIncreaseDecFontSize(bIncrease);
        }
    },
    setParagraphNumbering: function (NumInfo) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.allIncreaseDecFontSize === "function") {
            this.GraphicObj.setParagraphNumbering(NumInfo);
        }
    },
    allIncreaseDecIndent: function (bIncrease) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.allIncreaseDecIndent === "function") {
            this.GraphicObj.allIncreaseDecIndent(bIncrease);
        }
    },
    allSetParagraphAlign: function (align) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.allSetParagraphAlign === "function") {
            this.GraphicObj.allSetParagraphAlign(align);
        }
    },
    paragraphIncreaseDecFontSize: function (bIncrease) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.paragraphIncreaseDecFontSize === "function") {
            this.GraphicObj.paragraphIncreaseDecFontSize(bIncrease);
        }
    },
    paragraphIncreaseDecIndent: function (bIncrease) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.paragraphIncreaseDecIndent === "function") {
            this.GraphicObj.paragraphIncreaseDecIndent(bIncrease);
        }
    },
    setParagraphAlign: function (align) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphAlign === "function") {
            this.GraphicObj.setParagraphAlign(align);
        }
    },
    setParagraphSpacing: function (Spacing) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphSpacing === "function") {
            this.GraphicObj.setParagraphSpacing(Spacing);
        }
    },
    updatePosition: function (x, y) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.updatePosition === "function") {
            this.GraphicObj.updatePosition(x, y);
        }
    },
    updatePosition2: function (x, y) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.updatePosition === "function") {
            this.GraphicObj.updatePosition2(x, y);
        }
    },
    addInlineImage: function (W, H, Img, chart, bFlow) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.addInlineImage === "function") {
            this.GraphicObj.addInlineImage(W, H, Img, chart, bFlow);
        }
    },
    canAddComment: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.canAddComment === "function") {
            return this.GraphicObj.canAddComment();
        }
        return false;
    },
    addComment: function (commentData) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.addComment === "function") {
            return this.GraphicObj.addComment(commentData);
        }
    },
    recalculateWrapPolygon: function () {
        if (this.wrappingPolygon) {
            if (this.wrappingPolygon.edited) {
                this.wrappingPolygon.calculateRelToAbs(this.getTransformMatrix());
            } else {
                this.wrappingPolygon.calculate();
            }
        }
    },
    selectionSetStart: function (x, y, event, pageIndex) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.selectionSetStart === "function") {
            this.GraphicObj.selectionSetStart(x, y, event, pageIndex);
        }
    },
    selectionSetEnd: function (x, y, event, pageIndex) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.selectionSetEnd === "function") {
            this.GraphicObj.selectionSetEnd(x, y, event, pageIndex);
        }
    },
    selectionRemove: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.selectionRemove === "function") {
            this.GraphicObj.selectionRemove();
        }
    },
    updateSelectionState: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.updateSelectionState === "function") {
            this.GraphicObj.updateSelectionState();
        }
    },
    cursorMoveLeft: function (AddToSelect, Word) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorMoveLeft === "function") {
            this.GraphicObj.cursorMoveLeft(AddToSelect, Word);
        }
    },
    cursorMoveRight: function (AddToSelect, Word) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorMoveRight === "function") {
            this.GraphicObj.cursorMoveRight(AddToSelect, Word);
        }
    },
    cursorMoveUp: function (AddToSelect) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorMoveUp === "function") {
            this.GraphicObj.cursorMoveUp(AddToSelect);
        }
    },
    cursorMoveDown: function (AddToSelect) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorMoveDown === "function") {
            this.GraphicObj.cursorMoveDown(AddToSelect);
        }
    },
    cursorMoveEndOfLine: function (AddToSelect) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorMoveEndOfLine === "function") {
            this.GraphicObj.cursorMoveEndOfLine(AddToSelect);
        }
    },
    cursorMoveStartOfLine: function (AddToSelect) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.cursorMoveStartOfLine === "function") {
            this.GraphicObj.cursorMoveStartOfLine(AddToSelect);
        }
    },
    remove: function (Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.remove === "function") {
            this.GraphicObj.remove(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd);
        }
    },
    hitToWrapPolygonPoint: function (x, y) {
        if (this.wrappingPolygon && this.wrappingPolygon.arrPoints.length > 0) {
            var radius = this.drawingDocument.GetMMPerDot(TRACK_CIRCLE_RADIUS);
            var arr_point = this.wrappingPolygon.calculatedPoints;
            var point_count = arr_point.length;
            var dx, dy;
            var previous_point;
            for (var i = 0; i < arr_point.length; ++i) {
                var cur_point = arr_point[i];
                dx = x - cur_point.x;
                dy = y - cur_point.y;
                if (Math.sqrt(dx * dx + dy * dy) < radius) {
                    return {
                        hit: true,
                        hitType: WRAP_HIT_TYPE_POINT,
                        pointNum: i
                    };
                }
            }
            cur_point = arr_point[0];
            previous_point = arr_point[arr_point.length - 1];
            var vx, vy;
            vx = cur_point.x - previous_point.x;
            vy = cur_point.y - previous_point.y;
            if (Math.abs(vx) > 0 || Math.abs(vy) > 0) {
                if (HitInLine(this.drawingDocument.CanvasHitContext, x, y, previous_point.x, previous_point.y, cur_point.x, cur_point.y)) {
                    return {
                        hit: true,
                        hitType: WRAP_HIT_TYPE_SECTION,
                        pointNum1: arr_point.length - 1,
                        pointNum2: 0
                    };
                }
            }
            for (var point_index = 1; point_index < point_count; ++point_index) {
                cur_point = arr_point[point_index];
                previous_point = arr_point[point_index - 1];
                vx = cur_point.x - previous_point.x;
                vy = cur_point.y - previous_point.y;
                if (Math.abs(vx) > 0 || Math.abs(vy) > 0) {
                    if (HitInLine(this.drawingDocument.CanvasHitContext, x, y, previous_point.x, previous_point.y, cur_point.x, cur_point.y)) {
                        return {
                            hit: true,
                            hitType: WRAP_HIT_TYPE_SECTION,
                            pointNum1: point_index - 1,
                            pointNum2: point_index
                        };
                    }
                }
            }
        }
        return {
            hit: false
        };
    },
    documentGetAllFontNames: function (AllFonts) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.documentGetAllFontNames === "function") {
            this.GraphicObj.documentGetAllFontNames(AllFonts);
        }
    },
    isCurrentElementParagraph: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.isCurrentElementParagraph === "function") {
            return this.GraphicObj.isCurrentElementParagraph();
        }
        return false;
    },
    isCurrentElementTable: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.isCurrentElementTable === "function") {
            return this.GraphicObj.isCurrentElementTable();
        }
        return false;
    },
    canChangeWrapPolygon: function () {
        if (this.Is_Inline()) {
            return false;
        }
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.canChangeWrapPolygon === "function") {
            return this.GraphicObj.canChangeWrapPolygon();
        }
        return false;
    },
    init: function () {},
    calculateAfterOpen: function () {},
    getBounds: function () {
        return this.GraphicObj.bounds;
    },
    getWrapContour: function () {
        if (isRealObject(this.wrappingPolygon)) {
            var kw = 1 / 36000;
            var kh = 1 / 36000;
            var rel_points = this.wrappingPolygon.relativeArrPoints;
            var ret = [];
            for (var i = 0; i < rel_points.length; ++i) {
                ret[i] = {
                    x: rel_points[i].x * kw,
                    y: rel_points[i].y * kh
                };
            }
            return ret;
        }
        return [];
    },
    getDrawingArrayType: function () {
        if (this.Is_Inline()) {
            return DRAWING_ARRAY_TYPE_INLINE;
        }
        if (this.behindDoc === true && this.wrappingType === WRAPPING_TYPE_NONE) {
            return DRAWING_ARRAY_TYPE_BEHIND;
        }
        if (this.wrappingType === WRAPPING_TYPE_NONE) {
            return DRAWING_ARRAY_TYPE_BEFORE;
        }
        return DRAWING_ARRAY_TYPE_WRAPPING;
    },
    documentSearch: function (String, search_Common) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.documentSearch === "function") {
            this.GraphicObj.documentSearch(String, search_Common);
        }
    },
    setParagraphContextualSpacing: function (Value) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphContextualSpacing === "function") {
            this.GraphicObj.setParagraphContextualSpacing(Value);
        }
    },
    setParagraphStyle: function (style) {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.setParagraphStyle === "function") {
            this.GraphicObj.setParagraphStyle(style);
        }
    },
    setSimplePos: function (use, x, y) {
        History.Add(this, {
            Type: historyitem_SetSimplePos,
            oldX: this.SimplePos.X,
            oldY: this.SimplePos.Y,
            oldUse: this.SimplePos.Use,
            newX: x,
            newY: y,
            newUse: use
        });
        this.SimplePos.Use = use;
        this.SimplePos.X = x;
        this.SimplePos.Y = y;
    },
    setExtent: function (extX, extY) {
        History.Add(this, {
            Type: historyitem_SetExtent,
            oldW: this.Extent.W,
            oldH: this.Extent.H,
            newW: extX,
            newH: extY
        });
        this.Extent.W = extX;
        this.Extent.H = extY;
    },
    addWrapPolygon: function (wrapPolygon) {
        History.Add(this, {
            Type: historyitem_SetWrapPolygon,
            oldW: this.wrappingPolygon,
            newW: wrapPolygon
        });
        this.wrappingPolygon = wrapPolygon;
    },
    copy: function () {
        var c = new ParaDrawing(this.W, this.H, null, editor.WordControl.m_oLogicDocument.DrawingDocument, null, null);
        c.Set_DrawingType(this.DrawingType);
        if (isRealObject(this.GraphicObj)) {
            var g = this.GraphicObj.copy(c);
            c.Set_GraphicObject(g);
            g.setParent(c);
        }
        var d = this.Distance;
        c.Set_PositionH(this.PositionH.RelativeFrom, this.PositionH.Align, this.PositionH.Value);
        c.Set_PositionV(this.PositionV.RelativeFrom, this.PositionV.Align, this.PositionV.Value);
        c.Set_Distance(d.L, d.T, d.R, d.B);
        c.Set_AllowOverlap(this.AllowOverlap);
        c.Set_WrappingType(this.wrappingType);
        c.Set_BehindDoc(this.behindDoc);
        c.Update_Size(this.W, this.H);
        return c;
    },
    OnContentReDraw: function () {
        if (this.Parent && this.Parent.Parent) {
            this.Parent.Parent.OnContentReDraw(this.PageNum, this.PageNum);
        }
    },
    getBase64Img: function () {
        if (isRealObject(this.GraphicObj) && typeof this.GraphicObj.getBase64Img === "function") {
            return this.GraphicObj.getBase64Img();
        }
        return null;
    },
    isPointInObject: function (x, y, pageIndex) {
        if (this.pageIndex === pageIndex) {
            if (isRealObject(this.GraphicObj)) {
                var hit = (typeof this.GraphicObj.hit === "function") ? this.GraphicObj.hit(x, y) : false;
                var hit_to_text = (typeof this.GraphicObj.hitToTextRect === "function") ? this.GraphicObj.hitToTextRect(x, y) : false;
                return hit || hit_to_text;
            }
        }
        return false;
    },
    Restart_CheckSpelling: function () {
        this.GraphicObj && this.GraphicObj.Restart_CheckSpelling && this.GraphicObj.Restart_CheckSpelling();
    }
};
function GraphicPicture(Img) {
    this.Img = Img;
}
GraphicPicture.prototype = {
    Draw: function (Context, X, Y, W, H) {
        Context.drawImage(this.Img, X, Y, W, H);
    },
    Copy: function () {
        return new GraphicPicture(this.Img);
    }
};
function ParaPageNum() {
    this.FontKoef = 1;
    this.NumWidths = [];
    this.Widths = [];
    this.String = [];
    this.Width = 0;
    this.WidthVisible = 0;
}
ParaPageNum.prototype = {
    Type: para_PageNum,
    Get_Type: function () {
        return para_PageNum;
    },
    Draw: function (X, Y, Context) {
        var Len = this.String.length;
        var _X = X;
        var _Y = Y;
        Context.SetFontSlot(fontslot_ASCII, this.FontKoef);
        for (var Index = 0; Index < Len; Index++) {
            var Char = this.String.charAt(Index);
            Context.FillText(_X, _Y, Char);
            _X += this.Widths[Index];
        }
    },
    Measure: function (Context, TextPr) {
        this.FontKoef = TextPr.Get_FontKoef();
        Context.SetFontSlot(fontslot_ASCII, this.FontKoef);
        for (var Index = 0; Index < 10; Index++) {
            this.NumWidths[Index] = Context.Measure("" + Index).Width;
        }
        this.Width = 0;
        this.Height = 0;
        this.WidthVisible = 0;
    },
    Get_Width: function () {
        return this.Width;
    },
    Get_WidthVisible: function () {
        return this.WidthVisible;
    },
    Set_WidthVisible: function (WidthVisible) {
        this.WidthVisible = WidthVisible;
    },
    Set_Page: function (PageNum) {
        this.String = "" + PageNum;
        var Len = this.String.length;
        var RealWidth = 0;
        for (var Index = 0; Index < Len; Index++) {
            var Char = parseInt(this.String.charAt(Index));
            this.Widths[Index] = this.NumWidths[Char];
            RealWidth += this.NumWidths[Char];
        }
        this.Width = RealWidth;
        this.WidthVisible = RealWidth;
    },
    Save_RecalculateObject: function (Copy) {
        return new CPageNumRecalculateObject(this.Type, this.Widths, this.String, this.Width, Copy);
    },
    Load_RecalculateObject: function (RecalcObj) {
        this.Widths = RecalcObj.Widths;
        this.String = RecalcObj.String;
        this.Width = RecalcObj.Width;
        this.WidthVisible = this.Width;
    },
    Prepare_RecalculateObject: function () {
        this.Widths = [];
        this.String = "";
    },
    Document_CreateFontCharMap: function (FontCharMap) {
        var sValue = "1234567890";
        for (var Index = 0; Index < sValue.length; Index++) {
            var Char = sValue.charAt(Index);
            FontCharMap.AddChar(Char);
        }
    },
    Is_RealContent: function () {
        return true;
    },
    Can_AddNumbering: function () {
        return true;
    },
    Copy: function () {
        return new ParaPageNum();
    },
    Write_ToBinary: function (Writer) {
        Writer.WriteLong(para_PageNum);
    },
    Read_FromBinary: function (Reader) {}
};
function CPageNumRecalculateObject(Type, Widths, String, Width, Copy) {
    this.Type = Type;
    this.Widths = Widths;
    this.String = String;
    this.Width = Width;
    if (true === Copy) {
        this.Widths = [];
        var Len = Widths.length;
        for (var Index = 0; Index < Len; Index++) {
            this.Widths[Index] = Widths[Index];
        }
    }
}
function ParaPresentationNumbering() {
    this.Bullet = null;
    this.BulletNum = null;
}
ParaPresentationNumbering.prototype = {
    Type: para_PresentationNumbering,
    Draw: function (X, Y, Context, FirstTextPr, PDSE) {
        this.Bullet.Draw(X, Y, Context, FirstTextPr, PDSE);
    },
    Measure: function (Context, FirstTextPr, Theme) {
        this.Width = 0;
        this.Height = 0;
        this.WidthVisible = 0;
        var Temp = this.Bullet.Measure(Context, FirstTextPr, this.BulletNum, Theme);
        this.Width = Temp.Width;
        this.WidthVisible = Temp.Width;
    },
    Is_RealContent: function () {
        return true;
    },
    Can_AddNumbering: function () {
        return false;
    },
    Copy: function () {
        return new ParaPresentationNumbering();
    },
    Write_ToBinary: function (Writer) {
        Writer.WriteLong(this.Type);
    },
    Read_FromBinary: function (Reader) {},
    Check_Range: function (Range, Line) {
        if (null !== this.Item && null !== this.Run && Range === this.Range && Line === this.Line) {
            return true;
        }
        return false;
    }
};
function ParagraphContent_Read_FromBinary(Reader) {
    var ElementType = Reader.GetLong();
    var Element = null;
    switch (ElementType) {
    case para_TextPr:
        case para_Drawing:
        case para_HyperlinkStart:
        var ElementId = Reader.GetString2();
        Element = g_oTableId.Get_ById(ElementId);
        return Element;
    case para_Text:
        Element = new ParaText();
        break;
    case para_Space:
        Element = new ParaSpace();
        break;
    case para_End:
        Element = new ParaEnd();
        break;
    case para_NewLine:
        Element = new ParaNewLine();
        break;
    case para_Numbering:
        Element = new ParaNumbering();
        break;
    case para_Tab:
        Element = new ParaTab();
        break;
    case para_PageNum:
        Element = new ParaPageNum();
        break;
    case para_Math_Placeholder:
        Element = new CMathText();
        break;
    case para_Math_Text:
        Element = new CMathText();
        break;
    case para_Math_Ampersand:
        Element = new CMathAmp();
        break;
    case para_PresentationNumbering:
        Element = new ParaPresentationNumbering();
        break;
    }
    if (null != Element) {
        Element.Read_FromBinary(Reader);
    }
    return Element;
}