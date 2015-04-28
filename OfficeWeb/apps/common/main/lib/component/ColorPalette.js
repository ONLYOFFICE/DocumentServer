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
define(["common/main/lib/component/BaseView"], function () {
    Common.UI.ColorPalette = Common.UI.BaseView.extend({
        options: {
            allowReselect: true,
            cls: "",
            style: ""
        },
        template: _.template(['<div class="palette-color">', "<% _.each(colors, function(color, index) { %>", '<span class="color-item" data-color="<%= color %>" style="background-color: #<%= color %>;"></span>', "<% }) %>", "</div>"].join("")),
        initialize: function (options) {
            Common.UI.BaseView.prototype.initialize.call(this, options);
            var me = this;
            this.id = me.options.id;
            this.cls = me.options.cls;
            this.style = me.options.style;
            this.colors = me.options.colors || [];
            this.value = me.options.value;
            if (me.options.el) {
                me.render();
            }
        },
        render: function (parentEl) {
            var me = this;
            if (!me.rendered) {
                this.cmpEl = $(this.template({
                    id: this.id,
                    cls: this.cls,
                    style: this.style,
                    colors: this.colors
                }));
                if (parentEl) {
                    this.setElement(parentEl, false);
                    parentEl.html(this.cmpEl);
                } else {
                    $(this.el).html(this.cmpEl);
                }
            } else {
                this.cmpEl = $(this.el);
            }
            if (!me.rendered) {
                var el = this.cmpEl;
                el.on("click", "span.color-item", _.bind(this.itemClick, this));
            }
            me.rendered = true;
            return this;
        },
        itemClick: function (e) {
            var item = $(e.target);
            this.select(item.attr("data-color"));
        },
        select: function (color, suppressEvent) {
            if (this.value != color) {
                var me = this;
                $("span.color-item", this.cmpEl).removeClass("selected");
                this.value = color;
                if (color && /#?[a-fA-F0-9]{6}/.test(color)) {
                    color = /#?([a-fA-F0-9]{6})/.exec(color)[1].toUpperCase();
                    $("span[data-color=" + color + "]", this.cmpEl).addClass("selected");
                    if (!suppressEvent) {
                        me.trigger("select", me, this.value);
                    }
                }
            }
        }
    });
});