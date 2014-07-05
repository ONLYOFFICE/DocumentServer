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
 function CTextBody(shape) {
    this.bodyPr = new CBodyPr();
    this.bodyPr.setDefault();
    this.lstStyle = null;
    this.content = null;
    this.contentWidth = 0;
    this.contentHeight = 0;
    this.styles = [];
    this.recalcInfo = {};
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
    if (isRealObject(shape)) {
        this.setShape(shape);
        this.setDocContent(new CDocumentContent(this, editor.WordControl.m_oLogicDocument.DrawingDocument, 0, 0, 0, 20000, false, false));
    }
}
CTextBody.prototype = {
    Get_Id: function () {
        return this.Id;
    },
    Write_ToBinary2: function (w) {
        w.WriteLong(historyitem_type_TextBody);
        w.WriteString2(this.Id);
    },
    Read_FromBinary2: function (r) {
        this.Id = r.GetString2();
    },
    Is_TopDocument: function () {
        return false;
    },
    Is_HdrFtr: function () {
        return false;
    },
    getType: function () {
        return CLASS_TYPE_TEXT_BODY;
    },
    getObjectType: function () {
        return CLASS_TYPE_TEXT_BODY;
    },
    setLstStyle: function (lstStyle) {
        History.Add(this, {
            Type: historyitem_SetLstStyle,
            oldPr: this.lstStyle,
            newPr: lstStyle
        });
        this.lstStyle = lstStyle;
    },
    setShape: function (shape) {
        History.Add(this, {
            Type: historyitem_SetShape,
            oldPr: this.shape,
            newPr: shape
        });
        this.shape = shape;
    },
    setDocContent: function (docContent) {
        History.Add(this, {
            Type: historyitem_SetDocContent,
            oldPr: this.content,
            newPr: docContent
        });
        this.content = docContent;
        if (this.content && this.shape instanceof CChartTitle) {
            var is_on = History.Is_On();
            if (is_on) {
                History.TurnOff();
            }
            var styles = new CStyles();
            var default_legend_style = new CStyle("defaultLegendStyle", styles.Default, null, styletype_Paragraph);
            var TextPr = {
                FontFamily: {}
            };
            TextPr.FontFamily.Name = "Calibri";
            TextPr.FontFamily.Index = -1;
            TextPr.RFonts = {};
            TextPr.RFonts.Ascii = {
                Name: "Calibri",
                Index: -1
            };
            TextPr.RFonts.EastAsia = {
                Name: "Calibri",
                Index: -1
            };
            TextPr.RFonts.HAnsi = {
                Name: "Calibri",
                Index: -1
            };
            TextPr.RFonts.CS = {
                Name: "Calibri",
                Index: -1
            };
            TextPr.Bold = true;
            if (this.shape.getTitleType() === CHART_TITLE_TYPE_TITLE) {
                TextPr.FontSize = 18;
            } else {
                TextPr.FontSize = 10;
            }
            default_legend_style.TextPr.Set_FromObject(TextPr);
            default_legend_style.ParaPr.Spacing.After = 0;
            default_legend_style.ParaPr.Spacing.Before = 0;
            default_legend_style.ParaPr.Spacing.LineRule = linerule_AtLeast;
            default_legend_style.ParaPr.Spacing.Line = 1;
            default_legend_style.ParaPr.Jc = align_Center;
            var tx_pr;
            if (isRealObject(this.txPr)) {}
            styles.Style[default_legend_style.Id] = default_legend_style;
            this.content.Styles = styles;
            this.content.Content[0].Style_Add_Open(default_legend_style.Id);
            if (is_on) {
                History.TurnOn();
            }
        }
    },
    Refresh_RecalcData: function () {
        if (isRealObject(this.content)) {
            if (this.shape instanceof CChartTitle) {
                if (this.shape.chartGroup instanceof CChartAsGroup && this.shape.chartGroup.chart) {
                    this.shape.chartGroup.Refresh_RecalcData();
                }
            } else {
                this.content.Recalculate_Page(0, true);
            }
        }
    },
    draw: function (graphics, pageIndex) {
        if (!graphics.IsNoSupportTextDraw) {
            if (typeof pageIndex === "number") {
                var old_start_page = this.content.Get_StartPage_Relative();
                this.content.Set_StartPage(pageIndex);
            }
            var result_page_index = typeof pageIndex === "number" ? pageIndex : this.shape.pageIndex;
            this.content.Set_StartPage(result_page_index);
            this.content.Draw(result_page_index, graphics);
            if (typeof pageIndex === "number") {
                this.content.Set_StartPage(old_start_page);
            }
        } else {
            graphics.rect(0, 0, this.contentWidth, this.contentHeight);
        }
    },
    Get_Styles: function (level) {
        if (this.shape && typeof this.shape.getStyles === "function") {
            return this.shape.getStyles();
        }
        return editor.WordControl.m_oLogicDocument.Get_Styles();
    },
    Get_Numbering: function () {
        return new CNumbering();
    },
    isEmpty: function () {
        return this.content.Is_Empty();
    },
    Get_TableStyleForPara: function () {
        return null;
    },
    initFromString: function (str) {
        for (var key in str) {
            this.content.Paragraph_Add(new ParaText(str[key]), false);
        }
    },
    Is_ThisElementCurrent: function () {
        return false;
    },
    getColorMap: function () {
        return this.shape.getColorMap();
    },
    getTheme: function () {
        return this.shape.getTheme();
    },
    paragraphAdd: function (paraItem, noRecalc) {
        this.content.Paragraph_Add(paraItem);
        if (! (noRecalc === true)) {
            this.content.Recalculate_Page(0, true);
        }
        this.content.RecalculateCurPos();
        if (this.bodyPr.anchor !== VERTICAL_ANCHOR_TYPE_TOP) {
            this.shape.calculateTransformTextMatrix();
        }
    },
    addNewParagraph: function () {
        this.content.Add_NewParagraph();
        this.content.Recalculate_Page(0, true);
        this.content.RecalculateCurPos();
        if (this.bodyPr.anchor !== VERTICAL_ANCHOR_TYPE_TOP) {
            this.shape.calculateTransformTextMatrix();
        }
    },
    remove: function (direction, bOnlyText) {
        this.content.Remove(direction, bOnlyText);
        this.content.Recalculate_Page(0, true);
        this.content.RecalculateCurPos();
        if (this.bodyPr.anchor !== VERTICAL_ANCHOR_TYPE_TOP) {
            this.shape.calculateTransformTextMatrix();
        }
    },
    OnContentRecalculate: function () {
        if (isRealObject(this.shape) && typeof this.shape.OnContentRecalculate === "function") {
            this.shape.OnContentRecalculate();
        }
    },
    recalculate: function () {},
    getSummaryHeight: function () {
        return this.content.Get_SummaryHeight();
    },
    getBodyPr: function () {
        var res = new CBodyPr();
        res.setDefault();
        res.merge(this.bodyPr);
        return res;
    },
    OnContentReDraw: function () {
        if (isRealObject(this.shape)) {
            this.shape.OnContentReDraw();
        }
    },
    calculateContent: function () {
        var _l, _t, _r, _b;
        var _body_pr = this.getBodyPr();
        var sp = this.shape;
        if (isRealObject(sp.spPr.geometry) && isRealObject(sp.spPr.geometry.rect)) {
            var _rect = sp.spPr.geometry.rect;
            _l = _rect.l + _body_pr.lIns;
            _t = _rect.t + _body_pr.tIns;
            _r = _rect.r - _body_pr.rIns;
            _b = _rect.b - _body_pr.bIns;
        } else {
            _l = _body_pr.lIns;
            _t = _body_pr.tIns;
            _r = sp.extX - _body_pr.rIns;
            _b = sp.extY - _body_pr.bIns;
        }
        if (_body_pr.upright === false) {
            var _content_width;
            if (! (_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270)) {
                _content_width = _r - _l;
                this.contentWidth = _content_width;
                this.contentHeight = _b - _t;
            } else {
                _content_width = _b - _t;
                this.contentWidth = _content_width;
                this.contentHeight = _r - _l;
            }
        } else {
            var _full_rotate = sp.getFullRotate();
            if ((_full_rotate >= 0 && _full_rotate < Math.PI * 0.25) || (_full_rotate > 3 * Math.PI * 0.25 && _full_rotate < 5 * Math.PI * 0.25) || (_full_rotate > 7 * Math.PI * 0.25 && _full_rotate < 2 * Math.PI)) {
                if (! (_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270)) {
                    _content_width = _r - _l;
                    this.contentWidth = _content_width;
                    this.contentHeight = _b - _t;
                } else {
                    _content_width = _b - _t;
                    this.contentWidth = _content_width;
                    this.contentHeight = _r - _l;
                }
            } else {
                if (! (_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270)) {
                    _content_width = _b - _t;
                    this.contentWidth = _content_width;
                    this.contentHeight = _r - _l;
                } else {
                    _content_width = _r - _l;
                    this.contentWidth = _content_width;
                    this.contentHeight = _b - _t;
                }
            }
        }
        this.content.Reset(0, 0, _content_width, 20000);
        this.content.Recalculate_Page(0, true);
    },
    OnEndRecalculate_Page: function () {},
    Is_Cell: function () {
        return false;
    },
    Get_StartPage_Absolute: function () {
        return 0;
    },
    selectionSetStart: function (e, x, y) {
        this.content.Selection_SetStart(x, y, 0, e);
    },
    selectionSetEnd: function (e, x, y) {
        this.content.Selection_SetEnd(x, y, 0, e);
    },
    updateSelectionState: function () {
        var Doc = this.content;
        var DrawingDocument = editor.WordControl.m_oDrawingDocument;
        if (true === Doc.Is_SelectionUse() && !Doc.Selection_IsEmpty()) {
            DrawingDocument.UpdateTargetTransform(this.shape.transformText);
            DrawingDocument.TargetEnd();
            DrawingDocument.SelectEnabled(true);
            DrawingDocument.SelectClear();
            DrawingDocument.SelectShow();
        } else {
            editor.WordControl.m_oLogicDocument.RecalculateCurPos();
            DrawingDocument.UpdateTargetTransform(this.shape.transformText);
            DrawingDocument.TargetShow();
            DrawingDocument.SelectEnabled(false);
        }
    },
    Get_PageContentStartPos: function (pageNum) {
        return {
            X: 0,
            Y: 0,
            XLimit: this.contentWidth,
            YLimit: 20000
        };
    },
    setVerticalAlign: function (align) {
        var anchor_num = null;
        switch (align) {
        case "top":
            anchor_num = VERTICAL_ANCHOR_TYPE_TOP;
            break;
        case "center":
            anchor_num = VERTICAL_ANCHOR_TYPE_CENTER;
            break;
        case "bottom":
            anchor_num = VERTICAL_ANCHOR_TYPE_BOTTOM;
            break;
        }
        if (isRealNumber(anchor_num)) {
            this.bodyPr.anchor = anchor_num;
        }
    },
    setVert: function (angle) {
        var vert = null;
        switch (angle) {
        case 0:
            vert = nVertTThorz;
            break;
        case 90:
            vert = nVertTTvert270;
            break;
        case -90:
            vert = nVertTTvert;
            break;
        }
        if (isRealNumber(vert)) {
            this.bodyPr.vert = vert;
        }
    },
    setTopInset: function (ins) {
        if (isRealNumber(ins)) {
            this.bodyPr.tIns = ins;
        }
    },
    setRightInset: function (ins) {
        if (isRealNumber(ins)) {
            this.bodyPr.rIns = ins;
        }
    },
    setLeftInset: function (ins) {
        if (isRealNumber(ins)) {
            this.bodyPr.lIns = ins;
        }
    },
    setBottomInset: function (ins) {
        if (isRealNumber(ins)) {
            this.bodyPr.bIns = ins;
        }
    },
    setPaddings: function (paddings) {
        if (isRealObject(paddings)) {
            this.setBottomInset(paddings.Bottom);
            this.setTopInset(paddings.Top);
            this.setLeftInset(paddings.Left);
            this.setRightInset(paddings.Right);
        }
    },
    recalculateCurPos: function () {
        this.content.RecalculateCurPos();
    },
    drawTextSelection: function () {
        this.content.Selection_Draw_Page(0);
    },
    getRectWidth: function (maxWidth) {
        try {
            var body_pr = this.getBodyPr();
            var r_ins = body_pr.rIns;
            var l_ins = body_pr.lIns;
            var max_content_width = maxWidth - r_ins - l_ins;
            this.content.Reset(0, 0, max_content_width, 20000);
            this.content.Recalculate_Page(0, true);
            var max_width = 0;
            for (var i = 0; i < this.content.Content.length; ++i) {
                var par = this.content.Content[i];
                for (var j = 0; j < par.Lines.length; ++j) {
                    if (par.Lines[j].Ranges[0].W > max_width) {
                        max_width = par.Lines[j].Ranges[0].W;
                    }
                }
            }
            return max_width + 2 + r_ins + l_ins;
        } catch(e) {
            return 0;
        }
    },
    getRectHeight: function (maxHeight, width) {
        try {
            this.content.Reset(0, 0, width, 20000);
            this.content.Recalculate_Page(0, true);
            var content_height = this.getSummaryHeight();
            var t_ins = isRealNumber(this.bodyPr.tIns) ? this.bodyPr.tIns : 1.27;
            var b_ins = isRealNumber(this.bodyPr.bIns) ? this.bodyPr.bIns : 1.27;
            return content_height + t_ins + b_ins;
        } catch(e) {
            return 0;
        }
    },
    Refresh_RecalcData2: function () {
        if (isRealObject(this.content)) {
            if (this.shape instanceof CChartTitle) {
                if (this.shape.chartGroup instanceof CChartAsGroup && this.shape.chartGroup.chart) {
                    this.shape.chartGroup.Refresh_RecalcData2();
                }
            } else {
                this.content.Recalculate_Page(0, true);
            }
        }
    },
    Undo: function (data) {
        switch (data.Type) {
        case historyitem_SetShape:
            this.shape = data.oldPr;
            break;
        case historyitem_SetDocContent:
            this.content = data.oldPr;
            if (this.content && this.shape instanceof CChartTitle) {
                var is_on = History.Is_On();
                if (is_on) {
                    History.TurnOff();
                }
                var styles = new CStyles();
                var default_legend_style = new CStyle("defaultLegendStyle", styles.Default, null, styletype_Paragraph);
                default_legend_style.TextPr.themeFont = "Calibri";
                default_legend_style.TextPr.Bold = true;
                if (this.shape.getTitleType() === CHART_TITLE_TYPE_TITLE) {
                    default_legend_style.TextPr.FontSize = 18;
                } else {
                    default_legend_style.TextPr.FontSize = 10;
                }
                default_legend_style.ParaPr.Spacing.After = 0;
                default_legend_style.ParaPr.Spacing.Before = 0;
                default_legend_style.ParaPr.Spacing.LineRule = linerule_AtLeast;
                default_legend_style.ParaPr.Spacing.Line = 1;
                default_legend_style.ParaPr.Jc = align_Center;
                var tx_pr;
                if (isRealObject(this.txPr)) {}
                styles.Style[styles.Id] = default_legend_style;
                this.content.Styles = styles;
                if (is_on) {
                    History.TurnOn();
                }
            }
            break;
        case historyitem_SetLstStyle:
            this.lstStyle = data.oldPr;
            break;
        }
    },
    Redo: function (data) {
        switch (data.Type) {
        case historyitem_SetShape:
            this.shape = data.newPr;
            break;
        case historyitem_SetDocContent:
            this.content = data.newPr;
            if (this.content && this.shape instanceof CChartTitle) {
                var is_on = History.Is_On();
                if (is_on) {
                    History.TurnOff();
                }
                var styles = new CStyles();
                var default_legend_style = new CStyle("defaultLegendStyle", styles.Default, null, styletype_Paragraph);
                default_legend_style.TextPr.themeFont = "Calibri";
                default_legend_style.TextPr.Bold = true;
                if (this.shape.getTitleType() === CHART_TITLE_TYPE_TITLE) {
                    default_legend_style.TextPr.FontSize = 18;
                } else {
                    default_legend_style.TextPr.FontSize = 10;
                }
                default_legend_style.ParaPr.Spacing.After = 0;
                default_legend_style.ParaPr.Spacing.Before = 0;
                default_legend_style.ParaPr.Spacing.LineRule = linerule_AtLeast;
                default_legend_style.ParaPr.Spacing.Line = 1;
                default_legend_style.ParaPr.Jc = align_Center;
                var tx_pr;
                if (isRealObject(this.txPr)) {}
                styles.Style[styles.Id] = default_legend_style;
                this.content.Styles = styles;
                if (is_on) {
                    History.TurnOn();
                }
            }
            break;
        case historyitem_SetLstStyle:
            this.lstStyle = data.newPr;
            break;
        }
    },
    Save_Changes: function (data, w) {
        w.WriteLong(historyitem_type_TextBody);
        w.WriteLong(data.Type);
        switch (data.Type) {
        case historyitem_SetShape:
            case historyitem_SetDocContent:
            w.WriteBool(isRealObject(data.newPr));
            if (isRealObject(data.newPr)) {
                w.WriteString2(data.newPr.Get_Id());
            }
            break;
        case historyitem_SetLstStyle:
            w.WriteBool(isRealObject(data.newPr));
            if (isRealObject(data.newPr)) {
                data.newPr.Write_ToBinary2(w);
            }
            break;
        }
    },
    Load_Changes: function (r) {
        if (r.GetLong() === historyitem_type_TextBody) {
            var type = r.GetLong();
            switch (type) {
            case historyitem_SetShape:
                if (r.GetBool()) {
                    this.shape = g_oTableId.Get_ById(r.GetString2());
                } else {
                    this.shape = null;
                }
                break;
            case historyitem_SetDocContent:
                if (r.GetBool()) {
                    this.content = g_oTableId.Get_ById(r.GetString2());
                } else {
                    this.content = null;
                }
                if (this.content && this.shape instanceof CChartTitle) {
                    var is_on = History.Is_On();
                    if (is_on) {
                        History.TurnOff();
                    }
                    var styles = new CStyles();
                    var default_legend_style = new CStyle("defaultLegendStyle", styles.Default, null, styletype_Paragraph);
                    default_legend_style.TextPr.themeFont = "Calibri";
                    default_legend_style.TextPr.Bold = true;
                    if (this.shape.getTitleType() === CHART_TITLE_TYPE_TITLE) {
                        default_legend_style.TextPr.FontSize = 18;
                    } else {
                        default_legend_style.TextPr.FontSize = 10;
                    }
                    default_legend_style.ParaPr.Spacing.After = 0;
                    default_legend_style.ParaPr.Spacing.Before = 0;
                    default_legend_style.ParaPr.Spacing.LineRule = linerule_AtLeast;
                    default_legend_style.ParaPr.Spacing.Line = 1;
                    default_legend_style.ParaPr.Jc = align_Center;
                    var tx_pr;
                    if (isRealObject(this.txPr)) {}
                    styles.Style[styles.Id] = default_legend_style;
                    this.content.Styles = styles;
                    if (is_on) {
                        History.TurnOn();
                    }
                }
                break;
            case historyitem_SetLstStyle:
                if (r.GetBool()) {
                    this.lstStyle = new TextListStyle();
                    this.lstStyle.Read_FromBinary2(r);
                } else {
                    this.lstStyle = null;
                }
                break;
            }
        }
    },
    writeToBinaryForCopyPaste: function (w) {
        this.bodyPr.Write_ToBinary2(w);
    },
    readFromBinaryForCopyPaste: function (r, drawingDocument) {
        this.bodyPr.Read_FromBinary2(r);
        this.content = new CDocumentContent(this, drawingDocument, 0, 0, 0, 20000, false, false);
    },
    writeToBinary: function (w) {
        this.bodyPr.Write_ToBinary2(w);
        writeToBinaryDocContent(this.content, w);
    },
    createCopyDocContentForCopyPaste: function () {
        var b_history_is_on = History.Is_On();
        if (b_history_is_on) {
            History.TurnOff();
        }
        var ret = this.content.Copy(this);
        for (var i = 0; i < ret.Content.length; ++i) {
            ret.Content[i].Style_Add_Open(null);
        }
        if (b_history_is_on) {
            History.TurnOn();
        }
        return ret;
    },
    readFromBinary: function (r, drawingDocument) {
        var bodyPr = new CBodyPr();
        bodyPr.Read_FromBinary2(r);
        if (isRealObject(this.parent) && this.parent.setBodyPr) {
            this.parent.setBodyPr(bodyPr);
        }
        var is_on = History.Is_On();
        if (is_on) {
            History.TurnOff();
        }
        var dc = new CDocumentContent(this, editor.WordControl.m_oDrawingDocument, 0, 0, 0, 0, false, false);
        readFromBinaryDocContent(dc, r);
        if (is_on) {
            History.TurnOn();
        }
        for (var i = 0; i < dc.Content.length; ++i) {
            if (i > 0) {
                this.content.Add_NewParagraph();
            }
            var par = dc.Content[i];
            for (var j = 0; j < par.Content.length; ++j) {
                if (! (par.Content[j] instanceof ParaEnd || par.Content[j] instanceof ParaEmpty || par.Content[j] instanceof ParaNumbering) && par.Content[j].Copy) {
                    this.content.Paragraph_Add(par.Content[j].Copy());
                }
            }
        }
    },
    getDocContentForCopyPaste: function () {
        var history_is_on = History.Is_On();
        if (history_is_on) {
            History.TurnOff();
        }
        var ret = this.content.Copy(this);
        ret.Styles = this.content.Styles;
        ret.Recalculate_Page(0, true);
        ret.CurPos = this.content.CurPos;
        ret.Selection = this.content.Selection;
        for (var i = 0; i < ret.Content.length; ++i) {
            var text_pr = ret.Content[i].Get_CompiledPr2().TextPr;
            ret.Content[i].Style_Remove();
            var start_pos = ret.Content[i].Internal_GetStartPos();
            ret.Content[i].Internal_Content_Add(start_pos, new ParaTextPr(text_pr), true);
            ret.Content[i].CurPos = this.content.Content[i].CurPos;
            ret.Content[i].Selection = this.content.Content[i].Selection;
        }
        if (history_is_on) {
            History.TurnOn();
        }
        return ret;
    },
    copyFromOther: function (txBody) {
        if (isRealObject(this.parent) && this.parent.setBodyPr) {
            this.parent.setBodyPr(this.bodyPr.createDuplicate());
        }
        for (var i = 0; i < txBody.content.Content.length; ++i) {
            if (i > 0) {
                this.content.Add_NewParagraph();
            }
            var par = txBody.content.Content[i];
            for (var i = 0; i < par.Content.length; ++i) {
                if (! (par.Content[i] instanceof ParaEnd || par.Content[i] instanceof ParaEmpty || par.Content[i] instanceof ParaNumbering) && par.Content[i].Copy) {
                    this.content.Paragraph_Add(par.Content[i].Copy());
                }
            }
        }
        for (var i = 0; i < this.content.Content.length; ++i) {
            this.content.Content[i].Set_DocumentIndex(i);
        }
    }
};