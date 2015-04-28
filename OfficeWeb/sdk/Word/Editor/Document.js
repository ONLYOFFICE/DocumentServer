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
var Page_Width = 210;
var Page_Height = 297;
var X_Left_Margin = 30;
var X_Right_Margin = 15;
var Y_Bottom_Margin = 20;
var Y_Top_Margin = 20;
var Y_Default_Header = 12.5;
var Y_Default_Footer = 12.5;
var X_Left_Field = X_Left_Margin;
var X_Right_Field = Page_Width - X_Right_Margin;
var Y_Bottom_Field = Page_Height - Y_Bottom_Margin;
var Y_Top_Field = Y_Top_Margin;
var docpostype_Content = 0;
var docpostype_FlowObjects = 1;
var docpostype_HdrFtr = 2;
var docpostype_DrawingObjects = 3;
var selectionflag_Common = 0;
var selectionflag_Numbering = 1;
var selectionflag_DrawingObject = 2;
var orientation_Portrait = 0;
var orientation_Landscape = 1;
var search_Common = 0;
var search_Header = 256;
var search_Footer = 512;
var search_HdrFtr_All = 1;
var search_HdrFtr_All_no_First = 2;
var search_HdrFtr_First = 3;
var search_HdrFtr_Even = 4;
var search_HdrFtr_Odd = 5;
var search_HdrFtr_Odd_no_First = 6;
var recalcresult_NextElement = 0;
var recalcresult_PrevPage = 1;
var recalcresult_CurPage = 2;
var recalcresult_NextPage = 3;
var recalcresult_NextLine = 4;
var recalcresult_CurLine = 5;
var recalcresult_CurPagePara = 6;
var recalcresult2_End = 0;
var recalcresult2_NextPage = 1;
var StartTime;
function CSelectedElement(Element, SelectedAll) {
    this.Element = Element;
    this.SelectedAll = SelectedAll;
}
function CSelectedContent() {
    this.Elements = [];
    this.DrawingObjects = [];
    this.Comments = [];
    this.Maths = [];
    this.HaveShape = false;
    this.MoveDrawing = false;
    this.HaveMath = false;
}
CSelectedContent.prototype = {
    Reset: function () {
        this.Elements = [];
        this.DrawingObjects = [];
        this.Comments = [];
        this.HaveShape = false;
    },
    Add: function (Element) {
        this.Elements.push(Element);
    },
    Set_MoveDrawing: function (Value) {
        this.MoveDrawing = Value;
    },
    On_EndCollectElements: function (LogicDocument, bNeedTurnOffHistory) {
        var Count = this.Elements.length;
        for (var Pos = 0; Pos < Count; Pos++) {
            var Element = this.Elements[Pos].Element;
            Element.Get_AllDrawingObjects(this.DrawingObjects);
            Element.Get_AllComments(this.Comments);
            Element.Get_AllMaths(this.Maths);
        }
        this.HaveMath = (this.Maths.length > 0 ? true : false);
        Count = this.DrawingObjects.length;
        for (var Pos = 0; Pos < Count; Pos++) {
            var DrawingObj = this.DrawingObjects[Pos];
            var ShapeType = DrawingObj.GraphicObj.getObjectType();
            if (historyitem_type_Shape === ShapeType || historyitem_type_GroupShape === ShapeType) {
                this.HaveShape = true;
                break;
            }
        }
        var Comments = {};
        Count = this.Comments.length;
        for (var Pos = 0; Pos < Count; Pos++) {
            var Element = this.Comments[Pos];
            var Id = Element.Comment.CommentId;
            if (undefined === Comments[Id]) {
                Comments[Id] = {};
            }
            if (true === Element.Comment.Start) {
                Comments[Id].Start = Element.Paragraph;
            } else {
                Comments[Id].End = Element.Paragraph;
            }
        }
        var NewComments = [];
        for (var Id in Comments) {
            var Element = Comments[Id];
            var Para = null;
            if (undefined === Element.Start && undefined !== Element.End) {
                Para = Element.End;
            } else {
                if (undefined !== Element.Start && undefined === Element.End) {
                    Para = Element.Start;
                } else {
                    if (undefined !== Element.Start && undefined !== Element.End) {
                        NewComments.push(Id);
                    }
                }
            }
            if (null !== Para) {
                var OldVal = Para.DeleteCommentOnRemove;
                Para.DeleteCommentOnRemove = false;
                Para.Remove_CommentMarks(Id);
                Para.DeleteCommentOnRemove = OldVal;
            }
        }
        Count = NewComments.length;
        var Count2 = this.Comments.length;
        var DocumentComments = LogicDocument.Comments;
        for (var Pos = 0; Pos < Count; Pos++) {
            var Id = NewComments[Pos];
            var OldComment = DocumentComments.Get_ById(Id);
            if (null !== OldComment) {
                var NewComment = OldComment.Copy();
                if (true !== bNeedTurnOffHistory) {
                    DocumentComments.Add(NewComment);
                    editor.sync_AddComment(NewComment.Get_Id(), NewComment.Data);
                    for (var Pos2 = 0; Pos2 < Count2; Pos2++) {
                        var Element = this.Comments[Pos2].Comment;
                        if (Id === Element.CommentId) {
                            Element.Set_CommentId(NewComment.Get_Id());
                        }
                    }
                }
            }
        }
    }
};
function CDocumentRecalculateState() {
    this.Id = null;
    this.PageIndex = 0;
    this.Start = true;
    this.StartIndex = 0;
    this.StartPage = 0;
    this.NewSection = false;
    this.MainStartPos = -1;
}
function Document_Recalculate_Page() {
    var LogicDocument = editor.WordControl.m_oLogicDocument;
    LogicDocument.Recalculate_Page();
}
function CDocumentPage() {
    this.Width = 0;
    this.Height = 0;
    this.Margins = {
        Left: 0,
        Right: 0,
        Top: 0,
        Bottom: 0
    };
    this.Bounds = new CDocumentBounds(0, 0, 0, 0);
    this.Pos = 0;
    this.EndPos = 0;
    this.X = 0;
    this.Y = 0;
    this.XLimit = 0;
    this.YLimit = 0;
    this.EndSectionParas = [];
}
CDocumentPage.prototype = {
    Update_Limits: function (Limits) {
        this.X = Limits.X;
        this.XLimit = Limits.XLimit;
        this.Y = Limits.Y;
        this.YLimit = Limits.YLimit;
    },
    Shift: function (Dx, Dy) {
        this.X += Dx;
        this.XLimit += Dx;
        this.Y += Dy;
        this.YLimit += Dy;
        this.Bounds.Shift(Dx, Dy);
    },
    Check_EndSectionPara: function (Element) {
        var Count = this.EndSectionParas.length;
        for (var Index = 0; Index < Count; Index++) {
            if (Element === this.EndSectionParas[Index]) {
                return true;
            }
        }
        return false;
    },
    Copy: function () {
        var NewPage = new CDocumentPage();
        NewPage.Width = this.Width;
        NewPage.Height = this.Height;
        NewPage.Margins.Left = this.Margins.Left;
        NewPage.Margins.Right = this.Margins.Right;
        NewPage.Margins.Top = this.Margins.Top;
        NewPage.Margins.Bottom = this.Margins.Bottom;
        NewPage.Bounds.Left = this.Bounds.Left;
        NewPage.Bounds.Right = this.Bounds.Right;
        NewPage.Bounds.Top = this.Bounds.Top;
        NewPage.Bounds.Bottom = this.Bounds.Bottom;
        NewPage.Pos = this.Pos;
        NewPage.EndPos = this.EndPos;
        NewPage.X = this.X;
        NewPage.Y = this.Y;
        NewPage.XLimit = this.XLimit;
        NewPage.YLimit = this.YLimit;
        return NewPage;
    }
};
function CStatistics(LogicDocument) {
    this.LogicDocument = LogicDocument;
    this.Id = null;
    this.StartPos = 0;
    this.CurPage = 0;
    this.Pages = 0;
    this.Words = 0;
    this.Paragraphs = 0;
    this.SymbolsWOSpaces = 0;
    this.SymbolsWhSpaces = 0;
}
CStatistics.prototype = {
    Start: function () {
        this.StartPos = 0;
        this.CurPage = 0;
        this.Pages = 0;
        this.Words = 0;
        this.Paragraphs = 0;
        this.SymbolsWOSpaces = 0;
        this.SymbolsWhSpaces = 0;
        this.Id = setTimeout(function () {
            editor.WordControl.m_oLogicDocument.Statistics_OnPage();
        },
        1);
        this.Send();
    },
    Next: function (StartPos, CurPage) {
        clearTimeout(this.Id);
        this.StartPos = StartPos;
        this.CurPage = CurPage;
        this.Id = setTimeout(function () {
            editor.WordControl.m_oLogicDocument.Statistics_OnPage();
        },
        1);
        this.Send();
    },
    Stop: function () {
        if (null != this.Id) {
            this.Send();
            clearTimeout(this.Id);
            this.Id = null;
            editor.sync_GetDocInfoEndCallback();
        }
    },
    Send: function () {
        var Stats = {
            PageCount: this.Pages,
            WordsCount: this.Words,
            ParagraphCount: this.Paragraphs,
            SymbolsCount: this.SymbolsWOSpaces,
            SymbolsWSCount: this.SymbolsWhSpaces
        };
        editor.sync_DocInfoCallback(Stats);
    },
    Add_Paragraph: function (Count) {
        if ("undefined" != typeof(Count)) {
            this.Paragraphs += Count;
        } else {
            this.Paragraphs++;
        }
    },
    Add_Word: function (Count) {
        if ("undefined" != typeof(Count)) {
            this.Words += Count;
        } else {
            this.Words++;
        }
    },
    Add_Page: function (Count) {
        if ("undefined" != typeof(Count)) {
            this.Pages += Count;
        } else {
            this.Pages++;
        }
    },
    Add_Symbol: function (bSpace) {
        this.SymbolsWhSpaces++;
        if (true != bSpace) {
            this.SymbolsWOSpaces++;
        }
    }
};
function CDocumentRecalcInfo() {
    this.FlowObject = null;
    this.FlowObjectPageBreakBefore = false;
    this.FlowObjectPage = 0;
    this.FlowObjectElementsCount = 0;
    this.RecalcResult = recalcresult_NextElement;
    this.WidowControlParagraph = null;
    this.WidowControlLine = -1;
    this.WidowControlReset = false;
    this.KeepNextParagraph = null;
    this.FrameRecalc = false;
}
CDocumentRecalcInfo.prototype = {
    Reset: function () {
        this.FlowObject = null;
        this.FlowObjectPageBreakBefore = false;
        this.FlowObjectPage = 0;
        this.FlowObjectElementsCount = 0;
        this.RecalcResult = recalcresult_NextElement;
        this.WidowControlParagraph = null;
        this.WidowControlLine = -1;
        this.WidowControlReset = false;
        this.KeepNextParagraph = null;
    },
    Can_RecalcObject: function () {
        if (null === this.FlowObject && null === this.WidowControlParagraph && null === this.KeepNextParagraph) {
            return true;
        }
        return false;
    },
    Set_FlowObject: function (Object, RelPage, RecalcResult, ElementsCount) {
        this.FlowObject = Object;
        this.FlowObjectPage = RelPage;
        this.FlowObjectElementsCount = ElementsCount;
        this.RecalcResult = RecalcResult;
    },
    Check_FlowObject: function (FlowObject) {
        if (FlowObject === this.FlowObject) {
            return true;
        }
        return false;
    },
    Set_PageBreakBefore: function (Value) {
        this.FlowObjectPageBreakBefore = Value;
    },
    Is_PageBreakBefore: function () {
        return this.FlowObjectPageBreakBefore;
    },
    Set_WidowControl: function (Paragraph, Line) {
        this.WidowControlParagraph = Paragraph;
        this.WidowControlLine = Line;
    },
    Check_WidowControl: function (Paragraph, Line) {
        if (Paragraph === this.WidowControlParagraph && Line === this.WidowControlLine) {
            return true;
        }
        return false;
    },
    Set_KeepNext: function (Paragraph) {
        this.KeepNextParagraph = Paragraph;
    },
    Check_KeepNext: function (Paragraph) {
        if (Paragraph === this.KeepNextParagraph) {
            return true;
        }
        return false;
    },
    Reset_WidowControl: function () {
        this.WidowControlReset = true;
    },
    Set_FrameRecalc: function (Value) {
        this.FrameRecalc = Value;
    }
};
function CDocument(DrawingDocument) {
    this.History = History;
    History.Document = this;
    this.IdCounter = g_oIdCounter;
    this.TableId = g_oTableId;
    this.CollaborativeEditing = null;
    if (typeof CollaborativeEditing !== "undefined") {
        this.CollaborativeEditing = CollaborativeEditing;
    }
    this.Id = g_oIdCounter.Get_NewId();
    this.StartPage = 0;
    this.CurPage = 0;
    this.StyleCounter = 0;
    this.NumInfoCounter = 0;
    this.SectPr = new CSectionPr(this);
    this.SectionsInfo = new CDocumentSectionsInfo();
    this.Content = [];
    this.Content[0] = new Paragraph(DrawingDocument, this, 0, 0, 0, 0, 0);
    this.Content[0].Set_DocumentNext(null);
    this.Content[0].Set_DocumentPrev(null);
    this.ContentLastChangePos = 0;
    this.CurPos = {
        X: 0,
        Y: 0,
        ContentPos: 0,
        RealX: 0,
        RealY: 0,
        Type: docpostype_Content
    };
    this.Selection = {
        Start: false,
        Use: false,
        StartPos: 0,
        EndPos: 0,
        Flag: selectionflag_Common,
        Data: null,
        UpdateOnRecalc: false,
        DragDrop: {
            Flag: 0,
            Data: null
        }
    };
    this.Pages = [];
    this.RecalcInfo = new CDocumentRecalcInfo();
    this.RecalcId = 0;
    this.FullRecalc = new CDocumentRecalculateState();
    this.TurnOffRecalc = false;
    this.TurnOffInterfaceEvents = false;
    this.TurnOffRecalcCurPos = false;
    this.CheckEmptyElementsOnSelection = true;
    this.Numbering = new CNumbering();
    this.Styles = new CStyles();
    this.DrawingDocument = DrawingDocument;
    this.NeedUpdateTarget = false;
    this.ReindexStartPos = -1;
    this.HdrFtr = new CHeaderFooterController(this, this.DrawingDocument);
    this.SearchInfo = {
        Id: null,
        StartPos: 0,
        CurPage: 0,
        String: null
    };
    this.TargetPos = {
        X: 0,
        Y: 0,
        PageNum: 0
    };
    this.CopyTextPr = null;
    this.CopyParaPr = null;
    this.Statistics = new CStatistics(this);
    this.HighlightColor = null;
    if (typeof CComments !== "undefined") {
        this.Comments = new CComments();
    }
    this.Lock = new CLock();
    this.m_oContentChanges = new CContentChanges();
    this.DrawingObjects = null;
    if (typeof CGraphicObjects !== "undefined") {
        this.DrawingObjects = new CGraphicObjects(this, this.DrawingDocument, editor);
    }
    this.theme = GenerateDefaultTheme(this);
    this.clrSchemeMap = GenerateDefaultColorMap();
    this.SearchEngine = null;
    if (typeof CDocumentSearch !== "undefined") {
        this.SearchEngine = new CDocumentSearch();
    }
    this.Spelling = new CDocumentSpelling();
    this.UseTextShd = true;
    g_oTableId.Add(this, this.Id);
}
var selected_None = -1;
var selected_DrawingObject = 0;
var selected_DrawingObjectText = 1;
function CSelectedElementsInfo() {
    this.m_bTable = false;
    this.m_bMixedSelection = false;
    this.m_nDrawing = selected_None;
    this.m_pParagraph = null;
    this.m_oMath = null;
    this.m_oHyperlink = null;
    this.Reset = function () {
        this.m_bSelection = false;
        this.m_bTable = false;
        this.m_bMixedSelection = false;
        this.m_nDrawing = -1;
    };
    this.Set_Paragraph = function (Para) {
        this.m_pParagraph = Para;
    };
    this.Set_Math = function (Math) {
        this.m_oMath = Math;
    };
    this.Set_Hyperlink = function (Hyperlink) {
        this.m_oHyperlink = Hyperlink;
    };
    this.Get_Paragraph = function () {
        return this.m_pParagraph;
    };
    this.Get_Math = function () {
        return this.m_oMath;
    };
    this.Get_Hyperlink = function () {
        return this.m_oHyperlink;
    };
    this.Set_Table = function () {
        this.m_bTable = true;
    };
    this.Set_Drawing = function (nDrawing) {
        this.m_nDrawing = nDrawing;
    };
    this.Is_DrawingObjSelected = function () {
        return (this.m_nDrawing === selected_DrawingObject ? true : false);
    };
    this.Set_MixedSelection = function () {
        this.m_bMixedSelection = true;
    };
    this.Is_InTable = function () {
        return this.m_bTable;
    };
    this.Is_MixedSelection = function () {
        return this.m_bMixedSelection;
    };
}
CDocument.prototype = {
    Init: function () {},
    Get_Id: function () {
        return this.Id;
    },
    Set_Id: function (newId) {
        g_oTableId.Reset_Id(this, newId, this.Id);
        this.Id = newId;
    },
    On_EndLoad: function () {
        this.Update_SectionsInfo();
        this.Check_SectionLastParagraph();
        if (null != this.DrawingObjects) {
            this.DrawingObjects.addToZIndexManagerAfterOpen();
        }
        this.Cursor_MoveToStartPos(false);
        if (editor.DocInfo) {
            var TemplateReplacementData = editor.DocInfo.get_TemplateReplacement();
            if (null !== TemplateReplacementData) {
                this.private_ProcessTemplateReplacement(TemplateReplacementData);
            }
        }
    },
    Add_TestDocument: function () {
        this.Content = [];
        var Text = ["Comparison view helps you track down memory leaks, by displaying which objects have been correctly cleaned up by the garbage collector. Generally used to record and compare two (or more) memory snapshots of before and after an operation. The idea is that inspecting the delta in freed memory and reference count lets you confirm the presence and cause of a memory leak.", "Containment view provides a better view of object structure, helping us analyse objects referenced in the global namespace (i.e. window) to find out what is keeping them around. It lets you analyse closures and dive into your objects at a low level.", "Dominators view helps confirm that no unexpected references to objects are still hanging around (i.e that they are well contained) and that deletion/garbage collection is actually working."];
        var ParasCount = 50;
        var RunsCount = Text.length;
        for (var ParaIndex = 0; ParaIndex < ParasCount; ParaIndex++) {
            var Para = new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0);
            for (var RunIndex = 0; RunIndex < RunsCount; RunIndex++) {
                var String = Text[RunIndex];
                var StringLen = String.length;
                for (var TextIndex = 0; TextIndex < StringLen; TextIndex++) {
                    var Run = new ParaRun(Para);
                    var TextElement = String[TextIndex];
                    var Element = (TextElement !== " " ? new ParaText(TextElement) : new ParaSpace());
                    Run.Add_ToContent(TextIndex, Element, false);
                    Para.Add_ToContent(0, Run);
                }
            }
            this.Internal_Content_Add(this.Content.length, Para);
        }
        var RecalculateData = {
            Inline: {
                Pos: 0,
                PageNum: 0
            },
            Flow: [],
            HdrFtr: [],
            Drawings: {
                All: true,
                Map: {}
            }
        };
        this.Recalculate(false, false, RecalculateData);
    },
    LoadEmptyDocument: function () {
        this.DrawingDocument.TargetStart();
        this.Recalculate();
        this.Interface_Update_ParaPr();
        this.Interface_Update_TextPr();
    },
    Set_CurrentElement: function (Index, bUpdateStates) {
        var OldDocPosType = this.CurPos.Type;
        var ContentPos = Math.max(0, Math.min(this.Content.length - 1, Index));
        this.CurPos.Type = docpostype_Content;
        this.CurPos.ContentPos = Math.max(0, Math.min(this.Content.length - 1, Index));
        if (true === this.Content[ContentPos].Is_SelectionUse()) {
            this.Selection.Flag = selectionflag_Common;
            this.Selection.Use = true;
            this.Selection.StartPos = ContentPos;
            this.Selection.EndPos = ContentPos;
        } else {
            this.Selection_Remove();
        }
        if (false != bUpdateStates) {
            this.Document_UpdateInterfaceState();
            this.Document_UpdateRulersState();
            this.Document_UpdateSelectionState();
        }
        if (docpostype_HdrFtr === OldDocPosType) {
            this.DrawingDocument.ClearCachePages();
            this.DrawingDocument.FirePaint();
        }
    },
    Is_ThisElementCurrent: function () {
        return true;
    },
    Update_ConentIndexing: function () {
        if (-1 !== this.ReindexStartPos) {
            for (var Index = this.ReindexStartPos, Count = this.Content.length; Index < Count; Index++) {
                this.Content[Index].Index = Index;
            }
            this.ReindexStartPos = -1;
        }
    },
    protected_ReindexContent: function (StartPos) {
        if (-1 === this.ReindexStartPos || this.ReindexStartPos > StartPos) {
            this.ReindexStartPos = StartPos;
        }
    },
    Get_PageContentStartPos: function (PageIndex, ElementIndex) {
        if (undefined === ElementIndex && undefined !== this.Pages[PageIndex]) {
            ElementIndex = this.Pages[PageIndex].Pos;
        }
        var SectPr = this.SectionsInfo.Get_SectPr(ElementIndex).SectPr;
        var Y = SectPr.PageMargins.Top;
        var YLimit = SectPr.PageSize.H - SectPr.PageMargins.Bottom;
        var X = SectPr.PageMargins.Left;
        var XLimit = SectPr.PageSize.W - SectPr.PageMargins.Right;
        var HdrFtrLine = this.HdrFtr.Get_HdrFtrLines(PageIndex);
        var YHeader = HdrFtrLine.Top;
        if (null !== YHeader && YHeader > Y) {
            Y = YHeader;
        }
        var YFooter = HdrFtrLine.Bottom;
        if (null !== YFooter && YFooter < YLimit) {
            YLimit = YFooter;
        }
        return {
            X: X,
            Y: Y,
            XLimit: XLimit,
            YLimit: YLimit
        };
    },
    Get_PageLimits: function (PageIndex) {
        var Index = (undefined !== this.Pages[PageIndex] ? this.Pages[PageIndex].Pos : 0);
        var SectPr = this.SectionsInfo.Get_SectPr(Index).SectPr;
        var W = SectPr.Get_PageWidth();
        var H = SectPr.Get_PageHeight();
        return {
            X: 0,
            Y: 0,
            XLimit: W,
            YLimit: H
        };
    },
    Get_PageFields: function (PageIndex) {
        var Index = (undefined !== this.Pages[PageIndex] ? this.Pages[PageIndex].Pos : 0);
        var SectPr = this.SectionsInfo.Get_SectPr(Index).SectPr;
        var Y = SectPr.PageMargins.Top;
        var YLimit = SectPr.PageSize.H - SectPr.PageMargins.Bottom;
        var X = SectPr.PageMargins.Left;
        var XLimit = SectPr.PageSize.W - SectPr.PageMargins.Right;
        return {
            X: X,
            Y: Y,
            XLimit: XLimit,
            YLimit: YLimit
        };
    },
    Get_Theme: function () {
        return this.theme;
    },
    Get_ColorMap: function () {
        return this.clrSchemeMap;
    },
    TurnOff_Recalculate: function () {
        this.TurnOffRecalc = true;
    },
    TurnOn_Recalculate: function (bRecalculate) {
        this.TurnOffRecalc = false;
        if (bRecalculate) {
            this.Recalculate();
        }
    },
    Recalculate: function (bOneParagraph, bRecalcContentLast, _RecalcData) {
        StartTime = new Date().getTime();
        if (true === this.TurnOffRecalc) {
            return;
        }
        if (false != this.SearchEngine.ClearOnRecalc) {
            var bOldSearch = (this.SearchEngine.Count > 0 ? true : false);
            this.SearchEngine.Clear();
            if (true === bOldSearch) {
                editor.sync_SearchEndCallback();
                this.DrawingDocument.ClearCachePages();
                this.DrawingDocument.FirePaint();
            }
        }
        this.NeedUpdateTarget = true;
        this.RecalcId++;
        if (undefined === _RecalcData) {
            var SimpleChanges = History.Is_SimpleChanges();
            if (1 === SimpleChanges.length) {
                var Run = SimpleChanges[0].Class;
                var Para = Run.Paragraph;
                var Res = Para.Recalculate_FastRange(SimpleChanges);
                if (-1 !== Res) {
                    if (Res === Para.Get_StartPage_Absolute() + Para.Pages.length - 1) {
                        var NextElement = Para.Get_DocumentNext();
                        if (null !== NextElement && true === this.Pages[Res].Check_EndSectionPara(NextElement)) {
                            var LastVisibleBounds = Para.Get_LastRangeVisibleBounds();
                            var ___X = LastVisibleBounds.X + LastVisibleBounds.W;
                            var ___Y = LastVisibleBounds.Y;
                            NextElement.Reset(___X, ___Y, Math.max(___X + 10, NextElement.XLimit), 10000, Res);
                            NextElement.Recalculate_Page(Res);
                        }
                    }
                    this.DrawingDocument.OnRecalculatePage(Res, this.Pages[Res]);
                    this.DrawingDocument.OnEndRecalculate(false, true);
                    History.Reset_RecalcIndex();
                    this.private_UpdateCursorXY(true, true);
                    return;
                }
            }
            if (SimpleChanges.length >= 1) {
                var Run = SimpleChanges[0].Class;
                var Para = Run.Paragraph;
                var FastPages = Para.Recalculate_FastWholeParagraph();
                var FastPagesCount = FastPages.length;
                if (FastPagesCount > 0) {
                    var NextElement = Para.Get_DocumentNext();
                    var LastFastPage = FastPages[FastPagesCount - 1];
                    if (null !== NextElement && true === this.Pages[LastFastPage].Check_EndSectionPara(NextElement)) {
                        var LastVisibleBounds = Para.Get_LastRangeVisibleBounds();
                        var ___X = LastVisibleBounds.X + LastVisibleBounds.W;
                        var ___Y = LastVisibleBounds.Y;
                        NextElement.Reset(___X, ___Y, Math.max(___X + 10, NextElement.XLimit), 10000, LastFastPage);
                        NextElement.Recalculate_Page(LastFastPage);
                    }
                    for (var Index = 0; Index < FastPagesCount; Index++) {
                        var PageIndex = FastPages[Index];
                        this.DrawingDocument.OnRecalculatePage(PageIndex, this.Pages[PageIndex]);
                    }
                    this.DrawingDocument.OnEndRecalculate(false, true);
                    History.Reset_RecalcIndex();
                    this.private_UpdateCursorXY(true, true);
                    return;
                }
            }
        }
        this.RecalcInfo.Reset();
        var ChangeIndex = 0;
        var MainChange = false;
        var RecalcData = (undefined === _RecalcData ? History.Get_RecalcData() : _RecalcData);
        History.Reset_RecalcIndex();
        this.DrawingObjects.recalculate_(RecalcData.Drawings);
        this.DrawingObjects.recalculateText_(RecalcData.Drawings);
        for (var GraphIndex = 0; GraphIndex < RecalcData.Flow.length; GraphIndex++) {
            RecalcData.Flow[GraphIndex].recalculateDocContent();
        }
        var SectPrIndex = -1;
        for (var HdrFtrIndex = 0; HdrFtrIndex < RecalcData.HdrFtr.length; HdrFtrIndex++) {
            var HdrFtr = RecalcData.HdrFtr[HdrFtrIndex];
            var FindIndex = this.SectionsInfo.Find_ByHdrFtr(HdrFtr);
            if (-1 === FindIndex) {
                continue;
            }
            var SectPr = this.SectionsInfo.Get_SectPr2(FindIndex).SectPr;
            var HdrFtrInfo = SectPr.Get_HdrFtrInfo(HdrFtr);
            if (null !== HdrFtrInfo) {
                var bHeader = HdrFtrInfo.Header;
                var bFirst = HdrFtrInfo.First;
                var bEven = HdrFtrInfo.Even;
                var CheckSectIndex = -1;
                if (true === bFirst) {
                    var CurSectIndex = FindIndex;
                    var SectCount = this.SectionsInfo.Elements.length;
                    while (CurSectIndex < SectCount) {
                        var CurSectPr = this.SectionsInfo.Get_SectPr2(CurSectIndex).SectPr;
                        if (FindIndex === CurSectIndex || null === CurSectPr.Get_HdrFtr(bHeader, bFirst, bEven)) {
                            if (true === CurSectPr.Get_TitlePage()) {
                                CheckSectIndex = CurSectIndex;
                                break;
                            }
                        } else {
                            break;
                        }
                        CurSectIndex++;
                    }
                } else {
                    if (true === bEven) {
                        if (true === EvenAndOddHeaders) {
                            CheckSectIndex = FindIndex;
                        }
                    } else {
                        CheckSectIndex = FindIndex;
                    }
                }
                if (-1 !== CheckSectIndex && (-1 === SectPrIndex || CheckSectIndex < SectPrIndex)) {
                    SectPrIndex = CheckSectIndex;
                }
            }
        }
        if (-1 === RecalcData.Inline.Pos && -1 === SectPrIndex) {
            ChangeIndex = -1;
            RecalcData.Inline.PageNum = 0;
        } else {
            if (-1 === RecalcData.Inline.Pos) {
                MainChange = false;
                ChangeIndex = (0 === SectPrIndex ? 0 : this.SectionsInfo.Get_SectPr2(SectPrIndex - 1).Index + 1);
                RecalcData.Inline.PageNum = 0;
            } else {
                if (-1 === SectPrIndex) {
                    MainChange = true;
                    ChangeIndex = RecalcData.Inline.Pos;
                } else {
                    MainChange = true;
                    ChangeIndex = RecalcData.Inline.Pos;
                    var ChangeIndex2 = (0 === SectPrIndex ? 0 : this.SectionsInfo.Get_SectPr2(SectPrIndex - 1).Index + 1);
                    if (ChangeIndex2 <= ChangeIndex) {
                        ChangeIndex = ChangeIndex2;
                        RecalcData.Inline.PageNum = 0;
                    }
                }
            }
        }
        if (ChangeIndex < 0) {
            this.DrawingDocument.ClearCachePages();
            this.DrawingDocument.FirePaint();
            return;
        } else {
            if (ChangeIndex >= this.Content.length) {
                ChangeIndex = this.Content.length - 1;
            }
        }
        while (ChangeIndex > 0) {
            var PrevElement = this.Content[ChangeIndex - 1];
            if (type_Paragraph === PrevElement.Get_Type() && true === PrevElement.Get_CompiledPr2(false).ParaPr.KeepNext) {
                ChangeIndex--;
                RecalcData.Inline.PageNum = PrevElement.Get_StartPage_Absolute() + (PrevElement.Pages.length - 1);
            } else {
                break;
            }
        }
        var StartPage = 0;
        var StartIndex = 0;
        var ChangedElement = this.Content[ChangeIndex];
        if (ChangedElement.Pages.length > 0 && -1 !== ChangedElement.Index && ChangedElement.Get_StartPage_Absolute() < RecalcData.Inline.PageNum - 1) {
            StartIndex = ChangeIndex;
            StartPage = RecalcData.Inline.PageNum - 1;
        } else {
            var PagesCount = this.Pages.length;
            for (var PageIndex = 0; PageIndex < PagesCount; PageIndex++) {
                if (ChangeIndex > this.Pages[PageIndex].Pos) {
                    StartPage = PageIndex;
                    StartIndex = this.Pages[PageIndex].Pos;
                } else {
                    break;
                }
            }
            if (ChangeIndex === StartIndex && StartPage < RecalcData.Inline.PageNum) {
                StartPage = RecalcData.Inline.PageNum - 1;
            }
        }
        if (null != this.FullRecalc.Id) {
            clearTimeout(this.FullRecalc.Id);
            this.FullRecalc.Id = null;
            this.DrawingDocument.OnEndRecalculate(false);
            if (this.FullRecalc.StartIndex < StartIndex) {
                StartIndex = this.FullRecalc.StartIndex;
                StartPage = this.FullRecalc.PageIndex;
            }
        }
        var bNewSection = (0 === StartPage ? true : false);
        if (0 !== StartPage) {
            var PrevStartIndex = this.Pages[StartPage - 1].Pos;
            var CurSectInfo = this.SectionsInfo.Get_SectPr(StartIndex);
            var PrevSectInfo = this.SectionsInfo.Get_SectPr(PrevStartIndex);
            if (PrevSectInfo !== CurSectInfo && (section_type_Continuous !== CurSectInfo.SectPr.Get_Type() || true !== CurSectInfo.SectPr.Compare_PageSize(PrevSectInfo.SectPr))) {
                bNewSection = true;
            }
        }
        this.FullRecalc.PageIndex = StartPage;
        this.FullRecalc.Start = true;
        this.FullRecalc.StartIndex = StartIndex;
        this.FullRecalc.StartPage = StartPage;
        this.FullRecalc.NewSection = bNewSection;
        if (true === MainChange) {
            this.FullRecalc.MainStartPos = StartIndex;
        }
        this.DrawingDocument.OnStartRecalculate(StartPage);
        this.Recalculate_Page();
    },
    Recalculate_Page: function () {
        var PageIndex = this.FullRecalc.PageIndex;
        var bStart = this.FullRecalc.Start;
        var StartIndex = this.FullRecalc.StartIndex;
        var bStartNewSection = this.FullRecalc.NewSection;
        var SectElement = this.SectionsInfo.Get_SectPr(StartIndex);
        var OldPage = (undefined !== this.Pages[PageIndex] ? this.Pages[PageIndex] : null);
        if (true === bStart) {
            this.Pages[PageIndex] = new CDocumentPage();
            this.Pages[PageIndex].Pos = StartIndex;
            if (true === this.HdrFtr.Recalculate(PageIndex)) {
                this.FullRecalc.MainStartPos = StartIndex;
            }
            var SectPr = this.SectionsInfo.Get_SectPr(StartIndex).SectPr;
            this.Pages[PageIndex].Width = SectPr.PageSize.W;
            this.Pages[PageIndex].Height = SectPr.PageSize.H;
            this.Pages[PageIndex].Margins.Left = SectPr.PageMargins.Left;
            this.Pages[PageIndex].Margins.Top = SectPr.PageMargins.Top;
            this.Pages[PageIndex].Margins.Right = SectPr.PageSize.W - SectPr.PageMargins.Right;
            this.Pages[PageIndex].Margins.Bottom = SectPr.PageSize.H - SectPr.PageMargins.Bottom;
        }
        var Count = this.Content.length;
        var MainStartPos = this.FullRecalc.MainStartPos;
        if (null !== OldPage && (-1 === MainStartPos || MainStartPos > StartIndex)) {
            if (OldPage.EndPos >= Count - 1 && PageIndex - this.Content[Count - 1].Get_StartPage_Absolute() >= this.Content[Count - 1].Pages.length - 1) {
                this.Pages[PageIndex] = OldPage;
                this.DrawingDocument.OnRecalculatePage(PageIndex, this.Pages[PageIndex]);
                this.Internal_CheckCurPage();
                this.DrawingDocument.OnEndRecalculate(true);
                this.DrawingObjects.onEndRecalculateDocument(this.Pages.length);
                if (true === this.Selection.UpdateOnRecalc) {
                    this.Selection.UpdateOnRecalc = false;
                    this.DrawingDocument.OnSelectEnd();
                }
                this.FullRecalc.Id = null;
                this.FullRecalc.MainStartPos = -1;
                return;
            } else {
                if (undefined !== this.Pages[PageIndex + 1]) {
                    this.Pages[PageIndex] = OldPage;
                    this.DrawingDocument.OnRecalculatePage(PageIndex, this.Pages[PageIndex]);
                    this.FullRecalc.PageIndex = PageIndex + 1;
                    this.FullRecalc.Start = true;
                    this.FullRecalc.StartIndex = this.Pages[PageIndex + 1].Pos;
                    this.FullRecalc.NewSection = false;
                    var CurSectInfo = this.SectionsInfo.Get_SectPr(this.Pages[PageIndex + 1].Pos);
                    var PrevSectInfo = this.SectionsInfo.Get_SectPr(this.Pages[PageIndex].EndPos);
                    if (PrevSectInfo !== CurSectInfo) {
                        this.FullRecalc.NewSection = true;
                    }
                    if (window["NATIVE_EDITOR_ENJINE_SYNC_RECALC"] === true) {
                        if (PageIndex + 1 > this.FullRecalc.StartPage + 2) {
                            if (window["native"]["WC_CheckSuspendRecalculate"] !== undefined) {
                                this.FullRecalc.Id = setTimeout(Document_Recalculate_Page, 10);
                                return;
                            }
                        }
                        this.Recalculate_Page();
                        return;
                    }
                    if (PageIndex + 1 > this.FullRecalc.StartPage + 2) {
                        this.FullRecalc.Id = setTimeout(Document_Recalculate_Page, 20);
                    } else {
                        this.Recalculate_Page();
                    }
                    return;
                }
            }
        } else {
            if (true === bStart) {
                this.Pages.length = PageIndex + 1;
                this.DrawingObjects.createGraphicPage(PageIndex);
                this.DrawingObjects.resetDrawingArrays(PageIndex, this);
            }
        }
        var StartPos = this.Get_PageContentStartPos(PageIndex, StartIndex);
        var X = StartPos.X;
        var StartY = StartPos.Y;
        var Y = StartY;
        var YLimit = StartPos.YLimit;
        var XLimit = StartPos.XLimit;
        var Page = this.Pages[PageIndex];
        this.Pages[PageIndex].X = X;
        this.Pages[PageIndex].XLimit = XLimit;
        this.Pages[PageIndex].Y = Y;
        this.Pages[PageIndex].YLimit = YLimit;
        var bReDraw = true;
        var bContinue = false;
        var _PageIndex = PageIndex;
        var _StartIndex = StartIndex;
        var _bStart = false;
        var _bStartNewSection = false;
        var Index;
        for (Index = StartIndex; Index < Count; Index++) {
            var Element = this.Content[Index];
            Element.TurnOff_RecalcEvent();
            var RecalcResult = recalcresult_NextElement;
            var bFlow = false;
            if (type_Table === Element.GetType() && true != Element.Is_Inline()) {
                bFlow = true;
                if (true === this.RecalcInfo.Can_RecalcObject()) {
                    if ((0 === Index && 0 === PageIndex) || Index != StartIndex || (Index === StartIndex && true === bStartNewSection)) {
                        Element.Set_DocumentIndex(Index);
                        Element.Reset(X, Y, XLimit, YLimit, PageIndex);
                    }
                    var TempRecalcResult = Element.Recalculate_Page(PageIndex);
                    this.RecalcInfo.Set_FlowObject(Element, 0, TempRecalcResult, -1);
                    var FlowTable = new CFlowTable(Element, PageIndex);
                    this.DrawingObjects.addFloatTable(FlowTable);
                    if (0 === FlowTable.PageController) {
                        RecalcResult = recalcresult_CurPage;
                    } else {
                        RecalcResult = TempRecalcResult;
                        this.RecalcInfo.Reset();
                    }
                } else {
                    if (true === this.RecalcInfo.Check_FlowObject(Element)) {
                        if (Element.PageNum > PageIndex || (this.RecalcInfo.FlowObjectPage <= 0 && Element.PageNum < PageIndex)) {
                            this.DrawingObjects.removeFloatTableById(PageIndex - 1, Element.Get_Id());
                            this.RecalcInfo.Set_PageBreakBefore(true);
                            RecalcResult = recalcresult_PrevPage;
                        } else {
                            if (Element.PageNum === PageIndex) {
                                if (true === this.RecalcInfo.Is_PageBreakBefore()) {
                                    Element.Set_DocumentIndex(Index);
                                    Element.Reset(X, Page.Height, XLimit, Page.Height, PageIndex);
                                    Element.Recalculate_Page(PageIndex);
                                    this.RecalcInfo.FlowObjectPage++;
                                    RecalcResult = recalcresult_NextPage;
                                } else {
                                    if ((0 === Index && 0 === PageIndex) || Index != StartIndex) {
                                        Element.Set_DocumentIndex(Index);
                                        Element.Reset(X, Y, XLimit, YLimit, PageIndex);
                                    }
                                    RecalcResult = Element.Recalculate_Page(PageIndex);
                                    if (((0 === Index && 0 === PageIndex) || Index != StartIndex) && true != Element.Is_ContentOnFirstPage()) {
                                        this.DrawingObjects.removeFloatTableById(PageIndex, Element.Get_Id());
                                        this.RecalcInfo.Set_PageBreakBefore(true);
                                        RecalcResult = recalcresult_CurPage;
                                    } else {
                                        this.RecalcInfo.FlowObjectPage++;
                                        if (recalcresult_NextElement === RecalcResult) {
                                            this.RecalcInfo.Reset();
                                        }
                                    }
                                }
                            } else {
                                RecalcResult = Element.Recalculate_Page(PageIndex);
                                this.DrawingObjects.addFloatTable(new CFlowTable(Element, PageIndex));
                                if (recalcresult_NextElement === RecalcResult) {
                                    this.RecalcInfo.Reset();
                                }
                            }
                        }
                    } else {
                        RecalcResult = recalcresult_NextElement;
                    }
                }
            } else {
                if (type_Paragraph === Element.GetType() && true != Element.Is_Inline()) {
                    bFlow = true;
                    if (true === this.RecalcInfo.Can_RecalcObject()) {
                        var FramePr = Element.Get_FramePr();
                        var FlowCount = 1;
                        for (var TempIndex = Index + 1; TempIndex < Count; TempIndex++) {
                            var TempElement = this.Content[TempIndex];
                            if (type_Paragraph === TempElement.GetType() && true != TempElement.Is_Inline()) {
                                var TempFramePr = TempElement.Get_FramePr();
                                if (true === FramePr.Compare(TempFramePr)) {
                                    FlowCount++;
                                } else {
                                    break;
                                }
                            } else {
                                break;
                            }
                        }
                        var Page_W = Page.Width;
                        var Page_H = Page.Height;
                        var Page_Field_L = Page.Margins.Left;
                        var Page_Field_R = Page.Margins.Right;
                        var Page_Field_T = Page.Margins.Top;
                        var Page_Field_B = Page.Margins.Bottom;
                        var FrameH = 0;
                        var FrameW = -1;
                        var Frame_XLimit = FramePr.Get_W();
                        var Frame_YLimit = FramePr.Get_H();
                        if (undefined === Frame_XLimit) {
                            Frame_XLimit = Page_Field_R - Page_Field_L;
                        }
                        if (undefined === Frame_YLimit) {
                            Frame_YLimit = Page_H;
                        }
                        for (var TempIndex = Index; TempIndex < Index + FlowCount; TempIndex++) {
                            var TempElement = this.Content[TempIndex];
                            TempElement.Set_DocumentIndex(TempIndex);
                            if (Index != TempIndex || (true != this.RecalcInfo.FrameRecalc && ((0 === Index && 0 === PageIndex) || Index != StartIndex || (Index === StartIndex && true === bStartNewSection)))) {
                                TempElement.Reset(0, FrameH, Frame_XLimit, Frame_YLimit, PageIndex);
                            }
                            RecalcResult = TempElement.Recalculate_Page(PageIndex);
                            if (recalcresult_NextElement !== RecalcResult) {
                                break;
                            }
                            FrameH = TempElement.Get_PageBounds(PageIndex - TempElement.Get_StartPage_Absolute()).Bottom;
                        }
                        if (-1 === FrameW && 1 === FlowCount && 1 === Element.Lines.length && undefined === FramePr.Get_W()) {
                            FrameW = Element.Lines[0].Ranges[0].W;
                            var ParaPr = Element.Get_CompiledPr2(false).ParaPr;
                            FrameW += ParaPr.Ind.Left + ParaPr.Ind.FirstLine;
                            if (align_Left != ParaPr.Jc) {
                                TempElement.Reset(0, 0, FrameW, Frame_YLimit, PageIndex);
                                TempElement.Recalculate_Page(PageIndex);
                                FrameH = TempElement.Get_PageBounds(PageIndex - TempElement.Get_StartPage_Absolute()).Bottom;
                            }
                        } else {
                            if (-1 === FrameW) {
                                FrameW = Frame_XLimit;
                            }
                        }
                        var FrameHRule = (undefined === FramePr.HRule ? heightrule_Auto : FramePr.HRule);
                        switch (FrameHRule) {
                        case heightrule_Auto:
                            break;
                        case heightrule_AtLeast:
                            if (FrameH < FramePr.H) {
                                FrameH = FramePr.H;
                            }
                            break;
                        case heightrule_Exact:
                            FrameH = FramePr.H;
                            break;
                        }
                        var FrameHAnchor = (FramePr.HAnchor === undefined ? c_oAscHAnchor.Margin : FramePr.HAnchor);
                        var FrameVAnchor = (FramePr.VAnchor === undefined ? c_oAscVAnchor.Text : FramePr.VAnchor);
                        var FrameX = 0;
                        if (undefined != FramePr.XAlign || undefined === FramePr.X) {
                            var XAlign = c_oAscXAlign.Left;
                            if (undefined != FramePr.XAlign) {
                                XAlign = FramePr.XAlign;
                            }
                            switch (FrameHAnchor) {
                            case c_oAscHAnchor.Page:
                                switch (XAlign) {
                                case c_oAscXAlign.Inside:
                                    case c_oAscXAlign.Outside:
                                    case c_oAscXAlign.Left:
                                    FrameX = Page_Field_L - FrameW;
                                    break;
                                case c_oAscXAlign.Right:
                                    FrameX = Page_Field_R;
                                    break;
                                case c_oAscXAlign.Center:
                                    FrameX = (Page_W - FrameW) / 2;
                                    break;
                                }
                                break;
                            case c_oAscHAnchor.Text:
                                case c_oAscHAnchor.Margin:
                                switch (XAlign) {
                                case c_oAscXAlign.Inside:
                                    case c_oAscXAlign.Outside:
                                    case c_oAscXAlign.Left:
                                    FrameX = Page_Field_L;
                                    break;
                                case c_oAscXAlign.Right:
                                    FrameX = Page_Field_R - FrameW;
                                    break;
                                case c_oAscXAlign.Center:
                                    FrameX = (Page_Field_R + Page_Field_L - FrameW) / 2;
                                    break;
                                }
                                break;
                            }
                        } else {
                            switch (FrameHAnchor) {
                            case c_oAscHAnchor.Page:
                                FrameX = FramePr.X;
                                break;
                            case c_oAscHAnchor.Text:
                                case c_oAscHAnchor.Margin:
                                FrameX = Page_Field_L + FramePr.X;
                                break;
                            }
                        }
                        if (FrameW + FrameX > Page_W) {
                            FrameX = Page_W - FrameW;
                        }
                        if (FrameX < 0) {
                            FrameX = 0;
                        }
                        var FrameY = 0;
                        if (undefined != FramePr.YAlign) {
                            var YAlign = FramePr.YAlign;
                            switch (FrameVAnchor) {
                            case c_oAscVAnchor.Page:
                                switch (YAlign) {
                                case c_oAscYAlign.Inside:
                                    case c_oAscYAlign.Outside:
                                    case c_oAscYAlign.Top:
                                    FrameY = 0;
                                    break;
                                case c_oAscYAlign.Bottom:
                                    FrameY = Page_H - FrameH;
                                    break;
                                case c_oAscYAlign.Center:
                                    FrameY = (Page_H - FrameH) / 2;
                                    break;
                                }
                                break;
                            case c_oAscVAnchor.Text:
                                FrameY = Y;
                                break;
                            case c_oAscVAnchor.Margin:
                                switch (YAlign) {
                                case c_oAscYAlign.Inside:
                                    case c_oAscYAlign.Outside:
                                    case c_oAscYAlign.Top:
                                    FrameY = Page_Field_T;
                                    break;
                                case c_oAscYAlign.Bottom:
                                    FrameY = Page_Field_B - FrameH;
                                    break;
                                case c_oAscYAlign.Center:
                                    FrameY = (Page_Field_B + Page_Field_T - FrameH) / 2;
                                    break;
                                }
                                break;
                            }
                        } else {
                            var FramePrY = 0;
                            if (undefined != FramePr.Y) {
                                FramePrY = FramePr.Y;
                            }
                            switch (FrameVAnchor) {
                            case c_oAscVAnchor.Page:
                                FrameY = FramePrY;
                                break;
                            case c_oAscVAnchor.Text:
                                FrameY = FramePrY + Y;
                                break;
                            case c_oAscVAnchor.Margin:
                                FrameY = FramePrY + Page_Field_T;
                                break;
                            }
                        }
                        if (FrameH + FrameY > Page_H) {
                            FrameY = Page_H - FrameH;
                        }
                        FrameY += 0.001;
                        FrameH -= 0.002;
                        if (FrameY < 0) {
                            FrameY = 0;
                        }
                        var FrameBounds = this.Content[Index].Get_FrameBounds(FrameX, FrameY, FrameW, FrameH);
                        var FrameX2 = FrameBounds.X,
                        FrameY2 = FrameBounds.Y,
                        FrameW2 = FrameBounds.W,
                        FrameH2 = FrameBounds.H;
                        if (recalcresult_NextElement !== RecalcResult) {
                            if (recalcresult_PrevPage === RecalcResult) {
                                this.RecalcInfo.Set_FrameRecalc(false);
                            }
                        } else {
                            if ((FrameY2 + FrameH2 > YLimit || Y > YLimit - 0.001) && Index != StartIndex) {
                                this.RecalcInfo.Set_FrameRecalc(true);
                                this.Content[Index].Start_FromNewPage();
                                RecalcResult = recalcresult_NextPage;
                            } else {
                                this.RecalcInfo.Set_FrameRecalc(false);
                                for (var TempIndex = Index; TempIndex < Index + FlowCount; TempIndex++) {
                                    var TempElement = this.Content[TempIndex];
                                    TempElement.Shift(TempElement.Pages.length - 1, FrameX, FrameY);
                                    TempElement.Set_CalculatedFrame(FrameX, FrameY, FrameW, FrameH, FrameX2, FrameY2, FrameW2, FrameH2, PageIndex);
                                }
                                var FrameDx = (undefined === FramePr.HSpace ? 0 : FramePr.HSpace);
                                var FrameDy = (undefined === FramePr.VSpace ? 0 : FramePr.VSpace);
                                this.DrawingObjects.addFloatTable(new CFlowParagraph(Element, FrameX2, FrameY2, FrameW2, FrameH2, FrameDx, FrameDy, Index, FlowCount, FramePr.Wrap));
                                Index += FlowCount - 1;
                                if (FrameY >= Y) {
                                    RecalcResult = recalcresult_NextElement;
                                } else {
                                    this.RecalcInfo.Set_FlowObject(Element, PageIndex, recalcresult_NextElement, FlowCount);
                                    RecalcResult = recalcresult_CurPage;
                                }
                            }
                        }
                    } else {
                        if (true === this.RecalcInfo.Check_FlowObject(Element) && true === this.RecalcInfo.Is_PageBreakBefore()) {
                            this.RecalcInfo.Reset();
                            this.RecalcInfo.Set_FrameRecalc(true);
                            this.Content[Index].Start_FromNewPage();
                            RecalcResult = recalcresult_NextPage;
                        } else {
                            if (true === this.RecalcInfo.Check_FlowObject(Element)) {
                                if (this.RecalcInfo.FlowObjectPage !== PageIndex) {
                                    this.RecalcInfo.Set_PageBreakBefore(true);
                                    this.DrawingObjects.removeFloatTableById(this.RecalcInfo.FlowObjectPage, Element.Get_Id());
                                    RecalcResult = recalcresult_PrevPage;
                                } else {
                                    Index += this.RecalcInfo.FlowObjectElementsCount - 1;
                                    this.RecalcInfo.Reset();
                                    RecalcResult = recalcresult_NextElement;
                                }
                            } else {
                                RecalcResult = recalcresult_NextElement;
                            }
                        }
                    }
                } else {
                    if ((0 === Index && 0 === PageIndex) || Index != StartIndex || (Index === StartIndex && true === bStartNewSection)) {
                        Element.Set_DocumentIndex(Index);
                        Element.Reset(X, Y, XLimit, YLimit, PageIndex);
                    }
                    var SectInfoElement = this.SectionsInfo.Get_SectPr(Index);
                    var PrevElement = this.Content[Index - 1];
                    if (Index > 0 && (Index !== StartIndex || true !== bStartNewSection) && Index === SectInfoElement.Index && true === Element.IsEmpty() && (type_Paragraph !== PrevElement.GetType() || undefined === PrevElement.Get_SectionPr())) {
                        RecalcResult = recalcresult_NextElement;
                        var LastVisibleBounds = PrevElement.Get_LastRangeVisibleBounds();
                        var ___X = LastVisibleBounds.X + LastVisibleBounds.W;
                        var ___Y = LastVisibleBounds.Y;
                        var CompiledPr = Element.Get_CompiledPr2(false).ParaPr;
                        CompiledPr.Jc = align_Left;
                        CompiledPr.Ind.FirstLine = 0;
                        CompiledPr.Ind.Left = 0;
                        CompiledPr.Ind.Right = 0;
                        Element.Reset(___X, ___Y, Math.max(___X + 10, LastVisibleBounds.XLimit), 10000, PageIndex);
                        Element.Recalculate_Page(PageIndex);
                        Element.Recalc_CompiledPr();
                        Element.Pages[0].Y = ___Y;
                        Element.Lines[0].Top = 0;
                        Element.Lines[0].Y = LastVisibleBounds.BaseLine;
                        Element.Lines[0].Bottom = LastVisibleBounds.H;
                        Element.Pages[0].Bounds.Top = ___Y;
                        Element.Pages[0].Bounds.Bottom = ___Y + LastVisibleBounds.H;
                        this.Pages[PageIndex].EndSectionParas.push(Element);
                        bFlow = true;
                    } else {
                        RecalcResult = Element.Recalculate_Page(PageIndex);
                    }
                }
            }
            Element.TurnOn_RecalcEvent();
            if (recalcresult_CurPage === RecalcResult) {
                bReDraw = false;
                bContinue = true;
                _PageIndex = PageIndex;
                _StartIndex = StartIndex;
                _bStart = false;
                break;
            } else {
                if (recalcresult_NextElement === RecalcResult) {
                    if (Index < Count - 1) {
                        var CurSectInfo = this.SectionsInfo.Get_SectPr(Index);
                        var NextSectInfo = this.SectionsInfo.Get_SectPr(Index + 1);
                        if (CurSectInfo !== NextSectInfo) {
                            if (section_type_Continuous === NextSectInfo.SectPr.Get_Type() && true === CurSectInfo.SectPr.Compare_PageSize(NextSectInfo.SectPr)) {
                                var NewStartPos = this.Get_PageContentStartPos(PageIndex, Index + 1);
                                Y = Y + 0.001;
                                X = NewStartPos.X;
                                XLimit = NewStartPos.XLimit;
                            } else {
                                this.Pages[PageIndex].EndPos = Index;
                                bContinue = true;
                                _PageIndex = PageIndex + 1;
                                _StartIndex = Index + 1;
                                _bStart = true;
                                _bStartNewSection = true;
                                break;
                            }
                        }
                    }
                } else {
                    if (recalcresult_NextPage === RecalcResult) {
                        this.Pages[PageIndex].EndPos = Index;
                        bContinue = true;
                        _PageIndex = PageIndex + 1;
                        _StartIndex = Index;
                        _bStart = true;
                        break;
                    } else {
                        if (recalcresult_PrevPage === RecalcResult) {
                            bReDraw = false;
                            bContinue = true;
                            _PageIndex = Math.max(PageIndex - 1, 0);
                            _StartIndex = this.Pages[_PageIndex].Pos;
                            _bStart = false;
                            break;
                        }
                    }
                }
            }
            if (true != bFlow) {
                var Bounds = Element.Get_PageBounds(PageIndex - Element.Get_StartPage_Absolute());
                Y = Bounds.Bottom;
            }
            if (docpostype_Content == this.CurPos.Type && Index >= this.ContentLastChangePos && Index === this.CurPos.ContentPos) {
                if (type_Paragraph === Element.GetType()) {
                    this.CurPage = Element.PageNum + Element.CurPos.PagesPos;
                } else {
                    this.CurPage = Element.PageNum;
                }
            }
            if (docpostype_Content === this.CurPos.Type && ((true !== this.Selection.Use && Index > this.CurPos.ContentPos) || (true === this.Selection.Use && Index > this.Selection.EndPos && Index > this.Selection.StartPos))) {
                this.private_UpdateCursorXY(true, true);
            }
        }
        if (Index >= Count) {
            this.Pages[PageIndex].EndPos = Count - 1;
        }
        if (true === bReDraw) {
            this.DrawingDocument.OnRecalculatePage(PageIndex, this.Pages[PageIndex]);
        }
        if (Index >= Count) {
            this.Internal_CheckCurPage();
            this.DrawingDocument.OnEndRecalculate(true);
            this.DrawingObjects.onEndRecalculateDocument(this.Pages.length);
            if (true === this.Selection.UpdateOnRecalc) {
                this.Selection.UpdateOnRecalc = false;
                this.DrawingDocument.OnSelectEnd();
            }
            this.FullRecalc.Id = null;
            this.FullRecalc.MainStartPos = -1;
        }
        if (true === bContinue) {
            this.FullRecalc.PageIndex = _PageIndex;
            this.FullRecalc.Start = _bStart;
            this.FullRecalc.StartIndex = _StartIndex;
            this.FullRecalc.NewSection = _bStartNewSection;
            this.FullRecalc.MainStartPos = _StartIndex;
            if (window["NATIVE_EDITOR_ENJINE_SYNC_RECALC"] === true) {
                if (_PageIndex > this.FullRecalc.StartPage + 2) {
                    if (window["native"]["WC_CheckSuspendRecalculate"] !== undefined) {
                        this.FullRecalc.Id = setTimeout(Document_Recalculate_Page, 10);
                        return;
                    }
                }
                this.Recalculate_Page();
                return;
            }
            if (_PageIndex > this.FullRecalc.StartPage + 2) {
                this.FullRecalc.Id = setTimeout(Document_Recalculate_Page, 20);
            } else {
                this.Recalculate_Page();
            }
        }
    },
    Reset_RecalculateCache: function () {
        this.SectionsInfo.Reset_HdrFtrRecalculateCache();
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            this.Content[Index].Reset_RecalculateCache();
        }
    },
    Stop_Recalculate: function () {
        if (null != this.FullRecalc.Id) {
            clearTimeout(this.FullRecalc.Id);
            this.FullRecalc.Id = null;
        }
        this.DrawingDocument.OnStartRecalculate(0);
    },
    OnContentRecalculate: function (bNeedRecalc, PageNum, DocumentIndex) {
        if (false === bNeedRecalc) {
            var Element = this.Content[DocumentIndex];
            for (var PageNum = Element.PageNum; PageNum < Element.PageNum + Element.Pages.length; PageNum++) {
                this.DrawingDocument.OnRecalculatePage(PageNum, this.Pages[PageNum]);
            }
            this.DrawingDocument.OnEndRecalculate(false, true);
            this.Document_UpdateRulersState();
        } else {
            this.ContentLastChangePos = DocumentIndex;
            this.Recalculate(false, false);
        }
    },
    Recalculate_AllTables: function () {
        var Count = this.Content.length;
        for (var Pos = 0; Pos < Count; Pos++) {
            var Item = this.Content[Pos];
            if (type_Table === Item.GetType()) {
                Item.Recalculate_AllTables();
            }
        }
    },
    OnContentReDraw: function (StartPage, EndPage) {
        this.ReDraw(StartPage, EndPage);
    },
    CheckTargetUpdate: function () {
        var bFlag = true;
        if (this.DrawingDocument.UpdateTargetFromPaint === true) {
            if (true === this.DrawingDocument.UpdateTargetCheck) {
                this.NeedUpdateTarget = this.DrawingDocument.UpdateTargetCheck;
            }
            this.DrawingDocument.UpdateTargetCheck = false;
        }
        if (docpostype_Content === this.CurPos.Type) {
            if (null != this.FullRecalc.Id && this.FullRecalc.StartIndex <= this.CurPos.ContentPos) {
                bFlag = false;
            }
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {} else {
                if (docpostype_HdrFtr === this.CurPos.Type) {}
            }
        }
        if (true === this.NeedUpdateTarget && true === bFlag && false === this.Selection_Is_TableBorderMove()) {
            this.RecalculateCurPos();
            this.NeedUpdateTarget = false;
        }
    },
    RecalculateCurPos: function () {
        if (true === this.TurnOffRecalcCurPos) {
            return;
        }
        if (true === CollaborativeEditing.m_bGlobalLockSelection) {
            return;
        }
        if (docpostype_Content === this.CurPos.Type) {
            var Pos = (true === this.Selection.Use && selectionflag_Numbering !== this.Selection.Flag ? this.Selection.EndPos : this.CurPos.ContentPos);
            if (Pos >= 0 && undefined !== this.Content[Pos].RecalculateCurPos && (null === this.FullRecalc.Id || this.FullRecalc.StartIndex > Pos)) {
                this.Internal_CheckCurPage();
                this.Content[Pos].RecalculateCurPos();
            }
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                this.DrawingObjects.recalculateCurPos();
            } else {
                if (docpostype_HdrFtr === this.CurPos.Type) {
                    this.HdrFtr.RecalculateCurPos();
                }
            }
        }
        this.Document_UpdateRulersState();
    },
    Internal_CheckCurPage: function () {
        if (true === this.TurnOffRecalcCurPos) {
            return;
        }
        if (true === CollaborativeEditing.m_bGlobalLockSelection) {
            return;
        }
        if (docpostype_HdrFtr === this.CurPos.Type) {
            var CurHdrFtr = this.HdrFtr.CurHdrFtr;
            if (null !== CurHdrFtr && -1 !== CurHdrFtr.RecalcInfo.CurPage) {
                this.CurPage = CurHdrFtr.RecalcInfo.CurPage;
            }
        }
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            var ParaDrawing = this.DrawingObjects.getMajorParaDrawing();
            if (null != ParaDrawing) {
                this.CurPage = ParaDrawing.PageNum;
            }
        } else {
            var Pos = (true === this.Selection.Use && selectionflag_Numbering !== this.Selection.Flag ? this.Selection.EndPos : this.CurPos.ContentPos);
            if (Pos >= 0 && (null === this.FullRecalc.Id || this.FullRecalc.StartIndex > Pos)) {
                this.CurPage = this.Content[Pos].Get_CurrentPage_Absolute();
            }
        }
    },
    Set_TargetPos: function (X, Y, PageNum) {
        this.TargetPos.X = X;
        this.TargetPos.Y = Y;
        this.TargetPos.PageNum = PageNum;
    },
    ReDraw: function (StartPage, EndPage) {
        if ("undefined" === typeof(StartPage)) {
            StartPage = 0;
        }
        if ("undefined" === typeof(EndPage)) {
            EndPage = this.DrawingDocument.m_lCountCalculatePages;
        }
        for (var CurPage = StartPage; CurPage <= EndPage; CurPage++) {
            this.DrawingDocument.OnRepaintPage(CurPage);
        }
    },
    DrawPage: function (nPageIndex, pGraphics) {
        this.Draw(nPageIndex, pGraphics);
    },
    Draw: function (nPageIndex, pGraphics) {
        this.Comments.Reset_Drawing(nPageIndex);
        var Page_StartPos = this.Pages[nPageIndex].Pos;
        var SectPr = this.SectionsInfo.Get_SectPr(Page_StartPos).SectPr;
        if (docpostype_HdrFtr !== this.CurPos.Type) {
            pGraphics.Start_GlobalAlpha();
        }
        if (section_borders_ZOrderBack === SectPr.Get_Borders_ZOrder()) {
            this.Draw_Borders(pGraphics, SectPr);
        }
        this.HdrFtr.Draw(nPageIndex, pGraphics);
        if (docpostype_HdrFtr === this.CurPos.Type) {
            pGraphics.put_GlobalAlpha(true, 0.4);
        } else {
            pGraphics.End_GlobalAlpha();
        }
        this.DrawingObjects.drawBehindDoc(nPageIndex, pGraphics);
        this.DrawingObjects.drawWrappingObjects(nPageIndex, pGraphics);
        var Page_StartPos = this.Pages[nPageIndex].Pos;
        var Page_EndPos = this.Pages[nPageIndex].EndPos;
        for (var Index = Page_StartPos; Index <= Page_EndPos; Index++) {
            this.Content[Index].Draw(nPageIndex, pGraphics);
        }
        this.DrawingObjects.drawBeforeObjects(nPageIndex, pGraphics);
        if (section_borders_ZOrderFront === SectPr.Get_Borders_ZOrder()) {
            this.Draw_Borders(pGraphics, SectPr);
        }
        if (docpostype_HdrFtr === this.CurPos.Type) {
            pGraphics.put_GlobalAlpha(false, 1);
            var SectIndex = this.SectionsInfo.Get_Index(Page_StartPos);
            var SectCount = this.SectionsInfo.Get_Count();
            var SectIndex = (1 === SectCount ? -1 : SectIndex);
            var Header = this.HdrFtr.Pages[nPageIndex].Header;
            var Footer = this.HdrFtr.Pages[nPageIndex].Footer;
            var RepH = (null === Header || null !== SectPr.Get_HdrFtrInfo(Header) ? false : true);
            var RepF = (null === Footer || null !== SectPr.Get_HdrFtrInfo(Footer) ? false : true);
            var HeaderInfo = undefined;
            if (null !== Header && undefined !== Header.RecalcInfo.NeedRecalc[nPageIndex]) {
                var bFirst = Header.RecalcInfo.NeedRecalc[nPageIndex].bFirst;
                var bEven = Header.RecalcInfo.NeedRecalc[nPageIndex].bEven;
                var HeaderSectPr = Header.RecalcInfo.SectPr[nPageIndex];
                if (undefined !== HeaderSectPr) {
                    bFirst = (true === bFirst && true === HeaderSectPr.Get_TitlePage() ? true : false);
                }
                HeaderInfo = {
                    bFirst: bFirst,
                    bEven: bEven
                };
            }
            var FooterInfo = undefined;
            if (null !== Footer && undefined !== Footer.RecalcInfo.NeedRecalc[nPageIndex]) {
                var bFirst = Footer.RecalcInfo.NeedRecalc[nPageIndex].bFirst;
                var bEven = Footer.RecalcInfo.NeedRecalc[nPageIndex].bEven;
                var FooterSectPr = Footer.RecalcInfo.SectPr[nPageIndex];
                if (undefined !== FooterSectPr) {
                    bFirst = (true === bFirst && true === FooterSectPr.Get_TitlePage() ? true : false);
                }
                FooterInfo = {
                    bFirst: bFirst,
                    bEven: bEven
                };
            }
            pGraphics.DrawHeaderEdit(this.Pages[nPageIndex].Y, this.HdrFtr.Lock.Get_Type(), SectIndex, RepH, HeaderInfo);
            pGraphics.DrawFooterEdit(this.Pages[nPageIndex].YLimit, this.HdrFtr.Lock.Get_Type(), SectIndex, RepF, FooterInfo);
        }
    },
    Draw_Borders: function (Graphics, SectPr) {
        var Orient = SectPr.Get_Orientation();
        var Offset = SectPr.Get_Borders_OffsetFrom();
        var LBorder = SectPr.Get_Borders_Left();
        var TBorder = SectPr.Get_Borders_Top();
        var RBorder = SectPr.Get_Borders_Right();
        var BBorder = SectPr.Get_Borders_Bottom();
        var W = SectPr.Get_PageWidth();
        var H = SectPr.Get_PageHeight();
        if (section_borders_OffsetFromPage === Offset) {
            if (border_None !== LBorder.Value) {
                var X = LBorder.Space + LBorder.Size / 2;
                var Y0 = (border_None !== TBorder.Value ? TBorder.Space + TBorder.Size / 2 : 0);
                var Y1 = (border_None !== BBorder.Value ? H - BBorder.Space - BBorder.Size / 2 : H);
                Graphics.p_color(LBorder.Color.r, LBorder.Color.g, LBorder.Color.b, 255);
                Graphics.drawVerLine(c_oAscLineDrawingRule.Center, X, Y0, Y1, LBorder.Size);
            }
            if (border_None !== RBorder.Value) {
                var X = W - RBorder.Space - RBorder.Size / 2;
                var Y0 = (border_None !== TBorder.Value ? TBorder.Space + TBorder.Size / 2 : 0);
                var Y1 = (border_None !== BBorder.Value ? H - BBorder.Space - BBorder.Size / 2 : H);
                Graphics.p_color(RBorder.Color.r, RBorder.Color.g, RBorder.Color.b, 255);
                Graphics.drawVerLine(c_oAscLineDrawingRule.Center, X, Y0, Y1, RBorder.Size);
            }
            if (border_None !== TBorder.Value) {
                var Y = TBorder.Space;
                var X0 = (border_None !== LBorder.Value ? LBorder.Space + LBorder.Size / 2 : 0);
                var X1 = (border_None !== RBorder.Value ? W - RBorder.Space - RBorder.Size / 2 : W);
                Graphics.p_color(TBorder.Color.r, TBorder.Color.g, TBorder.Color.b, 255);
                Graphics.drawHorLineExt(c_oAscLineDrawingRule.Top, Y, X0, X1, TBorder.Size, (border_None !== LBorder.Value ? -LBorder.Size / 2 : 0), (border_None !== RBorder.Value ? RBorder.Size / 2 : 0));
            }
            if (border_None !== BBorder.Value) {
                var Y = H - BBorder.Space;
                var X0 = (border_None !== LBorder.Value ? LBorder.Space + LBorder.Size / 2 : 0);
                var X1 = (border_None !== RBorder.Value ? W - RBorder.Space - RBorder.Size / 2 : W);
                Graphics.p_color(BBorder.Color.r, BBorder.Color.g, BBorder.Color.b, 255);
                Graphics.drawHorLineExt(c_oAscLineDrawingRule.Bottom, Y, X0, X1, BBorder.Size, (border_None !== LBorder.Value ? -LBorder.Size / 2 : 0), (border_None !== RBorder.Value ? RBorder.Size / 2 : 0));
            }
        } else {
            var _X0 = SectPr.Get_PageMargin_Left();
            var _X1 = W - SectPr.Get_PageMargin_Right();
            var _Y0 = SectPr.Get_PageMargin_Top();
            var _Y1 = H - SectPr.Get_PageMargin_Bottom();
            if (border_None !== LBorder.Value) {
                var X = _X0 - LBorder.Space;
                var Y0 = (border_None !== TBorder.Value ? _Y0 - TBorder.Space - TBorder.Size / 2 : _Y0);
                var Y1 = (border_None !== BBorder.Value ? _Y1 + BBorder.Space + BBorder.Size / 2 : _Y1);
                Graphics.p_color(LBorder.Color.r, LBorder.Color.g, LBorder.Color.b, 255);
                Graphics.drawVerLine(c_oAscLineDrawingRule.Right, X, Y0, Y1, LBorder.Size);
            }
            if (border_None !== RBorder.Value) {
                var X = _X1 + RBorder.Space;
                var Y0 = (border_None !== TBorder.Value ? _Y0 - TBorder.Space - TBorder.Size / 2 : _Y0);
                var Y1 = (border_None !== BBorder.Value ? _Y1 + BBorder.Space + BBorder.Size / 2 : _Y1);
                Graphics.p_color(RBorder.Color.r, RBorder.Color.g, RBorder.Color.b, 255);
                Graphics.drawVerLine(c_oAscLineDrawingRule.Left, X, Y0, Y1, RBorder.Size);
            }
            if (border_None !== TBorder.Value) {
                var Y = _Y0 - TBorder.Space;
                var X0 = (border_None !== LBorder.Value ? _X0 - LBorder.Space : _X0);
                var X1 = (border_None !== RBorder.Value ? _X1 + RBorder.Space : _X1);
                Graphics.p_color(TBorder.Color.r, TBorder.Color.g, TBorder.Color.b, 255);
                Graphics.drawHorLineExt(c_oAscLineDrawingRule.Bottom, Y, X0, X1, TBorder.Size, (border_None !== LBorder.Value ? -LBorder.Size : 0), (border_None !== RBorder.Value ? RBorder.Size : 0));
            }
            if (border_None !== BBorder.Value) {
                var Y = _Y1 + BBorder.Space;
                var X0 = (border_None !== LBorder.Value ? _X0 - LBorder.Space : _X0);
                var X1 = (border_None !== RBorder.Value ? _X1 + RBorder.Space : _X1);
                Graphics.p_color(BBorder.Color.r, BBorder.Color.g, BBorder.Color.b, 255);
                Graphics.drawHorLineExt(c_oAscLineDrawingRule.Top, Y, X0, X1, BBorder.Size, (border_None !== LBorder.Value ? -LBorder.Size : 0), (border_None !== RBorder.Value ? RBorder.Size : 0));
            }
        }
    },
    Add_NewParagraph: function (bRecalculate, bForceAdd) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Add_NewParagraph(bRecalculate);
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return this.DrawingObjects.addNewParagraph(bRecalculate);
            } else {
                if (this.CurPos.ContentPos < 0) {
                    return false;
                }
                if (true === this.Selection.Use) {
                    this.Remove(1, true);
                }
                var Item = this.Content[this.CurPos.ContentPos];
                if (type_Paragraph == Item.GetType()) {
                    if (true !== bForceAdd && undefined != Item.Numbering_Get() && true === Item.IsEmpty({
                        SkipNewLine: true
                    }) && true === Item.Cursor_IsStart()) {
                        Item.Numbering_Remove();
                        Item.Set_Ind({
                            FirstLine: undefined,
                            Left: undefined,
                            Right: Item.Pr.Ind.Right
                        },
                        true);
                    } else {
                        var NewParagraph = new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0);
                        if (true === Item.Cursor_IsEnd()) {
                            var StyleId = Item.Style_Get();
                            var NextId = undefined;
                            if (undefined != StyleId) {
                                NextId = this.Styles.Get_Next(StyleId);
                                if (null === NextId) {
                                    NextId = StyleId;
                                }
                            }
                            if (StyleId === NextId) {
                                Item.Continue(NewParagraph);
                            } else {
                                if (NextId === this.Styles.Get_Default_Paragraph()) {
                                    NewParagraph.Style_Remove();
                                } else {
                                    NewParagraph.Style_Add_Open(NextId);
                                }
                            }
                            var SectPr = Item.Get_SectionPr();
                            if (undefined !== SectPr) {
                                Item.Set_SectionPr(undefined);
                                NewParagraph.Set_SectionPr(SectPr);
                            }
                        } else {
                            Item.Split(NewParagraph);
                        }
                        this.Internal_Content_Add(this.CurPos.ContentPos + 1, NewParagraph);
                        this.CurPos.ContentPos++;
                        this.ContentLastChangePos = this.CurPos.ContentPos - 1;
                    }
                    if (false != bRecalculate) {
                        this.Recalculate();
                        this.Document_UpdateInterfaceState();
                        this.Document_UpdateSelectionState();
                    }
                } else {
                    if (type_Table == Item.GetType()) {
                        if (0 === this.CurPos.ContentPos && Item.Cursor_IsStart(true)) {
                            var NewParagraph = new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0);
                            this.Internal_Content_Add(0, NewParagraph);
                            this.ContentLastChangePos = 0;
                            this.CurPos.ContentPos = 0;
                            if (false != bRecalculate) {
                                this.Recalculate();
                                this.Document_UpdateInterfaceState();
                                this.Document_UpdateSelectionState();
                            }
                        } else {
                            Item.Add_NewParagraph(bRecalculate);
                        }
                    }
                }
            }
        }
    },
    Extend_ToPos: function (X, Y) {
        var LastPara = this.Content[this.Content.length - 1];
        var LastPara2 = LastPara;
        this.Create_NewHistoryPoint(historydescription_Document_DocumentExtendToPos);
        this.History.Set_Additional_ExtendDocumentToPos();
        while (true) {
            var NewParagraph = new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0);
            var NewRun = new ParaRun(NewParagraph, false);
            var StyleId = LastPara.Style_Get();
            var NextId = undefined;
            if (undefined != StyleId) {
                NextId = this.Styles.Get_Next(StyleId);
                if (null === NextId || undefined === NextId) {
                    NextId = StyleId;
                }
            }
            if (NextId === this.Styles.Get_Default_Paragraph() || NextId === this.Styles.Get_Default_ParaList()) {
                NewParagraph.Style_Remove();
            } else {
                NewParagraph.Style_Add_Open(NextId);
            }
            if (undefined != LastPara.TextPr.Value.FontSize || undefined !== LastPara.TextPr.Value.RFonts.Ascii) {
                var TextPr = new CTextPr();
                TextPr.FontSize = LastPara.TextPr.Value.FontSize;
                TextPr.FontSizeCS = LastPara.TextPr.Value.FontSize;
                TextPr.RFonts = LastPara.TextPr.Value.RFonts.Copy();
                NewParagraph.Select_All();
                NewParagraph.Apply_TextPr(TextPr);
            }
            LastPara.Set_DocumentNext(NewParagraph);
            NewParagraph.Set_DocumentPrev(LastPara);
            NewParagraph.Set_DocumentIndex(LastPara.Index + 1);
            var CurPage = LastPara.Pages.length - 1;
            var X0 = LastPara.Pages[CurPage].X;
            var Y0 = LastPara.Pages[CurPage].Bounds.Bottom;
            var XLimit = LastPara.Pages[CurPage].XLimit;
            var YLimit = LastPara.Pages[CurPage].YLimit;
            var PageNum = LastPara.PageNum;
            NewParagraph.Reset(X0, Y0, XLimit, YLimit, PageNum);
            var RecalcResult = NewParagraph.Recalculate_Page(PageNum);
            if (recalcresult_NextElement != RecalcResult) {
                LastPara.Next = null;
                break;
            }
            this.Internal_Content_Add(this.Content.length, NewParagraph);
            if (NewParagraph.Pages[0].Bounds.Bottom > Y) {
                break;
            }
            LastPara = NewParagraph;
        }
        LastPara = this.Content[this.Content.length - 1];
        if (LastPara != LastPara2 || false === this.Document_Is_SelectionLocked(changestype_None, {
            Type: changestype_2_Element_and_Type,
            Element: LastPara,
            CheckType: changestype_Paragraph_Content
        })) {
            LastPara.Extend_ToPos(X);
        }
        LastPara.Cursor_MoveToEndPos();
        LastPara.Document_SetThisElementCurrent(true);
        this.Recalculate();
    },
    GroupGraphicObjects: function () {
        if (this.CanGroup()) {
            this.DrawingObjects.groupSelectedObjects();
        }
    },
    UnGroupGraphicObjects: function () {
        if (this.CanUnGroup()) {
            this.DrawingObjects.unGroupSelectedObjects();
        }
    },
    StartChangeWrapPolygon: function () {
        this.DrawingObjects.startChangeWrapPolygon();
    },
    CanChangeWrapPolygon: function () {
        return this.DrawingObjects.canChangeWrapPolygon();
    },
    CanGroup: function () {
        return this.DrawingObjects.canGroup();
    },
    CanUnGroup: function () {
        return this.DrawingObjects.canUnGroup();
    },
    Add_InlineImage: function (W, H, Img, Chart, bFlow) {
        if (undefined === bFlow) {
            bFlow = false;
        }
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Add_InlineImage(W, H, Img, Chart, bFlow);
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return this.DrawingObjects.addInlineImage(W, H, Img, Chart, bFlow);
            } else {
                if (true == this.Selection.Use) {
                    this.Remove(1, true);
                }
                var Item = this.Content[this.CurPos.ContentPos];
                if (type_Paragraph == Item.GetType()) {
                    var Drawing;
                    if (!isRealObject(Chart)) {
                        Drawing = new ParaDrawing(W, H, null, this.DrawingDocument, this, null);
                        var Image = this.DrawingObjects.createImage(Img, 0, 0, W, H);
                        Image.setParent(Drawing);
                        Drawing.Set_GraphicObject(Image);
                    } else {
                        Drawing = new ParaDrawing(W, H, null, this.DrawingDocument, this, null);
                        var Image = this.DrawingObjects.getChartSpace2(Chart, null);
                        Image.setParent(Drawing);
                        Drawing.Set_GraphicObject(Image);
                        Drawing.Update_Size(Image.spPr.xfrm.extX, Image.spPr.xfrm.extY);
                    }
                    if (true === bFlow) {
                        Drawing.Set_DrawingType(drawing_Anchor);
                        Drawing.Set_WrappingType(WRAPPING_TYPE_SQUARE);
                        Drawing.Set_BehindDoc(false);
                        Drawing.Set_Distance(3.2, 0, 3.2, 0);
                        Drawing.Set_PositionH(c_oAscRelativeFromH.Column, false, 0);
                        Drawing.Set_PositionV(c_oAscRelativeFromV.Paragraph, false, 0);
                    }
                    this.Paragraph_Add(Drawing);
                    this.Select_DrawingObject(Drawing.Get_Id());
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.Add_InlineImage(W, H, Img, Chart, bFlow);
                    }
                }
            }
        }
    },
    Edit_Chart: function (Chart) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Edit_Chart(Chart);
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return this.DrawingObjects.editChart(Chart);
            }
        }
    },
    Get_ChartObject: function (type) {
        return this.DrawingObjects.getChartObject(type);
    },
    Add_InlineTable: function (Cols, Rows) {
        if (Cols <= 0 || Rows <= 0) {
            return;
        }
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Add_InlineTable(Cols, Rows);
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                this.DrawingObjects.addInlineTable(Cols, Rows);
            } else {
                if (this.CurPos.ContentPos < 0) {
                    return false;
                }
                if (true === this.Selection.Use) {
                    this.Remove(1, true);
                }
                var Item = this.Content[this.CurPos.ContentPos];
                switch (Item.GetType()) {
                case type_Paragraph:
                    var PageFields = this.Get_PageFields(this.CurPage);
                    var W = (PageFields.XLimit - PageFields.X + 2 * 1.9);
                    var Grid = [];
                    W = Math.max(W, Cols * 2 * 1.9);
                    for (var Index = 0; Index < Cols; Index++) {
                        Grid[Index] = W / Cols;
                    }
                    var NewTable = new CTable(this.DrawingDocument, this, true, 0, 0, 0, 0, 0, Rows, Cols, Grid);
                    NewTable.Set_ParagraphPrOnAdd(Item);
                    if (true === Item.Cursor_IsEnd() && undefined === Item.Get_SectionPr()) {
                        NewTable.Cursor_MoveToStartPos();
                        this.Internal_Content_Add(this.CurPos.ContentPos + 1, NewTable);
                        this.CurPos.ContentPos++;
                        this.ContentLastChangePos = this.CurPos.ContentPos - 1;
                        this.Recalculate();
                        this.Interface_Update_ParaPr();
                        this.Interface_Update_TextPr();
                        this.Interface_Update_TablePr();
                    } else {
                        var NewParagraph = new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0);
                        Item.Split(NewParagraph);
                        this.Internal_Content_Add(this.CurPos.ContentPos + 1, NewParagraph);
                        NewTable.Cursor_MoveToStartPos();
                        this.Internal_Content_Add(this.CurPos.ContentPos + 1, NewTable);
                        this.CurPos.ContentPos++;
                        this.ContentLastChangePos = this.CurPos.ContentPos - 1;
                        this.Recalculate();
                        this.Interface_Update_ParaPr();
                        this.Interface_Update_TextPr();
                        this.Interface_Update_TablePr();
                    }
                    break;
                case type_Table:
                    Item.Add_InlineTable(Cols, Rows);
                    break;
                }
            }
        }
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
    },
    Add_DropCap: function (bInText) {
        var Pos = -1;
        if (false === this.Selection.Use && type_Paragraph === this.Content[this.CurPos.ContentPos].GetType()) {
            Pos = this.CurPos.ContentPos;
        } else {
            if (true === this.Selection.Use && this.Selection.StartPos <= this.Selection.EndPos && type_Paragraph === this.Content[this.Selection.StartPos].GetType()) {
                Pos = this.Selection.StartPos;
            } else {
                if (true === this.Selection.Use && this.Selection.StartPos > this.Selection.EndPos && type_Paragraph === this.Content[this.Selection.EndPos].GetType()) {
                    Pos = this.Selection.EndPos;
                }
            }
        }
        if (-1 === Pos) {
            return;
        }
        var OldParagraph = this.Content[Pos];
        if (OldParagraph.Lines.length <= 0) {
            return;
        }
        if (false === this.Document_Is_SelectionLocked(changestype_None, {
            Type: changestype_2_Element_and_Type,
            Element: OldParagraph,
            CheckType: changestype_Paragraph_Content
        })) {
            this.Create_NewHistoryPoint(historydescription_Document_AddDropCap);
            var NewParagraph = new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0);
            var TextPr = OldParagraph.Split_DropCap(NewParagraph);
            var Before = OldParagraph.Get_CompiledPr().ParaPr.Spacing.Before;
            var LineH = OldParagraph.Lines[0].Bottom - OldParagraph.Lines[0].Top - Before;
            var LineTA = OldParagraph.Lines[0].Metrics.TextAscent2;
            var LineTD = OldParagraph.Lines[0].Metrics.TextDescent + OldParagraph.Lines[0].Metrics.LineGap;
            var FramePr = new CFramePr();
            FramePr.Init_Default_DropCap(bInText);
            NewParagraph.Set_FrameParaPr(OldParagraph);
            NewParagraph.Set_FramePr2(FramePr);
            NewParagraph.Update_DropCapByLines(TextPr, NewParagraph.Pr.FramePr.Lines, LineH, LineTA, LineTD, Before);
            this.Internal_Content_Add(Pos, NewParagraph);
            NewParagraph.Cursor_MoveToEndPos();
            this.Selection_Remove();
            this.CurPos.ContentPos = Pos;
            this.CurPos.Type = docpostype_Content;
            this.Recalculate();
            this.Document_UpdateInterfaceState();
            this.Document_UpdateRulersState();
        }
    },
    Remove_DropCap: function (bDropCap) {
        var Pos = -1;
        if (false === this.Selection.Use && type_Paragraph === this.Content[this.CurPos.ContentPos].GetType()) {
            Pos = this.CurPos.ContentPos;
        } else {
            if (true === this.Selection.Use && this.Selection.StartPos <= this.Selection.EndPos && type_Paragraph === this.Content[this.Selection.StartPos].GetType()) {
                Pos = this.Selection.StartPos;
            } else {
                if (true === this.Selection.Use && this.Selection.StartPos > this.Selection.EndPos && type_Paragraph === this.Content[this.Selection.EndPos].GetType()) {
                    Pos = this.Selection.EndPos;
                }
            }
        }
        if (-1 === Pos) {
            return;
        }
        var Para = this.Content[Pos];
        var FramePr = Para.Get_FramePr();
        if (undefined === FramePr && true === bDropCap) {
            var Prev = Para.Get_DocumentPrev();
            if (null != Prev && type_Paragraph === Prev.GetType()) {
                var PrevFramePr = Prev.Get_FramePr();
                if (undefined != PrevFramePr && undefined != PrevFramePr.DropCap) {
                    Para = Prev;
                    FramePr = PrevFramePr;
                } else {
                    return;
                }
            } else {
                return;
            }
        }
        if (undefined === FramePr) {
            return;
        }
        var FrameParas = Para.Internal_Get_FrameParagraphs();
        if (false === bDropCap) {
            if (false === this.Document_Is_SelectionLocked(changestype_None, {
                Type: changestype_2_ElementsArray_and_Type,
                Elements: FrameParas,
                CheckType: changestype_Paragraph_Content
            })) {
                this.Create_NewHistoryPoint(historydescription_Document_RemoveDropCap);
                var Count = FrameParas.length;
                for (var Index = 0; Index < Count; Index++) {
                    FrameParas[Index].Set_FramePr(undefined, true);
                }
                this.Recalculate();
                this.Document_UpdateInterfaceState();
                this.Document_UpdateRulersState();
            }
        } else {
            var Next = Para.Get_DocumentNext();
            var Last = Para;
            while (null != Next) {
                if (type_Paragraph != Next.GetType() || undefined === Next.Get_FramePr() || true != FramePr.Compare(Next.Get_FramePr())) {
                    break;
                }
                Last = Next;
                Next = Next.Get_DocumentNext();
            }
            if (null != Next && type_Paragraph === Next.GetType()) {
                FrameParas.push(Next);
                if (false === this.Document_Is_SelectionLocked(changestype_None, {
                    Type: changestype_2_ElementsArray_and_Type,
                    Elements: FrameParas,
                    CheckType: changestype_Paragraph_Content
                })) {
                    this.Create_NewHistoryPoint(historydescription_Document_RemoveDropCap);
                    FrameParas.splice(FrameParas.length - 1, 1);
                    Next.Cursor_MoveToStartPos();
                    var Spacing = Next.Get_CompiledPr2(false).ParaPr.Spacing.Copy();
                    var TextPr = Next.Get_FirstRunPr();
                    var Count = FrameParas.length;
                    for (var Index = 0; Index < Count; Index++) {
                        var FramePara = FrameParas[Index];
                        FramePara.Set_FramePr(undefined, true);
                        FramePara.Set_Spacing(Spacing, true);
                        FramePara.Select_All();
                        FramePara.Clear_TextFormatting();
                        FramePara.Apply_TextPr(TextPr, undefined);
                    }
                    Next.CopyPr(Last);
                    Last.Concat(Next);
                    this.Internal_Content_Remove(Next.Index, 1);
                    Last.Cursor_MoveToStartPos();
                    Last.Document_SetThisElementCurrent(true);
                    this.Recalculate();
                    this.Document_UpdateInterfaceState();
                    this.Document_UpdateRulersState();
                }
            } else {
                if (false === this.Document_Is_SelectionLocked(changestype_None, {
                    Type: changestype_2_ElementsArray_and_Type,
                    Elements: FrameParas,
                    CheckType: changestype_Paragraph_Content
                })) {
                    this.Create_NewHistoryPoint(historydescription_Document_RemoveDropCap);
                    var Count = FrameParas.length;
                    for (var Index = 0; Index < Count; Index++) {
                        FrameParas[Index].Set_FramePr(undefined, true);
                    }
                    this.Recalculate();
                    this.Document_UpdateInterfaceState();
                    this.Document_UpdateRulersState();
                }
            }
        }
    },
    Check_FramePrLastParagraph: function () {
        var Count = this.Content.length;
        if (Count <= 0) {
            return;
        }
        var Element = this.Content[Count - 1];
        if (type_Paragraph === Element.GetType() && undefined !== Element.Get_FramePr()) {
            Element.Set_FramePr(undefined, true);
        }
    },
    CheckRange: function (X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf, PageNum) {
        var HdrFtrRanges = this.HdrFtr.CheckRange(X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf, PageNum);
        return this.DrawingObjects.CheckRange(X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf, PageNum, HdrFtrRanges, null);
    },
    Paragraph_Add: function (ParaItem, bRecalculate) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            if (para_NewLine === ParaItem.Type && break_Page === ParaItem.BreakType) {
                return;
            }
            var bRetValue = this.HdrFtr.Paragraph_Add(ParaItem, bRecalculate);
            this.Document_UpdateSelectionState();
            this.Document_UpdateUndoRedoState();
            return bRetValue;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                if (para_NewLine === ParaItem.Type && break_Page === ParaItem.BreakType) {
                    return;
                }
                var bRetValue = this.DrawingObjects.paragraphAdd(ParaItem, bRecalculate);
                this.Document_UpdateSelectionState();
                this.Document_UpdateUndoRedoState();
                this.Document_UpdateInterfaceState();
                return bRetValue;
            } else {
                if (true === this.Selection.Use) {
                    var Type = ParaItem.Get_Type();
                    switch (Type) {
                    case para_Math:
                        case para_NewLine:
                        case para_Text:
                        case para_Space:
                        case para_Tab:
                        case para_PageNum:
                        this.Remove(1, true, false, true);
                        break;
                    case para_TextPr:
                        switch (this.Selection.Flag) {
                        case selectionflag_Common:
                            var StartPos = this.Selection.StartPos;
                            var EndPos = this.Selection.EndPos;
                            if (EndPos < StartPos) {
                                var Temp = StartPos;
                                StartPos = EndPos;
                                EndPos = Temp;
                            }
                            for (var Index = StartPos; Index <= EndPos; Index++) {
                                this.Content[Index].Add(ParaItem.Copy());
                            }
                            if (false != bRecalculate) {
                                if (true === ParaItem.Value.Check_NeedRecalc()) {
                                    this.ContentLastChangePos = StartPos;
                                    this.Recalculate();
                                } else {
                                    var StartPage = this.Content[StartPos].Get_StartPage_Absolute();
                                    var EndPage = this.Content[EndPos].Get_StartPage_Absolute() + this.Content[EndPos].Pages.length - 1;
                                    this.ReDraw(StartPage, EndPage);
                                }
                            }
                            break;
                        case selectionflag_Numbering:
                            if (null == this.Selection.Data || this.Selection.Data.length <= 0) {
                                break;
                            }
                            if (undefined != ParaItem.Value.FontFamily) {
                                var FName = ParaItem.Value.FontFamily.Name;
                                var FIndex = ParaItem.Value.FontFamily.Index;
                                ParaItem.Value.RFonts = new CRFonts();
                                ParaItem.Value.RFonts.Ascii = {
                                    Name: FName,
                                    Index: FIndex
                                };
                                ParaItem.Value.RFonts.EastAsia = {
                                    Name: FName,
                                    Index: FIndex
                                };
                                ParaItem.Value.RFonts.HAnsi = {
                                    Name: FName,
                                    Index: FIndex
                                };
                                ParaItem.Value.RFonts.CS = {
                                    Name: FName,
                                    Index: FIndex
                                };
                            }
                            var NumPr = this.Content[this.Selection.Data[0]].Numbering_Get();
                            var AbstrNum = this.Numbering.Get_AbstractNum(NumPr.NumId);
                            AbstrNum.Apply_TextPr(NumPr.Lvl, ParaItem.Value);
                            if (false != bRecalculate) {
                                this.ContentLastChangePos = this.Selection.Data[0];
                                this.Recalculate();
                            }
                            break;
                        }
                        this.Document_UpdateSelectionState();
                        this.Document_UpdateUndoRedoState();
                        return;
                    }
                }
                var Item = this.Content[this.CurPos.ContentPos];
                var ItemType = Item.GetType();
                if (para_NewLine === ParaItem.Type && break_Page === ParaItem.BreakType) {
                    if (type_Paragraph === ItemType) {
                        if (true === Item.Cursor_IsStart()) {
                            this.Add_NewParagraph(undefined, true);
                            this.Content[this.CurPos.ContentPos - 1].Cursor_MoveToStartPos();
                            this.Content[this.CurPos.ContentPos - 1].Add(ParaItem);
                            this.Content[this.CurPos.ContentPos - 1].Clear_Formatting();
                            this.ContentLastChangePos = this.CurPos.ContentPos - 1;
                        } else {
                            this.Add_NewParagraph(undefined, true);
                            this.Add_NewParagraph(undefined, true);
                            this.Content[this.CurPos.ContentPos - 1].Cursor_MoveToStartPos();
                            this.Content[this.CurPos.ContentPos - 1].Add(ParaItem);
                            this.Content[this.CurPos.ContentPos - 1].Clear_Formatting();
                            this.ContentLastChangePos = this.CurPos.ContentPos - 2;
                        }
                        if (false != bRecalculate) {
                            this.Recalculate();
                            Item.CurPos.RealX = Item.CurPos.X;
                            Item.CurPos.RealY = Item.CurPos.Y;
                        }
                    } else {
                        return;
                    }
                } else {
                    Item.Add(ParaItem);
                    if (false != bRecalculate && type_Paragraph == Item.GetType()) {
                        if (para_TextPr === ParaItem.Type && false === ParaItem.Value.Check_NeedRecalc()) {
                            var StartPage = Item.Get_StartPage_Absolute();
                            var EndPage = StartPage + Item.Pages.length - 1;
                            this.ReDraw(StartPage, EndPage);
                        } else {
                            this.Recalculate(true);
                        }
                        if (false === this.TurnOffRecalcCurPos) {
                            Item.RecalculateCurPos();
                            Item.CurPos.RealX = Item.CurPos.X;
                            Item.CurPos.RealY = Item.CurPos.Y;
                        }
                    }
                    this.Document_UpdateSelectionState();
                    this.Document_UpdateInterfaceState();
                }
                if (true != this.TurnOffRecalc) {
                    this.Document_UpdateUndoRedoState();
                }
            }
        }
    },
    Paragraph_ClearFormatting: function () {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Paragraph_ClearFormatting();
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return this.DrawingObjects.paragraphClearFormatting();
            } else {
                if (true === this.Selection.Use) {
                    if (selectionflag_Common === this.Selection.Flag) {
                        var StartPos = this.Selection.StartPos;
                        var EndPos = this.Selection.EndPos;
                        if (StartPos > EndPos) {
                            var Temp = StartPos;
                            StartPos = EndPos;
                            EndPos = Temp;
                        }
                        for (var Index = StartPos; Index <= EndPos; Index++) {
                            var Item = this.Content[Index];
                            if (type_Table === Item.GetType()) {
                                Item.Paragraph_ClearFormatting();
                            } else {
                                if (type_Paragraph === Item.GetType()) {
                                    Item.Clear_Formatting();
                                    Item.Clear_TextFormatting();
                                }
                            }
                        }
                        this.ContentLastChangePos = StartPos;
                        this.Recalculate();
                        this.Document_UpdateSelectionState();
                        this.Document_UpdateInterfaceState();
                    }
                } else {
                    var Item = this.Content[this.CurPos.ContentPos];
                    if (type_Table === Item.GetType()) {
                        Item.Paragraph_ClearFormatting();
                    } else {
                        if (type_Paragraph === Item.GetType()) {
                            Item.Clear_Formatting();
                            Item.Clear_TextFormatting();
                            this.ContentLastChangePos = this.CurPos.ContentPos;
                            this.Recalculate();
                        }
                    }
                    this.Document_UpdateSelectionState();
                    this.Document_UpdateInterfaceState();
                }
            }
        }
    },
    Remove: function (Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd) {
        if (undefined === bRemoveOnlySelection) {
            bRemoveOnlySelection = false;
        }
        if (undefined === bOnTextAdd) {
            bOnTextAdd = false;
        }
        if (docpostype_HdrFtr === this.CurPos.Type) {
            var Res = this.HdrFtr.Remove(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd);
            if (null !== this.HdrFtr.CurHdtr && docpostype_DrawingObjects !== this.HdrFtr.CurHdrFtr.Content.CurPos.Type) {
                this.Selection_Remove();
                this.Selection.Use = false;
            }
            this.Document_UpdateInterfaceState();
            this.Document_UpdateRulersState();
            return Res;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var Res = this.DrawingObjects.remove(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd);
                this.Document_UpdateInterfaceState();
                this.Document_UpdateRulersState();
                return Res;
            } else {
                if (this.CurPos.ContentPos < 0) {
                    return false;
                }
                if (true === this.Selection.Use && selectionflag_Numbering == this.Selection.Flag && Count > 0) {
                    Count = -Count;
                }
                this.Remove_NumberingSelection();
                if (true === this.Selection.Use) {
                    var StartPos = this.Selection.StartPos;
                    var EndPos = this.Selection.EndPos;
                    if (EndPos < StartPos) {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos = Temp;
                    }
                    if (StartPos !== EndPos && true === this.Content[EndPos].Selection_IsEmpty(true)) {
                        EndPos--;
                    }
                    this.Selection_Clear();
                    this.Selection.Use = false;
                    this.Selection.StartPos = 0;
                    this.Selection.EndPos = 0;
                    this.DrawingDocument.TargetStart();
                    if (StartPos != EndPos) {
                        var StartType = this.Content[StartPos].GetType();
                        var EndType = this.Content[EndPos].GetType();
                        var bStartEmpty, bEndEmpty;
                        if (true === bOnTextAdd && type_Table == EndType) {
                            this.CurPos.ContentPos = StartPos;
                            return this.Cursor_MoveLeft(false, false);
                        }
                        if (type_Paragraph == StartType) {
                            this.Content[StartPos].Remove(1, true);
                            bStartEmpty = this.Content[StartPos].IsEmpty();
                        } else {
                            if (type_Table == StartType) {
                                bStartEmpty = !(this.Content[StartPos].Row_Remove2());
                            }
                        }
                        if (type_Paragraph == EndType) {
                            this.Content[EndPos].Remove(1, true);
                            bEndEmpty = this.Content[EndPos].IsEmpty();
                        } else {
                            if (type_Table == EndType) {
                                bEndEmpty = !(this.Content[EndPos].Row_Remove2());
                            }
                        }
                        if (true != bStartEmpty && true != bEndEmpty) {
                            this.Internal_Content_Remove(StartPos + 1, EndPos - StartPos - 1);
                            this.CurPos.ContentPos = StartPos;
                            if (type_Paragraph == StartType && type_Paragraph == EndType && true === bOnTextAdd) {
                                this.Content[StartPos].Cursor_MoveToEndPos(false, false);
                                this.Remove(1, true);
                            } else {
                                this.CurPos.ContentPos = StartPos + 1;
                                this.Content[StartPos + 1].Cursor_MoveToStartPos();
                            }
                        } else {
                            if (true != bStartEmpty) {
                                if (true === bOnTextAdd && type_Table == StartType) {
                                    this.Internal_Content_Remove(StartPos + 1, EndPos - StartPos - 1);
                                    this.CurPos.ContentPos = StartPos + 1;
                                    this.Content[StartPos + 1].Cursor_MoveToStartPos();
                                } else {
                                    this.Internal_Content_Remove(StartPos + 1, EndPos - StartPos);
                                    if (type_Paragraph == StartType) {
                                        this.CurPos.ContentPos = StartPos;
                                        this.Content[StartPos].Cursor_MoveToEndPos(false, false);
                                    } else {
                                        if (type_Table == StartType) {
                                            this.CurPos.ContentPos = StartPos + 1;
                                            this.Content[StartPos + 1].Cursor_MoveToStartPos();
                                        }
                                    }
                                }
                            } else {
                                if (true != bEndEmpty) {
                                    this.Internal_Content_Remove(StartPos, EndPos - StartPos);
                                    this.CurPos.ContentPos = StartPos;
                                    this.Content[StartPos].Cursor_MoveToStartPos();
                                } else {
                                    if (true === bOnTextAdd) {
                                        this.Internal_Content_Remove(StartPos, EndPos - StartPos);
                                        this.CurPos.ContentPos = StartPos;
                                        this.Content[StartPos].Cursor_MoveToStartPos();
                                    } else {
                                        if (0 === StartPos && (EndPos - StartPos + 1) >= this.Content.length) {
                                            var NewPara = new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0);
                                            this.Internal_Content_Add(0, NewPara);
                                            this.Internal_Content_Remove(1, this.Content.length - 1);
                                        } else {
                                            this.Internal_Content_Remove(StartPos, EndPos - StartPos + 1);
                                        }
                                        if (StartPos >= this.Content.length) {
                                            this.CurPos.ContentPos = this.Content.length - 1;
                                            this.Content[this.CurPos.ContentPos].Cursor_MoveToEndPos(false, false);
                                        } else {
                                            this.CurPos.ContentPos = StartPos;
                                            this.Content[StartPos].Cursor_MoveToStartPos();
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        this.CurPos.ContentPos = StartPos;
                        if (Count < 0 && type_Table === this.Content[StartPos].GetType() && table_Selection_Cell === this.Content[StartPos].Selection.Type && true != bOnTextAdd) {
                            return this.Table_RemoveRow();
                        } else {
                            if (false === this.Content[StartPos].Remove(Count, true, bRemoveOnlySelection, bOnTextAdd)) {
                                if (true != bOnTextAdd) {
                                    if (true === this.Content[StartPos].IsEmpty() && this.Content.length > 1) {
                                        this.Internal_Content_Remove(StartPos, 1);
                                        if (StartPos >= this.Content.length) {
                                            this.CurPos.ContentPos = this.Content.length - 1;
                                            this.Content[this.CurPos.ContentPos].Cursor_MoveToEndPos(false, false);
                                        } else {
                                            this.CurPos.ContentPos = StartPos;
                                            this.Content[StartPos].Cursor_MoveToStartPos();
                                        }
                                        this.ContentLastChangePos = this.CurPos.ContentPos;
                                        this.Recalculate();
                                        this.Document_UpdateInterfaceState();
                                        this.Document_UpdateRulersState();
                                        return;
                                    } else {
                                        if (this.CurPos.ContentPos < this.Content.length - 1 && type_Paragraph == this.Content[this.CurPos.ContentPos + 1].GetType()) {
                                            this.Content[StartPos].Concat(this.Content[StartPos + 1]);
                                            this.Internal_Content_Remove(StartPos + 1, 1);
                                            this.Interface_Update_ParaPr();
                                        } else {
                                            if (this.Content.length === 1 && true === this.Content[0].IsEmpty() && Count > 0) {
                                                var NewPara = new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0);
                                                this.Internal_Content_Add(0, NewPara);
                                                this.Internal_Content_Remove(1, this.Content.length - 1);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this.ContentLastChangePos = this.CurPos.ContentPos;
                    this.Recalculate();
                } else {
                    if (true === bRemoveOnlySelection || true === bOnTextAdd) {
                        return;
                    }
                    if (type_Paragraph == this.Content[this.CurPos.ContentPos].GetType()) {
                        var bNumbering = (undefined != this.Content[this.CurPos.ContentPos].Numbering_Get() ? true : false);
                        if (false === this.Content[this.CurPos.ContentPos].Remove(Count, bOnlyText)) {
                            if (Count < 0) {
                                if (this.CurPos.ContentPos > 0 && type_Paragraph == this.Content[this.CurPos.ContentPos - 1].GetType()) {
                                    var CurrFramePr = this.Content[this.CurPos.ContentPos].Get_FramePr();
                                    var PrevFramePr = this.Content[this.CurPos.ContentPos - 1].Get_FramePr();
                                    if ((undefined === CurrFramePr && undefined === PrevFramePr) || (undefined !== CurrFramePr && undefined !== PrevFramePr && true === CurrFramePr.Compare(PrevFramePr))) {
                                        if (true === this.Content[this.CurPos.ContentPos - 1].IsEmpty()) {
                                            this.Internal_Content_Remove(this.CurPos.ContentPos - 1, 1);
                                            this.CurPos.ContentPos--;
                                            this.Content[this.CurPos.ContentPos].Cursor_MoveToStartPos();
                                        } else {
                                            var Prev = this.Content[this.CurPos.ContentPos - 1];
                                            Prev.Cursor_MoveToEndPos();
                                            Prev.Concat(this.Content[this.CurPos.ContentPos]);
                                            this.Internal_Content_Remove(this.CurPos.ContentPos, 1);
                                            this.CurPos.ContentPos--;
                                        }
                                    }
                                }
                            } else {
                                if (Count > 0) {
                                    if (this.CurPos.ContentPos < this.Content.length - 1 && type_Paragraph == this.Content[this.CurPos.ContentPos + 1].GetType()) {
                                        var CurrFramePr = this.Content[this.CurPos.ContentPos].Get_FramePr();
                                        var NextFramePr = this.Content[this.CurPos.ContentPos + 1].Get_FramePr();
                                        if ((undefined === CurrFramePr && undefined === NextFramePr) || (undefined !== CurrFramePr && undefined !== NextFramePr && true === CurrFramePr.Compare(NextFramePr))) {
                                            if (true === this.Content[this.CurPos.ContentPos].IsEmpty()) {
                                                this.Internal_Content_Remove(this.CurPos.ContentPos, 1);
                                                this.Content[this.CurPos.ContentPos].Cursor_MoveToStartPos();
                                            } else {
                                                var Cur = this.Content[this.CurPos.ContentPos];
                                                Cur.Concat(this.Content[this.CurPos.ContentPos + 1]);
                                                this.Internal_Content_Remove(this.CurPos.ContentPos + 1, 1);
                                            }
                                        }
                                    } else {
                                        if (true == this.Content[this.CurPos.ContentPos].IsEmpty() && this.CurPos.ContentPos == this.Content.length - 1 && this.CurPos.ContentPos != 0 && type_Table != this.Content[this.CurPos.ContentPos - 1].GetType()) {
                                            this.Internal_Content_Remove(this.CurPos.ContentPos, 1);
                                            this.CurPos.ContentPos--;
                                        }
                                    }
                                }
                            }
                            this.ContentLastChangePos = this.CurPos.ContentPos;
                            this.Recalculate();
                        } else {
                            if (true === bNumbering && undefined == this.Content[this.CurPos.ContentPos].Numbering_Get()) {
                                this.ContentLastChangePos = this.CurPos.ContentPos - 1;
                                this.Recalculate();
                            } else {
                                this.ContentLastChangePos = this.CurPos.ContentPos;
                                this.Recalculate(true);
                            }
                        }
                        var Item = this.Content[this.CurPos.ContentPos];
                        if (type_Paragraph == Item.GetType()) {
                            Item.CurPos.RealX = Item.CurPos.X;
                            Item.CurPos.RealY = Item.CurPos.Y;
                        }
                    } else {
                        if (type_Table == this.Content[this.CurPos.ContentPos].GetType()) {
                            this.Content[this.CurPos.ContentPos].Remove(Count, bOnlyText);
                        }
                    }
                }
                this.Document_UpdateInterfaceState();
                this.Document_UpdateRulersState();
            }
        }
    },
    Cursor_GetPos: function () {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Cursor_GetPos();
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return this.DrawingObjects.cursorGetPos();
            } else {
                if (docpostype_Content === this.CurPos.Type) {
                    if (true === this.Selection.Use) {
                        if (selectionflag_Common === this.Selection.Flag) {
                            return this.Content[this.Selection.EndPos].Cursor_GetPos();
                        }
                        return {
                            X: 0,
                            Y: 0
                        };
                    } else {
                        return this.Content[this.CurPos.ContentPos].Cursor_GetPos();
                    }
                }
            }
        }
    },
    Cursor_MoveToStartPos: function (AddToSelect) {
        if (true === AddToSelect) {
            if (docpostype_HdrFtr === this.CurPos.Type) {
                this.HdrFtr.Cursor_MoveToStartPos(true);
            } else {
                if (docpostype_DrawingObjects === this.CurPos.Type) {} else {
                    if (docpostype_Content === this.CurPos.Type) {
                        var StartPos = (true === this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos);
                        var EndPos = 0;
                        this.Selection.Start = false;
                        this.Selection.Use = true;
                        this.Selection.StartPos = StartPos;
                        this.Selection.EndPos = EndPos;
                        this.Selection.Flag = selectionflag_Common;
                        this.CurPos.ContentPos = 0;
                        this.CurPos.Type = docpostype_Content;
                        for (var Index = StartPos - 1; Index >= EndPos; Index--) {
                            var Item = this.Content[Index];
                            Item.Selection.Use = true;
                            var ItemType = Item.GetType();
                            if (type_Paragraph === ItemType) {
                                Item.Select_All(-1);
                            } else {
                                var Row = Item.Content.length - 1;
                                var Cell = Item.Content[Row].Get_CellsCount() - 1;
                                var Pos0 = {
                                    Row: 0,
                                    Cell: 0
                                };
                                var Pos1 = {
                                    Row: Row,
                                    Cell: Cell
                                };
                                Item.Selection.EndPos.Pos = Pos0;
                                Item.Selection.StartPos.Pos = Pos1;
                                Item.Internal_Selection_UpdateCells();
                            }
                        }
                        this.Content[StartPos].Cursor_MoveToStartPos(true);
                    }
                }
            }
        } else {
            if (docpostype_HdrFtr === this.CurPos.Type) {
                this.HdrFtr.Cursor_MoveToStartPos(false);
            } else {
                this.Selection_Remove();
                this.Selection.Start = false;
                this.Selection.Use = false;
                this.Selection.StartPos = 0;
                this.Selection.EndPos = 0;
                this.Selection.Flag = selectionflag_Common;
                this.CurPos.ContentPos = 0;
                this.CurPos.Type = docpostype_Content;
                this.Content[0].Cursor_MoveToStartPos(false);
            }
        }
        this.private_UpdateCursorXY(true, true);
    },
    Cursor_MoveToEndPos: function (AddToSelect) {
        if (true === AddToSelect) {
            if (docpostype_HdrFtr === this.CurPos.Type) {
                this.HdrFtr.Cursor_MoveToEndPos(true);
            } else {
                if (docpostype_DrawingObjects === this.CurPos.Type) {} else {
                    if (docpostype_Content === this.CurPos.Type) {
                        var StartPos = (true === this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos);
                        var EndPos = this.Content.length - 1;
                        this.Selection.Start = false;
                        this.Selection.Use = true;
                        this.Selection.StartPos = StartPos;
                        this.Selection.EndPos = EndPos;
                        this.Selection.Flag = selectionflag_Common;
                        this.CurPos.ContentPos = this.Content.length - 1;
                        this.CurPos.Type = docpostype_Content;
                        for (var Index = StartPos + 1; Index <= EndPos; Index++) {
                            var Item = this.Content[Index];
                            Item.Selection.Use = true;
                            var ItemType = Item.GetType();
                            if (type_Paragraph === ItemType) {
                                Item.Select_All(1);
                            } else {
                                var Row = Item.Content.length - 1;
                                var Cell = Item.Content[Row].Get_CellsCount() - 1;
                                var Pos0 = {
                                    Row: 0,
                                    Cell: 0
                                };
                                var Pos1 = {
                                    Row: Row,
                                    Cell: Cell
                                };
                                Item.Selection.StartPos.Pos = Pos0;
                                Item.Selection.EndPos.Pos = Pos1;
                                Item.Internal_Selection_UpdateCells();
                            }
                        }
                        this.Content[StartPos].Cursor_MoveToEndPos(true, false);
                    }
                }
            }
        } else {
            if (docpostype_HdrFtr === this.CurPos.Type) {
                this.HdrFtr.Cursor_MoveToEndPos(false);
            } else {
                this.Selection_Remove();
                this.Selection.Start = false;
                this.Selection.Use = false;
                this.Selection.StartPos = 0;
                this.Selection.EndPos = 0;
                this.Selection.Flag = selectionflag_Common;
                this.CurPos.ContentPos = this.Content.length - 1;
                this.CurPos.Type = docpostype_Content;
                this.Content[this.CurPos.ContentPos].Cursor_MoveToEndPos(false);
            }
        }
        this.private_UpdateCursorXY(true, true);
    },
    Cursor_MoveLeft: function (AddToSelect, Word) {
        if ("undefined" === typeof(Word) || null === Word) {
            Word = false;
        }
        if (docpostype_HdrFtr === this.CurPos.Type) {
            var RetValue = this.HdrFtr.Cursor_MoveLeft(AddToSelect, Word);
            this.Document_UpdateInterfaceState();
            this.Document_UpdateSelectionState();
            this.private_UpdateCursorXY(true, true);
            return RetValue;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var RetValue = this.DrawingObjects.cursorMoveLeft(AddToSelect, Word);
                this.Document_UpdateInterfaceState();
                this.Document_UpdateSelectionState();
                this.private_UpdateCursorXY(true, true);
                return RetValue;
            } else {
                if (this.CurPos.ContentPos < 0) {
                    return false;
                }
                this.Remove_NumberingSelection();
                if (true === this.Selection.Use) {
                    if (true === AddToSelect) {
                        if (false === this.Content[this.Selection.EndPos].Cursor_MoveLeft(1, true, Word)) {
                            if (0 != this.Selection.EndPos) {
                                this.Selection.EndPos--;
                                this.CurPos.ContentPos = this.Selection.EndPos;
                                var Item = this.Content[this.Selection.EndPos];
                                if (type_Paragraph == Item.GetType()) {
                                    Item.Cursor_MoveToEndPos(false, true);
                                    Item.Cursor_MoveLeft(1, true, Word);
                                } else {
                                    if (type_Table == Item.GetType()) {
                                        if (false === Item.Is_SelectionUse()) {
                                            var LastRow = Item.Content[Item.Content.length - 1];
                                            Item.Selection.Use = true;
                                            Item.Selection.Type = table_Selection_Cell;
                                            Item.Selection.StartPos.Pos = {
                                                Row: LastRow.Index,
                                                Cell: LastRow.Get_CellsCount() - 1
                                            };
                                            Item.Selection.EndPos.Pos = {
                                                Row: LastRow.Index,
                                                Cell: 0
                                            };
                                            Item.CurCell = LastRow.Get_Cell(0);
                                            Item.Selection.Data = [];
                                            for (var CellIndex = 0; CellIndex < LastRow.Get_CellsCount(); CellIndex++) {
                                                Item.Selection.Data.push({
                                                    Cell: CellIndex,
                                                    Row: LastRow.Index
                                                });
                                            }
                                        } else {
                                            Item.Cursor_MoveLeft(1, true, Word);
                                        }
                                    }
                                }
                            }
                        }
                        if (this.Selection.EndPos != this.Selection.StartPos && false === this.Content[this.Selection.EndPos].Is_SelectionUse()) {
                            this.Selection.EndPos--;
                            this.CurPos.ContentPos = this.Selection.EndPos;
                        }
                        if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse()) {
                            this.Selection.Use = false;
                            this.CurPos.ContentPos = this.Selection.EndPos;
                        }
                    } else {
                        var Start = this.Selection.StartPos;
                        if (Start > this.Selection.EndPos) {
                            Start = this.Selection.EndPos;
                        }
                        this.CurPos.ContentPos = Start;
                        this.Content[this.CurPos.ContentPos].Cursor_MoveLeft(1, false, Word);
                        this.Selection_Remove();
                    }
                } else {
                    if (true === AddToSelect) {
                        this.Selection.Use = true;
                        this.Selection.StartPos = this.CurPos.ContentPos;
                        this.Selection.EndPos = this.CurPos.ContentPos;
                        if (false === this.Content[this.CurPos.ContentPos].Cursor_MoveLeft(1, true, Word)) {
                            if (0 != this.CurPos.ContentPos) {
                                this.CurPos.ContentPos--;
                                var Item = this.Content[this.CurPos.ContentPos];
                                this.Selection.EndPos = this.CurPos.ContentPos;
                                if (type_Paragraph == Item.GetType()) {
                                    Item.Cursor_MoveToEndPos(false, true);
                                    Item.Cursor_MoveLeft(1, true, Word);
                                } else {
                                    if (type_Table == Item.GetType()) {
                                        if (false === Item.Is_SelectionUse()) {
                                            var LastRow = Item.Content[Item.Content.length - 1];
                                            Item.Selection.Use = true;
                                            Item.Selection.Type = table_Selection_Cell;
                                            Item.Selection.StartPos.Pos = {
                                                Row: LastRow.Index,
                                                Cell: LastRow.Get_CellsCount() - 1
                                            };
                                            Item.Selection.EndPos.Pos = {
                                                Row: LastRow.Index,
                                                Cell: 0
                                            };
                                            Item.CurCell = LastRow.Get_Cell(0);
                                            Item.Selection.Data = [];
                                            for (var CellIndex = 0; CellIndex < LastRow.Get_CellsCount(); CellIndex++) {
                                                Item.Selection.Data.push({
                                                    Cell: CellIndex,
                                                    Row: LastRow.Index
                                                });
                                            }
                                        } else {
                                            Item.Cursor_MoveLeft(1, true, Word);
                                        }
                                    }
                                }
                            }
                        }
                        if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse()) {
                            this.Selection.Use = false;
                            this.CurPos.ContentPos = this.Selection.EndPos;
                        }
                    } else {
                        if (false === this.Content[this.CurPos.ContentPos].Cursor_MoveLeft(1, false, Word)) {
                            if (0 != this.CurPos.ContentPos) {
                                this.CurPos.ContentPos--;
                                this.Content[this.CurPos.ContentPos].Cursor_MoveToEndPos();
                            }
                        }
                    }
                }
                this.Document_UpdateInterfaceState();
                this.Document_UpdateRulersState();
                this.private_UpdateCursorXY(true, true);
            }
        }
    },
    Cursor_MoveRight: function (AddToSelect, Word, FromPaste) {
        if ("undefined" === typeof(Word) || null === Word) {
            Word = false;
        }
        if (docpostype_HdrFtr === this.CurPos.Type) {
            var RetValue = this.HdrFtr.Cursor_MoveRight(AddToSelect, Word);
            this.Document_UpdateInterfaceState();
            this.Document_UpdateSelectionState();
            this.private_UpdateCursorXY(true, true);
            return RetValue;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var RetValue = this.DrawingObjects.cursorMoveRight(AddToSelect, Word);
                this.Document_UpdateInterfaceState();
                this.Document_UpdateSelectionState();
                this.private_UpdateCursorXY(true, true);
                return RetValue;
            } else {
                if (this.CurPos.ContentPos < 0) {
                    return false;
                }
                this.Remove_NumberingSelection();
                if (true === this.Selection.Use) {
                    if (true === AddToSelect) {
                        if (false === this.Content[this.Selection.EndPos].Cursor_MoveRight(1, true, Word)) {
                            if (this.Content.length - 1 != this.Selection.EndPos) {
                                this.Selection.EndPos++;
                                this.CurPos.ContentPos = this.Selection.EndPos;
                                var Item = this.Content[this.Selection.EndPos];
                                if (type_Paragraph === Item.GetType()) {
                                    if (false === Item.Is_SelectionUse()) {
                                        var StartPos = Item.Internal_GetStartPos();
                                        Item.CurPos.ContentPos = StartPos;
                                        Item.Selection.Use = true;
                                        Item.Selection.StartPos = StartPos;
                                        Item.Selection.EndPos = StartPos;
                                    }
                                    Item.Cursor_MoveRight(1, true, Word);
                                } else {
                                    if (type_Table === Item.GetType()) {
                                        if (false === Item.Is_SelectionUse()) {
                                            var FirstRow = Item.Content[0];
                                            Item.Selection.Use = true;
                                            Item.Selection.Type = table_Selection_Cell;
                                            Item.Selection.StartPos.Pos = {
                                                Row: 0,
                                                Cell: 0
                                            };
                                            Item.Selection.EndPos.Pos = {
                                                Row: 0,
                                                Cell: FirstRow.Get_CellsCount() - 1
                                            };
                                            Item.CurCell = FirstRow.Get_Cell(FirstRow.Get_CellsCount() - 1);
                                            Item.Selection.Data = [];
                                            for (var CellIndex = 0; CellIndex < FirstRow.Get_CellsCount(); CellIndex++) {
                                                Item.Selection.Data.push({
                                                    Cell: CellIndex,
                                                    Row: 0
                                                });
                                            }
                                        } else {
                                            Item.Cursor_MoveRight(1, true, Word);
                                        }
                                    }
                                }
                            }
                        }
                        if (this.Selection.EndPos != this.Selection.StartPos && false === this.Content[this.Selection.EndPos].Is_SelectionUse()) {
                            this.Selection.EndPos++;
                            this.CurPos.ContentPos = this.Selection.EndPos;
                        }
                        if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse()) {
                            this.Selection.Use = false;
                            this.CurPos.ContentPos = this.Selection.EndPos;
                        }
                    } else {
                        var End = this.Selection.EndPos;
                        if (End < this.Selection.StartPos) {
                            End = this.Selection.StartPos;
                        }
                        this.CurPos.ContentPos = End;
                        if (true === FromPaste && type_Table === this.Content[this.CurPos.ContentPos].Get_Type() && true === this.Content[this.CurPos.ContentPos].Selection_IsToEnd() && this.Content.length - 1 !== this.CurPos.ContentPos) {
                            this.CurPos.ContentPos = End + 1;
                            this.Content[this.CurPos.ContentPos].Cursor_MoveToStartPos(false);
                        } else {
                            if (false === this.Content[this.CurPos.ContentPos].Cursor_MoveRight(1, false, Word, FromPaste)) {
                                if (this.Content.length - 1 === this.CurPos.ContentPos) {
                                    var Item = this.Content[this.CurPos.ContentPos];
                                    Item.Cursor_MoveToEndPos(false);
                                }
                            }
                        }
                        this.Selection_Remove();
                    }
                } else {
                    if (true === AddToSelect) {
                        this.Selection.Use = true;
                        this.Selection.StartPos = this.CurPos.ContentPos;
                        this.Selection.EndPos = this.CurPos.ContentPos;
                        if (false === this.Content[this.CurPos.ContentPos].Cursor_MoveRight(1, true, Word)) {
                            if (this.Content.length - 1 != this.CurPos.ContentPos) {
                                this.CurPos.ContentPos++;
                                var Item = this.Content[this.CurPos.ContentPos];
                                this.Selection.EndPos = this.CurPos.ContentPos;
                                if (type_Paragraph === Item.GetType()) {
                                    if (false === Item.Is_SelectionUse()) {
                                        var StartPos = Item.Internal_GetStartPos();
                                        Item.CurPos.ContentPos = StartPos;
                                        Item.Selection.Use = true;
                                        Item.Selection.StartPos = StartPos;
                                        Item.Selection.EndPos = StartPos;
                                    }
                                    Item.Cursor_MoveRight(1, true, Word);
                                } else {
                                    if (type_Table === Item.GetType()) {
                                        if (false === Item.Is_SelectionUse()) {
                                            var FirstRow = Item.Content[0];
                                            Item.Selection.Use = true;
                                            Item.Selection.Type = table_Selection_Cell;
                                            Item.Selection.StartPos.Pos = {
                                                Row: 0,
                                                Cell: 0
                                            };
                                            Item.Selection.EndPos.Pos = {
                                                Row: 0,
                                                Cell: FirstRow.Get_CellsCount() - 1
                                            };
                                            Item.CurCell = FirstRow.Get_Cell(FirstRow.Get_CellsCount() - 1);
                                            Item.Selection.Data = [];
                                            for (var CellIndex = 0; CellIndex < FirstRow.Get_CellsCount(); CellIndex++) {
                                                Item.Selection.Data.push({
                                                    Cell: CellIndex,
                                                    Row: 0
                                                });
                                            }
                                        } else {
                                            Item.Cursor_MoveRight(1, true, Word);
                                        }
                                    }
                                }
                            }
                        }
                        if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse()) {
                            this.Selection.Use = false;
                            this.CurPos.ContentPos = this.Selection.EndPos;
                        }
                    } else {
                        if (false === this.Content[this.CurPos.ContentPos].Cursor_MoveRight(1, false, Word)) {
                            if (this.Content.length - 1 != this.CurPos.ContentPos) {
                                this.CurPos.ContentPos++;
                                this.Content[this.CurPos.ContentPos].Cursor_MoveToStartPos();
                            }
                        }
                    }
                }
                this.Document_UpdateInterfaceState();
                this.Document_UpdateRulersState();
                this.private_UpdateCursorXY(true, true);
            }
        }
    },
    Cursor_MoveUp: function (AddToSelect) {
        if (docpostype_HdrFtr === this.CurPos.Type && docpostype_DrawingObjects === this.HdrFtr.CurHdrFtr.Content.CurPos.Type) {
            var RetValue = this.HdrFtr.Cursor_MoveUp(AddToSelect);
            this.Document_UpdateInterfaceState();
            this.Document_UpdateSelectionState();
            return RetValue;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var RetValue = this.DrawingObjects.cursorMoveUp(AddToSelect);
                this.Document_UpdateInterfaceState();
                this.Document_UpdateSelectionState();
                return RetValue;
            }
        }
        if (true === this.Is_SelectionUse() && true !== AddToSelect) {
            this.Cursor_MoveLeft(false, false);
        }
        var bStopSelection = false;
        if (true !== this.Is_SelectionUse() && true === AddToSelect) {
            bStopSelection = true;
            this.private_StartSelectionFromCurPos();
        }
        this.private_UpdateCursorXY(false, true);
        var Result = this.private_MoveCursorUp(this.CurPos.RealX, this.CurPos.RealY, AddToSelect);
        if (true === AddToSelect && true !== Result) {
            this.Cursor_MoveToStartPos(true);
        }
        if (bStopSelection) {
            this.private_StopSelection();
        }
    },
    Cursor_MoveDown: function (AddToSelect) {
        if (docpostype_HdrFtr === this.CurPos.Type && docpostype_DrawingObjects === this.HdrFtr.CurHdrFtr.Content.CurPos.Type) {
            var RetValue = this.HdrFtr.Cursor_MoveDown(AddToSelect);
            this.Document_UpdateInterfaceState();
            this.Document_UpdateSelectionState();
            return RetValue;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var RetValue = this.DrawingObjects.cursorMoveDown(AddToSelect);
                this.Document_UpdateInterfaceState();
                this.Document_UpdateSelectionState();
                return RetValue;
            }
        }
        if (true === this.Is_SelectionUse() && true !== AddToSelect) {
            this.Cursor_MoveRight(false, false);
        }
        var bStopSelection = false;
        if (true !== this.Is_SelectionUse() && true === AddToSelect) {
            bStopSelection = true;
            this.private_StartSelectionFromCurPos();
        }
        this.private_UpdateCursorXY(false, true);
        var Result = this.private_MoveCursorDown(this.CurPos.RealX, this.CurPos.RealY, AddToSelect);
        if (true === AddToSelect && true !== Result) {
            this.Cursor_MoveToEndPos(true);
        }
        if (bStopSelection) {
            this.private_StopSelection();
        }
    },
    Cursor_MoveEndOfLine: function (AddToSelect) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            var RetValue = this.HdrFtr.Cursor_MoveEndOfLine(AddToSelect);
            this.Document_UpdateInterfaceState();
            this.private_UpdateCursorXY(true, true);
            return RetValue;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var RetValue = this.DrawingObjects.cursorMoveEndOfLine(AddToSelect);
                this.Document_UpdateInterfaceState();
                this.private_UpdateCursorXY(true, true);
                return RetValue;
            } else {
                if (this.CurPos.ContentPos < 0) {
                    return false;
                }
                this.Remove_NumberingSelection();
                if (true === this.Selection.Use) {
                    if (true === AddToSelect) {
                        var Item = this.Content[this.Selection.EndPos];
                        Item.Cursor_MoveEndOfLine(AddToSelect);
                        if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse()) {
                            this.Selection.Use = false;
                            this.CurPos.ContentPos = this.Selection.EndPos;
                        }
                    } else {
                        var Pos = (this.Selection.EndPos >= this.Selection.StartPos ? this.Selection.EndPos : this.Selection.StartPos);
                        this.CurPos.ContentPos = Pos;
                        var Item = this.Content[Pos];
                        Item.Cursor_MoveEndOfLine(AddToSelect);
                        this.Selection_Remove();
                    }
                } else {
                    if (true === AddToSelect) {
                        this.Selection.Use = true;
                        this.Selection.StartPos = this.CurPos.ContentPos;
                        this.Selection.EndPos = this.CurPos.ContentPos;
                        var Item = this.Content[this.CurPos.ContentPos];
                        Item.Cursor_MoveEndOfLine(AddToSelect);
                        if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse()) {
                            this.Selection.Use = false;
                            this.CurPos.ContentPos = this.Selection.EndPos;
                        }
                    } else {
                        var Item = this.Content[this.CurPos.ContentPos];
                        Item.Cursor_MoveEndOfLine(AddToSelect);
                    }
                }
                this.Document_UpdateInterfaceState();
                this.private_UpdateCursorXY(true, true);
            }
        }
    },
    Cursor_MoveStartOfLine: function (AddToSelect) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            var RetValue = this.HdrFtr.Cursor_MoveStartOfLine(AddToSelect);
            this.Document_UpdateInterfaceState();
            this.private_UpdateCursorXY(true, true);
            return RetValue;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var RetValue = this.DrawingObjects.cursorMoveStartOfLine(AddToSelect);
                this.Document_UpdateInterfaceState();
                this.private_UpdateCursorXY(true, true);
                return RetValue;
            } else {
                if (this.CurPos.ContentPos < 0) {
                    return false;
                }
                this.Remove_NumberingSelection();
                if (true === this.Selection.Use) {
                    if (true === AddToSelect) {
                        var Item = this.Content[this.Selection.EndPos];
                        Item.Cursor_MoveStartOfLine(AddToSelect);
                        if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Selection.Use) {
                            this.Selection.Use = false;
                            this.CurPos.ContentPos = this.Selection.EndPos;
                        }
                    } else {
                        var Pos = (this.Selection.StartPos <= this.Selection.EndPos ? this.Selection.StartPos : this.Selection.EndPos);
                        this.CurPos.ContentPos = Pos;
                        var Item = this.Content[Pos];
                        Item.Cursor_MoveStartOfLine(AddToSelect);
                        this.Selection_Remove();
                    }
                } else {
                    if (true === AddToSelect) {
                        this.Selection.Use = true;
                        this.Selection.StartPos = this.CurPos.ContentPos;
                        this.Selection.EndPos = this.CurPos.ContentPos;
                        var Item = this.Content[this.CurPos.ContentPos];
                        Item.Cursor_MoveStartOfLine(AddToSelect);
                        if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Selection.Use) {
                            this.Selection.Use = false;
                            this.CurPos.ContentPos = this.Selection.EndPos;
                        }
                    } else {
                        var Item = this.Content[this.CurPos.ContentPos];
                        Item.Cursor_MoveStartOfLine(AddToSelect);
                    }
                }
                this.Document_UpdateInterfaceState();
                this.private_UpdateCursorXY(true, true);
            }
        }
    },
    Cursor_MoveAt: function (X, Y, AddToSelect) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Cursor_MoveAt(X, Y, this.CurPage, AddToSelect);
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return this.DrawingObjects.cursorMoveAt(X, Y, AddToSelect);
            } else {
                this.Remove_NumberingSelection();
                if (true === this.Selection.Use) {
                    if (true === AddToSelect) {
                        this.Selection_SetEnd(X, Y, true);
                    } else {
                        this.Selection_Remove();
                        var ContentPos = this.Internal_GetContentPosByXY(X, Y);
                        this.CurPos.ContentPos = ContentPos;
                        this.Content[ContentPos].Cursor_MoveAt(X, Y, false, false, this.CurPage);
                        this.Document_UpdateInterfaceState();
                    }
                } else {
                    if (true === AddToSelect) {
                        this.Selection.Use = true;
                        this.Selection.StartPos = this.CurPos.ContentPos;
                        this.Content[this.CurPos.ContentPos].Selection.Use = true;
                        this.Content[this.CurPos.ContentPos].Selection.StartPos = this.Content[this.CurPos.ContentPos].CurPos.ContentPos;
                        this.Selection_SetEnd(X, Y, true);
                    } else {
                        var ContentPos = this.Internal_GetContentPosByXY(X, Y);
                        this.CurPos.ContentPos = ContentPos;
                        this.Content[ContentPos].Cursor_MoveAt(X, Y, false, false, this.CurPage);
                        this.Document_UpdateInterfaceState();
                    }
                }
            }
        }
    },
    Cursor_MoveToCell: function (bNext) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Cursor_MoveToCell(bNext);
        } else {
            if (docpostype_DrawingObjects == this.CurPos.Type) {
                this.DrawingObjects.cursorMoveToCell(bNext);
            } else {
                if (true === this.Selection.Use) {
                    if (this.Selection.StartPos === this.Selection.EndPos && type_Table === this.Content[this.Selection.StartPos].GetType()) {
                        this.Content[this.Selection.StartPos].Cursor_MoveToCell(bNext);
                    }
                } else {
                    if (type_Table === this.Content[this.CurPos.ContentPos].GetType()) {
                        this.Content[this.CurPos.ContentPos].Cursor_MoveToCell(bNext);
                    }
                }
            }
        }
    },
    Set_ParagraphAlign: function (Align) {
        var SelectedInfo = this.Get_SelectedElementsInfo();
        var Math = SelectedInfo.Get_Math();
        if (null !== Math && true !== Math.Is_Inline()) {
            Math.Set_Align(Align);
        } else {
            if (docpostype_HdrFtr === this.CurPos.Type) {
                this.HdrFtr.Set_ParagraphAlign(Align);
            } else {
                if (docpostype_DrawingObjects === this.CurPos.Type) {
                    if (true != this.DrawingObjects.isSelectedText()) {
                        var ParaDrawing = this.DrawingObjects.getMajorParaDrawing();
                        if (null != ParaDrawing) {
                            var Paragraph = ParaDrawing.Parent;
                            Paragraph.Set_Align(Align);
                        }
                    } else {
                        this.DrawingObjects.setParagraphAlign(Align);
                    }
                } else {
                    if (this.CurPos.ContentPos < 0) {
                        return false;
                    }
                    if (true === this.Selection.Use) {
                        var StartPos = this.Selection.StartPos;
                        var EndPos = this.Selection.EndPos;
                        if (EndPos < StartPos) {
                            var Temp = StartPos;
                            StartPos = EndPos;
                            EndPos = Temp;
                        }
                        for (var Index = StartPos; Index <= EndPos; Index++) {
                            var Item = this.Content[Index];
                            if (type_Paragraph == Item.GetType()) {
                                Item.Set_Align(Align, true);
                            } else {
                                if (type_Table == Item.GetType()) {
                                    Item.TurnOff_RecalcEvent();
                                    Item.Set_ParagraphAlign(Align);
                                    Item.TurnOn_RecalcEvent();
                                }
                            }
                        }
                    } else {
                        var Item = this.Content[this.CurPos.ContentPos];
                        if (type_Paragraph == Item.GetType()) {
                            Item.Set_Align(Align, true);
                        } else {
                            if (type_Table == Item.GetType()) {
                                Item.Set_ParagraphAlign(Align);
                            }
                        }
                    }
                }
            }
        }
        this.Recalculate();
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },
    Set_ParagraphSpacing: function (Spacing) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            var bRetValue = this.HdrFtr.Set_ParagraphSpacing(Spacing);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var bRetValue = this.DrawingObjects.setParagraphSpacing(Spacing);
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                return bRetValue;
            } else {
                if (this.CurPos.ContentPos < 0) {
                    return false;
                }
                if (true === this.Selection.Use) {
                    var StartPos = this.Selection.StartPos;
                    var EndPos = this.Selection.EndPos;
                    if (EndPos < StartPos) {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos = Temp;
                    }
                    for (var Index = StartPos; Index <= EndPos; Index++) {
                        var Item = this.Content[Index];
                        if (type_Paragraph == Item.GetType()) {
                            Item.Set_Spacing(Spacing, false);
                        } else {
                            if (type_Table == Item.GetType()) {
                                Item.TurnOff_RecalcEvent();
                                Item.Set_ParagraphSpacing(Spacing);
                                Item.TurnOn_RecalcEvent();
                            }
                        }
                    }
                    this.ContentLastChangePos = StartPos - 1;
                    this.Recalculate();
                    this.Document_UpdateSelectionState();
                    this.Document_UpdateInterfaceState();
                    return;
                }
                var Item = this.Content[this.CurPos.ContentPos];
                if (type_Paragraph == Item.GetType()) {
                    Item.Set_Spacing(Spacing, false);
                    this.ContentLastChangePos = this.CurPos.ContentPos - 1;
                    this.Recalculate();
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.Set_ParagraphSpacing(Spacing);
                    }
                }
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
            }
        }
    },
    Set_ParagraphTabs: function (Tabs) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            var bRetValue = this.HdrFtr.Set_ParagraphTabs(Tabs);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            editor.Update_ParaTab(Default_Tab_Stop, Tabs);
            return bRetValue;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var bRetValue = this.DrawingObjects.setParagraphTabs(Tabs);
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                editor.Update_ParaTab(Default_Tab_Stop, Tabs);
                return bRetValue;
            } else {
                if (this.CurPos.ContentPos < 0) {
                    return false;
                }
                if (true === this.Selection.Use) {
                    var StartPos = this.Selection.StartPos;
                    var EndPos = this.Selection.EndPos;
                    if (EndPos < StartPos) {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos = Temp;
                    }
                    for (var Index = StartPos; Index <= EndPos; Index++) {
                        var Item = this.Content[Index];
                        if (type_Paragraph == Item.GetType()) {
                            Item.Set_Tabs(Tabs);
                        } else {
                            if (type_Table == Item.GetType()) {
                                Item.TurnOff_RecalcEvent();
                                Item.Set_ParagraphTabs(Tabs);
                                Item.TurnOn_RecalcEvent();
                            }
                        }
                    }
                    this.ContentLastChangePos = StartPos;
                    this.Recalculate();
                    this.Document_UpdateSelectionState();
                    this.Document_UpdateInterfaceState();
                    editor.Update_ParaTab(Default_Tab_Stop, Tabs);
                    return;
                }
                var Item = this.Content[this.CurPos.ContentPos];
                if (type_Paragraph == Item.GetType()) {
                    Item.Set_Tabs(Tabs);
                    this.ContentLastChangePos = this.CurPos.ContentPos;
                    this.Recalculate(true);
                    editor.Update_ParaTab(Default_Tab_Stop, Tabs);
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.Set_ParagraphTabs(Tabs);
                        editor.Update_ParaTab(Default_Tab_Stop, Tabs);
                    }
                }
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
            }
        }
    },
    Set_ParagraphIndent: function (Ind) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            var bRetValue = this.HdrFtr.Set_ParagraphIndent(Ind);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var bRetValue = this.DrawingObjects.setParagraphIndent(Ind);
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                return bRetValue;
            } else {
                if (this.CurPos.ContentPos < 0) {
                    return false;
                }
                if (true === this.Selection.Use) {
                    var StartPos = this.Selection.StartPos;
                    var EndPos = this.Selection.EndPos;
                    if (EndPos < StartPos) {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos = Temp;
                    }
                    for (var Index = StartPos; Index <= EndPos; Index++) {
                        var Item = this.Content[Index];
                        if (type_Paragraph == Item.GetType()) {
                            var NumPr = null;
                            if ("number" == typeof(Ind.ChangeLevel) && 0 != Ind.ChangeLevel && undefined != (NumPr = Item.Numbering_Get())) {
                                if (Ind.ChangeLevel > 0) {
                                    Item.Numbering_Add(NumPr.NumId, Math.min(8, NumPr.Lvl + 1));
                                } else {
                                    Item.Numbering_Add(NumPr.NumId, Math.max(0, NumPr.Lvl - 1));
                                }
                            } else {
                                Item.Set_Ind(Ind, false);
                            }
                        } else {
                            if (type_Table == Item.GetType()) {
                                Item.TurnOff_RecalcEvent();
                                Item.Set_ParagraphIndent(Ind);
                                Item.TurnOn_RecalcEvent();
                            }
                        }
                    }
                    this.ContentLastChangePos = StartPos;
                    this.Recalculate();
                    this.Document_UpdateSelectionState();
                    this.Document_UpdateInterfaceState();
                    return;
                }
                var Item = this.Content[this.CurPos.ContentPos];
                if (type_Paragraph == Item.GetType()) {
                    var NumPr = null;
                    if ("number" == typeof(Ind.ChangeLevel) && 0 != Ind.ChangeLevel && undefined != (NumPr = Item.Numbering_Get())) {
                        if (Ind.ChangeLevel > 0) {
                            Item.Numbering_Add(NumPr.NumId, Math.min(8, NumPr.Lvl + 1));
                        } else {
                            Item.Numbering_Add(NumPr.NumId, Math.max(0, NumPr.Lvl - 1));
                        }
                    } else {
                        Item.Set_Ind(Ind, false);
                    }
                    this.ContentLastChangePos = this.CurPos.ContentPos;
                    this.Recalculate();
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.Set_ParagraphIndent(Ind);
                    }
                }
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
            }
        }
    },
    Set_ParagraphNumbering: function (NumInfo) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            var bRetValue = this.HdrFtr.Set_ParagraphNumbering(NumInfo);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var bRetValue = this.DrawingObjects.setParagraphNumbering(NumInfo);
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                return bRetValue;
            } else {
                if (this.CurPos.ContentPos < 0) {
                    return false;
                }
                if (true === this.Selection.Use && selectionflag_Numbering !== this.Selection.Flag) {
                    if (this.Selection.StartPos === this.Selection.EndPos && type_Table === this.Content[this.Selection.StartPos].GetType()) {
                        this.Content[this.Selection.StartPos].Set_ParagraphNumbering(NumInfo);
                        this.Document_UpdateSelectionState();
                        this.Document_UpdateInterfaceState();
                        return true;
                    }
                    var StartPos = this.Selection.StartPos;
                    var EndPos = this.Selection.EndPos;
                    if (EndPos < StartPos) {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos = Temp;
                    }
                    if (NumInfo.SubType < 0) {
                        for (var Index = StartPos; Index <= EndPos; Index++) {
                            if (type_Paragraph == this.Content[Index].GetType()) {
                                this.Content[Index].Numbering_Remove();
                            } else {
                                if (type_Table == this.Content[Index].GetType()) {
                                    this.Content[Index].TurnOff_RecalcEvent();
                                    this.Content[Index].Set_ParagraphNumbering(NumInfo);
                                    this.Content[Index].TurnOn_RecalcEvent();
                                }
                            }
                        }
                    } else {
                        switch (NumInfo.Type) {
                        case 0:
                            if (0 === NumInfo.SubType) {
                                var Prev = this.Content[StartPos - 1];
                                var NumId = null;
                                var NumLvl = 0;
                                if ("undefined" != typeof(Prev) && null != Prev && type_Paragraph === Prev.GetType()) {
                                    var PrevNumPr = Prev.Numbering_Get();
                                    if (undefined != PrevNumPr && true === this.Numbering.Check_Format(PrevNumPr.NumId, PrevNumPr.Lvl, numbering_numfmt_Bullet)) {
                                        NumId = PrevNumPr.NumId;
                                        NumLvl = PrevNumPr.Lvl;
                                    }
                                }
                                if (null === NumId) {
                                    NumId = this.Numbering.Create_AbstractNum();
                                    NumLvl = 0;
                                    this.Numbering.Get_AbstractNum(NumId).Create_Default_Bullet();
                                }
                                for (var Index = StartPos; Index <= EndPos; Index++) {
                                    var OldNumPr = null;
                                    if (type_Paragraph === this.Content[Index].GetType()) {
                                        if (undefined != (OldNumPr = this.Content[Index].Numbering_Get())) {
                                            this.Content[Index].Numbering_Add(NumId, OldNumPr.Lvl);
                                        } else {
                                            this.Content[Index].Numbering_Add(NumId, NumLvl);
                                        }
                                    } else {
                                        if (type_Table == this.Content[Index].GetType()) {
                                            this.Content[Index].TurnOff_RecalcEvent();
                                            this.Content[Index].Set_ParagraphNumbering(NumInfo);
                                            this.Content[Index].TurnOn_RecalcEvent();
                                        }
                                    }
                                }
                            } else {
                                var bDiffLvl = false;
                                var bDiffId = false;
                                var PrevLvl = null;
                                var PrevId = null;
                                for (var Index = StartPos; Index <= EndPos; Index++) {
                                    var NumPr = null;
                                    if (type_Paragraph === this.Content[Index].GetType() && undefined != (NumPr = this.Content[Index].Numbering_Get())) {
                                        if (null === PrevLvl) {
                                            PrevLvl = NumPr.Lvl;
                                        }
                                        if (null === PrevId) {
                                            PrevId = NumPr.NumId;
                                        }
                                        if (PrevId != NumPr.NumId) {
                                            bDiffId = true;
                                        }
                                        if (PrevLvl != NumPr.Lvl) {
                                            bDiffLvl = true;
                                            break;
                                        }
                                    } else {
                                        if ((type_Paragraph === this.Content[Index].GetType() && undefined === NumPr) || type_Table === this.Content[Index].GetType()) {
                                            bDiffLvl = true;
                                            break;
                                        }
                                    }
                                }
                                var LvlText = "";
                                var LvlTextPr = new CTextPr();
                                LvlTextPr.RFonts.Set_All("Times New Roman", -1);
                                switch (NumInfo.SubType) {
                                case 1:
                                    LvlText = String.fromCharCode(183);
                                    LvlTextPr.RFonts.Set_All("Symbol", -1);
                                    break;
                                case 2:
                                    LvlText = "o";
                                    LvlTextPr.RFonts.Set_All("Courier New", -1);
                                    break;
                                case 3:
                                    LvlText = String.fromCharCode(167);
                                    LvlTextPr.RFonts.Set_All("Wingdings", -1);
                                    break;
                                case 4:
                                    LvlText = String.fromCharCode(118);
                                    LvlTextPr.RFonts.Set_All("Wingdings", -1);
                                    break;
                                case 5:
                                    LvlText = String.fromCharCode(216);
                                    LvlTextPr.RFonts.Set_All("Wingdings", -1);
                                    break;
                                case 6:
                                    LvlText = String.fromCharCode(252);
                                    LvlTextPr.RFonts.Set_All("Wingdings", -1);
                                    break;
                                case 7:
                                    LvlText = String.fromCharCode(168);
                                    LvlTextPr.RFonts.Set_All("Symbol", -1);
                                    break;
                                }
                                var NumId = null;
                                if (true === bDiffLvl) {
                                    NumId = this.Numbering.Create_AbstractNum();
                                    var AbstractNum = this.Numbering.Get_AbstractNum(NumId);
                                    AbstractNum.Create_Default_Bullet();
                                    AbstractNum.Set_Lvl_Bullet(0, LvlText, LvlTextPr);
                                } else {
                                    if (true === bDiffId || true != this.Numbering.Check_Format(PrevId, PrevLvl, numbering_numfmt_Bullet)) {
                                        NumId = this.Numbering.Create_AbstractNum();
                                        var AbstractNum = this.Numbering.Get_AbstractNum(NumId);
                                        AbstractNum.Create_Default_Bullet();
                                        AbstractNum.Set_Lvl_Bullet(PrevLvl, LvlText, LvlTextPr);
                                    } else {
                                        NumId = this.Numbering.Create_AbstractNum();
                                        var OldAbstractNum = this.Numbering.Get_AbstractNum(PrevId);
                                        var NewAbstractNum = this.Numbering.Get_AbstractNum(NumId);
                                        NewAbstractNum.Copy(OldAbstractNum);
                                        NewAbstractNum.Set_Lvl_Bullet(PrevLvl, LvlText, LvlTextPr);
                                    }
                                }
                                for (var Index = StartPos; Index <= EndPos; Index++) {
                                    var OldNumPr = null;
                                    if (type_Paragraph === this.Content[Index].GetType()) {
                                        if (undefined != (OldNumPr = this.Content[Index].Numbering_Get())) {
                                            this.Content[Index].Numbering_Add(NumId, OldNumPr.Lvl);
                                        } else {
                                            this.Content[Index].Numbering_Add(NumId, 0);
                                        }
                                    } else {
                                        if (type_Table == this.Content[Index].GetType()) {
                                            this.Content[Index].TurnOff_RecalcEvent();
                                            this.Content[Index].Set_ParagraphNumbering(NumInfo);
                                            this.Content[Index].TurnOn_RecalcEvent();
                                        }
                                    }
                                }
                            }
                            break;
                        case 1:
                            if (0 === NumInfo.SubType) {
                                var Prev = this.Content[StartPos - 1];
                                var NumId = null;
                                var NumLvl = 0;
                                if ("undefined" != typeof(Prev) && null != Prev && type_Paragraph === Prev.GetType()) {
                                    var PrevNumPr = Prev.Numbering_Get();
                                    if (undefined != PrevNumPr && true === this.Numbering.Check_Format(PrevNumPr.NumId, PrevNumPr.Lvl, numbering_numfmt_Decimal)) {
                                        NumId = PrevNumPr.NumId;
                                        NumLvl = PrevNumPr.Lvl;
                                    }
                                }
                                if (null === NumId) {
                                    var Next = this.Content[StartPos + 1];
                                    if (StartPos === EndPos && undefined !== Next && null !== Next && type_Paragraph === Next.GetType()) {
                                        var NextNumPr = Next.Numbering_Get();
                                        if (undefined !== NextNumPr && true === this.Numbering.Check_Format(NextNumPr.NumId, NextNumPr.Lvl, numbering_numfmt_Decimal)) {
                                            NumId = NextNumPr.NumId;
                                            NumLvl = NextNumPr.Lvl;
                                        }
                                    }
                                    if (null === NumId) {
                                        NumId = this.Numbering.Create_AbstractNum();
                                        NumLvl = 0;
                                        this.Numbering.Get_AbstractNum(NumId).Create_Default_Numbered();
                                    }
                                }
                                for (var Index = StartPos; Index <= EndPos; Index++) {
                                    var OldNumPr = null;
                                    if (type_Paragraph === this.Content[Index].GetType()) {
                                        if (undefined != (OldNumPr = this.Content[Index].Numbering_Get())) {
                                            this.Content[Index].Numbering_Add(NumId, OldNumPr.Lvl);
                                        } else {
                                            this.Content[Index].Numbering_Add(NumId, NumLvl);
                                        }
                                    } else {
                                        if (type_Table === this.Content[Index].GetType()) {
                                            this.Content[Index].TurnOff_RecalcEvent();
                                            this.Content[Index].Set_ParagraphNumbering(NumInfo);
                                            this.Content[Index].TurnOn_RecalcEvent();
                                        }
                                    }
                                }
                            } else {
                                var bDiffLvl = false;
                                var bDiffId = false;
                                var PrevLvl = null;
                                var PrevId = null;
                                for (var Index = StartPos; Index <= EndPos; Index++) {
                                    var NumPr = undefined;
                                    if (type_Paragraph === this.Content[Index].GetType() && undefined != (NumPr = this.Content[Index].Numbering_Get())) {
                                        if (null === PrevLvl) {
                                            PrevLvl = NumPr.Lvl;
                                        }
                                        if (null === PrevId) {
                                            PrevId = NumPr.NumId;
                                        }
                                        if (PrevId != NumPr.NumId) {
                                            bDiffId = true;
                                        }
                                        if (PrevLvl != NumPr.Lvl) {
                                            bDiffLvl = true;
                                            break;
                                        }
                                    } else {
                                        if ((type_Paragraph === this.Content[Index].GetType() && undefined === NumPr) || type_Table === this.Content[Index].GetType()) {
                                            bDiffLvl = true;
                                            break;
                                        }
                                    }
                                }
                                var AbstractNum = null;
                                var ChangeLvl = 0;
                                var NumId = null;
                                if (true === bDiffLvl) {
                                    NumId = this.Numbering.Create_AbstractNum();
                                    AbstractNum = this.Numbering.Get_AbstractNum(NumId);
                                    AbstractNum.Create_Default_Numbered();
                                    ChangeLvl = 0;
                                } else {
                                    if (true === bDiffId || true != this.Numbering.Check_Format(PrevId, PrevLvl, numbering_numfmt_Decimal)) {
                                        NumId = this.Numbering.Create_AbstractNum();
                                        AbstractNum = this.Numbering.Get_AbstractNum(NumId);
                                        AbstractNum.Create_Default_Numbered();
                                        ChangeLvl = PrevLvl;
                                    } else {
                                        NumId = this.Numbering.Create_AbstractNum();
                                        var OldAbstractNum = this.Numbering.Get_AbstractNum(PrevId);
                                        AbstractNum = this.Numbering.Get_AbstractNum(NumId);
                                        AbstractNum.Copy(OldAbstractNum);
                                        ChangeLvl = PrevLvl;
                                    }
                                }
                                switch (NumInfo.SubType) {
                                case 1:
                                    AbstractNum.Set_Lvl_Numbered_2(ChangeLvl);
                                    break;
                                case 2:
                                    AbstractNum.Set_Lvl_Numbered_1(ChangeLvl);
                                    break;
                                case 3:
                                    AbstractNum.Set_Lvl_Numbered_5(ChangeLvl);
                                    break;
                                case 4:
                                    AbstractNum.Set_Lvl_Numbered_6(ChangeLvl);
                                    break;
                                case 5:
                                    AbstractNum.Set_Lvl_Numbered_7(ChangeLvl);
                                    break;
                                case 6:
                                    AbstractNum.Set_Lvl_Numbered_8(ChangeLvl);
                                    break;
                                case 7:
                                    AbstractNum.Set_Lvl_Numbered_9(ChangeLvl);
                                    break;
                                }
                                for (var Index = StartPos; Index <= EndPos; Index++) {
                                    var OldNumPr = null;
                                    if (type_Paragraph === this.Content[Index].GetType()) {
                                        if (undefined != (OldNumPr = this.Content[Index].Numbering_Get())) {
                                            this.Content[Index].Numbering_Add(NumId, OldNumPr.Lvl);
                                        } else {
                                            this.Content[Index].Numbering_Add(NumId, 0);
                                        }
                                    } else {
                                        if (type_Table === this.Content[Index].GetType()) {
                                            this.Content[Index].TurnOff_RecalcEvent();
                                            this.Content[Index].Set_ParagraphNumbering(NumInfo);
                                            this.Content[Index].TurnOn_RecalcEvent();
                                        }
                                    }
                                }
                            }
                            break;
                        case 2:
                            var NumId = this.Numbering.Create_AbstractNum();
                            var AbstractNum = this.Numbering.Get_AbstractNum(NumId);
                            switch (NumInfo.SubType) {
                            case 1:
                                AbstractNum.Create_Default_Multilevel_1();
                                break;
                            case 2:
                                AbstractNum.Create_Default_Multilevel_2();
                                break;
                            case 3:
                                AbstractNum.Create_Default_Multilevel_3();
                                break;
                            }
                            for (var Index = StartPos; Index <= EndPos; Index++) {
                                var OldNumPr = null;
                                if (type_Paragraph === this.Content[Index].GetType()) {
                                    if (undefined != (OldNumPr = this.Content[Index].Numbering_Get())) {
                                        this.Content[Index].Numbering_Add(NumId, OldNumPr.Lvl);
                                    } else {
                                        this.Content[Index].Numbering_Add(NumId, 0);
                                    }
                                } else {
                                    if (type_Table === this.Content[Index].GetType()) {
                                        this.Content[Index].TurnOff_RecalcEvent();
                                        this.Content[Index].Set_ParagraphNumbering(NumInfo);
                                        this.Content[Index].TurnOn_RecalcEvent();
                                    }
                                }
                            }
                            break;
                        }
                    }
                    this.ContentLastChangePos = StartPos - 1;
                    this.Recalculate();
                    this.Document_UpdateSelectionState();
                    this.Document_UpdateInterfaceState();
                    return;
                }
                var Item = this.Content[this.CurPos.ContentPos];
                if (type_Paragraph == Item.GetType()) {
                    var FirstChange = 0;
                    if (NumInfo.SubType < 0) {
                        Item.Numbering_Remove();
                        if (selectionflag_Numbering === this.Selection.Flag) {
                            this.Selection_Remove();
                            Item.Document_SetThisElementCurrent(true);
                        }
                    } else {
                        if (selectionflag_Numbering === this.Selection.Flag && 0 === NumInfo.SubType) {
                            NumInfo.SubType = 1;
                        }
                        switch (NumInfo.Type) {
                        case 0:
                            if (0 === NumInfo.SubType) {
                                var NumPr = Item.Numbering_Get();
                                if (undefined != (NumPr = Item.Numbering_Get())) {
                                    var AbstractNum = this.Numbering.Get_AbstractNum(NumPr.NumId);
                                    if (false === this.Numbering.Check_Format(NumPr.NumId, NumPr.Lvl, numbering_numfmt_Bullet)) {
                                        AbstractNum.Create_Default_Bullet();
                                        FirstChange = 0;
                                        var bFirstChange = false;
                                        for (var Index = 0; Index < this.Content.length; Index++) {
                                            if (true === this.Content[Index].Numbering_IsUse(NumPr.NumId, NumPr.Lvl)) {
                                                if (false === bFirstChange) {
                                                    FirstChange = Index;
                                                    bFirstChange = true;
                                                }
                                                this.Content[Index].Recalc_CompileParaPr();
                                            }
                                        }
                                    }
                                } else {
                                    var Prev = this.Content[this.CurPos.ContentPos - 1];
                                    var NumId = undefined;
                                    var NumLvl = 0;
                                    if ("undefined" != typeof(Prev) && null != Prev && type_Paragraph === Prev.GetType()) {
                                        var PrevNumPr = Prev.Numbering_Get();
                                        if (undefined != PrevNumPr && true === this.Numbering.Check_Format(PrevNumPr.NumId, PrevNumPr.Lvl, numbering_numfmt_Bullet)) {
                                            NumId = PrevNumPr.NumId;
                                            NumLvl = PrevNumPr.Lvl;
                                        }
                                    }
                                    if (undefined === NumId) {
                                        NumId = this.Numbering.Create_AbstractNum();
                                        NumLvl = 0;
                                        this.Numbering.Get_AbstractNum(NumId).Create_Default_Bullet();
                                    }
                                    if (type_Paragraph === Item.GetType()) {
                                        var OldNumPr = Item.Numbering_Get();
                                        if (undefined != OldNumPr) {
                                            Item.Numbering_Add(NumId, OldNumPr.Lvl);
                                        } else {
                                            Item.Numbering_Add(NumId, NumLvl);
                                        }
                                    } else {
                                        Item.Numbering_Add(NumId, NumLvl);
                                    }
                                    FirstChange = this.CurPos.ContentPos - 1;
                                }
                            } else {
                                var LvlText = "";
                                var LvlTextPr = new CTextPr();
                                LvlTextPr.RFonts.Set_All("Times New Roman", -1);
                                switch (NumInfo.SubType) {
                                case 1:
                                    LvlText = String.fromCharCode(183);
                                    LvlTextPr.RFonts.Set_All("Symbol", -1);
                                    break;
                                case 2:
                                    LvlText = "o";
                                    LvlTextPr.RFonts.Set_All("Courier New", -1);
                                    break;
                                case 3:
                                    LvlText = String.fromCharCode(167);
                                    LvlTextPr.RFonts.Set_All("Wingdings", -1);
                                    break;
                                case 4:
                                    LvlText = String.fromCharCode(118);
                                    LvlTextPr.RFonts.Set_All("Wingdings", -1);
                                    break;
                                case 5:
                                    LvlText = String.fromCharCode(216);
                                    LvlTextPr.RFonts.Set_All("Wingdings", -1);
                                    break;
                                case 6:
                                    LvlText = String.fromCharCode(252);
                                    LvlTextPr.RFonts.Set_All("Wingdings", -1);
                                    break;
                                case 7:
                                    LvlText = String.fromCharCode(168);
                                    LvlTextPr.RFonts.Set_All("Symbol", -1);
                                    break;
                                }
                                var NumPr = null;
                                if (undefined != (NumPr = Item.Numbering_Get())) {
                                    var AbstractNum = this.Numbering.Get_AbstractNum(NumPr.NumId);
                                    AbstractNum.Set_Lvl_Bullet(NumPr.Lvl, LvlText, LvlTextPr);
                                    FirstChange = 0;
                                    var bFirstChange = false;
                                    for (var Index = 0; Index < this.Content.length; Index++) {
                                        if (true === this.Content[Index].Numbering_IsUse(NumPr.NumId, NumPr.Lvl)) {
                                            if (false === bFirstChange) {
                                                FirstChange = Index;
                                                bFirstChange = true;
                                            }
                                            this.Content[Index].Recalc_CompileParaPr();
                                        }
                                    }
                                } else {
                                    var NumId = this.Numbering.Create_AbstractNum();
                                    var AbstractNum = this.Numbering.Get_AbstractNum(NumId);
                                    AbstractNum.Create_Default_Bullet();
                                    AbstractNum.Set_Lvl_Bullet(0, LvlText, LvlTextPr);
                                    Item.Numbering_Add(NumId, 0);
                                    FirstChange = this.CurPos.ContentPos - 1;
                                }
                            }
                            break;
                        case 1:
                            if (0 === NumInfo.SubType) {
                                var NumPr = Item.Numbering_Get();
                                if (undefined != (NumPr = Item.Numbering_Get())) {
                                    var AbstractNum = this.Numbering.Get_AbstractNum(NumPr.NumId);
                                    if (false === this.Numbering.Check_Format(NumPr.NumId, NumPr.Lvl, numbering_numfmt_Decimal)) {
                                        AbstractNum.Create_Default_Numbered();
                                        FirstChange = 0;
                                        var bFirstChange = false;
                                        for (var Index = 0; Index < this.Content.length; Index++) {
                                            if (true === this.Content[Index].Numbering_IsUse(NumPr.NumId, NumPr.Lvl)) {
                                                if (false === bFirstChange) {
                                                    FirstChange = Index;
                                                    bFirstChange = true;
                                                }
                                                this.Content[Index].Recalc_CompileParaPr();
                                            }
                                        }
                                    }
                                } else {
                                    var Prev = this.Content[this.CurPos.ContentPos - 1];
                                    var NumId = null;
                                    var NumLvl = 0;
                                    if ("undefined" != typeof(Prev) && null != Prev && type_Paragraph === Prev.GetType()) {
                                        var PrevNumPr = Prev.Numbering_Get();
                                        if (undefined != PrevNumPr && true === this.Numbering.Check_Format(PrevNumPr.NumId, PrevNumPr.Lvl, numbering_numfmt_Decimal)) {
                                            NumId = PrevNumPr.NumId;
                                            NumLvl = PrevNumPr.Lvl;
                                        }
                                    }
                                    if (null === NumId) {
                                        var Next = this.Content[this.CurPos.ContentPos + 1];
                                        if (undefined !== Next && null !== Next && type_Paragraph === Next.GetType()) {
                                            var NextNumPr = Next.Numbering_Get();
                                            if (undefined !== NextNumPr && true === this.Numbering.Check_Format(NextNumPr.NumId, NextNumPr.Lvl, numbering_numfmt_Decimal)) {
                                                NumId = NextNumPr.NumId;
                                                NumLvl = NextNumPr.Lvl;
                                            }
                                        }
                                        if (null === NumId) {
                                            NumId = this.Numbering.Create_AbstractNum();
                                            NumLvl = 0;
                                            this.Numbering.Get_AbstractNum(NumId).Create_Default_Numbered();
                                        }
                                    }
                                    if (type_Paragraph === Item.GetType()) {
                                        var OldNumPr = Item.Numbering_Get();
                                        if (undefined != (OldNumPr)) {
                                            Item.Numbering_Add(NumId, OldNumPr.Lvl);
                                        } else {
                                            Item.Numbering_Add(NumId, NumLvl);
                                        }
                                    } else {
                                        Item.Numbering_Add(NumId, NumLvl);
                                    }
                                    FirstChange = this.CurPos.ContentPos - 1;
                                }
                            } else {
                                var NumPr = null;
                                var AbstractNum = null;
                                var ChangeLvl = 0;
                                if (undefined != (NumPr = Item.Numbering_Get())) {
                                    AbstractNum = this.Numbering.Get_AbstractNum(NumPr.NumId);
                                    ChangeLvl = NumPr.Lvl;
                                } else {
                                    var NumId = this.Numbering.Create_AbstractNum();
                                    AbstractNum = this.Numbering.Get_AbstractNum(NumId);
                                    AbstractNum.Create_Default_Numbered();
                                    ChangeLvl = 0;
                                }
                                switch (NumInfo.SubType) {
                                case 1:
                                    AbstractNum.Set_Lvl_Numbered_2(ChangeLvl);
                                    break;
                                case 2:
                                    AbstractNum.Set_Lvl_Numbered_1(ChangeLvl);
                                    break;
                                case 3:
                                    AbstractNum.Set_Lvl_Numbered_5(ChangeLvl);
                                    break;
                                case 4:
                                    AbstractNum.Set_Lvl_Numbered_6(ChangeLvl);
                                    break;
                                case 5:
                                    AbstractNum.Set_Lvl_Numbered_7(ChangeLvl);
                                    break;
                                case 6:
                                    AbstractNum.Set_Lvl_Numbered_8(ChangeLvl);
                                    break;
                                case 7:
                                    AbstractNum.Set_Lvl_Numbered_9(ChangeLvl);
                                    break;
                                }
                                if (null != NumPr) {
                                    FirstChange = 0;
                                    var bFirstChange = false;
                                    for (var Index = 0; Index < this.Content.length; Index++) {
                                        if (true === this.Content[Index].Numbering_IsUse(NumPr.NumId, NumPr.Lvl)) {
                                            if (false === bFirstChange) {
                                                FirstChange = Index;
                                                bFirstChange = true;
                                            }
                                            this.Content[Index].Recalc_CompileParaPr();
                                        }
                                    }
                                } else {
                                    Item.Numbering_Add(NumId, 0);
                                    FirstChange = this.CurPos.ContentPos - 1;
                                }
                            }
                            break;
                        case 2:
                            var NumId = null;
                            var NumPr = Item.Numbering_Get();
                            var AbstractNum = null;
                            if (undefined != NumPr) {
                                AbstractNum = this.Numbering.Get_AbstractNum(NumPr.NumId);
                            } else {
                                NumId = this.Numbering.Create_AbstractNum();
                                AbstractNum = this.Numbering.Get_AbstractNum(NumId);
                            }
                            switch (NumInfo.SubType) {
                            case 1:
                                AbstractNum.Create_Default_Multilevel_1();
                                break;
                            case 2:
                                AbstractNum.Create_Default_Multilevel_2();
                                break;
                            case 3:
                                AbstractNum.Create_Default_Multilevel_3();
                                break;
                            }
                            if (null != NumPr) {
                                FirstChange = 0;
                                var bFirstChange = false;
                                for (var Index = 0; Index < this.Content.length; Index++) {
                                    if (true === this.Content[Index].Numbering_IsUse(NumPr.NumId)) {
                                        if (false === bFirstChange) {
                                            FirstChange = Index;
                                            bFirstChange = true;
                                        }
                                        this.Content[Index].Recalc_CompileParaPr();
                                    }
                                }
                            } else {
                                Item.Numbering_Add(NumId, 0);
                                FirstChange = this.CurPos.ContentPos - 1;
                            }
                            break;
                        }
                    }
                    this.ContentLastChangePos = FirstChange;
                    this.Recalculate();
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.Set_ParagraphNumbering(NumInfo);
                    }
                }
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
            }
        }
    },
    Set_ParagraphShd: function (Shd) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Set_ParagraphShd(Shd);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                this.DrawingObjects.setParagraphShd(Shd);
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                return;
            } else {
                if (this.CurPos.ContentPos < 0) {
                    return false;
                }
                if (true === this.Selection.Use) {
                    var StartPos = this.Selection.StartPos;
                    var EndPos = this.Selection.EndPos;
                    if (true === this.UseTextShd && StartPos === EndPos && type_Paragraph === this.Content[StartPos].GetType() && false === this.Content[StartPos].Selection_CheckParaEnd() && selectionflag_Common === this.Selection.Flag) {
                        this.Paragraph_Add(new ParaTextPr({
                            Shd: Shd
                        }));
                        this.Recalculate();
                    } else {
                        if (EndPos < StartPos) {
                            var Temp = StartPos;
                            StartPos = EndPos;
                            EndPos = Temp;
                        }
                        for (var Index = StartPos; Index <= EndPos; Index++) {
                            var Item = this.Content[Index];
                            if (type_Paragraph == Item.GetType()) {
                                Item.Set_Shd(Shd);
                            } else {
                                if (type_Table == Item.GetType()) {
                                    Item.TurnOff_RecalcEvent();
                                    Item.Set_ParagraphShd(Shd);
                                    Item.TurnOn_RecalcEvent();
                                }
                            }
                        }
                        var PageStart = -1;
                        var PageEnd = -1;
                        for (var Index = 0; Index < this.Pages.length - 1; Index++) {
                            if (PageStart == -1 && StartPos <= this.Pages[Index + 1].Pos) {
                                PageStart = Index;
                            }
                            if (PageEnd == -1 && EndPos < this.Pages[Index + 1].Pos) {
                                PageEnd = Index;
                            }
                        }
                        if (-1 === PageStart) {
                            PageStart = this.Pages.length - 1;
                        }
                        if (-1 === PageEnd) {
                            PageEnd = this.Pages.length - 1;
                        }
                        for (var Index = PageStart; Index <= PageEnd; Index++) {
                            this.DrawingDocument.OnRecalculatePage(Index, this.Pages[Index]);
                        }
                        this.DrawingDocument.OnEndRecalculate(false, true);
                    }
                    this.Document_UpdateSelectionState();
                    this.Document_UpdateInterfaceState();
                    return;
                }
                var Item = this.Content[this.CurPos.ContentPos];
                if (type_Paragraph == Item.GetType()) {
                    Item.Set_Shd(Shd);
                    var PageStart = -1;
                    var PageEnd = -1;
                    for (var Index = 0; Index < this.Pages.length - 1; Index++) {
                        if (PageStart == -1 && this.CurPos.ContentPos <= this.Pages[Index + 1].Pos) {
                            PageStart = Index;
                        }
                        if (PageEnd == -1 && this.CurPos.ContentPos < this.Pages[Index + 1].Pos) {
                            PageEnd = Index;
                        }
                    }
                    if (-1 === PageStart) {
                        PageStart = this.Pages.length - 1;
                    }
                    if (-1 === PageEnd) {
                        PageEnd = this.Pages.length - 1;
                    }
                    for (var Index = PageStart; Index <= PageEnd; Index++) {
                        this.DrawingDocument.OnRecalculatePage(Index, this.Pages[Index]);
                    }
                    this.DrawingDocument.OnEndRecalculate(false, true);
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.Set_ParagraphShd(Shd);
                    }
                }
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
            }
        }
    },
    Set_ParagraphStyle: function (Name) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            var bRetValue = this.HdrFtr.Set_ParagraphStyle(Name);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var bRetValue = this.DrawingObjects.setParagraphStyle(Name);
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                return bRetValue;
            } else {
                var StyleId = this.Styles.Get_StyleIdByName(Name);
                if (this.CurPos.ContentPos < 0) {
                    return false;
                }
                if (true === this.Selection.Use) {
                    if (selectionflag_Numbering === this.Selection.Flag) {
                        this.Remove_NumberingSelection();
                    }
                    var StartPos = this.Selection.StartPos;
                    var EndPos = this.Selection.EndPos;
                    if (EndPos < StartPos) {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos = Temp;
                    }
                    for (var Index = StartPos; Index <= EndPos; Index++) {
                        var Item = this.Content[Index];
                        if (type_Paragraph == Item.GetType()) {
                            Item.Style_Add(StyleId);
                        } else {
                            if (type_Table == Item.GetType()) {
                                Item.TurnOff_RecalcEvent();
                                Item.Set_ParagraphStyle(Name);
                                Item.TurnOn_RecalcEvent();
                            }
                        }
                    }
                    this.ContentLastChangePos = Math.max(StartPos - 1, 0);
                    this.Recalculate();
                    this.Document_UpdateSelectionState();
                    this.Document_UpdateInterfaceState();
                    return;
                }
                var Item = this.Content[this.CurPos.ContentPos];
                if (type_Paragraph == Item.GetType()) {
                    Item.Style_Add(StyleId);
                    this.ContentLastChangePos = Math.max(this.CurPos.ContentPos - 1, 0);
                    this.Recalculate();
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.TurnOff_RecalcEvent();
                        Item.Set_ParagraphStyle(Name);
                        Item.TurnOn_RecalcEvent();
                        this.ContentLastChangePos = Math.max(this.CurPos.ContentPos - 1, 0);
                        this.Recalculate();
                    }
                }
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
            }
        }
    },
    Set_ParagraphContextualSpacing: function (Value) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            var bRetValue = this.HdrFtr.Set_ParagraphContextualSpacing(Value);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var bRetValue = this.DrawingObjects.setParagraphContextualSpacing(Value);
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                return bRetValue;
            } else {
                if (this.CurPos.ContentPos < 0) {
                    return false;
                }
                if (true === this.Selection.Use) {
                    var StartPos = this.Selection.StartPos;
                    var EndPos = this.Selection.EndPos;
                    if (EndPos < StartPos) {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos = Temp;
                    }
                    for (var Index = StartPos; Index <= EndPos; Index++) {
                        var Item = this.Content[Index];
                        if (type_Paragraph == Item.GetType()) {
                            Item.Set_ContextualSpacing(Value);
                        } else {
                            if (type_Table == Item.GetType()) {
                                Item.TurnOff_RecalcEvent();
                                Item.Set_ParagraphContextualSpacing(Value);
                                Item.TurnOn_RecalcEvent();
                            }
                        }
                    }
                    this.ContentLastChangePos = StartPos;
                    this.Recalculate();
                    this.Document_UpdateSelectionState();
                    this.Document_UpdateInterfaceState();
                    return;
                }
                var Item = this.Content[this.CurPos.ContentPos];
                if (type_Paragraph == Item.GetType()) {
                    Item.Set_ContextualSpacing(Value);
                    this.ContentLastChangePos = this.CurPos.ContentPos;
                    this.Recalculate(true);
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.Set_ParagraphContextualSpacing(Value);
                    }
                }
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
            }
        }
    },
    Set_ParagraphPageBreakBefore: function (Value) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            var bRetValue = this.HdrFtr.Set_ParagraphPageBreakBefore(Value);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var bRetValue = this.DrawingObjects.setParagraphPageBreakBefore(Value);
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                return bRetValue;
            } else {
                if (this.CurPos.ContentPos < 0) {
                    return false;
                }
                if (true === this.Selection.Use) {
                    var StartPos = this.Selection.StartPos;
                    var EndPos = this.Selection.EndPos;
                    if (EndPos < StartPos) {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos = Temp;
                    }
                    for (var Index = StartPos; Index <= EndPos; Index++) {
                        var Item = this.Content[Index];
                        if (type_Paragraph == Item.GetType()) {
                            Item.Set_PageBreakBefore(Value);
                        } else {
                            if (type_Table == Item.GetType()) {
                                Item.TurnOff_RecalcEvent();
                                Item.Set_ParagraphPageBreakBefore(Value);
                                Item.TurnOn_RecalcEvent();
                            }
                        }
                    }
                    this.ContentLastChangePos = StartPos;
                    this.Recalculate();
                    this.Document_UpdateSelectionState();
                    this.Document_UpdateInterfaceState();
                    return;
                }
                var Item = this.Content[this.CurPos.ContentPos];
                if (type_Paragraph == Item.GetType()) {
                    Item.Set_PageBreakBefore(Value);
                    this.ContentLastChangePos = this.CurPos.ContentPos;
                    this.Recalculate(true);
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.Set_ParagraphPageBreakBefore(Value);
                    }
                }
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
            }
        }
    },
    Set_ParagraphKeepLines: function (Value) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            var bRetValue = this.HdrFtr.Set_ParagraphKeepLines(Value);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var bRetValue = this.DrawingObjects.setParagraphKeepLines(Value);
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                return bRetValue;
            } else {
                if (this.CurPos.ContentPos < 0) {
                    return false;
                }
                if (true === this.Selection.Use) {
                    var StartPos = this.Selection.StartPos;
                    var EndPos = this.Selection.EndPos;
                    if (EndPos < StartPos) {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos = Temp;
                    }
                    for (var Index = StartPos; Index <= EndPos; Index++) {
                        var Item = this.Content[Index];
                        if (type_Paragraph == Item.GetType()) {
                            Item.Set_KeepLines(Value);
                        } else {
                            if (type_Table == Item.GetType()) {
                                Item.TurnOff_RecalcEvent();
                                Item.Set_ParagraphKeepLines(Value);
                                Item.TurnOn_RecalcEvent();
                            }
                        }
                    }
                    this.ContentLastChangePos = StartPos;
                    this.Recalculate();
                    this.Document_UpdateSelectionState();
                    this.Document_UpdateInterfaceState();
                    return;
                }
                var Item = this.Content[this.CurPos.ContentPos];
                if (type_Paragraph == Item.GetType()) {
                    Item.Set_KeepLines(Value);
                    this.ContentLastChangePos = this.CurPos.ContentPos;
                    this.Recalculate(true);
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.Set_ParagraphKeepLines(Value);
                    }
                }
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
            }
        }
    },
    Set_ParagraphKeepNext: function (Value) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            var bRetValue = this.HdrFtr.Set_ParagraphKeepNext(Value);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var bRetValue = this.DrawingObjects.setParagraphKeepNext(Value);
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                return bRetValue;
            } else {
                if (this.CurPos.ContentPos < 0) {
                    return false;
                }
                if (true === this.Selection.Use) {
                    var StartPos = this.Selection.StartPos;
                    var EndPos = this.Selection.EndPos;
                    if (EndPos < StartPos) {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos = Temp;
                    }
                    for (var Index = StartPos; Index <= EndPos; Index++) {
                        var Item = this.Content[Index];
                        if (type_Paragraph == Item.GetType()) {
                            Item.Set_KeepNext(Value);
                        } else {
                            if (type_Table == Item.GetType()) {
                                Item.TurnOff_RecalcEvent();
                                Item.Set_ParagraphKeepNext(Value);
                                Item.TurnOn_RecalcEvent();
                            }
                        }
                    }
                    this.ContentLastChangePos = StartPos;
                    this.Recalculate();
                    this.Document_UpdateSelectionState();
                    this.Document_UpdateInterfaceState();
                    return;
                }
                var Item = this.Content[this.CurPos.ContentPos];
                if (type_Paragraph == Item.GetType()) {
                    Item.Set_KeepNext(Value);
                    this.ContentLastChangePos = this.CurPos.ContentPos;
                    this.Recalculate(true);
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.Set_ParagraphKeepNext(Value);
                    }
                }
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
            }
        }
    },
    Set_ParagraphWidowControl: function (Value) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            var bRetValue = this.HdrFtr.Set_ParagraphWidowControl(Value);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var bRetValue = this.DrawingObjects.setParagraphWidowControl(Value);
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                return bRetValue;
            } else {
                if (this.CurPos.ContentPos < 0) {
                    return false;
                }
                if (true === this.Selection.Use) {
                    var StartPos = this.Selection.StartPos;
                    var EndPos = this.Selection.EndPos;
                    if (EndPos < StartPos) {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos = Temp;
                    }
                    for (var Index = StartPos; Index <= EndPos; Index++) {
                        var Item = this.Content[Index];
                        if (type_Paragraph == Item.GetType()) {
                            Item.Set_WidowControl(Value);
                        } else {
                            if (type_Table == Item.GetType()) {
                                Item.TurnOff_RecalcEvent();
                                Item.Set_ParagraphWidowControl(Value);
                                Item.TurnOn_RecalcEvent();
                            }
                        }
                    }
                    this.ContentLastChangePos = StartPos;
                    this.Recalculate();
                    this.Document_UpdateSelectionState();
                    this.Document_UpdateInterfaceState();
                    return;
                }
                var Item = this.Content[this.CurPos.ContentPos];
                if (type_Paragraph == Item.GetType()) {
                    Item.Set_WidowControl(Value);
                    this.ContentLastChangePos = this.CurPos.ContentPos;
                    this.Recalculate(true);
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.Set_ParagraphWidowControl(Value);
                    }
                }
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
            }
        }
    },
    Set_ParagraphBorders: function (Borders) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            var bRetValue = this.HdrFtr.Set_ParagraphBorders(Borders);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var bRetValue = this.DrawingObjects.setParagraphBorders(Borders);
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                return bRetValue;
            } else {
                if (this.CurPos.ContentPos < 0) {
                    return false;
                }
                if (true === this.Selection.Use) {
                    var StartPos = this.Selection.StartPos;
                    var EndPos = this.Selection.EndPos;
                    if (EndPos < StartPos) {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos = Temp;
                    }
                    for (var Index = StartPos; Index <= EndPos; Index++) {
                        var Item = this.Content[Index];
                        if (type_Paragraph == Item.GetType()) {
                            Item.Set_Borders(Borders);
                        } else {
                            if (type_Table == Item.GetType()) {
                                Item.TurnOff_RecalcEvent();
                                Item.Set_ParagraphBorders(Borders);
                                Item.TurnOn_RecalcEvent();
                            }
                        }
                    }
                    this.ContentLastChangePos = StartPos;
                    this.Recalculate();
                    this.Document_UpdateSelectionState();
                    this.Document_UpdateInterfaceState();
                    return;
                }
                var Item = this.Content[this.CurPos.ContentPos];
                if (type_Paragraph == Item.GetType()) {
                    var StartPos = Item.Index;
                    var EndPos = Item.Index;
                    var CurBrd = Item.Get_CompiledPr().ParaPr.Brd;
                    while (true != CurBrd.First) {
                        StartPos--;
                        if (StartPos < 0) {
                            StartPos = 0;
                            break;
                        }
                        var TempItem = this.Content[StartPos];
                        if (type_Paragraph != TempItem.GetType()) {
                            StartPos++;
                            break;
                        }
                        CurBrd = TempItem.Get_CompiledPr().ParaPr.Brd;
                    }
                    CurBrd = Item.Get_CompiledPr().ParaPr.Brd;
                    while (true != CurBrd.Last) {
                        EndPos++;
                        if (EndPos >= this.Content.length) {
                            EndPos = this.Content.length - 1;
                            break;
                        }
                        var TempItem = this.Content[EndPos];
                        if (type_Paragraph != TempItem.GetType()) {
                            EndPos--;
                            break;
                        }
                        CurBrd = TempItem.Get_CompiledPr().ParaPr.Brd;
                    }
                    for (var Index = StartPos; Index <= EndPos; Index++) {
                        this.Content[Index].Set_Borders(Borders);
                    }
                    this.ContentLastChangePos = StartPos - 1;
                    this.Recalculate();
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.Set_ParagraphBorders(Borders);
                    }
                }
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
            }
        }
    },
    Set_ParagraphFramePr: function (FramePr, bDelete) {
        if (docpostype_HdrFtr === this.CurPos.Type || docpostype_DrawingObjects === this.CurPos.Type) {
            return;
        } else {
            if (true === this.Selection.Use) {
                var StartPos = this.Selection.StartPos;
                var EndPos = this.Selection.EndPos;
                if (StartPos > EndPos) {
                    StartPos = this.Selection.EndPos;
                    EndPos = this.Selection.StartPos;
                }
                var Element = this.Content[StartPos];
                if (type_Paragraph != Element.GetType() || undefined === Element.Get_FramePr()) {
                    return;
                }
                var FramePr = Element.Get_FramePr();
                for (var Pos = StartPos + 1; Pos < EndPos; Pos++) {
                    var TempElement = this.Content[Pos];
                    if (type_Paragraph != TempElement.GetType() || undefined === TempElement.Get_FramePr() || true != FramePr.Compare(TempElement.Get_FramePr())) {
                        return;
                    }
                }
                var FrameParas = this.Content[StartPos].Internal_Get_FrameParagraphs();
                var FrameCount = FrameParas.length;
                for (var Pos = 0; Pos < FrameCount; Pos++) {
                    FrameParas[Pos].Set_FramePr(FramePr, bDelete);
                }
            } else {
                var Element = this.Content[this.CurPos.ContentPos];
                if (type_Paragraph != Element.GetType()) {
                    return;
                }
                if (undefined === Element.Get_FramePr()) {
                    var PrevElement = Element.Get_DocumentPrev();
                    if (type_Paragraph != PrevElement.GetType() || undefined === PrevElement.Get_FramePr() || undefined === PrevElement.Get_FramePr().DropCap) {
                        return;
                    }
                    Element = PrevElement;
                }
                var FrameParas = Element.Internal_Get_FrameParagraphs();
                var FrameCount = FrameParas.length;
                for (var Pos = 0; Pos < FrameCount; Pos++) {
                    FrameParas[Pos].Set_FramePr(FramePr, bDelete);
                }
            }
        }
        this.Recalculate();
        this.Document_UpdateSelectionState();
        this.Document_UpdateRulersState();
        this.Document_UpdateInterfaceState();
    },
    Paragraph_IncDecFontSize: function (bIncrease) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            var bRetValue = this.HdrFtr.Paragraph_IncDecFontSize(bIncrease);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var bRetValue = this.DrawingObjects.paragraphIncDecFontSize(bIncrease);
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                return bRetValue;
            } else {
                if (this.CurPos.ContentPos < 0) {
                    return false;
                }
                if (true === this.Selection.Use) {
                    switch (this.Selection.Flag) {
                    case selectionflag_Common:
                        var StartPos = this.Selection.StartPos;
                        var EndPos = this.Selection.EndPos;
                        if (EndPos < StartPos) {
                            var Temp = StartPos;
                            StartPos = EndPos;
                            EndPos = Temp;
                        }
                        for (var Index = StartPos; Index <= EndPos; Index++) {
                            var Item = this.Content[Index];
                            if (type_Paragraph == Item.GetType()) {
                                Item.IncDec_FontSize(bIncrease);
                            } else {
                                if (type_Table == Item.GetType()) {
                                    Item.TurnOff_RecalcEvent();
                                    Item.Paragraph_IncDecFontSize(bIncrease);
                                    Item.TurnOn_RecalcEvent();
                                }
                            }
                        }
                        this.ContentLastChangePos = StartPos;
                        this.Recalculate();
                        this.Document_UpdateSelectionState();
                        this.Document_UpdateInterfaceState();
                        return;
                    case selectionflag_Numbering:
                        break;
                    }
                    return;
                }
                var Item = this.Content[this.CurPos.ContentPos];
                if (type_Paragraph == Item.GetType()) {
                    if (true === Item.IncDec_FontSize(bIncrease)) {
                        this.ContentLastChangePos = this.CurPos.ContentPos;
                        this.Recalculate();
                    }
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.Paragraph_IncDecFontSize(bIncrease);
                    }
                }
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
            }
        }
    },
    Paragraph_IncDecIndent: function (bIncrease) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            var bRetValue = this.HdrFtr.Paragraph_IncDecIndent(bIncrease);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return bRetValue;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                if (true != this.DrawingObjects.isSelectedText()) {
                    var ParaDrawing = this.DrawingObjects.getMajorParaDrawing();
                    if (null != ParaDrawing) {
                        var Paragraph = ParaDrawing.Parent;
                        Paragraph.IncDec_Indent(bIncrease);
                        this.Recalculate();
                    }
                } else {
                    this.DrawingObjects.paragraphIncDecIndent(bIncrease);
                }
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                return;
            } else {
                if (this.CurPos.ContentPos < 0) {
                    return false;
                }
                if (true === this.Selection.Use) {
                    switch (this.Selection.Flag) {
                    case selectionflag_Common:
                        var StartPos = this.Selection.StartPos;
                        var EndPos = this.Selection.EndPos;
                        if (EndPos < StartPos) {
                            var Temp = StartPos;
                            StartPos = EndPos;
                            EndPos = Temp;
                        }
                        for (var Index = StartPos; Index <= EndPos; Index++) {
                            var Item = this.Content[Index];
                            if (type_Paragraph == Item.GetType()) {
                                Item.IncDec_Indent(bIncrease);
                            } else {
                                if (type_Table == Item.GetType()) {
                                    Item.TurnOff_RecalcEvent();
                                    Item.Paragraph_IncDecIndent(bIncrease);
                                    Item.TurnOn_RecalcEvent();
                                }
                            }
                        }
                        this.ContentLastChangePos = StartPos;
                        this.Recalculate();
                        this.Document_UpdateSelectionState();
                        this.Document_UpdateInterfaceState();
                        return;
                    case selectionflag_Numbering:
                        break;
                    }
                    return;
                }
                var Item = this.Content[this.CurPos.ContentPos];
                if (type_Paragraph == Item.GetType()) {
                    Item.IncDec_Indent(bIncrease);
                    this.ContentLastChangePos = this.CurPos.ContentPos;
                    this.Recalculate();
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.Paragraph_IncDecIndent(bIncrease);
                    }
                }
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
            }
        }
    },
    Paragraph_SetHighlight: function (IsColor, r, g, b) {
        if (true === this.Is_TextSelectionUse()) {
            if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                this.Create_NewHistoryPoint(historydescription_Document_SetTextHighlight);
                if (false === IsColor) {
                    this.Paragraph_Add(new ParaTextPr({
                        HighLight: highlight_None
                    }));
                } else {
                    this.Paragraph_Add(new ParaTextPr({
                        HighLight: new CDocumentColor(r, g, b)
                    }));
                }
                editor.sync_MarkerFormatCallback(false);
            }
        } else {
            if (false === IsColor) {
                this.HighlightColor = highlight_None;
            } else {
                this.HighlightColor = new CDocumentColor(r, g, b);
            }
        }
    },
    Set_ImageProps: function (Props) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Set_ImageProps(Props);
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                this.DrawingObjects.setProps(Props);
            } else {
                if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
                    this.Interface_Update_TablePr();
                    if (true == this.Selection.Use) {
                        this.Content[this.Selection.StartPos].Set_ImageProps(Props);
                    } else {
                        this.Content[this.CurPos.ContentPos].Set_ImageProps(Props);
                    }
                }
            }
        }
        this.Recalculate();
        this.Document_UpdateInterfaceState();
    },
    ShapeApply: function (shapeProps) {
        this.DrawingObjects.shapeApply(shapeProps);
    },
    Select_Drawings: function (DrawingArray, TargetContent) {
        if (DrawingArray.length === 1 && DrawingArray[0].Is_Inline()) {
            return;
        }
        this.DrawingObjects.resetSelection();
        var hdr_ftr = TargetContent.Is_HdrFtr(true);
        if (hdr_ftr) {
            hdr_ftr.Content.CurPos.Type = docpostype_DrawingObjects;
            hdr_ftr.Set_CurrentElement(false);
        } else {
            this.CurPos.Type = docpostype_DrawingObjects;
        }
        for (var i = 0; i < DrawingArray.length; ++i) {
            this.DrawingObjects.selectObject(DrawingArray[i].GraphicObj, 0);
        }
    },
    Set_TableProps: function (Props) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Set_TableProps(Props);
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                this.DrawingObjects.setTableProps(Props);
            } else {
                var Pos = -1;
                if (true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) {
                    Pos = this.Selection.StartPos;
                } else {
                    if (false === this.Selection.Use && type_Table === this.Content[this.CurPos.ContentPos].GetType()) {
                        Pos = this.CurPos.ContentPos;
                    }
                }
                if (-1 != Pos) {
                    var Table = this.Content[Pos];
                    Table.Set_Props(Props);
                }
            }
        }
        this.Recalculate();
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
        this.Document_UpdateSelectionState();
    },
    Get_Paragraph_ParaPr: function () {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Get_Paragraph_ParaPr();
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return this.DrawingObjects.getParagraphParaPr();
            } else {
                var Result_ParaPr = new CParaPr();
                if (true === this.Selection.Use && selectionflag_Common === this.Selection.Flag) {
                    var StartPos = this.Selection.StartPos;
                    var EndPos = this.Selection.EndPos;
                    if (EndPos < StartPos) {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos = Temp;
                    }
                    var StartPr, Pr;
                    if (type_Paragraph == this.Content[StartPos].GetType()) {
                        StartPr = this.Content[StartPos].Get_CompiledPr2(false).ParaPr;
                        Pr = StartPr.Copy();
                        Pr.Locked = this.Content[StartPos].Lock.Is_Locked();
                    } else {
                        if (type_Table == this.Content[StartPos].GetType()) {
                            StartPr = this.Content[StartPos].Get_Paragraph_ParaPr();
                            Pr = StartPr.Copy();
                            Pr.Locked = StartPr.Locked;
                        }
                    }
                    for (var Index = StartPos + 1; Index <= EndPos; Index++) {
                        var Item = this.Content[Index];
                        var TempPr;
                        if (type_Paragraph == Item.GetType()) {
                            TempPr = Item.Get_CompiledPr2(false).ParaPr;
                            TempPr.Locked = Item.Lock.Is_Locked();
                        } else {
                            if (type_Table == Item.GetType()) {
                                TempPr = Item.Get_Paragraph_ParaPr();
                            }
                        }
                        Pr = Pr.Compare(TempPr);
                    }
                    if (undefined === Pr.Ind.Left) {
                        Pr.Ind.Left = StartPr.Ind.Left;
                    }
                    if (undefined === Pr.Ind.Right) {
                        Pr.Ind.Right = StartPr.Ind.Right;
                    }
                    if (undefined === Pr.Ind.FirstLine) {
                        Pr.Ind.FirstLine = StartPr.Ind.FirstLine;
                    }
                    Result_ParaPr = Pr;
                    Result_ParaPr.CanAddTable = (true === Pr.Locked ? false : true);
                    if (undefined != Result_ParaPr.FramePr && type_Paragraph === this.Content[StartPos].GetType()) {
                        this.Content[StartPos].Supplement_FramePr(Result_ParaPr.FramePr);
                    } else {
                        if (StartPos === EndPos && StartPos > 0 && type_Paragraph === this.Content[StartPos - 1].GetType()) {
                            var PrevFrame = this.Content[StartPos - 1].Get_FramePr();
                            if (undefined != PrevFrame && undefined != PrevFrame.DropCap) {
                                Result_ParaPr.FramePr = PrevFrame.Copy();
                                this.Content[StartPos - 1].Supplement_FramePr(Result_ParaPr.FramePr);
                            }
                        }
                    }
                } else {
                    var Item = this.Content[this.CurPos.ContentPos];
                    if (type_Paragraph == Item.GetType()) {
                        var ParaPr = Item.Get_CompiledPr2(false).ParaPr;
                        var Locked = Item.Lock.Is_Locked();
                        Result_ParaPr = ParaPr.Copy();
                        Result_ParaPr.Locked = Locked;
                        Result_ParaPr.CanAddTable = ((true === Locked) ? ((true === Item.Cursor_IsEnd()) ? true : false) : true);
                        if (undefined != Result_ParaPr.FramePr) {
                            Item.Supplement_FramePr(Result_ParaPr.FramePr);
                        } else {
                            if (this.CurPos.ContentPos > 0 && type_Paragraph === this.Content[this.CurPos.ContentPos - 1].GetType()) {
                                var PrevFrame = this.Content[this.CurPos.ContentPos - 1].Get_FramePr();
                                if (undefined != PrevFrame && undefined != PrevFrame.DropCap) {
                                    Result_ParaPr.FramePr = PrevFrame.Copy();
                                    this.Content[this.CurPos.ContentPos - 1].Supplement_FramePr(Result_ParaPr.FramePr);
                                }
                            }
                        }
                    } else {
                        if (type_Table == Item.GetType()) {
                            Result_ParaPr = Item.Get_Paragraph_ParaPr();
                        }
                    }
                }
                if (Result_ParaPr.Shd && Result_ParaPr.Shd.Unifill) {
                    Result_ParaPr.Shd.Unifill.check(this.theme, this.Get_ColorMap());
                }
                return Result_ParaPr;
            }
        }
    },
    Get_Paragraph_TextPr: function () {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Get_Paragraph_TextPr();
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return this.DrawingObjects.getParagraphTextPr();
            } else {
                var Result_TextPr = null;
                if (true === this.Selection.Use) {
                    var VisTextPr;
                    switch (this.Selection.Flag) {
                    case selectionflag_Common:
                        var StartPos = this.Selection.StartPos;
                        var EndPos = this.Selection.EndPos;
                        if (EndPos < StartPos) {
                            var Temp = StartPos;
                            StartPos = EndPos;
                            EndPos = Temp;
                        }
                        VisTextPr = this.Content[StartPos].Get_Paragraph_TextPr();
                        for (var Index = StartPos + 1; Index <= EndPos; Index++) {
                            var CurPr = this.Content[Index].Get_Paragraph_TextPr();
                            VisTextPr = VisTextPr.Compare(CurPr);
                        }
                        break;
                    case selectionflag_Numbering:
                        if (null == this.Selection.Data || this.Selection.Data.length <= 0) {
                            break;
                        }
                        var CurPara = this.Content[this.Selection.Data[0]];
                        for (var Index = 0; Index < this.Selection.Data.length; Index++) {
                            if (this.CurPos.ContentPos === this.Selection.Data[Index]) {
                                CurPara = this.Content[this.Selection.Data[Index]];
                            }
                        }
                        VisTextPr = CurPara.Internal_Get_NumberingTextPr();
                        break;
                    }
                    Result_TextPr = VisTextPr;
                } else {
                    Result_TextPr = this.Content[this.CurPos.ContentPos].Get_Paragraph_TextPr();
                }
                return Result_TextPr;
            }
        }
    },
    Get_Paragraph_TextPr_Copy: function () {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Get_Paragraph_TextPr_Copy();
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return this.DrawingObjects.getParagraphTextPrCopy();
            } else {
                var Result_TextPr = null;
                if (true === this.Selection.Use) {
                    var VisTextPr;
                    switch (this.Selection.Flag) {
                    case selectionflag_Common:
                        var StartPos = this.Selection.StartPos;
                        if (this.Selection.EndPos < StartPos) {
                            StartPos = this.Selection.EndPos;
                        }
                        var Item = this.Content[StartPos];
                        VisTextPr = Item.Get_Paragraph_TextPr_Copy();
                        break;
                    case selectionflag_Numbering:
                        if (null == this.Selection.Data || this.Selection.Data.length <= 0) {
                            break;
                        }
                        var NumPr = this.Content[this.Selection.Data[0]].Numbering_Get();
                        VisTextPr = this.Numbering.Get_AbstractNum(NumPr.NumId).Lvl[NumPr.Lvl].TextPr;
                        break;
                    }
                    Result_TextPr = VisTextPr;
                } else {
                    var Item = this.Content[this.CurPos.ContentPos];
                    Result_TextPr = Item.Get_Paragraph_TextPr_Copy();
                }
                return Result_TextPr;
            }
        }
    },
    Get_Paragraph_ParaPr_Copy: function () {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Get_Paragraph_ParaPr_Copy();
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return this.DrawingObjects.getParagraphParaPrCopy();
            } else {
                var Result_ParaPr = null;
                if (true === this.Selection.Use) {
                    switch (this.Selection.Flag) {
                    case selectionflag_Common:
                        var StartPos = this.Selection.StartPos;
                        if (this.Selection.EndPos < StartPos) {
                            StartPos = this.Selection.EndPos;
                        }
                        var Item = this.Content[StartPos];
                        Result_ParaPr = Item.Get_Paragraph_ParaPr_Copy();
                        break;
                    case selectionflag_Numbering:
                        if (null == this.Selection.Data || this.Selection.Data.length <= 0) {
                            break;
                        }
                        var NumPr = this.Content[this.Selection.Data[0]].Numbering_Get();
                        Result_ParaPr = this.Numbering.Get_AbstractNum(NumPr.NumId).Lvl[NumPr.Lvl].ParaPr;
                        break;
                    }
                } else {
                    var Item = this.Content[this.CurPos.ContentPos];
                    Result_ParaPr = Item.Get_Paragraph_ParaPr_Copy();
                }
                return Result_ParaPr;
            }
        }
    },
    Get_AllParagraphs_ByNumbering: function (NumPr) {
        var ParaArray = [];
        this.SectionsInfo.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            var Element = this.Content[Index];
            Element.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
        }
        return ParaArray;
    },
    Get_PageSizesByDrawingObjects: function () {
        return this.DrawingObjects.getPageSizesByDrawingObjects();
    },
    Set_DocumentMargin: function (MarPr) {
        var CurPos = this.CurPos.ContentPos;
        var SectPr = this.SectionsInfo.Get_SectPr(CurPos).SectPr;
        var L = MarPr.Left;
        var T = MarPr.Top;
        var R = (undefined === MarPr.Right ? undefined : SectPr.Get_PageWidth() - MarPr.Right);
        var B = (undefined === MarPr.Bottom ? undefined : SectPr.Get_PageHeight() - MarPr.Bottom);
        SectPr.Set_PageMargins(L, T, R, B);
        this.ContentLastChangePos = 0;
        this.Recalculate();
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
    },
    Set_DocumentPageSize: function (W, H, bNoRecalc) {
        var CurPos = this.CurPos.ContentPos;
        var SectPr = this.SectionsInfo.Get_SectPr(CurPos).SectPr;
        SectPr.Set_PageSize(W, H);
        if (true != bNoRecalc) {
            this.ContentLastChangePos = 0;
            this.Recalculate();
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            this.Document_UpdateRulersState();
        }
    },
    Get_DocumentPageSize: function () {
        var CurPos = this.CurPos.ContentPos;
        var SectionInfoElement = this.SectionsInfo.Get_SectPr(CurPos);
        if (undefined === SectionInfoElement) {
            return true;
        }
        var SectPr = SectionInfoElement.SectPr;
        return {
            W: SectPr.Get_PageWidth(),
            H: SectPr.Get_PageHeight()
        };
    },
    Set_DocumentOrientation: function (Orientation, bNoRecalc) {
        var CurPos = this.CurPos.ContentPos;
        var SectPr = this.SectionsInfo.Get_SectPr(CurPos).SectPr;
        SectPr.Set_Orientation(Orientation, true);
        if (true != bNoRecalc) {
            this.Recalculate();
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            this.Document_UpdateRulersState();
        }
    },
    Get_DocumentOrientation: function () {
        var CurPos = this.CurPos.ContentPos;
        var SectionInfoElement = this.SectionsInfo.Get_SectPr(CurPos);
        if (undefined === SectionInfoElement) {
            return true;
        }
        var SectPr = SectionInfoElement.SectPr;
        return (SectPr.Get_Orientation() === orientation_Portrait ? true : false);
    },
    Set_DocumentDefaultTab: function (DTab) {
        this.History.Add(this, {
            Type: historyitem_Document_DefaultTab,
            Old: Default_Tab_Stop,
            New: DTab
        });
        Default_Tab_Stop = DTab;
    },
    Set_DocumentEvenAndOddHeaders: function (Value) {
        if (Value !== EvenAndOddHeaders) {
            this.History.Add(this, {
                Type: historyitem_Document_EvenAndOddHeaders,
                Old: EvenAndOddHeaders,
                New: Value
            });
            EvenAndOddHeaders = Value;
        }
    },
    Interface_Update_ParaPr: function () {
        var ParaPr = this.Get_Paragraph_ParaPr();
        if (null != ParaPr) {
            ParaPr.CanAddDropCap = false;
            if (docpostype_Content === this.CurPos.Type) {
                var Para = null;
                if (false === this.Selection.Use && type_Paragraph === this.Content[this.CurPos.ContentPos].GetType()) {
                    Para = this.Content[this.CurPos.ContentPos];
                } else {
                    if (true === this.Selection.Use && this.Selection.StartPos <= this.Selection.EndPos && type_Paragraph === this.Content[this.Selection.StartPos].GetType()) {
                        Para = this.Content[this.Selection.StartPos];
                    } else {
                        if (true === this.Selection.Use && this.Selection.StartPos > this.Selection.EndPos && type_Paragraph === this.Content[this.Selection.EndPos].GetType()) {
                            Para = this.Content[this.Selection.EndPos];
                        }
                    }
                }
                if (null != Para && undefined === Para.Get_FramePr()) {
                    var Prev = Para.Get_DocumentPrev();
                    if ((null === Prev || type_Paragraph != Prev.GetType() || undefined === Prev.Get_FramePr() || undefined === Prev.Get_FramePr().DropCap) && true === Para.Can_AddDropCap()) {
                        ParaPr.CanAddDropCap = true;
                    }
                }
            }
            var oSelectedInfo = this.Get_SelectedElementsInfo();
            var Math = oSelectedInfo.Get_Math();
            if (null !== Math) {
                ParaPr.CanAddImage = false;
            } else {
                ParaPr.CanAddImage = true;
            }
            if (undefined != ParaPr.Tabs) {
                editor.Update_ParaTab(Default_Tab_Stop, ParaPr.Tabs);
            }
            if (ParaPr.Shd && ParaPr.Shd.Unifill) {
                ParaPr.Shd.Unifill.check(this.theme, this.Get_ColorMap());
            }
            var SelectedInfo = this.Get_SelectedElementsInfo();
            var Math = SelectedInfo.Get_Math();
            if (null !== Math && true !== Math.Is_Inline()) {
                ParaPr.Jc = Math.Get_Align();
            }
            editor.UpdateParagraphProp(ParaPr);
        }
    },
    Interface_Update_TextPr: function () {
        var TextPr = this.Get_Paragraph_TextPr();
        if (null != TextPr) {
            var theme = this.Get_Theme();
            if (theme && theme.themeElements && theme.themeElements.fontScheme) {
                if (TextPr.FontFamily) {
                    TextPr.FontFamily.Name = theme.themeElements.fontScheme.checkFont(TextPr.FontFamily.Name);
                }
                if (TextPr.RFonts) {
                    if (TextPr.RFonts.Ascii) {
                        TextPr.RFonts.Ascii.Name = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.Ascii.Name);
                    }
                    if (TextPr.RFonts.EastAsia) {
                        TextPr.RFonts.EastAsia.Name = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.EastAsia.Name);
                    }
                    if (TextPr.RFonts.HAnsi) {
                        TextPr.RFonts.HAnsi.Name = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.HAnsi.Name);
                    }
                    if (TextPr.RFonts.CS) {
                        TextPr.RFonts.CS.Name = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.CS.Name);
                    }
                }
            }
            if (TextPr.Unifill) {
                var RGBAColor = TextPr.Unifill.getRGBAColor();
                TextPr.Color = new CDocumentColor(RGBAColor.R, RGBAColor.G, RGBAColor.B, false);
            }
            if (TextPr.Shd && TextPr.Shd.Unifill) {
                TextPr.Shd.Unifill.check(this.theme, this.Get_ColorMap());
            }
            editor.UpdateTextPr(TextPr);
        }
    },
    Interface_Update_DrawingPr: function (Flag) {
        var DrawingPr = this.DrawingObjects.Get_Props();
        if (true === Flag) {
            return DrawingPr;
        } else {
            for (var i = 0; i < DrawingPr.length; ++i) {
                editor.sync_ImgPropCallback(DrawingPr[i]);
            }
        }
        if (Flag) {
            return null;
        }
    },
    Interface_Update_TablePr: function (Flag) {
        var TablePr = null;
        if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
            if (true == this.Selection.Use) {
                TablePr = this.Content[this.Selection.StartPos].Get_Props();
            } else {
                TablePr = this.Content[this.CurPos.ContentPos].Get_Props();
            }
        }
        TablePr.CanBeFlow = true;
        if (true === Flag) {
            return TablePr;
        } else {
            if (null != TablePr) {
                editor.sync_TblPropCallback(TablePr);
            }
        }
    },
    Interface_Update_HdrFtrPr: function () {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            editor.sync_HeadersAndFootersPropCallback(this.HdrFtr.Get_Props());
        }
    },
    Internal_GetContentPosByXY: function (X, Y, PageNum) {
        if ("undefined" === typeof(PageNum)) {
            PageNum = this.CurPage;
        }
        var FlowTable = this.DrawingObjects.getTableByXY(X, Y, PageNum, this);
        if (null != FlowTable) {
            if (flowobject_Table === FlowTable.Get_Type()) {
                return FlowTable.Table.Index;
            } else {
                var Frame = FlowTable;
                var StartPos = Frame.StartIndex;
                var FlowCount = Frame.FlowCount;
                for (var Pos = StartPos; Pos < StartPos + FlowCount; Pos++) {
                    var Item = this.Content[Pos];
                    if (Y < Item.Pages[0].Bounds.Bottom) {
                        return Pos;
                    }
                }
                return StartPos + FlowCount - 1;
            }
        }
        var SectCount = this.Pages[PageNum].EndSectionParas.length;
        for (var Index = 0; Index < SectCount; Index++) {
            var Item = this.Pages[PageNum].EndSectionParas[Index];
            var Bounds = Item.Pages[0].Bounds;
            if (Y < Bounds.Bottom && Y > Bounds.Top && X > Bounds.Left && X < Bounds.Right) {
                return Item.Index;
            }
        }
        var StartPos = this.Pages[PageNum].Pos;
        var EndPos = Math.min(this.Pages[PageNum].EndPos, this.Content.length - 1);
        var InlineElements = [];
        for (var Index = StartPos; Index <= EndPos; Index++) {
            var Item = this.Content[Index];
            var PrevItem = Item.Get_DocumentPrev();
            var bEmptySectPara = (type_Paragraph === Item.GetType() && undefined !== Item.Get_SectionPr() && true === Item.IsEmpty() && null !== PrevItem && (type_Table === PrevItem.GetType() || undefined === PrevItem.Get_SectionPr())) ? true : false;
            if (false != Item.Is_Inline() && (type_Table === Item.GetType() || false === bEmptySectPara)) {
                InlineElements.push(Index);
            }
        }
        var Count = InlineElements.length;
        if (Count <= 0) {
            return StartPos;
        }
        for (var Pos = 0; Pos < Count - 1; Pos++) {
            var Item = this.Content[InlineElements[Pos + 1]];
            if (Y < Item.Pages[0].Bounds.Top) {
                return InlineElements[Pos];
            }
            if (Item.Pages.length > 1) {
                if ((type_Paragraph === Item.GetType() && Item.Pages[0].FirstLine != Item.Pages[1].FirstLine) || (type_Table === Item.GetType() && true === Item.RowsInfo[0].FirstPage)) {
                    return InlineElements[Pos + 1];
                }
                return InlineElements[Pos];
            }
            if (Pos === Count - 2) {
                return InlineElements[Count - 1];
            }
        }
        return InlineElements[0];
    },
    Selection_Remove: function () {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Selection_Remove();
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var ParaDrawing = this.DrawingObjects.getMajorParaDrawing();
                if (ParaDrawing) {
                    ParaDrawing.GoTo_Text(undefined, false);
                }
                return this.DrawingObjects.resetSelection();
            } else {
                if (docpostype_Content === this.CurPos.Type) {
                    if (true === this.Selection.Use) {
                        switch (this.Selection.Flag) {
                        case selectionflag_Common:
                            var Start = this.Selection.StartPos;
                            var End = this.Selection.EndPos;
                            if (Start > End) {
                                var Temp = Start;
                                Start = End;
                                End = Temp;
                            }
                            Start = Math.max(0, Start);
                            End = Math.min(this.Content.length - 1, End);
                            for (var Index = Start; Index <= End; Index++) {
                                this.Content[Index].Selection_Remove();
                            }
                            this.Selection.Use = false;
                            this.Selection.Start = false;
                            this.Selection.StartPos = 0;
                            this.Selection.EndPos = 0;
                            this.DrawingDocument.SelectEnabled(false);
                            this.DrawingDocument.TargetStart();
                            this.DrawingDocument.TargetShow();
                            break;
                        case selectionflag_Numbering:
                            if (null == this.Selection.Data) {
                                break;
                            }
                            for (var Index = 0; Index < this.Selection.Data.length; Index++) {
                                this.Content[this.Selection.Data[Index]].Selection_Remove();
                            }
                            this.Selection.Use = false;
                            this.Selection.Start = false;
                            this.Selection.Flag = selectionflag_Common;
                            this.DrawingDocument.SelectEnabled(false);
                            this.DrawingDocument.TargetStart();
                            this.DrawingDocument.TargetShow();
                            break;
                        }
                    }
                }
            }
        }
    },
    Selection_IsEmpty: function (bCheckHidden) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Selection_IsEmpty(bCheckHidden);
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return false;
            } else {
                if (true === this.Selection.Use) {
                    if (selectionflag_Numbering == this.Selection.Flag) {
                        return false;
                    } else {
                        if (true === this.Selection_Is_TableBorderMove()) {
                            return false;
                        } else {
                            if (this.Selection.StartPos === this.Selection.EndPos) {
                                return this.Content[this.Selection.StartPos].Selection_IsEmpty(bCheckHidden);
                            } else {
                                return false;
                            }
                        }
                    }
                }
                return true;
            }
        }
    },
    Selection_Draw_Page: function (Page_abs) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Selection_Draw_Page(Page_abs);
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                this.DrawingObjects.drawSelectionPage(Page_abs);
            } else {
                var Pos_start = this.Pages[Page_abs].Pos;
                var Pos_end = this.Pages[Page_abs].EndPos;
                if (true === this.Selection.Use) {
                    switch (this.Selection.Flag) {
                    case selectionflag_Common:
                        var Start = this.Selection.StartPos;
                        var End = this.Selection.EndPos;
                        if (Start > End) {
                            Start = this.Selection.EndPos;
                            End = this.Selection.StartPos;
                        }
                        var Start = Math.max(Start, Pos_start);
                        var End = Math.min(End, Pos_end);
                        for (var Index = Start; Index <= End; Index++) {
                            this.Content[Index].Selection_Draw_Page(Page_abs);
                        }
                        if (Page_abs >= 2 && End < this.Pages[Page_abs - 2].EndPos) {
                            this.Selection.UpdateOnRecalc = false;
                            this.DrawingDocument.OnSelectEnd();
                        }
                        break;
                    case selectionflag_Numbering:
                        if (null == this.Selection.Data) {
                            break;
                        }
                        var Count = this.Selection.Data.length;
                        for (var Index = 0; Index < Count; Index++) {
                            if (this.Selection.Data[Index] <= Pos_end && this.Selection.Data[Index] >= Pos_start) {
                                this.Content[this.Selection.Data[Index]].Selection_Draw_Page(Page_abs);
                            }
                        }
                        if (Page_abs >= 2 && this.Selection.Data[this.Selection.Data.length - 1] < this.Pages[Page_abs - 2].EndPos) {
                            this.Selection.UpdateOnRecalc = false;
                            this.DrawingDocument.OnSelectEnd();
                        }
                        break;
                    }
                }
            }
        }
    },
    Get_SelectionBounds: function () {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.CurHdrFtr.Content.Get_SelectionBounds();
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return this.DrawingObjects.Get_SelectionBounds();
            } else {
                if (true === this.Selection.Use && selectionflag_Common === this.Selection.Flag) {
                    var Start = this.Selection.StartPos;
                    var End = this.Selection.EndPos;
                    if (Start > End) {
                        Start = this.Selection.EndPos;
                        End = this.Selection.StartPos;
                    }
                    if (Start === End) {
                        return this.Content[Start].Get_SelectionBounds();
                    } else {
                        var Result = {};
                        Result.Start = this.Content[Start].Get_SelectionBounds().Start;
                        Result.End = this.Content[End].Get_SelectionBounds().End;
                        Result.Direction = (this.Selection.StartPos > this.Selection.EndPos ? -1 : 1);
                        return Result;
                    }
                }
            }
        }
        return null;
    },
    Selection_Clear: function () {
        if (true === this.Selection.Use) {
            switch (this.Selection.Flag) {
            case selectionflag_Common:
                var Start = this.Selection.StartPos;
                var End = this.Selection.EndPos;
                if (Start > End) {
                    var Temp = Start;
                    Start = End;
                    End = Temp;
                }
                for (var Index = Start; Index <= End; Index++) {
                    this.Content[Index].Selection_Clear();
                }
                break;
            case selectionflag_Numbering:
                if (null == this.Selection.Data) {
                    break;
                }
                for (var Index = 0; Index < this.Selection.Data.length; Index++) {
                    this.Content[this.Selection.Data[Index]].Selection_Clear();
                }
                break;
            }
        }
        this.DrawingDocument.SelectClear();
    },
    Selection_SetStart: function (X, Y, MouseEvent) {
        var bInText = (null === this.Is_InText(X, Y, this.CurPage) ? false : true);
        var bTableBorder = (null === this.Is_TableBorder(X, Y, this.CurPage) ? false : true);
        var nInDrawing = this.DrawingObjects.isPointInDrawingObjects(X, Y, this.CurPage, this);
        var bFlowTable = (null === this.DrawingObjects.getTableByXY(X, Y, this.CurPage, this) ? false : true);
        if (-1 !== this.Selection.DragDrop.Flag && MouseEvent.ClickCount <= 1 && false === bTableBorder && (nInDrawing < 0 || (nInDrawing === DRAWING_ARRAY_TYPE_BEHIND && true === bInText) || (nInDrawing > -1 && (docpostype_DrawingObjects === this.CurPos.Type || (docpostype_HdrFtr === this.CurPos.Type && docpostype_DrawingObjects === this.HdrFtr.CurHdrFtr.Content.CurPos.Type)) && true === this.DrawingObjects.isSelectedText() && null !== this.DrawingObjects.getMajorParaDrawing() && this.DrawingObjects.getGraphicInfoUnderCursor(this.CurPage, X, Y).cursorType === "text")) && true === this.Selection_Check(X, Y, this.CurPage, undefined)) {
            this.Selection.DragDrop.Flag = 1;
            this.Selection.DragDrop.Data = {
                X: X,
                Y: Y,
                PageNum: this.CurPage
            };
            return;
        }
        var bCheckHdrFtr = true;
        if (docpostype_HdrFtr === this.CurPos.Type) {
            bCheckHdrFtr = false;
            this.Selection.Start = true;
            this.Selection.Use = true;
            if (false != this.HdrFtr.Selection_SetStart(X, Y, this.CurPage, MouseEvent, false)) {
                return;
            }
            this.Selection.Start = false;
            this.Selection.Use = false;
            this.DrawingDocument.ClearCachePages();
            this.DrawingDocument.FirePaint();
            this.DrawingDocument.EndTrackTable(null, true);
        }
        var PageMetrics = this.Get_PageContentStartPos(this.CurPage, this.Pages[this.CurPage].Pos);
        if (true != bFlowTable && nInDrawing < 0 && true === bCheckHdrFtr && MouseEvent.ClickCount >= 2 && (Y <= PageMetrics.Y || Y > PageMetrics.YLimit)) {
            if (true === this.Selection.Use) {
                this.Selection_Remove();
            }
            this.CurPos.Type = docpostype_HdrFtr;
            MouseEvent.ClickCount = 1;
            this.HdrFtr.Selection_SetStart(X, Y, this.CurPage, MouseEvent, true);
            this.Interface_Update_HdrFtrPr();
            this.DrawingDocument.ClearCachePages();
            this.DrawingDocument.FirePaint();
            this.DrawingDocument.EndTrackTable(null, true);
        } else {
            if (nInDrawing === DRAWING_ARRAY_TYPE_BEFORE || nInDrawing === DRAWING_ARRAY_TYPE_INLINE || (false === bTableBorder && false === bInText && nInDrawing >= 0)) {
                if (docpostype_DrawingObjects != this.CurPos.Type) {
                    this.Selection_Remove();
                }
                this.DrawingDocument.TargetEnd();
                this.DrawingDocument.SetCurrentPage(this.CurPage);
                this.Selection.Use = true;
                this.Selection.Start = true;
                this.Selection.Flag = selectionflag_Common;
                this.CurPos.Type = docpostype_DrawingObjects;
                this.DrawingObjects.OnMouseDown(MouseEvent, X, Y, this.CurPage);
            } else {
                var bOldSelectionIsCommon = true;
                if (docpostype_DrawingObjects === this.CurPos.Type && true != this.Is_InDrawing(X, Y, this.CurPage)) {
                    this.DrawingObjects.resetSelection();
                    bOldSelectionIsCommon = false;
                }
                var ContentPos = this.Internal_GetContentPosByXY(X, Y);
                if (docpostype_Content != this.CurPos.Type) {
                    this.CurPos.Type = docpostype_Content;
                    this.CurPos.ContentPos = ContentPos;
                    bOldSelectionIsCommon = false;
                }
                var SelectionUse_old = this.Selection.Use;
                var Item = this.Content[ContentPos];
                var bTableBorder = false;
                if (type_Table == Item.GetType()) {
                    bTableBorder = (null === Item.Is_TableBorder(X, Y, this.CurPage) ? false : true);
                }
                if (! (true === SelectionUse_old && true === MouseEvent.ShiftKey && true === bOldSelectionIsCommon)) {
                    if ((selectionflag_Common != this.Selection.Flag) || (true === this.Selection.Use && MouseEvent.ClickCount <= 1 && true != bTableBorder)) {
                        this.Selection_Remove();
                    }
                }
                this.Selection.Use = true;
                this.Selection.Start = true;
                this.Selection.Flag = selectionflag_Common;
                if (true === SelectionUse_old && true === MouseEvent.ShiftKey && true === bOldSelectionIsCommon) {
                    this.Selection_SetEnd(X, Y, {
                        Type: g_mouse_event_type_up,
                        ClickCount: 1
                    });
                    this.Selection.Use = true;
                    this.Selection.Start = true;
                    this.Selection.EndPos = ContentPos;
                    this.Selection.Data = null;
                } else {
                    Item.Selection_SetStart(X, Y, this.CurPage, MouseEvent, bTableBorder);
                    Item.Selection_SetEnd(X, Y, this.CurPage, {
                        Type: g_mouse_event_type_move,
                        ClickCount: 1
                    },
                    bTableBorder);
                    if (! (type_Table == Item.GetType() && true == bTableBorder)) {
                        this.Selection.Use = true;
                        this.Selection.StartPos = ContentPos;
                        this.Selection.EndPos = ContentPos;
                        this.Selection.Data = null;
                        this.CurPos.ContentPos = ContentPos;
                        if (type_Paragraph === Item.GetType() && true === MouseEvent.CtrlKey) {
                            var Hyperlink = Item.Check_Hyperlink(X, Y, this.CurPage);
                            if (null != Hyperlink) {
                                this.Selection.Data = {
                                    Hyperlink: true,
                                    Value: Hyperlink
                                };
                            }
                        }
                    } else {
                        this.Selection.Data = {
                            TableBorder: true,
                            Pos: ContentPos,
                            Selection: SelectionUse_old
                        };
                    }
                }
            }
        }
    },
    Selection_SetEnd: function (X, Y, MouseEvent) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Selection_SetEnd(X, Y, this.CurPage, MouseEvent);
            if (g_mouse_event_type_up == MouseEvent.Type) {
                if (true != this.DrawingObjects.isPolylineAddition()) {
                    this.Selection.Start = false;
                } else {
                    this.Selection.Start = true;
                }
            }
            return;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                if (g_mouse_event_type_up == MouseEvent.Type) {
                    this.DrawingObjects.OnMouseUp(MouseEvent, X, Y, this.CurPage);
                    if (true != this.DrawingObjects.isPolylineAddition()) {
                        this.Selection.Start = false;
                        this.Selection.Use = true;
                    } else {
                        this.Selection.Start = true;
                        this.Selection.Use = true;
                    }
                } else {
                    this.DrawingObjects.OnMouseMove(MouseEvent, X, Y, this.CurPage);
                }
                return;
            }
        }
        if (true === this.Selection_Is_TableBorderMove()) {
            var Item = this.Content[this.Selection.Data.Pos];
            Item.Selection_SetEnd(X, Y, this.CurPage, MouseEvent, true);
            if (g_mouse_event_type_up == MouseEvent.Type) {
                this.Selection.Start = false;
                if (true != this.Selection.Data.Selection) {
                    this.Selection.Use = false;
                }
                this.Selection.Data = null;
            }
            return;
        }
        if (false === this.Selection.Use) {
            return;
        }
        var ContentPos = this.Internal_GetContentPosByXY(X, Y);
        var OldPos = this.CurPos.ContentPos;
        var OldInnerPos = null;
        if (type_Paragraph === this.Content[OldPos].GetType()) {
            OldInnerPos = this.Content[OldPos].CurPos.ContentPos;
        } else {
            OldInnerPos = this.Content[OldPos].CurCell;
        }
        this.CurPos.ContentPos = ContentPos;
        var OldEndPos = this.Selection.EndPos;
        this.Selection.EndPos = ContentPos;
        if (OldEndPos < this.Selection.StartPos && OldEndPos < this.Selection.EndPos) {
            var TempLimit = Math.min(this.Selection.StartPos, this.Selection.EndPos);
            for (var Index = OldEndPos; Index < TempLimit; Index++) {
                this.Content[Index].Selection.Use = false;
                this.Content[Index].Selection.Start = false;
            }
        } else {
            if (OldEndPos > this.Selection.StartPos && OldEndPos > this.Selection.EndPos) {
                var TempLimit = Math.max(this.Selection.StartPos, this.Selection.EndPos);
                for (var Index = TempLimit + 1; Index <= OldEndPos; Index++) {
                    this.Content[Index].Selection.Use = false;
                    this.Content[Index].Selection.Start = false;
                }
            }
        }
        var Direction = (ContentPos > this.Selection.StartPos ? 1 : (ContentPos < this.Selection.StartPos ? -1 : 0));
        if (g_mouse_event_type_up == MouseEvent.Type) {
            this.Selection.Start = false;
            if (0 != Direction) {
                this.Content[this.Selection.StartPos].Selection_Stop(X, Y, this.CurPage, MouseEvent);
            }
        }
        var Start, End;
        if (0 == Direction) {
            var Item = this.Content[this.Selection.StartPos];
            var ItemType = Item.GetType();
            Item.Selection_SetEnd(X, Y, this.CurPage, MouseEvent);
            if (false === Item.Selection.Use) {
                this.Selection.Use = false;
                if (null != this.Selection.Data && true === this.Selection.Data.Hyperlink) {
                    editor.sync_HyperlinkClickCallback(this.Selection.Data.Value.Get_Value());
                    this.Selection.Data.Value.Set_Visited(true);
                    for (var PageIdx = Item.Get_StartPage_Absolute(); PageIdx < Item.Get_StartPage_Absolute() + Item.Pages.length; PageIdx++) {
                        this.DrawingDocument.OnRecalculatePage(PageIdx, this.Pages[PageIdx]);
                    }
                    this.DrawingDocument.OnEndRecalculate(false, true);
                }
            } else {
                this.Selection.Use = true;
            }
            return;
        } else {
            if (Direction > 0) {
                Start = this.Selection.StartPos;
                End = this.Selection.EndPos;
            } else {
                End = this.Selection.StartPos;
                Start = this.Selection.EndPos;
            }
        }
        for (var Index = Start; Index <= End; Index++) {
            var Item = this.Content[Index];
            Item.Selection.Use = true;
            var ItemType = Item.GetType();
            switch (Index) {
            case Start:
                if (type_Paragraph === ItemType) {
                    Item.Selection_SetBegEnd((Direction > 0 ? false : true), false);
                } else {
                    var Row = Item.Content.length - 1;
                    var Cell = Item.Content[Row].Get_CellsCount() - 1;
                    var Pos = {
                        Row: Row,
                        Cell: Cell
                    };
                    if (Direction > 0) {
                        Item.Selection.EndPos.Pos = Pos;
                    } else {
                        Item.Selection.StartPos.Pos = Pos;
                    }
                    Item.Internal_Selection_UpdateCells();
                }
                break;
            case End:
                if (type_Paragraph === ItemType) {
                    Item.Selection_SetBegEnd((Direction > 0 ? true : false), true);
                } else {
                    var Pos = {
                        Row: 0,
                        Cell: 0
                    };
                    if (Direction > 0) {
                        Item.Selection.StartPos.Pos = Pos;
                    } else {
                        Item.Selection.EndPos.Pos = Pos;
                    }
                    Item.Internal_Selection_UpdateCells();
                }
                break;
            default:
                if (type_Paragraph === ItemType) {
                    Item.Select_All(Direction);
                } else {
                    var Row = Item.Content.length - 1;
                    var Cell = Item.Content[Row].Get_CellsCount() - 1;
                    var Pos0 = {
                        Row: 0,
                        Cell: 0
                    };
                    var Pos1 = {
                        Row: Row,
                        Cell: Cell
                    };
                    if (Direction > 0) {
                        Item.Selection.StartPos.Pos = Pos0;
                        Item.Selection.EndPos.Pos = Pos1;
                    } else {
                        Item.Selection.EndPos.Pos = Pos0;
                        Item.Selection.StartPos.Pos = Pos1;
                    }
                    Item.Internal_Selection_UpdateCells();
                }
                break;
            }
        }
        this.Content[ContentPos].Selection_SetEnd(X, Y, this.CurPage, MouseEvent);
        if (true === this.Content[End].Selection_IsEmpty() && true === this.CheckEmptyElementsOnSelection) {
            this.Content[End].Selection_Remove();
            End--;
        }
        if (Start != End && true === this.Content[Start].Selection_IsEmpty() && true === this.CheckEmptyElementsOnSelection) {
            this.Content[Start].Selection_Remove();
            Start++;
        }
        if (Direction > 0) {
            this.Selection.StartPos = Start;
            this.Selection.EndPos = End;
        } else {
            this.Selection.StartPos = End;
            this.Selection.EndPos = Start;
        }
    },
    Selection_Is_OneElement: function () {
        if (true === this.Selection.Use && this.CurPos.Type === docpostype_Content && this.Selection.Flag === selectionflag_Common && this.Selection.StartPos === this.Selection.EndPos) {
            return 0;
        }
        return (this.Selection.StartPos < this.Selection.EndPos ? 1 : -1);
    },
    Selection_Is_TableBorderMove: function () {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Selection_Is_TableBorderMove();
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return this.DrawingObjects.selectionIsTableBorder();
            } else {
                if (null != this.Selection.Data && true === this.Selection.Data.TableBorder && type_Table == this.Content[this.Selection.Data.Pos].GetType()) {
                    return true;
                }
            }
        }
        return false;
    },
    Selection_Check: function (X, Y, Page_Abs, NearPos) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Selection_Check(X, Y, Page_Abs, NearPos);
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return this.DrawingObjects.selectionCheck(X, Y, Page_Abs, NearPos);
            } else {
                if (true === this.Selection.Use) {
                    switch (this.Selection.Flag) {
                    case selectionflag_Common:
                        var Start = this.Selection.StartPos;
                        var End = this.Selection.EndPos;
                        if (Start > End) {
                            Start = this.Selection.EndPos;
                            End = this.Selection.StartPos;
                        }
                        if (undefined !== NearPos) {
                            for (var Index = Start; Index <= End; Index++) {
                                if (true === this.Content[Index].Selection_Check(0, 0, 0, NearPos)) {
                                    return true;
                                }
                            }
                            return false;
                        } else {
                            var ContentPos = this.Internal_GetContentPosByXY(X, Y, Page_Abs, NearPos);
                            if (ContentPos > Start && ContentPos < End) {
                                return true;
                            } else {
                                if (ContentPos < Start || ContentPos > End) {
                                    return false;
                                } else {
                                    return this.Content[ContentPos].Selection_Check(X, Y, Page_Abs, undefined);
                                }
                            }
                            return false;
                        }
                    case selectionflag_Numbering:
                        return false;
                    }
                    return false;
                }
                return false;
            }
        }
    },
    Select_All: function () {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Select_All();
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type && true === this.DrawingObjects.isSelectedText()) {
                this.DrawingObjects.selectAll();
            } else {
                if (true === this.Selection.Use) {
                    this.Selection_Remove();
                }
                this.DrawingDocument.SelectEnabled(true);
                this.DrawingDocument.TargetEnd();
                this.CurPos.Type = docpostype_Content;
                this.Selection.Use = true;
                this.Selection.Start = false;
                this.Selection.Flag = selectionflag_Common;
                this.Selection.StartPos = 0;
                this.Selection.EndPos = this.Content.length - 1;
                for (var Index = 0; Index < this.Content.length; Index++) {
                    this.Content[Index].Select_All();
                }
            }
        }
        this.Selection.Start = true;
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
        this.Selection.Start = false;
        this.Document_UpdateCopyCutState();
    },
    On_DragTextEnd: function (NearPos, bCopy) {
        if (true === this.Comments.Is_Use()) {
            this.Select_Comment(null, false);
            editor.sync_HideComment();
        }
        if (true === this.Selection_Check(0, 0, 0, NearPos)) {
            this.Selection_Remove();
            var Paragraph = NearPos.Paragraph;
            Paragraph.Cursor_MoveToNearPos(NearPos);
            Paragraph.Document_SetThisElementCurrent(false);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            this.Document_UpdateRulersState();
        } else {
            History.Create_NewPoint(historydescription_Document_DragText);
            NearPos.Paragraph.Check_NearestPos(NearPos);
            var DocContent = this.Get_SelectedContent(true);
            if (false === this.Can_InsertContent(DocContent, NearPos)) {
                History.Remove_LastPoint();
                return;
            }
            var Para = NearPos.Paragraph;
            var CheckChangesType = (true !== bCopy ? changestype_Document_Content : changestype_None);
            if (false === this.Document_Is_SelectionLocked(CheckChangesType, {
                Type: changestype_2_ElementsArray_and_Type,
                Elements: [Para],
                CheckType: changestype_Paragraph_Content
            })) {
                if (true !== bCopy) {
                    this.TurnOff_Recalculate();
                    this.TurnOff_InterfaceEvents();
                    this.Remove(1, false, false, false);
                    this.TurnOn_Recalculate(false);
                    this.TurnOn_InterfaceEvents(false);
                    if (false === Para.Is_UseInDocument()) {
                        this.Document_Undo();
                        History.Clear_Redo();
                        return;
                    }
                }
                this.Selection_Remove();
                Para.Parent.Insert_Content(DocContent, NearPos);
                this.Recalculate();
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                this.Document_UpdateRulersState();
            } else {
                History.Remove_LastPoint();
            }
        }
    },
    Get_SelectedContent: function (bUseHistory) {
        var bNeedTurnOffHistory = (History.Is_On() && true !== bUseHistory);
        var bNeedTurnOffTableId = g_oTableId.m_bTurnOff === false && true !== bUseHistory;
        if (bNeedTurnOffHistory) {
            History.TurnOff();
        }
        if (bNeedTurnOffTableId) {
            g_oTableId.m_bTurnOff = true;
        }
        var SelectedContent = new CSelectedContent();
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Get_SelectedContent(SelectedContent);
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                this.DrawingObjects.Get_SelectedContent(SelectedContent);
            } else {
                if (true !== this.Selection.Use || this.Selection.Flag !== selectionflag_Common) {
                    if (bNeedTurnOffHistory) {
                        History.TurnOn();
                    }
                    if (bNeedTurnOffTableId) {
                        g_oTableId.m_bTurnOff = false;
                    }
                    return null;
                }
                var StartPos = this.Selection.StartPos;
                var EndPos = this.Selection.EndPos;
                if (StartPos > EndPos) {
                    StartPos = this.Selection.EndPos;
                    EndPos = this.Selection.StartPos;
                }
                for (var Index = StartPos; Index <= EndPos; Index++) {
                    this.Content[Index].Get_SelectedContent(SelectedContent);
                }
            }
        }
        SelectedContent.On_EndCollectElements(this, bNeedTurnOffHistory);
        if (bNeedTurnOffHistory) {
            History.TurnOn();
        }
        if (bNeedTurnOffTableId) {
            g_oTableId.m_bTurnOff = false;
        }
        return SelectedContent;
    },
    Can_InsertContent: function (SelectedContent, NearPos) {
        if (SelectedContent.Elements.length <= 0) {
            return false;
        }
        var Para = NearPos.Paragraph;
        if (true === Para.Parent.Is_DrawingShape() && true === SelectedContent.HaveShape) {
            return false;
        }
        if (Para.bFromDocument === false && (SelectedContent.DrawingObjects.length > 0 || SelectedContent.HaveMath)) {
            return false;
        }
        var ParaNearPos = NearPos.Paragraph.Get_ParaNearestPos(NearPos);
        if (null === ParaNearPos || ParaNearPos.Classes.length < 2) {
            return false;
        }
        var LastClass = ParaNearPos.Classes[ParaNearPos.Classes.length - 1];
        if (para_Math_Run === LastClass.Type) {
            var Element = SelectedContent.Elements[0].Element;
            if (1 !== SelectedContent.Elements.length || type_Paragraph !== Element.Get_Type() || null === LastClass.Parent) {
                return false;
            }
            var Math = null;
            var Count = Element.Content.length;
            for (var Index = 0; Index < Count; Index++) {
                var Item = Element.Content[Index];
                if (para_Math === Item.Type && null === Math) {
                    Math = Element.Content[Index];
                } else {
                    if (true !== Item.Is_Empty({
                        SkipEnd: true
                    })) {
                        return false;
                    }
                }
            }
        } else {
            if (para_Run !== LastClass.Type) {
                return false;
            }
        }
        if (null === Para.Parent || undefined === Para.Parent) {
            return false;
        }
        return true;
    },
    Insert_Content: function (SelectedContent, NearPos) {
        var Para = NearPos.Paragraph;
        var ParaNearPos = Para.Get_ParaNearestPos(NearPos);
        var LastClass = ParaNearPos.Classes[ParaNearPos.Classes.length - 1];
        if (para_Math_Run === LastClass.Type) {
            var MathRun = LastClass;
            var NewMathRun = MathRun.Split(ParaNearPos.NearPos.ContentPos, ParaNearPos.Classes.length - 1);
            var MathContent = ParaNearPos.Classes[ParaNearPos.Classes.length - 2];
            var MathContentPos = ParaNearPos.NearPos.ContentPos.Data[ParaNearPos.Classes.length - 2];
            var Element = SelectedContent.Elements[0].Element;
            var InsertMathContent = null;
            for (var nPos = 0, nParaLen = Element.Content.length; nPos < nParaLen; nPos++) {
                if (para_Math === Element.Content[nPos].Type) {
                    InsertMathContent = Element.Content[nPos];
                    break;
                }
            }
            if (null !== InsertMathContent) {
                MathContent.Add_ToContent(MathContentPos + 1, NewMathRun);
                MathContent.Insert_MathContent(InsertMathContent.Root, MathContentPos + 1, true);
            }
        } else {
            if (para_Run === LastClass.Type) {
                var NearContentPos = NearPos.ContentPos;
                var DstIndex = -1;
                var Count = this.Content.length;
                for (var Index = 0; Index < Count; Index++) {
                    if (this.Content[Index] === Para) {
                        DstIndex = Index;
                        break;
                    }
                }
                if (-1 === DstIndex) {
                    return false;
                }
                var Elements = SelectedContent.Elements;
                var ElementsCount = Elements.length;
                var FirstElement = SelectedContent.Elements[0];
                if (1 === ElementsCount && true !== FirstElement.SelectedAll && type_Paragraph === FirstElement.Element.GetType() && true !== FirstElement.Element.Is_Empty()) {
                    var NewPara = FirstElement.Element;
                    var NewElementsCount = NewPara.Content.length - 1;
                    var LastClass = ParaNearPos.Classes[ParaNearPos.Classes.length - 1];
                    var NewElement = LastClass.Split(ParaNearPos.NearPos.ContentPos, ParaNearPos.Classes.length - 1);
                    var PrevClass = ParaNearPos.Classes[ParaNearPos.Classes.length - 2];
                    var PrevPos = ParaNearPos.NearPos.ContentPos.Data[ParaNearPos.Classes.length - 2];
                    PrevClass.Add_ToContent(PrevPos + 1, NewElement);
                    var bNeedSelect = (true === SelectedContent.MoveDrawing ? false : true);
                    for (var Index = 0; Index < NewElementsCount; Index++) {
                        var Item = NewPara.Content[Index];
                        PrevClass.Add_ToContent(PrevPos + 1 + Index, Item);
                        if (true === bNeedSelect) {
                            Item.Select_All();
                        }
                    }
                    if (true === bNeedSelect) {
                        PrevClass.Selection.Use = true;
                        PrevClass.Selection.StartPos = PrevPos + 1;
                        PrevClass.Selection.EndPos = PrevPos + 1 + NewElementsCount - 1;
                        for (var Index = 0; Index < ParaNearPos.Classes.length - 2; Index++) {
                            var Class = ParaNearPos.Classes[Index];
                            var ClassPos = ParaNearPos.NearPos.ContentPos.Data[Index];
                            Class.Selection.Use = true;
                            Class.Selection.StartPos = ClassPos;
                            Class.Selection.EndPos = ClassPos;
                        }
                        this.Selection.Use = true;
                        this.Selection.StartPos = DstIndex;
                        this.Selection.EndPos = DstIndex;
                    }
                    if (PrevClass.Correct_Content) {
                        PrevClass.Correct_Content();
                    }
                } else {
                    var bConcatS = (type_Table === Elements[0].Element.GetType() ? false : true);
                    var bConcatE = (type_Table === Elements[ElementsCount - 1].Element.GetType() || true === Elements[ElementsCount - 1].SelectedAll ? false : true);
                    var ParaS = Para;
                    var ParaE = Para;
                    var ParaEIndex = DstIndex;
                    Para.Cursor_MoveToNearPos(NearPos);
                    Para.Selection_Remove();
                    var bAddEmptyPara = false;
                    if (true === Para.Cursor_IsEnd()) {
                        bConcatE = false;
                        if (1 === ElementsCount && type_Paragraph === FirstElement.Element.GetType() && (true === FirstElement.Element.Is_Empty() || true == FirstElement.SelectedAll)) {
                            bConcatS = false;
                            if (type_Paragraph !== this.Content[DstIndex].Get_Type() || true !== this.Content[DstIndex].Is_Empty()) {
                                DstIndex++;
                            }
                        } else {
                            if (true === Elements[ElementsCount - 1].SelectedAll && true === bConcatS) {
                                bAddEmptyPara = true;
                            }
                        }
                    } else {
                        if (true === Para.Cursor_IsStart()) {
                            bConcatS = false;
                        } else {
                            var NewParagraph = new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0);
                            Para.Split(NewParagraph);
                            this.Internal_Content_Add(DstIndex + 1, NewParagraph);
                            ParaE = NewParagraph;
                            ParaEIndex = DstIndex + 1;
                        }
                    }
                    if (true === bAddEmptyPara) {
                        var NewParagraph = new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0);
                        NewParagraph.Set_Pr(ParaS.Pr);
                        NewParagraph.TextPr.Apply_TextPr(ParaS.TextPr.Value);
                        this.Internal_Content_Add(DstIndex + 1, NewParagraph);
                    }
                    var StartIndex = 0;
                    if (true === bConcatS) {
                        var _ParaS = Elements[0].Element;
                        _ParaS.Select_All();
                        var _ParaSContentLen = _ParaS.Content.length;
                        ParaS.Concat(Elements[0].Element);
                        ParaS.Set_Pr(Elements[0].Element.Pr);
                        ParaS.TextPr.Clear_Style();
                        ParaS.TextPr.Apply_TextPr(Elements[0].Element.TextPr.Value);
                        StartIndex++;
                        ParaS.Selection.Use = true;
                        ParaS.Selection.StartPos = ParaS.Content.length - _ParaSContentLen;
                        ParaS.Selection.EndPos = ParaS.Content.length - 1;
                    }
                    var EndIndex = ElementsCount - 1;
                    if (true === bConcatE && StartIndex < EndIndex) {
                        var _ParaE = Elements[ElementsCount - 1].Element;
                        var TempCount = _ParaE.Content.length - 1;
                        _ParaE.Select_All();
                        _ParaE.Concat(ParaE);
                        _ParaE.Set_Pr(ParaE.Pr);
                        this.Internal_Content_Add(ParaEIndex, _ParaE);
                        this.Internal_Content_Remove(ParaEIndex + 1, 1);
                        _ParaE.Selection.Use = true;
                        _ParaE.Selection.StartPos = 0;
                        _ParaE.Selection.EndPos = TempCount;
                        EndIndex--;
                    }
                    for (var Index = StartIndex; Index <= EndIndex; Index++) {
                        this.Internal_Content_Add(DstIndex + Index, Elements[Index].Element);
                        this.Content[DstIndex + Index].Select_All();
                    }
                    this.Selection.Use = true;
                    this.Selection.StartPos = DstIndex;
                    this.Selection.EndPos = DstIndex + ElementsCount - 1;
                }
                if (docpostype_DrawingObjects !== this.CurPos.Type) {
                    this.CurPos.Type = docpostype_Content;
                }
            }
        }
    },
    Document_SelectNumbering: function (NumPr, Index) {
        this.Selection_Remove();
        this.Selection.Use = true;
        this.Selection.Flag = selectionflag_Numbering;
        this.Selection.Data = [];
        this.Selection.StartPos = Index;
        this.Selection.EndPos = Index;
        for (var Index = 0; Index < this.Content.length; Index++) {
            var Item = this.Content[Index];
            var ItemNumPr = null;
            if (type_Paragraph == Item.GetType() && undefined != (ItemNumPr = Item.Numbering_Get()) && ItemNumPr.NumId == NumPr.NumId && ItemNumPr.Lvl == NumPr.Lvl) {
                this.Selection.Data.push(Index);
                Item.Selection_SelectNumbering();
            }
        }
        this.Interface_Update_ParaPr();
        this.Interface_Update_TextPr();
        this.Document_UpdateSelectionState();
    },
    Remove_NumberingSelection: function () {
        if (true === this.Selection.Use && selectionflag_Numbering == this.Selection.Flag) {
            this.Selection_Remove();
        }
    },
    Update_CursorType: function (X, Y, PageIndex, MouseEvent) {
        editor.sync_MouseMoveStartCallback();
        if (true === this.DrawingDocument.IsCursorInTableCur(X, Y, PageIndex)) {
            this.DrawingDocument.SetCursorType("default", new CMouseMoveData());
            editor.sync_MouseMoveEndCallback();
            return;
        }
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Update_CursorType(X, Y, PageIndex);
        } else {
            var bInText = (null === this.Is_InText(X, Y, this.CurPage) ? false : true);
            var bTableBorder = (null === this.Is_TableBorder(X, Y, this.CurPage) ? false : true);
            if (true === this.DrawingObjects.updateCursorType(PageIndex, X, Y, MouseEvent, (true === bInText || true === bTableBorder ? true : false))) {
                editor.sync_MouseMoveEndCallback();
                return;
            }
            var ContentPos = this.Internal_GetContentPosByXY(X, Y, PageIndex);
            var Item = this.Content[ContentPos];
            Item.Update_CursorType(X, Y, PageIndex);
        }
        editor.sync_MouseMoveEndCallback();
    },
    Is_TableBorder: function (X, Y, PageIndex) {
        if (PageIndex >= this.Pages.length || PageIndex < 0) {
            return null;
        }
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Is_TableBorder(X, Y, PageIndex);
        } else {
            if (-1 != this.DrawingObjects.isPointInDrawingObjects(X, Y, PageIndex, this)) {
                return null;
            } else {
                var ContentPos = this.Internal_GetContentPosByXY(X, Y, PageIndex);
                var Item = this.Content[ContentPos];
                if (type_Table == Item.GetType()) {
                    return Item.Is_TableBorder(X, Y, PageIndex);
                } else {
                    return null;
                }
            }
        }
        return null;
    },
    Is_InText: function (X, Y, PageIndex) {
        if (PageIndex >= this.Pages.length || PageIndex < 0) {
            return null;
        }
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Is_InText(X, Y, PageIndex);
        } else {
            var ContentPos = this.Internal_GetContentPosByXY(X, Y, PageIndex);
            var Item = this.Content[ContentPos];
            return Item.Is_InText(X, Y, PageIndex);
        }
    },
    Is_InDrawing: function (X, Y, PageIndex) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Is_InDrawing(X, Y, PageIndex);
        } else {
            if (-1 != this.DrawingObjects.isPointInDrawingObjects(X, Y, this.CurPage, this)) {
                return true;
            } else {
                var ContentPos = this.Internal_GetContentPosByXY(X, Y, PageIndex);
                var Item = this.Content[ContentPos];
                if (type_Table == Item.GetType()) {
                    return Item.Is_InDrawing(X, Y, PageIndex);
                }
                return false;
            }
        }
    },
    Is_UseInDocument: function (Id) {
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            if (Id === this.Content[Index].Get_Id()) {
                return true;
            }
        }
        return false;
    },
    OnKeyDown: function (e) {
        if (true === this.History.Is_ExtendDocumentToPos()) {
            this.History.Clear_Additional();
        }
        if (this.SearchEngine.Count > 0) {
            this.SearchEngine.Reset_Current();
        }
        var bUpdateSelection = true;
        var bRetValue = false;
        if (e.KeyCode == 8 && false === editor.isViewMode) {
            if (false === this.Document_Is_SelectionLocked(changestype_Remove)) {
                this.Create_NewHistoryPoint(historydescription_Document_BackSpaceButton);
                this.Remove(-1, true);
            }
            bRetValue = true;
        } else {
            if (e.KeyCode == 9 && false === editor.isViewMode) {
                var SelectedInfo = this.Get_SelectedElementsInfo();
                if (true === SelectedInfo.Is_InTable() && true != e.CtrlKey) {
                    this.Cursor_MoveToCell(true === e.ShiftKey ? false : true);
                } else {
                    if (true === SelectedInfo.Is_DrawingObjSelected() && true != e.CtrlKey) {
                        this.DrawingObjects.selectNextObject((e.ShiftKey === true ? -1 : 1));
                    } else {
                        if (true === SelectedInfo.Is_MixedSelection()) {
                            if (true === e.ShiftKey) {
                                editor.DecreaseIndent();
                            } else {
                                editor.IncreaseIndent();
                            }
                        } else {
                            var Paragraph = SelectedInfo.Get_Paragraph();
                            var ParaPr = Paragraph.Get_CompiledPr2(false).ParaPr;
                            if (null != Paragraph && (true === Paragraph.Cursor_IsStart() || true === Paragraph.Selection_IsFromStart()) && (undefined != Paragraph.Numbering_Get() || (true != Paragraph.IsEmpty() && ParaPr.Tabs.Tabs.length <= 0))) {
                                if (false === this.Document_Is_SelectionLocked(changestype_None, {
                                    Type: changestype_2_Element_and_Type,
                                    Element: Paragraph,
                                    CheckType: changestype_Paragraph_Properties
                                })) {
                                    this.Create_NewHistoryPoint(historydescription_Document_MoveParagraphByTab);
                                    Paragraph.Add_Tab(e.ShiftKey);
                                    this.Recalculate();
                                    this.Document_UpdateInterfaceState();
                                    this.Document_UpdateSelectionState();
                                }
                            } else {
                                if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                                    this.Create_NewHistoryPoint(historydescription_Document_AddTab);
                                    this.Paragraph_Add(new ParaTab());
                                }
                            }
                        }
                    }
                }
                bRetValue = true;
            } else {
                if (e.KeyCode == 13) {
                    var Hyperlink = this.Hyperlink_Check(false);
                    if (null != Hyperlink && false === e.ShiftKey) {
                        editor.sync_HyperlinkClickCallback(Hyperlink.Get_Value());
                        Hyperlink.Set_Visited(true);
                        this.DrawingDocument.ClearCachePages();
                        this.DrawingDocument.FirePaint();
                    } else {
                        if (false === editor.isViewMode) {
                            var CheckType = (e.ShiftKey || e.CtrlKey ? changestype_Paragraph_Content : changestype_Document_Content_Add);
                            if (false === this.Document_Is_SelectionLocked(CheckType)) {
                                this.Create_NewHistoryPoint(historydescription_Document_EnterButton);
                                var oSelectedInfo = this.Get_SelectedElementsInfo();
                                var oMath = oSelectedInfo.Get_Math();
                                if (null !== oMath && oMath.Is_InInnerContent()) {
                                    if (oMath.Handle_AddNewLine()) {
                                        this.Recalculate();
                                    }
                                } else {
                                    if (e.ShiftKey) {
                                        this.Paragraph_Add(new ParaNewLine(break_Line));
                                    } else {
                                        if (e.CtrlKey) {
                                            this.Paragraph_Add(new ParaNewLine(break_Page));
                                        } else {
                                            this.Add_NewParagraph();
                                        }
                                    }
                                }
                            }
                        }
                    }
                    bRetValue = true;
                } else {
                    if (e.KeyCode == 27) {
                        if (true === editor.isMarkerFormat) {
                            editor.sync_MarkerFormatCallback(false);
                            this.Update_CursorType(this.CurPos.RealX, this.CurPos.RealY, this.CurPage, new CMouseEventHandler());
                        } else {
                            if (c_oAscFormatPainterState.kOff !== editor.isPaintFormat) {
                                editor.sync_PaintFormatCallback(c_oAscFormatPainterState.kOff);
                                this.Update_CursorType(this.CurPos.RealX, this.CurPos.RealY, this.CurPage, new CMouseEventHandler());
                            } else {
                                if (docpostype_DrawingObjects === this.CurPos.Type || (docpostype_HdrFtr === this.CurPos.Type && null != this.HdrFtr.CurHdrFtr && docpostype_DrawingObjects === this.HdrFtr.CurHdrFtr.Content.CurPos.Type)) {
                                    this.DrawingObjects.resetSelection2();
                                    this.Document_UpdateInterfaceState();
                                    this.Document_UpdateSelectionState();
                                    this.private_UpdateCursorXY(true, true);
                                } else {
                                    if (docpostype_HdrFtr == this.CurPos.Type) {
                                        this.Document_End_HdrFtrEditing();
                                    }
                                }
                            }
                        }
                        bRetValue = true;
                    } else {
                        if (e.KeyCode == 32 && false === editor.isViewMode) {
                            if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                                this.Create_NewHistoryPoint(historydescription_Document_SpaceButton);
                                var oSelectedInfo = this.Get_SelectedElementsInfo();
                                var oMath = oSelectedInfo.Get_Math();
                                if (null !== oMath && true === oMath.Make_AutoCorrect()) {} else {
                                    if (true === e.ShiftKey && true === e.CtrlKey) {
                                        this.DrawingDocument.TargetStart();
                                        this.DrawingDocument.TargetShow();
                                        this.Paragraph_Add(new ParaText(String.fromCharCode(160)));
                                    } else {
                                        if (true === e.CtrlKey) {
                                            this.Paragraph_ClearFormatting();
                                        } else {
                                            this.DrawingDocument.TargetStart();
                                            this.DrawingDocument.TargetShow();
                                            this.Paragraph_Add(new ParaSpace());
                                        }
                                    }
                                }
                            }
                            bRetValue = true;
                        } else {
                            if (e.KeyCode == 33) {
                                if (true === e.AltKey) {
                                    var MouseEvent = new CMouseEventHandler();
                                    MouseEvent.ClickCount = 1;
                                    MouseEvent.Type = g_mouse_event_type_down;
                                    this.CurPage--;
                                    if (this.CurPage < 0) {
                                        this.CurPage = 0;
                                    }
                                    this.Selection_SetStart(0, 0, MouseEvent);
                                    MouseEvent.Type = g_mouse_event_type_up;
                                    this.Selection_SetEnd(0, 0, MouseEvent);
                                } else {
                                    if (docpostype_HdrFtr === this.CurPos.Type) {
                                        if (true === this.HdrFtr.GoTo_PrevHdrFtr()) {
                                            this.Document_UpdateSelectionState();
                                            this.Document_UpdateInterfaceState();
                                        }
                                    } else {
                                        var TempXY = this.Cursor_GetPos();
                                        var X = TempXY.X;
                                        var Y = TempXY.Y;
                                        var Dy = this.DrawingDocument.GetVisibleMMHeight();
                                        if (Y - Dy < 0) {
                                            this.CurPage--;
                                            var PageH = this.Get_PageLimits(this.CurPage).YLimit;
                                            Dy -= Y;
                                            Y = PageH;
                                            while (Dy > PageH) {
                                                Dy -= PageH;
                                                this.CurPage--;
                                            }
                                            if (this.CurPage < 0) {
                                                this.CurPage = 0;
                                                Dy = PageH - this.Content[0].Pages[this.Content[0].Pages.length - 1].Bounds.Top;
                                            }
                                        }
                                        if (this.CurPage >= this.DrawingDocument.m_lPagesCount) {
                                            this.CurPage = this.DrawingDocument.m_lPagesCount;
                                        }
                                        var StartX = X;
                                        var StartY = Y;
                                        var CurY = Y;
                                        while (Math.abs(StartY - Y) < 0.001) {
                                            var bBreak = false;
                                            CurY -= Dy;
                                            if (CurY < 0) {
                                                this.CurPage--;
                                                var PageH = this.Get_PageLimits(this.CurPage).YLimit;
                                                CurY = PageH;
                                                if (this.CurPage < 0) {
                                                    this.CurPage = this.DrawingDocument.m_lPagesCount - 1;
                                                    CurY = 0;
                                                }
                                                bBreak = true;
                                            }
                                            this.Cursor_MoveAt(StartX, CurY, false);
                                            this.CurPos.RealX = StartX;
                                            this.CurPos.RealY = CurY;
                                            TempXY = this.Cursor_GetPos();
                                            X = TempXY.X;
                                            Y = TempXY.Y;
                                            if (true === bBreak) {
                                                break;
                                            }
                                        }
                                    }
                                }
                                bRetValue = true;
                            } else {
                                if (e.KeyCode == 34) {
                                    if (true === e.AltKey) {
                                        var MouseEvent = new CMouseEventHandler();
                                        MouseEvent.ClickCount = 1;
                                        MouseEvent.Type = g_mouse_event_type_down;
                                        this.CurPage++;
                                        if (this.CurPage >= this.DrawingDocument.m_lPagesCount) {
                                            this.CurPage = this.DrawingDocument.m_lPagesCount - 1;
                                        }
                                        this.Selection_SetStart(0, 0, MouseEvent);
                                        MouseEvent.Type = g_mouse_event_type_up;
                                        this.Selection_SetEnd(0, 0, MouseEvent);
                                    } else {
                                        if (docpostype_HdrFtr === this.CurPos.Type) {
                                            if (true === this.HdrFtr.GoTo_NextHdrFtr()) {
                                                this.Document_UpdateSelectionState();
                                                this.Document_UpdateInterfaceState();
                                            }
                                        } else {
                                            if (this.Pages.length > 0) {
                                                var TempXY = this.Cursor_GetPos();
                                                var X = TempXY.X;
                                                var Y = TempXY.Y;
                                                var Dy = this.DrawingDocument.GetVisibleMMHeight();
                                                if (Y + Dy > this.Get_PageLimits(this.CurPage).YLimit) {
                                                    this.CurPage++;
                                                    var PageH = this.Get_PageLimits(this.CurPage).YLimit;
                                                    Dy -= PageH - Y;
                                                    Y = 0;
                                                    while (Dy > PageH) {
                                                        Dy -= PageH;
                                                        this.CurPage++;
                                                    }
                                                    if (this.CurPage >= this.Pages.length) {
                                                        this.CurPage = this.Pages.length - 1;
                                                        var LastElement = this.Content[this.Pages[this.CurPage].EndPos];
                                                        Dy = LastElement.Pages[LastElement.Pages.length - 1].Bounds.Bottom;
                                                    }
                                                }
                                                if (this.CurPage >= this.Pages.length) {
                                                    this.CurPage = this.Pages.length - 1;
                                                }
                                                var StartX = X;
                                                var StartY = Y;
                                                var CurY = Y;
                                                while (Math.abs(StartY - Y) < 0.001) {
                                                    var bBreak = false;
                                                    CurY += Dy;
                                                    var PageH = this.Get_PageLimits(this.CurPage).YLimit;
                                                    if (CurY > PageH) {
                                                        this.CurPage++;
                                                        CurY = 0;
                                                        if (this.CurPage >= this.Pages.length) {
                                                            this.CurPage = this.Pages.length - 1;
                                                            var LastElement = this.Content[this.Pages[this.CurPage].EndPos];
                                                            CurY = LastElement.Pages[LastElement.Pages.length - 1].Bounds.Bottom;
                                                        }
                                                        bBreak = true;
                                                    }
                                                    this.Cursor_MoveAt(StartX, CurY, false);
                                                    this.CurPos.RealX = StartX;
                                                    this.CurPos.RealY = CurY;
                                                    TempXY = this.Cursor_GetPos();
                                                    X = TempXY.X;
                                                    Y = TempXY.Y;
                                                    if (true === bBreak) {
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    bRetValue = true;
                                } else {
                                    if (e.KeyCode == 35) {
                                        if (true === e.CtrlKey) {
                                            this.Cursor_MoveToEndPos(true === e.ShiftKey);
                                        } else {
                                            this.Cursor_MoveEndOfLine(true === e.ShiftKey);
                                        }
                                        bRetValue = true;
                                    } else {
                                        if (e.KeyCode == 36) {
                                            if (true === e.CtrlKey) {
                                                this.Cursor_MoveToStartPos(true === e.ShiftKey);
                                            } else {
                                                this.Cursor_MoveStartOfLine(true === e.ShiftKey);
                                            }
                                            bRetValue = true;
                                        } else {
                                            if (e.KeyCode == 37) {
                                                if (true != e.ShiftKey) {
                                                    this.DrawingDocument.TargetStart();
                                                }
                                                this.Cursor_MoveLeft(true === e.ShiftKey, true === e.CtrlKey);
                                                bRetValue = true;
                                            } else {
                                                if (e.KeyCode == 38) {
                                                    if (true != e.ShiftKey) {
                                                        this.DrawingDocument.TargetStart();
                                                    }
                                                    this.Cursor_MoveUp(true === e.ShiftKey);
                                                    bRetValue = true;
                                                } else {
                                                    if (e.KeyCode == 39) {
                                                        if (true != e.ShiftKey) {
                                                            this.DrawingDocument.TargetStart();
                                                        }
                                                        this.Cursor_MoveRight(true === e.ShiftKey, true === e.CtrlKey);
                                                        bRetValue = true;
                                                    } else {
                                                        if (e.KeyCode == 40) {
                                                            if (true != e.ShiftKey) {
                                                                this.DrawingDocument.TargetStart();
                                                            }
                                                            this.Cursor_MoveDown(true === e.ShiftKey);
                                                            bRetValue = true;
                                                        } else {
                                                            if (e.KeyCode == 45) {
                                                                if (true === e.CtrlKey) {
                                                                    Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi);
                                                                } else {
                                                                    if (true === e.ShiftKey && false === editor.isViewMode) {
                                                                        if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                                                                            if (!window.GlobalPasteFlag) {
                                                                                if (!window.USER_AGENT_SAFARI_MACOS) {
                                                                                    this.Create_NewHistoryPoint(historydescription_Document_ShiftInsert);
                                                                                    window.GlobalPasteFlag = true;
                                                                                    editor.waitSave = true;
                                                                                    Editor_Paste(this.DrawingDocument.m_oWordControl.m_oApi, true);
                                                                                } else {
                                                                                    if (0 === window.GlobalPasteFlagCounter) {
                                                                                        this.Create_NewHistoryPoint(historydescription_Document_ShiftInsertSafari);
                                                                                        SafariIntervalFocus();
                                                                                        window.GlobalPasteFlag = true;
                                                                                        editor.waitSave = true;
                                                                                        Editor_Paste(this.DrawingDocument.m_oWordControl.m_oApi, true);
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            } else {
                                                                if (e.KeyCode == 46 && false === editor.isViewMode) {
                                                                    if (true != e.ShiftKey) {
                                                                        if (false === this.Document_Is_SelectionLocked(changestype_Delete)) {
                                                                            this.Create_NewHistoryPoint(historydescription_Document_DeleteButton);
                                                                            this.Remove(1, true);
                                                                        }
                                                                        bRetValue = true;
                                                                    } else {
                                                                        if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                                                                            this.Create_NewHistoryPoint(historydescription_Document_ShiftDeleteButton);
                                                                            Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi, true);
                                                                        }
                                                                    }
                                                                } else {
                                                                    if (e.KeyCode == 49 && false === editor.isViewMode && true === e.CtrlKey && true === e.AltKey) {
                                                                        if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties)) {
                                                                            this.Create_NewHistoryPoint(historydescription_Document_SetStyleHeading1);
                                                                            this.Set_ParagraphStyle("Heading 1");
                                                                            this.Document_UpdateInterfaceState();
                                                                        }
                                                                        bRetValue = true;
                                                                    } else {
                                                                        if (e.KeyCode == 50 && false === editor.isViewMode && true === e.CtrlKey && true === e.AltKey) {
                                                                            if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties)) {
                                                                                this.Create_NewHistoryPoint(historydescription_Document_SetStyleHeading2);
                                                                                this.Set_ParagraphStyle("Heading 2");
                                                                                this.Document_UpdateInterfaceState();
                                                                            }
                                                                            bRetValue = true;
                                                                        } else {
                                                                            if (e.KeyCode == 51 && false === editor.isViewMode && true === e.CtrlKey && true === e.AltKey) {
                                                                                if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties)) {
                                                                                    this.Create_NewHistoryPoint(historydescription_Document_SetStyleHeading3);
                                                                                    this.Set_ParagraphStyle("Heading 3");
                                                                                    this.Document_UpdateInterfaceState();
                                                                                }
                                                                                bRetValue = true;
                                                                            } else {
                                                                                if (e.KeyCode === 53 && false === editor.isViewMode && true === e.CtrlKey) {
                                                                                    var TextPr = this.Get_Paragraph_TextPr();
                                                                                    if (null != TextPr) {
                                                                                        if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                                                                                            this.Create_NewHistoryPoint(historydescription_Document_SetTextStrikeoutHotKey);
                                                                                            this.Paragraph_Add(new ParaTextPr({
                                                                                                Strikeout: TextPr.Strikeout === true ? false : true
                                                                                            }));
                                                                                            this.Document_UpdateInterfaceState();
                                                                                        }
                                                                                        bRetValue = true;
                                                                                    }
                                                                                } else {
                                                                                    if (e.KeyCode == 65 && true === e.CtrlKey) {
                                                                                        this.Select_All();
                                                                                        bUpdateSelection = false;
                                                                                        bRetValue = true;
                                                                                    } else {
                                                                                        if (e.KeyCode == 66 && false === editor.isViewMode && true === e.CtrlKey) {
                                                                                            var TextPr = this.Get_Paragraph_TextPr();
                                                                                            if (null != TextPr) {
                                                                                                if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                                                                                                    this.Create_NewHistoryPoint(historydescription_Document_SetTextBoldHotKey);
                                                                                                    this.Paragraph_Add(new ParaTextPr({
                                                                                                        Bold: TextPr.Bold === true ? false : true
                                                                                                    }));
                                                                                                    this.Document_UpdateInterfaceState();
                                                                                                }
                                                                                                bRetValue = true;
                                                                                            }
                                                                                        } else {
                                                                                            if (e.KeyCode == 67 && true === e.CtrlKey) {
                                                                                                if (true === e.ShiftKey) {
                                                                                                    this.Document_Format_Copy();
                                                                                                    bRetValue = true;
                                                                                                } else {
                                                                                                    Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi);
                                                                                                }
                                                                                            } else {
                                                                                                if (e.KeyCode == 69 && false === editor.isViewMode && true === e.CtrlKey) {
                                                                                                    if (true !== e.AltKey) {
                                                                                                        var ParaPr = this.Get_Paragraph_ParaPr();
                                                                                                        if (null != ParaPr) {
                                                                                                            if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties)) {
                                                                                                                this.Create_NewHistoryPoint(historydescription_Document_SetParagraphAlignHotKey);
                                                                                                                this.Set_ParagraphAlign(ParaPr.Jc === align_Center ? align_Left : align_Center);
                                                                                                                this.Document_UpdateInterfaceState();
                                                                                                            }
                                                                                                            bRetValue = true;
                                                                                                        }
                                                                                                    } else {
                                                                                                        if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                                                                                                            this.Create_NewHistoryPoint(historydescription_Document_AddEuroLetter);
                                                                                                            this.DrawingDocument.TargetStart();
                                                                                                            this.DrawingDocument.TargetShow();
                                                                                                            this.Paragraph_Add(new ParaText("€"));
                                                                                                        }
                                                                                                        bRetValue = true;
                                                                                                    }
                                                                                                } else {
                                                                                                    if (e.KeyCode == 73 && false === editor.isViewMode && true === e.CtrlKey) {
                                                                                                        var TextPr = this.Get_Paragraph_TextPr();
                                                                                                        if (null != TextPr) {
                                                                                                            if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                                                                                                                this.Create_NewHistoryPoint(historydescription_Document_SetTextItalicHotKey);
                                                                                                                this.Paragraph_Add(new ParaTextPr({
                                                                                                                    Italic: TextPr.Italic === true ? false : true
                                                                                                                }));
                                                                                                                this.Document_UpdateInterfaceState();
                                                                                                            }
                                                                                                            bRetValue = true;
                                                                                                        }
                                                                                                    } else {
                                                                                                        if (e.KeyCode == 74 && false === editor.isViewMode && true === e.CtrlKey) {
                                                                                                            var ParaPr = this.Get_Paragraph_ParaPr();
                                                                                                            if (null != ParaPr) {
                                                                                                                if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties)) {
                                                                                                                    this.Create_NewHistoryPoint(historydescription_Document_SetParagraphAlignHotKey2);
                                                                                                                    this.Set_ParagraphAlign(ParaPr.Jc === align_Justify ? align_Left : align_Justify);
                                                                                                                    this.Document_UpdateInterfaceState();
                                                                                                                }
                                                                                                                bRetValue = true;
                                                                                                            }
                                                                                                        } else {
                                                                                                            if (e.KeyCode == 75 && false === editor.isViewMode && true === e.CtrlKey && false === e.ShiftKey) {
                                                                                                                if (true === this.Hyperlink_CanAdd(false)) {
                                                                                                                    editor.sync_DialogAddHyperlink();
                                                                                                                }
                                                                                                                bRetValue = true;
                                                                                                            } else {
                                                                                                                if (e.KeyCode == 76 && false === editor.isViewMode && true === e.CtrlKey) {
                                                                                                                    if (true === e.ShiftKey) {
                                                                                                                        if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                                                                                                                            this.Create_NewHistoryPoint(historydescription_Document_SetParagraphNumberingHotKey);
                                                                                                                            this.Set_ParagraphNumbering({
                                                                                                                                Type: 0,
                                                                                                                                SubType: 1
                                                                                                                            });
                                                                                                                            this.Document_UpdateInterfaceState();
                                                                                                                        }
                                                                                                                        bRetValue = true;
                                                                                                                    } else {
                                                                                                                        var ParaPr = this.Get_Paragraph_ParaPr();
                                                                                                                        if (null != ParaPr) {
                                                                                                                            if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties)) {
                                                                                                                                this.Create_NewHistoryPoint(historydescription_Document_SetParagraphAlignHotKey3);
                                                                                                                                this.Set_ParagraphAlign(ParaPr.Jc === align_Left ? align_Justify : align_Left);
                                                                                                                                this.Document_UpdateInterfaceState();
                                                                                                                            }
                                                                                                                            bRetValue = true;
                                                                                                                        }
                                                                                                                    }
                                                                                                                } else {
                                                                                                                    if (e.KeyCode == 77 && false === editor.isViewMode && true === e.CtrlKey) {
                                                                                                                        if (true === e.ShiftKey) {
                                                                                                                            editor.DecreaseIndent();
                                                                                                                        } else {
                                                                                                                            editor.IncreaseIndent();
                                                                                                                        }
                                                                                                                        bRetValue = true;
                                                                                                                    } else {
                                                                                                                        if (e.KeyCode == 80 && true === e.CtrlKey) {
                                                                                                                            if (true === e.ShiftKey && false === editor.isViewMode) {
                                                                                                                                if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                                                                                                                                    this.Create_NewHistoryPoint(historydescription_Document_AddPageNumHotKey);
                                                                                                                                    this.Paragraph_Add(new ParaPageNum());
                                                                                                                                }
                                                                                                                                bRetValue = true;
                                                                                                                            } else {
                                                                                                                                this.DrawingDocument.m_oWordControl.m_oApi.asc_Print();
                                                                                                                                bRetValue = true;
                                                                                                                            }
                                                                                                                        } else {
                                                                                                                            if (e.KeyCode == 82 && false === editor.isViewMode && true === e.CtrlKey) {
                                                                                                                                var ParaPr = this.Get_Paragraph_ParaPr();
                                                                                                                                if (null != ParaPr) {
                                                                                                                                    if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties)) {
                                                                                                                                        this.Create_NewHistoryPoint(historydescription_Document_SetParagraphAlignHotKey4);
                                                                                                                                        this.Set_ParagraphAlign(ParaPr.Jc === align_Right ? align_Left : align_Right);
                                                                                                                                        this.Document_UpdateInterfaceState();
                                                                                                                                    }
                                                                                                                                    bRetValue = true;
                                                                                                                                }
                                                                                                                            } else {
                                                                                                                                if (e.KeyCode == 83 && false === editor.isViewMode && true === e.CtrlKey) {
                                                                                                                                    if (true === this.History.Have_Changes() || CollaborativeEditing.m_aChanges.length > 0) {
                                                                                                                                        this.DrawingDocument.m_oWordControl.m_oApi.asc_Save();
                                                                                                                                    }
                                                                                                                                    bRetValue = true;
                                                                                                                                } else {
                                                                                                                                    if (e.KeyCode == 85 && false === editor.isViewMode && true === e.CtrlKey) {
                                                                                                                                        var TextPr = this.Get_Paragraph_TextPr();
                                                                                                                                        if (null != TextPr) {
                                                                                                                                            if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                                                                                                                                                this.Create_NewHistoryPoint(historydescription_Document_SetTextUnderlineHotKey);
                                                                                                                                                this.Paragraph_Add(new ParaTextPr({
                                                                                                                                                    Underline: TextPr.Underline === true ? false : true
                                                                                                                                                }));
                                                                                                                                                this.Document_UpdateInterfaceState();
                                                                                                                                            }
                                                                                                                                            bRetValue = true;
                                                                                                                                        }
                                                                                                                                    } else {
                                                                                                                                        if (e.KeyCode == 86 && false === editor.isViewMode && true === e.CtrlKey) {
                                                                                                                                            if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                                                                                                                                                if (true === e.ShiftKey) {
                                                                                                                                                    this.Create_NewHistoryPoint(historydescription_Document_FormatPasteHotKey);
                                                                                                                                                    this.Document_Format_Paste();
                                                                                                                                                    bRetValue = true;
                                                                                                                                                } else {
                                                                                                                                                    if (!window.GlobalPasteFlag) {
                                                                                                                                                        if (!window.USER_AGENT_SAFARI_MACOS) {
                                                                                                                                                            this.Create_NewHistoryPoint(historydescription_Document_PasteHotKey);
                                                                                                                                                            window.GlobalPasteFlag = true;
                                                                                                                                                            editor.waitSave = true;
                                                                                                                                                            Editor_Paste(this.DrawingDocument.m_oWordControl.m_oApi, true);
                                                                                                                                                        } else {
                                                                                                                                                            if (0 === window.GlobalPasteFlagCounter) {
                                                                                                                                                                this.Create_NewHistoryPoint(historydescription_Document_PasteSafariHotKey);
                                                                                                                                                                SafariIntervalFocus();
                                                                                                                                                                window.GlobalPasteFlag = true;
                                                                                                                                                                editor.waitSave = true;
                                                                                                                                                                Editor_Paste(this.DrawingDocument.m_oWordControl.m_oApi, true);
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                    } else {
                                                                                                                                                        if (!window.USER_AGENT_SAFARI_MACOS) {
                                                                                                                                                            bRetValue = true;
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        } else {
                                                                                                                                            if (e.KeyCode == 88 && false === editor.isViewMode && true === e.CtrlKey) {
                                                                                                                                                if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                                                                                                                                                    this.Create_NewHistoryPoint(historydescription_Document_CurHotKey);
                                                                                                                                                    Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi, true);
                                                                                                                                                }
                                                                                                                                            } else {
                                                                                                                                                if (e.KeyCode == 89 && false === editor.isViewMode && true === e.CtrlKey) {
                                                                                                                                                    this.Document_Redo();
                                                                                                                                                    bRetValue = true;
                                                                                                                                                } else {
                                                                                                                                                    if (e.KeyCode == 90 && false === editor.isViewMode && true === e.CtrlKey) {
                                                                                                                                                        this.Document_Undo();
                                                                                                                                                        bRetValue = true;
                                                                                                                                                    } else {
                                                                                                                                                        if (e.KeyCode == 93 || 57351 == e.KeyCode) {
                                                                                                                                                            var ConvertedPos = this.DrawingDocument.ConvertCoordsToCursorWR(this.TargetPos.X, this.TargetPos.Y, this.TargetPos.PageNum);
                                                                                                                                                            var X_abs = ConvertedPos.X;
                                                                                                                                                            var Y_abs = ConvertedPos.Y;
                                                                                                                                                            editor.sync_ContextMenuCallback({
                                                                                                                                                                Type: c_oAscContextMenuTypes.Common,
                                                                                                                                                                X_abs: X_abs,
                                                                                                                                                                Y_abs: Y_abs
                                                                                                                                                            });
                                                                                                                                                            bUpdateSelection = false;
                                                                                                                                                            bRetValue = true;
                                                                                                                                                        } else {
                                                                                                                                                            if (e.KeyCode == 121 && true === e.ShiftKey) {
                                                                                                                                                                var ConvertedPos = this.DrawingDocument.ConvertCoordsToCursorWR(this.TargetPos.X, this.TargetPos.Y, this.TargetPos.PageNum);
                                                                                                                                                                var X_abs = ConvertedPos.X;
                                                                                                                                                                var Y_abs = ConvertedPos.Y;
                                                                                                                                                                editor.sync_ContextMenuCallback({
                                                                                                                                                                    Type: c_oAscContextMenuTypes.Common,
                                                                                                                                                                    X_abs: X_abs,
                                                                                                                                                                    Y_abs: Y_abs
                                                                                                                                                                });
                                                                                                                                                                bUpdateSelection = false;
                                                                                                                                                                bRetValue = true;
                                                                                                                                                            } else {
                                                                                                                                                                if (e.KeyCode == 144) {
                                                                                                                                                                    bUpdateSelection = false;
                                                                                                                                                                    bRetValue = true;
                                                                                                                                                                } else {
                                                                                                                                                                    if (e.KeyCode == 145) {
                                                                                                                                                                        bUpdateSelection = false;
                                                                                                                                                                        bRetValue = true;
                                                                                                                                                                    } else {
                                                                                                                                                                        if (e.KeyCode == 187 && false === editor.isViewMode) {
                                                                                                                                                                            if (true === e.CtrlKey) {
                                                                                                                                                                                var TextPr = this.Get_Paragraph_TextPr();
                                                                                                                                                                                if (null != TextPr) {
                                                                                                                                                                                    if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                                                                                                                                                                                        this.Create_NewHistoryPoint(historydescription_Document_SetTextVertAlignHotKey);
                                                                                                                                                                                        if (true === e.ShiftKey) {
                                                                                                                                                                                            this.Paragraph_Add(new ParaTextPr({
                                                                                                                                                                                                VertAlign: TextPr.VertAlign === vertalign_SuperScript ? vertalign_Baseline : vertalign_SuperScript
                                                                                                                                                                                            }));
                                                                                                                                                                                        } else {
                                                                                                                                                                                            this.Paragraph_Add(new ParaTextPr({
                                                                                                                                                                                                VertAlign: TextPr.VertAlign === vertalign_SubScript ? vertalign_Baseline : vertalign_SubScript
                                                                                                                                                                                            }));
                                                                                                                                                                                        }
                                                                                                                                                                                        this.Document_UpdateInterfaceState();
                                                                                                                                                                                    }
                                                                                                                                                                                    bRetValue = true;
                                                                                                                                                                                }
                                                                                                                                                                            } else {
                                                                                                                                                                                if (true === e.AltKey) {
                                                                                                                                                                                    var oSelectedInfo = this.Get_SelectedElementsInfo();
                                                                                                                                                                                    var oMath = oSelectedInfo.Get_Math();
                                                                                                                                                                                    if (null === oMath) {
                                                                                                                                                                                        if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                                                                                                                                                                                            this.Create_NewHistoryPoint(historydescription_Document_AddMathHotKey);
                                                                                                                                                                                            this.Paragraph_Add(new MathMenu(-1));
                                                                                                                                                                                            bRetValue = true;
                                                                                                                                                                                        }
                                                                                                                                                                                    }
                                                                                                                                                                                }
                                                                                                                                                                            }
                                                                                                                                                                        } else {
                                                                                                                                                                            if (e.KeyCode == 188 && true === e.CtrlKey) {
                                                                                                                                                                                var TextPr = this.Get_Paragraph_TextPr();
                                                                                                                                                                                if (null != TextPr) {
                                                                                                                                                                                    if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                                                                                                                                                                                        this.Create_NewHistoryPoint(historydescription_Document_SetTextVertAlignHotKey2);
                                                                                                                                                                                        this.Paragraph_Add(new ParaTextPr({
                                                                                                                                                                                            VertAlign: TextPr.VertAlign === vertalign_SuperScript ? vertalign_Baseline : vertalign_SuperScript
                                                                                                                                                                                        }));
                                                                                                                                                                                        this.Document_UpdateInterfaceState();
                                                                                                                                                                                    }
                                                                                                                                                                                    bRetValue = true;
                                                                                                                                                                                }
                                                                                                                                                                            } else {
                                                                                                                                                                                if (e.KeyCode == 189 && false === editor.isViewMode) {
                                                                                                                                                                                    if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                                                                                                                                                                                        this.Create_NewHistoryPoint(historydescription_Document_MinusButton);
                                                                                                                                                                                        this.DrawingDocument.TargetStart();
                                                                                                                                                                                        this.DrawingDocument.TargetShow();
                                                                                                                                                                                        var Item = null;
                                                                                                                                                                                        if (true === e.CtrlKey && true === e.ShiftKey) {
                                                                                                                                                                                            Item = new ParaText(String.fromCharCode(8211));
                                                                                                                                                                                            Item.Set_SpaceAfter(false);
                                                                                                                                                                                        } else {
                                                                                                                                                                                            if (true === e.ShiftKey) {
                                                                                                                                                                                                Item = new ParaText("_");
                                                                                                                                                                                            } else {
                                                                                                                                                                                                Item = new ParaText("-");
                                                                                                                                                                                            }
                                                                                                                                                                                        }
                                                                                                                                                                                        this.Paragraph_Add(Item);
                                                                                                                                                                                    }
                                                                                                                                                                                    bRetValue = true;
                                                                                                                                                                                } else {
                                                                                                                                                                                    if (e.KeyCode == 190 && true === e.CtrlKey) {
                                                                                                                                                                                        var TextPr = this.Get_Paragraph_TextPr();
                                                                                                                                                                                        if (null != TextPr) {
                                                                                                                                                                                            if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                                                                                                                                                                                                this.Create_NewHistoryPoint(historydescription_Document_SetTextVertAlignHotKey3);
                                                                                                                                                                                                this.Paragraph_Add(new ParaTextPr({
                                                                                                                                                                                                    VertAlign: TextPr.VertAlign === vertalign_SubScript ? vertalign_Baseline : vertalign_SubScript
                                                                                                                                                                                                }));
                                                                                                                                                                                                this.Document_UpdateInterfaceState();
                                                                                                                                                                                            }
                                                                                                                                                                                            bRetValue = true;
                                                                                                                                                                                        }
                                                                                                                                                                                    } else {
                                                                                                                                                                                        if (e.KeyCode == 219 && false === editor.isViewMode && true === e.CtrlKey) {
                                                                                                                                                                                            editor.FontSizeOut();
                                                                                                                                                                                            this.Document_UpdateInterfaceState();
                                                                                                                                                                                        } else {
                                                                                                                                                                                            if (e.KeyCode == 221 && false === editor.isViewMode && true === e.CtrlKey) {
                                                                                                                                                                                                editor.FontSizeIn();
                                                                                                                                                                                                this.Document_UpdateInterfaceState();
                                                                                                                                                                                            }
                                                                                                                                                                                        }
                                                                                                                                                                                    }
                                                                                                                                                                                }
                                                                                                                                                                            }
                                                                                                                                                                        }
                                                                                                                                                                    }
                                                                                                                                                                }
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (true == bRetValue && true === bUpdateSelection) {
            this.Document_UpdateSelectionState();
        }
        return bRetValue;
    },
    OnKeyPress: function (e) {
        if (true === editor.isViewMode) {
            return false;
        }
        if (e.CtrlKey || (e.AltKey && !AscBrowser.isMacOs)) {
            return false;
        }
        var Code;
        if (null != e.Which) {
            Code = e.Which;
        } else {
            if (e.KeyCode) {
                Code = e.KeyCode;
            } else {
                Code = 0;
            }
        }
        var bRetValue = false;
        if (Code > 32) {
            if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                this.Create_NewHistoryPoint(historydescription_Document_AddLetter);
                this.DrawingDocument.TargetStart();
                this.DrawingDocument.TargetShow();
                this.Paragraph_Add(new ParaText(String.fromCharCode(Code)));
            }
            bRetValue = true;
        }
        if (true == bRetValue) {
            this.Document_UpdateSelectionState();
        }
        return bRetValue;
    },
    OnMouseDown: function (e, X, Y, PageIndex) {
        if (PageIndex < 0) {
            return;
        }
        this.Selection.DragDrop.Flag = 0;
        this.Selection.DragDrop.Data = null;
        if (this.SearchEngine.Count > 0) {
            this.SearchEngine.Reset_Current();
        }
        if (g_mouse_button_right === e.Button) {
            return;
        }
        if (true === this.History.Is_ExtendDocumentToPos()) {
            this.Document_Undo();
        }
        var OldCurPage = this.CurPage;
        this.CurPage = PageIndex;
        if (true === editor.isStartAddShape && (docpostype_HdrFtr !== this.CurPos.Type || null !== this.HdrFtr.CurHdrFtr)) {
            if (docpostype_HdrFtr !== this.CurPos.Type) {
                this.CurPos.Type = docpostype_DrawingObjects;
                this.Selection.Use = true;
                this.Selection.Start = true;
            } else {
                this.Selection.Use = true;
                this.Selection.Start = true;
                var CurHdrFtr = this.HdrFtr.CurHdrFtr;
                var DocContent = CurHdrFtr.Content;
                DocContent.CurPos.Type = docpostype_DrawingObjects;
                DocContent.Selection.Use = true;
                DocContent.Selection.Start = true;
            }
            if (true != this.DrawingObjects.isPolylineAddition()) {
                this.DrawingObjects.startAddShape(editor.addShapePreset);
            }
            this.DrawingObjects.OnMouseDown(e, X, Y, this.CurPage);
        } else {
            if (true === e.ShiftKey && ((docpostype_DrawingObjects !== this.CurPos.Type && !(docpostype_HdrFtr === this.CurPos.Type && this.HdrFtr.CurHdrFtr && this.HdrFtr.CurHdrFtr.Content.CurPos.Type === docpostype_DrawingObjects)) || true === this.DrawingObjects.checkTextObject(X, Y, PageIndex))) {
                if (true === this.Is_SelectionUse()) {
                    this.Selection.Start = false;
                    this.Selection_SetEnd(X, Y, e);
                    this.Document_UpdateSelectionState();
                    return;
                } else {
                    var CurPara = this.Get_CurrentParagraph();
                    if (null !== CurPara) {
                        var MouseEvent = new CMouseEventHandler();
                        MouseEvent.ClickCount = 1;
                        MouseEvent.Type = g_mouse_event_type_down;
                        var OldX = CurPara.CurPos.X;
                        var OldY = CurPara.CurPos.Y;
                        var DrawMatrix = CurPara.Get_ParentTextTransform();
                        if (DrawMatrix) {
                            var _OldX = DrawMatrix.TransformPointX(OldX, OldY);
                            var _OldY = DrawMatrix.TransformPointY(OldX, OldY);
                            OldX = _OldX;
                            OldY = _OldY;
                        }
                        this.CurPage = CurPara.Get_StartPage_Absolute() + CurPara.CurPos.PagesPos;
                        this.Selection_SetStart(OldX, OldY, MouseEvent);
                        this.CurPage = PageIndex;
                        this.Selection_SetEnd(X, Y, e);
                        return;
                    }
                }
            }
            this.Selection_SetStart(X, Y, e);
            if (e.ClickCount <= 1 && 1 !== this.Selection.DragDrop.Flag) {
                this.RecalculateCurPos();
                this.Document_UpdateSelectionState();
            }
        }
    },
    OnMouseUp: function (e, X, Y, PageIndex) {
        if (PageIndex < 0) {
            return;
        }
        if (1 === this.Selection.DragDrop.Flag) {
            this.Selection.DragDrop.Flag = -1;
            var OldCurPage = this.CurPage;
            this.CurPage = this.Selection.DragDrop.Data.PageNum;
            this.Selection_SetStart(this.Selection.DragDrop.Data.X, this.Selection.DragDrop.Data.Y, e);
            this.Selection.DragDrop.Flag = 0;
            this.Selection.DragDrop.Data = null;
        }
        if (g_mouse_button_right === e.Button) {
            if (true === this.Selection.Start) {
                return;
            }
            var ConvertedPos = this.DrawingDocument.ConvertCoordsToCursorWR(X, Y, PageIndex);
            var X_abs = ConvertedPos.X;
            var Y_abs = ConvertedPos.Y;
            if (true === this.DrawingDocument.IsCursorInTableCur(X, Y, PageIndex)) {
                var Table = this.DrawingDocument.TableOutlineDr.TableOutline.Table;
                Table.Select_All();
                Table.Document_SetThisElementCurrent(false);
                this.Document_UpdateSelectionState();
                this.Document_UpdateInterfaceState();
                editor.sync_ContextMenuCallback({
                    Type: c_oAscContextMenuTypes.Common,
                    X_abs: X_abs,
                    Y_abs: Y_abs
                });
                return;
            }
            var pFlowTable = this.DrawingObjects.getTableByXY(X, Y, PageIndex, this);
            var nInDrawing = this.DrawingObjects.isPointInDrawingObjects(X, Y, PageIndex, this);
            if (docpostype_HdrFtr != this.CurPos.Type && -1 === nInDrawing && null === pFlowTable) {
                var PageMetrics = this.Get_PageContentStartPos(this.CurPage, this.Pages[this.CurPage].Pos);
                if (Y <= PageMetrics.Y) {
                    editor.sync_ContextMenuCallback({
                        Type: c_oAscContextMenuTypes.ChangeHdrFtr,
                        X_abs: X_abs,
                        Y_abs: Y_abs,
                        Header: true,
                        PageNum: PageIndex
                    });
                    return;
                } else {
                    if (Y > PageMetrics.YLimit) {
                        editor.sync_ContextMenuCallback({
                            Type: c_oAscContextMenuTypes.ChangeHdrFtr,
                            X_abs: X_abs,
                            Y_abs: Y_abs,
                            Header: false,
                            PageNum: PageIndex
                        });
                        return;
                    }
                }
            }
            if (false === this.Selection_Check(X, Y, PageIndex, undefined)) {
                this.CurPage = PageIndex;
                var MouseEvent_new = {
                    ClickCount: 1,
                    Type: g_mouse_event_type_down,
                    CtrlKey: false,
                    Button: g_mouse_button_right
                };
                this.Selection_SetStart(X, Y, MouseEvent_new);
                MouseEvent_new.Type = g_mouse_event_type_up;
                this.Selection_SetEnd(X, Y, MouseEvent_new);
                this.Document_UpdateSelectionState();
                this.Document_UpdateRulersState();
                this.Document_UpdateInterfaceState();
            }
            editor.sync_ContextMenuCallback({
                Type: c_oAscContextMenuTypes.Common,
                X_abs: X_abs,
                Y_abs: Y_abs
            });
            this.private_UpdateCursorXY(true, true);
            return;
        } else {
            if (g_mouse_button_left === e.Button) {
                if (true === this.Comments.Is_Use()) {
                    var Type = (docpostype_HdrFtr === this.CurPos.Type ? comment_type_HdrFtr : comment_type_Common);
                    var Comment = this.Comments.Get_ByXY(PageIndex, X, Y, Type);
                    if (null != Comment) {
                        var Comment_PageNum = Comment.m_oStartInfo.PageNum;
                        var Comment_Y = Comment.m_oStartInfo.Y;
                        var Comment_X = this.Get_PageLimits(PageIndex).XLimit;
                        var Para = g_oTableId.Get_ById(Comment.StartId);
                        var TextTransform = Para.Get_ParentTextTransform();
                        if (TextTransform) {
                            Comment_Y = TextTransform.TransformPointY(Comment.m_oStartInfo.X, Comment.m_oStartInfo.Y);
                        }
                        var Coords = this.DrawingDocument.ConvertCoordsToCursorWR(Comment_X, Comment_Y, Comment_PageNum);
                        this.Select_Comment(Comment.Get_Id(), false);
                        editor.sync_ShowComment(Comment.Get_Id(), Coords.X, Coords.Y);
                    } else {
                        this.Select_Comment(null, false);
                        editor.sync_HideComment();
                    }
                }
            }
        }
        if (true === this.Selection.Start) {
            this.CurPage = PageIndex;
            this.Selection.Start = false;
            this.Selection_SetEnd(X, Y, e);
            this.Document_UpdateSelectionState();
            if (c_oAscFormatPainterState.kOff !== editor.isPaintFormat) {
                if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                    this.Create_NewHistoryPoint(historydescription_Document_FormatPasteHotKey2);
                    this.Document_Format_Paste();
                }
                if (c_oAscFormatPainterState.kOn === editor.isPaintFormat) {
                    editor.sync_PaintFormatCallback(c_oAscFormatPainterState.kOff);
                }
            }
            if (true === editor.isMarkerFormat && true === this.Is_TextSelectionUse()) {
                if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                    this.Create_NewHistoryPoint(historydescription_Document_SetTextHighlight2);
                    var ParaItem = null;
                    if (this.HighlightColor != highlight_None) {
                        var TextPr = this.Get_Paragraph_TextPr();
                        if ("undefined" === typeof(TextPr.HighLight) || null === TextPr.HighLight || highlight_None === TextPr.HighLight || this.HighlightColor.r != TextPr.HighLight.r || this.HighlightColor.g != TextPr.HighLight.g || this.HighlightColor.b != TextPr.HighLight.b) {
                            ParaItem = new ParaTextPr({
                                HighLight: this.HighlightColor
                            });
                        } else {
                            ParaItem = new ParaTextPr({
                                HighLight: highlight_None
                            });
                        }
                    } else {
                        ParaItem = new ParaTextPr({
                            HighLight: this.HighlightColor
                        });
                    }
                    this.Paragraph_Add(ParaItem);
                    this.Cursor_MoveAt(X, Y, false);
                    this.Document_UpdateSelectionState();
                    editor.sync_MarkerFormatCallback(true);
                }
            }
        }
        this.private_UpdateCursorXY(true, true);
    },
    OnMouseMove: function (e, X, Y, PageIndex) {
        if (PageIndex < 0) {
            return;
        }
        this.Update_CursorType(X, Y, PageIndex, e);
        if (1 === this.Selection.DragDrop.Flag) {
            if (Math.abs(this.Selection.DragDrop.Data.X - X) > 0.001 || Math.abs(this.Selection.DragDrop.Data.Y - Y) > 0.001) {
                this.Selection.DragDrop.Flag = 0;
                this.Selection.DragDrop.Data = null;
                editor.sync_MouseMoveStartCallback();
                editor.sync_MouseMoveCallback(new CMouseMoveData());
                editor.sync_MouseMoveEndCallback();
                this.DrawingDocument.StartTrackText();
            }
            return;
        }
        if (true === this.Selection.Use && true === this.Selection.Start) {
            this.CurPage = PageIndex;
            this.Selection_SetEnd(X, Y, e);
            this.Document_UpdateSelectionState();
        }
    },
    Get_Numbering: function () {
        return this.Numbering;
    },
    Internal_GetNumInfo: function (ParaId, NumPr) {
        this.NumInfoCounter++;
        var NumInfo = new Array(NumPr.Lvl + 1);
        for (var Index = 0; Index < NumInfo.length; Index++) {
            NumInfo[Index] = 0;
        }
        var Restart = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
        var AbstractNum = null;
        if ("undefined" != typeof(this.Numbering) && null != (AbstractNum = this.Numbering.Get_AbstractNum(NumPr.NumId))) {
            for (var LvlIndex = 0; LvlIndex < 9; LvlIndex++) {
                Restart[LvlIndex] = AbstractNum.Lvl[LvlIndex].Restart;
            }
        }
        var PrevLvl = -1;
        for (var Index = 0; Index < this.Content.length; Index++) {
            var Item = this.Content[Index];
            var ItemNumPr = null;
            if (type_Paragraph == Item.GetType() && undefined != (ItemNumPr = Item.Numbering_Get()) && ItemNumPr.NumId == NumPr.NumId && (undefined === Item.Get_SectionPr() || true !== Item.IsEmpty())) {
                if (-1 != PrevLvl && PrevLvl < ItemNumPr.Lvl) {
                    for (var Index2 = PrevLvl + 1; Index2 < 9; Index2++) {
                        if (0 != Restart[Index2] && (-1 == Restart[Index2] || PrevLvl <= (Restart[Index2] - 1))) {
                            NumInfo[Index2] = 0;
                        }
                    }
                }
                if ("undefined" == typeof(NumInfo[ItemNumPr.Lvl])) {
                    NumInfo[ItemNumPr.Lvl] = 0;
                } else {
                    NumInfo[ItemNumPr.Lvl]++;
                }
                for (var Index2 = ItemNumPr.Lvl - 1; Index2 >= 0; Index2--) {
                    if ("undefined" == typeof(NumInfo[Index2]) || 0 == NumInfo[Index2]) {
                        NumInfo[Index2] = 1;
                    }
                }
                PrevLvl = ItemNumPr.Lvl;
            }
            if (ParaId == Item.GetId()) {
                break;
            }
        }
        return NumInfo;
    },
    Get_Styles: function () {
        return this.Styles;
    },
    Get_TableStyleForPara: function () {
        return null;
    },
    Get_ShapeStyleForPara: function () {
        return null;
    },
    Get_TextBackGroundColor: function () {
        return undefined;
    },
    Content_GetPrev: function (Id) {
        var Index = this.Internal_Content_Find(Id);
        if (Index > 0) {
            return this.Content[Index - 1];
        }
        return null;
    },
    Content_GetNext: function (Id) {
        var Index = this.Internal_Content_Find(Id);
        if (-1 != Index && Index < this.Content.length - 1) {
            return this.Content[Index + 1];
        }
        return null;
    },
    Internal_Content_Find: function (Id) {
        return 0;
        for (var Index = 0; Index < this.Content.length; Index++) {
            if (this.Content[Index].GetId() === Id) {
                return Index;
            }
        }
        return -1;
    },
    Select_DrawingObject: function (Id) {
        this.Selection_Remove();
        this.DrawingDocument.TargetEnd();
        this.DrawingDocument.SetCurrentPage(this.CurPage);
        this.Selection.Start = false;
        this.Selection.Use = true;
        this.CurPos.Type = docpostype_DrawingObjects;
        this.DrawingObjects.selectById(Id, this.CurPage);
        this.Document_UpdateInterfaceState();
        this.Document_UpdateSelectionState();
    },
    Get_NearestPos: function (PageNum, X, Y, bAnchor, Drawing) {
        if (undefined === bAnchor) {
            bAnchor = false;
        }
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Get_NearestPos(PageNum, X, Y, bAnchor, Drawing);
        }
        var bInText = (null === this.Is_InText(X, Y, PageNum) ? false : true);
        var nInDrawing = this.DrawingObjects.isPointInDrawingObjects(X, Y, PageNum, this);
        if (true != bAnchor) {
            var NearestPos = this.DrawingObjects.getNearestPos(X, Y, PageNum, Drawing);
            if ((nInDrawing === DRAWING_ARRAY_TYPE_BEFORE || nInDrawing === DRAWING_ARRAY_TYPE_INLINE || (false === bInText && nInDrawing >= 0)) && null != NearestPos) {
                return NearestPos;
            }
        }
        var ContentPos = this.Internal_GetContentPosByXY(X, Y, PageNum);
        if (true === bAnchor && ContentPos > 0 && PageNum > 0 && ContentPos === this.Pages[PageNum].Pos && ContentPos === this.Pages[PageNum - 1].EndPos && this.Pages[PageNum].EndPos > this.Pages[PageNum].Pos && type_Paragraph === this.Content[ContentPos].GetType() && true === this.Content[ContentPos].Is_ContentOnFirstPage()) {
            ContentPos++;
        }
        return this.Content[ContentPos].Get_NearestPos(PageNum, X, Y, bAnchor, Drawing);
    },
    Internal_Content_Add: function (Position, NewObject) {
        if (Position < 0 || Position > this.Content.length) {
            return;
        }
        var PrevObj = this.Content[Position - 1];
        var NextObj = this.Content[Position];
        if ("undefined" == typeof(PrevObj)) {
            PrevObj = null;
        }
        if ("undefined" == typeof(NextObj)) {
            NextObj = null;
        }
        this.History.Add(this, {
            Type: historyitem_Document_AddItem,
            Pos: Position,
            Item: NewObject
        });
        this.Content.splice(Position, 0, NewObject);
        NewObject.Set_Parent(this);
        NewObject.Set_DocumentNext(NextObj);
        NewObject.Set_DocumentPrev(PrevObj);
        if (null != PrevObj) {
            PrevObj.Set_DocumentNext(NewObject);
        }
        if (null != NextObj) {
            NextObj.Set_DocumentPrev(NewObject);
        }
        this.SectionsInfo.Update_OnAdd(Position, [NewObject]);
        this.Check_SectionLastParagraph();
        if (type_Table == this.Content[this.Content.length - 1].GetType()) {
            this.Internal_Content_Add(this.Content.length, new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0));
        }
        this.protected_ReindexContent(Position);
    },
    Internal_Content_Remove: function (Position, Count) {
        var ChangePos = -1;
        if (Position < 0 || Position >= this.Content.length || Count <= 0) {
            return -1;
        }
        var PrevObj = this.Content[Position - 1];
        var NextObj = this.Content[Position + Count];
        if ("undefined" == typeof(PrevObj)) {
            PrevObj = null;
        }
        if ("undefined" == typeof(NextObj)) {
            NextObj = null;
        }
        for (var Index = 0; Index < Count; Index++) {
            this.Content[Position + Index].PreDelete();
        }
        this.History.Add(this, {
            Type: historyitem_Document_RemoveItem,
            Pos: Position,
            Items: this.Content.slice(Position, Position + Count)
        });
        this.Content.splice(Position, Count);
        if (null != PrevObj) {
            PrevObj.Set_DocumentNext(NextObj);
        }
        if (null != NextObj) {
            NextObj.Set_DocumentPrev(PrevObj);
        }
        if (type_Table == this.Content[this.Content.length - 1].GetType()) {
            this.Internal_Content_Add(this.Content.length, new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0));
        }
        this.SectionsInfo.Update_OnRemove(Position, Count);
        this.Check_SectionLastParagraph();
        this.Check_FramePrLastParagraph();
        this.protected_ReindexContent(Position);
        return ChangePos;
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
    Document_AddPageNum: function (AlignV, AlignH) {
        if (AlignV >= 0) {
            var PageIndex = this.CurPage;
            if (docpostype_HdrFtr === this.CurPos.Type) {
                PageIndex = this.HdrFtr.Get_CurPage();
            }
            if (PageIndex < 0) {
                PageIndex = this.CurPage;
            }
            this.Create_HdrFtrWidthPageNum(PageIndex, AlignV, AlignH);
        } else {
            this.Paragraph_Add(new ParaPageNum());
        }
        this.Document_UpdateInterfaceState();
    },
    Document_SetHdrFtrFirstPage: function (Value) {
        var CurHdrFtr = this.HdrFtr.CurHdrFtr;
        if (null === CurHdrFtr || -1 === CurHdrFtr.RecalcInfo.CurPage) {
            return;
        }
        var CurPage = CurHdrFtr.RecalcInfo.CurPage;
        var Index = this.Pages[CurPage].Pos;
        var SectPr = this.SectionsInfo.Get_SectPr(Index).SectPr;
        SectPr.Set_TitlePage(Value);
        if (true === Value) {
            var FirstSectPr = this.SectionsInfo.Get_SectPr2(0).SectPr;
            var FirstHeader = FirstSectPr.Get_Header_First();
            var FirstFooter = FirstSectPr.Get_Footer_First();
            if (null === FirstHeader) {
                var Header = new CHeaderFooter(this.HdrFtr, this, this.DrawingDocument, hdrftr_Header);
                FirstSectPr.Set_Header_First(Header);
                this.HdrFtr.Set_CurHdrFtr(Header);
            } else {
                this.HdrFtr.Set_CurHdrFtr(FirstHeader);
            }
            if (null === FirstFooter) {
                var Footer = new CHeaderFooter(this.HdrFtr, this, this.DrawingDocument, hdrftr_Footer);
                FirstSectPr.Set_Footer_First(Footer);
            }
        }
        this.HdrFtr.CurHdrFtr.Content.Cursor_MoveToStartPos();
        this.Recalculate();
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },
    Document_SetHdrFtrEvenAndOddHeaders: function (Value) {
        this.Set_DocumentEvenAndOddHeaders(Value);
        var FirstSectPr;
        if (true === Value) {
            FirstSectPr = this.SectionsInfo.Get_SectPr2(0).SectPr;
            if (null === FirstSectPr.Get_Header_Even()) {
                var Header = new CHeaderFooter(this.HdrFtr, this, this.DrawingDocument, hdrftr_Header);
                FirstSectPr.Set_Header_Even(Header);
            }
            if (null === FirstSectPr.Get_Footer_Even()) {
                var Footer = new CHeaderFooter(this.HdrFtr, this, this.DrawingDocument, hdrftr_Footer);
                FirstSectPr.Set_Footer_Even(Footer);
            }
        } else {
            FirstSectPr = this.SectionsInfo.Get_SectPr2(0).SectPr;
        }
        if (null !== FirstSectPr.Get_Header_First() && true === FirstSectPr.TitlePage) {
            this.HdrFtr.Set_CurHdrFtr(FirstSectPr.Get_Header_First());
        } else {
            this.HdrFtr.Set_CurHdrFtr(FirstSectPr.Get_Header_Default());
        }
        this.Recalculate();
        if (null !== this.HdrFtr.CurHdrFtr) {
            this.HdrFtr.CurHdrFtr.Content.Cursor_MoveToStartPos();
        }
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },
    Document_SetHdrFtrDistance: function (Value) {
        var CurHdrFtr = this.HdrFtr.CurHdrFtr;
        if (null === CurHdrFtr) {
            return;
        }
        var CurPage = CurHdrFtr.RecalcInfo.CurPage;
        if (-1 === CurPage) {
            return;
        }
        var Index = this.Pages[CurPage].Pos;
        var SectPr = this.SectionsInfo.Get_SectPr(Index).SectPr;
        if (hdrftr_Header === CurHdrFtr.Type) {
            SectPr.Set_PageMargins_Header(Value);
        } else {
            SectPr.Set_PageMargins_Footer(Value);
        }
        this.Recalculate();
        this.Document_UpdateRulersState();
        this.Document_UpdateInterfaceState();
    },
    Document_SetHdrFtrBounds: function (Y0, Y1) {
        var CurHdrFtr = this.HdrFtr.CurHdrFtr;
        if (null === CurHdrFtr) {
            return;
        }
        var CurPage = CurHdrFtr.RecalcInfo.CurPage;
        if (-1 === CurPage) {
            return;
        }
        var Index = this.Pages[CurPage].Pos;
        var SectPr = this.SectionsInfo.Get_SectPr(Index).SectPr;
        var Bounds = CurHdrFtr.Get_Bounds();
        if (hdrftr_Header === CurHdrFtr.Type) {
            if (null !== Y0) {
                SectPr.Set_PageMargins_Header(Y0);
            }
            if (null !== Y1) {
                SectPr.Set_PageMargins(undefined, Y1, undefined, undefined);
            }
        } else {
            if (null !== Y0) {
                var H = Bounds.Bottom - Bounds.Top;
                var _Y1 = Y0 + H;
                SectPr.Set_PageMargins_Footer(SectPr.Get_PageHeight() - _Y1);
            }
        }
        this.Recalculate();
        this.Document_UpdateRulersState();
        this.Document_UpdateInterfaceState();
    },
    Document_SetHdrFtrLink: function (bLinkToPrevious) {
        var CurHdrFtr = this.HdrFtr.CurHdrFtr;
        if (docpostype_HdrFtr !== this.CurPos.Type || null === CurHdrFtr || -1 === CurHdrFtr.RecalcInfo.CurPage) {
            return;
        }
        var PageIndex = CurHdrFtr.RecalcInfo.CurPage;
        var Index = this.Pages[PageIndex].Pos;
        var SectPr = this.SectionsInfo.Get_SectPr(Index).SectPr;
        if (SectPr === this.SectionsInfo.Get_SectPr2(0).SectPr) {
            return;
        }
        var SectionPageInfo = this.Get_SectionPageNumInfo(PageIndex);
        var bFirst = (true === SectionPageInfo.bFirst && true === SectPr.Get_TitlePage() ? true : false);
        var bEven = (true === SectionPageInfo.bEven && true === EvenAndOddHeaders ? true : false);
        var bHeader = (hdrftr_Header === CurHdrFtr.Type ? true : false);
        var _CurHdrFtr = SectPr.Get_HdrFtr(bHeader, bFirst, bEven);
        if (true === bLinkToPrevious) {
            if (null === _CurHdrFtr) {
                return;
            }
            _CurHdrFtr.Selection_Remove();
            SectPr.Set_HdrFtr(bHeader, bFirst, bEven, null);
            var HdrFtr = this.Get_SectionHdrFtr(PageIndex, bFirst, bEven);
            if (true === bHeader) {
                if (null === HdrFtr.Header) {
                    CurHdrFtr = this.Create_SectionHdrFtr(hdrftr_Header, PageIndex);
                } else {
                    CurHdrFtr = HdrFtr.Header;
                }
            } else {
                if (null === HdrFtr.Footer) {
                    CurHdrFtr = this.Create_SectionHdrFtr(hdrftr_Footer, PageIndex);
                } else {
                    CurHdrFtr = HdrFtr.Footer;
                }
            }
            this.HdrFtr.Set_CurHdrFtr(CurHdrFtr);
            this.HdrFtr.CurHdrFtr.Cursor_MoveToStartPos(false);
        } else {
            if (null !== _CurHdrFtr) {
                return;
            }
            var NewHdrFtr = CurHdrFtr.Copy();
            SectPr.Set_HdrFtr(bHeader, bFirst, bEven, NewHdrFtr);
            this.HdrFtr.Set_CurHdrFtr(NewHdrFtr);
            this.HdrFtr.CurHdrFtr.Cursor_MoveToStartPos(false);
        }
        this.Recalculate();
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },
    Document_Format_Copy: function () {
        this.CopyTextPr = this.Get_Paragraph_TextPr_Copy();
        this.CopyParaPr = this.Get_Paragraph_ParaPr_Copy();
    },
    Document_End_HdrFtrEditing: function () {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            var CurHdrFtr = this.HdrFtr.CurHdrFtr;
            if (null == CurHdrFtr) {
                return;
            }
            CurHdrFtr.Selection_Remove();
            this.CurPos.Type = docpostype_Content;
            if (hdrftr_Header == CurHdrFtr.Type) {
                this.Cursor_MoveAt(0, 0, false);
            } else {
                this.Cursor_MoveAt(0, 100000, false);
            }
            this.DrawingDocument.ClearCachePages();
            this.DrawingDocument.FirePaint();
            this.Document_UpdateRulersState();
            this.Document_UpdateInterfaceState();
            this.Document_UpdateSelectionState();
        }
    },
    Document_Format_Paste: function () {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Paragraph_Format_Paste(this.CopyTextPr, this.CopyParaPr, false);
        } else {
            if (docpostype_DrawingObjects == this.CurPos.Type) {
                this.DrawingObjects.paragraphFormatPaste(this.CopyTextPr, this.CopyParaPr, false);
            } else {
                if (true === this.Selection.Use) {
                    switch (this.Selection.Flag) {
                    case selectionflag_Numbering:
                        return;
                    case selectionflag_Common:
                        var Start = this.Selection.StartPos;
                        var End = this.Selection.EndPos;
                        if (Start > End) {
                            Start = this.Selection.EndPos;
                            End = this.Selection.StartPos;
                        }
                        for (var Pos = Start; Pos <= End; Pos++) {
                            this.Content[Pos].Paragraph_Format_Paste(this.CopyTextPr, this.CopyParaPr, (Start === End ? false : true));
                        }
                        this.ContentLastChangePos = Math.max(Start - 1, 0);
                        this.Recalculate();
                        break;
                    }
                } else {
                    this.Content[this.CurPos.ContentPos].Paragraph_Format_Paste(this.CopyTextPr, this.CopyParaPr, true);
                    this.ContentLastChangePos = this.CurPos.ContentPos - 1;
                    this.Recalculate();
                }
            }
        }
        this.Document_UpdateInterfaceState();
        this.Document_UpdateSelectionState();
    },
    Is_TableCellContent: function () {
        return false;
    },
    Is_TopDocument: function (bReturnTopDocument) {
        if (true === bReturnTopDocument) {
            return this;
        }
        return true;
    },
    Is_InTable: function (bReturnTopTable) {
        if (true === bReturnTopTable) {
            return null;
        }
        return false;
    },
    Is_DrawingShape: function () {
        return false;
    },
    Is_HdrFtr: function (bReturnHdrFtr) {
        if (true === bReturnHdrFtr) {
            return null;
        }
        return false;
    },
    Is_SelectionUse: function () {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Is_SelectionUse();
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return this.DrawingObjects.isSelectionUse();
            } else {
                if (true === this.Selection.Use) {
                    return true;
                }
                return false;
            }
        }
    },
    Is_TextSelectionUse: function () {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Is_TextSelectionUse();
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return this.DrawingObjects.isTextSelectionUse();
            } else {
                return this.Selection.Use;
            }
        }
    },
    Get_CurPosXY: function () {
        var TempXY;
        if (docpostype_HdrFtr === this.CurPos.Type) {
            TempXY = this.HdrFtr.Get_CurPosXY();
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                TempXY = this.DrawingObjects.getCurPosXY();
            } else {
                if (true === this.Selection.Use) {
                    if (selectionflag_Numbering === this.Selection.Flag) {
                        TempXY = {
                            X: 0,
                            Y: 0
                        };
                    } else {
                        TempXY = this.Content[this.Selection.EndPos].Get_CurPosXY();
                    }
                } else {
                    TempXY = this.Content[this.CurPos.ContentPos].Get_CurPosXY();
                }
            }
        }
        this.Internal_CheckCurPage();
        return {
            X: TempXY.X,
            Y: TempXY.Y,
            PageNum: this.CurPage
        };
    },
    Get_SelectedText: function (bClearText) {
        if ("undefined" === typeof(bClearText)) {
            bClearText = false;
        }
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Get_SelectedText(bClearText);
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return this.DrawingObjects.getSelectedText(bClearText);
            } else {
                if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && selectionflag_Common === this.Selection.Flag) || false === this.Selection.Use)) {
                    if (true === bClearText && this.Selection.StartPos === this.Selection.EndPos) {
                        var Pos = (true == this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos);
                        return this.Content[Pos].Get_SelectedText(true);
                    } else {
                        if (false === bClearText) {
                            var StartPos = (true == this.Selection.Use ? Math.min(this.Selection.StartPos, this.Selection.EndPos) : this.CurPos.ContentPos);
                            var EndPos = (true == this.Selection.Use ? Math.max(this.Selection.StartPos, this.Selection.EndPos) : this.CurPos.ContentPos);
                            var ResultText = "";
                            for (var Index = StartPos; Index <= EndPos; Index++) {
                                ResultText += this.Content[Index].Get_SelectedText(false);
                            }
                            return ResultText;
                        }
                    }
                }
            }
        }
        return null;
    },
    Get_CurrentParagraph: function () {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Get_CurrentParagraph();
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return this.DrawingObjects.getCurrentParagraph();
            } else {
                if (true === this.Selection.Use) {
                    return null;
                }
                if (this.CurPos.ContentPos < 0) {
                    return null;
                }
                if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
                    if (true == this.Selection.Use) {
                        return this.Content[this.Selection.StartPos].Get_CurrentParagraph();
                    } else {
                        return this.Content[this.CurPos.ContentPos].Get_CurrentParagraph();
                    }
                } else {
                    if (type_Paragraph == this.Content[this.CurPos.ContentPos].GetType()) {
                        return this.Content[this.CurPos.ContentPos];
                    }
                }
                return null;
            }
        }
    },
    Get_SelectedElementsInfo: function () {
        var Info = new CSelectedElementsInfo();
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Get_SelectedElementsInfo(Info);
        } else {
            if (docpostype_DrawingObjects == this.CurPos.Type) {
                this.DrawingObjects.getSelectedElementsInfo(Info);
            } else {
                if (docpostype_Content == this.CurPos.Type) {
                    if (true === this.Selection.Use) {
                        if (selectionflag_Numbering === this.Selection.Flag) {
                            if (! (null == this.Selection.Data || this.Selection.Data.length <= 0)) {
                                var CurPara = this.Content[this.Selection.Data[0]];
                                for (var Index = 0; Index < this.Selection.Data.length; Index++) {
                                    if (this.CurPos.ContentPos === this.Selection.Data[Index]) {
                                        CurPara = this.Content[this.Selection.Data[Index]];
                                    }
                                }
                                CurPara.Get_SelectedElementsInfo(Info);
                            }
                        } else {
                            if (this.Selection.StartPos != this.Selection.EndPos) {
                                Info.Set_MixedSelection();
                            } else {
                                this.Content[this.Selection.StartPos].Get_SelectedElementsInfo(Info);
                            }
                        }
                    } else {
                        this.Content[this.CurPos.ContentPos].Get_SelectedElementsInfo(Info);
                    }
                }
            }
        }
        return Info;
    },
    Table_AddRow: function (bBefore) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Table_AddRow(bBefore);
            this.Recalculate();
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                this.DrawingObjects.tableAddRow(bBefore);
            } else {
                if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
                    var Pos = 0;
                    if (true === this.Selection.Use) {
                        Pos = this.Selection.StartPos;
                    } else {
                        Pos = this.CurPos.ContentPos;
                    }
                    this.Content[Pos].Row_Add(bBefore);
                    if (false === this.Selection.Use && true === this.Content[Pos].Is_SelectionUse()) {
                        this.Selection.Use = true;
                        this.Selection.StartPos = Pos;
                        this.Selection.EndPos = Pos;
                    }
                    this.ContentLastChangePos = Pos;
                    this.Recalculate();
                }
            }
        }
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },
    Table_AddCol: function (bBefore) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Table_AddCol(bBefore);
            this.Recalculate();
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                this.DrawingObjects.tableAddCol(bBefore);
            } else {
                if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
                    var Pos = 0;
                    if (true === this.Selection.Use) {
                        Pos = this.Selection.StartPos;
                    } else {
                        Pos = this.CurPos.ContentPos;
                    }
                    this.Content[Pos].Col_Add(bBefore);
                    if (false === this.Selection.Use && true === this.Content[Pos].Is_SelectionUse()) {
                        this.Selection.Use = true;
                        this.Selection.StartPos = Pos;
                        this.Selection.EndPos = Pos;
                    }
                    this.ContentLastChangePos = Pos;
                    this.Recalculate();
                }
            }
        }
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },
    Table_RemoveRow: function () {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Table_RemoveRow();
            this.Recalculate();
        } else {
            if (docpostype_DrawingObjects == this.CurPos.Type) {
                this.DrawingObjects.tableRemoveRow();
            } else {
                if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
                    var Pos = 0;
                    if (true === this.Selection.Use) {
                        Pos = this.Selection.StartPos;
                    } else {
                        Pos = this.CurPos.ContentPos;
                    }
                    if (false === this.Content[Pos].Row_Remove()) {
                        this.Table_RemoveTable();
                    } else {
                        this.ContentLastChangePos = Pos;
                        this.Recalculate();
                    }
                }
            }
        }
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },
    Table_RemoveCol: function () {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Table_RemoveCol();
            this.Recalculate();
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                this.DrawingObjects.tableRemoveCol();
            } else {
                if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
                    var Pos = 0;
                    if (true === this.Selection.Use) {
                        Pos = this.Selection.StartPos;
                    } else {
                        Pos = this.CurPos.ContentPos;
                    }
                    if (false === this.Content[Pos].Col_Remove()) {
                        this.Table_RemoveTable();
                    } else {
                        this.ContentLastChangePos = Pos;
                        this.Recalculate();
                    }
                }
            }
        }
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },
    Table_MergeCells: function () {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Table_MergeCells();
            this.Recalculate();
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                this.DrawingObjects.tableMergeCells();
            } else {
                if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
                    var Pos = 0;
                    if (true === this.Selection.Use) {
                        Pos = this.Selection.StartPos;
                    } else {
                        Pos = this.CurPos.ContentPos;
                    }
                    this.Content[Pos].Cell_Merge();
                    this.ContentLastChangePos = Pos;
                    this.Recalculate();
                }
            }
        }
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },
    Table_SplitCell: function (Cols, Rows) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Table_SplitCell(Cols, Rows);
            this.Recalculate();
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                this.DrawingObjects.tableSplitCell(Cols, Rows);
            } else {
                if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
                    var Pos = 0;
                    if (true === this.Selection.Use) {
                        Pos = this.Selection.StartPos;
                    } else {
                        Pos = this.CurPos.ContentPos;
                    }
                    this.Content[Pos].Cell_Split(Rows, Cols);
                    this.ContentLastChangePos = Pos;
                    this.Recalculate();
                }
            }
        }
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },
    Table_RemoveTable: function () {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Table_RemoveTable();
            this.Recalculate();
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return this.DrawingObjects.tableRemoveTable();
            } else {
                if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
                    var Pos;
                    if (true === this.Selection.Use) {
                        Pos = this.Selection.StartPos;
                    } else {
                        Pos = this.CurPos.ContentPos;
                    }
                    var Table = this.Content[Pos];
                    if (true === Table.Is_InnerTable()) {
                        Table.Remove_InnerTable();
                    } else {
                        this.Selection_Remove();
                        Table.PreDelete();
                        this.Internal_Content_Remove(Pos, 1);
                        if (Pos >= this.Content.length - 1) {
                            Pos--;
                        }
                        if (Pos < 0) {
                            Pos = 0;
                        }
                        this.CurPos.Type = docpostype_Content;
                        this.CurPos.ContentPos = Pos;
                        this.Content[Pos].Cursor_MoveToStartPos();
                        this.ContentLastChangePos = Pos;
                        this.Recalculate();
                    }
                    this.Document_UpdateSelectionState();
                    this.Document_UpdateInterfaceState();
                    this.Document_UpdateRulersState();
                }
            }
        }
    },
    Table_Select: function (Type) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Table_Select(Type);
        } else {
            if (docpostype_DrawingObjects == this.CurPos.Type) {
                this.DrawingObjects.tableSelect(Type);
            } else {
                if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
                    var Pos = 0;
                    if (true === this.Selection.Use) {
                        Pos = this.Selection.StartPos;
                    } else {
                        Pos = this.CurPos.ContentPos;
                    }
                    this.Content[Pos].Table_Select(Type);
                    if (false === this.Selection.Use && true === this.Content[Pos].Is_SelectionUse()) {
                        this.Selection.Use = true;
                        this.Selection.StartPos = Pos;
                        this.Selection.EndPos = Pos;
                    }
                }
            }
        }
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },
    Table_CheckMerge: function () {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Table_CheckMerge();
        } else {
            if (docpostype_DrawingObjects == this.CurPos.Type) {
                return this.DrawingObjects.tableCheckMerge();
            } else {
                if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
                    var Pos = 0;
                    if (true === this.Selection.Use) {
                        Pos = this.Selection.StartPos;
                    } else {
                        Pos = this.CurPos.ContentPos;
                    }
                    return this.Content[Pos].Check_Merge();
                }
            }
        }
        return false;
    },
    Table_CheckSplit: function () {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Table_CheckSplit();
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return this.DrawingObjects.tableCheckSplit();
            } else {
                if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
                    var Pos = 0;
                    if (true === this.Selection.Use) {
                        Pos = this.Selection.StartPos;
                    } else {
                        Pos = this.CurPos.ContentPos;
                    }
                    return this.Content[Pos].Check_Split();
                }
            }
        }
        return false;
    },
    Check_TableCoincidence: function (Table) {
        return false;
    },
    Document_CreateFontMap: function () {
        var StartTime = new Date().getTime();
        var FontMap = {};
        this.SectionsInfo.Document_CreateFontMap(FontMap);
        var CurPage = 0;
        this.DrawingObjects.documentCreateFontMap(CurPage, FontMap);
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            var Element = this.Content[Index];
            Element.Document_CreateFontMap(FontMap);
            if (Element.Pages.length > 1) {
                for (var TempIndex = 1; TempIndex < Element.Pages.length - 1; TempIndex++) {
                    this.DrawingObjects.documentCreateFontMap(++CurPage, FontMap);
                }
            }
        }
        checkThemeFonts(FontMap, this.theme.themeElements.fontScheme);
        return FontMap;
    },
    Document_CreateFontCharMap: function (FontCharMap) {
        this.SectionsInfo.Document_CreateFontCharMap(FontCharMap);
        this.DrawingObjects.documentCreateFontCharMap(FontCharMap);
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            var Element = this.Content[Index];
            Element.Document_CreateFontCharMap(FontCharMap);
        }
    },
    Document_Get_AllFontNames: function () {
        var AllFonts = {};
        this.SectionsInfo.Document_Get_AllFontNames(AllFonts);
        this.Numbering.Document_Get_AllFontNames(AllFonts);
        this.Styles.Document_Get_AllFontNames(AllFonts);
        this.theme.Document_Get_AllFontNames(AllFonts);
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            var Element = this.Content[Index];
            Element.Document_Get_AllFontNames(AllFonts);
        }
        checkThemeFonts(AllFonts, this.theme.themeElements.fontScheme);
        return AllFonts;
    },
    Document_UpdateInterfaceState: function () {
        if (true === this.TurnOffInterfaceEvents) {
            return;
        }
        if (true === CollaborativeEditing.m_bGlobalLockSelection) {
            return;
        }
        editor.sync_BeginCatchSelectedElements();
        editor.ClearPropObjCallback();
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.Interface_Update_HdrFtrPr();
            this.HdrFtr.Document_UpdateInterfaceState();
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var drawin_objects = this.DrawingObjects;
                if (drawin_objects.selection.textSelection || drawin_objects.selection.groupSelection && drawin_objects.selection.groupSelection.selection.textSelection || drawin_objects.selection.chartSelection && drawin_objects.selection.chartSelection.selection.textSelection) {
                    this.Interface_Update_DrawingPr();
                    this.DrawingObjects.documentUpdateInterfaceState();
                } else {
                    this.DrawingObjects.documentUpdateInterfaceState();
                    this.Interface_Update_DrawingPr();
                }
            } else {
                if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Table == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Table == this.Content[this.CurPos.ContentPos].GetType()))) {
                    this.Interface_Update_TablePr();
                    if (true == this.Selection.Use) {
                        this.Content[this.Selection.StartPos].Document_UpdateInterfaceState();
                    } else {
                        this.Content[this.CurPos.ContentPos].Document_UpdateInterfaceState();
                    }
                } else {
                    this.Interface_Update_ParaPr();
                    this.Interface_Update_TextPr();
                    if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos && type_Paragraph == this.Content[this.Selection.StartPos].GetType()) || (false == this.Selection.Use && type_Paragraph == this.Content[this.CurPos.ContentPos].GetType()))) {
                        if (true == this.Selection.Use) {
                            this.Content[this.Selection.StartPos].Document_UpdateInterfaceState();
                        } else {
                            this.Content[this.CurPos.ContentPos].Document_UpdateInterfaceState();
                        }
                    }
                }
            }
        }
        editor.sync_EndCatchSelectedElements();
        this.Document_UpdateUndoRedoState();
        this.Document_UpdateCanAddHyperlinkState();
        this.Document_UpdateSectionPr();
    },
    Document_UpdateRulersState: function () {
        if (true === this.TurnOffInterfaceEvents) {
            return;
        }
        if (true === CollaborativeEditing.m_bGlobalLockSelection) {
            return;
        }
        this.DrawingDocument.Set_RulerState_Start();
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Document_UpdateRulersState(this.CurPage);
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                this.DrawingDocument.Set_RulerState_Paragraph(null);
                this.Document_UpdateRulersStateBySection(this.CurPos.ContentPos);
                this.DrawingObjects.documentUpdateRulersState();
            } else {
                if (true === this.Selection.Use) {
                    if (this.Selection.StartPos == this.Selection.EndPos && type_Table === this.Content[this.Selection.StartPos].GetType()) {
                        this.Content[this.Selection.StartPos].Document_UpdateRulersState(this.CurPage);
                    } else {
                        var StartPos = (this.Selection.EndPos <= this.Selection.StartPos ? this.Selection.EndPos : this.Selection.StartPos);
                        var EndPos = (this.Selection.EndPos <= this.Selection.StartPos ? this.Selection.StartPos : this.Selection.EndPos);
                        var FramePr = undefined;
                        for (var Pos = StartPos; Pos <= EndPos; Pos++) {
                            var Element = this.Content[Pos];
                            if (type_Paragraph != Element.GetType()) {
                                FramePr = undefined;
                                break;
                            } else {
                                var TempFramePr = Element.Get_FramePr();
                                if (undefined === FramePr) {
                                    if (undefined === TempFramePr) {
                                        break;
                                    }
                                    FramePr = TempFramePr;
                                } else {
                                    if (undefined === TempFramePr || false === FramePr.Compare(TempFramePr)) {
                                        FramePr = undefined;
                                        break;
                                    }
                                }
                            }
                        }
                        if (undefined === FramePr) {
                            this.Document_UpdateRulersStateBySection();
                        } else {
                            this.Content[StartPos].Document_UpdateRulersState();
                        }
                    }
                } else {
                    this.Internal_CheckCurPage();
                    var Item = this.Content[this.CurPos.ContentPos];
                    if (type_Table === Item.GetType()) {
                        Item.Document_UpdateRulersState(this.CurPage);
                    } else {
                        Item.Document_UpdateRulersState();
                    }
                }
            }
        }
        this.DrawingDocument.Set_RulerState_End();
    },
    Document_UpdateRulersStateBySection: function (Pos) {
        var CurPos = undefined === Pos ? (this.Selection.Use === true ? this.Selection.EndPos : this.CurPos.ContentPos) : Pos;
        var SectPr = this.SectionsInfo.Get_SectPr(CurPos).SectPr;
        var L = SectPr.Get_PageMargin_Left();
        var T = SectPr.Get_PageMargin_Top();
        var R = SectPr.Get_PageWidth() - SectPr.Get_PageMargin_Right();
        var B = SectPr.Get_PageHeight() - SectPr.Get_PageMargin_Bottom();
        this.DrawingDocument.Set_RulerState_Paragraph({
            L: L,
            T: T,
            R: R,
            B: B
        },
        true);
    },
    Document_UpdateSelectionState: function () {
        if (true === this.TurnOffInterfaceEvents) {
            return;
        }
        if (true === CollaborativeEditing.m_bGlobalLockSelection) {
            return;
        }
        this.DrawingDocument.UpdateTargetTransform(null);
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Document_UpdateSelectionState();
            this.private_UpdateTracks(this.Is_SelectionUse(), this.Selection_IsEmpty());
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                this.DrawingObjects.documentUpdateSelectionState();
                this.private_UpdateTracks(this.Is_SelectionUse(), this.Selection_IsEmpty());
            } else {
                if (true === this.Selection.Use) {
                    if (selectionflag_Numbering == this.Selection.Flag) {
                        this.DrawingDocument.TargetEnd();
                        this.DrawingDocument.SelectEnabled(true);
                        this.DrawingDocument.SelectShow();
                    } else {
                        if (true === this.Selection_Is_TableBorderMove()) {
                            this.DrawingDocument.TargetEnd();
                            this.DrawingDocument.SetCurrentPage(this.CurPage);
                        } else {
                            if (false === this.Selection_IsEmpty()) {
                                if (true !== this.Selection.Start) {
                                    this.Internal_CheckCurPage();
                                    this.RecalculateCurPos();
                                }
                                this.private_UpdateTracks(true, false);
                                this.DrawingDocument.TargetEnd();
                                this.DrawingDocument.SelectEnabled(true);
                                this.DrawingDocument.SelectShow();
                            } else {
                                if (true !== this.Selection.Start) {
                                    this.Selection_Remove();
                                }
                                this.Internal_CheckCurPage();
                                this.RecalculateCurPos();
                                this.private_UpdateTracks(true, true);
                                this.DrawingDocument.SelectEnabled(false);
                                this.DrawingDocument.TargetStart();
                                this.DrawingDocument.TargetShow();
                            }
                        }
                    }
                } else {
                    this.Selection_Remove();
                    this.Internal_CheckCurPage();
                    this.RecalculateCurPos();
                    this.private_UpdateTracks(false, false);
                    this.DrawingDocument.SelectEnabled(false);
                    this.DrawingDocument.TargetShow();
                }
            }
        }
        this.Document_UpdateCopyCutState();
    },
    private_UpdateTracks: function (bSelection, bEmptySelection) {
        var Pos = (true === this.Selection.Use && selectionflag_Numbering !== this.Selection.Flag ? this.Selection.EndPos : this.CurPos.ContentPos);
        if (docpostype_Content === this.CurPos.Type && !(Pos >= 0 && (null === this.FullRecalc.Id || this.FullRecalc.StartIndex > Pos))) {
            return;
        }
        var oSelectedInfo = this.Get_SelectedElementsInfo();
        var Math = oSelectedInfo.Get_Math();
        if (null !== Math) {
            var Bounds = Math.Get_Bounds();
            this.DrawingDocument.Update_MathTrack(true, (false === bSelection || true === bEmptySelection ? true : false), Math, Bounds.X, Bounds.Y, Bounds.W, Bounds.H, Bounds.Page);
        } else {
            this.DrawingDocument.Update_MathTrack(false);
        }
    },
    Document_UpdateUndoRedoState: function () {
        if (true === this.TurnOffInterfaceEvents) {
            return;
        }
        if (true === CollaborativeEditing.m_bGlobalLockSelection) {
            return;
        }
        editor.sync_CanUndoCallback(this.History.Can_Undo());
        editor.sync_CanRedoCallback(this.History.Can_Redo());
        if (true === History.Have_Changes()) {
            editor.SetDocumentModified(true);
            editor._onUpdateDocumentCanSave();
        } else {
            editor.SetUnchangedDocument();
        }
    },
    Document_UpdateCopyCutState: function () {
        if (true === this.TurnOffInterfaceEvents) {
            return;
        }
        if (true === CollaborativeEditing.m_bGlobalLockSelection) {
            return;
        }
        if (true === this.Selection.Start) {
            return;
        }
        editor.sync_CanCopyCutCallback(this.Can_CopyCut());
    },
    Document_UpdateCanAddHyperlinkState: function () {
        if (true === this.TurnOffInterfaceEvents) {
            return;
        }
        if (true === CollaborativeEditing.m_bGlobalLockSelection) {
            return;
        }
        editor.sync_CanAddHyperlinkCallback(this.Hyperlink_CanAdd(false));
    },
    Document_UpdateSectionPr: function () {
        if (true === this.TurnOffInterfaceEvents) {
            return;
        }
        if (true === CollaborativeEditing.m_bGlobalLockSelection) {
            return;
        }
        editor.sync_PageOrientCallback(this.Get_DocumentOrientation());
        var PageSize = this.Get_DocumentPageSize();
        editor.sync_DocSizeCallback(PageSize.W, PageSize.H);
    },
    TurnOff_InterfaceEvents: function () {
        this.TurnOffInterfaceEvents = true;
    },
    TurnOn_InterfaceEvents: function (bUpdate) {
        this.TurnOffInterfaceEvents = false;
        if (true === bUpdate) {
            this.Document_UpdateInterfaceState();
            this.Document_UpdateSelectionState();
            this.Document_UpdateRulersState();
        }
    },
    TurnOff_RecalculateCurPos: function () {
        this.TurnOffRecalcCurPos = true;
    },
    TurnOn_RecalculateCurPos: function (bUpdate) {
        this.TurnOffRecalcCurPos = false;
        if (true === bUpdate) {
            this.Document_UpdateSelectionState();
        }
    },
    Can_CopyCut: function () {
        var bCanCopyCut = false;
        var LogicDocument = null;
        var DrawingObjects = null;
        if (docpostype_HdrFtr === this.CurPos.Type) {
            var CurHdrFtr = this.HdrFtr.CurHdrFtr;
            if (null !== CurHdrFtr) {
                if (docpostype_DrawingObjects === CurHdrFtr.Content.CurPos.Type) {
                    DrawingObjects = this.DrawingObjects;
                } else {
                    LogicDocument = CurHdrFtr.Content;
                }
            }
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                DrawingObjects = this.DrawingObjects;
            } else {
                LogicDocument = this;
            }
        }
        if (null !== DrawingObjects) {
            if (true === DrawingObjects.isSelectedText()) {
                LogicDocument = DrawingObjects.getTargetDocContent();
            } else {
                bCanCopyCut = true;
            }
        }
        if (null !== LogicDocument) {
            if (true === LogicDocument.Is_SelectionUse()) {
                if (selectionflag_Numbering === LogicDocument.Selection.Flag) {
                    bCanCopyCut = false;
                } else {
                    if (LogicDocument.Selection.StartPos !== LogicDocument.Selection.EndPos || type_Paragraph === LogicDocument.Content[LogicDocument.Selection.StartPos].Get_Type()) {
                        bCanCopyCut = true;
                    } else {
                        bCanCopyCut = LogicDocument.Content[LogicDocument.Selection.StartPos].Can_CopyCut();
                    }
                }
            }
        }
        return bCanCopyCut;
    },
    Get_StartPage_Absolute: function () {
        return 0;
    },
    Get_StartPage_Relative: function () {
        return 0;
    },
    Set_CurPage: function (PageNum) {
        this.CurPage = Math.min(this.Pages.length - 1, Math.max(0, PageNum));
    },
    Get_CurPage: function () {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Get_CurPage();
        }
        return this.CurPage;
    },
    Create_NewHistoryPoint: function (Description) {
        this.History.Create_NewPoint(Description);
    },
    Document_Undo: function () {
        if (true === CollaborativeEditing.Get_GlobalLock()) {
            return;
        }
        this.DrawingDocument.EndTrackTable(null, true);
        this.DrawingObjects.TurnOffCheckChartSelection();
        this.History.Undo();
        this.DrawingObjects.TurnOnCheckChartSelection();
        this.Recalculate(false, false, this.History.RecalculateData);
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
    },
    Document_Redo: function () {
        if (true === CollaborativeEditing.Get_GlobalLock()) {
            return;
        }
        this.DrawingDocument.EndTrackTable(null, true);
        this.DrawingObjects.TurnOffCheckChartSelection();
        this.History.Redo();
        this.DrawingObjects.TurnOnCheckChartSelection();
        this.Recalculate(false, false, this.History.RecalculateData);
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
    },
    Get_SelectionState: function () {
        var DocState = {};
        DocState.CurPos = {
            X: this.CurPos.X,
            Y: this.CurPos.Y,
            ContentPos: this.CurPos.ContentPos,
            RealX: this.CurPos.RealX,
            RealY: this.CurPos.RealY,
            Type: this.CurPos.Type
        };
        DocState.Selection = {
            Start: this.Selection.Start,
            Use: this.Selection.Use,
            StartPos: this.Selection.StartPos,
            EndPos: this.Selection.EndPos,
            Flag: this.Selection.Flag,
            Data: this.Selection.Data
        };
        DocState.CurPage = this.CurPage;
        DocState.CurComment = this.Comments.Get_CurrentId();
        var State = null;
        if (true === editor.isStartAddShape && docpostype_DrawingObjects === this.CurPos.Type) {
            DocState.CurPos.Type = docpostype_Content;
            DocState.Selection.Start = false;
            DocState.Selection.Use = false;
            this.Content[DocState.CurPos.ContentPos].Selection_Remove();
            State = this.Content[this.CurPos.ContentPos].Get_SelectionState();
        } else {
            if (docpostype_HdrFtr === this.CurPos.Type) {
                State = this.HdrFtr.Get_SelectionState();
            } else {
                if (docpostype_DrawingObjects == this.CurPos.Type) {
                    State = this.DrawingObjects.getSelectionState();
                } else {
                    if (true === this.Selection.Use) {
                        if (selectionflag_Numbering == this.Selection.Flag) {
                            State = [];
                        } else {
                            var StartPos = this.Selection.StartPos;
                            var EndPos = this.Selection.EndPos;
                            if (StartPos > EndPos) {
                                var Temp = StartPos;
                                StartPos = EndPos;
                                EndPos = Temp;
                            }
                            State = [];
                            var TempState = [];
                            for (var Index = StartPos; Index <= EndPos; Index++) {
                                TempState.push(this.Content[Index].Get_SelectionState());
                            }
                            State.push(TempState);
                        }
                    } else {
                        State = this.Content[this.CurPos.ContentPos].Get_SelectionState();
                    }
                }
            }
        }
        State.push(DocState);
        return State;
    },
    Set_SelectionState: function (State) {
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            this.DrawingObjects.resetSelection();
        }
        if (State.length <= 0) {
            return;
        }
        var DocState = State[State.length - 1];
        this.CurPos.X = DocState.CurPos.X;
        this.CurPos.Y = DocState.CurPos.Y;
        this.CurPos.ContentPos = DocState.CurPos.ContentPos;
        this.CurPos.RealX = DocState.CurPos.RealX;
        this.CurPos.RealY = DocState.CurPos.RealY;
        this.CurPos.Type = DocState.CurPos.Type;
        this.Selection.Start = DocState.Selection.Start;
        this.Selection.Use = DocState.Selection.Use;
        this.Selection.StartPos = DocState.Selection.StartPos;
        this.Selection.EndPos = DocState.Selection.EndPos;
        this.Selection.Flag = DocState.Selection.Flag;
        this.Selection.Data = DocState.Selection.Data;
        this.Selection.DragDrop.Flag = 0;
        this.Selection.DragDrop.Data = null;
        this.CurPage = DocState.CurPage;
        this.Comments.Set_Current(DocState.CurComment);
        var StateIndex = State.length - 2;
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Set_SelectionState(State, StateIndex);
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                this.DrawingObjects.setSelectionState(State, StateIndex);
            } else {
                if (true === this.Selection.Use) {
                    if (selectionflag_Numbering == this.Selection.Flag) {
                        if (type_Paragraph === this.Content[this.Selection.StartPos].Get_Type()) {
                            var NumPr = this.Content[this.Selection.StartPos].Numbering_Get();
                            if (undefined !== NumPr) {
                                this.Document_SelectNumbering(NumPr, this.Selection.StartPos);
                            } else {
                                this.Selection_Remove();
                            }
                        } else {
                            this.Selection_Remove();
                        }
                    } else {
                        var StartPos = this.Selection.StartPos;
                        var EndPos = this.Selection.EndPos;
                        if (StartPos > EndPos) {
                            var Temp = StartPos;
                            StartPos = EndPos;
                            EndPos = Temp;
                        }
                        var CurState = State[StateIndex];
                        for (var Index = StartPos; Index <= EndPos; Index++) {
                            this.Content[Index].Set_SelectionState(CurState[Index - StartPos], CurState[Index - StartPos].length - 1);
                        }
                    }
                } else {
                    this.Content[this.CurPos.ContentPos].Set_SelectionState(State, StateIndex);
                }
            }
        }
    },
    Undo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_Document_AddItem:
            this.Content.splice(Data.Pos, 1);
            this.SectionsInfo.Update_OnRemove(Data.Pos, 1);
            break;
        case historyitem_Document_RemoveItem:
            var Pos = Data.Pos;
            var Array_start = this.Content.slice(0, Pos);
            var Array_end = this.Content.slice(Pos);
            this.Content = Array_start.concat(Data.Items, Array_end);
            this.SectionsInfo.Update_OnAdd(Data.Pos, Data.Items);
            break;
        case historyitem_Document_DefaultTab:
            Default_Tab_Stop = Data.Old;
            break;
        case historyitem_Document_EvenAndOddHeaders:
            EvenAndOddHeaders = Data.Old;
            break;
        case historyitem_Document_DefaultLanguage:
            this.Styles.Default.TextPr.Lang.Val = Data.Old;
            this.Restart_CheckSpelling();
            break;
        }
    },
    Redo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_Document_AddItem:
            var Pos = Data.Pos;
            this.Content.splice(Pos, 0, Data.Item);
            this.SectionsInfo.Update_OnAdd(Data.Pos, [Data.Item]);
            break;
        case historyitem_Document_RemoveItem:
            this.Content.splice(Data.Pos, Data.Items.length);
            this.SectionsInfo.Update_OnRemove(Data.Pos, Data.Items.length);
            break;
        case historyitem_Document_DefaultTab:
            Default_Tab_Stop = Data.New;
            break;
        case historyitem_Document_EvenAndOddHeaders:
            EvenAndOddHeaders = Data.New;
            break;
        case historyitem_Document_DefaultLanguage:
            this.Styles.Default.TextPr.Lang.Val = Data.New;
            this.Restart_CheckSpelling();
            break;
        }
    },
    Get_ParentObject_or_DocumentPos: function (Index) {
        return {
            Type: historyrecalctype_Inline,
            Data: Index
        };
    },
    Refresh_RecalcData: function (Data) {
        var ChangePos = -1;
        var bNeedRecalcHdrFtr = false;
        var Type = Data.Type;
        switch (Type) {
        case historyitem_Document_AddItem:
            case historyitem_Document_RemoveItem:
            ChangePos = Data.Pos;
            break;
        case historyitem_Document_DefaultTab:
            case historyitem_Document_EvenAndOddHeaders:
            ChangePos = 0;
            break;
        }
        if (-1 != ChangePos) {
            this.History.RecalcData_Add({
                Type: historyrecalctype_Inline,
                Data: {
                    Pos: ChangePos,
                    PageNum: 0
                }
            });
        }
    },
    Refresh_RecalcData2: function (Index, Page_rel) {
        this.History.RecalcData_Add({
            Type: historyrecalctype_Inline,
            Data: {
                Pos: Index,
                PageNum: Page_rel
            }
        });
    },
    Statistics_Start: function () {
        this.Statistics.Start();
        this.Statistics.Add_Page();
    },
    Statistics_OnPage: function () {
        var Count = this.Content.length;
        var CurPage = this.Statistics.CurPage;
        var bFlowObjChecked = false;
        var Index = 0;
        for (Index = this.Statistics.StartPos; Index < Count; Index++) {
            var Element = this.Content[Index];
            Element.DocumentStatistics(this.Statistics);
            if (false === bFlowObjChecked) {
                this.DrawingObjects.documentStatistics(CurPage, this.Statistics);
                bFlowObjChecked = true;
            }
            var bNewPage = false;
            if (Element.Pages.length > 1) {
                for (var TempIndex = 1; TempIndex < Element.Pages.length - 1; TempIndex++) {
                    this.DrawingObjects.documentStatistics(CurPage + TempIndex, this.Statistics);
                }
                CurPage += Element.Pages.length - 1;
                this.Statistics.Add_Page(Element.Pages.length - 1);
                bNewPage = true;
            }
            if (bNewPage) {
                this.Statistics.Next(Index + 1, CurPage);
                break;
            }
        }
        if (Index >= Count) {
            this.Statistics_Stop();
        }
    },
    Statistics_Stop: function () {
        this.Statistics.Stop();
    },
    Hyperlink_Add: function (HyperProps) {
        if (null != HyperProps.Text && "" != HyperProps.Text && true === this.Is_SelectionUse()) {
            var SelectionInfo = this.Get_SelectedElementsInfo();
            var Para = SelectionInfo.Get_Paragraph();
            if (null !== Para) {
                HyperProps.TextPr = Para.Get_TextPr(Para.Get_ParaContentPos(true, true));
            }
            this.Remove(1, false, false, true);
            this.Selection_Remove();
        }
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Hyperlink_Add(HyperProps);
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                this.DrawingObjects.hyperlinkAdd(HyperProps);
            } else {
                if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos) || (false == this.Selection.Use))) {
                    var Pos = (true == this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos);
                    this.Content[Pos].Hyperlink_Add(HyperProps);
                    this.ContentLastChangePos = Pos;
                    this.Recalculate(true);
                }
            }
        }
        this.Document_UpdateInterfaceState();
        this.Document_UpdateSelectionState();
    },
    Hyperlink_Modify: function (HyperProps) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Hyperlink_Modify(HyperProps);
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                this.DrawingObjects.hyperlinkModify(HyperProps);
            } else {
                if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos) || (false == this.Selection.Use))) {
                    var Pos = (true == this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos);
                    if (true === this.Content[Pos].Hyperlink_Modify(HyperProps)) {
                        this.ContentLastChangePos = Pos;
                        this.Recalculate(true);
                    }
                }
            }
        }
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },
    Hyperlink_Remove: function () {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Hyperlink_Remove();
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                this.DrawingObjects.hyperlinkRemove();
            } else {
                if (docpostype_Content == this.CurPos.Type && ((true === this.Selection.Use && this.Selection.StartPos == this.Selection.EndPos) || (false == this.Selection.Use))) {
                    var Pos = (true == this.Selection.Use ? this.Selection.StartPos : this.CurPos.ContentPos);
                    this.Content[Pos].Hyperlink_Remove();
                }
            }
        }
        this.Recalculate();
        this.Document_UpdateInterfaceState();
    },
    Hyperlink_CanAdd: function (bCheckInHyperlink) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Hyperlink_CanAdd(bCheckInHyperlink);
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return this.DrawingObjects.hyperlinkCanAdd(bCheckInHyperlink);
            } else {
                if (true === this.Selection.Use) {
                    switch (this.Selection.Flag) {
                    case selectionflag_Numbering:
                        return false;
                    case selectionflag_Common:
                        if (this.Selection.StartPos != this.Selection.EndPos) {
                            return false;
                        }
                        return this.Content[this.Selection.StartPos].Hyperlink_CanAdd(bCheckInHyperlink);
                    }
                } else {
                    return this.Content[this.CurPos.ContentPos].Hyperlink_CanAdd(bCheckInHyperlink);
                }
            }
        }
        return false;
    },
    Hyperlink_Check: function (bCheckEnd) {
        if ("undefined" === typeof(bCheckEnd)) {
            bCheckEnd = true;
        }
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Hyperlink_Check(bCheckEnd);
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return this.DrawingObjects.hyperlinkCheck(bCheckEnd);
            } else {
                if (true === this.Selection.Use) {
                    switch (this.Selection.Flag) {
                    case selectionflag_Numbering:
                        return null;
                    case selectionflag_Common:
                        if (this.Selection.StartPos != this.Selection.EndPos) {
                            return null;
                        }
                        return this.Content[this.Selection.StartPos].Hyperlink_Check(bCheckEnd);
                    }
                } else {
                    return this.Content[this.CurPos.ContentPos].Hyperlink_Check(bCheckEnd);
                }
            }
        }
        return null;
    },
    Document_Is_SelectionLocked: function (CheckType, AdditionalData) {
        return false;
    },
    Save_Changes: function (Data, Writer) {
        Writer.WriteLong(historyitem_type_Document);
        var Type = Data.Type;
        Writer.WriteLong(Type);
        switch (Type) {
        case historyitem_Document_AddItem:
            var bArray = Data.UseArray;
            var Count = 1;
            Writer.WriteLong(Count);
            for (var Index = 0; Index < Count; Index++) {
                if (true === bArray) {
                    Writer.WriteLong(Data.PosArray[Index]);
                } else {
                    Writer.WriteLong(Data.Pos + Index);
                }
                Writer.WriteString2(Data.Item.Get_Id());
            }
            break;
        case historyitem_Document_RemoveItem:
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
        case historyitem_Document_DefaultTab:
            Writer.WriteDouble(Data.New);
            break;
        case historyitem_Document_EvenAndOddHeaders:
            Writer.WriteBool(Data.New);
            break;
        case historyitem_Document_DefaultLanguage:
            Writer.WriteLong(Data.New);
            break;
        }
        return Writer;
    },
    Save_Changes2: function (Data, Writer) {
        var bRetValue = false;
        var Type = Data.Type;
        switch (Type) {
        case historyitem_Document_AddItem:
            break;
        case historyitem_Document_RemoveItem:
            break;
        }
        return bRetValue;
    },
    Load_Changes: function (Reader, Reader2) {
        var ClassType = Reader.GetLong();
        if (historyitem_type_Document != ClassType) {
            return;
        }
        var Type = Reader.GetLong();
        switch (Type) {
        case historyitem_Document_AddItem:
            var Count = Reader.GetLong();
            for (var Index = 0; Index < Count; Index++) {
                var Pos = this.m_oContentChanges.Check(contentchanges_Add, Reader.GetLong());
                var Element = g_oTableId.Get_ById(Reader.GetString2());
                Pos = Math.min(Pos, this.Content.length);
                if (null != Element) {
                    if (Pos > 0) {
                        this.Content[Pos - 1].Next = Element;
                        Element.Prev = this.Content[Pos - 1];
                    } else {
                        Element.Prev = null;
                    }
                    if (Pos <= this.Content.length - 1) {
                        this.Content[Pos].Prev = Element;
                        Element.Next = this.Content[Pos];
                    } else {
                        Element.Next = null;
                    }
                    Element.Parent = this;
                    this.Content.splice(Pos, 0, Element);
                    this.SectionsInfo.Update_OnAdd(Pos, [Element]);
                }
            }
            break;
        case historyitem_Document_RemoveItem:
            var Count = Reader.GetLong();
            for (var Index = 0; Index < Count; Index++) {
                var Pos = this.m_oContentChanges.Check(contentchanges_Remove, Reader.GetLong());
                if (false === Pos) {
                    continue;
                }
                this.Content.splice(Pos, 1);
                if (Pos > 0) {
                    if (Pos <= this.Content.length - 1) {
                        this.Content[Pos - 1].Next = this.Content[Pos];
                        this.Content[Pos].Prev = this.Content[Pos - 1];
                    } else {
                        this.Content[Pos - 1].Next = null;
                    }
                } else {
                    if (Pos <= this.Content.length - 1) {
                        this.Content[Pos].Prev = null;
                    }
                }
                this.SectionsInfo.Update_OnRemove(Pos, 1);
            }
            break;
        case historyitem_Document_DefaultTab:
            Default_Tab_Stop = Reader.GetDouble();
            break;
        case historyitem_Document_EvenAndOddHeaders:
            EvenAndOddHeaders = Reader.GetBool();
            break;
        case historyitem_Document_DefaultLanguage:
            this.Styles.Default.TextPr.Lang.Val = Reader.GetLong();
            this.Restart_CheckSpelling();
            break;
        }
        return true;
    },
    Get_SelectionState2: function () {
        this.Selection_Remove();
        var State = new CDocumentSelectionState();
        if (docpostype_HdrFtr === this.CurPos.Type) {
            State.Type = docpostype_HdrFtr;
            if (null != this.HdrFtr.CurHdrFtr) {
                State.Id = this.HdrFtr.CurHdrFtr.Get_Id();
            } else {
                State.Id = null;
            }
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var X = 0;
                var Y = 0;
                var PageNum = this.CurPage;
                var ContentPos = this.Internal_GetContentPosByXY(X, Y, PageNum);
                State.Type = docpostype_Content;
                State.Id = this.Content[ContentPos].Get_Id();
            } else {
                State.Id = this.Get_Id();
                State.Type = docpostype_Content;
                var Element = this.Content[this.CurPos.ContentPos];
                State.Data = Element.Get_SelectionState2();
            }
        }
        return State;
    },
    Set_SelectionState2: function (State) {
        this.Selection_Remove();
        var Id = State.Id;
        if (docpostype_HdrFtr === State.Type) {
            this.CurPos.Type = docpostype_HdrFtr;
            if (null === Id || true != this.HdrFtr.Set_CurHdrFtr_ById(Id)) {
                this.CurPos.Type = docpostype_Content;
                this.CurPos.ContentPos = 0;
                this.Content[this.CurPos.ContentPos].Cursor_MoveToStartPos();
            }
        } else {
            var ElementId = State.Data.Id;
            var CurId = ElementId;
            var bFlag = false;
            var Pos = 0;
            var Count = this.Content.length;
            for (Pos = 0; Pos < Count; Pos++) {
                if (this.Content[Pos].Get_Id() == CurId) {
                    bFlag = true;
                    break;
                }
            }
            if (true !== bFlag) {
                var TempElement = g_oTableId.Get_ById(CurId);
                Pos = (null != TempElement ? TempElement.Index : 0);
                Pos = Math.max(0, Math.min(Pos, this.Content.length - 1));
            }
            this.Selection.Start = false;
            this.Selection.Use = false;
            this.Selection.StartPos = Pos;
            this.Selection.EndPos = Pos;
            this.Selection.Flag = selectionflag_Common;
            this.CurPos.Type = docpostype_Content;
            this.CurPos.ContentPos = Pos;
            if (true !== bFlag) {
                this.Content[this.CurPos.ContentPos].Cursor_MoveToStartPos();
            } else {
                this.Content[this.CurPos.ContentPos].Set_SelectionState2(State.Data);
            }
        }
    },
    Add_Comment: function (CommentData) {
        if (true != this.CanAdd_Comment()) {
            CommentData.Set_QuoteText(null);
            var Comment = new CComment(this.Comments, CommentData);
            this.Comments.Add(Comment);
            this.Document_UpdateInterfaceState();
        } else {
            var QuotedText = this.Get_SelectedText(false);
            if (null === QuotedText) {
                QuotedText = "";
            }
            CommentData.Set_QuoteText(QuotedText);
            var Comment = new CComment(this.Comments, CommentData);
            this.Comments.Add(Comment);
            if (docpostype_HdrFtr === this.CurPos.Type) {
                this.HdrFtr.Add_Comment(Comment);
            } else {
                if (docpostype_DrawingObjects === this.CurPos.Type) {
                    if (true != this.DrawingObjects.isSelectedText()) {
                        var ParaDrawing = this.DrawingObjects.getMajorParaDrawing();
                        if (null != ParaDrawing) {
                            var Paragraph = ParaDrawing.Parent;
                            Paragraph.Add_Comment2(Comment, ParaDrawing.Get_Id());
                        }
                    } else {
                        this.DrawingObjects.addComment(Comment);
                    }
                } else {
                    if (selectionflag_Numbering === this.Selection.Flag) {
                        return;
                    }
                    if (true === this.Selection.Use) {
                        var StartPos, EndPos;
                        if (this.Selection.StartPos < this.Selection.EndPos) {
                            StartPos = this.Selection.StartPos;
                            EndPos = this.Selection.EndPos;
                        } else {
                            StartPos = this.Selection.EndPos;
                            EndPos = this.Selection.StartPos;
                        }
                        if (StartPos === EndPos) {
                            this.Content[StartPos].Add_Comment(Comment, true, true);
                        } else {
                            this.Content[StartPos].Add_Comment(Comment, true, false);
                            this.Content[EndPos].Add_Comment(Comment, false, true);
                        }
                    } else {
                        this.Content[this.CurPos.ContentPos].Add_Comment(Comment, true, true);
                    }
                }
            }
            this.Recalculate();
            this.Document_UpdateInterfaceState();
        }
        return Comment;
    },
    Change_Comment: function (Id, CommentData) {
        this.Comments.Set_CommentData(Id, CommentData);
        this.Document_UpdateInterfaceState();
    },
    Remove_Comment: function (Id, bSendEvent, bRecalculate) {
        if (null === Id) {
            return;
        }
        if (true === this.Comments.Remove_ById(Id)) {
            if (true === bRecalculate) {
                this.Recalculate();
                this.Document_UpdateInterfaceState();
            }
            if (true === bSendEvent) {
                editor.sync_RemoveComment(Id);
            }
        }
    },
    CanAdd_Comment: function () {
        if (true !== this.Comments.Is_Use()) {
            return false;
        }
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.CanAdd_Comment();
        } else {
            if (docpostype_DrawingObjects == this.CurPos.Type) {
                if (true != this.DrawingObjects.isSelectedText()) {
                    return true;
                } else {
                    return this.DrawingObjects.canAddComment();
                }
            } else {
                switch (this.Selection.Flag) {
                case selectionflag_Numbering:
                    return false;
                case selectionflag_Common:
                    if (true === this.Selection.Use && this.Selection.StartPos != this.Selection.EndPos) {
                        return true;
                    } else {
                        var Pos = (this.Selection.Use === true ? this.Selection.StartPos : this.CurPos.ContentPos);
                        var Element = this.Content[Pos];
                        return Element.CanAdd_Comment();
                    }
                }
            }
        }
        return false;
    },
    Select_Comment: function (Id, ScrollToComment) {
        var OldId = this.Comments.Get_CurrentId();
        this.Comments.Set_Current(Id);
        var Comment = this.Comments.Get_ById(Id);
        if (null != Comment) {
            var Comment_PageNum = Comment.m_oStartInfo.PageNum;
            var Comment_Y = Comment.m_oStartInfo.Y;
            var Comment_X = Comment.m_oStartInfo.X;
            if (true === ScrollToComment) {
                this.DrawingDocument.m_oWordControl.ScrollToPosition(Comment_X, Comment_Y, Comment_PageNum);
            }
        }
        if (OldId != Id) {
            this.DrawingDocument.ClearCachePages();
            this.DrawingDocument.FirePaint();
        }
    },
    Show_Comment: function (Id) {
        var Comment = this.Comments.Get_ById(Id);
        if (null != Comment && null != Comment.StartId && null != Comment.EndId) {
            var Comment_PageNum = Comment.m_oStartInfo.PageNum;
            var Comment_Y = Comment.m_oStartInfo.Y;
            var Comment_X = this.Get_PageLimits(Comment_PageNum).XLimit;
            var Coords = this.DrawingDocument.ConvertCoordsToCursorWR(Comment_X, Comment_Y, Comment_PageNum);
            editor.sync_ShowComment(Comment.Get_Id(), Coords.X, Coords.Y);
        } else {
            editor.sync_HideComment();
        }
    },
    Show_Comments: function () {
        this.Comments.Set_Use(true);
        this.DrawingDocument.ClearCachePages();
        this.DrawingDocument.FirePaint();
    },
    Hide_Comments: function () {
        this.Comments.Set_Use(false);
        this.Comments.Set_Current(null);
        this.DrawingDocument.ClearCachePages();
        this.DrawingDocument.FirePaint();
    },
    Get_PrevElementEndInfo: function (CurElement) {
        var PrevElement = CurElement.Get_DocumentPrev();
        if (null !== PrevElement && undefined !== PrevElement) {
            return PrevElement.Get_EndInfo();
        } else {
            return null;
        }
    },
    Get_SelectionAnchorPos: function () {
        var Result;
        if (docpostype_HdrFtr === this.CurPos.Type) {
            Result = this.HdrFtr.Get_SelectionAnchorPos();
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var ParaDrawing = this.DrawingObjects.getMajorParaDrawing();
                Result = {
                    X0: ParaDrawing.GraphicObj.x,
                    Y: ParaDrawing.GraphicObj.y,
                    X1: ParaDrawing.GraphicObj.x + ParaDrawing.GraphicObj.extX,
                    Page: ParaDrawing.PageNum
                };
            } else {
                var Pos = (true === this.Selection.Use ? (this.Selection.StartPos < this.Selection.EndPos ? this.Selection.StartPos : this.Selection.EndPos) : this.CurPos.ContentPos);
                Result = this.Content[Pos].Get_SelectionAnchorPos();
            }
        }
        var PageLimit = this.Get_PageLimits(Result.Page);
        Result.X0 = PageLimit.X;
        Result.X1 = PageLimit.XLimit;
        var Coords0 = this.DrawingDocument.ConvertCoordsToCursorWR(Result.X0, Result.Y, Result.Page);
        var Coords1 = this.DrawingDocument.ConvertCoordsToCursorWR(Result.X1, Result.Y, Result.Page);
        return {
            X0: Coords0.X,
            X1: Coords1.X,
            Y: Coords0.Y
        };
    },
    TextBox_Put: function (sText, rFonts) {
        if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
            this.Create_NewHistoryPoint(historydescription_Document_AddTextFromTextBox);
            if (undefined === rFonts) {
                this.TurnOffRecalc = true;
                this.TurnOff_InterfaceEvents();
                this.TurnOff_RecalculateCurPos();
                var Count = sText.length;
                var e = global_keyboardEvent;
                for (var Index = 0; Index < Count; Index++) {
                    if (Index === Count - 1) {
                        this.TurnOffRecalc = false;
                    }
                    var _char = sText.charAt(Index);
                    if (" " == _char) {
                        this.Paragraph_Add(new ParaSpace());
                    } else {
                        this.Paragraph_Add(new ParaText(_char));
                    }
                }
                this.TurnOffRecalc = false;
                this.TurnOn_RecalculateCurPos(false);
                this.TurnOn_InterfaceEvents(true);
            } else {
                var Para = this.Get_CurrentParagraph();
                if (null === Para) {
                    return;
                }
                var RunPr = Para.Get_TextPr();
                if (null === RunPr || undefined === RunPr) {
                    RunPr = new CTextPr();
                }
                RunPr.RFonts = rFonts;
                var Run = new ParaRun(Para);
                Run.Set_Pr(RunPr);
                var Count = sText.length;
                for (var Index = 0; Index < Count; Index++) {
                    var _char = sText.charAt(Index);
                    if (" " == _char) {
                        Run.Add_ToContent(Index, new ParaSpace(), false);
                    } else {
                        Run.Add_ToContent(Index, new ParaText(_char), false);
                    }
                }
                Para.Add(Run);
                this.Recalculate();
            }
            this.Document_UpdateUndoRedoState();
        }
    },
    Viewer_OnChangePosition: function () {
        var Comment = this.Comments.Get_Current();
        if (null != Comment) {
            var Comment_PageNum = Comment.m_oStartInfo.PageNum;
            var Comment_Y = Comment.m_oStartInfo.Y;
            var Comment_X = this.Get_PageLimits(Comment_PageNum).XLimit;
            var Para = g_oTableId.Get_ById(Comment.StartId);
            if (null !== Para) {
                var TextTransform = Para.Get_ParentTextTransform();
                if (TextTransform) {
                    Comment_Y = TextTransform.TransformPointY(Comment.m_oStartInfo.X, Comment.m_oStartInfo.Y);
                }
            }
            var Coords = this.DrawingDocument.ConvertCoordsToCursorWR(Comment_X, Comment_Y, Comment_PageNum);
            editor.sync_UpdateCommentPosition(Comment.Get_Id(), Coords.X, Coords.Y);
        }
    },
    Update_SectionsInfo: function () {
        this.SectionsInfo.Clear();
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            var Element = this.Content[Index];
            if (type_Paragraph === Element.GetType() && undefined !== Element.Get_SectionPr()) {
                this.SectionsInfo.Add(Element.Get_SectionPr(), Index);
            }
        }
        this.SectionsInfo.Add(this.SectPr, Count);
    },
    Check_SectionLastParagraph: function () {
        var Count = this.Content.length;
        if (Count <= 0) {
            return;
        }
        var Element = this.Content[Count - 1];
        if (type_Paragraph === Element.GetType() && undefined !== Element.Get_SectionPr()) {
            this.Internal_Content_Add(Count, new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0));
        }
    },
    Add_SectionBreak: function (SectionBreakType) {
        var Element = null;
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return false;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return false;
            } else {
                if (true === this.Selection.Use) {
                    this.Cursor_MoveLeft(false, false);
                }
                var Element = this.Content[this.CurPos.ContentPos];
                var CurSectPr = this.SectionsInfo.Get_SectPr(this.CurPos.ContentPos).SectPr;
                if (type_Paragraph === Element.GetType()) {
                    var NewParagraph = new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0);
                    Element.Split(NewParagraph);
                    this.CurPos.ContentPos++;
                    NewParagraph.Cursor_MoveToStartPos(false);
                    this.Internal_Content_Add(this.CurPos.ContentPos, NewParagraph);
                } else {
                    var NewParagraph = new Paragraph(this.DrawingDocument, this, 0, 0, 0, 0, 0);
                    var NewTable = Element.Split_Table();
                    if (null === NewTable) {
                        this.Internal_Content_Add(this.CurPos.ContentPos, NewParagraph);
                        this.CurPos.ContentPos++;
                    } else {
                        this.Internal_Content_Add(this.CurPos.ContentPos + 1, NewParagraph);
                        this.Internal_Content_Add(this.CurPos.ContentPos + 2, NewTable);
                        this.CurPos.ContentPos += 2;
                    }
                    this.Content[this.CurPos.ContentPos].Cursor_MoveToStartPos(false);
                    Element = NewParagraph;
                }
                var SectPr = new CSectionPr(this);
                History.MinorChanges = true;
                SectPr.Copy(CurSectPr);
                CurSectPr.Set_Type(SectionBreakType);
                CurSectPr.Set_PageNum_Start(-1);
                CurSectPr.Clear_AllHdrFtr();
                History.MinorChanges = false;
                Element.Set_SectionPr(SectPr);
                Element.Refresh_RecalcData2(0, 0);
                this.Recalculate();
                this.Document_UpdateInterfaceState();
                this.Document_UpdateSelectionState();
                return true;
            }
        }
        return false;
    },
    Get_SectionFirstPage: function (SectIndex, Page_abs) {
        if (SectIndex <= 0) {
            return 0;
        }
        var StartIndex = this.SectionsInfo.Get_SectPr2(SectIndex - 1).Index;
        var CurPage = Page_abs;
        for (; CurPage > 0; CurPage--) {
            if (this.Pages[CurPage].EndPos >= StartIndex && this.Pages[CurPage].Pos <= StartIndex) {
                break;
            }
        }
        return CurPage + 1;
    },
    Get_SectionPageNumInfo: function (Page_abs) {
        var PageNumInfo = this.Get_SectionPageNumInfo2(Page_abs);
        var FP = PageNumInfo.FirstPage;
        var CP = PageNumInfo.CurPage;
        var bCheckFP = true;
        var SectIndex = PageNumInfo.SectIndex;
        if (SectIndex > 0) {
            var CurSectInfo = this.SectionsInfo.Get_SectPr2(SectIndex);
            var PrevSectInfo = this.SectionsInfo.Get_SectPr2(SectIndex - 1);
            if (CurSectInfo !== PrevSectInfo && section_type_Continuous === CurSectInfo.SectPr.Get_Type() && true === CurSectInfo.SectPr.Compare_PageSize(PrevSectInfo.SectPr)) {
                var ElementIndex = PrevSectInfo.Index;
                if (ElementIndex < this.Content.length - 1 && true !== this.Content[ElementIndex + 1].Is_StartFromNewPage()) {
                    bCheckFP = false;
                }
            }
        }
        var bFirst = (FP === CP && true === bCheckFP ? true : false);
        var bEven = (0 === CP % 2 ? true : false);
        return new CSectionPageNumInfo(FP, CP, bFirst, bEven, Page_abs);
    },
    Get_SectionPageNumInfo2: function (Page_abs) {
        var StartIndex = 0;
        if (undefined !== this.Pages[Page_abs]) {
            StartIndex = this.Pages[Page_abs].Pos;
        }
        var SectIndex = this.SectionsInfo.Get_Index(StartIndex);
        var StartSectIndex = SectIndex;
        if (0 === SectIndex) {
            var PageNumStart = this.SectionsInfo.Get_SectPr2(0).SectPr.Get_PageNum_Start();
            var BT = this.SectionsInfo.Get_SectPr2(0).SectPr.Get_Type();
            if (PageNumStart < 0) {
                PageNumStart = 1;
            }
            if ((section_type_OddPage === BT && 0 === PageNumStart % 2) || (section_type_EvenPage === BT && 1 === PageNumStart % 2)) {
                PageNumStart++;
            }
            return {
                FirstPage: PageNumStart,
                CurPage: Page_abs + PageNumStart,
                SectIndex: StartSectIndex
            };
        }
        var SectionFirstPage = this.Get_SectionFirstPage(SectIndex, Page_abs);
        var FirstPage = SectionFirstPage;
        var PageNumStart = this.SectionsInfo.Get_SectPr2(SectIndex).SectPr.Get_PageNum_Start();
        var BreakType = this.SectionsInfo.Get_SectPr2(SectIndex).SectPr.Get_Type();
        var StartInfo = [];
        StartInfo.push({
            FirstPage: FirstPage,
            BreakType: BreakType
        });
        while (PageNumStart < 0 && SectIndex > 0) {
            SectIndex--;
            FirstPage = this.Get_SectionFirstPage(SectIndex, Page_abs);
            PageNumStart = this.SectionsInfo.Get_SectPr2(SectIndex).SectPr.Get_PageNum_Start();
            BreakType = this.SectionsInfo.Get_SectPr2(SectIndex).SectPr.Get_Type();
            StartInfo.splice(0, 0, {
                FirstPage: FirstPage,
                BreakType: BreakType
            });
        }
        if (PageNumStart < 0) {
            PageNumStart = 1;
        }
        var InfoIndex = 0;
        var InfoCount = StartInfo.length;
        var FP = StartInfo[0].FirstPage;
        var BT = StartInfo[0].BreakType;
        var PrevFP = StartInfo[0].FirstPage;
        while (InfoIndex < InfoCount) {
            FP = StartInfo[InfoIndex].FirstPage;
            BT = StartInfo[InfoIndex].BreakType;
            PageNumStart += FP - PrevFP;
            PrevFP = FP;
            if ((section_type_OddPage === BT && 0 === PageNumStart % 2) || (section_type_EvenPage === BT && 1 === PageNumStart % 2)) {
                PageNumStart++;
            }
            InfoIndex++;
        }
        if (FP > Page_abs) {
            Page_abs = FP;
        }
        var _FP = PageNumStart;
        var _CP = PageNumStart + Page_abs - FP;
        return {
            FirstPage: _FP,
            CurPage: _CP,
            SectIndex: StartSectIndex
        };
    },
    Get_SectionHdrFtr: function (Page_abs, _bFirst, _bEven) {
        var StartIndex = this.Pages[Page_abs].Pos;
        var SectIndex = this.SectionsInfo.Get_Index(StartIndex);
        var CurSectPr = this.SectionsInfo.Get_SectPr2(SectIndex).SectPr;
        var bEven = (true === _bEven && true === EvenAndOddHeaders ? true : false);
        var bFirst = (true === _bFirst && true === CurSectPr.TitlePage ? true : false);
        var CurSectIndex = SectIndex;
        var Header = null,
        Footer = null;
        while (CurSectIndex >= 0) {
            var SectPr = this.SectionsInfo.Get_SectPr2(CurSectIndex).SectPr;
            if (null === Header) {
                if (true === bFirst) {
                    Header = SectPr.Get_Header_First();
                } else {
                    if (true === bEven) {
                        Header = SectPr.Get_Header_Even();
                    } else {
                        Header = SectPr.Get_Header_Default();
                    }
                }
            }
            if (null === Footer) {
                if (true === bFirst) {
                    Footer = SectPr.Get_Footer_First();
                } else {
                    if (true === bEven) {
                        Footer = SectPr.Get_Footer_Even();
                    } else {
                        Footer = SectPr.Get_Footer_Default();
                    }
                }
            }
            if (null !== Header && null !== Footer) {
                break;
            }
            CurSectIndex--;
        }
        return {
            Header: Header,
            Footer: Footer,
            SectPr: CurSectPr
        };
    },
    Create_SectionHdrFtr: function (Type, PageIndex) {
        var SectionPageInfo = this.Get_SectionPageNumInfo(PageIndex);
        var _bFirst = SectionPageInfo.bFirst;
        var _bEven = SectionPageInfo.bEven;
        var StartIndex = this.Pages[PageIndex].Pos;
        var SectIndex = this.SectionsInfo.Get_Index(StartIndex);
        var CurSectPr = this.SectionsInfo.Get_SectPr2(SectIndex).SectPr;
        var bEven = (true === _bEven && true === EvenAndOddHeaders ? true : false);
        var bFirst = (true === _bFirst && true === CurSectPr.TitlePage ? true : false);
        var SectPr = this.SectionsInfo.Get_SectPr2(0).SectPr;
        var HdrFtr = new CHeaderFooter(this.HdrFtr, this, this.DrawingDocument, Type);
        if (hdrftr_Header === Type) {
            if (true === bFirst) {
                SectPr.Set_Header_First(HdrFtr);
            } else {
                if (true === bEven) {
                    SectPr.Set_Header_Even(HdrFtr);
                } else {
                    SectPr.Set_Header_Default(HdrFtr);
                }
            }
        } else {
            if (true === bFirst) {
                SectPr.Set_Footer_First(HdrFtr);
            } else {
                if (true === bEven) {
                    SectPr.Set_Footer_Even(HdrFtr);
                } else {
                    SectPr.Set_Footer_Default(HdrFtr);
                }
            }
        }
        return HdrFtr;
    },
    On_SectionChange: function (_SectPr) {
        var Index = this.SectionsInfo.Find(_SectPr);
        if (-1 === Index) {
            return;
        }
        var SectPr = null;
        var HeaderF = null,
        HeaderD = null,
        HeaderE = null,
        FooterF = null,
        FooterD = null,
        FooterE = null;
        while (Index >= 0) {
            SectPr = this.SectionsInfo.Get_SectPr2(Index).SectPr;
            if (null === HeaderF) {
                HeaderF = SectPr.Get_Header_First();
            }
            if (null === HeaderD) {
                HeaderD = SectPr.Get_Header_Default();
            }
            if (null === HeaderE) {
                HeaderE = SectPr.Get_Header_Even();
            }
            if (null === FooterF) {
                FooterF = SectPr.Get_Footer_First();
            }
            if (null === FooterD) {
                FooterD = SectPr.Get_Footer_Default();
            }
            if (null === FooterE) {
                FooterE = SectPr.Get_Footer_Even();
            }
            Index--;
        }
        if (null !== HeaderF) {
            HeaderF.Refresh_RecalcData_BySection(_SectPr);
        }
        if (null !== HeaderD) {
            HeaderD.Refresh_RecalcData_BySection(_SectPr);
        }
        if (null !== HeaderE) {
            HeaderE.Refresh_RecalcData_BySection(_SectPr);
        }
        if (null !== FooterF) {
            FooterF.Refresh_RecalcData_BySection(_SectPr);
        }
        if (null !== FooterD) {
            FooterD.Refresh_RecalcData_BySection(_SectPr);
        }
        if (null !== FooterE) {
            FooterE.Refresh_RecalcData_BySection(_SectPr);
        }
    },
    Create_HdrFtrWidthPageNum: function (PageIndex, AlignV, AlignH) {
        var SectionPageInfo = this.Get_SectionPageNumInfo(PageIndex);
        var bFirst = SectionPageInfo.bFirst;
        var bEven = SectionPageInfo.bEven;
        var HdrFtr = this.Get_SectionHdrFtr(PageIndex, bFirst, bEven);
        switch (AlignV) {
        case hdrftr_Header:
            var Header = HdrFtr.Header;
            if (null === Header) {
                Header = this.Create_SectionHdrFtr(hdrftr_Header, PageIndex);
            }
            Header.AddPageNum(AlignH);
            break;
        case hdrftr_Footer:
            var Footer = HdrFtr.Footer;
            if (null === Footer) {
                Footer = this.Create_SectionHdrFtr(hdrftr_Footer, PageIndex);
            }
            Footer.AddPageNum(AlignH);
            break;
        }
        this.Recalculate();
    },
    Set_UseTextShd: function (bUse) {
        this.UseTextShd = bUse;
    }
};
CDocument.prototype.private_StartSelectionFromCurPos = function () {
    this.private_UpdateCursorXY(true, true);
    var CurPara = this.Get_CurrentParagraph();
    if (null !== CurPara) {
        var MouseEvent = new CMouseEventHandler();
        MouseEvent.ClickCount = 1;
        MouseEvent.Type = g_mouse_event_type_down;
        var X = CurPara.CurPos.RealX;
        var Y = CurPara.CurPos.RealY;
        var DrawMatrix = CurPara.Get_ParentTextTransform();
        if (DrawMatrix) {
            var _X = DrawMatrix.TransformPointX(X, Y);
            var _Y = DrawMatrix.TransformPointY(X, Y);
            X = _X;
            Y = _Y;
        }
        this.CurPage = CurPara.Get_StartPage_Absolute() + CurPara.CurPos.PagesPos;
        this.Selection_SetStart(X, Y, MouseEvent);
        MouseEvent.Type = g_mouse_event_type_move;
        this.Selection_SetEnd(X, Y, MouseEvent);
    }
};
CDocument.prototype.private_StopSelection = function () {
    this.Selection.Start = false;
};
CDocument.prototype.private_UpdateCurPage = function () {
    this.Internal_CheckCurPage();
};
CDocument.prototype.private_UpdateCursorXY = function (bUpdateX, bUpdateY) {
    this.private_UpdateCurPage();
    var NewCursorPos = null;
    if (true !== this.Is_SelectionUse() || true === this.Selection_IsEmpty()) {
        if (docpostype_Content === this.CurPos.Type) {
            var Pos = (true === this.Selection.Use && selectionflag_Numbering !== this.Selection.Flag ? this.Selection.EndPos : this.CurPos.ContentPos);
            if (Pos >= 0 && undefined !== this.Content[Pos].RecalculateCurPos && (null === this.FullRecalc.Id || this.FullRecalc.StartIndex > Pos)) {
                this.Internal_CheckCurPage();
                NewCursorPos = this.Content[Pos].RecalculateCurPos();
            }
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                NewCursorPos = this.DrawingObjects.recalculateCurPos();
            } else {
                if (docpostype_HdrFtr === this.CurPos.Type) {
                    NewCursorPos = this.HdrFtr.RecalculateCurPos();
                }
            }
        }
    } else {
        var SelectionBounds = this.Get_SelectionBounds();
        if (null !== SelectionBounds) {
            NewCursorPos = {};
            if (-1 === SelectionBounds.Direction) {
                NewCursorPos.X = SelectionBounds.Start.X;
                NewCursorPos.Y = SelectionBounds.Start.Y;
            } else {
                NewCursorPos.X = SelectionBounds.End.X + SelectionBounds.End.W;
                NewCursorPos.Y = SelectionBounds.End.Y + SelectionBounds.End.H;
            }
        }
    }
    if (null === NewCursorPos || undefined === NewCursorPos) {
        return;
    }
    var RealX = NewCursorPos.X;
    var RealY = NewCursorPos.Y;
    var CurPara = this.Get_CurrentParagraph();
    if (bUpdateX) {
        this.CurPos.RealX = RealX;
        if (null !== CurPara) {
            CurPara.CurPos.RealX = RealX;
        }
    }
    if (bUpdateY) {
        this.CurPos.RealY = RealY;
        if (null !== CurPara) {
            CurPara.CurPos.RealY = RealY;
        }
    }
};
CDocument.prototype.private_MoveCursorDown = function (StartX, StartY, AddToSelect) {
    var CurY = StartY;
    var PageH = this.Pages[this.CurPage].Height;
    this.TurnOff_InterfaceEvents();
    this.CheckEmptyElementsOnSelection = false;
    var Result = false;
    while (true) {
        CurY += 0.1;
        if (CurY > PageH) {
            if (this.Pages.length - 1 <= this.CurPage) {
                Result = false;
                break;
            } else {
                this.CurPage++;
                StartY = 0;
                CurY = 0;
            }
        }
        this.Cursor_MoveAt(StartX, CurY, AddToSelect);
        this.private_UpdateCursorXY(false, true);
        if (this.CurPos.RealY > StartY + 0.001) {
            Result = true;
            break;
        }
    }
    this.CheckEmptyElementsOnSelection = true;
    this.TurnOn_InterfaceEvents(true);
    return Result;
};
CDocument.prototype.private_MoveCursorUp = function (StartX, StartY, AddToSelect) {
    var CurY = StartY;
    var PageH = this.Pages[this.CurPage].Height;
    this.TurnOff_InterfaceEvents();
    this.CheckEmptyElementsOnSelection = false;
    var Result = false;
    while (true) {
        CurY -= 0.1;
        if (CurY < 0) {
            if (0 === this.CurPage) {
                Result = false;
                break;
            } else {
                this.CurPage--;
                StartY = this.Pages[this.CurPage].Height;
                CurY = this.Pages[this.CurPage].Height;
            }
        }
        this.Cursor_MoveAt(StartX, CurY, AddToSelect);
        this.private_UpdateCursorXY(false, true);
        if (this.CurPos.RealY < StartY - 0.001) {
            Result = true;
            break;
        }
    }
    this.CheckEmptyElementsOnSelection = true;
    this.TurnOn_InterfaceEvents(true);
    return Result;
};
CDocument.prototype.private_ProcessTemplateReplacement = function (TemplateReplacementData) {
    for (var Id in TemplateReplacementData) {
        this.Search(Id, {
            MatchCase: true
        },
        false);
        this.SearchEngine.Replace_All(TemplateReplacementData[Id], false);
    }
};
CDocument.prototype.Start_SilentMode = function () {
    this.TurnOff_Recalculate();
    this.TurnOff_InterfaceEvents();
    this.TurnOff_RecalculateCurPos();
};
CDocument.prototype.End_SilentMode = function (bUpdate) {
    this.TurnOn_Recalculate(bUpdate);
    this.TurnOn_RecalculateCurPos(bUpdate);
    this.TurnOn_InterfaceEvents(bUpdate);
};
function CDocumentSelectionState() {
    this.Id = null;
    this.Type = docpostype_Content;
    this.Data = {};
}
function CDocumentSectionsInfo() {
    this.Elements = [];
}
CDocumentSectionsInfo.prototype = {
    Add: function (SectPr, Index) {
        this.Elements.push(new CDocumentSectionsInfoElement(SectPr, Index));
    },
    Get_SectionsCount: function () {
        return this.Elements.length;
    },
    Clear: function () {
        this.Elements.length = 0;
    },
    Find_ByHdrFtr: function (HdrFtr) {
        var Count = this.Elements.length;
        for (var Index = 0; Index < Count; Index++) {
            var SectPr = this.Elements[Index].SectPr;
            if (HdrFtr === SectPr.Get_Header_First() || HdrFtr === SectPr.Get_Header_Default() || HdrFtr === SectPr.Get_Header_Even() || HdrFtr === SectPr.Get_Footer_First() || HdrFtr === SectPr.Get_Footer_Default() || HdrFtr === SectPr.Get_Footer_Even()) {
                return Index;
            }
        }
        return -1;
    },
    Reset_HdrFtrRecalculateCache: function () {
        var Count = this.Elements.length;
        for (var Index = 0; Index < Count; Index++) {
            var SectPr = this.Elements[Index].SectPr;
            if (null != SectPr.HeaderFirst) {
                SectPr.HeaderFirst.Reset_RecalculateCache();
            }
            if (null != SectPr.HeaderDefault) {
                SectPr.HeaderDefault.Reset_RecalculateCache();
            }
            if (null != SectPr.HeaderEven) {
                SectPr.HeaderEven.Reset_RecalculateCache();
            }
            if (null != SectPr.FooterFirst) {
                SectPr.FooterFirst.Reset_RecalculateCache();
            }
            if (null != SectPr.FooterDefault) {
                SectPr.FooterDefault.Reset_RecalculateCache();
            }
            if (null != SectPr.FooterEven) {
                SectPr.FooterEven.Reset_RecalculateCache();
            }
        }
    },
    Get_AllParagraphs_ByNumbering: function (NumPr, ParaArray) {
        var Count = this.Elements.length;
        for (var Index = 0; Index < Count; Index++) {
            var SectPr = this.Elements[Index].SectPr;
            if (null != SectPr.HeaderFirst) {
                SectPr.HeaderFirst.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
            }
            if (null != SectPr.HeaderDefault) {
                SectPr.HeaderDefault.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
            }
            if (null != SectPr.HeaderEven) {
                SectPr.HeaderEven.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
            }
            if (null != SectPr.FooterFirst) {
                SectPr.FooterFirst.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
            }
            if (null != SectPr.FooterDefault) {
                SectPr.FooterDefault.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
            }
            if (null != SectPr.FooterEven) {
                SectPr.FooterEven.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
            }
        }
    },
    Document_CreateFontMap: function (FontMap) {
        var Count = this.Elements.length;
        for (var Index = 0; Index < Count; Index++) {
            var SectPr = this.Elements[Index].SectPr;
            if (null != SectPr.HeaderFirst) {
                SectPr.HeaderFirst.Document_CreateFontMap(FontMap);
            }
            if (null != SectPr.HeaderDefault) {
                SectPr.HeaderDefault.Document_CreateFontMap(FontMap);
            }
            if (null != SectPr.HeaderEven) {
                SectPr.HeaderEven.Document_CreateFontMap(FontMap);
            }
            if (null != SectPr.FooterFirst) {
                SectPr.FooterFirst.Document_CreateFontMap(FontMap);
            }
            if (null != SectPr.FooterDefault) {
                SectPr.FooterDefault.Document_CreateFontMap(FontMap);
            }
            if (null != SectPr.FooterEven) {
                SectPr.FooterEven.Document_CreateFontMap(FontMap);
            }
        }
    },
    Document_CreateFontCharMap: function (FontCharMap) {
        var Count = this.Elements.length;
        for (var Index = 0; Index < Count; Index++) {
            var SectPr = this.Elements[Index].SectPr;
            if (null != SectPr.HeaderFirst) {
                SectPr.HeaderFirst.Document_CreateFontCharMap(FontCharMap);
            }
            if (null != SectPr.HeaderDefault) {
                SectPr.HeaderDefault.Document_CreateFontCharMap(FontCharMap);
            }
            if (null != SectPr.HeaderEven) {
                SectPr.HeaderEven.Document_CreateFontCharMap(FontCharMap);
            }
            if (null != SectPr.FooterFirst) {
                SectPr.FooterFirst.Document_CreateFontCharMap(FontCharMap);
            }
            if (null != SectPr.FooterDefault) {
                SectPr.FooterDefault.Document_CreateFontCharMap(FontCharMap);
            }
            if (null != SectPr.FooterEven) {
                SectPr.FooterEven.Document_CreateFontCharMap(FontCharMap);
            }
        }
    },
    Document_Get_AllFontNames: function (AllFonts) {
        var Count = this.Elements.length;
        for (var Index = 0; Index < Count; Index++) {
            var SectPr = this.Elements[Index].SectPr;
            if (null != SectPr.HeaderFirst) {
                SectPr.HeaderFirst.Document_Get_AllFontNames(AllFonts);
            }
            if (null != SectPr.HeaderDefault) {
                SectPr.HeaderDefault.Document_Get_AllFontNames(AllFonts);
            }
            if (null != SectPr.HeaderEven) {
                SectPr.HeaderEven.Document_Get_AllFontNames(AllFonts);
            }
            if (null != SectPr.FooterFirst) {
                SectPr.FooterFirst.Document_Get_AllFontNames(AllFonts);
            }
            if (null != SectPr.FooterDefault) {
                SectPr.FooterDefault.Document_Get_AllFontNames(AllFonts);
            }
            if (null != SectPr.FooterEven) {
                SectPr.FooterEven.Document_Get_AllFontNames(AllFonts);
            }
        }
    },
    Get_Index: function (Index) {
        var Count = this.Elements.length;
        for (var Pos = 0; Pos < Count; Pos++) {
            if (Index <= this.Elements[Pos].Index) {
                return Pos;
            }
        }
        return (Count - 1);
    },
    Get_Count: function () {
        return this.Elements.length;
    },
    Get_SectPr: function (Index) {
        var Count = this.Elements.length;
        for (var Pos = 0; Pos < Count; Pos++) {
            if (Index <= this.Elements[Pos].Index) {
                return this.Elements[Pos];
            }
        }
        return this.Elements[Count - 1];
    },
    Get_SectPr2: function (Index) {
        return this.Elements[Index];
    },
    Find: function (SectPr) {
        var Count = this.Elements.length;
        for (var Index = 0; Index < Count; Index++) {
            var Element = this.Elements[Index];
            if (Element.SectPr === SectPr) {
                return Index;
            }
        }
        return -1;
    },
    Update_OnAdd: function (Pos, Items) {
        var Count = Items.length;
        var Len = this.Elements.length;
        for (var Index = 0; Index < Len; Index++) {
            if (this.Elements[Index].Index >= Pos) {
                this.Elements[Index].Index += Count;
            }
        }
        for (var Index = 0; Index < Count; Index++) {
            var Item = Items[Index];
            var SectPr = (type_Paragraph === Item.GetType() ? Item.Get_SectionPr() : undefined);
            if (undefined !== SectPr) {
                var TempPos = 0;
                for (; TempPos < Len; TempPos++) {
                    if (Pos + Index <= this.Elements[TempPos].Index) {
                        break;
                    }
                }
                this.Elements.splice(TempPos, 0, new CDocumentSectionsInfoElement(SectPr, Pos + Index));
                Len++;
            }
        }
    },
    Update_OnRemove: function (Pos, Count) {
        var Len = this.Elements.length;
        for (var Index = 0; Index < Len; Index++) {
            var CurPos = this.Elements[Index].Index;
            if (CurPos >= Pos && CurPos < Pos + Count) {
                this.Elements.splice(Index, 1);
                Len--;
                Index--;
            } else {
                if (CurPos >= Pos + Count) {
                    this.Elements[Index].Index -= Count;
                }
            }
        }
    }
};
function CDocumentSectionsInfoElement(SectPr, Index) {
    this.SectPr = SectPr;
    this.Index = Index;
}