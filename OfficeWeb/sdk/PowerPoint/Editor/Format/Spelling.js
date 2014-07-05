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
 function CDocumentSpelling() {
    this.Paragraphs = new Object();
    this.Words = new Object();
    this.CheckPara = new Object();
    this.CurPara = new Object();
}
CDocumentSpelling.prototype = {
    Add_Paragraph: function (Id, Para) {
        this.Paragraphs[Id] = Para;
    },
    Remove_Paragraph: function (Id) {
        delete this.Paragraphs[Id];
    },
    Check_Word: function (Word) {
        if (undefined != this.Words[Word]) {
            return true;
        }
        return false;
    },
    Add_Word: function (Word) {
        this.Words[Word] = true;
        for (var Id in this.Paragraphs) {
            var Para = this.Paragraphs[Id];
            Para.SpellChecker.Ignore(Word);
        }
    },
    Add_ParagraphToCheck: function (Id, Para) {
        this.CheckPara[Id] = Para;
    },
    Continue_CheckSpelling: function () {
        var Counter = 0;
        for (var Id in this.CheckPara) {
            var Para = this.CheckPara[Id];
            Para.Continue_CheckSpelling();
            delete this.CheckPara[Id];
            Counter++;
            if (Counter > 20) {
                break;
            }
        }
        for (var Id in this.CurPara) {
            var Para = this.CurPara[Id];
            delete this.CurPara[Id];
            Para.SpellChecker.Reset_ElementsWithCurPos();
            Para.SpellChecker.Check();
        }
    },
    Add_CurPara: function (Id, Para) {
        this.CurPara[Id] = Para;
    }
};
function CParaSpellChecker() {
    this.Elements = new Array();
    this.RecalcId = -1;
    this.ParaId = -1;
}
CParaSpellChecker.prototype = {
    Clear: function () {
        this.Elements = new Array();
    },
    Add: function (StartPos, EndPos, Word, Lang) {
        this.Elements.push(new CParaSpellCheckerElement(StartPos, EndPos, Word, Lang));
    },
    Check: function () {
        var Paragraph = g_oTableId.Get_ById(this.ParaId);
        var bCurrent = Paragraph.Is_ThisElementCurrent();
        var CurPos = -1;
        if (true === bCurrent && false === Paragraph.Selection.Use) {
            CurPos = Paragraph.CurPos.ContentPos;
        }
        var usrWords = new Array();
        var usrLang = new Array();
        var Count = this.Elements.length;
        for (var Index = 0; Index < Count; Index++) {
            var Element = this.Elements[Index];
            Element.CurPos = false;
            if (1 >= Element.Word.length) {
                Element.Checked = true;
            } else {
                if (null === Element.Checked && -1 != CurPos && Element.EndPos >= CurPos - 1 && Element.StartPos <= CurPos) {
                    Element.Checked = true;
                    Element.CurPos = true;
                    editor.WordControl.m_oLogicDocument.Spelling.Add_CurPara(this.ParaId, g_oTableId.Get_ById(this.ParaId));
                }
            }
            if (null === Element.Checked) {
                usrWords.push(this.Elements[Index].Word);
                usrLang.push(this.Elements[Index].Lang);
            }
        }
        if (0 < usrWords.length) {
            spellCheck(editor, {
                "type": "spell",
                "ParagraphId": this.ParaId,
                "RecalcId": this.RecalcId,
                "ElementId": 0,
                "usrWords": usrWords,
                "usrLang": usrLang
            });
        }
    },
    Check_CallBack: function (RecalcId, UsrCorrect) {
        if (RecalcId == this.RecalcId) {
            var DocumentSpelling = editor.WordControl.m_oLogicDocument.Spelling;
            var Count = this.Elements.length;
            var Index2 = 0;
            for (var Index = 0; Index < Count; Index++) {
                var Element = this.Elements[Index];
                if (null === Element.Checked && true != Element.Checked) {
                    if (true === DocumentSpelling.Check_Word(Element.Word)) {
                        Element.Checked = true;
                    } else {
                        Element.Checked = UsrCorrect[Index2];
                    }
                    Index2++;
                }
            }
            this.Internal_UpdateParagraphState();
        }
    },
    Internal_UpdateParagraphState: function () {
        var DocumentSpelling = editor.WordControl.m_oLogicDocument.Spelling;
        var bMisspeled = false;
        var Count = this.Elements.length;
        for (var Index = 0; Index < Count; Index++) {
            if (false === this.Elements[Index].Checked) {
                bMisspeled = true;
            }
        }
        if (true === bMisspeled) {
            DocumentSpelling.Add_Paragraph(this.ParaId, g_oTableId.Get_ById(this.ParaId));
        } else {
            DocumentSpelling.Remove_Paragraph(this.ParaId);
        }
    },
    Check_Spelling: function (Pos) {
        var Count = this.Elements.length;
        for (var Index = 0; Index < Count; Index++) {
            var Element = this.Elements[Index];
            if (Element.StartPos > Pos) {
                break;
            } else {
                if (Element.EndPos < Pos) {
                    continue;
                } else {
                    return (Element.Checked === null ? true : Element.Checked);
                }
            }
        }
        return true;
    },
    Document_UpdateInterfaceState: function (StartPos, EndPos) {
        var Count = this.Elements.length;
        var FoundElement = null;
        var FoundIndex = -1;
        for (var Index = 0; Index < Count; Index++) {
            var Element = this.Elements[Index];
            if (Element.StartPos <= EndPos && Element.EndPos >= StartPos && false === Element.Checked) {
                if (null != FoundElement) {
                    FoundElement = null;
                    break;
                } else {
                    FoundIndex = Index;
                    FoundElement = Element;
                }
            }
        }
        var Word = "";
        var Variants = null;
        var Checked = null;
        if (null != FoundElement) {
            Word = FoundElement.Word;
            Variants = FoundElement.Variants;
            Checked = FoundElement.Checked;
            if (null === Variants) {
                spellCheck(editor, {
                    "type": "suggest",
                    "ParagraphId": this.ParaId,
                    "RecalcId": this.RecalcId,
                    "ElementId": FoundIndex,
                    "usrWords": [Word],
                    "usrLang": [FoundElement.Lang]
                });
            }
        }
        if (null === Checked) {
            Checked = true;
        }
        editor.sync_SpellCheckCallback(Word, Checked, Variants, this.ParaId, FoundIndex);
    },
    Check_CallBack2: function (RecalcId, ElementId, usrVariants) {
        if (RecalcId == this.RecalcId) {
            this.Elements[ElementId].Variants = usrVariants[0];
        }
    },
    Ignore: function (Word) {
        var Count = this.Elements.length;
        for (var Index = 0; Index < Count; Index++) {
            var Element = this.Elements[Index];
            if (false === Element.Checked && Word === Element.Word) {
                Element.Checked = true;
            }
        }
        this.Internal_UpdateParagraphState();
    },
    Update_OnAdd: function (Paragraph, Pos, Item) {
        var ItemType = Item.Type;
        var Left = null;
        var Right = null;
        var Count = this.Elements.length;
        for (var Index = 0; Index < Count; Index++) {
            var Element = this.Elements[Index];
            if (Element.StartPos > Pos) {
                if (null == Right) {
                    Right = Element;
                }
                Element.StartPos++;
            }
            if (Element.EndPos >= Pos) {
                Element.EndPos++;
            } else {
                Left = Element;
            }
        }
        var RecalcInfo = Paragraph.RecalcInfo;
        RecalcInfo.Update_Spell_OnChange(Pos, 1, true);
        if (para_TextPr != ItemType) {
            var StartPos = (null === Left ? 0 : Left.StartPos);
            var EndPos = (null === Right ? Paragraph.Content.length - 1 : Right.EndPos);
            RecalcInfo.Set_Type_0_Spell(pararecalc_0_Spell_Pos, StartPos, EndPos);
        } else {
            if (undefined != Item.Value.Caps) {
                RecalcInfo.Set_Type_0_Spell(pararecalc_0_Spell_All);
            } else {
                if (para_TextPr === ItemType) {
                    RecalcInfo.Set_Type_0_Spell(pararecalc_0_Spell_Lang);
                }
            }
        }
    },
    Update_OnRemove: function (Paragraph, Pos, Count) {
        var Left = null;
        var Right = null;
        var _Count = this.Elements.length;
        for (var Index = 0; Index < _Count; Index++) {
            var Element = this.Elements[Index];
            if (Element.StartPos > Pos) {
                if (null == Right) {
                    Right = Element;
                }
                if (Element.StartPos > Pos + Count) {
                    Element.StartPos -= Count;
                } else {
                    Element.StartPos = Pos;
                }
            }
            if (Element.EndPos >= Pos) {
                if (Element.EndPos >= Pos + Count) {
                    Element.EndPos -= Count;
                } else {
                    Element.EndPos = Math.max(0, Pos - 1);
                }
            } else {
                Left = Element;
            }
        }
        var StartPos = (null === Left ? 0 : Left.StartPos);
        var EndPos = (null === Right ? Paragraph.Content.length - 1 : Right.EndPos);
        var RecalcInfo = Paragraph.RecalcInfo;
        RecalcInfo.Update_Spell_OnChange(Pos, Count, false);
        RecalcInfo.Set_Type_0_Spell(pararecalc_0_Spell_Pos, StartPos, EndPos);
    },
    Get_ElementsBeforeAfterPos: function (StartPos, EndPos) {
        var Before = new Array();
        var After = new Array();
        var Count = this.Elements.length;
        for (var Index = 0; Index < Count; Index++) {
            var Element = this.Elements[Index];
            if (Element.EndPos < StartPos) {
                Before.push(Element);
            } else {
                if (Element.StartPos >= EndPos) {
                    After.push(Element);
                }
            }
        }
        return {
            Before: Before,
            After: After
        };
    },
    Reset_ElementsWithCurPos: function () {
        var Count = this.Elements.length;
        for (var Index = 0; Index < Count; Index++) {
            var Element = this.Elements[Index];
            if (true === Element.CurPos) {
                Element.Checked = null;
            }
        }
    }
};
function CParaSpellCheckerElement(StartPos, EndPos, Word, Lang) {
    this.StartPos = StartPos;
    this.EndPos = EndPos;
    this.Word = Word;
    this.Lang = Lang;
    this.Checked = null;
    this.CurPos = false;
    this.Variants = null;
}
function SpellCheck_CallBack(Obj) {
    if (undefined != Obj && undefined != Obj["ParagraphId"]) {
        var ParaId = Obj["ParagraphId"];
        var Paragraph = g_oTableId.Get_ById(ParaId);
        var Type = Obj["type"];
        if (null != Paragraph) {
            if ("spell" === Type) {
                Paragraph.SpellChecker.Check_CallBack(Obj["RecalcId"], Obj["usrCorrect"]);
                Paragraph.ReDraw();
            } else {
                if ("suggest" === Type) {
                    Paragraph.SpellChecker.Check_CallBack2(Obj["RecalcId"], Obj["ElementId"], Obj["usrSuggest"]);
                    editor.sync_SpellCheckVariantsFound();
                }
            }
        }
    }
}
CTable.prototype.Restart_CheckSpelling = function () {
    var RowsCount = this.Content.length;
    for (var CurRow = 0; CurRow < RowsCount; CurRow++) {
        var Row = this.Content[CurRow];
        var CellsCount = Row.Get_CellsCount();
        for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
            Row.Get_Cell(CurCell).Content.Restart_CheckSpelling();
        }
    }
};
Paragraph.prototype.Restart_CheckSpelling = function () {
    this.RecalcInfo.Set_Type_0_Spell(pararecalc_0_Spell_All);
    this.CompiledPr.NeedRecalc = true;
    this.LogicDocument.Spelling.Add_ParagraphToCheck(this.Get_Id(), this);
};
Paragraph.prototype.Internal_CheckSpelling = function () {
    if (pararecalc_0_Spell_None !== this.RecalcInfo.Recalc_0_Spell.Type) {
        if (null != g_oTableId.Get_ById(this.Get_Id())) {
            this.LogicDocument.Spelling.Add_ParagraphToCheck(this.Get_Id(), this);
        }
    }
};
Paragraph.prototype.Continue_CheckSpelling = function () {
    var CheckLang = false;
    if (pararecalc_0_Spell_None === this.RecalcInfo.Recalc_0_Spell.Type) {
        return;
    } else {
        if (pararecalc_0_Spell_All === this.RecalcInfo.Recalc_0_Spell.Type) {
            this.SpellChecker.Clear();
            var Pr = this.Get_CompiledPr();
            var CurTextPr = Pr.TextPr;
            var CurLcid = CurTextPr.Lang.Val;
            var bWord = false;
            var sWord = "";
            var nWordStart = 0;
            var nWordEnd = 0;
            var ContentLength = this.Content.length;
            for (var Pos = 0; Pos < ContentLength; Pos++) {
                var Item = this.Content[Pos];
                if (para_TextPr === Item.Type) {
                    CurTextPr = this.Internal_CalculateTextPr(Pos);
                    if (true === bWord && CurLcid != CurTextPr.Lang.Val) {
                        bWord = false;
                        this.SpellChecker.Add(nWordStart, nWordEnd, sWord, CurLcid);
                    }
                    CurLcid = CurTextPr.Lang.Val;
                    continue;
                } else {
                    if (para_Text === Item.Type && false === Item.Is_Punctuation() && false === Item.Is_NBSP() && false === Item.Is_Number() && false === Item.Is_SpecialSymbol()) {
                        if (false === bWord) {
                            bWord = true;
                            nWordStart = Pos;
                            nWordEnd = Pos;
                            if (true != CurTextPr.Caps) {
                                sWord = Item.Value;
                            } else {
                                sWord = Item.Value.toUpperCase();
                            }
                        } else {
                            if (true != CurTextPr.Caps) {
                                sWord += Item.Value;
                            } else {
                                sWord += Item.Value.toUpperCase();
                            }
                            nWordEnd = Pos;
                        }
                    } else {
                        if (true === bWord) {
                            bWord = false;
                            this.SpellChecker.Add(nWordStart, nWordEnd, sWord, CurLcid);
                        }
                    }
                }
            }
            CheckLang = false;
        } else {
            if (pararecalc_0_Spell_Pos === this.RecalcInfo.Recalc_0_Spell.Type) {
                var StartPos = this.RecalcInfo.Recalc_0_Spell.StartPos;
                var EndPos = Math.min(this.RecalcInfo.Recalc_0_Spell.EndPos, this.Content.length - 1);
                var BoundElements = this.SpellChecker.Get_ElementsBeforeAfterPos(StartPos, EndPos);
                this.SpellChecker.Clear();
                var CountBefore = BoundElements.Before.length;
                for (var Pos = 0; Pos < CountBefore; Pos++) {
                    this.SpellChecker.Elements.push(BoundElements.Before[Pos]);
                }
                var Pr = this.Get_CompiledPr();
                var CurTextPr = Pr.TextPr;
                var CurLcid = CurTextPr.Lang.Val;
                var bWord = false;
                var sWord = "";
                var nWordStart = 0;
                var nWordEnd = 0;
                for (var Pos = StartPos; Pos <= EndPos; Pos++) {
                    var Item = this.Content[Pos];
                    if (para_TextPr === Item.Type) {
                        CurTextPr = this.Internal_CalculateTextPr(Pos);
                        if (true === bWord && CurLcid != CurTextPr.Lang.Val) {
                            bWord = false;
                            this.SpellChecker.Add(nWordStart, nWordEnd, sWord, CurLcid);
                        }
                        CurLcid = CurTextPr.Lang.Val;
                        continue;
                    } else {
                        if (para_Text === Item.Type && false === Item.Is_Punctuation() && false === Item.Is_NBSP()) {
                            if (false === bWord) {
                                bWord = true;
                                nWordStart = Pos;
                                nWordEnd = Pos;
                                if (true != CurTextPr.Caps) {
                                    sWord = Item.Value;
                                } else {
                                    sWord = Item.Value.toUpperCase();
                                }
                            } else {
                                if (true != CurTextPr.Caps) {
                                    sWord += Item.Value;
                                } else {
                                    sWord += Item.Value.toUpperCase();
                                }
                                nWordEnd = Pos;
                            }
                        } else {
                            if (true === bWord) {
                                bWord = false;
                                this.SpellChecker.Add(nWordStart, nWordEnd, sWord, CurLcid);
                            }
                        }
                    }
                }
                if (true === bWord) {
                    this.SpellChecker.Add(nWordStart, nWordEnd, sWord, CurLcid);
                }
                var CountAfter = BoundElements.After.length;
                for (var Pos = 0; Pos < CountAfter; Pos++) {
                    this.SpellChecker.Elements.push(BoundElements.After[Pos]);
                }
                CheckLang = true;
            } else {
                if (pararecalc_0_Spell_Lang === this.RecalcInfo.Recalc_0_Spell.Type) {
                    CheckLang = true;
                }
            }
        }
    }
    if (true === CheckLang) {
        var WordsCount = this.SpellChecker.Elements.length;
        for (var ElemId = 0; ElemId < WordsCount; ElemId++) {
            var Element = this.SpellChecker.Elements[ElemId];
            var CurLang = Element.Lang;
            var Lang = this.Internal_GetLang(Element.EndPos);
            if (CurLang != Lang.Val) {
                Element.Lang = Lang.Val;
                Element.Checked = null;
            }
        }
    }
    this.SpellChecker.RecalcId = this.LogicDocument.RecalcId;
    this.SpellChecker.ParaId = this.Get_Id();
    this.SpellChecker.Check();
    this.RecalcInfo.Recalc_0_Spell.Type = pararecalc_0_Spell_None;
};