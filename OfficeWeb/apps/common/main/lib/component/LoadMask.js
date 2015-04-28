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
    Common.UI.LoadMask = Common.UI.BaseView.extend((function () {
        var ownerEl, maskeEl, loaderEl;
        return {
            options: {
                cls: "",
                style: "",
                title: "Loading...",
                owner: document.body
            },
            template: _.template(['<div id="<%= id %>" class="asc-loadmask-body <%= cls %>" role="presentation" tabindex="-1">', '<div class="asc-loadmask-image"></div>', '<div class="asc-loadmask-title"><%= title %></div>', "</div>"].join("")),
            initialize: function (options) {
                Common.UI.BaseView.prototype.initialize.call(this, options);
                this.template = this.options.template || this.template;
                this.cls = this.options.cls;
                this.style = this.options.style;
                this.title = this.options.title;
                this.owner = this.options.owner;
            },
            render: function () {
                return this;
            },
            show: function () {
                if (maskeEl || loaderEl) {
                    return;
                }
                ownerEl = (this.owner instanceof Common.UI.BaseView) ? $(this.owner.el) : $(this.owner);
                if (ownerEl.hasClass("masked")) {
                    return this;
                }
                var me = this;
                maskeEl = $('<div class="asc-loadmask"></div>');
                loaderEl = $(this.template({
                    id: me.id,
                    cls: me.cls,
                    style: me.style,
                    title: me.title
                }));
                ownerEl.addClass("masked");
                ownerEl.append(maskeEl);
                ownerEl.append(loaderEl);
                loaderEl.css({
                    top: Math.round(ownerEl.height() / 2 - (loaderEl.height() + parseInt(loaderEl.css("padding-top")) + parseInt(loaderEl.css("padding-bottom"))) / 2) + "px",
                    left: Math.round(ownerEl.width() / 2 - (loaderEl.width() + parseInt(loaderEl.css("padding-left")) + parseInt(loaderEl.css("padding-right"))) / 2) + "px"
                });
                Common.util.Shortcuts.suspendEvents();
                return this;
            },
            hide: function () {
                ownerEl && ownerEl.removeClass("masked");
                maskeEl && maskeEl.remove();
                loaderEl && loaderEl.remove();
                maskeEl = null;
                loaderEl = null;
                Common.util.Shortcuts.resumeEvents();
            },
            setTitle: function (title) {
                this.title = title;
                if (ownerEl && ownerEl.hasClass("masked") && loaderEl) {
                    $(".asc-loadmask-title", loaderEl).html(title);
                }
            }
        };
    })());
});