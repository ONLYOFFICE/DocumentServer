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
 var LAYOUT_MODE_EDGE = 0;
var LAYOUT_MODE_FACTOR = 1;
var LAYOUT_TARGET_INNER = 0;
var LAYOUT_TARGET_OUTER = 1;
function CChartLayout() {
    this.isManual = false;
    this.layoutTarget = null;
    this.xMode = null;
    this.yMode = null;
    this.wMode = null;
    this.hMode = null;
    this.x = null;
    this.y = null;
    this.w = null;
    this.h = null;
}
CChartLayout.prototype = {
    createDuplicate: function () {
        var ret = new CChartLayout();
        this.isManual = false;
        ret.layoutTarget = this.layoutTarget;
        ret.xMode = this.xMode;
        ret.yMode = this.yMode;
        ret.wMode = this.wMode;
        ret.hMode = this.hMode;
        ret.x = this.x;
        ret.y = this.y;
        ret.w = this.w;
        ret.h = this.h;
        return ret;
    },
    Write_ToBinary2: function (w) {
        w.WriteBool(isRealNumber(this.layoutTarget));
        if (isRealNumber(this.layoutTarget)) {
            w.WriteLong(this.layoutTarget);
        }
        w.WriteBool(isRealNumber(this.xMode));
        if (isRealNumber(this.xMode)) {
            w.WriteLong(this.xMode);
        }
        w.WriteBool(isRealNumber(this.yMode));
        if (isRealNumber(this.yMode)) {
            w.WriteLong(this.yMode);
        }
        w.WriteBool(isRealNumber(this.wMode));
        if (isRealNumber(this.wMode)) {
            w.WriteLong(this.wMode);
        }
        w.WriteBool(isRealNumber(this.hMode));
        if (isRealNumber(this.hMode)) {
            w.WriteLong(this.hMode);
        }
        w.WriteBool(isRealNumber(this.x));
        if (isRealNumber(this.x)) {
            w.WriteDouble(this.x);
        }
        w.WriteBool(isRealNumber(this.y));
        if (isRealNumber(this.y)) {
            w.WriteDouble(this.y);
        }
        w.WriteBool(isRealNumber(this.w));
        if (isRealNumber(this.w)) {
            w.WriteDouble(this.w);
        }
        w.WriteBool(isRealNumber(this.h));
        if (isRealNumber(this.h)) {
            w.WriteDouble(this.h);
        }
    },
    Read_FromBinary2: function (r) {
        if (r.GetBool()) {
            (this.layoutTarget) = r.GetLong();
        }
        if (r.GetBool()) {
            (this.xMode) = r.GetLong();
        }
        if (r.GetBool()) {
            (this.yMode) = r.GetLong();
        }
        if (r.GetBool()) {
            (this.wMode) = r.GetLong();
        }
        if (r.GetBool()) {
            (this.hMode) = r.GetLong();
        }
        if (r.GetBool()) {
            (this.x) = r.GetDouble();
        }
        if (r.GetBool()) {
            (this.y) = r.GetDouble();
        }
        if (r.GetBool()) {
            (this.w) = r.GetDouble();
        }
        if (r.GetBool()) {
            (this.h) = r.GetDouble();
        }
    },
    setXMode: function (mode) {
        this.xMode = mode;
    },
    setYMode: function (mode) {
        this.yMode = mode;
    },
    setX: function (x) {
        this.x = x;
    },
    setY: function (y) {
        this.y = y;
    },
    setIsManual: function (isManual) {
        this.isManual = isManual;
    }
};