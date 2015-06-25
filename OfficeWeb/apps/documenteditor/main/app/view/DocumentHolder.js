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
 define(["jquery", "underscore", "backbone", "gateway", "common/main/lib/util/utils", "common/main/lib/component/Menu", "common/main/lib/view/InsertTableDialog", "common/main/lib/view/CopyWarningDialog", "documenteditor/main/app/view/DropcapSettingsAdvanced", "documenteditor/main/app/view/HyperlinkSettingsDialog", "documenteditor/main/app/view/ParagraphSettingsAdvanced", "documenteditor/main/app/view/TableSettingsAdvanced"], function ($, _, Backbone, gateway) {
    DE.Views.DocumentHolder = Backbone.View.extend(_.extend({
        el: "#editor_sdk",
        template: null,
        events: {},
        initialize: function () {
            var me = this;
            var usersStore = DE.getCollection("Common.Collections.Users");
            var value = window.localStorage.getItem("de-settings-livecomment");
            me.isLiveCommenting = !(value !== null && parseInt(value) == 0);
            me.show_copywarning = true;
            me._TtHeight = 20;
            me._currentSpellObj = undefined;
            me._currLang = {};
            me.usertips = [];
            var showPopupMenu = function (menu, value, event, docElement, eOpts) {
                if (!_.isUndefined(menu) && menu !== null && me.mode.isEdit) {
                    Common.UI.Menu.Manager.hideAll();
                    var showPoint = [event.get_X(), event.get_Y()],
                    menuContainer = $(me.el).find(Common.Utils.String.format("#menu-container-{0}", menu.id));
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
                    var menu_props = {};
                    var menu_to_show = this.textMenu;
                    var noobject = true;
                    var selectedElements = me.api.getSelectedElements();
                    if (selectedElements && _.isArray(selectedElements)) {
                        for (var i = 0; i < selectedElements.length; i++) {
                            var elType = selectedElements[i].get_ObjectType();
                            var elValue = selectedElements[i].get_ObjectValue();
                            if (c_oAscTypeSelectElement.Image == elType) {
                                menu_to_show = this.pictureMenu;
                                if (menu_props.imgProps === undefined) {
                                    menu_props.imgProps = {};
                                }
                                var shapeprops = elValue.get_ShapeProperties();
                                var chartprops = elValue.get_ChartProperties();
                                if (shapeprops) {
                                    if (shapeprops.get_FromChart()) {
                                        menu_props.imgProps.isChart = true;
                                    } else {
                                        menu_props.imgProps.isShape = true;
                                    }
                                } else {
                                    if (chartprops) {
                                        menu_props.imgProps.isChart = true;
                                    } else {
                                        menu_props.imgProps.isImg = true;
                                    }
                                }
                                menu_props.imgProps.value = elValue;
                                menu_props.imgProps.locked = (elValue) ? elValue.get_Locked() : false;
                                noobject = false;
                                if ((shapeprops === undefined || shapeprops === null) && (chartprops === undefined || chartprops === null)) {
                                    break;
                                }
                            } else {
                                if (c_oAscTypeSelectElement.Table == elType) {
                                    menu_to_show = this.tableMenu;
                                    menu_props.tableProps = {};
                                    menu_props.tableProps.value = elValue;
                                    menu_props.tableProps.locked = (elValue) ? elValue.get_Locked() : false;
                                    noobject = false;
                                } else {
                                    if (c_oAscTypeSelectElement.Paragraph == elType) {
                                        menu_props.paraProps = {};
                                        menu_props.paraProps.value = elValue;
                                        menu_props.paraProps.locked = (elValue) ? elValue.get_Locked() : false;
                                        if (menu_props.imgProps && (menu_props.imgProps.isChart || menu_props.imgProps.isShape) && menu_props.tableProps === undefined) {
                                            menu_to_show = this.textMenu;
                                        }
                                        noobject = false;
                                    } else {
                                        if (c_oAscTypeSelectElement.Hyperlink == elType) {
                                            if (menu_props.hyperProps) {
                                                menu_props.hyperProps.isSeveralLinks = true;
                                            } else {
                                                menu_props.hyperProps = {};
                                            }
                                            menu_props.hyperProps.value = elValue;
                                        } else {
                                            if (c_oAscTypeSelectElement.Header == elType) {
                                                menu_props.headerProps = {};
                                                menu_props.headerProps.locked = (elValue) ? elValue.get_Locked() : false;
                                            } else {
                                                if (c_oAscTypeSelectElement.SpellCheck == elType) {
                                                    menu_props.spellProps = {};
                                                    menu_props.spellProps.value = elValue;
                                                    me._currentSpellObj = elValue;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (!noobject) {
                            showPopupMenu(menu_to_show, menu_props, event, docElement, eOpts);
                        }
                    }
                }
            };
            var onContextMenu = function (event) {
                _.delay(function () {
                    if (event.get_Type() == 0) {
                        showObjectMenu.call(me, event);
                    } else {
                        showPopupMenu.call(me, me.hdrMenu, {
                            Header: event.is_Header(),
                            PageNum: event.get_PageNum()
                        },
                        event);
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
                    if (key == Common.UI.Keys.ESC) {
                        Common.UI.Menu.Manager.hideAll();
                        Common.NotificationCenter.trigger("leftmenu:change", "hide");
                    }
                }
            };
            var onDocumentHolderResize = function (e) {
                me._XY = [me.cmpEl.offset().left - $(window).scrollLeft(), me.cmpEl.offset().top - $(window).scrollTop()];
                me._Height = me.cmpEl.height();
                me._BodyWidth = $("body").width();
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
                var viewport = DE.getController("Viewport").getView("Viewport");
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
                if (me._XY === undefined) {
                    me._XY = [me.cmpEl.offset().left - $(window).scrollLeft(), me.cmpEl.offset().top - $(window).scrollTop()];
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
                            } else {
                                src.css({
                                    visibility: "hidden"
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
                    if (text !== false) {
                        win = new DE.Views.HyperlinkSettingsDialog({
                            handler: handlerDlg
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
                            win = new DE.Views.HyperlinkSettingsDialog({
                                handler: handlerDlg
                            });
                            win.show();
                            win.setSettings(props);
                        }
                    }
                    Common.component.Analytics.trackEvent("DocumentHolder", "Add Hyperlink");
                }
            };
            var onDoubleClickOnChart = function (chart) {
                if (me.mode.isEdit) {
                    var diagramEditor = DE.getController("Common.Controllers.ExternalDiagramEditor").getView("Common.Views.ExternalDiagramEditor");
                    if (diagramEditor && chart) {
                        diagramEditor.setEditMode(true);
                        diagramEditor.show();
                        diagramEditor.setChartData(new Asc.asc_CChartBinary(chart));
                    }
                }
            };
            var onCoAuthoringDisconnect = function () {
                me.mode.isEdit = false;
            };
            var onTextLanguage = function (langid) {
                me._currLang.id = langid;
            };
            this.changeLanguageMenu = function (menu) {
                var i;
                if (me._currLang.id === null || me._currLang.id === undefined) {
                    for (i = 0; i < menu.items.length; i++) {
                        menu.items[i].setChecked(false);
                    }
                    menu.currentCheckedItem = undefined;
                } else {
                    for (i = 0; i < menu.items.length; i++) {
                        if (menu.items[i].options.langid === me._currLang.id) {
                            menu.currentCheckedItem = menu.items[i];
                            if (!menu.items[i].checked) {
                                menu.items[i].setChecked(true);
                            }
                            break;
                        } else {
                            if (menu.items[i].checked) {
                                menu.items[i].setChecked(false);
                            }
                        }
                    }
                }
            };
            var onSpellCheckVariantsFound = function () {
                var selectedElements = me.api.getSelectedElements(true);
                var props;
                if (selectedElements && _.isArray(selectedElements)) {
                    for (var i = 0; i < selectedElements.length; i++) {
                        if (selectedElements[i].get_ObjectType() == c_oAscTypeSelectElement.SpellCheck) {
                            props = selectedElements[i].get_ObjectValue();
                            me._currentSpellObj = props;
                            break;
                        }
                    }
                }
                if (props && props.get_Checked() === false && props.get_Variants() !== null && props.get_Variants() !== undefined) {
                    me.addWordVariants();
                    if (me.textMenu.isVisible()) {
                        me.textMenu.alignPosition();
                    }
                }
            };
            this.addWordVariants = function (isParagraph) {
                if (_.isUndefined(isParagraph)) {
                    isParagraph = me.textMenu.isVisible();
                }
                me.clearWordVariants(isParagraph);
                var moreMenu = (isParagraph) ? me.menuSpellMorePara : me.menuSpellMoreTable;
                var spellMenu = (isParagraph) ? me.menuSpellPara : me.menuSpellTable;
                var arr = [],
                arrMore = [];
                var variants = me._currentSpellObj.get_Variants();
                if (variants.length > 0) {
                    moreMenu.setVisible(variants.length > 3);
                    _.each(variants, function (variant, index) {
                        var mnu = new Common.UI.MenuItem({
                            caption: variant,
                            spellword: true
                        }).on("click", function (item, e) {
                            if (me.api) {
                                me.api.asc_replaceMisspelledWord(item.caption, me._currentSpellObj);
                                me.fireEvent("editcomplete", me);
                            }
                        });
                        (index < 3) ? arr.push(mnu) : arrMore.push(mnu);
                    });
                    if (arr.length > 0) {
                        if (isParagraph) {
                            _.each(arr, function (variant) {
                                me.textMenu.insertItem(0, variant);
                            });
                        } else {
                            _.each(arr, function (variant) {
                                me.menuSpellCheckTable.menu.insertItem(0, variant);
                            });
                        }
                    }
                    if (arrMore.length > 0) {
                        _.each(arrMore, function (variant) {
                            moreMenu.menu.insertItem(0, variant);
                        });
                    }
                    spellMenu.setVisible(false);
                } else {
                    moreMenu.setVisible(false);
                    spellMenu.setVisible(true);
                    spellMenu.setCaption(me.noSpellVariantsText);
                }
            };
            this.clearWordVariants = function (isParagraph) {
                var spellMenu = (isParagraph) ? me.textMenu : me.menuSpellCheckTable.menu;
                for (var i = 0; i < spellMenu.items.length; i++) {
                    if (spellMenu.items[i].options.spellword) {
                        if (spellMenu.checkeditem == spellMenu.items[i]) {
                            spellMenu.checkeditem = undefined;
                            spellMenu.activeItem = undefined;
                        }
                        spellMenu.removeItem(spellMenu.items[i]);
                        i--;
                    }
                } (isParagraph) ? me.menuSpellMorePara.menu.removeAll() : me.menuSpellMoreTable.menu.removeAll();
                me.menuSpellMorePara.menu.checkeditem = undefined;
                me.menuSpellMorePara.menu.activeItem = undefined;
                me.menuSpellMoreTable.menu.checkeditem = undefined;
                me.menuSpellMoreTable.menu.activeItem = undefined;
            };
            this.changePosition = function () {
                me._XY = [me.cmpEl.offset().left - $(window).scrollLeft(), me.cmpEl.offset().top - $(window).scrollTop()];
                me._Height = me.cmpEl.height();
                me._BodyWidth = $("body").width();
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
                if (me.api.can_AddQuotedComment() !== false) {
                    me.addComment();
                }
            };
            Common.util.Shortcuts.delegateShortcuts({
                shortcuts: keymap
            });
            this.setApi = function (o) {
                this.api = o;
                if (this.api) {
                    this.api.asc_registerCallback("asc_onContextMenu", _.bind(onContextMenu, this));
                    this.api.asc_registerCallback("asc_onMouseMoveStart", _.bind(onMouseMoveStart, this));
                    this.api.asc_registerCallback("asc_onMouseMoveEnd", _.bind(onMouseMoveEnd, this));
                    this.api.asc_registerCallback("asc_onHyperlinkClick", _.bind(onHyperlinkClick, this));
                    this.api.asc_registerCallback("asc_onMouseMove", _.bind(onMouseMove, this));
                    if (this.mode.isEdit === true) {
                        this.api.asc_registerCallback("asc_onImgWrapStyleChanged", _.bind(this.onImgWrapStyleChanged, this));
                        this.api.asc_registerCallback("asc_onDialogAddHyperlink", onDialogAddHyperlink);
                        this.api.asc_registerCallback("asc_doubleClickOnChart", onDoubleClickOnChart);
                        this.api.asc_registerCallback("asc_onSpellCheckVariantsFound", _.bind(onSpellCheckVariantsFound, this));
                    }
                    this.api.asc_registerCallback("asc_onСoAuthoringDisconnect", _.bind(onCoAuthoringDisconnect, this));
                    Common.NotificationCenter.on("api:disconnect", _.bind(onCoAuthoringDisconnect, this));
                    this.api.asc_registerCallback("asc_onTextLanguage", _.bind(onTextLanguage, this));
                }
                return this;
            };
            this.mode = {};
            this.setMode = function (m) {
                if (this.api && m.isEdit) {
                    this.api.asc_registerCallback("asc_onImgWrapStyleChanged", _.bind(this.onImgWrapStyleChanged, this));
                    this.api.asc_registerCallback("asc_onDialogAddHyperlink", onDialogAddHyperlink);
                    this.api.asc_registerCallback("asc_doubleClickOnChart", onDoubleClickOnChart);
                    this.api.asc_registerCallback("asc_onSpellCheckVariantsFound", _.bind(onSpellCheckVariantsFound, this));
                }
                this.mode = m; ! (this.mode.canCoAuthoring && this.mode.isEdit && this.mode.canComments) ? Common.util.Shortcuts.suspendEvents(hkComments) : Common.util.Shortcuts.resumeEvents(hkComments);
                this.editorConfig = {
                    user: m.user
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
        onImgWrapStyleChanged: function (type) {
            switch (type) {
            case c_oAscWrapStyle2.Inline:
                this.menuImageWrap.menu.items[0].setChecked(true);
                break;
            case c_oAscWrapStyle2.Square:
                this.menuImageWrap.menu.items[1].setChecked(true);
                break;
            case c_oAscWrapStyle2.Tight:
                this.menuImageWrap.menu.items[2].setChecked(true);
                break;
            case c_oAscWrapStyle2.Through:
                this.menuImageWrap.menu.items[3].setChecked(true);
                break;
            case c_oAscWrapStyle2.TopAndBottom:
                this.menuImageWrap.menu.items[4].setChecked(true);
                break;
            case c_oAscWrapStyle2.Behind:
                this.menuImageWrap.menu.items[6].setChecked(true);
                break;
            case c_oAscWrapStyle2.InFront:
                this.menuImageWrap.menu.items[5].setChecked(true);
                break;
            }
        },
        _applyTableWrap: function (wrap, align) {
            var selectedElements = this.api.getSelectedElements();
            if (selectedElements && _.isArray(selectedElements)) {
                for (var i = selectedElements.length - 1; i >= 0; i--) {
                    var elType, elValue;
                    elType = selectedElements[i].get_ObjectType();
                    elValue = selectedElements[i].get_ObjectValue();
                    if (c_oAscTypeSelectElement.Table == elType) {
                        var properties = new CTableProp();
                        properties.put_TableWrap(wrap);
                        if (wrap == c_tableWrap.TABLE_WRAP_NONE) {
                            properties.put_TableAlignment(align);
                            properties.put_TableIndent(0);
                        }
                        this.api.tblApply(properties);
                        break;
                    }
                }
            }
        },
        advancedParagraphClick: function (item, e, eOpt) {
            var win, me = this;
            if (me.api) {
                var selectedElements = me.api.getSelectedElements();
                if (selectedElements && _.isArray(selectedElements)) {
                    for (var i = selectedElements.length - 1; i >= 0; i--) {
                        var elType, elValue;
                        elType = selectedElements[i].get_ObjectType();
                        elValue = selectedElements[i].get_ObjectValue();
                        if (c_oAscTypeSelectElement.Paragraph == elType) {
                            win = new DE.Views.ParagraphSettingsAdvanced({
                                tableStylerRows: 2,
                                tableStylerColumns: 1,
                                paragraphProps: elValue,
                                borderProps: me.borderAdvancedProps,
                                isChart: (item.isChart === true),
                                api: me.api,
                                handler: function (result, value) {
                                    if (result == "ok") {
                                        if (me.api) {
                                            me.borderAdvancedProps = value.borderProps;
                                            me.api.paraApply(value.paragraphProps);
                                        }
                                    }
                                    me.fireEvent("editcomplete", me);
                                }
                            });
                            break;
                        }
                    }
                }
            }
            if (win) {
                win.show();
            }
        },
        advancedFrameClick: function (item, e, eOpt) {
            var win, me = this;
            if (me.api) {
                var selectedElements = me.api.getSelectedElements();
                if (selectedElements && _.isArray(selectedElements)) {
                    for (var i = selectedElements.length - 1; i >= 0; i--) {
                        var elType, elValue;
                        elType = selectedElements[i].get_ObjectType();
                        elValue = selectedElements[i].get_ObjectValue();
                        if (c_oAscTypeSelectElement.Paragraph == elType) {
                            win = new DE.Views.DropcapSettingsAdvanced({
                                tableStylerRows: 2,
                                tableStylerColumns: 1,
                                paragraphProps: elValue,
                                borderProps: me.borderAdvancedProps,
                                api: me.api,
                                isFrame: true,
                                handler: function (result, value) {
                                    if (result == "ok") {
                                        me.borderAdvancedProps = value.borderProps;
                                        if (value.paragraphProps && value.paragraphProps.get_Wrap() === c_oAscFrameWrap.None) {
                                            me.api.removeDropcap(false);
                                        } else {
                                            me.api.put_FramePr(value.paragraphProps);
                                        }
                                    }
                                    me.fireEvent("editcomplete", me);
                                }
                            });
                            break;
                        }
                    }
                }
            }
            if (win) {
                win.show();
            }
        },
        editHyperlink: function (item, e, eOpt) {
            var win, me = this;
            if (me.api) {
                win = new DE.Views.HyperlinkSettingsDialog({
                    handler: function (dlg, result) {
                        if (result == "ok") {
                            me.api.change_Hyperlink(win.getSettings());
                        }
                        me.fireEvent("editcomplete", me);
                    }
                });
                win.show();
                win.setSettings(item.hyperProps.value);
            }
        },
        addComment: function (item, e, eOpt) {
            if (this.api && this.mode.canCoAuthoring && this.mode.isEdit && this.mode.canComments) {
                this.suppressEditComplete = true;
                this.api.asc_enableKeyEvents(false);
                var controller = DE.getController("Common.Controllers.Comments");
                if (controller) {
                    controller.addDummyComment();
                }
            }
        },
        addHyperlink: function (item, e, eOpt) {
            var win, me = this;
            if (me.api) {
                win = new DE.Views.HyperlinkSettingsDialog({
                    handler: function (dlg, result) {
                        if (result == "ok") {
                            me.api.add_Hyperlink(dlg.getSettings());
                        }
                        me.fireEvent("editcomplete", me);
                    }
                });
                win.show();
                win.setSettings(item.hyperProps.value);
                Common.component.Analytics.trackEvent("DocumentHolder", "Add Hyperlink");
            }
        },
        editChartClick: function () {
            var diagramEditor = DE.getController("Common.Controllers.ExternalDiagramEditor").getView("Common.Views.ExternalDiagramEditor");
            if (diagramEditor) {
                diagramEditor.setEditMode(true);
                diagramEditor.show();
                var chart = this.api.asc_getChartObject();
                if (chart) {
                    diagramEditor.setChartData(new Asc.asc_CChartBinary(chart));
                }
            }
        },
        updateThemeColors: function () {
            this.effectcolors = Common.Utils.ThemeColor.getEffectColors();
            this.standartcolors = Common.Utils.ThemeColor.getStandartColors();
        },
        onCutCopyPaste: function (item, e) {
            var me = this;
            if (me.api) {
                if (typeof window["AscDesktopEditor"] === "object") {
                    (item.value == "cut") ? me.api.Cut() : ((item.value == "copy") ? me.api.Copy() : me.api.Paste());
                } else {
                    var value = window.localStorage.getItem("de-hide-copywarning");
                    if (! (value && parseInt(value) == 1) && me.show_copywarning) {
                        (new Common.Views.CopyWarningDialog({
                            handler: function (dontshow) {
                                (item.value == "cut") ? me.api.Cut() : ((item.value == "copy") ? me.api.Copy() : me.api.Paste());
                                if (dontshow) {
                                    window.localStorage.setItem("de-hide-copywarning", 1);
                                }
                                me.fireEvent("editcomplete", me);
                            }
                        })).show();
                    } else {
                        (item.value == "cut") ? me.api.Cut() : ((item.value == "copy") ? me.api.Copy() : me.api.Paste());
                        me.fireEvent("editcomplete", me);
                    }
                }
            } else {
                me.fireEvent("editcomplete", me);
            }
        },
        createDelayedElements: function () {
            var me = this;
            var menuImageAlign = new Common.UI.MenuItem({
                caption: me.textAlign,
                menu: (function () {
                    function onItemClick(item, e) {
                        if (me.api) {
                            var properties = new CImgProperty();
                            if (!_.isUndefined(item.options.halign)) {
                                properties.put_PositionH(new CImagePositionH());
                                properties.get_PositionH().put_UseAlign(true);
                                properties.get_PositionH().put_Align(item.options.halign);
                                properties.get_PositionH().put_RelativeFrom(c_oAscRelativeFromH.Margin);
                            } else {
                                properties.put_PositionV(new CImagePositionV());
                                properties.get_PositionV().put_UseAlign(true);
                                properties.get_PositionV().put_Align(item.options.valign);
                                properties.get_PositionV().put_RelativeFrom(c_oAscRelativeFromV.Margin);
                            }
                            me.api.ImgApply(properties);
                        }
                        me.fireEvent("editcomplete", me);
                    }
                    return new Common.UI.Menu({
                        menuAlign: "tl-tr",
                        items: [new Common.UI.MenuItem({
                            caption: me.textShapeAlignLeft,
                            iconCls: "mnu-img-align-left",
                            halign: c_oAscAlignH.Left
                        }).on("click", _.bind(onItemClick, me)), new Common.UI.MenuItem({
                            caption: me.textShapeAlignCenter,
                            iconCls: "mnu-img-align-center",
                            halign: c_oAscAlignH.Center
                        }).on("click", _.bind(onItemClick, me)), new Common.UI.MenuItem({
                            caption: me.textShapeAlignRight,
                            iconCls: "mnu-img-align-right",
                            halign: c_oAscAlignH.Right
                        }).on("click", _.bind(onItemClick, me)), new Common.UI.MenuItem({
                            caption: me.textShapeAlignTop,
                            iconCls: "mnu-img-align-top",
                            valign: c_oAscAlignV.Top
                        }).on("click", _.bind(onItemClick, me)), new Common.UI.MenuItem({
                            caption: me.textShapeAlignMiddle,
                            iconCls: "mnu-img-align-middle",
                            valign: c_oAscAlignV.Center
                        }).on("click", _.bind(onItemClick, me)), new Common.UI.MenuItem({
                            caption: me.textShapeAlignBottom,
                            iconCls: "mnu-img-align-bottom",
                            valign: c_oAscAlignV.Bottom
                        }).on("click", _.bind(onItemClick, me))]
                    });
                })()
            });
            var mnuGroup = new Common.UI.MenuItem({
                caption: this.txtGroup,
                iconCls: "mnu-arrange-group"
            }).on("click", _.bind(function (item, e) {
                if (me.api) {
                    var properties = new CImgProperty();
                    properties.put_Group(1);
                    me.api.ImgApply(properties);
                }
                me.fireEvent("editcomplete", this);
            },
            me));
            var mnuUnGroup = new Common.UI.MenuItem({
                iconCls: "mnu-arrange-ungroup",
                caption: this.txtUngroup
            }).on("click", _.bind(function (item, e) {
                if (me.api) {
                    var properties = new CImgProperty();
                    properties.put_Group(-1);
                    me.api.ImgApply(properties);
                }
                me.fireEvent("editcomplete", this);
            },
            me));
            var menuImageArrange = new Common.UI.MenuItem({
                caption: me.textArrange,
                menu: (function () {
                    function onItemClick(item, e) {
                        if (me.api) {
                            var properties = new CImgProperty();
                            properties.put_ChangeLevel(item.options.valign);
                            me.api.ImgApply(properties);
                        }
                        me.fireEvent("editcomplete", me);
                    }
                    return new Common.UI.Menu({
                        menuAlign: "tl-tr",
                        items: [new Common.UI.MenuItem({
                            caption: me.textArrangeFront,
                            iconCls: "mnu-arrange-front",
                            valign: c_oAscChangeLevel.BringToFront
                        }).on("click", _.bind(onItemClick, me)), new Common.UI.MenuItem({
                            caption: me.textArrangeBack,
                            iconCls: "mnu-arrange-back",
                            valign: c_oAscChangeLevel.SendToBack
                        }).on("click", _.bind(onItemClick, me)), new Common.UI.MenuItem({
                            caption: me.textArrangeForward,
                            iconCls: "mnu-arrange-forward",
                            valign: c_oAscChangeLevel.BringForward
                        }).on("click", _.bind(onItemClick, me)), new Common.UI.MenuItem({
                            caption: me.textArrangeBackward,
                            iconCls: "mnu-arrange-backward",
                            valign: c_oAscChangeLevel.BringBackward
                        }).on("click", _.bind(onItemClick, me)), {
                            caption: "--"
                        },
                        mnuGroup, mnuUnGroup]
                    });
                })()
            });
            var menuWrapPolygon = new Common.UI.MenuItem({
                caption: me.textEditWrapBoundary,
                cls: "no-icon-wrap-item"
            }).on("click", _.bind(function (item, e) {
                if (me.api) {
                    me.api.StartChangeWrapPolygon();
                }
                me.fireEvent("editcomplete", me);
            },
            me));
            this.menuImageWrap = new Common.UI.MenuItem({
                caption: me.textWrap,
                menu: (function () {
                    function onItemClick(item, e) {
                        if (me.api) {
                            var properties = new CImgProperty();
                            properties.put_WrappingStyle(item.options.wrapType);
                            if (me.menuImageWrap._originalProps.get_WrappingStyle() === c_oAscWrapStyle2.Inline && item.wrapType !== c_oAscWrapStyle2.Inline) {
                                properties.put_PositionH(new CImagePositionH());
                                properties.get_PositionH().put_UseAlign(false);
                                properties.get_PositionH().put_RelativeFrom(c_oAscRelativeFromH.Column);
                                var val = me.menuImageWrap._originalProps.get_Value_X(c_oAscRelativeFromH.Column);
                                properties.get_PositionH().put_Value(val);
                                properties.put_PositionV(new CImagePositionV());
                                properties.get_PositionV().put_UseAlign(false);
                                properties.get_PositionV().put_RelativeFrom(c_oAscRelativeFromV.Paragraph);
                                val = me.menuImageWrap._originalProps.get_Value_Y(c_oAscRelativeFromV.Paragraph);
                                properties.get_PositionV().put_Value(val);
                            }
                            me.api.ImgApply(properties);
                        }
                        me.fireEvent("editcomplete", me);
                    }
                    return new Common.UI.Menu({
                        menuAlign: "tl-tr",
                        items: [new Common.UI.MenuItem({
                            caption: me.txtInline,
                            iconCls: "mnu-wrap-inline",
                            toggleGroup: "popuppicturewrapping",
                            wrapType: c_oAscWrapStyle2.Inline,
                            checkable: true
                        }).on("click", _.bind(onItemClick, me)), new Common.UI.MenuItem({
                            caption: me.txtSquare,
                            iconCls: "mnu-wrap-square",
                            toggleGroup: "popuppicturewrapping",
                            wrapType: c_oAscWrapStyle2.Square,
                            checkable: true
                        }).on("click", _.bind(onItemClick, me)), new Common.UI.MenuItem({
                            caption: me.txtTight,
                            iconCls: "mnu-wrap-tight",
                            toggleGroup: "popuppicturewrapping",
                            wrapType: c_oAscWrapStyle2.Tight,
                            checkable: true
                        }).on("click", _.bind(onItemClick, me)), new Common.UI.MenuItem({
                            caption: me.txtThrough,
                            iconCls: "mnu-wrap-through",
                            toggleGroup: "popuppicturewrapping",
                            wrapType: c_oAscWrapStyle2.Through,
                            checkable: true
                        }).on("click", _.bind(onItemClick, me)), new Common.UI.MenuItem({
                            caption: me.txtTopAndBottom,
                            iconCls: "mnu-wrap-topAndBottom",
                            toggleGroup: "popuppicturewrapping",
                            wrapType: c_oAscWrapStyle2.TopAndBottom,
                            checkable: true
                        }).on("click", _.bind(onItemClick, me)), new Common.UI.MenuItem({
                            caption: me.txtInFront,
                            iconCls: "mnu-wrap-inFront",
                            toggleGroup: "popuppicturewrapping",
                            wrapType: c_oAscWrapStyle2.InFront,
                            checkable: true
                        }).on("click", _.bind(onItemClick, me)), new Common.UI.MenuItem({
                            caption: me.txtBehind,
                            iconCls: "mnu-wrap-behind",
                            toggleGroup: "popuppicturewrapping",
                            wrapType: c_oAscWrapStyle2.Behind,
                            checkable: true
                        }).on("click", _.bind(onItemClick, me)), {
                            caption: "--"
                        },
                        menuWrapPolygon]
                    });
                })()
            });
            var menuImageAdvanced = new Common.UI.MenuItem({
                caption: me.advancedText
            }).on("click", _.bind(function (item, e) {
                var win;
                var elType, elValue;
                if (me.api) {
                    var selectedElements = me.api.getSelectedElements();
                    if (selectedElements && _.isArray(selectedElements)) {
                        for (var i = selectedElements.length - 1; i >= 0; i--) {
                            elType = selectedElements[i].get_ObjectType();
                            elValue = selectedElements[i].get_ObjectValue();
                            if (c_oAscTypeSelectElement.Image == elType) {
                                var imgsizeOriginal;
                                if (!elValue.get_ChartProperties() && !elValue.get_ShapeProperties() && !me.menuOriginalSize.isDisabled() && me.menuOriginalSize.isVisible()) {
                                    imgsizeOriginal = me.api.get_OriginalSizeImage();
                                    if (imgsizeOriginal) {
                                        imgsizeOriginal = {
                                            width: imgsizeOriginal.get_ImageWidth(),
                                            height: imgsizeOriginal.get_ImageHeight()
                                        };
                                    }
                                }
                                var imgsizeMax = me.api.GetSectionInfo();
                                imgsizeMax = {
                                    width: imgsizeMax.get_PageWidth() - (imgsizeMax.get_MarginLeft() + imgsizeMax.get_MarginRight()),
                                    height: imgsizeMax.get_PageHeight() - (imgsizeMax.get_MarginTop() + imgsizeMax.get_MarginBottom())
                                };
                                var win = new DE.Views.ImageSettingsAdvanced({
                                    imageProps: elValue,
                                    sizeOriginal: imgsizeOriginal,
                                    sizeMax: imgsizeMax,
                                    handler: function (result, value) {
                                        if (result == "ok") {
                                            if (me.api) {
                                                me.api.ImgApply(value.imageProps);
                                            }
                                        }
                                        me.fireEvent("editcomplete", me);
                                    }
                                });
                                win.show();
                                win.btnOriginalSize.setVisible(me.menuOriginalSize.isVisible());
                                break;
                            }
                        }
                    }
                }
            }));
            var menuChartEdit = new Common.UI.MenuItem({
                caption: me.editChartText
            }).on("click", _.bind(me.editChartClick, me));
            this.menuOriginalSize = new Common.UI.MenuItem({
                caption: me.originalSizeText
            }).on("click", _.bind(function (item, e) {
                if (me.api) {
                    var originalImageSize = me.api.get_OriginalSizeImage();
                    var properties = new CImgProperty();
                    properties.put_Width(originalImageSize.get_ImageWidth());
                    properties.put_Height(originalImageSize.get_ImageHeight());
                    me.api.ImgApply(properties);
                    me.fireEvent("editcomplete", this);
                }
            },
            me));
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
            this.pictureMenu = new Common.UI.Menu({
                initMenu: function (value) {
                    if (_.isUndefined(value.imgProps)) {
                        return;
                    }
                    var notflow = !value.imgProps.value.get_CanBeFlow(),
                    wrapping = value.imgProps.value.get_WrappingStyle();
                    me.menuImageWrap._originalProps = value.imgProps.value;
                    if (notflow) {
                        for (var i = 0; i < 6; i++) {
                            me.menuImageWrap.menu.items[i].setChecked(false);
                        }
                    } else {
                        switch (wrapping) {
                        case c_oAscWrapStyle2.Inline:
                            me.menuImageWrap.menu.items[0].setChecked(true);
                            break;
                        case c_oAscWrapStyle2.Square:
                            me.menuImageWrap.menu.items[1].setChecked(true);
                            break;
                        case c_oAscWrapStyle2.Tight:
                            me.menuImageWrap.menu.items[2].setChecked(true);
                            break;
                        case c_oAscWrapStyle2.Through:
                            me.menuImageWrap.menu.items[3].setChecked(true);
                            break;
                        case c_oAscWrapStyle2.TopAndBottom:
                            me.menuImageWrap.menu.items[4].setChecked(true);
                            break;
                        case c_oAscWrapStyle2.Behind:
                            me.menuImageWrap.menu.items[6].setChecked(true);
                            break;
                        case c_oAscWrapStyle2.InFront:
                            me.menuImageWrap.menu.items[5].setChecked(true);
                            break;
                        default:
                            for (var i = 0; i < 6; i++) {
                                me.menuImageWrap.menu.items[i].setChecked(false);
                            }
                            break;
                        }
                    }
                    _.each(me.menuImageWrap.menu.items, function (item) {
                        item.setDisabled(notflow);
                    });
                    var onlyCommonProps = (value.imgProps.isImg && value.imgProps.isChart || value.imgProps.isImg && value.imgProps.isShape || value.imgProps.isShape && value.imgProps.isChart);
                    if (onlyCommonProps) {
                        menuImageAdvanced.setCaption(me.advancedText);
                    } else {
                        menuImageAdvanced.setCaption((value.imgProps.isImg) ? me.imageText : ((value.imgProps.isChart) ? me.chartText : me.shapeText));
                    }
                    menuChartEdit.setVisible(!_.isNull(value.imgProps.value.get_ChartProperties()) && !onlyCommonProps);
                    me.menuOriginalSize.setVisible(_.isNull(value.imgProps.value.get_ChartProperties()) && _.isNull(value.imgProps.value.get_ShapeProperties()) && !onlyCommonProps);
                    me.pictureMenu.items[7].setVisible(menuChartEdit.isVisible() || me.menuOriginalSize.isVisible());
                    var islocked = value.imgProps.locked || (value.headerProps !== undefined && value.headerProps.locked);
                    if (menuChartEdit.isVisible()) {
                        menuChartEdit.setDisabled(islocked || value.imgProps.value.get_SeveralCharts());
                    }
                    me.menuOriginalSize.setDisabled(islocked || value.imgProps.value.get_ImageUrl() === null || value.imgProps.value.get_ImageUrl() === undefined);
                    menuImageAdvanced.setDisabled(islocked);
                    menuImageAlign.setDisabled(islocked || (wrapping == c_oAscWrapStyle2.Inline));
                    menuImageArrange.setDisabled(wrapping == c_oAscWrapStyle2.Inline);
                    if (me.api) {
                        mnuUnGroup.setDisabled(islocked || !me.api.CanUnGroup());
                        mnuGroup.setDisabled(islocked || !me.api.CanGroup());
                        menuWrapPolygon.setDisabled(islocked || !me.api.CanChangeWrapPolygon());
                    }
                    me.menuImageWrap.setDisabled(islocked || value.imgProps.value.get_FromGroup() || (notflow && menuWrapPolygon.isDisabled()));
                    var cancopy = me.api && me.api.can_CopyCut();
                    menuImgCopy.setDisabled(!cancopy);
                    menuImgCut.setDisabled(islocked || !cancopy);
                    menuImgPaste.setDisabled(islocked);
                },
                items: [menuImgCut, menuImgCopy, menuImgPaste, {
                    caption: "--"
                },
                menuImageArrange, menuImageAlign, me.menuImageWrap, {
                    caption: "--"
                },
                me.menuOriginalSize, menuChartEdit, {
                    caption: "--"
                },
                menuImageAdvanced]
            }).on("hide:after", function (menu) {
                me.fireEvent("editcomplete", me);
                me.currentMenu = null;
            });
            var _btnAlignLeft = new Common.UI.Button({
                cls: "btn-options huge",
                iconCls: "icon-right-panel btn-table-align-left",
                posId: c_tableAlign.TABLE_ALIGN_LEFT,
                style: "margin: 5px 5px 5px 0;",
                hint: this.leftText,
                enableToggle: true,
                allowDepress: false,
                toggleGroup: "popuptablealign"
            }).on("click", function (btn) {
                if (btn.pressed) {
                    me._applyTableWrap(c_tableWrap.TABLE_WRAP_NONE, c_tableAlign.TABLE_ALIGN_LEFT);
                }
                Common.UI.Menu.Manager.hideAll();
            });
            var _btnAlignCenter = new Common.UI.Button({
                cls: "btn-options huge",
                iconCls: "icon-right-panel btn-table-align-center",
                posId: c_tableAlign.TABLE_ALIGN_CENTER,
                style: "margin: 5px;",
                hint: this.centerText,
                enableToggle: true,
                allowDepress: false,
                toggleGroup: "popuptablealign"
            }).on("click", function (btn) {
                if (btn.pressed) {
                    me._applyTableWrap(c_tableWrap.TABLE_WRAP_NONE, c_tableAlign.TABLE_ALIGN_CENTER);
                }
                Common.UI.Menu.Manager.hideAll();
            });
            var _btnAlignRight = new Common.UI.Button({
                cls: "btn-options huge",
                iconCls: "icon-right-panel btn-table-align-right",
                posId: c_tableAlign.TABLE_ALIGN_RIGHT,
                style: "margin: 5px",
                hint: this.rightText,
                enableToggle: true,
                allowDepress: false,
                toggleGroup: "popuptablealign"
            }).on("click", function (btn) {
                if (btn.pressed) {
                    me._applyTableWrap(c_tableWrap.TABLE_WRAP_NONE, c_tableAlign.TABLE_ALIGN_RIGHT);
                }
                Common.UI.Menu.Manager.hideAll();
            });
            var menuTableWrapInline = new Common.UI.MenuItem({
                caption: me.inlineText,
                toggleGroup: "popuptablewrapping",
                checkable: true,
                menu: new Common.UI.Menu({
                    menuAlign: "tl-tr",
                    items: [{
                        caption: me.alignmentText,
                        template: _.template(['<div class="settings-panel" style="display: block !important; margin: 0 10px;">', '<label class="header"><%= caption %></label>', '<div class="item-tablewrapping">', '<div id="popup-item-tablewrapping-left" style="display: inline-block;"></div>', '<div id="popup-item-tablewrapping-center" style="display: inline-block;"></div>', '<div id="popup-item-tablewrapping-right" style="display: inline-block;"></div>', "</div>", "</div>"].join("")),
                        stopPropagation: true
                    }]
                })
            }).on("render:after", function (item) {
                var containerEl = menuTableWrapInline.cmpEl.find(".item-tablewrapping");
                _btnAlignLeft.render(containerEl.find("#popup-item-tablewrapping-left")).cmpEl.data("bs.tooltip").tip().css("z-index", 10010);
                _btnAlignCenter.render(containerEl.find("#popup-item-tablewrapping-center")).cmpEl.data("bs.tooltip").tip().css("z-index", 10010);
                _btnAlignRight.render(containerEl.find("#popup-item-tablewrapping-right")).cmpEl.data("bs.tooltip").tip().css("z-index", 10010);
            }).on("click", function (item, e) {
                if (_btnAlignLeft.pressed) {
                    me._applyTableWrap(c_tableWrap.TABLE_WRAP_NONE, c_tableAlign.TABLE_ALIGN_LEFT);
                } else {
                    if (_btnAlignCenter.pressed) {
                        me._applyTableWrap(c_tableWrap.TABLE_WRAP_NONE, c_tableAlign.TABLE_ALIGN_CENTER);
                    } else {
                        if (_btnAlignRight.pressed) {
                            me._applyTableWrap(c_tableWrap.TABLE_WRAP_NONE, c_tableAlign.TABLE_ALIGN_RIGHT);
                        }
                    }
                }
            });
            var menuTableWrapFlow = new Common.UI.MenuItem({
                caption: me.flowoverText,
                toggleGroup: "popuptablewrapping",
                checkable: true,
                checked: true
            }).on("click", function (item) {
                me._applyTableWrap(c_tableWrap.TABLE_WRAP_PARALLEL);
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
                                Common.component.Analytics.trackEvent("DocumentHolder", "Table");
                            }
                        }
                    })).show();
                }
            });
            var tableCellsVAlign = function (item, e) {
                if (me.api) {
                    var properties = new CTableProp();
                    properties.put_CellsVAlign(item.options.valign);
                    me.api.tblApply(properties);
                }
            };
            var menuTableCellAlign = new Common.UI.MenuItem({
                caption: me.cellAlignText,
                menu: new Common.UI.Menu({
                    menuAlign: "tl-tr",
                    items: [me.menuTableCellTop = new Common.UI.MenuItem({
                        caption: me.topCellText,
                        toggleGroup: "popuptablecellalign",
                        checkable: true,
                        checked: false,
                        valign: c_oAscVertAlignJc.Top
                    }).on("click", _.bind(tableCellsVAlign, me)), me.menuTableCellCenter = new Common.UI.MenuItem({
                        caption: me.centerCellText,
                        toggleGroup: "popuptablecellalign",
                        checkable: true,
                        checked: false,
                        valign: c_oAscVertAlignJc.Center
                    }).on("click", _.bind(tableCellsVAlign, me)), me.menuTableCellBottom = new Common.UI.MenuItem({
                        caption: me.bottomCellText,
                        toggleGroup: "popuptablecellalign",
                        checkable: true,
                        checked: false,
                        valign: c_oAscVertAlignJc.Bottom
                    }).on("click", _.bind(tableCellsVAlign, me))]
                })
            });
            var menuTableAdvanced = new Common.UI.MenuItem({
                caption: me.advancedTableText
            }).on("click", function (item, e, eOpt) {
                var win;
                if (me.api) {
                    var selectedElements = me.api.getSelectedElements();
                    if (selectedElements && _.isArray(selectedElements)) {
                        for (var i = selectedElements.length - 1; i >= 0; i--) {
                            var elType, elValue;
                            elType = selectedElements[i].get_ObjectType();
                            elValue = selectedElements[i].get_ObjectValue();
                            if (c_oAscTypeSelectElement.Table == elType) {
                                win = new DE.Views.TableSettingsAdvanced({
                                    tableStylerRows: (elValue.get_CellBorders().get_InsideH() === null && elValue.get_CellSelect() == true) ? 1 : 2,
                                    tableStylerColumns: (elValue.get_CellBorders().get_InsideV() === null && elValue.get_CellSelect() == true) ? 1 : 2,
                                    tableProps: elValue,
                                    borderProps: me.borderAdvancedProps,
                                    handler: function (result, value) {
                                        if (result == "ok") {
                                            if (me.api) {
                                                me.borderAdvancedProps = value.borderProps;
                                                me.api.tblApply(value.tableProps);
                                            }
                                        }
                                        me.fireEvent("editcomplete", me);
                                    }
                                });
                                break;
                            }
                        }
                    }
                }
                if (win) {
                    win.show();
                }
            });
            var menuParagraphKeepLinesInTable = new Common.UI.MenuItem({
                caption: me.keepLinesText,
                checkable: true
            }).on("click", function (item, e) {
                me.api && me.api.put_KeepLines(item.checked);
            });
            var menuParagraphAdvancedInTable = new Common.UI.MenuItem({
                caption: me.advancedParagraphText
            }).on("click", _.bind(me.advancedParagraphClick, me));
            var menuParagraphTable = new Common.UI.MenuItem({
                caption: me.paragraphText,
                menu: new Common.UI.Menu({
                    menuAlign: "tl-tr",
                    items: [menuParagraphKeepLinesInTable, menuParagraphAdvancedInTable]
                })
            });
            var menuHyperlinkSeparator = new Common.UI.MenuItem({
                caption: "--"
            });
            var menuEditHyperlinkTable = new Common.UI.MenuItem({
                caption: me.editHyperlinkText
            }).on("click", _.bind(me.editHyperlink, me));
            var menuRemoveHyperlinkTable = new Common.UI.MenuItem({
                caption: me.removeHyperlinkText
            }).on("click", function (item, e) {
                me.api && me.api.remove_Hyperlink();
                me.fireEvent("editcomplete", me);
            });
            var menuHyperlinkTable = new Common.UI.MenuItem({
                caption: me.hyperlinkText,
                menu: new Common.UI.Menu({
                    menuAlign: "tl-tr",
                    items: [menuEditHyperlinkTable, menuRemoveHyperlinkTable]
                })
            });
            var menuAddCommentTable = new Common.UI.MenuItem({
                caption: me.addCommentText
            }).on("click", _.bind(me.addComment, me));
            var menuAddHyperlinkTable = new Common.UI.MenuItem({
                caption: me.hyperlinkText
            }).on("click", _.bind(me.addHyperlink, me));
            me.menuSpellTable = new Common.UI.MenuItem({
                caption: me.loadSpellText,
                disabled: true
            });
            me.menuSpellMoreTable = new Common.UI.MenuItem({
                caption: me.moreText,
                menu: new Common.UI.Menu({
                    menuAlign: "tl-tr",
                    items: []
                })
            });
            me.langTableMenu = new Common.UI.MenuItem({
                caption: me.langText,
                menu: new Common.UI.Menu({
                    menuAlign: "tl-tr",
                    maxHeight: 300,
                    items: []
                }).on("show:after", function (menu) {
                    var self = this;
                })
            });
            var menuIgnoreSpellTable = new Common.UI.MenuItem({
                caption: me.ignoreSpellText
            }).on("click", function (item) {
                if (me.api) {
                    me.api.asc_ignoreMisspelledWord(me._currentSpellObj, false);
                    me.fireEvent("editcomplete", me);
                }
            });
            var menuIgnoreAllSpellTable = new Common.UI.MenuItem({
                caption: me.ignoreAllSpellText
            }).on("click", function (menu) {
                if (me.api) {
                    me.api.asc_ignoreMisspelledWord(me._currentSpellObj, true);
                    me.fireEvent("editcomplete", me);
                }
            });
            var menuIgnoreSpellTableSeparator = new Common.UI.MenuItem({
                caption: "--"
            });
            var menuSpellcheckTableSeparator = new Common.UI.MenuItem({
                caption: "--"
            });
            me.menuSpellCheckTable = new Common.UI.MenuItem({
                caption: me.spellcheckText,
                menu: new Common.UI.Menu({
                    menuAlign: "tl-tr",
                    items: [me.menuSpellTable, me.menuSpellMoreTable, menuIgnoreSpellTableSeparator, menuIgnoreSpellTable, menuIgnoreAllSpellTable, {
                        caption: "--"
                    },
                    me.langTableMenu]
                })
            });
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
            this.tableMenu = new Common.UI.Menu({
                initMenu: function (value) {
                    if (_.isUndefined(value.tableProps)) {
                        return;
                    }
                    me.menuTableCellTop.setChecked(value.tableProps.value.get_CellsVAlign() == c_oAscVertAlignJc.Top);
                    me.menuTableCellCenter.setChecked(value.tableProps.value.get_CellsVAlign() == c_oAscVertAlignJc.Center);
                    me.menuTableCellBottom.setChecked(value.tableProps.value.get_CellsVAlign() == c_oAscVertAlignJc.Bottom);
                    var flow = (value.tableProps.value.get_TableWrap() == c_tableWrap.TABLE_WRAP_PARALLEL);
                    (flow) ? menuTableWrapFlow.setChecked(true) : menuTableWrapInline.setChecked(true);
                    var align = value.tableProps.value.get_TableAlignment();
                    if (!_btnAlignLeft.rendered || !_btnAlignCenter.rendered || !_btnAlignRight.rendered) {
                        _btnAlignLeft.pressed = (flow) ? false : (align == c_tableAlign.TABLE_ALIGN_LEFT);
                        _btnAlignCenter.pressed = (flow) ? false : (align == c_tableAlign.TABLE_ALIGN_CENTER);
                        _btnAlignRight.pressed = (flow) ? false : (align == c_tableAlign.TABLE_ALIGN_RIGHT);
                    } else {
                        _btnAlignLeft.toggle((flow) ? false : (align == c_tableAlign.TABLE_ALIGN_LEFT), true);
                        _btnAlignCenter.toggle((flow) ? false : (align == c_tableAlign.TABLE_ALIGN_CENTER), true);
                        _btnAlignRight.toggle((flow) ? false : (align == c_tableAlign.TABLE_ALIGN_RIGHT), true);
                    }
                    var disabled = value.tableProps.locked || (value.headerProps !== undefined && value.headerProps.locked);
                    me.tableMenu.items[7].setDisabled(disabled);
                    me.tableMenu.items[8].setDisabled(disabled);
                    if (me.api) {
                        mnuTableMerge.setDisabled(disabled || !me.api.CheckBeforeMergeCells());
                        mnuTableSplit.setDisabled(disabled || !me.api.CheckBeforeSplitCells());
                    }
                    menuTableCellAlign.setDisabled(disabled);
                    menuTableWrapInline.setDisabled(disabled);
                    menuTableWrapFlow.setDisabled(disabled || !value.tableProps.value.get_CanBeFlow());
                    menuTableAdvanced.setDisabled(disabled);
                    var cancopy = me.api && me.api.can_CopyCut();
                    menuTableCopy.setDisabled(!cancopy);
                    menuTableCut.setDisabled(disabled || !cancopy);
                    menuTablePaste.setDisabled(disabled);
                    var text = null;
                    if (me.api) {
                        text = me.api.can_AddHyperlink();
                    }
                    menuAddHyperlinkTable.setVisible(value.hyperProps === undefined && text !== false);
                    menuHyperlinkTable.setVisible(value.hyperProps !== undefined);
                    menuHyperlinkSeparator.setVisible(menuAddHyperlinkTable.isVisible() || menuHyperlinkTable.isVisible());
                    menuEditHyperlinkTable.hyperProps = value.hyperProps;
                    if (text !== false) {
                        menuAddHyperlinkTable.hyperProps = {};
                        menuAddHyperlinkTable.hyperProps.value = new CHyperlinkProperty();
                        menuAddHyperlinkTable.hyperProps.value.put_Text(text);
                    }
                    menuAddCommentTable.setVisible(me.api.can_AddQuotedComment() !== false && me.mode.canCoAuthoring && me.mode.canComments);
                    menuAddCommentTable.setDisabled(value.paraProps !== undefined && value.paraProps.locked === true);
                    menuParagraphTable.setVisible(value.paraProps !== undefined);
                    if (value.paraProps) {
                        menuParagraphKeepLinesInTable.setChecked(value.paraProps.value.get_KeepLines());
                    }
                    disabled = value.paraProps.locked || (value.headerProps !== undefined && value.headerProps.locked);
                    menuAddHyperlinkTable.setDisabled(disabled);
                    menuHyperlinkTable.setDisabled(disabled || value.hyperProps !== undefined && value.hyperProps.isSeveralLinks === true);
                    menuParagraphKeepLinesInTable.setDisabled(disabled);
                    menuParagraphAdvancedInTable.setDisabled(disabled);
                    me.menuSpellCheckTable.setVisible(value.spellProps !== undefined && value.spellProps.value.get_Checked() === false);
                    menuSpellcheckTableSeparator.setVisible(value.spellProps !== undefined && value.spellProps.value.get_Checked() === false);
                    if (value.spellProps !== undefined && value.spellProps.value.get_Checked() === false && value.spellProps.value.get_Variants() !== null && value.spellProps.value.get_Variants() !== undefined) {
                        me.addWordVariants(false);
                    } else {
                        me.menuSpellTable.setCaption(me.loadSpellText);
                        me.clearWordVariants(false);
                        me.menuSpellMoreTable.setVisible(false);
                    }
                    if (me.menuSpellCheckTable.isVisible() && me._currLang.id !== me._currLang.tableid) {
                        me.changeLanguageMenu(me.langTableMenu.menu);
                        me._currLang.tableid = me._currLang.id;
                    }
                },
                items: [me.menuSpellCheckTable, menuSpellcheckTableSeparator, menuTableCut, menuTableCopy, menuTablePaste, {
                    caption: "--"
                },
                {
                    caption: me.selectText,
                    menu: new Common.UI.Menu({
                        menuAlign: "tl-tr",
                        style: "width: 100px",
                        items: [new Common.UI.MenuItem({
                            caption: me.rowText
                        }).on("click", function (item) {
                            if (me.api) {
                                me.api.selectRow();
                            }
                        }), new Common.UI.MenuItem({
                            caption: me.columnText
                        }).on("click", function (item) {
                            if (me.api) {
                                me.api.selectColumn();
                            }
                        }), new Common.UI.MenuItem({
                            caption: me.cellText
                        }).on("click", function (item) {
                            if (me.api) {
                                me.api.selectCell();
                            }
                        }), new Common.UI.MenuItem({
                            caption: me.tableText
                        }).on("click", function (item) {
                            if (me.api) {
                                me.api.selectTable();
                            }
                        })]
                    })
                },
                {
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
                {
                    caption: me.deleteText,
                    menu: new Common.UI.Menu({
                        menuAlign: "tl-tr",
                        style: "width: 100px",
                        items: [new Common.UI.MenuItem({
                            caption: me.rowText
                        }).on("click", function (item) {
                            if (me.api) {
                                me.api.remRow();
                            }
                        }), new Common.UI.MenuItem({
                            caption: me.columnText
                        }).on("click", function (item) {
                            if (me.api) {
                                me.api.remColumn();
                            }
                        }), new Common.UI.MenuItem({
                            caption: me.tableText
                        }).on("click", function (item) {
                            if (me.api) {
                                me.api.remTable();
                            }
                        })]
                    })
                },
                {
                    caption: "--"
                },
                mnuTableMerge, mnuTableSplit, {
                    caption: "--"
                },
                menuTableCellAlign, {
                    caption: "--"
                },
                menuTableWrapInline, menuTableWrapFlow, {
                    caption: "--"
                },
                menuTableAdvanced, {
                    caption: "--"
                },
                menuAddCommentTable, menuAddHyperlinkTable, menuHyperlinkTable, menuHyperlinkSeparator, menuParagraphTable]
            }).on("hide:after", function (menu) {
                me.fireEvent("editcomplete", me);
                me.currentMenu = null;
            });
            var menuParagraphBreakBefore = new Common.UI.MenuItem({
                caption: me.breakBeforeText,
                checkable: true
            }).on("click", function (item, e) {
                me.api.put_PageBreak(item.checked);
            });
            var menuParagraphKeepLines = new Common.UI.MenuItem({
                caption: me.keepLinesText,
                checkable: true
            }).on("click", function (item, e) {
                me.api.put_KeepLines(item.checked);
            });
            var paragraphVAlign = function (item, e) {
                if (me.api) {
                    var properties = new CImgProperty();
                    properties.put_VerticalTextAlign(item.options.valign);
                    me.api.ImgApply(properties);
                }
            };
            var menuParagraphVAlign = new Common.UI.MenuItem({
                caption: me.vertAlignText,
                menu: new Common.UI.Menu({
                    menuAlign: "tl-tr",
                    items: [me.menuParagraphTop = new Common.UI.MenuItem({
                        caption: me.topCellText,
                        checkable: true,
                        checked: false,
                        toggleGroup: "popupparagraphvalign",
                        valign: c_oAscVerticalTextAlign.TEXT_ALIGN_TOP
                    }).on("click", _.bind(paragraphVAlign, me)), me.menuParagraphCenter = new Common.UI.MenuItem({
                        caption: me.centerCellText,
                        checkable: true,
                        checked: false,
                        toggleGroup: "popupparagraphvalign",
                        valign: c_oAscVerticalTextAlign.TEXT_ALIGN_CTR
                    }).on("click", _.bind(paragraphVAlign, me)), me.menuParagraphBottom = new Common.UI.MenuItem({
                        caption: me.bottomCellText,
                        checkable: true,
                        checked: false,
                        toggleGroup: "popupparagraphvalign",
                        valign: c_oAscVerticalTextAlign.TEXT_ALIGN_BOTTOM
                    }).on("click", _.bind(paragraphVAlign, me))]
                })
            });
            var menuParagraphAdvanced = new Common.UI.MenuItem({
                caption: me.advancedParagraphText
            }).on("click", _.bind(me.advancedParagraphClick, me));
            var menuFrameAdvanced = new Common.UI.MenuItem({
                caption: me.advancedFrameText
            }).on("click", _.bind(me.advancedFrameClick, me));
            var menuCommentSeparatorPara = new Common.UI.MenuItem({
                caption: "--"
            });
            var menuAddCommentPara = new Common.UI.MenuItem({
                caption: me.addCommentText
            }).on("click", _.bind(me.addComment, me));
            var menuHyperlinkParaSeparator = new Common.UI.MenuItem({
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
            }).on("click", function (item, e) {
                me.api.remove_Hyperlink();
                me.fireEvent("editcomplete", me);
            });
            var menuHyperlinkPara = new Common.UI.MenuItem({
                caption: me.hyperlinkText,
                menu: new Common.UI.Menu({
                    menuAlign: "tl-tr",
                    items: [menuEditHyperlinkPara, menuRemoveHyperlinkPara]
                })
            });
            me.menuSpellPara = new Common.UI.MenuItem({
                caption: me.loadSpellText,
                disabled: true
            });
            me.menuSpellMorePara = new Common.UI.MenuItem({
                caption: me.moreText,
                menu: new Common.UI.Menu({
                    menuAlign: "tl-tr",
                    style: "max-height: 300px;",
                    items: []
                })
            });
            me.langParaMenu = new Common.UI.MenuItem({
                caption: me.langText,
                menu: new Common.UI.Menu({
                    menuAlign: "tl-tr",
                    maxHeight: 300,
                    items: []
                }).on("show:after", function (menu) {})
            });
            var menuIgnoreSpellPara = new Common.UI.MenuItem({
                caption: me.ignoreSpellText
            }).on("click", function (item, e) {
                me.api.asc_ignoreMisspelledWord(me._currentSpellObj, false);
                me.fireEvent("editcomplete", me);
            });
            var menuIgnoreAllSpellPara = new Common.UI.MenuItem({
                caption: me.ignoreAllSpellText
            }).on("click", function (item, e) {
                me.api.asc_ignoreMisspelledWord(me._currentSpellObj, true);
                me.fireEvent("editcomplete", me);
            });
            var menuIgnoreSpellParaSeparator = new Common.UI.MenuItem({
                caption: "--"
            });
            var menuSpellcheckParaSeparator = new Common.UI.MenuItem({
                caption: "--"
            });
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
            this.textMenu = new Common.UI.Menu({
                initMenu: function (value) {
                    var isInShape = (value.imgProps && value.imgProps.value && !_.isNull(value.imgProps.value.get_ShapeProperties()));
                    var isInChart = (value.imgProps && value.imgProps.value && !_.isNull(value.imgProps.value.get_ChartProperties()));
                    menuParagraphVAlign.setVisible(isInShape && !isInChart);
                    if (isInShape || isInChart) {
                        var align = value.imgProps.value.get_VerticalTextAlign();
                        me.menuParagraphTop.setChecked(align == c_oAscVerticalTextAlign.TEXT_ALIGN_TOP);
                        me.menuParagraphCenter.setChecked(align == c_oAscVerticalTextAlign.TEXT_ALIGN_CTR);
                        me.menuParagraphBottom.setChecked(align == c_oAscVerticalTextAlign.TEXT_ALIGN_BOTTOM);
                    }
                    menuParagraphAdvanced.isChart = (value.imgProps && value.imgProps.isChart);
                    menuParagraphBreakBefore.setVisible(!isInShape && !isInChart);
                    menuParagraphKeepLines.setVisible(!isInShape && !isInChart);
                    if (value.paraProps) {
                        menuParagraphBreakBefore.setChecked(value.paraProps.value.get_PageBreakBefore());
                        menuParagraphKeepLines.setChecked(value.paraProps.value.get_KeepLines());
                    }
                    var text = null;
                    if (me.api) {
                        text = me.api.can_AddHyperlink();
                    }
                    menuCommentSeparatorPara.setVisible(!isInChart && me.api.can_AddQuotedComment() !== false && me.mode.canCoAuthoring && me.mode.canComments);
                    menuAddCommentPara.setVisible(!isInChart && me.api.can_AddQuotedComment() !== false && me.mode.canCoAuthoring && me.mode.canComments);
                    menuAddCommentPara.setDisabled(value.paraProps && value.paraProps.locked === true);
                    me.menuSpellPara.setVisible(value.spellProps !== undefined && value.spellProps.value.get_Checked() === false);
                    menuSpellcheckParaSeparator.setVisible(value.spellProps !== undefined && value.spellProps.value.get_Checked() === false);
                    menuIgnoreSpellPara.setVisible(value.spellProps !== undefined && value.spellProps.value.get_Checked() === false);
                    menuIgnoreAllSpellPara.setVisible(value.spellProps !== undefined && value.spellProps.value.get_Checked() === false);
                    me.langParaMenu.setVisible(value.spellProps !== undefined && value.spellProps.value.get_Checked() === false);
                    menuIgnoreSpellParaSeparator.setVisible(value.spellProps !== undefined && value.spellProps.value.get_Checked() === false);
                    if (value.spellProps !== undefined && value.spellProps.value.get_Checked() === false && value.spellProps.value.get_Variants() !== null && value.spellProps.value.get_Variants() !== undefined) {
                        me.addWordVariants(true);
                    } else {
                        me.menuSpellPara.setCaption(me.loadSpellText);
                        me.clearWordVariants(true);
                        me.menuSpellMorePara.setVisible(false);
                    }
                    if (me.langParaMenu.isVisible() && me._currLang.id !== me._currLang.paraid) {
                        me.changeLanguageMenu(me.langParaMenu.menu);
                        me._currLang.paraid = me._currLang.id;
                    }
                    menuAddHyperlinkPara.setVisible(value.hyperProps === undefined && text !== false);
                    menuHyperlinkPara.setVisible(value.hyperProps !== undefined);
                    menuHyperlinkParaSeparator.setVisible(menuAddHyperlinkPara.isVisible() || menuHyperlinkPara.isVisible());
                    menuEditHyperlinkPara.hyperProps = value.hyperProps;
                    if (text !== false) {
                        menuAddHyperlinkPara.hyperProps = {};
                        menuAddHyperlinkPara.hyperProps.value = new CHyperlinkProperty();
                        menuAddHyperlinkPara.hyperProps.value.put_Text(text);
                    }
                    var disabled = value.paraProps.locked || (value.headerProps !== undefined && value.headerProps.locked);
                    menuAddHyperlinkPara.setDisabled(disabled);
                    menuHyperlinkPara.setDisabled(disabled || value.hyperProps !== undefined && value.hyperProps.isSeveralLinks === true);
                    menuParagraphBreakBefore.setDisabled(disabled || !_.isUndefined(value.headerProps) || !_.isUndefined(value.imgProps));
                    menuParagraphKeepLines.setDisabled(disabled);
                    menuParagraphAdvanced.setDisabled(disabled);
                    menuFrameAdvanced.setDisabled(disabled);
                    menuParagraphVAlign.setDisabled(disabled);
                    var cancopy = me.api && me.api.can_CopyCut();
                    menuParaCopy.setDisabled(!cancopy);
                    menuParaCut.setDisabled(disabled || !cancopy);
                    menuParaPaste.setDisabled(disabled);
                    menuFrameAdvanced.setVisible(value.paraProps.value.get_FramePr() !== undefined);
                },
                items: [me.menuSpellPara, me.menuSpellMorePara, menuSpellcheckParaSeparator, menuIgnoreSpellPara, menuIgnoreAllSpellPara, me.langParaMenu, menuIgnoreSpellParaSeparator, menuParaCut, menuParaCopy, menuParaPaste, {
                    caption: "--"
                },
                menuParagraphBreakBefore, menuParagraphKeepLines, menuParagraphVAlign, menuParagraphAdvanced, menuFrameAdvanced, menuCommentSeparatorPara, menuAddCommentPara, menuHyperlinkParaSeparator, menuAddHyperlinkPara, menuHyperlinkPara]
            }).on("hide:after", function (menu, e) {
                if (me.suppressEditComplete) {
                    me.suppressEditComplete = false;
                    return;
                }
                me.fireEvent("editcomplete", me);
                me.currentMenu = null;
            });
            var menuEditHeaderFooter = new Common.UI.MenuItem({
                caption: me.editHeaderText
            });
            this.hdrMenu = new Common.UI.Menu({
                initMenu: function (value) {
                    menuEditHeaderFooter.setCaption(value.Header ? me.editHeaderText : me.editFooterText);
                    menuEditHeaderFooter.off("click").on("click", function (item) {
                        if (me.api) {
                            if (value.Header) {
                                me.api.GoToHeader(value.PageNum);
                            } else {
                                me.api.GoToFooter(value.PageNum);
                            }
                            me.fireEvent("editcomplete", me);
                        }
                    });
                },
                items: [menuEditHeaderFooter]
            }).on("hide:after", function (menu) {
                me.fireEvent("editcomplete", me);
                me.currentMenu = null;
            });
            var nextpage = $("#id_buttonNextPage");
            nextpage.attr("data-toggle", "tooltip");
            nextpage.tooltip({
                title: me.textNextPage + Common.Utils.String.platformKey("Alt+PgDn"),
                placement: "top-right"
            });
            var prevpage = $("#id_buttonPrevPage");
            prevpage.attr("data-toggle", "tooltip");
            prevpage.tooltip({
                title: me.textPrevPage + Common.Utils.String.platformKey("Alt+PgUp"),
                placement: "top-right"
            });
        },
        setLanguages: function (langs) {
            var me = this;
            if (langs && langs.length > 0) {
                _.each(langs, function (lang, index) {
                    me.langParaMenu.menu.addItem(new Common.UI.MenuItem({
                        caption: Common.util.LanguageInfo.getLocalLanguageName(lang.asc_getId())[1],
                        checkable: true,
                        toggleGroup: "popupparalang",
                        langid: lang.asc_getId()
                    }).on("click", function (item, e) {
                        if (me.api) {
                            if (!_.isUndefined(item.options.langid)) {
                                me.api.put_TextPrLang(item.options.langid);
                            }
                            me._currLang.paraid = item.options.langid;
                            me.langParaMenu.menu.currentCheckedItem = item;
                            me.fireEvent("editcomplete", me);
                        }
                    }));
                    me.langTableMenu.menu.addItem(new Common.UI.MenuItem({
                        caption: Common.util.LanguageInfo.getLocalLanguageName(lang.asc_getId())[1],
                        checkable: true,
                        toggleGroup: "popuptablelang",
                        langid: lang.asc_getId()
                    }).on("click", function (item, e) {
                        if (me.api) {
                            if (!_.isUndefined(item.options.langid)) {
                                me.api.put_TextPrLang(item.options.langid);
                            }
                            me._currLang.tableid = item.options.langid;
                            me.langTableMenu.menu.currentCheckedItem = item;
                            me.fireEvent("editcomplete", me);
                        }
                    }));
                });
                me.langTableMenu.menu.doLayout();
                me.langParaMenu.menu.doLayout();
            }
        },
        focus: function () {
            var me = this;
            _.defer(function () {
                me.cmpEl.focus();
            },
            50);
        },
        alignmentText: "Alignment",
        leftText: "Left",
        rightText: "Right",
        centerText: "Center",
        selectRowText: "Select Row",
        selectColumnText: "Select Column",
        selectCellText: "Select Cell",
        selectTableText: "Select Table",
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
        flowoverText: "Wrapping Style - Flow",
        inlineText: "Wrapping Style - Inline",
        originalSizeText: "Default Size",
        advancedText: "Advanced Settings",
        breakBeforeText: "Page break before",
        keepLinesText: "Keep lines together",
        editHeaderText: "Edit header",
        editFooterText: "Edit footer",
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
        advancedParagraphText: "Paragraph Advanced Settings",
        paragraphText: "Paragraph",
        guestText: "Guest",
        editChartText: "Edit Data",
        addCommentText: "Add Comment",
        topCellText: "Align Top",
        centerCellText: "Align Center",
        bottomCellText: "Align Bottom",
        cellAlignText: "Cell Vertical Alignment",
        txtInline: "Inline",
        txtSquare: "Square",
        txtTight: "Tight",
        txtThrough: "Through",
        txtTopAndBottom: "Top and bottom",
        txtBehind: "Behind",
        txtInFront: "In front",
        textWrap: "Wrapping Style",
        textAlign: "Align",
        textArrange: "Arrange",
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
        textEditWrapBoundary: "Edit Wrap Boundary",
        vertAlignText: "Vertical Alignment",
        loadSpellText: "Loading variants...",
        ignoreAllSpellText: "Ignore All",
        ignoreSpellText: "Ignore",
        noSpellVariantsText: "No variants",
        moreText: "More variants...",
        spellcheckText: "Spellcheck",
        langText: "Select Language",
        advancedFrameText: "Frame Advanced Settings",
        tipIsLocked: "This element is being edited by another user.",
        textNextPage: "Next Page",
        textPrevPage: "Previous Page",
        imageText: "Image Advanced Settings",
        shapeText: "Shape Advanced Settings",
        chartText: "Chart Advanced Settings",
        insertText: "Insert",
        textCopy: "Copy",
        textPaste: "Paste",
        textCut: "Cut"
    },
    DE.Views.DocumentHolder || {}));
});