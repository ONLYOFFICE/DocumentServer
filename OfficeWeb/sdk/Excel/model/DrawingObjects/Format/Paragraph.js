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
 var type_Paragraph = 1;
var type_Table = 2;
var UnknownValue = null;
var docpostype_Content = 0;
var docpostype_FlowObjects = 1;
var docpostype_HdrFtr = 2;
var docpostype_FlowShape = 3;
var selectionflag_Common = 0;
var selectionflag_Numbering = 1;
var selectionflag_DrawingObject = 2;
function Paragraph(DrawingDocument, Parent, PageNum, X, Y, XLimit, YLimit) {
    this.Id = g_oIdCounter.Get_NewId();
    this.Prev = null;
    this.Next = null;
    this.Index = -1;
    this.Parent = null;
    this.PageNum = PageNum;
    this.X = X;
    this.Y = Y;
    this.XLimit = XLimit;
    this.YLimit = YLimit;
    this.CompiledPr = {
        Pr: null,
        NeedRecalc: true
    };
    this.Pr = new CParaPr();
    this.TextPr = null;
    this.Bounds = new CDocumentBounds(X, Y, 4000, Y);
    this.RecalcInfo = new CParaRecalcInfo();
    this.Pages = new Array();
    this.Lines = new Array();
    this.Content = new Array();
    this.Content[0] = new ParaNumbering();
    this.Content[1] = new ParaEnd();
    this.Content[2] = new ParaEmpty();
    this.CurPos = {
        X: 0,
        Y: 0,
        ContentPos: 0,
        Line: -1,
        RealX: 0,
        RealY: 0,
        PagesPos: 0
    };
    this.Selection = {
        Start: false,
        Use: false,
        StartPos: 0,
        EndPos: 0,
        Flag: selectionflag_Common
    };
    this.NeedReDraw = true;
    this.DrawingDocument = null;
    this.TurnOffRecalcEvent = false;
    this.ApplyToAll = false;
    this.DeleteCollaborativeMarks = true;
    this.DeleteCommentOnRemove = true;
    this.m_oContentChanges = new CContentChanges();
    this.PresentationPr = {
        Level: 0,
        Bullet: new CPresentationBullet()
    };
    this.FontMap = {
        Map: {},
        NeedRecalc: true
    };
    this.SearchResults = new Object();
    g_oTableId.Add(this, this.Id);
    if (isRealObject(Parent)) {
        this.setDrawingDocument(DrawingDocument);
        this.setParent(Parent);
        this.setTextPr(new ParaTextPr());
    }
}
Paragraph.prototype = {
    setDrawingDocument: function (drawingDocument) {
        var oldValue = isRealObject(this.DrawingDocument) && isRealObject(this.DrawingDocument.drawingObjects) ? this.DrawingDocument.drawingObjects.getWorksheet().model.getId() : null;
        var newValue = isRealObject(drawingDocument) && isRealObject(drawingDocument.drawingObjects) && drawingDocument.drawingObjects.getWorksheet() ? drawingDocument.drawingObjects.getWorksheet().model.getId() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_AddDrawingDocument, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.DrawingDocument = drawingDocument;
    },
    setParent: function (parent) {
        var oldValue = isRealObject(this.Parent) ? this.Parent.Get_Id() : null;
        var newValue = isRealObject(parent) ? parent.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_AddParent, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.Parent = parent;
    },
    setTextPr: function (textPr) {
        var oldValue = isRealObject(this.TextPr) ? this.TextPr.getValue() : null;
        var newValue = isRealObject(textPr) ? textPr.getValue() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetTextPr, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
        this.TextPr = textPr;
        textPr.setParent(this);
    },
    checkThemeFonts: function (theme) {
        function checkTextPr(para_item, theme) {
            if (isRealObject(para_item) && para_item.Type === para_TextPr) {
                var text_pr = para_item.Value;
                if (isRealObject(text_pr.FontFamily) && isThemeFont(text_pr.FontFamily.Name)) {
                    if (theme && theme.themeElements && theme.themeElements.fontScheme) {
                        text_pr.FontFamily.Name = getFontInfo(text_pr.FontFamily.Name)(theme.themeElements.fontScheme);
                    } else {
                        text_pr.FontFamily.Name = "Arial";
                    }
                }
                if (isRealObject(text_pr.RFonts)) {
                    if (isRealObject(text_pr.RFonts.Ascii) && isThemeFont(text_pr.RFonts.Ascii.Name)) {
                        if (theme && theme.themeElements && theme.themeElements.fontScheme) {
                            text_pr.RFonts.Ascii.Name = getFontInfo(text_pr.RFonts.Ascii.Name)(theme.themeElements.fontScheme);
                        } else {
                            text_pr.RFonts.Ascii.Name = "Arial";
                        }
                    }
                    if (isRealObject(text_pr.RFonts.CS) && isThemeFont(text_pr.RFonts.CS.Name)) {
                        if (theme && theme.themeElements && theme.themeElements.fontScheme) {
                            text_pr.RFonts.CS.Name = getFontInfo(text_pr.RFonts.CS.Name)(theme.themeElements.fontScheme);
                        } else {
                            text_pr.RFonts.CS.Name = "Arial";
                        }
                    }
                    if (isRealObject(text_pr.RFonts.EastAsia) && isThemeFont(text_pr.RFonts.EastAsia.Name)) {
                        if (theme && theme.themeElements && theme.themeElements.fontScheme) {
                            text_pr.RFonts.EastAsia.Name = getFontInfo(text_pr.RFonts.EastAsia.Name)(theme.themeElements.fontScheme);
                        } else {
                            text_pr.RFonts.EastAsia.Name = "Arial";
                        }
                    }
                    if (isRealObject(text_pr.RFonts.HAnsi) && isThemeFont(text_pr.RFonts.HAnsi.Name)) {
                        if (theme && theme.themeElements && theme.themeElements.fontScheme) {
                            text_pr.RFonts.HAnsi.Name = getFontInfo(text_pr.RFonts.HAnsi.Name)(theme.themeElements.fontScheme);
                        } else {
                            text_pr.RFonts.HAnsi.Name = "Arial";
                        }
                    }
                }
            }
        }
        for (var i = 0; i < this.Content.length; ++i) {
            var para_item = this.Content[i];
            checkTextPr(para_item, theme);
        }
        checkTextPr(this.TextPr, theme);
    },
    getObjectType: function () {
        return CLASS_TYPE_PARAGRAPH;
    },
    getType: function () {
        return CLASS_TYPE_PARAGRAPH;
    },
    recalculateFonts: function () {
        var theme = this.Parent.getTheme();
        var color_map = this.Parent.getColorMap();
        var TextPr = this.CompiledPr.Pr.TextPr;
        if (isRealObject(TextPr.unifill) && isRealObject(TextPr.unifill.fill)) {
            if (typeof TextPr.themeFont === "string") {
                var font_name = getFontInfo(TextPr.themeFont)(theme.themeElements.fontScheme);
                TextPr.FontFamily = {
                    Name: font_name,
                    Index: -1
                };
            }
        }
        for (var i = 0; i < this.Content.length; ++i) {
            if (this.Content[i].Type === para_TextPr) {
                TextPr = this.Content[i].Value;
                if (typeof TextPr.themeFont === "string") {
                    var font_name = getFontInfo(TextPr.themeFont)(theme.themeElements.fontScheme);
                    TextPr.FontFamily = {
                        Name: font_name,
                        Index: -1
                    };
                }
            }
        }
    },
    recalculateTextPr: function () {
        var theme = this.Parent.getTheme();
        var color_map = this.Parent.getColorMap();
        var TextPr = this.CompiledPr.Pr.TextPr;
        if (isRealObject(TextPr.unifill) && isRealObject(TextPr.unifill.fill)) {
            TextPr.unifill.calculate(theme, color_map, {
                R: 0,
                G: 0,
                B: 0,
                A: 255
            });
            if (isRealObject(TextPr.unifill.fill.color)) {
                var color = TextPr.unifill.fill.color.RGBA;
                TextPr.Color = new CDocumentColor(color.R, color.G, color.B);
            } else {
                if (Array.isArray(TextPr.unifill.fill.colors) && isRealObject(TextPr.unifill.fill.colors[0])) {
                    var color = TextPr.unifill.fill.colors[0].RGBA;
                    TextPr.Color = new CDocumentColor(color.R, color.G, color.B);
                }
            }
        }
        for (var i = 0; i < this.Content.length; ++i) {
            if (this.Content[i].Type === para_TextPr) {
                TextPr = this.Content[i].Value;
                if (isRealObject(TextPr.unifill) && isRealObject(TextPr.unifill.fill)) {
                    TextPr.unifill.calculate(theme, color_map, {
                        R: 0,
                        G: 0,
                        B: 0,
                        A: 255
                    });
                    if (isRealObject(TextPr.unifill.fill.color)) {
                        var color = TextPr.unifill.fill.color.RGBA;
                        TextPr.Color = new CDocumentColor(color.R, color.G, color.B);
                    } else {
                        if (Array.isArray(TextPr.unifill.fill.colors) && isRealObject(TextPr.unifill.fill.colors[0])) {
                            var color = TextPr.unifill.fill.colors[0].RGBA;
                            TextPr.Color = new CDocumentColor(color.R, color.G, color.B);
                        }
                    }
                }
            }
        }
    },
    GetType: function () {
        return type_Paragraph;
    },
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
    Copy: function (Parent) {
        var Para = new Paragraph(this.DrawingDocument, Parent, 0, 0, 0, 0, 0);
        var Pr_old = Para.Pr;
        var Pr_new = this.Pr.Copy();
        History.Add(g_oUndoRedoGraphicObjects, historyitem_Paragraph_Pr, null, null, new UndoRedoDataGraphicObjects(Para.Get_Id(), new UndoRedoDataGOSingleProp(new UndoRedoDataParaPr(Pr_old), new UndoRedoDataParaPr(Pr_new))));
        Para.Pr = Pr_new;
        Para.TextPr.Set_Value(this.TextPr.Value);
        Para.Internal_Content_Remove2(0, Para.Content.length);
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            var Item = this.Content[Index];
            if (true === Item.Is_RealContent()) {
                Para.Internal_Content_Add(Para.Content.length, Item.Copy());
            }
        }
        return Para;
    },
    Get_AllDrawingObjects: function (DrawingObjs) {
        if (undefined === DrawingObjs) {
            DrawingObjs = new Array();
        }
        var Count = this.Content.length;
        for (var Pos = 0; Pos < Count; Pos++) {
            var Item = this.Content[Pos];
            if (para_Drawing === Item.Type) {
                DrawingObjs.push(Item);
            }
        }
        return DrawingObjs;
    },
    Get_AllParagraphs_ByNumbering: function (NumPr, ParaArray) {
        var _NumPr = this.Numbering_Get();
        if (undefined != _NumPr && _NumPr.NumId === NumPr.NumId && _NumPr.Lvl === NumPr.Lvl) {
            ParaArray.push(this);
        }
        var Count = this.Content.length;
        for (var Pos = 0; Pos < Count; Pos++) {
            var Item = this.Content[Pos];
            if (para_Drawing === Item.Type) {
                Item.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
            }
        }
    },
    Get_PageBounds: function (PageIndex) {
        return this.Pages[PageIndex].Bounds;
    },
    Reset: function (X, Y, XLimit, YLimit, PageNum) {
        this.X = X;
        this.Y = Y;
        this.XLimit = XLimit;
        this.YLimit = YLimit;
        this.PageNum = PageNum;
        if (null === this.Parent.RecalcInfo.FlowObject) {
            var Ranges = this.Parent.CheckRange(X, Y, XLimit, Y, Y, Y, X, XLimit, this.PageNum, true);
            if (Ranges.length > 0) {
                if (Math.abs(Ranges[0].X0 - X) < 0.001) {
                    this.X_ColumnStart = Ranges[0].X1;
                } else {
                    this.X_ColumnStart = X;
                }
                if (Math.abs(Ranges[Ranges.length - 1].X1 - XLimit) < 0.001) {
                    this.X_ColumnEnd = Ranges[Ranges.length - 1].X0;
                } else {
                    this.X_ColumnEnd = XLimit;
                }
            } else {
                this.X_ColumnStart = X;
                this.X_ColumnEnd = XLimit;
            }
        }
    },
    CopyPr: function (OtherParagraph) {
        return this.CopyPr_Open(OtherParagraph);
    },
    CopyPr_Open: function (OtherParagraph) {
        OtherParagraph.X = this.X;
        OtherParagraph.XLimit = this.XLimit;
        if ("undefined" != typeof(OtherParagraph.NumPr)) {
            OtherParagraph.Numbering_Remove();
        }
        var NumPr = this.Numbering_Get();
        if (undefined != NumPr) {
            OtherParagraph.Numbering_Add(NumPr.NumId, NumPr.Lvl);
        }
        var Bullet = this.Get_PresentationNumbering();
        if (numbering_presentationnumfrmt_None != Bullet.Get_Type()) {
            OtherParagraph.Add_PresentationNumbering(Bullet.Copy());
        }
        OtherParagraph.Set_PresentationLevel(this.PresentationPr.Level);
        var oOldPr = OtherParagraph.Pr;
        OtherParagraph.Pr = this.Pr.Copy();
        History.Add(g_oUndoRedoGraphicObjects, historyitem_Paragraph_Pr, null, null, new UndoRedoDataGraphicObjects(OtherParagraph.Get_Id(), new UndoRedoDataGOSingleProp(new UndoRedoDataParaPr(oOldPr), new UndoRedoDataParaPr(OtherParagraph.Pr))));
        OtherParagraph.Style_Add(this.Style_Get(), true);
    },
    Internal_Content_Add: function (Pos, Item) {
        if (true === Item.Is_RealContent()) {
            var type = Item.Type;
            var value = Item.getValue();
            var ClearPos = this.Internal_Get_ClearPos(Pos);
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Paragraph_AddItem, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoData_historyitem_Paragraph_AddItem(ClearPos, ClearPos, [new UndoRedoDataAddParaItem(type, value)])));
        }
        this.Content.splice(Pos, 0, Item);
        if (this.CurPos.ContentPos >= Pos) {
            this.CurPos.ContentPos++;
        }
        if (this.Selection.StartPos >= Pos) {
            this.Selection.StartPos++;
        }
        if (this.Selection.EndPos >= Pos) {
            this.Selection.EndPos++;
        }
        var LinesCount = this.Lines.length;
        for (var CurLine = 0; CurLine < LinesCount; CurLine++) {
            if (this.Lines[CurLine].StartPos >= Pos) {
                this.Lines[CurLine].StartPos++;
            }
            if (this.Lines[CurLine].EndPos + 1 >= Pos) {
                this.Lines[CurLine].EndPos++;
            }
            var RangesCount = this.Lines[CurLine].Ranges.length;
            for (var CurRange = 0; CurRange < RangesCount; CurRange++) {
                if (this.Lines[CurLine].Ranges[CurRange].StartPos >= Pos) {
                    this.Lines[CurLine].Ranges[CurRange].StartPos++;
                }
            }
        }
        for (var CurSearch in this.SearchResults) {
            if (this.SearchResults[CurSearch].StartPos > Pos) {
                this.SearchResults[CurSearch].StartPos++;
            }
            if (this.SearchResults[CurSearch].EndPos > Pos) {
                this.SearchResults[CurSearch].EndPos++;
            }
        }
    },
    Internal_Content_Concat: function (Items) {
        var NewItems = new Array();
        var ItemsCount = Items.length;
        for (var Index = 0; Index < ItemsCount; Index++) {
            if (true === Items[Index].Is_RealContent()) {
                NewItems.push(Items[Index]);
            }
        }
        if (NewItems.length <= 0) {
            return;
        }
        var StartPos = this.Content.length;
        this.Content = this.Content.concat(NewItems);
        var ids = [];
        for (var i = 0; i < NewItems.length; ++i) {
            var Item = NewItems[i];
            var type = Item.Type;
            var value = Item.getValue();
            ids.push(new UndoRedoDataAddParaItem(type, value));
        }
        History.Add(g_oUndoRedoGraphicObjects, historyitem_Paragraph_AddItem, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoData_historyitem_Paragraph_AddItem(this.Internal_Get_ClearPos(StartPos), this.Internal_Get_ClearPos(this.Content.length - 1), ids)));
        this.RecalcInfo.Set_Type_0_Spell(pararecalc_0_Spell_All);
    },
    Internal_Content_Remove: function (Pos) {
        var Item = this.Content[Pos];
        if (true === Item.Is_RealContent()) {
            var type = Item.Type;
            var value = Item.getValue();
            var ClearPos = this.Internal_Get_ClearPos(Pos);
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Paragraph_RemoveItem, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoData_historyitem_Paragraph_AddItem(ClearPos, ClearPos, [new UndoRedoDataAddParaItem(type, value)])));
        }
        if (this.CurPos.ContentPos > Pos) {
            this.CurPos.ContentPos--;
        }
        if (this.Selection.StartPos <= this.Selection.EndPos) {
            if (this.Selection.StartPos > Pos) {
                this.Selection.StartPos--;
            }
            if (this.Selection.EndPos >= Pos) {
                this.Selection.EndPos--;
            }
        } else {
            if (this.Selection.StartPos >= Pos) {
                this.Selection.StartPos--;
            }
            if (this.Selection.EndPos > Pos) {
                this.Selection.EndPos--;
            }
        }
        var LinesCount = this.Lines.length;
        for (var CurLine = 0; CurLine < LinesCount; CurLine++) {
            if (this.Lines[CurLine].StartPos > Pos) {
                this.Lines[CurLine].StartPos--;
            }
            if (this.Lines[CurLine].EndPos >= Pos) {
                this.Lines[CurLine].EndPos--;
            }
            var RangesCount = this.Lines[CurLine].Ranges.length;
            for (var CurRange = 0; CurRange < RangesCount; CurRange++) {
                if (this.Lines[CurLine].Ranges[CurRange].StartPos > Pos) {
                    this.Lines[CurLine].Ranges[CurRange].StartPos--;
                }
            }
        }
        for (var CurSearch in this.SearchResults) {
            if (this.SearchResults[CurSearch].StartPos > Pos) {
                this.SearchResults[CurSearch].StartPos--;
            }
            if (this.SearchResults[CurSearch].EndPos > Pos) {
                this.SearchResults[CurSearch].EndPos--;
            }
        }
        this.Content.splice(Pos, 1);
        if (true === this.DeleteCommentOnRemove && (para_CommentStart === Item.Type || para_CommentEnd === Item.Type)) {
            if (para_CommentStart === Item.Type) {
                editor.WordControl.m_oLogicDocument.Comments.Set_StartInfo(Item.Id, 0, 0, 0, 0, null);
            } else {
                editor.WordControl.m_oLogicDocument.Comments.Set_EndInfo(Item.Id, 0, 0, 0, 0, null);
            }
            editor.WordControl.m_oLogicDocument.Remove_Comment(Item.Id, true);
        }
    },
    Internal_Content_Remove2: function (Pos, Count) {
        var LastArray = this.Content.slice(Pos, Pos + Count);
        var LastItems = new Array();
        var ItemsCount = LastArray.length;
        for (var Index = 0; Index < ItemsCount; Index++) {
            if (true === LastArray[Index].Is_RealContent()) {
                LastItems.push(LastArray[Index]);
            }
        }
        var ids = [];
        for (var i = 0; i < LastItems.length; ++i) {
            var type = LastItems[i].Type;
            var value = LastItems[i].getValue();
            ids.push(new UndoRedoDataAddParaItem(type, value));
        }
        History.Add(g_oUndoRedoGraphicObjects, historyitem_Paragraph_RemoveItem, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoData_historyitem_Paragraph_AddItem(this.Internal_Get_ClearPos(Pos), this.Internal_Get_ClearPos(Pos + Count - 1), ids)));
        if (this.CurPos.ContentPos > Pos) {
            if (this.CurPos.ContentPos > Pos + Count) {
                this.CurPos.ContentPos -= Count;
            } else {
                this.CurPos.ContentPos = Pos;
            }
            this.CurPos.Line = -1;
        }
        if (this.Selection.StartPos <= this.Selection.EndPos) {
            if (this.Selection.StartPos > Pos) {
                if (this.Selection.StartPos > Pos + Count) {
                    this.Selection.StartPos -= Count;
                } else {
                    this.Selection.StartPos = Pos;
                }
            }
            if (this.Selection.EndPos >= Pos) {
                if (this.Selection.EndPos >= Pos + Count) {
                    this.Selection.EndPos -= Count;
                } else {
                    this.Selection.EndPos = Math.max(0, Pos - 1);
                }
            }
        } else {
            if (this.Selection.StartPos >= Pos) {
                if (this.Selection.StartPos >= Pos + Count) {
                    this.Selection.StartPos -= Count;
                } else {
                    this.Selection.StartPos = Math.max(0, Pos - 1);
                }
            }
            if (this.Selection.EndPos > Pos) {
                if (this.Selection.EndPos > Pos + Count) {
                    this.Selection.EndPos -= Count;
                } else {
                    this.Selection.EndPos = Pos;
                }
            }
        }
        var LinesCount = this.Lines.length;
        for (var CurLine = 0; CurLine < LinesCount; CurLine++) {
            if (this.Lines[CurLine].StartPos > Pos) {
                if (this.Lines[CurLine].StartPos > Pos + Count) {
                    this.Lines[CurLine].StartPos -= Count;
                } else {
                    this.Lines[CurLine].StartPos = Math.max(0, Pos);
                }
            }
            if (this.Lines[CurLine].EndPos >= Pos) {
                if (this.Lines[CurLine].EndPos >= Pos + Count) {
                    this.Lines[CurLine].EndPos -= Count;
                } else {
                    this.Lines[CurLine].EndPos = Math.max(0, Pos);
                }
            }
            var RangesCount = this.Lines[CurLine].Ranges.length;
            for (var CurRange = 0; CurRange < RangesCount; CurRange++) {
                if (this.Lines[CurLine].Ranges[CurRange].StartPos > Pos) {
                    if (this.Lines[CurLine].Ranges[CurRange].StartPos > Pos + Count) {
                        this.Lines[CurLine].Ranges[CurRange].StartPos -= Count;
                    } else {
                        this.Lines[CurLine].Ranges[CurRange].StartPos = Math.max(0, Pos);
                    }
                }
            }
        }
        this.Content.splice(Pos, Count);
    },
    Clear_ContentChanges: function () {
        this.m_oContentChanges.Clear();
    },
    Add_ContentChanges: function (Changes) {
        this.m_oContentChanges.Add(Changes);
    },
    Refresh_ContentChanges: function () {
        this.m_oContentChanges.Refresh();
    },
    Internal_Get_ParaPos_By_Pos: function (ContentPos) {
        var _ContentPos = ContentPos;
        while (undefined === this.Content[_ContentPos].CurPage) {
            _ContentPos--;
            if (_ContentPos < 0) {
                return new CParaPos(0, 0, 0, 0);
            }
        }
        return new CParaPos(this.Content[_ContentPos].CurRange, this.Content[_ContentPos].CurLine, this.Content[_ContentPos].CurPage, ContentPos);
    },
    Internal_Get_ParaPos_By_Page: function (Page) {
        var CurPage = Page;
        var CurLine = this.Pages[CurPage].StartLine;
        var CurRange = 0;
        var CurPos = this.Lines[CurLine].StartPos;
        return new CParaPos(CurRange, CurLine, CurPage, CurPos);
    },
    Internal_Update_ParaPos: function (CurPage, CurLine, CurRange, CurPos) {
        var _CurPage = CurPage;
        var _CurLine = CurLine;
        var _CurRange = CurRange;
        while (_CurPage < this.Pages.length - 1) {
            if (this.Lines[this.Pages[_CurPage + 1].StartLine].StartPos <= CurPos) {
                _CurPage++;
                _CurLine = this.Pages[_CurPage].StartLine;
                _CurRange = 0;
            } else {
                break;
            }
        }
        while (_CurLine < this.Lines.length - 1) {
            if (this.Lines[_CurLine + 1].StartPos <= CurPos) {
                _CurLine++;
                _CurRange = 0;
            } else {
                break;
            }
        }
        while (_CurRange < this.Lines[_CurLine].Ranges.length - 1) {
            if (this.Lines[_CurLine].Ranges[_CurRange + 1].StartPos <= CurPos) {
                _CurRange++;
            } else {
                break;
            }
        }
        return new CParaPos(_CurRange, _CurLine, _CurPage, CurPos);
    },
    Internal_Recalculate_0: function () {
        if (pararecalc_0_None === this.RecalcInfo.Recalc_0_Type) {
            return;
        }
        var Pr = this.Get_CompiledPr();
        var ParaPr = Pr.ParaPr;
        var CurTextPr = Pr.TextPr;
        g_oTextMeasurer.SetTextPr(CurTextPr);
        var TextAscent = 0;
        var TextHeight = 0;
        var TextDescent = 0;
        g_oTextMeasurer.SetFontSlot(fontslot_ASCII);
        TextHeight = g_oTextMeasurer.GetHeight();
        TextDescent = Math.abs(g_oTextMeasurer.GetDescender());
        TextAscent = TextHeight - TextDescent;
        var ContentLength = this.Content.length;
        for (var Pos = 0; Pos < ContentLength; Pos++) {
            var Item = this.Content[Pos];
            Item.Parent = this;
            Item.DocumentContent = this.Parent;
            Item.DrawingDocument = this.Parent.DrawingDocument;
            switch (Item.Type) {
            case para_Numbering:
                break;
            case para_PresentationNumbering:
                var Level = this.PresentationPr.Level;
                var Bullet = this.PresentationPr.Bullet;
                var BulletNum = 0;
                if (Bullet.Get_Type() >= numbering_presentationnumfrmt_ArabicPeriod) {
                    var Prev = this.Prev;
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
                var FirstTextPr = this.Internal_CalculateTextPr(this.Internal_GetStartPos());
                Item.Bullet = Bullet;
                Item.BulletNum = BulletNum + 1;
                Item.Measure(g_oTextMeasurer, FirstTextPr);
                break;
            case para_Text:
                case para_Space:
                Item.Measure(g_oTextMeasurer, CurTextPr);
                break;
            case para_Drawing:
                case para_PageNum:
                case para_Tab:
                case para_NewLine:
                Item.Measure(g_oTextMeasurer);
                break;
            case para_TextPr:
                CurTextPr = this.Internal_CalculateTextPr(Pos);
                g_oTextMeasurer.SetTextPr(CurTextPr);
                g_oTextMeasurer.SetFontSlot(fontslot_ASCII);
                TextDescent = Math.abs(g_oTextMeasurer.GetDescender());
                TextHeight = g_oTextMeasurer.GetHeight();
                TextAscent = TextHeight - TextDescent;
                break;
            case para_End:
                var bEndCell = false;
                if (null === this.Get_DocumentNext() && true === this.Parent.Is_TableCellContent()) {
                    bEndCell = true;
                }
                var EndTextPr = this.Get_CompiledPr2(false).TextPr.Copy();
                EndTextPr.Merge(this.TextPr.Value);
                g_oTextMeasurer.SetTextPr(EndTextPr);
                Item.Measure(g_oTextMeasurer, bEndCell);
                g_oTextMeasurer.SetTextPr(CurTextPr);
                break;
            }
            Item.TextAscent = TextAscent;
            Item.TextDescent = TextDescent;
            Item.TextHeight = TextHeight;
            Item.YOffset = CurTextPr.Position;
        }
        this.RecalcInfo.Set_Type_0(pararecalc_0_None);
    },
    Internal_Recalculate_1_: function (StartPos, CurPage, _CurLine) {
        var Pr = this.Get_CompiledPr();
        var ParaPr = Pr.ParaPr;
        var CurLine = _CurLine;
        var X, Y, XLimit, YLimit, _X, _XLimit;
        if (0 === CurPage) {
            X = this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
            Y = this.Y;
            XLimit = this.XLimit - ParaPr.Ind.Right;
            YLimit = this.YLimit;
            _X = this.X;
            _XLimit = this.XLimit;
        } else {
            var PageStart = this.Parent.Get_PageContentStartPos(this.PageNum + CurPage);
            X = (0 != CurLine ? PageStart.X + ParaPr.Ind.Left : PageStart.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine);
            Y = PageStart.Y;
            XLimit = PageStart.XLimit - ParaPr.Ind.Right;
            YLimit = PageStart.YLimit;
            _X = PageStart.X;
            _XLimit = PageStart.XLimit;
        }
        this.Pages.length = CurPage + 1;
        this.Pages[CurPage] = new CParaPage(_X, Y, _XLimit, YLimit, CurLine);
        var LineStart_Pos = StartPos;
        if (0 === CurPage) {
            if (ParaPr.Ind.FirstLine <= 0) {
                this.Bounds.Left = X;
            } else {
                this.Bounds.Left = this.X + ParaPr.Ind.Left;
            }
            this.Bounds.Right = XLimit;
        }
        var bFirstItemOnLine = true;
        var bEmptyLine = true;
        var bStartWord = false;
        var bWord = false;
        var nWordStartPos = 0;
        var nWordLen = 0;
        var nSpaceLen = 0;
        var nSpacesCount = 0;
        var pLastTab = {
            TabPos: 0,
            X: 0,
            Value: -1,
            Item: null
        };
        var bNewLine = false;
        var bNewRange = false;
        var bNewPage = false;
        var bExtendBoundToBottom = false;
        var bEnd = false;
        var bForceNewPage = false;
        var bBreakPageLine = false;
        var Ranges = [];
        var RangesCount = Ranges.length;
        var TextAscent = 0;
        var TextDescent = 0;
        this.Lines.length = CurLine + 1;
        this.Lines[CurLine] = new CParaLine(StartPos);
        var LineTextAscent = 0;
        var LineTextDescent = 0;
        var LineAscent = 0;
        var LineDescent = 0;
        this.Lines[CurLine].Add_Range(X, (RangesCount == 0 ? XLimit : Ranges[0].X0));
        this.Lines[CurLine].Set_RangeStartPos(0, StartPos);
        for (var Index = 1; Index < Ranges.length + 1; Index++) {
            this.Lines[CurLine].Add_Range(Ranges[Index - 1].X1, (Index == RangesCount ? XLimit : Ranges[Index].X0));
        }
        var CurRange = 0;
        var XEnd = 0;
        if (RangesCount == 0) {
            XEnd = XLimit;
        } else {
            XEnd = Ranges[0].X0;
        }
        if (0 === CurPage && true === ParaPr.PageBreakBefore && this.Parent === editor.WordControl.m_oLogicDocument) {
            var Prev = this.Get_DocumentPrev();
            if (null != Prev) {
                this.Pages[CurPage].Set_EndLine(CurLine - 1);
                if (0 === CurLine) {
                    this.Lines[-1] = new CParaLine(0);
                    this.Lines[-1].Set_EndPos(StartPos - 1, this);
                }
                return recalcresult_NextPage;
            }
        } else {
            if (this === this.Parent.RecalcInfo.WidowControlParagraph && CurLine === this.Parent.RecalcInfo.WidowControlLine) {
                this.Parent.RecalcInfo.WidowControlParagraph = null;
                this.Parent.RecalcInfo.WidowControlLine = -1;
                this.Pages[CurPage].Set_EndLine(CurLine - 1);
                if (0 === CurLine) {
                    this.Lines[-1] = new CParaLine(0);
                    this.Lines[-1].Set_EndPos(LineStart_Pos - 1, this);
                }
                return recalcresult_NextPage;
            }
        }
        var RecalcResult = recalcresult_NextElement;
        for (var Pos = LineStart_Pos; Pos < this.Content.length; Pos++) {
            if (false === bStartWord && true === bFirstItemOnLine && Math.abs(XEnd - X) < 0.001 && RangesCount > 0) {
                if (RangesCount == CurRange) {
                    Pos--;
                    bNewLine = true;
                } else {
                    Pos--;
                    bNewRange = true;
                }
            }
            if (true != bNewLine && true != bNewRange) {
                var Item = this.Content[Pos];
                Item.Parent = this;
                Item.DocumentContent = this.Parent;
                Item.DrawingDocument = this.Parent.DrawingDocument;
                if (undefined != Item.TextAscent) {
                    TextAscent = Item.TextAscent;
                }
                if (undefined != Item.TextDescent) {
                    TextDescent = Item.TextDescent;
                }
                Item.CurPage = CurPage;
                Item.CurLine = CurLine;
                Item.CurRange = CurRange;
                var bBreak = false;
                switch (Item.Type) {
                case para_Numbering:
                    var NumPr = ParaPr.NumPr;
                    if (undefined === NumPr || undefined === NumPr.NumId || 0 === NumPr.NumId) {
                        Item.Measure(g_oTextMeasurer, undefined);
                        break;
                    }
                    var Numbering = this.Parent.Get_Numbering();
                    var NumLvl = Numbering.Get_AbstractNum(NumPr.NumId).Lvl[NumPr.Lvl];
                    var NumSuff = NumLvl.Suff;
                    var NumJc = NumLvl.Jc;
                    var NumInfo = this.Parent.Internal_GetNumInfo(this.Id, NumPr);
                    var NumTextPr = this.Get_CompiledPr2(false).TextPr.Copy();
                    NumTextPr.Merge(this.TextPr.Value);
                    NumTextPr.Merge(NumLvl.TextPr);
                    Item.Measure(g_oTextMeasurer, Numbering, NumInfo, NumTextPr, NumPr);
                    if (LineAscent < Item.Height) {
                        LineAscent = Item.Height;
                    }
                    switch (NumJc) {
                    case align_Right:
                        Item.WidthVisible = 0;
                        break;
                    case align_Center:
                        Item.WidthVisible = Item.WidthNum / 2;
                        X += Item.WidthNum / 2;
                        break;
                    case align_Left:
                        default:
                        Item.WidthVisible = Item.WidthNum;
                        X += Item.WidthNum;
                        break;
                    }
                    switch (NumSuff) {
                    case numbering_suff_Nothing:
                        break;
                    case numbering_suff_Space:
                        var OldTextPr = g_oTextMeasurer.GetTextPr();
                        g_oTextMeasurer.SetTextPr(NumTextPr);
                        g_oTextMeasurer.SetFontSlot(fontslot_ASCII);
                        Item.WidthSuff = g_oTextMeasurer.Measure(" ").Width;
                        g_oTextMeasurer.SetTextPr(OldTextPr);
                        break;
                    case numbering_suff_Tab:
                        var NewX = null;
                        var PageStart = this.Parent.Get_PageContentStartPos(this.PageNum + CurPage);
                        var TabsCount = ParaPr.Tabs.Get_Count();
                        var TabsPos = new Array();
                        var bCheckLeft = true;
                        for (var Index = 0; Index < TabsCount; Index++) {
                            var Tab = ParaPr.Tabs.Get(Index);
                            var TabPos = Tab.Pos + PageStart.X;
                            if (true === bCheckLeft && TabPos > PageStart.X + ParaPr.Ind.Left) {
                                TabsPos.push(PageStart.X + ParaPr.Ind.Left);
                                bCheckLeft = false;
                            }
                            if (tab_Clear != Tab.Value) {
                                TabsPos.push(TabPos);
                            }
                        }
                        if (true === bCheckLeft) {
                            TabsPos.push(PageStart.X + ParaPr.Ind.Left);
                        }
                        TabsCount++;
                        for (var Index = 0; Index < TabsCount; Index++) {
                            var TabPos = TabsPos[Index];
                            if (X < TabPos) {
                                NewX = TabPos;
                                break;
                            }
                        }
                        if (null === NewX) {
                            if (X < PageStart.X + ParaPr.Ind.Left) {
                                NewX = PageStart.X + ParaPr.Ind.Left;
                            } else {
                                NewX = this.X;
                                while (X >= NewX) {
                                    NewX += Default_Tab_Stop;
                                }
                            }
                        }
                        Item.WidthSuff = NewX - X;
                        break;
                    }
                    Item.Width = Item.WidthNum;
                    Item.WidthVisible += Item.WidthSuff;
                    X += Item.WidthSuff;
                    break;
                case para_PresentationNumbering:
                    var Bullet = this.PresentationPr.Bullet;
                    if (numbering_presentationnumfrmt_None != Bullet.Get_Type()) {
                        if (ParaPr.Ind.FirstLine < 0) {
                            Item.WidthVisible = Math.max(Item.Width, this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine - X, this.X + ParaPr.Ind.Left - X);
                        } else {
                            Item.WidthVisible = Math.max(this.X + ParaPr.Ind.Left + Item.Width - X, this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine - X, this.X + ParaPr.Ind.Left - X);
                        }
                    }
                    X += Item.WidthVisible;
                    break;
                case para_Text:
                    bStartWord = true;
                    if (LineTextAscent < TextAscent) {
                        LineTextAscent = TextAscent;
                    }
                    if (LineTextDescent < TextDescent) {
                        LineTextDescent = TextDescent;
                    }
                    if (LineAscent < TextAscent + Item.YOffset) {
                        LineAscent = TextAscent + Item.YOffset;
                    }
                    if (LineDescent < TextDescent - Item.YOffset) {
                        LineDescent = TextDescent - Item.YOffset;
                    }
                    if (!bWord) {
                        var LetterLen = Item.Width;
                        if (!bFirstItemOnLine || 0 != RangesCount) {
                            if (X + nSpaceLen + LetterLen > XEnd) {
                                if (RangesCount == CurRange) {
                                    bNewLine = true;
                                    Pos--;
                                } else {
                                    bNewRange = true;
                                    Pos--;
                                }
                            }
                        }
                        if (!bNewLine && !bNewRange) {
                            nWordStartPos = Pos;
                            nWordLen = Item.Width;
                            bWord = true;
                            this.Lines[CurLine].Words++;
                            if (!bNewRange) {
                                this.Lines[CurLine].Ranges[CurRange].Words++;
                            }
                        }
                    } else {
                        var LetterLen = Item.Width;
                        if (X + nSpaceLen + nWordLen + LetterLen > XEnd) {
                            if (bFirstItemOnLine) {
                                if (0 == RangesCount) {
                                    bEmptyLine = false;
                                    X += nWordLen;
                                    Pos--;
                                    bNewLine = true;
                                } else {
                                    if (RangesCount != CurRange) {
                                        Pos = nWordStartPos - 1;
                                        bNewRange = true;
                                    } else {
                                        Pos = nWordStartPos - 1;
                                        bNewLine = true;
                                    }
                                }
                            } else {
                                Pos = nWordStartPos;
                                if (RangesCount == CurRange) {
                                    Pos--;
                                    bNewLine = true;
                                    this.Lines[CurLine].Words--;
                                    this.Lines[CurLine].Ranges[CurRange].Words--;
                                } else {
                                    Pos--;
                                    bNewRange = true;
                                    this.Lines[CurLine].Ranges[CurRange].Words--;
                                }
                            }
                        }
                        if (!bNewLine && !bNewRange) {
                            nWordLen += LetterLen;
                            if (true === Item.SpaceAfter) {
                                X += nSpaceLen;
                                X += nWordLen;
                                if (this.Lines[CurLine].Words > 1) {
                                    this.Lines[CurLine].Spaces += nSpacesCount;
                                }
                                if (this.Lines[CurLine].Ranges[CurRange].Words > 1) {
                                    this.Lines[CurLine].Ranges[CurRange].Spaces += nSpacesCount;
                                }
                                bWord = false;
                                bFirstItemOnLine = false;
                                bEmptyLine = false;
                                nSpaceLen = 0;
                                nWordLen = 0;
                                nSpacesCount = 0;
                            }
                        }
                    }
                    break;
                case para_Space:
                    bFirstItemOnLine = false;
                    var SpaceLen = Item.Width;
                    if (bWord) {
                        X += nSpaceLen;
                        X += nWordLen;
                        if (this.Lines[CurLine].Words > 1) {
                            this.Lines[CurLine].Spaces += nSpacesCount;
                        }
                        if (this.Lines[CurLine].Ranges[CurRange].Words > 1) {
                            this.Lines[CurLine].Ranges[CurRange].Spaces += nSpacesCount;
                        }
                        bWord = false;
                        bEmptyLine = false;
                        nSpaceLen = 0;
                        nWordLen = 0;
                        nSpacesCount = 1;
                    } else {
                        nSpacesCount++;
                    }
                    nSpaceLen += SpaceLen;
                    break;
                case para_Drawing:
                    if (true === Item.Is_Inline() || true === this.Parent.Is_DrawingShape()) {
                        if (true != Item.Is_Inline()) {
                            Item.Set_DrawingType(drawing_Inline);
                        }
                        if (true === bStartWord) {
                            bFirstItemOnLine = false;
                        }
                        if (bWord || nWordLen > 0) {
                            X += nSpaceLen;
                            X += nWordLen;
                            if (this.Lines[CurLine].Words > 1) {
                                this.Lines[CurLine].Spaces += nSpacesCount;
                            }
                            if (this.Lines[CurLine].Ranges[CurRange].Words > 1) {
                                this.Lines[CurLine].Ranges[CurRange].Spaces += nSpacesCount;
                            }
                            bWord = false;
                            nSpaceLen = 0;
                            nSpacesCount = 0;
                            nWordLen = 0;
                        }
                        if (X + nSpaceLen + Item.Width > XEnd && (false === bFirstItemOnLine || RangesCount > 0)) {
                            if (RangesCount == CurRange) {
                                bNewLine = true;
                                Pos--;
                            } else {
                                bNewRange = true;
                                Pos--;
                            }
                        } else {
                            X += nSpaceLen;
                            if (LineAscent < Item.Height + Item.YOffset) {
                                LineAscent = Item.Height + Item.YOffset;
                            }
                            if (Item.Height + Item.YOffset > this.Lines[CurLine].Metrics.Ascent) {
                                this.Lines[CurLine].Metrics.Ascent = Item.Height + Item.YOffset;
                            }
                            if (-Item.YOffset > this.Lines[CurLine].Metrics.Descent) {
                                this.Lines[CurLine].Metrics.Descent = -Item.YOffset;
                            }
                            X += Item.Width;
                            bFirstItemOnLine = false;
                            bEmptyLine = false;
                            this.Lines[CurLine].Words++;
                            this.Lines[CurLine].Ranges[CurRange].Words++;
                            if (this.Lines[CurLine].Words > 1) {
                                this.Lines[CurLine].Spaces += nSpacesCount;
                            }
                            if (this.Lines[CurLine].Ranges[CurRange].Words > 1) {
                                this.Lines[CurLine].Ranges[CurRange].Spaces += nSpacesCount;
                            }
                        }
                        nSpaceLen = 0;
                        nSpacesCount = 0;
                    } else {
                        var LogicDocument = this.Parent;
                        var DrawingObjects = LogicDocument.DrawingObjects;
                        if (Item === LogicDocument.RecalcInfo.FlowObject && true === LogicDocument.RecalcInfo.FlowObjectPageBreakBefore) {
                            LogicDocument.RecalcInfo.FlowObjectPageBreakBefore = false;
                            LogicDocument.RecalcInfo.FlowObject = null;
                            if (null != this.Get_DocumentPrev() && true != this.Parent.Is_TableCellContent() && 0 === CurPage) {
                                for (var TempPos = StartPos; TempPos < Pos; TempPos++) {
                                    var TempItem = this.Content[TempPos];
                                    if (para_Drawing === TempItem.Type && drawing_Anchor === TempItem.DrawingType && true === TempItem.Use_TextWrap()) {
                                        DrawingObjects.removeById(TempItem.PageNum, TempItem.Get_Id());
                                    }
                                }
                                this.Internal_Content_Add(StartPos, new ParaPageBreakRenderer());
                                this.Pages[CurPage].Set_EndLine(-1);
                                if (0 === CurLine) {
                                    this.Lines[-1] = new CParaLine(0);
                                    this.Lines[-1].Set_EndPos(LineStart_Pos - 1, this);
                                }
                                RecalcResult = recalcresult_NextPage;
                                return;
                            } else {
                                if (CurLine != this.Pages[CurPage].FirstLine) {
                                    this.Internal_Content_Add(LineStart_Pos, new ParaPageBreakRenderer());
                                    this.Pages[CurPage].Set_EndLine(CurLine - 1);
                                    if (0 === CurLine) {
                                        this.Lines[-1] = new CParaLine(0);
                                        this.Lines[-1].Set_EndPos(LineStart_Pos - 1, this);
                                    }
                                    RecalcResult = recalcresult_NextPage;
                                    bBreak = true;
                                    break;
                                } else {
                                    Pos--;
                                    bNewLine = true;
                                    bForceNewPage = true;
                                }
                            }
                            if (bWord || nWordLen > 0) {
                                X += nSpaceLen;
                                X += nWordLen;
                                if (this.Lines[CurLine].Words > 1) {
                                    this.Lines[CurLine].Spaces += nSpacesCount;
                                }
                                if (this.Lines[CurLine].Ranges[CurRange].Words > 1) {
                                    this.Lines[CurLine].Ranges[CurRange].Spaces += nSpacesCount;
                                }
                                bWord = false;
                                nSpaceLen = 0;
                                nSpacesCount = 0;
                                nWordLen = 0;
                            }
                        }
                    }
                    break;
                case para_PageNum:
                    if (bWord || nWordLen > 0) {
                        X += nSpaceLen;
                        X += nWordLen;
                        if (this.Lines[CurLine].Words > 1) {
                            this.Lines[CurLine].Spaces += nSpacesCount;
                        }
                        if (this.Lines[CurLine].Ranges[CurRange].Words > 1) {
                            this.Lines[CurLine].Ranges[CurRange].Spaces += nSpacesCount;
                        }
                        bWord = false;
                        nSpaceLen = 0;
                        nSpacesCount = 0;
                        nWordLen = 0;
                    }
                    if (true === bStartWord) {
                        bFirstItemOnLine = false;
                    }
                    if (LineTextAscent < TextAscent) {
                        LineTextAscent = TextAscent;
                    }
                    if (LineTextDescent < TextDescent) {
                        LineTextDescent = TextDescent;
                    }
                    if (LineAscent < TextAscent + Item.YOffset) {
                        LineAscent = TextAscent + Item.YOffset;
                    }
                    if (LineDescent < TextDescent - Item.YOffset) {
                        LineDescent = TextDescent - Item.YOffset;
                    }
                    if (X + nSpaceLen + Item.Width > XEnd && (false === bFirstItemOnLine || RangesCount > 0)) {
                        if (RangesCount == CurRange) {
                            bNewLine = true;
                            Pos--;
                        } else {
                            bNewRange = true;
                            Pos--;
                        }
                    } else {
                        X += nSpaceLen;
                        X += Item.Width;
                        bFirstItemOnLine = false;
                        bEmptyLine = false;
                        this.Lines[CurLine].Words++;
                        this.Lines[CurLine].Ranges[CurRange].Words++;
                        if (this.Lines[CurLine].Words > 1) {
                            this.Lines[CurLine].Spaces += nSpacesCount;
                        }
                        if (this.Lines[CurLine].Ranges[CurRange].Words > 1) {
                            this.Lines[CurLine].Ranges[CurRange].Spaces += nSpacesCount;
                        }
                    }
                    nSpaceLen = 0;
                    nSpacesCount = 0;
                    break;
                case para_Tab:
                    if (-1 != pLastTab.Value) {
                        var TempTabX = X;
                        if (bWord || nWordLen > 0) {
                            TempTabX += nSpaceLen + nWordLen;
                        }
                        var TabItem = pLastTab.Item;
                        var TabStartX = pLastTab.X;
                        var TabRangeW = TempTabX - TabStartX;
                        var TabValue = pLastTab.Value;
                        var TabPos = pLastTab.TabPos;
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
                        pLastTab.Value = -1;
                        X += TabCalcW;
                    }
                    X += nSpaceLen;
                    X += nWordLen;
                    bWord = false;
                    nSpaceLen = 0;
                    nWordLen = 0;
                    nSpacesCount = 0;
                    this.Lines[CurLine].Ranges[CurRange].Spaces = 0;
                    this.Lines[CurLine].Ranges[CurRange].TabPos = Pos;
                    var PageStart = this.Parent.Get_PageContentStartPos(this.PageNum + CurPage);
                    var TabsCount = ParaPr.Tabs.Get_Count();
                    var TabsPos = new Array();
                    var bCheckLeft = true;
                    for (var Index = 0; Index < TabsCount; Index++) {
                        var Tab = ParaPr.Tabs.Get(Index);
                        var TabPos = Tab.Pos + PageStart.X;
                        if (true === bCheckLeft && TabPos > PageStart.X + ParaPr.Ind.Left) {
                            TabsPos.push(PageStart.X + ParaPr.Ind.Left);
                            bCheckLeft = false;
                        }
                        if (tab_Clear != Tab.Value) {
                            TabsPos.push(Tab);
                        }
                    }
                    if (true === bCheckLeft) {
                        TabsPos.push(PageStart.X + ParaPr.Ind.Left);
                    }
                    TabsCount = TabsPos.length;
                    var Tab = null;
                    for (var Index = 0; Index < TabsCount; Index++) {
                        var TempTab = TabsPos[Index];
                        if (X < TempTab.Pos + PageStart.X) {
                            Tab = TempTab;
                            break;
                        }
                    }
                    var NewX = null;
                    if (null === Tab) {
                        if (X < PageStart.X + ParaPr.Ind.Left) {
                            NewX = PageStart.X + ParaPr.Ind.Left;
                        } else {
                            NewX = this.X;
                            while (X >= NewX) {
                                NewX += Default_Tab_Stop;
                            }
                        }
                    } else {
                        if (tab_Left === Tab.Value) {
                            NewX = Tab.Pos + PageStart.X;
                        } else {
                            pLastTab.TabPos = Tab.Pos + PageStart.X;
                            pLastTab.Value = Tab.Value;
                            pLastTab.X = X;
                            pLastTab.Item = Item;
                            Item.Width = 0;
                            Item.WidthVisible = 0;
                        }
                    }
                    if (null != NewX) {
                        if (NewX > XEnd && (false === bFirstItemOnLine || RangesCount > 0)) {
                            nWordLen = NewX - X;
                        } else {
                            Item.Width = NewX - X;
                            Item.WidthVisible = NewX - X;
                            X = NewX;
                            this.Lines[CurLine].Words++;
                            this.Lines[CurLine].Ranges[CurRange].Words++;
                            if (this.Lines[CurLine].Words > 1) {
                                this.Lines[CurLine].Spaces += nSpacesCount;
                            }
                            if (this.Lines[CurLine].Ranges[CurRange].Words > 1) {
                                this.Lines[CurLine].Ranges[CurRange].Spaces += nSpacesCount;
                            }
                        }
                    }
                    if (RangesCount === CurRange) {
                        if (true === bStartWord) {
                            bFirstItemOnLine = false;
                            bEmptyLine = false;
                        }
                        nWordStartPos = Pos;
                    }
                    nSpacesCount = 0;
                    bStartWord = true;
                    bWord = true;
                    break;
                case para_TextPr:
                    break;
                case para_NewLine:
                    if (break_Page === Item.BreakType) {
                        if (! (this.Parent instanceof CDocument)) {
                            this.Internal_Content_Remove(Pos);
                            Pos--;
                            break;
                        }
                        bNewPage = true;
                        bNewLine = true;
                        bBreakPageLine = true;
                    } else {
                        if (RangesCount === CurRange) {
                            bNewLine = true;
                        } else {
                            bNewRange = true;
                        }
                        bEmptyLine = false;
                    }
                    X += nWordLen;
                    if (bWord && this.Lines[CurLine].Words > 1) {
                        this.Lines[CurLine].Spaces += nSpacesCount;
                    }
                    if (bWord && this.Lines[CurLine].Ranges[CurRange].Words > 1) {
                        this.Lines[CurLine].Ranges[CurRange].Spaces += nSpacesCount;
                    }
                    if (bWord) {
                        bEmptyLine = false;
                        bWord = false;
                        X += nSpaceLen;
                        nSpaceLen = 0;
                    }
                    break;
                case para_End:
                    if (true === bWord) {
                        bFirstItemOnLine = false;
                        bEmptyLine = false;
                    }
                    if (false === bExtendBoundToBottom) {
                        X += nWordLen;
                        if (bWord) {
                            this.Lines[CurLine].Spaces += nSpacesCount;
                            this.Lines[CurLine].Ranges[CurRange].Spaces += nSpacesCount;
                        }
                        if (bWord) {
                            X += nSpaceLen;
                            nSpaceLen = 0;
                        }
                        if (-1 != pLastTab.Value) {
                            var TabItem = pLastTab.Item;
                            var TabStartX = pLastTab.X;
                            var TabRangeW = X - TabStartX;
                            var TabValue = pLastTab.Value;
                            var TabPos = pLastTab.TabPos;
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
                            pLastTab.Value = -1;
                            X += TabCalcW;
                        }
                    }
                    bNewLine = true;
                    bEnd = true;
                    break;
                }
                if (bBreak) {
                    break;
                }
            }
            if (bNewLine) {
                pLastTab.Value = -1;
                nSpaceLen = 0;
                if (true === bEmptyLine || LineAscent < 0.001) {
                    if (LineTextAscent < TextAscent) {
                        LineTextAscent = TextAscent;
                    }
                    if (LineTextDescent < TextDescent) {
                        LineTextDescent = TextDescent;
                    }
                    if (LineAscent < TextAscent) {
                        LineAscent = TextAscent;
                    }
                    if (LineDescent < TextDescent) {
                        LineDescent = TextDescent;
                    }
                }
                this.Lines[CurLine].Metrics.Update(LineTextAscent, LineTextDescent, LineAscent, LineDescent, ParaPr);
                bFirstItemOnLine = true;
                bStartWord = false;
                bNewLine = false;
                bNewRange = false;
                var TempDy = this.Lines[this.Pages[CurPage].FirstLine].Metrics.Ascent;
                if (0 === this.Pages[CurPage].FirstLine && (0 === CurPage || true === this.Parent.Is_TableCellContent())) {
                    TempDy += ParaPr.Spacing.Before;
                }
                if (0 === this.Pages[CurPage].FirstLine) {
                    if ((true === ParaPr.Brd.First || 1 === CurPage) && border_Single === ParaPr.Brd.Top.Value) {
                        TempDy += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                    } else {
                        if (false === ParaPr.Brd.First && border_Single === ParaPr.Brd.Between.Value) {
                            TempDy += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
                        }
                    }
                }
                var Top, Bottom;
                var Top2, Bottom2;
                var LastPage_Bottom = this.Pages[CurPage].Bounds.Bottom;
                if (true === this.Lines[CurLine].RangeY) {
                    Top = Y;
                    Top2 = Y;
                    this.Lines[CurLine].Top = Top - this.Pages[CurPage].Y;
                    if (0 === CurLine) {
                        if (0 === CurPage || true === this.Parent.Is_TableCellContent()) {
                            Top2 = Top + ParaPr.Spacing.Before;
                            Bottom2 = Top + ParaPr.Spacing.Before + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent;
                            Bottom = Top + ParaPr.Spacing.Before + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent + this.Lines[0].Metrics.LineGap;
                            if (true === ParaPr.Brd.First && border_Single === ParaPr.Brd.Top.Value) {
                                Top2 += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                                Bottom2 += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                                Bottom += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                            } else {
                                if (false === ParaPr.Brd.First && border_Single === ParaPr.Brd.Between.Value) {
                                    Top2 += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
                                    Bottom2 += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
                                    Bottom += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
                                }
                            }
                        } else {
                            Bottom2 = Top + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent;
                            Bottom = Top + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent + this.Lines[0].Metrics.LineGap;
                            if (border_Single === ParaPr.Brd.Top.Value) {
                                Top2 += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                                Bottom2 += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                                Bottom += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                            }
                        }
                    } else {
                        Bottom2 = Top + this.Lines[CurLine].Metrics.Ascent + this.Lines[CurLine].Metrics.Descent;
                        Bottom = Top + this.Lines[CurLine].Metrics.Ascent + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
                    }
                    if (bEnd) {
                        Bottom += ParaPr.Spacing.After;
                        if (true === ParaPr.Brd.Last) {
                            if (border_Single === ParaPr.Brd.Bottom.Value) {
                                Bottom += ParaPr.Brd.Bottom.Size + ParaPr.Brd.Bottom.Space;
                            }
                        } else {
                            if (border_Single === ParaPr.Brd.Between.Value) {
                                Bottom += ParaPr.Brd.Between.Space;
                            }
                        }
                        if (false === this.Parent.Is_TableCellContent() && Bottom > this.YLimit && Bottom - this.YLimit <= ParaPr.Spacing.After) {
                            Bottom = this.YLimit;
                        }
                    }
                    this.Lines[CurLine].Bottom = Bottom - this.Pages[CurPage].Y;
                    this.Bounds.Bottom = Bottom;
                    this.Pages[CurPage].Bounds.Bottom = Bottom;
                } else {
                    if (0 != CurLine) {
                        if (CurLine != this.Pages[CurPage].FirstLine) {
                            Top = Y + TempDy + this.Lines[CurLine - 1].Metrics.Descent + this.Lines[CurLine - 1].Metrics.LineGap;
                            Bottom = Top + this.Lines[CurLine].Metrics.Ascent + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
                            Top2 = Top;
                            Bottom2 = Top + this.Lines[CurLine].Metrics.Ascent + this.Lines[CurLine].Metrics.Descent;
                            this.Lines[CurLine].Top = Top - this.Pages[CurPage].Y;
                            if (bEnd) {
                                Bottom += ParaPr.Spacing.After;
                                if (true === ParaPr.Brd.Last) {
                                    if (border_Single === ParaPr.Brd.Bottom.Value) {
                                        Bottom += ParaPr.Brd.Bottom.Size + ParaPr.Brd.Bottom.Space;
                                    }
                                } else {
                                    if (border_Single === ParaPr.Brd.Between.Value) {
                                        Bottom += ParaPr.Brd.Between.Space;
                                    }
                                }
                                if (false === this.Parent.Is_TableCellContent() && Bottom > this.YLimit && Bottom - this.YLimit <= ParaPr.Spacing.After) {
                                    Bottom = this.YLimit;
                                }
                            }
                            this.Lines[CurLine].Bottom = Bottom - this.Pages[CurPage].Y;
                            this.Bounds.Bottom = Bottom;
                            this.Pages[CurPage].Bounds.Bottom = Bottom;
                        } else {
                            Top = this.Pages[CurPage].Y;
                            Bottom = Top + this.Lines[CurLine].Metrics.Ascent + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
                            Top2 = Top;
                            Bottom2 = Top + this.Lines[CurLine].Metrics.Ascent + this.Lines[CurLine].Metrics.Descent;
                            this.Lines[CurLine].Top = 0;
                            if (bEnd) {
                                Bottom += ParaPr.Spacing.After;
                                if (true === ParaPr.Brd.Last) {
                                    if (border_Single === ParaPr.Brd.Bottom.Value) {
                                        Bottom += ParaPr.Brd.Bottom.Size + ParaPr.Brd.Bottom.Space;
                                    }
                                } else {
                                    if (border_Single === ParaPr.Brd.Between.Value) {
                                        Bottom += ParaPr.Brd.Between.Space;
                                    }
                                }
                                if (false === this.Parent.Is_TableCellContent() && Bottom > this.YLimit && Bottom - this.YLimit <= ParaPr.Spacing.After) {
                                    Bottom = this.YLimit;
                                }
                            }
                            this.Lines[CurLine].Bottom = Bottom - this.Pages[CurPage].Y;
                            this.Bounds.Bottom = Bottom;
                            this.Pages[CurPage].Bounds.Bottom = Bottom;
                        }
                    } else {
                        Top = Y;
                        Top2 = Y;
                        if (0 === CurPage || true === this.Parent.Is_TableCellContent()) {
                            Top2 = Top + ParaPr.Spacing.Before;
                            Bottom = Top + ParaPr.Spacing.Before + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent + this.Lines[0].Metrics.LineGap;
                            Bottom2 = Top + ParaPr.Spacing.Before + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent;
                            if (true === ParaPr.Brd.First && border_Single === ParaPr.Brd.Top.Value) {
                                Top2 += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                                Bottom2 += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                                Bottom += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                            } else {
                                if (false === ParaPr.Brd.First && border_Single === ParaPr.Brd.Between.Value) {
                                    Top2 += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
                                    Bottom2 += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
                                    Bottom += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
                                }
                            }
                        } else {
                            Bottom = Top + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent + this.Lines[0].Metrics.LineGap;
                            Bottom2 = Top + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent;
                            if (border_Single === ParaPr.Brd.Top.Value) {
                                Top2 += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                                Bottom2 += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                                Bottom += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
                            }
                        }
                        if (bEnd) {
                            Bottom += ParaPr.Spacing.After;
                            if (true === ParaPr.Brd.Last) {
                                if (border_Single === ParaPr.Brd.Bottom.Value) {
                                    Bottom += ParaPr.Brd.Bottom.Size + ParaPr.Brd.Bottom.Space;
                                }
                            } else {
                                if (border_Single === ParaPr.Brd.Between.Value) {
                                    Bottom += ParaPr.Brd.Between.Space;
                                }
                            }
                            if (false === this.Parent.Is_TableCellContent() && Bottom > this.YLimit && Bottom - this.YLimit <= ParaPr.Spacing.After) {
                                Bottom = this.YLimit;
                            }
                        }
                        this.Lines[0].Top = Top - this.Pages[CurPage].Y;
                        this.Lines[0].Bottom = Bottom - this.Pages[CurPage].Y;
                        this.Bounds.Top = Top;
                        this.Bounds.Bottom = Bottom;
                        this.Pages[CurPage].Bounds.Top = Top;
                        this.Pages[CurPage].Bounds.Bottom = Bottom;
                    }
                }
                var bBreakPageLineEmpty = false;
                if (true === bBreakPageLine) {
                    bBreakPageLineEmpty = true;
                    for (var _Pos = Pos - 1; _Pos >= LineStart_Pos; _Pos--) {
                        var _Item = this.Content[_Pos];
                        var _Type = _Item.Type;
                        if (para_Drawing === _Type || para_End === _Type || (para_NewLine === _Type && break_Line === _Item.BreakType) || para_PageNum === _Type || para_Space === _Type || para_Tab === _Type || para_Text === _Type) {
                            bBreakPageLineEmpty = false;
                            break;
                        }
                    }
                }
                if ((Top > this.YLimit || Bottom2 > this.YLimit) && (CurLine != this.Pages[CurPage].FirstLine || (0 === CurPage && (null != this.Get_DocumentPrev() || true === this.Parent.Is_TableCellContent()))) && false === bBreakPageLineEmpty) {
                    if (true === ParaPr.WidowControl && CurLine - this.Pages[CurPage].StartLine <= 1 && CurLine >= 1 && true != bBreakPageLine) {
                        this.Parent.RecalcInfo.WidowControlParagraph = this;
                        this.Parent.RecalcInfo.WidowControlLine = CurLine - 1;
                        RecalcResult = recalcresult_CurPage;
                        break;
                    } else {
                        if (true === ParaPr.KeepLines && null != this.Get_DocumentPrev() && true != this.Parent.Is_TableCellContent() && 0 === CurPage) {
                            CurLine = 0;
                            LineStart_Pos = 0;
                        }
                        this.Pages[CurPage].Bounds.Bottom = LastPage_Bottom;
                        this.Pages[CurPage].Set_EndLine(CurLine - 1);
                        if (0 === CurLine) {
                            this.Lines[-1] = new CParaLine(0);
                            this.Lines[-1].Set_EndPos(LineStart_Pos - 1, this);
                        }
                        RecalcResult = recalcresult_NextPage;
                        break;
                    }
                }
                bBreakPageLine = false;
                var Left = (0 != CurLine ? this.X + ParaPr.Ind.Left : this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine);
                var Right = this.XLimit - ParaPr.Ind.Right;
                var PageFields = this.Parent.Get_PageFields(this.PageNum + CurPage);
                var Ranges2 = this.Parent.CheckRange(Left, Top, Right, Bottom, Top2, Bottom2, PageFields.X, PageFields.XLimit, this.PageNum + CurPage, true);
                if (0 != CurLine) {
                    this.Lines[CurLine].W = X - this.X - ParaPr.Ind.Left;
                } else {
                    this.Lines[CurLine].W = X - this.X - ParaPr.Ind.Left - ParaPr.Ind.FirstLine;
                }
                if (0 == CurRange) {
                    if (0 != CurLine) {
                        this.Lines[CurLine].Ranges[CurRange].W = X - this.X - ParaPr.Ind.Left;
                    } else {
                        this.Lines[CurLine].Ranges[CurRange].W = X - this.X - ParaPr.Ind.Left - ParaPr.Ind.FirstLine;
                    }
                } else {
                    if (true === this.Lines[CurLine].Ranges[CurRange].FirstRange) {
                        if (ParaPr.Ind.FirstLine < 0) {
                            Ranges[CurRange - 1].X1 += ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
                        } else {
                            Ranges[CurRange - 1].X1 += ParaPr.Ind.FirstLine;
                        }
                    }
                    this.Lines[CurLine].Ranges[CurRange].W = X - Ranges[CurRange - 1].X1;
                }
                if (true === bNewPage) {
                    bNewPage = false;
                    var ____Pos = Pos + 1;
                    var Next = this.Internal_FindForward(____Pos, [para_End, para_NewLine, para_Space, para_Text, para_Drawing, para_Tab, para_PageNum]);
                    while (true === Next.Found && para_Drawing === Next.Type && drawing_Anchor === this.Content[Next.LetterPos].Get_DrawingType()) {
                        Next = this.Internal_FindForward(++____Pos, [para_End, para_NewLine, para_Space, para_Text, para_Drawing, para_Tab, para_PageNum]);
                    }
                    if (true === Next.Found && para_End === Next.Type) {
                        Item.Flags.NewLine = false;
                        bExtendBoundToBottom = true;
                        continue;
                    }
                    if (true === this.Lines[CurLine].RangeY) {
                        this.Lines[CurLine].Y = Y - this.Pages[CurPage].Y;
                    } else {
                        if (CurLine > 0) {
                            if (CurLine != this.Pages[CurPage].FirstLine) {
                                Y += this.Lines[CurLine - 1].Metrics.Descent + this.Lines[CurLine - 1].Metrics.LineGap + this.Lines[CurLine].Metrics.Ascent;
                            }
                            this.Lines[CurLine].Y = Y - this.Pages[CurPage].Y;
                        }
                    }
                    this.Pages[CurPage].Set_EndLine(CurLine);
                    this.Lines[CurLine].Set_EndPos(Pos, this);
                    RecalcResult = recalcresult_NextPage;
                    break;
                } else {
                    if (true === this.Lines[CurLine].RangeY) {
                        this.Lines[CurLine].Y = Y - this.Pages[CurPage].Y;
                    } else {
                        if (CurLine > 0) {
                            if (CurLine != this.Pages[CurPage].FirstLine) {
                                Y += this.Lines[CurLine - 1].Metrics.Descent + this.Lines[CurLine - 1].Metrics.LineGap + this.Lines[CurLine].Metrics.Ascent;
                            }
                            this.Lines[CurLine].Y = Y - this.Pages[CurPage].Y;
                        }
                    }
                    if ((true === bEmptyLine && RangesCount > 0 && LineStart_Pos < 0) || Pos < 0) {
                        X = this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
                    } else {
                        X = this.X + ParaPr.Ind.Left;
                    }
                }
                if (!bEnd) {
                    if (true === bEmptyLine && RangesCount > 0) {
                        Pos = LineStart_Pos - 1;
                        var RangesY = Ranges[0].Y1;
                        for (var Index = 1; Index < Ranges.length; Index++) {
                            if (RangesY > Ranges[Index].Y1) {
                                RangesY = Ranges[Index].Y1;
                            }
                        }
                        if (Math.abs(RangesY - Y) < 0.01) {
                            Y = RangesY + 1;
                        } else {
                            Y = RangesY + 0.001;
                        }
                        if (0 === CurLine) {
                            X = this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
                        } else {
                            X = this.X + ParaPr.Ind.Left;
                        }
                    } else {
                        this.Lines[CurLine].Set_EndPos(Pos, this);
                        CurLine++;
                        if (this === this.Parent.RecalcInfo.WidowControlParagraph && CurLine === this.Parent.RecalcInfo.WidowControlLine) {
                            this.Parent.RecalcInfo.WidowControlParagraph = null;
                            this.Parent.RecalcInfo.WidowControlLine = -1;
                            this.Pages[CurPage].Set_EndLine(CurLine - 1);
                            if (0 === CurLine) {
                                this.Lines[-1] = new CParaLine(0);
                                this.Lines[-1].Set_EndPos(LineStart_Pos - 1, this);
                            }
                            RecalcResult = recalcresult_NextPage;
                            break;
                        }
                    }
                    this.Lines[CurLine] = new CParaLine(Pos + 1);
                    LineTextAscent = 0;
                    LineTextDescent = 0;
                    LineAscent = 0;
                    LineDescent = 0;
                    var TempY;
                    if (true === bEmptyLine && RangesCount > 0) {
                        TempY = Y;
                        this.Lines[CurLine].RangeY = true;
                    } else {
                        if (CurLine > 0) {
                            if (CurLine != this.Pages[CurPage].FirstLine) {
                                TempY = TempDy + Y + this.Lines[CurLine - 1].Metrics.Descent + this.Lines[CurLine - 1].Metrics.LineGap;
                            } else {
                                TempY = this.Pages[CurPage].Y;
                            }
                        } else {
                            TempY = this.Y;
                        }
                    }
                    Ranges = [];
                    RangesCount = Ranges.length;
                    this.Lines[CurLine].Add_Range(X, (RangesCount == 0 ? XLimit : Ranges[0].X0));
                    this.Lines[CurLine].Set_RangeStartPos(0, Pos + 1);
                    for (var Index = 1; Index < Ranges.length + 1; Index++) {
                        this.Lines[CurLine].Add_Range(Ranges[Index - 1].X1, (RangesCount == Index ? XLimit : Ranges[Index].X0));
                    }
                    CurRange = 0;
                    XEnd = 0;
                    if (RangesCount == 0) {
                        XEnd = XLimit;
                    } else {
                        XEnd = Ranges[0].X0;
                    }
                    bWord = false;
                    nWordLen = 0;
                    nSpacesCount = 0;
                    LineStart_Pos = Pos + 1;
                    if (true === bForceNewPage) {
                        this.Pages[CurPage].Set_EndLine(CurLine - 1);
                        if (0 === CurLine) {
                            this.Lines[-1] = new CParaLine(0);
                            this.Lines[-1].Set_EndPos(LineStart_Pos - 1, this);
                        }
                        RecalcResult = recalcresult_NextPage;
                        break;
                    }
                } else {
                    if (true === ParaPr.WidowControl && CurLine === this.Pages[CurPage].StartLine && CurLine >= 1) {
                        var bBreakPagePrevLine = false;
                        var StartPos = (CurLine == 2 ? this.Lines[CurLine - 2].StartPos : this.Lines[CurLine - 1].StartPos);
                        var EndPos = this.Lines[CurLine - 1].EndPos;
                        for (var TempPos = StartPos; TempPos <= EndPos; TempPos++) {
                            var TempItem = this.Content[TempPos];
                            if (para_NewLine === TempItem.Type && break_Page === TempItem.BreakType) {
                                bBreakPagePrevLine = true;
                                break;
                            }
                        }
                        if (false === bBreakPagePrevLine) {
                            this.Parent.RecalcInfo.WidowControlParagraph = this;
                            this.Parent.RecalcInfo.WidowControlLine = (CurLine > 2 ? CurLine - 1 : 0);
                            RecalcResult = recalcresult_PrevPage;
                            break;
                        }
                    }
                    if (true === bEnd && true === bExtendBoundToBottom) {
                        this.Pages[CurPage].Bounds.Bottom = this.Pages[CurPage].YLimit;
                        this.Bounds.Bottom = this.Pages[CurPage].YLimit;
                        this.Lines[CurLine].Set_EndPos(Pos, this);
                        this.Pages[CurPage].Set_EndLine(CurLine);
                        for (var TempRange = CurRange + 1; TempRange <= RangesCount; TempRange++) {
                            this.Lines[CurLine].Set_RangeStartPos(TempRange, Pos);
                        }
                    } else {
                        this.Lines[CurLine].Set_EndPos(Pos, this);
                        this.Pages[CurPage].Set_EndLine(CurLine);
                        for (var TempRange = CurRange + 1; TempRange <= RangesCount; TempRange++) {
                            this.Lines[CurLine].Set_RangeStartPos(TempRange, Pos);
                        }
                    }
                }
                bEmptyLine = true;
            } else {
                if (bNewRange) {
                    pLastTab.Value = -1;
                    this.Lines[CurLine].Set_RangeStartPos(CurRange + 1, Pos + 1);
                    nSpaceLen = 0;
                    bNewRange = false;
                    bFirstItemOnLine = true;
                    bStartWord = false;
                    if (0 == CurRange) {
                        if (0 != CurLine) {
                            this.Lines[CurLine].Ranges[CurRange].W = X - this.X - ParaPr.Ind.Left;
                        } else {
                            this.Lines[CurLine].Ranges[CurRange].W = X - this.X - ParaPr.Ind.Left - ParaPr.Ind.FirstLine;
                        }
                    } else {
                        if (true === this.Lines[CurLine].Ranges[CurRange].FirstRange) {
                            if (ParaPr.Ind.FirstLine < 0) {
                                Ranges[CurRange - 1].X1 += ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
                            } else {
                                Ranges[CurRange - 1].X1 += ParaPr.Ind.FirstLine;
                            }
                        }
                        this.Lines[CurLine].Ranges[CurRange].W = X - Ranges[CurRange - 1].X1;
                    }
                    CurRange++;
                    if (0 === CurLine && true === bEmptyLine) {
                        if (ParaPr.Ind.FirstLine < 0) {
                            this.Lines[CurLine].Ranges[CurRange].X += ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
                        } else {
                            this.Lines[CurLine].Ranges[CurRange].X += ParaPr.Ind.FirstLine;
                        }
                        this.Lines[CurLine].Ranges[CurRange].FirstRange = true;
                    }
                    X = this.Lines[CurLine].Ranges[CurRange].X;
                    if (CurRange == RangesCount) {
                        XEnd = XLimit;
                    } else {
                        XEnd = Ranges[CurRange].X0;
                    }
                    bWord = false;
                    nWordLen = 0;
                    nSpacesCount = 0;
                }
            }
        }
        var StartLine = this.Pages[CurPage].FirstLine;
        var EndLine = this.Lines.length - 1;
        var TempDy = this.Lines[this.Pages[CurPage].FirstLine].Metrics.Ascent;
        if (0 === StartLine && (0 === CurPage || true === this.Parent.Is_TableCellContent())) {
            TempDy += ParaPr.Spacing.Before;
        }
        if (0 === StartLine) {
            if ((true === ParaPr.Brd.First || 1 === CurPage) && border_Single === ParaPr.Brd.Top.Value) {
                TempDy += ParaPr.Brd.Top.Size + ParaPr.Brd.Top.Space;
            } else {
                if (false === ParaPr.Brd.First && border_Single === ParaPr.Brd.Between.Value) {
                    TempDy += ParaPr.Brd.Between.Size + ParaPr.Brd.Between.Space;
                }
            }
        }
        for (var Index = StartLine; Index <= EndLine; Index++) {
            this.Lines[Index].Y += TempDy;
            if (this.Lines[Index].Metrics.LineGap < 0) {
                this.Lines[Index].Y += this.Lines[Index].Metrics.LineGap;
            }
        }
        return RecalcResult;
    },
    Internal_Recalculate_2_: function (StartPos, _CurPage, _CurLine) {
        var Pr = this.Get_CompiledPr2(false);
        var ParaPr = Pr.ParaPr;
        var CurRange = 0;
        var CurLine = _CurLine;
        var CurPage = _CurPage;
        if (this.Pages[CurPage].EndLine < 0) {
            return recalcresult_NextPage;
        }
        var EndPos = this.Lines[this.Pages[CurPage].EndLine].EndPos;
        var JustifyWord = 0;
        var JustifySpace = 0;
        var Y = this.Pages[CurPage].Y + this.Lines[CurLine].Y;
        var bFirstLineItem = true;
        var Range = this.Lines[CurLine].Ranges[CurRange];
        var RangesCount = this.Lines[CurLine].Ranges.length;
        var RangeWidth = Range.XEnd - Range.X;
        var X = 0;
        switch (ParaPr.Jc) {
        case align_Left:
            X = Range.X;
            break;
        case align_Right:
            X = Range.X + RangeWidth - Range.W;
            break;
        case align_Center:
            X = Range.X + (RangeWidth - Range.W) / 2;
            break;
        case align_Justify:
            X = Range.X;
            if (1 == Range.Words) {
                if (1 == RangesCount && this.Lines.length > 1) {
                    var LettersCount = 0;
                    var TempPos = StartPos;
                    var LastW = 0;
                    var __CurLine = CurLine;
                    var __CurRange = CurRange;
                    while (this.Content[TempPos].Type != para_End) {
                        var __Item = this.Content[TempPos];
                        if (undefined != __Item.CurPage) {
                            if (__CurLine != __Item.CurLine || __CurRange != __Item.Range) {
                                break;
                            }
                        }
                        if (para_Text == this.Content[TempPos].Type) {
                            LettersCount++;
                            LastW = this.Content[TempPos].Width;
                        }
                        TempPos++;
                    }
                    if (RangeWidth - Range.W <= 0.05 * RangeWidth && LettersCount > 1) {
                        JustifyWord = (RangeWidth - Range.W) / (LettersCount - 1);
                    }
                } else {
                    if (0 == CurRange || (CurLine == this.Lines.length - 1 && CurRange == this.Lines[CurLine].Ranges.length - 1)) {} else {
                        if (CurRange == this.Lines[CurLine].Ranges.length - 1) {
                            X = Range.X + RangeWidth - Range.W;
                        } else {
                            X = Range.X + (RangeWidth - Range.W) / 2;
                        }
                    }
                }
            } else {
                if (Range.Spaces > 0 && (CurLine != this.Lines.length - 1 || CurRange != this.Lines[CurLine].Ranges.length - 1)) {
                    JustifySpace = (RangeWidth - Range.W) / Range.Spaces;
                } else {
                    JustifySpace = 0;
                }
            }
            break;
        default:
            X = Range.X;
            break;
        }
        var SpacesCounter = this.Lines[CurLine].Ranges[CurRange].Spaces;
        this.Lines[CurLine].Ranges[CurRange].XVisible = X;
        this.Lines[CurLine].X = X - this.X;
        var LastW = 0;
        for (var ItemNum = StartPos; ItemNum <= EndPos; ItemNum++) {
            var Item = this.Content[ItemNum];
            if (undefined != Item.CurPage) {
                if (CurLine < Item.CurLine) {
                    CurLine = Item.CurLine;
                    CurRange = Item.CurRange;
                    JustifyWord = 0;
                    JustifySpace = 0;
                    Y = this.Pages[CurPage].Y + this.Lines[CurLine].Y;
                    bFirstLineItem = true;
                    Range = this.Lines[CurLine].Ranges[CurRange];
                    RangesCount = this.Lines[CurLine].Ranges.length;
                    RangeWidth = Range.XEnd - Range.X;
                    switch (ParaPr.Jc) {
                    case align_Left:
                        X = Range.X;
                        break;
                    case align_Right:
                        X = Range.X + RangeWidth - Range.W;
                        break;
                    case align_Center:
                        X = Range.X + (RangeWidth - Range.W) / 2;
                        break;
                    case align_Justify:
                        X = Range.X;
                        if (1 == Range.Words) {
                            if (1 == RangesCount && this.Lines.length > 1) {
                                var LettersCount = 0;
                                var TempPos = ItemNum + 1;
                                var LastW = 0;
                                var __CurLine = CurLine;
                                var __CurRange = CurRange;
                                while (this.Content[TempPos].Type != para_End) {
                                    var __Item = this.Content[TempPos];
                                    if (undefined != __Item.CurPage) {
                                        if (__CurLine != __Item.CurLine || __CurRange != __Item.Range) {
                                            break;
                                        }
                                    }
                                    if (para_Text == this.Content[TempPos].Type) {
                                        LettersCount++;
                                        LastW = this.Content[TempPos].Width;
                                    }
                                    TempPos++;
                                }
                                if (RangeWidth - Range.W <= 0.05 * RangeWidth && LettersCount > 1) {
                                    JustifyWord = (RangeWidth - Range.W) / (LettersCount - 1);
                                }
                            } else {
                                if (0 == CurRange || (CurLine == this.Lines.length - 1 && CurRange == this.Lines[CurLine].Ranges.length - 1)) {} else {
                                    if (CurRange == this.Lines[CurLine].Ranges.length - 1) {
                                        X = Range.X + RangeWidth - Range.W;
                                    } else {
                                        X = Range.X + (RangeWidth - Range.W) / 2;
                                    }
                                }
                            }
                        } else {
                            if (Range.Spaces > 0 && (CurLine != this.Lines.length - 1 || CurRange != this.Lines[CurLine].Ranges.length - 1)) {
                                JustifySpace = (RangeWidth - Range.W) / Range.Spaces;
                            } else {
                                JustifySpace = 0;
                            }
                        }
                        break;
                    default:
                        X = Range.X;
                        break;
                    }
                    SpacesCounter = this.Lines[CurLine].Ranges[CurRange].Spaces;
                    this.Lines[CurLine].Ranges[CurRange].XVisible = X;
                    this.Lines[CurLine].X = X - this.X;
                } else {
                    if (CurRange < Item.CurRange) {
                        CurRange = Item.CurRange;
                        Range = this.Lines[CurLine].Ranges[CurRange];
                        RangeWidth = Range.XEnd - Range.X;
                        switch (ParaPr.Jc) {
                        case align_Left:
                            X = Range.X;
                            break;
                        case align_Right:
                            X = Range.X + RangeWidth - Range.W;
                            break;
                        case align_Center:
                            X = Range.X + (RangeWidth - Range.W) / 2;
                            break;
                        case align_Justify:
                            X = Range.X;
                            if (1 == Range.Words) {
                                if (1 == RangesCount && this.Lines.length > 1) {
                                    var LettersCount = 0;
                                    var TempPos = ItemNum + 1;
                                    var LastW = 0;
                                    var __CurLine = CurLine;
                                    var __CurRange = CurRange;
                                    while (this.Content[TempPos].Type != para_End) {
                                        var __Item = this.Content[TempPos];
                                        if (undefined != __Item.CurPage) {
                                            if (__CurLine != __Item.CurLine || __CurRange != __Item.Range) {
                                                break;
                                            }
                                        }
                                        if (para_Text == this.Content[TempPos].Type) {
                                            LettersCount++;
                                            LastW = this.Content[TempPos].Width;
                                        }
                                        TempPos++;
                                    }
                                    if (RangeWidth - Range.W <= 0.05 * RangeWidth && LettersCount > 1) {
                                        JustifyWord = (RangeWidth - Range.W) / (LettersCount - 1);
                                    }
                                } else {
                                    if (0 == CurRange || (CurLine == this.Lines.length - 1 && CurRange == this.Lines[CurLine].Ranges.length - 1)) {} else {
                                        if (CurRange == this.Lines[CurLine].Ranges.length - 1) {
                                            X = Range.X + RangeWidth - Range.W;
                                        } else {
                                            X = Range.X + (RangeWidth - Range.W) / 2;
                                        }
                                    }
                                }
                            } else {
                                if (Range.Spaces > 0 && (CurLine != this.Lines.length - 1 || CurRange != this.Lines[CurLine].Ranges.length - 1)) {
                                    JustifySpace = (RangeWidth - Range.W) / Range.Spaces;
                                } else {
                                    JustifySpace = 0;
                                }
                            }
                            break;
                        default:
                            X = Range.X;
                            break;
                        }
                        SpacesCounter = this.Lines[CurLine].Ranges[CurRange].Spaces;
                        this.Lines[CurLine].Ranges[CurRange].XVisible = X;
                    }
                }
            }
            if (ItemNum == this.CurPos.ContentPos) {
                this.CurPos.X = X;
                this.CurPos.Y = Y;
                this.CurPos.PagesPos = CurPage;
            }
            switch (Item.Type) {
            case para_Numbering:
                X += Item.WidthVisible;
                break;
            case para_PresentationNumbering:
                X += Item.WidthVisible;
                break;
            case para_Text:
                bFirstLineItem = false;
                if (CurLine != this.Lines.length - 1 && JustifyWord > 0) {
                    Item.WidthVisible = Item.Width + JustifyWord;
                } else {
                    Item.WidthVisible = Item.Width;
                }
                X += Item.WidthVisible;
                LastW = Item.WidthVisible;
                break;
            case para_Space:
                if (!bFirstLineItem && CurLine != this.Lines.length - 1 && SpacesCounter > 0 && (ItemNum > this.Lines[CurLine].Ranges[CurRange].SpacePos)) {
                    Item.WidthVisible = Item.Width + JustifySpace;
                    SpacesCounter--;
                } else {
                    Item.WidthVisible = Item.Width;
                }
                X += Item.WidthVisible;
                LastW = Item.WidthVisible;
                break;
            case para_Drawing:
                var DrawingObjects = this.Parent.DrawingObjects;
                var PageLimits = this.Parent.Get_PageLimits(this.PageNum + CurPage);
                var PageFields = this.Parent.Get_PageFields(this.PageNum + CurPage);
                var ColumnStartX = (0 === CurPage ? this.X_ColumnStart : this.Pages[CurPage].X);
                var ColumnEndX = (0 === CurPage ? this.X_ColumnEnd : this.Pages[CurPage].XLimit);
                var Top_Margin = Y_Top_Margin;
                var Bottom_Margin = Y_Bottom_Margin;
                var Page_H = Page_Height;
                if (true === this.Parent.Is_TableCellContent() && true == Item.Use_TextWrap()) {
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
                if (true === Item.Is_Inline() || true === this.Parent.Is_DrawingShape()) {
                    Item.Update_Position(X, Y, this.Get_StartPage_Absolute() + CurPage, LastW, ColumnStartX, ColumnEndX, X_Left_Margin, X_Right_Margin, Page_Width, Top_Margin, Bottom_Margin, Page_H, PageFields.X, PageFields.Y, this.Pages[CurPage].Y + this.Lines[CurLine].Y - this.Lines[CurLine].Metrics.Ascent, this.Pages[CurPage].Y, PageLimits);
                    bFirstLineItem = false;
                    X += Item.WidthVisible;
                    LastW = Item.WidthVisible;
                } else {
                    if (true === Item.Use_TextWrap()) {
                        var LogicDocument = this.Parent;
                        var Page_abs = this.Get_StartPage_Absolute() + CurPage;
                        if (null === LogicDocument.RecalcInfo.FlowObject) {
                            Item.Update_Position(X, Y, this.Get_StartPage_Absolute() + CurPage, LastW, ColumnStartX, ColumnEndX, X_Left_Margin, X_Right_Margin, Page_Width, Top_Margin, Bottom_Margin, Page_H, PageFields.X, PageFields.Y, this.Pages[CurPage].Y + this.Lines[CurLine].Y - this.Lines[CurLine].Metrics.Ascent, this.Pages[CurPage].Y, PageLimits);
                            LogicDocument.RecalcInfo.FlowObject = Item;
                            return recalcresult_CurPage;
                        } else {
                            if (Item === LogicDocument.RecalcInfo.FlowObject) {
                                if (Item.PageNum === Page_abs) {
                                    LogicDocument.RecalcInfo.FlowObject = null;
                                    LogicDocument.RecalcInfo.FlowObjectPageBreakBefore = false;
                                } else {
                                    if (true === this.Parent.Is_TableCellContent()) {
                                        Item.Update_Position(X, Y, this.Get_StartPage_Absolute() + CurPage, LastW, ColumnStartX, ColumnEndX, X_Left_Margin, X_Right_Margin, Page_Width, Top_Margin, Bottom_Margin, Page_H, PageFields.X, PageFields.Y, this.Pages[CurPage].Y + this.Lines[CurLine].Y - this.Lines[CurLine].Metrics.Ascent, this.Pages[CurPage].Y, PageLimits);
                                        LogicDocument.RecalcInfo.FlowObject = Item;
                                        LogicDocument.RecalcInfo.FlowObjectPageBreakBefore = false;
                                        return recalcresult_CurPage;
                                    } else {
                                        LogicDocument.RecalcInfo.FlowObjectPageBreakBefore = true;
                                        DrawingObjects.removeById(Item.PageNum, Item.Get_Id());
                                        return recalcresult_PrevPage;
                                    }
                                }
                            } else {}
                        }
                        continue;
                    } else {
                        Item.Update_Position(X, Y, this.Get_StartPage_Absolute() + CurPage, LastW, ColumnStartX, ColumnEndX, X_Left_Margin, X_Right_Margin, Page_Width, Top_Margin, Bottom_Margin, Page_H, PageFields.X, PageFields.Y, this.Pages[CurPage].Y + this.Lines[CurLine].Y - this.Lines[CurLine].Metrics.Ascent, this.Pages[CurPage].Y, PageLimits);
                        continue;
                    }
                }
                break;
            case para_PageNum:
                bFirstLineItem = false;
                X += Item.WidthVisible;
                LastW = Item.WidthVisible;
                break;
            case para_Tab:
                X += Item.WidthVisible;
                break;
            case para_TextPr:
                break;
            case para_End:
                X += Item.Width;
                break;
            case para_NewLine:
                X += Item.WidthVisible;
                break;
            }
        }
        return recalcresult_NextElement;
    },
    Internal_Recalculate_CurPos: function (Pos, UpdateCurPos, UpdateTarget, ReturnTarget) {
        var LinePos = this.Internal_Get_ParaPos_By_Pos(Pos);
        var CurLine = LinePos.Line;
        var CurRange = LinePos.Range;
        var CurPage = LinePos.Page;
        if (Pos === this.CurPos.ContentPos && -1 != this.CurPos.Line) {
            CurLine = this.CurPos.Line;
        }
        var X = this.Lines[CurLine].Ranges[CurRange].XVisible;
        var Y = this.Pages[CurPage].Y + this.Lines[CurLine].Y;
        for (var ItemNum = this.Lines[CurLine].Ranges[CurRange].StartPos; ItemNum < this.Content.length; ItemNum++) {
            var Item = this.Content[ItemNum];
            if (Pos === ItemNum) {
                if (true === UpdateCurPos) {
                    this.CurPos.X = X;
                    this.CurPos.Y = Y;
                    this.CurPos.PagesPos = CurPage;
                    if (true === UpdateTarget) {
                        var CurTextPr = this.Internal_CalculateTextPr(ItemNum);
                        g_oTextMeasurer.SetTextPr(CurTextPr);
                        g_oTextMeasurer.SetFontSlot(fontslot_ASCII, CurTextPr.Get_FontKoef());
                        var Height = g_oTextMeasurer.GetHeight();
                        var Descender = Math.abs(g_oTextMeasurer.GetDescender());
                        var Ascender = Height - Descender;
                        this.DrawingDocument.SetTargetSize(Height);
                        this.DrawingDocument.SetTargetColor(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b);
                        var TargetY = Y - Ascender - CurTextPr.Position;
                        switch (CurTextPr.VertAlign) {
                        case vertalign_SubScript:
                            TargetY -= CurTextPr.FontSize * g_dKoef_pt_to_mm * vertalign_Koef_Sub;
                            break;
                        case vertalign_SuperScript:
                            TargetY -= CurTextPr.FontSize * g_dKoef_pt_to_mm * vertalign_Koef_Super;
                            break;
                        }
                        var Page_Abs = this.Get_StartPage_Absolute() + CurPage;
                        this.DrawingDocument.UpdateTarget(X, TargetY, Page_Abs);
                    }
                }
                if (true === ReturnTarget) {
                    var CurTextPr = this.Internal_CalculateTextPr(ItemNum);
                    g_oTextMeasurer.SetTextPr(CurTextPr);
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
                        PageNum: CurPage + this.Get_StartPage_Absolute(),
                        Internal: {
                            Line: CurLine,
                            Page: CurPage,
                            Range: CurRange
                        }
                    };
                }
            }
            switch (Item.Type) {
            case para_Numbering:
                case para_PresentationNumbering:
                case para_Text:
                case para_Space:
                case para_PageNum:
                case para_Tab:
                case para_TextPr:
                case para_End:
                case para_NewLine:
                X += Item.WidthVisible;
                break;
            case para_Drawing:
                if (drawing_Inline != Item.DrawingType) {
                    break;
                }
                X += Item.WidthVisible;
                break;
            }
        }
    },
    Internal_CompareBrd: function (Pr1, Pr2) {
        var Left_1 = Math.min(Pr1.Ind.Left, Pr1.Ind.Left + Pr1.Ind.FirstLine);
        var Right_1 = Pr1.Ind.Right;
        var Left_2 = Math.min(Pr2.Ind.Left, Pr2.Ind.Left + Pr2.Ind.FirstLine);
        var Right_2 = Pr2.Ind.Right;
        if (Math.abs(Left_1 - Left_2) > 0.001 || Math.abs(Right_1 - Right_2) > 0.001) {
            return false;
        }
        if (false === Pr1.Brd.Top.Compare(Pr2.Brd.Top) || false === Pr1.Brd.Bottom.Compare(Pr2.Brd.Bottom) || false === Pr1.Brd.Left.Compare(Pr2.Brd.Left) || false === Pr1.Brd.Right.Compare(Pr2.Brd.Right) || false === Pr1.Brd.Between.Compare(Pr2.Brd.Between)) {
            return false;
        }
        return true;
    },
    Internal_Is_NullBorders: function (Borders) {
        if (border_None != Borders.Top.Value || border_None != Borders.Bottom.Value || border_None != Borders.Left.Value || border_None != Borders.Right.Value || border_None != Borders.Between.Value) {
            return false;
        }
        return true;
    },
    Internal_Get_ClearPos: function (Pos) {
        var Counter = 0;
        for (var Index = 0; Index < Math.min(Pos, this.Content.length - 1); Index++) {
            if (false === this.Content[Index].Is_RealContent() || para_Numbering === this.Content[Index].Type) {
                Counter++;
            }
        }
        return Pos - Counter;
    },
    Internal_Get_RealPos: function (Pos) {
        var Counter = Pos;
        for (var Index = 0; Index <= Math.min(Counter, this.Content.length - 1); Index++) {
            if (false === this.Content[Index].Is_RealContent() || para_Numbering === this.Content[Index].Type) {
                Counter++;
            }
        }
        return Counter;
    },
    Internal_Get_ClearContentLength: function () {
        var Len = this.Content.length;
        var ClearLen = Len;
        for (var Index = 0; Index < Len; Index++) {
            var Item = this.Content[Index];
            if (false === Item.Is_RealContent()) {
                ClearLen--;
            }
        }
        return ClearLen;
    },
    Recalculate_Page: function (_PageIndex) {
        this.CurPos.Line = -1;
        var PageIndex = _PageIndex - this.PageNum;
        var CurPage, StartPos, CurLine;
        if (0 === PageIndex) {
            CurPage = 0;
            StartPos = 0;
            CurLine = 0;
        } else {
            CurPage = PageIndex;
            if (CurPage > 0) {
                CurLine = this.Pages[CurPage - 1].EndLine + 1;
            } else {
                CurLine = 0;
            }
            if (CurLine > 0) {
                StartPos = this.Lines[CurLine - 1].EndPos + 1;
            } else {
                StartPos = 0;
            }
        }
        History.TurnOff();
        if (0 === CurPage) {
            if (para_Numbering != this.Content[0].Type) {
                this.Internal_Content_Add(0, new ParaNumbering());
            }
            for (var Pos = 1; Pos < this.Content.length; Pos++) {
                var Item = this.Content[Pos];
                if (para_Numbering === Item.Type) {
                    this.Internal_Content_Remove(Pos);
                    Pos--;
                }
            }
        }
        History.TurnOn();
        this.FontMap.NeedRecalc = true;
        this.Internal_Recalculate_0();
        var RecalcResult_1 = this.Internal_Recalculate_1_(StartPos, CurPage, CurLine);
        var RecalcResult_2 = this.Internal_Recalculate_2_(StartPos, CurPage, CurLine);
        var RecalcResult = (recalcresult_NextElement != RecalcResult_2 ? RecalcResult_2 : RecalcResult_1);
        return RecalcResult;
    },
    RecalculateCurPos: function () {
        this.Internal_Recalculate_CurPos(this.CurPos.ContentPos, true, true, false);
    },
    Draw: function (PageNum, pGraphics) {
        var CurPage = PageNum - this.PageNum;
        if (this.Pages[CurPage].EndLine < 0) {
            return;
        }
        var Pr = this.Get_CompiledPr();
        this.Internal_Draw_1(CurPage, pGraphics, Pr);
        this.Internal_Draw_2(CurPage, pGraphics, Pr);
        this.Internal_Draw_3(CurPage, pGraphics);
        this.Internal_Draw_4(CurPage, pGraphics);
        this.Internal_Draw_5(CurPage, pGraphics);
        this.Internal_Draw_6(CurPage, pGraphics, Pr);
    },
    Internal_Draw_1: function (CurPage, pGraphics, Pr) {},
    Internal_Draw_2: function (CurPage, pGraphics, Pr) {},
    Internal_Draw_3: function (CurPage, pGraphics) {
        var bDrawComments = false;
        var CommentsFlag = comments_NoComment;
        var CollaborativeChanges = 0;
        var StartPagePos = this.Lines[this.Pages[CurPage].StartLine].StartPos;
        if (undefined === pGraphics.RENDERER_PDF_FLAG) {
            var Pos = 0;
            while (Pos < StartPagePos) {
                Item = this.Content[Pos];
                if (para_CollaborativeChangesEnd == Item.Type) {
                    CollaborativeChanges--;
                } else {
                    if (para_CollaborativeChangesStart == Item.Type) {
                        CollaborativeChanges++;
                    }
                }
                Pos++;
            }
        }
        var Pr = {
            TextPr: null,
            ParaPr: null
        };
        var CurTextPr = this.Internal_CalculateTextPr(StartPagePos, Pr);
        var StartLine = this.Pages[CurPage].StartLine;
        var EndLine = this.Pages[CurPage].EndLine;
        for (var CurLine = StartLine; CurLine <= EndLine; CurLine++) {
            var EndLinePos = this.Lines[CurLine].EndPos;
            var Y0 = (this.Pages[CurPage].Y + this.Lines[CurLine].Y - this.Lines[CurLine].Metrics.Ascent);
            var Y1 = (this.Pages[CurPage].Y + this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent);
            if (this.Lines[CurLine].Metrics.LineGap < 0) {
                Y1 += this.Lines[CurLine].Metrics.LineGap;
            }
            var RangesCount = this.Lines[CurLine].Ranges.length;
            for (var CurRange = 0; CurRange < RangesCount; CurRange++) {
                var aHigh = new CParaDrawingRangeLines();
                var aColl = new CParaDrawingRangeLines();
                var aFind = new CParaDrawingRangeLines();
                var aComm = new CParaDrawingRangeLines();
                var X = this.Lines[CurLine].Ranges[CurRange].XVisible;
                var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
                var EndPos = (CurRange === RangesCount - 1 ? EndLinePos : this.Lines[CurLine].Ranges[CurRange + 1].StartPos - 1);
                for (var Pos = StartPos; Pos <= EndPos; Pos++) {
                    var Item = this.Content[Pos];
                    var bSearchResult = false;
                    for (var SId in this.SearchResults) {
                        var SResult = this.SearchResults[SId];
                        if (Pos >= SResult.StartPos && Pos < SResult.EndPos) {
                            bSearchResult = true;
                            break;
                        }
                    }
                    switch (Item.Type) {
                    case para_Numbering:
                        var NumPr = Pr.ParaPr.NumPr;
                        if (undefined === NumPr || undefined === NumPr.NumId || 0 === NumPr.NumId) {
                            break;
                        }
                        var Numbering = this.Parent.Get_Numbering();
                        var NumLvl = Numbering.Get_AbstractNum(NumPr.NumId).Lvl[NumPr.Lvl];
                        var NumJc = NumLvl.Jc;
                        var NumTextPr = this.Get_CompiledPr2(false).TextPr.Copy();
                        NumTextPr.Merge(this.TextPr.Value);
                        NumTextPr.Merge(NumLvl.TextPr);
                        var X_start = X;
                        if (align_Right === NumJc) {
                            X_start = X - Item.WidthNum;
                        } else {
                            if (align_Center === NumJc) {
                                X_start = X - Item.WidthNum / 2;
                            }
                        }
                        if (highlight_None != NumTextPr.HighLight) {
                            aHigh.Add(Y0, Y1, X_start, X_start + Item.WidthNum + Item.WidthSuff, 0, NumTextPr.HighLight.r, NumTextPr.HighLight.g, NumTextPr.HighLight.b);
                        }
                        if (CollaborativeChanges > 0) {
                            aColl.Add(Y0, Y1, X_start, X_start + Item.WidthNum + Item.WidthSuff, 0, 0, 0, 0);
                        }
                        X += Item.WidthVisible;
                        break;
                    case para_PresentationNumbering:
                        X += Item.WidthVisible;
                        break;
                    case para_PageNum:
                        case para_Drawing:
                        case para_Tab:
                        case para_Text:
                        if (para_Drawing === Item.Type && drawing_Anchor === Item.DrawingType) {
                            break;
                        }
                        if (CommentsFlag != comments_NoComment && true === bDrawComments) {
                            aComm.Add(Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0, {
                                Active: CommentsFlag === comments_ActiveComment ? true : false
                            });
                        } else {
                            if (highlight_None != CurTextPr.HighLight) {
                                aHigh.Add(Y0, Y1, X, X + Item.WidthVisible, 0, CurTextPr.HighLight.r, CurTextPr.HighLight.g, CurTextPr.HighLight.b);
                            }
                        }
                        if (true === bSearchResult) {
                            aFind.Add(Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0);
                        } else {
                            if (CollaborativeChanges > 0) {
                                aColl.Add(Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0);
                            }
                        }
                        if (para_Drawing != Item.Type || drawing_Anchor != Item.DrawingType) {
                            X += Item.WidthVisible;
                        }
                        break;
                    case para_Space:
                        if (Pos >= this.Lines[CurLine].Ranges[CurRange].StartPos2 && Pos <= this.Lines[CurLine].Ranges[CurRange].EndPos2) {
                            if (CommentsFlag != comments_NoComment && bDrawComments) {
                                aComm.Add(Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0, {
                                    Active: CommentsFlag === comments_ActiveComment ? true : false
                                });
                            } else {
                                if (highlight_None != CurTextPr.HighLight) {
                                    aHigh.Add(Y0, Y1, X, X + Item.WidthVisible, 0, CurTextPr.HighLight.r, CurTextPr.HighLight.g, CurTextPr.HighLight.b);
                                }
                            }
                        }
                        if (true === bSearchResult) {
                            aFind.Add(Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0);
                        } else {
                            if (CollaborativeChanges > 0) {
                                aColl.Add(Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0);
                            }
                        }
                        X += Item.WidthVisible;
                        break;
                    case para_TextPr:
                        CurTextPr = this.Internal_CalculateTextPr(Pos);
                        break;
                    case para_End:
                        if (CollaborativeChanges > 0) {
                            aColl.Add(Y0, Y1, X, X + Item.WidthVisible, 0, 0, 0, 0);
                        }
                        X += Item.Width;
                        break;
                    case para_NewLine:
                        X += Item.WidthVisible;
                        break;
                    case para_CollaborativeChangesStart:
                        CollaborativeChanges++;
                        break;
                    case para_CollaborativeChangesEnd:
                        CollaborativeChanges--;
                        break;
                    case para_CommentStart:
                        if (undefined === pGraphics.RENDERER_PDF_FLAG) {
                            var CommentId = Item.Id;
                            var CommentY = this.Pages[PNum].Y + this.Lines[CurLine].Top;
                            var CommentH = this.Lines[CurLine].Bottom - this.Lines[CurLine].Top;
                            DocumentComments.Set_StartInfo(CommentId, this.Get_StartPage_Absolute() + PNum, X, CommentY, CommentH, this.Id);
                            DocumentComments.Add_CurrentDraw(CommentId);
                            CommentsFlag = DocumentComments.Check_CurrentDraw();
                        }
                        break;
                    case para_CommentEnd:
                        if (undefined === pGraphics.RENDERER_PDF_FLAG) {
                            var CommentId = Item.Id;
                            var CommentY = this.Pages[PNum].Y + this.Lines[CurLine].Top;
                            var CommentH = this.Lines[CurLine].Bottom - this.Lines[CurLine].Top;
                            DocumentComments.Set_EndInfo(CommentId, this.Get_StartPage_Absolute() + PNum, X, CommentY, CommentH, this.Id);
                            DocumentComments.Remove_CurrentDraw(CommentId);
                            CommentsFlag = DocumentComments.Check_CurrentDraw();
                        }
                        break;
                    }
                }
                if ((this.Lines[CurLine].Ranges[CurRange].W > 0.001 || true === this.IsEmpty()) && ((this.Pages.length - 1 === CurPage) || (CurLine < this.Pages[CurPage + 1].FirstLine)) && shd_Clear === Pr.ParaPr.Shd.Value) {
                    var TempX0 = this.Lines[CurLine].Ranges[CurRange].X;
                    if (0 === CurRange) {
                        TempX0 = Math.min(TempX0, this.Pages[CurPage].X + Pr.ParaPr.Ind.Left, this.Pages[CurPage].X + Pr.ParaPr.Ind.Left + Pr.ParaPr.Ind.FirstLine);
                    }
                    var TempX1 = this.Lines[CurLine].Ranges[CurRange].XEnd;
                    var TempTop = this.Lines[CurLine].Top;
                    var TempBottom = this.Lines[CurLine].Bottom;
                    if (0 === CurLine) {
                        var PrevEl = this.Get_DocumentPrev();
                        var PrevPr = null;
                        var PrevLeft = 0;
                        var PrevRight = 0;
                        var CurLeft = Math.min(Pr.ParaPr.Ind.Left, Pr.ParaPr.Ind.Left + Pr.ParaPr.Ind.FirstLine);
                        var CurRight = Pr.ParaPr.Ind.Right;
                        if (null != PrevEl && type_Paragraph === PrevEl.GetType()) {
                            PrevPr = PrevEl.Get_CompiledPr2();
                            PrevLeft = Math.min(PrevPr.ParaPr.Ind.Left, PrevPr.ParaPr.Ind.Left + PrevPr.ParaPr.Ind.FirstLine);
                            PrevRight = PrevPr.ParaPr.Ind.Right;
                        }
                        if (true === Pr.ParaPr.Brd.First) {
                            if (null === PrevEl || true === this.Is_StartFromNewPage() || null === PrevPr || shd_Nil === PrevPr.ParaPr.Shd.Value || PrevLeft != CurLeft || CurRight != PrevRight || false === this.Internal_Is_NullBorders(PrevPr.ParaPr.Brd) || false === this.Internal_Is_NullBorders(Pr.ParaPr.Brd)) {
                                if (false === this.Is_StartFromNewPage() || null === PrevEl) {
                                    TempTop += Pr.ParaPr.Spacing.Before;
                                }
                            }
                        }
                    }
                    if (this.Lines.length - 1 === CurLine) {
                        var NextEl = this.Get_DocumentNext();
                        var NextPr = null;
                        var NextLeft = 0;
                        var NextRight = 0;
                        var CurLeft = Math.min(Pr.ParaPr.Ind.Left, Pr.ParaPr.Ind.Left + Pr.ParaPr.Ind.FirstLine);
                        var CurRight = Pr.ParaPr.Ind.Right;
                        if (null != NextEl && type_Paragraph === NextEl.GetType()) {
                            NextPr = NextEl.Get_CompiledPr2();
                            NextLeft = Math.min(NextPr.ParaPr.Ind.Left, NextPr.ParaPr.Ind.Left + NextPr.ParaPr.Ind.FirstLine);
                            NextRight = NextPr.ParaPr.Ind.Right;
                        }
                        if (null != NextEl && type_Paragraph === NextEl.GetType() && true === NextEl.Is_StartFromNewPage()) {
                            TempBottom = this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
                        } else {
                            if (true === Pr.ParaPr.Brd.Last) {
                                if (null === NextEl || true === NextEl.Is_StartFromNewPage() || null === NextPr || shd_Nil === NextPr.ParaPr.Shd.Value || NextLeft != CurLeft || CurRight != NextRight || false === this.Internal_Is_NullBorders(NextPr.ParaPr.Brd) || false === this.Internal_Is_NullBorders(Pr.ParaPr.Brd)) {
                                    TempBottom -= Pr.ParaPr.Spacing.After;
                                }
                            }
                        }
                    }
                    if (0 === CurRange) {
                        if (Pr.ParaPr.Brd.Left.Value === border_Single) {
                            TempX0 -= 1 + Pr.ParaPr.Brd.Left.Size + Pr.ParaPr.Brd.Left.Space;
                        } else {
                            TempX0 -= 1;
                        }
                    }
                    if (this.Lines[CurLine].Ranges.length - 1 === CurRange) {
                        if (Pr.ParaPr.Brd.Right.Value === border_Single) {
                            TempX1 += 1 + Pr.ParaPr.Brd.Right.Size + Pr.ParaPr.Brd.Right.Space;
                        } else {
                            TempX1 += 1;
                        }
                    }
                    pGraphics.b_color1(Pr.ParaPr.Shd.Color.r, Pr.ParaPr.Shd.Color.g, Pr.ParaPr.Shd.Color.b, 255);
                    pGraphics.rect(TempX0, this.Pages[CurPage].Y + TempTop, TempX1 - TempX0, TempBottom - TempTop);
                    pGraphics.df();
                }
                var Element = aHigh.Get_Next();
                while (null != Element) {
                    pGraphics.b_color1(Element.r, Element.g, Element.b, 255);
                    pGraphics.rect(Element.x0, Element.y0, Element.x1 - Element.x0, Element.y1 - Element.y0);
                    pGraphics.df();
                    Element = aHigh.Get_Next();
                }
                Element = aComm.Get_Next();
                while (null != Element) {
                    if (Element.Additional.Active === true) {
                        pGraphics.b_color1(240, 200, 120, 255);
                    } else {
                        pGraphics.b_color1(248, 231, 195, 255);
                    }
                    pGraphics.rect(Element.x0, Element.y0, Element.x1 - Element.x0, Element.y1 - Element.y0);
                    pGraphics.df();
                    Element = aComm.Get_Next();
                }
                Element = aColl.Get_Next();
                while (null != Element) {
                    pGraphics.drawCollaborativeChanges(Element.x0, Element.y0, Element.x1 - Element.x0, Element.y1 - Element.y0);
                    Element = aColl.Get_Next();
                }
                Element = aFind.Get_Next();
                while (null != Element) {
                    pGraphics.drawSearchResult(Element.x0, Element.y0, Element.x1 - Element.x0, Element.y1 - Element.y0);
                    Element = aFind.Get_Next();
                }
            }
            if ((this.Pages.length - 1 === CurPage) || (CurLine < this.Pages[CurPage + 1].FirstLine)) {
                var TempX0 = Math.min(this.Lines[CurLine].Ranges[0].X, this.Pages[CurPage].X + Pr.ParaPr.Ind.Left, this.Pages[CurPage].X + Pr.ParaPr.Ind.Left + Pr.ParaPr.Ind.FirstLine);
                var TempX1 = this.Lines[CurLine].Ranges[this.Lines[CurLine].Ranges.length - 1].XEnd;
                var TempTop = this.Lines[CurLine].Top;
                var TempBottom = this.Lines[CurLine].Bottom;
                if (0 === CurLine) {
                    if (true === Pr.ParaPr.Brd.First && (Pr.ParaPr.Brd.Top.Value === border_Single || shd_Clear === Pr.ParaPr.Shd.Value)) {
                        if (false === this.Is_StartFromNewPage() || null === this.Get_DocumentPrev()) {
                            TempTop += Pr.ParaPr.Spacing.Before;
                        }
                    }
                }
                if (this.Lines.length - 1 === CurLine) {
                    var NextEl = this.Get_DocumentNext();
                    if (null != NextEl && type_Paragraph === NextEl.GetType() && true === NextEl.Is_StartFromNewPage()) {
                        TempBottom = this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
                    } else {
                        if (true === Pr.ParaPr.Brd.Last && (Pr.ParaPr.Brd.Bottom.Value === border_Single || shd_Clear === Pr.ParaPr.Shd.Value)) {
                            TempBottom -= Pr.ParaPr.Spacing.After;
                        }
                    }
                }
                if (Pr.ParaPr.Brd.Right.Value === border_Single) {
                    pGraphics.p_color(Pr.ParaPr.Brd.Right.Color.r, Pr.ParaPr.Brd.Right.Color.g, Pr.ParaPr.Brd.Right.Color.b, 255);
                    pGraphics.drawVerLine(c_oAscLineDrawingRule.Right, TempX1 + 1 + Pr.ParaPr.Brd.Right.Size + Pr.ParaPr.Brd.Right.Space, this.Pages[CurPage].Y + TempTop, this.Pages[CurPage].Y + TempBottom, Pr.ParaPr.Brd.Right.Size);
                }
                if (Pr.ParaPr.Brd.Left.Value === border_Single) {
                    pGraphics.p_color(Pr.ParaPr.Brd.Left.Color.r, Pr.ParaPr.Brd.Left.Color.g, Pr.ParaPr.Brd.Left.Color.b, 255);
                    pGraphics.drawVerLine(c_oAscLineDrawingRule.Left, TempX0 - 1 - Pr.ParaPr.Brd.Left.Size - Pr.ParaPr.Brd.Left.Space, this.Pages[CurPage].Y + TempTop, this.Pages[CurPage].Y + TempBottom, Pr.ParaPr.Brd.Left.Size);
                }
            }
        }
    },
    Internal_Draw_4: function (CurPage, pGraphics) {
        var StartPagePos = this.Lines[this.Pages[CurPage].StartLine].StartPos;
        var HyperPos = this.Internal_FindBackward(StartPagePos, [para_HyperlinkStart, para_HyperlinkEnd]);
        var bVisitedHyperlink = false;
        if (true === HyperPos.Found && para_HyperlinkStart === HyperPos.Type) {
            bVisitedHyperlink = this.Content[HyperPos.LetterPos].Get_Visited();
        }
        var Pr = {
            TextPr: null,
            ParaPr: null
        };
        var CurTextPr = this.Internal_CalculateTextPr(StartPagePos, Pr);
        pGraphics.SetTextPr(CurTextPr);
        if (true === bVisitedHyperlink) {
            pGraphics.b_color1(128, 0, 151, 255);
        } else {
            pGraphics.b_color1(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
        }
        var StartLine = this.Pages[CurPage].StartLine;
        var EndLine = this.Pages[CurPage].EndLine;
        for (var CurLine = StartLine; CurLine <= EndLine; CurLine++) {
            var StartPos = this.Lines[CurLine].StartPos;
            var EndPos = this.Lines[CurLine].EndPos;
            var bFirstLineItem = true;
            var CurRange = 0;
            var Y = this.Pages[CurPage].Y + this.Lines[CurLine].Y;
            var X = this.Lines[CurLine].Ranges[CurRange].XVisible;
            var bEnd = false;
            for (var Pos = StartPos; Pos <= EndPos; Pos++) {
                var Item = this.Content[Pos];
                if (undefined != Item.CurRange) {
                    if (Item.CurRange > CurRange) {
                        CurRange = Item.CurRange;
                        X = this.Lines[CurLine].Ranges[CurRange].XVisible;
                    }
                }
                var TempY = Y;
                switch (CurTextPr.VertAlign) {
                case vertalign_SubScript:
                    Y -= vertalign_Koef_Sub * CurTextPr.FontSize * g_dKoef_pt_to_mm;
                    break;
                case vertalign_SuperScript:
                    Y -= vertalign_Koef_Super * CurTextPr.FontSize * g_dKoef_pt_to_mm;
                    break;
                }
                switch (Item.Type) {
                case para_Numbering:
                    var NumPr = Pr.ParaPr.NumPr;
                    if (undefined === NumPr || undefined === NumPr.NumId || 0 === NumPr.NumId) {
                        break;
                    }
                    var Numbering = this.Parent.Get_Numbering();
                    var NumLvl = Numbering.Get_AbstractNum(NumPr.NumId).Lvl[NumPr.Lvl];
                    var NumSuff = NumLvl.Suff;
                    var NumJc = NumLvl.Jc;
                    var NumTextPr = this.Get_CompiledPr2(false).TextPr.Copy();
                    var TextPr_temp = this.TextPr.Value.Copy();
                    TextPr_temp.Underline = undefined;
                    NumTextPr.Merge(TextPr_temp);
                    NumTextPr.Merge(NumLvl.TextPr);
                    var X_start = X;
                    if (align_Right === NumJc) {
                        X_start = X - Item.WidthNum;
                    } else {
                        if (align_Center === NumJc) {
                            X_start = X - Item.WidthNum / 2;
                        }
                    }
                    pGraphics.b_color1(NumTextPr.Color.r, NumTextPr.Color.g, NumTextPr.Color.b, 255);
                    switch (NumJc) {
                    case align_Right:
                        Item.Draw(X - Item.WidthNum, Y, pGraphics, Numbering, NumTextPr, NumPr);
                        break;
                    case align_Center:
                        Item.Draw(X - Item.WidthNum / 2, Y, pGraphics, Numbering, NumTextPr, NumPr);
                        break;
                    case align_Left:
                        default:
                        Item.Draw(X, Y, pGraphics, Numbering, NumTextPr, NumPr);
                        break;
                    }
                    if (true === editor.ShowParaMarks && numbering_suff_Tab === NumSuff) {
                        var TempWidth = Item.WidthSuff;
                        var TempRealWidth = 3.143;
                        var X1 = X;
                        switch (NumJc) {
                        case align_Right:
                            break;
                        case align_Center:
                            X1 += Item.WidthNum / 2;
                            break;
                        case align_Left:
                            default:
                            X1 += Item.WidthNum;
                            break;
                        }
                        var X0 = TempWidth / 2 - TempRealWidth / 2;
                        pGraphics.SetFont({
                            FontFamily: {
                                Name: "ASCW3",
                                Index: -1
                            },
                            FontSize: 10,
                            Italic: false,
                            Bold: false
                        });
                        if (X0 > 0) {
                            pGraphics.FillText2(X1 + X0, Y, String.fromCharCode(tab_Symbol), 0, TempWidth);
                        } else {
                            pGraphics.FillText2(X1, Y, String.fromCharCode(tab_Symbol), TempRealWidth - TempWidth, TempWidth);
                        }
                    }
                    if (true === NumTextPr.Strikeout || true === NumTextPr.Underline) {
                        pGraphics.p_color(NumTextPr.Color.r, NumTextPr.Color.g, NumTextPr.Color.b, 255);
                    }
                    if (true === NumTextPr.Strikeout) {
                        pGraphics.drawHorLine(0, (Y - NumTextPr.FontSize * g_dKoef_pt_to_mm * 0.27), X_start, X_start + Item.WidthNum, (NumTextPr.FontSize / 18) * g_dKoef_pt_to_mm);
                    }
                    if (true === NumTextPr.Underline) {
                        pGraphics.drawHorLine(0, (Y + this.Lines[CurLine].Metrics.TextDescent * 0.4), X_start, X_start + Item.WidthNum, (NumTextPr.FontSize / 18) * g_dKoef_pt_to_mm);
                    }
                    X += Item.WidthVisible;
                    break;
                case para_PresentationNumbering:
                    if (true != this.IsEmpty()) {
                        var FirstTextPr = this.Internal_CalculateTextPr(this.Internal_GetStartPos());
                        if (Pr.ParaPr.Ind.FirstLine < 0) {
                            Item.Draw(X, Y, pGraphics, FirstTextPr);
                        } else {
                            Item.Draw(this.X + Pr.ParaPr.Ind.Left, Y, pGraphics, FirstTextPr);
                        }
                    }
                    X += Item.WidthVisible;
                    break;
                case para_PageNum:
                    case para_Drawing:
                    case para_Tab:
                    case para_Text:
                    if (para_Drawing != Item.Type || drawing_Anchor != Item.DrawingType) {
                        bFirstLineItem = false;
                        if (para_PageNum != Item.Type) {
                            Item.Draw(X, Y - Item.YOffset, pGraphics);
                        } else {
                            Item.Draw(X, Y - Item.YOffset, pGraphics, this.Get_StartPage_Absolute() + CurPage, Pr.ParaPr.Jc);
                        }
                        X += Item.WidthVisible;
                    }
                    if (para_Drawing === Item.Type && drawing_Inline === Item.DrawingType) {
                        pGraphics.SetTextPr(CurTextPr);
                        pGraphics.b_color1(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
                        pGraphics.p_color(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
                    }
                    break;
                case para_Space:
                    Item.Draw(X, Y - Item.YOffset, pGraphics);
                    X += Item.WidthVisible;
                    break;
                case para_TextPr:
                    CurTextPr = this.Internal_CalculateTextPr(Pos);
                    pGraphics.SetTextPr(CurTextPr);
                    if (true === bVisitedHyperlink) {
                        pGraphics.b_color1(128, 0, 151, 255);
                    } else {
                        pGraphics.b_color1(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
                    }
                    break;
                case para_End:
                    var EndTextPr = this.Get_CompiledPr2(false).TextPr.Copy();
                    EndTextPr.Merge(this.TextPr.Value);
                    pGraphics.SetTextPr(EndTextPr);
                    pGraphics.b_color1(EndTextPr.Color.r, EndTextPr.Color.g, EndTextPr.Color.b, 255);
                    bEnd = true;
                    var bEndCell = false;
                    if (null === this.Get_DocumentNext() && true === this.Parent.Is_TableCellContent()) {
                        bEndCell = true;
                    }
                    Item.Draw(X, Y - Item.YOffset, pGraphics, bEndCell);
                    X += Item.Width;
                    break;
                case para_NewLine:
                    Item.Draw(X, Y - Item.YOffset, pGraphics);
                    X += Item.WidthVisible;
                    break;
                case para_HyperlinkStart:
                    bVisitedHyperlink = Item.Get_Visited();
                    if (true === bVisitedHyperlink) {
                        pGraphics.b_color1(128, 0, 151, 255);
                    } else {
                        pGraphics.b_color1(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
                    }
                    break;
                case para_HyperlinkEnd:
                    bVisitedHyperlink = false;
                    pGraphics.b_color1(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
                    break;
                }
                Y = TempY;
            }
        }
    },
    Internal_Draw_5: function (CurPage, pGraphics) {
        var StartPagePos = this.Lines[this.Pages[CurPage].StartLine].StartPos;
        var HyperPos = this.Internal_FindBackward(StartPagePos, [para_HyperlinkStart, para_HyperlinkEnd]);
        var bVisitedHyperlink = false;
        if (true === HyperPos.Found && para_HyperlinkStart === HyperPos.Type) {
            bVisitedHyperlink = this.Content[HyperPos.LetterPos].Get_Visited();
        }
        var Pr = {
            TextPr: null,
            ParaPr: null
        };
        var CurTextPr = this.Internal_CalculateTextPr(StartPagePos, Pr);
        if (true === bVisitedHyperlink) {
            pGraphics.p_color(128, 0, 151, 255);
        } else {
            pGraphics.p_color(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
        }
        var StartLine = this.Pages[CurPage].StartLine;
        var EndLine = this.Pages[CurPage].EndLine;
        for (var CurLine = StartLine; CurLine <= EndLine; CurLine++) {
            var EndLinePos = this.Lines[CurLine].EndPos;
            var LineY = this.Pages[CurPage].Y + this.Lines[CurLine].Y;
            var Y = LineY;
            var RangesCount = this.Lines[CurLine].Ranges.length;
            for (var CurRange = 0; CurRange < RangesCount; CurRange++) {
                var aStrikeout = new CParaDrawingRangeLines();
                var aDStrikeout = new CParaDrawingRangeLines();
                var aUnderline = new CParaDrawingRangeLines();
                var aSpelling = new CParaDrawingRangeLines();
                var X = this.Lines[CurLine].Ranges[CurRange].XVisible;
                var StartPos = this.Lines[CurLine].Ranges[CurRange].StartPos;
                var EndPos = (CurRange === RangesCount - 1 ? EndLinePos : this.Lines[CurLine].Ranges[CurRange + 1].StartPos - 1);
                for (var Pos = StartPos; Pos <= EndPos; Pos++) {
                    var Item = this.Content[Pos];
                    switch (Item.Type) {
                    case para_Numbering:
                        case para_PresentationNumbering:
                        case para_End:
                        case para_NewLine:
                        X += Item.WidthVisible;
                        break;
                    case para_PageNum:
                        case para_Drawing:
                        case para_Tab:
                        case para_Text:
                        if (para_Drawing != Item.Type || drawing_Anchor != Item.DrawingType) {
                            if (true === CurTextPr.DStrikeout) {
                                aDStrikeout.Add(Y - CurTextPr.FontSize * g_dKoef_pt_to_mm * 0.27, Y - CurTextPr.FontSize * g_dKoef_pt_to_mm * 0.27, X, X + Item.WidthVisible, (CurTextPr.FontSize / 18) * g_dKoef_pt_to_mm, CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b);
                            } else {
                                if (true === CurTextPr.Strikeout) {
                                    aStrikeout.Add(Y - CurTextPr.FontSize * g_dKoef_pt_to_mm * 0.27, Y - CurTextPr.FontSize * g_dKoef_pt_to_mm * 0.27, X, X + Item.WidthVisible, (CurTextPr.FontSize / 18) * g_dKoef_pt_to_mm, CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b);
                                }
                            }
                            if (true === CurTextPr.Underline) {
                                aUnderline.Add(Y + this.Lines[CurLine].Metrics.TextDescent * 0.4, Y + this.Lines[CurLine].Metrics.TextDescent * 0.4, X, X + Item.WidthVisible, (CurTextPr.FontSize / 18) * g_dKoef_pt_to_mm, CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b);
                            }
                            X += Item.WidthVisible;
                        }
                        break;
                    case para_Space:
                        if (Pos >= this.Lines[CurLine].Ranges[CurRange].StartPos2 && Pos <= this.Lines[CurLine].Ranges[CurRange].EndPos2) {
                            if (true === CurTextPr.DStrikeout) {
                                aDStrikeout.Add(Y - CurTextPr.FontSize * g_dKoef_pt_to_mm * 0.27, Y - CurTextPr.FontSize * g_dKoef_pt_to_mm * 0.27, X, X + Item.WidthVisible, (CurTextPr.FontSize / 18) * g_dKoef_pt_to_mm, CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b);
                            } else {
                                if (true === CurTextPr.Strikeout) {
                                    aStrikeout.Add(Y - CurTextPr.FontSize * g_dKoef_pt_to_mm * 0.27, Y - CurTextPr.FontSize * g_dKoef_pt_to_mm * 0.27, X, X + Item.WidthVisible, (CurTextPr.FontSize / 18) * g_dKoef_pt_to_mm, CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b);
                                }
                            }
                            if (true === CurTextPr.Underline) {
                                aUnderline.Add(Y + this.Lines[CurLine].Metrics.TextDescent * 0.4, Y + this.Lines[CurLine].Metrics.TextDescent * 0.4, X, X + Item.WidthVisible, (CurTextPr.FontSize / 18) * g_dKoef_pt_to_mm, CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b);
                            }
                        }
                        X += Item.WidthVisible;
                        break;
                    case para_TextPr:
                        CurTextPr = this.Internal_CalculateTextPr(Pos);
                        if (true === bVisitedHyperlink) {
                            pGraphics.p_color(128, 0, 151, 255);
                        } else {
                            pGraphics.p_color(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
                        }
                        switch (CurTextPr.VertAlign) {
                        case vertalign_SubScript:
                            Y = LineY - vertalign_Koef_Sub * CurTextPr.FontSize * g_dKoef_pt_to_mm;
                            break;
                        case vertalign_SuperScript:
                            Y = LineY - vertalign_Koef_Super * CurTextPr.FontSize * g_dKoef_pt_to_mm;
                            break;
                        default:
                            Y = LineY;
                            break;
                        }
                        break;
                    case para_HyperlinkStart:
                        bVisitedHyperlink = Item.Get_Visited();
                        if (true === bVisitedHyperlink) {
                            pGraphics.p_color(128, 0, 151, 255);
                        } else {
                            pGraphics.p_color(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
                        }
                        break;
                    case para_HyperlinkEnd:
                        bVisitedHyperlink = false;
                        pGraphics.p_color(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
                        break;
                    }
                }
                var Element = aStrikeout.Get_Next();
                while (null != Element) {
                    pGraphics.p_color(Element.r, Element.g, Element.b, 255);
                    pGraphics.drawHorLine(c_oAscLineDrawingRule.Top, Element.y0, Element.x0, Element.x1, Element.w);
                    Element = aStrikeout.Get_Next();
                }
                Element = aDStrikeout.Get_Next();
                while (null != Element) {
                    pGraphics.p_color(Element.r, Element.g, Element.b, 255);
                    pGraphics.drawHorLine2(c_oAscLineDrawingRule.Top, Element.y0, Element.x0, Element.x1, Element.w);
                    Element = aDStrikeout.Get_Next();
                }
                Element = aUnderline.Get_Next();
                while (null != Element) {
                    pGraphics.p_color(Element.r, Element.g, Element.b, 255);
                    pGraphics.drawHorLine(0, Element.y0, Element.x0, Element.x1, Element.w);
                    Element = aUnderline.Get_Next();
                }
                pGraphics.p_color(255, 0, 0, 255);
                Element = aSpelling.Get_Next();
                while (null != Element) {
                    pGraphics.drawHorLine(0, Element.y0, Element.x0, Element.x1, Element.w);
                    Element = aSpelling.Get_Next();
                }
            }
        }
    },
    Internal_Draw_6: function (CurPage, pGraphics, Pr) {
        var X_left = Math.min(this.Pages[CurPage].X + Pr.ParaPr.Ind.Left, this.Pages[CurPage].X + Pr.ParaPr.Ind.Left + Pr.ParaPr.Ind.FirstLine);
        var X_right = this.Pages[CurPage].XLimit - Pr.ParaPr.Ind.Right;
        if (Pr.ParaPr.Brd.Left.Value === border_Single) {
            X_left -= 1 + Pr.ParaPr.Brd.Left.Space;
        } else {
            X_left -= 1;
        }
        if (Pr.ParaPr.Brd.Right.Value === border_Single) {
            X_right += 1 + Pr.ParaPr.Brd.Right.Space;
        } else {
            X_right += 1;
        }
        var LeftMW = -(border_Single === Pr.ParaPr.Brd.Left.Value ? Pr.ParaPr.Brd.Left.Size : 0);
        var RightMW = (border_Single === Pr.ParaPr.Brd.Right.Value ? Pr.ParaPr.Brd.Right.Size : 0);
        if (true === Pr.ParaPr.Brd.First && border_Single === Pr.ParaPr.Brd.Top.Value && ((0 === CurPage && (false === this.Is_StartFromNewPage() || null === this.Get_DocumentPrev())) || (1 === CurPage && true === this.Is_StartFromNewPage()))) {
            var Y_top = this.Pages[CurPage].Y;
            if (0 === CurPage) {
                Y_top += Pr.ParaPr.Spacing.Before;
            }
            pGraphics.p_color(Pr.ParaPr.Brd.Top.Color.r, Pr.ParaPr.Brd.Top.Color.g, Pr.ParaPr.Brd.Top.Color.b, 255);
            var StartLine = this.Pages[CurPage].StartLine;
            var RangesCount = this.Lines[StartLine].Ranges.length;
            for (var CurRange = 0; CurRange < RangesCount; CurRange++) {
                var X0 = (0 === CurRange ? X_left : this.Lines[StartLine].Ranges[CurRange].X);
                var X1 = (RangesCount - 1 === CurRange ? X_right : this.Lines[StartLine].Ranges[CurRange].XEnd);
                if (this.Lines[StartLine].Ranges[CurRange].W > 0.001) {
                    pGraphics.drawHorLineExt(c_oAscLineDrawingRule.Top, Y_top, X0, X1, Pr.ParaPr.Brd.Top.Size, LeftMW, RightMW);
                }
            }
        } else {
            if (false === Pr.ParaPr.Brd.First) {
                var Size = 0;
                var Y = 0;
                if (1 === CurPage && true === this.Is_StartFromNewPage() && border_Single === Pr.ParaPr.Brd.Top.Value) {
                    pGraphics.p_color(Pr.ParaPr.Brd.Top.Color.r, Pr.ParaPr.Brd.Top.Color.g, Pr.ParaPr.Brd.Top.Color.b, 255);
                    Size = Pr.ParaPr.Brd.Top.Size;
                    Y = this.Pages[CurPage].Y + this.Lines[this.Pages[CurPage].FirstLine].Top;
                } else {
                    if (0 === CurPage && false === this.Is_StartFromNewPage() && border_Single === Pr.ParaPr.Brd.Between.Value) {
                        pGraphics.p_color(Pr.ParaPr.Brd.Between.Color.r, Pr.ParaPr.Brd.Between.Color.g, Pr.ParaPr.Brd.Between.Color.b, 255);
                        Size = Pr.ParaPr.Brd.Between.Size;
                        Y = this.Pages[CurPage].Y;
                    }
                }
                var StartLine = this.Pages[CurPage].StartLine;
                var RangesCount = this.Lines[StartLine].Ranges.length;
                for (var CurRange = 0; CurRange < RangesCount; CurRange++) {
                    var X0 = (0 === CurRange ? X_left : this.Lines[StartLine].Ranges[CurRange].X);
                    var X1 = (RangesCount - 1 === CurRange ? X_right : this.Lines[StartLine].Ranges[CurRange].XEnd);
                    if (this.Lines[StartLine].Ranges[CurRange].W > 0.001) {
                        pGraphics.drawHorLineExt(c_oAscLineDrawingRule.Top, Y, X0, X1, Size, LeftMW, RightMW);
                    }
                }
            }
        }
        var CurLine = this.Pages[CurPage].EndLine;
        var bEnd = (this.Content.length - 2 <= this.Lines[CurLine].EndPos ? true : false);
        if (true === bEnd && true === Pr.ParaPr.Brd.Last && border_Single === Pr.ParaPr.Brd.Bottom.Value) {
            var TempY = this.Pages[CurPage].Y;
            var NextEl = this.Get_DocumentNext();
            var DrawLineRule = c_oAscLineDrawingRule.Bottom;
            if (null != NextEl && type_Paragraph === NextEl.GetType() && true === NextEl.Is_StartFromNewPage()) {
                TempY = this.Pages[CurPage].Y + this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
                DrawLineRule = c_oAscLineDrawingRule.Top;
            } else {
                TempY = this.Pages[CurPage].Y + this.Lines[CurLine].Bottom - Pr.ParaPr.Spacing.After;
                DrawLineRule = c_oAscLineDrawingRule.Bottom;
            }
            pGraphics.p_color(Pr.ParaPr.Brd.Bottom.Color.r, Pr.ParaPr.Brd.Bottom.Color.g, Pr.ParaPr.Brd.Bottom.Color.b, 255);
            var EndLine = this.Pages[CurPage].EndLine;
            var RangesCount = this.Lines[EndLine].Ranges.length;
            for (var CurRange = 0; CurRange < RangesCount; CurRange++) {
                var X0 = (0 === CurRange ? X_left : this.Lines[EndLine].Ranges[CurRange].X);
                var X1 = (RangesCount - 1 === CurRange ? X_right : this.Lines[EndLine].Ranges[CurRange].XEnd);
                if (this.Lines[EndLine].Ranges[CurRange].W > 0.001) {
                    pGraphics.drawHorLineExt(DrawLineRule, TempY, X0, X1, Pr.ParaPr.Brd.Bottom.Size, LeftMW, RightMW);
                }
            }
        } else {
            if (true === bEnd && false === Pr.ParaPr.Brd.Last && border_Single === Pr.ParaPr.Brd.Bottom.Value) {
                var NextEl = this.Get_DocumentNext();
                if (null != NextEl && type_Paragraph === NextEl.GetType() && true === NextEl.Is_StartFromNewPage()) {
                    pGraphics.p_color(Pr.ParaPr.Brd.Bottom.Color.r, Pr.ParaPr.Brd.Bottom.Color.g, Pr.ParaPr.Brd.Bottom.Color.b, 255);
                    var EndLine = this.Pages[CurPage].EndLine;
                    var RangesCount = this.Lines[EndLine].Ranges.length;
                    for (var CurRange = 0; CurRange < RangesCount; CurRange++) {
                        var X0 = (0 === CurRange ? X_left : this.Lines[EndLine].Ranges[CurRange].X);
                        var X1 = (RangesCount - 1 === CurRange ? X_right : this.Lines[EndLine].Ranges[CurRange].XEnd);
                        if (this.Lines[EndLine].Ranges[CurRange].W > 0.001) {
                            pGraphics.drawHorLineExt(c_oAscLineDrawingRule.Top, this.Pages[CurPage].Y + this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap, X0, X1, Pr.ParaPr.Brd.Bottom.Size, LeftMW, RightMW);
                        }
                    }
                }
            }
        }
    },
    ReDraw: function () {
        this.Parent.OnContentReDraw(this.Get_StartPage_Absolute(), this.Get_StartPage_Absolute() + this.Pages.length - 1);
    },
    Shift: function (PageIndex, Dx, Dy) {
        if (0 === PageIndex) {
            this.X += Dx;
            this.Y += Dy;
            this.XLimit += Dx;
            this.YLimit += Dy;
        }
        var Page_abs = PageIndex + this.Get_StartPage_Absolute();
        this.Pages[PageIndex].Shift(Dx, Dy);
        var StartLine = this.Pages[PageIndex].FirstLine;
        var EndLine = (PageIndex >= this.Pages.length - 1 ? this.Lines.length - 1 : this.Pages[PageIndex + 1].FirstLine - 1);
        for (var CurLine = StartLine; CurLine <= EndLine; CurLine++) {
            this.Lines[CurLine].Shift(Dx, Dy);
        }
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            var Item = this.Content[Index];
            if (para_Drawing === Item.Type && Item.PageNum === Page_abs) {
                Item.Shift(Dx, Dy);
            }
        }
    },
    Remove: function (nCount, bOnlyText) {
        for (var Pos = 0; Pos < this.Content.length; Pos++) {
            var Item = this.Content[Pos];
            if (para_CollaborativeChangesEnd === Item.Type || para_CollaborativeChangesStart === Item.Type) {
                this.Internal_Content_Remove(Pos);
                Pos--;
            }
        }
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
        if (true === this.Selection.Use) {
            var StartPos = this.Selection.StartPos;
            var EndPos = this.Selection.EndPos;
            if (StartPos > EndPos) {
                var Temp = EndPos;
                EndPos = StartPos;
                StartPos = Temp;
            }
            if (EndPos >= this.Content.length - 1) {
                for (var Index = StartPos; Index < this.Content.length - 2; Index++) {
                    var Item = this.Content[Index];
                    if (para_Drawing === Item.Type) {
                        var ObjId = Item.Get_Id();
                        this.Parent.DrawingObjects.Remove_ById(ObjId);
                    }
                }
                var Hyper_start = null;
                if (StartPos < EndPos) {
                    Hyper_start = this.Check_Hyperlink2(StartPos);
                }
                this.Internal_Content_Remove2(StartPos, this.Content.length - 2 - StartPos);
                StartPos = this.Selection.StartPos;
                EndPos = this.Selection.EndPos;
                if (StartPos > EndPos) {
                    var Temp = EndPos;
                    EndPos = StartPos;
                    StartPos = Temp;
                }
                this.CurPos.ContentPos = StartPos;
                this.CurPos.Line = -1;
                if (null != Hyper_start) {
                    this.Internal_Content_Add(StartPos, new ParaTextPr());
                    this.Internal_Content_Add(StartPos, new ParaHyperlinkEnd());
                }
                return false;
            } else {
                var Hyper_start = this.Check_Hyperlink2(StartPos);
                var Hyper_end = this.Check_Hyperlink2(EndPos);
                for (var Index = StartPos; Index < EndPos; Index++) {
                    var Item = this.Content[Index];
                    if (para_Drawing === Item.Type) {
                        var ObjId = Item.Get_Id();
                        this.Parent.DrawingObjects.Remove_ById(ObjId);
                    }
                }
                var TextPr = this.Internal_CalculateTextPr(EndPos + 1);
                this.Internal_Content_Remove2(StartPos, EndPos - StartPos);
                StartPos = this.Selection.StartPos;
                EndPos = this.Selection.EndPos;
                if (StartPos > EndPos) {
                    var Temp = EndPos;
                    EndPos = StartPos;
                    StartPos = Temp;
                }
                this.Internal_Content_Add(StartPos, new ParaTextPr(TextPr));
                this.CurPos.ContentPos = StartPos;
                this.CurPos.Line = -1;
                if (null != Hyper_end && Hyper_start != Hyper_end) {
                    this.Internal_Content_Add(StartPos, Hyper_end);
                    this.CurPos.ContentPos++;
                }
                if (null != Hyper_start && Hyper_start != Hyper_end) {
                    this.Internal_Content_Add(StartPos, new ParaHyperlinkEnd());
                    this.CurPos.ContentPos++;
                }
            }
            return;
        }
        if (0 == nCount) {
            return;
        }
        var absCount = (nCount < 0 ? -nCount : nCount);
        for (var Index = 0; Index < absCount; Index++) {
            if (nCount < 0) {
                if (false === this.Internal_RemoveBackward(bOnlyText)) {
                    return false;
                }
            } else {
                if (false === this.Internal_RemoveForward(bOnlyText)) {
                    return false;
                }
            }
        }
        return true;
    },
    Internal_RemoveBackward: function (bOnlyText) {
        var Line = this.Content;
        var CurPos = this.CurPos.ContentPos;
        if (!bOnlyText) {
            if (CurPos == 0) {
                return false;
            } else {
                this.Internal_Content_Remove(CurPos - 1);
            }
        } else {
            var LetterPos = CurPos - 1;
            var oPos = this.Internal_FindBackward(LetterPos, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine]);
            if (oPos.Found) {
                if (para_Drawing === oPos.Type) {
                    this.Parent.Select_DrawingObject(this.Content[oPos.LetterPos].Get_Id());
                } else {
                    this.Internal_Content_Remove(oPos.LetterPos);
                    this.CurPos.ContentPos = oPos.LetterPos;
                    this.CurPos.Line = -1;
                }
            } else {
                var Pr = this.Get_CompiledPr2(false).ParaPr;
                if (undefined != this.Numbering_Get()) {
                    this.Numbering_Remove();
                    this.Set_Ind({
                        FirstLine: 0,
                        Left: Math.max(Pr.Ind.Left, Pr.Ind.Left + Pr.Ind.FirstLine)
                    },
                    false);
                } else {
                    if (numbering_presentationnumfrmt_None != this.PresentationPr.Bullet.Get_Type()) {
                        this.Remove_PresentationNumbering();
                    } else {
                        if (Math.abs(Pr.Ind.FirstLine) > 0.001) {
                            if (Pr.Ind.FirstLine > 0) {
                                this.Set_Ind({
                                    FirstLine: 0
                                },
                                false);
                            } else {
                                this.Set_Ind({
                                    Left: Pr.Ind.Left + Pr.Ind.FirstLine,
                                    FirstLine: 0
                                },
                                false);
                            }
                        } else {
                            if (Math.abs(Pr.Ind.Left) > 0.001) {
                                this.Set_Ind({
                                    Left: 0
                                },
                                false);
                            } else {
                                return false;
                            }
                        }
                    }
                }
            }
        }
        return true;
    },
    Internal_RemoveForward: function (bOnlyText) {
        var Line = this.Content;
        var CurPos = this.CurPos.ContentPos;
        if (!bOnlyText) {
            if (CurPos == Line.length - 1) {
                return false;
            } else {
                this.Internal_Content_Remove(CurPos + 1);
            }
        } else {
            var LetterPos = CurPos;
            var oPos = this.Internal_FindForward(LetterPos, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine]);
            if (oPos.Found) {
                if (para_Drawing === oPos.Type) {
                    this.Parent.Select_DrawingObject(this.Content[oPos.LetterPos].Get_Id());
                } else {
                    this.Internal_Content_Remove(oPos.LetterPos);
                    this.CurPos.ContentPos = oPos.LetterPos;
                    this.CurPos.Line = -1;
                }
            } else {
                return false;
            }
        }
        return true;
    },
    Internal_FindForward: function (CurPos, arrId) {
        var LetterPos = CurPos;
        var bFound = false;
        var Type = para_Unknown;
        if (CurPos < 0 || CurPos >= this.Content.length) {
            return {
                Found: false
            };
        }
        while (!bFound) {
            Type = this.Content[LetterPos].Type;
            for (var Id = 0; Id < arrId.length; Id++) {
                if (arrId[Id] == Type) {
                    bFound = true;
                    break;
                }
            }
            if (bFound) {
                break;
            }
            LetterPos++;
            if (LetterPos > this.Content.length - 1) {
                break;
            }
        }
        return {
            LetterPos: LetterPos,
            Found: bFound,
            Type: Type
        };
    },
    Internal_FindBackward: function (CurPos, arrId) {
        var LetterPos = CurPos;
        var bFound = false;
        var Type = para_Unknown;
        if (CurPos < 0 || CurPos >= this.Content.length) {
            return {
                Found: false
            };
        }
        while (!bFound) {
            Type = this.Content[LetterPos].Type;
            for (var Id = 0; Id < arrId.length; Id++) {
                if (arrId[Id] == Type) {
                    bFound = true;
                    break;
                }
            }
            if (bFound) {
                break;
            }
            LetterPos--;
            if (LetterPos < 0) {
                break;
            }
        }
        return {
            LetterPos: LetterPos,
            Found: bFound,
            Type: Type
        };
    },
    Internal_CalculateTextPr: function (LetterPos, StartPr) {
        var Pr;
        if ("undefined" != typeof(StartPr)) {
            Pr = this.Get_CompiledPr();
            StartPr.ParaPr = Pr.ParaPr;
            StartPr.TextPr = Pr.TextPr;
        } else {
            Pr = this.Get_CompiledPr2(false);
        }
        var TextPr = Pr.TextPr.Copy();
        if (LetterPos < 0) {
            return TextPr;
        }
        var Pos = this.Internal_FindBackward(LetterPos, [para_TextPr]);
        if (true === Pos.Found) {
            var CurTextPr = this.Content[Pos.LetterPos].Value;
            if (undefined != CurTextPr.RStyle) {
                var Styles = this.Parent.Get_Styles();
                var StyleTextPr = Styles.Get_Pr(CurTextPr.RStyle, styletype_Character).TextPr;
                TextPr.Merge(StyleTextPr);
            }
            TextPr.Merge(CurTextPr);
        }
        TextPr.FontFamily.Name = TextPr.RFonts.Ascii.Name;
        TextPr.FontFamily.Index = TextPr.RFonts.Ascii.Index;
        return TextPr;
    },
    Internal_GetLang: function (LetterPos) {
        var Lang = this.Get_CompiledPr2(false).TextPr.Lang.Copy();
        if (LetterPos < 0) {
            return Lang;
        }
        var Pos = this.Internal_FindBackward(LetterPos, [para_TextPr]);
        if (true === Pos.Found) {
            var CurTextPr = this.Content[Pos.LetterPos].Value;
            if (undefined != CurTextPr.RStyle) {
                var Styles = this.Parent.Get_Styles();
                var StyleTextPr = Styles.Get_Pr(CurTextPr.RStyle, styletype_Character).TextPr;
                Lang.Merge(StyleTextPr.Lang);
            }
            Lang.Merge(CurTextPr.Lang);
        }
        return Lang;
    },
    Internal_GetTextPr: function (LetterPos) {
        var TextPr = new CTextPr();
        if (LetterPos < 0) {
            return TextPr;
        }
        var Pos = this.Internal_FindBackward(LetterPos, [para_TextPr]);
        if (true === Pos.Found) {
            var CurTextPr = this.Content[Pos.LetterPos].Value;
            if (undefined != CurTextPr.RStyle) {
                var Styles = this.Parent.Get_Styles();
                var StyleTextPr = Styles.Get_Pr(CurTextPr.RStyle, styletype_Character).TextPr;
                TextPr.Merge(StyleTextPr);
            }
            TextPr.Merge(CurTextPr);
        }
        return TextPr;
    },
    Add: function (Item) {
        var CurPos = this.CurPos.ContentPos;
        if ("undefined" != typeof(Item.Parent)) {
            if (typeof(Item.Set_Parent) === "function") {
                Item.Set_Parent(this);
            } else {
                Item.Parent = this;
            }
        }
        switch (Item.Type) {
        case para_Text:
            this.Internal_Content_Add(CurPos, Item);
            break;
        case para_Space:
            this.Internal_Content_Add(CurPos, Item);
            break;
        case para_TextPr:
            this.Internal_AddTextPr(Item.Value);
            break;
        case para_HyperlinkStart:
            this.Internal_AddHyperlink(Item);
            break;
        case para_PageNum:
            case para_Tab:
            case para_Drawing:
            default:
            this.Internal_Content_Add(CurPos, Item);
            break;
        }
        if (para_TextPr != Item.Type) {
            this.DeleteCollaborativeMarks = true;
        }
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
    },
    Internal_IncDecFontSize: function (bIncrease, Value) {
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
    },
    IncDec_FontSize: function (bIncrease) {
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
        var StartTextPr = this.Get_CompiledPr().TextPr;
        if (true === this.ApplyToAll) {
            var StartFontSize = this.Internal_IncDecFontSize(bIncrease, StartTextPr.FontSize);
            this.Internal_Content_Add(0, new ParaTextPr({
                FontSize: StartFontSize
            }));
            for (var Index = 1; Index < this.Content.length; Index++) {
                var Item = this.Content[Index];
                if (para_TextPr === Item.Type) {
                    if (undefined != Item.Value.FontSize) {
                        Item.Set_FontSize(this.Internal_IncDecFontSize(bIncrease, Item.Value.FontSize));
                    } else {
                        Item.Set_FontSize(this.Internal_IncDecFontSize(bIncrease, StartTextPr.FontSize));
                    }
                }
            }
            if (undefined != this.TextPr.Value.FontSize) {
                this.TextPr.Set_FontSize(this.Internal_IncDecFontSize(bIncrease, this.TextPr.Value.FontSize));
            } else {
                this.TextPr.Set_FontSize(this.Internal_IncDecFontSize(bIncrease, StartTextPr.FontSize));
            }
            return true;
        }
        var Line = this.Content;
        var CurPos = this.CurPos.ContentPos;
        if (true === this.Selection.Use) {
            var StartPos = this.Selection.StartPos;
            var EndPos = this.Selection.EndPos;
            if (StartPos > EndPos) {
                var Temp = EndPos;
                EndPos = StartPos;
                StartPos = Temp;
            }
            var LastPos = this.Internal_GetEndPos();
            var bEnd = false;
            if (EndPos > LastPos) {
                EndPos = LastPos;
                bEnd = true;
            }
            var TextPr_end = this.Internal_GetTextPr(EndPos);
            var TextPr_start = this.Internal_GetTextPr(StartPos);
            if (undefined != TextPr_start.FontSize) {
                TextPr_start.FontSize = this.Internal_IncDecFontSize(bIncrease, TextPr_start.FontSize);
            } else {
                TextPr_start.FontSize = this.Internal_IncDecFontSize(bIncrease, StartTextPr.FontSize);
            }
            this.Internal_Content_Add(StartPos, new ParaTextPr(TextPr_start));
            if (false === bEnd) {
                this.Internal_Content_Add(EndPos + 1, new ParaTextPr(TextPr_end));
            } else {
                if (undefined != typeof(this.TextPr.Value.FontSize)) {
                    this.TextPr.Set_FontSize(this.Internal_IncDecFontSize(bIncrease, this.TextPr.Value.FontSize));
                } else {
                    this.TextPr.Set_FontSize(this.Internal_IncDecFontSize(bIncrease, StartTextPr.FontSize));
                }
            }
            for (var Pos = StartPos + 1; Pos < EndPos; Pos++) {
                Item = this.Content[Pos];
                if (para_TextPr === Item.Type) {
                    if (undefined != typeof(Item.Value.FontSize)) {
                        Item.Set_FontSize(this.Internal_IncDecFontSize(bIncrease, Item.Value.FontSize));
                    } else {
                        Item.Set_FontSize(this.Internal_IncDecFontSize(bIncrease, StartTextPr.FontSize));
                    }
                }
            }
            return true;
        }
        var oEnd = this.Internal_FindForward(CurPos, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_End, para_NewLine]);
        var oStart = this.Internal_FindBackward(CurPos - 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine]);
        var CurType = this.Content[CurPos].Type;
        if (!oEnd.Found) {
            return false;
        }
        if (para_End == oEnd.Type) {
            var Pos = oEnd.LetterPos;
            var TextPr_start = this.Internal_GetTextPr(Pos);
            if (undefined != TextPr_start.FontSize) {
                TextPr_start.FontSize = this.Internal_IncDecFontSize(bIncrease, TextPr_start.FontSize);
            } else {
                TextPr_start.FontSize = this.Internal_IncDecFontSize(bIncrease, StartTextPr.FontSize);
            }
            this.Internal_Content_Add(Pos, new ParaTextPr(TextPr_start));
            this.CurPos.ContentPos = Pos + 1;
            this.CurPos.Line = -1;
            if (undefined != typeof(this.TextPr.Value.FontSize)) {
                this.TextPr.Set_FontSize(this.Internal_IncDecFontSize(bIncrease, this.TextPr.Value.FontSize));
            } else {
                this.TextPr.Set_FontSize(this.Internal_IncDecFontSize(bIncrease, StartTextPr.FontSize));
            }
            return true;
        } else {
            if (para_PageNum === CurType || para_Drawing === CurType || para_Tab == CurType || para_Space == CurType || para_NewLine == CurType || !oStart.Found || para_NewLine == oEnd.Type || para_Space == oEnd.Type || para_NewLine == oStart.Type || para_Space == oStart.Type || para_Tab == oEnd.Type || para_Tab == oStart.Type || para_Drawing == oEnd.Type || para_Drawing == oStart.Type || para_PageNum == oEnd.Type || para_PageNum == oStart.Type) {
                var TextPr_old = this.Internal_GetTextPr(CurPos);
                var TextPr_new = TextPr_old.Copy();
                if (undefined != TextPr_new.FontSize) {
                    TextPr_new.FontSize = this.Internal_IncDecFontSize(bIncrease, TextPr_new.FontSize);
                } else {
                    TextPr_new.FontSize = this.Internal_IncDecFontSize(bIncrease, StartTextPr.FontSize);
                }
                this.Internal_Content_Add(CurPos, new ParaTextPr(TextPr_old));
                this.Internal_Content_Add(CurPos, new ParaEmpty(true));
                this.Internal_Content_Add(CurPos, new ParaTextPr(TextPr_new));
                this.CurPos.ContentPos = CurPos + 1;
                this.CurPos.Line = -1;
                this.RecalculateCurPos();
                return false;
            } else {
                var oWordStart = this.Internal_FindBackward(CurPos, [para_PageNum, para_Drawing, para_Tab, para_Space, para_NewLine]);
                if (!oWordStart.Found) {
                    oWordStart = this.Internal_FindForward(0, [para_Text]);
                } else {
                    oWordStart.LetterPos++;
                }
                var oWordEnd = this.Internal_FindForward(CurPos, [para_PageNum, para_Drawing, para_Tab, para_Space, para_End, para_NewLine]);
                if (!oWordStart.Found || !oWordEnd.Found) {
                    return;
                }
                var TextPr_end = this.Internal_GetTextPr(oWordEnd.LetterPos);
                var TextPr_start = this.Internal_GetTextPr(oWordStart.LetterPos);
                if (undefined != TextPr_start.FontSize) {
                    TextPr_start.FontSize = this.Internal_IncDecFontSize(bIncrease, TextPr_start.FontSize);
                } else {
                    TextPr_start.FontSize = this.Internal_IncDecFontSize(bIncrease, StartTextPr.FontSize);
                }
                this.Internal_Content_Add(oWordStart.LetterPos, new ParaTextPr(TextPr_start));
                this.Internal_Content_Add(oWordEnd.LetterPos + 1, new ParaTextPr(TextPr_end));
                this.CurPos.ContentPos = CurPos + 1;
                this.CurPos.Line = -1;
                for (var Pos = oWordStart.LetterPos + 1; Pos < oWordEnd.LetterPos; Pos++) {
                    Item = this.Content[Pos];
                    if (para_TextPr === Item.Type) {
                        if (undefined != Item.Value.FontSize) {
                            Item.Set_FontSize(this.Internal_IncDecFontSize(bIncrease, Item.Value.FontSize));
                        } else {
                            Item.Set_FontSize(this.Internal_IncDecFontSize(bIncrease, StartTextPr.FontSize));
                        }
                    }
                }
                return true;
            }
        }
    },
    IncDec_Indent: function (bIncrease) {
        var NumPr = this.Numbering_Get();
        if (undefined != NumPr) {
            if (true === bIncrease) {
                this.Numbering_Add(NumPr.NumId, Math.min(8, NumPr.Lvl + 1));
            } else {
                this.Numbering_Add(NumPr.NumId, Math.max(0, NumPr.Lvl - 1));
            }
        } else {
            var ParaPr = this.Get_CompiledPr2(false).ParaPr;
            var LeftMargin = ParaPr.Ind.Left;
            if (UnknownValue === LeftMargin) {
                LeftMargin = 0;
            } else {
                if (LeftMargin < 0) {
                    this.Set_Ind({
                        Left: 0
                    },
                    false);
                    return;
                }
            }
            var LeftMargin_new = 0;
            if (true === bIncrease) {
                if (LeftMargin >= 0) {
                    LeftMargin = 12.5 * parseInt(10 * LeftMargin / 125);
                    LeftMargin_new = ((LeftMargin - (10 * LeftMargin) % 125) / 12.5 + 1) * 12.5;
                }
                if (LeftMargin_new < 0) {
                    LeftMargin_new = 12.5;
                }
            } else {
                LeftMargin_new = Math.max(((LeftMargin - (10 * LeftMargin) % 125) / 12.5 - 1) * 12.5, 0);
            }
            this.Set_Ind({
                Left: LeftMargin_new
            },
            false);
        }
        var NewPresLvl = (true === bIncrease ? Math.min(8, this.PresentationPr.Level + 1) : Math.max(0, this.PresentationPr.Level - 1));
        this.Set_PresentationLevel(NewPresLvl);
    },
    Cursor_GetPos: function () {
        return {
            X: this.CurPos.RealX,
            Y: this.CurPos.RealY
        };
    },
    Cursor_MoveLeft: function (Count, AddToSelect, Word) {
        if (this.CurPos.ContentPos < 0) {
            return false;
        }
        if (0 == Count || !Count) {
            return;
        }
        var absCount = (Count < 0 ? -Count : Count);
        for (var Index = 0; Index < absCount; Index++) {
            if (false === this.Internal_MoveCursorBackward(AddToSelect, Word)) {
                return false;
            }
        }
        this.Internal_Recalculate_CurPos(this.CurPos.ContentPos, true, false, false);
        this.CurPos.RealX = this.CurPos.X;
        this.CurPos.RealY = this.CurPos.Y;
        return true;
    },
    Cursor_MoveRight: function (Count, AddToSelect, Word) {
        if (this.CurPos.ContentPos < 0) {
            return false;
        }
        if (0 == Count || !Count) {
            return;
        }
        var absCount = (Count < 0 ? -Count : Count);
        for (var Index = 0; Index < absCount; Index++) {
            if (false === this.Internal_MoveCursorForward(AddToSelect, Word)) {
                return false;
            }
        }
        this.Internal_Recalculate_CurPos(this.CurPos.ContentPos, true, false, false);
        this.CurPos.RealX = this.CurPos.X;
        this.CurPos.RealY = this.CurPos.Y;
        return true;
    },
    Cursor_MoveUp: function (Count, AddToSelect) {
        var CursorPos_max = this.Internal_GetEndPos();
        var CursorPos_min = this.Internal_GetStartPos();
        if (this.CurPos.ContentPos < 0) {
            return false;
        }
        if (!Count || 0 == Count) {
            return;
        }
        var absCount = (Count < 0 ? -Count : Count);
        var CurLine = this.Internal_Get_ParaPos_By_Pos(this.CurPos.ContentPos).Line;
        var Result = true;
        if (true === this.Selection.Use) {
            if (true === AddToSelect) {
                this.CurPos.ContentPos = this.Selection.EndPos;
                this.CurPos.Line = -1;
                CurLine = this.Internal_Get_ParaPos_By_Pos(this.CurPos.ContentPos).Line;
                this.RecalculateCurPos();
                this.CurPos.RealY = this.CurPos.Y;
                if (0 == CurLine) {
                    Result = false;
                    this.Selection.EndPos = this.Internal_GetStartPos();
                } else {
                    this.Cursor_MoveAt(this.CurPos.RealX, CurLine - 1, true, true);
                    this.CurPos.RealY = this.CurPos.Y;
                    this.Selection.EndPos = this.CurPos.ContentPos;
                }
                if (this.Selection.StartPos == this.Selection.EndPos) {
                    this.Selection_Remove();
                    this.Selection.Use = false;
                    this.CurPos.ContentPos = Math.max(CursorPos_min, Math.min(this.Selection.EndPos, CursorPos_max));
                    this.CurPos.Line = -1;
                    this.RecalculateCurPos();
                    return Result;
                }
            } else {
                var StartPos = this.Selection.StartPos;
                var EndPos = this.Selection.EndPos;
                if (StartPos > EndPos) {
                    var Temp = EndPos;
                    EndPos = StartPos;
                    StartPos = Temp;
                }
                this.CurPos.ContentPos = StartPos;
                this.CurPos.Line = -1;
                this.Selection_Remove();
                CurLine = this.Internal_Get_ParaPos_By_Pos(this.CurPos.ContentPos).Line;
                this.Internal_Recalculate_CurPos(this.CurPos.ContentPos, true, false, false);
                this.CurPos.RealX = this.CurPos.X;
                this.CurPos.RealY = this.CurPos.Y;
                if (0 == CurLine) {
                    Result = false;
                } else {
                    this.Cursor_MoveAt(this.CurPos.RealX, CurLine - 1, true, true);
                    this.CurPos.RealX = this.CurPos.X;
                    this.CurPos.RealY = this.CurPos.Y;
                }
            }
        } else {
            if (true === AddToSelect) {
                this.Selection.Use = true;
                this.Selection.StartPos = this.CurPos.ContentPos;
                CurLine = this.Internal_Get_ParaPos_By_Pos(this.CurPos.ContentPos).Line;
                this.RecalculateCurPos();
                this.CurPos.RealY = this.CurPos.Y;
                if (0 == CurLine) {
                    Result = false;
                    this.Selection.EndPos = this.Internal_GetStartPos();
                } else {
                    this.Cursor_MoveAt(this.CurPos.RealX, CurLine - 1, true, true);
                    this.CurPos.RealY = this.CurPos.Y;
                    this.Selection.EndPos = this.CurPos.ContentPos;
                }
                if (this.Selection.StartPos == this.Selection.EndPos) {
                    this.Selection_Remove();
                    this.Selection.Use = false;
                    this.CurPos.ContentPos = Math.max(CursorPos_min, Math.min(this.Selection.EndPos, CursorPos_max));
                    this.CurPos.Line = -1;
                    this.RecalculateCurPos();
                    return Result;
                }
            } else {
                if (0 == CurLine) {
                    return false;
                } else {
                    this.Cursor_MoveAt(this.CurPos.RealX, CurLine - 1, true, true);
                    this.CurPos.RealY = this.CurPos.Y;
                }
            }
        }
        return Result;
    },
    Cursor_MoveDown: function (Count, AddToSelect) {
        var CursorPos_max = this.Internal_GetEndPos();
        var CursorPos_min = this.Internal_GetStartPos();
        if (this.CurPos.ContentPos < 0) {
            return false;
        }
        if (!Count || 0 == Count) {
            return;
        }
        var absCount = (Count < 0 ? -Count : Count);
        var CurLine = this.Internal_Get_ParaPos_By_Pos(this.CurPos.ContentPos).Line;
        var Result = true;
        if (true === this.Selection.Use) {
            if (true === AddToSelect) {
                this.CurPos.ContentPos = this.Selection.EndPos;
                this.CurPos.Line = -1;
                CurLine = this.Internal_Get_ParaPos_By_Pos(this.CurPos.ContentPos).Line;
                this.RecalculateCurPos();
                this.CurPos.RealY = this.CurPos.Y;
                if (this.Lines.length - 1 == CurLine) {
                    Result = false;
                    this.Selection.EndPos = this.Content.length - 1;
                } else {
                    this.Cursor_MoveAt(this.CurPos.RealX, CurLine + 1, true, true);
                    this.CurPos.RealY = this.CurPos.Y;
                    this.Selection.EndPos = this.CurPos.ContentPos;
                }
                if (this.Selection.StartPos == this.Selection.EndPos) {
                    this.Selection_Remove();
                    this.Selection.Use = false;
                    this.CurPos.ContentPos = Math.max(CursorPos_min, Math.min(this.Selection.EndPos, CursorPos_max));
                    this.CurPos.Line = -1;
                    this.RecalculateCurPos();
                    return Result;
                }
            } else {
                var StartPos = this.Selection.StartPos;
                var EndPos = this.Selection.EndPos;
                if (StartPos > EndPos) {
                    var Temp = EndPos;
                    EndPos = StartPos;
                    StartPos = Temp;
                }
                this.CurPos.ContentPos = Math.max(CursorPos_min, Math.min(EndPos, CursorPos_max));
                this.CurPos.Line = -1;
                this.Selection_Remove();
                CurLine = this.Internal_Get_ParaPos_By_Pos(this.CurPos.ContentPos).Line;
                this.Internal_Recalculate_CurPos(this.CurPos.ContentPos, true, false, false);
                this.CurPos.RealX = this.CurPos.X;
                this.CurPos.RealY = this.CurPos.Y;
                if (this.Lines.length - 1 == CurLine) {
                    Result = false;
                } else {
                    this.Cursor_MoveAt(this.CurPos.RealX, CurLine + 1, true, true);
                    this.CurPos.RealX = this.CurPos.X;
                    this.CurPos.RealY = this.CurPos.Y;
                }
            }
        } else {
            if (AddToSelect) {
                this.Selection.Use = true;
                this.Selection.StartPos = this.CurPos.ContentPos;
                CurLine = this.Internal_Get_ParaPos_By_Pos(this.CurPos.ContentPos).Line;
                this.RecalculateCurPos();
                this.CurPos.RealY = this.CurPos.Y;
                if (this.Lines.length - 1 == CurLine) {
                    Result = false;
                    this.Selection.EndPos = this.Content.length - 1;
                } else {
                    this.Cursor_MoveAt(this.CurPos.RealX, CurLine + 1, true, true);
                    this.CurPos.RealY = this.CurPos.Y;
                    this.Selection.EndPos = this.CurPos.ContentPos;
                }
                if (this.Selection.StartPos == this.Selection.EndPos) {
                    this.Selection_Remove();
                    this.Selection.Use = false;
                    this.CurPos.ContentPos = Math.max(CursorPos_min, Math.min(this.Selection.EndPos, CursorPos_max));
                    this.CurPos.Line = -1;
                    this.RecalculateCurPos();
                    return Result;
                }
            } else {
                if (this.Lines.length - 1 == CurLine) {
                    return false;
                } else {
                    this.Cursor_MoveAt(this.CurPos.RealX, CurLine + 1, true, true);
                    this.CurPos.RealY = this.CurPos.Y;
                }
            }
        }
        return Result;
    },
    Cursor_MoveEndOfLine: function (AddToSelect) {
        var CursorPos_max = this.Internal_GetEndPos();
        var CursorPos_min = this.Internal_GetStartPos();
        if (this.CurPos.ContentPos < 0) {
            return false;
        }
        if (true === this.Selection.Use) {
            if (true === AddToSelect) {
                this.CurPos.ContentPos = this.Selection.EndPos;
            } else {
                this.CurPos.ContentPos = Math.max(CursorPos_min, Math.min(CursorPos_max, (this.Selection.EndPos >= this.Selection.StartPos ? this.Selection.EndPos : this.Selection.StartPos)));
                this.Selection_Remove();
            }
            this.CurPos.Line = -1;
        }
        var CurLine = this.Internal_Get_ParaPos_By_Pos(this.CurPos.ContentPos).Line;
        var LineEndPos = (CurLine >= this.Lines.length - 1 ? this.Internal_GetEndPos() : this.Lines[CurLine + 1].StartPos - 1);
        if (true === this.Selection.Use && true === AddToSelect) {
            this.Selection.EndPos = LineEndPos;
            if (this.Selection.StartPos == this.Selection.EndPos) {
                this.Selection_Remove();
                this.Selection.Use = false;
                this.CurPos.ContentPos = Math.max(CursorPos_min, Math.min(this.Selection.EndPos, CursorPos_max));
                this.CurPos.Line = -1;
                this.RecalculateCurPos();
                return;
            }
        } else {
            if (AddToSelect) {
                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Selection.Use = true;
                this.Selection.EndPos = LineEndPos;
                if (this.Selection.StartPos == this.Selection.EndPos) {
                    this.Selection_Remove();
                    this.Selection.Use = false;
                    this.CurPos.ContentPos = Math.max(CursorPos_min, Math.min(this.Selection.EndPos, CursorPos_max));
                    this.CurPos.Line = -1;
                    this.RecalculateCurPos();
                    return;
                }
            } else {
                this.CurPos.ContentPos = LineEndPos;
                this.CurPos.Line = -1;
                this.RecalculateCurPos();
                this.CurPos.RealX = this.CurPos.X;
                this.CurPos.RealY = this.CurPos.Y;
            }
        }
    },
    Cursor_MoveStartOfLine: function (AddToSelect) {
        var CursorPos_max = this.Internal_GetEndPos();
        var CursorPos_min = this.Internal_GetStartPos();
        if (this.CurPos.ContentPos < 0) {
            return false;
        }
        if (true === this.Selection.Use) {
            if (true === AddToSelect) {
                this.CurPos.ContentPos = this.Selection.EndPos;
            } else {
                this.CurPos.ContentPos = (this.Selection.StartPos <= this.Selection.EndPos ? this.Selection.StartPos : this.Selection.EndPos);
                this.Selection_Remove();
            }
            this.CurPos.Line = -1;
        }
        var CurLine = this.Internal_Get_ParaPos_By_Pos(this.CurPos.ContentPos).Line;
        var LineStartPos = this.Lines[CurLine].StartPos;
        if (true === this.Selection.Use && true === AddToSelect) {
            this.Selection.EndPos = LineStartPos;
            if (this.Selection.StartPos == this.Selection.EndPos) {
                this.Selection_Remove();
                this.Selection.Use = false;
                this.CurPos.ContentPos = Math.max(CursorPos_min, Math.min(this.Selection.EndPos, CursorPos_max));
                this.CurPos.Line = -1;
                this.RecalculateCurPos();
                return;
            }
        } else {
            if (AddToSelect) {
                this.Selection.EndPos = LineStartPos;
                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Selection.Use = true;
                if (this.Selection.StartPos == this.Selection.EndPos) {
                    this.Selection_Remove();
                    this.Selection.Use = false;
                    this.CurPos.ContentPos = Math.max(CursorPos_min, Math.min(this.Selection.EndPos, CursorPos_max));
                    this.CurPos.Line = -1;
                    this.RecalculateCurPos();
                    return;
                }
            } else {
                this.CurPos.ContentPos = LineStartPos;
                this.CurPos.Line = -1;
                this.RecalculateCurPos();
                this.CurPos.RealX = this.CurPos.X;
                this.CurPos.RealY = this.CurPos.Y;
            }
        }
    },
    Cursor_MoveToStartPos: function () {
        this.Selection.Use = false;
        this.CurPos.ContentPos = this.Internal_GetStartPos();
        this.CurPos.Line = -1;
    },
    Cursor_MoveToEndPos: function () {
        this.Selection.Use = false;
        this.CurPos.ContentPos = this.Internal_GetEndPos();
        this.CurPos.Line = -1;
    },
    Cursor_MoveUp_To_LastRow: function (X, Y, AddToSelect) {
        this.CurPos.RealX = X;
        this.CurPos.RealY = Y;
        this.Cursor_MoveAt(X, this.Lines.length - 1, true, true, this.PageNum);
        if (true === AddToSelect) {
            if (false === this.Selection.Use) {
                this.Selection.Use = true;
                this.Selection.StartPos = this.Content.length - 1;
            }
            this.Selection.EndPos = this.CurPos.ContentPos;
        }
    },
    Cursor_MoveDown_To_FirstRow: function (X, Y, AddToSelect) {
        this.CurPos.RealX = X;
        this.CurPos.RealY = Y;
        this.Cursor_MoveAt(X, 0, true, true, this.PageNum);
        if (true === AddToSelect) {
            if (false === this.Selection.Use) {
                this.Selection.Use = true;
                this.Selection.StartPos = this.Internal_GetStartPos();
            }
            this.Selection.EndPos = this.CurPos.ContentPos;
        }
    },
    Cursor_MoveTo_Drawing: function (Id) {
        var Pos = -1;
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            var Item = this.Content[Index];
            if (para_Drawing === Item.Type && Id === Item.Get_Id()) {
                Pos = Index;
            }
        }
        if (-1 === Pos) {
            return;
        }
        this.CurPos.ContentPos = Pos;
        this.CurPos.Line = -1;
        this.RecalculateCurPos();
        this.CurPos.RealX = this.CurPos.X;
        this.CurPos.RealY = this.CurPos.Y;
    },
    Get_CurPosXY: function () {
        return {
            X: this.CurPos.RealX,
            Y: this.CurPos.RealY
        };
    },
    Is_SelectionUse: function () {
        return this.Selection.Use;
    },
    Internal_GetStartPos: function () {
        var oPos = this.Internal_FindForward(0, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_End]);
        if (true === oPos.Found) {
            return oPos.LetterPos;
        }
        return 0;
    },
    Internal_GetEndPos: function () {
        var Res = this.Internal_FindBackward(this.Content.length - 1, [para_End]);
        if (true === Res.Found) {
            return Res.LetterPos;
        }
        return 0;
    },
    Internal_MoveCursorBackward: function (AddToSelect, Word) {
        var CursorPos_max = this.Internal_GetEndPos();
        var CursorPos_min = this.Internal_GetStartPos();
        if (true === this.Selection.Use) {
            if (true === AddToSelect) {
                this.CurPos.ContentPos = this.Selection.EndPos;
                this.CurPos.Line = -1;
            } else {
                var StartPos = this.Selection.StartPos;
                var EndPos = this.Selection.EndPos;
                if (StartPos > EndPos) {
                    var Temp = EndPos;
                    EndPos = StartPos;
                    StartPos = Temp;
                }
                this.Selection_Remove();
                this.CurPos.ContentPos = StartPos;
                this.CurPos.Line = -1;
                return;
            }
        }
        if (true === this.Selection.Use) {
            var oPos;
            if (true != Word) {
                oPos = this.Internal_FindBackward(this.CurPos.ContentPos - 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_End]);
            } else {
                oPos = this.Internal_FindWordStart(this.CurPos.ContentPos - 1, CursorPos_min);
            }
            if (oPos.Found) {
                this.Selection.EndPos = oPos.LetterPos;
                if (this.Selection.StartPos == this.Selection.EndPos) {
                    this.Selection_Remove();
                    this.Selection.Use = false;
                    this.CurPos.ContentPos = Math.max(CursorPos_min, Math.min(this.Selection.EndPos, CursorPos_max));
                    this.CurPos.Line = -1;
                    this.RecalculateCurPos();
                    return true;
                }
                return true;
            } else {
                return false;
            }
        } else {
            if (true == AddToSelect) {
                var oPos;
                if (true != Word) {
                    oPos = this.Internal_FindBackward(this.CurPos.ContentPos - 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_End]);
                } else {
                    oPos = this.Internal_FindWordStart(this.CurPos.ContentPos - 1, CursorPos_min);
                }
                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Selection.Use = true;
                if (oPos.Found) {
                    this.Selection.EndPos = oPos.LetterPos;
                    return true;
                } else {
                    this.Selection.Use = false;
                    return false;
                }
            } else {
                var oPos;
                if (true != Word) {
                    oPos = this.Internal_FindBackward(this.CurPos.ContentPos - 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine]);
                } else {
                    oPos = this.Internal_FindWordStart(this.CurPos.ContentPos - 1, CursorPos_min);
                }
                if (oPos.Found) {
                    this.CurPos.ContentPos = oPos.LetterPos;
                    this.CurPos.Line = -1;
                    return true;
                } else {
                    return false;
                }
            }
        }
    },
    Internal_FindWordStart: function (Pos, Pos_min) {
        var LetterPos = Pos;
        if (Pos < Pos_min || Pos >= this.Content.length) {
            return {
                Found: false
            };
        }
        while (true) {
            var Item = this.Content[LetterPos];
            var Type = Item.Type;
            var bSpace = false;
            if (para_TextPr === Type || para_Space === Type || para_HyperlinkStart === Type || para_HyperlinkEnd === Type || para_Tab === Type || para_Empty === Type || para_CommentStart === Type || para_CommentEnd === Type || para_CollaborativeChangesEnd === Type || para_CollaborativeChangesStart === Type || (para_Text === Type && true === Item.Is_NBSP())) {
                bSpace = true;
            }
            if (true === bSpace) {
                LetterPos--;
                if (LetterPos < 0) {
                    break;
                }
            } else {
                break;
            }
        }
        if (LetterPos <= Pos_min) {
            return {
                LetterPos: Pos_min,
                Found: true,
                Type: this.Content[Pos_min].Type
            };
        }
        if (para_Text != this.Content[LetterPos].Type) {
            return {
                LetterPos: LetterPos,
                Found: true,
                Type: this.Content[LetterPos].Type
            };
        } else {
            var bPunctuation = this.Content[LetterPos].Is_Punctuation();
            var TempPos = LetterPos;
            while (TempPos > Pos_min) {
                TempPos--;
                var Item = this.Content[TempPos];
                var TempType = Item.Type;
                if (! (true != Item.Is_RealContent() || para_TextPr === TempType || (para_Text === TempType && true != Item.Is_NBSP() && ((true === bPunctuation && true === Item.Is_Punctuation()) || (false === bPunctuation && false === Item.Is_Punctuation()))) || para_CommentStart === TempType || para_CommentEnd === TempType || para_HyperlinkEnd === TempType || para_HyperlinkEnd === TempType)) {
                    break;
                } else {
                    LetterPos = TempPos;
                }
            }
            return {
                LetterPos: LetterPos,
                Found: true,
                Type: this.Content[LetterPos].Type
            };
        }
        return {
            Found: false
        };
    },
    Internal_FindWordEnd: function (Pos, Pos_max) {
        var LetterPos = Pos;
        if (Pos > Pos_max || Pos >= this.Content.length) {
            return {
                Found: false
            };
        }
        var bFirst = true;
        var bFirstPunctuation = false;
        while (true) {
            var Item = this.Content[LetterPos];
            var Type = Item.Type;
            var bText = false;
            if (para_TextPr === Type || para_HyperlinkStart === Type || para_HyperlinkEnd === Type || para_Empty === Type || (para_Text === Type && true != Item.Is_NBSP() && (true === bFirst || (bFirstPunctuation === Item.Is_Punctuation()))) || para_CommentStart === Type || para_CommentEnd === Type || para_CollaborativeChangesEnd === Type || para_CollaborativeChangesStart === Type) {
                bText = true;
            }
            if (true === bText) {
                if (true === bFirst && para_Text === Type) {
                    bFirst = false;
                    bFirstPunctuation = Item.Is_Punctuation();
                }
                LetterPos++;
                if (LetterPos > Pos_max || LetterPos >= this.Content.length) {
                    break;
                }
            } else {
                break;
            }
        }
        if (true === bFirst) {
            LetterPos++;
        }
        if (LetterPos > Pos_max) {
            return {
                Found: false
            };
        }
        if (! (para_Space === this.Content[LetterPos].Type || (para_Text === this.Content[LetterPos].Type && true === this.Content[LetterPos].Is_NBSP()))) {
            return {
                LetterPos: LetterPos,
                Found: true,
                Type: this.Content[LetterPos].Type
            };
        } else {
            var TempPos = LetterPos;
            while (TempPos < Pos_max) {
                TempPos++;
                var Item = this.Content[TempPos];
                var TempType = Item.Type;
                if (! (true != Item.Is_RealContent() || para_TextPr === TempType || para_Space === this.Content[LetterPos].Type || (para_Text === this.Content[LetterPos].Type && true === this.Content[LetterPos].Is_NBSP()) || para_CommentStart === TempType || para_CommentEnd === TempType || para_HyperlinkEnd === TempType || para_HyperlinkEnd === TempType)) {
                    break;
                } else {
                    LetterPos = TempPos;
                }
            }
            return {
                LetterPos: LetterPos,
                Found: true,
                Type: this.Content[LetterPos].Type
            };
        }
        return {
            Found: false
        };
    },
    Internal_MoveCursorForward: function (AddToSelect, Word) {
        var CursorPos_max = this.Internal_GetEndPos();
        var CursorPos_min = this.Internal_GetStartPos();
        if (true === this.Selection.Use) {
            if (true === AddToSelect) {
                this.CurPos.ContentPos = this.Selection.EndPos;
                this.CurPos.Line = -1;
            } else {
                var StartPos = this.Selection.StartPos;
                var EndPos = this.Selection.EndPos;
                if (StartPos > EndPos) {
                    var Temp = EndPos;
                    EndPos = StartPos;
                    StartPos = Temp;
                }
                this.Selection_Remove();
                this.CurPos.ContentPos = Math.max(CursorPos_min, Math.min(EndPos, CursorPos_max));
                this.CurPos.Line = -1;
                return true;
            }
        }
        if (true == this.Selection.Use && true == AddToSelect) {
            var oPos;
            if (true != Word) {
                oPos = this.Internal_FindForward(this.CurPos.ContentPos + 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_End, para_Empty]);
            } else {
                oPos = this.Internal_FindWordEnd(this.CurPos.ContentPos, CursorPos_max + 1);
            }
            if (oPos.Found) {
                this.Selection.EndPos = oPos.LetterPos;
                if (this.Selection.StartPos == this.Selection.EndPos) {
                    this.Selection_Remove();
                    this.Selection.Use = false;
                    this.CurPos.ContentPos = Math.max(CursorPos_min, Math.min(this.Selection.EndPos, CursorPos_max));
                    this.CurPos.Line = -1;
                    this.RecalculateCurPos();
                    return;
                }
                return true;
            } else {
                return false;
            }
        } else {
            if (true == AddToSelect) {
                var oPos;
                if (true != Word) {
                    oPos = this.Internal_FindForward(this.CurPos.ContentPos + 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_End, para_Empty]);
                } else {
                    oPos = this.Internal_FindWordEnd(this.CurPos.ContentPos, CursorPos_max + 1);
                }
                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Selection.Use = true;
                if (oPos.Found) {
                    this.Selection.EndPos = oPos.LetterPos;
                    return true;
                } else {
                    this.Selection.Use = false;
                    return false;
                }
            } else {
                var oPos;
                if (true != Word) {
                    oPos = this.Internal_FindForward(this.CurPos.ContentPos + 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_End]);
                } else {
                    oPos = this.Internal_FindWordEnd(this.CurPos.ContentPos, CursorPos_max);
                }
                if (oPos.Found) {
                    this.CurPos.ContentPos = oPos.LetterPos;
                    this.CurPos.Line = -1;
                    return true;
                } else {
                    return false;
                }
            }
        }
    },
    Internal_Clear_EmptyTextPr: function () {
        var Count = this.Content.length;
        for (var Pos = 0; Pos < Count - 1; Pos++) {
            if (para_TextPr === this.Content[Pos].Type && para_TextPr === this.Content[Pos + 1].Type) {
                this.Internal_Content_Remove(Pos);
                Pos--;
                Count--;
            }
        }
    },
    Internal_AddTextPr: function (TextPr) {
        this.Internal_Clear_EmptyTextPr();
        var theme = this.Parent.getTheme();
        var color_map = this.Parent.getColorMap();
        if (isRealObject(TextPr.unifill) && isRealObject(TextPr.unifill.fill)) {
            TextPr.unifill.calculate(theme, color_map, {
                R: 0,
                G: 0,
                B: 0,
                A: 255
            });
            if (isRealObject(TextPr.unifill.fill.color)) {
                var color = TextPr.unifill.fill.color.RGBA;
                TextPr.Color = new CDocumentColor(color.R, color.G, color.B);
            } else {
                if (Array.isArray(TextPr.unifill.fill.colors) && isRealObject(TextPr.unifill.fill.colors[0])) {
                    var color = TextPr.unifill.fill.colors[0].RGBA;
                    TextPr.Color = new CDocumentColor(color.R, color.G, color.B);
                }
            }
        }
        if (typeof TextPr.themeFont === "string") {
            var font_name = getFontInfo(TextPr.themeFont)(theme.themeElements.fontScheme);
            TextPr.FontFamily = {
                Name: font_name,
                Index: -1
            };
        }
        if (undefined != TextPr.FontFamily) {
            var FName = TextPr.FontFamily.Name;
            var FIndex = TextPr.FontFamily.Index;
            TextPr.RFonts = new CRFonts();
            TextPr.RFonts.Ascii = {
                Name: FName,
                Index: FIndex
            };
            TextPr.RFonts.EastAsia = {
                Name: FName,
                Index: FIndex
            };
            TextPr.RFonts.HAnsi = {
                Name: FName,
                Index: FIndex
            };
            TextPr.RFonts.CS = {
                Name: FName,
                Index: FIndex
            };
        }
        if (true === this.ApplyToAll) {
            this.Internal_Content_Add(0, new ParaTextPr(TextPr));
            for (var Pos = 0; Pos < this.Content.length; Pos++) {
                if (this.Content[Pos].Type == para_TextPr) {
                    this.Content[Pos].Apply_TextPr(TextPr);
                }
            }
            this.TextPr.Apply_TextPr(TextPr);
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Paragraph_Recalculate_Text_Pr, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), null));
            return;
        }
        var Line = this.Content;
        var CurPos = this.CurPos.ContentPos;
        if (true === this.Selection.Use) {
            var StartPos = this.Selection.StartPos;
            var EndPos = this.Selection.EndPos;
            if (StartPos > EndPos) {
                var Temp = EndPos;
                EndPos = StartPos;
                StartPos = Temp;
            }
            var LastPos = this.Internal_GetEndPos();
            var bEnd = false;
            if (EndPos > LastPos) {
                EndPos = LastPos;
                bEnd = true;
            }
            var TextPr_end = this.Internal_GetTextPr(EndPos);
            var TextPr_start = this.Internal_GetTextPr(StartPos);
            TextPr_start.Merge(TextPr);
            this.Internal_Content_Add(StartPos, new ParaTextPr(TextPr_start));
            if (false === bEnd) {
                this.Internal_Content_Add(EndPos + 1, new ParaTextPr(TextPr_end));
            } else {
                this.TextPr.Apply_TextPr(TextPr);
            }
            for (var Pos = StartPos + 1; Pos < EndPos; Pos++) {
                if (this.Content[Pos].Type == para_TextPr) {
                    this.Content[Pos].Apply_TextPr(TextPr);
                }
            }
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Paragraph_Recalculate_Text_Pr, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), null));
            return;
        }
        var oEnd = this.Internal_FindForward(CurPos, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_End, para_NewLine]);
        var oStart = this.Internal_FindBackward(CurPos - 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine]);
        var CurType = this.Content[CurPos].Type;
        if (!oEnd.Found) {
            return;
        }
        if (para_End == oEnd.Type) {
            var Pos = oEnd.LetterPos;
            var TextPr_start = this.Internal_GetTextPr(Pos);
            TextPr_start.Merge(TextPr);
            this.Internal_Content_Add(Pos, new ParaTextPr(TextPr_start));
            this.CurPos.ContentPos = Pos + 1;
            this.CurPos.Line = -1;
            this.TextPr.Apply_TextPr(TextPr);
        } else {
            if (para_PageNum === CurType || para_Drawing === CurType || para_Tab == CurType || para_Space == CurType || para_NewLine == CurType || !oStart.Found || para_NewLine == oEnd.Type || para_Space == oEnd.Type || para_NewLine == oStart.Type || para_Space == oStart.Type || para_Tab == oEnd.Type || para_Tab == oStart.Type || para_Drawing == oEnd.Type || para_Drawing == oStart.Type || para_PageNum == oEnd.Type || para_PageNum == oStart.Type) {
                var TextPr_old = this.Internal_GetTextPr(CurPos);
                var TextPr_new = TextPr_old.Copy();
                TextPr_new.Merge(TextPr);
                this.Internal_Content_Add(CurPos, new ParaTextPr(TextPr_old));
                this.Internal_Content_Add(CurPos, new ParaTextPr(TextPr_new));
                this.CurPos.ContentPos = CurPos + 1;
                this.CurPos.Line = -1;
                this.RecalculateCurPos();
            } else {
                var oWordStart = this.Internal_FindBackward(CurPos, [para_PageNum, para_Drawing, para_Tab, para_Space, para_NewLine]);
                if (!oWordStart.Found) {
                    oWordStart = this.Internal_FindForward(0, [para_Text]);
                } else {
                    oWordStart.LetterPos++;
                }
                var oWordEnd = this.Internal_FindForward(CurPos, [para_PageNum, para_Drawing, para_Tab, para_Space, para_End, para_NewLine]);
                if (!oWordStart.Found || !oWordEnd.Found) {
                    return;
                }
                var TextPr_end = this.Internal_GetTextPr(oWordEnd.LetterPos);
                var TextPr_start = this.Internal_GetTextPr(oWordStart.LetterPos);
                TextPr_start.Merge(TextPr);
                this.Internal_Content_Add(oWordStart.LetterPos, new ParaTextPr(TextPr_start));
                this.Internal_Content_Add(oWordEnd.LetterPos + 1, new ParaTextPr(TextPr_end));
                this.CurPos.ContentPos = CurPos + 1;
                this.CurPos.Line = -1;
                for (var Pos = oWordStart.LetterPos + 1; Pos < oWordEnd.LetterPos; Pos++) {
                    if (this.Content[Pos].Type == para_TextPr) {
                        this.Content[Pos].Apply_TextPr(TextPr);
                    }
                }
            }
        }
        History.Add(g_oUndoRedoGraphicObjects, historyitem_Paragraph_Recalculate_Text_Pr, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), null));
    },
    Internal_AddHyperlink: function (Hyperlink_start) {
        var Hyperlink_end = new ParaHyperlinkEnd();
        var TextPrObj = {
            Color: {
                r: 0,
                g: 0,
                b: 255
            },
            Underline: true
        };
        var TextPr = new CTextPr();
        TextPr.Set_FromObject(TextPrObj);
        if (true === this.ApplyToAll) {
            return;
        }
        var CurPos = this.CurPos.ContentPos;
        if (true === this.Selection.Use) {
            var StartPos = this.Selection.StartPos;
            var EndPos = this.Selection.EndPos;
            if (StartPos > EndPos) {
                var Temp = EndPos;
                EndPos = StartPos;
                StartPos = Temp;
            }
            var LastPos = this.Internal_GetEndPos();
            if (EndPos > LastPos) {
                EndPos = LastPos;
            }
            var TextPr_end = this.Internal_GetTextPr(EndPos);
            var TextPr_start = this.Internal_GetTextPr(StartPos);
            TextPr_start.Merge(TextPr);
            this.Internal_Content_Add(EndPos, new ParaTextPr(TextPr_end));
            this.Internal_Content_Add(EndPos, Hyperlink_end);
            this.Internal_Content_Add(StartPos, new ParaTextPr(TextPr_start));
            this.Internal_Content_Add(StartPos, Hyperlink_start);
            for (var Pos = StartPos + 2; Pos < EndPos + 1; Pos++) {
                if (this.Content[Pos].Type == para_TextPr) {
                    this.Content[Pos].Apply_TextPr(TextPr);
                }
            }
            return;
        }
        return;
        var oEnd = this.Internal_FindForward(CurPos, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_End, para_NewLine]);
        var oStart = this.Internal_FindBackward(CurPos - 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine]);
        var CurType = this.Content[CurPos].Type;
        if (!oEnd.Found) {
            return;
        }
        if (para_End == oEnd.Type) {
            var Pos = oEnd.LetterPos;
            var TextPr_start = this.Internal_GetTextPr(Pos);
            TextPr_start.Merge(TextPr);
            this.Internal_Content_Add(Pos, new ParaTextPr(TextPr_start));
            this.CurPos.ContentPos = Pos + 1;
            this.CurPos.Line = -1;
        } else {
            if (para_PageNum === CurType || para_Drawing === CurType || para_Tab == CurType || para_Space == CurType || para_NewLine == CurType || !oStart.Found || para_NewLine == oEnd.Type || para_Space == oEnd.Type || para_NewLine == oStart.Type || para_Space == oStart.Type || para_Tab == oEnd.Type || para_Tab == oStart.Type || para_Drawing == oEnd.Type || para_Drawing == oStart.Type || para_PageNum == oEnd.Type || para_PageNum == oStart.Type) {
                var TextPr_old = this.Internal_GetTextPr(CurPos);
                var TextPr_new = TextPr_old.Copy();
                TextPr_new.Merge(TextPr);
                this.Internal_Content_Add(CurPos, new ParaTextPr(TextPr_old));
                this.Internal_Content_Add(CurPos, new ParaTextPr(TextPr_new));
                this.CurPos.ContentPos = CurPos + 1;
                this.CurPos.Line = -1;
                this.RecalculateCurPos();
            } else {
                var oWordStart = this.Internal_FindBackward(CurPos, [para_PageNum, para_Drawing, para_Tab, para_Space, para_NewLine]);
                if (!oWordStart.Found) {
                    oWordStart = this.Internal_FindForward(0, [para_Text]);
                } else {
                    oWordStart.LetterPos++;
                }
                var oWordEnd = this.Internal_FindForward(CurPos, [para_PageNum, para_Drawing, para_Tab, para_Space, para_End, para_NewLine]);
                if (!oWordStart.Found || !oWordEnd.Found) {
                    return;
                }
                var TextPr_end = this.Internal_GetTextPr(oWordEnd.LetterPos);
                var TextPr_start = this.Internal_GetTextPr(oWordStart.LetterPos);
                TextPr_start.Merge(TextPr);
                this.Internal_Content_Add(oWordStart.LetterPos, new ParaTextPr(TextPr_start));
                this.Internal_Content_Add(oWordEnd.LetterPos + 1, new ParaTextPr(TextPr_end));
                this.CurPos.ContentPos = CurPos + 1;
                this.CurPos.Line = -1;
                for (var Pos = oWordStart.LetterPos + 1; Pos < oWordEnd.LetterPos; Pos++) {
                    if (this.Content[Pos].Type == para_TextPr) {
                        this.Content[Pos].Apply_TextPr(TextPr);
                    }
                }
            }
        }
    },
    Internal_GetContentPosByXY: function (X, Y, bLine, PageNum, bCheckNumbering) {
        if (this.Lines.length <= 0) {
            return {
                Pos: 0,
                End: false,
                InText: false
            };
        }
        var PNum = 0;
        if ("number" == typeof(PageNum)) {
            PNum = PageNum - this.PageNum;
        } else {
            PNum = 0;
        }
        if (PNum >= this.Pages.length) {
            PNum = this.Pages.length - 1;
            bLine = true;
            Y = this.Lines.length - 1;
        } else {
            if (PNum < 0) {
                PNum = 0;
                bLine = true;
                Y = 0;
            }
        }
        var bFindY = false;
        var CurLine = this.Pages[PNum].FirstLine;
        var CurLineY = this.Pages[PNum].Y + this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
        var LastLine = (PNum >= this.Pages.length - 1 ? this.Lines.length - 1 : this.Pages[PNum + 1].FirstLine - 1);
        if (true === bLine) {
            CurLine = Y;
        } else {
            while (!bFindY) {
                if (Y < CurLineY) {
                    break;
                }
                if (CurLine >= LastLine) {
                    break;
                }
                CurLine++;
                CurLineY = this.Lines[CurLine].Y + this.Pages[PNum].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
            }
        }
        var CurRange = 0;
        var CurX = this.Lines[CurLine].Ranges[CurRange].XVisible;
        var DiffX = 1000000;
        var NumberingDiffX = 1000000;
        var DiffPos = -1;
        var bEnd = false;
        var bInText = false;
        var Result = {
            Pos: 0,
            End: false
        };
        var StartPos = this.Lines[CurLine].StartPos;
        for (var ItemNum = StartPos; ItemNum < this.Content.length; ItemNum++) {
            var Item = this.Content[ItemNum];
            if (undefined != Item.CurLine) {
                if (CurLine != Item.CurLine) {
                    break;
                }
                if (CurRange != Item.CurRange) {
                    CurRange = Item.CurRange;
                    CurX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                }
            }
            var TempDx = 0;
            var bCheck = false;
            var bNumbering = false;
            switch (Item.Type) {
            case para_Drawing:
                if (Item.DrawingType != drawing_Inline) {
                    bCheck = false;
                    TempDx = 0;
                } else {
                    TempDx = Item.WidthVisible;
                    bCheck = true;
                }
                break;
            case para_Numbering:
                var NumPr = this.Numbering_Get();
                if (undefined === NumPr || undefined === NumPr.NumId || 0 === NumPr.NumId) {
                    break;
                }
                TempDx = Item.WidthVisible;
                bCheck = true;
                bNumbering = true;
                break;
            case para_PresentationNumbering:
                TempDx = Item.WidthVisible;
                bCheck = false;
                break;
            case para_PageNum:
                case para_Text:
                TempDx = Item.WidthVisible;
                bCheck = true;
                break;
            case para_Space:
                TempDx = Item.WidthVisible;
                bCheck = true;
                break;
            case para_Tab:
                TempDx = Item.WidthVisible;
                bCheck = true;
                break;
            case para_NewLine:
                bCheck = true;
                TempDx = Item.WidthVisible;
                break;
            case para_End:
                bEnd = true;
                bCheck = true;
                TempDx = Item.WidthVisible;
                break;
            }
            if (bCheck) {
                if (false === bNumbering && Math.abs(X - CurX) < DiffX) {
                    DiffX = Math.abs(X - CurX);
                    DiffPos = ItemNum;
                }
                if (false === bNumbering && true != bEnd && ItemNum === this.Lines[CurLine].EndPos && X > CurX + TempDx) {
                    DiffPos = ItemNum + 1;
                }
                if (true === bNumbering) {
                    var NumPr = this.Numbering_Get();
                    var NumJc = this.Parent.Get_Numbering().Get_AbstractNum(NumPr.NumId).Lvl[NumPr.Lvl].Jc;
                    var NumX0 = CurX;
                    var NumX1 = CurX;
                    switch (NumJc) {
                    case align_Right:
                        NumX0 -= Item.WidthNum;
                        break;
                    case align_Center:
                        NumX0 -= Item.WidthNum / 2;
                        NumX1 += Item.WidthNum / 2;
                        break;
                    case align_Left:
                        default:
                        NumX1 += Item.WidthNum;
                        break;
                    }
                    if (X >= NumX0 && X <= NumX1) {
                        NumberingDiffX = 0;
                    }
                }
                if (bEnd) {
                    CurX += TempDx;
                    if (Math.abs(X - CurX) < DiffX) {
                        Result.End = true;
                    }
                    break;
                }
            }
            if (X >= CurX - 0.001 && X <= CurX + TempDx + 0.001) {
                bInText = true;
            }
            CurX += TempDx;
        }
        if (true === bInText && Y >= this.Pages[PNum].Y + this.Lines[CurLine].Y - this.Lines[CurLine].Metrics.Ascent - 0.01 && Y <= this.Pages[PNum].Y + this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap + 0.01) {
            Result.InText = true;
        } else {
            Result.InText = false;
        }
        if (NumberingDiffX <= DiffX) {
            Result.Numbering = true;
        } else {
            Result.Numbering = false;
        }
        Result.Pos = DiffPos;
        Result.Line = CurLine;
        return Result;
    },
    Internal_GetXYByContentPos: function (Pos) {
        return this.Internal_Recalculate_CurPos(Pos, false, false, false);
    },
    Internal_Selection_CheckHyperlink: function () {
        var Direction = 1;
        var StartPos = this.Selection.StartPos;
        var EndPos = this.Selection.EndPos;
        if (StartPos > EndPos) {
            StartPos = this.Selection.EndPos;
            EndPos = this.Selection.StartPos;
            Direction = -1;
        }
        var Hyperlink_start = this.Check_Hyperlink2(StartPos);
        var Hyperlink_end = this.Check_Hyperlink2(EndPos);
        if (null != Hyperlink_start && Hyperlink_end != Hyperlink_start) {
            StartPos = this.Internal_FindBackward(StartPos, [para_HyperlinkStart]).LetterPos;
        }
        if (null != Hyperlink_end && Hyperlink_end != Hyperlink_start) {
            EndPos = this.Internal_FindForward(EndPos, [para_HyperlinkEnd]).LetterPos + 1;
        }
        if (Direction > 0) {
            this.Selection.StartPos = StartPos;
            this.Selection.EndPos = EndPos;
        } else {
            this.Selection.StartPos = EndPos;
            this.Selection.EndPos = StartPos;
        }
    },
    Check_Hyperlink: function (X, Y, PageNum) {
        var Result = this.Internal_GetContentPosByXY(X, Y, false, PageNum, false);
        if (-1 != Result.Pos && true === Result.InText) {
            var Find = this.Internal_FindBackward(Result.Pos, [para_HyperlinkStart, para_HyperlinkEnd]);
            if (true === Find.Found && para_HyperlinkStart === Find.Type) {
                return this.Content[Find.LetterPos];
            }
        }
        return null;
    },
    Check_Hyperlink2: function (Pos, bCheckEnd) {
        if ("undefined" === typeof(bCheckEnd)) {
            bCheckEnd = true;
        }
        if (true === bCheckEnd && Pos > 0) {
            while (this.Content[Pos - 1].Type === para_TextPr || this.Content[Pos - 1].Type === para_HyperlinkEnd || this.Content[Pos - 1].Type === para_CollaborativeChangesStart || this.Content[Pos - 1].Type === para_CollaborativeChangesEnd) {
                Pos--;
                if (Pos <= 0) {
                    return null;
                }
            }
        }
        var Find = this.Internal_FindBackward(Pos - 1, [para_HyperlinkStart, para_HyperlinkEnd]);
        if (true === Find.Found && para_HyperlinkStart === Find.Type) {
            return this.Content[Find.LetterPos];
        }
        return null;
    },
    Hyperlink_Add: function (HyperProps) {
        var Hyperlink = new ParaHyperlinkStart();
        Hyperlink.Set_Value(HyperProps.Value);
        if ("undefined" != typeof(HyperProps.ToolTip) && null != HyperProps.ToolTip) {
            Hyperlink.Set_ToolTip(HyperProps.ToolTip);
        }
        if (true === this.Selection.Use) {
            this.Add(Hyperlink);
        } else {
            if (null != HyperProps.Text && "" != HyperProps.Text) {
                var TextPr_hyper = this.Internal_GetTextPr(this.CurPos.ContentPos);
                TextPr_hyper.Color = new CDocumentColor(0, 0, 255);
                TextPr_hyper.Underline = true;
                var TextPr_old = this.Internal_GetTextPr(this.CurPos.ContentPos);
                var Pos = this.CurPos.ContentPos;
                this.Internal_Content_Add(Pos, new ParaTextPr(TextPr_old));
                this.Internal_Content_Add(Pos, new ParaHyperlinkEnd());
                this.Internal_Content_Add(Pos, new ParaTextPr(TextPr_hyper));
                this.Internal_Content_Add(Pos, Hyperlink);
                for (var NewPos = 0; NewPos < HyperProps.Text.length; NewPos++) {
                    var Char = HyperProps.Text.charAt(NewPos);
                    if (" " == Char) {
                        this.Internal_Content_Add(Pos + 2 + NewPos, new ParaSpace());
                    } else {
                        this.Internal_Content_Add(Pos + 2 + NewPos, new ParaText(Char));
                    }
                }
                this.CurPos.ContentPos = Pos + 2;
                this.CurPos.Line = -1;
            }
        }
    },
    Hyperlink_Modify: function (HyperProps) {
        var Hyperlink = null;
        var Pos = -1;
        if (true === this.Selection.Use) {
            var Hyper_start = this.Check_Hyperlink2(this.Selection.StartPos);
            var Hyper_end = this.Check_Hyperlink2(this.Selection.EndPos);
            if (null != Hyper_start && Hyper_start === Hyper_end) {
                Hyperlink = Hyper_start;
                Pos = this.Selection.StartPos;
            }
        } else {
            Hyperlink = this.Check_Hyperlink2(this.CurPos.ContentPos);
            Pos = this.CurPos.ContentPos;
        }
        if (null != Hyperlink) {
            if ("undefined" != typeof(HyperProps.Value) && null != HyperProps.Value) {
                Hyperlink.Set_Value(HyperProps.Value);
            }
            if ("undefined" != typeof(HyperProps.ToolTip) && null != HyperProps.ToolTip) {
                Hyperlink.Set_ToolTip(HyperProps.ToolTip);
            }
            if (null != HyperProps.Text) {
                var Find = this.Internal_FindBackward(Pos, [para_HyperlinkStart, para_HyperlinkEnd]);
                if (true != Find.Found || para_HyperlinkStart != Find.Type) {
                    return false;
                }
                var Start = Find.LetterPos;
                var Find = this.Internal_FindForward(Pos, [para_HyperlinkStart, para_HyperlinkEnd]);
                if (true != Find.Found || para_HyperlinkEnd != Find.Type) {
                    return false;
                }
                var End = Find.LetterPos;
                var TextPr = this.Internal_GetTextPr(End);
                TextPr.Color = new CDocumentColor(0, 0, 255);
                TextPr.Underline = true;
                this.Internal_Content_Remove2(Start + 1, End - Start - 1);
                this.Internal_Content_Add(Start + 1, new ParaTextPr(TextPr));
                for (var NewPos = 0; NewPos < HyperProps.Text.length; NewPos++) {
                    var Char = HyperProps.Text.charAt(NewPos);
                    if (" " == Char) {
                        this.Internal_Content_Add(Start + 2 + NewPos, new ParaSpace());
                    } else {
                        this.Internal_Content_Add(Start + 2 + NewPos, new ParaText(Char));
                    }
                }
                if (true === this.Selection.Use) {
                    this.Selection.StartPos = Start + 1;
                    this.Selection.EndPos = Start + 2 + HyperProps.Text.length;
                    this.CurPos.ContentPos = this.Selection.EndPos;
                } else {
                    this.CurPos.ContentPos = Start + 2;
                }
                return true;
            }
            return false;
        }
        return false;
    },
    Hyperlink_Remove: function () {
        var Pos = -1;
        if (true === this.Selection.Use) {
            var Hyper_start = this.Check_Hyperlink2(this.Selection.StartPos);
            var Hyper_end = this.Check_Hyperlink2(this.Selection.EndPos);
            if (null != Hyper_start && Hyper_start === Hyper_end) {
                Pos = (this.Selection.StartPos <= this.Selection.EndPos ? this.Selection.StartPos : this.Selection.EndPos);
            }
        } else {
            var Hyper_cur = this.Check_Hyperlink2(this.CurPos.ContentPos);
            if (null != Hyper_cur) {
                Pos = this.CurPos.ContentPos;
            }
        }
        if (-1 != Pos) {
            var Find = this.Internal_FindForward(Pos, [para_HyperlinkStart, para_HyperlinkEnd]);
            if (true === Find.Found && para_HyperlinkEnd === Find.Type) {
                this.Internal_Content_Remove(Find.LetterPos);
            }
            var EndPos = Find.LetterPos - 2;
            Find = this.Internal_FindBackward(Pos, [para_HyperlinkStart, para_HyperlinkEnd]);
            if (true === Find.Found && para_HyperlinkStart === Find.Type) {
                this.Internal_Content_Remove(Find.LetterPos);
            }
            var StartPos = Find.LetterPos;
            for (var Index = StartPos; Index <= EndPos; Index++) {
                var Item = this.Content[Index];
                if (para_TextPr === Item.Type) {
                    Item.Set_Color(undefined);
                    Item.Set_Underline(undefined);
                }
            }
            this.ReDraw();
            return true;
        }
        return false;
    },
    Hyperlink_CanAdd: function (bCheckInHyperlink) {
        if (true === bCheckInHyperlink) {
            if (true === this.Selection.Use) {
                var StartPos = this.Selection.StartPos;
                var EndPos = this.Selection.EndPos;
                if (EndPos < StartPos) {
                    StartPos = this.Selection.EndPos;
                    EndPos = this.Selection.StartPos;
                }
                var Find = this.Internal_FindBackward(StartPos, [para_HyperlinkStart, para_HyperlinkEnd]);
                if (true === Find.Found && para_HyperlinkStart === Find.Type) {
                    return false;
                }
                for (var Pos = StartPos; Pos < EndPos; Pos++) {
                    var Item = this.Content[Pos];
                    switch (Item.Type) {
                    case para_HyperlinkStart:
                        case para_HyperlinkEnd:
                        case para_End:
                        return false;
                    }
                }
                return true;
            } else {
                var Hyper_cur = this.Check_Hyperlink2(this.CurPos.ContentPos);
                if (null != Hyper_cur) {
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            if (true === this.Selection.Use) {
                var StartPos = this.Selection.StartPos;
                var EndPos = this.Selection.EndPos;
                if (EndPos < StartPos) {
                    StartPos = this.Selection.EndPos;
                    EndPos = this.Selection.StartPos;
                }
                var bHyper = false;
                for (var Pos = StartPos; Pos < EndPos; Pos++) {
                    var Item = this.Content[Pos];
                    switch (Item.Type) {
                    case para_HyperlinkStart:
                        if (true === bHyper) {
                            return false;
                        }
                        bHyper = true;
                        break;
                    case para_HyperlinkEnd:
                        bHyper = true;
                        break;
                    case para_End:
                        return false;
                    }
                }
                return true;
            } else {
                return true;
            }
        }
    },
    Hyperlink_Check: function (bCheckEnd) {
        if (true === this.Selection.Use) {
            var Hyper_start = this.Check_Hyperlink2(this.Selection.StartPos);
            var Hyper_end = this.Check_Hyperlink2(this.Selection.EndPos);
            if (Hyper_start === Hyper_end && null != Hyper_start) {
                return Hyper_start;
            }
        } else {
            var Hyper_cur = this.Check_Hyperlink2(this.CurPos.ContentPos, bCheckEnd);
            if (null != Hyper_cur) {
                return Hyper_cur;
            }
        }
        return null;
    },
    Cursor_MoveAt: function (X, Y, bLine, bDontChangeRealPos, PageNum) {
        var Pos = this.Internal_GetContentPosByXY(X, Y, bLine, PageNum).Pos;
        if (-1 != Pos) {
            this.CurPos.ContentPos = Pos;
            this.CurPos.Line = -1;
        }
        this.Internal_Recalculate_CurPos(Pos, false, false, false);
        if (bDontChangeRealPos != true) {
            this.CurPos.RealX = this.CurPos.X;
            this.CurPos.RealY = this.CurPos.Y;
        }
        if (true != bLine) {
            this.CurPos.RealX = X;
            this.CurPos.RealY = Y;
        }
    },
    Selection_SetStart: function (X, Y, PageNum, bTableBorder) {
        var Pos = this.Internal_GetContentPosByXY(X, Y, false, PageNum);
        if (-1 != Pos.Pos) {
            if (true === Pos.End) {
                this.Selection.StartPos = Pos.Pos + 1;
            } else {
                this.Selection.StartPos = Pos.Pos;
            }
            this.CurPos.ContentPos = Pos.Pos;
            this.CurPos.Line = Pos.Line;
            this.Selection.Use = true;
            this.Selection.Start = true;
            this.Selection.Flag = selectionflag_Common;
        }
    },
    Selection_SetEnd: function (X, Y, PageNum, MouseEvent, bTableBorder) {
        this.CurPos.RealX = X;
        this.CurPos.RealY = Y;
        var Temp = this.Internal_GetContentPosByXY(X, Y, false, PageNum);
        var Pos = Temp.Pos;
        if (-1 != Pos) {
            this.CurPos.ContentPos = Pos;
            this.CurPos.Line = Temp.Line;
            if (true === Temp.End) {
                this.Selection.EndPos = Pos + 1;
            } else {
                this.Selection.EndPos = Pos;
            }
            if (this.Selection.EndPos == this.Selection.StartPos && g_mouse_event_type_up === MouseEvent.Type) {
                var NumPr = this.Numbering_Get();
                if (true === Temp.Numbering && undefined != NumPr) {
                    this.CurPos.ContentPos = 0;
                    this.CurPos.Line = -1;
                    this.Parent.Document_SelectNumbering(NumPr);
                } else {
                    var Temp2 = MouseEvent.ClickCount % 2;
                    if (1 >= MouseEvent.ClickCount) {
                        this.Selection_Remove();
                        this.Selection.Use = false;
                        this.CurPos.ContentPos = Pos;
                        this.CurPos.Line = Temp.Line;
                        this.RecalculateCurPos();
                        return;
                    } else {
                        if (0 == Temp2) {
                            var oStart;
                            if (this.Content[Pos].Type == para_Space) {
                                oStart = this.Internal_FindBackward(Pos, [para_Text, para_NewLine]);
                                if (!oStart.Found) {
                                    oStart.LetterPos = this.Internal_GetStartPos();
                                } else {
                                    if (oStart.Type == para_NewLine) {
                                        oStart.LetterPos++;
                                    } else {
                                        oStart = this.Internal_FindBackward(oStart.LetterPos, [para_Tab, para_Space, para_NewLine]);
                                        if (!oStart.Found) {
                                            oStart.LetterPos = this.Internal_GetStartPos();
                                        } else {
                                            oStart = this.Internal_FindForward(oStart.LetterPos, [para_Text]);
                                            if (!oStart.Found) {
                                                oStart.LetterPos = this.Internal_GetStartPos();
                                            }
                                        }
                                    }
                                }
                            } else {
                                oStart = this.Internal_FindBackward(Pos, [para_Tab, para_Space, para_NewLine]);
                                if (!oStart.Found) {
                                    oStart.LetterPos = this.Internal_GetStartPos();
                                } else {
                                    oStart = this.Internal_FindForward(oStart.LetterPos, [para_Text, para_NewLine]);
                                    if (!oStart.Found) {
                                        oStart.LetterPos = this.Internal_GetStartPos();
                                    }
                                }
                            }
                            var oEnd = this.Internal_FindForward(Pos, [para_Tab, para_Space, para_NewLine]);
                            if (!oEnd.Found) {
                                oEnd.LetterPos = this.Content.length - 1;
                            } else {
                                if (oEnd.Type != para_NewLine) {
                                    oEnd = this.Internal_FindForward(oEnd.LetterPos, [para_Text]);
                                    if (!oEnd.Found) {
                                        oEnd.LetterPos = this.Content.length - 1;
                                    }
                                }
                            }
                            this.Selection.StartPos = oStart.LetterPos;
                            this.Selection.EndPos = oEnd.LetterPos;
                            this.Selection.Use = true;
                        } else {
                            this.Selection.StartPos = this.Internal_GetStartPos();
                            this.Selection.EndPos = this.Content.length - 1;
                            this.Selection.Use = true;
                        }
                    }
                }
            }
        }
        if (-1 === this.Selection.EndPos) {
            return;
        }
    },
    Selection_Stop: function (X, Y, PageNum, MouseEvent) {
        this.Selection.Start = false;
    },
    Selection_Remove: function () {
        this.Selection.Use = false;
        this.Selection.Flag = selectionflag_Common;
        this.Selection_Clear();
    },
    Selection_Clear: function () {},
    Selection_Draw_Page: function (Page_abs) {
        if (true != this.Selection.Use) {
            return;
        }
        var CurPage = Page_abs - this.Get_StartPage_Absolute();
        if (CurPage < 0 || CurPage >= this.Pages.length) {
            return;
        }
        if (0 === CurPage && this.Pages[0].EndLine < 0) {
            return;
        }
        switch (this.Selection.Flag) {
        case selectionflag_Common:
            var StartPos = this.Selection.StartPos;
            var EndPos = this.Selection.EndPos;
            if (StartPos > EndPos) {
                var Temp = EndPos;
                EndPos = StartPos;
                StartPos = Temp;
            }
            var _StartLine = this.Pages[CurPage].StartLine;
            var _EndLine = this.Pages[CurPage].EndLine;
            if (StartPos > this.Lines[_EndLine].EndPos + 1 || EndPos < this.Lines[_StartLine].StartPos) {
                return;
            } else {
                StartPos = Math.max(StartPos, this.Lines[_StartLine].StartPos);
                EndPos = Math.min(EndPos, (_EndLine != this.Lines.length - 1 ? this.Lines[_EndLine].EndPos + 1 : this.Content.length - 1));
            }
            var StartParaPos = this.Internal_Get_ParaPos_By_Pos(StartPos);
            var CurLine = StartParaPos.Line;
            var CurRange = StartParaPos.Range;
            var PNum = StartParaPos.Page;
            var StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;
            var Pos, Item;
            for (Pos = this.Lines[CurLine].Ranges[CurRange].StartPos; Pos <= StartPos - 1; Pos++) {
                Item = this.Content[Pos];
                if (undefined != Item.WidthVisible && (para_Drawing != Item.Type || drawing_Inline === Item.DrawingType)) {
                    StartX += Item.WidthVisible;
                }
            }
            if (this.Pages[PNum].StartLine > CurLine) {
                CurLine = this.Pages[PNum].StartLine;
                CurRange = 0;
                StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                StartPos = this.Lines[this.Pages[PNum].StartLine].StartPos;
            }
            var StartY = this.Pages[PNum].Y + this.Lines[CurLine].Top;
            var H = this.Lines[CurLine].Bottom - this.Lines[CurLine].Top;
            var W = 0;
            for (Pos = StartPos; Pos < EndPos; Pos++) {
                Item = this.Content[Pos];
                if (undefined != Item.CurPage) {
                    if (CurLine < Item.CurLine) {
                        this.DrawingDocument.AddPageSelection(Page_abs, StartX, StartY, W, H);
                        CurLine = Item.CurLine;
                        CurRange = Item.CurRange;
                        StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                        StartY = this.Pages[PNum].Y + this.Lines[CurLine].Top;
                        H = this.Lines[CurLine].Bottom - this.Lines[CurLine].Top;
                        W = 0;
                    } else {
                        if (CurRange < Item.CurRange) {
                            this.DrawingDocument.AddPageSelection(Page_abs, StartX, StartY, W, H);
                            CurRange = Item.CurRange;
                            StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                            W = 0;
                        }
                    }
                }
                if (undefined != Item.WidthVisible) {
                    if (para_Drawing != Item.Type || drawing_Inline === Item.DrawingType) {
                        W += Item.WidthVisible;
                    } else {
                        Item.Draw_Selection();
                    }
                }
                if (Pos == EndPos - 1) {
                    this.DrawingDocument.AddPageSelection(Page_abs, StartX, StartY, W, H);
                }
            }
            break;
        case selectionflag_Numbering:
            var ParaNum = null;
            var CurRange = 0;
            for (var Index = 0; Index < this.Content.length; Index++) {
                if (para_Numbering == this.Content[Index].Type) {
                    ParaNum = this.Content[Index];
                    var ParaPos = this.Internal_Get_ParaPos_By_Pos(Index);
                    CurRange = ParaPos.Range;
                    PNum = ParaPos.Page;
                    break;
                }
            }
            var NumPr = this.Numbering_Get();
            var SelectX = this.Lines[0].Ranges[CurRange].XVisible;
            var SelectW = ParaNum.WidthVisible;
            var NumJc = this.Parent.Get_Numbering().Get_AbstractNum(NumPr.NumId).Lvl[NumPr.Lvl].Jc;
            switch (NumJc) {
            case align_Center:
                SelectX = this.Lines[0].Ranges[CurRange].XVisible - ParaNum.WidthNum / 2;
                SelectW = ParaNum.WidthVisible + ParaNum.WidthNum / 2;
                break;
            case align_Right:
                SelectX = this.Lines[0].Ranges[CurRange].XVisible - ParaNum.WidthNum;
                SelectW = ParaNum.WidthVisible + ParaNum.WidthNum;
                break;
            case align_Left:
                default:
                SelectX = this.Lines[0].Ranges[CurRange].XVisible;
                SelectW = ParaNum.WidthVisible;
                break;
            }
            this.DrawingDocument.AddPageSelection(Page_abs, SelectX, this.Lines[0].Top + this.Pages[PNum].Y, SelectW, this.Lines[0].Bottom - this.Lines[0].Top);
            break;
        }
    },
    Selection_Check: function (X, Y, Page_Abs) {
        var PageIndex = Page_Abs - this.Get_StartPage_Absolute();
        if (PageIndex < 0 || PageIndex >= this.Pages.length || true != this.Selection.Use) {
            return false;
        }
        var Start = this.Selection.StartPos;
        var End = this.Selection.EndPos;
        if (Start > End) {
            Start = this.Selection.EndPos;
            End = this.Selection.StartPos;
        }
        var ContentPos = this.Internal_GetContentPosByXY(X, Y, false, PageIndex + this.PageNum, false);
        if (-1 != ContentPos.Pos && Start <= ContentPos.Pos && End >= ContentPos.Pos) {
            return true;
        }
        return false;
    },
    Selection_CalculateTextPr: function () {
        if (true === this.Selection.Use || true === this.ApplyToAll) {
            var StartPos = this.Selection.StartPos;
            var EndPos = this.Selection.EndPos;
            if (true === this.ApplyToAll) {
                StartPos = 0;
                EndPos = this.Content.length - 1;
            }
            if (StartPos > EndPos) {
                var Temp = EndPos;
                EndPos = StartPos;
                StartPos = Temp;
            }
            if (EndPos >= this.Content.length) {
                EndPos = this.Content.length - 1;
            }
            if (StartPos < 0) {
                StartPos = 0;
            }
            if (StartPos == EndPos) {
                return this.Internal_CalculateTextPr(StartPos);
            }
            while (this.Content[StartPos].Type == para_TextPr) {
                StartPos++;
            }
            var oEnd = this.Internal_FindBackward(EndPos - 1, [para_Text, para_Space]);
            if (oEnd.Found) {
                EndPos = oEnd.LetterPos;
            } else {
                while (this.Content[EndPos].Type == para_TextPr) {
                    EndPos--;
                }
            }
            var TextPr_start = this.Internal_CalculateTextPr(StartPos);
            var TextPr_vis = TextPr_start;
            for (var Pos = StartPos + 1; Pos < EndPos; Pos++) {
                var Item = this.Content[Pos];
                if (para_TextPr == Item.Type && Pos < this.Content.length - 1 && para_TextPr != this.Content[Pos + 1].Type) {
                    var TextPr_cur = this.Internal_CalculateTextPr(Pos);
                    TextPr_vis = TextPr_vis.Compare(TextPr_cur);
                }
            }
            return TextPr_vis;
        } else {
            return new CTextPr();
        }
    },
    Selection_SelectNumbering: function () {
        if (undefined != this.Numbering_Get()) {
            this.Selection.Use = true;
            this.Selection.Flag = selectionflag_Numbering;
        }
    },
    Select_All: function () {
        this.Selection.Use = true;
        this.Selection.StartPos = this.Internal_GetStartPos();
        this.Selection.EndPos = this.Content.length - 1;
    },
    Get_SelectedText: function (bClearText) {
        if (true === this.Selection.Use) {
            var StartPos = this.Selection.StartPos;
            var EndPos = this.Selection.EndPos;
            if (EndPos < StartPos) {
                StartPos = this.Selection.EndPos;
                EndPos = this.Selection.StartPos;
            }
            var Str = "";
            for (var Pos = StartPos; Pos < EndPos; Pos++) {
                var Item = this.Content[Pos];
                switch (Item.Type) {
                case para_Drawing:
                    case para_End:
                    case para_Numbering:
                    case para_PresentationNumbering:
                    case para_PageNum:
                    if (true === bClearText) {
                        return null;
                    }
                    break;
                case para_Text:
                    Str += Item.Value;
                    break;
                case para_Space:
                    case para_Tab:
                    Str += " ";
                    break;
                }
            }
            return Str;
        }
        return "";
    },
    Get_SelectedElementsInfo: function (Info) {},
    IsEmpty: function () {
        var Pos = this.Internal_FindForward(0, [para_Tab, para_Drawing, para_PageNum, para_Text, para_Space, para_NewLine]);
        return (Pos.Found === true ? false : true);
    },
    Is_InText: function (X, Y, PageNum_Abs) {
        var PNum = PageNum_Abs - this.Get_StartPage_Absolute();
        if (PNum < 0 || PNum >= this.Pages.length) {
            return null;
        }
        var Result = this.Internal_GetContentPosByXY(X, Y, false, PNum + this.PageNum, false);
        if (true === Result.InText) {
            return this;
        }
        return null;
    },
    Is_UseInDocument: function () {
        if (null != this.Parent) {
            return this.Parent.Is_UseInDocument(this.Get_Id());
        }
        return false;
    },
    Selection_IsEmpty: function (bCheckHidden) {
        if (undefined === bCheckHidden) {
            bCheckHidden = true;
        }
        if (true === this.Selection.Use) {
            var StartPos = this.Selection.StartPos;
            var EndPos = this.Selection.EndPos;
            if (StartPos > EndPos) {
                var Temp = EndPos;
                EndPos = StartPos;
                StartPos = Temp;
            }
            var CheckArray = [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine];
            if (true === bCheckHidden) {
                CheckArray.push(para_End);
            }
            var Pos = this.Internal_FindForward(StartPos, CheckArray);
            if (true != Pos.Found) {
                return true;
            }
            if (Pos.LetterPos >= EndPos) {
                return true;
            }
            return false;
        }
        return true;
    },
    Numbering_Add: function (NumId, Lvl) {
        var NumPr_old = this.Numbering_Get();
        this.Numbering_Remove();
        this.Pr.NumPr = new CNumPr();
        this.Pr.NumPr.Set(NumId, Lvl);
        History.Add(this, {
            Type: historyitem_Paragraph_Numbering,
            Old: NumPr_old,
            New: this.Pr.NumPr
        });
        if (undefined != this.Pr.Ind) {
            History.Add(this, {
                Type: historyitem_Paragraph_Ind_First,
                Old: (undefined != this.Pr.Ind.FirstLine ? this.Pr.Ind.FirstLine : undefined),
                New: undefined
            });
            History.Add(this, {
                Type: historyitem_Paragraph_Ind_Left,
                Old: (undefined != this.Pr.Ind.Left ? this.Pr.Ind.Left : undefined),
                New: undefined
            });
            this.Pr.Ind.FirstLine = undefined;
            this.Pr.Ind.Left = undefined;
        }
        if (undefined === this.Style_Get()) {
            this.Style_Add(this.Parent.Get_Styles().Get_Default_ParaList());
        }
        this.CompiledPr.NeedRecalc = true;
    },
    Numbering_Add_Open: function (NumId, Lvl) {
        this.Pr.NumPr = new CNumPr();
        this.Pr.NumPr.Set(NumId, Lvl);
        this.CompiledPr.NeedRecalc = true;
    },
    Numbering_Get: function () {
        var NumPr = this.Get_CompiledPr2(false).ParaPr.NumPr;
        if (undefined != NumPr && 0 != NumPr.NumId) {
            return NumPr.Copy();
        }
        return undefined;
    },
    Numbering_Remove: function () {
        return;
        var NewNumPr = undefined;
        if (undefined != this.CompiledPr.Pr.ParaPr.StyleNumPr) {
            NewNumPr = new CNumPr();
            NewNumPr.Set(0, 0);
        }
        History.Add(this, {
            Type: historyitem_Paragraph_Numbering,
            Old: undefined != this.Pr.NumPr ? this.Pr.NumPr : undefined,
            New: NewNumPr
        });
        this.Pr.NumPr = NewNumPr;
        if (undefined != this.Pr.Ind) {
            if (undefined != this.Pr.Ind.FirstLine && this.Pr.Ind.FirstLine < 0) {
                History.Add(this, {
                    Type: historyitem_Paragraph_Ind_First,
                    New: 0,
                    Old: this.Pr.Ind.FirstLine
                });
                this.Pr.Ind.FirstLine = 0;
            }
            if (undefined != this.Pr.Ind.FirstLine && undefined != this.Pr.Ind.Left && this.Pr.Ind.FirstLine > 0) {
                History.Add(this, {
                    Type: historyitem_Paragraph_Ind_Left,
                    New: this.Pr.Ind.Left + this.Pr.Ind.FirstLine,
                    Old: this.Pr.Ind.Left
                });
                History.Add(this, {
                    Type: historyitem_Paragraph_Ind_First,
                    New: 0,
                    Old: this.Pr.Ind.FirstLine
                });
                this.Pr.Ind.Left += this.Pr.Ind.FirstLine;
                this.Pr.Ind.FirstLine = 0;
            }
        }
        var StyleId = this.Style_Get();
        var NumStyleId = this.Parent.Get_Styles().Get_Default_ParaList();
        if (StyleId === NumStyleId) {
            this.Style_Remove();
        }
        this.CompiledPr.NeedRecalc = true;
    },
    Numbering_IsUse: function (NumId, Lvl) {
        var bLvl = (undefined === Lvl ? false : true);
        var NumPr = this.Numbering_Get();
        if (undefined != NumPr && NumId === NumPr.NumId && (false === bLvl || Lvl === NumPr.Lvl)) {
            return true;
        }
        return false;
    },
    Add_PresentationNumbering: function (_Bullet) {
        var Bullet = _Bullet.Copy();
        History.Add(this, {
            Type: historyitem_Paragraph_PresentationPr_Bullet,
            New: Bullet,
            Old: this.PresentationPr.Bullet
        });
        var OldType = this.PresentationPr.Bullet.Get_Type();
        var NewType = Bullet.Get_Type();
        this.PresentationPr.Bullet = Bullet;
        if (numbering_presentationnumfrmt_None != NewType) {
            if (numbering_presentationnumfrmt_None === OldType) {
                this.Internal_Content_Add(0, new ParaPresentationNumbering(Bullet));
            }
        } else {
            for (var Index = 0; Index < this.Content.length; Index++) {
                if (this.Content[Index].Type == para_PresentationNumbering) {
                    this.Internal_Content_Remove(Index);
                    break;
                }
            }
        }
        if (OldType != NewType) {
            var ParaPr = this.Get_CompiledPr2(false).ParaPr;
            var LeftInd = Math.min(ParaPr.Ind.Left, ParaPr.Ind.Left + ParaPr.Ind.FirstLine);
            if (numbering_presentationnumfrmt_None === NewType) {
                this.Set_Ind({
                    FirstLine: 0,
                    Left: LeftInd
                });
            } else {
                if (numbering_presentationnumfrmt_RomanLcPeriod === NewType || numbering_presentationnumfrmt_RomanUcPeriod === NewType) {
                    this.Set_Ind({
                        Left: LeftInd + 15.9,
                        FirstLine: -15.9
                    });
                } else {
                    this.Set_Ind({
                        Left: LeftInd + 14.3,
                        FirstLine: -14.3
                    });
                }
            }
        }
    },
    Get_PresentationNumbering: function () {
        return this.PresentationPr.Bullet;
    },
    Remove_PresentationNumbering: function () {
        this.Add_PresentationNumbering(new CPresentationBullet());
    },
    Set_PresentationLevel: function (Level) {
        if (this.PresentationPr.Level != Level) {
            History.Add(this, {
                Type: historyitem_Paragraph_PresentationPr_Level,
                Old: this.PresentationPr.Level,
                New: Level
            });
            this.PresentationPr.Level = Level;
        }
    },
    Get_CompiledPr: function () {
        var Pr = this.Get_CompiledPr2();
        var StyleId = this.Style_Get();
        var PrevEl = this.Get_DocumentPrev();
        var NextEl = this.Get_DocumentNext();
        var NumPr = this.Numbering_Get();
        if (null != PrevEl && type_Paragraph === PrevEl.GetType()) {
            var PrevStyle = PrevEl.Style_Get();
            var Prev_Pr = PrevEl.Get_CompiledPr2(false).ParaPr;
            var Prev_After = Prev_Pr.Spacing.After;
            var Prev_AfterAuto = Prev_Pr.Spacing.AfterAutoSpacing;
            var Cur_Before = Pr.ParaPr.Spacing.Before;
            var Cur_BeforeAuto = Pr.ParaPr.Spacing.BeforeAutoSpacing;
            var Prev_NumPr = PrevEl.Numbering_Get();
            if (PrevStyle === StyleId && true === Pr.ParaPr.ContextualSpacing) {
                Pr.ParaPr.Spacing.Before = 0;
            } else {
                if (true === Cur_BeforeAuto && PrevStyle === StyleId && undefined != Prev_NumPr && undefined != NumPr && Prev_NumPr.NumId === NumPr.NumId) {
                    Pr.ParaPr.Spacing.Before = 0;
                } else {
                    Cur_Before = this.Internal_CalculateAutoSpacing(Cur_Before, Cur_BeforeAuto, this);
                    Prev_After = this.Internal_CalculateAutoSpacing(Prev_After, Prev_AfterAuto, this);
                    if (true === Prev_Pr.ContextualSpacing) {
                        Prev_After = 0;
                    }
                    Pr.ParaPr.Spacing.Before = Math.max(Prev_After, Cur_Before) - Prev_After;
                }
            }
            if (false === this.Internal_Is_NullBorders(Pr.ParaPr.Brd) && true === this.Internal_CompareBrd(Prev_Pr, Pr.ParaPr)) {
                Pr.ParaPr.Brd.First = false;
            } else {
                Pr.ParaPr.Brd.First = true;
            }
        } else {
            if (null === PrevEl) {
                if (true === Pr.ParaPr.Spacing.BeforeAutoSpacing) {
                    Pr.ParaPr.Spacing.Before = 0;
                }
            } else {
                if (type_Table === PrevEl.GetType()) {
                    if (true === Pr.ParaPr.Spacing.BeforeAutoSpacing) {
                        Pr.ParaPr.Spacing.Before = 14 * g_dKoef_pt_to_mm;
                    }
                }
            }
        }
        if (null != NextEl) {
            if (type_Paragraph === NextEl.GetType()) {
                var NextStyle = NextEl.Style_Get();
                var Next_Pr = NextEl.Get_CompiledPr2(false).ParaPr;
                var Next_Before = Next_Pr.Spacing.Before;
                var Next_BeforeAuto = Next_Pr.Spacing.BeforeAutoSpacing;
                var Cur_After = Pr.ParaPr.Spacing.After;
                var Cur_AfterAuto = Pr.ParaPr.Spacing.AfterAutoSpacing;
                var Next_NumPr = NextEl.Numbering_Get();
                if (NextStyle === StyleId && true === Pr.ParaPr.ContextualSpacing) {
                    Pr.ParaPr.Spacing.After = 0;
                } else {
                    if (true === Cur_AfterAuto && NextStyle === StyleId && undefined != Next_NumPr && undefined != NumPr && Next_NumPr.NumId === NumPr.NumId) {
                        Pr.ParaPr.Spacing.After = 0;
                    } else {
                        Pr.ParaPr.Spacing.After = this.Internal_CalculateAutoSpacing(Cur_After, Cur_AfterAuto, this);
                    }
                }
                if (false === this.Internal_Is_NullBorders(Pr.ParaPr.Brd) && true === this.Internal_CompareBrd(Next_Pr, Pr.ParaPr)) {
                    Pr.ParaPr.Brd.Last = false;
                } else {
                    Pr.ParaPr.Brd.Last = true;
                }
            } else {
                if (type_Table === NextEl.GetType()) {
                    var TableFirstParagraph = NextEl.Get_FirstParagraph();
                    var NextStyle = TableFirstParagraph.Style_Get();
                    var Next_Before = TableFirstParagraph.Get_CompiledPr2(false).ParaPr.Spacing.Before;
                    var Next_BeforeAuto = TableFirstParagraph.Get_CompiledPr2(false).ParaPr.Spacing.BeforeAutoSpacing;
                    var Cur_After = Pr.ParaPr.Spacing.After;
                    var Cur_AfterAuto = Pr.ParaPr.Spacing.AfterAutoSpacing;
                    if (NextStyle === StyleId && true === Pr.ParaPr.ContextualSpacing) {
                        Cur_After = this.Internal_CalculateAutoSpacing(Cur_After, Cur_AfterAuto, this);
                        Next_Before = this.Internal_CalculateAutoSpacing(Next_Before, Next_BeforeAuto, this);
                        Pr.ParaPr.Spacing.After = Math.max(Next_Before, Cur_After) - Cur_After;
                    } else {
                        Pr.ParaPr.Spacing.After = this.Internal_CalculateAutoSpacing(Pr.ParaPr.Spacing.After, Cur_AfterAuto, this);
                    }
                }
            }
        } else {
            Pr.ParaPr.Spacing.After = this.Internal_CalculateAutoSpacing(Pr.ParaPr.Spacing.After, Pr.ParaPr.Spacing.AfterAutoSpacing, this);
        }
        return Pr;
    },
    Recalc_CompiledPr: function () {
        this.CompiledPr.NeedRecalc = true;
    },
    Get_CompiledPr2: function (bCopy) {
        if (true === this.CompiledPr.NeedRecalc) {
            this.CompiledPr.Pr = this.Internal_CompileParaPr();
            this.CompiledPr.NeedRecalc = false;
        }
        if (false === bCopy) {
            return this.CompiledPr.Pr;
        } else {
            var Pr = {};
            Pr.TextPr = this.CompiledPr.Pr.TextPr.Copy();
            Pr.ParaPr = this.CompiledPr.Pr.ParaPr.Copy();
            return Pr;
        }
    },
    Internal_CompileParaPr: function () {
        var Styles = this.Parent.Get_Styles();
        var Numbering = this.Parent.Get_Numbering();
        var TableStyle = this.Parent.Get_TableStyleForPara();
        var StyleId = this.Style_Get();
        var Pr = Styles.Get_Pr(Styles.Id - 1, styletype_Paragraph, TableStyle);
        var theme = this.Parent.getTheme();
        var color_map = this.Parent.getColorMap();
        if (isRealObject(Pr.TextPr.unifill) && isRealObject(Pr.TextPr.unifill.fill)) {
            Pr.TextPr.unifill.calculate(theme, color_map, {
                R: 0,
                G: 0,
                B: 0,
                A: 255
            });
            if (isRealObject(Pr.TextPr.unifill.fill.color)) {
                var color = Pr.TextPr.unifill.fill.color.RGBA;
                Pr.TextPr.Color = new CDocumentColor(color.R, color.G, color.B);
            } else {
                if (Array.isArray(Pr.TextPr.unifill.fill.colors) && isRealObject(Pr.TextPr.unifill.fill.colors[0])) {
                    var color = Pr.TextPr.unifill.fill.colors[0].RGBA;
                    Pr.TextPr.Color = new CDocumentColor(color.R, color.G, color.B);
                }
            }
        }
        if (typeof Pr.TextPr.themeFont === "string") {
            var font_name = getFontInfo(Pr.TextPr.themeFont)(theme.themeElements.fontScheme);
            Pr.TextPr.FontFamily = {
                Name: font_name,
                Index: -1
            };
        }
        if (Pr.TextPr.FontFamily && Pr.TextPr.FontFamily.Name) {
            Pr.TextPr.RFonts.Ascii = {
                Name: Pr.TextPr.FontFamily.Name,
                Index: -1
            };
            Pr.TextPr.RFonts.CS = {
                Name: Pr.TextPr.FontFamily.Name,
                Index: -1
            };
            Pr.TextPr.RFonts.EastAsia = {
                Name: Pr.TextPr.FontFamily.Name,
                Index: -1
            };
            Pr.TextPr.RFonts.HAnsi = {
                Name: Pr.TextPr.FontFamily.Name,
                Index: -1
            };
        }
        if (undefined != Pr.ParaPr.NumPr) {
            Pr.ParaPr.StyleNumPr = Pr.ParaPr.NumPr.Copy();
        }
        var Lvl = -1;
        if (undefined != this.Pr.NumPr) {
            if (undefined != this.Pr.NumPr.NumId && 0 != this.Pr.NumPr.NumId) {
                Pr.ParaPr.Merge(Numbering.Get_ParaPr(this.Pr.NumPr.NumId, this.Pr.NumPr.Lvl));
                Lvl = this.Pr.NumPr.Lvl;
            }
        } else {
            if (undefined != Pr.ParaPr.NumPr) {
                if (undefined != Pr.ParaPr.NumPr.NumId && 0 != Pr.ParaPr.NumPr.NumId) {
                    var AbstractNum = Numbering.Get_AbstractNum(Pr.ParaPr.NumPr.NumId);
                    Lvl = AbstractNum.Get_LvlByStyle(StyleId);
                    if (-1 != Lvl) {
                        Pr.ParaPr.Merge(Numbering.Get_ParaPr(Pr.ParaPr.NumPr.NumId, Lvl));
                    } else {
                        Pr.ParaPr.NumPr = undefined;
                    }
                }
            }
        }
        Pr.ParaPr.StyleTabs = (undefined != Pr.ParaPr.Tabs ? Pr.ParaPr.Tabs.Copy() : new CParaTabs());
        Pr.ParaPr.Merge(this.Pr);
        if (-1 != Lvl && undefined != Pr.ParaPr.NumPr) {
            Pr.ParaPr.NumPr.Lvl = Lvl;
        }
        return Pr;
    },
    Recalc_CompileParaPr: function () {
        this.CompiledPr.NeedRecalc = true;
    },
    Internal_CalculateAutoSpacing: function (Value, UseAuto, Para) {
        var Result = Value;
        if (true === UseAuto) {
            if (true === Para.Parent.Is_TableCellContent()) {
                Result = 0;
            } else {
                Result = 14 * g_dKoef_pt_to_mm;
            }
        }
        return Result;
    },
    Get_Paragraph_ParaPr_Copy: function () {
        var ParaPr = this.Pr.Copy();
        return ParaPr;
    },
    Paragraph_Format_Paste: function (TextPr, ParaPr, ApplyPara) {
        if (null != TextPr) {
            this.Add(new ParaTextPr(TextPr));
        }
        var _ApplyPara = ApplyPara;
        if (false === _ApplyPara) {
            if (true === this.Selection.Use) {
                _ApplyPara = true;
                var Start = this.Selection.StartPos;
                var End = this.Selection.EndPos;
                if (Start > End) {
                    Start = this.Selection.EndPos;
                    End = this.Selection.StartPos;
                }
                if (true === this.Internal_FindForward(End, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_End]).Found) {
                    _ApplyPara = false;
                } else {
                    if (true === this.Internal_FindBackward(Start - 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_End]).Found) {
                        _ApplyPara = false;
                    }
                }
            } else {
                _ApplyPara = true;
            }
        }
        if (true === _ApplyPara && null != ParaPr) {
            if (undefined != ParaPr.Ind) {
                this.Set_Ind(ParaPr.Ind, false);
            }
            if (undefined != ParaPr.Jc) {
                this.Set_Align(ParaPr.Jc);
            }
            if (undefined != ParaPr.Spacing) {
                this.Set_Spacing(ParaPr.Spacing, false);
            }
            if (undefined != ParaPr.PageBreakBefore) {
                this.Set_PageBreakBefore(ParaPr.PageBreakBefore);
            }
            if (undefined != ParaPr.KeepLines) {
                this.Set_KeepLines(ParaPr.KeepLines);
            }
            if (undefined != ParaPr.ContextualSpacing) {
                this.Set_ContextualSpacing(ParaPr.ContextualSpacing);
            }
            if (undefined != ParaPr.Shd) {
                this.Set_Shd(ParaPr.Shd, false);
            }
            if (undefined != ParaPr.PStyle) {
                this.Style_Add(ParaPr.PStyle, true);
            } else {
                this.Style_Remove();
            }
            if (undefined != ParaPr.NumPr) {
                this.Numbering_Add(ParaPr.NumPr.NumId, ParaPr.NumPr.Lvl);
            } else {
                this.Numbering_Remove();
            }
            if (undefined != ParaPr.Brd) {
                this.Set_Borders(ParaPr.Brd);
            }
        }
    },
    Style_Get: function () {
        if (undefined != typeof(this.Pr.PStyle)) {
            return this.Pr.PStyle;
        }
        return undefined;
    },
    Style_Add: function (Id, bDoNotDeleteProps) {
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
        var Id_old = this.Pr.PStyle;
        if (undefined === this.Pr.PStyle) {
            Id_old = null;
        } else {
            this.Style_Remove();
        }
        if (null === Id) {
            return;
        }
        this.CompiledPr.NeedRecalc = true;
        if (true === bDoNotDeleteProps) {
            return;
        }
        var DefNumId = this.Parent.Get_Styles().Get_Default_ParaList();
        if (Id != DefNumId && (Id_old != DefNumId || Id != this.Parent.Get_Styles().Get_Default_Paragraph())) {
            this.Set_ContextualSpacing(undefined);
            this.Set_Ind(new CParaInd(), true);
            this.Set_Align(undefined);
            this.Set_KeepLines(undefined);
            this.Set_KeepNext(undefined);
            this.Set_PageBreakBefore(undefined);
            this.Set_Spacing(new CParaSpacing(), true);
            this.Set_Shd(new CDocumentShd(), true);
            this.Set_WidowControl(undefined);
            this.Set_Tabs(new CParaTabs());
            this.Set_Border(undefined, historyitem_Paragraph_Borders_Between);
            this.Set_Border(undefined, historyitem_Paragraph_Borders_Bottom);
            this.Set_Border(undefined, historyitem_Paragraph_Borders_Left);
            this.Set_Border(undefined, historyitem_Paragraph_Borders_Right);
            this.Set_Border(undefined, historyitem_Paragraph_Borders_Top);
            for (var Index = 0; Index < this.Content.length; Index++) {
                var Item = this.Content[Index];
                if (para_TextPr === Item.Type) {
                    this.Internal_Content_Remove(Index);
                    Index--;
                }
            }
        }
    },
    Style_Add_Open: function (Id) {
        this.Pr.PStyle = Id;
        this.CompiledPr.NeedRecalc = true;
    },
    Style_Remove: function () {
        if (undefined != this.Pr.PStyle) {
            this.Pr.PStyle = undefined;
        }
        this.CompiledPr.NeedRecalc = true;
    },
    Cursor_IsEnd: function (ContentPos) {
        if (undefined === ContentPos) {
            ContentPos = this.CurPos.ContentPos;
        }
        var oPos = this.Internal_FindForward(ContentPos, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine]);
        if (true === oPos.Found) {
            return false;
        } else {
            return true;
        }
    },
    Cursor_IsStart: function (ContentPos) {
        if (undefined === ContentPos) {
            ContentPos = this.CurPos.ContentPos;
        }
        var oPos = this.Internal_FindBackward(ContentPos - 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine]);
        if (true === oPos.Found) {
            return false;
        } else {
            return true;
        }
    },
    Clear_Formatting: function () {
        this.Style_Remove();
        this.Numbering_Remove();
        this.Set_ContextualSpacing(undefined);
        this.Set_Ind(new CParaInd(), true);
        this.Set_Align(undefined, false);
        this.Set_KeepLines(undefined);
        this.Set_KeepNext(undefined);
        this.Set_PageBreakBefore(undefined);
        this.Set_Spacing(new CParaSpacing(), true);
        this.Set_Shd(new CDocumentShd(), true);
        this.Set_WidowControl(undefined);
        this.Set_Tabs(new CParaTabs());
        this.Set_Border(undefined, historyitem_Paragraph_Borders_Between);
        this.Set_Border(undefined, historyitem_Paragraph_Borders_Bottom);
        this.Set_Border(undefined, historyitem_Paragraph_Borders_Left);
        this.Set_Border(undefined, historyitem_Paragraph_Borders_Right);
        this.Set_Border(undefined, historyitem_Paragraph_Borders_Top);
        this.CompiledPr.NeedRecalc = true;
    },
    Clear_TextFormatting: function () {
        for (var Index = 0; Index < this.Content.length; Index++) {
            var Item = this.Content[Index];
            if (para_TextPr === Item.Type) {
                this.Internal_Content_Remove(Index);
                Index--;
            }
        }
    },
    Set_Ind: function (Ind, bDeleteUndefined) {
        if (undefined === this.Pr.Ind) {
            this.Pr.Ind = new CParaInd();
        }
        if ((undefined != Ind.FirstLine || true === bDeleteUndefined) && this.Pr.Ind.FirstLine !== Ind.FirstLine) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Paragraph_Ind_First, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp((undefined != this.Pr.Ind.FirstLine ? this.Pr.Ind.FirstLine : undefined), Ind.FirstLine)));
            this.Pr.Ind.FirstLine = Ind.FirstLine;
        }
        if ((undefined != Ind.Left || true === bDeleteUndefined) && this.Pr.Ind.Left !== Ind.Left) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Paragraph_Ind_Left, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp((undefined != this.Pr.Ind.Left ? this.Pr.Ind.Left : undefined), Ind.Left)));
            this.Pr.Ind.Left = Ind.Left;
        }
        if ((undefined != Ind.Right || true === bDeleteUndefined) && this.Pr.Ind.Right !== Ind.Right) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Paragraph_Ind_Right, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp((undefined != this.Pr.Ind.Right ? this.Pr.Ind.Right : undefined), Ind.Right)));
            this.Pr.Ind.Right = Ind.Right;
        }
        this.CompiledPr.NeedRecalc = true;
    },
    Set_Spacing: function (Spacing, bDeleteUndefined) {
        if (undefined === this.Pr.Spacing) {
            this.Pr.Spacing = new CParaSpacing();
        }
        if ((undefined != Spacing.Line || true === bDeleteUndefined) && this.Pr.Spacing.Line !== Spacing.Line) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Paragraph_Spacing_Line, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp((undefined != this.Pr.Spacing.Line ? this.Pr.Spacing.Line : undefined), Spacing.Line)));
            this.Pr.Spacing.Line = Spacing.Line;
        }
        if ((undefined != Spacing.LineRule || true === bDeleteUndefined) && this.Pr.Spacing.LineRule !== Spacing.LineRule) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Paragraph_Spacing_LineRule, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp((undefined != this.Pr.Spacing.LineRule ? this.Pr.Spacing.LineRule : undefined), Spacing.LineRule)));
            this.Pr.Spacing.LineRule = Spacing.LineRule;
        }
        if ((undefined != Spacing.Before || true === bDeleteUndefined) && this.Pr.Spacing.Before !== Spacing.Before) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Paragraph_Spacing_Before, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp((undefined != this.Pr.Spacing.Before ? this.Pr.Spacing.Before : undefined), Spacing.Before)));
            this.Pr.Spacing.Before = Spacing.Before;
        }
        if ((undefined != Spacing.After || true === bDeleteUndefined) && this.Pr.Spacing.After !== Spacing.After) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Paragraph_Spacing_After, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp((undefined != this.Pr.Spacing.After ? this.Pr.Spacing.After : undefined), Spacing.After)));
            this.Pr.Spacing.After = Spacing.After;
        }
        if ((undefined != Spacing.AfterAutoSpacing || true === bDeleteUndefined) && this.Pr.Spacing.AfterAutoSpacing !== Spacing.AfterAutoSpacing) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Paragraph_Spacing_AfterAutoSpacing, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp((undefined != this.Pr.Spacing.AfterAutoSpacing ? this.Pr.Spacing.AfterAutoSpacing : undefined), Spacing.AfterAutoSpacing)));
            this.Pr.Spacing.AfterAutoSpacing = Spacing.AfterAutoSpacing;
        }
        if ((undefined != Spacing.BeforeAutoSpacing || true === bDeleteUndefined) && this.Pr.Spacing.BeforeAutoSpacing !== Spacing.BeforeAutoSpacing) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Paragraph_Spacing_BeforeAutoSpacing, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp((undefined != this.Pr.Spacing.BeforeAutoSpacing ? this.Pr.Spacing.BeforeAutoSpacing : undefined), Spacing.BeforeAutoSpacing)));
            this.Pr.Spacing.BeforeAutoSpacing = Spacing.BeforeAutoSpacing;
        }
        this.CompiledPr.NeedRecalc = true;
    },
    Set_Align: function (Align) {
        if (this.Pr.Jc != Align) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Paragraph_Align, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(undefined != this.Pr.Jc ? this.Pr.Jc : undefined, Align)));
            this.Pr.Jc = Align;
            this.CompiledPr.NeedRecalc = true;
        }
    },
    Set_Shd: function (_Shd, bDeleteUndefined) {
        var Shd = new CDocumentShd();
        Shd.Set_FromObject(_Shd);
        if (undefined === this.Pr.Shd) {
            this.Pr.Shd = new CDocumentShd();
        }
        if ((undefined != Shd.Value || true === bDeleteUndefined) && this.Pr.Shd.Value !== Shd.Value) {
            History.Add(this, {
                Type: historyitem_Paragraph_Shd_Value,
                New: Shd.Value,
                Old: (undefined != this.Pr.Shd.Value ? this.Pr.Shd.Value : undefined)
            });
            this.Pr.Shd.Value = Shd.Value;
        }
        if (undefined != Shd.Color || true === bDeleteUndefined) {
            History.Add(this, {
                Type: historyitem_Paragraph_Shd_Color,
                New: Shd.Color,
                Old: (undefined != this.Pr.Shd.Color ? this.Pr.Shd.Color : undefined)
            });
            this.Pr.Shd.Color = Shd.Color;
        }
        this.CompiledPr.NeedRecalc = true;
    },
    Set_Tabs: function (Tabs) {
        var _Tabs = new CParaTabs();
        var StyleTabs = this.Get_CompiledPr2(false).ParaPr.StyleTabs;
        for (var Index = 0; Index < Tabs.Tabs.length; Index++) {
            var Value = StyleTabs.Get_Value(Tabs.Tabs[Index]);
            if (-1 === Value) {
                _Tabs.Add(Tabs.Tabs[Index]);
            }
        }
        for (var Index = 0; Index < StyleTabs.Tabs.length; Index++) {
            var Value = _Tabs.Get_Value(StyleTabs.Tabs[Index]);
            if (tab_Clear != StyleTabs.Tabs[Index] && -1 === Value) {
                _Tabs.Add(new CParaTab(tab_Clear, StyleTabs.Tabs[Index].Pos));
            }
        }
        History.Add(this, {
            Type: historyitem_Paragraph_Tabs,
            New: _Tabs,
            Old: this.Pr.Tabs
        });
        this.Pr.Tabs = _Tabs;
        this.CompiledPr.NeedRecalc = true;
    },
    Set_ContextualSpacing: function (Value) {
        if (Value != this.Pr.ContextualSpacing) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Paragraph_ContextualSpacing, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp((undefined != this.Pr.ContextualSpacing ? this.Pr.ContextualSpacing : undefined), Value)));
            this.Pr.ContextualSpacing = Value;
            this.CompiledPr.NeedRecalc = true;
        }
    },
    Set_PageBreakBefore: function (Value) {
        if (Value != this.Pr.PageBreakBefore) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Paragraph_PageBreakBefore, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp((undefined != this.Pr.PageBreakBefore ? this.Pr.PageBreakBefore : undefined), Value)));
            this.Pr.PageBreakBefore = Value;
            this.CompiledPr.NeedRecalc = true;
        }
    },
    Set_KeepLines: function (Value) {
        if (Value != this.Pr.KeepLines) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Paragraph_KeepLines, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp((undefined != this.Pr.KeepLines ? this.Pr.KeepLines : undefined), Value)));
            this.Pr.KeepLines = Value;
            this.CompiledPr.NeedRecalc = true;
        }
    },
    Set_KeepNext: function (Value) {
        if (Value != this.Pr.KeepNext) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Paragraph_KeepNext, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp((undefined != this.Pr.KeepNext ? this.Pr.KeepNext : undefined), Value)));
            this.Pr.KeepNext = Value;
            this.CompiledPr.NeedRecalc = true;
        }
    },
    Set_WidowControl: function (Value) {
        if (Value != this.Pr.WidowControl) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_Paragraph_WidowControl, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp((undefined != this.Pr.WidowControl ? this.Pr.WidowControl : undefined), Value)));
            this.Pr.WidowControl = Value;
            this.CompiledPr.NeedRecalc = true;
        }
    },
    Set_Borders: function (Borders) {
        if (undefined === Borders) {
            return;
        }
        var OldBorders = this.Get_CompiledPr2(false).ParaPr.Brd;
        if (undefined != Borders.Between) {
            var NewBorder = undefined;
            if (undefined != Borders.Between.Value) {
                NewBorder = new CDocumentBorder();
                NewBorder.Color = (undefined != Borders.Between.Color ? new CDocumentColor(Borders.Between.Color.r, Borders.Between.Color.g, Borders.Between.Color.b) : new CDocumentColor(OldBorders.Between.Color.r, OldBorders.Between.Color.g, OldBorders.Between.Color.b));
                NewBorder.Space = (undefined != Borders.Between.Space ? Borders.Between.Space : OldBorders.Between.Space);
                NewBorder.Size = (undefined != Borders.Between.Size ? Borders.Between.Size : OldBorders.Between.Size);
                NewBorder.Value = (undefined != Borders.Between.Value ? Borders.Between.Value : OldBorders.Between.Value);
            }
            History.Add(this, {
                Type: historyitem_Paragraph_Borders_Between,
                New: NewBorder,
                Old: this.Pr.Brd.Between
            });
            this.Pr.Brd.Between = NewBorder;
        }
        if (undefined != Borders.Top) {
            var NewBorder = undefined;
            if (undefined != Borders.Top.Value) {
                NewBorder = new CDocumentBorder();
                NewBorder.Color = (undefined != Borders.Top.Color ? new CDocumentColor(Borders.Top.Color.r, Borders.Top.Color.g, Borders.Top.Color.b) : new CDocumentColor(OldBorders.Top.Color.r, OldBorders.Top.Color.g, OldBorders.Top.Color.b));
                NewBorder.Space = (undefined != Borders.Top.Space ? Borders.Top.Space : OldBorders.Top.Space);
                NewBorder.Size = (undefined != Borders.Top.Size ? Borders.Top.Size : OldBorders.Top.Size);
                NewBorder.Value = (undefined != Borders.Top.Value ? Borders.Top.Value : OldBorders.Top.Value);
            }
            History.Add(this, {
                Type: historyitem_Paragraph_Borders_Top,
                New: NewBorder,
                Old: this.Pr.Brd.Top
            });
            this.Pr.Brd.Top = NewBorder;
        }
        if (undefined != Borders.Right) {
            var NewBorder = undefined;
            if (undefined != Borders.Right.Value) {
                NewBorder = new CDocumentBorder();
                NewBorder.Color = (undefined != Borders.Right.Color ? new CDocumentColor(Borders.Right.Color.r, Borders.Right.Color.g, Borders.Right.Color.b) : new CDocumentColor(OldBorders.Right.Color.r, OldBorders.Right.Color.g, OldBorders.Right.Color.b));
                NewBorder.Space = (undefined != Borders.Right.Space ? Borders.Right.Space : OldBorders.Right.Space);
                NewBorder.Size = (undefined != Borders.Right.Size ? Borders.Right.Size : OldBorders.Right.Size);
                NewBorder.Value = (undefined != Borders.Right.Value ? Borders.Right.Value : OldBorders.Right.Value);
            }
            History.Add(this, {
                Type: historyitem_Paragraph_Borders_Right,
                New: NewBorder,
                Old: this.Pr.Brd.Right
            });
            this.Pr.Brd.Right = NewBorder;
        }
        if (undefined != Borders.Bottom) {
            var NewBorder = undefined;
            if (undefined != Borders.Bottom.Value) {
                NewBorder = new CDocumentBorder();
                NewBorder.Color = (undefined != Borders.Bottom.Color ? new CDocumentColor(Borders.Bottom.Color.r, Borders.Bottom.Color.g, Borders.Bottom.Color.b) : new CDocumentColor(OldBorders.Bottom.Color.r, OldBorders.Bottom.Color.g, OldBorders.Bottom.Color.b));
                NewBorder.Space = (undefined != Borders.Bottom.Space ? Borders.Bottom.Space : OldBorders.Bottom.Space);
                NewBorder.Size = (undefined != Borders.Bottom.Size ? Borders.Bottom.Size : OldBorders.Bottom.Size);
                NewBorder.Value = (undefined != Borders.Bottom.Value ? Borders.Bottom.Value : OldBorders.Bottom.Value);
            }
            History.Add(this, {
                Type: historyitem_Paragraph_Borders_Bottom,
                New: NewBorder,
                Old: this.Pr.Brd.Bottom
            });
            this.Pr.Brd.Bottom = NewBorder;
        }
        if (undefined != Borders.Left) {
            var NewBorder = undefined;
            if (undefined != Borders.Left.Value) {
                NewBorder = new CDocumentBorder();
                NewBorder.Color = (undefined != Borders.Left.Color ? new CDocumentColor(Borders.Left.Color.r, Borders.Left.Color.g, Borders.Left.Color.b) : new CDocumentColor(OldBorders.Left.Color.r, OldBorders.Left.Color.g, OldBorders.Left.Color.b));
                NewBorder.Space = (undefined != Borders.Left.Space ? Borders.Left.Space : OldBorders.Left.Space);
                NewBorder.Size = (undefined != Borders.Left.Size ? Borders.Left.Size : OldBorders.Left.Size);
                NewBorder.Value = (undefined != Borders.Left.Value ? Borders.Left.Value : OldBorders.Left.Value);
            }
            History.Add(this, {
                Type: historyitem_Paragraph_Borders_Left,
                New: NewBorder,
                Old: this.Pr.Brd.Left
            });
            this.Pr.Brd.Left = NewBorder;
        }
        this.CompiledPr.NeedRecalc = true;
    },
    Set_Border: function (Border, HistoryType) {
        var OldValue;
        switch (HistoryType) {
        case historyitem_Paragraph_Borders_Between:
            OldValue = this.Pr.Brd.Between;
            this.Pr.Brd.Between = Border;
            break;
        case historyitem_Paragraph_Borders_Bottom:
            OldValue = this.Pr.Brd.Bottom;
            this.Pr.Brd.Bottom = Border;
            break;
        case historyitem_Paragraph_Borders_Left:
            OldValue = this.Pr.Brd.Left;
            this.Pr.Brd.Left = Border;
            break;
        case historyitem_Paragraph_Borders_Right:
            OldValue = this.Pr.Brd.Right;
            this.Pr.Brd.Right = Border;
            break;
        case historyitem_Paragraph_Borders_Top:
            OldValue = this.Pr.Brd.Top;
            this.Pr.Brd.Top = Border;
            break;
        }
        History.Add(this, {
            Type: historyitem_Paragraph_WidowControl,
            New: Border,
            Old: OldValue
        });
        this.CompiledPr.NeedRecalc = true;
    },
    Is_StartFromNewPage: function () {
        if ((this.Pages.length > 1 && 0 === this.Pages[1].FirstLine) || (null === this.Get_DocumentPrev())) {
            return true;
        }
        return false;
    },
    Internal_GetPage: function (Pos) {
        if (undefined === Pos) {
            Pos = this.CurPos.ContentPos;
        }
        return this.Internal_Get_ParaPos_By_Pos(Pos).Page;
    },
    Remove_DrawingObject: function (Id) {
        for (var Index = 0; Index < this.Content.length; Index++) {
            if (para_Drawing === this.Content[Index].Type && Id === this.Content[Index].Get_Id()) {
                this.Internal_Content_Remove(Index);
                return Index;
            }
        }
        return -1;
    },
    Internal_CorrectAnchorPos: function (Result, Drawing, PageNum) {
        var RelH = Drawing.PositionH.RelativeFrom;
        var RelV = Drawing.PositionV.RelativeFrom;
        if (c_oAscRelativeFromH.Character != RelH || c_oAscRelativeFromV.Line != RelV) {
            var CurLine = Result.Internal.Line;
            if (c_oAscRelativeFromV.Line != RelV) {
                var CurPage = Result.Internal.Page;
                CurLine = this.Pages[CurPage].StartLine;
            }
            var StartLinesPos = this.Lines[CurLine].StartPos;
            var CurRange = this.Internal_Get_ParaPos_By_Pos(StartLinesPos).Range;
            Result.X = this.Lines[CurLine].Ranges[CurRange].X - 3.8;
        }
        if (c_oAscRelativeFromV.Line != RelV) {
            var CurPage = Result.Internal.Page;
            var CurLine = this.Pages[CurPage].StartLine;
            Result.Y = this.Pages[CurPage].Y + this.Lines[CurLine].Y - this.Lines[CurLine].Metrics.Ascent;
        }
        if (c_oAscRelativeFromH.Character === RelH) {} else {
            if (c_oAscRelativeFromV.Line === RelV) {
                var CurLine = this.Internal_Get_ParaPos_By_Pos(Result.ContentPos).Line;
                Result.ContentPos = this.Lines[CurLine].StartPos;
            } else {
                Result.ContentPos = 0;
            }
        }
    },
    Get_NearestPos: function (PageNum, X, Y, bAnchor, Drawing) {
        var ContentPos = this.Internal_GetContentPosByXY(X, Y, false, PageNum).Pos;
        var Result = this.Internal_Recalculate_CurPos(ContentPos, false, false, true);
        Result.ContentPos = ContentPos;
        Result.Paragraph = this;
        if (true === bAnchor && undefined != Drawing && null != Drawing) {
            this.Internal_CorrectAnchorPos(Result, Drawing, PageNum - this.PageNum);
        }
        return Result;
    },
    Get_AnchorPos: function (Drawing) {
        var ContentPos = -1;
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            var Item = this.Content[Index];
            if (para_Drawing === Item.Type && Item.Get_Id() === Drawing.Get_Id()) {
                ContentPos = Index;
                break;
            }
        }
        var CurPage = this.Internal_Get_ParaPos_By_Pos(ContentPos).Page;
        if (-1 === ContentPos) {
            return {
                X: 0,
                Y: 0,
                Height: 0
            };
        }
        var Result = this.Internal_Recalculate_CurPos(ContentPos, false, false, true);
        Result.Paragraph = this;
        Result.ContentPos = ContentPos;
        this.Internal_CorrectAnchorPos(Result, Drawing, CurPage);
        return Result;
    },
    Set_DocumentNext: function (Object) {
        var oldId = isRealObject(this.Next) ? this.Next.Get_Id() : null;
        var newId = isRealObject(Object) ? Object.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_Paragraph_DocNext, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldId, newId)));
        this.Next = Object;
    },
    Set_DocumentPrev: function (Object) {
        var oldId = isRealObject(this.Prev) ? this.Prev.Get_Id() : null;
        var newId = isRealObject(Object) ? Object.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_Paragraph_DocPrev, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldId, newId)));
        this.Prev = Object;
    },
    Get_DocumentNext: function () {
        return this.Next;
    },
    Get_DocumentPrev: function () {
        return this.Prev;
    },
    Set_DocumentIndex: function (Index) {
        this.Index = Index;
    },
    Set_Parent: function (ParentObject) {
        History.Add(this, {
            Type: historyitem_Paragraph_Parent,
            New: ParentObject,
            Old: this.Parent
        });
        this.Parent = ParentObject;
    },
    Get_Parent: function () {
        return this.Parent;
    },
    Is_ContentOnFirstPage: function () {
        if (this.Pages[0].EndLine < 0) {
            return false;
        }
        return true;
    },
    Get_CurrentPage_Absolute: function () {
        this.Internal_Recalculate_CurPos(this.CurPos.ContentPos, true, false, false);
        return (this.Get_StartPage_Absolute() + this.CurPos.PagesPos);
    },
    Get_CurrentPage_Relative: function () {
        this.Internal_Recalculate_CurPos(this.CurPos.ContentPos, true, false, false);
        return (this.PageNum + this.CurPos.PagesPos);
    },
    DocumentSearch: function (Str, ElementType) {
        var Pr = this.Get_CompiledPr();
        var StartPage = this.Get_StartPage_Absolute();
        var SearchResults = new Array();
        for (var Pos = 0; Pos < this.Content.length; Pos++) {
            var Item = this.Content[Pos];
            if (para_Numbering === Item.Type || para_PresentationNumbering === Item.Type || para_TextPr === Item.Type) {
                continue;
            }
            if ((" " === Str[0] && para_Space === Item.Type) || (para_Text === Item.Type && (Item.Value).toLowerCase() === Str[0].toLowerCase())) {
                if (1 === Str.length) {
                    SearchResults.push({
                        StartPos: Pos,
                        EndPos: Pos + 1
                    });
                } else {
                    var bFind = true;
                    var Pos2 = Pos + 1;
                    for (var Index = 1; Index < Str.length; Index++) {
                        while (Pos2 < this.Content.length && (para_TextPr === this.Content[Pos2].Type)) {
                            Pos2++;
                        }
                        if ((Pos2 >= this.Content.length) || (" " === Str[Index] && para_Space != this.Content[Pos2].Type) || (" " != Str[Index] && ((para_Text != this.Content[Pos2].Type) || (para_Text === this.Content[Pos2].Type && this.Content[Pos2].Value.toLowerCase() != Str[Index].toLowerCase())))) {
                            bFind = false;
                            break;
                        }
                        Pos2++;
                    }
                    if (true === bFind) {
                        SearchResults.push({
                            StartPos: Pos,
                            EndPos: Pos2
                        });
                    }
                }
            }
        }
        var MaxShowValue = 100;
        for (var FoundIndex = 0; FoundIndex < SearchResults.length; FoundIndex++) {
            var Rects = new Array();
            var StartPos = SearchResults[FoundIndex].StartPos;
            var EndPos = SearchResults[FoundIndex].EndPos;
            var StartParaPos = this.Internal_Get_ParaPos_By_Pos(StartPos);
            var CurLine = StartParaPos.Line;
            var CurRange = StartParaPos.Range;
            var PNum = StartParaPos.Page;
            var StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;
            var Pos, Item;
            for (Pos = this.Lines[CurLine].Ranges[CurRange].StartPos; Pos <= StartPos - 1; Pos++) {
                Item = this.Content[Pos];
                if (undefined != Item.WidthVisible && (para_Drawing != Item.Type || drawing_Inline === Item.DrawingType)) {
                    StartX += Item.WidthVisible;
                }
            }
            if (this.Pages[PNum].StartLine > CurLine) {
                CurLine = this.Pages[PNum].StartLine;
                CurRange = 0;
                StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                StartPos = this.Lines[this.Pages[PNum].StartLine].StartPos;
            }
            var StartY = (this.Pages[PNum].Y + this.Lines[CurLine].Y - this.Lines[CurLine].Metrics.Ascent);
            var EndY = (this.Pages[PNum].Y + this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent);
            if (this.Lines[CurLine].Metrics.LineGap < 0) {
                EndY += this.Lines[CurLine].Metrics.LineGap;
            }
            var W = 0;
            for (Pos = StartPos; Pos < EndPos; Pos++) {
                Item = this.Content[Pos];
                if (undefined != Item.CurPage) {
                    if (Item.CurPage > PNum) {
                        PNum = Item.CurPage;
                    }
                    if (CurLine < Item.CurLine) {
                        Rects.push({
                            PageNum: StartPage + PNum,
                            X: StartX,
                            Y: StartY,
                            W: W,
                            H: EndY - StartY
                        });
                        CurLine = Item.CurLine;
                        CurRange = Item.CurRange;
                        StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                        StartY = (this.Pages[PNum].Y + this.Lines[CurLine].Y - this.Lines[CurLine].Metrics.Ascent);
                        EndY = (this.Pages[PNum].Y + this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent);
                        if (this.Lines[CurLine].Metrics.LineGap < 0) {
                            EndY += this.Lines[CurLine].Metrics.LineGap;
                        }
                        W = 0;
                    } else {
                        if (CurRange < Item.CurRange) {
                            Rects.push({
                                PageNum: StartPage + PNum,
                                X: StartX,
                                Y: StartY,
                                W: W,
                                H: EndY - StartY
                            });
                            CurRange = Item.CurRange;
                            StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                            W = 0;
                        }
                    }
                }
                if (undefined != Item.WidthVisible) {
                    W += Item.WidthVisible;
                }
                if (Pos == EndPos - 1) {
                    Rects.push({
                        PageNum: StartPage + PNum,
                        X: StartX,
                        Y: StartY,
                        W: W,
                        H: EndY - StartY
                    });
                }
            }
            var ResultStr = new String();
            var _Str = "";
            for (var Pos = StartPos; Pos < EndPos; Pos++) {
                Item = this.Content[Pos];
                if (para_Text === Item.Type) {
                    _Str += Item.Value;
                } else {
                    if (para_Space === Item.Type) {
                        _Str += " ";
                    }
                }
            }
            if (_Str.length >= MaxShowValue) {
                ResultStr = "<b>";
                for (var Index = 0; Index < MaxShowValue - 1; Index++) {
                    ResultStr += _Str[Index];
                }
                ResultStr += "</b>...";
            } else {
                ResultStr = "<b>" + _Str + "</b>";
                var Pos_before = StartPos - 1;
                var Pos_after = EndPos;
                var LeaveCount = MaxShowValue - _Str.length;
                var bAfter = true;
                while (LeaveCount > 0 && (Pos_before >= 0 || Pos_after < this.Content.length)) {
                    var TempPos = (true === bAfter ? Pos_after : Pos_before);
                    var Flag = 0;
                    while (((TempPos >= 0 && false === bAfter) || (TempPos < this.Content.length && true === bAfter)) && para_Text != this.Content[TempPos].Type && para_Space != this.Content[TempPos].Type) {
                        if (true === bAfter) {
                            TempPos++;
                            if (TempPos >= this.Content.length) {
                                TempPos = Pos_before;
                                bAfter = false;
                                Flag++;
                            }
                        } else {
                            TempPos--;
                            if (TempPos < 0) {
                                TempPos = Pos_after;
                                bAfter = true;
                                Flag++;
                            }
                        }
                        if (Flag >= 2) {
                            break;
                        }
                    }
                    if (Flag >= 2 || !((TempPos >= 0 && false === bAfter) || (TempPos < this.Content.length && true === bAfter))) {
                        break;
                    }
                    if (true === bAfter) {
                        ResultStr += (para_Space === this.Content[TempPos].Type ? " " : this.Content[TempPos].Value);
                        Pos_after = TempPos + 1;
                        LeaveCount--;
                        if (Pos_before >= 0) {
                            bAfter = false;
                        }
                        if (Pos_after >= this.Content.length) {
                            bAfter = false;
                        }
                    } else {
                        ResultStr = (para_Space === this.Content[TempPos].Type ? " " : this.Content[TempPos].Value) + ResultStr;
                        Pos_before = TempPos - 1;
                        LeaveCount--;
                        if (Pos_after < this.Content.length) {
                            bAfter = true;
                        }
                        if (Pos_before < 0) {
                            bAfter = true;
                        }
                    }
                }
            }
            this.DrawingDocument.AddPageSearch(ResultStr, Rects, ElementType);
        }
    },
    DocumentStatistics: function (Stats) {
        var bEmptyParagraph = true;
        var bWord = false;
        for (var Index = 0; Index < this.Content.length; Index++) {
            var Item = this.Content[Index];
            var bSymbol = false;
            var bSpace = false;
            var bNewWord = false;
            if ((para_Text === Item.Type && false === Item.Is_NBSP()) || (para_PageNum === Item.Type)) {
                if (false === bWord) {
                    bNewWord = true;
                }
                bWord = true;
                bSymbol = true;
                bSpace = false;
                bEmptyParagraph = false;
            } else {
                if ((para_Text === Item.Type && true === Item.Is_NBSP()) || para_Space === Item.Type || para_Tab === Item.Type) {
                    bWord = false;
                    bSymbol = true;
                    bSpace = true;
                }
            }
            if (true === bSymbol) {
                Stats.Add_Symbol(bSpace);
            }
            if (true === bNewWord) {
                Stats.Add_Word();
            }
        }
        var NumPr = this.Numbering_Get();
        if (undefined != NumPr) {
            bEmptyParagraph = false;
            this.Parent.Get_Numbering().Get_AbstractNum(NumPr.NumId).DocumentStatistics(NumPr.Lvl, Stats);
        }
        if (false === bEmptyParagraph) {
            Stats.Add_Paragraph();
        }
    },
    TurnOff_RecalcEvent: function () {
        this.TurnOffRecalcEvent = true;
    },
    TurnOn_RecalcEvent: function () {
        this.TurnOffRecalcEvent = false;
    },
    Set_ApplyToAll: function (bValue) {
        this.ApplyToAll = bValue;
    },
    Get_ApplyToAll: function () {
        return this.ApplyToAll;
    },
    Update_CursorType: function (X, Y, PageIndex) {
        var text_transform = null;
        var cur_parent = this.Parent;
        if (this.Parent.Is_TableCellContent()) {
            while (isRealObject(cur_parent) && cur_parent.Is_TableCellContent()) {
                cur_parent = cur_parent.Parent.Row.Table.Parent;
            }
        }
        if (cur_parent.Parent instanceof WordShape) {
            if (isRealObject(cur_parent.Parent.transformText)) {
                text_transform = cur_parent.Parent.transformText;
            }
        }
        var MMData = new CMouseMoveData();
        var Coords = this.DrawingDocument.ConvertCoordsToCursorWR(X, Y, this.Get_StartPage_Absolute() + (PageIndex - this.PageNum), text_transform);
        MMData.X_abs = Coords.X;
        MMData.Y_abs = Coords.Y;
        var Hyperlink = this.Check_Hyperlink(X, Y, PageIndex);
        var PNum = PageIndex - this.PageNum;
        if (null != Hyperlink && (PNum >= 0 && PNum < this.Pages.length && Y <= this.Pages[PNum].Bounds.Bottom && Y >= this.Pages[PNum].Bounds.Top)) {
            MMData.Type = c_oAscMouseMoveDataTypes.Hyperlink;
            MMData.Hyperlink = new CHyperlinkProperty(Hyperlink);
        } else {
            MMData.Type = c_oAscMouseMoveDataTypes.Common;
        }
        if (null != Hyperlink && true === global_keyboardEvent.CtrlKey) {
            this.DrawingDocument.SetCursorType("pointer", MMData);
        } else {
            this.DrawingDocument.SetCursorType("default", MMData);
        }
        if (true === this.Lock.Is_Locked()) {
            var PNum = Math.max(0, Math.min(PageIndex - this.PageNum, this.Pages.length - 1));
            var _X = this.Pages[PNum].X;
            var _Y = this.Pages[PNum].Y;
            var MMData = new CMouseMoveData();
            var Coords = this.DrawingDocument.ConvertCoordsToCursorWR(_X, _Y, this.Get_StartPage_Absolute() + (PageIndex - this.PageNum), text_transform);
            MMData.X_abs = Coords.X - 5;
            MMData.Y_abs = Coords.Y;
            MMData.Type = c_oAscMouseMoveDataTypes.LockedObject;
            MMData.UserId = this.Lock.Get_UserId();
            MMData.HaveChanges = this.Lock.Have_Changes();
            MMData.LockedObjectType = c_oAscMouseMoveLockedObjectType.Common;
            editor.sync_MouseMoveCallback(MMData);
        }
    },
    Document_CreateFontMap: function (FontMap) {
        if (true === this.FontMap.NeedRecalc) {
            this.FontMap.Map = new Object();
            if (true === this.CompiledPr.NeedRecalc) {
                this.CompiledPr.Pr = this.Internal_CompileParaPr();
                this.CompiledPr.NeedRecalc = false;
            }
            var CurTextPr = this.CompiledPr.Pr.TextPr.Copy();
            CurTextPr.Document_CreateFontMap(this.FontMap.Map);
            CurTextPr.Merge(this.TextPr.Value);
            CurTextPr.Document_CreateFontMap(this.FontMap.Map);
            for (var Index = 0; Index < this.Content.length; Index++) {
                var Item = this.Content[Index];
                if (para_TextPr === Item.Type) {
                    CurTextPr = this.CompiledPr.Pr.TextPr.Copy();
                    var _CurTextPr = Item.Value;
                    if (undefined != _CurTextPr.RStyle) {
                        var Styles = this.Parent.Get_Styles();
                        var StyleTextPr = Styles.Get_Pr(_CurTextPr.RStyle, styletype_Character).TextPr;
                        CurTextPr.Merge(StyleTextPr);
                    }
                    CurTextPr.Merge(_CurTextPr);
                    CurTextPr.Document_CreateFontMap(this.FontMap.Map);
                }
            }
            this.FontMap.NeedRecalc = false;
        }
        for (Key in this.FontMap.Map) {
            FontMap[Key] = this.FontMap.Map[Key];
        }
    },
    Document_CreateFontCharMap: function (FontCharMap) {
        if (true === this.CompiledPr.NeedRecalc) {
            this.CompiledPr.Pr = this.Internal_CompileParaPr();
            this.CompiledPr.NeedRecalc = false;
        }
        var CurTextPr = this.CompiledPr.Pr.TextPr.Copy();
        FontCharMap.StartFont(CurTextPr.FontFamily.Name, CurTextPr.Bold, CurTextPr.Italic, CurTextPr.FontSize);
        for (var Index = 0; Index < this.Content.length; Index++) {
            var Item = this.Content[Index];
            if (para_TextPr === Item.Type) {
                CurTextPr = this.CompiledPr.Pr.TextPr.Copy();
                var _CurTextPr = Item.Value;
                if (undefined != _CurTextPr.RStyle) {
                    var Styles = this.Parent.Get_Styles();
                    var StyleTextPr = Styles.Get_Pr(_CurTextPr.RStyle, styletype_Character).TextPr;
                    CurTextPr.Merge(StyleTextPr);
                }
                CurTextPr.Merge(_CurTextPr);
                FontCharMap.StartFont(CurTextPr.FontFamily.Name, CurTextPr.Bold, CurTextPr.Italic, CurTextPr.FontSize);
            } else {
                if (para_Text === Item.Type) {
                    FontCharMap.AddChar(Item.Value);
                } else {
                    if (para_Space === Item.Type) {
                        FontCharMap.AddChar(" ");
                    } else {
                        if (para_Numbering === Item.Type) {
                            var ParaPr = this.CompiledPr.Pr.ParaPr;
                            var NumPr = ParaPr.NumPr;
                            if (undefined === NumPr || undefined === NumPr.NumId || 0 === NumPr.NumId) {
                                continue;
                            }
                            var Numbering = this.Parent.Get_Numbering();
                            var NumInfo = this.Parent.Internal_GetNumInfo(this.Id, NumPr);
                            var NumTextPr = this.CompiledPr.Pr.TextPr.Copy();
                            NumTextPr.Merge(this.TextPr.Value);
                            NumTextPr.Merge(NumLvl.TextPr);
                            Numbering.Document_CreateFontCharMap(FontCharMap, NumTextPr, NumPr, NumInfo);
                            FontCharMap.StartFont(CurTextPr.FontFamily.Name, CurTextPr.Bold, CurTextPr.Italic, CurTextPr.FontSize);
                        } else {
                            if (para_PageNum === Item.Type) {
                                Item.Document_CreateFontCharMap(FontCharMap);
                            }
                        }
                    }
                }
            }
        }
        CurTextPr.Merge(this.TextPr.Value);
    },
    Document_Get_AllFontNames: function (AllFonts) {
        this.TextPr.Value.Document_Get_AllFontNames(AllFonts);
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            var Item = this.Content[Index];
            if (para_TextPr === Item.Type) {
                Item.Value.Document_Get_AllFontNames(AllFonts);
            } else {
                if (para_Drawing === Item.Type) {
                    Item.documentGetAllFontNames(AllFonts);
                }
            }
        }
    },
    Document_UpdateInterfaceState: function () {
        if (true === this.Selection.Use) {
            var StartPos = this.Selection.StartPos;
            var EndPos = this.Selection.EndPos;
            if (StartPos > EndPos) {
                StartPos = this.Selection.EndPos;
                EndPos = this.Selection.StartPos;
            }
            var Hyper_start = this.Check_Hyperlink2(this.Selection.StartPos);
            var Hyper_end = this.Check_Hyperlink2(this.Selection.EndPos);
            if (Hyper_start === Hyper_end && null != Hyper_start) {
                var Find = this.Internal_FindBackward(this.Selection.StartPos, [para_HyperlinkStart]);
                if (true != Find.Found) {
                    return;
                }
                var Str = "";
                for (var Pos = Find.LetterPos + 1; Pos < this.Content.length; Pos++) {
                    var Item = this.Content[Pos];
                    var bBreak = false;
                    switch (Item.Type) {
                    case para_Drawing:
                        case para_End:
                        case para_Numbering:
                        case para_PresentationNumbering:
                        case para_PageNum:
                        Str = null;
                        bBreak = true;
                        break;
                    case para_Text:
                        Str += Item.Value;
                        break;
                    case para_Space:
                        case para_Tab:
                        Str += " ";
                        break;
                    case para_HyperlinkEnd:
                        bBreak = true;
                        break;
                    case para_HyperlinkStart:
                        return;
                    }
                    if (true === bBreak) {
                        break;
                    }
                }
                var HyperProps = new CHyperlinkProperty(Hyper_start);
                HyperProps.put_Text(Str);
                editor.sync_HyperlinkPropCallback(HyperProps);
            }
        } else {
            var Hyper_cur = this.Check_Hyperlink2(this.CurPos.ContentPos, false);
            if (null != Hyper_cur) {
                var Find = this.Internal_FindBackward(this.CurPos.ContentPos, [para_HyperlinkStart]);
                if (true != Find.Found) {
                    return;
                }
                var Str = "";
                for (var Pos = Find.LetterPos + 1; Pos < this.Content.length; Pos++) {
                    var Item = this.Content[Pos];
                    var bBreak = false;
                    switch (Item.Type) {
                    case para_Drawing:
                        case para_End:
                        case para_Numbering:
                        case para_PresentationNumbering:
                        case para_PageNum:
                        Str = null;
                        bBreak = true;
                        break;
                    case para_Text:
                        Str += Item.Value;
                        break;
                    case para_Space:
                        case para_Tab:
                        Str += " ";
                        break;
                    case para_HyperlinkEnd:
                        bBreak = true;
                        break;
                    case para_HyperlinkStart:
                        return;
                    }
                    if (true === bBreak) {
                        break;
                    }
                }
                var HyperProps = new CHyperlinkProperty(Hyper_cur);
                HyperProps.put_Text(Str);
                editor.sync_HyperlinkPropCallback(HyperProps);
            }
        }
    },
    PreDelete: function () {
        for (var Index = 0; Index < this.Content.length; Index++) {
            var Item = this.Content[Index];
            if (para_CommentEnd === Item.Type || para_CommentStart === Item.Type) {
                editor.WordControl.m_oLogicDocument.Remove_Comment(Item.Id, true);
            }
        }
    },
    Get_StartPage_Absolute: function () {
        return this.Parent.Get_StartPage_Absolute() + this.Get_StartPage_Relative();
    },
    Get_StartPage_Relative: function () {
        return this.PageNum;
    },
    Document_SetThisElementCurrent: function () {
        this.Parent.Set_CurrentElement(this.Index);
    },
    Is_ThisElementCurrent: function () {
        var Parent = this.Parent;
        if (docpostype_Content === Parent.CurPos.Type && false === Parent.Selection.Use && this.Index === Parent.CurPos.ContentPos) {
            return this.Parent.Is_ThisElementCurrent();
        }
        return false;
    },
    Split: function (NewParagraph, Pos) {
        if ("undefined" === typeof(Pos) || null === Pos) {
            Pos = this.CurPos.ContentPos;
        }
        var Hyperlink = this.Check_Hyperlink2(Pos, false);
        var TextPr = this.Internal_CalculateTextPr(Pos);
        NewParagraph.DeleteCommentOnRemove = false;
        NewParagraph.Internal_Content_Remove2(0, NewParagraph.Content.length);
        NewParagraph.Internal_Content_Concat(this.Content.slice(Pos));
        NewParagraph.Internal_Content_Add(0, new ParaTextPr(TextPr));
        NewParagraph.Internal_Content_Add(0, new ParaNumbering());
        NewParagraph.DeleteCommentOnRemove = true;
        NewParagraph.TextPr.Value = this.TextPr.Value.Copy();
        if (null != Hyperlink) {
            NewParagraph.Internal_Content_Add(1, Hyperlink.Copy());
        }
        this.DeleteCommentOnRemove = false;
        this.Internal_Content_Remove2(Pos, this.Content.length - Pos);
        this.DeleteCommentOnRemove = true;
        if (null != Hyperlink) {
            this.Internal_Content_Add(this.Content.length, new ParaHyperlinkEnd());
            this.Internal_Content_Add(this.Content.length, new ParaTextPr());
        }
        this.Internal_Content_Add(this.Content.length, new ParaEnd());
        this.Internal_Content_Add(this.Content.length, new ParaEmpty());
        this.CopyPr(NewParagraph);
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
        NewParagraph.RecalcInfo.Set_Type_0(pararecalc_0_All);
    },
    Concat: function (Para) {
        this.DeleteCommentOnRemove = false;
        this.Internal_Content_Remove2(this.Content.length - 2, 2);
        this.DeleteCommentOnRemove = true;
        Para.Numbering_Remove();
        Para.Remove_PresentationNumbering();
        if (Para.Content.length > 0 && para_Numbering === Para.Content[0].Type) {
            Para.Internal_Content_Remove(0);
        }
        this.Internal_Content_Concat(Para.Content);
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
    },
    Continue: function (NewParagraph) {
        this.CopyPr(NewParagraph);
        var TextPr = this.Internal_CalculateTextPr(this.Internal_GetEndPos());
        NewParagraph.Internal_Content_Add(0, new ParaTextPr(TextPr));
        NewParagraph.TextPr.Value = this.TextPr.Value.Copy();
    },
    Undo: function (Type, Data) {
        switch (Type) {
        case historyitem_AutoShapes_AddDrawingDocument:
            if (Data.oldValue !== null) {
                var api = window["Asc"]["editor"];
                if (api.wb) {
                    var ws = api.wb.getWorksheetById(Data.oldValue);
                    this.DrawingDocument = ws.objectRender.drawingDocument;
                }
            } else {
                this.DrawingDocument = null;
            }
            break;
        case historyitem_AutoShapes_AddParent:
            this.Parent = g_oTableId.Get_ById(Data.oldValue);
            break;
        case historyitem_AutoShapes_SetTextPr:
            if (typeof Data.oldValue === "string") {
                var value = Data.oldValue;
                var r = CreateBinaryReader(value, 0, value.length);
                var text_pr = new CTextPr();
                text_pr.Read_FromBinary(r);
                this.TextPr = new ParaTextPr(text_pr);
            } else {
                this.TextPr = null;
            }
            break;
        case historyitem_Paragraph_AddItem:
            var StartPos = this.Internal_Get_RealPos(Data.startPos);
            var EndPos = this.Internal_Get_RealPos(Data.endPos);
            this.Content.splice(StartPos, EndPos - StartPos + 1);
            break;
        case historyitem_Paragraph_RemoveItem:
            var Pos = this.Internal_Get_RealPos(Data.startPos);
            var Array_start = this.Content.slice(0, Pos);
            var Array_end = this.Content.slice(Pos);
            var items = [];
            for (var i = 0; i < Data.itemsIds.length; ++i) {
                items.push(CreateParaItem(Data.itemsIds[i].type, Data.itemsIds[i].value));
            }
            this.Content = Array_start.concat(items, Array_end);
            break;
        case historyitem_Paragraph_Numbering:
            var Old = Data.Old;
            if (undefined != Old) {
                this.Pr.NumPr = Old;
            } else {
                this.Pr.NumPr = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Align:
            this.Pr.Jc = Data.oldValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Ind_First:
            if (undefined === this.Pr.Ind) {
                this.Pr.Ind = new CParaSpacing();
            }
            this.Pr.Ind.FirstLine = Data.oldValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Ind_Left:
            if (undefined === this.Pr.Ind) {
                this.Pr.Ind = new CParaSpacing();
            }
            this.Pr.Ind.Left = Data.oldValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Ind_Right:
            if (undefined === this.Pr.Ind) {
                this.Pr.Ind = new CParaSpacing();
            }
            this.Pr.Ind.Right = Data.oldValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_ContextualSpacing:
            this.Pr.ContextualSpacing = Data.oldValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_KeepLines:
            this.Pr.KeepLines = Data.oldValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_KeepNext:
            this.Pr.KeepNext = Data.oldValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_PageBreakBefore:
            this.Pr.PageBreakBefore = Data.oldValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_Line:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.Line = Data.oldValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_LineRule:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.LineRule = Data.oldValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_Before:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.Before = Data.oldValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_After:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.After = Data.oldValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_AfterAutoSpacing:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.AfterAutoSpacing = Data.oldValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_BeforeAutoSpacing:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.BeforeAutoSpacing = Data.oldValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Shd_Value:
            if (undefined != Data.Old && undefined === this.Pr.Shd) {
                this.Pr.Shd = new CDocumentShd();
            }
            if (undefined != Data.Old) {
                this.Pr.Shd.Value = Data.oldValue;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Shd_Color:
            if (undefined != Data.Old && undefined === this.Pr.Shd) {
                this.Pr.Shd = new CDocumentShd();
            }
            if (undefined != Data.Old) {
                this.Pr.Shd.Color = Data.oldValue;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_WidowControl:
            this.Pr.WidowControl = Data.oldValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Tabs:
            this.Pr.Tabs = Data.oldValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_PStyle:
            var Old = Data.oldValue;
            if (undefined != Old) {
                this.Pr.PStyle = Old;
            } else {
                this.Pr.PStyle = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_DocNext:
            this.Next = g_oTableId.Get_ById(Data.oldValue);
            break;
        case historyitem_Paragraph_DocPrev:
            this.Prev = g_oTableId.Get_ById(Data.oldValue);
            break;
        case historyitem_Paragraph_Parent:
            this.Parent = Data.Old;
            break;
        case historyitem_Paragraph_Borders_Between:
            this.Pr.Brd.Between = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Bottom:
            this.Pr.Brd.Bottom = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Left:
            this.Pr.Brd.Left = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Right:
            this.Pr.Brd.Right = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Top:
            this.Pr.Brd.Top = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Pr:
            var Old = Data.Old;
            if (undefined != Old) {
                this.Pr = new CParaPr();
                this.Pr.fromObject(Data.oldValue);
            } else {
                this.Pr = new CParaPr();
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_PresentationPr_Bullet:
            this.PresentationPr.Bullet = Data.Old;
            break;
        case historyitem_Paragraph_PresentationPr_Level:
            this.PresentationPr.Level = Data.Old;
            break;
        }
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
        this.RecalcInfo.Set_Type_0_Spell(pararecalc_0_Spell_All);
    },
    Redo: function (Type, Data) {
        switch (Type) {
        case historyitem_Paragraph_Recalculate_Text_Pr:
            var theme = this.Parent.getTheme();
            var color_map = this.Parent.getColorMap();
            for (var i = 0; i < this.Content.length; ++i) {
                if (this.Content[i].Type === para_TextPr && isRealObject(this.Content[i].Value)) {
                    var TextPr = this.Content[i].Value;
                    if (isRealObject(TextPr.unifill) && isRealObject(TextPr.unifill.fill)) {
                        TextPr.unifill.calculate(theme, color_map, {
                            R: 0,
                            G: 0,
                            B: 0,
                            A: 255
                        });
                        if (isRealObject(TextPr.unifill.fill.color)) {
                            var color = TextPr.unifill.fill.color.RGBA;
                            TextPr.Color = new CDocumentColor(color.R, color.G, color.B);
                        } else {
                            if (Array.isArray(TextPr.unifill.fill.colors) && isRealObject(TextPr.unifill.fill.colors[0])) {
                                var color = TextPr.unifill.fill.colors[0].RGBA;
                                TextPr.Color = new CDocumentColor(color.R, color.G, color.B);
                            }
                        }
                    }
                    if (typeof TextPr.themeFont === "string") {
                        var font_name = getFontInfo(TextPr.themeFont)(theme.themeElements.fontScheme);
                        TextPr.FontFamily = {
                            Name: font_name,
                            Index: -1
                        };
                    }
                }
            }
            break;
        case historyitem_AutoShapes_AddDrawingDocument:
            if (Data.newValue !== null) {
                var api = window["Asc"]["editor"];
                if (api.wb) {
                    var ws = api.wb.getWorksheetById(Data.newValue);
                    this.DrawingDocument = ws.objectRender.drawingDocument;
                }
            } else {
                this.DrawingDocument = null;
            }
            break;
        case historyitem_AutoShapes_AddParent:
            this.Parent = g_oTableId.Get_ById(Data.newValue);
            break;
        case historyitem_AutoShapes_SetTextPr:
            if (typeof Data.newValue === "string") {
                var value = Data.newValue;
                var r = CreateBinaryReader(value, 0, value.length);
                var text_pr = new CTextPr();
                text_pr.Read_FromBinary(r);
                this.TextPr = new ParaTextPr(text_pr);
            } else {
                this.TextPr = null;
            }
            break;
        case historyitem_Paragraph_AddItem:
            var Pos = this.Internal_Get_RealPos(Data.startPos);
            var Array_start = this.Content.slice(0, Pos);
            var Array_end = this.Content.slice(Pos);
            var items = [];
            for (var i = 0; i < Data.itemsIds.length; ++i) {
                items.push(CreateParaItem(Data.itemsIds[i].type, Data.itemsIds[i].value));
            }
            this.Content = Array_start.concat(items, Array_end);
            break;
        case historyitem_Paragraph_RemoveItem:
            var StartPos = this.Internal_Get_RealPos(Data.startPos);
            var EndPos = this.Internal_Get_RealPos(Data.endPos);
            this.Content.splice(StartPos, EndPos - StartPos + 1);
            break;
        case historyitem_Paragraph_Numbering:
            var New = Data.New;
            if (undefined != New) {
                this.Pr.NumPr = New;
            } else {
                this.Pr.NumPr = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Align:
            this.Pr.Jc = Data.newValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Ind_First:
            if (undefined === this.Pr.Ind) {
                this.Pr.Ind = new CParaInd();
            }
            this.Pr.Ind.FirstLine = Data.newValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Ind_Left:
            if (undefined === this.Pr.Ind) {
                this.Pr.Ind = new CParaInd();
            }
            this.Pr.Ind.Left = Data.newValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Ind_Right:
            if (undefined === this.Pr.Ind) {
                this.Pr.Ind = new CParaInd();
            }
            this.Pr.Ind.Right = Data.newValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_ContextualSpacing:
            this.Pr.ContextualSpacing = Data.newValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_KeepLines:
            this.Pr.KeepLines = Data.newValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_KeepNext:
            this.Pr.KeepNext = Data.newValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_PageBreakBefore:
            this.Pr.PageBreakBefore = Data.newValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_Line:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.Line = Data.newValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_LineRule:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.LineRule = Data.newValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_Before:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.Before = Data.newValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_After:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.After = Data.newValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_AfterAutoSpacing:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.AfterAutoSpacing = Data.newValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_BeforeAutoSpacing:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.BeforeAutoSpacing = Data.newValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Shd_Value:
            if (undefined != Data.newValue && undefined === this.Pr.Shd) {
                this.Pr.Shd = new CDocumentShd();
            }
            if (undefined != Data.newValue) {
                this.Pr.Shd.Value = Data.newValue;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Shd_Color:
            if (undefined != Data.newValue && undefined === this.Pr.Shd) {
                this.Pr.Shd = new CDocumentShd();
            }
            if (undefined != Data.newValue) {
                this.Pr.Shd.Color = Data.newValue;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_WidowControl:
            this.Pr.WidowControl = Data.newValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Tabs:
            this.Pr.Tabs = Data.newValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_PStyle:
            var New = Data.New;
            if (undefined != New) {
                this.Pr.PStyle = New;
            } else {
                this.Pr.PStyle = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_DocNext:
            this.Next = g_oTableId.Get_ById(Data.newValue);
            break;
        case historyitem_Paragraph_DocPrev:
            this.Prev = g_oTableId.Get_ById(Data.newValue);
            break;
        case historyitem_Paragraph_Parent:
            this.Parent = Data.newValue;
            break;
        case historyitem_Paragraph_Borders_Between:
            this.Pr.Brd.Between = Data.newValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Bottom:
            this.Pr.Brd.Bottom = Data.newValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Left:
            this.Pr.Brd.Left = Data.newValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Right:
            this.Pr.Brd.Right = Data.newValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Top:
            this.Pr.Brd.Top = Data.newValue;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Pr:
            var New = Data.newValue;
            if (undefined != New) {
                this.Pr = new CParaPr();
                this.Pr.fromObject(Data.newValue);
            } else {
                this.Pr = new CParaPr();
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_PresentationPr_Bullet:
            this.PresentationPr.Bullet = Data.newValue;
            break;
        case historyitem_Paragraph_PresentationPr_Level:
            this.PresentationPr.Level = Data.newValue;
            break;
        }
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
        this.RecalcInfo.Set_Type_0_Spell(pararecalc_0_Spell_All);
    },
    Get_SelectionState: function () {
        var ParaState = new Object();
        ParaState.CurPos = {
            X: this.CurPos.X,
            Y: this.CurPos.Y,
            Line: this.CurPos.Line,
            ContentPos: this.Internal_Get_ClearPos(this.CurPos.ContentPos),
            RealX: this.CurPos.RealX,
            RealY: this.CurPos.RealY,
            PagesPos: this.CurPos.PagesPos
        };
        ParaState.Selection = {
            Start: this.Selection.Start,
            Use: this.Selection.Use,
            StartPos: this.Internal_Get_ClearPos(this.Selection.StartPos),
            EndPos: this.Internal_Get_ClearPos(this.Selection.EndPos),
            Flag: this.Selection.Flag
        };
        return [ParaState];
    },
    Set_SelectionState: function (State, StateIndex) {
        if (State.length <= 0) {
            return;
        }
        var ParaState = State[StateIndex];
        this.CurPos = {
            X: ParaState.CurPos.X,
            Y: ParaState.CurPos.Y,
            Line: ParaState.CurPos.Line,
            ContentPos: this.Internal_Get_RealPos(ParaState.CurPos.ContentPos),
            RealX: ParaState.CurPos.RealX,
            RealY: ParaState.CurPos.RealY,
            PagesPos: ParaState.CurPos.PagesPos
        };
        this.Selection = {
            Start: ParaState.Selection.Start,
            Use: ParaState.Selection.Use,
            StartPos: this.Internal_Get_RealPos(ParaState.Selection.StartPos),
            EndPos: this.Internal_Get_RealPos(ParaState.Selection.EndPos),
            Flag: ParaState.Selection.Flag
        };
        var CursorPos_max = this.Internal_GetEndPos();
        var CursorPos_min = this.Internal_GetStartPos();
        this.CurPos.ContentPos = Math.max(CursorPos_min, Math.min(CursorPos_max, this.CurPos.ContentPos));
        this.Selection.StartPos = Math.max(CursorPos_min, Math.min(CursorPos_max, this.Selection.StartPos));
        this.Selection.EndPos = Math.max(CursorPos_min, Math.min(CursorPos_max, this.Selection.EndPos));
    },
    Get_ParentObject_or_DocumentPos: function () {
        return this.Parent.Get_ParentObject_or_DocumentPos(this.Index);
    },
    Refresh_RecalcData: function (Type, Data) {
        var bNeedRecalc = false;
        var CurPage = 0;
        switch (Type) {
        case historyitem_Paragraph_AddItem:
            case historyitem_Paragraph_RemoveItem:
            for (CurPage = this.Pages.length - 1; CurPage > 0; CurPage--) {
                if (Data.Pos > this.Lines[this.Pages[CurPage].StartLine].StartPos) {
                    break;
                }
            }
            this.RecalcInfo.Set_Type_0(pararecalc_0_All);
            bNeedRecalc = true;
            break;
        case historyitem_Paragraph_Numbering:
            case historyitem_Paragraph_PStyle:
            case historyitem_Paragraph_Pr:
            case historyitem_Paragraph_PresentationPr_Bullet:
            case historyitem_Paragraph_PresentationPr_Level:
            this.RecalcInfo.Set_Type_0(pararecalc_0_All);
            bNeedRecalc = true;
            break;
        case historyitem_Paragraph_Align:
            case historyitem_Paragraph_Ind_First:
            case historyitem_Paragraph_Ind_Left:
            case historyitem_Paragraph_Ind_Right:
            case historyitem_Paragraph_ContextualSpacing:
            case historyitem_Paragraph_KeepLines:
            case historyitem_Paragraph_KeepNext:
            case historyitem_Paragraph_PageBreakBefore:
            case historyitem_Paragraph_Spacing_Line:
            case historyitem_Paragraph_Spacing_LineRule:
            case historyitem_Paragraph_Spacing_Before:
            case historyitem_Paragraph_Spacing_After:
            case historyitem_Paragraph_Spacing_AfterAutoSpacing:
            case historyitem_Paragraph_Spacing_BeforeAutoSpacing:
            case historyitem_Paragraph_WidowControl:
            case historyitem_Paragraph_Tabs:
            case historyitem_Paragraph_Parent:
            case historyitem_Paragraph_Borders_Between:
            case historyitem_Paragraph_Borders_Bottom:
            case historyitem_Paragraph_Borders_Left:
            case historyitem_Paragraph_Borders_Right:
            case historyitem_Paragraph_Borders_Top:
            bNeedRecalc = true;
            break;
        case historyitem_Paragraph_Shd_Value:
            case historyitem_Paragraph_Shd_Color:
            case historyitem_Paragraph_DocNext:
            case historyitem_Paragraph_DocPrev:
            break;
        }
        if (true === bNeedRecalc) {
            return this.Refresh_RecalcData2(CurPage);
        }
    },
    Refresh_RecalcData2: function (CurPage) {
        if (undefined === CurPage) {
            CurPage = 0;
        }
        if (this.Index >= 0 && isRealObject(this.Parent)) {
            this.Parent.Refresh_RecalcData2(this.Index, this.PageNum + CurPage);
        }
    },
    Check_HistoryUninon: function (Data1, Data2) {
        var Type1 = Data1.Type;
        var Type2 = Data2.Type;
        if (historyitem_Paragraph_AddItem === Type1 && historyitem_Paragraph_AddItem === Type2) {
            if (1 === Data1.Items.length && 1 === Data2.Items.length && Data1.Pos === Data2.Pos - 1 && para_Text === Data1.Items[0].Type && para_Text === Data2.Items[0].Type) {
                return true;
            }
        }
        return false;
    },
    Document_Is_SelectionLocked: function (CheckType) {
        switch (CheckType) {
        case changestype_Paragraph_Content:
            case changestype_Paragraph_Properties:
            case changestype_Document_Content:
            case changestype_Document_Content_Add:
            case changestype_Image_Properties:
            this.Lock.Check(this.Get_Id());
            break;
        case changestype_Remove:
            if (true != this.Selection.Use && true == this.Cursor_IsStart()) {
                var Pr = this.Get_CompiledPr2(false).ParaPr;
                if (undefined != this.Numbering_Get() || Math.abs(Pr.Ind.FirstLine) > 0.001 || Math.abs(Pr.Ind.Left) > 0.001) {} else {
                    var Prev = this.Get_DocumentPrev();
                    if (null != Prev && type_Paragraph === Prev.GetType()) {
                        Prev.Lock.Check(Prev.Get_Id());
                    }
                }
            } else {
                if (true === this.Selection.Use) {
                    var StartPos = this.Selection.StartPos;
                    var EndPos = this.Selection.EndPos;
                    if (StartPos > EndPos) {
                        var Temp = EndPos;
                        EndPos = StartPos;
                        StartPos = Temp;
                    }
                    if (EndPos >= this.Content.length - 1 && StartPos > this.Internal_GetStartPos()) {
                        var Next = this.Get_DocumentNext();
                        if (null != Next && type_Paragraph === Next.GetType()) {
                            Next.Lock.Check(Next.Get_Id());
                        }
                    }
                }
            }
            this.Lock.Check(this.Get_Id());
            break;
        case changestype_Delete:
            if (true != this.Selection.Use && true === this.Cursor_IsEnd()) {
                var Next = this.Get_DocumentNext();
                if (null != Next && type_Paragraph === Next.GetType()) {
                    Next.Lock.Check(Next.Get_Id());
                }
            } else {
                if (true === this.Selection.Use) {
                    var StartPos = this.Selection.StartPos;
                    var EndPos = this.Selection.EndPos;
                    if (StartPos > EndPos) {
                        var Temp = EndPos;
                        EndPos = StartPos;
                        StartPos = Temp;
                    }
                    if (EndPos >= this.Content.length - 1 && StartPos > this.Internal_GetStartPos()) {
                        var Next = this.Get_DocumentNext();
                        if (null != Next && type_Paragraph === Next.GetType()) {
                            Next.Lock.Check(Next.Get_Id());
                        }
                    }
                }
            }
            this.Lock.Check(this.Get_Id());
            break;
        case changestype_Document_SectPr:
            case changestype_Table_Properties:
            case changestype_Table_RemoveCells:
            case changestype_HdrFtr:
            CollaborativeEditing.Add_CheckLock(true);
            break;
        }
    },
    Save_Changes: function (Data, Writer) {
        Writer.WriteLong(historyitem_type_Paragraph);
        var Type = Data.Type;
        Writer.WriteLong(Type);
        switch (Type) {
        case historyitem_Paragraph_AddItem:
            var bArray = Data.UseArray;
            var Count = Data.Items.length;
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
        case historyitem_Paragraph_RemoveItem:
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
        case historyitem_Paragraph_Numbering:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Data.New.Write_ToBinary(Writer);
            }
            break;
        case historyitem_Paragraph_Ind_First:
            case historyitem_Paragraph_Ind_Left:
            case historyitem_Paragraph_Ind_Right:
            case historyitem_Paragraph_Spacing_Line:
            case historyitem_Paragraph_Spacing_Before:
            case historyitem_Paragraph_Spacing_After:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Writer.WriteDouble(Data.New);
            }
            break;
        case historyitem_Paragraph_Align:
            case historyitem_Paragraph_Spacing_LineRule:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Writer.WriteLong(Data.New);
            }
            break;
        case historyitem_Paragraph_ContextualSpacing:
            case historyitem_Paragraph_KeepLines:
            case historyitem_Paragraph_KeepNext:
            case historyitem_Paragraph_PageBreakBefore:
            case historyitem_Paragraph_Spacing_AfterAutoSpacing:
            case historyitem_Paragraph_Spacing_BeforeAutoSpacing:
            case historyitem_Paragraph_WidowControl:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Writer.WriteBool(Data.New);
            }
            break;
        case historyitem_Paragraph_Shd_Value:
            var New = Data.New;
            if (undefined != New) {
                Writer.WriteBool(false);
                Writer.WriteByte(Data.New);
            } else {
                Writer.WriteBool(true);
            }
            break;
        case historyitem_Paragraph_Shd_Color:
            var New = Data.New;
            if (undefined != New) {
                Writer.WriteBool(false);
                Data.New.Write_ToBinary(Writer);
            } else {
                Writer.WriteBool(true);
            }
            break;
        case historyitem_Paragraph_Tabs:
            if (undefined != Data.New) {
                Writer.WriteBool(false);
                Data.New.Write_ToBinary(Writer);
            } else {
                Writer.WriteBool(true);
            }
            break;
        case historyitem_Paragraph_PStyle:
            if (undefined != Data.New) {
                Writer.WriteBool(false);
                Writer.WriteString2(Data.New);
            } else {
                Writer.WriteBool(true);
            }
            break;
        case historyitem_Paragraph_DocNext:
            case historyitem_Paragraph_DocPrev:
            case historyitem_Paragraph_Parent:
            if (null != Data.New) {
                Writer.WriteString2(Data.New.Get_Id());
            } else {
                Writer.WriteString2("");
            }
            break;
        case historyitem_Paragraph_Borders_Between:
            case historyitem_Paragraph_Borders_Bottom:
            case historyitem_Paragraph_Borders_Left:
            case historyitem_Paragraph_Borders_Right:
            case historyitem_Paragraph_Borders_Top:
            if (undefined != Data.New) {
                Writer.WriteBool(false);
                Data.New.Write_ToBinary(Writer);
            } else {
                Writer.WriteBool(true);
            }
            break;
        case historyitem_Paragraph_Pr:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Data.New.Write_ToBinary(Writer);
            }
            break;
        case historyitem_Paragraph_PresentationPr_Bullet:
            Data.New.Write_ToBinary(Writer);
            break;
        case historyitem_Paragraph_PresentationPr_Level:
            Writer.WriteLong(Data.New);
            break;
        }
        return Writer;
    },
    Load_Changes: function (Reader) {
        var ClassType = Reader.GetLong();
        if (historyitem_type_Paragraph != ClassType) {
            return;
        }
        var Type = Reader.GetLong();
        switch (Type) {
        case historyitem_Paragraph_AddItem:
            var Count = Reader.GetLong();
            for (var Index = 0; Index < Count; Index++) {
                var Pos = this.Internal_Get_RealPos(this.m_oContentChanges.Check(contentchanges_Add, Reader.GetLong()));
                var Element = ParagraphContent_Read_FromBinary(Reader);
                if (null != Element) {
                    if (Element instanceof ParaCommentStart) {
                        var Comment = g_oTableId.Get_ById(Element.Id);
                        if (null != Comment) {
                            Comment.Set_StartInfo(this.Internal_GetPage(Pos), 0, 0, 0, this.Get_Id());
                        }
                    } else {
                        if (Element instanceof ParaCommentEnd) {
                            var Comment = g_oTableId.Get_ById(Element.Id);
                            if (null != Comment) {
                                Comment.Set_EndInfo(this.Internal_GetPage(Pos), 0, 0, 0, this.Get_Id());
                            }
                        }
                    }
                    this.Content.splice(Pos, 0, new ParaCollaborativeChangesEnd());
                    this.Content.splice(Pos, 0, Element);
                    this.Content.splice(Pos, 0, new ParaCollaborativeChangesStart());
                    CollaborativeEditing.Add_ChangedClass(this);
                }
            }
            this.DeleteCollaborativeMarks = false;
            break;
        case historyitem_Paragraph_RemoveItem:
            var Count = Reader.GetLong();
            for (var Index = 0; Index < Count; Index++) {
                var ChangesPos = this.m_oContentChanges.Check(contentchanges_Remove, Reader.GetLong());
                if (false === ChangesPos) {
                    continue;
                }
                var Pos = this.Internal_Get_RealPos(ChangesPos);
                this.Content.splice(Pos, 1);
            }
            break;
        case historyitem_Paragraph_Numbering:
            if (true === Reader.GetBool()) {
                this.Pr.NumPr = undefined;
            } else {
                this.Pr.NumPr = new CNumPr();
                this.Pr.NumPr.Read_FromBinary(Reader);
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Align:
            if (true === Reader.GetBool()) {
                this.Pr.Jc = undefined;
            } else {
                this.Pr.Jc = Reader.GetLong();
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Ind_First:
            if (undefined === this.Pr.Ind) {
                this.Pr.Ind = new CParaInd();
            }
            if (true === Reader.GetBool()) {
                this.Pr.Ind.FirstLine = undefined;
            } else {
                this.Pr.Ind.FirstLine = Reader.GetDouble();
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Ind_Left:
            if (undefined === this.Pr.Ind) {
                this.Pr.Ind = new CParaInd();
            }
            if (true === Reader.GetBool()) {
                this.Pr.Ind.Left = undefined;
            } else {
                this.Pr.Ind.Left = Reader.GetDouble();
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Ind_Right:
            if (undefined === this.Pr.Ind) {
                this.Pr.Ind = new CParaInd();
            }
            if (true === Reader.GetBool()) {
                this.Pr.Ind.Right = undefined;
            } else {
                this.Pr.Ind.Right = Reader.GetDouble();
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_ContextualSpacing:
            if (true === Reader.GetBool()) {
                this.Pr.ContextualSpacing = undefined;
            } else {
                this.Pr.ContextualSpacing = Reader.GetBool();
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_KeepLines:
            if (false === Reader.GetBool()) {
                this.Pr.KeepLines = Reader.GetBool();
            } else {
                this.Pr.KeepLines = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_KeepNext:
            if (false === Reader.GetBool()) {
                this.Pr.KeepNext = Reader.GetLong();
            } else {
                this.Pr.KeepNext = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_PageBreakBefore:
            if (false === Reader.GetBool()) {
                this.Pr.PageBreakBefore = Reader.GetBool();
            } else {
                this.Pr.PageBreakBefore = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_Line:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            if (false === Reader.GetBool()) {
                this.Pr.Spacing.Line = Reader.GetDouble();
            } else {
                this.Pr.Spacing.Line = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_LineRule:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            if (false === Reader.GetBool()) {
                this.Pr.Spacing.LineRule = Reader.GetLong();
            } else {
                this.Pr.Spacing.LineRule = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_Before:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            if (false === Reader.GetBool()) {
                this.Pr.Spacing.Before = Reader.GetDouble();
            } else {
                this.Pr.Spacing.Before = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_After:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            if (false === Reader.GetBool()) {
                this.Pr.Spacing.After = Reader.GetDouble();
            } else {
                this.Pr.Spacing.After = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_AfterAutoSpacing:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            if (false === Reader.GetBool()) {
                this.Pr.Spacing.AfterAutoSpacing = Reader.GetBool();
            } else {
                this.Pr.Spacing.AfterAutoSpacing = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_BeforeAutoSpacing:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            if (false === Reader.GetBool()) {
                this.Pr.Spacing.AfterAutoSpacing = Reader.GetBool();
            } else {
                this.Pr.Spacing.BeforeAutoSpacing = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Shd_Value:
            if (false === Reader.GetBool()) {
                if (undefined === this.Pr.Shd) {
                    this.Pr.Shd = new CDocumentShd();
                }
                this.Pr.Shd.Value = Reader.GetByte();
            } else {
                if (undefined != this.Pr.Shd) {
                    this.Pr.Shd.Value = undefined;
                }
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Shd_Color:
            if (false === Reader.GetBool()) {
                if (undefined === this.Pr.Shd) {
                    this.Pr.Shd = new CDocumentShd();
                }
                this.Pr.Shd.Color = new CDocumentColor(0, 0, 0);
                this.Pr.Shd.Color.Read_FromBinary(Reader);
            } else {
                if (undefined != this.Pr.Shd) {
                    this.Pr.Shd.Color = undefined;
                }
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_WidowControl:
            if (false === Reader.GetBool()) {
                this.Pr.WidowControl = Reader.GetBool();
            } else {
                this.Pr.WidowControl = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Tabs:
            if (false === Reader.GetBool()) {
                this.Pr.Tabs = new CParaTabs();
                this.Pr.Tabs.Read_FromBinary(Reader);
            } else {
                this.Pr.Tabs = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_PStyle:
            if (false === Reader.GetBool()) {
                this.Pr.PStyle = Reader.GetString2();
            } else {
                this.Pr.PStyle = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_DocNext:
            this.Next = g_oTableId.Get_ById(Reader.GetString2());
            break;
        case historyitem_Paragraph_DocPrev:
            this.Prev = g_oTableId.Get_ById(Reader.GetString2());
            break;
        case historyitem_Paragraph_Parent:
            this.Parent = g_oTableId.Get_ById(Reader.GetString2());
            break;
        case historyitem_Paragraph_Borders_Between:
            if (false === Reader.GetBool()) {
                this.Pr.Brd.Between = new CDocumentBorder();
                this.Pr.Brd.Between.Read_FromBinary(Reader);
            } else {
                this.Pr.Brd.Between = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Bottom:
            if (false === Reader.GetBool()) {
                this.Pr.Brd.Bottom = new CDocumentBorder();
                this.Pr.Brd.Bottom.Read_FromBinary(Reader);
            } else {
                this.Pr.Brd.Bottom = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Left:
            if (false === Reader.GetBool()) {
                this.Pr.Brd.Left = new CDocumentBorder();
                this.Pr.Brd.Left.Read_FromBinary(Reader);
            } else {
                this.Pr.Brd.Left = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Right:
            if (false === Reader.GetBool()) {
                this.Pr.Brd.Right = new CDocumentBorder();
                this.Pr.Brd.Right.Read_FromBinary(Reader);
            } else {
                this.Pr.Brd.Right = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Top:
            if (false === Reader.GetBool()) {
                this.Pr.Brd.Top = new CDocumentBorder();
                this.Pr.Brd.Top.Read_FromBinary(Reader);
            } else {
                this.Pr.Brd.Top = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Pr:
            if (true === Reader.GetBool()) {
                this.Pr = new CParaPr();
            } else {
                this.Pr = new CParaPr();
                this.Pr.Read_FromBinary(Reader);
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_PresentationPr_Bullet:
            var Bullet = new CPresentationBullet();
            Bullet.Read_FromBinary(Reader);
            this.PresentationPr.Bullet = Bullet;
            break;
        case historyitem_Paragraph_PresentationPr_Level:
            this.PresentationPr.Level = Reader.GetLong();
            break;
        }
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
    },
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(historyitem_type_Paragraph);
        Writer.WriteString2("" + this.Id);
        Writer.WriteString2(this.Parent.Get_Id());
        this.Pr.Write_ToBinary(Writer);
        Writer.WriteString2(this.TextPr.Get_Id());
        var StartPos = Writer.GetCurPosition();
        Writer.Skip(4);
        var Len = this.Content.length;
        var Count = 0;
        for (var Index = 0; Index < Len; Index++) {
            var Item = this.Content[Index];
            if (true === Item.Is_RealContent()) {
                Item.Write_ToBinary(Writer);
                Count++;
            }
        }
        var EndPos = Writer.GetCurPosition();
        Writer.Seek(StartPos);
        Writer.WriteLong(Count);
        Writer.Seek(EndPos);
    },
    Read_FromBinary2: function (Reader) {
        this.Id = Reader.GetString2();
        this.DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
        var LinkData = new Object();
        LinkData.Parent = Reader.GetString2();
        this.Pr = new CParaPr();
        this.Pr.Read_FromBinary(Reader);
        LinkData.TextPr = Reader.GetString2();
        CollaborativeEditing.Add_LinkData(this, LinkData);
        this.Content = new Array();
        var Count = Reader.GetLong();
        for (var Index = 0; Index < Count; Index++) {
            var Element = ParagraphContent_Read_FromBinary(Reader);
            if (null != Element) {
                this.Content.push(Element);
            }
        }
        CollaborativeEditing.Add_NewObject(this);
    },
    Load_LinkData: function (LinkData) {
        if ("undefined" != typeof(LinkData.Parent)) {
            this.Parent = g_oTableId.Get_ById(LinkData.Parent);
        }
        if ("undefined" != typeof(LinkData.TextPr)) {
            this.TextPr = g_oTableId.Get_ById(LinkData.TextPr);
        }
    },
    Clear_CollaborativeMarks: function () {
        for (var Pos = 0; Pos < this.Content.length; Pos++) {
            var Item = this.Content[Pos];
            if (Item.Type == para_CollaborativeChangesEnd || Item.Type == para_CollaborativeChangesStart) {
                this.Internal_Content_Remove(Pos);
                Pos--;
            }
        }
    },
    Add_Comment: function (Comment, bStart, bEnd) {
        var CursorPos_max = this.Internal_GetEndPos();
        var CursorPos_min = this.Internal_GetStartPos();
        if (true === this.ApplyToAll) {
            if (true === bEnd) {
                var PagePos = this.Internal_GetXYByContentPos(CursorPos_max);
                var Line = this.Lines[PagePos.Internal.Line];
                var LineA = Line.Metrics.Ascent;
                var LineH = Line.Bottom - Line.Top;
                Comment.Set_EndInfo(PagePos.PageNum, PagePos.X, PagePos.Y - LineA, LineH, this.Get_Id());
                var Item = new ParaCommentEnd(Comment.Get_Id());
                this.Internal_Content_Add(CursorPos_max, Item);
            }
            if (true === bStart) {
                var PagePos = this.Internal_GetXYByContentPos(CursorPos_min);
                var Line = this.Lines[PagePos.Internal.Line];
                var LineA = Line.Metrics.Ascent;
                var LineH = Line.Bottom - Line.Top;
                Comment.Set_StartInfo(PagePos.PageNum, PagePos.X, PagePos.Y - LineA, LineH, this.Get_Id());
                var Item = new ParaCommentStart(Comment.Get_Id());
                this.Internal_Content_Add(CursorPos_min, Item);
            }
        } else {
            if (true === this.Selection.Use) {
                var StartPos, EndPos;
                if (this.Selection.StartPos < this.Selection.EndPos) {
                    StartPos = this.Selection.StartPos;
                    EndPos = this.Selection.EndPos;
                } else {
                    StartPos = this.Selection.EndPos;
                    EndPos = this.Selection.StartPos;
                }
                if (true === bEnd) {
                    EndPos = Math.max(CursorPos_min, Math.min(CursorPos_max, EndPos));
                    var PagePos = this.Internal_GetXYByContentPos(EndPos);
                    var Line = this.Lines[PagePos.Internal.Line];
                    var LineA = Line.Metrics.Ascent;
                    var LineH = Line.Bottom - Line.Top;
                    Comment.Set_EndInfo(PagePos.PageNum, PagePos.X, PagePos.Y - LineA, LineH, this.Get_Id());
                    var Item = new ParaCommentEnd(Comment.Get_Id());
                    this.Internal_Content_Add(EndPos, Item);
                }
                if (true === bStart) {
                    StartPos = Math.max(CursorPos_min, Math.min(CursorPos_max, StartPos));
                    var PagePos = this.Internal_GetXYByContentPos(StartPos);
                    var Line = this.Lines[PagePos.Internal.Line];
                    var LineA = Line.Metrics.Ascent;
                    var LineH = Line.Bottom - Line.Top;
                    Comment.Set_StartInfo(PagePos.PageNum, PagePos.X, PagePos.Y - LineA, LineH, this.Get_Id());
                    var Item = new ParaCommentStart(Comment.Get_Id());
                    this.Internal_Content_Add(StartPos, Item);
                }
            } else {
                if (true === bEnd) {
                    var Pos = Math.max(CursorPos_min, Math.min(CursorPos_max, this.CurPos.ContentPos));
                    var PagePos = this.Internal_GetXYByContentPos(Pos);
                    var Line = this.Lines[PagePos.Internal.Line];
                    var LineA = Line.Metrics.Ascent;
                    var LineH = Line.Bottom - Line.Top;
                    Comment.Set_EndInfo(PagePos.PageNum, PagePos.X, PagePos.Y - LineA, LineH, this.Get_Id());
                    var Item = new ParaCommentEnd(Comment.Get_Id());
                    this.Internal_Content_Add(Pos, Item);
                }
                if (true === bStart) {
                    var Pos = Math.max(CursorPos_min, Math.min(CursorPos_max, this.CurPos.ContentPos));
                    var PagePos = this.Internal_GetXYByContentPos(Pos);
                    var Line = this.Lines[PagePos.Internal.Line];
                    var LineA = Line.Metrics.Ascent;
                    var LineH = Line.Bottom - Line.Top;
                    Comment.Set_StartInfo(PagePos.PageNum, PagePos.X, PagePos.Y - LineA, LineH, this.Get_Id());
                    var Item = new ParaCommentStart(Comment.Get_Id());
                    this.Internal_Content_Add(Pos, Item);
                }
            }
        }
    },
    CanAdd_Comment: function () {
        if (true === this.Selection.Use && true != this.Selection_IsEmpty()) {
            return true;
        }
        return false;
    },
    Remove_CommentMarks: function (Id) {
        var DocumentComments = editor.WordControl.m_oLogicDocument.Comments;
        var Count = this.Content.length;
        for (var Pos = 0; Pos < Count; Pos++) {
            var Item = this.Content[Pos];
            if ((para_CommentStart === Item.Type || para_CommentEnd === Item.Type) && Id === Item.Id) {
                if (para_CommentStart === Item.Type) {
                    DocumentComments.Set_StartInfo(Item.Id, 0, 0, 0, 0, null);
                } else {
                    DocumentComments.Set_EndInfo(Item.Id, 0, 0, 0, 0, null);
                }
                this.Internal_Content_Remove(Pos);
                Pos--;
                Count--;
            }
        }
    },
    Replace_MisspelledWord: function (Word, WordId) {
        var Element = this.SpellChecker.Elements[WordId];
        var StartPos = Element.StartPos;
        var EndPos = Element.EndPos;
        for (var Pos = EndPos; Pos >= StartPos; Pos--) {
            var ItemType = this.Content[Pos].Type;
            if (para_TextPr != ItemType) {
                this.Internal_Content_Remove(Pos);
            }
        }
        var Len = Word.length;
        for (var Pos = 0; Pos < Len; Pos++) {
            this.Internal_Content_Add(StartPos + Pos, new ParaText(Word[Pos]));
        }
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
        this.Selection.Use = false;
        this.Selection.Start = false;
        this.Selection.StartPos = EndPos;
        this.Selection.EndPos = EndPos;
        this.CurPos.ContentPos = EndPos;
        this.Document_SetThisElementCurrent();
    },
    Ignore_MisspelledWord: function (WordId) {
        var Element = this.SpellChecker.Elements[WordId];
        Element.Checked = true;
        this.ReDraw();
    }
};
var pararecalc_0_All = 0;
var pararecalc_0_None = 1;
var pararecalc_0_Spell_All = 0;
var pararecalc_0_Spell_Pos = 1;
var pararecalc_0_Spell_Lang = 2;
var pararecalc_0_Spell_None = 3;
function CParaRecalcInfo() {
    this.Recalc_0_Type = pararecalc_0_All;
    this.Recalc_0_Spell = {
        Type: pararecalc_0_All,
        StartPos: 0,
        EndPos: 0
    };
}
CParaRecalcInfo.prototype = {
    Set_Type_0: function (Type) {
        this.Recalc_0_Type = Type;
    },
    Set_Type_0_Spell: function (Type, StartPos, EndPos) {
        if (pararecalc_0_Spell_All === this.Recalc_0_Spell.Type) {
            return;
        } else {
            if (pararecalc_0_Spell_None === this.Recalc_0_Spell.Type || pararecalc_0_Spell_Lang === this.Recalc_0_Spell.Type) {
                this.Recalc_0_Spell.Type = Type;
                if (pararecalc_0_Spell_Pos === Type) {
                    this.Recalc_0_Spell.StartPos = StartPos;
                    this.Recalc_0_Spell.EndPos = EndPos;
                }
            } else {
                if (pararecalc_0_Spell_Pos === this.Recalc_0_Spell.Type) {
                    if (pararecalc_0_Spell_All === Type) {
                        this.Recalc_0_Spell.Type = Type;
                    } else {
                        if (pararecalc_0_Spell_Pos === Type) {
                            this.Recalc_0_Spell.StartPos = Math.min(StartPos, this.Recalc_0_Spell.StartPos);
                            this.Recalc_0_Spell.EndPos = Math.max(EndPos, this.Recalc_0_Spell.EndPos);
                        }
                    }
                }
            }
        }
    },
    Update_Spell_OnChange: function (Pos, Count, bAdd) {
        if (pararecalc_0_Spell_Pos === this.Recalc_0_Spell.Type) {
            if (true === bAdd) {
                if (this.Recalc_0_Spell.StartPos > Pos) {
                    this.Recalc_0_Spell.StartPos++;
                }
                if (this.Recalc_0_Spell.EndPos >= Pos) {
                    this.Recalc_0_Spell.EndPos++;
                }
            } else {
                if (this.Recalc_0_Spell.StartPos > Pos) {
                    if (this.Recalc_0_Spell.StartPos > Pos + Count) {
                        this.Recalc_0_Spell.StartPos -= Count;
                    } else {
                        this.Recalc_0_Spell.StartPos = Pos;
                    }
                }
                if (this.Recalc_0_Spell.EndPos >= Pos) {
                    if (this.Recalc_0_Spell.EndPos >= Pos + Count) {
                        this.Recalc_0_Spell.EndPos -= Count;
                    } else {
                        this.Recalc_0_Spell.EndPos = Math.max(0, Pos - 1);
                    }
                }
            }
        }
    }
};
function CParaLineRange(X, XEnd) {
    this.X = X;
    this.XVisible = 0;
    this.W = 0;
    this.Words = 0;
    this.Spaces = 0;
    this.XEnd = XEnd;
    this.StartPos = 0;
    this.SpacePos = -1;
    this.StartPos2 = -1;
    this.EndPos2 = -1;
}
CParaLineRange.prototype = {
    Shift: function (Dx, Dy) {
        this.X += Dx;
        this.XEnd += Dx;
        this.XVisible += Dx;
    }
};
function CParaLineMetrics() {
    this.Ascent = 0;
    this.Descent = 0;
    this.TextAscent = 0;
    this.TextDescent = 0;
    this.LineGap = 0;
}
CParaLineMetrics.prototype = {
    Update: function (TextAscent, TextDescent, Ascent, Descent, ParaPr) {
        if (TextAscent > this.TextAscent) {
            this.TextAscent = TextAscent;
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
        this.LineGap = this.Recalculate_LineGap(ParaPr, this.TextAscent, this.TextDescent);
    },
    Recalculate_LineGap: function (ParaPr, TextAscent, TextDescent) {
        var LineGap = 0;
        switch (ParaPr.Spacing.LineRule) {
        case linerule_Auto:
            LineGap = (TextAscent + TextDescent) * (ParaPr.Spacing.Line - 1);
            break;
        case linerule_Exact:
            var ExactValue = Math.max(1, ParaPr.Spacing.Line);
            LineGap = ExactValue - (TextAscent + TextDescent);
            break;
        case linerule_AtLeast:
            var LineGap1 = ParaPr.Spacing.Line;
            var LineGap2 = TextAscent + TextDescent;
            LineGap = Math.max(LineGap1, LineGap2) - (TextAscent + TextDescent);
            break;
        }
        return LineGap;
    }
};
function CParaLine(StartPos) {
    this.Y = 0;
    this.W = 0;
    this.Top = 0;
    this.Bottom = 0;
    this.Words = 0;
    this.Spaces = 0;
    this.Metrics = new CParaLineMetrics();
    this.Ranges = new Array();
    this.RangeY = false;
    this.StartPos = StartPos;
    this.EndPos = StartPos;
}
CParaLine.prototype = {
    Add_Range: function (X, XEnd) {
        this.Ranges.push(new CParaLineRange(X, XEnd));
    },
    Shift: function (Dx, Dy) {
        var RangesCount = this.Ranges.length;
        for (var Index = 0; Index < RangesCount; Index++) {
            this.Ranges[Index].Shift(Dx, Dy);
        }
    },
    Set_RangeStartPos: function (CurRange, StartPos) {
        if (0 === CurRange) {
            this.StartPos = StartPos;
        }
        this.Ranges[CurRange].StartPos = StartPos;
    },
    Reset: function (StartPos) {
        this.Top = 0;
        this.Bottom = 0;
        this.Words = 0;
        this.Spaces = 0;
        this.Metrics = new CParaLineMetrics();
        this.Ranges = new Array();
        this.StartPos = StartPos;
    },
    Set_EndPos: function (EndPos, Paragraph) {
        this.EndPos = EndPos;
        var Content = Paragraph.Content;
        var RangesCount = this.Ranges.length;
        for (var CurRange = 0; CurRange < RangesCount; CurRange++) {
            var StartRangePos = this.Ranges[CurRange].StartPos;
            var EndRangePos = (CurRange === RangesCount - 1 ? EndPos : this.Ranges[CurRange + 1].StartPos - 1);
            var nSpacesCount = 0;
            var bWord = false;
            var nSpaceLen = 0;
            var nSpacePos = -1;
            var nStartPos2 = -1;
            var nEndPos2 = -1;
            this.Ranges[CurRange].W = 0;
            this.Ranges[CurRange].Words = 0;
            this.Ranges[CurRange].Spaces = 0;
            for (var Pos = StartRangePos; Pos <= EndRangePos; Pos++) {
                var Item = Content[Pos];
                switch (Item.Type) {
                case para_Text:
                    if (true != bWord) {
                        bWord = true;
                        this.Ranges[CurRange].Words++;
                    }
                    this.Ranges[CurRange].W += Item.Width;
                    if (true === Item.SpaceAfter) {
                        this.Ranges[CurRange].W += nSpaceLen;
                        if (this.Ranges[CurRange].Words > 1) {
                            this.Ranges[CurRange].Spaces += nSpacesCount;
                        }
                        bWord = false;
                        nSpaceLen = 0;
                        nSpacesCount = 0;
                    }
                    if (EndRangePos === Pos) {
                        this.Ranges[CurRange].W += nSpaceLen;
                    }
                    if (-1 === nSpacePos) {
                        nSpacePos = Pos;
                    }
                    if (-1 === nStartPos2) {
                        nStartPos2 = Pos;
                    }
                    nEndPos2 = Pos;
                    break;
                case para_Space:
                    if (true === bWord) {
                        this.Ranges[CurRange].W += nSpaceLen;
                        if (this.Ranges[CurRange].Words > 1) {
                            this.Ranges[CurRange].Spaces += nSpacesCount;
                        }
                        bWord = false;
                        nSpacesCount = 1;
                        nSpaceLen = 0;
                    } else {
                        nSpacesCount++;
                    }
                    nSpaceLen += Item.Width;
                    break;
                case para_Drawing:
                    this.Ranges[CurRange].Words++;
                    this.Ranges[CurRange].W += nSpaceLen;
                    this.Ranges[CurRange].Spaces += nSpacesCount;
                    bWord = false;
                    nSpacesCount = 0;
                    nSpaceLen = 0;
                    if (true === Item.Is_Inline() || true === Paragraph.Parent.Is_DrawingShape()) {
                        this.Ranges[CurRange].W += Item.Width;
                        if (-1 === nSpacePos) {
                            nSpacePos = Pos;
                        }
                        if (-1 === nStartPos2) {
                            nStartPos2 = Pos;
                        }
                        nEndPos2 = Pos;
                    }
                    break;
                case para_PageNum:
                    this.Ranges[CurRange].Words++;
                    this.Ranges[CurRange].W += nSpaceLen;
                    this.Ranges[CurRange].Spaces += nSpacesCount;
                    bWord = false;
                    nSpacesCount = 0;
                    nSpaceLen = 0;
                    this.Ranges[CurRange].W += Item.Width;
                    if (-1 === nSpacePos) {
                        nSpacePos = Pos;
                    }
                    if (-1 === nStartPos2) {
                        nStartPos2 = Pos;
                    }
                    nEndPos2 = Pos;
                    break;
                case para_Tab:
                    this.Ranges[CurRange].W += Item.Width;
                    this.Ranges[CurRange].W += nSpaceLen;
                    this.Ranges[CurRange].Words = 0;
                    this.Ranges[CurRange].Spaces = 0;
                    nSpaceLen = 0;
                    nSpacesCount = 0;
                    bWord = false;
                    nSpacePos = -1;
                    break;
                case para_NewLine:
                    if (bWord && this.Ranges[CurRange].Words > 1) {
                        this.Ranges[CurRange].Spaces += nSpacesCount;
                    }
                    nSpacesCount = 0;
                    bWord = false;
                    break;
                case para_End:
                    if (true === bWord) {
                        this.Ranges[CurRange].Spaces += nSpacesCount;
                    }
                    break;
                }
            }
            this.Ranges[CurRange].SpacePos = nSpacePos;
            this.Ranges[CurRange].StartPos2 = (nStartPos2 === -1 ? StartRangePos : nStartPos2);
            this.Ranges[CurRange].EndPos2 = (nEndPos2 === -1 ? EndRangePos : nEndPos2);
        }
    }
};
function CDocumentBounds(Left, Top, Right, Bottom) {
    this.Bottom = Bottom;
    this.Left = Left;
    this.Right = Right;
    this.Top = Top;
}
CDocumentBounds.prototype = {
    Shift: function (Dx, Dy) {
        this.Bottom += Dy;
        this.Top += Dy;
        this.Left += Dx;
        this.Right += Dx;
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
    }
};
function CParaPos(Range, Line, Page, Pos) {
    this.Range = Range;
    this.Line = Line;
    this.Page = Page;
    this.Pos = Pos;
}
function CParaDrawingRangeLinesElement(y0, y1, x0, x1, w, r, g, b, Additional) {
    this.y0 = y0;
    this.y1 = y1;
    this.x0 = x0;
    this.x1 = x1;
    this.w = w;
    this.r = r;
    this.g = g;
    this.b = b;
    this.Additional = Additional;
}
function CParaDrawingRangeLines() {
    this.Elements = new Array();
}
CParaDrawingRangeLines.prototype = {
    Add: function (y0, y1, x0, x1, w, r, g, b, Additional) {
        this.Elements.push(new CParaDrawingRangeLinesElement(y0, y1, x0, x1, w, r, g, b, Additional));
    },
    Get_Next: function () {
        var Count = this.Elements.length;
        if (Count <= 0) {
            return null;
        }
        var Element = this.Elements[Count - 1];
        Count--;
        while (Count > 0) {
            var PrevEl = this.Elements[Count - 1];
            if (Math.abs(PrevEl.y0 - Element.y0) < 0.001 && Math.abs(PrevEl.y1 - Element.y1) < 0.001 && Math.abs(PrevEl.x1 - Element.x0) < 0.001 && Math.abs(PrevEl.w - Element.w) < 0.001 && PrevEl.r === Element.r && PrevEl.g === Element.g && PrevEl.b === Element.b) {
                Element.x0 = PrevEl.x0;
                Count--;
            } else {
                break;
            }
        }
        this.Elements.length = Count;
        return Element;
    }
};