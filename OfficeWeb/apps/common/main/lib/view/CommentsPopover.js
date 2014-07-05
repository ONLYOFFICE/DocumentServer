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
 Ext.define("Common.view.CommentsPopover", {
    extend: "Ext.container.Container",
    alias: "widget.commoncommentspopover",
    cls: "common-commentspopover",
    requires: ["Common.plugin.DataViewScrollPane", "Common.plugin.TextAreaAutoHeight", "Ext.XTemplate", "Ext.view.View"],
    layout: {
        type: "vbox",
        align: "stretch"
    },
    width: 250,
    height: 300,
    minHeight: 50,
    maxHeight: 300,
    hideMode: "display",
    config: {
        commentId: 0,
        userId: 0
    },
    constructor: function (config) {
        if (!config || !config.commentId || !config.userId) {
            throw Error("Common.view.CommentsPopover creation failed: required parameters are missing.");
        }
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    initComponent: function () {
        var me = this,
        usersStore = Ext.getStore("Common.store.Users");
        me.id = "id-popover-comments-" + me.commentId;
        me.items = [{
            xtype: "container",
            html: '<div class="popover-arrow"></div>'
        },
        {
            xtype: "dataview",
            flex: 1,
            id: "id-popover-comments-view-" + me.commentId,
            cls: "comments-view popover",
            store: "Common.store.Comments",
            blockRefresh: true,
            disableSelection: true,
            tpl: new Ext.XTemplate('<tpl for=".">', '<tpl if="this.canDisplay(values.id)">', '<div class="comment-wrap" id="id-popover-comment-{id}">', '<div class="header">', '<div class="user-info" >', '<div class="user">{[this.getUserName(values.userid, values.username)]}</div>', '<div class="date">{[this.getLocaleDate(values.date)]}</div>', "</div>", '<div class="edit-info" <tpl if="!this.hideControls()">style="display:none;"</tpl> >', '<tpl if="this.canEditReply(userid)">', '<div class="btn-header comment edit"></div>', '<div class="btn-header comment delete"></div>', "</tpl>", '<tpl if="resolved">', '<label class="resolve resolved">', me.textResolved, "</label>", "</tpl>", '<tpl if="!resolved">', '<label class="resolve">', me.textResolve, "</label>", "</tpl>", "</div>", "</div>", '<div class="comment-message">', '<div class="comment" data-can-copy="true">{[this.fixMessage(values.comment)]}</div>', "</div>", '<div class="replys">', '<tpl for="replys">', '<div class="reply" id="reply-{id}">', '<div class="header">', '<div class="user-info" >', '<div class="user">{[this.getUserName(values.userid, values.username)]}</div>', '<div class="date">{[this.getLocaleDate(values.date)]}</div>', "</div>", '<div class="edit-info" <tpl if="!this.hideControls()">style="display:none;"</tpl> >', '<tpl if="this.canEditReply(userid)">', '<div class="btn-header reply edit"></div>', '<div class="btn-header reply delete"></div>', "</tpl>", "</div>", "</div>", '<div class="reply-message">', '<div class="message" data-can-copy="true">{[this.fixMessage(values.reply)]}</div>', "</div>", "</div>", "</tpl>", "</div>", "</div>", "</tpl>", '<tpl if="!this.canDisplay(values.id)">', '<div class="comment-wrap hidden"></div>', "</tpl>", "</tpl>", '<div class="x-clear"></div>', {
                compiled: true,
                canDisplay: function (commentId) {
                    return (commentId == me.commentId);
                },
                canEditReply: function (id) {
                    return true;
                },
                getFixedQuote: function (quote) {
                    return Ext.String.ellipsis(Ext.String.htmlEncode(quote), 120, true);
                },
                getLocaleDate: function (date) {
                    if (!date) {
                        return Ext.String.format("{0} {1}", "--/--/--", "--:-- AM");
                    } else {
                        var dateVal = new Date(date);
                        return Ext.String.format("{0} {1}", Ext.Date.format(dateVal, "n/j/Y"), Ext.Date.format(dateVal, "g:i A"));
                    }
                },
                getUserColor: function (id) {
                    if (usersStore) {
                        var rec = usersStore.findRecord("id", id);
                        if (rec) {
                            return rec.data.color;
                        }
                    }
                    return "#000";
                },
                getUserName: function (id, username) {
                    if (usersStore) {
                        var rec = usersStore.findRecord("id", id);
                        if (rec) {
                            return Ext.String.ellipsis(Ext.String.htmlEncode(rec.get("username")), 15, true);
                        } else {
                            if (Ext.isString(username) && username.length > 0) {
                                return username;
                            }
                        }
                    }
                    return me.textAnonym;
                },
                fixMessage: function (msg) {
                    var pickLink = function (message) {
                        var reg = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}/i.exec(message);
                        if (reg) {
                            message = message.replace(reg[0], '<a href="mailto:' + reg[0] + ">" + reg[0] + "</a>");
                        } else {
                            reg = message.match(/((https?|ftps?):\/\/)(www.)?([a-z0-9-]+)(\.[a-z]{2,6})?(\/\S*)?/ig); ! reg && (reg = message.match(/((https?|ftps?):\/\/)?(www.)?([a-z0-9-]+)(\.[a-z]{2,6})(\/\S*)?/ig));
                            for (var key in reg) {
                                message = message.replace(reg[key], '<a href="' + (reg[key].search(/((https?|ftps?):\/\/)/g) < 0 ? "http://": "") + reg[key] + '" target="_blank">' + reg[key] + "</a>");
                            }
                        }
                        return (message);
                    };
                    var htmlEncode = function (message) {
                        return Ext.String.htmlEncode(message);
                    };
                    return pickLink(htmlEncode(msg)).replace(/\n/g, "<br/>");
                },
                hideControls: function () {
                    return ! (me.editable === false);
                }
            }),
            itemSelector: "div.comment-wrap",
            emptyText: "",
            autoScroll: true,
            plugins: [{
                ptype: "dataviewscrollpane",
                pluginId: "scrollpane",
                areaSelector: ".comments-view",
                settings: {
                    enableKeyboardNavigation: true,
                    verticalGutter: 1
                }
            }]
        },
        {
            xtype: "container",
            id: "id-popover-add-reply-link-" + me.commentId,
            cls: "reply-link-container add-link",
            action: "add-reply-link-container",
            hidden: me.editable === false,
            items: [{
                xtype: "label",
                text: me.textAddReply,
                action: "link"
            }]
        },
        {
            xtype: "container",
            id: "id-popover-controls-reply-" + me.commentId,
            cls: "controls-reply-container",
            action: "add-reply-form-container",
            layout: {
                type: "vbox",
                align: "stretch"
            },
            height: 100,
            hidden: true,
            items: [{
                xtype: "textarea",
                emptyText: me.textAddReply,
                action: "add-reply-textarea",
                enableKeyEvents: true,
                plugins: [{
                    ptype: "textareaautoheight",
                    pluginId: "elastic-helper"
                }]
            },
            {
                xtype: "container",
                layout: "hbox",
                height: 26,
                id: "id-popover-controls-reply-" + me.commentId + "-buttons",
                items: [{
                    xtype: "button",
                    text: me.textReply,
                    cls: "asc-blue-button",
                    action: "reply"
                },
                {
                    xtype: "tbspacer",
                    width: 10
                },
                {
                    xtype: "button",
                    text: me.textClose,
                    action: "close"
                }]
            }]
        }];
        me.callParent(arguments);
    },
    afterRender: function () {
        this.callParent(arguments);
        var selfEl = this.getEl();
        if (selfEl) {
            Ext.DomHelper.append(selfEl, '<div class="lock-area"></div><div class="lock-author"></div>');
        }
    },
    fireTransformToAdd: function () {
        this.fireEvent("transformToAdd", this);
    },
    textAnonym: "Guest",
    textResolved: "Resolved",
    textResolve: "Resolve",
    textAddReply: "Add Reply",
    textReply: "Reply",
    textClose: "Close"
});