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
 Ext.define("Common.view.ChatPanel", {
    extend: "Ext.container.Container",
    alias: "widget.commonchatpanel",
    cls: "common-chatpanel",
    requires: ["Common.plugin.DataViewScrollPane", "Ext.XTemplate", "Ext.view.View", "Ext.form.Label", "Ext.util.TextMetrics"],
    layout: {
        type: "vbox",
        align: "stretch"
    },
    createDelayedElements: function () {
        var me = this,
        usersStore = Ext.getStore("Common.store.Users");
        me.add([{
            xtype: "label",
            cls: "chat-header",
            text: this.textChat,
            width: "100%"
        },
        {
            xtype: "dataview",
            height: 65,
            width: "100%",
            id: "id-chat-users",
            cls: "chat-users-view",
            group: "scrollable",
            store: "Common.store.Users",
            blockRefresh: true,
            disableSelection: true,
            tpl: new Ext.XTemplate('<tpl for=".">', '<tpl if="online">', '<div class="chat-user-wrap">', '<div class="color" style="background-color: {[this.getUserColor(values.id)]};"></div>', '<label class="name">{[this.getUserName(values.id)]}</label>', "</div>", "</tpl>", '<tpl if="!online">', '<div class="chat-user-wrap hidden"></div>', "</tpl>", "</tpl>", {
                compiled: true,
                getUserColor: function (id) {
                    if (usersStore) {
                        var rec = usersStore.findRecord("id", id);
                        if (rec) {
                            return rec.data.color;
                        }
                    }
                    return "#000";
                },
                getUserName: function (id) {
                    if (usersStore) {
                        var rec = usersStore.findRecord("id", id);
                        if (rec) {
                            return Ext.String.ellipsis(Ext.String.htmlEncode(rec.get("username")), 23, true);
                        }
                    }
                    return this.textAnonymous;
                }
            }),
            itemSelector: "div.chat-user-wrap",
            overItemCls: "x-item-over",
            emptyText: "There is no authorized users",
            autoScroll: true,
            plugins: [{
                ptype: "dataviewscrollpane",
                pluginId: "scrollpane",
                areaSelector: ".chat-users-view",
                settings: {
                    enableKeyboardNavigation: true,
                    verticalGutter: 1
                }
            }]
        },
        {
            xtype: "dataview",
            flex: 1,
            id: "id-chat-msg",
            cls: "chat-msg-view",
            group: "scrollable",
            store: "Common.store.ChatMessages",
            blockRefresh: true,
            disableSelection: true,
            tpl: new Ext.XTemplate('<tpl for=".">', '<div class="chat-msg-wrap">', '<tpl if="type == 1">', '<div class="message service">{[this.fixMessage(values.message)]}</div>', "</tpl>", '<tpl if="type != 1">', '<label class="user" data-can-copy="true" style="color: {[this.getUserColor(values.userid)]};">{username}:&nbsp</label>', '<label class="message" data-can-copy="true">{[this.fixMessage(values.message)]}</label>', "</tpl>", "</div>", "</tpl>", {
                compiled: true,
                getUserColor: function (id) {
                    if (usersStore) {
                        var rec = usersStore.findRecord("id", id);
                        if (rec) {
                            return rec.data.color;
                        }
                    }
                    return "#000";
                },
                getUserName: function (id) {
                    if (usersStore) {
                        var rec = usersStore.findRecord("id", id);
                        if (rec) {
                            return Ext.String.ellipsis(Ext.String.htmlEncode(rec.get("username")), 23, true);
                        }
                    }
                    return me.textAnonymous;
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
            itemSelector: "div.chat-msg-wrap",
            emptyText: "",
            autoScroll: true,
            plugins: [{
                ptype: "scrollpane",
                pluginId: "scrollpane",
                areaSelector: ".chat-msg-view",
                settings: {
                    enableKeyboardNavigation: true,
                    verticalGutter: 1
                }
            }]
        },
        {
            xtype: "tbspacer",
            height: 10
        },
        {
            xtype: "container",
            layout: {
                type: "vbox",
                align: "stretch"
            },
            cls: "add-msg-container",
            height: 100,
            items: [{
                xtype: "textarea",
                id: "id-chat-textarea",
                height: 62,
                enableKeyEvents: true
            },
            {
                xtype: "container",
                layout: "hbox",
                items: [{
                    xtype: "tbspacer",
                    flex: 1
                },
                {
                    xtype: "button",
                    id: "id-btn-send-msg",
                    cls: "btn-send-msg asc-blue-button",
                    text: this.textSend
                }]
            }]
        }]);
    },
    textChat: "Chat",
    textSend: "Send",
    textAnonymous: "Guest"
});