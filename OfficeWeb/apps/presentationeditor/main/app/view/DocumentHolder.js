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
 define(["jquery", "underscore", "backbone", "gateway", "common/main/lib/util/utils", "common/main/lib/component/Menu", "common/main/lib/view/CopyWarningDialog", "presentationeditor/main/app/view/HyperlinkSettingsDialog", "presentationeditor/main/app/view/ParagraphSettingsAdvanced", "presentationeditor/main/app/view/ShapeSettingsAdvanced", "presentationeditor/main/app/view/TableSettingsAdvanced"], function ($, _, Backbone, gateway) {
    PE.Views.DocumentHolder = Backbone.View.extend(_.extend({
        el: "#editor_sdk",
        template: null,
        events: {},
        initialize: function () {
            var me = this;
            me.usertips = [];
            me._TtHeight = 20;
            me.show_copywarning = true;
            me.slidesCount = 0;
            var usersStore = PE.getCollection("Common.Collections.Users");
            var value = window.localStorage.getItem("pe-settings-livecomment");
            me.isLiveCommenting = !(value !== null && parseInt(value) == 0);
            var showPopupMenu = function (menu, value, event, docElement, eOpts) {
                if (!_.isUndefined(menu) && menu !== null) {
                    Common.UI.Menu.Manager.hideAll();
                    var showPoint = [event.get_X(), event.get_Y()],
                    menuContainer = $(me.el).find(Common.Utils.String.format("#menu-container-{0}", menu.id));
                    if (event.get_Type() == c_oAscContextMenuTypes.Thumbnails) {
                        showPoint[0] -= 3;
                        showPoint[1] -= 3;
                    }
                    if (!menu.rendered) {
                        if (menuContainer.length < 1) {
                            menuContainer = $(Common.Utils.String.format('<div id="menu-container-{0}" style="position: absolute; z-index: 10000;"><div class="dropdown-toggle" data-toggle="dropdown"></div></div>', menu.id));
                            $(me.el).append(menuContainer);
                        }
                        menu.render(menuContainer);
                        menu.cmpEl.attr({
                            tabindex: "-1"
                        });
                    }
                    menuContainer.css({
                        left: showPoint[0],
                        top: showPoint[1]
                    });
                    menu.show();
                    if (_.isFunction(menu.options.initMenu)) {
                        menu.options.initMenu(value);
                        menu.alignPosition();
                    }
                    _.delay(function () {
                        menu.cmpEl.focus();
                    },
                    10);
                    me.currentMenu = menu;
                }
            };
            var showObjectMenu = function (event, docElement, eOpts) {
                if (me.api && me.mode.isEdit) {
                    var menu_props = {},
                    menu_to_show = null,
                    selectedElements = me.api.getSelectedElements();
                    if (selectedElements && _.isArray(selectedElements)) {
                        _.each(selectedElements, function (element, index) {
                            var elType = element.get_ObjectType(),
                            elValue = element.get_ObjectValue();
                            if (c_oAscTypeSelectElement.Image == elType) {
                                menu_to_show = me.pictureMenu;
                                menu_props.imgProps = {};
                                menu_props.imgProps.value = elValue;
                                menu_props.imgProps.locked = (elValue) ? elValue.get_Locked() : false;
                            } else {
                                if (c_oAscTypeSelectElement.Table == elType) {
                                    menu_to_show = me.tableMenu;
                                    menu_props.tableProps = {};
                                    menu_props.tableProps.value = elValue;
                                    menu_props.tableProps.locked = (elValue) ? elValue.get_Locked() : false;
                                } else {
                                    if (c_oAscTypeSelectElement.Hyperlink == elType) {
                                        menu_props.hyperProps = {};
                                        menu_props.hyperProps.value = elValue;
                                    } else {
                                        if (c_oAscTypeSelectElement.Shape == elType) {
                                            menu_to_show = me.pictureMenu;
                                            menu_props.shapeProps = {};
                                            menu_props.shapeProps.value = elValue;
                                            menu_props.shapeProps.locked = (elValue) ? elValue.get_Locked() : false;
                                            if (elValue.get_FromChart()) {
                                                menu_props.shapeProps.isChart = true;
                                            }
                                        } else {
                                            if (c_oAscTypeSelectElement.Chart == elType) {
                                                menu_to_show = me.pictureMenu;
                                                menu_props.chartProps = {};
                                                menu_props.chartProps.value = elValue;
                                                menu_props.chartProps.locked = (elValue) ? elValue.get_Locked() : false;
                                            } else {
                                                if (c_oAscTypeSelectElement.Slide == elType) {
                                                    menu_props.slideProps = {};
                                                    menu_props.slideProps.value = elValue;
                                                    menu_props.slideProps.locked = (elValue) ? elValue.get_LockDelete() : false;
                                                } else {
                                                    if (c_oAscTypeSelectElement.Paragraph == elType) {
                                                        menu_props.paraProps = {};
                                                        menu_props.paraProps.value = elValue;
                                                        menu_props.paraProps.locked = (elValue) ? elValue.get_Locked() : false;
                                                        if ((menu_props.shapeProps && menu_props.shapeProps.value || menu_props.chartProps && menu_props.chartProps.value) && _.isUndefined(menu_props.tableProps)) {
                                                            menu_to_show = me.textMenu;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        });
                        if (menu_to_show === null) {
                            if (!_.isUndefined(menu_props.paraProps)) {
                                menu_to_show = me.textMenu;
                            } else {
                                if (!_.isUndefined(menu_props.slideProps)) {
                                    menu_to_show = me.slideMenu;
                                }
                            }
                        }
                        showPopupMenu(menu_to_show, menu_props, event, docElement, eOpts);
                    }
                }
            };
            var onContextMenu = function (event) {
                _.delay(function () {
                    if (event.get_Type() == c_oAscContextMenuTypes.Thumbnails) {
                        showPopupMenu.call(me, me.slideMenu, {
                            isSlideSelect: event.get_IsSlideSelect(),
                            fromThumbs: true
                        },
                        event);
                    } else {
                        showObjectMenu.call(me, event);
                    }
                },
                10);
            };
            var handleDocumentWheel = function (event) {
                if (me.api) {
                    var delta = (_.isUndefined(event.originalEvent)) ? event.wheelDelta : event.originalEvent.wheelDelta;
                    if (_.isUndefined(delta)) {
                        delta = event.deltaY;
                    }
                    if (event.ctrlKey || event.metaKey) {
                        if (delta < 0) {
                            me.api.zoomOut();
                        } else {
                            if (delta > 0) {
                                me.api.zoomIn();
                            }
                        }
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }
            };
            var handleDocumentKeyDown = function (event) {
                if (me.api) {
                    var key = event.keyCode;
                    if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
                        if (key === Common.UI.Keys.NUM_PLUS || key === Common.UI.Keys.EQUALITY || (Common.Utils.isOpera && key == 43)) {
                            me.api.zoomIn();
                            event.preventDefault();
                            event.stopPropagation();
                            return false;
                        } else {
                            if (key === Common.UI.Keys.NUM_MINUS || key === Common.UI.Keys.MINUS || (Common.Utils.isOpera && key == 45)) {
                                me.api.zoomOut();
                                event.preventDefault();
                                event.stopPropagation();
                                return false;
                            }
                        }
                    }
                    if (me.currentMenu && me.currentMenu.isVisible()) {
                        if (key == Common.UI.Keys.UP || key == Common.UI.Keys.DOWN) {
                            $("ul.dropdown-menu", me.currentMenu.el).focus();
                        }
                    }
                }
            };
            var onDocumentHolderResize = function () {
                me._Height = me.cmpEl.height();
                me._Width = me.cmpEl.width();
                me._BodyWidth = $("body").width();
                if (me.slideNumDiv) {
                    me.slideNumDiv.remove();
                    me.slideNumDiv = undefined;
                }
            };
            var onAfterRender = function (ct) {
                var meEl = me.cmpEl;
                if (meEl) {
                    meEl.on("contextmenu", function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    });
                    meEl.on("click", function (e) {
                        if (e.target.localName == "canvas") {
                            meEl.focus();
                        }
                    });
                    meEl.on("mousedown", function (e) {
                        if (e.target.localName == "canvas") {
                            Common.UI.Menu.Manager.hideAll();
                        }
                    });
                    var addEvent = function (elem, type, fn) {
                        elem.addEventListener ? elem.addEventListener(type, fn, false) : elem.attachEvent("on" + type, fn);
                    };
                    var eventname = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
                    addEvent(me.el, eventname, handleDocumentWheel);
                }
                $(document).on("mousewheel", handleDocumentWheel);
                $(document).on("keydown", handleDocumentKeyDown);
                $(window).on("resize", onDocumentHolderResize);
                var viewport = PE.getController("Viewport").getView("Viewport");
                viewport.hlayout.on("layout:resizedrag", onDocumentHolderResize);
            };
            var getUserName = function (id) {
                if (usersStore) {
                    var rec = usersStore.findUser(id);
                    if (rec) {
                        return rec.get("username");
                    }
                }
                return me.guestText;
            };
            var screenTip = {
                toolTip: new Common.UI.Tooltip({
                    owner: this,
                    html: true,
                    title: "<br><b>Press Ctrl and click link</b>"
                }),
                strTip: "",
                isHidden: true,
                isVisible: false
            };
            var userTooltip = true;
            var userTipMousover = function (evt, el, opt) {
                if (userTooltip === true) {
                    userTooltip = new Common.UI.Tooltip({
                        owner: evt.currentTarget,
                        title: me.tipIsLocked
                    });
                    userTooltip.show();
                }
            };
            var userTipHide = function () {
                if (typeof userTooltip == "object") {
                    userTooltip.hide();
                    userTooltip = undefined;
                    for (var i = 0; i < me.usertips.length; i++) {
                        me.usertips[i].off("mouseover", userTipMousover);
                        me.usertips[i].off("mouseout", userTipMousout);
                    }
                }
            };
            var userTipMousout = function (evt, el, opt) {
                if (typeof userTooltip == "object") {
                    if (userTooltip.$element && evt.currentTarget === userTooltip.$element[0]) {
                        userTipHide();
                    }
                }
            };
            Common.NotificationCenter.on({
                "window:show": function (e) {
                    screenTip.toolTip.hide();
                    screenTip.isVisible = false;
                    userTipHide();
                },
                "modal:show": function (e) {
                    me.hideTips();
                },
                "layout:changed": function (e) {
                    screenTip.toolTip.hide();
                    screenTip.isVisible = false;
                    userTipHide();
                    me.hideTips();
                    onDocumentHolderResize();
                },
                "copywarning:show": function () {
                    me.show_copywarning = false;
                }
            });
            var onHyperlinkClick = function (url) {
                if (url) {
                    var isvalid = url.strongMatch(Common.Utils.hostnameRe); ! isvalid && (isvalid = url.strongMatch(Common.Utils.emailRe)); ! isvalid && (isvalid = url.strongMatch(Common.Utils.ipRe)); ! isvalid && (isvalid = url.strongMatch(Common.Utils.localRe));
                    if (isvalid) {
                        window.open(url);
                    }
                }
            };
            var onMouseMoveStart = function () {
                screenTip.isHidden = true;
                if (me.usertips.length > 0) {
                    if (typeof userTooltip == "object") {
                        userTooltip.hide();
                        userTooltip = true;
                    }
                    _.each(me.usertips, function (item) {
                        item.remove();
                    });
                }
                me.usertips = [];
                me.usertipcount = 0;
            };
            var onMouseMoveEnd = function () {
                if (screenTip.isHidden && screenTip.isVisible) {
                    screenTip.isVisible = false;
                    screenTip.toolTip.hide();
                }
            };
            var onMouseMove = function (moveData) {
                if (_.isUndefined(me._XY)) {
                    me._XY = [me.cmpEl.offset().left - $(window).scrollLeft(), me.cmpEl.offset().top - $(window).scrollTop()];
                    me._Width = me.cmpEl.width();
                    me._Height = me.cmpEl.height();
                    me._BodyWidth = $("body").width();
                }
                if (moveData) {
                    var showPoint, ToolTip;
                    if (moveData.get_Type() == 1) {
                        var hyperProps = moveData.get_Hyperlink();
                        var recalc = false;
                        if (hyperProps) {
                            screenTip.isHidden = false;
                            ToolTip = (_.isEmpty(hyperProps.get_ToolTip())) ? hyperProps.get_Value() : hyperProps.get_ToolTip();
                            ToolTip = Common.Utils.String.htmlEncode(ToolTip);
                            if (screenTip.tipLength !== ToolTip.length || screenTip.strTip.indexOf(ToolTip) < 0) {
                                screenTip.toolTip.setTitle(ToolTip + "<br><b>" + me.txtPressLink + "</b>");
                                screenTip.tipLength = ToolTip.length;
                                screenTip.strTip = ToolTip;
                                recalc = true;
                            }
                            showPoint = [moveData.get_X(), moveData.get_Y()];
                            showPoint[1] += (me._XY[1] - 15);
                            showPoint[0] += (me._XY[0] + 5);
                            if (!screenTip.isVisible || recalc) {
                                screenTip.isVisible = true;
                                screenTip.toolTip.show([-10000, -10000]);
                            }
                            if (recalc) {
                                screenTip.tipHeight = screenTip.toolTip.getBSTip().$tip.height();
                                screenTip.tipWidth = screenTip.toolTip.getBSTip().$tip.width();
                            }
                            showPoint[1] -= screenTip.tipHeight;
                            if (showPoint[0] + screenTip.tipWidth > me._BodyWidth) {
                                showPoint[0] = me._BodyWidth - screenTip.tipWidth;
                            }
                            screenTip.toolTip.getBSTip().$tip.css({
                                top: showPoint[1] + "px",
                                left: showPoint[0] + "px"
                            });
                        }
                    } else {
                        if (moveData.get_Type() == 2 && me.mode.isEdit) {
                            var src;
                            if (me.usertipcount >= me.usertips.length) {
                                src = $(document.createElement("div"));
                                src.addClass("username-tip");
                                src.css({
                                    height: me._TtHeight + "px",
                                    position: "absolute",
                                    zIndex: "900",
                                    visibility: "visible"
                                });
                                $(document.body).append(src);
                                if (userTooltip) {
                                    src.on("mouseover", userTipMousover);
                                    src.on("mouseout", userTipMousout);
                                }
                                me.usertips.push(src);
                            }
                            src = me.usertips[me.usertipcount];
                            me.usertipcount++;
                            ToolTip = getUserName(moveData.get_UserId());
                            showPoint = [moveData.get_X() + me._XY[0], moveData.get_Y() + me._XY[1]];
                            showPoint[0] = me._BodyWidth - showPoint[0];
                            showPoint[1] -= ((moveData.get_LockedObjectType() == 2) ? me._TtHeight : 0);
                            if (showPoint[1] > me._XY[1] && showPoint[1] + me._TtHeight < me._XY[1] + me._Height) {
                                src.text(ToolTip);
                                src.css({
                                    visibility: "visible",
                                    top: showPoint[1] + "px",
                                    right: showPoint[0] + "px"
                                });
                            }
                        }
                    }
                }
            };
            var onDialogAddHyperlink = function () {
                var win, props, text;
                if (me.api && me.mode.isEdit) {
                    var handlerDlg = function (dlg, result) {
                        if (result == "ok") {
                            props = dlg.getSettings();
                            (text !== false) ? me.api.add_Hyperlink(props) : me.api.change_Hyperlink(props);
                        }
                        me.fireEvent("editcomplete", me);
                    };
                    text = me.api.can_AddHyperlink();
                    var _arr = [];
                    for (var i = 0; i < me.api.getCountPages(); i++) {
                        _arr.push({
                            displayValue: i + 1,
                            value: i
                        });
                    }
                    if (text !== false) {
                        win = new PE.Views.HyperlinkSettingsDialog({
                            handler: handlerDlg,
                            slides: _arr
                        });
                        props = new CHyperlinkProperty();
                        props.put_Text(text);
                        win.show();
                        win.setSettings(props);
                    } else {
                        var selectedElements = me.api.getSelectedElements();
                        if (selectedElements && _.isArray(selectedElements)) {
                            _.each(selectedElements, function (el, i) {
                                if (selectedElements[i].get_ObjectType() == c_oAscTypeSelectElement.Hyperlink) {
                                    props = selectedElements[i].get_ObjectValue();
                                }
                            });
                        }
                        if (props) {
                            win = new PE.Views.HyperlinkSettingsDialog({
                                handler: handlerDlg,
                                slides: _arr
                            });
                            win.show();
                            win.setSettings(props);
                        }
                    }
                }
                Common.component.Analytics.trackEvent("DocumentHolder", "Add Hyperlink");
            };
            var onPaintSlideNum = function (slideNum) {
                if (_.isUndefined(me._XY)) {
                    me._XY = [me.cmpEl.offset().left - $(window).scrollLeft(), me.cmpEl.offset().top - $(window).scrollTop()];
                    me._Width = me.cmpEl.width();
                    me._Height = me.cmpEl.height();
                    me._BodyWidth = $("body").width();
                }
                if (_.isUndefined(me.slideNumDiv)) {
                    me.slideNumDiv = $(document.createElement("div"));
                    me.slideNumDiv.addClass("slidenum-div");
                    me.slideNumDiv.css({
                        position: "absolute",
                        display: "block",
                        zIndex: "900",
                        top: me._XY[1] + me._Height / 2 + "px",
                        right: (me._BodyWidth - me._XY[0] - me._Width + 22) + "px"
                    });
                    $(document.body).append(me.slideNumDiv);
                }
                me.slideNumDiv.html(me.txtSlide + " " + (slideNum + 1));
                me.slideNumDiv.show();
            };
            var onEndPaintSlideNum = function () {
                if (me.slideNumDiv) {
                    me.slideNumDiv.hide();
                }
            };
            var onCoAuthoringDisconnect = function () {
                me.mode.isEdit = false;
            };
            var onDoubleClickOnChart = function (chart) {
                if (me.mode.isEdit) {
                    var diagramEditor = PE.getController("Common.Controllers.ExternalDiagramEditor").getView("Common.Views.ExternalDiagramEditor");
                    if (diagramEditor && chart) {
                        diagramEditor.setEditMode(true);
                        diagramEditor.show();
                        diagramEditor.setChartData(new Asc.asc_CChartBinary(chart));
                    }
                }
            };
            this.changePosition = function () {
                me._XY = [me.cmpEl.offset().left - $(window).scrollLeft(), me.cmpEl.offset().top - $(window).scrollTop()];
                onMouseMoveStart();
            };
            this.hideTips = function () {
                if (typeof userTooltip == "object") {
                    userTooltip.hide();
                    userTooltip = true;
                }
                _.each(me.usertips, function (item) {
                    item.remove();
                });
                me.usertips = [];
                me.usertipcount = 0;
            };
            this.setLiveCommenting = function (value) {
                this.isLiveCommenting = value;
            };
            var keymap = {};
            var hkComments = "command+alt+h,ctrl+alt+h";
            keymap[hkComments] = function () {
                if (me.api.can_AddQuotedComment() !== false && me.slidesCount > 0) {
                    me.addComment();
                }
            };
            var hkPreview = "command+f5,ctrl+f5";
            keymap[hkPreview] = function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (me.slidesCount > 0) {
                    var previewPanel = PE.getController("Viewport").getView("DocumentPreview");
                    if (previewPanel && !previewPanel.isVisible()) {
                        previewPanel.show();
                        if (me.api) {
                            me.api.StartDemonstration("presentation-preview", 0);
                        }
                    }
                }
            };
            Common.util.Shortcuts.delegateShortcuts({
                shortcuts: keymap
            });
            var onApiCountPages = function (count) {
                me.slidesCount = count;
            };
            this.setApi = function (o) {
                me.api = o;
                if (me.api) {
                    me.api.asc_registerCallback("asc_onContextMenu", _.bind(onContextMenu, me));
                    me.api.asc_registerCallback("asc_onMouseMoveStart", _.bind(onMouseMoveStart, me));
                    me.api.asc_registerCallback("asc_onMouseMoveEnd", _.bind(onMouseMoveEnd, me));
                    me.api.asc_registerCallback("asc_onPaintSlideNum", _.bind(onPaintSlideNum, me));
                    me.api.asc_registerCallback("asc_onEndPaintSlideNum", _.bind(onEndPaintSlideNum, me));
                    me.api.asc_registerCallback("asc_onCountPages", _.bind(onApiCountPages, me));
                    me.slidesCount = me.api.getCountPages();
                    me.api.asc_registerCallback("asc_onHyperlinkClick", _.bind(onHyperlinkClick, me));
                    me.api.asc_registerCallback("asc_onMouseMove", _.bind(onMouseMove, me));
                    if (me.mode.isEdit === true) {
                        me.api.asc_registerCallback("asc_onDialogAddHyperlink", _.bind(onDialogAddHyperlink, me));
                        me.api.asc_registerCallback("asc_doubleClickOnChart", onDoubleClickOnChart);
                    }
                    me.api.asc_registerCallback("asc_onСoAuthoringDisconnect", _.bind(onCoAuthoringDisconnect, me));
                    Common.NotificationCenter.on("api:disconnect", _.bind(onCoAuthoringDisconnect, this));
                }
                return me;
            };
            this.mode = {};
            this.setMode = function (mode) {
                if (me.api && mode.isEdit) {
                    me.api.asc_registerCallback("asc_onDialogAddHyperlink", _.bind(onDialogAddHyperlink, me));
                    me.api.asc_registerCallback("asc_doubleClickOnChart", onDoubleClickOnChart);
                }
                me.mode = mode; ! (me.mode.canCoAuthoring && me.mode.isEdit) ? Common.util.Shortcuts.suspendEvents(hkComments) : Common.util.Shortcuts.resumeEvents(hkComments);
                me.editorConfig = {
                    user: mode.user
                };
            };
            me.on("render:after", onAfterRender, me);
        },
        render: function () {
            this.fireEvent("render:before", this);
            this.cmpEl = $(this.el);
            this.fireEvent("render:after", this);
            return this;
        },
        focus: function () {
            var me = this;
            _.defer(function () {
                me.cmpEl.focus();
            },
            50);
        },
        addHyperlink: function (item) {
            var win, me = this;
            if (me.api) {
                var _arr = [];
                for (var i = 0; i < me.api.getCountPages(); i++) {
                    _arr.push({
                        displayValue: i + 1,
                        value: i
                    });
                }
                win = new PE.Views.HyperlinkSettingsDialog({
                    handler: function (dlg, result) {
                        if (result == "ok") {
                            me.api.add_Hyperlink(dlg.getSettings());
                        }
                        me.fireEvent("editcomplete", me);
                    },
                    slides: _arr
                });
                win.show();
                win.setSettings(item.hyperProps.value);
                Common.component.Analytics.trackEvent("DocumentHolder", "Add Hyperlink");
            }
        },
        editHyperlink: function (item, e) {
            var win, me = this;
            if (me.api) {
                var _arr = [];
                for (var i = 0; i < me.api.getCountPages(); i++) {
                    _arr.push({
                        displayValue: i + 1,
                        value: i
                    });
                }
                win = new PE.Views.HyperlinkSettingsDialog({
                    handler: function (dlg, result) {
                        if (result == "ok") {
                            me.api.change_Hyperlink(win.getSettings());
                        }
                        me.fireEvent("editcomplete", me);
                    },
                    slides: _arr
                });
                win.show();
                win.setSettings(item.hyperProps.value);
                Common.component.Analytics.trackEvent("DocumentHolder", "Edit Hyperlink");
            }
        },
        addComment: function (item, e, eOpt) {
            if (this.api && this.mode.canCoAuthoring && this.mode.isEdit) {
                this.suppressEditComplete = true;
                this.api.asc_enableKeyEvents(false);
                var controller = PE.getController("Common.Controllers.Comments");
                if (controller) {
                    controller.addDummyComment();
                }
            }
        },
        editChartClick: function () {
            var diagramEditor = PE.getController("Common.Controllers.ExternalDiagramEditor").getView("Common.Views.ExternalDiagramEditor");
            if (diagramEditor) {
                diagramEditor.setEditMode(true);
                diagramEditor.show();
                var chart = this.api.asc_getChartObject();
                if (chart) {
                    diagramEditor.setChartData(new Asc.asc_CChartBinary(chart));
                }
            }
        },
        onCutCopyPaste: function (item, e) {
            var me = this;
            if (me.api) {
                var value = window.localStorage.getItem("pe-hide-copywarning");
                if (! (value && parseInt(value) == 1) && me.show_copywarning) {
                    (new Common.Views.CopyWarningDialog({
                        handler: function (dontshow) {
                            (item.value == "cut") ? me.api.Cut() : ((item.value == "copy") ? me.api.Copy() : me.api.Paste());
                            if (dontshow) {
                                window.localStorage.setItem("pe-hide-copywarning", 1);
                            }
                            me.fireEvent("editcomplete", me);
                        }
                    })).show();
                } else {
                    (item.value == "cut") ? me.api.Cut() : ((item.value == "copy") ? me.api.Copy() : me.api.Paste());
                    me.fireEvent("editcomplete", me);
                }
            } else {
                me.fireEvent("editcomplete", me);
            }
        },
        createDelayedElements: function () {
            var me = this;
            var mnuDeleteSlide = new Common.UI.MenuItem({
                caption: me.txtDeleteSlide
            }).on("click", _.bind(function (item) {
                if (me.api) {
                    me.api.DeleteSlide();
                    me.fireEvent("editcomplete", this);
                    Common.component.Analytics.trackEvent("DocumentHolder", "Delete Slide");
                }
            },
            me));
            var mnuChangeSlide = new Common.UI.MenuItem({
                caption: me.txtChangeLayout,
                menu: new Common.UI.Menu({
                    menuAlign: "tl-tr",
                    items: [{
                        template: _.template('<div id="id-docholder-menu-changeslide" class="menu-layouts" style="width: 302px; margin: 0 4px;"></div>')
                    }]
                })
            });
            var mnuPreview = new Common.UI.MenuItem({
                caption: me.txtPreview
            }).on("click", function (item) {
                var previewPanel = PE.getController("Viewport").getView("DocumentPreview");
                if (previewPanel) {
                    previewPanel.show();
                    if (me.api) {
                        var current = me.api.getCurrentPage();
                        me.api.StartDemonstration("presentation-preview", _.isNumber(current) ? current : 0);
                        Common.component.Analytics.trackEvent("DocumentHolder", "Preview");
                    }
                }
            });
            var mnuSelectAll = new Common.UI.MenuItem({
                caption: me.txtSelectAll
            }).on("click", function (item) {
                if (me.api) {
                    me.api.SelectAllSlides();
                    me.fireEvent("editcomplete", me);
                    Common.component.Analytics.trackEvent("DocumentHolder", "Select All Slides");
                }
            });
            var menuSlidePaste = new Common.UI.MenuItem({
                caption: me.textPaste,
                value: "paste"
            }).on("click", _.bind(me.onCutCopyPaste, me));
            var menuSlideSettings = new Common.UI.MenuItem({
                caption: me.textSlideSettings,
                value: null
            }).on("click", function (item) {
                PE.getController("RightMenu").onDoubleClickOnObject(item.options.value);
            });
            me.slideMenu = new Common.UI.Menu({
                initMenu: function (value) {
                    menuSlidePaste.setVisible(value.fromThumbs !== true);
                    me.slideMenu.items[1].setVisible(value.fromThumbs === true);
                    me.slideMenu.items[2].setVisible(value.isSlideSelect === true);
                    mnuDeleteSlide.setVisible(value.isSlideSelect === true);
                    me.slideMenu.items[4].setVisible(value.isSlideSelect === true || value.fromThumbs !== true);
                    mnuChangeSlide.setVisible(value.isSlideSelect === true || value.fromThumbs !== true);
                    menuSlideSettings.setVisible(value.fromThumbs !== true);
                    menuSlideSettings.options.value = null;
                    for (var i = 7; i < 11; i++) {
                        me.slideMenu.items[i].setVisible(value.fromThumbs === true);
                    }
                    var selectedElements = me.api.getSelectedElements(),
                    locked = false,
                    lockedDeleted = false,
                    lockedLayout = false;
                    if (selectedElements && _.isArray(selectedElements)) {
                        _.each(selectedElements, function (element, index) {
                            if (c_oAscTypeSelectElement.Slide == element.get_ObjectType()) {
                                var elValue = element.get_ObjectValue();
                                locked = elValue.get_LockDelete();
                                lockedDeleted = elValue.get_LockRemove();
                                lockedLayout = elValue.get_LockLayout();
                                menuSlideSettings.options.value = element;
                                return false;
                            }
                        });
                    }
                    for (var i = 0; i < 3; i++) {
                        me.slideMenu.items[i].setDisabled(locked);
                    }
                    mnuPreview.setDisabled(me.slidesCount < 1);
                    mnuSelectAll.setDisabled(locked || me.slidesCount < 2);
                    mnuDeleteSlide.setDisabled(lockedDeleted || locked);
                    mnuChangeSlide.setDisabled(lockedLayout || locked);
                },
                items: [menuSlidePaste, new Common.UI.MenuItem({
                    caption: me.txtNewSlide
                }).on("click", function (item) {
                    if (me.api) {
                        me.api.AddSlide();
                        me.fireEvent("editcomplete", this);
                        Common.component.Analytics.trackEvent("DocumentHolder", "Add Slide");
                    }
                }), new Common.UI.MenuItem({
                    caption: me.txtDuplicateSlide
                }).on("click", function (item) {
                    if (me.api) {
                        me.api.DublicateSlide();
                        me.fireEvent("editcomplete", this);
                        Common.component.Analytics.trackEvent("DocumentHolder", "Dublicate Hyperlink");
                    }
                }), mnuDeleteSlide, {
                    caption: "--"
                },
                mnuChangeSlide, menuSlideSettings, {
                    caption: "--"
                },
                mnuSelectAll, {
                    caption: "--"
                },
                mnuPreview]
            }).on("hide:after", function (menu) {
                if (me.suppressEditComplete) {
                    me.suppressEditComplete = false;
                    return;
                }
                me.fireEvent("editcomplete", me);
                me.currentMenu = null;
            }).on("render:after", function (cmp) {
                me.slideLayoutMenu = new Common.UI.DataView({
                    el: $("#id-docholder-menu-changeslide"),
                    parentMenu: cmp,
                    restoreHeight: 300,
                    style: "max-height: 300px;",
                    store: PE.getCollection("SlideLayouts"),
                    itemTemplate: _.template(['<div class="layout" id="<%= id %>" style="width: <%= itemWidth %>px;">', '<div style="background-image: url(<%= imageUrl %>); width: <%= itemWidth %>px; height: <%= itemHeight %>px;"/>', '<div class="title"><%= title %></div> ', "</div>"].join(""))
                }).on("item:click", function (picker, item, record) {
                    if (me.api) {
                        me.api.ChangeLayout(record.get("data").idx);
                        me.fireEvent("editcomplete", me);
                        Common.component.Analytics.trackEvent("DocumentHolder", "Change Layout");
                    }
                });
                if (me.slideMenu) {
                    me.slideMenu.on("show:after", function () {
                        me.slideLayoutMenu.scroller.update({
                            alwaysVisibleY: true
                        });
                    });
                }
            });
            var mnuTableMerge = new Common.UI.MenuItem({
                caption: me.mergeCellsText
            }).on("click", function (item) {
                if (me.api) {
                    me.api.MergeCells();
                }
            });
            var mnuTableSplit = new Common.UI.MenuItem({
                caption: me.splitCellsText
            }).on("click", function (item) {
                if (me.api) {
                    (new Common.Views.InsertTableDialog({
                        handler: function (result, value) {
                            if (result == "ok") {
                                if (me.api) {
                                    me.api.SplitCell(value.columns, value.rows);
                                }
                                me.fireEvent("editcomplete", me);
                                Common.component.Analytics.trackEvent("DocumentHolder", "Table Split");
                            }
                        }
                    })).show();
                }
            });
            var menuTableCellAlign = new Common.UI.MenuItem({
                caption: me.cellAlignText,
                menu: (function () {
                    function onItemClick(item, e) {
                        if (me.api) {
                            var properties = new CTableProp();
                            properties.put_CellsVAlign(item.valign);
                            me.api.tblApply(properties);
                        }
                        me.fireEvent("editcomplete", me);
                        Common.component.Analytics.trackEvent("DocumentHolder", "Table Cell Align");
                    }
                    return new Common.UI.Menu({
                        menuAlign: "tl-tr",
                        items: [me.menuTableCellTop = new Common.UI.MenuItem({
                            caption: me.topCellText,
                            checkable: true,
                            toggleGroup: "popuptablecellalign",
                            value: c_oAscVertAlignJc.Top
                        }).on("click", _.bind(onItemClick, me)), me.menuTableCellCenter = new Common.UI.MenuItem({
                            caption: me.centerCellText,
                            checkable: true,
                            toggleGroup: "popuptablecellalign",
                            value: c_oAscVertAlignJc.Center
                        }).on("click", _.bind(onItemClick, me)), me.menuTableCellBottom = new Common.UI.MenuItem({
                            caption: me.bottomCellText,
                            checkable: true,
                            toggleGroup: "popuptablecellalign",
                            value: c_oAscVertAlignJc.Bottom
                        }).on("click", _.bind(onItemClick, me))]
                    });
                })()
            });
            var menuTableAdvanced = new Common.UI.MenuItem({
                caption: me.advancedTableText
            }).on("click", function (item) {
                if (me.api) {
                    var selectedElements = me.api.getSelectedElements();
                    if (selectedElements && selectedElements.length > 0) {
                        var elType, elValue;
                        for (var i = selectedElements.length - 1; i >= 0; i--) {
                            elType = selectedElements[i].get_ObjectType();
                            elValue = selectedElements[i].get_ObjectValue();
                            if (c_oAscTypeSelectElement.Table == elType) {
                                (new PE.Views.TableSettingsAdvanced({
                                    tableProps: elValue,
                                    handler: function (result, value) {
                                        if (result == "ok") {
                                            if (me.api) {
                                                me.api.tblApply(value.tableProps);
                                            }
                                        }
                                        me.fireEvent("editcomplete", me);
                                        Common.component.Analytics.trackEvent("DocumentHolder", "Table Settings Advanced");
                                    }
                                })).show();
                                break;
                            }
                        }
                    }
                }
            });
            var menuImageAdvanced = new Common.UI.MenuItem({
                caption: me.advancedImageText
            }).on("click", function (item) {
                if (me.api) {
                    var selectedElements = me.api.getSelectedElements();
                    if (selectedElements && selectedElements.length > 0) {
                        var elType, elValue;
                        for (var i = selectedElements.length - 1; i >= 0; i--) {
                            elType = selectedElements[i].get_ObjectType();
                            elValue = selectedElements[i].get_ObjectValue();
                            if (c_oAscTypeSelectElement.Image == elType) {
                                var imgsizeOriginal;
                                if (!menuImgOriginalSize.isDisabled()) {
                                    imgsizeOriginal = me.api.get_OriginalSizeImage();
                                    if (imgsizeOriginal) {
                                        imgsizeOriginal = {
                                            width: imgsizeOriginal.get_ImageWidth(),
                                            height: imgsizeOriginal.get_ImageHeight()
                                        };
                                    }
                                } (new PE.Views.ImageSettingsAdvanced({
                                    imageProps: elValue,
                                    sizeOriginal: imgsizeOriginal,
                                    handler: function (result, value) {
                                        if (result == "ok") {
                                            if (me.api) {
                                                me.api.ImgApply(value.imageProps);
                                            }
                                        }
                                        me.fireEvent("editcomplete", me);
                                        Common.component.Analytics.trackEvent("DocumentHolder", "Image Settings Advanced");
                                    }
                                })).show();
                                break;
                            }
                        }
                    }
                }
            });
            var menuShapeAdvanced = new Common.UI.MenuItem({
                caption: me.advancedShapeText
            }).on("click", function (item) {
                if (me.api) {
                    var selectedElements = me.api.getSelectedElements();
                    if (selectedElements && selectedElements.length > 0) {
                        var elType, elValue;
                        for (var i = selectedElements.length - 1; i >= 0; i--) {
                            elType = selectedElements[i].get_ObjectType();
                            elValue = selectedElements[i].get_ObjectValue();
                            if (c_oAscTypeSelectElement.Shape == elType) {
                                (new PE.Views.ShapeSettingsAdvanced({
                                    shapeProps: elValue,
                                    handler: function (result, value) {
                                        if (result == "ok") {
                                            if (me.api) {
                                                me.api.ShapeApply(value.shapeProps);
                                            }
                                        }
                                        me.fireEvent("editcomplete", me);
                                        Common.component.Analytics.trackEvent("DocumentHolder", "Image Shape Advanced");
                                    }
                                })).show();
                                break;
                            }
                        }
                    }
                }
            });
            var menuParagraphAdvanced = new Common.UI.MenuItem({
                caption: me.advancedParagraphText
            }).on("click", function (item) {
                if (me.api) {
                    var selectedElements = me.api.getSelectedElements();
                    if (selectedElements && selectedElements.length > 0) {
                        var elType, elValue;
                        for (var i = selectedElements.length - 1; i >= 0; i--) {
                            elType = selectedElements[i].get_ObjectType();
                            elValue = selectedElements[i].get_ObjectValue();
                            if (c_oAscTypeSelectElement.Paragraph == elType) {
                                (new PE.Views.ParagraphSettingsAdvanced({
                                    paragraphProps: elValue,
                                    api: me.api,
                                    handler: function (result, value) {
                                        if (result == "ok") {
                                            if (me.api) {
                                                me.api.paraApply(value.paragraphProps);
                                            }
                                        }
                                        me.fireEvent("editcomplete", me);
                                        Common.component.Analytics.trackEvent("DocumentHolder", "Image Paragraph Advanced");
                                    }
                                })).show();
                                break;
                            }
                        }
                    }
                }
            });
            var menuCommentParaSeparator = new Common.UI.MenuItem({
                caption: "--"
            });
            var menuAddHyperlinkPara = new Common.UI.MenuItem({
                caption: me.hyperlinkText
            }).on("click", _.bind(me.addHyperlink, me));
            var menuEditHyperlinkPara = new Common.UI.MenuItem({
                caption: me.editHyperlinkText
            }).on("click", _.bind(me.editHyperlink, me));
            var menuRemoveHyperlinkPara = new Common.UI.MenuItem({
                caption: me.removeHyperlinkText
            }).on("click", function (item) {
                if (me.api) {
                    me.api.remove_Hyperlink();
                }
                me.fireEvent("editcomplete", me);
                Common.component.Analytics.trackEvent("DocumentHolder", "Remove Hyperlink");
            });
            var menuHyperlinkPara = new Common.UI.MenuItem({
                caption: me.hyperlinkText,
                menu: new Common.UI.Menu({
                    menuAlign: "tl-tr",
                    items: [menuEditHyperlinkPara, menuRemoveHyperlinkPara]
                })
            });
            var menuAddHyperlinkTable = new Common.UI.MenuItem({
                caption: me.hyperlinkText
            }).on("click", _.bind(me.addHyperlink, me));
            var menuEditHyperlinkTable = new Common.UI.MenuItem({
                caption: me.editHyperlinkText
            }).on("click", _.bind(me.editHyperlink, me));
            var menuRemoveHyperlinkTable = new Common.UI.MenuItem({
                caption: me.removeHyperlinkText
            }).on("click", function (item) {
                if (me.api) {
                    me.api.remove_Hyperlink();
                }
                me.fireEvent("editcomplete", me);
                Common.component.Analytics.trackEvent("DocumentHolder", "Remove Hyperlink Table");
            });
            var menuHyperlinkTable = new Common.UI.MenuItem({
                caption: me.hyperlinkText,
                menu: new Common.UI.Menu({
                    menuAlign: "tl-tr",
                    items: [menuEditHyperlinkTable, menuRemoveHyperlinkTable]
                })
            });
            var menuHyperlinkSeparator = new Common.UI.MenuItem({
                caption: "--"
            });
            var mnuGroupImg = new Common.UI.MenuItem({
                caption: this.txtGroup,
                iconCls: "mnu-group"
            }).on("click", function (item) {
                if (me.api) {
                    me.api.groupShapes();
                }
                me.fireEvent("editcomplete", this);
                Common.component.Analytics.trackEvent("DocumentHolder", "Group Image");
            });
            var mnuUnGroupImg = new Common.UI.MenuItem({
                caption: this.txtUngroup,
                iconCls: "mnu-ungroup"
            }).on("click", function (item) {
                if (me.api) {
                    me.api.unGroupShapes();
                }
                me.fireEvent("editcomplete", this);
                Common.component.Analytics.trackEvent("DocumentHolder", "Ungroup Image");
            });
            var menuImgShapeArrange = new Common.UI.MenuItem({
                caption: me.txtArrange,
                menu: new Common.UI.Menu({
                    menuAlign: "tl-tr",
                    items: [new Common.UI.MenuItem({
                        caption: this.textArrangeFront,
                        iconCls: "mnu-arrange-front"
                    }).on("click", function (item) {
                        if (me.api) {
                            me.api.shapes_bringToFront();
                        }
                        me.fireEvent("editcomplete", me);
                        Common.component.Analytics.trackEvent("DocumentHolder", "Bring To Front");
                    }), new Common.UI.MenuItem({
                        caption: this.textArrangeBack,
                        iconCls: "mnu-arrange-back"
                    }).on("click", function (item) {
                        if (me.api) {
                            me.api.shapes_bringToBack();
                        }
                        me.fireEvent("editcomplete", me);
                        Common.component.Analytics.trackEvent("DocumentHolder", "Bring To Back");
                    }), new Common.UI.MenuItem({
                        caption: this.textArrangeForward,
                        iconCls: "mnu-arrange-forward"
                    }).on("click", function (item) {
                        if (me.api) {
                            me.api.shapes_bringForward();
                        }
                        me.fireEvent("editcomplete", me);
                        Common.component.Analytics.trackEvent("DocumentHolder", "Send Forward");
                    }), new Common.UI.MenuItem({
                        caption: this.textArrangeBackward,
                        iconCls: "mnu-arrange-backward"
                    }).on("click", function (item) {
                        if (me.api) {
                            me.api.shapes_bringBackward();
                        }
                        me.fireEvent("editcomplete", me);
                        Common.component.Analytics.trackEvent("DocumentHolder", "Send Backward");
                    }), {
                        caption: "--"
                    },
                    mnuGroupImg, mnuUnGroupImg]
                })
            });
            var menuImgShapeAlign = new Common.UI.MenuItem({
                caption: me.txtAlign,
                menu: (function () {
                    function onItemClick(item) {
                        if (me.api) {
                            me.api.put_ShapesAlign(item.value);
                        }
                        me.fireEvent("editcomplete", me);
                        Common.component.Analytics.trackEvent("DocumentHolder", "Image Shape Align");
                    }
                    return new Common.UI.Menu({
                        menuAlign: "tl-tr",
                        items: [new Common.UI.MenuItem({
                            caption: me.textShapeAlignLeft,
                            iconCls: "mnu-shape-align-left",
                            value: c_oAscAlignShapeType.ALIGN_LEFT
                        }).on("click", _.bind(onItemClick, me)), new Common.UI.MenuItem({
                            caption: me.textShapeAlignCenter,
                            iconCls: "mnu-shape-align-center",
                            value: c_oAscAlignShapeType.ALIGN_CENTER
                        }).on("click", _.bind(onItemClick, me)), new Common.UI.MenuItem({
                            caption: me.textShapeAlignRight,
                            iconCls: "mnu-shape-align-right",
                            value: c_oAscAlignShapeType.ALIGN_RIGHT
                        }).on("click", _.bind(onItemClick, me)), new Common.UI.MenuItem({
                            caption: me.textShapeAlignTop,
                            iconCls: "mnu-shape-align-top",
                            value: c_oAscAlignShapeType.ALIGN_TOP
                        }).on("click", _.bind(onItemClick, me)), new Common.UI.MenuItem({
                            caption: me.textShapeAlignMiddle,
                            iconCls: "mnu-shape-align-middle",
                            value: c_oAscAlignShapeType.ALIGN_MIDDLE
                        }).on("click", _.bind(onItemClick, me)), new Common.UI.MenuItem({
                            caption: me.textShapeAlignBottom,
                            iconCls: "mnu-shape-align-bottom",
                            value: c_oAscAlignShapeType.ALIGN_BOTTOM
                        }).on("click", _.bind(onItemClick, me)), {
                            caption: "--"
                        },
                        new Common.UI.MenuItem({
                            caption: me.txtDistribHor,
                            iconCls: "mnu-distrib-hor"
                        }).on("click", function (item) {
                            if (me.api) {
                                me.api.DistributeHorizontally();
                            }
                            me.fireEvent("editcomplete", me);
                            Common.component.Analytics.trackEvent("DocumentHolder", "Distribute Horizontally");
                        }), new Common.UI.MenuItem({
                            caption: me.txtDistribVert,
                            iconCls: "mnu-distrib-vert"
                        }).on("click", function (item) {
                            if (me.api) {
                                me.api.DistributeVertically();
                            }
                            me.fireEvent("editcomplete", me);
                            Common.component.Analytics.trackEvent("DocumentHolder", "Distribute Vertically");
                        })]
                    });
                })()
            });
            var menuChartEdit = new Common.UI.MenuItem({
                caption: me.editChartText
            }).on("click", _.bind(me.editChartClick, me));
            var menuParagraphVAlign = new Common.UI.MenuItem({
                caption: me.vertAlignText,
                menu: (function () {
                    function onItemClick(item) {
                        if (me.api) {
                            var properties = new CAscShapeProp();
                            properties.put_VerticalTextAlign(item.value);
                            me.api.ShapeApply(properties);
                        }
                        me.fireEvent("editcomplete", me);
                        Common.component.Analytics.trackEvent("DocumentHolder", "Text Vertical Align");
                    }
                    return new Common.UI.Menu({
                        menuAlign: "tl-tr",
                        items: [me.menuParagraphTop = new Common.UI.MenuItem({
                            caption: me.topCellText,
                            checkable: true,
                            toggleGroup: "popupparagraphvalign",
                            value: c_oAscVerticalTextAlign.TEXT_ALIGN_TOP
                        }).on("click", _.bind(onItemClick, me)), me.menuParagraphCenter = new Common.UI.MenuItem({
                            caption: me.centerCellText,
                            checkable: true,
                            toggleGroup: "popupparagraphvalign",
                            value: c_oAscVerticalTextAlign.TEXT_ALIGN_CTR
                        }).on("click", _.bind(onItemClick, me)), me.menuParagraphBottom = new Common.UI.MenuItem({
                            caption: me.bottomCellText,
                            checkable: true,
                            toggleGroup: "popupparagraphvalign",
                            value: c_oAscVerticalTextAlign.TEXT_ALIGN_BOTTOM
                        }).on("click", _.bind(onItemClick, me))]
                    });
                })()
            });
            var menuImgShapeSeparator = new Common.UI.MenuItem({
                caption: "--"
            });
            var menuImgOriginalSize = new Common.UI.MenuItem({
                caption: me.originalSizeText
            }).on("click", function (item) {
                if (me.api) {
                    var originalImageSize = me.api.get_OriginalSizeImage();
                    if (originalImageSize) {
                        var properties = new CImgProperty();
                        properties.put_Width(originalImageSize.get_ImageWidth());
                        properties.put_Height(originalImageSize.get_ImageHeight());
                        me.api.ImgApply(properties);
                    }
                    me.fireEvent("editcomplete", me);
                    Common.component.Analytics.trackEvent("DocumentHolder", "Set Image Original Size");
                }
            });
            var menuAddCommentPara = new Common.UI.MenuItem({
                caption: me.addCommentText
            }).on("click", _.bind(me.addComment, me));
            menuAddCommentPara.hide();
            var menuAddCommentTable = new Common.UI.MenuItem({
                caption: me.addCommentText
            }).on("click", _.bind(me.addComment, me));
            menuAddCommentTable.hide();
            var menuCommentSeparatorImg = new Common.UI.MenuItem({
                caption: "--"
            });
            menuCommentSeparatorImg.hide();
            var menuAddCommentImg = new Common.UI.MenuItem({
                caption: me.addCommentText
            }).on("click", _.bind(me.addComment, me));
            menuAddCommentImg.hide();
            var menuParaCopy = new Common.UI.MenuItem({
                caption: me.textCopy,
                value: "copy"
            }).on("click", _.bind(me.onCutCopyPaste, me));
            var menuParaPaste = new Common.UI.MenuItem({
                caption: me.textPaste,
                value: "paste"
            }).on("click", _.bind(me.onCutCopyPaste, me));
            var menuParaCut = new Common.UI.MenuItem({
                caption: me.textCut,
                value: "cut"
            }).on("click", _.bind(me.onCutCopyPaste, me));
            var menuImgCopy = new Common.UI.MenuItem({
                caption: me.textCopy,
                value: "copy"
            }).on("click", _.bind(me.onCutCopyPaste, me));
            var menuImgPaste = new Common.UI.MenuItem({
                caption: me.textPaste,
                value: "paste"
            }).on("click", _.bind(me.onCutCopyPaste, me));
            var menuImgCut = new Common.UI.MenuItem({
                caption: me.textCut,
                value: "cut"
            }).on("click", _.bind(me.onCutCopyPaste, me));
            var menuTableCopy = new Common.UI.MenuItem({
                caption: me.textCopy,
                value: "copy"
            }).on("click", _.bind(me.onCutCopyPaste, me));
            var menuTablePaste = new Common.UI.MenuItem({
                caption: me.textPaste,
                value: "paste"
            }).on("click", _.bind(me.onCutCopyPaste, me));
            var menuTableCut = new Common.UI.MenuItem({
                caption: me.textCut,
                value: "cut"
            }).on("click", _.bind(me.onCutCopyPaste, me));
            me.textMenu = new Common.UI.Menu({
                initMenu: function (value) {
                    var isInShape = (value.shapeProps && !_.isNull(value.shapeProps.value));
                    var isInChart = (value.chartProps && !_.isNull(value.chartProps.value));
                    var disabled = (value.paraProps !== undefined && value.paraProps.locked) || (value.slideProps !== undefined && value.slideProps.locked) || (isInShape && value.shapeProps.locked);
                    menuParagraphVAlign.setVisible(isInShape && !isInChart);
                    if (isInShape || isInChart) {
                        var align = value.shapeProps.value.get_VerticalTextAlign();
                        me.menuParagraphTop.setChecked(align == c_oAscVerticalTextAlign.TEXT_ALIGN_TOP);
                        me.menuParagraphCenter.setChecked(align == c_oAscVerticalTextAlign.TEXT_ALIGN_CTR);
                        me.menuParagraphBottom.setChecked(align == c_oAscVerticalTextAlign.TEXT_ALIGN_BOTTOM);
                    }
                    menuParagraphVAlign.setDisabled(disabled);
                    var text = null;
                    if (me.api) {
                        text = me.api.can_AddHyperlink();
                    }
                    menuAddHyperlinkPara.setVisible(value.hyperProps === undefined && text !== false);
                    menuHyperlinkPara.setVisible(value.hyperProps !== undefined);
                    menuEditHyperlinkPara.hyperProps = value.hyperProps;
                    if (text !== false) {
                        menuAddHyperlinkPara.hyperProps = {};
                        menuAddHyperlinkPara.hyperProps.value = new CHyperlinkProperty();
                        menuAddHyperlinkPara.hyperProps.value.put_Text(text);
                    }
                    menuAddCommentPara.setVisible(!isInChart && me.api.can_AddQuotedComment() !== false && me.mode.canCoAuthoring);
                    menuCommentParaSeparator.setVisible(menuAddCommentPara.isVisible() || menuAddHyperlinkPara.isVisible() || menuHyperlinkPara.isVisible());
                    menuAddHyperlinkPara.setDisabled(disabled);
                    menuHyperlinkPara.setDisabled(disabled);
                    menuAddCommentPara.setDisabled(disabled);
                    menuParagraphAdvanced.setDisabled(disabled);
                    menuParaCut.setDisabled(disabled);
                    menuParaPaste.setDisabled(disabled);
                },
                items: [menuParaCut, menuParaCopy, menuParaPaste, {
                    caption: "--"
                },
                menuParagraphVAlign, menuParagraphAdvanced, menuCommentParaSeparator, menuAddCommentPara, menuAddHyperlinkPara, menuHyperlinkPara]
            }).on("hide:after", function (menu) {
                if (me.suppressEditComplete) {
                    me.suppressEditComplete = false;
                    return;
                }
                me.fireEvent("editcomplete", me);
                me.currentMenu = null;
            });
            me.tableMenu = new Common.UI.Menu({
                initMenu: function (value) {
                    if (_.isUndefined(value.tableProps)) {
                        return;
                    }
                    var disabled = (value.slideProps !== undefined && value.slideProps.locked);
                    me.menuTableCellTop.setChecked(value.tableProps.value.get_CellsVAlign() == c_oAscVertAlignJc.Top);
                    me.menuTableCellCenter.setChecked(value.tableProps.value.get_CellsVAlign() == c_oAscVertAlignJc.Center);
                    me.menuTableCellBottom.setChecked(value.tableProps.value.get_CellsVAlign() == c_oAscVertAlignJc.Bottom);
                    if (me.api) {
                        mnuTableMerge.setDisabled(value.tableProps.locked || disabled || !me.api.CheckBeforeMergeCells());
                        mnuTableSplit.setDisabled(value.tableProps.locked || disabled || !me.api.CheckBeforeSplitCells());
                    }
                    me.tableMenu.items[5].setDisabled(value.tableProps.locked || disabled);
                    me.tableMenu.items[6].setDisabled(value.tableProps.locked || disabled);
                    menuTableCellAlign.setDisabled(value.tableProps.locked || disabled);
                    menuTableAdvanced.setDisabled(value.tableProps.locked || disabled);
                    menuTableCut.setDisabled(value.tableProps.locked || disabled);
                    menuTablePaste.setDisabled(value.tableProps.locked || disabled);
                    var text = null;
                    if (me.api) {
                        text = me.api.can_AddHyperlink();
                    }
                    menuAddHyperlinkTable.setVisible(!_.isUndefined(value.paraProps) && _.isUndefined(value.hyperProps) && text !== false);
                    menuHyperlinkTable.setVisible(!_.isUndefined(value.paraProps) && !_.isUndefined(value.hyperProps));
                    menuEditHyperlinkTable.hyperProps = value.hyperProps;
                    if (text !== false) {
                        menuAddHyperlinkTable.hyperProps = {};
                        menuAddHyperlinkTable.hyperProps.value = new CHyperlinkProperty();
                        menuAddHyperlinkTable.hyperProps.value.put_Text(text);
                    }
                    if (!_.isUndefined(value.paraProps)) {
                        menuAddHyperlinkTable.setDisabled(value.paraProps.locked || disabled);
                        menuHyperlinkTable.setDisabled(value.paraProps.locked || disabled);
                    }
                    menuAddCommentTable.setVisible(me.api.can_AddQuotedComment() !== false && me.mode.canCoAuthoring);
                    menuAddCommentTable.setDisabled(!_.isUndefined(value.paraProps) && value.paraProps.locked || disabled);
                    menuHyperlinkSeparator.setVisible(menuAddHyperlinkTable.isVisible() || menuHyperlinkTable.isVisible() || menuAddCommentTable.isVisible());
                },
                items: [menuTableCut, menuTableCopy, menuTablePaste, {
                    caption: "--"
                },
                new Common.UI.MenuItem({
                    caption: me.selectText,
                    menu: new Common.UI.Menu({
                        menuAlign: "tl-tr",
                        items: [new Common.UI.MenuItem({
                            caption: me.rowText
                        }).on("click", function () {
                            if (me.api) {
                                me.api.selectRow();
                            }
                        }), new Common.UI.MenuItem({
                            caption: me.columnText
                        }).on("click", function () {
                            if (me.api) {
                                me.api.selectColumn();
                            }
                        }), new Common.UI.MenuItem({
                            caption: me.cellText
                        }).on("click", function () {
                            if (me.api) {
                                me.api.selectCell();
                            }
                        }), new Common.UI.MenuItem({
                            caption: me.tableText
                        }).on("click", function () {
                            if (me.api) {
                                me.api.selectTable();
                            }
                        })]
                    })
                }), {
                    caption: me.insertText,
                    menu: new Common.UI.Menu({
                        menuAlign: "tl-tr",
                        style: "width: 100px",
                        items: [new Common.UI.MenuItem({
                            caption: me.insertColumnLeftText
                        }).on("click", function (item) {
                            if (me.api) {
                                me.api.addColumnLeft();
                            }
                        }), new Common.UI.MenuItem({
                            caption: me.insertColumnRightText
                        }).on("click", function (item) {
                            if (me.api) {
                                me.api.addColumnRight();
                            }
                        }), new Common.UI.MenuItem({
                            caption: me.insertRowAboveText
                        }).on("click", function (item) {
                            if (me.api) {
                                me.api.addRowAbove();
                            }
                        }), new Common.UI.MenuItem({
                            caption: me.insertRowBelowText
                        }).on("click", function (item) {
                            if (me.api) {
                                me.api.addRowBelow();
                            }
                        })]
                    })
                },
                new Common.UI.MenuItem({
                    caption: me.deleteText,
                    menu: new Common.UI.Menu({
                        menuAlign: "tl-tr",
                        items: [new Common.UI.MenuItem({
                            caption: me.rowText
                        }).on("click", function () {
                            if (me.api) {
                                me.api.remRow();
                            }
                        }), new Common.UI.MenuItem({
                            caption: me.columnText
                        }).on("click", function () {
                            if (me.api) {
                                me.api.remColumn();
                            }
                        }), new Common.UI.MenuItem({
                            caption: me.tableText
                        }).on("click", function () {
                            if (me.api) {
                                me.api.remTable();
                            }
                        })]
                    })
                }), {
                    caption: "--"
                },
                mnuTableMerge, mnuTableSplit, {
                    caption: "--"
                },
                menuTableCellAlign, {
                    caption: "--"
                },
                menuTableAdvanced, menuHyperlinkSeparator, menuAddCommentTable, menuAddHyperlinkTable, menuHyperlinkTable]
            }).on("hide:after", function (menu) {
                if (me.suppressEditComplete) {
                    me.suppressEditComplete = false;
                    return;
                }
                me.fireEvent("editcomplete", me);
                me.currentMenu = null;
            });
            me.pictureMenu = new Common.UI.Menu({
                initMenu: function (value) {
                    if (me.api) {
                        mnuUnGroupImg.setDisabled(!me.api.canUnGroup());
                        mnuGroupImg.setDisabled(!me.api.canGroup());
                    }
                    var imgdisabled = (value.imgProps !== undefined && value.imgProps.locked),
                    shapedisabled = (value.shapeProps !== undefined && value.shapeProps.locked),
                    chartdisabled = (value.chartProps !== undefined && value.chartProps.locked),
                    disabled = imgdisabled || shapedisabled || chartdisabled || (value.slideProps !== undefined && value.slideProps.locked);
                    menuImgOriginalSize.setVisible(_.isUndefined(value.shapeProps) && _.isUndefined(value.chartProps));
                    if (menuImgOriginalSize.isVisible()) {
                        menuImgOriginalSize.setDisabled(disabled || _.isNull(value.imgProps.value.get_ImageUrl()) || _.isUndefined(value.imgProps.value.get_ImageUrl()));
                    }
                    menuImageAdvanced.setVisible(_.isUndefined(value.shapeProps) && _.isUndefined(value.chartProps));
                    menuShapeAdvanced.setVisible(_.isUndefined(value.imgProps) && _.isUndefined(value.chartProps));
                    menuChartEdit.setVisible(_.isUndefined(value.imgProps) && !_.isUndefined(value.chartProps) && (_.isUndefined(value.shapeProps) || value.shapeProps.isChart));
                    menuImgShapeSeparator.setVisible(menuImageAdvanced.isVisible() || menuShapeAdvanced.isVisible() || menuChartEdit.isVisible());
                    menuAddCommentImg.setVisible(me.api.can_AddQuotedComment() !== false && me.mode.canCoAuthoring);
                    menuCommentSeparatorImg.setVisible(menuAddCommentImg.isVisible());
                    menuAddCommentImg.setDisabled(disabled);
                    menuImgShapeAlign.setDisabled(disabled);
                    menuImageAdvanced.setDisabled(disabled);
                    menuShapeAdvanced.setDisabled(disabled);
                    if (menuChartEdit.isVisible()) {
                        menuChartEdit.setDisabled(disabled);
                    }
                    menuImgCut.setDisabled(disabled);
                    menuImgPaste.setDisabled(disabled);
                },
                items: [menuImgCut, menuImgCopy, menuImgPaste, {
                    caption: "--"
                },
                menuImgShapeArrange, menuImgShapeAlign, menuImgShapeSeparator, menuImgOriginalSize, menuImageAdvanced, menuShapeAdvanced, menuChartEdit, menuCommentSeparatorImg, menuAddCommentImg]
            }).on("hide:after", function (menu) {
                if (me.suppressEditComplete) {
                    me.suppressEditComplete = false;
                    return;
                }
                me.fireEvent("editcomplete", me);
                me.currentMenu = null;
            });
            var nextpage = $("#id_buttonNextPage");
            nextpage.attr("data-toggle", "tooltip");
            nextpage.tooltip({
                title: me.textNextPage + Common.Utils.String.platformKey("PgDn"),
                placement: "top-right"
            });
            var prevpage = $("#id_buttonPrevPage");
            prevpage.attr("data-toggle", "tooltip");
            prevpage.tooltip({
                title: me.textPrevPage + Common.Utils.String.platformKey("PgUp"),
                placement: "top-right"
            });
        },
        insertRowAboveText: "Row Above",
        insertRowBelowText: "Row Below",
        insertColumnLeftText: "Column Left",
        insertColumnRightText: "Column Right",
        deleteText: "Delete",
        deleteRowText: "Delete Row",
        deleteColumnText: "Delete Column",
        deleteTableText: "Delete Table",
        mergeCellsText: "Merge Cells",
        splitCellsText: "Split Cell...",
        splitCellTitleText: "Split Cell",
        originalSizeText: "Default Size",
        advancedImageText: "Image Advanced Settings",
        hyperlinkText: "Hyperlink",
        editHyperlinkText: "Edit Hyperlink",
        removeHyperlinkText: "Remove Hyperlink",
        txtPressLink: "Press CTRL and click link",
        selectText: "Select",
        insertRowText: "Insert Row",
        insertColumnText: "Insert Column",
        rowText: "Row",
        columnText: "Column",
        cellText: "Cell",
        tableText: "Table",
        aboveText: "Above",
        belowText: "Below",
        advancedTableText: "Table Advanced Settings",
        txtSelectAll: "Select All",
        txtNewSlide: "New Slide",
        txtDuplicateSlide: "Duplicate Slide",
        txtDeleteSlide: "Delete Slide",
        txtBackground: "Background",
        txtChangeLayout: "Change Layout",
        txtPreview: "Preview",
        textShapeAlignLeft: "Align Left",
        textShapeAlignRight: "Align Right",
        textShapeAlignCenter: "Align Center",
        textShapeAlignTop: "Align Top",
        textShapeAlignBottom: "Align Bottom",
        textShapeAlignMiddle: "Align Middle",
        textArrangeFront: "Bring To Front",
        textArrangeBack: "Send To Back",
        textArrangeForward: "Bring Forward",
        textArrangeBackward: "Send Backward",
        txtGroup: "Group",
        txtUngroup: "Ungroup",
        txtArrange: "Arrange",
        txtAlign: "Align",
        txtDistribHor: "Distribute Horizontally",
        txtDistribVert: "Distribute Vertically",
        txtSlide: "Slide",
        topCellText: "Align Top",
        centerCellText: "Align Center",
        bottomCellText: "Align Bottom",
        cellAlignText: "Cell Vertical Alignment",
        advancedShapeText: "Shape Advanced Settings",
        addCommentText: "Add Comment",
        editChartText: "Edit Data",
        vertAlignText: "Vertical Alignment",
        advancedParagraphText: "Text Advanced Settings",
        tipIsLocked: "This element is currently being edited by another user.",
        textNextPage: "Next Slide",
        textPrevPage: "Previous Slide",
        insertText: "Insert",
        textCopy: "Copy",
        textPaste: "Paste",
        textCut: "Cut",
        textSlideSettings: "Slide Settings"
    },
    PE.Views.DocumentHolder || {}));
});