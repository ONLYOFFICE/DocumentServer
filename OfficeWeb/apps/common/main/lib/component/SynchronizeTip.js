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
 Ext.define("Common.component.SynchronizeTip", {
    extend: "Ext.container.Container",
    alias: "widget.commonsynchronizetip",
    cls: "asc-synchronizetip",
    requires: ["Ext.button.Button", "Ext.form.Label"],
    layout: {
        type: "vbox",
        align: "stretch"
    },
    width: 240,
    height: 95,
    hideMode: "visibility",
    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    initComponent: function () {
        var me = this;
        me.addEvents("dontshowclick");
        me.addEvents("closeclick");
        var btnClose = Ext.widget("button", {
            cls: "btn-close-tip",
            iconCls: "icon-close-tip",
            listeners: {
                click: function () {
                    me.fireEvent("closeclick", me);
                }
            }
        });
        me.items = [{
            xtype: "container",
            html: '<div class="tip-arrow"></div>'
        },
        {
            xtype: "container",
            flex: 1,
            style: "padding-left: 15px;",
            layout: {
                type: "hbox",
                align: "stretch"
            },
            items: [{
                xtype: "container",
                flex: 1,
                style: "margin-top: 15px;line-height: 1.2;",
                html: "<div>" + me.textSynchronize + "</div>"
            },
            btnClose]
        },
        {
            xtype: "container",
            cls: "show-link",
            items: [{
                xtype: "label",
                text: me.textDontShow,
                listeners: {
                    afterrender: function (cmp) {
                        cmp.getEl().on("click", function (event, node) {
                            me.fireEvent("dontshowclick", me);
                        });
                    },
                    scope: this
                }
            }]
        }];
        me.callParent(arguments);
    },
    textDontShow: "Don't show this message again",
    textSynchronize: "The document has changed. <br/>Refresh the document to see the updates."
});