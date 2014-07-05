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
 var Default_Tab_Stop = 12.5;
var Default_Heading_Font = "Arial";
var align_Right = 0;
var align_Left = 1;
var align_Center = 2;
var align_Justify = 3;
var vertalign_Baseline = 0;
var vertalign_SuperScript = 1;
var vertalign_SubScript = 2;
var highlight_None = -1;
var shd_Clear = 0;
var shd_Nil = 1;
var vertalign_Koef_Size = 0.65;
var vertalign_Koef_Super = 0.35;
var vertalign_Koef_Sub = -0.141;
var smallcaps_Koef = 0.8;
var g_dKoef_pt_to_mm = 25.4 / 72;
var g_dKoef_pc_to_mm = g_dKoef_pt_to_mm / 12;
var g_dKoef_in_to_mm = 25.4;
var g_dKoef_twips_to_mm = g_dKoef_pt_to_mm / 20;
var g_dKoef_mm_to_pt = 1 / g_dKoef_pt_to_mm;
var g_dKoef_mm_to_twips = 1 / g_dKoef_twips_to_mm;
var tblwidth_Auto = 0;
var tblwidth_Mm = 1;
var tblwidth_Nil = 2;
var tblwidth_Pct = 3;
var tbllayout_Fixed = 0;
var tbllayout_AutoFit = 1;
var border_None = 0;
var border_Single = 1;
var heightrule_AtLeast = 0;
var heightrule_Auto = 1;
var heightrule_Exact = 2;
var vertalignjc_Top = 0;
var vertalignjc_Center = 1;
var vertalignjc_Bottom = 2;
var vmerge_Restart = 1;
var vmerge_Continue = 2;
var spacing_Auto = -1;
var styletype_Paragraph = 1;
var styletype_Numbering = 2;
var styletype_Table = 3;
var styletype_Character = 4;
function CTableStylePr() {
    this.TextPr = new CTextPr();
    this.ParaPr = new CParaPr();
    this.TablePr = new CTablePr();
    this.TableRowPr = new CTableRowPr();
    this.TableCellPr = new CTableCellPr();
}
CTableStylePr.prototype = {
    Merge: function (TableStylePr) {
        this.TextPr.Merge(TableStylePr.TextPr);
        this.ParaPr.Merge(TableStylePr.ParaPr);
        this.TablePr.Merge(TableStylePr.TablePr);
        this.TableRowPr.Merge(TableStylePr.TableRowPr);
        this.TableCellPr.Merge(TableStylePr.TableCellPr);
    },
    Copy: function () {
        var TableStylePr = new CTableStylePr();
        TableStylePr.TextPr = this.TextPr.Copy();
        TableStylePr.ParaPr = this.ParaPr.Copy();
        TableStylePr.TablePr = this.TablePr.Copy();
        TableStylePr.TableRowPr = this.TableRowPr.Copy();
        TableStylePr.TableCellPr = this.TableCellPr.Copy();
        return TableStylePr;
    },
    Set_FromObject: function (Obj) {
        if (undefined != Obj.TextPr) {
            this.TextPr.Set_FromObject(Obj.TextPr);
        }
        if (undefined != Obj.ParaPr) {
            this.ParaPr.Set_FromObject(Obj.ParaPr);
        }
        if (undefined != Obj.TablePr) {
            this.TablePr.Set_FromObject(Obj.TablePr);
        }
        if (undefined != Obj.TableRowPr) {
            this.TableRowPr.Set_FromObject(Obj.TableRowPr);
        }
        if (undefined != Obj.TableCellPr) {
            this.TableCellPr.Set_FromObject(Obj.TableCellPr);
        }
    },
    Write_ToBinary: function (Writer) {
        this.TextPr.Write_ToBinary(Writer);
        this.ParaPr.Write_ToBinary(Writer);
        this.TablePr.Write_ToBinary(Writer);
        this.TableRowPr.Write_ToBinary(Writer);
        this.TableCellPr.Write_ToBinary(Writer);
    },
    Read_FromBinary: function (Reader) {
        this.TextPr.Read_FromBinary(Reader);
        this.ParaPr.Read_FromBinary(Reader);
        this.TablePr.Read_FromBinary(Reader);
        this.TableRowPr.Read_FromBinary(Reader);
        this.TableCellPr.Read_FromBinary(Reader);
    }
};
function CStyle(Name, BasedOnId, NextId, type) {
    this.Id = g_oIdCounter.Get_NewId();
    this.Name = Name;
    this.BasedOn = BasedOnId;
    this.Next = NextId;
    if (null != type) {
        this.Type = type;
    } else {
        this.Type = styletype_Paragraph;
    }
    this.qFormat = null;
    this.uiPriority = null;
    this.hidden = null;
    this.semiHidden = null;
    this.unhideWhenUsed = null;
    this.TextPr = new CTextPr();
    this.ParaPr = new CParaPr();
    this.TablePr = new CTablePr();
    this.TableRowPr = new CTableRowPr();
    this.TableCellPr = new CTableCellPr();
    this.TableBand1Horz = new CTableStylePr();
    this.TableBand1Vert = new CTableStylePr();
    this.TableBand2Horz = new CTableStylePr();
    this.TableBand2Vert = new CTableStylePr();
    this.TableFirstCol = new CTableStylePr();
    this.TableFirstRow = new CTableStylePr();
    this.TableLastCol = new CTableStylePr();
    this.TableLastRow = new CTableStylePr();
    this.TableTLCell = new CTableStylePr();
    this.TableTRCell = new CTableStylePr();
    this.TableBLCell = new CTableStylePr();
    this.TableBRCell = new CTableStylePr();
    this.TableWholeTable = new CTableStylePr();
    g_oTableId.Add(this, this.Id);
}
CStyle.prototype = {
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
    Set_TextPr: function (Value) {
        var Old = this.TextPr;
        var New = new CTextPr();
        New.Set_FromObject(Value);
        this.TextPr = New;
        History.Add(this, {
            Type: historyitem_Style_TextPr,
            Old: Old,
            New: New
        });
    },
    Set_ParaPr: function (Value) {
        var Old = this.ParaPr;
        var New = new CParaPr();
        New.Set_FromObject(Value);
        this.ParaPr = New;
        History.Add(this, {
            Type: historyitem_Style_ParaPr,
            Old: Old,
            New: New
        });
    },
    Set_TablePr: function (Value) {
        var Old = this.TablePr;
        var New = new CTablePr();
        New.Set_FromObject(Value);
        this.TablePr = New;
        History.Add(this, {
            Type: historyitem_Style_TablePr,
            Old: Old,
            New: New
        });
    },
    Set_TableRowPr: function (Value) {
        var Old = this.TableRowPr;
        var New = new CTableRowPr();
        New.Set_FromObject(Value);
        this.TableRowPr = New;
        History.Add(this, {
            Type: historyitem_Style_TableRowPr,
            Old: Old,
            New: New
        });
    },
    Set_TableCellPr: function (Value) {
        var Old = this.TableCellPr;
        var New = new CTableCellPr();
        New.Set_FromObject(Value);
        this.TableCellPr = New;
        History.Add(this, {
            Type: historyitem_Style_TableCellPr,
            Old: Old,
            New: New
        });
    },
    Set_TableBand1Horz: function (Value) {
        var Old = this.TableBand1Horz;
        var New = new CTableStylePr();
        New.Set_FromObject(Value);
        this.TableBand1Horz = New;
        History.Add(this, {
            Type: historyitem_Style_TableBand1Horz,
            Old: Old,
            New: New
        });
    },
    Set_TableBand1Vert: function (Value) {
        var Old = this.TableBand1Vert;
        var New = new CTableStylePr();
        New.Set_FromObject(Value);
        this.TableBand1Vert = New;
        History.Add(this, {
            Type: historyitem_Style_TableBand1Vert,
            Old: Old,
            New: New
        });
    },
    Set_TableBand2Horz: function (Value) {
        var Old = this.TableBand2Horz;
        var New = new CTableStylePr();
        New.Set_FromObject(Value);
        this.TableBand2Horz = New;
        History.Add(this, {
            Type: historyitem_Style_TableBand2Horz,
            Old: Old,
            New: New
        });
    },
    Set_TableBand2Vert: function (Value) {
        var Old = this.TableBand2Vert;
        var New = new CTableStylePr();
        New.Set_FromObject(Value);
        this.TableBand2Vert = New;
        History.Add(this, {
            Type: historyitem_Style_TableBand2Vert,
            Old: Old,
            New: New
        });
    },
    Set_TableFirstCol: function (Value) {
        var Old = this.TableFirstCol;
        var New = new CTableStylePr();
        New.Set_FromObject(Value);
        this.TableFirstCol = New;
        History.Add(this, {
            Type: historyitem_Style_TableFirstCol,
            Old: Old,
            New: New
        });
    },
    Set_TableFirstRow: function (Value) {
        var Old = this.TableFirstRow;
        var New = new CTableStylePr();
        New.Set_FromObject(Value);
        this.TableFirstRow = New;
        History.Add(this, {
            Type: historyitem_Style_TableFirstRow,
            Old: Old,
            New: New
        });
    },
    Set_TableLastCol: function (Value) {
        var Old = this.TableLastCol;
        var New = new CTableStylePr();
        New.Set_FromObject(Value);
        this.TableLastCol = New;
        History.Add(this, {
            Type: historyitem_Style_TableLastCol,
            Old: Old,
            New: New
        });
    },
    Set_TableLastRow: function (Value) {
        var Old = this.TableLastRow;
        var New = new CTableStylePr();
        New.Set_FromObject(Value);
        this.TableLastRow = New;
        History.Add(this, {
            Type: historyitem_Style_TableLastRow,
            Old: Old,
            New: New
        });
    },
    Set_TableTLCell: function (Value) {
        var Old = this.TableTLCell;
        var New = new CTableStylePr();
        New.Set_FromObject(Value);
        this.TableTLCell = New;
        History.Add(this, {
            Type: historyitem_Style_TableTLCell,
            Old: Old,
            New: New
        });
    },
    Set_TableTRCell: function (Value) {
        var Old = this.TableTRCell;
        var New = new CTableStylePr();
        New.Set_FromObject(Value);
        this.TableTRCell = New;
        History.Add(this, {
            Type: historyitem_Style_TableTRCell,
            Old: Old,
            New: New
        });
    },
    Set_TableBLCell: function (Value) {
        var Old = this.TableBLCell;
        var New = new CTableStylePr();
        New.Set_FromObject(Value);
        this.TableBLCell = New;
        History.Add(this, {
            Type: historyitem_Style_TableBLCell,
            Old: Old,
            New: New
        });
    },
    Set_TableBRCell: function (Value) {
        var Old = this.TableBRCell;
        var New = new CTableStylePr();
        New.Set_FromObject(Value);
        this.TableBRCell = New;
        History.Add(this, {
            Type: historyitem_Style_TableBRCell,
            Old: Old,
            New: New
        });
    },
    Set_TableWholeTable: function (Value) {
        var Old = this.TableWholeTable;
        var New = new CTableStylePr();
        New.Set_FromObject(Value);
        this.TableWholeTable = New;
        History.Add(this, {
            Type: historyitem_Style_TableWholeTable,
            Old: Old,
            New: New
        });
    },
    Set_Name: function (Value) {
        History.Add(this, {
            Type: historyitem_Style_Name,
            Old: this.Name,
            New: Value
        });
        this.Name = Value;
    },
    Set_BasedOn: function (Value) {
        History.Add(this, {
            Type: historyitem_Style_BasedOn,
            Old: this.BasedOn,
            New: Value
        });
        this.BasedOn = Value;
    },
    Set_Next: function (Value) {
        History.Add(this, {
            Type: historyitem_Style_Next,
            Old: this.Next,
            New: Value
        });
        this.Next = Value;
    },
    Set_Type: function (Value) {
        History.Add(this, {
            Type: historyitem_Style_Type,
            Old: this.Type,
            New: Value
        });
        this.Type = Value;
    },
    Set_QFormat: function (Value) {
        History.Add(this, {
            Type: historyitem_Style_QFormat,
            Old: this.qFormat,
            New: Value
        });
        this.qFormat = Value;
    },
    Set_UiPriority: function (Value) {
        History.Add(this, {
            Type: historyitem_Style_UiPriority,
            Old: this.uiPriority,
            New: Value
        });
        this.uiPriority = Value;
    },
    Set_Hidden: function (Value) {
        History.Add(this, {
            Type: historyitem_Style_Hidden,
            Old: this.hidden,
            New: Value
        });
        this.hidden = Value;
    },
    Set_SemiHidden: function (Value) {
        History.Add(this, {
            Type: historyitem_Style_SemiHidden,
            Old: this.semiHidden,
            New: Value
        });
        this.semiHidden = Value;
    },
    Set_UnhideWhenUsed: function (Value) {
        History.Add(this, {
            Type: historyitem_Style_UnhideWhenUsed,
            Old: this.unhideWhenUsed,
            New: Value
        });
        this.unhideWhenUsed = Value;
    },
    Document_Get_AllFontNames: function (AllFonts) {
        if (undefined != this.TextPr) {
            this.TextPr.Document_Get_AllFontNames(AllFonts);
        }
    },
    Create_Default_Paragraph: function () {
        var TextPr = {
            FontFamily: {
                Name: "Arial",
                Index: -1
            },
            Color: {
                r: 0,
                g: 0,
                b: 0
            }
        };
        this.Set_QFormat(true);
        this.Set_TextPr(TextPr);
    },
    Create_Default_Character: function () {
        this.Set_UiPriority(1);
        this.Set_SemiHidden(true);
        this.Set_UnhideWhenUsed(true);
    },
    Create_Default_Numbering: function () {
        this.Set_UiPriority(99);
        this.Set_SemiHidden(true);
        this.Set_UnhideWhenUsed(true);
    },
    Create_Heading1: function () {
        var ParaPr = {
            KeepNext: true,
            KeepLines: true,
            Spacing: {
                Before: 24 * g_dKoef_pt_to_mm,
                After: 0
            },
            OutlineLvl: 0
        };
        var TextPr = {
            FontSize: 24,
            FontFamily: {
                Name: Default_Heading_Font,
                Index: -1
            },
            Bold: true,
            Color: {
                r: 0,
                g: 0,
                b: 0
            }
        };
        this.Set_QFormat(true);
        this.Set_UiPriority(9);
        this.Set_ParaPr(ParaPr);
        this.Set_TextPr(TextPr);
    },
    Create_Heading2: function () {
        var ParaPr = {
            KeepNext: true,
            KeepLines: true,
            Spacing: {
                Before: 10 * g_dKoef_pt_to_mm,
                After: 0
            },
            OutlineLvl: 1
        };
        var TextPr = {
            FontSize: 20,
            FontFamily: {
                Name: Default_Heading_Font,
                Index: -1
            },
            Bold: true,
            Color: {
                r: 0,
                g: 0,
                b: 0
            }
        };
        this.Set_QFormat(true);
        this.Set_UiPriority(9);
        this.Set_UnhideWhenUsed(true);
        this.Set_TextPr(TextPr);
        this.Set_ParaPr(ParaPr);
    },
    Create_Heading3: function () {
        var ParaPr = {
            KeepNext: true,
            KeepLines: true,
            Spacing: {
                Before: 10 * g_dKoef_pt_to_mm,
                After: 0
            },
            OutlineLvl: 2
        };
        var TextPr = {
            FontSize: 18,
            FontFamily: {
                Name: Default_Heading_Font,
                Index: -1
            },
            Bold: true,
            Italic: true,
            Color: {
                r: 0,
                g: 0,
                b: 0
            }
        };
        this.Set_QFormat(true);
        this.Set_UiPriority(9);
        this.Set_UnhideWhenUsed(true);
        this.Set_TextPr(TextPr);
        this.Set_ParaPr(ParaPr);
    },
    Create_Heading4: function () {
        var ParaPr = {
            KeepNext: true,
            KeepLines: true,
            Spacing: {
                Before: 10 * g_dKoef_pt_to_mm,
                After: 0
            },
            OutlineLvl: 3
        };
        var TextPr = {
            FontSize: 16,
            FontFamily: {
                Name: Default_Heading_Font,
                Index: -1
            },
            Color: {
                r: 35,
                g: 35,
                b: 35
            }
        };
        this.Set_QFormat(true);
        this.Set_UiPriority(9);
        this.Set_UnhideWhenUsed(true);
        this.Set_TextPr(TextPr);
        this.Set_ParaPr(ParaPr);
    },
    Create_Heading5: function () {
        var ParaPr = {
            KeepNext: true,
            KeepLines: true,
            Spacing: {
                Before: 10 * g_dKoef_pt_to_mm,
                After: 0
            },
            OutlineLvl: 4
        };
        var TextPr = {
            FontSize: 14,
            FontFamily: {
                Name: Default_Heading_Font,
                Index: -1
            },
            Bold: true,
            Color: {
                r: 68,
                g: 68,
                b: 68
            }
        };
        this.Set_QFormat(true);
        this.Set_UiPriority(9);
        this.Set_UnhideWhenUsed(true);
        this.Set_TextPr(TextPr);
        this.Set_ParaPr(ParaPr);
    },
    Create_Heading6: function () {
        var ParaPr = {
            KeepNext: true,
            KeepLines: true,
            Spacing: {
                Before: 10 * g_dKoef_pt_to_mm,
                After: 0
            },
            OutlineLvl: 5
        };
        var TextPr = {
            FontSize: 14,
            Italic: true,
            FontFamily: {
                Name: Default_Heading_Font,
                Index: -1
            },
            Color: {
                r: 35,
                g: 35,
                b: 35
            }
        };
        this.Set_QFormat(true);
        this.Set_UiPriority(9);
        this.Set_UnhideWhenUsed(true);
        this.Set_TextPr(TextPr);
        this.Set_ParaPr(ParaPr);
    },
    Create_Heading7: function () {
        var ParaPr = {
            KeepNext: true,
            KeepLines: true,
            Spacing: {
                Before: 10 * g_dKoef_pt_to_mm,
                After: 0
            },
            OutlineLvl: 6
        };
        var TextPr = {
            FontSize: 12,
            FontFamily: {
                Name: Default_Heading_Font,
                Index: -1
            },
            Bold: true,
            Color: {
                r: 96,
                g: 96,
                b: 96
            }
        };
        this.Set_QFormat(true);
        this.Set_UiPriority(9);
        this.Set_UnhideWhenUsed(true);
        this.Set_TextPr(TextPr);
        this.Set_ParaPr(ParaPr);
    },
    Create_Heading8: function () {
        var ParaPr = {
            KeepNext: true,
            KeepLines: true,
            Spacing: {
                Before: 10 * g_dKoef_pt_to_mm,
                After: 0
            },
            OutlineLvl: 7
        };
        var TextPr = {
            FontSize: 12,
            FontFamily: {
                Name: Default_Heading_Font,
                Index: -1
            },
            Color: {
                r: 68,
                g: 68,
                b: 68
            }
        };
        this.Set_QFormat(true);
        this.Set_UiPriority(9);
        this.Set_UnhideWhenUsed(true);
        this.Set_TextPr(TextPr);
        this.Set_ParaPr(ParaPr);
    },
    Create_Heading9: function () {
        var ParaPr = {
            KeepNext: true,
            KeepLines: true,
            Spacing: {
                Before: 10 * g_dKoef_pt_to_mm,
                After: 0
            },
            OutlineLvl: 8
        };
        var TextPr = {
            FontSize: 11.5,
            FontFamily: {
                Name: Default_Heading_Font,
                Index: -1
            },
            Italic: true,
            Color: {
                r: 68,
                g: 68,
                b: 68
            }
        };
        this.Set_QFormat(true);
        this.Set_UiPriority(9);
        this.Set_UnhideWhenUsed(true);
        this.Set_TextPr(TextPr);
        this.Set_ParaPr(ParaPr);
    },
    Create_ListParagraph: function () {
        var ParaPr = {
            Ind: {
                Left: 36 * g_dKoef_pt_to_mm
            },
            ContextualSpacing: true
        };
        this.Set_QFormat(true);
        this.Set_UiPriority(34);
        this.Set_ParaPr(ParaPr);
    },
    Create_NoSpacing: function () {
        this.uiPriority = 1;
        this.qFormat = true;
        var ParaPr = {
            Spacing: {
                Line: 1,
                LineRule: linerule_Auto,
                After: 0
            }
        };
        var TextPr = {
            FontFamily: {
                Name: "Arial",
                Index: -1
            },
            Color: {
                r: 0,
                g: 0,
                b: 0
            }
        };
        this.Set_QFormat(true);
        this.Set_UiPriority(1);
        this.Set_TextPr(TextPr);
        this.Set_ParaPr(ParaPr);
    },
    Create_Header: function () {
        var RPos = Page_Width - X_Left_Margin - X_Right_Margin;
        var CPos = RPos / 2;
        var ParaPr = {
            Spacing: {
                After: 0,
                Line: 1,
                LineRule: linerule_Auto
            },
            Tabs: {
                Tabs: [{
                    Value: tab_Center,
                    Pos: CPos
                },
                {
                    Value: tab_Right,
                    Pos: RPos
                }]
            }
        };
        var TextPr = {
            FontSize: 11,
            FontFamily: {
                Name: "Arial",
                Index: -1
            },
            Color: {
                r: 0,
                g: 0,
                b: 0
            }
        };
        this.Set_UiPriority(99);
        this.Set_UnhideWhenUsed(true);
        this.Set_TextPr(TextPr);
        this.Set_ParaPr(ParaPr);
    },
    Create_Footer: function () {
        var RPos = Page_Width - X_Left_Margin - X_Right_Margin;
        var CPos = RPos / 2;
        var ParaPr = {
            Spacing: {
                After: 0,
                Line: 1,
                LineRule: linerule_Auto
            },
            Tabs: {
                Tabs: [{
                    Value: tab_Center,
                    Pos: CPos
                },
                {
                    Value: tab_Right,
                    Pos: RPos
                }]
            }
        };
        var TextPr = {
            FontSize: 11,
            FontFamily: {
                Name: "Arial",
                Index: -1
            },
            Color: {
                r: 0,
                g: 0,
                b: 0
            }
        };
        this.Set_UiPriority(99);
        this.Set_UnhideWhenUsed(true);
        this.Set_TextPr(TextPr);
        this.Set_ParaPr(ParaPr);
    },
    Create_NormalTable: function () {
        var TablePr = {
            TableInd: {
                W: 0,
                Type: tblwidth_Mm
            },
            TableCellMar: {
                Top: {
                    W: 0,
                    Type: tblwidth_Mm
                },
                Left: {
                    W: 1.9,
                    Type: tblwidth_Mm
                },
                Bottom: {
                    W: 0,
                    Type: tblwidth_Mm
                },
                Right: {
                    W: 1.9,
                    Type: tblwidth_Mm
                }
            }
        };
        this.Set_UiPriority(99);
        this.Set_SemiHidden(true);
        this.Set_UnhideWhenUsed(true);
        this.Set_TablePr(TablePr);
    },
    Create_TableGrid: function () {
        var ParaPr = {
            Spacing: {
                After: 0,
                Line: 1,
                LineRule: linerule_Auto
            }
        };
        var TablePr = {
            TableInd: 0,
            TableBorders: {
                Top: {
                    Color: {
                        r: 0,
                        g: 0,
                        b: 0
                    },
                    Space: 0,
                    Size: 0.5 * g_dKoef_pt_to_mm,
                    Value: border_Single
                },
                Left: {
                    Color: {
                        r: 0,
                        g: 0,
                        b: 0
                    },
                    Space: 0,
                    Size: 0.5 * g_dKoef_pt_to_mm,
                    Value: border_Single
                },
                Bottom: {
                    Color: {
                        r: 0,
                        g: 0,
                        b: 0
                    },
                    Space: 0,
                    Size: 0.5 * g_dKoef_pt_to_mm,
                    Value: border_Single
                },
                Right: {
                    Color: {
                        r: 0,
                        g: 0,
                        b: 0
                    },
                    Space: 0,
                    Size: 0.5 * g_dKoef_pt_to_mm,
                    Value: border_Single
                },
                InsideH: {
                    Color: {
                        r: 0,
                        g: 0,
                        b: 0
                    },
                    Space: 0,
                    Size: 0.5 * g_dKoef_pt_to_mm,
                    Value: border_Single
                },
                InsideV: {
                    Color: {
                        r: 0,
                        g: 0,
                        b: 0
                    },
                    Space: 0,
                    Size: 0.5 * g_dKoef_pt_to_mm,
                    Value: border_Single
                }
            },
            TableCellMar: {
                Top: {
                    W: 0,
                    Type: tblwidth_Mm
                },
                Left: {
                    W: 1.9,
                    Type: tblwidth_Mm
                },
                Bottom: {
                    W: 0,
                    Type: tblwidth_Mm
                },
                Right: {
                    W: 1.9,
                    Type: tblwidth_Mm
                }
            }
        };
        this.Set_UiPriority(59);
        this.Set_TablePr(TablePr);
        this.Set_ParaPr(ParaPr);
    },
    Create_Quote: function () {
        var ParaPr = {
            Ind: {
                Left: 60
            },
            Brd: {
                Bottom: {
                    Color: {
                        r: 166,
                        g: 166,
                        b: 166
                    },
                    Space: 1,
                    Size: 1.5 * g_dKoef_pt_to_mm,
                    Value: border_Single
                },
                Left: {
                    Color: {
                        r: 166,
                        g: 166,
                        b: 166
                    },
                    Space: 4,
                    Size: 1.5 * g_dKoef_pt_to_mm,
                    Value: border_Single
                }
            }
        };
        var TextPr = {
            FontSize: 9,
            FontFamily: {
                Name: "Arial",
                Index: -1
            },
            Italic: true,
            Color: {
                r: 55,
                g: 55,
                b: 55
            }
        };
        this.Set_QFormat(true);
        this.Set_UiPriority(29);
        this.Set_TextPr(TextPr);
        this.Set_ParaPr(ParaPr);
    },
    Create_Subtitle: function () {
        this.uiPriority = 11;
        this.qFormat = true;
        var ParaPr = {
            Spacing: {
                Line: 1,
                LineRule: linerule_Auto
            },
            OutlineLvl: 0
        };
        var TextPr = {
            FontSize: 26,
            FontFamily: {
                Name: "Arial",
                Index: -1
            },
            Italic: true,
            Color: {
                r: 68,
                g: 68,
                b: 68
            }
        };
        this.Set_QFormat(true);
        this.Set_UiPriority(11);
        this.Set_TextPr(TextPr);
        this.Set_ParaPr(ParaPr);
    },
    Create_IntenseQuote: function () {
        var ParaPr = {
            Ind: {
                Left: 10,
                Right: 10
            },
            Shd: {
                Value: shd_Clear,
                Color: {
                    r: 217,
                    g: 217,
                    b: 217
                }
            },
            Brd: {
                Bottom: {
                    Color: {
                        r: 128,
                        g: 128,
                        b: 128
                    },
                    Space: 1,
                    Size: 0.5 * g_dKoef_pt_to_mm,
                    Value: border_Single
                },
                Left: {
                    Color: {
                        r: 128,
                        g: 128,
                        b: 128
                    },
                    Space: 4,
                    Size: 0.5 * g_dKoef_pt_to_mm,
                    Value: border_Single
                },
                Right: {
                    Color: {
                        r: 128,
                        g: 128,
                        b: 128
                    },
                    Space: 4,
                    Size: 0.5 * g_dKoef_pt_to_mm,
                    Value: border_Single
                },
                Top: {
                    Color: {
                        r: 128,
                        g: 128,
                        b: 128
                    },
                    Space: 1,
                    Size: 0.5 * g_dKoef_pt_to_mm,
                    Value: border_Single
                }
            }
        };
        var TextPr = {
            FontSize: 9.5,
            FontFamily: {
                Name: "Arial",
                Index: -1
            },
            Italic: true,
            Color: {
                r: 96,
                g: 96,
                b: 96
            }
        };
        this.Set_QFormat(true);
        this.Set_UiPriority(30);
        this.Set_TextPr(TextPr);
        this.Set_ParaPr(ParaPr);
    },
    Create_Title: function () {
        this.uiPriority = 10;
        this.qFormat = true;
        var ParaPr = {
            Spacing: {
                Line: 1,
                LineRule: linerule_Auto,
                Before: 15 * g_dKoef_pt_to_mm,
                After: 4 * g_dKoef_pt_to_mm
            },
            Brd: {
                Bottom: {
                    Color: {
                        r: 0,
                        g: 0,
                        b: 0
                    },
                    Space: 0,
                    Size: 3 * g_dKoef_pt_to_mm,
                    Value: border_Single
                }
            },
            OutlineLvl: 0
        };
        var TextPr = {
            FontSize: 36,
            FontFamily: {
                Name: "Arial",
                Index: -1
            },
            Bold: true,
            Color: {
                r: 0,
                g: 0,
                b: 0
            }
        };
        this.Set_QFormat(true);
        this.Set_UiPriority(10);
        this.Set_TextPr(TextPr);
        this.Set_ParaPr(ParaPr);
    },
    Create_Table_LightShading: function () {
        this.uiPriority = 60;
        var ParaPr = {
            Spacing: {
                After: 0,
                Line: 1,
                LineRule: linerule_Auto
            }
        };
        var TablePr = {
            TableStyleColBandSize: 1,
            TableStyleRowBandSize: 1,
            TableInd: 0,
            TableBorders: {
                Top: {
                    Color: {
                        r: 0,
                        g: 0,
                        b: 0
                    },
                    Space: 0,
                    Size: 18 / 8 * g_dKoef_pt_to_mm,
                    Value: border_Single
                },
                Bottom: {
                    Color: {
                        r: 0,
                        g: 0,
                        b: 0
                    },
                    Space: 0,
                    Size: 18 / 8 * g_dKoef_pt_to_mm,
                    Value: border_Single
                }
            },
            TableCellMar: {
                Top: {
                    W: 0,
                    Type: tblwidth_Mm
                },
                Left: {
                    W: 5.75 * g_dKoef_pt_to_mm,
                    Type: tblwidth_Mm
                },
                Bottom: {
                    W: 0,
                    Type: tblwidth_Mm
                },
                Right: {
                    W: 5.75 * g_dKoef_pt_to_mm,
                    Type: tblwidth_Mm
                }
            }
        };
        var TableFirstRow = {
            TextPr: {
                Bold: true,
                Color: {
                    r: 255,
                    g: 255,
                    b: 255
                }
            },
            ParaPr: {
                Spacing: {
                    After: 0,
                    Before: 0,
                    Line: 1,
                    LineRule: linerule_Auto
                }
            },
            TableCellPr: {
                TableCellBorders: {
                    Bottom: {
                        Color: {
                            r: 0,
                            g: 0,
                            b: 0
                        },
                        Space: 0,
                        Size: 18 / 8 * g_dKoef_pt_to_mm,
                        Value: border_Single
                    },
                    Left: {
                        Value: border_None
                    },
                    Right: {
                        Value: border_None
                    },
                    Top: {
                        Color: {
                            r: 0,
                            g: 0,
                            b: 0
                        },
                        Space: 0,
                        Size: 18 / 8 * g_dKoef_pt_to_mm,
                        Value: border_Single
                    }
                },
                Shd: {
                    Value: shd_Clear,
                    Color: {
                        r: 79,
                        g: 129,
                        b: 189
                    }
                }
            }
        };
        var TableLastRow = {
            TextPr: {
                Color: {
                    r: 0,
                    g: 0,
                    b: 0
                }
            },
            TableCellPr: {
                TableCellBorders: {
                    Bottom: {
                        Color: {
                            r: 0,
                            g: 0,
                            b: 0
                        },
                        Space: 0,
                        Size: 18 / 8 * g_dKoef_pt_to_mm,
                        Value: border_Single
                    },
                    Left: {
                        Value: border_None
                    },
                    Right: {
                        Value: border_None
                    },
                    Top: {
                        Color: {
                            r: 0,
                            g: 0,
                            b: 0
                        },
                        Space: 0,
                        Size: 12 / 8 * g_dKoef_pt_to_mm,
                        Value: border_Single
                    }
                },
                Shd: {
                    Value: shd_Clear,
                    Color: {
                        r: 255,
                        g: 255,
                        b: 255
                    }
                }
            }
        };
        var TableFirstCol = {
            TextPr: {
                Bold: true,
                Color: {
                    r: 255,
                    g: 255,
                    b: 255
                }
            },
            ParaPr: {
                Spacing: {
                    After: 0,
                    Before: 0,
                    Line: 1,
                    LineRule: linerule_Auto
                }
            },
            TableCellPr: {
                TableCellBorder: {
                    Bottom: {
                        Color: {
                            r: 0,
                            g: 0,
                            b: 0
                        },
                        Space: 0,
                        Size: 18 / 8 * g_dKoef_pt_to_mm,
                        Value: border_Single
                    },
                    Left: {
                        Value: border_None
                    },
                    Right: {
                        Value: border_None
                    },
                    Top: {
                        Value: border_None
                    }
                },
                Shd: {
                    Value: shd_Clear,
                    Color: {
                        r: 79,
                        g: 129,
                        b: 189
                    }
                }
            }
        };
        var TableLastCol = {
            TextPr: {
                Bold: true,
                Color: {
                    r: 255,
                    g: 255,
                    b: 255
                }
            },
            TableCellPr: {
                TableCellBorders: {
                    Left: {
                        Value: border_None
                    },
                    Right: {
                        Value: border_None
                    }
                },
                Shd: {
                    Value: shd_Clear,
                    Color: {
                        r: 79,
                        g: 129,
                        b: 189
                    }
                }
            }
        };
        var TableBand1Vert = {
            TableCellPr: {
                TableCellBorders: {
                    Left: {
                        Value: border_None
                    },
                    Right: {
                        Value: border_None
                    }
                },
                Shd: {
                    Value: shd_Clear,
                    Color: {
                        r: 216,
                        g: 216,
                        b: 216
                    }
                }
            }
        };
        var TableBand1Horz = {
            TableCellPr: {
                Shd: {
                    Value: shd_Clear,
                    Color: {
                        r: 216,
                        g: 216,
                        b: 216
                    }
                }
            }
        };
        var TableTRCell = {
            TableCellPr: {
                TableCellBorders: {
                    Bottom: {
                        Color: {
                            r: 0,
                            g: 0,
                            b: 0
                        },
                        Space: 0,
                        Size: 18 / 8 * g_dKoef_pt_to_mm,
                        Value: border_Single
                    },
                    Left: {
                        Value: border_None
                    },
                    Right: {
                        Value: border_None
                    },
                    Top: {
                        Color: {
                            r: 0,
                            g: 0,
                            b: 0
                        },
                        Space: 0,
                        Size: 18 / 8 * g_dKoef_pt_to_mm,
                        Value: border_Single
                    }
                },
                Shd: {
                    Value: shd_Clear,
                    Color: {
                        r: 0,
                        g: 255,
                        b: 0
                    }
                }
            }
        };
        var TableTLCell = {
            TextPr: {
                Color: {
                    r: 255,
                    g: 255,
                    b: 255
                }
            },
            TableCellPr: {
                TableCellBorders: {
                    Bottom: {
                        Color: {
                            r: 0,
                            g: 0,
                            b: 0
                        },
                        Space: 0,
                        Size: 18 / 8 * g_dKoef_pt_to_mm,
                        Value: border_Single
                    },
                    Left: {
                        Value: border_None
                    },
                    Right: {
                        Value: border_None
                    },
                    Top: {
                        Color: {
                            r: 0,
                            g: 0,
                            b: 0
                        },
                        Space: 0,
                        Size: 18 / 8 * g_dKoef_pt_to_mm,
                        Value: border_Single
                    }
                },
                Shd: {
                    Value: shd_Clear,
                    Color: {
                        r: 255,
                        g: 0,
                        b: 0
                    }
                }
            }
        };
        this.Set_UiPriority(60);
        this.Set_ParaPr(ParaPr);
        this.Set_TablePr(TablePr);
        this.Set_TableFirstRow(TableFirstRow);
        this.Set_TableLastRow(TableLastRow);
        this.Set_TableFirstCol(TableFirstCol);
        this.Set_TableLastCol(TableLastCol);
        this.Set_TableBand1Horz(TableBand1Horz);
        this.Set_TableBand1Vert(TableBand1Vert);
        this.Set_TableTRCell(TableTRCell);
        this.Set_TableTLCell(TableTLCell);
    },
    Create_Table_ColorfulListAccent6: function () {
        this.uiPriority = 72;
        var ParaPr = {
            Spacing: {
                After: 0,
                Line: 1,
                LineRule: linerule_Auto
            }
        };
        var TextPr = {
            Color: {
                r: 0,
                g: 0,
                b: 0
            }
        };
        var TablePr = {
            TableStyleColBandSize: 1,
            TableStyleRowBandSize: 1,
            TableInd: 0,
            TableCellMar: {
                TableCellMar: {
                    Top: {
                        W: 0,
                        Type: tblwidth_Mm
                    },
                    Left: {
                        W: 5.75 * g_dKoef_pt_to_mm,
                        Type: tblwidth_Mm
                    },
                    Bottom: {
                        W: 0,
                        Type: tblwidth_Mm
                    },
                    Right: {
                        W: 5.75 * g_dKoef_pt_to_mm,
                        Type: tblwidth_Mm
                    }
                }
            }
        };
        var TableCellPr = {
            Shd: {
                Value: shd_Clear,
                Color: {
                    r: 254,
                    g: 244,
                    b: 236
                }
            }
        };
        var TableFirstRow = {
            TextPr: {
                Bold: true,
                Color: {
                    r: 255,
                    g: 255,
                    b: 255
                }
            },
            TableCellPr: {
                TableCellBorders: {
                    Bottom: {
                        Color: {
                            r: 255,
                            g: 255,
                            b: 255
                        },
                        Space: 0,
                        Size: 12 / 8 * g_dKoef_pt_to_mm,
                        Value: border_Single
                    }
                },
                Shd: {
                    Value: shd_Clear,
                    Color: {
                        r: 52,
                        g: 141,
                        b: 165
                    }
                }
            }
        };
        var TableLastRow = {
            TextPr: {
                Bold: true,
                Color: {
                    r: 52,
                    g: 141,
                    b: 165
                }
            },
            TableCellPr: {
                TableCellBorders: {
                    Top: {
                        Color: {
                            r: 0,
                            g: 0,
                            b: 0
                        },
                        Space: 0,
                        Size: 12 / 8 * g_dKoef_pt_to_mm,
                        Value: border_Single
                    }
                },
                Shd: {
                    Value: shd_Clear,
                    Color: {
                        r: 255,
                        g: 255,
                        b: 255
                    }
                }
            }
        };
        var TableFirstCol = {
            TextPr: {
                Bold: true
            }
        };
        var TableLastCol = {
            TextPr: {
                Bold: true
            }
        };
        var TableBand1Vert = {
            TableCellPr: {
                TableCellBorders: {
                    Top: {
                        Value: border_None
                    },
                    Left: {
                        Value: border_None
                    },
                    Bottom: {
                        Value: border_None
                    },
                    Right: {
                        Value: border_None
                    },
                    InsideH: {
                        Value: border_None
                    },
                    InsideV: {
                        Value: border_None
                    }
                },
                Shd: {
                    Value: shd_Clear,
                    Color: {
                        r: 253,
                        g: 228,
                        b: 208
                    }
                }
            }
        };
        var TableBand1Horz = {
            TableCellPr: {
                Shd: {
                    Value: shd_Clear,
                    Color: {
                        r: 253,
                        g: 233,
                        b: 217
                    }
                }
            }
        };
        this.Set_UiPriority(72);
        this.Set_ParaPr(ParaPr);
        this.Set_TextPr(TextPr);
        this.Set_TablePr(TablePr);
        this.Set_TableCellPr(TableCellPr);
        this.Set_TableFirstRow(TableFirstRow);
        this.Set_TableLastRow(TableLastRow);
        this.Set_TableFirstCol(TableFirstCol);
        this.Set_TableLastCol(TableLastCol);
        this.Set_TableBand1Horz(TableBand1Horz);
        this.Set_TableBand1Vert(TableBand1Vert);
    },
    Create_Table_Lined: function (Color1, Color2) {
        this.uiPriority = 99;
        var ParaPr = {
            Spacing: {
                After: 0,
                Line: 1,
                LineRule: linerule_Auto
            }
        };
        var TablePr = {
            TableStyleColBandSize: 1,
            TableStyleRowBandSize: 1,
            TableInd: 0,
            TableCellMar: {
                Top: new CTableMeasurement(tblwidth_Auto, 0),
                Left: new CTableMeasurement(tblwidth_Auto, 5.4 * g_dKoef_pt_to_mm),
                Bottom: new CTableMeasurement(tblwidth_Auto, 0),
                Right: new CTableMeasurement(tblwidth_Auto, 5.4 * g_dKoef_pt_to_mm)
            }
        };
        var TableFirstRow = {
            TableCellPr: {
                Shd: {
                    Value: shd_Clear,
                    Color: {
                        r: Color1.r,
                        g: Color1.g,
                        b: Color1.b
                    }
                }
            }
        };
        var TableLastRow = {
            TableCellPr: {
                Shd: {
                    Value: shd_Clear,
                    Color: {
                        r: Color1.r,
                        g: Color1.g,
                        b: Color1.b
                    }
                }
            }
        };
        var TableFirstCol = {
            TableCellPr: {
                Shd: {
                    Value: shd_Clear,
                    Color: {
                        r: Color1.r,
                        g: Color1.g,
                        b: Color1.b
                    }
                }
            }
        };
        var TableLastCol = {
            TableCellPr: {
                Shd: {
                    Value: shd_Clear,
                    Color: {
                        r: Color1.r,
                        g: Color1.g,
                        b: Color1.b
                    }
                }
            }
        };
        var TableBand2Vert = {
            TableCellPr: {
                Shd: {
                    Value: shd_Clear,
                    Color: {
                        r: Color2.r,
                        g: Color2.g,
                        b: Color2.b
                    }
                }
            }
        };
        var TableBand2Horz = {
            TableCellPr: {
                Shd: {
                    Value: shd_Clear,
                    Color: {
                        r: Color2.r,
                        g: Color2.g,
                        b: Color2.b
                    }
                }
            }
        };
        this.Set_UiPriority(99);
        this.Set_ParaPr(ParaPr);
        this.Set_TablePr(TablePr);
        this.Set_TableFirstRow(TableFirstRow);
        this.Set_TableLastRow(TableLastRow);
        this.Set_TableFirstCol(TableFirstCol);
        this.Set_TableLastCol(TableLastCol);
        this.Set_TableBand2Horz(TableBand2Horz);
        this.Set_TableBand2Vert(TableBand2Vert);
    },
    Create_Table_Bordered: function (Color1, Color2) {
        var ParaPr = {
            Spacing: {
                After: 0,
                Line: 1,
                LineRule: linerule_Auto
            }
        };
        var TablePr = {
            TableInd: 0,
            TableBorders: {
                Top: {
                    Color: {
                        r: Color1.r,
                        g: Color1.g,
                        b: Color1.b
                    },
                    Value: border_Single,
                    Size: 0.5 * g_dKoef_pt_to_mm,
                    Space: 0
                },
                Left: {
                    Color: {
                        r: Color1.r,
                        g: Color1.g,
                        b: Color1.b
                    },
                    Value: border_Single,
                    Size: 0.5 * g_dKoef_pt_to_mm,
                    Space: 0
                },
                Bottom: {
                    Color: {
                        r: Color1.r,
                        g: Color1.g,
                        b: Color1.b
                    },
                    Value: border_Single,
                    Size: 0.5 * g_dKoef_pt_to_mm,
                    Space: 0
                },
                Right: {
                    Color: {
                        r: Color1.r,
                        g: Color1.g,
                        b: Color1.b
                    },
                    Value: border_Single,
                    Size: 0.5 * g_dKoef_pt_to_mm,
                    Space: 0
                },
                InsideH: {
                    Color: {
                        r: Color1.r,
                        g: Color1.g,
                        b: Color1.b
                    },
                    Value: border_Single,
                    Size: 0.5 * g_dKoef_pt_to_mm,
                    Space: 0
                },
                InsideV: {
                    Color: {
                        r: Color1.r,
                        g: Color1.g,
                        b: Color1.b
                    },
                    Value: border_Single,
                    Size: 0.5 * g_dKoef_pt_to_mm,
                    Space: 0
                }
            },
            TableCellMar: {
                Top: new CTableMeasurement(tblwidth_Auto, 0),
                Left: new CTableMeasurement(tblwidth_Auto, 5.4 * g_dKoef_pt_to_mm),
                Bottom: new CTableMeasurement(tblwidth_Auto, 0),
                Right: new CTableMeasurement(tblwidth_Auto, 5.4 * g_dKoef_pt_to_mm)
            }
        };
        var TableFirstRow = {
            TableCellPr: {
                TableCellBorders: {
                    Bottom: {
                        Color: {
                            r: Color2.r,
                            g: Color2.g,
                            b: Color2.b
                        },
                        Value: border_Single,
                        Size: 2.25 * g_dKoef_pt_to_mm,
                        Space: 0
                    }
                }
            }
        };
        var TableLastRow = {
            TableCellPr: {
                TableCellBorders: {
                    Top: {
                        Color: {
                            r: Color2.r,
                            g: Color2.g,
                            b: Color2.b
                        },
                        Value: border_Single,
                        Size: 2.25 * g_dKoef_pt_to_mm,
                        Space: 0
                    }
                }
            }
        };
        var TableFirstCol = {
            TableCellPr: {
                TableCellBorders: {
                    Right: {
                        Color: {
                            r: Color2.r,
                            g: Color2.g,
                            b: Color2.b
                        },
                        Value: border_Single,
                        Size: 2.25 * g_dKoef_pt_to_mm,
                        Space: 0
                    }
                }
            }
        };
        var TableLastCol = {
            TableCellPr: {
                TableCellBorders: {
                    Left: {
                        Color: {
                            r: Color2.r,
                            g: Color2.g,
                            b: Color2.b
                        },
                        Value: border_Single,
                        Size: 2.25 * g_dKoef_pt_to_mm,
                        Space: 0
                    }
                }
            }
        };
        this.Set_UiPriority(99);
        this.Set_ParaPr(ParaPr);
        this.Set_TablePr(TablePr);
        this.Set_TableFirstRow(TableFirstRow);
        this.Set_TableLastRow(TableLastRow);
        this.Set_TableFirstCol(TableFirstCol);
        this.Set_TableLastCol(TableLastCol);
    },
    Create_Table_BorderedAndLined: function (Color1, Color2, Color3) {
        this.uiPriority = 99;
        var ParaPr = {
            Spacing: {
                After: 0,
                Line: 1,
                LineRule: linerule_Auto
            }
        };
        var TablePr = {
            TableStyleColBandSize: 1,
            TableStyleRowBandSize: 1,
            TableInd: 0,
            TableCellMar: {
                Top: new CTableMeasurement(tblwidth_Auto, 0),
                Left: new CTableMeasurement(tblwidth_Auto, 5.4 * g_dKoef_pt_to_mm),
                Bottom: new CTableMeasurement(tblwidth_Auto, 0),
                Right: new CTableMeasurement(tblwidth_Auto, 5.4 * g_dKoef_pt_to_mm)
            },
            TableBorders: {
                Top: {
                    Color: {
                        r: Color1.r,
                        g: Color1.g,
                        b: Color1.b
                    },
                    Value: border_Single,
                    Size: 0.5 * g_dKoef_pt_to_mm,
                    Space: 0
                },
                Left: {
                    Color: {
                        r: Color1.r,
                        g: Color1.g,
                        b: Color1.b
                    },
                    Value: border_Single,
                    Size: 0.5 * g_dKoef_pt_to_mm,
                    Space: 0
                },
                Bottom: {
                    Color: {
                        r: Color1.r,
                        g: Color1.g,
                        b: Color1.b
                    },
                    Value: border_Single,
                    Size: 0.5 * g_dKoef_pt_to_mm,
                    Space: 0
                },
                Right: {
                    Color: {
                        r: Color1.r,
                        g: Color1.g,
                        b: Color1.b
                    },
                    Value: border_Single,
                    Size: 0.5 * g_dKoef_pt_to_mm,
                    Space: 0
                },
                InsideH: {
                    Color: {
                        r: Color1.r,
                        g: Color1.g,
                        b: Color1.b
                    },
                    Value: border_Single,
                    Size: 0.5 * g_dKoef_pt_to_mm,
                    Space: 0
                },
                InsideV: {
                    Color: {
                        r: Color1.r,
                        g: Color1.g,
                        b: Color1.b
                    },
                    Value: border_Single,
                    Size: 0.5 * g_dKoef_pt_to_mm,
                    Space: 0
                }
            }
        };
        var TableFirstRow = {
            TableCellPr: {
                Shd: {
                    Value: shd_Clear,
                    Color: {
                        r: Color2.r,
                        g: Color2.g,
                        b: Color2.b
                    }
                }
            }
        };
        var TableLastRow = {
            TableCellPr: {
                Shd: {
                    Value: shd_Clear,
                    Color: {
                        r: Color2.r,
                        g: Color2.g,
                        b: Color2.b
                    }
                }
            }
        };
        var TableFirstCol = {
            TableCellPr: {
                Shd: {
                    Value: shd_Clear,
                    Color: {
                        r: Color2.r,
                        g: Color2.g,
                        b: Color2.b
                    }
                }
            }
        };
        var TableLastCol = {
            TableCellPr: {
                Shd: {
                    Value: shd_Clear,
                    Color: {
                        r: Color2.r,
                        g: Color2.g,
                        b: Color2.b
                    }
                }
            }
        };
        var TableBand2Vert = {
            TableCellPr: {
                Shd: {
                    Value: shd_Clear,
                    Color: {
                        r: Color3.r,
                        g: Color3.g,
                        b: Color3.b
                    }
                }
            }
        };
        var TableBand2Horz = {
            TableCellPr: {
                Shd: {
                    Value: shd_Clear,
                    Color: {
                        r: Color3.r,
                        g: Color3.g,
                        b: Color3.b
                    }
                }
            }
        };
        this.Set_UiPriority(99);
        this.Set_ParaPr(ParaPr);
        this.Set_TablePr(TablePr);
        this.Set_TableFirstRow(TableFirstRow);
        this.Set_TableLastRow(TableLastRow);
        this.Set_TableFirstCol(TableFirstCol);
        this.Set_TableLastCol(TableLastCol);
        this.Set_TableBand2Horz(TableBand2Horz);
        this.Set_TableBand2Vert(TableBand2Vert);
    },
    Create_Character_Hyperlink: function () {
        var TextPr = {
            Color: {
                r: 0,
                g: 0,
                b: 255
            },
            Underline: true
        };
        this.Set_UiPriority(99);
        this.Set_UnhideWhenUsed(true);
        this.Set_TextPr(TextPr);
    },
    isEqual: function (cStyles) {
        var result = false;
        if (this.BasedOn == cStyles.BasedOn && this.Name == cStyles.Name && this.Next == cStyles.Next && this.Type == cStyles.Type && this.hidden == cStyles.hidden) {
            if (this.qFormat == cStyles.qFormat && this.semiHidden == cStyles.semiHidden && this.uiPriority == cStyles.uiPriority && this.unhideWhenUsed == cStyles.unhideWhenUsed) {
                var isEqualParaPr = this.ParaPr.isEqual(this.ParaPr, cStyles.ParaPr);
                var isEqualTextPr = this.TextPr.isEqual(this.TextPr, cStyles.TextPr);
                if (isEqualParaPr && isEqualTextPr) {
                    result = true;
                }
            }
        }
        return result;
    },
    Undo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_Style_TextPr:
            this.TextPr = Data.Old;
            break;
        case historyitem_Style_ParaPr:
            this.ParaPr = Data.Old;
            break;
        case historyitem_Style_TablePr:
            this.TablePr = Data.Old;
            break;
        case historyitem_Style_TableRowPr:
            this.TableRowPr = Data.Old;
            break;
        case historyitem_Style_TableCellPr:
            this.TableCellPr = Data.Old;
            break;
        case historyitem_Style_TableBand1Horz:
            this.TableBand1Horz = Data.Old;
            break;
        case historyitem_Style_TableBand1Vert:
            this.TableBand1Vert = Data.Old;
            break;
        case historyitem_Style_TableBand2Horz:
            this.TableBand2Horz = Data.Old;
            break;
        case historyitem_Style_TableBand2Vert:
            this.TableBand2Vert = Data.Old;
            break;
        case historyitem_Style_TableFirstCol:
            this.TableFirstCol = Data.Old;
            break;
        case historyitem_Style_TableFirstRow:
            this.TableFirstRow = Data.Old;
            break;
        case historyitem_Style_TableLastCol:
            this.TableLastCol = Data.Old;
            break;
        case historyitem_Style_TableLastRow:
            this.TableLastRow = Data.Old;
            break;
        case historyitem_Style_TableTLCell:
            this.TableTLCell = Data.Old;
            break;
        case historyitem_Style_TableTRCell:
            this.TableTRCell = Data.Old;
            break;
        case historyitem_Style_TableBLCell:
            this.TableBLCell = Data.Old;
            break;
        case historyitem_Style_TableBRCell:
            this.TableBRCell = Data.Old;
            break;
        case historyitem_Style_TableWholeTable:
            this.TableWholeTable = Data.Old;
            break;
        case historyitem_Style_Name:
            this.Name = Data.Old;
            break;
        case historyitem_Style_BasedOn:
            this.BasedOn = Data.Old;
            break;
        case historyitem_Style_Next:
            this.Next = Data.Old;
            break;
        case historyitem_Style_Type:
            this.Type = Data.Old;
            break;
        case historyitem_Style_QFormat:
            this.qFormat = Data.Old;
            break;
        case historyitem_Style_UiPriority:
            this.uiPriority = Data.Old;
            break;
        case historyitem_Style_Hidden:
            this.hidden = Data.Old;
            break;
        case historyitem_Style_SemiHidden:
            this.semiHidden = Data.Old;
            break;
        case historyitem_Style_UnhideWhenUsed:
            this.unhideWhenUsed = Data.Old;
            break;
        }
    },
    Redo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_Style_TextPr:
            this.TextPr = Data.New;
            break;
        case historyitem_Style_ParaPr:
            this.ParaPr = Data.New;
            break;
        case historyitem_Style_TablePr:
            this.TablePr = Data.New;
            break;
        case historyitem_Style_TableRowPr:
            this.TableRowPr = Data.New;
            break;
        case historyitem_Style_TableCellPr:
            this.TableCellPr = Data.New;
            break;
        case historyitem_Style_TableBand1Horz:
            this.TableBand1Horz = Data.New;
            break;
        case historyitem_Style_TableBand1Vert:
            this.TableBand1Vert = Data.New;
            break;
        case historyitem_Style_TableBand2Horz:
            this.TableBand2Horz = Data.New;
            break;
        case historyitem_Style_TableBand2Vert:
            this.TableBand2Vert = Data.New;
            break;
        case historyitem_Style_TableFirstCol:
            this.TableFirstCol = Data.New;
            break;
        case historyitem_Style_TableFirstRow:
            this.TableFirstRow = Data.New;
            break;
        case historyitem_Style_TableLastCol:
            this.TableLastCol = Data.New;
            break;
        case historyitem_Style_TableLastRow:
            this.TableLastRow = Data.New;
            break;
        case historyitem_Style_TableTLCell:
            this.TableTLCell = Data.New;
            break;
        case historyitem_Style_TableTRCell:
            this.TableTRCell = Data.New;
            break;
        case historyitem_Style_TableBLCell:
            this.TableBLCell = Data.New;
            break;
        case historyitem_Style_TableBRCell:
            this.TableBRCell = Data.New;
            break;
        case historyitem_Style_TableWholeTable:
            this.TableWholeTable = Data.New;
            break;
        case historyitem_Style_Name:
            this.Name = Data.New;
            break;
        case historyitem_Style_BasedOn:
            this.BasedOn = Data.New;
            break;
        case historyitem_Style_Next:
            this.Next = Data.New;
            break;
        case historyitem_Style_Type:
            this.Type = Data.New;
            break;
        case historyitem_Style_QFormat:
            this.qFormat = Data.New;
            break;
        case historyitem_Style_UiPriority:
            this.uiPriority = Data.New;
            break;
        case historyitem_Style_Hidden:
            this.hidden = Data.New;
            break;
        case historyitem_Style_SemiHidden:
            this.semiHidden = Data.New;
            break;
        case historyitem_Style_UnhideWhenUsed:
            this.unhideWhenUsed = Data.New;
            break;
        }
    },
    Get_SelectionState: function () {},
    Set_SelectionState: function (State, StateIndex) {},
    Get_ParentObject_or_DocumentPos: function () {
        return {
            Type: historyrecalctype_Inline,
            Data: 0
        };
    },
    Refresh_RecalcData: function (Data) {
        var Type = Data.Type;
        var bNeedRecalc = false;
        switch (Type) {
        case historyitem_Style_TextPr:
            case historyitem_Style_ParaPr:
            case historyitem_Style_TablePr:
            case historyitem_Style_TableRowPr:
            case historyitem_Style_TableCellPr:
            case historyitem_Style_TableBand1Horz:
            case historyitem_Style_TableBand1Vert:
            case historyitem_Style_TableBand2Horz:
            case historyitem_Style_TableBand2Vert:
            case historyitem_Style_TableFirstCol:
            case historyitem_Style_TableFirstRow:
            case historyitem_Style_TableLastCol:
            case historyitem_Style_TableLastRow:
            case historyitem_Style_TableTLCell:
            case historyitem_Style_TableTRCell:
            case historyitem_Style_TableBLCell:
            case historyitem_Style_TableBRCell:
            case historyitem_Style_TableWholeTable:
            case historyitem_Style_Name:
            case historyitem_Style_BasedOn:
            case historyitem_Style_Next:
            case historyitem_Style_Type:
            case historyitem_Style_QFormat:
            case historyitem_Style_UiPriority:
            case historyitem_Style_Hidden:
            case historyitem_Style_SemiHidden:
            case historyitem_Style_UnhideWhenUsed:
            break;
        }
        if (true === bNeedRecalc) {
            return this.Refresh_RecalcData2();
        }
    },
    Refresh_RecalcData2: function () {},
    Document_Is_SelectionLocked: function (CheckType) {
        switch (CheckType) {
        case changestype_Paragraph_Content:
            case changestype_Paragraph_Properties:
            case changestype_Document_Content:
            case changestype_Document_Content_Add:
            case changestype_Image_Properties:
            case changestype_Remove:
            case changestype_Delete:
            case changestype_Document_SectPr:
            case changestype_Table_Properties:
            case changestype_Table_RemoveCells:
            case changestype_HdrFtr:
            CollaborativeEditing.Add_CheckLock(true);
            break;
        }
    },
    Save_Changes: function (Data, Writer) {
        Writer.WriteLong(historyitem_type_Style);
        var Type = Data.Type;
        Writer.WriteLong(Type);
        switch (Type) {
        case historyitem_Style_TextPr:
            case historyitem_Style_ParaPr:
            case historyitem_Style_TablePr:
            case historyitem_Style_TableRowPr:
            case historyitem_Style_TableCellPr:
            case historyitem_Style_TableBand1Horz:
            case historyitem_Style_TableBand1Vert:
            case historyitem_Style_TableBand2Horz:
            case historyitem_Style_TableBand2Vert:
            case historyitem_Style_TableFirstCol:
            case historyitem_Style_TableFirstRow:
            case historyitem_Style_TableLastCol:
            case historyitem_Style_TableLastRow:
            case historyitem_Style_TableTLCell:
            case historyitem_Style_TableTRCell:
            case historyitem_Style_TableBLCell:
            case historyitem_Style_TableBRCell:
            case historyitem_Style_TableWholeTable:
            Data.New.Write_ToBinary(Writer);
            break;
        case historyitem_Style_Name:
            case historyitem_Style_BasedOn:
            case historyitem_Style_Next:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                if (null === Data.New) {
                    Writer.WriteBool(true);
                } else {
                    Writer.WriteBool(false);
                    Writer.WriteString2(Data.New);
                }
            }
            break;
        case historyitem_Style_Type:
            Writer.WriteLong(Data.New);
            break;
        case historyitem_Style_QFormat:
            case historyitem_Style_Hidden:
            case historyitem_Style_SemiHidden:
            case historyitem_Style_UnhideWhenUsed:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                if (null === Data.New) {
                    Writer.WriteBool(true);
                } else {
                    Writer.WriteBool(false);
                    Writer.WriteBool(Data.New);
                }
            }
            break;
        case historyitem_Style_UiPriority:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                if (null === Data.New) {
                    Writer.WriteBool(true);
                } else {
                    Writer.WriteBool(false);
                    Writer.WriteLong(Data.New);
                }
            }
            break;
        }
        return Writer;
    },
    Load_Changes: function (Reader) {
        var ClassType = Reader.GetLong();
        if (historyitem_type_Style != ClassType) {
            return;
        }
        var Type = Reader.GetLong();
        switch (Type) {
        case historyitem_Style_TextPr:
            this.TextPr = new CTextPr();
            this.TextPr.Read_FromBinary(Reader);
            break;
        case historyitem_Style_ParaPr:
            this.ParaPr = new CParaPr();
            this.ParaPr.Read_FromBinary(Reader);
            break;
        case historyitem_Style_TablePr:
            this.TablePr = new CTablePr();
            this.TablePr.Read_FromBinary(Reader);
            break;
        case historyitem_Style_TableRowPr:
            this.TableRowPr = new CTableRowPr();
            this.TableRowPr.Read_FromBinary(Reader);
            break;
        case historyitem_Style_TableCellPr:
            this.TableCellPr = new CTableCellPr();
            this.TableCellPr.Read_FromBinary(Reader);
            break;
        case historyitem_Style_TableBand1Horz:
            this.TableBand1Horz = new CTableStylePr();
            this.TableBand1Horz.Read_FromBinary(Reader);
            break;
        case historyitem_Style_TableBand1Vert:
            this.TableBand1Vert = new CTableStylePr();
            this.TableBand1Vert.Read_FromBinary(Reader);
            break;
        case historyitem_Style_TableBand2Horz:
            this.TableBand2Horz = new CTableStylePr();
            this.TableBand2Horz.Read_FromBinary(Reader);
            break;
        case historyitem_Style_TableBand2Vert:
            this.TableBand2Vert = new CTableStylePr();
            this.TableBand2Vert.Read_FromBinary(Reader);
            break;
        case historyitem_Style_TableFirstCol:
            this.TableFirstCol = new CTableStylePr();
            this.TableFirstCol.Read_FromBinary(Reader);
            break;
        case historyitem_Style_TableFirstRow:
            this.TableFirstRow = new CTableStylePr();
            this.TableFirstRow.Read_FromBinary(Reader);
            break;
        case historyitem_Style_TableLastCol:
            this.TableLastCol = new CTableStylePr();
            this.TableLastCol.Read_FromBinary(Reader);
            break;
        case historyitem_Style_TableLastRow:
            this.TableLastRow = new CTableStylePr();
            this.TableLastRow.Read_FromBinary(Reader);
            break;
        case historyitem_Style_TableTLCell:
            this.TableTLCell = new CTableStylePr();
            this.TableTLCell.Read_FromBinary(Reader);
            break;
        case historyitem_Style_TableTRCell:
            this.TableTRCell = new CTableStylePr();
            this.TableTRCell.Read_FromBinary(Reader);
            break;
        case historyitem_Style_TableBLCell:
            this.TableBLCell = new CTableStylePr();
            this.TableBLCell.Read_FromBinary(Reader);
            break;
        case historyitem_Style_TableBRCell:
            this.TableBRCell = new CTableStylePr();
            this.TableBRCell.Read_FromBinary(Reader);
            break;
        case historyitem_Style_TableWholeTable:
            this.TableWholeTable = new CTableStylePr();
            this.TableWholeTable.Read_FromBinary(Reader);
            break;
        case historyitem_Style_Name:
            if (true === Reader.GetBool()) {
                this.Name = undefined;
            } else {
                if (true === Reader.GetBool()) {
                    this.Name = null;
                } else {
                    this.Name = Reader.GetString2();
                }
            }
            break;
        case historyitem_Style_BasedOn:
            if (true === Reader.GetBool()) {
                this.BasedOn = undefined;
            } else {
                if (true === Reader.GetBool()) {
                    this.BasedOn = null;
                } else {
                    this.BasedOn = Reader.GetString2();
                }
            }
            break;
        case historyitem_Style_Next:
            if (true === Reader.GetBool()) {
                this.Next = undefined;
            } else {
                if (true === Reader.GetBool()) {
                    this.Next = null;
                } else {
                    this.Next = Reader.GetString2();
                }
            }
            break;
        case historyitem_Style_Type:
            this.Type = Reader.GetLong();
            break;
        case historyitem_Style_QFormat:
            if (true === Reader.GetBool()) {
                this.qFormat = undefined;
            } else {
                if (true === Reader.GetBool()) {
                    this.qFormat = null;
                } else {
                    this.qFormat = Reader.GetBool();
                }
            }
            break;
        case historyitem_Style_Hidden:
            if (true === Reader.GetBool()) {
                this.hidden = undefined;
            } else {
                if (true === Reader.GetBool()) {
                    this.hidden = null;
                } else {
                    this.hidden = Reader.GetBool();
                }
            }
            break;
        case historyitem_Style_SemiHidden:
            if (true === Reader.GetBool()) {
                this.semiHidden = undefined;
            } else {
                if (true === Reader.GetBool()) {
                    this.semiHidden = null;
                } else {
                    this.semiHidden = Reader.GetBool();
                }
            }
            break;
        case historyitem_Style_UnhideWhenUsed:
            if (true === Reader.GetBool()) {
                this.unhideWhenUsed = undefined;
            } else {
                if (true === Reader.GetBool()) {
                    this.unhideWhenUsed = null;
                } else {
                    this.unhideWhenUsed = Reader.GetBool();
                }
            }
            break;
        case historyitem_Style_UiPriority:
            if (true === Reader.GetBool()) {
                this.uiPriority = undefined;
            } else {
                if (true === Reader.GetBool()) {
                    this.uiPriority = null;
                } else {
                    this.uiPriority = Reader.GetLong();
                }
            }
            break;
        }
    },
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(historyitem_type_Style);
        Writer.WriteString2(this.Id);
        if (undefined === this.Name) {
            Writer.WriteBool(true);
        } else {
            Writer.WriteBool(false);
            if (null === this.Name) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteString2(this.Name);
            }
        }
        if (undefined === this.BasedOn) {
            Writer.WriteBool(true);
        } else {
            Writer.WriteBool(false);
            if (null === this.BasedOn) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteString2(this.BasedOn);
            }
        }
        if (undefined === this.Next) {
            Writer.WriteBool(true);
        } else {
            Writer.WriteBool(false);
            if (null === this.Next) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteString2(this.Next);
            }
        }
        Writer.WriteLong(this.Type);
        if (undefined === this.uiPriority) {
            Writer.WriteBool(true);
        } else {
            Writer.WriteBool(false);
            if (null === this.uiPriority) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteLong(this.uiPriority);
            }
        }
        if (undefined === this.qFormat) {
            Writer.WriteBool(true);
        } else {
            Writer.WriteBool(false);
            if (null === this.qFormat) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(this.qFormat);
            }
        }
        if (undefined === this.hidden) {
            Writer.WriteBool(true);
        } else {
            Writer.WriteBool(false);
            if (null === this.hidden) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(this.hidden);
            }
        }
        if (undefined === this.semiHidden) {
            Writer.WriteBool(true);
        } else {
            Writer.WriteBool(false);
            if (null === this.semiHidden) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(this.semiHidden);
            }
        }
        if (undefined === this.unhideWhenUsed) {
            Writer.WriteBool(true);
        } else {
            Writer.WriteBool(false);
            if (null === this.unhideWhenUsed) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(this.unhideWhenUsed);
            }
        }
        this.TextPr.Write_ToBinary(Writer);
        this.ParaPr.Write_ToBinary(Writer);
        this.TablePr.Write_ToBinary(Writer);
        this.TableRowPr.Write_ToBinary(Writer);
        this.TableCellPr.Write_ToBinary(Writer);
        this.TableBand1Horz.Write_ToBinary(Writer);
        this.TableBand1Vert.Write_ToBinary(Writer);
        this.TableBand2Horz.Write_ToBinary(Writer);
        this.TableBand2Vert.Write_ToBinary(Writer);
        this.TableFirstCol.Write_ToBinary(Writer);
        this.TableFirstRow.Write_ToBinary(Writer);
        this.TableLastCol.Write_ToBinary(Writer);
        this.TableLastRow.Write_ToBinary(Writer);
        this.TableTLCell.Write_ToBinary(Writer);
        this.TableTRCell.Write_ToBinary(Writer);
        this.TableBLCell.Write_ToBinary(Writer);
        this.TableBRCell.Write_ToBinary(Writer);
        this.TableWholeTable.Write_ToBinary(Writer);
    },
    Read_FromBinary2: function (Reader) {
        this.Id = Reader.GetString2();
        if (true === Reader.GetBool()) {
            this.Name = undefined;
        } else {
            if (true === Reader.GetBool()) {
                this.Name = null;
            } else {
                this.Name = Reader.GetString2();
            }
        }
        if (true === Reader.GetBool()) {
            this.BasedOn = undefined;
        } else {
            if (true === Reader.GetBool()) {
                this.BasedOn = null;
            } else {
                this.BasedOn = Reader.GetString2();
            }
        }
        if (true === Reader.GetBool()) {
            this.Next = undefined;
        } else {
            if (true === Reader.GetBool()) {
                this.Next = null;
            } else {
                this.Next = Reader.GetString2();
            }
        }
        this.Type = Reader.GetLong();
        if (true === Reader.GetBool()) {
            this.uiPriority = undefined;
        } else {
            if (true === Reader.GetBool()) {
                this.uiPriority = null;
            } else {
                this.uiPriority = Reader.GetLong();
            }
        }
        if (true === Reader.GetBool()) {
            this.qFormat = undefined;
        } else {
            if (true === Reader.GetBool()) {
                this.qFormat = null;
            } else {
                this.qFormat = Reader.GetBool();
            }
        }
        if (true === Reader.GetBool()) {
            this.hidden = undefined;
        } else {
            if (true === Reader.GetBool()) {
                this.hidden = null;
            } else {
                this.hidden = Reader.GetBool();
            }
        }
        if (true === Reader.GetBool()) {
            this.semiHidden = undefined;
        } else {
            if (true === Reader.GetBool()) {
                this.semiHidden = null;
            } else {
                this.semiHidden = Reader.GetBool();
            }
        }
        if (true === Reader.GetBool()) {
            this.unhideWhenUsed = undefined;
        } else {
            if (true === Reader.GetBool()) {
                this.unhideWhenUsed = null;
            } else {
                this.unhideWhenUsed = Reader.GetBool();
            }
        }
        this.TextPr.Read_FromBinary(Reader);
        this.ParaPr.Read_FromBinary(Reader);
        this.TablePr.Read_FromBinary(Reader);
        this.TableRowPr.Read_FromBinary(Reader);
        this.TableCellPr.Read_FromBinary(Reader);
        this.TableBand1Horz.Read_FromBinary(Reader);
        this.TableBand1Vert.Read_FromBinary(Reader);
        this.TableBand2Horz.Read_FromBinary(Reader);
        this.TableBand2Vert.Read_FromBinary(Reader);
        this.TableFirstCol.Read_FromBinary(Reader);
        this.TableFirstRow.Read_FromBinary(Reader);
        this.TableLastCol.Read_FromBinary(Reader);
        this.TableLastRow.Read_FromBinary(Reader);
        this.TableTLCell.Read_FromBinary(Reader);
        this.TableTRCell.Read_FromBinary(Reader);
        this.TableBLCell.Read_FromBinary(Reader);
        this.TableBRCell.Read_FromBinary(Reader);
        this.TableWholeTable.Read_FromBinary(Reader);
    },
    Load_LinkData: function (LinkData) {}
};
function CStyles() {
    this.Id = g_oIdCounter.Get_NewId();
    this.Default = {
        ParaPr: new CParaPr(),
        TextPr: new CTextPr(),
        TablePr: new CTablePr(),
        TableRowPr: new CTableRowPr(),
        TableCellPr: new CTableCellPr(),
        Paragraph: null,
        Character: null,
        Numbering: null,
        Table: null,
        TableGrid: null,
        Headings: [],
        ParaList: null,
        Header: null,
        Footer: null,
        Hyperlink: null
    };
    this.Default.ParaPr.Init_Default();
    this.Default.TextPr.Init_Default();
    this.Default.TablePr.Init_Default();
    this.Default.TableRowPr.Init_Default();
    this.Default.TableCellPr.Init_Default();
    this.Style = new Array();
    var Style_Para_Def = new CStyle("Normal", null, null, styletype_Paragraph);
    Style_Para_Def.Create_Default_Paragraph();
    this.Default.Paragraph = this.Add(Style_Para_Def);
    var Style_Char_Def = new CStyle("Default Paragraph Font", null, null, styletype_Character);
    Style_Char_Def.Create_Default_Character();
    this.Default.Character = this.Add(Style_Char_Def);
    var Style_Num_Def = new CStyle("No List", null, null, styletype_Numbering);
    Style_Num_Def.Create_Default_Numbering();
    this.Default.Numbering = this.Add(Style_Num_Def);
    var Style_H1 = new CStyle("Heading 1", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
    Style_H1.Create_Heading1();
    this.Default.Headings[0] = this.Add(Style_H1);
    var Style_H2 = new CStyle("Heading 2", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
    Style_H2.Create_Heading2();
    this.Default.Headings[1] = this.Add(Style_H2);
    var Style_H3 = new CStyle("Heading 3", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
    Style_H3.Create_Heading3();
    this.Default.Headings[2] = this.Add(Style_H3);
    var Style_H4 = new CStyle("Heading 4", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
    Style_H4.Create_Heading4();
    this.Default.Headings[3] = this.Add(Style_H4);
    var Style_H5 = new CStyle("Heading 5", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
    Style_H5.Create_Heading5();
    this.Default.Headings[4] = this.Add(Style_H5);
    var Style_H6 = new CStyle("Heading 6", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
    Style_H6.Create_Heading6();
    this.Default.Headings[5] = this.Add(Style_H6);
    var Style_H7 = new CStyle("Heading 7", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
    Style_H7.Create_Heading7();
    this.Default.Headings[6] = this.Add(Style_H7);
    var Style_H8 = new CStyle("Heading 8", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
    Style_H8.Create_Heading8();
    this.Default.Headings[7] = this.Add(Style_H8);
    var Style_H9 = new CStyle("Heading 9", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
    Style_H9.Create_Heading9();
    this.Default.Headings[8] = this.Add(Style_H9);
    var Style_Para_List = new CStyle("List Paragraph", this.Default.Paragraph, null, styletype_Paragraph);
    Style_Para_List.Create_ListParagraph();
    this.Default.ParaList = this.Add(Style_Para_List);
    var Style_Table = new CStyle("Normal Table", null, null, styletype_Table);
    Style_Table.Create_NormalTable();
    this.Default.Table = this.Add(Style_Table);
    var Style_NoSpacing = new CStyle("No Spacing", null, null, styletype_Paragraph);
    Style_NoSpacing.Create_NoSpacing();
    this.Add(Style_NoSpacing);
    var Style_Title = new CStyle("Title", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
    Style_Title.Create_Title();
    this.Add(Style_Title);
    var Style_Subtitle = new CStyle("Subtitle", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
    Style_Subtitle.Create_Subtitle();
    this.Add(Style_Subtitle);
    var Style_Quote = new CStyle("Quote", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
    Style_Quote.Create_Quote();
    this.Add(Style_Quote);
    var Style_IntenseQuote = new CStyle("Intense Quote", this.Default.Paragraph, this.Default.Paragraph, styletype_Paragraph);
    Style_IntenseQuote.Create_IntenseQuote();
    this.Add(Style_IntenseQuote);
    var Style_Header = new CStyle("Header", this.Default.Paragraph, null, styletype_Paragraph);
    Style_Header.Create_Header();
    this.Default.Header = this.Add(Style_Header);
    var Style_Footer = new CStyle("Footer", this.Default.Paragraph, null, styletype_Paragraph);
    Style_Footer.Create_Footer();
    this.Default.Footer = this.Add(Style_Footer);
    var Style_TableGrid = new CStyle("Table Grid", this.Default.Table, null, styletype_Table);
    Style_TableGrid.Create_TableGrid();
    this.Default.TableGrid = this.Add(Style_TableGrid);
    var Style_Table_Lined = new CStyle("Lined", this.Default.Table, null, styletype_Table);
    Style_Table_Lined.Create_Table_Lined(new CDocumentColor(166, 166, 166), new CDocumentColor(217, 217, 217));
    this.Add(Style_Table_Lined);
    var Style_Table_Lined_Accent1 = new CStyle("Lined - Accent 1", this.Default.Table, null, styletype_Table);
    Style_Table_Lined_Accent1.Create_Table_Lined(new CDocumentColor(149, 179, 215), new CDocumentColor(219, 229, 241));
    this.Add(Style_Table_Lined_Accent1);
    var Style_Table_Lined_Accent2 = new CStyle("Lined - Accent 2", this.Default.Table, null, styletype_Table);
    Style_Table_Lined_Accent2.Create_Table_Lined(new CDocumentColor(217, 149, 148), new CDocumentColor(242, 219, 219));
    this.Add(Style_Table_Lined_Accent2);
    var Style_Table_Lined_Accent3 = new CStyle("Lined - Accent 3", this.Default.Table, null, styletype_Table);
    Style_Table_Lined_Accent3.Create_Table_Lined(new CDocumentColor(194, 214, 155), new CDocumentColor(234, 241, 221));
    this.Add(Style_Table_Lined_Accent3);
    var Style_Table_Lined_Accent4 = new CStyle("Lined - Accent 4", this.Default.Table, null, styletype_Table);
    Style_Table_Lined_Accent4.Create_Table_Lined(new CDocumentColor(178, 161, 199), new CDocumentColor(229, 223, 236));
    this.Add(Style_Table_Lined_Accent4);
    var Style_Table_Lined_Accent5 = new CStyle("Lined - Accent 5", this.Default.Table, null, styletype_Table);
    Style_Table_Lined_Accent5.Create_Table_Lined(new CDocumentColor(146, 205, 220), new CDocumentColor(218, 238, 243));
    this.Add(Style_Table_Lined_Accent5);
    var Style_Table_Lined_Accent6 = new CStyle("Lined - Accent 6", this.Default.Table, null, styletype_Table);
    Style_Table_Lined_Accent6.Create_Table_Lined(new CDocumentColor(250, 191, 143), new CDocumentColor(253, 233, 233));
    this.Add(Style_Table_Lined_Accent6);
    var Style_Table_Bordered = new CStyle("Bordered", this.Default.Table, null, styletype_Table);
    Style_Table_Bordered.Create_Table_Bordered(new CDocumentColor(191, 191, 191), new CDocumentColor(0, 0, 0));
    this.Add(Style_Table_Bordered);
    var Style_Table_Bordered_Accent_1 = new CStyle("Bordered - Accent 1", this.Default.Table, null, styletype_Table);
    Style_Table_Bordered_Accent_1.Create_Table_Bordered(new CDocumentColor(184, 204, 228), new CDocumentColor(54, 95, 145));
    this.Add(Style_Table_Bordered_Accent_1);
    var Style_Table_Bordered_Accent_2 = new CStyle("Bordered - Accent 2", this.Default.Table, null, styletype_Table);
    Style_Table_Bordered_Accent_2.Create_Table_Bordered(new CDocumentColor(229, 184, 183), new CDocumentColor(148, 54, 52));
    this.Add(Style_Table_Bordered_Accent_2);
    var Style_Table_Bordered_Accent_3 = new CStyle("Bordered - Accent 3", this.Default.Table, null, styletype_Table);
    Style_Table_Bordered_Accent_3.Create_Table_Bordered(new CDocumentColor(214, 227, 188), new CDocumentColor(118, 146, 60));
    this.Add(Style_Table_Bordered_Accent_3);
    var Style_Table_Bordered_Accent_4 = new CStyle("Bordered - Accent 4", this.Default.Table, null, styletype_Table);
    Style_Table_Bordered_Accent_4.Create_Table_Bordered(new CDocumentColor(204, 192, 217), new CDocumentColor(95, 73, 122));
    this.Add(Style_Table_Bordered_Accent_4);
    var Style_Table_Bordered_Accent_5 = new CStyle("Bordered - Accent 5", this.Default.Table, null, styletype_Table);
    Style_Table_Bordered_Accent_5.Create_Table_Bordered(new CDocumentColor(182, 221, 232), new CDocumentColor(49, 132, 155));
    this.Add(Style_Table_Bordered_Accent_5);
    var Style_Table_Bordered_Accent_6 = new CStyle("Bordered - Accent 6", this.Default.Table, null, styletype_Table);
    Style_Table_Bordered_Accent_6.Create_Table_Bordered(new CDocumentColor(251, 212, 180), new CDocumentColor(227, 108, 10));
    this.Add(Style_Table_Bordered_Accent_6);
    var Style_Table_BorderedLined = new CStyle("Bordered & Lined", this.Default.Table, null, styletype_Table);
    Style_Table_BorderedLined.Create_Table_BorderedAndLined(new CDocumentColor(0, 0, 0), new CDocumentColor(166, 166, 166), new CDocumentColor(217, 217, 217));
    this.Add(Style_Table_BorderedLined);
    var Style_Table_BorderedLined_Accent1 = new CStyle("Bordered & Lined - Accent 1", this.Default.Table, null, styletype_Table);
    Style_Table_BorderedLined_Accent1.Create_Table_BorderedAndLined(new CDocumentColor(23, 54, 93), new CDocumentColor(141, 179, 226), new CDocumentColor(219, 229, 241));
    this.Add(Style_Table_BorderedLined_Accent1);
    var Style_Table_BorderedLined_Accent2 = new CStyle("Bordered & Lined - Accent 2", this.Default.Table, null, styletype_Table);
    Style_Table_BorderedLined_Accent2.Create_Table_BorderedAndLined(new CDocumentColor(148, 54, 52), new CDocumentColor(217, 149, 148), new CDocumentColor(242, 219, 219));
    this.Add(Style_Table_BorderedLined_Accent2);
    var Style_Table_BorderedLined_Accent3 = new CStyle("Bordered & Lined - Accent 3", this.Default.Table, null, styletype_Table);
    Style_Table_BorderedLined_Accent3.Create_Table_BorderedAndLined(new CDocumentColor(118, 146, 60), new CDocumentColor(194, 214, 155), new CDocumentColor(234, 241, 221));
    this.Add(Style_Table_BorderedLined_Accent3);
    var Style_Table_BorderedLined_Accent4 = new CStyle("Bordered & Lined - Accent 4", this.Default.Table, null, styletype_Table);
    Style_Table_BorderedLined_Accent4.Create_Table_BorderedAndLined(new CDocumentColor(95, 73, 122), new CDocumentColor(178, 161, 199), new CDocumentColor(229, 223, 236));
    this.Add(Style_Table_BorderedLined_Accent4);
    var Style_Table_BorderedLined_Accent5 = new CStyle("Bordered & Lined - Accent 5", this.Default.Table, null, styletype_Table);
    Style_Table_BorderedLined_Accent5.Create_Table_BorderedAndLined(new CDocumentColor(49, 132, 155), new CDocumentColor(146, 205, 220), new CDocumentColor(218, 238, 243));
    this.Add(Style_Table_BorderedLined_Accent5);
    var Style_Table_BorderedLined_Accent6 = new CStyle("Bordered & Lined - Accent 6", this.Default.Table, null, styletype_Table);
    Style_Table_BorderedLined_Accent6.Create_Table_BorderedAndLined(new CDocumentColor(227, 108, 10), new CDocumentColor(250, 191, 143), new CDocumentColor(253, 233, 217));
    this.Add(Style_Table_BorderedLined_Accent6);
    var Style_Hyperlink = new CStyle("Hyperlink", null, null, styletype_Character);
    Style_Hyperlink.Create_Character_Hyperlink();
    this.Default.Hyperlink = this.Add(Style_Hyperlink);
    g_oTableId.Add(this, this.Id);
}
CStyles.prototype = {
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
    Add: function (Style) {
        var Id = Style.Get_Id();
        History.Add(this, {
            Type: historyitem_Styles_Add,
            Id: Id,
            Style: Style
        });
        this.Style[Id] = Style;
        return Id;
    },
    Remove: function (Id) {
        History.Add(this, {
            Type: historyitem_Styles_Remove,
            Id: Id,
            Style: this.Style[Id]
        });
        delete this.Style[Id];
    },
    Get_Pr: function (StyleId, Type, TableStyle) {
        var Pr = {};
        switch (Type) {
        case styletype_Paragraph:
            if (null != TableStyle) {
                Pr.TextPr = TableStyle.TextPr.Copy();
                Pr.ParaPr = TableStyle.ParaPr.Copy();
            } else {
                Pr.TextPr = this.Default.TextPr.Copy();
                Pr.ParaPr = this.Default.ParaPr.Copy();
            }
            break;
        case styletype_Table:
            Pr.TextPr = this.Default.TextPr.Copy();
            Pr.ParaPr = this.Default.ParaPr.Copy();
            var DefId = this.Default.Paragraph;
            if (undefined != DefId && null != DefId) {
                Pr.ParaPr.Merge(this.Style[DefId].ParaPr);
                Pr.TextPr.Merge(this.Style[DefId].TextPr);
            }
            Pr.TablePr = this.Default.TablePr.Copy();
            Pr.TableRowPr = this.Default.TableRowPr.Copy();
            Pr.TableCellPr = this.Default.TableCellPr.Copy();
            Pr.TableFirstCol = new CTableStylePr();
            Pr.TableFirstRow = new CTableStylePr();
            Pr.TableLastCol = new CTableStylePr();
            Pr.TableLastRow = new CTableStylePr();
            Pr.TableBand1Horz = new CTableStylePr();
            Pr.TableBand1Vert = new CTableStylePr();
            Pr.TableBand2Horz = new CTableStylePr();
            Pr.TableBand2Vert = new CTableStylePr();
            Pr.TableTLCell = new CTableStylePr();
            Pr.TableTRCell = new CTableStylePr();
            Pr.TableBLCell = new CTableStylePr();
            Pr.TableBRCell = new CTableStylePr();
            Pr.TableWholeTable = new CTableStylePr();
            break;
        case styletype_Character:
            Pr.TextPr = new CTextPr();
            break;
        }
        this.Internal_Get_Pr(Pr, StyleId, Type, (null === TableStyle ? true : false));
        if (styletype_Table === Type) {
            var DefParaId = this.Default.Paragraph;
            Pr.ParaPr.Merge(this.Style[DefParaId].ParaPr);
            Pr.TextPr.Merge(this.Style[DefParaId].TextPr);
            Pr.ParaPr.Merge(Pr.TableWholeTable.ParaPr);
            Pr.TextPr.Merge(Pr.TableWholeTable.TextPr);
            Pr.TablePr.Merge(Pr.TableWholeTable.TablePr);
            Pr.TableRowPr.Merge(Pr.TableWholeTable.TableRowPr);
            Pr.TableCellPr.Merge(Pr.TableWholeTable.TableCellPr);
            delete Pr.TableWholeTable;
        }
        return Pr;
    },
    Get_Next: function (StyleId) {
        return this.Style[StyleId].Next;
    },
    Get_Name: function (StyleId) {
        if (undefined != this.Style[StyleId]) {
            return this.Style[StyleId].Name;
        }
        return "";
    },
    Get_Default_Paragraph: function () {
        return this.Default.Paragraph;
    },
    Get_Default_Character: function () {
        return this.Default.Character;
    },
    Get_Default_Numbering: function () {
        return this.Default.Numbering;
    },
    Get_Default_Table: function () {
        return this.Default.Table;
    },
    Get_Default_TableGrid: function () {
        return this.Default.TableGrid;
    },
    Get_Default_Heading: function (Lvl) {
        Lvl = Math.max(Math.min(Lvl, 8), 0);
        return this.Default.Headings[Lvl];
    },
    Get_Default_ParaList: function () {
        return this.Default.ParaList;
    },
    Get_Default_Header: function () {
        return this.Default.Header;
    },
    Get_Default_Footer: function () {
        return this.Default.Footer;
    },
    Get_Default_Hyperlink: function () {
        return this.Default.Hyperlink;
    },
    Get_StyleIdByName: function (Name) {
        for (var Id in this.Style) {
            var Style = this.Style[Id];
            if (Style.Name === Name) {
                return Id;
            }
        }
        return this.Default.Paragraph;
    },
    Internal_Get_Pr: function (Pr, StyleId, Type, bUseDefault) {
        var Style = this.Style[StyleId];
        if (undefined == StyleId || undefined === Style) {
            if (true === bUseDefault) {
                switch (Type) {
                case styletype_Paragraph:
                    var DefId = this.Default.Paragraph;
                    Pr.ParaPr.Merge(this.Style[DefId].ParaPr);
                    Pr.TextPr.Merge(this.Style[DefId].TextPr);
                    break;
                case styletype_Numbering:
                    var DefId = this.Default.Numbering;
                    break;
                case styletype_Table:
                    var DefId = this.Default.Table;
                    Pr.ParaPr.Merge(this.Style[DefId].ParaPr);
                    Pr.TextPr.Merge(this.Style[DefId].TextPr);
                    Pr.TablePr.Merge(this.Styles[DefId].TablePr);
                    Pr.TableRowPr.Merge(this.Styles[DefId].TableRowPr);
                    Pr.TableCellPr.Merge(this.Styles[DefId].TableCellPr);
                    break;
                case styletype_Character:
                    var DefId = this.Default.Character;
                    Pr.TextPr.Merge(this.Style[DefId].TextPr);
                    break;
                }
            }
            return;
        }
        if (null === Style.BasedOn) {
            if (true === bUseDefault) {
                switch (Type) {
                case styletype_Paragraph:
                    var DefId = this.Default.Paragraph;
                    Pr.ParaPr.Merge(this.Style[DefId].ParaPr);
                    Pr.TextPr.Merge(this.Style[DefId].TextPr);
                    break;
                case styletype_Numbering:
                    var DefId = this.Default.Numbering;
                    break;
                case styletype_Table:
                    var DefId = this.Default.Table;
                    Pr.ParaPr.Merge(this.Style[DefId].ParaPr);
                    Pr.TextPr.Merge(this.Style[DefId].TextPr);
                    Pr.TablePr.Merge(this.Styles[DefId].TablePr);
                    Pr.TableRowPr.Merge(this.Styles[DefId].TableRowPr);
                    Pr.TableCellPr.Merge(this.Styles[DefId].TableCellPr);
                    break;
                case styletype_Character:
                    var DefId = this.Default.Character;
                    Pr.TextPr.Merge(this.Style[DefId].TextPr);
                    break;
                }
            }
            switch (Type) {
            case styletype_Paragraph:
                Pr.ParaPr.Merge(Style.ParaPr);
                Pr.TextPr.Merge(Style.TextPr);
                break;
            case styletype_Numbering:
                break;
            case styletype_Table:
                Pr.ParaPr.Merge(Style.ParaPr);
                Pr.TextPr.Merge(Style.TextPr);
                if (undefined != Style.TablePr) {
                    Pr.TablePr.Merge(Style.TablePr);
                    Pr.TableRowPr.Merge(Style.TableRowPr);
                    Pr.TableCellPr.Merge(Style.TableCellPr);
                    Pr.TableBand1Horz.Merge(Style.TableBand1Horz);
                    Pr.TableBand1Vert.Merge(Style.TableBand1Vert);
                    Pr.TableBand2Horz.Merge(Style.TableBand2Horz);
                    Pr.TableBand2Vert.Merge(Style.TableBand2Vert);
                    Pr.TableFirstCol.Merge(Style.TableFirstCol);
                    Pr.TableFirstRow.Merge(Style.TableFirstRow);
                    Pr.TableLastCol.Merge(Style.TableLastCol);
                    Pr.TableLastRow.Merge(Style.TableLastRow);
                    Pr.TableTLCell.Merge(Style.TableTLCell);
                    Pr.TableTRCell.Merge(Style.TableTRCell);
                    Pr.TableBLCell.Merge(Style.TableBLCell);
                    Pr.TableBRCell.Merge(Style.TableBRCell);
                    Pr.TableWholeTable.Merge(Style.TableWholeTable);
                }
                break;
            case styletype_Character:
                Pr.TextPr.Merge(Style.TextPr);
                break;
            }
        } else {
            this.Internal_Get_Pr(Pr, Style.BasedOn, Type);
            if ((styletype_Paragraph === Type || styletype_Table === Type) && (undefined != Style.ParaPr.NumPr)) {
                var Numbering = editor.WordControl.m_oLogicDocument.Get_Numbering();
                if (undefined != Style.ParaPr.NumPr.NumId && 0 != Style.ParaPr.NumPr.NumId) {
                    var AbstractNum = Numbering.Get_AbstractNum(Style.ParaPr.NumPr.NumId);
                    var Lvl = AbstractNum.Get_LvlByStyle(StyleId);
                    if (-1 != Lvl) {
                        Pr.ParaPr.Merge(Numbering.Get_ParaPr(Style.ParaPr.NumPr.NumId, Lvl));
                    } else {
                        Pr.ParaPr.NumPr = undefined;
                    }
                }
            }
            switch (Type) {
            case styletype_Paragraph:
                Pr.ParaPr.Merge(Style.ParaPr);
                Pr.TextPr.Merge(Style.TextPr);
                break;
            case styletype_Numbering:
                break;
            case styletype_Table:
                Pr.ParaPr.Merge(Style.ParaPr);
                Pr.TextPr.Merge(Style.TextPr);
                if (undefined != Style.TablePr) {
                    Pr.TablePr.Merge(Style.TablePr);
                    Pr.TableRowPr.Merge(Style.TableRowPr);
                    Pr.TableCellPr.Merge(Style.TableCellPr);
                    Pr.TableBand1Horz.Merge(Style.TableBand1Horz);
                    Pr.TableBand1Vert.Merge(Style.TableBand1Vert);
                    Pr.TableBand2Horz.Merge(Style.TableBand2Horz);
                    Pr.TableBand2Vert.Merge(Style.TableBand2Vert);
                    Pr.TableFirstCol.Merge(Style.TableFirstCol);
                    Pr.TableFirstRow.Merge(Style.TableFirstRow);
                    Pr.TableLastCol.Merge(Style.TableLastCol);
                    Pr.TableLastRow.Merge(Style.TableLastRow);
                    Pr.TableTLCell.Merge(Style.TableTLCell);
                    Pr.TableTRCell.Merge(Style.TableTRCell);
                    Pr.TableBLCell.Merge(Style.TableBLCell);
                    Pr.TableBRCell.Merge(Style.TableBRCell);
                    Pr.TableWholeTable.Merge(Style.TableWholeTable);
                }
                break;
            case styletype_Character:
                Pr.TextPr.Merge(Style.TextPr);
                break;
            }
        }
    },
    Document_Get_AllFontNames: function (AllFonts) {
        for (var Id in this.Style) {
            var Style = this.Style[Id];
            Style.Document_Get_AllFontNames(AllFonts);
        }
        this.Default.TextPr.Document_Get_AllFontNames(AllFonts);
    },
    Get_AllTableStyles: function () {
        var TableStyles = new Array();
        for (var Id in this.Style) {
            var Style = this.Style[Id];
            if (styletype_Table === Style.Type) {
                TableStyles.push(Id);
            }
        }
        return TableStyles;
    },
    Undo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_Styles_Add:
            delete this.Style[Data.Id];
            break;
        case historyitem_Styles_Remove:
            this.Style[Data.Id] = Data.Style;
            break;
        }
    },
    Redo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_Styles_Add:
            this.Style[Data.Id] = Data.Style;
            break;
        case historyitem_Styles_Remove:
            delete this.Style[Data.Id];
            break;
        }
    },
    Get_SelectionState: function () {},
    Set_SelectionState: function (State, StateIndex) {},
    Get_ParentObject_or_DocumentPos: function () {
        return {
            Type: historyrecalctype_Inline,
            Data: 0
        };
    },
    Refresh_RecalcData: function (Data) {
        var Type = Data.Type;
        var bNeedRecalc = false;
        switch (Type) {
        case historyitem_Style_TextPr:
            case historyitem_Style_ParaPr:
            case historyitem_Style_TablePr:
            case historyitem_Style_TableRowPr:
            case historyitem_Style_TableCellPr:
            case historyitem_Style_TableBand1Horz:
            case historyitem_Style_TableBand1Vert:
            case historyitem_Style_TableBand2Horz:
            case historyitem_Style_TableBand2Vert:
            case historyitem_Style_TableFirstCol:
            case historyitem_Style_TableFirstRow:
            case historyitem_Style_TableLastCol:
            case historyitem_Style_TableLastRow:
            case historyitem_Style_TableTLCell:
            case historyitem_Style_TableTRCell:
            case historyitem_Style_TableBLCell:
            case historyitem_Style_TableBRCell:
            case historyitem_Style_TableWholeTable:
            case historyitem_Style_Name:
            case historyitem_Style_BasedOn:
            case historyitem_Style_Next:
            case historyitem_Style_Type:
            case historyitem_Style_QFormat:
            case historyitem_Style_UiPriority:
            case historyitem_Style_Hidden:
            case historyitem_Style_SemiHidden:
            case historyitem_Style_UnhideWhenUsed:
            break;
        }
        if (true === bNeedRecalc) {
            return this.Refresh_RecalcData2();
        }
    },
    Refresh_RecalcData2: function () {},
    Document_Is_SelectionLocked: function (CheckType) {
        switch (CheckType) {
        case changestype_Paragraph_Content:
            case changestype_Paragraph_Properties:
            case changestype_Document_Content:
            case changestype_Document_Content_Add:
            case changestype_Image_Properties:
            case changestype_Remove:
            case changestype_Delete:
            case changestype_Document_SectPr:
            case changestype_Table_Properties:
            case changestype_Table_RemoveCells:
            case changestype_HdrFtr:
            CollaborativeEditing.Add_CheckLock(true);
            break;
        }
    },
    Save_Changes: function (Data, Writer) {
        Writer.WriteLong(historyitem_type_Styles);
        var Type = Data.Type;
        Writer.WriteLong(Type);
        switch (Type) {
        case historyitem_Styles_Add:
            case historyitem_Styles_Remove:
            Writer.WriteString2(Data.Id);
            break;
        }
        return Writer;
    },
    Load_Changes: function (Reader) {
        var ClassType = Reader.GetLong();
        if (historyitem_type_Styles != ClassType) {
            return;
        }
        var Type = Reader.GetLong();
        switch (Type) {
        case historyitem_Styles_Add:
            var Id = Reader.GetString2();
            this.Style[Id] = g_oTableId.Get_ById(Id);
            break;
        case historyitem_Styles_Remove:
            var Id = Reader.GetString2();
            delete this.Style[Id];
            break;
        }
    }
};
function CDocumentColor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
}
CDocumentColor.prototype = {
    Copy: function () {
        return new CDocumentColor(this.r, this.g, this.b);
    },
    Write_ToBinary: function (Writer) {
        Writer.WriteByte(this.r);
        Writer.WriteByte(this.g);
        Writer.WriteByte(this.b);
    },
    Read_FromBinary: function (Reader) {
        this.r = Reader.GetByte();
        this.g = Reader.GetByte();
        this.b = Reader.GetByte();
    },
    Set: function (r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    },
    Compare: function (Color) {
        if (this.r === Color.r && this.g === Color.g && this.b === Color.b) {
            return true;
        }
        return false;
    }
};
function CDocumentShd() {
    this.Value = shd_Nil;
    this.Color = new CDocumentColor(255, 255, 255);
}
CDocumentShd.prototype = {
    Copy: function () {
        var Shd = new CDocumentShd();
        Shd.Value = this.Value;
        Shd.Color.Set(this.Color.r, this.Color.g, this.Color.b);
        return Shd;
    },
    Compare: function (Shd) {
        if (this.Value === Shd.Value) {
            switch (this.Value) {
            case shd_Nil:
                return true;
            case shd_Clear:
                return this.Color.Compare(Shd.Color);
            }
        }
        return false;
    },
    Set_FromObject: function (Shd) {
        this.Value = Shd.Value;
        if (shd_Nil != Shd.Value && undefined != Shd.Color) {
            this.Color.Set(Shd.Color.r, Shd.Color.g, Shd.Color.b);
        } else {
            if (undefined === Shd.Color) {
                this.Color = undefined;
            }
        }
    },
    Write_ToBinary: function (Writer) {
        Writer.WriteByte(this.Value);
        if (shd_Clear === this.Value) {
            this.Color.Write_ToBinary(Writer);
        }
    },
    Read_FromBinary: function (Reader) {
        this.Value = Reader.GetByte();
        if (shd_Clear === this.Value) {
            this.Color.Read_FromBinary(Reader);
        } else {
            this.Color.Set(0, 0, 0);
        }
    }
};
function CDocumentBorder() {
    this.Color = new CDocumentColor(0, 0, 0);
    this.Space = 0;
    this.Size = 0.5 * g_dKoef_pt_to_mm;
    this.Value = border_None;
}
CDocumentBorder.prototype = {
    Copy: function () {
        var Border = new CDocumentBorder();
        if (undefined === this.Color) {
            Border.Color = undefined;
        } else {
            Border.Color.Set(this.Color.r, this.Color.g, this.Color.b);
        }
        if (undefined === this.Space) {
            Border.Space = undefined;
        } else {
            Border.Space = this.Space;
        }
        if (undefined === this.Size) {
            Border.Size = undefined;
        } else {
            Border.Size = this.Size;
        }
        if (undefined === this.Value) {
            Border.Value = undefined;
        } else {
            Border.Value = this.Value;
        }
        return Border;
    },
    Compare: function (Border) {
        if (false === this.Color.Compare(Border.Color)) {
            return false;
        }
        if (Math.abs(this.Size - Border.Size) > 0.001) {
            return false;
        }
        if (Math.abs(this.Space - Border.Space) > 0.001) {
            return false;
        }
        if (this.Value != Border.Value) {
            return false;
        }
        return true;
    },
    Set_FromObject: function (Border) {
        this.Space = Border.Space;
        this.Size = Border.Size;
        this.Value = Border.Value;
        if (undefined != Border.Color) {
            this.Color = new CDocumentColor(Border.Color.r, Border.Color.g, Border.Color.b);
        } else {
            this.Color = undefined;
        }
    },
    Check_Null: function () {
        if (undefined === this.Space || undefined === this.Size || undefined === this.Value || undefined === this.Color) {
            return false;
        }
        return true;
    },
    Write_ToBinary: function (Writer) {
        Writer.WriteDouble(this.Size);
        Writer.WriteLong(this.Space);
        Writer.WriteByte(this.Value);
        this.Color.Write_ToBinary(Writer);
    },
    Read_FromBinary: function (Reader) {
        this.Size = Reader.GetDouble();
        this.Space = Reader.GetLong();
        this.Value = Reader.GetByte();
        this.Color.Read_FromBinary(Reader);
    }
};
function CTableMeasurement(Type, W) {
    this.Type = Type;
    this.W = W;
}
CTableMeasurement.prototype = {
    Copy: function () {
        return new CTableMeasurement(this.Type, this.W);
    },
    Write_ToBinary: function (Writer) {
        Writer.WriteDouble(this.W);
        Writer.WriteLong(this.Type);
    },
    Read_FromBinary: function (Reader) {
        this.W = Reader.GetDouble();
        this.Type = Reader.GetLong();
    },
    Set_FromObject: function (Obj) {
        this.W = Obj.W;
        this.Type = Obj.Type;
    }
};
function CTablePr() {
    this.TableStyleColBandSize = undefined;
    this.TableStyleRowBandSize = undefined;
    this.Jc = undefined;
    this.Shd = undefined;
    this.TableBorders = {
        Bottom: undefined,
        Left: undefined,
        Right: undefined,
        Top: undefined,
        InsideH: undefined,
        InsideV: undefined
    };
    this.TableCellMar = {
        Bottom: undefined,
        Left: undefined,
        Right: undefined,
        Top: undefined
    };
    this.TableCellSpacing = undefined;
    this.TableInd = undefined;
    this.TableW = undefined;
    this.TableLayout = undefined;
}
CTablePr.prototype = {
    Copy: function () {
        var TablePr = new CTablePr();
        TablePr.TableStyleColBandSize = this.TableStyleColBandSize;
        TablePr.TableStyleRowBandSize = this.TableStyleRowBandSize;
        TablePr.Jc = this.Jc;
        if (undefined != this.Shd) {
            TablePr.Shd = this.Shd.Copy();
        }
        if (undefined != this.TableBorders.Bottom) {
            TablePr.TableBorders.Bottom = this.TableBorders.Bottom.Copy();
        }
        if (undefined != this.TableBorders.Left) {
            TablePr.TableBorders.Left = this.TableBorders.Left.Copy();
        }
        if (undefined != this.TableBorders.Right) {
            TablePr.TableBorders.Right = this.TableBorders.Right.Copy();
        }
        if (undefined != this.TableBorders.Top) {
            TablePr.TableBorders.Top = this.TableBorders.Top.Copy();
        }
        if (undefined != this.TableBorders.InsideH) {
            TablePr.TableBorders.InsideH = this.TableBorders.InsideH.Copy();
        }
        if (undefined != this.TableBorders.InsideV) {
            TablePr.TableBorders.InsideV = this.TableBorders.InsideV.Copy();
        }
        if (undefined != this.TableCellMar.Bottom) {
            TablePr.TableCellMar.Bottom = this.TableCellMar.Bottom.Copy();
        }
        if (undefined != this.TableCellMar.Left) {
            TablePr.TableCellMar.Left = this.TableCellMar.Left.Copy();
        }
        if (undefined != this.TableCellMar.Right) {
            TablePr.TableCellMar.Right = this.TableCellMar.Right.Copy();
        }
        if (undefined != this.TableCellMar.Top) {
            TablePr.TableCellMar.Top = this.TableCellMar.Top.Copy();
        }
        TablePr.TableCellSpacing = this.TableCellSpacing;
        TablePr.TableInd = this.TableInd;
        if (undefined != this.TableW) {
            TablePr.TableW = this.TableW.Copy();
        }
        TablePr.TableLayout = this.TableLayout;
        return TablePr;
    },
    Merge: function (TablePr) {
        if (undefined != TablePr.TableStyleColBandSize) {
            this.TableStyleColBandSize = TablePr.TableStyleColBandSize;
        }
        if (undefined != TablePr.TableStyleRowBandSize) {
            this.TableStyleRowBandSize = TablePr.TableStyleRowBandSize;
        }
        if (undefined != TablePr.Jc) {
            this.Jc = TablePr.Jc;
        }
        if (undefined != TablePr.Shd) {
            this.Shd = TablePr.Shd.Copy();
        }
        if (undefined != TablePr.TableBorders.Bottom) {
            this.TableBorders.Bottom = TablePr.TableBorders.Bottom.Copy();
        }
        if (undefined != TablePr.TableBorders.Left) {
            this.TableBorders.Left = TablePr.TableBorders.Left.Copy();
        }
        if (undefined != TablePr.TableBorders.Right) {
            this.TableBorders.Right = TablePr.TableBorders.Right.Copy();
        }
        if (undefined != TablePr.TableBorders.Top) {
            this.TableBorders.Top = TablePr.TableBorders.Top.Copy();
        }
        if (undefined != TablePr.TableBorders.InsideH) {
            this.TableBorders.InsideH = TablePr.TableBorders.InsideH.Copy();
        }
        if (undefined != TablePr.TableBorders.InsideV) {
            this.TableBorders.InsideV = TablePr.TableBorders.InsideV.Copy();
        }
        if (undefined != TablePr.TableCellMar.Bottom) {
            this.TableCellMar.Bottom = TablePr.TableCellMar.Bottom.Copy();
        }
        if (undefined != TablePr.TableCellMar.Left) {
            this.TableCellMar.Left = TablePr.TableCellMar.Left.Copy();
        }
        if (undefined != TablePr.TableCellMar.Right) {
            this.TableCellMar.Right = TablePr.TableCellMar.Right.Copy();
        }
        if (undefined != TablePr.TableCellMar.Top) {
            this.TableCellMar.Top = TablePr.TableCellMar.Top.Copy();
        }
        if (undefined != TablePr.TableCellMar) {
            this.TableCellSpacing = TablePr.TableCellSpacing;
        }
        if (undefined != TablePr.TableInd) {
            this.TableInd = TablePr.TableInd;
        }
        if (undefined != TablePr.TableW) {
            this.TableW = TablePr.TableW.Copy();
        }
        if (undefined != TablePr.TableLayout) {
            this.TableLayout = TablePr.TableLayout;
        }
    },
    Init_Default: function () {
        this.TableStyleColBandSize = 1;
        this.TableStyleRowBandSize = 1;
        this.Jc = align_Left;
        this.Shd = new CDocumentShd();
        this.TableBorders.Bottom = new CDocumentBorder();
        this.TableBorders.Left = new CDocumentBorder();
        this.TableBorders.Right = new CDocumentBorder();
        this.TableBorders.Top = new CDocumentBorder();
        this.TableBorders.InsideH = new CDocumentBorder();
        this.TableBorders.InsideV = new CDocumentBorder();
        this.TableCellMar.Bottom = new CTableMeasurement(tblwidth_Mm, 0);
        this.TableCellMar.Left = new CTableMeasurement(tblwidth_Mm, 1.9);
        this.TableCellMar.Right = new CTableMeasurement(tblwidth_Mm, 1.9);
        this.TableCellMar.Top = new CTableMeasurement(tblwidth_Mm, 0);
        this.TableCellSpacing = null;
        this.TableInd = 0;
        this.TableW = new CTableMeasurement(tblwidth_Auto, 0);
        this.TableLayout = tbllayout_AutoFit;
    },
    Set_FromObject: function (TablePr) {
        this.TableStyleColBandSize = TablePr.TableStyleColBandSize;
        this.TableStyleRowBandSize = TablePr.TableStyleRowBandSize;
        this.Jc = TablePr.Jc;
        if (undefined != TablePr.Shd) {
            this.Shd = new CDocumentShd();
            this.Shd.Set_FromObject(TablePr.Shd);
        } else {
            this.Shd = undefined;
        }
        if (undefined != TablePr.TableBorders) {
            if (undefined != TablePr.TableBorders.Bottom) {
                this.TableBorders.Bottom = new CDocumentBorder();
                this.TableBorders.Bottom.Set_FromObject(TablePr.TableBorders.Bottom);
            } else {
                this.TableBorders.Bottom = undefined;
            }
            if (undefined != TablePr.TableBorders.Left) {
                this.TableBorders.Left = new CDocumentBorder();
                this.TableBorders.Left.Set_FromObject(TablePr.TableBorders.Left);
            } else {
                this.TableBorders.Left = undefined;
            }
            if (undefined != TablePr.TableBorders.Right) {
                this.TableBorders.Right = new CDocumentBorder();
                this.TableBorders.Right.Set_FromObject(TablePr.TableBorders.Right);
            } else {
                this.TableBorders.Right = undefined;
            }
            if (undefined != TablePr.TableBorders.Top) {
                this.TableBorders.Top = new CDocumentBorder();
                this.TableBorders.Top.Set_FromObject(TablePr.TableBorders.Top);
            } else {
                this.TableBorders.Top = undefined;
            }
            if (undefined != TablePr.TableBorders.InsideH) {
                this.TableBorders.InsideH = new CDocumentBorder();
                this.TableBorders.InsideH.Set_FromObject(TablePr.TableBorders.InsideH);
            } else {
                this.TableBorders.InsideH = undefined;
            }
            if (undefined != TablePr.TableBorders.InsideV) {
                this.TableBorders.InsideV = new CDocumentBorder();
                this.TableBorders.InsideV.Set_FromObject(TablePr.TableBorders.InsideV);
            } else {
                this.TableBorders.InsideV = undefined;
            }
        } else {
            this.TableBorders.Bottom = undefined;
            this.TableBorders.Left = undefined;
            this.TableBorders.Right = undefined;
            this.TableBorders.Top = undefined;
            this.TableBorders.InsideH = undefined;
            this.TableBorders.InsideV = undefined;
        }
        if (undefined != TablePr.TableCellMar) {
            if (undefined != TablePr.TableCellMar.Bottom) {
                this.TableCellMar.Bottom = new CTableMeasurement(TablePr.TableCellMar.Bottom.Type, TablePr.TableCellMar.Bottom.W);
            } else {
                this.TableCellMar.Bottom = undefined;
            }
            if (undefined != TablePr.TableCellMar.Left) {
                this.TableCellMar.Left = new CTableMeasurement(TablePr.TableCellMar.Left.Type, TablePr.TableCellMar.Left.W);
            } else {
                this.TableCellMar.Left = undefined;
            }
            if (undefined != TablePr.TableCellMar.Right) {
                this.TableCellMar.Right = new CTableMeasurement(TablePr.TableCellMar.Right.Type, TablePr.TableCellMar.Right.W);
            } else {
                this.TableCellMar.Right = undefined;
            }
            if (undefined != TablePr.TableCellMar.Top) {
                this.TableCellMar.Top = new CTableMeasurement(TablePr.TableCellMar.Top.Type, TablePr.TableCellMar.Top.W);
            } else {
                this.TableCellMar.Top = undefined;
            }
        } else {
            this.TableCellMar.Bottom = undefined;
            this.TableCellMar.Left = undefined;
            this.TableCellMar.Right = undefined;
            this.TableCellMar.Top = undefined;
        }
        this.TableCellSpacing = TablePr.TableCellSpacing;
        this.TableInd = TablePr.TableInd;
        if (undefined != TablePr.TableW) {
            this.TableW = new CTableMeasurement(TablePr.TableW.Type, TablePr.TableW.W);
        } else {
            this.TableW = undefined;
        }
        this.TableLayout = TablePr.TableLayout;
    },
    Write_ToBinary: function (Writer) {
        var StartPos = Writer.GetCurPosition();
        Writer.Skip(4);
        var Flags = 0;
        if (undefined != this.TableStyleColBandSize) {
            Writer.WriteLong(this.TableStyleColBandSize);
            Flags |= 1;
        }
        if (undefined != this.TableStyleRowBandSize) {
            Writer.WriteLong(this.TableStyleRowBandSize);
            Flags |= 2;
        }
        if (undefined != this.Jc) {
            Writer.WriteLong(this.Jc);
            Flags |= 4;
        }
        if (undefined != this.Shd) {
            this.Shd.Write_ToBinary(Writer);
            Flags |= 8;
        }
        if (undefined != this.TableBorders.Bottom) {
            this.TableBorders.Bottom.Write_ToBinary(Writer);
            Flags |= 16;
        }
        if (undefined != this.TableBorders.Left) {
            this.TableBorders.Left.Write_ToBinary(Writer);
            Flags |= 32;
        }
        if (undefined != this.TableBorders.Right) {
            this.TableBorders.Right.Write_ToBinary(Writer);
            Flags |= 64;
        }
        if (undefined != this.TableBorders.Top) {
            this.TableBorders.Top.Write_ToBinary(Writer);
            Flags |= 128;
        }
        if (undefined != this.TableBorders.InsideH) {
            this.TableBorders.InsideH.Write_ToBinary(Writer);
            Flags |= 256;
        }
        if (undefined != this.TableBorders.InsideV) {
            this.TableBorders.InsideV.Write_ToBinary(Writer);
            Flags |= 512;
        }
        if (undefined != this.TableCellMar.Bottom) {
            this.TableCellMar.Bottom.Write_ToBinary(Writer);
            Flags |= 1024;
        }
        if (undefined != this.TableCellMar.Left) {
            this.TableCellMar.Left.Write_ToBinary(Writer);
            Flags |= 2048;
        }
        if (undefined != this.TableCellMar.Right) {
            this.TableCellMar.Right.Write_ToBinary(Writer);
            Flags |= 4096;
        }
        if (undefined != this.TableCellMar.Top) {
            this.TableCellMar.Top.Write_ToBinary(Writer);
            Flags |= 8192;
        }
        if (undefined != this.TableCellSpacing) {
            if (null === this.TableCellSpacing) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Writer.WriteDouble(this.TableCellSpacing);
            }
            Flags |= 16384;
        }
        if (undefined != this.TableInd) {
            Writer.WriteDouble(this.TableInd);
            Flags |= 32768;
        }
        if (undefined != this.TableW) {
            this.TableW.Write_ToBinary(Writer);
            Flags |= 65536;
        }
        if (undefined != this.TableLayout) {
            Writer.WriteLong(this.TableLayout);
            Flags |= 131072;
        }
        var EndPos = Writer.GetCurPosition();
        Writer.Seek(StartPos);
        Writer.WriteLong(Flags);
        Writer.Seek(EndPos);
    },
    Read_FromBinary: function (Reader) {
        var Flags = Reader.GetLong();
        if (1 & Flags) {
            this.TableStyleColBandSize = Reader.GetLong();
        }
        if (2 & Flags) {
            this.TableStyleRowBandSize = Reader.GetLong();
        }
        if (4 & Flags) {
            this.Jc = Reader.GetLong();
        }
        if (8 & Flags) {
            this.Shd = new CDocumentShd();
            this.Shd.Read_FromBinary(Reader);
        }
        if (16 & Flags) {
            this.TableBorders.Bottom = new CDocumentBorder();
            this.TableBorders.Bottom.Read_FromBinary(Reader);
        }
        if (32 & Flags) {
            this.TableBorders.Left = new CDocumentBorder();
            this.TableBorders.Left.Read_FromBinary(Reader);
        }
        if (64 & Flags) {
            this.TableBorders.Right = new CDocumentBorder();
            this.TableBorders.Right.Read_FromBinary(Reader);
        }
        if (128 & Flags) {
            this.TableBorders.Top = new CDocumentBorder();
            this.TableBorders.Top.Read_FromBinary(Reader);
        }
        if (256 & Flags) {
            this.TableBorders.InsideH = new CDocumentBorder();
            this.TableBorders.InsideH.Read_FromBinary(Reader);
        }
        if (512 & Flags) {
            this.TableBorders.InsideV = new CDocumentBorder();
            this.TableBorders.InsideV.Read_FromBinary(Reader);
        }
        if (1024 & Flags) {
            this.TableCellMar.Bottom = new CTableMeasurement(tblwidth_Auto, 0);
            this.TableCellMar.Bottom.Read_FromBinary(Reader);
        }
        if (2048 & Flags) {
            this.TableCellMar.Left = new CTableMeasurement(tblwidth_Auto, 0);
            this.TableCellMar.Left.Read_FromBinary(Reader);
        }
        if (4096 & Flags) {
            this.TableCellMar.Right = new CTableMeasurement(tblwidth_Auto, 0);
            this.TableCellMar.Right.Read_FromBinary(Reader);
        }
        if (8192 & Flags) {
            this.TableCellMar.Top = new CTableMeasurement(tblwidth_Auto, 0);
            this.TableCellMar.Top.Read_FromBinary(Reader);
        }
        if (16384 & Flags) {
            if (true === Reader.GetBool()) {
                this.TableCellSpacing = null;
            } else {
                this.TableCellSpacing = Reader.GetDouble();
            }
        }
        if (32768 & Flags) {
            this.TableInd = Reader.GetDouble();
        }
        if (65536 & Flags) {
            this.TableW = new CTableMeasurement(tblwidth_Auto, 0);
            this.TableW.Read_FromBinary(Reader);
        }
        if (131072 & Flags) {
            this.TableLayout = Reader.GetLong();
        }
    }
};
function CTableRowHeight(Value, HRule) {
    this.Value = Value;
    this.HRule = HRule;
}
CTableRowHeight.prototype = {
    Copy: function () {
        return new CTableRowHeight(this.Value, this.HRule);
    },
    Write_ToBinary: function (Writer) {
        Writer.WriteDouble(this.Value);
        Writer.WriteLong(this.HRule);
    },
    Read_FromBinary: function (Reader) {
        this.Value = Reader.GetDouble();
        this.HRule = Reader.GetLong();
    }
};
function CTableRowPr() {
    this.CantSplit = undefined;
    this.GridAfter = undefined;
    this.GridBefore = undefined;
    this.Jc = undefined;
    this.TableCellSpacing = undefined;
    this.Height = undefined;
    this.WAfter = undefined;
    this.WBefore = undefined;
    this.TableHeader = undefined;
}
CTableRowPr.prototype = {
    Copy: function () {
        var RowPr = new CTableRowPr();
        RowPr.CantSplit = this.CantSplit;
        RowPr.GridAfter = this.GridAfter;
        RowPr.GridBefore = this.GridBefore;
        RowPr.Jc = this.Jc;
        RowPr.TableCellSpacing = this.TableCellSpacing;
        if (undefined != this.Height) {
            RowPr.Height = this.Height.Copy();
        }
        if (undefined != this.WAfter) {
            RowPr.WAfter = this.WAfter.Copy();
        }
        if (undefined != this.WBefore) {
            RowPr.WBefore = this.WBefore.Copy();
        }
        RowPr.TableHeader = this.TableHeader;
        return RowPr;
    },
    Merge: function (RowPr) {
        if (undefined != RowPr.CantSplit) {
            this.CantSplit = RowPr.CantSplit;
        }
        if (undefined != RowPr.GridAfter) {
            this.GridAfter = RowPr.GridAfter;
        }
        if (undefined != RowPr.GridBefore) {
            this.GridBefore = RowPr.GridBefore;
        }
        if (undefined != RowPr.Jc) {
            this.Jc = RowPr.Jc;
        }
        if (undefined != RowPr.TableCellSpacing) {
            this.TableCellSpacing = RowPr.TableCellSpacing;
        }
        if (undefined != RowPr.Height) {
            this.Height = RowPr.Height.Copy();
        }
        if (undefined != RowPr.WAfter) {
            this.WAfter = RowPr.WAfter.Copy();
        }
        if (undefined != RowPr.WBefore) {
            this.WBefore = RowPr.WBefore.Copy();
        }
        if (undefined != RowPr.TableHeader) {
            this.TableHeader = RowPr.TableHeader;
        }
    },
    Init_Default: function () {
        this.CantSplit = false;
        this.GridAfter = 0;
        this.GridBefore = 0;
        this.Jc = align_Left;
        this.TableCellSpacing = null;
        this.Height = new CTableRowHeight(0, heightrule_Auto);
        this.WAfter = new CTableMeasurement(tblwidth_Auto, 0);
        this.WBefore = new CTableMeasurement(tblwidth_Auto, 0);
        this.TableHeader = false;
    },
    Set_FromObject: function (RowPr) {
        this.CantSplit = RowPr.CantSplit;
        this.GridAfter = RowPr.GridAfter;
        this.GridBefore = RowPr.GridBefore;
        this.Jc = RowPr.Jc;
        this.TableCellSpacing = RowPr.TableCellSpacing;
        if (undefined != RowPr.Height) {
            this.Height = new CTableRowHeight(RowPr.Height.Value, RowPr.Height.HRule);
        } else {
            this.Height = undefined;
        }
        if (undefined != RowPr.WAfter) {
            this.WAfter = new CTableMeasurement(RowPr.WAfter.Type, RowPr.WAfter.W);
        } else {
            this.WAfter = undefined;
        }
        if (undefined != RowPr.WBefore) {
            this.WBefore = new CTableMeasurement(RowPr.WBefore.Type, RowPr.WBefore.W);
        } else {
            this.WBefore = undefined;
        }
        this.TableHeader = RowPr.TableHeader;
    },
    Write_ToBinary: function (Writer) {
        var StartPos = Writer.GetCurPosition();
        Writer.Skip(4);
        var Flags = 0;
        if (undefined != this.CantSplit) {
            Writer.WriteBool(this.CantSplit);
            Flags |= 1;
        }
        if (undefined != this.GridAfter) {
            Writer.WriteLong(this.GridAfter);
            Flags |= 2;
        }
        if (undefined != this.GridBefore) {
            Writer.WriteLong(this.GridBefore);
            Flags |= 4;
        }
        if (undefined != this.Jc) {
            Writer.WriteLong(this.Jc);
            Flags |= 8;
        }
        if (undefined != this.TableCellSpacing) {
            if (null === this.TableCellSpacing) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Writer.WriteDouble(this.TableCellSpacing);
            }
            Flags |= 16;
        }
        if (undefined != this.Height) {
            this.Height.Write_ToBinary(Writer);
            Flags |= 32;
        }
        if (undefined != this.WAfter) {
            this.WAfter.Write_ToBinary(Writer);
            Flags |= 64;
        }
        if (undefined != this.WBefore) {
            this.WBefore.Write_ToBinary(Writer);
            Flags |= 128;
        }
        if (undefined != this.TableHeader) {
            Writer.WriteBool(this.TableHeader);
            Flags |= 256;
        }
        var EndPos = Writer.GetCurPosition();
        Writer.Seek(StartPos);
        Writer.WriteLong(Flags);
        Writer.Seek(EndPos);
    },
    Read_FromBinary: function (Reader) {
        var Flags = Reader.GetLong();
        if (1 & Flags) {
            this.CantSplit = Reader.GetBool();
        }
        if (2 & Flags) {
            this.GridAfter = Reader.GetLong();
        }
        if (4 & Flags) {
            this.GridBefore = Reader.GetLong();
        }
        if (8 & Flags) {
            this.Jc = Reader.GetLong();
        }
        if (16 & Flags) {
            if (true === Reader.GetBool()) {
                this.TableCellSpacing = Reader.GetLong();
            } else {
                this.TableCellSpacing = Reader.GetDouble();
            }
        }
        if (32 & Flags) {
            this.Height = new CTableRowHeight(0, heightrule_Auto);
            this.Height.Read_FromBinary(Reader);
        }
        if (64 & Flags) {
            this.WAfter = new CTableMeasurement(tblwidth_Auto, 0);
            this.WAfter.Read_FromBinary(Reader);
        }
        if (128 & Flags) {
            this.WBefore = new CTableMeasurement(tblwidth_Auto, 0);
            this.WBefore.Read_FromBinary(Reader);
        }
        if (256 & Flags) {
            this.TableHeader = Reader.GetBool();
        }
    }
};
function CTableCellPr() {
    this.GridSpan = undefined;
    this.Shd = undefined;
    this.TableCellMar = undefined;
    this.TableCellBorders = {
        Bottom: undefined,
        Left: undefined,
        Right: undefined,
        Top: undefined
    };
    this.TableCellW = undefined;
    this.VAlign = undefined;
    this.VMerge = undefined;
}
CTableCellPr.prototype = {
    Copy: function () {
        var CellPr = new CTableCellPr();
        CellPr.GridSpan = this.GridSpan;
        if (undefined != this.Shd) {
            CellPr.Shd = this.Shd.Copy();
        }
        if (undefined === this.TableCellMar) {
            CellPr.TableCellMar = undefined;
        } else {
            if (null === this.TableCellMar) {
                CellPr.TableCellMar = null;
            } else {
                CellPr.TableCellMar = new Object();
                CellPr.TableCellMar.Bottom = undefined != this.TableCellMar.Bottom ? this.TableCellMar.Bottom.Copy() : undefined;
                CellPr.TableCellMar.Left = undefined != this.TableCellMar.Left ? this.TableCellMar.Left.Copy() : undefined;
                CellPr.TableCellMar.Right = undefined != this.TableCellMar.Right ? this.TableCellMar.Right.Copy() : undefined;
                CellPr.TableCellMar.Top = undefined != this.TableCellMar.Top ? this.TableCellMar.Top.Copy() : undefined;
            }
        }
        if (undefined != this.TableCellBorders.Bottom) {
            CellPr.TableCellBorders.Bottom = this.TableCellBorders.Bottom.Copy();
        }
        if (undefined != this.TableCellBorders.Left) {
            CellPr.TableCellBorders.Left = this.TableCellBorders.Left.Copy();
        }
        if (undefined != this.TableCellBorders.Right) {
            CellPr.TableCellBorders.Right = this.TableCellBorders.Right.Copy();
        }
        if (undefined != this.TableCellBorders.Top) {
            CellPr.TableCellBorders.Top = this.TableCellBorders.Top.Copy();
        }
        if (undefined != this.TableCellW) {
            CellPr.TableCellW = this.TableCellW.Copy();
        }
        CellPr.VAlign = this.VAlign;
        CellPr.VMerge = this.VMerge;
        return CellPr;
    },
    Merge: function (CellPr) {
        if (undefined != CellPr.GridSpan) {
            this.GridSpan = CellPr.GridSpan;
        }
        if (undefined != CellPr.Shd) {
            this.Shd = CellPr.Shd.Copy();
        }
        if (undefined === CellPr.TableCellMar) {} else {
            if (null === CellPr.TableCellMar) {
                this.TableCellMar = null;
            } else {
                this.TableCellMar = new Object();
                this.TableCellMar.Bottom = undefined != CellPr.TableCellMar.Bottom ? CellPr.TableCellMar.Bottom.Copy() : undefined;
                this.TableCellMar.Left = undefined != CellPr.TableCellMar.Left ? CellPr.TableCellMar.Left.Copy() : undefined;
                this.TableCellMar.Right = undefined != CellPr.TableCellMar.Right ? CellPr.TableCellMar.Right.Copy() : undefined;
                this.TableCellMar.Top = undefined != CellPr.TableCellMar.Top ? CellPr.TableCellMar.Top.Copy() : undefined;
            }
        }
        if (undefined != CellPr.TableCellBorders.Bottom) {
            this.TableCellBorders.Bottom = CellPr.TableCellBorders.Bottom.Copy();
        }
        if (undefined != CellPr.TableCellBorders.Left) {
            this.TableCellBorders.Left = CellPr.TableCellBorders.Left.Copy();
        }
        if (undefined != CellPr.TableCellBorders.Right) {
            this.TableCellBorders.Right = CellPr.TableCellBorders.Right.Copy();
        }
        if (undefined != CellPr.TableCellBorders.Top) {
            this.TableCellBorders.Top = CellPr.TableCellBorders.Top.Copy();
        }
        if (undefined != CellPr.TableCellW) {
            this.TableCellW = CellPr.TableCellW.Copy();
        }
        if (undefined != CellPr.VAlign) {
            this.VAlign = CellPr.VAlign;
        }
        if (undefined != CellPr.VMerge) {
            this.VMerge = CellPr.VMerge;
        }
    },
    Init_Default: function () {
        this.GridSpan = 1;
        this.Shd = new CDocumentShd();
        this.TableCellMar = null;
        this.TableCellBorders.Bottom = undefined;
        this.TableCellBorders.Left = undefined;
        this.TableCellBorders.Right = undefined;
        this.TableCellBorders.Top = undefined;
        this.TableCellW = new CTableMeasurement(tblwidth_Auto, 0);
        this.VAlign = vertalignjc_Top;
        this.VMerge = vmerge_Restart;
    },
    Set_FromObject: function (CellPr) {
        this.GridSpan = CellPr.GridSpan;
        if (undefined != CellPr.Shd) {
            this.Shd = new CDocumentShd();
            this.Shd.Set_FromObject(CellPr.Shd);
        } else {
            this.Shd = undefined;
        }
        if (undefined === CellPr.TableCellMar) {
            this.TableCellMar = undefined;
        } else {
            if (null === CellPr.TableCellMar) {
                this.TableCellMar = null;
            } else {
                this.TableCellMar = new Object();
                if (undefined != CellPr.TableCellMar.Bottom) {
                    this.TableCellMar.Bottom = new CTableMeasurement(CellPr.TableCellMar.Bottom.Type, CellPr.TableCellMar.Bottom.W);
                } else {
                    this.TableCellMar.Bottom = undefined;
                }
                if (undefined != CellPr.TableCellMar.Left) {
                    this.TableCellMar.Left = new CTableMeasurement(CellPr.TableCellMar.Left.Type, CellPr.TableCellMar.Left.W);
                } else {
                    this.TableCellMar.Left = undefined;
                }
                if (undefined != CellPr.TableCellMar.Right) {
                    this.TableCellMar.Right = new CTableMeasurement(CellPr.TableCellMar.Right.Type, CellPr.TableCellMar.Right.W);
                } else {
                    this.TableCellMar.Right = undefined;
                }
                if (undefined != CellPr.TableCellMar.Top) {
                    this.TableCellMar.Top = new CTableMeasurement(CellPr.TableCellMar.Top.Type, CellPr.TableCellMar.Top.W);
                } else {
                    this.TableCellMar.Top = undefined;
                }
            }
        }
        if (undefined != CellPr.TableCellBorders) {
            if (undefined != CellPr.TableCellBorders.Bottom) {
                this.TableCellBorders.Bottom = new CDocumentBorder();
                this.TableCellBorders.Bottom.Set_FromObject(CellPr.TableCellBorders.Bottom);
            } else {
                this.TableCellBorders.Bottom = undefined;
            }
            if (undefined != CellPr.TableCellBorders.Left) {
                this.TableCellBorders.Left = new CDocumentBorder();
                this.TableCellBorders.Left.Set_FromObject(CellPr.TableCellBorders.Left);
            } else {
                this.TableCellBorders.Left = undefined;
            }
            if (undefined != CellPr.TableCellBorders.Right) {
                this.TableCellBorders.Right = new CDocumentBorder();
                this.TableCellBorders.Right.Set_FromObject(CellPr.TableCellBorders.Right);
            } else {
                this.TableCellBorders.Right = undefined;
            }
            if (undefined != CellPr.TableCellBorders.Top) {
                this.TableCellBorders.Top = new CDocumentBorder();
                this.TableCellBorders.Top.Set_FromObject(CellPr.TableCellBorders.Top);
            } else {
                this.TableCellBorders.Top = undefined;
            }
        } else {
            this.TableCellBorders.Bottom = undefined;
            this.TableCellBorders.Left = undefined;
            this.TableCellBorders.Right = undefined;
            this.TableCellBorders.Top = undefined;
        }
        if (undefined != this.TableCellW) {
            this.TableCellW = new CTableMeasurement(CellPr.TableCellW.Type, CellPr.TableCellW.W);
        } else {
            this.TableCellW = undefined;
        }
        this.VAlign = CellPr.VAlign;
        this.VMerge = CellPr.VMerge;
    },
    Write_ToBinary: function (Writer) {
        var StartPos = Writer.GetCurPosition();
        Writer.Skip(4);
        var Flags = 0;
        if (undefined != this.GridSpan) {
            Writer.WriteLong(this.GridSpan);
            Flags |= 1;
        }
        if (undefined != this.Shd) {
            this.Shd.Write_ToBinary(Writer);
            Flags |= 2;
        }
        if (undefined != this.TableCellMar) {
            if (null === this.TableCellMar) {
                Flags |= 4;
            } else {
                if (undefined != this.TableCellMar.Bottom) {
                    this.TableCellMar.Bottom.Write_ToBinary(Writer);
                    Flags |= 8;
                }
                if (undefined != this.TableCellMar.Left) {
                    this.TableCellMar.Left.Write_ToBinary(Writer);
                    Flags |= 16;
                }
                if (undefined != this.TableCellMar.Right) {
                    this.TableCellMar.Right.Write_ToBinary(Writer);
                    Flags |= 32;
                }
                if (undefined != this.TableCellMar.Top) {
                    this.TableCellMar.Top.Write_ToBinary(Writer);
                    Flags |= 64;
                }
                Flags |= 128;
            }
        }
        if (undefined != this.TableCellBorders.Bottom) {
            this.TableCellBorders.Bottom.Write_ToBinary(Writer);
            Flags |= 256;
        }
        if (undefined != this.TableCellBorders.Left) {
            this.TableCellBorders.Left.Write_ToBinary(Writer);
            Flags |= 512;
        }
        if (undefined != this.TableCellBorders.Right) {
            this.TableCellBorders.Right.Write_ToBinary(Writer);
            Flags |= 1024;
        }
        if (undefined != this.TableCellBorders.Top) {
            this.TableCellBorders.Top.Write_ToBinary(Writer);
            Flags |= 2048;
        }
        if (undefined != this.TableCellW) {
            this.TableCellW.Write_ToBinary(Writer);
            Flags |= 4096;
        }
        if (undefined != this.VAlign) {
            Writer.WriteLong(this.VAlign);
            Flags |= 8192;
        }
        if (undefined != this.VMerge) {
            Writer.WriteLong(this.VMerge);
            Flags |= 16384;
        }
        var EndPos = Writer.GetCurPosition();
        Writer.Seek(StartPos);
        Writer.WriteLong(Flags);
        Writer.Seek(EndPos);
    },
    Read_FromBinary: function (Reader) {
        var Flags = Reader.GetLong();
        if (1 & Flags) {
            this.GridSpan = Reader.GetLong();
        }
        if (2 & Flags) {
            this.Shd = new CDocumentShd();
            this.Shd.Read_FromBinary(Reader);
        }
        if (4 & Flags) {
            this.TableCellMar = null;
        } else {
            if (128 & Flags) {
                this.TableCellMar = new Object();
                if (8 & Flags) {
                    this.TableCellMar.Bottom = new CTableMeasurement(tblwidth_Auto, 0);
                    this.TableCellMar.Bottom.Read_FromBinary(Reader);
                }
                if (16 & Flags) {
                    this.TableCellMar.Left = new CTableMeasurement(tblwidth_Auto, 0);
                    this.TableCellMar.Left.Read_FromBinary(Reader);
                }
                if (32 & Flags) {
                    this.TableCellMar.Right = new CTableMeasurement(tblwidth_Auto, 0);
                    this.TableCellMar.Right.Read_FromBinary(Reader);
                }
                if (64 & Flags) {
                    this.TableCellMar.Top = new CTableMeasurement(tblwidth_Auto, 0);
                    this.TableCellMar.Top.Read_FromBinary(Reader);
                }
            }
        }
        if (256 & Flags) {
            this.TableCellBorders.Bottom = new CDocumentBorder();
            this.TableCellBorders.Bottom.Read_FromBinary(Reader);
        }
        if (512 & Flags) {
            this.TableCellBorders.Left = new CDocumentBorder();
            this.TableCellBorders.Left.Read_FromBinary(Reader);
        }
        if (1024 & Flags) {
            this.TableCellBorders.Right = new CDocumentBorder();
            this.TableCellBorders.Right.Read_FromBinary(Reader);
        }
        if (2048 & Flags) {
            this.TableCellBorders.Top = new CDocumentBorder();
            this.TableCellBorders.Top.Read_FromBinary(Reader);
        }
        if (4096 & Flags) {
            this.TableCellW = new CTableMeasurement(tblwidth_Auto, 0);
            this.TableCellW.Read_FromBinary(Reader);
        }
        if (8192 & Flags) {
            this.VAlign = Reader.GetLong();
        }
        if (16384 & Flags) {
            this.VMerge = Reader.GetLong();
        }
    }
};
function CRFonts() {
    this.Ascii = undefined;
    this.EastAsia = undefined;
    this.HAnsi = undefined;
    this.CS = undefined;
    this.Hint = undefined;
}
CRFonts.prototype = {
    Set_All: function (FontName, FontIndex) {
        this.Ascii = {
            Name: FontName,
            Index: FontIndex
        };
        this.EastAsia = {
            Name: FontName,
            Index: FontIndex
        };
        this.HAnsi = {
            Name: FontName,
            Index: FontIndex
        };
        this.CS = {
            Name: FontName,
            Index: FontIndex
        };
        this.Hint = fonthint_Default;
    },
    Copy: function () {
        var RFonts = new CRFonts();
        RFonts.Ascii = this.Ascii;
        RFonts.EastAsia = this.EastAsia;
        RFonts.HAnsi = this.HAnsi;
        RFonts.CS = this.CS;
        RFonts.Hint = this.Hint;
        return RFonts;
    },
    Merge: function (RFonts) {
        if (undefined !== RFonts.Ascii) {
            this.Ascii = RFonts.Ascii;
        }
        if (undefined != RFonts.EastAsia) {
            this.EastAsia = RFonts.EastAsia;
        }
        if (undefined != RFonts.HAnsi) {
            this.HAnsi = RFonts.HAnsi;
        }
        if (undefined != RFonts.CS) {
            this.CS = RFonts.CS;
        }
        if (undefined != RFonts.Hint) {
            this.Hint = RFonts.Hint;
        }
    },
    Init_Default: function () {
        this.Ascii = {
            Name: "Arial",
            Index: -1
        };
        this.EastAsia = {
            Name: "Arial",
            Index: -1
        };
        this.HAnsi = {
            Name: "Arial",
            Index: -1
        };
        this.CS = {
            Name: "Arial",
            Index: -1
        };
        this.Hint = fonthint_Default;
    },
    Set_FromObject: function (RFonts) {
        if (undefined != RFonts.Ascii) {
            this.Ascii = {
                Name: RFonts.Ascii.Name,
                Index: RFonts.Ascii.Index
            };
        } else {
            this.Ascii = undefined;
        }
        if (undefined != RFonts.EastAsia) {
            this.EastAsia = {
                Name: RFonts.EastAsia.Name,
                Index: RFonts.EastAsia.Index
            };
        } else {
            this.EastAsia = undefined;
        }
        if (undefined != RFonts.HAnsi) {
            this.HAnsi = {
                Name: RFonts.HAnsi.Name,
                Index: RFonts.HAnsi.Index
            };
        } else {
            this.HAnsi = undefined;
        }
        if (undefined != RFonts.CS) {
            this.CS = {
                Name: RFonts.CS.Name,
                Index: RFonts.CS.Index
            };
        } else {
            this.CS = undefined;
        }
        this.Hint = RFonts.Hint;
    },
    Compare: function (RFonts) {
        var Result_RFonts = new CRFonts();
        if (undefined != this.Ascii && undefined != RFonts.Ascii && this.Ascii.Name === RFonts.Ascii.Name) {
            Result_RFonts.Ascii = {};
            Result_RFonts.Ascii.Name = RFonts.Ascii.Name;
            Result_RFonts.Ascii.Index = -1;
        }
        if (undefined != this.EastAsia && undefined != RFonts.EastAsia && this.EastAsia.Name === RFonts.EastAsia.Name) {
            Result_RFonts.EastAsia = {};
            Result_RFonts.EastAsia.Name = RFonts.EastAsia.Name;
            Result_RFonts.EastAsia.Index = -1;
        }
        if (undefined != this.HAnsi && undefined != RFonts.HAnsi && this.HAnsi.Name === RFonts.HAnsi.Name) {
            Result_RFonts.HAnsi = {};
            Result_RFonts.HAnsi.Name = RFonts.HAnsi.Name;
            Result_RFonts.HAnsi.Index = -1;
        }
        if (undefined != this.CS && undefined != RFonts.CS && this.CS.Name === RFonts.CS.Name) {
            Result_RFonts.CS = {};
            Result_RFonts.CS.Name = RFonts.CS.Name;
            Result_RFonts.CS.Index = -1;
        }
        if (this.Hint === RFonts.Hint) {
            Result_RFonts.Hint = RFonts.Hint;
        }
        return Result_RFonts;
    },
    Write_ToBinary: function (Writer) {
        var StartPos = Writer.GetCurPosition();
        Writer.Skip(4);
        var Flags = 0;
        if (undefined != this.Ascii) {
            Writer.WriteString2(this.Ascii.Name);
            Flags |= 1;
        }
        if (undefined != this.EastAsia) {
            Writer.WriteString2(this.EastAsia.Name);
            Flags |= 2;
        }
        if (undefined != this.HAnsi) {
            Writer.WriteString2(this.HAnsi.Name);
            Flags |= 4;
        }
        if (undefined != this.CS) {
            Writer.WriteString2(this.CS.Name);
            Flags |= 8;
        }
        if (undefined != this.Hint) {
            Writer.WriteLong(this.Hint);
            Flags |= 16;
        }
        var EndPos = Writer.GetCurPosition();
        Writer.Seek(StartPos);
        Writer.WriteLong(Flags);
        Writer.Seek(EndPos);
    },
    Read_FromBinary: function (Reader) {
        var Flags = Reader.GetLong();
        if (Flags & 1) {
            this.Ascii = {
                Name: Reader.GetString2(),
                Index: -1
            };
        }
        if (Flags & 2) {
            this.EastAsia = {
                Name: Reader.GetString2(),
                Index: -1
            };
        }
        if (Flags & 4) {
            this.HAnsi = {
                Name: Reader.GetString2(),
                Index: -1
            };
        }
        if (Flags & 8) {
            this.CS = {
                Name: Reader.GetString2(),
                Index: -1
            };
        }
        if (Flags & 16) {
            this.Hint = Reader.GetLong();
        }
    }
};
function CLang() {
    this.Bidi = undefined;
    this.EastAsia = undefined;
    this.Val = undefined;
}
CLang.prototype = {
    Copy: function () {
        var Lang = new CLang();
        Lang.Bidi = this.Bidi;
        Lang.EastAsia = this.EastAsia;
        Lang.Val = this.Val;
        return Lang;
    },
    Merge: function (Lang) {
        if (undefined !== Lang.Bidi) {
            this.Bidi = Lang.Bidi;
        }
        if (undefined !== Lang.EastAsia) {
            this.EastAsia = Lang.EastAsia;
        }
        if (undefined !== Lang.Val) {
            this.Val = Lang.Val;
        }
    },
    Init_Default: function () {
        this.Bidi = lcid_enUS;
        this.EastAsia = lcid_enUS;
        this.Val = lcid_enUS;
    },
    Set_FromObject: function (Lang) {
        this.Bidi = Lang.Bidi;
        this.EastAsia = Lang.EastAsia;
        this.Val = Lang.Val;
    },
    Compare: function (Lang) {
        var Result_Lang = new CLang();
        if (this.Bidi === Lang.Bidi) {
            Result_Lang.Bidi = Lang.Bidi;
        }
        if (this.EastAsia === Lang.EastAsia) {
            Result_Lang.EastAsia = Lang.EastAsia;
        }
        if (this.Val === Lang.Val) {
            Result_Lang.Val = Lang.Val;
        }
        return Result_Lang;
    },
    Write_ToBinary: function (Writer) {
        var StartPos = Writer.GetCurPosition();
        Writer.Skip(4);
        var Flags = 0;
        if (undefined != this.Bidi) {
            Writer.WriteLong(this.Bidi);
            Flags |= 1;
        }
        if (undefined != this.EastAsia) {
            Writer.WriteLong(this.EastAsia);
            Flags |= 2;
        }
        if (undefined != this.Val) {
            Writer.WriteLong(this.Val);
            Flags |= 4;
        }
        var EndPos = Writer.GetCurPosition();
        Writer.Seek(StartPos);
        Writer.WriteLong(Flags);
        Writer.Seek(EndPos);
    },
    Read_FromBinary: function (Reader) {
        var Flags = Reader.GetLong();
        if (Flags & 1) {
            this.Bidi = Reader.GetLong();
        }
        if (Flags & 2) {
            this.EastAsia = Reader.GetLong();
        }
        if (Flags & 4) {
            this.Val = Reader.GetLong();
        }
    }
};
function CTextPr() {
    this.Bold = undefined;
    this.Italic = undefined;
    this.Strikeout = undefined;
    this.Underline = undefined;
    this.FontFamily = undefined;
    this.FontSize = undefined;
    this.Color = undefined;
    this.VertAlign = undefined;
    this.HighLight = undefined;
    this.RStyle = undefined;
    this.Spacing = undefined;
    this.DStrikeout = undefined;
    this.Caps = undefined;
    this.SmallCaps = undefined;
    this.Position = undefined;
    this.RFonts = new CRFonts();
    this.BoldCS = undefined;
    this.ItalicCS = undefined;
    this.FontSizeCS = undefined;
    this.CS = undefined;
    this.RTL = undefined;
    this.Lang = new CLang();
}
CTextPr.prototype = {
    Clear: function () {
        this.Bold = undefined;
        this.Italic = undefined;
        this.Strikeout = undefined;
        this.Underline = undefined;
        this.FontFamily = undefined;
        this.FontSize = undefined;
        this.Color = undefined;
        this.VertAlign = undefined;
        this.HighLight = undefined;
        this.RStyle = undefined;
        this.Spacing = undefined;
        this.DStrikeout = undefined;
        this.Caps = undefined;
        this.SmallCaps = undefined;
        this.Position = undefined;
        this.RFonts = new CRFonts();
        this.BoldCS = undefined;
        this.ItalicCS = undefined;
        this.FontSizeCS = undefined;
        this.CS = undefined;
        this.RTL = undefined;
        this.Lang = new CLang();
    },
    Copy: function () {
        var TextPr = new CTextPr();
        TextPr.Bold = this.Bold;
        TextPr.Italic = this.Italic;
        TextPr.Strikeout = this.Strikeout;
        TextPr.Underline = this.Underline;
        if (undefined != this.FontFamily) {
            TextPr.FontFamily = new Object();
            TextPr.FontFamily.Name = this.FontFamily.Name;
            TextPr.FontFamily.Index = this.FontFamily.Index;
        }
        TextPr.FontSize = this.FontSize;
        if (undefined != this.Color) {
            TextPr.Color = new CDocumentColor(this.Color.r, this.Color.g, this.Color.b);
        }
        TextPr.VertAlign = this.VertAlign;
        if (undefined === this.HighLight) {
            TextPr.HighLight = undefined;
        } else {
            if (highlight_None === this.HighLight) {
                TextPr.HighLight = highlight_None;
            } else {
                TextPr.HighLight = this.HighLight.Copy();
            }
        }
        TextPr.RStyle = this.RStyle;
        TextPr.Spacing = this.Spacing;
        TextPr.DStrikeout = this.DStrikeout;
        TextPr.Caps = this.Caps;
        TextPr.SmallCaps = this.SmallCaps;
        TextPr.Position = this.Position;
        TextPr.RFonts = this.RFonts.Copy();
        TextPr.BoldCS = this.BoldCS;
        TextPr.ItalicCS = this.ItalicCS;
        TextPr.FontSizeCS = this.FontSizeCS;
        TextPr.CS = this.CS;
        TextPr.RTL = this.RTL;
        TextPr.Lang = this.Lang.Copy();
        return TextPr;
    },
    Merge: function (TextPr) {
        if (undefined != TextPr.Bold) {
            this.Bold = TextPr.Bold;
        }
        if (undefined != TextPr.Italic) {
            this.Italic = TextPr.Italic;
        }
        if (undefined != TextPr.Strikeout) {
            this.Strikeout = TextPr.Strikeout;
        }
        if (undefined != TextPr.Underline) {
            this.Underline = TextPr.Underline;
        }
        if (undefined != TextPr.FontFamily) {
            this.FontFamily = new Object();
            this.FontFamily.Name = TextPr.FontFamily.Name;
            this.FontFamily.Index = TextPr.FontFamily.Index;
        }
        if (undefined != TextPr.FontSize) {
            this.FontSize = TextPr.FontSize;
        }
        if (undefined != TextPr.Color) {
            this.Color = TextPr.Color.Copy();
        }
        if (undefined != TextPr.VertAlign) {
            this.VertAlign = TextPr.VertAlign;
        }
        if (undefined === TextPr.HighLight) {} else {
            if (highlight_None === TextPr.HighLight) {
                this.HighLight = highlight_None;
            } else {
                this.HighLight = TextPr.HighLight.Copy();
            }
        }
        if (undefined != TextPr.RStyle) {
            this.RStyle = TextPr.RStyle;
        }
        if (undefined != TextPr.Spacing) {
            this.Spacing = TextPr.Spacing;
        }
        if (undefined != TextPr.DStrikeout) {
            this.DStrikeout = TextPr.DStrikeout;
        }
        if (undefined != TextPr.SmallCaps) {
            this.SmallCaps = TextPr.SmallCaps;
        }
        if (undefined != TextPr.Caps) {
            this.Caps = TextPr.Caps;
        }
        if (undefined != TextPr.Position) {
            this.Position = TextPr.Position;
        }
        this.RFonts.Merge(TextPr.RFonts);
        if (undefined != TextPr.BoldCS) {
            this.BoldCS = TextPr.BoldCS;
        }
        if (undefined != TextPr.ItalicCS) {
            this.ItalicCS = TextPr.ItalicCS;
        }
        if (undefined != TextPr.FontSizeCS) {
            this.FontSizeCS = TextPr.FontSizeCS;
        }
        if (undefined != TextPr.CS) {
            this.CS = TextPr.CS;
        }
        if (undefined != TextPr.RTL) {
            this.RTL = TextPr.RTL;
        }
        this.Lang.Merge(TextPr.Lang);
    },
    Init_Default: function () {
        this.Bold = false;
        this.Italic = false;
        this.Underline = false;
        this.Strikeout = false;
        this.FontFamily = {
            Name: "Arial",
            Index: -1
        };
        this.FontSize = 11;
        this.Color = new CDocumentColor(0, 0, 0);
        this.VertAlign = vertalign_Baseline;
        this.HighLight = highlight_None;
        this.RStyle = undefined;
        this.Spacing = 0;
        this.DStrikeout = false;
        this.SmallCaps = false;
        this.Caps = false;
        this.Position = 0;
        this.RFonts.Init_Default();
        this.BoldCS = false;
        this.ItalicCS = false;
        this.FontSizeCS = 11;
        this.CS = false;
        this.RTL = false;
        this.Lang.Init_Default();
    },
    Set_FromObject: function (TextPr) {
        this.Bold = TextPr.Bold;
        this.Italic = TextPr.Italic;
        this.Strikeout = TextPr.Strikeout;
        this.Underline = TextPr.Underline;
        if (undefined != TextPr.FontFamily) {
            this.FontFamily = new Object();
            this.FontFamily.Name = TextPr.FontFamily.Name;
            this.FontFamily.Index = TextPr.FontFamily.Index;
        } else {
            this.FontFamily = undefined;
        }
        this.FontSize = TextPr.FontSize;
        if (undefined != TextPr.Color) {
            this.Color = new CDocumentColor(TextPr.Color.r, TextPr.Color.g, TextPr.Color.b);
        } else {
            this.Color = undefined;
        }
        this.VertAlign = TextPr.VertAlign;
        if (undefined === TextPr.HighLight) {
            this.HighLight = undefined;
        } else {
            if (highlight_None === TextPr.HighLight) {
                this.HighLight = highlight_None;
            } else {
                this.HighLight = new CDocumentColor(TextPr.HighLight.r, TextPr.HighLight.g, TextPr.HighLight.b);
            }
        }
        if (undefined != TextPr.RStyle) {
            this.RStyle = TextPr.RStyle;
        }
        this.Spacing = TextPr.Spacing;
        this.DStrikeout = TextPr.DStrikeout;
        this.Caps = TextPr.Caps;
        this.SmallCaps = TextPr.SmallCaps;
        this.Position = TextPr.Position;
        if (undefined != TextPr.RFonts) {
            this.RFonts.Set_FromObject(TextPr.RFonts);
        }
        this.BoldCS = TextPr.BoldCS;
        this.ItalicCS = TextPr.ItalicCS;
        this.FontSizeCS = TextPr.FontSizeCS;
        this.CS = TextPr.CS;
        this.RTL = TextPr.RTL;
        if (undefined != TextPr.Lang) {
            this.Lang.Set_FromObject(TextPr.Lang);
        }
    },
    Compare: function (TextPr) {
        var Result_TextPr = new CTextPr();
        if (this.Bold === TextPr.Bold) {
            Result_TextPr.Bold = TextPr.Bold;
        }
        if (this.Italic === TextPr.Italic) {
            Result_TextPr.Italic = TextPr.Italic;
        }
        if (this.Strikeout === TextPr.Strikeout) {
            Result_TextPr.Strikeout = TextPr.Strikeout;
        }
        if (this.Underline === TextPr.Underline) {
            Result_TextPr.Underline = TextPr.Underline;
        }
        if (undefined != this.FontFamily && undefined != TextPr.FontFamily && this.FontFamily.Name === TextPr.FontFamily.Name) {
            Result_TextPr.FontFamily = {};
            Result_TextPr.FontFamily.Name = TextPr.FontFamily.Name;
            Result_TextPr.FontFamily.Index = -1;
        }
        if (undefined != this.FontSize && undefined != TextPr.FontSize && Math.abs(this.FontSize - TextPr.FontSize) < 0.001) {
            Result_TextPr.FontSize = TextPr.FontSize;
        }
        if (undefined != this.Color && undefined != TextPr.Color && true === this.Color.Compare(TextPr.Color)) {
            Result_TextPr.Color = new CDocumentColor(TextPr.Color.r, TextPr.Color.g, TextPr.Color.b);
        }
        if (this.VertAlign === TextPr.VertAlign) {
            Result_TextPr.VertAlign = TextPr.VertAlign;
        }
        if (undefined != this.HighLight && undefined != TextPr.HighLight) {
            if (highlight_None === this.HighLight && highlight_None === TextPr.HighLight) {
                Result_TextPr.HighLight = highlight_None;
            } else {
                if (highlight_None != this.HighLight && highlight_None != TextPr.HighLight && this.HighLight.Compare(TextPr.HighLight)) {
                    Result_TextPr.HighLight = new CDocumentColor(TextPr.HighLight.r, TextPr.HighLight.g, TextPr.HighLight.b);
                }
            }
        }
        if (undefined != this.RStyle && undefined != TextPr.RStyle && this.RStyle === TextPr.RStyle) {
            Result_TextPr.RStyle = TextPr.RStyle;
        }
        if (undefined != this.Spacing && undefined != TextPr.Spacing && Math.abs(this.Spacing - TextPr.Spacing) < 0.001) {
            Result_TextPr.Spacing = TextPr.Spacing;
        }
        if (undefined != this.DStrikeout && undefined != TextPr.DStrikeout && this.DStrikeout === TextPr.DStrikeout) {
            Result_TextPr.DStrikeout = TextPr.DStrikeout;
        }
        if (undefined != this.Caps && undefined != TextPr.Caps && this.Caps === TextPr.Caps) {
            Result_TextPr.Caps = TextPr.Caps;
        }
        if (undefined != this.SmallCaps && undefined != TextPr.SmallCaps && this.SmallCaps === TextPr.SmallCaps) {
            Result_TextPr.SmallCaps = TextPr.SmallCaps;
        }
        if (undefined != this.Position && undefined != TextPr.Position && Math.abs(this.Position - TextPr.Position) < 0.001) {
            Result_TextPr.Position = TextPr.Position;
        }
        Result_TextPr.RFonts = this.RFonts.Compare(TextPr.RFonts);
        if (this.BoldCS === TextPr.BoldCS) {
            Result_TextPr.BoldCS = TextPr.BoldCS;
        }
        if (this.ItalicCS === TextPr.ItalicCS) {
            Result_TextPr.ItalicCS = TextPr.ItalicCS;
        }
        if (undefined != this.FontSizeCS && undefined != TextPr.FontSizeCS && Math.abs(this.FontSizeCS - TextPr.FontSizeCS) < 0.001) {
            Result_TextPr.FontSizeCS = TextPr.FontSizeCS;
        }
        if (this.CS === TextPr.CS) {
            Result_TextPr.CS = TextPr.CS;
        }
        if (this.RTL === TextPr.RTL) {
            Result_TextPr.RTL = TextPr.RTL;
        }
        Result_TextPr.Lang = this.Lang.Compare(TextPr.Lang);
        return Result_TextPr;
    },
    Write_ToBinary: function (Writer) {
        var StartPos = Writer.GetCurPosition();
        Writer.Skip(4);
        var Flags = 0;
        if (undefined != this.Bold) {
            Writer.WriteBool(this.Bold);
            Flags |= 1;
        }
        if (undefined != this.Italic) {
            Writer.WriteBool(this.Italic);
            Flags |= 2;
        }
        if (undefined != this.Underline) {
            Writer.WriteBool(this.Underline);
            Flags |= 4;
        }
        if (undefined != this.Strikeout) {
            Writer.WriteBool(this.Strikeout);
            Flags |= 8;
        }
        if (undefined != this.FontFamily) {
            Writer.WriteString2(this.FontFamily.Name);
            Flags |= 16;
        }
        if (undefined != this.FontSize) {
            Writer.WriteDouble(this.FontSize);
            Flags |= 32;
        }
        if (undefined != this.Color) {
            this.Color.Write_ToBinary(Writer);
            Flags |= 64;
        }
        if (undefined != this.VertAlign) {
            Writer.WriteLong(this.VertAlign);
            Flags |= 128;
        }
        if (undefined != this.HighLight) {
            if (highlight_None === this.HighLight) {
                Writer.WriteLong(highlight_None);
            } else {
                Writer.WriteLong(0);
                this.HighLight.Write_ToBinary(Writer);
            }
            Flags |= 256;
        }
        if (undefined != this.RStyle) {
            Writer.WriteString2(this.RStyle);
            Flags |= 512;
        }
        if (undefined != this.Spacing) {
            Writer.WriteDouble(this.Spacing);
            Flags |= 1024;
        }
        if (undefined != this.DStrikeout) {
            Writer.WriteBool(this.DStrikeout);
            Flags |= 2048;
        }
        if (undefined != this.Caps) {
            Writer.WriteBool(this.Caps);
            Flags |= 4096;
        }
        if (undefined != this.SmallCaps) {
            Writer.WriteBool(this.SmallCaps);
            Flags |= 8192;
        }
        if (undefined != this.Position) {
            Writer.WriteDouble(this.Position);
            Flags |= 16384;
        }
        if (undefined != this.RFonts) {
            this.RFonts.Write_ToBinary(Writer);
            Flags |= 32768;
        }
        if (undefined != this.BoldCS) {
            Writer.WriteBool(this.BoldCS);
            Flags |= 65536;
        }
        if (undefined != this.ItalicCS) {
            Writer.WriteBool(this.ItalicCS);
            Flags |= 131072;
        }
        if (undefined != this.FontSizeCS) {
            Writer.WriteDouble(this.FontSizeCS);
            Flags |= 262144;
        }
        if (undefined != this.CS) {
            Writer.WriteBool(this.CS);
            Flags |= 524288;
        }
        if (undefined != this.RTL) {
            Writer.WriteBool(this.RTL);
            Flags |= 1048576;
        }
        if (undefined != this.Lang) {
            this.Lang.Write_ToBinary(Writer);
            Flags |= 2097152;
        }
        Writer.WriteBool(false);
        var EndPos = Writer.GetCurPosition();
        Writer.Seek(StartPos);
        Writer.WriteLong(Flags);
        Writer.Seek(EndPos);
    },
    Read_FromBinary: function (Reader) {
        var Flags = Reader.GetLong();
        if (Flags & 1) {
            this.Bold = Reader.GetBool();
        }
        if (Flags & 2) {
            this.Italic = Reader.GetBool();
        }
        if (Flags & 4) {
            this.Underline = Reader.GetBool();
        }
        if (Flags & 8) {
            this.Strikeout = Reader.GetBool();
        }
        if (Flags & 16) {
            this.FontFamily = {
                Name: Reader.GetString2(),
                Index: -1
            };
        }
        if (Flags & 32) {
            this.FontSize = Reader.GetDouble();
        }
        if (Flags & 64) {
            this.Color = new CDocumentColor(0, 0, 0);
            this.Color.Read_FromBinary(Reader);
        }
        if (Flags & 128) {
            this.VertAlign = Reader.GetLong();
        }
        if (Flags & 256) {
            var HL_type = Reader.GetLong();
            if (highlight_None == HL_type) {
                this.HighLight = highlight_None;
            } else {
                this.HighLight = new CDocumentColor(0, 0, 0);
                this.HighLight.Read_FromBinary(Reader);
            }
        }
        if (Flags & 512) {
            this.RStyle = Reader.GetString2();
        }
        if (Flags & 1024) {
            this.Spacing = Reader.GetDouble();
        }
        if (Flags & 2048) {
            this.DStrikeout = Reader.GetBool();
        }
        if (Flags & 4096) {
            this.Caps = Reader.GetBool();
        }
        if (Flags & 8192) {
            this.SmallCaps = Reader.GetBool();
        }
        if (Flags & 16384) {
            this.Position = Reader.GetDouble();
        }
        if (Flags & 32768) {
            this.RFonts.Read_FromBinary(Reader);
        }
        if (Flags & 65536) {
            this.BoldCS = Reader.GetBool();
        }
        if (Flags & 131072) {
            this.ItalicCS = Reader.GetBool();
        }
        if (Flags & 262144) {
            this.FontSizeCS = Reader.GetDouble();
        }
        if (Flags & 524288) {
            this.CS = Reader.GetBool();
        }
        if (Flags & 1048576) {
            this.RTL = Reader.GetBool();
        }
        if (Flags & 2097152) {
            this.Lang.Read_FromBinary(Reader);
        }
        Reader.GetBool();
    },
    Check_NeedRecalc: function () {
        return true;
        if (undefined != this.Bold) {
            return true;
        }
        if (undefined != this.Italic) {
            return true;
        }
        if (undefined != this.FontFamily) {
            return true;
        }
        if (undefined != this.FontSize) {
            return true;
        }
        if (undefined != this.VertAlign) {
            return true;
        }
        if (undefined != this.Spacing) {
            return true;
        }
        if (undefined != this.Caps) {
            return true;
        }
        if (undefined != this.SmallCaps) {
            return true;
        }
        if (undefined != this.Position) {
            return true;
        }
        if (undefined != this.RFonts.Ascii) {
            return true;
        }
        if (undefined != this.RFonts.EastAsia) {
            return true;
        }
        if (undefined != this.RFonts.HAnsi) {
            return true;
        }
        if (undefined != this.RFonts.CS) {
            return true;
        }
        if (undefined != this.RTL || undefined != this.CS || undefined != this.BoldCS || undefined != this.ItalicCS || undefined != this.FontSizeCS) {
            return true;
        }
        if (undefined != this.Lang.Val) {
            return true;
        }
        if (undefined != this.Color) {
            return true;
        }
        if (undefined != this.HighLight) {
            return true;
        }
        return false;
    },
    Get_FontKoef: function () {
        var dFontKoef = 1;
        switch (this.VertAlign) {
        case vertalign_Baseline:
            dFontKoef = 1;
            break;
        case vertalign_SubScript:
            case vertalign_SuperScript:
            dFontKoef = vertalign_Koef_Size;
            break;
        }
        return dFontKoef;
    },
    Document_Get_AllFontNames: function (AllFonts) {
        if (undefined != this.RFonts.Ascii) {
            AllFonts[this.RFonts.Ascii.Name] = true;
        }
        if (undefined != this.RFonts.HAnsi) {
            AllFonts[this.RFonts.HAnsi.Name] = true;
        }
        if (undefined != this.RFonts.EastAsia) {
            AllFonts[this.RFonts.EastAsia.Name] = true;
        }
        if (undefined != this.RFonts.CS) {
            AllFonts[this.RFonts.CS.Name] = true;
        }
    },
    Document_CreateFontMap: function (FontMap) {
        var Style = (true === this.Bold ? 1 : 0) + (true === this.Italic ? 2 : 0);
        var StyleCS = (true === this.BoldCS ? 1 : 0) + (true === this.ItalicCS ? 2 : 0);
        var Size = this.FontSize;
        var SizeCS = this.FontSizeCS;
        var RFonts = this.RFonts;
        if (undefined != RFonts.Ascii) {
            var Key = "" + RFonts.Ascii.Name + "_" + Style + "_" + Size;
            FontMap[Key] = {
                Name: RFonts.Ascii.Name,
                Style: Style,
                Size: Size
            };
        }
        if (undefined != RFonts.EastAsia) {
            var Key = "" + RFonts.EastAsia.Name + "_" + Style + "_" + Size;
            FontMap[Key] = {
                Name: RFonts.EastAsia.Name,
                Style: Style,
                Size: Size
            };
        }
        if (undefined != RFonts.HAnsi) {
            var Key = "" + RFonts.HAnsi.Name + "_" + Style + "_" + Size;
            FontMap[Key] = {
                Name: RFonts.HAnsi.Name,
                Style: Style,
                Size: Size
            };
        }
        if (undefined != RFonts.CS) {
            var Key = "" + RFonts.CS.Name + "_" + StyleCS + "_" + SizeCS;
            FontMap[Key] = {
                Name: RFonts.CS.Name,
                Style: StyleCS,
                Size: SizeCS
            };
        }
    },
    isEqual: function (TextPrOld, TextPrNew) {
        if (TextPrOld == undefined || TextPrNew == undefined) {
            return false;
        }
        for (var TextPr in TextPrOld) {
            if (typeof TextPrOld[TextPr] == "object") {
                this.isEqual(TextPrOld[TextPr], TextPrNew[TextPr]);
            } else {
                if (typeof TextPrOld[TextPr] == "number" && typeof TextPrNew[TextPr] == "number") {
                    if (Math.abs(TextPrOld[TextPr] - TextPrNew[TextPr]) > 0.001) {
                        return false;
                    }
                } else {
                    if (TextPrOld[TextPr] != TextPrNew[TextPr]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
};
function CParaTab(Value, Pos) {
    this.Value = Value;
    this.Pos = Pos;
}
CParaTab.prototype = {
    Copy: function () {
        return new CParaTab(this.Value, this.Pos);
    }
};
function CParaTabs() {
    this.Tabs = new Array();
}
CParaTabs.prototype = {
    Add: function (_Tab) {
        var Index = 0;
        for (Index = 0; Index < this.Tabs.length; Index++) {
            var Tab = this.Tabs[Index];
            if (Math.abs(Tab.Pos - _Tab.Pos) < 0.001) {
                this.Tabs.splice(Index, 1, _Tab);
                break;
            }
            if (Tab.Pos > _Tab.Pos) {
                break;
            }
        }
        if (-1 != Index) {
            this.Tabs.splice(Index, 0, _Tab);
        }
    },
    Merge: function (Tabs) {
        var _Tabs = Tabs.Tabs;
        for (var Index = 0; Index < _Tabs.length; Index++) {
            var _Tab = _Tabs[Index];
            var Index2 = 0;
            var Flag = 0;
            for (Index2 = 0; Index2 < this.Tabs.length; Index2++) {
                var Tab = this.Tabs[Index2];
                if (Math.abs(Tab.Pos - _Tab.Pos) < 0.001) {
                    if (tab_Clear === _Tab.Value) {
                        Flag = -2;
                    } else {
                        Flag = -1;
                    }
                    break;
                }
                if (Tab.Pos > _Tab.Pos) {
                    break;
                }
            }
            if (-2 === Flag) {
                this.Tabs.splice(Index2, 1);
            } else {
                if (-1 != Flag) {
                    this.Tabs.splice(Index2, 0, _Tab);
                }
            }
        }
    },
    Copy: function () {
        var Tabs = new CParaTabs();
        var Count = this.Tabs.length;
        for (var Index = 0; Index < Count; Index++) {
            Tabs.Add(this.Tabs[Index].Copy());
        }
        return Tabs;
    },
    Set_FromObject: function (Tabs) {
        if (Tabs instanceof Array) {
            var Count = Tabs.length;
            for (var Index = 0; Index < Count; Index++) {
                this.Add(new CParaTab(Tabs[Index].Value, Tabs[Index].Pos));
            }
        }
    },
    Get_Count: function () {
        return this.Tabs.length;
    },
    Get: function (Index) {
        return this.Tabs[Index];
    },
    Get_Value: function (Pos) {
        var Count = this.Tabs.length;
        for (var Index = 0; Index < Count; Index++) {
            var Tab = this.Tabs[Index];
            if (Math.abs(Tab.Pos - Pos) < 0.001) {
                return Tab.Value;
            }
        }
        return -1;
    },
    Write_ToBinary: function (Writer) {
        var Count = this.Tabs.length;
        Writer.WriteLong(Count);
        for (var Index = 0; Index < Count; Index++) {
            Writer.WriteByte(this.Tabs[Index].Value);
            Writer.WriteDouble(this.Tabs[Index].Pos);
        }
    },
    Read_FromBinary: function (Reader) {
        var Count = Reader.GetLong();
        this.Tabs = new Array();
        for (var Index = 0; Index < Count; Index++) {
            var Value = Reader.GetByte();
            var Pos = Reader.GetDouble();
            this.Add(new CParaTab(Value, Pos));
        }
    }
};
function CParaInd() {
    this.Left = undefined;
    this.Right = undefined;
    this.FirstLine = undefined;
}
CParaInd.prototype = {
    Copy: function () {
        var Ind = new CParaInd();
        Ind.Left = this.Left;
        Ind.Right = this.Right;
        Ind.FirstLine = this.FirstLine;
        return Ind;
    },
    Merge: function (Ind) {
        if (undefined != Ind.Left) {
            this.Left = Ind.Left;
        }
        if (undefined != Ind.Right) {
            this.Right = Ind.Right;
        }
        if (undefined != Ind.FirstLine) {
            this.FirstLine = Ind.FirstLine;
        }
    },
    Set_FromObject: function (Ind) {
        if (undefined != Ind.Left) {
            this.Left = Ind.Left;
        } else {
            this.Left = undefined;
        }
        if (undefined != Ind.Right) {
            this.Right = Ind.Right;
        } else {
            this.Right = undefined;
        }
        if (undefined != Ind.FirstLine) {
            this.FirstLine = Ind.FirstLine;
        } else {
            this.FirstLine = undefined;
        }
    },
    Write_ToBinary: function (Writer) {
        var StartPos = Writer.GetCurPosition();
        Writer.Skip(4);
        var Flags = 0;
        if (undefined != this.Left) {
            Writer.WriteDouble(this.Left);
            Flags |= 1;
        }
        if (undefined != this.Right) {
            Writer.WriteDouble(this.Right);
            Flags |= 2;
        }
        if (undefined != this.FirstLine) {
            Writer.WriteDouble(this.FirstLine);
            Flags |= 4;
        }
        var EndPos = Writer.GetCurPosition();
        Writer.Seek(StartPos);
        Writer.WriteLong(Flags);
        Writer.Seek(EndPos);
    },
    Read_FromBinary: function (Reader) {
        var Flags = Reader.GetLong();
        if (Flags & 1) {
            this.Left = Reader.GetDouble();
        }
        if (Flags & 2) {
            this.Right = Reader.GetDouble();
        }
        if (Flags & 4) {
            this.FirstLine = Reader.GetDouble();
        }
    }
};
function CParaSpacing() {
    this.Line = undefined;
    this.LineRule = undefined;
    this.Before = undefined;
    this.BeforeAutoSpacing = undefined;
    this.After = undefined;
    this.AfterAutoSpacing = undefined;
}
CParaSpacing.prototype = {
    Copy: function () {
        var Spacing = new CParaSpacing();
        Spacing.Line = this.Line;
        Spacing.LineRule = this.LineRule;
        Spacing.Before = this.Before;
        Spacing.BeforeAutoSpacing = this.BeforeAutoSpacing;
        Spacing.After = this.After;
        Spacing.AfterAutoSpacing = this.AfterAutoSpacing;
        return Spacing;
    },
    Merge: function (Spacing) {
        if (undefined != Spacing.Line) {
            this.Line = Spacing.Line;
        }
        if (undefined != Spacing.LineRule) {
            this.LineRule = Spacing.LineRule;
        }
        if (undefined != Spacing.Before) {
            this.Before = Spacing.Before;
        }
        if (undefined != Spacing.BeforeAutoSpacing) {
            this.BeforeAutoSpacing = Spacing.BeforeAutoSpacing;
        }
        if (undefined != Spacing.After) {
            this.After = Spacing.After;
        }
        if (undefined != Spacing.AfterAutoSpacing) {
            this.AfterAutoSpacing = Spacing.AfterAutoSpacing;
        }
    },
    Set_FromObject: function (Spacing) {
        this.Line = Spacing.Line;
        this.LineRule = Spacing.LineRule;
        this.Before = Spacing.Before;
        this.BeforeAutoSpacing = Spacing.BeforeAutoSpacing;
        this.After = Spacing.After;
        this.AfterAutoSpacing = Spacing.AfterAutoSpacing;
    },
    Write_ToBinary: function (Writer) {
        var StartPos = Writer.GetCurPosition();
        Writer.Skip(4);
        var Flags = 0;
        if (undefined != this.Line) {
            Writer.WriteDouble(this.Line);
            Flags |= 1;
        }
        if (undefined != this.LineRule) {
            Writer.WriteByte(this.LineRule);
            Flags |= 2;
        }
        if (undefined != this.Before) {
            Writer.WriteDouble(this.Before);
            Flags |= 4;
        }
        if (undefined != this.After) {
            Writer.WriteDouble(this.After);
            Flags |= 8;
        }
        if (undefined != this.AfterAutoSpacing) {
            Writer.WriteBool(this.AfterAutoSpacing);
            Flags |= 16;
        }
        if (undefined != this.BeforeAutoSpacing) {
            Writer.WriteBool(this.BeforeAutoSpacing);
            Flags |= 32;
        }
        var EndPos = Writer.GetCurPosition();
        Writer.Seek(StartPos);
        Writer.WriteLong(Flags);
        Writer.Seek(EndPos);
    },
    Read_FromBinary: function (Reader) {
        var Flags = Reader.GetLong();
        if (Flags & 1) {
            this.Line = Reader.GetDouble();
        }
        if (Flags & 2) {
            this.LineRule = Reader.GetByte();
        }
        if (Flags & 4) {
            this.Before = Reader.GetDouble();
        }
        if (Flags & 8) {
            this.After = Reader.GetDouble();
        }
        if (Flags & 16) {
            this.AfterAutoSpacing = Reader.GetBool();
        }
        if (Flags & 32) {
            this.BeforeAutoSpacing = Reader.GetBool();
        }
    }
};
function CNumPr() {
    this.NumId = "-1";
    this.Lvl = 0;
}
CNumPr.prototype = {
    Copy: function () {
        var NumPr = new CNumPr();
        NumPr.NumId = this.NumId;
        NumPr.Lvl = this.Lvl;
        return NumPr;
    },
    Merge: function (NumPr) {
        if (undefined != NumPr.NumId) {
            this.NumId = NumPr.NumId;
        }
        if (undefined != NumPr.Lvl) {
            this.Lvl = NumPr.Lvl;
        }
    },
    Set: function (NumId, Lvl) {
        this.NumId = NumId;
        this.Lvl = Lvl;
    },
    Set_FromObject: function (NumPr) {
        this.NumId = NumPr.NumId;
        this.Lvl = NumPr.Lvl;
    },
    Write_ToBinary: function (Writer) {
        if (undefined === this.NumId) {
            Writer.WriteBool(true);
        } else {
            Writer.WriteBool(false);
            Writer.WriteString2(this.NumId);
        }
        if (undefined === this.Lvl) {
            Writer.WriteBool(true);
        } else {
            Writer.WriteBool(false);
            Writer.WriteByte(this.Lvl);
        }
    },
    Read_FromBinary: function (Reader) {
        if (true === Reader.GetBool()) {
            this.NumId = undefined;
        } else {
            this.NumId = Reader.GetString2();
        }
        if (true === Reader.GetBool()) {
            this.Lvl = undefined;
        } else {
            this.Lvl = Reader.GetByte();
        }
    }
};
var dropcap_None = 0;
var dropcap_Drop = 1;
var dropcap_Margin = 2;
var wrap_Around = 1;
var wrap_Auto = 2;
var wrap_None = 3;
var wrap_NotBeside = 4;
var wrap_Through = 5;
var wrap_Tight = 6;
function CFramePr() {
    this.DropCap = undefined;
    this.H = undefined;
    this.HAnchor = undefined;
    this.HRule = undefined;
    this.HSpace = undefined;
    this.Lines = undefined;
    this.VAnchor = undefined;
    this.VSpace = undefined;
    this.W = undefined;
    this.Wrap = undefined;
    this.X = undefined;
    this.XAlign = undefined;
    this.Y = undefined;
    this.YAlign = undefined;
}
CFramePr.prototype = {
    Copy: function () {
        var FramePr = new CFramePr();
        FramePr.DropCap = this.DropCap;
        FramePr.H = this.H;
        FramePr.HAnchor = this.HAnchor;
        FramePr.HRule = this.HRule;
        FramePr.HSpace = this.HSpace;
        FramePr.Lines = this.Lines;
        FramePr.VAnchor = this.VAnchor;
        FramePr.VSpace = this.VSpace;
        FramePr.W = this.W;
        FramePr.Wrap = this.Wrap;
        FramePr.X = this.X;
        FramePr.XAlign = this.XAlign;
        FramePr.Y = this.Y;
        FramePr.YAlign = this.YAlign;
        return FramePr;
    },
    Compare: function (FramePr) {
        if (this.DropCap != FramePr.DropCap || Math.abs(this.H - FramePr.H) > 0.001 || this.HAnchor != FramePr.HAnchor || this.HRule != FramePr.HRule || this.HSpace != FramePr.HSpace || this.Lines != FramePr.Lines || this.VAnchor != FramePr.VAnchor || this.VSpace != FramePr.VSpace || Math.abs(this.W - FramePr.W) > 0.001 || this.Wrap != FramePr.Wrap || Math.abs(this.X - FramePr.X) > 0.001 || this.XAlign != FramePr.XAlign || Math.abs(this.Y - FramePr.Y) > 0.001 || this.YAlign != FramePr.YAlign) {
            return false;
        }
        return true;
    },
    Set_FromObject: function (FramePr) {
        this.DropCap = FramePr.DropCap;
        this.H = FramePr.H;
        this.HAnchor = FramePr.HAnchor;
        this.HRule = FramePr.HRule;
        this.HSpace = FramePr.HSpace;
        this.Lines = FramePr.Lines;
        this.VAnchor = FramePr.VAnchor;
        this.VSpace = FramePr.VSpace;
        this.W = FramePr.W;
        this.Wrap = FramePr.Wrap;
        this.X = FramePr.X;
        this.XAlign = FramePr.XAlign;
        this.Y = FramePr.Y;
        this.YAlign = FramePr.YAlign;
    },
    Write_ToBinary: function (Writer) {
        var StartPos = Writer.GetCurPosition();
        Writer.Skip(4);
        var Flags = 0;
        if (undefined != this.DropCap) {
            Writer.WriteLong(this.DropCap);
            Flags |= 1;
        }
        if (undefined != this.H) {
            Writer.WriteDouble(this.H);
            Flags |= 2;
        }
        if (undefined != this.HAnchor) {
            Writer.WriteLong(this.HAnchor);
            Flags |= 4;
        }
        if (undefined != this.HRule) {
            Writer.WriteLong(this.HRule);
            Flags |= 8;
        }
        if (undefined != this.HSpace) {
            Writer.WriteDouble(this.HSpace);
            Flags |= 16;
        }
        if (undefined != this.Lines) {
            Writer.WriteLong(this.Lines);
            Flags |= 32;
        }
        if (undefined != this.VAnchor) {
            Writer.WriteLong(this.VAnchor);
            Flags |= 64;
        }
        if (undefined != this.VSpace) {
            Writer.WriteDouble(this.VSpace);
            Flags |= 128;
        }
        if (undefined != this.W) {
            Writer.WriteDouble(this.W);
            Flags |= 256;
        }
        if (undefined != this.X) {
            Writer.WriteDouble(this.X);
            Flags |= 512;
        }
        if (undefined != this.XAlign) {
            Writer.WriteLong(this.XAlign);
            Flags |= 1024;
        }
        if (undefined != this.Y) {
            Writer.WriteDouble(this.Y);
            Flags |= 2048;
        }
        if (undefined != this.YAlign) {
            Writer.WriteLong(this.YAlign);
            Flags |= 4096;
        }
        var EndPos = Writer.GetCurPosition();
        Writer.Seek(StartPos);
        Writer.WriteLong(Flags);
        Writer.Seek(EndPos);
    },
    Read_FromBinary: function (Reader) {
        var Flags = Reader.GetLong();
        if (Flags & 1) {
            this.DropCap = Reader.GetLong();
        }
        if (Flags & 2) {
            this.H = Reader.GetDouble();
        }
        if (Flags & 4) {
            this.HAnchor = Reader.GetLong();
        }
        if (Flags & 8) {
            this.HRule = Reader.GetLong();
        }
        if (Flags & 16) {
            this.HSpace = Reader.GetDouble();
        }
        if (Flags & 32) {
            this.Lines = Reader.GetLong();
        }
        if (Flags & 64) {
            this.VAnchor = Reader.GetLong();
        }
        if (Flags & 128) {
            this.VSpace = Reader.GetDouble();
        }
        if (Flags & 256) {
            this.W = Reader.GetDouble();
        }
        if (Flags & 512) {
            this.X = Reader.GetDouble();
        }
        if (Flags & 1024) {
            this.XAlign = Reader.GetLong();
        }
        if (Flags & 2048) {
            this.Y = Reader.GetDouble();
        }
        if (Flags & 4096) {
            this.YAlign = Reader.GetLong();
        }
    },
    Init_Default_DropCap: function (bInside) {
        this.DropCap = (true === bInside ? dropcap_Drop : dropcap_Margin);
        this.Lines = 3;
        this.Wrap = wrap_Around;
        this.VAnchor = c_oAscVAnchor.Text;
        this.HAnchor = (true === bInside ? c_oAscHAnchor.Text : c_oAscHAnchor.Page);
        this.X = undefined;
        this.XAlign = undefined;
        this.Y = undefined;
        this.YAlign = undefined;
        this.H = undefined;
        this.W = undefined;
        this.HRule = undefined;
    },
    Get_W: function () {
        return this.W;
    },
    Get_H: function () {
        return this.H;
    },
    Is_DropCap: function () {
        if (dropcap_Margin === this.DropCap || dropcap_Drop === this.DropCap) {
            return true;
        }
        return false;
    }
};
function CParaPr() {
    this.ContextualSpacing = undefined;
    this.Ind = new CParaInd();
    this.Jc = undefined;
    this.KeepLines = undefined;
    this.KeepNext = undefined;
    this.PageBreakBefore = undefined;
    this.Spacing = new CParaSpacing();
    this.Shd = undefined;
    this.Brd = {
        First: undefined,
        Last: undefined,
        Between: undefined,
        Bottom: undefined,
        Left: undefined,
        Right: undefined,
        Top: undefined
    };
    this.WidowControl = undefined;
    this.Tabs = undefined;
    this.NumPr = undefined;
    this.PStyle = undefined;
    this.FramePr = undefined;
}
CParaPr.prototype = {
    Copy: function () {
        var ParaPr = new CParaPr();
        ParaPr.ContextualSpacing = this.ContextualSpacing;
        if (undefined != this.Ind) {
            ParaPr.Ind = this.Ind.Copy();
        }
        ParaPr.Jc = this.Jc;
        ParaPr.KeepLines = this.KeepLines;
        ParaPr.KeepNext = this.KeepNext;
        ParaPr.PageBreakBefore = this.PageBreakBefore;
        if (undefined != this.Spacing) {
            ParaPr.Spacing = this.Spacing.Copy();
        }
        if (undefined != this.Shd) {
            ParaPr.Shd = this.Shd.Copy();
        }
        ParaPr.Brd.First = this.Brd.First;
        ParaPr.Brd.Last = this.Brd.Last;
        if (undefined != this.Brd.Between) {
            ParaPr.Brd.Between = this.Brd.Between.Copy();
        }
        if (undefined != this.Brd.Bottom) {
            ParaPr.Brd.Bottom = this.Brd.Bottom.Copy();
        }
        if (undefined != this.Brd.Left) {
            ParaPr.Brd.Left = this.Brd.Left.Copy();
        }
        if (undefined != this.Brd.Right) {
            ParaPr.Brd.Right = this.Brd.Right.Copy();
        }
        if (undefined != this.Brd.Top) {
            ParaPr.Brd.Top = this.Brd.Top.Copy();
        }
        ParaPr.WidowControl = this.WidowControl;
        if (undefined != this.Tabs) {
            ParaPr.Tabs = this.Tabs.Copy();
        }
        if (undefined != this.NumPr) {
            ParaPr.NumPr = this.NumPr.Copy();
        }
        if (undefined != this.PStyle) {
            ParaPr.PStyle = this.PStyle;
        }
        if (undefined != this.FramePr) {
            ParaPr.FramePr = this.FramePr.Copy();
        } else {
            ParaPr.FramePr = undefined;
        }
        return ParaPr;
    },
    Merge: function (ParaPr) {
        if (undefined != ParaPr.ContextualSpacing) {
            this.ContextualSpacing = ParaPr.ContextualSpacing;
        }
        if (undefined != ParaPr.Ind) {
            this.Ind.Merge(ParaPr.Ind);
        }
        if (undefined != ParaPr.Jc) {
            this.Jc = ParaPr.Jc;
        }
        if (undefined != ParaPr.KeepLines) {
            this.KeepLines = ParaPr.KeepLines;
        }
        if (undefined != ParaPr.KeepNext) {
            this.KeepNext = ParaPr.KeepNext;
        }
        if (undefined != ParaPr.PageBreakBefore) {
            this.PageBreakBefore = ParaPr.PageBreakBefore;
        }
        if (undefined != ParaPr.Spacing) {
            this.Spacing.Merge(ParaPr.Spacing);
        }
        if (undefined != ParaPr.Shd) {
            this.Shd = ParaPr.Shd.Copy();
        }
        if (undefined != ParaPr.Brd.First) {
            this.Brd.First = ParaPr.Brd.First;
        }
        if (undefined != ParaPr.Brd.Last) {
            this.Brd.Last = ParaPr.Brd.Last;
        }
        if (undefined != ParaPr.Brd.Between) {
            this.Brd.Between = ParaPr.Brd.Between.Copy();
        }
        if (undefined != ParaPr.Brd.Bottom) {
            this.Brd.Bottom = ParaPr.Brd.Bottom.Copy();
        }
        if (undefined != ParaPr.Brd.Left) {
            this.Brd.Left = ParaPr.Brd.Left.Copy();
        }
        if (undefined != ParaPr.Brd.Right) {
            this.Brd.Right = ParaPr.Brd.Right.Copy();
        }
        if (undefined != ParaPr.Brd.Top) {
            this.Brd.Top = ParaPr.Brd.Top.Copy();
        }
        if (undefined != ParaPr.WidowControl) {
            this.WidowControl = ParaPr.WidowControl;
        }
        if (undefined != ParaPr.Tabs) {
            if (undefined === this.Tabs) {
                this.Tabs = ParaPr.Tabs.Copy();
            } else {
                this.Tabs.Merge(ParaPr.Tabs);
            }
        }
        if (undefined != ParaPr.NumPr) {
            if (undefined === this.NumPr) {
                this.NumPr = ParaPr.NumPr.Copy();
            } else {
                this.NumPr.Merge(ParaPr.NumPr);
            }
            if (undefined != this.NumPr && this.NumPr.Lvl > 8) {
                this.NumPr = undefined;
            }
        }
        if (undefined != ParaPr.PStyle) {
            this.PStyle = ParaPr.PStyle;
        }
        this.FramePr = undefined;
    },
    Init_Default: function () {
        this.ContextualSpacing = false;
        this.Ind = new CParaInd();
        this.Ind.Left = 0;
        this.Ind.Right = 0;
        this.Ind.FirstLine = 0;
        this.Jc = align_Left;
        this.KeepLines = false;
        this.KeepNext = false;
        this.PageBreakBefore = false;
        this.Spacing = new CParaSpacing();
        this.Spacing.Line = 1.15;
        this.Spacing.LineRule = linerule_Auto;
        this.Spacing.Before = 0;
        this.Spacing.BeforeAutoSpacing = false;
        this.Spacing.After = 10 * g_dKoef_pt_to_mm;
        this.Spacing.AfterAutoSpacing = false;
        this.Shd = new CDocumentShd();
        this.Brd.First = true;
        this.Brd.Last = true;
        this.Brd.Between = new CDocumentBorder();
        this.Brd.Bottom = new CDocumentBorder();
        this.Brd.Left = new CDocumentBorder();
        this.Brd.Right = new CDocumentBorder();
        this.Brd.Top = new CDocumentBorder();
        this.WidowControl = true;
        this.Tabs = new CParaTabs();
        this.NumPr = undefined;
        this.PStyle = undefined;
        this.FramePr = undefined;
    },
    Set_FromObject: function (ParaPr) {
        this.ContextualSpacing = ParaPr.ContextualSpacing;
        if (undefined != ParaPr.Ind) {
            this.Ind = new CParaInd();
            this.Ind.Set_FromObject(ParaPr.Ind);
        } else {
            this.Ind = undefined;
        }
        this.Jc = ParaPr.Jc;
        this.KeepLines = ParaPr.KeepLines;
        this.KeepNext = ParaPr.KeepNext;
        this.PageBreakBefore = ParaPr.PageBreakBefore;
        if (undefined != ParaPr.Spacing) {
            this.Spacing = new CParaSpacing();
            this.Spacing.Set_FromObject(ParaPr.Spacing);
        } else {
            this.Spacing = undefined;
        }
        if (undefined != ParaPr.Shd) {
            this.Shd = new CDocumentShd();
            this.Shd.Set_FromObject(ParaPr.Shd);
        } else {
            this.Shd = undefined;
        }
        if (undefined != ParaPr.Brd) {
            if (undefined != ParaPr.Brd.Between) {
                this.Brd.Between = new CDocumentBorder();
                this.Brd.Between.Set_FromObject(ParaPr.Brd.Between);
            } else {
                this.Brd.Between = undefined;
            }
            if (undefined != ParaPr.Brd.Bottom) {
                this.Brd.Bottom = new CDocumentBorder();
                this.Brd.Bottom.Set_FromObject(ParaPr.Brd.Bottom);
            } else {
                this.Brd.Bottom = undefined;
            }
            if (undefined != ParaPr.Brd.Left) {
                this.Brd.Left = new CDocumentBorder();
                this.Brd.Left.Set_FromObject(ParaPr.Brd.Left);
            } else {
                this.Brd.Left = undefined;
            }
            if (undefined != ParaPr.Brd.Right) {
                this.Brd.Right = new CDocumentBorder();
                this.Brd.Right.Set_FromObject(ParaPr.Brd.Right);
            } else {
                this.Brd.Right = undefined;
            }
            if (undefined != ParaPr.Brd.Top) {
                this.Brd.Top = new CDocumentBorder();
                this.Brd.Top.Set_FromObject(ParaPr.Brd.Top);
            } else {
                this.Brd.Top = undefined;
            }
        } else {
            this.Brd.Between = undefined;
            this.Brd.Bottom = undefined;
            this.Brd.Left = undefined;
            this.Brd.Right = undefined;
            this.Brd.Top = undefined;
        }
        this.WidowControl = ParaPr.WidowControl;
        if (undefined != ParaPr.Tabs) {
            this.Tabs = new CParaTabs();
            this.Tabs.Set_FromObject(ParaPr.Tabs.Tabs);
        } else {
            this.Tabs = undefined;
        }
        if (undefined != ParaPr.NumPr) {
            this.NumPr = new CNumPr();
            this.NumPr.Set_FromObject(ParaPr.NumPr);
        } else {
            this.NumPr = undefined;
        }
        if (undefined != ParaPr.FramePr) {
            this.FramePr = new CFramePr();
            this.FramePr.Set_FromObject(ParaPr.FramePr);
        } else {
            this.FramePr = undefined;
        }
    },
    Compare: function (ParaPr) {
        var Result_ParaPr = new CParaPr();
        Result_ParaPr.Locked = false;
        if (ParaPr.ContextualSpacing === this.ContextualSpacing) {
            Result_ParaPr.ContextualSpacing = ParaPr.ContextualSpacing;
        }
        Result_ParaPr.Ind = new CParaInd();
        if (undefined != ParaPr.Ind && undefined != this.Ind) {
            if (undefined != ParaPr.Ind.Left && undefined != this.Ind.Left && Math.abs(ParaPr.Ind.Left - this.Ind.Left) < 0.001) {
                Result_ParaPr.Ind.Left = ParaPr.Ind.Left;
            }
            if (undefined != ParaPr.Ind.Right && undefined != this.Ind.Right && Math.abs(ParaPr.Ind.Right - this.Ind.Right) < 0.001) {
                Result_ParaPr.Ind.Right = ParaPr.Ind.Right;
            }
            if (undefined != ParaPr.Ind.FirstLine && undefined != this.Ind.FirstLine && Math.abs(ParaPr.Ind.FirstLine - this.Ind.FirstLine) < 0.001) {
                Result_ParaPr.Ind.FirstLine = ParaPr.Ind.FirstLine;
            }
        }
        if (ParaPr.Jc === this.Jc) {
            Result_ParaPr.Jc = ParaPr.Jc;
        }
        if (ParaPr.KeepLines === this.KeepLines) {
            Result_ParaPr.KeepLines = ParaPr.KeepLines;
        }
        if (ParaPr.KeepNext === this.KeepNext) {
            Result_ParaPr.KeepNext = ParaPr.KeepNext;
        }
        if (ParaPr.PageBreakBefore === this.PageBreakBefore) {
            Result_ParaPr.PageBreakBefore = ParaPr.PageBreakBefore;
        }
        Result_ParaPr.Spacing = new CParaSpacing();
        if (undefined != this.Spacing && undefined != ParaPr.Spacing) {
            if (undefined != this.Spacing.After && undefined != ParaPr.Spacing.After && Math.abs(this.Spacing.After - ParaPr.Spacing.After) < 0.001) {
                Result_ParaPr.Spacing.After = ParaPr.Spacing.After;
            }
            if (this.Spacing.AfterAutoSpacing === ParaPr.Spacing.AfterAutoSpacing) {
                Result_ParaPr.Spacing.AfterAutoSpacing = ParaPr.Spacing.AfterAutoSpacing;
            }
            if (undefined != this.Spacing.Before && undefined != ParaPr.Spacing.Before && Math.abs(this.Spacing.Before - ParaPr.Spacing.Before) < 0.001) {
                Result_ParaPr.Spacing.Before = ParaPr.Spacing.Before;
            }
            if (this.Spacing.BeforeAutoSpacing === ParaPr.Spacing.BeforeAutoSpacing) {
                Result_ParaPr.Spacing.BeforeAutoSpacing = ParaPr.Spacing.BeforeAutoSpacing;
            }
            if (undefined != this.Spacing.Line && undefined != ParaPr.Spacing.Line && Math.abs(this.Spacing.Line - ParaPr.Spacing.Line) < 0.001) {
                Result_ParaPr.Spacing.Line = ParaPr.Spacing.Line;
            }
            if (this.Spacing.LineRule === ParaPr.Spacing.LineRule) {
                Result_ParaPr.Spacing.LineRule = ParaPr.Spacing.LineRule;
            }
        }
        if (undefined != this.Shd && undefined != ParaPr.Shd && true === this.Shd.Compare(ParaPr.Shd)) {
            Result_ParaPr.Shd = ParaPr.Shd.Copy();
        }
        if (undefined != this.Brd.Between && undefined != ParaPr.Brd.Between && true === this.Brd.Between.Compare(ParaPr.Brd.Between)) {
            Result_ParaPr.Brd.Between = ParaPr.Brd.Between.Copy();
        }
        if (undefined != this.Brd.Bottom && undefined != ParaPr.Brd.Bottom && true === this.Brd.Bottom.Compare(ParaPr.Brd.Bottom)) {
            Result_ParaPr.Brd.Bottom = ParaPr.Brd.Bottom.Copy();
        }
        if (undefined != this.Brd.Left && undefined != ParaPr.Brd.Left && true === this.Brd.Left.Compare(ParaPr.Brd.Left)) {
            Result_ParaPr.Brd.Left = ParaPr.Brd.Left.Copy();
        }
        if (undefined != this.Brd.Right && undefined != ParaPr.Brd.Right && true === this.Brd.Right.Compare(ParaPr.Brd.Right)) {
            Result_ParaPr.Brd.Right = ParaPr.Brd.Right.Copy();
        }
        if (undefined != this.Brd.Top && undefined != ParaPr.Brd.Top && true === this.Brd.Top.Compare(ParaPr.Brd.Top)) {
            Result_ParaPr.Brd.Top = ParaPr.Brd.Top.Copy();
        }
        if (ParaPr.WidowControl === this.WidowControl) {
            Result_ParaPr.WidowControl = ParaPr.WidowControl;
        }
        if (undefined != this.PStyle && undefined != ParaPr.PStyle && this.PStyle === ParaPr.PStyle) {
            Result_ParaPr.PStyle = ParaPr.PStyle;
        }
        if (undefined != this.NumPr && undefined != ParaPr.NumPr && this.NumPr.NumId === ParaPr.NumPr.NumId) {
            Result_ParaPr.NumPr = new CParaPr();
            Result_ParaPr.NumPr.NumId = ParaPr.NumPr.NumId;
            Result_ParaPr.NumPr.Lvl = Math.max(this.NumPr.Lvl, ParaPr.NumPr.Lvl);
        }
        if (undefined != this.Locked && undefined != ParaPr.Locked) {
            if (this.Locked != ParaPr.Locked) {
                Result_ParaPr.Locked = true;
            } else {
                Result_ParaPr.Locked = ParaPr.Locked;
            }
        }
        if (undefined != this.FramePr && undefined != ParaPr.FramePr && true === this.FramePr.Compare(ParaPr.FramePr)) {
            Result_ParaPr.FramePr = this.FramePr;
        }
        return Result_ParaPr;
    },
    Write_ToBinary: function (Writer) {
        var StartPos = Writer.GetCurPosition();
        Writer.Skip(4);
        var Flags = 0;
        if (undefined != this.ContextualSpacing) {
            Writer.WriteBool(this.ContextualSpacing);
            Flags |= 1;
        }
        if (undefined != this.Ind) {
            this.Ind.Write_ToBinary(Writer);
            Flags |= 2;
        }
        if (undefined != this.Jc) {
            Writer.WriteByte(this.Jc);
            Flags |= 4;
        }
        if (undefined != this.KeepLines) {
            Writer.WriteBool(this.KeepLines);
            Flags |= 8;
        }
        if (undefined != this.KeepNext) {
            Writer.WriteBool(this.KeepNext);
            Flags |= 16;
        }
        if (undefined != this.PageBreakBefore) {
            Writer.WriteBool(this.PageBreakBefore);
            Flags |= 32;
        }
        if (undefined != this.Spacing) {
            this.Spacing.Write_ToBinary(Writer);
            Flags |= 64;
        }
        if (undefined != this.Shd) {
            this.Shd.Write_ToBinary(Writer);
            Flags |= 128;
        }
        if (undefined != this.Brd.Between) {
            this.Brd.Between.Write_ToBinary(Writer);
            Flags |= 256;
        }
        if (undefined != this.Brd.Bottom) {
            this.Brd.Bottom.Write_ToBinary(Writer);
            Flags |= 512;
        }
        if (undefined != this.Brd.Left) {
            this.Brd.Left.Write_ToBinary(Writer);
            Flags |= 1024;
        }
        if (undefined != this.Brd.Right) {
            this.Brd.Right.Write_ToBinary(Writer);
            Flags |= 2048;
        }
        if (undefined != this.Brd.Top) {
            this.Brd.Top.Write_ToBinary(Writer);
            Flags |= 4096;
        }
        if (undefined != this.WidowControl) {
            Writer.WriteBool(this.WidowControl);
            Flags |= 8192;
        }
        if (undefined != this.Tabs) {
            this.Tabs.Write_ToBinary(Writer);
            Flags |= 16384;
        }
        if (undefined != this.NumPr) {
            this.NumPr.Write_ToBinary(Writer);
            Flags |= 32768;
        }
        if (undefined != this.PStyle) {
            Writer.WriteString2(this.PStyle);
            Flags |= 65536;
        }
        if (undefined != this.FramePr) {
            this.FramePr.Write_ToBinary(Writer);
            Flags |= 131072;
        }
        var EndPos = Writer.GetCurPosition();
        Writer.Seek(StartPos);
        Writer.WriteLong(Flags);
        Writer.Seek(EndPos);
    },
    Read_FromBinary: function (Reader) {
        var Flags = Reader.GetLong();
        if (Flags & 1) {
            this.ContextualSpacing = Reader.GetBool();
        }
        if (Flags & 2) {
            this.Ind = new CParaInd();
            this.Ind.Read_FromBinary(Reader);
        }
        if (Flags & 4) {
            this.Jc = Reader.GetByte();
        }
        if (Flags & 8) {
            this.KeepLines = Reader.GetBool();
        }
        if (Flags & 16) {
            this.KeepNext = Reader.GetBool();
        }
        if (Flags & 32) {
            this.PageBreakBefore = Reader.GetBool();
        }
        if (Flags & 64) {
            this.Spacing = new CParaSpacing();
            this.Spacing.Read_FromBinary(Reader);
        }
        if (Flags & 128) {
            this.Shd = new CDocumentShd();
            this.Shd.Read_FromBinary(Reader);
        }
        if (Flags & 256) {
            this.Brd.Between = new CDocumentBorder();
            this.Brd.Between.Read_FromBinary(Reader);
        }
        if (Flags & 512) {
            this.Brd.Bottom = new CDocumentBorder();
            this.Brd.Bottom.Read_FromBinary(Reader);
        }
        if (Flags & 1024) {
            this.Brd.Left = new CDocumentBorder();
            this.Brd.Left.Read_FromBinary(Reader);
        }
        if (Flags & 2048) {
            this.Brd.Right = new CDocumentBorder();
            this.Brd.Right.Read_FromBinary(Reader);
        }
        if (Flags & 4096) {
            this.Brd.Top = new CDocumentBorder();
            this.Brd.Top.Read_FromBinary(Reader);
        }
        if (Flags & 8192) {
            this.WidowControl = Reader.GetBool();
        }
        if (Flags & 16384) {
            this.Tabs = new CParaTabs();
            this.Tabs.Read_FromBinary(Reader);
        }
        if (Flags & 32768) {
            this.NumPr = new CNumPr();
            this.NumPr.Read_FromBinary(Reader);
        }
        if (Flags & 65536) {
            this.PStyle = Reader.GetString2();
        }
        if (Flags & 131072) {
            this.FramePr = new CFramePr();
            this.FramePr.Read_FromBinary(Reader);
        }
    },
    isEqual: function (ParaPrUOld, ParaPrNew) {
        if (ParaPrUOld == undefined || ParaPrNew == undefined) {
            return false;
        }
        for (var pPr in ParaPrUOld) {
            if (typeof ParaPrUOld[pPr] == "object") {
                if (!this.isEqual(ParaPrUOld[pPr], ParaPrNew[pPr])) {
                    return false;
                }
            } else {
                if (typeof ParaPrUOld[pPr] == "number" && typeof ParaPrNew[pPr] == "number") {
                    if (Math.abs(ParaPrUOld[pPr] - ParaPrNew[pPr]) > 0.001) {
                        return false;
                    }
                } else {
                    if (ParaPrUOld[pPr] != ParaPrNew[pPr]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
};
function Copy_Bounds(Bounds) {
    if (undefined === Bounds) {
        return {};
    }
    var Bounds_new = {};
    Bounds_new.Bottom = Bounds.Bottom;
    Bounds_new.Left = Bounds.Left;
    Bounds_new.Right = Bounds.Right;
    Bounds_new.Top = Bounds.Top;
    return Bounds_new;
}