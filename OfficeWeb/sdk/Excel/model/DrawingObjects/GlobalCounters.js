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
var locktype_None = 1;
var locktype_Mine = 2;
var locktype_Other = 3;
var locktype_Other2 = 4;
var locktype_Other3 = 5;
function CLock() {
    this.Type = locktype_None;
    this.UserId = null;
    this.Get_Type = function () {
        return this.Type;
    };
    this.Set_Type = function (NewType, Redraw) {
        if (NewType === locktype_None) {
            this.UserId = null;
        }
        this.Type = NewType;
        if (false != Redraw) {
            var DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
            DrawingDocument.ClearCachePages();
            DrawingDocument.FirePaint();
        }
    };
    this.Check = function (Id) {
        if (this.Type === locktype_Mine) {
            CollaborativeEditing.Add_CheckLock(false);
        } else {
            if (this.Type === locktype_Other || this.Type === locktype_Other2 || this.Type === locktype_Other3) {
                CollaborativeEditing.Add_CheckLock(true);
            } else {
                CollaborativeEditing.Add_CheckLock(Id);
            }
        }
    };
    this.Lock = function (bMine) {
        if (locktype_None === this.Type) {
            if (true === bMine) {
                this.Type = locktype_Mine;
            } else {
                true.Type = locktype_Other;
            }
        }
    };
    this.Is_Locked = function () {
        if (locktype_None != this.Type && locktype_Mine != this.Type) {
            return true;
        }
        return false;
    };
    this.Set_UserId = function (UserId) {
        this.UserId = UserId;
    };
    this.Get_UserId = function () {
        return this.UserId;
    };
    this.Have_Changes = function () {
        if (locktype_Other2 === this.Type || locktype_Other3 === this.Type) {
            return true;
        }
        return false;
    };
}
function CIdCounter() {
    this.m_sUserId = null;
    this.m_bLoad = true;
    this.m_nIdCounterLoad = 0;
    this.m_nIdCounterEdit = 0;
    this.Get_NewId = function () {
        if (true === this.m_bLoad || null === this.m_sUserId) {
            this.m_nIdCounterLoad++;
            return ("" + this.m_nIdCounterLoad);
        } else {
            this.m_nIdCounterEdit++;
            var cur_id = ("" + this.m_sUserId + "_" + this.m_nIdCounterEdit);
            while (isRealObject(g_oTableId.Get_ById(cur_id))) {
                this.m_nIdCounterEdit++;
                cur_id = ("" + this.m_sUserId + "_" + this.m_nIdCounterEdit);
            }
            return cur_id;
        }
    };
    this.Set_UserId = function (sUserId) {
        this.m_sUserId = sUserId;
    };
    this.Set_Load = function (bValue) {
        this.m_bLoad = bValue;
    };
    this.Clear = function () {
        this.m_sUserId = null;
        this.m_bLoad = true;
        this.m_nIdCounterLoad = 0;
        this.m_nIdCounterEdit = 0;
    };
}
function CTableId() {
    this.m_aPairs = {};
    this.m_bTurnOff = false;
    this.Id = g_oIdCounter.Get_NewId();
    this.Add(this, this.Id);
}
CTableId.prototype = {
    Add: function (Class, Id, sheetId) {
        if (false === this.m_bTurnOff && (Class.Write_ToBinary2 || Class === this)) {
            Class.Id = Id;
            this.m_aPairs[Id] = Class;
            if (Class !== this && History instanceof CHistory) {
                History.Add(this, {
                    Type: historyitem_TableId_Add,
                    Id: Id,
                    Class: Class
                });
            }
        }
    },
    Get_ById: function (Id) {
        if ("undefined" != typeof(this.m_aPairs[Id])) {
            return this.m_aPairs[Id];
        }
        return null;
    },
    Get_ByClass: function (Class) {
        if ("undefined" != typeof(Class.Get_Id)) {
            return Class.Get_Id();
        }
        if ("undefined" != typeof(Class.GetId())) {
            return Class.GetId();
        }
        return null;
    },
    Reset_Id: function (Class, Id_new, Id_old) {
        if (Class === this.m_aPairs[Id_old]) {
            delete this.m_aPairs[Id_old];
            this.m_aPairs[Id_new] = Class;
            History.Add(this, {
                Type: historyitem_TableId_Reset,
                Id_new: Id_new,
                Id_old: Id_old
            });
        } else {
            this.Add(Class, Id_new);
        }
    },
    Get_Id: function () {
        return this.Id;
    },
    Undo: function (Data) {},
    Redo: function (type, data) {},
    Read_Class_FromBinary: function (Reader) {
        var ElementType = Reader.GetLong();
        var Element = null;
        this.m_bTurnOff = true;
        switch (ElementType) {
        case historyitem_type_Paragraph:
            Element = new Paragraph();
            break;
        case historyitem_type_TextPr:
            Element = new ParaTextPr();
            break;
        case historyitem_type_Hyperlink:
            Element = new ParaHyperlink();
            break;
        case historyitem_type_Drawing:
            Element = new ParaDrawing();
            break;
        case historyitem_type_Table:
            Element = new CTable();
            break;
        case historyitem_type_TableRow:
            Element = new CTableRow();
            break;
        case historyitem_type_TableCell:
            Element = new CTableCell();
            break;
        case historyitem_type_DocumentContent:
            Element = new CDocumentContent();
            break;
        case historyitem_type_HdrFtr:
            Element = new CHeaderFooter();
            break;
        case historyitem_type_AbstractNum:
            Element = new CAbstractNum();
            break;
        case historyitem_type_Comment:
            Element = new CComment();
            break;
        case historyitem_type_Style:
            Element = new CStyle();
            break;
        case historyitem_type_Math:
            Element = new ParaMath(false);
            break;
        case historyitem_type_MathContent:
            Element = new CMathContent();
            break;
        case historyitem_type_CommentMark:
            Element = new ParaComment();
            break;
        case historyitem_type_ParaRun:
            Element = new ParaRun();
            break;
        case historyitem_type_Section:
            Element = new CSectionPr();
            break;
        case historyitem_type_DefaultShapeDefinition:
            Element = new DefaultShapeDefinition();
            break;
        case historyitem_type_CNvPr:
            Element = new CNvPr();
            break;
        case historyitem_type_NvPr:
            Element = new NvPr();
            break;
        case historyitem_type_Ph:
            Element = new Ph();
            break;
        case historyitem_type_UniNvPr:
            Element = new UniNvPr();
            break;
        case historyitem_type_StyleRef:
            Element = new StyleRef();
            break;
        case historyitem_type_FontRef:
            Element = new FontRef();
            break;
        case historyitem_type_Chart:
            Element = new CChart();
            break;
        case historyitem_type_ChartSpace:
            Element = new CChartSpace();
            break;
        case historyitem_type_Legend:
            Element = new CLegend();
            break;
        case historyitem_type_Layout:
            Element = new CLayout();
            break;
        case historyitem_type_LegendEntry:
            Element = new CLegendEntry();
            break;
        case historyitem_type_PivotFmt:
            Element = new CPivotFmt();
            break;
        case historyitem_type_DLbl:
            Element = new CDLbl();
            break;
        case historyitem_type_Marker:
            Element = new CMarker();
            break;
        case historyitem_type_PlotArea:
            Element = new CPlotArea();
            break;
        case historyitem_type_NumFmt:
            Element = new CNumFmt();
            break;
        case historyitem_type_Scaling:
            Element = new CScaling();
            break;
        case historyitem_type_DTable:
            Element = new CDTable();
            break;
        case historyitem_type_LineChart:
            Element = new CLineChart();
            break;
        case historyitem_type_DLbls:
            Element = new CDLbls();
            break;
        case historyitem_type_UpDownBars:
            Element = new CUpDownBars();
            break;
        case historyitem_type_BarChart:
            Element = new CBarChart();
            break;
        case historyitem_type_BubbleChart:
            Element = new CBubbleChart();
            break;
        case historyitem_type_DoughnutChart:
            Element = new CDoughnutChart();
            break;
        case historyitem_type_OfPieChart:
            Element = new COfPieChart();
            break;
        case historyitem_type_PieChart:
            Element = new CPieChart();
            break;
        case historyitem_type_RadarChart:
            Element = new CRadarChart();
            break;
        case historyitem_type_ScatterChart:
            Element = new CScatterChart();
            break;
        case historyitem_type_StockChart:
            Element = new CStockChart();
            break;
        case historyitem_type_SurfaceChart:
            Element = new CSurfaceChart();
            break;
        case historyitem_type_BandFmt:
            Element = new CBandFmt();
            break;
        case historyitem_type_AreaChart:
            Element = new CAreaChart();
            break;
        case historyitem_type_ScatterSer:
            Element = new CScatterSeries();
            break;
        case historyitem_type_DPt:
            Element = new CDPt();
            break;
        case historyitem_type_ErrBars:
            Element = new CErrBars();
            break;
        case historyitem_type_MinusPlus:
            Element = new CMinusPlus();
            break;
        case historyitem_type_NumLit:
            Element = new CNumLit();
            break;
        case historyitem_type_NumericPoint:
            Element = new CNumericPoint();
            break;
        case historyitem_type_NumRef:
            Element = new CNumRef();
            break;
        case historyitem_type_TrendLine:
            Element = new CTrendLine();
            break;
        case historyitem_type_Tx:
            Element = new CTx();
            break;
        case historyitem_type_StrRef:
            Element = new CStrRef();
            break;
        case historyitem_type_StrCache:
            Element = new CStrCache();
            break;
        case historyitem_type_StrPoint:
            Element = new CStringPoint();
            break;
        case historyitem_type_XVal:
            Element = new CXVal();
            break;
        case historyitem_type_MultiLvlStrRef:
            Element = new CMultiLvlStrRef();
            break;
        case historyitem_type_MultiLvlStrCache:
            Element = new CMultiLvlStrCache();
            break;
        case historyitem_type_StringLiteral:
            Element = new CStringLiteral();
            break;
        case historyitem_type_YVal:
            Element = new CYVal();
            break;
        case historyitem_type_AreaSeries:
            Element = new CAreaSeries();
            break;
        case historyitem_type_Cat:
            Element = new CCat();
            break;
        case historyitem_type_PictureOptions:
            Element = new CPictureOptions();
            break;
        case historyitem_type_RadarSeries:
            Element = new CRadarSeries();
            break;
        case historyitem_type_BarSeries:
            Element = new CBarSeries();
            break;
        case historyitem_type_LineSeries:
            Element = new CLineSeries();
            break;
        case historyitem_type_PieSeries:
            Element = new CPieSeries();
            break;
        case historyitem_type_SurfaceSeries:
            Element = new CSurfaceSeries();
            break;
        case historyitem_type_BubbleSeries:
            Element = new CBubbleSeries();
            break;
        case historyitem_type_ExternalData:
            Element = new CExternalData();
            break;
        case historyitem_type_PivotSource:
            Element = new CPivotSource();
            break;
        case historyitem_type_Protection:
            Element = new CProtection();
            break;
        case historyitem_type_ChartWall:
            Element = new CChartWall();
            break;
        case historyitem_type_View3d:
            Element = new CView3d();
            break;
        case historyitem_type_ChartText:
            Element = new CChartText();
            break;
        case historyitem_type_ShapeStyle:
            Element = new CShapeStyle();
            break;
        case historyitem_type_Xfrm:
            Element = new CXfrm();
            break;
        case historyitem_type_SpPr:
            Element = new CSpPr();
            break;
        case historyitem_type_ClrScheme:
            Element = new ClrScheme();
            break;
        case historyitem_type_ClrMap:
            Element = new ClrMap();
            break;
        case historyitem_type_ExtraClrScheme:
            Element = new ExtraClrScheme();
            break;
        case historyitem_type_FontCollection:
            Element = new FontCollection();
            break;
        case historyitem_type_FontScheme:
            Element = new FontScheme();
            break;
        case historyitem_type_FormatScheme:
            Element = new FmtScheme();
            break;
        case historyitem_type_ThemeElements:
            Element = new ThemeElements();
            break;
        case historyitem_type_HF:
            Element = new HF();
            break;
        case historyitem_type_BgPr:
            Element = new CBgPr();
            break;
        case historyitem_type_Bg:
            Element = new CBg();
            break;
        case historyitem_type_PrintSettings:
            Element = new CPrintSettings();
            break;
        case historyitem_type_HeaderFooterChart:
            Element = new CHeaderFooterChart();
            break;
        case historyitem_type_PageMarginsChart:
            Element = new CPageMarginsChart();
            break;
        case historyitem_type_PageSetup:
            Element = new CPageSetup();
            break;
        case historyitem_type_Shape:
            Element = new CShape();
            break;
        case historyitem_type_DispUnits:
            Element = new CDispUnits();
            break;
        case historyitem_type_GroupShape:
            Element = new CGroupShape();
            break;
        case historyitem_type_ImageShape:
            Element = new CImageShape();
            break;
        case historyitem_type_Geometry:
            Element = new Geometry();
            break;
        case historyitem_type_Path:
            Element = new Path();
            break;
        case historyitem_type_TextBody:
            Element = new CTextBody();
            break;
        case historyitem_type_CatAx:
            Element = new CCatAx();
            break;
        case historyitem_type_ValAx:
            Element = new CValAx();
            break;
        case historyitem_type_WrapPolygon:
            Element = new CWrapPolygon();
            break;
        case historyitem_type_DateAx:
            Element = new CDateAx();
            break;
        case historyitem_type_SerAx:
            Element = new CSerAx();
            break;
        case historyitem_type_Title:
            Element = new CTitle();
            break;
        }
        if (null !== Element) {
            Element.Read_FromBinary2(Reader);
        }
        this.m_bTurnOff = false;
        return Element;
    },
    Save_Changes: function (Data, Writer) {
        Writer.WriteLong(historyitem_type_TableId);
        var Type = Data.Type;
        Writer.WriteLong(Type);
        switch (Type) {
        case historyitem_TableId_Add:
            Writer.WriteString2(Data.Id);
            Data.Class.Write_ToBinary2(Writer);
            break;
        case historyitem_TableId_Reset:
            Writer.WriteString2(Data.Id_new);
            Writer.WriteString2(Data.Id_old);
            break;
        }
    },
    Save_Changes2: function (Data, Writer) {
        return false;
    },
    Load_Changes: function (Reader, Reader2) {
        var ClassType = Reader.GetLong();
        if (historyitem_type_TableId != ClassType) {
            return;
        }
        var Type = Reader.GetLong();
        switch (Type) {
        case historyitem_TableId_Add:
            var Id = Reader.GetString2();
            var Class = this.Read_Class_FromBinary(Reader);
            this.m_aPairs[Id] = Class;
            break;
        case historyitem_TableId_Reset:
            var Id_new = Reader.GetString2();
            var Id_old = Reader.GetString2();
            if ("undefined" != this.m_aPairs[Id_old]) {
                var Class = this.m_aPairs[Id_old];
                delete this.m_aPairs[Id_old];
                this.m_aPairs[Id_new] = Class;
            }
            break;
        }
        return true;
    },
    Unlock: function (Data) {},
    Clear: function () {
        this.m_aPairs = {};
        this.m_bTurnOff = false;
        this.Add(this, g_oIdCounter.Get_NewId());
    }
};
var g_oIdCounter = null;
var g_oTableId = null;
function CCollaborativeEditing() {
    this.m_aLinkData = [];
    this.m_aNewImages = [];
    this.Start_CollaborationEditing = function () {};
    this.Add_User = function (UserId) {};
    this.Find_User = function (UserId) {};
    this.Remove_User = function (UserId) {};
    this.Add_Changes = function (Changes) {};
    this.Add_Unlock = function (LockClass) {};
    this.Add_Unlock2 = function (Lock) {};
    this.Apply_OtherChanges = function () {};
    this.Get_SelfChanges = function () {};
    this.Apply_Changes = function () {};
    this.Send_Changes = function () {};
    this.Release_Locks = function () {};
    this.OnStart_Load_Objects = function () {};
    this.OnEnd_Load_Objects = function () {};
    this.Clear_LinkData = function () {
        this.m_aLinkData.length = 0;
    };
    this.Add_LinkData = function (Class, LinkData) {
        this.m_aLinkData.push({
            Class: Class,
            LinkData: LinkData
        });
    };
    this.Apply_LinkData = function () {
        var Count = this.m_aLinkData.length;
        for (var Index = 0; Index < Count; Index++) {
            var Item = this.m_aLinkData[Index];
            Item.Class.Load_LinkData(Item.LinkData);
        }
        this.Clear_LinkData();
        if (this.m_aNewImages.length > 0) {
            Asc["editor"].ImageLoader.LoadDocumentImages(this.m_aNewImages, null, function () {
                CollaborativeEditing.m_aNewImages.length = 0;
                Asc["editor"]._onShowDrawingObjects();
                var worksheet = Asc["editor"].wb.getWorksheet();
                worksheet && worksheet.objectRender && worksheet.objectRender.controller && worksheet.objectRender.controller.getGraphicObjectProps();
            });
        }
    };
    this.Check_MergeData = function () {};
    this.Get_GlobalLock = function () {};
    this.OnStart_CheckLock = function () {};
    this.Add_CheckLock = function (oItem) {};
    this.OnEnd_CheckLock = function () {};
    this.OnCallback_AskLock = function (result) {};
    this.Reset_NeedLock = function () {};
    this.Add_NeedLock = function (Id, sUser) {};
    this.Remove_NeedLock = function (Id) {};
    this.Lock_NeedLock = function () {};
    this.Clear_NewObjects = function () {};
    this.Add_NewObject = function (Class) {};
    this.OnEnd_ReadForeignChanges = function () {};
    this.Clear_NewImages = function () {
        this.m_aNewImages.length = 0;
    };
    this.Add_NewImage = function (Url) {
        this.m_aNewImages.push(Url);
    };
    this.Add_NewDC = function (Class) {};
    this.Clear_DCChanges = function () {};
    this.Refresh_DCChanges = function () {};
    this.Add_ChangedClass = function (Class) {};
    this.Clear_CollaborativeMarks = function (bRepaint) {};
}
var CollaborativeEditing = new CCollaborativeEditing();