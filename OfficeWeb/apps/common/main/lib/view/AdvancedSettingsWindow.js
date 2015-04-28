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
 define(["common/main/lib/component/Window"], function () {
    Common.Views.AdvancedSettingsWindow = Common.UI.Window.extend(_.extend({
        initialize: function (options) {
            var _options = {};
            _.extend(_options, {
                height: 200,
                header: true,
                cls: "advanced-settings-dlg",
                toggleGroup: "advanced-settings-group",
                contentTemplate: "",
                items: []
            },
            options);
            this.template = options.template || ['<div class="box" style="height:' + (_options.height - 85) + 'px;">', '<div class="menu-panel">', "<% _.each(items, function(item) { %>", '<button class="btn btn-category" style="margin-bottom: 2px;" content-target="<%= item.panelId %>"><span class=""><%= item.panelCaption %></span></button>', "<% }); %>", "</div>", '<div class="separator"/>', '<div class="content-panel" >' + _options.contentTemplate + "</div>", "</div>", '<div class="separator horizontal"/>', '<div class="footer center">', '<button class="btn normal dlg-btn primary" result="ok" style="margin-right: 10px;">' + this.okButtonText + "</button>", '<button class="btn normal dlg-btn" result="cancel">' + this.cancelButtonText + "</button>", "</div>"].join("");
            _options.tpl = _.template(this.template, _options);
            this.handler = _options.handler;
            this.toggleGroup = _options.toggleGroup;
            this.contentWidth = _options.contentWidth;
            Common.UI.Window.prototype.initialize.call(this, _options);
        },
        render: function () {
            Common.UI.Window.prototype.render.call(this);
            var me = this;
            var $window = this.getChild();
            $window.find(".dlg-btn").on("click", _.bind(this.onDlgBtnClick, this));
            this.btnsCategory = [];
            _.each($window.find(".btn-category"), function (item, index) {
                var btnEl = $(item);
                var btn = new Common.UI.Button({
                    el: btnEl,
                    enableToggle: true,
                    toggleGroup: me.toggleGroup,
                    allowDepress: false,
                    contentTarget: btnEl.attr("content-target")
                });
                btn.on("click", _.bind(me.onCategoryClick, me));
                me.btnsCategory.push(btn);
            });
            var cnt_panel = $window.find(".content-panel");
            cnt_panel.width(this.contentWidth);
            $window.width($window.find(".menu-panel").width() + cnt_panel.outerWidth() + 1);
            this.content_panels = $window.find(".settings-panel");
            if (this.btnsCategory.length > 0) {
                this.btnsCategory[0].toggle(true, true);
            }
        },
        setHeight: function (height) {
            Common.UI.Window.prototype.setHeight.call(this, height);
            var $window = this.getChild();
            var boxEl = $window.find(".body > .box");
            boxEl.css("height", height - 85);
        },
        onDlgBtnClick: function (event) {
            var state = event.currentTarget.attributes["result"].value;
            if (this.handler && this.handler.call(this, state, (state == "ok") ? this.getSettings() : undefined)) {
                return;
            }
            this.close();
        },
        onCategoryClick: function (btn, event) {
            this.content_panels.filter(".active").removeClass("active");
            $("#" + btn.options.contentTarget).addClass("active");
        },
        getSettings: function () {
            return;
        },
        onPrimary: function () {
            if (this.handler && this.handler.call(this, "ok", this.getSettings())) {
                return;
            }
            this.close();
            return false;
        },
        cancelButtonText: "Cancel",
        okButtonText: "Ok"
    },
    Common.Views.AdvancedSettingsWindow || {}));
});