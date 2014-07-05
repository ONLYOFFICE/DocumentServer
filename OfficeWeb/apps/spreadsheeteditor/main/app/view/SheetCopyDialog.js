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
 Ext.define("SSE.view.SheetCopyDialog", {
    extend: "Ext.window.Window",
    alias: "widget.ssesheetcopydialog",
    requires: ["Ext.window.Window", "Common.plugin.GridScrollPane"],
    modal: true,
    closable: true,
    resizable: false,
    plain: true,
    height: 300,
    width: 280,
    padding: "20px",
    layout: "vbox",
    constrain: true,
    layoutConfig: {
        align: "stretch"
    },
    listeners: {
        show: function () {
            this.sheetList.getSelectionModel().select(0);
        }
    },
    initComponent: function () {
        var me = this;
        var _btnOk = Ext.create("Ext.Button", {
            id: "wscopydialog-button-ok",
            text: Ext.Msg.buttonText.ok,
            width: 80,
            cls: "asc-blue-button",
            listeners: {
                click: function () {
                    me._modalresult = 1;
                    me.fireEvent("onmodalresult", me, me._modalresult, me.sheetList.getSelectionModel().selected.items[0].data.sheetindex);
                    me.close();
                }
            }
        });
        var _btnCancel = Ext.create("Ext.Button", {
            id: "wscopydialog-button-cancel",
            text: me.cancelButtonText,
            width: 80,
            cls: "asc-darkgray-button",
            listeners: {
                click: function () {
                    me._modalresult = 0;
                    me.fireEvent("onmodalresult", this, this._modalresult);
                    me.close();
                }
            }
        });
        Ext.define("worksheet", {
            extend: "Ext.data.Model",
            fields: [{
                type: "int",
                name: "sheetindex"
            },
            {
                type: "string",
                name: "name"
            }]
        });
        this.sheetList = Ext.create("Ext.grid.Panel", {
            activeItem: 0,
            id: "wscopydialog-sheetlist-list",
            scroll: false,
            store: {
                model: "worksheet",
                data: this.names
            },
            columns: [{
                flex: 1,
                sortable: false,
                dataIndex: "name"
            }],
            plugins: [{
                ptype: "gridscrollpane"
            }],
            height: 160,
            width: 240,
            hideHeaders: true,
            listeners: {
                itemdblclick: function (o, record, item, index, e, eOpts) {
                    _btnOk.fireEvent("click", _btnOk);
                }
            }
        });
        this.items = [{
            xtype: "label",
            text: this.listtitle || this.labelList,
            width: "100%",
            style: "text-align:left"
        },
        {
            xtype: "tbspacer",
            height: 10
        },
        this.sheetList, {
            xtype: "tbspacer",
            height: 14
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
    labelList: "Copy before sheet",
    cancelButtonText: "Cancel"
});