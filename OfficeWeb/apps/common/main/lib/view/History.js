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
define(["common/main/lib/util/utils", "common/main/lib/component/BaseView", "common/main/lib/component/Layout"], function (template) {
    Common.Views.History = Common.UI.BaseView.extend(_.extend({
        el: "#left-panel-history",
        storeHistory: undefined,
        template: _.template(['<div id="history-box" class="layout-ct vbox">', '<div id="history-header" class="">', '<label id="history-btn-back" class="btn"><%=scope.textHistoryHeader%></label>', "</div>", '<div id="history-list" class="">', "</div>", "</div>"].join("")),
        initialize: function (options) {
            _.extend(this, options);
            Common.UI.BaseView.prototype.initialize.call(this, arguments);
        },
        render: function (el) {
            el = el || this.el;
            $(el).html(this.template({
                scope: this
            })).width((parseInt(localStorage.getItem("de-mainmenu-width")) || MENU_SCALE_PART) - SCALE_MIN);
            this.viewHistoryList = new Common.UI.DataView({
                el: $("#history-list"),
                store: this.storeHistory,
                enableKeyEvents: false,
                itemTemplate: _.template(['<div id="<%= id %>" class="history-item-wrap" style="display: block;">', '<div class="user-date"><%= created %></div>', "<% if (markedAsVersion) { %>", '<div class="user-version">ver.<%=version%></div>', "<% } %>", '<div class="user-name">', '<div class="color" style="display: inline-block; background-color:' + "<%=usercolor%>;" + '" >', "</div><%= Common.Utils.String.htmlEncode(username) %>", "</div>", "</div>"].join(""))
            });
            this.btnBackToDocument = new Common.UI.Button({
                el: $("#history-btn-back"),
                enableToggle: false
            });
            this.trigger("render:after", this);
            return this;
        },
        textHistoryHeader: "Back to Document"
    },
    Common.Views.History || {}));
});