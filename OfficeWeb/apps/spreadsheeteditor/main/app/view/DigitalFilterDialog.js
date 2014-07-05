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
 Ext.define("SSE.view.DigitalFilterDialog", {
    extend: "Ext.window.Window",
    alias: "widget.ssedigitalfilterdialog",
    requires: ["Ext.window.Window"],
    modal: true,
    closable: true,
    resizable: false,
    height: 226,
    width: 500,
    constrain: true,
    padding: "20px 20px 0 20px",
    layout: {
        type: "vbox",
        align: "stretch"
    },
    initComponent: function () {
        var me = this;
        var storeCondition = Ext.create("Ext.data.Store", {
            fields: ["condition", "caption"],
            data: [{
                condition: c_oAscCustomAutoFilter.equals,
                caption: me.capCondition1
            },
            {
                condition: c_oAscCustomAutoFilter.doesNotEqual,
                caption: me.capCondition2
            },
            {
                condition: c_oAscCustomAutoFilter.isGreaterThan,
                caption: me.capCondition3
            },
            {
                condition: c_oAscCustomAutoFilter.isGreaterThanOrEqualTo,
                caption: me.capCondition4
            },
            {
                condition: c_oAscCustomAutoFilter.isLessThan,
                caption: me.capCondition5
            },
            {
                condition: c_oAscCustomAutoFilter.isLessThanOrEqualTo,
                caption: me.capCondition6
            },
            {
                condition: c_oAscCustomAutoFilter.beginsWith,
                caption: me.capCondition7
            },
            {
                condition: c_oAscCustomAutoFilter.doesNotBeginWith,
                caption: me.capCondition8
            },
            {
                condition: c_oAscCustomAutoFilter.endsWith,
                caption: me.capCondition9
            },
            {
                condition: c_oAscCustomAutoFilter.doesNotEndWith,
                caption: me.capCondition10
            },
            {
                condition: c_oAscCustomAutoFilter.contains,
                caption: me.capCondition11
            },
            {
                condition: c_oAscCustomAutoFilter.doesNotContain,
                caption: me.capCondition12
            }]
        });
        this.cmbCondition1 = Ext.create("Ext.form.field.ComboBox", {
            store: storeCondition,
            displayField: "caption",
            valueField: "condition",
            queryMode: "local",
            typeAhead: false,
            style: "margin-right: 10px",
            width: 200,
            editable: false
        });
        this.txtValue1 = Ext.create("Ext.form.Text", {
            flex: 1,
            value: ""
        });
        this.txtValue2 = Ext.create("Ext.form.Text", {
            flex: 1,
            value: ""
        });
        var storeCondition2 = Ext.create("Ext.data.Store", {
            fields: ["condition", "caption"],
            data: [{
                condition: 0,
                caption: me.textNoFilter
            }]
        });
        storeCondition2.loadRecords(storeCondition.data.getRange(), {
            addRecords: true
        });
        this.cmbCondition2 = Ext.create("Ext.form.field.ComboBox", {
            store: storeCondition2,
            displayField: "caption",
            valueField: "condition",
            queryMode: "local",
            typeAhead: false,
            style: "margin-right: 10px",
            width: 200,
            editable: false
        });
        this.rbMixer = Ext.widget("radiogroup", {
            columns: 2,
            width: 120,
            items: [{
                boxLabel: me.capAnd,
                name: "mix",
                inputValue: "and",
                checked: true
            },
            {
                boxLabel: me.capOr,
                name: "mix",
                inputValue: "or"
            }]
        });
        var btnOk = Ext.create("Ext.Button", {
            text: Ext.Msg.buttonText.ok,
            width: 80,
            cls: "asc-blue-button",
            listeners: {
                click: function () {
                    me.fireEvent("onmodalresult", me, 1);
                    me.close();
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
            xtype: "label",
            style: "font-weight: bold;margin:0 0 4px 0;",
            text: me.textShowRows
        },
        {
            xtype: "container",
            style: "margin:10px 0 0 0;",
            layout: {
                type: "hbox",
                align: "middle"
            },
            items: [this.cmbCondition1, this.txtValue1]
        },
        {
            xtype: "container",
            layout: {
                type: "hbox",
                align: "middle"
            },
            items: [this.rbMixer]
        },
        {
            xtype: "container",
            layout: {
                type: "hbox",
                align: "middle"
            },
            items: [this.cmbCondition2, this.txtValue2]
        },
        {
            xtype: "tbspacer",
            height: 3
        },
        {
            xtype: "container",
            width: 400,
            style: "margin:10px 0 0 0;",
            layout: {
                type: "hbox",
                align: "middle"
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
        this._defaults = [];
        this._defaults.properties = config;
    },
    getSettings: function () {
        var ret_out = new Asc.AutoFiltersOptions();
        ret_out.asc_setCellId(this._defaults.properties.asc_getCellId());
        ret_out.asc_setIsChecked(this.rbMixer.getValue().mix == "or");
        ret_out.asc_setFilter1(this.cmbCondition1.getValue());
        ret_out.asc_setFilter2(this.cmbCondition2.getValue() || undefined);
        ret_out.asc_setValFilter1(this.txtValue1.getValue());
        ret_out.asc_setValFilter2(this.txtValue2.getValue());
        return ret_out;
    },
    _setDefaults: function () {
        this.rbMixer.setValue({
            mix: this._defaults.properties.asc_getIsChecked() ? "or" : "and"
        });
        this.cmbCondition1.setValue(this._defaults.properties.asc_getFilter1() || c_oAscCustomAutoFilter.equals);
        this.cmbCondition2.setValue(this._defaults.properties.asc_getFilter2() || 0);
        this.txtValue1.setValue(this._defaults.properties.asc_getValFilter1());
        this.txtValue2.setValue(this._defaults.properties.asc_getValFilter2());
    },
    txtTitle: "Custom Filter",
    capCondition1: "equals",
    capCondition2: "does not equal",
    capCondition3: "is greater than",
    capCondition4: "is greater than or equal to",
    capCondition5: "is less than",
    capCondition6: "is less than or equal to",
    capCondition7: "begins with",
    capCondition8: "does not begin with",
    capCondition9: "ends with",
    capCondition10: "does not end with",
    capCondition11: "contains",
    capCondition12: "does not contain",
    capAnd: "And",
    capOr: "Or",
    textShowRows: "Show rows where",
    textUse1: "Use ? to present any single character",
    textUse2 : "Use * to present any series of character",
    textNoFilter: "no filter",
    cancelButtonText: "Cancel"
});