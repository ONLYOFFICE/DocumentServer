/*
 * (c) Copyright Ascensio System SIA 2010-2015
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
 if (Common === undefined) {
    var Common = {};
}
Common.Views = Common.Views || {};
define(["text!common/main/lib/template/Chat.template", "common/main/lib/util/utils", "common/main/lib/component/BaseView"], function (template) {
    Common.Views.Chat = Common.UI.BaseView.extend(_.extend({
        el: "#left-panel-chat",
        template: _.template(template),
        storeUsers: undefined,
        storeMessages: undefined,
        tplUser: ['<li id="chat-user-<%= user.get("id") %>"<% if (!user.get("online")) { %> class="offline"<% } %>>', '<div class="color" style="background-color: <%= user.get("color") %>;" >', '<label class="name"><%= scope.getUserName(user.get("username")) %></label>', "</div>", "</li>"].join(""),
        templateUserList: _.template("<ul>" + "<% _.each(users, function(item) { %>" + "<%= _.template(usertpl, {user: item, scope: scope}) %>" + "<% }); %>" + "</ul>"),
        tplMsg: ["<li>", '<% if (msg.get("type")==1) { %>', '<div class="message service" data-can-copy="true"><%= msg.get("message") %></div>', "<% } else { %>", '<div class="user" data-can-copy="true" style="color: <%= msg.get("usercolor") %>;"><%= scope.getUserName(msg.get("username")) %></div>', '<label class="message" data-can-copy="true"><%= msg.get("message") %></label>', "<% } %>", "</li>"].join(""),
        templateMsgList: _.template("<ul>" + "<% _.each(messages, function(item) { %>" + "<%= _.template(msgtpl, {msg: item, scope: scope}) %>" + "<% }); %>" + "</ul>"),
        events: {},
        initialize: function (options) {
            _.extend(this, options);
            Common.UI.BaseView.prototype.initialize.call(this, arguments);
            this.storeUsers.bind({
                add: _.bind(this._onAddUser, this),
                change: _.bind(this._onUsersChanged, this),
                reset: _.bind(this._onResetUsers, this)
            });
            this.storeMessages.bind({
                add: _.bind(this._onAddMessage, this),
                reset: _.bind(this._onResetMessages, this)
            });
        },
        render: function (el) {
            el = el || this.el;
            $(el).html(this.template({
                scope: this
            }));
            this.panelUsers = $("#chat-users", this.el);
            this.panelMessages = $("#chat-messages", this.el);
            this.txtMessage = $("#chat-msg-text", this.el);
            this.panelUsers.scroller = new Common.UI.Scroller({
                el: $("#chat-users"),
                useKeyboard: true,
                minScrollbarLength: 25
            });
            this.panelMessages.scroller = new Common.UI.Scroller({
                el: $("#chat-messages"),
                includePadding: true,
                useKeyboard: true,
                minScrollbarLength: 40
            });
            $("#chat-msg-btn-add", this.el).on("click", _.bind(this._onBtnAddMessage, this));
            this.txtMessage.on("keydown", _.bind(this._onKeyDown, this));
            return this;
        },
        focus: function () {
            var me = this;
            _.defer(function () {
                me.txtMessage.focus();
            },
            100);
        },
        _onKeyDown: function (event) {
            if (event.keyCode == Common.UI.Keys.RETURN) {
                if (event.ctrlKey || event.metaKey) {
                    this._onBtnAddMessage(event);
                }
            } else {
                if (event.keyCode == Common.UI.Keys.ESC) {
                    this.hide();
                }
            }
        },
        _onAddUser: function (m, c, opts) {
            if (this.panelUsers) {
                this.panelUsers.find("ul").append(_.template(this.tplUser, {
                    user: m,
                    scope: this
                }));
                this.panelUsers.scroller.update({
                    minScrollbarLength: 25
                });
            }
        },
        _onUsersChanged: function (m) {
            if (m.changed.online != undefined && this.panelUsers) {
                this.panelUsers.find("#chat-user-" + m.get("id"))[m.changed.online ? "removeClass" : "addClass"]("offline");
                this.panelUsers.scroller.update({
                    minScrollbarLength: 25
                });
            }
        },
        _onResetUsers: function (c, opts) {
            if (this.panelUsers) {
                this.panelUsers.html(this.templateUserList({
                    users: c.models,
                    usertpl: this.tplUser,
                    scope: this
                }));
                this.panelUsers.scroller.update({
                    minScrollbarLength: 25
                });
            }
        },
        _onAddMessage: function (m, c, opts) {
            if (this.panelMessages) {
                var content = this.panelMessages.find("ul");
                if (content && content.length) {
                    this._prepareMessage(m);
                    content.append(_.template(this.tplMsg, {
                        msg: m,
                        scope: this
                    }));
                    this.panelMessages.scroller.update({
                        minScrollbarLength: 40
                    });
                    this.panelMessages.scroller.scrollTop(content.get(0).getBoundingClientRect().height);
                }
            }
        },
        _onResetMessages: function (c, opts) {
            if (this.panelMessages) {
                var user, color;
                c.each(function (msg) {
                    this._prepareMessage(msg);
                },
                this);
                this.panelMessages.html(this.templateMsgList({
                    messages: c.models,
                    msgtpl: this.tplMsg,
                    scope: this
                }));
                this.panelMessages.scroller.update({
                    minScrollbarLength: 40
                });
            }
        },
        _onBtnAddMessage: function (e) {
            if (this.txtMessage) {
                this.fireEvent("message:add", [this, this.txtMessage.val().trim()]);
                this.txtMessage.val("");
                this.focus();
            }
        },
        _prepareMessage: function (m) {
            var user = this.storeUsers.findUser(m.get("userid"));
            m.set({
                usercolor: user ? user.get("color") : "#000",
                message: this._pickLink(Common.Utils.String.htmlEncode(m.get("message")))
            },
            {
                silent: true
            });
        },
        _pickLink: function (message) {
            var arr = [],
            offset,
            len;
            message.replace(Common.Utils.emailStrongRe, function (subStr) {
                offset = arguments[arguments.length - 2];
                arr.push({
                    start: offset,
                    end: subStr.length + offset,
                    str: '<a href="' + subStr + '">' + subStr + "</a>"
                });
                return "";
            });
            message.replace(Common.Utils.ipStrongRe, function (subStr) {
                offset = arguments[arguments.length - 2];
                len = subStr.length;
                var elem = _.find(arr, function (item) {
                    return ((offset >= item.start) && (offset < item.end) || (offset <= item.start) && (offset + len > item.start));
                });
                if (!elem) {
                    arr.push({
                        start: offset,
                        end: len + offset,
                        str: '<a href="' + subStr + '" target="_blank" data-can-copy="true">' + subStr + "</a>"
                    });
                }
                return "";
            });
            message.replace(Common.Utils.hostnameStrongRe, function (subStr) {
                var ref = (!/(((^https?)|(^ftp)):\/\/)/i.test(subStr)) ? ("http://" + subStr) : subStr;
                offset = arguments[arguments.length - 2];
                len = subStr.length;
                var elem = _.find(arr, function (item) {
                    return ((offset >= item.start) && (offset < item.end) || (offset <= item.start) && (offset + len > item.start));
                });
                if (!elem) {
                    arr.push({
                        start: offset,
                        end: len + offset,
                        str: '<a href="' + ref + '" target="_blank" data-can-copy="true">' + subStr + "</a>"
                    });
                }
                return "";
            });
            arr = _.sortBy(arr, function (item) {
                return item.start;
            });
            var str_res = (arr.length > 0) ? (message.substring(0, arr[0].start) + arr[0].str) : message;
            for (var i = 1; i < arr.length; i++) {
                str_res += (message.substring(arr[i - 1].end, arr[i].start) + arr[i].str);
            }
            if (arr.length > 0) {
                str_res += message.substring(arr[i - 1].end, message.length);
            }
            return str_res;
        },
        getUserName: function (username) {
            return Common.Utils.String.htmlEncode(username);
        },
        hide: function () {
            Common.UI.BaseView.prototype.hide.call(this, arguments);
            this.fireEvent("hide", this);
        },
        textSend: "Send"
    },
    Common.Views.Chat || {}));
});