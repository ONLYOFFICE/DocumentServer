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
var FORMULA_TYPE_MULT_DIV = 0,
FORMULA_TYPE_PLUS_MINUS = 1,
FORMULA_TYPE_PLUS_DIV = 2,
FORMULA_TYPE_IF_ELSE = 3,
FORMULA_TYPE_ABS = 4,
FORMULA_TYPE_AT2 = 5,
FORMULA_TYPE_CAT2 = 6,
FORMULA_TYPE_COS = 7,
FORMULA_TYPE_MAX = 8,
FORMULA_TYPE_MOD = 9,
FORMULA_TYPE_PIN = 10,
FORMULA_TYPE_SAT2 = 11,
FORMULA_TYPE_SIN = 12,
FORMULA_TYPE_SQRT = 13,
FORMULA_TYPE_TAN = 14,
FORMULA_TYPE_VALUE = 15,
FORMULA_TYPE_MIN = 16;
var APPROXIMATE_EPSILON = 1;
var APPROXIMATE_EPSILON2 = 3;
var APPROXIMATE_EPSILON3 = 5;
var cToRad = Math.PI / (60000 * 180);
var cToDeg = 1 / cToRad;
function Cos(angle) {
    return Math.cos(cToRad * angle);
}
function Sin(angle) {
    return Math.sin(cToRad * angle);
}
function Tan(angle) {
    return Math.tan(cToRad * angle);
}
function ATan(x) {
    return cToDeg * Math.atan(x);
}
function ATan2(y, x) {
    return cToDeg * Math.atan2(y, x);
}
function CAt2(x, y, z) {
    return x * (Math.cos(Math.atan2(z, y)));
}
function SAt2(x, y, z) {
    return x * (Math.sin(Math.atan2(z, y)));
}
function CalculateGuideValue(name, formula, x, y, z, gdLst) {
    var xt, yt, zt;
    xt = gdLst[x];
    if (xt === undefined) {
        xt = parseInt(x, 10);
    }
    yt = gdLst[y];
    if (yt === undefined) {
        yt = parseInt(y, 10);
    }
    zt = gdLst[z];
    if (zt === undefined) {
        zt = parseInt(z, 10);
    }
    switch (formula) {
    case FORMULA_TYPE_MULT_DIV:
        gdLst[name] = xt * yt / zt;
        break;
    case FORMULA_TYPE_PLUS_MINUS:
        gdLst[name] = xt + yt - zt;
        break;
    case FORMULA_TYPE_PLUS_DIV:
        gdLst[name] = (xt + yt) / zt;
        break;
    case FORMULA_TYPE_IF_ELSE:
        if (xt > 0) {
            gdLst[name] = yt;
        } else {
            gdLst[name] = zt;
        }
        break;
    case FORMULA_TYPE_ABS:
        gdLst[name] = Math.abs(xt);
        break;
    case FORMULA_TYPE_AT2:
        gdLst[name] = ATan2(yt, xt);
        break;
    case FORMULA_TYPE_CAT2:
        gdLst[name] = CAt2(xt, yt, zt);
        break;
    case FORMULA_TYPE_COS:
        gdLst[name] = xt * Cos(yt);
        break;
    case FORMULA_TYPE_MAX:
        gdLst[name] = Math.max(xt, yt);
        break;
    case FORMULA_TYPE_MOD:
        gdLst[name] = Math.sqrt(xt * xt + yt * yt + zt * zt);
        break;
    case FORMULA_TYPE_PIN:
        if (yt < xt) {
            gdLst[name] = xt;
        } else {
            if (yt > zt) {
                gdLst[name] = zt;
            } else {
                gdLst[name] = yt;
            }
        }
        break;
    case FORMULA_TYPE_SAT2:
        gdLst[name] = SAt2(xt, yt, zt);
        break;
    case FORMULA_TYPE_SIN:
        gdLst[name] = xt * Sin(yt);
        break;
    case FORMULA_TYPE_SQRT:
        gdLst[name] = Math.sqrt(xt);
        break;
    case FORMULA_TYPE_TAN:
        gdLst[name] = xt * Tan(yt);
        break;
    case FORMULA_TYPE_VALUE:
        gdLst[name] = xt;
        break;
    case FORMULA_TYPE_MIN:
        gdLst[name] = Math.min(xt, yt);
    }
}
function CalculateGuideLst(gdLstInfo, gdLst) {
    var info;
    for (var i = 0, n = gdLstInfo.length; i < n; i++) {
        info = gdLstInfo[i];
        CalculateGuideValue(info.name, info.formula, info.x, info.y, info.z, gdLst);
    }
}
function CalculateCnxLst(cnxLstInfo, cnxLst, gdLst) {
    var x_, y_, ang_;
    for (var i = 0, n = cnxLstInfo.length; i < n; i++) {
        ang_ = parseInt(cnxLstInfo[i].ang);
        if (isNaN(ang_)) {
            ang_ = gdLst[cnxLstInfo[i].ang];
        }
        x_ = gdLst[cnxLstInfo[i].x];
        if (x_ === undefined) {
            x_ = parseInt(cnxLstInfo[i].x);
        }
        y_ = gdLst[cnxLstInfo[i].y];
        if (y_ === undefined) {
            y_ = parseInt(cnxLstInfo[i].y);
        }
        if (cnxLst[i] == undefined) {
            cnxLst[i] = {};
        }
        cnxLst[i].ang = ang_;
        cnxLst[i].x = x_;
        cnxLst[i].y = y_;
    }
}
function CalculateAhXYList(ahXYListInfo, ahXYLst, gdLst) {
    var minX, maxX, minY, maxY, posX, posY;
    for (var i = 0, n = ahXYListInfo.length; i < n; i++) {
        minX = parseInt(ahXYListInfo[i].minX);
        if (isNaN(minX)) {
            minX = gdLst[ahXYListInfo[i].minX];
        }
        maxX = parseInt(ahXYListInfo[i].maxX);
        if (isNaN(maxX)) {
            maxX = gdLst[ahXYListInfo[i].maxX];
        }
        minY = parseInt(ahXYListInfo[i].minY);
        if (isNaN(minY)) {
            minY = gdLst[ahXYListInfo[i].minY];
        }
        maxY = parseInt(ahXYListInfo[i].maxY);
        if (isNaN(maxY)) {
            maxY = gdLst[ahXYListInfo[i].maxY];
        }
        posX = parseInt(ahXYListInfo[i].posX);
        if (isNaN(posX)) {
            posX = gdLst[ahXYListInfo[i].posX];
        }
        posY = parseInt(ahXYListInfo[i].posY);
        if (isNaN(posY)) {
            posY = gdLst[ahXYListInfo[i].posY];
        }
        if (ahXYLst[i] == undefined) {
            ahXYLst[i] = {};
        }
        ahXYLst[i].gdRefX = ahXYListInfo[i].gdRefX;
        ahXYLst[i].minX = minX;
        ahXYLst[i].maxX = maxX;
        ahXYLst[i].gdRefY = ahXYListInfo[i].gdRefY;
        ahXYLst[i].minY = minY;
        ahXYLst[i].maxY = maxY;
        ahXYLst[i].posX = posX;
        ahXYLst[i].posY = posY;
    }
}
function CalculateAhPolarList(ahPolarListInfo, ahPolarLst, gdLst) {
    var minR, maxR, minAng, maxAng, posX, posY;
    for (var i = 0, n = ahPolarListInfo.length; i < n; i++) {
        minR = parseInt(ahPolarListInfo[i].minR);
        if (isNaN(minR)) {
            minR = gdLst[ahPolarListInfo[i].minR];
        }
        maxR = parseInt(ahPolarListInfo[i].maxR);
        if (isNaN(maxR)) {
            maxR = gdLst[ahPolarListInfo[i].maxR];
        }
        minAng = parseInt(ahPolarListInfo[i].minAng);
        if (isNaN(minAng)) {
            minAng = gdLst[ahPolarListInfo[i].minAng];
        }
        maxAng = parseInt(ahPolarListInfo[i].maxAng);
        if (isNaN(maxAng)) {
            maxAng = gdLst[ahPolarListInfo[i].maxAng];
        }
        posX = parseInt(ahPolarListInfo[i].posX);
        if (isNaN(posX)) {
            posX = gdLst[ahPolarListInfo[i].posX];
        }
        posY = parseInt(ahPolarListInfo[i].posY);
        if (isNaN(posY)) {
            posY = gdLst[ahPolarListInfo[i].posY];
        }
        if (ahPolarLst[i] == undefined) {
            ahPolarLst[i] = {};
        }
        ahPolarLst[i].gdRefR = ahPolarListInfo[i].gdRefR;
        ahPolarLst[i].minR = minR;
        ahPolarLst[i].maxR = maxR;
        ahPolarLst[i].gdRefAng = ahPolarListInfo[i].gdRefAng;
        ahPolarLst[i].minAng = minAng;
        ahPolarLst[i].maxAng = maxAng;
        ahPolarLst[i].posX = posX;
        ahPolarLst[i].posY = posY;
    }
}
function Geometry() {
    this.gdLstInfo = [];
    this.gdLst = {};
    this.avLst = {};
    this.cnxLstInfo = [];
    this.cnxLst = [];
    this.ahXYLstInfo = [];
    this.ahXYLst = [];
    this.ahPolarLstInfo = [];
    this.ahPolarLst = [];
    this.pathLst = [];
    this.preset = null;
    this.rectS = null;
    this.parent = null;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
Geometry.prototype = {
    Get_Id: function () {
        return this.Id;
    },
    getObjectType: function () {
        return historyitem_type_Geometry;
    },
    Write_ToBinary2: function (w) {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },
    Read_FromBinary2: function (r) {
        this.Id = r.GetString2();
    },
    Refresh_RecalcData: function (data) {
        if (this.parent && this.parent.handleUpdateGeometry) {
            this.parent.handleUpdateGeometry();
        }
    },
    createDuplicate: function () {
        var g = new Geometry();
        for (var i = 0; i < this.gdLstInfo.length; ++i) {
            var gd = this.gdLstInfo[i];
            g.AddGuide(gd.name, gd.formula, gd.x, gd.y, gd.z);
        }
        for (var key in this.avLst) {
            g.AddAdj(key, 15, this.gdLst[key] + "", undefined, undefined);
        }
        g.setPreset(this.preset);
        for (i = 0; i < this.cnxLstInfo.length; ++i) {
            var cn = this.cnxLstInfo[i];
            g.AddCnx(cn.ang, cn.x, cn.y);
        }
        for (i = 0; i < this.ahXYLstInfo.length; ++i) {
            var ah = this.ahXYLstInfo[i];
            g.AddHandleXY(ah.gdRefX, ah.minX, ah.maxX, ah.gdRefY, ah.minY, ah.maxY, ah.posX, ah.posY);
        }
        for (i = 0; i < this.ahPolarLstInfo.length; ++i) {
            var ah = this.ahPolarLstInfo[i];
            g.AddHandlePolar(ah.gdRefAng, ah.minAng, ah.maxAng, ah.gdRefR, ah.minR, ah.maxR, ah.posX, ah.posY);
        }
        for (i = 0; i < this.pathLst.length; ++i) {
            g.AddPath(this.pathLst[i].createDuplicate());
        }
        if (this.rectS) {
            g.AddRect(this.rectS.l, this.rectS.t, this.rectS.r, this.rectS.b);
        }
        return g;
    },
    setParent: function (pr) {
        History.Add(this, {
            Type: historyitem_GeometrySetParent,
            oldPr: this.parent,
            newPr: pr
        });
        this.parent = pr;
    },
    setPreset: function (preset) {
        History.Add(this, {
            Type: historyitem_GeometrySetPreset,
            oldPr: this.preset,
            newPr: preset
        });
        this.preset = preset;
    },
    AddAdj: function (name, formula, x, y, z) {
        History.Add(this, {
            Type: historyitem_GeometryAddAdj,
            name: name,
            oldVal: this.gdLst[name],
            newVal: x,
            oldAvVal: this.avLst[name]
        });
        this.gdLst[name] = parseInt(x);
        this.avLst[name] = true;
    },
    setAdjValue: function (name, val) {
        this.AddAdj(name, 15, val + "", undefined, undefined);
        if (this.parent && this.parent.handleUpdateGeometry) {
            this.parent.handleUpdateGeometry();
        }
    },
    AddGuide: function (name, formula, x, y, z) {
        History.Add(this, {
            Type: historyitem_GeometryAddGuide,
            name: name,
            formula: formula,
            x: x,
            y: y,
            z: z
        });
        this.gdLstInfo.push({
            name: name,
            formula: formula,
            x: x,
            y: y,
            z: z
        });
    },
    AddCnx: function (ang, x, y) {
        History.Add(this, {
            Type: historyitem_GeometryAddCnx,
            ang: ang,
            x: x,
            y: y
        });
        this.cnxLstInfo.push({
            ang: ang,
            x: x,
            y: y
        });
    },
    AddHandleXY: function (gdRefX, minX, maxX, gdRefY, minY, maxY, posX, posY) {
        History.Add(this, {
            Type: historyitem_GeometryAddHandleXY,
            gdRefX: gdRefX,
            minX: minX,
            maxX: maxX,
            gdRefY: gdRefY,
            minY: minY,
            maxY: maxY,
            posX: posX,
            posY: posY
        });
        this.ahXYLstInfo.push({
            gdRefX: gdRefX,
            minX: minX,
            maxX: maxX,
            gdRefY: gdRefY,
            minY: minY,
            maxY: maxY,
            posX: posX,
            posY: posY
        });
    },
    AddHandlePolar: function (gdRefAng, minAng, maxAng, gdRefR, minR, maxR, posX, posY) {
        History.Add(this, {
            Type: historyitem_GeometryAddHandlePolar,
            gdRefAng: gdRefAng,
            minAng: minAng,
            maxAng: maxAng,
            gdRefR: gdRefR,
            minR: minR,
            maxR: maxR,
            posX: posX,
            posY: posY
        });
        this.ahPolarLstInfo.push({
            gdRefAng: gdRefAng,
            minAng: minAng,
            maxAng: maxAng,
            gdRefR: gdRefR,
            minR: minR,
            maxR: maxR,
            posX: posX,
            posY: posY
        });
    },
    AddPath: function (pr) {
        History.Add(this, {
            Type: historyitem_GeometryAddPath,
            newPr: pr
        });
        this.pathLst.push(pr);
    },
    AddPathCommand: function (command, x1, y1, x2, y2, x3, y3) {
        switch (command) {
        case 0:
            var path = new Path();
            path.setExtrusionOk(x1 || false);
            path.setFill(y1 || "norm");
            path.setStroke(x2 != undefined ? x2 : true);
            path.setPathW(y2);
            path.setPathH(x3);
            this.AddPath(path);
            break;
        case 1:
            this.pathLst[this.pathLst.length - 1].moveTo(x1, y1);
            break;
        case 2:
            this.pathLst[this.pathLst.length - 1].lnTo(x1, y1);
            break;
        case 3:
            this.pathLst[this.pathLst.length - 1].arcTo(x1, y1, x2, y2);
            break;
        case 4:
            this.pathLst[this.pathLst.length - 1].quadBezTo(x1, y1, x2, y2);
            break;
        case 5:
            this.pathLst[this.pathLst.length - 1].cubicBezTo(x1, y1, x2, y2, x3, y3);
            break;
        case 6:
            this.pathLst[this.pathLst.length - 1].close();
        }
    },
    AddRect: function (l, t, r, b) {
        History.Add(this, {
            Type: historyitem_GeometryAddRect,
            l: l,
            t: t,
            r: r,
            b: b
        });
        this.rectS = {};
        this.rectS.l = l;
        this.rectS.t = t;
        this.rectS.r = r;
        this.rectS.b = b;
    },
    Undo: function (data) {
        switch (data.Type) {
        case historyitem_GeometrySetParent:
            this.parent = data.oldPr;
            break;
        case historyitem_GeometryAddAdj:
            this.gdLst[data.name] = data.oldVal;
            this.avLst[data.name] = data.oldAvVal;
            if (this.parent && this.parent.handleUpdateGeometry) {
                this.parent.handleUpdateGeometry();
            }
            break;
        case historyitem_GeometryAddGuide:
            for (var i = this.gdLstInfo.length - 1; i > -1; --i) {
                if (this.gdLstInfo[i].name === data.name && this.gdLstInfo[i].formula === data.formula && this.gdLstInfo[i].x === data.x && this.gdLstInfo[i].y === data.y && this.gdLstInfo[i].z === data.z) {
                    this.gdLstInfo.splice(i, 1);
                    break;
                }
            }
            break;
        case historyitem_GeometryAddCnx:
            for (var i = this.cnxLstInfo.length - 1; i > -1; --i) {
                if (this.cnxLstInfo[i].ang === data.ang && this.cnxLstInfo[i].x === data.x && this.cnxLstInfo[i].y === data.y) {
                    this.cnxLstInfo.splice(i, 1);
                    break;
                }
            }
            break;
        case historyitem_GeometryAddHandleXY:
            for (var i = this.ahXYLstInfo.length - 1; i > -1; --i) {
                if (this.ahXYLstInfo[i].gdRefX === data.gdRefX && this.ahXYLstInfo[i].minX === data.minX && this.ahXYLstInfo[i].maxX === data.maxX && this.ahXYLstInfo[i].gdRefY === data.gdRefY && this.ahXYLstInfo[i].minY === data.minY && this.ahXYLstInfo[i].maxY === data.maxY && this.ahXYLstInfo[i].posX === data.posX && this.ahXYLstInfo[i].posY === data.posY) {
                    this.ahXYLstInfo.splice(i, 1);
                    break;
                }
            }
            break;
        case historyitem_GeometryAddHandlePolar:
            for (var i = this.ahPolarLstInfo.length - 1; i > -1; --i) {
                if (this.ahPolarLstInfo[i].gdRefAng === data.gdRefAng && this.ahPolarLstInfo[i].minAng === data.minAng && this.ahPolarLstInfo[i].maxAng === data.maxAng && this.ahPolarLstInfo[i].gdRefR === data.gdRefR && this.ahPolarLstInfo[i].minR === data.minR && this.ahPolarLstInfo[i].maxR === data.maxR && this.ahPolarLstInfo[i].posX === data.posX && this.ahPolarLstInfo[i].posY === data.posY) {
                    this.ahPolarLstInfo.splice(i, 1);
                    break;
                }
            }
            break;
        case historyitem_GeometryAddPath:
            for (var i = this.pathLst.length; i > -1; --i) {
                if (this.pathLst[i] === data.newPr) {
                    this.pathLst.splice(i, 1);
                    break;
                }
            }
            break;
        case historyitem_GeometryAddRect:
            this.rectS = null;
            break;
        case historyitem_GeometrySetPreset:
            this.preset = data.oldPr;
            break;
        }
    },
    Redo: function (data) {
        switch (data.Type) {
        case historyitem_GeometrySetParent:
            this.parent = data.newPr;
            break;
        case historyitem_GeometryAddAdj:
            this.gdLst[data.name] = parseInt(data.newVal);
            this.avLst[data.name] = true;
            if (this.parent && this.parent.handleUpdateGeometry) {
                this.parent.handleUpdateGeometry();
            }
            break;
        case historyitem_GeometryAddGuide:
            this.gdLstInfo.push({
                name: data.name,
                formula: data.formula,
                x: data.x,
                y: data.y,
                z: data.z
            });
            break;
        case historyitem_GeometryAddCnx:
            this.cnxLstInfo.push({
                ang: data.ang,
                x: data.x,
                y: data.y
            });
            break;
        case historyitem_GeometryAddHandleXY:
            this.ahXYLstInfo.push({
                gdRefX: data.gdRefX,
                minX: data.minX,
                maxX: data.maxX,
                gdRefY: data.gdRefY,
                minY: data.minY,
                maxY: data.maxY,
                posX: data.posX,
                posY: data.posY
            });
            break;
        case historyitem_GeometryAddHandlePolar:
            this.ahPolarLstInfo.push({
                gdRefAng: data.gdRefAng,
                minAng: data.minAng,
                maxAng: data.maxAng,
                gdRefR: data.gdRefR,
                minR: data.minR,
                maxR: data.maxR,
                posX: data.posX,
                posY: data.posY
            });
            break;
        case historyitem_GeometryAddPath:
            this.pathLst.push(data.newPr);
            break;
        case historyitem_GeometryAddRect:
            this.rectS = {
                l: data.l,
                t: data.t,
                r: data.r,
                b: data.b
            };
            break;
        case historyitem_GeometrySetPreset:
            this.preset = data.newPr;
            break;
        }
    },
    Save_Changes: function (data, w) {
        w.WriteLong(data.Type);
        switch (data.Type) {
        case historyitem_GeometrySetParent:
            writeObject(w, data.newPr);
            break;
        case historyitem_GeometryAddAdj:
            writeString(w, data.name);
            writeString(w, data.newVal);
            writeBool(w, data.oldAvVal);
            break;
        case historyitem_GeometryAddGuide:
            writeString(w, data.name);
            writeLong(w, data.formula);
            writeString(w, data.x);
            writeString(w, data.y);
            writeString(w, data.z);
            break;
        case historyitem_GeometryAddCnx:
            writeString(w, data.ang);
            writeString(w, data.x);
            writeString(w, data.y);
            break;
        case historyitem_GeometryAddHandleXY:
            writeString(w, data.gdRefX);
            writeString(w, data.minX);
            writeString(w, data.maxX);
            writeString(w, data.gdRefY);
            writeString(w, data.minY);
            writeString(w, data.maxY);
            writeString(w, data.posX);
            writeString(w, data.posY);
            break;
        case historyitem_GeometryAddHandlePolar:
            writeString(w, data.gdRefAng);
            writeString(w, data.minAng);
            writeString(w, data.maxAng);
            writeString(w, data.gdRefR);
            writeString(w, data.minR);
            writeString(w, data.maxR);
            writeString(w, data.posX);
            writeString(w, data.posY);
            break;
        case historyitem_GeometryAddPath:
            writeObject(w, data.newPr);
            break;
        case historyitem_GeometryAddRect:
            writeString(w, data.l);
            writeString(w, data.t);
            writeString(w, data.r);
            writeString(w, data.b);
            break;
        case historyitem_GeometrySetPreset:
            writeString(w, data.newPr);
            break;
        }
    },
    Load_Changes: function (r) {
        var type = r.GetLong();
        switch (type) {
        case historyitem_GeometrySetParent:
            this.parent = readObject(r);
            break;
        case historyitem_GeometryAddAdj:
            var name = readString(r);
            var val = readString(r);
            var oldAvVal = readBool(r);
            if (typeof name === "string" && typeof val === "string") {
                this.gdLst[name] = parseInt(val);
                this.avLst[name] = true;
            }
            if (oldAvVal) {
                if (this.parent && this.parent.handleUpdateGeometry) {
                    this.parent.handleUpdateGeometry();
                }
            }
            break;
        case historyitem_GeometryAddGuide:
            var name = readString(r);
            var formula = readLong(r);
            var x = readString(r);
            var y = readString(r);
            var z = readString(r);
            this.gdLstInfo.push({
                name: name,
                formula: formula,
                x: x,
                y: y,
                z: z
            });
            break;
        case historyitem_GeometryAddCnx:
            var ang = readString(r);
            var x = readString(r);
            var y = readString(r);
            this.cnxLstInfo.push({
                ang: ang,
                x: x,
                y: y
            });
            break;
        case historyitem_GeometryAddHandleXY:
            var gdRefX = readString(r);
            var minX = readString(r);
            var maxX = readString(r);
            var gdRefY = readString(r);
            var minY = readString(r);
            var maxY = readString(r);
            var posX = readString(r);
            var posY = readString(r);
            this.ahXYLstInfo.push({
                gdRefX: gdRefX,
                minX: minX,
                maxX: maxX,
                gdRefY: gdRefY,
                minY: minY,
                maxY: maxY,
                posX: posX,
                posY: posY
            });
            break;
        case historyitem_GeometryAddHandlePolar:
            var gdRefAng = readString(r);
            var minAng = readString(r);
            var maxAng = readString(r);
            var gdRefR = readString(r);
            var minR = readString(r);
            var maxR = readString(r);
            var posX = readString(r);
            var posY = readString(r);
            this.ahPolarLstInfo.push({
                gdRefAng: gdRefAng,
                minAng: minAng,
                maxAng: maxAng,
                gdRefR: gdRefR,
                minR: minR,
                maxR: maxR,
                posX: posX,
                posY: posY
            });
            break;
        case historyitem_GeometryAddPath:
            this.pathLst.push(readObject(r));
            break;
        case historyitem_GeometryAddRect:
            this.rectS = {};
            this.rectS.l = readString(r);
            this.rectS.t = readString(r);
            this.rectS.r = readString(r);
            this.rectS.b = readString(r);
            break;
        case historyitem_GeometrySetPreset:
            this.preset = readString(r);
            break;
        }
    },
    Recalculate: function (w, h) {
        this.gdLst["_3cd4"] = 16200000;
        this.gdLst["_3cd8"] = 8100000;
        this.gdLst["_5cd8"] = 13500000;
        this.gdLst["_7cd8"] = 18900000;
        this.gdLst["cd2"] = 10800000;
        this.gdLst["cd4"] = 5400000;
        this.gdLst["cd8"] = 2700000;
        this.gdLst["l"] = 0;
        this.gdLst["t"] = 0;
        this.gdLst["h"] = h;
        this.gdLst["b"] = h;
        this.gdLst["hd2"] = h / 2;
        this.gdLst["hd3"] = h / 3;
        this.gdLst["hd4"] = h / 4;
        this.gdLst["hd5"] = h / 5;
        this.gdLst["hd6"] = h / 6;
        this.gdLst["hd8"] = h / 8;
        this.gdLst["hd10"] = h / 10;
        this.gdLst["hd12"] = h / 12;
        this.gdLst["hd32"] = h / 32;
        this.gdLst["vc"] = h / 2;
        this.gdLst["w"] = w;
        this.gdLst["r"] = w;
        this.gdLst["wd2"] = w / 2;
        this.gdLst["wd3"] = w / 3;
        this.gdLst["wd4"] = w / 4;
        this.gdLst["wd5"] = w / 5;
        this.gdLst["wd6"] = w / 6;
        this.gdLst["wd8"] = w / 8;
        this.gdLst["wd10"] = w / 10;
        this.gdLst["wd12"] = w / 12;
        this.gdLst["wd32"] = w / 32;
        this.gdLst["hc"] = w / 2;
        this.gdLst["ls"] = Math.max(w, h);
        this.gdLst["ss"] = Math.min(w, h);
        this.gdLst["ssd2"] = this.gdLst["ss"] / 2;
        this.gdLst["ssd4"] = this.gdLst["ss"] / 4;
        this.gdLst["ssd6"] = this.gdLst["ss"] / 6;
        this.gdLst["ssd8"] = this.gdLst["ss"] / 8;
        this.gdLst["ssd16"] = this.gdLst["ss"] / 16;
        this.gdLst["ssd32"] = this.gdLst["ss"] / 32;
        CalculateGuideLst(this.gdLstInfo, this.gdLst);
        CalculateCnxLst(this.cnxLstInfo, this.cnxLst, this.gdLst);
        CalculateAhXYList(this.ahXYLstInfo, this.ahXYLst, this.gdLst);
        CalculateAhPolarList(this.ahPolarLstInfo, this.ahPolarLst, this.gdLst);
        for (var i = 0, n = this.pathLst.length; i < n; i++) {
            this.pathLst[i].recalculate(this.gdLst);
        }
        if (this.rectS != undefined) {
            this.rect = {};
            this.rect.l = this.gdLst[this.rectS.l];
            if (this.rect.l === undefined) {
                this.rect.l = parseInt(this.rectS.l);
            }
            this.rect.t = this.gdLst[this.rectS.t];
            if (this.rect.t === undefined) {
                this.rect.t = parseInt(this.rectS.t);
            }
            this.rect.r = this.gdLst[this.rectS.r];
            if (this.rect.r === undefined) {
                this.rect.r = parseInt(this.rectS.r);
            }
            this.rect.b = this.gdLst[this.rectS.b];
            if (this.rect.b === undefined) {
                this.rect.b = parseInt(this.rectS.b);
            }
        }
    },
    draw: function (shape_drawer) {
        if (shape_drawer.Graphics && shape_drawer.Graphics.bDrawSmart) {
            this.drawSmart(shape_drawer);
            return;
        }
        for (var i = 0, n = this.pathLst.length; i < n; ++i) {
            this.pathLst[i].draw(shape_drawer);
        }
    },
    drawSmart: function (shape_drawer) {
        for (var i = 0, n = this.pathLst.length; i < n; ++i) {
            this.pathLst[i].drawSmart(shape_drawer);
        }
    },
    check_bounds: function (checker) {
        for (var i = 0, n = this.pathLst.length; i < n; ++i) {
            this.pathLst[i].check_bounds(checker);
        }
    },
    drawAdjustments: function (drawingDocument, transform) {
        var _adjustments = this.ahXYLst;
        var _adj_count = _adjustments.length;
        var _adj_index;
        for (_adj_index = 0; _adj_index < _adj_count; ++_adj_index) {
            drawingDocument.DrawAdjustment(transform, _adjustments[_adj_index].posX, _adjustments[_adj_index].posY);
        }
        _adjustments = this.ahPolarLst;
        _adj_count = _adjustments.length;
        for (_adj_index = 0; _adj_index < _adj_count; ++_adj_index) {
            drawingDocument.DrawAdjustment(transform, _adjustments[_adj_index].posX, _adjustments[_adj_index].posY);
        }
    },
    canFill: function () {
        if (this.preset === "line") {
            return false;
        }
        for (var i = 0; i < this.pathLst.length; ++i) {
            if (this.pathLst[i].fill !== "none") {
                return true;
            }
        }
        return false;
    },
    setAdjustmentValue: function (ref1, value1, ref2, value2) {},
    setGuideValue: function (gdRef, gdValue) {
        if (isRealNumber(this.gdLst[gdRef])) {
            this.gdLst[gdRef] = gdValue;
        }
    },
    hit: function (x, y) {},
    hitInInnerArea: function (canvasContext, x, y) {
        var _path_list = this.pathLst;
        var _path_count = _path_list.length;
        var _path_index;
        for (_path_index = 0; _path_index < _path_count; ++_path_index) {
            if (_path_list[_path_index].hitInInnerArea(canvasContext, x, y) === true) {
                return true;
            }
        }
        return false;
    },
    hitInPath: function (canvasContext, x, y) {
        var _path_list = this.pathLst;
        var _path_count = _path_list.length;
        var _path_index;
        for (_path_index = 0; _path_index < _path_count; ++_path_index) {
            if (_path_list[_path_index].hitInPath(canvasContext, x, y) === true) {
                return true;
            }
        }
        return false;
    },
    hitToAdj: function (x, y, distanse) {
        var dx, dy;
        for (var i = 0; i < this.ahXYLst.length; i++) {
            dx = x - this.ahXYLst[i].posX;
            dy = y - this.ahXYLst[i].posY;
            if (Math.sqrt(dx * dx + dy * dy) < distanse) {
                return {
                    hit: true,
                    adjPolarFlag: false,
                    adjNum: i
                };
            }
        }
        for (i = 0; i < this.ahPolarLst.length; i++) {
            dx = x - this.ahPolarLst[i].posX;
            dy = y - this.ahPolarLst[i].posY;
            if (Math.sqrt(dx * dx + dy * dy) < distanse) {
                return {
                    hit: true,
                    adjPolarFlag: true,
                    adjNum: i
                };
            }
        }
        return {
            hit: false,
            adjPolarFlag: null,
            adjNum: null
        };
    },
    getArrayPolygons: function (epsilon) {
        var used_epsilon;
        if (typeof epsilon !== "number" || isNaN(epsilon)) {
            used_epsilon = APPROXIMATE_EPSILON;
        } else {
            used_epsilon = epsilon;
        }
        var arr_polygons = [];
        var cur_polygon = [];
        for (var path_index = 0; path_index < this.pathLst.length; ++path_index) {
            var arr_cur_path_commands = this.pathLst[path_index].ArrPathCommand;
            var last_command = null,
            last_point_x = null,
            last_point_y = null;
            var first_point_x = null,
            first_point_y = null;
            var bezier_polygon = null;
            for (var command_index = 0; command_index < arr_cur_path_commands.length; ++command_index) {
                var cur_command = arr_cur_path_commands[command_index];
                switch (cur_command.id) {
                case moveTo:
                    if (last_command === null || last_command.id === close) {
                        cur_polygon.push({
                            x: cur_command.X,
                            y: cur_command.Y
                        });
                        last_command = cur_command;
                        last_point_x = cur_command.X;
                        last_point_y = cur_command.Y;
                        first_point_x = cur_command.X;
                        first_point_y = cur_command.Y;
                    }
                    break;
                case lineTo:
                    cur_polygon.push({
                        x: cur_command.X,
                        y: cur_command.Y
                    });
                    last_command = cur_command;
                    last_point_x = cur_command.X;
                    last_point_y = cur_command.Y;
                    break;
                case bezier3:
                    bezier_polygon = partition_bezier3(last_point_x, last_point_y, cur_command.X0, cur_command.Y0, cur_command.X1, cur_command.Y1, used_epsilon);
                    for (var point_index = 1; point_index < bezier_polygon.length; ++point_index) {
                        cur_polygon.push(bezier_polygon[point_index]);
                    }
                    last_command = cur_command;
                    last_point_x = cur_command.X1;
                    last_point_y = cur_command.Y1;
                    break;
                case bezier4:
                    bezier_polygon = partition_bezier4(last_point_x, last_point_y, cur_command.X0, cur_command.Y0, cur_command.X1, cur_command.Y1, cur_command.X2, cur_command.Y2, used_epsilon);
                    for (point_index = 1; point_index < bezier_polygon.length; ++point_index) {
                        cur_polygon.push(bezier_polygon[point_index]);
                    }
                    last_command = cur_command;
                    last_point_x = cur_command.X2;
                    last_point_y = cur_command.Y2;
                    break;
                case arcTo:
                    var path_accumulator = new PathAccumulator();
                    ArcToCurvers(path_accumulator, cur_command.stX, cur_command.stY, cur_command.wR, cur_command.hR, cur_command.stAng, cur_command.swAng);
                    var arc_to_path_commands = path_accumulator.pathCommand;
                    for (var arc_to_path_index = 0; arc_to_path_index < arc_to_path_commands.length; ++arc_to_path_index) {
                        var cur_arc_to_command = arc_to_path_commands[arc_to_path_index];
                        switch (cur_arc_to_command.id) {
                        case moveTo:
                            cur_polygon.push({
                                x: cur_arc_to_command.X,
                                y: cur_arc_to_command.Y
                            });
                            last_command = cur_arc_to_command;
                            last_point_x = cur_arc_to_command.X;
                            last_point_y = cur_arc_to_command.Y;
                            break;
                        case bezier4:
                            bezier_polygon = partition_bezier4(last_point_x, last_point_y, cur_arc_to_command.X0, cur_arc_to_command.Y0, cur_arc_to_command.X1, cur_arc_to_command.Y1, cur_arc_to_command.X2, cur_arc_to_command.Y2, used_epsilon);
                            for (point_index = 0; point_index < bezier_polygon.length; ++point_index) {
                                cur_polygon.push(bezier_polygon[point_index]);
                            }
                            last_command = cur_arc_to_command;
                            last_point_x = cur_arc_to_command.X2;
                            last_point_y = cur_arc_to_command.Y2;
                            break;
                        }
                    }
                    break;
                case close:
                    if (last_command.id !== moveTo) {
                        if (cur_polygon.length >= 2) {
                            if (first_point_x !== null && first_point_y !== null) {
                                cur_polygon.push({
                                    x: first_point_x,
                                    y: first_point_y
                                });
                            }
                            arr_polygons.push(cur_polygon);
                        }
                        cur_polygon = [];
                        last_command = cur_command;
                    }
                    break;
                }
            }
            if (cur_polygon.length >= 2) {
                arr_polygons.push(cur_polygon);
            }
        }
        return arr_polygons;
    },
    getBounds: function () {}
};
function WriteGdInfo(Writer, gdInfo) {
    Writer.WriteString2(gdInfo.name);
    Writer.WriteLong(gdInfo.formula);
    var flag = typeof gdInfo.x === "string";
    Writer.WriteBool(flag);
    if (flag) {
        Writer.WriteString2(gdInfo.x);
    } else {
        return;
    }
    flag = typeof gdInfo.y === "string";
    Writer.WriteBool(flag);
    if (flag) {
        Writer.WriteString2(gdInfo.y);
    } else {
        return;
    }
    flag = typeof gdInfo.z === "string";
    Writer.WriteBool(flag);
    if (flag) {
        Writer.WriteString2(gdInfo.z);
    }
}
function ReadGdInfo(Reader) {
    var ret = {};
    ret.name = Reader.GetString2();
    ret.formula = Reader.GetLong();
    if (Reader.GetBool()) {
        ret.x = Reader.GetString2();
    } else {
        return;
    }
    if (Reader.GetBool()) {
        ret.y = Reader.GetString2();
    } else {
        return;
    }
    if (Reader.GetBool()) {
        ret.z = Reader.GetString2();
    }
}
function WriteObjectDouble(Writer, Object) {
    var field_count = 0;
    for (var key in Object) {
        ++field_count;
    }
    Writer.WriteLong(field_count);
    for (key in Object) {
        Writer.WriteString2(key);
        Writer.WriteDouble(Object[key]);
    }
}
function ReadObjectDouble(Reader) {
    var ret = {};
    var field_count = Reader.GetLong();
    for (var index = 0; index < field_count; ++index) {
        var key = Reader.GetString2();
        ret[key] = Reader.GetDouble();
    }
    return ret;
}
function WriteObjectString(Writer, Object) {
    var field_count = 0;
    for (var key in Object) {
        ++field_count;
    }
    Writer.WriteLong(field_count);
    for (key in Object) {
        Writer.WriteString2(key);
        Writer.WriteString2(Object[key]);
    }
}
function ReadObjectString(Reader) {
    var ret = {};
    var field_count = Reader.GetLong();
    for (var index = 0; index < field_count; ++index) {
        var key = Reader.GetString2();
        ret[key] = Reader.GetString2();
    }
    return ret;
}
function WriteObjectBool(Writer, Object) {
    var field_count = 0;
    for (var key in Object) {
        ++field_count;
    }
    Writer.WriteLong(field_count);
    for (key in Object) {
        Writer.WriteString2(key);
        Writer.WriteBool(Object[key]);
    }
}
function ReadObjectBool(Reader) {
    var ret = {};
    var field_count = Reader.GetLong();
    for (var index = 0; index < field_count; ++index) {
        var key = Reader.GetString2();
        ret[key] = Reader.GetBool();
    }
    return ret;
}
function PathAccumulator() {
    this.pathCommand = [];
}
PathAccumulator.prototype = {
    _m: function (x, y) {
        this.pathCommand.push({
            id: moveTo,
            X: x,
            Y: y
        });
    },
    _c: function (x0, y0, x1, y1, x2, y2) {
        this.pathCommand.push({
            id: bezier4,
            X0: x0,
            Y0: y0,
            X1: x1,
            Y1: y1,
            X2: x2,
            Y2: y2
        });
    }
};
function GraphEdge(point1, point2) {
    if (point1.y <= point2.y) {
        this.point1 = point1;
        this.point2 = point2;
    } else {
        this.point1 = point2;
        this.point2 = point1;
    }
    this.getIntersectionPointX = function (y) {
        var ret = [];
        if (this.point2.y < y || this.point1.y > y) {
            return ret;
        } else {
            if (this.point1.y === this.point2.y) {
                if (this.point1.x <= this.point2.x) {
                    ret.push(this.point1.x);
                    ret.push(this.point2.x);
                    return ret;
                } else {
                    ret.push(this.point2.x);
                    ret.push(this.point1.x);
                    return ret;
                }
            } else {
                if (! (this.point1.x === this.point2.x)) {
                    var ret_x = this.point1.x + ((y - this.point1.y) / (this.point2.y - this.point1.y)) * (this.point2.x - this.point1.x);
                    ret.push(ret_x);
                    return ret;
                } else {
                    ret.push(this.point1.x);
                    return ret;
                }
            }
        }
    };
}
function ComparisonEdgeByTopPoint(graphEdge1, graphEdge2) {
    return Math.min(graphEdge1.point1.y, graphEdge1.point2.y) - Math.min(graphEdge2.point1.y, graphEdge2.point2.y);
}