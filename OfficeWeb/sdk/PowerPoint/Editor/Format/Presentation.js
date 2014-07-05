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
 var tableSpacingMinValue = 0.02;
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
var History = null;
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
    this.FlowObjects = new FlowObjects(editor.WordControl.m_oLogicDocument, 0);
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
var MASTER_STYLES = false;
function CPresentation(DrawingDocument) {
    this.History = new CHistory(this);
    History = this.History;
    this.IdCounter = g_oIdCounter;
    this.TableId = new CTableId();
    g_oTableId = this.TableId;
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
    this.slidesToUnlock = [];
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
    this.RecalcInfo = {
        FlowObject: null,
        FlowObjectPageBreakBefore: false,
        FlowObjectPage: 0,
        WidowControlParagraph: null,
        WidowControlLine: -1
    };
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
    this.viewMode = false;
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
    this.Lock = new CLock();
    this.m_oContentChanges = new CContentChanges();
    this.Slides = [];
    this.themes = [];
    this.slideMasters = [];
    this.slideLayouts = [];
    this.notesMasters = [];
    this.notes = [];
    this.globalTableStyles = [];
    this.updateSlideIndex = false;
    this.recalcMap = {};
    this.forwardChangeThemeTimeOutId = null;
    this.backChangeThemeTimeOutId = null;
    this.startChangeThemeTimeOutId = null;
    this.DefaultSlideTiming = new CAscSlideTiming();
    this.DefaultSlideTiming.setDefaultParams();
    g_oTableId.Add(this, this.Id);
    this.themeLock = new PropLocker(this.Id);
    this.slideSizeLock = new PropLocker(this.Id);
    this.CommentAuthors = {};
    this.createDefaultTableStyles();
    this.bGoToPage = false;
}
var selected_None = -1;
var selected_DrawingObject = 0;
var selected_DrawingObjectText = 1;
function CSelectedElementsInfo() {
    this.m_bTable = false;
    this.m_bMixedSelection = false;
    this.m_nDrawing = selected_None;
    this.Reset = function () {
        this.m_bSelection = false;
        this.m_bTable = false;
        this.m_bMixedSelection = false;
        this.m_nDrawing = -1;
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
CPresentation.prototype = {
    createDefaultTableStyles: function () {
        var count = 0;
        var Style_Table_Lined = new CStyle("Lined", null, null, styletype_Table);
        Style_Table_Lined.Create_Table_Lined(new CDocumentColor(166, 166, 166), new CDocumentColor(217, 217, 217));
        this.globalTableStyles[count] = Style_Table_Lined;
        count++;
        var Style_Table_Lined_Accent1 = new CStyle("Lined - Accent 1", null, null, styletype_Table);
        Style_Table_Lined_Accent1.Create_Table_Lined(new CDocumentColor(149, 179, 215), new CDocumentColor(219, 229, 241));
        this.globalTableStyles[count] = Style_Table_Lined_Accent1;
        count++;
        var Style_Table_Lined_Accent2 = new CStyle("Lined - Accent 2", null, null, styletype_Table);
        Style_Table_Lined_Accent2.Create_Table_Lined(new CDocumentColor(217, 149, 148), new CDocumentColor(242, 219, 219));
        this.globalTableStyles[count] = Style_Table_Lined_Accent2;
        count++;
        var Style_Table_Lined_Accent3 = new CStyle("Lined - Accent 3", null, null, styletype_Table);
        Style_Table_Lined_Accent3.Create_Table_Lined(new CDocumentColor(194, 214, 155), new CDocumentColor(234, 241, 221));
        this.globalTableStyles[count] = Style_Table_Lined_Accent3;
        count++;
        var Style_Table_Lined_Accent4 = new CStyle("Lined - Accent 4", null, null, styletype_Table);
        Style_Table_Lined_Accent4.Create_Table_Lined(new CDocumentColor(178, 161, 199), new CDocumentColor(229, 223, 236));
        this.globalTableStyles[count] = Style_Table_Lined_Accent4;
        count++;
        var Style_Table_Lined_Accent5 = new CStyle("Lined - Accent 5", null, null, styletype_Table);
        Style_Table_Lined_Accent5.Create_Table_Lined(new CDocumentColor(146, 205, 220), new CDocumentColor(218, 238, 243));
        this.globalTableStyles[count] = Style_Table_Lined_Accent5;
        count++;
        var Style_Table_Lined_Accent6 = new CStyle("Lined - Accent 6", null, null, styletype_Table);
        Style_Table_Lined_Accent6.Create_Table_Lined(new CDocumentColor(250, 191, 143), new CDocumentColor(253, 233, 233));
        this.globalTableStyles[count] = Style_Table_Lined_Accent6;
        count++;
        var Style_Table_Bordered = new CStyle("Bordered", null, null, styletype_Table);
        Style_Table_Bordered.Create_Table_Bordered(new CDocumentColor(191, 191, 191), new CDocumentColor(0, 0, 0));
        this.globalTableStyles[count] = Style_Table_Bordered;
        count++;
        var Style_Table_Bordered_Accent_1 = new CStyle("Bordered - Accent 1", null, null, styletype_Table);
        Style_Table_Bordered_Accent_1.Create_Table_Bordered(new CDocumentColor(184, 204, 228), new CDocumentColor(54, 95, 145));
        this.globalTableStyles[count] = Style_Table_Bordered_Accent_1;
        count++;
        var Style_Table_Bordered_Accent_2 = new CStyle("Bordered - Accent 2", null, null, styletype_Table);
        Style_Table_Bordered_Accent_2.Create_Table_Bordered(new CDocumentColor(229, 184, 183), new CDocumentColor(148, 54, 52));
        this.globalTableStyles[count] = Style_Table_Bordered_Accent_2;
        count++;
        var Style_Table_Bordered_Accent_3 = new CStyle("Bordered - Accent 3", null, null, styletype_Table);
        Style_Table_Bordered_Accent_3.Create_Table_Bordered(new CDocumentColor(214, 227, 188), new CDocumentColor(118, 146, 60));
        this.globalTableStyles[count] = Style_Table_Bordered_Accent_3;
        count++;
        var Style_Table_Bordered_Accent_4 = new CStyle("Bordered - Accent 4", null, null, styletype_Table);
        Style_Table_Bordered_Accent_4.Create_Table_Bordered(new CDocumentColor(204, 192, 217), new CDocumentColor(95, 73, 122));
        this.globalTableStyles[count] = Style_Table_Bordered_Accent_4;
        count++;
        var Style_Table_Bordered_Accent_5 = new CStyle("Bordered - Accent 5", null, null, styletype_Table);
        Style_Table_Bordered_Accent_5.Create_Table_Bordered(new CDocumentColor(182, 221, 232), new CDocumentColor(49, 132, 155));
        this.globalTableStyles[count] = Style_Table_Bordered_Accent_5;
        count++;
        var Style_Table_Bordered_Accent_6 = new CStyle("Bordered - Accent 6", null, null, styletype_Table);
        Style_Table_Bordered_Accent_6.Create_Table_Bordered(new CDocumentColor(251, 212, 180), new CDocumentColor(227, 108, 10));
        this.globalTableStyles[count] = Style_Table_Bordered_Accent_6;
        count++;
        var Style_Table_BorderedLined = new CStyle("Bordered & Lined", null, null, styletype_Table);
        Style_Table_BorderedLined.Create_Table_BorderedAndLined(new CDocumentColor(0, 0, 0), new CDocumentColor(166, 166, 166), new CDocumentColor(217, 217, 217));
        this.globalTableStyles[count] = Style_Table_BorderedLined;
        count++;
        var Style_Table_BorderedLined_Accent1 = new CStyle("Bordered & Lined - Accent 1", null, null, styletype_Table);
        Style_Table_BorderedLined_Accent1.Create_Table_BorderedAndLined(new CDocumentColor(23, 54, 93), new CDocumentColor(141, 179, 226), new CDocumentColor(219, 229, 241));
        this.globalTableStyles[count] = Style_Table_BorderedLined_Accent1;
        count++;
        var Style_Table_BorderedLined_Accent2 = new CStyle("Bordered & Lined - Accent 2", null, null, styletype_Table);
        Style_Table_BorderedLined_Accent2.Create_Table_BorderedAndLined(new CDocumentColor(148, 54, 52), new CDocumentColor(217, 149, 148), new CDocumentColor(242, 219, 219));
        this.globalTableStyles[count] = Style_Table_BorderedLined_Accent2;
        count++;
        var Style_Table_BorderedLined_Accent3 = new CStyle("Bordered & Lined - Accent 3", null, null, styletype_Table);
        Style_Table_BorderedLined_Accent3.Create_Table_BorderedAndLined(new CDocumentColor(118, 146, 60), new CDocumentColor(194, 214, 155), new CDocumentColor(234, 241, 221));
        this.globalTableStyles[count] = Style_Table_BorderedLined_Accent3;
        count++;
        var Style_Table_BorderedLined_Accent4 = new CStyle("Bordered & Lined - Accent 4", null, null, styletype_Table);
        Style_Table_BorderedLined_Accent4.Create_Table_BorderedAndLined(new CDocumentColor(95, 73, 122), new CDocumentColor(178, 161, 199), new CDocumentColor(229, 223, 236));
        this.globalTableStyles[count] = Style_Table_BorderedLined_Accent4;
        count++;
        var Style_Table_BorderedLined_Accent5 = new CStyle("Bordered & Lined - Accent 5", null, null, styletype_Table);
        Style_Table_BorderedLined_Accent5.Create_Table_BorderedAndLined(new CDocumentColor(49, 132, 155), new CDocumentColor(146, 205, 220), new CDocumentColor(218, 238, 243));
        this.globalTableStyles[count] = Style_Table_BorderedLined_Accent5;
        count++;
        var Style_Table_BorderedLined_Accent6 = new CStyle("Bordered & Lined - Accent 6", null, null, styletype_Table);
        Style_Table_BorderedLined_Accent6.Create_Table_BorderedAndLined(new CDocumentColor(227, 108, 10), new CDocumentColor(250, 191, 143), new CDocumentColor(253, 233, 217));
        this.globalTableStyles[count] = Style_Table_BorderedLined_Accent6;
    },
    Init: function () {},
    addSlideMaster: function (pos, master) {
        History.Add(this, {
            Type: historyitem_Presenattion_AddSlideMaster,
            pos: pos,
            master: master
        });
        this.slideMasters.splice(pos, 0, master);
    },
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
        var YLimit = Y_Bottom_Field;
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
    Recalculate: function () {
        for (var i in this.recalcMap) {
            if (isRealObject(this.recalcMap[i]) && typeof this.recalcMap[i].recalculate === "function") {
                this.recalcMap[i].recalculate();
            }
        }
        this.recalcMap = {};
        this.updateSlideIndexes();
        this.RecalculateCurPos();
        for (var i = 0; i < this.Slides.length; ++i) {
            this.DrawingDocument.OnRecalculatePage(i, this.Slides[i]);
        }
        this.DrawingDocument.OnEndRecalculate();
        if (!this.Slides[this.CurPage]) {
            this.DrawingDocument.m_oWordControl.GoToPage(this.Slides.length - 1);
        } else {
            if (this.bGoToPage) {
                this.DrawingDocument.m_oWordControl.GoToPage(this.CurPage);
                this.bGoToPage = false;
            }
        }
        if (this.Slides[this.CurPage]) {
            this.Slides[this.CurPage].graphicObjects.updateSelectionState();
        }
        for (var i = 0; i < this.slidesToUnlock.length; ++i) {
            this.DrawingDocument.UnLockSlide(this.slidesToUnlock[i]);
        }
        this.slidesToUnlock.length = 0;
    },
    updateSlideIndexes: function () {
        for (var i = 0; i < this.Slides.length; ++i) {
            this.Slides[i].changeNum(i);
        }
    },
    RecalculateAfterOpen: function () {
        var layouts = [],
        masters = [];
        for (var i = 0; i < this.Slides.length; ++i) {
            var slide = this.Slides[i];
            slide.Width = this.Width;
            slide.Height = this.Height;
            slide.Load_Comments();
            slide.recalculate();
            var layout = slide.Layout;
            var master = layout.Master;
            for (var j = 0; j < masters.length; ++j) {
                if (masters[j] === master) {
                    break;
                }
            }
            if (j === masters.length) {
                master.recalculate();
                masters.push(master);
            }
            for (j = 0; j < layouts.length; ++j) {
                if (layouts[j] === layout) {
                    break;
                }
            }
            if (j === layouts.length) {
                layout.recalculate();
                layouts.push(layout);
            }
        }
    },
    GenerateThumbnails: function (_drawerThemes, _drawerLayouts) {
        var _masters = this.slideMasters;
        var _len = _masters.length;
        for (var i = 0; i < _len; i++) {
            _masters[i].ImageBase64 = _drawerThemes.GetThumbnail(_masters[i]);
        }
        var _layouts = this.slideLayouts;
        _len = _layouts.length;
        for (var i = 0; i < _len; i++) {
            _layouts[i].ImageBase64 = _drawerLayouts.GetThumbnail(_layouts[i]);
            _layouts[i].Width64 = _drawerLayouts.WidthPx;
            _layouts[i].Height64 = _drawerLayouts.HeightPx;
        }
    },
    RecalculateAfterUndoRedo: function () {},
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
            var bFlowTable = false;
            if (type_Table === Element.GetType() && true != Element.Is_Inline()) {
                bFlowTable = true;
                if (null === this.RecalcInfo.FlowObject) {
                    if ((0 === Index && 0 === PageIndex) || Index != StartIndex) {
                        Element.Set_DocumentIndex(Index);
                        Element.Reset(X, Y, XLimit, YLimit, PageIndex);
                    }
                    this.RecalcInfo.FlowObjectPage = 0;
                    this.RecalcInfo.FlowObject = Element;
                    this.RecalcInfo.RecalcResult = Element.Recalculate_Page(PageIndex);
                    this.DrawingObjects.addFloatTable(new CFlowTable2(Element, PageIndex));
                    RecalcResult = recalcresult_CurPage;
                } else {
                    if (Element === this.RecalcInfo.FlowObject) {
                        if (Element.PageNum > PageIndex || (this.RecalcInfo.FlowObjectPage <= 0 && Element.PageNum < PageIndex)) {
                            this.DrawingObjects.removeFloatTableById(PageIndex - 1, Element.Get_Id());
                            this.RecalcInfo.FlowObjectPageBreakBefore = true;
                            RecalcResult = recalcresult_PrevPage;
                        } else {
                            if (Element.PageNum === PageIndex) {
                                if (true === this.RecalcInfo.FlowObjectPageBreakBefore) {
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
                                        this.RecalcInfo.FlowObjectPageBreakBefore = true;
                                        RecalcResult = recalcresult_CurPage;
                                    } else {
                                        this.RecalcInfo.FlowObjectPage++;
                                        if (recalcresult_NextElement === RecalcResult) {
                                            this.RecalcInfo.FlowObject = null;
                                            this.RecalcInfo.FlowObjectPageBreakBefore = false;
                                            this.RecalcInfo.FlowObjectPage = 0;
                                            this.RecalcInfo.RecalcResult = recalcresult_NextElement;
                                        }
                                    }
                                }
                            } else {
                                RecalcResult = Element.Recalculate_Page(PageIndex);
                                this.DrawingObjects.addFloatTable(new CFlowTable2(Element, PageIndex));
                                if (recalcresult_NextElement === RecalcResult) {
                                    this.RecalcInfo.FlowObject = null;
                                    this.RecalcInfo.FlowObjectPageBreakBefore = false;
                                    this.RecalcInfo.RecalcResult = recalcresult_NextElement;
                                }
                            }
                        }
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
            if (true != bFlowTable) {
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
    OnContentReDraw: function (StartPage, EndPage) {
        this.ReDraw(StartPage, EndPage);
    },
    CheckTargetUpdate: function () {
        if (this.DrawingDocument.UpdateTargetFromPaint === true) {
            if (true === this.DrawingDocument.UpdateTargetCheck) {
                this.NeedUpdateTarget = this.DrawingDocument.UpdateTargetCheck;
            }
            this.DrawingDocument.UpdateTargetCheck = false;
        }
        if (true === this.NeedUpdateTarget) {
            this.RecalculateCurPos();
            this.NeedUpdateTarget = false;
        }
    },
    RecalculateCurPos: function () {
        if (this.Slides[this.CurPage]) {
            this.Slides[this.CurPage].graphicObjects.recalculateCurPos();
        }
    },
    Internal_CheckCurPage: function () {
        if (this.CurPos.ContentPos >= 0 && (null === this.FullRecalc.Id || this.FullRecalc.StartIndex > this.CurPos.ContentPos)) {
            this.CurPage = this.Content[this.CurPos.ContentPos].Get_CurrentPage_Absolute();
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
        this.Slides[nPageIndex].draw(pGraphics);
    },
    Add_NewParagraph: function (bRecalculate) {
        this.Slides[this.CurPage].graphicObjects.addNewParagraph(bRecalculate);
        this.Recalculate();
        this.Slides[this.CurPage].graphicObjects.updateSelectionState();
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
    findText: function (text, scanForward) {
        if (typeof(text) != "string") {
            return;
        }
        if (scanForward === undefined) {
            scanForward = true;
        }
        var slide_num;
        var search_select_data = null;
        if (scanForward) {
            for (slide_num = this.CurPage; slide_num < this.Slides.length; ++slide_num) {
                search_select_data = this.Slides[slide_num].graphicObjects.startSearchText(text, scanForward);
                if (search_select_data != null) {
                    this.DrawingDocument.m_oWordControl.GoToPage(slide_num);
                    this.Slides[slide_num].graphicObjects.setSelectionState(search_select_data);
                    this.Document_UpdateSelectionState();
                    return true;
                }
            }
            for (slide_num = 0; slide_num <= this.CurPage; ++slide_num) {
                search_select_data = this.Slides[slide_num].graphicObjects.startSearchText(text, scanForward, true);
                if (search_select_data != null) {
                    this.DrawingDocument.m_oWordControl.GoToPage(slide_num);
                    this.Slides[slide_num].graphicObjects.setSelectionState(search_select_data);
                    this.Document_UpdateSelectionState();
                    return true;
                }
            }
        } else {
            for (slide_num = this.CurPage; slide_num > -1; --slide_num) {
                search_select_data = this.Slides[slide_num].graphicObjects.startSearchText(text, scanForward);
                if (search_select_data != null) {
                    this.DrawingDocument.m_oWordControl.GoToPage(slide_num);
                    this.Slides[slide_num].graphicObjects.setSelectionState(search_select_data);
                    this.Document_UpdateSelectionState();
                    return true;
                }
            }
            for (slide_num = this.Slides.length - 1; slide_num >= this.CurPage; --slide_num) {
                search_select_data = this.Slides[slide_num].graphicObjects.startSearchText(text, scanForward, true);
                if (search_select_data != null) {
                    this.DrawingDocument.m_oWordControl.GoToPage(slide_num);
                    this.Slides[slide_num].graphicObjects.setSelectionState(search_select_data);
                    this.Document_UpdateSelectionState();
                    return true;
                }
            }
        }
        return false;
    },
    groupShapes: function () {
        if (this.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.Slides[this.CurPage].graphicObjects.groupShapes();
            this.Recalculate();
        }
    },
    unGroupShapes: function () {
        if (this.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.Slides[this.CurPage].graphicObjects.unGroup();
            this.Recalculate();
        }
    },
    Add_FlowImage: function (W, H, Img) {
        this.Slides[this.CurPage].graphicObjects.Add_FlowImage(W, H, Img);
        this.Recalculate();
        editor.sync_EndAddShape();
        this.Document_UpdateInterfaceState();
    },
    addChart: function (binary) {
        this.Slides[this.CurPage].graphicObjects.addChart(binary);
        this.Document_UpdateUndoRedoState();
        this.Recalculate();
    },
    redrawCharts: function () {
        for (var i = 0; i < this.Slides.length; ++i) {
            this.Slides[i].graphicObjects.redrawCharts();
        }
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
                    var Drawing = new ParaDrawing(W, H, null, this.DrawingDocument, this);
                    var Image = new WordImage(Drawing, this, this.DrawingDocument, null);
                    Drawing.Set_GraphicObject(Image);
                    if (true === bFlow) {
                        Drawing.Set_DrawingType(drawing_Anchor);
                        Drawing.Set_WrappingType(WRAPPING_TYPE_SQUARE);
                        Drawing.Set_BehindDoc(false);
                        Drawing.Set_Distance(3.2, 0, 3.2, 0);
                        Drawing.Set_PositionH(c_oAscRelativeFromH.Column, false, 0);
                        Drawing.Set_PositionV(c_oAscRelativeFromV.Paragraph, false, 0);
                    }
                    Image.init(Img, W, H, Chart);
                    this.Paragraph_Add(Drawing);
                } else {
                    if (type_Table == Item.GetType()) {
                        Item.Add_InlineImage(W, H, Img, Chart, bFlow);
                    }
                }
            }
        }
    },
    Edit_Chart: function (binary) {
        this.Slides[this.CurPage].graphicObjects.editChart(binary);
        this.Recalculate();
    },
    Get_ChartObject: function () {
        return this.Slides[this.CurPage].graphicObjects.getChartObject();
    },
    Add_FlowTable: function (Cols, Rows) {
        var X = 0;
        var Y = 0;
        var W = this.Width * 2 / 3;
        var Grid = [];
        for (var Index = 0; Index < Cols; Index++) {
            Grid[Index] = W / Cols;
        }
        var _cur_slide = this.Slides[this.CurPage];
        var _graphic_frame = new CGraphicFrame(_cur_slide);
        _graphic_frame.setXfrm((this.Width - W) / 2, this.Height / 5, W, 7.478268771701388 * Rows, null, null, null);
        _graphic_frame.setParent(_cur_slide);
        _graphic_frame.setNvSpPr(new UniNvPr());
        if (this.globalTableStyles.length == 0) {
            this.globalTableStyles[0] = CreateDefaultStylesForTables();
        }
        var _table = new CTable(this.DrawingDocument, _graphic_frame, false, 0, 0, 0, W, 100, Rows, Cols, Grid);
        _table.Set_Inline(true);
        _table.setStyleIndex(0);
        _graphic_frame.setGraphicObject(_table);
        if (this.Document_Is_SelectionLocked(changestype_AddShape, _graphic_frame) === false) {
            this.Slides[this.CurPage].graphicObjects.resetSelectionState();
            _graphic_frame.select(this.Slides[this.CurPage].graphicObjects);
            this.Slides[this.CurPage].addToSpTreeToPos(this.Slides[this.CurPage].cSld.spTree.length, _graphic_frame);
            editor.WordControl.m_oLogicDocument.recalcMap[_graphic_frame.Id] = _graphic_frame;
            this.Recalculate();
            this.DrawingDocument.OnRecalculatePage(this.CurPage, _cur_slide);
            this.DrawingDocument.UpdateTargetTransform(_graphic_frame.TransformMatrix);
            this.Document_UpdateInterfaceState();
            this.Document_UpdateRulersState();
            this.Document_UpdateSelectionState();
        } else {
            this.Document_Undo();
        }
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
    CheckRange: function (X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf, PageNum) {
        var HdrFtrRanges = this.HdrFtr.CheckRange(X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf, PageNum);
        return this.DrawingObjects.CheckRange(X0, Y0, X1, Y1, _Y0, _Y1, X_lf, X_rf, PageNum, HdrFtrRanges, null);
    },
    Paragraph_Add: function (ParaItem, bRecalculate) {
        this.Slides[this.CurPage].paragraphAdd(ParaItem, bRecalculate);
        this.Recalculate();
        this.Slides[this.CurPage].graphicObjects.updateSelectionState();
    },
    Paragraph_ClearFormatting: function () {
        if (this.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.Slides[this.CurPage].graphicObjects.Paragraph_ClearFormatting();
            this.Recalculate();
        }
    },
    Remove: function (Count, bOnlyText, bRemoveOnlySelection) {
        if (editor.WordControl.Thumbnails.FocusObjType === FOCUS_OBJECT_THUMBNAILS) {
            this.deleteSlides(editor.WordControl.Thumbnails.GetSelectedArray());
            return;
        }
        if ("undefined" === typeof(bRemoveOnlySelection)) {
            bRemoveOnlySelection = false;
        }
        this.Slides[this.CurPage].graphicObjects.remove(Count, bOnlyText, bRemoveOnlySelection);
        this.Recalculate();
        this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
        return true;
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
        this.Slides[this.CurPage].graphicObjects.Cursor_MoveToStartPos();
        return true;
    },
    Cursor_MoveToEndPos: function () {
        this.Slides[this.CurPage].graphicObjects.Cursor_MoveToEndPos();
        return true;
    },
    Cursor_MoveLeft: function (AddToSelect, Word) {
        this.Slides[this.CurPage].graphicObjects.Cursor_MoveLeft(AddToSelect, Word);
        return true;
    },
    Cursor_MoveRight: function (AddToSelect, Word) {
        this.Slides[this.CurPage].graphicObjects.Cursor_MoveRight(AddToSelect, Word);
        return true;
    },
    Cursor_MoveUp: function (AddToSelect) {
        this.Slides[this.CurPage].graphicObjects.Cursor_MoveUp(AddToSelect);
        return true;
    },
    Cursor_MoveDown: function (AddToSelect) {
        this.Slides[this.CurPage].graphicObjects.Cursor_MoveDown(AddToSelect);
        return true;
    },
    Cursor_MoveEndOfLine: function (AddToSelect) {
        this.Slides[this.CurPage].graphicObjects.Cursor_MoveEndOfLine(AddToSelect);
        return true;
    },
    Cursor_MoveStartOfLine: function (AddToSelect) {
        this.Slides[this.CurPage].graphicObjects.Cursor_MoveStartOfLine(AddToSelect);
        return true;
    },
    Cursor_MoveAt: function (X, Y, AddToSelect) {
        this.Slides[this.CurPage].graphicObjects.Cursor_MoveAt(X, Y, AddToSelect);
        return true;
    },
    Cursor_MoveToCell: function (bNext) {},
    Set_ParagraphAlign: function (Align) {
        if (this.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.Slides[this.CurPage].graphicObjects.setParagraphAlign(Align);
            this.Recalculate();
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
        }
    },
    Set_ParagraphSpacing: function (Spacing) {
        if (this.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.Slides[this.CurPage].graphicObjects.setParagraphSpacing(Spacing);
            this.Recalculate();
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
        }
    },
    Set_ParagraphTabs: function (Tabs) {
        if (this.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.Slides[this.CurPage].graphicObjects.setParagraphTabs(Tabs);
            this.Recalculate();
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
        }
    },
    Set_ParagraphIndent: function (Ind) {
        if (this.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.Slides[this.CurPage].graphicObjects.setParagraphIndent(Ind);
            this.Recalculate();
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
        }
    },
    Set_ParagraphNumbering: function (NumInfo) {
        if (this.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.Slides[this.CurPage].graphicObjects.setParagraphNumbering(NumInfo);
            this.Recalculate();
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
        }
    },
    Set_ParagraphShd: function (Shd) {},
    Set_ParagraphStyle: function (Name) {},
    Set_ParagraphContextualSpacing: function (Value) {},
    Set_ParagraphPageBreakBefore: function (Value) {},
    Set_ParagraphKeepLines: function (Value) {},
    Set_ParagraphWidowControl: function (Value) {},
    Set_ParagraphBorders: function (Borders) {},
    Paragraph_IncDecFontSize: function (bIncrease) {
        this.Slides[this.CurPage].graphicObjects.Paragraph_IncDecFontSize(bIncrease);
        this.Recalculate();
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },
    Paragraph_IncDecIndent: function (bIncrease) {},
    Paragraph_SetHighlight: function (IsColor, r, g, b) {},
    Set_ImageProps: function (Props) {
        this.Slides[this.CurPage].graphicObjects.imageApply(Props);
        this.Recalculate();
        this.Document_UpdateInterfaceState();
    },
    ShapeApply: function (shapeProps) {
        this.Slides[this.CurPage].graphicObjects.shapeApply(shapeProps);
        this.Recalculate();
        this.Document_UpdateInterfaceState();
    },
    ChartApply: function (chartProps) {
        this.Slides[this.CurPage].graphicObjects.chartApply(chartProps);
        this.Recalculate();
        this.Document_UpdateInterfaceState();
    },
    changeShapeType: function (shapeType) {
        if (this.viewMode === true) {
            return;
        }
        this.ShapeApply({
            type: shapeType
        });
    },
    setVerticalAlign: function (align) {
        this.Slides[this.CurPage].graphicObjects.setVerticalAlign(align);
        this.Recalculate();
    },
    Set_TableProps: function (Props) {
        if (Props.CellBorders) {
            if (Props.CellBorders.Left && Props.CellBorders.Left.Color) {
                Props.CellBorders.Left.unifill = CreteSolidFillRGB(Props.CellBorders.Left.Color.r, Props.CellBorders.Left.Color.g, Props.CellBorders.Left.Color.b);
            }
            if (Props.CellBorders.Top && Props.CellBorders.Top.Color) {
                Props.CellBorders.Top.unifill = CreteSolidFillRGB(Props.CellBorders.Top.Color.r, Props.CellBorders.Top.Color.g, Props.CellBorders.Top.Color.b);
            }
            if (Props.CellBorders.Right && Props.CellBorders.Right.Color) {
                Props.CellBorders.Right.unifill = CreteSolidFillRGB(Props.CellBorders.Right.Color.r, Props.CellBorders.Right.Color.g, Props.CellBorders.Right.Color.b);
            }
            if (Props.CellBorders.Bottom && Props.CellBorders.Bottom.Color) {
                Props.CellBorders.Bottom.unifill = CreteSolidFillRGB(Props.CellBorders.Bottom.Color.r, Props.CellBorders.Bottom.Color.g, Props.CellBorders.Bottom.Color.b);
            }
        }
        this.Slides[this.CurPage].graphicObjects.setTableProps(Props);
        this.Recalculate();
        this.Document_UpdateInterfaceState();
        this.Document_UpdateRulersState();
        this.Document_UpdateSelectionState();
    },
    Get_Paragraph_ParaPr: function () {
        return this.Slides[this.CurPage].graphicObjects.Get_Paragraph_ParaPr();
    },
    Get_Paragraph_TextPr: function () {
        return this.Slides[this.CurPage].graphicObjects.Get_Paragraph_TextPr();
    },
    Get_Paragraph_TextPr_Copy: function () {
        if (this.Slides[this.CurPage].graphicObjects.State.textObject) {
            return this.Slides[this.CurPage].graphicObjects.Get_Paragraph_TextPr().Copy();
        }
        return null;
    },
    Get_Paragraph_ParaPr_Copy: function () {
        if (this.Slides[this.CurPage].graphicObjects.State.textObject) {
            return this.Slides[this.CurPage].graphicObjects.Get_Paragraph_ParaPr().Copy();
        }
        return null;
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
    Interface_Update_ParaPr: function () {
        var ParaPr = this.Slides[this.CurPage].graphicObjects.getPropsArrays().paraPr;
        if (null != ParaPr) {
            if (undefined != ParaPr.Tabs) {
                editor.Update_ParaTab(Default_Tab_Stop, ParaPr.Tabs);
            }
            editor.UpdateParagraphProp(ParaPr);
        }
    },
    Interface_Update_TextPr: function () {
        var TextPr = this.Slides[this.CurPage].graphicObjects.getPropsArrays().textPr;
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
            return FlowTable.Table.Index;
        }
        var StartPos = this.Pages[PageNum].Pos;
        var EndPos = this.Content.length - 1;
        if (PageNum < this.Pages.length - 1) {
            EndPos = Math.min(this.Pages[PageNum + 1].Pos, EndPos);
        }
        var InlineElements = new Array();
        for (var Index = StartPos; Index <= EndPos; Index++) {
            var Item = this.Content[Index];
            if (type_Table != Item.GetType() || false != Item.Is_Inline()) {
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
    getAllTableStyles: function () {
        for (var i = 0; i < this.globalTableStyles.length; ++i) {
            this.globalTableStyles[i].stylesId = i;
        }
        return this.globalTableStyles;
    },
    Selection_Is_OneElement: function () {
        if (true === this.Selection.Use && this.CurPos.Type === docpostype_Content && this.Selection.Flag === selectionflag_Common && this.Selection.StartPos === this.Selection.EndPos) {
            return true;
        }
        return false;
    },
    Selection_Is_TableBorderMove: function () {
        if (null != this.Selection.Data && true === this.Selection.Data.TableBorder && type_Table == this.Content[this.Selection.Data.Pos].GetType()) {
            return true;
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
        this.Slides[this.CurPage].graphicObjects.Select_All();
        this.Document_UpdateInterfaceState();
        return;
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
        this.Slides[this.CurPage].graphicObjects.Update_CursorType(X, Y, MouseEvent);
        editor.sync_MouseMoveEndCallback();
        return;
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
        var bUpdateSelection = true;
        var bRetValue = false;
        if (e.KeyCode == 8 && false === editor.isViewMode) {
            this.Remove(-1, true);
            bRetValue = true;
        } else {
            if (e.KeyCode == 9 && false === editor.isViewMode) {
                var graphicObjects = this.Slides[this.CurPage].graphicObjects;
                var state = graphicObjects.State;
                var drawingObjectsController = graphicObjects;
                switch (state.id) {
                case STATES_ID_NULL:
                    var a_drawing_bases = this.Slides[this.CurPage].cSld.spTree;
                    if (!e.SshiftKey) {
                        var last_selected = null,
                        last_selected_index = null;
                        for (var i = a_drawing_bases.length - 1; i > -1; --i) {
                            if (a_drawing_bases[i].selected) {
                                last_selected = a_drawing_bases[i];
                                last_selected_index = i;
                                break;
                            }
                        }
                        if (isRealObject(last_selected)) {
                            bRetValue = true;
                            drawingObjectsController.resetSelection();
                            if (!last_selected.isGroup() || last_selected.arrGraphicObjects.length === 0) {
                                if (last_selected_index < a_drawing_bases.length - 1) {
                                    a_drawing_bases[last_selected_index + 1].select(drawingObjectsController);
                                } else {
                                    a_drawing_bases[0].select(drawingObjectsController);
                                }
                            } else {
                                last_selected.select(drawingObjectsController);
                                last_selected.arrGraphicObjects[0].select(last_selected);
                                drawingObjectsController.changeCurrentState(new GroupState(drawingObjectsController, drawingObjectsController.slide, last_selected));
                            }
                        }
                    } else {
                        var first_selected = null,
                        first_selected_index = null;
                        for (var i = 0; i < a_drawing_bases.length; ++i) {
                            if (a_drawing_bases[i].selected) {
                                first_selected = a_drawing_bases[i];
                                first_selected_index = i;
                                break;
                            }
                        }
                        if (isRealObject(first_selected)) {
                            bRetValue = true;
                            drawingObjectsController.resetSelection();
                            if (first_selected_index > 0) {
                                a_drawing_bases[first_selected_index - 1].select(drawingObjectsController);
                            } else {
                                a_drawing_bases[a_drawing_bases.length - 1].select(drawingObjectsController);
                            }
                        }
                    }
                    break;
                case STATES_ID_GROUP:
                    var group = state.group;
                    var arr_graphic_objects = group.arrGraphicObjects;
                    if (!e.shiftKey) {
                        for (var i = arr_graphic_objects.length - 1; i > -1; --i) {
                            if (arr_graphic_objects[i].selected) {
                                break;
                            }
                        }
                        group.resetSelection();
                        if (i < arr_graphic_objects.length - 1) {
                            arr_graphic_objects[i + 1].select(group);
                        } else {
                            drawingObjectsController.resetSelectionState();
                            var a_drawing_bases = this.Slides[this.CurPage].cSld.spTree;
                            for (var i = 0; i < a_drawing_bases.length; ++i) {
                                if (a_drawing_bases === group) {
                                    break;
                                }
                            }
                            if (i < a_drawing_bases.length) {
                                a_drawing_bases[i + 1].select(drawingObjectsController);
                            } else {
                                a_drawing_bases[0].select(drawingObjectsController);
                            }
                        }
                    } else {
                        for (var i = 0; i < arr_graphic_objects.length; ++i) {
                            if (arr_graphic_objects[i].selected) {
                                break;
                            }
                        }
                        group.resetSelection();
                        if (i > 0) {
                            arr_graphic_objects[i - 1].select(group);
                        } else {
                            drawingObjectsController.resetSelectionState();
                            group.select(drawingObjectsController);
                        }
                    }
                    break;
                case STATES_ID_TEXT_ADD:
                    case STATES_ID_TEXT_ADD_IN_GROUP:
                    this.Paragraph_Add(new ParaTab());
                    break;
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
                            bRetValue = true;
                        } else {
                            if (e.KeyCode == 33) {
                                if (true === e.AltKey) {} else {
                                    if (this.CurPage > 0) {
                                        this.DrawingDocument.m_oWordControl.GoToPage(this.CurPage - 1);
                                        bRetValue = true;
                                    }
                                }
                            } else {
                                if (e.KeyCode == 34) {
                                    if (true === e.AltKey) {} else {
                                        if (this.CurPage + 1 < this.Slides.length) {
                                            this.DrawingDocument.m_oWordControl.GoToPage(this.CurPage + 1);
                                            bRetValue = true;
                                        }
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
                                                this.Cursor_MoveLeft(true === e.ShiftKey, true === e.CtrlKey);
                                                bRetValue = true;
                                            } else {
                                                if (e.KeyCode == 38) {
                                                    this.Cursor_MoveUp(true === e.ShiftKey);
                                                    bRetValue = true;
                                                } else {
                                                    if (e.KeyCode == 39) {
                                                        this.Cursor_MoveRight(true === e.ShiftKey, true === e.CtrlKey);
                                                        bRetValue = true;
                                                    } else {
                                                        if (e.KeyCode == 40) {
                                                            this.Cursor_MoveDown(true === e.ShiftKey);
                                                            bRetValue = true;
                                                        } else {
                                                            if (e.KeyCode == 45) {
                                                                if (true === e.CtrlKey) {
                                                                    Editor_Copy(this.DrawingDocument.m_oWordControl.m_oApi);
                                                                } else {
                                                                    if (true === e.ShiftKey && false === editor.isViewMode) {
                                                                        if (false === this.Document_Is_SelectionLocked(changestype_Drawing_Props)) {
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
                                                                        this.Remove(1, true);
                                                                        bRetValue = true;
                                                                    } else {
                                                                        if (false === this.Document_Is_SelectionLocked(changestype_Drawing_Props)) {
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
                                                                                if (e.KeyCode == 56 && true === e.CtrlKey && true === e.ShiftKey) {
                                                                                    editor.ShowParaMarks = !editor.ShowParaMarks;
                                                                                    if (this.Slides[this.CurPage]) {
                                                                                        this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                                                                                    }
                                                                                } else {
                                                                                    if (e.KeyCode == 65 && true === e.CtrlKey) {
                                                                                        this.Select_All();
                                                                                        bRetValue = true;
                                                                                    } else {
                                                                                        if (e.KeyCode == 66 && false === editor.isViewMode && true === e.CtrlKey) {
                                                                                            var TextPr = this.Get_Paragraph_TextPr();
                                                                                            if (null != TextPr) {
                                                                                                this.Paragraph_Add(new ParaTextPr({
                                                                                                    Bold: TextPr.Bold === true ? false : true
                                                                                                }));
                                                                                                this.Document_UpdateInterfaceState();
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
                                                                                                            this.Create_NewHistoryPoint();
                                                                                                            this.Set_ParagraphAlign(ParaPr.Jc === align_Center ? align_Left : align_Center);
                                                                                                            this.Document_UpdateInterfaceState();
                                                                                                            bRetValue = true;
                                                                                                        }
                                                                                                    } else {
                                                                                                        this.Paragraph_Add(new ParaText("€"));
                                                                                                        bRetValue = true;
                                                                                                    }
                                                                                                } else {
                                                                                                    if (e.KeyCode == 73 && false === editor.isViewMode && true === e.CtrlKey) {
                                                                                                        var TextPr = this.Get_Paragraph_TextPr();
                                                                                                        if (null != TextPr) {
                                                                                                            this.Paragraph_Add(new ParaTextPr({
                                                                                                                Italic: TextPr.Italic === true ? false : true
                                                                                                            }));
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
                                                                                                            if (e.KeyCode == 75 && false === editor.isViewMode && true === e.CtrlKey) {
                                                                                                                if (true === this.Hyperlink_CanAdd(false)) {
                                                                                                                    editor.sync_DialogAddHyperlink();
                                                                                                                }
                                                                                                                bRetValue = true;
                                                                                                            } else {
                                                                                                                if (e.KeyCode == 76 && false === editor.isViewMode && true === e.CtrlKey) {
                                                                                                                    if (true === e.ShiftKey) {
                                                                                                                        if (false === this.Document_Is_SelectionLocked(changestype_Drawing_Props)) {
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
                                                                                                                                this.Paragraph_Add(new ParaPageNum());
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
                                                                                                                                            this.Paragraph_Add(new ParaTextPr({
                                                                                                                                                Underline: TextPr.Underline === true ? false : true
                                                                                                                                            }));
                                                                                                                                            bRetValue = true;
                                                                                                                                        }
                                                                                                                                    } else {
                                                                                                                                        if (e.KeyCode == 86 && false === editor.isViewMode && true === e.CtrlKey) {
                                                                                                                                            if (false === this.Document_Is_SelectionLocked(changestype_Drawing_Props)) {
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
                                                                                                                                                if (false === this.Document_Is_SelectionLocked(changestype_Drawing_Props)) {
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
                                                                                                                                                            var type;
                                                                                                                                                            if (editor.WordControl.Thumbnails.FocusObjType === FOCUS_OBJECT_MAIN) {
                                                                                                                                                                type = c_oAscContextMenuTypes.Main;
                                                                                                                                                                if (this.Slides[this.CurPage]) {
                                                                                                                                                                    var pos_x = 0,
                                                                                                                                                                    pos_y = 0;
                                                                                                                                                                    if (this.Slides[this.CurPage].graphicObjects.selectedObjects.length > 0) {
                                                                                                                                                                        pos_x = this.Slides[this.CurPage].graphicObjects.selectedObjects[0].x;
                                                                                                                                                                        pos_y = this.Slides[this.CurPage].graphicObjects.selectedObjects[0].y;
                                                                                                                                                                    }
                                                                                                                                                                    var ConvertedPos = this.DrawingDocument.ConvertCoordsToCursorWR_2(pos_x, pos_y, this.PageNum);
                                                                                                                                                                    var X_abs = ConvertedPos.X;
                                                                                                                                                                    var Y_abs = ConvertedPos.Y;
                                                                                                                                                                    editor.sync_ContextMenuCallback(new CMouseMoveData({
                                                                                                                                                                        Type: type,
                                                                                                                                                                        X_abs: X_abs,
                                                                                                                                                                        Y_abs: Y_abs
                                                                                                                                                                    }));
                                                                                                                                                                }
                                                                                                                                                            } else {
                                                                                                                                                                type = c_oAscContextMenuTypes.Thumbnails;
                                                                                                                                                            }
                                                                                                                                                            bUpdateSelection = false;
                                                                                                                                                            bRetValue = true;
                                                                                                                                                        } else {
                                                                                                                                                            if (e.KeyCode == 121 && true === e.ShiftKey) {
                                                                                                                                                                var type;
                                                                                                                                                                if (editor.WordControl.Thumbnails.FocusObjType === FOCUS_OBJECT_MAIN) {
                                                                                                                                                                    type = c_oAscContextMenuTypes.Main;
                                                                                                                                                                    if (this.Slides[this.CurPage]) {
                                                                                                                                                                        var pos_x = 0,
                                                                                                                                                                        pos_y = 0;
                                                                                                                                                                        if (this.Slides[this.CurPage].graphicObjects.selectedObjects.length > 0) {
                                                                                                                                                                            pos_x = this.Slides[this.CurPage].graphicObjects.selectedObjects[0].x;
                                                                                                                                                                            pos_y = this.Slides[this.CurPage].graphicObjects.selectedObjects[0].y;
                                                                                                                                                                        }
                                                                                                                                                                        var ConvertedPos = this.DrawingDocument.ConvertCoordsToCursorWR(pos_x, pos_y, this.PageNum);
                                                                                                                                                                        var X_abs = ConvertedPos.X;
                                                                                                                                                                        var Y_abs = ConvertedPos.Y;
                                                                                                                                                                        editor.sync_ContextMenuCallback(new CMouseMoveData({
                                                                                                                                                                            Type: type,
                                                                                                                                                                            X_abs: X_abs,
                                                                                                                                                                            Y_abs: Y_abs
                                                                                                                                                                        }));
                                                                                                                                                                    }
                                                                                                                                                                } else {
                                                                                                                                                                    type = c_oAscContextMenuTypes.Thumbnails;
                                                                                                                                                                }
                                                                                                                                                                bUpdateSelection = false;
                                                                                                                                                                bRetValue = true;
                                                                                                                                                            } else {
                                                                                                                                                                if (e.KeyCode == 144) {
                                                                                                                                                                    bRetValue = true;
                                                                                                                                                                } else {
                                                                                                                                                                    if (e.KeyCode == 145) {
                                                                                                                                                                        bRetValue = true;
                                                                                                                                                                    } else {
                                                                                                                                                                        if (e.KeyCode == 187 && false === editor.isViewMode && true === e.CtrlKey) {
                                                                                                                                                                            var TextPr = this.Get_Paragraph_TextPr();
                                                                                                                                                                            if (null != TextPr) {
                                                                                                                                                                                if (true === e.ShiftKey) {
                                                                                                                                                                                    this.Paragraph_Add(new ParaTextPr({
                                                                                                                                                                                        VertAlign: TextPr.VertAlign === vertalign_SuperScript ? vertalign_Baseline : vertalign_SuperScript
                                                                                                                                                                                    }));
                                                                                                                                                                                } else {
                                                                                                                                                                                    this.Paragraph_Add(new ParaTextPr({
                                                                                                                                                                                        VertAlign: TextPr.VertAlign === vertalign_SubScript ? vertalign_Baseline : vertalign_SubScript
                                                                                                                                                                                    }));
                                                                                                                                                                                }
                                                                                                                                                                                bRetValue = true;
                                                                                                                                                                            }
                                                                                                                                                                        } else {
                                                                                                                                                                            if (e.KeyCode == 188 && true === e.CtrlKey) {
                                                                                                                                                                                var TextPr = this.Get_Paragraph_TextPr();
                                                                                                                                                                                if (null != TextPr) {
                                                                                                                                                                                    this.Paragraph_Add(new ParaTextPr({
                                                                                                                                                                                        VertAlign: TextPr.VertAlign === vertalign_SuperScript ? vertalign_Baseline : vertalign_SuperScript
                                                                                                                                                                                    }));
                                                                                                                                                                                    bRetValue = true;
                                                                                                                                                                                }
                                                                                                                                                                            } else {
                                                                                                                                                                                if (e.KeyCode == 189 && false === editor.isViewMode) {
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
                                                                                                                                                                                    bRetValue = true;
                                                                                                                                                                                } else {
                                                                                                                                                                                    if (e.KeyCode == 190 && true === e.CtrlKey) {
                                                                                                                                                                                        var TextPr = this.Get_Paragraph_TextPr();
                                                                                                                                                                                        if (null != TextPr) {
                                                                                                                                                                                            this.Paragraph_Add(new ParaTextPr({
                                                                                                                                                                                                VertAlign: TextPr.VertAlign === vertalign_SubScript ? vertalign_Baseline : vertalign_SubScript
                                                                                                                                                                                            }));
                                                                                                                                                                                            this.Document_UpdateInterfaceState();
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
    Set_DocumentDefaultTab: function (DTab) {
        History.Add(this, {
            Type: historyitem_Document_DefaultTab,
            Old: Default_Tab_Stop,
            New: DTab
        });
        Default_Tab_Stop = DTab;
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
            this.Paragraph_Add(new ParaText(String.fromCharCode(Code)));
            bRetValue = true;
        }
        if (true == bRetValue) {
            this.Document_UpdateSelectionState();
        }
        return bRetValue;
    },
    OnMouseDown: function (e, X, Y, PageIndex) {
        this.CurPage = PageIndex;
        if (PageIndex < 0) {
            return;
        }
        this.CurPage = PageIndex;
        if (e.Button === 0) {
            this.Slides[this.CurPage].graphicObjects.onMouseDown(e, X, Y);
        } else {
            if (e.Button === 2 && this.viewMode === false) {
                this.Slides[this.CurPage].graphicObjects.onMouseDown2(e, X, Y);
            }
        }
        this.Document_UpdateInterfaceState();
        return;
        if (PageIndex < 0) {
            return;
        }
        if (g_mouse_button_right === e.Button) {
            return;
        }
        var Table = this.Is_TableBorder(X, Y, PageIndex);
        if (null != Table) {
            if (true === this.Document_Is_SelectionLocked(changestype_None, {
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
        var elements = this.Slides[this.CurPage].graphicObjects;
        if (e.Button === 0) {
            elements.onMouseUp(e, X, Y);
        } else {
            if (e.Button === 2 && this.viewMode === false) {
                elements.onMouseUp2(e, X, Y);
            }
        }
        this.Document_UpdateInterfaceState();
    },
    OnMouseMove: function (e, X, Y, PageIndex) {
        editor.sync_MouseMoveStartCallback();
        this.CurPage = PageIndex;
        this.Slides[this.CurPage].onMouseMove(e, X, Y);
        this.Slides[this.CurPage].graphicObjects.Update_CursorType(X, Y, e);
        editor.sync_MouseMoveEndCallback();
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
        return this.Slides[this.CurPage].graphicObjects.Get_SelectedText(bClearText);
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
                        if (this.Selection.StartPos != this.Selection.EndPos) {
                            Info.Set_MixedSelection();
                        } else {
                            this.Content[this.Selection.StartPos].Get_SelectedElementsInfo(Info);
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
        if (this.Slides[this.CurPage].graphicObjects.State.textObject instanceof CGraphicFrame) {
            var _cur_object = this.Slides[this.CurPage].graphicObjects.State.textObject;
            if (_cur_object instanceof CGraphicFrame && _cur_object.graphicObject instanceof CTable) {
                _cur_object.graphicObject.Row_Add(bBefore);
                this.Recalculate();
                this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
            }
        } else {
            var _elements = this.Slides[this.CurPage].graphicObjects;
            if (_elements.State.id === STATES_ID_NULL) {
                var _shapes = this.Slides[this.CurPage].cSld.spTree;
                var _shape_index;
                var _shape_count = _shapes.length;
                var _selected_count = 0;
                var _target_table = null;
                for (_shape_index = 0; _shape_index < _shape_count; ++_shape_index) {
                    if (_shapes[_shape_index].selected) {
                        ++_selected_count;
                        if (_selected_count > 1) {
                            return;
                        }
                        if (_shapes[_shape_index] instanceof CGraphicFrame && _shapes[_shape_index].graphicObject instanceof CTable) {
                            _target_table = _shapes[_shape_index].graphicObject;
                        } else {
                            return;
                        }
                    }
                }
                if (_target_table !== null) {
                    _elements.changeCurrentState(new TextAddState(_elements, this.Slides[this.CurPage], _target_table.Parent));
                    _target_table.Row_Add(bBefore);
                    this.Recalculate();
                    this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                }
            }
        }
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },
    Table_AddCol: function (bBefore) {
        if (this.Slides[this.CurPage].graphicObjects.State.textObject instanceof CGraphicFrame) {
            var _cur_object = this.Slides[this.CurPage].graphicObjects.State.textObject;
            if (_cur_object instanceof CGraphicFrame && _cur_object.graphicObject instanceof CTable) {
                _cur_object.graphicObject.Col_Add(bBefore);
                this.Recalculate();
                this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
            }
        } else {
            var _elements = this.Slides[this.CurPage].graphicObjects;
            if (_elements.State.id === STATES_ID_NULL) {
                var _shapes = this.Slides[this.CurPage].cSld.spTree;
                var _shape_index;
                var _shape_count = _shapes.length;
                var _selected_count = 0;
                var _target_table = null;
                for (_shape_index = 0; _shape_index < _shape_count; ++_shape_index) {
                    if (_shapes[_shape_index].selected) {
                        ++_selected_count;
                        if (_selected_count > 1) {
                            return;
                        }
                        if (_shapes[_shape_index] instanceof CGraphicFrame && _shapes[_shape_index].graphicObject instanceof CTable) {
                            _target_table = _shapes[_shape_index].graphicObject;
                        } else {
                            return;
                        }
                    }
                }
                if (_target_table !== null) {
                    _elements.changeCurrentState(new TextAddState(_elements, this.Slides[this.CurPage], _target_table.Parent));
                    _target_table.Col_Add(bBefore);
                    this.Recalculate();
                    this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                }
            }
        }
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },
    Table_RemoveRow: function () {
        var _cur_object = this.Slides[this.CurPage].graphicObjects.State.textObject;
        if (_cur_object instanceof CGraphicFrame && _cur_object.graphicObject instanceof CTable) {
            if (_cur_object.graphicObject.Row_Remove() === false) {
                this.Table_RemoveTable(true);
            } else {
                this.Recalculate();
                this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
            }
        }
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },
    Table_RemoveCol: function () {
        var _cur_object = this.Slides[this.CurPage].graphicObjects.State.textObject;
        if (_cur_object instanceof CGraphicFrame && _cur_object.graphicObject instanceof CTable) {
            if (_cur_object.graphicObject.Col_Remove() === false) {
                this.Table_RemoveTable(true);
            } else {
                this.Recalculate();
                this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
            }
        }
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },
    Table_MergeCells: function () {
        var _cur_object = this.Slides[this.CurPage].graphicObjects.State.textObject;
        if (_cur_object instanceof CGraphicFrame) {
            if (_cur_object.graphicObject !== null && typeof _cur_object.graphicObject === "object" && typeof _cur_object.graphicObject.Cell_Merge === "function") {
                _cur_object.graphicObject.Cell_Merge();
                this.Recalculate(0);
                this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                this.Document_UpdateSelectionState();
            }
        }
    },
    Table_SplitCell: function (Cols, Rows) {
        var _cur_object = this.Slides[this.CurPage].graphicObjects.State.textObject;
        if (_cur_object.graphicObject !== null && typeof _cur_object.graphicObject === "object" && typeof _cur_object.graphicObject.Cell_Split === "function") {
            _cur_object.graphicObject.Cell_Split(Rows, Cols);
            this.Recalculate();
            this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
            return;
        } else {
            return;
        }
    },
    Table_RemoveTable: function (bHistoryFlag) {
        if (this.Slides[this.CurPage].graphicObjects.State.textObject instanceof CGraphicFrame) {
            var gr_fr = this.Slides[this.CurPage].graphicObjects.State.textObject;
            this.Slides[this.CurPage].graphicObjects.resetSelectionState();
            gr_fr.select(this.Slides[this.CurPage].graphicObjects);
            this.Slides[this.CurPage].removeSelectedObjects();
            this.Recalculate();
            this.Document_UpdateUndoRedoState();
            this.Document_UpdateInterfaceState();
        }
    },
    Table_Select: function (Type) {
        if (this.Slides[this.CurPage].graphicObjects.State.textObject && this.Slides[this.CurPage].graphicObjects.State.textObject instanceof CGraphicFrame) {
            this.Slides[this.CurPage].graphicObjects.State.textObject.graphicObject.Table_Select(Type);
            this.Document_UpdateSelectionState();
            this.Document_UpdateInterfaceState();
        }
    },
    Table_CheckMerge: function () {
        if (this.Slides[this.CurPage].graphicObjects.State.textObject && this.Slides[this.CurPage].graphicObjects.State.textObject instanceof CGraphicFrame) {
            return this.Slides[this.CurPage].graphicObjects.State.textObject.graphicObject.Check_Merge();
        }
        return false;
    },
    Table_CheckSplit: function () {
        if (this.Slides[this.CurPage].graphicObjects.State.textObject && this.Slides[this.CurPage].graphicObjects.State.textObject instanceof CGraphicFrame) {
            return this.Slides[this.CurPage].graphicObjects.State.textObject.graphicObject.Check_Split();
        }
        return false;
    },
    Check_TableCoincidence: function (Table) {
        return false;
    },
    Document_CreateFontMap: function () {
        return;
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
        for (var i = 0; i < this.Slides.length; ++i) {
            this.Slides[i].getAllFonts(AllFonts);
        }
        return AllFonts;
    },
    Document_UpdateInterfaceState: function () {
        editor.sync_BeginCatchSelectedElements();
        editor.ClearPropObjCallback();
        var _empty_para_pr = {
            Ind: {
                Left: UnknownValue,
                Right: UnknownValue,
                FirstLine: UnknownValue
            },
            Jc: UnknownValue,
            Spacing: {
                Line: UnknownValue,
                LineRule: UnknownValue,
                Before: UnknownValue,
                After: UnknownValue,
                AfterAutoSpacing: UnknownValue,
                BeforeAutoSpacing: UnknownValue
            },
            PageBreakBefore: UnknownValue,
            KeepLines: UnknownValue,
            ContextualSpacing: UnknownValue,
            Shd: UnknownValue,
            StyleId: -1,
            NumPr: null,
            Brd: {
                Between: null,
                Bottom: null,
                Left: null,
                Right: null
            },
            ListType: {
                Type: -1,
                SubType: -1
            }
        };
        var _empty_text_pr = {
            Bold: false,
            Italic: false,
            Underline: false,
            Strikeout: false,
            FontSize: "",
            FontFamily: {
                Index: 0,
                Name: ""
            },
            VertAlign: vertalign_Baseline,
            Color: {
                r: 0,
                g: 0,
                b: 0
            },
            HighLight: highlight_None
        };
        if (this.Slides[this.CurPage]) {
            var _cur_slide = this.Slides[this.CurPage];
            var _slide_elements = _cur_slide.graphicObjects;
            _slide_elements.Document_UpdateInterfaceState();
            var slide = this.Slides[this.CurPage];
            editor.sync_EndCatchSelectedElements({
                theme: slide.Layout.Master.Theme,
                slide: slide,
                layout: slide.Layout,
                master: slide.Layout.Master
            });
        } else {
            editor.sync_EndCatchSelectedElements();
        }
        editor.asc_fireCallback("asc_onCanGroup", this.canGroup());
        editor.asc_fireCallback("asc_onCanUnGroup", this.canUnGroup());
        this.Document_UpdateRulersState();
        this.Document_UpdateUndoRedoState();
        this.Document_UpdateCanAddHyperlinkState();
    },
    changeBackground: function (bg, arr_ind) {
        if (this.Document_Is_SelectionLocked(changestype_SlideBg) === false) {
            History.Create_NewPoint();
            for (var i = 0; i < arr_ind.length; ++i) {
                this.Slides[arr_ind[i]].changeBackground(bg);
            }
            this.Recalculate();
            for (var i = 0; i < arr_ind.length; ++i) {
                this.DrawingDocument.OnRecalculatePage(arr_ind[i], this.Slides[arr_ind[i]]);
            }
            this.DrawingDocument.OnEndRecalculate(true, false);
            this.Document_UpdateInterfaceState();
        }
    },
    Document_UpdateRulersState: function () {
        if (this.Slides[this.CurPage]) {
            var g_o = this.Slides[this.CurPage].graphicObjects;
            switch (g_o.State.id) {
            case STATES_ID_NULL:
                if (g_o.selectedObjects.length === 1 && g_o.selectedObjects[0].Document_UpdateRulersState) {
                    g_o.selectedObjects[0].Document_UpdateRulersState();
                    return;
                }
                break;
            case STATES_ID_TEXT_ADD:
                case STATES_ID_TEXT_ADD_IN_GROUP:
                if (g_o.selectedObjects.length === 1 && g_o.selectedObjects[0].Document_UpdateRulersState) {
                    g_o.selectedObjects[0].Document_UpdateRulersState();
                    return;
                }
                break;
            }
        }
        this.DrawingDocument.Set_RulerState_Paragraph(null);
        return;
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Document_UpdateRulersState(this.CurPage);
        } else {
            if (docpostype_DrawingObjects === this.CurPos.Type) {
                return this.DrawingObjects.documentUpdateRulersState();
            } else {
                if (true === this.Selection.Use) {
                    if (this.Selection.StartPos == this.Selection.EndPos && type_Table === this.Content[this.Selection.StartPos].GetType()) {
                        this.Content[this.Selection.StartPos].Document_UpdateRulersState(this.CurPage);
                    } else {
                        this.DrawingDocument.Set_RulerState_Paragraph(null);
                    }
                } else {
                    this.Internal_CheckCurPage();
                    var Item = this.Content[this.CurPos.ContentPos];
                    if (type_Table === Item.GetType()) {
                        Item.Document_UpdateRulersState(this.CurPage);
                    } else {
                        this.DrawingDocument.Set_RulerState_Paragraph(null);
                    }
                }
            }
        }
    },
    Document_UpdateSelectionState: function () {
        if (this.Slides[this.CurPage]) {
            this.Slides[this.CurPage].graphicObjects.updateSelectionState();
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
        if (-1 == PageNum) {
            this.CurPage = -1;
            return;
        }
        var oldCurPage = this.CurPage;
        this.CurPage = Math.min(this.Slides.length - 1, Math.max(0, PageNum));
        if (oldCurPage != this.CurPage && this.CurPage < this.Slides.length) {
            if (this.Slides[oldCurPage]) {
                this.Slides[oldCurPage].graphicObjects.resetSelectionState();
            }
            editor.asc_hideComments();
        }
    },
    Get_CurPage: function () {
        if (docpostype_HdrFtr === this.CurPos.Type) {
            return this.HdrFtr.Get_CurPage();
        }
        return this.CurPage;
    },
    resetStateCurSlide: function () {},
    Create_NewHistoryPoint: function () {
        this.History.Create_NewPoint();
    },
    Document_Undo: function () {
        if (true === CollaborativeEditing.Get_GlobalLock()) {
            return;
        }
        this.History.Undo();
        this.Recalculate();
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },
    Document_Redo: function () {
        if (true === CollaborativeEditing.Get_GlobalLock()) {
            return;
        }
        this.History.Redo();
        this.Recalculate();
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },
    Get_SelectionState: function () {
        var s = {};
        s.CurPage = this.CurPage;
        if (this.CurPage > -1) {
            s.slideSelection = this.Slides[this.CurPage].graphicObjects.getSelectionState();
        }
        return s;
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
        State.push(DocState);
        return State;
    },
    Set_SelectionState: function (State) {
        this.Set_CurPage(State.CurPage);
        if (State.CurPage > -1) {
            this.Slides[this.CurPage].graphicObjects.setSelectionState(State.slideSelection);
        }
        this.bGoToPage = true;
        return;
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
        case historyitem_Document_DefaultTab:
            Default_Tab_Stop = Data.Old;
            break;
        case historyitem_Presenattion_AddSlide:
            this.Slides.splice(Data.Pos, 1);
            for (var i = 0; i < this.Slides.length; ++i) {
                this.DrawingDocument.OnRecalculatePage(i, this.Slides[i]);
            }
            break;
        case historyitem_Presenattion_RemoveSlide:
            this.Slides.splice(Data.Pos, 0, g_oTableId.Get_ById(Data.Id));
            for (var i = 0; i < this.Slides.length; ++i) {
                this.DrawingDocument.OnRecalculatePage(i, this.Slides[i]);
            }
            break;
        case historyitem_Presenattion_SlideSize:
            var kw = Data.oldW / this.Width;
            var kh = Data.oldH / this.Height;
            this.Width = Data.oldW;
            this.Height = Data.oldH;
            var b_is_on = History.Is_On();
            if (b_is_on) {
                History.TurnOff();
            }
            for (var i = 0; i < this.slideMasters.length; ++i) {
                this.slideMasters[i].changeSize(kw, kh);
                var master = this.slideMasters[i];
                for (var j = 0; j < master.sldLayoutLst.length; ++j) {
                    master.sldLayoutLst[j].changeSize(kw, kh);
                }
            }
            for (var i = 0; i < this.Slides.length; ++i) {
                this.Slides[i].changeSize(kw, kh);
            }
            editor.asc_fireCallback("asc_onPresentationSize", this.Width, this.Height);
            if (b_is_on) {
                History.TurnOn();
            }
            break;
        case historyitem_Presenattion_AddSlideMaster:
            this.slideMasters.splice(Data.pos, 1);
            break;
        }
    },
    Redo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_Document_DefaultTab:
            Default_Tab_Stop = Data.New;
            break;
        case historyitem_Presenattion_AddSlide:
            this.Slides.splice(Data.Pos, 0, g_oTableId.Get_ById(Data.Id));
            for (var i = 0; i < this.Slides.length; ++i) {
                this.DrawingDocument.OnRecalculatePage(i, this.Slides[i]);
            }
            break;
        case historyitem_Presenattion_RemoveSlide:
            this.Slides.splice(Data.Pos, 1);
            for (var i = 0; i < this.Slides.length; ++i) {
                this.DrawingDocument.OnRecalculatePage(i, this.Slides[i]);
            }
            break;
        case historyitem_Presenattion_SlideSize:
            var kw = Data.newW / this.Width;
            var kh = Data.newH / this.Height;
            this.Width = Data.newW;
            this.Height = Data.newH;
            var b_is_on = History.Is_On();
            if (b_is_on) {
                History.TurnOff();
            }
            for (var i = 0; i < this.slideMasters.length; ++i) {
                this.slideMasters[i].changeSize(kw, kh);
                var master = this.slideMasters[i];
                for (var j = 0; j < master.sldLayoutLst.length; ++j) {
                    master.sldLayoutLst[j].changeSize(kw, kh);
                }
            }
            for (var i = 0; i < this.Slides.length; ++i) {
                this.Slides[i].changeSize(kw, kh);
            }
            editor.asc_fireCallback("asc_onPresentationSize", this.Width, this.Height);
            if (b_is_on) {
                History.TurnOn();
            }
            break;
        case historyitem_Presenattion_AddSlideMaster:
            this.slideMasters.splice(Data.pos, 0, Data.master);
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
        return;
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
        this.Slides[this.CurPage].graphicObjects.Hyperlink_Add(HyperProps);
        this.Recalculate();
        this.Document_UpdateInterfaceState();
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },
    Hyperlink_Modify: function (HyperProps) {
        this.Slides[this.CurPage].graphicObjects.Hyperlink_Modify(HyperProps);
        this.Recalculate();
        this.Document_UpdateInterfaceState();
        this.Document_UpdateSelectionState();
        this.Document_UpdateInterfaceState();
    },
    Hyperlink_Remove: function () {
        this.Slides[this.CurPage].graphicObjects.Hyperlink_Remove();
        this.Recalculate();
        this.Document_UpdateInterfaceState();
    },
    Hyperlink_CanAdd: function (bCheckInHyperlink) {
        if (this.Slides[this.CurPage]) {
            return this.Slides[this.CurPage].graphicObjects.Hyperlink_CanAdd(bCheckInHyperlink);
        }
        return false;
    },
    canGroup: function () {
        if (this.Slides[this.CurPage]) {
            return this.Slides[this.CurPage].graphicObjects.canGroup();
        }
        return false;
    },
    canUnGroup: function () {
        if (this.Slides[this.CurPage]) {
            return this.Slides[this.CurPage].graphicObjects.canUnGroup();
        }
        return false;
    },
    alignLeft: function () {
        if (this.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.Slides[this.CurPage].alignLeft();
            this.Recalculate();
            this.Document_UpdateUndoRedoState();
        }
    },
    alignRight: function () {
        if (this.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.Slides[this.CurPage].alignRight();
            this.Recalculate();
            this.Document_UpdateUndoRedoState();
        }
    },
    alignTop: function () {
        if (this.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.Slides[this.CurPage].alignTop();
            this.Recalculate();
            this.Document_UpdateUndoRedoState();
        }
    },
    alignBottom: function () {
        if (this.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.Slides[this.CurPage].alignBottom();
            this.Recalculate();
            this.Document_UpdateUndoRedoState();
        }
    },
    alignCenter: function () {
        if (this.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.Slides[this.CurPage].alignCenter();
            this.Recalculate();
            this.Document_UpdateUndoRedoState();
        }
    },
    alignMiddle: function () {
        if (this.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.Slides[this.CurPage].alignMiddle();
            this.Recalculate();
            this.Document_UpdateUndoRedoState();
        }
    },
    distributeHor: function () {
        if (this.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.Slides[this.CurPage].distributeHor();
            this.Recalculate();
            this.Document_UpdateUndoRedoState();
        }
    },
    distributeVer: function () {
        if (this.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.Slides[this.CurPage].distributeVer();
            this.Recalculate();
            this.Document_UpdateUndoRedoState();
        }
    },
    bringToFront: function () {
        if (this.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.Slides[this.CurPage].bringToFront();
            this.Recalculate();
            this.Document_UpdateUndoRedoState();
        }
    },
    bringForward: function () {
        if (this.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.Slides[this.CurPage].bringForward();
            this.Recalculate();
            this.Document_UpdateUndoRedoState();
        }
    },
    sendToBack: function () {
        if (this.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.Slides[this.CurPage].sendToBack();
            this.Recalculate();
            this.Document_UpdateUndoRedoState();
        }
    },
    bringBackward: function () {
        if (this.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.Slides[this.CurPage].bringBackward();
            this.Recalculate();
            this.Document_UpdateUndoRedoState();
        }
    },
    Hyperlink_Check: function (bCheckEnd) {
        return this.Slides[this.CurPage].graphicObjects.Hyperlink_Check(bCheckEnd);
    },
    addNextSlide: function (layoutIndex) {
        History.Create_NewPoint();
        if (! (this.CurPage === -1)) {
            var cur_slide = this.Slides[this.CurPage];
            var new_slide, layout;
            layout = isRealNumber(layoutIndex) ? (cur_slide.Layout.Master.sldLayoutLst[layoutIndex] ? cur_slide.Layout.Master.sldLayoutLst[layoutIndex] : cur_slide.Layout) : cur_slide.Layout.Master.getMatchingLayout(cur_slide.Layout.type, cur_slide.Layout.matchingName, cur_slide.Layout.cSld.name);
            new_slide = new Slide(this, layout, this.CurPage + 1);
            for (var i = 0; i < layout.cSld.spTree.length; ++i) {
                if (layout.cSld.spTree[i].isPlaceholder()) {
                    var _ph_type = layout.cSld.spTree[i].getPhType();
                    if (_ph_type != phType_dt && _ph_type != phType_ftr && _ph_type != phType_hdr && _ph_type != phType_sldNum) {
                        var sp = new CShape(new_slide);
                        layout.cSld.spTree[i].copy2(sp);
                        new_slide.addToSpTreeToPos(new_slide.cSld.spTree.length, sp);
                    }
                }
            }
            new_slide.setSlideNum(this.CurPage + 1);
            new_slide.Width = this.Width;
            new_slide.Height = this.Height;
            new_slide.recalculate();
            this.insertSlide(this.CurPage + 1, new_slide);
            for (var i = this.CurPage + 2; i < this.Slides.length; ++i) {
                this.DrawingDocument.OnRecalculatePage(i, this.Slides[i]);
                this.Slides[i].setSlideNum(i);
            }
            this.DrawingDocument.OnRecalculatePage(this.CurPage + 1, this.Slides[this.CurPage + 1]);
            this.DrawingDocument.OnEndRecalculate();
            this.DrawingDocument.m_oWordControl.GoToPage(this.CurPage + 1);
        } else {
            var master = this.slideMasters[0];
            var layout = master.sldLayoutLst[0];
            var new_slide = new Slide(this, layout, this.CurPage + 1);
            for (var i = 0; i < layout.cSld.spTree.length; ++i) {
                if (layout.cSld.spTree[i].isPlaceholder()) {
                    var sp = new CShape(new_slide);
                    layout.cSld.spTree[i].copy2(sp);
                    new_slide.addToSpTreeToPos(new_slide.cSld.spTree.length, sp);
                }
            }
            new_slide.setSlideNum(this.CurPage + 1);
            new_slide.Width = this.Width;
            new_slide.Height = this.Height;
            new_slide.recalculate();
            this.insertSlide(this.CurPage + 1, new_slide);
            for (var i = this.CurPage + 2; i < this.Slides.length; ++i) {
                this.DrawingDocument.OnRecalculatePage(i, this.Slides[i]);
                this.Slides[i].setSlideNum(i);
            }
            this.DrawingDocument.OnRecalculatePage(this.CurPage + 1, this.Slides[this.CurPage + 1]);
            this.DrawingDocument.OnEndRecalculate();
            this.DrawingDocument.m_oWordControl.GoToPage(this.CurPage + 1);
        }
        this.Document_UpdateInterfaceState();
    },
    shiftSlides: function (pos, array) {
        History.Create_NewPoint();
        array.sort(function (a, b) {
            return a - b;
        });
        var deleted = [];
        for (var i = array.length - 1; i > -1; --i) {
            deleted.push(this.removeSlide(array[i]));
        }
        for (i = 0; i < array.length; ++i) {
            if (array[i] < pos) {
                --pos;
            } else {
                break;
            }
        }
        var _selectedPage = this.CurPage;
        var _newSelectedPage = 0;
        deleted.reverse();
        for (var i = 0; i < deleted.length; ++i) {
            this.insertSlide(pos + i, deleted[i]);
        }
        for (i = 0; i < this.Slides.length; ++i) {
            if (this.Slides[i].num == _selectedPage) {
                _newSelectedPage = i;
            }
            this.Slides[i].changeNum(i);
        }
        this.Document_UpdateUndoRedoState();
        this.DrawingDocument.OnEndRecalculate();
        this.DrawingDocument.UpdateThumbnailsAttack();
        this.DrawingDocument.m_oWordControl.GoToPage(_newSelectedPage);
    },
    deleteSlides: function (array) {
        if (array.length > 0 && this.Document_Is_SelectionLocked(changestype_RemoveSlide, null) === false) {
            History.Create_NewPoint();
            var oldLen = this.Slides.length;
            array.sort(function (a, b) {
                return a - b;
            });
            for (var i = array.length - 1; i > -1; --i) {
                this.removeSlide(array[i]);
            }
            for (i = 0; i < this.Slides.length; ++i) {
                this.Slides[i].changeNum(i);
            }
            if (array[array.length - 1] != oldLen - 1) {
                this.DrawingDocument.m_oWordControl.GoToPage(array[array.length - 1] + 1 - array.length);
            } else {
                this.DrawingDocument.m_oWordControl.GoToPage(this.Slides.length - 1);
            }
            this.Document_UpdateUndoRedoState();
            this.DrawingDocument.OnEndRecalculate();
            this.DrawingDocument.UpdateThumbnailsAttack();
        }
    },
    changeLayout: function (_array, MasterLayouts, layout_index) {
        if (this.Document_Is_SelectionLocked(changestype_Layout) === false) {
            History.Create_NewPoint();
            var layout = MasterLayouts.sldLayoutLst[layout_index];
            for (var i = 0; i < _array.length; ++i) {
                var slide = this.Slides[_array[i]];
                for (var j = slide.cSld.spTree.length - 1; j > -1; --j) {
                    if (slide.cSld.spTree[j].isEmptyPlaceholder && slide.cSld.spTree[j].isEmptyPlaceholder()) {
                        slide.removeFromSpTreeById(slide.cSld.spTree[j].Get_Id());
                    }
                }
                for (var j = 0; j < layout.cSld.spTree.length; ++j) {
                    if (layout.cSld.spTree[j].isPlaceholder()) {
                        var _ph_type = layout.cSld.spTree[j].getPhType();
                        if (_ph_type != phType_dt && _ph_type != phType_ftr && _ph_type != phType_hdr && _ph_type != phType_sldNum) {
                            var matching_shape = slide.getMatchingShape(layout.cSld.spTree[j].getPlaceholderType(), layout.cSld.spTree[j].getPlaceholderIndex(), layout.cSld.spTree[j].getIsSingleBody ? layout.cSld.spTree[j].getIsSingleBody() : false);
                            if (matching_shape == null && layout.cSld.spTree[j].copy2) {
                                var sp = new CShape(slide);
                                layout.cSld.spTree[j].copy2(sp);
                                slide.addToSpTreeToPos(slide.cSld.spTree.length, sp);
                            }
                        }
                    }
                }
                slide.setLayout(layout);
                slide.recalcAll();
                slide.recalculate();
                this.DrawingDocument.OnRecalculatePage(_array[i], this.Slides[_array[i]]);
            }
            this.DrawingDocument.OnEndRecalculate();
            this.Document_UpdateInterfaceState();
        }
    },
    changeTheme: function (themeInfo) {
        if (this.viewMode === true) {
            return;
        }
        if (this.startChangeThemeTimeOutId != null) {
            clearTimeout(this.startChangeThemeTimeOutId);
        }
        if (this.backChangeThemeTimeOutId != null) {
            clearTimeout(this.backChangeThemeTimeOutId);
        }
        if (this.forwardChangeThemeTimeOutId != null) {
            clearTimeout(this.forwardChangeThemeTimeOutId);
        }
        this.addSlideMaster(this.slideMasters.length, themeInfo.Master);
        var _new_master = themeInfo.Master;
        _new_master.presentation = this;
        var _master_width = _new_master.Width;
        var _master_height = _new_master.Height;
        if (_master_height !== this.Height || _master_width !== this.Width) {
            var kw = this.Width / _master_width;
            var kh = this.Height / _master_height;
            themeInfo.Master.changeSize(kw, kh);
            for (var i = 0; i < themeInfo.Master.sldLayoutLst.length; ++i) {
                themeInfo.Master.sldLayoutLst[i].changeSize(kw, kh);
            }
        }
        _new_master.recalculate();
        var _arr_slides = this.Slides;
        var _slides_array = [];
        for (var _index = 0; _index < this.Slides.length; ++_index) {
            _slides_array.push(this.Slides[_index]);
        }
        var _current_slide = _arr_slides[this.CurPage];
        var _presentation = this;
        var _arr_old_layouts = [];
        var _slide_index;
        for (_slide_index = 0; _slide_index < _arr_slides.length; ++_slide_index) {
            _arr_old_layouts[_slide_index] = _arr_slides[_slide_index].Layout;
        }
        var _arr_new_layouts = [];
        var _new_layout;
        for (_slide_index = 0; _slide_index < this.Slides.length; ++_slide_index) {
            if (_arr_slides[_slide_index].Layout.calculatedType == null) {
                _arr_slides[_slide_index].Layout.calculateType();
            }
            _new_layout = _new_master.getMatchingLayout(_arr_slides[_slide_index].Layout.type, _arr_slides[_slide_index].Layout.matchingName, _arr_slides[_slide_index].Layout.cSld.name, true);
            if (!isRealObject(_new_layout)) {
                _new_layout = _new_master.sldLayoutLst[0];
            }
            _arr_new_layouts.push(_new_layout);
            this.Slides[_slide_index].setLayout(_new_layout);
            this.Slides[_slide_index].checkNoTransformPlaceholder();
        }
        this.resetStateCurSlide();
        this.startChangeThemeTimeOutId = setTimeout(function () {
            redrawSlide(_current_slide, _presentation, _arr_new_layouts, 0, _slides_array);
        },
        30);
        this.Document_UpdateUndoRedoState();
    },
    changeSlideSize: function (width, height) {
        if (this.Document_Is_SelectionLocked(changestype_SlideSize) === false) {
            History.Create_NewPoint();
            History.Add(this, {
                Type: historyitem_Presenattion_SlideSize,
                oldW: this.Width,
                oldH: this.Height,
                newW: width,
                newH: height
            });
            var kw = width / this.Width;
            var kh = height / this.Height;
            this.Width = width;
            this.Height = height;
            var b_is_on = History.Is_On();
            if (b_is_on) {
                History.TurnOff();
            }
            for (var i = 0; i < this.slideMasters.length; ++i) {
                this.slideMasters[i].changeSize(kw, kh);
                var master = this.slideMasters[i];
                for (var j = 0; j < master.sldLayoutLst.length; ++j) {
                    master.sldLayoutLst[j].changeSize(kw, kh);
                }
            }
            for (var i = 0; i < this.Slides.length; ++i) {
                this.Slides[i].changeSize(kw, kh);
            }
            if (b_is_on) {
                History.TurnOn();
            }
            this.Recalculate();
            editor.asc_fireCallback("asc_onPresentationSize", this.Width, this.Height);
        }
    },
    changeColorScheme: function (colorScheme) {
        if (this.viewMode === true) {
            return;
        }
        if (! (this.Document_Is_SelectionLocked(changestype_Theme) === false)) {
            return;
        }
        if (! (colorScheme instanceof ClrScheme)) {
            return;
        }
        History.Create_NewPoint();
        var _slides_array = [];
        for (var _index = 0; _index < this.Slides.length; ++_index) {
            _slides_array.push(this.Slides[_index]);
        }
        var _slides = this.Slides;
        var _slide_index;
        var _slide_count = _slides.length;
        var _cur_slide;
        var _cur_theme;
        var _old_color_scheme;
        var recalc_map = {};
        for (_slide_index = 0; _slide_index < _slide_count; ++_slide_index) {
            _cur_slide = _slides[_slide_index];
            _cur_theme = _cur_slide.Layout.Master.Theme;
            recalc_map[_cur_slide.Layout.Id] = _cur_slide.Layout;
            recalc_map[_cur_slide.Layout.Master.Id] = _cur_slide.Layout.Master;
            if (!_cur_theme.themeElements.clrScheme.isIdentical(colorScheme)) {
                _old_color_scheme = _cur_theme.themeElements.clrScheme;
                _cur_theme.changeColorScheme(colorScheme.createDuplicate());
            }
        }
        for (var key in recalc_map) {
            if (recalc_map[key].recalcAll) {
                recalc_map[key].recalcAll();
            }
            if (recalc_map[key].recalculate) {
                recalc_map[key].recalculate();
            }
        }
        var _start_slide = this.Slides[this.CurPage];
        var _presentation = this;
        setTimeout(function () {
            recalculateSlideAfterChangeThemeColors(_start_slide, _presentation, 0, _slides_array);
        },
        30);
        this.Document_UpdateUndoRedoState();
    },
    removeSlide: function (pos) {
        if (isRealNumber(pos) && pos > -1 && pos < this.Slides.length) {
            History.Add(this, {
                Type: historyitem_Presenattion_RemoveSlide,
                Pos: pos,
                Id: this.Slides[pos].Get_Id()
            });
            return this.Slides.splice(pos, 1)[0];
        }
        return null;
    },
    insertSlide: function (pos, slide) {
        History.Add(this, {
            Type: historyitem_Presenattion_AddSlide,
            Pos: pos,
            Id: slide.Get_Id()
        });
        this.Slides.splice(pos, 0, slide);
        slide.setSlideSize(this.Width, this.Height);
        editor.WordControl.m_oLogicDocument.recalcMap[slide.Id] = slide;
    },
    moveSlides: function (slidesIndexes, pos) {
        var insert_pos = pos;
        var removed_slides = [];
        for (var i = slidesIndexes.length - 1; i > -1; --i) {
            removed_slides.push(this.removeSlide(slidesIndexes[i]));
            if (slidesIndexes[i] < pos) {
                --insert_pos;
            }
        }
        removed_slides.reverse();
        for (i = 0; i < removed_slides.length; ++i) {
            this.insertSlide(insert_pos + i, removed_slides[i]);
        }
    },
    changeTheme2: function (themeInfo, arrInd) {
        if (this.viewMode === true) {
            return;
        }
        if (this.startChangeThemeTimeOutId != null) {
            clearTimeout(this.startChangeThemeTimeOutId);
        }
        if (this.backChangeThemeTimeOutId != null) {
            clearTimeout(this.backChangeThemeTimeOutId);
        }
        if (this.forwardChangeThemeTimeOutId != null) {
            clearTimeout(this.forwardChangeThemeTimeOutId);
        }
        this.themes.push(themeInfo.Theme);
        this.slideMasters.push(themeInfo.Master);
        this.slideLayouts = this.slideLayouts.concat(themeInfo.Layouts);
        var _new_master = themeInfo.Master;
        _new_master.presentation = this;
        var _master_width = _new_master.Width;
        var _master_height = _new_master.Height;
        if (_master_height !== this.Height || _master_width !== this.Width) {
            var kw = this.Width / _master_width;
            var kh = this.Height / _master_height;
            themeInfo.Master.changeSize(kw, kh);
            for (var i = 0; i < themeInfo.Master.sldLayoutLst.length; ++i) {
                themeInfo.Master.sldLayoutLst[i].changeSize(kw, kh);
            }
        }
        _new_master.recalculate();
        var _arr_slides = this.Slides;
        var _slides_array = [];
        for (var _index = 0; _index < arrInd.length; ++_index) {
            _slides_array.push(this.Slides[arrInd[_index]]);
        }
        var _current_slide = this.Slides[this.CurPage];
        var _presentation = this;
        var _slide_index;
        var _arr_new_layouts = [];
        var _new_layout;
        for (_slide_index = 0; _slide_index < _slides_array.length; ++_slide_index) {
            if (_slides_array[_slide_index].Layout.calculatedType == null) {
                _slides_array[_slide_index].Layout.calculateType();
            }
            _new_layout = _new_master.getMatchingLayout(_slides_array[_slide_index].Layout.type, _slides_array[_slide_index].Layout.matchingName, _slides_array[_slide_index].Layout.cSld.name, true);
            if (_new_layout === null) {
                _new_layout = _new_master.sldLayoutLst[0];
            }
            _arr_new_layouts.push(_new_layout);
            _slides_array[_slide_index].setLayout(_new_layout);
            _slides_array[_slide_index].checkNoTransformPlaceholder();
        }
        this.resetStateCurSlide();
        var start = this.CurPage;
        for (var i = 0; i < _slides_array.length; ++i) {
            if (_slides_array[i] == this.Slides[this.CurPage]) {
                start = i;
            }
        }
        var _this = this;
        this.startChangeThemeTimeOutId = setTimeout(function () {
            redrawSlide2(_current_slide, _presentation, arrInd, start, _arr_new_layouts, 0, _this.Slides);
        },
        30);
        this.Document_UpdateUndoRedoState();
    },
    Document_Is_SelectionLocked: function (CheckType, AdditionalData) {
        if (true === CollaborativeEditing.Get_GlobalLock()) {
            return true;
        }
        if (this.Slides.length === 0) {
            return false;
        }
        var cur_slide = this.Slides[this.CurPage];
        var slide_id = cur_slide.deleteLock.Get_Id();
        CollaborativeEditing.OnStart_CheckLock();
        if (CheckType === changestype_Drawing_Props) {
            if (cur_slide.deleteLock.Lock.Type !== locktype_Mine && cur_slide.deleteLock.Lock.Type !== locktype_None) {
                return true;
            }
            var selected_objects = cur_slide.graphicObjects.selectedObjects;
            for (var i = 0; i < selected_objects.length; ++i) {
                var check_obj = {
                    "type": c_oAscLockTypeElemPresentation.Object,
                    "slideId": slide_id,
                    "objId": selected_objects[i].Get_Id(),
                    "guid": selected_objects[i].Get_Id()
                };
                selected_objects[i].Lock.Check(check_obj);
            }
        }
        if (CheckType === changestype_AddShape || CheckType === changestype_AddComment) {
            if (cur_slide.deleteLock.Lock.Type !== locktype_Mine && cur_slide.deleteLock.Lock.Type !== locktype_None) {
                return true;
            }
            var check_obj = {
                "type": c_oAscLockTypeElemPresentation.Object,
                "slideId": slide_id,
                "objId": AdditionalData.Get_Id(),
                "guid": AdditionalData.Get_Id()
            };
            AdditionalData.Lock.Check(check_obj);
        }
        if (CheckType === changestype_AddShapes) {
            if (cur_slide.deleteLock.Lock.Type !== locktype_Mine && cur_slide.deleteLock.Lock.Type !== locktype_None) {
                return true;
            }
            for (var i = 0; i < AdditionalData.length; ++i) {
                var check_obj = {
                    "type": c_oAscLockTypeElemPresentation.Object,
                    "slideId": slide_id,
                    "objId": AdditionalData[i].Get_Id(),
                    "guid": AdditionalData[i].Get_Id()
                };
                AdditionalData[i].Lock.Check(check_obj);
            }
        }
        if (CheckType === changestype_MoveComment) {
            var comment = g_oTableId.Get_ById(AdditionalData);
            if (isRealObject(comment)) {
                var slides = this.Slides;
                var check_slide = null;
                for (var i = 0; i < slides.length; ++i) {
                    if (slides[i].slideComments) {
                        var comments = slides[i].slideComments.comments;
                        for (var j = 0; j < comments.length; ++j) {
                            if (comments[j] === comment) {
                                check_slide = slides[i];
                                break;
                            }
                        }
                        if (j < comments.length) {
                            break;
                        }
                    }
                }
                if (isRealObject(check_slide)) {
                    if (check_slide.deleteLock.Lock.Type !== locktype_Mine && check_slide.deleteLock.Lock.Type !== locktype_None) {
                        return true;
                    }
                    var check_obj = {
                        "type": c_oAscLockTypeElemPresentation.Object,
                        "slideId": slide_id,
                        "objId": comment.Get_Id(),
                        "guid": comment.Get_Id()
                    };
                    comment.Lock.Check(check_obj);
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }
        if (CheckType === changestype_SlideBg) {
            var selected_slides = editor.WordControl.Thumbnails.GetSelectedArray();
            for (var i = 0; i < selected_slides.length; ++i) {
                var check_obj = {
                    "type": c_oAscLockTypeElemPresentation.Slide,
                    "val": this.Slides[selected_slides[i]].backgroundLock.Get_Id(),
                    "guid": this.Slides[selected_slides[i]].backgroundLock.Get_Id()
                };
                this.Slides[selected_slides[i]].backgroundLock.Lock.Check(check_obj);
            }
        }
        if (CheckType === changestype_SlideTiming) {
            var selected_slides = editor.WordControl.Thumbnails.GetSelectedArray();
            for (var i = 0; i < selected_slides.length; ++i) {
                var check_obj = {
                    "type": c_oAscLockTypeElemPresentation.Slide,
                    "val": this.Slides[selected_slides[i]].timingLock.Get_Id(),
                    "guid": this.Slides[selected_slides[i]].timingLock.Get_Id()
                };
                this.Slides[selected_slides[i]].timingLock.Lock.Check(check_obj);
            }
        }
        if (CheckType === changestype_Text_Props) {
            if (cur_slide.deleteLock.Lock.Type !== locktype_Mine && cur_slide.deleteLock.Lock.Type !== locktype_None) {
                return true;
            }
            var selected_objects = cur_slide.graphicObjects.selectedObjects;
            for (var i = 0; i < selected_objects.length; ++i) {
                if (typeof selected_objects[i].applyAllTextProps === "function") {
                    var check_obj = {
                        "type": c_oAscLockTypeElemPresentation.Object,
                        "slideId": slide_id,
                        "objId": selected_objects[i].Get_Id(),
                        "guid": selected_objects[i].Get_Id()
                    };
                    selected_objects[i].Lock.Check(check_obj);
                }
            }
        }
        if (CheckType === changestype_RemoveSlide) {
            var selected_slides = editor.WordControl.Thumbnails.GetSelectedArray();
            for (var i = 0; i < selected_slides.length; ++i) {
                if (this.Slides[selected_slides[i]].isLockedObject()) {
                    return true;
                }
            }
            for (var i = 0; i < selected_slides.length; ++i) {
                var check_obj = {
                    "type": c_oAscLockTypeElemPresentation.Slide,
                    "val": this.Slides[selected_slides[i]].deleteLock.Get_Id(),
                    "guid": this.Slides[selected_slides[i]].deleteLock.Get_Id()
                };
                this.Slides[selected_slides[i]].deleteLock.Lock.Check(check_obj);
            }
        }
        if (CheckType === changestype_Theme) {
            var check_obj = {
                "type": c_oAscLockTypeElemPresentation.Slide,
                "val": this.themeLock.Get_Id(),
                "guid": this.themeLock.Get_Id()
            };
            this.themeLock.Lock.Check(check_obj);
        }
        if (CheckType === changestype_Layout) {
            var selected_slides = editor.WordControl.Thumbnails.GetSelectedArray();
            for (var i = 0; i < selected_slides.length; ++i) {
                var check_obj = {
                    "type": c_oAscLockTypeElemPresentation.Slide,
                    "val": this.Slides[selected_slides[i]].layoutLock.Get_Id(),
                    "guid": this.Slides[selected_slides[i]].layoutLock.Get_Id()
                };
                this.Slides[selected_slides[i]].layoutLock.Lock.Check(check_obj);
            }
        }
        if (CheckType === changestype_ColorScheme) {
            var check_obj = {
                "type": c_oAscLockTypeElemPresentation.Slide,
                "val": this.schemeLock.Get_Id(),
                "guid": this.schemeLock.Get_Id()
            };
            this.schemeLock.Lock.Check(check_obj);
        }
        if (CheckType === changestype_SlideSize) {
            var check_obj = {
                "type": c_oAscLockTypeElemPresentation.Slide,
                "val": this.slideSizeLock.Get_Id(),
                "guid": this.slideSizeLock.Get_Id()
            };
            this.slideSizeLock.Lock.Check(check_obj);
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
        case historyitem_Document_DefaultTab:
            Writer.WriteDouble(Data.New);
            break;
        case historyitem_Presenattion_RemoveSlide:
            case historyitem_Presenattion_AddSlide:
            var Pos = Data.UseArray ? Data.PosArray[0] : Data.Pos;
            Writer.WriteLong(Pos);
            Writer.WriteString2(Data.Id);
            break;
        case historyitem_Presenattion_SlideSize:
            Writer.WriteDouble(Data.newW);
            Writer.WriteDouble(Data.newH);
            break;
        case historyitem_Presenattion_AddSlideMaster:
            Writer.WriteLong(Data.pos);
            Writer.WriteString2(Data.master.Get_Id());
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
        case historyitem_Presenattion_AddSlide:
            var pos = this.m_oContentChanges.Check(contentchanges_Add, Reader.GetLong());
            var Id = Reader.GetString2();
            this.Slides.splice(pos, 0, g_oTableId.Get_ById(Id));
            this.recalcMap[this.Slides[pos].Get_Id()] = this.Slides[pos];
            CollaborativeEditing.Add_ChangedClass(this);
            break;
        case historyitem_Presenattion_RemoveSlide:
            var pos = Reader.GetLong();
            Reader.GetString2();
            var ChangesPos = this.m_oContentChanges.Check(contentchanges_Remove, pos);
            if (false === ChangesPos) {
                break;
            }
            this.slidesToUnlock.push(ChangesPos);
            this.Slides.splice(ChangesPos, 1);
            break;
        case historyitem_Presenattion_SlideSize:
            var w = Reader.GetDouble();
            var h = Reader.GetDouble();
            var kw = w / this.Width;
            var kh = h / this.Height;
            this.Width = w;
            this.Height = h;
            var b_is_on = History.Is_On();
            if (b_is_on) {
                History.TurnOff();
            }
            CollaborativeEditing.ScaleX = kw;
            CollaborativeEditing.ScaleY = kh;
            for (var i = 0; i < this.slideMasters.length; ++i) {
                this.slideMasters[i].changeSize(kw, kh);
                var master = this.slideMasters[i];
                for (var j = 0; j < master.sldLayoutLst.length; ++j) {
                    master.sldLayoutLst[j].changeSize(kw, kh);
                }
            }
            for (var i = 0; i < this.Slides.length; ++i) {
                this.Slides[i].changeSize(kw, kh);
            }
            editor.asc_fireCallback("asc_onPresentationSize", this.Width, this.Height);
            if (b_is_on) {
                History.TurnOn();
            }
            break;
        case historyitem_Presenattion_AddSlideMaster:
            var pos = Reader.GetLong();
            var id = Reader.GetString2();
            this.slideMasters.splice(pos, 0, g_oTableId.Get_ById(id));
            this.bGoToPage = true;
            break;
        case historyitem_Document_DefaultTab:
            Default_Tab_Stop = Reader.GetDouble();
            break;
        }
        return true;
    },
    Get_SelectionState2: function () {
        var State = new Object();
        return State;
    },
    Set_SelectionState2: function (State) {},
    Add_Comment: function (CommentData) {
        if (this.Slides[this.CurPage]) {
            History.Create_NewPoint();
            var Comment = new CComment(this.Comments, CommentData);
            Comment.selected = true;
            var positionX, positionY;
            var slide = this.Slides[this.CurPage];
            var selected_objects;
            if (slide.graphicObjects.State.group) {
                selected_objects = slide.graphicObjects.State.group.selectedObjects;
            } else {
                selected_objects = slide.graphicObjects.selectedObjects;
            }
            if (selected_objects.length > 0) {
                var last_object = selected_objects[selected_objects.length - 1];
                Comment.setPosition(last_object.x + last_object.extX, last_object.y);
            } else {
                Comment.setPosition(this.Slides[this.CurPage].commentX, this.Slides[this.CurPage].commentY);
            }
            var Flags = 0;
            var dd = editor.WordControl.m_oDrawingDocument;
            var W = dd.GetCommentWidth(Flags);
            var H = dd.GetCommentHeight(Flags);
            this.Slides[this.CurPage].commentX += W;
            this.Slides[this.CurPage].commentY += H;
            if (this.Document_Is_SelectionLocked(changestype_AddComment, Comment) === false) {
                for (var i = this.Slides[this.CurPage].slideComments.comments.length - 1; i > -1; --i) {
                    this.Slides[this.CurPage].slideComments.comments[i].selected = false;
                }
                this.Slides[this.CurPage].addComment(Comment);
                this.DrawingDocument.OnRecalculatePage(this.CurPage, this.Slides[this.CurPage]);
                this.DrawingDocument.OnEndRecalculate();
                return Comment;
            } else {
                this.Document_Undo();
            }
        }
    },
    Change_Comment: function (Id, CommentData) {
        if (this.Document_Is_SelectionLocked(changestype_MoveComment, Id) === false) {
            History.Create_NewPoint();
            var comment = g_oTableId.Get_ById(Id);
            if (isRealObject(comment)) {
                var slides = this.Slides;
                var check_slide = null;
                var slide_num = null;
                for (var i = 0; i < slides.length; ++i) {
                    if (slides[i].slideComments) {
                        var comments = slides[i].slideComments.comments;
                        for (var j = 0; j < comments.length; ++j) {
                            if (comments[j] === comment) {
                                check_slide = slides[i];
                                slide_num = i;
                                break;
                            }
                        }
                        if (j < comments.length) {
                            break;
                        }
                    }
                }
                if (isRealObject(check_slide)) {
                    this.DrawingDocument.m_oWordControl.GoToPage(slide_num);
                    this.Slides[this.CurPage].changeComment(Id, CommentData);
                    editor.sync_ChangeCommentData(Id, CommentData);
                    this.Recalculate();
                } else {
                    return true;
                }
            }
        }
    },
    Remove_Comment: function (Id, bSendEvent) {
        if (null === Id) {
            return;
        }
        for (var i = 0; i < this.Slides.length; ++i) {
            var comments = this.Slides[i].slideComments.comments;
            for (var j = 0; j < comments.length; ++j) {
                if (comments[j].Id === Id) {
                    this.DrawingDocument.m_oWordControl.GoToPage(i);
                    this.Slides[i].removeComment(Id);
                    if (true === bSendEvent) {
                        editor.sync_RemoveComment(Id);
                    }
                    return;
                }
            }
        }
        editor.sync_HideComment();
    },
    CanAdd_Comment: function () {
        return true;
    },
    Select_Comment: function (Id) {},
    Show_Comment: function (Id) {
        for (var i = 0; i < this.Slides.length; ++i) {
            var comments = this.Slides[i].slideComments.comments;
            for (var j = 0; j < comments.length; ++j) {
                if (comments[j].Id === Id) {
                    this.DrawingDocument.m_oWordControl.GoToPage(i);
                    var Coords = this.DrawingDocument.ConvertCoordsToCursorWR_Comment(comments[j].x, comments[j].y, i);
                    this.Slides[i].graphicObjects.showComment(Id, Coords.X, Coords.Y);
                    return;
                }
            }
        }
        editor.sync_HideComment();
    },
    Show_Comments: function () {},
    Hide_Comments: function () {
        this.Slides[this.CurPage].graphicObjects.hideComment();
    },
    TextBox_Put: function (sText) {
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
    },
    StartAddShape: function (preset, _is_apply) {
        var elements = this.Slides[this.CurPage].graphicObjects;
        if (! (_is_apply === false)) {
            elements.CurPreset = preset;
            switch (preset) {
            case "spline":
                elements.changeCurrentState(new SplineBezierState(elements, this.Slides[this.CurPage]));
                break;
            case "polyline1":
                elements.changeCurrentState(new PolyLineAddState(elements, this.Slides[this.CurPage]));
                break;
            case "polyline2":
                elements.changeCurrentState(new AddPolyLine2State(elements, this.Slides[this.CurPage]));
                break;
            default:
                elements.changeCurrentState(new StartTrackNewShapeState(elements, this.Slides[this.CurPage], preset));
            }
        } else {
            elements.resetSelectionState();
            this.DrawingDocument.m_oWordControl.OnUpdateOverlay();
            editor.sync_EndAddShape();
        }
        this.CurPos.Type = docpostype_Content;
    },
    CalculateComments: function () {
        this.CommentAuthors = {};
        var _AuthorId = 0;
        var _slidesCount = this.Slides.length;
        var _uniIdSplitter = ";__teamlab__;";
        for (var _sldIdx = 0; _sldIdx < _slidesCount; _sldIdx++) {
            this.Slides[_sldIdx].writecomments = [];
            var _comments = this.Slides[_sldIdx].slideComments.comments;
            var _commentsCount = _comments.length;
            for (var i = 0; i < _commentsCount; i++) {
                var _data = _comments[i].Data;
                var _commId = 0;
                var _autID = _data.m_sUserId + _uniIdSplitter + _data.m_sUserName;
                var _author = this.CommentAuthors[_autID];
                if (!_author) {
                    this.CommentAuthors[_autID] = new CCommentAuthor();
                    _author = this.CommentAuthors[_autID];
                    _author.Name = _data.m_sUserName;
                    _author.Calculate();
                    _AuthorId++;
                    _author.Id = _AuthorId;
                }
                _author.LastId++;
                _commId = _author.LastId;
                var _new_data = new CWriteCommentData();
                _new_data.Data = _data;
                _new_data.WriteAuthorId = _author.Id;
                _new_data.WriteCommentId = _commId;
                _new_data.WriteParentAuthorId = 0;
                _new_data.WriteParentCommentId = 0;
                _new_data.x = _comments[i].x;
                _new_data.y = _comments[i].y;
                _new_data.Calculate();
                this.Slides[_sldIdx].writecomments.push(_new_data);
                var _comments2 = _data.m_aReplies;
                var _commentsCount2 = _comments2.length;
                for (var j = 0; j < _commentsCount2; j++) {
                    var _data2 = _comments2[j];
                    var _autID2 = _data2.m_sUserId + _uniIdSplitter + _data2.m_sUserName;
                    var _author2 = this.CommentAuthors[_autID2];
                    if (!_author2) {
                        this.CommentAuthors[_autID2] = new CCommentAuthor();
                        _author2 = this.CommentAuthors[_autID2];
                        _author2.Name = _data2.m_sUserName;
                        _author2.Calculate();
                        _AuthorId++;
                        _author2.Id = _AuthorId;
                    }
                    _author2.LastId++;
                    var _new_data2 = new CWriteCommentData();
                    _new_data2.Data = _data2;
                    _new_data2.WriteAuthorId = _author2.Id;
                    _new_data2.WriteCommentId = _author2.LastId;
                    _new_data2.WriteParentAuthorId = _author.Id;
                    _new_data2.WriteParentCommentId = _commId;
                    _new_data2.x = _new_data.x;
                    _new_data2.y = _new_data.y + 136 * (j + 1);
                    _new_data2.Calculate();
                    this.Slides[_sldIdx].writecomments.push(_new_data2);
                }
            }
        }
    }
};