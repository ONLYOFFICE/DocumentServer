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
 Ext.define("SSE.view.SheetRenameDialog", {
    extend: "Ext.window.Window",
    alias: "widget.ssesheetrenamedialog",
    requires: ["Ext.window.Window"],
    modal: true,
    closable: true,
    resizable: false,
    preventHeader: true,
    plain: true,
    height: 116,
    width: 280,
    padding: "20px",
    layout: "vbox",
    constrain: true,
    layoutConfig: {
        align: "stretch"
    },
    listeners: {
        show: function () {
            this.txtName.focus(true, 100);
        }
    },
    initComponent: function () {
        this.addEvents("onmodalresult");
        var me = this;
        var checkName = function (n) {
            var ac = me.names.length;
            while (! (--ac < 0)) {
                if (me.names[ac] == n) {
                    return ac == me.renameindex ? -255 : true;
                }
            }
            return false;
        };
        var _btnOk = Ext.create("Ext.Button", {
            id: "wsrenamedialog-button-ok",
            text: Ext.Msg.buttonText.ok,
            width: 80,
            cls: "asc-blue-button",
            listeners: {
                click: function () {
                    if (
                    /*me.txtName.getValue().length ||*/
                    ! me.txtName.isValid()) {} else {
                        var res = checkName(me.txtName.getValue());
                        if (res === true) {
                            Ext.Msg.show({
                                title: me.errTitle,
                                msg: me.errNameExists,
                                icon: Ext.Msg.ERROR,
                                buttons: Ext.Msg.OK,
                                fn: function () {
                                    me.txtName.focus(true, 500);
                                }
                            });
                        } else {
                            me._modalresult = res == -255 ? 0 : 1;
                            me.fireEvent("onmodalresult", me, me._modalresult, me.txtName.getValue());
                            me.close();
                        }
                    }
                }
            }
        });
        var _btnCancel = Ext.create("Ext.Button", {
            id: "wsrenamedialog-button-cancel",
            text: me.cancelButtonText,
            width: 80,
            cls: "asc-darkgray-button",
            listeners: {
                click: function () {
                    me._modalresult = 0;
                    me.fireEvent("onmodalresult", me, me._modalresult);
                    me.close();
                }
            }
        });
        this.txtName = Ext.create("Ext.form.Text", {
            id: "wsrenamedialog-text-wsname",
            width: 240,
            msgTarget: "side",
            validateOnBlur: false,
            allowBlank: false,
            value: this.names[this.renameindex],
            enforceMaxLength: true,
            maxLength: 31,
            validator: function (value) {
                if (value.length > 2 && value[0] == '"' && value[value.length - 1] == '"') {
                    return true;
                }
                if (!/[:\\\/\*\?\[\]\']/.test(value)) {
                    return true;
                } else {
                    return me.errNameWrongChar;
                }
            },
            listeners: {
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        _btnOk.fireEvent("click");
                    } else {
                        if (e.getKey() == e.ESC) {
                            _btnCancel.fireEvent("click");
                        }
                    }
                }
            }
        });
        this.items = [{
            xtype: "label",
            text: this.labelSheetName,
            width: "100%",
            style: "text-align:left"
        },
        {
            xtype: "tbspacer",
            height: 4
        },
        this.txtName, {
            xtype: "tbspacer",
            height: 4
        },
        {
            xtype: "container",
            width: 240,
            layout: "hbox",
            layoutConfig: {
                align: "stretch"
            },
            items: [{
                xtype: "tbspacer",
                flex: 1
            },
            _btnOk, {
                xtype: "tbspacer",
                width: 5
            },
            _btnCancel]
        }];
        this.callParent(arguments);
    },
    labelSheetName: "Sheet Name",
    errTitle: "Error",
    errNameExists: "Worksheet with such name already exist.",
    errNameWrongChar: "A sheet name cannot contain characters: \\/*?[]:",
    cancelButtonText: "Cancel"
});