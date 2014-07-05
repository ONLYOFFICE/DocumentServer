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
 function CTableId() {
    this.m_aPairs = new Object();
    this.m_bTurnOff = false;
    this.Id = g_oIdCounter.Get_NewId();
    this.Add(this, this.Id);
}
CTableId.prototype = {
    getObjectType: function () {
        return CLASS_TYPE_TABLE_ID;
    },
    Add: function (Class, Id, sheetId) {
        if (false === this.m_bTurnOff) {
            Class.Id = Id;
            this.m_aPairs[Id] = Class;
            if (Class !== this && History instanceof CHistory) {
                History.Add(g_oUndoRedoGraphicObjects, historyitem_TableId_Add, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoData_GTableIdAdd(Class, Id)));
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
    Redo: function (type, data) {
        switch (type) {
        case historyitem_TableId_Add:
            if (isRealObject(this.m_aPairs[data.id]) && this.m_aPairs[data.id].Id === data.id) {
                break;
            }
            this.m_bTurnOff = true;
            var Id = data.id;
            var Class;
            switch (data.objectType) {
            case CLASS_TYPE_SHAPE:
                Class = new CShape();
                break;
            case CLASS_TYPE_XFRM:
                Class = new CXfrm();
                break;
            case CLASS_TYPE_GEOMETRY:
                Class = new CGeometry();
                break;
            case CLASS_TYPE_IMAGE:
                Class = new CImageShape();
                break;
            case CLASS_TYPE_GROUP:
                Class = new CGroupShape();
                break;
            case CLASS_TYPE_PATH:
                Class = new Path();
                break;
            case CLASS_TYPE_PARAGRAPH:
                Class = new Paragraph();
                break;
            case CLASS_TYPE_TEXT_BODY:
                Class = new CTextBody();
                break;
            case CLASS_TYPE_DOCUMENT_CONTENT:
                Class = new CDocumentContent();
                break;
            case CLASS_TYPE_TEXT_PR:
                Class = new ParaTextPr();
                break;
            case CLASS_TYPE_UNI_FILL:
                Class = new CUniFill();
                break;
            case CLASS_TYPE_PATTERN_FILL:
                Class = new CPattFill();
                break;
            case CLASS_TYPE_GRAD_FILL:
                Class = new CGradFill();
                break;
            case CLASS_TYPE_SOLID_FILL:
                Class = new CSolidFill();
                break;
            case CLASS_TYPE_UNI_COLOR:
                Class = new CUniColor();
                break;
            case CLASS_TYPE_SCHEME_COLOR:
                Class = new CSchemeColor();
                break;
            case CLASS_TYPE_RGB_COLOR:
                Class = new CRGBColor();
                break;
            case CLASS_TYPE_PRST_COLOR:
                Class = new CPrstColor();
                break;
            case CLASS_TYPE_SYS_COLOR:
                Class = new CSysColor();
                break;
            case CLASS_TYPE_LINE:
                Class = new CLn();
                break;
            case CLASS_TYPE_CHART_AS_GROUP:
                Class = new CChartAsGroup();
                break;
            case CLASS_TYPE_CHART_LEGEND:
                Class = new CChartLegend();
                break;
            case CLASS_TYPE_CHART_TITLE:
                Class = new CChartTitle();
                break;
            case CLASS_TYPE_COLOR_MOD:
                Class = new CColorMod();
                break;
            case CLASS_TYPE_LEGEND_ENTRY:
                Class = new CLegendEntry();
                break;
            case CLASS_TYPE_NO_FILL:
                Class = new CNoFill();
                break;
            case CLASS_TYPE_GS:
                Class = new CGs();
                break;
            case CLASS_TYPE_BLIP_FILL:
                Class = new CBlipFill();
                break;
            case CLASS_TYPE_GRAD_LIN:
                Class = new GradLin();
                break;
            case CLASS_TYPE_CHART_DATA:
                Class = new asc_CChart();
                break;
            case CLASS_TYPE_CHART_LAYOUT:
                Class = new CChartLayout();
                break;
            }
            if (isRealObject(Class)) {
                Class.Id = Id;
                this.m_aPairs[Id] = Class;
            }
            this.m_bTurnOff = false;
            break;
        }
    },
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
        case historyitem_type_Drawing:
            Element = new ParaDrawing();
            break;
        case historyitem_type_FlowImage:
            Element = new FlowImage();
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
        case historyitem_type_FlowTable:
            Element = new FlowTable();
            break;
        case historyitem_type_HdrFtr:
            Element = new CHeaderFooter();
            break;
        case historyitem_type_AbstractNum:
            Element = new CAbstractNum();
            break;
        }
        Element.Read_FromBinary2(Reader);
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
    Unlock: function (Data) {}
};
function CTextBody(shape) {
    this.bodyPr = new CBodyPr();
    this.bodyPr.setDefault();
    this.lstStyle = null;
    this.content = null;
    this.contentWidth = 0;
    this.contentHeight = 0;
    this.styles = [];
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
    if (isRealObject(shape)) {
        this.setShape(shape);
        this.addDocumentContent(new CDocumentContent(this, isRealObject(shape.drawingObjects) ? shape.drawingObjects.drawingDocument : null, 0, 0, 200, 20000, false, false));
    }
}
CTextBody.prototype = {
    Get_Id: function () {
        return this.Id;
    },
    getType: function () {
        return CLASS_TYPE_TEXT_BODY;
    },
    getObjectType: function () {
        return CLASS_TYPE_TEXT_BODY;
    },
    setLstStyle: function (lstStyle) {
        this.lstStyle = lstStyle;
    },
    setDocContent: function (docContent) {
        this.content = docContent;
    },
    setShape: function (shape) {
        var oldId = isRealObject(this.shape) ? this.shape.Get_Id() : null;
        var newId = isRealObject(shape) ? shape.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetShape, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldId, newId)));
        this.shape = shape;
    },
    addDocumentContent: function (docContent) {
        var oldId = isRealObject(this.content) ? this.content.Get_Id() : null;
        var newId = isRealObject(docContent) ? docContent.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_AddDocContent, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldId, newId)));
        this.content = docContent;
    },
    draw: function (graphics) {
        if (!graphics.IsNoSupportTextDraw) {
            this.content.Draw(0, graphics);
        } else {
            graphics.rect(0, 0, this.contentWidth, this.contentHeight);
        }
    },
    Get_Styles: function (level) {
        if (!isRealObject(this.styles[level])) {
            var styles = this.shape.getStyles(level);
            if (isRealObject(this.lstStyle) && this.shape instanceof CShape) {
                var style = new CStyle("textBodyStyle", styles.Style.length - 1, null, styletype_Paragraph);
                styles.Style[styles.Id] = style;
                ++styles.Id;
            }
            this.styles[level] = styles;
        }
        return this.styles[level];
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
    getColorMap: function () {
        return this.shape.getColorMap();
    },
    getTheme: function () {
        return this.shape.getTheme();
    },
    paragraphAdd: function (paraItem) {
        this.content.Paragraph_Add(paraItem);
        if (this.shape instanceof CChartTitle) {
            return;
        }
        this.calculateContent();
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
            this.shape.drawingObjects.showDrawingObjects();
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
        for (var i = 0; i < this.content.Content.length; ++i) {
            this.content.Content[i].recalculateTextPr();
        }
        this.contentHeight2 = this.content.Get_SummaryHeight();
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
    updateSelectionState: function (drawingDocument) {
        var Doc = this.content;
        if (true === Doc.Is_SelectionUse() && !Doc.Selection_IsEmpty()) {
            drawingDocument.UpdateTargetTransform(this.shape.transformText);
            drawingDocument.TargetEnd();
            drawingDocument.SelectEnabled(true);
            drawingDocument.SelectClear();
            drawingDocument.SelectShow();
        } else {
            drawingDocument.UpdateTargetTransform(this.shape.transformText);
            drawingDocument.TargetShow();
            drawingDocument.SelectEnabled(false);
            drawingDocument.CheckTargetShow();
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
        if (typeof align === "string") {
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
        } else {
            anchor_num = align;
        }
        if (isRealNumber(anchor_num)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_VerticalAlign, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(this.bodyPr.anchor, anchor_num)));
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
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Vert, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(this.bodyPr.vert, vert)));
            this.bodyPr.vert = vert;
        }
    },
    setTopInset: function (ins) {
        if (isRealNumber(ins)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_TopInset, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(this.bodyPr.tIns, ins)));
            this.bodyPr.tIns = ins;
        }
    },
    setRightInset: function (ins) {
        if (isRealNumber(ins)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RightInset, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(this.bodyPr.rIns, ins)));
            this.bodyPr.rIns = ins;
        }
    },
    setLeftInset: function (ins) {
        if (isRealNumber(ins)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_LeftInset, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(this.bodyPr.lIns, ins)));
            this.bodyPr.lIns = ins;
        }
    },
    setBottomInset: function (ins) {
        if (isRealNumber(ins)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_BottomInset, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(this.bodyPr.bIns, ins)));
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
        return max_width + r_ins + l_ins + 2;
    },
    getRectHeight: function (maxHeight, width) {
        this.content.Reset(0, 0, width, 20000);
        this.content.Recalculate_Page(0, true);
        var content_height = this.getSummaryHeight();
        var t_ins = isRealNumber(this.bodyPr.tIns) ? this.bodyPr.tIns : 1.27;
        var b_ins = isRealNumber(this.bodyPr.bIns) ? this.bodyPr.bIns : 1.27;
        return content_height + t_ins + b_ins;
    },
    Refresh_RecalcData2: function () {
        if (isRealObject(this.content)) {
            if ((this.shape && this.shape instanceof CShape) || ((this.shape instanceof CChartTitle) && this.shape.chartGroup && this.shape.chartGroup.drawingObjects)) {
                this.content.Recalculate_Page(0, true);
            }
        }
    },
    Undo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_LeftInset:
            this.bodyPr.lIns = data.oldValue;
            break;
        case historyitem_AutoShapes_TopInset:
            this.bodyPr.tIns = data.oldValue;
            break;
        case historyitem_AutoShapes_RightInset:
            this.bodyPr.rIns = data.oldValue;
            break;
        case historyitem_AutoShapes_BottomInset:
            this.bodyPr.bIns = data.oldValue;
            break;
        case historyitem_AutoShapes_AddDocContent:
            this.content = g_oTableId.Get_ById(data.oldValue);
            break;
        case historyitem_AutoShapes_SetShape:
            this.shape = g_oTableId.Get_ById(data.oldValue);
            break;
        case historyitem_AutoShapes_VerticalAlign:
            this.bodyPr.anchor = data.oldValue;
            break;
        case historyitem_AutoShapes_Vert:
            this.bodyPr.vert = data.oldValue;
            break;
        case historyitem_AutoShapes_OnContentRecalculateUndo:
            if (this.shape && this.shape.OnContentRecalculate) {
                this.shape.OnContentRecalculate();
            }
            break;
        }
    },
    Redo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_LeftInset:
            this.bodyPr.lIns = data.newValue;
            break;
        case historyitem_AutoShapes_TopInset:
            this.bodyPr.tIns = data.newValue;
            break;
        case historyitem_AutoShapes_RightInset:
            this.bodyPr.rIns = data.newValue;
            break;
        case historyitem_AutoShapes_BottomInset:
            this.bodyPr.bIns = data.newValue;
            break;
        case historyitem_AutoShapes_AddDocContent:
            this.content = g_oTableId.Get_ById(data.newValue);
            break;
        case historyitem_AutoShapes_SetShape:
            this.shape = g_oTableId.Get_ById(data.newValue);
            break;
        case historyitem_AutoShapes_VerticalAlign:
            this.bodyPr.anchor = data.newValue;
            break;
        case historyitem_AutoShapes_Vert:
            this.bodyPr.vert = data.newValue;
            break;
        case historyitem_AutoShapes_OnContentRecalculateRedo:
            if (this.shape && this.shape.OnContentRecalculate) {
                this.shape.OnContentRecalculate();
            }
            break;
        }
    },
    getSelectedTextHtml: function () {
        var old_styles = this.content.Styles;
        g_oTableId.m_bTurnOff = true;
        this.content.Styles = new CStyles();
        g_oTableId.m_bTurnOff = false;
        var copy_processor = new CopyProcessor(this.content);
        ret = copy_processor.Start();
        this.content.Styles = old_styles;
        return ret;
    },
    insertHtml: function (node) {
        var controller;
        if (this.shape instanceof CShape) {
            controller = this.shape.drawingObjects.controller;
        } else {
            if (this.shape instanceof CChartTitle) {
                controller = this.shape.chartGroup.drawingObjects.controller;
            }
        }
        if (controller) {
            controller.checkSelectedObjectsAndCallback(this.insertHtmlCallBack, [node]);
        }
    },
    insertHtmlCallBack: function (node) {
        if (this.curState.textObject && this.curState.textObject.txBody) {
            History.Create_NewPoint();
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_OnContentRecalculateUndo, null, null, new UndoRedoDataGraphicObjects(this.curState.textObject.txBody.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
            var paste_processor = new PasteProcessor(this.curState.textObject.txBody.content);
            paste_processor.txBody = this.curState.textObject.txBody;
            paste_processor.drawingObjectsController = this;
            paste_processor.drawingObjects = this.drawingObjects;
            paste_processor.Start(node);
        }
    },
    writeToBinaryForCopyPaste: function (w) {
        this.bodyPr.Write_ToBinary2(w);
        writeToBinaryDocContent(this.content, w);
    },
    readFromBinaryForCopyPaste: function (r, drawingDocument) {
        this.bodyPr.Read_FromBinary2(r);
        this.content = new CDocumentContent(this, drawingDocument, 0, 0, 0, 20000, false, false);
        readFromBinaryDocContent(this.content, r);
    },
    writeToBinary: function (w) {
        this.bodyPr.Write_ToBinary2(w);
        writeToBinaryDocContent(this.content, w);
    },
    readFromBinary: function (r, drawingDocument) {
        var bodyPr = new CBodyPr();
        bodyPr.Read_FromBinary2(r);
        if (isRealObject(this.parent) && this.parent.setBodyPr) {
            this.parent.setBodyPr(bodyPr);
        } else {
            this.bodyPr = bodyPr;
        }
        var is_on = History.Is_On();
        if (is_on) {
            History.TurnOff();
        }
        var dc = new CDocumentContent(this, drawingDocument, 0, 0, 0, 0, false, false);
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
    }
};
function CopyProcessor(oDocument) {
    this.oDocument = oDocument;
    this.ElemToSelect = ElemToSelect = document.createElement("div");
    this.Ul = document.createElement("ul");
    this.Ol = document.createElement("ul");
    this.oTagPr;
    this.orPr;
    this.aInnerHtml;
    this.Para;
    this.bOccurEndPar;
    this.oCurHyperlink = null;
    this.oCurHyperlinkElem = null;
}
CopyProcessor.prototype = {
    getSrc: function (src) {
        var start = src.substring(0, 6);
        if (0 != src.indexOf("http:") && 0 != src.indexOf("data:") && 0 != src.indexOf("https:") && 0 != src.indexOf("ftp:") && 0 != src.indexOf("file:")) {
            return documentOrigin + src;
        } else {
            return src;
        }
    },
    RGBToCSS: function (rgb) {
        var sResult = "#";
        var sR = rgb.r.toString(16);
        if (sR.length == 1) {
            sR = "0" + sR;
        }
        var sG = rgb.g.toString(16);
        if (sG.length == 1) {
            sG = "0" + sG;
        }
        var sB = rgb.b.toString(16);
        if (sB.length == 1) {
            sB = "0" + sB;
        }
        return "#" + sR + sG + sB;
    },
    CommitList: function (oDomTarget) {
        if (this.Ul.childNodes.length > 0) {
            oDomTarget.appendChild(this.Ul);
            this.Ul = document.createElement("ul");
        }
        if (this.Ol.childNodes.length > 0) {
            oDomTarget.appendChild(this.Ol);
            this.Ol = document.createElement("ol");
        }
    },
    Commit_pPr: function (Item) {
        var apPr = new Array();
        var Def_pPr = this.oDocument.Styles.Default.ParaPr;
        var Item_pPr = Item.CompiledPr.Pr.ParaPr;
        if (Item_pPr) {
            if (Def_pPr.Ind.Left != Item_pPr.Ind.Left) {
                apPr.push("margin-left:" + (Item_pPr.Ind.Left * g_dKoef_mm_to_pt) + "pt");
            }
            if (Def_pPr.Ind.Right != Item_pPr.Ind.Right) {
                apPr.push("margin-right:" + (Item_pPr.Ind.Right * g_dKoef_mm_to_pt) + "pt");
            }
            if (Def_pPr.Ind.FirstLine != Item_pPr.Ind.FirstLine) {
                apPr.push("text-indent:" + (Item_pPr.Ind.FirstLine * g_dKoef_mm_to_pt) + "pt");
            }
            if (Def_pPr.Jc != Item_pPr.Jc) {
                switch (Item_pPr.Jc) {
                case align_Left:
                    apPr.push("text-align:left");
                    break;
                case align_Center:
                    apPr.push("text-align:center");
                    break;
                case align_Right:
                    apPr.push("text-align:right");
                    break;
                case align_Justify:
                    apPr.push("text-align:justify");
                    break;
                }
            }
            if (Def_pPr.KeepLines != Item_pPr.KeepLines || Def_pPr.WidowControl != Item_pPr.WidowControl) {
                if (Def_pPr.KeepLines != Item_pPr.KeepLines && Def_pPr.WidowControl != Item_pPr.WidowControl) {
                    apPr.push("mso-pagination:none lines-together");
                } else {
                    if (Def_pPr.KeepLines != Item_pPr.KeepLines) {
                        apPr.push("mso-pagination:widow-orphan lines-together");
                    } else {
                        if (Def_pPr.WidowControl != Item_pPr.WidowControl) {
                            apPr.push("mso-pagination:none");
                        }
                    }
                }
            }
            if (Def_pPr.KeepNext != Item_pPr.KeepNext) {
                apPr.push("page-break-after:avoid");
            }
            if (Def_pPr.PageBreakBefore != Item_pPr.PageBreakBefore) {
                apPr.push("page-break-before:always");
            }
            if (Def_pPr.Spacing.Line != Item_pPr.Spacing.Line) {
                if (linerule_AtLeast == Item_pPr.Spacing.LineRule) {
                    apPr.push("line-height:" + (Item_pPr.Spacing.Line * g_dKoef_mm_to_pt) + "pt");
                } else {
                    if (linerule_Auto == Item_pPr.Spacing.LineRule) {
                        if (1 == Item_pPr.Spacing.Line) {
                            apPr.push("line-height:normal");
                        } else {
                            apPr.push("line-height:" + parseInt(Item_pPr.Spacing.Line * 100) + "%");
                        }
                    }
                }
            }
            if (Def_pPr.Spacing.LineRule != Item_pPr.Spacing.LineRule) {
                if (linerule_Exact == Item_pPr.Spacing.LineRule) {
                    apPr.push("mso-line-height-rule:exactly");
                }
            }
            apPr.push("margin-top:" + (Item_pPr.Spacing.Before * g_dKoef_mm_to_pt) + "pt");
            apPr.push("margin-bottom:" + (Item_pPr.Spacing.After * g_dKoef_mm_to_pt) + "pt");
            if (Def_pPr.Shd.Value != Item_pPr.Shd.Value) {
                apPr.push("background-color:" + this.RGBToCSS(Item_pPr.Shd.Color));
            }
            if (Item_pPr.Tabs.Get_Count() > 0) {
                var sRes = "";
                for (var i = 0, length = Item_pPr.Tabs.Get_Count(); i < length; i++) {
                    if (0 != i) {
                        sRes += " ";
                    }
                    sRes += Item_pPr.Tabs.Get(i).Pos / 10 + "cm";
                }
                apPr.push("tab-stops:" + sRes);
            }
            if (null != Item_pPr.Brd) {
                apPr.push("border:none");
                var borderStyle = this._BordersToStyle(Item_pPr.Brd, "mso-", "-alt");
                if (null != borderStyle) {
                    var nborderStyleLength = borderStyle.length;
                    if (nborderStyleLength > 0) {
                        borderStyle = borderStyle.substring(0, nborderStyleLength - 1);
                    }
                    apPr.push(borderStyle);
                }
            }
        }
        if (apPr.length > 0) {
            this.Para.setAttribute("style", apPr.join(";"));
        }
    },
    InitRun: function (bInitPr) {
        if (bInitPr) {
            this.oTagPr = new Object();
            this.orPr = new Object();
        }
        this.aInnerHtml = new Array();
    },
    CommitSpan: function (bInitPr) {
        if (this.aInnerHtml.length > 0) {
            var Run = document.createElement("span");
            var sStyle = "";
            for (prop in this.orPr) {
                sStyle += prop + ":" + this.orPr[prop] + ";";
            }
            if ("" != sStyle) {
                Run.setAttribute("style", sStyle);
            }
            if (this.aInnerHtml.length > 0) {
                var sText = this.aInnerHtml.join("");
                sText = sText.replace(/\s+/g, function (str) {
                    var sResult = "";
                    for (var i = 0, length = str.length; i < length - 1; i++) {
                        sResult += "&nbsp;";
                    }
                    sResult += " ";
                    return sResult;
                });
                var sStart = "";
                var aEnd = new Array();
                for (prop in this.oTagPr) {
                    sStart += "<" + prop + ">";
                    aEnd.push("</" + prop + ">");
                }
                if ("" != sStart && aEnd.length > 0) {
                    aEnd.reverse();
                    sText = sStart + sText + aEnd.join("");
                }
                Run.innerHTML = sText;
            }
            if (null != this.oCurHyperlinkElem) {
                this.oCurHyperlinkElem.appendChild(Run);
            } else {
                this.Para.appendChild(Run);
            }
        }
        this.InitRun(bInitPr);
    },
    parse_para_TextPr: function (Value) {
        this.CommitSpan(false);
        for (var prop in Value) {
            this.SetProp(prop, Value[prop]);
        }
    },
    SetProp: function (prop, val) {
        var oPropMap = {
            RFonts: function (oThis, val) {
                var sFontName = null;
                if (null != val.Ascii) {
                    sFontName = val.Ascii.Name;
                } else {
                    if (null != val.HAnsi) {
                        sFontName = val.HAnsi.Name;
                    } else {
                        if (null != val.EastAsia) {
                            sFontName = val.EastAsia.Name;
                        } else {
                            if (null != val.CS) {
                                sFontName = val.CS.Name;
                            }
                        }
                    }
                }
                if (null != sFontName) {
                    oThis.orPr["font-family"] = "'" + sFontName + "'";
                }
            },
            FontSize: function (oThis, val) {
                oThis.orPr["font-size"] = val + "pt";
            },
            Bold: function (oThis, val) {
                if (val) {
                    oThis.oTagPr["b"] = 1;
                } else {
                    delete oThis.oTagPr["b"];
                }
            },
            Italic: function (oThis, val) {
                if (val) {
                    oThis.oTagPr["i"] = 1;
                } else {
                    delete oThis.oTagPr["i"];
                }
            },
            Underline: function (oThis, val) {
                if (val) {
                    oThis.oTagPr["u"] = 1;
                } else {
                    delete oThis.oTagPr["u"];
                }
            },
            Strikeout: function (oThis, val) {
                if (val) {
                    oThis.oTagPr["s"] = 1;
                } else {
                    delete oThis.oTagPr["s"];
                }
            },
            HighLight: function (oThis, val) {
                if (val != highlight_None) {
                    oThis.orPr["background-color"] = oThis.RGBToCSS(val);
                } else {
                    delete oThis.orPr["background-color"];
                }
            },
            Color: function (oThis, val) {
                var color = oThis.RGBToCSS(val);
                oThis.orPr["color"] = color;
                oThis.orPr["mso-style-textfill-fill-color"] = color;
            },
            VertAlign: function (oThis, val) {
                if (vertalign_SuperScript == val) {
                    oThis.orPr["vertical-align"] = "super";
                } else {
                    if (vertalign_SubScript == val) {
                        oThis.orPr["vertical-align"] = "sub";
                    } else {
                        delete oThis.orPr["vertical-align"];
                    }
                }
            }
        };
        if ("undefined" != typeof(oPropMap[prop])) {
            oPropMap[prop](this, val);
        }
    },
    ParseItem: function (ParaItem, Par, nParIndex, aDocumentContent, nDocumentContentIndex) {
        switch (ParaItem.Type) {
        case para_Text:
            var sValue = ParaItem.Value;
            if (sValue) {
                sValue = CopyPasteCorrectString(sValue);
                this.aInnerHtml.push(sValue);
            }
            break;
        case para_Space:
            this.aInnerHtml.push(" ");
            break;
        case para_Tab:
            this.aInnerHtml.push("<span style='mso-tab-count:1'>    </span>");
            break;
        case para_NewLine:
            if (break_Page == ParaItem.BreakType) {
                this.aInnerHtml.push('<br clear="all" style="mso-special-character:line-break;page-break-before:always;" />');
            } else {
                this.aInnerHtml.push('<br style="mso-special-character:line-break;" />');
            }
            break;
        case para_End:
            this.bOccurEndPar = true;
            break;
        case para_TextPr:
            if (null != Par) {
                var oCalculateTextPr = Par.Internal_CalculateTextPr(nParIndex);
                this.parse_para_TextPr(oCalculateTextPr);
            }
            break;
        case para_Drawing:
            var oGraphicObj = ParaItem.GraphicObj;
            var sSrc = oGraphicObj.getBase64Img();
            if (sSrc.length > 0) {
                sSrc = this.getSrc(sSrc);
                this.aInnerHtml.push('<img style="max-width:100%;" width="' + Math.round(ParaItem.W * g_dKoef_mm_to_pix) + '" height="' + Math.round(ParaItem.H * g_dKoef_mm_to_pix) + '" src="' + sSrc + '" />');
                break;
            }
            break;
        case para_FlowObjectAnchor:
            var oFlowObj = ParaItem.FlowObject;
            if (flowobject_Image == oFlowObj.Get_Type()) {
                var sSrc = oFlowObj.Img;
                if (sSrc.length > 0) {
                    sSrc = this.getSrc(sSrc);
                    var sStyle = "";
                    var nLeft = oFlowObj.X;
                    var nRight = nLeft + oFlowObj.W;
                    if (Math.abs(nLeft - X_Left_Margin) < Math.abs(Page_Width - nRight - X_Right_Margin)) {
                        sStyle = "float:left;";
                    } else {
                        sStyle = "float:right;";
                    }
                    sStyle += "margin:0pt 10pt 0pt 10pt;";
                    this.aInnerHtml.push('<img style="' + sStyle + '" width="' + Math.round(oFlowObj.W * g_dKoef_mm_to_pix) + '" height="' + Math.round(oFlowObj.H * g_dKoef_mm_to_pix) + '" src="' + sSrc + '" />');
                    break;
                }
            }
            break;
        case para_HyperlinkStart:
            if (null == this.oCurHyperlinkElem) {
                this.CommitSpan(false);
                this.oCurHyperlink = ParaItem;
                this.oCurHyperlinkElem = document.createElement("a");
                if (null != this.oCurHyperlink.Value) {
                    this.oCurHyperlinkElem.href = this.oCurHyperlink.Value;
                }
                if (null != this.oCurHyperlink.ToolTip) {
                    this.oCurHyperlinkElem.setAttribute("title", this.oCurHyperlink.ToolTip);
                }
            }
            break;
        case para_HyperlinkEnd:
            this.CommitSpan(false);
            if (null != this.oCurHyperlinkElem) {
                this.Para.appendChild(this.oCurHyperlinkElem);
            } else {
                var oHyperlink = null;
                for (var i = nParIndex - 1; i >= 0; --i) {
                    var item = Par.Content[i];
                    if (para_HyperlinkStart == item.Type) {
                        oHyperlink = item;
                        break;
                    }
                }
                if (null == oHyperlink) {
                    for (var i = nDocumentContentIndex - 1; i >= 0; --i) {
                        var item = aDocumentContent[i];
                        if (type_Paragraph == item.Type) {
                            for (var j = item.Content.length - 1; j >= 0; --j) {
                                var Paritem = item.Content[ji];
                                if (para_HyperlinkStart == Paritem.Type) {
                                    oHyperlink = Paritem;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (null != oHyperlink) {
                    bReset = false;
                    this.CommitSpan(false);
                    this.oCurHyperlink = oHyperlink;
                    this.oCurHyperlinkElem = document.createElement("a");
                    if (null != this.oCurHyperlink.Value) {
                        this.oCurHyperlinkElem.href = this.oCurHyperlink.Value;
                    }
                    if (null != this.oCurHyperlink.ToolTip) {
                        this.oCurHyperlinkElem.setAttribute("title", this.oCurHyperlink.ToolTip);
                    }
                    for (var i = 0; i < this.Para.childNodes.length; i++) {
                        var child = this.Para.childNodes[i];
                        child = this.Para.removeChild(child);
                        this.oCurHyperlinkElem.appendChild(child);
                    }
                    this.Para.appendChild(this.oCurHyperlinkElem);
                }
            }
            this.oCurHyperlink = null;
            this.oCurHyperlinkElem = null;
            break;
        }
    },
    CopyParagraph: function (oDomTarget, Item, bLast, bUseSelection, aDocumentContent, nDocumentContentIndex) {
        var oDocument = this.oDocument;
        this.Para = null;
        var styleId = Item.Style_Get();
        if (styleId) {
            var styleName = oDocument.Styles.Get_Name(styleId).toLowerCase();
            if (0 == styleName.indexOf("heading")) {
                var nLevel = parseInt(styleName.substring("heading".length));
                if (1 <= nLevel && nLevel <= 6) {
                    this.Para = document.createElement("h" + nLevel);
                }
            }
        }
        if (null == this.Para) {
            this.Para = document.createElement("p");
        }
        this.bOccurEndPar = false;
        var oNumPr;
        var bIsNullNumPr = false;
        oNumPr = Item.Numbering_Get();
        bIsNullNumPr = (null == oNumPr || 0 == oNumPr.NumId);
        if (bIsNullNumPr) {
            this.CommitList(oDomTarget);
        } else {
            var bBullet = false;
            var sListStyle = "";
            var aNum = this.oDocument.Numbering.Get_AbstractNum(oNumPr.NumId);
            if (null != aNum) {
                var LvlPr = aNum.Lvl[oNumPr.Lvl];
                if (null != LvlPr) {
                    switch (LvlPr.Format) {
                    case numbering_numfmt_Decimal:
                        sListStyle = "decimal";
                        break;
                    case numbering_numfmt_LowerRoman:
                        sListStyle = "lower-roman";
                        break;
                    case numbering_numfmt_UpperRoman:
                        sListStyle = "upper-roman";
                        break;
                    case numbering_numfmt_LowerLetter:
                        sListStyle = "lower-alpha";
                        break;
                    case numbering_numfmt_UpperLetter:
                        sListStyle = "upper-alpha";
                        break;
                    default:
                        sListStyle = "disc";
                        bBullet = true;
                        break;
                    }
                }
            }
            var Li = document.createElement("li");
            Li.setAttribute("style", "list-style-type: " + sListStyle);
            Li.appendChild(this.Para);
            if (bBullet) {
                this.Ul.appendChild(Li);
            } else {
                this.Ol.appendChild(Li);
            }
        }
        this.Commit_pPr(Item);
        this.InitRun(true);
        var ParaStart = 0;
        var ParaEnd = Item.Content.length - 1;
        if (true == bUseSelection) {
            ParaStart = Item.Selection.StartPos;
            ParaEnd = Item.Selection.EndPos;
            if (ParaStart > ParaEnd) {
                var Temp2 = ParaEnd;
                ParaEnd = ParaStart;
                ParaStart = Temp2;
            }
        }
        var oCalculateTextPr = Item.Internal_CalculateTextPr(ParaStart);
        this.parse_para_TextPr(oCalculateTextPr);
        if (null != this.oCurHyperlink) {
            this.oCurHyperlinkElem = document.createElement("a");
            if (null != this.oCurHyperlink.Value) {
                this.oCurHyperlinkElem.href = this.oCurHyperlink.Value;
            }
            if (null != this.oCurHyperlink.ToolTip) {
                this.oCurHyperlinkElem.setAttribute("title", this.oCurHyperlink.ToolTip);
            }
        }
        if (ParaStart > 0) {
            while (Item.Content[ParaStart - 1].Type === para_TextPr || Item.Content[ParaStart - 1].Type === para_HyperlinkStart) {
                ParaStart--;
                if (0 == ParaStart) {
                    break;
                }
            }
        }
        for (var Index2 = ParaStart; Index2 < ParaEnd; Index2++) {
            var ParaItem = Item.Content[Index2];
            this.ParseItem(ParaItem, Item, Index2, aDocumentContent, nDocumentContentIndex);
        }
        this.CommitSpan(true);
        if (null != this.oCurHyperlinkElem) {
            this.Para.appendChild(this.oCurHyperlinkElem);
        }
        this.oCurHyperlink = null;
        this.oCurHyperlinkElem = null;
        if (bLast && false == this.bOccurEndPar) {
            if (false == bIsNullNumPr) {
                var li = this.Para.parentNode;
                var ul = li.parentNode;
                ul.removeChild(li);
                this.CommitList(oDomTarget);
            }
            for (var i = 0; i < this.Para.childNodes.length; i++) {
                oDomTarget.appendChild(this.Para.childNodes[i].cloneNode(true));
            }
        } else {
            if (this.Para.childNodes.length == 0) {
                this.Para.appendChild(document.createTextNode("\xa0"));
            }
            if (bIsNullNumPr) {
                oDomTarget.appendChild(this.Para);
            }
        }
    },
    _BorderToStyle: function (border, name) {
        var res = "";
        if (border_None == border.Value) {
            res += name + ":none;";
        } else {
            bBorder = true;
            var size = 0.5;
            var color = {
                r: 0,
                g: 0,
                b: 0
            };
            if (null != border.Size) {
                size = border.Size * g_dKoef_mm_to_pt;
            }
            if (null != border.Color) {
                color = border.Color;
            }
            res += name + ":" + size + "pt solid " + this.RGBToCSS(color) + ";";
        }
        return res;
    },
    _MarginToStyle: function (margins, styleName) {
        var res = "";
        var nMarginLeft = 1.9;
        var nMarginTop = 0;
        var nMarginRight = 1.9;
        var nMarginBottom = 0;
        if (null != margins.Left && tblwidth_Mm == margins.Left.Type && null != margins.Left.W) {
            nMarginLeft = margins.Left.W;
        }
        if (null != margins.Top && tblwidth_Mm == margins.Top.Type && null != margins.Top.W) {
            nMarginTop = margins.Top.W;
        }
        if (null != margins.Right && tblwidth_Mm == margins.Right.Type && null != margins.Right.W) {
            nMarginRight = margins.Right.W;
        }
        if (null != margins.Bottom && tblwidth_Mm == margins.Bottom.Type && null != margins.Bottom.W) {
            nMarginBottom = margins.Bottom.W;
        }
        res = styleName + ":" + (nMarginTop * g_dKoef_mm_to_pt) + "pt " + (nMarginRight * g_dKoef_mm_to_pt) + "pt " + (nMarginBottom * g_dKoef_mm_to_pt) + "pt " + (nMarginLeft * g_dKoef_mm_to_pt) + "pt;";
        return res;
    },
    _BordersToStyle: function (borders, mso, alt) {
        var res = "";
        if (null == mso) {
            mso = "";
        }
        if (null == alt) {
            alt = "";
        }
        if (null != borders.Left) {
            res += this._BorderToStyle(borders.Left, mso + "border-left" + alt);
        }
        if (null != borders.Top) {
            res += this._BorderToStyle(borders.Top, mso + "border-top" + alt);
        }
        if (null != borders.Right) {
            res += this._BorderToStyle(borders.Right, mso + "border-right" + alt);
        }
        if (null != borders.Bottom) {
            res += this._BorderToStyle(borders.Bottom, mso + "border-bottom" + alt);
        }
        if (null != borders.InsideV) {
            res += this._BorderToStyle(borders.InsideV, "mso-border-insidev");
        }
        if (null != borders.InsideH) {
            res += this._BorderToStyle(borders.InsideH, "mso-border-insideh");
        }
        if (null != borders.Between) {
            res += this._BorderToStyle(borders.Between, "mso-border-between");
        }
        return res;
    },
    _MergeProp: function (elem1, elem2) {
        if (!elem1 || !elem2) {
            return;
        }
        var p, v;
        for (p in elem2) {
            if (elem2.hasOwnProperty(p) && false == elem1.hasOwnProperty(p)) {
                v = elem2[p];
                if (null != v) {
                    elem1[p] = v;
                }
            }
        }
    },
    CopyDocument: function (oDomTarget, oDocument, bUseSelection) {
        var Start = 0;
        var End = 0;
        if (bUseSelection) {
            if (true === oDocument.Selection.Use) {
                if (selectionflag_DrawingObject === oDocument.Selection.Flag) {
                    this.Para = document.createElement("p");
                    this.InitRun();
                    this.ParseItem(oDocument.Selection.Data.DrawingObject);
                    this.CommitSpan(false);
                    for (var i = 0; i < this.Para.childNodes.length; i++) {
                        this.ElemToSelect.appendChild(this.Para.childNodes[i].cloneNode(true));
                    }
                } else {
                    Start = oDocument.Selection.StartPos;
                    End = oDocument.Selection.EndPos;
                    if (Start > End) {
                        var Temp = End;
                        End = Start;
                        Start = Temp;
                    }
                }
            }
        } else {
            Start = 0;
            End = oDocument.Content.length - 1;
        }
        for (var Index = Start; Index <= End; Index++) {
            var Item = oDocument.Content[Index];
            if (type_Paragraph === Item.GetType()) {
                this.CopyParagraph(oDomTarget, Item, Index == End, bUseSelection, oDocument.Content, Index);
            }
        }
        this.CommitList(oDomTarget);
    },
    Start: function (node) {
        var oDocument = this.oDocument;
        this.CopyDocument(this.ElemToSelect, oDocument, true);
        return this.ElemToSelect;
    }
};
function CopyPasteCorrectString(str) {
    var res = str;
    res = res.replace(/&/g, "&amp;");
    res = res.replace(/</g, "&lt;");
    res = res.replace(/>/g, "&gt;");
    res = res.replace(/'/g, "&apos;");
    res = res.replace(/"/g, "&quot;");
    return res;
}
function PasteProcessor(content) {
    this.oRootNode = null;
    this.bIsDoublePx = false;
    this.oDocument = content;
    this.oLogicDocument = this.oDocument;
    this.oRecalcDocument = this.oDocument;
    this.content = content;
    this.map_font_index;
    this.bUploadImage = false;
    this.bUploadFonts = false;
    this.bNested = true;
    this.oFonts = new Object();
    this.oImages = new Object();
    this.fontMap = {};
    this.bIgnoreNoBlockText = false;
    this.oCurPar = null;
    this.oCurParContentPos = 0;
    this.oCur_rPr = new CTextPr();
    this.nBrCount = 0;
    this.bInBlock = null;
    this.dMaxWidth = 100;
    this.dScaleKoef = 1;
    this.bUseScaleKoef = false;
    this.MsoStyles = {
        "mso-style-type": 1,
        "mso-pagination": 1,
        "mso-line-height-rule": 1,
        "mso-style-textfill-fill-color": 1,
        "mso-tab-count": 1,
        "tab-stops": 1,
        "list-style-type": 1,
        "mso-special-character": 1,
        "mso-padding-alt": 1,
        "mso-border-insidev": 1,
        "mso-border-insideh": 1,
        "mso-row-margin-left": 1,
        "mso-row-margin-right": 1,
        "mso-cellspacing": 1,
        "mso-border-alt": 1,
        "mso-border-left-alt": 1,
        "mso-border-top-alt": 1,
        "mso-border-right-alt": 1,
        "mso-border-bottom-alt": 1,
        "mso-border-between": 1
    };
    this.oBorderCache = new Object();
}
PasteProcessor.prototype = {
    _GetTargetDocument: function (oDocument) {
        if (g_bIsDocumentCopyPaste) {
            if (docpostype_HdrFtr === oDocument.CurPos.Type) {
                if (null != oDocument.HdrFtr && null != oDocument.HdrFtr.CurHdrFtr && null != oDocument.HdrFtr.CurHdrFtr.Content) {
                    oDocument = oDocument.HdrFtr.CurHdrFtr.Content;
                    this.oRecalcDocument = oDocument;
                }
            }
            if (docpostype_FlowObjects == oDocument.CurPos.Type) {
                var oData = oDocument.Selection.Data.FlowObject;
                switch (oData.Get_Type()) {
                case flowobject_Table:
                    if (null != oData.Table && null != oData.Table.CurCell && null != oData.Table.CurCell.Content) {
                        oDocument = this._GetTargetDocument(oData.Table.CurCell.Content);
                        this.oRecalcDocument = oDocument;
                        this.dMaxWidth = this._CalcMaxWidthByCell(oData.Table.CurCell);
                    }
                    break;
                }
            }
            if (oDocument.CurPos.Type === docpostype_DrawingObjects) {
                switch (oDocument.DrawingObjects.curState.id) {
                case STATES_ID_TEXT_ADD:
                    var text_object = oDocument.DrawingObjects.curState.textObject;
                    if (text_object != null && text_object.GraphicObj != null && text_object.GraphicObj.textBoxContent != null) {
                        oDocument = text_object.GraphicObj.textBoxContent;
                    }
                    break;
                case STATES_ID_TEXT_ADD_IN_GROUP:
                    text_object = oDocument.DrawingObjects.curState.textObject;
                    if (text_object != null && text_object.textBoxContent != null) {
                        oDocument = text_object.textBoxContent;
                    }
                    break;
                }
            }
            var Item = oDocument.Content[oDocument.CurPos.ContentPos];
            if (type_Table == Item.GetType() && null != Item.CurCell) {
                this.dMaxWidth = this._CalcMaxWidthByCell(Item.CurCell);
                oDocument = this._GetTargetDocument(Item.CurCell.Content);
            }
        } else {}
        return oDocument;
    },
    _CalcMaxWidthByCell: function (cell) {
        var row = cell.Row;
        var table = row.Table;
        var grid = table.TableGrid;
        var nGridBefore = 0;
        if (null != row.Pr && null != row.Pr.GridBefore) {
            nGridBefore = row.Pr.GridBefore;
        }
        var nCellIndex = cell.Index;
        var nCellGrid = 1;
        if (null != cell.Pr && null != cell.Pr.GridSpan) {
            nCellGrid = cell.Pr.GridSpan;
        }
        var nMarginLeft = 0;
        if (null != cell.Pr && null != cell.Pr.TableCellMar && null != cell.Pr.TableCellMar.Left && tblwidth_Mm == cell.Pr.TableCellMar.Left.Type && null != cell.Pr.TableCellMar.Left.W) {
            nMarginLeft = cell.Pr.TableCellMar.Left.W;
        } else {
            if (null != table.Pr && null != table.Pr.TableCellMar && null != table.Pr.TableCellMar.Left && tblwidth_Mm == table.Pr.TableCellMar.Left.Type && null != table.Pr.TableCellMar.Left.W) {
                nMarginLeft = table.Pr.TableCellMar.Left.W;
            }
        }
        var nMarginRight = 0;
        if (null != cell.Pr && null != cell.Pr.TableCellMar && null != cell.Pr.TableCellMar.Right && tblwidth_Mm == cell.Pr.TableCellMar.Right.Type && null != cell.Pr.TableCellMar.Right.W) {
            nMarginRight = cell.Pr.TableCellMar.Right.W;
        } else {
            if (null != table.Pr && null != table.Pr.TableCellMar && null != table.Pr.TableCellMar.Right && tblwidth_Mm == table.Pr.TableCellMar.Right.Type && null != table.Pr.TableCellMar.Right.W) {
                nMarginRight = table.Pr.TableCellMar.Right.W;
            }
        }
        var nPrevSumGrid = nGridBefore;
        for (var i = 0; i < nCellIndex; ++i) {
            var oTmpCell = row.Content[i];
            var nGridSpan = 1;
            if (null != cell.Pr && null != cell.Pr.GridSpan) {
                nGridSpan = cell.Pr.GridSpan;
            }
            nPrevSumGrid += nGridSpan;
        }
        var dCellWidth = 0;
        for (var i = nPrevSumGrid, length = grid.length; i < nPrevSumGrid + nCellGrid && i < length; ++i) {
            dCellWidth += grid[i];
        }
        if (dCellWidth - nMarginLeft - nMarginRight <= 0) {
            dCellWidth = 4;
        } else {
            dCellWidth -= nMarginLeft + nMarginRight;
        }
        return dCellWidth;
    },
    InsertInDocument: function () {
        var oDocument = this.oDocument;
        if (false == this.bNested) {
            this.oRecalcDocument.Remove(1, true, true);
        }
        var nInsertLength = this.aContent.length;
        if (nInsertLength > 0) {
            this.InsertInPlace(oDocument, this.aContent);
        }
        if (false == this.bNested && nInsertLength > 0) {
            this.oRecalcDocument.Recalculate();
            this.oLogicDocument.Document_UpdateInterfaceState();
        }
        window.GlobalPasteFlagCounter = 0;
    },
    InsertInPlace: function (oDoc, aNewContent) {
        var nNewContentLength = aNewContent.length;
        var Item = oDoc.Content[oDoc.CurPos.ContentPos];
        if (type_Paragraph == Item.GetType()) {
            if (true != this.bInBlock && 1 == nNewContentLength && type_Paragraph == aNewContent[0].GetType()) {
                var oInsertPar = aNewContent[0];
                var nContentLength = oInsertPar.Content.length;
                if (nContentLength > 2) {
                    var oFindObj = Item.Internal_FindBackward(Item.CurPos.ContentPos, [para_TextPr]);
                    var TextPr = null;
                    if (true === oFindObj.Found && para_TextPr === oFindObj.Type) {
                        TextPr = Item.Content[oFindObj.LetterPos].Copy();
                    } else {
                        TextPr = new ParaTextPr();
                    }
                    var nContentPos = Item.CurPos.ContentPos;
                    for (var i = 0; i < nContentLength - 2; ++i) {
                        var oCurInsItem = oInsertPar.Content[i];
                        if (para_Numbering != oCurInsItem.Type) {
                            Item.Internal_Content_Add(nContentPos, oCurInsItem);
                            nContentPos++;
                        }
                    }
                    Item.Internal_Content_Add(nContentPos, TextPr);
                }
                Item.RecalcInfo.Set_Type_0(pararecalc_0_All);
                Item.RecalcInfo.Set_Type_0_Spell(pararecalc_0_Spell_All);
                this.oRecalcDocument.ContentLastChangePos = this.oRecalcDocument.CurPos.ContentPos;
            } else {
                var LastPos = this.oRecalcDocument.CurPos.ContentPos;
                var LastPosCurDoc = oDoc.CurPos.ContentPos;
                var oSourceFirstPar = Item;
                var oSourceLastPar = new Paragraph(oDoc.DrawingDocument, oDoc, 0, 50, 50, X_Right_Field, Y_Bottom_Field);
                if (true !== oSourceFirstPar.Cursor_IsEnd()) {
                    oSourceFirstPar.Split(oSourceLastPar);
                }
                var oInsFirstPar = aNewContent[0];
                var oInsLastPar = null;
                if (nNewContentLength > 1) {
                    oInsLastPar = aNewContent[nNewContentLength - 1];
                }
                var nStartIndex = 0;
                var nEndIndex = nNewContentLength - 1;
                if (type_Paragraph == oInsFirstPar.GetType()) {
                    oInsFirstPar.CopyPr_Open(oSourceFirstPar);
                    oSourceFirstPar.Concat(oInsFirstPar);
                    nStartIndex++;
                } else {
                    if (type_Table == oInsFirstPar.GetType()) {
                        if (oSourceFirstPar.IsEmpty()) {
                            oSourceFirstPar = null;
                        }
                    }
                }
                if (null != oInsLastPar && type_Paragraph == oInsLastPar.GetType() && true != this.bInBlock) {
                    var nNewContentPos = oInsLastPar.Content.length - 2;
                    if (null != oInsLastPar) {
                        oSourceLastPar.CopyPr(oInsLastPar);
                    }
                    oInsLastPar.Concat(oSourceLastPar);
                    oInsLastPar.CurPos.ContentPos = nNewContentPos;
                    oSourceLastPar = oInsLastPar;
                    nEndIndex--;
                }
                for (var i = nStartIndex; i <= nEndIndex; ++i) {
                    var oElemToAdd = aNewContent[i];
                    LastPosCurDoc++;
                    oDoc.Internal_Content_Add(LastPosCurDoc, oElemToAdd);
                }
                if (null != oSourceLastPar) {
                    LastPosCurDoc++;
                    oDoc.Internal_Content_Add(LastPosCurDoc, oSourceLastPar);
                }
                if (null == oSourceFirstPar) {
                    oDoc.Internal_Content_Remove(LastPosCurDoc, 1);
                    LastPosCurDoc--;
                }
                this.oRecalcDocument.ContentLastChangePos = LastPos;
                Item.RecalcInfo.Set_Type_0(pararecalc_0_All);
                Item.RecalcInfo.Set_Type_0_Spell(pararecalc_0_Spell_All);
                oDoc.CurPos.ContentPos = LastPosCurDoc;
            }
        }
    },
    insertInPlace2: function (oDoc, aNewContent) {
        var nNewContentLength = aNewContent.length;
        oDoc.Remove(1, true, true);
        var Item = oDoc.Content[oDoc.CurPos.ContentPos];
        if (type_Paragraph == Item.GetType()) {
            if (1 == nNewContentLength && type_Paragraph == aNewContent[0].GetType() && Item.CurPos.ContentPos != 1) {
                var oInsertPar = aNewContent[0];
                var nContentLength = oInsertPar.Content.length;
                if (nContentLength > 2) {
                    var oFindObj = Item.Internal_FindBackward(Item.CurPos.ContentPos, [para_TextPr]);
                    var TextPr = null;
                    if (true === oFindObj.Found && para_TextPr === oFindObj.Type) {
                        TextPr = Item.Content[oFindObj.LetterPos].Copy();
                    } else {
                        TextPr = new ParaTextPr();
                    }
                    var nContentPos = Item.CurPos.ContentPos;
                    for (var i = 0; i < nContentLength - 2; ++i) {
                        var oCurInsItem = oInsertPar.Content[i];
                        if (para_Numbering != oCurInsItem.Type) {
                            Item.Internal_Content_Add(nContentPos, oCurInsItem);
                            nContentPos++;
                        }
                    }
                    Item.Internal_Content_Add(nContentPos, TextPr);
                }
                Item.RecalcInfo.Set_Type_0(pararecalc_0_All);
                Item.RecalcInfo.Set_Type_0_Spell(pararecalc_0_Spell_All);
                this.oRecalcDocument.ContentLastChangePos = this.oRecalcDocument.CurPos.ContentPos;
            } else {
                var LastPos = this.oRecalcDocument.CurPos.ContentPos;
                var LastPosCurDoc = oDoc.CurPos.ContentPos;
                var oSourceFirstPar = Item;
                var oSourceLastPar = new Paragraph(oDoc.DrawingDocument, oDoc, 0, 50, 50, X_Right_Field, Y_Bottom_Field);
                if (true !== oSourceFirstPar.Cursor_IsEnd() || oSourceFirstPar.IsEmpty()) {
                    oSourceFirstPar.Split(oSourceLastPar);
                }
                var oInsFirstPar = aNewContent[0];
                var oInsLastPar = null;
                if (nNewContentLength > 1) {
                    oInsLastPar = aNewContent[nNewContentLength - 1];
                }
                var nStartIndex = 0;
                var nEndIndex = nNewContentLength - 1;
                if (type_Paragraph == oInsFirstPar.GetType()) {
                    oInsFirstPar.CopyPr_Open(oSourceFirstPar);
                    oSourceFirstPar.Concat(oInsFirstPar);
                    if (isRealObject(oInsFirstPar.bullet)) {
                        oSourceFirstPar.setPresentationBullet(oInsFirstPar.bullet.createDuplicate());
                    }
                    nStartIndex++;
                } else {
                    if (type_Table == oInsFirstPar.GetType()) {
                        if (oSourceFirstPar.IsEmpty()) {
                            oSourceFirstPar = null;
                        }
                    }
                }
                if (null != oInsLastPar && type_Paragraph == oInsLastPar.GetType() && true != this.bInBlock) {
                    var nNewContentPos = oInsLastPar.Content.length - 2;
                    if (null != oInsLastPar) {
                        oSourceLastPar.CopyPr(oInsLastPar);
                    }
                    oInsLastPar.Concat(oSourceLastPar);
                    oInsLastPar.CurPos.ContentPos = nNewContentPos;
                    oSourceLastPar = oInsLastPar;
                    nEndIndex--;
                }
                for (var i = nStartIndex; i <= nEndIndex; ++i) {
                    var oElemToAdd = aNewContent[i];
                    LastPosCurDoc++;
                    oDoc.Internal_Content_Add(LastPosCurDoc, oElemToAdd);
                }
                if (null != oSourceLastPar) {
                    LastPosCurDoc++;
                    oDoc.Internal_Content_Add(LastPosCurDoc, oSourceLastPar);
                }
                if (null == oSourceFirstPar) {
                    oDoc.Internal_Content_Remove(LastPosCurDoc, 1);
                    LastPosCurDoc--;
                }
                this.oRecalcDocument.ContentLastChangePos = LastPos;
                Item.RecalcInfo.Set_Type_0(pararecalc_0_All);
                Item.RecalcInfo.Set_Type_0_Spell(pararecalc_0_Spell_All);
                oDoc.CurPos.ContentPos = LastPosCurDoc;
            }
        }
    },
    ReadFromBinary: function (sBase64) {
        window.global_pptx_content_loader.Clear();
        window.global_pptx_content_loader.Start_UseFullUrl();
        var openParams = {
            checkFileSize: false,
            charCount: 0,
            parCount: 0
        };
        var oBinaryFileReader = new BinaryFileReader(this.oDocument, openParams);
        oBinaryFileReader.stream = oBinaryFileReader.getbase64DecodedData(sBase64);
        oBinaryFileReader.ReadMainTable();
        var oReadResult = oBinaryFileReader.oReadResult;
        for (var i in oReadResult.numToNumClass) {
            var oNumClass = oReadResult.numToNumClass[i];
            var documentANum = this.oDocument.Numbering.AbstractNum;
            var isAlreadyContains = false;
            for (var n in documentANum) {
                var isEqual = documentANum[n].isEqual(oNumClass);
                if (isEqual == true) {
                    isAlreadyContains = true;
                    break;
                }
            }
            if (!isAlreadyContains) {
                this.oDocument.Numbering.Add_AbstractNum(oNumClass);
            } else {
                oReadResult.numToNumClass[i] = documentANum[n];
            }
        }
        for (var i = 0, length = oReadResult.paraNumPrs.length; i < length; ++i) {
            var numPr = oReadResult.paraNumPrs[i];
            var oNumClass = oReadResult.numToNumClass[numPr.NumId];
            if (null != oNumClass) {
                numPr.NumId = oNumClass.Get_Id();
            } else {
                numPr.NumId = 0;
            }
        }
        var isAlreadyContainsStyle;
        var api = this.api;
        var oStyleTypes = {
            par: 1,
            table: 2,
            lvl: 3
        };
        var addNewStyles = false;
        var fParseStyle = function (aStyles, oDocumentStyles, oReadResult, nStyleType) {
            if (aStyles == undefined) {
                return;
            }
            for (var i = 0, length = aStyles.length; i < length; ++i) {
                var elem = aStyles[i];
                var stylePaste = oReadResult.styles[elem.style];
                var isEqualName = null;
                if (null != stylePaste && null != stylePaste.style) {
                    for (var j in oDocumentStyles.Style) {
                        var styleDoc = oDocumentStyles.Style[j];
                        isAlreadyContainsStyle = styleDoc.isEqual(stylePaste.style);
                        if (styleDoc.Name == stylePaste.style.Name) {
                            isEqualName = j;
                        }
                        if (isAlreadyContainsStyle) {
                            if (oStyleTypes.par == nStyleType) {
                                elem.pPr.PStyle = j;
                            } else {
                                if (oStyleTypes.table == nStyleType) {
                                    elem.pPr.Set_TableStyle2(j);
                                } else {
                                    elem.pPr.PStyle = j;
                                }
                            }
                            break;
                        }
                    }
                    if (!isAlreadyContainsStyle && isEqualName != null) {
                        if (nStyleType == oStyleTypes.par || nStyleType == oStyleTypes.lvl) {
                            elem.pPr.PStyle = isEqualName;
                        } else {
                            if (nStyleType == oStyleTypes.table) {
                                elem.pPr.Set_TableStyle2(isEqualName);
                            }
                        }
                    } else {
                        if (!isAlreadyContainsStyle && isEqualName == null) {
                            var nStyleId = oDocumentStyles.Add(stylePaste.style);
                            if (nStyleType == oStyleTypes.par || nStyleType == oStyleTypes.lvl) {
                                elem.pPr.PStyle = nStyleId;
                            } else {
                                if (nStyleType == oStyleTypes.table) {
                                    elem.pPr.Set_TableStyle2(nStyleId);
                                }
                            }
                            addNewStyles = true;
                        }
                    }
                }
            }
        };
        fParseStyle(oBinaryFileReader.oReadResult.paraStyles, this.oDocument.Styles, oBinaryFileReader.oReadResult, oStyleTypes.par);
        fParseStyle(oBinaryFileReader.oReadResult.tableStyles, this.oDocument.Styles, oBinaryFileReader.oReadResult, oStyleTypes.table);
        fParseStyle(oBinaryFileReader.oReadResult.lvlStyles, this.oDocument.Styles, oBinaryFileReader.oReadResult, oStyleTypes.lvl);
        var aContent = oBinaryFileReader.oReadResult.DocumentContent;
        for (var i = 0, length = oBinaryFileReader.oReadResult.aPostOpenStyleNumCallbacks.length; i < length; ++i) {
            oBinaryFileReader.oReadResult.aPostOpenStyleNumCallbacks[i].call();
        }
        if (oReadResult.bLastRun) {
            this.bInBlock = false;
        } else {
            this.bInBlock = true;
        }
        var AllFonts = new Object();
        this.oDocument.Numbering.Document_Get_AllFontNames(AllFonts);
        this.oDocument.Styles.Document_Get_AllFontNames(AllFonts);
        for (var Index = 0, Count = aContent.length; Index < Count; Index++) {
            aContent[Index].Document_Get_AllFontNames(AllFonts);
        }
        var aPrepeareFonts = [];
        for (var i in AllFonts) {
            aPrepeareFonts.push(new CFont(i, 0, "", 0));
        }
        var oPastedImagesUnique = {};
        var aPastedImages = window.global_pptx_content_loader.End_UseFullUrl();
        for (var i = 0, length = aPastedImages.length; i < length; ++i) {
            var elem = aPastedImages[i];
            oPastedImagesUnique[elem.Url] = 1;
        }
        var aPrepeareImages = [];
        for (var i in oPastedImagesUnique) {
            aPrepeareImages.push(i);
        }
        return {
            content: aContent,
            fonts: aPrepeareFonts,
            images: aPrepeareImages,
            bAddNewStyles: addNewStyles,
            aPastedImages: aPastedImages
        };
    },
    Start: function (node) {
        var oThis = this;
        var content = this.content;
        this.oRootNode = node;
        this._Prepeare(node, function () {
            oThis.aContent = new Array();
            var arrShapes = [],
            arrImages = [],
            arrTables = [];
            History.TurnOff();
            var shape = new CShape(null);
            shape.drawingObjects = content.Parent.shape.drawingObjects;
            shape.setTextBody(new CTextBody(shape));
            arrShapes.push(shape);
            var ret = oThis._ExecutePresentation(node, {},
            true, true, false, arrShapes, arrImages, arrTables);
            for (var i = 0; i < arrShapes.length; ++i) {
                shape = arrShapes[i];
                if (shape.txBody.content.Content.length > 1) {
                    shape.txBody.content.Internal_Content_Remove(0, 1);
                }
            }
            History.TurnOn();
            var api = asc["editor"];
            var arrFonts = [];
            for (var key in oThis.fontMap) {
                arrFonts.push(key);
            }
            var callback = function () {
                oThis.insertInPlace2(content, arrShapes[0].txBody.content.Content);
                oThis.drawingObjectsController.curState.textObject.txBody.OnContentRecalculate();
                History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_OnContentRecalculateRedo, null, null, new UndoRedoDataGraphicObjects(oThis.drawingObjectsController.curState.textObject.txBody.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
                oThis.drawingObjectsController.drawingObjects.showDrawingObjects(true);
            };
            if (arrFonts.length > 0) {
                api._loadFonts(arrFonts, callback);
            } else {
                callback();
            }
            node.blur();
            node.style.display = ELEMENT_DISPAY_STYLE;
        });
    },
    ReadPresentationText: function (stream) {
        var loader = new BinaryPPTYLoader();
        loader.Start_UseFullUrl();
        loader.stream = stream;
        loader.presentation = editor.WordControl.m_oLogicDocument;
        var presentation = editor.WordControl.m_oLogicDocument;
        var shape = new CShape(presentation.Slides[presentation.CurPage]);
        shape.setTextBody(new CTextBody(shape));
        var count = stream.GetULong();
        shape.txBody.content.Internal_Content_RemoveAll();
        for (var i = 0; i < count; ++i) {
            loader.stream.Skip2(1);
            var _paragraph = loader.ReadParagraph(shape.txBody.content);
            shape.txBody.content.Internal_Content_Add(shape.txBody.content.Content.length, _paragraph);
        }
        return shape;
    },
    ReadPresentationShapes: function (stream) {
        var loader = new BinaryPPTYLoader();
        loader.Start_UseFullUrl();
        loader.stream = stream;
        loader.presentation = editor.WordControl.m_oLogicDocument;
        var presentation = editor.WordControl.m_oLogicDocument;
        var count = stream.GetULong();
        var arr_shapes = [];
        for (var i = 0; i < count; ++i) {
            loader.TempMainObject = presentation.Slides[presentation.CurPage];
            var style_index = null;
            if (!loader.stream.GetBool()) {
                if (loader.stream.GetBool()) {
                    style_index = stream.GetULong();
                }
            }
            arr_shapes.push(loader.ReadGraphicObject());
            if (isRealNumber(style_index)) {
                if (arr_shapes[arr_shapes.length - 1] instanceof CGraphicFrame) {
                    if (loader.presentation.globalTableStyles[style_index]) {
                        arr_shapes[arr_shapes.length - 1].graphicObject.setStyleIndex(style_index);
                    }
                }
            }
            if (arr_shapes[arr_shapes.length - 1] instanceof CGraphicFrame) {
                arr_shapes[arr_shapes.length - 1].setGraphicObject(arr_shapes[arr_shapes.length - 1].graphicObject.Copy(arr_shapes[arr_shapes.length - 1]));
            }
            if (typeof CChartAsGroup != "undefined" && arr_shapes[arr_shapes.length - 1] instanceof CChartAsGroup) {
                var chart = arr_shapes[arr_shapes.length - 1];
                var copy = chart.copy(chart.parent);
                arr_shapes[arr_shapes.length - 1] = copy;
            }
        }
        return {
            arrShapes: arr_shapes,
            arrImages: loader.End_UseFullUrl()
        };
    },
    ReadPresentationSlides: function (stream) {
        var loader = new BinaryPPTYLoader();
        loader.Start_UseFullUrl();
        loader.stream = stream;
        loader.presentation = editor.WordControl.m_oLogicDocument;
        var presentation = editor.WordControl.m_oLogicDocument;
        var count = stream.GetULong();
        var arr_slides = [];
        for (var i = 0; i < count; ++i) {
            arr_slides.push(loader.ReadSlide(0));
        }
        return arr_slides;
    },
    ReadSlide: function (stream) {
        var loader = new BinaryPPTYLoader();
        loader.Start_UseFullUrl();
        loader.stream = stream;
        loader.presentation = editor.WordControl.m_oLogicDocument;
        var presentation = editor.WordControl.m_oLogicDocument;
        return loader.ReadSlide(0);
    },
    _Prepeare: function (node, fCallback) {
        var oThis = this;
        fCallback();
    },
    _Prepeare_recursive: function (node, bIgnoreStyle) {
        var nodeName = node.nodeName.toLowerCase();
        var nodeType = node.nodeType;
        if (!bIgnoreStyle) {
            if (Node.TEXT_NODE == nodeType) {
                var defaultView = node.ownerDocument.defaultView;
                var computedStyle = defaultView.getComputedStyle(node.parentNode, null);
                if (computedStyle) {
                    var fontFamily = computedStyle.getPropertyValue("font-family");
                    var sNewFF;
                    var nIndex = fontFamily.indexOf(",");
                    if (-1 != nIndex) {
                        sNewFF = fontFamily.substring(0, nIndex);
                    } else {
                        sNewFF = fontFamily;
                    }
                    var nLength = sNewFF.length;
                    if (nLength >= 2) {
                        var nStart = 0;
                        var nStop = nLength;
                        var cFirstChar = sNewFF[0];
                        var cLastChar = sNewFF[nLength - 1];
                        var bTrim = false;
                        if ("'" == cFirstChar || '"' == cFirstChar) {
                            bTrim = true;
                            nStart = 1;
                        }
                        if ("'" == cLastChar || '"' == cLastChar) {
                            bTrim = true;
                            nStop = nLength - 1;
                        }
                        if (bTrim) {
                            sNewFF = sNewFF.substring(nStart, nStop);
                        }
                    }
                    this.oFonts[fontFamily] = {
                        Name: sNewFF,
                        Index: -1
                    };
                }
            } else {}
        }
        for (var i = 0, length = node.childNodes.length; i < length; i++) {
            var child = node.childNodes[i];
            var child_nodeType = child.nodeType;
            if (! (Node.ELEMENT_NODE == child_nodeType || Node.TEXT_NODE == child_nodeType)) {
                continue;
            }
            if (Node.TEXT_NODE == child.nodeType) {
                var value = child.nodeValue;
                if (!value) {
                    continue;
                }
                value = value.replace(/(\r|\t|\n)/g, "");
                if ("" == value) {
                    continue;
                }
            }
            this._Prepeare_recursive(child, false);
        }
    },
    _IsBlockElem: function (name) {
        if ("p" == name || "div" == name || "ul" == name || "ol" == name || "li" == name || "table" == name || "tbody" == name || "tr" == name || "td" == name || "th" == name || "h1" == name || "h2" == name || "h3" == name || "h4" == name || "h5" == name || "h6" == name || "center" == name) {
            return true;
        }
        return false;
    },
    _ValueToMm: function (value) {
        var obj = this._ValueToMmType(value);
        if (obj && "%" != obj.type && "none" != obj.type) {
            return obj.val;
        }
        return null;
    },
    _ValueToMmType: function (value) {
        var oVal = parseFloat(value);
        var oType;
        if (!isNaN(oVal)) {
            if (-1 != value.indexOf("%")) {
                oType = "%";
                oVal /= 100;
            } else {
                if (-1 != value.indexOf("px")) {
                    oType = "px";
                    oVal *= g_dKoef_pix_to_mm;
                } else {
                    if (-1 != value.indexOf("in")) {
                        oType = "in";
                        oVal *= g_dKoef_in_to_mm;
                    } else {
                        if (-1 != value.indexOf("cm")) {
                            oType = "cm";
                            oVal *= 10;
                        } else {
                            if (-1 != value.indexOf("mm")) {
                                oType = "mm";
                            } else {
                                if (-1 != value.indexOf("pt")) {
                                    oType = "pt";
                                    oVal *= g_dKoef_pt_to_mm;
                                } else {
                                    if (-1 != value.indexOf("pc")) {
                                        oType = "pc";
                                        oVal *= g_dKoef_pc_to_mm;
                                    } else {
                                        oType = "none";
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return {
                val: oVal,
                type: oType
            };
        }
        return null;
    },
    _ParseColor: function (color) {
        if (!color || color.length == 0) {
            return null;
        }
        if ("transparent" == color) {
            return null;
        }
        if ("aqua" == color) {
            return new CDocumentColor(0, 255, 255);
        } else {
            if ("black" == color) {
                return new CDocumentColor(0, 0, 0);
            } else {
                if ("blue" == color) {
                    return new CDocumentColor(0, 0, 255);
                } else {
                    if ("fuchsia" == color) {
                        return new CDocumentColor(255, 0, 255);
                    } else {
                        if ("gray" == color) {
                            return new CDocumentColor(128, 128, 128);
                        } else {
                            if ("green" == color) {
                                return new CDocumentColor(0, 128, 0);
                            } else {
                                if ("lime" == color) {
                                    return new CDocumentColor(0, 255, 0);
                                } else {
                                    if ("maroon" == color) {
                                        return new CDocumentColor(128, 0, 0);
                                    } else {
                                        if ("navy" == color) {
                                            return new CDocumentColor(0, 0, 128);
                                        } else {
                                            if ("olive" == color) {
                                                return new CDocumentColor(128, 128, 0);
                                            } else {
                                                if ("purple" == color) {
                                                    return new CDocumentColor(128, 0, 128);
                                                } else {
                                                    if ("red" == color) {
                                                        return new CDocumentColor(255, 0, 0);
                                                    } else {
                                                        if ("silver" == color) {
                                                            return new CDocumentColor(192, 192, 192);
                                                        } else {
                                                            if ("teal" == color) {
                                                                return new CDocumentColor(0, 128, 128);
                                                            } else {
                                                                if ("white" == color) {
                                                                    return new CDocumentColor(255, 255, 255);
                                                                } else {
                                                                    if ("yellow" == color) {
                                                                        return new CDocumentColor(255, 255, 0);
                                                                    } else {
                                                                        if (0 == color.indexOf("#")) {
                                                                            var hex = color.substring(1);
                                                                            if (hex.length == 3) {
                                                                                hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
                                                                            }
                                                                            if (hex.length == 6) {
                                                                                var r = parseInt("0x" + hex.substring(0, 2));
                                                                                var g = parseInt("0x" + hex.substring(2, 4));
                                                                                var b = parseInt("0x" + hex.substring(4, 6));
                                                                                return new CDocumentColor(r, g, b);
                                                                            }
                                                                        }
                                                                        if (0 == color.indexOf("rgb")) {
                                                                            var nStart = color.indexOf("(");
                                                                            var nEnd = color.indexOf(")");
                                                                            if (-1 != nStart && -1 != nEnd && nStart < nEnd) {
                                                                                var temp = color.substring(nStart + 1, nEnd);
                                                                                var aParems = temp.split(",");
                                                                                if (aParems.length >= 3) {
                                                                                    if (aParems.length >= 4) {
                                                                                        var oA = this._ValueToMmType(aParems[3]);
                                                                                        if (0 == oA.val) {
                                                                                            return null;
                                                                                        }
                                                                                    }
                                                                                    var oR = this._ValueToMmType(aParems[0]);
                                                                                    var oG = this._ValueToMmType(aParems[1]);
                                                                                    var oB = this._ValueToMmType(aParems[2]);
                                                                                    var r, g, b;
                                                                                    if (oR && "%" == oR.type) {
                                                                                        r = parseInt(255 * oR.val / 100);
                                                                                    } else {
                                                                                        r = oR.val;
                                                                                    }
                                                                                    if (oG && "%" == oG.type) {
                                                                                        g = parseInt(255 * oG.val / 100);
                                                                                    } else {
                                                                                        g = oG.val;
                                                                                    }
                                                                                    if (oB && "%" == oB.type) {
                                                                                        b = parseInt(255 * oB.val / 100);
                                                                                    } else {
                                                                                        b = oB.val;
                                                                                    }
                                                                                    return new CDocumentColor(r, g, b);
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
        return null;
    },
    _isEmptyProperty: function (prop) {
        var bIsEmpty = true;
        for (var i in prop) {
            if (null != prop[i]) {
                bIsEmpty = false;
                break;
            }
        }
        return bIsEmpty;
    },
    _set_pPr: function (node, Para, pNoHtmlPr) {
        if (node != this.oRootNode) {
            while (false == this._IsBlockElem(node.nodeName.toLowerCase())) {
                if (this.oRootNode != node.parentNode) {
                    node = node.parentNode;
                } else {
                    break;
                }
            }
        }
        var oDocument = this.oDocument;
        if (null != pNoHtmlPr.hLevel) {
            Para.Style_Add(oDocument.Styles.Get_Default_Heading(pNoHtmlPr.hLevel));
        }
        var pPr = Para.Pr;
        var oNewBorder = {
            Left: null,
            Top: null,
            Right: null,
            Bottom: null,
            Between: null
        };
        var sBorder = pNoHtmlPr["mso-border-alt"];
        if (null != sBorder) {
            var oNewBrd = this._ExecuteParagraphBorder(sBorder);
            oNewBorder.Left = oNewBrd;
            oNewBorder.Top = oNewBrd.Copy();
            oNewBorder.Right = oNewBrd.Copy();
            oNewBorder.Bottom = oNewBrd.Copy();
        } else {
            sBorder = pNoHtmlPr["mso-border-left-alt"];
            if (null != sBorder) {
                var oNewBrd = this._ExecuteParagraphBorder(sBorder);
                oNewBorder.Left = oNewBrd;
            }
            sBorder = pNoHtmlPr["mso-border-top-alt"];
            if (null != sBorder) {
                var oNewBrd = this._ExecuteParagraphBorder(sBorder);
                oNewBorder.Top = oNewBrd;
            }
            sBorder = pNoHtmlPr["mso-border-right-alt"];
            if (null != sBorder) {
                var oNewBrd = this._ExecuteParagraphBorder(sBorder);
                oNewBorder.Right = oNewBrd;
            }
            sBorder = pNoHtmlPr["mso-border-bottom-alt"];
            if (null != sBorder) {
                var oNewBrd = this._ExecuteParagraphBorder(sBorder);
                oNewBorder.Bottom = oNewBrd;
            }
        }
        sBorder = pNoHtmlPr["mso-border-between"];
        if (null != sBorder) {
            var oNewBrd = this._ExecuteParagraphBorder(sBorder);
            oNewBorder.Between = oNewBrd;
        }
        var defaultView = node.ownerDocument.defaultView;
        var computedStyle = defaultView.getComputedStyle(node, null);
        if (computedStyle) {
            var Ind = new CParaInd();
            var margin_left = computedStyle.getPropertyValue("margin-left");
            if (margin_left && null != (margin_left = this._ValueToMm(margin_left))) {
                Ind.Left = margin_left;
            }
            var margin_right = computedStyle.getPropertyValue("margin-right");
            if (margin_right && null != (margin_right = this._ValueToMm(margin_right))) {
                Ind.Right = margin_right;
            }
            if (null != Ind.Left && null != Ind.Right) {
                var dif = Page_Width - X_Left_Margin - X_Right_Margin - Ind.Left - Ind.Right;
                if (dif < 30) {
                    Ind.Right = Page_Width - X_Left_Margin - X_Right_Margin - Ind.Left - 30;
                }
            }
            var text_indent = computedStyle.getPropertyValue("text-indent");
            if (text_indent && null != (text_indent = this._ValueToMm(text_indent))) {
                Ind.FirstLine = text_indent;
            }
            if (false == this._isEmptyProperty(Ind)) {
                Para.Set_Ind(Ind);
            }
            var text_align = computedStyle.getPropertyValue("text-align");
            if (text_align) {
                var Jc = null;
                if (-1 != text_align.indexOf("center")) {
                    Jc = align_Center;
                } else {
                    if (-1 != text_align.indexOf("right")) {
                        Jc = align_Right;
                    } else {
                        if (-1 != text_align.indexOf("justify")) {
                            Jc = align_Justify;
                        }
                    }
                }
                if (null != Jc) {
                    Para.Set_Align(Jc, false);
                }
            }
            var line_height = computedStyle.getPropertyValue("line-height");
            if (null != line_height) {
                var Spacing = new CParaSpacing();
                if ("normal" == line_height || "1px" == line_height) {
                    Spacing.Line = 1;
                    Spacing.LineRule = linerule_Auto;
                } else {
                    var obj = this._ValueToMmType(line_height);
                    if (obj) {
                        if ("%" == obj.type) {
                            Spacing.Line = obj.val;
                            Spacing.LineRule = linerule_Auto;
                        } else {
                            var font_size = computedStyle.getPropertyValue("font-size");
                            if (font_size && null != (font_size = this._ValueToMm(font_size))) {
                                if (font_size != 0) {
                                    Spacing.Line = parseInt(100 * obj.val / font_size) / 100;
                                }
                                Spacing.LineRule = linerule_Auto;
                            }
                        }
                    }
                }
            }
            var margin_top = computedStyle.getPropertyValue("margin-top");
            if (margin_top && null != (margin_top = this._ValueToMm(margin_top))) {
                Spacing.Before = margin_top;
            }
            var margin_bottom = computedStyle.getPropertyValue("margin-bottom");
            if (margin_bottom && null != (margin_bottom = this._ValueToMm(margin_bottom))) {
                Spacing.After = margin_bottom;
            }
            if (false == this._isEmptyProperty(Spacing)) {
                Para.Set_Spacing(Spacing);
            }
            var background_color = null;
            var oTempNode = node;
            while (true) {
                var tempComputedStyle = defaultView.getComputedStyle(oTempNode, null);
                if (null == tempComputedStyle) {
                    break;
                }
                background_color = tempComputedStyle.getPropertyValue("background-color");
                if (null != background_color && (background_color = this._ParseColor(background_color))) {
                    break;
                }
                oTempNode = oTempNode.parentNode;
                if (this.oRootNode == oTempNode || "body" == oTempNode.nodeName.toLowerCase() || true == this._IsBlockElem(oTempNode.nodeName.toLowerCase())) {
                    break;
                }
            }
            if (g_bIsDocumentCopyPaste) {
                if (background_color) {
                    var Shd = new CDocumentShd();
                    Shd.Value = shd_Clear;
                    Shd.Color = background_color;
                    Para.Set_Shd(Shd);
                }
            }
            if (null == oNewBorder.Left) {
                oNewBorder.Left = this._ExecuteBorder(computedStyle, node, "left", "Left", false);
            }
            if (null == oNewBorder.Top) {
                oNewBorder.Top = this._ExecuteBorder(computedStyle, node, "top", "Top", false);
            }
            if (null == oNewBorder.Right) {
                oNewBorder.Right = this._ExecuteBorder(computedStyle, node, "left", "Left", false);
            }
            if (null == oNewBorder.Bottom) {
                oNewBorder.Bottom = this._ExecuteBorder(computedStyle, node, "bottom", "Bottom", false);
            }
        }
        if (false == this._isEmptyProperty(oNewBorder)) {
            Para.Set_Borders(oNewBorder);
        }
        var pagination = pNoHtmlPr["mso-pagination"];
        if (pagination) {
            if ("none" == pagination) {} else {
                if (-1 != pagination.indexOf("widow-orphan") && -1 != pagination.indexOf("lines-together")) {
                    Para.Set_KeepLines(true);
                } else {
                    if (-1 != pagination.indexOf("none") && -1 != pagination.indexOf("lines-together")) {
                        Para.Set_KeepLines(true);
                    }
                }
            }
        }
        if ("avoid" == pNoHtmlPr["page-break-after"]) {}
        if ("always" == pNoHtmlPr["page-break-before"]) {
            Para.Set_PageBreakBefore(true);
        }
        var tab_stops = pNoHtmlPr["tab-stops"];
        if (tab_stops && "" != pNoHtmlPr["tab-stops"]) {
            var aTabs = tab_stops.split(" ");
            var nTabLen = aTabs.length;
            if (nTabLen > 0) {
                var Tabs = new CParaTabs();
                for (var i = 0; i < nTabLen; i++) {
                    var val = this._ValueToMm(aTabs[i]);
                    if (val) {
                        Tabs.Add(new CParaTab(tab_Left, val));
                    }
                }
                Para.Set_Tabs(Tabs);
            }
        }
        if (g_bIsDocumentCopyPaste) {
            if (true == pNoHtmlPr.bNum) {
                var num = numbering_numfmt_Bullet;
                if (null != pNoHtmlPr.numType) {
                    num = pNoHtmlPr.numType;
                }
                var type = pNoHtmlPr["list-style-type"];
                if (type) {
                    switch (type) {
                    case "disc":
                        num = numbering_numfmt_Bullet;
                        break;
                    case "decimal":
                        num = numbering_numfmt_Decimal;
                        break;
                    case "lower-roman":
                        num = numbering_numfmt_LowerRoman;
                        break;
                    case "upper-roman":
                        num = numbering_numfmt_UpperRoman;
                        break;
                    case "lower-alpha":
                        num = numbering_numfmt_LowerLetter;
                        break;
                    case "upper-alpha":
                        num = numbering_numfmt_UpperLetter;
                        break;
                    }
                }
                var NumId = null;
                if (this.aContent.length > 1) {
                    var prevElem = this.aContent[this.aContent.length - 2];
                    if (null != prevElem && type_Paragraph === prevElem.GetType()) {
                        var PrevNumPr = prevElem.Numbering_Get();
                        if (null != PrevNumPr && true === this.oLogicDocument.Numbering.Check_Format(PrevNumPr.NumId, PrevNumPr.Lvl, num)) {
                            NumId = PrevNumPr.NumId;
                        }
                    }
                }
                if (null == NumId) {
                    NumId = this.oLogicDocument.Numbering.Create_AbstractNum();
                    NumLvl = 0;
                    var AbstractNum = this.oLogicDocument.Numbering.Get_AbstractNum(NumId);
                    AbstractNum.Create_Default_Bullet();
                    switch (num) {
                    case numbering_numfmt_Decimal:
                        AbstractNum.Set_Lvl_Numbered_2(0);
                        break;
                    case numbering_numfmt_LowerRoman:
                        AbstractNum.Set_Lvl_Numbered_5(0);
                        break;
                    case numbering_numfmt_UpperRoman:
                        AbstractNum.Set_Lvl_Numbered_9(0);
                        break;
                    case numbering_numfmt_LowerLetter:
                        AbstractNum.Set_Lvl_Numbered_8(0);
                        break;
                    case numbering_numfmt_UpperLetter:
                        AbstractNum.Set_Lvl_Numbered_6(0);
                        break;
                    }
                    var oFirstTextChild = node;
                    while (true) {
                        var bContinue = false;
                        for (var i = 0, length = oFirstTextChild.childNodes.length; i < length; i++) {
                            var child = oFirstTextChild.childNodes[i];
                            var nodeType = child.nodeType;
                            if (! (Node.ELEMENT_NODE == nodeType || Node.TEXT_NODE == nodeType)) {
                                continue;
                            }
                            if (Node.TEXT_NODE == child.nodeType) {
                                var value = child.nodeValue;
                                if (!value) {
                                    continue;
                                }
                                value = value.replace(/(\r|\t|\n)/g, "");
                                if ("" == value) {
                                    continue;
                                }
                            }
                            if (Node.ELEMENT_NODE == nodeType) {
                                oFirstTextChild = child;
                                bContinue = true;
                                break;
                            }
                        }
                        if (false == bContinue) {
                            break;
                        }
                    }
                    if (node != oFirstTextChild) {
                        var oLvl = AbstractNum.Lvl[0];
                        var oTextPr = this._read_rPr(oFirstTextChild);
                        if (numbering_numfmt_Bullet == num) {
                            oTextPr.RFonts = oLvl.TextPr.RFonts.Copy();
                        }
                        AbstractNum.Apply_TextPr(0, oTextPr);
                    }
                }
                Para.Numbering_Add(NumId, 0);
            } else {
                var numPr = Para.Numbering_Get();
                if (numPr) {
                    Para.Numbering_Remove();
                }
            }
        } else {
            if (true == pNoHtmlPr.bNum) {
                var num = numbering_presentationnumfrmt_Char;
                if (null != pNoHtmlPr.numType) {
                    num = pNoHtmlPr.numType;
                }
                var type = pNoHtmlPr["list-style-type"];
                if (type) {
                    switch (type) {
                    case "disc":
                        num = numbering_presentationnumfrmt_Char;
                        break;
                    case "decimal":
                        num = numbering_presentationnumfrmt_ArabicPeriod;
                        break;
                    case "lower-roman":
                        num = numbering_presentationnumfrmt_RomanLcPeriod;
                        break;
                    case "upper-roman":
                        num = numbering_presentationnumfrmt_RomanUcPeriod;
                        break;
                    case "lower-alpha":
                        num = numbering_presentationnumfrmt_AlphaLcPeriod;
                        break;
                    case "upper-alpha":
                        num = numbering_presentationnumfrmt_AlphaUcPeriod;
                        break;
                    default:
                        num = numbering_presentationnumfrmt_Char;
                    }
                }
                var _bullet = new CPresentationBullet();
                _bullet.m_nType = num;
                if (num == numbering_presentationnumfrmt_Char) {
                    _bullet.m_sChar = "�";
                }
                _bullet.m_nStartAt = 1;
                Para.Add_PresentationNumbering2(_bullet);
            } else {
                Para.Remove_PresentationNumbering();
            }
        }
        Para.CompiledPr.NeedRecalc = true;
    },
    _commit_rPr: function (node) {
        var rPr = this._read_rPr(node);
        if (false == Common_CmpObj2(this.oCur_rPr, rPr)) {
            this._Paragraph_Add(new ParaTextPr(rPr));
            this.oCur_rPr = rPr;
        }
    },
    _read_rPr: function (node) {
        var oDocument = this.oDocument;
        var rPr = new CTextPr();
        rPr.Set_FromObject({
            Bold: false,
            Italic: false,
            Underline: false,
            Strikeout: false,
            RFonts: {
                Ascii: {
                    Name: "Arial",
                    Index: -1
                },
                EastAsia: {
                    Name: "Arial",
                    Index: -1
                },
                HAnsi: {
                    Name: "Arial",
                    Index: -1
                },
                CS: {
                    Name: "Arial",
                    Index: -1
                }
            },
            FontSize: 11,
            Color: {
                r: 0,
                g: 0,
                b: 0
            },
            VertAlign: vertalign_Baseline,
            HighLight: highlight_None
        });
        var defaultView = node.ownerDocument.defaultView;
        var computedStyle = defaultView.getComputedStyle(node, null);
        if (computedStyle) {
            var font_family = computedStyle.getPropertyValue("font-family");
            if (font_family && "" != font_family) {
                font_family = font_family.replace(/"/g, "");
                font_family = font_family.replace(/'/g, "");
                font_family = font_family.split(",")[0];
                var fonts_array = font_family.split(",");
                var font_name = "Calibri";
                var api = asc["editor"];
                for (var i = 0; i < fonts_array.length; ++i) {
                    var fontName = fonts_array[i];
                    if (api.FontLoader.map_font_index[fontName] != undefined) {
                        font_name = fontName;
                        break;
                    }
                    var arrName = fontName.toLowerCase().split(" ");
                    var newFontName = "";
                    for (var j = 0; j < arrName.length; j++) {
                        arrName[j] = arrName[j].substr(0, 1).toUpperCase() + arrName[j].substr(1).toLowerCase();
                        if (j == arrName.length - 1) {
                            newFontName += arrName[j];
                        } else {
                            newFontName += arrName[j] + " ";
                        }
                    }
                    if (api.FontLoader.map_font_index[newFontName] != undefined) {
                        font_name = newFontName;
                        break;
                    }
                }
                this.fontMap[font_name] = true;
                if (null != font_name) {
                    rPr.RFonts.Ascii = {
                        Name: font_name,
                        Index: -1
                    };
                    rPr.RFonts.HAnsi = {
                        Name: font_name,
                        Index: -1
                    };
                    rPr.RFonts.CS = {
                        Name: font_name,
                        Index: -1
                    };
                    rPr.RFonts.EastAsia = {
                        Name: font_name,
                        Index: -1
                    };
                } else {
                    rPr.RFonts = undefined;
                }
            }
            var font_size = node.style.fontSize;
            if (!font_size) {
                font_size = computedStyle.getPropertyValue("font-size");
            }
            if (font_size) {
                var obj = this._ValueToMmType(font_size);
                if (obj && "%" != obj.type && "none" != obj.type) {
                    font_size = obj.val;
                    if ("px" == obj.type && false == this.bIsDoublePx) {
                        font_size = Math.round(font_size * g_dKoef_mm_to_pt);
                    } else {
                        font_size = Math.round(2 * font_size * g_dKoef_mm_to_pt) / 2;
                    }
                    rPr.FontSize = font_size;
                }
            }
            var font_weight = computedStyle.getPropertyValue("font-weight");
            if (font_weight) {
                if ("bold" == font_weight || "bolder" == font_weight || 400 < font_weight) {
                    rPr.Bold = true;
                }
            }
            var font_style = computedStyle.getPropertyValue("font-style");
            if ("italic" == font_style) {
                rPr.Italic = true;
            }
            var color = computedStyle.getPropertyValue("color");
            if (color && (color = this._ParseColor(color))) {
                rPr.Color = color;
            }
            var background_color = null;
            var underline = null;
            var Strikeout = null;
            var vertical_align = null;
            var oTempNode = node;
            while (true) {
                var tempComputedStyle = defaultView.getComputedStyle(oTempNode, null);
                if (null == tempComputedStyle) {
                    break;
                }
                if (null == underline || null == Strikeout) {
                    text_decoration = tempComputedStyle.getPropertyValue("text-decoration");
                    if (text_decoration) {
                        if (-1 != text_decoration.indexOf("underline")) {
                            underline = true;
                        }
                        if (-1 != text_decoration.indexOf("line-through")) {
                            Strikeout = true;
                        }
                    }
                }
                if (null == background_color) {
                    background_color = tempComputedStyle.getPropertyValue("background-color");
                    if (background_color) {
                        background_color = this._ParseColor(background_color);
                    } else {
                        background_color = null;
                    }
                }
                if (null == vertical_align || "baseline" == vertical_align) {
                    vertical_align = tempComputedStyle.getPropertyValue("vertical-align");
                    if (!vertical_align) {
                        vertical_align = null;
                    }
                }
                if (vertical_align && background_color && Strikeout && underline) {
                    break;
                }
                oTempNode = oTempNode.parentNode;
                if (this.oRootNode == oTempNode || "body" == oTempNode.nodeName.toLowerCase() || true == this._IsBlockElem(oTempNode.nodeName.toLowerCase())) {
                    break;
                }
            }
            delete rPr.HighLight;
            if (null != underline) {
                rPr.Underline = underline;
            }
            if (null != Strikeout) {
                rPr.Strikeout = Strikeout;
            }
            switch (vertical_align) {
            case "sub":
                rPr.VertAlign = vertalign_SubScript;
                break;
            case "super":
                rPr.VertAlign = vertalign_SuperScript;
                break;
            }
        }
        return rPr;
    },
    _parseCss: function (sStyles, pPr) {
        var aStyles = sStyles.split(";");
        if (aStyles) {
            for (var i = 0, length = aStyles.length; i < length; i++) {
                var style = aStyles[i];
                var aPair = style.split(":");
                if (aPair && aPair.length > 1) {
                    var prop_name = trimString(aPair[0]);
                    var prop_value = trimString(aPair[1]);
                    if (null != this.MsoStyles[prop_name]) {
                        pPr[prop_name] = prop_value;
                    }
                }
            }
        }
    },
    _PrepareContent: function () {
        if (this.aContent.length > 0) {
            var last = this.aContent[this.aContent.length - 1];
            if (type_Table == last.GetType()) {
                this._Add_NewParagraph();
            }
        }
    },
    _AddNextPrevToContent: function (oDoc) {
        var prev = null;
        for (var i = 0, length = this.aContent.length; i < length; ++i) {
            var cur = this.aContent[i];
            cur.Set_DocumentPrev(prev);
            cur.Parent = oDoc;
            if (prev) {
                prev.Set_DocumentNext(cur);
            }
            prev = cur;
        }
    },
    _Paragraph_Add: function (elem) {
        if (null != this.oCurPar) {
            this.oCurPar.Internal_Content_Add(this.oCurParContentPos, elem);
            this.oCurParContentPos++;
        }
    },
    _Add_NewParagraph: function () {
        this.oCurPar = new Paragraph(this.oDocument.DrawingDocument, this.oDocument, 0, 50, 50, X_Right_Field, Y_Bottom_Field);
        this.oCurParContentPos = this.oCurPar.CurPos.ContentPos;
        this.aContent.push(this.oCurPar);
        this.oCur_rPr = new CTextPr();
    },
    _Execute_AddParagraph: function (node, pPr) {
        this._Add_NewParagraph();
        this._set_pPr(node, this.oCurPar, pPr);
    },
    _Decide_AddParagraph: function (node, pPr, bParagraphAdded, bCommitBr) {
        if (true == bParagraphAdded) {
            if (false != bCommitBr) {
                this._Commit_Br(2, node, pPr);
            }
            this._Execute_AddParagraph(node, pPr);
        } else {
            if (false != bCommitBr) {
                this._Commit_Br(0, node, pPr);
            }
        }
        return false;
    },
    _Commit_Br: function (nIgnore, node, pPr) {
        for (var i = 0, length = this.nBrCount - nIgnore; i < length; i++) {
            if (this.bInBlock) {
                this._Paragraph_Add(new ParaNewLine(break_Line));
            } else {
                this._Execute_AddParagraph(node, pPr);
            }
        }
        this.nBrCount = 0;
    },
    _StartExecuteTable: function (node, pPr) {
        var oDocument = this.oDocument;
        var defaultView = node.ownerDocument.defaultView;
        var tableNode = node;
        for (var i = 0, length = node.childNodes.length; i < length; ++i) {
            if ("tbody" == node.childNodes[i].nodeName.toLowerCase()) {
                node = node.childNodes[i];
                break;
            }
        }
        var nRowCount = 0;
        var nMinColCount = 0;
        var nMaxColCount = 0;
        var aColsCountByRow = new Array();
        var oRowSums = new Object();
        oRowSums[0] = 0;
        var dMaxSum = 0;
        var nCurColWidth = 0;
        var nCurSum = 0;
        var oRowSpans = new Object();
        var fParseSpans = function () {
            var spans = oRowSpans[nCurColWidth];
            while (null != spans && spans.row > 0) {
                spans.row--;
                nCurColWidth += spans.col;
                nCurSum += spans.width;
                spans = oRowSpans[nCurColWidth];
            }
        };
        for (var i = 0, length = node.childNodes.length; i < length; ++i) {
            var tr = node.childNodes[i];
            if ("tr" == tr.nodeName.toLowerCase()) {
                nCurSum = 0;
                nCurColWidth = 0;
                var nMinRowSpanCount = null;
                for (var j = 0, length2 = tr.childNodes.length; j < length2; ++j) {
                    var tc = tr.childNodes[j];
                    var tcName = tc.nodeName.toLowerCase();
                    if ("td" == tcName || "th" == tcName) {
                        fParseSpans();
                        var dWidth = null;
                        var computedStyle = defaultView.getComputedStyle(tc, null);
                        if (computedStyle) {
                            var computedWidth = computedStyle.getPropertyValue("width");
                            if (null != computedWidth && null != (computedWidth = this._ValueToMm(computedWidth))) {
                                dWidth = computedWidth;
                            }
                        }
                        if (null == dWidth) {
                            dWidth = tc.clientWidth * g_dKoef_pix_to_mm;
                        }
                        var nColSpan = tc.getAttribute("colspan");
                        if (null != nColSpan) {
                            nColSpan = nColSpan - 0;
                        } else {
                            nColSpan = 1;
                        }
                        var nCurRowSpan = tc.getAttribute("rowspan");
                        if (null != nCurRowSpan) {
                            nCurRowSpan = nCurRowSpan - 0;
                            if (null == nMinRowSpanCount) {
                                nMinRowSpanCount = nCurRowSpan;
                            } else {
                                if (nMinRowSpanCount > nCurRowSpan) {
                                    nMinRowSpanCount = nCurRowSpan;
                                }
                            }
                            if (nCurRowSpan > 1) {
                                oRowSpans[nCurColWidth] = {
                                    row: nCurRowSpan - 1,
                                    col: nColSpan,
                                    width: dWidth
                                };
                            }
                        } else {
                            nMinRowSpanCount = 0;
                        }
                        nCurSum += dWidth;
                        if (null == oRowSums[nCurColWidth + nColSpan]) {
                            oRowSums[nCurColWidth + nColSpan] = nCurSum;
                        }
                        nCurColWidth += nColSpan;
                    }
                }
                fParseSpans();
                if (nMinRowSpanCount > 1) {
                    for (var j = 0, length2 = tr.childNodes.length; j < length2; ++j) {
                        var tc = tr.childNodes[j];
                        var tcName = tc.nodeName.toLowerCase();
                        if ("td" == tcName || "th" == tcName) {
                            var nCurRowSpan = tc.getAttribute("rowspan");
                            if (null != nCurRowSpan) {
                                tc.setAttribute("rowspan", nCurRowSpan - nMinRowSpanCount);
                            }
                        }
                    }
                }
                if (dMaxSum < nCurSum) {
                    dMaxSum = nCurSum;
                }
                if (0 == nCurColWidth) {
                    node.removeChild(tr);
                    length--;
                    i--;
                } else {
                    if (0 == nMinColCount || nMinColCount > nCurColWidth) {
                        nMinColCount = nCurColWidth;
                    }
                    if (nMaxColCount < nCurColWidth) {
                        nMaxColCount = nCurColWidth;
                    }
                    nRowCount++;
                    aColsCountByRow.push(nCurColWidth);
                }
            }
        }
        if (nMaxColCount != nMinColCount) {
            for (var i = 0, length = aColsCountByRow.length; i < length; ++i) {
                aColsCountByRow[i] = nMaxColCount - aColsCountByRow[i];
            }
        }
        if (nRowCount > 0 && nMaxColCount > 0) {
            var bUseScaleKoef = this.bUseScaleKoef;
            var dScaleKoef = this.dScaleKoef;
            if (dMaxSum * dScaleKoef > this.dMaxWidth) {
                dScaleKoef = dScaleKoef * this.dMaxWidth / dMaxSum;
                bUseScaleKoef = true;
            }
            var aGrid = new Array();
            var nPrevIndex = null;
            var nPrevVal = 0;
            for (var i in oRowSums) {
                var nCurIndex = i - 0;
                var nCurVal = oRowSums[i];
                var nCurWidth = nCurVal - nPrevVal;
                if (bUseScaleKoef) {
                    nCurWidth *= dScaleKoef;
                }
                if (null != nPrevIndex) {
                    var nDif = nCurIndex - nPrevIndex;
                    if (1 == nDif) {
                        aGrid.push(nCurWidth);
                    } else {
                        var nPartVal = nCurWidth / nDif;
                        for (var i = 0; i < nDif; ++i) {
                            aGrid.push(nPartVal);
                        }
                    }
                }
                nPrevVal = nCurVal;
                nPrevIndex = nCurIndex;
            }
            var CurPage = 0;
            var table = new CTable(oDocument.DrawingDocument, oDocument, true, 0, 0, 0, X_Right_Field, Y_Bottom_Field, 0, 0, aGrid);
            var aSumGrid = new Array();
            aSumGrid[-1] = 0;
            var nSum = 0;
            for (var i = 0, length = aGrid.length; i < length; ++i) {
                nSum += aGrid[i];
                aSumGrid[i] = nSum;
            }
            this._ExecuteTable(tableNode, node, table, aSumGrid, nMaxColCount != nMinColCount ? aColsCountByRow : null, pPr, bUseScaleKoef, dScaleKoef);
            table.Cursor_MoveToStartPos();
            this.aContent.push(table);
        }
    },
    _ExecuteBorder: function (computedStyle, node, type, type2, bAddIfNull) {
        var res = null;
        var style = computedStyle.getPropertyValue("border-" + type + "-style");
        if (null != style) {
            res = new CDocumentBorder();
            if ("none" == style) {
                res.Value = border_None;
            } else {
                res.Value = border_Single;
                var width = node.style["border" + type2 + "Width"];
                if (!width) {
                    computedStyle.getPropertyValue("border-" + type + "-width");
                }
                if (null != width && null != (width = this._ValueToMm(width))) {
                    res.Size = width;
                }
                var color = computedStyle.getPropertyValue("border-" + type + "-color");
                if (null != color && (color = this._ParseColor(color))) {
                    res.Color = color;
                }
            }
        }
        if (bAddIfNull && null == res) {
            res = new CDocumentBorder();
        }
        return res;
    },
    _ExecuteParagraphBorder: function (border) {
        var res = this.oBorderCache[border];
        if (null != res) {
            return res.Copy();
        } else {
            res = new CDocumentBorder();
            var oTestDiv = document.createElement("div");
            oTestDiv.setAttribute("style", "border-left:" + border);
            document.body.appendChild(oTestDiv);
            var defaultView = oTestDiv.ownerDocument.defaultView;
            var computedStyle = defaultView.getComputedStyle(oTestDiv, null);
            if (null != computedStyle) {
                res = this._ExecuteBorder(computedStyle, oTestDiv, "left", "Left", true);
            }
            document.body.removeChild(oTestDiv);
            this.oBorderCache[border] = res;
            return res;
        }
    },
    _ExecuteTable: function (tableNode, node, table, aSumGrid, aColsCountByRow, pPr, bUseScaleKoef, dScaleKoef) {
        table.Set_TableLayout(tbllayout_Fixed);
        var Pr = table.Pr;
        var defaultView = tableNode.ownerDocument.defaultView;
        var sTableAlign = null;
        if (null != tableNode.align) {
            sTableAlign = tableNode.align;
        } else {
            if (null != tableNode.parentNode && this.oRootNode != tableNode.parentNode) {
                computedStyleParent = defaultView.getComputedStyle(tableNode.parentNode, null);
                if (null != computedStyleParent) {
                    sTableAlign = computedStyleParent.getPropertyValue("text-align");
                }
            }
        }
        if (null != sTableAlign) {
            if (-1 != sTableAlign.indexOf("center")) {
                table.Set_TableAlign(align_Center);
            } else {
                if (-1 != sTableAlign.indexOf("right")) {
                    table.Set_TableAlign(align_Right);
                }
            }
        }
        var spacing = null;
        table.Set_TableBorder_InsideH(new CDocumentBorder());
        table.Set_TableBorder_InsideV(new CDocumentBorder());
        var style = tableNode.getAttribute("style");
        if (style) {
            var tblPrMso = new Object();
            this._parseCss(style, tblPrMso);
            var spacing = tblPrMso["mso-cellspacing"];
            if (null != spacing && null != (spacing = this._ValueToMm(spacing))) {}
            var padding = tblPrMso["mso-padding-alt"];
            if (null != padding) {
                padding = trimString(padding);
                var aMargins = padding.split(" ");
                if (4 == aMargins.length) {
                    var top = aMargins[0];
                    if (null != top && null != (top = this._ValueToMm(top))) {} else {
                        top = Pr.TableCellMar.Top.W;
                    }
                    var right = aMargins[1];
                    if (null != right && null != (right = this._ValueToMm(right))) {} else {
                        right = Pr.TableCellMar.Right.W;
                    }
                    var bottom = aMargins[2];
                    if (null != bottom && null != (bottom = this._ValueToMm(bottom))) {} else {
                        bottom = Pr.TableCellMar.Bottom.W;
                    }
                    var left = aMargins[3];
                    if (null != left && null != (left = this._ValueToMm(left))) {} else {
                        left = Pr.TableCellMar.Left.W;
                    }
                    table.Set_TableCellMar(left, top, right, bottom);
                }
            }
            var insideh = tblPrMso["mso-border-insideh"];
            if (null != insideh) {
                table.Set_TableBorder_InsideH(this._ExecuteParagraphBorder(insideh));
            }
            var insidev = tblPrMso["mso-border-insidev"];
            if (null != insidev) {
                table.Set_TableBorder_InsideV(this._ExecuteParagraphBorder(insidev));
            }
        }
        var computedStyle = defaultView.getComputedStyle(tableNode, null);
        if (computedStyle) {
            if (align_Left == table.Get_TableAlign()) {
                var margin_left = computedStyle.getPropertyValue("margin-left");
                if (margin_left && null != (margin_left = this._ValueToMm(margin_left)) && margin_left < Page_Width - X_Left_Margin) {
                    table.Set_TableInd(margin_left);
                }
            }
            background_color = computedStyle.getPropertyValue("background-color");
            if (null != background_color && (background_color = this._ParseColor(background_color))) {
                table.Set_TableShd(shd_Clear, background_color.r, background_color.g, background_color.b);
            }
            var oLeftBorder = this._ExecuteBorder(computedStyle, tableNode, "left", "Left", false);
            if (null != oLeftBorder) {
                table.Set_TableBorder_Left(oLeftBorder);
            }
            var oTopBorder = this._ExecuteBorder(computedStyle, tableNode, "top", "Top", false);
            if (null != oTopBorder) {
                table.Set_TableBorder_Top(oTopBorder);
            }
            var oRightBorder = this._ExecuteBorder(computedStyle, tableNode, "right", "Right", false);
            if (null != oRightBorder) {
                table.Set_TableBorder_Right(oRightBorder);
            }
            var oBottomBorder = this._ExecuteBorder(computedStyle, tableNode, "bottom", "Bottom", false);
            if (null != oBottomBorder) {
                table.Set_TableBorder_Bottom(oBottomBorder);
            }
            if (null == spacing) {
                spacing = computedStyle.getPropertyValue("padding");
                if (!spacing) {
                    spacing = tableNode.style.padding;
                }
                if (!spacing) {
                    spacing = null;
                }
                if (spacing && null != (spacing = this._ValueToMm(spacing))) {}
            }
        }
        var oRowSpans = new Object();
        for (var i = 0, length = node.childNodes.length; i < length; ++i) {
            var tr = node.childNodes[i];
            if ("tr" == tr.nodeName.toLowerCase()) {
                var row = table.Internal_Add_Row(table.Content.length, 0);
                this._ExecuteTableRow(tr, row, aSumGrid, spacing, oRowSpans, bUseScaleKoef, dScaleKoef);
            }
        }
    },
    _ExecuteTableRow: function (node, row, aSumGrid, spacing, oRowSpans, bUseScaleKoef, dScaleKoef) {
        var oThis = this;
        var table = row.Table;
        if (null != spacing && spacing >= tableSpacingMinValue) {
            row.Set_CellSpacing(spacing);
        }
        if (node.style.height) {
            var height = node.style.height;
            if (! ("auto" == height || "inherit" == height || -1 != height.indexOf("%")) && null != (height = this._ValueToMm(height))) {
                row.Set_Height(height, heightrule_AtLeast);
            }
        }
        var bBefore = false;
        var bAfter = false;
        var style = node.getAttribute("style");
        if (null != style) {
            var tcPr = new Object();
            this._parseCss(style, tcPr);
            var margin_left = tcPr["mso-row-margin-left"];
            if (margin_left && null != (margin_left = this._ValueToMm(margin_left))) {
                bBefore = true;
            }
            var margin_right = tcPr["mso-row-margin-right"];
            if (margin_right && null != (margin_right = this._ValueToMm(margin_right))) {
                bAfter = true;
            }
        }
        var nCellIndex = 0;
        var nCellIndexSpan = 0;
        var fParseSpans = function () {
            var spans = oRowSpans[nCellIndexSpan];
            while (null != spans) {
                var oCurCell = row.Add_Cell(row.Get_CellsCount(), row, null, false);
                oCurCell.Set_VMerge(vmerge_Continue);
                if (spans.col > 1) {
                    oCurCell.Set_GridSpan(spans.col);
                }
                spans.row--;
                if (spans.row <= 0) {
                    delete oRowSpans[nCellIndexSpan];
                }
                nCellIndexSpan += spans.col;
                spans = oRowSpans[nCellIndexSpan];
            }
        };
        var oBeforeCell = null;
        var oAfterCell = null;
        if (bBefore || bAfter) {
            for (var i = 0, length = node.childNodes.length; i < length; ++i) {
                var tc = node.childNodes[i];
                var tcName = tc.nodeName.toLowerCase();
                if ("td" == tcName || "th" == tcName) {
                    if (bBefore && null != oBeforeCell) {
                        oBeforeCell = tc;
                    } else {
                        if (bAfter) {
                            oAfterCell = tc;
                        }
                    }
                }
            }
        }
        for (var i = 0, length = node.childNodes.length; i < length; ++i) {
            fParseSpans();
            var tc = node.childNodes[i];
            var tcName = tc.nodeName.toLowerCase();
            if ("td" == tcName || "th" == tcName) {
                var nColSpan = tc.getAttribute("colspan");
                if (null != nColSpan) {
                    nColSpan = nColSpan - 0;
                } else {
                    nColSpan = 1;
                }
                if (tc == oBeforeCell) {
                    row.Set_Before(nColSpan);
                } else {
                    if (tc == oAfterCell) {
                        row.Set_After(nColSpan);
                    } else {
                        var oCurCell = row.Add_Cell(row.Get_CellsCount(), row, null, false);
                        if (nColSpan > 1) {
                            oCurCell.Set_GridSpan(nColSpan);
                        }
                        var width = aSumGrid[nCellIndexSpan + nColSpan - 1] - aSumGrid[nCellIndexSpan - 1];
                        oCurCell.Set_W(new CTableMeasurement(tblwidth_Mm, width));
                        var nRowSpan = tc.getAttribute("rowspan");
                        if (null != nRowSpan) {
                            nRowSpan = nRowSpan - 0;
                        } else {
                            nRowSpan = 1;
                        }
                        if (nRowSpan > 1) {
                            oRowSpans[nCellIndexSpan] = {
                                row: nRowSpan - 1,
                                col: nColSpan
                            };
                        }
                        this._ExecuteTableCell(tc, oCurCell, bUseScaleKoef, dScaleKoef, spacing);
                    }
                }
                nCellIndexSpan += nColSpan;
            }
        }
        fParseSpans();
    },
    _ExecuteTableCell: function (node, cell, bUseScaleKoef, dScaleKoef, spacing) {
        var Pr = cell.Pr;
        var bAddIfNull = false;
        if (null != spacing) {
            bAddIfNull = true;
        }
        var defaultView = node.ownerDocument.defaultView;
        var computedStyle = defaultView.getComputedStyle(node, null);
        if (null != computedStyle) {
            background_color = computedStyle.getPropertyValue("background-color");
            if (null != background_color && (background_color = this._ParseColor(background_color))) {
                var Shd = new CDocumentShd();
                Shd.Value = shd_Clear;
                Shd.Color = background_color;
                cell.Set_Shd(Shd);
            }
            var border = this._ExecuteBorder(computedStyle, node, "left", "Left", bAddIfNull);
            if (null != border) {
                cell.Set_Border(border, 3);
            }
            var border = this._ExecuteBorder(computedStyle, node, "top", "Top", bAddIfNull);
            if (null != border) {
                cell.Set_Border(border, 0);
            }
            var border = this._ExecuteBorder(computedStyle, node, "right", "Right", bAddIfNull);
            if (null != border) {
                cell.Set_Border(border, 1);
            }
            var border = this._ExecuteBorder(computedStyle, node, "bottom", "Bottom", bAddIfNull);
            if (null != border) {
                cell.Set_Border(border, 2);
            }
            var top = computedStyle.getPropertyValue("padding-top");
            if (null != top && null != (top = this._ValueToMm(top))) {
                cell.Set_Margins({
                    W: top,
                    Type: tblwidth_Mm
                },
                0);
            }
            var right = computedStyle.getPropertyValue("padding-right");
            if (null != right && null != (right = this._ValueToMm(right))) {
                cell.Set_Margins({
                    W: right,
                    Type: tblwidth_Mm
                },
                1);
            }
            var bottom = computedStyle.getPropertyValue("padding-bottom");
            if (null != bottom && null != (bottom = this._ValueToMm(bottom))) {
                cell.Set_Margins({
                    W: bottom,
                    Type: tblwidth_Mm
                },
                2);
            }
            var left = computedStyle.getPropertyValue("padding-left");
            if (null != left && null != (left = this._ValueToMm(left))) {
                cell.Set_Margins({
                    W: left,
                    Type: tblwidth_Mm
                },
                3);
            }
        }
        var oPasteProcessor = new PasteProcessor(this.api, false, false, true);
        oPasteProcessor.oFonts = this.oFonts;
        oPasteProcessor.oImages = this.oImages;
        oPasteProcessor.oDocument = cell.Content;
        oPasteProcessor.bIgnoreNoBlockText = true;
        oPasteProcessor.dMaxWidth = this._CalcMaxWidthByCell(cell);
        if (true == bUseScaleKoef) {
            oPasteProcessor.bUseScaleKoef = bUseScaleKoef;
            oPasteProcessor.dScaleKoef = dScaleKoef;
        }
        oPasteProcessor.Start(node);
        oPasteProcessor._PrepareContent();
        oPasteProcessor._AddNextPrevToContent(cell.Content);
        if (0 == oPasteProcessor.aContent.length) {
            var oDocContent = cell.Content;
            var oNewPar = new Paragraph(oDocContent.DrawingDocument, oDocContent, 0, 50, 50, X_Right_Field, Y_Bottom_Field);
            oNewPar.Set_Spacing({
                After: 0,
                Before: 0,
                Line: linerule_Auto
            });
            oPasteProcessor.aContent.push(oNewPar);
        }
        for (var i = 0, length = oPasteProcessor.aContent.length; i < length; ++i) {
            cell.Content.Internal_Content_Add(i + 1, oPasteProcessor.aContent[i]);
        }
        cell.Content.Internal_Content_Remove(0, 1);
    },
    _Execute: function (node, pPr, bRoot, bAddParagraph, bInBlock) {
        var oDocument = this.oDocument;
        var bRootHasBlock = false;
        if (true == bRoot) {
            var bExist = false;
            for (var i = 0, length = node.childNodes.length; i < length; i++) {
                var child = node.childNodes[i];
                var bIsBlockChild = this._IsBlockElem(child.nodeName.toLowerCase());
                if (true == bIsBlockChild) {
                    bRootHasBlock = true;
                    bExist = true;
                    break;
                }
            }
            if (false == bExist && true == this.bIgnoreNoBlockText) {
                this.bIgnoreNoBlockText = false;
            }
        } else {
            if (Node.TEXT_NODE == node.nodeType) {
                if (false == this.bIgnoreNoBlockText || true == bInBlock) {
                    var value = node.nodeValue;
                    if (!value) {
                        value = "";
                    }
                    value = value.replace(/^(\r|\t|\n)+|(\r|\t|\n)+$/g, "");
                    value = value.replace(/(\r|\t|\n)/g, " ");
                    if (value.length > 0) {
                        bAddParagraph = this._Decide_AddParagraph(node.parentNode, pPr, bAddParagraph);
                        this._commit_rPr(node.parentNode);
                        for (var i = 0, length = value.length; i < length; i++) {
                            var Char = value.charAt(i);
                            var Code = value.charCodeAt(i);
                            var Item;
                            if (32 == Code || 160 == Code) {
                                Item = new ParaSpace();
                            } else {
                                Item = new ParaText(value[i]);
                            }
                            this._Paragraph_Add(Item);
                        }
                    }
                }
                return bAddParagraph;
            }
            var sNodeName = node.nodeName.toLowerCase();
            if ("table" == sNodeName) {
                return false;
            }
            var style = node.getAttribute("style");
            if (style) {
                this._parseCss(style, pPr);
            }
            if ("h1" == sNodeName) {
                pPr.hLevel = 0;
            } else {
                if ("h2" == sNodeName) {
                    pPr.hLevel = 1;
                } else {
                    if ("h3" == sNodeName) {
                        pPr.hLevel = 2;
                    } else {
                        if ("h4" == sNodeName) {
                            pPr.hLevel = 3;
                        } else {
                            if ("h5" == sNodeName) {
                                pPr.hLevel = 4;
                            } else {
                                if ("h6" == sNodeName) {
                                    pPr.hLevel = 5;
                                }
                            }
                        }
                    }
                }
            }
            if ("ul" == sNodeName || "ol" == sNodeName || "li" == sNodeName) {
                pPr.bNum = true;
                if ("ul" == sNodeName) {
                    pPr.numType = numbering_numfmt_Bullet;
                } else {
                    if ("ol" == sNodeName) {
                        pPr.numType = numbering_numfmt_Decimal;
                    }
                }
            }
            if ("img" == sNodeName) {
                return false;
            }
            if ("br" == sNodeName || "always" == node.style.pageBreakBefore) {
                if ("always" == node.style.pageBreakBefore) {
                    bAddParagraph = this._Decide_AddParagraph(node.parentNode, pPr, bAddParagraph);
                    bAddParagraph = true;
                    this._Commit_Br(0, node, pPr);
                    this._Paragraph_Add(new ParaNewLine(break_Page));
                } else {
                    bAddParagraph = this._Decide_AddParagraph(node.parentNode, pPr, bAddParagraph, false);
                    this.nBrCount++;
                    if ("line-break" == pPr["mso-special-character"]) {
                        this._Commit_Br(0, node, pPr);
                    }
                    return bAddParagraph;
                }
            }
            if ("span" == sNodeName) {
                var nTabCount = parseInt(pPr["mso-tab-count"] || 0);
                if (nTabCount > 0) {
                    bAddParagraph = this._Decide_AddParagraph(node, pPr, bAddParagraph);
                    this._commit_rPr(node);
                    for (var i = 0; i < nTabCount; i++) {
                        this._Paragraph_Add(new ParaTab());
                    }
                    return bAddParagraph;
                }
            }
        }
        for (var i = 0, length = node.childNodes.length; i < length; i++) {
            var child = node.childNodes[i];
            var nodeType = child.nodeType;
            if (Node.COMMENT_NODE == nodeType) {
                var value = child.nodeValue;
                var bSkip = false;
                if (value) {
                    if (-1 != value.indexOf("supportLists")) {
                        pPr.bNum = true;
                        bSkip = true;
                    }
                    if (-1 != value.indexOf("supportLineBreakNewLine")) {
                        bSkip = true;
                    }
                }
                if (true == bSkip) {
                    var j = i + 1;
                    for (; j < length; j++) {
                        var tempNode = node.childNodes[j];
                        var tempNodeType = tempNode.nodeType;
                        if (Node.COMMENT_NODE == tempNodeType) {
                            var tempvalue = tempNode.nodeValue;
                            if (tempvalue && -1 != tempvalue.indexOf("endif")) {
                                break;
                            }
                        }
                    }
                    i = j;
                    continue;
                }
            }
            if (! (Node.ELEMENT_NODE == nodeType || Node.TEXT_NODE == nodeType)) {
                continue;
            }
            if (Node.TEXT_NODE == child.nodeType) {
                var value = child.nodeValue;
                if (!value) {
                    continue;
                }
                value = value.replace(/(\r|\t|\n)/g, "");
                if ("" == value) {
                    continue;
                }
            }
            var sChildNodeName = child.nodeName.toLowerCase();
            var bIsBlockChild = this._IsBlockElem(sChildNodeName);
            if (bRoot) {
                this.bInBlock = false;
            }
            if (bIsBlockChild) {
                bAddParagraph = true;
                this.bInBlock = true;
            }
            var bHyperlink = false;
            if ("a" == sChildNodeName) {
                var href = child.href;
                if (null != href) {
                    var sDecoded;
                    try {
                        sDecoded = decodeURI(href);
                    } catch(e) {
                        sDecoded = href;
                    }
                    href = sDecoded;
                    bHyperlink = true;
                    var title = child.getAttribute("title");
                    bAddParagraph = this._Decide_AddParagraph(child, pPr, bAddParagraph);
                    var oHyperlink = new ParaHyperlinkStart();
                    oHyperlink.Set_Value(href);
                    if (null != title) {
                        oHyperlink.Set_ToolTip(title);
                    }
                    this._Paragraph_Add(oHyperlink);
                }
            }
            bAddParagraph = this._Execute(child, Common_CopyObj(pPr), false, bAddParagraph, bIsBlockChild || bInBlock);
            if (bIsBlockChild) {
                bAddParagraph = true;
            }
            if ("a" == sChildNodeName && true == bHyperlink) {
                this._Paragraph_Add(new ParaHyperlinkEnd());
            }
        }
        if (bRoot) {
            this._Commit_Br(2, node, pPr);
        }
        return bAddParagraph;
    },
    _ExecutePresentation: function (node, pPr, bRoot, bAddParagraph, bInBlock, arrShapes, arrImages, arrTables) {
        var arr_shapes = [];
        var arr_images = [];
        var arr_tables = [];
        var oDocument = this.oDocument;
        var bRootHasBlock = false;
        var shape = arrShapes[arrShapes.length - 1];
        this.aContent = shape.txBody.content.Content;
        if (true == bRoot) {
            var bExist = false;
            for (var i = 0, length = node.childNodes.length; i < length; i++) {
                var child = node.childNodes[i];
                var bIsBlockChild = this._IsBlockElem(child.nodeName.toLowerCase());
                if (true == bIsBlockChild) {
                    bRootHasBlock = true;
                    bExist = true;
                    break;
                }
            }
            if (false == bExist && true == this.bIgnoreNoBlockText) {
                this.bIgnoreNoBlockText = false;
            }
        } else {
            if (Node.TEXT_NODE == node.nodeType) {
                if (false == this.bIgnoreNoBlockText || true == bInBlock) {
                    var value = node.nodeValue;
                    if (!value) {
                        value = "";
                    }
                    value = value.replace(/^(\r|\t|\n)+|(\r|\t|\n)+$/g, "");
                    value = value.replace(/(\r|\t|\n)/g, " ");
                    if (value.length > 0) {
                        this.oDocument = shape.txBody.content;
                        this._commit_rPr(node.parentNode);
                        var rPr = this._read_rPr(node.parentNode);
                        var Item = new ParaTextPr(rPr);
                        shape.paragraphAdd(Item);
                        for (var i = 0, length = value.length; i < length; i++) {
                            var Char = value.charAt(i);
                            var Code = value.charCodeAt(i);
                            var Item;
                            if (32 == Code || 160 == Code) {
                                Item = new ParaSpace();
                            } else {
                                Item = new ParaText(value[i]);
                            }
                            shape.paragraphAdd(Item);
                        }
                    }
                }
                return;
            }
            var sNodeName = node.nodeName.toLowerCase();
            if ("table" == sNodeName) {
                this._StartExecuteTablePresentation(node, pPr, arrShapes, arrImages, arrTables);
                return;
            }
            var style = node.getAttribute("style");
            if (style) {
                this._parseCss(style, pPr);
            }
            if ("h1" == sNodeName) {
                pPr.hLevel = 0;
            } else {
                if ("h2" == sNodeName) {
                    pPr.hLevel = 1;
                } else {
                    if ("h3" == sNodeName) {
                        pPr.hLevel = 2;
                    } else {
                        if ("h4" == sNodeName) {
                            pPr.hLevel = 3;
                        } else {
                            if ("h5" == sNodeName) {
                                pPr.hLevel = 4;
                            } else {
                                if ("h6" == sNodeName) {
                                    pPr.hLevel = 5;
                                }
                            }
                        }
                    }
                }
            }
            if ("ul" == sNodeName || "ol" == sNodeName || "li" == sNodeName) {
                pPr.bNum = true;
                if ("ul" == sNodeName) {
                    pPr.numType = numbering_numfmt_Bullet;
                } else {
                    if ("ol" == sNodeName) {
                        pPr.numType = numbering_numfmt_Decimal;
                    }
                }
            }
            if ("img" == sNodeName) {
                return bAddParagraph;
            }
            if ("br" == sNodeName || "always" == node.style.pageBreakBefore) {
                if ("always" == node.style.pageBreakBefore) {
                    shape.paragraphAdd(new ParaNewLine(break_Line));
                } else {
                    shape.paragraphAdd(new ParaNewLine(break_Line));
                }
            }
            if ("span" == sNodeName) {
                var nTabCount = parseInt(pPr["mso-tab-count"] || 0);
                if (nTabCount > 0) {
                    var rPr = this._read_rPr(node);
                    var Item = new ParaText(rPr);
                    shape.paragraphAdd(Item);
                    for (var i = 0; i < nTabCount; i++) {
                        shape.paragraphAdd(new ParaTab());
                    }
                    return;
                }
            }
        }
        for (var i = 0, length = node.childNodes.length; i < length; i++) {
            var child = node.childNodes[i];
            var nodeType = child.nodeType;
            if (Node.COMMENT_NODE == nodeType) {
                var value = child.nodeValue;
                var bSkip = false;
                if (value) {
                    if (-1 != value.indexOf("supportLists")) {
                        pPr.bNum = true;
                        bSkip = true;
                    }
                    if (-1 != value.indexOf("supportLineBreakNewLine")) {
                        bSkip = true;
                    }
                }
                if (true == bSkip) {
                    var j = i + 1;
                    for (; j < length; j++) {
                        var tempNode = node.childNodes[j];
                        var tempNodeType = tempNode.nodeType;
                        if (Node.COMMENT_NODE == tempNodeType) {
                            var tempvalue = tempNode.nodeValue;
                            if (tempvalue && -1 != tempvalue.indexOf("endif")) {
                                break;
                            }
                        }
                    }
                    i = j;
                    continue;
                }
            }
            if (! (Node.ELEMENT_NODE == nodeType || Node.TEXT_NODE == nodeType)) {
                continue;
            }
            if (Node.TEXT_NODE == child.nodeType) {
                var value = child.nodeValue;
                if (!value) {
                    continue;
                }
                value = value.replace(/(\r|\t|\n)/g, "");
                if ("" == value) {
                    continue;
                }
            }
            var sChildNodeName = child.nodeName.toLowerCase();
            var bIsBlockChild = this._IsBlockElem(sChildNodeName);
            if (bRoot) {
                this.bInBlock = false;
            }
            if (bIsBlockChild) {
                bAddParagraph = true;
                this.bInBlock = true;
            }
            var bHyperlink = false;
            if ("a" == sChildNodeName) {
                var href = child.href;
                if (null != href) {
                    var sDecoded;
                    try {
                        sDecoded = decodeURI(href);
                    } catch(e) {
                        sDecoded = href;
                    }
                    href = sDecoded;
                    bHyperlink = true;
                    var title = child.getAttribute("title");
                    this.oDocument = shape.txBody.content;
                    var oHyperlink = new ParaHyperlinkStart();
                    oHyperlink.Set_Value(href);
                    if (null != title) {
                        oHyperlink.Set_ToolTip(title);
                    }
                    shape.paragraphAdd(oHyperlink);
                }
            }
            bAddParagraph = this._ExecutePresentation(child, Common_CopyObj(pPr), false, bAddParagraph, bIsBlockChild || bInBlock, arrShapes, arrImages, arrTables);
            if (bIsBlockChild) {
                bAddParagraph = true;
            }
            if ("a" == sChildNodeName && true == bHyperlink) {
                shape.paragraphAdd(new ParaHyperlinkEnd());
            }
        }
        if (bRoot) {}
        return;
    },
    _StartExecuteTablePresentation: function (node, pPr, arrShapes, arrImages, arrTables) {},
    _ExecuteTablePresentation: function (tableNode, node, table, aSumGrid, aColsCountByRow, pPr, bUseScaleKoef, dScaleKoef, arrShapes, arrImages, arrTables) {},
    _ExecuteTableRowPresentation: function (node, row, aSumGrid, spacing, oRowSpans, bUseScaleKoef, dScaleKoef, arrShapes, arrImages, arrTables) {},
    _ExecuteTableCellPresentation: function (node, cell, bUseScaleKoef, dScaleKoef, spacing, arrShapes, arrImages, arrTables) {}
};
function trimString(str) {
    return str.replace(/^\s+|\s+$/g, "");
}
function Common_CmpObj2(Obj1, Obj2) {
    if (!Obj1 || !Obj2 || typeof(Obj1) != typeof(Obj2)) {
        return false;
    }
    var p, v1, v2;
    for (p in Obj2) {
        if (!Obj1.hasOwnProperty(p)) {
            return false;
        }
    }
    for (p in Obj1) {
        if (Obj2.hasOwnProperty(p)) {
            v1 = Obj1[p];
            v2 = Obj2[p];
            if (v1 && v2 && "object" === typeof(v1) && "object" === typeof(v2)) {
                if (false == Common_CmpObj2(v1, v2)) {
                    return false;
                }
            } else {
                if (v1 != v2) {
                    return false;
                }
            }
        } else {
            return false;
        }
    }
    return true;
}