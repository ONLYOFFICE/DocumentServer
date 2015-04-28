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
var numbering_numfmt_None = 0;
var numbering_numfmt_Bullet = 4097;
var numbering_numfmt_Decimal = 8194;
var numbering_numfmt_LowerRoman = 8195;
var numbering_numfmt_UpperRoman = 8196;
var numbering_numfmt_LowerLetter = 8197;
var numbering_numfmt_UpperLetter = 8198;
var numbering_numfmt_DecimalZero = 8199;
var numbering_lvltext_Text = 1;
var numbering_lvltext_Num = 2;
var numbering_suff_Tab = 1;
var numbering_suff_Space = 2;
var numbering_suff_Nothing = 3;
function Numbering_Number_To_Alpha(Num, bLowerCase) {
    var _Num = Num - 1;
    var Count = (_Num - _Num % 26) / 26;
    var Ost = _Num % 26;
    var T = "";
    var Letter;
    if (true === bLowerCase) {
        Letter = String.fromCharCode(Ost + 97);
    } else {
        Letter = String.fromCharCode(Ost + 65);
    }
    for (var Index2 = 0; Index2 < Count + 1; Index2++) {
        T += Letter;
    }
    return T;
}
function Numbering_Number_To_String(Num) {
    return "" + Num;
}
function Numbering_Number_To_Roman(Num, bLowerCase) {
    var Rims;
    if (true === bLowerCase) {
        Rims = ["m", "cm", "d", "cd", "c", "xc", "l", "xl", "x", "ix", "v", "iv", "i", " "];
    } else {
        Rims = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I", " "];
    }
    var Vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1, 0];
    var T = "";
    var Index2 = 0;
    while (Num > 0) {
        while (Vals[Index2] <= Num) {
            T += Rims[Index2];
            Num -= Vals[Index2];
        }
        Index2++;
        if (Index2 >= Rims.length) {
            break;
        }
    }
    return T;
}
function LvlText_Read_FromBinary(Reader) {
    var ElementType = Reader.GetLong();
    var Element = null;
    if (numbering_lvltext_Num === ElementType) {
        Element = new CLvlText_Num();
    } else {
        if (numbering_lvltext_Text === ElementType) {
            Element = new CLvlText_Text();
        }
    }
    Element.Read_FromBinary(Reader);
    return Element;
}
function CLvlText_Text(Val) {
    if ("string" == typeof(Val)) {
        this.Value = Val;
    } else {
        this.Value = "";
    }
    this.Type = numbering_lvltext_Text;
}
CLvlText_Text.prototype = {
    Copy: function () {
        var Obj = new CLvlText_Text(this.Value);
        return Obj;
    },
    Write_ToBinary: function (Writer) {
        Writer.WriteLong(numbering_lvltext_Text);
        Writer.WriteString2(this.Value);
    },
    Read_FromBinary: function (Reader) {
        this.Value = Reader.GetString2();
    }
};
function CLvlText_Num(Lvl) {
    if ("number" == typeof(Lvl)) {
        this.Value = Lvl;
    } else {
        this.Value = 0;
    }
    this.Type = numbering_lvltext_Num;
}
CLvlText_Num.prototype = {
    Copy: function () {
        var Obj = new CLvlText_Num(this.Value);
        return Obj;
    },
    Write_ToBinary: function (Writer) {
        Writer.WriteLong(numbering_lvltext_Num);
        Writer.WriteLong(this.Value);
    },
    Read_FromBinary: function (Reader) {
        this.Value = Reader.GetLong();
    }
};
function CAbstractNum(Type) {
    this.Id = g_oIdCounter.Get_NewId();
    if ("undefined" == typeof(Type)) {
        Type = numbering_numfmt_Bullet;
    }
    this.Lock = new CLock();
    if (false === g_oIdCounter.m_bLoad) {
        this.Lock.Set_Type(locktype_Mine, false);
        if (typeof CollaborativeEditing !== "undefined") {
            CollaborativeEditing.Add_Unlock2(this);
        }
    }
    this.NumStyleLink = undefined;
    this.StyleLink = undefined;
    this.Lvl = [];
    for (var Index = 0; Index < 9; Index++) {
        this.Lvl[Index] = {};
        var Lvl = this.Lvl[Index];
        Lvl.PStyle = undefined;
        Lvl.Start = 1;
        Lvl.Restart = -1;
        Lvl.Suff = numbering_suff_Tab;
        var Left = 36 * (Index + 1) * g_dKoef_pt_to_mm;
        var FirstLine = -18 * g_dKoef_pt_to_mm;
        Lvl.Jc = align_Left;
        Lvl.Format = numbering_numfmt_Bullet;
        Lvl.LvlText = [];
        Lvl.ParaPr = new CParaPr();
        Lvl.ParaPr.Ind.Left = Left;
        Lvl.ParaPr.Ind.FirstLine = FirstLine;
        var TextPr = new CTextPr();
        if (0 == Index % 3) {
            TextPr.RFonts.Set_All("Symbol", -1);
            Lvl.LvlText.push(new CLvlText_Text(String.fromCharCode(183)));
        } else {
            if (1 == Index % 3) {
                TextPr.RFonts.Set_All("Courier New", -1);
                Lvl.LvlText.push(new CLvlText_Text("o"));
            } else {
                TextPr.RFonts.Set_All("Wingdings", -1);
                Lvl.LvlText.push(new CLvlText_Text(String.fromCharCode(167)));
            }
        }
        Lvl.TextPr = TextPr;
    }
    g_oTableId.Add(this, this.Id);
}
CAbstractNum.prototype = {
    Set_Id: function (newId) {
        g_oTableId.Reset_Id(this, newId, this.Id);
        this.Id = newId;
    },
    Get_Id: function () {
        return this.Id;
    },
    Copy: function (AbstractNum) {
        for (var Index = 0; Index < 9; Index++) {
            var Lvl_new = this.Internal_CopyLvl(AbstractNum.Lvl[Index]);
            var Lvl_old = this.Lvl[Index];
            History.Add(this, {
                Type: historyitem_AbstractNum_LvlChange,
                Index: Index,
                Old: Lvl_old,
                New: Lvl_new
            });
            this.Lvl[Index] = Lvl_new;
        }
    },
    Change_LeftInd: function (NewLeft) {
        var OldLeft = this.Lvl[0].ParaPr.Ind.Left;
        for (var Index = 0; Index < 9; Index++) {
            var Lvl_new = this.Internal_CopyLvl(this.Lvl[Index]);
            var Lvl_old = this.Internal_CopyLvl(this.Lvl[Index]);
            Lvl_new.ParaPr.Ind.Left = Lvl_old.ParaPr.Ind.Left - OldLeft + NewLeft;
            this.Internal_SetLvl(Index, Lvl_new);
            History.Add(this, {
                Type: historyitem_AbstractNum_LvlChange,
                Index: Index,
                Old: Lvl_old,
                New: Lvl_new
            });
        }
        var LogicDocument = editor.WordControl.m_oLogicDocument;
        var AllParagraphs = LogicDocument.Get_AllParagraphs_ByNumbering({
            NumId: this.Id,
            Lvl: undefined
        });
        var Count = AllParagraphs.length;
        for (var Index = 0; Index < Count; Index++) {
            var Para = AllParagraphs[Index];
            Para.CompiledPr.NeedRecalc = true;
        }
    },
    Get_LvlByStyle: function (StyleId) {
        for (var Index = 0; Index < 9; Index++) {
            var Lvl = this.Lvl[Index];
            if (StyleId === Lvl.PStyle) {
                return Index;
            }
        }
        return -1;
    },
    Get_Lvl: function (Lvl) {
        if (undefined === this.Lvl[Lvl]) {
            return this.Lvl[0];
        }
        return this.Lvl[Lvl];
    },
    Set_Lvl: function (iLvl, Lvl_new) {
        if ("number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9) {
            return;
        }
        var Lvl_old = this.Lvl[iLvl];
        History.Add(this, {
            Type: historyitem_AbstractNum_LvlChange,
            Index: iLvl,
            Old: Lvl_old,
            New: Lvl_new
        });
    },
    Create_Default_Numbered: function () {
        for (var Index = 0; Index < 9; Index++) {
            var Lvl_old = this.Internal_CopyLvl(this.Lvl[Index]);
            this.Lvl[Index] = {};
            var Lvl = this.Lvl[Index];
            Lvl.Start = 1;
            Lvl.Restart = -1;
            Lvl.Suff = numbering_suff_Tab;
            var Left = 36 * (Index + 1) * g_dKoef_pt_to_mm;
            var FirstLine = -18 * g_dKoef_pt_to_mm;
            if (0 == Index % 3) {
                Lvl.Jc = align_Left;
                Lvl.Format = numbering_numfmt_Decimal;
            } else {
                if (1 == Index % 3) {
                    Lvl.Jc = align_Left;
                    Lvl.Format = numbering_numfmt_LowerLetter;
                } else {
                    Lvl.Jc = align_Right;
                    Lvl.Format = numbering_numfmt_LowerRoman;
                    FirstLine = -9 * g_dKoef_pt_to_mm;
                }
            }
            Lvl.LvlText = [];
            Lvl.LvlText.push(new CLvlText_Num(Index));
            Lvl.LvlText.push(new CLvlText_Text("."));
            Lvl.ParaPr = new CParaPr();
            Lvl.ParaPr.Ind.Left = Left;
            Lvl.ParaPr.Ind.FirstLine = FirstLine;
            Lvl.TextPr = new CTextPr();
            var Lvl_new = this.Internal_CopyLvl(Lvl);
            History.Add(this, {
                Type: historyitem_AbstractNum_LvlChange,
                Index: Index,
                Old: Lvl_old,
                New: Lvl_new
            });
        }
    },
    Create_Default_Multilevel_1: function () {
        for (var Index = 0; Index < 9; Index++) {
            var Lvl_old = this.Internal_CopyLvl(this.Lvl[Index]);
            this.Lvl[Index] = {};
            var Lvl = this.Lvl[Index];
            Lvl.Start = 1;
            Lvl.Restart = -1;
            Lvl.Suff = numbering_suff_Tab;
            var Left = 18 * (Index + 1) * g_dKoef_pt_to_mm;
            var FirstLine = -18 * g_dKoef_pt_to_mm;
            Lvl.Jc = align_Left;
            if (0 == Index % 3) {
                Lvl.Format = numbering_numfmt_Decimal;
            } else {
                if (1 == Index % 3) {
                    Lvl.Format = numbering_numfmt_LowerLetter;
                } else {
                    Lvl.Format = numbering_numfmt_LowerRoman;
                }
            }
            Lvl.LvlText = [];
            Lvl.LvlText.push(new CLvlText_Num(Index));
            Lvl.LvlText.push(new CLvlText_Text(")"));
            Lvl.ParaPr = new CParaPr();
            Lvl.ParaPr.Ind.Left = Left;
            Lvl.ParaPr.Ind.FirstLine = FirstLine;
            var TextPr = new CTextPr();
            Lvl.TextPr = TextPr;
            var Lvl_new = this.Internal_CopyLvl(Lvl);
            History.Add(this, {
                Type: historyitem_AbstractNum_LvlChange,
                Index: Index,
                Old: Lvl_old,
                New: Lvl_new
            });
        }
    },
    Create_Default_Multilevel_2: function () {
        for (var Index = 0; Index < 9; Index++) {
            var Lvl_old = this.Internal_CopyLvl(this.Lvl[Index]);
            this.Lvl[Index] = {};
            var Lvl = this.Lvl[Index];
            Lvl.Start = 1;
            Lvl.Restart = -1;
            Lvl.Suff = numbering_suff_Tab;
            var Left = 0;
            var FirstLine = 0;
            switch (Index) {
            case 0:
                Left = 18 * g_dKoef_pt_to_mm;
                FirstLine = -18 * g_dKoef_pt_to_mm;
                break;
            case 1:
                Left = 39.6 * g_dKoef_pt_to_mm;
                FirstLine = -21.6 * g_dKoef_pt_to_mm;
                break;
            case 2:
                Left = 61.2 * g_dKoef_pt_to_mm;
                FirstLine = -25.2 * g_dKoef_pt_to_mm;
                break;
            case 3:
                Left = 86.40000000000001 * g_dKoef_pt_to_mm;
                FirstLine = -32.4 * g_dKoef_pt_to_mm;
                break;
            case 4:
                Left = 111.6 * g_dKoef_pt_to_mm;
                FirstLine = -39.6 * g_dKoef_pt_to_mm;
                break;
            case 5:
                Left = 136.8 * g_dKoef_pt_to_mm;
                FirstLine = -46.8 * g_dKoef_pt_to_mm;
                break;
            case 6:
                Left = 162 * g_dKoef_pt_to_mm;
                FirstLine = -54 * g_dKoef_pt_to_mm;
                break;
            case 7:
                Left = 187.2 * g_dKoef_pt_to_mm;
                FirstLine = -61.2 * g_dKoef_pt_to_mm;
                break;
            case 8:
                Left = 216 * g_dKoef_pt_to_mm;
                FirstLine = -72 * g_dKoef_pt_to_mm;
                break;
            }
            Lvl.Jc = align_Left;
            Lvl.Format = numbering_numfmt_Decimal;
            Lvl.LvlText = [];
            for (var Index2 = 0; Index2 <= Index; Index2++) {
                Lvl.LvlText.push(new CLvlText_Num(Index2));
                Lvl.LvlText.push(new CLvlText_Text("."));
            }
            Lvl.ParaPr = new CParaPr();
            Lvl.ParaPr.Ind.Left = Left;
            Lvl.ParaPr.Ind.FirstLine = FirstLine;
            var TextPr = new CTextPr();
            Lvl.TextPr = TextPr;
            var Lvl_new = this.Internal_CopyLvl(Lvl);
            History.Add(this, {
                Type: historyitem_AbstractNum_LvlChange,
                Index: Index,
                Old: Lvl_old,
                New: Lvl_new
            });
        }
    },
    Create_Default_Multilevel_3: function () {
        for (var Index = 0; Index < 9; Index++) {
            var Lvl_old = this.Internal_CopyLvl(this.Lvl[Index]);
            this.Lvl[Index] = {};
            var Lvl = this.Lvl[Index];
            Lvl.Start = 1;
            Lvl.Restart = -1;
            Lvl.Suff = numbering_suff_Tab;
            var Left = 18 * (Index + 1) * g_dKoef_pt_to_mm;
            var FirstLine = -18 * g_dKoef_pt_to_mm;
            Lvl.Format = numbering_numfmt_Bullet;
            Lvl.Jc = align_Left;
            Lvl.LvlText = [];
            switch (Index) {
            case 0:
                Lvl.LvlText.push(new CLvlText_Text(String.fromCharCode(118)));
                break;
            case 1:
                Lvl.LvlText.push(new CLvlText_Text(String.fromCharCode(216)));
                break;
            case 2:
                Lvl.LvlText.push(new CLvlText_Text(String.fromCharCode(167)));
                break;
            case 3:
                Lvl.LvlText.push(new CLvlText_Text(String.fromCharCode(183)));
                break;
            case 4:
                Lvl.LvlText.push(new CLvlText_Text(String.fromCharCode(168)));
                break;
            case 5:
                Lvl.LvlText.push(new CLvlText_Text(String.fromCharCode(216)));
                break;
            case 6:
                Lvl.LvlText.push(new CLvlText_Text(String.fromCharCode(167)));
                break;
            case 7:
                Lvl.LvlText.push(new CLvlText_Text(String.fromCharCode(183)));
                break;
            case 8:
                Lvl.LvlText.push(new CLvlText_Text(String.fromCharCode(168)));
                break;
            }
            Lvl.ParaPr = new CParaPr();
            Lvl.ParaPr.Ind.Left = Left;
            Lvl.ParaPr.Ind.FirstLine = FirstLine;
            var TextPr = new CTextPr();
            if (3 === Index || 4 === Index || 7 === Index || 8 === Index) {
                TextPr.RFonts.Set_All("Symbol", -1);
            } else {
                TextPr.RFonts.Set_All("Wingdings", -1);
            }
            Lvl.TextPr = TextPr;
            var Lvl_new = this.Internal_CopyLvl(Lvl);
            History.Add(this, {
                Type: historyitem_AbstractNum_LvlChange,
                Index: Index,
                Old: Lvl_old,
                New: Lvl_new
            });
        }
    },
    Create_Default_Bullet: function () {
        for (var Index = 0; Index < 9; Index++) {
            var Lvl_old = this.Internal_CopyLvl(this.Lvl[Index]);
            this.Lvl[Index] = {};
            var Lvl = this.Lvl[Index];
            Lvl.Start = 1;
            Lvl.Restart = -1;
            Lvl.Suff = numbering_suff_Tab;
            var Left = 36 * (Index + 1) * g_dKoef_pt_to_mm;
            var FirstLine = -18 * g_dKoef_pt_to_mm;
            Lvl.Jc = align_Left;
            Lvl.Format = numbering_numfmt_Bullet;
            Lvl.LvlText = [];
            Lvl.ParaPr = new CParaPr();
            Lvl.ParaPr.Ind.Left = Left;
            Lvl.ParaPr.Ind.FirstLine = FirstLine;
            var TextPr = new CTextPr();
            if (0 == Index % 3) {
                TextPr.RFonts.Set_All("Symbol", -1);
                Lvl.LvlText.push(new CLvlText_Text(String.fromCharCode(183)));
            } else {
                if (1 == Index % 3) {
                    TextPr.RFonts.Set_All("Courier New", -1);
                    Lvl.LvlText.push(new CLvlText_Text("o"));
                } else {
                    TextPr.RFonts.Set_All("Wingdings", -1);
                    Lvl.LvlText.push(new CLvlText_Text(String.fromCharCode(167)));
                }
            }
            Lvl.TextPr = TextPr;
            var Lvl_new = this.Internal_CopyLvl(Lvl);
            History.Add(this, {
                Type: historyitem_AbstractNum_LvlChange,
                Index: Index,
                Old: Lvl_old,
                New: Lvl_new
            });
        }
    },
    Set_Lvl_Bullet: function (iLvl, LvlText, TextPr) {
        if ("number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9) {
            return;
        }
        var Lvl = this.Lvl[iLvl];
        var Lvl_old = this.Internal_CopyLvl(Lvl);
        Lvl.Format = numbering_numfmt_Bullet;
        Lvl.LvlText = [];
        Lvl.LvlText.push(new CLvlText_Text(LvlText));
        Lvl.TextPr = TextPr;
        var Lvl_new = this.Internal_CopyLvl(Lvl);
        History.Add(this, {
            Type: historyitem_AbstractNum_LvlChange,
            Index: iLvl,
            Old: Lvl_old,
            New: Lvl_new
        });
    },
    Set_Lvl_Numbered_1: function (iLvl) {
        if ("number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9) {
            return;
        }
        var Lvl = this.Lvl[iLvl];
        var Lvl_old = this.Internal_CopyLvl(Lvl);
        Lvl.Jc = align_Right;
        Lvl.Format = numbering_numfmt_Decimal;
        Lvl.LvlText = [];
        Lvl.LvlText.push(new CLvlText_Num(iLvl));
        Lvl.LvlText.push(new CLvlText_Text(")"));
        var Lvl_new = this.Internal_CopyLvl(Lvl);
        History.Add(this, {
            Type: historyitem_AbstractNum_LvlChange,
            Index: iLvl,
            Old: Lvl_old,
            New: Lvl_new
        });
    },
    Set_Lvl_Numbered_2: function (iLvl) {
        if ("number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9) {
            return;
        }
        var Lvl = this.Lvl[iLvl];
        var Lvl_old = this.Internal_CopyLvl(Lvl);
        Lvl.Jc = align_Right;
        Lvl.Format = numbering_numfmt_Decimal;
        Lvl.LvlText = [];
        Lvl.LvlText.push(new CLvlText_Num(iLvl));
        Lvl.LvlText.push(new CLvlText_Text("."));
        var Lvl_new = this.Internal_CopyLvl(Lvl);
        History.Add(this, {
            Type: historyitem_AbstractNum_LvlChange,
            Index: iLvl,
            Old: Lvl_old,
            New: Lvl_new
        });
    },
    Set_Lvl_Numbered_3: function (iLvl) {
        if ("number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9) {
            return;
        }
        var Lvl = this.Lvl[iLvl];
        var Lvl_old = this.Internal_CopyLvl(Lvl);
        Lvl.Jc = align_Left;
        Lvl.Format = numbering_numfmt_Decimal;
        Lvl.LvlText = [];
        Lvl.LvlText.push(new CLvlText_Num(iLvl));
        Lvl.LvlText.push(new CLvlText_Text("."));
        var Lvl_new = this.Internal_CopyLvl(Lvl);
        History.Add(this, {
            Type: historyitem_AbstractNum_LvlChange,
            Index: iLvl,
            Old: Lvl_old,
            New: Lvl_new
        });
    },
    Set_Lvl_Numbered_4: function (iLvl) {
        if ("number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9) {
            return;
        }
        var Lvl = this.Lvl[iLvl];
        var Lvl_old = this.Internal_CopyLvl(Lvl);
        Lvl.Jc = align_Left;
        Lvl.Format = numbering_numfmt_Decimal;
        Lvl.LvlText = [];
        Lvl.LvlText.push(new CLvlText_Num(iLvl));
        Lvl.LvlText.push(new CLvlText_Text(")"));
        var Lvl_new = this.Internal_CopyLvl(Lvl);
        History.Add(this, {
            Type: historyitem_AbstractNum_LvlChange,
            Index: iLvl,
            Old: Lvl_old,
            New: Lvl_new
        });
    },
    Set_Lvl_Numbered_5: function (iLvl) {
        if ("number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9) {
            return;
        }
        var Lvl = this.Lvl[iLvl];
        var Lvl_old = this.Internal_CopyLvl(Lvl);
        Lvl.Jc = align_Right;
        Lvl.Format = numbering_numfmt_UpperRoman;
        Lvl.LvlText = [];
        Lvl.LvlText.push(new CLvlText_Num(iLvl));
        Lvl.LvlText.push(new CLvlText_Text("."));
        var Lvl_new = this.Internal_CopyLvl(Lvl);
        History.Add(this, {
            Type: historyitem_AbstractNum_LvlChange,
            Index: iLvl,
            Old: Lvl_old,
            New: Lvl_new
        });
    },
    Set_Lvl_Numbered_6: function (iLvl) {
        if ("number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9) {
            return;
        }
        var Lvl = this.Lvl[iLvl];
        var Lvl_old = this.Internal_CopyLvl(Lvl);
        Lvl.Jc = align_Left;
        Lvl.Format = numbering_numfmt_UpperLetter;
        Lvl.LvlText = [];
        Lvl.LvlText.push(new CLvlText_Num(iLvl));
        Lvl.LvlText.push(new CLvlText_Text("."));
        var Lvl_new = this.Internal_CopyLvl(Lvl);
        History.Add(this, {
            Type: historyitem_AbstractNum_LvlChange,
            Index: iLvl,
            Old: Lvl_old,
            New: Lvl_new
        });
    },
    Set_Lvl_Numbered_7: function (iLvl) {
        if ("number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9) {
            return;
        }
        var Lvl = this.Lvl[iLvl];
        var Lvl_old = this.Internal_CopyLvl(Lvl);
        Lvl.Jc = align_Left;
        Lvl.Format = numbering_numfmt_LowerLetter;
        Lvl.LvlText = [];
        Lvl.LvlText.push(new CLvlText_Num(iLvl));
        Lvl.LvlText.push(new CLvlText_Text(")"));
        var Lvl_new = this.Internal_CopyLvl(Lvl);
        History.Add(this, {
            Type: historyitem_AbstractNum_LvlChange,
            Index: iLvl,
            Old: Lvl_old,
            New: Lvl_new
        });
    },
    Set_Lvl_Numbered_8: function (iLvl) {
        if ("number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9) {
            return;
        }
        var Lvl = this.Lvl[iLvl];
        var Lvl_old = this.Internal_CopyLvl(Lvl);
        Lvl.Jc = align_Left;
        Lvl.Format = numbering_numfmt_LowerLetter;
        Lvl.LvlText = [];
        Lvl.LvlText.push(new CLvlText_Num(iLvl));
        Lvl.LvlText.push(new CLvlText_Text("."));
        var Lvl_new = this.Internal_CopyLvl(Lvl);
        History.Add(this, {
            Type: historyitem_AbstractNum_LvlChange,
            Index: iLvl,
            Old: Lvl_old,
            New: Lvl_new
        });
    },
    Set_Lvl_Numbered_9: function (iLvl) {
        if ("number" != typeof(iLvl) || iLvl < 0 || iLvl >= 9) {
            return;
        }
        var Lvl = this.Lvl[iLvl];
        var Lvl_old = this.Internal_CopyLvl(Lvl);
        Lvl.Jc = align_Right;
        Lvl.Format = numbering_numfmt_LowerRoman;
        Lvl.LvlText = [];
        Lvl.LvlText.push(new CLvlText_Num(iLvl));
        Lvl.LvlText.push(new CLvlText_Text("."));
        var Lvl_new = this.Internal_CopyLvl(Lvl);
        History.Add(this, {
            Type: historyitem_AbstractNum_LvlChange,
            Index: iLvl,
            Old: Lvl_old,
            New: Lvl_new
        });
    },
    Draw: function (X, Y, Context, Lvl, NumInfo, NumTextPr, Theme) {
        var Text = this.Lvl[Lvl].LvlText;
        Context.SetTextPr(NumTextPr, Theme);
        Context.SetFontSlot(fontslot_ASCII);
        g_oTextMeasurer.SetTextPr(NumTextPr, Theme);
        g_oTextMeasurer.SetFontSlot(fontslot_ASCII);
        for (var Index = 0; Index < Text.length; Index++) {
            switch (Text[Index].Type) {
            case numbering_lvltext_Text:
                var Hint = NumTextPr.RFonts.Hint;
                var bCS = NumTextPr.CS;
                var bRTL = NumTextPr.RTL;
                var lcid = NumTextPr.Lang.EastAsia;
                var FontSlot = g_font_detector.Get_FontClass(Text[Index].Value.charCodeAt(0), Hint, lcid, bCS, bRTL);
                Context.SetFontSlot(FontSlot);
                g_oTextMeasurer.SetFontSlot(FontSlot);
                Context.FillText(X, Y, Text[Index].Value);
                X += g_oTextMeasurer.Measure(Text[Index].Value).Width;
                break;
            case numbering_lvltext_Num:
                Context.SetFontSlot(fontslot_ASCII);
                g_oTextMeasurer.SetFontSlot(fontslot_ASCII);
                var CurLvl = Text[Index].Value;
                switch (this.Lvl[CurLvl].Format) {
                case numbering_numfmt_Bullet:
                    break;
                case numbering_numfmt_Decimal:
                    if (CurLvl < NumInfo.length) {
                        var T = "" + (this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl]);
                        for (var Index2 = 0; Index2 < T.length; Index2++) {
                            var Char = T.charAt(Index2);
                            Context.FillText(X, Y, Char);
                            X += g_oTextMeasurer.Measure(Char).Width;
                        }
                    }
                    break;
                case numbering_numfmt_DecimalZero:
                    if (CurLvl < NumInfo.length) {
                        var T = "" + (this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl]);
                        if (1 === T.length) {
                            Context.FillText(X, Y, "0");
                            X += g_oTextMeasurer.Measure("0").Width;
                            var Char = T.charAt(0);
                            Context.FillText(X, Y, Char);
                            X += g_oTextMeasurer.Measure(Char).Width;
                        } else {
                            for (var Index2 = 0; Index2 < T.length; Index2++) {
                                var Char = T.charAt(Index2);
                                Context.FillText(X, Y, Char);
                                X += g_oTextMeasurer.Measure(Char).Width;
                            }
                        }
                    }
                    break;
                case numbering_numfmt_LowerLetter:
                    case numbering_numfmt_UpperLetter:
                    if (CurLvl < NumInfo.length) {
                        var Num = this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] - 1;
                        var Count = (Num - Num % 26) / 26;
                        var Ost = Num % 26;
                        var T = "";
                        var Letter;
                        if (numbering_numfmt_LowerLetter === this.Lvl[CurLvl].Format) {
                            Letter = String.fromCharCode(Ost + 97);
                        } else {
                            Letter = String.fromCharCode(Ost + 65);
                        }
                        for (var Index2 = 0; Index2 < Count + 1; Index2++) {
                            T += Letter;
                        }
                        for (var Index2 = 0; Index2 < T.length; Index2++) {
                            var Char = T.charAt(Index2);
                            Context.FillText(X, Y, Char);
                            X += g_oTextMeasurer.Measure(Char).Width;
                        }
                    }
                    break;
                case numbering_numfmt_LowerRoman:
                    case numbering_numfmt_UpperRoman:
                    if (CurLvl < NumInfo.length) {
                        var Num = this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl];
                        var Rims;
                        if (numbering_numfmt_LowerRoman === this.Lvl[CurLvl].Format) {
                            Rims = ["m", "cm", "d", "cd", "c", "xc", "l", "xl", "x", "ix", "v", "iv", "i", " "];
                        } else {
                            Rims = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I", " "];
                        }
                        var Vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1, 0];
                        var T = "";
                        var Index2 = 0;
                        while (Num > 0) {
                            while (Vals[Index2] <= Num) {
                                T += Rims[Index2];
                                Num -= Vals[Index2];
                            }
                            Index2++;
                            if (Index2 >= Rims.length) {
                                break;
                            }
                        }
                        for (var Index2 = 0; Index2 < T.length; Index2++) {
                            var Char = T.charAt(Index2);
                            Context.FillText(X, Y, Char);
                            X += g_oTextMeasurer.Measure(T.charAt(Index2)).Width;
                        }
                    }
                    break;
                }
                break;
            }
        }
    },
    Measure: function (Context, Lvl, NumInfo, NumTextPr, Theme) {
        var X = 0;
        var Text = this.Lvl[Lvl].LvlText;
        Context.SetTextPr(NumTextPr, Theme);
        Context.SetFontSlot(fontslot_ASCII);
        var Ascent = Context.GetAscender();
        for (var Index = 0; Index < Text.length; Index++) {
            switch (Text[Index].Type) {
            case numbering_lvltext_Text:
                var Hint = NumTextPr.RFonts.Hint;
                var bCS = NumTextPr.CS;
                var bRTL = NumTextPr.RTL;
                var lcid = NumTextPr.Lang.EastAsia;
                var FontSlot = g_font_detector.Get_FontClass(Text[Index].Value.charCodeAt(0), Hint, lcid, bCS, bRTL);
                Context.SetFontSlot(FontSlot);
                X += Context.Measure(Text[Index].Value).Width;
                break;
            case numbering_lvltext_Num:
                Context.SetFontSlot(fontslot_ASCII);
                var CurLvl = Text[Index].Value;
                switch (this.Lvl[CurLvl].Format) {
                case numbering_numfmt_Bullet:
                    break;
                case numbering_numfmt_Decimal:
                    if (CurLvl < NumInfo.length) {
                        var T = "" + (this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl]);
                        for (var Index2 = 0; Index2 < T.length; Index2++) {
                            var Char = T.charAt(Index2);
                            X += Context.Measure(Char).Width;
                        }
                    }
                    break;
                case numbering_numfmt_DecimalZero:
                    if (CurLvl < NumInfo.length) {
                        var T = "" + (this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl]);
                        if (1 === T.length) {
                            X += Context.Measure("0").Width;
                            var Char = T.charAt(0);
                            X += Context.Measure(Char).Width;
                        } else {
                            for (var Index2 = 0; Index2 < T.length; Index2++) {
                                var Char = T.charAt(Index2);
                                X += Context.Measure(Char).Width;
                            }
                        }
                    }
                    break;
                case numbering_numfmt_LowerLetter:
                    case numbering_numfmt_UpperLetter:
                    if (CurLvl < NumInfo.length) {
                        var Num = this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] - 1;
                        var Count = (Num - Num % 26) / 26;
                        var Ost = Num % 26;
                        var T = "";
                        var Letter;
                        if (numbering_numfmt_LowerLetter === this.Lvl[CurLvl].Format) {
                            Letter = String.fromCharCode(Ost + 97);
                        } else {
                            Letter = String.fromCharCode(Ost + 65);
                        }
                        for (var Index2 = 0; Index2 < Count + 1; Index2++) {
                            T += Letter;
                        }
                        for (var Index2 = 0; Index2 < T.length; Index2++) {
                            var Char = T.charAt(Index2);
                            X += Context.Measure(Char).Width;
                        }
                    }
                    break;
                case numbering_numfmt_LowerRoman:
                    case numbering_numfmt_UpperRoman:
                    if (CurLvl < NumInfo.length) {
                        var Num = this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl];
                        var Rims;
                        if (numbering_numfmt_LowerRoman === this.Lvl[CurLvl].Format) {
                            Rims = ["m", "cm", "d", "cd", "c", "xc", "l", "xl", "x", "ix", "v", "iv", "i", " "];
                        } else {
                            Rims = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I", " "];
                        }
                        var Vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1, 0];
                        var T = "";
                        var Index2 = 0;
                        while (Num > 0) {
                            while (Vals[Index2] <= Num) {
                                T += Rims[Index2];
                                Num -= Vals[Index2];
                            }
                            Index2++;
                            if (Index2 >= Rims.length) {
                                break;
                            }
                        }
                        for (var Index2 = 0; Index2 < T.length; Index2++) {
                            var Char = T.charAt(Index2);
                            X += Context.Measure(T.charAt(Index2)).Width;
                        }
                    }
                    break;
                }
                break;
            }
        }
        return {
            Width: X,
            Ascent: Ascent
        };
    },
    Document_CreateFontCharMap: function (FontCharMap, Lvl, NumInfo, NumTextPr) {
        FontCharMap.StartFont(NumTextPr.FontFamily.Name, NumTextPr.Bold, NumTextPr.Italic, NumTextPr.FontSize);
        var Text = this.Lvl[Lvl].LvlText;
        for (var Index = 0; Index < Text.length; Index++) {
            switch (Text[Index].Type) {
            case numbering_lvltext_Text:
                FontCharMap.AddChar(Text[Index].Value);
                break;
            case numbering_lvltext_Num:
                var CurLvl = Text[Index].Value;
                switch (this.Lvl[CurLvl].Format) {
                case numbering_numfmt_Bullet:
                    break;
                case numbering_numfmt_Decimal:
                    if (CurLvl < NumInfo.length) {
                        var T = "" + (this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl]);
                        for (var Index2 = 0; Index2 < T.length; Index2++) {
                            var Char = T.charAt(Index2);
                            FontCharMap.AddChar(Char);
                        }
                    }
                    break;
                case numbering_numfmt_DecimalZero:
                    if (CurLvl < NumInfo.length) {
                        var T = "" + (this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl]);
                        if (1 === T.length) {
                            FontCharMap.AddChar("0");
                            var Char = T.charAt(0);
                            FontCharMap.AddChar(Char);
                        } else {
                            for (var Index2 = 0; Index2 < T.length; Index2++) {
                                var Char = T.charAt(Index2);
                                FontCharMap.AddChar(Char);
                            }
                        }
                    }
                    break;
                case numbering_numfmt_LowerLetter:
                    case numbering_numfmt_UpperLetter:
                    if (CurLvl < NumInfo.length) {
                        var Num = this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl] - 1;
                        var Count = (Num - Num % 26) / 26;
                        var Ost = Num % 26;
                        var T = "";
                        var Letter;
                        if (numbering_numfmt_LowerLetter === this.Lvl[CurLvl].Format) {
                            Letter = String.fromCharCode(Ost + 97);
                        } else {
                            Letter = String.fromCharCode(Ost + 65);
                        }
                        for (var Index2 = 0; Index2 < Count + 1; Index2++) {
                            T += Letter;
                        }
                        for (var Index2 = 0; Index2 < T.length; Index2++) {
                            var Char = T.charAt(Index2);
                            FontCharMap.AddChar(Char);
                        }
                    }
                    break;
                case numbering_numfmt_LowerRoman:
                    case numbering_numfmt_UpperRoman:
                    if (CurLvl < NumInfo.length) {
                        var Num = this.Lvl[CurLvl].Start - 1 + NumInfo[CurLvl];
                        var Rims;
                        if (numbering_numfmt_LowerRoman === this.Lvl[CurLvl].Format) {
                            Rims = ["m", "cm", "d", "cd", "c", "xc", "l", "xl", "x", "ix", "v", "iv", "i", " "];
                        } else {
                            Rims = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I", " "];
                        }
                        var Vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1, 0];
                        var T = "";
                        var Index2 = 0;
                        while (Num > 0) {
                            while (Vals[Index2] <= Num) {
                                T += Rims[Index2];
                                Num -= Vals[Index2];
                            }
                            Index2++;
                            if (Index2 >= Rims.length) {
                                break;
                            }
                        }
                        for (var Index2 = 0; Index2 < T.length; Index2++) {
                            var Char = T.charAt(Index2);
                            FontCharMap.AddChar(Char);
                        }
                    }
                    break;
                }
                break;
            }
        }
    },
    Document_Get_AllFontNames: function (AllFonts) {
        var Count = this.Lvl.length;
        for (var Index = 0; Index < Count; Index++) {
            var Lvl = this.Lvl[Index];
            if (undefined != Lvl.TextPr && undefined != Lvl.TextPr.FontFamily) {
                AllFonts[Lvl.TextPr.FontFamily.Name] = true;
            }
        }
    },
    DocumentStatistics: function (Lvl, Stats) {
        var Text = this.Lvl[Lvl].LvlText;
        var bWord = false;
        for (var Index = 0; Index < Text.length; Index++) {
            var bSymbol = false;
            var bSpace = false;
            var bNewWord = false;
            if (numbering_lvltext_Text === Text[Index].Type && (sp_string === Text[Index].Value || nbsp_string === Text[Index].Value)) {
                bWord = false;
                bSymbol = true;
                bSpace = true;
            } else {
                if (false === bWord) {
                    bNewWord = true;
                }
                bWord = true;
                bSymbol = true;
                bSpace = false;
            }
            if (true === bSymbol) {
                Stats.Add_Symbol(bSpace);
            }
            if (true === bNewWord) {
                Stats.Add_Word();
            }
        }
        if (numbering_suff_Tab === this.Lvl[Lvl].Suff || numbering_suff_Space === this.Lvl[Lvl].Suff) {
            Stats.Add_Symbol(true);
        }
    },
    Apply_TextPr: function (Lvl, TextPr) {
        var CurTextPr = this.Lvl[Lvl].TextPr;
        var TextPr_old = CurTextPr.Copy();
        CurTextPr.Merge(TextPr);
        var TextPr_new = CurTextPr.Copy();
        History.Add(this, {
            Type: historyitem_AbstractNum_TextPrChange,
            Index: Lvl,
            Old: TextPr_old,
            New: TextPr_new
        });
    },
    Internal_CopyLvl: function (Lvl) {
        var Lvl_new = {};
        Lvl_new.Start = Lvl.Start;
        Lvl_new.Restart = Lvl.Restart;
        Lvl_new.Suff = Lvl.Suff;
        Lvl_new.Jc = Lvl.Jc;
        Lvl_new.Format = Lvl.Format;
        Lvl_new.LvlText = [];
        for (var Index = 0; Index < Lvl.LvlText.length; Index++) {
            var Item = Lvl.LvlText[Index];
            Lvl_new.LvlText.push(Item.Copy());
        }
        Lvl_new.TextPr = Lvl.TextPr.Copy();
        Lvl_new.ParaPr = Lvl.ParaPr.Copy();
        return Lvl_new;
    },
    Internal_SetLvl: function (iLvl, Lvl_new) {
        var Lvl = this.Lvl[iLvl];
        Lvl.Jc = Lvl_new.Jc;
        Lvl.Format = Lvl_new.Format;
        Lvl.LvlText = Lvl_new.LvlText;
        Lvl.TextPr = Lvl_new.TextPr;
        Lvl.ParaPr = Lvl_new.ParaPr;
    },
    Write_Lvl_ToBinary: function (Lvl, Writer) {
        Writer.WriteLong(Lvl.Jc);
        Writer.WriteLong(Lvl.Format);
        Lvl.TextPr.Write_ToBinary(Writer);
        Lvl.ParaPr.Write_ToBinary(Writer);
        var Count = Lvl.LvlText.length;
        Writer.WriteLong(Count);
        for (var Index = 0; Index < Count; Index++) {
            Lvl.LvlText[Index].Write_ToBinary(Writer);
        }
    },
    Read_Lvl_FromBinary: function (Lvl, Reader) {
        Lvl.Jc = Reader.GetLong();
        Lvl.Format = Reader.GetLong();
        Lvl.TextPr = new CTextPr();
        Lvl.ParaPr = new CParaPr();
        Lvl.TextPr.Read_FromBinary(Reader);
        Lvl.ParaPr.Read_FromBinary(Reader);
        var Count = Reader.GetLong();
        Lvl.LvlText = [];
        for (var Index = 0; Index < Count; Index++) {
            var Element = LvlText_Read_FromBinary(Reader);
            Lvl.LvlText.push(Element);
        }
    },
    Undo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_AbstractNum_LvlChange:
            this.Internal_SetLvl(Data.Index, Data.Old);
            this.Recalc_CompiledPr(Data.Index);
            break;
        case historyitem_AbstractNum_TextPrChange:
            this.Lvl[Data.Index].TextPr = Data.Old;
            this.Recalc_CompiledPr(Data.Index);
            break;
        }
    },
    Redo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_AbstractNum_LvlChange:
            this.Internal_SetLvl(Data.Index, Data.New);
            this.Recalc_CompiledPr(Data.Index);
            break;
        case historyitem_AbstractNum_TextPrChange:
            this.Lvl[Data.Index].TextPr = Data.New;
            this.Recalc_CompiledPr(Data.Index);
            break;
        }
    },
    Refresh_RecalcData: function (Data) {
        var NumPr = new CNumPr();
        NumPr.NumId = this.Id;
        NumPr.Lvl = Data.Index;
        var LogicDocument = editor.WordControl.m_oLogicDocument;
        var AllParagraphs = LogicDocument.Get_AllParagraphs_ByNumbering(NumPr);
        var Count = AllParagraphs.length;
        for (var Index = 0; Index < Count; Index++) {
            var Para = AllParagraphs[Index];
            Para.Refresh_RecalcData({
                Type: historyitem_Paragraph_Numbering
            });
        }
    },
    Save_Changes: function (Data, Writer) {
        Writer.WriteLong(historyitem_type_AbstractNum);
        var Type = Data.Type;
        Writer.WriteLong(Type);
        switch (Type) {
        case historyitem_AbstractNum_LvlChange:
            Writer.WriteLong(Data.Index);
            this.Write_Lvl_ToBinary(Data.New, Writer);
            break;
        case historyitem_AbstractNum_TextPrChange:
            Writer.WriteLong(Data.Index);
            Data.New.Write_ToBinary(Writer);
            break;
        }
        return Writer;
    },
    Save_Changes2: function (Data, Writer) {
        return false;
    },
    Load_Changes: function (Reader, Reader2) {
        var ClassType = Reader.GetLong();
        if (historyitem_type_AbstractNum != ClassType) {
            return;
        }
        var Type = Reader.GetLong();
        var iLvl = 0;
        switch (Type) {
        case historyitem_AbstractNum_LvlChange:
            iLvl = Reader.GetLong();
            this.Read_Lvl_FromBinary(this.Lvl[iLvl], Reader);
            break;
        case historyitem_AbstractNum_TextPrChange:
            iLvl = Reader.GetLong();
            this.Lvl[iLvl].TextPr = new CTextPr();
            this.Lvl[iLvl].TextPr.Read_FromBinary(Reader);
            break;
        }
        CollaborativeEditing.Add_EndActions(this, {
            iLvl: iLvl
        });
    },
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(historyitem_type_AbstractNum);
        Writer.WriteString2(this.Id);
        for (var Index = 0; Index < 9; Index++) {
            this.Write_Lvl_ToBinary(this.Lvl[Index], Writer);
        }
    },
    Read_FromBinary2: function (Reader) {
        this.Id = Reader.GetString2();
        for (var Index = 0; Index < 9; Index++) {
            this.Read_Lvl_FromBinary(this.Lvl[Index], Reader);
        }
        var Numbering = editor.WordControl.m_oLogicDocument.Get_Numbering();
        Numbering.AbstractNum[this.Id] = this;
    },
    Load_LinkData: function (LinkData) {},
    Process_EndLoad: function (Data) {
        var iLvl = Data.iLvl;
        if (undefined !== iLvl) {
            this.Recalc_CompiledPr(iLvl);
        }
    },
    Recalc_CompiledPr: function (iLvl) {
        var NumPr = new CNumPr();
        NumPr.NumId = this.Id;
        NumPr.Lvl = iLvl;
        var LogicDocument = editor.WordControl.m_oLogicDocument;
        var AllParagraphs = LogicDocument.Get_AllParagraphs_ByNumbering(NumPr);
        var Count = AllParagraphs.length;
        for (var Index = 0; Index < Count; Index++) {
            var Para = AllParagraphs[Index];
            Para.Recalc_CompiledPr();
        }
    },
    isEqual: function (abstractNum) {
        var lvlUsuallyAdd = this.Lvl;
        var lvlNew = abstractNum.Lvl;
        for (var lvl = 0; lvl < lvlUsuallyAdd.length; lvl++) {
            var LvlTextEqual;
            var ParaPrEqual;
            var TextPrEqual;
            if (lvlUsuallyAdd[lvl].Format == lvlNew[lvl].Format && lvlUsuallyAdd[lvl].Jc == lvlNew[lvl].Jc && lvlUsuallyAdd[lvl].PStyle == lvlNew[lvl].PStyle && lvlUsuallyAdd[lvl].Restart == lvlNew[lvl].Restart && lvlUsuallyAdd[lvl].Start == lvlNew[lvl].Start && lvlUsuallyAdd[lvl].Suff == lvlNew[lvl].Suff) {
                LvlTextEqual = this._isEqualLvlText(lvlUsuallyAdd[lvl].LvlText, lvlNew[lvl].LvlText);
                ParaPrEqual = lvlUsuallyAdd[lvl].ParaPr.isEqual(lvlUsuallyAdd[lvl].ParaPr, lvlNew[lvl].ParaPr);
                TextPrEqual = lvlUsuallyAdd[lvl].TextPr.isEqual(lvlUsuallyAdd[lvl].TextPr, lvlNew[lvl].TextPr);
            }
            if (!LvlTextEqual || !ParaPrEqual || !TextPrEqual) {
                return false;
            }
        }
        return true;
    },
    _isEqualLvlText: function (LvlTextOld, LvlTextNew) {
        if (LvlTextOld.length !== LvlTextNew.length) {
            return false;
        }
        for (var LvlText = 0; LvlText < LvlTextOld.length; LvlText++) {
            if (LvlTextOld[LvlText].Type != LvlTextNew[LvlText].Type || LvlTextOld[LvlText].Value != LvlTextNew[LvlText].Value) {
                return false;
            }
        }
        return true;
    }
};
function CNumbering() {
    this.AbstractNum = [];
    this.Num = [];
}
CNumbering.prototype = {
    Create_AbstractNum: function (Type) {
        var AbstractNum = new CAbstractNum(Type);
        var Id = AbstractNum.Get_Id();
        this.AbstractNum[Id] = AbstractNum;
        return Id;
    },
    Add_AbstractNum: function (AbstractNum) {
        var Id = AbstractNum.Get_Id();
        this.AbstractNum[Id] = AbstractNum;
        return Id;
    },
    Get_AbstractNum: function (Id) {
        var AbstractNum = this.AbstractNum[Id];
        if (undefined != AbstractNum && undefined != AbstractNum.NumStyleLink) {
            var Styles = editor.WordControl.m_oLogicDocument.Get_Styles();
            var NumStyle = Styles.Style[AbstractNum.NumStyleLink];
            if (undefined != NumStyle && undefined != NumStyle.ParaPr.NumPr && undefined != NumStyle.ParaPr.NumPr.NumId) {
                return this.Get_AbstractNum(NumStyle.ParaPr.NumPr.NumId);
            }
        }
        return AbstractNum;
    },
    Get_ParaPr: function (NumId, Lvl) {
        var AbstractId = this.Get_AbstractNum(NumId);
        if (undefined != AbstractId) {
            return AbstractId.Lvl[Lvl].ParaPr;
        }
        return new CParaPr();
    },
    Get_Format: function (NumId, Lvl) {
        var AbstractId = this.Get_AbstractNum(NumId);
        if (undefined != AbstractId) {
            return AbstractId.Lvl[Lvl].Format;
        }
        return numbering_numfmt_Bullet;
    },
    Check_Format: function (NumId, Lvl, Type) {
        var Format = this.Get_Format(NumId, Lvl);
        if ((4096 & Format && 4096 & Type) || (8192 & Format && 8192 & Type)) {
            return true;
        }
        return false;
    },
    Draw: function (NumId, Lvl, X, Y, Context, NumInfo, TextPr, Theme) {
        var AbstractId = this.Get_AbstractNum(NumId);
        return AbstractId.Draw(X, Y, Context, Lvl, NumInfo, TextPr, Theme);
    },
    Measure: function (NumId, Lvl, Context, NumInfo, TextPr, Theme) {
        var AbstractId = this.Get_AbstractNum(NumId);
        return AbstractId.Measure(Context, Lvl, NumInfo, TextPr, Theme);
    },
    Document_CreateFontCharMap: function (FontCharMap, NumTextPr, NumPr, NumInfo) {
        var AbstractId = this.Get_AbstractNum(NumPr.NumId);
        AbstractId.Document_CreateFontCharMap(FontCharMap, NumPr.Lvl, NumInfo, NumTextPr);
    },
    Document_Get_AllFontNames: function (AllFonts) {
        for (var Id in this.AbstractNum) {
            var AbstractNum = this.Get_AbstractNum(Id);
            AbstractNum.Document_Get_AllFontNames(AllFonts);
        }
        AllFonts["Symbol"] = true;
        AllFonts["Courier New"] = true;
        AllFonts["Wingdings"] = true;
    }
};
var numbering_presentationnumfrmt_None = 0;
var numbering_presentationnumfrmt_Char = 1;
var numbering_presentationnumfrmt_ArabicPeriod = 100;
var numbering_presentationnumfrmt_ArabicParenR = 101;
var numbering_presentationnumfrmt_RomanUcPeriod = 102;
var numbering_presentationnumfrmt_RomanLcPeriod = 103;
var numbering_presentationnumfrmt_AlphaLcParenR = 104;
var numbering_presentationnumfrmt_AlphaLcPeriod = 105;
var numbering_presentationnumfrmt_AlphaUcParenR = 106;
var numbering_presentationnumfrmt_AlphaUcPeriod = 107;
var g_NumberingArr = [];
g_NumberingArr[0] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[1] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[2] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[3] = numbering_presentationnumfrmt_AlphaUcParenR;
g_NumberingArr[4] = numbering_presentationnumfrmt_AlphaUcParenR;
g_NumberingArr[5] = numbering_presentationnumfrmt_AlphaUcPeriod;
g_NumberingArr[6] = numbering_presentationnumfrmt_ArabicPeriod;
g_NumberingArr[7] = numbering_presentationnumfrmt_ArabicPeriod;
g_NumberingArr[8] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[9] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[10] = numbering_presentationnumfrmt_ArabicParenR;
g_NumberingArr[11] = numbering_presentationnumfrmt_ArabicParenR;
g_NumberingArr[12] = numbering_presentationnumfrmt_ArabicPeriod;
g_NumberingArr[13] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[14] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[15] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[16] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[17] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[18] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[19] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[20] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[21] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[22] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[23] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[24] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[25] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[26] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[27] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[28] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[29] = numbering_presentationnumfrmt_RomanLcPeriod;
g_NumberingArr[30] = numbering_presentationnumfrmt_RomanLcPeriod;
g_NumberingArr[31] = numbering_presentationnumfrmt_RomanLcPeriod;
g_NumberingArr[32] = numbering_presentationnumfrmt_RomanUcPeriod;
g_NumberingArr[33] = numbering_presentationnumfrmt_RomanUcPeriod;
g_NumberingArr[34] = numbering_presentationnumfrmt_RomanUcPeriod;
g_NumberingArr[35] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[36] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[37] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[38] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[39] = numbering_presentationnumfrmt_AlphaLcParenR;
g_NumberingArr[40] = numbering_presentationnumfrmt_AlphaLcPeriod;
function CPresentationBullet() {
    this.m_nType = numbering_presentationnumfrmt_None;
    this.m_nStartAt = null;
    this.m_sChar = null;
    this.m_oColor = {
        r: 0,
        g: 0,
        b: 0
    };
    this.m_bColorTx = true;
    this.m_sFont = "Arial";
    this.m_bFontTx = true;
    this.m_dSize = 1;
    this.m_bSizeTx = false;
    this.m_bSizePct = true;
    this.m_oTextPr = null;
    this.m_nNum = null;
    this.m_sString = null;
    this.Get_Type = function () {
        return this.m_nType;
    };
    this.Get_StartAt = function () {
        return this.m_nStartAt;
    };
    this.Measure = function (Context, FirstTextPr, _Num, Theme) {
        var dFontSize = FirstTextPr.FontSize;
        if (false === this.m_bSizeTx) {
            if (true === this.m_bSizePct) {
                dFontSize *= this.m_dSize;
            } else {
                dFontSize = this.m_dSize;
            }
        }
        var RFonts;
        if (!this.m_bFontTx) {
            RFonts = {
                Ascii: {
                    Name: this.m_sFont,
                    Index: -1
                },
                EastAsia: {
                    Name: this.m_sFont,
                    Index: -1
                },
                CS: {
                    Name: this.m_sFont,
                    Index: -1
                },
                HAnsi: {
                    Name: this.m_sFont,
                    Index: -1
                }
            };
        } else {
            RFonts = FirstTextPr.RFonts;
        }
        var FirstTextPr_ = FirstTextPr.Copy();
        if (FirstTextPr_.Underline) {
            FirstTextPr_.Underline = false;
        }
        var TextPr_ = new CTextPr();
        TextPr_.Set_FromObject({
            RFonts: RFonts,
            FontSize: dFontSize,
            Bold: (this.m_nType >= numbering_presentationnumfrmt_ArabicPeriod ? FirstTextPr.Bold : false),
            Italic: (this.m_nType >= numbering_presentationnumfrmt_ArabicPeriod ? FirstTextPr.Italic : false)
        });
        FirstTextPr_.Merge(TextPr_);
        this.m_oTextPr = FirstTextPr_;
        var Num = _Num + this.m_nStartAt - 1;
        this.m_nNum = Num;
        var X = 0;
        var OldTextPr = Context.GetTextPr();
        var sT = "";
        switch (this.m_nType) {
        case numbering_presentationnumfrmt_Char:
            if (null != this.m_sChar) {
                sT = this.m_sChar;
            }
            break;
        case numbering_presentationnumfrmt_AlphaLcParenR:
            sT = Numbering_Number_To_Alpha(Num, true) + ")";
            break;
        case numbering_presentationnumfrmt_AlphaLcPeriod:
            sT = Numbering_Number_To_Alpha(Num, true) + ".";
            break;
        case numbering_presentationnumfrmt_AlphaUcParenR:
            sT = Numbering_Number_To_Alpha(Num, false) + ")";
            break;
        case numbering_presentationnumfrmt_AlphaUcPeriod:
            sT = Numbering_Number_To_Alpha(Num, false) + ".";
            break;
        case numbering_presentationnumfrmt_ArabicParenR:
            sT += Numbering_Number_To_String(Num) + ")";
            break;
        case numbering_presentationnumfrmt_ArabicPeriod:
            sT += Numbering_Number_To_String(Num) + ".";
            break;
        case numbering_presentationnumfrmt_RomanLcPeriod:
            sT += Numbering_Number_To_Roman(Num, true) + ".";
            break;
        case numbering_presentationnumfrmt_RomanUcPeriod:
            sT += Numbering_Number_To_Roman(Num, false) + ".";
            break;
        }
        this.m_sString = sT;
        var Hint = this.m_oTextPr.RFonts.Hint;
        var bCS = this.m_oTextPr.CS;
        var bRTL = this.m_oTextPr.RTL;
        var lcid = this.m_oTextPr.Lang.EastAsia;
        var FontSlot = g_font_detector.Get_FontClass(sT.charCodeAt(0), Hint, lcid, bCS, bRTL);
        Context.SetTextPr(this.m_oTextPr, Theme);
        Context.SetFontSlot(FontSlot);
        for (var Index2 = 0; Index2 < sT.length; Index2++) {
            var Char = sT.charAt(Index2);
            X += Context.Measure(Char).Width;
        }
        if (OldTextPr) {
            Context.SetTextPr(OldTextPr, Theme);
        }
        return {
            Width: X
        };
    };
    this.Copy = function () {
        var Bullet = new CPresentationBullet();
        Bullet.m_nType = this.m_nType;
        Bullet.m_nStartAt = this.m_nStartAt;
        Bullet.m_sChar = this.m_sChar;
        Bullet.m_oColor.r = this.m_oColor.r;
        Bullet.m_oColor.g = this.m_oColor.g;
        Bullet.m_oColor.b = this.m_oColor.b;
        Bullet.m_bColorTx = this.m_bColorTx;
        Bullet.m_sFont = this.m_sFont;
        Bullet.m_bFontTx = this.m_bFontTx;
        Bullet.m_dSize = this.m_dSize;
        Bullet.m_bSizeTx = this.m_bSizeTx;
        Bullet.m_bSizePct = this.m_bSizePct;
        return Bullet;
    };
    this.Draw = function (X, Y, Context, FirstTextPr, PDSE) {
        if (null === this.m_oTextPr || null === this.m_nNum) {
            return;
        }
        var oColor = {
            r: this.m_oColor.r,
            g: this.m_oColor.g,
            b: this.m_oColor.b
        };
        if (true === this.m_bColorTx) {
            if (FirstTextPr.Unifill) {
                FirstTextPr.Unifill.check(PDSE.Theme, PDSE.ColorMap);
                var RGBA = FirstTextPr.Unifill.getRGBAColor();
                oColor.r = RGBA.R;
                oColor.g = RGBA.G;
                oColor.b = RGBA.B;
            } else {
                oColor.r = FirstTextPr.Color.r;
                oColor.g = FirstTextPr.Color.g;
                oColor.b = FirstTextPr.Color.b;
            }
        }
        Context.p_color(oColor.r, oColor.g, oColor.b, 255);
        Context.b_color1(oColor.r, oColor.g, oColor.b, 255);
        var OldTextPr = Context.GetTextPr();
        var OldTextPr2 = g_oTextMeasurer.GetTextPr();
        var Hint = this.m_oTextPr.RFonts.Hint;
        var bCS = this.m_oTextPr.CS;
        var bRTL = this.m_oTextPr.RTL;
        var lcid = this.m_oTextPr.Lang.EastAsia;
        var sT = this.m_sString;
        var FontSlot = g_font_detector.Get_FontClass(sT.charCodeAt(0), Hint, lcid, bCS, bRTL);
        Context.SetTextPr(this.m_oTextPr, PDSE.Theme);
        Context.SetFontSlot(FontSlot);
        g_oTextMeasurer.SetTextPr(this.m_oTextPr, PDSE.Theme);
        g_oTextMeasurer.SetFontSlot(FontSlot);
        for (var Index2 = 0; Index2 < sT.length; Index2++) {
            var Char = sT.charAt(Index2);
            Context.FillText(X, Y, Char);
            X += g_oTextMeasurer.Measure(Char).Width;
        }
        if (OldTextPr) {
            Context.SetTextPr(OldTextPr, PDSE.Theme);
        }
        if (OldTextPr2) {
            g_oTextMeasurer.SetTextPr(OldTextPr2, PDSE.Theme);
        }
    };
    this.Write_ToBinary = function (Writer) {
        Writer.WriteLong(this.m_nType);
        Writer.WriteLong((null != this.m_nStartAt ? this.m_nStartAt : -1));
        Writer.WriteString2((null != this.m_sChar ? this.m_sChar : ""));
        Writer.WriteByte(this.m_oColor.r);
        Writer.WriteByte(this.m_oColor.g);
        Writer.WriteByte(this.m_oColor.b);
        Writer.WriteBool(this.m_bColorTx);
        Writer.WriteString2(this.m_sFont);
        Writer.WriteBool(this.m_bFontTx);
        Writer.WriteDouble(this.m_dSize);
        Writer.WriteBool(this.m_bSizeTx);
        Writer.WriteBool(this.m_bSizePct);
    };
    this.Read_FromBinary = function (Reader) {
        this.m_nType = Reader.GetLong();
        this.m_nStartAt = Reader.GetLong();
        if (-1 === this.m_nStartAt) {
            this.m_nStartAt = null;
        }
        this.m_sChar = Reader.GetString2();
        if ("" === this.m_sChar) {
            this.m_sChar = null;
        }
        this.m_oColor.r = Reader.GetByte();
        this.m_oColor.g = Reader.GetByte();
        this.m_oColor.b = Reader.GetByte();
        this.m_bColorTx = Reader.GetBool();
        this.m_sFont = Reader.GetString2();
        this.m_bFontTx = Reader.GetBool();
        this.m_dSize = Reader.GetDouble();
        this.m_bSizeTx = Reader.GetBool();
        this.m_bSizePct = Reader.GetBool();
    };
}