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
 var CHART_TITLE_TYPE_TITLE = 0;
var CHART_TITLE_TYPE_H_AXIS = 1;
var CHART_TITLE_TYPE_V_AXIS = 2;
var paraDrawing;
function CChartTitle(chartGroup, type) {
    this.layout = null;
    this.overlay = false;
    this.spPr = new CSpPr();
    this.txPr = null;
    this.isDefaultText = false;
    this.txBody = null;
    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;
    this.brush = null;
    this.pen = null;
    this.spPr.geometry = CreateGeometry("rect");
    this.spPr.geometry.Init(5, 5);
    this.invertTransform = new CMatrix();
    this.invertTransformText = new CMatrix();
    this.transform = new CMatrix();
    this.transformText = new CMatrix();
    this.recalculateInfo = {
        recalculateTransform: true,
        recalculateBrush: true,
        recalculatePen: true
    };
    this.selected = false;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
    if (chartGroup) {
        this.setChartGroup(chartGroup);
    }
    if (isRealNumber(type)) {
        this.setType(type);
    }
}
CChartTitle.prototype = {
    getObjectType: function () {
        return CLASS_TYPE_CHART_TITLE;
    },
    Get_Id: function () {
        return this.Id;
    },
    getTitleType: function () {
        if (this === this.chartGroup.chartTitle) {
            return CHART_TITLE_TYPE_TITLE;
        }
        if (this === this.chartGroup.hAxisTitle) {
            return CHART_TITLE_TYPE_H_AXIS;
        }
        if (this === this.chartGroup.vAxisTitle) {
            return CHART_TITLE_TYPE_V_AXIS;
        }
    },
    setBodyPr: function (bodyPr) {
        if (isRealObject(this.txBody)) {
            this.txBody.bodyPr = bodyPr;
        }
    },
    isEmpty: function () {
        return isRealObject(this.txBody) ? this.txBody.isEmpty() : true;
    },
    setType: function (type) {
        var oldValue = this.type;
        var newValue = type;
        this.type = type;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetChartTitleType, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
    },
    Get_Styles: function () {
        return new CStyles();
    },
    select: function () {
        this.selected = true;
    },
    deselect: function () {
        this.selected = false;
        if (isRealObject(this.txBody) && isRealObject(this.txBody.content)) {
            this.txBody.content.Selection_Remove();
        }
    },
    getParagraphParaPr: function () {
        if (this.txBody) {
            return this.txBody.content.Get_Paragraph_ParaPr();
        }
        return null;
    },
    getParagraphTextPr: function () {
        if (this.txBody) {
            return this.txBody.content.Get_Paragraph_TextPr();
        }
        return null;
    },
    getAllParagraphParaPr: function () {
        if (this.txBody) {
            this.txBody.content.Set_ApplyToAll(true);
            var paraPr = this.txBody.content.Get_Paragraph_ParaPr();
            this.txBody.content.Set_ApplyToAll(false);
            return paraPr;
        }
        return null;
    },
    getAllParagraphTextPr: function () {
        if (this.txBody) {
            this.txBody.content.Set_ApplyToAll(true);
            var paraPr = this.txBody.content.Get_Paragraph_TextPr();
            this.txBody.content.Set_ApplyToAll(false);
            return paraPr;
        }
        return null;
    },
    increaseFontSize: function () {
        if (isRealObject(this.txBody)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
            this.txBody.content.Paragraph_IncDecFontSize(true);
            this.chartGroup.recalculate();
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        }
    },
    decreaseFontSize: function () {
        if (isRealObject(this.txBody)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
            this.txBody.content.Paragraph_IncDecFontSize(false);
            this.chartGroup.recalculate();
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        }
    },
    increaseAllFontSize: function () {
        if (isRealObject(this.txBody)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.content.Paragraph_IncDecFontSize(true);
            this.txBody.content.Set_ApplyToAll(false);
            this.chartGroup.recalculate();
            this.calculateTransformTextMatrix();
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        }
    },
    decreaseAllFontSize: function () {
        if (isRealObject(this.txBody)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.content.Paragraph_IncDecFontSize(false);
            this.txBody.content.Set_ApplyToAll(false);
            this.chartGroup.recalculate();
            this.calculateTransformTextMatrix();
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        }
    },
    setCellFontName: function (fontName) {
        if (isRealObject(this.txBody)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
            var text_pr = new ParaTextPr();
            text_pr.Set_FontFamily({
                Name: fontName,
                Index: -1
            });
            this.txBody.paragraphAdd(text_pr);
            this.chartGroup.recalculate();
            this.drawingObjects.showDrawingObjects();
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        }
    },
    setCellFontSize: function (fontSize) {
        if (isRealObject(this.txBody)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
            var text_pr = new ParaTextPr();
            text_pr.Set_FontSize(fontSize);
            this.txBody.paragraphAdd(text_pr);
            this.chartGroup.recalculate();
            this.drawingObjects.showDrawingObjects();
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        }
    },
    setCellBold: function (isBold) {
        if (isRealObject(this.txBody)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
            var text_pr = new ParaTextPr();
            text_pr.Set_Bold(isBold);
            this.txBody.paragraphAdd(text_pr);
            this.chartGroup.recalculate();
            this.drawingObjects.showDrawingObjects();
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        }
    },
    setCellItalic: function (isItalic) {
        if (isRealObject(this.txBody)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
            var text_pr = new ParaTextPr();
            text_pr.Set_Italic(isItalic);
            this.txBody.paragraphAdd(text_pr);
            this.chartGroup.recalculate();
            this.drawingObjects.showDrawingObjects();
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        }
    },
    setCellUnderline: function (isUnderline) {
        if (isRealObject(this.txBody)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
            var text_pr = new ParaTextPr();
            text_pr.Set_Underline(isUnderline);
            this.txBody.paragraphAdd(text_pr);
            this.chartGroup.recalculate();
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        }
    },
    setCellStrikeout: function (isStrikeout) {
        if (isRealObject(this.txBody)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
            var text_pr = new ParaTextPr();
            text_pr.Set_Strikeout(isStrikeout);
            this.txBody.paragraphAdd(text_pr);
            this.chartGroup.recalculate();
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        }
    },
    setCellTextColor: function (color) {
        if (isRealObject(this.txBody)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
            var unifill = new CUniFill();
            unifill.setFill(new CSolidFill());
            unifill.fill.setColor(CorrectUniColor2(color, null));
            var text_pr = new ParaTextPr();
            text_pr.SetUniFill(unifill);
            this.txBody.paragraphAdd(text_pr);
            this.chartGroup.recalculate();
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        }
    },
    setCellAllFontName: function (fontName) {
        if (isRealObject(this.txBody)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
            var text_pr = new ParaTextPr();
            text_pr.Set_FontFamily({
                Name: fontName,
                Index: -1
            });
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.paragraphAdd(text_pr);
            this.txBody.content.Set_ApplyToAll(false);
            this.chartGroup.recalculate();
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        }
    },
    setCellAllFontSize: function (fontSize) {
        if (isRealObject(this.txBody)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
            var text_pr = new ParaTextPr();
            text_pr.Set_FontSize(fontSize);
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.paragraphAdd(text_pr);
            this.txBody.content.Set_ApplyToAll(false);
            this.chartGroup.recalculate();
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        }
    },
    setCellAllBold: function (isBold) {
        if (isRealObject(this.txBody)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
            var text_pr = new ParaTextPr();
            text_pr.Set_Bold(isBold);
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.paragraphAdd(text_pr);
            this.txBody.content.Set_ApplyToAll(false);
            this.chartGroup.recalculate();
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        }
    },
    setCellAllItalic: function (isItalic) {
        if (isRealObject(this.txBody)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
            var text_pr = new ParaTextPr();
            text_pr.Set_Italic(isItalic);
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.paragraphAdd(text_pr);
            this.txBody.content.Set_ApplyToAll(false);
            this.chartGroup.recalculate();
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        }
    },
    setCellAllUnderline: function (isUnderline) {
        if (isRealObject(this.txBody)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
            var text_pr = new ParaTextPr();
            text_pr.Set_Underline(isUnderline);
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.paragraphAdd(text_pr);
            this.txBody.content.Set_ApplyToAll(false);
            this.chartGroup.recalculate();
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        }
    },
    setCellAllStrikeout: function (isStrikeout) {
        if (isRealObject(this.txBody)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
            var text_pr = new ParaTextPr();
            text_pr.Set_Strikeout(isStrikeout);
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.paragraphAdd(text_pr);
            this.txBody.content.Set_ApplyToAll(false);
            this.chartGroup.recalculate();
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        }
    },
    setCellAllSubscript: function (isSubscript) {
        if (isRealObject(this.txBody)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
            var text_pr = new ParaTextPr();
            text_pr.Set_VertAlign(isSubscript ? vertalign_SubScript : vertalign_Baseline);
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.paragraphAdd(text_pr);
            this.txBody.content.Set_ApplyToAll(false);
            this.chartGroup.recalculate();
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        }
    },
    setCellAllSuperscript: function (isSuperscript) {
        if (isRealObject(this.txBody)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
            var text_pr = new ParaTextPr();
            text_pr.Set_VertAlign(isSubscript ? vertalign_SuperScript : vertalign_Baseline);
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.paragraphAdd(text_pr);
            this.txBody.content.Set_ApplyToAll(false);
            this.chartGroup.recalculate();
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        }
    },
    setCellAllTextColor: function (color) {
        if (isRealObject(this.txBody)) {
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
            var unifill = new CUniFill();
            unifill.setFill(new CSolidFill());
            unifill.fill.setColor(CorrectUniColor2(color, null));
            var text_pr = new ParaTextPr();
            text_pr.SetUniFill(unifill);
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.paragraphAdd(text_pr);
            this.txBody.content.Set_ApplyToAll(false);
            this.chartGroup.recalculate();
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        }
    },
    setChartGroup: function (chartGroup) {
        var old_value = this.chartGroup ? this.chartGroup.Get_Id() : null;
        var new_value = chartGroup ? chartGroup.Get_Id() : null;
        this.chartGroup = chartGroup;
        this.setDrawingObjects(chartGroup ? chartGroup.drawingObjects : null);
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_AddChartGroup, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataGOSingleProp(old_value, new_value)), null);
    },
    setDrawingObjects: function (drawingObjects) {
        if (isRealObject(drawingObjects) && drawingObjects.getWorksheet()) {
            var newValue = drawingObjects.getWorksheet().model.getId();
            var oldValue = isRealObject(this.drawingObjects) ? this.drawingObjects.getWorksheet().model.getId() : null;
            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetDrawingObjects, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
            this.drawingObjects = drawingObjects;
        }
    },
    Get_Id: function () {
        return this.Id;
    },
    Undo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_AddChartGroup:
            this.chartGroup = g_oTableId.Get_ById(data.oldValue);
            if (isRealObject(this.chartGroup)) {
                this.drawingObjects = this.chartGroup.drawingObjects;
            }
            break;
        case historyitem_AutoShapes_SetDrawingObjects:
            if (data.oldValue !== null) {
                var api = window["Asc"]["editor"];
                if (api.wb) {
                    var ws = api.wb.getWorksheetById(data.oldValue);
                    this.drawingObjects = ws.objectRender;
                }
            }
            break;
        case historyitem_AutoShapes_AddTextBody:
            this.txBody = g_oTableId.Get_ById(data.oldValue);
            break;
        case historyitem_AutoShapes_SetChartTitleLayout:
            this.layout = g_oTableId.Get_ById(data.oldValue);
            break;
        case historyitem_AutoShapes_SetChartTitleType:
            this.type = data.oldValue;
            break;
        }
    },
    Redo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_AddChartGroup:
            this.chartGroup = g_oTableId.Get_ById(data.newValue);
            if (isRealObject(this.chartGroup)) {
                this.drawingObjects = this.chartGroup.drawingObjects;
            }
            break;
        case historyitem_AutoShapes_SetDrawingObjects:
            if (data.oldValue !== null) {
                var api = window["Asc"]["editor"];
                if (api.wb) {
                    var ws = api.wb.getWorksheetById(data.newValue);
                    this.drawingObjects = ws.objectRender;
                }
            }
            break;
        case historyitem_AutoShapes_AddTextBody:
            this.txBody = g_oTableId.Get_ById(data.newValue);
            break;
        case historyitem_AutoShapes_SetChartTitleLayout:
            this.layout = g_oTableId.Get_ById(data.newValue);
            break;
        case historyitem_AutoShapes_SetChartTitleType:
            this.type = data.newValue;
            break;
        }
    },
    getStyles: function () {
        var styles = new CStyles();
        var default_legend_style = new CStyle("defaultLegendStyle", styles.Default, null, styletype_Paragraph);
        default_legend_style.TextPr.themeFont = "Calibri";
        default_legend_style.TextPr.Bold = true;
        if (this.getTitleType() === CHART_TITLE_TYPE_TITLE) {
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
        ++styles.Id;
        return styles;
    },
    initFromString: function (title) {
        this.textBody.initFromString(title);
    },
    setDefaultText: function (val) {
        this.isDefaultText = val;
    },
    recalculateTransform: function () {
        this.transform.Reset();
        global_MatrixTransformer.TranslateAppend(this.transform, this.x, this.y);
        global_MatrixTransformer.MultiplyAppend(this.transform, this.chartGroup.getTransform());
        this.invertTransform = global_MatrixTransformer.Invert(this.transform);
    },
    recalculateTransform2: function () {
        this.transform.Reset();
        global_MatrixTransformer.TranslateAppend(this.transform, this.x, this.y);
        global_MatrixTransformer.MultiplyAppend(this.transform, this.chartGroup.getTransform());
    },
    setTextBody: function (textBody) {
        var oldId = isRealObject(this.txBody) ? this.txBody.Get_Id() : null;
        var newId = isRealObject(textBody) ? textBody.Get_Id() : null;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_AddTextBody, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldId, newId)));
        this.txBody = textBody;
    },
    setLayoutX: function (x) {
        if (!isRealObject(this.layout)) {
            this.setLayout(new CChartLayout());
        }
        this.layout.setX(x);
    },
    setLayoutY: function (y) {
        if (!isRealObject(this.layout)) {
            this.setLayout(new CChartLayout());
        }
        this.layout.setY(y);
    },
    addTextBody: function (txBody) {
        this.txBody = txBody;
    },
    paragraphAdd: function (paraItem, bRecalculate) {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        if (!isRealObject(this.txBody)) {
            this.txBody = new CTextBody(this);
        }
        this.txBody.paragraphAdd(paraItem);
        this.recalculatePosExt();
        this.txBody.recalculateCurPos();
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        return;
    },
    recalculatePosExt: function () {
        var old_cx = this.x + this.extX * 0.5;
        var old_cy = this.y + this.extY * 0.5;
        var bodyPr = this.txBody.getBodyPr();
        switch (this.type) {
        case CHART_TITLE_TYPE_TITLE:
            case CHART_TITLE_TYPE_H_AXIS:
            var max_title_width = this.chartGroup.extX * 0.8;
            var title_width = this.txBody.getRectWidth(max_title_width);
            this.extX = title_width;
            this.extY = this.txBody.getRectHeight(this.chartGroup.extY, title_width - (bodyPr.rIns + bodyPr.lIns));
            this.x = old_cx - this.extX * 0.5;
            if (this.x + this.extX > this.chartGroup.extX) {
                this.x = this.chartGroup.extX - this.extX;
            }
            if (this.x < 0) {
                this.x = 0;
            }
            this.y = old_cy - this.extY * 0.5;
            if (this.y + this.extY > this.chartGroup.extY) {
                this.y = this.chartGroup.extY - this.extY;
            }
            if (this.y < 0) {
                this.y = 0;
            }
            if (isRealObject(this.layout) && isRealNumber(this.layout.x)) {
                this.layout.setX(this.x / this.chartGroup.extX);
            }
            break;
        case CHART_TITLE_TYPE_V_AXIS:
            var max_title_height = this.chartGroup.extY * 0.8;
            var body_pr = this.txBody.getBodyPr();
            this.extY = this.txBody.getRectWidth(max_title_height) - body_pr.rIns - body_pr.lIns + body_pr.tIns + body_pr.bIns;
            this.extX = this.txBody.getRectHeight(this.chartGroup.extX, this.extY) - (-body_pr.rIns - body_pr.lIns + body_pr.tIns + body_pr.bIns);
            this.spPr.geometry.Recalculate(this.extX, this.extY);
            this.x = old_cx - this.extX * 0.5;
            if (this.x + this.extX > this.chartGroup.extX) {
                this.x = this.chartGroup.extX - this.extX;
            }
            if (this.x < 0) {
                this.x = 0;
            }
            this.y = old_cy - this.extY * 0.5;
            if (this.y + this.extY > this.chartGroup.extY) {
                this.y = this.chartGroup.extY - this.extY;
            }
            if (this.y < 0) {
                this.y = 0;
            }
            if (isRealObject(this.layout) && isRealNumber(this.layout.y)) {
                this.layout.setY(this.y / this.chartGroup.extY);
            }
            break;
        }
        this.spPr.geometry.Recalculate(this.extX, this.extY);
        this.recalculateTransform();
        this.calculateTransformTextMatrix();
        this.calculateContent();
    },
    getFullRotate: function () {
        return 0;
    },
    getFullFlip: function () {
        return {
            flipH: false,
            flipV: false
        };
    },
    addNewParagraph: function () {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        this.txBody.addNewParagraph();
        this.recalculatePosExt();
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
    },
    remove: function (direction, bOnlyText) {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
        this.txBody.remove(direction, bOnlyText);
        this.recalculatePosExt();
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(this.chartGroup.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
    },
    updateSelectionState: function (drawingDocument) {
        this.txBody.updateSelectionState(drawingDocument);
    },
    recalculateCurPos: function () {
        if (this.txBody) {
            this.txBody.recalculateCurPos();
        }
    },
    drawTextSelection: function () {
        if (isRealObject(this.txBody)) {
            this.txBody.drawTextSelection();
        }
    },
    calculateContent: function () {
        if (this.txBody) {
            this.txBody.calculateContent();
        }
    },
    getColorMap: function () {
        return this.chartGroup.drawingObjects.controller.getColorMap();
    },
    getTheme: function () {
        return this.chartGroup.drawingObjects.getWorkbook().theme;
    },
    calculateTransformTextMatrix: function () {
        if (this.txBody === null) {
            return;
        }
        this.transformText.Reset();
        var _text_transform = this.transformText;
        var _shape_transform = this.transform;
        var _body_pr = this.txBody.getBodyPr();
        var _content_height = this.txBody.getSummaryHeight();
        var _l, _t, _r, _b;
        var _t_x_lt, _t_y_lt, _t_x_rt, _t_y_rt, _t_x_lb, _t_y_lb, _t_x_rb, _t_y_rb;
        if (isRealObject(this.spPr.geometry) && isRealObject(this.spPr.geometry.rect)) {
            var _rect = this.spPr.geometry.rect;
            _l = _rect.l + _body_pr.lIns;
            _t = _rect.t + _body_pr.tIns;
            _r = _rect.r - _body_pr.rIns;
            _b = _rect.b - _body_pr.bIns;
        } else {
            _l = _body_pr.lIns;
            _t = _body_pr.tIns;
            _r = this.extX - _body_pr.rIns;
            _b = this.extY - _body_pr.bIns;
        }
        if (_l >= _r) {
            var _c = (_l + _r) * 0.5;
            _l = _c - 0.01;
            _r = _c + 0.01;
        }
        if (_t >= _b) {
            _c = (_t + _b) * 0.5;
            _t = _c - 0.01;
            _b = _c + 0.01;
        }
        _t_x_lt = _shape_transform.TransformPointX(_l, _t);
        _t_y_lt = _shape_transform.TransformPointY(_l, _t);
        _t_x_rt = _shape_transform.TransformPointX(_r, _t);
        _t_y_rt = _shape_transform.TransformPointY(_r, _t);
        _t_x_lb = _shape_transform.TransformPointX(_l, _b);
        _t_y_lb = _shape_transform.TransformPointY(_l, _b);
        _t_x_rb = _shape_transform.TransformPointX(_r, _b);
        _t_y_rb = _shape_transform.TransformPointY(_r, _b);
        var _dx_t, _dy_t;
        _dx_t = _t_x_rt - _t_x_lt;
        _dy_t = _t_y_rt - _t_y_lt;
        var _dx_lt_rb, _dy_lt_rb;
        _dx_lt_rb = _t_x_rb - _t_x_lt;
        _dy_lt_rb = _t_y_rb - _t_y_lt;
        var _vertical_shift;
        var _text_rect_height = _b - _t;
        var _text_rect_width = _r - _l;
        if (! (_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270)) {
            if (_content_height < _text_rect_height) {
                switch (_body_pr.anchor) {
                case 0:
                    _vertical_shift = _text_rect_height - _content_height;
                    break;
                case 1:
                    _vertical_shift = (_text_rect_height - _content_height) * 0.5;
                    break;
                case 2:
                    _vertical_shift = (_text_rect_height - _content_height) * 0.5;
                    break;
                case 3:
                    _vertical_shift = (_text_rect_height - _content_height) * 0.5;
                    break;
                case 4:
                    _vertical_shift = 0;
                    break;
                }
            } else {
                _vertical_shift = 0;
            }
            global_MatrixTransformer.TranslateAppend(_text_transform, 0, _vertical_shift);
            if (_dx_lt_rb * _dy_t - _dy_lt_rb * _dx_t <= 0) {
                var alpha = Math.atan2(_dy_t, _dx_t);
                global_MatrixTransformer.RotateRadAppend(_text_transform, -alpha);
                global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_lt, _t_y_lt);
            } else {
                alpha = Math.atan2(_dy_t, _dx_t);
                global_MatrixTransformer.RotateRadAppend(_text_transform, Math.PI - alpha);
                global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_rt, _t_y_rt);
            }
        } else {
            if (_content_height < _text_rect_width) {
                switch (_body_pr.anchor) {
                case 0:
                    _vertical_shift = _text_rect_width - _content_height;
                    break;
                case 1:
                    _vertical_shift = (_text_rect_width - _content_height) * 0.5;
                    break;
                case 2:
                    _vertical_shift = (_text_rect_width - _content_height) * 0.5;
                    break;
                case 3:
                    _vertical_shift = (_text_rect_width - _content_height) * 0.5;
                    break;
                case 4:
                    _vertical_shift = 0;
                    break;
                }
            } else {
                _vertical_shift = 0;
            }
            global_MatrixTransformer.TranslateAppend(_text_transform, 0, _vertical_shift);
            var _alpha;
            _alpha = Math.atan2(_dy_t, _dx_t);
            if (_body_pr.vert === nVertTTvert) {
                if (_dx_lt_rb * _dy_t - _dy_lt_rb * _dx_t <= 0) {
                    global_MatrixTransformer.RotateRadAppend(_text_transform, -_alpha - Math.PI * 0.5);
                    global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_rt, _t_y_rt);
                } else {
                    global_MatrixTransformer.RotateRadAppend(_text_transform, Math.PI * 0.5 - _alpha);
                    global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_lt, _t_y_lt);
                }
            } else {
                if (_dx_lt_rb * _dy_t - _dy_lt_rb * _dx_t <= 0) {
                    global_MatrixTransformer.RotateRadAppend(_text_transform, -_alpha - Math.PI * 1.5);
                    global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_lb, _t_y_lb);
                } else {
                    global_MatrixTransformer.RotateRadAppend(_text_transform, -Math.PI * 0.5 - _alpha);
                    global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_rb, _t_y_rb);
                }
            }
        }
        if (isRealObject(this.spPr.geometry) && isRealObject(this.spPr.geometry.rect)) {
            var rect = this.spPr.geometry.rect;
            this.clipRect = {
                x: rect.l,
                y: rect.t,
                w: rect.r - rect.l,
                h: rect.b - rect.t
            };
        } else {
            this.clipRect = {
                x: 0,
                y: 0,
                w: this.absExtX,
                h: this.absExtY
            };
        }
        this.invertTransformText = global_MatrixTransformer.Invert(this.transformText);
    },
    recalculateAfterTextAdd: function () {
        switch (this.type) {
        case CHART_TITLE_TYPE_TITLE:
            var body_pr = this.txBody.bodyPr;
            var r_ins = isRealNumber(body_pr.rIns) ? body_pr.rIns : 1.27;
            var l_ins = isRealNumber(body_pr.lIns) ? body_pr.lIns : 2.54;
            var t_ins = isRealNumber(body_pr.tIns) ? body_pr.tIns : 1.27;
            var b_ins = isRealNumber(body_pr.bIns) ? body_pr.bIns : 1.27;
            var max_width = this.chartGroup.extX * 0.8 - r_ins - l_ins;
            var title_content = this.txBody.content;
            title_content.Reset(0, 0, max_width, 20000);
            title_content.Recalculate_Page(0);
            var result_width;
            if (! (title_content.Content.length > 1 || title_content.Content[0].Lines.length > 1)) {
                if (title_content.Content[0].Lines[0].Ranges[0].W < max_width) {
                    title_content.Reset(0, 0, title_content.Content[0].Lines[0].Ranges[0].W, 20000);
                    title_content.Recalculate_Page(0);
                }
                result_width = title_content.Content[0].Lines[0].Ranges[0].W + r_ins + l_ins;
            } else {
                var width = 0;
                for (var i = 0; i < title_content.Content.length; ++i) {
                    var par = title_content.Content[i];
                    for (var j = 0; j < par.Lines.length; ++j) {
                        if (par.Lines[j].Ranges[0].W > width) {
                            width = par.Lines[j].Ranges[0].W;
                        }
                    }
                }
                result_width = width + r_ins + l_ins;
            }
            this.extX = result_width;
            this.extY = title_content.Get_SummaryHeight() + r_ins + l_ins;
            this.x = this.chartGroup.extX - this.extX * 0.5;
            this.y = 2.5;
            break;
        }
    },
    recalculateBrush: function () {},
    recalculatePen: function () {},
    draw: function (graphics) {
        if (! (graphics.ClearMode === true)) {
            graphics.SetIntegerGrid(false);
            graphics.transform3(this.transformText);
            this.txBody.draw(graphics);
            graphics.reset();
            graphics.SetIntegerGrid(true);
        }
    },
    selectionSetStart: function (e, x, y) {
        var t_x, t_y;
        t_x = this.invertTransformText.TransformPointX(x, y);
        t_y = this.invertTransformText.TransformPointY(x, y);
        var event = new CMouseEventHandler();
        event.fromJQueryEvent(e);
        this.txBody.selectionSetStart(event, t_x, t_y);
    },
    selectionSetEnd: function (e, x, y) {
        var t_x, t_y;
        t_x = this.invertTransformText.TransformPointX(x, y);
        t_y = this.invertTransformText.TransformPointY(x, y);
        var event = new CMouseEventHandler();
        event.fromJQueryEvent(e);
        this.txBody.selectionSetEnd(event, t_x, t_y);
    },
    setPosition: function (x, y) {
        if (!isRealObject(this.layout)) {
            this.setLayout(new CChartLayout());
        }
        this.layout.setIsManual(true);
        this.layout.setXMode(LAYOUT_MODE_EDGE);
        this.layout.setX(x / this.chartGroup.extX);
        this.layout.setYMode(LAYOUT_MODE_EDGE);
        this.layout.setY(y / this.chartGroup.extY);
    },
    setLayout: function (layout) {
        var oldValue = this.layout ? this.layout.Get_Id() : null;
        var newValue = layout ? layout.Get_Id() : null;
        this.layout = layout;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetChartTitleLayout, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
    },
    setOverlay: function (overlay) {
        var oldValue = this.overlay;
        var newValue = overlay;
        this.overlay = overlay;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_SetChartOverlay, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
    },
    getRectBounds: function () {
        var transform = this.getTransform();
        var w = this.extX;
        var h = this.extY;
        var rect_points = [{
            x: 0,
            y: 0
        },
        {
            x: w,
            y: 0
        },
        {
            x: w,
            y: h
        },
        {
            x: 0,
            y: h
        }];
        var min_x, max_x, min_y, max_y;
        min_x = transform.TransformPointX(rect_points[0].x, rect_points[0].y);
        min_y = transform.TransformPointY(rect_points[0].x, rect_points[0].y);
        max_x = min_x;
        max_y = min_y;
        var cur_x, cur_y;
        for (var i = 1; i < 4; ++i) {
            cur_x = transform.TransformPointX(rect_points[i].x, rect_points[i].y);
            cur_y = transform.TransformPointY(rect_points[i].x, rect_points[i].y);
            if (cur_x < min_x) {
                min_x = cur_x;
            }
            if (cur_x > max_x) {
                max_x = cur_x;
            }
            if (cur_y < min_y) {
                min_y = cur_y;
            }
            if (cur_y > max_y) {
                max_y = cur_y;
            }
        }
        return {
            minX: min_x,
            maxX: max_x,
            minY: min_y,
            maxY: max_y
        };
    },
    hit: function (x, y) {
        return this.hitInInnerArea(x, y) || this.hitInPath(x, y) || this.hitInTextRect(x, y);
    },
    hitInPath: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        if (isRealObject(this.spPr.geometry)) {
            return this.spPr.geometry.hitInPath(this.drawingObjects.getCanvasContext(), x_t, y_t);
        }
        return false;
    },
    hitInInnerArea: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        if (isRealObject(this.spPr.geometry)) {
            return this.spPr.geometry.hitInInnerArea(this.drawingObjects.getCanvasContext(), x_t, y_t);
        }
        return x_t > 0 && x_t < this.extX && y_t > 0 && y_t < this.extY;
    },
    hitInTextRect: function (x, y) {
        if (isRealObject(this.txBody)) {
            var t_x, t_y;
            t_x = this.invertTransformText.TransformPointX(x, y);
            t_y = this.invertTransformText.TransformPointY(x, y);
            return t_x > 0 && t_x < this.txBody.contentWidth && t_y > 0 && t_y < this.txBody.contentHeight;
        }
        return false;
    },
    hitInBoundingRect: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        var _hit_context = this.drawingObjects.getCanvasContext();
        return (HitInLine(_hit_context, x_t, y_t, 0, 0, this.extX, 0) || HitInLine(_hit_context, x_t, y_t, this.extX, 0, this.extX, this.extY) || HitInLine(_hit_context, x_t, y_t, this.extX, this.extY, 0, this.extY) || HitInLine(_hit_context, x_t, y_t, 0, this.extY, 0, 0));
    },
    getInvertTransform: function () {
        return this.invertTransform;
    },
    getAllFonts: function (AllFonts) {
        if (this.txBody && this.txBody.content) {
            this.txBody.content.Document_Get_AllFontNames(AllFonts);
        }
    },
    writeToBinary: function (w) {
        w.WriteBool(isRealObject(this.layout));
        if (isRealObject(this.layout)) {
            this.layout.writeToBinary(w);
        }
        w.WriteBool(this.overlay);
        this.spPr.Write_ToBinary2(w);
        w.WriteBool(isRealObject(this.txBody));
        if (isRealObject(this.txBody)) {
            this.txBody.writeToBinary(w);
        }
    },
    readFromBinary: function (r) {
        if (r.GetBool()) {
            this.setLayout(new CChartLayout());
            this.layout.readFromBinary(r);
        }
        this.setOverlay(r.GetBool());
        this.spPr.Read_FromBinary2(r);
        if (r.GetBool()) {
            this.setTextBody(new CTextBody(this));
            this.txBody.readFromBinary(r);
        }
    },
    OnContentRecalculate: function () {
        if (this.chartGroup) {
            this.chartGroup.recalculate();
        }
    }
};