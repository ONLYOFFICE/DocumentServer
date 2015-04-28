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
var BOUNDS_DELTA = 3;
function CheckObjectLine(obj) {
    return (obj instanceof CShape && obj.spPr && obj.spPr.geometry && obj.spPr.geometry.preset === "line");
}
function hitToHandles(x, y, object) {
    var invert_transform = object.getInvertTransform();
    var t_x, t_y;
    t_x = invert_transform.TransformPointX(x, y);
    t_y = invert_transform.TransformPointY(x, y);
    var radius = object.convertPixToMM(TRACK_CIRCLE_RADIUS);
    if (typeof global_mouseEvent !== "undefined" && isRealObject(global_mouseEvent) && isRealNumber(global_mouseEvent.KoefPixToMM)) {
        radius *= global_mouseEvent.KoefPixToMM;
    }
    if (undefined !== window.AscHitToHandlesEpsilon) {
        radius = window.AscHitToHandlesEpsilon;
    }
    radius *= radius;
    var _min_dist = 2 * radius;
    var _ret_value = -1;
    var check_line = CheckObjectLine(object);
    var sqr_x = t_x * t_x,
    sqr_y = t_y * t_y;
    var _tmp_dist = sqr_x + sqr_y;
    if (_tmp_dist < _min_dist) {
        _min_dist = _tmp_dist;
        _ret_value = 0;
    }
    var hc = object.extX * 0.5;
    var dist_x = t_x - hc;
    sqr_x = dist_x * dist_x;
    _tmp_dist = sqr_x + sqr_y;
    if (_tmp_dist < _min_dist && !check_line) {
        _min_dist = _tmp_dist;
        _ret_value = 1;
    }
    dist_x = t_x - object.extX;
    sqr_x = dist_x * dist_x;
    _tmp_dist = sqr_x + sqr_y;
    if (_tmp_dist < _min_dist && !check_line) {
        _min_dist = _tmp_dist;
        _ret_value = 2;
    }
    var vc = object.extY * 0.5;
    var dist_y = t_y - vc;
    sqr_y = dist_y * dist_y;
    _tmp_dist = sqr_x + sqr_y;
    if (_tmp_dist < _min_dist && !check_line) {
        _min_dist = _tmp_dist;
        _ret_value = 3;
    }
    dist_y = t_y - object.extY;
    sqr_y = dist_y * dist_y;
    _tmp_dist = sqr_x + sqr_y;
    if (_tmp_dist < _min_dist) {
        _min_dist = _tmp_dist;
        _ret_value = 4;
    }
    dist_x = t_x - hc;
    sqr_x = dist_x * dist_x;
    _tmp_dist = sqr_x + sqr_y;
    if (_tmp_dist < _min_dist && !check_line) {
        _min_dist = _tmp_dist;
        _ret_value = 5;
    }
    dist_x = t_x;
    sqr_x = dist_x * dist_x;
    _tmp_dist = sqr_x + sqr_y;
    if (_tmp_dist < _min_dist && !check_line) {
        _min_dist = _tmp_dist;
        _ret_value = 6;
    }
    dist_y = t_y - vc;
    sqr_y = dist_y * dist_y;
    _tmp_dist = sqr_x + sqr_y;
    if (_tmp_dist < _min_dist && !check_line) {
        _min_dist = _tmp_dist;
        _ret_value = 7;
    }
    if (object.canRotate && object.canRotate() && !check_line) {
        var rotate_distance = object.convertPixToMM(TRACK_DISTANCE_ROTATE);
        dist_y = t_y + rotate_distance;
        sqr_y = dist_y * dist_y;
        dist_x = t_x - hc;
        sqr_x = dist_x * dist_x;
        _tmp_dist = sqr_x + sqr_y;
        if (_tmp_dist < _min_dist) {
            _min_dist = _tmp_dist;
            _ret_value = 8;
        }
    }
    dist_x = t_x - hc;
    dist_y = t_y - vc;
    _tmp_dist = dist_x * dist_x + dist_y * dist_y;
    if (_tmp_dist < _min_dist && !check_line) {
        _min_dist = _tmp_dist;
        _ret_value = -1;
    }
    if (_min_dist < radius) {
        return _ret_value;
    }
    return -1;
}
function getRotateAngle(x, y, object) {
    var transform = object.getTransformMatrix();
    var rotate_distance = object.convertPixToMM(TRACK_DISTANCE_ROTATE);
    var hc = object.extX * 0.5;
    var vc = object.extY * 0.5;
    var xc_t = transform.TransformPointX(hc, vc);
    var yc_t = transform.TransformPointY(hc, vc);
    var rot_x_t = transform.TransformPointX(hc, -rotate_distance);
    var rot_y_t = transform.TransformPointY(hc, -rotate_distance);
    var invert_transform = object.getInvertTransform();
    var rel_x = invert_transform.TransformPointX(x, y);
    var v1_x, v1_y, v2_x, v2_y;
    v1_x = x - xc_t;
    v1_y = y - yc_t;
    v2_x = rot_x_t - xc_t;
    v2_y = rot_y_t - yc_t;
    var flip_h = object.getFullFlipH();
    var flip_v = object.getFullFlipV();
    var same_flip = flip_h && flip_v || !flip_h && !flip_v;
    var angle = rel_x > object.extX * 0.5 ? Math.atan2(Math.abs(v1_x * v2_y - v1_y * v2_x), v1_x * v2_x + v1_y * v2_y) : -Math.atan2(Math.abs(v1_x * v2_y - v1_y * v2_x), v1_x * v2_x + v1_y * v2_y);
    return same_flip ? angle : -angle;
}
function getBoundsInGroup(shape) {
    var r = shape.rot;
    if (!isRealNumber(r) || checkNormalRotate(r)) {
        return {
            minX: shape.x,
            minY: shape.y,
            maxX: shape.x + shape.extX,
            maxY: shape.y + shape.extY
        };
    } else {
        var hc = shape.extX * 0.5;
        var vc = shape.extY * 0.5;
        var xc = shape.x + hc;
        var yc = shape.y + vc;
        return {
            minX: xc - vc,
            minY: yc - hc,
            maxX: xc + vc,
            maxY: yc + hc
        };
    }
}
function CreateUniFillByUniColorCopy(uniColor) {
    var ret = new CUniFill();
    ret.setFill(new CSolidFill());
    ret.fill.setColor(uniColor.createDuplicate());
    return ret;
}
function CopyRunToPPTX(Run, Paragraph, bHyper) {
    var NewRun = new ParaRun(Paragraph, false);
    var RunPr = Run.Pr.Copy();
    if (RunPr.RStyle != undefined) {
        RunPr.RStyle = undefined;
    }
    if (bHyper) {
        if (!RunPr.Unifill) {
            RunPr.Unifill = CreateUniFillSchemeColorWidthTint(11, 0);
        }
        RunPr.Underline = true;
    }
    NewRun.Set_Pr(RunPr);
    var PosToAdd = 0;
    for (var CurPos = 0; CurPos < Run.Content.length; CurPos++) {
        var Item = Run.Content[CurPos];
        if (para_End !== Item.Type && Item.Type !== para_Drawing) {
            NewRun.Add_ToContent(PosToAdd, Item.Copy(), false);
            ++PosToAdd;
        }
    }
    return NewRun;
}
function ConvertParagraphToPPTX(paragraph, drawingDocument, newParent) {
    var _drawing_document = isRealObject(drawingDocument) ? drawingDocument : paragraph.DrawingDocument;
    var _new_parent = isRealObject(newParent) ? newParent : paragraph.Parent;
    var new_paragraph = new Paragraph(_drawing_document, _new_parent, 0, 0, 0, 0, 0, true);
    if (! (paragraph instanceof Paragraph)) {
        return new_paragraph;
    }
    var oCopyPr = paragraph.Pr.Copy();
    oCopyPr.ContextualSpacing = undefined;
    oCopyPr.KeepLines = undefined;
    oCopyPr.KeepNext = undefined;
    oCopyPr.PageBreakBefore = undefined;
    oCopyPr.Shd = undefined;
    oCopyPr.Brd.First = undefined;
    oCopyPr.Brd.Last = undefined;
    oCopyPr.Brd.Between = undefined;
    oCopyPr.Brd.Bottom = undefined;
    oCopyPr.Brd.Left = undefined;
    oCopyPr.Brd.Right = undefined;
    oCopyPr.Brd.Top = undefined;
    oCopyPr.WidowControl = undefined;
    oCopyPr.Tabs = undefined;
    oCopyPr.NumPr = undefined;
    oCopyPr.PStyle = undefined;
    oCopyPr.FramePr = undefined;
    new_paragraph.Set_Pr(oCopyPr);
    new_paragraph.TextPr.Set_Value(paragraph.TextPr.Value);
    new_paragraph.Internal_Content_Remove2(0, new_paragraph.Content.length);
    var Count = paragraph.Content.length;
    for (var Index = 0; Index < Count; Index++) {
        var Item = paragraph.Content[Index];
        if (Item.Type === para_Run) {
            new_paragraph.Internal_Content_Add(new_paragraph.Content.length, CopyRunToPPTX(Item, new_paragraph), false);
        } else {
            if (Item.Type === para_Hyperlink) {
                new_paragraph.Internal_Content_Add(new_paragraph.Content.length, ConvertHyperlinkToPPTX(Item, new_paragraph), false);
            }
        }
    }
    var EndRun = new ParaRun(new_paragraph);
    EndRun.Add_ToContent(0, new ParaEnd());
    new_paragraph.Internal_Content_Add(new_paragraph.Content.length, EndRun, false);
    return new_paragraph;
}
function ConvertHyperlinkToPPTX(hyperlink, paragraph) {
    var hyperlink_ret = new ParaHyperlink(),
    i,
    item,
    pos = 0;
    hyperlink_ret.Set_Value(hyperlink.Value);
    hyperlink_ret.Set_ToolTip(hyperlink.ToolTip);
    for (i = 0; i < hyperlink.Content.length; ++i) {
        item = hyperlink.Content[i];
        if (item.Type === para_Run) {
            hyperlink_ret.Add_ToContent(pos++, CopyRunToPPTX(item, paragraph, true));
        } else {
            if (item.Type === para_Hyperlink) {
                hyperlink_ret.Add_ToContent(pos++, ConvertHyperlinkToPPTX(item, paragraph));
            }
        }
    }
    return hyperlink_ret;
}
function ConvertParagraphToWord(paragraph, docContent) {
    var _docContent = isRealObject(docContent) ? docContent : paragraph.Parent;
    var oldFlag = paragraph.bFromDocument;
    paragraph.bFromDocument = true;
    var new_paragraph = paragraph.Copy(_docContent);
    paragraph.bFromDocument = oldFlag;
    return new_paragraph;
}
function CShape() {
    this.nvSpPr = null;
    this.spPr = null;
    this.style = null;
    this.txBody = null;
    this.bodyPr = null;
    this.textBoxContent = null;
    this.parent = null;
    this.group = null;
    this.drawingBase = null;
    this.bWordShape = null;
    this.bDeleted = true;
    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;
    this.rot = null;
    this.flipH = null;
    this.flipV = null;
    this.transform = new CMatrix();
    this.invertTransform = null;
    this.transformText = new CMatrix();
    this.invertTransformText = null;
    this.brush = null;
    this.pen = null;
    this.selected = false;
    this.snapArrayX = [];
    this.snapArrayY = [];
    this.localTransform = new CMatrix();
    this.localTransformText = new CMatrix();
    this.worksheet = null;
    this.cachedImage = null;
    this.setRecalculateInfo();
    this.Lock = new CLock();
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CShape.prototype = {
    Get_Id: function () {
        return this.Id;
    },
    getObjectType: function () {
        return historyitem_type_Shape;
    },
    Write_ToBinary2: function (w) {
        w.WriteLong(historyitem_type_Shape);
        w.WriteString2(this.Id);
    },
    Read_FromBinary2: function (r) {
        this.Id = r.GetString2();
    },
    convertToWord: function (document) {
        this.setBDeleted(true);
        var c = new CShape();
        c.setWordShape(true);
        c.setBDeleted(false);
        if (this.nvSpPr) {
            c.setNvSpPr(this.nvSpPr.createDuplicate());
        }
        if (this.spPr) {
            c.setSpPr(this.spPr.createDuplicate());
            c.spPr.setParent(c);
        }
        if (this.style) {
            c.setStyle(this.style.createDuplicate());
        }
        if (this.txBody) {
            if (this.txBody.bodyPr) {
                c.setBodyPr(this.txBody.bodyPr.createDuplicate());
            }
            if (this.txBody.content) {
                var new_content = new CDocumentContent(c, document.DrawingDocument, 0, 0, 0, 20000, false, false, false);
                var paragraphs = this.txBody.content.Content;
                new_content.Internal_Content_RemoveAll();
                for (var i = 0; i < paragraphs.length; ++i) {
                    var cur_par = paragraphs[i];
                    var new_paragraph = ConvertParagraphToWord(cur_par, new_content);
                    new_content.Internal_Content_Add(i, new_paragraph, false);
                }
                c.setTextBoxContent(new_content);
            }
        }
        return c;
    },
    convertToPPTX: function (drawingDocument, worksheet) {
        var c = new CShape();
        c.setWordShape(false);
        c.setBDeleted(false);
        c.setWorksheet(worksheet);
        if (this.nvSpPr) {
            c.setNvSpPr(this.nvSpPr.createDuplicate());
        }
        if (this.spPr) {
            c.setSpPr(this.spPr.createDuplicate());
            c.spPr.setParent(c);
        }
        if (this.style) {
            c.setStyle(this.style.createDuplicate());
        }
        if (this.textBoxContent) {
            var tx_body = new CTextBody();
            tx_body.setParent(c);
            if (this.bodyPr) {
                tx_body.setBodyPr(this.bodyPr.createDuplicate());
            }
            var new_content = new CDocumentContent(tx_body, drawingDocument, 0, 0, 0, 0, false, false, true);
            new_content.Internal_Content_RemoveAll();
            var paragraphs = this.textBoxContent.Content;
            var index = 0;
            for (var i = 0; i < paragraphs.length; ++i) {
                var cur_par = paragraphs[i];
                if (cur_par instanceof Paragraph) {
                    var new_paragraph = ConvertParagraphToPPTX(cur_par, drawingDocument, new_content);
                    new_content.Internal_Content_Add(index++, new_paragraph, false);
                }
            }
            tx_body.setContent(new_content);
            c.setTxBody(tx_body);
        }
        return c;
    },
    documentGetAllFontNames: function (AllFonts) {
        var content = this.getDocContent();
        if (content) {
            content.Document_Get_AllFontNames(AllFonts);
        }
    },
    documentCreateFontMap: function (map) {
        var content = this.getDocContent();
        if (content) {
            content.Document_CreateFontMap(map);
        }
    },
    setBDeleted: function (pr) {
        History.Add(this, {
            Type: historyitem_ShapeSetBDeleted,
            oldPr: this.bDeleted,
            newPr: pr
        });
        this.bDeleted = pr;
    },
    setNvSpPr: function (pr) {
        History.Add(this, {
            Type: historyitem_ShapeSetNvSpPr,
            oldPr: this.nvSpPr,
            newPr: pr
        });
        this.nvSpPr = pr;
    },
    setSpPr: function (spPr) {
        History.Add(this, {
            Type: historyitem_ShapeSetSpPr,
            oldPr: this.spPr,
            newPr: spPr
        });
        this.spPr = spPr;
    },
    setStyle: function (style) {
        History.Add(this, {
            Type: historyitem_ShapeSetStyle,
            oldPr: this.style,
            newPr: style
        });
        this.style = style;
        var content = this.getDocContent();
        this.recalcInfo.recalculateShapeStyleForParagraph = true;
        if (this.recalcTextStyles) {
            this.recalcTextStyles();
        }
        if (content) {
            content.Recalc_AllParagraphs_CompiledPr();
        }
    },
    setTxBody: function (txBody) {
        History.Add(this, {
            Type: historyitem_ShapeSetTxBody,
            oldPr: this.txBody,
            newPr: txBody
        });
        this.txBody = txBody;
    },
    setTextBoxContent: function (textBoxContent) {
        History.Add(this, {
            Type: historyitem_ShapeSetTextBoxContent,
            oldPr: this.textBoxContent,
            newPr: textBoxContent
        });
        this.textBoxContent = textBoxContent;
    },
    setBodyPr: function (pr) {
        History.Add(this, {
            Type: historyitem_ShapeSetBodyPr,
            oldPr: this.bodyPr,
            newPr: pr
        });
        this.bodyPr = pr;
        this.recalcInfo.recalcContent = true;
        this.recalcInfo.recalcTransformText = true;
        this.addToRecalculate();
    },
    createTextBody: function () {
        var tx_body = new CTextBody();
        tx_body.setParent(this);
        tx_body.setContent(new CDocumentContent(tx_body, this.getDrawingDocument(), 0, 0, 0, 20000, false, false, true));
        tx_body.setBodyPr(new CBodyPr());
        tx_body.content.Content[0].Set_DocumentIndex(0);
        this.setTxBody(tx_body);
    },
    createTextBoxContent: function () {
        var body_pr = new CBodyPr();
        body_pr.setAnchor(1);
        this.setBodyPr(body_pr);
        this.setTextBoxContent(new CDocumentContent(this, this.getDrawingDocument(), 0, 0, 0, 20000, false, false));
        this.textBoxContent.Set_ParagraphAlign(align_Center);
        this.textBoxContent.Content[0].Set_DocumentIndex(0);
    },
    paragraphAdd: function (paraItem, bRecalculate) {
        var content_to_add = this.getDocContent();
        if (!content_to_add) {
            if (this.bWordShape) {
                this.createTextBoxContent();
            } else {
                this.createTextBody();
            }
            content_to_add = this.getDocContent();
        }
        if (content_to_add) {
            content_to_add.Paragraph_Add(paraItem, bRecalculate);
        }
    },
    applyTextFunction: function (docContentFunction, tableFunction, args) {
        var content_to_add = this.getDocContent();
        if (!content_to_add) {
            if (this.bWordShape) {
                this.createTextBoxContent();
            } else {
                this.createTextBody();
            }
            content_to_add = this.getDocContent();
        }
        if (content_to_add) {
            docContentFunction.apply(content_to_add, args);
        }
    },
    clearContent: function () {
        var content = this.getDocContent();
        if (content) {
            content.Set_ApplyToAll(true);
            content.Remove(-1);
            content.Set_ApplyToAll(false);
        }
    },
    getDocContent: function () {
        if (this.txBody) {
            return this.txBody.content;
        } else {
            if (this.textBoxContent) {
                return this.textBoxContent;
            }
        }
        return null;
    },
    getBodyPr: function () {
        return ExecuteNoHistory(function () {
            if (this.bWordShape) {
                var ret = new CBodyPr();
                ret.setDefault();
                if (this.bodyPr) {
                    ret.merge(this.bodyPr);
                }
                return ret;
            } else {
                if (this.txBody && this.txBody.bodyPr) {
                    return this.txBody.getCompiledBodyPr();
                }
                var ret = new CBodyPr();
                ret.setDefault();
                return ret;
            }
        },
        this, []);
    },
    Search: function (Str, Props, SearchEngine, Type) {
        if (this.textBoxContent) {
            var dd = this.getDrawingDocument();
            dd.StartSearchTransform(this.transformText);
            this.textBoxContent.Search(Str, Props, SearchEngine, Type);
            dd.EndSearchTransform();
        } else {
            if (this.txBody && this.txBody.content) {
                this.txBody.content.Search(Str, Props, SearchEngine, Type);
            }
        }
    },
    Search_GetId: function (bNext, bCurrent) {
        if (this.textBoxContent) {
            return this.textBoxContent.Search_GetId(bNext, bCurrent);
        } else {
            if (this.txBody && this.txBody.content) {
                return this.txBody.content.Search_GetId(bNext, bCurrent);
            }
        }
        return null;
    },
    documentUpdateRulersState: function () {
        var content = this.getDocContent();
        if (!content) {
            return;
        }
        var xc, yc;
        var l, t, r, b;
        var body_pr = this.getBodyPr();
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
        if (this.spPr && isRealObject(this.spPr.geometry) && isRealObject(this.spPr.geometry.rect)) {
            l = this.spPr.geometry.rect.l + l_ins;
            t = this.spPr.geometry.rect.t + t_ins;
            r = this.spPr.geometry.rect.r - r_ins;
            b = this.spPr.geometry.rect.b - b_ins;
        } else {
            l = l_ins;
            t = t_ins;
            r = this.extX - r_ins;
            b = this.extY - b_ins;
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
        this.getDrawingDocument().Set_RulerState_Paragraph({
            L: xc - hc,
            T: yc - vc,
            R: xc + hc,
            B: yc + vc
        });
        content.Document_UpdateRulersState(isRealNumber(this.selectStartPage) ? this.selectStartPage : 0);
    },
    setParent: function (parent) {
        History.Add(this, {
            Type: historyitem_ShapeSetParent,
            oldPr: this.parent,
            newPr: parent
        });
        this.parent = parent;
    },
    setGroup: function (group) {
        History.Add(this, {
            Type: historyitem_ShapeSetGroup,
            oldPr: this.group,
            newPr: group
        });
        this.group = group;
    },
    getAllImages: function (images) {
        if (this.spPr && this.spPr.Fill && this.spPr.Fill.fill instanceof CBlipFill && typeof this.spPr.Fill.fill.RasterImageId === "string") {
            images[_getFullImageSrc(this.spPr.Fill.fill.RasterImageId)] = true;
        }
    },
    getAllFonts: function (fonts) {
        if (this.txBody) {
            this.txBody.content.Document_Get_AllFontNames(fonts);
            delete fonts["+mj-lt"];
            delete fonts["+mn-lt"];
            delete fonts["+mj-ea"];
            delete fonts["+mn-ea"];
            delete fonts["+mj-cs"];
            delete fonts["+mn-cs"];
        }
    },
    canFill: function () {
        if (this.spPr && this.spPr.geometry) {
            return this.spPr.geometry.canFill();
        }
        return true;
    },
    isShape: function () {
        return true;
    },
    isImage: function () {
        return false;
    },
    isChart: function () {
        return false;
    },
    isGroup: function () {
        return false;
    },
    getHierarchy: function () {
        this.compiledHierarchy = [];
        var hierarchy = this.compiledHierarchy;
        if (this.isPlaceholder()) {
            var ph_type = this.getPlaceholderType();
            var ph_index = this.getPlaceholderIndex();
            switch (this.parent.kind) {
            case SLIDE_KIND:
                hierarchy.push(this.parent.Layout.getMatchingShape(ph_type, ph_index));
                hierarchy.push(this.parent.Layout.Master.getMatchingShape(ph_type, ph_index));
                break;
            case LAYOUT_KIND:
                hierarchy.push(this.parent.Master.getMatchingShape(ph_type, ph_index));
                break;
            }
        }
        this.recalcInfo.recalculateShapeHierarchy = true;
        return this.compiledHierarchy;
    },
    getPaddings: function () {
        var paddings = null;
        var shape = this;
        var body_pr;
        if (shape.txBody) {
            body_pr = shape.txBody.bodyPr;
        } else {
            if (shape.textBoxContent) {
                body_pr = shape.bodyPr;
            }
        }
        if (body_pr) {
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
    getCompiledFill: function () {
        if (this.recalcInfo.recalculateFill) {
            this.compiledFill = null;
            if (isRealObject(this.spPr) && isRealObject(this.spPr.Fill) && isRealObject(this.spPr.Fill.fill)) {
                if (this.spPr.Fill.fill instanceof CGradFill && this.spPr.Fill.fill.colors.length === 0) {
                    var parent_objects = this.getParentObjects();
                    var theme = parent_objects.theme;
                    var fmt_scheme = theme.themeElements.fmtScheme;
                    var fill_style_lst = fmt_scheme.fillStyleLst;
                    for (var i = fill_style_lst.length - 1; i > -1; --i) {
                        if (fill_style_lst[i] && fill_style_lst[i].fill instanceof CGradFill) {
                            this.spPr.Fill = fill_style_lst[i].createDuplicate();
                            break;
                        }
                    }
                }
                this.compiledFill = this.spPr.Fill.createDuplicate();
            } else {
                if (isRealObject(this.group)) {
                    var group_compiled_fill = this.group.getCompiledFill();
                    if (isRealObject(group_compiled_fill) && isRealObject(group_compiled_fill.fill)) {
                        this.compiledFill = group_compiled_fill.createDuplicate();
                    } else {
                        var hierarchy = this.getHierarchy();
                        for (var i = 0; i < hierarchy.length; ++i) {
                            if (isRealObject(hierarchy[i]) && isRealObject(hierarchy[i].spPr) && isRealObject(hierarchy[i].spPr.Fill) && isRealObject(hierarchy[i].spPr.Fill.fill)) {
                                this.compiledFill = hierarchy[i].spPr.Fill.createDuplicate();
                                break;
                            }
                        }
                    }
                } else {
                    var hierarchy = this.getHierarchy();
                    for (var i = 0; i < hierarchy.length; ++i) {
                        if (isRealObject(hierarchy[i]) && isRealObject(hierarchy[i].spPr) && isRealObject(hierarchy[i].spPr.Fill) && isRealObject(hierarchy[i].spPr.Fill.fill)) {
                            this.compiledFill = hierarchy[i].spPr.Fill.createDuplicate();
                            break;
                        }
                    }
                }
            }
            this.recalcInfo.recalculateFill = false;
        }
        return this.compiledFill;
    },
    getMargins: function () {
        if (this.txBody) {
            return this.txBody.getMargins();
        } else {
            return null;
        }
    },
    Document_UpdateRulersState: function (margins) {
        if (this.txBody && this.txBody.content) {
            this.txBody.content.Document_UpdateRulersState(this.parent.num, this.getMargins());
        }
    },
    getSelectedTextInfo: function (info) {
        var content = this.getDocContent();
        if (content) {
            content.Get_SelectedElementsInfo(info);
        }
    },
    getCompiledLine: function () {
        if (this.recalcInfo.recalculateLine) {
            this.compiledLine = null;
            if (isRealObject(this.spPr) && isRealObject(this.spPr.ln) && isRealObject(this.spPr.ln)) {
                this.compiledLine = this.spPr.ln.createDuplicate();
            } else {
                if (isRealObject(this.group)) {
                    var group_compiled_line = this.group.getCompiledLine();
                    if (isRealObject(group_compiled_line) && isRealObject(group_compiled_line.fill)) {
                        this.compiledLine = group_compiled_line.createDuplicate();
                    } else {
                        var hierarchy = this.getHierarchy();
                        for (var i = 0; i < hierarchy.length; ++i) {
                            if (isRealObject(hierarchy[i]) && isRealObject(hierarchy[i].spPr) && isRealObject(hierarchy[i].spPr.ln)) {
                                this.compiledLine = hierarchy[i].spPr.ln.createDuplicate();
                                break;
                            }
                        }
                    }
                } else {
                    var hierarchy = this.getHierarchy();
                    for (var i = 0; i < hierarchy.length; ++i) {
                        if (isRealObject(hierarchy[i]) && isRealObject(hierarchy[i].spPr) && isRealObject(hierarchy[i].spPr.ln)) {
                            this.compiledLine = hierarchy[i].spPr.ln.createDuplicate();
                            break;
                        }
                    }
                }
            }
            this.recalcInfo.recalculateLine = false;
        }
        return this.compiledLine;
    },
    getCompiledTransparent: function () {
        if (this.recalcInfo.recalculateTransparent) {
            this.compiledTransparent = null;
            if (isRealObject(this.spPr) && isRealObject(this.spPr.Fill) && isRealNumber(this.spPr.Fill.transparent)) {
                this.compiledTransparent = this.spPr.Fill.transparent;
            } else {
                if (isRealObject(this.group)) {
                    var group_transparent = this.group.getCompiledTransparent();
                    if (isRealNumber(group_transparent)) {
                        this.compiledTransparent = group_transparent;
                    } else {
                        var hierarchy = this.getHierarchy();
                        for (var i = 0; i < hierarchy.length; ++i) {
                            if (isRealObject(hierarchy[i]) && isRealObject(hierarchy[i].spPr) && isRealObject(hierarchy[i].spPr.Fill) && isRealNumber(hierarchy[i].spPr.Fill.transparent)) {
                                this.compiledTransparent = hierarchy[i].spPr.Fill.transparent;
                                break;
                            }
                        }
                    }
                } else {
                    var hierarchy = this.getHierarchy();
                    for (var i = 0; i < hierarchy.length; ++i) {
                        if (isRealObject(hierarchy[i]) && isRealObject(hierarchy[i].spPr) && isRealObject(hierarchy[i].spPr.Fill) && isRealNumber(hierarchy[i].spPr.Fill.transparent)) {
                            this.compiledTransparent = hierarchy[i].spPr.Fill.transparent;
                            break;
                        }
                    }
                }
            }
            this.recalcInfo.recalculateTransparent = false;
        }
        return this.compiledTransparent;
    },
    isPlaceholder: function () {
        return isRealObject(this.nvSpPr) && isRealObject(this.nvSpPr.nvPr) && isRealObject(this.nvSpPr.nvPr.ph);
    },
    getPlaceholderType: function () {
        return this.isPlaceholder() ? this.nvSpPr.nvPr.ph.type : null;
    },
    getPlaceholderIndex: function () {
        return this.isPlaceholder() ? this.nvSpPr.nvPr.ph.idx : null;
    },
    getPhType: function () {
        return this.isPlaceholder() ? this.nvSpPr.nvPr.ph.type : null;
    },
    getPhIndex: function () {
        return this.isPlaceholder() ? this.nvSpPr.nvPr.ph.idx : null;
    },
    setVerticalAlign: function (align) {
        var new_body_pr = this.getBodyPr();
        if (new_body_pr) {
            new_body_pr = new_body_pr.createDuplicate();
            new_body_pr.anchor = align;
            if (this.bWordShape) {
                this.setBodyPr(new_body_pr);
            } else {
                if (this.txBody) {
                    this.txBody.setBodyPr(new_body_pr);
                }
            }
        }
    },
    setPaddings: function (paddings) {
        if (paddings) {
            var new_body_pr = this.getBodyPr();
            if (new_body_pr) {
                new_body_pr = new_body_pr.createDuplicate();
                if (isRealNumber(paddings.Left)) {
                    new_body_pr.lIns = paddings.Left;
                }
                if (isRealNumber(paddings.Top)) {
                    new_body_pr.tIns = paddings.Top;
                }
                if (isRealNumber(paddings.Right)) {
                    new_body_pr.rIns = paddings.Right;
                }
                if (isRealNumber(paddings.Bottom)) {
                    new_body_pr.bIns = paddings.Bottom;
                }
                if (this.bWordShape) {
                    this.setBodyPr(new_body_pr);
                } else {
                    if (this.txBody) {
                        this.txBody.setBodyPr(new_body_pr);
                    }
                }
            }
        }
    },
    recalculateTransformText: function () {
        if (this.txBody == null && this.textBoxContent == null) {
            return;
        }
        var _text_transform = this.localTransformText;
        _text_transform.Reset();
        var _shape_transform = this.localTransform;
        var _body_pr = this.getBodyPr();
        var content = this.getDocContent();
        var _content_height = content.Get_SummaryHeight();
        var _l, _t, _r, _b;
        var _t_x_lt, _t_y_lt, _t_x_rt, _t_y_rt, _t_x_lb, _t_y_lb, _t_x_rb, _t_y_rb;
        if (this.spPr && isRealObject(this.spPr.geometry) && isRealObject(this.spPr.geometry.rect)) {
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
        if (!_body_pr.upright) {
            if (! (_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270)) {
                if (!this.bWordShape || _content_height < _text_rect_height) {
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
                    _vertical_shift = _text_rect_height - _content_height;
                    if (_body_pr.anchor === 0) {
                        _vertical_shift = _text_rect_height - _content_height;
                    } else {
                        _vertical_shift = 0;
                    }
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
                if (!this.bWordShape || _content_height < _text_rect_width) {
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
                    if (_body_pr.anchor === 0) {
                        _vertical_shift = _text_rect_width - _content_height;
                    } else {
                        _vertical_shift = 0;
                    }
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
            if (this.spPr && isRealObject(this.spPr.geometry) && isRealObject(this.spPr.geometry.rect)) {
                var rect = this.spPr.geometry.rect;
                this.clipRect = {
                    x: rect.l + _body_pr.lIns,
                    y: rect.t + _body_pr.tIns,
                    w: rect.r - rect.l - _body_pr.rIns,
                    h: rect.b - rect.t - _body_pr.bIns
                };
            } else {
                this.clipRect = {
                    x: _body_pr.lIns,
                    y: _body_pr.tIns,
                    w: this.extX - _body_pr.rIns,
                    h: this.extY - _body_pr.bIns
                };
            }
        } else {
            var _full_rotate = this.getFullRotate();
            var _full_flip = this.getFullFlip();
            var _hc = this.extX * 0.5;
            var _vc = this.extY * 0.5;
            var _transformed_shape_xc = this.localTransform.TransformPointX(_hc, _vc);
            var _transformed_shape_yc = this.localTransform.TransformPointY(_hc, _vc);
            var _content_width, content_height2;
            if (checkNormalRotate(_full_rotate)) {
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
            if (!this.bWordShape || _content_height < content_height2) {
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
                case 4:
                    _vertical_shift = 0;
                    break;
                }
            } else {
                if (_body_pr.anchor === 0) {
                    _vertical_shift = content_height2 - _content_height;
                } else {
                    _vertical_shift = 0;
                }
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
        this.transformText = this.localTransformText.CreateDublicate();
        this.invertTransformText = global_MatrixTransformer.Invert(this.transformText);
        this.recalculateTransformText2();
        if (this.checkPosTransformText) {
            this.checkPosTransformText();
        }
        if (this.checkContentDrawings) {
            this.checkContentDrawings();
        }
    },
    getFullFlip: function () {
        var _transform = this.localTransform;
        var _full_rotate = this.getFullRotate();
        var _full_pos_x_lt = _transform.TransformPointX(0, 0);
        var _full_pos_y_lt = _transform.TransformPointY(0, 0);
        var _full_pos_x_rt = _transform.TransformPointX(this.extX, 0);
        var _full_pos_y_rt = _transform.TransformPointY(this.extX, 0);
        var _full_pos_x_rb = _transform.TransformPointX(this.extX, this.extY);
        var _full_pos_y_rb = _transform.TransformPointY(this.extX, this.extY);
        var _rotate_matrix = new CMatrix();
        global_MatrixTransformer.RotateRadAppend(_rotate_matrix, _full_rotate);
        var _rotated_pos_x_lt = _rotate_matrix.TransformPointX(_full_pos_x_lt, _full_pos_y_lt);
        var _rotated_pos_x_rt = _rotate_matrix.TransformPointX(_full_pos_x_rt, _full_pos_y_rt);
        var _rotated_pos_y_rt = _rotate_matrix.TransformPointY(_full_pos_x_rt, _full_pos_y_rt);
        var _rotated_pos_y_rb = _rotate_matrix.TransformPointY(_full_pos_x_rb, _full_pos_y_rb);
        return {
            flipH: _rotated_pos_x_lt > _rotated_pos_x_rt,
            flipV: _rotated_pos_y_rt > _rotated_pos_y_rb
        };
    },
    recalculateTransformText2: function () {
        if (this.txBody === null) {
            return;
        }
        if (!this.txBody.content2) {
            return;
        }
        this.transformText2 = new CMatrix();
        var _text_transform = this.transformText2;
        var _shape_transform = this.transform;
        var _body_pr = this.txBody.getBodyPr();
        var _content_height = this.txBody.getSummaryHeight2();
        var _l, _t, _r, _b;
        var _t_x_lt, _t_y_lt, _t_x_rt, _t_y_rt, _t_x_lb, _t_y_lb, _t_x_rb, _t_y_rb;
        if (this.spPr && isRealObject(this.spPr.geometry) && isRealObject(this.spPr.geometry.rect)) {
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
        if (_body_pr.upright === false) {
            if (! (_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270)) {
                if (true) {
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
                if (true) {
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
            if (this.spPr && isRealObject(this.spPr.geometry) && isRealObject(this.spPr.geometry.rect)) {
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
                    w: this.extX,
                    h: this.extY
                };
            }
        } else {
            var _full_rotate = this.getFullRotate();
            var _full_flip = this.getFullFlip();
            var _hc = this.extX * 0.5;
            var _vc = this.extY * 0.5;
            var _transformed_shape_xc = this.transform.TransformPointX(_hc, _vc);
            var _transformed_shape_yc = this.transform.TransformPointY(_hc, _vc);
            var _content_width, content_height2;
            if (checkNormalRotate(_full_rotate)) {
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
            if (true) {
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
                case 4:
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
            var body_pr = this.bodyPr;
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
        this.invertTransformText2 = global_MatrixTransformer.Invert(this.transformText2);
    },
    setWordShape: function (pr) {
        History.Add(this, {
            Type: historyitem_ShapeSetWordShape,
            oldPr: this.bWordShape,
            newPr: pr
        });
        this.bWordShape = pr;
    },
    selectionCheck: function (X, Y, Page_Abs, NearPos) {
        var content = this.getDocContent();
        if (content) {
            if (undefined !== NearPos) {
                return content.Selection_Check(X, Y, Page_Abs, NearPos);
            }
            if (isRealObject(content) && this.hitInTextRect(X, Y) && this.invertTransformText) {
                var t_x = this.invertTransformText.TransformPointX(X, Y);
                var t_y = this.invertTransformText.TransformPointY(X, Y);
                return content.Selection_Check(t_x, t_y, Page_Abs, NearPos);
            }
        }
        return false;
    },
    copy: function () {
        var copy = new CShape();
        if (this.nvSpPr) {
            copy.setNvSpPr(this.nvSpPr.createDuplicate());
        }
        if (this.spPr) {
            copy.setSpPr(this.spPr.createDuplicate());
            copy.spPr.setParent(copy);
        }
        if (this.style) {
            copy.setStyle(this.style.createDuplicate());
        }
        if (this.txBody) {
            copy.setTxBody(this.txBody.createDuplicate());
            copy.txBody.setParent(copy);
        }
        if (this.bodyPr) {
            copy.setBodyPr(this.bodyPr.createDuplicate());
        }
        if (this.textBoxContent) {
            copy.setTextBoxContent(this.textBoxContent.Copy(copy));
        }
        copy.setWordShape(this.bWordShape);
        copy.setBDeleted(this.bDeleted);
        copy.cachedImage = this.getBase64Img();
        return copy;
    },
    Get_Styles: function (level) {
        var _level = isRealNumber(level) ? level : 0;
        if (this.recalcInfo.recalculateTextStyles[_level]) {
            this.recalculateTextStyles(_level);
            this.recalcInfo.recalculateTextStyles[_level] = false;
        }
        this.recalcInfo.recalculateTextStyles[_level] = true;
        var ret = this.compiledStyles[_level];
        this.compiledStyles[_level] = undefined;
        return ret;
    },
    recalculateTextStyles: function (level) {
        return ExecuteNoHistory(function () {
            var parent_objects = this.getParentObjects();
            var default_style = new CStyle("defaultStyle", null, null, null, true);
            default_style.ParaPr.Spacing.LineRule = linerule_Auto;
            default_style.ParaPr.Spacing.Line = 1;
            default_style.ParaPr.Spacing.Before = 0;
            default_style.ParaPr.Spacing.After = 0;
            default_style.ParaPr.Align = align_Center;
            if (isRealObject(parent_objects.presentation) && isRealObject(parent_objects.presentation.defaultTextStyle) && isRealObject(parent_objects.presentation.defaultTextStyle.levels[level])) {
                var default_ppt_style = parent_objects.presentation.defaultTextStyle.levels[level];
                default_style.ParaPr.Merge(default_ppt_style.Copy());
                default_ppt_style.DefaultRunPr && default_style.TextPr.Merge(default_ppt_style.DefaultRunPr.Copy());
            }
            var master_style;
            if (isRealObject(parent_objects.master) && isRealObject(parent_objects.master.txStyles)) {
                var master_ppt_styles;
                master_style = new CStyle("masterStyele", null, null, null, true);
                if (this.isPlaceholder()) {
                    switch (this.getPlaceholderType()) {
                    case phType_ctrTitle:
                        case phType_title:
                        master_ppt_styles = parent_objects.master.txStyles.titleStyle;
                        break;
                    case phType_body:
                        case phType_subTitle:
                        case phType_obj:
                        case null:
                        master_ppt_styles = parent_objects.master.txStyles.bodyStyle;
                        break;
                    default:
                        master_ppt_styles = parent_objects.master.txStyles.otherStyle;
                        break;
                    }
                } else {
                    master_ppt_styles = parent_objects.master.txStyles.otherStyle;
                }
                if (isRealObject(master_ppt_styles) && isRealObject(master_ppt_styles.levels) && isRealObject(master_ppt_styles.levels[level])) {
                    var master_ppt_style = master_ppt_styles.levels[level];
                    master_style.ParaPr = master_ppt_style.Copy();
                    if (master_ppt_style.DefaultRunPr) {
                        master_style.TextPr = master_ppt_style.DefaultRunPr.Copy();
                    }
                }
            }
            var hierarchy = this.getHierarchy();
            var hierarchy_styles = [];
            for (var i = 0; i < hierarchy.length; ++i) {
                var hierarchy_shape = hierarchy[i];
                if (isRealObject(hierarchy_shape) && isRealObject(hierarchy_shape.txBody) && isRealObject(hierarchy_shape.txBody.lstStyle) && isRealObject(hierarchy_shape.txBody.lstStyle.levels) && isRealObject(hierarchy_shape.txBody.lstStyle.levels[level])) {
                    var hierarchy_ppt_style = hierarchy_shape.txBody.lstStyle.levels[level];
                    var hierarchy_style = new CStyle("hierarchyStyle" + i, null, null, null, true);
                    hierarchy_style.ParaPr = hierarchy_ppt_style.Copy();
                    if (hierarchy_ppt_style.DefaultRunPr) {
                        hierarchy_style.TextPr = hierarchy_ppt_style.DefaultRunPr.Copy();
                    }
                    hierarchy_styles.push(hierarchy_style);
                }
            }
            var ownStyle;
            if (isRealObject(this.txBody) && isRealObject(this.txBody.lstStyle) && isRealObject(this.txBody.lstStyle.levels[level])) {
                ownStyle = new CStyle("ownStyle", null, null, null, true);
                var own_ppt_style = this.txBody.lstStyle.levels[level];
                ownStyle.ParaPr = own_ppt_style.Copy();
                if (own_ppt_style.DefaultRunPr) {
                    ownStyle.TextPr = own_ppt_style.DefaultRunPr.Copy();
                }
                hierarchy_styles.splice(0, 0, ownStyle);
            }
            var shape_text_style;
            if (isRealObject(this.style) && isRealObject(this.style.fontRef)) {
                shape_text_style = new CStyle("shapeTextStyle", null, null, null, true);
                var first_name;
                if (this.style.fontRef.idx === fntStyleInd_major) {
                    first_name = "+mj-";
                } else {
                    first_name = "+mn-";
                }
                shape_text_style.TextPr.RFonts.Ascii = {
                    Name: first_name + "lt",
                    Index: -1
                };
                shape_text_style.TextPr.RFonts.EastAsia = {
                    Name: first_name + "ea",
                    Index: -1
                };
                shape_text_style.TextPr.RFonts.CS = {
                    Name: first_name + "cs",
                    Index: -1
                };
                shape_text_style.TextPr.RFonts.HAnsi = {
                    Name: first_name + "lt",
                    Index: -1
                };
                if (this.style.fontRef.Color != null && this.style.fontRef.Color.color != null) {
                    var unifill = new CUniFill();
                    unifill.fill = new CSolidFill();
                    unifill.fill.color = this.style.fontRef.Color;
                    shape_text_style.TextPr.Unifill = unifill;
                }
            }
            var Styles = new CStyles(false);
            var last_style_id;
            var b_checked = false;
            var isPlaceholder = this.isPlaceholder();
            if (isPlaceholder || this.graphicObject instanceof CTable) {
                if (default_style) {
                    b_checked = true;
                    Styles.Add(default_style);
                    default_style.BasedOn = null;
                    last_style_id = default_style.Id;
                }
                if (master_style) {
                    Styles.Add(master_style);
                    master_style.BasedOn = last_style_id;
                    last_style_id = master_style.Id;
                }
            } else {
                if (master_style) {
                    b_checked = true;
                    Styles.Add(master_style);
                    master_style.BasedOn = null;
                    last_style_id = master_style.Id;
                }
                if (default_style) {
                    Styles.Add(default_style);
                    default_style.BasedOn = last_style_id;
                    last_style_id = default_style.Id;
                }
            }
            for (var i = hierarchy_styles.length - 1; i > -1; --i) {
                if (hierarchy_styles[i]) {
                    Styles.Add(hierarchy_styles[i]);
                    hierarchy_styles[i].BasedOn = last_style_id;
                    last_style_id = hierarchy_styles[i].Id;
                }
            }
            if (shape_text_style) {
                Styles.Add(shape_text_style);
                shape_text_style.BasedOn = last_style_id;
                last_style_id = shape_text_style.Id;
            }
            this.compiledStyles[level] = {
                styles: Styles,
                lastId: last_style_id
            };
            return this.compiledStyles[level];
        },
        this, []);
    },
    recalculateBrush: function () {
        var compiled_style = this.getCompiledStyle();
        var RGBA = {
            R: 0,
            G: 0,
            B: 0,
            A: 255
        };
        var parents = this.getParentObjects();
        if (isRealObject(parents.theme) && isRealObject(compiled_style) && isRealObject(compiled_style.fillRef)) {
            this.brush = parents.theme.getFillStyle(compiled_style.fillRef.idx, compiled_style.fillRef.Color);
        } else {
            this.brush = new CUniFill();
        }
        this.brush.merge(this.getCompiledFill());
        this.brush.transparent = this.getCompiledTransparent();
        this.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
    },
    recalculatePen: function () {
        var compiled_style = this.getCompiledStyle();
        var RGBA = {
            R: 0,
            G: 0,
            B: 0,
            A: 255
        };
        var parents = this.getParentObjects();
        if (isRealObject(parents.theme) && isRealObject(compiled_style) && isRealObject(compiled_style.lnRef)) {
            this.pen = parents.theme.getLnStyle(compiled_style.lnRef.idx, compiled_style.lnRef.Color);
        } else {
            this.pen = new CLn();
        }
        this.pen.merge(this.getCompiledLine());
        this.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
    },
    isEmptyPlaceholder: function () {
        if (this.isPlaceholder()) {
            if (this.nvSpPr.nvPr.ph.type == phType_title || this.nvSpPr.nvPr.ph.type == phType_ctrTitle || this.nvSpPr.nvPr.ph.type == phType_body || this.nvSpPr.nvPr.ph.type == phType_subTitle || this.nvSpPr.nvPr.ph.type == null || this.nvSpPr.nvPr.ph.type == phType_dt || this.nvSpPr.nvPr.ph.type == phType_ftr || this.nvSpPr.nvPr.ph.type == phType_hdr || this.nvSpPr.nvPr.ph.type == phType_sldNum || this.nvSpPr.nvPr.ph.type == phType_sldImg) {
                if (this.txBody) {
                    if (this.txBody.content) {
                        return this.txBody.content.Is_Empty();
                    }
                    return true;
                }
                return true;
            }
            if (this.nvSpPr.nvPr.ph.type == phType_chart || this.nvSpPr.nvPr.ph.type == phType_media) {
                return true;
            }
            if (this.nvSpPr.nvPr.ph.type == phType_pic) {
                var _b_empty_text = true;
                if (this.txBody) {
                    if (this.txBody.content) {
                        _b_empty_text = this.txBody.content.Is_Empty();
                    }
                }
                return (_b_empty_text);
            }
        } else {
            return false;
        }
    },
    changeSize: function (kw, kh) {
        if (this.spPr && this.spPr.xfrm && this.spPr.xfrm.isNotNull()) {
            var xfrm = this.spPr.xfrm;
            xfrm.setOffX(xfrm.offX * kw);
            xfrm.setOffY(xfrm.offY * kh);
            xfrm.setExtX(xfrm.extX * kw);
            xfrm.setExtY(xfrm.extY * kh);
        }
        this.recalcTransform && this.recalcTransform();
    },
    recalculateTransform: function () {
        this.cachedImage = null;
        this.recalculateLocalTransform(this.transform);
        this.invertTransform = global_MatrixTransformer.Invert(this.transform);
        if (this.drawingBase && !this.group) {
            this.drawingBase.setGraphicObjectCoords();
        }
        this.localTransform = this.transform.CreateDublicate();
    },
    recalculateLocalTransform: function (transform) {
        if (!isRealObject(this.group)) {
            if (this.spPr && this.spPr.xfrm && this.spPr.xfrm.isNotNull()) {
                var xfrm = this.spPr.xfrm;
                this.x = xfrm.offX;
                this.y = xfrm.offY;
                this.extX = xfrm.extX;
                this.extY = xfrm.extY;
                this.rot = isRealNumber(xfrm.rot) ? xfrm.rot : 0;
                this.flipH = xfrm.flipH === true;
                this.flipV = xfrm.flipV === true;
            } else {
                if (this.isPlaceholder()) {
                    var hierarchy = this.getHierarchy();
                    for (var i = 0; i < hierarchy.length; ++i) {
                        var hierarchy_sp = hierarchy[i];
                        if (isRealObject(hierarchy_sp) && hierarchy_sp.spPr.xfrm && hierarchy_sp.spPr.xfrm.isNotNull()) {
                            var xfrm = hierarchy_sp.spPr.xfrm;
                            this.x = xfrm.offX;
                            this.y = xfrm.offY;
                            this.extX = xfrm.extX;
                            this.extY = xfrm.extY;
                            this.rot = isRealNumber(xfrm.rot) ? xfrm.rot : 0;
                            this.flipH = xfrm.flipH === true;
                            this.flipV = xfrm.flipV === true;
                            break;
                        }
                    }
                    if (i === hierarchy.length) {
                        this.x = 0;
                        this.y = 0;
                        this.extX = 5;
                        this.extY = 5;
                        this.rot = 0;
                        this.flipH = false;
                        this.flipV = false;
                    }
                } else {
                    var extX, extY;
                    if (this.parent && this.parent.Extent) {
                        this.x = 0;
                        this.y = 0;
                        extX = this.parent.Extent.W;
                        extY = this.parent.Extent.H;
                    } else {
                        if (this.drawingBase) {
                            var metrics = this.drawingBase.getGraphicObjectMetrics();
                            this.x = metrics.x;
                            this.y = metrics.y;
                            extX = metrics.extX;
                            extY = metrics.extY;
                        } else {
                            this.x = 0;
                            this.y = 0;
                            extX = 5;
                            extY = 5;
                        }
                    }
                    this.extX = extX;
                    this.extY = extY;
                    this.rot = 0;
                    this.flipH = false;
                    this.flipV = false;
                }
            }
        } else {
            var xfrm;
            if (this.spPr && this.spPr.xfrm && this.spPr.xfrm.isNotNull()) {
                xfrm = this.spPr.xfrm;
            } else {
                if (this.isPlaceholder()) {
                    var hierarchy = this.getHierarchy();
                    for (var i = 0; i < hierarchy.length; ++i) {
                        var hierarchy_sp = hierarchy[i];
                        if (isRealObject(hierarchy_sp) && hierarchy_sp.spPr.xfrm.isNotNull()) {
                            xfrm = hierarchy_sp.spPr.xfrm;
                            break;
                        }
                    }
                    if (i === hierarchy.length) {
                        xfrm = new CXfrm();
                        xfrm.offX = 0;
                        xfrm.offX = 0;
                        xfrm.extX = 5;
                        xfrm.extY = 5;
                    }
                } else {
                    xfrm = new CXfrm();
                    xfrm.offX = 0;
                    xfrm.offY = 0;
                    xfrm.extX = 5;
                    xfrm.extY = 5;
                }
            }
            var scale_scale_coefficients = this.group.getResultScaleCoefficients();
            this.x = scale_scale_coefficients.cx * (xfrm.offX - this.group.spPr.xfrm.chOffX);
            this.y = scale_scale_coefficients.cy * (xfrm.offY - this.group.spPr.xfrm.chOffY);
            this.extX = scale_scale_coefficients.cx * xfrm.extX;
            this.extY = scale_scale_coefficients.cy * xfrm.extY;
            this.rot = isRealNumber(xfrm.rot) ? xfrm.rot : 0;
            this.flipH = xfrm.flipH === true;
            this.flipV = xfrm.flipV === true;
        }
        this.localX = this.x;
        this.localY = this.y;
        transform.Reset();
        var hc = this.extX * 0.5;
        var vc = this.extY * 0.5;
        global_MatrixTransformer.TranslateAppend(transform, -hc, -vc);
        if (this.flipH) {
            global_MatrixTransformer.ScaleAppend(transform, -1, 1);
        }
        if (this.flipV) {
            global_MatrixTransformer.ScaleAppend(transform, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(transform, -this.rot);
        global_MatrixTransformer.TranslateAppend(transform, this.x + hc, this.y + vc);
        if (isRealObject(this.group)) {
            global_MatrixTransformer.MultiplyAppend(transform, this.group.getLocalTransform());
        }
        this.localTransform = transform;
        this.transform = transform;
    },
    checkDrawingBaseCoords: function () {
        if (this.drawingBase && this.spPr && this.spPr.xfrm && !this.group) {
            var oldX = this.x,
            oldY = this.y,
            oldExtX = this.extX,
            oldExtY = this.extY;
            this.x = this.spPr.xfrm.offX;
            this.y = this.spPr.xfrm.offY;
            this.extX = this.spPr.xfrm.extX;
            this.extY = this.spPr.xfrm.extY;
            this.drawingBase.setGraphicObjectCoords();
            this.x = oldX;
            this.y = oldY;
            this.extX = oldExtX;
            this.extY = oldExtY;
            var from = this.drawingBase.from,
            to = this.drawingBase.to;
            History.Add(this, {
                Type: historyitem_AutoShapes_SetDrawingBaseCoors,
                fromCol: from.col,
                fromColOff: from.colOff,
                fromRow: from.row,
                fromRowOff: from.rowOff,
                toCol: to.col,
                toColOff: to.colOff,
                toRow: to.row,
                toRowOff: to.rowOff,
                posX: this.drawingBase.Pos.X,
                posY: this.drawingBase.Pos.Y,
                cx: this.drawingBase.ext.cx,
                cy: this.drawingBase.ext.cy
            });
        }
    },
    setDrawingBaseCoords: function (fromCol, fromColOff, fromRow, fromRowOff, toCol, toColOff, toRow, toRowOff) {
        if (this.drawingBase) {
            this.drawingBase.from.col = fromCol;
            this.drawingBase.from.colOff = fromColOff;
            this.drawingBase.from.row = fromRow;
            this.drawingBase.from.rowOff = fromRowOff;
            this.drawingBase.to.col = toCol;
            this.drawingBase.to.colOff = toColOff;
            this.drawingBase.to.row = toRow;
            this.drawingBase.to.rowOff = toRowOff;
            History.Add(this, {
                Type: historyitem_AutoShapes_SetDrawingBaseCoors,
                fromCol: fromCol,
                fromColOff: fromColOff,
                fromRow: fromRow,
                fromRowOff: fromRowOff,
                toCol: toCol,
                toColOff: toColOff,
                toRow: toRow,
                toRowOff: toRowOff
            });
        }
    },
    getTransformMatrix: function () {
        return this.transform;
    },
    getTransform: function () {
        return {
            x: this.x,
            y: this.y,
            extX: this.extX,
            extY: this.extY,
            rot: this.rot,
            flipH: this.flipH,
            flipV: this.flipV
        };
    },
    getAngle: function (x, y) {
        var px = this.invertTransform.TransformPointX(x, y);
        var py = this.invertTransform.TransformPointY(x, y);
        return Math.PI * 0.5 + Math.atan2(px - this.extX * 0.5, py - this.extY * 0.5);
    },
    recalculateGeometry: function () {
        if (this.spPr && isRealObject(this.spPr.geometry)) {
            var transform = this.getTransform();
            this.spPr.geometry.Recalculate(transform.extX, transform.extY);
        }
    },
    drawAdjustments: function (drawingDocument) {
        if (this.spPr && isRealObject(this.spPr.geometry)) {
            this.spPr.geometry.drawAdjustments(drawingDocument, this.transform);
        }
    },
    getCardDirectionByNum: function (num) {
        var num_north = this.getNumByCardDirection(CARD_DIRECTION_N);
        var full_flip_h = this.getFullFlipH();
        var full_flip_v = this.getFullFlipV();
        var same_flip = !full_flip_h && !full_flip_v || full_flip_h && full_flip_v;
        if (same_flip) {
            return ((num - num_north) + CARD_DIRECTION_N + 8) % 8;
        }
        return (CARD_DIRECTION_N - (num - num_north) + 8) % 8;
    },
    getNumByCardDirection: function (cardDirection) {
        var hc = this.extX * 0.5;
        var vc = this.extY * 0.5;
        var transform = this.getTransformMatrix();
        var y1, y3, y5, y7;
        y1 = transform.TransformPointY(hc, 0);
        y3 = transform.TransformPointY(this.extX, vc);
        y5 = transform.TransformPointY(hc, this.extY);
        y7 = transform.TransformPointY(0, vc);
        var north_number;
        var full_flip_h = this.getFullFlipH();
        var full_flip_v = this.getFullFlipV();
        switch (Math.min(y1, y3, y5, y7)) {
        case y1:
            north_number = !full_flip_v ? 1 : 5;
            break;
        case y3:
            north_number = !full_flip_h ? 3 : 7;
            break;
        case y5:
            north_number = !full_flip_v ? 5 : 1;
            break;
        default:
            north_number = !full_flip_h ? 7 : 3;
            break;
        }
        var same_flip = !full_flip_h && !full_flip_v || full_flip_h && full_flip_v;
        if (same_flip) {
            return (north_number + cardDirection) % 8;
        }
        return (north_number - cardDirection + 8) % 8;
    },
    getResizeCoefficients: function (numHandle, x, y) {
        var cx, cy;
        cx = this.extX > 0 ? this.extX : 0.01;
        cy = this.extY > 0 ? this.extY : 0.01;
        var invert_transform = this.getInvertTransform();
        var t_x = invert_transform.TransformPointX(x, y);
        var t_y = invert_transform.TransformPointY(x, y);
        switch (numHandle) {
        case 0:
            return {
                kd1: (cx - t_x) / cx,
                kd2: (cy - t_y) / cy
            };
        case 1:
            return {
                kd1: (cy - t_y) / cy,
                kd2: 0
            };
        case 2:
            return {
                kd1: (cy - t_y) / cy,
                kd2: t_x / cx
            };
        case 3:
            return {
                kd1: t_x / cx,
                kd2: 0
            };
        case 4:
            return {
                kd1: t_x / cx,
                kd2: t_y / cy
            };
        case 5:
            return {
                kd1: t_y / cy,
                kd2: 0
            };
        case 6:
            return {
                kd1: t_y / cy,
                kd2: (cx - t_x) / cx
            };
        case 7:
            return {
                kd1: (cx - t_x) / cx,
                kd2: 0
            };
        }
        return {
            kd1: 1,
            kd2: 1
        };
    },
    select: function (drawingObjectsController, pageIndex) {
        this.selected = true;
        this.selectStartPage = pageIndex;
        var content = this.getDocContent && this.getDocContent();
        if (content) {
            content.Set_StartPage(pageIndex);
        }
        var selected_objects;
        if (!isRealObject(this.group)) {
            selected_objects = drawingObjectsController.selectedObjects;
        } else {
            selected_objects = this.group.getMainGroup().selectedObjects;
        }
        for (var i = 0; i < selected_objects.length; ++i) {
            if (selected_objects[i] === this) {
                break;
            }
        }
        if (i === selected_objects.length) {
            selected_objects.push(this);
        }
    },
    deselect: function (drawingObjectsController) {
        this.selected = false;
        this.addTextFlag = false;
        var selected_objects;
        if (!isRealObject(this.group)) {
            selected_objects = drawingObjectsController.selectedObjects;
        } else {
            selected_objects = this.group.getMainGroup().selectedObjects;
        }
        for (var i = 0; i < selected_objects.length; ++i) {
            if (selected_objects[i] === this) {
                selected_objects.splice(i, 1);
                break;
            }
        }
        if (this.graphicObject) {
            this.graphicObject.Selection_Remove();
        }
        return this;
    },
    getMainGroup: function () {
        if (!isRealObject(this.group)) {
            return null;
        }
        var cur_group = this.group;
        while (isRealObject(cur_group.group)) {
            cur_group = cur_group.group;
        }
        return cur_group;
    },
    getGroupHierarchy: function () {
        if (this.recalcInfo.recalculateGroupHierarchy) {
            this.groupHierarchy = [];
            if (isRealObject(this.group)) {
                var parent_group_hierarchy = this.group.getGroupHierarchy();
                for (var i = 0; i < parent_group_hierarchy.length; ++i) {
                    this.groupHierarchy.push(parent_group_hierarchy[i]);
                }
                this.groupHierarchy.push(this.group);
            }
            this.recalcInfo.recalculateGroupHierarchy = false;
        }
        return this.groupHierarchy;
    },
    checkHitToBounds: function (x, y) {
        if (this.getObjectType() === historyitem_type_ImageShape && this.parent && this.parent.isShapeChild && this.parent.isShapeChild()) {
            return true;
        }
        var _x, _y;
        if (isRealNumber(this.posX) && isRealNumber(this.posY)) {
            _x = x - this.posX - this.bounds.x;
            _y = y - this.posY - this.bounds.y;
        } else {
            _x = x - this.bounds.x;
            _y = y - this.bounds.y;
        }
        var delta = BOUNDS_DELTA + (this.pen && isRealNumber(this.pen.w) ? this.pen.w / 36000 : 0);
        return _x >= -delta && _x <= this.bounds.w + delta && _y >= -delta && _y <= this.bounds.h + delta;
    },
    hitToAdj: function (x, y) {
        if (this.spPr && isRealObject(this.spPr.geometry)) {
            var px, py;
            px = this.invertTransform.TransformPointX(x, y);
            py = this.invertTransform.TransformPointY(x, y);
            return this.spPr.geometry.hitToAdj(px, py);
        }
        return {
            hit: false,
            num: -1,
            polar: false
        };
    },
    hitInTextRect: function (x, y) {
        var tx_body = this.bWordShape ? this : this.txBody;
        var content = this.getDocContent && this.getDocContent();
        if (isRealObject(tx_body) && content && this.invertTransformText) {
            var t_x, t_y;
            t_x = this.invertTransformText.TransformPointX(x, y);
            t_y = this.invertTransformText.TransformPointY(x, y);
            return t_x > 0 && t_x < tx_body.contentWidth && t_y > 0 && t_y < tx_body.contentHeight;
        }
        return false;
    },
    updateCursorType: function (x, y, e) {
        if (this.invertTransformText) {
            var tx = this.invertTransformText.TransformPointX(x, y);
            var ty = this.invertTransformText.TransformPointY(x, y);
            var page_num = this.parent instanceof Slide ? this.parent.num : 0;
            this.txBody.content.Update_CursorType(tx, ty, page_num);
        }
    },
    sendMouseData: function () {
        if (true === this.Lock.Is_Locked()) {
            var MMData = new CMouseMoveData();
            var Coords = editor.WordControl.m_oLogicDocument.DrawingDocument.ConvertCoordsToCursorWR(this.x, this.y, this.parent.num, null);
            MMData.X_abs = Coords.X - 5;
            MMData.Y_abs = Coords.Y;
            MMData.Type = c_oAscMouseMoveDataTypes.LockedObject;
            MMData.UserId = this.Lock.Get_UserId();
            MMData.HaveChanges = this.Lock.Have_Changes();
            MMData.LockedObjectType = 0;
            editor.sync_MouseMoveCallback(MMData);
        }
    },
    selectionSetStart: function (e, x, y, slideIndex) {
        var content = this.getDocContent();
        if (isRealObject(content)) {
            var tx, ty;
            tx = this.invertTransformText.TransformPointX(x, y);
            ty = this.invertTransformText.TransformPointY(x, y);
            if (e.Button === g_mouse_button_right) {
                if (content.Selection_Check(tx, ty, isRealObject(this.parent) && isRealNumber(this.parent.num) ? this.parent.num : 0)) {
                    this.rightButtonFlag = true;
                    return;
                }
            }
            if (! (content.Is_TextSelectionUse() && e.ShiftKey)) {
                content.Selection_SetStart(tx, ty, slideIndex, e);
            } else {
                content.Selection_SetEnd(tx, ty, slideIndex, e);
            }
        }
    },
    selectionSetEnd: function (e, x, y, slideIndex) {
        var content = this.getDocContent();
        if (isRealObject(content)) {
            var tx, ty;
            tx = this.invertTransformText.TransformPointX(x, y);
            ty = this.invertTransformText.TransformPointY(x, y);
            if (! (e.Type === g_mouse_event_type_up && this.rightButtonFlag)) {
                content.Selection_SetEnd(tx, ty, slideIndex, e);
            }
        }
        delete this.rightButtonFlag;
    },
    Get_Theme: function () {
        return this.getParentObjects().theme;
    },
    updateSelectionState: function () {
        var drawing_document = this.getDrawingDocument();
        if (drawing_document) {
            var content = this.getDocContent();
            if (content) {
                drawing_document.UpdateTargetTransform(this.transformText);
                if (true === content.Is_SelectionUse()) {
                    if (selectionflag_Numbering == content.Selection.Flag) {
                        drawing_document.TargetEnd();
                        drawing_document.SelectEnabled(true);
                        drawing_document.SelectClear();
                        drawing_document.SelectShow();
                    } else {
                        if (null != content.Selection.Data && true === content.Selection.Data.TableBorder && type_Table == content.Content[content.Selection.Data.Pos].GetType()) {
                            drawing_document.TargetEnd();
                        } else {
                            if (false === content.Selection_IsEmpty()) {
                                drawing_document.TargetEnd();
                                drawing_document.SelectEnabled(true);
                                drawing_document.SelectClear();
                                drawing_document.SelectShow();
                            } else {
                                drawing_document.SelectEnabled(false);
                                content.RecalculateCurPos();
                                drawing_document.TargetStart();
                                drawing_document.TargetShow();
                            }
                        }
                    }
                } else {
                    drawing_document.SelectEnabled(false);
                    content.RecalculateCurPos();
                    drawing_document.TargetStart();
                    drawing_document.TargetShow();
                }
            } else {
                drawing_document.UpdateTargetTransform(new CMatrix());
                drawing_document.TargetEnd();
                drawing_document.SelectEnabled(false);
                drawing_document.SelectClear();
                drawing_document.SelectShow();
            }
        }
    },
    normalize: function () {
        var new_off_x, new_off_y, new_ext_x, new_ext_y;
        var xfrm = this.spPr.xfrm;
        if (!isRealObject(this.group)) {
            new_off_x = xfrm.offX;
            new_off_y = xfrm.offY;
            new_ext_x = xfrm.extX;
            new_ext_y = xfrm.extY;
        } else {
            var scale_scale_coefficients = this.group.getResultScaleCoefficients();
            new_off_x = scale_scale_coefficients.cx * (xfrm.offX - this.group.spPr.xfrm.chOffX);
            new_off_y = scale_scale_coefficients.cy * (xfrm.offY - this.group.spPr.xfrm.chOffY);
            new_ext_x = scale_scale_coefficients.cx * xfrm.extX;
            new_ext_y = scale_scale_coefficients.cy * xfrm.extY;
        }
        var xfrm = this.spPr.xfrm;
        Math.abs(new_off_x - xfrm.offX) > MOVE_DELTA && xfrm.setOffX(new_off_x);
        Math.abs(new_off_y - xfrm.offY) > MOVE_DELTA && xfrm.setOffY(new_off_y);
        Math.abs(new_ext_x - xfrm.extX) > MOVE_DELTA && xfrm.setExtX(new_ext_x);
        Math.abs(new_ext_y - xfrm.extY) > MOVE_DELTA && xfrm.setExtY(new_ext_y);
    },
    check_bounds: function (checker) {
        if (this.spPr && this.spPr.geometry) {
            this.spPr.geometry.check_bounds(checker);
        } else {
            checker._s();
            checker._m(0, 0);
            checker._l(this.extX, 0);
            checker._l(this.extX, this.extY);
            checker._l(0, this.extY);
            checker._z();
            checker._e();
        }
    },
    getBase64Img: function () {
        if (typeof this.cachedImage === "string") {
            return this.cachedImage;
        }
        if (!isRealNumber(this.x) || !isRealNumber(this.y) || !isRealNumber(this.extX) || !isRealNumber(this.extY)) {
            return "";
        }
        var img_object = ShapeToImageConverter(this, this.pageIndex);
        if (img_object) {
            return img_object.ImageUrl;
        } else {
            return "";
        }
    },
    isSimpleObject: function () {
        return true;
    },
    draw: function (graphics, transform, transformText, pageIndex) {
        if (graphics.updatedRect && this.bounds) {
            var rect = graphics.updatedRect;
            var bounds = this.bounds;
            if (bounds.x > rect.x + rect.w || bounds.y > rect.y + rect.h || bounds.x + bounds.w < rect.x || bounds.y + bounds.h < rect.y) {
                return;
            }
        }
        var _transform = transform ? transform : this.transform;
        var _transform_text = transformText ? transformText : this.transformText;
        if (graphics.IsSlideBoundsCheckerType === true) {
            graphics.transform3(_transform);
            if (!this.spPr || null == this.spPr.geometry || !graphics.IsShapeNeedBounds(this.spPr.geometry.preset)) {
                graphics._s();
                graphics._m(0, 0);
                graphics._l(this.extX, 0);
                graphics._l(this.extX, this.extY);
                graphics._l(0, this.extY);
                graphics._e();
            } else {
                this.spPr.geometry.check_bounds(graphics);
            }
            if (this.txBody) {
                graphics.SetIntegerGrid(false);
                var transform_text;
                if ((!this.txBody.content || this.txBody.content.Is_Empty()) && this.txBody.content2 != null && !this.addTextFlag && (this.isEmptyPlaceholder ? this.isEmptyPlaceholder() : false) && this.transformText2) {
                    transform_text = this.transformText2;
                } else {
                    if (this.txBody.content) {
                        transform_text = _transform_text;
                    }
                }
                graphics.transform3(transform_text);
                if (graphics.CheckUseFonts2 !== undefined) {
                    graphics.CheckUseFonts2(transform_text);
                }
                this.txBody.draw(graphics);
                if (graphics.UncheckUseFonts2 !== undefined) {
                    graphics.UncheckUseFonts2(transform_text);
                }
                graphics.SetIntegerGrid(true);
            }
            graphics.reset();
            return;
        }
        if (this.spPr && this.spPr.geometry || this.style || (this.brush && this.brush.fill) || (this.pen && this.pen.Fill && this.pen.Fill.fill)) {
            graphics.SetIntegerGrid(false);
            graphics.transform3(_transform, false);
            var shape_drawer = new CShapeDrawer();
            shape_drawer.fromShape2(this, graphics, this.spPr.geometry);
            shape_drawer.draw(this.spPr.geometry);
        }
        if (this.isEmptyPlaceholder() && graphics.IsNoDrawingEmptyPlaceholder !== true) {
            if (graphics.m_oContext !== undefined && graphics.IsTrack === undefined && !this.addTextFlag) {
                if (global_MatrixTransformer.IsIdentity2(_transform)) {
                    graphics.transform3(_transform, false);
                    var tr = graphics.m_oFullTransform;
                    graphics.SetIntegerGrid(true);
                    var _x = tr.TransformPointX(0, 0);
                    var _y = tr.TransformPointY(0, 0);
                    var _r = tr.TransformPointX(this.extX, this.extY);
                    var _b = tr.TransformPointY(this.extX, this.extY);
                    graphics.m_oContext.lineWidth = 1;
                    graphics.p_color(127, 127, 127, 255);
                    graphics._s();
                    editor.WordControl.m_oDrawingDocument.AutoShapesTrack.AddRectDashClever(graphics.m_oContext, _x >> 0, _y >> 0, _r >> 0, _b >> 0, 2, 2, true);
                    graphics._s();
                } else {
                    graphics.transform3(_transform, false);
                    var tr = graphics.m_oFullTransform;
                    graphics.SetIntegerGrid(true);
                    var _r = this.extX;
                    var _b = this.extY;
                    var x1 = tr.TransformPointX(0, 0) >> 0;
                    var y1 = tr.TransformPointY(0, 0) >> 0;
                    var x2 = tr.TransformPointX(_r, 0) >> 0;
                    var y2 = tr.TransformPointY(_r, 0) >> 0;
                    var x3 = tr.TransformPointX(0, _b) >> 0;
                    var y3 = tr.TransformPointY(0, _b) >> 0;
                    var x4 = tr.TransformPointX(_r, _b) >> 0;
                    var y4 = tr.TransformPointY(_r, _b) >> 0;
                    graphics.m_oContext.lineWidth = 1;
                    graphics.p_color(127, 127, 127, 255);
                    graphics._s();
                    editor.WordControl.m_oDrawingDocument.AutoShapesTrack.AddRectDash(graphics.m_oContext, x1, y1, x2, y2, x3, y3, x4, y4, 3, 1, true);
                    graphics._s();
                }
            } else {
                graphics.SetIntegerGrid(false);
                graphics.p_width(70);
                graphics.transform3(_transform, false);
                graphics.p_color(0, 0, 0, 255);
                graphics._s();
                graphics._m(0, 0);
                graphics._l(this.extX, 0);
                graphics._l(this.extX, this.extY);
                graphics._l(0, this.extY);
                graphics._z();
                graphics.ds();
                graphics.SetIntegerGrid(true);
            }
        }
        if (this.txBody) {
            graphics.SaveGrState();
            graphics.SetIntegerGrid(false);
            var transform_text;
            if ((!this.txBody.content || this.txBody.content.Is_Empty()) && this.txBody.content2 != null && !this.addTextFlag && (this.isEmptyPlaceholder ? this.isEmptyPlaceholder() : false) && this.transformText2) {
                transform_text = this.transformText2;
            } else {
                if (this.txBody.content) {
                    transform_text = _transform_text;
                }
            }
            var clip_rect = this.clipRect;
            var bodyPr = this.txBody.bodyPr;
            if (clip_rect) {
                if (!bodyPr || !bodyPr.upright) {
                    graphics.transform3(this.transform);
                    graphics.AddClipRect(clip_rect.x, clip_rect.y, clip_rect.w, clip_rect.h);
                    graphics.transform3(transform_text, true);
                } else {
                    graphics.transform3(transform_text, true);
                    graphics.AddClipRect(clip_rect.x, clip_rect.y, clip_rect.w, clip_rect.h);
                }
            } else {
                graphics.transform3(transform_text, true);
            }
            if (graphics.CheckUseFonts2 !== undefined) {
                graphics.CheckUseFonts2(transform_text);
            }
            graphics.SetIntegerGrid(true);
            this.txBody.draw(graphics);
            if (graphics.UncheckUseFonts2 !== undefined) {
                graphics.UncheckUseFonts2(transform_text);
            }
            graphics.RestoreGrState();
        }
        if (this.textBoxContent && !graphics.IsNoSupportTextDraw && this.transformText) {
            var old_start_page = this.textBoxContent.Get_StartPage_Relative();
            this.textBoxContent.Set_StartPage(pageIndex);
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
            var result_page_index = isRealNumber(graphics.shapePageIndex) ? graphics.shapePageIndex : old_start_page;
            if (graphics.CheckUseFonts2 !== undefined) {
                graphics.CheckUseFonts2(this.transformText);
            }
            if (window.IsShapeToImageConverter) {
                this.textBoxContent.Set_StartPage(0);
                result_page_index = 0;
            }
            this.textBoxContent.Set_StartPage(result_page_index);
            this.textBoxContent.Draw(result_page_index, graphics);
            if (graphics.UncheckUseFonts2 !== undefined) {
                graphics.UncheckUseFonts2();
            }
            this.textBoxContent.Set_StartPage(old_start_page);
            graphics.RestoreGrState();
        }
        if (this.Lock && locktype_None != this.Lock.Get_Type() && !this.group) {
            graphics.transform3(_transform);
            graphics.DrawLockObjectRect(this.Lock.Get_Type(), 0, 0, this.extX, this.extY);
        }
        graphics.SetIntegerGrid(true);
        graphics.reset();
    },
    getRotateAngle: function (x, y) {
        var transform = this.getTransformMatrix();
        var rotate_distance = this.convertPixToMM(TRACK_DISTANCE_ROTATE);
        var hc = this.extX * 0.5;
        var vc = this.extY * 0.5;
        var xc_t = transform.TransformPointX(hc, vc);
        var yc_t = transform.TransformPointY(hc, vc);
        var rot_x_t = transform.TransformPointX(hc, -rotate_distance);
        var rot_y_t = transform.TransformPointY(hc, -rotate_distance);
        var invert_transform = this.getInvertTransform();
        var rel_x = invert_transform.TransformPointX(x, y);
        var v1_x, v1_y, v2_x, v2_y;
        v1_x = x - xc_t;
        v1_y = y - yc_t;
        v2_x = rot_x_t - xc_t;
        v2_y = rot_y_t - yc_t;
        var flip_h = this.getFullFlipH();
        var flip_v = this.getFullFlipV();
        var same_flip = flip_h && flip_v || !flip_h && !flip_v;
        var angle = rel_x > this.extX * 0.5 ? Math.atan2(Math.abs(v1_x * v2_y - v1_y * v2_x), v1_x * v2_x + v1_y * v2_y) : -Math.atan2(Math.abs(v1_x * v2_y - v1_y * v2_x), v1_x * v2_x + v1_y * v2_y);
        return same_flip ? angle : -angle;
    },
    getFullFlipH: function () {
        if (!isRealObject(this.group)) {
            return this.flipH;
        }
        return this.group.getFullFlipH() ? !this.flipH : this.flipH;
    },
    getFullFlipV: function () {
        if (!isRealObject(this.group)) {
            return this.flipV;
        }
        return this.group.getFullFlipV() ? !this.flipV : this.flipV;
    },
    getAspect: function (num) {
        var _tmp_x = this.extX != 0 ? this.extX : 0.1;
        var _tmp_y = this.extY != 0 ? this.extY : 0.1;
        return num === 0 || num === 4 ? _tmp_x / _tmp_y : _tmp_y / _tmp_x;
    },
    getFullRotate: function () {
        return !isRealObject(this.group) ? this.rot : this.rot + this.group.getFullRotate();
    },
    getRectBounds: function () {
        var transform = this.getTransformMatrix();
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
    getInvertTransform: function () {
        return this.invertTransform ? this.invertTransform : new CMatrix();
    },
    calculateSnapArrays: function (snapArrayX, snapArrayY) {
        if (!Array.isArray(snapArrayX) || !Array.isArray(snapArrayX)) {
            snapArrayX = this.snapArrayX;
            snapArrayY = this.snapArrayY;
            snapArrayX.length = 0;
            snapArrayY.length = 0;
        }
        var t = this.transform;
        snapArrayX.push(t.TransformPointX(0, 0));
        snapArrayY.push(t.TransformPointY(0, 0));
        snapArrayX.push(t.TransformPointX(this.extX, 0));
        snapArrayY.push(t.TransformPointY(this.extX, 0));
        snapArrayX.push(t.TransformPointX(this.extX * 0.5, this.extY * 0.5));
        snapArrayY.push(t.TransformPointY(this.extX * 0.5, this.extY * 0.5));
        snapArrayX.push(t.TransformPointX(this.extX, this.extY));
        snapArrayY.push(t.TransformPointY(this.extX, this.extY));
        snapArrayX.push(t.TransformPointX(0, this.extY));
        snapArrayY.push(t.TransformPointY(0, this.extY));
    },
    getFullOffset: function () {
        if (!isRealObject(this.group)) {
            return {
                offX: this.x,
                offY: this.y
            };
        }
        var group_offset = this.group.getFullOffset();
        return {
            offX: this.x + group_offset.offX,
            offY: this.y + group_offset.offY
        };
    },
    getPresetGeom: function () {
        if (this.spPr && this.spPr.geometry) {
            return this.spPr.geometry.preset;
        } else {
            return null;
        }
    },
    getFill: function () {
        if (this.brush && this.brush.fill) {
            return this.brush;
        }
        return CreateNoFillUniFill();
    },
    getStroke: function () {
        if (this.pen && this.pen.Fill) {
            return this.pen;
        }
        var ret = CreateNoFillLine();
        ret.w = 0;
        return ret;
    },
    canChangeArrows: function () {
        if (!this.spPr || this.spPr.geometry == null) {
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
    getParagraphParaPr: function () {
        if (this.txBody && this.txBody.content) {
            var _result;
            this.txBody.content.Set_ApplyToAll(true);
            _result = this.txBody.content.Get_Paragraph_ParaPr();
            this.txBody.content.Set_ApplyToAll(false);
            return _result;
        }
        return null;
    },
    getParagraphTextPr: function () {
        if (this.txBody && this.txBody.content) {
            var _result;
            this.txBody.content.Set_ApplyToAll(true);
            _result = this.txBody.content.Get_Paragraph_TextPr();
            this.txBody.content.Set_ApplyToAll(false);
            return _result;
        }
        return null;
    },
    getAllRasterImages: function (images) {
        if (this.spPr && this.spPr.Fill && this.spPr.Fill.fill && typeof this.spPr.Fill.fill.RasterImageId === "string" && this.spPr.Fill.fill.RasterImageId.length > 0) {
            images.push(this.spPr.Fill.fill.RasterImageId);
        }
        if (this.textBoxContent) {
            var drawings = this.textBoxContent.Get_AllDrawingObjects();
            for (var i = 0; i < drawings.length; ++i) {
                drawings[i].GraphicObj && drawings[i].GraphicObj.getAllRasterImages && drawings[i].GraphicObj.getAllRasterImages(images);
            }
        }
    },
    changePresetGeom: function (sPreset) {
        if (sPreset === "textRect") {
            this.spPr.setGeometry(CreateGeometry("rect"));
            this.spPr.geometry.setParent(this.spPr);
            this.setStyle(CreateDefaultTextRectStyle());
            var fill = new CUniFill();
            fill.setFill(new CSolidFill());
            fill.fill.setColor(new CUniColor());
            fill.fill.color.setColor(new CSchemeColor());
            fill.fill.color.color.setId(12);
            this.spPr.setFill(fill);
            var ln = new CLn();
            ln.setW(6350);
            ln.setFill(new CUniFill());
            ln.Fill.setFill(new CSolidFill());
            ln.Fill.fill.setColor(new CUniColor());
            ln.Fill.fill.color.setColor(new CPrstColor());
            ln.Fill.fill.color.color.setId("black");
            this.spPr.setLn(ln);
            if (this.bWordShape) {
                if (!this.textBoxContent) {
                    this.setTextBoxContent(new CDocumentContent(this, this.getDrawingDocument(), 0, 0, 0, 0, false, false, false));
                    var body_pr = new CBodyPr();
                    body_pr.setDefault();
                    this.setBodyPr(body_pr);
                }
            } else {
                if (!this.txBody) {
                    this.setTxBody(new CTextBody());
                    var content = new CDocumentContent(this.txBody, this.getDrawingDocument(), 0, 0, 0, 0, false, false, true);
                    this.txBody.setParent(this);
                    this.txBody.setContent(content);
                    var body_pr = new CBodyPr();
                    body_pr.setDefault();
                    this.txBody.setBodyPr(body_pr);
                }
            }
            return;
        }
        var _final_preset;
        var _old_line;
        var _new_line;
        if (this.spPr.ln == null) {
            _old_line = null;
        } else {
            _old_line = this.spPr.ln.createDuplicate();
        }
        switch (sPreset) {
        case "lineWithArrow":
            _final_preset = "line";
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
        default:
            _final_preset = sPreset;
            if (_old_line == null) {
                _new_line = new CLn();
            } else {
                _new_line = this.spPr.ln.createDuplicate();
            }
            _new_line.tailEnd = null;
            _new_line.headEnd = null;
            break;
        }
        if (_final_preset != null) {
            this.spPr.setGeometry(CreateGeometry(_final_preset));
            if (this.spPr.geometry) {
                this.spPr.geometry.setParent(this.spPr);
            }
        } else {
            this.spPr.geometry = null;
        }
        if ((!this.brush || !this.brush.fill) && (!this.pen || !this.pen.Fill || !this.pen.Fill.fill)) {
            var new_line2 = new CLn();
            new_line2.Fill = new CUniFill();
            new_line2.Fill.fill = new CSolidFill();
            new_line2.Fill.fill.color = new CUniColor();
            new_line2.Fill.fill.color.color = new CSchemeColor();
            new_line2.Fill.fill.color.color.id = 0;
            if (isRealObject(_new_line)) {
                new_line2.merge(_new_line);
            }
            this.spPr.setLn(new_line2);
        } else {
            this.spPr.setLn(_new_line);
        }
    },
    changeFill: function (unifill) {
        if (this.recalcInfo.recalculateBrush) {
            this.recalculateBrush();
        }
        var unifill2 = CorrectUniFill(unifill, this.brush);
        unifill2.convertToPPTXMods();
        this.spPr.setFill(unifill2);
    },
    setFill: function (fill) {
        this.spPr.setFill(fill);
    },
    changeLine: function (line) {
        if (this.recalcInfo.recalculatePen) {
            this.recalculatePen();
        }
        var stroke = CorrectUniStroke(line, this.pen);
        if (stroke.Fill) {
            stroke.Fill.convertToPPTXMods();
        }
        this.spPr.setLn(stroke);
    },
    hitToAdjustment: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var t_x, t_y;
        t_x = invert_transform.TransformPointX(x, y);
        t_y = invert_transform.TransformPointY(x, y);
        if (this.spPr && isRealObject(this.spPr.geometry)) {
            return this.spPr.geometry.hitToAdj(t_x, t_y, this.convertPixToMM(global_mouseEvent.KoefPixToMM * TRACK_CIRCLE_RADIUS));
        }
        return {
            hit: false,
            adjPolarFlag: null,
            adjNum: null
        };
    },
    hitToHandles: function (x, y) {
        return hitToHandles(x, y, this);
    },
    hit: function (x, y) {
        return this.hitInInnerArea(x, y) || this.hitInPath(x, y) || this.hitInTextRect(x, y);
    },
    hitInPath: function (x, y) {
        if (!this.checkHitToBounds(x, y)) {
            return;
        }
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        if (isRealObject(this.spPr) && isRealObject(this.spPr.geometry)) {
            return this.spPr.geometry.hitInPath(this.getCanvasContext(), x_t, y_t);
        } else {
            return this.hitInBoundingRect(x, y);
        }
        return false;
    },
    hitInInnerArea: function (x, y) {
        if ((this.getObjectType && this.getObjectType() === historyitem_type_ChartSpace) || this.brush != null && this.brush.fill != null && this.brush.fill.type != FILL_TYPE_NOFILL && this.checkHitToBounds(x, y)) {
            var invert_transform = this.getInvertTransform();
            var x_t = invert_transform.TransformPointX(x, y);
            var y_t = invert_transform.TransformPointY(x, y);
            if (isRealObject(this.spPr) && isRealObject(this.spPr.geometry) && !(this.getObjectType && this.getObjectType() === historyitem_type_ChartSpace)) {
                return this.spPr.geometry.hitInInnerArea(this.getCanvasContext(), x_t, y_t);
            }
            return x_t > 0 && x_t < this.extX && y_t > 0 && y_t < this.extY;
        }
        return false;
    },
    hitInBoundingRect: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        var _hit_context = this.getCanvasContext();
        return ! (CheckObjectLine(this)) && (HitInLine(_hit_context, x_t, y_t, 0, 0, this.extX, 0) || HitInLine(_hit_context, x_t, y_t, this.extX, 0, this.extX, this.extY) || HitInLine(_hit_context, x_t, y_t, this.extX, this.extY, 0, this.extY) || HitInLine(_hit_context, x_t, y_t, 0, this.extY, 0, 0) || (this.canRotate && this.canRotate() && HitInLine(_hit_context, x_t, y_t, this.extX * 0.5, 0, this.extX * 0.5, -this.convertPixToMM(TRACK_DISTANCE_ROTATE))));
    },
    canRotate: function () {
        return true;
    },
    canResize: function () {
        return true;
    },
    canMove: function () {
        return true;
    },
    canGroup: function () {
        return !this.isPlaceholder();
    },
    getBoundsInGroup: function () {
        return getBoundsInGroup(this);
    },
    canChangeAdjustments: function () {
        return true;
    },
    createRotateTrack: function () {
        return new RotateTrackShapeImage(this);
    },
    createResizeTrack: function (cardDirection) {
        return new ResizeTrackShapeImage(this, cardDirection);
    },
    createMoveTrack: function () {
        return new MoveShapeImageTrack(this);
    },
    createRotateInGroupTrack: function () {
        return new RotateTrackShapeImageInGroup(this);
    },
    createResizeInGroupTrack: function (cardDirection) {
        return new ResizeTrackShapeImageInGroup(this, cardDirection);
    },
    createMoveInGroupTrack: function () {
        return new MoveShapeImageTrackInGroup(this);
    },
    remove: function (Count, bOnlyText, bRemoveOnlySelection) {
        if (this.txBody) {
            this.txBody.content.Remove(Count, bOnlyText, bRemoveOnlySelection);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
        }
    },
    getTextSelectionState: function () {
        if (this.txBody) {
            return this.txBody.content.Get_SelectionState();
        }
        return [];
    },
    setTextSelectionState: function (s) {
        if (this.txBody) {
            this.txBody.content.Set_SelectionState(s, s.length - 1);
        }
    },
    Restart_CheckSpelling: function () {
        this.recalcInfo.recalculateShapeStyleForParagraph = true;
        var content = this.getDocContent();
        content && content.Restart_CheckSpelling();
    },
    Refresh_RecalcData: function (data) {
        this.Refresh_RecalcData2();
    },
    Refresh_RecalcData2: function (pageIndex) {
        this.recalcContent();
        this.recalcContent2 && this.recalcContent2();
        this.recalcTransformText();
        this.addToRecalculate();
    },
    Undo: function (data) {
        switch (data.Type) {
        case historyitem_AutoShapes_SetDrawingBaseCoors:
            break;
        case historyitem_AutoShapes_RemoveFromDrawingObjects:
            addToDrawings(this.worksheet, this, data.Pos);
            break;
        case historyitem_AutoShapes_AddToDrawingObjects:
            deleteDrawingBase(this.worksheet.Drawings, this.Get_Id());
            break;
        case historyitem_AutoShapes_SetWorksheet:
            this.worksheet = data.oldPr;
            break;
        case historyitem_ShapeSetBDeleted:
            this.bDeleted = data.oldPr;
            break;
        case historyitem_ShapeSetNvSpPr:
            this.nvSpPr = data.oldPr;
            break;
        case historyitem_ShapeSetSpPr:
            this.spPr = data.oldPr;
            break;
        case historyitem_ShapeSetStyle:
            this.style = data.oldPr;
            this.recalcInfo.recalculateShapeStyleForParagraph = true;
            if (this.recalcTextStyles) {
                this.recalcTextStyles();
            }
            var content = this.getDocContent();
            if (content) {
                content.Recalc_AllParagraphs_CompiledPr();
            }
            break;
        case historyitem_ShapeSetTxBody:
            this.txBody = data.oldPr;
            break;
        case historyitem_ShapeSetTextBoxContent:
            this.textBoxContent = data.oldPr;
            break;
        case historyitem_ShapeSetParent:
            this.parent = data.oldPr;
            break;
        case historyitem_ShapeSetGroup:
            this.group = data.oldPr;
            break;
        case historyitem_ShapeSetBodyPr:
            this.bodyPr = data.oldPr;
            break;
        case historyitem_ShapeSetWordShape:
            this.bWordShape = data.oldPr;
            break;
        }
    },
    Redo: function (data) {
        switch (data.Type) {
        case historyitem_AutoShapes_RemoveFromDrawingObjects:
            deleteDrawingBase(this.worksheet.Drawings, this.Get_Id());
            break;
        case historyitem_AutoShapes_AddToDrawingObjects:
            addToDrawings(this.worksheet, this, data.Pos);
            break;
        case historyitem_AutoShapes_SetWorksheet:
            this.worksheet = data.newPr;
            break;
        case historyitem_ShapeSetBDeleted:
            this.bDeleted = data.newPr;
            break;
        case historyitem_ShapeSetNvSpPr:
            this.nvSpPr = data.newPr;
            break;
        case historyitem_ShapeSetSpPr:
            this.spPr = data.newPr;
            break;
        case historyitem_ShapeSetStyle:
            this.style = data.newPr;
            var content = this.getDocContent();
            this.recalcInfo.recalculateShapeStyleForParagraph = true;
            if (this.recalcTextStyles) {
                this.recalcTextStyles();
            }
            if (content) {
                content.Recalc_AllParagraphs_CompiledPr();
            }
            break;
        case historyitem_ShapeSetTxBody:
            this.txBody = data.newPr;
            break;
        case historyitem_ShapeSetTextBoxContent:
            this.textBoxContent = data.newPr;
            break;
        case historyitem_ShapeSetParent:
            this.parent = data.newPr;
            break;
        case historyitem_ShapeSetGroup:
            this.group = data.newPr;
            break;
        case historyitem_ShapeSetBodyPr:
            this.bodyPr = data.newPr;
            break;
        case historyitem_ShapeSetWordShape:
            this.bWordShape = data.newPr;
            break;
        }
    },
    Save_Changes: function (data, w) {
        w.WriteLong(this.getObjectType());
        w.WriteLong(data.Type);
        switch (data.Type) {
        case historyitem_AutoShapes_SetDrawingBaseCoors:
            writeDouble(w, data.fromCol);
            writeDouble(w, data.fromColOff);
            writeDouble(w, data.fromRow);
            writeDouble(w, data.fromRowOff);
            writeDouble(w, data.toCol);
            writeDouble(w, data.toColOff);
            writeDouble(w, data.toRow);
            writeDouble(w, data.toRowOff);
            writeDouble(w, data.posX);
            writeDouble(w, data.posY);
            writeDouble(w, data.cx);
            writeDouble(w, data.cy);
            break;
        case historyitem_AutoShapes_RemoveFromDrawingObjects:
            break;
        case historyitem_AutoShapes_AddToDrawingObjects:
            var Pos = data.UseArray ? data.PosArray[0] : data.Pos;
            writeLong(w, Pos);
            break;
        case historyitem_AutoShapes_SetWorksheet:
            writeBool(w, isRealObject(data.newPr));
            if (isRealObject(data.newPr)) {
                writeString(w, data.newPr.getId());
            }
            break;
        case historyitem_ShapeSetNvSpPr:
            case historyitem_ShapeSetSpPr:
            case historyitem_ShapeSetStyle:
            case historyitem_ShapeSetTxBody:
            case historyitem_ShapeSetTextBoxContent:
            case historyitem_ShapeSetParent:
            case historyitem_ShapeSetGroup:
            writeObject(w, data.newPr);
            break;
        case historyitem_ShapeSetBodyPr:
            w.WriteBool(isRealObject(data.newPr));
            if (isRealObject(data.newPr)) {
                data.newPr.Write_ToBinary(w);
            }
            break;
        case historyitem_ShapeSetWordShape:
            case historyitem_ShapeSetBDeleted:
            writeBool(w, data.newPr);
            break;
        }
    },
    Load_Changes: function (r) {
        if (r.GetLong() === this.getObjectType()) {
            var type = r.GetLong();
            switch (type) {
            case historyitem_AutoShapes_SetDrawingBaseCoors:
                if (this.drawingBase) {
                    this.drawingBase.from.col = readDouble(r);
                    this.drawingBase.from.colOff = readDouble(r);
                    this.drawingBase.from.row = readDouble(r);
                    this.drawingBase.from.rowOff = readDouble(r);
                    this.drawingBase.to.col = readDouble(r);
                    this.drawingBase.to.colOff = readDouble(r);
                    this.drawingBase.to.row = readDouble(r);
                    this.drawingBase.to.rowOff = readDouble(r);
                    this.drawingBase.Pos.X = readDouble(r);
                    this.drawingBase.Pos.Y = readDouble(r);
                    this.drawingBase.ext.cx = readDouble(r);
                    this.drawingBase.ext.cy = readDouble(r);
                }
                break;
            case historyitem_AutoShapes_RemoveFromDrawingObjects:
                deleteDrawingBase(this.worksheet.Drawings, this.Get_Id());
                break;
            case historyitem_AutoShapes_AddToDrawingObjects:
                var pos = readLong(r);
                if (this.worksheet) {
                    pos = this.worksheet.contentChanges.Check(contentchanges_Add, pos);
                }
                addToDrawings(this.worksheet, this, pos);
                break;
            case historyitem_AutoShapes_SetWorksheet:
                ReadWBModel(this, r);
                break;
            case historyitem_ShapeSetBDeleted:
                this.bDeleted = readBool(r);
                break;
            case historyitem_ShapeSetNvSpPr:
                this.nvSpPr = readObject(r);
                break;
            case historyitem_ShapeSetSpPr:
                this.spPr = readObject(r);
                break;
            case historyitem_ShapeSetStyle:
                this.style = readObject(r);
                var content = this.getDocContent();
                this.recalcInfo.recalculateShapeStyleForParagraph = true;
                if (this.recalcTextStyles) {
                    this.recalcTextStyles();
                }
                if (content) {
                    content.Recalc_AllParagraphs_CompiledPr();
                }
                break;
            case historyitem_ShapeSetTxBody:
                this.txBody = readObject(r);
                break;
            case historyitem_ShapeSetTextBoxContent:
                this.textBoxContent = readObject(r);
                break;
            case historyitem_ShapeSetParent:
                this.parent = readObject(r);
                break;
            case historyitem_ShapeSetGroup:
                this.group = readObject(r);
                break;
            case historyitem_ShapeSetBodyPr:
                if (r.GetBool()) {
                    this.bodyPr = new CBodyPr();
                    this.bodyPr.Read_FromBinary(r);
                } else {
                    this.bodyPr = null;
                }
                break;
            case historyitem_ShapeSetWordShape:
                this.bWordShape = readBool(r);
                break;
            }
        }
    },
    Load_LinkData: function (linkData) {},
    Get_PageContentStartPos: function (pageNum) {
        if (this.textBoxContent) {
            if (this.spPr && this.spPr.geometry && this.spPr.geometry.rect) {
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
                    XLimit: this.extX,
                    YLimit: 20000
                };
            }
        }
        return null;
    },
    OnContentRecalculate: function () {},
    recalculateBounds: function () {
        var boundsChecker = new CSlideBoundsChecker();
        this.draw(boundsChecker, this.localTransform, this.localTransformText);
        if (!this.group) {
            var tr = this.localTransform;
            var arr_p_x = [];
            var arr_p_y = [];
            arr_p_x.push(tr.TransformPointX(0, 0));
            arr_p_y.push(tr.TransformPointY(0, 0));
            arr_p_x.push(tr.TransformPointX(this.extX, 0));
            arr_p_y.push(tr.TransformPointY(this.extX, 0));
            arr_p_x.push(tr.TransformPointX(this.extX, this.extY));
            arr_p_y.push(tr.TransformPointY(this.extX, this.extY));
            arr_p_x.push(tr.TransformPointX(0, this.extY));
            arr_p_y.push(tr.TransformPointY(0, this.extY));
            arr_p_x.push(boundsChecker.Bounds.min_x);
            arr_p_x.push(boundsChecker.Bounds.max_x);
            arr_p_y.push(boundsChecker.Bounds.min_y);
            arr_p_y.push(boundsChecker.Bounds.max_y);
            var min_b_x = Math.min.apply(Math, arr_p_x);
            var max_b_x = Math.max.apply(Math, arr_p_x);
            var min_b_y = Math.min.apply(Math, arr_p_y);
            var max_b_y = Math.max.apply(Math, arr_p_y);
            this.bounds.l = min_b_x;
            this.bounds.t = min_b_y;
            this.bounds.r = max_b_x;
            this.bounds.b = max_b_y;
        } else {
            this.bounds.l = boundsChecker.Bounds.min_x;
            this.bounds.t = boundsChecker.Bounds.min_y;
            this.bounds.r = boundsChecker.Bounds.max_x;
            this.bounds.b = boundsChecker.Bounds.max_y;
        }
        this.bounds.x = this.bounds.l;
        this.bounds.y = this.bounds.t;
        this.bounds.w = this.bounds.r - this.bounds.l;
        this.bounds.h = this.bounds.b - this.bounds.t;
    }
};
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