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
 var LEGEND_ELEMENT_TYPE_RECT = 0;
var LEGEND_ELEMENT_TYPE_LINE = 1;
function CLegendEntry() {
    this.bDelete = null;
    this.idx = null;
    this.txPr = null;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CLegendEntry.prototype = {
    Get_Id: function () {
        return this.Id;
    },
    getObjectType: function () {
        return CLASS_TYPE_LEGEND_ENTRY;
    }
};
function CChartLegend() {
    this.chartGroup = null;
    this.layout = null;
    this.legendEntries = [];
    this.legendPos = null;
    this.overlay = false;
    this.spPr = new CSpPr();
    this.txPr = null;
    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;
    this.calculatedEntry = [];
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CChartLegend.prototype = {
    getObjectType: function () {
        return CLASS_TYPE_CHART_LEGEND;
    },
    Get_Id: function () {
        return this.Id;
    },
    getStyles: function (level) {
        var styles = new CStyles();
        var default_legend_style = new CStyle("defaultLegendStyle", styles.Default, null, styletype_Paragraph);
        default_legend_style.TextPr.FontSize = 10;
        default_legend_style.TextPr.themeFont = "Calibri";
        var tx_pr;
        if (isRealObject(this.txPr)) {}
        styles.Style[styles.Id] = default_legend_style;
        ++styles.Id;
        return styles;
    },
    init: function () {
        this.setStartValues();
        return;
        var chart = this.chartGroup.chart;
        var chart_legend = chart.getLegendInfo();
        if (chart_legend.length > 0) {
            var shape_type = chart_legend[0].marker === c_oAscLegendMarkerType.Line ? "line" : "rect";
            for (var i = 0; i < chart_legend.length; ++i) {
                var legend_entry_obj = chart_legend[i];
                var entry_string = legend_entry_obj.text;
                var cur_legend_entry = new CLegendEntryGroup(this);
                cur_legend_entry.marker = chart_legend[0].marker;
                cur_legend_entry.drawingObjects = this.chartGroup.drawingObjects;
                cur_legend_entry.textBody = new CTextBody(cur_legend_entry);
                cur_legend_entry.idx = i;
                for (var key in entry_string) {
                    cur_legend_entry.textBody.paragraphAdd(new ParaText(entry_string[key]), false);
                }
                cur_legend_entry.textBody.content.Reset(0, 0, 30, 30);
                cur_legend_entry.textBody.content.Recalculate_Page(0, true);
                cur_legend_entry.geometry = CreateGeometry(shape_type);
                cur_legend_entry.geometry.Init(5, 5);
                cur_legend_entry.brush = new CUniFill();
                cur_legend_entry.brush.fill = new CSolidFill();
                cur_legend_entry.brush.fill.color.color = new CRGBColor();
                cur_legend_entry.brush.fill.color.color.RGBA = {
                    R: legend_entry_obj.color.R,
                    G: legend_entry_obj.color.G,
                    B: legend_entry_obj.color.B,
                    A: 255
                };
            }
        }
    },
    draw: function (graphics) {
        for (var i = 0; i < this.calculatedEntry.length; ++i) {
            this.calculatedEntry[i].draw(graphics);
        }
    },
    setStartValues: function () {
        var is_on_history = History.Is_On();
        var is_on_table_id = !g_oTableId.m_bTurnOff;
        if (is_on_history) {
            History.TurnOff();
        }
        if (is_on_table_id) {
            g_oTableId.m_bTurnOff = true;
        }
        g_oTableId.m_bTurnOff = true;
        var chart = this.chartGroup.chart;
        var legend_info = chart.getLegendInfo();
        this.calculatedEntry.length = 0;
        if (legend_info.length > 0) {
            var bullet_type = legend_info[0].marker === c_oAscLegendMarkerType.Line ? "line" : "rect";
            for (var i = 0; i < legend_info.length; ++i) {
                var cur_legend_info = legend_info[i];
                var legend_entry = this.legendEntries[i];
                if (isRealObject(legend_entry) && legend_entry.bDelete === true) {
                    continue;
                }
                var entry = new CLegendEntryGroup(this);
                entry.bullet = new CShape(null, this.chartGroup.drawingObjects, legend_entry);
                var uni_fill = new CUniFill();
                uni_fill.setFill(new CSolidFill());
                uni_fill.fill.setColor(new CUniColor());
                uni_fill.fill.color.setColor(new CRGBColor());
                uni_fill.fill.color.setColor(cur_legend_info.color.R * 256 * 256 + cur_legend_info.color.G * 256 + cur_legend_info.color.B);
                if (bullet_type === "line") {
                    entry.bullet.setPresetGeometry("line");
                    entry.bullet.setUniFill(uni_fill);
                } else {
                    entry.bullet.setPresetGeometry("rect");
                    var shape_fill = new CUniFill();
                    shape_fill.setFill(new CNoFill());
                    var shape_line = new CLn();
                    var line_fill = new CUniFill();
                    line_fill.setFill(new CNoFill());
                    shape_line.setFill(line_fill);
                    entry.bullet.setUniFill(shape_fill);
                    entry.bullet.setUniLine(shape_line);
                    entry.bullet.addTextBody(new CTextBody(entry.bullet));
                    entry.bullet.paragraphAdd(new ParaTextPr({
                        unifill: uni_fill
                    }));
                    entry.bullet.paragraphAdd(new ParaText(String.fromCharCode(167)));
                }
                entry.title = new CShape(null, this.chartGroup.drawingObjects);
                entry.title.addTextBody(new CTextBody(entry.title));
                for (var i in cur_legend_info.text) {
                    entry.title.paragraphAdd(new ParaText(cur_legend_info.text[i]));
                }
                this.calculatedEntry.push(entry);
            }
        }
        if (is_on_history) {
            History.TurnOn();
        }
        if (is_on_table_id) {
            g_oTableId.m_bTurnOff = false;
        }
    },
    setChartGroup: function (chartGroup) {
        this.chartGroup = chartGroup;
    },
    recalculateInternalPositionsAndExtents: function () {
        this.extX = null;
        this.extY = null;
        if (isRealObject(this.layout) && isRealNumber(this.layout.w) && isRealNumber(this.layout.h)) {
            this.extX = this.chartGroup.extX * this.layout.w;
            this.extY = this.chartGroup.extY * this.layout.h;
        } else {
            switch (this.legendPos) {
            case c_oAscChartLegend.right:
                case c_oAscChartLegend.left:
                for (var i = 0; i < this.calculatedEntry.length; ++i) {
                    var cur_legend_entry = this.calculatedEntry[i];
                }
                break;
            }
        }
    },
    recalculateWithoutLayout: function () {}
};
function CLegendEntryGroup(legend) {
    this.legend = legend;
    this.bullet = null;
    this.title = null;
}
CLegendEntryGroup.prototype = {
    setLegendGroup: function (legendGroup) {},
    getStyles: function () {
        var styles = new CStyles();
        var default_style = new CStyle("defaultEntryStyle", null, null, styletype_Paragraph);
        default_style.TextPr.themeFont = "Calibri";
        default_style.TextPr.FontSize = 10;
        styles.Style[styles.Id] = default_style;
        ++styles.Id;
        var legend_style = new CStyle("legend_style", styles.Id - 1, null, styletype_Paragraph);
        styles.Style[styles.Id] = legend_style;
        ++styles.Id;
        var entry_style = new CStyle("entry_style", styles.Id - 1, null, styletype_Paragraph);
        if (isRealObject(this.legendGroup.legendEntries[this.idx]) && isRealObject(this.legendGroup.legendEntries[this.idx].txPr)) {}
        styles.Style[styles.Id] = entry_style;
        ++styles.Id;
        return styles;
    },
    getBulletStyles: function () {},
    getTitleStyles: function () {},
    recalculateInternalPosition: function () {},
    draw: function (graphics) {
        if (isRealObject(this.bullet) && isRealObject(this.title)) {
            this.bullet.draw(graphics);
            this.title.draw(graphics);
        }
    }
};