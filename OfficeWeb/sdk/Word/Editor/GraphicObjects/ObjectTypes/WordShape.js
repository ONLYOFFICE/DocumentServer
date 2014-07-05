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
 var MIN_SHAPE_DIST = 5.08;
function WordShape(parent, document, drawingDocument, group) {
    this.parent = parent;
    this.document = document;
    this.document = editor.WordControl.m_oLogicDocument;
    this.drawingDocument = drawingDocument;
    this.drawingDocument = this.document.DrawingDocument;
    if (parent !== null && typeof parent === "object" && typeof parent.pageIndex === "number") {
        this.pageIndex = parent.pageIndex;
    }
    this.spPr = new CSpPr();
    this.style = null;
    this.textBoxContent = null;
    this.bodyPr = new CBodyPr();
    this.bodyPr.setDefault();
    this.group = (group !== null && typeof group === "object") ? group : null;
    this.mainGroup = null;
    this.brush = null;
    this.pen = null;
    this.absOffsetX = null;
    this.absOffsetY = null;
    this.absExtX = null;
    this.absExtY = null;
    this.absRot = null;
    this.absFlipH = null;
    this.absFlipV = null;
    this.absXLT = null;
    this.absYLT = null;
    this.transform = null;
    this.transformText = new CMatrix();
    this.invertTextMatrix = new CMatrix();
    this.ownTransform = new CMatrix();
    this.selected = false;
    this.selectStartPage = -1;
    this.contentWidth = 0;
    this.contentHeight = 0;
    this.clipRect = {
        x: 0,
        y: 0,
        w: 0,
        h: 0
    };
    this.wrapPolygon = null;
    this.recalcInfo = {
        recalculateTransform: true,
        recalculateTextTransform: true,
        recalculateBrush: true,
        recalculatePen: true,
        recalculateContent: true,
        recalculateCursorTypes: true
    };
    g_oTableId.Add(this, g_oIdCounter.Get_NewId());
}
WordShape.prototype = {
    RecalculateLocalTransform: function () {},
    RecalculateLocalTransformText: function () {},
    calculateAfterOpen10: function () {
        var xfrm = this.spPr.xfrm;
        if (this.spPr.geometry) {
            this.spPr.geometry.Init(xfrm.extX, xfrm.extY);
        }
        this.setAbsoluteTransform(xfrm.offX, xfrm.offY, xfrm.extX, xfrm.extY, xfrm.rot == null ? 0 : xfrm.rot, xfrm.flipH == null ? false : xfrm.flipH, xfrm.flipV == null ? false : xfrm.flipV, false);
        this.calculateTransformMatrix();
        this.calculateFill();
        this.calculateLine();
    },
    canFill: function () {
        if (this.spPr && this.spPr.geometry) {
            return this.spPr.geometry.canFill();
        }
        return true;
    },
    Search_GetId: function (bNext, bCurrent) {
        return this.textBoxContent ? this.textBoxContent.Search_GetId(bNext, bCurrent) : null;
    },
    isShape: function () {
        return true;
    },
    recalcTransform: function () {
        this.recalcInfo.recalculateTransform = true;
        this.recalcInfo.recalculateTextTransform = true;
    },
    recalculate2: function () {
        if (this.recalcInfo.recalculateBrush) {
            this.calculateFill();
            this.recalcInfo.recalculateBrush = false;
        }
        if (this.recalcInfo.recalculatePen) {
            this.calculateLine();
            this.recalcInfo.recalculatePen = false;
        }
        if (this.recalcInfo.recalculateTransform.recalculateTransform) {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = true;
        }
        if (this.recalcInfo.recalculateContent) {
            this.calculateContent();
            this.recalcInfo.recalculateContent = false;
        }
        if (this.recalcInfo.recalculateTextTransform) {
            this.calculateTransformTextMatrix();
            this.recalcInfo.recalculateTextTransform = false;
        }
    },
    recalculateTransform: function () {
        if (!isRealObject(this.group)) {
            var xfrm = this.spPr.xfrm;
            this.absOffsetX = isRealNumber(this.absOffsetX) ? this.absOffsetX : 0;
            this.absOffsetX = isRealNumber(this.absOffsetY) ? this.absOffsetY : 0;
            this.absExtX = xfrm.extX;
            this.absExtY = xfrm.extY;
            this.absRot = isRealNumber(xfrm.rot) ? xfrm.rot : 0;
            this.absFlipH = xfrm.flipH === true;
            this.absFlipV = xfrm.flipV === true;
        } else {
            var xfrm;
            xfrm = this.spPr.xfrm;
            var scale_scale_coefficients = this.group.getResultScaleCoefficients();
            this.x = scale_scale_coefficients.cx * (xfrm.offX - this.group.spPr.xfrm.chOffX);
            this.y = scale_scale_coefficients.cy * (xfrm.offY - this.group.spPr.xfrm.chOffY);
            this.extX = scale_scale_coefficients.cx * xfrm.extX;
            this.extY = scale_scale_coefficients.cy * xfrm.extY;
            this.rot = isRealNumber(xfrm.rot) ? xfrm.rot : 0;
            this.flipH = xfrm.flipH === true;
            this.flipV = xfrm.flipV === true;
        }
        this.transform.Reset();
        var hc = this.extX * 0.5;
        var vc = this.extY * 0.5;
        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);
        if (this.absFlipH) {
            global_MatrixTransformer.ScaleAppend(this.transform, -1, 1);
        }
        if (this.absFlipV) {
            global_MatrixTransformer.ScaleAppend(this.transform, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(this.transform, -this.absRot);
        global_MatrixTransformer.TranslateAppend(this.transform, this.absOffsetX + hc, this.absOffsetY + vc);
        if (isRealObject(this.group)) {
            global_MatrixTransformer.MultiplyAppend(this.transform, this.group.getTransformMatrix());
        }
        this.invertTransform = global_MatrixTransformer.Invert(this.transform);
    },
    recalculate: function () {},
    Selection_Is_TableBorderMove: function () {
        if (isRealObject(this.textBoxContent)) {
            return this.textBoxContent.Selection_Is_TableBorderMove();
        }
        return false;
    },
    isCurrentElementParagraph: function () {
        if (isRealObject(this.textBoxContent)) {
            return this.textBoxContent.Is_CurrentElementParagraph();
        }
        return false;
    },
    isCurrentElementTable: function () {
        if (isRealObject(this.textBoxContent)) {
            return this.textBoxContent.Is_CurrentElementTable();
        }
        return false;
    },
    isImage: function () {
        return false;
    },
    Get_Id: function () {
        return this.Id;
    },
    Get_Numbering: function () {
        return this.document.Get_Numbering();
    },
    Get_Styles: function () {
        return this.document.Get_Styles();
    },
    Get_TableStyleForPara: function () {
        return this.document.Get_TableStyleForPara();
    },
    Is_Cell: function () {
        return false;
    },
    Is_DrawingShape: function () {
        return true;
    },
    Is_InTable: function (bReturnTopTable) {
        if (true === bReturnTopTable) {
            return null;
        }
        return false;
    },
    init: function (presetGeom, posX, posY, extX, extY, flipH, flipV, beginFlag, endFlag) {
        var data = {
            Type: historyitem_InitShape,
            presetGeom: presetGeom,
            posX: posX,
            posY: posY,
            extX: extX,
            extY: extY,
            flipH: flipH,
            flipV: flipV,
            begin: beginFlag,
            end: endFlag
        };
        data.Type = historyitem_InitShape;
        History.Add(this, data);
        if (beginFlag || endFlag) {
            this.spPr.ln = new CLn();
        }
        if (beginFlag) {
            this.spPr.ln.headEnd = new EndArrow();
            this.spPr.ln.headEnd.type = LineEndType.Arrow;
            this.spPr.ln.headEnd.w = LineEndSize.Mid;
            this.spPr.ln.headEnd.len = LineEndSize.Mid;
        }
        if (endFlag) {
            this.spPr.ln.tailEnd = new EndArrow();
            this.spPr.ln.tailEnd.type = LineEndType.Arrow;
            this.spPr.ln.tailEnd.w = LineEndSize.Mid;
            this.spPr.ln.tailEnd.len = LineEndSize.Mid;
        }
        this.addGeometry(this.document.DrawingObjects.currentPresetGeom);
        this.style = CreateDefaultShapeStyle();
        this.calculate();
        this.setXfrm(0, 0, extX, extY, 0, flipH, flipV);
        this.setAbsoluteTransform(posX, posY, extX, extY, 0, flipH, flipV);
        this.spPr.geometry.Init(extX, extY);
        return this;
    },
    setParagraphKeepLines: function (Value) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Set_ParagraphKeepLines(Value);
        }
    },
    setParagraphKeepNext: function (Value) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Set_ParagraphKeepNext(Value);
        }
    },
    setParagraphWidowControl: function (Value) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Set_ParagraphWidowControl(Value);
        }
    },
    setParagraphPageBreakBefore: function (Value) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Set_ParagraphPageBreakBefore(Value);
        }
    },
    init2: function (presetGeom, posX, posY, extX, extY, flipH, flipV, beginFlag, endFlag) {
        var data = {
            Type: historyitem_Init2Shape,
            presetGeom: presetGeom,
            posX: posX,
            posY: posY,
            extX: extX,
            extY: extY,
            flipH: flipH,
            flipV: flipV,
            begin: beginFlag,
            end: endFlag
        };
        History.Add(this, data);
        this.addGeometry(presetGeom);
        var style = new CShapeStyle();
        style.lnRef = new StyleRef();
        style.lnRef.idx = 0;
        style.lnRef.Color.color = new CSchemeColor();
        style.lnRef.Color.color.id = g_clr_accent1;
        style.lnRef.Color.Mods.Mods.push({
            name: "shade",
            val: 50000
        });
        style.fillRef = new StyleRef();
        style.fillRef.idx = 0;
        style.fillRef.Color.color = new CSchemeColor();
        style.fillRef.Color.color.id = g_clr_accent1;
        style.effectRef = new StyleRef();
        style.effectRef.idx = 0;
        style.effectRef.Color.color = new CSchemeColor();
        style.effectRef.Color.color.id = g_clr_accent1;
        style.fontRef = new FontRef();
        style.fontRef.idx = fntStyleInd_minor;
        style.fontRef.Color = new CUniColor();
        style.fontRef.Color.color = new CSchemeColor();
        style.fontRef.Color.color.id = 8;
        this.style = style;
        var pen = new CLn();
        pen.w = 6350;
        pen.Fill = new CUniFill();
        pen.Fill.fill = new CSolidFill();
        pen.Fill.fill.color.color = new CPrstColor();
        pen.Fill.fill.color.color.id = "black";
        var brush = new CUniFill();
        brush.fill = new CSolidFill();
        brush.fill.color.color = new CSchemeColor();
        brush.fill.color.color.id = 12;
        this.spPr.Fill = brush;
        this.spPr.ln = pen;
        this.calculate();
        this.setAbsoluteTransform(posX, posY, extX, extY, 0, flipH, flipV);
        this.setXfrm(0, 0, extX, extY, 0, flipH, flipV);
        this.spPr.geometry.Init(extX, extY);
        this.transform = new CMatrix();
        global_MatrixTransformer.TranslateAppend(this.transform, posX, posY);
        this.ownTransform = new CMatrix();
        global_MatrixTransformer.TranslateAppend(this.ownTransform, posX, posY);
        this.textBoxContent = new CDocumentContent(this, this.drawingDocument, 0, 0, 0, 0, false, false);
        this.textBoxContent.Reset(0, 0, 0, 20000);
        this.calculateContent();
        this.transformText = new CMatrix();
        this.calculateTransformTextMatrix();
        History.Add(this, {
            Type: historyitem_AddDocContent,
            contentId: this.textBoxContent.Get_Id()
        });
        return this;
    },
    Check_TableCoincidence: function (Table) {
        if (!isRealObject(this.group)) {
            if (isRealObject(this.parent)) {
                return this.parent.Parent.Parent.Check_TableCoincidence(Table);
            }
        } else {
            var cur_group = this.group;
            while (isRealObject(cur_group.group)) {
                cur_group = cur_group.group;
            }
            if (isRealObject(cur_group.parent) && isRealObject(cur_group.parent.Parent) && isRealObject(cur_group.parent.Parent.Parent)) {
                return cur_group.parent.Parent.Parent.Check_TableCoincidence(Table);
            }
        }
        return false;
    },
    Set_CurrentElement: function () {
        var doc_content;
        if (!isRealObject(this.group)) {
            if (isRealObject(this.parent) && isRealObject(this.parent.Parent) && isRealObject(this.parent.Parent.Parent)) {
                doc_content = this.parent.Parent.Parent;
            }
        } else {
            var cur_group = this.group;
            while (isRealObject(cur_group.group)) {
                cur_group = cur_group.group;
            }
            if (isRealObject(cur_group.parent) && isRealObject(cur_group.parent.Parent) && isRealObject(cur_group.parent.Parent.Parent)) {
                doc_content = cur_group.parent.Parent.Parent;
            }
        }
        var graphic_objects = editor.WordControl.m_oLogicDocument.DrawingObjects;
        graphic_objects.resetSelection();
        if (isRealObject(doc_content)) {
            if (!isRealObject(this.group)) {
                this.parent.select(this.textBoxContent.Get_StartPage_Absolute());
                graphic_objects.selectionInfo.selectionArray.push(this.parent);
                graphic_objects.curState = new TextAddState(graphic_objects, this.parent);
            } else {
                if (isRealObject(cur_group)) {
                    cur_group.parent.select(this.textBoxContent.Get_StartPage_Absolute());
                    graphic_objects.selectionInfo.selectionArray.push(cur_group.parent);
                    graphic_objects.curState = new TextAddInGroup(graphic_objects, this, cur_group);
                    this.select(this.textBoxContent.Get_StartPage_Absolute());
                    cur_group.selectionInfo.selectionArray.push(this);
                }
            }
            var hdr_ftr = doc_content.Is_HdrFtr(true);
            if (!isRealObject(hdr_ftr)) {
                var LogicDocument = editor.WordControl.m_oLogicDocument;
                LogicDocument.CurPos.Type = docpostype_DrawingObjects;
                LogicDocument.Document_UpdateInterfaceState();
                LogicDocument.Document_UpdateRulersState();
                LogicDocument.Document_UpdateSelectionState();
            } else {
                editor.WordControl.m_oLogicDocument.CurPos.Type = docpostype_HdrFtr;
                hdr_ftr.Content.CurPos.Type = docpostype_DrawingObjects;
                hdr_ftr.Set_CurrentElement();
            }
            this.document.DrawingDocument.UpdateTargetTransform(this.transformText);
        }
    },
    Is_ThisElementCurrent: function () {
        return false;
    },
    getBase64Object: function () {
        var w = new CMemory();
        this.Write_ToBinary2(w);
        return w.GetBase64Memory();
    },
    getBase64Img: function () {
        return ShapeToImageConverter(this, this.pageIndex).ImageUrl;
    },
    getPageIndex: function () {
        return this.pageIndex;
    },
    setParagraphStyle: function (style) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Set_ParagraphStyle(style);
        }
    },
    Search: function (Str, Props, SearchEngine, Type) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Search(Str, Props, SearchEngine, Type);
        }
    },
    Get_PageContentStartPos: function (pageNum) {
        if (this.textBoxContent) {
            if (this.spPr.geometry && this.spPr.geometry.rect) {
                var rect = this.spPr.geometry.rect;
                return {
                    X: 0,
                    Y: 0,
                    XLimit: rect.r - rect.l,
                    YLimit: 20000
                };
            } else {
                return {
                    X: 0,
                    Y: 0,
                    XLimit: this.absExtX,
                    YLimit: 20000
                };
            }
        }
        return null;
    },
    setStartPage: function (pageIndex) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Set_StartPage(pageIndex);
        }
    },
    OnContentRecalculate: function () {},
    OnEndRecalculate_Page: function (bLastPage) {
        if (this.bodyPr.anchor !== VERTICAL_ANCHOR_TYPE_TOP) {
            this.calculateTransformTextMatrix();
        }
        var arr_graphic_objects = this.textBoxContent.Get_AllDrawingObjects();
        for (var i = 0; i < arr_graphic_objects.length; ++i) {
            global_MatrixTransformer.MultiplyAppend(arr_graphic_objects[i].getTransformMatrix(), this.transformText);
            if (arr_graphic_objects[i].GraphicObj instanceof CChartAsGroup) {
                var obj = arr_graphic_objects[i].GraphicObj;
                obj.invertTransform = global_MatrixTransformer.Invert(obj.transform);
                if (isRealObject(obj.chartTitle)) {
                    global_MatrixTransformer.MultiplyAppend(obj.chartTitle.transform, this.transformText);
                    global_MatrixTransformer.MultiplyAppend(obj.chartTitle.transformText, this.transformText);
                    obj.chartTitle.invertTransform = global_MatrixTransformer.Invert(obj.chartTitle.transform);
                    obj.chartTitle.invertTransformText = global_MatrixTransformer.Invert(obj.chartTitle.transformText);
                }
                if (isRealObject(obj.hAxisTitle)) {
                    global_MatrixTransformer.MultiplyAppend(obj.hAxisTitle.transform, this.transformText);
                    global_MatrixTransformer.MultiplyAppend(obj.hAxisTitle.transformText, this.transformText);
                    obj.hAxisTitle.invertTransform = global_MatrixTransformer.Invert(obj.hAxisTitle.transform);
                    obj.hAxisTitle.invertTransformText = global_MatrixTransformer.Invert(obj.hAxisTitle.transformText);
                }
                if (isRealObject(obj.vAxisTitle)) {
                    global_MatrixTransformer.MultiplyAppend(obj.vAxisTitle.transform, this.transformText);
                    global_MatrixTransformer.MultiplyAppend(obj.vAxisTitle.transformText, this.transformText);
                    obj.vAxisTitle.invertTransform = global_MatrixTransformer.Invert(obj.vAxisTitle.transform);
                    obj.vAxisTitle.invertTransformText = global_MatrixTransformer.Invert(obj.vAxisTitle.transformText);
                }
            }
            arr_graphic_objects[i].updateCursorTypes();
        }
    },
    getArrContentDrawingObjects: function () {
        if (isRealObject(this.textBoxContent)) {
            return this.textBoxContent.Get_AllDrawingObjects();
        }
        return [];
    },
    OnContentReDraw: function () {
        if (!isRealObject(this.group)) {
            if (isRealObject(this.parent)) {
                this.parent.OnContentReDraw();
            }
        } else {
            var cur_group = this.group;
            while (isRealObject(cur_group.group)) {
                cur_group = cur_group.group;
            }
            if (isRealObject(cur_group) && isRealObject(cur_group.parent)) {
                cur_group.parent.OnContentReDraw();
            }
        }
    },
    Get_ParentObject_or_DocumentPos: function () {
        return null;
    },
    calculate: function () {
        if (this.group !== null) {
            var _temp_main_group = this.group;
            while (_temp_main_group.group !== null) {
                _temp_main_group = _temp_main_group.group;
            }
            this.mainGroup = _temp_main_group;
        }
        this.calculateFill();
        this.calculateLine();
    },
    calculateInGroup: function () {
        var xfrm = this.spPr.xfrm;
        if (this.spPr.geometry) {
            this.spPr.geometry.Init(xfrm.extX, xfrm.extY);
        }
        this.calculateFill();
        this.calculateLine();
    },
    selectAll: function () {
        if (this.textBoxContent) {
            this.textBoxContent.Select_All();
        }
    },
    calculateAfterOpen: function () {
        var xfrm = this.spPr.xfrm;
        this.setAbsoluteTransform(xfrm.offX, xfrm.offY, xfrm.extX, xfrm.extY, xfrm.rot == null ? 0 : xfrm.rot, xfrm.flipH == null ? false : xfrm.flipH, xfrm.flipV == null ? false : xfrm.flipV, false);
        if (this.spPr.geometry) {
            this.spPr.geometry.Init(xfrm.extX, xfrm.extY);
        }
        this.calculateTransformMatrix();
        this.calculateFill();
        this.calculateLine();
    },
    calculateAfterOpenInGroup: function () {
        var xfrm = this.spPr.xfrm;
        var rot = xfrm.rot == null ? 0 : xfrm.rot;
        var flip_h = xfrm.flipH == null ? false : xfrm.flipH;
        var flip_v = xfrm.flipV == null ? false : xfrm.flipV;
        this.parent = new ParaDrawing(null, null, this, editor.WordControl.m_oLogicDocument.DrawingDocument, null, null);
        this.parent.Set_GraphicObject(this);
        this.setAbsoluteTransform(xfrm.offX, xfrm.offY, xfrm.extX, xfrm.extY, rot, flip_h, flip_v, false);
        if (this.spPr.geometry) {
            this.spPr.geometry.Init(xfrm.extX, xfrm.extY);
        }
        this.calculateLine();
        this.calculateFill();
    },
    calculateAfterOpenInGroup2: function () {
        var xfrm = this.spPr.xfrm;
        var rot = xfrm.rot == null ? 0 : xfrm.rot;
        var flip_h = xfrm.flipH == null ? false : xfrm.flipH;
        var flip_v = xfrm.flipV == null ? false : xfrm.flipV;
        this.setAbsoluteTransform(xfrm.offX, xfrm.offY, xfrm.extX, xfrm.extY, rot, flip_h, flip_v, false);
        if (this.spPr.geometry) {
            this.spPr.geometry.Init(xfrm.extX, xfrm.extY);
        }
        this.calculateLine();
        this.calculateFill();
    },
    calculateFill: function () {
        var theme = this.document.theme;
        var brush;
        var colorMap = this.document.clrSchemeMap.color_map;
        var RGBA = {
            R: 0,
            G: 0,
            B: 0,
            A: 255
        };
        if (colorMap == null) {
            colorMap = GenerateDefaultColorMap().color_map;
        }
        if (theme && this.style != null && this.style.fillRef != null) {
            brush = theme.getFillStyle(this.style.fillRef.idx);
            this.style.fillRef.Color.Calculate(theme, colorMap, {
                R: 0,
                G: 0,
                B: 0,
                A: 255
            });
            RGBA = this.style.fillRef.Color.RGBA;
            if (this.style.fillRef.Color.color != null) {
                if (brush.fill != null && (brush.fill.type == FILL_TYPE_SOLID || brush.fill.type == FILL_TYPE_GRAD)) {
                    brush.fill.color = this.style.fillRef.Color.createDuplicate();
                }
            }
        } else {
            brush = new CUniFill();
        }
        brush.merge(this.spPr.Fill);
        this.brush = brush;
        this.brush.calculate(theme, colorMap, RGBA);
    },
    calculateLine: function () {
        var _calculated_line;
        var _theme = this.document.theme;
        var colorMap = this.document.clrSchemeMap.color_map;
        if (colorMap == null) {
            colorMap = GenerateDefaultColorMap().color_map;
        }
        var RGBA = {
            R: 0,
            G: 0,
            B: 0,
            A: 255
        };
        if (_theme !== null && typeof _theme === "object" && typeof _theme.getLnStyle === "function" && this.style !== null && typeof this.style === "object" && this.style.lnRef !== null && typeof this.style.lnRef === "object" && typeof this.style.lnRef.idx === "number" && this.style.lnRef.Color !== null && typeof this.style.lnRef.Color.Calculate === "function") {
            _calculated_line = _theme.getLnStyle(this.style.lnRef.idx);
            this.style.lnRef.Color.Calculate(_theme, colorMap, {
                R: 0,
                G: 0,
                B: 0,
                A: 255
            });
            RGBA = this.style.lnRef.Color.RGBA;
        } else {
            _calculated_line = new CLn();
        }
        _calculated_line.merge(this.spPr.ln);
        if (_calculated_line.Fill != null) {
            _calculated_line.Fill.calculate(_theme, colorMap, RGBA);
        }
        this.pen = _calculated_line;
    },
    calculateText: function () {},
    normalizeXfrm2: function (kw, kh) {
        var xfrm = this.spPr.xfrm;
        xfrm.offX *= kw;
        xfrm.offY *= kh;
        xfrm.extX *= kw;
        xfrm.extY *= kh;
    },
    setGroupAfterOpen: function (group) {
        this.group = group;
    },
    recalculate: function (bOpen) {
        this.recalculateTransformMatrix();
        this.calculateTransformTextMatrix();
        if (bOpen !== false) {
            this.calculateContent();
        }
        this.updateCursorTypes();
    },
    updateAbsPosInGroup: function () {
        if (isRealObject(this.group)) {
            this.setAbsoluteTransform(this.spPr.xfrm.offX, this.spPr.xfrm.offY, null, null, null, null, null);
        }
    },
    recalculateTransformMatrix: function () {
        if (this.group == null) {
            var hc = this.absExtX * 0.5;
            var vc = this.absExtY * 0.5;
            this.transform = new CMatrix();
            var t = this.transform;
            global_MatrixTransformer.TranslateAppend(t, -hc, -vc);
            if (this.absFlipH) {
                global_MatrixTransformer.ScaleAppend(t, -1, 1);
            }
            if (this.absFlipV) {
                global_MatrixTransformer.ScaleAppend(t, 1, -1);
            }
            global_MatrixTransformer.RotateRadAppend(t, -this.absRot);
            global_MatrixTransformer.TranslateAppend(t, this.absOffsetX + hc, this.absOffsetY + vc);
        } else {
            var xfrm = this.spPr.xfrm;
            hc = xfrm.extX * 0.5;
            vc = xfrm.extY * 0.5;
            this.transform = new CMatrix();
            t = this.transform;
            global_MatrixTransformer.TranslateAppend(t, -hc, -vc);
            var flip_h = xfrm.flipH == null ? false : xfrm.flipH;
            if (flip_h) {
                global_MatrixTransformer.ScaleAppend(t, -1, 1);
            }
            var flip_v = xfrm.flipV == null ? false : xfrm.flipV;
            if (flip_v) {
                global_MatrixTransformer.ScaleAppend(t, 1, -1);
            }
            var rot = xfrm.rot == null ? 0 : xfrm.rot;
            global_MatrixTransformer.RotateRadAppend(t, -rot);
            global_MatrixTransformer.TranslateAppend(t, xfrm.offX + hc, xfrm.offY + vc);
            global_MatrixTransformer.MultiplyAppend(t, this.group.getTransform());
        }
        this.ownTransform = this.transform.CreateDublicate();
    },
    calculateTransformMatrix: function () {
        var _transform = new CMatrix();
        var _horizontal_center = this.absExtX * 0.5;
        var _vertical_center = this.absExtY * 0.5;
        global_MatrixTransformer.TranslateAppend(_transform, -_horizontal_center, -_vertical_center);
        if (this.absFlipH) {
            global_MatrixTransformer.ScaleAppend(_transform, -1, 1);
        }
        if (this.absFlipV) {
            global_MatrixTransformer.ScaleAppend(_transform, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(_transform, -this.absRot);
        global_MatrixTransformer.TranslateAppend(_transform, this.absOffsetX, this.absOffsetY);
        global_MatrixTransformer.TranslateAppend(_transform, _horizontal_center, _vertical_center);
        if (this.mainGroup !== null) {
            global_MatrixTransformer.MultiplyAppend(_transform, this.mainGroup.getTransform());
        }
        this.transform = _transform;
        this.ownTransform = _transform.CreateDublicate();
    },
    updateCursorTypes: function () {
        this.cursorTypes = [];
        var transform = this.transform;
        if (transform == null) {
            transform = new CMatrix();
        }
        var vc = this.spPr.xfrm.extX * 0.5;
        var hc = this.spPr.xfrm.extY * 0.5;
        var xc = transform.TransformPointX(hc, vc);
        var yc = transform.TransformPointY(hc, vc);
        var xt = transform.TransformPointX(hc, 0);
        var yt = transform.TransformPointY(hc, 0);
        var vx = xt - xc;
        var vy = yc - yt;
        var angle = Math.atan2(vy, vx) + Math.PI / 8;
        if (angle < 0) {
            angle += 2 * Math.PI;
        }
        if (angle > 2 * Math.PI) {
            angle -= 2 * Math.PI;
        }
        var xlt = transform.TransformPointX(0, 0);
        var ylt = transform.TransformPointY(0, 0);
        var vx_lt = xlt - xc;
        var vy_lt = yc - ylt;
        var curTypes = [];
        curTypes[0] = "n-resize";
        curTypes[1] = "ne-resize";
        curTypes[2] = "e-resize";
        curTypes[3] = "se-resize";
        curTypes[4] = "s-resize";
        curTypes[5] = "sw-resize";
        curTypes[6] = "w-resize";
        curTypes[7] = "nw-resize";
        var _index = Math.floor(angle / (Math.PI / 4));
        var _index2, t;
        if (vx_lt * vy - vx * vy_lt < 0) {
            for (var i = 0; i < 8; ++i) {
                t = i - _index + 17;
                _index2 = t - ((t / 8) >> 0) * 8;
                this.cursorTypes[i] = curTypes[_index2];
            }
        } else {
            for (i = 0; i < 8; ++i) {
                t = -i - _index + 19;
                _index2 = t - ((t / 8) >> 0) * 8;
                this.cursorTypes[i] = curTypes[_index2];
            }
        }
    },
    calculateTransformChildElements: function () {
        this.transform = new CMatrix();
        var transform = this.transform;
        var xfrm = this.spPr.xfrm;
        var hc = xfrm.extX * 0.5;
        var vc = xfrm.extY * 0.5;
        global_MatrixTransformer.TranslateAppend(transform, -hc, -vc);
        var flipH = xfrm.flipH == null ? false : xfrm.flipH;
        if (flipH) {
            global_MatrixTransformer.ScaleAppend(transform, -1, 1);
        }
        var flipV = xfrm.flipV == null ? false : xfrm.flipV;
        if (flipV) {
            global_MatrixTransformer.ScaleAppend(transform, 1, -1);
        }
        var rot = xfrm.rot == null ? 0 : xfrm.rot;
        global_MatrixTransformer.RotateRadAppend(transform, xfrm.rot);
        global_MatrixTransformer.TranslateAppend(transform, xfrm.offX + hc, xfrm.offY + vc);
        if (this.group != null) {
            global_MatrixTransformer.MultiplyAppend(transform, this.group.transform);
        }
        var local_transform = transform.CreateDublicate();
        var main_group_matrix_invert = global_MatrixTransformer.Invert(this.mainGroup.transform);
        global_MatrixTransformer.MultiplyAppend(local_transform, main_group_matrix_invert);
        var t_xc = local_transform.TransformPointX(hc, vc);
        var t_yc = local_transform.TransformPointY(hc, vc);
        if (this.group === this.mainGroup) {
            this.absOffsetX = xfrm.offX;
            this.absOffsetY = xfrm.offY;
        } else {
            this.absOffsetX = t_xc - hc;
            this.absOffsetY = t_yc - vc;
        }
        this.absExtX = xfrm.extX;
        this.absExtY = xfrm.extY;
        this.absFlipH = flipH;
        this.absFlipV = flipV;
        if (this.group != null) {
            var abs_rot;
            if (this.mainGroup === this.group) {
                abs_rot = xfrm.rot == null ? 0 : xfrm.rot;
            } else {
                var cur_group = this.group;
                abs_rot = 0;
                while (cur_group != this.mainGroup) {
                    var cur_rot = cur_group.spPr.xfrm.rot == null ? 0 : cur_group.spPr.xfrm.rot;
                    abs_rot += cur_rot;
                    cur_group = cur_group.group;
                }
            }
            this.absRot = abs_rot;
        } else {
            this.absRot = xfrm.rot == null ? 0 : xfrm.rot;
        }
        this.parent = new ParaDrawing(xfrm.extX, xfrm.extY, this, this.drawingDocument, null, null);
    },
    getMainGroup: function () {
        var cur_group = this.group;
        if (isRealObject(cur_group)) {
            while (isRealObject(cur_group.group)) {
                cur_group = cur_group.group;
            }
            return cur_group;
        } else {
            return null;
        }
    },
    getOwnTransform: function () {
        return this.ownTransform;
    },
    getTableProps: function () {
        if (this.textBoxContent) {
            return this.textBoxContent.Interface_Update_TablePr(true);
        }
        return null;
    },
    calculateTransformTextMatrix: function () {
        if (this.textBoxContent === null) {
            return;
        }
        this.transformText.Reset();
        var _text_transform = this.transformText;
        var _shape_transform = this.transform;
        var _body_pr = this.getBodyPr();
        var _content_height = this.textBoxContent.Get_SummaryHeight();
        var _l, _t, _r, _b;
        var _t_x_lt, _t_y_lt, _t_x_rt, _t_y_rt, _t_x_lb, _t_y_lb, _t_x_rb, _t_y_rb;
        var body_pr = this.getBodyPr();
        var l_ins = typeof body_pr.lIns === "number" ? body_pr.lIns : 2.54;
        var t_ins = typeof body_pr.tIns === "number" ? body_pr.tIns : 1.27;
        var r_ins = typeof body_pr.rIns === "number" ? body_pr.rIns : 2.54;
        var b_ins = typeof body_pr.bIns === "number" ? body_pr.bIns : 1.27;
        if (isRealObject(this.spPr.geometry) && isRealObject(this.spPr.geometry.rect)) {
            var _rect = this.spPr.geometry.rect;
            _l = _rect.l + l_ins;
            _t = _rect.t + t_ins;
            _r = _rect.r - r_ins;
            _b = _rect.b - b_ins;
        } else {
            _l = l_ins;
            _t = t_ins;
            _r = this.absExtX - r_ins;
            _b = this.absExtY - b_ins;
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
        if (!_body_pr.upright) {
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
                    default:
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
                    default:
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
        } else {
            var _full_rotate = this.getFullRotate();
            var _full_flip = this.getFullFlip();
            var _hc = this.absExtX * 0.5;
            var _vc = this.absExtY * 0.5;
            var _transformed_shape_xc = this.transform.TransformPointX(_hc, _vc);
            var _transformed_shape_yc = this.transform.TransformPointY(_hc, _vc);
            var _content_width, content_height2;
            if ((_full_rotate >= 0 && _full_rotate < Math.PI * 0.25) || (_full_rotate > 3 * Math.PI * 0.25 && _full_rotate < 5 * Math.PI * 0.25) || (_full_rotate > 7 * Math.PI * 0.25 && _full_rotate < 2 * Math.PI)) {
                if (! (_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270)) {
                    _content_width = _r - _l;
                    content_height2 = _b - _t;
                } else {
                    _content_width = _b - _t;
                    content_height2 = _r - _l;
                }
            } else {
                if (! (_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270)) {
                    _content_width = _b - _t;
                    content_height2 = _r - _l;
                } else {
                    _content_width = _r - _l;
                    content_height2 = _b - _t;
                }
            }
            if (_content_height < content_height2) {
                switch (_body_pr.anchor) {
                case 0:
                    _vertical_shift = content_height2 - _content_height;
                    break;
                case 1:
                    _vertical_shift = (content_height2 - _content_height) * 0.5;
                    break;
                case 2:
                    _vertical_shift = (content_height2 - _content_height) * 0.5;
                    break;
                case 3:
                    _vertical_shift = (content_height2 - _content_height) * 0.5;
                    break;
                default:
                    _vertical_shift = 0;
                    break;
                }
            } else {
                _vertical_shift = 0;
            }
            var _text_rect_xc = _l + (_r - _l) * 0.5;
            var _text_rect_yc = _t + (_b - _t) * 0.5;
            var _vx = _text_rect_xc - _hc;
            var _vy = _text_rect_yc - _vc;
            var _transformed_text_xc, _transformed_text_yc;
            if (!_full_flip.flipH) {
                _transformed_text_xc = _transformed_shape_xc + _vx;
            } else {
                _transformed_text_xc = _transformed_shape_xc - _vx;
            }
            if (!_full_flip.flipV) {
                _transformed_text_yc = _transformed_shape_yc + _vy;
            } else {
                _transformed_text_yc = _transformed_shape_yc - _vy;
            }
            global_MatrixTransformer.TranslateAppend(_text_transform, 0, _vertical_shift);
            if (_body_pr.vert === nVertTTvert) {
                global_MatrixTransformer.TranslateAppend(_text_transform, -_content_width * 0.5, -content_height2 * 0.5);
                global_MatrixTransformer.RotateRadAppend(_text_transform, -Math.PI * 0.5);
                global_MatrixTransformer.TranslateAppend(_text_transform, _content_width * 0.5, content_height2 * 0.5);
            }
            if (_body_pr.vert === nVertTTvert270) {
                global_MatrixTransformer.TranslateAppend(_text_transform, -_content_width * 0.5, -content_height2 * 0.5);
                global_MatrixTransformer.RotateRadAppend(_text_transform, -Math.PI * 1.5);
                global_MatrixTransformer.TranslateAppend(_text_transform, _content_width * 0.5, content_height2 * 0.5);
            }
            global_MatrixTransformer.TranslateAppend(_text_transform, _transformed_text_xc - _content_width * 0.5, _transformed_text_yc - content_height2 * 0.5);
            var body_pr = this.getBodyPr();
            var l_ins = typeof body_pr.lIns === "number" ? body_pr.lIns : 2.54;
            var t_ins = typeof body_pr.tIns === "number" ? body_pr.tIns : 1.27;
            var r_ins = typeof body_pr.rIns === "number" ? body_pr.rIns : 2.54;
            var b_ins = typeof body_pr.bIns === "number" ? body_pr.bIns : 1.27;
            this.clipRect = {
                x: -l_ins,
                y: -_vertical_shift - t_ins,
                w: this.contentWidth + (r_ins + l_ins),
                h: this.contentHeight + (b_ins + t_ins)
            };
        }
        this.invertTextMatrix = global_MatrixTransformer.Invert(this.transformText);
    },
    setTextVerticalAlign: function (align) {
        if (this.bodyPr.anchor === align) {
            return;
        }
        History.Add(this, {
            Type: historyitem_SetVerticalShapeAlign,
            oldAlign: this.bodyPr.anchor,
            newAlign: align
        });
        this.bodyPr.anchor = align;
        this.calculateTransformTextMatrix();
    },
    setPaddings: function (paddings) {
        if (isRealObject(paddings)) {
            var history_obj = {
                Type: historyitem_AutoShapes_SetTextPaddings
            };
            history_obj.oldL = this.bodyPr.lIns;
            history_obj.oldT = this.bodyPr.tIns;
            history_obj.oldR = this.bodyPr.rIns;
            history_obj.oldB = this.bodyPr.bIns;
            history_obj.newL = isRealNumber(paddings.Left) ? paddings.Left : this.bodyPr.lIns;
            history_obj.newT = isRealNumber(paddings.Top) ? paddings.Top : this.bodyPr.tIns;
            history_obj.newR = isRealNumber(paddings.Right) ? paddings.Right : this.bodyPr.rIns;
            history_obj.newB = isRealNumber(paddings.Bottom) ? paddings.Bottom : this.bodyPr.bIns;
            History.Add(this, history_obj);
            this.bodyPr.lIns = isRealNumber(paddings.Left) ? paddings.Left : this.bodyPr.lIns;
            this.bodyPr.tIns = isRealNumber(paddings.Top) ? paddings.Top : this.bodyPr.tIns;
            this.bodyPr.rIns = isRealNumber(paddings.Right) ? paddings.Right : this.bodyPr.rIns;
            this.bodyPr.bIns = isRealNumber(paddings.Bottom) ? paddings.Bottom : this.bodyPr.bIns;
            this.calculateContent();
            this.calculateTransformTextMatrix();
        }
    },
    canAddComment: function () {
        if (isRealObject(this.textBoxContent)) {
            return this.textBoxContent.CanAdd_Comment();
        }
        return false;
    },
    addComment: function (commentData) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Add_Comment(commentData, true, true);
        }
    },
    hyperlinkCheck: function (bCheck) {
        if (isRealObject(this.textBoxContent)) {
            return this.textBoxContent.Hyperlink_Check(bCheck);
        }
        return null;
    },
    hyperlinkCanAdd: function (bCheckInHyperlink) {
        if (isRealObject(this.textBoxContent)) {
            return this.textBoxContent.Hyperlink_CanAdd(bCheckInHyperlink);
        }
        return false;
    },
    hyperlinkRemove: function () {
        if (isRealObject(this.textBoxContent)) {
            return this.textBoxContent.Hyperlink_Remove();
        }
        return false;
    },
    hyperlinkModify: function (HyperProps) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Hyperlink_Modify(HyperProps);
        }
    },
    hyperlinkAdd: function (HyperProps) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Hyperlink_Add(HyperProps);
        }
    },
    documentStatistics: function (stat) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.DocumentStatistics(stat);
        }
    },
    documentCreateFontCharMap: function (fontMap) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Document_CreateFontCharMap(fontMap);
        }
    },
    documentCreateFontMap: function (fontMap) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Document_CreateFontMap(fontMap);
        }
    },
    tableCheckSplit: function () {
        if (isRealObject(this.textBoxContent)) {
            return this.textBoxContent.Table_CheckSplit();
        }
        return false;
    },
    tableCheckMerge: function () {
        if (isRealObject(this.textBoxContent)) {
            return this.textBoxContent.Table_CheckMerge();
        }
        return false;
    },
    tableSelect: function (type) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Table_Select(type);
        }
    },
    tableRemoveTable: function () {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Table_RemoveTable();
        }
    },
    tableSplitCell: function (Cols, Rows) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Table_SplitCell(Cols, Rows);
        }
    },
    tableMergeCells: function (Cols, Rows) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Table_MergeCells(Cols, Rows);
        }
    },
    tableRemoveCol: function () {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Table_RemoveCol();
        }
    },
    tableAddCol: function (bBefore) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Table_AddCol(bBefore);
        }
    },
    tableRemoveRow: function () {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Table_RemoveRow();
        }
    },
    tableAddRow: function (bBefore) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Table_AddRow(bBefore);
        }
    },
    getCurrentParagraph: function () {
        if (isRealObject(this.textBoxContent)) {
            return this.textBoxContent.Get_CurrentParagraph();
        }
        return null;
    },
    getSelectedText: function (bClearText) {
        if (isRealObject(this.textBoxContent)) {
            return this.textBoxContent.Get_SelectedText(bClearText);
        }
        return "";
    },
    getCurPosXY: function () {
        if (isRealObject(this.textBoxContent)) {
            return this.textBoxContent.Get_CurPosXY();
        }
        return {
            X: 0,
            Y: 0
        };
    },
    isTextSelectionUse: function () {
        if (isRealObject(this.textBoxContent)) {
            return this.textBoxContent.Is_TextSelectionUse();
        }
        return false;
    },
    paragraphFormatPaste: function (CopyTextPr, CopyParaPr, Bool) {
        if (isRealObject(this.textBoxContent)) {
            return this.textBoxContent.Paragraph_Format_Paste(CopyTextPr, CopyParaPr, Bool);
        }
    },
    getNearestPos: function (x, y, pageIndex) {
        if (isRealObject(this.textBoxContent)) {
            var t_x = this.invertTextMatrix.TransformPointX(x, y);
            var t_y = this.invertTextMatrix.TransformPointY(x, y);
            var nearest_pos = this.textBoxContent.Get_NearestPos(pageIndex, t_x, t_y, false);
            nearest_pos.transform = this.transformText;
            return nearest_pos;
        }
        return null;
    },
    check_bounds: function (checker) {
        if (this.spPr.geometry) {
            if (!this.spPr.geometry.preset) {
                this.spPr.geometry.check_bounds(checker);
            } else {
                if (global_map_bounds_shape[this.spPr.geometry.preset] === true) {
                    checker._s();
                    checker._m(0, 0);
                    checker._l(this.absExtX, 0);
                    checker._l(this.absExtX, this.absExtY);
                    checker._l(0, this.absExtY);
                    checker._z();
                    checker._e();
                } else {
                    this.spPr.geometry.check_bounds(checker);
                }
            }
        } else {
            checker._s();
            checker._m(0, 0);
            checker._l(this.absExtX, 0);
            checker._l(this.absExtX, this.absExtY);
            checker._l(0, this.absExtY);
            checker._z();
            checker._e();
        }
    },
    createDuplicate: function (parent) {
        var copy = new WordShape(parent, this.document, this.drawingDocument, null);
        copy.spPr = this.spPr.createDuplicate();
        if (this.style != null) {
            copy.style = this.style.createDuplicate();
        }
        if (this.textBoxContent != null) {
            copy.textBoxContent = this.textBoxContent.Copy();
        }
        copy.bodyPr = this.bodyPr.createDuplicate();
        this.textBoxContent = null;
        this.bodyPr = new CBodyPr();
        this.bodyPr.setDefault();
        this.group = (group !== null && typeof group === "object") ? group : null;
        this.mainGroup = null;
        this.brush = null;
        this.pen = null;
        this.absOffsetX = null;
        this.absOffsetY = null;
        this.absExtX = null;
        this.absExtY = null;
        this.absRot = null;
        this.absFlipH = null;
        this.absFlipV = null;
        this.absXLT = null;
        this.absYLT = null;
        this.transform = null;
        this.transformText = new CMatrix();
        this.invertTextMatrix = new CMatrix();
        this.ownTransform = new CMatrix();
        this.selected = false;
        this.selectStartPage = -1;
        this.wrapPolygon = null;
    },
    calculateLeftTopPoint: function () {
        var _horizontal_center = this.absExtX * 0.5;
        var _vertical_enter = this.absExtY * 0.5;
        var _sin = Math.sin(this.absRot);
        var _cos = Math.cos(this.absRot);
        this.absXLT = -_horizontal_center * _cos + _vertical_enter * _sin + this.absOffsetX + _horizontal_center;
        this.absYLT = -_horizontal_center * _sin - _vertical_enter * _cos + this.absOffsetY + _vertical_enter;
    },
    calculateAfterInternalResize: function () {},
    calculateTransformFromXfrmToAbsCoors: function () {},
    calculateTransformFromAbsCoorsToXfrm: function () {},
    transformPointRelativeShape: function (x, y) {
        this.calculateLeftTopPoint();
        var _sin = Math.sin(this.absRot);
        var _cos = Math.cos(this.absRot);
        var _temp_x = x - this.absXLT;
        var _temp_y = y - this.absYLT;
        var _relative_x = _temp_x * _cos + _temp_y * _sin;
        var _relative_y = -_temp_x * _sin + _temp_y * _cos;
        if (this.absFlipH) {
            _relative_x = this.absExtX - _relative_x;
        }
        if (this.absFlipV) {
            _relative_y = this.absExtY - _relative_y;
        }
        return {
            x: _relative_x,
            y: _relative_y
        };
    },
    addGeometry: function (preset) {
        this.spPr.geometry = CreateGeometry(preset);
    },
    paragraphAdd: function (paraItem, bRecalculate) {
        var bool = false;
        if (this.textBoxContent === null) {
            this.textBoxContent = new CDocumentContent(this, this.drawingDocument, 0, 0, 0, 0, false, false);
            this.textBoxContent.Reset(0, 0, 0, 20000);
            this.calculateContent();
            this.transformText = new CMatrix();
            this.calculateTransformTextMatrix();
            History.Add(this, {
                Type: historyitem_AddDocContent,
                contentId: this.textBoxContent.Get_Id()
            });
            bool = true;
        }
        this.textBoxContent.Paragraph_Add(paraItem, bRecalculate);
        if (bool) {
            editor.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
        }
    },
    addDocContent: function (docContent) {
        this.textBoxContent = docContent;
        this.transformText = new CMatrix();
        History.Add(this, {
            Type: historyitem_AddDocContent,
            contentId: this.textBoxContent.Get_Id()
        });
    },
    documentGetAllFontNames: function (AllFonts) {
        if (isRealObject(this.textBoxContent) && typeof this.textBoxContent.Document_Get_AllFontNames === "function") {
            this.textBoxContent.Document_Get_AllFontNames(AllFonts);
        }
    },
    setAllParagraphNumbering: function (numInfo) {
        if (this.textBoxContent) {
            this.textBoxContent.Select_All();
            this.textBoxContent.Set_ParagraphNumbering(numInfo);
        }
    },
    addNewParagraph: function (bRecalculate) {
        if (this.textBoxContent) {
            this.textBoxContent.Add_NewParagraph(bRecalculate);
        }
    },
    addInlineTable: function (cols, rows) {
        if (this.textBoxContent) {
            this.textBoxContent.Add_InlineTable(cols, rows);
        }
    },
    allIncreaseDecFontSize: function (bIncrease) {
        if (this.textBoxContent) {
            this.textBoxContent.Set_ApplyToAll(true);
            this.textBoxContent.Paragraph_IncDecFontSize(bIncrease);
            this.textBoxContent.Set_ApplyToAll(false);
        }
    },
    allIncreaseDecIndent: function (bIncrease) {
        if (this.textBoxContent) {
            this.textBoxContent.Set_ApplyToAll(true);
            this.textBoxContent.Paragraph_IncDecIndent(bIncrease);
            this.textBoxContent.Set_ApplyToAll(false);
        }
    },
    allSetParagraphAlign: function (align) {
        if (this.textBoxContent) {
            this.textBoxContent.Set_ApplyToAll(true);
            this.textBoxContent.Set_ParagraphAlign(align);
            this.textBoxContent.Set_ApplyToAll(false);
        }
    },
    paragraphIncreaseDecFontSize: function (bIncrease) {
        if (this.textBoxContent) {
            this.textBoxContent.Paragraph_IncDecFontSize(bIncrease);
        }
    },
    paragraphIncreaseDecIndent: function (bIncrease) {
        if (this.textBoxContent) {
            this.textBoxContent.Paragraph_IncDecIndent(bIncrease);
        }
    },
    setParagraphAlign: function (align) {
        if (this.textBoxContent) {
            this.textBoxContent.Set_ParagraphAlign(align);
        }
    },
    getAllParagraphParaPr: function () {
        if (this.textBoxContent) {
            this.textBoxContent.Set_ApplyToAll(true);
            var paraPr = this.textBoxContent.Get_Paragraph_ParaPr();
            this.textBoxContent.Set_ApplyToAll(false);
            return paraPr;
        }
        return null;
    },
    getAllParagraphTextPr: function () {
        if (this.textBoxContent) {
            this.textBoxContent.Set_ApplyToAll(true);
            var paraPr = this.textBoxContent.Get_Paragraph_TextPr();
            this.textBoxContent.Set_ApplyToAll(false);
            return paraPr;
        }
        return null;
    },
    getParagraphParaPr: function () {
        if (this.textBoxContent) {
            return this.textBoxContent.Get_Paragraph_ParaPr();
        }
        return null;
    },
    getParagraphTextPr: function () {
        if (this.textBoxContent) {
            return this.textBoxContent.Get_Paragraph_TextPr();
        }
        return null;
    },
    getBodyPr: function () {
        var bodyPr = new CBodyPr();
        bodyPr.setDefault();
        if (isRealObject(this.bodyPr)) {
            bodyPr.merge(this.bodyPr);
        }
        return bodyPr;
    },
    calculateContent: function () {
        if (this.textBoxContent === null || this.textBoxContent.Parent !== this) {
            return;
        }
        var _l, _t, _r, _b;
        var body_pr = this.getBodyPr();
        var l_ins = typeof body_pr.lIns === "number" ? body_pr.lIns : 2.54;
        var t_ins = typeof body_pr.tIns === "number" ? body_pr.tIns : 1.27;
        var r_ins = typeof body_pr.rIns === "number" ? body_pr.rIns : 2.54;
        var b_ins = typeof body_pr.bIns === "number" ? body_pr.bIns : 1.27;
        var _body_pr = this.getBodyPr();
        if (isRealObject(this.spPr.geometry) && isRealObject(this.spPr.geometry.rect)) {
            var _rect = this.spPr.geometry.rect;
            _l = _rect.l + l_ins;
            _t = _rect.t + t_ins;
            _r = _rect.r - r_ins;
            _b = _rect.b - b_ins;
        } else {
            _l = l_ins;
            _t = t_ins;
            _r = this.absExtX - r_ins;
            _b = this.absExtY - b_ins;
        }
        if (!_body_pr.upright) {
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
            var _full_rotate = this.getFullRotate();
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
        this.textBoxContent.Reset(0, 0, _content_width, 20000);
        var CurPage = 0;
        var RecalcResult = recalcresult2_NextPage;
        while (recalcresult2_End != RecalcResult) {
            RecalcResult = this.textBoxContent.Recalculate_Page(CurPage++, true);
        }
    },
    isGroup: function () {
        return false;
    },
    addInlineImage: function (W, H, Img, chart, bFlow) {
        if (isRealObject(this.textBoxContent) && typeof this.textBoxContent.Add_InlineImage === "function") {
            this.textBoxContent.Add_InlineImage(W, H, Img, chart, bFlow);
        }
    },
    draw: function (graphics, pageIndex) {
        if (this.spPr.geometry !== null && isRealObject(this.transform)) {
            graphics.SaveGrState();
            graphics.SetIntegerGrid(false);
            graphics.transform3(this.transform, false);
            var shape_drawer = new CShapeDrawer();
            shape_drawer.fromShape2(this, graphics, this.spPr.geometry);
            shape_drawer.draw(this.spPr.geometry);
            graphics.RestoreGrState();
        }
        if (this.textBoxContent !== null && !graphics.IsNoSupportTextDraw && isRealObject(this.transformText)) {
            if (typeof pageIndex === "number") {
                var old_start_page = this.textBoxContent.Get_StartPage_Relative();
                this.textBoxContent.Set_StartPage(pageIndex);
            }
            var clip_rect = this.clipRect;
            if (!this.bodyPr.upright) {
                graphics.SaveGrState();
                graphics.SetIntegerGrid(false);
                graphics.transform3(this.transform);
                graphics.AddClipRect(clip_rect.x, clip_rect.y, clip_rect.w, clip_rect.h);
                graphics.SetIntegerGrid(false);
                graphics.transform3(this.transformText, true);
            } else {
                graphics.SaveGrState();
                graphics.SetIntegerGrid(false);
                graphics.transform3(this.transformText, true);
                graphics.AddClipRect(clip_rect.x, clip_rect.y, clip_rect.w, clip_rect.h);
            }
            var result_page_index = typeof pageIndex === "number" ? pageIndex : this.pageIndex;
            if (graphics.CheckUseFonts2 !== undefined) {
                graphics.CheckUseFonts2(this.transformText);
            }
            if (window.IsShapeToImageConverter) {
                this.textBoxContent.Set_StartPage(0);
                result_page_index = 0;
            }
            this.textBoxContent.Draw(result_page_index, graphics);
            if (graphics.UncheckUseFonts2 !== undefined) {
                graphics.UncheckUseFonts2();
            }
            if (typeof pageIndex === "number") {
                this.textBoxContent.Set_StartPage(old_start_page);
            }
            graphics.RestoreGrState();
        }
    },
    convertToImage: function () {
        var object = ShapeToImageConverter(this, this.pageIndex);
        var para_drawing = new ParaDrawing(this.parent.W, this.parent.H, null, this.drawingDocument, this.document, null);
        var word_image = new WordImage(para_drawing, this.document, this.drawingDocument, null);
        word_image.init(object.ImageUrl, this.parent.W, this.parent.H, null, object.ImageNative);
        para_drawing.Set_GraphicObject(word_image);
        return para_drawing;
    },
    getWrapPolygon: function () {
        this.wrapPolygon = this.spPr.geometry.getWrapPolygon(10, this.transform);
        return this.wrapPolygon;
    },
    drawAdjustments: function () {
        if (this.spPr.geometry !== null) {
            this.spPr.geometry.drawAdjustments(this.drawingDocument, this.transform);
        }
    },
    calculateAfterResize: function () {
        if (isRealObject(this.parent)) {
            this.parent.bNeedUpdateWH = true;
        }
        if (this.spPr.geometry !== null) {
            this.spPr.geometry.Recalculate(this.absExtX, this.absExtY);
        }
        this.calculateTransformMatrix();
        this.calculateContent();
        this.calculateTransformTextMatrix();
        this.calculateLeftTopPoint();
    },
    calculateAfterChangeTheme: function () {
        this.calculateFill();
        this.calculateLine();
    },
    setRotate: function (rot) {
        var history_obj = {};
        history_obj.Type = historyitem_SetRotate;
        history_obj.oldRot = this.spPr.xfrm.rot;
        history_obj.newRot = rot;
        this.spPr.xfrm.rot = rot;
        this.setAbsoluteTransform(null, null, null, null, rot, null, null);
        History.Add(this, history_obj);
        this.calculateTransformMatrix();
        this.calculateLeftTopPoint();
        this.calculateTransformTextMatrix();
    },
    getPresetGeom: function () {
        if (this.spPr.geometry != null) {
            return this.spPr.geometry.preset;
        } else {
            return null;
        }
    },
    getFill: function () {
        return this.brush;
    },
    getStroke: function () {
        if (!isRealObject(this.pen)) {
            return null;
        }
        return this.pen;
    },
    canChangeArrows: function () {
        if (this.spPr.geometry == null) {
            return false;
        }
        var _path_list = this.spPr.geometry.pathLst;
        var _path_index;
        var _path_command_index;
        var _path_command_arr;
        for (_path_index = 0; _path_index < _path_list.length; ++_path_index) {
            _path_command_arr = _path_list[_path_index].ArrPathCommandInfo;
            for (_path_command_index = 0; _path_command_index < _path_command_arr.length; ++_path_command_index) {
                if (_path_command_arr[_path_command_index].id == 5) {
                    break;
                }
            }
            if (_path_command_index == _path_command_arr.length) {
                return true;
            }
        }
        return false;
    },
    setFillSpPr: function (unifill) {
        var historyObj = {
            Type: historyitem_ChangeFill
        };
        if (this.spPr.Fill == null) {
            historyObj.old_Fill = null;
        } else {
            historyObj.old_Fill = this.spPr.Fill.createDuplicate();
        }
        this.spPr.Fill = unifill;
        if (this.spPr.Fill == null) {
            historyObj.new_Fill = null;
        } else {
            historyObj.new_Fill = this.spPr.Fill.createDuplicate();
        }
        History.Add(this, historyObj);
        this.calculateFill();
    },
    changeFill: function (ascFill) {
        var historyObj = {
            Type: historyitem_ChangeFill
        };
        if (this.spPr.Fill == null) {
            historyObj.old_Fill = null;
        } else {
            historyObj.old_Fill = this.spPr.Fill.createDuplicate();
        }
        if (this.spPr.Fill == null) {
            this.spPr.Fill = new CUniFill();
        }
        this.spPr.Fill = CorrectUniFill(ascFill, this.spPr.Fill);
        if (this.spPr.Fill == null) {
            historyObj.new_Fill = null;
        } else {
            historyObj.new_Fill = this.spPr.Fill.createDuplicate();
        }
        History.Add(this, historyObj);
        this.calculateFill();
    },
    changeLine: function (line) {
        var historyObj = {
            Type: historyitem_ChangeLine
        };
        if (this.spPr.ln != null) {
            historyObj.old_Line = this.spPr.ln.createDuplicate();
        } else {
            historyObj.old_Line = null;
        }
        this.spPr.ln = CorrectUniStroke(line, this.spPr.ln);
        historyObj.new_Line = this.spPr.ln.createDuplicate();
        History.Add(this, historyObj);
        this.calculateLine();
    },
    changePresetGeometry: function (sPreset) {
        var _final_preset;
        var _old_line;
        var _new_line;
        var brush = null;
        var style = null;
        if (this.spPr.ln == null) {
            _old_line = null;
        } else {
            _old_line = this.spPr.ln.createDuplicate();
        }
        var _arrow_flag = false;
        switch (sPreset) {
        case "lineWithArrow":
            _final_preset = "line";
            _arrow_flag = true;
            if (_old_line == null) {
                _new_line = new CLn();
            } else {
                _new_line = this.spPr.ln.createDuplicate();
            }
            _new_line.tailEnd = new EndArrow();
            _new_line.tailEnd.type = LineEndType.Arrow;
            _new_line.tailEnd.len = LineEndSize.Mid;
            _new_line.tailEnd.w = LineEndSize.Mid;
            break;
        case "lineWithTwoArrows":
            _final_preset = "line";
            _arrow_flag = true;
            if (_old_line == null) {
                _new_line = new CLn();
            } else {
                _new_line = this.spPr.ln.createDuplicate();
            }
            _new_line.tailEnd = new EndArrow();
            _new_line.tailEnd.type = LineEndType.Arrow;
            _new_line.tailEnd.len = LineEndSize.Mid;
            _new_line.tailEnd.w = LineEndSize.Mid;
            _new_line.headEnd = new EndArrow();
            _new_line.headEnd.type = LineEndType.Arrow;
            _new_line.headEnd.len = LineEndSize.Mid;
            _new_line.headEnd.w = LineEndSize.Mid;
            break;
        case "bentConnector5WithArrow":
            _final_preset = "bentConnector5";
            _arrow_flag = true;
            if (_old_line == null) {
                _new_line = new CLn();
            } else {
                _new_line = this.spPr.ln.createDuplicate();
            }
            _new_line.tailEnd = new EndArrow();
            _new_line.tailEnd.type = LineEndType.Arrow;
            _new_line.tailEnd.len = LineEndSize.Mid;
            _new_line.tailEnd.w = LineEndSize.Mid;
            break;
        case "bentConnector5WithTwoArrows":
            _final_preset = "bentConnector5";
            _arrow_flag = true;
            if (_old_line == null) {
                _new_line = new CLn();
            } else {
                _new_line = this.spPr.ln.createDuplicate();
            }
            _new_line.tailEnd = new EndArrow();
            _new_line.tailEnd.type = LineEndType.Arrow;
            _new_line.tailEnd.len = LineEndSize.Mid;
            _new_line.tailEnd.w = LineEndSize.Mid;
            _new_line.headEnd = new EndArrow();
            _new_line.headEnd.type = LineEndType.Arrow;
            _new_line.headEnd.len = LineEndSize.Mid;
            _new_line.headEnd.w = LineEndSize.Mid;
            break;
        case "curvedConnector3WithArrow":
            _final_preset = "curvedConnector3";
            _arrow_flag = true;
            if (_old_line == null) {
                _new_line = new CLn();
            } else {
                _new_line = this.spPr.ln.createDuplicate();
            }
            _new_line.tailEnd = new EndArrow();
            _new_line.tailEnd.type = LineEndType.Arrow;
            _new_line.tailEnd.len = LineEndSize.Mid;
            _new_line.tailEnd.w = LineEndSize.Mid;
            break;
        case "curvedConnector3WithTwoArrows":
            _final_preset = "curvedConnector3";
            _arrow_flag = true;
            if (_old_line == null) {
                _new_line = new CLn();
            } else {
                _new_line = this.spPr.ln.createDuplicate();
            }
            _new_line.tailEnd = new EndArrow();
            _new_line.tailEnd.type = LineEndType.Arrow;
            _new_line.tailEnd.len = LineEndSize.Mid;
            _new_line.tailEnd.w = LineEndSize.Mid;
            _new_line.headEnd = new EndArrow();
            _new_line.headEnd.type = LineEndType.Arrow;
            _new_line.headEnd.len = LineEndSize.Mid;
            _new_line.headEnd.w = LineEndSize.Mid;
            break;
        case "textRect":
            _final_preset = "rect";
            _arrow_flag = true;
            style = new CShapeStyle();
            style.lnRef = new StyleRef();
            style.lnRef.idx = 0;
            style.lnRef.Color.color = new CSchemeColor();
            style.lnRef.Color.color.id = g_clr_accent1;
            style.lnRef.Color.Mods.Mods.push({
                name: "shade",
                val: 50000
            });
            style.fillRef = new StyleRef();
            style.fillRef.idx = 0;
            style.fillRef.Color.color = new CSchemeColor();
            style.fillRef.Color.color.id = g_clr_accent1;
            style.effectRef = new StyleRef();
            style.effectRef.idx = 0;
            style.effectRef.Color.color = new CSchemeColor();
            style.effectRef.Color.color.id = g_clr_accent1;
            style.fontRef = new FontRef();
            style.fontRef.idx = fntStyleInd_minor;
            style.fontRef.Color = new CUniColor();
            style.fontRef.Color.color = new CSchemeColor();
            style.fontRef.Color.color.id = 8;
            _new_line = new CLn();
            _new_line.w = 6350;
            _new_line.Fill = new CUniFill();
            _new_line.Fill.fill = new CSolidFill();
            _new_line.Fill.fill.color.color = new CPrstColor();
            _new_line.Fill.fill.color.color.id = "black";
            brush = new CUniFill();
            brush.fill = new CSolidFill();
            brush.fill.color.color = new CSchemeColor();
            brush.fill.color.color.id = 12;
            break;
        default:
            _final_preset = sPreset;
            _arrow_flag = true;
            if (_old_line == null) {
                _new_line = new CLn();
            } else {
                _new_line = this.spPr.ln.createDuplicate();
            }
            _new_line.tailEnd = null;
            _new_line.headEnd = null;
            break;
        }
        var historyData = {
            Type: historyitem_ChangePresetGeom
        };
        historyData.arrowFlag = _arrow_flag;
        if (_arrow_flag === true) {
            historyData.oldLine = _old_line;
            historyData.newLine = _new_line;
            this.spPr.ln = _new_line;
            this.calculateLine();
        }
        historyData.old_geometryPreset = isRealObject(this.spPr.geometry) ? this.spPr.geometry.preset : null;
        historyData.new_geometryPreset = _final_preset;
        historyData.oldGeometry = this.spPr.geometry;
        this.spPr.geometry = CreateGeometry(_final_preset);
        this.spPr.geometry.Init(100, 100);
        historyData.newGeometry = this.spPr.geometry;
        this.calculateAfterResize();
        History.Add(this, historyData);
        if (isRealObject(style)) {
            this.setStyle(style);
        }
        if (isRealObject(brush)) {
            this.setFillSpPr(brush);
        }
    },
    setSizes: function (posX, posY, w, h, flipH, flipV) {
        var data = {};
        data.Type = historyitem_SetSizes;
        data.oldW = this.absExtX;
        data.oldH = this.absExtY;
        data.newW = w;
        data.newH = h;
        data.oldFlipH = this.absFlipH;
        data.oldFlipV = this.absFlipV;
        data.newFlipH = flipH;
        data.newFlipV = flipV;
        data.oldPosX = this.absOffsetX;
        data.oldPosY = this.absOffsetY;
        data.newPosX = posX;
        data.newPosY = posY;
        History.Add(this, data);
        this.spPr.xfrm.extX = w;
        this.spPr.xfrm.extY = h;
        this.spPr.xfrm.flipH = flipH;
        this.spPr.xfrm.flipV = flipV;
        this.absExtX = w;
        this.absExtY = h;
        this.absFlipH = flipH;
        this.absFlipV = flipV;
        this.absOffsetX = posX;
        this.absOffsetY = posY;
        if (this.parent) {
            this.parent.absOffsetX = posX;
            this.parent.absOffsetY = posY;
            this.parent.absExtX = w;
            this.parent.absExtY = h;
            this.parent.flipH = flipH;
            this.parent.flipV = flipV;
        }
        this.calculateAfterResize();
    },
    setSizesInGroup: function (posX, posY, extX, extY) {
        var data = {};
        data.Type = historyitem_SetSizesInGroup;
        data.oldX = this.absOffsetX;
        data.oldY = this.absOffsetY;
        data.oldExtX = this.absExtX;
        data.oldExtY = this.absExtY;
        data.newX = posX;
        data.newY = posY;
        data.newExtX = extX;
        data.newExtY = extY;
        History.Add(this, data);
        this.absOffsetX = posX;
        this.absOffsetY = posY;
        this.absExtX = extX;
        this.absExtY = extY;
        if (this.parent) {
            this.parent.absOffsetX = posX;
            this.parent.absOffsetY = posY;
            this.parent.absExtX = extX;
            this.parent.absExtY = extY;
        }
        this.calculateAfterResize();
    },
    canTakeOutPage: function () {
        return true;
    },
    setAdjustmentValue: function (ref1, value1, ref2, value2) {
        if (this.spPr.geometry) {
            var data = {};
            data.Type = historyitem_SetAdjValue;
            data.ref1 = ref1;
            data.newValue1 = value1;
            data.ref2 = ref2;
            data.newValue2 = value2;
            data.oldValue1 = this.spPr.geometry.gdLst[ref1];
            data.oldValue2 = this.spPr.geometry.gdLst[ref2];
            History.Add(this, data);
            var geometry = this.spPr.geometry;
            if (typeof geometry.gdLst[ref1] === "number") {
                geometry.gdLst[ref1] = value1;
            }
            if (typeof geometry.gdLst[ref2] === "number") {
                geometry.gdLst[ref2] = value2;
            }
            geometry.Recalculate(this.absExtX, this.absExtY);
            this.calculateContent();
            this.calculateTransformTextMatrix();
        }
    },
    setGroup: function (group) {
        var data = {};
        data.Type = historyitem_SetGroup;
        data.oldGroup = this.group;
        data.newGroup = group;
        History.Add(this, data);
        this.group = group;
    },
    setMainGroup: function (group) {
        var data = {};
        data.Type = historyitem_SetMainGroup;
        data.oldGroup = this.mainGroup;
        data.newGroup = group;
        History.Add(this, data);
        this.mainGroup = group;
    },
    calculateAfterRotate: function () {
        this.calculateTransformMatrix();
        this.calculateContent();
        this.calculateTransformTextMatrix();
        this.calculateLeftTopPoint();
    },
    hitToHandle: function (x, y, radius) {
        var _radius;
        if (! (typeof radius === "number")) {
            _radius = this.drawingDocument.GetMMPerDot(TRACK_CIRCLE_RADIUS);
        } else {
            _radius = radius;
        }
        if (typeof global_mouseEvent.KoefPixToMM === "number" && !isNaN(global_mouseEvent.KoefPixToMM)) {
            _radius *= global_mouseEvent.KoefPixToMM;
        }
        var t_x, t_y;
        if (this.group != null) {
            var inv_t = global_MatrixTransformer.Invert(this.group.transform);
            t_x = inv_t.TransformPointX(x, y);
            t_y = inv_t.TransformPointY(x, y);
        } else {
            t_x = x;
            t_y = y;
        }
        this.calculateLeftTopPoint();
        var _temp_x = t_x - this.absXLT;
        var _temp_y = t_y - this.absYLT;
        var _sin = Math.sin(this.absRot);
        var _cos = Math.cos(this.absRot);
        var _relative_x = _temp_x * _cos + _temp_y * _sin;
        var _relative_y = -_temp_x * _sin + _temp_y * _cos;
        if (this.absFlipH) {
            _relative_x = this.absExtX - _relative_x;
        }
        if (this.absFlipV) {
            _relative_y = this.absExtY - _relative_y;
        }
        var _dist_x, _dist_y;
        if (!this.checkLine()) {
            _dist_x = _relative_x;
            _dist_y = _relative_y;
            if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
                return {
                    hit: true,
                    handleRotate: false,
                    handleNum: 0
                };
            }
            _dist_x = _relative_x - this.absExtX;
            if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
                return {
                    hit: true,
                    handleRotate: false,
                    handleNum: 2
                };
            }
            _dist_y = _relative_y - this.absExtY;
            if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
                return {
                    hit: true,
                    handleRotate: false,
                    handleNum: 4
                };
            }
            _dist_x = _relative_x;
            if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
                return {
                    hit: true,
                    handleRotate: false,
                    handleNum: 6
                };
            }
            if (this.absExtY >= MIN_SHAPE_DIST) {
                var _vertical_center = this.absExtY * 0.5;
                _dist_x = _relative_x;
                _dist_y = _relative_y - _vertical_center;
                if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
                    return {
                        hit: true,
                        handleRotate: false,
                        handleNum: 7
                    };
                }
                _dist_x = _relative_x - this.absExtX;
                if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
                    return {
                        hit: true,
                        handleRotate: false,
                        handleNum: 3
                    };
                }
            }
            var _horizontal_center = this.absExtX * 0.5;
            if (this.absExtX >= MIN_SHAPE_DIST) {
                _dist_x = _relative_x - _horizontal_center;
                _dist_y = _relative_y;
                if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
                    return {
                        hit: true,
                        handleRotate: false,
                        handleNum: 1
                    };
                }
                _dist_y = _relative_y - this.absExtY;
                if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
                    return {
                        hit: true,
                        handleRotate: false,
                        handleNum: 5
                    };
                }
            }
            _dist_x = _relative_x - _horizontal_center;
            _dist_y = _relative_y + this.drawingDocument.GetMMPerDot(TRACK_DISTANCE_ROTATE);
            if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
                return {
                    hit: true,
                    handleRotate: true,
                    handleNum: 8
                };
            }
        } else {
            _dist_x = _relative_x;
            _dist_y = _relative_y;
            if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
                return {
                    hit: true,
                    handleRotate: false,
                    handleNum: 0
                };
            }
            _dist_x = _relative_x - this.absExtX;
            _dist_y = _relative_y - this.absExtY;
            if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
                return {
                    hit: true,
                    handleRotate: false,
                    handleNum: 4
                };
            }
        }
        return {
            hit: false,
            handleRotate: false,
            handleNum: null
        };
    },
    setParagraphShd: function (shd) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Set_ParagraphShd(shd);
        }
    },
    setAllParagraphsShd: function (shd) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Set_ApplyToAll(true);
            this.textBoxContent.Set_ParagraphShd(shd);
            this.textBoxContent.Set_ApplyToAll(false);
        }
    },
    hitToTextRect: function (x, y) {
        if (this.textBoxContent !== null) {
            if (isRealObject(this.parent) && isRealObject(this.parent.Parent) && isRealObject(this.parent.Parent.Parent) && this.parent.Parent.Parent instanceof CDocumentContent && this.parent.wrappingType !== WRAPPING_TYPE_NONE && !(this.parent.Parent.Parent.Is_HdrFtr() && this.parent.Parent.Parent.Is_TopDocument()) && !isRealObject(this.group)) {
                var tx, ty;
                var b_check = false;
                if (!this.parent.isShapeChild()) {
                    tx = x;
                    ty = y;
                    b_check = true;
                } else {
                    var parent_shape = this.parent.getParentShape();
                    if (isRealObject(parent_shape) && isRealObject(parent_shape.invertTextMatrix)) {
                        tx = parent_shape.invertTextMatrix.TransformPointX(x, y);
                        ty = parent_shape.invertTextMatrix.TransformPointY(x, y);
                        b_check = true;
                    }
                }
                if (b_check) {
                    var doc_content = this.parent.Parent.Parent;
                    var rel_page_index = this.pageIndex - doc_content.Get_StartPage_Absolute();
                    if (isRealObject(doc_content.Pages[rel_page_index])) {
                        var bounds = doc_content.Pages[rel_page_index].Bounds;
                        if (tx < bounds.Left || tx > bounds.Right || ty < bounds.Top || ty > bounds.Bottom) {
                            return false;
                        }
                    }
                    var cur_doc_content;
                    cur_doc_content = doc_content;
                    if (cur_doc_content.Parent instanceof WordShape) {
                        var shape = cur_doc_content.Parent;
                        if (shape.group == null && isRealObject(shape.parent) && isRealObject(shape.parent.Parent) && isRealObject(shape.parent.Parent.Parent)) {
                            cur_doc_content = shape.parent.Parent.Parent;
                        } else {
                            var cur_group = shape.group;
                            if (isRealObject(shape.group)) {
                                while (isRealObject(cur_group.group)) {
                                    cur_group = cur_group.group;
                                }
                                if (isRealObject(cur_group) && isRealObject(cur_group.parent) && isRealObject(cur_group.parent.Parent) && isRealObject(cur_group.parent.Parent.Parent)) {
                                    cur_doc_content = cur_group.parent.Parent.Parent;
                                }
                            }
                        }
                        if (cur_doc_content.Is_TableCellContent()) {
                            rel_page_index = this.pageIndex - cur_doc_content.Get_StartPage_Absolute();
                            if (isRealObject(cur_doc_content.Pages[rel_page_index])) {
                                bounds = cur_doc_content.Pages[rel_page_index].Bounds;
                                if (x < bounds.Left || x > bounds.Right || y < bounds.Top || y > bounds.Bottom) {
                                    return false;
                                }
                            }
                        }
                        tx = x;
                        ty = y;
                    }
                    if (doc_content.Is_TableCellContent()) {
                        cur_doc_content = doc_content.Parent.Row.Table.Parent;
                        while (cur_doc_content.Is_TableCellContent()) {
                            rel_page_index = this.pageIndex - cur_doc_content.Get_StartPage_Absolute();
                            if (isRealObject(cur_doc_content.Pages[rel_page_index])) {
                                bounds = cur_doc_content.Pages[rel_page_index].Bounds;
                                if (tx < bounds.Left || tx > bounds.Right || ty < bounds.Top || ty > bounds.Bottom) {
                                    return false;
                                }
                            }
                            cur_doc_content = cur_doc_content.Parent.Row.Table.Parent;
                            if (cur_doc_content.Parent instanceof WordShape) {
                                shape = cur_doc_content.Parent;
                                if (shape.group == null && isRealObject(shape.parent) && isRealObject(shape.parent.Parent) && isRealObject(shape.parent.Parent.Parent)) {
                                    cur_doc_content = shape.parent.Parent.Parent;
                                } else {
                                    cur_group = shape.group;
                                    if (isRealObject(shape.group)) {
                                        while (isRealObject(cur_group.group)) {
                                            cur_group = cur_group.group;
                                        }
                                        if (isRealObject(cur_group) && isRealObject(cur_group.parent) && isRealObject(cur_group.parent.Parent) && isRealObject(cur_group.parent.Parent.Parent)) {
                                            cur_doc_content = cur_group.parent.Parent.Parent;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            var _l, _t, _r, _b;
            if (isRealObject(this.spPr.geometry) && isRealObject(this.spPr.geometry.rect)) {
                var rect = this.spPr.geometry.rect;
                _l = rect.l;
                _t = rect.t;
                _r = rect.r;
                _b = rect.b;
            } else {
                _l = 0;
                _t = 0;
                _r = this.absExtX;
                _b = this.absExtY;
            }
            if (!this.bodyPr.upright) {
                var invert_text_transform = global_MatrixTransformer.Invert(this.transform);
                var transformed_x = invert_text_transform.TransformPointX(x, y);
                var transformed_y = invert_text_transform.TransformPointY(x, y);
                return transformed_x > _l && transformed_x < _r && transformed_y > _t && transformed_y < _b;
            } else {
                invert_text_transform = global_MatrixTransformer.Invert(this.transformText);
                transformed_x = invert_text_transform.TransformPointX(x, y);
                transformed_y = invert_text_transform.TransformPointY(x, y);
                var DCHeight = 0;
                for (var i = 0, n = this.textBoxContent.Get_PagesCount(); i < n; ++i) {
                    var bounds = this.textBoxContent.Get_PageBounds(i);
                    DCHeight += bounds.Bottom - bounds.Top;
                }
                return transformed_x > 0 && transformed_x < this.textBoxContent.XLimit && transformed_y > 0 && transformed_y < DCHeight;
            }
        }
        return false;
    },
    checkLine: function () {
        return (this.spPr.geometry && CheckLinePreset(this.spPr.geometry.preset));
    },
    canGroup: function () {
        return true;
    },
    canUnGroup: function () {
        return true;
    },
    paragraphClearFormatting: function () {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Paragraph_ClearFormatting();
        }
    },
    updatePosition: function (x, y) {
        this.setAbsoluteTransform(x, y, null, null, null, null, null);
        this.calculateTransformMatrix();
        this.calculateTransformTextMatrix();
    },
    updatePosition2: function (x, y) {
        this.absOffsetX = x;
        this.absOffsetY = y;
        if (this.parent) {
            this.parent.absOffsetX = x;
            this.parent.absOffsetY = y;
        }
        this.calculateTransformMatrix();
        this.calculateTransformTextMatrix();
    },
    cursorGetPos: function () {
        if (isRealObject(this.textBoxContent) && typeof this.textBoxContent.Cursor_GetPos === "function") {
            var pos = this.textBoxContent.Cursor_GetPos();
            var transform = this.transformText;
            var x = transform.TransformPointX(pos.X, pos.Y);
            var y = transform.TransformPointY(pos.X, pos.Y);
            return {
                X: x,
                Y: y
            };
        }
        return {
            X: 0,
            Y: 0
        };
    },
    setParagraphSpacing: function (Spacing) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Set_ParagraphSpacing(Spacing);
        }
    },
    checkDrawGeometry: function () {
        return this.spPr.geometry && ((this.pen && this.pen.Fill && this.pen.Fill.fill && this.pen.Fill.fill.type != FILL_TYPE_NOFILL && this.pen.Fill.fill.type != FILL_TYPE_NONE) || (this.brush && this.brush.fill && this.brush.fill && this.brush.fill.type != FILL_TYPE_NOFILL && this.brush.fill.type != FILL_TYPE_NONE));
    },
    getAngle: function (x, y) {
        var x_lt, y_lt;
        var hc, vc, sin, cos;
        hc = this.absExtX * 0.5;
        vc = this.absExtY * 0.5;
        sin = Math.sin(this.absRot);
        cos = Math.cos(this.absRot);
        x_lt = -hc * cos + vc * sin + this.absOffsetX + hc;
        y_lt = -hc * sin - vc * cos + this.absOffsetY + vc;
        var tx = x - x_lt,
        ty = y - y_lt;
        var vx, vy;
        vx = tx * cos + ty * sin;
        vy = -tx * sin + ty * cos;
        var ang = Math.PI * 0.5 + Math.atan2(vy - vc, vx - hc);
        if (!this.absFlipV) {
            return ang;
        } else {
            return ang + Math.PI;
        }
    },
    getResizeCoefficients: function (numHandle, x, y) {
        var t_x, t_y;
        var cx, cy;
        cx = this.absExtX > 0 ? this.absExtX : 0.01;
        cy = this.absExtY > 0 ? this.absExtY : 0.01;
        var p = this.transformPointRelativeShape(x, y);
        switch (numHandle) {
        case 0:
            return {
                kd1: (cx - p.x) / cx,
                kd2: (cy - p.y) / cy
            };
        case 1:
            return {
                kd1: (cy - p.y) / cy,
                kd2: 0
            };
        case 2:
            return {
                kd1: (cy - p.y) / cy,
                kd2: p.x / cx
            };
        case 3:
            return {
                kd1: p.x / cx,
                kd2: 0
            };
        case 4:
            return {
                kd1: p.x / cx,
                kd2: p.y / cy
            };
        case 5:
            return {
                kd1: p.y / cy,
                kd2: 0
            };
        case 6:
            return {
                kd1: p.y / cy,
                kd2: (cx - p.x) / cx
            };
        case 7:
            return {
                kd1: (cx - p.x) / cx,
                kd2: 0
            };
        }
        return {
            kd1: 1,
            kd2: 1
        };
    },
    Get_AllParagraphs_ByNumbering: function (NumPr, ParaArray) {
        if (isRealObject(this.textBoxContent) && typeof this.textBoxContent.Get_AllParagraphs_ByNumbering === "function") {
            this.textBoxContent.Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
        }
    },
    cardDirectionToNumber: function (cardDirection) {
        var y1, y3, y5, y7, hc, vc, sin, cos, numN, x1, x3, x5, x7;
        hc = this.absExtX * 0.5;
        vc = this.absExtY * 0.5;
        sin = Math.sin(this.absRot);
        cos = Math.cos(this.absRot);
        y1 = -cos * vc;
        y3 = sin * hc;
        y5 = cos * vc;
        y7 = -sin * hc;
        var t_m = this.transform;
        x1 = t_m.TransformPointX(hc, 0);
        x3 = t_m.TransformPointX(this.absExtX, vc);
        x5 = t_m.TransformPointX(hc, this.absExtY);
        x7 = t_m.TransformPointX(0, vc);
        y1 = t_m.TransformPointY(hc, 0);
        y3 = t_m.TransformPointY(this.absExtX, vc);
        y5 = t_m.TransformPointY(hc, this.absExtY);
        y7 = t_m.TransformPointY(0, vc);
        switch (Math.min(y1, y3, y5, y7)) {
        case y1:
            numN = 1;
            break;
        case y3:
            numN = 3;
            break;
        case y5:
            numN = 5;
            break;
        case y7:
            numN = 7;
            break;
        default:
            numN = 1;
        }
        if ((x5 - x1) * (y3 - y7) - (y5 - y1) * (x3 - x7) < 0) {
            return (cardDirection + numN) % 8;
        } else {
            var t = numN - cardDirection;
            if (t < 0) {
                return t + 8;
            } else {
                return t;
            }
        }
    },
    numberToCardDirection: function (handleNumber) {
        var y1, y3, y5, y7, hc, vc, numN, x1, x3, x5, x7;
        hc = this.absExtX * 0.5;
        vc = this.absExtY * 0.5;
        var t_m = this.transform;
        x1 = t_m.TransformPointX(hc, 0);
        x3 = t_m.TransformPointX(this.absExtX, vc);
        x5 = t_m.TransformPointX(hc, this.absExtY);
        x7 = t_m.TransformPointX(0, vc);
        y1 = t_m.TransformPointY(hc, 0);
        y3 = t_m.TransformPointY(this.absExtX, vc);
        y5 = t_m.TransformPointY(hc, this.absExtY);
        y7 = t_m.TransformPointY(0, vc);
        switch (Math.min(y1, y3, y5, y7)) {
        case y1:
            numN = 1;
            break;
        case y3:
            numN = 3;
            break;
        case y5:
            numN = 5;
            break;
        case y7:
            numN = 7;
            break;
        default:
            numN = 1;
        }
        var tmpArr = [];
        if ((x5 - x1) * (y3 - y7) - (y5 - y1) * (x3 - x7) < 0) {
            tmpArr[numN] = CARD_DIRECTION_N;
            tmpArr[(numN + 1) % 8] = CARD_DIRECTION_NE;
            tmpArr[(numN + 2) % 8] = CARD_DIRECTION_E;
            tmpArr[(numN + 3) % 8] = CARD_DIRECTION_SE;
            tmpArr[(numN + 4) % 8] = CARD_DIRECTION_S;
            tmpArr[(numN + 5) % 8] = CARD_DIRECTION_SW;
            tmpArr[(numN + 6) % 8] = CARD_DIRECTION_W;
            tmpArr[(numN + 7) % 8] = CARD_DIRECTION_NW;
            return tmpArr[handleNumber];
        } else {
            var t;
            tmpArr[numN] = CARD_DIRECTION_N;
            t = numN - 1;
            if (t < 0) {
                t += 8;
            }
            tmpArr[t] = CARD_DIRECTION_NE;
            t = numN - 2;
            if (t < 0) {
                t += 8;
            }
            tmpArr[t] = CARD_DIRECTION_E;
            t = numN - 3;
            if (t < 0) {
                t += 8;
            }
            tmpArr[t] = CARD_DIRECTION_SE;
            t = numN - 4;
            if (t < 0) {
                t += 8;
            }
            tmpArr[t] = CARD_DIRECTION_S;
            t = numN - 5;
            if (t < 0) {
                t += 8;
            }
            tmpArr[t] = CARD_DIRECTION_SW;
            t = numN - 6;
            if (t < 0) {
                t += 8;
            }
            tmpArr[t] = CARD_DIRECTION_W;
            t = numN - 7;
            if (t < 0) {
                t += 8;
            }
            tmpArr[t] = CARD_DIRECTION_NW;
            return tmpArr[handleNumber];
        }
    },
    createTrackObjectForMove: function (majorOffsetX, majorOffsetY) {
        return new MoveTrackShape(this, majorOffsetX, majorOffsetY);
    },
    createTrackObjectForResize: function (handleNum, pageIndex) {
        return new ResizeTrackShape(this, handleNum, pageIndex);
    },
    createTrackObjectForRotate: function (pageIndex) {
        return new RotateTrackShape(this, pageIndex);
    },
    createObjectForDrawOnOverlayInGroup: function () {
        return new ShapeForDrawOnOverlayInGroup(this);
    },
    createObjectForResizeInGroup: function () {
        return new ShapeForTrackInResizeGroup(this);
    },
    createTrackObjectForMoveInGroup: function (majorOffsetX, majorOffsetY) {
        return new ShapeTrackForMoveInGroup(this, majorOffsetX, majorOffsetY);
    },
    canZeroDimension: function () {
        return false;
    },
    canFlipAtAddTrack: function () {
        return false;
    },
    setAbsoluteTransform: function (offsetX, offsetY, extX, extY, rot, flipH, flipV, open) {
        if (offsetX != null) {
            this.absOffsetX = offsetX;
            this.recalcInfo.recalculateTextTransform = true;
        }
        if (offsetY != null) {
            this.absOffsetY = offsetY;
            this.recalcInfo.recalculateTextTransform = true;
        }
        if (extX != null) {
            this.absExtX = extX;
            this.recalcInfo.recalculateTextTransform = true;
        }
        if (extY != null) {
            this.absExtY = extY;
            this.recalcInfo.recalculateTextTransform = true;
        }
        if (rot != null) {
            this.absRot = rot;
        }
        if (flipH != null) {
            this.absFlipH = flipH;
        }
        if (flipV != null) {
            this.absFlipV = flipV;
        }
        if (this.parent) {
            this.parent.setAbsoluteTransform(offsetX, offsetY, extX, extY, rot, flipH, flipV, true);
        }
        if (open !== false) {
            this.calculateContent();
        }
        this.recalculate(open);
    },
    calculateAfterCopy: function () {
        var xfrm = this.spPr.xfrm;
        this.setAbsoluteTransform(xfrm.offX, xfrm.offY, xfrm.extX, xfrm.extY, xfrm.rot == null ? 0 : xfrm.rot, xfrm.flipH == null ? false : xfrm.flipH, xfrm.flipV == null ? false : xfrm.flipV);
        this.calculateTransformMatrix();
        this.calculateFill();
        this.calculateLine();
    },
    setXfrm: function (offsetX, offsetY, extX, extY, rot, flipH, flipV) {
        var data = {
            Type: historyitem_SetXfrmShape
        };
        var _xfrm = this.spPr.xfrm;
        if (offsetX !== null) {
            data.oldOffsetX = _xfrm.offX;
            data.newOffsetX = offsetX;
            _xfrm.offX = offsetX;
        }
        if (offsetY !== null) {
            data.oldOffsetY = _xfrm.offY;
            data.newOffsetY = offsetY;
            _xfrm.offY = offsetY;
        }
        if (extX !== null) {
            data.oldExtX = _xfrm.extX;
            data.newExtX = extX;
            _xfrm.extX = extX;
        }
        if (extY !== null) {
            data.oldExtY = _xfrm.extY;
            data.newExtY = extY;
            _xfrm.extY = extY;
        }
        if (rot !== null) {
            data.oldRot = _xfrm.rot == null ? 0 : _xfrm.rot;
            data.newRot = rot;
            _xfrm.rot = rot;
        }
        if (flipH !== null) {
            data.oldFlipH = _xfrm.flipH == null ? false : _xfrm.flipH;
            data.newFlipH = flipH;
            _xfrm.flipH = flipH;
        }
        if (flipV !== null) {
            data.oldFlipV = _xfrm.flipV == null ? false : _xfrm.flipV;
            data.newFlipV = flipV;
            _xfrm.flipV = flipV;
        }
        History.Add(this, data);
    },
    getAbsolutePosition: function () {
        return {
            x: this.absOffsetX,
            y: this.absOffsetY
        };
    },
    getTransformMatrix: function () {
        return this.transform;
    },
    getTransformTextMatrix: function () {
        return this.transformText;
    },
    getExtensions: function () {
        return {
            extX: this.absExtX,
            extY: this.absExtY
        };
    },
    getAspect: function (num) {
        var _tmp_x = this.absExtX != 0 ? this.absExtX : 0.1;
        var _tmp_y = this.absExtY != 0 ? this.absExtY : 0.1;
        return num === 0 || num === 4 ? _tmp_x / _tmp_y : _tmp_y / _tmp_x;
    },
    getSpTree: function () {
        return [this];
    },
    getFullRotate: function () {
        if (this.mainGroup === null) {
            return this.absRot;
        } else {
            var ret = this.absRot + this.mainGroup.absRot;
            while (ret >= Math.PI * 2) {
                ret -= Math.PI * 2;
            }
            while (ret < 0) {
                ret += Math.PI * 2;
            }
        }
        return ret;
    },
    getFullOffset: function () {
        var _horizontal_center = this.absExtX * 0.5;
        var _vertical_center = this.absExtY * 0.5;
        return {
            x: this.transform.TransformPointX(_horizontal_center, _vertical_center) - _horizontal_center,
            y: this.transform.TransformPointY(_horizontal_center, _vertical_center) - _vertical_center
        };
    },
    getFullFlip: function () {
        var _transform = this.transform;
        var _full_rotate = this.getFullRotate();
        var _full_pos_x_lt = _transform.TransformPointX(0, 0);
        var _full_pos_y_lt = _transform.TransformPointY(0, 0);
        var _full_pos_x_rt = _transform.TransformPointX(this.absExtX, 0);
        var _full_pos_y_rt = _transform.TransformPointY(this.absExtX, 0);
        var _full_pos_x_rb = _transform.TransformPointX(this.absExtX, this.absExtY);
        var _full_pos_y_rb = _transform.TransformPointY(this.absExtX, this.absExtY);
        var _rotate_matrix = new CMatrix();
        _rotate_matrix.Rotate(rad2deg(_full_rotate), MATRIX_ORDER_PREPEND);
        var _rotated_pos_x_lt = _rotate_matrix.TransformPointX(_full_pos_x_lt, _full_pos_y_lt);
        var _rotated_pos_x_rt = _rotate_matrix.TransformPointX(_full_pos_x_rt, _full_pos_y_rt);
        var _rotated_pos_y_rt = _rotate_matrix.TransformPointY(_full_pos_x_rt, _full_pos_y_rt);
        var _rotated_pos_y_rb = _rotate_matrix.TransformPointY(_full_pos_x_rb, _full_pos_y_rb);
        return {
            flipH: _rotated_pos_x_lt > _rotated_pos_x_rt,
            flipV: _rotated_pos_y_rt > _rotated_pos_y_rb
        };
    },
    calculateSnapArrays: function (snapArrayX, snapArrayY) {
        var t = this.transform;
        snapArrayX.push(t.TransformPointX(0, 0));
        snapArrayY.push(t.TransformPointY(0, 0));
        snapArrayX.push(t.TransformPointX(this.absExtX, 0));
        snapArrayY.push(t.TransformPointY(this.absExtX, 0));
        snapArrayX.push(t.TransformPointX(this.absExtX * 0.5, this.absExtY * 0.5));
        snapArrayY.push(t.TransformPointY(this.absExtX * 0.5, this.absExtY * 0.5));
        snapArrayX.push(t.TransformPointX(this.absExtX, this.absExtY));
        snapArrayY.push(t.TransformPointY(this.absExtX, this.absExtY));
        snapArrayX.push(t.TransformPointX(0, this.absExtY));
        snapArrayY.push(t.TransformPointY(0, this.absExtY));
    },
    hit: function (x, y) {
        if (isRealObject(this.parent) && isRealObject(this.parent.Parent) && isRealObject(this.parent.Parent.Parent) && this.parent.Parent.Parent instanceof CDocumentContent && this.parent.wrappingType !== WRAPPING_TYPE_NONE && (!(this.parent.Parent.Parent.Is_HdrFtr()) || this.parent.Is_Inline()) && !this.parent.Parent.Parent.Is_TopDocument() && !isRealObject(this.group)) {
            var tx, ty;
            var b_check = false;
            if (!this.parent.isShapeChild()) {
                tx = x;
                ty = y;
                b_check = true;
            } else {
                var parent_shape = this.parent.getParentShape();
                if (isRealObject(parent_shape) && isRealObject(parent_shape.invertTextMatrix)) {
                    tx = parent_shape.invertTextMatrix.TransformPointX(x, y);
                    ty = parent_shape.invertTextMatrix.TransformPointY(x, y);
                    b_check = true;
                }
            }
            if (b_check) {
                var doc_content = this.parent.Parent.Parent;
                var rel_page_index = this.pageIndex - doc_content.Get_StartPage_Absolute();
                if (isRealObject(doc_content.Pages[rel_page_index])) {
                    var bounds = doc_content.Pages[rel_page_index].Bounds;
                    if (tx < bounds.Left || tx > bounds.Right || ty < bounds.Top || ty > bounds.Bottom) {
                        return false;
                    }
                }
                var cur_doc_content;
                cur_doc_content = doc_content;
                if (cur_doc_content.Parent instanceof WordShape) {
                    var shape = cur_doc_content.Parent;
                    if (shape.group == null && isRealObject(shape.parent) && isRealObject(shape.parent.Parent) && isRealObject(shape.parent.Parent.Parent)) {
                        cur_doc_content = shape.parent.Parent.Parent;
                    } else {
                        var cur_group = shape.group;
                        if (isRealObject(shape.group)) {
                            while (isRealObject(cur_group.group)) {
                                cur_group = cur_group.group;
                            }
                            if (isRealObject(cur_group) && isRealObject(cur_group.parent) && isRealObject(cur_group.parent.Parent) && isRealObject(cur_group.parent.Parent.Parent)) {
                                cur_doc_content = cur_group.parent.Parent.Parent;
                            }
                        }
                    }
                    if (cur_doc_content.Is_TableCellContent()) {
                        rel_page_index = this.pageIndex - cur_doc_content.Get_StartPage_Absolute();
                        if (isRealObject(cur_doc_content.Pages[rel_page_index])) {
                            bounds = cur_doc_content.Pages[rel_page_index].Bounds;
                            if (x < bounds.Left || x > bounds.Right || y < bounds.Top || y > bounds.Bottom) {
                                return false;
                            }
                        }
                    }
                    tx = x;
                    ty = y;
                }
                if (doc_content.Is_TableCellContent()) {
                    cur_doc_content = doc_content.Parent.Row.Table.Parent;
                    while (cur_doc_content.Is_TableCellContent()) {
                        rel_page_index = this.pageIndex - cur_doc_content.Get_StartPage_Absolute();
                        if (isRealObject(cur_doc_content.Pages[rel_page_index])) {
                            bounds = cur_doc_content.Pages[rel_page_index].Bounds;
                            if (tx < bounds.Left || tx > bounds.Right || ty < bounds.Top || ty > bounds.Bottom) {
                                return false;
                            }
                        }
                        cur_doc_content = cur_doc_content.Parent.Row.Table.Parent;
                        if (cur_doc_content.Parent instanceof WordShape) {
                            shape = cur_doc_content.Parent;
                            if (shape.group == null && isRealObject(shape.parent) && isRealObject(shape.parent.Parent) && isRealObject(shape.parent.Parent.Parent)) {
                                cur_doc_content = shape.parent.Parent.Parent;
                            } else {
                                cur_group = shape.group;
                                if (isRealObject(shape.group)) {
                                    while (isRealObject(cur_group.group)) {
                                        cur_group = cur_group.group;
                                    }
                                    if (isRealObject(cur_group) && isRealObject(cur_group.parent) && isRealObject(cur_group.parent.Parent) && isRealObject(cur_group.parent.Parent.Parent)) {
                                        cur_doc_content = cur_group.parent.Parent.Parent;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (this.spPr.geometry === null) {
            return this.hitInBox(x, y);
        }
        var t_x, t_y;
        if (this.group != null) {
            var inv_t = global_MatrixTransformer.Invert(this.group.transform);
            t_x = inv_t.TransformPointX(x, y);
            t_y = inv_t.TransformPointY(x, y);
        } else {
            t_x = x;
            t_y = y;
        }
        var _hit_context = this.drawingDocument.CanvasHitContext;
        var _transformed_point = this.transformPointRelativeShape(t_x, t_y);
        if (this.spPr.geometry) {
            if (this.spPr.geometry.hitInInnerArea(_hit_context, _transformed_point.x, _transformed_point.y) === false) {
                if (this.spPr.geometry.hitInPath(_hit_context, _transformed_point.x, _transformed_point.y)) {
                    return true;
                }
            } else {
                return true;
            }
        }
        if (this.selected === true) {
            return this.hitInBox(x, y);
        }
        return false;
    },
    Is_TopDocument: function () {
        return false;
    },
    remove: function (Count, bOnlyText, bRemoveOnlySelection) {
        if (this.textBoxContent) {
            this.textBoxContent.Remove(Count, bOnlyText, bRemoveOnlySelection);
        }
    },
    selectionCheck: function (x, y, pageAbs) {
        if (this.textBoxContent && this.transformText) {
            if (!this.hitToTextRect(x, y)) {
                return false;
            }
            var t = global_MatrixTransformer.Invert(this.transformText);
            var t_x = t.TransformPointX(x, y);
            var t_y = t.TransformPointY(x, y);
            return this.textBoxContent.Selection_Check(t_x, t_y, pageAbs);
        }
        return false;
    },
    documentSearch: function (String, search_Common) {
        if (isRealObject(this.textBoxContent)) {
            editor.WordControl.m_oLogicDocument.DrawingDocument.StartSearchTransform(this.transformText);
            this.textBoxContent.DocumentSearch(String, search_Common);
            editor.WordControl.m_oLogicDocument.DrawingDocument.EndSearchTransform();
        }
    },
    setParagraphContextualSpacing: function (Value) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Set_ParagraphContextualSpacing(Value);
        }
    },
    hitToAdj: function (x, y, radius) {
        if (!this.spPr.geometry || this.spPr.geometry.ahPolarLst.length === 0 && this.spPr.geometry.ahXYLst.length === 0) {
            return {
                hit: false,
                adjPolarFlag: null,
                adjNum: null
            };
        }
        var t_x, t_y;
        if (this.group != null) {
            var inv_t = global_MatrixTransformer.Invert(this.group.transform);
            t_x = inv_t.TransformPointX(x, y);
            t_y = inv_t.TransformPointY(x, y);
        } else {
            t_x = x;
            t_y = y;
        }
        var x_lt, y_lt;
        var hc, vc, sin, cos;
        hc = this.absExtX * 0.5;
        vc = this.absExtY * 0.5;
        sin = Math.sin(this.absRot);
        cos = Math.cos(this.absRot);
        x_lt = -hc * cos + vc * sin + this.absOffsetX + hc;
        y_lt = -hc * sin - vc * cos + this.absOffsetY + vc;
        var tx = t_x - x_lt,
        ty = t_y - y_lt;
        var vx, vy;
        vx = tx * cos + ty * sin;
        vy = -tx * sin + ty * cos;
        if (this.absFlipH) {
            vx = this.absExtX - vx;
        }
        if (this.absFlipV) {
            vy = this.absExtY - vy;
        }
        var _radius = typeof radius === "number" ? radius : this.drawingDocument.GetMMPerDot(TRACK_CIRCLE_RADIUS);
        if (typeof global_mouseEvent.KoefPixToMM === "number" && !isNaN(global_mouseEvent.KoefPixToMM)) {
            _radius *= global_mouseEvent.KoefPixToMM;
        }
        return this.spPr.geometry.hitToAdj(vx, vy, _radius);
    },
    hitInBox: function (x, y) {
        var t_x, t_y;
        if (this.group != null) {
            var inv_t = global_MatrixTransformer.Invert(this.group.transform);
            t_x = inv_t.TransformPointX(x, y);
            t_y = inv_t.TransformPointY(x, y);
        } else {
            t_x = x;
            t_y = y;
        }
        var _transformed_point = this.transformPointRelativeShape(t_x, t_y);
        var _tr_x = _transformed_point.x;
        var _tr_y = _transformed_point.y;
        var _hit_context = this.drawingDocument.CanvasHitContext;
        return (HitInLine(_hit_context, _tr_x, _tr_y, 0, 0, this.absExtX, 0) || HitInLine(_hit_context, _tr_x, _tr_y, this.absExtX, 0, this.absExtX, this.absExtY) || HitInLine(_hit_context, _tr_x, _tr_y, this.absExtX, this.absExtY, 0, this.absExtY) || HitInLine(_hit_context, _tr_x, _tr_y, 0, this.absExtY, 0, 0) || HitInLine(_hit_context, _tr_x, _tr_y, this.absExtX * 0.5, 0, this.absExtX * 0.5, -this.drawingDocument.GetMMPerDot(TRACK_DISTANCE_ROTATE)));
    },
    hitToPath: function (x, y) {
        if (isRealObject(this.spPr.geometry) && typeof this.spPr.geometry.hitInPath === "function") {
            var invertMatrix = global_MatrixTransformer.Invert(this.transform);
            var tx, ty;
            tx = invertMatrix.TransformPointX(x, y);
            ty = invertMatrix.TransformPointY(x, y);
            return this.spPr.geometry.hitInPath(this.drawingDocument.CanvasHitContext, tx, ty);
        }
        return false;
    },
    selectionSetStart: function (x, y, event, pageIndex) {
        if (this.textBoxContent) {
            var invert_transform = global_MatrixTransformer.Invert(this.transformText);
            var t_x = invert_transform.TransformPointX(x, y);
            var t_y = invert_transform.TransformPointY(x, y);
            if (typeof this.selectStartPage === "number" && this.selectStartPage > -1) {
                this.textBoxContent.Set_StartPage(this.selectStartPage);
            }
            this.textBoxContent.Selection_SetStart(t_x, t_y, typeof this.selectStartPage === "number" && this.selectStartPage > -1 ? this.selectStartPage : this.pageIndex, event);
        }
    },
    setParent: function (paraDrawing) {
        var data = {
            Type: historyitem_SetParent
        };
        if (isRealObject(this.parent)) {
            data.oldParent = this.parent.Get_Id();
        } else {
            data.oldParent = null;
        }
        if (isRealObject(paraDrawing)) {
            data.newParent = paraDrawing.Get_Id();
        } else {
            data.newParent = null;
        }
        History.Add(this, data);
        this.parent = paraDrawing;
    },
    selectionSetEnd: function (x, y, event, pageIndex) {
        if (this.textBoxContent) {
            var invert_transform = global_MatrixTransformer.Invert(this.transformText);
            var t_x = invert_transform.TransformPointX(x, y);
            var t_y = invert_transform.TransformPointY(x, y);
            if (typeof this.selectStartPage === "number" && this.selectStartPage > -1) {
                this.textBoxContent.Set_StartPage(this.selectStartPage);
            }
            this.textBoxContent.Selection_SetEnd(t_x, t_y, typeof this.selectStartPage === "number" && this.selectStartPage > -1 ? this.selectStartPage : this.pageIndex, event);
        }
    },
    setParagraphTabs: function (tabs) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Set_ParagraphTabs(tabs);
        }
    },
    setParagraphBorders: function (val) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Set_ParagraphBorders(val);
        }
    },
    selectionRemove: function () {
        if (this.textBoxContent) {
            this.textBoxContent.Selection_Remove();
        }
    },
    updateSelectionState: function () {
        if (this.textBoxContent) {
            var Doc = this.textBoxContent;
            if (true === Doc.Is_SelectionUse() && !Doc.Selection_IsEmpty()) {
                this.document.DrawingDocument.UpdateTargetTransform(this.transformText);
                this.document.DrawingDocument.TargetEnd();
                this.document.DrawingDocument.SelectEnabled(true);
                this.document.DrawingDocument.SelectClear();
                this.document.DrawingDocument.SelectShow();
            } else {
                this.document.DrawingDocument.UpdateTargetTransform(this.transformText);
                this.document.DrawingDocument.TargetShow();
                this.document.DrawingDocument.SelectEnabled(false);
            }
        }
    },
    recalculateCurPos: function () {
        if (this.textBoxContent) {
            this.textBoxContent.RecalculateCurPos();
        }
    },
    setParagraphNumbering: function (numInfo) {
        if (this.textBoxContent) {
            this.textBoxContent.Set_ParagraphNumbering(numInfo);
        }
    },
    Get_StartPage_Absolute: function () {
        return 0;
    },
    Get_StartPage_Relative: function () {
        return 0;
    },
    setPageIndex: function (newPageIndex) {
        this.pageIndex = newPageIndex;
        if (this.textBoxContent) {
            this.textBoxContent.Set_StartPage(newPageIndex);
        }
    },
    select: function (pageIndex) {
        this.selected = true;
        if (typeof pageIndex === "number") {
            this.selectStartPage = pageIndex;
        }
    },
    deselect: function () {
        this.selected = false;
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Selection_Remove();
        }
        this.selectStartPage = -1;
    },
    calculateWrapPolygon: function () {
        if (this.spPr.geometry === null) {
            var ret = [];
            ret.push({
                x: 0,
                y: 0
            });
            ret.push({
                x: this.absExtX,
                y: 0
            });
            ret.push({
                x: this.absExtX,
                y: this.absExtY
            });
            ret.push({
                x: 0,
                y: this.absExtY
            });
            return ret;
        }
        return this.spPr.geometry.calculateWrapPolygon();
    },
    getArrayWrapPolygons: function () {
        if (this.spPr.geometry) {
            return this.spPr.geometry.getArrayPolygons();
        }
        return [];
    },
    applyTextPr: function (paraItem, bRecalculate) {
        if (this.textBoxContent) {
            this.textBoxContent.Set_ApplyToAll(true);
            this.textBoxContent.Paragraph_Add(paraItem, bRecalculate);
            this.textBoxContent.Set_ApplyToAll(false);
            if (paraItem.Value.Check_NeedRecalc() === true) {
                this.textBoxContent.Recalculate();
            }
        }
    },
    canChangeWrapPolygon: function () {
        return true;
    },
    cursorMoveLeft: function (AddToSelect, Word) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Cursor_MoveLeft(AddToSelect, Word);
            this.recalculateCurPos();
            this.document.Document_UpdateSelectionState();
        }
    },
    cursorMoveRight: function (AddToSelect, Word) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Cursor_MoveRight(AddToSelect, Word);
            this.recalculateCurPos();
            this.document.Document_UpdateSelectionState();
        }
    },
    cursorMoveUp: function (AddToSelect) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Cursor_MoveUp(AddToSelect);
            this.recalculateCurPos();
            this.document.Document_UpdateSelectionState();
        }
    },
    cursorMoveDown: function (AddToSelect) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Cursor_MoveDown(AddToSelect);
            this.recalculateCurPos();
            this.document.Document_UpdateSelectionState();
        }
    },
    cursorMoveEndOfLine: function (AddToSelect) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Cursor_MoveEndOfLine(AddToSelect);
            this.recalculateCurPos();
            this.document.Document_UpdateSelectionState();
        }
    },
    cursorMoveStartOfLine: function (AddToSelect) {
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Cursor_MoveStartOfLine(AddToSelect);
            this.recalculateCurPos();
            this.document.Document_UpdateSelectionState();
        }
    },
    selectionIsEmpty: function () {
        if (this.textBoxContent) {
            return this.textBoxContent.Is_SelectionUse();
        }
        return false;
    },
    Undo: function (data) {
        var b_history_is_on = History.Is_On();
        if (b_history_is_on) {
            History.TurnOff();
        }
        switch (data.Type) {
        case historyitem_SetBlipFill:
            this.blipFill = data.oldPr;
            break;
        case historyitem_SetAbsoluteTransform:
            if (data.oldOffsetX != null) {
                this.absOffsetX = data.oldOffsetX;
            }
            if (data.oldOffsetY != null) {
                this.absOffsetY = data.oldOffsetY;
            }
            if (data.oldExtX != null) {
                this.absExtX = data.oldExtX;
            }
            if (data.oldExtY != null) {
                this.absExtY = data.oldExtY;
            }
            if (data.oldRot != null) {
                this.absRot = data.oldRot;
            }
            if (data.oldFlipH != null) {
                this.absFlipH = data.oldFlipH;
            }
            if (data.oldFlipV != null) {
                this.absFlipV = data.oldFlipV;
            }
            this.calculateAfterResize();
            break;
        case historyitem_SetXfrmShape:
            var xfrm = this.spPr.xfrm;
            if (typeof data.oldOffsetX === "number") {
                xfrm.offX = data.oldOffsetX;
            }
            if (typeof data.oldOffsetY === "number") {
                xfrm.offY = data.oldOffsetY;
            }
            if (typeof data.oldExtX === "number") {
                xfrm.extX = data.oldExtX;
            }
            if (typeof data.oldExtY === "number") {
                xfrm.extY = data.oldExtY;
            }
            if (typeof data.oldRot === "number") {
                xfrm.rot = data.oldRot;
            }
            if (data.oldFlipH != null) {
                xfrm.flipH = data.oldFlipH;
            }
            if (data.oldFlipV != null) {
                xfrm.flipV = data.oldFlipV;
            }
            if (typeof data.oldExtX === "number" || typeof data.oldExtY === "number") {
                if (this.spPr.geometry) {
                    this.spPr.geometry.Recalculate(xfrm.extX, xfrm.extY);
                }
            }
            var posX, posY;
            if (this.group == null) {
                posX = null;
                posY = null;
            } else {
                posX = xfrm.offX;
                posY = xfrm.offY;
            }
            this.setAbsoluteTransform(posX, posY, xfrm.extX, xfrm.extY, xfrm.rot == null ? 0 : xfrm.rot, xfrm.flipH == null ? false : xfrm.flipH, xfrm.flipV == null ? false : xfrm.flipV);
            break;
        case historyitem_SetRotate:
            var oldRot = data.oldRot == null ? 0 : data.oldRot;
            this.spPr.xfrm.rot = oldRot;
            this.absRot = oldRot;
            if (this.parent) {
                this.parent.absRot = oldRot;
            }
            this.calculateTransformMatrix();
            this.calculateLeftTopPoint();
            this.calculateTransformTextMatrix();
            break;
        case historyitem_SetSizes:
            this.spPr.xfrm.extX = data.oldW;
            this.spPr.xfrm.extY = data.oldH;
            this.spPr.xfrm.flipH = data.oldFlipH;
            this.spPr.xfrm.flipV = data.oldFlipV;
            this.absExtX = data.oldW;
            this.absExtY = data.oldH;
            this.absFlipH = data.oldFlipH;
            this.absFlipV = data.oldFlipV;
            this.absOffsetX = data.oldPosX;
            this.absOffsetY = data.oldPosY;
            if (this.parent) {
                this.parent.absOffsetX = data.oldPosX;
                this.parent.absOffsetY = data.oldPosY;
                this.parent.absExtX = data.oldW;
                this.parent.absExtY = data.oldH;
                this.parent.flipH = data.oldFlipH;
                this.parent.flipV = data.oldFlipV;
            }
            this.calculateAfterResize();
            break;
        case historyitem_SetSizesInGroup:
            this.absOffsetX = data.oldX;
            this.absOffsetY = data.oldY;
            this.absExtX = data.oldExtX;
            this.absExtY = data.oldExtY;
            if (this.parent) {
                this.parent.absOffsetX = data.oldX;
                this.parent.absOffsetY = data.oldY;
                this.parent.absExtX = data.oldExtX;
                this.parent.absExtY = data.oldExtY;
            }
            this.calculateAfterResize();
            break;
        case historyitem_SetAdjValue:
            if (this.spPr.geometry) {
                var geometry = this.spPr.geometry;
                if (typeof geometry.gdLst[data.ref1] === "number") {
                    geometry.gdLst[data.ref1] = data.oldValue1;
                }
                if (typeof geometry.gdLst[data.ref2] === "number") {
                    geometry.gdLst[data.ref2] = data.oldValue2;
                }
                geometry.Recalculate(this.absExtX, this.absExtY);
                this.calculateContent();
                this.calculateTransformTextMatrix();
            }
            break;
        case historyitem_SetGroup:
            this.group = data.oldGroup;
            break;
        case historyitem_SetMainGroup:
            this.mainGroup = data.oldGroup;
            break;
        case historyitem_ChangeFill:
            this.spPr.Fill = data.old_Fill;
            this.calculateFill();
            break;
        case historyitem_ChangeLine:
            this.spPr.ln = data.old_Line;
            this.calculateLine();
            break;
        case historyitem_ChangePresetGeom:
            if (data.arrowFlag === true) {
                this.spPr.ln = data.oldLine;
                this.calculateLine();
                this.calculateFill();
            }
            if (typeof data.old_geometryPreset === "string") {
                this.spPr.geometry = CreateGeometry(data.old_geometryPreset);
            } else {
                this.spPr.geometry = data.oldGeometry;
            }
            if (this.spPr.geometry) {
                this.spPr.geometry.Init(100, 100);
            }
            this.calculateAfterResize();
            break;
        case historyitem_AddDocContent:
            this.textBoxContent = null;
            break;
        case historyitem_SetSpPr:
            this.spPr = new CSpPr();
            break;
        case historyitem_SetStyle:
            this.style = data.oldStyle;
            break;
        case historyitem_SetBodyPr:
            this.bodyPr = new CBodyPr();
            this.bodyPr.setDefault();
            break;
        case historyitem_SetTextBoxContent:
            this.textBoxContent = null;
            break;
        case historyitem_SetVerticalShapeAlign:
            this.bodyPr.anchor = data.oldAlign;
            break;
        case historyitem_AutoShapes_SetTextPaddings:
            this.bodyPr.lIns = data.oldL;
            this.bodyPr.tIns = data.oldT;
            this.bodyPr.rIns = data.oldR;
            this.bodyPr.bIns = data.oldB;
            break;
        case historyitem_SetParent:
            if (data.oldParent == null) {
                this.parent = null;
            } else {
                this.parent = g_oTableId.Get_ById(data.oldParent);
            }
            break;
        }
        if (b_history_is_on) {
            History.TurnOn();
        }
    },
    Redo: function (data) {
        var b_history_is_on = History.Is_On();
        if (b_history_is_on) {
            History.TurnOff();
        }
        switch (data.Type) {
        case historyitem_SetBlipFill:
            this.blipFill = data.newPr;
            break;
        case historyitem_SetAbsoluteTransform:
            if (data.newOffsetX != null) {
                this.absOffsetX = data.newOffsetX;
            }
            if (data.newOffsetY != null) {
                this.absOffsetY = data.newOffsetY;
            }
            if (data.newExtX != null) {
                this.absExtX = data.newExtX;
            }
            if (data.newExtY != null) {
                this.absExtY = data.newExtY;
            }
            if (data.newRot != null) {
                this.absRot = data.newRot;
            }
            if (data.newFlipH != null) {
                this.absFlipH = data.newFlipH;
            }
            if (data.newFlipV != null) {
                this.absFlipV = data.newFlipV;
            }
            this.calculateAfterResize();
            break;
        case historyitem_SetXfrmShape:
            var xfrm = this.spPr.xfrm;
            if (typeof data.newOffsetX === "number") {
                xfrm.offX = data.newOffsetX;
            }
            if (typeof data.newOffsetY === "number") {
                xfrm.offY = data.newOffsetY;
            }
            if (typeof data.newExtX === "number") {
                xfrm.extX = data.newExtX;
            }
            if (typeof data.newExtY === "number") {
                xfrm.extY = data.newExtY;
            }
            if (typeof data.newRot === "number") {
                xfrm.rot = data.newRot;
            }
            if (data.newFlipH != null) {
                xfrm.flipH = data.newFlipH;
            }
            if (data.newFlipV != null) {
                xfrm.flipV = data.newFlipV;
            }
            if (typeof data.newExtX === "number" || typeof data.newExtY === "number") {
                if (this.spPr.geometry) {
                    this.spPr.geometry.Recalculate(xfrm.extX, xfrm.extY);
                }
            }
            var posX, posY;
            if (this.group == null) {
                posX = null;
                posY = null;
            } else {
                posX = xfrm.offX;
                posY = xfrm.offY;
            }
            this.setAbsoluteTransform(posX, posY, xfrm.extX, xfrm.extY, xfrm.rot == null ? 0 : xfrm.rot, xfrm.flipH == null ? false : xfrm.flipH, xfrm.flipV == null ? false : xfrm.flipV);
            break;
        case historyitem_SetRotate:
            var newRot = data.newRot == null ? 0 : data.newRot;
            this.spPr.xfrm.rot = newRot;
            this.absRot = newRot;
            if (this.parent) {
                this.parent.absRot = newRot;
            }
            this.calculateTransformMatrix();
            this.calculateLeftTopPoint();
            this.calculateTransformTextMatrix();
            break;
        case historyitem_SetSizes:
            this.spPr.xfrm.extX = data.newW;
            this.spPr.xfrm.extY = data.newH;
            this.spPr.xfrm.flipH = data.newFlipH;
            this.spPr.xfrm.flipV = data.newFlipV;
            this.absExtX = data.newW;
            this.absExtY = data.newH;
            this.absFlipH = data.newFlipH;
            this.absFlipV = data.newFlipV;
            this.absOffsetX = data.newPosX;
            this.absOffsetY = data.newPosY;
            if (this.parent) {
                this.parent.absOffsetX = data.newPosX;
                this.parent.absOffsetY = data.newPosY;
                this.parent.absExtX = data.newW;
                this.parent.absExtY = data.newH;
                this.parent.flipH = data.newFlipH;
                this.parent.flipV = data.newFlipV;
            }
            this.calculateAfterResize();
            break;
        case historyitem_SetSizesInGroup:
            this.absOffsetX = data.newX;
            this.absOffsetY = data.newY;
            this.absExtX = data.newExtX;
            this.absExtY = data.newExtY;
            if (this.parent) {
                this.parent.absOffsetX = data.newX;
                this.parent.absOffsetY = data.newY;
                this.parent.absExtX = data.newExtX;
                this.parent.absExtY = data.newExtY;
            }
            this.calculateAfterResize();
            break;
        case historyitem_SetAdjValue:
            if (this.spPr.geometry) {
                var geometry = this.spPr.geometry;
                if (typeof geometry.gdLst[data.ref1] === "number") {
                    geometry.gdLst[data.ref1] = data.newValue1;
                }
                if (typeof geometry.gdLst[data.ref2] === "number") {
                    geometry.gdLst[data.ref2] = data.newValue2;
                }
                geometry.Recalculate(this.absExtX, this.absExtY);
                this.calculateContent();
                this.calculateTransformTextMatrix();
            }
            break;
        case historyitem_SetGroup:
            this.group = data.newGroup;
            break;
        case historyitem_SetMainGroup:
            this.mainGroup = data.newGroup;
            break;
        case historyitem_ChangeFill:
            this.spPr.Fill = data.new_Fill;
            this.calculateFill();
            break;
        case historyitem_ChangeLine:
            this.spPr.ln = data.new_Line;
            this.calculateLine();
            break;
        case historyitem_ChangePresetGeom:
            if (data.arrowFlag === true) {
                this.spPr.ln = data.newLine;
                this.calculateLine();
            }
            this.spPr.geometry = CreateGeometry(data.new_geometryPreset);
            this.spPr.geometry.Init(100, 100);
            this.calculateAfterResize();
            break;
        case historyitem_AddDocContent:
            this.textBoxContent = g_oTableId.Get_ById(data.contentId);
            break;
        case historyitem_SetSpPr:
            this.spPr = data.spPr;
            break;
        case historyitem_SetStyle:
            this.style = data.style;
            break;
        case historyitem_SetBodyPr:
            this.bodyPr = data.bodyPr;
            break;
        case historyitem_SetTextBoxContent:
            this.textBoxContent = g_oTableId.Get_ById(data.contentId);
            break;
        case historyitem_SetVerticalShapeAlign:
            this.bodyPr.anchor = data.newAlign;
            break;
        case historyitem_AutoShapes_SetTextPaddings:
            this.bodyPr.lIns = data.newL;
            this.bodyPr.tIns = data.newT;
            this.bodyPr.rIns = data.newR;
            this.bodyPr.bIns = data.newB;
            break;
        case historyitem_SetParent:
            if (data.newParent == null) {
                this.parent = null;
            } else {
                this.parent = g_oTableId.Get_ById(data.newParent);
            }
            break;
        }
        if (b_history_is_on) {
            History.TurnOn();
        }
    },
    Save_Changes: function (data, writer) {
        writer.WriteLong(historyitem_type_Shape);
        writer.WriteLong(data.Type);
        var bool;
        switch (data.Type) {
        case historyitem_SetBlipFill:
            w.WriteBool(isRealObject(data.newPr));
            if (isRealObject(data.newPr)) {
                data.newPr.Write_ToBinary2(w);
            }
            break;
        case historyitem_SetAbsoluteTransform:
            bool = data.newOffsetX != null;
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteDouble(data.newOffsetX);
            }
            bool = data.newOffsetY != null;
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteDouble(data.newOffsetY);
            }
            bool = data.newExtX != null;
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteDouble(data.newExtX);
            }
            bool = data.newExtY != null;
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteDouble(data.newExtY);
            }
            bool = data.newRot != null;
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteDouble(data.newRot);
            }
            bool = data.newFlipH != null;
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteBool(data.newFlipH);
            }
            bool = data.newFlipV != null;
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteBool(data.newFlipV);
            }
            break;
        case historyitem_SetXfrmShape:
            bool = typeof data.newOffsetX === "number";
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteDouble(data.newOffsetX);
            }
            bool = typeof data.newOffsetY === "number";
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteDouble(data.newOffsetY);
            }
            bool = typeof data.newExtX === "number";
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteDouble(data.newExtX);
            }
            bool = typeof data.newExtY === "number";
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteDouble(data.newExtY);
            }
            bool = typeof data.newRot === "number";
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteDouble(data.newRot);
            }
            bool = data.newFlipH != null;
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteBool(data.newFlipH);
            }
            bool = data.newFlipV != null;
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteBool(data.newFlipV);
            }
            break;
        case historyitem_SetRotate:
            writer.WriteDouble(data.newRot);
            break;
        case historyitem_SetSizes:
            writer.WriteDouble(data.newPosX);
            writer.WriteDouble(data.newPosY);
            writer.WriteDouble(data.newW);
            writer.WriteDouble(data.newH);
            writer.WriteBool(data.newFlipH);
            writer.WriteBool(data.newFlipV);
            break;
        case historyitem_SetSizesInGroup:
            writer.WriteDouble(data.newX);
            writer.WriteDouble(data.newY);
            writer.WriteDouble(data.newExtX);
            writer.WriteDouble(data.newExtY);
            break;
        case historyitem_SetAdjValue:
            var geometry = this.spPr.geometry;
            bool = typeof geometry.gdLst[data.ref1] === "number";
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteString2(data.ref1);
                writer.WriteLong(data.newValue1);
            }
            bool = typeof geometry.gdLst[data.ref2] === "number";
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteString2(data.ref2);
                writer.WriteLong(data.newValue2);
            }
            break;
        case historyitem_SetGroup:
            case historyitem_SetMainGroup:
            bool = data.newGroup != null;
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteString2(data.newGroup.Get_Id());
            }
            break;
        case historyitem_InitShape:
            writer.WriteString2(data.presetGeom);
            writer.WriteDouble(data.posX);
            writer.WriteDouble(data.posY);
            writer.WriteDouble(data.extX);
            writer.WriteDouble(data.extY);
            writer.WriteBool(data.flipH === true);
            writer.WriteBool(data.flipV === true);
            writer.WriteBool(data.begin === true);
            writer.WriteBool(data.end === true);
            break;
        case historyitem_Init2Shape:
            writer.WriteString2(data.presetGeom);
            writer.WriteDouble(data.posX);
            writer.WriteDouble(data.posY);
            writer.WriteDouble(data.extX);
            writer.WriteDouble(data.extY);
            writer.WriteBool(data.flipH === true);
            writer.WriteBool(data.flipV === true);
            writer.WriteBool(data.begin === true);
            writer.WriteBool(data.end === true);
            break;
        case historyitem_ChangeFill:
            data.new_Fill.Write_ToBinary2(writer);
            break;
        case historyitem_ChangeLine:
            data.new_Line.Write_ToBinary2(writer);
            break;
        case historyitem_ChangePresetGeom:
            writer.WriteBool(data.arrowFlag);
            if (data.arrowFlag === true) {
                data.newLine.Write_ToBinary2(writer);
            }
            writer.WriteString2(data.new_geometryPreset);
            break;
        case historyitem_CreatePolyine:
            writer.WriteDouble(data.xMax);
            writer.WriteDouble(data.xMin);
            writer.WriteDouble(data.yMax);
            writer.WriteDouble(data.yMin);
            writer.WriteBool(data.bClosed);
            writer.WriteLong(data.commands.length);
            for (var i = 0; i < data.commands.length; ++i) {
                writer.WriteLong(data.commands[i].id);
                switch (data.commands[i].id) {
                case 1:
                    case 2:
                    writer.WriteString2(data.commands[i].x);
                    writer.WriteString2(data.commands[i].y);
                    break;
                case 5:
                    writer.WriteString2(data.commands[i].x0);
                    writer.WriteString2(data.commands[i].y0);
                    writer.WriteString2(data.commands[i].x1);
                    writer.WriteString2(data.commands[i].y1);
                    writer.WriteString2(data.commands[i].x2);
                    writer.WriteString2(data.commands[i].y2);
                    break;
                }
            }
            break;
        case historyitem_AddDocContent:
            writer.WriteString2(data.contentId);
            break;
        case historyitem_SetSpPr:
            data.spPr.Write_ToBinary2(writer);
            break;
        case historyitem_SetStyle:
            data.style.Write_ToBinary2(writer);
            break;
        case historyitem_SetBodyPr:
            data.bodyPr.Write_ToBinary2(writer);
            break;
        case historyitem_SetTextBoxContent:
            writer.WriteString2(data.contentId);
            break;
        case historyitem_SetVerticalShapeAlign:
            writer.WriteLong(data.newAlign);
            break;
        case historyitem_AutoShapes_SetTextPaddings:
            var w = writer;
            w.WriteBool(isRealNumber(data.newL));
            if (isRealNumber(data.newL)) {
                w.WriteDouble(data.newL);
            }
            w.WriteBool(isRealNumber(data.newT));
            if (isRealNumber(data.newT)) {
                w.WriteDouble(data.newT);
            }
            w.WriteBool(isRealNumber(data.newR));
            if (isRealNumber(data.newR)) {
                w.WriteDouble(data.newR);
            }
            w.WriteBool(isRealNumber(data.newB));
            if (isRealNumber(data.newB)) {
                w.WriteDouble(data.newB);
            }
            break;
        case historyitem_SetParent:
            writer.WriteBool(data.newParent != null);
            if (data.newParent != null) {
                writer.WriteString2(data.newParent);
            }
            break;
        }
    },
    Load_Changes: function (reader) {
        var ClassType = reader.GetLong();
        if (historyitem_type_Shape != ClassType) {
            return;
        }
        var b_history_is_on = History.Is_On();
        if (b_history_is_on) {
            History.TurnOff();
        }
        var type = reader.GetLong();
        switch (type) {
        case historyitem_SetBlipFill:
            if (r.GetBool()) {
                this.blipFill = new CBlipFill();
                this.blipFill.Read_FromBinary2(r);
            } else {
                this.blipFill = null;
            }
            break;
        case historyitem_CalculateAfterCopyInGroup:
            this.calculateAfterOpenInGroup2();
            break;
        case historyitem_SetAbsoluteTransform:
            if (reader.GetBool()) {
                this.absOffsetX = reader.GetDouble();
            }
            if (reader.GetBool()) {
                this.absOffsetY = reader.GetDouble();
            }
            if (reader.GetBool()) {
                this.absExtX = reader.GetDouble();
            }
            if (reader.GetBool()) {
                this.absExtY = reader.GetDouble();
            }
            if (reader.GetBool()) {
                this.absRot = reader.GetDouble();
            }
            if (reader.GetBool()) {
                this.absFlipH = reader.GetBool();
            }
            if (reader.GetBool()) {
                this.absFlipV = reader.GetBool();
            }
            this.calculateAfterResize();
            break;
        case historyitem_SetXfrmShape:
            var xfrm = this.spPr.xfrm;
            if (reader.GetBool()) {
                xfrm.offX = reader.GetDouble();
            }
            if (reader.GetBool()) {
                xfrm.offY = reader.GetDouble();
            }
            if (reader.GetBool()) {
                xfrm.extX = reader.GetDouble();
            }
            if (reader.GetBool()) {
                xfrm.extY = reader.GetDouble();
            }
            if (reader.GetBool()) {
                xfrm.rot = reader.GetDouble();
            }
            if (reader.GetBool()) {
                xfrm.flipH = reader.GetBool();
            }
            if (reader.GetBool()) {
                xfrm.flipV = reader.GetBool();
            }
            if (this.spPr.geometry) {
                this.spPr.geometry.Recalculate(xfrm.extX, xfrm.extY);
            }
            var posX, posY;
            if (this.group == null) {
                posX = null;
                posY = null;
            } else {
                posX = xfrm.offX;
                posY = xfrm.offY;
            }
            this.setAbsoluteTransform(posX, posY, xfrm.extX, xfrm.extY, xfrm.rot == null ? 0 : xfrm.rot, xfrm.flipH == null ? false : xfrm.flipH, xfrm.flipV == null ? false : xfrm.flipV);
            break;
        case historyitem_SetRotate:
            var rotate = reader.GetDouble();
            this.spPr.xfrm.rot = rotate;
            this.absRot = rotate;
            this.calculateTransformMatrix();
            this.calculateLeftTopPoint();
            this.calculateTransformTextMatrix();
            break;
        case historyitem_SetSizes:
            var posX = reader.GetDouble();
            var posY = reader.GetDouble();
            var extX = reader.GetDouble();
            var extY = reader.GetDouble();
            var flipH = reader.GetBool();
            var flipV = reader.GetBool();
            this.spPr.xfrm.extX = extX;
            this.spPr.xfrm.extY = extY;
            this.spPr.xfrm.flipH = flipH;
            this.spPr.xfrm.flipV = flipV;
            this.absExtX = extX;
            this.absExtY = extY;
            this.absFlipH = flipH;
            this.absFlipV = flipV;
            this.absOffsetX = posX;
            this.absOffsetY = posY;
            if (this.parent) {
                this.parent.absOffsetX = posX;
                this.parent.absOffsetY = posY;
                this.parent.absExtX = extX;
                this.parent.absExtY = extY;
                this.parent.absFlipH = flipH;
                this.parent.absFlipV = flipV;
            }
            this.calculateAfterResize();
            break;
        case historyitem_SetSizesInGroup:
            this.absOffsetX = reader.GetDouble();
            this.absOffsetY = reader.GetDouble();
            this.absExtX = reader.GetDouble();
            this.absExtY = reader.GetDouble();
            if (this.parent) {
                this.parent.absOffsetX = this.absOffsetX;
                this.parent.absOffsetY = this.absOffsetY;
                this.parent.absExtX = this.absExtX;
                this.parent.absExtY = this.absExtY;
            }
            this.calculateAfterResize();
            break;
        case historyitem_SetAdjValue:
            var geometry = this.spPr.geometry;
            if (reader.GetBool()) {
                var name = reader.GetString2();
                geometry.gdLst[name] = reader.GetLong();
            }
            if (reader.GetBool()) {
                name = reader.GetString2();
                geometry.gdLst[name] = reader.GetLong();
            }
            geometry.Recalculate(this.absExtX, this.absExtY);
            this.calculateContent();
            this.calculateTransformTextMatrix();
            break;
        case historyitem_SetGroup:
            if (reader.GetBool()) {
                this.group = g_oTableId.Get_ById(reader.GetString2());
            } else {
                this.group = null;
            }
            break;
        case historyitem_SetMainGroup:
            if (reader.GetBool()) {
                this.mainGroup = g_oTableId.Get_ById(reader.GetString2());
            } else {
                this.mainGroup = null;
            }
            break;
        case historyitem_InitShape:
            var presetGeom = reader.GetString2();
            var posX = reader.GetDouble();
            var posY = reader.GetDouble();
            var extX = reader.GetDouble();
            var extY = reader.GetDouble();
            var flipH = reader.GetBool();
            var flipV = reader.GetBool();
            var begin = reader.GetBool();
            var end = reader.GetBool();
            this.addGeometry(presetGeom);
            this.style = CreateDefaultShapeStyle();
            if (begin || end) {
                this.spPr.ln = new CLn();
            }
            if (begin) {
                this.spPr.ln.headEnd = new EndArrow();
                this.spPr.ln.headEnd.type = LineEndType.Arrow;
                this.spPr.ln.headEnd.w = LineEndSize.Mid;
                this.spPr.ln.headEnd.len = LineEndSize.Mid;
            }
            if (end) {
                this.spPr.ln.tailEnd = new EndArrow();
                this.spPr.ln.tailEnd.type = LineEndType.Arrow;
                this.spPr.ln.tailEnd.w = LineEndSize.Mid;
                this.spPr.ln.tailEnd.len = LineEndSize.Mid;
            }
            this.setAbsoluteTransform(posX, posY, extX, extY, 0, flipH, flipV);
            this.spPr.geometry.Init(extX, extY);
            this.document = editor.WordControl.m_oLogicDocument;
            this.drawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
            this.calculate();
            break;
        case historyitem_Init2Shape:
            var presetGeom = reader.GetString2();
            var posX = reader.GetDouble();
            var posY = reader.GetDouble();
            var extX = reader.GetDouble();
            var extY = reader.GetDouble();
            var flipH = reader.GetBool();
            var flipV = reader.GetBool();
            var begin = reader.GetBool();
            var end = reader.GetBool();
            this.addGeometry("rect");
            var style = new CShapeStyle();
            style.lnRef = new StyleRef();
            style.lnRef.idx = 0;
            style.lnRef.Color.color = new CSchemeColor();
            style.lnRef.Color.color.id = g_clr_accent1;
            style.lnRef.Color.Mods.Mods.push({
                name: "shade",
                val: 50000
            });
            style.fillRef = new StyleRef();
            style.fillRef.idx = 0;
            style.fillRef.Color.color = new CSchemeColor();
            style.fillRef.Color.color.id = g_clr_accent1;
            style.effectRef = new StyleRef();
            style.effectRef.idx = 0;
            style.effectRef.Color.color = new CSchemeColor();
            style.effectRef.Color.color.id = g_clr_accent1;
            style.fontRef = new FontRef();
            style.fontRef.idx = fntStyleInd_minor;
            style.fontRef.Color = new CUniColor();
            style.fontRef.Color.color = new CSchemeColor();
            style.fontRef.Color.color.id = 8;
            this.style = style;
            var pen = new CLn();
            pen.w = 6350;
            pen.Fill = new CUniFill();
            pen.Fill.fill = new CSolidFill();
            pen.Fill.fill.color.color = new CPrstColor();
            pen.Fill.fill.color.color.id = "black";
            var brush = new CUniFill();
            brush.fill = new CSolidFill();
            brush.fill.color.color = new CSchemeColor();
            brush.fill.color.color.id = 12;
            this.spPr.Fill = brush;
            this.spPr.ln = pen;
            this.setAbsoluteTransform(posX, posY, extX, extY, 0, flipH, flipV);
            this.spPr.geometry.Init(extX, extY);
            this.document = editor.WordControl.m_oLogicDocument;
            this.drawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
            this.calculate();
            break;
        case historyitem_ChangeFill:
            this.spPr.Fill = new CUniFill();
            this.spPr.Fill.Read_FromBinary2(reader);
            this.calculateFill();
            var sp = this;
            if (isRealObject(sp) && isRealObject(sp.brush) && isRealObject(sp.brush.fill) && sp.brush.fill.type === FILL_TYPE_BLIP && typeof sp.brush.fill.RasterImageId === "string") {
                CollaborativeEditing.Add_NewImage(sp.brush.fill.RasterImageId);
            }
            break;
        case historyitem_ChangeLine:
            this.spPr.ln = new CLn();
            this.spPr.ln.Read_FromBinary2(reader);
            this.calculateLine();
            break;
        case historyitem_ChangePresetGeom:
            if (reader.GetBool()) {
                this.spPr.ln = new CLn();
                this.spPr.ln.Read_FromBinary2(reader);
                this.calculateLine();
            }
            this.spPr.geometry = CreateGeometry(reader.GetString2());
            this.spPr.geometry.Init(100, 100);
            this.calculateAfterResize();
            break;
        case historyitem_CreatePolyine:
            var xMax = reader.GetDouble();
            var xMin = reader.GetDouble();
            var yMax = reader.GetDouble();
            var yMin = reader.GetDouble();
            this.style = CreateDefaultShapeStyle();
            this.document = editor.WordControl.m_oLogicDocument;
            this.drawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
            var geometry = new CGeometry();
            var bClosed = reader.GetBool();
            geometry.AddPathCommand(0, undefined, bClosed ? "norm" : "none", undefined, xMax - xMin, yMax - yMin);
            geometry.AddRect("l", "t", "r", "b");
            var count = reader.GetLong();
            for (i = 0; i < count; ++i) {
                switch (reader.GetLong()) {
                case 1:
                    var x = reader.GetString2();
                    var y = reader.GetString2();
                    geometry.AddPathCommand(1, x, y);
                    break;
                case 2:
                    x = reader.GetString2();
                    y = reader.GetString2();
                    geometry.AddPathCommand(2, x, y);
                    break;
                case 5:
                    var x0 = reader.GetString2();
                    var y0 = reader.GetString2();
                    var x1 = reader.GetString2();
                    var y1 = reader.GetString2();
                    var x2 = reader.GetString2();
                    var y2 = reader.GetString2();
                    geometry.AddPathCommand(5, x0, y0, x1, y1, x2, y2);
                    break;
                }
            }
            if (bClosed) {
                geometry.AddPathCommand(6);
            }
            geometry.Init(xMax - xMin, yMax - yMin);
            this.spPr.geometry = geometry;
            this.calculate();
            this.calculateTransformMatrix();
            break;
        case historyitem_AddDocContent:
            this.textBoxContent = g_oTableId.Get_ById(reader.GetString2());
            break;
        case historyitem_SetSpPr:
            var sp_pr = new CSpPr();
            sp_pr.Read_FromBinary2(reader);
            this.spPr = sp_pr;
            if (isRealObject(this.spPr.Fill) && isRealObject(this.spPr.Fill.fill) && typeof this.spPr.Fill.fill.RasterImageId === "string") {
                CollaborativeEditing.Add_NewImage(this.spPr.Fill.fill.RasterImageId);
            }
            break;
        case historyitem_SetStyle:
            this.style = new CShapeStyle();
            this.style.Read_FromBinary2(reader);
            this.calculateLine();
            break;
        case historyitem_SetBodyPr:
            this.bodyPr = new CBodyPr();
            this.bodyPr.Read_FromBinary2(reader);
            break;
        case historyitem_SetTextBoxContent:
            this.textBoxContent = g_oTableId.Get_ById(reader.GetString2());
            break;
        case historyitem_SetVerticalShapeAlign:
            this.bodyPr.anchor = reader.GetLong();
            break;
        case historyitem_AutoShapes_SetTextPaddings:
            var r = reader;
            if (r.GetBool()) {
                this.bodyPr.lIns = r.GetDouble();
            } else {
                this.bodyPr.lIns = undefined;
            }
            if (r.GetBool()) {
                this.bodyPr.tIns = r.GetDouble();
            } else {
                this.bodyPr.tIns = undefined;
            }
            if (r.GetBool()) {
                this.bodyPr.rIns = r.GetDouble();
            } else {
                this.bodyPr.rIns = undefined;
            }
            if (r.GetBool()) {
                this.bodyPr.bIns = r.GetDouble();
            } else {
                this.bodyPr.bIns = undefined;
            }
            break;
        case historyitem_SetParent:
            if (reader.GetBool()) {
                this.parent = g_oTableId.Get_ById(reader.GetString2());
            } else {
                this.parent = null;
            }
            break;
        }
        if (b_history_is_on) {
            History.TurnOn();
        }
    },
    getPaddings: function () {
        var paddings = null;
        var shape = this;
        if (shape.textBoxContent) {
            var body_pr = shape.bodyPr;
            paddings = new CPaddings();
            if (typeof body_pr.lIns === "number") {
                paddings.Left = body_pr.lIns;
            } else {
                paddings.Left = 2.54;
            }
            if (typeof body_pr.tIns === "number") {
                paddings.Top = body_pr.tIns;
            } else {
                paddings.Top = 1.27;
            }
            if (typeof body_pr.rIns === "number") {
                paddings.Right = body_pr.rIns;
            } else {
                paddings.Right = 2.54;
            }
            if (typeof body_pr.bIns === "number") {
                paddings.Bottom = body_pr.bIns;
            } else {
                paddings.Bottom = 1.27;
            }
        }
        return paddings;
    },
    documentUpdateRulersState: function () {
        if (!isRealObject(this.textBoxContent) || !isRealObject(this.transform)) {
            return;
        }
        var xc, yc;
        var l, t, r, b;
        var body_pr = this.bodyPr;
        var l_ins, t_ins, r_ins, b_ins;
        if (typeof body_pr.lIns === "number") {
            l_ins = body_pr.lIns;
        } else {
            l_ins = 2.54;
        }
        if (typeof body_pr.tIns === "number") {
            t_ins = body_pr.tIns;
        } else {
            t_ins = 1.27;
        }
        if (typeof body_pr.rIns === "number") {
            r_ins = body_pr.rIns;
        } else {
            r_ins = 2.54;
        }
        if (typeof body_pr.bIns === "number") {
            b_ins = body_pr.bIns;
        } else {
            b_ins = 1.27;
        }
        if (isRealObject(this.spPr.geometry) && isRealObject(this.spPr.geometry.rect)) {
            l = this.spPr.geometry.rect.l + l_ins;
            t = this.spPr.geometry.rect.t + t_ins;
            r = this.spPr.geometry.rect.r - r_ins;
            b = this.spPr.geometry.rect.b - b_ins;
        } else {
            l = l_ins;
            t = t_ins;
            r = this.absExtX - r_ins;
            b = this.absExtY - b_ins;
        }
        var x_lt, y_lt, x_rt, y_rt, x_rb, y_rb, x_lb, y_lb;
        var tr = this.transform;
        x_lt = tr.TransformPointX(l, t);
        y_lt = tr.TransformPointY(l, t);
        x_rb = tr.TransformPointX(r, b);
        y_rb = tr.TransformPointY(r, b);
        xc = (x_lt + x_rb) * 0.5;
        yc = (y_lt + y_rb) * 0.5;
        var hc = (r - l) * 0.5;
        var vc = (b - t) * 0.5;
        this.drawingDocument.Set_RulerState_Paragraph({
            L: xc - hc,
            T: yc - vc,
            R: xc + hc,
            B: yc + vc
        });
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Document_UpdateRulersState(0);
        }
    },
    Is_HdrFtr: function (bool) {
        if (this.group == null) {
            if (isRealObject(this.parent) && isRealObject(this.parent.DocumentContent)) {
                return this.parent.DocumentContent.Is_HdrFtr(bool);
            }
        } else {
            if (isRealObject(this.mainGroup) && isRealObject(this.mainGroup.parent) && isRealObject(this.mainGroup.parent.DocumentContent)) {
                return this.mainGroup.parent.DocumentContent.Is_HdrFtr(bool);
            }
        }
        return bool ? null : false;
    },
    Refresh_RecalcData: function (Data) {
        if (this.group == null && isRealObject(this.parent)) {
            this.parent.Refresh_RecalcData();
        } else {
            if (isRealObject(this.group)) {
                var cur_group = this.group;
                while (isRealObject(cur_group.group)) {
                    cur_group = cur_group.group;
                }
                if (isRealObject(cur_group.parent)) {
                    cur_group.parent.Refresh_RecalcData();
                }
            }
        }
    },
    Refresh_RecalcData2: function () {
        if (this.group == null && isRealObject(this.parent)) {
            History.RecalcData_Add({
                Type: historyrecalctype_Flow,
                Data: this.parent
            });
        } else {
            if (isRealObject(this.group)) {
                var cur_group = this.group;
                while (isRealObject(cur_group.group)) {
                    cur_group = cur_group.group;
                }
                if (isRealObject(cur_group.parent)) {
                    History.RecalcData_Add({
                        Type: historyrecalctype_Flow,
                        Data: cur_group.parent
                    });
                }
            }
        }
    },
    recalculateDocContent: function () {
        if (this.textBoxContent) {
            this.calculateContent();
            if (this.bodyPr.anchor !== VERTICAL_ANCHOR_TYPE_TOP) {
                this.calculateTransformTextMatrix();
            }
            var arr_graphic_objects = this.textBoxContent.Get_AllDrawingObjects();
            for (var i = 0; i < arr_graphic_objects.length; ++i) {
                arr_graphic_objects[i].GraphicObj.recalculate();
                global_MatrixTransformer.MultiplyAppend(arr_graphic_objects[i].getTransformMatrix(), this.transformText);
                if (arr_graphic_objects[i].GraphicObj instanceof CChartAsGroup) {
                    var obj = arr_graphic_objects[i].GraphicObj;
                    obj.invertTransform = global_MatrixTransformer.Invert(obj.transform);
                    if (isRealObject(obj.chartTitle)) {
                        global_MatrixTransformer.MultiplyAppend(obj.chartTitle.transform, this.transformText);
                        global_MatrixTransformer.MultiplyAppend(obj.chartTitle.transformText, this.transformText);
                        obj.chartTitle.invertTransform = global_MatrixTransformer.Invert(obj.chartTitle.transform);
                        obj.chartTitle.invertTransformText = global_MatrixTransformer.Invert(obj.chartTitle.transformText);
                    }
                    if (isRealObject(obj.hAxisTitle)) {
                        global_MatrixTransformer.MultiplyAppend(obj.hAxisTitle.transform, this.transformText);
                        global_MatrixTransformer.MultiplyAppend(obj.hAxisTitle.transformText, this.transformText);
                        obj.hAxisTitle.invertTransform = global_MatrixTransformer.Invert(obj.hAxisTitle.transform);
                        obj.hAxisTitle.invertTransformText = global_MatrixTransformer.Invert(obj.hAxisTitle.transformText);
                    }
                    if (isRealObject(obj.vAxisTitle)) {
                        global_MatrixTransformer.MultiplyAppend(obj.vAxisTitle.transform, this.transformText);
                        global_MatrixTransformer.MultiplyAppend(obj.vAxisTitle.transformText, this.transformText);
                        obj.vAxisTitle.invertTransform = global_MatrixTransformer.Invert(obj.vAxisTitle.transform);
                        obj.vAxisTitle.invertTransformText = global_MatrixTransformer.Invert(obj.vAxisTitle.transformText);
                    }
                }
                arr_graphic_objects[i].updateCursorTypes();
            }
        }
    },
    updateCursorType: function (e, x, y, pageIndex) {
        if (this.textBoxContent) {
            var invert_matrix = this.invertTextMatrix;
            var tx = invert_matrix.TransformPointX(x, y);
            var ty = invert_matrix.TransformPointY(x, y);
            this.textBoxContent.Update_CursorType(tx, ty, pageIndex);
        }
    },
    Write_ToBinary: function (Writer) {},
    Write_ToBinary2: function (writer) {
        writer.WriteLong(historyitem_type_Shape);
        writer.WriteString2(this.Id);
        writer.WriteBool(isRealObject(this.parent));
        if (isRealObject(this.parent)) {
            writer.WriteString2(this.parent.Get_Id());
        }
        var bool = this.mainGroup != null;
        writer.WriteBool(bool);
        if (bool) {
            writer.WriteString2(this.mainGroup.Get_Id());
        }
        bool = this.group != null;
        writer.WriteBool(bool);
        if (bool) {
            writer.WriteString2(this.group.Get_Id());
        }
        this.spPr.Write_ToBinary2(writer);
        bool = this.style != null;
        writer.WriteBool(bool);
        if (bool) {
            this.style.Write_ToBinary2(writer);
        }
        bool = this.textBoxContent != null;
        writer.WriteBool(bool);
        if (bool) {
            this.textBoxContent.Write_ToBinary2(writer);
        }
        this.bodyPr.Write_ToBinary2(writer);
    },
    writeToBinaryForCopyPaste: function (w) {
        w.WriteLong(historyitem_type_Shape);
        w.WriteString2(documentUrl);
        w.WriteString2(editor.User.id);
        this.spPr.Write_ToBinary2(w);
        w.WriteBool(isRealObject(this.style));
        if (isRealObject(this.style)) {
            this.style.Write_ToBinary2(w);
        }
        this.bodyPr.Write_ToBinary2(w);
        w.WriteBool(isRealObject(this.textBoxContent));
        if (isRealObject(this.textBoxContent)) {
            this.textBoxContent.Write_ToBinary2(w);
        }
    },
    readFromBinaryForCopyPaste: function (r, bNoRecalc) {
        var docUrl = r.GetString2();
        var userId = r.GetString2();
        var sp_pr = new CSpPr();
        sp_pr.Read_FromBinary2(r);
        this.setSpPr(sp_pr);
        if (r.GetBool()) {
            var style = new CShapeStyle();
            style.Read_FromBinary2(r);
            this.setStyle(style);
        }
        var body_pr = new CBodyPr();
        body_pr.Read_FromBinary2(r);
        this.setBodyPr(body_pr);
        if (r.GetBool()) {
            var content = new CDocumentContent(this, editor.WordControl.m_oLogicDocument.DrawingDocument, 0, 0, 0, 0, false, false);
            r.GetLong();
            content.Read_FromBinary2(r);
            if (content.Content.length > 0 && docUrl === documentUrl && userId === editor.User.id) {
                this.setTextBoxContent(content.Copy(this));
            }
        }
        History.Add(this, {
            Type: historyitem_CalculateAfterCopyInGroup
        });
    },
    setSpPr: function (spPr) {
        var data = {
            Type: historyitem_SetSpPr,
            spPr: spPr
        };
        History.Add(this, data);
        this.spPr = spPr;
    },
    setStyle: function (style) {
        var data = {
            Type: historyitem_SetStyle,
            style: style,
            oldStyle: this.style
        };
        History.Add(this, data);
        this.style = style;
    },
    setBodyPr: function (b) {
        History.Add(this, {
            Type: historyitem_SetBodyPr,
            bodyPr: b
        });
        this.bodyPr = b;
    },
    setTextBoxContent: function (content) {
        History.Add(this, {
            Type: historyitem_SetTextBoxContent,
            contentId: content.Get_Id()
        });
        this.textBoxContent = content;
    },
    copy: function (parent, group) {
        var _group = isRealObject(group) ? group : null;
        var c = new WordShape(parent, editor.WordControl.m_oLogicDocument, editor.WordControl.m_oLogicDocument.DrawingDocument, _group);
        c.setSpPr(this.spPr.createDuplicate());
        if (this.style) {
            c.setStyle(this.style.createDuplicate());
        }
        c.setBodyPr(this.bodyPr.createDuplicate());
        if (this.textBoxContent) {
            c.setTextBoxContent(this.textBoxContent.Copy(c));
        }
        return c;
    },
    canRotate: function () {
        return true;
    },
    Read_FromBinary2: function (reader, noReadId) {
        if (noReadId === true) {
            reader.GetString2();
        } else {
            this.Id = reader.GetString2();
        }
        var link_data = {};
        if (reader.GetBool()) {
            link_data.parent = reader.GetString2();
        } else {
            link_data.parent = null;
        }
        if (reader.GetBool()) {
            link_data.mainGroup = reader.GetString2();
        } else {
            link_data.mainGroup = null;
        }
        if (reader.GetBool()) {
            link_data.group = reader.GetString2();
        } else {
            link_data.group = null;
        }
        this.spPr.Read_FromBinary2(reader);
        if (reader.GetBool()) {
            this.style = new CShapeStyle();
            this.style.Read_FromBinary2(reader);
        }
        if (reader.GetBool()) {
            this.textBoxContent = new CDocumentContent(this, this.drawingDocument, 0, 0, 0, 0, false, false);
            reader.GetLong();
            this.textBoxContent.Read_FromBinary2(reader);
        }
        this.bodyPr.Read_FromBinary2(reader);
        if (noReadId !== true) {
            CollaborativeEditing.Add_NewObject(this);
            CollaborativeEditing.Add_LinkData(this, link_data);
        }
    },
    Load_LinkData: function (linkData) {
        if (isRealObject(this.parent)) {
            editor.WordControl.m_oLogicDocument.DrawingObjects.addGraphicObject(this.parent);
        }
    }
};
function CheckLinePreset(preset) {
    return preset === "line";
}
function CreateBinaryReader(szSrc, offset, srcLen) {
    var nWritten = 0;
    var index = -1 + offset;
    var dst_len = "";
    for (; index < srcLen;) {
        index++;
        var _c = szSrc.charCodeAt(index);
        if (_c == ";".charCodeAt(0)) {
            index++;
            break;
        }
        dst_len += String.fromCharCode(_c);
    }
    var dstLen = parseInt(dst_len);
    if (isNaN(dstLen)) {
        return null;
    }
    var pointer = g_memory.Alloc(dstLen);
    var stream = new FT_Stream2(pointer.data, dstLen);
    stream.obj = pointer.obj;
    var dstPx = stream.data;
    if (window.chrome) {
        while (index < srcLen) {
            var dwCurr = 0;
            var i;
            var nBits = 0;
            for (i = 0; i < 4; i++) {
                if (index >= srcLen) {
                    break;
                }
                var nCh = DecodeBase64Char(szSrc.charCodeAt(index++));
                if (nCh == -1) {
                    i--;
                    continue;
                }
                dwCurr <<= 6;
                dwCurr |= nCh;
                nBits += 6;
            }
            dwCurr <<= 24 - nBits;
            for (i = 0; i < nBits / 8; i++) {
                dstPx[nWritten++] = ((dwCurr & 16711680) >>> 16);
                dwCurr <<= 8;
            }
        }
    } else {
        var p = b64_decode;
        while (index < srcLen) {
            var dwCurr = 0;
            var i;
            var nBits = 0;
            for (i = 0; i < 4; i++) {
                if (index >= srcLen) {
                    break;
                }
                var nCh = p[szSrc.charCodeAt(index++)];
                if (nCh == undefined) {
                    i--;
                    continue;
                }
                dwCurr <<= 6;
                dwCurr |= nCh;
                nBits += 6;
            }
            dwCurr <<= 24 - nBits;
            for (i = 0; i < nBits / 8; i++) {
                dstPx[nWritten++] = ((dwCurr & 16711680) >>> 16);
                dwCurr <<= 8;
            }
        }
    }
    return stream;
}