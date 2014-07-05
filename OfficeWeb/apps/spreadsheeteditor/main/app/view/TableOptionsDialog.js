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
 Ext.define("SSE.view.TableOptionsDialog", {
    extend: "Ext.window.Window",
    alias: "widget.tableoptionsdialog",
    requires: ["Ext.window.Window"],
    closable: true,
    resizable: false,
    height: 145,
    width: 300,
    padding: "12px 20px 0 20px",
    constrain: true,
    layout: {
        type: "vbox",
        align: "stretch"
    },
    listeners: {
        show: function () {
            var options = this.api.asc_getAddFormatTableOptions();
            this.txtDataRange.setValue(options.asc_getRange());
            this.chTitle.setValue(options.asc_getIsTitle());
            this.api.asc_setSelectionDialogMode(true, options.asc_getRange());
        },
        beforedestroy: function () {
            this.api.asc_setSelectionDialogMode(false);
        }
    },
    initComponent: function () {
        var me = this;
        var worksheets = "",
        names = this.names;
        if (names) {
            worksheets = names[0];
            var i = names.length;
            while (--i) {
                worksheets += ("|" + names[i]);
            }
        }
        var longRe = new RegExp(worksheets + "![A-Z]+[1-9]\d*:[A-Z]+[1-9]\d*");
        var shortRe = new RegExp(worksheets + "![A-Z]+[1-9]\d*");
        this.txtDataRange = Ext.create("Ext.form.Text", {
            height: 22,
            msgTarget: "side",
            validateOnBlur: false,
            allowBlank: false,
            value: "",
            editable: false,
            check: false,
            validator: function (value) {
                if (!this.check) {
                    return true;
                }
                var isvalid = longRe.test(value); ! isvalid && (isvalid = shortRe.test(value));
                if (isvalid) {
                    $("#" + this.id + " input").css("color", "black");
                    return true;
                } else {
                    $("#" + this.id + " input").css("color", "red");
                    return "ERROR! Invalid cells range";
                }
            }
        });
        this.chTitle = Ext.widget("checkbox", {
            style: "margin: 0 26px 0 0",
            boxLabel: this.txtTitle
        });
        var _btnOk = Ext.create("Ext.Button", {
            text: Ext.Msg.buttonText.ok,
            width: 80,
            style: "margin: 0 6px 0 0;",
            cls: "asc-blue-button",
            listeners: {
                click: function () {
                    if (me.txtDataRange.validate()) {
                        me.fireEvent("onmodalresult", me, 1, me.getSettings());
                        me.close();
                    }
                }
            }
        });
        var _btnCancel = Ext.create("Ext.Button", {
            text: this.textCancel,
            width: 80,
            cls: "asc-darkgray-button",
            listeners: {
                click: function () {
                    me.close();
                }
            }
        });
        this.items = [this.txtDataRange, this.chTitle, {
            xtype: "container",
            height: 26,
            style: "margin: 8px 0 0 0;",
            layout: {
                type: "hbox",
                align: "stretch",
                pack: "end"
            },
            items: [_btnOk, _btnCancel]
        }];
        if (this.api) {
            this.api.asc_registerCallback("asc_onSelectionRangeChanged", Ext.bind(this._onRangeChanged, this));
        }
        this.callParent(arguments);
        this.setTitle(this.txtFormat);
    },
    _onRangeChanged: function (info) {
        this.txtDataRange.setValue(info);
    },
    getSettings: function () {
        var options = this.api.asc_getAddFormatTableOptions();
        options.asc_setRange(this.txtDataRange.getValue());
        options.asc_setIsTitle(this.chTitle.getValue());
        return options;
    },
    txtTitle: "Title",
    txtFormat: "Format as table",
    textCancel: "Cancel"
});