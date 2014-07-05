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
 Ext.define("Common.view.CommentsEditForm", {
    extend: "Ext.container.Container",
    alias: "widget.commoncommentseditform",
    cls: "common-commentseditform",
    requires: ["Common.plugin.TextAreaAutoHeight", "Ext.form.TextArea", "Ext.Button"],
    layout: {
        type: "vbox",
        align: "stretch"
    },
    constructor: function (config) {
        this.initConfig(config);
        if (!config || !config.scope || !config.editId || !config.renderTo || !config.onEditHandler || !config.onCancelHandler) {
            throw Error("Common.view.CommentsEditForm creation failed: required parameters are missing.");
        }
        this.callParent(arguments);
        return this;
    },
    initComponent: function () {
        var me = this;
        me.id = "controls-edit-msg-" + me.editId;
        me.cls = "controls-edit-msg-container";
        me.height = 80;
        me.items = [{
            xtype: "textarea",
            height: 20,
            value: me.msgValue,
            enableKeyEvents: true,
            listeners: {
                elastic: Ext.bind(this.elasticTextArea, this),
                keydown: Ext.bind(this.keyDownTextArea, this)
            },
            plugins: [{
                ptype: "textareaautoheight",
                pluginId: "elastic-helper"
            }]
        },
        {
            xtype: "container",
            layout: "hbox",
            height: 26,
            id: "controls-edit-msg-" + me.editId + "-buttons",
            items: [{
                xtype: "button",
                text: me.textEdit,
                cls: "asc-blue-button",
                action: "edit",
                handler: Ext.bind(function (btn, event) {
                    me.onEditHandler.call(me.scope, btn);
                },
                me.scope)
            },
            {
                xtype: "tbspacer",
                width: 10
            },
            {
                xtype: "button",
                text: me.textCancel,
                handler: Ext.bind(function (btn, event) {
                    me.onCancelHandler.call(me.scope, btn);
                },
                me.scope)
            }]
        }];
        me.on("afterrender", Ext.bind(this.onAfterRender, this));
        me.callParent(arguments);
    },
    onAfterRender: function (cmp) {
        var textarea = cmp.down("textarea");
        if (textarea) {
            textarea.fireEvent("change");
        }
    },
    elasticTextArea: function (cmp, width, height) {
        var parent = cmp.ownerCt;
        if (parent) {
            var editContainer = parent.down("container");
            if (editContainer) {
                var paddingTop = parseInt(parent.getEl().getStyle("padding-top")),
                paddingBottom = parseInt(parent.getEl().getStyle("padding-bottom"));
                var editContainerHeight = editContainer.rendered ? editContainer.getHeight() : editContainer.height || 0;
                parent.setHeight(height + editContainerHeight + paddingTop + paddingBottom + 5);
            }
        }
    },
    keyDownTextArea: function (field, event) {
        if (event.getKey() == event.ENTER) {
            if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
                var me = this;
                if (field.getValue().length > 0) {
                    event.stopEvent();
                    me.onEditHandler.call(me.scope, me.down("button[action=edit]"));
                }
            }
        }
    },
    textEdit: "Edit",
    textCancel: "Cancel"
});