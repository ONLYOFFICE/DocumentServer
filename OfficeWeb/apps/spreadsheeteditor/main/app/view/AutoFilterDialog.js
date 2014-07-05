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
 Ext.define("SSE.view.AutoFilterDialog", {
    extend: "Ext.window.Window",
    alias: "widget.sseautofilterdialog",
    requires: ["Ext.window.Window", "Common.plugin.GridScrollPane", "Common.component.SearchField"],
    modal: true,
    closable: true,
    resizable: false,
    height: 350,
    width: 270,
    constrain: true,
    padding: "20px 20px 0 20px",
    layout: {
        type: "vbox",
        align: "stretch"
    },
    initComponent: function () {
        var me = this;
        this.addEvents("onmodalresult");
        this.btnSortDesc = Ext.create("Ext.Button", {
            iconCls: "asc-toolbar-btn btn-sort-up",
            width: 28,
            enableToggle: true,
            toggleGroup: "autoFilterSort",
            allowDepress: false,
            listeners: {
                click: function () {
                    me.fireEvent("onmodalresult", me, 3, "descending");
                    me.close();
                }
            }
        });
        this.btnSortAsc = Ext.create("Ext.Button", {
            iconCls: "asc-toolbar-btn btn-sort-down",
            width: 28,
            enableToggle: true,
            style: "margin: 0 6px 0 0",
            toggleGroup: "autoFilterSort",
            allowDepress: false,
            listeners: {
                click: function () {
                    me.fireEvent("onmodalresult", me, 3, "ascending");
                    me.close();
                }
            }
        });
        this.chCustomFilter = Ext.widget("checkbox", {
            style: "margin: 0 6px 0 0",
            disabled: true,
            boxLabel: ""
        });
        var btnCustomFilter = Ext.create("Ext.Button", {
            width: 120,
            text: me.btnCustomFilter,
            listeners: {
                click: function () {
                    me.fireEvent("onmodalresult", me, 2);
                    me.close();
                }
            }
        });
        var range, full_range;
        var txtSearch = Ext.create("Common.component.SearchField", {
            style: "margin: 10px 0",
            emptyText: me.txtEmpty,
            listeners: {
                change: function (obj, newval, oldval, opts) {
                    me.cellsStore.clearFilter(true);
                    if (oldval && newval.length < oldval.length) {
                        selectionModel.selected.clear();
                        full_range = me.cellsStore.getAt(0).ischecked;
                        range = me.cellsStore.getRange(full_range ? 0 : 1);
                        range.forEach(function (record) {
                            (full_range || record.ischecked) && selectionModel.selected.add(record);
                        });
                    }
                    if (newval.length) {
                        me.cellsStore.filter([{
                            property: "cellvalue",
                            value: new RegExp(newval, "i")
                        },
                        {
                            property: "rowvisible",
                            value: /^((?!ever|hidden).)*$/
                        }]);
                    } else {
                        me.cellsStore.filter("rowvisible", /^((?!hidden).)*$/);
                    }
                },
                searchstart: function (obj, text) {
                    me.cellsStore.filter([{
                        property: "cellvalue",
                        value: new RegExp(text, "i")
                    },
                    {
                        property: "rowvisible",
                        value: /^((?!ever|hidden).)*$/
                    }]);
                    this.stopSearch(true);
                },
                searchclear: function () {}
            }
        });
        this.cellsStore = Ext.create("Ext.data.Store", {
            fields: ["cellvalue", "rowvisible", "groupid", "intval", "strval"]
        });
        var selectionModel = Ext.create("Ext.selection.CheckboxModel", {
            mode: "SIMPLE",
            listeners: {
                deselect: function (obj, record, index) {
                    me.chCustomFilter.getValue() && me.chCustomFilter.setValue(false);
                    record.ischecked = false;
                    if (record.data.rowvisible == "ever") {
                        obj.deselectAll();
                        me.cellsStore.getRange(1).forEach(function (rec) {
                            rec.ischecked = false;
                        });
                    } else {
                        var srecord = me.cellList.getStore().getAt(0);
                        if (srecord.data.rowvisible == "ever" && obj.isSelected(srecord)) {
                            srecord.ischecked = false;
                            obj.deselect(srecord, true);
                        }
                    }
                },
                select: function (obj, record, index) {
                    me.chCustomFilter.getValue() && me.chCustomFilter.setValue(false);
                    record.ischecked = true;
                    if (record.data.rowvisible == "ever") {
                        obj.select(me.cellList.getStore().getRange(1), false, true);
                        obj.select(me.cellList.getStore().getAt(0), true, true);
                        me.cellsStore.getRange(1).forEach(function (rec) {
                            rec.ischecked = true;
                        });
                    }
                }
            }
        });
        this.cellList = Ext.create("Ext.grid.Panel", {
            activeItem: 0,
            selModel: selectionModel,
            store: this.cellsStore,
            stateful: true,
            stateId: "stateGrid",
            scroll: false,
            columns: [{
                flex: 1,
                sortable: false,
                dataIndex: "cellvalue"
            }],
            height: 160,
            hideHeaders: true,
            style: "margin: 0 0 14px 0",
            viewConfig: {
                stripeRows: false
            },
            plugins: [{
                ptype: "gridscrollpane"
            }]
        });
        var btnOk = Ext.create("Ext.Button", {
            text: Ext.Msg.buttonText.ok,
            width: 80,
            cls: "asc-blue-button",
            listeners: {
                click: function () {
                    if (!selectionModel.getCount()) {
                        Ext.Msg.show({
                            title: me.textWarning,
                            msg: me.warnNoSelected,
                            icon: Ext.Msg.WARNING,
                            buttons: Ext.Msg.OK
                        });
                    } else {
                        me.fireEvent("onmodalresult", me, me.chCustomFilter.getValue() ? 0 : 1);
                        me.close();
                    }
                }
            }
        });
        var btnCancel = Ext.create("Ext.Button", {
            text: me.cancelButtonText,
            width: 80,
            listeners: {
                click: function () {
                    me.fireEvent("onmodalresult", me, 0);
                    me.close();
                }
            }
        });
        this.items = [{
            xtype: "container",
            height: 30,
            layout: {
                type: "hbox"
            },
            items: [this.btnSortAsc, this.btnSortDesc, {
                xtype: "tbspacer",
                flex: 1
            },
            this.chCustomFilter, btnCustomFilter]
        },
        txtSearch, this.cellList, {
            xtype: "container",
            width: 250,
            layout: "hbox",
            layoutConfig: {
                align: "stretch"
            },
            items: [{
                xtype: "tbspacer",
                flex: 1
            },
            btnOk, {
                xtype: "tbspacer",
                width: 5
            },
            btnCancel]
        }];
        this.callParent(arguments);
        this.setTitle(this.txtTitle);
    },
    afterRender: function () {
        this.callParent(arguments);
        this._setDefaults();
    },
    setSettings: function (config) {
        var arr = [{
            cellvalue: this.textSelectAll,
            rowvisible: "ever",
            groupid: "0"
        }];
        var isnumber, value;
        config.asc_getResult().forEach(function (item) {
            value = item.asc_getVal();
            isnumber = Ext.isNumeric(value);
            arr.push({
                cellvalue: value,
                rowvisible: item.asc_getVisible(),
                groupid: "1",
                intval: isnumber ? parseFloat(value) : undefined,
                strval: !isnumber ? value : ""
            });
        });
        this.cellsStore.loadData(arr);
        this.cellsStore.group("groupid");
        this._defaults = [];
        this._defaults.properties = config;
    },
    getSettings: function () {
        var ret_out = new Asc.AutoFiltersOptions();
        ret_out.asc_setCellId(this._defaults.properties.asc_getCellId());
        var result_arr = [],
        visibility,
        me = this;
        this.cellsStore.clearFilter(true);
        var records = this.cellsStore.getRange(1);
        records.forEach(function (item) {
            if ((visibility = item.get("rowvisible")) != "hidden") {
                visibility = me.cellList.getSelectionModel().isSelected(item);
            }
            result_arr.push(new Asc.AutoFiltersOptionsElements(item.get("cellvalue"), visibility));
        });
        ret_out.asc_setResult(result_arr);
        ret_out.sortState = this._defaults.properties.asc_getSortState();
        return ret_out;
    },
    _setDefaults: function () {
        var sort = this._defaults.properties.asc_getSortState();
        if (sort) {
            this[sort == "ascending" ? "btnSortAsc" : "btnSortDesc"].toggle(true, true);
        }
        var store = this.cellList.getStore(),
        selectionModel = this.cellList.getSelectionModel();
        store.filter("rowvisible", /^((?!hidden).)*$/);
        var count = store.getCount(),
        item,
        isSelectAll = true;
        while (count > 1) {
            item = store.getAt(--count);
            if (item.data.rowvisible === true) {
                selectionModel.select(item, true, true);
                item.ischecked = true;
            } else {
                isSelectAll = false;
            }
        }
        if (isSelectAll) {
            store.getAt(0).ischecked = true;
            selectionModel.select(0, true, true);
        }
        this.chCustomFilter.setValue(this._defaults.properties.asc_getIsCustomFilter() === true);
    },
    btnCustomFilter: "Custom Filter",
    textSelectAll: "Select All",
    txtTitle: "Filter",
    warnNoSelected: "You must choose at least one value",
    textWarning: "Warning",
    cancelButtonText: "Cancel",
    txtEmpty: "Enter cell's filter"
});