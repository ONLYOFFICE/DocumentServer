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
var recalcresult2_End = 0;
var recalcresult2_NextPage = 1;
var StartTime;
function Document_Recalculate_Page() {
    var LogicDocument = editor.WordControl.m_oLogicDocument;
    var FullRecalc = LogicDocument.FullRecalc;
    LogicDocument.Recalculate_Page(FullRecalc.PageIndex, FullRecalc.Start, FullRecalc.StartIndex);
}
function CDocumentPage() {
    this.Width = Page_Width;
    this.Height = Page_Height;
    this.Margins = {
        Left: X_Left_Field,
        Right: X_Right_Field,
        Top: Y_Top_Field,
        Bottom: Y_Bottom_Field
    };
    this.Bounds = new CDocumentBounds(0, 0, 0, 0);
    this.Pos = 0;
    this.EndPos = 0;
    this.X = 0;
    this.Y = 0;
    this.XLimit = 0;
    this.YLimit = 0;
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
    Set_FlowObject: function (Object, RelPage, RecalcResult) {
        this.FlowObject = Object;
        this.FlowObjectPage = RelPage;
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
    this.CollaborativeEditing = CollaborativeEditing;
    this.Id = g_oIdCounter.Get_NewId();
    this.StartPage = 0;
    this.CurPage = 0;
    this.Orientation = orientation_Portrait;
    this.StyleCounter = 0;
    this.NumInfoCounter = 0;
    this.SectPr = new SectPr();
    this.SectPr.Set_PageSize(793.7000000000001, 1122, 53);
    this.SectPr.Set_PageMargins({
        Left: 75.59999999999999
    });
    this.Content = new Array();
    this.Content[0] = new Paragraph(DrawingDocument, this, 0, 50, 50, X_Right_Field, Y_Bottom_Field);
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
        UpdateOnRecalc: false
    };
    this.Pages = new Array();
    this.RecalcInfo = new CDocumentRecalcInfo();
    this.RecalcId = 0;
    this.FullRecalc = new Object();
    this.FullRecalc.Id = null;
    this.FullRecalc.X = 0;
    this.FullRecalc.Y = 0;
    this.FullRecalc.StartPos = 0;
    this.FullRecalc.CurPage = 0;
    this.TurnOffRecalc = false;
    this.Numbering = new CNumbering();
    this.Styles = new CStyles();
    this.DrawingDocument = DrawingDocument;
    this.NeedUpdateTarget = false;
    this.DrawingObjects = new CDrawingObjects();
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
    this.Comments = new CComments();
    this.Lock = new CLock();
    this.m_oContentChanges = new CContentChanges();
    this.DrawingObjects = new CGraphicObjects(this, this.DrawingDocument, editor);
    this.theme = GenerateDefaultTheme(this);
    this.clrSchemeMap = GenerateDefaultColorMap();
    this.SearchEngine = new CDocumentSearch();
    this.Spelling = new CDocumentSpelling();
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
    this.Reset = function () {
        this.m_bSelection = false;
        this.m_bTable = false;
        this.m_bMixedSelection = false;
        this.m_nDrawing = -1;
    };
    this.Set_Paragraph = function (Para) {
        this.m_pParagraph = Para;
    };
    this.Get_Paragraph = function () {
        return this.m_pParagraph;
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
    LoadEmptyDocument: function () {
        this.DrawingDocument.TargetStart();
        this.Recalculate();
        this.Interface_Update_ParaPr();
        this.Interface_Update_TextPr();
    },
    LoadTestDocument: function () {
        g_oIdCounter.Set_Load(true);
        editor.ShowParaMarks = true;
        if (true != ASC_DOCS_API_DEBUG) {
            this.LoadEmptyDocument();
            return;
        }
        this.DrawingDocument.m_bIsNoSendChangeDocument = true;
        this.Recalculate();
        this.DrawingDocument.m_bIsNoSendChangeDocument = false;
        this.DrawingDocument.m_bIsOpeningDocument = true;
        this.DrawingDocument.TargetStart();
        var Strings = ["History", "A box of punched cards with several program decks.", 'Before text editors existed, computer text was punched into punched cards with keypunch machines. The text was carried as a physical box of these thin cardboard cards, and read into a card-reader. Magnetic tape or disk "card-image" files created from such card decks often had no line-separation characters at all, commonly assuming fixed-length 80-character records. An alternative to cards was punched paper tape, generated by teletype (TTY) machines; these did need special characters to indicate ends of records.', 'The first text editors were line editors oriented to teletype- or typewriter- style terminals, which did not provide a window or screen-oriented display. They usually had very short commands (to minimize typing) that reproduced the current line. Among them were a command to print a selected section(s) of the file on the typewriter (or printer) in case of necessity. An "edit cursor", an imaginary insertion point, could be moved by special commands that operated with line numbers of specific text strings (context). Later, the context strings were extended to regular expressions. To see the changes, the file needed to be printed on the printer. These "line-based text editors" were considered revolutionary improvements over keypunch machines. In case typewriter-based terminals were not available, they were adapted to keypunch equipment. In this case the user needed to punch the commands into the separate deck of cards and feed them into the computer in order to edit the file.', 'When computer terminals with video screens became available, screen-based text editors (sometimes termed just "screen editors") became common. One of the earliest "full screen" editors was O26 - which was written for the operator console of the CDC 6000 series machines in 1967. Another early full screen editor is vi. Written in the 1970s, vi is still a standard editor[1] for Unix and Linux operating systems. Vi and Emacs are popular editors on these systems. The productivity of editing using full-screen editors (compared to the line-based editors) motivated many of the early purchases of video terminals.'];
        var oldPara = this.Content[this.Content.length - 1];
        var Para = new Paragraph(this.DrawingDocument, this, 0, 50, 50, X_Right_Field, Y_Bottom_Field);
        oldPara.Set_DocumentNext(Para);
        Para.Set_DocumentPrev(oldPara);
        this.Content.push(Para);
        for (var j = 0; j < 10; j++) {
            var Pos = 0;
            for (var i = 0; i < Strings.length; i++) {
                switch (i) {
                case 0:
                    Para.Style_Add(this.Styles.Get_Default_Heading(0));
                    break;
                default:
                    Para.Pr.Jc = align_Justify;
                    break;
                }
                for (var Index = 0; Index < Strings[i].length; Index++) {
                    if (" " != Strings[i].charAt(Index)) {
                        Para.Internal_Content_Add(Pos++, new ParaText(Strings[i].charAt(Index)));
                    } else {
                        Para.Internal_Content_Add(Pos++, new ParaSpace());
                    }
                }
                oldPara = Para;
                Para = new Paragraph(this.DrawingDocument, this, 0, 50, 50, X_Right_Field, Y_Bottom_Field);
                oldPara.Set_DocumentNext(Para);
                Para.Set_DocumentPrev(oldPara);
                this.Content.push(Para);
                Pos = 0;
            }
        }
        this.Recalculate();
        var Rand = Math.floor(Math.random() * 100);
        g_oIdCounter.Set_UserId("" + Rand);
        g_oIdCounter.Set_Load(false);
    },
    Set_CurrentElement: function (Index) {
        var ContentPos = Math.max(0, Math.min(this.Content.length - 1, Index));
        this.CurPos.Type = docpostype_Content;
        this.Selection_Remove();
        this.CurPos.ContentPos = Math.max(0, Math.min(this.Content.length - 1, Index));
        if (true === this.Content[ContentPos].Is_SelectionUse()) {
            this.Selection.Use = true;
            this.Selection.StartPos = ContentPos;
            this.Selection.EndPos = ContentPos;
        }
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
        this.Document_UpdateSelectionState();
    },
    Is_ThisElementCurrent: function () {
        return true;
    },
    Get_PageContentStartPos: function (PageIndex) {
        var Y = Y_Top_Field;
        var YHeader = this.HdrFtr.Get_HeaderBottomPos(PageIndex);
        if (YHeader >= 0 && YHeader > Y) {
            Y = YHeader;
        }
        var YLimit = Y_Bottom_Field;
        var YFooter = this.HdrFtr.Get_FooterTopPos(PageIndex);
        if (YFooter >= 0 && YFooter < YLimit) {
            YLimit = YFooter;
        }
        return {
            X: X_Left_Field,
            Y: Y,
            XLimit: X_Right_Field,
            YLimit: YLimit
        };
    },
    Get_PageLimits: function (PageIndex) {
        return {
            X: 0,
            Y: 0,
            XLimit: Page_Width,
            YLimit: Page_Height
        };
    },
    Get_PageFields: function (PageIndex) {
        return {
            X: X_Left_Field,
            Y: Y_Top_Field,
            XLimit: X_Right_Field,
            YLimit: Y_Bottom_Field
        };
    },
    Recalculate: function (bOneParagraph, bRecalcContentLast, _RecalcData) {
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
        this.RecalcInfo.Reset();
        var ChangeIndex = 0;
        var RecalcData = (undefined === _RecalcData ? History.Get_RecalcData() : _RecalcData);
        for (var GraphIndex = 0; GraphIndex < RecalcData.Flow.length; GraphIndex++) {
            RecalcData.Flow[GraphIndex].recalculateDocContent();
        }
        var bFullRecalc = false;
        for (var HdrFtrIndex = 0; HdrFtrIndex < RecalcData.HdrFtr.length; HdrFtrIndex++) {
            if (true === RecalcData.HdrFtr[HdrFtrIndex].Recalculate()) {
                bFullRecalc = true;
            }
        }
        if (true === bFullRecalc) {
            ChangeIndex = 0;
            RecalcData.Inline.PageNum = 0;
        } else {
            if (-1 === RecalcData.Inline.Pos) {
                ChangeIndex = -1;
                RecalcData.Inline.PageNum = 0;
            } else {
                if (RecalcData.Inline.Pos >= 0) {
                    ChangeIndex = RecalcData.Inline.Pos;
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
        this.FullRecalc.PageIndex = StartPage;
        this.FullRecalc.Start = true;
        this.FullRecalc.StartIndex = StartIndex;
        this.FullRecalc.StartPage = StartPage;
        this.DrawingObjects.updateCharts();
        this.DrawingDocument.OnStartRecalculate(StartPage);
        this.Recalculate_Page(StartPage, true, StartIndex);
    },
    Recalculate_Page: function (PageIndex, bStart, StartIndex) {
        if (true === bStart) {
            this.Pages.length = PageIndex;
            this.Pages[PageIndex] = new CDocumentPage();
            this.Pages[PageIndex].Pos = StartIndex;
            this.DrawingObjects.createGraphicPage(PageIndex);
            this.DrawingObjects.resetDrawingArrays(PageIndex, this);
        }
        var Count = this.Content.length;
        var StartPos = this.Get_PageContentStartPos(PageIndex);
        var X = StartPos.X;
        var StartY = StartPos.Y;
        var Y = StartY;
        var YLimit = StartPos.YLimit;
        var XLimit = StartPos.XLimit;
        var bReDraw = true;
        var bContinue = false;
        var _PageIndex = PageIndex;
        var _StartIndex = StartIndex;
        var _bStart = false;
        var Index;
        for (Index = StartIndex; Index < Count; Index++) {
            var Element = this.Content[Index];
            Element.TurnOff_RecalcEvent();
            var RecalcResult = recalcresult_NextElement;
            var bFlow = false;
            if (type_Table === Element.GetType() && true != Element.Is_Inline()) {
                bFlow = true;
                if (true === this.RecalcInfo.Can_RecalcObject()) {
                    if ((0 === Index && 0 === PageIndex) || Index != StartIndex) {
                        Element.Set_DocumentIndex(Index);
                        Element.Reset(X, Y, XLimit, YLimit, PageIndex);
                    }
                    var TempRecalcResult = Element.Recalculate_Page(PageIndex);
                    this.RecalcInfo.Set_FlowObject(Element, 0, Element.Recalculate_Page(PageIndex));
                    var FlowTable = new CFlowTable2(Element, PageIndex);
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
                                    Element.Reset(X, Page_Height, XLimit, Page_Height, PageIndex);
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
                                this.DrawingObjects.addFloatTable(new CFlowTable2(Element, PageIndex));
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
                        var FrameH = 0;
                        var FrameW = -1;
                        var Frame_XLimit = FramePr.Get_W();
                        var Frame_YLimit = FramePr.Get_H();
                        if (undefined === Frame_XLimit) {
                            Frame_XLimit = Page_Width - X_Left_Margin - X_Right_Margin;
                        }
                        if (undefined === Frame_YLimit) {
                            Frame_YLimit = Page_Height;
                        }
                        for (var TempIndex = Index; TempIndex < Index + FlowCount; TempIndex++) {
                            var TempElement = this.Content[TempIndex];
                            TempElement.Set_DocumentIndex(TempIndex);
                            if (Index != TempIndex || true != this.RecalcInfo.FrameRecalc) {
                                TempElement.Reset(0, FrameH, Frame_XLimit, Frame_YLimit, PageIndex);
                            }
                            TempElement.Recalculate_Page(PageIndex);
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
                        var FrameHAnchor = (FramePr.HAnchor === undefined ? c_oAscHAnchor.Page : FramePr.HAnchor);
                        var FrameVAnchor = (FramePr.VAnchor === undefined ? c_oAscVAnchor.Page : FramePr.VAnchor);
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
                                    FrameX = X_Left_Margin - FrameW;
                                    break;
                                case c_oAscXAlign.Right:
                                    FrameX = X_Right_Field;
                                    break;
                                case c_oAscXAlign.Center:
                                    FrameX = (Page_Width - FrameW) / 2;
                                    break;
                                }
                                break;
                            case c_oAscHAnchor.Text:
                                case c_oAscHAnchor.Margin:
                                switch (XAlign) {
                                case c_oAscXAlign.Inside:
                                    case c_oAscXAlign.Outside:
                                    case c_oAscXAlign.Left:
                                    FrameX = X_Left_Margin;
                                    break;
                                case c_oAscXAlign.Right:
                                    FrameX = X_Right_Field - FrameW;
                                    break;
                                case c_oAscXAlign.Center:
                                    FrameX = (X_Left_Field + X_Right_Field - FrameW) / 2;
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
                                FrameX = X_Left_Margin + FramePr.X;
                                break;
                            }
                        }
                        if (FrameW + FrameX > Page_Width) {
                            FrameX = Page_Width - FrameW;
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
                                    case c_oAscYAlign.Inline:
                                    case c_oAscYAlign.Outside:
                                    case c_oAscYAlign.Top:
                                    FrameY = 0;
                                    break;
                                case c_oAscYAlign.Bottom:
                                    FrameY = Page_Height - FrameH;
                                    break;
                                case c_oAscYAlign.Center:
                                    FrameY = (Page_Height - FrameH) / 2;
                                    break;
                                }
                                break;
                            case c_oAscVAnchor.Text:
                                FramePr = Y;
                                break;
                            case c_oAscVAnchor.Margin:
                                switch (YAlign) {
                                case c_oAscYAlign.Inside:
                                    case c_oAscYAlign.Inline:
                                    case c_oAscYAlign.Outside:
                                    case c_oAscYAlign.Top:
                                    FrameY = Y_Top_Field;
                                    break;
                                case c_oAscYAlign.Bottom:
                                    FrameY = Y_Bottom_Field - FrameH;
                                    break;
                                case c_oAscYAlign.Center:
                                    FrameY = (Y_Top_Field + Y_Bottom_Field - FrameH) / 2;
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
                                FrameY = FramePrY + Y_Top_Field;
                                break;
                            }
                        }
                        if (FrameH + FrameY > Page_Height) {
                            FrameY = Page_Height - FrameH;
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
                            this.DrawingObjects.addFloatTable(new CFlowParagraph(Element, FrameX2, FrameY2, FrameW2, FrameH2, FrameDx, FrameDy, Index, FlowCount));
                            Index += FlowCount - 1;
                            if (FrameY >= Y) {
                                RecalcResult = recalcresult_NextElement;
                            } else {
                                this.RecalcInfo.Set_FlowObject(Element, FlowCount, recalcresult_NextElement);
                                RecalcResult = recalcresult_CurPage;
                            }
                        }
                    } else {
                        if (true === this.RecalcInfo.Check_FlowObject(Element)) {
                            Index += this.RecalcInfo.FlowObjectPage - 1;
                            this.RecalcInfo.Reset();
                            RecalcResult = recalcresult_NextElement;
                        } else {
                            RecalcResult = recalcresult_NextElement;
                        }
                    }
                } else {
                    if ((0 === Index && 0 === PageIndex) || Index != StartIndex) {
                        Element.Set_DocumentIndex(Index);
                        Element.Reset(X, Y, XLimit, YLimit, PageIndex);
                    }
                    RecalcResult = Element.Recalculate_Page(PageIndex);
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
                if (recalcresult_NextElement === RecalcResult) {} else {
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
            if (docpostype_Content == this.CurPos.Type && Index >= this.ContentLastChangePos && Index == this.CurPos.ContentPos) {
                if (type_Paragraph === Element.GetType()) {
                    this.CurPage = Element.PageNum + Element.CurPos.PagesPos;
                } else {
                    this.CurPage = Element.PageNum;
                }
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
        }
        if (true === bContinue) {
            this.FullRecalc.PageIndex = _PageIndex;
            this.FullRecalc.Start = _bStart;
            this.FullRecalc.StartIndex = _StartIndex;
            if (_PageIndex > this.FullRecalc.StartPage + 2) {
                this.FullRecalc.Id = setTimeout(Document_Recalculate_Page, 20);
            } else {
                this.Recalculate_Page(_PageIndex, _bStart, _StartIndex);
            }
        }
    },
    Reset_RecalculateCache: function () {
        this.HdrFtr.Reset_RecalculateCache();
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
            this.Document_UpdateRulersState();
            this.RecalculateCurPos();
            this.NeedUpdateTarget = false;
        }
    },
    RecalculateCurPos: function () {
        if (docpostype_Content === this.CurPos.Type) {
            if (this.CurPos.ContentPos >= 0 && "undefined" != typeof(this.Content[this.CurPos.ContentPos].RecalculateCurPos) && (null === this.FullRecalc.Id || this.FullRecalc.StartIndex > this.CurPos.ContentPos)) {
                this.Internal_CheckCurPage();
                this.Content[this.CurPos.ContentPos].RecalculateCurPos();
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
    },
    Internal_CheckCurPage: function () {
        if (this.CurPos.ContentPos >= 0 && (null === this.FullRecalc.Id || this.FullRecalc.StartIndex > this.CurPos.ContentPos)) {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var ParaDrawing = this.DrawingObjects.getMajorParaDrawing();
                if (null != ParaDrawing) {
                    var Paragraph = ParaDrawing.Parent;
                    this.CurPage = Paragraph.Get_CurrentPage_Absolute();
                }
            } else {
                if (this.CurPos.ContentPos >= 0) {
                    this.CurPage = this.Content[this.CurPos.ContentPos].Get_CurrentPage_Absolute();
                }
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
        if ("undefined" == typeof(pGraphics)) {
            pGraphics = Canvas;
        }
        if ("undefined" == typeof(nPageIndex)) {
            nPageIndex = this.CurPage;
        }
        this.Comments.Reset_CurrentDraw(nPageIndex);
        if (docpostype_HdrFtr === this.CurPos.Type) {
            var PageMetrics = this.Get_PageContentStartPos(nPageIndex);
            pGraphics.DrawHeaderEdit(PageMetrics.Y, this.HdrFtr.Lock.Get_Type());
            pGraphics.DrawFooterEdit(PageMetrics.YLimit, this.HdrFtr.Lock.Get_Type());
        } else {
            pGraphics.Start_GlobalAlpha();
        }
        this.DrawingObjects.drawBehindDocHdrFtr(nPageIndex, pGraphics);
        this.DrawingObjects.drawWrappingObjectsHdrFtr(nPageIndex, pGraphics);
        this.HdrFtr.Draw(nPageIndex, pGraphics);
        this.DrawingObjects.drawBeforeObjectsHdrFtr(nPageIndex, pGraphics);
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
        if (docpostype_HdrFtr === this.CurPos.Type) {
            pGraphics.put_GlobalAlpha(false, 1);
        }
    },
    Add_NewParagraph: function (bRecalculate) {
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
                    if (undefined != Item.Numbering_Get() && true === Item.IsEmpty()) {
                        Item.Numbering_Remove();
                        Item.Set_Ind({
                            FirstLine: undefined,
                            Left: undefined,
                            Right: Item.Pr.Ind.Right
                        },
                        true);
                    } else {
                        var NewParagraph = new Paragraph(this.DrawingDocument, this, 0, 0, 0, X_Left_Field, Y_Bottom_Field);
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
                            var NewParagraph = new Paragraph(this.DrawingDocument, this, 0, 0, 0, X_Left_Field, Y_Bottom_Field);
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
        this.Create_NewHistoryPoint();
        this.History.Set_Additional_ExtendDocumentToPos();
        while (true) {
            var NewParagraph = new Paragraph(this.DrawingDocument, this, 0, 0, 0, X_Left_Field, Y_Bottom_Field);
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
            if (undefined != LastPara.TextPr.Value.FontSize) {
                NewParagraph.TextPr.Set_FontSize(LastPara.TextPr.Value.FontSize);
                NewParagraph.Internal_Content_Add(0, new ParaTextPr({
                    FontSize: LastPara.TextPr.Value.FontSize,
                    FontSizeCS: LastPara.TextPr.Value.FontSize
                }));
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
        LastPara.Document_SetThisElementCurrent();
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
    Add_FlowImage: function (W, H, Img) {
        return;
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
                        Drawing = new ParaDrawing(W, H, null, this.DrawingDocument, this);
                        var Image = new WordImage(Drawing, this, this.DrawingDocument, null);
                        Drawing.Set_GraphicObject(Image);
                        Image.init(Img, W, H, Chart);
                    } else {
                        Drawing = Chart;
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
    Get_ChartObject: function () {
        return this.DrawingObjects.getChartObject();
    },
    Add_FlowTable: function (Cols, Rows) {
        return;
    },
    Add_InlineTable: function (Cols, Rows) {
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
                    var W = (X_Right_Field - X_Left_Field + 2 * 1.9);
                    var Grid = [];
                    W = Math.max(W, Cols * 2 * 1.9);
                    for (var Index = 0; Index < Cols; Index++) {
                        Grid[Index] = W / Cols;
                    }
                    var NewTable = new CTable(this.DrawingDocument, this, true, 0, 0, 0, X_Left_Field, Y_Bottom_Field, Rows, Cols, Grid);
                    if (true === Item.Cursor_IsEnd()) {
                        NewTable.Cursor_MoveToStartPos();
                        this.Internal_Content_Add(this.CurPos.ContentPos + 1, NewTable);
                        this.CurPos.ContentPos++;
                        this.ContentLastChangePos = this.CurPos.ContentPos - 1;
                        this.Recalculate();
                        this.Interface_Update_ParaPr();
                        this.Interface_Update_TextPr();
                        this.Interface_Update_TablePr();
                    } else {
                        var NewParagraph = new Paragraph(this.DrawingDocument, this, 0, 0, 0, X_Left_Field, Y_Bottom_Field);
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
            this.Create_NewHistoryPoint();
            var NewParagraph = new Paragraph(this.DrawingDocument, this, 0, 0, 0, X_Right_Field, Y_Bottom_Field);
            var TextPr = OldParagraph.Split_DropCap(NewParagraph);
            var LineH = OldParagraph.Lines[0].Bottom - OldParagraph.Lines[0].Top;
            var LineTA = OldParagraph.Lines[0].Metrics.TextAscent2;
            var LineTD = OldParagraph.Lines[0].Metrics.TextDescent + OldParagraph.Lines[0].Metrics.LineGap;
            var FramePr = new CFramePr();
            FramePr.Init_Default_DropCap(bInText);
            NewParagraph.Set_FrameParaPr(OldParagraph);
            NewParagraph.Set_FramePr2(FramePr);
            NewParagraph.Update_DropCapByLines(TextPr, NewParagraph.Pr.FramePr.Lines, LineH, LineTA, LineTD);
            this.Internal_Content_Add(Pos, NewParagraph);
            OldParagraph.Cursor_MoveToStartPos();
            this.Selection_Remove();
            this.CurPos.ContentPos = Pos + 1;
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
                this.Create_NewHistoryPoint();
                var Count = FrameParas.length;
                for (var Index = 0; Index < Count; Index++) {
                    FrameParas[Index].Set_FramePr(undefined, true);
                }
                this.Recalculate();
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
                    this.Create_NewHistoryPoint();
                    FrameParas.splice(FrameParas.length - 1, 1);
                    Next.Cursor_MoveToStartPos();
                    var Spacing = Next.Get_CompiledPr2(false).ParaPr.Spacing.Copy();
                    var TextPr = Next.Internal_CalculateTextPr(Next.CurPos.ContentPos);
                    var Count = FrameParas.length;
                    for (var Index = 0; Index < Count; Index++) {
                        var FramePara = FrameParas[Index];
                        FramePara.Set_FramePr(undefined, true);
                        FramePara.Set_Spacing(Spacing, true);
                        FramePara.Select_All();
                        FramePara.Add(new ParaTextPr(TextPr));
                    }
                    Next.CopyPr(Last);
                    Last.Concat(Next);
                    this.Internal_Content_Remove(Next.Index, 1);
                    Last.Cursor_MoveToStartPos();
                    Last.Document_SetThisElementCurrent();
                    this.Recalculate();
                    this.Document_UpdateRulersState();
                }
            } else {
                if (false === this.Document_Is_SelectionLocked(changestype_None, {
                    Type: changestype_2_ElementsArray_and_Type,
                    Elements: FrameParas,
                    CheckType: changestype_Paragraph_Content
                })) {
                    this.Create_NewHistoryPoint();
                    var Count = FrameParas.length;
                    for (var Index = 0; Index < Count; Index++) {
                        FrameParas[Index].Set_FramePr(undefined, true);
                    }
                    this.Recalculate();
                    this.Document_UpdateRulersState();
                }
            }
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
                return bRetValue;
            } else {
                if (true === this.Selection.Use) {
                    var Type = ParaItem.Type;
                    switch (Type) {
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
                            this.Add_NewParagraph();
                            this.Content[this.CurPos.ContentPos - 1].Cursor_MoveToStartPos();
                            this.Content[this.CurPos.ContentPos - 1].Add(ParaItem);
                            this.Content[this.CurPos.ContentPos - 1].Clear_Formatting();
                            this.ContentLastChangePos = this.CurPos.ContentPos - 1;
                        } else {
                            this.Add_NewParagraph();
                            this.Add_NewParagraph();
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
                            this.ContentLastChangePos = this.CurPos.ContentPos;
                            this.Recalculate(true);
                        }
                        Item.CurPos.RealX = Item.CurPos.X;
                        Item.CurPos.RealY = Item.CurPos.Y;
                    }
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
            this.Selection_Remove();
            this.Selection.Use = false;
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
                this.Remove_NumberingSelection();
                if (true === this.Selection.Use) {
                    var StartPos = this.Selection.StartPos;
                    var EndPos = this.Selection.EndPos;
                    if (EndPos < StartPos) {
                        var Temp = StartPos;
                        StartPos = EndPos;
                        EndPos = Temp;
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
                            if (type_Paragraph == StartType && type_Paragraph == EndType) {
                                this.Content[StartPos].CurPos.ContentPos = this.Content[StartPos].Internal_GetEndPos();
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
                                        this.Content[StartPos].CurPos.ContentPos = this.Content[StartPos].Internal_GetEndPos();
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
                                            var NewPara = new Paragraph(this.DrawingDocument, this, 0, 0, 0, X_Right_Field, Y_Bottom_Field);
                                            this.Internal_Content_Add(0, NewPara);
                                            this.Internal_Content_Remove(1, this.Content.length - 1);
                                        } else {
                                            this.Internal_Content_Remove(StartPos, EndPos - StartPos + 1);
                                        }
                                        if (StartPos >= this.Content.length) {
                                            this.CurPos.ContentPos = this.Content.length - 1;
                                            this.Content[this.CurPos.ContentPos].CurPos.ContentPos = this.Content[this.CurPos.ContentPos].Internal_GetEndPos();
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
                                            this.Content[this.CurPos.ContentPos].CurPos.ContentPos = this.Content[this.CurPos.ContentPos].Internal_GetEndPos();
                                        } else {
                                            this.CurPos.ContentPos = StartPos;
                                            this.Content[StartPos].Cursor_MoveToStartPos();
                                        }
                                        this.ContentLastChangePos = this.CurPos.ContentPos;
                                        this.Recalculate();
                                        this.Interface_Update_ParaPr();
                                        this.Interface_Update_TextPr();
                                        return;
                                    } else {
                                        if (this.CurPos.ContentPos < this.Content.length - 1 && type_Paragraph == this.Content[this.CurPos.ContentPos + 1].GetType()) {
                                            this.Content[StartPos].Concat(this.Content[StartPos + 1]);
                                            this.Internal_Content_Remove(StartPos + 1, 1);
                                            this.Interface_Update_ParaPr();
                                        }
                                    }
                                }
                            }
                        }
                    }
                    this.Content[this.CurPos.ContentPos].Selection_Remove();
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
                                            var NewPos = Prev.Content.length - 2;
                                            Prev.Concat(this.Content[this.CurPos.ContentPos]);
                                            this.Internal_Content_Remove(this.CurPos.ContentPos, 1);
                                            this.CurPos.ContentPos--;
                                            this.Content[this.CurPos.ContentPos].CurPos.ContentPos = NewPos;
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
    Cursor_MoveToStartPos: function () {
        this.Selection.Start = false;
        this.Selection.Use = false;
        this.Selection.StartPos = 0;
        this.Selection.EndPos = 0;
        this.Selection.Flag = selectionflag_Common;
        this.CurPos.ContentPos = 0;
        this.CurPos.Type = docpostype_Content;
        this.Content[0].Cursor_MoveToStartPos();
    },
    Cursor_MoveToEndPos: function () {
        this.Selection.Start = false;
        this.Selection.Use = false;
        this.Selection.StartPos = 0;
        this.Selection.EndPos = 0;
        this.Selection.Flag = selectionflag_Common;
        this.CurPos.ContentPos = this.Content.length - 1;
        this.CurPos.Type = docpostype_Content;
        this.Content[this.CurPos.ContentPos].Cursor_MoveToEndPos();
    },
    Cursor_MoveLeft: function (AddToSelect, Word) {
        if ("undefined" === typeof(Word) || null === Word) {
            Word = false;
        }
        if (docpostype_HdrFtr === this.CurPos.Type) {
            var RetValue = this.HdrFtr.Cursor_MoveLeft(AddToSelect, Word);
            this.Document_UpdateInterfaceState();
            this.Document_UpdateSelectionState();
            return RetValue;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var RetValue = this.DrawingObjects.cursorMoveLeft(AddToSelect, Word);
                this.Document_UpdateInterfaceState();
                this.Document_UpdateSelectionState();
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
                                    if (false === Item.Is_SelectionUse()) {
                                        Item.CurPos.ContentPos = Item.Content.length - 1;
                                        Item.Selection.Use = true;
                                        Item.Selection.StartPos = Item.Content.length - 1;
                                        Item.Selection.EndPos = Item.Content.length - 1;
                                    }
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
                                            Item.Selection.Data = new Array();
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
                                    if (false === Item.Is_SelectionUse()) {
                                        Item.CurPos.ContentPos = Item.Content.length - 1;
                                        Item.Selection.Use = true;
                                        Item.Selection.StartPos = Item.Content.length - 1;
                                        Item.Selection.EndPos = Item.Content.length - 1;
                                    }
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
                                            Item.Selection.Data = new Array();
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
            }
        }
    },
    Cursor_MoveRight: function (AddToSelect, Word) {
        if ("undefined" === typeof(Word) || null === Word) {
            Word = false;
        }
        if (docpostype_HdrFtr === this.CurPos.Type) {
            var RetValue = this.HdrFtr.Cursor_MoveRight(AddToSelect, Word);
            this.Document_UpdateInterfaceState();
            this.Document_UpdateSelectionState();
            return RetValue;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var RetValue = this.DrawingObjects.cursorMoveRight(AddToSelect, Word);
                this.Document_UpdateInterfaceState();
                this.Document_UpdateSelectionState();
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
                                            Item.Selection.Data = new Array();
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
                        if (false === this.Content[this.CurPos.ContentPos].Cursor_MoveRight(1, false, Word)) {
                            if (this.Content.length - 1 === this.CurPos.ContentPos) {
                                var Item = this.Content[this.CurPos.ContentPos];
                                var StartPos = Item.Internal_GetEndPos();
                                Item.CurPos.ContentPos = StartPos;
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
                                            Item.Selection.Data = new Array();
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
            }
        }
    },
    Cursor_MoveUp: function (AddToSelect) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
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
            } else {
                if (this.CurPos.ContentPos < 0) {
                    return false;
                }
                this.Remove_NumberingSelection();
                if (true === this.Selection.Use) {
                    if (true === AddToSelect) {
                        var Item = this.Content[this.Selection.EndPos];
                        if (false === Item.Cursor_MoveUp(1, true) && 0 != this.Selection.EndPos) {
                            var TempXY = Item.Get_CurPosXY();
                            this.CurPos.RealX = TempXY.X;
                            this.CurPos.RealY = TempXY.Y;
                            this.Selection.EndPos--;
                            Item = this.Content[this.Selection.EndPos];
                            Item.Cursor_MoveUp_To_LastRow(this.CurPos.RealX, this.CurPos.RealY, true);
                        }
                        if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse()) {
                            this.Selection.Use = false;
                        }
                        this.CurPos.ContentPos = this.Selection.EndPos;
                    } else {
                        var Start = this.Selection.StartPos;
                        if (Start > this.Selection.EndPos) {
                            Start = this.Selection.EndPos;
                        }
                        this.CurPos.ContentPos = Start;
                        var Item = this.Content[this.CurPos.ContentPos];
                        if (false === this.Content[this.CurPos.ContentPos].Cursor_MoveUp(1, false) && 0 != this.CurPos.ContentPos) {
                            var TempXY = Item.Get_CurPosXY();
                            this.CurPos.RealX = TempXY.X;
                            this.CurPos.RealY = TempXY.Y;
                            this.CurPos.ContentPos--;
                            Item = this.Content[this.CurPos.ContentPos];
                            Item.Cursor_MoveUp_To_LastRow(this.CurPos.RealX, this.CurPos.RealY, false);
                        }
                        this.Selection_Remove();
                    }
                } else {
                    if (true === AddToSelect) {
                        this.Selection.Use = true;
                        this.Selection.StartPos = this.CurPos.ContentPos;
                        this.Selection.EndPos = this.CurPos.ContentPos;
                        var Item = this.Content[this.CurPos.ContentPos];
                        if (false === Item.Cursor_MoveUp(1, true) && 0 != this.CurPos.ContentPos) {
                            var TempXY = Item.Get_CurPosXY();
                            this.CurPos.RealX = TempXY.X;
                            this.CurPos.RealY = TempXY.Y;
                            this.CurPos.ContentPos--;
                            Item = this.Content[this.CurPos.ContentPos];
                            Item.Cursor_MoveUp_To_LastRow(this.CurPos.RealX, this.CurPos.RealY, true);
                            this.Selection.EndPos = this.CurPos.ContentPos;
                        }
                        if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Selection.Use) {
                            this.Selection.Use = false;
                        }
                        this.CurPos.ContentPos = this.Selection.EndPos;
                    } else {
                        var Item = this.Content[this.CurPos.ContentPos];
                        if (false === Item.Cursor_MoveUp(1, false) && 0 != this.CurPos.ContentPos) {
                            var TempXY = Item.Get_CurPosXY();
                            this.CurPos.RealX = TempXY.X;
                            this.CurPos.RealY = TempXY.Y;
                            this.CurPos.ContentPos--;
                            Item = this.Content[this.CurPos.ContentPos];
                            Item.Cursor_MoveUp_To_LastRow(this.CurPos.RealX, this.CurPos.RealY, false);
                        }
                    }
                }
                this.Document_UpdateInterfaceState();
                this.Document_UpdateRulersState();
            }
        }
    },
    Cursor_MoveDown: function (AddToSelect) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
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
            } else {
                if (this.CurPos.ContentPos < 0) {
                    return false;
                }
                this.Remove_NumberingSelection();
                if (true === this.Selection.Use) {
                    if (true === AddToSelect) {
                        var Item = this.Content[this.Selection.EndPos];
                        if (false === Item.Cursor_MoveDown(1, true) && this.Content.length - 1 != this.Selection.EndPos) {
                            var TempXY = Item.Get_CurPosXY();
                            this.CurPos.RealX = TempXY.X;
                            this.CurPos.RealY = TempXY.Y;
                            this.Selection.EndPos++;
                            Item = this.Content[this.Selection.EndPos];
                            Item.Cursor_MoveDown_To_FirstRow(this.CurPos.RealX, this.CurPos.RealY, true);
                        }
                        if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse()) {
                            this.Selection.Use = false;
                        }
                        this.CurPos.ContentPos = this.Selection.EndPos;
                    } else {
                        var End = this.Selection.EndPos;
                        if (End < this.Selection.StartPos) {
                            End = this.Selection.StartPos;
                        }
                        this.CurPos.ContentPos = End;
                        var Item = this.Content[this.CurPos.ContentPos];
                        if (false === this.Content[this.CurPos.ContentPos].Cursor_MoveDown(1, false) && this.Content.length - 1 != this.CurPos.ContentPos) {
                            var TempXY = Item.Get_CurPosXY();
                            this.CurPos.RealX = TempXY.X;
                            this.CurPos.RealY = TempXY.Y;
                            this.CurPos.ContentPos++;
                            Item = this.Content[this.CurPos.ContentPos];
                            Item.Cursor_MoveDown_To_FirstRow(this.CurPos.RealX, this.CurPos.RealY, false);
                        }
                        this.Selection_Remove();
                    }
                } else {
                    if (true === AddToSelect) {
                        this.Selection.Use = true;
                        this.Selection.StartPos = this.CurPos.ContentPos;
                        this.Selection.EndPos = this.CurPos.ContentPos;
                        var Item = this.Content[this.CurPos.ContentPos];
                        if (false === Item.Cursor_MoveDown(1, true) && this.Content.length - 1 != this.CurPos.ContentPos) {
                            var TempXY = Item.Get_CurPosXY();
                            this.CurPos.RealX = TempXY.X;
                            this.CurPos.RealY = TempXY.Y;
                            this.CurPos.ContentPos++;
                            Item = this.Content[this.CurPos.ContentPos];
                            Item.Cursor_MoveDown_To_FirstRow(this.CurPos.RealX, this.CurPos.RealY, true);
                            this.Selection.EndPos = this.CurPos.ContentPos;
                        }
                        if (this.Selection.StartPos == this.Selection.EndPos && false === this.Content[this.Selection.StartPos].Is_SelectionUse()) {
                            this.Selection.Use = false;
                        }
                        this.CurPos.ContentPos = this.Selection.EndPos;
                    } else {
                        var Item = this.Content[this.CurPos.ContentPos];
                        if (false === Item.Cursor_MoveDown(1, AddToSelect) && this.Content.length - 1 != this.CurPos.ContentPos) {
                            var TempXY = Item.Get_CurPosXY();
                            this.CurPos.RealX = TempXY.X;
                            this.CurPos.RealY = TempXY.Y;
                            this.CurPos.ContentPos++;
                            Item = this.Content[this.CurPos.ContentPos];
                            Item.Cursor_MoveDown_To_FirstRow(this.CurPos.RealX, this.CurPos.RealY, false);
                        }
                    }
                }
                this.Document_UpdateInterfaceState();
                this.Document_UpdateRulersState();
            }
        }
    },
    Cursor_MoveEndOfLine: function (AddToSelect) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            var RetValue = this.HdrFtr.Cursor_MoveEndOfLine(AddToSelect);
            this.Document_UpdateInterfaceState();
            return RetValue;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var RetValue = this.DrawingObjects.cursorMoveEndOfLine(AddToSelect);
                this.Document_UpdateInterfaceState();
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
            }
        }
    },
    Cursor_MoveStartOfLine: function (AddToSelect) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            var RetValue = this.HdrFtr.Cursor_MoveStartOfLine(AddToSelect);
            this.Document_UpdateInterfaceState();
            return RetValue;
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var RetValue = this.DrawingObjects.cursorMoveStartOfLine(AddToSelect);
                this.Document_UpdateInterfaceState();
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
            }
        }
    },
    Cursor_MoveAt: function (X, Y, AddToSelect) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Cursor_MoveAt(X, Y, AddToSelect);
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
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Set_ParagraphAlign(Align);
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                this.DrawingObjects.setParagraphAlign(Align);
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
                                    NumId = this.Numbering.Create_AbstractNum();
                                    NumLvl = 0;
                                    this.Numbering.Get_AbstractNum(NumId).Create_Default_Numbered();
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
                            Item.Document_SetThisElementCurrent();
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
                                    var NumId = undefined;
                                    var NumLvl = 0;
                                    if ("undefined" != typeof(Prev) && null != Prev && type_Paragraph === Prev.GetType()) {
                                        var PrevNumPr = Prev.Numbering_Get();
                                        if (undefined != PrevNumPr && true === this.Numbering.Check_Format(PrevNumPr.NumId, PrevNumPr.Lvl, numbering_numfmt_Decimal)) {
                                            NumId = PrevNumPr.NumId;
                                            NumLvl = PrevNumPr.Lvl;
                                        }
                                    }
                                    if (undefined === NumId) {
                                        NumId = this.Numbering.Create_AbstractNum();
                                        NumLvl = 0;
                                        this.Numbering.Get_AbstractNum(NumId).Create_Default_Numbered();
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
                        break;
                    case selectionflag_Numbering:
                        break;
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
                        this.Document_UpdateInterfaceState();
                        return false;
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
                    case selectionflag_Numbering:
                        break;
                    }
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
                    case selectionflag_Numbering:
                        break;
                    }
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
                    case selectionflag_Numbering:
                        break;
                    }
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
                    case selectionflag_Numbering:
                        break;
                    }
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
                    case selectionflag_Numbering:
                        break;
                    }
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
                    case selectionflag_Numbering:
                        break;
                    }
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
                if (selectionflag_Numbering === this.Selection.Flag) {
                    return;
                }
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
                this.Create_NewHistoryPoint();
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
                                this.Content[this.CurPos.ContentPos - 1].Supplement_FramePr(Result_ParaPr.FramePr);
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
                        if (type_Paragraph == this.Content[StartPos].GetType()) {
                            VisTextPr = this.Content[StartPos].Selection_CalculateTextPr();
                        } else {
                            if (type_Table == this.Content[StartPos].GetType()) {
                                VisTextPr = this.Content[StartPos].Get_Paragraph_TextPr();
                            }
                        }
                        for (var Index = StartPos + 1; Index <= EndPos; Index++) {
                            var Item = this.Content[Index];
                            var CurPr;
                            if (type_Paragraph == Item.GetType()) {
                                CurPr = Item.Selection_CalculateTextPr();
                            } else {
                                if (type_Table == Item.GetType()) {
                                    CurPr = Item.Get_Paragraph_TextPr();
                                }
                            }
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
                    var Item = this.Content[this.CurPos.ContentPos];
                    if (type_Paragraph == Item.GetType()) {
                        Result_TextPr = Item.Internal_CalculateTextPr(Item.CurPos.ContentPos - 1);
                    } else {
                        if (type_Table == Item.GetType()) {
                            Result_TextPr = Item.Get_Paragraph_TextPr();
                        }
                    }
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
                        if (type_Paragraph == Item.GetType()) {
                            var StartPos_item = Item.Selection.StartPos;
                            if (Item.Selection.EndPos < StartPos_item) {
                                StartPos_item = Item.Selection.EndPos;
                            }
                            VisTextPr = Item.Internal_CalculateTextPr(StartPos_item - 1);
                        } else {
                            if (type_Table == Item.GetType()) {
                                VisTextPr = Item.Get_Paragraph_TextPr_Copy();
                            }
                        }
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
                    if (type_Paragraph == Item.GetType()) {
                        Result_TextPr = Item.Internal_CalculateTextPr(Item.CurPos.ContentPos - 1);
                    } else {
                        if (type_Table == Item.GetType()) {
                            Result_TextPr = Item.Get_Paragraph_TextPr_Copy();
                        }
                    }
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
        var ParaArray = new Array();
        this.HdrFtr.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            var Element = this.Content[Index];
            Element.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
        }
        return ParaArray;
    },
    Set_DocumentMargin: function (MarPr) {
        this.History.Add(this, {
            Type: historyitem_Document_Margin,
            Fields_old: {
                Left: X_Left_Field,
                Right: X_Right_Field,
                Top: Y_Top_Field,
                Bottom: Y_Bottom_Field
            },
            Fields_new: MarPr,
            Recalc_Margins: true
        });
        if ("undefined" !== typeof(MarPr.Left)) {
            X_Left_Field = MarPr.Left;
        }
        if ("undefined" !== typeof(MarPr.Right)) {
            X_Right_Field = MarPr.Right;
        }
        if ("undefined" !== typeof(MarPr.Top)) {
            Y_Top_Field = MarPr.Top;
        }
        if ("undefined" !== typeof(MarPr.Bottom)) {
            Y_Bottom_Field = MarPr.Bottom;
        }
        X_Left_Margin = X_Left_Field;
        X_Right_Margin = Page_Width - X_Right_Field;
        Y_Bottom_Margin = Page_Height - Y_Bottom_Field;
        Y_Top_Margin = Y_Top_Field;
        this.HdrFtr.UpdateMargins(0);
        this.ContentLastChangePos = 0;
        this.Recalculate();
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },
    Set_DocumentPageSize: function (W, H, bNoRecalc) {
        this.History.Add(this, {
            Type: historyitem_Document_PageSize,
            Width_new: W,
            Height_new: H,
            Width_old: Page_Width,
            Height_old: Page_Height
        });
        Page_Width = W;
        Page_Height = H;
        editor.sync_DocSizeCallback(W, H);
        X_Left_Field = X_Left_Margin;
        X_Right_Field = Page_Width - X_Right_Margin;
        Y_Bottom_Field = Page_Height - Y_Bottom_Margin;
        Y_Top_Field = Y_Top_Margin;
        this.HdrFtr.UpdateMargins(0, bNoRecalc);
        if (true != bNoRecalc) {
            this.ContentLastChangePos = 0;
            this.Recalculate();
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
        }
    },
    Set_DocumentOrientation: function (Orientation, bNoRecalc) {
        if (this.Orientation === Orientation) {
            return;
        }
        var old_Orientation = this.Orientation;
        this.Orientation = Orientation;
        var old_X_Left_Margin = X_Left_Margin;
        var old_X_Right_Margin = X_Right_Margin;
        var old_Y_Bottom_Margin = Y_Bottom_Margin;
        var old_Y_Top_Margin = Y_Top_Margin;
        if (orientation_Landscape === Orientation) {
            Y_Top_Margin = old_X_Right_Margin;
            X_Right_Margin = old_Y_Bottom_Margin;
            Y_Bottom_Margin = old_X_Left_Margin;
            X_Left_Margin = old_Y_Top_Margin;
        } else {
            Y_Top_Margin = old_X_Left_Margin;
            X_Right_Margin = old_Y_Top_Margin;
            Y_Bottom_Margin = old_X_Right_Margin;
            X_Left_Margin = old_Y_Bottom_Margin;
        }
        this.History.Add(this, {
            Type: historyitem_Document_Orientation,
            Orientation_new: this.Orientation,
            Orientation_old: old_Orientation,
            Margins_old: {
                Left: old_X_Left_Margin,
                Right: old_X_Right_Margin,
                Top: old_Y_Top_Margin,
                Bottom: old_Y_Bottom_Margin
            },
            Margins_new: {
                Left: X_Left_Margin,
                Right: X_Right_Margin,
                Top: Y_Top_Margin,
                Bottom: Y_Bottom_Margin
            }
        });
        this.Set_DocumentPageSize(Page_Height, Page_Width, bNoRecalc);
    },
    Set_DocumentDefaultTab: function (DTab) {
        this.History.Add(this, {
            Type: historyitem_Document_DefaultTab,
            Old: Default_Tab_Stop,
            New: DTab
        });
        Default_Tab_Stop = DTab;
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
            if (undefined != ParaPr.Tabs) {
                editor.Update_ParaTab(Default_Tab_Stop, ParaPr.Tabs);
            }
            editor.UpdateParagraphProp(ParaPr);
        }
    },
    Interface_Update_TextPr: function () {
        var TextPr = this.Get_Paragraph_TextPr();
        if (null != TextPr) {
            editor.UpdateTextPr(TextPr);
        }
    },
    Interface_Update_DrawingPr: function (Flag) {
        var DrawingPr = this.DrawingObjects.getProps();
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
        var StartPos = this.Pages[PageNum].Pos;
        var EndPos = this.Content.length - 1;
        if (PageNum < this.Pages.length - 1) {
            EndPos = Math.min(this.Pages[PageNum + 1].Pos, EndPos);
        }
        var InlineElements = new Array();
        for (var Index = StartPos; Index <= EndPos; Index++) {
            var Item = this.Content[Index];
            if (false != Item.Is_Inline()) {
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
        }
        if (docpostype_DrawingObjects === this.CurPos.Type) {
            var ParaDrawing = this.DrawingObjects.getMajorParaDrawing();
            ParaDrawing.GoTo_Text();
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
        var PageMetrics = this.Get_PageContentStartPos(this.CurPage);
        var bInText = (null === this.Is_InText(X, Y, this.CurPage) ? false : true);
        var bTableBorder = (null === this.Is_TableBorder(X, Y, this.CurPage) ? false : true);
        var nInDrawing = this.DrawingObjects.isPointInDrawingObjects(X, Y, this.CurPage, this);
        var bFlowTable = (null === this.DrawingObjects.getTableByXY(X, Y, this.CurPage, this) ? false : true);
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
        if (Direction > 0 && type_Paragraph === this.Content[Start].GetType() && true === this.Content[Start].Selection_IsEmpty() && this.Content[Start].Selection.StartPos == this.Content[Start].Content.length - 1) {
            this.Content[Start].Selection.StartPos = this.Content[Start].Internal_GetEndPos();
            this.Content[Start].Selection.EndPos = this.Content[Start].Content.length - 1;
        }
        this.Content[ContentPos].Selection_SetEnd(X, Y, this.CurPage, MouseEvent);
        for (var Index = Start; Index <= End; Index++) {
            var Item = this.Content[Index];
            Item.Selection.Use = true;
            var ItemType = Item.GetType();
            switch (Index) {
            case Start:
                if (type_Paragraph === ItemType) {
                    if (Direction > 0) {
                        Item.Selection.EndPos = Item.Content.length - 1;
                    } else {
                        Item.Selection.StartPos = Item.Content.length - 1;
                    }
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
                    if (Direction > 0) {
                        Item.Selection.StartPos = Item.Internal_GetStartPos();
                    } else {
                        Item.Selection.EndPos = Item.Internal_GetStartPos();
                    }
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
                    if (Direction > 0) {
                        Item.Selection.StartPos = Item.Internal_GetStartPos();
                        Item.Selection.EndPos = Item.Content.length - 1;
                    } else {
                        Item.Selection.EndPos = Item.Internal_GetStartPos();
                        Item.Selection.StartPos = Item.Content.length - 1;
                    }
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
        if (true === this.Content[End].Selection_IsEmpty()) {
            this.Content[End].Selection_Remove();
            End--;
        }
        if (Start != End && true === this.Content[Start].Selection_IsEmpty()) {
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
            return true;
        }
        return false;
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
    Selection_Check: function (X, Y, Page_Abs) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Selection_Check(X, Y, Page_Abs);
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return this.DrawingObjects.selectionCheck(X, Y, Page_Abs);
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
                        var ContentPos = this.Internal_GetContentPosByXY(X, Y, Page_Abs);
                        if (ContentPos > Start && ContentPos < End) {
                            return true;
                        } else {
                            if (ContentPos < Start || ContentPos > End) {
                                return false;
                            } else {
                                return this.Content[ContentPos].Selection_Check(X, Y, Page_Abs);
                            }
                        }
                        return false;
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
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
    },
    Document_SelectNumbering: function (NumPr) {
        this.Selection_Remove();
        this.Selection.Use = true;
        this.Selection.Flag = selectionflag_Numbering;
        this.Selection.Data = new Array();
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
                this.Create_NewHistoryPoint();
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
                                    this.Create_NewHistoryPoint();
                                    Paragraph.Add_Tab(e.ShiftKey);
                                    this.Recalculate();
                                    this.Document_UpdateInterfaceState();
                                    this.Document_UpdateSelectionState();
                                }
                            } else {
                                if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                                    this.Create_NewHistoryPoint();
                                    this.Paragraph_Add(new ParaTab());
                                }
                            }
                        }
                    }
                }
                bRetValue = true;
            } else {
                if (e.KeyCode == 13 && false === editor.isViewMode) {
                    var Hyperlink = this.Hyperlink_Check(false);
                    if (null != Hyperlink && false === e.ShiftKey) {
                        editor.sync_HyperlinkClickCallback(Hyperlink.Get_Value());
                        Hyperlink.Set_Visited(true);
                        this.DrawingDocument.ClearCachePages();
                        this.DrawingDocument.FirePaint();
                    } else {
                        var CheckType = (e.ShiftKey || e.CtrlKey ? changestype_Paragraph_Content : changestype_Document_Content_Add);
                        if (false === this.Document_Is_SelectionLocked(CheckType)) {
                            this.Create_NewHistoryPoint();
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
                    bRetValue = true;
                } else {
                    if (e.KeyCode == 27) {
                        if (docpostype_DrawingObjects === this.CurPos.Type || (docpostype_HdrFtr === this.CurPos.Type && null != this.HdrFtr.CurHdrFtr && docpostype_DrawingObjects === this.HdrFtr.CurHdrFtr.Content.CurPos.Type)) {
                            this.DrawingObjects.resetSelection2();
                            this.Document_UpdateInterfaceState();
                            this.Document_UpdateSelectionState();
                        } else {
                            if (docpostype_HdrFtr == this.CurPos.Type) {
                                this.Document_End_HdrFtrEditing();
                            }
                        }
                        bRetValue = true;
                    } else {
                        if (e.KeyCode == 32 && false === editor.isViewMode) {
                            if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                                this.Create_NewHistoryPoint();
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
                                        this.Paragraph_Add(new ParaSpace(1));
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
                                    bRetValue = true;
                                } else {
                                    var TempXY = this.Cursor_GetPos();
                                    var X = TempXY.X;
                                    var Y = TempXY.Y;
                                    var Dy = this.DrawingDocument.GetVisibleMMHeight();
                                    if (Y - Dy < 0) {
                                        this.CurPage--;
                                        Dy -= Y;
                                        Y = Page_Height;
                                        while (Dy > Page_Height) {
                                            Dy -= Page_Height;
                                            this.CurPage--;
                                        }
                                        if (this.CurPage < 0) {
                                            this.CurPage = 0;
                                            Dy = Page_Height - this.Content[0].Pages[this.Content[0].Pages.length - 1].Bounds.Top;
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
                                            CurY = Page_Height;
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
                                    bRetValue = true;
                                }
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
                                        bRetValue = true;
                                    } else {
                                        var TempXY = this.Cursor_GetPos();
                                        var X = TempXY.X;
                                        var Y = TempXY.Y;
                                        var Dy = this.DrawingDocument.GetVisibleMMHeight();
                                        if (Y + Dy > Page_Height) {
                                            this.CurPage++;
                                            Dy -= Page_Height - Y;
                                            Y = 0;
                                            while (Dy > Page_Height) {
                                                Dy -= Page_Height;
                                                this.CurPage++;
                                            }
                                            if (this.CurPage >= this.DrawingDocument.m_lPagesCount) {
                                                this.CurPage = this.DrawingDocument.m_lPagesCount - 1;
                                                Dy = this.Content[this.Content.length - 1].Pages[this.Content[this.Content.length - 1].Pages.length - 1].Bounds.Bottom;
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
                                            CurY += Dy;
                                            if (CurY > Page_Height) {
                                                this.CurPage++;
                                                CurY = 0;
                                                if (this.CurPage >= this.DrawingDocument.m_lPagesCount) {
                                                    var LastElement = this.Content[this.Content.length - 1];
                                                    this.CurPage = this.DrawingDocument.m_lPagesCount - 1;
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
                                        bRetValue = true;
                                    }
                                } else {
                                    if (e.KeyCode == 35) {
                                        if (true === e.CtrlKey) {
                                            this.Cursor_MoveToEndPos();
                                        } else {
                                            this.Cursor_MoveEndOfLine(true === e.ShiftKey);
                                        }
                                        bRetValue = true;
                                    } else {
                                        if (e.KeyCode == 36) {
                                            if (true === e.CtrlKey) {
                                                this.Cursor_MoveToStartPos();
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
                                                                                    this.Create_NewHistoryPoint();
                                                                                    window.GlobalPasteFlag = true;
                                                                                    Editor_Paste(this.DrawingDocument.m_oWordControl.m_oApi, true);
                                                                                } else {
                                                                                    if (0 === window.GlobalPasteFlagCounter) {
                                                                                        this.Create_NewHistoryPoint();
                                                                                        SafariIntervalFocus();
                                                                                        window.GlobalPasteFlag = true;
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
                                                                            this.Create_NewHistoryPoint();
                                                                            this.Remove(1, true);
                                                                        }
                                                                        bRetValue = true;
                                                                    } else {
                                                                        if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                                                                            this.Create_NewHistoryPoint();
                                                                            Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi, true);
                                                                        }
                                                                    }
                                                                } else {
                                                                    if (e.KeyCode == 49 && false === editor.isViewMode && true === e.CtrlKey && true === e.AltKey) {
                                                                        if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties)) {
                                                                            this.Create_NewHistoryPoint();
                                                                            this.Set_ParagraphStyle("Heading 1");
                                                                            this.Document_UpdateInterfaceState();
                                                                        }
                                                                        bRetValue = true;
                                                                    } else {
                                                                        if (e.KeyCode == 50 && false === editor.isViewMode && true === e.CtrlKey && true === e.AltKey) {
                                                                            if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties)) {
                                                                                this.Create_NewHistoryPoint();
                                                                                this.Set_ParagraphStyle("Heading 2");
                                                                                this.Document_UpdateInterfaceState();
                                                                            }
                                                                            bRetValue = true;
                                                                        } else {
                                                                            if (e.KeyCode == 51 && false === editor.isViewMode && true === e.CtrlKey && true === e.AltKey) {
                                                                                if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Properties)) {
                                                                                    this.Create_NewHistoryPoint();
                                                                                    this.Set_ParagraphStyle("Heading 3");
                                                                                    this.Document_UpdateInterfaceState();
                                                                                }
                                                                                bRetValue = true;
                                                                            } else {
                                                                                if (e.KeyCode == 65 && true === e.CtrlKey) {
                                                                                    this.Select_All();
                                                                                    bRetValue = true;
                                                                                } else {
                                                                                    if (e.KeyCode == 66 && false === editor.isViewMode && true === e.CtrlKey) {
                                                                                        var TextPr = this.Get_Paragraph_TextPr();
                                                                                        if (null != TextPr) {
                                                                                            if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                                                                                                this.Create_NewHistoryPoint();
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
                                                                                                            this.Create_NewHistoryPoint();
                                                                                                            this.Set_ParagraphAlign(ParaPr.Jc === align_Center ? align_Left : align_Center);
                                                                                                            this.Document_UpdateInterfaceState();
                                                                                                        }
                                                                                                        bRetValue = true;
                                                                                                    }
                                                                                                } else {
                                                                                                    if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                                                                                                        this.Create_NewHistoryPoint();
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
                                                                                                            this.Create_NewHistoryPoint();
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
                                                                                                                this.Create_NewHistoryPoint();
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
                                                                                                                        this.Create_NewHistoryPoint();
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
                                                                                                                            this.Create_NewHistoryPoint();
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
                                                                                                                } else {
                                                                                                                    if (e.KeyCode == 80 && true === e.CtrlKey) {
                                                                                                                        if (true === e.ShiftKey && false === editor.isViewMode) {
                                                                                                                            if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                                                                                                                                this.Create_NewHistoryPoint();
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
                                                                                                                                    this.Create_NewHistoryPoint();
                                                                                                                                    this.Set_ParagraphAlign(ParaPr.Jc === align_Right ? align_Left : align_Right);
                                                                                                                                    this.Document_UpdateInterfaceState();
                                                                                                                                }
                                                                                                                                bRetValue = true;
                                                                                                                            }
                                                                                                                        } else {
                                                                                                                            if (e.KeyCode == 83 && false === editor.isViewMode && true === e.CtrlKey) {
                                                                                                                                this.DrawingDocument.m_oWordControl.m_oApi.asc_Save();
                                                                                                                                bRetValue = true;
                                                                                                                            } else {
                                                                                                                                if (e.KeyCode == 85 && false === editor.isViewMode && true === e.CtrlKey) {
                                                                                                                                    var TextPr = this.Get_Paragraph_TextPr();
                                                                                                                                    if (null != TextPr) {
                                                                                                                                        if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                                                                                                                                            this.Create_NewHistoryPoint();
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
                                                                                                                                                this.Create_NewHistoryPoint();
                                                                                                                                                this.Document_Format_Paste();
                                                                                                                                                bRetValue = true;
                                                                                                                                            } else {
                                                                                                                                                if (!window.GlobalPasteFlag) {
                                                                                                                                                    if (!window.USER_AGENT_SAFARI_MACOS) {
                                                                                                                                                        this.Create_NewHistoryPoint();
                                                                                                                                                        window.GlobalPasteFlag = true;
                                                                                                                                                        Editor_Paste(this.DrawingDocument.m_oWordControl.m_oApi, true);
                                                                                                                                                    } else {
                                                                                                                                                        if (0 === window.GlobalPasteFlagCounter) {
                                                                                                                                                            this.Create_NewHistoryPoint();
                                                                                                                                                            SafariIntervalFocus();
                                                                                                                                                            window.GlobalPasteFlag = true;
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
                                                                                                                                                this.Create_NewHistoryPoint();
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
                                                                                                                                                                    if (e.KeyCode == 187 && false === editor.isViewMode && true === e.CtrlKey) {
                                                                                                                                                                        var TextPr = this.Get_Paragraph_TextPr();
                                                                                                                                                                        if (null != TextPr) {
                                                                                                                                                                            if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                                                                                                                                                                                this.Create_NewHistoryPoint();
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
                                                                                                                                                                        if (e.KeyCode == 188 && true === e.CtrlKey) {
                                                                                                                                                                            var TextPr = this.Get_Paragraph_TextPr();
                                                                                                                                                                            if (null != TextPr) {
                                                                                                                                                                                if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                                                                                                                                                                                    this.Create_NewHistoryPoint();
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
                                                                                                                                                                                    this.Create_NewHistoryPoint();
                                                                                                                                                                                    this.DrawingDocument.TargetStart();
                                                                                                                                                                                    this.DrawingDocument.TargetShow();
                                                                                                                                                                                    var Item = null;
                                                                                                                                                                                    if (true === e.CtrlKey && true === e.ShiftKey) {
                                                                                                                                                                                        Item = new ParaText(String.fromCharCode(8211));
                                                                                                                                                                                        Item.SpaceAfter = false;
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
                                                                                                                                                                                            this.Create_NewHistoryPoint();
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
        if (true == bRetValue && true === bUpdateSelection) {
            this.Document_UpdateSelectionState();
        }
        return bRetValue;
    },
    OnKeyPress: function (e) {
        if (true === editor.isViewMode) {
            return false;
        }
        if (e.CtrlKey || e.AltKey) {
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
                this.Create_NewHistoryPoint();
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
        if (this.SearchEngine.Count > 0) {
            this.SearchEngine.Reset_Current();
        }
        if (g_mouse_button_right === e.Button) {
            return;
        }
        if (true === this.History.Is_ExtendDocumentToPos()) {
            this.Document_Undo();
        }
        var Table = this.Is_TableBorder(X, Y, PageIndex);
        if (null != Table) {
            if (true === editor.isViewMode || true === this.Document_Is_SelectionLocked(changestype_None, {
                Type: changestype_2_Element_and_Type,
                Element: Table,
                CheckType: changestype_Table_Properties
            })) {
                return;
            }
            this.Create_NewHistoryPoint();
        }
        this.CurPage = PageIndex;
        if (true === editor.isStartAddShape && docpostype_HdrFtr != this.CurPos.Type) {
            this.CurPos.Type = docpostype_DrawingObjects;
            this.Selection.Use = true;
            this.Selection.Start = true;
            if (true != this.DrawingObjects.isPolylineAddition()) {
                this.DrawingObjects.startAddShape(editor.addShapePreset);
            }
            this.DrawingObjects.OnMouseDown(MouseEvent, X, Y, this.CurPage);
        } else {
            this.Selection_SetStart(X, Y, e);
            if (e.ClickCount <= 1) {
                this.RecalculateCurPos();
                this.Document_UpdateSelectionState();
            }
        }
    },
    OnMouseUp: function (e, X, Y, PageIndex) {
        if (PageIndex < 0) {
            return;
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
                Table.Document_SetThisElementCurrent();
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
                var PageMetrics = this.Get_PageContentStartPos(this.CurPage);
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
            if (false === this.Selection_Check(X, Y, PageIndex)) {
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
            return;
        } else {
            if (g_mouse_button_left === e.Button) {
                if (true === this.Comments.Is_Use()) {
                    var Type = (docpostype_HdrFtr === this.CurPos.Type ? comment_type_HdrFtr : comment_type_Common);
                    var Comment = this.Comments.Get_ByXY(PageIndex, X, Y, Type);
                    if (null != Comment) {
                        var Comment_PageNum = Comment.m_oStartInfo.PageNum;
                        var Comment_Y = Comment.m_oStartInfo.Y;
                        var Comment_X = Page_Width;
                        var Coords = this.DrawingDocument.ConvertCoordsToCursorWR(Comment_X, Comment_Y, Comment_PageNum);
                        this.Select_Comment(Comment.Get_Id());
                        editor.sync_ShowComment(Comment.Get_Id(), Coords.X, Coords.Y);
                    } else {
                        this.Select_Comment(null);
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
            if (true === editor.isPaintFormat) {
                if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
                    this.Create_NewHistoryPoint();
                    this.Document_Format_Paste();
                }
                editor.sync_PaintFormatCallback(false);
            }
            if (true === editor.isMarkerFormat && true === this.Is_TextSelectionUse()) {
                if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
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
                    this.Create_NewHistoryPoint();
                    this.Paragraph_Add(ParaItem);
                    this.Cursor_MoveLeft(false, false);
                    this.Document_UpdateSelectionState();
                    editor.sync_MarkerFormatCallback(true);
                }
            }
        }
    },
    OnMouseMove: function (e, X, Y, PageIndex) {
        if (PageIndex < 0) {
            return;
        }
        this.Update_CursorType(X, Y, PageIndex, e);
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
            if (type_Paragraph == Item.GetType() && undefined != (ItemNumPr = Item.Numbering_Get()) && ItemNumPr.NumId == NumPr.NumId) {
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
        if (true === bAnchor && (0 < ContentPos || PageNum > 0) && ContentPos === this.Pages[PageNum].Pos && this.Pages[PageNum].EndPos > this.Pages[PageNum].Pos && type_Paragraph === this.Content[ContentPos].GetType() && true === this.Content[ContentPos].Is_ContentOnFirstPage()) {
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
        if (type_Table == this.Content[this.Content.length - 1].GetType()) {
            this.Internal_Content_Add(this.Content.length, new Paragraph(this.DrawingDocument, this, 0, 50, 50, X_Right_Field, Y_Bottom_Field));
        }
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
            this.Internal_Content_Add(this.Content.length, new Paragraph(this.DrawingDocument, this, 0, 50, 50, X_Right_Field, Y_Bottom_Field));
        }
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
            this.HdrFtr.AddPageNum(PageIndex, AlignV, AlignH);
        } else {
            this.Paragraph_Add(new ParaPageNum());
        }
        this.Document_UpdateInterfaceState();
    },
    Document_AddHdrFtr: function (Type, Subtype) {
        this.HdrFtr.AddHeaderOrFooter(Type, Subtype);
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },
    Document_RemoveHdrFtr: function (Type, Subtype) {
        this.HdrFtr.RemoveHeaderOrFooter(Type, Subtype);
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },
    Document_SetHdrFtrDistance: function (Value) {
        this.HdrFtr.Set_Distance(Value, Page_Height);
        this.Document_UpdateRulersState();
        this.Document_UpdateInterfaceState();
    },
    Document_SetHdrFtrBounds: function (Y0, Y1) {
        this.HdrFtr.Set_Bounds(Y0, Y1);
        this.Document_UpdateRulersState();
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
                this.Cursor_MoveAt(0, Page_Height, false);
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
    Search_Start: function (Str) {
        if ("string" != typeof(Str) || Str.length <= 0) {
            return;
        }
        this.DrawingDocument.StartSearch();
        this.SearchInfo.String = Str;
        this.SearchInfo.CurPage = 0;
        this.SearchInfo.StartPos = 0;
        this.HdrFtr.DocumentSearch(this.SearchInfo.String);
        this.SearchInfo.Id = setTimeout(function () {
            editor.WordControl.m_oLogicDocument.Search_WaitRecalc();
        },
        1);
    },
    Search_WaitRecalc: function () {
        if (null === this.SearchInfo.Id) {
            return;
        }
        if (null != this.FullRecalc.Id) {
            this.SearchInfo.Id = setTimeout(function () {
                editor.WordControl.m_oLogicDocument.Search_WaitRecalc();
            },
            100);
        } else {
            this.SearchInfo.Id = setTimeout(function () {
                editor.WordControl.m_oLogicDocument.Search_OnPage();
            },
            1);
        }
    },
    Search_OnPage: function () {
        if (null === this.SearchInfo.Id) {
            return;
        }
        var Count = this.Content.length;
        var CurPage = this.SearchInfo.CurPage;
        var bFlowObjChecked = false;
        var Index = 0;
        for (Index = this.SearchInfo.StartPos; Index < Count; Index++) {
            var Element = this.Content[Index];
            Element.DocumentSearch(this.SearchInfo.String, search_Common);
            if (false === bFlowObjChecked) {
                this.DrawingObjects.documentSearch(CurPage, this.SearchInfo.String, search_Common);
                bFlowObjChecked = true;
            }
            var bNewPage = false;
            if (Element.Pages.length > 1) {
                for (var TempIndex = 1; TempIndex < Element.Pages.length - 1; TempIndex++) {
                    this.DrawingObjects.documentSearch(CurPage + TempIndex, this.SearchInfo.String, search_Common);
                }
                CurPage += Element.Pages.length - 1;
                bNewPage = true;
            }
            if (bNewPage) {
                clearTimeout(this.SearchInfo.Id);
                this.SearchInfo.StartPos = Index + 1;
                this.SearchInfo.CurPage = CurPage;
                this.SearchInfo.Id = setTimeout(function () {
                    editor.WordControl.m_oLogicDocument.Search_OnPage();
                },
                1);
                break;
            }
        }
        if (Index >= Count) {
            this.SearchInfo.Id = null;
            this.Search_Stop(false);
        }
    },
    Search_Stop: function (bChange) {
        if ("undefined" === typeof(bChange)) {
            bChange = false;
        }
        if (null != this.SearchInfo.Id) {
            clearTimeout(this.SearchInfo.Id);
            this.SearchInfo.Id = null;
        }
        this.DrawingDocument.EndSearch(bChange);
    },
    Table_AddRow: function (bBefore) {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.HdrFtr.Table_AddRow(bBefore);
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
            return this.HdrFtr.Table_RemoveTable();
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
        var FontMap = new Object();
        this.HdrFtr.Document_CreateFontMap(FontMap);
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
        return FontMap;
    },
    Document_CreateFontCharMap: function (FontCharMap) {
        this.HdrFtr.Document_CreateFontCharMap(FontCharMap);
        this.DrawingObjects.documentCreateFontCharMap(FontCharMap);
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            var Element = this.Content[Index];
            Element.Document_CreateFontCharMap(FontCharMap);
        }
    },
    Document_Get_AllFontNames: function () {
        var AllFonts = new Object();
        this.HdrFtr.Document_Get_AllFontNames(AllFonts);
        this.Numbering.Document_Get_AllFontNames(AllFonts);
        this.Styles.Document_Get_AllFontNames(AllFonts);
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            var Element = this.Content[Index];
            Element.Document_Get_AllFontNames(AllFonts);
        }
        return AllFonts;
    },
    Document_UpdateInterfaceState: function () {
        editor.sync_BeginCatchSelectedElements();
        editor.ClearPropObjCallback();
        if (docpostype_HdrFtr === this.CurPos.Type) {
            this.Interface_Update_HdrFtrPr();
            this.HdrFtr.Document_UpdateInterfaceState();
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                var drawin_objects = this.DrawingObjects;
                if (drawin_objects.curState.id === STATES_ID_TEXT_ADD || drawin_objects.curState.id === STATES_ID_TEXT_ADD_IN_GROUP || drawin_objects.curState.id === STATES_ID_CHART_TITLE_TEXT) {
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
    },
    Document_UpdateRulersState: function () {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Document_UpdateRulersState(this.CurPage);
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                this.DrawingDocument.Set_RulerState_Paragraph(null);
                return this.DrawingObjects.documentUpdateRulersState();
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
                            this.DrawingDocument.Set_RulerState_Paragraph(null);
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
    },
    Document_UpdateSelectionState: function () {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Document_UpdateSelectionState();
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return this.DrawingObjects.documentUpdateSelectionState();
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
                                this.DrawingDocument.TargetEnd();
                                this.DrawingDocument.SelectEnabled(true);
                                this.DrawingDocument.SelectShow();
                            } else {
                                this.DrawingDocument.SelectEnabled(false);
                                this.DrawingDocument.TargetStart();
                                this.DrawingDocument.TargetShow();
                            }
                        }
                    }
                } else {
                    this.DrawingDocument.SelectEnabled(false);
                    this.Selection_Remove();
                    this.Internal_CheckCurPage();
                    this.RecalculateCurPos();
                    this.DrawingDocument.TargetShow();
                }
            }
        }
    },
    Document_UpdateUndoRedoState: function () {
        editor.sync_CanUndoCallback(this.History.Can_Undo());
        editor.sync_CanRedoCallback(this.History.Can_Redo());
        if (true === History.Have_Changes()) {
            editor.isDocumentModify = true;
            editor.asc_fireCallback("asc_onDocumentModifiedChanged");
        } else {
            editor.SetUnchangedDocument();
        }
    },
    Document_UpdateCanAddHyperlinkState: function () {
        editor.sync_CanAddHyperlinkCallback(this.Hyperlink_CanAdd(false));
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
    Create_NewHistoryPoint: function () {
        this.History.Create_NewPoint();
    },
    Document_Undo: function () {
        if (true === CollaborativeEditing.Get_GlobalLock()) {
            return;
        }
        this.DrawingDocument.EndTrackTable(null, true);
        this.History.Undo();
        this.Recalculate(false, false, this.History.RecalculateData);
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },
    Document_Redo: function () {
        if (true === CollaborativeEditing.Get_GlobalLock()) {
            return;
        }
        this.DrawingDocument.EndTrackTable(null, true);
        this.History.Redo();
        this.Recalculate(false, false, this.History.RecalculateData);
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },
    Get_SelectionState: function () {
        var DocState = new Object();
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
                            State = new Array();
                        } else {
                            var StartPos = this.Selection.StartPos;
                            var EndPos = this.Selection.EndPos;
                            if (StartPos > EndPos) {
                                var Temp = StartPos;
                                StartPos = EndPos;
                                EndPos = Temp;
                            }
                            State = new Array();
                            var TempState = new Array();
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
        this.CurPos = {
            X: DocState.CurPos.X,
            Y: DocState.CurPos.Y,
            ContentPos: DocState.CurPos.ContentPos,
            RealX: DocState.CurPos.RealX,
            RealY: DocState.CurPos.RealY,
            Type: DocState.CurPos.Type
        };
        this.Selection = {
            Start: DocState.Selection.Start,
            Use: DocState.Selection.Use,
            StartPos: DocState.Selection.StartPos,
            EndPos: DocState.Selection.EndPos,
            Flag: DocState.Selection.Flag,
            Data: DocState.Selection.Data
        };
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
                    if (selectionflag_Numbering == this.Selection.Flag) {} else {
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
            break;
        case historyitem_Document_RemoveItem:
            var Pos = Data.Pos;
            var Array_start = this.Content.slice(0, Pos);
            var Array_end = this.Content.slice(Pos);
            this.Content = Array_start.concat(Data.Items, Array_end);
            break;
        case historyitem_Document_Margin:
            X_Left_Field = Data.Fields_old.Left;
            X_Right_Field = Data.Fields_old.Right;
            Y_Top_Field = Data.Fields_old.Top;
            Y_Bottom_Field = Data.Fields_old.Bottom;
            if (true === Data.Recalc_Margins) {
                X_Left_Margin = X_Left_Field;
                X_Right_Margin = Page_Width - X_Right_Field;
                Y_Bottom_Margin = Page_Height - Y_Bottom_Field;
                Y_Top_Margin = Y_Top_Field;
            }
            this.HdrFtr.UpdateMargins(0, true, true);
            break;
        case historyitem_Document_PageSize:
            Page_Width = Data.Width_old;
            Page_Height = Data.Height_old;
            editor.sync_DocSizeCallback(Page_Width, Page_Height);
            X_Left_Field = X_Left_Margin;
            X_Right_Field = Page_Width - X_Right_Margin;
            Y_Bottom_Field = Page_Height - Y_Bottom_Margin;
            Y_Top_Field = Y_Top_Margin;
            this.HdrFtr.UpdateMargins(0, true, true);
            break;
        case historyitem_Document_Orientation:
            this.Orientation = Data.Orientation_old;
            Y_Top_Margin = Data.Margins_old.Top;
            X_Right_Margin = Data.Margins_old.Right;
            Y_Bottom_Margin = Data.Margins_old.Bottom;
            X_Left_Margin = Data.Margins_old.Left;
            this.HdrFtr.UpdateMargins(0, true, true);
            editor.DocumentOrientation = this.Orientation === orientation_Portrait ? true : false;
            editor.sync_PageOrientCallback(editor.get_DocumentOrientation());
            break;
        case historyitem_Document_DefaultTab:
            Default_Tab_Stop = Data.Old;
            break;
        }
    },
    Redo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_Document_AddItem:
            var Pos = Data.Pos;
            this.Content.splice(Pos, 0, Data.Item);
            break;
        case historyitem_Document_RemoveItem:
            this.Content.splice(Data.Pos, Data.Items.length);
            break;
        case historyitem_Document_Margin:
            if ("undefined" !== typeof(Data.Fields_new.Left)) {
                X_Left_Field = Data.Fields_new.Left;
            }
            if ("undefined" !== typeof(Data.Fields_new.Right)) {
                X_Right_Field = Data.Fields_new.Right;
            }
            if ("undefined" !== typeof(Data.Fields_new.Top)) {
                Y_Top_Field = Data.Fields_new.Top;
            }
            if ("undefined" !== typeof(Data.Fields_new.Bottom)) {
                Y_Bottom_Field = Data.Fields_new.Bottom;
            }
            if (true === Data.Recalc_Margins) {
                X_Left_Margin = X_Left_Field;
                X_Right_Margin = Page_Width - X_Right_Field;
                Y_Bottom_Margin = Page_Height - Y_Bottom_Field;
                Y_Top_Margin = Y_Top_Field;
            }
            this.HdrFtr.UpdateMargins(0, true, true);
            break;
        case historyitem_Document_PageSize:
            Page_Width = Data.Width_new;
            Page_Height = Data.Height_new;
            editor.sync_DocSizeCallback(Page_Width, Page_Height);
            X_Left_Field = X_Left_Margin;
            X_Right_Field = Page_Width - X_Right_Margin;
            Y_Bottom_Field = Page_Height - Y_Bottom_Margin;
            Y_Top_Field = Y_Top_Margin;
            this.HdrFtr.UpdateMargins(0, true, true);
            break;
        case historyitem_Document_Orientation:
            this.Orientation = Data.Orientation_new;
            Y_Top_Margin = Data.Margins_new.Top;
            X_Right_Margin = Data.Margins_new.Right;
            Y_Bottom_Margin = Data.Margins_new.Bottom;
            X_Left_Margin = Data.Margins_new.Left;
            this.HdrFtr.UpdateMargins(0, true, true);
            editor.DocumentOrientation = this.Orientation === orientation_Portrait ? true : false;
            editor.sync_PageOrientCallback(editor.get_DocumentOrientation());
            break;
        case historyitem_Document_DefaultTab:
            Default_Tab_Stop = Data.New;
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
        case historyitem_Document_Margin:
            case historyitem_Document_PageSize:
            case historyitem_Document_Orientation:
            case historyitem_Document_DefaultTab:
            bNeedRecalcHdrFtr = true;
            break;
        }
        if (true === bNeedRecalcHdrFtr) {
            this.History.RecalcData_Add({
                Type: historyrecalctype_Inline,
                Data: 0
            });
            this.History.RecalcData_Add({
                Type: historyrecalctype_HdrFtr,
                Data: this.HdrFtr.Content[0].Header.First
            });
            this.History.RecalcData_Add({
                Type: historyrecalctype_HdrFtr,
                Data: this.HdrFtr.Content[0].Header.Odd
            });
            this.History.RecalcData_Add({
                Type: historyrecalctype_HdrFtr,
                Data: this.HdrFtr.Content[0].Header.Even
            });
            this.History.RecalcData_Add({
                Type: historyrecalctype_HdrFtr,
                Data: this.HdrFtr.Content[0].Footer.First
            });
            this.History.RecalcData_Add({
                Type: historyrecalctype_HdrFtr,
                Data: this.HdrFtr.Content[0].Footer.Odd
            });
            this.History.RecalcData_Add({
                Type: historyrecalctype_HdrFtr,
                Data: this.HdrFtr.Content[0].Footer.Even
            });
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
            this.Remove();
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
        if (true === CollaborativeEditing.Get_GlobalLock()) {
            return true;
        }
        CollaborativeEditing.OnStart_CheckLock();
        if (changestype_None != CheckType) {
            if (changestype_Document_SectPr === CheckType) {
                this.Lock.Check(this.Get_Id());
            } else {
                if (changestype_ColorScheme === CheckType) {
                    this.DrawingObjects.Lock.Check(this.DrawingObjects.Get_Id());
                } else {
                    if (docpostype_HdrFtr === this.CurPos.Type) {
                        this.HdrFtr.Document_Is_SelectionLocked(CheckType);
                    } else {
                        if (docpostype_DrawingObjects == this.CurPos.Type) {
                            this.DrawingObjects.documentIsSelectionLocked(CheckType);
                        } else {
                            if (docpostype_Content == this.CurPos.Type) {
                                switch (this.Selection.Flag) {
                                case selectionflag_Common:
                                    if (true === this.Selection.Use) {
                                        var StartPos = (this.Selection.StartPos > this.Selection.EndPos ? this.Selection.EndPos : this.Selection.StartPos);
                                        var EndPos = (this.Selection.StartPos > this.Selection.EndPos ? this.Selection.StartPos : this.Selection.EndPos);
                                        if (StartPos != EndPos && changestype_Delete === CheckType) {
                                            CheckType = changestype_Remove;
                                        }
                                        for (var Index = StartPos; Index <= EndPos; Index++) {
                                            this.Content[Index].Document_Is_SelectionLocked(CheckType);
                                        }
                                    } else {
                                        var CurElement = this.Content[this.CurPos.ContentPos];
                                        if (changestype_Document_Content_Add === CheckType && type_Paragraph === CurElement.GetType() && true === CurElement.Cursor_IsEnd()) {
                                            CollaborativeEditing.Add_CheckLock(false);
                                        } else {
                                            this.Content[this.CurPos.ContentPos].Document_Is_SelectionLocked(CheckType);
                                        }
                                    }
                                    break;
                                case selectionflag_Numbering:
                                    var NumPr = this.Content[this.Selection.Data[0]].Numbering_Get();
                                    if (null != NumPr) {
                                        var AbstrNum = this.Numbering.Get_AbstractNum(NumPr.NumId);
                                        AbstrNum.Document_Is_SelectionLocked(CheckType);
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        if ("undefined" != typeof(AdditionalData) && null != AdditionalData) {
            if (changestype_2_InlineObjectMove === AdditionalData.Type) {
                var PageNum = AdditionalData.PageNum;
                var X = AdditionalData.X;
                var Y = AdditionalData.Y;
                var NearestPara = this.Get_NearestPos(PageNum, X, Y).Paragraph;
                NearestPara.Document_Is_SelectionLocked(changestype_Document_Content);
            } else {
                if (changestype_2_HdrFtr === AdditionalData.Type) {
                    this.HdrFtr.Document_Is_SelectionLocked(changestype_HdrFtr);
                } else {
                    if (changestype_2_Comment === AdditionalData.Type) {
                        this.Comments.Document_Is_SelectionLocked(AdditionalData.Id);
                    } else {
                        if (changestype_2_Element_and_Type === AdditionalData.Type) {
                            AdditionalData.Element.Document_Is_SelectionLocked(AdditionalData.CheckType, false);
                        } else {
                            if (changestype_2_ElementsArray_and_Type === AdditionalData.Type) {
                                var Count = AdditionalData.Elements.length;
                                for (var Index = 0; Index < Count; Index++) {
                                    AdditionalData.Elements[Index].Document_Is_SelectionLocked(AdditionalData.CheckType, false);
                                }
                            }
                        }
                    }
                }
            }
        }
        var bResult = CollaborativeEditing.OnEnd_CheckLock();
        if (true === bResult) {
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
        }
        return bResult;
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
        case historyitem_Document_Margin:
            var StartPos = Writer.GetCurPosition();
            Writer.Skip(4);
            var Flags = 0;
            var bLeft = (("undefined" != typeof(Data.Fields_new.Left)) ? true : false);
            if (bLeft) {
                Writer.WriteDouble(Data.Fields_new.Left);
                Flags |= 1;
            }
            var bRight = (("undefined" != typeof(Data.Fields_new.Right)) ? true : false);
            if (bRight) {
                Writer.WriteDouble(Data.Fields_new.Right);
                Flags |= 2;
            }
            var bTop = (("undefined" != typeof(Data.Fields_new.Top)) ? true : false);
            if (bTop) {
                Writer.WriteDouble(Data.Fields_new.Top);
                Flags |= 4;
            }
            var bBottom = (("undefined" != typeof(Data.Fields_new.Bottom)) ? true : false);
            if (bBottom) {
                Writer.WriteDouble(Data.Fields_new.Bottom);
                Flags |= 8;
            }
            Writer.WriteBool(Data.Recalc_Margins);
            var EndPos = Writer.GetCurPosition();
            Writer.Seek(StartPos);
            Writer.WriteLong(Flags);
            Writer.Seek(EndPos);
            break;
        case historyitem_Document_PageSize:
            Writer.WriteDouble(Data.Width_new);
            Writer.WriteDouble(Data.Height_new);
            break;
        case historyitem_Document_Orientation:
            Writer.WriteByte(Data.Orientation_new);
            Writer.WriteDouble(Data.Margins_new.Top);
            Writer.WriteDouble(Data.Margins_new.Right);
            Writer.WriteDouble(Data.Margins_new.Bottom);
            Writer.WriteDouble(Data.Margins_new.Left);
            break;
        case historyitem_Document_DefaultTab:
            Writer.WriteDouble(Data.New);
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
        case historyitem_Document_Margin:
            break;
        case historyitem_Document_PageSize:
            break;
        case historyitem_Document_Orientation:
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
                    this.Content.splice(Pos, 0, Element);
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
            }
            break;
        case historyitem_Document_Margin:
            var Flags = Reader.GetLong();
            if (1 & Flags) {
                X_Left_Field = Reader.GetDouble();
            }
            if (2 & Flags) {
                X_Right_Field = Reader.GetDouble();
            }
            if (4 & Flags) {
                Y_Top_Field = Reader.GetDouble();
            }
            if (8 & Flags) {
                Y_Bottom_Field = Reader.GetDouble();
            }
            var bRecalcMargins = Reader.GetBool();
            if (true === bRecalcMargins) {
                X_Left_Margin = X_Left_Field;
                X_Right_Margin = Page_Width - X_Right_Field;
                Y_Bottom_Margin = Page_Height - Y_Bottom_Field;
                Y_Top_Margin = Y_Top_Field;
            }
            this.HdrFtr.UpdateMargins(0, true, true);
            break;
        case historyitem_Document_PageSize:
            Page_Width = Reader.GetDouble();
            Page_Height = Reader.GetDouble();
            editor.sync_DocSizeCallback(Page_Width, Page_Height);
            X_Left_Field = X_Left_Margin;
            X_Right_Field = Page_Width - X_Right_Margin;
            Y_Bottom_Field = Page_Height - Y_Bottom_Margin;
            Y_Top_Field = Y_Top_Margin;
            this.HdrFtr.UpdateMargins(0, true, true);
            break;
        case historyitem_Document_Orientation:
            this.Orientation = Reader.GetByte();
            Y_Top_Margin = Reader.GetDouble();
            X_Right_Margin = Reader.GetDouble();
            Y_Bottom_Margin = Reader.GetDouble();
            X_Left_Margin = Reader.GetDouble();
            this.HdrFtr.UpdateMargins(0, true, true);
            editor.DocumentOrientation = this.Orientation === orientation_Portrait ? true : false;
            editor.sync_PageOrientCallback(editor.get_DocumentOrientation());
            break;
        case historyitem_Document_DefaultTab:
            Default_Tab_Stop = Reader.GetDouble();
            break;
        }
        return true;
    },
    Get_SelectionState2: function () {
        this.Selection_Remove();
        var State = new Object();
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
                State.Type = docpostype_Content;
                if (true === this.Selection.Use) {
                    if (selectionflag_Numbering === this.Selection.Flag) {
                        var FirstPara = this.Content[this.Selection.Data[0]];
                        State.Id = FirstPara.Get_Id();
                    } else {
                        var LastPara = this.Content[this.Selection.EndPos];
                        State.Id = LastPara.Get_Id();
                    }
                } else {
                    State.Id = this.Content[this.CurPos.ContentPos].Get_Id();
                }
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
            var CurId = Id;
            var bFlag = false;
            var Pos = 0;
            while (!bFlag) {
                var Count = this.Content.length;
                Pos = 0;
                for (Pos = 0; Pos < Count; Pos++) {
                    if (this.Content[Pos].Get_Id() == CurId) {
                        bFlag = true;
                        break;
                    }
                }
                if (!bFlag) {
                    var TempElement = g_oTableId.Get_ById(CurId);
                    if (null === TempElement || null === TempElement.Prev || "undefined" === typeof(TempElement.Prev)) {
                        Pos = 0;
                        bFlag = true;
                        break;
                    } else {
                        CurId = TempElement.Prev.Get_Id();
                    }
                }
            }
            this.Selection.Start = false;
            this.Selection.Use = false;
            this.Selection.StartPos = Pos;
            this.Selection.EndPos = Pos;
            this.Selection.Flag = selectionflag_Common;
            this.CurPos.Type = docpostype_Content;
            this.CurPos.ContentPos = Pos;
            this.Content[this.CurPos.ContentPos].Cursor_MoveToStartPos();
        }
    },
    Add_Comment: function (CommentData) {
        if (true != this.CanAdd_Comment()) {
            CommentData.Set_QuoteText(null);
            var Comment = new CComment(this.Comments, CommentData);
            this.Comments.Add(Comment);
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
                        this.Content[StartPos].Add_Comment(Comment, true, false);
                        this.Content[EndPos].Add_Comment(Comment, false, true);
                    } else {
                        this.Content[this.CurPos.ContentPos].Add_Comment(Comment, true, true);
                    }
                }
            }
            this.DrawingDocument.ClearCachePages();
            this.DrawingDocument.FirePaint();
        }
        return Comment;
    },
    Change_Comment: function (Id, CommentData) {
        this.Comments.Set_CommentData(Id, CommentData);
    },
    Remove_Comment: function (Id, bSendEvent) {
        if (null === Id) {
            return;
        }
        if (true === this.Comments.Remove_ById(Id)) {
            this.DrawingDocument.ClearCachePages();
            this.DrawingDocument.FirePaint();
            if (true === bSendEvent) {
                editor.sync_RemoveComment(Id);
            }
        }
    },
    CanAdd_Comment: function () {
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
    Select_Comment: function (Id) {
        var OldId = this.Comments.Get_CurrentId();
        this.Comments.Set_Current(Id);
        var Comment = this.Comments.Get_ById(Id);
        if (null != Comment) {
            var Comment_PageNum = Comment.m_oStartInfo.PageNum;
            var Comment_Y = Comment.m_oStartInfo.Y;
            var Comment_X = Comment.m_oStartInfo.X;
            this.DrawingDocument.m_oWordControl.ScrollToPosition(Comment_X, Comment_Y, Comment_PageNum);
        }
        if (OldId != Id) {
            this.DrawingDocument.ClearCachePages();
            this.DrawingDocument.FirePaint();
        }
    },
    Show_Comment: function (Id) {
        var Comment = this.Comments.Get_ById(Id);
        if (null != Comment && null != Comment.m_oStartInfo.ParaId && null != Comment.m_oEndInfo.ParaId) {
            var Comment_PageNum = Comment.m_oStartInfo.PageNum;
            var Comment_Y = Comment.m_oStartInfo.Y;
            var Comment_X = Page_Width;
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
    TextBox_Put: function (sText) {
        if (false === this.Document_Is_SelectionLocked(changestype_Paragraph_Content)) {
            this.Create_NewHistoryPoint();
            this.TurnOffRecalc = true;
            var Count = sText.length;
            for (var Index = 0; Index < Count; Index++) {
                if (Index === Count - 1) {
                    this.TurnOffRecalc = false;
                }
                var _char = sText.charAt(Index);
                if (" " == _char) {
                    this.Paragraph_Add(new ParaSpace(1));
                } else {
                    this.Paragraph_Add(new ParaText(_char));
                }
            }
            this.TurnOffRecalc = false;
        }
    },
    Viewer_OnChangePosition: function () {
        var Comment = this.Comments.Get_Current();
        if (null != Comment) {
            var Comment_PageNum = Comment.m_oStartInfo.PageNum;
            var Comment_Y = Comment.m_oStartInfo.Y;
            var Comment_X = Page_Width;
            var Coords = this.DrawingDocument.ConvertCoordsToCursorWR(Comment_X, Comment_Y, Comment_PageNum);
            editor.sync_UpdateCommentPosition(Comment.Get_Id(), Coords.X, Coords.Y);
        }
    }
};