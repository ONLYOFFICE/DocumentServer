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
function CMathLimitPr() {
    this.type = LIMIT_LOW;
}
CMathLimitPr.prototype.Set_FromObject = function (Obj) {
    if (undefined !== Obj.type && null !== Obj.type) {
        this.type = Obj.type;
    }
};
CMathLimitPr.prototype.Copy = function () {
    var NewPr = new CMathLimitPr();
    NewPr.type = this.type;
    return NewPr;
};
CMathLimitPr.prototype.Write_ToBinary = function (Writer) {
    Writer.WriteLong(this.type);
};
CMathLimitPr.prototype.Read_FromBinary = function (Reader) {
    this.type = Reader.GetLong();
};
function CLimitPrimary(bInside, Type, FName, Iterator) {
    CLimitPrimary.superclass.constructor.call(this, bInside);
    this.Type = Type;
    this.FName = null;
    this.Iterator = null;
    this.init(FName, Iterator);
}
Asc.extendClass(CLimitPrimary, CMathBase);
CLimitPrimary.prototype.init = function (FName, Iterator) {
    this.setDimension(2, 1);
    if (this.Type == LIMIT_LOW) {
        this.FName = FName;
        this.Iterator = new CDenominator(Iterator);
        this.elements[0][0] = this.FName;
        this.elements[1][0] = this.Iterator;
    } else {
        this.Iterator = Iterator;
        this.FName = FName;
        this.elements[0][0] = this.Iterator;
        this.elements[1][0] = this.FName;
    }
};
CLimitPrimary.prototype.PreRecalc = function (Parent, ParaMath, ArgSize, RPI, GapsInfo) {
    this.Parent = Parent;
    this.ParaMath = ParaMath;
    this.Set_CompiledCtrPrp(Parent, ParaMath, RPI);
    if (this.bInside == false) {
        GapsInfo.setGaps(this, this.TextPrControlLetter.FontSize);
    }
    this.FName.PreRecalc(this, ParaMath, ArgSize, RPI);
    var ArgSzIter = ArgSize.Copy();
    ArgSzIter.decrease();
    var NewRPI = RPI.Copy();
    NewRPI.bDecreasedComp = true;
    this.Iterator.ArgSize.decrease();
    this.Iterator.PreRecalc(this, ParaMath, ArgSzIter, NewRPI);
};
CLimitPrimary.prototype.Resize = function (oMeasure, RPI) {
    if (this.Type == LIMIT_LOW) {
        this.dH = 0;
    } else {
        this.dH = 0.06 * this.Get_TxtPrControlLetter().FontSize;
    }
    this.FName.Resize(oMeasure, RPI);
    this.Iterator.Resize(oMeasure, RPI);
    var SizeFName = this.FName.size,
    SizeIter = this.Iterator.size;
    var width = SizeFName.width > SizeIter.width ? SizeFName.width : SizeIter.width,
    height = SizeFName.height + SizeIter.height,
    ascent;
    if (this.Type == LIMIT_LOW) {
        ascent = SizeFName.ascent;
    } else {
        if (this.Type == LIMIT_UP) {
            ascent = SizeIter.height + this.dH + SizeFName.ascent;
        }
    }
    width += this.GapLeft + this.GapRight;
    this.size = {
        width: width,
        height: height,
        ascent: ascent
    };
};
function CLimit(props) {
    CLimit.superclass.constructor.call(this);
    this.Id = g_oIdCounter.Get_NewId();
    this.Pr = new CMathLimitPr();
    if (props !== null && typeof(props) !== "undefined") {
        this.init(props);
    }
    g_oTableId.Add(this, this.Id);
}
Asc.extendClass(CLimit, CMathBase);
CLimit.prototype.ClassType = historyitem_type_lim;
CLimit.prototype.kind = MATH_LIMIT;
CLimit.prototype.init = function (props) {
    this.Fill_LogicalContent(2);
    this.setProperties(props);
    this.fillContent();
};
CLimit.prototype.fillContent = function () {};
CLimit.prototype.getFName = function () {
    return this.Content[0];
};
CLimit.prototype.getIterator = function () {
    return this.Content[1];
};
CLimit.prototype.ApplyProperties = function (RPI) {
    if (this.RecalcInfo.bProps == true || RPI.bChangeInline == true) {
        this.setDimension(1, 1);
        if (RPI.bInline == true && RPI.bMathFunc == true) {
            var props;
            if (this.Pr.type == LIMIT_LOW) {
                props = {
                    type: DEGREE_SUBSCRIPT,
                    ctrPrp: this.CtrPrp
                };
            } else {
                props = {
                    type: DEGREE_SUPERSCRIPT,
                    ctrPrp: this.CtrPrp
                };
            }
            this.elements[0][0] = new CDegreeBase(props, true);
            this.elements[0][0].setBase(this.getFName());
            this.elements[0][0].setIterator(this.getIterator());
            this.elements[0][0].fillContent();
        } else {
            this.elements[0][0] = new CLimitPrimary(true, this.Pr.type, this.getFName(), this.getIterator());
        }
        this.RecalcInfo.bProps = false;
    }
};
CLimit.prototype.Document_UpdateInterfaceState = function (MathProps) {
    MathProps.Type = c_oAscMathInterfaceType.Limit;
    MathProps.Pr = null;
};
function CMathFunc(props) {
    CMathFunc.superclass.constructor.call(this);
    this.Id = g_oIdCounter.Get_NewId();
    this.Pr = new CMathBasePr();
    if (props !== null && typeof(props) !== "undefined") {
        this.init(props);
    }
    g_oTableId.Add(this, this.Id);
}
Asc.extendClass(CMathFunc, CMathBase);
CMathFunc.prototype.ClassType = historyitem_type_mathFunc;
CMathFunc.prototype.kind = MATH_FUNCTION;
CMathFunc.prototype.init = function (props) {
    this.Fill_LogicalContent(2);
    this.setProperties(props);
    this.fillContent();
};
CMathFunc.prototype.PreRecalc = function (Parent, ParaMath, ArgSize, RPI, GapsInfo) {
    var NewRPI = RPI.Copy();
    NewRPI.bMathFunc = true;
    CMathFunc.superclass.PreRecalc.call(this, Parent, ParaMath, ArgSize, NewRPI, GapsInfo);
};
CMathFunc.prototype.GetLastElement = function () {
    return this.Content[1].GetFirstElement();
};
CMathFunc.prototype.GetFirstElement = function () {
    return this.Content[0].GetFirstElement();
};
CMathFunc.prototype.setDistance = function () {
    this.dW = this.Get_TxtPrControlLetter().FontSize / 6 * g_dKoef_pt_to_mm;
};
CMathFunc.prototype.getFName = function () {
    return this.Content[0];
};
CMathFunc.prototype.getArgument = function () {
    return this.Content[1];
};
CMathFunc.prototype.fillContent = function () {
    this.setDimension(1, 2);
    this.elements[0][0] = this.getFName();
    this.elements[0][1] = this.getArgument();
};
CMathFunc.prototype.Document_UpdateInterfaceState = function (MathProps) {
    MathProps.Type = c_oAscMathInterfaceType.Function;
    MathProps.Pr = null;
};