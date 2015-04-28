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
    Common.UI.SynchronizeTip = Common.UI.BaseView.extend(_.extend((function () {
        var tipEl;
        return {
            options: {
                target: $(document.body)
            },
            template: _.template(['<div class="synch-tip-root">', '<div class="asc-synchronizetip">', '<div class="tip-arrow"></div>', "<div>", '<div style="width: 260px;"><%= scope.textSynchronize %></div>', '<div class="close"></div>', "</div>", '<div class="show-link"><label><%= scope.textDontShow %></label></div>', "</div>", "</div>"].join("")),
            initialize: function (options) {
                this.textSynchronize += Common.Utils.String.platformKey("Ctrl+S");
                Common.UI.BaseView.prototype.initialize.call(this, options);
                this.target = this.options.target;
            },
            render: function () {
                tipEl = $(this.template({
                    scope: this
                }));
                tipEl.find(".close").on("click", _.bind(function () {
                    this.trigger("closeclick");
                },
                this));
                tipEl.find(".show-link label").on("click", _.bind(function () {
                    this.trigger("dontshowclick");
                },
                this));
                $(document.body).append(tipEl);
                this.applyPlacement();
                return this;
            },
            show: function () {
                if (tipEl) {
                    this.applyPlacement();
                    tipEl.show();
                } else {
                    this.render();
                }
            },
            hide: function () {
                if (tipEl) {
                    tipEl.hide();
                }
            },
            applyPlacement: function () {
                var showxy = this.target.offset();
                tipEl.css({
                    top: showxy.top + this.target.height() / 2 + "px",
                    left: showxy.left + this.target.width() + "px"
                });
            },
            textDontShow: "Don't show this message again",
            textSynchronize: "The document has been changed by another user.<br/>Please click to save your changes and reload the updates."
        };
    })(), Common.UI.SynchronizeTip || {}));
});