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
function CMathBreak() {
    this.AlnAt = undefined;
}
CMathBreak.prototype.Set_FromObject = function (Obj) {
    if (Obj.AlnAt !== undefined && Obj.AlnAt !== null && Obj.AlnAt - 0 == Obj.AlnAt) {
        if (Obj.AlnAt >= 1 && Obj.AlnAt <= 255) {
            this.AlnAt = Obj.AlnAt;
        }
    }
};
CMathBreak.prototype.Copy = function () {
    var NewMBreak = new CMathBreak();
    NewMBreak.AlnAt = this.AlnAt;
    return NewMBreak;
};
CMathBreak.prototype.Write_ToBinary = function (Writer) {
    if (this.AlnAt !== undefined) {
        Writer.WriteBool(false);
        Writer.WriteLong(this.AlnAt);
    } else {
        Writer.WriteBool(true);
    }
};
CMathBreak.prototype.Read_FromBinary = function (Reader) {
    if (Reader.GetBool() == false) {
        this.AlnAt = Reader.GetLong();
    } else {
        this.AlnAt = undefined;
    }
};
function CMathBorderBoxPr() {
    this.hideBot = false;
    this.hideLeft = false;
    this.hideRight = false;
    this.hideTop = false;
    this.strikeBLTR = false;
    this.strikeH = false;
    this.strikeTLBR = false;
    this.strikeV = false;
}
CMathBorderBoxPr.prototype.Set_FromObject = function (Obj) {
    if (undefined !== Obj.hideBot && null !== Obj.hideBot) {
        this.hideBot = Obj.hideBot;
    }
    if (undefined !== Obj.hideLeft && null !== Obj.hideLeft) {
        this.hideLeft = Obj.hideLeft;
    }
    if (undefined !== Obj.hideRight && null !== Obj.hideRight) {
        this.hideRight = Obj.hideRight;
    }
    if (undefined !== Obj.hideTop && null !== Obj.hideTop) {
        this.hideTop = Obj.hideTop;
    }
    if (undefined !== Obj.strikeBLTR && null !== Obj.strikeBLTR) {
        this.strikeBLTR = Obj.strikeBLTR;
    }
    if (undefined !== Obj.strikeH && null !== Obj.strikeH) {
        this.strikeH = Obj.strikeH;
    }
    if (undefined !== Obj.strikeTLBR && null !== Obj.strikeTLBR) {
        this.strikeTLBR = Obj.strikeTLBR;
    }
    if (undefined !== Obj.strikeV && null !== Obj.strikeV) {
        this.strikeV = Obj.strikeV;
    }
};
CMathBorderBoxPr.prototype.Copy = function () {
    var NewPr = new CMathBorderBoxPr();
    NewPr.hideLeft = this.hideLeft;
    NewPr.hideRight = this.hideRight;
    NewPr.hideTop = this.hideTop;
    NewPr.strikeBLTR = this.strikeBLTR;
    NewPr.strikeH = this.strikeH;
    NewPr.strikeTLBR = this.strikeTLBR;
    NewPr.strikeV = this.strikeV;
    return NewPr;
};
CMathBorderBoxPr.prototype.Write_ToBinary = function (Writer) {
    Writer.WriteBool(this.hideBot);
    Writer.WriteBool(this.hideLeft);
    Writer.WriteBool(this.hideRight);
    Writer.WriteBool(this.hideTop);
    Writer.WriteBool(this.strikeBLTR);
    Writer.WriteBool(this.strikeH);
    Writer.WriteBool(this.strikeTLBR);
    Writer.WriteBool(this.strikeV);
};
CMathBorderBoxPr.prototype.Read_FromBinary = function (Reader) {
    this.hideBot = Reader.GetBool();
    this.hideLeft = Reader.GetBool();
    this.hideRight = Reader.GetBool();
    this.hideTop = Reader.GetBool();
    this.strikeBLTR = Reader.GetBool();
    this.strikeH = Reader.GetBool();
    this.strikeTLBR = Reader.GetBool();
    this.strikeV = Reader.GetBool();
};
function CBorderBox(props) {
    CBorderBox.superclass.constructor.call(this);
    this.Id = g_oIdCounter.Get_NewId();
    this.gapBrd = 0;
    this.Pr = new CMathBorderBoxPr();
    if (props !== null && typeof(props) !== "undefined") {
        this.init(props);
    }
    g_oTableId.Add(this, this.Id);
}
Asc.extendClass(CBorderBox, CMathBase);
CBorderBox.prototype.ClassType = historyitem_type_borderBox;
CBorderBox.prototype.kind = MATH_BORDER_BOX;
CBorderBox.prototype.init = function (props) {
    this.Fill_LogicalContent(1);
    this.setProperties(props);
    this.fillContent();
};
CBorderBox.prototype.getBase = function () {
    return this.Content[0];
};
CBorderBox.prototype.fillContent = function () {
    this.setDimension(1, 1);
    this.elements[0][0] = this.getBase();
};
CBorderBox.prototype.recalculateSize = function () {
    var base = this.elements[0][0].size;
    var width = base.width;
    var height = base.height;
    var ascent = base.ascent;
    this.gapBrd = this.Get_TxtPrControlLetter().FontSize * 0.08104587131076388;
    if (this.Pr.hideTop == false) {
        height += this.gapBrd;
        ascent += this.gapBrd;
    }
    if (this.Pr.hideBot == false) {
        height += this.gapBrd;
    }
    if (this.Pr.hideLeft == false) {
        width += this.gapBrd;
    }
    if (this.Pr.hideRight == false) {
        width += this.gapBrd;
    }
    width += this.GapLeft + this.GapRight;
    this.size = {
        width: width,
        height: height,
        ascent: ascent
    };
};
CBorderBox.prototype.draw = function (x, y, pGraphics, PDSE) {
    this.elements[0][0].draw(x, y, pGraphics, PDSE);
    var penW = this.Get_TxtPrControlLetter().FontSize * 0.02;
    var Width = this.size.width - this.GapLeft - this.GapRight,
    Height = this.size.height;
    var X = this.pos.x + x + this.GapLeft,
    Y = this.pos.y + y;
    this.Make_ShdColor(PDSE, this.Get_CompiledCtrPrp());
    if (!this.Pr.hideTop) {
        var x1 = X,
        x2 = X + Width,
        y1 = Y;
        pGraphics.drawHorLine(0, y1, x1, x2, penW);
    }
    if (!this.Pr.hideBot) {
        var x1 = X,
        x2 = X + Width,
        y1 = Y + Height;
        pGraphics.drawHorLine(2, y1, x1, x2, penW);
    }
    if (!this.Pr.hideLeft) {
        var x1 = X,
        y1 = Y,
        y2 = Y + Height;
        pGraphics.drawVerLine(0, x1, y1, y2, penW);
    }
    if (!this.Pr.hideRight) {
        var x1 = X + Width,
        y1 = Y,
        y2 = Y + Height;
        pGraphics.drawVerLine(2, x1, y1, y2, penW);
    }
    if (this.Pr.strikeTLBR) {
        if (penW < 0.3) {
            var x1 = X,
            y1 = Y,
            x2 = X + Width,
            y2 = Y + Height;
            pGraphics.p_width(180);
            pGraphics._s();
            pGraphics._m(x1, y1);
            pGraphics._l(x2, y2);
            pGraphics.ds();
        } else {
            var pW = penW * 0.8;
            var x1 = X,
            y1 = Y,
            x2 = X + pW,
            y2 = Y,
            x3 = X + Width,
            y3 = Y + Height - pW,
            x4 = X + Width,
            y4 = Y + Height,
            x5 = X + Width - pW,
            y5 = Y + Height,
            x6 = X,
            y6 = Y + pW,
            x7 = X,
            y7 = Y;
            pGraphics.p_width(1000);
            pGraphics._s();
            pGraphics._m(x1, y1);
            pGraphics._l(x2, y2);
            pGraphics._l(x3, y3);
            pGraphics._l(x4, y4);
            pGraphics._l(x5, y5);
            pGraphics._l(x6, y6);
            pGraphics._l(x7, y7);
            pGraphics.df();
        }
    }
    if (this.Pr.strikeBLTR) {
        if (penW < 0.3) {
            var x1 = X + Width,
            y1 = Y,
            x2 = X,
            y2 = Y + Height;
            pGraphics.p_width(180);
            pGraphics._s();
            pGraphics._m(x1, y1);
            pGraphics._l(x2, y2);
            pGraphics.ds();
        } else {
            var pW = 0.8 * penW;
            var x1 = X + Width,
            y1 = Y,
            x2 = X + Width - pW,
            y2 = Y,
            x3 = X,
            y3 = Y + Height - pW,
            x4 = X,
            y4 = Y + Height,
            x5 = X + pW,
            y5 = Y + Height,
            x6 = X + Width,
            y6 = Y + pW,
            x7 = X + Width,
            y7 = Y;
            pGraphics.p_width(1000);
            pGraphics._s();
            pGraphics._m(x1, y1);
            pGraphics._l(x2, y2);
            pGraphics._l(x3, y3);
            pGraphics._l(x4, y4);
            pGraphics._l(x5, y5);
            pGraphics._l(x6, y6);
            pGraphics._l(x7, y7);
            pGraphics.df();
        }
    }
    if (this.Pr.strikeH) {
        var x1 = X,
        x2 = X + Width,
        y1 = Y + Height / 2 - penW / 2;
        pGraphics.drawHorLine(0, y1, x1, x2, penW);
    }
    if (this.Pr.strikeV) {
        var x1 = X + Width / 2 - penW / 2,
        y1 = Y,
        y2 = Y + Height;
        pGraphics.drawVerLine(0, x1, y1, y2, penW);
    }
};
CBorderBox.prototype.setPosition = function (pos, PosInfo) {
    this.pos.x = pos.x;
    this.pos.y = pos.y - this.size.ascent;
    var NewPos = new CMathPosition();
    if (this.Pr.hideLeft == false) {
        NewPos.x = this.pos.x + this.GapLeft + this.gapBrd;
    } else {
        NewPos.x = this.pos.x + this.GapLeft;
    }
    if (this.Pr.hideTop == false) {
        NewPos.y = this.pos.y + this.gapBrd;
    } else {
        NewPos.y = this.pos.y;
    }
    this.elements[0][0].setPosition(NewPos, PosInfo);
};
function CMathBoxPr() {
    this.brk = undefined;
    this.aln = false;
    this.diff = false;
    this.noBreak = false;
    this.opEmu = false;
}
CMathBoxPr.prototype.Set_FromObject = function (Obj) {
    if (true === Obj.aln || 1 === Obj.aln) {
        this.aln = true;
    } else {
        this.aln = false;
    }
    if (Obj.brk !== null && Obj.brk !== undefined) {
        this.brk = new CMathBreak();
        this.brk.Set_FromObject(Obj.brk);
    }
    if (true === Obj.diff || 1 === Obj.diff) {
        this.diff = true;
    } else {
        this.diff = false;
    }
    if (true === Obj.noBreak || 1 === Obj.noBreak) {
        this.noBreak = true;
    } else {
        this.noBreak = false;
    }
    if (true === Obj.opEmu || 1 === Obj.opEmu) {
        this.opEmu = true;
    } else {
        this.opEmu = false;
    }
};
CMathBoxPr.prototype.Copy = function () {
    var NewPr = new CMathBoxPr();
    NewPr.aln = this.aln;
    NewPr.diff = this.diff;
    NewPr.noBreak = this.noBreak;
    NewPr.opEmu = this.opEmu;
    if (this.brk !== undefined) {
        NewPr.brk = this.brk.Copy();
    }
    return NewPr;
};
CMathBoxPr.prototype.Write_ToBinary = function (Writer) {
    Writer.WriteBool(this.aln);
    Writer.WriteBool(this.diff);
    Writer.WriteBool(this.noBreak);
    Writer.WriteBool(this.opEmu);
    if (undefined !== this.brk) {
        Writer.WriteBool(false);
        this.brk.Write_ToBinary(Writer);
    } else {
        Writer.WriteBool(true);
    }
};
CMathBoxPr.prototype.Read_FromBinary = function (Reader) {
    this.aln = Reader.GetBool();
    this.diff = Reader.GetBool();
    this.noBreak = Reader.GetBool();
    this.opEmu = Reader.GetBool();
    if (Reader.GetBool() == false) {
        this.brk = new CMathBreak();
        this.brk.Read_FromBinary(Reader);
    } else {
        this.brk = undefined;
    }
};
function CBox(props) {
    CBox.superclass.constructor.call(this);
    this.Id = g_oIdCounter.Get_NewId();
    this.Pr = new CMathBoxPr();
    this.baseContent = new CMathContent();
    if (props !== null && typeof(props) !== "undefined") {
        this.init(props);
    }
    g_oTableId.Add(this, this.Id);
}
Asc.extendClass(CBox, CMathBase);
CBox.prototype.ClassType = historyitem_type_box;
CBox.prototype.kind = MATH_BOX;
CBox.prototype.init = function (props) {
    this.Fill_LogicalContent(1);
    this.setProperties(props);
    this.fillContent();
};
CBox.prototype.fillContent = function () {
    this.setDimension(1, 1);
    this.elements[0][0] = this.getBase();
};
CBox.prototype.getBase = function () {
    return this.Content[0];
};
function CMathBarPr() {
    this.pos = LOCATION_BOT;
}
CMathBarPr.prototype.Set_FromObject = function (Obj) {
    if (LOCATION_TOP === Obj.pos || LOCATION_BOT === Obj.pos) {
        this.pos = Obj.pos;
    }
};
CMathBarPr.prototype.Copy = function () {
    var NewPr = new CMathBarPr();
    NewPr.pos = this.pos;
    return NewPr;
};
CMathBarPr.prototype.Write_ToBinary = function (Writer) {
    Writer.WriteLong(this.pos);
};
CMathBarPr.prototype.Read_FromBinary = function (Reader) {
    this.pos = Reader.GetLong();
};
function CBar(props) {
    CBar.superclass.constructor.call(this);
    this.Id = g_oIdCounter.Get_NewId();
    this.Pr = new CMathBarPr();
    this.operator = new COperator(OPER_BAR);
    if (props !== null && typeof(props) !== "undefined") {
        this.init(props);
    }
    g_oTableId.Add(this, this.Id);
}
Asc.extendClass(CBar, CCharacter);
CBar.prototype.ClassType = historyitem_type_bar;
CBar.prototype.kind = MATH_BAR;
CBar.prototype.init = function (props) {
    this.Fill_LogicalContent(1);
    this.setProperties(props);
    this.fillContent();
};
CBar.prototype.getBase = function () {
    return this.Content[0];
};
CBar.prototype.fillContent = function () {
    this.setDimension(1, 1);
    this.elements[0][0] = this.getBase();
};
CBar.prototype.ApplyProperties = function (RPI) {
    if (this.RecalcInfo.bProps == true) {
        var prp = {
            loc: this.Pr.pos,
            type: DELIMITER_LINE
        };
        var defaultProps = {
            loc: LOCATION_BOT
        };
        this.setCharacter(prp, defaultProps);
        this.RecalcInfo.bProps = false;
    }
};
CBar.prototype.PreRecalc = function (Parent, ParaMath, ArgSize, RPI, GapsInfo) {
    this.ApplyProperties(RPI);
    this.operator.PreRecalc(this, ParaMath);
    CBar.superclass.PreRecalc.call(this, Parent, ParaMath, ArgSize, RPI, GapsInfo);
};
CBar.prototype.getAscent = function () {
    var ascent;
    if (this.Pr.pos === LOCATION_TOP) {
        ascent = this.operator.size.height + this.elements[0][0].size.ascent;
    } else {
        if (this.Pr.pos === LOCATION_BOT) {
            ascent = this.elements[0][0].size.ascent;
        }
    }
    return ascent;
};
function CMathPhantomPr() {
    this.show = true;
    this.transp = false;
    this.zeroAsc = false;
    this.zeroDesc = false;
    this.zeroWid = false;
}
CMathPhantomPr.prototype.Set_FromObject = function (Obj) {
    if (true === Obj.show || 1 === Obj.show) {
        this.show = true;
    } else {
        this.show = false;
    }
    if (true === Obj.transp || 1 === Obj.transp) {
        this.transp = true;
    } else {
        this.transp = false;
    }
    if (true === Obj.zeroAsc || 1 === Obj.zeroAsc) {
        this.zeroAsc = true;
    } else {
        this.zeroAsc = false;
    }
    if (true === Obj.zeroDesc || 1 === Obj.zeroDesc) {
        this.zeroDesc = true;
    } else {
        this.zeroDesc = false;
    }
    if (true === Obj.zeroWid || 1 === Obj.zeroWid) {
        this.zeroWid = true;
    } else {
        this.zeroWid = false;
    }
};
CMathPhantomPr.prototype.Copy = function () {
    var NewPr = new CMathPhantomPr();
    NewPr.show = this.show;
    NewPr.transp = this.transp;
    NewPr.zeroAsc = this.zeroAsc;
    NewPr.zeroDesc = this.zeroDesc;
    NewPr.zeroWid = this.zeroWid;
    return NewPr;
};
CMathPhantomPr.prototype.Write_ToBinary = function (Writer) {
    Writer.WriteBool(this.show);
    Writer.WriteBool(this.transp);
    Writer.WriteBool(this.zeroAsc);
    Writer.WriteBool(this.zeroDesc);
    Writer.WriteBool(this.zeroWid);
};
CMathPhantomPr.prototype.Read_FromBinary = function (Reader) {
    this.show = Reader.GetBool();
    this.transp = Reader.GetBool();
    this.zeroAsc = Reader.GetBool();
    this.zeroDesc = Reader.GetBool();
    this.zeroWid = Reader.GetBool();
};
function CPhantom(props) {
    CPhantom.superclass.constructor.call(this);
    this.Id = g_oIdCounter.Get_NewId();
    this.Pr = new CMathPhantomPr();
    if (props !== null && typeof(props) !== "undefined") {
        this.init(props);
    }
    g_oTableId.Add(this, this.Id);
}
Asc.extendClass(CPhantom, CMathBase);
CPhantom.prototype.ClassType = historyitem_type_phant;
CPhantom.prototype.kind = MATH_PHANTOM;
CPhantom.prototype.init = function (props) {
    this.Fill_LogicalContent(1);
    this.setProperties(props);
    this.fillContent();
};
CPhantom.prototype.getBase = function () {
    return this.Content[0];
};
CPhantom.prototype.fillContent = function () {
    this.setDimension(1, 1);
    this.elements[0][0] = this.getBase();
};