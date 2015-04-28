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
define(["jmousewheel", "perfectscrollbar", "common/main/lib/component/BaseView"], function () {
    Common.UI.Scroller = (function () {
        var mouseCapture;
        return _.extend(Common.UI.BaseView.extend({
            options: {
                wheelSpeed: 20,
                wheelPropagation: false,
                minScrollbarLength: null,
                useBothWheelAxes: false,
                useKeyboard: true,
                suppressScrollX: false,
                suppressScrollY: false,
                scrollXMarginOffset: 5,
                scrollYMarginOffset: 5,
                includePadding: true,
                includeMargin: true,
                alwaysVisibleX: false,
                alwaysVisibleY: false
            },
            initialize: function (options) {
                Common.UI.BaseView.prototype.initialize.call(this, options);
                if (this.options.el) {
                    this.render();
                }
            },
            render: function () {
                var me = this;
                me.cmpEl = $(this.el);
                if (!me.rendered) {
                    me.cmpEl.perfectScrollbar(_.extend({},
                    me.options));
                    me.rendered = true;
                    this.setAlwaysVisibleX(me.options.alwaysVisibleX);
                    this.setAlwaysVisibleY(me.options.alwaysVisibleY);
                }
                return this;
            },
            remove: function () {
                this.destroy();
                Backbone.View.prototype.remove.call(this);
            },
            update: function (config) {
                var options = this.options;
                if (config) {
                    this.destroy();
                    options = _.extend(this.options, config);
                    this.cmpEl.perfectScrollbar(options);
                } else {
                    this.cmpEl.perfectScrollbar("update");
                }
                this.setAlwaysVisibleX(options.alwaysVisibleX);
                this.setAlwaysVisibleY(options.alwaysVisibleY);
                var mouseDownHandler = function (e) {
                    mouseCapture = true;
                    var upHandler = function (e) {
                        $(document).unbind("mouseup", upHandler);
                        _.delay(function () {
                            mouseCapture = false;
                        },
                        10);
                    };
                    $(document).mouseup(upHandler);
                };
                $(".ps-scrollbar-x-rail, .ps-scrollbar-y-rail, .ps-scrollbar-x, .ps-scrollbar-y", this.cmpEl).off("mousedown", mouseDownHandler).on("mousedown", mouseDownHandler);
            },
            destroy: function () {
                this.cmpEl.perfectScrollbar("destroy");
            },
            scrollLeft: function (pos) {
                this.cmpEl.scrollLeft(pos);
                this.update();
            },
            scrollTop: function (pos) {
                this.cmpEl.scrollTop(pos);
                this.update();
            },
            getScrollTop: function () {
                return this.cmpEl.scrollTop();
            },
            getScrollLeft: function () {
                return this.cmpEl.scrollLeft();
            },
            setAlwaysVisibleX: function (flag) {
                if (flag) {
                    $(this.el).find(".ps-scrollbar-x-rail").addClass("always-visible-x");
                    $(this.el).find(".ps-scrollbar-x").addClass("always-visible-x");
                } else {
                    $(this.el).find(".ps-scrollbar-x-rail").removeClass("always-visible-x");
                    $(this.el).find(".ps-scrollbar-x").addClass("always-visible-x");
                }
            },
            setAlwaysVisibleY: function (flag) {
                if (flag) {
                    $(this.el).find(".ps-scrollbar-y-rail").addClass("always-visible-y");
                    $(this.el).find(".ps-scrollbar-y").addClass("always-visible-y");
                } else {
                    $(this.el).find(".ps-scrollbar-y-rail").removeClass("always-visible-y");
                    $(this.el).find(".ps-scrollbar-y").addClass("always-visible-y");
                }
            }
        }), {
            isMouseCapture: function () {
                return mouseCapture;
            }
        });
    })();
});