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
function CAscColorScheme() {
    this.Colors = [];
    this.Name = "";
}
CAscColorScheme.prototype.get_colors = function () {
    return this.Colors;
};
CAscColorScheme.prototype.get_name = function () {
    return this.Name;
};
function CAscTexture() {
    this.Id = 0;
    this.Image = "";
}
CAscTexture.prototype.get_id = function () {
    return this.Id;
};
CAscTexture.prototype.get_image = function () {
    return this.Image;
};
function CAscColor() {
    this.type = c_oAscColor.COLOR_TYPE_SRGB;
    this.value = null;
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 255;
    this.Auto = false;
    this.Mods = [];
    this.ColorSchemeId = -1;
    if (1 === arguments.length) {
        this.r = arguments[0].r;
        this.g = arguments[0].g;
        this.b = arguments[0].b;
    } else {
        if (3 <= arguments.length) {
            this.r = arguments[0];
            this.g = arguments[1];
            this.b = arguments[2];
        }
        if (4 === arguments.length) {
            this.a = arguments[3];
        }
    }
}
CAscColor.prototype.get_r = function () {
    return this.r;
};
CAscColor.prototype.put_r = function (v) {
    this.r = v;
    this.hex = undefined;
};
CAscColor.prototype.get_g = function () {
    return this.g;
};
CAscColor.prototype.put_g = function (v) {
    this.g = v;
    this.hex = undefined;
};
CAscColor.prototype.get_b = function () {
    return this.b;
};
CAscColor.prototype.put_b = function (v) {
    this.b = v;
    this.hex = undefined;
};
CAscColor.prototype.get_a = function () {
    return this.a;
};
CAscColor.prototype.put_a = function (v) {
    this.a = v;
    this.hex = undefined;
};
CAscColor.prototype.get_type = function () {
    return this.type;
};
CAscColor.prototype.put_type = function (v) {
    this.type = v;
};
CAscColor.prototype.get_value = function () {
    return this.value;
};
CAscColor.prototype.put_value = function (v) {
    this.value = v;
};
CAscColor.prototype.put_auto = function (v) {
    this.Auto = v;
};
CAscColor.prototype.get_auto = function () {
    return this.Auto;
};
CAscColor.prototype.get_hex = function () {
    if (!this.hex) {
        var a = this.a.toString(16);
        var r = this.r.toString(16);
        var g = this.g.toString(16);
        var b = this.b.toString(16);
        this.hex = (a.length == 1 ? "0" + a : a) + (r.length == 1 ? "0" + r : r) + (g.length == 1 ? "0" + g : g) + (b.length == 1 ? "0" + b : b);
    }
    return this.hex;
};
CAscColor.prototype.get_color = function () {
    var ret = new CColor(this.r, this.g, this.b);
    return ret;
};
function CreateAscColorCustom(r, g, b, auto) {
    var ret = new CAscColor();
    ret.type = c_oAscColor.COLOR_TYPE_SRGB;
    ret.r = r;
    ret.g = g;
    ret.b = b;
    ret.a = 255;
    ret.Auto = (undefined === auto ? false : auto);
    return ret;
}
function CreateAscColor(unicolor) {
    if (null == unicolor || null == unicolor.color) {
        return new CAscColor();
    }
    var ret = new CAscColor();
    ret.r = unicolor.RGBA.R;
    ret.g = unicolor.RGBA.G;
    ret.b = unicolor.RGBA.B;
    ret.a = unicolor.RGBA.A;
    var _color = unicolor.color;
    switch (_color.type) {
    case COLOR_TYPE_SRGB:
        case COLOR_TYPE_SYS:
        break;
    case COLOR_TYPE_PRST:
        ret.type = c_oAscColor.COLOR_TYPE_PRST;
        ret.value = _color.id;
        break;
    case COLOR_TYPE_SCHEME:
        ret.type = c_oAscColor.COLOR_TYPE_SCHEME;
        ret.value = _color.id;
        break;
    default:
        break;
    }
    return ret;
}
function CreateUnifillFromAscColor(asc_color) {
    var Unifill = new CUniFill();
    Unifill.fill = new CSolidFill();
    Unifill.fill.color = CorrectUniColor(asc_color, Unifill.fill.color);
    return Unifill;
}
function CorrectUniColor(asc_color, unicolor, flag) {
    if (null == asc_color) {
        return unicolor;
    }
    var ret = unicolor;
    if (null == ret) {
        ret = new CUniColor();
    }
    var _type = asc_color.get_type();
    switch (_type) {
    case c_oAscColor.COLOR_TYPE_PRST:
        if (ret.color == null || ret.color.type != COLOR_TYPE_PRST) {
            ret.color = new CPrstColor();
        }
        ret.color.id = asc_color.value;
        if (ret.Mods.Mods.length != 0) {
            ret.Mods.Mods.splice(0, ret.Mods.Mods.length);
        }
        break;
    case c_oAscColor.COLOR_TYPE_SCHEME:
        if (ret.color == null || ret.color.type != COLOR_TYPE_SCHEME) {
            ret.color = new CSchemeColor();
        }
        var _index = parseInt(asc_color.value);
        if (isNaN(_index)) {
            break;
        }
        var _id = (_index / 6) >> 0;
        var _pos = _index - _id * 6;
        var array_colors_types = [6, 15, 7, 16, 0, 1, 2, 3, 4, 5];
        ret.color.id = array_colors_types[_id];
        if (!ret.Mods) {
            ret.setMods(new CColorModifiers());
        }
        if (ret.Mods.Mods.length != 0) {
            ret.Mods.Mods.splice(0, ret.Mods.Mods.length);
        }
        var __mods = null;
        var _flag;
        if (editor && editor.WordControl && editor.WordControl.m_oDrawingDocument && editor.WordControl.m_oDrawingDocument.GuiControlColorsMap) {
            var _map = editor.WordControl.m_oDrawingDocument.GuiControlColorsMap;
            _flag = isRealNumber(flag) ? flag : 1;
            __mods = GetDefaultMods(_map[_id].r, _map[_id].g, _map[_id].b, _pos, _flag);
        } else {
            var _editor = window["Asc"] && window["Asc"]["editor"];
            if (_editor && _editor.wbModel) {
                var _theme = _editor.wbModel.theme;
                var _clrMap = _editor.wbModel.clrSchemeMap;
                if (_theme && _clrMap) {
                    var _schemeClr = new CSchemeColor();
                    _schemeClr.id = array_colors_types[_id];
                    var _rgba = {
                        R: 0,
                        G: 0,
                        B: 0,
                        A: 255
                    };
                    _schemeClr.Calculate(_theme, _clrMap.color_map, _rgba);
                    _flag = isRealNumber(flag) ? flag : 0;
                    __mods = GetDefaultMods(_schemeClr.RGBA.R, _schemeClr.RGBA.G, _schemeClr.RGBA.B, _pos, _flag);
                }
            }
        }
        if (null != __mods) {
            for (var modInd = 0; modInd < __mods.length; modInd++) {
                ret.Mods.Mods[modInd] = _create_mod(__mods[modInd]);
            }
        }
        break;
    default:
        if (ret.color == null || ret.color.type != COLOR_TYPE_SRGB) {
            ret.color = new CRGBColor();
        }
        ret.color.RGBA.R = asc_color.r;
        ret.color.RGBA.G = asc_color.g;
        ret.color.RGBA.B = asc_color.b;
        ret.color.RGBA.A = asc_color.a;
        if (ret.Mods && ret.Mods.Mods.length != 0) {
            ret.Mods.Mods.splice(0, ret.Mods.Mods.length);
        }
    }
    return ret;
}
function CAscFillBlip() {
    this.type = c_oAscFillBlipType.STRETCH;
    this.url = "";
    this.texture_id = null;
}
CAscFillBlip.prototype.get_type = function () {
    return this.type;
};
CAscFillBlip.prototype.put_type = function (v) {
    this.type = v;
};
CAscFillBlip.prototype.get_url = function () {
    return this.url;
};
CAscFillBlip.prototype.put_url = function (v) {
    this.url = v;
};
CAscFillBlip.prototype.get_texture_id = function () {
    return this.texture_id;
};
CAscFillBlip.prototype.put_texture_id = function (v) {
    this.texture_id = v;
};
function CAscFillSolid() {
    this.color = new CAscColor();
}
CAscFillSolid.prototype.get_color = function () {
    return this.color;
};
CAscFillSolid.prototype.put_color = function (v) {
    this.color = v;
};
function CAscFillHatch() {
    this.PatternType = undefined;
    this.fgClr = undefined;
    this.bgClr = undefined;
}
CAscFillHatch.prototype.get_pattern_type = function () {
    return this.PatternType;
};
CAscFillHatch.prototype.put_pattern_type = function (v) {
    this.PatternType = v;
};
CAscFillHatch.prototype.get_color_fg = function () {
    return this.fgClr;
};
CAscFillHatch.prototype.put_color_fg = function (v) {
    this.fgClr = v;
};
CAscFillHatch.prototype.get_color_bg = function () {
    return this.bgClr;
};
CAscFillHatch.prototype.put_color_bg = function (v) {
    this.bgClr = v;
};
function CAscFillGrad() {
    this.Colors = undefined;
    this.Positions = undefined;
    this.GradType = 0;
    this.LinearAngle = undefined;
    this.LinearScale = true;
    this.PathType = 0;
}
CAscFillGrad.prototype.get_colors = function () {
    return this.Colors;
};
CAscFillGrad.prototype.put_colors = function (v) {
    this.Colors = v;
};
CAscFillGrad.prototype.get_positions = function () {
    return this.Positions;
};
CAscFillGrad.prototype.put_positions = function (v) {
    this.Positions = v;
};
CAscFillGrad.prototype.get_grad_type = function () {
    return this.GradType;
};
CAscFillGrad.prototype.put_grad_type = function (v) {
    this.GradType = v;
};
CAscFillGrad.prototype.get_linear_angle = function () {
    return this.LinearAngle;
};
CAscFillGrad.prototype.put_linear_angle = function (v) {
    this.LinearAngle = v;
};
CAscFillGrad.prototype.get_linear_scale = function () {
    return this.LinearScale;
};
CAscFillGrad.prototype.put_linear_scale = function (v) {
    this.LinearScale = v;
};
CAscFillGrad.prototype.get_path_type = function () {
    return this.PathType;
};
CAscFillGrad.prototype.put_path_type = function (v) {
    this.PathType = v;
};
function CAscFill() {
    this.type = null;
    this.fill = null;
    this.transparent = null;
}
CAscFill.prototype.get_type = function () {
    return this.type;
};
CAscFill.prototype.put_type = function (v) {
    this.type = v;
};
CAscFill.prototype.get_fill = function () {
    return this.fill;
};
CAscFill.prototype.put_fill = function (v) {
    this.fill = v;
};
CAscFill.prototype.get_transparent = function () {
    return this.transparent;
};
CAscFill.prototype.put_transparent = function (v) {
    this.transparent = v;
};
function CreateAscFill(unifill) {
    if (null == unifill || null == unifill.fill) {
        return new CAscFill();
    }
    var ret = new CAscFill();
    var _fill = unifill.fill;
    switch (_fill.type) {
    case FILL_TYPE_SOLID:
        ret.type = c_oAscFill.FILL_TYPE_SOLID;
        ret.fill = new CAscFillSolid();
        ret.fill.color = CreateAscColor(_fill.color);
        break;
    case FILL_TYPE_PATT:
        ret.type = c_oAscFill.FILL_TYPE_PATT;
        ret.fill = new CAscFillHatch();
        ret.fill.PatternType = _fill.ftype;
        ret.fill.fgClr = CreateAscColor(_fill.fgClr);
        ret.fill.bgClr = CreateAscColor(_fill.bgClr);
        break;
    case FILL_TYPE_GRAD:
        ret.type = c_oAscFill.FILL_TYPE_GRAD;
        ret.fill = new CAscFillGrad();
        for (var i = 0; i < _fill.colors.length; i++) {
            if (0 == i) {
                ret.fill.Colors = [];
                ret.fill.Positions = [];
            }
            ret.fill.Colors.push(CreateAscColor(_fill.colors[i].color));
            ret.fill.Positions.push(_fill.colors[i].pos);
        }
        if (_fill.lin) {
            ret.fill.GradType = c_oAscFillGradType.GRAD_LINEAR;
            ret.fill.LinearAngle = _fill.lin.angle;
            ret.fill.LinearScale = _fill.lin.scale;
        } else {
            ret.fill.GradType = c_oAscFillGradType.GRAD_PATH;
            ret.fill.PathType = 0;
        }
        break;
    case FILL_TYPE_BLIP:
        ret.type = c_oAscFill.FILL_TYPE_BLIP;
        ret.fill = new CAscFillBlip();
        ret.fill.url = _fill.RasterImageId;
        ret.fill.type = (_fill.tile == null) ? c_oAscFillBlipType.STRETCH : c_oAscFillBlipType.TILE;
        break;
    case FILL_TYPE_NOFILL:
        case FILL_TYPE_NONE:
        ret.type = c_oAscFill.FILL_TYPE_NOFILL;
        break;
    default:
        break;
    }
    ret.transparent = unifill.transparent;
    return ret;
}
function CorrectUniFill(asc_fill, unifill) {
    if (null == asc_fill) {
        return unifill;
    }
    var ret = unifill;
    if (null == ret) {
        ret = new CUniFill();
    }
    var _fill = asc_fill.fill;
    var _type = asc_fill.type;
    if (null != _type) {
        switch (_type) {
        case c_oAscFill.FILL_TYPE_NOFILL:
            ret.fill = new CNoFill();
            break;
        case c_oAscFill.FILL_TYPE_BLIP:
            if (ret.fill == null || ret.fill.type != FILL_TYPE_BLIP) {
                ret.fill = new CBlipFill();
            }
            var _url = _fill.url;
            var _tx_id = _fill.texture_id;
            if (null != _tx_id && (0 <= _tx_id) && (_tx_id < g_oUserTexturePresets.length)) {
                _url = g_oUserTexturePresets[_tx_id];
            }
            if (_url != null && _url !== undefined && _url != "") {
                ret.fill.RasterImageId = _url;
            }
            if (ret.fill.RasterImageId == null) {
                ret.fill.RasterImageId = "";
            }
            var tile = _fill.type;
            if (tile == c_oAscFillBlipType.STRETCH) {
                ret.fill.tile = null;
            } else {
                if (tile == c_oAscFillBlipType.TILE) {
                    ret.fill.tile = true;
                }
            }
            break;
        case c_oAscFill.FILL_TYPE_PATT:
            if (ret.fill == null || ret.fill.type != FILL_TYPE_PATT) {
                ret.fill = new CPattFill();
            }
            if (undefined != _fill.PatternType) {
                ret.fill.ftype = _fill.PatternType;
            }
            if (undefined != _fill.fgClr) {
                ret.fill.fgClr = CorrectUniColor(_fill.fgClr, ret.fill.fgClr);
            }
            if (undefined != _fill.bgClr) {
                ret.fill.bgClr = CorrectUniColor(_fill.bgClr, ret.fill.bgClr);
            }
            break;
        case c_oAscFill.FILL_TYPE_GRAD:
            if (ret.fill == null || ret.fill.type != FILL_TYPE_GRAD) {
                ret.fill = new CGradFill();
            }
            var _colors = _fill.Colors;
            var _positions = _fill.Positions;
            if (undefined != _colors && undefined != _positions) {
                if (_colors.length == _positions.length) {
                    ret.fill.colors.splice(0, ret.fill.colors.length);
                    for (var i = 0; i < _colors.length; i++) {
                        var _gs = new CGs();
                        _gs.color = CorrectUniColor(_colors[i], _gs.color);
                        _gs.pos = _positions[i];
                        ret.fill.colors.push(_gs);
                    }
                }
            } else {
                if (undefined != _colors) {
                    if (_colors.length == ret.fill.colors.length) {
                        for (var i = 0; i < _colors.length; i++) {
                            ret.fill.colors[i].color = CorrectUniColor(_colors[i], ret.fill.colors[i].color);
                        }
                    }
                } else {
                    if (undefined != _positions) {
                        if (_positions.length == ret.fill.colors.length) {
                            for (var i = 0; i < _positions.length; i++) {
                                ret.fill.colors[i].pos = _positions[i];
                            }
                        }
                    }
                }
            }
            var _grad_type = _fill.GradType;
            if (c_oAscFillGradType.GRAD_LINEAR == _grad_type) {
                var _angle = _fill.LinearAngle;
                var _scale = _fill.LinearScale;
                if (!ret.fill.lin) {
                    ret.fill.lin = new GradLin();
                }
                if (undefined != _angle) {
                    ret.fill.lin.angle = _angle;
                }
                if (undefined != _scale) {
                    ret.fill.lin.scale = _scale;
                }
            } else {
                if (c_oAscFillGradType.GRAD_PATH == _grad_type) {
                    ret.fill.lin = null;
                    ret.fill.path = new GradPath();
                }
            }
            break;
        default:
            if (ret.fill == null || ret.fill.type != FILL_TYPE_SOLID) {
                ret.fill = new CSolidFill();
            }
            ret.fill.color = CorrectUniColor(_fill.color, ret.fill.color);
        }
    }
    var _alpha = asc_fill.transparent;
    if (null != _alpha) {
        ret.transparent = _alpha;
    }
    return ret;
}
function CAscStroke() {
    this.type = null;
    this.width = null;
    this.color = null;
    this.LineJoin = null;
    this.LineCap = null;
    this.LineBeginStyle = null;
    this.LineBeginSize = null;
    this.LineEndStyle = null;
    this.LineEndSize = null;
    this.canChangeArrows = false;
}
CAscStroke.prototype.get_type = function () {
    return this.type;
};
CAscStroke.prototype.put_type = function (v) {
    this.type = v;
};
CAscStroke.prototype.get_width = function () {
    return this.width;
};
CAscStroke.prototype.put_width = function (v) {
    this.width = v;
};
CAscStroke.prototype.get_color = function () {
    return this.color;
};
CAscStroke.prototype.put_color = function (v) {
    this.color = v;
};
CAscStroke.prototype.get_linejoin = function () {
    return this.LineJoin;
};
CAscStroke.prototype.put_linejoin = function (v) {
    this.LineJoin = v;
};
CAscStroke.prototype.get_linecap = function () {
    return this.LineCap;
};
CAscStroke.prototype.put_linecap = function (v) {
    this.LineCap = v;
};
CAscStroke.prototype.get_linebeginstyle = function () {
    return this.LineBeginStyle;
};
CAscStroke.prototype.put_linebeginstyle = function (v) {
    this.LineBeginStyle = v;
};
CAscStroke.prototype.get_linebeginsize = function () {
    return this.LineBeginSize;
};
CAscStroke.prototype.put_linebeginsize = function (v) {
    this.LineBeginSize = v;
};
CAscStroke.prototype.get_lineendstyle = function () {
    return this.LineEndStyle;
};
CAscStroke.prototype.put_lineendstyle = function (v) {
    this.LineEndStyle = v;
};
CAscStroke.prototype.get_lineendsize = function () {
    return this.LineEndSize;
};
CAscStroke.prototype.put_lineendsize = function (v) {
    this.LineEndSize = v;
};
CAscStroke.prototype.get_canChangeArrows = function () {
    return this.canChangeArrows;
};
function CreateAscStroke(ln, _canChangeArrows) {
    if (null == ln || null == ln.Fill || ln.Fill.fill == null) {
        return new CAscStroke();
    }
    var ret = new CAscStroke();
    var _fill = ln.Fill.fill;
    if (_fill != null) {
        switch (_fill.type) {
        case FILL_TYPE_BLIP:
            break;
        case FILL_TYPE_SOLID:
            ret.color = CreateAscColor(_fill.color);
            ret.type = c_oAscStrokeType.STROKE_COLOR;
            break;
        case FILL_TYPE_GRAD:
            var _c = _fill.colors;
            if (_c != 0) {
                ret.color = CreateAscColor(_fill.colors[0].color);
                ret.type = c_oAscStrokeType.STROKE_COLOR;
            }
            break;
        case FILL_TYPE_PATT:
            ret.color = CreateAscColor(_fill.fgClr);
            ret.type = c_oAscStrokeType.STROKE_COLOR;
            break;
        case FILL_TYPE_NOFILL:
            ret.color = null;
            ret.type = c_oAscStrokeType.STROKE_NONE;
            break;
        default:
            break;
        }
    }
    ret.width = (ln.w == null) ? 12700 : (ln.w >> 0);
    ret.width /= 36000;
    if (ln.cap != null) {
        ret.put_linecap(ln.cap);
    }
    if (ln.Join != null) {
        ret.put_linejoin(ln.Join.type);
    }
    if (ln.headEnd != null) {
        ret.put_linebeginstyle((ln.headEnd.type == null) ? LineEndType.None : ln.headEnd.type);
        var _len = (null == ln.headEnd.len) ? 1 : (2 - ln.headEnd.len);
        var _w = (null == ln.headEnd.w) ? 1 : (2 - ln.headEnd.w);
        ret.put_linebeginsize(_w * 3 + _len);
    } else {
        ret.put_linebeginstyle(LineEndType.None);
    }
    if (ln.tailEnd != null) {
        ret.put_lineendstyle((ln.tailEnd.type == null) ? LineEndType.None : ln.tailEnd.type);
        var _len = (null == ln.tailEnd.len) ? 1 : (2 - ln.tailEnd.len);
        var _w = (null == ln.tailEnd.w) ? 1 : (2 - ln.tailEnd.w);
        ret.put_lineendsize(_w * 3 + _len);
    } else {
        ret.put_lineendstyle(LineEndType.None);
    }
    if (true === _canChangeArrows) {
        ret.canChangeArrows = true;
    }
    return ret;
}
function CorrectUniStroke(asc_stroke, unistroke) {
    if (null == asc_stroke) {
        return unistroke;
    }
    var ret = unistroke;
    if (null == ret) {
        ret = new CLn();
    }
    var _type = asc_stroke.type;
    var _w = asc_stroke.width;
    if (_w != null && _w !== undefined) {
        ret.w = _w * 36000;
    }
    var _color = asc_stroke.color;
    if (_type == c_oAscStrokeType.STROKE_NONE) {
        ret.Fill = new CUniFill();
        ret.Fill.fill = new CNoFill();
    } else {
        if (_type != null) {
            if (null != _color && undefined !== _color) {
                ret.Fill = new CUniFill();
                ret.Fill.type = FILL_TYPE_SOLID;
                ret.Fill.fill = new CSolidFill();
                ret.Fill.fill.color = CorrectUniColor(_color, ret.Fill.fill.color);
            }
        }
    }
    var _join = asc_stroke.LineJoin;
    if (null != _join) {
        ret.Join = new LineJoin();
        ret.Join.type = _join;
    }
    var _cap = asc_stroke.LineCap;
    if (null != _cap) {
        ret.cap = _cap;
    }
    var _begin_style = asc_stroke.LineBeginStyle;
    if (null != _begin_style) {
        if (ret.headEnd == null) {
            ret.headEnd = new EndArrow();
        }
        ret.headEnd.type = _begin_style;
    }
    var _end_style = asc_stroke.LineEndStyle;
    if (null != _end_style) {
        if (ret.tailEnd == null) {
            ret.tailEnd = new EndArrow();
        }
        ret.tailEnd.type = _end_style;
    }
    var _begin_size = asc_stroke.LineBeginSize;
    if (null != _begin_size) {
        if (ret.headEnd == null) {
            ret.headEnd = new EndArrow();
        }
        ret.headEnd.w = 2 - ((_begin_size / 3) >> 0);
        ret.headEnd.len = 2 - (_begin_size % 3);
    }
    var _end_size = asc_stroke.LineEndSize;
    if (null != _end_size) {
        if (ret.tailEnd == null) {
            ret.tailEnd = new EndArrow();
        }
        ret.tailEnd.w = 2 - ((_end_size / 3) >> 0);
        ret.tailEnd.len = 2 - (_end_size % 3);
    }
    return ret;
}
function CAscShapeProp() {
    this.type = null;
    this.fill = null;
    this.stroke = null;
    this.paddings = null;
    this.canFill = true;
    this.bFromChart = false;
    this.Locked = false;
    this.w = null;
    this.h = null;
}
CAscShapeProp.prototype.get_type = function () {
    return this.type;
};
CAscShapeProp.prototype.put_type = function (v) {
    this.type = v;
};
CAscShapeProp.prototype.get_fill = function () {
    return this.fill;
};
CAscShapeProp.prototype.put_fill = function (v) {
    this.fill = v;
};
CAscShapeProp.prototype.get_stroke = function () {
    return this.stroke;
};
CAscShapeProp.prototype.put_stroke = function (v) {
    this.stroke = v;
};
CAscShapeProp.prototype.get_paddings = function () {
    return this.paddings;
};
CAscShapeProp.prototype.put_paddings = function (v) {
    this.paddings = v;
};
CAscShapeProp.prototype.get_CanFill = function () {
    return this.canFill;
};
CAscShapeProp.prototype.put_CanFill = function (v) {
    this.canFill = v;
};
CAscShapeProp.prototype.get_FromChart = function () {
    return this.bFromChart;
};
CAscShapeProp.prototype.put_FromChart = function (v) {
    this.bFromChart = v;
};
CAscShapeProp.prototype.get_Locked = function () {
    return this.Locked;
};
CAscShapeProp.prototype.put_Locked = function (v) {
    this.Locked = v;
};
CAscShapeProp.prototype.get_Width = function () {
    return this.w;
};
CAscShapeProp.prototype.put_Width = function (v) {
    this.w = v;
};
CAscShapeProp.prototype.get_Height = function () {
    return this.h;
};
CAscShapeProp.prototype.put_Height = function (v) {
    this.h = v;
};
CAscShapeProp.prototype.get_VerticalTextAlign = function () {
    return this.verticalTextAlign;
};
CAscShapeProp.prototype.put_VerticalTextAlign = function (v) {
    this.verticalTextAlign = v;
};
function CreateAscShapeProp(shape) {
    if (null == shape) {
        return new CAscShapeProp();
    }
    var ret = new CAscShapeProp();
    ret.fill = CreateAscFill(shape.brush);
    ret.stroke = CreateAscStroke(shape.pen);
    var paddings = null;
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
    return ret;
}
function CreateAscShapePropFromProp(shapeProp) {
    var obj = new CAscShapeProp();
    if (!isRealObject(shapeProp)) {
        return obj;
    }
    if (isRealBool(shapeProp.locked)) {
        obj.Locked = shapeProp.locked;
    }
    if (typeof shapeProp.type === "string") {
        obj.type = shapeProp.type;
    }
    if (isRealObject(shapeProp.fill)) {
        obj.fill = CreateAscFill(shapeProp.fill);
    }
    if (isRealObject(shapeProp.stroke)) {
        obj.stroke = CreateAscStroke(shapeProp.stroke, shapeProp.canChangeArrows);
    }
    if (isRealObject(shapeProp.paddings)) {
        obj.paddings = shapeProp.paddings;
    }
    if (shapeProp.canFill === true || shapeProp.canFill === false) {
        obj.canFill = shapeProp.canFill;
    }
    obj.bFromChart = shapeProp.bFromChart;
    obj.w = shapeProp.w;
    obj.h = shapeProp.h;
    return obj;
}
function CorrectShapeProp(asc_shape_prop, shape) {
    if (null == shape || null == asc_shape_prop) {
        return;
    }
    shape.spPr.Fill = CorrectUniFill(asc_shape_prop.get_fill(), shape.spPr.Fill);
    shape.spPr.ln = CorrectUniFill(asc_shape_prop.get_stroke(), shape.spPr.ln);
}
function CAscTableStyle() {
    this.Id = "";
    this.Type = 0;
    this.Image = "";
}
CAscTableStyle.prototype.get_Id = function () {
    return this.Id;
};
CAscTableStyle.prototype.get_Image = function () {
    return this.Image;
};
CAscTableStyle.prototype.get_Type = function () {
    return this.Type;
};
function CPaddings(obj) {
    if (obj) {
        this.Left = (undefined == obj.Left) ? null : obj.Left;
        this.Top = (undefined == obj.Top) ? null : obj.Top;
        this.Bottom = (undefined == obj.Bottom) ? null : obj.Bottom;
        this.Right = (undefined == obj.Right) ? null : obj.Right;
    } else {
        this.Left = null;
        this.Top = null;
        this.Bottom = null;
        this.Right = null;
    }
}
CPaddings.prototype.get_Left = function () {
    return this.Left;
};
CPaddings.prototype.put_Left = function (v) {
    this.Left = v;
};
CPaddings.prototype.get_Top = function () {
    return this.Top;
};
CPaddings.prototype.put_Top = function (v) {
    this.Top = v;
};
CPaddings.prototype.get_Bottom = function () {
    return this.Bottom;
};
CPaddings.prototype.put_Bottom = function (v) {
    this.Bottom = v;
};
CPaddings.prototype.get_Right = function () {
    return this.Right;
};
CPaddings.prototype.put_Right = function (v) {
    this.Right = v;
};
function GenerateTableStyles(drawingDoc, logicDoc, tableLook) {
    var _dst_styles = [];
    var _styles = logicDoc.Styles.Get_AllTableStyles();
    var _styles_len = _styles.length;
    if (_styles_len == 0) {
        return _dst_styles;
    }
    var _x_mar = 10;
    var _y_mar = 10;
    var _r_mar = 10;
    var _b_mar = 10;
    var _pageW = 297;
    var _pageH = 210;
    var W = (_pageW - _x_mar - _r_mar);
    var H = (_pageH - _y_mar - _b_mar);
    var Grid = [];
    var Rows = 5;
    var Cols = 5;
    for (var i = 0; i < Cols; i++) {
        Grid[i] = W / Cols;
    }
    var _canvas = document.createElement("canvas");
    if (!this.m_oWordControl.bIsRetinaSupport) {
        _canvas.width = TABLE_STYLE_WIDTH_PIX;
        _canvas.height = TABLE_STYLE_HEIGHT_PIX;
    } else {
        _canvas.width = (TABLE_STYLE_WIDTH_PIX << 1);
        _canvas.height = (TABLE_STYLE_HEIGHT_PIX << 1);
    }
    var ctx = _canvas.getContext("2d");
    History.TurnOff();
    for (var i1 = 0; i1 < _styles_len; i1++) {
        var i = _styles[i1];
        var _style = logicDoc.Styles.Style[i];
        if (!_style || _style.Type != styletype_Table) {
            continue;
        }
        var table = new CTable(drawingDoc, logicDoc, true, 0, _x_mar, _y_mar, 1000, 1000, Rows, Cols, Grid);
        table.Set_Props({
            TableStyle: i
        });
        for (var j = 0; j < Rows; j++) {
            table.Content[j].Set_Height(H / Rows, heightrule_AtLeast);
        }
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, _canvas.width, _canvas.height);
        var graphics = new CGraphics();
        graphics.init(ctx, _canvas.width, _canvas.height, _pageW, _pageH);
        graphics.m_oFontManager = g_fontManager;
        graphics.transform(1, 0, 0, 1, 0, 0);
        table.Recalculate_Page(0);
        table.Draw(0, graphics);
        var _styleD = new CAscTableStyle();
        _styleD.Type = 0;
        _styleD.Image = _canvas.toDataURL("image/png");
        _styleD.Id = i;
        _dst_styles.push(_styleD);
    }
    History.TurnOn();
    return _dst_styles;
}