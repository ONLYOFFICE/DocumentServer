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
 Ext.define("PE.component.DimensionPicker", {
    extend: "Ext.Component",
    requires: "Ext.XTemplate",
    alias: "widget.pedimensionpicker",
    baseCls: "x-dimension-picker",
    itemSize: 18,
    minRows: 5,
    minColumns: 5,
    maxRows: 20,
    maxColumns: 20,
    stalign: "bottom",
    padding: 4,
    clickEvent: "click",
    value: null,
    renderTpl: ['<div style="width: 100%; height: 100%;">', '<div class="{baseCls}-observecontainer">', '<div class="{baseCls}-mousecatcher"></div>', '<div class="{baseCls}-unhighlighted"></div>', '<div class="{baseCls}-highlighted"></div>', "</div>", '<div class="{baseCls}-status">0x0</div>', "</div>"],
    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    initComponent: function () {
        var me = this;
        var rootEl = undefined;
        var areaMouseCatcher = undefined;
        var areaUnHighLighted = undefined;
        var areaHighLighted = undefined;
        var areaStatus = undefined;
        var curColumns = 0;
        var curRows = 0;
        var onCatcherMouseMove = function (event, element, eOpts) {
            var pos = [event.browserEvent.layerX || (Ext.isDefined(event.browserEvent.offsetX) ? event.browserEvent.offsetX : 0), event.browserEvent.layerY || (Ext.isDefined(event.browserEvent.offsetY) ? event.browserEvent.offsetY : 0)];
            me.setTableSize(Math.floor(pos[0] / this.itemSize), Math.floor(pos[1] / this.itemSize));
        };
        var onHighLightedMouseMove = function (event, element, eOpts) {
            var pos = [event.browserEvent.layerX || (Ext.isDefined(event.browserEvent.offsetX) ? event.browserEvent.offsetX : 0), event.browserEvent.layerY || (Ext.isDefined(event.browserEvent.offsetY) ? event.browserEvent.offsetY : 0)];
            me.setTableSize(Math.ceil(pos[0] / this.itemSize), Math.ceil(pos[1] / this.itemSize));
        };
        var onUnHighLightedMouseMove = function (event, element, eOpts) {
            var pos = [event.browserEvent.layerX || (Ext.isDefined(event.browserEvent.offsetX) ? event.browserEvent.offsetX : 0), event.browserEvent.layerY || (Ext.isDefined(event.browserEvent.offsetY) ? event.browserEvent.offsetY : 0)];
            me.setTableSize(Math.ceil(pos[0] / this.itemSize), Math.ceil(pos[1] / this.itemSize));
        };
        var onHighLightedMouseClick = function (event) {
            me.fireEvent("select", me, curColumns, curRows);
        };
        this.setTableSize = function (columns, rows) {
            if (columns > this.maxColumns) {
                columns = this.maxColumns;
            }
            if (rows > this.maxRows) {
                rows = this.maxRows;
            }
            if (curColumns != columns || curRows != rows) {
                curColumns = columns;
                curRows = rows;
                areaHighLighted.setSize(curColumns + "em", curRows + "em");
                areaUnHighLighted.setSize(((curColumns < me.minColumns) ? me.minColumns : ((curColumns + 1 > me.maxColumns) ? me.maxColumns : curColumns + 1)) + "em", ((curRows < me.minRows) ? me.minRows : ((curRows + 1 > me.maxRows) ? me.maxRows : curRows + 1)) + "em");
                rootEl.setWidth(areaUnHighLighted.getWidth());
                areaStatus.update(Ext.String.format("{0} x {1}", curColumns, curRows));
                areaStatus.setWidth(areaUnHighLighted.getWidth());
                me.fireEvent("change", me, curColumns, curRows);
            }
        };
        var onAfterRender = function (ct) {
            rootEl = me.getEl();
            if (rootEl) {
                areaMouseCatcher = rootEl.down("." + me.baseCls + "-mousecatcher");
                areaUnHighLighted = rootEl.down("." + me.baseCls + "-unhighlighted");
                areaHighLighted = rootEl.down("." + me.baseCls + "-highlighted");
                areaStatus = rootEl.down("." + me.baseCls + "-status");
                rootEl.setStyle({
                    width: me.minColumns + "em"
                });
                areaMouseCatcher.setSize(me.maxColumns + "em", me.maxRows + "em");
                areaUnHighLighted.setSize(me.minColumns + "em", me.minRows + "em");
                areaStatus.update(Ext.String.format("{0} x {1}", curColumns, curRows));
                areaStatus.setWidth(areaUnHighLighted.getWidth());
            }
            areaMouseCatcher.on("mousemove", onCatcherMouseMove, me);
            areaHighLighted.on("mousemove", onHighLightedMouseMove, me);
            areaUnHighLighted.on("mousemove", onUnHighLightedMouseMove, me);
            areaHighLighted.on("click", onHighLightedMouseClick, me);
        };
        this.getColumnsCount = function () {
            return curColumns;
        };
        this.getRowsCount = function () {
            return curRows;
        };
        me.on("afterrender", onAfterRender, this);
        me.callParent(arguments);
        me.addEvents("change", "select");
    }
});