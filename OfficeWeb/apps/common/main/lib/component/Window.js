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
    Common.UI.Window = Common.UI.BaseView.extend(_.extend((function () {
        var config = {
            closable: true,
            header: true,
            modal: true,
            width: 300,
            height: "auto",
            title: "Title",
            alias: "Window",
            cls: "",
            toolclose: "close"
        };
        var template = '<div class="asc-window<%= modal?" modal":"" %><%= cls?" "+cls:"" %>" id="<%= id %>" style="width:<%= width %>px;">' + "<% if (header==true) { %>" + '<div class="header">' + "<% if (closable!==false) %>" + '<div class="tool close"></div>' + "<% %>" + '<span class="title"><%= title %></span> ' + "</div>" + "<% } %>" + '<div class="body"><%= tpl %></div>' + "</div>";
        function _getMask() {
            var mask = $(".modals-mask");
            if (mask.length == 0) {
                mask = $("<div class='modals-mask'>").appendTo(document.body).hide();
            }
            return mask;
        }
        function _keydown(event) {
            if (!this.isLocked() && this.isVisible()) {
                switch (event.keyCode) {
                case Common.UI.Keys.ESC:
                    event.preventDefault();
                    event.stopPropagation();
                    if (this.initConfig.closable !== false) {
                        this.initConfig.toolclose == "hide" ? this.hide() : this.close();
                    }
                    return false;
                    break;
                case Common.UI.Keys.RETURN:
                    if (this.$window.find(".btn.primary").length) {
                        if ((this.initConfig.onprimary || this.onPrimary).call(this) === false) {
                            event.preventDefault();
                            return false;
                        }
                    }
                    break;
                }
            }
        }
        function _centre() {
            if (window.innerHeight == undefined) {
                var main_width = document.documentElement.offsetWidth;
                var main_height = document.documentElement.offsetHeight;
            } else {
                main_width = window.innerWidth;
                main_height = window.innerHeight;
            }
            if (this.initConfig.height == "auto") {
                var win_height = parseInt(this.$window.find(".body").css("height"));
                this.initConfig.header && (win_height += parseInt(this.$window.find(".header").css("height")));
            } else {
                win_height = this.initConfig.height;
            }
            var top = Math.floor(((parseInt(main_height) - parseInt(win_height)) / 2) * 0.9);
            var left = Math.floor((parseInt(main_width) - parseInt(this.initConfig.width)) / 2);
            this.$window.css("left", left);
            this.$window.css("top", top);
        }
        function _getTransformation(end) {
            return {
                "-webkit-transition": "0.3s opacity",
                "-moz-transition": "0.3s opacity",
                "-ms-transition": "0.3s opacity",
                "-o-transition": "0.3s opacity",
                "opacity": end
            };
        }
        function _dragstart(event) {
            if ($(event.target).hasClass("close")) {
                return;
            }
            Common.UI.Menu.Manager.hideAll();
            this.dragging.enabled = true;
            this.dragging.initx = event.pageX - parseInt(this.$window.css("left"));
            this.dragging.inity = event.pageY - parseInt(this.$window.css("top"));
            if (window.innerHeight == undefined) {
                var main_width = document.documentElement.offsetWidth;
                var main_height = document.documentElement.offsetHeight;
            } else {
                main_width = window.innerWidth;
                main_height = window.innerHeight;
            }
            this.dragging.maxx = main_width - parseInt(this.$window.css("width"));
            this.dragging.maxy = main_height - parseInt(this.$window.css("height"));
            $(document).on("mousemove", this.binding.drag);
            $(document).on("mouseup", this.binding.dragStop);
            this.fireEvent("drag", [this, "start"]);
        }
        function _mouseup() {
            $(document).off("mousemove", this.binding.drag);
            $(document).off("mouseup", this.binding.dragStop);
            this.dragging.enabled = false;
            this.fireEvent("drag", [this, "end"]);
        }
        function _mousemove(event) {
            if (this.dragging.enabled) {
                var left = event.pageX - this.dragging.initx,
                top = event.pageY - this.dragging.inity;
                left < 0 ? (left = 0) : left > this.dragging.maxx && (left = this.dragging.maxx);
                top < 0 ? (top = 0) : top > this.dragging.maxy && (top = this.dragging.maxy);
                this.$window.css({
                    left: left,
                    top: top
                });
            }
        }
        Common.UI.alert = function (options) {
            var me = this.Window.prototype;
            var arrBtns = {
                ok: me.okButtonText,
                cancel: me.cancelButtonText,
                yes: me.yesButtonText,
                no: me.noButtonText,
                close: me.closeButtonText
            };
            if (!options.buttons) {
                options.buttons = {};
                options.buttons["ok"] = arrBtns["ok"];
            } else {
                if (_.isArray(options.buttons)) {
                    var newBtns = {};
                    _.each(options.buttons, function (b) {
                        newBtns[b] = arrBtns[b];
                    });
                    options.buttons = newBtns;
                }
            }
            var template = '<div class="info-box">' + '<div class="icon <%= iconCls %>" />' + '<div class="text"><span><%= msg %></span></div>' + "</div>" + '<div class="footer">' + '<button class="btn normal dlg-btn primary" result="ok">OK</button>' + "<% if (_.size(buttons) > 1) %>" + '<button class="btn normal dlg-btn" result="cancel">Cancel</button>' + "<% %>" + "</div>";
            var win = new Common.UI.Window({
                cls: "alert",
                title: options.title,
                onprimary: onKeyDown,
                tpl: _.template(template, options)
            });
            function autoSize(window) {
                var text_cnt = window.getChild(".info-box");
                var text = window.getChild(".info-box span");
                var footer = window.getChild(".footer");
                var header = window.getChild(".header");
                var body = window.getChild(".body");
                var icon = window.getChild(".icon");
                body.css("padding-bottom", "10px");
                text_cnt.height(Math.max(text.height(), icon.height()));
                body.height(parseInt(text_cnt.css("height")) + parseInt(footer.css("height")));
                window.setSize(text.position().left + text.width() + parseInt(text_cnt.css("padding-right")), parseInt(body.css("height")) + parseInt(header.css("height")));
            }
            function onBtnClick(event) {
                if (options.callback) {
                    options.callback.call(win, event.currentTarget.attributes["result"].value);
                }
                win.close(true);
            }
            function onKeyDown(event) {
                onBtnClick({
                    currentTarget: win.getChild(".footer .dlg-btn")[0]
                });
                return false;
            }
            win.on({
                "render:after": function (obj) {
                    autoSize(obj);
                },
                show: function (obj) {
                    obj.getChild(".footer .dlg-btn").focus();
                    obj.getChild(".footer .dlg-btn").on("click", onBtnClick);
                },
                close: function () {
                    options.callback && options.callback.call(win, "close");
                }
            });
            win.show();
        };
        Common.UI.warning = function (options) {
            options = options || {}; ! options.title && (options.title = this.Window.prototype.textWarning);
            Common.UI.alert(_.extend(options, {
                iconCls: "warn"
            }));
        };
        Common.UI.error = function (options) {
            options = options || {}; ! options.title && (options.title = this.Window.prototype.textError);
            Common.UI.alert(_.extend(options, {
                iconCls: "error"
            }));
        };
        Common.UI.confirm = function (options) {
            options = options || {}; ! options.title && (options.title = this.Window.prototype.textConfirmation);
            Common.UI.alert(_.extend(options, {
                iconCls: "confirm"
            }));
        };
        Common.UI.info = function (options) {
            options = options || {}; ! options.title && (options.title = this.Window.prototype.textInformation);
            Common.UI.alert(_.extend(options, {
                iconCls: "info"
            }));
        };
        return {
            $window: undefined,
            $lastmodal: undefined,
            dragging: {
                enabled: false
            },
            initialize: function (options) {
                this.initConfig = {};
                this.binding = {};
                _.extend(this.initConfig, config, options || {}); ! this.initConfig.id && (this.initConfig.id = "window-" + this.cid); ! this.initConfig.tpl && (this.initConfig.tpl = "");
                Common.UI.BaseView.prototype.initialize.call(this, this.initConfig);
            },
            render: function () {
                var renderto = this.initConfig.renderTo || document.body;
                $(renderto).append(_.template(template, this.initConfig));
                this.$window = $("#" + this.initConfig.id);
                this.binding.keydown = _.bind(_keydown, this);
                if (this.initConfig.header) {
                    this.binding.drag = _.bind(_mousemove, this);
                    this.binding.dragStop = _.bind(_mouseup, this);
                    this.binding.dragStart = _.bind(_dragstart, this);
                    var doclose = function () {
                        if (this.$window.find(".tool.close").hasClass("disabled")) {
                            return;
                        }
                        if (this.initConfig.toolcallback) {
                            this.initConfig.toolcallback.call(this);
                        } else {
                            (this.initConfig.toolclose == "hide") ? this.hide() : this.close();
                        }
                    };
                    this.$window.find(".header").on("mousedown", this.binding.dragStart);
                    this.$window.find(".tool.close").on("click", _.bind(doclose, this));
                } else {
                    this.$window.find(".body").css({
                        top: 0,
                        "border-radius": "5px"
                    });
                }
                if (this.initConfig.height == "auto") {
                    var height = parseInt(this.$window.find("> .body").css("height"));
                    this.initConfig.header && (height += parseInt(this.$window.find("> .header").css("height")));
                    this.$window.height(height);
                } else {
                    this.$window.css("height", this.initConfig.height);
                }
                this.fireEvent("render:after", this);
                return this;
            },
            show: function (x, y) {
                if (this.initConfig.modal) {
                    var mask = _getMask();
                    if (this.options.animate !== false) {
                        var opacity = mask.css("opacity");
                        mask.css("opacity", 0);
                        mask.show();
                        setTimeout(function () {
                            mask.css(_getTransformation(opacity));
                        },
                        1);
                    } else {
                        mask.show();
                    }
                    Common.NotificationCenter.trigger("modal:show", this);
                    this.$lastmodal = $(".asc-window.modal:not(.dethrone):visible").first().addClass("dethrone");
                }
                if (!this.$window) {
                    this.render();
                    if (_.isNumber(x) && _.isNumber(y)) {
                        this.$window.css("left", Math.floor(x));
                        this.$window.css("top", Math.floor(y));
                    } else {
                        _centre.call(this);
                    }
                } else {
                    if (!this.$window.is(":visible")) {
                        this.$window.show();
                    }
                }
                $(document).on("keydown." + this.cid, this.binding.keydown);
                var me = this;
                if (this.options.animate !== false) {
                    this.$window.css({
                        "-webkit-transform": "scale(0.8)",
                        "-moz-transform": "scale(0.8)",
                        "-ms-transform": "scale(0.8)",
                        "-o-transform": "scale(0.8)",
                        opacity: 0
                    });
                    setTimeout(function () {
                        me.$window.css({
                            "-webkit-transition": "0.3s opacity, 0.3s -webkit-transform",
                            "-webkit-transform": "scale(1)",
                            "-moz-transition": "0.3s opacity, 0.3s -moz-transform",
                            "-moz-transform": "scale(1)",
                            "-ms-transition": "0.3s opacity, 0.3s -ms-transform",
                            "-ms-transform": "scale(1)",
                            "-o-transition": "0.3s opacity, 0.3s -o-transform",
                            "-o-transform": "scale(1)",
                            "opacity": "1"
                        });
                    },
                    1);
                    setTimeout(function () {
                        me.$window.css({
                            "-webkit-transform": "",
                            "-moz-transform": "",
                            "-ms-transition": "",
                            "-ms-transform": "",
                            "-o-transform": ""
                        });
                        me.fireEvent("show", me);
                    },
                    350);
                } else {
                    this.fireEvent("show", this);
                }
                Common.NotificationCenter.trigger("window:show");
            },
            close: function (suppressevent) {
                $(document).off("keydown." + this.cid);
                if (this.initConfig.header) {
                    this.$window.find(".header").off("mousedown", this.binding.dragStart);
                }
                if (this.initConfig.modal) {
                    var hide_mask = true;
                    if (this.$lastmodal.size() > 0) {
                        this.$lastmodal.removeClass("dethrone");
                        hide_mask = !this.$lastmodal.hasClass("modal");
                    }
                    if (hide_mask) {
                        var mask = $(".modals-mask");
                        if (this.options.animate !== false) {
                            var opacity = mask.css("opacity");
                            mask.css(_getTransformation(0));
                            setTimeout(function () {
                                mask.css("opacity", opacity);
                                mask.hide();
                            },
                            300);
                        } else {
                            mask.hide();
                        }
                    }
                    Common.NotificationCenter.trigger("modal:close", this);
                }
                this.$window.remove();
                suppressevent !== true && this.fireEvent("close", this);
            },
            hide: function () {
                $(document).off("keydown." + this.cid);
                if (this.$window) {
                    if (this.initConfig.modal) {
                        var hide_mask = true;
                        if (this.$lastmodal.size() > 0) {
                            this.$lastmodal.removeClass("dethrone");
                            hide_mask = !this.$lastmodal.hasClass("modal");
                        }
                        if (hide_mask) {
                            var mask = $(".modals-mask");
                            if (this.options.animate !== false) {
                                var opacity = mask.css("opacity");
                                mask.css(_getTransformation(0));
                                setTimeout(function () {
                                    mask.css("opacity", opacity);
                                    mask.hide();
                                },
                                300);
                            } else {
                                mask.hide();
                            }
                        }
                        Common.NotificationCenter.trigger("modal:hide", this);
                    }
                    this.$window.hide();
                    this.fireEvent("hide", this);
                }
            },
            isLocked: function () {
                return this.$window.hasClass("dethrone") || (!this.options.modal && this.$window.parent().find(".asc-window.modal:visible").length);
            },
            getChild: function (selector) {
                return selector ? this.$window.find(selector) : this.$window;
            },
            setWidth: function (width) {
                if (width >= 0) {
                    var min = parseInt(this.$window.css("min-width"));
                    width < min && (width = min);
                    this.$window.width(width);
                }
            },
            getWidth: function () {
                return parseInt(this.$window.css("width"));
            },
            setHeight: function (height) {
                if (height >= 0) {
                    var min = parseInt(this.$window.css("min-height"));
                    height < min && (height = min);
                    this.$window.height(height);
                    if (this.initConfig.header) {
                        height -= parseInt(this.$window.find("> .header").css("height"));
                    }
                    this.$window.find("> .body").css("height", height);
                }
            },
            getHeight: function () {
                return parseInt(this.$window.css("height"));
            },
            setSize: function (w, h) {
                this.setWidth(w);
                this.setHeight(h);
            },
            getSize: function () {
                return [this.getWidth(), this.getHeight()];
            },
            setTitle: function (title) {
                this.$window.find("> .header > .title").text(title);
            },
            getTitle: function () {
                return this.$window.find("> .header > .title").text();
            },
            isVisible: function () {
                return this.$window && this.$window.is(":visible");
            },
            onPrimary: function () {},
            cancelButtonText: "Cancel",
            okButtonText: "OK",
            yesButtonText: "Yes",
            noButtonText: "No",
            closeButtonText: "Close",
            textWarning: "Warning",
            textError: "Error",
            textConfirmation: "Confirmation",
            textInformation: "Information"
        };
    })(), Common.UI.Window || {}));
});