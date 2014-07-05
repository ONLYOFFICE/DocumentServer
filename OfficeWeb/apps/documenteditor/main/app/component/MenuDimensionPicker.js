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
 Ext.define("DE.component.MenuDimensionPicker", {
    extend: "Ext.menu.Menu",
    alias: "widget.demenudimensionpicker",
    requires: ["DE.component.DimensionPicker"],
    hideOnClick: true,
    minWidth: 10,
    minHeight: 10,
    maxWidth: 1000,
    maxHeight: 1000,
    minRows: 5,
    minColumns: 5,
    maxRows: 20,
    maxColumns: 20,
    baseCls: "dimension-picker-menu",
    initComponent: function () {
        var me = this,
        cfg = Ext.apply({},
        me.initialConfig);
        delete cfg.listeners;
        Ext.apply(me, {
            plain: true,
            showSeparator: false,
            items: Ext.applyIf({
                xtype: "dedimensionpicker",
                minRows: this.minRows,
                minColumns: this.minColumns,
                maxRows: this.maxRows,
                maxColumns: this.maxColumns
            },
            cfg)
        });
        me.callParent(arguments);
        me.picker = me.down("dedimensionpicker");
        me.relayEvents(me.picker, ["select"]);
        if (me.hideOnClick) {
            me.on("select", me.hidePickerOnSelect, me);
        }
        var onPickerChange = function (picker, columns, rows) {
            var width = ((columns < me.picker.minColumns) ? me.picker.minColumns : ((columns + 1 > me.picker.maxColumns) ? me.picker.maxColumns : columns + 1));
            var height = ((rows < me.picker.minRows) ? me.picker.minRows : ((rows + 1 > me.picker.maxRows) ? me.picker.maxRows : rows + 1));
            width = width * me.picker.itemSize + 2 * me.picker.padding;
            height = height * me.picker.itemSize + 2 * me.picker.padding + me.picker.itemSize;
            me.setSize(width, height);
        };
        me.picker.addListener("change", onPickerChange, this);
    },
    show: function (animateTarget, callback, scope) {
        var me = this;
        me.callParent(arguments);
        me.picker.setTableSize(0, 0);
        this.setSize(me.picker.minColumns * me.picker.itemSize + 2 * me.picker.padding, me.picker.minRows * me.picker.itemSize + 2 * me.picker.padding + me.picker.itemSize);
    },
    hidePickerOnSelect: function (picker, columns, rows) {
        Ext.menu.Manager.hideAll();
    }
});