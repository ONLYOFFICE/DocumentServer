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
 Ext.define("Common.view.CommentsPanel", {
    extend: "Ext.container.Container",
    alias: "widget.commoncommentspanel",
    cls: "common-commentspanel",
    requires: ["Common.plugin.DataViewScrollPane", "Ext.Date", "Ext.XTemplate", "Ext.form.Label"],
    uses: ["Common.plugin.TextAreaAutoHeight", "Ext.util.TextMetrics"],
    layout: {
        type: "vbox",
        align: "stretch"
    },
    config: {
        currentUserId: -1
    },
    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    initComponent: function () {
        var me = this,
        usersStore = Ext.getStore("Common.store.Users");
        me.items = [{
            xtype: "label",
            cls: "comments-header",
            text: me.textComments,
            width: "100%"
        },
        {
            xtype: "dataview",
            flex: 1,
            id: "id-comments",
            cls: "comments-view",
            group: "scrollable",
            store: Ext.getStore("Common.store.Comments") || Ext.create("Common.store.Comments", {
                storeId: "Common.store.Comments"
            }),
            blockRefresh: true,
            disableSelection: true,
            tpl: new Ext.XTemplate('<tpl for=".">', '<tpl if="lock">', '<div class="comment-wrap lock" id="comment-{id}">', "</tpl>", '<tpl if="!lock">', '<div class="comment-wrap" id="comment-{id}">', "</tpl>", '<div class="header">', '<div class="user-info" >', '<div class="user">{[this.getUserName(values.userid, values.username)]}</div>', '<div class="date">{[this.getLocaleDate(values.date)]}</div>', "</div>", '<div class="edit-info">', '<tpl if="this.canEditReply(userid)">', '<div class="btn-header comment edit"></div>', '<div class="btn-header comment delete"></div>', "</tpl>", '<tpl if="resolved">', '<label class="resolve resolved">', me.textResolved, "</label>", "</tpl>", '<tpl if="!resolved">', '<label class="resolve">', me.textResolve, "</label>", "</tpl>", "</div>", "</div>", (me.noQuotes) ? "" : '<div class="quote">{[this.getFixedQuote(values.quote)]}</div>', '<div class="comment-message">', '<div class="comment" data-can-copy="true">{[this.fixMessage(values.comment)]}</div>', "</div>", '<div class="replys">', '<tpl for="replys">', '<div class="reply" id="reply-{id}">', '<div class="header">', '<div class="user-info" >', '<div class="user">{[this.getUserName(values.userid, values.username)]}</div>', '<div class="date">{[this.getLocaleDate(values.date)]}</div>', "</div>", '<div class="edit-info">', '<tpl if="this.canEditReply(userid)">', '<div class="btn-header reply edit"></div>', '<div class="btn-header reply delete"></div>', "</tpl>", "</div>", "</div>", '<div class="reply-message">', '<div class="message" data-can-copy="true">{[this.fixMessage(values.reply)]}</div>', "</div>", "</div>", "</tpl>", "</div>", '<div id="comment-{id}-add-reply-container" class="add-reply-container"></div>', '<div class="separator"></div>', '<div class="lock-area"></div>', '<div class="lock-author">{[this.getLockUserName(values.lockuserid)]}</div>', "</div>", "</tpl>", '<div class="last-clear"></div>', '<div class="x-clear"></div>', {
                compiled: true,
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
                getLockUserName: function (id) {
                    if (usersStore) {
                        var rec = usersStore.findRecord("id", id);
                        if (rec) {
                            return Ext.String.ellipsis(Ext.String.htmlEncode(rec.get("username")), 15, true);
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
            id: "id-add-comment-link",
            cls: "add-comment-container add-link",
            html: "<label>" + me.textAddCommentToDoc + "</label>",
            height: 45
        },
        {
            xtype: "container",
            layout: {
                type: "vbox",
                align: "stretch"
            },
            id: "id-add-comment-container",
            cls: "add-comment-container",
            height: 115,
            hidden: true,
            items: [{
                xtype: "textarea",
                id: "id-comment-textarea",
                height: 62,
                enableKeyEvents: true
            },
            {
                xtype: "container",
                layout: "hbox",
                items: [{
                    xtype: "button",
                    id: "id-btn-send-comment",
                    cls: "btn-send-comment asc-blue-button",
                    text: me.textAddComment
                },
                {
                    xtype: "tbspacer",
                    flex: 1
                },
                {
                    xtype: "button",
                    id: "id-btn-cancel-comment",
                    text: me.textCancel
                }]
            }]
        }];
        this.getAddReplyForm = function (config) {
            var scope = config.scope,
            commentId = config.commentId,
            textAreaHandlers = config.textAreaHandlers,
            onReply = config.onReplyHandler,
            onClose = config.onCloseHandler;
            return Ext.widget("container", {
                id: "controls-reply-" + commentId,
                cls: "controls-reply-container",
                layout: {
                    type: "vbox",
                    align: "stretch"
                },
                hidden: true,
                height: 80,
                items: [{
                    xtype: "textarea",
                    flex: 1,
                    emptyText: me.textAddReply,
                    enableKeyEvents: true,
                    listeners: {
                        focus: Ext.bind(textAreaHandlers.onFocus, scope),
                        blur: Ext.bind(textAreaHandlers.onBlur, scope),
                        keydown: Ext.bind(textAreaHandlers.onKeyDown, scope),
                        elastic: Ext.bind(textAreaHandlers.onElastic, scope)
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
                    id: "controls-reply-" + commentId + "-buttons",
                    items: [{
                        xtype: "button",
                        text: me.textReply,
                        cls: "asc-blue-button",
                        action: "reply",
                        handler: Ext.bind(function (btn, event) {
                            onReply.call(scope, btn);
                        },
                        scope)
                    },
                    {
                        xtype: "tbspacer",
                        width: 10
                    },
                    {
                        xtype: "button",
                        text: me.textClose,
                        handler: Ext.bind(function (btn, event) {
                            onClose.call(scope, btn);
                        },
                        scope)
                    }]
                }]
            });
        };
        me.callParent(arguments);
    },
    textComments: "Comments",
    textAnonym: "Guest",
    textAddCommentToDoc: "Add Comment to Document",
    textAddComment: "Add Comment",
    textCancel: "Cancel",
    textAddReply: "Add Reply",
    textReply: "Reply",
    textClose: "Close",
    textResolved: "Resolved",
    textResolve: "Resolve"
});