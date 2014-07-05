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
 Ext.define("PE.view.InsertTableDialog", {
    extend: "Ext.window.Window",
    alias: "widget.peinserttabledialog",
    requires: ["Ext.window.Window"],
    modal: true,
    closable: false,
    resizable: false,
    preventHeader: true,
    plain: true,
    height: 172,
    width: 236,
    padding: "20px",
    layout: {
        type: "vbox",
        align: "stretch"
    },
    listeners: {
        show: function () {
            this.udColumns.focus(false, 500);
        }
    },
    initComponent: function () {
        var me = this;
        this.addEvents("onmodalresult");
        this.items = [{
            xtype: "label",
            text: this.labelTitle || this.txtTitle,
            style: "margin: 0 0 15px 0; font-size: 15px;"
        },
        {
            xtype: "container",
            height: 32,
            layout: {
                type: "hbox",
                align: "stretch"
            },
            items: [{
                xtype: "label",
                padding: "4px 0 0 0",
                width: 130,
                text: this.txtColumns
            },
            this.udColumns = Ext.widget("numberfield", {
                minValue: 1,
                maxValue: 63,
                value: 2,
                step: 1,
                width: 64,
                allowDecimals: false,
                validateOnBlur: false,
                msgTarget: "side",
                minText: this.txtMinText,
                maxText: this.txtMaxText,
                listeners: {
                    specialkey: Ext.bind(function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            this.btnOk.fireEvent("click");
                        } else {
                            if (e.getKey() == e.ESC) {
                                this.btnCancel.fireEvent("click");
                            }
                        }
                    },
                    this)
                }
            })]
        },
        {
            xtype: "container",
            height: 42,
            layout: {
                type: "hbox",
                align: "stretch"
            },
            items: [{
                xtype: "label",
                padding: "4px 0 0 0",
                width: 130,
                text: this.txtRows
            },
            this.udRows = Ext.widget("numberfield", {
                minValue: 1,
                maxValue: 100,
                value: 2,
                step: 1,
                width: 64,
                allowDecimals: false,
                validateOnBlur: false,
                msgTarget: "side",
                minText: this.txtMinText,
                maxText: this.txtMaxText,
                listeners: {
                    specialkey: Ext.bind(function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            this.btnOk.fireEvent("click");
                        } else {
                            if (e.getKey() == e.ESC) {
                                this.btnCancel.fireEvent("click");
                            }
                        }
                    },
                    this)
                }
            })]
        },
        {
            xtype: "container",
            height: 30,
            layout: {
                type: "vbox",
                align: "center"
            },
            items: [{
                xtype: "container",
                width: 182,
                layout: {
                    type: "hbox",
                    align: "middle"
                },
                items: [this.btnOk = Ext.widget("button", {
                    cls: "asc-blue-button",
                    width: 86,
                    height: 22,
                    margin: "0 5px 0 0",
                    text: this.okButtonText,
                    listeners: {
                        click: function (btn) {
                            var valid_cols = this.udColumns.isValid();
                            var valid_rows = this.udRows.isValid();
                            if (!valid_cols || !valid_rows) {
                                return;
                            }
                            this.fireEvent("onmodalresult", this, 1, [this.udColumns.value, this.udRows.value]);
                            this.close();
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
                            this.close();
                        },
                        scope: this
                    }
                })]
            }]
        }];
        this.callParent(arguments);
    },
    txtTitle: "Table size",
    txtColumns: "Number of Columns",
    txtRows: "Number of Rows",
    textInvalidRowsCols: "You need to specify valid rows and columns count.",
    cancelButtonText: "Cancel",
    okButtonText: "Ok",
    txtMinText: "The minimum value for this field is {0}",
    txtMaxText: "The maximum value for this field is {0}"
});