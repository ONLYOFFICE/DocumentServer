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
 Ext.define("SSE.view.FormulaDialog", {
    extend: "Ext.window.Window",
    alias: "widget.sseformuladialog",
    requires: ["Ext.window.Window", "Common.plugin.GridScrollPane"],
    modal: true,
    closable: true,
    resizable: false,
    height: 490,
    width: 300,
    constrain: true,
    padding: "10px 20px 0 20px",
    layout: {
        type: "vbox",
        align: "stretch"
    },
    initComponent: function () {
        var gp_store = Ext.create("SSE.store.FormulaGroups");
        this.cmbGroup = Ext.create("Ext.form.field.ComboBox", {
            id: "formulas-group-combo",
            store: gp_store,
            displayField: "groupname",
            queryMode: "local",
            queryDelay: 1000,
            typeAhead: false,
            editable: false,
            listeners: {
                select: function (combo, records, eOpts) {},
                specialkey: function (obj, event) {
                    if (!obj.isExpanded && event.getKey() == Ext.EventObject.ESC) {
                        this.fireEvent("onmodalresult", this, 0);
                        this.hide();
                    }
                },
                scope: this
            }
        });
        Ext.create("SSE.store.Formulas", {
            storeId: "appFormulasStore"
        });
        var funcList = Ext.create("Ext.grid.Panel", {
            activeItem: 0,
            id: "formulas-list",
            store: Ext.data.StoreManager.lookup("appFormulasStore"),
            stateful: true,
            stateId: "stateGrid",
            scroll: false,
            columns: [{
                flex: 1,
                sortable: false,
                dataIndex: "func"
            }],
            height: 250,
            hideHeaders: true,
            viewConfig: {
                stripeRows: false
            },
            plugins: [{
                pluginId: "scrollpane",
                ptype: "gridscrollpane"
            }],
            listeners: {
                itemdblclick: function (o, record, item, index, e, eOpts) {
                    this.btnOk.fireEvent("click", this.btnOk);
                },
                select: function (o, record, index, eOpts) {
                    lblSyntax.setText("Syntax: " + record.data.func + record.data.args);
                },
                viewready: function (cmp) {
                    cmp.getView().on("cellkeydown", function (obj, cell, cellIndex, record, row, rowIndex, e) {
                        if (e.getKey() == Ext.EventObject.ESC) {
                            this.fireEvent("onmodalresult", this, 0);
                            this.hide();
                            return false;
                        }
                    },
                    this);
                },
                scope: this
            }
        });
        var lblSyntax = Ext.widget("label", {});
        this.items = [{
            xtype: "container",
            layout: {
                type: "vbox",
                align: "stretch"
            },
            height: 57,
            width: 260,
            items: [{
                xtype: "label",
                text: this.textGroupDescription,
                style: "font-weight: bold;margin:0 0 4px 0;"
            },
            this.cmbGroup]
        },
        {
            xtype: "container",
            layout: {
                type: "vbox",
                align: "stretch"
            },
            height: 277,
            width: 260,
            items: [{
                xtype: "label",
                text: this.textListDescription,
                style: "font-weight:bold;margin:0 0 4px 0;"
            },
            funcList]
        },
        {
            xtype: "container",
            layout: {
                type: "vbox",
                align: "stretch"
            },
            height: 56,
            items: [lblSyntax]
        },
        {
            xtype: "tbspacer",
            height: 8,
            html: '<div style="width: 100%; height: 40%; border-bottom: 1px solid #C7C7C7"></div>'
        },
        {
            xtype: "container",
            height: 40,
            layout: {
                type: "vbox",
                align: "center",
                pack: "center"
            },
            items: [{
                xtype: "container",
                width: 182,
                height: 24,
                layout: {
                    type: "hbox",
                    align: "middle"
                },
                items: [this.btnOk = Ext.widget("button", {
                    id: "formulas-button-ok",
                    cls: "asc-blue-button",
                    width: 86,
                    height: 22,
                    margin: "0 5px 0 0",
                    text: this.okButtonText,
                    listeners: {
                        click: function (btn) {
                            this.fireEvent("onmodalresult", this, 1, funcList.getSelectionModel().selected.items[0].data.func);
                        },
                        scope: this
                    }
                }), this.btnCancel = Ext.widget("button", {
                    cls: "asc-darkgray-button",
                    width: 86,
                    height: 22,
                    text: this.cancelButtonText,
                    listeners: {
                        click: function (btn) {
                            this.fireEvent("onmodalresult", this, 0);
                            this.hide();
                        },
                        scope: this
                    }
                })]
            }]
        }];
        this.listeners = {
            show: function () {}
        };
        this.callParent(arguments);
        this.setTitle(this.txtTitle);
    },
    setGroups: function (arr) {
        var groupDesc = {
            "Cube": this.sCategoryCube,
            "Database": this.sCategoryDatabase,
            "DateAndTime": this.sCategoryDateTime,
            "Engineering": this.sCategoryEngineering,
            "Financial": this.sCategoryFinancial,
            "Information": this.sCategoryInformation,
            "Logical": this.sCategoryLogical,
            "LookupAndReference": this.sCategoryLookupAndReference,
            "Mathematic": this.sCategoryMathematics,
            "Statistical": this.sCategoryStatistical,
            "TextAndData": this.sCategoryTextData
        };
        var garr = [[this.sCategoryAll, "all"]];
        Ext.each(arr, function (item) {
            garr.push([groupDesc[item], item]);
        });
        this.cmbGroup.getStore().removeAll(true);
        this.cmbGroup.getStore().loadData(garr);
        this.cmbGroup.select(this.cmbGroup.getStore().getAt(0));
    },
    cancelButtonText: "Cancel",
    okButtonText: "Ok",
    sCategoryAll: "All",
    sCategoryLogical: "Logical",
    sCategoryCube: "Cube",
    sCategoryDatabase: "Database",
    sCategoryDateTime: "Date and time",
    sCategoryEngineering: "Engineering",
    sCategoryFinancial: "Financial",
    sCategoryInformation: "Information",
    sCategoryLookupAndReference: "LookupAndReference",
    sCategoryMathematics: "Math and trigonometry",
    sCategoryStatistical: "Statistical",
    sCategoryTextData: "Text and data",
    textGroupDescription: "Select Function Group",
    textListDescription: "Select Function",
    sDescription: "Description",
    txtTitle: "Insert Function"
});