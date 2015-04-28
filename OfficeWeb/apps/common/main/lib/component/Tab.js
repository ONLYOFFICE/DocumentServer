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
define(["common/main/lib/component/BaseView"], function (base) {
    var Tab = function (opts) {
        this.active = false;
        this.label = "Tab";
        this.cls = "";
        this.template = _.template(['<li class="<% if(active){ %>active<% } %> <% if(cls.length){%><%= cls %><%}%>" data-label="<%= label %>">', "<a><%- label %></a>", "</li>"].join(""));
        this.initialize.call(this, opts);
        return this;
    };
    _.extend(Tab.prototype, {
        initialize: function (options) {
            _.extend(this, options);
        },
        render: function () {
            var el = this.template(this);
            this.$el = $(el);
            this.rendered = true;
            this.disable(this.disabled);
            return this;
        },
        isActive: function () {
            return this.$el.hasClass("active");
        },
        activate: function () {
            if (!this.$el.hasClass("active")) {
                this.$el.addClass("active");
            }
        },
        deactivate: function () {
            this.$el.removeClass("active");
        },
        on: function () {
            this.$el.on.apply(this, arguments);
        },
        disable: function (val) {
            this.disabled = val;
            if (this.rendered) {
                if (val && !this.$el.hasClass("disabled")) {
                    this.$el.addClass("disabled");
                } else {
                    this.$el.removeClass("disabled");
                }
            }
        },
        addClass: function (cls) {
            if (cls.length && !this.$el.hasClass(cls)) {
                this.$el.addClass(cls);
            }
        },
        removeClass: function (cls) {
            if (cls.length && this.$el.hasClass(cls)) {
                this.$el.removeClass(cls);
            }
        },
        hasClass: function (cls) {
            return this.$el.hasClass(cls);
        },
        setCaption: function (text) {
            this.$el.find("> a").text(text);
        }
    });
    Common.UI.Tab = Tab;
});