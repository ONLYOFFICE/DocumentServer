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
    function CColorScale() {
        if (! (this instanceof CColorScale)) {
            return new CColorScale();
        }
        this.aCFVOs = [];
        this.aColors = [];
        return this;
    }
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
    function CFormulaCF() {
        if (! (this instanceof CFormulaCF)) {
            return new CFormulaCF();
        }
        this.Text = null;
        return this;
    }
    function CIconSet() {
        if (! (this instanceof CIconSet)) {
            return new CIconSet();
        }
        this.IconSet = "3TrafficLights1";
        this.Percent = true;
        this.Reverse = false;
        this.ShowValue = true;
        this.aCFVOs = [];
        return this;
    }
    function CConditionalFormatValueObject() {
        if (! (this instanceof CConditionalFormatValueObject)) {
            return new CConditionalFormatValueObject();
        }
        this.Gte = true;
        this.Type = null;
        this.Val = null;
        return this;
    }
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
    CGradient.prototype = {
        constructor: CGradient,
        init: function (min, max) {
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
        },
        calculateColor: function (indexColor) {
            indexColor = parseInt((indexColor - this.min) * this.koef);
            var r = (this.r1 + ((FT_Common.IntToUInt(this.r2 - this.r1) * indexColor) >> this.base_shift)) & 255;
            var g = (this.g1 + ((FT_Common.IntToUInt(this.g2 - this.g1) * indexColor) >> this.base_shift)) & 255;
            var b = (this.b1 + ((FT_Common.IntToUInt(this.b2 - this.b1) * indexColor) >> this.base_shift)) & 255;
            return new RgbColor((r << 16) + (g << 8) + b);
        }
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