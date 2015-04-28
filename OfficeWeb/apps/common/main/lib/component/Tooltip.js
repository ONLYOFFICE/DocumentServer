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
 define(["tip", "backbone"], function () {
    var Tooltip = function (options) {
        this.$element = this.placement = undefined;
        this.init.call(this, options);
    };
    _.extend(Tooltip.prototype, Backbone.Events, {
        init: function (opts) {
            this.$element = opts.owner instanceof Backbone.View ? opts.owner.$el : $(opts.owner);
            this.placement = opts.placement;
            if (this.$element.data("bs.tooltip")) {
                this.$element.removeData("bs.tooltip");
            }
            this.$element.tooltip({
                title: opts.title,
                trigger: "manual",
                placement: opts.placement,
                offset: opts.offset,
                cls: opts.cls,
                html: opts.html,
                hideonclick: opts.hideonclick
            });
            if (opts.hideonclick) {
                var tip = this.$element.data("bs.tooltip");
                tip.tip().on("click", function () {
                    tip.hide();
                });
            }
            this.$element.on("shown.bs.tooltip", _.bind(this.onTipShown, this));
            this.$element.on("hidden.bs.tooltip", _.bind(this.onTipHidden, this));
        },
        show: function (at) {
            this.getBSTip().show(at);
        },
        hide: function () {
            this.getBSTip().hide();
        },
        setTitle: function (title) {
            var tip = this.getBSTip();
            tip.options.title = title;
        },
        updateTitle: function () {
            var tip = this.getBSTip();
            tip.$tip.find(".tooltip-inner")[tip.options.html ? "html" : "text"](tip.options.title);
        },
        getBSTip: function () {
            return this.$element.data("bs.tooltip");
        },
        onTipShown: function () {
            this.trigger("tooltip:show", this);
        },
        onTipHidden: function () {
            this.trigger("tooltip:hide", this);
        },
        isVisible: function () {
            return this.getBSTip().tip().is(":visible");
        }
    });
    Common.UI = Common.UI || {};
    Common.UI.Tooltip = Tooltip;
});