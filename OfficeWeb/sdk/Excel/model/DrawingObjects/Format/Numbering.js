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
        CollaborativeEditing.Add_Unlock2(this);
    }
    this.Lvl = new Array();
    for (var Index = 0; Index < 9; Index++) {
        this.Lvl[Index] = new Object();
        var Lvl = this.Lvl[Index];
        Lvl.PStyle = undefined;
        Lvl.Start = 1;
        Lvl.Restart = -1;
        Lvl.Suff = numbering_suff_Tab;
        var Left = 36 * (Index + 1) * g_dKoef_pt_to_mm;
        var FirstLine = -18 * g_dKoef_pt_to_mm;
        Lvl.Jc = align_Left;
        Lvl.Format = numbering_numfmt_Bullet;
        Lvl.LvlText = new Array();
        Lvl.ParaPr = new CParaPr();
        Lvl.ParaPr.Ind.Left = Left;
        Lvl.ParaPr.Ind.FirstLine = FirstLine;
        var TextPr = new CTextPr();
        if (0 == Index % 3) {
            TextPr.FontFamily = {
                Name: "Symbol",
                Index: -1
            };
            Lvl.LvlText.push(new CLvlText_Text(String.fromCharCode(183)));
        } else {
            if (1 == Index % 3) {
                TextPr.FontFamily = {
                    Name: "Courier New",
                    Index: -1
                };
                Lvl.LvlText.push(new CLvlText_Text("o"));
            } else {
                TextPr.FontFamily = {
                    Name: "Wingdings",
                    Index: -1
                };
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
    Create_Default_Numbered: function () {
        for (var Index = 0; Index < 9; Index++) {
            var Lvl_old = this.Internal_CopyLvl(this.Lvl[Index]);
            this.Lvl[Index] = new Object();
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
            Lvl.LvlText = new Array();
            Lvl.LvlText.push(new CLvlText_Num(Index));
            Lvl.LvlText.push(new CLvlText_Text("."));
            Lvl.ParaPr = new CParaPr();
            Lvl.ParaPr.Ind.Left = Left;
            Lvl.ParaPr.Ind.FirstLine = FirstLine;
            var TextPr = new CTextPr();
            TextPr.FontFamily = {
                Name: "Times New Roman",
                Index: -1
            };
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
    Create_Default_Multilevel_1: function () {
        for (var Index = 0; Index < 9; Index++) {
            var Lvl_old = this.Internal_CopyLvl(this.Lvl[Index]);
            this.Lvl[Index] = new Object();
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
            Lvl.LvlText = new Array();
            Lvl.LvlText.push(new CLvlText_Num(Index));
            Lvl.LvlText.push(new CLvlText_Text(")"));
            Lvl.ParaPr = new CParaPr();
            Lvl.ParaPr.Ind.Left = Left;
            Lvl.ParaPr.Ind.FirstLine = FirstLine;
            var TextPr = new CTextPr();
            TextPr.FontFamily = {
                Name: "Times New Roman",
                Index: -1
            };
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
            this.Lvl[Index] = new Object();
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
            Lvl.LvlText = new Array();
            for (var Index2 = 0; Index2 <= Index; Index2++) {
                Lvl.LvlText.push(new CLvlText_Num(Index2));
                Lvl.LvlText.push(new CLvlText_Text("."));
            }
            Lvl.ParaPr = new CParaPr();
            Lvl.ParaPr.Ind.Left = Left;
            Lvl.ParaPr.Ind.FirstLine = FirstLine;
            var TextPr = new CTextPr();
            TextPr.FontFamily = {
                Name: "Times New Roman",
                Index: -1
            };
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
            this.Lvl[Index] = new Object();
            var Lvl = this.Lvl[Index];
            Lvl.Start = 1;
            Lvl.Restart = -1;
            Lvl.Suff = numbering_suff_Tab;
            var Left = 18 * (Index + 1) * g_dKoef_pt_to_mm;
            var FirstLine = -18 * g_dKoef_pt_to_mm;
            Lvl.Format = numbering_numfmt_Bullet;
            Lvl.Jc = align_Left;
            if (0 == Index % 3) {
                Lvl.Jc = align_Left;
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
            Lvl.LvlText = new Array();
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
                TextPr.FontFamily = {
                    Name: "Times New Roman",
                    Index: -1
                };
            } else {
                TextPr.FontFamily = {
                    Name: "Wingdings",
                    Index: -1
                };
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
            this.Lvl[Index] = new Object();
            var Lvl = this.Lvl[Index];
            Lvl.Start = 1;
            Lvl.Restart = -1;
            Lvl.Suff = numbering_suff_Tab;
            var Left = 36 * (Index + 1) * g_dKoef_pt_to_mm;
            var FirstLine = -18 * g_dKoef_pt_to_mm;
            Lvl.Jc = align_Left;
            Lvl.Format = numbering_numfmt_Bullet;
            Lvl.LvlText = new Array();
            Lvl.ParaPr = new CParaPr();
            Lvl.ParaPr.Ind.Left = Left;
            Lvl.ParaPr.Ind.FirstLine = FirstLine;
            var TextPr = new CTextPr();
            if (0 == Index % 3) {
                TextPr.FontFamily = {
                    Name: "Symbol",
                    Index: -1
                };
                Lvl.LvlText.push(new CLvlText_Text(String.fromCharCode(183)));
            } else {
                if (1 == Index % 3) {
                    TextPr.FontFamily = {
                        Name: "Courier New",
                        Index: -1
                    };
                    Lvl.LvlText.push(new CLvlText_Text("o"));
                } else {
                    TextPr.FontFamily = {
                        Name: "Wingdings",
                        Index: -1
                    };
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
        Lvl.LvlText = new Array();
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
        Lvl.LvlText = new Array();
        Lvl.LvlText.push(new CLvlText_Num(iLvl));
        Lvl.LvlText.push(new CLvlText_Text(")"));
        Lvl.TextPr.FontFamily = {
            Name: "Times New Roman",
            Index: -1
        };
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
        Lvl.LvlText = new Array();
        Lvl.LvlText.push(new CLvlText_Num(iLvl));
        Lvl.LvlText.push(new CLvlText_Text("."));
        Lvl.TextPr.FontFamily = {
            Name: "Times New Roman",
            Index: -1
        };
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
        Lvl.LvlText = new Array();
        Lvl.LvlText.push(new CLvlText_Num(iLvl));
        Lvl.LvlText.push(new CLvlText_Text("."));
        Lvl.TextPr.FontFamily = {
            Name: "Times New Roman",
            Index: -1
        };
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
        Lvl.LvlText = new Array();
        Lvl.LvlText.push(new CLvlText_Num(iLvl));
        Lvl.LvlText.push(new CLvlText_Text(")"));
        Lvl.TextPr.FontFamily = {
            Name: "Times New Roman",
            Index: -1
        };
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
        Lvl.LvlText = new Array();
        Lvl.LvlText.push(new CLvlText_Num(iLvl));
        Lvl.LvlText.push(new CLvlText_Text("."));
        Lvl.TextPr.FontFamily = {
            Name: "Times New Roman",
            Index: -1
        };
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
        Lvl.LvlText = new Array();
        Lvl.LvlText.push(new CLvlText_Num(iLvl));
        Lvl.LvlText.push(new CLvlText_Text("."));
        Lvl.TextPr.FontFamily = {
            Name: "Times New Roman",
            Index: -1
        };
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
        Lvl.LvlText = new Array();
        Lvl.LvlText.push(new CLvlText_Num(iLvl));
        Lvl.LvlText.push(new CLvlText_Text(")"));
        Lvl.TextPr.FontFamily = {
            Name: "Times New Roman",
            Index: -1
        };
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
        Lvl.LvlText = new Array();
        Lvl.LvlText.push(new CLvlText_Num(iLvl));
        Lvl.LvlText.push(new CLvlText_Text("."));
        Lvl.TextPr.FontFamily = {
            Name: "Times New Roman",
            Index: -1
        };
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
        Lvl.LvlText = new Array();
        Lvl.LvlText.push(new CLvlText_Num(iLvl));
        Lvl.LvlText.push(new CLvlText_Text("."));
        Lvl.TextPr.FontFamily = {
            Name: "Times New Roman",
            Index: -1
        };
        var Lvl_new = this.Internal_CopyLvl(Lvl);
        History.Add(this, {
            Type: historyitem_AbstractNum_LvlChange,
            Index: iLvl,
            Old: Lvl_old,
            New: Lvl_new
        });
    },
    Draw: function (X, Y, Context, Lvl, NumInfo, NumTextPr) {
        var Text = this.Lvl[Lvl].LvlText;
        var OldFont = Context.GetFont();
        var OldFont2 = g_oTextMeasurer.GetFont();
        Context.SetFont(NumTextPr);
        g_oTextMeasurer.SetFont(NumTextPr);
        for (var Index = 0; Index < Text.length; Index++) {
            switch (Text[Index].Type) {
            case numbering_lvltext_Text:
                Context.FillText(X, Y, Text[Index].Value);
                X += g_oTextMeasurer.Measure(Text[Index].Value).Width;
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
        Context.SetFont(OldFont);
        g_oTextMeasurer.SetFont(OldFont2);
    },
    Measure: function (Context, Lvl, NumInfo, NumTextPr) {
        var X = 0;
        var Text = this.Lvl[Lvl].LvlText;
        var OldFont = Context.GetFont();
        Context.SetFont(NumTextPr);
        var Ascent = Context.GetAscender();
        for (var Index = 0; Index < Text.length; Index++) {
            switch (Text[Index].Type) {
            case numbering_lvltext_Text:
                X += Context.Measure(Text[Index].Value).Width;
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
        Context.SetFont(OldFont);
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
        var Lvl_new = new Object();
        Lvl_new.Start = Lvl.Start;
        Lvl_new.Restart = Lvl.Restart;
        Lvl_new.Suff = Lvl.Suff;
        Lvl_new.Jc = Lvl.Jc;
        Lvl_new.Format = Lvl.Format;
        Lvl_new.LvlText = new Array();
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
        Lvl.LvlText = new Array();
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
            break;
        case historyitem_AbstractNum_TextPrChange:
            this.Lvl[Data.Index].TextPr = Data.Old;
            break;
        }
    },
    Redo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_AbstractNum_LvlChange:
            this.Internal_SetLvl(Data.Index, Data.New);
            break;
        case historyitem_AbstractNum_TextPrChange:
            this.Lvl[Data.Index].TextPr = Data.New;
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
    Document_Is_SelectionLocked: function (CheckType) {
        switch (CheckType) {
        case changestype_Paragraph_Content:
            case changestype_Paragraph_Properties:
            this.Lock.Check(this.Get_Id());
            break;
        case changestype_Document_Content:
            case changestype_Document_Content_Add:
            case changestype_Image_Properties:
            case changestype_Remove:
            CollaborativeEditing.Add_CheckLock(true);
            break;
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
        switch (Type) {
        case historyitem_AbstractNum_LvlChange:
            var iLvl = Reader.GetLong();
            this.Read_Lvl_FromBinary(this.Lvl[iLvl], Reader);
            break;
        case historyitem_AbstractNum_TextPrChange:
            var iLvl = Reader.GetLong();
            this.Lvl[iLvl].TextPr = new CTextPr();
            this.Lvl[iLvl].TextPr.Read_FromBinary(Reader);
            break;
        }
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
    Load_LinkData: function (LinkData) {}
};
function CNumbering() {
    this.AbstractNum = new Array();
    this.Num = new Array();
}
CNumbering.prototype = {
    Create_AbstractNum: function (Type) {
        var AbstractNum = new CAbstractNum(Type);
        var Id = AbstractNum.Get_Id();
        this.AbstractNum[Id] = AbstractNum;
        return Id;
    },
    Get_AbstractNum: function (Id) {
        return this.AbstractNum[Id];
    },
    Get_ParaPr: function (NumId, Lvl) {
        var AbstractId = this.AbstractNum[NumId];
        if (undefined != AbstractId) {
            return AbstractId.Lvl[Lvl].ParaPr;
        }
        return new CParaPr();
    },
    Get_Format: function (NumId, Lvl) {
        var AbstractId = this.AbstractNum[NumId];
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
    Draw: function (NumId, Lvl, X, Y, Context, NumInfo, TextPr) {
        var AbstractId = this.AbstractNum[NumId];
        return AbstractId.Draw(X, Y, Context, Lvl, NumInfo, TextPr);
    },
    Measure: function (NumId, Lvl, Context, NumInfo, TextPr) {
        var AbstractId = this.AbstractNum[NumId];
        return AbstractId.Measure(Context, Lvl, NumInfo, TextPr);
    },
    Document_CreateFontCharMap: function (FontCharMap, NumTextPr, NumPr, NumInfo) {
        var AbstractId = this.AbstractNum[NumPr.NumId];
        AbstractId.Document_CreateFontCharMap(FontCharMap, NumPr.Lvl, NumInfo, NumTextPr);
    },
    Document_Get_AllFontNames: function (AllFonts) {
        for (var Id in this.AbstractNum) {
            var AbstractNum = this.AbstractNum[Id];
            AbstractNum.Document_Get_AllFontNames(AllFonts);
        }
        AllFonts["Symbol"] = true;
        AllFonts["Courier New"] = true;
        AllFonts["Wingdings"] = true;
        AllFonts["Times New Roman"] = true;
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
    this.Measure = function (Context, FirstTextPr, _Num) {
        var dFontSize = FirstTextPr.FontSize;
        if (false === this.m_bSizeTx) {
            if (true === this.m_bSizePct) {
                dFontSize *= this.m_dSize;
            } else {
                dFontSize = this.m_dSize;
            }
        }
        var sFontName = (true === this.m_bFontTx ? FirstTextPr.FontFamily.Name : this.m_sFont);
        this.m_oTextPr = {
            FontFamily: {
                Name: sFontName,
                Index: -1
            },
            FontSize: dFontSize,
            Bold: (this.m_nType >= numbering_presentationnumfrmt_ArabicPeriod ? FirstTextPr.Bold : false),
            Italic: (this.m_nType >= numbering_presentationnumfrmt_ArabicPeriod ? FirstTextPr.Italic : false)
        };
        var Num = _Num + this.m_nStartAt - 1;
        this.m_nNum = Num;
        var X = 0;
        var OldFont = Context.GetFont();
        Context.SetFont(this.m_oTextPr);
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
        for (var Index2 = 0; Index2 < sT.length; Index2++) {
            var Char = sT.charAt(Index2);
            X += Context.Measure(Char).Width;
        }
        Context.SetFont(OldFont);
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
    this.Draw = function (X, Y, Context, FirstTextPr) {
        if (null === this.m_oTextPr || null === this.m_nNum) {
            return;
        }
        var oColor = {
            r: this.m_oColor.r,
            g: this.m_oColor.g,
            b: this.m_oColor.b
        };
        if (true === this.m_bColorTx) {
            oColor.r = FirstTextPr.Color.r;
            oColor.g = FirstTextPr.Color.g;
            oColor.b = FirstTextPr.Color.b;
        }
        Context.p_color(oColor.r, oColor.g, oColor.b, 255);
        Context.b_color1(oColor.r, oColor.g, oColor.b, 255);
        var OldFont = Context.GetFont();
        var OldFont2 = g_oTextMeasurer.GetFont();
        Context.SetFont(this.m_oTextPr);
        g_oTextMeasurer.SetFont(this.m_oTextPr);
        var sT = this.m_sString;
        for (var Index2 = 0; Index2 < sT.length; Index2++) {
            var Char = sT.charAt(Index2);
            Context.FillText(X, Y, Char);
            X += g_oTextMeasurer.Measure(Char).Width;
        }
        Context.SetFont(OldFont);
        g_oTextMeasurer.SetFont(OldFont2);
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