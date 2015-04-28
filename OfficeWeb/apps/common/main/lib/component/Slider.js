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
define(["common/main/lib/component/BaseView", "underscore"], function (base, _) {
    Common.UI.SingleSlider = Common.UI.BaseView.extend({
        options: {
            width: 100,
            minValue: 0,
            maxValue: 100,
            step: 1,
            value: 100,
            enableKeyEvents: false
        },
        disabled: false,
        template: _.template(['<div class="slider single-slider" style="">', '<div class="track">', '<div class="track-left"></div>', '<div class="track-center""></div>', '<div class="track-right" style=""></div>', "</div>", '<div class="thumb" style=""></div>', "<% if (this.options.enableKeyEvents) { %>", '<input type="text" style="position: absolute; top:-10px; width: 1px; height: 1px;">', "<% } %>", "</div>"].join("")),
        initialize: function (options) {
            Common.UI.BaseView.prototype.initialize.call(this, options);
            var me = this,
            el = $(this.el);
            me.width = me.options.width;
            me.minValue = me.options.minValue;
            me.maxValue = me.options.maxValue;
            me.delta = 100 / (me.maxValue - me.minValue);
            me.step = me.options.step;
            if (me.options.el) {
                me.render();
            }
            this.setValue(me.options.value);
        },
        render: function (parentEl) {
            var me = this;
            if (!me.rendered) {
                this.cmpEl = $(this.template({}));
                if (parentEl) {
                    this.setElement(parentEl, false);
                    parentEl.html(this.cmpEl);
                } else {
                    $(this.el).html(this.cmpEl);
                }
            } else {
                this.cmpEl = $(this.el);
            }
            this.cmpEl.find(".track-center").width(me.options.width - 14);
            this.cmpEl.width(me.options.width);
            this.thumb = this.cmpEl.find(".thumb");
            var onMouseUp = function (e) {
                if (me.disabled) {
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                var pos = Math.max(0, Math.min(100, (Math.round((e.pageX - me.cmpEl.offset().left - me._dragstart) / me.width * 100))));
                me.setThumbPosition(pos);
                me.lastValue = me.value;
                me.value = pos / me.delta + me.minValue;
                me.thumb.removeClass("active");
                $(document).off("mouseup", onMouseUp);
                $(document).off("mousemove", onMouseMove);
                me._dragstart = undefined;
                me.trigger("changecomplete", me, me.value, me.lastValue);
            };
            var onMouseMove = function (e) {
                if (me.disabled) {
                    return;
                }
                if (me._dragstart === undefined) {
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                var pos = Math.max(0, Math.min(100, (Math.round((e.pageX - me.cmpEl.offset().left - me._dragstart) / me.width * 100))));
                me.setThumbPosition(pos);
                me.lastValue = me.value;
                me.value = pos / me.delta + me.minValue;
                if (Math.abs(me.value - me.lastValue) > 0.001) {
                    me.trigger("change", me, me.value, me.lastValue);
                }
            };
            var onMouseDown = function (e) {
                if (me.disabled) {
                    return;
                }
                me._dragstart = e.pageX - me.thumb.offset().left - 7;
                me.thumb.addClass("active");
                $(document).on("mouseup", onMouseUp);
                $(document).on("mousemove", onMouseMove);
                if (me.options.enableKeyEvents) {
                    setTimeout(function () {
                        me.input.focus();
                    },
                    10);
                }
            };
            var onTrackMouseDown = function (e) {
                if (me.disabled) {
                    return;
                }
                var pos = Math.max(0, Math.min(100, (Math.round((e.pageX - me.cmpEl.offset().left) / me.width * 100))));
                me.setThumbPosition(pos);
                me.lastValue = me.value;
                me.value = pos / me.delta + me.minValue;
                me.trigger("change", me, me.value, me.lastValue);
                me.trigger("changecomplete", me, me.value, me.lastValue);
            };
            var updateslider;
            var moveThumb = function (increase) {
                me.lastValue = me.value;
                me.value = Math.max(me.minValue, Math.min(me.maxValue, me.value + ((increase) ? me.step : -me.step)));
                me.setThumbPosition(Math.round((me.value - me.minValue) * me.delta));
                me.trigger("change", me, me.value, me.lastValue);
            };
            var onKeyDown = function (e) {
                if (me.disabled) {
                    return;
                }
                if (e.keyCode == Common.UI.Keys.UP || e.keyCode == Common.UI.Keys.DOWN || e.keyCode == Common.UI.Keys.LEFT || e.keyCode == Common.UI.Keys.RIGHT) {
                    e.preventDefault();
                    e.stopPropagation();
                    el.off("keydown", "input", onKeyDown);
                    updateslider = setInterval(_.bind(moveThumb, me, e.keyCode == Common.UI.Keys.UP || e.keyCode == Common.UI.Keys.RIGHT), 100);
                }
            };
            var onKeyUp = function (e) {
                if (me.disabled) {
                    return;
                }
                if (e.keyCode == Common.UI.Keys.UP || e.keyCode == Common.UI.Keys.DOWN || Common.UI.Keys.LEFT || Common.UI.Keys.RIGHT) {
                    e.stopPropagation();
                    e.preventDefault();
                    clearInterval(updateslider);
                    moveThumb(e.keyCode == Common.UI.Keys.UP || e.keyCode == Common.UI.Keys.RIGHT);
                    el.on("keydown", "input", onKeyDown);
                    me.trigger("changecomplete", me, me.value, me.lastValue);
                }
            };
            if (!me.rendered) {
                var el = me.cmpEl;
                el.on("mousedown", ".thumb", onMouseDown);
                el.on("mousedown", ".track", onTrackMouseDown);
                if (this.options.enableKeyEvents) {
                    el.on("keydown", "input", onKeyDown);
                    el.on("keyup", "input", onKeyUp);
                }
            }
            me.rendered = true;
            return this;
        },
        setThumbPosition: function (x) {
            this.thumb.css({
                left: x + "%"
            });
        },
        setValue: function (value) {
            this.lastValue = this.value;
            this.value = Math.max(this.minValue, Math.min(this.maxValue, value));
            this.setThumbPosition(Math.round((value - this.minValue) * this.delta));
        },
        getValue: function () {
            return this.value;
        },
        setDisabled: function (disabled) {
            if (disabled !== this.disabled) {
                this.cmpEl.toggleClass("disabled", disabled);
            }
            this.disabled = disabled;
        }
    });
    Common.UI.MultiSlider = Common.UI.BaseView.extend({
        options: {
            width: 100,
            minValue: 0,
            maxValue: 100,
            values: [0, 100]
        },
        disabled: false,
        template: _.template(['<div class="slider multi-slider">', '<div class="track">', '<div class="track-left"></div>', '<div class="track-center""></div>', '<div class="track-right" style=""></div>', "</div>", "<% _.each(items, function(item) { %>", '<div class="thumb" style=""></div>', "<% }); %>", "</div>"].join("")),
        initialize: function (options) {
            Common.UI.BaseView.prototype.initialize.call(this, options);
            var me = this,
            el = $(this.el);
            me.width = me.options.width;
            me.minValue = me.options.minValue;
            me.maxValue = me.options.maxValue;
            me.delta = 100 / (me.maxValue - me.minValue);
            me.thumbs = [];
            if (me.options.el) {
                me.render();
            }
        },
        render: function (parentEl) {
            var me = this;
            if (!me.rendered) {
                this.cmpEl = $(this.template({
                    items: this.options.values
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
            var el = this.cmpEl;
            el.find(".track-center").width(me.options.width - 14);
            el.width(me.options.width);
            var onMouseUp = function (e) {
                if (me.disabled) {
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                var index = e.data,
                lastValue = me.thumbs[index].value,
                minValue = (index - 1 < 0) ? 0 : me.thumbs[index - 1].position,
                maxValue = (index + 1 < me.thumbs.length) ? me.thumbs[index + 1].position : 100,
                pos = Math.max(minValue, Math.min(maxValue, (Math.round((e.pageX - me.cmpEl.offset().left - me._dragstart) / me.width * 100)))),
                value = pos / me.delta + me.minValue;
                me.setThumbPosition(index, pos);
                me.thumbs[index].value = value;
                $(document).off("mouseup", onMouseUp);
                $(document).off("mousemove", onMouseMove);
                me._dragstart = undefined;
                me.trigger("changecomplete", me, value, lastValue);
            };
            var onMouseMove = function (e) {
                if (me.disabled) {
                    return;
                }
                if (me._dragstart === undefined) {
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                var index = e.data,
                lastValue = me.thumbs[index].value,
                minValue = (index - 1 < 0) ? 0 : me.thumbs[index - 1].position,
                maxValue = (index + 1 < me.thumbs.length) ? me.thumbs[index + 1].position : 100,
                pos = Math.max(minValue, Math.min(maxValue, (Math.round((e.pageX - me.cmpEl.offset().left - me._dragstart) / me.width * 100)))),
                value = pos / me.delta + me.minValue;
                me.setThumbPosition(index, pos);
                me.thumbs[index].value = value;
                if (Math.abs(value - lastValue) > 0.001) {
                    me.trigger("change", me, value, lastValue);
                }
            };
            var onMouseDown = function (e) {
                if (me.disabled) {
                    return;
                }
                var index = e.data,
                thumb = me.thumbs[index].thumb;
                me._dragstart = e.pageX - thumb.offset().left - thumb.width() / 2;
                me.setActiveThumb(index);
                _.each(me.thumbs, function (item, idx) {
                    (index == idx) ? item.thumb.css("z-index", 500) : item.thumb.css("z-index", "");
                });
                $(document).on("mouseup", null, index, onMouseUp);
                $(document).on("mousemove", null, index, onMouseMove);
            };
            var onTrackMouseDown = function (e) {
                if (me.disabled) {
                    return;
                }
                var pos = Math.max(0, Math.min(100, (Math.round((e.pageX - me.cmpEl.offset().left) / me.width * 100)))),
                index = findThumb(pos),
                lastValue = me.thumbs[index].value,
                value = pos / me.delta + me.minValue;
                me.setThumbPosition(index, pos);
                me.thumbs[index].value = value;
                me.trigger("change", me, value, lastValue);
                me.trigger("changecomplete", me, value, lastValue);
            };
            var findThumb = function (pos) {
                var nearest = 100,
                index = 0,
                len = me.thumbs.length,
                dist;
                for (var i = 0; i < len; i++) {
                    dist = Math.abs(me.thumbs[i].position - pos);
                    if (Math.abs(dist <= nearest)) {
                        var above = me.thumbs[i + 1];
                        var below = me.thumbs[i - 1];
                        if (below !== undefined && pos < below.position) {
                            continue;
                        }
                        if (above !== undefined && pos > above.position) {
                            continue;
                        }
                        index = i;
                        nearest = dist;
                    }
                }
                return index;
            };
            this.$thumbs = el.find(".thumb");
            _.each(this.$thumbs, function (item, index) {
                var thumb = $(item);
                me.thumbs.push({
                    thumb: thumb,
                    index: index
                });
                me.setValue(index, me.options.values[index]);
                thumb.on("mousedown", null, index, onMouseDown);
            });
            me.setActiveThumb(0, true);
            if (!me.rendered) {
                el.on("mousedown", ".track", onTrackMouseDown);
            }
            me.rendered = true;
            return this;
        },
        setActiveThumb: function (index, suspend) {
            this.currentThumb = index;
            this.$thumbs.removeClass("active");
            this.thumbs[index].thumb.addClass("active");
            if (suspend !== true) {
                this.trigger("thumbclick", this, index);
            }
        },
        setThumbPosition: function (index, x) {
            this.thumbs[index].position = x;
            this.thumbs[index].thumb.css({
                left: x + "%"
            });
        },
        setValue: function (index, value) {
            this.thumbs[index].value = Math.max(this.minValue, Math.min(this.maxValue, value));
            this.setThumbPosition(index, Math.round((value - this.minValue) * this.delta));
        },
        getValue: function (index) {
            return this.thumbs[index].value;
        },
        getValues: function () {
            var values = [];
            _.each(this.thumbs, function (thumb) {
                values.push(thumb.value);
            });
            return values;
        },
        setDisabled: function (disabled) {
            if (disabled !== this.disabled) {
                this.cmpEl.toggleClass("disabled", disabled);
            }
            this.disabled = disabled;
        }
    });
});