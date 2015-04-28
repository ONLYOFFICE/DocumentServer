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
var cToRad2 = (Math.PI / 60000) / 180;
function Path() {
    this.stroke = null;
    this.extrusionOk = null;
    this.fill = null;
    this.pathH = null;
    this.pathW = null;
    this.ArrPathCommandInfo = [];
    this.ArrPathCommand = [];
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
Path.prototype = {
    Get_Id: function () {
        return this.Id;
    },
    getObjectType: function () {
        return historyitem_type_Path;
    },
    Write_ToBinary2: function (w) {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },
    Read_FromBinary2: function (r) {
        this.Id = r.GetString2();
    },
    Refresh_RecalcData: function () {},
    createDuplicate: function () {
        var p = new Path();
        p.setStroke(this.stroke);
        p.setExtrusionOk(this.extrusionOk);
        p.setFill(this.fill);
        p.setPathH(this.pathH);
        p.setPathW(this.pathW);
        for (var i = 0; i < this.ArrPathCommandInfo.length; ++i) {
            var command = this.ArrPathCommandInfo[i];
            switch (command.id) {
            case moveTo:
                case lineTo:
                var x = command.X;
                var y = command.Y;
                p.addPathCommand({
                    id: command.id,
                    X: x,
                    Y: y
                });
                break;
            case bezier3:
                var X0 = command.X0;
                var Y0 = command.Y0;
                var X1 = command.X1;
                var Y1 = command.Y1;
                p.addPathCommand({
                    id: bezier3,
                    X0: X0,
                    Y0: Y0,
                    X1: X1,
                    Y1: Y1
                });
                break;
            case bezier4:
                var X0 = command.X0;
                var Y0 = command.Y0;
                var X1 = command.X1;
                var Y1 = command.Y1;
                var X2 = command.X2;
                var Y2 = command.Y2;
                p.addPathCommand({
                    id: bezier4,
                    X0: X0,
                    Y0: Y0,
                    X1: X1,
                    Y1: Y1,
                    X2: X2,
                    Y2: Y2
                });
                break;
            case arcTo:
                var hR = command.hR;
                var wR = command.wR;
                var stAng = command.stAng;
                var swAng = command.swAng;
                p.addPathCommand({
                    id: arcTo,
                    hR: hR,
                    wR: wR,
                    stAng: stAng,
                    swAng: swAng
                });
                break;
            case close:
                p.addPathCommand({
                    id: close
                });
                break;
            }
        }
        return p;
    },
    setStroke: function (pr) {
        History.Add(this, {
            Type: historyitem_PathSetStroke,
            oldPr: this.stroke,
            newPr: pr
        });
        this.stroke = pr;
    },
    setExtrusionOk: function (pr) {
        History.Add(this, {
            Type: historyitem_PathSetExtrusionOk,
            oldPr: this.extrusionOk,
            newPr: pr
        });
        this.extrusionOk = pr;
    },
    setFill: function (pr) {
        History.Add(this, {
            Type: historyitem_PathSetFill,
            oldPr: this.fill,
            newPr: pr
        });
        this.fill = pr;
    },
    setPathH: function (pr) {
        History.Add(this, {
            Type: historyitem_PathSetPathH,
            oldPr: this.pathH,
            newPr: pr
        });
        this.pathH = pr;
    },
    setPathW: function (pr) {
        History.Add(this, {
            Type: historyitem_PathSetPathW,
            oldPr: this.pathW,
            newPr: pr
        });
        this.pathW = pr;
    },
    addPathCommand: function (cmd) {
        History.Add(this, {
            Type: historyitem_PathAddPathCommand,
            newPr: cmd
        });
        this.ArrPathCommandInfo.push(cmd);
    },
    moveTo: function (x, y) {
        this.addPathCommand({
            id: moveTo,
            X: x,
            Y: y
        });
    },
    lnTo: function (x, y) {
        this.addPathCommand({
            id: lineTo,
            X: x,
            Y: y
        });
    },
    arcTo: function (wR, hR, stAng, swAng) {
        this.addPathCommand({
            id: arcTo,
            wR: wR,
            hR: hR,
            stAng: stAng,
            swAng: swAng
        });
    },
    quadBezTo: function (x0, y0, x1, y1) {
        this.addPathCommand({
            id: bezier3,
            X0: x0,
            Y0: y0,
            X1: x1,
            Y1: y1
        });
    },
    cubicBezTo: function (x0, y0, x1, y1, x2, y2) {
        this.addPathCommand({
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
        this.addPathCommand({
            id: close
        });
    },
    Undo: function (data) {
        switch (data.Type) {
        case historyitem_PathSetStroke:
            this.stroke = data.oldPr;
            break;
        case historyitem_PathSetExtrusionOk:
            this.extrusionOk = data.oldPr;
            break;
        case historyitem_PathSetFill:
            this.fill = data.oldPr;
            break;
        case historyitem_PathSetPathH:
            this.pathH = data.oldPr;
            break;
        case historyitem_PathSetPathW:
            this.pathW = data.oldPr;
            break;
        case historyitem_PathAddPathCommand:
            this.ArrPathCommandInfo.splice(this.ArrPathCommandInfo.length - 1, 1);
        }
    },
    Redo: function (data) {
        switch (data.Type) {
        case historyitem_PathSetStroke:
            this.stroke = data.newPr;
            break;
        case historyitem_PathSetExtrusionOk:
            this.extrusionOk = data.newPr;
            break;
        case historyitem_PathSetFill:
            this.fill = data.newPr;
            break;
        case historyitem_PathSetPathH:
            this.pathH = data.newPr;
            break;
        case historyitem_PathSetPathW:
            this.pathW = data.newPr;
            break;
        case historyitem_PathAddPathCommand:
            this.ArrPathCommandInfo.push(data.newPr);
        }
    },
    Save_Changes: function (data, w) {
        w.WriteLong(data.Type);
        switch (data.Type) {
        case historyitem_PathSetStroke:
            case historyitem_PathSetExtrusionOk:
            writeBool(w, data.newPr);
            break;
        case historyitem_PathSetFill:
            writeString(w, data.newPr);
            break;
        case historyitem_PathSetPathH:
            case historyitem_PathSetPathW:
            writeLong(w, data.newPr);
            break;
        case historyitem_PathAddPathCommand:
            switch (data.newPr.id) {
            case moveTo:
                case lineTo:
                w.WriteBool(true);
                writeLong(w, data.newPr.id);
                writeString(w, data.newPr.X);
                writeString(w, data.newPr.Y);
                break;
            case bezier3:
                w.WriteBool(true);
                writeLong(w, data.newPr.id);
                writeString(w, data.newPr.X0);
                writeString(w, data.newPr.Y0);
                writeString(w, data.newPr.X1);
                writeString(w, data.newPr.Y1);
                break;
            case bezier4:
                w.WriteBool(true);
                writeLong(w, data.newPr.id);
                writeString(w, data.newPr.X0);
                writeString(w, data.newPr.Y0);
                writeString(w, data.newPr.X1);
                writeString(w, data.newPr.Y1);
                writeString(w, data.newPr.X2);
                writeString(w, data.newPr.Y2);
                break;
            case arcTo:
                w.WriteBool(true);
                writeLong(w, data.newPr.id);
                writeString(w, data.newPr.hR);
                writeString(w, data.newPr.wR);
                writeString(w, data.newPr.stAng);
                writeString(w, data.newPr.swAng);
                break;
            case close:
                w.WriteBool(true);
                writeLong(w, data.newPr.id);
                break;
            }
        }
    },
    Load_Changes: function (r) {
        var type = r.GetLong();
        switch (type) {
        case historyitem_PathSetStroke:
            this.stroke = readBool(r);
            break;
        case historyitem_PathSetExtrusionOk:
            this.extrusionOk = readBool(r);
            break;
        case historyitem_PathSetFill:
            this.fill = readString(r);
            break;
        case historyitem_PathSetPathH:
            this.pathH = readLong(r);
            break;
        case historyitem_PathSetPathW:
            this.pathW = readLong(r);
            break;
        case historyitem_PathAddPathCommand:
            if (r.GetBool()) {
                var command_id = readLong(r);
                switch (command_id) {
                case moveTo:
                    case lineTo:
                    var x = readString(r);
                    var y = readString(r);
                    this.ArrPathCommandInfo.push({
                        id: command_id,
                        X: x,
                        Y: y
                    });
                    break;
                case bezier3:
                    var X0 = readString(r);
                    var Y0 = readString(r);
                    var X1 = readString(r);
                    var Y1 = readString(r);
                    this.ArrPathCommandInfo.push({
                        id: bezier3,
                        X0: X0,
                        Y0: Y0,
                        X1: X1,
                        Y1: Y1
                    });
                    break;
                case bezier4:
                    var X0 = readString(r);
                    var Y0 = readString(r);
                    var X1 = readString(r);
                    var Y1 = readString(r);
                    var X2 = readString(r);
                    var Y2 = readString(r);
                    this.ArrPathCommandInfo.push({
                        id: bezier4,
                        X0: X0,
                        Y0: Y0,
                        X1: X1,
                        Y1: Y1,
                        X2: X2,
                        Y2: Y2
                    });
                    break;
                case arcTo:
                    var hR = readString(r);
                    var wR = readString(r);
                    var stAng = readString(r);
                    var swAng = readString(r);
                    this.ArrPathCommandInfo.push({
                        id: arcTo,
                        hR: hR,
                        wR: wR,
                        stAng: stAng,
                        swAng: swAng
                    });
                    break;
                case close:
                    this.ArrPathCommandInfo.push({
                        id: close
                    });
                    break;
                }
            }
        }
    },
    recalculate: function (gdLst) {
        var ch, cw;
        if (this.pathW != undefined) {
            if (this.pathW > MOVE_DELTA) {
                cw = (gdLst["w"] / this.pathW);
            } else {
                cw = 0;
            }
        } else {
            cw = 1;
        }
        if (this.pathH != undefined) {
            if (this.pathH > MOVE_DELTA) {
                ch = (gdLst["h"] / this.pathH);
            } else {
                ch = 0;
            }
        } else {
            ch = 1;
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
                    x0 = parseInt(cmd.X, 10);
                }
                y0 = gdLst[cmd.Y];
                if (y0 === undefined) {
                    y0 = parseInt(cmd.Y, 10);
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
                    x0 = parseInt(cmd.X0, 10);
                }
                y0 = gdLst[cmd.Y0];
                if (y0 === undefined) {
                    y0 = parseInt(cmd.Y0, 10);
                }
                x1 = gdLst[cmd.X1];
                if (x1 === undefined) {
                    x1 = parseInt(cmd.X1, 10);
                }
                y1 = gdLst[cmd.Y1];
                if (y1 === undefined) {
                    y1 = parseInt(cmd.Y1, 10);
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
                    x0 = parseInt(cmd.X0, 10);
                }
                y0 = gdLst[cmd.Y0];
                if (y0 === undefined) {
                    y0 = parseInt(cmd.Y0, 10);
                }
                x1 = gdLst[cmd.X1];
                if (x1 === undefined) {
                    x1 = parseInt(cmd.X1, 10);
                }
                y1 = gdLst[cmd.Y1];
                if (y1 === undefined) {
                    y1 = parseInt(cmd.Y1, 10);
                }
                x2 = gdLst[cmd.X2];
                if (x2 === undefined) {
                    x2 = parseInt(cmd.X2, 10);
                }
                y2 = gdLst[cmd.Y2];
                if (y2 === undefined) {
                    y2 = parseInt(cmd.Y2, 10);
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
                    hR = parseInt(cmd.hR, 10);
                }
                wR = gdLst[cmd.wR];
                if (wR === undefined) {
                    wR = parseInt(cmd.wR, 10);
                }
                stAng = gdLst[cmd.stAng];
                if (stAng === undefined) {
                    stAng = parseInt(cmd.stAng, 10);
                }
                swAng = gdLst[cmd.swAng];
                if (swAng === undefined) {
                    swAng = parseInt(cmd.swAng, 10);
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
                if (swAng == 0 && a3 != 0) {
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
    isSmartLine: function () {
        if (this.ArrPathCommandInfo.length != 2) {
            return false;
        }
        if (this.ArrPathCommandInfo[0].id == moveTo && this.ArrPathCommandInfo[1].id == lineTo) {
            if (Math.abs(this.ArrPathCommandInfo[0].X - this.ArrPathCommandInfo[1].X) < 0.0001) {
                return true;
            }
            if (Math.abs(this.ArrPathCommandInfo[0].Y - this.ArrPathCommandInfo[1].Y) < 0.0001) {
                return true;
            }
        }
        return false;
    },
    isSmartRect: function () {
        if (this.ArrPathCommandInfo.length != 5) {
            return false;
        }
        if (this.ArrPathCommandInfo[0].id != moveTo || this.ArrPathCommandInfo[1].id != lineTo || this.ArrPathCommandInfo[2].id != lineTo || this.ArrPathCommandInfo[3].id != lineTo || (this.ArrPathCommandInfo[4].id != lineTo && this.ArrPathCommandInfo[4].id != close)) {
            return false;
        }
        var _float_eps = 0.0001;
        if (Math.abs(this.ArrPathCommandInfo[0].X - this.ArrPathCommandInfo[1].X) < _float_eps) {
            if (Math.abs(this.ArrPathCommandInfo[1].Y - this.ArrPathCommandInfo[2].Y) < _float_eps) {
                if (Math.abs(this.ArrPathCommandInfo[2].X - this.ArrPathCommandInfo[3].X) < _float_eps && Math.abs(this.ArrPathCommandInfo[3].Y - this.ArrPathCommandInfo[0].Y) < _float_eps) {
                    if (this.ArrPathCommandInfo[4].id == close) {
                        return true;
                    }
                    if (Math.abs(this.ArrPathCommandInfo[0].X - this.ArrPathCommandInfo[4].X) < _float_eps && Math.abs(this.ArrPathCommandInfo[0].Y - this.ArrPathCommandInfo[4].Y) < _float_eps) {
                        return true;
                    }
                }
            }
        } else {
            if (Math.abs(this.ArrPathCommandInfo[0].Y - this.ArrPathCommandInfo[1].Y) < _float_eps) {
                if (Math.abs(this.ArrPathCommandInfo[1].X - this.ArrPathCommandInfo[2].X) < _float_eps) {
                    if (Math.abs(this.ArrPathCommandInfo[2].Y - this.ArrPathCommandInfo[3].Y) < _float_eps && Math.abs(this.ArrPathCommandInfo[3].X - this.ArrPathCommandInfo[0].X) < _float_eps) {
                        if (this.ArrPathCommandInfo[4].id == close) {
                            return true;
                        }
                        if (Math.abs(this.ArrPathCommandInfo[0].X - this.ArrPathCommandInfo[4].X) < _float_eps && Math.abs(this.ArrPathCommandInfo[0].Y - this.ArrPathCommandInfo[4].Y) < _float_eps) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    },
    drawSmart: function (shape_drawer) {
        var _graphics = shape_drawer.Graphics;
        var _full_trans = _graphics.m_oFullTransform;
        if (!_graphics || !_full_trans || undefined == _graphics.m_bIntegerGrid) {
            return this.draw(shape_drawer);
        }
        var bIsTransformed = (_full_trans.shx == 0 && _full_trans.shy == 0) ? false : true;
        if (bIsTransformed) {
            return this.draw(shape_drawer);
        }
        var isLine = this.isSmartLine();
        var isRect = false;
        if (!isLine) {
            isRect = this.isSmartRect();
        }
        if (!isLine && !isRect) {
            return this.draw(shape_drawer);
        }
        var _old_int = _graphics.m_bIntegerGrid;
        if (false == _old_int) {
            _graphics.SetIntegerGrid(true);
        }
        var dKoefMMToPx = Math.max(_graphics.m_oCoordTransform.sx, 0.001);
        var _ctx = _graphics.m_oContext;
        var bIsStroke = (shape_drawer.bIsNoStrokeAttack || (this.stroke !== true)) ? false : true;
        var bIsEven = false;
        if (bIsStroke) {
            var _lineWidth = Math.max((shape_drawer.StrokeWidth * dKoefMMToPx + 0.5) >> 0, 1);
            _ctx.lineWidth = _lineWidth;
            if (_lineWidth & 1 == 1) {
                bIsEven = true;
            }
        }
        var bIsDrawLast = false;
        var path = this.ArrPathCommand;
        shape_drawer._s();
        if (!isRect) {
            for (var j = 0, l = path.length; j < l; ++j) {
                var cmd = path[j];
                switch (cmd.id) {
                case moveTo:
                    bIsDrawLast = true;
                    var _x = (_full_trans.TransformPointX(cmd.X, cmd.Y)) >> 0;
                    var _y = (_full_trans.TransformPointY(cmd.X, cmd.Y)) >> 0;
                    if (bIsEven) {
                        _x -= 0.5;
                        _y -= 0.5;
                    }
                    _ctx.moveTo(_x, _y);
                    break;
                case lineTo:
                    bIsDrawLast = true;
                    var _x = (_full_trans.TransformPointX(cmd.X, cmd.Y)) >> 0;
                    var _y = (_full_trans.TransformPointY(cmd.X, cmd.Y)) >> 0;
                    if (bIsEven) {
                        _x -= 0.5;
                        _y -= 0.5;
                    }
                    _ctx.lineTo(_x, _y);
                    break;
                case close:
                    _ctx.closePath();
                    break;
                }
            }
        } else {
            var minX = 100000;
            var minY = 100000;
            var maxX = -100000;
            var maxY = -100000;
            bIsDrawLast = true;
            for (var j = 0, l = path.length; j < l; ++j) {
                var cmd = path[j];
                switch (cmd.id) {
                case moveTo:
                    case lineTo:
                    if (minX > cmd.X) {
                        minX = cmd.X;
                    }
                    if (minY > cmd.Y) {
                        minY = cmd.Y;
                    }
                    if (maxX < cmd.X) {
                        maxX = cmd.X;
                    }
                    if (maxY < cmd.Y) {
                        maxY = cmd.Y;
                    }
                    break;
                default:
                    break;
                }
            }
            var _x1 = (_full_trans.TransformPointX(minX, minY)) >> 0;
            var _y1 = (_full_trans.TransformPointY(minX, minY)) >> 0;
            var _x2 = (_full_trans.TransformPointX(maxX, maxY)) >> 0;
            var _y2 = (_full_trans.TransformPointY(maxX, maxY)) >> 0;
            if (bIsEven) {
                _ctx.rect(_x1 + 0.5, _y1 + 0.5, _x2 - _x1, _y2 - _y1);
            } else {
                _ctx.rect(_x1, _y1, _x2 - _x1, _y2 - _y1);
            }
        }
        if (bIsDrawLast) {
            shape_drawer.drawFillStroke(true, this.fill, bIsStroke);
        }
        shape_drawer._e();
        if (false == _old_int) {
            _graphics.SetIntegerGrid(false);
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