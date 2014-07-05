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
 var moveTo = 0,
lineTo = 1,
arcTo = 2,
bezier3 = 3,
bezier4 = 4,
close = 5;
var PATH_COMMAND_START = 257;
var PATH_COMMAND_END = 258;
var cToRad = Math.PI / 10800000;
var cToDeg = 1 / cToRad;
function Path(extrusionOk, fill, stroke, w, h) {
    this.ArrPathCommandInfo = new Array();
    this.ArrPathCommand = new Array();
    this.createDuplicate = function () {
        var duplicate = new Path(this.extrusionOk, this.fill, this.stroke, this.pathW, this.pathH);
        for (var i = 0; i < this.ArrPathCommandInfo.length; ++i) {
            duplicate.ArrPathCommandInfo[i] = clonePrototype(this.ArrPathCommandInfo[i]);
        }
        return duplicate;
    };
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
    var stroke2;
    if (stroke != undefined) {
        stroke2 = stroke;
    } else {
        stroke2 = true;
    }
    this.setStroke(stroke2);
    this.extrusionOk = extrusionOk || false;
    this.setFill(fill || "norm");
    this.setWH(w, h);
}
Path.prototype = {
    getObjectType: function () {
        return CLASS_TYPE_PATH;
    },
    Get_Id: function () {
        return this.Id;
    },
    Write_ToBinary2: function (writer) {
        writer.WriteBool(this.stroke);
        writer.WriteBool(this.extrusionOk);
        writer.WriteString2(this.fill);
        var flag = this.pathW != undefined;
        writer.WriteBool(flag);
        if (flag) {
            writer.WriteLong(this.pathW);
        }
        flag = this.pathH != undefined;
        writer.WriteBool(flag);
        if (flag) {
            writer.WriteLong(this.pathH);
        }
        flag = this.divPW != undefined;
        writer.WriteBool(flag);
        if (flag) {
            writer.WriteDouble(this.divPW);
        }
        flag = this.divPH != undefined;
        writer.WriteBool(flag);
        if (flag) {
            writer.WriteDouble(this.divPH);
        }
        var path_command_count = this.ArrPathCommandInfo.length;
        writer.WriteLong(path_command_count);
        var write_function = writer.WriteString2;
        for (var index = 0; index < path_command_count; ++index) {
            var c = this.ArrPathCommandInfo[index];
            switch (c.id) {
            case moveTo:
                case lineTo:
                writer.WriteLong(c.id);
                write_function.call(writer, c.X);
                write_function.call(writer, c.Y);
                break;
            case bezier3:
                writer.WriteLong(c.id);
                write_function.call(writer, c.X0);
                write_function.call(writer, c.Y0);
                write_function.call(writer, c.X1);
                write_function.call(writer, c.Y1);
                break;
            case bezier4:
                writer.WriteLong(c.id);
                write_function.call(writer, c.X0);
                write_function.call(writer, c.Y0);
                write_function.call(writer, c.X1);
                write_function.call(writer, c.Y1);
                write_function.call(writer, c.X2);
                write_function.call(writer, c.Y2);
                break;
            case arcTo:
                writer.WriteLong(c.id);
                write_function.call(writer, c.hR);
                write_function.call(writer, c.wR);
                write_function.call(writer, c.stAng);
                write_function.call(writer, c.swAng);
                break;
            case close:
                writer.WriteLong(c.id);
                break;
            }
        }
        for (index = 0; index < path_command_count; ++index) {
            WriteObjectLong(writer, this.ArrPathCommand[index]);
        }
    },
    Read_FromBinary2: function (Reader) {
        this.setStroke(Reader.GetBool());
        this.extrusionOk = Reader.GetBool();
        this.setFill(Reader.GetString2());
        var flag = Reader.GetBool();
        if (flag) {
            this.pathW = Reader.GetLong();
        }
        flag = Reader.GetBool();
        if (flag) {
            this.pathH = Reader.GetLong();
        }
        if (isRealNumber(this.pathH && this.pathW)) {
            this.setWH(this.pathW, this.pathH);
        }
        flag = Reader.GetBool();
        if (flag) {
            this.divPW = Reader.GetDouble();
        }
        flag = Reader.GetBool();
        if (flag) {
            this.divPH = Reader.GetDouble();
        }
        if (typeof this.pathW === "number") {
            this.divPW = 1 / this.pathW;
        }
        if (typeof this.pathH === "number") {
            this.divPH = 1 / this.pathH;
        }
        var path_command_count = Reader.GetLong();
        var read_function = Reader.GetString2;
        for (var index = 0; index < path_command_count; ++index) {
            var c = {};
            var id = Reader.GetLong();
            c.id = id;
            switch (id) {
            case moveTo:
                case lineTo:
                c.X = read_function.call(Reader);
                c.Y = read_function.call(Reader);
                for (var key in c) {
                    if (!isNaN(parseInt(c[key], 10))) {
                        c[key] = parseInt(c[key], 10);
                    }
                }
                if (id === moveTo) {
                    this.moveTo(c.X, c.Y);
                } else {
                    this.lnTo(c.X, c.Y);
                }
                break;
            case bezier3:
                c.X0 = read_function.call(Reader);
                c.Y0 = read_function.call(Reader);
                c.X1 = read_function.call(Reader);
                c.Y1 = read_function.call(Reader);
                for (var key in c) {
                    if (!isNaN(parseInt(c[key], 10))) {
                        c[key] = parseInt(c[key], 10);
                    }
                }
                this.quadBezTo(c.X0, c.Y0, c.X1, c.Y1);
                break;
            case bezier4:
                c.X0 = read_function.call(Reader);
                c.Y0 = read_function.call(Reader);
                c.X1 = read_function.call(Reader);
                c.Y1 = read_function.call(Reader);
                c.X2 = read_function.call(Reader);
                c.Y2 = read_function.call(Reader);
                for (var key in c) {
                    if (!isNaN(parseInt(c[key], 10))) {
                        c[key] = parseInt(c[key], 10);
                    }
                }
                this.cubicBezTo(c.X0, c.Y0, c.X1, c.Y1, c.X2, c.Y2);
                break;
            case arcTo:
                c.hR = read_function.call(Reader);
                c.wR = read_function.call(Reader);
                c.stAng = read_function.call(Reader);
                c.swAng = read_function.call(Reader);
                for (var key in c) {
                    if (!isNaN(parseInt(c[key], 10))) {
                        c[key] = parseInt(c[key], 10);
                    }
                }
                this.arcTo(c.wR, c.hR, c.stAng, c.swAng);
                break;
            case close:
                this.close();
                break;
            }
        }
        for (index = 0; index < path_command_count; ++index) {
            this.ArrPathCommand[index] = ReadObjectLong(Reader);
        }
    },
    setStroke: function (stroke) {
        var oldValue = this.stroke;
        var newValue = stroke;
        this.stroke = stroke;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Set_PathStroke, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
    },
    setFill: function (fill) {
        var oldValue = this.fill;
        var newValue = fill;
        this.fill = fill;
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Set_PathFill, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOSingleProp(oldValue, newValue)));
    },
    setWH: function (w, h) {
        var oldValue1 = this.pathW;
        var oldValue2 = this.pathH;
        var newValue1 = w;
        var newValue2 = h;
        this.pathW = w;
        this.pathH = h;
        if (this.pathW != undefined) {
            this.divPW = 1 / w;
            this.divPH = 1 / h;
        }
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Set_PathWH, null, null, new UndoRedoDataGraphicObjects(this.Get_Id(), new UndoRedoDataGOPairProps(oldValue1, oldValue2, newValue1, newValue2)));
    },
    moveTo: function (x, y) {
        if (!isNaN(parseInt(x, 10))) {
            x = parseInt(x, 10);
        }
        if (!isNaN(parseInt(y, 10))) {
            y = parseInt(y, 10);
        }
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Add_PathMoveTo, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataMoveToLineTo(x, y, true)), null);
        this.ArrPathCommandInfo.push({
            id: moveTo,
            X: x,
            Y: y
        });
    },
    lnTo: function (x, y) {
        if (!isNaN(parseInt(x, 10))) {
            x = parseInt(x, 10);
        }
        if (!isNaN(parseInt(y, 10))) {
            y = parseInt(y, 10);
        }
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Add_PathLineTo, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataMoveToLineTo(x, y, false)), null);
        this.ArrPathCommandInfo.push({
            id: lineTo,
            X: x,
            Y: y
        });
    },
    arcTo: function (wR, hR, stAng, swAng) {
        if (!isNaN(parseInt(wR, 10))) {
            wR = parseInt(wR, 10);
        }
        if (!isNaN(parseInt(hR, 10))) {
            hR = parseInt(hR, 10);
        }
        if (!isNaN(parseInt(stAng, 10))) {
            stAng = parseInt(stAng, 10);
        }
        if (!isNaN(parseInt(swAng, 10))) {
            swAng = parseInt(swAng, 10);
        }
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Add_PathArcTo, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataArcTo(wR, hR, stAng, swAng)), null);
        this.ArrPathCommandInfo.push({
            id: arcTo,
            wR: wR,
            hR: hR,
            stAng: stAng,
            swAng: swAng
        });
    },
    quadBezTo: function (x0, y0, x1, y1) {
        if (!isNaN(parseInt(x0, 10))) {
            x0 = parseInt(x0, 10);
        }
        if (!isNaN(parseInt(y0, 10))) {
            y0 = parseInt(y0, 10);
        }
        if (!isNaN(parseInt(x1, 10))) {
            x1 = parseInt(x1, 10);
        }
        if (!isNaN(parseInt(y1, 10))) {
            y1 = parseInt(y1, 10);
        }
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Add_PathQuadBezTo, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataQuadBezTo(x0, y0, x1, y1)), null);
        this.ArrPathCommandInfo.push({
            id: bezier3,
            X0: x0,
            Y0: y0,
            X1: x1,
            Y1: y1
        });
    },
    cubicBezTo: function (x0, y0, x1, y1, x2, y2) {
        if (!isNaN(parseInt(x0, 10))) {
            x0 = parseInt(x0, 10);
        }
        if (!isNaN(parseInt(y0, 10))) {
            y0 = parseInt(y0, 10);
        }
        if (!isNaN(parseInt(x1, 10))) {
            x1 = parseInt(x1, 10);
        }
        if (!isNaN(parseInt(y1, 10))) {
            y1 = parseInt(y1, 10);
        }
        if (!isNaN(parseInt(x2, 10))) {
            x2 = parseInt(x2, 10);
        }
        if (!isNaN(parseInt(y2, 10))) {
            y2 = parseInt(y2, 10);
        }
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Add_PathCubicBezTo, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataCubicBezTo(x0, y0, x1, y1, x2, y2)), null);
        this.ArrPathCommandInfo.push({
            id: bezier4,
            X0: x0,
            Y0: y0,
            X1: x1,
            Y1: y1,
            X2: x2,
            Y2: y2
        });
    },
    close: function () {
        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_Add_PathClose, null, null, new UndoRedoDataGraphicObjects(this.Id, new UndoRedoDataClosePath()), null);
        this.ArrPathCommandInfo.push({
            id: close
        });
    },
    init: function (gdLst) {
        if (this.ArrPathCommandInfo.length === this.ArrPathCommand.length) {
            this.ArrPathCommand.length = 0;
        }
        var ch, cw;
        if (this.pathW != undefined) {
            ch = (gdLst["h"] / this.pathH);
            cw = (gdLst["w"] / this.pathW);
        } else {
            ch = 1;
            cw = 1;
        }
        var APCI = this.ArrPathCommandInfo,
        n = APCI.length,
        cmd;
        var x0, y0, x1, y1, x2, y2, wR, hR, stAng, swAng, lastX, lastY;
        for (var i = 0; i < n; i++) {
            cmd = APCI[i];
            switch (cmd.id) {
            case moveTo:
                case lineTo:
                x0 = parseInt(cmd.X);
                if (isNaN(x0)) {
                    x0 = gdLst[cmd.X];
                }
                y0 = parseInt(cmd.Y);
                if (isNaN(y0)) {
                    y0 = gdLst[cmd.Y];
                }
                this.ArrPathCommand.push({
                    id: cmd.id,
                    X: x0 * cw,
                    Y: y0 * ch
                });
                lastX = x0 * cw;
                lastY = y0 * ch;
                break;
            case bezier3:
                x0 = parseInt(cmd.X0);
                if (isNaN(x0)) {
                    x0 = gdLst[cmd.X0];
                }
                y0 = parseInt(cmd.Y0);
                if (isNaN(y0)) {
                    y0 = gdLst[cmd.Y0];
                }
                x1 = parseInt(cmd.X1);
                if (isNaN(x1)) {
                    x1 = gdLst[cmd.X1];
                }
                y1 = parseInt(cmd.Y1);
                if (isNaN(y1)) {
                    y1 = gdLst[cmd.Y1];
                }
                this.ArrPathCommand.push({
                    id: bezier3,
                    X0: x0 * cw,
                    Y0: y0 * ch,
                    X1: x1 * cw,
                    Y1: y1 * ch
                });
                lastX = x1 * cw;
                lastY = y1 * ch;
                break;
            case bezier4:
                x0 = parseInt(cmd.X0);
                if (isNaN(x0)) {
                    x0 = gdLst[cmd.X0];
                }
                y0 = parseInt(cmd.Y0);
                if (isNaN(y0)) {
                    y0 = gdLst[cmd.Y0];
                }
                x1 = parseInt(cmd.X1);
                if (isNaN(x1)) {
                    x1 = gdLst[cmd.X1];
                }
                y1 = parseInt(cmd.Y1);
                if (isNaN(y1)) {
                    y1 = gdLst[cmd.Y1];
                }
                x2 = parseInt(cmd.X2);
                if (isNaN(x2)) {
                    x2 = gdLst[cmd.X2];
                }
                y2 = parseInt(cmd.Y2);
                if (isNaN(y2)) {
                    y2 = gdLst[cmd.Y2];
                }
                this.ArrPathCommand.push({
                    id: bezier4,
                    X0: x0 * cw,
                    Y0: y0 * ch,
                    X1: x1 * cw,
                    Y1: y1 * ch,
                    X2: x2 * cw,
                    Y2: y2 * ch
                });
                lastX = x2 * cw;
                lastY = y2 * ch;
                break;
            case arcTo:
                hR = parseInt(cmd.hR);
                if (isNaN(hR)) {
                    hR = gdLst[cmd.hR];
                }
                wR = parseInt(cmd.wR);
                if (isNaN(wR)) {
                    wR = gdLst[cmd.wR];
                }
                stAng = parseInt(cmd.stAng);
                if (isNaN(stAng)) {
                    stAng = gdLst[cmd.stAng];
                }
                swAng = parseInt(cmd.swAng);
                if (isNaN(swAng)) {
                    swAng = gdLst[cmd.swAng];
                }
                var a1 = stAng;
                var a2 = stAng + swAng;
                var a3 = swAng;
                stAng = Math.atan2(ch * Math.sin(a1 * cToRad), cw * Math.cos(a1 * cToRad)) / cToRad;
                swAng = Math.atan2(ch * Math.sin(a2 * cToRad), cw * Math.cos(a2 * cToRad)) / cToRad - stAng;
                if ((swAng > 0) && (a3 < 0)) {
                    swAng -= 21600000;
                }
                if ((swAng < 0) && (a3 > 0)) {
                    swAng += 21600000;
                }
                if (swAng == 0) {
                    swAng = 21600000;
                }
                var a = wR * cw;
                var b = hR * ch;
                var sin2 = Math.sin(stAng * cToRad);
                var cos2 = Math.cos(stAng * cToRad);
                var _xrad = cos2 / a;
                var _yrad = sin2 / b;
                var l = 1 / Math.sqrt(_xrad * _xrad + _yrad * _yrad);
                var xc = lastX - l * cos2;
                var yc = lastY - l * sin2;
                var sin1 = Math.sin((stAng + swAng) * cToRad);
                var cos1 = Math.cos((stAng + swAng) * cToRad);
                var _xrad1 = cos1 / a;
                var _yrad1 = sin1 / b;
                var l1 = 1 / Math.sqrt(_xrad1 * _xrad1 + _yrad1 * _yrad1);
                this.ArrPathCommand[i] = {
                    id: arcTo,
                    stX: lastX,
                    stY: lastY,
                    wR: wR * cw,
                    hR: hR * ch,
                    stAng: stAng * cToRad,
                    swAng: swAng * cToRad
                };
                lastX = xc + l1 * cos1;
                lastY = yc + l1 * sin1;
                break;
            case close:
                this.ArrPathCommand.push({
                    id: close
                });
                break;
            default:
                break;
            }
        }
    },
    recalculate: function (gdLst) {
        var ch, cw;
        if (this.pathW != undefined) {
            ch = (gdLst["h"] / this.pathH);
            cw = (gdLst["w"] / this.pathW);
        } else {
            ch = 1;
            cw = 1;
        }
        var APCI = this.ArrPathCommandInfo,
        n = APCI.length,
        cmd;
        var x0, y0, x1, y1, x2, y2, wR, hR, stAng, swAng, lastX, lastY;
        for (var i = 0; i < n; ++i) {
            cmd = APCI[i];
            switch (cmd.id) {
            case moveTo:
                case lineTo:
                x0 = gdLst[cmd.X];
                if (x0 === undefined) {
                    x0 = cmd.X;
                }
                y0 = gdLst[cmd.Y];
                if (y0 === undefined) {
                    y0 = cmd.Y;
                }
                this.ArrPathCommand[i] = {
                    id: cmd.id,
                    X: x0 * cw,
                    Y: y0 * ch
                };
                lastX = x0 * cw;
                lastY = y0 * ch;
                break;
            case bezier3:
                x0 = gdLst[cmd.X0];
                if (x0 === undefined) {
                    x0 = cmd.X0;
                }
                y0 = gdLst[cmd.Y0];
                if (y0 === undefined) {
                    y0 = cmd.Y0;
                }
                x1 = gdLst[cmd.X1];
                if (x1 === undefined) {
                    x1 = cmd.X1;
                }
                y1 = gdLst[cmd.Y1];
                if (y1 === undefined) {
                    y1 = cmd.Y1;
                }
                this.ArrPathCommand[i] = {
                    id: bezier3,
                    X0: x0 * cw,
                    Y0: y0 * ch,
                    X1: x1 * cw,
                    Y1: y1 * ch
                };
                lastX = x1 * cw;
                lastY = y1 * ch;
                break;
            case bezier4:
                x0 = gdLst[cmd.X0];
                if (x0 === undefined) {
                    x0 = cmd.X0;
                }
                y0 = gdLst[cmd.Y0];
                if (y0 === undefined) {
                    y0 = cmd.Y0;
                }
                x1 = gdLst[cmd.X1];
                if (x1 === undefined) {
                    x1 = cmd.X1;
                }
                y1 = gdLst[cmd.Y1];
                if (y1 === undefined) {
                    y1 = cmd.Y1;
                }
                x2 = gdLst[cmd.X2];
                if (x2 === undefined) {
                    x2 = cmd.X2;
                }
                y2 = gdLst[cmd.Y2];
                if (y2 === undefined) {
                    y2 = cmd.Y2;
                }
                this.ArrPathCommand[i] = {
                    id: bezier4,
                    X0: x0 * cw,
                    Y0: y0 * ch,
                    X1: x1 * cw,
                    Y1: y1 * ch,
                    X2: x2 * cw,
                    Y2: y2 * ch
                };
                lastX = x2 * cw;
                lastY = y2 * ch;
                break;
            case arcTo:
                hR = gdLst[cmd.hR];
                if (hR === undefined) {
                    hR = cmd.hR;
                }
                wR = gdLst[cmd.wR];
                if (wR === undefined) {
                    wR = cmd.wR;
                }
                stAng = gdLst[cmd.stAng];
                if (stAng === undefined) {
                    stAng = cmd.stAng;
                }
                swAng = gdLst[cmd.swAng];
                if (swAng === undefined) {
                    swAng = cmd.swAng;
                }
                var a1 = stAng;
                var a2 = stAng + swAng;
                var a3 = swAng;
                stAng = Math.atan2(ch * Math.sin(a1 * cToRad), cw * Math.cos(a1 * cToRad)) / cToRad;
                swAng = Math.atan2(ch * Math.sin(a2 * cToRad), cw * Math.cos(a2 * cToRad)) / cToRad - stAng;
                if ((swAng > 0) && (a3 < 0)) {
                    swAng -= 21600000;
                }
                if ((swAng < 0) && (a3 > 0)) {
                    swAng += 21600000;
                }
                if (swAng == 0) {
                    swAng = 21600000;
                }
                var a = wR * cw;
                var b = hR * ch;
                var sin2 = Math.sin(stAng * cToRad);
                var cos2 = Math.cos(stAng * cToRad);
                var _xrad = cos2 / a;
                var _yrad = sin2 / b;
                var l = 1 / Math.sqrt(_xrad * _xrad + _yrad * _yrad);
                var xc = lastX - l * cos2;
                var yc = lastY - l * sin2;
                var sin1 = Math.sin((stAng + swAng) * cToRad);
                var cos1 = Math.cos((stAng + swAng) * cToRad);
                var _xrad1 = cos1 / a;
                var _yrad1 = sin1 / b;
                var l1 = 1 / Math.sqrt(_xrad1 * _xrad1 + _yrad1 * _yrad1);
                this.ArrPathCommand[i] = {
                    id: arcTo,
                    stX: lastX,
                    stY: lastY,
                    wR: wR * cw,
                    hR: hR * ch,
                    stAng: stAng * cToRad,
                    swAng: swAng * cToRad
                };
                lastX = xc + l1 * cos1;
                lastY = yc + l1 * sin1;
                break;
            case close:
                this.ArrPathCommand[i] = {
                    id: close
                };
                break;
            default:
                break;
            }
        }
    },
    draw: function (shape_drawer) {
        if (shape_drawer.bIsCheckBounds === true && this.fill == "none") {
            return;
        }
        var bIsDrawLast = false;
        var path = this.ArrPathCommand;
        shape_drawer._s();
        for (var j = 0, l = path.length; j < l; ++j) {
            var cmd = path[j];
            switch (cmd.id) {
            case moveTo:
                bIsDrawLast = true;
                shape_drawer._m(cmd.X, cmd.Y);
                break;
            case lineTo:
                bIsDrawLast = true;
                shape_drawer._l(cmd.X, cmd.Y);
                break;
            case bezier3:
                bIsDrawLast = true;
                shape_drawer._c2(cmd.X0, cmd.Y0, cmd.X1, cmd.Y1);
                break;
            case bezier4:
                bIsDrawLast = true;
                shape_drawer._c(cmd.X0, cmd.Y0, cmd.X1, cmd.Y1, cmd.X2, cmd.Y2);
                break;
            case arcTo:
                bIsDrawLast = true;
                ArcToCurvers(shape_drawer, cmd.stX, cmd.stY, cmd.wR, cmd.hR, cmd.stAng, cmd.swAng);
                break;
            case close:
                shape_drawer._z();
                break;
            }
        }
        if (bIsDrawLast) {
            shape_drawer.drawFillStroke(true, this.fill, this.stroke && !shape_drawer.bIsNoStrokeAttack);
        }
        shape_drawer._e();
    },
    check_bounds: function (checker) {
        var path = this.ArrPathCommand;
        for (var j = 0, l = path.length; j < l; ++j) {
            var cmd = path[j];
            switch (cmd.id) {
            case moveTo:
                checker._m(cmd.X, cmd.Y);
                break;
            case lineTo:
                checker._l(cmd.X, cmd.Y);
                break;
            case bezier3:
                checker._c2(cmd.X0, cmd.Y0, cmd.X1, cmd.Y1);
                break;
            case bezier4:
                checker._c(cmd.X0, cmd.Y0, cmd.X1, cmd.Y1, cmd.X2, cmd.Y2);
                break;
            case arcTo:
                ArcToCurvers(checker, cmd.stX, cmd.stY, cmd.wR, cmd.hR, cmd.stAng, cmd.swAng);
                break;
            case close:
                checker._z();
                break;
            }
        }
    },
    hitInInnerArea: function (canvasContext, x, y) {
        if (this.fill === "none") {
            return false;
        }
        var _arr_commands = this.ArrPathCommand;
        var _commands_count = _arr_commands.length;
        var _command_index;
        var _command;
        canvasContext.beginPath();
        for (_command_index = 0; _command_index < _commands_count; ++_command_index) {
            _command = _arr_commands[_command_index];
            switch (_command.id) {
            case moveTo:
                canvasContext.moveTo(_command.X, _command.Y);
                break;
            case lineTo:
                canvasContext.lineTo(_command.X, _command.Y);
                break;
            case arcTo:
                ArcToOnCanvas(canvasContext, _command.stX, _command.stY, _command.wR, _command.hR, _command.stAng, _command.swAng);
                break;
            case bezier3:
                canvasContext.quadraticCurveTo(_command.X0, _command.Y0, _command.X1, _command.Y1);
                break;
            case bezier4:
                canvasContext.bezierCurveTo(_command.X0, _command.Y0, _command.X1, _command.Y1, _command.X2, _command.Y2);
                break;
            case close:
                canvasContext.closePath();
                if (canvasContext.isPointInPath(x, y)) {
                    return true;
                }
            }
        }
        return false;
    },
    hitInPath: function (canvasContext, x, y) {
        var _arr_commands = this.ArrPathCommand;
        var _commands_count = _arr_commands.length;
        var _command_index;
        var _command;
        var _last_x, _last_y;
        var _begin_x, _begin_y;
        for (_command_index = 0; _command_index < _commands_count; ++_command_index) {
            _command = _arr_commands[_command_index];
            switch (_command.id) {
            case moveTo:
                _last_x = _command.X;
                _last_y = _command.Y;
                _begin_x = _command.X;
                _begin_y = _command.Y;
                break;
            case lineTo:
                if (HitInLine(canvasContext, x, y, _last_x, _last_y, _command.X, _command.Y)) {
                    return true;
                }
                _last_x = _command.X;
                _last_y = _command.Y;
                break;
            case arcTo:
                if (HitToArc(canvasContext, x, y, _command.stX, _command.stY, _command.wR, _command.hR, _command.stAng, _command.swAng)) {
                    return true;
                }
                _last_x = (_command.stX - _command.wR * Math.cos(_command.stAng) + _command.wR * Math.cos(_command.swAng));
                _last_y = (_command.stY - _command.hR * Math.sin(_command.stAng) + _command.hR * Math.sin(_command.swAng));
                break;
            case bezier3:
                if (HitInBezier3(canvasContext, x, y, _last_x, _last_y, _command.X0, _command.Y0, _command.X1, _command.Y1)) {
                    return true;
                }
                _last_x = _command.X1;
                _last_y = _command.Y1;
                break;
            case bezier4:
                if (HitInBezier4(canvasContext, x, y, _last_x, _last_y, _command.X0, _command.Y0, _command.X1, _command.Y1, _command.X2, _command.Y2)) {
                    return true;
                }
                _last_x = _command.X2;
                _last_y = _command.Y2;
                break;
            case close:
                if (HitInLine(canvasContext, x, y, _last_x, _last_y, _begin_x, _begin_y)) {
                    return true;
                }
            }
        }
        return false;
    },
    calculateWrapPolygon: function (epsilon, graphics) {
        var arr_polygons = [];
        var cur_polygon = [];
        var path_commands = this.ArrPathCommand;
        var path_commands_count = path_commands.length;
        var last_x, last_y;
        for (var index = 0; index < path_commands_count; ++index) {
            var cur_command = path_commands[index];
            switch (cur_command.id) {
            case moveTo:
                case lineTo:
                cur_polygon.push({
                    x: cur_command.X,
                    y: cur_command.Y
                });
                last_x = cur_command.X;
                last_y = cur_command.Y;
                break;
            case bezier3:
                cur_polygon = cur_polygon.concat(partition_bezier3(last_x, last_y, cur_command.X0, cur_command.Y0, cur_command.X1, cur_command.Y1, epsilon));
                last_x = cur_command.X1;
                last_y = cur_command.Y1;
                break;
            case bezier4:
                cur_polygon = cur_polygon.concat(partition_bezier4(last_x, last_y, cur_command.X0, cur_command.Y0, cur_command.X1, cur_command.Y1, cur_command.X2, cur_command.Y2, epsilon));
                last_x = cur_command.X2;
                last_y = cur_command.Y2;
                break;
            case arcTo:
                var arr_curve_bezier = getArrayPointsCurveBezierAtArcTo(last_x, last_y, cur_command.stX, cur_command.stY, cur_command.wR, cur_command.hR, cur_command.stAng, cur_command.swAng);
                if (arr_curve_bezier.length > 0) {
                    last_x = arr_curve_bezier[arr_curve_bezier.length - 1].x4;
                    last_y = arr_curve_bezier[arr_curve_bezier.length - 1].y4;
                    for (var i = 0; i < arr_curve_bezier.length; ++i) {
                        var cur_curve_bezier = arr_curve_bezier[i];
                        cur_polygon = cur_polygon.concat(partition_bezier4(cur_curve_bezier.x0, cur_curve_bezier.y0, cur_curve_bezier.x1, cur_curve_bezier.y1, cur_curve_bezier.x2, cur_curve_bezier.y2, cur_curve_bezier.x3, cur_curve_bezier.y3, epsilon));
                    }
                }
                break;
            case close:
                arr_polygons.push(cur_polygon);
                cur_polygon = [];
            }
        }
        for (i = 0; i < arr_polygons.length; ++i) {
            var cur_polygon = arr_polygons[i];
            graphics._m(cur_polygon[0].x, cur_polygon[0].y);
            for (var j = 0; j < cur_polygon.length; ++j) {
                graphics._l(cur_polygon[j].x, cur_polygon[j].y);
            }
            graphics._z();
            graphics.ds();
        }
    },
    Undo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_Add_PathMoveTo:
            case historyitem_AutoShapes_Add_PathLineTo:
            case historyitem_AutoShapes_Add_PathArcTo:
            case historyitem_AutoShapes_Add_PathQuadBezTo:
            case historyitem_AutoShapes_Add_PathCubicBezTo:
            case historyitem_AutoShapes_Add_PathClose:
            this.ArrPathCommandInfo.splice(this.ArrPathCommandInfo.length - 1, 1);
            break;
        }
    },
    Redo: function (type, data) {
        switch (type) {
        case historyitem_AutoShapes_Add_PathMoveTo:
            this.ArrPathCommandInfo.push({
                id: moveTo,
                X: data.x,
                Y: data.y
            });
            break;
        case historyitem_AutoShapes_Add_PathLineTo:
            this.ArrPathCommandInfo.push({
                id: lineTo,
                X: data.x,
                Y: data.y
            });
            break;
        case historyitem_AutoShapes_Add_PathQuadBezTo:
            this.ArrPathCommandInfo.push({
                id: bezier3,
                X0: data.x0,
                Y0: data.y0,
                X1: data.x1,
                Y1: data.y1
            });
            break;
        case historyitem_AutoShapes_Add_PathCubicBezTo:
            this.ArrPathCommandInfo.push({
                id: bezier4,
                X0: data.x0,
                Y0: data.y0,
                X1: data.x1,
                Y1: data.y1,
                X2: data.x2,
                Y2: data.y2
            });
            break;
        case historyitem_AutoShapes_Add_PathArcTo:
            this.ArrPathCommandInfo.push({
                id: arcTo,
                wR: data.wR,
                hR: data.hR,
                stAng: data.stAng,
                swAng: data.swAng
            });
            break;
        case historyitem_AutoShapes_Add_PathClose:
            this.ArrPathCommandInfo.push({
                id: close
            });
            break;
        case historyitem_AutoShapes_Set_PathStroke:
            this.stroke = data.newValue;
            break;
        case historyitem_AutoShapes_Set_PathFill:
            this.fill = data.newValue;
            break;
        case historyitem_AutoShapes_Set_PathWH:
            this.pathW = data.newValue1;
            this.pathH = data.newValue2;
            if (this.pathW != undefined) {
                this.divPW = 1 / this.pathW;
                this.divPH = 1 / this.pathH;
            }
            break;
        }
    }
};
function partition_bezier3(x0, y0, x1, y1, x2, y2, epsilon) {
    var dx01 = x1 - x0;
    var dy01 = y1 - y0;
    var dx12 = x2 - x1;
    var dy12 = y2 - y1;
    var r01 = Math.sqrt(dx01 * dx01 + dy01 * dy01);
    var r12 = Math.sqrt(dx12 * dx12 + dy12 * dy12);
    if (Math.max(r01, r12) < epsilon) {
        return [{
            x: x0,
            y: y0
        },
        {
            x: x1,
            y: y1
        },
        {
            x: x2,
            y: y2
        }];
    }
    var x01 = (x0 + x1) * 0.5;
    var y01 = (y0 + y1) * 0.5;
    var x12 = (x1 + x2) * 0.5;
    var y12 = (y1 + y2) * 0.5;
    var x012 = (x01 + x12) * 0.5;
    var y012 = (y01 + y12) * 0.5;
    return partition_bezier3(x0, y0, x01, y01, x012, y012, epsilon).concat(partition_bezier3(x012, y012, x12, y12, x2, y2, epsilon));
}
function partition_bezier4(x0, y0, x1, y1, x2, y2, x3, y3, epsilon) {
    var dx01 = x1 - x0;
    var dy01 = y1 - y0;
    var dx12 = x2 - x1;
    var dy12 = y2 - y1;
    var dx23 = x3 - x2;
    var dy23 = y3 - y2;
    var r01 = Math.sqrt(dx01 * dx01 + dy01 * dy01);
    var r12 = Math.sqrt(dx12 * dx12 + dy12 * dy12);
    var r23 = Math.sqrt(dx23 * dx23 + dy23 * dy23);
    if (Math.max(r01, r12, r23) < epsilon) {
        return [{
            x: x0,
            y: y0
        },
        {
            x: x1,
            y: y1
        },
        {
            x: x2,
            y: y2
        },
        {
            x: x3,
            y: y3
        }];
    }
    var x01 = (x0 + x1) * 0.5;
    var y01 = (y0 + y1) * 0.5;
    var x12 = (x1 + x2) * 0.5;
    var y12 = (y1 + y2) * 0.5;
    var x23 = (x2 + x3) * 0.5;
    var y23 = (y2 + y3) * 0.5;
    var x012 = (x01 + x12) * 0.5;
    var y012 = (y01 + y12) * 0.5;
    var x123 = (x12 + x23) * 0.5;
    var y123 = (y12 + y23) * 0.5;
    var x0123 = (x012 + x123) * 0.5;
    var y0123 = (y012 + y123) * 0.5;
    return partition_bezier4(x0, y0, x01, y01, x012, y012, x0123, y0123, epsilon).concat(partition_bezier4(x0123, y0123, x123, y123, x23, y23, x3, y3, epsilon));
}