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
(function ($, window, undefined) {
    var asc = window["Asc"];
    function CConditionalFormatting() {
        if (! (this instanceof CConditionalFormatting)) {
            return new CConditionalFormatting();
        }
        this.Pivot = false;
        this.SqRef = null;
        this.aRules = [];
        this.SqRefRange = null;
        return this;
    }
    CConditionalFormatting.prototype.clone = function (ws) {
        var i, res = new CConditionalFormatting();
        res.Pivot = this.Pivot;
        res.SqRef = this.SqRef;
        for (i = 0; i < this.aRules.length; ++i) {
            res.aRules.push(this.aRules[i].clone());
        }
        res.recalc(ws);
        return res;
    };
    CConditionalFormatting.prototype.recalc = function (ws) {
        this.SqRefRange = ws.getRange2(this.SqRef);
    };
    function CConditionalFormattingRule() {
        if (! (this instanceof CConditionalFormattingRule)) {
            return new CConditionalFormattingRule();
        }
        this.AboveAverage = true;
        this.Bottom = false;
        this.dxf = null;
        this.EqualAverage = false;
        this.Operator = null;
        this.Percent = false;
        this.Priority = null;
        this.Rank = null;
        this.StdDev = null;
        this.StopIfTrue = false;
        this.Text = null;
        this.TimePeriod = null;
        this.Type = null;
        this.aRuleElements = [];
        return this;
    }
    CConditionalFormattingRule.prototype.clone = function () {
        var i, res = new CConditionalFormattingRule();
        res.AboveAverage = this.AboveAverage;
        res.Bottom = this.Bottom;
        if (this.dxf) {
            res.dxf = this.dxf.clone();
        }
        res.EqualAverage = this.EqualAverage;
        res.Operator = this.Operator;
        res.Percent = this.Percent;
        res.Priority = this.Priority;
        res.Rank = this.Rank;
        res.StdDev = this.StdDev;
        res.StopIfTrue = this.StopIfTrue;
        res.Text = this.Text;
        res.TimePeriod = this.TimePeriod;
        res.Type = this.Type;
        for (i = 0; i < this.aRuleElements.length; ++i) {
            res.aRuleElements.push(this.aRuleElements[i].clone());
        }
        return res;
    };
    function CColorScale() {
        if (! (this instanceof CColorScale)) {
            return new CColorScale();
        }
        this.aCFVOs = [];
        this.aColors = [];
        return this;
    }
    CColorScale.prototype.clone = function () {
        var i, res = new CColorScale();
        for (i = 0; i < this.aCFVOs.length; ++i) {
            res.aCFVOs.push(this.aCFVOs[i].clone());
        }
        for (i = 0; i < this.aColors.length; ++i) {
            res.aColors.push(this.aColors[i].clone());
        }
        return res;
    };
    function CDataBar() {
        if (! (this instanceof CDataBar)) {
            return new CDataBar();
        }
        this.MaxLength = 90;
        this.MinLength = 10;
        this.ShowValue = true;
        this.aCFVOs = [];
        this.Color = null;
        return this;
    }
    CDataBar.prototype.clone = function () {
        var i, res = new CDataBar();
        res.MaxLength = this.MaxLength;
        res.MinLength = this.MinLength;
        res.ShowValue = this.ShowValue;
        for (i = 0; i < this.aCFVOs.length; ++i) {
            res.aCFVOs.push(this.aCFVOs[i].clone());
        }
        if (this.Color) {
            res.Color = this.Color.clone();
        }
        return res;
    };
    function CFormulaCF() {
        if (! (this instanceof CFormulaCF)) {
            return new CFormulaCF();
        }
        this.Text = null;
        return this;
    }
    CFormulaCF.prototype.clone = function () {
        var res = new CFormulaCF();
        res.Text = this.Text;
        return res;
    };
    function CIconSet() {
        if (! (this instanceof CIconSet)) {
            return new CIconSet();
        }
        this.IconSet = Asc.EIconSetType.Traffic3Lights1;
        this.Percent = true;
        this.Reverse = false;
        this.ShowValue = true;
        this.aCFVOs = [];
        return this;
    }
    CIconSet.prototype.clone = function () {
        var i, res = new CIconSet();
        res.IconSet = this.IconSet;
        res.Percent = this.Percent;
        res.Reverse = this.Reverse;
        res.ShowValue = this.ShowValue;
        for (i = 0; i < this.aCFVOs.length; ++i) {
            res.aCFVOs.push(this.aCFVOs[i].clone());
        }
        return res;
    };
    function CConditionalFormatValueObject() {
        if (! (this instanceof CConditionalFormatValueObject)) {
            return new CConditionalFormatValueObject();
        }
        this.Gte = true;
        this.Type = null;
        this.Val = null;
        return this;
    }
    CConditionalFormatValueObject.prototype.clone = function () {
        var res = new CConditionalFormatValueObject();
        res.Gte = this.Gte;
        res.Type = this.Type;
        res.Val = this.Val;
        return res;
    };
    function CGradient(c1, c2) {
        if (! (this instanceof CGradient)) {
            return new CGradient(c1, c2);
        }
        this.MaxColorIndex = 512;
        this.base_shift = 8;
        this.c1 = c1;
        this.c2 = c2;
        this.min = this.max = 0;
        this.koef = null;
        this.r1 = this.r2 = 0;
        this.g1 = this.g2 = 0;
        this.b1 = this.b2 = 0;
        return this;
    }
    CGradient.prototype.init = function (min, max) {
        var distance = max - min;
        this.min = min;
        this.max = max;
        this.koef = this.MaxColorIndex / (2 * distance);
        this.r1 = this.c1.getR();
        this.g1 = this.c1.getG();
        this.b1 = this.c1.getB();
        this.r2 = this.c2.getR();
        this.g2 = this.c2.getG();
        this.b2 = this.c2.getB();
    };
    CGradient.prototype.calculateColor = function (indexColor) {
        indexColor = ((indexColor - this.min) * this.koef) >> 0;
        var r = (this.r1 + ((FT_Common.IntToUInt(this.r2 - this.r1) * indexColor) >> this.base_shift)) & 255;
        var g = (this.g1 + ((FT_Common.IntToUInt(this.g2 - this.g1) * indexColor) >> this.base_shift)) & 255;
        var b = (this.b1 + ((FT_Common.IntToUInt(this.b2 - this.b1) * indexColor) >> this.base_shift)) & 255;
        return new RgbColor((r << 16) + (g << 8) + b);
    };
    asc.CConditionalFormatting = CConditionalFormatting;
    asc.CConditionalFormattingRule = CConditionalFormattingRule;
    asc.CColorScale = CColorScale;
    asc.CDataBar = CDataBar;
    asc.CFormulaCF = CFormulaCF;
    asc.CIconSet = CIconSet;
    asc.CConditionalFormatValueObject = CConditionalFormatValueObject;
    asc.CGradient = CGradient;
})(jQuery, window);