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
 Ext.define("SSE.view.CellInfo", {
    extend: "Ext.container.Container",
    alias: "widget.ssecellinfo",
    cls: "sse-cellinfo",
    uses: ["SSE.view.FormulaDialog"],
    height: 23,
    initComponent: function () {
        var me = this;
        this.addEvents("editcomplete");
        this.txtName = Ext.widget("textfield", {
            id: "infobox-cell-name",
            width: 70,
            height: this.height,
            cls: "asc-input-aslabel",
            fieldStyle: "border-radius:0;"
        });
        this._cellInput = Ext.widget("textarea", {
            id: "infobox-cell-edit",
            inputId: "infobox-cell-input",
            flex: 1,
            style: "margin:0;opacity:1;",
            fieldStyle: "border-radius:0;font-size:14px;padding:0 3px;line-height:21px;",
            enableKeyEvents: true,
            enterIsSpecial: true
        });
        var style = "padding:4px 0 0 4px;border-bottom:solid 1px #AFAFAF; background:#E9E9E9 url(resources/img/toolbar-menu.png) no-repeat 0 -1416px;";
        style += 'background-image: -webkit-image-set(url("resources/img/toolbar-menu.png") 1x, url("resources/img/toolbar-menu@2x.png") 2x);';
        this._lblFunct = Ext.widget("box", {
            width: 20,
            height: this.height,
            id: "func-label-box",
            style: style,
            listeners: {
                afterrender: function (c) {
                    $("#func-label-box").hover(function () {
                        this.style.backgroundPosition = this.mdown ? "-40px -1416px" : "-20px -1416px";
                    },
                    function () {
                        this.style.backgroundPosition = "0 -1416px";
                    });
                    $("#func-label-box").mousedown(function () {
                        this.style.backgroundPosition = "-40px -1416px";
                        var hdown = this;
                        hdown.mdown = true;
                        var upHandler = function () {
                            hdown.mdown = false;
                            $(document).unbind("mouseup", upHandler);
                        };
                        $(document).mouseup(upHandler);
                    });
                    $("#func-label-box").click(function (e) {
                        if (me.permissions.isEdit) {
                            dlgFormulas.addListener("onmodalresult", function (o, mr, s) {
                                me.fireEvent("editcomplete", me);
                            },
                            me, {
                                single: true
                            });
                            dlgFormulas.show();
                        }
                    });
                }
            }
        });
        this.keep_height = 180;
        var btnExpand = Ext.widget("button", {
            width: 16,
            height: this.height,
            id: "infobox-cell-multiline-button",
            style: "border-radius: 0;",
            iconCls: "infobox-cell-multiline-button"
        });
        Ext.apply(me, {
            style: "overflow:visible;",
            layout: {
                type: "hbox",
                align: "stretch"
            },
            items: [{
                xtype: "container",
                cls: "infobox-container-border",
                id: "infobox-container-cell-name",
                width: 90,
                layout: {
                    type: "hbox"
                },
                items: [this.txtName, this._lblFunct]
            },
            this._cellInput, {
                xtype: "container",
                items: [btnExpand]
            }]
        },
        me.initialConfig);
        me.callParent(arguments);
    },
    updateCellInfo: function (info) {
        if (info) {
            this.txtName.setValue(typeof(info) == "string" ? info : info.asc_getName());
        }
    },
    setMode: function (m) {
        if (m.isDisconnected) {
            this.permissions.isEdit = false;
        } else {
            this.permissions = m;
        }
        $("#" + this._lblFunct.id).css("cursor", m.isEdit ? "pointer" : "default");
    }
});