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
var UnknownValue = null;
function Paragraph(DrawingDocument, Parent, PageNum, X, Y, XLimit, YLimit) {
    this.Id = g_oIdCounter.Get_NewId();
    this.Prev = null;
    this.Next = null;
    this.Index = 0;
    this.Parent = Parent;
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
    this.TextPr = new ParaTextPr();
    this.TextPr.Parent = this;
    this.Bounds = new CDocumentBounds(X, Y, X_Right_Field, Y);
    this.Lines = new Array();
    this.RecalcInfo = new CParaRecalcInfo();
    this.Pages = new Array();
    this.Pages[0] = new CParaPage(X, Y, XLimit, YLimit, 0);
    this.Content = new Array();
    this.Content[0] = new ParaPresentationNumbering();
    this.Content[1] = new ParaEnd();
    this.Content[2] = new ParaEmpty();
    this.CurPos = {
        X: 0,
        Y: 0,
        ContentPos: 1,
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
    this.DrawingDocument = DrawingDocument;
    this.TurnOffRecalcEvent = false;
    this.ApplyToAll = false;
    this.Lock = new CLock();
    if (false === g_oIdCounter.m_bLoad) {
        this.Lock.Set_Type(locktype_Mine, false);
        CollaborativeEditing.Add_Unlock2(this);
    }
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
    this.rPr = {};
    var unifill = new CUniFill();
    unifill.fill = new CSolidFill();
    unifill.fill.color.color = new CSchemeColor();
    unifill.fill.color.color.id = 10;
    this.folHlinkColor = {};
    this.folHlinkColor.unifill = unifill;
    this.folHlinkColor.Color = {
        r: 128,
        g: 0,
        b: 151
    };
    g_oTableId.Add(this, this.Id);
}
Paragraph.prototype = {
    getFirstTextProperties: function () {
        var _content = this.Content;
        var _content_count = _content.length;
        var _content_index;
        for (_content_index = 0; _content_index < _content_count; ++_content_index) {
            if (_content[_content_index].Type === para_TextPr) {
                return _content[_content_index].Value;
            }
            if (_content[_content_index].Type === para_Text) {
                return null;
            }
        }
        return null;
    },
    setFirstTextProperties: function (textProperties) {
        var _b_history_is_on = History.Is_On();
        if (_b_history_is_on) {
            History.TurnOff();
        }
        this.Internal_Content_Add(1, new ParaTextPr(textProperties));
        if (_b_history_is_on) {
            History.TurnOn();
        }
    },
    getParagraphProperties: function () {
        return this.Pr;
    },
    setParagraphProperties: function (paragraphProperties) {
        this.Pr.Set_FromObject(paragraphProperties);
    },
    calculateTextTheme: function (theme, slide, layout, master, fontRef) {
        this.CompiledPr.NeedRecalc = true;
        if (this.rPr.unifill && this.rPr.unifill.fill) {
            var brush = null;
            var RGBA = {
                R: 0,
                G: 0,
                B: 0,
                A: 255
            };
            if (theme && this.style != null && fontRef != null) {
                brush = theme.getFillStyle(fontRef.idx);
                fontRef.Color.Calculate(theme, slide, layout, master);
                RGBA = fontRef.Color.RGBA;
                if (fontRef.Color.color != null) {
                    if (brush.fill != null && brush.fill.type == FILL_TYPE_SOLID) {
                        brush.fill.color = fontRef.Color.createDuplicate();
                    }
                }
            } else {
                brush = new CUniFill();
            }
            brush.merge(this.rPr.unifill);
            brush.calculate(theme, slide, layout, master, RGBA);
            var _rgba = brush.getRGBAColor();
            this.rPr.Color = {
                r: _rgba.R,
                g: _rgba.G,
                b: _rgba.B,
                A: _rgba.A
            };
        } else {
            delete this.rPr.Color;
        }
        if (this.rPr.FontFamily && this.rPr.FontFamily.Name !== undefined) {
            if (this.rPr.FontFamily.themeFont == undefined) {
                this.rPr.FontFamily.Index = -1;
                this.rPr.FontFamily.themeFont = this.rPr.FontFamily.Name;
                this.rPr.FontFamily.Name = getFontInfo(this.rPr.FontFamily.Name)(theme.themeElements.fontScheme);
            } else {
                this.rPr.FontFamily.Index = -1;
                this.rPr.FontFamily.Name = getFontInfo(this.rPr.FontFamily.themeFont)(theme.themeElements.fontScheme);
            }
        }
        if (this.TextPr && this.TextPr.Value && this.TextPr.Value.FontFamily) {
            if (this.TextPr.Value.FontFamily.themeFont == undefined) {
                this.TextPr.Value.FontFamily.Index = -1;
                this.TextPr.Value.FontFamily.themeFont = this.TextPr.Value.FontFamily.Name;
                this.TextPr.Value.FontFamily.Name = getFontInfo(this.TextPr.Value.FontFamily.Name)(theme.themeElements.fontScheme);
            } else {
                this.TextPr.Value.FontFamily.Index = -1;
                this.TextPr.Value.FontFamily.Name = getFontInfo(this.TextPr.Value.FontFamily.themeFont)(theme.themeElements.fontScheme);
            }
        }
        for (var i = 0; i < this.Content.length; ++i) {
            if (this.Content[i].Type == para_TextPr) {
                if (this.Content[i].Value.unifill && this.Content[i].Value.unifill.fill) {
                    var brush = null;
                    var RGBA = {
                        R: 0,
                        G: 0,
                        B: 0,
                        A: 255
                    };
                    if (theme && this.style != null && fontRef != null) {
                        brush = theme.getFillStyle(fontRef.idx);
                        fontRef.Color.Calculate(theme, slide, layout, master);
                        RGBA = fontRef.Color.RGBA;
                        if (fontRef.Color.color != null) {
                            if (brush.fill != null && brush.fill.type == FILL_TYPE_SOLID) {
                                brush.fill.color = fontRef.Color.createDuplicate();
                            }
                        }
                    } else {
                        brush = new CUniFill();
                    }
                    brush.merge(this.Content[i].Value.unifill);
                    brush.calculate(theme, slide, layout, master, RGBA);
                    var _rgba = brush.getRGBAColor();
                    this.Content[i].Value.Color = {
                        r: _rgba.R,
                        g: _rgba.G,
                        b: _rgba.B,
                        A: _rgba.A
                    };
                } else {
                    delete this.Content[i].Value.Color;
                }
                if (this.Content[i].Value.FontFamily && this.Content[i].Value.FontFamily.Name !== undefined) {
                    if (this.Content[i].Value.FontFamily.themeFont == undefined) {
                        this.Content[i].Value.FontFamily.Index = -1;
                        this.Content[i].Value.FontFamily.themeFont = this.Content[i].Value.FontFamily.Name;
                        this.Content[i].Value.FontFamily.Name = getFontInfo(this.Content[i].Value.FontFamily.Name)(theme.themeElements.fontScheme);
                    } else {
                        this.Content[i].Value.FontFamily.Index = -1;
                        this.Content[i].Value.FontFamily.Name = getFontInfo(this.Content[i].Value.FontFamily.themeFont)(theme.themeElements.fontScheme);
                    }
                }
            }
        }
        if (this.compiledBullet != null) {
            var _final_bullet = this.compiledBullet;
            if (_final_bullet.bulletColor && (_final_bullet.bulletColor.type == BULLET_TYPE_COLOR_CLR)) {
                var _unicolor = _final_bullet.bulletColor.UniColor;
                if (_unicolor != null) {
                    var _unifill = new CUniFill();
                    _unifill.fill = new CSolidFill();
                    _unifill.fill.color = _unicolor;
                    var RGBA = null;
                    var _rgb_color = null;
                    if (_unicolor.type == COLOR_TYPE_SCHEME && _unicolor.id == phClr) {
                        if (fontRef && fontRef.Color) {
                            fontRef.Color.Calculate(theme, slide, layout, master);
                            RGBA = fontRef.Color.RGBA;
                            _rgb_color = {
                                r: RGBA.R,
                                g: RGBA.G,
                                b: RGBA.B
                            };
                        }
                    } else {
                        _unifill.calculate(theme, slide, layout, master, {
                            R: 0,
                            G: 0,
                            B: 0,
                            A: 255
                        });
                        if (_unifill.fill.color && _unifill.fill.color.RGBA) {
                            RGBA = _unifill.fill.color.RGBA;
                            _rgb_color = {
                                r: RGBA.R,
                                g: RGBA.G,
                                b: RGBA.B
                            };
                        }
                    }
                    if (_rgb_color !== null) {
                        if (this.PresentationPr.Bullet && this.PresentationPr.Bullet.m_oColor) {
                            this.PresentationPr.Bullet.m_oColor = {
                                r: _rgb_color.r,
                                g: _rgb_color.g,
                                b: _rgb_color.b
                            };
                        }
                    }
                }
            }
        }
        var unifillHiperlink = new CUniFill();
        unifillHiperlink.merge(this.folHlinkColor.unifill);
        unifillHiperlink.calculate(theme, slide, layout, master, RGBA);
        if (unifillHiperlink.fill && unifillHiperlink.fill.color && unifillHiperlink.fill.color.RGBA) {
            this.folHlinkColor.Color = {
                r: unifillHiperlink.fill.color.RGBA.R,
                g: unifillHiperlink.fill.color.RGBA.G,
                b: unifillHiperlink.fill.color.RGBA.B,
                A: unifillHiperlink.fill.color.RGBA.A
            };
        } else {
            this.folHlinkColor.Color = {
                r: 128,
                g: 0,
                b: 151,
                A: 0
            };
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
    Reset: function (X, Y, XLimit, YLimit, PageNum) {
        this.X = X;
        this.Y = Y;
        this.XLimit = XLimit;
        this.YLimit = YLimit;
        this.PageNum = PageNum;
        this.Pages.length = 1;
        this.Pages[0].Reset(X, Y, XLimit, YLimit, 0);
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
        History.Add(OtherParagraph, {
            Type: historyitem_Paragraph_Pr,
            Old: oOldPr,
            New: OtherParagraph.Pr
        });
        OtherParagraph.Style_Add(this.Style_Get(), true);
    },
    Internal_Content_Add: function (Pos, Item) {
        if (true === Item.Is_RealContent()) {
            var ClearPos = this.Internal_Get_ClearPos(Pos);
            History.Add(this, {
                Type: historyitem_Paragraph_AddItem,
                Pos: ClearPos,
                EndPos: ClearPos,
                Items: [Item]
            });
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
        History.Add(this, {
            Type: historyitem_Paragraph_AddItem,
            Pos: this.Internal_Get_ClearPos(StartPos),
            EndPos: this.Internal_Get_ClearPos(this.Content.length - 1),
            Items: NewItems
        });
    },
    Internal_Content_Remove: function (Pos) {
        var Item = this.Content[Pos];
        if (true === Item.Is_RealContent()) {
            var ClearPos = this.Internal_Get_ClearPos(Pos);
            History.Add(this, {
                Type: historyitem_Paragraph_RemoveItem,
                Pos: ClearPos,
                EndPos: ClearPos,
                Items: [Item]
            });
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
        var DocumentComments = editor.WordControl.m_oLogicDocument.Comments;
        var CommentsToDelete = new Object();
        for (var Index = Pos; Index < Pos + Count; Index++) {
            var ItemType = this.Content[Index].Type;
            if (true === this.DeleteCommentOnRemove && (para_CommentStart === ItemType || para_CommentEnd === ItemType)) {
                if (para_CommentStart === ItemType) {
                    DocumentComments.Set_StartInfo(this.Content[Index].Id, 0, 0, 0, 0, null);
                } else {
                    DocumentComments.Set_EndInfo(this.Content[Index].Id, 0, 0, 0, 0, null);
                }
                CommentsToDelete[this.Content[Index].Id] = 1;
            }
        }
        var LastArray = this.Content.slice(Pos, Pos + Count);
        var LastItems = new Array();
        var ItemsCount = LastArray.length;
        for (var Index = 0; Index < ItemsCount; Index++) {
            if (true === LastArray[Index].Is_RealContent()) {
                LastItems.push(LastArray[Index]);
            }
        }
        History.Add(this, {
            Type: historyitem_Paragraph_RemoveItem,
            Pos: this.Internal_Get_ClearPos(Pos),
            EndPos: this.Internal_Get_ClearPos(Pos + Count - 1),
            Items: LastItems
        });
        if (this.CurPos.ContentPos > Pos) {
            if (this.CurPos.ContentPos > Pos + Count) {
                this.CurPos.ContentPos -= Count;
            } else {
                this.CurPos.ContentPos = Pos;
            }
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
        this.Content.splice(Pos, Count);
        for (var Id in CommentsToDelete) {
            editor.WordControl.m_oLogicDocument.Remove_Comment(Id, true);
        }
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
    Internal_Recalculate_1: function () {
        var Pr = this.Get_CompiledPr();
        var ParaPr = Pr.ParaPr;
        var CurPage = 0;
        this.Pages.length = 1;
        this.Pages[0].Reset(this.X, this.Y, this.XLimit, this.YLimit, 0);
        var X = this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
        var Y = this.Y;
        var XLimit = this.XLimit - ParaPr.Ind.Right;
        var LineStart_Pos = 0;
        if (true === ParaPr.PageBreakBefore) {
            var Prev = this.Get_DocumentPrev();
            if (null != Prev) {
                this.Internal_Content_Add(LineStart_Pos, new ParaPageBreakRenderer());
                LineStart_Pos++;
                CurPage++;
                var PageStart = this.Parent.Get_PageContentStartPos(this.PageNum + CurPage);
                X = PageStart.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
                Y = PageStart.Y;
                this.Pages[CurPage] = new CParaPage(PageStart.X, PageStart.Y, PageStart.XLimit, PageStart.YLimit, 0);
            }
        }
        if (ParaPr.Ind.FirstLine <= 0) {
            this.Bounds.Left = X;
        } else {
            this.Bounds.Left = this.X + ParaPr.Ind.Left;
        }
        this.Bounds.Right = XLimit;
        var bFirstItemOnLine = true;
        var bEmptyLine = true;
        var bStartWord = false;
        var CurLine = 0;
        var bWord = false;
        var nWordStartPos = 0;
        var nWordLen = 0;
        var nSpaceLen = 0;
        var nSpacesCount = 0;
        var bNewLine = false;
        var bNewRange = false;
        var bNewPage = false;
        var bExtendBoundToBottom = false;
        var bNeedNewLine = false;
        var bNeedNewRange = false;
        var bEnd = false;
        var Ranges = this.Parent.CheckRange(X, Y, XLimit, Y, this.PageNum + CurPage, true);
        var RangesCount = Ranges.length;
        var TextAscent = 0;
        var TextHeight = 0;
        var TextDescent = 0;
        this.Lines.length = 0;
        this.Lines[CurLine] = new CParaLine();
        var LineTextAscent = 0;
        var LineTextDescent = 0;
        var LineAscent = 0;
        var LineDescent = 0;
        this.Lines[CurLine].Add_Range(X, (RangesCount == 0 ? XLimit : Ranges[0].X0));
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
        for (var Pos = LineStart_Pos; Pos < this.Content.length; Pos++) {
            var bSkip = false;
            if (false === bStartWord && true === bFirstItemOnLine && XEnd - X < 6.35 && RangesCount > 0) {
                if (RangesCount == CurRange) {
                    bNewLine = true;
                    if (true != bNeedNewLine) {
                        this.Internal_Content_Add(Pos, new ParaNewLineRendered());
                    }
                } else {
                    bNewRange = true;
                    if (true != bNeedNewRange) {
                        this.Internal_Content_Add(Pos, new ParaInlineBreak());
                    }
                }
            }
            if (true != bSkip) {
                var Item = this.Content[Pos];
                TextAscent = Item.TextAscent;
                TextDescent = Item.TextDescent;
                TextHeight = Item.TextHeight;
                switch (Item.Type) {
                case para_Numbering:
                    var NumPr = ParaPr.NumPr;
                    if (undefined === NumPr || undefined === NumPr.NumId) {
                        break;
                    }
                    var Numbering = this.Parent.Get_Numbering();
                    var NumLvl = Numbering.Get_AbstractNum(NumPr.NumId).Lvl[NumPr.Lvl];
                    var NumSuff = NumLvl.Suff;
                    var NumJc = NumLvl.Jc;
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
                        break;
                    case numbering_suff_Tab:
                        var NewX = null;
                        for (var Index = 0; Index < ParaPr.Tabs.length; Index++) {
                            var TabPos = ParaPr.Tabs[Index].Pos + this.X;
                            if (X < TabPos) {
                                NewX = TabPos;
                                break;
                            }
                        }
                        if (X < this.X + ParaPr.Ind.Left) {
                            if (null === NewX || NewX > this.X + ParaPr.Ind.Left) {
                                Item.WidthSuff = this.X + ParaPr.Ind.Left - X;
                            } else {
                                Item.WidthSuff = NewX - X;
                            }
                        } else {
                            if (null === NewX) {
                                NewX = this.X;
                                while (X >= NewX) {
                                    NewX += Default_Tab_Stop;
                                }
                            }
                            Item.WidthSuff = NewX - X;
                        }
                        break;
                    }
                    Item.Width = Item.WidthNum;
                    Item.WidthVisible += Item.WidthSuff;
                    X += Item.WidthSuff;
                    break;
                case para_PresentationNumbering:
                    if (numbering_presentationnumfrmt_None != Item.Bullet.Get_Type()) {
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
                    if (LineAscent < TextAscent) {
                        LineAscent = TextAscent;
                    }
                    if (LineDescent < TextDescent) {
                        LineDescent = TextDescent;
                    }
                    if (!bWord) {
                        var LetterLen = Item.Width;
                        if (!bFirstItemOnLine || 0 != RangesCount) {
                            if (X + nSpaceLen + LetterLen > XEnd) {
                                if (RangesCount == CurRange) {
                                    bNewLine = true;
                                    if (true != bNeedNewLine) {
                                        this.Internal_Content_Add(Pos, new ParaNewLineRendered());
                                    }
                                } else {
                                    bNewRange = true;
                                    if (true != bNeedNewRange) {
                                        this.Internal_Content_Add(Pos, new ParaInlineBreak());
                                    }
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
                                bEmptyLine = false;
                                if (0 == RangesCount) {
                                    X += nWordLen;
                                    this.Internal_Content_Add(Pos, new ParaNewLineRendered());
                                    bNewLine = true;
                                } else {
                                    if (RangesCount != CurRange) {
                                        Pos = nWordStartPos;
                                        this.Internal_Content_Add(Pos, new ParaInlineBreak());
                                        bNewRange = true;
                                    } else {
                                        Pos = nWordStartPos;
                                        this.Internal_Content_Add(Pos, new ParaNewLineRendered());
                                        bNewLine = true;
                                    }
                                }
                            } else {
                                Pos = nWordStartPos;
                                if (RangesCount == CurRange) {
                                    this.Internal_Content_Add(Pos, new ParaNewLineRendered());
                                    bNewLine = true;
                                    this.Lines[CurLine].Words--;
                                    this.Lines[CurLine].Ranges[CurRange].Words--;
                                } else {
                                    this.Internal_Content_Add(Pos, new ParaInlineBreak());
                                    bNewRange = true;
                                    this.Lines[CurLine].Ranges[CurRange].Words--;
                                }
                            }
                        }
                        if (!bNewLine && !bNewRange) {
                            nWordLen += LetterLen;
                            if (true === Item.SpaceAfter) {
                                X += nSpaceLen;
                                nSpaceLen = 0;
                                X += nWordLen;
                                if (this.Lines[CurLine].Words > 1) {
                                    this.Lines[CurLine].Spaces += nSpacesCount;
                                }
                                if (this.Lines[CurLine].Ranges[CurRange].Words > 1) {
                                    this.Lines[CurLine].Ranges[CurRange].Spaces += nSpacesCount;
                                }
                                nSpacesCount = 0;
                                bWord = false;
                                bFirstItemOnLine = false;
                                bEmptyLine = false;
                                nWordLen = 0;
                            }
                        }
                    }
                    break;
                case para_Space:
                    bFirstItemOnLine = false;
                    var SpaceLen = Item.Width;
                    if (bWord) {
                        X += nSpaceLen;
                        nSpaceLen = 0;
                        X += nWordLen;
                        if (this.Lines[CurLine].Words > 1) {
                            this.Lines[CurLine].Spaces += nSpacesCount;
                        }
                        if (this.Lines[CurLine].Ranges[CurRange].Words > 1) {
                            this.Lines[CurLine].Ranges[CurRange].Spaces += nSpacesCount;
                        }
                        bWord = false;
                        bEmptyLine = false;
                        nWordLen = 0;
                        nSpacesCount = 1;
                    } else {
                        nSpacesCount++;
                    }
                    if (X + nSpaceLen + SpaceLen > XEnd) {
                        if (CurRange == RangesCount) {
                            bNeedNewLine = true;
                        } else {
                            bNeedNewRange = true;
                        }
                    } else {
                        nSpaceLen += SpaceLen;
                    }
                    break;
                case para_Drawing:
                    if (true === bStartWord) {
                        bFirstItemOnLine = false;
                    }
                    X += nSpaceLen;
                    nSpaceLen = 0;
                    X += nWordLen;
                    bWord = false;
                    nWordLen = 0;
                    if (X + Item.Width > XEnd && (false === bFirstItemOnLine || RangesCount > 0)) {
                        if (RangesCount == CurRange) {
                            bNewLine = true;
                            if (true != bNeedNewLine) {
                                this.Internal_Content_Add(Pos, new ParaNewLineRendered());
                            } else {
                                Pos--;
                            }
                        } else {
                            bNewRange = true;
                            if (true != bNeedNewRange) {
                                this.Internal_Content_Add(Pos, new ParaInlineBreak());
                            } else {
                                Pos--;
                            }
                        }
                    } else {
                        if (Item.Height > this.Lines[CurLine].Metrics.Ascent) {
                            this.Lines[CurLine].Metrics.Ascent = Item.Height;
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
                    nSpacesCount = 0;
                    break;
                case para_PageNum:
                    if (true === bStartWord) {
                        bFirstItemOnLine = false;
                    }
                    X += nSpaceLen;
                    nSpaceLen = 0;
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
                    X += nWordLen;
                    bWord = false;
                    nWordLen = 0;
                    if (X + Item.Width > XEnd && (false === bFirstItemOnLine || RangesCount > 0)) {
                        if (RangesCount == CurRange) {
                            bNewLine = true;
                            if (true != bNeedNewLine) {
                                this.Internal_Content_Add(Pos, new ParaNewLineRendered());
                            } else {
                                Pos--;
                            }
                        } else {
                            bNewRange = true;
                            if (true != bNeedNewRange) {
                                this.Internal_Content_Add(Pos, new ParaInlineBreak());
                            } else {
                                Pos--;
                            }
                        }
                    } else {
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
                    nSpacesCount = 0;
                    break;
                case para_Tab:
                    if (true === bStartWord) {
                        bFirstItemOnLine = false;
                    }
                    X += nSpaceLen;
                    nSpaceLen = 0;
                    if (true === bWord) {
                        bEmptyLine = false;
                    }
                    X += nWordLen;
                    bWord = false;
                    nWordLen = 0;
                    var NewX = null;
                    var TabsCount = ParaPr.Tabs.Get_Count();
                    for (var Index = 0; Index < TabsCount; Index++) {
                        var Tab = ParaPr.Tabs.Get(Index);
                        var TabPos = Tab.Pos + this.X;
                        if (X < TabPos) {
                            NewX = TabPos;
                            Item.TabType = Tab.Val;
                            break;
                        }
                    }
                    if (null === NewX) {
                        if (X < this.X + ParaPr.Ind.Left) {
                            NewX = this.X + ParaPr.Ind.Left;
                        } else {
                            NewX = this.X;
                            while (X >= NewX) {
                                NewX += Default_Tab_Stop;
                            }
                        }
                        Item.TabType = tab_Left;
                    }
                    if (NewX > XEnd && (false === bFirstItemOnLine || RangesCount > 0)) {
                        if (RangesCount == CurRange) {
                            bNewLine = true;
                            if (true != bNeedNewLine) {
                                this.Internal_Content_Add(Pos, new ParaNewLineRendered());
                            } else {
                                Pos--;
                            }
                        } else {
                            bNewRange = true;
                            if (true != bNeedNewRange) {
                                this.Internal_Content_Add(Pos, new ParaInlineBreak());
                            } else {
                                Pos--;
                            }
                        }
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
                    nSpacesCount = 0;
                    bFirstItemOnLine = false;
                    break;
                case para_TextPr:
                    break;
                case para_NewLine:
                    if (break_Page === Item.BreakType) {
                        bNewPage = true;
                    }
                    X += nWordLen;
                    if (bWord && this.Lines[CurLine].Words > 1) {
                        this.Lines[CurLine].Spaces += nSpacesCount;
                    }
                    if (bWord && this.Lines[CurLine].Ranges[CurRange].Words > 1) {
                        this.Lines[CurLine].Ranges[CurRange].Spaces += nSpacesCount;
                    }
                    if (bWord) {
                        X += nSpaceLen;
                        nSpaceLen = 0;
                    }
                    bNewLine = true;
                    bNeedNewLine = false;
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
                    }
                    bNewLine = true;
                    bEnd = true;
                    break;
                case para_InlineBreak:
                    case para_PageBreakRendered:
                }
            }
            if (bNewLine || (bNeedNewLine && Pos < this.Content.length - 1 && para_Text == this.Content[Pos + 1].Type)) {
                nSpaceLen = 0;
                if (bNeedNewLine && true != bEnd) {
                    this.Internal_Content_Add(Pos + 1, new ParaNewLineRendered());
                    Pos++;
                }
                if (true === bEmptyLine) {
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
                bEmptyLine = true;
                bNewLine = false;
                bNewRange = false;
                bNeedNewLine = false;
                bNeedNewRange = false;
                bFirstItemOnLine = true;
                bStartWord = false;
                var TempDy = this.Lines[this.Pages[CurPage].FirstLine].Metrics.Ascent;
                if (0 === this.Pages[CurPage].FirstLine && (0 === CurPage || true === this.Parent.Is_TableCellContent())) {
                    TempDy += ParaPr.Spacing.Before;
                }
                if (0 === this.Pages[CurPage].FirstLine) {
                    if ((true === ParaPr.Brd.First || 1 === CurPage) && border_Single === ParaPr.Brd.Top.Value) {
                        TempDy += ParaPr.Brd.Top.Size;
                    } else {
                        if (false === ParaPr.Brd.First && border_Single === ParaPr.Brd.Between.Value) {
                            TempDy += ParaPr.Brd.Between.Size;
                        }
                    }
                }
                var Top, Bottom;
                var LastPage_Bottom = this.Pages[CurPage].Bounds.Bottom;
                if (0 != CurLine) {
                    if (CurLine != this.Pages[CurPage].FirstLine) {
                        Top = Y + TempDy + this.Lines[CurLine - 1].Metrics.Descent + this.Lines[CurLine - 1].Metrics.LineGap;
                        this.Lines[CurLine].Top = Top - this.Pages[CurPage].Y;
                        Bottom = Top + this.Lines[CurLine].Metrics.Ascent + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
                        if (bEnd) {
                            Bottom += ParaPr.Spacing.After;
                            if (true === ParaPr.Brd.Last && border_Single === ParaPr.Brd.Bottom.Value) {
                                Bottom += ParaPr.Brd.Bottom.Size;
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
                        this.Lines[CurLine].Top = 0;
                        Bottom = Top + this.Lines[CurLine].Metrics.Ascent + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
                        if (bEnd) {
                            Bottom += ParaPr.Spacing.After;
                            if (true === ParaPr.Brd.Last && border_Single === ParaPr.Brd.Bottom.Value) {
                                Bottom += ParaPr.Brd.Bottom.Size;
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
                    if (0 === CurPage || true === this.Parent.Is_TableCellContent()) {
                        Bottom = Top + ParaPr.Spacing.Before + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent + this.Lines[0].Metrics.LineGap;
                        if (true === ParaPr.Brd.First && border_Single === ParaPr.Brd.Top.Value) {
                            Bottom += ParaPr.Brd.Top.Size;
                        } else {
                            if (false === ParaPr.Brd.First && border_Single === ParaPr.Brd.Between.Value) {
                                Bottom += ParaPr.Brd.Between.Size;
                            }
                        }
                    } else {
                        Bottom = Top + this.Lines[0].Metrics.Ascent + this.Lines[0].Metrics.Descent + this.Lines[0].Metrics.LineGap;
                        if (border_Single === ParaPr.Brd.Top.Value) {
                            Bottom += ParaPr.Brd.Top.Size;
                        }
                    }
                    if (bEnd) {
                        Bottom += ParaPr.Spacing.After;
                        if (true === ParaPr.Brd.Last && border_Single === ParaPr.Brd.Bottom.Value) {
                            Bottom += ParaPr.Brd.Bottom.Size;
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
                var Left = (0 != CurLine ? this.X + ParaPr.Ind.Left : this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine);
                var Right = XLimit;
                if ((Top > this.YLimit || Bottom > this.YLimit) && (CurLine != this.Pages[CurPage].FirstLine || (0 === CurPage && (null != this.Get_DocumentPrev() || true === this.Parent.Is_TableCellContent())))) {
                    bEnd = false;
                    bNewPage = false;
                    if (true === ParaPr.KeepLines && null != this.Get_DocumentPrev() && true != this.Parent.Is_TableCellContent() && 0 === CurPage) {
                        CurLine = 0;
                        LineStart_Pos = 0;
                    }
                    var Pos_temp = Pos;
                    for (var Index = LineStart_Pos; Index <= Pos_temp; Index++) {
                        var Item = this.Content[Index];
                        if (Item.Type == para_NewLineRendered || Item.Type == para_InlineBreak) {
                            this.Internal_Content_Remove(Index);
                            Index--;
                            Pos_temp--;
                        }
                    }
                    this.Pages[CurPage].Bounds.Bottom = LastPage_Bottom;
                    CurPage++;
                    this.Internal_Content_Add(LineStart_Pos, new ParaPageBreakRenderer());
                    LineStart_Pos++;
                    var PageStart = this.Parent.Get_PageContentStartPos(this.PageNum + CurPage);
                    if (0 != CurLine) {
                        X = PageStart.X + ParaPr.Ind.Left;
                    } else {
                        X = PageStart.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
                    }
                    Y = PageStart.Y;
                    this.Pages[CurPage] = new CParaPage(PageStart.X, PageStart.Y, PageStart.XLimit, PageStart.YLimit, CurLine);
                    Pos = LineStart_Pos - 1;
                    this.Lines[CurLine].Reset();
                    LineTextAscent = 0;
                    LineTextDescent = 0;
                    LineAscent = 0;
                    LineDescent = 0;
                    Ranges = this.Parent.CheckRange(X, Y, XLimit, Y, this.PageNum + CurPage, true);
                    RangesCount = Ranges.length;
                    this.Lines[CurLine].Add_Range((0 == CurLine ? this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine : this.X + ParaPr.Ind.Left), (RangesCount == 0 ? XLimit : Ranges[0].X0));
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
                    continue;
                }
                var Ranges2 = this.Parent.CheckRange(this.X, Top, this.XLimit, Bottom, this.PageNum + CurPage, true);
                if (-1 == FlowObjects_CompareRanges(Ranges, Ranges2) && true === FlowObjects_CheckInjection(Ranges, Ranges2)) {
                    bEnd = false;
                    Ranges = Ranges2;
                    var Pos_temp = Pos;
                    for (var Index = LineStart_Pos; Index <= Pos_temp; Index++) {
                        var Item = this.Content[Index];
                        if (Item.Type == para_NewLineRendered || Item.Type == para_InlineBreak) {
                            this.Internal_Content_Remove(Index);
                            Index--;
                            Pos_temp--;
                        }
                    }
                    Pos = LineStart_Pos - 1;
                    if (0 == CurLine) {
                        X = this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
                    } else {
                        X = this.X + ParaPr.Ind.Left;
                    }
                    this.Lines[CurLine].Reset();
                    LineTextAscent = 0;
                    LineTextDescent = 0;
                    LineAscent = 0;
                    LineDescent = 0;
                    RangesCount = Ranges.length;
                    this.Lines[CurLine].Add_Range((0 == CurLine ? this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine : this.X + ParaPr.Ind.Left), (RangesCount == 0 ? XLimit : Ranges[0].X0));
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
                    bNewPage = false;
                    bExtendBoundToBottom = false;
                    nWordLen = 0;
                    nSpacesCount = 0;
                } else {
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
                        this.Lines[CurLine].Ranges[CurRange].W = X - Ranges[CurRange - 1].X1;
                    }
                    if (true === bNewPage) {
                        bNewPage = false;
                        var Next = this.Internal_FindForward(Pos + 1, [para_End, para_NewLine, para_Space, para_Text, para_Drawing, para_Tab, para_PageNum]);
                        if (true === Next.Found && para_End === Next.Type) {
                            Item.Flags.NewLine = false;
                            bExtendBoundToBottom = true;
                            continue;
                        }
                        if (CurLine > 0) {
                            if (CurLine != this.Pages[CurPage].FirstLine) {
                                Y += this.Lines[CurLine - 1].Metrics.Descent + this.Lines[CurLine - 1].Metrics.LineGap + this.Lines[CurLine].Metrics.Ascent;
                            }
                            this.Lines[CurLine].Y = Y - this.Pages[CurPage].Y;
                        }
                        CurPage++;
                        var PageStart = this.Parent.Get_PageContentStartPos(this.PageNum + CurPage);
                        if (0 != CurLine) {
                            X = PageStart.X + ParaPr.Ind.Left;
                        } else {
                            X = PageStart.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
                        }
                        Y = PageStart.Y;
                        this.Pages[CurPage] = new CParaPage(PageStart.X, PageStart.Y, PageStart.XLimit, PageStart.YLimit, CurLine + 1);
                    } else {
                        if (CurLine > 0) {
                            if (CurLine != this.Pages[CurPage].FirstLine) {
                                Y += this.Lines[CurLine - 1].Metrics.Descent + this.Lines[CurLine - 1].Metrics.LineGap + this.Lines[CurLine].Metrics.Ascent;
                            }
                            this.Lines[CurLine].Y = Y - this.Pages[CurPage].Y;
                        }
                        X = this.X + ParaPr.Ind.Left;
                    }
                    if (!bEnd) {
                        CurLine++;
                        this.Lines[CurLine] = new CParaLine();
                        LineTextAscent = 0;
                        LineTextDescent = 0;
                        LineAscent = 0;
                        LineDescent = 0;
                        var TempY = TempDy + Y + this.Lines[CurLine - 1].Metrics.Descent + this.Lines[CurLine - 1].Metrics.LineGap;
                        Ranges = this.Parent.CheckRange(X, TempY, XLimit, TempY, this.PageNum + CurPage, true);
                        RangesCount = Ranges.length;
                        this.Lines[CurLine].Add_Range(X, (RangesCount == 0 ? XLimit : Ranges[0].X0));
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
                    } else {
                        if (true === bEnd && true === bExtendBoundToBottom) {
                            this.Pages[CurPage].Bounds.Bottom = this.Pages[CurPage].YLimit;
                            this.Bounds.Bottom = this.Pages[CurPage].YLimit;
                        }
                    }
                }
            } else {
                if (bNewRange || (bNeedNewRange && Pos < this.Content.length - 1 && para_Text == this.Content[Pos + 1].Type)) {
                    nSpaceLen = 0;
                    if (bNeedNewRange) {
                        this.Internal_Content_Add(Pos + 1, new ParaInlineBreak());
                        Pos++;
                    }
                    bNewRange = false;
                    bNeedNewRange = false;
                    bFirstItemOnLine = true;
                    bStartWord = false;
                    if (0 == CurRange) {
                        if (0 != CurLine) {
                            this.Lines[CurLine].Ranges[CurRange].W = X - this.X - ParaPr.Ind.Left;
                        } else {
                            this.Lines[CurLine].Ranges[CurRange].W = X - this.X - ParaPr.Ind.Left - ParaPr.Ind.FirstLine;
                        }
                    } else {
                        this.Lines[CurLine].Ranges[CurRange].W = X - Ranges[CurRange - 1].X1;
                    }
                    CurRange++;
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
        for (var PageIndex = 0; PageIndex < this.Pages.length; PageIndex++) {
            var StartLine = this.Pages[PageIndex].FirstLine;
            var EndLine = StartLine;
            if (PageIndex != this.Pages.length - 1) {
                EndLine = this.Pages[PageIndex + 1].FirstLine - 1;
            } else {
                EndLine = this.Lines.length - 1;
            }
            var TempDy = this.Lines[this.Pages[PageIndex].FirstLine].Metrics.Ascent;
            if (0 === StartLine && (0 === PageIndex || true === this.Parent.Is_TableCellContent())) {
                TempDy += ParaPr.Spacing.Before;
            }
            if (0 === StartLine) {
                if ((true === ParaPr.Brd.First || 1 === PageIndex) && border_Single === ParaPr.Brd.Top.Value) {
                    TempDy += ParaPr.Brd.Top.Size;
                } else {
                    if (false === ParaPr.Brd.First && border_Single === ParaPr.Brd.Between.Value) {
                        TempDy += ParaPr.Brd.Between.Size;
                    }
                }
            }
            for (var Index = StartLine; Index <= EndLine; Index++) {
                this.Lines[Index].Y += TempDy;
                if (this.Lines[Index].Metrics.LineGap < 0) {
                    this.Lines[Index].Y += this.Lines[Index].Metrics.LineGap;
                }
            }
        }
        return true;
    },
    Internal_Recalculate_0: function (bTableCell) {
        if (pararecalc_0_None === this.RecalcInfo.Recalc_0_Type && bTableCell !== true) {
            return;
        }
        var Pr = this.Get_CompiledPr();
        var ParaPr = Pr.ParaPr;
        var CurTextPr = Pr.TextPr;
        CurTextPr.Update_FontSize();
        g_oTextMeasurer.SetFont(CurTextPr);
        var TextAscent = 0;
        var TextHeight = 0;
        var TextDescent = 0;
        if (Math.abs(CurTextPr.FontSize - CurTextPr.FontSize_S) < 0.01) {
            TextHeight = g_oTextMeasurer.GetHeight();
            TextDescent = Math.abs(g_oTextMeasurer.GetDescender());
        } else {
            var OldSize = CurTextPr.FontSize;
            CurTextPr.FontSize = CurTextPr.FontSize_S;
            g_oTextMeasurer.SetFont(CurTextPr);
            TextHeight = g_oTextMeasurer.GetHeight();
            TextDescent = Math.abs(g_oTextMeasurer.GetDescender());
            CurTextPr.FontSize = OldSize;
            g_oTextMeasurer.SetFont(CurTextPr);
        }
        TextAscent = TextHeight - TextDescent;
        var ContentLength = this.Content.length;
        for (var Pos = 0; Pos < ContentLength; Pos++) {
            var Item = this.Content[Pos];
            Item.Parent = this;
            Item.DocumentContent = this.Parent;
            Item.DrawingDocument = this.Parent.DrawingDocument;
            switch (Item.Type) {
            case para_Numbering:
                var NumPr = ParaPr.NumPr;
                if (undefined === NumPr || undefined === NumPr.NumId) {
                    Item.Measure(g_oTextMeasurer, undefined);
                    break;
                }
                var Numbering = this.Parent.Get_Numbering();
                var NumLvl = Numbering.Get_AbstractNum(NumPr.NumId).Lvl[NumPr.Lvl];
                var NumSuff = NumLvl.Suff;
                var NumInfo = this.Parent.Internal_GetNumInfo(this.Id, NumPr);
                var NumTextPr = this.Get_CompiledPr2(false).TextPr.Copy();
                NumTextPr.Merge(this.TextPr.Value);
                NumTextPr.Merge(NumLvl.TextPr);
                Item.Measure(g_oTextMeasurer, Numbering, NumInfo, NumTextPr, NumPr);
                switch (NumSuff) {
                case numbering_suff_Nothing:
                    break;
                case numbering_suff_Space:
                    var OldFont = g_oTextMeasurer.GetFont();
                    g_oTextMeasurer.SetFont(NumTextPr);
                    Item.WidthSuff = g_oTextMeasurer.Measure(" ").Width;
                    g_oTextMeasurer.SetFont(OldFont);
                    break;
                case numbering_suff_Tab:
                    break;
                }
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
                case para_Drawing:
                case para_PageNum:
                case para_Tab:
                case para_NewLine:
                Item.Measure(g_oTextMeasurer);
                break;
            case para_TextPr:
                CurTextPr = this.Internal_CalculateTextPr(Pos);
                CurTextPr.Update_FontSize();
                g_oTextMeasurer.SetFont(CurTextPr);
                if (Math.abs(CurTextPr.FontSize - CurTextPr.FontSize_S) < 0.01) {
                    TextDescent = Math.abs(g_oTextMeasurer.GetDescender());
                    TextHeight = g_oTextMeasurer.GetHeight();
                } else {
                    var OldSize = CurTextPr.FontSize;
                    CurTextPr.FontSize = CurTextPr.FontSize_S;
                    g_oTextMeasurer.SetFont(CurTextPr);
                    TextDescent = Math.abs(g_oTextMeasurer.GetDescender());
                    TextHeight = g_oTextMeasurer.GetHeight();
                    CurTextPr.FontSize = OldSize;
                    g_oTextMeasurer.SetFont(CurTextPr);
                }
                TextAscent = TextHeight - TextDescent;
                break;
            case para_End:
                bWord = false;
                bSpace = false;
                var bEndCell = false;
                if (null === this.Get_DocumentNext() && true === this.Parent.Is_TableCellContent()) {
                    bEndCell = true;
                }
                var EndTextPr = this.Get_CompiledPr2(false).TextPr.Copy();
                EndTextPr.Merge(this.TextPr.Value);
                g_oTextMeasurer.SetFont(EndTextPr);
                Item.Measure(g_oTextMeasurer, bEndCell);
                g_oTextMeasurer.SetFont(CurTextPr);
                break;
            }
            Item.TextAscent = TextAscent;
            Item.TextDescent = TextDescent;
            Item.TextHeight = TextHeight;
        }
        this.RecalcInfo.Set_Type_0(pararecalc_0_None);
    },
    Internal_Recalculate_2: function (Pos, UpdateTarget, ReturnTarget) {
        var Pr = this.Get_CompiledPr2(false);
        var ParaPr = Pr.ParaPr;
        var Y = this.Pages[0].Y + this.Lines[0].Y;
        var CurLine = 0;
        var CurRange = 0;
        var CurPage = 0;
        var RangesCount = this.Lines[0].Ranges.length;
        var RangeWidth = this.Lines[0].Ranges[0].XEnd - this.X - ParaPr.Ind.Left - ParaPr.Ind.FirstLine;
        var X = 0;
        var JustifySpace = 0;
        var JustifyWord = 0;
        switch (ParaPr.Jc) {
        case align_Left:
            X = this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
            break;
        case align_Right:
            X = this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine + RangeWidth - this.Lines[0].Ranges[0].W;
            break;
        case align_Center:
            X = this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine + (RangeWidth - this.Lines[0].Ranges[0].W) / 2;
            break;
        case align_Justify:
            X = this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
            if (1 == this.Lines[0].Ranges[0].Words) {
                if (1 == RangesCount && this.Lines.length > 1) {
                    var LettersCount = 0;
                    var TempPos = 0;
                    var LastW = 0;
                    while (this.Content[TempPos].Type != para_NewLine && this.Content[TempPos].Type != para_NewLineRendered && this.Content[TempPos].Type != para_InlineBreak) {
                        if (para_Text == this.Content[TempPos].Type) {
                            LettersCount++;
                            LastW = this.Content[TempPos].Width;
                        }
                        TempPos++;
                    }
                    if (RangeWidth - this.Lines[0].Ranges[0].W <= 2 * LastW && LettersCount > 0) {
                        JustifyWord = (RangeWidth - this.Lines[0].Ranges[0].W) / LettersCount;
                    }
                }
            } else {
                if (this.Lines[0].Ranges[0].Spaces > 0 && (CurLine != this.Lines.length - 1 || CurRange != this.Lines[CurLine].Ranges.length - 1)) {
                    JustifySpace = (RangeWidth - this.Lines[0].Ranges[0].W) / this.Lines[0].Ranges[0].Spaces;
                } else {
                    JustifySpace = 0;
                }
            }
            break;
        default:
            X = this.X + ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
            break;
        }
        this.Lines[CurLine].Ranges[CurRange].XVisible = X;
        var bFirstLineItem = true;
        var SpacesCounter = this.Lines[0].Spaces;
        var bFindPos = ("undefined" == typeof(Pos) ? false : true);
        for (var ItemNum = 0; ItemNum < this.Content.length; ItemNum++) {
            var Item = this.Content[ItemNum];
            if (ItemNum == this.CurPos.ContentPos) {
                this.CurPos.X = X;
                this.CurPos.Y = Y;
                this.CurPos.PagesPos = CurPage;
                if (true === UpdateTarget) {
                    var CurTextPr = this.Internal_CalculateTextPr(ItemNum);
                    CurTextPr.Update_FontSize();
                    var Height;
                    var Ascender;
                    if (Math.abs(CurTextPr.FontSize_S - CurTextPr.FontSize) < 0.001) {
                        Height = Item.TextHeight;
                        Ascender = Item.TextAscent;
                    } else {
                        var Koef = (CurTextPr.FontSize / CurTextPr.FontSize_S);
                        Height = Item.TextHeight * Koef;
                        Ascender = Item.TextAscent * Koef;
                    }
                    this.DrawingDocument.SetTargetSize(Height);
                    var TargetY = Y - Ascender;
                    switch (CurTextPr.VertAlign) {
                    case vertalign_SubScript:
                        TargetY -= CurTextPr.FontSize_S * g_dKoef_pt_to_mm * vertalign_Koef_Sub;
                        break;
                    case vertalign_SuperScript:
                        TargetY -= CurTextPr.FontSize_S * g_dKoef_pt_to_mm * vertalign_Koef_Super;
                        break;
                    }
                    var Page_Abs = this.Get_StartPage_Absolute() + CurPage;
                    this.DrawingDocument.UpdateTarget(X, TargetY, Page_Abs);
                }
            }
            if (bFindPos && Pos == ItemNum) {
                if (true === ReturnTarget) {
                    var CurTextPr = this.Internal_CalculateTextPr(ItemNum);
                    CurTextPr.Update_FontSize();
                    var Height;
                    var Ascender;
                    if (Math.abs(CurTextPr.FontSize_S - CurTextPr.FontSize) < 0.001) {
                        Height = Item.TextHeight;
                        Ascender = Item.TextAscent;
                    } else {
                        var Koef = (CurTextPr.FontSize / CurTextPr.FontSize_S);
                        Height = Item.TextHeight * Koef;
                        Ascender = Item.TextAscent * Koef;
                    }
                    var TargetY = Y - Ascender;
                    switch (CurTextPr.VertAlign) {
                    case vertalign_SubScript:
                        TargetY -= CurTextPr.FontSize_S * g_dKoef_pt_to_mm * vertalign_Koef_Sub;
                        break;
                    case vertalign_SuperScript:
                        TargetY -= CurTextPr.FontSize_S * g_dKoef_pt_to_mm * vertalign_Koef_Super;
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
                break;
            case para_Space:
                if (!bFirstLineItem && CurLine != this.Lines.length - 1 && SpacesCounter > 0) {
                    Item.WidthVisible = Item.Width + JustifySpace;
                    SpacesCounter--;
                } else {
                    Item.WidthVisible = Item.Width;
                }
                X += Item.WidthVisible;
                break;
            case para_Drawing:
                if (true != bFindPos) {
                    Item.Update_Position(X, Y - Item.H, this.Get_StartPage_Absolute() + CurPage);
                }
                X += Item.WidthVisible;
                break;
            case para_PageNum:
                case para_Tab:
                X += Item.WidthVisible;
                break;
            case para_TextPr:
                break;
            case para_End:
                X += Item.Width;
                break;
            case para_InlineBreak:
                CurRange++;
                var Range = this.Lines[CurLine].Ranges[CurRange];
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
                            var TempPos = 0;
                            var LastW = 0;
                            while (this.Content[TempPos].Type != para_NewLine && this.Content[TempPos].Type != para_NewLineRendered && this.Content[TempPos].Type != para_InlineBreak) {
                                if (para_Text == this.Content[TempPos].Type) {
                                    LettersCount++;
                                    LastW = this.Content[TempPos].Width;
                                }
                                TempPos++;
                            }
                            if (RangeWidth - this.Lines[0].Ranges[0].W <= 2 * LastW && LettersCount > 0) {
                                JustifyWord = (RangeWidth - this.Lines[0].Ranges[0].W) / LettersCount;
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
                break;
            case para_NewLine:
                if (break_Page === Item.BreakType && true === Item.Flags.NewLine) {
                    CurPage++;
                } else {
                    if (break_Page === Item.BreakType && false === Item.Flags.NewLine) {
                        X += Item.WidthVisible;
                        break;
                    }
                }
                X += Item.Width;
            case para_NewLineRendered:
                JustifyWord = 0;
                JustifySpace = 0;
                CurLine++;
                CurRange = 0;
                Y = this.Pages[CurPage].Y + this.Lines[CurLine].Y;
                var bFirstLineItem = true;
                var Range = this.Lines[CurLine].Ranges[CurRange];
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
                            var TempPos = 0;
                            var LastW = 0;
                            while (this.Content[TempPos].Type != para_NewLine && this.Content[TempPos].Type != para_NewLineRendered && this.Content[TempPos].Type != para_InlineBreak) {
                                if (para_Text == this.Content[TempPos].Type) {
                                    LettersCount++;
                                    LastW = this.Content[TempPos].Width;
                                }
                                TempPos++;
                            }
                            if (RangeWidth - this.Lines[0].Ranges[0].W <= 2 * LastW && LettersCount > 0) {
                                JustifyWord = (RangeWidth - this.Lines[0].Ranges[0].W) / LettersCount;
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
                break;
            case para_PageBreakRendered:
                CurPage++;
                Y = this.Pages[CurPage].Y + this.Lines[CurLine].Y;
                break;
            }
        }
    },
    Internal_Recalculate_1_LineGap: function (ParaPr, TextAscent, TextDescent) {
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
            if (false === this.Content[Index].Is_RealContent()) {
                Counter++;
            }
        }
        return Pos - Counter;
    },
    Internal_Get_RealPos: function (Pos) {
        var Counter = Pos;
        for (var Index = 0; Index <= Math.min(Counter, this.Content.length - 1); Index++) {
            if (false === this.Content[Index].Is_RealContent()) {
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
    Recalculate: function (bTableCell) {
        if (para_PresentationNumbering != this.Content[0].Type) {
            this.Internal_Content_Add(0, new ParaPresentationNumbering(this.PresentationPr.Bullet));
        }
        for (var Pos = 1; Pos < this.Content.length; Pos++) {
            var Item = this.Content[Pos];
            switch (Item.Type) {
            case para_FlowObjectAnchor:
                this.Internal_Content_Remove(Pos);
                Pos--;
                break;
            case para_Numbering:
                case para_PresentationNumbering:
                this.Internal_Content_Remove(Pos);
                Pos--;
                break;
            case para_NewLineRendered:
                case para_InlineBreak:
                case para_PageBreakRendered:
                this.Internal_Content_Remove(Pos);
                Pos--;
                break;
            case para_CollaborativeChangesEnd:
                case para_CollaborativeChangesStart:
                if (true === this.DeleteCollaborativeMarks) {
                    this.Internal_Content_Remove(Pos);
                    Pos--;
                }
                break;
            case para_TextPr:
                if (Pos > 0 && this.Content[Pos - 1].Type == para_TextPr && Pos != this.CurPos.ContentPos) {
                    this.Internal_Content_Remove(Pos - 1);
                    Pos--;
                }
                break;
            case para_CommentStart:
                case para_CommentEnd:
                if (null === editor.WordControl.m_oLogicDocument.Comments.Get_ById(Item.Id)) {
                    this.Internal_Content_Remove(Pos);
                    Pos--;
                }
                break;
            case para_NewLine:
                if (Item.Type === para_NewLine && break_Page === Item.BreakType) {
                    Item.Flags.NewLine = true;
                }
                break;
            case para_Empty:
                if (Item.Type === para_Empty && true === Item.Check_Delete()) {
                    this.Internal_Content_Remove(Pos);
                    Pos--;
                }
                break;
            }
        }
        this.Internal_Recalculate_0(bTableCell);
        this.Internal_Recalculate_1();
        this.Internal_Recalculate_2();
        this.FontMap.NeedRecalc = true;
    },
    RecalculateCurPos: function () {
        this.Internal_Recalculate_2(this.CurPos.ContentPos, true);
    },
    increaseLevel: function (bIncrease) {
        var _cur_level = this.PresentationPr.Level;
        var _new_level;
        var _history_obj;
        var _content_index;
        var _content = this.Content;
        var _text_pr_value;
        var _old_font_size;
        var _new_font_size;
        var _new_indent;
        if (bIncrease) {
            if (_cur_level < 8) {
                _new_level = _cur_level + 1;
                this.Set_PresentationLevel(_new_level);
                if (this.Pr.Ind && this.Pr.Ind.Left != undefined) {
                    this.Set_Ind({
                        FirstLine: this.Pr.Ind.FirstLine,
                        Left: this.Pr.Ind.Left + 11.1125
                    });
                }
                for (_content_index = 0; _content_index < _content.length; ++_content_index) {
                    if (_content[_content_index].Type == para_TextPr) {
                        _text_pr_value = _content[_content_index].Value;
                        if (_text_pr_value != undefined && _text_pr_value.FontSize != undefined && (_text_pr_value.FontSize - 4) > 0) {
                            _old_font_size = _text_pr_value.FontSize;
                            _text_pr_value.FontSize -= 4;
                            _new_font_size = _text_pr_value.FontSize;
                            _history_obj = {};
                            _history_obj.Type = history_undo_redo_const;
                            _history_obj.textPr = _text_pr_value;
                            _history_obj.oldFontSize = _old_font_size;
                            _history_obj.newFontSize = _new_font_size;
                            _history_obj.undo_function = function (data) {
                                data.textPr.FontSize = data.oldFontSize;
                            };
                            _history_obj.redo_function = function (data) {
                                data.textPr.FontSize = data.newFontSize;
                            };
                            History.Add(this, _history_obj);
                        }
                    }
                }
                this.Recalc_CompiledPr();
            }
        } else {
            if (_cur_level > 0) {
                _new_level = _cur_level - 1;
                this.Set_PresentationLevel(_new_level);
                if (this.Pr.Ind && this.Pr.Ind.Left != undefined) {
                    _new_indent = this.Pr.Ind.Left - 11.1125;
                    if (_new_indent < 0) {
                        _new_indent = 0;
                    }
                    this.Set_Ind({
                        FirstLine: this.Pr.Ind.FirstLine,
                        Left: _new_indent
                    });
                }
                this.Recalc_CompiledPr();
                for (_content_index = 0; _content_index < _content.length; ++_content_index) {
                    if (_content[_content_index].Type == para_TextPr) {
                        _text_pr_value = _content[_content_index].Value;
                        if (_text_pr_value != undefined && _text_pr_value.FontSize != undefined) {
                            _old_font_size = _text_pr_value.FontSize;
                            _text_pr_value.FontSize += 4;
                            _new_font_size = _text_pr_value.FontSize;
                            _history_obj = {};
                            _history_obj.Type = history_undo_redo_const;
                            _history_obj.textPr = _text_pr_value;
                            _history_obj.oldFontSize = _old_font_size;
                            _history_obj.newFontSize = _new_font_size;
                            _history_obj.undo_function = function (data) {
                                data.textPr.FontSize = data.oldFontSize;
                            };
                            _history_obj.redo_function = function (data) {
                                data.textPr.FontSize = data.newFontSize;
                            };
                            History.Add(this, _history_obj);
                        }
                    }
                }
            }
        }
    },
    Draw: function (PageNum, pGraphics) {
        var PNum = "number" == typeof(PageNum) ? PageNum - this.PageNum : 0;
        var PageBreak = PNum;
        var Item;
        var StartPos = 0;
        var CollaborativeChanges = 0;
        while (PageBreak > 0 && StartPos < this.Content.length) {
            Item = this.Content[StartPos];
            if (para_PageBreakRendered == Item.Type || (para_NewLine == Item.Type && break_Page === Item.BreakType && true === Item.Flags.NewLine)) {
                PageBreak--;
            } else {
                if (para_CollaborativeChangesEnd == Item.Type) {
                    CollaborativeChanges--;
                } else {
                    if (para_CollaborativeChangesStart == Item.Type) {
                        CollaborativeChanges++;
                    }
                }
            }
            StartPos++;
        }
        var DocumentComments = editor.WordControl.m_oLogicDocument.Comments;
        var bDrawComments = DocumentComments.Is_Use();
        var CommentsFlag = DocumentComments.Check_CurrentDraw();
        var Pr = {
            TextPr: null,
            ParaPr: null
        };
        var CurTextPr = this.Internal_CalculateTextPr(StartPos, Pr);
        CurTextPr.Update_FontSize();
        pGraphics.SetFont(CurTextPr);
        pGraphics.b_color1(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
        var CurLine = this.Pages[PNum].FirstLine;
        var CurRange = 0;
        var bFirstLineItem = true;
        var SpacesCounter = this.Lines[CurLine].Ranges[CurRange].Spaces;
        var Y = this.Pages[PNum].Y + this.Lines[CurLine].Y;
        var X = this.Lines[CurLine].Ranges[CurRange].XVisible;
        var bEnd = false;
        var bNewPage = false;
        var bNeedDrawBackgdound = true;
        var bNeedDrawSidesLines = true;
        var HyperPos = this.Internal_FindBackward(StartPos, [para_HyperlinkStart, para_HyperlinkEnd]);
        var bVisitedHyperlink = false;
        if (true === HyperPos.Found && para_HyperlinkStart === HyperPos.Type) {
            bVisitedHyperlink = this.Content[HyperPos.LetterPos].Get_Visited();
        }
        if (true === editor.ShowParaMarks && ((0 === PNum && (this.Pages.length <= 1 || this.Pages[1].FirstLine > 0)) || (1 === PNum && this.Pages.length > 1 && this.Pages[1].FirstLine === 0)) && (true === Pr.ParaPr.KeepLines || true === Pr.ParaPr.PageBreakBefore)) {
            var SpecFont = {
                FontFamily: {
                    Name: "Arial",
                    Index: -1
                },
                FontSize: 12,
                Italic: false,
                Bold: false
            };
            var OldFont = pGraphics.GetFont();
            var OldColor = CurTextPr.Color;
            var SpecSym = String.fromCharCode(9642);
            pGraphics.SetFont(SpecFont);
            pGraphics.b_color1(0, 0, 0, 255);
            var SpecW = 2.5;
            var SpecX = Math.min(X, this.X) - SpecW;
            pGraphics.FillText(SpecX, Y, SpecSym);
            pGraphics.SetFont(OldFont);
            pGraphics.b_color1(OldColor.r, OldColor.g, OldColor.b, 255);
        }
        Pr = {
            TextPr: null,
            ParaPr: null
        };
        CurTextPr = this.Internal_CalculateTextPr(StartPos, Pr);
        CurTextPr.Update_FontSize();
        pGraphics.SetFont(CurTextPr);
        pGraphics.b_color1(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
        CurLine = this.Pages[PNum].FirstLine;
        CurRange = 0;
        bFirstLineItem = true;
        SpacesCounter = this.Lines[CurLine].Ranges[CurRange].Spaces;
        Y = this.Pages[PNum].Y + this.Lines[CurLine].Y;
        X = this.Lines[CurLine].Ranges[CurRange].XVisible;
        bEnd = false;
        bNewPage = false;
        for (var ItemNum = StartPos; ItemNum < this.Content.length; ItemNum++) {
            var bNewRange = false;
            var bNewLine = false;
            var TempY = Y;
            switch (CurTextPr.VertAlign) {
            case vertalign_SubScript:
                Y -= vertalign_Koef_Sub * CurTextPr.FontSize_S * g_dKoef_pt_to_mm;
                break;
            case vertalign_SuperScript:
                Y -= vertalign_Koef_Super * CurTextPr.FontSize_S * g_dKoef_pt_to_mm;
                break;
            }
            var Item = this.Content[ItemNum];
            switch (Item.Type) {
            case para_Numbering:
                var NumPr = Pr.ParaPr.NumPr;
                if (undefined === NumPr || undefined === NumPr.NumId) {
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
                    var oldFont = pGraphics.GetFont();
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
                    pGraphics.SetFont(oldFont);
                }
                var bIsSetColor = false;
                if (true === NumTextPr.Strikeout) {
                    if (!bIsSetColor) {
                        pGraphics.p_color(NumTextPr.Color.r, NumTextPr.Color.g, NumTextPr.Color.b, 255);
                        bIsSetColor = true;
                    }
                    pGraphics.drawHorLine(0, (Y - NumTextPr.FontSize * g_dKoef_pt_to_mm * 0.27), X_start, X_start + Item.WidthNum, (NumTextPr.FontSize / 18) * g_dKoef_pt_to_mm);
                }
                if (true === NumTextPr.Underline) {
                    if (!bIsSetColor) {
                        pGraphics.p_color(NumTextPr.Color.r, NumTextPr.Color.g, NumTextPr.Color.b, 255);
                        bIsSetColor = true;
                    }
                    pGraphics.drawHorLine(0, (Y + this.Lines[CurLine].Metrics.TextDescent * 0.4), X_start, X_start + Item.WidthNum, (NumTextPr.FontSize / 18) * g_dKoef_pt_to_mm);
                }
                pGraphics.p_color(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
                pGraphics.b_color1(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
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
                    pGraphics.p_color(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
                    pGraphics.b_color1(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
                }
                X += Item.WidthVisible;
                break;
            case para_PageNum:
                case para_Drawing:
                case para_Tab:
                case para_Text:
                var bIsSetColor = false;
                if (true === bVisitedHyperlink) {
                    pGraphics.p_color(128, 0, 151, 255);
                    pGraphics.b_color1(128, 0, 151, 255);
                    bIsSetColor = true;
                }
                bFirstLineItem = false;
                if (para_PageNum != Item.Type) {
                    Item.Draw(X, Y, pGraphics);
                } else {
                    Item.Draw(X, Y, pGraphics, this.Get_StartPage_Absolute() + PNum, Pr.ParaPr.Jc);
                }
                if (true === CurTextPr.Strikeout) {
                    if (!bIsSetColor) {
                        pGraphics.p_color(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
                        bIsSetColor = true;
                    }
                    pGraphics.drawHorLine(0, (Y - CurTextPr.FontSize * g_dKoef_pt_to_mm * 0.27), X, X + Item.WidthVisible, (CurTextPr.FontSize / 18) * g_dKoef_pt_to_mm);
                }
                if (true === CurTextPr.Underline) {
                    if (!bIsSetColor) {
                        pGraphics.p_color(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
                        bIsSetColor = true;
                    }
                    pGraphics.drawHorLine(0, (Y + this.Lines[CurLine].Metrics.TextDescent * 0.4), X, X + Item.WidthVisible, (CurTextPr.FontSize / 18) * g_dKoef_pt_to_mm);
                }
                if (true === bVisitedHyperlink) {
                    pGraphics.p_color(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
                    pGraphics.b_color1(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
                }
                X += Item.WidthVisible;
                break;
            case para_Space:
                if (SpacesCounter > 0 || (bFirstLineItem && this.Lines[CurLine].Words > 0)) {
                    if (!bFirstLineItem && this.Lines[CurLine].Words > 0) {
                        SpacesCounter--;
                    }
                    var bIsSetColor = false;
                    if (true === CurTextPr.Strikeout) {
                        if (!bIsSetColor) {
                            pGraphics.p_color(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
                            bIsSetColor = true;
                        }
                        pGraphics.drawHorLine(0, (Y - CurTextPr.FontSize * g_dKoef_pt_to_mm * 0.27), X, X + Item.WidthVisible, (CurTextPr.FontSize / 18) * g_dKoef_pt_to_mm);
                    }
                    if (true === CurTextPr.Underline) {
                        if (!bIsSetColor) {
                            pGraphics.p_color(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
                            bIsSetColor = true;
                        }
                        pGraphics.drawHorLine(0, (Y + this.Lines[CurLine].Metrics.TextDescent * 0.4), X, X + Item.WidthVisible, (CurTextPr.FontSize / 18) * g_dKoef_pt_to_mm);
                    }
                }
                Item.Draw(X, Y, pGraphics);
                X += Item.WidthVisible;
                break;
            case para_TextPr:
                CurTextPr = this.Internal_CalculateTextPr(ItemNum);
                CurTextPr.Update_FontSize();
                pGraphics.SetFont(CurTextPr);
                pGraphics.b_color1(CurTextPr.Color.r, CurTextPr.Color.g, CurTextPr.Color.b, 255);
                break;
            case para_End:
                var EndTextPr = this.Get_CompiledPr2(false).TextPr.Copy();
                EndTextPr.Merge(this.TextPr.Value);
                pGraphics.SetFont(EndTextPr);
                pGraphics.b_color1(EndTextPr.Color.r, EndTextPr.Color.g, EndTextPr.Color.b, 255);
                pGraphics.p_color(EndTextPr.Color.r, EndTextPr.Color.g, EndTextPr.Color.b, 255);
                bEnd = true;
                var bEndCell = false;
                if (null === this.Get_DocumentNext() && true === this.Parent.Is_TableCellContent()) {
                    bEndCell = true;
                }
                Item.Draw(X, Y, pGraphics, bEndCell);
                X += Item.Width;
                break;
            case para_InlineBreak:
                bNewRange = true;
                CurRange++;
                SpacesCounter = this.Lines[CurLine].Ranges[CurRange].Spaces;
                X = this.Lines[CurLine].Ranges[CurRange].XVisible;
                break;
            case para_NewLine:
                Item.Draw(X, Y, pGraphics);
                X += Item.WidthVisible;
                if (break_Page === Item.BreakType && true === Item.Flags.NewLine) {
                    bNewPage = true;
                    break;
                } else {
                    if (break_Page === Item.BreakType && false === Item.Flags.NewLine) {
                        break;
                    }
                }
            case para_NewLineRendered:
                CurLine++;
                CurRange = 0;
                bFirstLineItem = true;
                SpacesCounter = this.Lines[CurLine].Ranges[CurRange].Spaces;
                Y = this.Pages[PNum].Y + this.Lines[CurLine].Y;
                X = this.Lines[CurLine].Ranges[CurRange].XVisible;
                bNewLine = true;
                break;
            case para_PageBreakRendered:
                bNewPage = true;
                break;
            case para_HyperlinkStart:
                bVisitedHyperlink = Item.Get_Visited();
                break;
            case para_HyperlinkEnd:
                bVisitedHyperlink = false;
                break;
            }
            if (true === bNewPage) {
                break;
            }
            if (true != bNewLine) {
                Y = TempY;
            }
            if (true === bNewLine || true === bNewRange) {
                bNeedDrawBackgdound = true;
            }
            if (true === bNewLine) {
                bNeedDrawSidesLines = true;
            }
        }
        var X_left = Math.min(this.Pages[PNum].X + Pr.ParaPr.Ind.Left, this.Pages[PNum].X + Pr.ParaPr.Ind.Left + Pr.ParaPr.Ind.FirstLine);
        var X_right = this.Pages[PNum].XLimit - Pr.ParaPr.Ind.Right;
        if (Pr.ParaPr.Brd.Left.Value === border_Single) {
            X_left -= 1.9;
        } else {
            X_left -= 1;
        }
        if (Pr.ParaPr.Brd.Right.Value === border_Single) {
            X_right += 1.9;
        } else {
            X_right += 1;
        }
        var LeftMW = -(border_Single === Pr.ParaPr.Brd.Left.Value ? Pr.ParaPr.Brd.Left.Size : 0);
        var RightMW = (border_Single === Pr.ParaPr.Brd.Right.Value ? Pr.ParaPr.Brd.Right.Size : 0);
        if (true === Pr.ParaPr.Brd.First && border_Single === Pr.ParaPr.Brd.Top.Value && ((0 === PNum && (false === this.Is_StartFromNewPage() || null === this.Get_DocumentPrev())) || (1 === PNum && true === this.Is_StartFromNewPage()))) {
            var Y_top = this.Pages[PNum].Y;
            if (0 === PNum) {
                Y_top += Pr.ParaPr.Spacing.Before;
            }
            var OldColor = CurTextPr.Color;
            pGraphics.p_color(Pr.ParaPr.Brd.Top.Color.r, Pr.ParaPr.Brd.Top.Color.g, Pr.ParaPr.Brd.Top.Color.b, 255);
            pGraphics.drawHorLineExt(c_oAscLineDrawingRule.Top, Y_top, X_left, X_right, Pr.ParaPr.Brd.Top.Size, LeftMW, RightMW);
            pGraphics.p_color(OldColor.r, OldColor.g, OldColor.b, 255);
        } else {
            if (false === Pr.ParaPr.Brd.First) {
                var OldColor = CurTextPr.Color;
                if (1 === PNum && true === this.Is_StartFromNewPage() && border_Single === Pr.ParaPr.Brd.Top.Value) {
                    pGraphics.p_color(Pr.ParaPr.Brd.Top.Color.r, Pr.ParaPr.Brd.Top.Color.g, Pr.ParaPr.Brd.Top.Color.b, 255);
                    pGraphics.drawHorLineExt(c_oAscLineDrawingRule.Top, this.Pages[PNum].Y + this.Lines[this.Pages[PNum].FirstLine].Top, X_left, X_right, Pr.ParaPr.Brd.Top.Size, LeftMW, RightMW);
                } else {
                    if (0 === PNum && false === this.Is_StartFromNewPage() && border_Single === Pr.ParaPr.Brd.Between.Value) {
                        pGraphics.p_color(Pr.ParaPr.Brd.Between.Color.r, Pr.ParaPr.Brd.Between.Color.g, Pr.ParaPr.Brd.Between.Color.b, 255);
                        pGraphics.drawHorLineExt(c_oAscLineDrawingRule.Top, this.Pages[PNum].Y, X_left, X_right, Pr.ParaPr.Brd.Between.Size, LeftMW, RightMW);
                    }
                }
                pGraphics.p_color(OldColor.r, OldColor.g, OldColor.b, 255);
            }
        }
        if (true === bEnd && true === Pr.ParaPr.Brd.Last && border_Single === Pr.ParaPr.Brd.Bottom.Value) {
            var OldColor = CurTextPr.Color;
            var TempY = this.Pages[PNum].Y;
            var NextEl = this.Get_DocumentNext();
            var DrawLineRule = c_oAscLineDrawingRule.Bottom;
            if (null != NextEl && type_Paragraph === NextEl.GetType() && true === NextEl.Is_StartFromNewPage()) {
                TempY = this.Pages[PNum].Y + this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap;
                DrawLineRule = c_oAscLineDrawingRule.Top;
            } else {
                TempY = this.Pages[PNum].Y + this.Lines[CurLine].Bottom - Pr.ParaPr.Spacing.After;
                DrawLineRule = c_oAscLineDrawingRule.Bottom;
            }
            pGraphics.p_color(Pr.ParaPr.Brd.Bottom.Color.r, Pr.ParaPr.Brd.Bottom.Color.g, Pr.ParaPr.Brd.Bottom.Color.b, 255);
            pGraphics.drawHorLineExt(DrawLineRule, TempY, X_left, X_right, Pr.ParaPr.Brd.Bottom.Size, LeftMW, RightMW);
            pGraphics.p_color(OldColor.r, OldColor.g, OldColor.b, 255);
        } else {
            if (true === bEnd && false === Pr.ParaPr.Brd.Last && border_Single === Pr.ParaPr.Brd.Bottom.Value) {
                var NextEl = this.Get_DocumentNext();
                if (null != NextEl && type_Paragraph === NextEl.GetType() && true === NextEl.Is_StartFromNewPage()) {
                    var OldColor = CurTextPr.Color;
                    pGraphics.p_color(Pr.ParaPr.Brd.Bottom.Color.r, Pr.ParaPr.Brd.Bottom.Color.g, Pr.ParaPr.Brd.Bottom.Color.b, 255);
                    pGraphics.drawHorLineExt(c_oAscLineDrawingRule.Top, this.Pages[PNum].Y + this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent + this.Lines[CurLine].Metrics.LineGap, X_left, X_right, Pr.ParaPr.Brd.Bottom.Size, LeftMW, RightMW);
                    pGraphics.p_color(OldColor.r, OldColor.g, OldColor.b, 255);
                }
            }
        }
        if (bNewPage) {
            return -1;
        }
        return 0;
    },
    ReDraw: function () {
        this.Parent.OnContentReDraw(this.Get_StartPage_Absolute(), this.Get_StartPage_Absolute() + this.Pages.length - 1);
    },
    Remove: function (nCount, bOnlyText) {
        this.DeleteCollaborativeMarks = true;
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
                var Styles = this.Get_Styles();
                var StyleTextPr = Styles.Get_Pr(CurTextPr.RStyle, styles_Character).TextPr;
                TextPr.Merge(StyleTextPr);
            }
            TextPr.Merge(CurTextPr);
        }
        return TextPr;
    },
    Internal_CalculateTextPr2: function (LetterPos, StartPr) {
        var TextPr = {};
        if (LetterPos < 0) {
            return TextPr;
        }
        var Pos = this.Internal_FindBackward(LetterPos, [para_TextPr]);
        if (true === Pos.Found) {
            var CurTextPr = this.Content[Pos.LetterPos].Value;
            for (var Item in CurTextPr) {
                TextPr[Item] = CurTextPr[Item];
            }
        }
        return TextPr;
    },
    Internal_CalculateTextPr3: function (LetterPos, StartPr) {
        var Pr = this.Get_CompiledPr();
        if ("undefined" != typeof(StartPr)) {
            StartPr.ParaPr = Pr.ParaPr;
            StartPr.TextPr = Pr.TextPr;
        }
        var TextPr = Pr.TextPr.Copy();
        if (LetterPos < 0) {
            return TextPr;
        }
        var Pos = this.Internal_FindBackward(LetterPos, [para_TextPr]);
        if (true === Pos.Found) {
            var CurTextPr = this.Content[Pos.LetterPos].Value;
            if ("undefined" != typeof(CurTextPr.StyleId)) {
                var Styles = this.Get_Styles();
                var StyleTextPr = Styles.Get_Pr(CurTextPr.StyleId, styles_Character).TextPr;
                for (var Item in StyleTextPr) {
                    TextPr[Item] = StyleTextPr[Item];
                }
            }
            for (var Item in CurTextPr) {
                TextPr[Item] = CurTextPr[Item];
            }
        }
        return TextPr;
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
                var Styles = this.Get_Styles();
                var StyleTextPr = Styles.Get_Pr(CurTextPr.RStyle, styles_Character).TextPr;
                TextPr.Merge(StyleTextPr);
            }
            TextPr.Merge(CurTextPr);
        }
        return TextPr;
    },
    Add: function (Item) {
        var Line = this.Content;
        var CurPos = this.CurPos.ContentPos;
        if ("undefined" != typeof(Item.Parent)) {
            Item.Parent = this;
        }
        switch (Item.Type) {
        case para_Text:
            this.Internal_Content_Add(CurPos, Item);
            break;
        case para_Space:
            this.Internal_Content_Add(CurPos, Item);
            break;
        case para_TextPr:
            if (Item.Value.unifill && Item.Value.unifill.fill) {
                History.Add(this, {
                    Type: history_undo_redo_const,
                    undo_function: function (data) {
                        this.Parent.Parent.calculateText3(this);
                    },
                    redo_function: function (data) {}
                });
            }
            this.Internal_AddTextPr(Item.Value);
            if (Item.Value.unifill && Item.Value.unifill.fill) {
                this.Parent.Parent.calculateText3(this);
                History.Add(this, {
                    Type: history_undo_redo_const,
                    undo_function: function (data) {},
                    redo_function: function (data) {
                        this.Parent.Parent.calculateText3(this);
                    }
                });
            }
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
            if (undefined != typeof(TextPr_start.FontSize)) {
                TextPr_start.FontSize = this.Internal_IncDecFontSize(bIncrease, TextPr_start.FontSize);
            } else {
                TextPr_start.FontSize = this.Internal_IncDecFontSize(bIncrease, StartTextPr.FontSize);
            }
            this.Internal_Content_Add(Pos, new ParaTextPr(TextPr_start));
            this.CurPos.ContentPos = Pos + 1;
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
                if (undefined != typeof(TextPr_new.FontSize)) {
                    TextPr_new.FontSize = this.Internal_IncDecFontSize(bIncrease, TextPr_new.FontSize);
                } else {
                    TextPr_new.FontSize = this.Internal_IncDecFontSize(bIncrease, StartTextPr.FontSize);
                }
                this.Internal_Content_Add(CurPos, new ParaTextPr(TextPr_old));
                this.Internal_Content_Add(CurPos, new ParaEmpty(true));
                this.Internal_Content_Add(CurPos, new ParaTextPr(TextPr_new));
                this.CurPos.ContentPos = CurPos + 1;
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
    canIncreaseIndent: function (bIncrease) {
        if (bIncrease) {
            if (this.PresentationPr.Level == 8) {
                return false;
            }
            if (this.rPr.FontSize != undefined && (this.rPr.FontSize - 4) < 1) {
                return false;
            }
            var _content_index;
            var _content = this.Content;
            var _content_count = _content.length;
            for (_content_index = 0; _content_index < _content_count; ++_content_index) {
                if (_content[_content_index].Type == para_TextPr) {
                    if (_content[_content_index].Value.FontSize != undefined && (_content[_content_index].Value.FontSize - 4) < 1) {
                        return false;
                    }
                }
            }
            return true;
        } else {
            return this.PresentationPr.Level > 0;
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
        this.Internal_Recalculate_2(this.CurPos.ContentPos, false);
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
        this.Internal_Recalculate_2(this.CurPos.ContentPos, false);
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
        var CurLine = 0,
        Pos;
        for (Pos = this.CurPos.ContentPos - 1; Pos >= 0; Pos--) {
            if ((para_NewLine == this.Content[Pos].Type && true === this.Content[Pos].Is_NewLine()) || para_NewLineRendered == this.Content[Pos].Type) {
                CurLine++;
            }
        }
        var Result = true;
        if (true === this.Selection.Use) {
            if (true === AddToSelect) {
                this.CurPos.ContentPos = this.Selection.EndPos;
                CurLine = 0;
                for (Pos = this.CurPos.ContentPos - 1; Pos >= 0; Pos--) {
                    if ((para_NewLine == this.Content[Pos].Type && true === this.Content[Pos].Is_NewLine()) || para_NewLineRendered == this.Content[Pos].Type) {
                        CurLine++;
                    }
                }
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
                this.Selection_Remove();
                CurLine = 0;
                for (Pos = this.CurPos.ContentPos - 1; Pos >= 0; Pos--) {
                    if ((para_NewLine == this.Content[Pos].Type && true === this.Content[Pos].Is_NewLine()) || para_NewLineRendered == this.Content[Pos].Type) {
                        CurLine++;
                    }
                }
                this.Internal_Recalculate_2(this.CurPos.ContentPos, false);
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
                CurLine = 0;
                for (Pos = this.CurPos.ContentPos - 1; Pos >= 0; Pos--) {
                    if ((para_NewLine == this.Content[Pos].Type && true === this.Content[Pos].Is_NewLine()) || para_NewLineRendered == this.Content[Pos].Type) {
                        CurLine++;
                    }
                }
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
        var CurLine = 0,
        Pos;
        for (Pos = this.CurPos.ContentPos - 1; Pos >= 0; Pos--) {
            if ((para_NewLine == this.Content[Pos].Type && true === this.Content[Pos].Is_NewLine()) || para_NewLineRendered == this.Content[Pos].Type) {
                CurLine++;
            }
        }
        var Result = true;
        if (true === this.Selection.Use) {
            if (true === AddToSelect) {
                this.CurPos.ContentPos = this.Selection.EndPos;
                CurLine = 0;
                for (Pos = this.CurPos.ContentPos - 1; Pos >= 0; Pos--) {
                    if ((para_NewLine == this.Content[Pos].Type && true === this.Content[Pos].Is_NewLine()) || para_NewLineRendered == this.Content[Pos].Type) {
                        CurLine++;
                    }
                }
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
                this.Selection_Remove();
                CurLine = 0;
                for (Pos = this.CurPos.ContentPos - 1; Pos >= 0; Pos--) {
                    if ((para_NewLine == this.Content[Pos].Type && true === this.Content[Pos].Is_NewLine()) || para_NewLineRendered == this.Content[Pos].Type) {
                        CurLine++;
                    }
                }
                this.Internal_Recalculate_2(this.CurPos.ContentPos, false);
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
                CurLine = 0;
                for (Pos = this.CurPos.ContentPos - 1; Pos >= 0; Pos--) {
                    if ((para_NewLine == this.Content[Pos].Type && true === this.Content[Pos].Is_NewLine()) || para_NewLineRendered == this.Content[Pos].Type) {
                        CurLine++;
                    }
                }
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
        }
        if (true === this.Selection.Use && true === AddToSelect) {
            var oPos = this.Internal_FindForward(this.CurPos.ContentPos, [para_NewLine, para_NewLineRendered, para_Empty]);
            if (oPos.Found) {
                this.Selection.EndPos = oPos.LetterPos;
                if (this.Selection.StartPos == this.Selection.EndPos) {
                    this.Selection_Remove();
                    this.Selection.Use = false;
                    this.CurPos.ContentPos = Math.max(CursorPos_min, Math.min(this.Selection.EndPos, CursorPos_max));
                    this.RecalculateCurPos();
                    return;
                }
            }
        } else {
            if (AddToSelect) {
                var oPos = this.Internal_FindForward(this.CurPos.ContentPos, [para_NewLine, para_NewLineRendered, para_Empty]);
                if (oPos.Found) {
                    this.Selection.StartPos = this.CurPos.ContentPos;
                    this.Selection.Use = true;
                    this.Selection.EndPos = oPos.LetterPos;
                    if (this.Selection.StartPos == this.Selection.EndPos) {
                        this.Selection_Remove();
                        this.Selection.Use = false;
                        this.CurPos.ContentPos = Math.max(CursorPos_min, Math.min(this.Selection.EndPos, CursorPos_max));
                        this.RecalculateCurPos();
                        return;
                    }
                }
            } else {
                var oPos = this.Internal_FindForward(this.CurPos.ContentPos, [para_NewLine, para_NewLineRendered, para_End]);
                if (oPos.Found) {
                    this.CurPos.ContentPos = oPos.LetterPos;
                }
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
        }
        var oPos = this.Internal_FindBackward(this.CurPos.ContentPos - 1, [para_NewLine, para_NewLineRendered, para_PageBreakRendered]);
        if (true === this.Selection.Use && true === AddToSelect) {
            if (oPos.Found) {
                this.Selection.EndPos = oPos.LetterPos + 1;
            } else {
                this.Selection.EndPos = this.Internal_GetStartPos();
            }
            if (this.Selection.StartPos == this.Selection.EndPos) {
                this.Selection_Remove();
                this.Selection.Use = false;
                this.CurPos.ContentPos = Math.max(CursorPos_min, Math.min(this.Selection.EndPos, CursorPos_max));
                this.RecalculateCurPos();
                return;
            }
        } else {
            if (AddToSelect) {
                if (oPos.Found) {
                    this.Selection.EndPos = oPos.LetterPos + 1;
                } else {
                    this.Selection.EndPos = this.Internal_GetStartPos();
                }
                this.Selection.StartPos = this.CurPos.ContentPos;
                this.Selection.Use = true;
                if (this.Selection.StartPos == this.Selection.EndPos) {
                    this.Selection_Remove();
                    this.Selection.Use = false;
                    this.CurPos.ContentPos = Math.max(CursorPos_min, Math.min(this.Selection.EndPos, CursorPos_max));
                    this.RecalculateCurPos();
                    return;
                }
            } else {
                if (oPos.Found) {
                    this.CurPos.ContentPos = oPos.LetterPos + 1;
                } else {
                    this.CurPos.ContentPos = this.Internal_GetStartPos();
                }
                this.RecalculateCurPos();
                this.CurPos.RealX = this.CurPos.X;
                this.CurPos.RealY = this.CurPos.Y;
            }
        }
    },
    Cursor_MoveToStartPos: function () {
        this.Selection.Use = false;
        this.CurPos.ContentPos = this.Internal_GetStartPos();
    },
    Cursor_MoveToEndPos: function () {
        this.Selection.Use = false;
        this.CurPos.ContentPos = this.Internal_GetEndPos();
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
        var oPos = this.Internal_FindForward(0, [para_FlowObjectAnchor, para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_NewLineRendered, para_End]);
        if (true === oPos.Found) {
            return oPos.LetterPos;
        }
        return 0;
    },
    Internal_GetEndPos: function () {
        if (this.Content.length >= 2) {
            return (this.Content.length - 2);
        }
        return 0;
    },
    Internal_MoveCursorBackward: function (AddToSelect, Word) {
        var CursorPos_max = this.Internal_GetEndPos();
        var CursorPos_min = this.Internal_GetStartPos();
        if (true === this.Selection.Use) {
            if (true === AddToSelect) {
                this.CurPos.ContentPos = this.Selection.EndPos;
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
                    oPos = this.Internal_FindBackward(this.CurPos.ContentPos - 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_NewLineRendered]);
                } else {
                    oPos = this.Internal_FindWordStart(this.CurPos.ContentPos - 1, CursorPos_min);
                }
                if (oPos.Found) {
                    this.CurPos.ContentPos = oPos.LetterPos;
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
            if (para_TextPr === Type || para_NewLineRendered === Type || para_FlowObjectAnchor === Type || para_Space === Type || para_HyperlinkStart === Type || para_HyperlinkEnd === Type || para_Tab === Type || para_InlineBreak === Type || para_Empty === Type || para_CommentStart === Type || para_CommentEnd === Type || para_CollaborativeChangesEnd === Type || para_CollaborativeChangesStart === Type || (para_Text === Type && true === Item.Is_NBSP())) {
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
            if (para_TextPr === Type || para_NewLineRendered === Type || para_FlowObjectAnchor === Type || para_HyperlinkStart === Type || para_HyperlinkEnd === Type || para_InlineBreak === Type || para_Empty === Type || (para_Text === Type && true != Item.Is_NBSP() && (true === bFirst || (bFirstPunctuation === Item.Is_Punctuation()))) || para_CommentStart === Type || para_CommentEnd === Type || para_CollaborativeChangesEnd === Type || para_CollaborativeChangesStart === Type) {
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
                    oPos = this.Internal_FindForward(this.CurPos.ContentPos + 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_NewLineRendered, para_End]);
                } else {
                    oPos = this.Internal_FindWordEnd(this.CurPos.ContentPos, CursorPos_max);
                }
                if (oPos.Found) {
                    this.CurPos.ContentPos = oPos.LetterPos;
                    return true;
                } else {
                    return false;
                }
            }
        }
    },
    Internal_AddTextPr: function (TextPr) {
        if (true === this.ApplyToAll) {
            this.Internal_Content_Add(1, new ParaTextPr(TextPr));
            for (var Pos = 0; Pos < this.Content.length; Pos++) {
                if (this.Content[Pos].Type == para_TextPr) {
                    this.Content[Pos].Apply_TextPr(TextPr);
                }
            }
            this.TextPr.Apply_TextPr(TextPr);
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
            this.TextPr.Apply_TextPr(TextPr);
        } else {
            if (para_PageNum === CurType || para_Drawing === CurType || para_Tab == CurType || para_Space == CurType || para_NewLine == CurType || !oStart.Found || para_NewLine == oEnd.Type || para_Space == oEnd.Type || para_NewLine == oStart.Type || para_Space == oStart.Type || para_Tab == oEnd.Type || para_Tab == oStart.Type || para_Drawing == oEnd.Type || para_Drawing == oStart.Type || para_PageNum == oEnd.Type || para_PageNum == oStart.Type) {
                var TextPr_old = this.Internal_GetTextPr(CurPos);
                var TextPr_new = TextPr_old.Copy();
                TextPr_new.Merge(TextPr);
                this.Internal_Content_Add(CurPos, new ParaTextPr(TextPr_old));
                this.Internal_Content_Add(CurPos, new ParaTextPr(TextPr_new));
                this.CurPos.ContentPos = CurPos + 1;
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
                for (var Pos = oWordStart.LetterPos + 1; Pos < oWordEnd.LetterPos; Pos++) {
                    if (this.Content[Pos].Type == para_TextPr) {
                        this.Content[Pos].Apply_TextPr(TextPr);
                    }
                }
            }
        }
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
        } else {
            if (para_PageNum === CurType || para_Drawing === CurType || para_Tab == CurType || para_Space == CurType || para_NewLine == CurType || !oStart.Found || para_NewLine == oEnd.Type || para_Space == oEnd.Type || para_NewLine == oStart.Type || para_Space == oStart.Type || para_Tab == oEnd.Type || para_Tab == oStart.Type || para_Drawing == oEnd.Type || para_Drawing == oStart.Type || para_PageNum == oEnd.Type || para_PageNum == oStart.Type) {
                var TextPr_old = this.Internal_GetTextPr(CurPos);
                var TextPr_new = TextPr_old.Copy();
                TextPr_new.Merge(TextPr);
                this.Internal_Content_Add(CurPos, new ParaTextPr(TextPr_old));
                this.Internal_Content_Add(CurPos, new ParaTextPr(TextPr_new));
                this.CurPos.ContentPos = CurPos + 1;
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
                End: false
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
        var CurLineY = this.Pages[PNum].Y + this.Lines[CurLine].Y;
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
                CurLineY = this.Lines[CurLine].Y + this.Pages[PNum].Y;
            }
        }
        var CurLine2 = 0;
        var CurRange = 0;
        var CurX = this.Lines[CurLine].Ranges[CurRange].XVisible;
        var bEOL = false;
        var DiffX = 1000000;
        var NumberingDiffX = 1000000;
        var DiffPos = -1;
        var bEnd = false;
        var Result = {
            Pos: 0,
            End: false
        };
        for (var ItemNum = 0; ItemNum < this.Content.length; ItemNum++) {
            var Item = this.Content[ItemNum];
            if (CurLine == CurLine2) {
                var TempDx = 0;
                var bCheck = false;
                var bNumbering = false;
                var bDrawing = false;
                switch (Item.Type) {
                case para_Drawing:
                    TempDx = Item.WidthVisible;
                    bCheck = true;
                    break;
                case para_Numbering:
                    var NumPr = this.Numbering_Get();
                    if (undefined === NumPr || undefined === NumPr.NumId) {
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
                case para_InlineBreak:
                    CurRange++;
                    CurX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                    bCheck = false;
                    break;
                case para_NewLine:
                    if (false === Item.Is_NewLine()) {
                        bCheck = true;
                        TempDx = Item.WidthVisible;
                        break;
                    }
                case para_NewLineRendered:
                    bEOL = true;
                    bCheck = true;
                    break;
                case para_End:
                    bEnd = true;
                    bEOL = true;
                    bCheck = true;
                    TempDx = Item.WidthVisible;
                    break;
                }
                if (bCheck) {
                    if (false === bNumbering && Math.abs(X - CurX) < DiffX) {
                        DiffX = Math.abs(X - CurX);
                        DiffPos = ItemNum;
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
                    if (bEOL) {
                        break;
                    }
                }
                CurX += TempDx;
            } else {
                if ((Item.Type == para_NewLine && true === Item.Is_NewLine()) || Item.Type == para_NewLineRendered) {
                    CurLine2++;
                }
            }
        }
        if (NumberingDiffX <= DiffX) {
            Result.Numbering = true;
        } else {
            Result.Numbering = false;
        }
        Result.Pos = DiffPos;
        return Result;
    },
    Internal_GetXYByContentPos: function (Pos) {
        return this.Internal_Recalculate_2(Pos);
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
        if (-1 != Result.Pos) {
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
            while (this.Content[Pos - 1].Type === para_TextPr || this.Content[Pos - 1].Type === para_HyperlinkEnd) {
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
                Pos = this.Selection.StartPos;
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
    Hyperlink_CanAdd: function () {
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
        }
        this.Internal_Recalculate_2(Pos, false);
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
        if (-1 != Pos.Pos) {
            if (true === Temp.End) {
                this.Selection.EndPos = Pos + 1;
            } else {
                this.Selection.EndPos = Pos;
            }
            if (this.Selection.EndPos == this.Selection.StartPos && g_mouse_event_type_up === MouseEvent.Type) {
                var NumPr = this.Numbering_Get();
                if (true === Temp.Numbering && undefined != NumPr) {
                    this.CurPos.ContentPos = 0;
                    this.Parent.Document_SelectNumbering(NumPr);
                } else {
                    var Temp2 = MouseEvent.ClickCount % 2;
                    if (1 >= MouseEvent.ClickCount) {
                        this.Selection_Remove();
                        this.Selection.Use = false;
                        this.CurPos.ContentPos = Pos;
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
    Selection_Draw: function () {
        var StartPage = this.Get_StartPage_Absolute();
        if (true === this.Selection.Use) {
            switch (this.Selection.Flag) {
            case selectionflag_Common:
                var StartPos = this.Selection.StartPos;
                var EndPos = this.Selection.EndPos;
                if (StartPos > EndPos) {
                    var Temp = EndPos;
                    EndPos = StartPos;
                    StartPos = Temp;
                }
                var CurLine = 0;
                var CurRange = 0;
                var StartX = 0;
                var Pos, Item;
                for (Pos = StartPos - 1; Pos >= 0; Pos--) {
                    Item = this.Content[Pos];
                    if ((Item.Type == para_NewLine && true === Item.Is_NewLine()) || Item.Type == para_NewLineRendered) {
                        CurLine++;
                    } else {
                        if (0 == CurLine && Item.Type == para_InlineBreak) {
                            CurRange++;
                        }
                    }
                    if (0 == CurLine && 0 == CurRange) {
                        if ("undefined" != typeof(Item.Width)) {
                            StartX += Item.WidthVisible;
                        }
                    }
                }
                var PNum = 0;
                for (; PNum < this.Pages.length; PNum++) {
                    if (PNum == this.Pages.length - 1) {
                        break;
                    }
                    if (CurLine < this.Pages[PNum + 1].FirstLine) {
                        break;
                    }
                }
                StartX += this.Lines[CurLine].Ranges[CurRange].XVisible;
                if (this.Pages[PNum].FirstLine > CurLine) {
                    CurLine = this.Pages[PNum].FirstLine;
                    CurRange = 0;
                    StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                    var PageBreak = PNum;
                    StartPos = 0;
                    while (PageBreak > 0 && StartPos < this.Content.length) {
                        Item = this.Content[StartPos];
                        if (para_PageBreakRendered == Item.Type || (para_NewLine === Item.Type && break_Page === Item.BreakType && true === Item.Flags.NewLine)) {
                            PageBreak--;
                        }
                        StartPos++;
                    }
                }
                var StartY = this.Pages[PNum].Y + this.Lines[CurLine].Top;
                var H = this.Lines[CurLine].Bottom - this.Lines[CurLine].Top;
                var W = 0;
                for (Pos = StartPos; Pos < EndPos; Pos++) {
                    Item = this.Content[Pos];
                    if ("undefined" != typeof(Item.Width)) {
                        W += Item.WidthVisible;
                    }
                    if (Item.Type == para_FlowObjectAnchor) {
                        Item.FlowObject.Select_This();
                    }
                    if ((Item.Type == para_NewLine && true === Item.Is_NewLine()) || Item.Type == para_NewLineRendered || Item.Type == para_InlineBreak || Pos == EndPos - 1) {
                        this.DrawingDocument.AddPageSelection(StartPage + PNum, StartX, StartY, W, H);
                        if ((Item.Type == para_NewLine && true === Item.Is_NewLine()) || Item.Type == para_NewLineRendered) {
                            CurLine++;
                            if (PNum < this.Pages.length - 1 && CurLine == this.Pages[PNum + 1].FirstLine) {
                                PNum++;
                            }
                            CurRange = 0;
                            if (CurLine < this.Lines.length) {
                                StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                                StartY = this.Pages[PNum].Y + this.Lines[CurLine].Top;
                                H = this.Lines[CurLine].Bottom - this.Lines[CurLine].Top;
                                W = 0;
                            }
                        } else {
                            if (Item.Type == para_InlineBreak) {
                                CurRange++;
                                StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                                W = 0;
                            }
                        }
                    }
                }
                this.Selection_Clear();
                break;
            case selectionflag_Numbering:
                var ParaNum = null;
                var PNum = 0;
                var CurRange = 0;
                for (; PNum < this.Pages.length; PNum++) {
                    if (PNum == this.Pages.length - 1) {
                        break;
                    }
                    if (0 < this.Pages[PNum + 1].FirstLine) {
                        break;
                    }
                }
                for (var Index = 0; Index < this.Content.length; Index++) {
                    if (para_Numbering == this.Content[Index].Type) {
                        ParaNum = this.Content[Index];
                        break;
                    } else {
                        if (para_InlineBreak == this.Content[Index].Type) {
                            CurRange++;
                        }
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
                this.DrawingDocument.AddPageSelection(StartPage + PNum, SelectX, this.Lines[0].Top + this.Pages[PNum].Y, SelectW, this.Lines[0].Bottom - this.Lines[0].Top);
                break;
            }
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
                StartPos = 1;
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
                StartPos = 1;
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
    Is_UseInDocument: function () {
        if (null != this.Parent) {
            return this.Parent.Is_UseInDocument(this.Get_Id());
        }
        return false;
    },
    Selection_IsEmpty: function () {
        if (true === this.Selection.Use) {
            var StartPos = this.Selection.StartPos;
            var EndPos = this.Selection.EndPos;
            if (StartPos > EndPos) {
                var Temp = EndPos;
                EndPos = StartPos;
                StartPos = Temp;
            }
            var Pos = this.Internal_FindForward(StartPos, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine, para_End]);
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
            this.Style_Add(this.Get_Styles().Get_Default_ParaList());
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
        if (undefined != NumPr) {
            return NumPr.Copy();
        }
        return undefined;
    },
    Numbering_Remove: function () {
        var NewNumPr = undefined;
        if (undefined != this.CompiledPr.Pr.ParaPr.StyleNumPr) {
            NewNumPr = new CNumPr();
            NewNumPr.Set(undefined, 0);
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
        var NumStyleId = this.Get_Styles().Get_Default_ParaList();
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
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
    },
    Add_PresentationNumbering2: function (_Bullet) {
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
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
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
            this.RecalcInfo.Set_Type_0(pararecalc_0_All);
            this.Recalc_CompiledPr();
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
                if (this.Parent.Is_TableCellContent()) {
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
                    Cur_After = this.Internal_CalculateAutoSpacing(Cur_After, Cur_AfterAuto, this);
                    Next_Before = this.Internal_CalculateAutoSpacing(Next_Before, Next_BeforeAuto, this);
                    Pr.ParaPr.Spacing.After = Math.max(Next_Before, Cur_After) - Cur_After;
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
            if (this.Parent.Is_TableCellContent()) {
                Pr.ParaPr.Spacing.After = 0;
            }
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
    createCopy: function (parent) {
        var _copy_para = new Paragraph(this.DrawingDocument, parent, 0, 0, 0, 0, 0);
        for (var _content_index = 0; _content_index < this.Content.length - 2; ++_content_index) {
            _copy_para.Internal_Content_Add(_content_index, this.Content[_content_index].createDuplicate());
        }
        if (this.bullet != null) {
            _copy_para.bullet = this.bullet.createDuplicate();
        }
        _copy_para.Pr = this.Pr.Copy();
        _copy_para.rPr = clone(this.rPr);
        _copy_para.Remove_PresentationNumbering();
        _copy_para.Add_PresentationNumbering(this.PresentationPr.Bullet);
        _copy_para.PresentationPr.Level = this.PresentationPr.Level;
        return _copy_para;
    },
    Get_Styles: function () {
        var lvl = this.PresentationPr.Level;
        var Styles = this.Parent.Get_Styles(lvl, true);
        return Styles;
    },
    Internal_CompileParaPr: function () {
        this.Parent.StyleCounter++;
        var Styles = this.Get_Styles();
        var TableStyle = this.Parent.Get_TableStyleForPara();
        var StyleId;
        StyleId = Styles.Style.length - 1;
        var Pr = Styles.Get_Pr(StyleId, styles_Paragraph, TableStyle);
        Pr.ParaPr.Merge(this.Pr);
        Pr.TextPr.Merge(this.rPr);
        if (Pr.TextPr.unifill && Pr.TextPr.unifill.fill) {
            var _document_content_parent = this.Parent.Parent;
            var shape = _document_content_parent instanceof CTableCell ? _document_content_parent.Row.Table.Parent : _document_content_parent;
            if (true) {
                var theme = null,
                master = null,
                layout = null,
                slide = null;
                if (shape.parent.kind == SLIDE_KIND) {
                    slide = shape.parent;
                    layout = shape.parent.Layout;
                    if (layout) {
                        master = layout.Master;
                        if (master) {
                            theme = master.Theme;
                        }
                    }
                }
                if (shape.parent.kind == LAYOUT_KIND) {
                    layout = shape.parent;
                    if (layout) {
                        master = layout.Master;
                        if (master) {
                            theme = master.Theme;
                        }
                    }
                }
                if (shape.parent.kind == MASTER_KIND) {
                    master = shape.parent;
                    if (master) {
                        theme = master.Theme;
                    }
                }
                var brush = null;
                var RGBA = {
                    R: 0,
                    G: 0,
                    B: 0,
                    A: 255
                };
                if (theme && shape.style != null && shape.style.fontRef != null) {
                    brush = theme.getFillStyle(shape.style.fontRef.idx);
                    if (shape.style.fontRef.Color != null) {
                        shape.style.fontRef.Color.Calculate(theme, slide, layout, master);
                        RGBA = shape.style.fontRef.Color.RGBA;
                        if (shape.style.fontRef.Color.color != null) {
                            if (brush.fill != null && brush.fill.type == FILL_TYPE_SOLID) {
                                brush.fill.color = shape.style.fontRef.Color.createDuplicate();
                            }
                        }
                    }
                } else {
                    brush = new CUniFill();
                }
                brush.merge(Pr.TextPr.unifill);
                brush.calculate(theme, slide, layout, master, RGBA);
                var _rgba = brush.getRGBAColor();
                Pr.TextPr.Color = {
                    r: _rgba.R,
                    g: _rgba.G,
                    b: _rgba.B,
                    A: _rgba.A
                };
            }
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
        var Id_old = this.Pr.PStyle;
        if (undefined === this.Pr.PStyle) {
            Id_old = null;
        } else {
            this.Style_Remove();
        }
        if (null === Id) {
            return;
        }
        if (Id != this.Get_Styles().Get_Default_Paragraph()) {
            History.Add(this, {
                Type: historyitem_Paragraph_PStyle,
                Old: Id_old,
                New: Id
            });
            this.Pr.PStyle = Id;
        }
        this.CompiledPr.NeedRecalc = true;
        if (true === bDoNotDeleteProps) {
            return;
        }
        var DefNumId = this.Get_Styles().Get_Default_ParaList();
        if (Id != DefNumId && (Id_old != DefNumId || Id != this.Get_Styles().Get_Default_Paragraph())) {
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
            History.Add(this, {
                Type: historyitem_Paragraph_PStyle,
                Old: this.Pr.PStyle,
                New: undefined
            });
            this.Pr.PStyle = undefined;
        }
        this.CompiledPr.NeedRecalc = true;
    },
    Cursor_IsEnd: function () {
        var oPos = this.Internal_FindForward(this.CurPos.ContentPos, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine]);
        if (true === oPos.Found) {
            return false;
        } else {
            return true;
        }
    },
    Cursor_IsStart: function () {
        var oPos = this.Internal_FindBackward(this.CurPos.ContentPos - 1, [para_PageNum, para_Drawing, para_Tab, para_Text, para_Space, para_NewLine]);
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
        this.CompiledPr.NeedRecalc = true;
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
    },
    Clear_TextFormatting: function () {
        for (var Index = 0; Index < this.Content.length; Index++) {
            var Item = this.Content[Index];
            if (para_TextPr === Item.Type) {
                this.Internal_Content_Remove(Index);
            }
        }
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
    },
    Set_Ind: function (Ind, bDeleteUndefined) {
        if (undefined === this.Pr.Ind) {
            this.Pr.Ind = new CParaInd();
        }
        if ((undefined != Ind.FirstLine || true === bDeleteUndefined) && this.Pr.Ind.FirstLine !== Ind.FirstLine) {
            History.Add(this, {
                Type: historyitem_Paragraph_Ind_First,
                New: Ind.FirstLine,
                Old: (undefined != this.Pr.Ind.FirstLine ? this.Pr.Ind.FirstLine : undefined)
            });
            this.Pr.Ind.FirstLine = Ind.FirstLine;
        }
        if ((undefined != Ind.Left || true === bDeleteUndefined) && this.Pr.Ind.Left !== Ind.Left) {
            History.Add(this, {
                Type: historyitem_Paragraph_Ind_Left,
                New: Ind.Left,
                Old: (undefined != this.Pr.Ind.Left ? this.Pr.Ind.Left : undefined)
            });
            this.Pr.Ind.Left = Ind.Left;
        }
        if ((undefined != Ind.Right || true === bDeleteUndefined) && this.Pr.Ind.Right !== Ind.Right) {
            History.Add(this, {
                Type: historyitem_Paragraph_Ind_Right,
                New: Ind.Right,
                Old: (undefined != this.Pr.Ind.Right ? this.Pr.Ind.Right : undefined)
            });
            this.Pr.Ind.Right = Ind.Right;
        }
        this.CompiledPr.NeedRecalc = true;
    },
    Set_Spacing: function (Spacing, bDeleteUndefined) {
        if (undefined === this.Pr.Spacing) {
            this.Pr.Spacing = new CParaSpacing();
        }
        if ((undefined != Spacing.Line || true === bDeleteUndefined) && this.Pr.Spacing.Line !== Spacing.Line) {
            History.Add(this, {
                Type: historyitem_Paragraph_Spacing_Line,
                New: Spacing.Line,
                Old: (undefined != this.Pr.Spacing.Line ? this.Pr.Spacing.Line : undefined)
            });
            this.Pr.Spacing.Line = Spacing.Line;
        }
        if ((undefined != Spacing.LineRule || true === bDeleteUndefined) && this.Pr.Spacing.LineRule !== Spacing.LineRule) {
            History.Add(this, {
                Type: historyitem_Paragraph_Spacing_LineRule,
                New: Spacing.LineRule,
                Old: (undefined != this.Pr.Spacing.LineRule ? this.Pr.Spacing.LineRule : undefined)
            });
            this.Pr.Spacing.LineRule = Spacing.LineRule;
        }
        if ((undefined != Spacing.Before || true === bDeleteUndefined) && this.Pr.Spacing.Before !== Spacing.Before) {
            History.Add(this, {
                Type: historyitem_Paragraph_Spacing_Before,
                New: Spacing.Before,
                Old: (undefined != this.Pr.Spacing.Before ? this.Pr.Spacing.Before : undefined)
            });
            this.Pr.Spacing.Before = Spacing.Before;
        }
        if ((undefined != Spacing.After || true === bDeleteUndefined) && this.Pr.Spacing.After !== Spacing.After) {
            History.Add(this, {
                Type: historyitem_Paragraph_Spacing_After,
                New: Spacing.After,
                Old: (undefined != this.Pr.Spacing.After ? this.Pr.Spacing.After : undefined)
            });
            this.Pr.Spacing.After = Spacing.After;
        }
        if ((undefined != Spacing.AfterAutoSpacing || true === bDeleteUndefined) && this.Pr.Spacing.AfterAutoSpacing !== Spacing.AfterAutoSpacing) {
            History.Add(this, {
                Type: historyitem_Paragraph_Spacing_AfterAutoSpacing,
                New: Spacing.AfterAutoSpacing,
                Old: (undefined != this.Pr.Spacing.AfterAutoSpacing ? this.Pr.Spacing.AfterAutoSpacing : undefined)
            });
            this.Pr.Spacing.AfterAutoSpacing = Spacing.AfterAutoSpacing;
        }
        if ((undefined != Spacing.BeforeAutoSpacing || true === bDeleteUndefined) && this.Pr.Spacing.BeforeAutoSpacing !== Spacing.BeforeAutoSpacing) {
            History.Add(this, {
                Type: historyitem_Paragraph_Spacing_BeforeAutoSpacing,
                New: Spacing.BeforeAutoSpacing,
                Old: (undefined != this.Pr.Spacing.BeforeAutoSpacing ? this.Pr.Spacing.BeforeAutoSpacing : undefined)
            });
            this.Pr.Spacing.BeforeAutoSpacing = Spacing.BeforeAutoSpacing;
        }
        this.CompiledPr.NeedRecalc = true;
    },
    Set_Align: function (Align, bRecalc) {
        if (this.Pr.Jc != Align) {
            History.Add(this, {
                Type: historyitem_Paragraph_Align,
                New: Align,
                Old: (undefined != this.Pr.Jc ? this.Pr.Jc : undefined)
            });
            this.Pr.Jc = Align;
            this.CompiledPr.NeedRecalc = true;
            if (false != bRecalc) {
                this.Internal_Recalculate_2();
            }
        }
    },
    Set_Shd: function (Shd, bDeleteUndefined) {
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
        History.Add(this, {
            Type: historyitem_Paragraph_Tabs,
            New: Tabs,
            Old: this.Pr.Tabs
        });
        this.Pr.Tabs = Tabs;
        this.CompiledPr.NeedRecalc = true;
    },
    Set_ContextualSpacing: function (Value) {
        if (Value != this.Pr.ContextualSpacing) {
            History.Add(this, {
                Type: historyitem_Paragraph_ContextualSpacing,
                New: Value,
                Old: (undefined != this.Pr.ContextualSpacing ? this.Pr.ContextualSpacing : undefined)
            });
            this.Pr.ContextualSpacing = Value;
            this.CompiledPr.NeedRecalc = true;
        }
    },
    Set_PageBreakBefore: function (Value) {
        if (Value != this.Pr.PageBreakBefore) {
            History.Add(this, {
                Type: historyitem_Paragraph_PageBreakBefore,
                New: Value,
                Old: (undefined != this.Pr.PageBreakBefore ? this.Pr.PageBreakBefore : undefined)
            });
            this.Pr.PageBreakBefore = Value;
            this.CompiledPr.NeedRecalc = true;
        }
    },
    Set_KeepLines: function (Value) {
        if (Value != this.Pr.KeepLines) {
            History.Add(this, {
                Type: historyitem_Paragraph_KeepLines,
                New: Value,
                Old: (undefined != this.Pr.KeepLines ? this.Pr.KeepLines : undefined)
            });
            this.Pr.KeepLines = Value;
            this.CompiledPr.NeedRecalc = true;
        }
    },
    Set_KeepNext: function (Value) {
        if (Value != this.Pr.KeepNext) {
            History.Add(this, {
                Type: historyitem_Paragraph_KeepNext,
                New: Value,
                Old: (undefined != this.Pr.KeepNext ? this.Pr.KeepNext : undefined)
            });
            this.Pr.KeepNext = Value;
            this.CompiledPr.NeedRecalc = true;
        }
    },
    Set_WidowControl: function (Value) {
        if (Value != this.Pr.WidowControl) {
            History.Add(this, {
                Type: historyitem_Paragraph_WidowControl,
                New: Value,
                Old: (undefined != this.Pr.WidowControl ? this.Pr.WidowControl : undefined)
            });
            this.Pr.WidowControl = Value;
            this.CompiledPr.NeedRecalc = true;
        }
    },
    Set_Borders: function (Borders) {
        if (undefined === Borders) {
            return;
        }
        var OldBorders = this.Get_CompiledPr2(false).ParaPr.Brd;
        if (Borders.Between != null && false === Borders.Between.Check_Null()) {
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
        if (Borders.Top != null && false === Borders.Top.Check_Null()) {
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
        if (Borders.Right != null && false === Borders.Right.Check_Null()) {
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
        if (Borders.Bottom != null && false === Borders.Bottom.Check_Null()) {
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
        if (Borders.Left != null && false === Borders.Left.Check_Null()) {
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
        if ("undefined" === typeof(Pos)) {
            Pos = this.CurPos.ContentPos;
        }
        var CurPage = 0;
        for (var Index = 0; Index < this.Content.length; Index++) {
            var Item = this.Content[Index];
            if (Pos === Index) {
                return CurPage;
            }
            if (para_PageBreakRendered === Item.Type || (para_NewLine === Item.Type && break_Page === Item.BreakType && true === Item.Is_NewLine())) {
                CurPage++;
            }
        }
        return 0;
    },
    Remove_DrawingObject: function (Id) {
        for (var Index = 0; Index < this.Content.length; Index++) {
            if (para_Drawing === this.Content[Index].Type && Id === this.Content[Index].Get_Id()) {
                this.Internal_Content_Remove(Index);
            }
        }
    },
    Get_DrawingObject_Page: function (Id) {
        var PageNum = this.Parent.StartPage + this.PageNum;
        for (var Index = 0; Index < this.Content.length; Index++) {
            if (para_Drawing === this.Content[Index].Type && Id === this.Content[Index].Get_Id()) {
                return PageNum;
            } else {
                if (para_PageBreakRendered == this.Content[Index].Type || (para_NewLine == this.Content[Index].Type && break_Page === this.Content[Index].BreakType && true === this.Content[Index].Flags.NewLine)) {
                    PageNum++;
                }
            }
        }
        return -1;
    },
    Get_NearestPos: function (PageNum, X, Y) {
        var ContentPos = this.Internal_GetContentPosByXY(X, Y, false, PageNum).Pos;
        var Result = this.Internal_Recalculate_2(ContentPos, false, true);
        Result.Paragraph = this;
        return Result;
    },
    Set_DocumentNext: function (Object) {
        History.Add(this, {
            Type: historyitem_Paragraph_DocNext,
            New: Object,
            Old: this.Next
        });
        this.Next = Object;
    },
    Set_DocumentPrev: function (Object) {
        History.Add(this, {
            Type: historyitem_Paragraph_DocPrev,
            New: Object,
            Old: this.Prev
        });
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
        var Pos = this.Internal_FindForward(0, [para_PageBreakRendered, para_Tab, para_Drawing, para_PageNum, para_Text, para_Space, para_NewLine]);
        if (false === Pos.Found) {
            return true;
        }
        if (para_PageBreakRendered === Pos.Type) {
            return false;
        }
        return true;
    },
    Get_CurrentPage_Absolute: function () {
        this.Internal_Recalculate_2(this.CurPos.ContentPos, false, true);
        return (this.Get_StartPage_Absolute() + this.CurPos.PagesPos);
    },
    Get_CurrentPage_Relative: function () {
        this.Internal_Recalculate_2(this.CurPos.ContentPos, false, true);
        return (this.PageNum + this.CurPos.PagesPos);
    },
    DocumentSearch: function (Str, ElementType) {
        var Pr = this.Get_CompiledPr();
        var StartPage = this.Get_StartPage_Absolute();
        var SearchResults = new Array();
        for (var Pos = 0; Pos < this.Content.length; Pos++) {
            var Item = this.Content[Pos];
            if (para_Numbering === Item.Type || para_PresentationNumbering === Item.Type || para_TextPr === Item.Type || para_NewLineRendered === Item.Type || para_PageBreakRendered === Item.Type) {
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
                        while (Pos2 < this.Content.length && (para_TextPr === this.Content[Pos2].Type || para_NewLineRendered === this.Content[Pos2].Type || para_PageBreakRendered === this.Content[Pos2].Type)) {
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
        return SearchResults;
        var MaxShowValue = 100;
        for (var FoundIndex = 0; FoundIndex < SearchResults.length; FoundIndex++) {
            var Rects = new Array();
            var StartPos = SearchResults[FoundIndex].StartPos;
            var EndPos = SearchResults[FoundIndex].EndPos;
            var CurLine = 0;
            var CurRange = 0;
            var StartX = 0;
            var Pos, Item;
            for (Pos = StartPos - 1; Pos >= 0; Pos--) {
                Item = this.Content[Pos];
                if ((Item.Type == para_NewLine && true === Item.Is_NewLine()) || Item.Type == para_NewLineRendered) {
                    CurLine++;
                } else {
                    if (0 == CurLine && Item.Type == para_InlineBreak) {
                        CurRange++;
                    }
                }
                if (0 == CurLine && 0 == CurRange) {
                    if ("undefined" != typeof(Item.Width)) {
                        StartX += Item.WidthVisible;
                    }
                }
            }
            var PNum = 0;
            for (; PNum < this.Pages.length; PNum++) {
                if (PNum == this.Pages.length - 1) {
                    break;
                }
                if (CurLine < this.Pages[PNum + 1].FirstLine) {
                    break;
                }
            }
            StartX += this.Lines[CurLine].Ranges[CurRange].XVisible;
            if (this.Pages[PNum].FirstLine > CurLine) {
                CurLine = this.Pages[PNum].FirstLine;
                CurRange = 0;
                StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                var PageBreak = PNum;
                StartPos = 0;
                while (PageBreak > 0 && StartPos < this.Content.length) {
                    Item = this.Content[StartPos];
                    if (para_PageBreakRendered == Item.Type || (para_NewLine === Item.Type && break_Page === Item.BreakType && true === Item.Flags.NewLine)) {
                        PageBreak--;
                    }
                    StartPos++;
                }
            }
            var StartY = (this.Pages[PNum].Y + this.Lines[CurLine].Y - this.Lines[CurLine].Metrics.Ascent);
            var EndY = (this.Pages[PNum].Y + this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent);
            if (this.Lines[CurLine].Metrics.LineGap < 0) {
                EndY += this.Lines[CurLine].Metrics.LineGap;
            }
            var W = 0;
            for (Pos = StartPos; Pos < EndPos; Pos++) {
                Item = this.Content[Pos];
                if ("undefined" != typeof(Item.Width)) {
                    W += Item.WidthVisible;
                }
                if ((Item.Type == para_NewLine && true === Item.Is_NewLine()) || Item.Type == para_NewLineRendered || Item.Type == para_InlineBreak || Pos == EndPos - 1) {
                    Rects.push({
                        PageNum: StartPage + PNum,
                        X: StartX,
                        Y: StartY,
                        W: W,
                        H: EndY - StartY
                    });
                    if ((Item.Type == para_NewLine && true === Item.Is_NewLine()) || Item.Type == para_NewLineRendered) {
                        CurLine++;
                        if (PNum < this.Pages.length - 1 && CurLine == this.Pages[PNum + 1].FirstLine) {
                            PNum++;
                        }
                        CurRange = 0;
                        if (CurLine < this.Lines.length) {
                            StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                            StartY = (this.Pages[PNum].Y + this.Lines[CurLine].Y - this.Lines[CurLine].Metrics.Ascent);
                            EndY = (this.Pages[PNum].Y + this.Lines[CurLine].Y + this.Lines[CurLine].Metrics.Descent);
                            if (this.Lines[CurLine].Metrics.LineGap < 0) {
                                EndY += this.Lines[CurLine].Metrics.LineGap;
                            }
                            W = 0;
                        }
                    } else {
                        if (Item.Type == para_InlineBreak) {
                            CurRange++;
                            StartX = this.Lines[CurLine].Ranges[CurRange].XVisible;
                            W = 0;
                        }
                    }
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
        var MMData = new CMouseMoveData();
        var _coords_rel_slide = this.Parent.getCurCoordsRelativeSlide();
        var Coords = this.DrawingDocument.ConvertCoordsToCursorWR(_coords_rel_slide.X, _coords_rel_slide.Y);
        MMData.X_abs = Coords.X;
        MMData.Y_abs = Coords.Y;
        var Hyperlink = this.Check_Hyperlink(X, Y, PageIndex);
        var PNum = PageIndex - this.PageNum;
        if (null != Hyperlink) {
            MMData.Type = c_oAscMouseMoveDataTypes.Hyperlink;
            MMData.Hyperlink = new CHyperlinkProperty(Hyperlink);
        } else {
            MMData.Type = c_oAscMouseMoveDataTypes.Common;
        }
        if (null != Hyperlink && true === global_keyboardEvent.CtrlKey) {
            this.DrawingDocument.SetCursorType("pointer");
        } else {
            this.DrawingDocument.SetCursorType("text");
        }
        editor.asc_fireCallback("asc_onMouseMove", MMData);
    },
    Document_CreateFontMap: function (FontMap) {
        if (true === this.FontMap.NeedRecalc) {
            this.FontMap.Map = new Object();
            if (true === this.CompiledPr.NeedRecalc) {
                this.CompiledPr.Pr = this.Internal_CompileParaPr();
                this.CompiledPr.NeedRecalc = false;
            }
            var CurTextPr = this.CompiledPr.Pr.TextPr.Copy();
            CurTextPr.Update_FontSize();
            var Style = (true === CurTextPr.Bold ? 1 : 0) + (true === CurTextPr.Italic ? 2 : 0);
            var Key = "" + CurTextPr.FontFamily.Name + "_" + Style + "_" + CurTextPr.FontSize;
            this.FontMap.Map[Key] = {
                Name: CurTextPr.FontFamily.Name,
                Style: Style,
                Size: CurTextPr.FontSize
            };
            CurTextPr.Merge(this.TextPr.Value);
            CurTextPr.Update_FontSize();
            var Style = (true === CurTextPr.Bold ? 1 : 0) + (true === CurTextPr.Italic ? 2 : 0);
            var Key = "" + CurTextPr.FontFamily.Name + "_" + Style + "_" + CurTextPr.FontSize;
            this.FontMap.Map[Key] = {
                Name: CurTextPr.FontFamily.Name,
                Style: Style,
                Size: CurTextPr.FontSize
            };
            for (var Index = 0; Index < this.Content.length; Index++) {
                var Item = this.Content[Index];
                if (para_TextPr === Item.Type) {
                    CurTextPr = this.CompiledPr.Pr.TextPr.Copy();
                    var _CurTextPr = Item.Value;
                    if (undefined != _CurTextPr.RStyle) {
                        var Styles = this.Get_Styles();
                        var StyleTextPr = Styles.Get_Pr(_CurTextPr.RStyle, styles_Character).TextPr;
                        CurTextPr.Merge(StyleTextPr);
                    }
                    CurTextPr.Merge(_CurTextPr);
                    CurTextPr.Update_FontSize();
                    Style = (true === CurTextPr.Bold ? 1 : 0) + (true === CurTextPr.Italic ? 2 : 0);
                    Key = "" + CurTextPr.FontFamily.Name + "_" + Style + "_" + CurTextPr.FontSize;
                    this.FontMap.Map[Key] = {
                        Name: CurTextPr.FontFamily.Name,
                        Style: Style,
                        Size: CurTextPr.FontSize
                    };
                }
            }
            this.FontMap.NeedRecalc = false;
        }
        for (Key in this.FontMap.Map) {
            FontMap[Key] = this.FontMap.Map[Key];
        }
    },
    Document_UpdateInterfaceState: function () {
        if (true === this.Selection.Use) {
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
            if (para_Drawing === Item.Type) {
                var ObjId = Item.Get_Id();
                this.Parent.DrawingObjects.Remove_ById(ObjId);
            } else {
                if (para_CommentEnd === Item.Type || para_CommentStart === Item.Type) {
                    editor.WordControl.m_oLogicDocument.Remove_Comment(Item.Id, true);
                }
            }
        }
    },
    Get_FlowObjects: function (bAll) {
        var StartPos = this.Selection.StartPos;
        var EndPos = this.Selection.EndPos;
        if (true === bAll) {
            StartPos = 0;
            EndPos = this.Content.length - 1;
        } else {
            if (true != this.Selection.Use) {
                return [];
            }
        }
        var Result = new Array();
        for (var Index = StartPos; Index <= EndPos; Index++) {
            var Item = this.Content[Index];
            if (para_FlowObjectAnchor == Item.Type) {
                Result.push(Item.FlowObject);
            }
        }
        return Result;
    },
    Get_StartPage_Absolute: function () {
        return this.Parent.Get_StartPage_Absolute() + this.Get_StartPage_Relative();
    },
    Get_StartPage_Relative: function () {
        return this.PageNum;
    },
    Link_FlowObject: function (X, Y, PageNum, FlowObject) {
        var Pos = this.Internal_GetContentPosByXY(X, Y, false, PageNum);
        if (-1 != Pos.Pos) {
            this.Internal_Content_Add(Pos.Pos, new ParaFlowObjectAnchor(FlowObject));
        }
    },
    Document_SetThisElementCurrent: function () {
        this.Parent.Set_CurrentElement(this.Index);
    },
    Split: function (NewParagraph, Pos) {
        if ("undefined" === typeof(Pos) || null === Pos) {
            Pos = this.CurPos.ContentPos;
        }
        var Hyperlink = this.Check_Hyperlink2(Pos, false);
        var TextPr = this.Internal_CalculateTextPr2(Pos);
        NewParagraph.DeleteCommentOnRemove = false;
        NewParagraph.Internal_Content_Remove2(0, NewParagraph.Content.length);
        NewParagraph.Internal_Content_Concat(this.Content.slice(Pos));
        NewParagraph.Internal_Content_Add(0, new ParaTextPr(TextPr));
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
        this.Internal_Content_Concat(Para.Content);
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
    },
    Continue: function (NewParagraph) {
        this.CopyPr(NewParagraph);
        var TextPr = this.Internal_CalculateTextPr2(this.Internal_GetEndPos());
        NewParagraph.Internal_Content_Add(0, new ParaTextPr(TextPr));
        NewParagraph.TextPr.Value = this.TextPr.Value.Copy();
    },
    Undo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case history_undo_redo_const:
            Data.undo_function.call(this, Data);
            break;
        case historyitem_Paragraph_AddItem:
            var StartPos = this.Internal_Get_RealPos(Data.Pos);
            var EndPos = this.Internal_Get_RealPos(Data.EndPos);
            this.Content.splice(StartPos, EndPos - StartPos + 1);
            break;
        case historyitem_Paragraph_RemoveItem:
            var Pos = this.Internal_Get_RealPos(Data.Pos);
            var Array_start = this.Content.slice(0, Pos);
            var Array_end = this.Content.slice(Pos);
            this.Content = Array_start.concat(Data.Items, Array_end);
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
            this.Pr.Jc = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Ind_First:
            if (undefined === this.Pr.Ind) {
                this.Pr.Ind = new CParaSpacing();
            }
            this.Pr.Ind.FirstLine = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Ind_Left:
            if (undefined === this.Pr.Ind) {
                this.Pr.Ind = new CParaSpacing();
            }
            this.Pr.Ind.Left = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Ind_Right:
            if (undefined === this.Pr.Ind) {
                this.Pr.Ind = new CParaSpacing();
            }
            this.Pr.Ind.Right = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_ContextualSpacing:
            this.Pr.ContextualSpacing = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_KeepLines:
            this.Pr.KeepLines = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_KeepNext:
            this.Pr.KeepNext = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_PageBreakBefore:
            this.Pr.PageBreakBefore = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_Line:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.Line = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_LineRule:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.LineRule = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_Before:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.Before = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_After:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.After = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_AfterAutoSpacing:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.AfterAutoSpacing = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_BeforeAutoSpacing:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.BeforeAutoSpacing = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Shd_Value:
            if (undefined != Data.Old && undefined === this.Shd) {
                this.Shd = new CDocumentShd();
            }
            if (undefined != Data.Old) {
                this.Shd.Value = Data.Old;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Shd_Color:
            if (undefined != Data.Old && undefined === this.Shd) {
                this.Shd = new CDocumentShd();
            }
            if (undefined != Data.Old) {
                this.Shd.Color = Data.Old;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_WidowControl:
            this.Pr.WidowControl = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Tabs:
            this.Pr.Tabs = Data.Old;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_PStyle:
            var Old = Data.Old;
            if (undefined != Old) {
                this.Pr.PStyle = Old;
            } else {
                this.Pr.PStyle = undefined;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_DocNext:
            this.Next = Data.Old;
            break;
        case historyitem_Paragraph_DocPrev:
            this.Prev = Data.Old;
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
                this.Pr = Old;
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
            this.Recalc_CompiledPr();
            break;
        }
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
        History.RecalcData_Add(this.Parent);
    },
    Redo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case history_undo_redo_const:
            Data.redo_function.call(this, Data);
            break;
        case historyitem_Paragraph_AddItem:
            var Pos = this.Internal_Get_RealPos(Data.Pos);
            var Array_start = this.Content.slice(0, Pos);
            var Array_end = this.Content.slice(Pos);
            this.Content = Array_start.concat(Data.Items, Array_end);
            break;
        case historyitem_Paragraph_RemoveItem:
            var StartPos = this.Internal_Get_RealPos(Data.Pos);
            var EndPos = this.Internal_Get_RealPos(Data.EndPos);
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
            this.Pr.Jc = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Ind_First:
            if (undefined === this.Pr.Ind) {
                this.Pr.Ind = new CParaInd();
            }
            this.Pr.Ind.FirstLine = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Ind_Left:
            if (undefined === this.Pr.Ind) {
                this.Pr.Ind = new CParaInd();
            }
            this.Pr.Ind.Left = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Ind_Right:
            if (undefined === this.Pr.Ind) {
                this.Pr.Ind = new CParaInd();
            }
            this.Pr.Ind.Right = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_ContextualSpacing:
            this.Pr.ContextualSpacing = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_KeepLines:
            this.Pr.KeepLines = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_KeepNext:
            this.Pr.KeepNext = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_PageBreakBefore:
            this.Pr.PageBreakBefore = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_Line:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.Line = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_LineRule:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.LineRule = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_Before:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.Before = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_After:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.After = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_AfterAutoSpacing:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.AfterAutoSpacing = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Spacing_BeforeAutoSpacing:
            if (undefined === this.Pr.Spacing) {
                this.Pr.Spacing = new CParaSpacing();
            }
            this.Pr.Spacing.BeforeAutoSpacing = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Shd_Value:
            if (undefined != Data.New && undefined === this.Shd) {
                this.Shd = new CDocumentShd();
            }
            if (undefined != Data.New) {
                this.Shd.Value = Data.New;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Shd_Color:
            if (undefined != Data.New && undefined === this.Shd) {
                this.Shd = new CDocumentShd();
            }
            if (undefined != Data.New) {
                this.Shd.Color = Data.New;
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_WidowControl:
            this.Pr.WidowControl = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Tabs:
            this.Pr.Tabs = Data.New;
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
            this.Next = Data.New;
            break;
        case historyitem_Paragraph_DocPrev:
            this.Prev = Data.New;
            break;
        case historyitem_Paragraph_Parent:
            this.Parent = Data.New;
            break;
        case historyitem_Paragraph_Borders_Between:
            this.Pr.Brd.Between = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Bottom:
            this.Pr.Brd.Bottom = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Left:
            this.Pr.Brd.Left = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Right:
            this.Pr.Brd.Right = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Borders_Top:
            this.Pr.Brd.Top = Data.New;
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_Pr:
            var New = Data.New;
            if (undefined != New) {
                this.Pr = New;
            } else {
                this.Pr = new CParaPr();
            }
            this.CompiledPr.NeedRecalc = true;
            break;
        case historyitem_Paragraph_PresentationPr_Bullet:
            this.PresentationPr.Bullet = Data.New;
            break;
        case historyitem_Paragraph_PresentationPr_Level:
            this.PresentationPr.Level = Data.New;
            this.Recalc_CompiledPr();
            break;
        }
        this.RecalcInfo.Set_Type_0(pararecalc_0_All);
        History.RecalcData_Add(this.Get_ParentObject_or_DocumentPos());
    },
    Get_SelectionState: function () {
        var ParaState = new Object();
        ParaState.CurPos = {
            X: this.CurPos.X,
            Y: this.CurPos.Y,
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
        return this.Parent;
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
                this.Pr.NumPr.Read_FromBinary();
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
    },
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(historyitem_type_Paragraph);
        Writer.WriteString2("" + this.Id);
        Writer.WriteString2(this.Parent.Get_Id());
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
        CollaborativeEditing.Add_LinkData(this, LinkData);
        this.Pr = new CParaPr();
        this.Pr.Read_FromBinary(Reader);
        this.TextPr = g_oTableId.Get_ById(Reader.GetString2());
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
    }
};
var pararecalc_0_All = 0;
var pararecalc_0_None = 1;
function CParaRecalcInfo() {
    this.Recalc_0_Type = pararecalc_0_All;
}
CParaRecalcInfo.prototype = {
    Set_Type_0: function (Type) {
        this.Recalc_0_Type = Type;
    }
};
function CParaLineRange(X, XEnd) {
    this.X = X;
    this.W = 0;
    this.Words = 0;
    this.Spaces = 0;
    this.XEnd = XEnd;
}
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
function CParaLine() {
    this.Y = 0;
    this.W = 0;
    this.Top = 0;
    this.Bottom = 0;
    this.Words = 0;
    this.Spaces = 0;
    this.Metrics = new CParaLineMetrics();
    this.Ranges = new Array();
}
CParaLine.prototype = {
    Add_Range: function (X, XEnd) {
        this.Ranges.push(new CParaLineRange(X, XEnd));
    },
    Reset: function () {
        this.Y = 0;
        this.Top = 0;
        this.Bottom = 0;
        this.Words = 0;
        this.Spaces = 0;
        this.Metrics = new CParaLineMetrics();
        this.Ranges = new Array();
    }
};
function CDocumentBounds(Left, Top, Right, Bottom) {
    this.Bottom = Bottom;
    this.Left = Left;
    this.Right = Right;
    this.Top = Top;
}
function CParaPage(X, Y, XLimit, YLimit, FirstLine) {
    this.X = X;
    this.Y = Y;
    this.XLimit = XLimit;
    this.YLimit = YLimit;
    this.FirstLine = FirstLine;
    this.Bounds = new CDocumentBounds(X, Y, XLimit, Y);
}
CParaPage.prototype = {
    Reset: function (X, Y, XLimit, YLimit, FirstLine) {
        this.X = X;
        this.Y = Y;
        this.XLimit = XLimit;
        this.YLimit = YLimit;
        this.FirstLine = FirstLine;
        this.Bounds = new CDocumentBounds(X, Y, XLimit, Y);
    }
};