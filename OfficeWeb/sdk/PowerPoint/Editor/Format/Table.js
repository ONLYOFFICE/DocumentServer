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
 var table_Selection_Cell = 0;
var table_Selection_Text = 1;
var table_Selection_Common = 0;
var table_Selection_Border = 1;
var table_Selection_Border_InnerTable = 2;
var type_Table = 2;
function CTableAnchorPosition() {
    this.CalcX = 0;
    this.CalcY = 0;
    this.W = 0;
    this.H = 0;
    this.X = 0;
    this.Y = 0;
    this.Left_Margin = 0;
    this.Right_Margin = 0;
    this.Top_Margin = 0;
    this.Bottom_Margin = 0;
    this.Page_W = 0;
    this.Page_H = 0;
    this.X_min = 0;
    this.Y_min = 0;
    this.X_max = 0;
    this.Y_max = 0;
}
CTableAnchorPosition.prototype = {
    Set_X: function (W, X, Left_Margin, Right_Margin, Page_W, X_min, X_max) {
        this.W = W;
        this.X = X;
        this.Left_Margin = Left_Margin;
        this.Right_Margin = Right_Margin;
        this.Page_W = Page_W;
        this.X_min = X_min;
        this.X_max = X_max;
    },
    Set_Y: function (H, Y, Top_Margin, Bottom_Margin, Page_H, Y_min, Y_max) {
        this.H = H;
        this.Y = Y;
        this.Top_Margin = Top_Margin;
        this.Bottom_Margin = Bottom_Margin;
        this.Page_H = Page_H;
        this.Y_min = Y_min;
        this.Y_max = Y_max;
    },
    Calculate_X: function (RelativeFrom, bAlign, Value) {
        switch (RelativeFrom) {
        case c_oAscHAnchor.Text:
            case c_oAscHAnchor.Margin:
            if (true === bAlign) {
                switch (Value) {
                case c_oAscXAlign.Center:
                    this.CalcX = (this.Left_Margin + this.Right_Margin - this.W) / 2;
                    break;
                case c_oAscXAlign.Inside:
                    case c_oAscXAlign.Outside:
                    case c_oAscXAlign.Left:
                    this.CalcX = this.Left_Margin;
                    break;
                case c_oAscXAlign.Right:
                    this.CalcX = this.Right_Margin - this.W;
                    break;
                }
            } else {
                this.CalcX = this.Left_Margin + Value;
            }
            break;
        case c_oAscHAnchor.Page:
            var W = this.X_max - this.X_min;
            if (true === bAlign) {
                switch (Value) {
                case c_oAscXAlign.Center:
                    this.CalcX = this.X_min + (W - this.W) / 2;
                    break;
                case c_oAscXAlign.Inside:
                    case c_oAscXAlign.Outside:
                    case c_oAscXAlign.Left:
                    this.CalcX = this.X_min;
                    break;
                case c_oAscXAlign.Right:
                    this.CalcX = this.X_max - this.W;
                    break;
                }
            } else {
                this.CalcX = this.X_min + Value;
            }
            break;
        case c_oAscHAnchor.PageInternal:
            if (true === bAlign) {
                switch (Value) {
                case c_oAscXAlign.Center:
                    this.CalcX = (this.Page_W - this.W) / 2;
                    break;
                case c_oAscXAlign.Inside:
                    case c_oAscXAlign.Outside:
                    case c_oAscXAlign.Left:
                    this.CalcX = 0;
                    break;
                case c_oAscXAlign.Right:
                    this.CalcX = this.Page_W - this.W;
                    break;
                }
            } else {
                this.CalcX = Value;
            }
            break;
        }
        return this.CalcX;
    },
    Calculate_Y: function (RelativeFrom, bAlign, Value) {
        switch (RelativeFrom) {
        case c_oAscVAnchor.Margin:
            if (true === bAlign) {
                switch (Value) {
                case c_oAscYAlign.Bottom:
                    this.CalcY = this.Bottom_Margin - this.H;
                    break;
                case c_oAscYAlign.Center:
                    this.CalcY = (this.Bottom_Margin + this.Top_Margin - this.H) / 2;
                    break;
                case c_oAscYAlign.Inline:
                    case c_oAscYAlign.Inside:
                    case c_oAscYAlign.Outside:
                    case c_oAscYAlign.Top:
                    this.CalcY = this.Top_Margin;
                    break;
                }
            } else {
                this.CalcY = this.Top_Margin + Value;
            }
            break;
        case c_oAscVAnchor.Page:
            if (true === bAlign) {
                switch (Value) {
                case c_oAscYAlign.Bottom:
                    this.CalcY = this.Page_H - this.H;
                    break;
                case c_oAscYAlign.Center:
                    this.CalcY = (this.Page_H - this.H) / 2;
                    break;
                case c_oAscYAlign.Inline:
                    case c_oAscYAlign.Inside:
                    case c_oAscYAlign.Outside:
                    case c_oAscYAlign.Top:
                    this.CalcY = 0;
                    break;
                }
            } else {
                this.CalcY = Value;
            }
            break;
        case c_oAscVAnchor.Text:
            if (true === bAlign) {
                this.CalcY = this.Y;
            } else {
                this.CalcY = this.Y + Value;
            }
            break;
        }
        return this.CalcY;
    },
    Correct_Values: function (X_min, Y_min, X_max, Y_max, AllowOverlap, OtherFlowTables, CurTable) {
        var W = this.W;
        var H = this.H;
        var CurX = this.CalcX;
        var CurY = this.CalcY;
        var bBreak = false;
        while (true != bBreak) {
            bBreak = true;
            for (var Index = 0; Index < OtherFlowTables.length; Index++) {
                var FlowTable = OtherFlowTables[Index];
                if (FlowTable.Table != CurTable && (false === AllowOverlap || false === FlowTable.Table.Get_AllowOverlap()) && (CurX <= FlowTable.X + FlowTable.W && CurX + W >= FlowTable.X && CurY <= FlowTable.Y + FlowTable.H && CurY + H >= FlowTable.Y)) {
                    CurY = FlowTable.Y + FlowTable.H + 0.001;
                    bBreak = false;
                }
            }
        }
        if (CurY + H > Y_max) {
            CurY = Y_max - H;
        }
        if (CurY < this.Y_min) {
            CurY = this.Y_min;
        }
        this.CalcY = CurY;
        this.CalcX = CurX;
    },
    Calculate_X_Value: function (RelativeFrom) {
        var Value = 0;
        switch (RelativeFrom) {
        case c_oAscHAnchor.Text:
            case c_oAscHAnchor.Margin:
            Value = this.CalcX - this.Left_Margin;
            break;
        case c_oAscHAnchor.Page:
            Value = this.CalcX - this.X_min;
            break;
        case c_oAscHAnchor.PageInternal:
            Value = this.CalcX;
            break;
        }
        return Value;
    },
    Calculate_Y_Value: function (RelativeFrom) {
        var Value = 0;
        switch (RelativeFrom) {
        case c_oAscVAnchor.Margin:
            Value = this.CalcY - this.Top_Margin;
            break;
        case c_oAscVAnchor.Page:
            Value = this.CalcY;
            break;
        case c_oAscVAnchor.Text:
            Value = this.CalcY - this.Y;
            break;
        }
        return Value;
    }
};
function CTablePage(X, Y, XLimit, YLimit, FirstRow, MaxTopBorder) {
    this.X = X;
    this.Y = Y;
    this.XLimit = XLimit;
    this.YLimit = YLimit;
    this.Bounds = new CDocumentBounds(X, Y, XLimit, Y);
    this.MaxTopBorder = MaxTopBorder;
    this.FirstRow = FirstRow;
    this.LastRow = FirstRow;
    this.Height = 0;
}
CTablePage.prototype = {
    Shift: function (Dx, Dy) {
        this.X += Dx;
        this.Y += Dy;
        this.XLimit += Dx;
        this.YLimit += Dy;
        this.Bounds.Shift(Dx, Dy);
    }
};
function CTableRecalcInfo() {
    this.TableGrid = true;
    this.TableBorders = true;
}
CTableRecalcInfo.prototype = {
    Set_Type_0: function (Type) {
        this.Recalc_0_Type = Type;
    }
};
function CTableLook(bFC, bFR, bLC, bLR, bBH, bBV) {
    this.m_bFirst_Col = (true === bFC ? true : false);
    this.m_bFirst_Row = (true === bFR ? true : false);
    this.m_bLast_Col = (true === bLC ? true : false);
    this.m_bLast_Row = (true === bLR ? true : false);
    this.m_bBand_Hor = (true === bBH ? true : false);
    this.m_bBand_Ver = (true === bBV ? true : false);
}
CTableLook.prototype = {
    Set: function (bFC, bFR, bLC, bLR, bBH, bBV) {
        this.m_bFirst_Col = (true === bFC ? true : false);
        this.m_bFirst_Row = (true === bFR ? true : false);
        this.m_bLast_Col = (true === bLC ? true : false);
        this.m_bLast_Row = (true === bLR ? true : false);
        this.m_bBand_Hor = (true === bBH ? true : false);
        this.m_bBand_Ver = (true === bBV ? true : false);
    },
    Copy: function () {
        return new CTableLook(this.m_bFirst_Col, this.m_bFirst_Row, this.m_bLast_Col, this.m_bLast_Row, this.m_bBand_Hor, this.m_bBand_Ver);
    },
    Is_FirstCol: function () {
        return this.m_bFirst_Col;
    },
    Is_FirstRow: function () {
        return this.m_bFirst_Row;
    },
    Is_LastCol: function () {
        return this.m_bLast_Col;
    },
    Is_LastRow: function () {
        return this.m_bLast_Row;
    },
    Is_BandHor: function () {
        return this.m_bBand_Hor;
    },
    Is_BandVer: function () {
        return this.m_bBand_Ver;
    },
    Write_ToBinary: function (Writer) {
        Writer.WriteBool(this.m_bFirst_Col);
        Writer.WriteBool(this.m_bFirst_Row);
        Writer.WriteBool(this.m_bLast_Col);
        Writer.WriteBool(this.m_bLast_Row);
        Writer.WriteBool(this.m_bBand_Hor);
        Writer.WriteBool(this.m_bBand_Ver);
    },
    Read_FromBinary: function (Reader) {
        this.m_bFirst_Col = Reader.GetBool();
        this.m_bFirst_Row = Reader.GetBool();
        this.m_bLast_Col = Reader.GetBool();
        this.m_bLast_Row = Reader.GetBool();
        this.m_bBand_Hor = Reader.GetBool();
        this.m_bBand_Ver = Reader.GetBool();
    }
};
function CTable(DrawingDocument, Parent, Inline, PageNum, X, Y, XLimit, YLimit, Rows, Cols, TableGrid) {
    this.Id = g_oIdCounter.Get_NewId();
    this.Markup = new CTableMarkup(this);
    this.Prev = null;
    this.Next = null;
    this.Index = -1;
    this.Inline = true;
    this.Lock = new CLock();
    if (false === g_oIdCounter.m_bLoad) {
        this.Lock.Set_Type(locktype_Mine, false);
        CollaborativeEditing.Add_Unlock2(this);
    }
    this.DrawingDocument = DrawingDocument;
    this.Parent = Parent;
    this.PageNum = PageNum;
    this.CompiledPr = {
        Pr: null,
        NeedRecalc: true
    };
    this.Pr = new CTablePr();
    this.Pr.TableW = new CTableMeasurement(tblwidth_Auto, 0);
    this.TableGridNeedRecalc = true;
    this.TableStyle = editor.WordControl.m_oLogicDocument.Styles.Get_Default_TableGrid();
    this.TableLook = new CTableLook(true, true, false, false, true, false);
    this.TableSumGrid = [];
    this.TableGrid = TableGrid;
    this.TableGridCalc = this.Internal_Copy_Grid(TableGrid);
    this.RecalcInfo = new CTableRecalcInfo();
    this.Rows = Rows;
    this.Cols = Cols;
    this.Content = new Array();
    for (var Index = 0; Index < Rows; Index++) {
        this.Content[Index] = new CTableRow(this, Cols, TableGrid);
    }
    this.Internal_ReIndexing(0);
    this.RowsInfo = new Array();
    this.TableRowsBottom = [];
    this.HeaderInfo = {
        Count: 0,
        H: 0,
        PageIndex: 0,
        Pages: new Array()
    };
    this.Selection = {
        Start: false,
        Use: false,
        StartPos: {
            Pos: {
                Row: 0,
                Cell: 0
            },
            X: 0,
            Y: 0
        },
        EndPos: {
            Pos: {
                Row: 0,
                Cell: 0
            },
            X: 0,
            Y: 0
        },
        Type: table_Selection_Text,
        Data: null,
        Type2: table_Selection_Common,
        Data2: null,
        CurRow: 0
    };
    this.X_origin = X;
    this.X = X;
    this.Y = Y;
    this.XLimit = XLimit;
    this.YLimit = YLimit;
    this.AllowOverlap = true;
    this.PositionH = {
        RelativeFrom: c_oAscHAnchor.Page,
        Align: false,
        Value: c_oAscXAlign.Center
    };
    this.PositionH_Old = undefined;
    this.PositionV = {
        RelativeFrom: c_oAscVAnchor.Page,
        Align: false,
        Value: c_oAscYAlign.Center
    };
    this.PositionV_Old = undefined;
    this.Distance = {
        T: 0,
        B: 0,
        L: 0,
        R: 0
    };
    this.AnchorPosition = new CTableAnchorPosition();
    this.Pages = new Array();
    this.Pages[0] = new CTablePage(X, Y, XLimit, YLimit, 0, 0);
    this.MaxTopBorder = new Array();
    this.MaxBotBorder = new Array();
    this.MaxBotMargin = new Array();
    if (this.Content.length > 0) {
        this.CurCell = this.Content[0].Get_Cell(0);
    } else {
        this.CurCell = null;
    }
    this.TurnOffRecalc = false;
    this.TurnOffRecalcEvent = false;
    this.ApplyToAll = false;
    this.m_oContentChanges = new CContentChanges();
    g_oTableId.Add(this, this.Id);
}
CTable.prototype = {
    setStyleIndex: function (index) {
        History.Add(this, {
            Type: historyitem_Table_SetStyleIndex,
            oldPr: this.styleIndex,
            newPr: index
        });
        this.styleIndex = index;
    },
    Get_Props: function () {
        var TablePr = this.Get_CompiledPr(false).TablePr;
        var Pr = new Object();
        if (tblwidth_Auto === TablePr.TableW.Type) {
            Pr.TableWidth = null;
        } else {
            Pr.TableWidth = TablePr.TableW.W;
        }
        Pr.TableSpacing = this.Content[0].Get_CellSpacing();
        Pr.TableDefaultMargins = {
            Left: TablePr.TableCellMar.Left.W,
            Right: TablePr.TableCellMar.Right.W,
            Top: TablePr.TableCellMar.Top.W,
            Bottom: TablePr.TableCellMar.Bottom.W
        };
        if ((this.Selection.Type === table_Selection_Cell && true === this.Selection.Use) || !(table_Selection_Border === this.Selection.Type2) && !(table_Selection_Border_InnerTable === this.Selection.Type2)) {
            if ((this.Selection.Type === table_Selection_Cell && true === this.Selection.Use)) {
                Pr.CellSelect = true;
                var CellMargins = null;
                var CellMarginFlag = false;
                var Border_left = null;
                var Border_right = null;
                var Border_top = null;
                var Border_bottom = null;
                var Border_insideH = null;
                var Border_insideV = null;
                var CellShd = null;
                var Prev_row = -1;
                var bFirstRow = true;
                var _selection_arr;
                for (var Index = 0; Index < this.Selection.Data.length; Index++) {
                    var Pos = this.Selection.Data[Index];
                    var Row = this.Content[Pos.Row];
                    var Cell = Row.Get_Cell(Pos.Cell);
                    var Cell_borders = Cell.Get_Borders();
                    var Cell_margins = Cell.Get_Margins();
                    var Cell_shd = Cell.Get_Shd();
                    var _compared_unifill;
                    var _cur_cell_unifill = Cell.getUnifill();
                    if (0 === Index) {
                        _compared_unifill = _cur_cell_unifill;
                    } else {
                        _compared_unifill = CompareUniFill(_compared_unifill, _cur_cell_unifill);
                    }
                    if (0 === Index || this.Selection.Data[Index - 1].Row != Pos.Row) {
                        if (null === Border_left) {
                            Border_left = Cell_borders.Left;
                        } else {
                            Border_left = this.Internal_CompareBorders2(Border_left, Cell_borders.Left);
                        }
                    } else {
                        if (null === Border_insideV) {
                            Border_insideV = Cell_borders.Left;
                        } else {
                            Border_insideV = this.Internal_CompareBorders2(Border_insideV, Cell_borders.Left);
                        }
                    }
                    if (this.Selection.Data.length - 1 === Index || this.Selection.Data[Index + 1].Row != Pos.Row) {
                        if (null === Border_right) {
                            Border_right = Cell_borders.Right;
                        } else {
                            Border_right = this.Internal_CompareBorders2(Border_right, Cell_borders.Right);
                        }
                    } else {
                        if (null === Border_insideV) {
                            Border_insideV = Cell_borders.Right;
                        } else {
                            Border_insideV = this.Internal_CompareBorders2(Border_insideV, Cell_borders.Right);
                        }
                    }
                    if (Prev_row != Pos.Row) {
                        if (-1 != Prev_row) {
                            bFirstRow = false;
                        }
                        if (false === bFirstRow) {
                            if (null === Border_insideH) {
                                Border_insideH = Border_bottom;
                                Border_insideH = this.Internal_CompareBorders2(Border_insideH, Cell_borders.Top);
                            } else {
                                Border_insideH = this.Internal_CompareBorders2(Border_insideH, Border_bottom);
                                Border_insideH = this.Internal_CompareBorders2(Border_insideH, Cell_borders.Top);
                            }
                        } else {
                            if (null === Border_top) {
                                Border_top = Cell_borders.Top;
                            }
                        }
                        Border_bottom = Cell_borders.Bottom;
                        Prev_row = Pos.Row;
                    } else {
                        if (false === bFirstRow) {
                            if (null === Border_insideH) {
                                Border_insideH = Cell_borders.Top;
                            } else {
                                Border_insideH = this.Internal_CompareBorders2(Border_insideH, Cell_borders.Top);
                            }
                        } else {
                            if (null === Border_top) {
                                Border_top = Cell_borders.Top;
                            } else {
                                Border_top = this.Internal_CompareBorders2(Border_top, Cell_borders.Top);
                            }
                        }
                        Border_bottom = this.Internal_CompareBorders2(Border_bottom, Cell_borders.Bottom);
                    }
                    if (true != Cell.Is_TableMargins()) {
                        if (null === CellMargins) {
                            CellMargins = Common_CopyObj(Cell_margins);
                        } else {
                            if (CellMargins.Left.W != Cell_margins.Left.W) {
                                CellMargins.Left.W = null;
                            }
                            if (CellMargins.Right.W != Cell_margins.Right.W) {
                                CellMargins.Right.W = null;
                            }
                            if (CellMargins.Top.W != Cell_margins.Top.W) {
                                CellMargins.Top.W = null;
                            }
                            if (CellMargins.Bottom.W != Cell_margins.Bottom.W) {
                                CellMargins.Bottom.W = null;
                            }
                        }
                    } else {
                        CellMarginFlag = true;
                    }
                }
                Pr.CellBorders = {
                    Left: Border_left.Copy(),
                    Right: Border_right.Copy(),
                    Top: Border_top.Copy(),
                    Bottom: Border_bottom.Copy(),
                    InsideH: null === Border_insideH ? null : Border_insideH.Copy(),
                    InsideV: null === Border_insideV ? null : Border_insideV.Copy()
                };
                if (null == _compared_unifill) {
                    Pr.CellsBackground = null;
                } else {
                    Pr.CellsBackground = {
                        fill: CreateAscFill(_compared_unifill)
                    };
                }
                if (null === CellMargins) {
                    Pr.CellMargins = {
                        Flag: 0
                    };
                } else {
                    var Flag = 2;
                    if (true === CellMarginFlag) {
                        Flag = 1;
                    }
                    Pr.CellMargins = {
                        Left: CellMargins.Left.W,
                        Right: CellMargins.Right.W,
                        Top: CellMargins.Top.W,
                        Bottom: CellMargins.Bottom.W,
                        Flag: Flag
                    };
                }
            } else {
                if (! (table_Selection_Border === this.Selection.Type2) && !(table_Selection_Border_InnerTable === this.Selection.Type2)) {
                    Pr.CellSelect = true;
                    var CellMargins = null;
                    var CellMarginFlag = false;
                    var Border_left = null;
                    var Border_right = null;
                    var Border_top = null;
                    var Border_bottom = null;
                    var Border_insideH = null;
                    var Border_insideV = null;
                    var CellShd = null;
                    var Prev_row = -1;
                    var bFirstRow = true;
                    var _selection_arr;
                    Cell = this.CurCell;
                    var Cell_borders = Cell.Get_Borders();
                    var Cell_margins = Cell.Get_Margins();
                    var Cell_shd = Cell.Get_Shd();
                    _compared_unifill = Cell.getUnifill();
                    Border_left = Cell_borders.Left;
                    Border_right = Cell_borders.Right;
                    Border_top = Cell_borders.Top;
                    Border_bottom = Cell_borders.Bottom;
                    if (true != Cell.Is_TableMargins()) {
                        if (null === CellMargins) {
                            CellMargins = Common_CopyObj(Cell_margins);
                        } else {
                            if (CellMargins.Left.W != Cell_margins.Left.W) {
                                CellMargins.Left.W = null;
                            }
                            if (CellMargins.Right.W != Cell_margins.Right.W) {
                                CellMargins.Right.W = null;
                            }
                            if (CellMargins.Top.W != Cell_margins.Top.W) {
                                CellMargins.Top.W = null;
                            }
                            if (CellMargins.Bottom.W != Cell_margins.Bottom.W) {
                                CellMargins.Bottom.W = null;
                            }
                        }
                    } else {
                        CellMarginFlag = true;
                    }
                    Pr.CellBorders = {
                        Left: Border_left.Copy(),
                        Right: Border_right.Copy(),
                        Top: Border_top.Copy(),
                        Bottom: Border_bottom.Copy(),
                        InsideH: null === Border_insideH ? null : Border_insideH.Copy(),
                        InsideV: null === Border_insideV ? null : Border_insideV.Copy()
                    };
                    if (null == _compared_unifill) {
                        Pr.CellsBackground = null;
                    } else {
                        Pr.CellsBackground = {
                            fill: CreateAscFill(_compared_unifill)
                        };
                    }
                    if (null === CellMargins) {
                        Pr.CellMargins = {
                            Flag: 0
                        };
                    } else {
                        var Flag = 2;
                        if (true === CellMarginFlag) {
                            Flag = 1;
                        }
                        Pr.CellMargins = {
                            Left: CellMargins.Left.W,
                            Right: CellMargins.Right.W,
                            Top: CellMargins.Top.W,
                            Bottom: CellMargins.Bottom.W,
                            Flag: Flag
                        };
                    }
                }
            }
        } else {
            Pr.CellSelect = false;
            var Cell = this.CurCell;
            var CellMargins = Cell.Get_Margins();
            var CellBorders = Cell.Get_Borders();
            var CellShd = Cell.Get_Shd();
            var Spacing = this.Content[0].Get_CellSpacing();
            if (null === Spacing) {
                Pr.CellsBackground = CellShd.Copy();
                Pr.CellBorders = {
                    Left: CellBorders.Left.Copy(),
                    Right: CellBorders.Right.Copy(),
                    Top: CellBorders.Top.Copy(),
                    Bottom: CellBorders.Bottom.Copy(),
                    InsideH: null,
                    InsideV: null
                };
            } else {
                var Border_left = null;
                var Border_right = null;
                var Border_top = null;
                var Border_bottom = null;
                var Border_insideH = null;
                var Border_insideV = null;
                var CellShd = null;
                for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
                    var Row = this.Content[CurRow];
                    var Cells_Count = Row.Get_CellsCount();
                    for (var CurCell = 0; CurCell < Cells_Count; CurCell++) {
                        var Cell = Row.Get_Cell(CurCell);
                        var Cell_borders = Cell.Get_Borders();
                        var Cell_shd = Cell.Get_Shd();
                        if (0 === CurCell && Cells_Count) {
                            CellShd = Cell_shd;
                        } else {
                            if (null != CellShd && (CellShd.Value != Cell_shd.Value || CellShd.Color.r != Cell_shd.Color.r || CellShd.Color.g != Cell_shd.Color.g || CellShd.Color.b != Cell_shd.Color.b)) {
                                CellShd = null;
                            }
                        }
                        if (0 === CurCell) {
                            if (null === Border_left) {
                                Border_left = Cell_borders.Left;
                            } else {
                                Border_left = this.Internal_CompareBorders2(Border_left, Cell_borders.Left);
                            }
                        } else {
                            if (null === Border_insideV) {
                                Border_insideV = Cell_borders.Left;
                            } else {
                                Border_insideV = this.Internal_CompareBorders2(Border_insideV, Cell_borders.Left);
                            }
                        }
                        if (Cells_Count - 1 === CurCell) {
                            if (null === Border_right) {
                                Border_right = Cell_borders.Right;
                            } else {
                                Border_right = this.Internal_CompareBorders2(Border_right, Cell_borders.Right);
                            }
                        } else {
                            if (null === Border_insideV) {
                                Border_insideV = Cell_borders.Right;
                            } else {
                                Border_insideV = this.Internal_CompareBorders2(Border_insideV, Cell_borders.Right);
                            }
                        }
                        if (0 === CurCell) {
                            if (0 != CurRow) {
                                if (null === Border_insideH) {
                                    Border_insideH = Border_bottom;
                                    Border_insideH = this.Internal_CompareBorders2(Border_insideH, Cell_borders.Top);
                                } else {
                                    Border_insideH = this.Internal_CompareBorders2(Border_insideH, Border_bottom);
                                    Border_insideH = this.Internal_CompareBorders2(Border_insideH, Cell_borders.Top);
                                }
                            } else {
                                if (null === Border_top) {
                                    Border_top = Cell_borders.Top;
                                }
                            }
                            Border_bottom = Cell_borders.Bottom;
                        } else {
                            if (0 != bFirstRow) {
                                if (null === Border_insideH) {
                                    Border_insideH = Cell_borders.Top;
                                } else {
                                    Border_insideH = this.Internal_CompareBorders2(Border_insideH, Cell_borders.Top);
                                }
                            } else {
                                if (null === Border_top) {
                                    Border_top = Cell_borders.Top;
                                } else {
                                    Border_top = this.Internal_CompareBorders2(Border_top, Cell_borders.Top);
                                }
                            }
                            Border_bottom = this.Internal_CompareBorders2(Border_bottom, Cell_borders.Bottom);
                        }
                    }
                }
                Pr.CellBorders = {
                    Left: Border_left.Copy(),
                    Right: Border_right.Copy(),
                    Top: Border_top.Copy(),
                    Bottom: Border_bottom.Copy(),
                    InsideH: null === Border_insideH ? null : Border_insideH.Copy(),
                    InsideV: null === Border_insideV ? null : Border_insideV.Copy()
                };
            }
            if (true === Cell.Is_TableMargins()) {
                Pr.CellMargins = {
                    Flag: 0
                };
            } else {
                Pr.CellMargins = {
                    Left: CellMargins.Left.W,
                    Right: CellMargins.Right.W,
                    Top: CellMargins.Top.W,
                    Bottom: CellMargins.Bottom.W,
                    Flag: 2
                };
            }
        }
        Pr.TableAlignment = 0;
        Pr.TableIndent = this.X_origin - X_Left_Field - this.Get_TableOffsetCorrection();
        Pr.TableWrappingStyle = c_oAscWrapStyle.Flow;
        Pr.Position = {
            X: this.Parent.X,
            Y: this.Parent.Y
        };
        Pr.TablePaddings = Common_CopyObj(this.Parent.Paddings);
        Pr.TableBorders = Common_CopyObj(TablePr.TableBorders);
        Pr.TableBackground = TablePr.Shd.Copy();
        Pr.TableStyle = this.styleIndex;
        Pr.TableLook = {
            FirstRow: this.TableLook.Is_FirstRow(),
            FirstCol: this.TableLook.Is_FirstCol(),
            LastRow: this.TableLook.Is_LastRow(),
            LastCol: this.TableLook.Is_LastCol(),
            HorBand: this.TableLook.Is_BandHor(),
            VerBand: this.TableLook.Is_BandVer()
        };
        return Pr;
    },
    getStylesForParagraph: function (level) {
        return this.Parent.getStylesForParagraph(level);
    },
    Set_Props: function (Props, bAllTable) {
        var TablePr = this.Get_CompiledPr(false).TablePr;
        var bApplyToInnerTable = false;
        if (true != this.Selection.Use || (true === this.Selection.Use && table_Selection_Text === this.Selection.Type)) {
            bApplyToInnerTable = this.CurCell.Content.Set_TableProps(Props);
        }
        if (true === bApplyToInnerTable) {
            return true;
        }
        var bRecalc_All = false;
        var bRedraw = false;
        if ("undefined" != typeof(Props.TableStyle)) {
            if (this.styleIndex != Props.TableStyle) {
                this.Set_TableStyle(Props.TableStyle);
                bRecalc_All = true;
            }
        }
        if ("undefined" != typeof(Props.TableLook)) {
            var table_look = this.TableLook;
            var first_col = Props.TableLook.FirstCol !== undefined ? Props.TableLook.FirstCol : table_look.m_bFirst_Col;
            var first_row = Props.TableLook.FirstRow !== undefined ? Props.TableLook.FirstRow : table_look.m_bFirst_Row;
            var last_col = Props.TableLook.LastCol !== undefined ? Props.TableLook.LastCol : table_look.m_bLast_Col;
            var last_row = Props.TableLook.LastRow !== undefined ? Props.TableLook.LastRow : table_look.m_bLast_Row;
            var band_ver = Props.TableLook.BandVer !== undefined ? Props.TableLook.BandVer : table_look.m_bBand_Ver;
            var band_hor = Props.TableLook.BandHor !== undefined ? Props.TableLook.BandHor : table_look.m_bBand_Hor;
            var NewLook = new CTableLook(first_col, first_row, last_col, last_row, band_hor, band_ver);
            this.Set_TableLook(NewLook);
            bRecalc_All = true;
        }
        if ("undefined" != typeof(Props.TableSpacing)) {
            var NeedChange = false;
            for (var Index = 0; Index < this.Content.length; Index++) {
                if (Props.TableSpacing != this.Content[Index].Get_CellSpacing()) {
                    NeedChange = true;
                    break;
                }
            }
            if (true === NeedChange) {
                var OldSpacing = this.Content[0].Get_CellSpacing();
                var Diff = Props.TableSpacing - (null === OldSpacing ? 0 : OldSpacing);
                for (var Index = 0; Index < this.Content.length; Index++) {
                    this.Content[Index].Set_CellSpacing(Props.TableSpacing);
                }
                bRecalc_All = true;
                var GridKoeff = new Array();
                for (var Index = 0; Index < this.TableGrid.length; Index++) {
                    GridKoeff.push(1);
                }
                for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
                    var Row = this.Content[CurRow];
                    var GridBefore = Row.Get_Before().GridBefore;
                    var GridAfter = Row.Get_After().GridAfter;
                    GridKoeff[Math.min(GridBefore, GridKoeff.length - 1)] = 1.5;
                    GridKoeff[Math.max(GridKoeff.length - 1 - GridAfter, 0)] = 1.5;
                }
                var TableGrid_old = this.TableGrid;
                this.TableGrid = new Array();
                for (var Index = 0; Index < TableGrid_old.length; Index++) {
                    this.TableGrid[Index] = TableGrid_old[Index] + GridKoeff[Index] * Diff;
                }
                History.Add(this, {
                    Type: historyitem_Table_TableGrid,
                    Old: TableGrid_old,
                    New: this.TableGrid
                });
            }
        }
        var bSpacing = null === this.Content[0].Get_CellSpacing() ? false : true;
        if ("undefined" != typeof(Props.TableDefaultMargins)) {
            var UsingDefaultMar = false;
            for (var Index = 0; Index < this.Content.length; Index++) {
                var Row = this.Content[Index];
                var CellsCount = Row.Get_CellsCount();
                for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                    var Cell = Row.Get_Cell(CurCell);
                    if (null === Cell.Pr.TableCellMar) {
                        UsingDefaultMar = true;
                        break;
                    }
                }
            }
            var NeedChange = false;
            var TDM = Props.TableDefaultMargins;
            var Left_new = ("undefined" != typeof(TDM.Left) ? (null != TDM.Left ? TDM.Left : TablePr.TableCellMar.Left.W) : TablePr.TableCellMar.Left.W);
            var Right_new = ("undefined" != typeof(TDM.Right) ? (null != TDM.Right ? TDM.Right : TablePr.TableCellMar.Right.W) : TablePr.TableCellMar.Right.W);
            var Top_new = ("undefined" != typeof(TDM.Top) ? (null != TDM.Top ? TDM.Top : TablePr.TableCellMar.Top.W) : TablePr.TableCellMar.Top.W);
            var Bottom_new = ("undefined" != typeof(TDM.Bottom) ? (null != TDM.Bottom ? TDM.Bottom : TablePr.TableCellMar.Bottom.W) : TablePr.TableCellMar.Bottom.W);
            if (Left_new != TablePr.TableCellMar.Left.W || Right_new != TablePr.TableCellMar.Right.W || Top_new != TablePr.TableCellMar.Top.W || Bottom_new != TablePr.TableCellMar.Bottom.W) {
                NeedChange = true;
            }
            if (true === NeedChange) {
                this.Set_TableCellMar(Left_new, Top_new, Right_new, Bottom_new);
                if (true === UsingDefaultMar) {
                    bRecalc_All = true;
                }
            }
        }
        if ("undefined" != typeof(Props.CellMargins) && null != Props.CellMargins) {
            var NeedChange = false;
            switch (Props.CellMargins.Flag) {
            case 0:
                if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
                    for (var Index = 0; Index < this.Selection.Data.length; Index++) {
                        var Pos = this.Selection.Data[Index];
                        var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
                        if (null != Cell.Pr.TableCellMar) {
                            Cell.Set_Margins(null);
                            NeedChange = true;
                        }
                    }
                } else {
                    var Cell = this.CurCell;
                    if (null != Cell.Pr.TableCellMar) {
                        Cell.Set_Margins(null);
                        NeedChange = true;
                    }
                }
                break;
            case 1:
                if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
                    for (var Index = 0; Index < this.Selection.Data.length; Index++) {
                        var Pos = this.Selection.Data[Index];
                        var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
                        if (true != Cell.Is_TableMargins()) {
                            if (null != Props.CellMargins.Left) {
                                Cell.Set_Margins({
                                    W: Props.CellMargins.Left,
                                    Type: tblwidth_Mm
                                },
                                3);
                            }
                            if (null != Props.CellMargins.Right) {
                                Cell.Set_Margins({
                                    W: Props.CellMargins.Right,
                                    Type: tblwidth_Mm
                                },
                                1);
                            }
                            if (null != Props.CellMargins.Top) {
                                Cell.Set_Margins({
                                    W: Props.CellMargins.Top,
                                    Type: tblwidth_Mm
                                },
                                0);
                            }
                            if (null != Props.CellMargins.Bottom) {
                                Cell.Set_Margins({
                                    W: Props.CellMargins.Bottom,
                                    Type: tblwidth_Mm
                                },
                                2);
                            }
                            NeedChange = true;
                        }
                    }
                } else {
                    var Cell = this.CurCell;
                    if (true != Cell.Is_TableMargins()) {
                        if (null != Props.CellMargins.Left) {
                            Cell.Set_Margins({
                                W: Props.CellMargins.Left,
                                Type: tblwidth_Mm
                            },
                            3);
                        }
                        if (null != Props.CellMargins.Right) {
                            Cell.Set_Margins({
                                W: Props.CellMargins.Right,
                                Type: tblwidth_Mm
                            },
                            1);
                        }
                        if (null != Props.CellMargins.Top) {
                            Cell.Set_Margins({
                                W: Props.CellMargins.Top,
                                Type: tblwidth_Mm
                            },
                            0);
                        }
                        if (null != Props.CellMargins.Bottom) {
                            Cell.Set_Margins({
                                W: Props.CellMargins.Bottom,
                                Type: tblwidth_Mm
                            },
                            2);
                        }
                    } else {
                        if (null != Props.CellMargins.Left) {
                            Cell.Set_Margins({
                                W: Props.CellMargins.Left,
                                Type: tblwidth_Mm
                            },
                            3);
                        } else {
                            Cell.Set_Margins({
                                W: TablePr.TableCellMar.Left.W,
                                Type: tblwidth_Mm
                            },
                            3);
                        }
                        if (null != Props.CellMargins.Right) {
                            Cell.Set_Margins({
                                W: Props.CellMargins.Right,
                                Type: tblwidth_Mm
                            },
                            1);
                        } else {
                            Cell.Set_Margins({
                                W: TablePr.TableCellMar.Right.W,
                                Type: tblwidth_Mm
                            },
                            1);
                        }
                        if (null != Props.CellMargins.Top) {
                            Cell.Set_Margins({
                                W: Props.CellMargins.Top,
                                Type: tblwidth_Mm
                            },
                            0);
                        } else {
                            Cell.Set_Margins({
                                W: TablePr.TableCellMar.Top.W,
                                Type: tblwidth_Mm
                            },
                            0);
                        }
                        if (null != Props.CellMargins.Bottom) {
                            Cell.Set_Margins({
                                W: Props.CellMargins.Bottom,
                                Type: tblwidth_Mm
                            },
                            2);
                        } else {
                            Cell.Set_Margins({
                                W: TablePr.TableCellMar.Bottom.W,
                                Type: tblwidth_Mm
                            },
                            2);
                        }
                    }
                    NeedChange = true;
                }
                break;
            case 2:
                NeedChange = true;
                if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
                    for (var Index = 0; Index < this.Selection.Data.length; Index++) {
                        var Pos = this.Selection.Data[Index];
                        var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
                        if (true != Cell.Is_TableMargins()) {
                            if (null != Props.CellMargins.Left) {
                                Cell.Set_Margins({
                                    W: Props.CellMargins.Left,
                                    Type: tblwidth_Mm
                                },
                                3);
                            }
                            if (null != Props.CellMargins.Right) {
                                Cell.Set_Margins({
                                    W: Props.CellMargins.Right,
                                    Type: tblwidth_Mm
                                },
                                1);
                            }
                            if (null != Props.CellMargins.Top) {
                                Cell.Set_Margins({
                                    W: Props.CellMargins.Top,
                                    Type: tblwidth_Mm
                                },
                                0);
                            }
                            if (null != Props.CellMargins.Bottom) {
                                Cell.Set_Margins({
                                    W: Props.CellMargins.Bottom,
                                    Type: tblwidth_Mm
                                },
                                2);
                            }
                        } else {
                            if (null != Props.CellMargins.Left) {
                                Cell.Set_Margins({
                                    W: Props.CellMargins.Left,
                                    Type: tblwidth_Mm
                                },
                                3);
                            } else {
                                Cell.Set_Margins({
                                    W: TablePr.TableCellMar.Left.W,
                                    Type: tblwidth_Mm
                                },
                                3);
                            }
                            if (null != Props.CellMargins.Right) {
                                Cell.Set_Margins({
                                    W: Props.CellMargins.Right,
                                    Type: tblwidth_Mm
                                },
                                1);
                            } else {
                                Cell.Set_Margins({
                                    W: TablePr.TableCellMar.Right.W,
                                    Type: tblwidth_Mm
                                },
                                1);
                            }
                            if (null != Props.CellMargins.Top) {
                                Cell.Set_Margins({
                                    W: Props.CellMargins.Top,
                                    Type: tblwidth_Mm
                                },
                                0);
                            } else {
                                Cell.Set_Margins({
                                    W: TablePr.TableCellMar.Top.W,
                                    Type: tblwidth_Mm
                                },
                                0);
                            }
                            if (null != Props.CellMargins.Bottom) {
                                Cell.Set_Margins({
                                    W: Props.CellMargins.Bottom,
                                    Type: tblwidth_Mm
                                },
                                2);
                            } else {
                                Cell.Set_Margins({
                                    W: TablePr.TableCellMar.Bottom.W,
                                    Type: tblwidth_Mm
                                },
                                2);
                            }
                        }
                    }
                } else {
                    var Cell = this.CurCell;
                    if (true != Cell.Is_TableMargins()) {
                        if (null != Props.CellMargins.Left) {
                            Cell.Set_Margins({
                                W: Props.CellMargins.Left,
                                Type: tblwidth_Mm
                            },
                            3);
                        }
                        if (null != Props.CellMargins.Right) {
                            Cell.Set_Margins({
                                W: Props.CellMargins.Right,
                                Type: tblwidth_Mm
                            },
                            1);
                        }
                        if (null != Props.CellMargins.Top) {
                            Cell.Set_Margins({
                                W: Props.CellMargins.Top,
                                Type: tblwidth_Mm
                            },
                            0);
                        }
                        if (null != Props.CellMargins.Bottom) {
                            Cell.Set_Margins({
                                W: Props.CellMargins.Bottom,
                                Type: tblwidth_Mm
                            },
                            2);
                        }
                    } else {
                        if (null != Props.CellMargins.Left) {
                            Cell.Set_Margins({
                                W: Props.CellMargins.Left,
                                Type: tblwidth_Mm
                            },
                            3);
                        } else {
                            Cell.Set_Margins({
                                W: TablePr.TableCellMar.Left.W,
                                Type: tblwidth_Mm
                            },
                            3);
                        }
                        if (null != Props.CellMargins.Right) {
                            Cell.Set_Margins({
                                W: Props.CellMargins.Right,
                                Type: tblwidth_Mm
                            },
                            1);
                        } else {
                            Cell.Set_Margins({
                                W: TablePr.TableCellMar.Right.W,
                                Type: tblwidth_Mm
                            },
                            1);
                        }
                        if (null != Props.CellMargins.Top) {
                            Cell.Set_Margins({
                                W: Props.CellMargins.Top,
                                Type: tblwidth_Mm
                            },
                            0);
                        } else {
                            Cell.Set_Margins({
                                W: TablePr.TableCellMar.Top.W,
                                Type: tblwidth_Mm
                            },
                            0);
                        }
                        if (null != Props.CellMargins.Bottom) {
                            Cell.Set_Margins({
                                W: Props.CellMargins.Bottom,
                                Type: tblwidth_Mm
                            },
                            2);
                        } else {
                            Cell.Set_Margins({
                                W: TablePr.TableCellMar.Bottom.W,
                                Type: tblwidth_Mm
                            },
                            2);
                        }
                    }
                    NeedChange = true;
                }
                break;
            }
            if (true === NeedChange) {
                bRecalc_All = true;
            }
        }
        if ("undefined" != typeof(Props.TableWidth)) {
            if (null === Props.TableWidth && tblwidth_Auto != TablePr.TableW.Type) {
                this.Set_TableW(tblwidth_Auto, 0);
                bRecalc_All = true;
            } else {
                if (null != Props.TableWidth) {
                    if (tblwidth_Auto === TablePr.TableW.Type || Props.TableWidth != TablePr.TableW.W) {
                        this.Set_TableW(tblwidth_Mm, Props.TableWidth);
                        bRecalc_All = true;
                    }
                }
            }
        }
        if ("undefined" != typeof(Props.TableWrappingStyle)) {
            if (0 === Props.TableWrappingStyle && true != this.Inline) {
                this.Set_Inline(true);
                bRecalc_All = false;
                bRedraw = false;
            } else {
                if (1 === Props.TableWrappingStyle && false != this.Inline) {
                    this.Set_Inline(false);
                    bRecalc_All = false;
                    bRedraw = false;
                }
            }
        }
        var _Jc = TablePr.Jc;
        if ("undefined" != typeof(Props.TableAlignment) && true === this.Is_Inline()) {
            var NewJc = (0 === Props.TableAlignment ? align_Left : (1 === Props.TableAlignment ? align_Center : align_Right));
            if (TablePr.Jc != NewJc) {
                _Jc = NewJc;
                this.Set_TableAlign(NewJc);
                bRecalc_All = true;
            }
        }
        if ("undefined" != typeof(Props.TableIndent) && true === this.Is_Inline() && align_Left === _Jc) {
            if (Props.TableIndent != TablePr.TableInd) {
                this.Set_TableInd(Props.TableIndent);
                bRecalc_All = true;
            }
        }
        if ("undefined" != typeof(Props.Position) && true != this.Is_Inline()) {
            var X_new = ("undefined" != typeof(Props.Position.X) ? (null != Props.Position.X ? Props.Position.X : this.X) : this.X);
            var Y_new = ("undefined" != typeof(Props.Position.Y) ? (null != Props.Position.Y ? Props.Position.Y : this.Y) : this.Y);
            if (Math.abs(this.X - X_new) > 0.001 || Math.abs(this.Y - Y_new) > 0.001) {
                this.X = X_new;
                this.Y = Y_new;
                this.Parent.Set_Position(this.X, this.Y);
                bRecalc_All = true;
            }
        }
        if ("undefined" != typeof(Props.TablePaddings) && true != this.Is_Inline()) {
            var TP = Props.TablePaddings;
            var CurPaddings = this.Parent.Paddings;
            var NewPaggings_left = ("undefined" != typeof(TP.Left) ? (null != TP.Left ? TP.Left : CurPaddings.Left) : CurPaddings.Left);
            var NewPaggings_right = ("undefined" != typeof(TP.Right) ? (null != TP.Right ? TP.Right : CurPaddings.Right) : CurPaddings.Right);
            var NewPaggings_top = ("undefined" != typeof(TP.Top) ? (null != TP.Top ? TP.Top : CurPaddings.Top) : CurPaddings.Top);
            var NewPaggings_bottom = ("undefined" != typeof(TP.Bottom) ? (null != TP.Bottom ? TP.Bottom : CurPaddings.Bottom) : CurPaddings.Bottom);
            if (Math.abs(CurPaddings.Left - NewPaggings_left) > 0.001 || Math.abs(CurPaddings.Right - NewPaggings_right) > 0.001 || Math.abs(CurPaddings.Top - NewPaggings_top) > 0.001 || Math.abs(CurPaddings.Bottom - NewPaggings_bottom) > 0.001) {
                this.Parent.Set_Paddings(NewPaggings_left, NewPaggings_right, NewPaggings_top, NewPaggings_bottom);
                bRecalc_All = true;
            }
        }
        if ("undefined" != typeof(Props.TableBorders) && null != Props.TableBorders) {
            if (false === this.Internal_CheckNullBorder(Props.TableBorders.Top) && false === this.Internal_CompareBorders3(Props.TableBorders.Top, TablePr.TableBorders.Top)) {
                this.Set_TableBorder_Top(Props.TableBorders.Top);
                bRecalc_All = true;
                if (true != bSpacing) {
                    var Row = this.Content[0];
                    for (var CurCell = 0; CurCell < Row.Get_CellsCount(); CurCell++) {
                        var Cell = Row.Get_Cell(CurCell);
                        Cell.Set_Border(null, 0);
                    }
                }
            }
            if (false === this.Internal_CheckNullBorder(Props.TableBorders.Bottom) && false === this.Internal_CompareBorders3(Props.TableBorders.Bottom, TablePr.TableBorders.Bottom)) {
                this.Set_TableBorder_Bottom(Props.TableBorders.Bottom);
                bRecalc_All = true;
                if (true != bSpacing) {
                    var Row = this.Content[this.Content.length - 1];
                    for (var CurCell = 0; CurCell < Row.Get_CellsCount(); CurCell++) {
                        var Cell = Row.Get_Cell(CurCell);
                        Cell.Set_Border(null, 2);
                    }
                }
            }
            if (false === this.Internal_CheckNullBorder(Props.TableBorders.Left) && false === this.Internal_CompareBorders3(Props.TableBorders.Left, TablePr.TableBorders.Left)) {
                this.Set_TableBorder_Left(Props.TableBorders.Left);
                bRecalc_All = true;
                if (true != bSpacing) {
                    for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
                        var Cell = this.Content[CurRow].Get_Cell(0);
                        Cell.Set_Border(null, 3);
                    }
                }
            }
            if (false === this.Internal_CheckNullBorder(Props.TableBorders.Right) && false === this.Internal_CompareBorders3(Props.TableBorders.Right, TablePr.TableBorders.Right)) {
                this.Set_TableBorder_Right(Props.TableBorders.Right);
                bRecalc_All = true;
                if (true != bSpacing) {
                    for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
                        var Cell = this.Content[CurRow].Get_Cell(this.Content[CurRow].Get_CellsCount() - 1);
                        Cell.Set_Border(null, 1);
                    }
                }
            }
            if (false === this.Internal_CheckNullBorder(Props.TableBorders.InsideH) && false === this.Internal_CompareBorders3(Props.TableBorders.InsideH, TablePr.TableBorders.InsideH)) {
                this.Set_TableBorder_InsideH(Props.TableBorders.InsideH);
                bRecalc_All = true;
                for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
                    var Row = this.Content[CurRow];
                    var Cells_Count = Row.Get_CellsCount();
                    for (var CurCell = 0; CurCell < Cells_Count; CurCell++) {
                        var Cell = Row.Get_Cell(CurCell);
                        if ((0 === CurRow && true === bSpacing) || 0 != CurRow) {
                            Cell.Set_Border(null, 0);
                        }
                        if ((this.Content.length - 1 === CurRow && true === bSpacing) || this.Content.length - 1 != CurRow) {
                            Cell.Set_Border(null, 2);
                        }
                    }
                }
            }
            if (false === this.Internal_CheckNullBorder(Props.TableBorders.InsideV) && false === this.Internal_CompareBorders3(Props.TableBorders.InsideV, TablePr.TableBorders.InsideV)) {
                this.Set_TableBorder_InsideV(Props.TableBorders.InsideV);
                bRecalc_All = true;
                for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
                    var Row = this.Content[CurRow];
                    var Cells_Count = Row.Get_CellsCount();
                    for (var CurCell = 0; CurCell < Cells_Count; CurCell++) {
                        var Cell = Row.Get_Cell(CurCell);
                        if ((0 === CurCell && true === bSpacing) || 0 != CurCell) {
                            Cell.Set_Border(null, 3);
                        }
                        if ((Cells_Count - 1 === CurCell && true === bSpacing) || Cells_Count - 1 != CurCell) {
                            Cell.Set_Border(null, 1);
                        }
                    }
                }
            }
        }
        if ("undefined" != typeof(Props.CellBorders) && null != Props.CellBorders) {
            var Cells_array = null;
            if (bAllTable) {
                Cells_array = new Array();
                for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
                    var Row = this.Content[CurRow];
                    var Cells_count = Row.Get_CellsCount();
                    for (var CurCell = 0; CurCell < Cells_count; CurCell++) {
                        var Cell = Row.Get_Cell(CurCell);
                        if (vmerge_Continue === Cell.Get_VMerge()) {
                            continue;
                        }
                        Cells_array.push({
                            Cell: CurCell,
                            Row: CurRow
                        });
                    }
                }
            } else {
                if (true === bSpacing) {
                    if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
                        Cells_array = this.Selection.Data;
                    } else {
                        if (false === Props.CellSelect) {
                            Cells_array = new Array();
                            for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
                                var Row = this.Content[CurRow];
                                var Cells_count = Row.Get_CellsCount();
                                for (var CurCell = 0; CurCell < Cells_count; CurCell++) {
                                    var Cell = Row.Get_Cell(CurCell);
                                    if (vmerge_Continue === Cell.Get_VMerge()) {
                                        continue;
                                    }
                                    Cells_array.push({
                                        Cell: CurCell,
                                        Row: CurRow
                                    });
                                }
                            }
                        } else {
                            Cells_array = [{
                                Row: this.CurCell.Row.Index,
                                Cell: this.CurCell.Index
                            }];
                        }
                    }
                } else {
                    if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
                        Cells_array = this.Selection.Data;
                    } else {
                        Cells_array = [{
                            Row: this.CurCell.Row.Index,
                            Cell: this.CurCell.Index
                        }];
                    }
                }
            }
            var Pos_first = Cells_array[0];
            var Pos_last = Cells_array[Cells_array.length - 1];
            var Row_first = Pos_first.Row;
            var Row_last = Pos_last.Row;
            var bBorder_top = (false === this.Internal_CheckNullBorder(Props.CellBorders.Top) ? true : false);
            var bBorder_bottom = (false === this.Internal_CheckNullBorder(Props.CellBorders.Bottom) ? true : false);
            var bBorder_left = (false === this.Internal_CheckNullBorder(Props.CellBorders.Left) ? true : false);
            var bBorder_right = (false === this.Internal_CheckNullBorder(Props.CellBorders.Right) ? true : false);
            var bBorder_insideh = (false === this.Internal_CheckNullBorder(Props.CellBorders.InsideH) ? true : false);
            var bBorder_insidev = (false === this.Internal_CheckNullBorder(Props.CellBorders.InsideV) ? true : false);
            if (true != bSpacing) {
                var Grid_row_first_start = 0,
                Grid_row_first_end = 0,
                Grid_row_last_start = 0,
                Grid_row_last_end = 0;
                var Pos = {
                    Row: 0,
                    Cell: 0
                };
                var CurRow = Row_first;
                var Index = 0;
                Grid_row_first_start = this.Content[Pos_first.Row].Get_CellInfo(Pos_first.Cell).StartGridCol;
                while (Index < Cells_array.length) {
                    Pos = Cells_array[Index];
                    if (Pos.Row != Row_first) {
                        break;
                    }
                    var Row = this.Content[Pos.Row];
                    var Cell = Row.Get_Cell(Pos.Cell);
                    Grid_row_first_end = Row.Get_CellInfo(Pos.Cell).StartGridCol + Cell.Get_GridSpan() - 1;
                    Index++;
                }
                Index = 0;
                while (Index < Cells_array.length) {
                    Pos = Cells_array[Index];
                    if (Pos.Row === Row_last) {
                        break;
                    }
                    Index++;
                }
                Grid_row_last_start = this.Content[Pos.Row].Get_CellInfo(Pos.Cell).StartGridCol;
                Grid_row_last_end = this.Content[Pos_last.Row].Get_CellInfo(Pos_last.Cell).StartGridCol + this.Content[Pos_last.Row].Get_Cell(Pos_last.Cell).Get_GridSpan() - 1;
                if (Row_first > 0 && true === bBorder_top) {
                    var Cell_start = 0,
                    Cell_end = 0;
                    var bStart = false;
                    var bEnd = false;
                    var Row = this.Content[Row_first - 1];
                    for (var CurCell = 0; CurCell < Row.Get_CellsCount(); CurCell++) {
                        var StartGridCol = Row.Get_CellInfo(CurCell).StartGridCol;
                        var EndGridCol = StartGridCol + Row.Get_Cell(CurCell).Get_GridSpan() - 1;
                        if (false === bStart) {
                            if (StartGridCol < Grid_row_first_start) {
                                continue;
                            } else {
                                if (StartGridCol > Grid_row_first_start) {
                                    break;
                                } else {
                                    Cell_start = CurCell;
                                    bStart = true;
                                    if (EndGridCol < Grid_row_first_end) {
                                        continue;
                                    } else {
                                        if (EndGridCol > Grid_row_first_end) {
                                            break;
                                        } else {
                                            Cell_end = CurCell;
                                            bEnd = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        if (false === bEnd) {
                            if (EndGridCol < Grid_row_first_end) {
                                continue;
                            } else {
                                if (EndGridCol > Grid_row_first_end) {
                                    break;
                                } else {
                                    Cell_end = CurCell;
                                    bEnd = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (true === bStart && true === bEnd) {
                        for (var CurCell = Cell_start; CurCell <= Cell_end; CurCell++) {
                            var Cell = Row.Get_Cell(CurCell);
                            Cell.Set_Border(Props.CellBorders.Top, 2);
                        }
                        bRecalc_All = true;
                    }
                }
                if (Row_last < this.Content.length - 1 && true === bBorder_bottom) {
                    var Cell_start = 0,
                    Cell_end = 0;
                    var bStart = false;
                    var bEnd = false;
                    var Row = this.Content[Row_last + 1];
                    for (var CurCell = 0; CurCell < Row.Get_CellsCount(); CurCell++) {
                        var StartGridCol = Row.Get_CellInfo(CurCell).StartGridCol;
                        var EndGridCol = StartGridCol + Row.Get_Cell(CurCell).Get_GridSpan() - 1;
                        if (false === bStart) {
                            if (StartGridCol < Grid_row_last_start) {
                                continue;
                            } else {
                                if (StartGridCol > Grid_row_last_start) {
                                    break;
                                } else {
                                    Cell_start = CurCell;
                                    bStart = true;
                                    if (EndGridCol < Grid_row_last_end) {
                                        continue;
                                    } else {
                                        if (EndGridCol > Grid_row_last_end) {
                                            break;
                                        } else {
                                            Cell_end = CurCell;
                                            bEnd = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        if (false === bEnd) {
                            if (EndGridCol < Grid_row_last_end) {
                                continue;
                            } else {
                                if (EndGridCol > Grid_row_last_end) {
                                    break;
                                } else {
                                    Cell_end = CurCell;
                                    bEnd = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (true === bStart && true === bEnd) {
                        for (var CurCell = Cell_start; CurCell <= Cell_end; CurCell++) {
                            var Cell = Row.Get_Cell(CurCell);
                            Cell.Set_Border(Props.CellBorders.Bottom, 0);
                        }
                        bRecalc_All = true;
                    }
                }
            }
            var PrevRow = Row_first;
            var Cell_start = Pos_first.Cell,
            Cell_end = Pos_first.Cell;
            for (var Index = 0; Index < Cells_array.length; Index++) {
                var Pos = Cells_array[Index];
                Row = this.Content[Pos.Row];
                Cell = Row.Get_Cell(Pos.Cell);
                if (PrevRow != Pos.Row) {
                    var Row_temp = this.Content[PrevRow];
                    if (true != bSpacing && Cell_start > 0 && true === bBorder_left) {
                        Row_temp.Get_Cell(Cell_start - 1).Set_Border(Props.CellBorders.Left, 1);
                        bRecalc_All = true;
                    }
                    if (true != bSpacing && Cell_end < Row_temp.Get_CellsCount() - 1 && true === bBorder_right) {
                        Row_temp.Get_Cell(Cell_end + 1).Set_Border(Props.CellBorders.Right, 3);
                        bRecalc_All = true;
                    }
                    for (var CurCell = Cell_start; CurCell <= Cell_end; CurCell++) {
                        var Cell_temp = Row_temp.Get_Cell(CurCell);
                        if (Row_first === PrevRow && true === bBorder_top) {
                            Cell_temp.Set_Border(Props.CellBorders.Top, 0);
                            bRecalc_All = true;
                        } else {
                            if (Row_first != PrevRow && true === bBorder_insideh) {
                                Cell_temp.Set_Border(Props.CellBorders.InsideH, 0);
                                bRecalc_All = true;
                            }
                        }
                        if (Row_last === PrevRow && true === bBorder_bottom) {
                            Cell_temp.Set_Border(Props.CellBorders.Bottom, 2);
                            bRecalc_All = true;
                        } else {
                            if (Row_last != PrevRow && true === bBorder_insideh) {
                                Cell_temp.Set_Border(Props.CellBorders.InsideH, 2);
                                bRecalc_All = true;
                            }
                        }
                        if (CurCell === Cell_start && true === bBorder_left) {
                            Cell_temp.Set_Border(Props.CellBorders.Left, 3);
                            bRecalc_All = true;
                        } else {
                            if (CurCell != Cell_start && true === bBorder_insidev) {
                                Cell_temp.Set_Border(Props.CellBorders.InsideV, 3);
                                bRecalc_All = true;
                            }
                        }
                        if (CurCell === Cell_end && true === bBorder_right) {
                            Cell_temp.Set_Border(Props.CellBorders.Right, 1);
                            bRecalc_All = true;
                        } else {
                            if (CurCell != Cell_end && true === bBorder_insidev) {
                                Cell_temp.Set_Border(Props.CellBorders.InsideV, 1);
                                bRecalc_All = true;
                            }
                        }
                    }
                    Cell_start = Pos.Cell;
                    Cell_end = Pos.Cell;
                    PrevRow = Pos.Row;
                } else {
                    Cell_end = Pos.Cell;
                }
                if (Cells_array.length - 1 === Index) {
                    var Row_temp = this.Content[PrevRow];
                    if (true != bSpacing && Cell_start > 0 && true === bBorder_left) {
                        Row_temp.Get_Cell(Cell_start - 1).Set_Border(Props.CellBorders.Left, 1);
                        bRecalc_All = true;
                    }
                    if (true != bSpacing && Cell_end < Row_temp.Get_CellsCount() - 1 && true === bBorder_right) {
                        Row_temp.Get_Cell(Cell_end + 1).Set_Border(Props.CellBorders.Right, 3);
                        bRecalc_All = true;
                    }
                    for (var CurCell = Cell_start; CurCell <= Cell_end; CurCell++) {
                        var Cell_temp = Row_temp.Get_Cell(CurCell);
                        if (Row_first === Pos.Row && true === bBorder_top) {
                            Cell_temp.Set_Border(Props.CellBorders.Top, 0);
                            bRecalc_All = true;
                        } else {
                            if (Row_first != Pos.Row && true === bBorder_insideh) {
                                Cell_temp.Set_Border(Props.CellBorders.InsideH, 0);
                                bRecalc_All = true;
                            }
                        }
                        if (Row_last === Pos.Row && true === bBorder_bottom) {
                            Cell_temp.Set_Border(Props.CellBorders.Bottom, 2);
                            bRecalc_All = true;
                        } else {
                            if (Row_last != Pos.Row && true === bBorder_insideh) {
                                Cell_temp.Set_Border(Props.CellBorders.InsideH, 2);
                                bRecalc_All = true;
                            }
                        }
                        if (CurCell === Cell_start && true === bBorder_left) {
                            Cell_temp.Set_Border(Props.CellBorders.Left, 3);
                            bRecalc_All = true;
                        } else {
                            if (CurCell != Cell_start && true === bBorder_insidev) {
                                Cell_temp.Set_Border(Props.CellBorders.InsideV, 3);
                                bRecalc_All = true;
                            }
                        }
                        if (CurCell === Cell_end && true === bBorder_right) {
                            Cell_temp.Set_Border(Props.CellBorders.Right, 1);
                            bRecalc_All = true;
                        } else {
                            if (CurCell != Cell_end && true === bBorder_insidev) {
                                Cell_temp.Set_Border(Props.CellBorders.InsideV, 1);
                                bRecalc_All = true;
                            }
                        }
                    }
                }
            }
        }
        if ("undefined" != typeof(Props.TableBackground)) {
            if (Props.TableBackground.Value != TablePr.Shd.Value || Props.TableBackground.Color.r != TablePr.Shd.Color.r || Props.TableBackground.Color.g != TablePr.Shd.Color.g || Props.TableBackground.Color.b != TablePr.Shd.Color.b) {
                this.Set_TableShd(Props.TableBackground.Value, Props.TableBackground.Color.r, Props.TableBackground.Color.g, Props.TableBackground.Color.b);
                bRedraw = true;
            }
            if (false === Props.CellSelect && false === bSpacing) {
                for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
                    var Row = this.Content[CurRow];
                    for (var CurCell = 0; CurCell < Row.Get_CellsCount(); CurCell++) {
                        var Cell = Row.Get_Cell(CurCell);
                        Cell.Set_Shd({
                            Value: shd_Nil,
                            Color: {
                                r: 0,
                                g: 0,
                                b: 0
                            }
                        });
                    }
                }
            }
        }
        if ("undefined" != typeof(Props.CellsBackground) && null != Props.CellsBackground) {
            if (bAllTable === true) {
                for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
                    var Row = this.Content[CurRow];
                    for (var CurCell = 0; CurCell < Row.Get_CellsCount(); CurCell++) {
                        var Cell = Row.Get_Cell(CurCell);
                        var NewShd = new CDocumentShd();
                        NewShd.Set_FromObject({
                            Value: Props.CellsBackground.Value,
                            Color: {
                                r: Props.CellsBackground.Color.r,
                                g: Props.CellsBackground.Color.g,
                                b: Props.CellsBackground.Color.b
                            },
                            unifill: CorrectUniFill(Props.CellsBackground.fill, new CUniFill())
                        });
                        Cell.Set_Shd(NewShd);
                        bRedraw = true;
                    }
                }
            } else {
                if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
                    for (var Index = 0; Index < this.Selection.Data.length; Index++) {
                        var Pos = this.Selection.Data[Index];
                        var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
                        var Cell_shd = Cell.Get_Shd();
                        if (Props.CellsBackground.Value != Cell_shd.Value || Props.CellsBackground.Color.r != Cell_shd.Color.r || Props.CellsBackground.Color.g != Cell_shd.Color.g || Props.CellsBackground.Color.b != Cell_shd.Color.b) {
                            var NewShd = new CDocumentShd();
                            NewShd.Set_FromObject({
                                Value: Props.CellsBackground.Value,
                                Color: {
                                    r: Props.CellsBackground.Color.r,
                                    g: Props.CellsBackground.Color.g,
                                    b: Props.CellsBackground.Color.b
                                },
                                unifill: CorrectUniFill(Props.CellsBackground.fill, new CUniFill())
                            });
                            Cell.Set_Shd(NewShd);
                            bRedraw = true;
                        }
                    }
                } else {
                    var Cell = this.CurCell;
                    var Cell_shd = Cell.Get_Shd();
                    if (Props.CellsBackground.Value != Cell_shd.Value || Props.CellsBackground.Color.r != Cell_shd.Color.r || Props.CellsBackground.Color.g != Cell_shd.Color.g || Props.CellsBackground.Color.b != Cell_shd.Color.b) {
                        var NewShd = new CDocumentShd();
                        NewShd.Set_FromObject({
                            Value: Props.CellsBackground.Value,
                            Color: {
                                r: Props.CellsBackground.Color.r,
                                g: Props.CellsBackground.Color.g,
                                b: Props.CellsBackground.Color.b
                            },
                            unifill: CorrectUniFill(Props.CellsBackground.fill, new CUniFill())
                        });
                        Cell.Set_Shd(NewShd);
                        bRedraw = true;
                    }
                }
            }
        }
        if (true === bRecalc_All) {
            this.Internal_RecalculateGrid();
            this.Internal_Recalculate_1();
            this.Parent.OnContentRecalculate(true, 0, this.Index, null, this);
            if (true === this.Selection.Use) {
                this.DrawingDocument.SelectClear();
                this.Selection_Draw();
                this.DrawingDocument.SelectShow();
            }
        } else {
            if (true === bRedraw) {
                this.Parent.OnContentRecalculate(false, 0, this.Index, null, this);
            }
        }
        return true;
    },
    Get_Styles: function (level, bParagraph) {
        return this.Parent.Get_Styles(level, this.styleIndex);
    },
    Get_Numbering: function () {
        return this.Parent.Get_Numbering();
    },
    Get_PageBounds: function (Index) {
        return this.Pages[Index].Bounds;
    },
    Get_PagesCount: function () {
        return this.Pages.length;
    },
    Get_AllDrawingObjects: function (DrawingObjs) {
        if (undefined === DrawingObjs) {
            DrawingObjs = new Array();
        }
        var Rows_Count = this.Content.length;
        for (var CurRow = 0; CurRow < Rows_Count; CurRow++) {
            var Row = this.Content[CurRow];
            var Cells_Count = Row.Get_CellsCount();
            for (var CurCell = 0; CurCell < Cells_Count; CurCell++) {
                var Cell = Row.Get_Cell(CurCell);
                Cell.Content.Get_AllDrawingObjects(DrawingObjs);
            }
        }
        return DrawingObjs;
    },
    Get_PageContentStartPos: function (PageNum, RowIndex, CellIndex) {
        var Row = this.Content[RowIndex];
        var Cell = Row.Get_Cell(CellIndex);
        var CellInfo = Row.Get_CellInfo(CellIndex);
        var VMerge_count = this.Internal_GetVertMergeCount(RowIndex, CellInfo.StartGridCol, Cell.Get_GridSpan());
        RowIndex = RowIndex + VMerge_count - 1;
        Row = this.Content[RowIndex];
        var Pos = this.Parent.Get_PageContentStartPos(PageNum);
        var bHeader = false;
        var Y = Pos.Y;
        if (-1 != this.HeaderInfo.PageIndex && this.HeaderInfo.Count > 0 && PageNum > this.HeaderInfo.PageIndex && true === this.HeaderInfo.Pages[PageNum].Draw) {
            Y = this.HeaderInfo.Pages[PageNum].RowsInfo[this.HeaderInfo.Count - 1].TableRowsBottom;
            bHeader = true;
        }
        var CellSpacing = Row.Get_CellSpacing();
        if (null != CellSpacing) {
            var Table_Border_Top = this.Get_Borders().Top;
            if (border_Single === Table_Border_Top.Value) {
                Y += Table_Border_Top.Size;
            }
            if (true === bHeader || 0 === PageNum || (1 === PageNum && true != this.RowsInfo[0].FirstPage)) {
                Y += CellSpacing;
            } else {
                Y += CellSpacing / 2;
            }
        }
        var MaxTopBorder = 0;
        var CellsCount = Row.Get_CellsCount();
        var TableBorders = this.Get_Borders();
        for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
            var Cell = Row.Get_Cell(CurCell);
            var VMerge = Cell.Get_VMerge();
            if (vmerge_Continue === VMerge) {
                Cell = this.Internal_Get_StartMergedCell(RowIndex, Row.Get_CellInfo(CurCell).StartGridCol, Cell.Get_GridSpan());
            }
            var BorderInfo_Top = Cell.Get_BorderInfo().Top;
            if (null === BorderInfo_Top) {
                continue;
            }
            for (var Index = 0; Index < BorderInfo_Top.length; Index++) {
                var CurBorder = BorderInfo_Top[Index];
                var ResultBorder = this.Internal_CompareBorders(CurBorder, TableBorders.Top, false, true);
                if (border_Single === ResultBorder.Value && MaxTopBorder < ResultBorder.Size) {
                    MaxTopBorder = ResultBorder.Size;
                }
            }
        }
        Y += MaxTopBorder;
        return {
            X: CellInfo.X_content_start,
            XLimit: CellInfo.X_content_end,
            Y: Y,
            YLimit: Pos.YLimit,
            MaxTopBorder: MaxTopBorder
        };
    },
    Get_MaxTopBorder: function (RowIndex) {
        var Row = this.Content[RowIndex];
        var MaxTopBorder = 0;
        var CellsCount = Row.Get_CellsCount();
        var TableBorders = this.Get_Borders();
        for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
            var Cell = Row.Get_Cell(CurCell);
            var VMerge = Cell.Get_VMerge();
            if (vmerge_Continue === VMerge) {
                Cell = this.Internal_Get_StartMergedCell(RowIndex, Row.Get_CellInfo(CurCell).StartGridCol, Cell.Get_GridSpan());
            }
            var BorderInfo_Top = Cell.Get_BorderInfo().Top;
            if (null === BorderInfo_Top) {
                continue;
            }
            for (var Index = 0; Index < BorderInfo_Top.length; Index++) {
                var CurBorder = BorderInfo_Top[Index];
                var ResultBorder = this.Internal_CompareBorders(CurBorder, TableBorders.Top, false, true);
                if (border_Single === ResultBorder.Value && MaxTopBorder < ResultBorder.Size) {
                    MaxTopBorder = ResultBorder.Size;
                }
            }
        }
        return MaxTopBorder;
    },
    Set_DocumentNext: function (Object) {
        History.Add(this, {
            Type: historyitem_Table_DocNext,
            Old: this.Next,
            New: Object
        });
        this.Next = Object;
    },
    Set_DocumentPrev: function (Object) {
        History.Add(this, {
            Type: historyitem_Table_DocPrev,
            Old: this.Prev,
            New: Object
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
    Get_TableOffsetCorrection: function () {
        return 0;
    },
    Get_FirstParagraph: function () {
        return this.Content[0].Content[0].Content.Get_FirstParagraph();
    },
    Get_AllParagraphs_ByNumbering: function (NumPr, ParaArray) {
        var Count = this.Content.length;
        for (var CurRow = 0; CurRow < Count; CurRow++) {
            var Row = this.Content[CurRow];
            var Cells_Count = Row.Get_CellsCount();
            for (var CurCell = 0; CurCell < Cells_Count; CurCell++) {
                var Cell = Row.Get_Cell(CurCell);
                Cell.Content.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
            }
        }
    },
    Get_StartPage_Absolute: function () {
        return this.Parent.Get_StartPage_Absolute() + this.Get_StartPage_Relative();
    },
    Get_StartPage_Relative: function () {
        return this.PageNum;
    },
    GetType: function () {
        return type_Table;
    },
    GetId: function () {
        return this.Get_Id();
    },
    SetId: function (newId) {
        this.Set_Id(newId);
    },
    Get_Type: function () {
        return flowobject_Image;
    },
    Set_Id: function (newId) {
        g_oTableId.Reset_Id(this, newId, this.Id);
        this.Id = newId;
    },
    Copy: function (Parent) {
        var TableGrid = new Array();
        for (var Index = 0; Index < this.TableGrid.length; Index++) {
            TableGrid[Index] = this.TableGrid[Index];
        }
        var Table = new CTable(this.DrawingDocument, Parent, this.Inline, 0, 0, 0, 0, 0, 0, 0, TableGrid);
        Table.Set_TableStyle(this.styleIndex);
        Table.Set_Pr(this.Pr.Copy());
        Table.Set_TableLook(this.TableLook.Copy());
        Table.Rows = this.Rows;
        Table.Cols = this.Cols;
        var Rows = this.Content.length;
        for (var Index = 0; Index < Rows; Index++) {
            Table.Content[Index] = this.Content[Index].Copy(Table);
            History.Add(Table, {
                Type: historyitem_Table_AddRow,
                Pos: Index,
                Item: {
                    Row: Table.Content[Index],
                    TableRowsBottom: {},
                    RowsInfo: {}
                }
            });
        }
        Table.Internal_ReIndexing(0);
        if (Table.Content.length > 0 && Table.Content[0].Get_CellsCount() > 0) {
            Table.CurCell = Table.Content[0].Get_Cell(0);
        }
        Table.Recalc_CompiledPr();
        return Table;
    },
    Shift: function (PageIndex, Dx, Dy) {
        var CurPage = PageIndex;
        this.Pages[PageIndex].Shift(Dx, Dy);
        if (0 === PageIndex) {
            this.X_origin += Dx;
            this.X += Dx;
            this.Y += Dy;
            this.XLimit += Dx;
            this.YLimit += Dy;
        }
        var StartRow = this.Pages[PageIndex].FirstRow;
        var LastRow = this.Pages[PageIndex].LastRow;
        for (var CurRow = StartRow; CurRow <= LastRow; CurRow++) {
            var Row = this.Content[CurRow];
            var CellsCount = Row.Get_CellsCount();
            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                var Cell = Row.Get_Cell(CurCell);
                var CellPageIndex = CurPage - Cell.Content.Get_StartPage_Relative();
                if (vmerge_Restart === Cell.Get_VMerge()) {
                    Cell.Content.Shift(CellPageIndex, Dx, Dy);
                }
            }
            this.RowsInfo[CurRow].Y[CurPage] += Dy;
            this.TableRowsBottom[CurRow][CurPage] += Dy;
        }
    },
    Internal_UpdateFlowPosition: function (X, Y) {
        this.X_origin = X;
        var Dx = this.Get_TableOffsetCorrection();
        this.X = X + Dx;
        this.Y = Y;
        this.Set_PositionH(c_oAscHAnchor.Page, false, this.X);
        this.Set_PositionV(c_oAscVAnchor.Page, false, this.Y);
    },
    Move: function (X, Y, PageNum, NearestPos) {
        var oLogicDocument = editor.WordControl.m_oLogicDocument;
        this.Document_SetThisElementCurrent();
        this.Cursor_MoveToStartPos();
        if (true != this.Is_Inline()) {
            if (false === oLogicDocument.Document_Is_SelectionLocked(changestype_Table_Properties)) {
                oLogicDocument.Create_NewHistoryPoint();
                this.PositionH_Old = {
                    RelativeFrom: this.PositionH.RelativeFrom,
                    Align: this.PositionH.Align,
                    Value: this.PositionH.Value
                };
                this.PositionV_Old = {
                    RelativeFrom: this.PositionV.RelativeFrom,
                    Align: this.PositionV.Align,
                    Value: this.PositionV.Value
                };
                this.PositionH.RelativeFrom = c_oAscHAnchor.PageInternal;
                this.PositionH.Align = false;
                this.PositionH.Value = X;
                this.PositionV.RelativeFrom = c_oAscVAnchor.Page;
                this.PositionV.Align = false;
                this.PositionV.Value = Y;
                this.PageNum = PageNum;
                var NewDocContent = NearestPos.Paragraph.Parent;
                var OldDocContent = this.Parent;
                if (true != NewDocContent.Check_TableCoincidence(this)) {
                    var OldIndex = this.Index;
                    var NewIndex = NearestPos.Paragraph.Index;
                    if (PageNum > NearestPos.Paragraph.Get_StartPage_Absolute()) {
                        if (NearestPos.Paragraph.Pages.length > 2) {
                            var NewParagraph = new Paragraph(NewDocContent.DrawingDocument, NewDocContent, 0, 0, 0, X_Left_Field, Y_Bottom_Field);
                            NearestPos.Paragraph.Split(NewParagraph, NearestPos.ContentPos);
                            NewDocContent.Internal_Content_Add(NewIndex + 1, NewParagraph);
                            if (NewDocContent === OldDocContent && NewIndex + 1 <= OldIndex) {
                                OldIndex++;
                            }
                            NewIndex++;
                        } else {
                            NewIndex++;
                            if (NewIndex >= NewDocContent.Content.length - 1) {
                                NewDocContent.Internal_Content_Add(NewDocContent.Content.length, new Paragraph(NewDocContent.DrawingDocument, NewDocContent, 0, 50, 50, X_Right_Field, Y_Bottom_Field));
                            }
                        }
                    }
                    if (NewDocContent != OldDocContent) {
                        NewDocContent.Internal_Content_Add(NewIndex, this);
                        OldDocContent.Internal_Content_Remove(OldIndex, 1);
                        this.Parent = NewDocContent;
                    } else {
                        if (NearestPos.Paragraph.Index > this.Index) {
                            NewDocContent.Internal_Content_Add(NewIndex, this);
                            OldDocContent.Internal_Content_Remove(OldIndex, 1);
                        } else {
                            OldDocContent.Internal_Content_Remove(OldIndex, 1);
                            NewDocContent.Internal_Content_Add(NewIndex, this);
                        }
                    }
                }
                editor.WordControl.m_oLogicDocument.Recalculate();
            }
        } else {
            if (false === oLogicDocument.Document_Is_SelectionLocked(changestype_Table_Properties, {
                Type: changestype_2_InlineObjectMove,
                PageNum: PageNum,
                X: X,
                Y: Y
            })) {
                oLogicDocument.Create_NewHistoryPoint();
                var NewDocContent = NearestPos.Paragraph.Parent;
                var OldDocContent = this.Parent;
                if (true != NewDocContent.Check_TableCoincidence(this)) {
                    var TarParagraph = NearestPos.Paragraph;
                    var ParaContentPos = NearestPos.ContentPos;
                    var OldIndex = this.Index;
                    var NewIndex = NearestPos.Paragraph.Index;
                    if (true === TarParagraph.Cursor_IsEnd(ParaContentPos)) {
                        NewIndex++;
                    } else {
                        if (true != TarParagraph.Cursor_IsStart(ParaContentPos)) {
                            var NewParagraph = new Paragraph(NewDocContent.DrawingDocument, NewDocContent, 0, 0, 0, X_Left_Field, Y_Bottom_Field);
                            NearestPos.Paragraph.Split(NewParagraph, NearestPos.ContentPos);
                            NewDocContent.Internal_Content_Add(NewIndex + 1, NewParagraph);
                            if (NewDocContent === OldDocContent && NewIndex + 1 <= OldIndex) {
                                OldIndex++;
                            }
                            NewIndex++;
                        }
                    }
                    if (NewDocContent != OldDocContent) {
                        NewDocContent.Internal_Content_Add(NewIndex, this);
                        OldDocContent.Internal_Content_Remove(OldIndex, 1);
                        this.Parent = NewDocContent;
                    } else {
                        if (NearestPos.Paragraph.Index > this.Index) {
                            NewDocContent.Internal_Content_Add(NewIndex, this);
                            OldDocContent.Internal_Content_Remove(OldIndex, 1);
                        } else {
                            OldDocContent.Internal_Content_Remove(OldIndex, 1);
                            NewDocContent.Internal_Content_Add(NewIndex, this);
                        }
                    }
                    editor.WordControl.m_oLogicDocument.Recalculate();
                }
            }
        }
        editor.WordControl.m_oLogicDocument.Selection_Remove();
        this.Document_SetThisElementCurrent();
        this.Cursor_MoveToStartPos();
        editor.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
    },
    Reset: function (X, Y, XLimit, YLimit, PageNum) {
        if (this.Parent.RecalcInfo.FlowObject === this && c_oAscVAnchor.Text === this.PositionV.RelativeFrom) {
            this.Y -= this.PositionV.Value;
            this.YLimit -= this.PositionV.Value;
            return;
        }
        this.X_origin = X;
        var Dx = this.Get_TableOffsetCorrection();
        this.X = X + Dx;
        this.Y = Y + 0.001;
        this.XLimit = XLimit;
        this.YLimit = YLimit;
        this.PageNum = PageNum;
        this.Pages.length = 1;
        this.Pages[0] = new CTablePage(X, Y, XLimit, YLimit, 0, 0);
    },
    Recalculate: function () {
        this.Internal_RecalculateGrid();
        this.Internal_Recalculate_1();
    },
    Recalculate_Page: function (_PageIndex) {
        var PageIndex = _PageIndex - this.PageNum;
        if (0 === PageIndex) {
            this.Internal_RecalculateGrid();
            this.Internal_Recalculate_Header();
            this.Internal_Recalculate_Borders();
            this.Internal_Recalculate_Position_1();
            this.Internal_Check_TableRows(false);
        }
        var Result = this.Internal_Recalculate_1_(PageIndex);
        this.Internal_Recalculate_Position_2(PageIndex);
        return Result;
    },
    RecalculateCurPos: function () {
        if (null != this.CurCell) {
            this.CurCell.Content.RecalculateCurPos();
        }
    },
    Recalculate_MinMaxContentWidth: function () {
        var MinMargin = new Array(),
        MinContent = new Array(),
        MaxContent = new Array(),
        MaxFlags = new Array();
        var GridCount = this.TableGrid.length;
        for (var CurCol = 0; CurCol < GridCount; CurCol++) {
            MinMargin[CurCol] = 0;
            MinContent[CurCol] = 0;
            MaxContent[CurCol] = 0;
            MaxFlags[CurCol] = false;
        }
        var RowsCount = this.Content.length;
        for (var CurRow = 0; CurRow < RowsCount; CurRow++) {
            var Row = this.Content[CurRow];
            var BeforeInfo = Row.Get_Before();
            var CurGridCol = BeforeInfo.GridBefore;
            var CellsCount = Row.Get_CellsCount();
            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                var Cell = Row.Get_Cell(CurCell);
                var CellMinMax = Cell.Content.Recalculate_MinMaxContentWidth();
                var CellMin = CellMinMax.Min;
                var CellMax = CellMinMax.Max;
                var GridSpan = Cell.Get_GridSpan();
                var CellMargins = Cell.Get_Margins();
                var CellMarginsW = CellMargins.Left.W + CellMargins.Right.W;
                var CellW = Cell.Get_W();
                if (MinMargin[CurGridCol] < CellMarginsW) {
                    MinMargin[CurGridCol] = CellMarginsW;
                }
                if (1 === GridSpan) {
                    if (MinContent[CurGridCol] < CellMin) {
                        MinContent[CurGridCol] = CellMin;
                    }
                    if (false === MaxFlags[CurGridCol] && MaxContent[CurGridCol] < CellMax) {
                        MaxContent[CurGridCol] = CellMax;
                    }
                    if (CellW.Type === tblwidth_Mm) {
                        if (false === MaxFlags[CurGridCol]) {
                            MaxFlags[CurGridCol] = true;
                            MaxContent[CurGridCol] = CellW.W;
                        } else {
                            if (MaxContent[CurGridCol] < CellW.W) {
                                MaxContent[CurGridCol] = CellW.W;
                            }
                        }
                    }
                } else {
                    var SumSpanMinContent = 0;
                    var SumSpanMaxContent = 0;
                    for (var CurSpan = CurGridCol; CurSpan < CurGridCol + GridSpan; CurSpan++) {
                        SumSpanMinContent += MinContent[CurSpan];
                        SumSpanMaxContent += MaxContent[CurSpan];
                    }
                    if (SumSpanMinContent < CellMin) {
                        var TempAdd = (CellMin - SumSpanMinContent) / GridSpan;
                        for (var CurSpan = CurGridCol; CurSpan < CurGridCol + GridSpan; CurSpan++) {
                            MinContent[CurSpan] += TempAdd;
                        }
                    }
                    if (CellW.Type === tblwidth_Mm && CellW.W > CellMax) {
                        CellMax = CellW.W;
                    }
                    if (SumSpanMaxContent < CellMax) {
                        var TempAdd = (CellMax - SumSpanMaxContent) / GridSpan;
                        for (var CurSpan = CurGridCol; CurSpan < CurGridCol + GridSpan; CurSpan++) {
                            MaxContent[CurSpan] += TempAdd;
                        }
                    }
                }
                CurGridCol += GridSpan;
            }
        }
        var Min = 0;
        var Max = 0;
        for (var CurCol = 0; CurCol < GridCount; CurCol++) {
            Min += MinMargin[CurCol] + MinContent[CurCol];
            if (false === MaxFlags[CurCol]) {
                Max += MinMargin[CurCol] + MaxContent[CurCol];
            } else {
                Max += MaxContent[CurCol];
            }
        }
        return {
            Min: Min,
            Max: Max
        };
    },
    Draw: function (nPageIndex, pGraphics) {
        var PNum = nPageIndex - this.PageNum;
        if (PNum < 0 || PNum >= this.Pages.length) {
            return 0;
        }
        var Row_start = this.Pages[PNum].FirstRow;
        var Row_last = this.Pages[PNum].LastRow;
        if ((Row_start != Row_last || (0 === Row_start && 0 === Row_last)) && false === this.RowsInfo[Row_last].FirstPage) {
            Row_last--;
        }
        if (Row_last < Row_start) {
            return -1;
        }
        var bIsSmartGrForcing = false;
        if (pGraphics.StartCheckTableDraw) {
            bIsSmartGrForcing = pGraphics.StartCheckTableDraw();
        }
        this.Internal_Draw_1(pGraphics, PNum, Row_start, Row_last);
        this.Internal_Draw_2(pGraphics, PNum, Row_start, Row_last);
        this.Internal_Draw_3(pGraphics, PNum, Row_start, Row_last);
        this.Internal_Draw_4(pGraphics, PNum, Row_start, Row_last);
        if (pGraphics.EndCheckTableDraw) {
            pGraphics.EndCheckTableDraw(bIsSmartGrForcing);
        }
        if (PNum < this.Pages.length - 1) {
            return -1;
        }
        return 0;
    },
    Internal_Draw_1: function (pGraphics, PNum, Row_start, Row_last) {
        var TableShd = this.Get_Shd();
        var X_left_old = null;
        var X_right_old = null;
        var Y_top = this.Pages[PNum].Bounds.Top;
        var Y_bottom = this.Pages[PNum].Bounds.Top;
        var LockType = this.Lock.Get_Type();
        if (locktype_None != LockType) {}
        var TableBorders = this.Get_Borders();
        var bHeader = false;
        if (this.HeaderInfo.Count > 0 && PNum > this.HeaderInfo.PageIndex && true === this.HeaderInfo.Pages[PNum].Draw) {
            bHeader = true;
            var HeaderPage = this.HeaderInfo.Pages[PNum];
            for (var CurRow = 0; CurRow < this.HeaderInfo.Count; CurRow++) {
                var Row = HeaderPage.Rows[CurRow];
                var CellSpacing = Row.Get_CellSpacing();
                var CellsCount = Row.Get_CellsCount();
                var X_left_new = Row.Get_CellInfo(0).X_grid_start;
                var X_right_new = Row.Get_CellInfo(CellsCount - 1).X_grid_end;
                Y_bottom = HeaderPage.RowsInfo[CurRow].Y + HeaderPage.RowsInfo[CurRow].H;
                var PrevCellSpacing = (CurRow < this.HeaderInfo.Count - 1 ? HeaderPage.Rows[CurRow + 1].Get_CellSpacing() : this.Content[Row_start].Get_CellSpacing());
                Y_bottom += (PrevCellSpacing + CellSpacing) / 4;
                this.Internal_Draw_1_(pGraphics, TableShd, (null != CellSpacing ? true : false), TableBorders, X_left_new, X_left_old, X_right_new, X_right_old, Y_top, Y_bottom, (0 === CurRow ? true : false), false);
                X_left_old = X_left_new;
                X_right_old = X_right_new;
                Y_top = Y_bottom;
            }
        }
        for (var CurRow = Row_start; CurRow <= Row_last; CurRow++) {
            var Row = this.Content[CurRow];
            var CellSpacing = Row.Get_CellSpacing();
            var CellsCount = Row.Get_CellsCount();
            var X_left_new = Row.Get_CellInfo(0).X_grid_start;
            var X_right_new = Row.Get_CellInfo(CellsCount - 1).X_grid_end;
            Y_bottom = this.RowsInfo[CurRow].Y[PNum] + this.RowsInfo[CurRow].H[PNum];
            if (this.Content.length - 1 === CurRow) {
                Y_bottom += Row.Get_CellSpacing();
            } else {
                var CellSpacing = Row.Get_CellSpacing();
                var PrevCellSpacing = this.Content[CurRow + 1].Get_CellSpacing();
                Y_bottom += (PrevCellSpacing + CellSpacing) / 4;
            }
            if (null != CellSpacing && PNum != this.Pages.length - 1 && CurRow === Row_last) {
                Y_bottom += this.Pages[PNum].MaxBotBorder;
            }
            this.Internal_Draw_1_(pGraphics, TableShd, (null != CellSpacing ? true : false), TableBorders, X_left_new, X_left_old, X_right_new, X_right_old, Y_top, Y_bottom, (true != bHeader && Row_start === CurRow ? true : false), (Row_last === CurRow ? true : false));
            X_left_old = X_left_new;
            X_right_old = X_right_new;
            Y_top = Y_bottom;
        }
    },
    Internal_Draw_1_: function (pGraphics, TableShd, bBorder, TableBorders, X_left_new, X_left_old, X_right_new, X_right_old, Y_top, Y_bottom, bStartRow, bLastRow) {
        if (shd_Nil != TableShd.Value) {
            pGraphics.b_color1(TableShd.Color.r, TableShd.Color.g, TableShd.Color.b, 255);
            pGraphics.TableRect(Math.min(X_left_new, X_right_new), Math.min(Y_top, Y_bottom), Math.abs(X_right_new - X_left_new), Math.abs(Y_bottom - Y_top));
        }
        if (true === bBorder) {
            if (border_Single === TableBorders.Left.Value) {
                pGraphics.p_color(TableBorders.Left.Color.r, TableBorders.Left.Color.g, TableBorders.Left.Color.b, 255);
                if (null === X_left_old || Math.abs(X_left_new - X_left_old) < 0.001) {
                    pGraphics.drawVerLine(c_oAscLineDrawingRule.Center, X_left_new, Y_top, Y_bottom, TableBorders.Left.Size);
                } else {
                    if (X_left_new > X_left_old) {
                        pGraphics.drawHorLineExt(c_oAscLineDrawingRule.Top, Y_top, X_left_old, X_left_new, TableBorders.Left.Size, -TableBorders.Left.Size / 2, 0);
                    } else {
                        pGraphics.drawHorLineExt(c_oAscLineDrawingRule.Bottom, Y_top, X_left_old, X_left_new, TableBorders.Left.Size, +TableBorders.Left.Size / 2, -TableBorders.Left.Size / 2);
                    }
                    pGraphics.drawVerLine(c_oAscLineDrawingRule.Center, X_left_new, Y_top, Y_bottom, TableBorders.Left.Size);
                }
            } else {
                if (null === X_left_old || Math.abs(X_left_new - X_left_old) < 0.001) {
                    pGraphics.DrawEmptyTableLine(X_left_new, Y_top, X_left_new, Y_bottom);
                } else {
                    pGraphics.DrawEmptyTableLine(X_left_old, Y_top, X_left_new, Y_top);
                    pGraphics.DrawEmptyTableLine(X_left_new, Y_top, X_left_new, Y_bottom);
                }
            }
            if (border_Single === TableBorders.Right.Value) {
                pGraphics.p_color(TableBorders.Right.Color.r, TableBorders.Right.Color.g, TableBorders.Right.Color.b, 255);
                if (null === X_right_old || Math.abs(X_right_new - X_right_old) < 0.001) {
                    pGraphics.drawVerLine(c_oAscLineDrawingRule.Center, X_right_new, Y_top, Y_bottom, TableBorders.Right.Size);
                } else {
                    if (X_right_new > X_right_old) {
                        pGraphics.drawHorLineExt(c_oAscLineDrawingRule.Bottom, Y_top, X_right_old, X_right_new, TableBorders.Right.Size, -TableBorders.Right.Size / 2, +TableBorders.Right.Size / 2);
                    } else {
                        pGraphics.drawHorLineExt(c_oAscLineDrawingRule.Top, Y_top, X_right_old, X_right_new, TableBorders.Right.Size, +TableBorders.Right.Size / 2, 0);
                    }
                    pGraphics.drawVerLine(c_oAscLineDrawingRule.Center, X_right_new, Y_top, Y_bottom, TableBorders.Right.Size);
                }
            } else {
                if (null === X_right_old || Math.abs(X_right_new - X_right_old) < 0.001) {
                    pGraphics.DrawEmptyTableLine(X_right_new, Y_top, X_right_new, Y_bottom);
                } else {
                    pGraphics.DrawEmptyTableLine(X_right_old, Y_top, X_right_new, Y_top);
                    pGraphics.DrawEmptyTableLine(X_right_new, Y_top, X_right_new, Y_bottom);
                }
            }
            if (true === bStartRow) {
                if (border_Single === TableBorders.Top.Value) {
                    pGraphics.p_color(TableBorders.Top.Color.r, TableBorders.Top.Color.g, TableBorders.Top.Color.b, 255);
                    var LeftMW = 0;
                    if (border_Single === TableBorders.Left.Value) {
                        LeftMW = -TableBorders.Left.Size / 2;
                    }
                    var RightMW = 0;
                    if (border_Single === TableBorders.Right.Value) {
                        RightMW = +TableBorders.Right.Size / 2;
                    }
                    pGraphics.drawHorLineExt(c_oAscLineDrawingRule.Top, Y_top, X_left_new, X_right_new, TableBorders.Top.Size, LeftMW, RightMW);
                } else {
                    pGraphics.DrawEmptyTableLine(X_left_new, Y_top, X_right_new, Y_top);
                }
            }
            if (true === bLastRow) {
                if (border_Single === TableBorders.Bottom.Value) {
                    pGraphics.p_color(TableBorders.Bottom.Color.r, TableBorders.Bottom.Color.g, TableBorders.Bottom.Color.b, 255);
                    var LeftMW = 0;
                    if (border_Single === TableBorders.Left.Value) {
                        LeftMW = -TableBorders.Left.Size / 2;
                    }
                    var RightMW = 0;
                    if (border_Single === TableBorders.Right.Value) {
                        RightMW = +TableBorders.Right.Size / 2;
                    }
                    pGraphics.drawHorLineExt(c_oAscLineDrawingRule.Top, Y_bottom, X_left_new, X_right_new, TableBorders.Bottom.Size, LeftMW, RightMW);
                } else {
                    pGraphics.DrawEmptyTableLine(X_left_new, Y_bottom, X_right_new, Y_bottom);
                }
            }
        }
    },
    Internal_Draw_2: function (pGraphics, PNum, Row_start, Row_last) {
        if (this.HeaderInfo.Count > 0 && PNum > this.HeaderInfo.PageIndex && true === this.HeaderInfo.Pages[PNum].Draw) {
            var HeaderPage = this.HeaderInfo.Pages[PNum];
            for (var CurRow = 0; CurRow < this.HeaderInfo.Count; CurRow++) {
                var Row = HeaderPage.Rows[CurRow];
                var CellsCount = Row.Get_CellsCount();
                var Y = HeaderPage.RowsInfo[CurRow].Y;
                for (var CurCell = CellsCount - 1; CurCell >= 0; CurCell--) {
                    var Cell = Row.Get_Cell(CurCell);
                    var GridSpan = Cell.Get_GridSpan();
                    var VMerge = Cell.Get_VMerge();
                    var CurGridCol = Row.Get_CellInfo(CurCell).StartGridCol;
                    if (vmerge_Continue === VMerge) {
                        continue;
                    }
                    var CellInfo = Row.Get_CellInfo(CurCell);
                    var X_cell_start = CellInfo.X_cell_start;
                    var X_cell_end = CellInfo.X_cell_end;
                    var VMergeCount = this.Internal_GetVertMergeCount(CurRow, CurGridCol, GridSpan);
                    var RealHeight = HeaderPage.RowsInfo[CurRow + VMergeCount - 1].Y + HeaderPage.RowsInfo[CurRow + VMergeCount - 1].H - Y;
                    var CellShd = Cell.Get_Shd();
                    if (shd_Nil != CellShd.Value) {
                        pGraphics.b_color1(CellShd.Color.r, CellShd.Color.g, CellShd.Color.b, 255);
                        pGraphics.TableRect(Math.min(X_cell_start, X_cell_end), Math.min(Y, Y + RealHeight), Math.abs(X_cell_end - X_cell_start), Math.abs(RealHeight));
                    }
                }
            }
        }
        for (var CurRow = Row_start; CurRow <= Row_last; CurRow++) {
            var Row = this.Content[CurRow];
            var CellsCount = Row.Get_CellsCount();
            var Y = this.RowsInfo[CurRow].Y[PNum];
            for (var CurCell = CellsCount - 1; CurCell >= 0; CurCell--) {
                var Cell = Row.Get_Cell(CurCell);
                var GridSpan = Cell.Get_GridSpan();
                var VMerge = Cell.Get_VMerge();
                var CurGridCol = Row.Get_CellInfo(CurCell).StartGridCol;
                if (vmerge_Continue === VMerge) {
                    if (Row_start === CurRow) {
                        Cell = this.Internal_Get_StartMergedCell(CurRow, CurGridCol, GridSpan);
                        if (null === Cell) {
                            continue;
                        }
                    } else {
                        continue;
                    }
                }
                var CellInfo = Row.Get_CellInfo(CurCell);
                var X_cell_start = CellInfo.X_cell_start;
                var X_cell_end = CellInfo.X_cell_end;
                var VMergeCount = this.Internal_GetVertMergeCount(CurRow, CurGridCol, GridSpan);
                if (PNum + 1 < this.Pages.length) {
                    if (CurRow + VMergeCount - 1 >= this.Pages[PNum + 1].FirstRow) {
                        VMergeCount = this.Pages[PNum + 1].FirstRow + 1 - CurRow;
                        if (false === this.RowsInfo[CurRow + VMergeCount - 1].FirstPage && PNum === this.RowsInfo[CurRow + VMergeCount - 1].StartPage) {
                            VMergeCount--;
                        }
                        if (VMergeCount <= 0) {
                            continue;
                        }
                    }
                }
                var RealHeight = this.RowsInfo[CurRow + VMergeCount - 1].Y[PNum] + this.RowsInfo[CurRow + VMergeCount - 1].H[PNum] - Y;
                var CellShd = Cell.Get_Shd();
                if (shd_Nil != CellShd.Value) {
                    pGraphics.b_color1(CellShd.Color.r, CellShd.Color.g, CellShd.Color.b, 255);
                    pGraphics.TableRect(Math.min(X_cell_start, X_cell_end), Math.min(Y, Y + RealHeight), Math.abs(X_cell_end - X_cell_start), Math.abs(RealHeight));
                }
            }
        }
    },
    Internal_Draw_3: function (pGraphics, PNum, Row_start, Row_last) {
        if (this.HeaderInfo.Count > 0 && PNum > this.HeaderInfo.PageIndex && true === this.HeaderInfo.Pages[PNum].Draw) {
            var HeaderPage = this.HeaderInfo.Pages[PNum];
            for (var CurRow = 0; CurRow < this.HeaderInfo.Count; CurRow++) {
                var Row = HeaderPage.Rows[CurRow];
                var CellsCount = Row.Get_CellsCount();
                for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                    var Cell = Row.Get_Cell(CurCell);
                    var VMerge = Cell.Get_VMerge();
                    if (vmerge_Continue === VMerge) {
                        continue;
                    }
                    Cell.Content_Draw(PNum, pGraphics);
                }
            }
        }
        for (var CurRow = Row_start; CurRow <= Row_last; CurRow++) {
            var Row = this.Content[CurRow];
            var CellsCount = Row.Get_CellsCount();
            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                var Cell = Row.Get_Cell(CurCell);
                var GridSpan = Cell.Get_GridSpan();
                var VMerge = Cell.Get_VMerge();
                var CurGridCol = Row.Get_CellInfo(CurCell).StartGridCol;
                if (vmerge_Continue === VMerge) {
                    if (Row_start === CurRow) {
                        Cell = this.Internal_Get_StartMergedCell(CurRow, CurGridCol, GridSpan);
                        if (null === Cell) {
                            continue;
                        }
                    } else {
                        continue;
                    }
                }
                var VMergeCount = this.Internal_GetVertMergeCount(CurRow, CurGridCol, GridSpan);
                if (PNum + 1 < this.Pages.length) {
                    if (CurRow + VMergeCount - 1 >= this.Pages[PNum + 1].FirstRow) {
                        VMergeCount = this.Pages[PNum + 1].FirstRow + 1 - CurRow;
                        if (false === this.RowsInfo[CurRow + VMergeCount - 1].FirstPage && PNum === this.RowsInfo[CurRow + VMergeCount - 1].StartPage) {
                            VMergeCount--;
                        }
                        if (VMergeCount <= 0) {
                            continue;
                        }
                    }
                }
                Cell.Content_Draw(PNum, pGraphics);
            }
        }
    },
    Internal_Draw_4: function (pGraphics, PNum, Row_start, Row_last) {
        var TableBorders = this.Get_Borders();
        if (this.HeaderInfo.Count > 0 && PNum > this.HeaderInfo.PageIndex && true === this.HeaderInfo.Pages[PNum].Draw) {
            var Y = this.Y;
            var HeaderPage = this.HeaderInfo.Pages[PNum];
            for (var CurRow = 0; CurRow < this.HeaderInfo.Count; CurRow++) {
                var Row = HeaderPage.Rows[CurRow];
                var CellsCount = Row.Get_CellsCount();
                var CellSpacing = Row.Get_CellSpacing();
                Y = HeaderPage.RowsInfo[CurRow].Y;
                var LastBorderTop = {
                    W: 0,
                    L: 0
                };
                for (var CurCell = CellsCount - 1; CurCell >= 0; CurCell--) {
                    var Cell = Row.Get_Cell(CurCell);
                    var GridSpan = Cell.Get_GridSpan();
                    var VMerge = Cell.Get_VMerge();
                    var CurGridCol = Row.Get_CellInfo(CurCell).StartGridCol;
                    if (vmerge_Continue === VMerge) {
                        LastBorderTop = {
                            W: 0,
                            L: 0
                        };
                        continue;
                    }
                    var CellInfo = Row.Get_CellInfo(CurCell);
                    var X_cell_start = CellInfo.X_cell_start;
                    var X_cell_end = CellInfo.X_cell_end;
                    var VMergeCount = this.Internal_GetVertMergeCount(CurRow, CurGridCol, GridSpan);
                    var RealHeight = HeaderPage.RowsInfo[CurRow + VMergeCount - 1].Y + HeaderPage.RowsInfo[CurRow + VMergeCount - 1].H - Y;
                    var CellBorders = Cell.Get_Borders();
                    if (null != CellSpacing) {
                        if (border_Single === CellBorders.Left.Value) {
                            pGraphics.p_color(CellBorders.Left.Color.r, CellBorders.Left.Color.g, CellBorders.Left.Color.b, 255);
                            pGraphics.drawVerLine(c_oAscLineDrawingRule.Left, X_cell_start, Y, Y + RealHeight, CellBorders.Left.Size);
                        } else {
                            pGraphics.DrawEmptyTableLine(X_cell_start, Y, X_cell_start, Y + RealHeight);
                        }
                        if (border_Single === CellBorders.Right.Value) {
                            pGraphics.p_color(CellBorders.Right.Color.r, CellBorders.Right.Color.g, CellBorders.Right.Color.b, 255);
                            pGraphics.drawVerLine(c_oAscLineDrawingRule.Right, X_cell_end, Y, Y + RealHeight, CellBorders.Right.Size);
                        } else {
                            pGraphics.DrawEmptyTableLine(X_cell_end, Y, X_cell_end, Y + RealHeight);
                        }
                        if (border_Single === CellBorders.Top.Value) {
                            pGraphics.p_color(CellBorders.Top.Color.r, CellBorders.Top.Color.g, CellBorders.Top.Color.b, 255);
                            pGraphics.drawHorLineExt(c_oAscLineDrawingRule.Top, Y - CellBorders.Top.Size, X_cell_start, X_cell_end, CellBorders.Top.Size, 0, 0);
                        } else {
                            pGraphics.DrawEmptyTableLine(X_cell_start, Y, X_cell_end, Y);
                        }
                        if (border_Single === CellBorders.Bottom.Value) {
                            pGraphics.p_color(CellBorders.Bottom.Color.r, CellBorders.Bottom.Color.g, CellBorders.Bottom.Color.b, 255);
                            pGraphics.drawHorLineExt(c_oAscLineDrawingRule.Bottom, Y + RealHeight + CellBorders.Bottom.Size, X_cell_start, X_cell_end, CellBorders.Bottom.Size, 0, 0);
                        } else {
                            pGraphics.DrawEmptyTableLine(X_cell_start, Y + RealHeight, X_cell_end, Y + RealHeight);
                        }
                    } else {
                        var CellBordersInfo = Cell.Get_BorderInfo();
                        var BorderInfo_Left = CellBordersInfo.Left;
                        var TempCurRow = Cell.Row.Index;
                        var Row_side_border_start = 0;
                        var Row_side_border_end = BorderInfo_Left.length - 1;
                        for (var Index = Row_side_border_start; Index <= Row_side_border_end; Index++) {
                            var CurBorderInfo = BorderInfo_Left[Index];
                            var Y0 = HeaderPage.RowsInfo[TempCurRow + Index].Y;
                            var Y1 = HeaderPage.RowsInfo[TempCurRow + Index].Y + HeaderPage.RowsInfo[TempCurRow + Index].H;
                            if (border_Single === CurBorderInfo.Value) {
                                pGraphics.p_color(CurBorderInfo.Color.r, CurBorderInfo.Color.g, CurBorderInfo.Color.b, 255);
                                pGraphics.drawVerLine(c_oAscLineDrawingRule.Center, X_cell_start, Y0, Y1, CurBorderInfo.Size);
                            } else {
                                if (0 === CurCell) {
                                    pGraphics.DrawEmptyTableLine(X_cell_start, Y0, X_cell_start, Y1);
                                }
                            }
                        }
                        var BorderInfo_Right = CellBordersInfo.Right;
                        for (var Index = Row_side_border_start; Index <= Row_side_border_end; Index++) {
                            var CurBorderInfo = BorderInfo_Right[Index];
                            var Y0 = HeaderPage.RowsInfo[TempCurRow + Index].Y;
                            var Y1 = HeaderPage.RowsInfo[TempCurRow + Index].Y + HeaderPage.RowsInfo[TempCurRow + Index].H;
                            var TempCellIndex = this.Internal_Get_Cell_ByStartGridCol(TempCurRow + Index, CellInfo.StartGridCol);
                            var TempCellsCount = HeaderPage.Rows[TempCurRow + Index].Get_CellsCount();
                            if (TempCellsCount - 1 === TempCellIndex) {
                                if (border_Single === CurBorderInfo.Value) {
                                    pGraphics.p_color(CurBorderInfo.Color.r, CurBorderInfo.Color.g, CurBorderInfo.Color.b, 255);
                                    pGraphics.drawVerLine(c_oAscLineDrawingRule.Center, X_cell_end, Y0, Y1, CurBorderInfo.Size);
                                } else {
                                    pGraphics.DrawEmptyTableLine(X_cell_end, Y0, X_cell_end, Y1);
                                }
                            } else {
                                if (border_None === CurBorderInfo.Value) {
                                    pGraphics.DrawEmptyTableLine(X_cell_end, Y0, X_cell_end, Y1);
                                }
                            }
                        }
                        var LastBorderTop_prev = {
                            W: LastBorderTop.W,
                            H: LastBorderTop.H
                        };
                        var BorderInfo_Top = CellBordersInfo.Top;
                        for (var Index = 0; Index < BorderInfo_Top.length; Index++) {
                            var CurBorderInfo = BorderInfo_Top[Index];
                            if (0 != PNum && CurRow === Row_start) {
                                CurBorderInfo = this.Internal_CompareBorders(TableBorders.Top, CurBorderInfo, true, false);
                            }
                            var X0 = this.X + this.TableSumGrid[Index + CurGridCol - 1];
                            var X1 = this.X + this.TableSumGrid[Index + CurGridCol];
                            var LeftMW = 0;
                            var RightMW = 0;
                            if (BorderInfo_Top.length - 1 === Index) {
                                var Max_r = 0;
                                if (0 != CurRow) {
                                    var Prev_Row = HeaderPage.Rows[CurRow - 1];
                                    var Prev_CellsCount = Prev_Row.Get_CellsCount();
                                    for (var TempIndex = 0; TempIndex < Prev_CellsCount; TempIndex++) {
                                        var Prev_Cell = Prev_Row.Get_Cell(TempIndex);
                                        var Prev_GridCol = Prev_Row.Get_CellInfo(TempIndex).StartGridCol;
                                        var Prev_GridSpan = Prev_Cell.Get_GridSpan();
                                        var bLeft = null;
                                        if (Prev_GridCol === Index + CurGridCol + 1) {
                                            bLeft = true;
                                        } else {
                                            if (Prev_GridCol + Prev_GridSpan === Index + CurGridCol + 1) {
                                                bLeft = false;
                                            } else {
                                                if (Prev_GridCol > CurGridCol) {
                                                    break;
                                                }
                                            }
                                        }
                                        if (null != bLeft) {
                                            var Prev_VMerge = Prev_Cell.Get_VMerge();
                                            if (vmerge_Continue === Prev_VMerge) {
                                                Prev_Cell = this.Internal_Get_StartMergedCell(CurRow - 1, Prev_GridCol, Prev_GridSpan);
                                            }
                                            if (null === Prev_Cell) {
                                                break;
                                            }
                                            var Num = CurRow - 1 - Prev_Cell.Row.Index;
                                            if (Num < 0) {
                                                break;
                                            }
                                            if (true === bLeft) {
                                                var Prev_Cell_BorderInfo_Left = Prev_Cell.Get_BorderInfo().Left;
                                                if (null != Prev_Cell_BorderInfo_Left && Prev_Cell_BorderInfo_Left.length > Num && border_Single === Prev_Cell_BorderInfo_Left[Num].Value) {
                                                    Max_r = Prev_Cell_BorderInfo_Left[Num].Size / 2;
                                                }
                                            } else {
                                                var Prev_Cell_BorderInfo_Right = Prev_Cell.Get_BorderInfo().Right;
                                                if (null != Prev_Cell_BorderInfo_Right && Prev_Cell_BorderInfo_Right.length > Num && border_Single === Prev_Cell_BorderInfo_Right[Num].Value) {
                                                    Max_r = Prev_Cell_BorderInfo_Right[Num].Size / 2;
                                                }
                                            }
                                            break;
                                        }
                                    }
                                }
                                if (BorderInfo_Right.length > 0 && border_Single === BorderInfo_Right[0].Value && BorderInfo_Right[0].Size / 2 > Max_r) {
                                    Max_r = BorderInfo_Right[0].Size / 2;
                                }
                                if (border_Single === CurBorderInfo.Value && CurBorderInfo.Size > LastBorderTop_prev.W) {
                                    RightMW = Max_r;
                                } else {
                                    RightMW = -Max_r;
                                }
                            }
                            if (0 === Index) {
                                var Max_l = 0;
                                if (0 != CurRow) {
                                    var Prev_Row = this.Content[CurRow - 1];
                                    var Prev_CellsCount = Prev_Row.Get_CellsCount();
                                    for (var TempIndex = 0; TempIndex < Prev_CellsCount; TempIndex++) {
                                        var Prev_Cell = Prev_Row.Get_Cell(TempIndex);
                                        var Prev_GridCol = Prev_Row.Get_CellInfo(TempIndex).StartGridCol;
                                        var Prev_GridSpan = Prev_Cell.Get_GridSpan();
                                        var bLeft = null;
                                        if (Prev_GridCol === CurGridCol) {
                                            bLeft = true;
                                        } else {
                                            if (Prev_GridCol + Prev_GridSpan === CurGridCol) {
                                                bLeft = false;
                                            } else {
                                                if (Prev_GridCol > CurGridCol) {
                                                    break;
                                                }
                                            }
                                        }
                                        if (null != bLeft) {
                                            var Prev_VMerge = Prev_Cell.Get_VMerge();
                                            if (vmerge_Continue === Prev_VMerge) {
                                                Prev_Cell = this.Internal_Get_StartMergedCell(CurRow - 1, Prev_GridCol, Prev_GridSpan);
                                            }
                                            if (null === Prev_Cell) {
                                                break;
                                            }
                                            var Num = CurRow - 1 - Prev_Cell.Row.Index;
                                            if (Num < 0) {
                                                break;
                                            }
                                            if (true === bLeft) {
                                                var Prev_Cell_BorderInfo_Left = Prev_Cell.Get_BorderInfo().Left;
                                                if (null != Prev_Cell_BorderInfo_Left && Prev_Cell_BorderInfo_Left.length > Num && border_Single === Prev_Cell_BorderInfo_Left[Num].Value) {
                                                    Max_l = Prev_Cell_BorderInfo_Left[Num].Size / 2;
                                                }
                                            } else {
                                                var Prev_Cell_BorderInfo_Right = Prev_Cell.Get_BorderInfo().Right;
                                                if (null != Prev_Cell_BorderInfo_Right && Prev_Cell_BorderInfo_Right.length > Num && border_Single === Prev_Cell_BorderInfo_Right[Num].Value) {
                                                    Max_l = Prev_Cell_BorderInfo_Right[Num].Size / 2;
                                                }
                                            }
                                            break;
                                        }
                                    }
                                }
                                if (BorderInfo_Left.length > 0 && border_Single === BorderInfo_Left[0].Value && BorderInfo_Left[0].Size / 2 > Max_l) {
                                    Max_l = BorderInfo_Left[0].Size / 2;
                                }
                                LastBorderTop.L = Max_l;
                                LastBorderTop.W = 0;
                                if (border_Single === CurBorderInfo.Value) {
                                    LastBorderTop.W = CurBorderInfo.Size;
                                }
                            }
                            if (border_Single === CurBorderInfo.Value) {
                                pGraphics.p_color(CurBorderInfo.Color.r, CurBorderInfo.Color.g, CurBorderInfo.Color.b, 255);
                                pGraphics.drawHorLineExt(c_oAscLineDrawingRule.Top, Y, X0, X1, CurBorderInfo.Size, LeftMW, RightMW);
                            } else {
                                pGraphics.DrawEmptyTableLine(X0 + LeftMW, Y, X1 + RightMW, Y);
                            }
                        }
                    }
                }
            }
        }
        var Y = this.Y;
        for (var CurRow = Row_start; CurRow <= Row_last; CurRow++) {
            var Row = this.Content[CurRow];
            var CellsCount = Row.Get_CellsCount();
            Y = this.RowsInfo[CurRow].Y[PNum];
            var CellSpacing = Row.Get_CellSpacing();
            var LastBorderTop = {
                W: 0,
                L: 0
            };
            for (var CurCell = CellsCount - 1; CurCell >= 0; CurCell--) {
                var Cell = Row.Get_Cell(CurCell);
                var GridSpan = Cell.Get_GridSpan();
                var VMerge = Cell.Get_VMerge();
                var CurGridCol = Row.Get_CellInfo(CurCell).StartGridCol;
                if (vmerge_Continue === VMerge) {
                    if (Row_start === CurRow) {
                        Cell = this.Internal_Get_StartMergedCell(CurRow, CurGridCol, GridSpan);
                        if (null === Cell) {
                            LastBorderTop = {
                                W: 0,
                                L: 0
                            };
                            continue;
                        }
                    } else {
                        LastBorderTop = {
                            W: 0,
                            L: 0
                        };
                        continue;
                    }
                }
                var CellInfo = Row.Get_CellInfo(CurCell);
                var X_cell_start = CellInfo.X_cell_start;
                var X_cell_end = CellInfo.X_cell_end;
                var VMergeCount = this.Internal_GetVertMergeCount(CurRow, CurGridCol, GridSpan);
                if (PNum + 1 < this.Pages.length) {
                    if (CurRow + VMergeCount - 1 >= this.Pages[PNum + 1].FirstRow) {
                        VMergeCount = this.Pages[PNum + 1].FirstRow + 1 - CurRow;
                        if (false === this.RowsInfo[CurRow + VMergeCount - 1].FirstPage && PNum === this.RowsInfo[CurRow + VMergeCount - 1].StartPage) {
                            VMergeCount--;
                        }
                        if (VMergeCount <= 0) {
                            LastBorderTop = {
                                W: 0,
                                L: 0
                            };
                            continue;
                        }
                    }
                }
                var RealHeight = this.RowsInfo[CurRow + VMergeCount - 1].Y[PNum] + this.RowsInfo[CurRow + VMergeCount - 1].H[PNum] - Y;
                var CellBorders = Cell.Get_Borders();
                if (null != CellSpacing) {
                    if (border_Single === CellBorders.Left.Value) {
                        pGraphics.p_color(CellBorders.Left.Color.r, CellBorders.Left.Color.g, CellBorders.Left.Color.b, 255);
                        pGraphics.drawVerLine(c_oAscLineDrawingRule.Left, X_cell_start, Y, Y + RealHeight, CellBorders.Left.Size);
                    } else {
                        pGraphics.DrawEmptyTableLine(X_cell_start, Y, X_cell_start, Y + RealHeight);
                    }
                    if (border_Single === CellBorders.Right.Value) {
                        pGraphics.p_color(CellBorders.Right.Color.r, CellBorders.Right.Color.g, CellBorders.Right.Color.b, 255);
                        pGraphics.drawVerLine(c_oAscLineDrawingRule.Right, X_cell_end, Y, Y + RealHeight, CellBorders.Right.Size);
                    } else {
                        pGraphics.DrawEmptyTableLine(X_cell_end, Y, X_cell_end, Y + RealHeight);
                    }
                    if (border_Single === CellBorders.Top.Value) {
                        pGraphics.p_color(CellBorders.Top.Color.r, CellBorders.Top.Color.g, CellBorders.Top.Color.b, 255);
                        pGraphics.drawHorLineExt(c_oAscLineDrawingRule.Top, Y - CellBorders.Top.Size, X_cell_start, X_cell_end, CellBorders.Top.Size, 0, 0);
                    } else {
                        pGraphics.DrawEmptyTableLine(X_cell_start, Y, X_cell_end, Y);
                    }
                    if (border_Single === CellBorders.Bottom.Value) {
                        pGraphics.p_color(CellBorders.Bottom.Color.r, CellBorders.Bottom.Color.g, CellBorders.Bottom.Color.b, 255);
                        pGraphics.drawHorLineExt(c_oAscLineDrawingRule.Bottom, Y + RealHeight + CellBorders.Bottom.Size, X_cell_start, X_cell_end, CellBorders.Bottom.Size, 0, 0);
                    } else {
                        pGraphics.DrawEmptyTableLine(X_cell_start, Y + RealHeight, X_cell_end, Y + RealHeight);
                    }
                } else {
                    var CellBordersInfo = Cell.Get_BorderInfo();
                    var BorderInfo_Left = CellBordersInfo.Left;
                    var TempCurRow = Cell.Row.Index;
                    var Row_side_border_start = (TempCurRow < Row_start ? Row_start - TempCurRow : 0);
                    var Row_side_border_end = (BorderInfo_Left.length - 1 + TempCurRow > Row_last ? Row_last - TempCurRow + 1 : BorderInfo_Left.length - 1);
                    for (var Index = Row_side_border_start; Index <= Row_side_border_end; Index++) {
                        var CurBorderInfo = BorderInfo_Left[Index];
                        var Y0 = this.RowsInfo[TempCurRow + Index].Y[PNum];
                        var Y1 = this.RowsInfo[TempCurRow + Index].Y[PNum] + this.RowsInfo[TempCurRow + Index].H[PNum];
                        if (border_Single === CurBorderInfo.Value) {
                            pGraphics.p_color(CurBorderInfo.Color.r, CurBorderInfo.Color.g, CurBorderInfo.Color.b, 255);
                            pGraphics.drawVerLine(c_oAscLineDrawingRule.Center, X_cell_start, Y0, Y1, CurBorderInfo.Size);
                        } else {
                            if (0 === CurCell) {
                                pGraphics.DrawEmptyTableLine(X_cell_start, Y0, X_cell_start, Y1);
                            }
                        }
                    }
                    var BorderInfo_Right = CellBordersInfo.Right;
                    for (var Index = Row_side_border_start; Index <= Row_side_border_end; Index++) {
                        var CurBorderInfo = BorderInfo_Right[Index];
                        var Y0 = this.RowsInfo[TempCurRow + Index].Y[PNum];
                        var Y1 = this.RowsInfo[TempCurRow + Index].Y[PNum] + this.RowsInfo[TempCurRow + Index].H[PNum];
                        var TempCellIndex = this.Internal_Get_Cell_ByStartGridCol(TempCurRow + Index, CellInfo.StartGridCol);
                        var TempCellsCount = this.Content[TempCurRow + Index].Get_CellsCount();
                        if (TempCellsCount - 1 === TempCellIndex) {
                            if (border_Single === CurBorderInfo.Value) {
                                pGraphics.p_color(CurBorderInfo.Color.r, CurBorderInfo.Color.g, CurBorderInfo.Color.b, 255);
                                pGraphics.drawVerLine(c_oAscLineDrawingRule.Center, X_cell_end, Y0, Y1, CurBorderInfo.Size);
                            } else {
                                pGraphics.DrawEmptyTableLine(X_cell_end, Y0, X_cell_end, Y1);
                            }
                        } else {
                            if (border_None === CurBorderInfo.Value) {
                                pGraphics.DrawEmptyTableLine(X_cell_end, Y0, X_cell_end, Y1);
                            }
                        }
                    }
                    var LastBorderTop_prev = {
                        W: LastBorderTop.W,
                        H: LastBorderTop.H
                    };
                    var BorderInfo_Top = CellBordersInfo.Top;
                    for (var Index = 0; Index < BorderInfo_Top.length; Index++) {
                        var CurBorderInfo = BorderInfo_Top[Index];
                        if (0 != PNum && CurRow === Row_start) {
                            CurBorderInfo = this.Internal_CompareBorders(TableBorders.Top, CurBorderInfo, true, false);
                        }
                        var X0 = this.X + this.TableSumGrid[Index + CurGridCol - 1];
                        var X1 = this.X + this.TableSumGrid[Index + CurGridCol];
                        var LeftMW = 0;
                        var RightMW = 0;
                        if (BorderInfo_Top.length - 1 === Index) {
                            var Max_r = 0;
                            if (0 != CurRow) {
                                var Prev_Row = this.Content[CurRow - 1];
                                var Prev_CellsCount = Prev_Row.Get_CellsCount();
                                for (var TempIndex = 0; TempIndex < Prev_CellsCount; TempIndex++) {
                                    var Prev_Cell = Prev_Row.Get_Cell(TempIndex);
                                    var Prev_GridCol = Prev_Row.Get_CellInfo(TempIndex).StartGridCol;
                                    var Prev_GridSpan = Prev_Cell.Get_GridSpan();
                                    var bLeft = null;
                                    if (Prev_GridCol === Index + CurGridCol + 1) {
                                        bLeft = true;
                                    } else {
                                        if (Prev_GridCol + Prev_GridSpan === Index + CurGridCol + 1) {
                                            bLeft = false;
                                        } else {
                                            if (Prev_GridCol > CurGridCol) {
                                                break;
                                            }
                                        }
                                    }
                                    if (null != bLeft) {
                                        var Prev_VMerge = Prev_Cell.Get_VMerge();
                                        if (vmerge_Continue === Prev_VMerge) {
                                            Prev_Cell = this.Internal_Get_StartMergedCell(CurRow - 1, Prev_GridCol, Prev_GridSpan);
                                        }
                                        if (null === Prev_Cell) {
                                            break;
                                        }
                                        var Num = CurRow - 1 - Prev_Cell.Row.Index;
                                        if (Num < 0) {
                                            break;
                                        }
                                        if (true === bLeft) {
                                            var Prev_Cell_BorderInfo_Left = Prev_Cell.Get_BorderInfo().Left;
                                            if (null != Prev_Cell_BorderInfo_Left && Prev_Cell_BorderInfo_Left.length > Num && border_Single === Prev_Cell_BorderInfo_Left[Num].Value) {
                                                Max_r = Prev_Cell_BorderInfo_Left[Num].Size / 2;
                                            }
                                        } else {
                                            var Prev_Cell_BorderInfo_Right = Prev_Cell.Get_BorderInfo().Right;
                                            if (null != Prev_Cell_BorderInfo_Right && Prev_Cell_BorderInfo_Right.length > Num && border_Single === Prev_Cell_BorderInfo_Right[Num].Value) {
                                                Max_r = Prev_Cell_BorderInfo_Right[Num].Size / 2;
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                            if (BorderInfo_Right.length > 0 && border_Single === BorderInfo_Right[0].Value && BorderInfo_Right[0].Size / 2 > Max_r) {
                                Max_r = BorderInfo_Right[0].Size / 2;
                            }
                            if (border_Single === CurBorderInfo.Value && CurBorderInfo.Size > LastBorderTop_prev.W) {
                                RightMW = Max_r;
                            } else {
                                RightMW = -Max_r;
                            }
                        }
                        if (0 === Index) {
                            var Max_l = 0;
                            if (0 != CurRow) {
                                var Prev_Row = this.Content[CurRow - 1];
                                var Prev_CellsCount = Prev_Row.Get_CellsCount();
                                for (var TempIndex = 0; TempIndex < Prev_CellsCount; TempIndex++) {
                                    var Prev_Cell = Prev_Row.Get_Cell(TempIndex);
                                    var Prev_GridCol = Prev_Row.Get_CellInfo(TempIndex).StartGridCol;
                                    var Prev_GridSpan = Prev_Cell.Get_GridSpan();
                                    var bLeft = null;
                                    if (Prev_GridCol === CurGridCol) {
                                        bLeft = true;
                                    } else {
                                        if (Prev_GridCol + Prev_GridSpan === CurGridCol) {
                                            bLeft = false;
                                        } else {
                                            if (Prev_GridCol > CurGridCol) {
                                                break;
                                            }
                                        }
                                    }
                                    if (null != bLeft) {
                                        var Prev_VMerge = Prev_Cell.Get_VMerge();
                                        if (vmerge_Continue === Prev_VMerge) {
                                            Prev_Cell = this.Internal_Get_StartMergedCell(CurRow - 1, Prev_GridCol, Prev_GridSpan);
                                        }
                                        if (null === Prev_Cell) {
                                            break;
                                        }
                                        var Num = CurRow - 1 - Prev_Cell.Row.Index;
                                        if (Num < 0) {
                                            break;
                                        }
                                        if (true === bLeft) {
                                            var Prev_Cell_BorderInfo_Left = Prev_Cell.Get_BorderInfo().Left;
                                            if (null != Prev_Cell_BorderInfo_Left && Prev_Cell_BorderInfo_Left.length > Num && border_Single === Prev_Cell_BorderInfo_Left[Num].Value) {
                                                Max_l = Prev_Cell_BorderInfo_Left[Num].Size / 2;
                                            }
                                        } else {
                                            var Prev_Cell_BorderInfo_Right = Prev_Cell.Get_BorderInfo().Right;
                                            if (null != Prev_Cell_BorderInfo_Right && Prev_Cell_BorderInfo_Right.length > Num && border_Single === Prev_Cell_BorderInfo_Right[Num].Value) {
                                                Max_l = Prev_Cell_BorderInfo_Right[Num].Size / 2;
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                            if (BorderInfo_Left.length > 0 && border_Single === BorderInfo_Left[0].Value && BorderInfo_Left[0].Size / 2 > Max_l) {
                                Max_l = BorderInfo_Left[0].Size / 2;
                            }
                            LeftMW = -Max_l;
                            LastBorderTop.L = Max_l;
                            LastBorderTop.W = 0;
                            if (border_Single === CurBorderInfo.Value) {
                                LastBorderTop.W = CurBorderInfo.Size;
                            }
                        }
                        if (border_Single === CurBorderInfo.Value) {
                            pGraphics.p_color(CurBorderInfo.Color.r, CurBorderInfo.Color.g, CurBorderInfo.Color.b, 255);
                            pGraphics.drawHorLineExt(c_oAscLineDrawingRule.Top, Y, X0, X1, CurBorderInfo.Size, LeftMW, RightMW);
                        } else {
                            pGraphics.DrawEmptyTableLine(X0 + LeftMW, Y, X1 + RightMW, Y);
                        }
                    }
                    if (PNum != this.Pages.length - 1 && CurRow + VMergeCount - 1 === Row_last) {
                        var X0 = X_cell_start;
                        var X1 = X_cell_end;
                        var LowerCell = this.Internal_Get_Cell_ByStartGridCol(CurRow + VMergeCount - 1, Row.Get_CellInfo(CurCell).StartGridCol);
                        var BottomBorder = (-1 === LowerCell ? this.Pages[PNum].BotBorders[0] : this.Pages[PNum].BotBorders[LowerCell]);
                        if (border_Single === BottomBorder.Value) {
                            pGraphics.p_color(BottomBorder.Color.r, BottomBorder.Color.g, BottomBorder.Color.b, 255);
                            var X0 = X_cell_start;
                            var X1 = X_cell_end;
                            var LeftMW = 0;
                            if (BorderInfo_Left.length > 0 && border_Single === BorderInfo_Left[BorderInfo_Left.length - 1].Value) {
                                LeftMW = -BorderInfo_Left[BorderInfo_Left.length - 1].Size / 2;
                            }
                            var RightMW = 0;
                            if (BorderInfo_Right.length > 0 && border_Single === BorderInfo_Right[BorderInfo_Right.length - 1].Value) {
                                RightMW = +BorderInfo_Right[BorderInfo_Right.length - 1].Size / 2;
                            }
                            pGraphics.drawHorLineExt(c_oAscLineDrawingRule.Top, Y + RealHeight, X0, X1, BottomBorder.Size, LeftMW, RightMW);
                        } else {
                            pGraphics.DrawEmptyTableLine(X_cell_start, Y + RealHeight, X_cell_end, Y + RealHeight);
                        }
                    } else {
                        var BorderInfo_Bottom = CellBordersInfo.Bottom;
                        var BorderInfo_Bottom_BeforeCount = CellBordersInfo.Bottom_BeforeCount;
                        var BorderInfo_Bottom_AfterCount = CellBordersInfo.Bottom_AfterCount;
                        if (null != BorderInfo_Bottom && BorderInfo_Bottom.length > 0) {
                            if (-1 === BorderInfo_Bottom_BeforeCount && -1 === BorderInfo_Bottom_AfterCount) {
                                var BottomBorder = BorderInfo_Bottom[0];
                                if (border_Single === BottomBorder.Value) {
                                    pGraphics.p_color(BottomBorder.Color.r, BottomBorder.Color.g, BottomBorder.Color.b, 255);
                                    var X0 = X_cell_start;
                                    var X1 = X_cell_end;
                                    var LeftMW = 0;
                                    if (BorderInfo_Left.length > 0 && border_Single === BorderInfo_Left[BorderInfo_Left.length - 1].Value) {
                                        LeftMW = -BorderInfo_Left[BorderInfo_Left.length - 1].Size / 2;
                                    }
                                    var RightMW = 0;
                                    if (BorderInfo_Right.length > 0 && border_Single === BorderInfo_Right[BorderInfo_Right.length - 1].Value) {
                                        RightMW = +BorderInfo_Right[BorderInfo_Right.length - 1].Size / 2;
                                    }
                                    pGraphics.drawHorLineExt(c_oAscLineDrawingRule.Top, Y + RealHeight, X0, X1, BottomBorder.Size, LeftMW, RightMW);
                                } else {
                                    pGraphics.DrawEmptyTableLine(X_cell_start, Y + RealHeight, X_cell_end, Y + RealHeight);
                                }
                            } else {
                                for (var Index = 0; Index < BorderInfo_Bottom_BeforeCount; Index++) {
                                    var BottomBorder = BorderInfo_Bottom[Index];
                                    if (border_Single === BottomBorder.Value) {
                                        pGraphics.p_color(BottomBorder.Color.r, BottomBorder.Color.g, BottomBorder.Color.b, 255);
                                        pGraphics.p_width(BottomBorder.Size * 1000);
                                        pGraphics._s();
                                        var X0 = this.X + this.TableSumGrid[Index + CurGridCol - 1];
                                        var X1 = this.X + this.TableSumGrid[Index + CurGridCol];
                                        var LeftMW = 0;
                                        if (0 === Index && BorderInfo_Left.length > 0 && border_Single === BorderInfo_Left[BorderInfo_Left.length - 1].Value) {
                                            LeftMW = -BorderInfo_Left[BorderInfo_Left.length - 1].Size / 2;
                                        }
                                        pGraphics.drawHorLineExt(c_oAscLineDrawingRule.Top, Y + RealHeight, X0, X1, BottomBorder.Size, LeftMW, 0);
                                    } else {
                                        pGraphics.DrawEmptyTableLine(X_cell_start, Y + RealHeight, X_cell_end, Y + RealHeight);
                                    }
                                }
                                for (var Index = 0; Index < BorderInfo_Bottom_AfterCount; Index++) {
                                    var BottomBorder = BorderInfo_Bottom[BorderInfo_Bottom.length - 1 - Index];
                                    if (border_Single === BottomBorder.Value) {
                                        pGraphics.p_color(BottomBorder.Color.r, BottomBorder.Color.g, BottomBorder.Color.b, 255);
                                        pGraphics.p_width(BottomBorder.Size * 1000);
                                        pGraphics._s();
                                        var X0 = this.X + this.TableSumGrid[CurGridCol + GridSpan - 2 - Index];
                                        var X1 = this.X + this.TableSumGrid[CurGridCol + GridSpan - 1 - Index];
                                        var RightMW = 0;
                                        if (0 === Index && BorderInfo_Right.length > 0 && border_Single === BorderInfo_Right[BorderInfo_Right.length - 1].Value) {
                                            RightMW = +BorderInfo_Right[BorderInfo_Right.length - 1].Size / 2;
                                        }
                                        pGraphics.drawHorLineExt(c_oAscLineDrawingRule.Top, Y + RealHeight, X0, X1, BottomBorder.Size, 0, RightMW);
                                    } else {
                                        pGraphics.DrawEmptyTableLine(X_cell_start, Y + RealHeight, X_cell_end, Y + RealHeight);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    Get_NearestPos: function (PageNum, X, Y, bAnchor, Drawing) {
        var PNum = PageNum - this.PageNum;
        if (PNum < 0 || PNum >= this.Pages.length) {
            PNum = 0;
        }
        var Pos = this.Internal_GetCellByXY(X, Y, PNum);
        var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
        return Cell.Content.Get_NearestPos(PNum, X, Y, bAnchor, Drawing);
    },
    Set_Parent: function (ParentObject) {
        History.Add(this, {
            Type: historyitem_Table_Parent,
            Old: this.Parent,
            New: ParentObject
        });
        this.Parent = ParentObject;
    },
    Get_Parent: function () {
        return this.Parent;
    },
    Set_Id: function (newId) {
        g_oTableId.Reset_Id(this, newId, this.Id);
        this.Id = newId;
    },
    Get_Id: function () {
        return this.Id;
    },
    Is_StartFromNewPage: function () {
        if ((this.Pages.length > 1 && 0 === this.Pages[1].FirstRow && false === this.RowsInfo[0].FirstPage) || (null === this.Get_DocumentPrev() && true === this.Parent.Is_TopDocument())) {
            return true;
        }
        return false;
    },
    Is_ContentOnFirstPage: function () {
        if (this.Pages.length >= 1 && true === this.RowsInfo[0].FirstPage) {
            return true;
        }
        return false;
    },
    Is_TableBorder: function (X, Y, PageNum_Abs) {
        if (true === this.DrawingDocument.IsMobileVersion()) {
            return null;
        }
        var TempPNum = PageNum_Abs - this.Get_StartPage_Absolute();
        if (TempPNum < 0 || TempPNum >= this.Pages.length) {
            TempPNum = 0;
        }
        var Result = this.Internal_CheckBorders(X, Y, TempPNum);
        if (Result.Border != -1) {
            return this;
        } else {
            return this.Content[Result.Pos.Row].Get_Cell(Result.Pos.Cell).Content.Is_TableBorder(X, Y, PageNum_Abs);
        }
    },
    Is_InText: function (X, Y, PageNum_Abs) {
        var TempPNum = PageNum_Abs - this.Get_StartPage_Absolute();
        if (TempPNum < 0 || TempPNum >= this.Pages.length) {
            TempPNum = 0;
        }
        var Result = this.Internal_CheckBorders(X, Y, TempPNum);
        if (Result.Border != -1) {
            return null;
        } else {
            return this.Content[Result.Pos.Row].Get_Cell(Result.Pos.Cell).Content.Is_InText(X, Y, PageNum_Abs);
        }
    },
    Is_InDrawing: function (X, Y, PageNum_Abs) {
        var TempPNum = PageNum_Abs - this.Get_StartPage_Absolute();
        if (TempPNum < 0 || TempPNum >= this.Pages.length) {
            TempPNum = 0;
        }
        var Result = this.Internal_CheckBorders(X, Y, TempPNum);
        if (Result.Border != -1) {
            return null;
        } else {
            return this.Content[Result.Pos.Row].Get_Cell(Result.Pos.Cell).Content.Is_InDrawing(X, Y, PageNum_Abs);
        }
    },
    Is_InnerTable: function () {
        if (false === this.Selection.Use || (true === this.Selection.Use && table_Selection_Text === this.Selection.Type)) {
            return this.CurCell.Content.Is_CurrentElementTable();
        }
        return false;
    },
    Is_UseInDocument: function (Id) {
        var bUse = false;
        if (null != Id) {
            var RowsCount = this.Content.length;
            for (var Index = 0; Index < RowsCount; Index++) {
                if (Id === this.Content[Index].Get_Id()) {
                    bUse = true;
                    break;
                }
            }
        } else {
            bUse = true;
        }
        if (true === bUse && null != this.Parent) {
            return this.Parent.Is_UseInDocument(this.Get_Id());
        }
        return false;
    },
    Get_CurrentPage_Absolute: function () {
        if (true === this.Selection.Use) {
            return 0;
        }
        return this.CurCell.Content.Get_CurrentPage_Absolute();
    },
    Get_CurrentPage_Relative: function () {
        if (true === this.Selection.Use) {
            return 0;
        }
        return this.CurCell.Content.Get_CurrentPage_Absolute() - this.Get_StartPage_Absolute();
    },
    Update_CursorType: function (X, Y, PageIndex) {
        var PageNum = PageIndex - this.PageNum;
        if (PageNum < 0 || PageNum >= this.Pages.length) {
            PageNum = 0;
        }
        if (true === this.Lock.Is_Locked()) {
            var PNum = PageNum;
            var _X = this.Pages[PNum].Bounds.Left;
            var _Y = this.Pages[PNum].Bounds.Top;
            var MMData = new CMouseMoveData();
            var Coords = this.DrawingDocument.ConvertCoordsToCursorWR(_X, _Y, this.Get_StartPage_Absolute() + (PageIndex - this.PageNum));
            MMData.X_abs = Coords.X - 5;
            MMData.Y_abs = Coords.Y - 5;
            MMData.Type = c_oAscMouseMoveDataTypes.LockedObject;
            MMData.UserId = this.Lock.Get_UserId();
            MMData.HaveChanges = this.Lock.Have_Changes();
            MMData.LockedObjectType = c_oAscMouseMoveLockedObjectType.Common;
            editor.sync_MouseMoveCallback(MMData);
        }
        if (true === this.Selection.Start || table_Selection_Border === this.Selection.Type2 || table_Selection_Border_InnerTable === this.Selection.Type2) {
            return;
        }
        var NewOutline = null;
        if (1 === this.Pages.length || (this.Pages.length > 1 && (0 != this.Pages[1].FirstRow || true === this.RowsInfo[0].FirstPage))) {
            var Bounds = this.Get_PageBounds(0);
            NewOutline = new CTableOutline(this, this.Get_StartPage_Absolute(), Bounds.Left, Bounds.Top, Bounds.Right - Bounds.Left, Bounds.Bottom - Bounds.Top);
        } else {
            var Bounds = this.Get_PageBounds(1);
            NewOutline = new CTableOutline(this, this.Get_StartPage_Absolute() + 1, Bounds.Left, Bounds.Top, Bounds.Right - Bounds.Left, Bounds.Bottom - Bounds.Top);
        }
        var transform = this.Parent.transform;
        var cur_doc_content = this.Parent;
        var Result = this.Internal_CheckBorders(X, Y, PageNum);
        switch (Result.Border) {
        case 0:
            case 2:
            return this.DrawingDocument.SetCursorType("s-resize", new CMouseMoveData());
        case 1:
            case 3:
            return this.DrawingDocument.SetCursorType("w-resize", new CMouseMoveData());
        }
        var Cell_Pos = this.Internal_GetCellByXY(X, Y, PageNum);
        var Cell = this.Content[Cell_Pos.Row].Get_Cell(Cell_Pos.Cell);
        Cell.Content.Update_CursorType(X, Y, PageNum + this.Get_StartPage_Absolute());
    },
    Start_TrackTable: function () {
        var NewOutline = null;
        if (1 === this.Pages.length || (this.Pages.length > 1 && (0 != this.Pages[1].FirstRow || true === this.RowsInfo[0].FirstPage))) {
            var Bounds = this.Get_PageBounds(0);
            NewOutline = new CTableOutline(this, this.Get_StartPage_Absolute(), Bounds.Left, Bounds.Top, Bounds.Right - Bounds.Left, Bounds.Bottom - Bounds.Top);
        } else {
            var Bounds = this.Get_PageBounds(1);
            NewOutline = new CTableOutline(this, this.Get_StartPage_Absolute() + 1, Bounds.Left, Bounds.Top, Bounds.Right - Bounds.Left, Bounds.Bottom - Bounds.Top);
        }
        var transform = null;
        var cur_doc_content = this.Parent;
        if (cur_doc_content instanceof CDocumentContent) {
            while (cur_doc_content.Is_TableCellContent()) {
                cur_doc_content = cur_doc_content.Parent.Row.Table.Parent;
            }
            if (cur_doc_content.Parent && cur_doc_content.Parent instanceof WordShape) {
                transform = cur_doc_content.Parent.transformText;
            }
        }
        this.DrawingDocument.StartTrackTable(NewOutline, transform);
    },
    DocumentSearch: function (Str, Type) {
        for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
            var Row = this.Content[CurRow];
            var CellsCount = Row.Get_CellsCount();
            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                Row.Get_Cell(CurCell).Content_DocumentSearch(Str, Type);
            }
        }
    },
    DocumentStatistics: function (Stats) {
        for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
            var Row = this.Content[CurRow];
            var CellsCount = Row.Get_CellsCount();
            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                Row.Get_Cell(CurCell).Content.DocumentStatistics(Stats);
            }
        }
    },
    Document_CreateFontMap: function (FontMap) {
        for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
            var Row = this.Content[CurRow];
            var CellsCount = Row.Get_CellsCount();
            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                Row.Get_Cell(CurCell).Content_Document_CreateFontMap(FontMap);
            }
        }
    },
    Document_CreateFontCharMap: function (FontCharMap) {
        for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
            var Row = this.Content[CurRow];
            var CellsCount = Row.Get_CellsCount();
            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                Row.Get_Cell(CurCell).Content.Document_CreateFontCharMap(183);
            }
        }
    },
    Document_Get_AllFontNames: function (AllFonts) {
        for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
            var Row = this.Content[CurRow];
            var CellsCount = Row.Get_CellsCount();
            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                Row.Get_Cell(CurCell).Content.Document_Get_AllFontNames(AllFonts);
            }
        }
    },
    Document_UpdateInterfaceState: function () {
        if (true != this.Selection.Use || table_Selection_Cell != this.Selection.Type) {
            this.CurCell.Content.Document_UpdateInterfaceState();
        } else {
            var ParaPr = this.Get_Paragraph_ParaPr();
            ParaPr.CanAddTable = false;
            if (null != ParaPr) {
                editor.UpdateParagraphProp(ParaPr);
            }
            var TextPr = this.Get_Paragraph_TextPr();
            if (null != TextPr) {
                editor.UpdateTextPr(TextPr);
            }
        }
    },
    Document_UpdateRulersState: function (PageIndex) {
        var PageNum = PageIndex - this.Get_StartPage_Absolute();
        if (PageNum < 0 || PageNum >= this.Pages.length) {
            PageNum = 0;
        }
        if (true == this.Selection.Use && table_Selection_Cell == this.Selection.Type) {
            this.Internal_Update_TableMarkup(this.Selection.EndPos.Pos.Row, this.Selection.EndPos.Pos.Cell, PageNum);
        } else {
            this.Internal_Update_TableMarkup(this.CurCell.Row.Index, this.CurCell.Index, PageNum);
        }
    },
    Document_SetThisElementCurrent: function () {
        this.Parent.Set_CurrentElement(this.Index);
    },
    Set_Inline: function (Value) {
        History.Add(this, {
            Type: historyitem_Table_Inline,
            Old: this.Inline,
            New: Value
        });
        this.Inline = Value;
    },
    Is_Inline: function () {
        return this.Inline;
        if ("undefined" != typeof(this.Parent.Get_Type) && flowobject_Table === this.Parent.Get_Type()) {
            return false;
        }
        return true;
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
    PreDelete: function () {
        this.DrawingDocument.EndTrackTable(this, false);
    },
    Remove_InnerTable: function () {
        this.CurCell.Content.Table_RemoveTable();
    },
    Table_Select: function (Type) {
        if (true === this.Is_InnerTable()) {
            this.CurCell.Content.Table_Select(Type);
            if (true === this.CurCell.Content.Is_SelectionUse()) {
                this.Selection.Use = true;
                this.Selection.Start = false;
                this.Selection.Type = table_Selection_Text;
                this.Selection.Data = null;
                this.Selection.Type2 = table_Selection_Common;
                this.Selection.Data2 = null;
            }
            return;
        }
        var NewSelectionData = new Array();
        switch (Type) {
        case c_oAscTableSelectionType.Table:
            for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
                var Row = this.Content[CurRow];
                var Cells_Count = Row.Get_CellsCount();
                for (var CurCell = 0; CurCell < Cells_Count; CurCell++) {
                    var Cell = Row.Get_Cell(CurCell);
                    var Vmerge = Cell.Get_VMerge();
                    if (vmerge_Continue === Vmerge) {
                        continue;
                    }
                    NewSelectionData.push({
                        Row: CurRow,
                        Cell: CurCell
                    });
                }
            }
            break;
        case c_oAscTableSelectionType.Row:
            var Rows_to_select = new Array();
            if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
                var Row_prev = -1;
                for (var Index = 0; Index < this.Selection.Data.length; Index++) {
                    var Pos = this.Selection.Data[Index];
                    if (-1 === Row_prev || Row_prev != Pos.Row) {
                        Rows_to_select.push(Pos.Row);
                        Row_prev = Pos.Row;
                    }
                }
            } else {
                Rows_to_select.push(this.CurCell.Row.Index);
            }
            for (var Index = 0; Index < Rows_to_select.length; Index++) {
                var Row = this.Content[Rows_to_select[Index]];
                var Cells_Count = Row.Get_CellsCount();
                for (var CurCell = 0; CurCell < Cells_Count; CurCell++) {
                    var Cell = Row.Get_Cell(CurCell);
                    var Vmerge = Cell.Get_VMerge();
                    if (vmerge_Continue === Vmerge) {
                        continue;
                    }
                    NewSelectionData.push({
                        Cell: CurCell,
                        Row: Rows_to_select[Index]
                    });
                }
            }
            break;
        case c_oAscTableSelectionType.Column:
            var Grid_start = -1;
            var Grid_end = -1;
            if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
                for (var Index = 0; Index < this.Selection.Data.length; Index++) {
                    var Pos = this.Selection.Data[Index];
                    var Row = this.Content[Pos.Row];
                    var Cell = Row.Get_Cell(Pos.Cell);
                    var StartGridCol = Row.Get_CellInfo(Pos.Cell).StartGridCol;
                    var EndGridCol = StartGridCol + Cell.Get_GridSpan() - 1;
                    if (-1 === Grid_start || Grid_start > StartGridCol) {
                        Grid_start = StartGridCol;
                    }
                    if (-1 === Grid_end || Grid_end < EndGridCol) {
                        Grid_end = EndGridCol;
                    }
                }
            } else {
                Grid_start = this.Content[this.CurCell.Row.Index].Get_CellInfo(this.CurCell.Index).StartGridCol;
                Grid_end = Grid_start + this.CurCell.Get_GridSpan() - 1;
            }
            for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
                var Row = this.Content[CurRow];
                var Cells_Count = Row.Get_CellsCount();
                for (var CurCell = 0; CurCell < Cells_Count; CurCell++) {
                    var Cell = Row.Get_Cell(CurCell);
                    var Vmerge = Cell.Get_VMerge();
                    if (vmerge_Continue === Vmerge) {
                        continue;
                    }
                    var StartGridCol = Row.Get_CellInfo(CurCell).StartGridCol;
                    var EndGridCol = StartGridCol + Cell.Get_GridSpan() - 1;
                    if (EndGridCol >= Grid_start && StartGridCol <= Grid_end) {
                        NewSelectionData.push({
                            Cell: CurCell,
                            Row: CurRow
                        });
                    }
                }
            }
            break;
        case c_oAscTableSelectionType.Cell:
            default:
            if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
                NewSelectionData = this.Selection.Data;
            } else {
                NewSelectionData.push({
                    Row: this.CurCell.Row.Index,
                    Cell: this.CurCell.Index
                });
            }
            break;
        }
        this.Selection.Use = true;
        this.Selection.Start = false;
        this.Selection.Type = table_Selection_Cell;
        this.Selection.Data = NewSelectionData;
        this.Selection.Type2 = table_Selection_Common;
        this.Selection.Data2 = null;
        this.Selection.StartPos.Pos = {
            Row: NewSelectionData[0].Row,
            Cell: NewSelectionData[0].Cell
        };
        this.Selection.EndPos.Pos = {
            Row: NewSelectionData[NewSelectionData.length - 1].Row,
            Cell: NewSelectionData[NewSelectionData.length - 1].Cell
        };
    },
    Check_Split: function () {
        if (true === this.Is_InnerTable()) {
            return this.CurCell.Content.Table_CheckSplit();
        }
        if (! (false === this.Selection.Use || (true === this.Selection.Use && (table_Selection_Text === this.Selection.Type || (table_Selection_Cell === this.Selection.Type && 1 === this.Selection.Data.length))))) {
            return false;
        }
        return true;
    },
    Check_Merge: function () {
        if (true === this.Is_InnerTable()) {
            return this.CurCell.Content.Table_CheckMerge();
        }
        if (true != this.Selection.Use || table_Selection_Cell != this.Selection.Type || this.Selection.Data.length <= 1) {
            return false;
        }
        return this.Internal_CheckMerge().bCanMerge;
    },
    Undo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_Table_SetStyleIndex:
            this.styleIndex = Data.oldPr;
            break;
        case historyitem_Table_DocNext:
            this.Next = Data.Old;
            break;
        case historyitem_Table_DocPrev:
            this.Prev = Data.Old;
            break;
        case historyitem_Table_Parent:
            this.Parent = Data.Old;
            break;
        case historyitem_Table_TableW:
            if (undefined === Data.Old) {
                this.Pr.TableW = undefined;
            } else {
                this.Pr.TableW = Data.Old;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableLayout:
            if (undefined === Data.Old) {
                this.Pr.TableLayout = undefined;
            } else {
                this.Pr.TableLayout = Data.Old;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableCellMar:
            if (undefined === Data.Old.Left) {
                this.Pr.TableCellMar.Left = undefined;
            } else {
                this.Pr.TableCellMar.Left = Data.Old.Left;
            }
            if (undefined === Data.Old.Right) {
                this.Pr.TableCellMar.Right = undefined;
            } else {
                this.Pr.TableCellMar.Right = Data.Old.Right;
            }
            if (undefined === Data.Old.Top) {
                this.Pr.TableCellMar.Top = undefined;
            } else {
                this.Pr.TableCellMar.Top = Data.Old.Top;
            }
            if (undefined === Data.Old.Bottom) {
                this.Pr.TableCellMar.Bottom = undefined;
            } else {
                this.Pr.TableCellMar.Bottom = Data.Old.Bottom;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableAlign:
            if (undefined === Data.Old) {
                this.Pr.Jc = undefined;
            } else {
                this.Pr.Jc = Data.Old;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableInd:
            if (undefined === Data.Old) {
                this.Pr.TableInd = undefined;
            } else {
                this.Pr.TableInd = Data.Old;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableBorder_Left:
            if (undefined === Data.Old) {
                this.Pr.TableBorders.Left = undefined;
            } else {
                this.Pr.TableBorders.Left = Data.Old;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableBorder_Right:
            if (undefined === Data.Old) {
                this.Pr.TableBorders.Right = undefined;
            } else {
                this.Pr.TableBorders.Right = Data.Old;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableBorder_Top:
            if (undefined === Data.Old) {
                this.Pr.TableBorders.Top = undefined;
            } else {
                this.Pr.TableBorders.Top = Data.Old;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableBorder_Bottom:
            if (undefined === Data.Old) {
                this.Pr.TableBorders.Bottom = undefined;
            } else {
                this.Pr.TableBorders.Bottom = Data.Old;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableBorder_InsideH:
            if (undefined === Data.Old) {
                this.Pr.TableBorders.InsideH = undefined;
            } else {
                this.Pr.TableBorders.InsideH = Data.Old;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableBorder_InsideV:
            if (undefined === Data.Old) {
                this.Pr.TableBorders.InsideV = undefined;
            } else {
                this.Pr.TableBorders.InsideV = Data.Old;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableShd:
            if (undefined === Data.Old) {
                this.Pr.Shd = undefined;
            } else {
                this.Pr.Shd = Data.Old;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_Inline:
            this.Inline = Data.Old;
            break;
        case historyitem_Table_AddRow:
            this.Content.splice(Data.Pos, 1);
            this.TableRowsBottom.splice(Data.Pos, 1);
            this.RowsInfo.splice(Data.Pos, 1);
            this.Internal_ReIndexing(Data.Pos);
            break;
        case historyitem_Table_RemoveRow:
            this.Content.splice(Data.Pos, 0, Data.Item.Row);
            this.TableRowsBottom.splice(Data.Pos, 0, Data.Item.TableRowsBottom);
            this.RowsInfo.splice(Data.Pos, 0, Data.Item.RowsInfo);
            this.Internal_ReIndexing(Data.Pos);
            break;
        case historyitem_Table_TableGrid:
            this.TableGrid = Data.Old;
            break;
        case historyitem_Table_TableLook:
            this.TableLook = Data.Old;
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_AllowOverlap:
            this.AllowOverlap = Data.Old;
            break;
        case historyitem_Table_PositionH:
            this.PositionH.RelativeFrom = Data.Old.RelativeFrom;
            this.PositionH.Align = Data.Old.Align;
            this.PositionH.Value = Data.Old.Value;
            break;
        case historyitem_Table_PositionV:
            this.PositionV.RelativeFrom = Data.Old.RelativeFrom;
            this.PositionV.Align = Data.Old.Align;
            this.PositionV.Value = Data.Old.Value;
            break;
        case historyitem_Table_Distance:
            this.Distance.L = Data.Old.Left;
            this.Distance.T = Data.Old.Top;
            this.Distance.R = Data.Old.Right;
            this.Distance.B = Data.Old.Bottom;
            break;
        case historyitem_Table_TableStyleColBandSize:
            if (undefined === Data.Old) {
                this.Pr.TableStyleColBandSize = undefined;
            } else {
                this.Pr.TableStyleColBandSize = Data.Old;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableStyleRowBandSize:
            if (undefined === Data.Old) {
                this.Pr.TableStyleRowBandSize = undefined;
            } else {
                this.Pr.TableStyleRowBandSize = Data.Old;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableStyle:
            this.styleIndex = Data.Old;
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_Pr:
            this.Pr = Data.Old;
            this.Recalc_CompiledPr();
            break;
        }
        if (this.Parent) {
            this.Parent.onParagraphChanged();
        }
    },
    Redo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_Table_SetStyleIndex:
            this.styleIndex = Data.newPr;
            break;
        case historyitem_Table_DocNext:
            this.Next = Data.New;
            break;
        case historyitem_Table_DocPrev:
            this.Prev = Data.New;
            break;
        case historyitem_Table_Parent:
            this.Parent = Data.New;
            break;
        case historyitem_Table_TableW:
            if (undefined === Data.New) {
                this.Pr.TableW = undefined;
            } else {
                this.Pr.TableW = Data.New;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableLayout:
            if (undefined === Data.New) {
                this.Pr.TableLayout = undefined;
            } else {
                this.Pr.TableLayout = Data.New;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableCellMar:
            if (undefined === Data.New.Left) {
                this.Pr.TableCellMar.Left = undefined;
            } else {
                this.Pr.TableCellMar.Left = Data.New.Left;
            }
            if (undefined === Data.New.Right) {
                this.Pr.TableCellMar.Right = undefined;
            } else {
                this.Pr.TableCellMar.Right = Data.New.Right;
            }
            if (undefined === Data.New.Top) {
                this.Pr.TableCellMar.Top = undefined;
            } else {
                this.Pr.TableCellMar.Top = Data.New.Top;
            }
            if (undefined === Data.New.Bottom) {
                this.Pr.TableCellMar.Bottom = undefined;
            } else {
                this.Pr.TableCellMar.Bottom = Data.New.Bottom;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableAlign:
            if (undefined === Data.New) {
                this.Pr.Jc = undefined;
            } else {
                this.Pr.Jc = Data.New;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableInd:
            if (undefined === Data.New) {
                this.Pr.TableInd = undefined;
            } else {
                this.Pr.TableInd = Data.New;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableBorder_Left:
            if (undefined === Data.New) {
                this.Pr.TableBorders.Left = undefined;
            } else {
                this.Pr.TableBorders.Left = Data.New;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableBorder_Right:
            if (undefined === Data.New) {
                this.Pr.TableBorders.Right = undefined;
            } else {
                this.Pr.TableBorders.Right = Data.New;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableBorder_Top:
            if (undefined === Data.New) {
                this.Pr.TableBorders.Top = undefined;
            } else {
                this.Pr.TableBorders.Top = Data.New;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableBorder_Bottom:
            if (undefined === Data.New) {
                this.Pr.TableBorders.Bottom = undefined;
            } else {
                this.Pr.TableBorders.Bottom = Data.New;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableBorder_InsideH:
            if (undefined === Data.New) {
                this.Pr.TableBorders.InsideH = undefined;
            } else {
                this.Pr.TableBorders.InsideH = Data.New;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableBorder_InsideV:
            if (undefined === Data.New) {
                this.Pr.TableBorders.InsideV = undefined;
            } else {
                this.Pr.TableBorders.InsideV = Data.New;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableShd:
            if (undefined === Data.New) {
                this.Pr.Shd = undefined;
            } else {
                this.Pr.Shd = Data.New;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_Inline:
            this.Inline = Data.New;
            break;
        case historyitem_Table_AddRow:
            this.Content.splice(Data.Pos, 0, Data.Item.Row);
            this.TableRowsBottom.splice(Data.Pos, 0, Data.Item.TableRowsBottom);
            this.RowsInfo.splice(Data.Pos, 0, Data.Item.RowsInfo);
            this.Internal_ReIndexing(Data.Pos);
            break;
        case historyitem_Table_RemoveRow:
            this.Content.splice(Data.Pos, 1);
            this.TableRowsBottom.splice(Data.Pos, 1);
            this.RowsInfo.splice(Data.Pos, 1);
            this.Internal_ReIndexing(Data.Pos);
            break;
        case historyitem_Table_TableGrid:
            this.TableGrid = Data.New;
            break;
        case historyitem_Table_TableLook:
            this.TableLook = Data.New;
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_AllowOverlap:
            this.AllowOverlap = Data.New;
            break;
        case historyitem_Table_PositionH:
            this.PositionH.RelativeFrom = Data.New.RelativeFrom;
            this.PositionH.Align = Data.New.Align;
            this.PositionH.Value = Data.New.Value;
            break;
        case historyitem_Table_PositionV:
            this.PositionV.RelativeFrom = Data.New.RelativeFrom;
            this.PositionV.Align = Data.New.Align;
            this.PositionV.Value = Data.New.Value;
            break;
        case historyitem_Table_Distance:
            this.Distance.L = Data.New.Left;
            this.Distance.T = Data.New.Top;
            this.Distance.R = Data.New.Right;
            this.Distance.B = Data.New.Bottom;
            break;
        case historyitem_Table_TableStyleColBandSize:
            if (undefined === Data.New) {
                this.Pr.TableStyleColBandSize = undefined;
            } else {
                this.Pr.TableStyleColBandSize = Data.New;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableStyleRowBandSize:
            if (undefined === Data.New) {
                this.Pr.TableStyleRowBandSize = undefined;
            } else {
                this.Pr.TableStyleRowBandSize = Data.New;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableStyle:
            this.styleIndex = Data.New;
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_Pr:
            this.Pr = Data.New;
            this.Recalc_CompiledPr();
            break;
        }
        if (this.Parent) {
            this.Parent.onParagraphChanged();
        }
    },
    Get_SelectionState: function () {
        var TableState = new Object();
        TableState.Selection = {
            Start: this.Selection.Start,
            Use: this.Selection.Use,
            StartPos: {
                Pos: {
                    Row: this.Selection.StartPos.Pos.Row,
                    Cell: this.Selection.StartPos.Pos.Cell
                },
                X: this.Selection.StartPos.X,
                Y: this.Selection.StartPos.Y
            },
            EndPos: {
                Pos: {
                    Row: this.Selection.EndPos.Pos.Row,
                    Cell: this.Selection.EndPos.Pos.Cell
                },
                X: this.Selection.EndPos.X,
                Y: this.Selection.EndPos.Y
            },
            Type: this.Selection.Type,
            Data: null,
            Type2: this.Selection.Type2,
            Data2: null
        };
        TableState.Selection.Data = new Array();
        if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
            for (var Index = 0; Index < this.Selection.Data.length; Index++) {
                TableState.Selection.Data[Index] = {
                    Row: this.Selection.Data[Index].Row,
                    Cell: this.Selection.Data[Index].Cell
                };
            }
        }
        TableState.CurCell = {
            Row: this.CurCell.Row.Index,
            Cell: this.CurCell.Index
        };
        var State = null;
        if (false === this.Selection.Use || (true === this.Selection.Use && table_Selection_Text === this.Selection.Type)) {
            State = this.CurCell.Content.Get_SelectionState();
        } else {
            State = new Array();
        }
        State.push(TableState);
        return State;
    },
    Set_SelectionState: function (State, StateIndex) {
        if (State.length <= 0) {
            return;
        }
        var TableState = State[StateIndex];
        this.Selection = {
            Start: TableState.Selection.Start,
            Use: TableState.Selection.Use,
            StartPos: {
                Pos: {
                    Row: TableState.Selection.StartPos.Pos.Row,
                    Cell: TableState.Selection.StartPos.Pos.Cell
                },
                X: TableState.Selection.StartPos.X,
                Y: TableState.Selection.StartPos.Y
            },
            EndPos: {
                Pos: {
                    Row: TableState.Selection.EndPos.Pos.Row,
                    Cell: TableState.Selection.EndPos.Pos.Cell
                },
                X: TableState.Selection.EndPos.X,
                Y: TableState.Selection.EndPos.Y
            },
            Type: TableState.Selection.Type,
            Data: null,
            Type2: TableState.Selection.Type2,
            Data2: null
        };
        this.Selection.Data = new Array();
        if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
            for (var Index = 0; Index < TableState.Selection.Data.length; Index++) {
                this.Selection.Data[Index] = {
                    Row: TableState.Selection.Data[Index].Row,
                    Cell: TableState.Selection.Data[Index].Cell
                };
            }
        }
        this.CurCell = this.Content[TableState.CurCell.Row].Get_Cell(TableState.CurCell.Cell);
        if (false === this.Selection.Use || (true === this.Selection.Use && table_Selection_Text === this.Selection.Type)) {
            this.CurCell.Content.Set_SelectionState(State, StateIndex - 1);
        }
    },
    Get_ParentObject_or_DocumentPos: function () {
        return this.Parent.Get_ParentObject_or_DocumentPos(this.Index);
    },
    Refresh_RecalcData: function (Data) {
        var Type = Data.Type;
        var bNeedRecalc = false;
        var nRowIndex = 0;
        switch (Type) {
        case historyitem_Table_DocNext:
            case historyitem_Table_DocPrev:
            case historyitem_Table_TableShd:
            break;
        case historyitem_Table_Parent:
            case historyitem_Table_TableW:
            case historyitem_Table_TableLayout:
            case historyitem_Table_TableCellMar:
            case historyitem_Table_TableAlign:
            case historyitem_Table_TableInd:
            case historyitem_Table_TableBorder_Left:
            case historyitem_Table_TableBorder_Right:
            case historyitem_Table_TableBorder_Top:
            case historyitem_Table_TableBorder_Bottom:
            case historyitem_Table_TableBorder_InsideH:
            case historyitem_Table_TableBorder_InsideV:
            case historyitem_Table_Inline:
            case historyitem_Table_TableLook:
            case historyitem_Table_AllowOverlap:
            case historyitem_Table_PositionH:
            case historyitem_Table_PositionV:
            case historyitem_Table_Distance:
            case historyitem_Table_TableStyleColBandSize:
            case historyitem_Table_TableStyleRowBandSize:
            case historyitem_Table_TableStyle:
            case historyitem_Table_Pr:
            bNeedRecalc = true;
            break;
        case historyitem_Table_AddRow:
            case historyitem_Table_RemoveRow:
            bNeedRecalc = true;
            nRowIndex = Data.Pos;
            break;
        case historyitem_Table_TableGrid:
            bNeedRecalc = true;
            break;
        }
        if (true === bNeedRecalc) {
            this.Refresh_RecalcData2(nRowIndex, 0);
        }
    },
    Refresh_RecalcData2: function (RowIndex, Page_rel) {
        if (this.Index >= 0) {
            var _RowIndex = Math.min(RowIndex, this.RowsInfo.length - 1);
            var _Page_rel = (_RowIndex < 0 ? this.PageNum : Page_rel + this.PageNum);
            this.Parent.Refresh_RecalcData2(this.Index, _Page_rel);
        }
    },
    Document_Is_SelectionLocked: function (CheckType, bCheckInner) {
        switch (CheckType) {
        case changestype_Paragraph_Content:
            case changestype_Paragraph_Properties:
            case changestype_Document_Content:
            case changestype_Document_Content_Add:
            case changestype_Remove:
            case changestype_Delete:
            case changestype_Image_Properties:
            if (true === this.ApplyToAll || (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type)) {
                var Cells_array = this.Internal_Get_SelectionArray();
                var Count = Cells_array.length;
                for (var Index = 0; Index < Count; Index++) {
                    var Pos = Cells_array[Index];
                    var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
                    Cell.Content.Set_ApplyToAll(true);
                    Cell.Content.Document_Is_SelectionLocked(CheckType);
                    Cell.Content.Set_ApplyToAll(false);
                }
            } else {
                this.CurCell.Content.Document_Is_SelectionLocked(CheckType);
            }
            break;
        case changestype_Table_Properties:
            if (false != bCheckInner && true === this.Is_InnerTable()) {
                this.CurCell.Content.Document_Is_SelectionLocked(CheckType);
            } else {
                this.Lock.Check(this.Get_Id());
            }
            break;
        case changestype_Table_RemoveCells:
            if (false != bCheckInner && true === this.Is_InnerTable()) {
                this.CurCell.Content.Document_Is_SelectionLocked(CheckType);
            } else {
                this.Lock.Check(this.Get_Id());
            }
            break;
        case changestype_Document_SectPr:
            case changestype_HdrFtr:
            CollaborativeEditing.Add_CheckLock(true);
            break;
        }
    },
    Save_Changes: function (Data, Writer) {
        Writer.WriteLong(historyitem_type_Table);
        var Type = Data.Type;
        Writer.WriteLong(Type);
        switch (Type) {
        case historyitem_Table_SetStyleIndex:
            Writer.WriteBool(isRealNumber(Data.newPr));
            if (isRealNumber(Data.newPr)) {
                Writer.WriteLong(Data.newPr);
            }
            break;
        case historyitem_Table_DocNext:
            case historyitem_Table_DocPrev:
            case historyitem_Table_Parent:
            if (null != Data.New) {
                Writer.WriteString2(Data.New.Get_Id());
            } else {
                Writer.WriteString2("");
            }
            break;
        case historyitem_Table_TableW:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Data.New.Write_ToBinary(Writer);
            }
            break;
        case historyitem_Table_TableLayout:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Writer.WriteLong(Data.New);
            }
            break;
        case historyitem_Table_TableCellMar:
            if (undefined === Data.New.Left) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Data.New.Left.Write_ToBinary(Writer);
            }
            if (undefined === Data.New.Right) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Data.New.Right.Write_ToBinary(Writer);
            }
            if (undefined === Data.New.Top) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Data.New.Top.Write_ToBinary(Writer);
            }
            if (undefined === Data.New.Bottom) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Data.New.Bottom.Write_ToBinary(Writer);
            }
            break;
        case historyitem_Table_TableAlign:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Writer.WriteLong(Data.New);
            }
            break;
        case historyitem_Table_TableInd:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Writer.WriteDouble(Data.New);
            }
            break;
        case historyitem_Table_TableBorder_Left:
            case historyitem_Table_TableBorder_Right:
            case historyitem_Table_TableBorder_Top:
            case historyitem_Table_TableBorder_Bottom:
            case historyitem_Table_TableBorder_InsideH:
            case historyitem_Table_TableBorder_InsideV:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Data.New.Write_ToBinary(Writer);
            }
            break;
        case historyitem_Table_TableShd:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Data.New.Write_ToBinary(Writer);
            }
            break;
        case historyitem_Table_Inline:
            Writer.WriteBool(Data.New);
            break;
        case historyitem_Table_AddRow:
            var bArray = Data.UseArray;
            var Count = 1;
            Writer.WriteLong(Count);
            for (var Index = 0; Index < Count; Index++) {
                if (true === bArray) {
                    Writer.WriteLong(Data.PosArray[Index]);
                } else {
                    Writer.WriteLong(Data.Pos + Index);
                }
                Writer.WriteString2(Data.Item.Row.Get_Id());
            }
            break;
        case historyitem_Table_RemoveRow:
            var bArray = Data.UseArray;
            var Count = 1;
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
        case historyitem_Table_TableGrid:
            var Count = Data.New.length;
            Writer.WriteLong(Count);
            for (var Index = 0; Index < Count; Index++) {
                Writer.WriteDouble(Data.New[Index]);
            }
            break;
        case historyitem_Table_TableLook:
            Data.New.Write_ToBinary(Writer);
            break;
        case historyitem_Table_AllowOverlap:
            Writer.WriteBool(Data.New);
            break;
        case historyitem_Table_PositionH:
            case historyitem_Table_PositionV:
            Writer.WriteLong(Data.New.RelativeFrom);
            Writer.WriteBool(Data.New.Align);
            if (true === Data.New.Align) {
                Writer.WriteLong(Data.New.Value);
            } else {
                Writer.WriteDouble(Data.New.Value);
            }
            break;
        case historyitem_Table_Distance:
            Writer.WriteDouble(Data.New.Left);
            Writer.WriteDouble(Data.New.Top);
            Writer.WriteDouble(Data.New.Right);
            Writer.WriteDouble(Data.New.Bottom);
            break;
        case historyitem_Table_TableStyleColBandSize:
            case historyitem_Table_TableStyleRowBandSize:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Writer.WriteLong(Data.New);
            }
            break;
        case historyitem_Table_TableStyle:
            if (null === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Writer.WriteString2(Data.New);
            }
            break;
        case historyitem_Table_Pr:
            Data.New.Write_ToBinary(Writer);
            break;
        }
        return Writer;
    },
    Save_Changes2: function (Data, Writer) {
        var bRetValue = false;
        var Type = Data.Type;
        switch (Type) {
        case historyitem_Table_DocNext:
            case historyitem_Table_DocPrev:
            case historyitem_Table_Parent:
            case historyitem_Table_TableW:
            case historyitem_Table_TableLayout:
            case historyitem_Table_TableCellMar:
            case historyitem_Table_TableAlign:
            case historyitem_Table_TableInd:
            case historyitem_Table_TableBorder_Left:
            case historyitem_Table_TableBorder_Right:
            case historyitem_Table_TableBorder_Top:
            case historyitem_Table_TableBorder_Bottom:
            case historyitem_Table_TableBorder_InsideH:
            case historyitem_Table_TableBorder_InsideV:
            case historyitem_Table_TableShd:
            case historyitem_Table_Inline:
            break;
        case historyitem_Table_AddRow:
            break;
        case historyitem_Table_RemoveRow:
            case historyitem_Table_TableGrid:
            break;
        }
        return bRetValue;
    },
    Load_Changes: function (Reader, Reader2) {
        var ClassType = Reader.GetLong();
        if (historyitem_type_Table != ClassType) {
            return;
        }
        var Type = Reader.GetLong();
        switch (Type) {
        case historyitem_Table_SetStyleIndex:
            if (Reader.GetBool()) {
                this.styleIndex = Reader.GetLong();
            } else {
                this.styleIndex = -1;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_DocNext:
            this.Next = g_oTableId.Get_ById(Reader.GetString2());
            break;
        case historyitem_Table_DocPrev:
            this.Prev = g_oTableId.Get_ById(Reader.GetString2());
            break;
        case historyitem_Table_Parent:
            var LinkData = new Object();
            LinkData.Parent = Reader.GetString2();
            LinkData.Type = historyitem_Table_Parent;
            CollaborativeEditing.Add_LinkData(this, LinkData);
            break;
        case historyitem_Table_TableW:
            if (true === Reader.GetBool()) {
                this.Pr.TableW = undefined;
            } else {
                this.Pr.TableW = new CTableMeasurement(tblwidth_Auto, 0);
                this.Pr.TableW.Read_FromBinary(Reader);
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableLayout:
            if (true === Reader.GetBool()) {
                this.Pr.TableLayout = undefined;
            } else {
                this.Pr.TableLayout = Reader.GetLong();
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableCellMar:
            if (true === Reader.GetBool()) {
                this.Pr.TableCellMar.Left = undefined;
            } else {
                this.Pr.TableCellMar.Left = new CTableMeasurement(tblwidth_Mm, 0);
                this.Pr.TableCellMar.Left.Read_FromBinary(Reader);
            }
            if (true === Reader.GetBool()) {
                this.Pr.TableCellMar.Right = undefined;
            } else {
                this.Pr.TableCellMar.Right = new CTableMeasurement(tblwidth_Mm, 0);
                this.Pr.TableCellMar.Right.Read_FromBinary(Reader);
            }
            if (true === Reader.GetBool()) {
                this.Pr.TableCellMar.Top = undefined;
            } else {
                this.Pr.TableCellMar.Top = new CTableMeasurement(tblwidth_Mm, 0);
                this.Pr.TableCellMar.Top.Read_FromBinary(Reader);
            }
            if (true === Reader.GetBool()) {
                this.Pr.TableCellMar.Bottom = undefined;
            } else {
                this.Pr.TableCellMar.Bottom = new CTableMeasurement(tblwidth_Mm, 0);
                this.Pr.TableCellMar.Bottom.Read_FromBinary(Reader);
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableAlign:
            if (true === Reader.GetBool()) {
                this.Pr.Jc = undefined;
            } else {
                this.Pr.Jc = Reader.GetLong();
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableInd:
            if (true === Reader.GetBool()) {
                this.Pr.TableInd = undefined;
            } else {
                this.Pr.TableInd = Reader.GetDouble();
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableBorder_Left:
            if (true === Reader.GetBool()) {
                this.Pr.TableBorders.Left = undefined;
            } else {
                this.Pr.TableBorders.Left = new CDocumentBorder();
                this.Pr.TableBorders.Left.Read_FromBinary(Reader);
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableBorder_Right:
            if (true === Reader.GetBool()) {
                this.Pr.TableBorders.Right = undefined;
            } else {
                this.Pr.TableBorders.Right = new CDocumentBorder();
                this.Pr.TableBorders.Right.Read_FromBinary(Reader);
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableBorder_Top:
            if (true === Reader.GetBool()) {
                this.Pr.TableBorders.Top = undefined;
            } else {
                this.Pr.TableBorders.Top = new CDocumentBorder();
                this.Pr.TableBorders.Top.Read_FromBinary(Reader);
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableBorder_Bottom:
            if (true === Reader.GetBool()) {
                this.Pr.TableBorders.Bottom = undefined;
            } else {
                this.Pr.TableBorders.Bottom = new CDocumentBorder();
                this.Pr.TableBorders.Bottom.Read_FromBinary(Reader);
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableBorder_InsideH:
            if (true === Reader.GetBool()) {
                this.Pr.TableBorders.InsideH = undefined;
            } else {
                this.Pr.TableBorders.InsideH = new CDocumentBorder();
                this.Pr.TableBorders.InsideH.Read_FromBinary(Reader);
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableBorder_InsideV:
            if (true === Reader.GetBool()) {
                this.Pr.TableBorders.InsideV = undefined;
            } else {
                this.Pr.TableBorders.InsideV = new CDocumentBorder();
                this.Pr.TableBorders.InsideV.Read_FromBinary(Reader);
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableShd:
            if (true === Reader.GetBool()) {
                this.Pr.Shd = undefined;
            } else {
                this.Pr.Shd = new CDocumentShd();
                this.Pr.Shd.Read_FromBinary(Reader);
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_Inline:
            this.Inline = Reader.GetBool();
            break;
        case historyitem_Table_AddRow:
            var Count = Reader.GetLong();
            for (var Index = 0; Index < Count; Index++) {
                var Pos = this.m_oContentChanges.Check(contentchanges_Add, Reader.GetLong());
                var Element = g_oTableId.Get_ById(Reader.GetString2());
                if (null != Element) {
                    this.Content.splice(Pos, 0, Element);
                }
            }
            break;
        case historyitem_Table_RemoveRow:
            var Count = Reader.GetLong();
            for (var Index = 0; Index < Count; Index++) {
                var Pos = this.m_oContentChanges.Check(contentchanges_Remove, Reader.GetLong());
                if (false === Pos) {
                    continue;
                }
                this.Content.splice(Pos, 1);
            }
            break;
        case historyitem_Table_TableGrid:
            var Count = Reader.GetLong();
            var NewGrid = new Array();
            for (var Index = 0; Index < Count; Index++) {
                NewGrid.push(Reader.GetDouble());
            }
            this.TableGrid = NewGrid;
            break;
        case historyitem_Table_TableLook:
            var TableLook = new CTableLook();
            TableLook.Read_FromBinary(Reader);
            this.TableLook = TableLook;
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_AllowOverlap:
            this.AllowOverlap = Reader.GetBool();
            break;
        case historyitem_Table_PositionH:
            this.PositionH.RelativeFrom = Reader.GetLong();
            this.PositionH.Align = Reader.GetBool();
            if (true === this.PositionH.Align) {
                this.PositionH.Value = Reader.GetLong();
            } else {
                this.PositionH.Value = Reader.GetDouble();
            }
            break;
        case historyitem_Table_PositionV:
            this.PositionV.RelativeFrom = Reader.GetLong();
            this.PositionV.Align = Reader.GetBool();
            if (true === this.PositionV.Align) {
                this.PositionV.Value = Reader.GetLong();
            } else {
                this.PositionV.Value = Reader.GetDouble();
            }
            break;
        case historyitem_Table_Distance:
            this.Distance.L = Reader.GetDouble();
            this.Distance.T = Reader.GetDouble();
            this.Distance.R = Reader.GetDouble();
            this.Distance.B = Reader.GetDouble();
            break;
        case historyitem_Table_TableStyleColBandSize:
            if (true === Reader.GetBool()) {
                this.Pr.TableStyleColBandSize = undefined;
            } else {
                this.Pr.TableStyleColBandSize = Reader.GetLong();
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableStyleRowBandSize:
            if (true === Reader.GetBool()) {
                this.Pr.TableStyleRowBandSize = undefined;
            } else {
                this.Pr.TableStyleRowBandSize = Reader.GetLong();
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_TableStyle:
            if (true === Reader.GetBool()) {
                this.styleIndex = null;
            } else {
                this.styleIndex = Reader.GetString2();
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_Table_Pr:
            this.Pr = new CTablePr();
            this.Pr.Read_FromBinary(Reader);
            this.Recalc_CompiledPr();
            break;
        }
        if (this.Parent) {
            this.Parent.onParagraphChanged();
        }
        return true;
    },
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(historyitem_type_Table);
        Writer.WriteLong(type_Table);
        Writer.WriteString2(this.Id);
        Writer.WriteString2(this.Parent.Get_Id());
        Writer.WriteString2(null === this.TableStyle ? "" : this.TableStyle);
        Writer.WriteBool(this.Inline);
        var GridCount = this.TableGrid.length;
        Writer.WriteLong(GridCount);
        for (var Index = 0; Index < GridCount; Index++) {
            Writer.WriteDouble(this.TableGrid[Index]);
        }
        Writer.WriteDouble(this.X_origin);
        Writer.WriteDouble(this.X);
        Writer.WriteDouble(this.Y);
        Writer.WriteDouble(this.XLimit);
        Writer.WriteDouble(this.YLimit);
        this.Pr.Write_ToBinary(Writer);
        var RowsCount = this.Content.length;
        Writer.WriteLong(RowsCount);
        for (var Index = 0; Index < RowsCount; Index++) {
            Writer.WriteString2(this.Content[Index].Get_Id());
        }
    },
    Read_FromBinary2: function (Reader) {
        Reader.GetLong();
        this.Id = Reader.GetString2();
        var LinkData = new Object();
        LinkData.Parent = Reader.GetString2();
        LinkData.Type = historyitem_Table_Parent;
        CollaborativeEditing.Add_LinkData(this, LinkData);
        var TableStyleId = Reader.GetString2();
        this.TableStyle = (TableStyleId === "" ? null : TableStyleId);
        this.Inline = Reader.GetBool();
        var GridCount = Reader.GetLong();
        this.TableGrid = new Array();
        for (var Index = 0; Index < GridCount; Index++) {
            this.TableGrid.push(Reader.GetDouble());
        }
        this.X_origin = Reader.GetDouble();
        this.X = Reader.GetDouble();
        this.Y = Reader.GetDouble();
        this.XLimit = Reader.GetDouble();
        this.YLimit = Reader.GetDouble();
        this.Pr = new CTablePr();
        this.Pr.Read_FromBinary(Reader);
        this.Recalc_CompiledPr();
        var Count = Reader.GetLong();
        this.Content = new Array();
        for (var Index = 0; Index < Count; Index++) {
            var Row = g_oTableId.Get_ById(Reader.GetString2());
            this.Content.push(Row);
        }
        this.Internal_ReIndexing();
        CollaborativeEditing.Add_NewObject(this);
        this.DrawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
        var LinkData = new Object();
        LinkData.CurCell = true;
        CollaborativeEditing.Add_LinkData(this, LinkData);
    },
    Load_LinkData: function (LinkData) {
        if ("undefined" != typeof(LinkData) && "undefined" != typeof(LinkData.Type)) {
            switch (LinkData.Type) {
            case historyitem_Table_DocNext:
                this.Next = g_oTableId.Get_ById(LinkData.Next);
                break;
            case historyitem_Table_DocPrev:
                this.Prev = g_oTableId.Get_ById(LinkData.Prev);
                break;
            case historyitem_Table_Parent:
                this.Parent = g_oTableId.Get_ById(LinkData.Parent);
                break;
            }
        }
        if ("undefined" != typeof(LinkData) && "undefined" != typeof(LinkData.CurCell)) {
            if (this.Content.length > 0 && this.Content[0].Get_CellsCount() > 0) {
                this.CurCell = this.Content[0].Get_Cell(0);
            }
        }
    },
    Hyperlink_Add: function (HyperProps) {
        return this.CurCell.Content.Hyperlink_Add(HyperProps);
    },
    Hyperlink_Modify: function (HyperProps) {
        if (false === this.Selection.Use || (true === this.Selection.Use && table_Selection_Text === this.Selection.Type)) {
            this.CurCell.Content.Hyperlink_Modify(HyperProps);
        }
        return false;
    },
    Hyperlink_Remove: function () {
        if (false === this.Selection.Use || (true === this.Selection.Use && table_Selection_Text === this.Selection.Type)) {
            this.CurCell.Content.Hyperlink_Remove();
        }
    },
    Hyperlink_CanAdd: function (bCheckInHyperlink) {
        if (false === this.Selection.Use || (true === this.Selection.Use && table_Selection_Text === this.Selection.Type)) {
            return this.CurCell.Content.Hyperlink_CanAdd(bCheckInHyperlink);
        }
        return false;
    },
    Hyperlink_Check: function (bCheckEnd) {
        if (false === this.Selection.Use || (true === this.Selection.Use && table_Selection_Text === this.Selection.Type)) {
            return this.CurCell.Content.Hyperlink_Check(bCheckEnd);
        }
        return null;
    },
    Add_Comment: function (Comment, bStart, bEnd) {
        if (true === this.ApplyToAll) {
            var RowsCount = this.Content.length;
            var CellsCount = this.Content[RowsCount - 1].Get_CellsCount();
            if (true === bStart && true === bEnd && RowsCount <= 1 && CellsCount <= 1) {
                var Cell_Content = this.Content[0].Get_Cell(0).Content;
                Cell_Content.Set_ApplyToAll(true);
                Cell_Content.Add_Comment(Comment, true, true);
                Cell_Content.Set_ApplyToAll(false);
            } else {
                if (true === bStart) {
                    var Cell_Content = this.Content[0].Get_Cell(0).Content;
                    Cell_Content.Set_ApplyToAll(true);
                    Cell_Content.Add_Comment(Comment, true, false);
                    Cell_Content.Set_ApplyToAll(false);
                }
                if (true === bEnd) {
                    var Cell_Content = this.Content[RowsCount - 1].Get_Cell(CellsCount - 1).Content;
                    Cell_Content.Set_ApplyToAll(true);
                    Cell_Content.Add_Comment(Comment, false, true);
                    Cell_Content.Set_ApplyToAll(false);
                }
            }
        } else {
            if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
                if (true === bStart && true === bEnd && this.Selection.Data.length <= 1) {
                    var Pos = this.Selection.Data[0];
                    var Cell_Content = this.Content[Pos.Row].Get_Cell(Pos.Cell).Content;
                    Cell_Content.Set_ApplyToAll(true);
                    Cell_Content.Add_Comment(Comment, true, true);
                    Cell_Content.Set_ApplyToAll(false);
                } else {
                    if (true === bStart) {
                        var Pos = this.Selection.Data[0];
                        var Cell_Content = this.Content[Pos.Row].Get_Cell(Pos.Cell).Content;
                        Cell_Content.Set_ApplyToAll(true);
                        Cell_Content.Add_Comment(Comment, true, false);
                        Cell_Content.Set_ApplyToAll(false);
                    }
                    if (true === bEnd) {
                        var Pos = this.Selection.Data[this.Selection.Data.length - 1];
                        var Cell_Content = this.Content[Pos.Row].Get_Cell(Pos.Cell).Content;
                        Cell_Content.Set_ApplyToAll(true);
                        Cell_Content.Add_Comment(Comment, false, true);
                        Cell_Content.Set_ApplyToAll(false);
                    }
                }
            } else {
                this.CurCell.Content.Add_Comment(Comment, bStart, bEnd);
            }
        }
    },
    CanAdd_Comment: function () {
        if (true === this.ApplyToAll) {
            if (this.Content.length > 1 || this.Content[0].Get_CellsCount() > 1) {
                return true;
            }
            this.Content[0].Get_Cell(0).Content.Set_ApplyToAll(true);
            var Result = this.Content[0].Get_Cell(0).Content.CanAdd_Comment();
            this.Content[0].Get_Cell(0).Content.Set_ApplyToAll(false);
            return Result;
        } else {
            if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
                if (this.Selection.Data.length > 1) {
                    return true;
                } else {
                    var Pos = this.Selection.Data[0];
                    var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
                    return Cell.Content.CanAdd_Comment();
                }
            } else {
                return this.CurCell.Content.CanAdd_Comment();
            }
        }
    },
    Cursor_MoveAt: function (X, Y, bLine, bDontChangeRealPos, PageNum) {
        var PageIndex = PageNum - this.PageNum;
        var Pos = this.Internal_GetCellByXY(X, Y, PageIndex);
        var Row = this.Content[Pos.Row];
        var Cell = Row.Get_Cell(Pos.Cell);
        this.Selection.Type = table_Selection_Text;
        this.Selection.Type2 = table_Selection_Common;
        this.Selection.StartPos.Pos = {
            Row: Pos.Row,
            Cell: Pos.Cell
        };
        this.Selection.EndPos.Pos = {
            Row: Pos.Row,
            Cell: Pos.Cell
        };
        this.CurCell = Cell;
        this.DrawingDocument.TargetStart();
        this.DrawingDocument.TargetShow();
        this.CurCell.Content.Cursor_MoveAt(X, Y, false, true, PageIndex + this.Get_StartPage_Absolute());
        this.RecalculateCurPos();
    },
    Selection_SetStart: function (X, Y, PageIndex, MouseEvent) {
        var PageNum = PageIndex - this.PageNum;
        if (PageNum < 0 || PageNum >= this.Pages.length) {
            PageNum = 0;
        }
        var Result = this.Internal_CheckBorders(X, Y, PageNum);
        var Pos = Result.Pos;
        if (-1 === Result.Border) {
            var bInnerTableBorder = (null != this.Is_TableBorder(X, Y, PageNum + this.Get_StartPage_Absolute()) ? true : false);
            if (true === bInnerTableBorder) {
                var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
                Cell.Content.Selection_SetStart(X, Y, PageNum, MouseEvent);
                this.Selection.Type2 = table_Selection_Border_InnerTable;
                this.Selection.Data2 = Cell;
            } else {
                this.Selection_Remove();
                this.CurCell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
                this.CurCell.Content.Selection_SetStart(X, Y, PageNum, MouseEvent);
                this.Selection.Use = true;
                this.Selection.Start = true;
                this.Selection.Type = table_Selection_Text;
                this.Selection.Type2 = table_Selection_Common;
                this.Selection.Data2 = null;
                this.Selection.StartPos.Pos = Pos;
                this.Selection.StartPos.X = X;
                this.Selection.StartPos.Y = Y;
                this.Selection.StartPos.PageIndex = PageNum;
                this.Selection.StartPos.MouseEvent = {
                    ClickCount: MouseEvent.ClickCount,
                    Type: MouseEvent.Type,
                    CtrlKey: MouseEvent.CtrlKey
                };
            }
        } else {
            this.Internal_Update_TableMarkup(Pos.Row, Pos.Cell, PageNum);
            this.Selection.Type2 = table_Selection_Border;
            this.Selection.Data2 = new Object();
            this.Selection.Data2.PageNum = PageNum;
            var Row = this.Content[Pos.Row];
            var _X = parseInt(X / 2.5 + 0.5) * 2.5;
            var _Y = parseInt(Y / 2.5 + 0.5) * 2.5;
            if (0 === Result.Border || 2 === Result.Border) {
                var Y_min = 0;
                var Y_max = Page_Height;
                this.Selection.Data2.bCol = false;
                var Row_start = this.Pages[PageNum].FirstRow;
                if (0 === Result.Border) {
                    this.Selection.Data2.Index = Pos.Row - Row_start;
                } else {
                    this.Selection.Data2.Index = Result.Row - Row_start + 1;
                }
                if (0 != this.Selection.Data2.Index) {
                    var TempRow = this.Selection.Data2.Index + Row_start - 1;
                    Y_min = this.RowsInfo[TempRow].Y[PageNum];
                }
                this.Selection.Data2.Min = Y_min;
                this.Selection.Data2.Max = Y_max;
                if (null != this.Selection.Data2.Min) {
                    _Y = Math.max(_Y, this.Selection.Data2.Min);
                }
                if (null != this.Selection.Data2.Max) {
                    _Y = Math.min(_Y, this.Selection.Data2.Max);
                }
            } else {
                var CellsCount = Row.Get_CellsCount();
                var CellSpacing = (null === Row.Get_CellSpacing() ? 0 : Row.Get_CellSpacing());
                var X_min = null;
                var X_max = null;
                this.Selection.Data2.bCol = true;
                if (3 === Result.Border) {
                    this.Selection.Data2.Index = Pos.Cell;
                } else {
                    this.Selection.Data2.Index = Pos.Cell + 1;
                }
                if (0 != this.Selection.Data2.Index) {
                    var Margins = Row.Get_Cell(this.Selection.Data2.Index - 1).Get_Margins();
                    if (0 != this.Selection.Data2.Index - 1 && this.Selection.Data2.Index != CellsCount) {
                        X_min = Row.Get_CellInfo(this.Selection.Data2.Index - 1).X_grid_start + Margins.Left.W + Margins.Right.W + CellSpacing;
                    } else {
                        X_min = Row.Get_CellInfo(this.Selection.Data2.Index - 1).X_grid_start + Margins.Left.W + Margins.Right.W + 1.5 * CellSpacing;
                    }
                }
                if (CellsCount != this.Selection.Data2.Index) {
                    var Margins = Row.Get_Cell(this.Selection.Data2.Index).Get_Margins();
                    if (CellsCount - 1 != this.Selection.Data2.Index) {
                        X_max = Row.Get_CellInfo(this.Selection.Data2.Index).X_grid_end - (Margins.Left.W + Margins.Right.W + CellSpacing);
                    } else {
                        X_max = Row.Get_CellInfo(this.Selection.Data2.Index).X_grid_end - (Margins.Left.W + Margins.Right.W + 1.5 * CellSpacing);
                    }
                }
                this.Selection.Data2.Min = X_min;
                this.Selection.Data2.Max = X_max;
                this.Selection.Data2.Pos = {
                    Row: Pos.Row,
                    Cell: Pos.Cell
                };
                if (null != this.Selection.Data2.Min) {
                    _X = Math.max(_X, this.Selection.Data2.Min);
                }
                if (null != this.Selection.Data2.Max) {
                    _X = Math.min(_X, this.Selection.Data2.Max);
                }
            }
            this.Selection.Data2.X = _X;
            this.Selection.Data2.Y = _Y;
            this.DrawingDocument.LockCursorTypeCur();
        }
    },
    Selection_SetEnd: function (X, Y, PageIndex, MouseEvent) {
        var TablePr = this.Get_CompiledPr(false).TablePr;
        var PageNum = PageIndex - this.PageNum;
        if (PageNum < 0 || PageNum >= this.Pages.length) {
            PageNum = 0;
        }
        if (this.Selection.Type2 === table_Selection_Border) {
            if (true === editor.isViewMode || this.Selection.Data2.PageNum != PageIndex - this.PageNum) {
                return;
            }
            var _X = parseInt(X / 2.5 + 0.5) * 2.5;
            var _Y = parseInt(Y / 2.5 + 0.5) * 2.5;
            var _pos_x = parseInt(this.Parent.transform.TransformPointX(X, Y) / 2.5 + 0.5) * 2.5;
            var _pos_y = parseInt(this.Parent.transform.TransformPointY(X, Y) / 2.5 + 0.5) * 2.5;
            if (true === this.Selection.Data2.bCol) {
                if (null != this.Selection.Data2.Min) {
                    _X = Math.max(_X, this.Selection.Data2.Min);
                    _pos_x = Math.max(_pos_x, parseInt(this.Parent.transform.TransformPointX(this.Selection.Data2.Min, Y) / 2.5 + 0.5) * 2.5);
                }
                if (null != this.Selection.Data2.Max) {
                    _X = Math.min(_X, this.Selection.Data2.Max);
                    _pos_x = Math.min(_pos_x, parseInt(this.Parent.transform.TransformPointX(this.Selection.Data2.Max, Y) / 2.5 + 0.5) * 2.5);
                }
                this.DrawingDocument.UpdateTableRuler(this.Selection.Data2.bCol, this.Selection.Data2.Index, _pos_x);
            } else {
                if (null != this.Selection.Data2.Min) {
                    _Y = Math.max(_Y, this.Selection.Data2.Min);
                    _pos_y = Math.max(_pos_y, parseInt(this.Parent.transform.TransformPointY(X, this.Selection.Data2.Min) / 2.5 + 0.5) * 2.5);
                }
                if (null != this.Selection.Data2.Max) {
                    _Y = Math.min(_Y, this.Selection.Data2.Max);
                    _pos_y = Math.min(_pos_y, parseInt(this.Parent.transform.TransformPointY(X, this.Selection.Data2.Max) / 2.5 + 0.5) * 2.5);
                }
                this.DrawingDocument.UpdateTableRuler(this.Selection.Data2.bCol, this.Selection.Data2.Index, _pos_y);
            }
            this.Selection.Data2.X = _X;
            this.Selection.Data2.Y = _Y;
            if (MouseEvent.Type === g_mouse_event_type_up) {
                if (true === this.Selection.Data2.bCol) {
                    var Index = this.Selection.Data2.Index;
                    var CurRow = this.Selection.Data2.Pos.Row;
                    var Row = this.Content[CurRow];
                    var Col = 0;
                    if (Index === this.Markup.Cols.length) {
                        Col = Row.Get_CellInfo(Index - 1).StartGridCol + Row.Get_Cell(Index - 1).Get_GridSpan();
                    } else {
                        Col = Row.Get_CellInfo(Index).StartGridCol;
                    }
                    var Dx = _X - (this.X + this.TableSumGrid[Col - 1]);
                    var Rows_info = new Array();
                    var bBorderInSelection = false;
                    if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0) {
                        var CellsFlag = new Array();
                        for (CurRow = 0; CurRow < this.Content.length; CurRow++) {
                            CellsFlag[CurRow] = new Array();
                            Row = this.Content[CurRow];
                            var CellsCount = Row.Get_CellsCount();
                            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                                CellsFlag[CurRow][CurCell] = 0;
                            }
                        }
                        var CurSelectedCell = this.Selection.Data[0];
                        var CurSelectedIndex = 0;
                        for (CurRow = 0; CurRow < this.Content.length; CurRow++) {
                            Row = this.Content[CurRow];
                            var CellsCount = Row.Get_CellsCount();
                            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                                if (CurSelectedCell.Cell === CurCell && CurSelectedCell.Row === CurRow) {
                                    CellsFlag[CurRow][CurCell] = 1;
                                    var StartGridCol = Row.Get_CellInfo(CurCell).StartGridCol;
                                    var GridSpan = Row.Get_Cell(CurCell).Get_GridSpan();
                                    var VMergeCount = this.Internal_GetVertMergeCount(CurRow, StartGridCol, GridSpan);
                                    if (CurRow === this.Selection.Data2.Pos.Row && Col >= StartGridCol && Col <= StartGridCol + GridSpan) {
                                        bBorderInSelection = true;
                                    }
                                    for (var TempIndex = 1; TempIndex < VMergeCount; TempIndex++) {
                                        var TempCell = this.Internal_Get_Cell_ByStartGridCol(CurRow + TempIndex, StartGridCol);
                                        if (-1 != TempCell) {
                                            CellsFlag[CurRow + TempIndex][TempCell] = 1;
                                            if (CurRow + TempIndex === this.Selection.Data2.Pos.Row && Col >= StartGridCol && Col <= StartGridCol + GridSpan) {
                                                bBorderInSelection = true;
                                            }
                                        }
                                    }
                                    if (CurSelectedIndex < this.Selection.Data.length - 1) {
                                        CurSelectedCell = this.Selection.Data[++CurSelectedIndex];
                                    } else {
                                        CurSelectedCell = {
                                            Row: -1,
                                            Cell: -1
                                        };
                                    }
                                }
                            }
                        }
                    }
                    var OldTableInd = TablePr.TableInd;
                    var NewTableInd = TablePr.TableInd;
                    if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && true === bBorderInSelection) {
                        var BeforeFlag = false;
                        var BeforeSpace2 = null;
                        if (0 === Col) {
                            BeforeSpace2 = _X - this.X;
                            if (BeforeSpace2 < 0) {
                                this.Set_TableW(tblwidth_Auto, 0);
                                this.X += BeforeSpace2;
                                if (true === this.Is_Inline()) {
                                    NewTableInd = NewTableInd + BeforeSpace2;
                                } else {
                                    this.Internal_UpdateFlowPosition(this.X, this.Y);
                                }
                            }
                        }
                        var BeforeSpace = null;
                        if (0 === Index && 0 != Col && _X < this.X) {
                            BeforeSpace = this.X - _X;
                            this.X -= BeforeSpace;
                            this.Set_TableW(tblwidth_Auto, 0);
                            if (true === this.Is_Inline()) {
                                NewTableInd = NewTableInd - BeforeSpace;
                            } else {
                                this.Internal_UpdateFlowPosition(this.X, this.Y);
                            }
                        }
                        if (Index === this.Markup.Cols.length) {
                            this.Set_TableW(tblwidth_Auto, 0);
                        }
                        for (CurRow = 0; CurRow < this.Content.length; CurRow++) {
                            Rows_info[CurRow] = new Array();
                            Row = this.Content[CurRow];
                            var Before_Info = Row.Get_Before();
                            var WBefore = 0;
                            if (null === BeforeSpace2) {
                                if (Before_Info.GridBefore > 0 && Col === Before_Info.GridBefore && 1 === CellsFlag[CurRow][0]) {
                                    WBefore = this.TableSumGrid[Before_Info.GridBefore - 1] + Dx;
                                } else {
                                    if (null != BeforeSpace) {
                                        WBefore = this.TableSumGrid[Before_Info.GridBefore - 1] + BeforeSpace;
                                    } else {
                                        WBefore = this.TableSumGrid[Before_Info.GridBefore - 1];
                                    }
                                }
                            } else {
                                if (BeforeSpace2 > 0) {
                                    if (0 === Before_Info.GridBefore && 1 === CellsFlag[CurRow][0]) {
                                        WBefore = BeforeSpace2;
                                    } else {
                                        if (0 != Before_Info.GridBefore) {
                                            WBefore = this.TableSumGrid[Before_Info.GridBefore - 1];
                                        }
                                    }
                                } else {
                                    if (0 === Before_Info.GridBefore && 1 != CellsFlag[CurRow][0]) {
                                        WBefore = -BeforeSpace2;
                                    } else {
                                        if (0 != Before_Info.GridBefore) {
                                            WBefore = -BeforeSpace2 + this.TableSumGrid[Before_Info.GridBefore - 1];
                                        }
                                    }
                                }
                            }
                            if (WBefore > 0.001) {
                                Rows_info[CurRow].push({
                                    W: WBefore,
                                    Type: -1,
                                    GridSpan: 1
                                });
                            }
                            var CellsCount = Row.Get_CellsCount();
                            var TempDx = Dx;
                            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                                var Cell = Row.Get_Cell(CurCell);
                                var CellMargins = Cell.Get_Margins();
                                var Cur_Grid_start = Row.Get_CellInfo(CurCell).StartGridCol;
                                var Cur_Grid_end = Cur_Grid_start + Cell.Get_GridSpan() - 1;
                                var W = 0;
                                if (Cur_Grid_end + 1 === Col && (1 === CellsFlag[CurRow][CurCell] || (CurCell + 1 < CellsCount && 1 === CellsFlag[CurRow][CurCell + 1]))) {
                                    W = this.TableSumGrid[Cur_Grid_end] - this.TableSumGrid[Cur_Grid_start - 1] + Dx;
                                } else {
                                    if (Cur_Grid_start === Col && (1 === CellsFlag[CurRow][CurCell] || (CurCell > 0 && 1 === CellsFlag[CurRow][CurCell - 1]))) {
                                        W = this.TableSumGrid[Cur_Grid_end] - this.TableSumGrid[Cur_Grid_start - 1] - TempDx;
                                    } else {
                                        W = this.TableSumGrid[Cur_Grid_end] - this.TableSumGrid[Cur_Grid_start - 1];
                                    }
                                }
                                W = Math.max(1, Math.max(W, CellMargins.Left.W + CellMargins.Right.W));
                                if (Cur_Grid_end + 1 === Col && (1 === CellsFlag[CurRow][CurCell] || (CurCell + 1 < CellsCount && 1 === CellsFlag[CurRow][CurCell + 1]))) {
                                    TempDx = W - (this.TableSumGrid[Cur_Grid_end] - this.TableSumGrid[Cur_Grid_start - 1]);
                                }
                                Rows_info[CurRow].push({
                                    W: W,
                                    Type: 0,
                                    GridSpan: 1
                                });
                            }
                        }
                        var MinBefore = 0;
                        for (CurRow = 0; CurRow < this.Content.length; CurRow++) {
                            if (-1 != Rows_info[CurRow][0].Type) {
                                MinBefore = 0;
                                break;
                            }
                            if (0 === MinBefore || MinBefore > Rows_info[CurRow][0].W) {
                                MinBefore = Rows_info[CurRow][0].W;
                            }
                        }
                        if (0 != MinBefore) {
                            for (CurRow = 0; CurRow < this.Content.length; CurRow++) {
                                if (Math.abs(MinBefore - Rows_info[CurRow][0].W) < 0.001) {
                                    Rows_info[CurRow].splice(0, 1);
                                } else {
                                    Rows_info[CurRow][0].W -= MinBefore;
                                }
                            }
                            this.X += MinBefore;
                            if (true === this.Is_Inline()) {
                                NewTableInd = NewTableInd + MinBefore;
                            } else {
                                this.Internal_UpdateFlowPosition(this.X, this.Y);
                            }
                        }
                    } else {
                        var BeforeFlag = false;
                        var BeforeSpace2 = null;
                        if (0 === Col) {
                            BeforeSpace2 = this.X - _X;
                            if (-BeforeSpace2 > this.TableSumGrid[0]) {
                                BeforeFlag = true;
                                this.X += this.TableSumGrid[0];
                            } else {
                                this.X += Dx;
                            }
                            this.Set_TableW(tblwidth_Auto, 0);
                            if (true === this.Is_Inline()) {
                                if (-BeforeSpace2 > this.TableSumGrid[0]) {
                                    NewTableInd = NewTableInd + this.TableSumGrid[0];
                                } else {
                                    NewTableInd = NewTableInd + Dx;
                                }
                            } else {
                                this.Internal_UpdateFlowPosition(this.X, this.Y);
                            }
                        }
                        if (Index === this.Markup.Cols.length) {
                            this.Set_TableW(tblwidth_Auto, 0);
                        }
                        var BeforeSpace = null;
                        if (0 === Index && 0 != Col && _X < this.X) {
                            BeforeSpace = this.X - _X;
                            this.X -= BeforeSpace;
                            if (true === this.Is_Inline()) {
                                NewTableInd = NewTableInd - BeforeSpace;
                            } else {
                                this.Internal_UpdateFlowPosition(this.X, this.Y);
                            }
                        }
                        for (CurRow = 0; CurRow < this.Content.length; CurRow++) {
                            Rows_info[CurRow] = new Array();
                            Row = this.Content[CurRow];
                            var Before_Info = Row.Get_Before();
                            var WBefore = 0;
                            if (Before_Info.GridBefore > 0 && Col === Before_Info.GridBefore) {
                                WBefore = this.TableSumGrid[Before_Info.GridBefore - 1] + Dx;
                            } else {
                                if (null != BeforeSpace) {
                                    WBefore = this.TableSumGrid[Before_Info.GridBefore - 1] + BeforeSpace;
                                } else {
                                    WBefore = this.TableSumGrid[Before_Info.GridBefore - 1];
                                }
                                if (null != BeforeSpace2) {
                                    if (Before_Info.GridBefore > 0) {
                                        if (true === BeforeFlag) {
                                            WBefore = this.TableSumGrid[Before_Info.GridBefore - 1] - this.TableSumGrid[0];
                                        } else {
                                            WBefore = this.TableSumGrid[Before_Info.GridBefore - 1] + BeforeSpace2;
                                        }
                                    } else {
                                        if (0 === Before_Info.GridBefore && true === BeforeFlag) {
                                            WBefore = (-BeforeSpace2) - this.TableSumGrid[0];
                                        }
                                    }
                                }
                            }
                            if (WBefore > 0.001) {
                                Rows_info[CurRow].push({
                                    W: WBefore,
                                    Type: -1,
                                    GridSpan: 1
                                });
                            }
                            var CellsCount = Row.Get_CellsCount();
                            var TempDx = Dx;
                            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                                var Cell = Row.Get_Cell(CurCell);
                                var CellMargins = Cell.Get_Margins();
                                var Cur_Grid_start = Row.Get_CellInfo(CurCell).StartGridCol;
                                var Cur_Grid_end = Cur_Grid_start + Cell.Get_GridSpan() - 1;
                                var W = 0;
                                if (Cur_Grid_end + 1 === Col) {
                                    W = this.TableSumGrid[Cur_Grid_end] - this.TableSumGrid[Cur_Grid_start - 1] + Dx;
                                } else {
                                    if (Cur_Grid_start === Col) {
                                        W = this.TableSumGrid[Cur_Grid_end] - this.TableSumGrid[Cur_Grid_start - 1] - TempDx;
                                    } else {
                                        W = this.TableSumGrid[Cur_Grid_end] - this.TableSumGrid[Cur_Grid_start - 1];
                                    }
                                }
                                W = Math.max(1, Math.max(W, CellMargins.Left.W + CellMargins.Right.W));
                                if (Cur_Grid_end + 1 === Col) {
                                    TempDx = W - (this.TableSumGrid[Cur_Grid_end] - this.TableSumGrid[Cur_Grid_start - 1]);
                                }
                                Rows_info[CurRow].push({
                                    W: W,
                                    Type: 0,
                                    GridSpan: 1
                                });
                            }
                        }
                    }
                    if (Math.abs(NewTableInd - OldTableInd) > 0.001) {
                        this.Set_TableInd(NewTableInd);
                    }
                    if (tbllayout_AutoFit === this.Get_CompiledPr(false).TablePr.TableLayout) {
                        this.Set_TableLayout(tbllayout_Fixed);
                    }
                    this.Internal_CreateNewGrid(Rows_info);
                    this.Internal_RecalculateGrid();
                } else {
                    var RowIndex = this.Pages[this.Selection.Data2.PageNum].FirstRow + this.Selection.Data2.Index;
                    if (0 === RowIndex) {
                        if (true === this.Is_Inline()) {} else {
                            var Dy = _Y - this.Markup.Rows[0].Y;
                            this.Y += Dy;
                            this.Internal_UpdateFlowPosition(this.X, this.Y);
                        }
                    } else {
                        if (this.Selection.Data2.PageNum > 0 && 0 === this.Selection.Data2.Index) {} else {
                            var _Y_old = this.Markup.Rows[this.Selection.Data2.Index - 1].Y + this.Markup.Rows[this.Selection.Data2.Index - 1].H;
                            var Dy = _Y - _Y_old;
                            var NewH = this.Markup.Rows[this.Selection.Data2.Index - 1].H + Dy;
                            this.Content[RowIndex - 1].Set_Height(NewH, heightrule_AtLeast);
                        }
                    }
                }
                this.Internal_Recalculate_1();
                this.Internal_OnContentRecalculate(true, 0, this.Index);
                this.Selection.Type2 = table_Selection_Common;
                this.Selection.Data2 = null;
            }
            return;
        } else {
            if (table_Selection_Border_InnerTable === this.Selection.Type2) {
                var Cell = this.Selection.Data2;
                Cell.Content.Selection_SetEnd(X, Y, PageNum, MouseEvent);
                if (MouseEvent.Type === g_mouse_event_type_up) {
                    this.Selection.Type2 = table_Selection_Common;
                    this.Selection.Data2 = null;
                }
                return;
            }
        }
        var Pos = this.Internal_GetCellByXY(X, Y, PageNum);
        this.Content[Pos.Row].Get_Cell(Pos.Cell).Content.Set_CurPosXY(X, Y);
        this.Selection.Data = null;
        this.Selection.EndPos.Pos = Pos;
        this.Selection.EndPos.X = X;
        this.Selection.EndPos.Y = Y;
        this.Selection.EndPos.PageIndex = PageNum;
        this.Selection.EndPos.MouseEvent = MouseEvent;
        this.Selection.CurRow = Pos.Row;
        if (true === this.Parent.Selection_Is_OneElement() && this.Selection.StartPos.Pos.Row === this.Selection.EndPos.Pos.Row && this.Selection.StartPos.Pos.Cell === this.Selection.EndPos.Pos.Cell) {
            this.CurCell.Content.Selection_SetStart(this.Selection.StartPos.X, this.Selection.StartPos.Y, this.Selection.StartPos.PageIndex, this.Selection.StartPos.MouseEvent);
            this.Selection.Type = table_Selection_Text;
            this.CurCell.Content.Selection_SetEnd(X, Y, PageNum, MouseEvent);
            if (g_mouse_event_type_up == MouseEvent.Type) {
                this.Selection.Start = false;
            }
            if (false === this.CurCell.Content.Selection.Use) {
                this.Selection.Use = false;
                this.Selection.Start = false;
                this.Cursor_MoveAt(X, Y, false, false, this.PageNum + PageNum);
                return;
            }
        } else {
            if (g_mouse_event_type_up == MouseEvent.Type) {
                this.Selection.Start = false;
            }
            this.Selection.Type = table_Selection_Cell;
            this.Internal_Selection_UpdateCells();
        }
    },
    Selection_Stop: function (X, Y, PageIndex, MouseEvent) {
        if (true != this.Selection.Use) {
            return;
        }
        this.Selection.Start = false;
        this.Content[this.Selection.StartPos.Pos.Row].Get_Cell(this.Selection.StartPos.Pos.Cell).Content.Selection_Stop(X, Y, PageIndex - this.PageNum, MouseEvent);
    },
    Selection_Draw_Page: function (Page_abs) {
        if (false === this.Selection.Use) {
            return;
        }
        var CurPage = Page_abs - this.Get_StartPage_Absolute();
        if (CurPage < 0 || CurPage >= this.Pages.length) {
            return;
        }
        switch (this.Selection.Type) {
        case table_Selection_Cell:
            var StartPage_Abs = this.Get_StartPage_Absolute();
            var CurPage = 0;
            var Row_start = this.Selection.Data[0].Row;
            for (var Index = 1; Index < this.Pages.length; Index++) {
                if (Row_start <= this.Pages[Index].FirstRow) {
                    break;
                }
                CurPage++;
            }
            var Row_prev_index = -1;
            var Row_pages = 1;
            for (var Index = 0; Index < this.Selection.Data.length; Index++) {
                var Pos = this.Selection.Data[Index];
                var Row = this.Content[Pos.Row];
                var Cell = Row.Get_Cell(Pos.Cell);
                var CellInfo = Row.Get_CellInfo(Pos.Cell);
                var CellMar = Cell.Get_Margins();
                var VMergeCount = this.Internal_GetVertMergeCount(Row.Index, CellInfo.StartGridCol, Cell.Get_GridSpan());
                var BottomMargin = this.MaxBotMargin[Row.Index + VMergeCount - 1];
                if (-1 === Row_prev_index || Row_prev_index != Pos.Row) {
                    CurPage += Row_pages - 1;
                    if (-1 != Row_prev_index) {
                        for (var Index2 = Row_prev_index + 1; Index2 < Pos.Row; Index2++) {
                            CurPage += this.RowsInfo[Index2].Pages - 1;
                        }
                    }
                    Row_prev_index = Pos.Row;
                    Row_pages = this.RowsInfo[Pos.Row].Pages;
                }
                var X_start = CellInfo.X_cell_start;
                var X_end = CellInfo.X_cell_end;
                var Cell_pages = Cell.Content_Get_PagesCount();
                for (var PageId = 0; PageId < Cell_pages; PageId++) {
                    var Bounds = Cell.Content_Get_PageBounds(PageId);
                    if (0 != PageId) {
                        var TempRowIndex = this.Pages[CurPage + PageId].FirstRow;
                        var _merge_cell_count = this.Internal_GetVertMergeCount(TempRowIndex, CellInfo.StartGridCol, Cell.Get_GridSpan());
                        var _height_merge_cells = 0;
                        var _merge_cell_index;
                        for (_merge_cell_index = 0; _merge_cell_index < _merge_cell_count; ++_merge_cell_index) {
                            var _cur_rows_info = this.RowsInfo[TempRowIndex + _merge_cell_index];
                            if (_cur_rows_info !== null && typeof _cur_rows_info === "object" && _cur_rows_info.H !== null && typeof _cur_rows_info.H === "object" && typeof _cur_rows_info.H[CurPage + PageId] === "number") {
                                _height_merge_cells += _cur_rows_info.H[CurPage + PageId];
                            }
                        }
                        this.DrawingDocument.AddPageSelection(StartPage_Abs + CurPage + PageId, X_start, this.RowsInfo[TempRowIndex].Y[CurPage + PageId], X_end - X_start, _height_merge_cells);
                    } else {
                        var bDrawSelectionBlock = true;
                        if (Cell_pages > 1) {
                            var TempRowIndex = this.Pages[CurPage + 1].FirstRow;
                            if (TempRowIndex === Pos.Row && false === this.RowsInfo[TempRowIndex].FirstPage) {
                                bDrawSelectionBlock = false;
                            }
                        }
                        if (true === bDrawSelectionBlock) {
                            var _merge_cell_count = this.Internal_GetVertMergeCount(Pos.Row, CellInfo.StartGridCol, Cell.Get_GridSpan());
                            var _height_merge_cells = 0;
                            var _merge_cell_index;
                            for (_merge_cell_index = 0; _merge_cell_index < _merge_cell_count; ++_merge_cell_index) {
                                var _cur_rows_info = this.RowsInfo[Pos.Row + _merge_cell_index];
                                if (_cur_rows_info !== null && typeof _cur_rows_info === "object" && _cur_rows_info.H !== null && typeof _cur_rows_info.H === "object" && typeof _cur_rows_info.H[CurPage + PageId] === "number") {
                                    _height_merge_cells += _cur_rows_info.H[CurPage + PageId];
                                }
                            }
                        }
                        this.DrawingDocument.AddPageSelection(StartPage_Abs + CurPage + PageId, X_start, this.RowsInfo[Pos.Row].Y[CurPage + PageId], X_end - X_start, _height_merge_cells);
                    }
                }
            }
            break;
        case table_Selection_Text:
            var Cell = this.Content[this.Selection.StartPos.Pos.Row].Get_Cell(this.Selection.StartPos.Pos.Cell);
            Cell.Content.Selection_Draw_Page(Page_abs);
            break;
        }
    },
    Selection_Draw: function () {
        if (this.Parent && this.Parent.transform) {
            this.DrawingDocument.UpdateTargetTransform(this.Parent.transform);
        }
        if (this.Selection.Type2 === table_Selection_Border) {
            if (true === this.Selection.Data2.bCol) {
                this.DrawingDocument.UpdateTableRuler(this.Selection.Data2.bCol, this.Selection.Data2.Index, this.Selection.Data2.X);
            } else {
                this.DrawingDocument.UpdateTableRuler(this.Selection.Data2.bCol, this.Selection.Data2.Index, this.Selection.Data2.Y);
            }
        }
        if (false === this.Selection.Use) {
            return;
        }
        switch (this.Selection.Type) {
        case table_Selection_Cell:
            var StartPage_Abs = this.Get_StartPage_Absolute();
            var CurPage = 0;
            var Row_start = this.Selection.Data[0].Row;
            for (var Index = 1; Index < this.Pages.length; Index++) {
                if (Row_start <= this.Pages[Index].FirstRow) {
                    break;
                }
                CurPage++;
            }
            var Row_prev_index = -1;
            var Row_pages = 1;
            for (var Index = 0; Index < this.Selection.Data.length; Index++) {
                var Pos = this.Selection.Data[Index];
                var Row = this.Content[Pos.Row];
                var Cell = Row.Get_Cell(Pos.Cell);
                var CellInfo = Row.Get_CellInfo(Pos.Cell);
                var CellMar = Cell.Get_Margins();
                var VMergeCount = this.Internal_GetVertMergeCount(Row.Index, CellInfo.StartGridCol, Cell.Get_GridSpan());
                var BottomMargin = this.MaxBotMargin[Row.Index + VMergeCount - 1];
                if (-1 === Row_prev_index || Row_prev_index != Pos.Row) {
                    CurPage += Row_pages - 1;
                    if (-1 != Row_prev_index) {
                        for (var Index2 = Row_prev_index + 1; Index2 < Pos.Row; Index2++) {
                            CurPage += this.RowsInfo[Index2].Pages - 1;
                        }
                    }
                    Row_prev_index = Pos.Row;
                    Row_pages = this.RowsInfo[Pos.Row].Pages;
                }
                var X_start = CellInfo.X_cell_start;
                var X_end = CellInfo.X_cell_end;
                var Cell_pages = Cell.Content_Get_PagesCount();
                for (var PageId = 0; PageId < Cell_pages; PageId++) {
                    var Bounds = Cell.Content_Get_PageBounds(PageId);
                    if (0 != PageId) {
                        var TempRowIndex = this.Pages[CurPage + PageId].FirstRow;
                        var _merge_cell_count = this.Internal_GetVertMergeCount(TempRowIndex, CellInfo.StartGridCol, Cell.Get_GridSpan());
                        var _height_merge_cells = 0;
                        var _merge_cell_index;
                        for (_merge_cell_index = 0; _merge_cell_index < _merge_cell_count; ++_merge_cell_index) {
                            var _cur_rows_info = this.RowsInfo[TempRowIndex + _merge_cell_index];
                            if (_cur_rows_info !== null && typeof _cur_rows_info === "object" && _cur_rows_info.H !== null && typeof _cur_rows_info.H === "object" && typeof _cur_rows_info.H[CurPage + PageId] === "number") {
                                _height_merge_cells += _cur_rows_info.H[CurPage + PageId];
                            }
                        }
                        this.DrawingDocument.AddPageSelection(StartPage_Abs + CurPage + PageId, X_start, this.RowsInfo[TempRowIndex].Y[CurPage + PageId], X_end - X_start, _height_merge_cells);
                    } else {
                        var bDrawSelectionBlock = true;
                        if (Cell_pages > 1) {
                            var TempRowIndex = this.Pages[CurPage + 1].FirstRow;
                            if (TempRowIndex === Pos.Row && false === this.RowsInfo[TempRowIndex].FirstPage) {
                                bDrawSelectionBlock = false;
                            }
                        }
                        if (true === bDrawSelectionBlock) {
                            var _merge_cell_count = this.Internal_GetVertMergeCount(Pos.Row, CellInfo.StartGridCol, Cell.Get_GridSpan());
                            var _height_merge_cells = 0;
                            var _merge_cell_index;
                            for (_merge_cell_index = 0; _merge_cell_index < _merge_cell_count; ++_merge_cell_index) {
                                var _cur_rows_info = this.RowsInfo[Pos.Row + _merge_cell_index];
                                if (_cur_rows_info !== null && typeof _cur_rows_info === "object" && _cur_rows_info.H !== null && typeof _cur_rows_info.H === "object" && typeof _cur_rows_info.H[CurPage + PageId] === "number") {
                                    _height_merge_cells += _cur_rows_info.H[CurPage + PageId];
                                }
                            }
                        }
                        this.DrawingDocument.AddPageSelection(StartPage_Abs + CurPage + PageId, X_start, this.RowsInfo[Pos.Row].Y[CurPage + PageId], X_end - X_start, _height_merge_cells);
                    }
                }
            }
            break;
        case table_Selection_Text:
            var Cell = this.Content[this.Selection.StartPos.Pos.Row].Get_Cell(this.Selection.StartPos.Pos.Cell);
            Cell.Content.Selection_Draw();
            break;
        }
    },
    Selection_Remove: function () {
        if (false === this.Selection.Use) {
            return;
        }
        if (table_Selection_Text === this.Selection.Type) {
            var Cell = this.Content[this.Selection.StartPos.Pos.Row].Get_Cell(this.Selection.StartPos.Pos.Cell);
            Cell.Content.Selection_Remove();
        }
        this.Selection.Use = false;
        this.Selection.Start = false;
        this.Selection.StartPos.Pos = {
            Row: 0,
            Cell: 0
        };
        this.Selection.EndPos.Pos = {
            Row: 0,
            Cell: 0
        };
        this.Markup.Internal.RowIndex = 0;
        this.Markup.Internal.CellIndex = 0;
        this.Markup.Internal.PageNum = 0;
    },
    Selection_Clear: function () {},
    Selection_Check: function (X, Y, Page_Abs) {
        var PageIndex = Page_Abs - this.Get_StartPage_Absolute();
        if (PageIndex < 0 || PageIndex >= this.Pages.length) {
            return false;
        }
        var CellPos = this.Internal_GetCellByXY(X, Y, PageIndex);
        if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
            for (var Index = 0; Index < this.Selection.Data.length; Index++) {
                var CurPos = this.Selection.Data[Index];
                if (CurPos.Cell === CellPos.Cell && CurPos.Row === CellPos.Row) {
                    return true;
                }
            }
            return false;
        } else {
            if (CellPos.Cell === this.CurCell.Index && CellPos.Row === this.CurCell.Row.Index) {
                return this.CurCell.Content.Selection_Check(X, Y, Page_Abs);
            }
        }
        return false;
    },
    Selection_IsEmpty: function (bCheckHidden) {
        if (true === this.Selection.Use) {
            if (table_Selection_Cell === this.Selection.Type) {
                return false;
            } else {
                return this.CurCell.Content.Selection_IsEmpty(bCheckHidden);
            }
        }
        return true;
    },
    Select_All: function () {
        this.Selection.Use = true;
        this.Selection.Start = false;
        this.Selection.Type = table_Selection_Cell;
        this.Selection.Type2 = table_Selection_Common;
        this.Selection.Data2 = null;
        this.Selection.StartPos.Pos = {
            Row: 0,
            Cell: 0
        };
        this.Selection.StartPos.PageIndex = 0;
        this.Selection.EndPos.Pos = {
            Row: this.Content.length - 1,
            Cell: this.Content[this.Content.length - 1].Get_CellsCount() - 1
        };
        this.Selection.EndPos.PageIndex = this.Pages.length - 1;
        this.Internal_Selection_UpdateCells();
    },
    Cursor_MoveToStartPos: function () {
        this.CurCell = this.Content[0].Get_Cell(0);
        this.Selection.Use = false;
        this.Selection.Start = false;
        this.Selection.StartPos.Pos = {
            Row: 0,
            Cell: 0
        };
        this.Selection.EndPos.Pos = {
            Row: 0,
            Cell: 0
        };
        this.Selection.CurRow = 0;
        this.CurCell.Content_Cursor_MoveToStartPos();
    },
    Cursor_MoveToEndPos: function () {
        var Row = this.Content[this.Content.length - 1];
        this.CurCell = Row.Get_Cell(Row.Get_CellsCount() - 1);
        this.Selection.Use = false;
        this.Selection.Start = false;
        this.Selection.StartPos.Pos = {
            Row: Row.Index,
            Cell: this.CurCell.Index
        };
        this.Selection.EndPos.Pos = {
            Row: Row.Index,
            Cell: this.CurCell.Index
        };
        this.Selection.CurRow = Row.Index;
        this.CurCell.Content_Cursor_MoveToEndPos();
    },
    Cursor_IsStart: function (bOnlyPara) {
        if (false === this.Selection.Use || (true === this.Selection.Use && table_Selection_Text === this.Selection.Type)) {
            if (0 === this.CurCell.Index && 0 === this.CurCell.Row.Index) {
                return this.CurCell.Content.Cursor_IsStart(bOnlyPara);
            }
        }
        return false;
    },
    Add_NewParagraph: function () {
        this.CurCell.Content.Add_NewParagraph();
    },
    Add_FlowImage: function (W, H, Img) {
        this.CurCell.Content.Add_FlowImage(W, H, Img);
    },
    Add_InlineImage: function (W, H, Img, Chart, bFlow) {
        this.Selection.Use = true;
        this.Selection.Type = table_Selection_Text;
        this.CurCell.Content.Add_InlineImage(W, H, Img, Chart, bFlow);
    },
    Add_InlineTable: function (Cols, Rows) {
        if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
            return;
        }
        this.CurCell.Content.Add_InlineTable(Cols, Rows);
    },
    Add: function (ParaItem, bRecalculate) {
        this.Paragraph_Add(ParaItem, bRecalculate);
    },
    Paragraph_Add: function (ParaItem, bRecalculate) {
        if (para_TextPr === ParaItem.Type && (true === this.ApplyToAll || (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0))) {
            var Cells_array = this.Internal_Get_SelectionArray();
            for (var Index = 0; Index < Cells_array.length; Index++) {
                var Pos = Cells_array[Index];
                var Row = this.Content[Pos.Row];
                var Cell = Row.Get_Cell(Pos.Cell);
                var Cell_Content = Cell.Content;
                Cell_Content.Set_ApplyToAll(true);
                Cell.Content.Paragraph_Add(ParaItem, bRecalculate);
                Cell_Content.Set_ApplyToAll(false);
            }
            if (true === ParaItem.Value.Check_NeedRecalc()) {
                if (Cells_array[0].Row - 1 >= 0) {
                    this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
                } else {
                    this.Internal_Recalculate_1();
                    this.Internal_OnContentRecalculate(true, 0, this.Index);
                }
            } else {
                this.Parent.OnContentReDraw(this.Get_StartPage_Absolute(), this.Get_StartPage_Absolute() + this.Pages.length - 1);
            }
        } else {
            this.CurCell.Content.Paragraph_Add(ParaItem, bRecalculate);
        }
    },
    Paragraph_ClearFormatting: function () {
        if (true === this.ApplyToAll || (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0)) {
            var Cells_array = this.Internal_Get_SelectionArray();
            for (var Index = 0; Index < Cells_array.length; Index++) {
                var Pos = Cells_array[Index];
                var Row = this.Content[Pos.Row];
                var Cell = Row.Get_Cell(Pos.Cell);
                var Cell_Content = Cell.Content;
                Cell_Content.Set_ApplyToAll(true);
                Cell.Content.Paragraph_ClearFormatting();
                Cell_Content.Set_ApplyToAll(false);
            }
            if (Cells_array[0].Row - 1 >= 0) {
                this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
            } else {
                this.Internal_Recalculate_1();
                this.Internal_OnContentRecalculate(true, 0, this.Index);
            }
        } else {
            this.CurCell.Content.Paragraph_ClearFormatting();
        }
    },
    Paragraph_Format_Paste: function (TextPr, ParaPr, ApplyPara) {
        if (true === this.ApplyToAll || (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0)) {
            var Cells_array = this.Internal_Get_SelectionArray();
            for (var Index = 0; Index < Cells_array.length; Index++) {
                var Pos = Cells_array[Index];
                var Row = this.Content[Pos.Row];
                var Cell = Row.Get_Cell(Pos.Cell);
                var Cell_Content = Cell.Content;
                Cell_Content.Set_ApplyToAll(true);
                Cell.Content.Paragraph_Format_Paste(TextPr, ParaPr, true);
                Cell_Content.Set_ApplyToAll(false);
            }
            if (Cells_array[0].Row - 1 >= 0) {
                this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
            } else {
                this.Internal_Recalculate_1();
                this.Internal_OnContentRecalculate(true, 0, this.Index);
            }
        } else {
            this.CurCell.Content.Paragraph_Format_Paste(TextPr, ParaPr, false);
        }
    },
    Remove: function (Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd) {
        if (true === this.ApplyToAll || (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0)) {
            var Cells_array = this.Internal_Get_SelectionArray();
            if (true === bOnTextAdd && Cells_array.length > 0) {
                var Pos = Cells_array[0];
                var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
                Cell.Content.Select_All();
                Cell.Content.Remove(Count, bOnlyText, bRemoveOnlySelection, true);
                this.CurCell = Cell;
                this.Selection.Use = false;
                this.Selection.Start = false;
                this.Selection.StartPos.Pos = {
                    Row: Cell.Row.Index,
                    Cell: Cell.Index
                };
                this.Selection.EndPos.Pos = {
                    Row: Cell.Row.Index,
                    Cell: Cell.Index
                };
                this.Document_SetThisElementCurrent();
                editor.WordControl.m_oLogicDocument.Recalculate();
            } else {
                var Cells_array = this.Internal_Get_SelectionArray();
                for (var Index = 0; Index < Cells_array.length; Index++) {
                    var Pos = Cells_array[Index];
                    var Row = this.Content[Pos.Row];
                    var Cell = Row.Get_Cell(Pos.Cell);
                    var Cell_Content = Cell.Content;
                    Cell_Content.Set_ApplyToAll(true);
                    Cell.Content.Remove(Count, bOnlyText, bRemoveOnlySelection, false);
                    Cell_Content.Set_ApplyToAll(false);
                }
                if (Cells_array[0].Row - 1 >= 0) {
                    this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
                } else {
                    this.Internal_Recalculate_1();
                    this.Internal_OnContentRecalculate(true, 0, this.Index);
                }
            }
        } else {
            this.CurCell.Content.Remove(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd);
        }
    },
    Cursor_GetPos: function () {
        if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
            if (this.Selection.Data.length < 0) {
                return {
                    X: 0,
                    Y: 0
                };
            }
            var Pos = this.Selection.Data[0];
            var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
            var Para = Cell.Content.Get_FirstParagraph();
            return {
                X: Para.X,
                Y: Para.Y
            };
        } else {
            return this.CurCell.Content.Cursor_GetPos();
        }
    },
    Cursor_MoveLeft: function (Count, AddToSelect, Word) {
        if (true === this.Selection.Use && this.Selection.Type === table_Selection_Cell) {
            if (true === AddToSelect) {
                var StartPos = this.Selection.StartPos.Pos;
                var EndPos = this.Selection.EndPos.Pos;
                if (StartPos.Cell == EndPos.Cell && StartPos.Row == EndPos.Row && true == this.Parent.Selection_Is_OneElement()) {
                    this.Selection.Type = table_Selection_Text;
                    return true;
                } else {
                    if (0 == EndPos.Cell && 0 == EndPos.Row && (null === this.Get_DocumentPrev() && true === this.Parent.Is_TopDocument())) {
                        return false;
                    }
                    var bRet = true;
                    if (0 == EndPos.Cell && 0 == EndPos.Row || (false == this.Parent.Selection_Is_OneElement() && 0 == EndPos.Row && 0 == StartPos.Row)) {
                        this.Selection.EndPos.Pos = {
                            Cell: 0,
                            Row: 0
                        };
                        bRet = false;
                    } else {
                        if (EndPos.Cell > 0 && true == this.Parent.Selection_Is_OneElement()) {
                            this.Selection.EndPos.Pos = {
                                Cell: EndPos.Cell - 1,
                                Row: EndPos.Row
                            };
                        } else {
                            this.Selection.EndPos.Pos = {
                                Cell: 0,
                                Row: EndPos.Row - 1
                            };
                        }
                    }
                    var bForceSelectByLines = false;
                    if (false === bRet && true == this.Is_Inline()) {
                        bForceSelectByLines = true;
                    }
                    this.Internal_Selection_UpdateCells(bForceSelectByLines);
                    return bRet;
                }
            } else {
                this.Selection.Use = false;
                var Pos = this.Selection.Data[0];
                this.CurCell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
                this.CurCell.Content_Cursor_MoveToStartPos();
                return true;
            }
        } else {
            if (false === this.CurCell.Content.Cursor_MoveLeft(AddToSelect, Word)) {
                if (false === AddToSelect) {
                    if (0 != this.CurCell.Index || 0 != this.CurCell.Row.Index) {
                        if (0 != this.CurCell.Index) {
                            this.CurCell = this.Internal_Get_StartMergedCell2(this.CurCell.Index - 1, this.Selection.CurRow);
                        } else {
                            this.Selection.CurRow = Math.max(this.Selection.CurRow - 1, 0);
                            this.CurCell = this.Internal_Get_StartMergedCell2(this.Content[this.Selection.CurRow].Get_CellsCount() - 1, this.Selection.CurRow);
                        }
                        this.CurCell.Content.Cursor_MoveToEndPos();
                    } else {
                        return false;
                    }
                } else {
                    if (0 == this.CurCell.Index && 0 == this.CurCell.Row.Index && (null === this.Get_DocumentPrev() && true === this.Parent.Is_TopDocument())) {
                        return false;
                    }
                    this.Selection.Use = true;
                    this.Selection.Type = table_Selection_Cell;
                    var bRet = true;
                    this.Selection.StartPos.Pos = {
                        Cell: this.CurCell.Index,
                        Row: this.CurCell.Row.Index
                    };
                    if (0 == this.CurCell.Index && 0 == this.CurCell.Row.Index) {
                        this.Selection.EndPos.Pos = {
                            Cell: this.CurCell.Row.Get_CellsCount() - 1,
                            Row: 0
                        };
                        bRet = false;
                    } else {
                        if (this.CurCell.Index > 0) {
                            this.Selection.EndPos.Pos = {
                                Cell: this.CurCell.Index - 1,
                                Row: this.CurCell.Row.Index
                            };
                        } else {
                            this.Selection.EndPos.Pos = {
                                Cell: 0,
                                Row: this.CurCell.Row.Index - 1
                            };
                        }
                    }
                    this.Internal_Selection_UpdateCells();
                    return bRet;
                }
            } else {
                if (true === AddToSelect) {
                    this.Selection.Use = true;
                    this.Selection.Type = table_Selection_Text;
                    this.Selection.StartPos.Pos = {
                        Cell: this.CurCell.Index,
                        Row: this.CurCell.Row.Index
                    };
                    this.Selection.EndPos.Pos = {
                        Cell: this.CurCell.Index,
                        Row: this.CurCell.Row.Index
                    };
                }
                return true;
            }
        }
    },
    Cursor_MoveRight: function (Count, AddToSelect, Word) {
        if (true === this.Selection.Use && this.Selection.Type === table_Selection_Cell) {
            if (true === AddToSelect) {
                var StartPos = this.Selection.StartPos.Pos;
                var EndPos = this.Selection.EndPos.Pos;
                if (StartPos.Cell == EndPos.Cell && StartPos.Row == EndPos.Row && true == this.Parent.Selection_Is_OneElement()) {
                    this.Selection.Type = table_Selection_Text;
                    return true;
                } else {
                    var LastRow = this.Content[this.Content.length - 1];
                    var EndRow = this.Content[EndPos.Row];
                    var bRet = true;
                    if ((LastRow.Get_CellsCount() - 1 == EndPos.Cell && this.Content.length - 1 == EndPos.Row) || (false == this.Parent.Selection_Is_OneElement() && this.Content.length - 1 == EndPos.Row && this.Content.length - 1 == StartPos.Row)) {
                        this.Selection.EndPos.Pos = {
                            Cell: LastRow.Get_CellsCount() - 1,
                            Row: LastRow.Index
                        };
                        bRet = false;
                    } else {
                        if (EndPos.Cell < EndRow.Get_CellsCount() - 1 && true == this.Parent.Selection_Is_OneElement()) {
                            this.Selection.EndPos.Pos = {
                                Cell: EndPos.Cell + 1,
                                Row: EndPos.Row
                            };
                        } else {
                            this.Selection.EndPos.Pos = {
                                Cell: this.Content[EndPos.Row + 1].Get_CellsCount() - 1,
                                Row: EndPos.Row + 1
                            };
                        }
                    }
                    var bForceSelectByLines = false;
                    if (false === bRet && true == this.Is_Inline()) {
                        bForceSelectByLines = true;
                    }
                    this.Internal_Selection_UpdateCells(bForceSelectByLines);
                    return bRet;
                }
            } else {
                this.Selection.Use = false;
                var Pos = this.Selection.Data[this.Selection.Data.length - 1];
                this.CurCell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
                this.CurCell.Content_Cursor_MoveToEndPos();
                return true;
            }
        } else {
            if (false === this.CurCell.Content.Cursor_MoveRight(AddToSelect, Word)) {
                if (false === AddToSelect) {
                    if (this.Content.length - 1 > this.CurCell.Row.Index || this.Content[this.CurCell.Row.Index].Get_CellsCount() - 1 > this.CurCell.Index) {
                        if (this.Content[this.CurCell.Row.Index].Get_CellsCount() - 1 > this.CurCell.Index) {
                            this.CurCell = this.Internal_Get_StartMergedCell2(this.CurCell.Index + 1, this.Selection.CurRow);
                        } else {
                            this.Selection.CurRow = Math.min(this.Content.length - 1, this.Selection.CurRow + 1);
                            this.CurCell = this.Internal_Get_StartMergedCell2(0, this.Selection.CurRow);
                        }
                        this.CurCell.Content.Cursor_MoveToStartPos();
                    } else {
                        return false;
                    }
                } else {
                    this.Selection.Use = true;
                    this.Selection.Type = table_Selection_Cell;
                    var LastRow = this.Content[this.Content.length - 1];
                    var CurRow = this.CurCell.Row;
                    var bRet = true;
                    this.Selection.StartPos.Pos = {
                        Cell: this.CurCell.Index,
                        Row: this.CurCell.Row.Index
                    };
                    if (LastRow.Get_CellsCount() - 1 == this.CurCell.Index && LastRow.Index == this.CurCell.Row.Index) {
                        this.Selection.EndPos.Pos = {
                            Cell: LastRow.Get_CellsCount() - 1,
                            Row: LastRow.Index
                        };
                        bRet = false;
                    } else {
                        if (this.CurCell.Index < CurRow.Get_CellsCount() - 1) {
                            this.Selection.EndPos.Pos = {
                                Cell: this.CurCell.Index + 1,
                                Row: this.CurCell.Row.Index
                            };
                        } else {
                            this.Selection.EndPos.Pos = {
                                Cell: this.Content[this.CurCell.Row.Index + 1].Get_CellsCount() - 1,
                                Row: this.CurCell.Row.Index + 1
                            };
                        }
                    }
                    var bForceSelectByLines = false;
                    if (false === bRet && true == this.Is_Inline()) {
                        bForceSelectByLines = true;
                    }
                    this.Internal_Selection_UpdateCells(bForceSelectByLines);
                    return bRet;
                }
            } else {
                if (true === AddToSelect) {
                    this.Selection.Use = true;
                    this.Selection.Type = table_Selection_Text;
                    this.Selection.StartPos.Pos = {
                        Cell: this.CurCell.Index,
                        Row: this.CurCell.Row.Index
                    };
                    this.Selection.EndPos.Pos = {
                        Cell: this.CurCell.Index,
                        Row: this.CurCell.Row.Index
                    };
                }
                return true;
            }
        }
    },
    Cursor_MoveUp: function (Count, AddToSelect) {
        if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
            if (true === AddToSelect) {
                var bRetValue = true;
                var EndPos = this.Selection.EndPos.Pos;
                if (0 === EndPos.Row) {
                    bRetValue = false;
                } else {
                    var EndCell = this.Content[EndPos.Row].Get_Cell(EndPos.Cell);
                    var X = EndCell.Content.Get_CurPosXY().X;
                    var Y = EndCell.Content.Get_CurPosXY().Y;
                    var PrevRow = this.Content[EndPos.Row - 1];
                    var Cell = null;
                    for (var CurCell = 0; CurCell < PrevRow.Get_CellsCount(); CurCell++) {
                        Cell = PrevRow.Get_Cell(CurCell);
                        var CellInfo = PrevRow.Get_CellInfo(CurCell);
                        if (X <= CellInfo.X_grid_end) {
                            break;
                        }
                    }
                    if (null === Cell) {
                        return true;
                    }
                    Cell.Content.Set_CurPosXY(X, Y);
                    this.CurCell = Cell;
                    this.Selection.EndPos.Pos = {
                        Cell: Cell.Index,
                        Row: Cell.Row.Index
                    };
                }
                var bForceSelectByLines = false;
                if (false === bRetValue && true === this.Is_Inline()) {
                    bForceSelectByLines = true;
                }
                this.Internal_Selection_UpdateCells(bForceSelectByLines);
                return bRetValue;
            } else {
                if (this.Selection.Data.length < 0) {
                    return true;
                }
                var Pos = this.Selection.Data[0];
                var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
                var Para = Cell.Content.Get_FirstParagraph();
                var X = Para.X;
                var Y = Para.Y;
                this.Selection.Use = false;
                if (0 === Pos.Row) {
                    this.CurCell = Cell;
                    this.CurCell.Content.Cursor_MoveToStartPos();
                    this.CurCell.Content.Set_CurPosXY(X, Y);
                    return false;
                } else {
                    var PrevRow = this.Content[Pos.Row - 1];
                    var PrevCell = null;
                    for (var CurCell = 0; CurCell < PrevRow.Get_CellsCount(); CurCell++) {
                        PrevCell = PrevRow.Get_Cell(CurCell);
                        var CellInfo = PrevRow.Get_CellInfo(CurCell);
                        if (X <= CellInfo.X_grid_end) {
                            break;
                        }
                    }
                    if (null === PrevCell) {
                        return true;
                    }
                    PrevCell.Content.Cursor_MoveUp_To_LastRow(X, Y, false);
                    this.CurCell = PrevCell;
                    return true;
                }
            }
        } else {
            if (false === this.CurCell.Content.Cursor_MoveUp(AddToSelect)) {
                if (0 === this.CurCell.Row.Index && (false === this.Is_Inline() || (null === this.Get_DocumentPrev() && true === this.Parent.Is_TopDocument()))) {
                    return true;
                }
                if (true === AddToSelect) {
                    this.Selection.Use = true;
                    this.Selection.Type = table_Selection_Cell;
                    this.Selection.StartPos.Pos = {
                        Row: this.CurCell.Row.Index,
                        Cell: this.CurCell.Index
                    };
                    var bRetValue = true;
                    if (0 === this.CurCell.Row.Index) {
                        this.Selection.EndPos.Pos = {
                            Row: 0,
                            Cell: 0
                        };
                        bRetValue = false;
                    } else {
                        var X = this.CurCell.Content.Get_CurPosXY().X;
                        var Y = this.CurCell.Content.Get_CurPosXY().Y;
                        var PrevRow = this.Content[this.CurCell.Row.Index - 1];
                        var Cell = null;
                        for (var CurCell = 0; CurCell < PrevRow.Get_CellsCount(); CurCell++) {
                            Cell = PrevRow.Get_Cell(CurCell);
                            var CellInfo = PrevRow.Get_CellInfo(CurCell);
                            if (X <= CellInfo.X_grid_end) {
                                break;
                            }
                        }
                        if (null === Cell) {
                            return true;
                        }
                        Cell.Content.Set_CurPosXY(X, Y);
                        this.CurCell = Cell;
                        this.Selection.EndPos.Pos = {
                            Cell: Cell.Index,
                            Row: Cell.Row.Index
                        };
                    }
                    var bForceSelectByLines = false;
                    if (false === bRetValue && true === this.Is_Inline()) {
                        bForceSelectByLines = true;
                    }
                    this.Internal_Selection_UpdateCells(bForceSelectByLines);
                    return bRetValue;
                } else {
                    if (0 === this.CurCell.Row.Index) {
                        return false;
                    } else {
                        var X = this.CurCell.Content.Get_CurPosXY().X;
                        var Y = this.CurCell.Content.Get_CurPosXY().Y;
                        var PrevRow = this.Content[this.CurCell.Row.Index - 1];
                        var Cell = null;
                        for (var CurCell = 0; CurCell < PrevRow.Get_CellsCount(); CurCell++) {
                            Cell = PrevRow.Get_Cell(CurCell);
                            var CellInfo = PrevRow.Get_CellInfo(CurCell);
                            if (X <= CellInfo.X_grid_end) {
                                break;
                            }
                        }
                        if (null === Cell) {
                            return true;
                        }
                        Cell = this.Internal_Get_StartMergedCell2(Cell.Index, Cell.Row.Index);
                        Cell.Content.Cursor_MoveUp_To_LastRow(X, Y, false);
                        this.CurCell = Cell;
                        this.Selection.EndPos.Pos = {
                            Cell: Cell.Index,
                            Row: Cell.Row.Index
                        };
                        this.Selection.CurRow = Cell.Row.Index;
                        return true;
                    }
                }
            } else {
                if (true === AddToSelect) {
                    this.Selection.Use = true;
                    this.Selection.Type = table_Selection_Text;
                    this.Selection.StartPos.Pos = {
                        Cell: this.CurCell.Index,
                        Row: this.CurCell.Row.Index
                    };
                    this.Selection.EndPos.Pos = {
                        Cell: this.CurCell.Index,
                        Row: this.CurCell.Row.Index
                    };
                }
                return true;
            }
        }
    },
    Cursor_MoveDown: function (Count, AddToSelect) {
        if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
            if (true === AddToSelect) {
                var bRetValue = true;
                var EndPos = this.Selection.EndPos.Pos;
                if (this.Content.length - 1 === EndPos.Row) {
                    bRetValue = false;
                } else {
                    var EndCell = this.Content[EndPos.Row].Get_Cell(EndPos.Cell);
                    var X = EndCell.Content.Get_CurPosXY().X;
                    var Y = EndCell.Content.Get_CurPosXY().Y;
                    var NextRow = this.Content[EndPos.Row + 1];
                    var Cell = null;
                    for (var CurCell = 0; CurCell < NextRow.Get_CellsCount(); CurCell++) {
                        Cell = NextRow.Get_Cell(CurCell);
                        var CellInfo = NextRow.Get_CellInfo(CurCell);
                        if (X <= CellInfo.X_grid_end) {
                            break;
                        }
                    }
                    if (null === Cell) {
                        return true;
                    }
                    Cell.Content.Set_CurPosXY(X, Y);
                    this.CurCell = Cell;
                    this.Selection.EndPos.Pos = {
                        Cell: Cell.Index,
                        Row: Cell.Row.Index
                    };
                }
                var bForceSelectByLines = false;
                if (false === bRetValue && true === this.Is_Inline()) {
                    bForceSelectByLines = true;
                }
                this.Internal_Selection_UpdateCells(bForceSelectByLines);
                return bRetValue;
            } else {
                if (this.Selection.Data.length < 0) {
                    return true;
                }
                var Pos = this.Selection.Data[this.Selection.Data.length - 1];
                var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
                var Para = Cell.Content.Get_FirstParagraph();
                var X = Para.X;
                var Y = Para.Y;
                this.Selection.Use = false;
                if (this.Content.length - 1 === Pos.Row) {
                    this.CurCell = Cell;
                    this.CurCell.Content.Cursor_MoveToStartPos();
                    this.CurCell.Content.Set_CurPosXY(X, Y);
                    return false;
                } else {
                    var NextRow = this.Content[Pos.Row + 1];
                    var NextCell = null;
                    for (var CurCell = 0; CurCell < NextRow.Get_CellsCount(); CurCell++) {
                        NextCell = NextRow.Get_Cell(CurCell);
                        var CellInfo = NextRow.Get_CellInfo(CurCell);
                        if (X <= CellInfo.X_grid_end) {
                            break;
                        }
                    }
                    if (null === NextCell) {
                        return true;
                    }
                    NextCell.Content.Cursor_MoveDown_To_FirstRow(X, Y, false);
                    this.CurCell = NextCell;
                    return true;
                }
            }
        } else {
            if (false === this.CurCell.Content.Cursor_MoveDown(AddToSelect)) {
                if (true === AddToSelect) {
                    this.Selection.Use = true;
                    this.Selection.Type = table_Selection_Cell;
                    this.Selection.StartPos.Pos = {
                        Row: this.CurCell.Row.Index,
                        Cell: this.CurCell.Index
                    };
                    var bRetValue = true;
                    if (this.Content.length - 1 === this.CurCell.Row.Index) {
                        this.Selection.EndPos.Pos = {
                            Row: this.Content.length - 1,
                            Cell: this.Content[this.Content.length - 1].Get_CellsCount() - 1
                        };
                        bRetValue = false;
                    } else {
                        var X = this.CurCell.Content.Get_CurPosXY().X;
                        var Y = this.CurCell.Content.Get_CurPosXY().Y;
                        var NextRow = this.Content[this.CurCell.Row.Index + 1];
                        var Cell = null;
                        for (var CurCell = 0; CurCell < NextRow.Get_CellsCount(); CurCell++) {
                            Cell = NextRow.Get_Cell(CurCell);
                            var CellInfo = NextRow.Get_CellInfo(CurCell);
                            if (X <= CellInfo.X_grid_end) {
                                break;
                            }
                        }
                        if (null === Cell) {
                            return true;
                        }
                        Cell.Content.Set_CurPosXY(X, Y);
                        this.CurCell = Cell;
                        this.Selection.EndPos.Pos = {
                            Cell: Cell.Index,
                            Row: Cell.Row.Index
                        };
                    }
                    var bForceSelectByLines = false;
                    if (false === bRetValue && true === this.Is_Inline()) {
                        bForceSelectByLines = true;
                    }
                    this.Internal_Selection_UpdateCells(bForceSelectByLines);
                    return bRetValue;
                } else {
                    var VMerge_count = this.Internal_GetVertMergeCount(this.CurCell.Row.Index, this.CurCell.Row.Get_CellInfo(this.CurCell.Index).StartGridCol, this.CurCell.Get_GridSpan());
                    if (this.Content.length - 1 === this.CurCell.Row.Index + VMerge_count - 1) {
                        return false;
                    } else {
                        var X = this.CurCell.Content.Get_CurPosXY().X;
                        var Y = this.CurCell.Content.Get_CurPosXY().Y;
                        var NextRow = this.Content[this.CurCell.Row.Index + VMerge_count];
                        var Cell = null;
                        for (var CurCell = 0; CurCell < NextRow.Get_CellsCount(); CurCell++) {
                            Cell = NextRow.Get_Cell(CurCell);
                            var CellInfo = NextRow.Get_CellInfo(CurCell);
                            if (X <= CellInfo.X_grid_end) {
                                break;
                            }
                        }
                        if (null === Cell) {
                            return true;
                        }
                        Cell.Content.Cursor_MoveDown_To_FirstRow(X, Y, false);
                        this.CurCell = Cell;
                        this.Selection.EndPos.Pos = {
                            Cell: Cell.Index,
                            Row: Cell.Row.Index
                        };
                        this.Selection.CurRow = Cell.Row.Index;
                        return true;
                    }
                }
            } else {
                if (true === AddToSelect) {
                    this.Selection.Use = true;
                    this.Selection.Type = table_Selection_Text;
                    this.Selection.StartPos.Pos = {
                        Cell: this.CurCell.Index,
                        Row: this.CurCell.Row.Index
                    };
                    this.Selection.EndPos.Pos = {
                        Cell: this.CurCell.Index,
                        Row: this.CurCell.Row.Index
                    };
                }
                return true;
            }
        }
    },
    Cursor_MoveEndOfLine: function (AddToSelect) {
        if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
            return this.Cursor_MoveRight(1, AddToSelect, false);
        } else {
            var bRetValue = this.CurCell.Content.Cursor_MoveEndOfLine(AddToSelect);
            if (true === this.CurCell.Content.Is_SelectionUse()) {
                this.Selection.Use = true;
                this.Selection.Type = table_Selection_Text;
                this.Selection.StartPos.Pos = {
                    Cell: this.CurCell.Index,
                    Row: this.CurCell.Row.Index
                };
                this.Selection.EndPos.Pos = {
                    Cell: this.CurCell.Index,
                    Row: this.CurCell.Row.Index
                };
            } else {
                this.Selection.Use = false;
            }
            return bRetValue;
        }
    },
    Cursor_MoveStartOfLine: function (AddToSelect) {
        if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
            return this.Cursor_MoveLeft(1, AddToSelect, false);
        } else {
            var bRetValue = this.CurCell.Content.Cursor_MoveStartOfLine(AddToSelect);
            if (true === this.CurCell.Content.Is_SelectionUse()) {
                this.Selection.Use = true;
                this.Selection.Type = table_Selection_Text;
                this.Selection.StartPos.Pos = {
                    Cell: this.CurCell.Index,
                    Row: this.CurCell.Row.Index
                };
                this.Selection.EndPos.Pos = {
                    Cell: this.CurCell.Index,
                    Row: this.CurCell.Row.Index
                };
            } else {
                this.Selection.Use = false;
            }
            return bRetValue;
        }
    },
    Cursor_MoveUp_To_LastRow: function (X, Y, AddToSelect) {
        if (true === AddToSelect) {
            if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
                var Row = this.Content[this.Content.length - 1];
                var Cell = null;
                for (var CurCell = 0; CurCell < Row.Get_CellsCount(); CurCell++) {
                    Cell = Row.Get_Cell(CurCell);
                    var CellInfo = Row.Get_CellInfo(CurCell);
                    if (X <= CellInfo.X_grid_end) {
                        break;
                    }
                }
                if (null === Cell) {
                    return true;
                }
                Cell.Content.Set_CurPosXY(X, Y);
                this.CurCell = Cell;
                this.Selection.EndPos.Pos = {
                    Cell: Cell.Index,
                    Row: Cell.Row.Index
                };
                this.Internal_Selection_UpdateCells();
            } else {
                this.Selection.Use = true;
                this.Selection.Type = table_Selection_Cell;
                this.Selection.StartPos.Pos = {
                    Row: this.Content.length - 1,
                    Cell: this.Content[this.Content.length - 1].Get_CellsCount() - 1
                };
                this.Selection.EndPos.Pos = {
                    Row: this.Content.length - 1,
                    Cell: 0
                };
                this.Internal_Selection_UpdateCells();
                var Cell = this.Content[this.Content.length - 1].Get_Cell(0);
                Cell.Content.Set_CurPosXY(X, Y);
            }
        } else {
            this.Selection_Remove();
            var Row = this.Content[this.Content.length - 1];
            var Cell = null;
            for (var CurCell = 0; CurCell < Row.Get_CellsCount(); CurCell++) {
                Cell = Row.Get_Cell(CurCell);
                var CellInfo = Row.Get_CellInfo(CurCell);
                if (X <= CellInfo.X_grid_end) {
                    break;
                }
            }
            if (null === Cell) {
                return;
            }
            Cell = this.Internal_Get_StartMergedCell2(Cell.Index, Cell.Row.Index);
            Cell.Content.Cursor_MoveUp_To_LastRow(X, Y, false);
            this.Selection.CurRow = Cell.Row.Index;
            this.CurCell = Cell;
        }
    },
    Cursor_MoveDown_To_FirstRow: function (X, Y, AddToSelect) {
        if (true === AddToSelect) {
            if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
                var Row = this.Content[0];
                var Cell = null;
                for (var CurCell = 0; CurCell < Row.Get_CellsCount(); CurCell++) {
                    Cell = Row.Get_Cell(CurCell);
                    var CellInfo = Row.Get_CellInfo(CurCell);
                    if (X <= CellInfo.X_grid_end) {
                        break;
                    }
                }
                if (null === Cell) {
                    return true;
                }
                Cell.Content.Set_CurPosXY(X, Y);
                this.CurCell = Cell;
                this.Selection.EndPos.Pos = {
                    Cell: Cell.Index,
                    Row: Cell.Row.Index
                };
                this.Internal_Selection_UpdateCells();
            } else {
                this.Selection.Use = true;
                this.Selection.Type = table_Selection_Cell;
                this.Selection.StartPos.Pos = {
                    Row: 0,
                    Cell: 0
                };
                this.Selection.EndPos.Pos = {
                    Row: 0,
                    Cell: this.Content[0].Get_CellsCount() - 1
                };
                this.Internal_Selection_UpdateCells();
                var Cell = this.Content[0].Get_Cell(0);
                Cell.Content.Set_CurPosXY(X, Y);
            }
        } else {
            this.Selection_Remove();
            var Row = this.Content[0];
            var Cell = null;
            for (var CurCell = 0; CurCell < Row.Get_CellsCount(); CurCell++) {
                Cell = Row.Get_Cell(CurCell);
                var CellInfo = Row.Get_CellInfo(CurCell);
                if (X <= CellInfo.X_grid_end) {
                    break;
                }
            }
            if (null === Cell) {
                return;
            }
            Cell.Content.Cursor_MoveDown_To_FirstRow(X, Y, false);
            this.Selection.CurRow = Cell.Row.Index;
            this.CurCell = Cell;
        }
    },
    Cursor_MoveToCell: function (bNext) {
        if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
            var Pos = this.Selection.Data[0];
            this.Selection.Type = table_Selection_Text;
            this.CurCell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
            this.CurCell.Content.Select_All();
        } else {
            if (true === this.Is_InnerTable()) {
                return this.CurCell.Content.Cursor_MoveToCell(bNext);
            }
            var CurCell = this.CurCell;
            var Pos_c = this.CurCell.Index;
            var Pos_r = this.CurCell.Row.Index;
            var Pos = {
                Cell: Pos_c,
                Row: Pos_r
            };
            if (true === bNext) {
                var TempCell = this.Internal_Get_NextCell(Pos);
                while (null != TempCell && vmerge_Restart != TempCell.Get_VMerge()) {
                    TempCell = this.Internal_Get_NextCell(Pos);
                }
                if (null != TempCell) {
                    CurCell = TempCell;
                } else {
                    this.Row_Add(false);
                    var TempCell = this.Internal_Get_NextCell(Pos);
                    while (null != TempCell && vmerge_Restart != TempCell.Get_VMerge()) {
                        TempCell = this.Internal_Get_NextCell(Pos);
                    }
                    if (null != TempCell) {
                        CurCell = TempCell;
                    }
                }
            } else {
                var TempCell = this.Internal_Get_PrevCell(Pos);
                while (null != TempCell && vmerge_Restart != TempCell.Get_VMerge()) {
                    TempCell = this.Internal_Get_PrevCell(Pos);
                }
                if (null != TempCell) {
                    CurCell = TempCell;
                }
            }
            editor.WordControl.m_oLogicDocument.Selection_Remove();
            this.CurCell = CurCell;
            this.CurCell.Content.Select_All();
            if (true === this.CurCell.Content.Selection_IsEmpty(false)) {
                this.CurCell.Content.Cursor_MoveToStartPos();
                this.Selection.Use = false;
                this.Selection.Type = table_Selection_Text;
            } else {
                this.Selection.Use = true;
                this.Selection.Type = table_Selection_Text;
                this.Selection.StartPos.Pos = {
                    Row: CurCell.Row.Index,
                    Cell: CurCell.Index
                };
                this.Selection.EndPos.Pos = {
                    Row: CurCell.Row.Index,
                    Cell: CurCell.Index
                };
                this.Selection.CurRow = CurCell.Row.Index;
            }
            this.Document_SetThisElementCurrent();
        }
    },
    Get_CurPosXY: function () {
        var Cell = null;
        if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
            Cell = this.Content[this.Selection.EndPos.Pos.Row].Get_Cell(this.Selection.EndPos.Pos.Cell);
        } else {
            Cell = this.CurCell;
        }
        return Cell.Content.Get_CurPosXY();
    },
    Is_SelectionUse: function () {
        if ((true == this.Selection.Use && table_Selection_Cell == this.Selection.Type) || table_Selection_Border == this.Selection.Type2 || table_Selection_Border_InnerTable == this.Selection.Type2) {
            return true;
        } else {
            if (true == this.Selection.Use) {
                return this.CurCell.Content.Is_SelectionUse();
            }
        }
        return false;
    },
    Is_TextSelectionUse: function () {
        if ((true == this.Selection.Use && table_Selection_Cell == this.Selection.Type) || table_Selection_Border == this.Selection.Type2 || table_Selection_Border_InnerTable == this.Selection.Type2) {
            return true;
        } else {
            if (true == this.Selection.Use) {
                return this.CurCell.Content.Is_TextSelectionUse();
            }
        }
        return false;
    },
    Get_SelectedText: function (bClearText) {
        if (true === bClearText && ((true == this.Selection.Use && table_Selection_Text == this.Selection.Type) || false === this.Selection.Use)) {
            return this.CurCell.Content.Get_SelectedText(true);
        } else {
            if (false === bClearText) {
                if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
                    var Count = this.Selection.Data.length;
                    var ResultText = "";
                    for (var Index = 0; Index < Count; Index++) {
                        var Pos = this.Selection.Data[Index];
                        var Cell = this.Content[Pos.Row].Get_Cell(Pos.Cell);
                        Cell.Content.Set_ApplyToAll(true);
                        ResultText += Cell.Content.Get_SelectedText(false);
                        Cell.Content.Set_ApplyToAll(false);
                    }
                    return ResultText;
                } else {
                    return this.CurCell.Content.Get_SelectedText(false);
                }
            }
        }
        return null;
    },
    Get_SelectedElementsInfo: function (Info) {
        Info.Set_Table();
        if (false === this.Selection.Use || (true === this.Selection.Use && table_Selection_Text === this.Selection.Type)) {
            this.CurCell.Content.Get_SelectedElementsInfo(Info);
        }
    },
    Set_ParagraphAlign: function (Align) {
        if (true === this.ApplyToAll || (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0)) {
            var Cells_array = this.Internal_Get_SelectionArray();
            for (var Index = 0; Index < Cells_array.length; Index++) {
                var Pos = Cells_array[Index];
                var Row = this.Content[Pos.Row];
                var Cell = Row.Get_Cell(Pos.Cell);
                var Cell_Content = Cell.Content;
                Cell_Content.Set_ApplyToAll(true);
                Cell.Content.Set_ParagraphAlign(Align);
                Cell_Content.Set_ApplyToAll(false);
            }
            if (Cells_array[0].Row - 1 >= 0) {
                this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
            } else {
                this.Internal_Recalculate_1();
                this.Internal_OnContentRecalculate(true, 0, this.Index);
            }
        } else {
            return this.CurCell.Content.Set_ParagraphAlign(Align);
        }
    },
    Set_ParagraphSpacing: function (Spacing) {
        if (true === this.ApplyToAll || (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0)) {
            var Cells_array = this.Internal_Get_SelectionArray();
            for (var Index = 0; Index < Cells_array.length; Index++) {
                var Pos = Cells_array[Index];
                var Row = this.Content[Pos.Row];
                var Cell = Row.Get_Cell(Pos.Cell);
                var Cell_Content = Cell.Content;
                Cell_Content.Set_ApplyToAll(true);
                Cell.Content.Set_ParagraphSpacing(Spacing);
                Cell_Content.Set_ApplyToAll(false);
            }
            if (Cells_array[0].Row - 1 >= 0) {
                this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
            } else {
                this.Internal_Recalculate_1();
                this.Internal_OnContentRecalculate(true, 0, this.Index);
            }
        } else {
            return this.CurCell.Content.Set_ParagraphSpacing(Spacing);
        }
    },
    Set_ParagraphIndent: function (Ind) {
        if (true === this.ApplyToAll || (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0)) {
            var Cells_array = this.Internal_Get_SelectionArray();
            for (var Index = 0; Index < Cells_array.length; Index++) {
                var Pos = Cells_array[Index];
                var Row = this.Content[Pos.Row];
                var Cell = Row.Get_Cell(Pos.Cell);
                var Cell_Content = Cell.Content;
                Cell_Content.Set_ApplyToAll(true);
                Cell.Content.Set_ParagraphIndent(Ind);
                Cell_Content.Set_ApplyToAll(false);
            }
            if (Cells_array[0].Row - 1 >= 0) {
                this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
            } else {
                this.Internal_Recalculate_1();
                this.Internal_OnContentRecalculate(true, 0, this.Index);
            }
        } else {
            return this.CurCell.Content.Set_ParagraphIndent(Ind);
        }
    },
    Set_ParagraphNumbering: function (NumInfo) {
        if (true === this.ApplyToAll || (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0)) {
            var Cells_array = this.Internal_Get_SelectionArray();
            for (var Index = 0; Index < Cells_array.length; Index++) {
                var Pos = Cells_array[Index];
                var Row = this.Content[Pos.Row];
                var Cell = Row.Get_Cell(Pos.Cell);
                var Cell_Content = Cell.Content;
                Cell_Content.Set_ApplyToAll(true);
                Cell.Content.Set_ParagraphNumbering(NumInfo);
                Cell_Content.Set_ApplyToAll(false);
            }
            if (Cells_array[0].Row - 1 >= 0) {
                this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
            } else {
                this.Internal_Recalculate_1();
                this.Internal_OnContentRecalculate(true, 0, this.Index);
            }
        } else {
            return this.CurCell.Content.Set_ParagraphNumbering(NumInfo);
        }
    },
    Set_ParagraphShd: function (Shd) {
        if (true === this.ApplyToAll || (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0)) {
            var Cells_array = this.Internal_Get_SelectionArray();
            for (var Index = 0; Index < Cells_array.length; Index++) {
                var Pos = Cells_array[Index];
                var Row = this.Content[Pos.Row];
                var Cell = Row.Get_Cell(Pos.Cell);
                var Cell_Content = Cell.Content;
                Cell_Content.Set_ApplyToAll(true);
                Cell.Content.Set_ParagraphShd(Shd);
                Cell_Content.Set_ApplyToAll(false);
            }
            if (Cells_array[0].Row - 1 >= 0) {
                this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
            } else {
                this.Internal_Recalculate_1();
                this.Internal_OnContentRecalculate(true, 0, this.Index);
            }
        } else {
            return this.CurCell.Content.Set_ParagraphShd(Shd);
        }
    },
    Set_ParagraphStyle: function (Name) {
        if (true === this.ApplyToAll || (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0)) {
            var Cells_array = this.Internal_Get_SelectionArray();
            for (var Index = 0; Index < Cells_array.length; Index++) {
                var Pos = Cells_array[Index];
                var Row = this.Content[Pos.Row];
                var Cell = Row.Get_Cell(Pos.Cell);
                var Cell_Content = Cell.Content;
                Cell_Content.Set_ApplyToAll(true);
                Cell.Content.Set_ParagraphStyle(Name);
                Cell_Content.Set_ApplyToAll(false);
            }
            if (Cells_array[0].Row - 1 >= 0) {
                this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
            } else {
                this.Internal_Recalculate_1();
                this.Internal_OnContentRecalculate(true, 0, this.Index);
            }
        } else {
            return this.CurCell.Content.Set_ParagraphStyle(Name);
        }
    },
    Set_ParagraphTabs: function (Tabs) {
        if (true === this.ApplyToAll || (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0)) {
            var Cells_array = this.Internal_Get_SelectionArray();
            for (var Index = 0; Index < Cells_array.length; Index++) {
                var Pos = Cells_array[Index];
                var Row = this.Content[Pos.Row];
                var Cell = Row.Get_Cell(Pos.Cell);
                var Cell_Content = Cell.Content;
                Cell_Content.Set_ApplyToAll(true);
                Cell.Content.Set_ParagraphTabs(Tabs);
                Cell_Content.Set_ApplyToAll(false);
            }
            if (Cells_array[0].Row - 1 >= 0) {
                this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
            } else {
                this.Internal_Recalculate_1();
                this.Internal_OnContentRecalculate(true, 0, this.Index);
            }
        } else {
            return this.CurCell.Content.Set_ParagraphTabs(Tabs);
        }
    },
    Set_ParagraphContextualSpacing: function (Value) {
        if (true === this.ApplyToAll || (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0)) {
            var Cells_array = this.Internal_Get_SelectionArray();
            for (var Index = 0; Index < Cells_array.length; Index++) {
                var Pos = Cells_array[Index];
                var Row = this.Content[Pos.Row];
                var Cell = Row.Get_Cell(Pos.Cell);
                var Cell_Content = Cell.Content;
                Cell_Content.Set_ApplyToAll(true);
                Cell.Content.Set_ParagraphContextualSpacing(Value);
                Cell_Content.Set_ApplyToAll(false);
            }
            if (Cells_array[0].Row - 1 >= 0) {
                this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
            } else {
                this.Internal_Recalculate_1();
                this.Internal_OnContentRecalculate(true, 0, this.Index);
            }
        } else {
            return this.CurCell.Content.Set_ParagraphContextualSpacing(Value);
        }
    },
    Set_ParagraphPageBreakBefore: function (Value) {
        if (true === this.ApplyToAll || (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0)) {
            var Cells_array = this.Internal_Get_SelectionArray();
            for (var Index = 0; Index < Cells_array.length; Index++) {
                var Pos = Cells_array[Index];
                var Row = this.Content[Pos.Row];
                var Cell = Row.Get_Cell(Pos.Cell);
                var Cell_Content = Cell.Content;
                Cell_Content.Set_ApplyToAll(true);
                Cell.Content.Set_ParagraphPageBreakBefore(Value);
                Cell_Content.Set_ApplyToAll(false);
            }
            if (Cells_array[0].Row - 1 >= 0) {
                this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
            } else {
                this.Internal_Recalculate_1();
                this.Internal_OnContentRecalculate(true, 0, this.Index);
            }
        } else {
            return this.CurCell.Content.Set_ParagraphPageBreakBefore(Value);
        }
    },
    Set_ParagraphKeepLines: function (Value) {
        if (true === this.ApplyToAll || (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0)) {
            var Cells_array = this.Internal_Get_SelectionArray();
            for (var Index = 0; Index < Cells_array.length; Index++) {
                var Pos = Cells_array[Index];
                var Row = this.Content[Pos.Row];
                var Cell = Row.Get_Cell(Pos.Cell);
                var Cell_Content = Cell.Content;
                Cell_Content.Set_ApplyToAll(true);
                Cell.Content.Set_ParagraphKeepLines(Value);
                Cell_Content.Set_ApplyToAll(false);
            }
            if (Cells_array[0].Row - 1 >= 0) {
                this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
            } else {
                this.Internal_Recalculate_1();
                this.Internal_OnContentRecalculate(true, 0, this.Index);
            }
        } else {
            return this.CurCell.Content.Set_ParagraphKeepLines(Value);
        }
    },
    Set_ParagraphKeepNext: function (Value) {
        if (true === this.ApplyToAll || (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0)) {
            var Cells_array = this.Internal_Get_SelectionArray();
            for (var Index = 0; Index < Cells_array.length; Index++) {
                var Pos = Cells_array[Index];
                var Row = this.Content[Pos.Row];
                var Cell = Row.Get_Cell(Pos.Cell);
                var Cell_Content = Cell.Content;
                Cell_Content.Set_ApplyToAll(true);
                Cell.Content.Set_ParagraphKeepNext(Value);
                Cell_Content.Set_ApplyToAll(false);
            }
            if (Cells_array[0].Row - 1 >= 0) {
                this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
            } else {
                this.Internal_Recalculate_1();
                this.Internal_OnContentRecalculate(true, 0, this.Index);
            }
        } else {
            return this.CurCell.Content.Set_ParagraphKeepNext(Value);
        }
    },
    Set_ParagraphWidowControl: function (Value) {
        if (true === this.ApplyToAll || (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0)) {
            var Cells_array = this.Internal_Get_SelectionArray();
            for (var Index = 0; Index < Cells_array.length; Index++) {
                var Pos = Cells_array[Index];
                var Row = this.Content[Pos.Row];
                var Cell = Row.Get_Cell(Pos.Cell);
                var Cell_Content = Cell.Content;
                Cell_Content.Set_ApplyToAll(true);
                Cell.Content.Set_ParagraphWidowControl(Value);
                Cell_Content.Set_ApplyToAll(false);
            }
            if (Cells_array[0].Row - 1 >= 0) {
                this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
            } else {
                this.Internal_Recalculate_1();
                this.Internal_OnContentRecalculate(true, 0, this.Index);
            }
        } else {
            return this.CurCell.Content.Set_ParagraphWidowControl(Value);
        }
    },
    Set_ParagraphBorders: function (Borders) {
        if (true === this.ApplyToAll || (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0)) {
            var Cells_array = this.Internal_Get_SelectionArray();
            for (var Index = 0; Index < Cells_array.length; Index++) {
                var Pos = Cells_array[Index];
                var Row = this.Content[Pos.Row];
                var Cell = Row.Get_Cell(Pos.Cell);
                var Cell_Content = Cell.Content;
                Cell_Content.Set_ApplyToAll(true);
                Cell.Content.Set_ParagraphBorders(Borders);
                Cell_Content.Set_ApplyToAll(false);
            }
            if (Cells_array[0].Row - 1 >= 0) {
                this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
            } else {
                this.Internal_Recalculate_1();
                this.Internal_OnContentRecalculate(true, 0, this.Index);
            }
        } else {
            return this.CurCell.Content.Set_ParagraphBorders(Borders);
        }
    },
    Paragraph_IncDecFontSize: function (bIncrease) {
        if (true === this.ApplyToAll || (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0)) {
            var Cells_array = this.Internal_Get_SelectionArray();
            for (var Index = 0; Index < Cells_array.length; Index++) {
                var Pos = Cells_array[Index];
                var Row = this.Content[Pos.Row];
                var Cell = Row.Get_Cell(Pos.Cell);
                var Cell_Content = Cell.Content;
                Cell_Content.Set_ApplyToAll(true);
                Cell.Content.Paragraph_IncDecFontSize(bIncrease);
                Cell_Content.Set_ApplyToAll(false);
            }
            if (Cells_array[0].Row - 1 >= 0) {
                this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
            } else {
                this.Internal_Recalculate_1();
                this.Internal_OnContentRecalculate(true, 0, this.Index);
            }
        } else {
            return this.CurCell.Content.Paragraph_IncDecFontSize(bIncrease);
        }
    },
    Paragraph_IncDecIndent: function (bIncrease) {
        if (true === this.ApplyToAll || (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type && this.Selection.Data.length > 0)) {
            var Cells_array = this.Internal_Get_SelectionArray();
            for (var Index = 0; Index < Cells_array.length; Index++) {
                var Pos = Cells_array[Index];
                var Row = this.Content[Pos.Row];
                var Cell = Row.Get_Cell(Pos.Cell);
                var Cell_Content = Cell.Content;
                Cell_Content.Set_ApplyToAll(true);
                Cell.Content.Paragraph_IncDecIndent(bIncrease);
                Cell_Content.Set_ApplyToAll(false);
            }
            if (Cells_array[0].Row - 1 >= 0) {
                this.Internal_RecalculateFrom(Cells_array[0].Row - 1, 0, true, true);
            } else {
                this.Internal_Recalculate_1();
                this.Internal_OnContentRecalculate(true, 0, this.Index);
            }
        } else {
            return this.CurCell.Content.Paragraph_IncDecIndent(bIncrease);
        }
    },
    Get_Paragraph_ParaPr: function () {
        if (true === this.ApplyToAll) {
            var Row = this.Content[0];
            var Cell = Row.Get_Cell(0);
            Cell.Content.Set_ApplyToAll(true);
            var Result_ParaPr = Cell.Content.Get_Paragraph_ParaPr();
            Cell.Content.Set_ApplyToAll(false);
            for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
                Row = this.Content[CurRow];
                var CellsCount = Row.Get_CellsCount();
                var StartCell = (CurRow === 0 ? 1 : 0);
                for (var CurCell = StartCell; CurCell < CellsCount; CurCell++) {
                    Cell = Row.Get_Cell(CurCell);
                    Cell.Content.Set_ApplyToAll(true);
                    var CurPr = Cell.Content.Get_Paragraph_ParaPr();
                    Cell.Content.Set_ApplyToAll(false);
                    Result_ParaPr = Result_ParaPr.Compare(CurPr);
                }
            }
            return Result_ParaPr;
        }
        if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
            var Pos = this.Selection.Data[0];
            var Row = this.Content[Pos.Row];
            var Cell = Row.Get_Cell(Pos.Cell);
            Cell.Content.Set_ApplyToAll(true);
            var Result_ParaPr = Cell.Content.Get_Paragraph_ParaPr();
            Cell.Content.Set_ApplyToAll(false);
            for (var Index = 1; Index < this.Selection.Data.length; Index++) {
                Pos = this.Selection.Data[Index];
                Row = this.Content[Pos.Row];
                Cell = Row.Get_Cell(Pos.Cell);
                Cell.Content.Set_ApplyToAll(true);
                var CurPr = Cell.Content.Get_Paragraph_ParaPr();
                Cell.Content.Set_ApplyToAll(false);
                Result_ParaPr = Result_ParaPr.Compare(CurPr);
            }
            return Result_ParaPr;
        }
        return this.CurCell.Content.Get_Paragraph_ParaPr();
    },
    Get_Paragraph_TextPr: function () {
        if (true === this.ApplyToAll) {
            var Row = this.Content[0];
            var Cell = Row.Get_Cell(0);
            Cell.Content.Set_ApplyToAll(true);
            var Result_TextPr = Cell.Content.Get_Paragraph_TextPr();
            Cell.Content.Set_ApplyToAll(false);
            for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
                Row = this.Content[CurRow];
                var CellsCount = Row.Get_CellsCount();
                var StartCell = (CurRow === 0 ? 1 : 0);
                for (var CurCell = StartCell; CurCell < CellsCount; CurCell++) {
                    Cell = Row.Get_Cell(CurCell);
                    Cell.Content.Set_ApplyToAll(true);
                    var CurPr = Cell.Content.Get_Paragraph_TextPr();
                    Cell.Content.Set_ApplyToAll(false);
                    Result_TextPr = Result_TextPr.Compare(CurPr);
                }
            }
            return Result_TextPr;
        }
        if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
            var Pos = this.Selection.Data[0];
            var Row = this.Content[Pos.Row];
            var Cell = Row.Get_Cell(Pos.Cell);
            Cell.Content.Set_ApplyToAll(true);
            var Result_TextPr = Cell.Content.Get_Paragraph_TextPr();
            Cell.Content.Set_ApplyToAll(false);
            for (var Index = 1; Index < this.Selection.Data.length; Index++) {
                Pos = this.Selection.Data[Index];
                Row = this.Content[Pos.Row];
                Cell = Row.Get_Cell(Pos.Cell);
                Cell.Content.Set_ApplyToAll(true);
                var CurPr = Cell.Content.Get_Paragraph_TextPr();
                Cell.Content.Set_ApplyToAll(false);
                Result_TextPr = Result_TextPr.Compare(CurPr);
            }
            return Result_TextPr;
        }
        return this.CurCell.Content.Get_Paragraph_TextPr();
    },
    Get_Paragraph_TextPr_Copy: function () {
        if (true === this.ApplyToAll) {
            var Row = this.Content[0];
            var Cell = Row.Get_Cell(0);
            Cell.Content.Set_ApplyToAll(true);
            var Result_TextPr = Cell.Content.Get_Paragraph_TextPr_Copy();
            Cell.Content.Set_ApplyToAll(false);
            return Result_TextPr;
        }
        if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
            var Pos = this.Selection.Data[0];
            var Row = this.Content[Pos.Row];
            var Cell = Row.Get_Cell(Pos.Cell);
            Cell.Content.Set_ApplyToAll(true);
            var Result_TextPr = Cell.Content.Get_Paragraph_TextPr_Copy();
            Cell.Content.Set_ApplyToAll(false);
            return Result_TextPr;
        }
        return this.CurCell.Content.Get_Paragraph_TextPr_Copy();
    },
    Get_Paragraph_ParaPr_Copy: function () {
        if (true === this.ApplyToAll) {
            var Row = this.Content[0];
            var Cell = Row.Get_Cell(0);
            Cell.Content.Set_ApplyToAll(true);
            var Result_TextPr = Cell.Content.Get_Paragraph_ParaPr_Copy();
            Cell.Content.Set_ApplyToAll(false);
            return Result_TextPr;
        }
        if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
            var Pos = this.Selection.Data[0];
            var Row = this.Content[Pos.Row];
            var Cell = Row.Get_Cell(Pos.Cell);
            Cell.Content.Set_ApplyToAll(true);
            var Result_TextPr = Cell.Content.Get_Paragraph_ParaPr_Copy();
            Cell.Content.Set_ApplyToAll(false);
            return Result_TextPr;
        }
        return this.CurCell.Content.Get_Paragraph_ParaPr_Copy();
    },
    Get_CurrentParagraph: function () {
        return this.CurCell.Content.Get_CurrentParagraph();
    },
    Set_ImageProps: function (Props) {
        if ((true === this.Selection.Use && table_Selection_Text === this.Selection.Type) || false === this.Selection.Use) {
            return this.CurCell.Content.Set_ImageProps(Props);
        }
    },
    Recalc_CompiledPr: function () {
        this.CompiledPr.NeedRecalc = true;
        for (var i = 0; i < this.Content.length; ++i) {
            this.Content[i].Recalc_CompiledPr();
        }
        if (this.Parent) {
            editor.WordControl.m_oLogicDocument.recalcMap[this.Parent.Id] = this.Parent;
        }
    },
    Get_CompiledPr: function (bCopy) {
        if (true === this.CompiledPr.NeedRecalc) {
            this.CompiledPr.Pr = this.Internal_Compile_Pr();
            this.CompiledPr.NeedRecalc = false;
        }
        if (false === bCopy) {
            return this.CompiledPr.Pr;
        } else {
            var Pr = {};
            Pr.TextPr = this.CompiledPr.Pr.TextPr.Copy();
            Pr.ParaPr = this.CompiledPr.Pr.ParaPr.Copy();
            Pr.TablePr = this.CompiledPr.Pr.TablePr.Copy();
            Pr.TableRowPr = this.CompiledPr.Pr.TableRowPr.Copy();
            Pr.TableCellPr = this.CompiledPr.Pr.TableCellPr.Copy();
            Pr.TableFirstCol = this.CompiledPr.Pr.TableFirstCol.Copy();
            Pr.TableFirstRow = this.CompiledPr.Pr.TableFirstRow.Copy();
            Pr.TableLastCol = this.CompiledPr.Pr.TableLastCol.Copy();
            Pr.TableLastRow = this.CompiledPr.Pr.TableLastRow.Copy();
            Pr.TableBand1Horz = this.CompiledPr.Pr.TableBand1Horz.Copy();
            Pr.TableBand1Vert = this.CompiledPr.Pr.TableBand1Vert.Copy();
            Pr.TableBand2Horz = this.CompiledPr.Pr.TableBand2Horz.Copy();
            Pr.TableBand2Vert = this.CompiledPr.Pr.TableBand2Vert.Copy();
            Pr.TableTLCell = this.CompiledPr.Pr.TableTLCell.Copy();
            Pr.TableTRCell = this.CompiledPr.Pr.TableTRCell.Copy();
            Pr.TableBLCell = this.CompiledPr.Pr.TableBLCell.Copy();
            Pr.TableBRCell = this.CompiledPr.Pr.TableBRCell.Copy();
            Pr.TableWholeTable = this.CompiledPr.Pr.TableWholeTable.Copy();
            return Pr;
        }
    },
    Get_Style: function () {
        if ("undefined" != typeof(this.TableStyle)) {
            return this.TableStyle;
        }
        return null;
    },
    Set_Style: function (Id) {
        this.Style_Remove();
        if (null === Id) {
            return;
        }
        if (Id != this.Get_Styles().Get_Default_Table()) {
            this.TableStyle = Id;
        }
        this.CompiledPr.NeedRecalc = true;
    },
    Remove_Style: function () {
        if ("undefined" != typeof(this.TableStyle)) {
            delete this.TableStyle;
        }
        this.CompiledPr.NeedRecalc = true;
    },
    Numbering_IsUse: function (NumId, NumLvl) {
        return false;
    },
    Internal_Compile_Pr: function () {
        var Styles = this.Get_Styles(),
        StyleId;
        if (this.styleIndex !== -1) {
            StyleId = Styles.Style.length - 1;
        } else {
            StyleId = null;
        }
        var Pr = Styles.Get_Pr(StyleId, styles_Table, null);
        if (!this.Parent || !this.Parent.parent) {
            if (this.Pr !== null && typeof this.Pr === "object") {
                Pr.TablePr.Merge(this.Pr);
            }
            return Pr;
        }
        var _theme = null,
        _master = null,
        _layout = null,
        _slide = null;
        switch (this.Parent.parent.kind) {
        case SLIDE_KIND:
            _slide = this.Parent.parent;
            if (_slide !== null && typeof _slide === "object") {
                _layout = _slide.Layout;
                if (_layout !== null && typeof _layout === "object") {
                    _master = _layout.Master;
                    if (_master !== null && typeof _master === "object") {
                        _theme = _master.Theme;
                    }
                }
            }
            break;
        case LAYOUT_KIND:
            _layout = this.Parent.parent;
            if (_layout !== null && typeof _layout === "object") {
                _master = _layout.Master;
                if (_master !== null && typeof _master === "object") {
                    _theme = _master.Theme;
                }
            }
            break;
        case MASTER_KIND:
            _master = this.Parent.parent;
            if (_master !== null && typeof _master === "object") {
                _theme = _master.Theme;
            }
            break;
        }
        var _calculated_unifill;
        var RGBA = {
            R: 0,
            G: 0,
            B: 0,
            A: 255
        };
        var fontRef;
        if (Pr.TextPr !== null && typeof Pr.TextPr === "object") {
            if ((Pr.TextPr.fontRef !== null && typeof Pr.TextPr.fontRef === "object") || (Pr.TextPr.unifill !== null && typeof Pr.TextPr.unifill === "object" && Pr.TextPr.unifill.fill !== null && typeof Pr.TextPr.unifill.fill === "object")) {
                RGBA = GetRGBColorFromUniFillAndRef(Pr.TextPr.unifill, Pr.TextPr.fontRef, _theme, _master, _layout, _slide);
                if (RGBA !== null) {
                    Pr.TextPr.Color.r = RGBA.R;
                    Pr.TextPr.Color.g = RGBA.G;
                    Pr.TextPr.Color.b = RGBA.B;
                }
            }
            if ((Pr.TextPr.fontRef !== null && typeof Pr.TextPr.fontRef === "object" && typeof Pr.TextPr.fontRef.idx === "number")) {
                switch (Pr.TextPr.fontRef.idx) {
                case fntStyleInd_major:
                    Pr.TextPr.FontFamily = {
                        Name: getFontInfo("+mj-lt")(_theme.themeElements.fontScheme),
                        Index: -1
                    };
                    break;
                case fntStyleInd_minor:
                    Pr.TextPr.FontFamily = {
                        Name: getFontInfo("+mn-lt")(_theme.themeElements.fontScheme),
                        Index: -1
                    };
                    break;
                default:
                    break;
                }
            }
        }
        for (var key in Pr) {
            if (Pr[key] instanceof CTableStylePr) {
                var _text_pr = Pr[key].TextPr;
                if (_text_pr !== null && typeof _text_pr === "object") {
                    if ((_text_pr.fontRef !== null && typeof _text_pr.fontRef === "object") || (_text_pr.unifill !== null && typeof _text_pr.unifill === "object" && _text_pr.unifill.fill !== null && typeof _text_pr.unifill.fill === "object")) {
                        RGBA = GetRGBColorFromUniFillAndRef(_text_pr.unifill, _text_pr.fontRef, _theme, _master, _layout, _slide);
                        _text_pr.Color = new CDocumentColor(RGBA.R, RGBA.G, RGBA.B);
                    }
                    if ((_text_pr.fontRef !== null && typeof _text_pr.fontRef === "object" && typeof _text_pr.fontRef.idx === "number")) {
                        switch (_text_pr.fontRef.idx) {
                        case fntStyleInd_major:
                            _text_pr.FontFamily = {
                                Name: getFontInfo("+mj-lt")(_theme.themeElements.fontScheme),
                                Index: -1
                            };
                            break;
                        case fntStyleInd_minor:
                            _text_pr.FontFamily = {
                                Name: getFontInfo("+mn-lt")(_theme.themeElements.fontScheme),
                                Index: -1
                            };
                            break;
                        default:
                            break;
                        }
                    }
                }
                var _table_cell_pr = Pr[key].TableCellPr;
                if (_table_cell_pr !== null && typeof _table_cell_pr === "object") {
                    if (_table_cell_pr.Shd !== null && typeof _table_cell_pr.Shd === "object" && _table_cell_pr.Shd.unifill !== null && typeof _table_cell_pr.Shd.unifill === "object" && _table_cell_pr.Shd.unifill.fill !== null && typeof _table_cell_pr.Shd.unifill.fill === "object") {
                        _calculated_unifill = _table_cell_pr.Shd.unifill.createDuplicate();
                        _calculated_unifill.calculate(_theme, _slide, _layout, _master, {
                            R: 0,
                            G: 0,
                            B: 0,
                            A: 255
                        });
                        if (_calculated_unifill.fill.color && _calculated_unifill.fill.color.RGBA !== null && typeof _calculated_unifill.fill.color.RGBA === "object") {
                            RGBA = _calculated_unifill.fill.color.RGBA;
                            _table_cell_pr.Shd.Color = new CDocumentColor(RGBA.R, RGBA.G, RGBA.B);
                        }
                    }
                    if (_table_cell_pr.TableCellBorders !== null && typeof _table_cell_pr.TableCellBorders === "object") {
                        var _borders = _table_cell_pr.TableCellBorders;
                        var _border;
                        for (key in _borders) {
                            if (_borders[key] instanceof CDocumentBorder) {
                                _border = _borders[key];
                                var _calculated_line;
                                if (_border.lnRef != null) {
                                    _calculated_line = _theme.getLnStyle(_border.lnRef.idx);
                                    _border.lnRef.Color.Calculate(_theme, _slide, _layout, _master);
                                    RGBA = _border.lnRef.Color.RGBA;
                                } else {
                                    _calculated_line = new CLn();
                                }
                                var _tmp_pen = new CLn();
                                _tmp_pen.Fill = _border.unifill;
                                _calculated_line.merge(_tmp_pen);
                                if (_calculated_line.Fill != null) {
                                    _calculated_line.Fill.calculate(_theme, _slide, _layout, _master, RGBA);
                                }
                                if ((_calculated_line.Fill !== null && typeof _calculated_line.Fill === "object" && _calculated_line.Fill.fill !== null && typeof _calculated_line.Fill.fill === "object")) {
                                    if (_calculated_line.Fill.fill.color && _calculated_line.Fill.fill.color.RGBA !== null && typeof _calculated_line.Fill.fill.color.RGBA === "object") {
                                        RGBA = _calculated_line.Fill.fill.color.RGBA;
                                        _border.Color = new CDocumentColor(RGBA.R, RGBA.G, RGBA.B);
                                    }
                                    if (_calculated_line.Fill.fill.type === FILL_TYPE_NONE || _calculated_line.Fill.fill.type === FILL_TYPE_NOFILL) {
                                        _border.Value = border_None;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        var _table_cell_pr = Pr.TablePr;
        if (_table_cell_pr !== null && typeof _table_cell_pr === "object") {
            if (_table_cell_pr.Shd !== null && typeof _table_cell_pr.Shd === "object" && _table_cell_pr.Shd.unifill !== null && typeof _table_cell_pr.Shd.unifill === "object" && _table_cell_pr.Shd.unifill.fill !== null && typeof _table_cell_pr.Shd.unifill.fill === "object") {
                _calculated_unifill = _table_cell_pr.Shd.unifill.createDuplicate();
                _calculated_unifill.calculate(_theme, _slide, _layout, _master, {
                    R: 0,
                    G: 0,
                    B: 0,
                    A: 255
                });
                if (_calculated_unifill.fill.color && _calculated_unifill.fill.color.RGBA !== null && typeof _calculated_unifill.fill.color.RGBA === "object") {
                    RGBA = _calculated_unifill.fill.color.RGBA;
                    _table_cell_pr.Shd.Color = new CDocumentColor(RGBA.R, RGBA.G, RGBA.B);
                }
            }
            if (_table_cell_pr.TableBorders !== null && typeof _table_cell_pr.TableBorders === "object") {
                var _borders = _table_cell_pr.TableBorders;
                var _border;
                for (key in _borders) {
                    if (_borders[key] instanceof CDocumentBorder) {
                        _border = _borders[key];
                        var _calculated_line;
                        if (_border.lnRef != null) {
                            _calculated_line = _theme.getLnStyle(_border.lnRef.idx);
                            _border.lnRef.Color.Calculate(_theme, _slide, _layout, _master);
                            RGBA = _border.lnRef.Color.RGBA;
                        } else {
                            _calculated_line = new CLn();
                        }
                        var _tmp_pen = new CLn();
                        _tmp_pen.Fill = _border.unifill;
                        _calculated_line.merge(_tmp_pen);
                        if (_calculated_line.Fill != null) {
                            _calculated_line.Fill.calculate(_theme, _slide, _layout, _master, RGBA);
                        }
                        if ((_calculated_line.Fill !== null && typeof _calculated_line.Fill === "object" && _calculated_line.Fill.fill !== null && typeof _calculated_line.Fill.fill === "object")) {
                            if (_calculated_line.Fill.fill.color && _calculated_line.Fill.fill.color.RGBA !== null && typeof _calculated_line.Fill.fill.color.RGBA === "object") {
                                RGBA = _calculated_line.Fill.fill.color.RGBA;
                                _border.Color = new CDocumentColor(RGBA.R, RGBA.G, RGBA.B);
                            }
                            if (_calculated_line.Fill.fill.type === FILL_TYPE_NONE || _calculated_line.Fill.fill.type === FILL_TYPE_NOFILL) {
                                _border.Value = border_None;
                            }
                        }
                    }
                }
            }
        }
        if (this.Pr !== null && typeof this.Pr === "object") {
            Pr.TablePr.Merge(this.Pr);
        }
        return Pr;
    },
    Clear_DirectFormatting: function (bClearMerge) {
        this.Set_TableStyleRowBandSize(undefined);
        this.Set_TableStyleColBandSize(undefined);
        this.Set_TableAlign(undefined);
        this.Set_TableShd(undefined);
        this.Set_TableBorder_Bottom(undefined);
        this.Set_TableBorder_Left(undefined);
        this.Set_TableBorder_Right(undefined);
        this.Set_TableBorder_Top(undefined);
        this.Set_TableBorder_InsideV(undefined);
        this.Set_TableBorder_InsideH(undefined);
        this.Set_TableCellMar(undefined, undefined, undefined, undefined);
        this.Set_TableInd(undefined);
        this.Set_TableW(undefined, undefined);
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            this.Content[Index].Clear_DirectFormatting(bClearMerge);
        }
    },
    Set_Pr: function (TablePr) {
        History.Add(this, {
            Type: historyitem_Table_Pr,
            Old: this.Pr,
            New: TablePr
        });
        this.Pr = TablePr;
    },
    Set_TableStyle: function (StyleId) {
        if (this.styleIndex != StyleId) {
            History.Add(this, {
                Type: historyitem_Table_SetStyleIndex,
                oldPr: this.styleIndex,
                newPr: StyleId
            });
            this.styleIndex = StyleId;
            this.Clear_DirectFormatting(false);
            this.Recalc_CompiledPr();
        }
    },
    Get_TableStyle: function () {
        return this.TableStyle;
    },
    Set_TableLook: function (TableLook) {
        History.Add(this, {
            Type: historyitem_Table_TableLook,
            Old: this.TableLook,
            New: TableLook
        });
        this.TableLook = TableLook;
        this.Recalc_CompiledPr();
    },
    Get_TableLook: function () {
        return this.TableLook;
    },
    Set_AllowOverlap: function (AllowOverlap) {
        History.Add(this, {
            Type: historyitem_Table_AllowOverlap,
            Old: this.AllowOverlap,
            New: AllowOverlap
        });
        this.AllowOverlap = AllowOverlap;
    },
    Get_AllowOverlap: function () {
        return this.AllowOverlap;
    },
    Set_PositionH: function (RelativeFrom, Align, Value) {
        History.Add(this, {
            Type: historyitem_Table_PositionH,
            Old: {
                RelativeFrom: this.PositionH.RelativeFrom,
                Align: this.PositionH.Align,
                Value: this.PositionH.Value
            },
            New: {
                RelativeFrom: RelativeFrom,
                Align: Align,
                Value: Value
            }
        });
        this.PositionH.RelativeFrom = RelativeFrom;
        this.PositionH.Align = Align;
        this.PositionH.Value = Value;
    },
    Set_PositionV: function (RelativeFrom, Align, Value) {
        History.Add(this, {
            Type: historyitem_Table_PositionV,
            Old: {
                RelativeFrom: this.PositionV.RelativeFrom,
                Align: this.PositionV.Align,
                Value: this.PositionV.Value
            },
            New: {
                RelativeFrom: RelativeFrom,
                Align: Align,
                Value: Value
            }
        });
        this.PositionV.RelativeFrom = RelativeFrom;
        this.PositionV.Align = Align;
        this.PositionV.Value = Value;
    },
    Set_Distance: function (L, T, R, B) {
        if (null === L || undefined === L) {
            L = this.Distance.L;
        }
        if (null === T || undefined === T) {
            T = this.Distance.T;
        }
        if (null === R || undefined === R) {
            R = this.Distance.R;
        }
        if (null === B || undefined === B) {
            B = this.Distance.B;
        }
        History.Add(this, {
            Type: historyitem_Table_Distance,
            Old: {
                Left: this.Distance.L,
                Top: this.Distance.T,
                Right: this.Distance.R,
                Bottom: this.Distance.B
            },
            New: {
                Left: L,
                Top: T,
                Right: R,
                Bottom: B
            }
        });
        this.Distance.L = L;
        this.Distance.R = R;
        this.Distance.T = T;
        this.Distance.B = B;
    },
    Set_TableStyleRowBandSize: function (Value) {
        if (undefined === Value) {
            if (undefined === this.Pr.TableStyleRowBandSize) {
                return;
            }
            History.Add(this, {
                Type: historyitem_Table_TableStyleRowBandSize,
                Old: this.Pr.TableStyleRowBandSize,
                New: undefined
            });
            this.Pr.TableStyleRowBandSize = undefined;
            this.Recalc_CompiledPr();
        } else {
            if (undefined === this.Pr.TableStyleRowBandSize) {
                History.Add(this, {
                    Type: historyitem_Table_TableStyleRowBandSize,
                    Old: undefined,
                    New: Value
                });
                this.Pr.TableStyleRowBandSize = Value;
                this.Recalc_CompiledPr();
            } else {
                if (this.Pr.TableStyleRowBandSize != Value) {
                    History.Add(this, {
                        Type: historyitem_Table_TableStyleRowBandSize,
                        Old: this.Pr.TableStyleRowBandSize,
                        New: Value
                    });
                    this.Pr.TableStyleRowBandSize = Value;
                    this.Recalc_CompiledPr();
                }
            }
        }
    },
    Get_TableStyleRowBandSize: function () {
        var Pr = this.Get_CompiledPr(false).TablePr;
        return Pr.TableStyleRowBandSize;
    },
    Set_TableStyleColBandSize: function (Value) {
        if (undefined === Value) {
            if (undefined === this.Pr.TableStyleColBandSize) {
                return;
            }
            History.Add(this, {
                Type: historyitem_Table_TableStyleColBandSize,
                Old: this.Pr.TableStyleColBandSize,
                New: undefined
            });
            this.Pr.TableStyleColBandSize = undefined;
            this.Recalc_CompiledPr();
        } else {
            if (undefined === this.Pr.TableStyleRowBandSize) {
                History.Add(this, {
                    Type: historyitem_Table_TableStyleColBandSize,
                    Old: undefined,
                    New: Value
                });
                this.Pr.TableStyleColBandSize = Value;
                this.Recalc_CompiledPr();
            } else {
                if (this.Pr.TableStyleColBandSize != Value) {
                    History.Add(this, {
                        Type: historyitem_Table_TableStyleColBandSize,
                        Old: this.Pr.TableStyleColBandSize,
                        New: Value
                    });
                    this.Pr.TableStyleColBandSize = Value;
                    this.Recalc_CompiledPr();
                }
            }
        }
    },
    Get_TableStyleColBandSize: function () {
        var Pr = this.Get_CompiledPr(false).TablePr;
        return Pr.TableStyleColBandSize;
    },
    Set_TableW: function (Type, W) {
        if (undefined === Type) {
            if (undefined === this.Pr.TableW) {
                return;
            }
            History.Add(this, {
                Type: historyitem_Table_TableW,
                Old: this.Pr.TableW,
                New: undefined
            });
            this.Pr.TableW = undefined;
            this.Recalc_CompiledPr();
        } else {
            if (undefined === this.Pr.TableW) {
                var TableW = new CTableMeasurement(Type, W);
                History.Add(this, {
                    Type: historyitem_Table_TableW,
                    Old: undefined,
                    New: TableW
                });
                this.Pr.TableW = TableW;
                this.Recalc_CompiledPr();
            } else {
                if (Type != this.Pr.TableW.Type || Math.abs(this.Pr.TableW.W - W) > 0.001) {
                    var TableW = new CTableMeasurement(Type, W);
                    History.Add(this, {
                        Type: historyitem_Table_TableW,
                        Old: this.Pr.TableW,
                        New: TableW
                    });
                    this.Pr.TableW = TableW;
                    this.Recalc_CompiledPr();
                }
            }
        }
    },
    Get_TableW: function () {
        var Pr = this.Get_CompiledPr(false).TablePr;
        return Pr.TableW;
    },
    Set_TableLayout: function (Value) {
        if (this.Pr.TableLayout === Value) {
            return;
        }
        History.Add(this, {
            Type: historyitem_Table_TableLayout,
            Old: this.Pr.TableLayout,
            New: Value
        });
        this.Pr.TableLayout = Value;
        this.Recalc_CompiledPr();
    },
    Get_TableLayout: function () {
        var Pr = this.Get_CompliedPr(false).TablePr;
        return Pr.TableLayout;
    },
    Set_TableCellMar: function (Left, Top, Right, Bottom) {
        var old_Left = (undefined === this.Pr.TableCellMar.Left ? undefined : this.Pr.TableCellMar.Left);
        var old_Right = (undefined === this.Pr.TableCellMar.Right ? undefined : this.Pr.TableCellMar.Right);
        var old_Top = (undefined === this.Pr.TableCellMar.Top ? undefined : this.Pr.TableCellMar.Top);
        var old_Bottom = (undefined === this.Pr.TableCellMar.Bottom ? undefined : this.Pr.TableCellMar.Bottom);
        var new_Left = (undefined === Left ? undefined : new CTableMeasurement(tblwidth_Mm, Left));
        var new_Right = (undefined === Right ? undefined : new CTableMeasurement(tblwidth_Mm, Right));
        var new_Top = (undefined === Top ? undefined : new CTableMeasurement(tblwidth_Mm, Top));
        var new_Bottom = (undefined === Bottom ? undefined : new CTableMeasurement(tblwidth_Mm, Bottom));
        History.Add(this, {
            Type: historyitem_Table_TableCellMar,
            Old: {
                Left: old_Left,
                Right: old_Right,
                Top: old_Top,
                Bottom: old_Bottom
            },
            New: {
                Left: new_Left,
                Right: new_Right,
                Top: new_Top,
                Bottom: new_Bottom
            }
        });
        this.Pr.TableCellMar.Left = new_Left;
        this.Pr.TableCellMar.Right = new_Right;
        this.Pr.TableCellMar.Top = new_Top;
        this.Pr.TableCellMar.Bottom = new_Bottom;
        this.Recalc_CompiledPr();
    },
    Get_TableCellMar: function () {
        var Pr = this.Get_CompiledPr(false).TablePr;
        return Pr.TableCellMar;
    },
    Set_TableAlign: function (Align) {
        if (undefined === Align) {
            if (undefined === this.Pr.Jc) {
                return;
            }
            History.Add(this, {
                Type: historyitem_Table_TableAlign,
                Old: this.Pr.Jc,
                New: undefined
            });
            this.Pr.Jc = undefined;
            this.Recalc_CompiledPr();
        } else {
            if (undefined === this.Pr.Jc) {
                History.Add(this, {
                    Type: historyitem_Table_TableAlign,
                    Old: undefined,
                    New: Align
                });
                this.Pr.Jc = Align;
                this.Recalc_CompiledPr();
            } else {
                if (Align != this.Pr.Jc) {
                    History.Add(this, {
                        Type: historyitem_Table_TableAlign,
                        Old: this.Pr.Jc,
                        New: Align
                    });
                    this.Pr.Jc = Align;
                    this.Recalc_CompiledPr();
                }
            }
        }
    },
    Get_TableAlign: function () {
        var Pr = this.Get_CompiledPr(false).TablePr;
        return Pr.Jc;
    },
    Set_TableInd: function (Ind) {
        if (undefined === Ind) {
            if (undefined === this.Pr.TableInd) {
                return;
            }
            History.Add(this, {
                Type: historyitem_Table_TableInd,
                Old: this.Pr.TableInd,
                New: undefined
            });
            this.Pr.TableInd = undefined;
            this.Recalc_CompiledPr();
        } else {
            if (undefined === this.Pr.TableInd) {
                History.Add(this, {
                    Type: historyitem_Table_TableInd,
                    Old: undefined,
                    New: Ind
                });
                this.Pr.TableInd = Ind;
                this.Recalc_CompiledPr();
            } else {
                if (Math.abs(this.Pr.TableInd - Ind) > 0.001) {
                    History.Add(this, {
                        Type: historyitem_Table_TableInd,
                        Old: this.Pr.TableInd,
                        New: Ind
                    });
                    this.Pr.TableInd = Ind;
                    this.Recalc_CompiledPr();
                }
            }
        }
    },
    Get_TableInd: function () {
        var Pr = this.Get_CompiledPr(false).TablePr;
        return Pr.TableInd;
    },
    Set_TableBorder_Left: function (Border) {
        this.Internal_Set_TableBorder(historyitem_Table_TableBorder_Left, this.Pr.TableBorders.Left, Border);
    },
    Set_TableBorder_Right: function (Border) {
        this.Internal_Set_TableBorder(historyitem_Table_TableBorder_Right, this.Pr.TableBorders.Right, Border);
    },
    Set_TableBorder_Top: function (Border) {
        this.Internal_Set_TableBorder(historyitem_Table_TableBorder_Top, this.Pr.TableBorders.Top, Border);
    },
    Set_TableBorder_Bottom: function (Border) {
        this.Internal_Set_TableBorder(historyitem_Table_TableBorder_Bottom, this.Pr.TableBorders.Bottom, Border);
    },
    Set_TableBorder_InsideH: function (Border) {
        this.Internal_Set_TableBorder(historyitem_Table_TableBorder_InsideH, this.Pr.TableBorders.InsideH, Border);
    },
    Set_TableBorder_InsideV: function (Border) {
        this.Internal_Set_TableBorder(historyitem_Table_TableBorder_InsideV, this.Pr.TableBorders.InsideV, Border);
    },
    Internal_Set_TableBorder: function (Type, Ptr, _Border) {
        if (undefined === _Border) {
            if (undefined === Ptr) {
                return;
            }
            History.Add(this, {
                Type: Type,
                Old: Border,
                New: undefined
            });
            switch (Type) {
            case historyitem_Table_TableBorder_Left:
                this.Pr.TableBorders.Left = undefined;
                break;
            case historyitem_Table_TableBorder_Right:
                this.Pr.TableBorders.Right = undefined;
                break;
            case historyitem_Table_TableBorder_Top:
                this.Pr.TableBorders.Top = undefined;
                break;
            case historyitem_Table_TableBorder_Bottom:
                this.Pr.TableBorders.Bottom = undefined;
                break;
            case historyitem_Table_TableBorder_InsideH:
                this.Pr.TableBorders.InsideH = undefined;
                break;
            case historyitem_Table_TableBorder_InsideV:
                this.Pr.TableBorders.InsideV = undefined;
                break;
            }
            this.Recalc_CompiledPr();
        } else {
            if (undefined === Ptr) {
                var Border = new CDocumentBorder();
                Border.Set_FromObject(_Border);
                History.Add(this, {
                    Type: Type,
                    Old: undefined,
                    New: Border
                });
                switch (Type) {
                case historyitem_Table_TableBorder_Left:
                    this.Pr.TableBorders.Left = Border;
                    break;
                case historyitem_Table_TableBorder_Right:
                    this.Pr.TableBorders.Right = Border;
                    break;
                case historyitem_Table_TableBorder_Top:
                    this.Pr.TableBorders.Top = Border;
                    break;
                case historyitem_Table_TableBorder_Bottom:
                    this.Pr.TableBorders.Bottom = Border;
                    break;
                case historyitem_Table_TableBorder_InsideH:
                    this.Pr.TableBorders.InsideH = Border;
                    break;
                case historyitem_Table_TableBorder_InsideV:
                    this.Pr.TableBorders.InsideV = Border;
                    break;
                }
                this.Recalc_CompiledPr();
            } else {
                var Border = new CDocumentBorder();
                Border.Set_FromObject(_Border);
                History.Add(this, {
                    Type: Type,
                    Old: Ptr,
                    New: Border
                });
                switch (Type) {
                case historyitem_Table_TableBorder_Left:
                    this.Pr.TableBorders.Left = Border;
                    break;
                case historyitem_Table_TableBorder_Right:
                    this.Pr.TableBorders.Right = Border;
                    break;
                case historyitem_Table_TableBorder_Top:
                    this.Pr.TableBorders.Top = Border;
                    break;
                case historyitem_Table_TableBorder_Bottom:
                    this.Pr.TableBorders.Bottom = Border;
                    break;
                case historyitem_Table_TableBorder_InsideH:
                    this.Pr.TableBorders.InsideH = Border;
                    break;
                case historyitem_Table_TableBorder_InsideV:
                    this.Pr.TableBorders.InsideV = Border;
                    break;
                }
                this.Recalc_CompiledPr();
            }
        }
    },
    Get_TableBorders: function () {
        var Pr = this.Get_CompiledPr(false).TablePr;
        return Pr.TableBorders;
    },
    Set_TableShd: function (Value, r, g, b) {
        if (undefined === Value) {
            if (undefined === this.Pr.Shd) {
                return;
            }
            History.Add(this, {
                Type: historyitem_Table_TableShd,
                Old: this.Pr.Shd,
                New: undefined
            });
            this.Pr.Shd = undefined;
            this.Recalc_CompiledPr();
        } else {
            if (undefined === this.Pr.Shd) {
                var Shd = new CDocumentShd();
                Shd.Value = Value;
                Shd.Color.Set(r, g, b);
                History.Add(this, {
                    Type: historyitem_Table_TableShd,
                    Old: undefined,
                    New: Shd
                });
                this.Pr.Shd = Shd;
                this.Recalc_CompiledPr();
            } else {
                var Shd = new CDocumentShd();
                Shd.Value = Value;
                Shd.Color.Set(r, g, b);
                History.Add(this, {
                    Type: historyitem_Table_TableShd,
                    Old: this.Pr.Shd,
                    New: Shd
                });
                this.Pr.Shd = Shd;
                this.Recalc_CompiledPr();
            }
        }
    },
    Get_Shd: function () {
        var Pr = this.Get_CompiledPr(false).TablePr;
        return Pr.Shd;
    },
    Get_Borders: function () {
        return this.Get_TableBorders();
    },
    Internal_CheckMerge: function () {
        var bCanMerge = true;
        var Grid_start = -1;
        var Grid_end = -1;
        var RowsInfo = new Array();
        for (var Index = 0; Index < this.Selection.Data.length; Index++) {
            var Pos = this.Selection.Data[Index];
            var Row = this.Content[Pos.Row];
            var Cell = Row.Get_Cell(Pos.Cell);
            var StartGridCol = Row.Get_CellInfo(Pos.Cell).StartGridCol;
            var EndGridCol = StartGridCol + Cell.Get_GridSpan() - 1;
            var VMergeCount = this.Internal_GetVertMergeCount(Pos.Row, Row.Get_CellInfo(Pos.Cell).StartGridCol, Cell.Get_GridSpan());
            for (var RowIndex = Pos.Row; RowIndex <= Pos.Row + VMergeCount - 1; RowIndex++) {
                if ("undefined" === typeof(RowsInfo[RowIndex])) {
                    RowsInfo[RowIndex] = {
                        Grid_start: StartGridCol,
                        Grid_end: EndGridCol
                    };
                } else {
                    if (StartGridCol < RowsInfo[RowIndex].Grid_start) {
                        RowsInfo[RowIndex].Grid_start = StartGridCol;
                    }
                    if (EndGridCol > RowsInfo[RowIndex].Grid_end) {
                        RowsInfo[RowIndex].Grid_end = EndGridCol;
                    }
                }
            }
        }
        for (var Index in RowsInfo) {
            if (-1 === Grid_start) {
                Grid_start = RowsInfo[Index].Grid_start;
            } else {
                if (Grid_start != RowsInfo[Index].Grid_start) {
                    bCanMerge = false;
                    break;
                }
            }
            if (-1 === Grid_end) {
                Grid_end = RowsInfo[Index].Grid_end;
            } else {
                if (Grid_end != RowsInfo[Index].Grid_end) {
                    bCanMerge = false;
                    break;
                }
            }
        }
        if (true === bCanMerge) {
            var TopRow = -1;
            var BotRow = -1;
            for (var GridIndex = Grid_start; GridIndex <= Grid_end; GridIndex++) {
                var Pos_top = null;
                var Pos_bot = null;
                for (var Index = 0; Index < this.Selection.Data.length; Index++) {
                    var Pos = this.Selection.Data[Index];
                    var Row = this.Content[Pos.Row];
                    var Cell = Row.Get_Cell(Pos.Cell);
                    var StartGridCol = Row.Get_CellInfo(Pos.Cell).StartGridCol;
                    var EndGridCol = StartGridCol + Cell.Get_GridSpan() - 1;
                    if (GridIndex >= StartGridCol && GridIndex <= EndGridCol) {
                        if (null === Pos_top || Pos_top.Row > Pos.Row) {
                            Pos_top = Pos;
                        }
                        if (null === Pos_bot || Pos_bot.Row < Pos.Row) {
                            Pos_bot = Pos;
                        }
                    }
                }
                if (null === Pos_top || null === Pos_bot) {
                    bCanMerge = false;
                    break;
                }
                if (-1 === TopRow) {
                    TopRow = Pos_top.Row;
                } else {
                    if (TopRow != Pos_top.Row) {
                        bCanMerge = false;
                        break;
                    }
                }
                var Row = this.Content[Pos_bot.Row];
                var Cell = Row.Get_Cell(Pos_bot.Cell);
                var VMergeCount = this.Internal_GetVertMergeCount(Pos_bot.Row, Row.Get_CellInfo(Pos_bot.Cell).StartGridCol, Cell.Get_GridSpan());
                var CurBotRow = Pos_bot.Row + VMergeCount - 1;
                if (-1 === BotRow) {
                    BotRow = CurBotRow;
                } else {
                    if (BotRow != CurBotRow) {
                        bCanMerge = false;
                        break;
                    }
                }
            }
            if (true === bCanMerge) {
                for (var RowIndex = TopRow; RowIndex <= BotRow; RowIndex++) {
                    var Row = this.Content[RowIndex];
                    var Grid_before = Row.Get_Before().GridBefore;
                    var Grid_after = Row.Get_After().GridAfter;
                    if (Grid_after <= 0 && Grid_before <= 0) {
                        continue;
                    }
                    if (Grid_start < Grid_before) {
                        bCanMerge = false;
                        break;
                    }
                    var Cell = Row.Get_Cell(Row.Get_CellsCount() - 1);
                    var Row_grid_end = Cell.Get_GridSpan() - 1 + Row.Get_CellInfo(Row.Get_CellsCount() - 1).StartGridCol;
                    if (Grid_end > Row_grid_end) {
                        bCanMerge = false;
                        break;
                    }
                }
            }
        }
        return {
            Grid_start: Grid_start,
            Grid_end: Grid_end,
            RowsInfo: RowsInfo,
            bCanMerge: bCanMerge
        };
    },
    Cell_Merge: function () {
        var bApplyToInnerTable = false;
        if (false === this.Selection.Use || (true === this.Selection.Use && table_Selection_Text === this.Selection.Type)) {
            bApplyToInnerTable = this.CurCell.Content.Table_MergeCells();
        }
        if (true === bApplyToInnerTable) {
            return;
        }
        if (true != this.Selection.Use || table_Selection_Cell != this.Selection.Type || this.Selection.Data.length <= 1) {
            return;
        }
        var bCanMerge = true;
        var Grid_start = -1;
        var Grid_end = -1;
        var RowsInfo = new Array();
        var Temp = this.Internal_CheckMerge();
        bCanMerge = Temp.bCanMerge;
        Grid_start = Temp.Grid_start;
        Grid_end = Temp.Grid_end;
        RowsInfo = Temp.RowsInfo;
        if (false === bCanMerge) {
            return;
        }
        var Pos_tl = this.Selection.Data[0];
        var Cell_tl = this.Content[Pos_tl.Row].Get_Cell(Pos_tl.Cell);
        for (var Index = 0; Index < this.Selection.Data.length; Index++) {
            var Pos = this.Selection.Data[Index];
            var Row = this.Content[Pos.Row];
            var Cell = Row.Get_Cell(Pos.Cell);
            if (0 != Index) {
                Cell_tl.Content_Merge(Cell.Content);
                Cell.Content.Clear_Content();
            }
        }
        for (var RowIndex in RowsInfo) {
            var Row = this.Content[RowIndex];
            for (var CellIndex = 0; CellIndex < Row.Get_CellsCount(); CellIndex++) {
                var Cell_grid_start = Row.Get_CellInfo(CellIndex).StartGridCol;
                if (Grid_start === Cell_grid_start) {
                    if (RowIndex != Pos_tl.Row) {
                        var Cell = Row.Get_Cell(CellIndex);
                        Cell.Set_GridSpan(Grid_end - Grid_start + 1);
                        Cell.Set_VMerge(vmerge_Continue);
                    } else {
                        Cell_tl.Set_GridSpan(Grid_end - Grid_start + 1);
                    }
                } else {
                    if (Cell_grid_start > Grid_start && Cell_grid_start <= Grid_end) {
                        Row.Remove_Cell(CellIndex);
                        CellIndex--;
                    } else {
                        if (Cell_grid_start > Grid_end) {
                            break;
                        }
                    }
                }
            }
        }
        this.Internal_Check_TableRows(true);
        var PageNum = 0;
        for (PageNum = 0; PageNum < this.Pages.length - 1; PageNum++) {
            if (Pos_tl.Row <= this.Pages[PageNum + 1].FirstRow) {
                break;
            }
        }
        this.Internal_Recalculate_1();
        this.Selection.Use = true;
        this.Selection.StartPos.Pos = Pos_tl;
        this.Selection.EndPos.Pos = Pos_tl;
        this.Selection.Type = table_Selection_Cell;
        this.Selection.Data = [Pos_tl];
        this.CurCell = Cell_tl;
    },
    Cell_Split: function (Rows, Cols) {
        var bApplyToInnerTable = false;
        if (false === this.Selection.Use || (true === this.Selection.Use && table_Selection_Text === this.Selection.Type)) {
            bApplyToInnerTable = this.CurCell.Content.Table_SplitCell(Cols, Rows);
        }
        if (true === bApplyToInnerTable) {
            return true;
        }
        if (! (false === this.Selection.Use || (true === this.Selection.Use && (table_Selection_Text === this.Selection.Type || (table_Selection_Cell === this.Selection.Type && 1 === this.Selection.Data.length))))) {
            return false;
        }
        var Cell_pos = null;
        var Cell = null;
        if (false === this.Selection.Use || (true === this.Selection.Use && table_Selection_Text === this.Selection.Type)) {
            Cell = this.CurCell;
            Cell_pos = {
                Cell: Cell.Index,
                Row: Cell.Row.Index
            };
        } else {
            Cell_pos = this.Selection.Data[0];
            Cell = this.Content[Cell_pos.Row].Get_Cell(Cell_pos.Cell);
        }
        var Row = this.Content[Cell_pos.Row];
        var Grid_start = Row.Get_CellInfo(Cell_pos.Cell).StartGridCol;
        var Grid_span = Cell.Get_GridSpan();
        var VMerge_count = this.Internal_GetVertMergeCount(Cell_pos.Row, Grid_start, Grid_span);
        if (VMerge_count > 1) {
            if (Rows > VMerge_count) {
                var ErrData = new CErrorData();
                ErrData.put_Value(VMerge_count);
                editor.asc_fireCallback("asc_onError", c_oAscError.ID.SplitCellMaxRows, c_oAscError.Level.NoCritical, ErrData);
                return false;
            } else {
                if (0 != VMerge_count % Rows) {
                    var ErrData = new CErrorData();
                    ErrData.put_Value(VMerge_count);
                    editor.asc_fireCallback("asc_onError", c_oAscError.ID.SplitCellRowsDivider, c_oAscError.Level.NoCritical, ErrData);
                    return false;
                }
            }
        }
        if (Cols > 1) {
            var Sum_before = this.TableSumGrid[Grid_start - 1];
            var Sum_with = this.TableSumGrid[Grid_start + Grid_span - 1];
            var Span_width = Sum_with - Sum_before;
            var Grid_width = Span_width / Cols;
            var CellSpacing = Row.Get_CellSpacing();
            var CellMar = Cell.Get_Margins();
            var MinW = CellSpacing + CellMar.Right.W + CellMar.Left.W;
            if (Grid_width < MinW) {
                var MaxCols = Math.floor(Span_width / MinW);
                var ErrData = new CErrorData();
                ErrData.put_Value(MaxCols);
                editor.asc_fireCallback("asc_onError", c_oAscError.ID.SplitCellMaxCols, c_oAscError.Level.NoCritical, ErrData);
                return false;
            }
        }
        var Cells = new Array();
        var Cells_pos = new Array();
        var Rows_ = new Array();
        if (Rows <= 1) {
            for (var Index = 0; Index < VMerge_count; Index++) {
                var TempRow = this.Content[Cell_pos.Row + Index];
                Rows_[Index] = TempRow;
                Cells[Index] = null;
                Cells_pos[Index] = null;
                var CellsCount = TempRow.Get_CellsCount();
                for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                    var StartGridCol = TempRow.Get_CellInfo(CurCell).StartGridCol;
                    if (StartGridCol === Grid_start) {
                        Cells[Index] = TempRow.Get_Cell(CurCell);
                        Cells_pos[Index] = {
                            Row: Cell_pos.Row + Index,
                            Cell: CurCell
                        };
                    }
                }
            }
        } else {
            if (VMerge_count > 1) {
                var New_VMerge_Count = VMerge_count / Rows;
                for (var Index = 0; Index < VMerge_count; Index++) {
                    var TempRow = this.Content[Cell_pos.Row + Index];
                    Rows_[Index] = TempRow;
                    Cells[Index] = null;
                    Cells_pos[Index] = null;
                    var CellsCount = TempRow.Get_CellsCount();
                    for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                        var StartGridCol = TempRow.Get_CellInfo(CurCell).StartGridCol;
                        if (StartGridCol === Grid_start) {
                            var TempCell = TempRow.Get_Cell(CurCell);
                            Cells[Index] = TempCell;
                            Cells_pos[Index] = {
                                Row: Cell_pos.Row + Index,
                                Cell: CurCell
                            };
                            if (0 === Index % New_VMerge_Count) {
                                TempCell.Set_VMerge(vmerge_Restart);
                            } else {
                                TempCell.Set_VMerge(vmerge_Continue);
                            }
                        }
                    }
                }
            } else {
                Rows_[0] = Row;
                Cells[0] = Cell;
                Cells_pos[0] = Cell_pos;
                var CellsCount = Row.Get_CellsCount();
                for (var Index = 1; Index < Rows; Index++) {
                    var NewRow = this.Internal_Add_Row(Cell_pos.Row + Index, CellsCount);
                    NewRow.Copy_Pr(Row.Pr);
                    Rows_[Index] = NewRow;
                    Cells[Index] = null;
                    Cells_pos[Index] = null;
                    for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                        var New_Cell = NewRow.Get_Cell(CurCell);
                        var Old_Cell = Row.Get_Cell(CurCell);
                        New_Cell.Copy_Pr(Old_Cell.Pr);
                        if (CurCell === Cell_pos.Cell) {
                            Cells[Index] = New_Cell;
                            Cells_pos[Index] = {
                                Row: Cell_pos.Row + Index,
                                Cell: CurCell
                            };
                        } else {
                            New_Cell.Set_VMerge(vmerge_Continue);
                        }
                    }
                }
            }
        }
        if (Cols > 1) {
            var Sum_before = this.TableSumGrid[Grid_start - 1];
            var Sum_with = this.TableSumGrid[Grid_start + Grid_span - 1];
            var Span_width = Sum_with - Sum_before;
            var Grid_width = Span_width / Cols;
            var Grid_Info = new Array();
            for (var Index = 0; Index < this.TableGridCalc.length; Index++) {
                Grid_Info[Index] = 0;
            }
            var Grid_Info_new = Array();
            for (var Index = 0; Index < Cols; Index++) {
                Grid_Info_new[Index] = 1;
            }
            var Grid_Info_start = Array();
            for (var Index = 0; Index < this.TableGridCalc.length; Index++) {
                Grid_Info_start[Index] = this.TableGridCalc[Index];
            }
            var NewCol_Index = 0;
            var CurWidth = Sum_before + Grid_width;
            for (var Grid_index = Grid_start; Grid_index < Grid_start + Grid_span; Grid_index++) {
                var bNewCol = true;
                if (Math.abs(CurWidth - this.TableSumGrid[Grid_index]) < 0.001) {
                    NewCol_Index++;
                    CurWidth += Grid_width;
                    bNewCol = false;
                    continue;
                }
                while (CurWidth < this.TableSumGrid[Grid_index]) {
                    if (0 === Grid_Info[Grid_index]) {
                        Grid_Info_start[Grid_index] = CurWidth - this.TableSumGrid[Grid_index - 1];
                    }
                    Grid_Info[Grid_index] += 1;
                    NewCol_Index++;
                    CurWidth += Grid_width;
                    if (Math.abs(CurWidth - this.TableSumGrid[Grid_index]) < 0.001) {
                        NewCol_Index++;
                        CurWidth += Grid_width;
                        bNewCol = false;
                        break;
                    }
                }
                if (true === bNewCol) {
                    Grid_Info_new[NewCol_Index] += 1;
                }
            }
            for (var Index2 = 0; Index2 < Rows_.length; Index2++) {
                if (null != Cells[Index2] && null != Cells_pos[Index2]) {
                    var TempRow = Rows_[Index2];
                    var TempCell = Cells[Index2];
                    var TempCell_pos = Cells_pos[Index2];
                    TempCell.Set_GridSpan(Grid_Info_new[0]);
                    TempCell.Set_W(new CTableMeasurement(tblwidth_Mm, Grid_width));
                    for (var Index = 1; Index < Cols; Index++) {
                        var NewCell = TempRow.Add_Cell(TempCell_pos.Cell + Index, TempRow, null, false);
                        NewCell.Copy_Pr(TempCell.Pr);
                        NewCell.Set_GridSpan(Grid_Info_new[Index]);
                        NewCell.Set_W(new CTableMeasurement(tblwidth_Mm, Grid_width));
                    }
                }
            }
            var TableGrid_old = new Array();
            for (var Index = 0; Index < this.TableGrid.length; Index++) {
                TableGrid_old[Index] = this.TableGrid[Index];
            }
            var OldTableGridLen = this.TableGridCalc.length;
            for (var Index = OldTableGridLen - 1; Index >= 0; Index--) {
                var Summary = this.TableGridCalc[Index];
                if (Grid_Info[Index] > 0) {
                    this.TableGrid[Index] = Grid_Info_start[Index];
                    Summary -= Grid_Info_start[Index] - Grid_width;
                    for (var NewIndex = 0; NewIndex < Grid_Info[Index]; NewIndex++) {
                        Summary -= Grid_width;
                        if (NewIndex != Grid_Info[Index] - 1) {
                            this.TableGrid.splice(Index + NewIndex + 1, 0, Grid_width);
                        } else {
                            this.TableGrid.splice(Index + NewIndex + 1, 0, Summary);
                        }
                    }
                }
            }
            History.Add(this, {
                Type: historyitem_Table_TableGrid,
                Old: TableGrid_old,
                New: this.TableGrid
            });
            for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
                if (CurRow >= Cells_pos[0].Row && CurRow <= Cells_pos[Cells_pos.length - 1].Row) {
                    continue;
                }
                var TempRow = this.Content[CurRow];
                var GridBefore = TempRow.Get_Before().GridBefore;
                var GridAfter = TempRow.Get_After().GridAfter;
                if (GridBefore > 0) {
                    var SummaryGridSpan = GridBefore;
                    for (var CurGrid = 0; CurGrid < GridBefore; CurGrid++) {
                        SummaryGridSpan += Grid_Info[CurGrid];
                    }
                    TempRow.Set_Before(SummaryGridSpan);
                }
                var LastGrid = 0;
                for (var CurCell = 0; CurCell < TempRow.Get_CellsCount(); CurCell++) {
                    var TempCell = TempRow.Get_Cell(CurCell);
                    var TempGridSpan = TempCell.Get_GridSpan();
                    var TempStartGrid = TempRow.Get_CellInfo(CurCell).StartGridCol;
                    var SummaryGridSpan = TempGridSpan;
                    LastGrid = TempStartGrid + TempGridSpan;
                    for (var CurGrid = TempStartGrid; CurGrid < TempStartGrid + TempGridSpan; CurGrid++) {
                        SummaryGridSpan += Grid_Info[CurGrid];
                    }
                    TempCell.Set_GridSpan(SummaryGridSpan);
                }
                if (GridAfter > 0) {
                    var SummaryGridSpan = GridAfter;
                    for (var CurGrid = LastGrid; CurGrid < OldTableGridLen; CurGrid++) {
                        SummaryGridSpan += Grid_Info[CurGrid];
                    }
                    TempRow.Set_After(SummaryGridSpan);
                }
            }
        }
        this.Internal_RecalculateGrid();
        this.Internal_Recalculate_1();
        return true;
    },
    Row_Add: function (bBefore) {
        if ("undefined" === typeof(bBefore)) {
            bBefore = true;
        }
        var bApplyToInnerTable = false;
        if (false === this.Selection.Use || (true === this.Selection.Use && table_Selection_Text === this.Selection.Type)) {
            bApplyToInnerTable = this.CurCell.Content.Table_AddRow(bBefore);
        }
        if (true === bApplyToInnerTable) {
            return;
        }
        var Cells_pos = new Array();
        var Count = 1;
        var RowId = 0;
        if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
            Cells_pos = this.Selection.Data;
            var Prev_row = -1;
            Count = 0;
            for (var Index = 0; Index < this.Selection.Data.length; Index++) {
                if (Prev_row != this.Selection.Data[Index].Row) {
                    Count++;
                    Prev_row = this.Selection.Data[Index].Row;
                }
            }
        } else {
            Cells_pos[0] = {
                Row: this.CurCell.Row.Index,
                Cell: this.CurCell.Index
            };
            Count = 1;
        }
        if (Cells_pos.length <= 0) {
            return;
        }
        if (true === bBefore) {
            RowId = Cells_pos[0].Row;
        } else {
            RowId = Cells_pos[Cells_pos.length - 1].Row;
        }
        var Row = this.Content[RowId];
        var CellsCount = Row.Get_CellsCount();
        var Cells_info = new Array();
        for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
            var Cell = Row.Get_Cell(CurCell);
            var Cell_info = Row.Get_CellInfo(CurCell);
            var Cell_grid_start = Cell_info.StartGridCol;
            var Cell_grid_span = Cell.Get_GridSpan();
            var VMerge_count_before = this.Internal_GetVertMergeCount2(RowId, Cell_grid_start, Cell_grid_span);
            var VMerge_count_after = this.Internal_GetVertMergeCount(RowId, Cell_grid_start, Cell_grid_span);
            Cells_info[CurCell] = {
                VMerge_count_before: VMerge_count_before,
                VMerge_count_after: VMerge_count_after
            };
        }
        var CellSpacing = this.Content[0].Get_CellSpacing();
        for (var Index = 0; Index < Count; Index++) {
            var New_Row = null;
            if (true === bBefore) {
                New_Row = this.Internal_Add_Row(RowId, CellsCount, true);
            } else {
                New_Row = this.Internal_Add_Row(RowId + 1, CellsCount, true);
            }
            New_Row.Copy_Pr(Row.Pr);
            New_Row.Set_CellSpacing(CellSpacing);
            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                var New_Cell = New_Row.Get_Cell(CurCell);
                var Old_Cell = Row.Get_Cell(CurCell);
                New_Cell.Copy_Pr(Old_Cell.Pr);
                if (true === bBefore) {
                    if (Cells_info[CurCell].VMerge_count_before > 1) {
                        New_Cell.Set_VMerge(vmerge_Continue);
                    } else {
                        New_Cell.Set_VMerge(vmerge_Restart);
                    }
                } else {
                    if (Cells_info[CurCell].VMerge_count_after > 1) {
                        New_Cell.Set_VMerge(vmerge_Continue);
                    } else {
                        New_Cell.Set_VMerge(vmerge_Restart);
                    }
                }
            }
        }
        this.Selection.Use = true;
        if (null != this.Selection.Data) {
            this.Selection.Data.length = 0;
        } else {
            this.Selection.Data = new Array();
        }
        this.Selection.Use = true;
        this.Selection.Type = table_Selection_Cell;
        var StartRow = (true === bBefore ? RowId : RowId + 1);
        for (var Index = 0; Index < Count; Index++) {
            var Row = this.Content[StartRow + Index];
            var CellsCount = Row.Get_CellsCount();
            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                var Cell = Row.Get_Cell(CurCell);
                if (vmerge_Continue === Cell.Get_VMerge()) {
                    continue;
                }
                this.Selection.Data.push({
                    Row: StartRow + Index,
                    Cell: CurCell
                });
            }
        }
        this.Internal_Recalculate_1();
    },
    Row_Remove: function (Ind) {
        var bApplyToInnerTable = false;
        if (false === this.Selection.Use || (true === this.Selection.Use && table_Selection_Text === this.Selection.Type)) {
            bApplyToInnerTable = this.CurCell.Content.Table_RemoveRow(Ind);
        }
        if (true === bApplyToInnerTable) {
            return true;
        }
        var Rows_to_delete = new Array();
        if ("undefined" === typeof(Ind) || null === Ind) {
            if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
                var Counter = 0;
                var PrevRow = -1;
                for (var Index = 0; Index < this.Selection.Data.length; Index++) {
                    var CurPos = this.Selection.Data[Index];
                    if (CurPos.Row != PrevRow) {
                        Rows_to_delete[Counter++] = CurPos.Row;
                    }
                    PrevRow = CurPos.Row;
                }
            } else {
                Rows_to_delete[0] = this.CurCell.Row.Index;
            }
        } else {
            Rows_to_delete[0] = Ind;
        }
        if (Rows_to_delete.length <= 0) {
            return;
        }
        var FirstRow_to_delete = Rows_to_delete[0];
        var CurRow = Rows_to_delete[Rows_to_delete.length - 1] + 1;
        if (CurRow < this.Content.length) {
            var Row = this.Content[CurRow];
            var CellsCount = Row.Get_CellsCount();
            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                var Cell = Row.Get_Cell(CurCell);
                var VMerge = Cell.Get_VMerge();
                if (vmerge_Continue != VMerge) {
                    continue;
                }
                var VMerge_count = this.Internal_GetVertMergeCount2(CurRow, Row.Get_CellInfo(CurCell).StartGridCol, Cell.Get_GridSpan());
                if (CurRow - (VMerge_count - 1) >= FirstRow_to_delete) {
                    Cell.Set_VMerge(vmerge_Restart);
                }
            }
        }
        for (var Index = Rows_to_delete.length - 1; Index >= 0; Index--) {
            this.Internal_Remove_Row(Rows_to_delete[Index]);
        }
        this.Selection_Remove();
        this.DrawingDocument.TargetStart();
        this.DrawingDocument.TargetShow();
        this.DrawingDocument.SelectEnabled(false);
        if (this.Content.length <= 0) {
            return false;
        }
        var CurRow = Math.min(Rows_to_delete[0], this.Content.length - 1);
        var Row = this.Content[CurRow];
        this.CurCell = Row.Get_Cell(0);
        this.CurCell.Content.Cursor_MoveToStartPos();
        var PageNum = 0;
        for (PageNum = 0; PageNum < this.Pages.length - 1; PageNum++) {
            if (CurRow <= this.Pages[PageNum + 1].FirstRow) {
                break;
            }
        }
        this.Markup.Internal.RowIndex = CurRow;
        this.Markup.Internal.CellIndex = 0;
        this.Markup.Internal.PageNum = PageNum;
        this.Internal_Recalculate_1();
        return true;
    },
    Row_Remove2: function () {
        if (false == this.Selection.Use || table_Selection_Text == this.Selection.Type) {
            return true;
        }
        var Rows_to_delete = new Array();
        for (var Index = 0; Index < this.Content.length; Index++) {
            Rows_to_delete[Index] = 0;
        }
        for (var Index = 0; Index < this.Selection.Data.length; Index++) {
            var Pos = this.Selection.Data[Index];
            if (0 == Rows_to_delete[Pos.Row]) {}
            Rows_to_delete[Pos.Row] = 1;
        }
        for (var Index = this.Content.length - 1; Index >= 0; Index--) {
            if (0 != Rows_to_delete[Index]) {
                this.Internal_Remove_Row(Index);
            }
        }
        if (this.Content.length <= 0) {
            return false;
        }
        if (this.CurCell.Row.Index >= this.Content.length) {
            this.CurCell = this.Content[this.Content.length - 1].Get_Cell(0);
        }
        this.Selection_Remove();
        return true;
    },
    Col_Remove: function () {
        var bApplyToInnerTable = false;
        if (false === this.Selection.Use || (true === this.Selection.Use && table_Selection_Text === this.Selection.Type)) {
            bApplyToInnerTable = this.CurCell.Content.Table_RemoveCol();
        }
        if (true === bApplyToInnerTable) {
            return true;
        }
        var Cells_pos = new Array();
        if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
            Cells_pos = this.Selection.Data;
        } else {
            Cells_pos[0] = {
                Row: this.CurCell.Row.Index,
                Cell: this.CurCell.Index
            };
        }
        if (Cells_pos.length <= 0) {
            return;
        }
        var Grid_start = -1;
        var Grid_end = -1;
        for (var Index = 0; Index < Cells_pos.length; Index++) {
            var Row = this.Content[Cells_pos[Index].Row];
            var Cell = Row.Get_Cell(Cells_pos[Index].Cell);
            var Cur_Grid_start = Row.Get_CellInfo(Cells_pos[Index].Cell).StartGridCol;
            var Cur_Grid_end = Cur_Grid_start + Cell.Get_GridSpan() - 1;
            if (-1 === Grid_start || (-1 != Grid_start && Grid_start > Cur_Grid_start)) {
                Grid_start = Cur_Grid_start;
            }
            if (-1 === Grid_end || (-1 != Grid_end && Grid_end < Cur_Grid_end)) {
                Grid_end = Cur_Grid_end;
            }
        }
        var Delete_info = new Array();
        var Rows_info = new Array();
        for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
            Delete_info[CurRow] = new Array();
            Rows_info[CurRow] = new Array();
            var Row = this.Content[CurRow];
            var Before_Info = Row.Get_Before();
            if (Before_Info.GridBefore > 0) {
                Rows_info[CurRow].push({
                    W: this.TableSumGrid[Before_Info.GridBefore - 1],
                    Type: -1,
                    GridSpan: 1
                });
            }
            var CellsCount = Row.Get_CellsCount();
            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                var Cell = Row.Get_Cell(CurCell);
                var Cur_Grid_start = Row.Get_CellInfo(CurCell).StartGridCol;
                var Cur_Grid_end = Cur_Grid_start + Cell.Get_GridSpan() - 1;
                if (Cur_Grid_start <= Grid_end && Cur_Grid_end >= Grid_start) {
                    Delete_info[CurRow].push(CurCell);
                } else {
                    var W = this.TableSumGrid[Cur_Grid_end] - this.TableSumGrid[Cur_Grid_start - 1];
                    Rows_info[CurRow].push({
                        W: W,
                        Type: 0,
                        GridSpan: 1
                    });
                }
            }
        }
        for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
            var Row = this.Content[CurRow];
            for (var Index = Delete_info[CurRow].length - 1; Index >= 0; Index--) {
                var CurCell = Delete_info[CurRow][Index];
                Row.Remove_Cell(CurCell);
            }
        }
        for (var CurRow = this.Content.length - 1; CurRow >= 0; CurRow--) {
            var bRemove = true;
            for (var Index = 0; Index < Rows_info[CurRow].length; Index++) {
                if (0 === Rows_info[CurRow][Index].Type) {
                    bRemove = false;
                    break;
                }
            }
            if (true === bRemove) {
                this.Internal_Remove_Row(CurRow);
                Rows_info.splice(CurRow, 1);
            }
        }
        this.DrawingDocument.TargetStart();
        this.DrawingDocument.TargetShow();
        this.DrawingDocument.SelectEnabled(false);
        if (this.Content.length <= 0) {
            return false;
        }
        this.Internal_CreateNewGrid(Rows_info);
        for (var CurRow = this.Content.length - 1; CurRow >= 0; CurRow--) {
            var bRemove = true;
            var Row = this.Content[CurRow];
            var CellsCount = Row.Get_CellsCount();
            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                var Cell = Row.Get_Cell(CurCell);
                if (vmerge_Continue != Cell.Get_VMerge()) {
                    bRemove = false;
                    break;
                }
            }
            if (true === bRemove) {
                this.Internal_Remove_Row(CurRow);
            }
        }
        var CurRow = 0;
        var Row = this.Content[CurRow];
        var CellsCount = Row.Get_CellsCount();
        var CurCell = Math.min(Delete_info[0][0], CellsCount - 1);
        this.CurCell = Row.Get_Cell(CurCell);
        this.CurCell.Content.Cursor_MoveToStartPos();
        var PageNum = 0;
        this.Markup.Internal.RowIndex = CurRow;
        this.Markup.Internal.CellIndex = CurCell;
        this.Markup.Internal.PageNum = PageNum;
        this.Selection.Use = false;
        this.Selection.Start = false;
        this.Selection.StartPos.Pos = {
            Row: CurRow,
            Cell: CurCell
        };
        this.Selection.EndPos.Pos = {
            Row: CurRow,
            Cell: CurCell
        };
        this.Selection.CurRow = CurRow;
        this.Internal_RecalculateGrid();
        this.Internal_Recalculate_1();
        return true;
    },
    Col_Add: function (bBefore) {
        if ("undefined" === typeof(bBefore)) {
            bBefore = true;
        }
        var bApplyToInnerTable = false;
        if (false === this.Selection.Use || (true === this.Selection.Use && table_Selection_Text === this.Selection.Type)) {
            bApplyToInnerTable = this.CurCell.Content.Table_AddCol(bBefore);
        }
        if (true === bApplyToInnerTable) {
            return;
        }
        var Cells_pos = new Array();
        var Count = 1;
        var Width = 0;
        if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
            Cells_pos = this.Selection.Data;
            var Prev_row = -1;
            Count = 0;
            for (var Index = 0; Index < this.Selection.Data.length; Index++) {
                if (-1 != Prev_row) {
                    if (Prev_row === this.Selection.Data[Index].Row) {
                        Count++;
                    } else {
                        break;
                    }
                } else {
                    Count++;
                    Prev_row = this.Selection.Data[Index].Row;
                }
            }
        } else {
            Cells_pos[0] = {
                Row: this.CurCell.Row.Index,
                Cell: this.CurCell.Index
            };
            Count = 1;
        }
        if (Cells_pos.length <= 0) {
            return;
        }
        if (true === bBefore) {
            var FirstCell_Grid_start = this.Content[Cells_pos[0].Row].Get_CellInfo(Cells_pos[0].Cell).StartGridCol;
            var FirstCell_Grid_end = FirstCell_Grid_start + this.Content[Cells_pos[0].Row].Get_Cell(Cells_pos[0].Cell).Get_GridSpan() - 1;
            Width = this.TableSumGrid[FirstCell_Grid_end] - this.TableSumGrid[FirstCell_Grid_start - 1];
        } else {
            var LastPos = Cells_pos.length - 1;
            var LastCell_Grid_start = this.Content[Cells_pos[LastPos].Row].Get_CellInfo(Cells_pos[LastPos].Cell).StartGridCol;
            var LastCell_Grid_end = LastCell_Grid_start + this.Content[Cells_pos[LastPos].Row].Get_Cell(Cells_pos[LastPos].Cell).Get_GridSpan() - 1;
            Width = this.TableSumGrid[LastCell_Grid_end] - this.TableSumGrid[LastCell_Grid_start - 1];
        }
        var Rows_info = new Array();
        var Add_info = new Array();
        if (true === bBefore) {
            var Grid_start = -1;
            for (var Index = 0; Index < Cells_pos.length; Index++) {
                var Row = this.Content[Cells_pos[Index].Row];
                var Cell = Row.Get_Cell(Cells_pos[Index].Cell);
                var Cur_Grid_start = Row.Get_CellInfo(Cells_pos[Index].Cell).StartGridCol;
                if (-1 === Grid_start || (-1 != Grid_start && Grid_start > Cur_Grid_start)) {
                    Grid_start = Cur_Grid_start;
                }
            }
            for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
                var Row = this.Content[CurRow];
                Rows_info[CurRow] = new Array();
                Add_info[CurRow] = 0;
                var Before_Info = Row.Get_Before();
                if (Before_Info.GridBefore > 0) {
                    Rows_info[CurRow].push({
                        W: this.TableSumGrid[Before_Info.GridBefore - 1],
                        Type: -1,
                        GridSpan: 1
                    });
                }
                var CellsCount = Row.Get_CellsCount();
                for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                    var Cell = Row.Get_Cell(CurCell);
                    var Cur_Grid_start = Row.Get_CellInfo(CurCell).StartGridCol;
                    var Cur_Grid_end = Cur_Grid_start + Cell.Get_GridSpan() - 1;
                    if (Cur_Grid_start <= Grid_start) {
                        Add_info[CurRow] = CurCell;
                    }
                    var W = this.TableSumGrid[Cur_Grid_end] - this.TableSumGrid[Cur_Grid_start - 1];
                    Rows_info[CurRow].push({
                        W: W,
                        Type: 0,
                        GridSpan: 1
                    });
                }
                var After_Info = Row.Get_After();
                if (After_Info.GridAfter > 0) {
                    if (Row.Get_CellInfo(CellsCount - 1).StartGridCol + Row.Get_Cell(CellsCount - 1).Get_GridSpan() <= Grid_start) {
                        Add_info[CurRow] = CellsCount;
                    }
                }
            }
            for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
                var Row = this.Content[CurRow];
                var bBefore2 = false;
                if (Rows_info.length > 0 && Rows_info[CurRow][0].Type === -1) {
                    bBefore2 = true;
                }
                for (var Index = 0; Index < Count; Index++) {
                    var NewCell = Row.Add_Cell(Add_info[CurRow], Row, null, false);
                    var NextCell = (Add_info[CurRow] >= Row.Get_CellsCount() - 1 ? Row.Get_Cell(Add_info[CurRow] - 1) : Row.Get_Cell(Add_info[CurRow] + 1));
                    NewCell.Copy_Pr(NextCell.Pr, true);
                    if (false === bBefore2) {
                        Rows_info[CurRow].splice(Add_info[CurRow], 0, {
                            W: Width,
                            Type: 0,
                            GridSpan: 1
                        });
                    } else {
                        Rows_info[CurRow].splice(Add_info[CurRow] + 1, 0, {
                            W: Width,
                            Type: 0,
                            GridSpan: 1
                        });
                    }
                }
            }
        } else {
            var Grid_end = -1;
            for (var Index = 0; Index < Cells_pos.length; Index++) {
                var Row = this.Content[Cells_pos[Index].Row];
                var Cell = Row.Get_Cell(Cells_pos[Index].Cell);
                var Cur_Grid_start = Row.Get_CellInfo(Cells_pos[Index].Cell).StartGridCol;
                var Cur_Grid_end = Cur_Grid_start + Cell.Get_GridSpan() - 1;
                if (-1 === Grid_end || (-1 != Grid_end && Grid_end < Cur_Grid_end)) {
                    Grid_end = Cur_Grid_end;
                }
            }
            for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
                var Row = this.Content[CurRow];
                Rows_info[CurRow] = new Array();
                Add_info[CurRow] = -1;
                var Before_Info = Row.Get_Before();
                if (Before_Info.GridBefore > 0) {
                    Rows_info[CurRow].push({
                        W: this.TableSumGrid[Before_Info.GridBefore - 1],
                        Type: -1,
                        GridSpan: 1
                    });
                }
                var CellsCount = Row.Get_CellsCount();
                for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                    var Cell = Row.Get_Cell(CurCell);
                    var Cur_Grid_start = Row.Get_CellInfo(CurCell).StartGridCol;
                    var Cur_Grid_end = Cur_Grid_start + Cell.Get_GridSpan() - 1;
                    if (Cur_Grid_end <= Grid_end) {
                        Add_info[CurRow] = CurCell;
                    }
                    var W = this.TableSumGrid[Cur_Grid_end] - this.TableSumGrid[Cur_Grid_start - 1];
                    Rows_info[CurRow].push({
                        W: W,
                        Type: 0,
                        GridSpan: 1
                    });
                }
            }
            for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
                var Row = this.Content[CurRow];
                var bBefore2 = false;
                if (Rows_info.length > 0 && Rows_info[CurRow][0].Type === -1) {
                    bBefore2 = true;
                }
                for (var Index = 0; Index < Count; Index++) {
                    var NewCell = Row.Add_Cell(Add_info[CurRow] + 1, Row, null, false);
                    var NextCell = (Add_info[CurRow] + 1 >= Row.Get_CellsCount() - 1 ? Row.Get_Cell(Add_info[CurRow]) : Row.Get_Cell(Add_info[CurRow] + 2));
                    NewCell.Copy_Pr(NextCell.Pr, true);
                    if (false === bBefore2) {
                        Rows_info[CurRow].splice(Add_info[CurRow] + 1, 0, {
                            W: Width,
                            Type: 0,
                            GridSpan: 1
                        });
                    } else {
                        Rows_info[CurRow].splice(Add_info[CurRow] + 2, 0, {
                            W: Width,
                            Type: 0,
                            GridSpan: 1
                        });
                    }
                }
            }
        }
        this.Internal_CreateNewGrid(Rows_info);
        this.Selection.Use = true;
        if (null != this.Selection.Data) {
            this.Selection.Data.length = 0;
        } else {
            this.Selection.Data = new Array();
        }
        this.Selection.Use = true;
        this.Selection.Type = table_Selection_Cell;
        for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
            var StartCell = (true === bBefore ? Add_info[CurRow] : Add_info[CurRow] + 1);
            for (var Index = 0; Index < Count; Index++) {
                this.Selection.Data.push({
                    Row: CurRow,
                    Cell: StartCell + Index
                });
            }
        }
        this.Internal_RecalculateGrid();
        this.Internal_Recalculate_1();
    },
    Update_TableMarkupFromRuler: function (NewMarkup, bCol, Index) {
        var TablePr = this.Get_CompiledPr(false).TablePr;
        if (true === bCol) {
            var TableGrid_old = new Array();
            for (var TempIndex = 0; TempIndex < this.TableGrid.length; TempIndex++) {
                TableGrid_old[TempIndex] = this.TableGrid[TempIndex];
            }
            var RowIndex = NewMarkup.Internal.RowIndex;
            var Row = this.Content[RowIndex];
            var Col = 0;
            var Dx = 0;
            if (Index === NewMarkup.Cols.length) {
                Col = Row.Get_CellInfo(Index - 1).StartGridCol + Row.Get_Cell(Index - 1).Get_GridSpan();
                Dx = NewMarkup.Cols[Index - 1] - this.Markup.Cols[Index - 1];
            } else {
                Col = Row.Get_CellInfo(Index).StartGridCol;
                if (0 != Index) {
                    Dx = NewMarkup.Cols[Index - 1] - this.Markup.Cols[Index - 1];
                } else {
                    Dx = NewMarkup.X - this.Markup.X;
                }
            }
            if (0 === Dx) {
                return;
            }
            if (0 != Index && TablePr.TableW.Type != tblwidth_Auto) {
                var TableW = TablePr.TableW.W;
                var MinWidth = this.Internal_Get_TableMinWidth();
                if (TableW < MinWidth) {
                    TableW = MinWidth;
                }
                this.Set_TableW(tblwidth_Mm, TableW + Dx);
            }
            if (0 === Col) {
                Dx = this.Markup.X - NewMarkup.X;
                this.Parent.setXfrm(-Dx, this.Parent.y, null, null, null, null, null);
            } else {
                var GridSpan = 1;
                if (Dx > 0) {
                    if (Index != NewMarkup.Cols.length) {
                        var Cell = Row.Get_Cell(Index);
                        GridSpan = Cell.Get_GridSpan();
                    } else {
                        var GridAfter = Row.Get_After().GridAfter;
                        GridSpan = GridAfter;
                    }
                    this.TableGrid[Col - 1] = this.TableGridCalc[Col - 1] + Dx;
                    this.Internal_UpdateCellW(Col - 1);
                    if (tbllayout_AutoFit === this.Get_CompiledPr(false).TablePr.TableLayout) {
                        this.Set_TableLayout(tbllayout_Fixed);
                        var ColsCount = this.TableGrid.length;
                        for (var CurCol = 0; CurCol < ColsCount; CurCol++) {
                            if (CurCol != Col - 1) {
                                this.TableGrid[CurCol] = this.TableGridCalc[CurCol];
                            }
                        }
                    }
                } else {
                    if (0 != Index) {
                        var Cell = Row.Get_Cell(Index - 1);
                        GridSpan = Cell.Get_GridSpan();
                    } else {
                        var GridBefore = Row.Get_Before().GridBefore;
                        GridSpan = GridBefore;
                    }
                    if (1 === GridSpan || -Dx < this.TableSumGrid[Col - 1] - this.TableSumGrid[Col - 2]) {
                        this.TableGrid[Col - 1] = this.TableGridCalc[Col - 1] + Dx;
                        this.Internal_UpdateCellW(Col - 1);
                        if (tbllayout_AutoFit === this.Get_CompiledPr(false).TablePr.TableLayout) {
                            this.Set_TableLayout(tbllayout_Fixed);
                            var ColsCount = this.TableGrid.length;
                            for (var CurCol = 0; CurCol < ColsCount; CurCol++) {
                                if (CurCol != Col - 1) {
                                    this.TableGrid[CurCol] = this.TableGridCalc[CurCol];
                                }
                            }
                        }
                    } else {
                        var Rows_info = new Array();
                        for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
                            Rows_info[CurRow] = new Array();
                            var Row = this.Content[CurRow];
                            var Before_Info = Row.Get_Before();
                            if (Before_Info.GridBefore > 0) {
                                if (Before_Info.GridBefore >= Col) {
                                    var W = Math.max(0, this.TableSumGrid[Before_Info.GridBefore - 1] + Dx);
                                    if (W > 0.001) {
                                        Rows_info[CurRow].push({
                                            W: W,
                                            Type: -1,
                                            GridSpan: 1
                                        });
                                    }
                                } else {
                                    Rows_info[CurRow].push({
                                        W: this.TableSumGrid[Before_Info.GridBefore - 1],
                                        Type: -1,
                                        GridSpan: 1
                                    });
                                }
                            }
                            var CellsCount = Row.Get_CellsCount();
                            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                                var Cell = Row.Get_Cell(CurCell);
                                var CellMargins = Cell.Get_Margins();
                                var Cur_Grid_start = Row.Get_CellInfo(CurCell).StartGridCol;
                                var Cur_Grid_end = Cur_Grid_start + Cell.Get_GridSpan() - 1;
                                if (Cur_Grid_start <= Col - 1 && Cur_Grid_end >= Col - 1) {
                                    var W = this.TableSumGrid[Cur_Grid_end] - this.TableSumGrid[Cur_Grid_start - 1] + Dx;
                                    W = Math.max(1, Math.max(W, CellMargins.Left.W + CellMargins.Right.W));
                                    Rows_info[CurRow].push({
                                        W: W,
                                        Type: 0,
                                        GridSpan: 1
                                    });
                                } else {
                                    var W = this.TableSumGrid[Cur_Grid_end] - this.TableSumGrid[Cur_Grid_start - 1];
                                    W = Math.max(1, Math.max(W, CellMargins.Left.W + CellMargins.Right.W));
                                    Rows_info[CurRow].push({
                                        W: W,
                                        Type: 0,
                                        GridSpan: 1
                                    });
                                }
                            }
                        }
                        this.Internal_CreateNewGrid(Rows_info);
                    }
                }
                this.Internal_RecalculateGrid();
            }
            History.Add(this, {
                Type: historyitem_Table_TableGrid,
                Old: TableGrid_old,
                New: this.TableGrid
            });
        } else {
            var RowIndex = this.Pages[NewMarkup.Internal.PageNum].FirstRow + Index;
            if (0 === RowIndex) {
                if (true === this.Is_Inline()) {
                    var Dy = this.Markup.Rows[0].Y - NewMarkup.Rows[0].Y;
                    this.Parent.setXfrm(this.Parent.x, -Dy, null, null, null, null, null);
                } else {
                    var Dy = this.Markup.Rows[0].Y - NewMarkup.Rows[0].Y;
                    this.Y -= Dy;
                    this.Internal_UpdateFlowPosition(this.X, this.Y);
                    var NewH = NewMarkup.Rows[0].H;
                    this.Content[0].Set_Height(NewH, heightrule_AtLeast);
                }
            } else {
                if (NewMarkup.Internal.PageNum > 0 && 0 === Index) {} else {
                    var NewH = NewMarkup.Rows[Index - 1].H;
                    this.Content[RowIndex - 1].Set_Height(NewH, heightrule_AtLeast);
                }
            }
        }
        this.Internal_Recalculate_1();
        this.Internal_OnContentRecalculate(true, 0, this.Index);
        editor.WordControl.m_oLogicDocument.Recalculate();
        editor.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
    },
    Internal_RecalculateGrid: function () {
        var TablePr = this.Get_CompiledPr(false).TablePr;
        var Grid = this.TableGrid;
        var SumGrid = new Array();
        var TempSum = 0;
        SumGrid[-1] = 0;
        for (var Index = 0; Index < Grid.length; Index++) {
            TempSum += Grid[Index];
            SumGrid[Index] = TempSum;
        }
        var MinWidth = this.Internal_Get_TableMinWidth();
        var TableW = TablePr.TableW.W;
        if (tblwidth_Auto === TablePr.TableW.Type) {
            TableW = 0;
        } else {
            if (TableW < MinWidth) {
                TableW = MinWidth;
            }
        }
        var CurGridCol = 0;
        for (var Index = 0; Index < this.Content.length; Index++) {
            var Row = this.Content[Index];
            Row.Set_Index(Index);
            var BeforeInfo = Row.Get_Before();
            CurGridCol = BeforeInfo.GridBefore;
            if (CurGridCol > 0 && SumGrid[CurGridCol - 1] < BeforeInfo.WBefore.W) {
                SumGrid[CurGridCol - 1] = BeforeInfo.WBefore.W;
            }
            var CellsCount = Row.Get_CellsCount();
            for (var CellIndex = 0; CellIndex < CellsCount; CellIndex++) {
                var Cell = Row.Get_Cell(CellIndex);
                Cell.Set_Index(CellIndex);
                var CellW = Cell.Get_W();
                var GridSpan = Cell.Get_GridSpan();
                if (CurGridCol + GridSpan - 1 > SumGrid.length) {
                    for (var AddIndex = SumGrid.length; AddIndex <= CurGridCol + GridSpan - 1; AddIndex++) {
                        SumGrid[AddIndex] = SumGrid[AddIndex - 1] + 20;
                    }
                }
                if (tblwidth_Auto != CellW.Type && CellW.W + SumGrid[CurGridCol - 1] > SumGrid[CurGridCol + GridSpan - 1]) {
                    SumGrid[CurGridCol + GridSpan - 1] = CellW.W + SumGrid[CurGridCol - 1];
                }
                CurGridCol += GridSpan;
            }
            var AfterInfo = Row.Get_After();
            if (CurGridCol + AfterInfo.GridAfter - 1 > SumGrid.length) {
                for (var AddIndex = SumGrid.length; AddIndex <= CurGridCol + AfterInfo.GridAfter - 1; AddIndex++) {
                    SumGrid[AddIndex] = SumGrid[AddIndex - 1] + 20;
                }
            }
            if (SumGrid[CurGridCol + AfterInfo.GridAfter - 1] < AfterInfo.WAfter + SumGrid[CurGridCol - 1]) {
                SumGrid[CurGridCol + AfterInfo.GridAfter - 1] = AfterInfo.WAfter + SumGrid[CurGridCol - 1];
            }
        }
        if (TableW > 0 && Math.abs(SumGrid[SumGrid.length - 1] - TableW) > 0.01) {
            SumGrid = this.Internal_ScaleTableWidth(SumGrid, TableW);
        } else {
            if (MinWidth > SumGrid[SumGrid.length - 1]) {
                SumGrid = this.Internal_ScaleTableWidth(SumGrid, SumGrid[SumGrid.length - 1]);
            }
        }
        var TableGrid_old = new Array();
        for (var Index = 0; Index < this.TableGrid.length; Index++) {
            TableGrid_old[Index] = this.TableGrid[Index];
        }
        this.TableGrid[0] = SumGrid[0];
        for (var Index = 1; Index < SumGrid.length; Index++) {
            this.TableGrid[Index] = SumGrid[Index] - SumGrid[Index - 1];
        }
        this.Internal_SaveTableGridInHistory(this.TableGrid, TableGrid_old);
        this.TableGridCalc = this.Internal_Copy_Grid(this.TableGrid);
        this.TableSumGrid = SumGrid;
        var TopTable = this.Parent.Is_InTable(true);
        if ((null === TopTable && tbllayout_AutoFit === TablePr.TableLayout) || (null != TopTable && tbllayout_AutoFit === TopTable.Get_CompiledPr(false).TablePr.TableLayout)) {
            var MinMargin = new Array(),
            MinContent = new Array(),
            MaxContent = new Array(),
            MaxFlags = new Array();
            var GridCount = this.TableGridCalc.length;
            for (var CurCol = 0; CurCol < GridCount; CurCol++) {
                MinMargin[CurCol] = 0;
                MinContent[CurCol] = 0;
                MaxContent[CurCol] = 0;
                MaxFlags[CurCol] = false;
            }
            var LeftMargin = 0,
            RightMargin = 0;
            var RowsCount = this.Content.length;
            for (var CurRow = 0; CurRow < RowsCount; CurRow++) {
                var Row = this.Content[CurRow];
                var CurGridCol = 0;
                var BeforeInfo = Row.Get_Before();
                var GridBefore = BeforeInfo.GridBefore;
                var WBefore = BeforeInfo.WBefore;
                if (1 === GridBefore) {
                    if (WBefore.Type === tblwidth_Mm) {
                        if (MinContent[CurGridCol] < WBefore.W) {
                            MinContent[CurGridCol] = WBefore.W;
                        }
                        if (false === MaxFlags[CurGridCol]) {
                            MaxFlags[CurGridCol] = true;
                            MaxContent[CurGridCol] = WBefore.W;
                        } else {
                            if (MaxContent[CurGridCol] < WBefore.W) {
                                MaxContent[CurGridCol] = WBefore.W;
                            }
                        }
                    }
                } else {
                    if (GridBefore > 1) {
                        var SumSpanMinContent = 0;
                        var SumSpanMaxContent = 0;
                        var SumSpanCurContent = 0;
                        for (var CurSpan = CurGridCol; CurSpan < CurGridCol + GridBefore; CurSpan++) {
                            SumSpanMinContent += MinContent[CurSpan];
                            SumSpanMaxContent += MaxContent[CurSpan];
                            SumSpanCurContent += this.TableGrid[CurSpan];
                        }
                        if (SumSpanMinContent < WBefore.W) {
                            for (var CurSpan = CurGridCol; CurSpan < CurGridCol + GridSpan; CurSpan++) {
                                MinContent[CurSpan] = WBefore.W * this.TableGrid[CurSpan] / SumSpanCurContent;
                            }
                        }
                        if (WBefore.Type === tblwidth_Mm && WBefore.W > SumSpanMaxContent) {
                            var TempAdd = (WBefore.W - SumSpanMaxContent) / GridBefore;
                            for (var CurSpan = CurGridCol; CurSpan < CurGridCol + GridBefore; CurSpan++) {
                                MaxContent[CurSpan] = WBefore.W * this.TableGrid[CurSpan] / SumSpanCurContent;
                            }
                        }
                    }
                }
                CurGridCol = BeforeInfo.GridBefore;
                var CellsCount = Row.Get_CellsCount();
                for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                    var Cell = Row.Get_Cell(CurCell);
                    var CellMinMax = Cell.Content.Recalculate_MinMaxContentWidth();
                    var CellMin = CellMinMax.Min;
                    var CellMax = CellMinMax.Max;
                    var GridSpan = Cell.Get_GridSpan();
                    var CellMargins = Cell.Get_Margins();
                    var CellMarginsW = CellMargins.Left.W + CellMargins.Right.W;
                    var CellW = Cell.Get_W();
                    if (MinMargin[CurGridCol] < CellMarginsW) {
                        MinMargin[CurGridCol] = CellMarginsW;
                    }
                    if (1 === GridSpan) {
                        if (MinContent[CurGridCol] < CellMin) {
                            MinContent[CurGridCol] = CellMin;
                        }
                        if (false === MaxFlags[CurGridCol] && MaxContent[CurGridCol] < CellMax) {
                            MaxContent[CurGridCol] = CellMax;
                        }
                        if (CellW.Type === tblwidth_Mm) {
                            if (false === MaxFlags[CurGridCol]) {
                                MaxFlags[CurGridCol] = true;
                                MaxContent[CurGridCol] = CellW.W;
                            } else {
                                if (MaxContent[CurGridCol] < CellW.W) {
                                    MaxContent[CurGridCol] = CellW.W;
                                }
                            }
                        }
                    } else {
                        var SumSpanMinContent = 0;
                        var SumSpanMaxContent = 0;
                        var SumSpanCurContent = 0;
                        for (var CurSpan = CurGridCol; CurSpan < CurGridCol + GridSpan; CurSpan++) {
                            SumSpanMinContent += MinContent[CurSpan];
                            SumSpanMaxContent += MaxContent[CurSpan];
                            SumSpanCurContent += this.TableGrid[CurSpan];
                        }
                        if (SumSpanMinContent < CellMin) {
                            for (var CurSpan = CurGridCol; CurSpan < CurGridCol + GridSpan; CurSpan++) {
                                MinContent[CurSpan] = CellMin * this.TableGrid[CurSpan] / SumSpanCurContent;
                            }
                        }
                        if (CellW.Type === tblwidth_Mm && CellW.W > CellMax) {
                            CellMax = CellW.W;
                        }
                        if (SumSpanMaxContent < CellMax) {
                            var TempAdd = (CellMax - SumSpanMaxContent) / GridSpan;
                            for (var CurSpan = CurGridCol; CurSpan < CurGridCol + GridSpan; CurSpan++) {
                                MaxContent[CurSpan] = CellMax * this.TableGrid[CurSpan] / SumSpanCurContent;
                            }
                        }
                    }
                    if (0 === CurRow && 0 === CurCell) {
                        LeftMargin = CellMargins.Left.W;
                    }
                    if (0 === CurRow && CellsCount - 1 === CurCell) {
                        RightMargin = CellMargins.Right.W;
                    }
                    CurGridCol += GridSpan;
                }
                var AfterInfo = Row.Get_After();
                var GridAfter = AfterInfo.GridAfter;
                var WAfter = AfterInfo.WAfter;
                if (1 === GridAfter) {
                    if (WAfter.Type === tblwidth_Mm) {
                        if (MinContent[CurGridCol] < WAfter.W) {
                            MinContent[CurGridCol] = WAfter.W;
                        }
                        if (false === MaxFlags[CurGridCol]) {
                            MaxFlags[CurGridCol] = true;
                            MaxContent[CurGridCol] = WAfter.W;
                        } else {
                            if (MaxContent[CurGridCol] < WAfter.W) {
                                MaxContent[CurGridCol] = WAfter.W;
                            }
                        }
                    }
                } else {
                    if (GridAfter > 1) {
                        var SumSpanMinContent = 0;
                        var SumSpanMaxContent = 0;
                        var SumSpanCurContent = 0;
                        for (var CurSpan = CurGridCol; CurSpan < CurGridCol + GridAfter; CurSpan++) {
                            SumSpanMinContent += MinContent[CurSpan];
                            SumSpanMaxContent += MaxContent[CurSpan];
                            SumSpanCurContent += this.TableGrid[CurSpan];
                        }
                        if (SumSpanMinContent < WAfter.W) {
                            for (var CurSpan = CurGridCol; CurSpan < CurGridCol + GridSpan; CurSpan++) {
                                MinContent[CurSpan] = WAfter.W * this.TableGrid[CurSpan] / SumSpanCurContent;
                            }
                        }
                        if (WAfter.Type === tblwidth_Mm && WAfter.W > SumSpanMaxContent) {
                            var TempAdd = (WAfter.W - SumSpanMaxContent) / GridAfter;
                            for (var CurSpan = CurGridCol; CurSpan < CurGridCol + GridAfter; CurSpan++) {
                                MaxContent[CurSpan] = WAfter.W * this.TableGrid[CurSpan] / SumSpanCurContent;
                            }
                        }
                    }
                }
            }
            for (var CurCol = 0; CurCol < GridCount; CurCol++) {
                if (true === MaxFlags[CurCol]) {
                    MaxContent[CurCol] = Math.max(0, MaxContent[CurCol] - MinMargin[CurCol]);
                }
            }
            for (var CurCol = 0; CurCol < GridCount; CurCol++) {
                if (MinMargin[CurCol] + MinContent[CurCol] > 558.7000000000001) {
                    MinContent[CurCol] = Math.max(558.7000000000001 - MinMargin[CurCol], 0);
                }
                if (MinMargin[CurCol] + MaxContent[CurCol] > 558.7000000000001) {
                    MaxContent[CurCol] = Math.max(558.7000000000001 - MinMargin[CurCol], 0);
                }
            }
            var PageFields = this.Parent.Get_PageFields(this.PageNum);
            var MaxTableW = PageFields.XLimit - PageFields.X - TablePr.TableInd;
            if (null === TopTable) {
                MaxTableW += LeftMargin + RightMargin;
            }
            var TableSpacing = this.Content[0].Get_CellSpacing();
            if (null != TableSpacing) {
                MaxTableW += 2 * TableSpacing;
            }
            var MaxContent2 = new Array();
            var SumMin = 0,
            SumMinMargin = 0,
            SumMinContent = 0,
            SumMax = 0,
            SumMaxContent2 = 0;
            var TableGrid2 = new Array();
            for (var CurCol = 0; CurCol < GridCount; CurCol++) {
                var Temp = MinMargin[CurCol] + MinContent[CurCol];
                TableGrid2[CurCol] = this.TableGridCalc[CurCol];
                if (Temp < this.TableGridCalc[CurCol]) {
                    TableGrid2[CurCol] = this.TableGridCalc[CurCol];
                } else {
                    TableGrid2[CurCol] = Temp;
                }
                MaxContent2[CurCol] = Math.max(0, MaxContent[CurCol] - MinContent[CurCol]);
                SumMin += Temp;
                SumMaxContent2 += MaxContent2[CurCol];
                SumMinMargin += MinMargin[CurCol];
                SumMinContent += MinContent[CurCol];
                SumMax += MinMargin[CurCol] + MinContent[CurCol] + MaxContent2[CurCol];
            }
            if (SumMin < MaxTableW) {
                if (SumMax <= MaxTableW || SumMaxContent2 < 0.001) {
                    for (var CurCol = 0; CurCol < GridCount; CurCol++) {
                        this.TableGridCalc[CurCol] = MinMargin[CurCol] + Math.max(MinContent[CurCol], MaxContent[CurCol]);
                    }
                } else {
                    for (var CurCol = 0; CurCol < GridCount; CurCol++) {
                        this.TableGridCalc[CurCol] = MinMargin[CurCol] + MinContent[CurCol] + (MaxTableW - SumMin) * MaxContent2[CurCol] / SumMaxContent2;
                    }
                }
            } else {
                if (MaxTableW < SumMinMargin) {
                    for (var CurCol = 0; CurCol < GridCount; CurCol++) {
                        this.TableGridCalc[CurCol] = MinMargin[CurCol];
                    }
                } else {
                    var ColsDiff = new Array();
                    var SumColsDiff = 0;
                    for (var CurCol = 0; CurCol < GridCount; CurCol++) {
                        var Temp = TableGrid2[CurCol] - MinMargin[CurCol];
                        ColsDiff[CurCol] = Temp;
                        SumColsDiff += Temp;
                    }
                    for (var CurCol = 0; CurCol < GridCount; CurCol++) {
                        TableGrid2[CurCol] = MinMargin[CurCol] + (MaxTableW - SumMinMargin) * ColsDiff[CurCol] / SumColsDiff;
                    }
                    var SumN = 0,
                    SumI = 0;
                    var GridCols = new Array();
                    for (var CurCol = 0; CurCol < GridCount; CurCol++) {
                        var Temp = TableGrid2[CurCol] - (MinMargin[CurCol] + MinContent[CurCol]);
                        if (Temp >= 0) {
                            GridCols[CurCol] = Temp;
                            SumI += Temp;
                        } else {
                            GridCols[CurCol] = -1;
                            SumN -= Temp;
                        }
                    }
                    if (SumN > SumI || SumI <= 0) {
                        var SumDiff = MaxTableW - SumMinMargin;
                        for (var CurCol = 0; CurCol < GridCount; CurCol++) {
                            this.TableGridCalc[CurCol] = MinMargin[CurCol] + SumDiff * MinContent[CurCol] / SumMinContent;
                        }
                    } else {
                        for (var CurCol = 0; CurCol < GridCount; CurCol++) {
                            if (GridCols[CurCol] < 0) {
                                this.TableGridCalc[CurCol] = MinMargin[CurCol] + MinContent[CurCol];
                            } else {
                                this.TableGridCalc[CurCol] = TableGrid2[CurCol] - SumN * GridCols[CurCol] / SumI;
                            }
                        }
                    }
                }
            }
            this.TableSumGrid[-1] = 0;
            for (var CurCol = 0; CurCol < GridCount; CurCol++) {
                this.TableSumGrid[CurCol] = this.TableSumGrid[CurCol - 1] + this.TableGridCalc[CurCol];
            }
        }
        this.RecalcInfo.TableGrid = false;
    },
    Internal_Recalculate_1: function () {
        this.Parent.OnContentRecalculate();
        return;
        return editor.WordControl.m_oLogicDocument.Recalculate();
        if (true === this.TurnOffRecalc) {
            return;
        }
        this.TurnOffRecalc = true;
        var TablePr = this.Get_CompiledPr(false).TablePr;
        if (true === this.Is_Inline()) {
            switch (TablePr.Jc) {
            case align_Left:
                this.X = this.X_origin + this.Get_TableOffsetCorrection() + TablePr.TableInd;
                break;
            case align_Right:
                var TableWidth = this.TableSumGrid[this.TableSumGrid.length - 1];
                if (false === this.Parent.Is_TableCellContent()) {
                    this.X = this.XLimit - TableWidth + 1.9;
                } else {
                    this.X = this.XLimit - TableWidth;
                }
                break;
            case align_Center:
                var TableWidth = this.TableSumGrid[this.TableSumGrid.length - 1];
                var RangeWidth = this.XLimit - this.X_origin;
                this.X = this.X_origin + (RangeWidth - TableWidth) / 2;
                break;
            }
        }
        this.Pages.length = 0;
        this.Pages[0] = {
            Bounds: {
                Top: this.Y,
                Left: this.X,
                Right: this.X + this.TableSumGrid[this.TableSumGrid.length - 1],
                Bottom: this.Y
            },
            FirstRow: 0,
            Height: 0,
            Y: this.Y,
            YLimit: this.YLimit,
            MaxTopBorder: 0
        };
        var Y = this.Y;
        var TableHeight = 0;
        for (var Index = -1; Index < this.Content.length; Index++) {
            this.TableRowsBottom[Index] = new Array();
            this.TableRowsBottom[Index][0] = 0;
        }
        var MaxTopBorder = new Array();
        var MaxBotBorder = new Array();
        var MaxBotMargin = new Array();
        for (var Index = 0; Index < this.Content.length; Index++) {
            MaxBotBorder[Index] = 0;
            MaxTopBorder[Index] = 0;
            MaxBotMargin[Index] = 0;
        }
        var TableBorders = this.Get_Borders();
        for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
            var Row = this.Content[CurRow];
            var CellsCount = Row.Get_CellsCount();
            var CellSpacing = Row.Get_CellSpacing();
            var BeforeInfo = Row.Get_Before();
            var AfterInfo = Row.Get_After();
            var CurGridCol = BeforeInfo.GridBefore;
            CurGridCol = BeforeInfo.GridBefore;
            var bSpacing_Top = false;
            var bSpacing_Bot = false;
            if (null != CellSpacing) {
                bSpacing_Bot = true;
                bSpacing_Top = true;
            } else {
                if (0 != CurRow) {
                    var PrevCellSpacing = this.Content[CurRow - 1].Get_CellSpacing();
                    if (null != PrevCellSpacing) {
                        bSpacing_Top = true;
                    }
                }
                if (this.Content.length - 1 != CurRow) {
                    var NextCellSpacing = this.Content[CurRow + 1].Get_CellSpacing();
                    if (null != NextCellSpacing) {
                        bSpacing_Bot = true;
                    }
                }
            }
            Row.Set_SpacingInfo(bSpacing_Top, bSpacing_Bot);
            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                var Cell = Row.Get_Cell(CurCell);
                var GridSpan = Cell.Get_GridSpan();
                var Vmerge = Cell.Get_VMerge();
                Row.Set_CellInfo(CurCell, CurGridCol, 0, 0, 0, 0, 0, 0);
                if (vmerge_Continue === Vmerge) {
                    var VMergeCount2 = this.Internal_GetVertMergeCount2(CurRow, CurGridCol, GridSpan);
                    if (VMergeCount2 > 1) {
                        CurGridCol += GridSpan;
                        continue;
                    } else {
                        Cell.Set_VMerge(vmerge_Restart);
                    }
                }
                var VMergeCount = this.Internal_GetVertMergeCount(CurRow, CurGridCol, GridSpan);
                var CellMargins = Cell.Get_Margins();
                if (CellMargins.Bottom.W > MaxBotMargin[CurRow + VMergeCount - 1]) {
                    MaxBotMargin[CurRow + VMergeCount - 1] = CellMargins.Bottom.W;
                }
                var CellBorders = Cell.Get_Borders();
                if (true === bSpacing_Top) {
                    if (border_Single === CellBorders.Top.Value && MaxTopBorder[CurRow] < CellBorders.Top.Size) {
                        MaxTopBorder[CurRow] = CellBorders.Top.Size;
                    }
                    Cell.Set_BorderInfo_Top([CellBorders.Top]);
                } else {
                    if (0 === CurRow) {
                        var Result_Border = this.Internal_CompareBorders(TableBorders.Top, CellBorders.Top, true, false);
                        if (border_Single === Result_Border.Value && MaxTopBorder[CurRow] < Result_Border.Size) {
                            MaxTopBorder[CurRow] = Result_Border.Size;
                        }
                        var BorderInfo_Top = new Array();
                        for (var TempIndex = 0; TempIndex < GridSpan; TempIndex++) {
                            BorderInfo_Top.push(Result_Border);
                        }
                        Cell.Set_BorderInfo_Top(BorderInfo_Top);
                    } else {
                        var Prev_Row = this.Content[CurRow - 1];
                        var Prev_CellsCount = Prev_Row.Get_CellsCount();
                        var Prev_BeforeInfo = Prev_Row.Get_Before();
                        var Prev_AfterInfo = Prev_Row.Get_After();
                        var Prev_Pos = -1;
                        var Prev_GridCol = Prev_BeforeInfo.GridBefore;
                        for (var PrevCell = 0; PrevCell < Prev_CellsCount; PrevCell++) {
                            var Prev_Cell = Prev_Row.Get_Cell(PrevCell);
                            var Prev_GridSpan = Prev_Cell.Get_GridSpan();
                            if (Prev_GridCol <= CurGridCol + GridSpan - 1 && Prev_GridCol + Prev_GridSpan - 1 >= CurGridCol) {
                                Prev_Pos = PrevCell;
                                break;
                            }
                            Prev_GridCol += Prev_GridSpan;
                        }
                        var Border_Top_Info = new Array();
                        if (CurGridCol <= Prev_BeforeInfo.GridBefore - 1) {
                            var Result_Border = this.Internal_CompareBorders(TableBorders.Left, CellBorders.Top, true, false);
                            if (border_Single === Result_Border.Value && MaxTopBorder[CurRow] < Result_Border.Size) {
                                MaxTopBorder[CurRow] = Result_Border.Size;
                            }
                            var AddCount = Math.min(Prev_BeforeInfo.GridBefore - CurGridCol, GridSpan);
                            for (var TempIndex = 0; TempIndex < AddCount; TempIndex++) {
                                Border_Top_Info.push(Result_Border);
                            }
                        }
                        if (-1 != Prev_Pos) {
                            while (Prev_GridCol <= CurGridCol + GridSpan - 1 && Prev_Pos < Prev_CellsCount) {
                                var Prev_Cell = Prev_Row.Get_Cell(Prev_Pos);
                                var Prev_GridSpan = Prev_Cell.Get_GridSpan();
                                var Prev_VMerge = Prev_Cell.Get_VMerge();
                                if (vmerge_Continue === Prev_VMerge) {
                                    Prev_Cell = this.Internal_Get_StartMergedCell(CurRow - 1, Prev_GridCol, Prev_GridSpan);
                                }
                                var PrevBorders = Prev_Cell.Get_Borders();
                                var Result_Border = this.Internal_CompareBorders(PrevBorders.Bottom, CellBorders.Top, false, false);
                                if (border_Single === Result_Border.Value && MaxTopBorder[CurRow] < Result_Border.Size) {
                                    MaxTopBorder[CurRow] = Result_Border.Size;
                                }
                                var AddCount = 0;
                                if (Prev_GridCol >= CurGridCol) {
                                    if (Prev_GridCol + Prev_GridSpan - 1 > CurGridCol + GridSpan - 1) {
                                        AddCount = CurGridCol + GridSpan - Prev_GridCol;
                                    } else {
                                        AddCount = Prev_GridSpan;
                                    }
                                } else {
                                    if (Prev_GridCol + Prev_GridSpan - 1 > CurGridCol + GridSpan - 1) {
                                        AddCount = GridSpan;
                                    } else {
                                        AddCount = Prev_GridCol + Prev_GridSpan - CurGridCol;
                                    }
                                }
                                for (var TempIndex = 0; TempIndex < AddCount; TempIndex++) {
                                    Border_Top_Info.push(Result_Border);
                                }
                                Prev_Pos++;
                                Prev_GridCol += Prev_GridSpan;
                            }
                        }
                        if (Prev_AfterInfo.GridAfter > 0) {
                            var StartAfterGrid = Prev_Row.Get_CellInfo(Prev_CellsCount - 1).StartGridCol + Prev_Row.Get_Cell(Prev_CellsCount - 1).Get_GridSpan();
                            if (CurGridCol + GridSpan - 1 >= StartAfterGrid) {
                                var Result_Border = this.Internal_CompareBorders(TableBorders.Right, CellBorders.Top, true, false);
                                if (border_Single === Result_Border.Value && MaxTopBorder[CurRow] < Result_Border.Size) {
                                    MaxTopBorder[CurRow] = Result_Border.Size;
                                }
                                var AddCount = Math.min(CurGridCol + GridSpan - StartAfterGrid, GridSpan);
                                for (var TempIndex = 0; TempIndex < AddCount; TempIndex++) {
                                    Border_Top_Info.push(Result_Border);
                                }
                            }
                        }
                        Cell.Set_BorderInfo_Top(Border_Top_Info);
                    }
                }
                if (true === bSpacing_Bot) {
                    Cell.Set_BorderInfo_Bottom([CellBorders.Bottom], -1, -1);
                    if (border_Single === CellBorders.Bottom.Value && CellBorders.Bottom.Size > MaxBotBorder[CurRow + VMergeCount - 1]) {
                        MaxBotBorder[CurRow + VMergeCount - 1] = CellBorders.Bottom.Size;
                    }
                } else {
                    if (this.Content.length - 1 === CurRow + VMergeCount - 1) {
                        var Result_Border = this.Internal_CompareBorders(TableBorders.Bottom, CellBorders.Bottom, true, false);
                        if (border_Single === Result_Border.Value && Result_Border.Size > MaxBotBorder[CurRow + VMergeCount - 1]) {
                            MaxBotBorder[CurRow + VMergeCount - 1] = Result_Border.Size;
                        }
                        if (GridSpan > 0) {
                            for (var TempIndex = 0; TempIndex < GridSpan; TempIndex++) {
                                Cell.Set_BorderInfo_Bottom([Result_Border], -1, -1);
                            }
                        } else {
                            Cell.Set_BorderInfo_Bottom([], -1, -1);
                        }
                    } else {
                        var Next_Row = this.Content[CurRow + VMergeCount];
                        var Next_CellsCount = Next_Row.Get_CellsCount();
                        var Next_BeforeInfo = Next_Row.Get_Before();
                        var Next_AfterInfo = Next_Row.Get_After();
                        var Border_Bottom_Info = new Array();
                        var BeforeCount = 0;
                        if (CurGridCol <= Next_BeforeInfo.GridBefore - 1) {
                            var Result_Border = this.Internal_CompareBorders(TableBorders.Left, CellBorders.Bottom, true, false);
                            BeforeCount = Math.min(Next_BeforeInfo.GridBefore - CurGridCol, GridSpan);
                            for (var TempIndex = 0; TempIndex < BeforeCount; TempIndex++) {
                                Border_Bottom_Info.push(Result_Border);
                            }
                        }
                        var Next_GridCol = Next_BeforeInfo.GridBefore;
                        for (var NextCell = 0; NextCell < Next_CellsCount; NextCell++) {
                            var Next_Cell = Next_Row.Get_Cell(NextCell);
                            var Next_GridSpan = Next_Cell.Get_GridSpan();
                            Next_GridCol += Next_GridSpan;
                        }
                        var AfterCount = 0;
                        if (Next_AfterInfo.GridAfter > 0) {
                            var StartAfterGrid = Next_GridCol;
                            if (CurGridCol + GridSpan - 1 >= StartAfterGrid) {
                                var Result_Border = this.Internal_CompareBorders(TableBorders.Right, CellBorders.Bottom, true, false);
                                AfterCount = Math.min(CurGridCol + GridSpan - StartAfterGrid, GridSpan);
                                for (var TempIndex = 0; TempIndex < AfterCount; TempIndex++) {
                                    Border_Bottom_Info.push(Result_Border);
                                }
                            }
                        }
                        Cell.Set_BorderInfo_Bottom(Border_Bottom_Info, BeforeCount, AfterCount);
                    }
                }
                CurGridCol += GridSpan;
            }
        }
        this.MaxTopBorder = MaxTopBorder;
        this.MaxBotBorder = MaxBotBorder;
        this.MaxBotMargin = MaxBotMargin;
        var X_max = -1;
        var X_min = -1;
        var CurPage = 0;
        for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
            var Row = this.Content[CurRow];
            var CellsCount = Row.Get_CellsCount();
            var CellSpacing = Row.Get_CellSpacing();
            var BeforeInfo = Row.Get_Before();
            var AfterInfo = Row.Get_After();
            var CurGridCol = BeforeInfo.GridBefore;
            if (0 === CurRow) {
                if (null != CellSpacing) {
                    var TableBorder_Top = this.Get_Borders().Top;
                    if (border_Single === TableBorder_Top.Value) {
                        Y += TableBorder_Top.Size;
                        TableHeight += TableBorder_Top.Size;
                    }
                    Y += CellSpacing;
                    TableHeight += CellSpacing;
                }
            } else {
                var PrevCellSpacing = this.Content[CurRow - 1].Get_CellSpacing();
                if (null != CellSpacing && null != PrevCellSpacing) {
                    Y += (PrevCellSpacing + CellSpacing) / 2;
                    TableHeight += (PrevCellSpacing + CellSpacing) / 2;
                } else {
                    if (null != CellSpacing) {
                        Y += CellSpacing / 2;
                        TableHeight += CellSpacing / 2;
                    } else {
                        if (null != PrevCellSpacing) {
                            Y += PrevCellSpacing / 2;
                            TableHeight += PrevCellSpacing / 2;
                        }
                    }
                }
            }
            Y += MaxTopBorder[CurRow];
            TableHeight += MaxTopBorder[CurRow];
            var Row_x_max = 0;
            var Row_x_min = 0;
            var LastPage = CurPage;
            var Pages_Y_Pos = new Array();
            var Pages_Max_Top_Border = new Array();
            var MaxBotValue_vmerge = -1;
            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                var Cell = Row.Get_Cell(CurCell);
                var GridSpan = Cell.Get_GridSpan();
                var Vmerge = Cell.Get_VMerge();
                var X_grid_start = this.X + this.TableSumGrid[CurGridCol - 1];
                var X_grid_end = this.X + this.TableSumGrid[CurGridCol + GridSpan - 1];
                var X_cell_start = X_grid_start;
                var X_cell_end = X_grid_end;
                if (null != CellSpacing) {
                    if (0 === CurCell) {
                        if (0 === BeforeInfo.GridBefore) {
                            if (border_None === TableBorders.Left.Value || CellSpacing > TableBorders.Left.Size / 2) {
                                X_cell_start += CellSpacing;
                            } else {
                                X_cell_start += TableBorders.Left.Size / 2;
                            }
                        } else {
                            if (border_None === TableBorders.Left.Value || CellSpacing > TableBorders.Left.Size) {
                                X_cell_start += CellSpacing / 2;
                            } else {
                                X_cell_start += TableBorders.Left.Size / 2;
                            }
                        }
                    } else {
                        X_cell_start += CellSpacing / 2;
                    }
                    if (CellsCount - 1 === CurCell) {
                        if (0 === AfterInfo.GridAfter) {
                            if (border_None === TableBorders.Right.Value || CellSpacing > TableBorders.Right.Size / 2) {
                                X_cell_end -= CellSpacing;
                            } else {
                                X_cell_end -= TableBorders.Right.Size / 2;
                            }
                        } else {
                            if (border_None === TableBorders.Right.Value || CellSpacing > TableBorders.Right.Size) {
                                X_cell_end -= CellSpacing / 2;
                            } else {
                                X_cell_end -= TableBorders.Right.Size / 2;
                            }
                        }
                    } else {
                        X_cell_end -= CellSpacing / 2;
                    }
                }
                var CellMar = Cell.Get_Margins();
                var VMergeCount = this.Internal_GetVertMergeCount(CurRow, CurGridCol, GridSpan);
                var X_content_start = X_cell_start;
                var X_content_end = X_cell_end;
                var CellBorders = Cell.Get_Borders();
                if (null != CellSpacing) {
                    X_content_start += CellMar.Left.W;
                    X_content_end -= CellMar.Right.W;
                    if (border_Single === CellBorders.Left.Value) {
                        X_content_start += CellBorders.Left.Size;
                    }
                    if (border_Single === CellBorders.Right.Value) {
                        X_content_end -= CellBorders.Right.Size;
                    }
                } else {
                    if (vmerge_Continue === Vmerge) {
                        X_content_start += CellMar.Left.W;
                        X_content_end -= CellMar.Right.W;
                    } else {
                        var Max_r_w = 0;
                        var Max_l_w = 0;
                        var Borders_Info = {
                            Right: new Array(),
                            Left: new Array(),
                            Right_Max: 0,
                            Left_Max: 0
                        };
                        for (var Temp_CurRow = 0; Temp_CurRow < VMergeCount; Temp_CurRow++) {
                            var Temp_Row = this.Content[CurRow + Temp_CurRow];
                            var Temp_CellsCount = Temp_Row.Get_CellsCount();
                            var Temp_CurCell = this.Internal_Get_Cell_ByStartGridCol(CurRow + Temp_CurRow, CurGridCol);
                            if (Temp_CurCell < 0) {
                                continue;
                            }
                            if (0 === Temp_CurCell) {
                                var LeftBorder = this.Internal_CompareBorders(TableBorders.Left, CellBorders.Left, true, false);
                                if (border_Single === LeftBorder.Value && LeftBorder.Size > Max_l_w) {
                                    Max_l_w = LeftBorder.Size;
                                }
                                Borders_Info.Left.push(LeftBorder);
                            } else {
                                var Temp_Prev_Cell = Temp_Row.Get_Cell(Temp_CurCell - 1);
                                var Temp_Prev_VMerge = Temp_Prev_Cell.Get_VMerge();
                                if (0 != Temp_CurRow && vmerge_Continue === Temp_Prev_VMerge) {
                                    Borders_Info.Left.push(Borders_Info.Left[Borders_Info.Left.length - 1]);
                                } else {
                                    var Temp_Prev_Main_Cell = this.Internal_Get_StartMergedCell(CurRow + Temp_CurRow, CurGridCol - Temp_Prev_Cell.Get_GridSpan(), Temp_Prev_Cell.Get_GridSpan());
                                    var Temp_Prev_Main_Cell_Borders = Temp_Prev_Main_Cell.Get_Borders();
                                    var LeftBorder = this.Internal_CompareBorders(Temp_Prev_Main_Cell_Borders.Right, CellBorders.Left, false, false);
                                    if (border_Single === LeftBorder.Value && LeftBorder.Size > Max_l_w) {
                                        Max_l_w = LeftBorder.Size;
                                    }
                                    Borders_Info.Left.push(LeftBorder);
                                }
                            }
                            if (Temp_CellsCount - 1 === Temp_CurCell) {
                                var RightBorder = this.Internal_CompareBorders(TableBorders.Right, CellBorders.Right, true, false);
                                if (border_Single === RightBorder.Value && RightBorder.Size > Max_r_w) {
                                    Max_r_w = RightBorder.Size;
                                }
                                Borders_Info.Right.push(RightBorder);
                            } else {
                                var Temp_Next_Cell = Temp_Row.Get_Cell(Temp_CurCell + 1);
                                var Temp_Next_VMerge = Temp_Next_Cell.Get_VMerge();
                                if (0 != Temp_CurRow && vmerge_Continue === Temp_Next_VMerge) {
                                    Borders_Info.Right.push(Borders_Info.Right[Borders_Info.Right.length - 1]);
                                } else {
                                    var Temp_Next_Main_Cell = this.Internal_Get_StartMergedCell(CurRow + Temp_CurRow, CurGridCol + GridSpan, Temp_Next_Cell.Get_GridSpan());
                                    var Temp_Next_Main_Cell_Borders = Temp_Next_Main_Cell.Get_Borders();
                                    var RightBorder = this.Internal_CompareBorders(Temp_Next_Main_Cell_Borders.Left, CellBorders.Right, false, false);
                                    if (border_Single === RightBorder.Value && RightBorder.Size > Max_r_w) {
                                        Max_r_w = RightBorder.Size;
                                    }
                                    Borders_Info.Right.push(RightBorder);
                                }
                            }
                        }
                        Borders_Info.Right_Max = Max_r_w;
                        Borders_Info.Left_Max = Max_l_w;
                        if (Max_l_w / 2 > CellMar.Left.W) {
                            X_content_start += Max_l_w / 2;
                        } else {
                            X_content_start += CellMar.Left.W;
                        }
                        if (Max_r_w / 2 > CellMar.Right.W) {
                            X_content_end -= Max_r_w / 2;
                        } else {
                            X_content_end -= CellMar.Right.W;
                        }
                        Cell.Set_BorderInfo_Left(Borders_Info.Left, Max_l_w);
                        Cell.Set_BorderInfo_Right(Borders_Info.Right, Max_r_w);
                    }
                }
                if (0 === CurCell) {
                    if (null != CellSpacing) {
                        Row_x_min = X_grid_start;
                        if (border_Single === TableBorders.Left.Value) {
                            Row_x_min -= TableBorders.Left.Size / 2;
                        }
                    } else {
                        var BorderInfo = Cell.Get_BorderInfo();
                        Row_x_min = X_grid_start - BorderInfo.MaxLeft / 2;
                    }
                }
                if (CellsCount - 1 === CurCell) {
                    if (null != CellSpacing) {
                        Row_x_max = X_grid_end;
                        if (border_Single === TableBorders.Right.Value) {
                            Row_x_max += TableBorders.Right.Size / 2;
                        }
                    } else {
                        var BorderInfo = Cell.Get_BorderInfo();
                        Row_x_max = X_grid_end + BorderInfo.MaxRight / 2;
                    }
                }
                Row.Set_CellInfo(CurCell, CurGridCol, X_grid_start, X_grid_end, X_cell_start, X_cell_end, X_content_start, X_content_end);
                var Y_content_start = Y + CellMar.Top.W;
                var CurPage_old = CurPage;
                Cell.Temp = {
                    CurPage: CurPage,
                    Y: Y
                };
                if (VMergeCount > 1) {
                    CurGridCol += GridSpan;
                    continue;
                } else {
                    if (vmerge_Restart != Vmerge) {
                        Cell = this.Internal_Get_StartMergedCell(CurRow, CurGridCol, GridSpan);
                        CellMar = Cell.Get_Margins();
                        Y_content_start = Cell.Temp.Y + CellMar.Top.W;
                        CurPage = Cell.Temp.CurPage;
                    }
                }
                var Y_content_end = this.Pages[CurPage].YLimit;
                if (null != CellSpacing) {
                    if (this.Content.length - 1 === CurRow) {
                        Y_content_end -= CellSpacing;
                    } else {
                        Y_content_end -= CellSpacing / 2;
                    }
                }
                var BottomMargin = this.MaxBotMargin[CurRow + VMergeCount - 1];
                Y_content_end -= BottomMargin;
                Cell.Content_Set_StartPage(CurPage);
                Cell.Content_Reset(X_content_start, Y_content_start, X_content_end, 20000);
                Cell.Recalculate();
                var PagesCount = Cell.Content_Get_PagesCount();
                for (var PageIndex = 0; PageIndex < PagesCount; PageIndex++) {
                    var CellContentBounds = Cell.Content_Get_PageBounds(PageIndex);
                    var CellContentBounds_Bottom = CellContentBounds.Bottom + BottomMargin;
                    if (CurPage + PageIndex >= CurPage_old) {
                        if (vmerge_Continue === Vmerge && CurPage + PageIndex === CurPage_old) {
                            if (-1 === MaxBotValue_vmerge || MaxBotValue_vmerge < CellContentBounds_Bottom) {
                                MaxBotValue_vmerge = CellContentBounds_Bottom;
                            }
                        }
                        if ("undefined" === typeof(this.TableRowsBottom[CurRow]) || "undefined" === typeof(this.TableRowsBottom[CurRow][CurPage + PageIndex]) || this.TableRowsBottom[CurRow][CurPage + PageIndex] < CellContentBounds_Bottom) {
                            if ("undefined" === typeof(this.TableRowsBottom[CurRow])) {
                                this.TableRowsBottom[CurRow] = new Array();
                            }
                            this.TableRowsBottom[CurRow][CurPage + PageIndex] = CellContentBounds_Bottom;
                        }
                        if (0 != PageIndex) {
                            if ("undefined" === typeof(this.Pages[CurPage + PageIndex])) {
                                var StartPos = this.Parent.Get_PageContentStartPos(CurPage + PageIndex);
                                var StartRowPos = this.Get_PageContentStartPos(CurPage + PageIndex, CurRow, CurCell);
                                this.Pages[CurPage + PageIndex] = {
                                    Bounds: {
                                        Top: StartPos.Y,
                                        Left: this.X,
                                        Right: this.X + this.TableSumGrid[this.TableSumGrid.length - 1],
                                        Bottom: StartPos.Y
                                    },
                                    FirstRow: CurRow,
                                    Height: 0,
                                    Y: StartRowPos.Y,
                                    YLimit: StartRowPos.YLimit,
                                    MaxTopBorder: StartRowPos.MaxTopBorder
                                };
                                Pages_Y_Pos[CurPage + PageIndex] = StartRowPos.Y;
                                Pages_Max_Top_Border[CurPage + PageIndex] = StartRowPos.MaxTopBorder;
                            }
                        }
                        if (LastPage < CurPage + PageIndex) {
                            LastPage = CurPage + PageIndex;
                        }
                    } else {
                        var TempRow = this.Pages[CurPage + PageIndex + 1].FirstRow;
                        if (true === this.RowsInfo[TempRow].FirstPage) {
                            if ("undefined" === typeof(this.TableRowsBottom[TempRow]) || "undefined" === typeof(this.TableRowsBottom[TempRow][CurPage + PageIndex]) || this.TableRowsBottom[TempRow][CurPage + PageIndex] < CellContentBounds_Bottom) {
                                if ("undefined" === typeof(this.TableRowsBottom[TempRow])) {
                                    this.TableRowsBottom[TempRow] = new Array();
                                }
                                this.TableRowsBottom[TempRow][CurPage + PageIndex] = CellContentBounds_Bottom;
                            }
                        } else {
                            if (TempRow > 0) {
                                if ("undefined" === typeof(this.TableRowsBottom[TempRow - 1]) || "undefined" === typeof(this.TableRowsBottom[TempRow - 1][CurPage + PageIndex]) || this.TableRowsBottom[TempRow - 1][CurPage + PageIndex] < CellContentBounds_Bottom) {
                                    if ("undefined" === typeof(this.TableRowsBottom[TempRow - 1])) {
                                        this.TableRowsBottom[TempRow - 1] = new Array();
                                    }
                                    this.TableRowsBottom[TempRow - 1][CurPage + PageIndex] = CellContentBounds_Bottom;
                                }
                            }
                        }
                    }
                }
                CurPage = CurPage_old;
                CurGridCol += GridSpan;
            }
            if (-1 === X_min || Row_x_min < X_min) {
                X_min = Row_x_min;
            }
            if (-1 === X_max || Row_x_max > X_max) {
                X_max = Row_x_max;
            }
            var RowH = Row.Get_Height();
            this.RowsInfo[CurRow] = new Object();
            this.RowsInfo[CurRow].Pages = LastPage - CurPage + 1;
            this.RowsInfo[CurRow].Y = new Array();
            this.RowsInfo[CurRow].H = new Array();
            this.RowsInfo[CurRow].TopDy = new Array();
            this.RowsInfo[CurRow].MaxTopBorder = new Array();
            this.RowsInfo[CurRow].FirstPage = true;
            this.RowsInfo[CurRow].StartPage = CurPage;
            for (var PageIndex = 0; PageIndex < this.RowsInfo[CurRow].Pages; PageIndex++) {
                var TempY = Y;
                var TempMaxTopBorder = MaxTopBorder[CurRow];
                if (0 != PageIndex) {
                    TempY = Pages_Y_Pos[CurPage + PageIndex];
                    TempMaxTopBorder = Pages_Max_Top_Border[CurPage + PageIndex];
                    if (1 === PageIndex) {
                        var bContentOnFirstPage = false;
                        for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                            var Cell = Row.Get_Cell(CurCell);
                            var Vmerge = Cell.Get_VMerge();
                            var VMergeCount = this.Internal_GetVertMergeCount(CurRow, Row.Get_CellInfo(CurCell).StartGridCol, Cell.Get_GridSpan());
                            if (vmerge_Continue === Vmerge || VMergeCount > 1) {
                                continue;
                            }
                            if (true === Cell.Content_Is_ContentOnFirstPage()) {
                                bContentOnFirstPage = true;
                                break;
                            }
                        }
                        this.RowsInfo[CurRow].FirstPage = bContentOnFirstPage;
                        if (0 != CurRow && false === this.RowsInfo[CurRow].FirstPage) {
                            if (this.TableRowsBottom[CurRow - 1][CurPage] < MaxBotValue_vmerge) {
                                this.TableRowsBottom[CurRow - 1][CurPage] = MaxBotValue_vmerge;
                            }
                        }
                    }
                }
                if (null != CellSpacing) {
                    this.RowsInfo[CurRow].Y[CurPage + PageIndex] = TempY;
                    this.RowsInfo[CurRow].TopDy[CurPage + PageIndex] = 0;
                    this.RowsInfo[CurRow].X0 = Row_x_min;
                    this.RowsInfo[CurRow].X1 = Row_x_max;
                    this.RowsInfo[CurRow].MaxTopBorder[CurPage + PageIndex] = TempMaxTopBorder;
                    this.RowsInfo[CurRow].MaxBotBorder = MaxBotBorder[CurRow];
                } else {
                    this.RowsInfo[CurRow].Y[CurPage + PageIndex] = TempY - TempMaxTopBorder;
                    this.RowsInfo[CurRow].TopDy[CurPage + PageIndex] = TempMaxTopBorder;
                    this.RowsInfo[CurRow].X0 = Row_x_min;
                    this.RowsInfo[CurRow].X1 = Row_x_max;
                    this.RowsInfo[CurRow].MaxTopBorder[CurPage + PageIndex] = TempMaxTopBorder;
                    this.RowsInfo[CurRow].MaxBotBorder = MaxBotBorder[CurRow];
                }
            }
            if (LastPage != CurPage) {
                var TempCellHeight = this.TableRowsBottom[CurRow][CurPage] - Y;
                TableHeight += TempCellHeight + MaxBotBorder[CurRow];
                if (null != CellSpacing) {
                    TableHeight += CellSpacing / 2;
                }
                if (border_Single === TableBorders.Bottom.Value) {
                    TableHeight += TableBorders.Bottom.Size;
                }
                this.Pages[CurPage].Bounds.Bottom = this.Pages[CurPage].YLimit;
                this.Pages[CurPage].Bounds.Left = X_min;
                this.Pages[CurPage].Bounds.Right = X_max;
                this.Pages[CurPage].Height = TableHeight;
                for (var PageId = CurPage + 1; PageId < LastPage; PageId++) {
                    Y = this.Parent.Get_PageContentStartPos(CurPage + PageId, CurRow, 0).Y;
                    TableHeight = 0;
                    if (null != CellSpacing) {
                        if (border_Single === TableBorders.Top.Value) {
                            Y += TableBorders.Top.Size;
                            TableHeight += TableBorders.Top.Size;
                        }
                        if (0 === CurRow) {
                            Y += CellSpacing;
                            TableHeight += CellSpacing;
                        } else {
                            Y += CellSpacing / 2;
                            TableHeight += CellSpacing / 2;
                        }
                    }
                    Y += Pages_Max_Top_Border[LastPage];
                    TableHeight += Pages_Max_Top_Border[LastPage];
                    TempCellHeight = this.TableRowsBottom[CurRow][PageId] - Y;
                    TableHeight += TempCellHeight + MaxBotBorder[CurRow];
                    if (null != CellSpacing) {
                        TableHeight += CellSpacing / 2;
                    }
                    if (border_Single === TableBorders.Bottom.Value) {
                        TableHeight += TableBorders.Bottom.Size;
                    }
                    this.Pages[PageId].Bounds.Bottom = this.Pages[PageId].YLimit;
                    this.Pages[PageId].Bounds.Left = X_min;
                    this.Pages[PageId].Bounds.Right = X_max;
                    this.Pages[PageId].Height = TableHeight;
                }
                TableHeight = 0;
                Y = this.Parent.Get_PageContentStartPos(LastPage).Y;
                if (null != CellSpacing) {
                    if (border_Single === TableBorders.Top.Value) {
                        Y += TableBorders.Top.Size;
                        TableHeight += TableBorders.Top.Size;
                    }
                    if (0 === CurRow) {
                        Y += CellSpacing;
                        TableHeight += CellSpacing;
                    } else {
                        Y += CellSpacing / 2;
                        TableHeight += CellSpacing / 2;
                    }
                }
                Y += Pages_Max_Top_Border[LastPage];
                TableHeight += Pages_Max_Top_Border[LastPage];
            }
            var CellHeight = this.TableRowsBottom[CurRow][LastPage] - Y;
            if (LastPage === CurPage && heightrule_AtLeast === RowH.HRule && CellHeight < RowH.Value) {
                CellHeight = RowH.Value;
                this.TableRowsBottom[CurRow][CurPage] = Y + CellHeight;
            }
            Y += CellHeight;
            TableHeight += CellHeight;
            Row.Height = CellHeight;
            Row.PagesCount = LastPage - CurPage + 1;
            Y += MaxBotBorder[CurRow];
            TableHeight += MaxBotBorder[CurRow];
            if (this.Content.length - 1 === CurRow) {
                if (null != CellSpacing) {
                    TableHeight += CellSpacing;
                    var TableBorder_Bottom = this.Get_Borders().Bottom;
                    if (border_Single === TableBorder_Bottom.Value) {
                        TableHeight += TableBorder_Bottom.Size;
                    }
                }
            }
            CurPage = LastPage;
        }
        for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
            var Row = this.Content[CurRow];
            var CellSpacing = Row.Get_CellSpacing();
            var StartPage = this.RowsInfo[CurRow].StartPage;
            var RowH = Row.Get_Height();
            for (var PageIndex = 0; PageIndex < this.RowsInfo[CurRow].Pages; PageIndex++) {
                var TempMaxTopBorder = this.RowsInfo[CurRow].MaxTopBorder[StartPage + PageIndex];
                var TempY = 0;
                if (null != CellSpacing) {
                    TempY = this.RowsInfo[CurRow].Y[StartPage + PageIndex];
                } else {
                    TempY = this.RowsInfo[CurRow].Y[StartPage + PageIndex] + TempMaxTopBorder;
                }
                var TempCellHeight = this.TableRowsBottom[CurRow][StartPage + PageIndex] - TempY;
                if (1 === this.RowsInfo[CurRow].Pages && heightrule_AtLeast === RowH.HRule && TempCellHeight < RowH.Value) {
                    TempCellHeight = RowH.Value;
                }
                if (null != CellSpacing) {
                    this.RowsInfo[CurRow].H[StartPage + PageIndex] = TempCellHeight;
                } else {
                    this.RowsInfo[CurRow].H[StartPage + PageIndex] = TempCellHeight + TempMaxTopBorder;
                }
            }
        }
        for (var Index = 0; Index < this.Pages.length - 1; Index++) {
            var CurRow = this.Pages[Index + 1].FirstRow;
            if (0 === CurRow && false === this.RowsInfo[CurRow].FirstPage) {
                this.Pages[Index].MaxBotBorder = 0;
                this.Pages[Index].BotBorders = new Array();
                continue;
            } else {
                if (false === this.RowsInfo[CurRow].FirstPage) {
                    CurRow--;
                }
            }
            var MaxBotBorder = 0;
            var BotBorders = new Array();
            if (this.Content.length - 1 === CurRow) {
                var Row = this.Content[CurRow];
                var CellsCount = Row.Get_CellsCount();
                for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                    var Cell = Row.Get_Cell(CurCell);
                    if (vmerge_Continue === Cell.Get_VMerge()) {
                        Cell = this.Internal_Get_StartMergedCell(CurRow, Row.Get_CellInfo(CurCell).StartGridCol, Cell.Get_GridSpan());
                    }
                    var Border_Info = Cell.Get_BorderInfo().Bottom;
                    for (var BorderId = 0; BorderId < Border_Info.length; BorderId++) {
                        var Border = Border_Info[BorderId];
                        if (border_Single === Border.Value && MaxBotBorder < Border.Size) {
                            MaxBotBorder = Border.Size;
                        }
                        BotBorders.push(Border);
                    }
                }
            } else {
                var Row = this.Content[CurRow];
                var CellSpacing = Row.Get_CellSpacing();
                var CellsCount = Row.Get_CellsCount();
                if (null != CellSpacing) {
                    for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                        var Cell = Row.Get_Cell(CurCell);
                        var Border = Cell.Get_Borders().Bottom;
                        if (border_Single === Border.Value && MaxBotBorder < Border.Size) {
                            MaxBotBorder = Border.Size;
                        }
                    }
                } else {
                    for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                        var Cell = Row.Get_Cell(CurCell);
                        if (vmerge_Continue === Cell.Get_VMerge()) {
                            Cell = this.Internal_Get_StartMergedCell(CurRow, Row.Get_CellInfo(CurCell).StartGridCol, Cell.Get_GridSpan());
                            if (null === Cell) {
                                BotBorders.push(TableBorders.Bottom);
                                continue;
                            }
                        }
                        var Border = Cell.Get_Borders().Bottom;
                        var Result_Border = this.Internal_CompareBorders(Border, TableBorders.Bottom, false, true);
                        if (border_Single === Result_Border.Value && MaxBotBorder < Result_Border.Size) {
                            MaxBotBorder = Result_Border.Size;
                        }
                        BotBorders.push(Result_Border);
                    }
                }
            }
            this.Pages[Index].MaxBotBorder = MaxBotBorder;
            this.Pages[Index].BotBorders = BotBorders;
        }
        this.Pages[CurPage].Bounds.Bottom = this.Pages[CurPage].Bounds.Top + TableHeight;
        this.Pages[CurPage].Bounds.Left = X_min;
        this.Pages[CurPage].Bounds.Right = X_max;
        this.Pages[CurPage].Height = TableHeight;
        this.Pages[CurPage].MaxBotBorder = 0;
        this.Pages[CurPage].BotBorders = new Array();
        this.TurnOffRecalc = false;
        this.Bounds = this.Pages[this.Pages.length - 1].Bounds;
    },
    Internal_Recalculate_Header: function () {
        if (true === this.Parent.Is_TableCellContent()) {
            this.HeaderInfo.Count = 0;
            return;
        }
        var Header_RowsCount = 0;
        var Rows_Count = this.Content.length;
        for (var Index = 0; Index < Rows_Count; Index++) {
            var Row = this.Content[Index];
            if (true != Row.Is_Header()) {
                break;
            }
            Header_RowsCount++;
        }
        for (var CurRow = Header_RowsCount - 1; CurRow >= 0; CurRow--) {
            var Row = this.Content[CurRow];
            var Cells_Count = Row.Get_CellsCount();
            var bContinue = false;
            for (var CurCell = 0; CurCell < Cells_Count; CurCell++) {
                var Cell = Row.Get_Cell(CurCell);
                var GridSpan = Cell.Get_GridSpan();
                var CurGridCol = Cell.Metrics.StartGridCol;
                var VMergeCount = this.Internal_GetVertMergeCount(CurRow, CurGridCol, GridSpan);
                if (VMergeCount > 1) {
                    Header_RowsCount--;
                    bContinue = true;
                    break;
                }
            }
            if (true != bContinue) {
                break;
            }
        }
        this.HeaderInfo.Count = Header_RowsCount;
    },
    Internal_Recalculate_Borders: function () {
        for (var Index = -1; Index < this.Content.length; Index++) {
            this.TableRowsBottom[Index] = new Array();
            this.TableRowsBottom[Index][0] = 0;
        }
        var MaxTopBorder = new Array();
        var MaxBotBorder = new Array();
        var MaxBotMargin = new Array();
        for (var Index = 0; Index < this.Content.length; Index++) {
            MaxBotBorder[Index] = 0;
            MaxTopBorder[Index] = 0;
            MaxBotMargin[Index] = 0;
        }
        var TablePr = this.Get_CompiledPr(false).TablePr;
        var TableBorders = this.Get_Borders();
        for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
            var Row = this.Content[CurRow];
            var CellsCount = Row.Get_CellsCount();
            var CellSpacing = Row.Get_CellSpacing();
            var BeforeInfo = Row.Get_Before();
            var AfterInfo = Row.Get_After();
            var CurGridCol = BeforeInfo.GridBefore;
            var bSpacing_Top = false;
            var bSpacing_Bot = false;
            if (null != CellSpacing) {
                bSpacing_Bot = true;
                bSpacing_Top = true;
            } else {
                if (0 != CurRow) {
                    var PrevCellSpacing = this.Content[CurRow - 1].Get_CellSpacing();
                    if (null != PrevCellSpacing) {
                        bSpacing_Top = true;
                    }
                }
                if (this.Content.length - 1 != CurRow) {
                    var NextCellSpacing = this.Content[CurRow + 1].Get_CellSpacing();
                    if (null != NextCellSpacing) {
                        bSpacing_Bot = true;
                    }
                }
            }
            Row.Set_SpacingInfo(bSpacing_Top, bSpacing_Bot);
            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                var Cell = Row.Get_Cell(CurCell);
                var GridSpan = Cell.Get_GridSpan();
                var Vmerge = Cell.Get_VMerge();
                Row.Set_CellInfo(CurCell, CurGridCol, 0, 0, 0, 0, 0, 0);
                if (vmerge_Continue === Vmerge) {
                    var VMergeCount2 = this.Internal_GetVertMergeCount2(CurRow, CurGridCol, GridSpan);
                    if (VMergeCount2 > 1) {
                        CurGridCol += GridSpan;
                        continue;
                    } else {
                        Cell.Set_VMerge(vmerge_Restart);
                    }
                }
                var VMergeCount = this.Internal_GetVertMergeCount(CurRow, CurGridCol, GridSpan);
                var CellMargins = Cell.Get_Margins();
                if (CellMargins.Bottom.W > MaxBotMargin[CurRow + VMergeCount - 1]) {
                    MaxBotMargin[CurRow + VMergeCount - 1] = CellMargins.Bottom.W;
                }
                var CellBorders = Cell.Get_Borders();
                if (true === bSpacing_Top) {
                    if (border_Single === CellBorders.Top.Value && MaxTopBorder[CurRow] < CellBorders.Top.Size) {
                        MaxTopBorder[CurRow] = CellBorders.Top.Size;
                    }
                    Cell.Set_BorderInfo_Top([CellBorders.Top]);
                } else {
                    if (0 === CurRow) {
                        var Result_Border = this.Internal_CompareBorders(TableBorders.Top, CellBorders.Top, true, false);
                        if (border_Single === Result_Border.Value && MaxTopBorder[CurRow] < Result_Border.Size) {
                            MaxTopBorder[CurRow] = Result_Border.Size;
                        }
                        var BorderInfo_Top = new Array();
                        for (var TempIndex = 0; TempIndex < GridSpan; TempIndex++) {
                            BorderInfo_Top.push(Result_Border);
                        }
                        Cell.Set_BorderInfo_Top(BorderInfo_Top);
                    } else {
                        var Prev_Row = this.Content[CurRow - 1];
                        var Prev_CellsCount = Prev_Row.Get_CellsCount();
                        var Prev_BeforeInfo = Prev_Row.Get_Before();
                        var Prev_AfterInfo = Prev_Row.Get_After();
                        var Prev_Pos = -1;
                        var Prev_GridCol = Prev_BeforeInfo.GridBefore;
                        for (var PrevCell = 0; PrevCell < Prev_CellsCount; PrevCell++) {
                            var Prev_Cell = Prev_Row.Get_Cell(PrevCell);
                            var Prev_GridSpan = Prev_Cell.Get_GridSpan();
                            if (Prev_GridCol <= CurGridCol + GridSpan - 1 && Prev_GridCol + Prev_GridSpan - 1 >= CurGridCol) {
                                Prev_Pos = PrevCell;
                                break;
                            }
                            Prev_GridCol += Prev_GridSpan;
                        }
                        var Border_Top_Info = new Array();
                        if (CurGridCol <= Prev_BeforeInfo.GridBefore - 1) {
                            var Result_Border = this.Internal_CompareBorders(TableBorders.Left, CellBorders.Top, true, false);
                            if (border_Single === Result_Border.Value && MaxTopBorder[CurRow] < Result_Border.Size) {
                                MaxTopBorder[CurRow] = Result_Border.Size;
                            }
                            var AddCount = Math.min(Prev_BeforeInfo.GridBefore - CurGridCol, GridSpan);
                            for (var TempIndex = 0; TempIndex < AddCount; TempIndex++) {
                                Border_Top_Info.push(Result_Border);
                            }
                        }
                        if (-1 != Prev_Pos) {
                            while (Prev_GridCol <= CurGridCol + GridSpan - 1 && Prev_Pos < Prev_CellsCount) {
                                var Prev_Cell = Prev_Row.Get_Cell(Prev_Pos);
                                var Prev_GridSpan = Prev_Cell.Get_GridSpan();
                                var Prev_VMerge = Prev_Cell.Get_VMerge();
                                if (vmerge_Continue === Prev_VMerge) {
                                    Prev_Cell = this.Internal_Get_StartMergedCell(CurRow - 1, Prev_GridCol, Prev_GridSpan);
                                }
                                var PrevBorders = Prev_Cell.Get_Borders();
                                var Result_Border = this.Internal_CompareBorders(PrevBorders.Bottom, CellBorders.Top, false, false);
                                if (border_Single === Result_Border.Value && MaxTopBorder[CurRow] < Result_Border.Size) {
                                    MaxTopBorder[CurRow] = Result_Border.Size;
                                }
                                var AddCount = 0;
                                if (Prev_GridCol >= CurGridCol) {
                                    if (Prev_GridCol + Prev_GridSpan - 1 > CurGridCol + GridSpan - 1) {
                                        AddCount = CurGridCol + GridSpan - Prev_GridCol;
                                    } else {
                                        AddCount = Prev_GridSpan;
                                    }
                                } else {
                                    if (Prev_GridCol + Prev_GridSpan - 1 > CurGridCol + GridSpan - 1) {
                                        AddCount = GridSpan;
                                    } else {
                                        AddCount = Prev_GridCol + Prev_GridSpan - CurGridCol;
                                    }
                                }
                                for (var TempIndex = 0; TempIndex < AddCount; TempIndex++) {
                                    Border_Top_Info.push(Result_Border);
                                }
                                Prev_Pos++;
                                Prev_GridCol += Prev_GridSpan;
                            }
                        }
                        if (Prev_AfterInfo.GridAfter > 0) {
                            var StartAfterGrid = Prev_Row.Get_CellInfo(Prev_CellsCount - 1).StartGridCol + Prev_Row.Get_Cell(Prev_CellsCount - 1).Get_GridSpan();
                            if (CurGridCol + GridSpan - 1 >= StartAfterGrid) {
                                var Result_Border = this.Internal_CompareBorders(TableBorders.Right, CellBorders.Top, true, false);
                                if (border_Single === Result_Border.Value && MaxTopBorder[CurRow] < Result_Border.Size) {
                                    MaxTopBorder[CurRow] = Result_Border.Size;
                                }
                                var AddCount = Math.min(CurGridCol + GridSpan - StartAfterGrid, GridSpan);
                                for (var TempIndex = 0; TempIndex < AddCount; TempIndex++) {
                                    Border_Top_Info.push(Result_Border);
                                }
                            }
                        }
                        Cell.Set_BorderInfo_Top(Border_Top_Info);
                    }
                }
                if (true === bSpacing_Bot) {
                    Cell.Set_BorderInfo_Bottom([CellBorders.Bottom], -1, -1);
                    if (border_Single === CellBorders.Bottom.Value && CellBorders.Bottom.Size > MaxBotBorder[CurRow + VMergeCount - 1]) {
                        MaxBotBorder[CurRow + VMergeCount - 1] = CellBorders.Bottom.Size;
                    }
                } else {
                    if (this.Content.length - 1 === CurRow + VMergeCount - 1) {
                        var Result_Border = this.Internal_CompareBorders(TableBorders.Bottom, CellBorders.Bottom, true, false);
                        if (border_Single === Result_Border.Value && Result_Border.Size > MaxBotBorder[CurRow + VMergeCount - 1]) {
                            MaxBotBorder[CurRow + VMergeCount - 1] = Result_Border.Size;
                        }
                        if (GridSpan > 0) {
                            for (var TempIndex = 0; TempIndex < GridSpan; TempIndex++) {
                                Cell.Set_BorderInfo_Bottom([Result_Border], -1, -1);
                            }
                        } else {
                            Cell.Set_BorderInfo_Bottom([], -1, -1);
                        }
                    } else {
                        var Next_Row = this.Content[CurRow + VMergeCount];
                        var Next_CellsCount = Next_Row.Get_CellsCount();
                        var Next_BeforeInfo = Next_Row.Get_Before();
                        var Next_AfterInfo = Next_Row.Get_After();
                        var Border_Bottom_Info = new Array();
                        var BeforeCount = 0;
                        if (CurGridCol <= Next_BeforeInfo.GridBefore - 1) {
                            var Result_Border = this.Internal_CompareBorders(TableBorders.Left, CellBorders.Bottom, true, false);
                            BeforeCount = Math.min(Next_BeforeInfo.GridBefore - CurGridCol, GridSpan);
                            for (var TempIndex = 0; TempIndex < BeforeCount; TempIndex++) {
                                Border_Bottom_Info.push(Result_Border);
                            }
                        }
                        var Next_GridCol = Next_BeforeInfo.GridBefore;
                        for (var NextCell = 0; NextCell < Next_CellsCount; NextCell++) {
                            var Next_Cell = Next_Row.Get_Cell(NextCell);
                            var Next_GridSpan = Next_Cell.Get_GridSpan();
                            Next_GridCol += Next_GridSpan;
                        }
                        var AfterCount = 0;
                        if (Next_AfterInfo.GridAfter > 0) {
                            var StartAfterGrid = Next_GridCol;
                            if (CurGridCol + GridSpan - 1 >= StartAfterGrid) {
                                var Result_Border = this.Internal_CompareBorders(TableBorders.Right, CellBorders.Bottom, true, false);
                                AfterCount = Math.min(CurGridCol + GridSpan - StartAfterGrid, GridSpan);
                                for (var TempIndex = 0; TempIndex < AfterCount; TempIndex++) {
                                    Border_Bottom_Info.push(Result_Border);
                                }
                            }
                        }
                        Cell.Set_BorderInfo_Bottom(Border_Bottom_Info, BeforeCount, AfterCount);
                    }
                }
                CurGridCol += GridSpan;
            }
        }
        this.MaxTopBorder = MaxTopBorder;
        this.MaxBotBorder = MaxBotBorder;
        this.MaxBotMargin = MaxBotMargin;
        for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
            var Row = this.Content[CurRow];
            var CellsCount = Row.Get_CellsCount();
            var CellSpacing = Row.Get_CellSpacing();
            var BeforeInfo = Row.Get_Before();
            var AfterInfo = Row.Get_After();
            var CurGridCol = BeforeInfo.GridBefore;
            var Row_x_max = 0;
            var Row_x_min = 0;
            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                var Cell = Row.Get_Cell(CurCell);
                var GridSpan = Cell.Get_GridSpan();
                var Vmerge = Cell.Get_VMerge();
                var X_grid_start = this.TableSumGrid[CurGridCol - 1];
                var X_grid_end = this.TableSumGrid[CurGridCol + GridSpan - 1];
                var X_cell_start = X_grid_start;
                var X_cell_end = X_grid_end;
                if (null != CellSpacing) {
                    if (0 === CurCell) {
                        if (0 === BeforeInfo.GridBefore) {
                            if (border_None === TableBorders.Left.Value || CellSpacing > TableBorders.Left.Size / 2) {
                                X_cell_start += CellSpacing;
                            } else {
                                X_cell_start += TableBorders.Left.Size / 2;
                            }
                        } else {
                            if (border_None === TableBorders.Left.Value || CellSpacing > TableBorders.Left.Size) {
                                X_cell_start += CellSpacing / 2;
                            } else {
                                X_cell_start += TableBorders.Left.Size / 2;
                            }
                        }
                    } else {
                        X_cell_start += CellSpacing / 2;
                    }
                    if (CellsCount - 1 === CurCell) {
                        if (0 === AfterInfo.GridAfter) {
                            if (border_None === TableBorders.Right.Value || CellSpacing > TableBorders.Right.Size / 2) {
                                X_cell_end -= CellSpacing;
                            } else {
                                X_cell_end -= TableBorders.Right.Size / 2;
                            }
                        } else {
                            if (border_None === TableBorders.Right.Value || CellSpacing > TableBorders.Right.Size) {
                                X_cell_end -= CellSpacing / 2;
                            } else {
                                X_cell_end -= TableBorders.Right.Size / 2;
                            }
                        }
                    } else {
                        X_cell_end -= CellSpacing / 2;
                    }
                }
                var CellMar = Cell.Get_Margins();
                var VMergeCount = this.Internal_GetVertMergeCount(CurRow, CurGridCol, GridSpan);
                var X_content_start = X_cell_start;
                var X_content_end = X_cell_end;
                var CellBorders = Cell.Get_Borders();
                if (null != CellSpacing) {
                    X_content_start += CellMar.Left.W;
                    X_content_end -= CellMar.Right.W;
                    if (border_Single === CellBorders.Left.Value) {
                        X_content_start += CellBorders.Left.Size;
                    }
                    if (border_Single === CellBorders.Right.Value) {
                        X_content_end -= CellBorders.Right.Size;
                    }
                } else {
                    if (vmerge_Continue === Vmerge) {
                        X_content_start += CellMar.Left.W;
                        X_content_end -= CellMar.Right.W;
                    } else {
                        var Max_r_w = 0;
                        var Max_l_w = 0;
                        var Borders_Info = {
                            Right: new Array(),
                            Left: new Array(),
                            Right_Max: 0,
                            Left_Max: 0
                        };
                        for (var Temp_CurRow = 0; Temp_CurRow < VMergeCount; Temp_CurRow++) {
                            var Temp_Row = this.Content[CurRow + Temp_CurRow];
                            var Temp_CellsCount = Temp_Row.Get_CellsCount();
                            var Temp_CurCell = this.Internal_Get_Cell_ByStartGridCol(CurRow + Temp_CurRow, CurGridCol);
                            if (Temp_CurCell < 0) {
                                continue;
                            }
                            if (0 === Temp_CurCell) {
                                var LeftBorder = this.Internal_CompareBorders(TableBorders.Left, CellBorders.Left, true, false);
                                if (border_Single === LeftBorder.Value && LeftBorder.Size > Max_l_w) {
                                    Max_l_w = LeftBorder.Size;
                                }
                                Borders_Info.Left.push(LeftBorder);
                            } else {
                                var Temp_Prev_Cell = Temp_Row.Get_Cell(Temp_CurCell - 1);
                                var Temp_Prev_VMerge = Temp_Prev_Cell.Get_VMerge();
                                if (0 != Temp_CurRow && vmerge_Continue === Temp_Prev_VMerge) {
                                    Borders_Info.Left.push(Borders_Info.Left[Borders_Info.Left.length - 1]);
                                } else {
                                    var Temp_Prev_Main_Cell = this.Internal_Get_StartMergedCell(CurRow + Temp_CurRow, CurGridCol - Temp_Prev_Cell.Get_GridSpan(), Temp_Prev_Cell.Get_GridSpan());
                                    var Temp_Prev_Main_Cell_Borders = Temp_Prev_Main_Cell.Get_Borders();
                                    var LeftBorder = this.Internal_CompareBorders(Temp_Prev_Main_Cell_Borders.Right, CellBorders.Left, false, false);
                                    if (border_Single === LeftBorder.Value && LeftBorder.Size > Max_l_w) {
                                        Max_l_w = LeftBorder.Size;
                                    }
                                    Borders_Info.Left.push(LeftBorder);
                                }
                            }
                            if (Temp_CellsCount - 1 === Temp_CurCell) {
                                var RightBorder = this.Internal_CompareBorders(TableBorders.Right, CellBorders.Right, true, false);
                                if (border_Single === RightBorder.Value && RightBorder.Size > Max_r_w) {
                                    Max_r_w = RightBorder.Size;
                                }
                                Borders_Info.Right.push(RightBorder);
                            } else {
                                var Temp_Next_Cell = Temp_Row.Get_Cell(Temp_CurCell + 1);
                                var Temp_Next_VMerge = Temp_Next_Cell.Get_VMerge();
                                if (0 != Temp_CurRow && vmerge_Continue === Temp_Next_VMerge) {
                                    Borders_Info.Right.push(Borders_Info.Right[Borders_Info.Right.length - 1]);
                                } else {
                                    var Temp_Next_Main_Cell = this.Internal_Get_StartMergedCell(CurRow + Temp_CurRow, CurGridCol + GridSpan, Temp_Next_Cell.Get_GridSpan());
                                    var Temp_Next_Main_Cell_Borders = Temp_Next_Main_Cell.Get_Borders();
                                    var RightBorder = this.Internal_CompareBorders(Temp_Next_Main_Cell_Borders.Left, CellBorders.Right, false, false);
                                    if (border_Single === RightBorder.Value && RightBorder.Size > Max_r_w) {
                                        Max_r_w = RightBorder.Size;
                                    }
                                    Borders_Info.Right.push(RightBorder);
                                }
                            }
                        }
                        Borders_Info.Right_Max = Max_r_w;
                        Borders_Info.Left_Max = Max_l_w;
                        if (Max_l_w / 2 > CellMar.Left.W) {
                            X_content_start += Max_l_w / 2;
                        } else {
                            X_content_start += CellMar.Left.W;
                        }
                        if (Max_r_w / 2 > CellMar.Right.W) {
                            X_content_end -= Max_r_w / 2;
                        } else {
                            X_content_end -= CellMar.Right.W;
                        }
                        Cell.Set_BorderInfo_Left(Borders_Info.Left, Max_l_w);
                        Cell.Set_BorderInfo_Right(Borders_Info.Right, Max_r_w);
                    }
                }
                if (0 === CurCell) {
                    if (null != CellSpacing) {
                        Row_x_min = X_grid_start;
                        if (border_Single === TableBorders.Left.Value) {
                            Row_x_min -= TableBorders.Left.Size / 2;
                        }
                    } else {
                        var BorderInfo = Cell.Get_BorderInfo();
                        Row_x_min = X_grid_start - BorderInfo.MaxLeft / 2;
                    }
                }
                if (CellsCount - 1 === CurCell) {
                    if (null != CellSpacing) {
                        Row_x_max = X_grid_end;
                        if (border_Single === TableBorders.Right.Value) {
                            Row_x_max += TableBorders.Right.Size / 2;
                        }
                    } else {
                        var BorderInfo = Cell.Get_BorderInfo();
                        Row_x_max = X_grid_end + BorderInfo.MaxRight / 2;
                    }
                }
                Cell.Set_Metrics(CurGridCol, X_grid_start, X_grid_end, X_cell_start, X_cell_end, X_content_start, X_content_end);
                CurGridCol += GridSpan;
            }
            Row.Set_Metrics_X(Row_x_min, Row_x_max);
        }
        this.RecalcInfo.TableBorders = false;
    },
    Internal_Recalculate_Position_1: function () {
        var TablePr = this.Get_CompiledPr(false).TablePr;
        var PageLimits = this.Parent.Get_PageLimits(this.PageNum);
        if (true === this.Is_Inline()) {
            switch (TablePr.Jc) {
            case align_Left:
                this.X = this.X_origin + this.Get_TableOffsetCorrection() + TablePr.TableInd;
                break;
            case align_Right:
                var TableWidth = this.TableSumGrid[this.TableSumGrid.length - 1];
                if (false === this.Parent.Is_TableCellContent()) {
                    this.X = this.XLimit - TableWidth + 1.9;
                } else {
                    this.X = this.XLimit - TableWidth;
                }
                break;
            case align_Center:
                var TableWidth = this.TableSumGrid[this.TableSumGrid.length - 1];
                var RangeWidth = this.XLimit - this.X_origin;
                this.X = this.X_origin + (RangeWidth - TableWidth) / 2;
                break;
            }
            this.AnchorPosition.CalcX = this.X_origin + TablePr.TableInd;
            this.AnchorPosition.Set_X(this.TableSumGrid[this.TableSumGrid.length - 1], this.X_origin, X_Left_Field, X_Right_Field, Page_Width, PageLimits.X, PageLimits.XLimit);
        } else {
            var OffsetCorrection_Left = 0;
            var OffsetCorrection_Right = 0;
            if (this.Content.length > 0 && this.Content[0].Get_CellsCount() > 0) {
                var FirstRow = this.Content[0];
                var Cell_Left = FirstRow.Get_Cell(0);
                var Cell_Right = FirstRow.Get_Cell(FirstRow.Get_CellsCount() - 1);
                OffsetCorrection_Left = Cell_Left.Get_Margins().Left.W;
                OffsetCorrection_Right = Cell_Right.Get_Margins().Right.W;
            }
            this.X = this.X_origin + this.Get_TableOffsetCorrection();
            this.AnchorPosition.Set_X(this.TableSumGrid[this.TableSumGrid.length - 1], this.X_origin, X_Left_Field - OffsetCorrection_Left, X_Right_Field + OffsetCorrection_Right, Page_Width, PageLimits.X - OffsetCorrection_Left, PageLimits.XLimit + OffsetCorrection_Right);
            this.X = this.AnchorPosition.Calculate_X(this.PositionH.RelativeFrom, this.PositionH.Align, this.PositionH.Value);
            this.X_origin = this.X - this.Get_TableOffsetCorrection();
            if (undefined != this.PositionH_Old) {
                this.PositionH.RelativeFrom = this.PositionH_Old.RelativeFrom;
                this.PositionH.Align = this.PositionH_Old.Align;
                this.PositionH.Value = this.PositionH_Old.Value;
                var Value = this.AnchorPosition.Calculate_X_Value(this.PositionH_Old.RelativeFrom);
                this.Set_PositionH(this.PositionH_Old.RelativeFrom, false, Value);
                this.X = this.AnchorPosition.Calculate_X(this.PositionH.RelativeFrom, this.PositionH.Align, this.PositionH.Value);
                this.X_origin = this.X - this.Get_TableOffsetCorrection();
                this.PositionH_Old = undefined;
            }
        }
    },
    Internal_Recalculate_Position_2: function (CurPage) {
        var PageLimits = this.Parent.Get_PageLimits(this.PageNum);
        if (true === this.Is_Inline() && 0 === CurPage) {
            this.AnchorPosition.CalcY = this.Y;
            this.AnchorPosition.Set_Y(this.Pages[CurPage].Height, this.Y, Y_Top_Field, Y_Bottom_Field, Page_Height, PageLimits.Y, PageLimits.YLimit);
        } else {
            if (true != this.Is_Inline() && (0 === CurPage || (1 === CurPage && false === this.RowsInfo[0].FirstPage))) {
                this.AnchorPosition.Set_Y(this.Pages[CurPage].Height, this.Pages[CurPage].Y, Y_Top_Field, Y_Bottom_Field, Page_Height, PageLimits.Y, PageLimits.YLimit);
                var OtherFlowTables = [];
                this.AnchorPosition.Calculate_Y(this.PositionV.RelativeFrom, this.PositionV.Align, this.PositionV.Value);
                this.AnchorPosition.Correct_Values(PageLimits.X, PageLimits.Y, PageLimits.XLimit, PageLimits.YLimit, this.AllowOverlap, OtherFlowTables, this);
                if (undefined != this.PositionV_Old) {
                    this.PositionV.RelativeFrom = this.PositionV_Old.RelativeFrom;
                    this.PositionV.Align = this.PositionV_Old.Align;
                    this.PositionV.Value = this.PositionV_Old.Value;
                    var Value = this.AnchorPosition.Calculate_Y_Value(this.PositionV_Old.RelativeFrom);
                    this.Set_PositionV(this.PositionV_Old.RelativeFrom, false, Value);
                    this.AnchorPosition.Calculate_Y(this.PositionV.RelativeFrom, this.PositionV.Align, this.PositionV.Value);
                    this.PositionV_Old = undefined;
                }
                var NewX = this.AnchorPosition.CalcX;
                var NewY = this.AnchorPosition.CalcY;
                this.Shift(CurPage, NewX - this.Pages[CurPage].X, NewY - this.Pages[CurPage].Y);
            }
        }
    },
    Internal_Recalculate_1_: function (CurPage) {
        if (true === this.TurnOffRecalc) {
            return;
        }
        this.TurnOffRecalc = true;
        var FirstRow = 0;
        var LastRow = 0;
        if (0 === CurPage) {
            for (var Index = -1; Index < this.Content.length; Index++) {
                this.TableRowsBottom[Index] = new Array();
                this.TableRowsBottom[Index][0] = 0;
            }
        } else {
            FirstRow = this.Pages[CurPage - 1].LastRow;
            LastRow = FirstRow;
        }
        var MaxTopBorder = this.MaxTopBorder;
        var MaxBotBorder = this.MaxBotBorder;
        var MaxBotMargin = this.MaxBotMargin;
        var TempMaxTopBorder = this.Get_MaxTopBorder(FirstRow);
        var StartPos;
        if (0 === CurPage) {
            StartPos = {
                X: this.X,
                XLimit: this.XLimit,
                Y: this.Y,
                YLimit: this.YLimit,
                MaxTopBorder: TempMaxTopBorder
            };
            this.HeaderInfo.PageIndex = -1;
        } else {
            StartPos = this.Parent.Get_PageContentStartPos(CurPage);
        }
        this.Pages[CurPage] = new CTablePage(StartPos.X, StartPos.Y, StartPos.XLimit, StartPos.YLimit, FirstRow, TempMaxTopBorder);
        var Y = StartPos.Y;
        var TableHeight = 0;
        var TableBorders = this.Get_Borders();
        var X_max = -1;
        var X_min = -1;
        if (this.HeaderInfo.Count > 0 && this.HeaderInfo.PageIndex != -1 && CurPage > this.HeaderInfo.PageIndex) {
            this.HeaderInfo.Pages[CurPage] = new Object();
            this.HeaderInfo.Pages[CurPage].RowsInfo = new Array();
            var HeaderPage = this.HeaderInfo.Pages[CurPage];
            HeaderPage.Draw = true;
            HeaderPage.Rows = new Array();
            g_oTableId.m_bTurnOff = true;
            for (var Index = 0; Index < this.HeaderInfo.Count; Index++) {
                HeaderPage.Rows[Index] = this.Content[Index].Copy(this);
                HeaderPage.Rows[Index].Index = Index;
            }
            g_oTableId.m_bTurnOff = false;
            var bHeaderNextPage = false;
            for (var CurRow = 0; CurRow < this.HeaderInfo.Count; CurRow++) {
                HeaderPage.RowsInfo[CurRow] = new Object();
                HeaderPage.RowsInfo[CurRow].Y = 0;
                HeaderPage.RowsInfo[CurRow].H = 0;
                HeaderPage.RowsInfo[CurRow].TopDy = 0;
                HeaderPage.RowsInfo[CurRow].MaxTopBorder = 0;
                HeaderPage.RowsInfo[CurRow].TableRowsBottom = 0;
                var Row = HeaderPage.Rows[CurRow];
                var CellsCount = Row.Get_CellsCount();
                var CellSpacing = Row.Get_CellSpacing();
                var BeforeInfo = Row.Get_Before();
                var CurGridCol = BeforeInfo.GridBefore;
                Y += MaxTopBorder[CurRow];
                TableHeight += MaxTopBorder[CurRow];
                if (0 === CurRow) {
                    if (null != CellSpacing) {
                        var TableBorder_Top = this.Get_Borders().Top;
                        if (border_Single === TableBorder_Top.Value) {
                            Y += TableBorder_Top.Size;
                            TableHeight += TableBorder_Top.Size;
                        }
                        Y += CellSpacing;
                        TableHeight += CellSpacing;
                    }
                } else {
                    var PrevCellSpacing = HeaderPage.Rows[CurRow - 1].Get_CellSpacing();
                    if (null != CellSpacing && null != PrevCellSpacing) {
                        Y += (PrevCellSpacing + CellSpacing) / 2;
                        TableHeight += (PrevCellSpacing + CellSpacing) / 2;
                    } else {
                        if (null != CellSpacing) {
                            Y += CellSpacing / 2;
                            TableHeight += CellSpacing / 2;
                        } else {
                            if (null != PrevCellSpacing) {
                                Y += PrevCellSpacing / 2;
                                TableHeight += PrevCellSpacing / 2;
                            }
                        }
                    }
                }
                var Row_x_max = Row.Metrics.X_max;
                var Row_x_min = Row.Metrics.X_min;
                if (-1 === X_min || Row_x_min < X_min) {
                    X_min = Row_x_min;
                }
                if (-1 === X_max || Row_x_max > X_max) {
                    X_max = Row_x_max;
                }
                var MaxBotValue_vmerge = -1;
                var RowH = Row.Get_Height();
                for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                    var Cell = Row.Get_Cell(CurCell);
                    var GridSpan = Cell.Get_GridSpan();
                    var Vmerge = Cell.Get_VMerge();
                    var CellMar = Cell.Get_Margins();
                    Row.Update_CellInfo(CurCell, this.X);
                    var CellMetrics = Row.Get_CellInfo(CurCell);
                    var X_content_start = CellMetrics.X_content_start;
                    var X_content_end = CellMetrics.X_content_end;
                    var Y_content_start = Y + CellMar.Top.W;
                    var Y_content_end = this.Pages[CurPage].YLimit;
                    if (null != CellSpacing) {
                        if (this.Content.length - 1 === CurRow) {
                            Y_content_end -= CellSpacing;
                        } else {
                            Y_content_end -= CellSpacing / 2;
                        }
                    }
                    var VMergeCount = this.Internal_GetVertMergeCount(CurRow, CurGridCol, GridSpan);
                    var BottomMargin = this.MaxBotMargin[CurRow + VMergeCount - 1];
                    Y_content_end -= BottomMargin;
                    Cell.Temp.Y = Y_content_start;
                    if (VMergeCount > 1) {
                        CurGridCol += GridSpan;
                        continue;
                    } else {
                        if (vmerge_Restart != Vmerge) {
                            Cell = this.Internal_Get_StartMergedCell(CurRow, CurGridCol, GridSpan);
                            var cIndex = Cell.Index;
                            var rIndex = Cell.Row.Index;
                            Cell = HeaderPage.Rows[rIndex].Get_Cell(cIndex);
                            CellMar = Cell.Get_Margins();
                            Y_content_start = Cell.Temp.Y + CellMar.Top.W;
                        }
                    }
                    Cell.Content.Set_StartPage(CurPage);
                    Cell.Content.Reset(X_content_start, Y_content_start, X_content_end, 20000);
                    if (recalcresult2_NextPage === Cell.Content.Recalculate_Page(0, true)) {
                        bHeaderNextPage = true;
                        break;
                    }
                    var CellContentBounds = Cell.Content.Get_PageBounds(0);
                    var CellContentBounds_Bottom = CellContentBounds.Bottom + BottomMargin;
                    if (undefined === HeaderPage.RowsInfo[CurRow].TableRowsBottom || HeaderPage.RowsInfo[CurRow].TableRowsBottom < CellContentBounds_Bottom) {
                        HeaderPage.RowsInfo[CurRow].TableRowsBottom = CellContentBounds_Bottom;
                    }
                    if (vmerge_Continue === Vmerge) {
                        if (-1 === MaxBotValue_vmerge || MaxBotValue_vmerge < CellContentBounds_Bottom) {
                            MaxBotValue_vmerge = CellContentBounds_Bottom;
                        }
                    }
                    CurGridCol += GridSpan;
                }
                if (true === bHeaderNextPage) {
                    Y = StartPos.Y;
                    TableHeight = 0;
                    HeaderPage.Draw = false;
                    break;
                }
                var TempY = Y;
                var TempMaxTopBorder = MaxTopBorder[CurRow];
                if (null != CellSpacing) {
                    HeaderPage.RowsInfo[CurRow].Y = TempY;
                    HeaderPage.RowsInfo[CurRow].TopDy = 0;
                    HeaderPage.RowsInfo[CurRow].X0 = Row_x_min;
                    HeaderPage.RowsInfo[CurRow].X1 = Row_x_max;
                    HeaderPage.RowsInfo[CurRow].MaxTopBorder = TempMaxTopBorder;
                    HeaderPage.RowsInfo[CurRow].MaxBotBorder = MaxBotBorder[CurRow];
                } else {
                    HeaderPage.RowsInfo[CurRow].Y = TempY - TempMaxTopBorder;
                    HeaderPage.RowsInfo[CurRow].TopDy = TempMaxTopBorder;
                    HeaderPage.RowsInfo[CurRow].X0 = Row_x_min;
                    HeaderPage.RowsInfo[CurRow].X1 = Row_x_max;
                    HeaderPage.RowsInfo[CurRow].MaxTopBorder = TempMaxTopBorder;
                    HeaderPage.RowsInfo[CurRow].MaxBotBorder = MaxBotBorder[CurRow];
                }
                var CellHeight = HeaderPage.RowsInfo[CurRow].TableRowsBottom - Y;
                if (false === bNextPage && heightrule_AtLeast === RowH.HRule && CellHeight < RowH.Value - MaxTopBorder[CurRow]) {
                    CellHeight = RowH.Value - MaxTopBorder[CurRow];
                    HeaderPage.RowsInfo[CurRow].TableRowsBottom = Y + CellHeight;
                }
                if (null != CellSpacing) {
                    HeaderPage.RowsInfo[CurRow].H = CellHeight;
                } else {
                    HeaderPage.RowsInfo[CurRow].H = CellHeight + TempMaxTopBorder;
                }
                Y += CellHeight;
                TableHeight += CellHeight;
                Row.Height = CellHeight;
                Y += MaxBotBorder[CurRow];
                TableHeight += MaxBotBorder[CurRow];
            }
            if (false === bHeaderNextPage) {
                for (var CurRow = 0; CurRow < this.HeaderInfo.Count; CurRow++) {
                    var Row = HeaderPage.Rows[CurRow];
                    var CellsCount = Row.Get_CellsCount();
                    for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                        var Cell = Row.Get_Cell(CurCell);
                        var VMergeCount = this.Internal_GetVertMergeCount(CurRow, Cell.Metrics.StartGridCol, Cell.Get_GridSpan());
                        if (VMergeCount > 1) {
                            continue;
                        } else {
                            var Vmerge = Cell.Get_VMerge();
                            if (vmerge_Restart != Vmerge) {
                                Cell = this.Internal_Get_StartMergedCell(CurRow, Cell.Metrics.StartGridCol, Cell.Get_GridSpan());
                                var cIndex = Cell.Index;
                                var rIndex = Cell.Row.Index;
                                Cell = HeaderPage.Rows[rIndex].Get_Cell(cIndex);
                            }
                        }
                        var CellMar = Cell.Get_Margins();
                        var VAlign = Cell.Get_VAlign();
                        var CellPageIndex = CurPage - Cell.Content.Get_StartPage_Relative();
                        if (CellPageIndex >= Cell.PagesCount) {
                            continue;
                        }
                        if (vertalignjc_Top === VAlign || CellPageIndex > 1) {
                            Cell.Temp.Y_VAlign_offset[CellPageIndex] = 0;
                            continue;
                        }
                        var TempCurRow = Cell.Row.Index;
                        var TempCellSpacing = HeaderPage.Rows[TempCurRow].Get_CellSpacing();
                        var Y_0 = HeaderPage.RowsInfo[TempCurRow].Y;
                        if (null === TempCellSpacing) {
                            Y_0 += MaxTopBorder[TempCurRow];
                        }
                        Y_0 += CellMar.Top.W;
                        var Y_1 = HeaderPage.RowsInfo[CurRow].TableRowsBottom - CellMar.Bottom.W;
                        var CellHeight = Y_1 - Y_0;
                        var CellContentBounds = Cell.Content.Get_PageBounds(CellPageIndex);
                        var ContentHeight = CellContentBounds.Bottom - CellContentBounds.Top;
                        var Dy = 0;
                        if (CellHeight - ContentHeight > 0.001) {
                            if (vertalignjc_Bottom === VAlign) {
                                Dy = CellHeight - ContentHeight;
                            } else {
                                if (vertalignjc_Center === VAlign) {
                                    Dy = (CellHeight - ContentHeight) / 2;
                                }
                            }
                            Cell.Content.Shift(CellPageIndex, 0, Dy);
                        }
                        Cell.Temp.Y_VAlign_offset[CellPageIndex] = Dy;
                    }
                }
            }
        } else {
            this.HeaderInfo.Pages[CurPage] = new Object();
            this.HeaderInfo.Pages[CurPage].Draw = false;
        }
        var bNextPage = false;
        for (var CurRow = FirstRow; CurRow < this.Content.length; CurRow++) {
            if ((0 === CurRow && 0 === CurPage) || CurRow != FirstRow) {
                this.RowsInfo[CurRow] = new Object();
                this.RowsInfo[CurRow].Pages = 1;
                this.RowsInfo[CurRow].Y = new Array();
                this.RowsInfo[CurRow].H = new Array();
                this.RowsInfo[CurRow].TopDy = new Array();
                this.RowsInfo[CurRow].MaxTopBorder = new Array();
                this.RowsInfo[CurRow].FirstPage = true;
                this.RowsInfo[CurRow].StartPage = CurPage;
            } else {
                this.RowsInfo[CurRow].Pages++;
            }
            this.TableRowsBottom[CurRow] = new Array();
            var Row = this.Content[CurRow];
            var CellsCount = Row.Get_CellsCount();
            var CellSpacing = Row.Get_CellSpacing();
            var BeforeInfo = Row.Get_Before();
            var AfterInfo = Row.Get_After();
            var CurGridCol = BeforeInfo.GridBefore;
            Y += MaxTopBorder[CurRow];
            TableHeight += MaxTopBorder[CurRow];
            if (FirstRow === CurRow) {
                if (null != CellSpacing) {
                    var TableBorder_Top = this.Get_Borders().Top;
                    if (border_Single === TableBorder_Top.Value) {
                        Y += TableBorder_Top.Size;
                        TableHeight += TableBorder_Top.Size;
                    }
                    if (true === this.HeaderInfo.Pages[CurPage].Draw || (0 === CurRow && (0 === CurPage || (1 === CurPage && false === this.RowsInfo[0].FirstPage)))) {
                        Y += CellSpacing;
                        TableHeight += CellSpacing;
                    } else {
                        Y += CellSpacing / 2;
                        TableHeight += CellSpacing / 2;
                    }
                }
            } else {
                var PrevCellSpacing = this.Content[CurRow - 1].Get_CellSpacing();
                if (null != CellSpacing && null != PrevCellSpacing) {
                    Y += (PrevCellSpacing + CellSpacing) / 2;
                    TableHeight += (PrevCellSpacing + CellSpacing) / 2;
                } else {
                    if (null != CellSpacing) {
                        Y += CellSpacing / 2;
                        TableHeight += CellSpacing / 2;
                    } else {
                        if (null != PrevCellSpacing) {
                            Y += PrevCellSpacing / 2;
                            TableHeight += PrevCellSpacing / 2;
                        }
                    }
                }
            }
            var Row_x_max = Row.Metrics.X_max;
            var Row_x_min = Row.Metrics.X_min;
            if (-1 === X_min || Row_x_min < X_min) {
                X_min = Row_x_min;
            }
            if (-1 === X_max || Row_x_max > X_max) {
                X_max = Row_x_max;
            }
            var MaxBotValue_vmerge = -1;
            var RowH = Row.Get_Height();
            var Merged_Cell = new Array();
            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                var Cell = Row.Get_Cell(CurCell);
                var GridSpan = Cell.Get_GridSpan();
                var Vmerge = Cell.Get_VMerge();
                var CellMar = Cell.Get_Margins();
                Row.Update_CellInfo(CurCell, this.X);
                var CellMetrics = Row.Get_CellInfo(CurCell);
                var X_content_start = CellMetrics.X_content_start;
                var X_content_end = CellMetrics.X_content_end;
                var Y_content_start = Y + CellMar.Top.W;
                var Y_content_end = this.Pages[CurPage].YLimit;
                if (null != CellSpacing) {
                    if (this.Content.length - 1 === CurRow) {
                        Y_content_end -= CellSpacing;
                    } else {
                        Y_content_end -= CellSpacing / 2;
                    }
                }
                var VMergeCount = this.Internal_GetVertMergeCount(CurRow, CurGridCol, GridSpan);
                var BottomMargin = this.MaxBotMargin[CurRow + VMergeCount - 1];
                Y_content_end -= BottomMargin;
                Cell.Temp.Y = Y_content_start;
                if (VMergeCount > 1) {
                    CurGridCol += GridSpan;
                    Merged_Cell.push(Cell);
                    continue;
                } else {
                    if (vmerge_Restart != Vmerge) {
                        Cell = this.Internal_Get_StartMergedCell(CurRow, CurGridCol, GridSpan);
                        CellMar = Cell.Get_Margins();
                        Y_content_start = Cell.Temp.Y + CellMar.Top.W;
                    }
                }
                if ((0 === Cell.Row.Index && 0 === CurPage) || Cell.Row.Index > FirstRow) {
                    Cell.PagesCount = 1;
                    Cell.Content.Set_StartPage(CurPage);
                    Cell.Content.Reset(X_content_start, Y_content_start, X_content_end, 20000);
                }
                var CellPageIndex = CurPage - Cell.Content.Get_StartPage_Relative();
                if (CellPageIndex < Cell.PagesCount) {
                    if (recalcresult2_NextPage === Cell.Content.Recalculate_Page(CellPageIndex, true)) {
                        Cell.PagesCount = Cell.Content.Pages.length + 1;
                        bNextPage = true;
                    }
                    var CellContentBounds = Cell.Content.Get_PageBounds(CellPageIndex);
                    var CellContentBounds_Bottom = CellContentBounds.Bottom + BottomMargin;
                    if (undefined === this.TableRowsBottom[CurRow][CurPage] || this.TableRowsBottom[CurRow][CurPage] < CellContentBounds_Bottom) {
                        this.TableRowsBottom[CurRow][CurPage] = CellContentBounds_Bottom;
                    }
                    if (vmerge_Continue === Vmerge) {
                        if (-1 === MaxBotValue_vmerge || MaxBotValue_vmerge < CellContentBounds_Bottom) {
                            MaxBotValue_vmerge = CellContentBounds_Bottom;
                        }
                    }
                }
                CurGridCol += GridSpan;
            }
            if (true === bNextPage) {
                var bContentOnFirstPage = false;
                for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                    var Cell = Row.Get_Cell(CurCell);
                    var Vmerge = Cell.Get_VMerge();
                    var VMergeCount = this.Internal_GetVertMergeCount(CurRow, Cell.Metrics.StartGridCol, Cell.Get_GridSpan());
                    if (vmerge_Continue === Vmerge || VMergeCount > 1) {
                        continue;
                    }
                    if (true === Cell.Content_Is_ContentOnFirstPage()) {
                        bContentOnFirstPage = true;
                        break;
                    }
                }
                this.RowsInfo[CurRow].FirstPage = bContentOnFirstPage;
                if (0 != CurRow && false === this.RowsInfo[CurRow].FirstPage) {
                    if (this.TableRowsBottom[CurRow - 1][CurPage] < MaxBotValue_vmerge) {
                        var Diff = MaxBotValue_vmerge - this.TableRowsBottom[CurRow - 1][CurPage];
                        this.TableRowsBottom[CurRow - 1][CurPage] = MaxBotValue_vmerge;
                        this.RowsInfo[CurRow - 1].H[CurPage] += Diff;
                    }
                }
                var CellsCount2 = Merged_Cell.length;
                for (var TempCellIndex = 0; TempCellIndex < CellsCount2; TempCellIndex++) {
                    var Cell = Merged_Cell[TempCellIndex];
                    var CurCell = Cell.Index;
                    var GridSpan = Cell.Get_GridSpan();
                    var CurGridCol = Cell.Metrics.StartGridCol;
                    Cell = this.Internal_Get_StartMergedCell(CurRow, CurGridCol, GridSpan);
                    var CellMar = Cell.Get_Margins();
                    var CellMetrics = Row.Get_CellInfo(CurCell);
                    var X_content_start = CellMetrics.X_content_start;
                    var X_content_end = CellMetrics.X_content_end;
                    var Y_content_start = Cell.Temp.Y;
                    var Y_content_end = this.Pages[CurPage].YLimit;
                    if (null != CellSpacing) {
                        if (this.Content.length - 1 === CurRow) {
                            Y_content_end -= CellSpacing;
                        } else {
                            Y_content_end -= CellSpacing / 2;
                        }
                    }
                    var VMergeCount = this.Internal_GetVertMergeCount(CurRow, CurGridCol, GridSpan);
                    var BottomMargin = this.MaxBotMargin[CurRow + VMergeCount - 1];
                    Y_content_end -= BottomMargin;
                    if ((0 === Cell.Row.Index && 0 === CurPage) || Cell.Row.Index > FirstRow) {
                        Cell.PagesCount = 1;
                        Cell.Content.Set_StartPage(CurPage);
                        Cell.Content.Reset(X_content_start, Y_content_start, X_content_end, 20000);
                    }
                    var CellPageIndex = CurPage - Cell.Content.Get_StartPage_Relative();
                    if (CellPageIndex < Cell.PagesCount) {
                        if (recalcresult2_NextPage === Cell.Content.Recalculate_Page(CellPageIndex, true)) {
                            Cell.PagesCount = Cell.Content.Pages.length + 1;
                            bNextPage = true;
                        }
                        var CellContentBounds = Cell.Content.Get_PageBounds(CellPageIndex);
                        var CellContentBounds_Bottom = CellContentBounds.Bottom + BottomMargin;
                        if (0 != CurRow && false === this.RowsInfo[CurRow].FirstPage) {
                            if (this.TableRowsBottom[CurRow - 1][CurPage] < CellContentBounds_Bottom) {
                                var Diff = CellContentBounds_Bottom - this.TableRowsBottom[CurRow - 1][CurPage];
                                this.TableRowsBottom[CurRow - 1][CurPage] = CellContentBounds_Bottom;
                                this.RowsInfo[CurRow - 1].H[CurPage] += Diff;
                            }
                        } else {
                            if (undefined === this.TableRowsBottom[CurRow][CurPage] || this.TableRowsBottom[CurRow][CurPage] < CellContentBounds_Bottom) {
                                this.TableRowsBottom[CurRow][CurPage] = CellContentBounds_Bottom;
                            }
                        }
                    }
                    CurGridCol += GridSpan;
                }
                bContentOnFirstPage = false;
                for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                    var Cell = Row.Get_Cell(CurCell);
                    var Vmerge = Cell.Get_VMerge();
                    if (vmerge_Continue === Vmerge) {
                        continue;
                    }
                    if (true === Cell.Content_Is_ContentOnFirstPage()) {
                        bContentOnFirstPage = true;
                        break;
                    }
                }
                this.RowsInfo[CurRow].FirstPage = bContentOnFirstPage;
            }
            var TempY = Y;
            var TempMaxTopBorder = MaxTopBorder[CurRow];
            if (null != CellSpacing) {
                this.RowsInfo[CurRow].Y[CurPage] = TempY;
                this.RowsInfo[CurRow].TopDy[CurPage] = 0;
                this.RowsInfo[CurRow].X0 = Row_x_min;
                this.RowsInfo[CurRow].X1 = Row_x_max;
                this.RowsInfo[CurRow].MaxTopBorder[CurPage] = TempMaxTopBorder;
                this.RowsInfo[CurRow].MaxBotBorder = MaxBotBorder[CurRow];
            } else {
                this.RowsInfo[CurRow].Y[CurPage] = TempY - TempMaxTopBorder;
                this.RowsInfo[CurRow].TopDy[CurPage] = TempMaxTopBorder;
                this.RowsInfo[CurRow].X0 = Row_x_min;
                this.RowsInfo[CurRow].X1 = Row_x_max;
                this.RowsInfo[CurRow].MaxTopBorder[CurPage] = TempMaxTopBorder;
                this.RowsInfo[CurRow].MaxBotBorder = MaxBotBorder[CurRow];
            }
            var CellHeight = this.TableRowsBottom[CurRow][CurPage] - Y;
            if (false === bNextPage && heightrule_AtLeast === RowH.HRule && CellHeight < RowH.Value - MaxTopBorder[CurRow]) {
                CellHeight = RowH.Value - MaxTopBorder[CurRow];
                this.TableRowsBottom[CurRow][CurPage] = Y + CellHeight;
            }
            if (null != CellSpacing) {
                this.RowsInfo[CurRow].H[CurPage] = CellHeight;
            } else {
                this.RowsInfo[CurRow].H[CurPage] = CellHeight + TempMaxTopBorder;
            }
            Y += CellHeight;
            TableHeight += CellHeight;
            Row.Height = CellHeight;
            Y += MaxBotBorder[CurRow];
            TableHeight += MaxBotBorder[CurRow];
            if (this.Content.length - 1 === CurRow) {
                if (null != CellSpacing) {
                    TableHeight += CellSpacing;
                    var TableBorder_Bottom = this.Get_Borders().Bottom;
                    if (border_Single === TableBorder_Bottom.Value) {
                        TableHeight += TableBorder_Bottom.Size;
                    }
                }
            }
            if (true === bNextPage) {
                LastRow = CurRow;
                this.Pages[CurPage].LastRow = CurRow;
                if (-1 === this.HeaderInfo.PageIndex && this.HeaderInfo.Count > 0 && CurRow >= this.HeaderInfo.Count) {
                    this.HeaderInfo.PageIndex = CurPage;
                }
                break;
            } else {
                if (this.Content.length - 1 === CurRow) {
                    LastRow = this.Content.length - 1;
                    this.Pages[CurPage].LastRow = this.Content.length - 1;
                }
            }
        }
        for (var CurRow = FirstRow; CurRow <= LastRow; CurRow++) {
            var Row = this.Content[CurRow];
            var CellsCount = Row.Get_CellsCount();
            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                var Cell = Row.Get_Cell(CurCell);
                var VMergeCount = this.Internal_GetVertMergeCount(CurRow, Cell.Metrics.StartGridCol, Cell.Get_GridSpan());
                if (VMergeCount > 1 && CurRow != LastRow) {
                    continue;
                } else {
                    var Vmerge = Cell.Get_VMerge();
                    if (vmerge_Restart != Vmerge) {
                        Cell = this.Internal_Get_StartMergedCell(CurRow, Cell.Metrics.StartGridCol, Cell.Get_GridSpan());
                    }
                }
                var CellMar = Cell.Get_Margins();
                var VAlign = Cell.Get_VAlign();
                var CellPageIndex = CurPage - Cell.Content.Get_StartPage_Relative();
                if (CellPageIndex >= Cell.PagesCount) {
                    continue;
                }
                if (vertalignjc_Top === VAlign || CellPageIndex > 1 || (1 === CellPageIndex && true === this.RowsInfo[CurRow].FirstPage)) {
                    if (!Cell.Temp.Y_VAlign_offset) {
                        Cell.Temp.Y_VAlign_offset = [];
                    }
                    Cell.Temp.Y_VAlign_offset[CellPageIndex] = 0;
                    continue;
                }
                var TempCurRow = Cell.Row.Index;
                var TempCellSpacing = this.Content[TempCurRow].Get_CellSpacing();
                var Y_0 = this.RowsInfo[TempCurRow].Y[CurPage];
                if (null === TempCellSpacing) {
                    Y_0 += MaxTopBorder[TempCurRow];
                }
                Y_0 += CellMar.Top.W;
                var Y_1 = this.TableRowsBottom[CurRow][CurPage] - CellMar.Bottom.W;
                var CellHeight = Y_1 - Y_0;
                var CellContentBounds = Cell.Content.Get_PageBounds(CellPageIndex);
                var ContentHeight = CellContentBounds.Bottom - CellContentBounds.Top;
                var Dy = 0;
                if (CellHeight - ContentHeight > 0.001) {
                    if (vertalignjc_Bottom === VAlign) {
                        Dy = CellHeight - ContentHeight;
                    } else {
                        if (vertalignjc_Center === VAlign) {
                            Dy = (CellHeight - ContentHeight) / 2;
                        }
                    }
                    Cell.Content.Shift(CellPageIndex, 0, Dy);
                }
                Cell.Temp.Y_VAlign_offset[CellPageIndex] = Dy;
            }
        }
        var CurRow = LastRow;
        if (0 === CurRow && false === this.RowsInfo[CurRow].FirstPage && 0 === CurPage) {
            this.Pages[0].MaxBotBorder = 0;
            this.Pages[0].BotBorders = new Array();
        } else {
            if (false === this.RowsInfo[CurRow].FirstPage && CurPage === this.RowsInfo[CurRow].StartPage) {
                CurRow--;
            }
            var MaxBotBorder = 0;
            var BotBorders = new Array();
            if (this.Content.length - 1 === CurRow) {
                var Row = this.Content[CurRow];
                var CellsCount = Row.Get_CellsCount();
                for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                    var Cell = Row.Get_Cell(CurCell);
                    if (vmerge_Continue === Cell.Get_VMerge()) {
                        Cell = this.Internal_Get_StartMergedCell(CurRow, Row.Get_CellInfo(CurCell).StartGridCol, Cell.Get_GridSpan());
                    }
                    var Border_Info = Cell.Get_BorderInfo().Bottom;
                    for (var BorderId = 0; BorderId < Border_Info.length; BorderId++) {
                        var Border = Border_Info[BorderId];
                        if (border_Single === Border.Value && MaxBotBorder < Border.Size) {
                            MaxBotBorder = Border.Size;
                        }
                        BotBorders.push(Border);
                    }
                }
            } else {
                var Row = this.Content[CurRow];
                var CellSpacing = Row.Get_CellSpacing();
                var CellsCount = Row.Get_CellsCount();
                if (null != CellSpacing) {
                    for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                        var Cell = Row.Get_Cell(CurCell);
                        var Border = Cell.Get_Borders().Bottom;
                        if (border_Single === Border.Value && MaxBotBorder < Border.Size) {
                            MaxBotBorder = Border.Size;
                        }
                    }
                } else {
                    for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                        var Cell = Row.Get_Cell(CurCell);
                        if (vmerge_Continue === Cell.Get_VMerge()) {
                            Cell = this.Internal_Get_StartMergedCell(CurRow, Row.Get_CellInfo(CurCell).StartGridCol, Cell.Get_GridSpan());
                            if (null === Cell) {
                                BotBorders.push(TableBorders.Bottom);
                                continue;
                            }
                        }
                        var Border = Cell.Get_Borders().Bottom;
                        var Result_Border = this.Internal_CompareBorders(Border, TableBorders.Bottom, false, true);
                        if (border_Single === Result_Border.Value && MaxBotBorder < Result_Border.Size) {
                            MaxBotBorder = Result_Border.Size;
                        }
                        BotBorders.push(Result_Border);
                    }
                }
            }
            this.Pages[CurPage].MaxBotBorder = MaxBotBorder;
            this.Pages[CurPage].BotBorders = BotBorders;
        }
        this.Pages[CurPage].Bounds.Bottom = this.Pages[CurPage].Bounds.Top + TableHeight;
        this.Pages[CurPage].Bounds.Left = X_min + this.X;
        this.Pages[CurPage].Bounds.Right = X_max + this.X;
        this.Pages[CurPage].Height = TableHeight;
        this.TurnOffRecalc = false;
        this.Bounds = this.Pages[this.Pages.length - 1].Bounds;
        if (true == bNextPage) {
            return recalcresult_NextPage;
        } else {
            return recalcresult_NextElement;
        }
    },
    Internal_RecalculateFrom: function (RowIndex, CellIndex, bChange, bForceRecalc) {
        if (true === this.TurnOffRecalc) {
            return;
        }
        this.TurnOffRecalc = true;
        if (false === bChange) {
            this.Internal_OnContentRecalculate(false, 0, this.Index);
            this.TurnOffRecalc = false;
            return;
        }
        var bNeedDocumentRecalculate = false;
        var TableBorders = this.Get_Borders();
        var Pages_new = new Array();
        var TableRowsBottom_new = new Array();
        var RowsInfo_new = new Array();
        var Pages_old = this.Pages;
        this.Pages = Pages_new;
        Pages_new.length = 0;
        Pages_new[0] = {
            Bounds: {
                Top: this.Y,
                Left: this.X,
                Right: this.X + this.TableSumGrid[this.TableSumGrid.length - 1],
                Bottom: this.Y
            },
            FirstRow: 0,
            Height: 0,
            Y: this.Y,
            YLimit: this.YLimit,
            MaxTopBorder: 0
        };
        var Y = this.Y;
        var TableHeight = 0;
        for (var Index = -1; Index < this.Content.length; Index++) {
            TableRowsBottom_new[Index] = new Array();
            TableRowsBottom_new[Index][0] = 0;
        }
        var MaxTopBorder = this.MaxTopBorder;
        var MaxBotBorder = this.MaxBotBorder;
        var ChangeCell = this.Content[RowIndex].Get_Cell(CellIndex);
        var ChangeVertAlign = this.Internal_GetVertMergeCount(RowIndex, this.Content[RowIndex].Get_CellInfo(CellIndex).StartGridCol, ChangeCell.Get_GridSpan());
        var RowChange = RowIndex + ChangeVertAlign - 1;
        var CurRow = 0;
        var bNeedRecalc = false;
        var X_max = this.Pages[0].Bounds.Right;
        var X_min = this.Pages[0].Bounds.Left;
        var CurPage = 0;
        for (CurRow = 0; CurRow <= RowChange; CurRow++) {
            var Row = this.Content[CurRow];
            var CellsCount = Row.Get_CellsCount();
            var CellSpacing = Row.Get_CellSpacing();
            var BeforeInfo = Row.Get_Before();
            var AfterInfo = Row.Get_After();
            var CurGridCol = BeforeInfo.GridBefore;
            if (0 === CurRow) {
                if (null != CellSpacing) {
                    var TableBorder_Top = this.Get_Borders().Top;
                    if (border_Single === TableBorder_Top.Value) {
                        Y += TableBorder_Top.Size;
                        TableHeight += TableBorder_Top.Size;
                    }
                    Y += CellSpacing;
                    TableHeight += CellSpacing;
                }
            } else {
                var PrevCellSpacing = this.Content[CurRow - 1].Get_CellSpacing();
                if (null != CellSpacing && null != PrevCellSpacing) {
                    Y += (PrevCellSpacing + CellSpacing) / 2;
                    TableHeight += (PrevCellSpacing + CellSpacing) / 2;
                } else {
                    if (null != CellSpacing) {
                        Y += CellSpacing / 2;
                        TableHeight += CellSpacing / 2;
                    } else {
                        if (null != PrevCellSpacing) {
                            Y += PrevCellSpacing / 2;
                            TableHeight += PrevCellSpacing / 2;
                        }
                    }
                }
            }
            Y += MaxTopBorder[CurRow];
            TableHeight += MaxTopBorder[CurRow];
            var LastPage = CurPage;
            var Pages_Y_Pos = new Array();
            var Pages_Max_Top_Border = new Array();
            var MaxBotValue_vmerge = -1;
            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                var Cell = Row.Get_Cell(CurCell);
                var GridSpan = Cell.Get_GridSpan();
                var Vmerge = Cell.Get_VMerge();
                var VMergeCount = this.Internal_GetVertMergeCount(CurRow, CurGridCol, GridSpan);
                var CurPage_old = CurPage;
                Cell.Temp.CurPage = CurPage;
                if (VMergeCount > 1) {
                    CurGridCol += GridSpan;
                    continue;
                } else {
                    if (vmerge_Restart != Vmerge) {
                        Cell = this.Internal_Get_StartMergedCell(CurRow, CurGridCol, GridSpan);
                        CurPage = Cell.Temp.CurPage;
                    }
                }
                var BottomMargin = this.MaxBotMargin[CurRow + VMergeCount - 1];
                var PagesCount = Cell.Content_Get_PagesCount();
                for (var PageIndex = 0; PageIndex < PagesCount; PageIndex++) {
                    var CellContentBounds = Cell.Content_Get_PageBounds(PageIndex);
                    var CellContentBounds_Bottom = CellContentBounds.Bottom + BottomMargin;
                    if (CurPage + PageIndex >= CurPage_old) {
                        if (vmerge_Continue === Vmerge && CurPage + PageIndex === CurPage_old) {
                            if (-1 === MaxBotValue_vmerge || MaxBotValue_vmerge < CellContentBounds_Bottom) {
                                MaxBotValue_vmerge = CellContentBounds_Bottom;
                            }
                        }
                        if ("undefined" === typeof(TableRowsBottom_new[CurRow]) || "undefined" === typeof(TableRowsBottom_new[CurRow][CurPage + PageIndex]) || TableRowsBottom_new[CurRow][CurPage + PageIndex] < CellContentBounds_Bottom) {
                            if ("undefined" === typeof(TableRowsBottom_new[CurRow])) {
                                TableRowsBottom_new[CurRow] = new Array();
                            }
                            TableRowsBottom_new[CurRow][CurPage + PageIndex] = CellContentBounds_Bottom;
                        }
                        if (0 != PageIndex) {
                            if ("undefined" === typeof(Pages_new[CurPage + PageIndex])) {
                                var StartPos = this.Parent.Get_PageContentStartPos(CurPage + PageIndex);
                                var StartRowPos = this.Get_PageContentStartPos(CurPage + PageIndex, CurRow, CurCell);
                                Pages_new[CurPage + PageIndex] = {
                                    Bounds: {
                                        Top: StartPos.Y,
                                        Left: this.X,
                                        Right: this.X + this.TableSumGrid[this.TableSumGrid.length - 1],
                                        Bottom: StartPos.Y
                                    },
                                    FirstRow: CurRow,
                                    Height: 0,
                                    Y: StartRowPos.Y,
                                    YLimit: StartRowPos.YLimit,
                                    MaxTopBorder: StartRowPos.MaxTopBorder
                                };
                                Pages_Y_Pos[CurPage + PageIndex] = StartRowPos.Y;
                                Pages_Max_Top_Border[CurPage + PageIndex] = StartRowPos.MaxTopBorder;
                            }
                        }
                        if (LastPage < CurPage + PageIndex) {
                            LastPage = CurPage + PageIndex;
                        }
                    } else {
                        var TempRow = Pages_new[CurPage + PageIndex + 1].FirstRow;
                        if (true === this.RowsInfo[TempRow].FirstPage) {
                            if ("undefined" === typeof(TableRowsBottom_new[TempRow]) || "undefined" === typeof(TableRowsBottom_new[TempRow][CurPage + PageIndex]) || TableRowsBottom_new[TempRow][CurPage + PageIndex] < CellContentBounds_Bottom) {
                                if ("undefined" === typeof(TableRowsBottom_new[TempRow])) {
                                    TableRowsBottom_new[TempRow] = new Array();
                                }
                                TableRowsBottom_new[TempRow][CurPage + PageIndex] = CellContentBounds_Bottom;
                            }
                        } else {
                            if (TempRow > 0) {
                                if ("undefined" === typeof(TableRowsBottom_new[TempRow - 1]) || "undefined" === typeof(TableRowsBottom_new[TempRow - 1][CurPage + PageIndex]) || TableRowsBottom_new[TempRow - 1][CurPage + PageIndex] < CellContentBounds_Bottom) {
                                    if ("undefined" === typeof(TableRowsBottom_new[TempRow - 1])) {
                                        TableRowsBottom_new[TempRow - 1] = new Array();
                                    }
                                    TableRowsBottom_new[TempRow - 1][CurPage + PageIndex] = CellContentBounds_Bottom;
                                }
                            }
                        }
                    }
                }
                CurPage = CurPage_old;
                CurGridCol += GridSpan;
            }
            var RowH = Row.Get_Height();
            RowsInfo_new[CurRow] = new Object();
            RowsInfo_new[CurRow].Pages = LastPage - CurPage + 1;
            RowsInfo_new[CurRow].Y = new Array();
            RowsInfo_new[CurRow].H = new Array();
            RowsInfo_new[CurRow].TopDy = new Array();
            RowsInfo_new[CurRow].MaxTopBorder = new Array();
            RowsInfo_new[CurRow].FirstPage = true;
            RowsInfo_new[CurRow].StartPage = CurPage;
            for (var PageIndex = 0; PageIndex < RowsInfo_new[CurRow].Pages; PageIndex++) {
                var TempY = Y;
                var TempMaxTopBorder = MaxTopBorder[CurRow];
                if (0 != PageIndex) {
                    TempY = Pages_Y_Pos[CurPage + PageIndex];
                    TempMaxTopBorder = Pages_Max_Top_Border[CurPage + PageIndex];
                    if (1 === PageIndex) {
                        var bContentOnFirstPage = false;
                        for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                            var Cell = Row.Get_Cell(CurCell);
                            var Vmerge = Cell.Get_VMerge();
                            var VMergeCount = this.Internal_GetVertMergeCount(CurRow, Row.Get_CellInfo(CurCell).StartGridCol, Cell.Get_GridSpan());
                            if (vmerge_Continue === Vmerge || VMergeCount > 1) {
                                continue;
                            }
                            if (true === Cell.Content_Is_ContentOnFirstPage()) {
                                bContentOnFirstPage = true;
                                break;
                            }
                        }
                        RowsInfo_new[CurRow].FirstPage = bContentOnFirstPage;
                        if (0 != CurRow && false === RowsInfo_new[CurRow].FirstPage) {
                            if (TableRowsBottom_new[CurRow - 1][CurPage] < MaxBotValue_vmerge) {
                                TableRowsBottom_new[CurRow - 1][CurPage] = MaxBotValue_vmerge;
                            }
                        }
                    }
                }
                if (null != CellSpacing) {
                    RowsInfo_new[CurRow].Y[CurPage + PageIndex] = TempY;
                    RowsInfo_new[CurRow].TopDy[CurPage + PageIndex] = 0;
                    RowsInfo_new[CurRow].X0 = this.RowsInfo[CurRow].X0;
                    RowsInfo_new[CurRow].X1 = this.RowsInfo[CurRow].X1;
                    RowsInfo_new[CurRow].MaxTopBorder[CurPage + PageIndex] = TempMaxTopBorder;
                    RowsInfo_new[CurRow].MaxBotBorder = MaxBotBorder[CurRow];
                } else {
                    RowsInfo_new[CurRow].Y[CurPage + PageIndex] = TempY - TempMaxTopBorder;
                    RowsInfo_new[CurRow].TopDy[CurPage + PageIndex] = TempMaxTopBorder;
                    RowsInfo_new[CurRow].X0 = this.RowsInfo[CurRow].X0;
                    RowsInfo_new[CurRow].X1 = this.RowsInfo[CurRow].X1;
                    RowsInfo_new[CurRow].MaxTopBorder[CurPage + PageIndex] = TempMaxTopBorder;
                    RowsInfo_new[CurRow].MaxBotBorder = MaxBotBorder[CurRow];
                }
            }
            if (LastPage != CurPage) {
                var TempCellHeight = TableRowsBottom_new[CurRow][CurPage] - Y;
                TableHeight += TempCellHeight + MaxBotBorder[CurRow];
                if (null != CellSpacing) {
                    TableHeight += CellSpacing / 2;
                }
                if (border_Single === TableBorders.Bottom.Value) {
                    TableHeight += TableBorders.Bottom.Size;
                }
                Pages_new[CurPage].Bounds.Bottom = Pages_new[CurPage].YLimit;
                Pages_new[CurPage].Bounds.Left = X_min;
                Pages_new[CurPage].Bounds.Right = X_max;
                Pages_new[CurPage].Height = TableHeight;
                for (var PageId = CurPage + 1; PageId < LastPage; PageId++) {
                    Y = this.Parent.Get_PageContentStartPos(CurPage + PageId, CurRow, 0).Y;
                    TableHeight = 0;
                    if (null != CellSpacing) {
                        if (border_Single === TableBorders.Top.Value) {
                            Y += TableBorders.Top.Size;
                            TableHeight += TableBorders.Top.Size;
                        }
                        if (0 === CurRow) {
                            Y += CellSpacing;
                            TableHeight += CellSpacing;
                        } else {
                            Y += CellSpacing / 2;
                            TableHeight += CellSpacing / 2;
                        }
                    }
                    Y += Pages_Max_Top_Border[LastPage];
                    TableHeight += Pages_Max_Top_Border[LastPage];
                    TempCellHeight = TableRowsBottom_new[CurRow][PageId] - Y;
                    TableHeight += TempCellHeight + MaxBotBorder[CurRow];
                    if (null != CellSpacing) {
                        TableHeight += CellSpacing / 2;
                    }
                    if (border_Single === TableBorders.Bottom.Value) {
                        TableHeight += TableBorders.Bottom.Size;
                    }
                    Pages_new[PageId].Bounds.Bottom = Pages_new[PageId].YLimit;
                    Pages_new[PageId].Bounds.Left = X_min;
                    Pages_new[PageId].Bounds.Right = X_max;
                    Pages_new[PageId].Height = TableHeight;
                }
                TableHeight = 0;
                Y = this.Parent.Get_PageContentStartPos(LastPage).Y;
                if (null != CellSpacing) {
                    if (border_Single === TableBorders.Top.Value) {
                        Y += TableBorders.Top.Size;
                        TableHeight += TableBorders.Top.Size;
                    }
                    if (0 === CurRow) {
                        Y += CellSpacing;
                        TableHeight += CellSpacing;
                    } else {
                        Y += CellSpacing / 2;
                        TableHeight += CellSpacing / 2;
                    }
                }
                Y += Pages_Max_Top_Border[LastPage];
                TableHeight += Pages_Max_Top_Border[LastPage];
            }
            var CellHeight = TableRowsBottom_new[CurRow][LastPage] - Y;
            if (LastPage === CurPage && heightrule_AtLeast === RowH.HRule && CellHeight < RowH.Value) {
                CellHeight = RowH.Value;
                TableRowsBottom_new[CurRow][CurPage] = Y + CellHeight;
            }
            Y += CellHeight;
            TableHeight += CellHeight;
            if (RowChange === CurRow && (Math.abs(Row.Height - CellHeight) > 0.01 || Row.PagesCount != LastPage - CurPage + 1)) {
                Row.Height = CellHeight;
                Row.PagesCount = LastPage - CurPage + 1;
                bNeedRecalc = true;
            }
            Y += MaxBotBorder[CurRow];
            TableHeight += MaxBotBorder[CurRow];
            if (this.Content.length - 1 === CurRow) {
                if (null != CellSpacing) {
                    TableHeight += CellSpacing;
                    var TableBorder_Bottom = this.Get_Borders().Bottom;
                    if (border_Single === TableBorder_Bottom.Value) {
                        TableHeight += TableBorder_Bottom.Size;
                    }
                }
            }
            CurPage = LastPage;
        }
        if (true === bNeedRecalc || true === bForceRecalc) {
            for (CurRow = RowChange + 1; CurRow < this.Content.length; CurRow++) {
                var Row = this.Content[CurRow];
                var CellsCount = Row.Get_CellsCount();
                var CellSpacing = Row.Get_CellSpacing();
                var BeforeInfo = Row.Get_Before();
                var AfterInfo = Row.Get_After();
                var CurGridCol = BeforeInfo.GridBefore;
                if (0 === CurRow) {
                    if (null != CellSpacing) {
                        var TableBorder_Top = this.Get_Borders().Top;
                        if (border_Single === TableBorder_Top.Value) {
                            Y += TableBorder_Top.Size;
                            TableHeight += TableBorder_Top.Size;
                        }
                        Y += CellSpacing;
                        TableHeight += CellSpacing;
                    }
                } else {
                    var PrevCellSpacing = this.Content[CurRow - 1].Get_CellSpacing();
                    if (null != CellSpacing && null != PrevCellSpacing) {
                        Y += (PrevCellSpacing + CellSpacing) / 2;
                        TableHeight += (PrevCellSpacing + CellSpacing) / 2;
                    } else {
                        if (null != CellSpacing) {
                            Y += CellSpacing / 2;
                            TableHeight += CellSpacing / 2;
                        } else {
                            if (null != PrevCellSpacing) {
                                Y += PrevCellSpacing / 2;
                                TableHeight += PrevCellSpacing / 2;
                            }
                        }
                    }
                }
                Y += MaxTopBorder[CurRow];
                TableHeight += MaxTopBorder[CurRow];
                var Row_x_max = 0;
                var Row_x_min = 0;
                var LastPage = CurPage;
                var Pages_Y_Pos = new Array();
                var Pages_Max_Top_Border = new Array();
                var MaxBotValue_vmerge = -1;
                for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                    var Cell = Row.Get_Cell(CurCell);
                    var GridSpan = Cell.Get_GridSpan();
                    var Vmerge = Cell.Get_VMerge();
                    var X_grid_start = this.X + this.TableSumGrid[CurGridCol - 1];
                    var X_grid_end = this.X + this.TableSumGrid[CurGridCol + GridSpan - 1];
                    var X_cell_start = X_grid_start;
                    var X_cell_end = X_grid_end;
                    if (null != CellSpacing) {
                        if (0 === CurCell) {
                            if (0 === BeforeInfo.GridBefore) {
                                if (border_None === TableBorders.Left.Value || CellSpacing > TableBorders.Left.Size / 2) {
                                    X_cell_start += CellSpacing;
                                } else {
                                    X_cell_start += TableBorders.Left.Size / 2;
                                }
                            } else {
                                if (border_None === TableBorders.Left.Value || CellSpacing > TableBorders.Left.Size) {
                                    X_cell_start += CellSpacing / 2;
                                } else {
                                    X_cell_start += TableBorders.Left.Size / 2;
                                }
                            }
                        } else {
                            X_cell_start += CellSpacing / 2;
                        }
                        if (CellsCount - 1 === CurCell) {
                            if (0 === AfterInfo.GridAfter) {
                                if (border_None === TableBorders.Right.Value || CellSpacing > TableBorders.Right.Size / 2) {
                                    X_cell_end -= CellSpacing;
                                } else {
                                    X_cell_end -= TableBorders.Right.Size / 2;
                                }
                            } else {
                                if (border_None === TableBorders.Right.Value || CellSpacing > TableBorders.Right.Size) {
                                    X_cell_end -= CellSpacing / 2;
                                } else {
                                    X_cell_end -= TableBorders.Right.Size / 2;
                                }
                            }
                        } else {
                            X_cell_end -= CellSpacing / 2;
                        }
                    }
                    var CellMar = Cell.Get_Margins();
                    var VMergeCount = this.Internal_GetVertMergeCount(CurRow, CurGridCol, GridSpan);
                    var X_content_start = X_cell_start;
                    var X_content_end = X_cell_end;
                    var CellBorders = Cell.Get_Borders();
                    if (null != CellSpacing) {
                        X_content_start += CellMar.Left.W;
                        X_content_end -= CellMar.Right.W;
                        if (border_Single === CellBorders.Left.Value) {
                            X_content_start += CellBorders.Left.Size;
                        }
                        if (border_Single === CellBorders.Right.Value) {
                            X_content_end -= CellBorders.Right.Size;
                        }
                    } else {
                        if (vmerge_Continue === Vmerge) {
                            X_content_start += CellMar.Left.W;
                            X_content_end -= CellMar.Right.W;
                        } else {
                            var BorderInfo = Cell.Get_BorderInfo();
                            var Max_r_w = BorderInfo.MaxRight;
                            var Max_l_w = BorderInfo.MaxLeft;
                            if (Max_l_w / 2 > CellMar.Left.W) {
                                X_content_start += Max_l_w / 2;
                            } else {
                                X_content_start += CellMar.Left.W;
                            }
                            if (Max_r_w / 2 > CellMar.Right.W) {
                                X_content_end -= Max_r_w / 2;
                            } else {
                                X_content_end -= CellMar.Right.W;
                            }
                        }
                    }
                    if (0 === CurCell) {
                        if (null != CellSpacing) {
                            Row_x_min = X_grid_start;
                            if (border_Single === TableBorders.Left.Value) {
                                Row_x_min -= TableBorders.Left.Size / 2;
                            }
                        } else {
                            var BorderInfo = Cell.Get_BorderInfo();
                            Row_x_min = X_grid_start - BorderInfo.MaxLeft / 2;
                        }
                    }
                    if (CellsCount - 1 === CurCell) {
                        if (null != CellSpacing) {
                            Row_x_max = X_grid_end;
                            if (border_Single === TableBorders.Right.Value) {
                                Row_x_max += TableBorders.Right.Size / 2;
                            }
                        } else {
                            var BorderInfo = Cell.Get_BorderInfo();
                            Row_x_max = X_grid_end + BorderInfo.MaxRight / 2;
                        }
                    }
                    Row.Set_CellInfo(CurCell, CurGridCol, X_grid_start, X_grid_end, X_cell_start, X_cell_end, X_content_start, X_content_end);
                    var Y_content_start = Y + CellMar.Top.W;
                    var CurPage_old = CurPage;
                    Cell.Temp = {
                        CurPage: CurPage,
                        Y: Y
                    };
                    if (VMergeCount > 1) {
                        CurGridCol += GridSpan;
                        continue;
                    } else {
                        if (vmerge_Restart != Vmerge) {
                            Cell = this.Internal_Get_StartMergedCell(CurRow, CurGridCol, GridSpan);
                            CellMar = Cell.Get_Margins();
                            Y_content_start = Cell.Temp.Y + CellMar.Top.W;
                            CurPage = Cell.Temp.CurPage;
                        }
                    }
                    var Y_content_end = Pages_new[CurPage].YLimit;
                    if (null != CellSpacing) {
                        if (this.Content.length - 1 === CurRow) {
                            Y_content_end -= CellSpacing;
                        } else {
                            Y_content_end -= CellSpacing / 2;
                        }
                    }
                    var BottomMargin = this.MaxBotMargin[CurRow + VMergeCount - 1];
                    Y_content_end -= BottomMargin;
                    Cell.Content_Set_StartPage(CurPage);
                    Cell.Content_Reset(X_content_start, Y_content_start, X_content_end, 20000);
                    Cell.Recalculate();
                    var PagesCount = Cell.Content_Get_PagesCount();
                    for (var PageIndex = 0; PageIndex < PagesCount; PageIndex++) {
                        var CellContentBounds = Cell.Content_Get_PageBounds(PageIndex);
                        var CellContentBounds_Bottom = CellContentBounds.Bottom + BottomMargin;
                        if (CurPage + PageIndex >= CurPage_old) {
                            if (vmerge_Continue === Vmerge && CurPage + PageIndex === CurPage_old) {
                                if (-1 === MaxBotValue_vmerge || MaxBotValue_vmerge < CellContentBounds_Bottom) {
                                    MaxBotValue_vmerge = CellContentBounds_Bottom;
                                }
                            }
                            if ("undefined" === typeof(TableRowsBottom_new[CurRow]) || "undefined" === typeof(TableRowsBottom_new[CurRow][CurPage + PageIndex]) || TableRowsBottom_new[CurRow][CurPage + PageIndex] < CellContentBounds_Bottom) {
                                if ("undefined" === typeof(TableRowsBottom_new[CurRow])) {
                                    TableRowsBottom_new[CurRow] = new Array();
                                }
                                TableRowsBottom_new[CurRow][CurPage + PageIndex] = CellContentBounds_Bottom;
                            }
                            if (0 != PageIndex) {
                                if ("undefined" === typeof(Pages_new[CurPage + PageIndex])) {
                                    var StartPos = this.Parent.Get_PageContentStartPos(CurPage + PageIndex);
                                    var StartRowPos = this.Get_PageContentStartPos(CurPage + PageIndex, CurRow, CurCell);
                                    Pages_new[CurPage + PageIndex] = {
                                        Bounds: {
                                            Top: StartPos.Y,
                                            Left: this.X,
                                            Right: this.X + this.TableSumGrid[this.TableSumGrid.length - 1],
                                            Bottom: StartPos.Y
                                        },
                                        FirstRow: CurRow,
                                        Height: 0,
                                        Y: StartRowPos.Y,
                                        YLimit: StartRowPos.YLimit,
                                        MaxTopBorder: StartRowPos.MaxTopBorder
                                    };
                                    Pages_Y_Pos[CurPage + PageIndex] = StartRowPos.Y;
                                    Pages_Max_Top_Border[CurPage + PageIndex] = StartRowPos.MaxTopBorder;
                                }
                            }
                            if (LastPage < CurPage + PageIndex) {
                                LastPage = CurPage + PageIndex;
                            }
                        } else {
                            var TempRow = Pages_new[CurPage + PageIndex + 1].FirstRow;
                            if (true === RowsInfo_new[TempRow].FirstPage) {
                                if ("undefined" === typeof(TableRowsBottom_new[TempRow]) || "undefined" === typeof(TableRowsBottom_new[TempRow][CurPage + PageIndex]) || TableRowsBottom_new[TempRow][CurPage + PageIndex] < CellContentBounds_Bottom) {
                                    if ("undefined" === typeof(TableRowsBottom_new[TempRow])) {
                                        TableRowsBottom_new[TempRow] = new Array();
                                    }
                                    TableRowsBottom_new[TempRow][CurPage + PageIndex] = CellContentBounds_Bottom;
                                }
                            } else {
                                if (TempRow > 0) {
                                    if ("undefined" === typeof(TableRowsBottom_new[TempRow - 1]) || "undefined" === typeof(TableRowsBottom_new[TempRow - 1][CurPage + PageIndex]) || TableRowsBottom_new[TempRow - 1][CurPage + PageIndex] < CellContentBounds_Bottom) {
                                        if ("undefined" === typeof(TableRowsBottom_new[TempRow - 1])) {
                                            TableRowsBottom_new[TempRow - 1] = new Array();
                                        }
                                        TableRowsBottom_new[TempRow - 1][CurPage + PageIndex] = CellContentBounds_Bottom;
                                    }
                                }
                            }
                        }
                    }
                    CurPage = CurPage_old;
                    CurGridCol += GridSpan;
                }
                var RowH = Row.Get_Height();
                RowsInfo_new[CurRow] = new Object();
                RowsInfo_new[CurRow].Pages = LastPage - CurPage + 1;
                RowsInfo_new[CurRow].Y = new Array();
                RowsInfo_new[CurRow].H = new Array();
                RowsInfo_new[CurRow].TopDy = new Array();
                RowsInfo_new[CurRow].MaxTopBorder = new Array();
                RowsInfo_new[CurRow].FirstPage = true;
                RowsInfo_new[CurRow].StartPage = CurPage;
                for (var PageIndex = 0; PageIndex < RowsInfo_new[CurRow].Pages; PageIndex++) {
                    var TempY = Y;
                    var TempMaxTopBorder = MaxTopBorder[CurRow];
                    if (0 != PageIndex) {
                        TempY = Pages_Y_Pos[CurPage + PageIndex];
                        TempMaxTopBorder = Pages_Max_Top_Border[CurPage + PageIndex];
                        if (1 === PageIndex) {
                            var bContentOnFirstPage = false;
                            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                                var Cell = Row.Get_Cell(CurCell);
                                var Vmerge = Cell.Get_VMerge();
                                var VMergeCount = this.Internal_GetVertMergeCount(CurRow, Row.Get_CellInfo(CurCell).StartGridCol, Cell.Get_GridSpan());
                                if (vmerge_Continue === Vmerge || VMergeCount > 1) {
                                    continue;
                                }
                                if (true === Cell.Content_Is_ContentOnFirstPage()) {
                                    bContentOnFirstPage = true;
                                    break;
                                }
                            }
                            RowsInfo_new[CurRow].FirstPage = bContentOnFirstPage;
                            if (0 != CurRow && false === RowsInfo_new[CurRow].FirstPage) {
                                if (TableRowsBottom_new[CurRow - 1][CurPage] < MaxBotValue_vmerge) {
                                    TableRowsBottom_new[CurRow - 1][CurPage] = MaxBotValue_vmerge;
                                }
                            }
                        }
                    }
                    if (null != CellSpacing) {
                        RowsInfo_new[CurRow].Y[CurPage + PageIndex] = TempY;
                        RowsInfo_new[CurRow].TopDy[CurPage + PageIndex] = 0;
                        RowsInfo_new[CurRow].X0 = Row_x_min;
                        RowsInfo_new[CurRow].X1 = Row_x_max;
                        RowsInfo_new[CurRow].MaxTopBorder[CurPage + PageIndex] = TempMaxTopBorder;
                        RowsInfo_new[CurRow].MaxBotBorder = MaxBotBorder[CurRow];
                    } else {
                        RowsInfo_new[CurRow].Y[CurPage + PageIndex] = TempY - TempMaxTopBorder;
                        RowsInfo_new[CurRow].TopDy[CurPage + PageIndex] = TempMaxTopBorder;
                        RowsInfo_new[CurRow].X0 = Row_x_min;
                        RowsInfo_new[CurRow].X1 = Row_x_max;
                        RowsInfo_new[CurRow].MaxTopBorder[CurPage + PageIndex] = TempMaxTopBorder;
                        RowsInfo_new[CurRow].MaxBotBorder = MaxBotBorder[CurRow];
                    }
                }
                if (LastPage != CurPage) {
                    var TempCellHeight = TableRowsBottom_new[CurRow][CurPage] - Y;
                    TableHeight += TempCellHeight + MaxBotBorder[CurRow];
                    if (null != CellSpacing) {
                        TableHeight += CellSpacing / 2;
                    }
                    if (border_Single === TableBorders.Bottom.Value) {
                        TableHeight += TableBorders.Bottom.Size;
                    }
                    Pages_new[CurPage].Bounds.Bottom = Pages_new[CurPage].YLimit;
                    Pages_new[CurPage].Bounds.Left = X_min;
                    Pages_new[CurPage].Bounds.Right = X_max;
                    Pages_new[CurPage].Height = TableHeight;
                    for (var PageId = CurPage + 1; PageId < LastPage; PageId++) {
                        Y = this.Parent.Get_PageContentStartPos(CurPage + PageId, CurRow, 0).Y;
                        TableHeight = 0;
                        if (null != CellSpacing) {
                            if (border_Single === TableBorders.Top.Value) {
                                Y += TableBorders.Top.Size;
                                TableHeight += TableBorders.Top.Size;
                            }
                            if (0 === CurRow) {
                                Y += CellSpacing;
                                TableHeight += CellSpacing;
                            } else {
                                Y += CellSpacing / 2;
                                TableHeight += CellSpacing / 2;
                            }
                        }
                        Y += Pages_Max_Top_Border[LastPage];
                        TableHeight += Pages_Max_Top_Border[LastPage];
                        TempCellHeight = TableRowsBottom_new[CurRow][PageId] - Y;
                        TableHeight += TempCellHeight + MaxBotBorder[CurRow];
                        if (null != CellSpacing) {
                            TableHeight += CellSpacing / 2;
                        }
                        if (border_Single === TableBorders.Bottom.Value) {
                            TableHeight += TableBorders.Bottom.Size;
                        }
                        Pages_new[PageId].Bounds.Bottom = Pages_new[PageId].YLimit;
                        Pages_new[PageId].Bounds.Left = X_min;
                        Pages_new[PageId].Bounds.Right = X_max;
                        Pages_new[PageId].Height = TableHeight;
                    }
                    TableHeight = 0;
                    Y = this.Parent.Get_PageContentStartPos(LastPage).Y;
                    if (null != CellSpacing) {
                        if (border_Single === TableBorders.Top.Value) {
                            Y += TableBorders.Top.Size;
                            TableHeight += TableBorders.Top.Size;
                        }
                        if (0 === CurRow) {
                            Y += CellSpacing;
                            TableHeight += CellSpacing;
                        } else {
                            Y += CellSpacing / 2;
                            TableHeight += CellSpacing / 2;
                        }
                    }
                    Y += Pages_Max_Top_Border[LastPage];
                    TableHeight += Pages_Max_Top_Border[LastPage];
                }
                var CellHeight = TableRowsBottom_new[CurRow][LastPage] - Y;
                if (LastPage === CurPage && heightrule_AtLeast === RowH.HRule && CellHeight < RowH.Value) {
                    CellHeight = RowH.Value;
                    TableRowsBottom_new[CurRow][CurPage] = Y + CellHeight;
                }
                Y += CellHeight;
                TableHeight += CellHeight;
                Row.Height = CellHeight;
                Row.PagesCount = LastPage - CurPage + 1;
                Y += MaxBotBorder[CurRow];
                TableHeight += MaxBotBorder[CurRow];
                if (this.Content.length - 1 === CurRow) {
                    if (null != CellSpacing) {
                        TableHeight += CellSpacing;
                        var TableBorder_Bottom = this.Get_Borders().Bottom;
                        if (border_Single === TableBorder_Bottom.Value) {
                            TableHeight += TableBorder_Bottom.Size;
                        }
                    }
                }
                CurPage = LastPage;
            }
            this.TableRowsBottom = TableRowsBottom_new;
            this.Pages = Pages_new;
            this.RowsInfo = RowsInfo_new;
            for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
                var Row = this.Content[CurRow];
                var CellSpacing = Row.Get_CellSpacing();
                var StartPage = this.RowsInfo[CurRow].StartPage;
                var RowH = Row.Get_Height();
                for (var PageIndex = 0; PageIndex < this.RowsInfo[CurRow].Pages; PageIndex++) {
                    var TempMaxTopBorder = this.RowsInfo[CurRow].MaxTopBorder[StartPage + PageIndex];
                    var TempY = 0;
                    if (null != CellSpacing) {
                        TempY = this.RowsInfo[CurRow].Y[StartPage + PageIndex];
                    } else {
                        TempY = this.RowsInfo[CurRow].Y[StartPage + PageIndex] + TempMaxTopBorder;
                    }
                    var TempCellHeight = this.TableRowsBottom[CurRow][StartPage + PageIndex] - TempY;
                    if (1 === this.RowsInfo[CurRow].Pages && heightrule_AtLeast === RowH.HRule && TempCellHeight < RowH.Value) {
                        TempCellHeight = RowH.Value;
                    }
                    if (null != CellSpacing) {
                        this.RowsInfo[CurRow].H[StartPage + PageIndex] = TempCellHeight;
                    } else {
                        this.RowsInfo[CurRow].H[StartPage + PageIndex] = TempCellHeight + TempMaxTopBorder;
                    }
                }
            }
            for (var Index = 0; Index < this.Pages.length - 1; Index++) {
                var CurRow = this.Pages[Index + 1].FirstRow;
                if (0 === CurRow && false === this.RowsInfo[CurRow].FirstPage) {
                    this.Pages[Index].MaxBotBorder = 0;
                    this.Pages[Index].BotBorders = new Array();
                    continue;
                } else {
                    if (false === this.RowsInfo[CurRow].FirstPage) {
                        CurRow--;
                    }
                }
                var MaxBotBorder = 0;
                var BotBorders = new Array();
                if (this.Content.length - 1 === CurRow) {
                    var Row = this.Content[CurRow];
                    var CellsCount = Row.Get_CellsCount();
                    for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                        var Cell = Row.Get_Cell(CurCell);
                        if (vmerge_Continue === Cell.Get_VMerge()) {
                            Cell = this.Internal_Get_StartMergedCell(CurRow, Row.Get_CellInfo(CurCell).StartGridCol, Cell.Get_GridSpan());
                        }
                        var Border_Info = Cell.Get_BorderInfo().Bottom;
                        for (var BorderId = 0; BorderId < Border_Info.length; BorderId++) {
                            var Border = Border_Info[BorderId];
                            if (border_Single === Border.Value && MaxBotBorder < Border.Size) {
                                MaxBotBorder = Border.Size;
                            }
                            BotBorders.push(Border);
                        }
                    }
                } else {
                    var Row = this.Content[CurRow];
                    var CellSpacing = Row.Get_CellSpacing();
                    var CellsCount = Row.Get_CellsCount();
                    if (null != CellSpacing) {
                        for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                            var Cell = Row.Get_Cell(CurCell);
                            var Border = Cell.Get_Borders().Bottom;
                            if (border_Single === Border.Value && MaxBotBorder < Border.Size) {
                                MaxBotBorder = Border.Size;
                            }
                        }
                    } else {
                        for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                            var Cell = Row.Get_Cell(CurCell);
                            if (vmerge_Continue === Cell.Get_VMerge()) {
                                Cell = this.Internal_Get_StartMergedCell(CurRow, Row.Get_CellInfo(CurCell).StartGridCol, Cell.Get_GridSpan());
                                if (null === Cell) {
                                    BotBorders.push(TableBorders.Bottom);
                                    continue;
                                }
                            }
                            var Border = Cell.Get_Borders().Bottom;
                            var Result_Border = this.Internal_CompareBorders(Border, TableBorders.Bottom, false, true);
                            if (border_Single === Result_Border.Value && MaxBotBorder < Result_Border.Size) {
                                MaxBotBorder = Result_Border.Size;
                            }
                            BotBorders.push(Result_Border);
                        }
                    }
                }
                this.Pages[Index].MaxBotBorder = MaxBotBorder;
                this.Pages[Index].BotBorders = BotBorders;
            }
            this.Pages[CurPage].Bounds.Bottom = this.Pages[CurPage].Bounds.Top + TableHeight;
            this.Pages[CurPage].Bounds.Left = X_min;
            this.Pages[CurPage].Bounds.Right = X_max;
            this.Pages[CurPage].Height = TableHeight;
            this.Pages[CurPage].MaxBotBorder = 0;
            this.Pages[CurPage].BotBorders = new Array();
            bNeedDocumentRecalculate = true;
        } else {
            for (var CurRow = 0; CurRow <= RowChange; CurRow++) {
                this.TableRowsBottom[CurRow] = TableRowsBottom_new[CurRow];
                this.RowsInfo[CurRow] = RowsInfo_new[CurRow];
            }
            var Pages_new = this.Pages;
            this.Pages = Pages_old;
            for (var PageId = 0; PageId < CurPage; PageId++) {
                this.Pages[PageId] = Pages_new[PageId];
            }
            for (var CurRow = 0; CurRow <= RowChange; CurRow++) {
                var Row = this.Content[CurRow];
                var CellSpacing = Row.Get_CellSpacing();
                var StartPage = this.RowsInfo[CurRow].StartPage;
                var RowH = Row.Get_Height();
                for (var PageIndex = 0; PageIndex < this.RowsInfo[CurRow].Pages; PageIndex++) {
                    var TempMaxTopBorder = this.RowsInfo[CurRow].MaxTopBorder[StartPage + PageIndex];
                    var TempY = 0;
                    if (null != CellSpacing) {
                        TempY = this.RowsInfo[CurRow].Y[StartPage + PageIndex];
                    } else {
                        TempY = this.RowsInfo[CurRow].Y[StartPage + PageIndex] + TempMaxTopBorder;
                    }
                    var TempCellHeight = this.TableRowsBottom[CurRow][StartPage + PageIndex] - TempY;
                    if (1 === this.RowsInfo[CurRow].Pages && heightrule_AtLeast === RowH.HRule && TempCellHeight < RowH.Value) {
                        TempCellHeight = RowH.Value;
                    }
                    if (null != CellSpacing) {
                        this.RowsInfo[CurRow].H[StartPage + PageIndex] = TempCellHeight;
                    } else {
                        this.RowsInfo[CurRow].H[StartPage + PageIndex] = TempCellHeight + TempMaxTopBorder;
                    }
                }
            }
            for (var Index = 0; Index < CurPage; Index++) {
                var CurRow = this.Pages[Index + 1].FirstRow;
                if (0 === CurRow && false === this.RowsInfo[CurRow].FirstPage) {
                    this.Pages[Index].MaxBotBorder = 0;
                    this.Pages[Index].BotBorders = new Array();
                    continue;
                } else {
                    if (false === this.RowsInfo[CurRow].FirstPage) {
                        CurRow--;
                    }
                }
                var MaxBotBorder = 0;
                var BotBorders = new Array();
                if (this.Content.length - 1 === CurRow) {
                    var Row = this.Content[CurRow];
                    var CellsCount = Row.Get_CellsCount();
                    for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                        var Cell = Row.Get_Cell(CurCell);
                        if (vmerge_Continue === Cell.Get_VMerge()) {
                            Cell = this.Internal_Get_StartMergedCell(CurRow, Row.Get_CellInfo(CurCell).StartGridCol, Cell.Get_GridSpan());
                        }
                        var Border_Info = Cell.Get_BorderInfo().Bottom;
                        for (var BorderId = 0; BorderId < Border_Info.length; BorderId++) {
                            var Border = Border_Info[BorderId];
                            if (border_Single === Border.Value && MaxBotBorder < Border.Size) {
                                MaxBotBorder = Border.Size;
                            }
                            BotBorders.push(Border);
                        }
                    }
                } else {
                    var Row = this.Content[CurRow];
                    var CellSpacing = Row.Get_CellSpacing();
                    var CellsCount = Row.Get_CellsCount();
                    if (null != CellSpacing) {
                        for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                            var Cell = Row.Get_Cell(CurCell);
                            var Border = Cell.Get_Borders().Bottom;
                            if (border_Single === Border.Value && MaxBotBorder < Border.Size) {
                                MaxBotBorder = Border.Size;
                            }
                        }
                    } else {
                        for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                            var Cell = Row.Get_Cell(CurCell);
                            if (vmerge_Continue === Cell.Get_VMerge()) {
                                Cell = this.Internal_Get_StartMergedCell(CurRow, Row.Get_CellInfo(CurCell).StartGridCol, Cell.Get_GridSpan());
                                if (null === Cell) {
                                    BotBorders.push(TableBorders.Bottom);
                                    continue;
                                }
                            }
                            var Border = Cell.Get_Borders().Bottom;
                            var Result_Border = this.Internal_CompareBorders(Border, TableBorders.Bottom, false, true);
                            if (border_Single === Result_Border.Value && MaxBotBorder < Result_Border.Size) {
                                MaxBotBorder = Result_Border.Size;
                            }
                            BotBorders.push(Result_Border);
                        }
                    }
                }
                this.Pages[Index].MaxBotBorder = MaxBotBorder;
                this.Pages[Index].BotBorders = BotBorders;
            }
            bNeedDocumentRecalculate = false;
        }
        this.Bounds = this.Pages[this.Pages.length - 1].Bounds;
        this.TurnOffRecalc = false;
        this.Internal_OnContentRecalculate(bNeedDocumentRecalculate, 0, this.Index);
    },
    Internal_GetCellByXY: function (X, Y, PageIndex) {
        var CurGrid = 0;
        var ColsCount = this.TableGrid.length;
        if (X >= this.X) {
            for (CurGrid = 0; CurGrid < ColsCount; CurGrid++) {
                if (X >= this.X + this.TableSumGrid[CurGrid - 1] && X <= this.X + this.TableSumGrid[CurGrid]) {
                    break;
                }
            }
        }
        if (CurGrid >= ColsCount.length) {
            CurGrid = ColsCount.length - 1;
        }
        var PNum = PageIndex;
        if (PNum < 0 || PNum >= this.Pages.length) {
            return;
        }
        var Row_start = this.Pages[PNum].FirstRow;
        var Row_last = Row_start;
        if (PNum + 1 < this.Pages.length) {
            Row_last = this.Pages[PNum + 1].FirstRow;
            if (Row_last != Row_start && false === this.RowsInfo[Row_last].FirstPage) {
                Row_last--;
            }
        } else {
            Row_last = this.Content.length - 1;
        }
        if (Row_last < Row_start) {
            return {
                Row: 0,
                Cell: 0
            };
        }
        for (var CurRow = Row_start; CurRow <= Row_last; CurRow++) {
            var Row = this.Content[CurRow];
            var CellsCount = Row.Get_CellsCount();
            var BeforeInfo = Row.Get_Before();
            var CurGridCol = BeforeInfo.GridBefore;
            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                var Cell = Row.Get_Cell(CurCell);
                var GridSpan = Cell.Get_GridSpan();
                var Vmerge = Cell.Get_VMerge();
                if (vmerge_Continue === Vmerge && Row_start != CurRow) {
                    CurGridCol += GridSpan;
                    continue;
                }
                var VMergeCount = this.Internal_GetVertMergeCount(CurRow, CurGridCol, GridSpan);
                if (PNum + 1 < this.Pages.length) {
                    if (CurRow + VMergeCount - 1 >= this.Pages[PNum + 1].FirstRow) {
                        VMergeCount = this.Pages[PNum + 1].FirstRow + 1 - CurRow;
                        if (false === this.RowsInfo[CurRow + VMergeCount - 1].FirstPage && PNum === this.RowsInfo[CurRow + VMergeCount - 1].StartPage) {
                            VMergeCount--;
                        }
                        if (VMergeCount <= 0) {
                            CurGridCol += GridSpan;
                            continue;
                        }
                    }
                }
                if (CurGrid >= CurGridCol && CurGrid < CurGridCol + GridSpan) {
                    if ("undefined" != typeof(this.RowsInfo[CurRow + VMergeCount - 1].Y[PNum]) && "undefined" != typeof(this.RowsInfo[CurRow + VMergeCount - 1].H[PNum]) && (Y <= (this.RowsInfo[CurRow + VMergeCount - 1].Y[PNum] + this.RowsInfo[CurRow + VMergeCount - 1].H[PNum]) || CurRow + VMergeCount - 1 >= Row_last)) {
                        if (vmerge_Continue === Vmerge && Row_start === CurRow) {
                            Cell = this.Internal_Get_StartMergedCell(CurRow, CurGridCol, GridSpan);
                            if (null != Cell) {
                                return {
                                    Row: Cell.Row.Index,
                                    Cell: Cell.Index
                                };
                            } else {
                                return {
                                    Row: 0,
                                    Cell: 0
                                };
                            }
                        } else {
                            return {
                                Row: CurRow,
                                Cell: CurCell
                            };
                        }
                    }
                }
                CurGridCol += GridSpan;
            }
        }
        return {
            Row: 0,
            Cell: 0
        };
    },
    Internal_GetVertMergeCount: function (StartRow, StartGridCol, GridSpan) {
        var VmergeCount = 1;
        for (var Index = StartRow + 1; Index < this.Content.length; Index++) {
            var Row = this.Content[Index];
            var BeforeInfo = Row.Get_Before();
            var CurGridCol = BeforeInfo.GridBefore;
            var CurCell = 0;
            var CellsCount = Row.Get_CellsCount();
            var bWasMerged = false;
            while (CurGridCol <= StartGridCol && CurCell < CellsCount) {
                var Cell = Row.Get_Cell(CurCell);
                var CellGridSpan = Cell.Get_GridSpan();
                var Vmerge = Cell.Get_VMerge();
                if (CurGridCol === StartGridCol && GridSpan === CellGridSpan && vmerge_Continue === Vmerge) {
                    bWasMerged = true;
                    VmergeCount++;
                    break;
                } else {
                    if (CurGridCol === StartGridCol && GridSpan === CellGridSpan && vmerge_Continue != Vmerge) {
                        bWasMerged = true;
                        return VmergeCount;
                    } else {
                        if (CurGridCol <= StartGridCol + GridSpan - 1 && CurGridCol + CellGridSpan - 1 >= StartGridCol) {
                            break;
                        }
                    }
                }
                CurGridCol += CellGridSpan;
                CurCell++;
            }
            if (false === bWasMerged) {
                break;
            }
        }
        return VmergeCount;
    },
    Internal_GetVertMergeCount2: function (StartRow, StartGridCol, GridSpan) {
        var VmergeCount = 1;
        var Start_Row = this.Content[StartRow];
        var Start_VMerge = vmerge_Restart;
        var Start_CellsCount = Start_Row.Get_CellsCount();
        for (var Index = 0; Index < Start_CellsCount; Index++) {
            var Temp_Grid_start = Start_Row.Get_CellInfo(Index).StartGridCol;
            if (Temp_Grid_start === StartGridCol) {
                Start_VMerge = Start_Row.Get_Cell(Index).Get_VMerge();
                break;
            }
        }
        if (vmerge_Restart === Start_VMerge) {
            return VmergeCount;
        }
        for (var Index = StartRow - 1; Index >= 0; Index--) {
            var Row = this.Content[Index];
            var BeforeInfo = Row.Get_Before();
            var CurGridCol = BeforeInfo.GridBefore;
            var CurCell = 0;
            var CellsCount = Row.Get_CellsCount();
            var bWasMerged = false;
            while (CurGridCol <= StartGridCol && CurCell < CellsCount) {
                var Cell = Row.Get_Cell(CurCell);
                var CellGridSpan = Cell.Get_GridSpan();
                var Vmerge = Cell.Get_VMerge();
                if (CurGridCol === StartGridCol && GridSpan === CellGridSpan && vmerge_Continue === Vmerge) {
                    bWasMerged = true;
                    VmergeCount++;
                    break;
                } else {
                    if (CurGridCol === StartGridCol && GridSpan === CellGridSpan && vmerge_Continue != Vmerge) {
                        bWasMerged = true;
                        VmergeCount++;
                        return VmergeCount;
                    } else {
                        if (CurGridCol <= StartGridCol + GridSpan - 1 && CurGridCol + CellGridSpan - 1 >= StartGridCol) {
                            break;
                        }
                    }
                }
                CurGridCol += CellGridSpan;
                CurCell++;
            }
            if (false === bWasMerged) {
                break;
            }
        }
        return VmergeCount;
    },
    Internal_Check_TableRows: function (bSaveHeight) {
        var Rows_to_Delete = new Array();
        var Rows_to_CalcH = new Array();
        var Rows_to_CalcH2 = new Array();
        for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
            var Row = this.Content[CurRow];
            var bVmerge_Restart = false;
            var bVmerge_Continue = false;
            var bNeedDeleteRow = true;
            var bNeedCalcHeight = false;
            if (Row.Get_Before().GridBefore > 0 || Row.Get_After().GridAfter > 0) {
                bNeedCalcHeight = true;
            }
            for (var CurCell = 0; CurCell < Row.Get_CellsCount(); CurCell++) {
                var Cell = Row.Get_Cell(CurCell);
                var VMerge = Cell.Get_VMerge();
                if (VMerge != vmerge_Continue) {
                    var VMergeCount = this.Internal_GetVertMergeCount(CurRow, Row.Get_CellInfo(CurCell).StartGridCol, Cell.Get_GridSpan());
                    if (VMergeCount > 1) {
                        bVmerge_Restart = true;
                    }
                    bNeedDeleteRow = false;
                    if (true === bNeedCalcHeight) {
                        if (1 === VMergeCount) {
                            bNeedCalcHeight = false;
                        }
                    }
                } else {
                    bVmerge_Continue = true;
                }
            }
            if (true === bVmerge_Continue && true === bVmerge_Restart) {
                Rows_to_CalcH2.push(CurRow);
            } else {
                if (true === bNeedCalcHeight) {
                    Rows_to_CalcH.push(CurRow);
                }
            }
            if (true === bNeedDeleteRow) {
                Rows_to_Delete.push(CurRow);
            }
        }
        for (var Index = 0; Index < Rows_to_CalcH2.length; Index++) {
            var RowIndex = Rows_to_CalcH2[Index];
            var MinHeight = -1;
            var Row = this.Content[RowIndex];
            var CellsCount = Row.Get_CellsCount();
            for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                var Cell = Row.Get_Cell(CurCell);
                var VMerge = Cell.Get_VMerge();
                if (vmerge_Restart === VMerge) {
                    var CurMinHeight = Cell.Content.Get_EmptyHeight();
                    if (CurMinHeight < MinHeight || MinHeight === -1) {
                        MinHeight = CurMinHeight;
                    }
                }
            }
            var OldHeight = this.Content[RowIndex].Get_Height();
            if (undefined === OldHeight || heightrule_Auto == OldHeight.HRule || (MinHeight > OldHeight.Value)) {
                this.Content[RowIndex].Set_Height(MinHeight, heightrule_AtLeast);
            }
        }
        if (Rows_to_Delete.length <= 0) {
            return false;
        }
        if (true === bSaveHeight) {
            for (var Index = 0; Index < Rows_to_CalcH.length; Index++) {
                var RowIndex = Rows_to_CalcH[Index];
                this.Content[RowIndex].Set_Height(this.RowsInfo[RowIndex].H, heightrule_AtLeast);
            }
            for (var Counter = 0; Counter < Rows_to_Delete.length;) {
                var CurRowSpan = 1;
                var StartRow = Rows_to_Delete[Counter];
                while (Counter + CurRowSpan < Rows_to_Delete.length && Rows_to_Delete[Counter] + CurRowSpan === Rows_to_Delete[Counter + CurRowSpan]) {
                    CurRowSpan++;
                }
                if (this.RowsInfo[StartRow - 1 + CurRowSpan].StartPage === this.RowsInfo[StartRow - 1].StartPage) {
                    var StartPage = this.RowsInfo[StartRow - 1 + CurRowSpan].StartPage;
                    var Summary_Height = this.RowsInfo[StartRow - 1 + CurRowSpan].H[StartPage] + this.RowsInfo[StartRow - 1 + CurRowSpan].Y[StartPage] - this.RowsInfo[StartRow - 1].Y[StartPage];
                    this.Content[StartRow - 1].Set_Height(Summary_Height, heightrule_AtLeast);
                }
                Counter += CurRowSpan;
            }
        }
        for (var Index = Rows_to_Delete.length - 1; Index >= 0; Index--) {
            var Row_to_Delete = Rows_to_Delete[Index];
            this.Internal_Remove_Row(Row_to_Delete);
        }
        return true;
    },
    Internal_Remove_Row: function (Index) {
        if (Index >= this.Content.length || Index < 0) {
            return;
        }
        History.Add(this, {
            Type: historyitem_Table_RemoveRow,
            Pos: Index,
            Item: {
                Row: this.Content[Index],
                TableRowsBottom: this.TableRowsBottom[Index],
                RowsInfo: this.RowsInfo[Index]
            }
        });
        this.Rows--;
        this.Content.splice(Index, 1);
        this.TableRowsBottom.splice(Index, 1);
        this.RowsInfo.splice(Index, 1);
        this.Internal_ReIndexing(Index);
    },
    Internal_Add_Row: function (Index, CellsCount, bReIndexing) {
        if (Index < 0) {
            Index = 0;
        }
        if (Index >= this.Content.length) {
            Index = this.Content.length;
        }
        this.Rows++;
        var NewRow = new CTableRow(this, CellsCount);
        History.Add(this, {
            Type: historyitem_Table_AddRow,
            Pos: Index,
            Item: {
                Row: NewRow,
                TableRowsBottom: {},
                RowsInfo: {}
            }
        });
        this.Content.splice(Index, 0, NewRow);
        this.TableRowsBottom.splice(Index, 0, {});
        this.RowsInfo.splice(Index, 0, {});
        if (true === bReIndexing) {
            this.Internal_ReIndexing(Index);
        } else {
            if (Index > 0) {
                this.Content[Index - 1].Next = NewRow;
                NewRow.Prev = this.Content[Index - 1];
            } else {
                NewRow.Prev = null;
            }
            if (Index < this.Content.length - 1) {
                this.Content[Index + 1].Prev = NewRow;
                NewRow.Next = this.Content[Index + 1];
            } else {
                NewRow.Next = null;
            }
        }
        return NewRow;
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
    Internal_ReIndexing: function (StartIndex) {
        if ("undefined" === typeof(StartIndex)) {
            StartIndex = 0;
        }
        for (var Ind = StartIndex; Ind < this.Content.length; Ind++) {
            this.Content[Ind].Set_Index(Ind);
            this.Content[Ind].Prev = (Ind > 0 ? this.Content[Ind - 1] : null);
            this.Content[Ind].Next = (Ind < this.Content.length - 1 ? this.Content[Ind + 1] : null);
        }
    },
    Internal_CreateNewGrid: function (RowsInfo) {
        var CurPos = new Array();
        var CurX = new Array();
        for (var Index = 0; Index < RowsInfo.length; Index++) {
            CurPos[Index] = 0;
            CurX[Index] = RowsInfo[Index][0].W;
            for (var Index2 = 0; Index2 < RowsInfo[Index].length; Index2++) {
                RowsInfo[Index][Index2].GridSpan = 1;
                if (1 != RowsInfo[Index][RowsInfo[Index].length - 1].Type) {
                    RowsInfo[Index].push({
                        W: 0,
                        Type: 1,
                        GridSpan: 0
                    });
                } else {
                    RowsInfo[Index][RowsInfo[Index].length - 1] = {
                        W: 0,
                        Type: 1,
                        GridSpan: 0
                    };
                }
            }
        }
        var TableGrid = new Array();
        var bEnd = false;
        var PrevX = 0;
        while (true != bEnd) {
            var MinX = -1;
            for (var Index = 0; Index < RowsInfo.length; Index++) {
                if ((MinX === -1 || CurX[Index] < MinX) && !(RowsInfo[Index].length - 1 === CurPos[Index] && 1 === RowsInfo[Index][CurPos[Index]].Type)) {
                    MinX = CurX[Index];
                }
            }
            for (var Index = 0; Index < RowsInfo.length; Index++) {
                if (RowsInfo[Index].length - 1 === CurPos[Index] && 1 === RowsInfo[Index][CurPos[Index]].Type) {
                    RowsInfo[Index][CurPos[Index]].GridSpan++;
                } else {
                    if (Math.abs(MinX - CurX[Index]) < 0.001) {
                        CurPos[Index]++;
                        CurX[Index] += RowsInfo[Index][CurPos[Index]].W;
                    } else {
                        RowsInfo[Index][CurPos[Index]].GridSpan++;
                    }
                }
            }
            TableGrid.push(MinX - PrevX);
            PrevX = MinX;
            bEnd = true;
            for (var Index = 0; Index < RowsInfo.length; Index++) {
                if (RowsInfo[Index].length - 1 != CurPos[Index]) {
                    bEnd = false;
                    break;
                }
            }
        }
        for (var CurRow = 0; CurRow < RowsInfo.length; CurRow++) {
            var RowInfo = RowsInfo[CurRow];
            var Row = this.Content[CurRow];
            var CurIndex = 0;
            if (-1 === RowInfo[0].Type) {
                if (RowInfo[0].GridSpan > 0) {
                    Row.Set_Before(RowInfo[0].GridSpan);
                }
                CurIndex++;
            } else {
                Row.Set_Before(0);
            }
            for (var CurCell = 0; CurIndex < RowInfo.length; CurIndex++, CurCell++) {
                if (1 === RowInfo[CurIndex].Type) {
                    break;
                }
                var Cell = Row.Get_Cell(CurCell);
                Cell.Set_GridSpan(RowInfo[CurIndex].GridSpan);
                var WType = Cell.Get_W().Type;
                if (tblwidth_Auto != WType && tblwidth_Nil != WType) {
                    Cell.Set_W(new CTableMeasurement(tblwidth_Mm, RowInfo[CurIndex].W));
                }
            }
            CurIndex = RowInfo.length - 1;
            if (1 === RowInfo[CurIndex].Type) {
                Row.Set_After(RowInfo[CurIndex].GridSpan);
            } else {
                Row.Set_After(0);
            }
        }
        History.Add(this, {
            Type: historyitem_Table_TableGrid,
            Old: this.TableGrid,
            New: TableGrid
        });
        this.TableGrid = TableGrid;
        return TableGrid;
    },
    Internal_UpdateCellW: function (Col) {
        for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
            var Row = this.Content[CurRow];
            var Cells_Count = Row.Get_CellsCount();
            var CurGridCol = Row.Get_Before().GridBefore;
            for (var CurCell = 0; CurCell < Cells_Count; CurCell++) {
                var Cell = Row.Get_Cell(CurCell);
                var GridSpan = Cell.Get_GridSpan();
                if (Col >= CurGridCol && Col < CurGridCol + GridSpan) {
                    CellWType = Cell.Get_W().Type;
                    if (tblwidth_Auto != CellWType && tblwidth_Nil != CellWType) {
                        var W = 0;
                        for (var CurSpan = CurGridCol; CurSpan < CurGridCol + GridSpan; CurSpan++) {
                            W += this.TableGrid[CurSpan];
                        }
                        Cell.Set_W(new CTableMeasurement(tblwidth_Mm, W));
                    }
                    break;
                }
                CurGridCol += GridSpan;
            }
        }
    },
    Internal_CompareBorders: function (Border1, Border2, bTableBorder1, bTableBorder2) {
        if ("undefined" === typeof(bTableBorder1)) {
            bTableBorder1 = false;
        }
        if ("undefined" === typeof(bTableBorder2)) {
            bTableBorder2 = false;
        }
        if (true === bTableBorder1) {
            return Border2;
        }
        if (true === bTableBorder2) {
            return Border1;
        }
        if (border_None === Border1.Value) {
            return Border2;
        }
        if (border_None === Border2.Value) {
            return Border1;
        }
        var W_b_1 = Border1.Size;
        var W_b_2 = Border2.Size;
        if (W_b_1 > W_b_2) {
            return Border1;
        } else {
            if (W_b_2 > W_b_1) {
                return Border2;
            }
        }
        var Brightness_1_1 = Border1.Color.r + Border1.Color.b + 2 * Border1.Color.g;
        var Brightness_1_2 = Border2.Color.r + Border2.Color.b + 2 * Border2.Color.g;
        if (Brightness_1_1 < Brightness_1_2) {
            return Border1;
        } else {
            if (Brightness_1_2 < Brightness_1_1) {
                return Border2;
            }
        }
        var Brightness_2_1 = Border1.Color.b + 2 * Border1.Color.g;
        var Brightness_2_2 = Border2.Color.b + 2 * Border2.Color.g;
        if (Brightness_2_1 < Brightness_2_2) {
            return Border1;
        } else {
            if (Brightness_2_2 < Brightness_2_1) {
                return Border2;
            }
        }
        var Brightness_3_1 = Border1.Color.g;
        var Brightness_3_2 = Border2.Color.g;
        if (Brightness_3_1 < Brightness_3_2) {
            return Border1;
        } else {
            if (Brightness_3_2 < Brightness_3_1) {
                return Border2;
            }
        }
        return Border1;
    },
    Internal_Get_StartMergedCell: function (StartRow, StartGridCol, GridSpan) {
        var Result = null;
        for (var Index = StartRow; Index >= 0; Index--) {
            var Row = this.Content[Index];
            var BeforeInfo = Row.Get_Before();
            var CurGridCol = BeforeInfo.GridBefore;
            var CurCell = 0;
            var CellsCount = Row.Get_CellsCount();
            var bWasMerged = false;
            while (CurGridCol <= StartGridCol && CurCell < CellsCount) {
                var Cell = Row.Get_Cell(CurCell);
                var CellGridSpan = Cell.Get_GridSpan();
                var Vmerge = Cell.Get_VMerge();
                if (CurGridCol === StartGridCol && GridSpan === CellGridSpan && vmerge_Continue === Vmerge) {
                    bWasMerged = true;
                    Result = Cell;
                    break;
                } else {
                    if (CurGridCol === StartGridCol && GridSpan === CellGridSpan && vmerge_Continue != Vmerge) {
                        bWasMerged = true;
                        Result = Cell;
                        return Result;
                    } else {
                        if (CurGridCol <= StartGridCol + GridSpan - 1 && CurGridCol + CellGridSpan - 1 >= StartGridCol) {
                            break;
                        }
                    }
                }
                CurGridCol += CellGridSpan;
                CurCell++;
            }
            if (false === bWasMerged) {
                break;
            }
        }
        return Result;
    },
    Internal_Get_StartMergedCell2: function (CellIndex, RowIndex) {
        var Row = this.Content[RowIndex];
        var Cell = Row.Get_Cell(CellIndex);
        var CellInfo = Row.Get_CellInfo(CellIndex);
        return this.Internal_Get_StartMergedCell(RowIndex, CellInfo.StartGridCol, Cell.Get_GridSpan());
    },
    Internal_Get_Cell_ByStartGridCol: function (RowIndex, StartGridCol) {
        var Row = this.Content[RowIndex];
        var BeforeInfo = Row.Get_Before();
        var CurGridCol = BeforeInfo.GridBefore;
        var CellsCount = Row.Get_CellsCount();
        for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
            var Cell = Row.Get_Cell(CurCell);
            var GridSpan = Cell.Get_GridSpan();
            if (StartGridCol === CurGridCol) {
                return CurCell;
            } else {
                if (CurGridCol > StartGridCol) {
                    return -1;
                }
            }
            CurGridCol += GridSpan;
        }
        return -1;
    },
    Internal_Update_TableMarkup: function (RowIndex, CellIndex, PageNum) {
        this.Markup.Internal = {
            RowIndex: RowIndex,
            CellIndex: CellIndex,
            PageNum: PageNum
        };
        var _x = this.Parent.transform.TransformPointX(0, 0);
        var _y = this.Parent.transform.TransformPointY(0, 0);
        this.Markup.X = this.X;
        var Row = this.Content[RowIndex];
        var CellSpacing = (null === Row.Get_CellSpacing() ? 0 : Row.Get_CellSpacing());
        var CellsCount = Row.Get_CellsCount();
        var GridBefore = Row.Get_Before().GridBefore;
        this.Markup.X += this.TableSumGrid[GridBefore - 1];
        this.Markup.Cols = new Array();
        this.Markup.Margins = new Array();
        for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
            var Cell = Row.Get_Cell(CurCell);
            var StartGridCol = Row.Get_CellInfo(CurCell).StartGridCol;
            var GridSpan = Cell.Get_GridSpan();
            var CellMargin = Cell.Get_Margins();
            this.Markup.Cols.push(this.TableSumGrid[StartGridCol + GridSpan - 1] - this.TableSumGrid[StartGridCol - 1]);
            var Margin_left = CellMargin.Left.W;
            var Margin_right = CellMargin.Right.W;
            if (0 === CurCell) {
                Margin_left += CellSpacing;
            } else {
                Margin_left += CellSpacing / 2;
            }
            if (CellsCount - 1 === CurCell) {
                Margin_right += CellSpacing;
            } else {
                Margin_right += CellSpacing / 2;
            }
            this.Markup.Margins.push({
                Left: Margin_left,
                Right: Margin_right
            });
        }
        var Row_start = this.Pages[PageNum].FirstRow;
        var Row_last = Row_start;
        if (PageNum + 1 < this.Pages.length) {
            Row_last = this.Pages[PageNum + 1].FirstRow;
            if ((Row_start != Row_last || (0 === Row_start && 0 === Row_last)) && false === this.RowsInfo[Row_last].FirstPage) {
                Row_last--;
            }
        } else {
            Row_last = this.Content.length - 1;
        }
        this.Markup.Rows = new Array();
        for (var CurRow = Row_start; CurRow <= Row_last; CurRow++) {
            this.Markup.Rows.push({
                Y: this.RowsInfo[CurRow].Y[PageNum],
                H: this.RowsInfo[CurRow].H[PageNum]
            });
        }
        this.Markup.CurCol = CellIndex;
        this.Markup.CurRow = RowIndex - Row_start;
        var _markup = this.Markup.CreateDublicate();
        _markup.X += _x;
        for (CurRow = Row_start; CurRow <= Row_last; CurRow++) {
            _markup.Rows[CurRow].Y += _y;
        }
        this.DrawingDocument.Set_RulerState_Table(_markup);
    },
    Internal_CheckBorders: function (X, Y, PageNum) {
        var CellPos = this.Internal_GetCellByXY(X, Y, PageNum);
        var Row = this.Content[CellPos.Row];
        var Cell = Row.Get_Cell(CellPos.Cell);
        var CellInfo = Row.Get_CellInfo(CellPos.Cell);
        var VMerge_count = this.Internal_GetVertMergeCount(CellPos.Row, CellInfo.StartGridCol, Cell.Get_GridSpan());
        var VMerge_count_over = VMerge_count;
        if (PageNum + 1 < this.Pages.length) {
            if (CellPos.Row + VMerge_count - 1 >= this.Pages[PageNum + 1].FirstRow) {
                VMerge_count = this.Pages[PageNum + 1].FirstRow + 1 - CellPos.Row;
                if (false === this.RowsInfo[CellPos.Row + VMerge_count - 1].FirstPage) {
                    VMerge_count--;
                }
            }
        }
        var Row_end = this.Content[CellPos.Row + VMerge_count - 1];
        var Cell_end = this.Internal_Get_Cell_ByStartGridCol(CellPos.Row + VMerge_count - 1, CellInfo.StartGridCol);
        var CellInfo_end = Row_end.Get_CellInfo(Cell_end.Index);
        var X_cell_start = CellInfo.X_grid_start;
        var X_cell_end = CellInfo.X_grid_end;
        var Y_cell_start = this.RowsInfo[CellPos.Row].Y[PageNum];
        var Y_cell_end = this.RowsInfo[CellPos.Row + VMerge_count - 1].Y[PageNum] + this.RowsInfo[CellPos.Row + VMerge_count - 1].H[PageNum];
        var Radius = this.DrawingDocument.GetMMPerDot(3);
        if (Y <= Y_cell_start + Radius && Y >= Y_cell_start - Radius) {
            return {
                Pos: CellPos,
                Border: 0
            };
        } else {
            if (Y <= Y_cell_end + Radius && Y >= Y_cell_end - Radius) {
                if (VMerge_count != VMerge_count_over) {
                    return {
                        Pos: CellPos,
                        Border: -1
                    };
                }
                return {
                    Pos: CellPos,
                    Border: 2,
                    Row: CellPos.Row + VMerge_count_over - 1
                };
            } else {
                if (X <= X_cell_start + Radius && X >= X_cell_start - Radius) {
                    return {
                        Pos: CellPos,
                        Border: 3
                    };
                } else {
                    if (X <= X_cell_end + Radius && X >= X_cell_end - Radius) {
                        return {
                            Pos: CellPos,
                            Border: 1
                        };
                    }
                }
            }
        }
        return {
            Pos: CellPos,
            Border: -1
        };
    },
    Internal_OnContentRecalculate: function (bNeedDocumentRecalc, PageNum, DocumentIndex) {
        if (false === this.TurnOffRecalcEvent) {
            this.Parent.OnContentRecalculate(bNeedDocumentRecalc, PageNum, DocumentIndex);
        }
    },
    Internal_Selection_UpdateCells: function (bForceSelectByLines) {
        if ("undefined" == typeof(bForceSelectByLines)) {
            bForceSelectByLines = false;
        }
        this.Selection.Type = table_Selection_Cell;
        this.Selection.Data = new Array();
        if (true === this.Parent.Selection_Is_OneElement() && false == bForceSelectByLines) {
            var StartRow = this.Selection.StartPos.Pos.Row;
            var StartCell = this.Selection.StartPos.Pos.Cell;
            var EndRow = this.Selection.EndPos.Pos.Row;
            var EndCell = this.Selection.EndPos.Pos.Cell;
            if (EndRow < StartRow) {
                var TempRow = StartRow;
                StartRow = EndRow;
                EndRow = TempRow;
                var TempCell = StartCell;
                StartCell = EndCell;
                EndCell = TempCell;
            }
            if (StartRow === EndRow) {
                if (EndCell < StartCell) {
                    var TempCell = StartCell;
                    StartCell = EndCell;
                    EndCell = TempCell;
                }
                var Row = this.Content[StartRow];
                for (var CurCell = StartCell; CurCell <= EndCell; CurCell++) {
                    var Cell = Row.Get_Cell(CurCell);
                    var GridSpan = Cell.Get_GridSpan();
                    var Vmerge = Cell.Get_VMerge();
                    if (vmerge_Continue === Vmerge) {
                        CurGridCol += GridSpan;
                        continue;
                    }
                    this.Selection.Data.push({
                        Row: StartRow,
                        Cell: CurCell
                    });
                }
            } else {
                var Cell_s = this.Content[StartRow].Get_Cell(StartCell);
                var Cell_e = this.Content[EndRow].Get_Cell(EndCell);
                var GridCol_cs_start = this.Content[StartRow].Get_CellInfo(StartCell).StartGridCol;
                var GridCol_cs_end = Cell_s.Get_GridSpan() - 1 + GridCol_cs_start;
                var GridCol_ce_start = this.Content[EndRow].Get_CellInfo(EndCell).StartGridCol;
                var GridCol_ce_end = Cell_e.Get_GridSpan() - 1 + GridCol_ce_start;
                var GridCol_start = GridCol_cs_start;
                if (GridCol_ce_start < GridCol_start) {
                    GridCol_start = GridCol_ce_start;
                }
                var GridCol_end = GridCol_cs_end;
                if (GridCol_end < GridCol_ce_end) {
                    GridCol_end = GridCol_ce_end;
                }
                for (var CurRow = StartRow; CurRow <= EndRow; CurRow++) {
                    var Row = this.Content[CurRow];
                    var BeforeInfo = Row.Get_Before();
                    var CurGridCol = BeforeInfo.GridBefore;
                    var CellsCount = Row.Get_CellsCount();
                    for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                        var Cell = Row.Get_Cell(CurCell);
                        var GridSpan = Cell.Get_GridSpan();
                        var Vmerge = Cell.Get_VMerge();
                        if (vmerge_Continue === Vmerge) {
                            CurGridCol += GridSpan;
                            continue;
                        }
                        if ((StartRow === CurRow) || (EndRow === CurRow) || (CurRow > StartRow && CurRow < EndRow)) {
                            if ((CurGridCol >= GridCol_start && CurGridCol <= GridCol_end) || (CurGridCol + GridSpan - 1 >= GridCol_start && CurGridCol + GridSpan - 1 <= GridCol_end)) {
                                this.Selection.Data.push({
                                    Row: CurRow,
                                    Cell: CurCell
                                });
                            }
                        }
                        CurGridCol += GridSpan;
                    }
                }
            }
        } else {
            var StartRow = this.Selection.StartPos.Pos.Row;
            var EndRow = this.Selection.EndPos.Pos.Row;
            if (EndRow < StartRow) {
                var TempRow = StartRow;
                StartRow = EndRow;
                EndRow = TempRow;
            }
            for (var CurRow = StartRow; CurRow <= EndRow; CurRow++) {
                var Row = this.Content[CurRow];
                var CellsCount = Row.Get_CellsCount();
                for (var CurCell = 0; CurCell < CellsCount; CurCell++) {
                    var Cell = Row.Get_Cell(CurCell);
                    var Vmerge = Cell.Get_VMerge();
                    if (vmerge_Continue === Vmerge) {
                        continue;
                    }
                    this.Selection.Data.push({
                        Row: CurRow,
                        Cell: CurCell
                    });
                }
            }
        }
        if (this.Selection.Data.length > 1) {
            this.Selection.CurRow = this.Selection.Data[this.Selection.Data.length - 1].Row;
        }
        if (true != this.Is_Inline() && true === this.Selection.Use && false === this.Selection.Start) {
            var ParaPr = this.Get_Paragraph_ParaPr();
            if (null != ParaPr) {
                editor.UpdateParagraphProp(ParaPr);
            }
            var TextPr = this.Get_Paragraph_TextPr();
            if (null != TextPr) {
                editor.UpdateTextPr(TextPr);
            }
        }
    },
    Internal_CompareBorders2: function (Border1, Border2) {
        var ResultBorder = new CDocumentBorder();
        if (Border1.Value != Border2.Value) {
            ResultBorder.Value = undefined;
        } else {
            ResultBorder.Value = Border1.Value;
        }
        if (Border1.Size != Border2.Size) {
            ResultBorder.Size = undefined;
        } else {
            ResultBorder.Size = Border1.Size;
        }
        if (undefined === Border1.Color || undefined === Border2.Color || Border1.Color.r != Border2.Color.r || Border1.Color.g != Border2.Color.g || Border1.Color.b != Border2.Color.b) {
            ResultBorder.Color = undefined;
        } else {
            ResultBorder.Color.Set(Border1.Color.r, Border1.Color.g, Border1.Color.b);
        }
        return ResultBorder;
    },
    Internal_CompareBorders3: function (Border1, Border2) {
        if (Border1.Value != Border2.Value) {
            return false;
        }
        if (Border1.Size != Border2.Size) {
            return false;
        }
        if (Border1.Color.r != Border2.Color.r || Border1.Color.g != Border2.Color.g || Border1.Color.b != Border2.Color.b) {
            return false;
        }
        return true;
    },
    Internal_CheckNullBorder: function (Border) {
        if (null === Border || undefined === Border) {
            return true;
        }
        if (null != Border.Value) {
            return false;
        }
        if (null != Border.Size) {
            return false;
        }
        if (null != Border.Color && (null != Border.Color.r || null != Border.Color.g || null != Border.Color.b)) {
            return false;
        }
        return true;
    },
    Internal_Get_SelectionArray: function () {
        var SelectionArray = null;
        if (true === this.ApplyToAll) {
            SelectionArray = new Array();
            for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
                var Row = this.Content[CurRow];
                for (var CurCell = 0; CurCell < Row.Get_CellsCount(); CurCell++) {
                    var Cell = Row.Get_Cell(CurCell);
                    var Vmerge = Cell.Get_VMerge();
                    if (vmerge_Continue === Vmerge) {
                        continue;
                    }
                    SelectionArray.push({
                        Cell: CurCell,
                        Row: CurRow
                    });
                }
            }
        } else {
            if (true === this.Selection.Use && table_Selection_Cell === this.Selection.Type) {
                SelectionArray = this.Selection.Data;
            } else {
                SelectionArray = [{
                    Cell: this.CurCell.Index,
                    Row: this.CurCell.Row.Index
                }];
            }
        }
        return SelectionArray;
    },
    Internal_Get_TableMinWidth: function () {
        var MinWidth = 0;
        for (var CurRow = 0; CurRow < this.Content.length; CurRow++) {
            var Row = this.Content[CurRow];
            var Cells_Count = Row.Get_CellsCount();
            var CellSpacing = Row.Get_CellSpacing();
            if (null === CellSpacing) {
                CellSpacing = 0;
            }
            var RowWidth = CellSpacing * (Cells_Count + 1);
            for (var CurCell = 0; CurCell < Cells_Count; CurCell++) {
                var Cell = Row.Get_Cell(CurCell);
                var Cell_Margins = Cell.Get_Margins();
                RowWidth += Cell_Margins.Left.W + Cell_Margins.Right.W;
            }
            if (MinWidth < RowWidth) {
                MinWidth = RowWidth;
            }
        }
        return MinWidth;
    },
    Internal_Get_MinSumGrid: function () {
        var ColsCount = this.TableGrid.length;
        var SumGrid = new Array();
        for (var Index = -1; Index < ColsCount; Index++) {
            SumGrid[Index] = 0;
        }
        var RowsCount = this.Content.length;
        for (var CurRow = 0; CurRow < RowsCount; CurRow++) {
            var Row = this.Content[CurRow];
            var Cells_Count = Row.Get_CellsCount();
            var CellSpacing = Row.Get_CellSpacing();
            if (null === CellSpacing) {
                CellSpacing = 0;
            }
            var CurGridCol = 0;
            for (var CurCell = 0; CurCell < Cells_Count; CurCell++) {
                var Cell = Row.Get_Cell(CurCell);
                var Cell_Margins = Cell.Get_Margins();
                var GridSpan = Cell.Get_GridSpan();
                var Cell_MinWidth = Cell_Margins.Left.W + Cell_Margins.Right.W;
                if (0 === CurCell || Cells_Count - 1 === CurCell) {
                    Cell_MinWidth += CellSpacing * 1.5;
                } else {
                    Cell_MinWidth += CellSpacing;
                }
                if (SumGrid[CurGridCol + GridSpan - 1] < SumGrid[CurGridCol - 1] + Cell_MinWidth) {
                    SumGrid[CurGridCol + GridSpan - 1] = SumGrid[CurGridCol - 1] + Cell_MinWidth;
                }
                CurGridCol += GridSpan;
            }
        }
        return SumGrid;
    },
    Internal_ScaleTableWidth: function (SumGrid, TableW) {
        var SumGrid_min = this.Internal_Get_MinSumGrid();
        var Grids_to_scale = new Array();
        for (var Index = 0; Index < SumGrid.length; Index++) {
            Grids_to_scale[Index] = true;
        }
        var Grids_to_scale_count = Grids_to_scale.length;
        var TableGrid = new Array();
        TableGrid[0] = SumGrid[0];
        for (var Index = 1; Index < SumGrid.length; Index++) {
            TableGrid[Index] = SumGrid[Index] - SumGrid[Index - 1];
        }
        var TableGrid_min = new Array();
        TableGrid_min[0] = SumGrid_min[0];
        for (var Index = 1; Index < SumGrid_min.length; Index++) {
            TableGrid_min[Index] = SumGrid_min[Index] - SumGrid_min[Index - 1];
        }
        var CurrentW = SumGrid[SumGrid.length - 1];
        while (Grids_to_scale_count > 0) {
            var Koef = TableW / CurrentW;
            var TableGrid_cur = new Array();
            for (var Index = 0; Index < TableGrid.length; Index++) {
                TableGrid_cur[Index] = TableGrid[Index];
            }
            for (var AddIndex = 0; AddIndex <= TableGrid_cur.length - 1; AddIndex++) {
                if (true === Grids_to_scale[AddIndex]) {
                    TableGrid_cur[AddIndex] = TableGrid_cur[AddIndex] * Koef;
                }
            }
            var bBreak = true;
            for (var AddIndex = 0; AddIndex <= TableGrid_cur.length - 1; AddIndex++) {
                if (true === Grids_to_scale[AddIndex] && TableGrid_cur[AddIndex] - TableGrid_min[AddIndex] < 0.001) {
                    bBreak = false;
                    Grids_to_scale[AddIndex] = false;
                    Grids_to_scale_count--;
                    CurrentW -= TableGrid[AddIndex];
                    TableW -= TableGrid_min[AddIndex];
                    TableGrid[AddIndex] = TableGrid_min[AddIndex];
                }
            }
            if (true === bBreak) {
                for (var AddIndex = 0; AddIndex <= TableGrid_cur.length - 1; AddIndex++) {
                    if (true === Grids_to_scale[AddIndex]) {
                        TableGrid[AddIndex] = TableGrid_cur[AddIndex];
                    }
                }
                break;
            }
        }
        var SumGrid_new = new Array();
        SumGrid_new[-1] = 0;
        for (var Index = 0; Index < TableGrid.length; Index++) {
            SumGrid_new[Index] = TableGrid[Index] + SumGrid_new[Index - 1];
        }
        return SumGrid_new;
    },
    Internal_SaveTableGridInHistory: function (TableGrid_new, TableGrid_old) {
        var NeedSave = false;
        if (TableGrid_new.length != TableGrid_old.length) {
            NeedSave = true;
        }
        if (false === NeedSave) {
            for (var Index = 0; Index < TableGrid_new.length; Index++) {
                if (Math.abs(TableGrid_new[Index] - TableGrid_old[Index]) > 0.001) {
                    NeedSave = true;
                    break;
                }
            }
        }
        if (true === NeedSave) {
            History.Add(this, {
                Type: historyitem_Table_TableGrid,
                Old: TableGrid_old,
                New: TableGrid_new
            });
        }
    },
    Internal_Get_NextCell: function (Pos) {
        var Cell_Index = Pos.Cell;
        var Row_Index = Pos.Row;
        if (Cell_Index < this.Content[Row_Index].Get_CellsCount() - 1) {
            Pos.Cell = Cell_Index + 1;
            return this.Content[Pos.Row].Get_Cell(Pos.Cell);
        } else {
            if (Row_Index < this.Content.length - 1) {
                Pos.Row = Row_Index + 1;
                Pos.Cell = 0;
                return this.Content[Pos.Row].Get_Cell(Pos.Cell);
            } else {
                return null;
            }
        }
    },
    Internal_Get_PrevCell: function (Pos) {
        var Cell_Index = Pos.Cell;
        var Row_Index = Pos.Row;
        if (Cell_Index > 0) {
            Pos.Cell = Cell_Index - 1;
            return this.Content[Pos.Row].Get_Cell(Pos.Cell);
        } else {
            if (Row_Index > 0) {
                Pos.Row = Row_Index - 1;
                Pos.Cell = this.Content[Row_Index - 1].Get_CellsCount() - 1;
                return this.Content[Pos.Row].Get_Cell(Pos.Cell);
            } else {
                return null;
            }
        }
    },
    Internal_Copy_Grid: function (Grid) {
        if (undefined !== Grid && null !== Grid) {
            var Count = Grid.length;
            var NewGrid = new Array(Count);
            var Index = 0;
            for (; Index < Count; Index++) {
                NewGrid[Index] = Grid[Index];
            }
            return NewGrid;
        }
        return undefined;
    }
};
function CTableRow(Table, Cols, TableGrid) {
    this.Id = g_oIdCounter.Get_NewId();
    this.Table = Table;
    this.Next = null;
    this.Prev = null;
    this.Content = new Array();
    for (var Index = 0; Index < Cols; Index++) {
        var ColW = (undefined != TableGrid && undefined != TableGrid[Index] ? TableGrid[Index] : undefined);
        this.Content[Index] = new CTableCell(this, ColW);
    }
    this.Internal_ReIndexing();
    this.CellsInfo = new Array();
    this.Metrics = {
        X_min: 0,
        X_max: 0
    };
    this.SpacingInfo = {
        Top: false,
        Bottom: false
    };
    this.CompiledPr = {
        Pr: null,
        NeedRecalc: true
    };
    this.Pr = new CTableRowPr();
    this.Height = 0;
    this.PagesCount = 1;
    CollaborativeEditing.Add_NewDC(this);
    this.m_oContentChanges = new CContentChanges();
    g_oTableId.Add(this, this.Id);
}
CTableRow.prototype = {
    Set_Id: function (newId) {
        g_oTableId.Reset_Id(this, newId, this.Id);
        this.Id = newId;
    },
    Get_Id: function () {
        return this.Id;
    },
    Copy: function (Table) {
        var Row = new CTableRow(Table, 0);
        Row.Set_Pr(this.Pr.Copy());
        var CellsCount = this.Content.length;
        for (var Index = 0; Index < CellsCount; Index++) {
            Row.Content[Index] = this.Content[Index].Copy(Row);
            History.Add(Row, {
                Type: historyitem_TableRow_AddCell,
                Pos: Index,
                Item: {
                    Cell: Row.Content[Index],
                    CellInfo: {}
                }
            });
        }
        Row.Internal_ReIndexing();
        return Row;
    },
    Is_UseInDocument: function (Id) {
        var bUse = false;
        if (null != Id) {
            var Count = this.Content.length;
            for (var Index = 0; Index < Count; Index++) {
                if (Id === this.Content[Index].Get_Id()) {
                    bUse = true;
                    break;
                }
            }
        } else {
            bUse = true;
        }
        if (true === bUse && null != this.Table) {
            return this.Table.Is_UseInDocument(this.Get_Id());
        }
        return false;
    },
    Set_Index: function (Index) {
        if (Index != this.Index) {
            this.Index = Index;
            this.Recalc_CompiledPr();
        }
    },
    Set_Metrics_X: function (x_min, x_max) {
        this.Metrics.X_min = x_min;
        this.Metrics.X_max = x_max;
    },
    Recalc_CompiledPr: function () {
        this.CompiledPr.NeedRecalc = true;
        for (var i = 0; i < this.Content.length; ++i) {
            this.Content[i].Recalc_CompiledPr();
        }
    },
    Get_CompiledPr: function (bCopy) {
        if (true === this.CompiledPr.NeedRecalc) {
            this.CompiledPr.Pr = this.Internal_Compile_Pr();
            this.CompiledPr.NeedRecalc = false;
        }
        if (false === bCopy) {
            return this.CompiledPr.Pr;
        } else {
            return this.CompiledPr.Pr.Copy();
        }
    },
    Internal_Compile_Pr: function () {
        var TablePr = this.Table.Get_CompiledPr(false);
        var TableLook = this.Table.Get_TableLook();
        var CurIndex = this.Index;
        var RowPr = TablePr.TableRowPr.Copy();
        if (true === TableLook.Is_BandHor()) {
            var RowBandSize = TablePr.TablePr.TableStyleRowBandSize;
            var _CurIndex = (true != TableLook.Is_FirstRow() ? CurIndex : CurIndex - 1);
            var GroupIndex = (1 != RowBandSize ? Math.floor(_CurIndex / RowBandSize) : _CurIndex);
            if (0 === GroupIndex % 2) {
                RowPr.Merge(TablePr.TableBand1Horz.TableRowPr);
            } else {
                RowPr.Merge(TablePr.TableBand2Horz.TableRowPr);
            }
        }
        if (true === TableLook.Is_LastRow() && this.Table.Content.length - 1 === CurIndex) {
            RowPr.Merge(TablePr.TableLastRow.TableRowPr);
        }
        if (true === TableLook.Is_FirstRow() && (0 === CurIndex || true === this.Pr.TableHeader)) {
            RowPr.Merge(TablePr.TableFirstRow.TableRowPr);
        }
        RowPr.Merge(this.Pr);
        return RowPr;
    },
    Clear_DirectFormatting: function (bClearMerge) {
        if (true === bClearMerge) {
            this.Set_After(undefined, undefined);
            this.Set_Before(undefined, undefined);
        }
        this.Set_CellSpacing(undefined);
        this.Set_Height(undefined, undefined);
        var Count = this.Content.length;
        for (var Index = 0; Index < Count; Index++) {
            this.Content[Index].Clear_DirectFormatting(bClearMerge);
        }
    },
    Set_Pr: function (RowPr) {
        History.Add(this, {
            Type: historyitem_TableRow_Pr,
            Old: this.Pr,
            New: RowPr
        });
        this.Pr = RowPr;
    },
    Get_Before: function () {
        var RowPr = this.Get_CompiledPr(false);
        var Before = {
            WBefore: RowPr.WBefore.Copy(),
            GridBefore: RowPr.GridBefore
        };
        return Before;
    },
    Set_Before: function (GridBefore, WBefore) {
        if (this.Pr.GridBefore !== GridBefore || this.Pr.WBefore !== WBefore) {
            var OldBefore = {
                GridBefore: (undefined != this.Pr.GridBefore ? this.Pr.GridBefore : undefined),
                WBefore: (undefined != this.Pr.WBefore ? this.Pr.WBefore : undefined)
            };
            var NewBefore = {
                GridBefore: (undefined != GridBefore ? GridBefore : undefined),
                WBefore: (undefined != WBefore ? WBefore : undefined)
            };
            if (false === WBefore) {
                NewBefore.WBefore = OldBefore.WBefore;
            } else {
                if (undefined != WBefore) {
                    NewBefore.WBefore = new CTableMeasurement(tblwidth_Auto, 0);
                    NewBefore.WBefore.Set_FromObject(WBefore);
                }
            }
            History.Add(this, {
                Type: historyitem_TableRow_Before,
                Old: OldBefore,
                New: NewBefore
            });
            if (undefined != NewBefore.GridBefore) {
                this.Pr.GridBefore = GridBefore;
            } else {
                this.Pr.GridBefore = undefined;
            }
            if (undefined != NewBefore.WBefore) {
                this.Pr.WBefore = NewBefore.WBefore;
            } else {
                this.Pr.WBefore = undefined;
            }
            this.Recalc_CompiledPr();
        }
    },
    Get_After: function () {
        var RowPr = this.Get_CompiledPr(false);
        var After = {
            WAfter: RowPr.WAfter.Copy(),
            GridAfter: RowPr.GridAfter
        };
        return After;
    },
    Set_After: function (GridAfter, WAfter) {
        if (this.Pr.GridAfter !== GridAfter || this.Pr.WAfter !== WAfter) {
            var OldAfter = {
                GridAfter: (undefined != this.Pr.GridAfter ? this.Pr.GridAfter : undefined),
                WAfter: (undefined != this.Pr.WAfter ? this.Pr.WAfter : undefined)
            };
            var NewAfter = {
                GridAfter: (undefined != GridAfter ? GridAfter : undefined),
                WAfter: (undefined != WAfter ? WAfter : undefined)
            };
            if (false === WAfter) {
                NewAfter.WAfter = OldAfter.WAfter;
            } else {
                if (undefined != WAfter) {
                    NewAfter.WAfter = new CTableMeasurement(tblwidth_Auto, 0);
                    NewAfter.WAfter.Set_FromObject(WAfter);
                }
            }
            History.Add(this, {
                Type: historyitem_TableRow_After,
                Old: OldAfter,
                New: NewAfter
            });
            if (undefined != NewAfter.GridAfter) {
                this.Pr.GridAfter = GridAfter;
            } else {
                this.Pr.GridAfter = undefined;
            }
            if (undefined != NewAfter.WAfter) {
                this.Pr.WAfter = WAfter;
            } else {
                this.Pr.WAfter = undefined;
            }
            this.Recalc_CompiledPr();
        }
    },
    Get_CellSpacing: function () {
        var RowPr = this.Get_CompiledPr(false);
        return RowPr.TableCellSpacing;
    },
    Set_CellSpacing: function (Value) {
        if (undefined === Value) {
            if (undefined === this.Pr.TableCellSpacing) {
                return;
            }
            History.Add(this, {
                Type: historyitem_TableRow_CellSpacing,
                Old: this.Pr.TableCellSpacing,
                New: undefined
            });
            this.Pr.TableCellSpacing = undefined;
            this.Recalc_CompiledPr();
        } else {
            if (undefined === this.Pr.TableCellSpacing) {
                History.Add(this, {
                    Type: historyitem_TableRow_CellSpacing,
                    Old: undefined,
                    New: Value
                });
                this.Pr.TableCellSpacing = Value;
                this.Recalc_CompiledPr();
            } else {
                if (Value != this.Pr.TableCellSpacing) {
                    History.Add(this, {
                        Type: historyitem_TableRow_CellSpacing,
                        Old: this.Pr.TableCellSpacing,
                        New: Value
                    });
                    this.Pr.TableCellSpacing = Value;
                    this.Recalc_CompiledPr();
                }
            }
        }
    },
    Get_Height: function () {
        var RowPr = this.Get_CompiledPr(false);
        return RowPr.Height;
    },
    Set_Height: function (Value, HRule) {
        if ((undefined === this.Pr.Height && undefined === Value) || (undefined != this.Pr.Height && HRule === this.Pr.Height.HRule && Math.abs(Value - this.Pr.Height.Value) < 0.001)) {
            return;
        }
        var OldHeight = undefined != this.Pr.Height ? this.Pr.Height : undefined;
        var NewHeight = undefined != Value ? new CTableRowHeight(Value, HRule) : undefined;
        History.Add(this, {
            Type: historyitem_TableRow_Height,
            Old: OldHeight,
            New: NewHeight
        });
        if (undefined === NewHeight) {
            this.Pr.Height = undefined;
        } else {
            this.Pr.Height = NewHeight;
        }
        this.Recalc_CompiledPr();
    },
    Is_Header: function () {
        var RowPr = this.Get_CompiledPr(false);
        return RowPr.TableHeader;
    },
    Set_Header: function (Value) {
        if ((undefined === this.Pr.TableHeader && undefined === Value) || (undefined != this.Pr.TableHeader && Value === this.Pr.TableHeader)) {
            return;
        }
        var OldHeader = undefined != this.Pr.TableHeader ? this.Pr.TableHeader : undefined;
        var NewHeader = undefined != Value ? Value : undefined;
        History.Add(this, {
            Type: historyitem_TableRow_TableHeader,
            Old: OldHeader,
            New: NewHeader
        });
        if (undefined === Value) {
            this.Pr.TableHeader = undefined;
        } else {
            this.Pr.TableHeader = Value;
        }
        this.Recalc_CompiledPr();
    },
    Copy_Pr: function (OtherPr) {
        if (undefined === OtherPr.WBefore) {
            this.Set_Before(OtherPr.GridBefore, undefined);
        } else {
            this.Set_Before(OtherPr.GridBefore, {
                W: OtherPr.WBefore.W,
                Type: OtherPr.WBefore.Type
            });
        }
        if (undefined === OtherPr.WAfter) {
            this.Set_After(OtherPr.GridAfter, undefined);
        } else {
            this.Set_After(OtherPr.GridAfter, {
                W: OtherPr.WAfter.W,
                Type: OtherPr.WAfter.Type
            });
        }
        if (undefined === OtherPr.Height) {
            this.Set_Height(undefined, undefined);
        } else {
            this.Set_Height(OtherPr.Height.Value, OtherPr.Height.HRule);
        }
        if (undefined != OtherPr.TableCellSpacing) {
            this.Set_CellSpacing(OtherPr.TableCellSpacing);
        } else {
            this.Set_CellSpacing(undefined);
        }
        if (undefined != OtherPr.TableHeader) {
            this.Set_Header(OtherPr.TableHeader);
        } else {
            this.Set_Header(undefined);
        }
    },
    Set_SpacingInfo: function (bSpacingTop, bSpacingBot) {
        this.SpacingInfo = {
            Top: bSpacingTop,
            Bottom: bSpacingBot
        };
    },
    Get_SpacingInfo: function () {
        return this.SpacingInfo;
    },
    Get_Cell: function (Index) {
        if (Index < 0 || Index >= this.Content.length) {
            return null;
        }
        return this.Content[Index];
    },
    Get_CellsCount: function () {
        return this.Content.length;
    },
    Set_CellInfo: function (Index, StartGridCol, X_grid_start, X_grid_end, X_cell_start, X_cell_end, X_content_start, X_content_end) {
        this.CellsInfo[Index] = {
            StartGridCol: StartGridCol,
            X_grid_start: X_grid_start,
            X_grid_end: X_grid_end,
            X_cell_start: X_cell_start,
            X_cell_end: X_cell_end,
            X_content_start: X_content_start,
            X_content_end: X_content_end
        };
        this.Content[Index].Content.Set_ClipInfo(X_cell_start, X_cell_end);
    },
    Update_CellInfo: function (Index, X_start) {
        var Cell = this.Content[Index];
        var StartGridCol = Cell.Metrics.StartGridCol;
        var X_grid_start = X_start + Cell.Metrics.X_grid_start;
        var X_grid_end = X_start + Cell.Metrics.X_grid_end;
        var X_cell_start = X_start + Cell.Metrics.X_cell_start;
        var X_cell_end = X_start + Cell.Metrics.X_cell_end;
        var X_content_start = X_start + Cell.Metrics.X_content_start;
        var X_content_end = X_start + Cell.Metrics.X_content_end;
        this.Set_CellInfo(Index, StartGridCol, X_grid_start, X_grid_end, X_cell_start, X_cell_end, X_content_start, X_content_end);
    },
    Get_CellInfo: function (Index) {
        return this.CellsInfo[Index];
    },
    Remove_Cell: function (Index) {
        History.Add(this, {
            Type: historyitem_TableRow_RemoveCell,
            Pos: Index,
            Item: {
                Cell: this.Content[Index],
                CellInfo: this.CellsInfo[Index]
            }
        });
        this.Content.splice(Index, 1);
        this.CellsInfo.splice(Index, 1);
        this.Internal_ReIndexing(Index);
    },
    Add_Cell: function (Index, Row, Cell, bReIndexing) {
        if ("undefined" === typeof(Cell) || null === Cell) {
            Cell = new CTableCell(Row);
        }
        History.Add(this, {
            Type: historyitem_TableRow_AddCell,
            Pos: Index,
            Item: {
                Cell: Cell,
                CellInfo: {}
            }
        });
        this.Content.splice(Index, 0, Cell);
        this.CellsInfo.splice(Index, 0, {});
        if (true === bReIndexing) {
            this.Internal_ReIndexing(Index);
        } else {
            if (Index > 0) {
                this.Content[Index - 1].Next = Cell;
                Cell.Prev = this.Content[Index - 1];
            } else {
                Cell.Prev = null;
            }
            if (Index < this.Content.length - 1) {
                this.Content[Index + 1].Prev = Cell;
                Cell.Next = this.Content[Index + 1];
            } else {
                Cell.Next = null;
            }
        }
        return Cell;
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
    Internal_ReIndexing: function (StartIndex) {
        if ("undefined" === typeof(StartIndex)) {
            StartIndex = 0;
        }
        for (var Ind = StartIndex; Ind < this.Content.length; Ind++) {
            this.Content[Ind].Set_Index(Ind);
            this.Content[Ind].Prev = (Ind > 0 ? this.Content[Ind - 1] : null);
            this.Content[Ind].Next = (Ind < this.Content.length - 1 ? this.Content[Ind + 1] : null);
        }
    },
    Undo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_TableRow_Before:
            if (undefined != Data.Old.GridBefore) {
                this.Pr.GridBefore = Data.Old.GridBefore;
            } else {
                this.Pr.GridBefore = undefined;
            }
            if (undefined != Data.Old.WBefore) {
                this.Pr.WBefore = Data.Old.WBefore;
            } else {
                this.Pr.WBefore = undefined;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableRow_After:
            if (undefined != Data.Old.GridAfter) {
                this.Pr.GridAfter = Data.Old.GridAfter;
            } else {
                this.Pr.GridAfter = undefined;
            }
            if (undefined != Data.Old.WAfter) {
                this.Pr.WAfter = Data.Old.WAfter;
            } else {
                this.Pr.WAfter = undefined;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableRow_CellSpacing:
            if (undefined != Data.Old) {
                this.Pr.TableCellSpacing = Data.Old;
            } else {
                this.Pr.TableCellSpacing = undefined;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableRow_Height:
            if (undefined != Data.Old) {
                this.Pr.Height = Data.Old;
            } else {
                this.Pr.Height = undefined;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableRow_AddCell:
            this.Content.splice(Data.Pos, 1);
            this.CellsInfo.splice(Data.Pos, 1);
            this.Internal_ReIndexing(Data.Pos);
            break;
        case historyitem_TableRow_RemoveCell:
            this.Content.splice(Data.Pos, 0, Data.Item.Cell);
            this.CellsInfo.splice(Data.Pos, 0, Data.Item.CellInfo);
            this.Internal_ReIndexing(Data.Pos);
            break;
        case historyitem_TableRow_TableHeader:
            if (undefined != Data.Old) {
                this.Pr.TableHeader = Data.Old;
            } else {
                this.Pr.TableHeader = undefined;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableRow_Pr:
            this.Pr = Data.Old;
            this.Recalc_CompiledPr();
            break;
        }
        if (this.Table && this.Table.Parent) {
            this.Table.Parent.onParagraphChanged();
        }
    },
    Redo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_TableRow_Before:
            if (undefined != Data.New.GridBefore) {
                this.Pr.GridBefore = Data.New.GridBefore;
            } else {
                this.Pr.GridBefore = undefined;
            }
            if (undefined != Data.New.WBefore) {
                this.Pr.WBefore = Data.New.WBefore;
            } else {
                this.Pr.WBefore = undefined;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableRow_After:
            if (undefined != Data.New.GridAfter) {
                this.Pr.GridAfter = Data.New.GridAfter;
            } else {
                this.Pr.GridAfter = undefined;
            }
            if (undefined != Data.New.WAfter) {
                this.Pr.WAfter = Data.New.WAfter;
            } else {
                this.Pr.WAfter = undefined;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableRow_CellSpacing:
            if (undefined != Data.New) {
                this.Pr.TableCellSpacing = Data.New;
            } else {
                this.Pr.TableCellSpacing = undefined;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableRow_Height:
            if (undefined != Data.New) {
                this.Pr.Height = Data.New;
            } else {
                this.Pr.Height = undefined;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableRow_AddCell:
            this.Content.splice(Data.Pos, 0, Data.Item.Cell);
            this.CellsInfo.splice(Data.Pos, 0, Data.Item.CellInfo);
            this.Internal_ReIndexing(Data.Pos);
            break;
        case historyitem_TableRow_RemoveCell:
            this.Content.splice(Data.Pos, 1);
            this.CellsInfo.splice(Data.Pos, 1);
            this.Internal_ReIndexing(Data.Pos);
            break;
        case historyitem_TableRow_TableHeader:
            if (undefined != Data.New) {
                this.Pr.TableHeader = Data.New;
            } else {
                this.Pr.TableHeader = undefined;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableRow_Pr:
            this.Pr = Data.New;
            this.Recalc_CompiledPr();
            break;
        }
        if (this.Table && this.Table.Parent) {
            this.Table.Parent.onParagraphChanged();
        }
    },
    Get_ParentObject_or_DocumentPos: function () {
        return this.Table.Get_ParentObject_or_DocumentPos(this.Table.Index);
    },
    Refresh_RecalcData: function (Data) {
        var bNeedRecalc = false;
        var Type = Data.Type;
        switch (Type) {
        case historyitem_TableRow_Before:
            case historyitem_TableRow_After:
            case historyitem_TableRow_CellSpacing:
            case historyitem_TableRow_Height:
            case historyitem_TableRow_AddCell:
            case historyitem_TableRow_RemoveCell:
            case historyitem_TableRow_TableHeader:
            case historyitem_TableRow_Pr:
            bNeedRecalc = true;
            break;
        }
        if (true === bNeedRecalc) {
            this.Refresh_RecalcData2(0, 0);
        }
    },
    Refresh_RecalcData2: function (CellIndex, Page_rel) {
        this.Table.Refresh_RecalcData2(this.Index, Page_rel);
    },
    Save_Changes: function (Data, Writer) {
        Writer.WriteLong(historyitem_type_TableRow);
        var Type = Data.Type;
        Writer.WriteLong(Type);
        switch (Type) {
        case historyitem_TableRow_Before:
            if (undefined === Data.New.GridBefore) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Writer.WriteLong(Data.New.GridBefore);
            }
            if (undefined === Data.New.WBefore) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Data.New.WBefore.Write_ToBinary(Writer);
            }
            break;
        case historyitem_TableRow_After:
            if (undefined === Data.New.GridAfter) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Writer.WriteLong(Data.New.GridAfter);
            }
            if (undefined === Data.New.WAfter) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Data.New.WAfter.Write_ToBinary(Writer);
            }
            break;
        case historyitem_TableRow_CellSpacing:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                if (null === Data.New) {
                    Writer.WriteBool(true);
                } else {
                    Writer.WriteBool(false);
                    Writer.WriteDouble(Data.New);
                }
            }
            break;
        case historyitem_TableRow_Height:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Data.New.Write_ToBinary(Writer);
            }
            break;
        case historyitem_TableRow_AddCell:
            var bArray = Data.UseArray;
            var Count = 1;
            Writer.WriteLong(Count);
            for (var Index = 0; Index < Count; Index++) {
                if (true === bArray) {
                    Writer.WriteLong(Data.PosArray[Index]);
                } else {
                    Writer.WriteLong(Data.Pos + Index);
                }
                Writer.WriteString2(Data.Item.Cell.Get_Id());
            }
            break;
        case historyitem_TableRow_RemoveCell:
            var bArray = Data.UseArray;
            var Count = 1;
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
        case historyitem_TableRow_TableHeader:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Writer.WriteBool(Data.New);
            }
            break;
        case historyitem_TableRow_Pr:
            Data.New.Write_ToBinary(Writer);
            break;
        }
        return Writer;
    },
    Save_Changes2: function (Data, Writer) {
        var bRetValue = false;
        var Type = Data.Type;
        switch (Type) {
        case historyitem_TableRow_Before:
            case historyitem_TableRow_After:
            case historyitem_TableRow_CellSpacing:
            case historyitem_TableRow_Height:
            break;
        case historyitem_TableRow_AddCell:
            break;
        case historyitem_TableRow_RemoveCell:
            break;
        }
        return bRetValue;
    },
    Load_Changes: function (Reader, Reader2) {
        var ClassType = Reader.GetLong();
        if (historyitem_type_TableRow != ClassType) {
            return;
        }
        var Type = Reader.GetLong();
        switch (Type) {
        case historyitem_TableRow_Before:
            var bUndefinedGB = Reader.GetBool();
            if (true === bUndefinedGB) {
                this.Pr.GridBefore = undefined;
            } else {
                this.Pr.GridBefore = Reader.GetLong();
            }
            var bUndefinedWB = Reader.GetBool();
            if (true === bUndefinedWB) {
                this.Pr.WBefore = undefined;
            } else {
                this.Pr.WBefore = new CTableMeasurement(tblwidth_Auto, 0);
                this.Pr.WBefore.Read_FromBinary(Reader);
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableRow_After:
            var bUndefinedGA = Reader.GetBool();
            if (true === bUndefinedGA) {
                this.Pr.GridAfter = undefined;
            } else {
                this.Pr.GridAfter = Reader.GetLong();
            }
            var bUndefinedWA = Reader.GetBool();
            if (true === bUndefinedWA) {
                this.Pr.WAfter = undefined;
            } else {
                this.Pr.WAfter = new CTableMeasurement(tblwidth_Auto, 0);
                this.Pr.WAfter.Read_FromBinary(Reader);
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableRow_CellSpacing:
            var bUndefined = Reader.GetBool();
            if (true === bUndefined) {
                this.Pr.TableCellSpacing = undefined;
            } else {
                var bNull = Reader.GetBool();
                if (true === bNull) {
                    this.Pr.TableCellSpacing = null;
                } else {
                    this.Pr.TableCellSpacing = Reader.GetDouble();
                }
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableRow_Height:
            var bUndefined = Reader.GetBool();
            if (true === bUndefined) {
                this.Pr.Height = undefined;
            } else {
                this.Pr.Height = new CTableRowHeight(0, heightrule_Auto);
                this.Pr.Height.Read_FromBinary(Reader);
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableRow_AddCell:
            var Count = Reader.GetLong();
            for (var Index = 0; Index < Count; Index++) {
                var Pos = this.m_oContentChanges.Check(contentchanges_Add, Reader.GetLong());
                var Element = g_oTableId.Get_ById(Reader.GetString2());
                if (null != Element) {
                    this.Content.splice(Pos, 0, Element);
                }
            }
            break;
        case historyitem_TableRow_RemoveCell:
            var Count = Reader.GetLong();
            for (var Index = 0; Index < Count; Index++) {
                var Pos = this.m_oContentChanges.Check(contentchanges_Remove, Reader.GetLong());
                if (false === Pos) {
                    continue;
                }
                this.Content.splice(Pos, 1);
            }
            break;
        case historyitem_TableRow_TableHeader:
            var bUndefined = Reader.GetBool();
            if (true === bUndefined) {
                this.Pr.TableHeader = undefined;
            } else {
                this.Pr.TableHeader = Reader.GetBool();
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableRow_Pr:
            this.Pr = new CTableRowPr();
            this.Pr.Read_FromBinary(Reader);
            this.Recalc_CompiledPr();
            break;
        }
        if (this.Table && this.Table.Parent) {
            this.Table.Parent.onParagraphChanged();
        }
        return true;
    },
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(historyitem_type_TableRow);
        Writer.WriteString2(this.Id);
        Writer.WriteString2(this.Table.Get_Id());
        this.Pr.Write_ToBinary(Writer);
        var Count = this.Content.length;
        Writer.WriteLong(Count);
        for (var Index = 0; Index < Count; Index++) {
            Writer.WriteString2(this.Content[Index].Get_Id());
        }
    },
    Read_FromBinary2: function (Reader) {
        this.Id = Reader.GetString2();
        var LinkData = new Object();
        LinkData.Table = Reader.GetString2();
        CollaborativeEditing.Add_LinkData(this, LinkData);
        this.Pr = new CTableRowPr();
        this.Pr.Read_FromBinary(Reader);
        this.Recalc_CompiledPr();
        var Count = Reader.GetLong();
        this.Content = new Array();
        for (var Index = 0; Index < Count; Index++) {
            var Cell = g_oTableId.Get_ById(Reader.GetString2());
            this.Content.push(Cell);
        }
        this.Internal_ReIndexing();
        CollaborativeEditing.Add_NewObject(this);
    },
    Load_LinkData: function (LinkData) {
        if ("undefined" != typeof(LinkData.Table)) {
            this.Table = g_oTableId.Get_ById(LinkData.Table);
        }
    }
};
function CTableCell(Row, ColW) {
    this.Id = g_oIdCounter.Get_NewId();
    this.Row = Row;
    this.Prev = null;
    this.Next = null;
    this.Content = new CDocumentContent(this, editor.WordControl.m_oLogicDocument.DrawingDocument, 0, 0, 0, 20000, false, false);
    this.Content.Set_StartPage((Row ? this.Row.Table.PageNum : 0));
    this.CompiledPr = {
        Pr: null,
        TextPr: null,
        ParaPr: null,
        NeedRecalc: true
    };
    this.Pr = new CTableCellPr();
    if (undefined != ColW) {
        this.Pr.TableCellW = new CTableMeasurement(tblwidth_Mm, ColW);
    }
    this.BorderInfo = {
        Top: null,
        Left: null,
        Right: null,
        Bottom: null,
        Bottom_BeforeCount: -1,
        Bottom_AfterCount: -1,
        MaxLeft: 0,
        MaxRight: 0
    };
    this.Metrics = {
        StartGridCol: 0,
        X_grid_start: 0,
        X_grid_end: 0,
        X_cell_start: 0,
        X_cell_end: 0,
        X_content_start: 0,
        X_content_end: 0
    };
    this.Temp = {
        Y: 0,
        CurPage: 0,
        Y_VAlign_offset: new Array()
    };
    g_oTableId.Add(this, this.Id);
}
CTableCell.prototype = {
    onParagraphChanged: function () {
        this.Row.Table.Parent.onParagraphChanged();
    },
    getUnifill: function () {
        return this.Get_CompiledPr(false).Shd.calculatedUnifill;
    },
    getStylesForParagraph: function () {
        return this.Row.Table.getStylesForParagraph();
    },
    Set_Id: function (newId) {
        g_oTableId.Reset_Id(this, newId, this.Id);
        this.Id = newId;
    },
    Get_Id: function () {
        return this.Id;
    },
    Copy: function (Row) {
        var Cell = new CTableCell(Row);
        Cell.Copy_Pr(this.Pr.Copy(), false);
        Cell.Content.Copy2(this.Content);
        Cell.BorderInfo.Top = this.BorderInfo.Top;
        Cell.BorderInfo.Left = this.BorderInfo.Left;
        Cell.BorderInfo.Right = this.BorderInfo.Right;
        Cell.BorderInfo.Bottom = this.BorderInfo.Bottom;
        Cell.BorderInfo.Bottom_BeforeCount = this.BorderInfo.Bottom_BeforeCount;
        Cell.BorderInfo.Bottom_AfterCount = this.BorderInfo.Bottom_AfterCount;
        Cell.BorderInfo.MaxLeft = this.BorderInfo.MaxLeft;
        Cell.BorderInfo.MaxRight = this.BorderInfo.MaxRight;
        Cell.Metrics.StartGridCol = this.Metrics.StartGridCol;
        Cell.Metrics.X_grid_start = this.Metrics.X_grid_start;
        Cell.Metrics.X_grid_end = this.Metrics.X_grid_end;
        Cell.Metrics.X_cell_start = this.Metrics.X_cell_start;
        Cell.Metrics.X_cell_end = this.Metrics.X_cell_end;
        Cell.Metrics.X_content_start = this.Metrics.X_content_start;
        Cell.Metrics.X_content_end = this.Metrics.X_content_end;
        return Cell;
    },
    Set_Index: function (Index) {
        if (Index != this.Index) {
            this.Index = Index;
            this.Recalc_CompiledPr();
        }
    },
    Set_Metrics: function (StartGridCol, X_grid_start, X_grid_end, X_cell_start, X_cell_end, X_content_start, X_content_end) {
        this.Metrics.StartGridCol = StartGridCol;
        this.Metrics.X_grid_start = X_grid_start;
        this.Metrics.X_grid_end = X_grid_end;
        this.Metrics.X_cell_start = X_cell_start;
        this.Metrics.X_cell_end = X_cell_end;
        this.Metrics.X_content_start = X_content_start;
        this.Metrics.X_content_end = X_content_end;
    },
    Recalc_CompiledPr: function () {
        this.CompiledPr.NeedRecalc = true;
        this.Content.Recalc_AllParagraphs_CompiledPr();
    },
    Get_CompiledPr: function (bCopy) {
        if (true === this.CompiledPr.NeedRecalc) {
            var FullPr = this.Internal_Compile_Pr();
            this.CompiledPr.Pr = FullPr.CellPr;
            this.CompiledPr.ParaPr = FullPr.ParaPr;
            this.CompiledPr.TextPr = FullPr.TextPr;
            this.CompiledPr.NeedRecalc = false;
        }
        if (false === bCopy) {
            return this.CompiledPr.Pr;
        } else {
            return this.CompiledPr.Pr.Copy();
        }
    },
    Internal_Compile_Pr: function () {
        var Table = this.Row.Table;
        var TablePr = Table.Get_CompiledPr(false);
        var TableLook = Table.Get_TableLook();
        var CellIndex = this.Index;
        var RowIndex = this.Row.Index;
        var CellPr = TablePr.TableCellPr.Copy();
        var TextPr = TablePr.TextPr.Copy();
        var ParaPr = TablePr.ParaPr.Copy();
        if (true === TableLook.Is_BandVer() && !((true === TableLook.Is_LastCol() && this.Row.Get_CellsCount() - 1 === CellIndex) || (true === TableLook.Is_FirstCol() && 0 === CellIndex))) {
            var ColBandSize = TablePr.TablePr.TableStyleColBandSize;
            var _ColIndex = (true != TableLook.Is_FirstCol() ? CellIndex : CellIndex - 1);
            var ColIndex = (1 != ColBandSize ? Math.floor(_ColIndex / ColBandSize) : _ColIndex);
            var TableBandStyle = null;
            if (0 === ColIndex % 2) {
                TableBandStyle = TablePr.TableBand1Vert;
            } else {
                TableBandStyle = TablePr.TableBand2Vert;
            }
            CellPr.Merge(TableBandStyle.TableCellPr);
            TextPr.Merge(TableBandStyle.TextPr);
            ParaPr.Merge(TableBandStyle.ParaPr);
        }
        if (true === TableLook.Is_BandHor()) {
            var RowBandSize = TablePr.TablePr.TableStyleRowBandSize;
            var __RowIndex = (true != TableLook.Is_FirstRow() ? RowIndex : RowIndex - 1);
            var _RowIndex = (1 != RowBandSize ? Math.floor(__RowIndex / RowBandSize) : __RowIndex);
            var TableBandStyle = null;
            if (0 === _RowIndex % 2) {
                TableBandStyle = TablePr.TableBand1Horz;
            } else {
                TableBandStyle = TablePr.TableBand2Horz;
            }
            CellPr.Merge(TableBandStyle.TableCellPr);
            TextPr.Merge(TableBandStyle.TextPr);
            ParaPr.Merge(TableBandStyle.ParaPr);
        }
        if (true === TableLook.Is_LastCol() && this.Row.Get_CellsCount() - 1 === CellIndex) {
            CellPr.Merge(TablePr.TableLastCol.TableCellPr);
            TextPr.Merge(TablePr.TableLastCol.TextPr);
            ParaPr.Merge(TablePr.TableLastCol.ParaPr);
        }
        if (true === TableLook.Is_FirstCol() && 0 === CellIndex) {
            CellPr.Merge(TablePr.TableFirstCol.TableCellPr);
            TextPr.Merge(TablePr.TableFirstCol.TextPr);
            ParaPr.Merge(TablePr.TableFirstCol.ParaPr);
        }
        if (true === TableLook.Is_LastRow() && Table.Content.length - 1 === RowIndex) {
            CellPr.Merge(TablePr.TableLastRow.TableCellPr);
            TextPr.Merge(TablePr.TableLastRow.TextPr);
            ParaPr.Merge(TablePr.TableLastRow.ParaPr);
        }
        if (true === TableLook.Is_FirstRow() && 0 === RowIndex) {
            CellPr.Merge(TablePr.TableFirstRow.TableCellPr);
            TextPr.Merge(TablePr.TableFirstRow.TextPr);
            ParaPr.Merge(TablePr.TableFirstRow.ParaPr);
        }
        if (this.Row.Get_CellsCount() - 1 === CellIndex && Table.Content.length - 1 === RowIndex) {
            CellPr.Merge(TablePr.TableBRCell.TableCellPr);
            TextPr.Merge(TablePr.TableBRCell.TextPr);
            ParaPr.Merge(TablePr.TableBRCell.ParaPr);
        }
        if (0 === CellIndex && Table.Content.length - 1 === RowIndex) {
            CellPr.Merge(TablePr.TableBLCell.TableCellPr);
            TextPr.Merge(TablePr.TableBLCell.TextPr);
            ParaPr.Merge(TablePr.TableBLCell.ParaPr);
        }
        if (this.Row.Get_CellsCount() - 1 === CellIndex && 0 === RowIndex) {
            CellPr.Merge(TablePr.TableTRCell.TableCellPr);
            TextPr.Merge(TablePr.TableTRCell.TextPr);
            ParaPr.Merge(TablePr.TableTRCell.ParaPr);
        }
        if (0 === CellIndex && 0 === RowIndex) {
            CellPr.Merge(TablePr.TableTLCell.TableCellPr);
            TextPr.Merge(TablePr.TableTLCell.TextPr);
            ParaPr.Merge(TablePr.TableTLCell.ParaPr);
        }
        if (null === CellPr.TableCellMar && undefined != this.Pr.TableCellMar && null != this.Pr.TableCellMar) {
            CellPr.TableCellMar = {};
        }
        CellPr.Merge(this.Pr);
        if (CellPr.TableCellMar == null) {
            CellPr.TableCellMar = {};
        }
        if (!CellPr.TableCellMar.Top || !(!isNaN(CellPr.TableCellMar.Top.W) && typeof CellPr.TableCellMar.Top.W === "number")) {
            CellPr.TableCellMar.Top = new CTableMeasurement(tblwidth_Mm, 1.27);
        }
        if (!CellPr.TableCellMar.Left || !(!isNaN(CellPr.TableCellMar.Left.W) && typeof CellPr.TableCellMar.Left.W === "number")) {
            CellPr.TableCellMar.Left = new CTableMeasurement(tblwidth_Mm, 2.54);
        }
        if (!CellPr.TableCellMar.Bottom || !(!isNaN(CellPr.TableCellMar.Bottom.W) && typeof CellPr.TableCellMar.Bottom.W === "number")) {
            CellPr.TableCellMar.Bottom = new CTableMeasurement(tblwidth_Mm, 1.27);
        }
        if (!CellPr.TableCellMar.Right || !(!isNaN(CellPr.TableCellMar.Right.W) && typeof CellPr.TableCellMar.Right.W === "number")) {
            CellPr.TableCellMar.Right = new CTableMeasurement(tblwidth_Mm, 2.54);
        }
        var _theme = null,
        _master = null,
        _layout = null,
        _slide = null;
        switch (this.Row.Table.Parent.parent.kind) {
        case SLIDE_KIND:
            _slide = this.Row.Table.Parent.parent;
            if (_slide !== null && typeof _slide === "object") {
                _layout = _slide.Layout;
                if (_layout !== null && typeof _layout === "object") {
                    _master = _layout.Master;
                    if (_master !== null && typeof _master === "object") {
                        _theme = _master.Theme;
                    }
                }
            }
            break;
        case LAYOUT_KIND:
            _layout = this.Row.Table.Parent.parent;
            if (_layout !== null && typeof _layout === "object") {
                _master = _layout.Master;
                if (_master !== null && typeof _master === "object") {
                    _theme = _master.Theme;
                }
            }
            break;
        case MASTER_KIND:
            _master = this.Row.Table.Parent.parent;
            if (_master !== null && typeof _master === "object") {
                _theme = _master.Theme;
            }
            break;
        }
        var RGBA, _calculated_unifill;
        if (CellPr !== null && typeof CellPr === "object") {
            if (CellPr.Shd !== null && typeof CellPr.Shd === "object") {
                if (_theme !== null && typeof _theme === "object" && CellPr.Shd.fillRef !== null && typeof CellPr.Shd.fillRef === "object") {
                    _calculated_unifill = _theme.getFillStyle(CellPr.Shd.fillRef.idx);
                    CellPr.Shd.fillRef.Color.Calculate(_theme, _slide, _layout, _master);
                    RGBA = CellPr.Shd.fillRef.Color.RGBA;
                    if (CellPr.Shd.fillRef.Color.color != null) {
                        if (_calculated_unifill.fill != null && (_calculated_unifill.fill.type == FILL_TYPE_SOLID)) {
                            _calculated_unifill.fill.color = CellPr.Shd.fillRef.Color.createDuplicate();
                        }
                    }
                } else {
                    _calculated_unifill = new CUniFill();
                }
                if (CellPr.Shd.unifill !== null && typeof CellPr.Shd.unifill === "object" && CellPr.Shd.unifill.fill !== null && typeof CellPr.Shd.unifill.fill === "object") {
                    _calculated_unifill.merge(CellPr.Shd.unifill);
                    _calculated_unifill.calculate(_theme, _slide, _layout, _master, {
                        R: 0,
                        G: 0,
                        B: 0,
                        A: 255
                    });
                }
                CellPr.Shd.calculatedUnifill = _calculated_unifill;
                if (_calculated_unifill.fill !== null && typeof _calculated_unifill.fill === "object") {
                    switch (_calculated_unifill.fill.type) {
                    case FILL_TYPE_GRAD:
                        if (_calculated_unifill.fill.colors && _calculated_unifill.fill.colors[0] && _calculated_unifill.fill.colors[0].color && _calculated_unifill.fill.colors[0].color.RGBA !== null && typeof _calculated_unifill.fill.colors[0].color.RGBA === "object") {
                            RGBA = _calculated_unifill.fill.colors[0].color.RGBA;
                            CellPr.Shd.Color = new CDocumentColor(RGBA.R, RGBA.G, RGBA.B);
                        }
                        break;
                    case FILL_TYPE_SOLID:
                        if (_calculated_unifill.fill.color && _calculated_unifill.fill.color.RGBA !== null && typeof _calculated_unifill.fill.color.RGBA === "object") {
                            RGBA = _calculated_unifill.fill.color.RGBA;
                            CellPr.Shd.Color = new CDocumentColor(RGBA.R, RGBA.G, RGBA.B);
                        }
                        break;
                    default:
                        CellPr.Shd.Value = shd_Nil;
                    }
                }
            }
            if (CellPr.TableCellBorders !== null && typeof CellPr.TableCellBorders === "object") {
                var _borders = CellPr.TableCellBorders;
                var _border;
                for (var key in _borders) {
                    if (_borders[key] instanceof CDocumentBorder) {
                        _border = _borders[key];
                        var _calculated_line;
                        if (_border.lnRef != null) {
                            _calculated_line = _theme.getLnStyle(_border.lnRef.idx);
                            _border.lnRef.Color.Calculate(_theme, _slide, _layout, _master);
                            RGBA = _border.lnRef.Color.RGBA;
                        } else {
                            _calculated_line = new CLn();
                        }
                        var _tmp_pen = new CLn();
                        _tmp_pen.Fill = _border.unifill;
                        _calculated_line.merge(_tmp_pen);
                        if (_calculated_line.Fill != null) {
                            _calculated_line.Fill.calculate(_theme, _slide, _layout, _master, RGBA);
                        }
                        if ((_calculated_line.Fill !== null && typeof _calculated_line.Fill === "object" && _calculated_line.Fill.fill !== null && typeof _calculated_line.Fill.fill === "object")) {
                            if (_calculated_line.Fill.fill.color && _calculated_line.Fill.fill.color.RGBA !== null && typeof _calculated_line.Fill.fill.color.RGBA === "object") {
                                RGBA = _calculated_line.Fill.fill.color.RGBA;
                                _border.Color = new CDocumentColor(RGBA.R, RGBA.G, RGBA.B);
                            }
                            if (_calculated_line.Fill.fill.type === FILL_TYPE_NONE || _calculated_line.Fill.fill.type === FILL_TYPE_NOFILL) {
                                _border.Value = border_None;
                            }
                        }
                    }
                }
            }
        }
        return {
            CellPr: CellPr,
            ParaPr: ParaPr,
            TextPr: TextPr
        };
    },
    OnContentRecalculate: function (bChange, bForceRecalc) {
        this.Row.Table.Internal_RecalculateFrom(this.Row.Index, this.Index, bChange, false);
    },
    OnContentReDraw: function (StartPage, EndPage) {
        this.Row.Table.Parent.OnContentReDraw(StartPage, EndPage);
    },
    Get_Styles: function (level, bParagraphStyles) {
        return this.Row.Table.Get_Styles(level, bParagraphStyles);
    },
    Get_TableStyleForPara: function () {
        this.Get_CompiledPr(false);
        var TextPr = this.CompiledPr.TextPr.Copy();
        var ParaPr = this.CompiledPr.ParaPr.Copy();
        return {
            TextPr: TextPr,
            ParaPr: ParaPr
        };
    },
    Get_Numbering: function () {
        return this.Row.Table.Get_Numbering();
    },
    Is_Cell: function () {
        return true;
    },
    Is_DrawingShape: function () {
        return this.Row.Table.Parent.Is_DrawingShape();
    },
    Is_HdrFtr: function (bReturnHdrFtr) {
        return this.Row.Table.Parent.Is_HdrFtr(bReturnHdrFtr);
    },
    Is_TopDocument: function (bReturnTopDocument) {
        if (true === bReturnTopDocument) {
            return this.Row.Table.Parent.Is_TopDocument(bReturnTopDocument);
        }
        return false;
    },
    Is_InTable: function (bReturnTopTable) {
        if (true === bReturnTopTable) {
            var CurTable = this.Row.Table;
            var TopTable = CurTable.Parent.Is_InTable(true);
            if (null === TopTable) {
                return CurTable;
            } else {
                return TopTable;
            }
        }
        return true;
    },
    Is_UseInDocument: function (Id) {
        if (null != this.Row) {
            return this.Row.Is_UseInDocument(this.Get_Id());
        }
        return false;
    },
    Get_PageContentStartPos: function (PageNum) {
        return this.Row.Table.Get_PageContentStartPos(PageNum + this.Content.StartPage, this.Row.Index, this.Index, true);
    },
    Set_CurrentElement: function () {
        var Table = this.Row.Table;
        Table.Selection.Start = false;
        Table.Selection.Type = table_Selection_Text;
        Table.Selection.Use = this.Content.Is_SelectionUse();
        Table.Selection.StartPos.Pos = {
            Row: this.Row.Index,
            Cell: this.Index
        };
        Table.Selection.EndPos.Pos = {
            Row: this.Row.Index,
            Cell: this.Index
        };
        Table.Markup.Internal.RowIndex = 0;
        Table.Markup.Internal.CellIndex = 0;
        Table.Markup.Internal.PageNum = 0;
        Table.CurCell = this;
        Table.Document_SetThisElementCurrent();
    },
    Is_ThisElementCurrent: function () {
        var Table = this.Row.Table;
        if (false === Table.Selection.Use && this === Table.CurCell) {
            var Parent = Table.Parent;
            if (docpostype_Content === Parent.CurPos.Type && false === Parent.Selection.Use && this.Index === Parent.CurPos.ContentPos) {
                return Table.Parent.Is_ThisElementCurrent();
            }
        }
        return false;
    },
    Check_TableCoincidence: function (Table) {
        var CurTable = this.Row.Table;
        if (Table === CurTable) {
            return true;
        } else {
            return CurTable.Parent.Check_TableCoincidence(Table);
        }
    },
    Get_StartPage_Absolute: function () {
        return this.Row.Table.Get_StartPage_Absolute();
    },
    Get_StartPage_Relative: function () {
        return this.Row.Table.Get_StartPage_Relative();
    },
    Content_Reset: function (X, Y, XLimit, YLimit) {
        this.Content.Reset(X, Y, XLimit, YLimit);
        this.Content.Set_CurPosXY(X, Y);
    },
    Content_Get_PageBounds: function (PageIndex) {
        return this.Content.Get_PageBounds(PageIndex);
    },
    Content_Get_PagesCount: function () {
        return this.Content.Get_PagesCount();
    },
    Content_Draw: function (PageIndex, pGraphics) {
        this.Content.Draw(PageIndex, pGraphics);
    },
    Recalculate: function () {
        this.Content.Recalculate(false);
    },
    Content_Merge: function (OtherContent) {
        this.Content.Add_Content(OtherContent);
    },
    Content_Is_ContentOnFirstPage: function () {
        return this.Content.Is_ContentOnFirstPage();
    },
    Content_Set_StartPage: function (PageNum) {
        this.Content.Set_StartPage(PageNum);
    },
    Content_DocumentSearch: function (Str, Type) {
        this.Content.DocumentSearch(Str, Type);
    },
    Content_Document_CreateFontMap: function (FontMap) {
        this.Content.Document_CreateFontMap(FontMap);
    },
    Content_Cursor_MoveToStartPos: function () {
        this.Content.Cursor_MoveToStartPos();
    },
    Content_Cursor_MoveToEndPos: function () {
        this.Content.Cursor_MoveToEndPos();
    },
    Clear_DirectFormatting: function (bClearMerge) {
        this.Set_Shd(undefined);
        this.Set_Margins(undefined);
        this.Set_Border(undefined, 0);
        this.Set_Border(undefined, 1);
        this.Set_Border(undefined, 2);
        this.Set_Border(undefined, 3);
        if (true === bClearMerge) {
            this.Set_GridSpan(undefined);
            this.Set_VMerge(undefined);
        }
    },
    Copy_Pr: function (OtherPr, bCopyOnlyVisualProps) {
        if (true != bCopyOnlyVisualProps) {
            if (undefined === OtherPr.GridSpan) {
                this.Set_GridSpan(undefined);
            } else {
                this.Set_GridSpan(OtherPr.GridSpan);
            }
        }
        if (undefined === OtherPr.Shd) {
            this.Set_Shd(undefined);
        } else {
            var Shd_new = {
                Value: OtherPr.Shd.Value,
                Color: {
                    r: OtherPr.Shd.Color.r,
                    g: OtherPr.Shd.Color.g,
                    b: OtherPr.Shd.Color.b
                },
                unifill: OtherPr.Shd.unifill ? OtherPr.Shd.unifill.createDuplicate() : null,
                fillRef: OtherPr.Shd.fillRef ? OtherPr.Shd.fillRef.createDuplicate() : null
            };
            this.Set_Shd(Shd_new);
        }
        if (true != bCopyOnlyVisualProps) {
            if (undefined === OtherPr.VMerge) {
                this.Set_VMerge(OtherPr.VMerge);
            } else {
                this.Set_VMerge(OtherPr.VMerge);
            }
        }
        if (undefined === OtherPr.TableCellBorders.Top) {
            this.Set_Border(undefined, 0);
        } else {
            var Border_top_new = (null === OtherPr.TableCellBorders.Top ? null : {
                Value: OtherPr.TableCellBorders.Top.Value,
                Size: OtherPr.TableCellBorders.Top.Size,
                Color: {
                    r: OtherPr.TableCellBorders.Top.Color.r,
                    g: OtherPr.TableCellBorders.Top.Color.g,
                    b: OtherPr.TableCellBorders.Top.Color.b
                },
                Space: OtherPr.TableCellBorders.Top.Space,
                unifill: OtherPr.TableCellBorders.Top.unifill ? OtherPr.TableCellBorders.Top.unifill.createDuplicate() : null
            });
            this.Set_Border(Border_top_new, 0);
        }
        if (undefined === OtherPr.TableCellBorders.Bottom) {
            this.Set_Border(undefined, 2);
        } else {
            var Border_bottom_new = (null === OtherPr.TableCellBorders.Bottom ? null : {
                Value: OtherPr.TableCellBorders.Bottom.Value,
                Size: OtherPr.TableCellBorders.Bottom.Size,
                Color: {
                    r: OtherPr.TableCellBorders.Bottom.Color.r,
                    g: OtherPr.TableCellBorders.Bottom.Color.g,
                    b: OtherPr.TableCellBorders.Bottom.Color.b
                },
                Space: OtherPr.TableCellBorders.Bottom.Space,
                unifill: OtherPr.TableCellBorders.Bottom.unifill ? OtherPr.TableCellBorders.Bottom.unifill.createDuplicate() : null
            });
            this.Set_Border(Border_bottom_new, 2);
        }
        if (undefined === OtherPr.TableCellBorders.Left) {
            this.Set_Border(undefined, 3);
        } else {
            var Border_left_new = (null === OtherPr.TableCellBorders.Left ? null : {
                Value: OtherPr.TableCellBorders.Left.Value,
                Size: OtherPr.TableCellBorders.Left.Size,
                Color: {
                    r: OtherPr.TableCellBorders.Left.Color.r,
                    g: OtherPr.TableCellBorders.Left.Color.g,
                    b: OtherPr.TableCellBorders.Left.Color.b
                },
                Space: OtherPr.TableCellBorders.Left.Space,
                unifill: OtherPr.TableCellBorders.Left.unifill ? OtherPr.TableCellBorders.Left.unifill.createDuplicate() : null
            });
            this.Set_Border(Border_left_new, 3);
        }
        if (undefined === OtherPr.TableCellBorders.Right) {
            this.Set_Border(undefined, 1);
        } else {
            var Border_right_new = (null === OtherPr.TableCellBorders.Right ? null : {
                Value: OtherPr.TableCellBorders.Right.Value,
                Size: OtherPr.TableCellBorders.Right.Size,
                Color: {
                    r: OtherPr.TableCellBorders.Right.Color.r,
                    g: OtherPr.TableCellBorders.Right.Color.g,
                    b: OtherPr.TableCellBorders.Right.Color.b
                },
                Space: OtherPr.TableCellBorders.Right.Space,
                unifill: OtherPr.TableCellBorders.Right.unifill ? OtherPr.TableCellBorders.Right.unifill.createDuplicate() : null
            });
            this.Set_Border(Border_right_new, 1);
        }
        if (undefined === OtherPr.TableCellMar) {
            this.Set_Margins(undefined);
        } else {
            var Margins_new = ((null === OtherPr.TableCellMar || (!OtherPr.TableCellMar.Top || !OtherPr.TableCellMar.Left || !OtherPr.TableCellMar.Bottom || !OtherPr.TableCellMar.Right)) ? null : {
                Top: {
                    W: OtherPr.TableCellMar.Top.W,
                    Type: OtherPr.TableCellMar.Top.Type
                },
                Left: {
                    W: OtherPr.TableCellMar.Left.W,
                    Type: OtherPr.TableCellMar.Left.Type
                },
                Bottom: {
                    W: OtherPr.TableCellMar.Bottom.W,
                    Type: OtherPr.TableCellMar.Bottom.Type
                },
                Right: {
                    W: OtherPr.TableCellMar.Right.W,
                    Type: OtherPr.TableCellMar.Right.Type
                }
            });
            this.Set_Margins(Margins_new, -1);
        }
    },
    Get_W: function () {
        var W = this.Get_CompiledPr(false).TableCellW;
        return W.Copy();
    },
    Set_W: function (CellW) {
        if (undefined === CellW) {
            History.Add(this, {
                Type: historyitem_TableCell_W,
                Old: this.Pr.TableCellW,
                New: undefined
            });
            this.Pr.TableCellW = undefined;
        } else {
            History.Add(this, {
                Type: historyitem_TableCell_W,
                Old: this.Pr.TableCellW,
                New: CellW
            });
            this.Pr.TableCellW = CellW;
        }
        this.Recalc_CompiledPr();
    },
    Get_GridSpan: function () {
        var GridSpan = this.Get_CompiledPr(false).GridSpan;
        return GridSpan;
    },
    Set_GridSpan: function (Value) {
        if (undefined === Value && undefined === this.Pr.GridSpan) {
            return;
        }
        if (undefined === Value && undefined != this.Pr.GridSpan) {
            History.Add(this, {
                Type: historyitem_TableCell_GridSpan,
                Old: this.Pr.GridSpan,
                New: undefined
            });
            this.Pr.GridSpan = undefined;
            this.Recalc_CompiledPr();
        } else {
            if (Value != this.Pr.GridSpan) {
                History.Add(this, {
                    Type: historyitem_TableCell_GridSpan,
                    Old: (undefined === this.Pr.GridSpan ? undefined : this.Pr.GridSpan),
                    New: Value
                });
                this.Pr.GridSpan = Value;
                this.Recalc_CompiledPr();
            }
        }
    },
    Get_Margins: function () {
        var TableCellMar = this.Get_CompiledPr(false).TableCellMar;
        if (null === TableCellMar) {
            return this.Row.Table.Get_TableCellMar();
        } else {
            var TableCellDefMargins = this.Row.Table.Get_TableCellMar();
            var Margins = {
                Top: undefined != TableCellMar.Top ? TableCellMar.Top : TableCellDefMargins.Top,
                Bottom: undefined != TableCellMar.Bottom ? TableCellMar.Bottom : TableCellDefMargins.Bottom,
                Left: undefined != TableCellMar.Left ? TableCellMar.Left : TableCellDefMargins.Left,
                Right: undefined != TableCellMar.Right ? TableCellMar.Right : TableCellDefMargins.Right
            };
            return Margins;
        }
    },
    Is_TableMargins: function () {
        var TableCellMar = this.Get_CompiledPr(false).TableCellMar;
        if (null === TableCellMar) {
            return true;
        } else {
            return false;
        }
    },
    Set_Margins: function (Margin, Type) {
        var OldValue = (undefined === this.Pr.TableCellMar ? undefined : this.Pr.TableCellMar);
        if (undefined === Margin) {
            if (undefined != this.Pr.TableCellMar) {
                History.Add(this, {
                    Type: historyitem_TableCell_Margins,
                    Old: OldValue,
                    New: undefined
                });
                this.Pr.TableCellMar = undefined;
                this.Recalc_CompiledPr();
            }
            return;
        }
        if (null === Margin) {
            if (null != this.Pr.TableCellMar) {
                History.Add(this, {
                    Type: historyitem_TableCell_Margins,
                    Old: OldValue,
                    New: null
                });
                this.Pr.TableCellMar = null;
                this.Recalc_CompiledPr();
            }
            return;
        }
        var Margins_new = this.Pr.TableCellMar;
        var bNeedChange = false;
        var TableMargins = this.Row.Table.Get_TableCellMar();
        if (null === Margins_new || undefined === Margins_new) {
            Margins_new = {
                Left: TableMargins.Left.Copy(),
                Right: TableMargins.Right.Copy(),
                Top: TableMargins.Top.Copy(),
                Bottom: TableMargins.Bottom.Copy()
            };
            bNeedChange = true;
        }
        switch (Type) {
        case -1:
            bNeedChange = true;
            Margins_new.Top.W = Margin.Top.W;
            Margins_new.Top.Type = Margin.Top.Type;
            Margins_new.Right.W = Margin.Right.W;
            Margins_new.Right.Type = Margin.Right.Type;
            Margins_new.Bottom.W = Margin.Bottom.W;
            Margins_new.Bottom.Type = Margin.Bottom.Type;
            Margins_new.Left.W = Margin.Left.W;
            Margins_new.Left.Type = Margin.Left.Type;
            break;
        case 0:
            if (true != bNeedChange && Margins_new.Top.W != Margin.W || Margins_new.Top.Type != Margin.Type) {
                bNeedChange = true;
            }
            Margins_new.Top.W = Margin.W;
            Margins_new.Top.Type = Margin.Type;
            break;
        case 1:
            if (true != bNeedChange && Margins_new.Right.W != Margin.W || Margins_new.Right.Type != Margin.Type) {
                bNeedChange = true;
            }
            Margins_new.Right.W = Margin.W;
            Margins_new.Right.Type = Margin.Type;
            break;
        case 2:
            if (true != bNeedChange && Margins_new.Bottom.W != Margin.W || Margins_new.Bottom.Type != Margin.Type) {
                bNeedChange = true;
            }
            Margins_new.Bottom.W = Margin.W;
            Margins_new.Bottom.Type = Margin.Type;
            break;
        case 3:
            if (true != bNeedChange && Margins_new.Left.W != Margin.W || Margins_new.Left.Type != Margin.Type) {
                bNeedChange = true;
            }
            Margins_new.Left.W = Margin.W;
            Margins_new.Left.Type = Margin.Type;
            break;
        }
        if (true === bNeedChange) {
            History.Add(this, {
                Type: historyitem_TableCell_Margins,
                Old: OldValue,
                New: Margins_new
            });
            this.Pr.TableCellMar = Margins_new;
            this.Recalc_CompiledPr();
        }
    },
    Get_Shd: function () {
        var Shd = this.Get_CompiledPr(false).Shd;
        return Shd;
    },
    Set_Shd: function (Shd) {
        if (undefined === Shd && undefined === this.Pr.Shd) {
            return;
        }
        if (undefined === Shd) {
            History.Add(this, {
                Type: historyitem_TableCell_Shd,
                Old: this.Pr.Shd,
                New: undefined
            });
            this.Pr.Shd = undefined;
            this.Recalc_CompiledPr();
        } else {
            if (undefined === this.Pr.Shd || false === Shd.Compare(this.Pr.Shd)) {
                var _Shd = new CDocumentShd();
                _Shd.Set_FromObject(Shd);
                History.Add(this, {
                    Type: historyitem_TableCell_Shd,
                    Old: (undefined === this.Pr.Shd ? undefined : this.Pr.Shd),
                    New: _Shd
                });
                this.Pr.Shd = _Shd;
                this.Recalc_CompiledPr();
            }
        }
    },
    Get_VMerge: function () {
        var VMerge = this.Get_CompiledPr(false).VMerge;
        return VMerge;
    },
    Set_VMerge: function (Value) {
        if (undefined === Value && undefined === this.Pr.VMerge) {
            return;
        }
        if (undefined === Value) {
            History.Add(this, {
                Type: historyitem_TableCell_VMerge,
                Old: this.Pr.VMerge,
                New: undefined
            });
            this.Pr.VMerge = undefined;
            this.Recalc_CompiledPr();
        } else {
            if (Value != this.Pr.VMerge) {
                History.Add(this, {
                    Type: historyitem_TableCell_VMerge,
                    Old: (undefined === this.Pr.VMerge ? undefined : this.Pr.VMerge),
                    New: Value
                });
                this.Pr.VMerge = Value;
                this.Recalc_CompiledPr();
            }
        }
    },
    Get_VAlign: function () {
        var VAlign = this.Get_CompiledPr(false).VAlign;
        return VAlign;
    },
    Set_VAlign: function (Value) {
        if (undefined === Value && undefined === this.Pr.VAlign) {
            return;
        }
        if (undefined === Value) {
            History.Add(this, {
                Type: historyitem_TableCell_VAlign,
                Old: this.Pr.VAlign,
                New: undefined
            });
            this.Pr.VMerge = undefined;
            this.Recalc_CompiledPr();
        } else {
            if (Value != this.Pr.VAlign) {
                History.Add(this, {
                    Type: historyitem_TableCell_VAlign,
                    Old: (undefined === this.Pr.VAlign ? undefined : this.Pr.VAlign),
                    New: Value
                });
                this.Pr.VAlign = Value;
                this.Recalc_CompiledPr();
            }
        }
    },
    Get_Borders: function () {
        var CellBorders = {
            Top: this.Get_Border(0),
            Right: this.Get_Border(1),
            Bottom: this.Get_Border(2),
            Left: this.Get_Border(3)
        };
        return CellBorders;
    },
    Get_Border: function (Type) {
        var TableBorders = this.Row.Table.Get_TableBorders();
        var Borders = this.Get_CompiledPr(false).TableCellBorders;
        var Border = null;
        switch (Type) {
        case 0:
            if (null != Borders.Top) {
                Border = Borders.Top;
            } else {
                if (0 != this.Row.Index || null != this.Row.Get_CellSpacing()) {
                    Border = TableBorders.InsideH;
                } else {
                    Border = TableBorders.Top;
                }
            }
            break;
        case 1:
            if (null != Borders.Right) {
                Border = Borders.Right;
            } else {
                if (this.Row.Content.length - 1 != this.Index || null != this.Row.Get_CellSpacing()) {
                    Border = TableBorders.InsideV;
                } else {
                    Border = TableBorders.Right;
                }
            }
            break;
        case 2:
            if (null != Borders.Bottom) {
                Border = Borders.Bottom;
            } else {
                if (this.Row.Table.Content.length - 1 != this.Row.Index || null != this.Row.Get_CellSpacing()) {
                    Border = TableBorders.InsideH;
                } else {
                    Border = TableBorders.Bottom;
                }
            }
            break;
        case 3:
            if (null != Borders.Left) {
                Border = Borders.Left;
            } else {
                if (0 != this.Index || null != this.Row.Get_CellSpacing()) {
                    Border = TableBorders.InsideV;
                } else {
                    Border = TableBorders.Left;
                }
            }
            break;
        }
        return Border;
    },
    Set_Border: function (Border, Type) {
        var DstBorder = this.Pr.TableCellBorders.Top;
        var HistoryType = historyitem_TableCell_Border_Left;
        switch (Type) {
        case 0:
            DstBorder = this.Pr.TableCellBorders.Top;
            HistoryType = historyitem_TableCell_Border_Top;
            break;
        case 1:
            DstBorder = this.Pr.TableCellBorders.Right;
            HistoryType = historyitem_TableCell_Border_Right;
            break;
        case 2:
            DstBorder = this.Pr.TableCellBorders.Bottom;
            HistoryType = historyitem_TableCell_Border_Bottom;
            break;
        case 3:
            DstBorder = this.Pr.TableCellBorders.Left;
            HistoryType = historyitem_TableCell_Border_Left;
            break;
        }
        if (undefined === Border) {
            if (undefined === DstBorder) {
                return;
            } else {
                History.Add(this, {
                    Type: HistoryType,
                    Old: DstBorder,
                    New: undefined
                });
                switch (Type) {
                case 0:
                    this.Pr.TableCellBorders.Top = undefined;
                    break;
                case 1:
                    this.Pr.TableCellBorders.Right = undefined;
                    break;
                case 2:
                    this.Pr.TableCellBorders.Bottom = undefined;
                    break;
                case 3:
                    this.Pr.TableCellBorders.Left = undefined;
                    break;
                }
                this.Recalc_CompiledPr();
            }
        } else {
            if (null === Border) {
                if (null === DstBorder) {
                    return;
                } else {
                    History.Add(this, {
                        Type: HistoryType,
                        Old: DstBorder,
                        New: null
                    });
                    switch (Type) {
                    case 0:
                        this.Pr.TableCellBorders.Top = null;
                        break;
                    case 1:
                        this.Pr.TableCellBorders.Right = null;
                        break;
                    case 2:
                        this.Pr.TableCellBorders.Bottom = null;
                        break;
                    case 3:
                        this.Pr.TableCellBorders.Left = null;
                        break;
                    }
                    this.Recalc_CompiledPr();
                }
            } else {
                if (null === DstBorder) {
                    var NewBorder = this.Get_Border(Type).Copy();
                    NewBorder.Value = (null != Border.Value ? Border.Value : NewBorder.Value);
                    NewBorder.Size = (null != Border.Size ? Border.Size : NewBorder.Size);
                    NewBorder.Color.r = (null != Border.Color ? Border.Color.r : NewBorder.Color.r);
                    NewBorder.Color.g = (null != Border.Color ? Border.Color.g : NewBorder.Color.g);
                    NewBorder.Color.b = (null != Border.Color ? Border.Color.b : NewBorder.Color.b);
                    NewBorder.unifill = Border.unifill ? Border.unifill.createDuplicate() : null;
                    History.Add(this, {
                        Type: HistoryType,
                        Old: null,
                        New: NewBorder
                    });
                    switch (Type) {
                    case 0:
                        this.Pr.TableCellBorders.Top = NewBorder;
                        break;
                    case 1:
                        this.Pr.TableCellBorders.Right = NewBorder;
                        break;
                    case 2:
                        this.Pr.TableCellBorders.Bottom = NewBorder;
                        break;
                    case 3:
                        this.Pr.TableCellBorders.Left = NewBorder;
                        break;
                    }
                    this.Recalc_CompiledPr();
                } else {
                    var NewBorder = new CDocumentBorder();
                    NewBorder.Value = (null != Border.Value ? Border.Value : DstBorder.Value);
                    NewBorder.Size = (null != Border.Size ? Border.Size : DstBorder.Size);
                    NewBorder.Color.r = (null != Border.Color ? Border.Color.r : DstBorder.Color.r);
                    NewBorder.Color.g = (null != Border.Color ? Border.Color.g : DstBorder.Color.g);
                    NewBorder.Color.b = (null != Border.Color ? Border.Color.b : DstBorder.Color.b);
                    NewBorder.unifill = Border.unifill ? Border.unifill.createDuplicate() : null;
                    History.Add(this, {
                        Type: HistoryType,
                        Old: DstBorder,
                        New: NewBorder
                    });
                    switch (Type) {
                    case 0:
                        this.Pr.TableCellBorders.Top = NewBorder;
                        break;
                    case 1:
                        this.Pr.TableCellBorders.Right = NewBorder;
                        break;
                    case 2:
                        this.Pr.TableCellBorders.Bottom = NewBorder;
                        break;
                    case 3:
                        this.Pr.TableCellBorders.Left = NewBorder;
                        break;
                    }
                    this.Recalc_CompiledPr();
                }
            }
        }
    },
    Set_BorderInfo_Top: function (TopInfo) {
        this.BorderInfo.Top = TopInfo;
    },
    Set_BorderInfo_Bottom: function (BottomInfo, BeforeCount, AfterCount) {
        this.BorderInfo.Bottom = BottomInfo;
        this.BorderInfo.Bottom_BeforeCount = BeforeCount;
        this.BorderInfo.Bottom_AfterCount = AfterCount;
    },
    Set_BorderInfo_Left: function (LeftInfo, Max) {
        this.BorderInfo.Left = LeftInfo;
        this.BorderInfo.MaxLeft = Max;
    },
    Set_BorderInfo_Right: function (RightInfo, Max) {
        this.BorderInfo.Right = RightInfo;
        this.BorderInfo.MaxRight = Max;
    },
    Get_BorderInfo: function () {
        return this.BorderInfo;
    },
    Undo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_TableCell_GridSpan:
            if (undefined === Data.Old) {
                this.Pr.GridSpan = undefined;
            } else {
                this.Pr.GridSpan = Data.Old;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableCell_Margins:
            if (undefined === Data.Old) {
                this.Pr.TableCellMar = undefined;
            } else {
                this.Pr.TableCellMar = Data.Old;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableCell_Shd:
            if (undefined === Data.Old) {
                this.Pr.Shd = undefined;
            } else {
                this.Pr.Shd = Data.Old;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableCell_VMerge:
            if (undefined === Data.Old) {
                this.Pr.VMerge = undefined;
            } else {
                this.Pr.VMerge = Data.Old;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableCell_Border_Left:
            if (undefined === Data.Old) {
                this.Pr.TableCellBorders.Left = undefined;
            } else {
                this.Pr.TableCellBorders.Left = Data.Old;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableCell_Border_Right:
            if (undefined === Data.Old) {
                this.Pr.TableCellBorders.Right = undefined;
            } else {
                this.Pr.TableCellBorders.Right = Data.Old;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableCell_Border_Top:
            if (undefined === Data.Old) {
                this.Pr.TableCellBorders.Top = undefined;
            } else {
                this.Pr.TableCellBorders.Top = Data.Old;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableCell_Border_Bottom:
            if (undefined === Data.Old) {
                this.Pr.TableCellBorders.Bottom = undefined;
            } else {
                this.Pr.TableCellBorders.Bottom = Data.Old;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableCell_VAlign:
            if (undefined === Data.Old) {
                this.Pr.VAlign = undefined;
            } else {
                this.Pr.VAlign = Data.Old;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableCell_W:
            if (undefined === Data.Old) {
                this.Pr.TableCellW = undefined;
            } else {
                this.Pr.TableCellW = Data.Old;
            }
            this.Recalc_CompiledPr();
            break;
        }
        if (this.Row && this.Row.Table && this.Row.Table.Parent) {
            this.Row.Table.Parent.onParagraphChanged();
        }
    },
    Redo: function (Data) {
        var Type = Data.Type;
        switch (Type) {
        case historyitem_TableCell_GridSpan:
            if (undefined === Data.New) {
                this.Pr.GridSpan = undefined;
            } else {
                this.Pr.GridSpan = Data.New;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableCell_Margins:
            if (undefined === Data.New) {
                this.Pr.TableCellMar = undefined;
            } else {
                this.Pr.TableCellMar = Data.New;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableCell_Shd:
            if (undefined === Data.New) {
                this.Pr.Shd = undefined;
            } else {
                this.Pr.Shd = Data.New;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableCell_VMerge:
            if (undefined === Data.New) {
                this.Pr.VMerge = undefined;
            } else {
                this.Pr.VMerge = Data.New;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableCell_Border_Left:
            if (undefined === Data.New) {
                this.Pr.TableCellBorders.Left = undefined;
            } else {
                this.Pr.TableCellBorders.Left = Data.New;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableCell_Border_Right:
            if (undefined === Data.New) {
                this.Pr.TableCellBorders.Right = undefined;
            } else {
                this.Pr.TableCellBorders.Right = Data.New;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableCell_Border_Top:
            if (undefined === Data.New) {
                this.Pr.TableCellBorders.Top = undefined;
            } else {
                this.Pr.TableCellBorders.Top = Data.New;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableCell_Border_Bottom:
            if (undefined === Data.New) {
                this.Pr.TableCellBorders.Bottom = undefined;
            } else {
                this.Pr.TableCellBorders.Bottom = Data.New;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableCell_VAlign:
            if (undefined === Data.New) {
                this.Pr.VAlign = undefined;
            } else {
                this.Pr.VAlign = Data.New;
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableCell_W:
            if (undefined === Data.New) {
                this.Pr.TableCellW = undefined;
            } else {
                this.Pr.TableCellW = Data.New;
            }
            this.Recalc_CompiledPr();
            break;
        }
        if (this.Row && this.Row.Table && this.Row.Table.Parent) {
            this.Row.Table.Parent.onParagraphChanged();
        }
    },
    Get_ParentObject_or_DocumentPos: function () {
        return this.Row.Table.Get_ParentObject_or_DocumentPos(this.Row.Table.Index);
    },
    Refresh_RecalcData: function (Data) {
        var bNeedRecalc = false;
        var Type = Data.Type;
        switch (Type) {
        case historyitem_TableCell_GridSpan:
            case historyitem_TableCell_Margins:
            case historyitem_TableCell_VMerge:
            case historyitem_TableCell_Border_Left:
            case historyitem_TableCell_Border_Right:
            case historyitem_TableCell_Border_Top:
            case historyitem_TableCell_Border_Bottom:
            case historyitem_TableCell_VAlign:
            case historyitem_TableCell_W:
            bNeedRecalc = true;
            break;
        case historyitem_TableCell_Shd:
            break;
        }
        this.Refresh_RecalcData2(0, 0);
    },
    Refresh_RecalcData2: function (Page_Rel) {
        var Table = this.Row.Table;
        var TablePr = Table.Get_CompiledPr(false).TablePr;
        if (tbllayout_AutoFit === TablePr.TableLayout) {
            var CurCol;
            var ColsCount = Table.TableGrid.length;
            var TableGrid_old = new Array();
            for (CurCol = 0; CurCol < ColsCount; CurCol++) {
                TableGrid_old[CurCol] = Table.TableGrid[CurCol];
            }
            Table.Internal_RecalculateGrid();
            var TableGrid_new = Table.TableGrid;
            for (CurCol = 0; CurCol < ColsCount; CurCol++) {
                if (Math.abs(TableGrid_old[CurCol] - TableGrid_new[CurCol]) > 0.001) {
                    return Table.Refresh_RecalcData2(0, 0);
                }
            }
        }
        this.Row.Refresh_RecalcData2(this.Index, Page_Rel);
    },
    Save_Changes: function (Data, Writer) {
        Writer.WriteLong(historyitem_type_TableCell);
        var Type = Data.Type;
        Writer.WriteLong(Type);
        switch (Type) {
        case historyitem_TableCell_GridSpan:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Writer.WriteLong(Data.New);
            }
            break;
        case historyitem_TableCell_Margins:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                if (null === Data.New) {
                    Writer.WriteBool(true);
                } else {
                    Writer.WriteBool(false);
                    Data.New.Top.Write_ToBinary(Writer);
                    Data.New.Left.Write_ToBinary(Writer);
                    Data.New.Bottom.Write_ToBinary(Writer);
                    Data.New.Right.Write_ToBinary(Writer);
                }
            }
            break;
        case historyitem_TableCell_Shd:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Data.New.writeToBinaryCollaborative(Writer);
            }
            break;
        case historyitem_TableCell_VMerge:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Writer.WriteLong(Data.New);
            }
            break;
        case historyitem_TableCell_Border_Left:
            case historyitem_TableCell_Border_Right:
            case historyitem_TableCell_Border_Top:
            case historyitem_TableCell_Border_Bottom:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                if (null === Data.New) {
                    Writer.WriteBool(true);
                } else {
                    Writer.WriteBool(false);
                    Data.New.writeToBinaryCollaborative(Writer);
                }
            }
            break;
        case historyitem_TableCell_VAlign:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Writer.WriteLong(Data.New);
            }
            break;
        case historyitem_TableCell_W:
            if (undefined === Data.New) {
                Writer.WriteBool(true);
            } else {
                Writer.WriteBool(false);
                Data.New.Write_ToBinary(Writer);
            }
            break;
        }
        return Writer;
    },
    Save_Changes2: function (Data, Writer) {
        return false;
    },
    Load_Changes: function (Reader, Reader2) {
        var ClassType = Reader.GetLong();
        if (historyitem_type_TableCell != ClassType) {
            return;
        }
        var Type = Reader.GetLong();
        switch (Type) {
        case historyitem_TableCell_GridSpan:
            var bUndefined = Reader.GetBool();
            if (true === bUndefined) {
                this.Pr.GridSpan = undefined;
            } else {
                this.Pr.GridSpan = Reader.GetLong();
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableCell_Margins:
            var bUndefined = Reader.GetBool();
            if (true === bUndefined) {
                this.Pr.TableCellMar = undefined;
            } else {
                var bNull = Reader.GetBool();
                if (true === bNull) {
                    this.Pr.TableCellMar = null;
                } else {
                    this.Pr.TableCellMar = {
                        Top: new CTableMeasurement(tblwidth_Auto, 0),
                        Left: new CTableMeasurement(tblwidth_Auto, 0),
                        Bottom: new CTableMeasurement(tblwidth_Auto, 0),
                        Right: new CTableMeasurement(tblwidth_Auto, 0)
                    };
                    this.Pr.TableCellMar.Top.Read_FromBinary(Reader);
                    this.Pr.TableCellMar.Left.Read_FromBinary(Reader);
                    this.Pr.TableCellMar.Bottom.Read_FromBinary(Reader);
                    this.Pr.TableCellMar.Right.Read_FromBinary(Reader);
                }
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableCell_Shd:
            var bUndefined = Reader.GetBool();
            if (true === bUndefined) {
                this.Pr.Shd = undefined;
            } else {
                this.Pr.Shd = new CDocumentShd();
                this.Pr.Shd.readFromBinaryCollaborative(Reader);
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableCell_VMerge:
            var bUndefined = Reader.GetBool();
            if (true === bUndefined) {
                delete this.Pr.VMerge;
            } else {
                this.Pr.VMerge = Reader.GetLong();
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableCell_Border_Left:
            var bUndefined = Reader.GetBool();
            if (true === bUndefined) {
                this.Pr.TableCellBorders.Left = undefined;
            } else {
                var bNull = Reader.GetBool();
                if (true === bNull) {
                    this.Pr.TableCellBorders.Left = null;
                } else {
                    this.Pr.TableCellBorders.Left = new CDocumentBorder();
                    this.Pr.TableCellBorders.Left.readFromBinaryCollaborative(Reader);
                }
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableCell_Border_Right:
            var bUndefined = Reader.GetBool();
            if (true === bUndefined) {
                this.Pr.TableCellBorders.Right = undefined;
            } else {
                var bNull = Reader.GetBool();
                if (true === bNull) {
                    this.Pr.TableCellBorders.Right = null;
                } else {
                    this.Pr.TableCellBorders.Right = new CDocumentBorder();
                    this.Pr.TableCellBorders.Right.readFromBinaryCollaborative(Reader);
                }
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableCell_Border_Top:
            var bUndefined = Reader.GetBool();
            if (true === bUndefined) {
                this.Pr.TableCellBorders.Top = undefined;
            } else {
                var bNull = Reader.GetBool();
                if (true === bNull) {
                    this.Pr.TableCellBorders.Top = null;
                } else {
                    this.Pr.TableCellBorders.Top = new CDocumentBorder();
                    this.Pr.TableCellBorders.Top.readFromBinaryCollaborative(Reader);
                }
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableCell_Border_Bottom:
            var bUndefined = Reader.GetBool();
            if (true === bUndefined) {
                this.Pr.TableCellBorders.Bottom = undefined;
            } else {
                var bNull = Reader.GetBool();
                if (true === bNull) {
                    this.Pr.TableCellBorders.Bottom = null;
                } else {
                    this.Pr.TableCellBorders.Bottom = new CDocumentBorder();
                    this.Pr.TableCellBorders.Bottom.readFromBinaryCollaborative(Reader);
                }
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableCell_VAlign:
            var bUndefined = Reader.GetBool();
            if (true === bUndefined) {
                delete this.Pr.VAlign;
            } else {
                this.Pr.VAlign = Reader.GetLong();
            }
            this.Recalc_CompiledPr();
            break;
        case historyitem_TableCell_W:
            if (true === Reader.GetBool()) {
                delete this.Pr.TableCellW;
            } else {
                this.Pr.TableCellW = new CTableMeasurement(tblwidth_Auto, 0);
                this.Pr.TableCellW.Read_FromBinary(Reader);
            }
            break;
        }
        if (this.Row && this.Row.Table && this.Row.Table.Parent) {
            this.Row.Table.Parent.onParagraphChanged();
        }
    },
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(historyitem_type_TableCell);
        Writer.WriteString2(this.Id);
        Writer.WriteString2(this.Row.Get_Id());
        this.Pr.Write_ToBinary(Writer);
        Writer.WriteString2(this.Content.Get_Id());
    },
    Read_FromBinary2: function (Reader) {
        this.Id = Reader.GetString2();
        var LinkData = new Object();
        LinkData.Row = Reader.GetString2();
        CollaborativeEditing.Add_LinkData(this, LinkData);
        this.Pr = new CTableCellPr();
        this.Pr.Read_FromBinary(Reader);
        this.Recalc_CompiledPr();
        this.Content = g_oTableId.Get_ById(Reader.GetString2());
        CollaborativeEditing.Add_NewObject(this);
    },
    Load_LinkData: function (LinkData) {
        if ("undefined" != typeof(LinkData.Row)) {
            this.Row = g_oTableId.Get_ById(LinkData.Row);
        }
    }
};