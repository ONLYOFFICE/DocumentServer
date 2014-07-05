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
 Ext.define("Common.controller.Chat", {
    extend: "Ext.app.Controller",
    views: ["ChatPanel"],
    refs: [{
        ref: "chatPanel",
        selector: "commonchatpanel"
    },
    {
        ref: "messageList",
        selector: "#id-chat-msg"
    },
    {
        ref: "userList",
        selector: "#id-chat-users"
    },
    {
        ref: "messageTextArea",
        selector: "#id-chat-textarea"
    },
    {
        ref: "btnSend",
        selector: "#id-btn-send-msg"
    }],
    stores: ["Common.store.ChatMessages", "Common.store.Users"],
    init: function () {
        this.control({
            "#id-btn-send-msg": {
                afterrender: this.onBtnSendAfterRender,
                click: this.onBtnSendClick
            },
            "#id-chat-msg": {
                itemadd: this.onAddMessage
            },
            "#id-chat-textarea": {
                keydown: this.onTextAreaKeyDown,
                keyup: this.onTextAreaKeyUp
            },
            "#id-chat-users": {
                viewready: function () {
                    this.onUpdateUser();
                },
                itemclick: this.onUserListItemClick,
                itemupdate: this.onUpdateUser
            },
            "#view-main-menu": {
                panelshow: this.onShowPanel
            }
        });
    },
    setApi: function (o) {
        this.api = o;
        this.api.asc_registerCallback("asc_onParticipantsChanged", Ext.bind(this.onParticipantsChanged, this));
        this.api.asc_registerCallback("asc_onCoAuthoringChatReceiveMessage", Ext.bind(this.onCoAuthoringChatReceiveMessage, this));
        this.api.asc_registerCallback("asc_onAuthParticipantsChanged", Ext.bind(this.onAuthParticipantsChanged, this));
        this.api.asc_registerCallback("asc_onConnectionStateChanged", Ext.bind(this.onConnectionStateChanged, this));
        this.api.asc_coAuthoringGetUsers();
        this.api.asc_coAuthoringChatGetMessages();
        return this;
    },
    onLaunch: function () {
        Common.Gateway.on("init", Ext.bind(this.loadConfig, this));
    },
    loadConfig: function (data) {},
    _sendMessage: function () {
        var messageTextArea = this.getMessageTextArea(),
        me = this;
        if (messageTextArea) {
            var message = Ext.String.trim(messageTextArea.getValue());
            if (message.length > 0 && this.api) {
                var splitString = function (string, chunkSize) {
                    var chunks = [];
                    while (string) {
                        if (string.length < chunkSize) {
                            chunks.push(string);
                            break;
                        } else {
                            chunks.push(string.substr(0, chunkSize));
                            string = string.substr(chunkSize);
                        }
                    }
                    return chunks;
                };
                var messageList = splitString(message, 2048);
                Ext.each(messageList, function (message) {
                    me.api.asc_coAuthoringChatSendMessage(message);
                });
                messageTextArea.setValue("");
            }
        }
    },
    _updateUserOnline: function (user, online) {
        if (user) {
            user.beginEdit();
            user.set("online", online);
            if (user.get("color").length < 1) {
                user.set("color", "#" + ("000000" + Math.floor(Math.random() * 16777215).toString(16)).substr(-6));
            }
            user.endEdit();
            user.commit();
        }
    },
    onBtnSendClick: function (btn, e) {
        this._sendMessage();
        var textarea = Ext.getCmp("id-chat-textarea");
        if (textarea) {
            var doSetFocus = new Ext.util.DelayedTask(function () {
                this.api.asc_enableKeyEvents(false);
                textarea.focus();
            },
            this);
            doSetFocus.delay(100);
        }
    },
    onBtnSendAfterRender: function (cmp) {
        var btnEl = cmp.getEl(),
        messageTextArea = this.getMessageTextArea();
        if (Ext.supports.Placeholder) {
            btnEl.on("mousedown", function () {
                messageTextArea.emptyText = this.textEnterMessage;
                messageTextArea.applyEmptyText();
            },
            this);
            btnEl.on("mouseup", function () {
                messageTextArea.emptyText = " ";
                messageTextArea.applyEmptyText();
            },
            this);
        }
    },
    onAddMessage: function (records, index, node) {
        var messageList = this.getMessageList();
        if (messageList) {
            var plugin = messageList.getPlugin("scrollpane");
            if (plugin && plugin.jspApi) {
                var needScroll = plugin.jspApi.getPercentScrolledY() > 0.999;
                if (messageList.getWidth() > 0) {
                    plugin.updateScrollPane();
                }
                if (needScroll) {
                    Ext.defer(function () {
                        var node = messageList.getNode(index);
                        node && plugin.scrollToElement(node, false, true);
                    },
                    100, this);
                }
            }
        }
    },
    onUpdateUser: function (records, index, node) {
        var userList = this.getUserList();
        if (userList) {
            var onlinecount = userList.getStore().getOnlineUserCount();
            if (onlinecount > 10) {
                onlinecount = 10;
            }
            userList.setHeight((onlinecount < 4) ? 70 : onlinecount * 18 + 12);
            var plugin = userList.getPlugin("scrollpane");
            if (plugin && userList.getEl().dom.clientWidth > 0) {
                plugin.updateScrollPane();
            }
        }
    },
    onTextAreaKeyUp: function (field, event) {
        if (event.getKey() == event.ENTER) {
            field.emptyText = " ";
            field.applyEmptyText();
        }
    },
    onTextAreaKeyDown: function (field, event) {
        if (event.getKey() == event.ENTER) {
            if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
                if (field.getValue().length < 1) {
                    field.emptyText = this.textEnterMessage;
                    field.applyEmptyText();
                } else {
                    this._sendMessage();
                }
                event.stopEvent();
            }
        }
    },
    onUserListItemClick: function (view, record, item, index, e) {},
    onParticipantsChanged: function (e) {},
    onCoAuthoringChatReceiveMessage: function (messages) {
        var messagesStore = this.getCommonStoreChatMessagesStore();
        if (messagesStore) {
            Ext.each(messages, function (item) {
                messagesStore.add({
                    type: 0,
                    userid: item.user,
                    message: item.message,
                    username: item.username
                });
            });
        }
    },
    onAuthParticipantsChanged: function (users) {
        var userStore = this.getCommonStoreUsersStore();
        if (userStore) {
            var record, me = this;
            Ext.each(users, function (user) {
                record = userStore.add({
                    id: user.asc_getId(),
                    username: user.asc_getUserName()
                })[0];
                this._updateUserOnline(record, true);
            },
            this);
        }
    },
    onConnectionStateChanged: function (change) {
        var userStore = this.getCommonStoreUsersStore();
        if (userStore) {
            var record = userStore.findRecord("id", change.asc_getId());
            if (!record) {
                record = userStore.add({
                    id: change.asc_getId(),
                    username: change.asc_getUserName()
                })[0];
            }
            this._updateUserOnline(userStore.findRecord("id", change.asc_getId()), change.asc_getState());
        }
    },
    onShowPanel: function (panel, fulscreen) {
        var activeStep = panel.down("container");
        if (activeStep && activeStep.isXType("commonchatpanel")) {
            var messageList = this.getMessageList(),
            userList = this.getUserList(),
            plugin;
            if (messageList) {
                plugin = messageList.getPlugin("scrollpane");
                if (plugin) {
                    plugin.updateScrollPane();
                    plugin.jspApi.scrollToPercentY(100, true);
                }
            }
            if (userList) {
                plugin = userList.getPlugin("scrollpane");
                if (plugin) {
                    plugin.updateScrollPane();
                }
            }
        }
    },
    textEnterMessage: "Enter your message here",
    capGuest: "Guest"
});