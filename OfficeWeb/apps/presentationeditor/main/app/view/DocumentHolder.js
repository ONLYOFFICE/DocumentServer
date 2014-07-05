/*
 * (c) Copyright Ascensio System SIA 2010-2014
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
 var c_paragraphLinerule = {
    LINERULE_LEAST: 0,
    LINERULE_AUTO: 1,
    LINERULE_EXACT: 2
};
var c_tableBorder = {
    BORDER_VERTICAL_LEFT: 0,
    BORDER_HORIZONTAL_TOP: 1,
    BORDER_VERTICAL_RIGHT: 2,
    BORDER_HORIZONTAL_BOTTOM: 3,
    BORDER_VERTICAL_CENTER: 4,
    BORDER_HORIZONTAL_CENTER: 5,
    BORDER_INNER: 6,
    BORDER_OUTER: 7,
    BORDER_ALL: 8,
    BORDER_NONE: 9,
    BORDER_ALL_TABLE: 10,
    BORDER_NONE_TABLE: 11,
    BORDER_INNER_TABLE: 12,
    BORDER_OUTER_TABLE: 13
};
Ext.define("PE.view.DocumentHolder", {
    extend: "Ext.container.Container",
    alias: "widget.pedocumentholder",
    cls: "pe-documentholder",
    requires: ["Ext.String"],
    uses: ["Ext.menu.Menu", "Ext.menu.Manager", "PE.view.InsertTableDialog", "PE.view.ImageSettingsAdvanced", "PE.view.TableSettingsAdvanced", "PE.view.ShapeSettingsAdvanced", "PE.view.ParagraphSettingsAdvanced", "PE.view.HyperlinkSettings", "Common.component.MenuDataViewPicker", "Common.plugin.MenuExpand"],
    layout: "fit",
    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    initComponent: function () {
        var me = this;
        me.html = "";
        me.usertips = [];
        me._TtHeight = 20;
        var usersStore = Ext.getStore("Common.store.Users");
        var value = window.localStorage.getItem("pe-settings-livecomment");
        me.isLiveCommenting = !(value !== null && parseInt(value) == 0);
        this.hotKeys = new Ext.util.KeyMap(document, [{
            key: Ext.EventObject.F5,
            ctrl: true,
            shift: false,
            alt: false,
            defaultEventAction: "stopEvent",
            fn: function () {
                var previewPanel = Ext.getCmp("pe-preview");
                if (me.checkCanHotKey() && previewPanel && !previewPanel.isVisible()) {
                    previewPanel.setPosition(0, 0);
                    previewPanel.setSize(Ext.getBody().getWidth(), Ext.getBody().getHeight());
                    previewPanel.show();
                    Ext.getCmp("pe-applicationUI").hide();
                    if (me.api) {
                        me.api.StartDemonstration("presentation-preview", 0);
                    }
                }
            }
        }]);
        var showPopupMenu = function (menu, value, event, docElement, eOpts) {
            if (Ext.isDefined(menu) && menu !== null) {
                Ext.menu.Manager.hideAll();
                var showPoint = [event.get_X(), event.get_Y()];
                if (Ext.isFunction(menu.initMenu)) {
                    menu.initMenu(value);
                }
                me.currentMenu = menu;
                menu.showAt(showPoint);
            }
        };
        var showObjectMenu = function (event, docElement, eOpts) {
            if (me.api && me.mode.isEdit) {
                var menu_props = {};
                var menu_to_show = null;
                var selectedElements = me.api.getSelectedElements();
                if (selectedElements && Ext.isArray(selectedElements)) {
                    for (var i = 0; i < selectedElements.length; i++) {
                        var elType = selectedElements[i].get_ObjectType();
                        var elValue = selectedElements[i].get_ObjectValue();
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
                                                if (menu_props.shapeProps && menu_props.shapeProps.value && menu_props.tableProps === undefined) {
                                                    menu_to_show = me.textMenu;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (menu_to_show === null && menu_props.paraProps !== undefined) {
                        menu_to_show = me.textMenu;
                    }
                    showPopupMenu(menu_to_show, menu_props, event, docElement, eOpts);
                }
            }
        };
        var onContextMenu = function (event) {
            if (event.get_Type() == c_oAscContextMenuTypes.Thumbnails) {
                showPopupMenu(me.slideMenu, {
                    isSlideSelect: event.get_IsSlideSelect()
                },
                event);
            } else {
                showObjectMenu(event);
            }
        };
        var handleDocumentWheel = function (event) {
            if (me.api) {
                var delta = event.getWheelDelta();
                if (event.ctrlKey) {
                    if (delta < 0) {
                        me.api.zoomOut();
                    } else {
                        if (delta > 0) {
                            me.api.zoomIn();
                        }
                    }
                    event.stopEvent();
                }
            }
        };
        var handleDocumentKeyDown = function (event) {
            if (me.api) {
                var key = event.getKey();
                if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
                    if (key === event.NUM_PLUS || (Ext.isOpera && key == 43)) {
                        me.api.zoomIn();
                        event.stopEvent();
                        return false;
                    } else {
                        if (key === event.NUM_MINUS || (Ext.isOpera && key == 45)) {
                            me.api.zoomOut();
                            event.stopEvent();
                            return false;
                        }
                    }
                }
                if (me.currentMenu && me.currentMenu.isVisible()) {
                    if (key == event.DOWN) {
                        me.currentMenu.focus();
                        me.currentMenu.setActiveItem(me.currentMenu.items.items[0]);
                    } else {
                        if (key == event.UP) {
                            me.currentMenu.focus();
                            for (var i = me.currentMenu.items.length - 1; i >= 0; i--) {
                                if (me.currentMenu.items.items[i].isVisible()) {
                                    me.currentMenu.setActiveItem(me.currentMenu.items.items[i]);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        };
        var onDocumentHolderResize = function () {
            me._Height = me.getEl().getHeight();
            me._Width = me.getEl().getWidth();
            me._BodyWidth = Ext.getBody().getWidth();
            if (me.slideNumDiv) {
                Ext.destroy(me.slideNumDiv);
                me.slideNumDiv = undefined;
            }
        };
        var onAfterRender = function (ct) {
            var meEl = me.getEl();
            if (meEl) {
                meEl.on({
                    contextmenu: {
                        fn: function () {},
                        preventDefault: true
                    },
                    mousewheel: handleDocumentWheel,
                    click: function (event, el) {
                        if (! (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement)) {
                            me.focus(false);
                        }
                    }
                });
            }
            Ext.getDoc().on("mousewheel", handleDocumentWheel, me);
            Ext.getDoc().on("keydown", handleDocumentKeyDown, me);
            me.addListener("resize", onDocumentHolderResize, me);
        };
        var getUserName = function (id) {
            if (usersStore) {
                var rec = usersStore.findRecord("id", id);
                if (rec) {
                    return Ext.String.ellipsis(Ext.String.htmlEncode(rec.get("username")), 25, true);
                }
            }
            return me.guestText;
        };
        var screenTip = {
            toolTip: Ext.create("Ext.tip.ToolTip", {
                html: "props<br><b>Press Ctrl and click link</b>",
                shadow: false,
                dismissDelay: 0,
                style: "word-wrap: break-word;"
            }),
            strTip: "",
            isHidden: true
        };
        var userTooltip = Ext.create("Ext.tip.ToolTip", {
            dismissDelay: 0,
            html: me.tipIsLocked
        });
        var userTipMousover = function (evt, el, opt) {
            if (userTooltip !== undefined) {
                userTooltip.setTarget(el);
                userTooltip.show();
                var xy = userTooltip.getEl().getAlignToXY(el, "bl-tl?");
                xy[0] += 25;
                xy[1] -= 10;
                userTooltip.showAt(xy);
            }
        };
        var userTipMousout = function (evt, el, opt) {
            if (userTooltip !== undefined) {
                if (userTooltip.target && el == userTooltip.target.dom) {
                    userTooltip = undefined;
                    for (var i = 0; i < me.usertips.length; i++) {
                        me.usertips[i].un("mouseover", userTipMousover);
                        me.usertips[i].un("mouseout", userTipMousout);
                    }
                }
            }
        };
        var onHyperlinkClick = function (url) {
            if (url) {
                window.open(url);
            }
        };
        var onMouseMoveStart = function () {
            screenTip.isHidden = true;
            if (me.usertips.length > 0) {
                Ext.destroy(me.usertips);
            }
            me.usertips = [];
            me.usertipcount = 0;
        };
        var onMouseMoveEnd = function () {
            if (screenTip.isHidden && screenTip.toolTip.isVisible()) {
                screenTip.toolTip.hide();
            }
        };
        var onMouseMove = function (moveData) {
            if (me._XY === undefined && me.getEl()) {
                me._XY = me.getEl().getXY();
                me._Height = me.getEl().getHeight();
                me._Width = me.getEl().getWidth();
                me._BodyWidth = Ext.getBody().getWidth();
            }
            if (moveData) {
                var showPoint, ToolTip;
                if (moveData.get_Type() == 1) {
                    var recalc = false;
                    var hyperProps = moveData.get_Hyperlink();
                    if (hyperProps) {
                        screenTip.isHidden = false;
                        ToolTip = (hyperProps.get_ToolTip()) ? hyperProps.get_ToolTip() : hyperProps.get_Value();
                        ToolTip = Ext.String.htmlEncode(ToolTip);
                        if (screenTip.tipLength !== ToolTip.length || screenTip.strTip.indexOf(ToolTip) < 0) {
                            screenTip.toolTip.update(ToolTip + "<br><b>" + me.txtPressLink + "</b>");
                            screenTip.tipLength = ToolTip.length;
                            screenTip.strTip = ToolTip;
                            recalc = true;
                        }
                        showPoint = [moveData.get_X(), moveData.get_Y()];
                        showPoint[1] += (me._XY[1] - 15);
                        showPoint[0] += (me._XY[0] + 5);
                        if (!screenTip.toolTip.isVisible()) {
                            screenTip.toolTip.showAt([-10000, -10000]);
                        }
                        if (recalc) {
                            screenTip.tipHeight = screenTip.toolTip.getHeight();
                        }
                        showPoint[1] -= screenTip.tipHeight;
                        screenTip.toolTip.getEl().applyStyles({
                            top: showPoint[1] + "px",
                            left: showPoint[0] + "px"
                        });
                    }
                } else {
                    if (moveData.get_Type() == 2 && me.mode.isEdit) {
                        var src;
                        if (me.usertipcount >= me.usertips.length) {
                            src = Ext.DomHelper.append(Ext.getBody(), {
                                tag: "div",
                                cls: "username-tip"
                            },
                            true);
                            src.applyStyles({
                                height: me._TtHeight + "px",
                                position: "absolute",
                                zIndex: "19000",
                                visibility: "visible"
                            });
                            if (userTooltip !== undefined) {
                                src.on("mouseover", userTipMousover);
                                src.on("mouseout", userTipMousout);
                            }
                            me.usertips.push(src);
                        }
                        src = me.usertips[me.usertipcount];
                        me.usertipcount++;
                        ToolTip = getUserName(moveData.get_UserId());
                        showPoint = [moveData.get_X(), moveData.get_Y()];
                        showPoint[1] += (me._XY[1]);
                        showPoint[0] += (me._XY[0]);
                        showPoint[0] = me._BodyWidth - showPoint[0];
                        showPoint[1] -= ((moveData.get_LockedObjectType() == 2) ? me._TtHeight : 0);
                        if (showPoint[1] > me._XY[1] && showPoint[1] + me._TtHeight < me._XY[1] + me._Height) {
                            Ext.DomHelper.overwrite(src, ToolTip);
                            src.applyStyles({
                                visibility: "visible"
                            });
                            src.applyStyles({
                                top: showPoint[1] + "px",
                                right: showPoint[0] + "px"
                            });
                        }
                    } else {
                        screenTip.toolTip.hide();
                    }
                }
            }
        };
        var onDialogAddHyperlink = function () {
            var win, props;
            if (me.api) {
                var text = me.api.can_AddHyperlink();
                if (text !== false) {
                    var _arr = [];
                    for (var i = 0; i < me.api.getCountPages(); i++) {
                        _arr.push(i + 1);
                    }
                    props = new CHyperlinkProperty();
                    props.put_Text(text);
                    win = Ext.create("PE.view.HyperlinkSettings", {
                        slides: _arr
                    });
                    win.setSettings(props, me.api.getCurrentPage());
                }
            }
            if (win) {
                win.addListener("onmodalresult", Ext.bind(function (mr) {
                    if (mr == 1) {
                        props = win.getSettings();
                        me.api.add_Hyperlink(props);
                    }
                    me.fireEvent("editcomplete", me);
                },
                me), false);
                win.show();
            }
        };
        var onPaintSlideNum = function (slideNum) {
            if (me._XY === undefined && me.getEl()) {
                me._XY = me.getEl().getXY();
                me._Height = me.getEl().getHeight();
                me._Width = me.getEl().getWidth();
                me._BodyWidth = Ext.getBody().getWidth();
            }
            if (me.slideNumDiv === undefined) {
                me.slideNumDiv = Ext.DomHelper.append(Ext.getBody(), {
                    tag: "div",
                    cls: "slidenum-div"
                },
                true);
                me.slideNumDiv.applyStyles({
                    height: "20px",
                    position: "absolute",
                    zIndex: "19000",
                    display: "block"
                });
                me.slideNumDiv.applyStyles({
                    top: me._XY[1] + me._Height / 2 + "px",
                    right: (me._BodyWidth - me._XY[0] - me._Width + 22) + "px"
                });
            }
            Ext.DomHelper.overwrite(me.slideNumDiv, me.txtSlide + " " + (slideNum + 1));
            me.slideNumDiv.applyStyles({
                display: "block"
            });
        };
        var onEndPaintSlideNum = function () {
            if (me.slideNumDiv) {
                me.slideNumDiv.applyStyles({
                    display: "none"
                });
            }
        };
        var onCoAuthoringDisconnect = function () {
            me.mode.isEdit = false;
        };
        this.changePosition = function () {
            me._XY = me.getEl().getXY();
            onMouseMoveStart();
        };
        this.hideTips = function () {
            Ext.destroy(me.usertips);
            me.usertips = [];
            me.usertipcount = 0;
        };
        this.setLiveCommenting = function (value) {
            this.isLiveCommenting = value;
        };
        this.hkComments = new Ext.util.KeyMap(document, {
            key: "H",
            ctrl: true,
            alt: true,
            shift: false,
            defaultEventAction: "stopEvent",
            fn: function () {
                if (me.checkCanHotKey() && me.api.can_AddQuotedComment() !== false) {
                    me.addComment();
                }
            }
        });
        this.setApi = function (o) {
            this.api = o;
            if (this.api) {
                this.api.asc_registerCallback("asc_onContextMenu", Ext.bind(onContextMenu, this));
                this.api.asc_registerCallback("asc_onMouseMoveStart", Ext.bind(onMouseMoveStart, this));
                this.api.asc_registerCallback("asc_onMouseMoveEnd", Ext.bind(onMouseMoveEnd, this));
                this.api.asc_registerCallback("asc_onPaintSlideNum", Ext.bind(onPaintSlideNum, this));
                this.api.asc_registerCallback("asc_onEndPaintSlideNum", Ext.bind(onEndPaintSlideNum, this));
                this.api.asc_registerCallback("asc_onHyperlinkClick", Ext.bind(onHyperlinkClick, this));
                this.api.asc_registerCallback("asc_onMouseMove", Ext.bind(onMouseMove, this));
                if (this.mode.isEdit === true) {
                    this.api.asc_registerCallback("asc_onDialogAddHyperlink", Ext.bind(onDialogAddHyperlink, this));
                }
                this.api.asc_registerCallback("asc_onСoAuthoringDisconnect", Ext.bind(onCoAuthoringDisconnect, this));
            }
            return this;
        };
        this.mode = {};
        this.setMode = function (m) {
            if (this.api && m.isEdit) {
                this.api.asc_registerCallback("asc_onDialogAddHyperlink", Ext.bind(onDialogAddHyperlink, this));
            }
            this.mode = m;
            this.hkComments[(this.mode.canCoAuthoring && this.mode.isEdit) ? "enable" : "disable"]();
            this.editorConfig = {
                user: m.user
            };
        };
        me.on("afterrender", onAfterRender, me);
        me.callParent(arguments);
    },
    _onSlideStoreDataChanged: function () {
        this.slideLayoutMenu.picker.needArrangeSlideItems = true;
    },
    _arrangeSlideItems: function () {
        if (!this.needArrangeSlideItems) {
            return;
        }
        var me = this;
        if (this.getEl()) {
            var jspElem = this.getEl().down(".jspPane");
            if (jspElem && jspElem.getHeight() > 0 && this.getEl().getHeight() > 0) {
                var i = 0;
                var updatescroll = setInterval(function () {
                    if (me.needArrangeSlideItems) {
                        me.resizeSlideItems();
                    }
                    if (!me.needArrangeSlideItems) {
                        clearInterval(updatescroll);
                        me.doLayout();
                        return;
                    }
                    if (i++>5) {
                        clearInterval(updatescroll);
                    }
                },
                100);
            }
        }
    },
    _resizeSlideItems: function () {
        var cols = 3;
        var selector = "div.main-thumb";
        var el = this.getEl();
        var thumbs = el.query(selector);
        var i = 0;
        var limit_height = (this.itemHeight !== undefined) ? this.itemHeight : 67;
        while (i < thumbs.length) {
            var height = 0;
            for (var j = i; j < i + cols; j++) {
                if (j >= thumbs.length) {
                    break;
                }
                var thEl = Ext.get(thumbs[j]);
                var h = thEl.getHeight();
                if (h < limit_height) {
                    return;
                }
                if (h < height) {
                    thEl.setHeight(height);
                } else {
                    height = h;
                }
            }
            i += cols;
        }
        if (thumbs.length > 0) {
            this.needArrangeSlideItems = false;
        }
    },
    addHyperlink: function (item, e, eOpt) {
        var win;
        var me = this;
        if (me.api) {
            var _arr = [];
            for (var i = 0; i < me.api.getCountPages(); i++) {
                _arr.push(i + 1);
            }
            win = Ext.create("PE.view.HyperlinkSettings", {
                slides: _arr
            });
            win.setSettings(item.hyperProps.value, me.api.getCurrentPage());
        }
        if (win) {
            win.addListener("onmodalresult", Ext.bind(function (mr) {
                if (mr == 1) {
                    var props = win.getSettings();
                    me.api.add_Hyperlink(props);
                }
                me.fireEvent("editcomplete", me);
            },
            me), false);
            win.show();
        }
    },
    editHyperlink: function (item, e, eOpt) {
        var win;
        var me = this;
        if (me.api) {
            var _arr = [];
            for (var i = 0; i < me.api.getCountPages(); i++) {
                _arr.push(i + 1);
            }
            win = Ext.create("PE.view.HyperlinkSettings", {
                slides: _arr
            });
            win.setSettings(item.hyperProps.value, me.api.getCurrentPage());
        }
        if (win) {
            win.addListener("onmodalresult", Ext.bind(function (mr) {
                if (mr == 1) {
                    var props = win.getSettings();
                    me.api.change_Hyperlink(props);
                }
                me.fireEvent("editcomplete", me);
            },
            me), false);
            win.show();
        }
    },
    addComment: function (item, e, eOpt) {
        var me = this;
        if (me.api) {
            var ascCommentData = new asc_CCommentData();
            var now = new Date(),
            timeZoneOffsetInMs = now.getTimezoneOffset() * 60000;
            if (ascCommentData) {
                ascCommentData.asc_putText("");
                ascCommentData.asc_putTime((now.getTime() - timeZoneOffsetInMs).toString());
                ascCommentData.asc_putUserId(me.editorConfig.user.id);
                ascCommentData.asc_putUserName(me.editorConfig.user.name);
                ascCommentData.asc_putSolved(false);
                me.api.asc_addComment(ascCommentData);
                var commemntPopovers = Ext.ComponentQuery.query("commoncommentspopover");
                if (commemntPopovers) {
                    var commemntPopover = commemntPopovers[0];
                    if (commemntPopover) {
                        var dataView = commemntPopover.query("dataview")[0];
                        commemntPopover.fireTransformToAdd();
                        if (dataView) {
                            dataView.on("viewready", function () {
                                commemntPopover.fireTransformToAdd();
                            },
                            this);
                        }
                    }
                }
            }
        }
    },
    checkCanHotKey: function () {
        var winElements = Ext.getDoc().query(".x-window");
        for (var i = 0; i < winElements.length; i++) {
            var cmp = Ext.getCmp(winElements[i].id);
            if (cmp && cmp.isVisible() && cmp.modal) {
                return false;
            }
        }
        return true;
    },
    createDelayedElements: function () {
        var me = this;
        me.addEvents("editcomplete");
        var slideTpl = Ext.create("Ext.XTemplate", '<tpl for=".">', '<div class="main-thumb">', '<div class="thumb-wrap">', '<img src="{imageUrl}" />', "</div>", '<tpl if="title">', '<div class="caption"', '<tpl if="itemWidth">', ' style="width:' + "{itemWidth}" + 'px;"', "</tpl>", "><span>{title}</span></div>", "</tpl>", "</div>", "</tpl>");
        var slidestore = Ext.getStore("SlideLayouts");
        slidestore.on("datachanged", me._onSlideStoreDataChanged, me);
        var mnuDeleteSlide = Ext.widget("menuitem", {
            text: me.txtDeleteSlide,
            listeners: {
                click: function (item, e, eOpt) {
                    if (me.api) {
                        me.api.DeleteSlide();
                        me.fireEvent("editcomplete", this);
                    }
                }
            }
        });
        var mnuChangeSlide = Ext.widget("menuitem", {
            text: me.txtChangeLayout,
            hideOnClick: false,
            menu: me.slideLayoutMenu = Ext.create("Common.component.MenuDataViewPicker", {
                width: 421,
                height: 320,
                dataTpl: slideTpl,
                cls: "slide-picker",
                store: slidestore,
                viewData: [],
                contentWidth: 401,
                arrangeItems: me._arrangeSlideItems,
                resizeSlideItems: me._resizeSlideItems,
                listeners: {
                    select: Ext.bind(function (picker, record) {
                        if (me.api) {
                            me.api.ChangeLayout(record.data.data.idx);
                            me.fireEvent("editcomplete", this);
                        }
                    },
                    me),
                    hide: function () {
                        me.fireEvent("editcomplete", me);
                    },
                    show: function (cmp) {
                        cmp.picker.selectByIndex(-1, false);
                    },
                    beforeshow: Ext.bind(function (cnt) {
                        if (cnt.rendered) {
                            var w_old = cnt.picker.contentWidth;
                            var rec = (cnt.picker.store.getCount() > 0) ? cnt.picker.store.getAt(0) : null;
                            if (rec) {
                                var w = rec.data.itemWidth * 3 + 64;
                                if (w_old !== (w - 20)) {
                                    cnt.picker.itemHeight = rec.data.itemHeight;
                                    cnt.picker.contentWidth = w - 20;
                                    cnt.setWidth(w);
                                }
                            }
                        }
                    },
                    me)
                },
                plugins: [{
                    ptype: "menuexpand"
                }]
            })
        });
        me.slideMenu = Ext.widget("menu", {
            showSeparator: false,
            bodyCls: "no-icons",
            listeners: {
                hide: function (cnt, eOpt) {
                    me.fireEvent("editcomplete", me);
                    me.currentMenu = null;
                }
            },
            initMenu: function (value) {
                for (var i = 1; i < 5; i++) {
                    me.slideMenu.items.items[i].setVisible(value.isSlideSelect);
                }
                var selectedElements = me.api.getSelectedElements();
                if (selectedElements && Ext.isArray(selectedElements)) {
                    for (var i = 0; i < selectedElements.length; i++) {
                        if (c_oAscTypeSelectElement.Slide == selectedElements[i].get_ObjectType()) {
                            var elValue = selectedElements[i].get_ObjectValue();
                            var locked = elValue.get_LockDelete();
                            var lockedDeleted = elValue.get_LockRemove();
                            var lockedLayout = elValue.get_LockLayout();
                            for (var i = 0; i < 2; i++) {
                                me.slideMenu.items.items[i].setDisabled(locked);
                            }
                            me.slideMenu.items.items[6].setDisabled(locked);
                            mnuDeleteSlide.setDisabled(lockedDeleted || locked);
                            mnuChangeSlide.setDisabled(lockedLayout || locked);
                            break;
                        }
                    }
                }
            },
            items: [{
                text: me.txtNewSlide,
                listeners: {
                    click: function (item, e, eOpt) {
                        if (me.api) {
                            me.api.AddSlide();
                            me.fireEvent("editcomplete", this);
                        }
                    }
                }
            },
            {
                text: me.txtDuplicateSlide,
                listeners: {
                    click: function (item, e, eOpt) {
                        if (me.api) {
                            me.api.DublicateSlide();
                            me.fireEvent("editcomplete", this);
                        }
                    }
                }
            },
            mnuDeleteSlide, {
                xtype: "menuseparator"
            },
            mnuChangeSlide, {
                xtype: "menuseparator"
            },
            {
                text: me.txtSelectAll,
                listeners: {
                    click: function (item, e, eOpt) {
                        if (me.api) {
                            me.api.SelectAllSlides();
                            me.fireEvent("editcomplete", this);
                        }
                    }
                }
            },
            {
                xtype: "menuseparator"
            },
            {
                text: me.txtPreview,
                listeners: {
                    click: function (item, e, eOpt) {
                        var previewPanel = Ext.getCmp("pe-preview");
                        if (previewPanel) {
                            previewPanel.setPosition(0, 0);
                            previewPanel.setSize(Ext.getBody().getWidth(), Ext.getBody().getHeight());
                            previewPanel.show();
                            Ext.getCmp("pe-applicationUI").hide();
                        }
                        if (me.api) {
                            var current = me.api.getCurrentPage();
                            me.api.StartDemonstration("presentation-preview", Ext.isNumber(current) ? current : 0);
                        }
                    }
                }
            }],
            plugins: [{
                ptype: "menuexpand"
            }]
        });
        var mnuTableMerge = Ext.create("Ext.menu.Item", {
            text: me.mergeCellsText,
            listeners: {
                click: function (item) {
                    if (me.api) {
                        me.api.MergeCells();
                    }
                }
            }
        });
        var mnuTableSplit = Ext.create("Ext.menu.Item", {
            text: me.splitCellsText,
            listeners: {
                click: function (item) {
                    if (me.api) {
                        var win = Ext.create("PE.view.InsertTableDialog", {
                            labelTitle: this.splitCellTitleText
                        });
                        win.addListener("onmodalresult", Ext.bind(function (o, mr, s) {
                            if (mr) {
                                me.api.SplitCell(s[0], s[1]);
                            }
                            me.fireEvent("editcomplete", me);
                        },
                        this), false);
                        win.show();
                    }
                }
            }
        });
        var tableCellsVAlign = function (item, e) {
            if (me.api) {
                var properties = new CTableProp();
                properties.put_CellsVAlign(item.valign);
                me.api.tblApply(properties);
            }
        };
        var menuTableCellAlign = Ext.widget("menuitem", {
            text: me.cellAlignText,
            hideOnClick: false,
            menu: {
                showSeparator: false,
                bodyCls: "no-icons",
                items: [me.menuTableCellTop = Ext.widget("menucheckitem", {
                    text: me.topCellText,
                    checked: false,
                    group: "popuptablecellalign",
                    valign: c_oAscVertAlignJc.Top,
                    listeners: {
                        click: tableCellsVAlign,
                        scope: me
                    }
                }), me.menuTableCellCenter = Ext.widget("menucheckitem", {
                    text: me.centerCellText,
                    checked: false,
                    group: "popuptablecellalign",
                    valign: c_oAscVertAlignJc.Center,
                    listeners: {
                        click: tableCellsVAlign,
                        scope: me
                    }
                }), me.menuTableCellBottom = Ext.widget("menucheckitem", {
                    text: me.bottomCellText,
                    checked: false,
                    group: "popuptablecellalign",
                    valign: c_oAscVertAlignJc.Bottom,
                    listeners: {
                        click: tableCellsVAlign,
                        scope: me
                    }
                })],
                plugins: [{
                    ptype: "menuexpand"
                }]
            }
        });
        var menuTableAdvanced = Ext.widget("menuitem", {
            text: me.advancedTableText,
            listeners: {
                click: function (item, e, eOpt) {
                    var win;
                    if (me.api) {
                        var selectedElements = me.api.getSelectedElements();
                        if (selectedElements && Ext.isArray(selectedElements)) {
                            for (var i = selectedElements.length - 1; i >= 0; i--) {
                                var elType, elValue;
                                elType = selectedElements[i].get_ObjectType();
                                elValue = selectedElements[i].get_ObjectValue();
                                if (c_oAscTypeSelectElement.Table == elType) {
                                    win = Ext.create("PE.view.TableSettingsAdvanced");
                                    win.updateMetricUnit();
                                    win.setSettings({
                                        tableProps: elValue,
                                        borderProps: me.borderAdvancedProps
                                    });
                                    break;
                                }
                            }
                        }
                    }
                    if (win) {
                        win.addListener("onmodalresult", Ext.bind(function (o, mr, s) {
                            if (mr == 1) {
                                var props = win.getSettings();
                                me.borderAdvancedProps = props.borderProps;
                                me.api.tblApply(props.tableProps);
                            }
                            me.fireEvent("editcomplete", me);
                        },
                        this), false);
                        win.show();
                    }
                }
            }
        });
        var menuImageAdvanced = Ext.widget("menuitem", {
            text: me.advancedImageText,
            listeners: {
                click: function (item, e, eOpt) {
                    var win;
                    if (me.api) {
                        var selectedElements = me.api.getSelectedElements();
                        if (selectedElements && Ext.isArray(selectedElements)) {
                            for (var i = selectedElements.length - 1; i >= 0; i--) {
                                var elType, elValue;
                                elType = selectedElements[i].get_ObjectType();
                                elValue = selectedElements[i].get_ObjectValue();
                                if (c_oAscTypeSelectElement.Image == elType) {
                                    win = Ext.create("PE.view.ImageSettingsAdvanced", {});
                                    win.updateMetricUnit();
                                    win.setSettings(elValue);
                                    break;
                                }
                            }
                        }
                    }
                    if (win) {
                        if (!menuImgOriginalSize.isDisabled()) {
                            var imgsize = me.api.get_OriginalSizeImage();
                            if (imgsize) {
                                win.setSizeOriginal({
                                    width: imgsize.get_ImageWidth(),
                                    height: imgsize.get_ImageHeight()
                                });
                            }
                        }
                        win.addListener("onmodalresult", Ext.bind(function (o, mr, s) {
                            if (mr == 1 && s) {
                                me.api.ImgApply(s);
                            }
                            me.fireEvent("editcomplete", me);
                        },
                        this), false);
                        win.show();
                    }
                },
                scope: me
            }
        });
        var menuShapeAdvanced = Ext.widget("menuitem", {
            text: me.advancedShapeText,
            listeners: {
                click: function (item, e, eOpt) {
                    var win;
                    if (me.api) {
                        var selectedElements = me.api.getSelectedElements();
                        if (selectedElements && Ext.isArray(selectedElements)) {
                            for (var i = selectedElements.length - 1; i >= 0; i--) {
                                var elType, elValue;
                                elType = selectedElements[i].get_ObjectType();
                                elValue = selectedElements[i].get_ObjectValue();
                                if (c_oAscTypeSelectElement.Shape == elType) {
                                    win = Ext.create("PE.view.ShapeSettingsAdvanced", {});
                                    win.updateMetricUnit();
                                    win.setSettings(elValue);
                                    break;
                                }
                            }
                        }
                    }
                    if (win) {
                        win.addListener("onmodalresult", Ext.bind(function (o, mr, s) {
                            if (mr == 1 && s) {
                                me.api.ShapeApply(s);
                            }
                            me.fireEvent("editcomplete", me);
                        },
                        this), false);
                        win.show();
                    }
                },
                scope: me
            }
        });
        var menuParagraphAdvanced = Ext.widget("menuitem", {
            text: me.advancedParagraphText,
            listeners: {
                click: function (item, e, eOpt) {
                    var win, me = this;
                    if (me.api) {
                        var selectedElements = me.api.getSelectedElements();
                        if (selectedElements && Ext.isArray(selectedElements)) {
                            for (var i = selectedElements.length - 1; i >= 0; i--) {
                                var elType, elValue;
                                elType = selectedElements[i].get_ObjectType();
                                elValue = selectedElements[i].get_ObjectValue();
                                if (c_oAscTypeSelectElement.Paragraph == elType) {
                                    win = Ext.create("PE.view.ParagraphSettingsAdvanced");
                                    win.updateMetricUnit();
                                    win.setSettings({
                                        paragraphProps: elValue,
                                        api: me.api
                                    });
                                    break;
                                }
                            }
                        }
                    }
                    if (win) {
                        win.on({
                            "onmodalresult": function (o, mr, s) {
                                if (mr == 1 && s) {
                                    me.api.paraApply(s.paragraphProps);
                                }
                            },
                            "close": function (o) {
                                me.fireEvent("editcomplete", me);
                            }
                        });
                        win.show();
                    }
                },
                scope: this
            }
        });
        var menuCommentParaSeparator = Ext.widget("menuseparator");
        var menuAddHyperlinkPara = Ext.widget("menuitem", {
            text: me.hyperlinkText,
            listeners: {
                click: me.addHyperlink,
                scope: me
            }
        });
        var menuEditHyperlinkPara = Ext.widget("menuitem", {
            text: me.editHyperlinkText,
            listeners: {
                click: me.editHyperlink,
                scope: me
            }
        });
        var menuRemoveHyperlinkPara = Ext.widget("menuitem", {
            text: me.removeHyperlinkText,
            listeners: {
                click: function (item, e, eOpt) {
                    if (me.api) {
                        me.api.remove_Hyperlink();
                    }
                    me.fireEvent("editcomplete", me);
                }
            }
        });
        var menuHyperlinkPara = Ext.widget("menuitem", {
            text: me.hyperlinkText,
            hideOnClick: false,
            menu: {
                showSeparator: false,
                bodyCls: "no-icons",
                items: [menuEditHyperlinkPara, menuRemoveHyperlinkPara]
            }
        });
        var menuAddHyperlinkTable = Ext.widget("menuitem", {
            text: me.hyperlinkText,
            listeners: {
                click: me.addHyperlink,
                scope: me
            }
        });
        var menuEditHyperlinkTable = Ext.widget("menuitem", {
            text: me.editHyperlinkText,
            listeners: {
                click: me.editHyperlink,
                scope: me
            }
        });
        var menuRemoveHyperlinkTable = Ext.widget("menuitem", {
            text: me.removeHyperlinkText,
            listeners: {
                click: function (item, e, eOpt) {
                    if (me.api) {
                        me.api.remove_Hyperlink();
                    }
                    me.fireEvent("editcomplete", me);
                }
            }
        });
        var menuHyperlinkTable = Ext.widget("menuitem", {
            text: me.hyperlinkText,
            hideOnClick: false,
            menu: {
                showSeparator: false,
                bodyCls: "no-icons",
                items: [menuEditHyperlinkTable, menuRemoveHyperlinkTable]
            }
        });
        var menuHyperlinkSeparator = Ext.widget("menuseparator");
        var mnuGroupImg = Ext.create("Ext.menu.Item", {
            iconCls: "mnu-icon-item mnu-group",
            text: this.txtGroup,
            listeners: {
                click: function (item, e) {
                    if (me.api) {
                        me.api.groupShapes();
                    }
                    me.fireEvent("editcomplete", this);
                },
                scope: me
            }
        });
        var mnuUnGroupImg = Ext.create("Ext.menu.Item", {
            iconCls: "mnu-icon-item mnu-ungroup",
            text: this.txtUngroup,
            listeners: {
                click: function (item, e) {
                    if (me.api) {
                        me.api.unGroupShapes();
                    }
                    me.fireEvent("editcomplete", this);
                },
                scope: me
            }
        });
        var menuImgShapeArrange = Ext.widget("menuitem", {
            text: me.txtArrange,
            hideOnClick: false,
            menu: {
                showSeparator: false,
                defaults: {
                    cls: "toolbar-menu-icon-item"
                },
                items: [{
                    iconCls: "mnu-icon-item mnu-arrange-front",
                    text: this.textArrangeFront,
                    listeners: {
                        click: function (item, e) {
                            if (this.api) {
                                this.api.shapes_bringToFront();
                            }
                            this.fireEvent("editcomplete", this);
                        },
                        scope: this
                    }
                },
                {
                    iconCls: "mnu-icon-item mnu-arrange-back",
                    text: this.textArrangeBack,
                    listeners: {
                        click: function (item, e) {
                            if (this.api) {
                                this.api.shapes_bringToBack();
                            }
                            this.fireEvent("editcomplete", this);
                        },
                        scope: this
                    }
                },
                {
                    iconCls: "mnu-icon-item mnu-arrange-forward",
                    text: this.textArrangeForward,
                    listeners: {
                        click: function (item, e) {
                            if (this.api) {
                                this.api.shapes_bringForward();
                            }
                            this.fireEvent("editcomplete", this);
                        },
                        scope: this
                    }
                },
                {
                    iconCls: "mnu-icon-item mnu-arrange-backward",
                    text: this.textArrangeBackward,
                    listeners: {
                        click: function (item, e) {
                            if (this.api) {
                                this.api.shapes_bringBackward();
                            }
                            this.fireEvent("editcomplete", this);
                        },
                        scope: this
                    }
                },
                {
                    xtype: "menuseparator"
                },
                mnuGroupImg, mnuUnGroupImg],
                plugins: [{
                    ptype: "menuexpand"
                }]
            }
        });
        var menuImgShapeAlign = Ext.widget("menuitem", {
            text: me.txtAlign,
            hideOnClick: false,
            menu: {
                showSeparator: false,
                defaults: {
                    cls: "toolbar-menu-icon-item",
                    listeners: {
                        click: function (item, e) {
                            if (this.api) {
                                this.api.put_ShapesAlign(item.halign);
                            }
                            this.fireEvent("editcomplete", this);
                        },
                        scope: this
                    }
                },
                items: [{
                    iconCls: "mnu-icon-item mnu-shape-align-left",
                    text: this.textShapeAlignLeft,
                    halign: c_oAscAlignShapeType.ALIGN_LEFT
                },
                {
                    iconCls: "mnu-icon-item mnu-shape-align-center",
                    text: this.textShapeAlignCenter,
                    halign: c_oAscAlignShapeType.ALIGN_CENTER
                },
                {
                    iconCls: "mnu-icon-item mnu-shape-align-right",
                    text: this.textShapeAlignRight,
                    halign: c_oAscAlignShapeType.ALIGN_RIGHT
                },
                {
                    iconCls: "mnu-icon-item mnu-shape-align-top",
                    text: this.textShapeAlignTop,
                    halign: c_oAscAlignShapeType.ALIGN_TOP
                },
                {
                    iconCls: "mnu-icon-item mnu-shape-align-middle",
                    text: this.textShapeAlignMiddle,
                    halign: c_oAscAlignShapeType.ALIGN_MIDDLE
                },
                {
                    iconCls: "mnu-icon-item mnu-shape-align-bottom",
                    text: this.textShapeAlignBottom,
                    halign: c_oAscAlignShapeType.ALIGN_BOTTOM
                },
                {
                    xtype: "menuseparator"
                },
                {
                    iconCls: "mnu-icon-item mnu-distrib-hor",
                    text: this.txtDistribHor,
                    listeners: {
                        click: function (item, e) {
                            if (this.api) {
                                this.api.DistributeHorizontally();
                            }
                            this.fireEvent("editcomplete", this);
                        },
                        scope: this
                    }
                },
                {
                    iconCls: "mnu-icon-item mnu-distrib-vert",
                    text: this.txtDistribVert,
                    listeners: {
                        click: function (item, e) {
                            if (this.api) {
                                this.api.DistributeVertically();
                            }
                            this.fireEvent("editcomplete", this);
                        },
                        scope: this
                    }
                }],
                plugins: [{
                    ptype: "menuexpand"
                }]
            }
        });
        var menuParagraphVAlign = Ext.widget("menuitem", {
            text: me.vertAlignText,
            hideOnClick: false,
            menu: {
                showSeparator: false,
                bodyCls: "no-icons",
                items: [me.menuParagraphTop = Ext.widget("menucheckitem", {
                    text: me.topCellText,
                    checked: false,
                    group: "popupparagraphvalign",
                    valign: c_oAscVerticalTextAlign.TEXT_ALIGN_TOP
                }), me.menuParagraphCenter = Ext.widget("menucheckitem", {
                    text: me.centerCellText,
                    checked: false,
                    group: "popupparagraphvalign",
                    valign: c_oAscVerticalTextAlign.TEXT_ALIGN_CTR
                }), me.menuParagraphBottom = Ext.widget("menucheckitem", {
                    text: me.bottomCellText,
                    checked: false,
                    group: "popupparagraphvalign",
                    valign: c_oAscVerticalTextAlign.TEXT_ALIGN_BOTTOM
                })],
                plugins: [{
                    ptype: "menuexpand"
                }]
            }
        });
        var menuImgShapeSeparator = Ext.widget("menuseparator");
        var menuImgOriginalSize = Ext.widget("menuitem", {
            text: me.originalSizeText,
            listeners: {
                click: function (item, e, eOpt) {
                    if (me.api) {
                        var originalImageSize = me.api.get_OriginalSizeImage();
                        if (originalImageSize) {
                            var properties = new CImgProperty();
                            properties.put_Width(originalImageSize.get_ImageWidth());
                            properties.put_Height(originalImageSize.get_ImageHeight());
                            me.api.ImgApply(properties);
                        }
                        me.fireEvent("editcomplete", this);
                    }
                },
                scope: me
            }
        });
        var menuAddCommentPara = Ext.widget("menuitem", {
            text: me.addCommentText,
            hidden: true,
            listeners: {
                click: this.addComment,
                scope: this
            }
        });
        var menuAddCommentTable = Ext.widget("menuitem", {
            text: me.addCommentText,
            hidden: true,
            listeners: {
                click: this.addComment,
                scope: this
            }
        });
        var menuCommentSeparatorImg = Ext.widget("menuseparator", {
            hidden: true
        });
        var menuAddCommentImg = Ext.widget("menuitem", {
            text: me.addCommentText,
            hidden: true,
            listeners: {
                click: this.addComment,
                scope: this
            }
        });
        me.textMenu = Ext.widget("menu", {
            showSeparator: false,
            bodyCls: "no-icons",
            listeners: {
                hide: function (cnt, eOpt) {
                    me.fireEvent("editcomplete", me);
                    me.currentMenu = null;
                }
            },
            initMenu: function (value) {
                var disabled = (value.paraProps !== undefined && value.paraProps.locked) || (value.slideProps !== undefined && value.slideProps.locked);
                var isInShape = (value.shapeProps && value.shapeProps.value);
                menuParagraphVAlign.setVisible(isInShape);
                if (isInShape) {
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
                menuAddCommentPara.setVisible(me.api.can_AddQuotedComment() !== false && me.mode.canCoAuthoring);
                menuCommentParaSeparator.setVisible(menuAddCommentPara.isVisible() || menuAddHyperlinkPara.isVisible() || menuHyperlinkPara.isVisible());
                menuAddHyperlinkPara.setDisabled(disabled);
                menuHyperlinkPara.setDisabled(disabled);
                menuAddCommentPara.setDisabled(disabled);
            },
            items: [menuParagraphVAlign, menuParagraphAdvanced, menuCommentParaSeparator, menuAddCommentPara, menuAddHyperlinkPara, menuHyperlinkPara]
        });
        me.tableMenu = Ext.widget("menu", {
            showSeparator: false,
            bodyCls: "no-icons",
            listeners: {
                hide: function (cnt, eOpt) {
                    me.fireEvent("editcomplete", me);
                    me.currentMenu = null;
                }
            },
            initMenu: function (value) {
                if (value.tableProps === undefined) {
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
                for (var i = 1; i < 4; i++) {
                    me.tableMenu.items.items[i].setDisabled(value.tableProps.locked || disabled);
                }
                menuTableCellAlign.setDisabled(value.tableProps.locked || disabled);
                menuTableAdvanced.setDisabled(value.tableProps.locked || disabled);
                var text = null;
                if (me.api) {
                    text = me.api.can_AddHyperlink();
                }
                menuAddHyperlinkTable.setVisible(value.hyperProps === undefined && text !== false);
                menuHyperlinkTable.setVisible(value.hyperProps !== undefined);
                menuHyperlinkSeparator.setVisible(menuAddHyperlinkTable.isVisible() || menuHyperlinkTable.isVisible() || menuAddCommentTable.isVisible());
                menuEditHyperlinkTable.hyperProps = value.hyperProps;
                if (text !== false) {
                    menuAddHyperlinkTable.hyperProps = {};
                    menuAddHyperlinkTable.hyperProps.value = new CHyperlinkProperty();
                    menuAddHyperlinkTable.hyperProps.value.put_Text(text);
                }
                menuAddHyperlinkTable.setDisabled(value.paraProps.locked || disabled);
                menuHyperlinkTable.setDisabled(value.paraProps.locked || disabled);
                menuAddCommentTable.setVisible(me.api.can_AddQuotedComment() !== false && me.mode.canCoAuthoring);
                menuAddCommentTable.setDisabled(value.paraProps.locked || disabled);
            },
            items: [{
                text: me.selectText,
                hideOnClick: false,
                menu: {
                    showSeparator: false,
                    bodyCls: "no-icons",
                    width: 100,
                    items: [{
                        text: me.rowText,
                        listeners: {
                            click: function (item) {
                                if (me.api) {
                                    me.api.selectRow();
                                }
                            }
                        }
                    },
                    {
                        text: me.columnText,
                        listeners: {
                            click: function (item) {
                                if (me.api) {
                                    me.api.selectColumn();
                                }
                            }
                        }
                    },
                    {
                        text: me.cellText,
                        listeners: {
                            click: function (item) {
                                if (me.api) {
                                    me.api.selectCell();
                                }
                            }
                        }
                    },
                    {
                        text: me.tableText,
                        listeners: {
                            click: function (item) {
                                if (me.api) {
                                    me.api.selectTable();
                                }
                            }
                        }
                    }],
                    plugins: [{
                        ptype: "menuexpand"
                    }]
                }
            },
            {
                text: me.insertRowText,
                hideOnClick: false,
                menu: {
                    showSeparator: false,
                    bodyCls: "no-icons",
                    width: 100,
                    items: [{
                        text: me.aboveText,
                        listeners: {
                            click: function (item) {
                                if (me.api) {
                                    me.api.addRowAbove();
                                }
                            }
                        }
                    },
                    {
                        text: me.belowText,
                        listeners: {
                            click: function (item) {
                                if (me.api) {
                                    me.api.addRowBelow();
                                }
                            }
                        }
                    }],
                    plugins: [{
                        ptype: "menuexpand"
                    }]
                }
            },
            {
                text: me.insertColumnText,
                hideOnClick: false,
                menu: {
                    showSeparator: false,
                    bodyCls: "no-icons",
                    width: 100,
                    items: [{
                        text: me.insertColumnLeftText,
                        listeners: {
                            click: function (item) {
                                if (me.api) {
                                    me.api.addColumnLeft();
                                }
                            }
                        }
                    },
                    {
                        text: me.insertColumnRightText,
                        listeners: {
                            click: function (item) {
                                if (me.api) {
                                    me.api.addColumnRight();
                                }
                            }
                        }
                    }],
                    plugins: [{
                        ptype: "menuexpand"
                    }]
                }
            },
            {
                text: me.deleteText,
                hideOnClick: false,
                menu: {
                    showSeparator: false,
                    bodyCls: "no-icons",
                    width: 100,
                    items: [{
                        text: me.rowText,
                        listeners: {
                            click: function (item) {
                                if (me.api) {
                                    me.api.remRow();
                                }
                            }
                        }
                    },
                    {
                        text: me.columnText,
                        listeners: {
                            click: function (item) {
                                if (me.api) {
                                    me.api.remColumn();
                                }
                            }
                        }
                    },
                    {
                        text: me.tableText,
                        listeners: {
                            click: function (item) {
                                if (me.api) {
                                    me.api.remTable();
                                }
                            }
                        }
                    }],
                    plugins: [{
                        ptype: "menuexpand"
                    }]
                }
            },
            {
                xtype: "menuseparator"
            },
            mnuTableMerge, mnuTableSplit, {
                xtype: "menuseparator"
            },
            menuTableCellAlign, {
                xtype: "menuseparator"
            },
            menuTableAdvanced, menuHyperlinkSeparator, menuAddCommentTable, menuAddHyperlinkTable, menuHyperlinkTable],
            plugins: [{
                ptype: "menuexpand"
            }]
        });
        me.pictureMenu = Ext.widget("menu", {
            showSeparator: false,
            bodyCls: "no-icons",
            listeners: {
                hide: function (cnt, eOpt) {
                    me.fireEvent("editcomplete", me);
                    me.currentMenu = null;
                }
            },
            initMenu: function (value) {
                if (me.api) {
                    mnuUnGroupImg.setDisabled(!me.api.canUnGroup());
                    mnuGroupImg.setDisabled(!me.api.canGroup());
                }
                var imgdisabled = (value.imgProps !== undefined && value.imgProps.locked);
                var shapedisabled = (value.shapeProps !== undefined && value.shapeProps.locked);
                var chartdisabled = (value.chartProps !== undefined && value.chartProps.locked);
                var disabled = imgdisabled || shapedisabled || chartdisabled || (value.slideProps !== undefined && value.slideProps.locked);
                menuImgOriginalSize.setVisible(value.shapeProps === undefined && value.chartProps === undefined);
                if (menuImgOriginalSize.isVisible()) {
                    menuImgOriginalSize.setDisabled(disabled || value.imgProps.value.get_ImageUrl() === null || value.imgProps.value.get_ImageUrl() === undefined);
                }
                menuImageAdvanced.setVisible(value.shapeProps === undefined && value.chartProps === undefined);
                menuShapeAdvanced.setVisible(value.imgProps === undefined && value.chartProps === undefined);
                menuImgShapeSeparator.setVisible(menuImageAdvanced.isVisible() || menuShapeAdvanced.isVisible());
                menuAddCommentImg.setVisible(me.api.can_AddQuotedComment() !== false && me.mode.canCoAuthoring);
                menuCommentSeparatorImg.setVisible(menuAddCommentImg.isVisible());
                menuAddCommentImg.setDisabled(disabled);
                menuImgShapeArrange.setDisabled(disabled);
                menuImgShapeAlign.setDisabled(disabled);
                menuImageAdvanced.setDisabled(disabled);
                menuShapeAdvanced.setDisabled(disabled);
            },
            items: [menuImgShapeArrange, menuImgShapeAlign, menuImgShapeSeparator, menuImgOriginalSize, menuImageAdvanced, menuShapeAdvanced, menuCommentSeparatorImg, menuAddCommentImg],
            plugins: [{
                ptype: "menuexpand"
            }]
        });
    },
    insertColumnLeftText: "To Left",
    insertColumnRightText: "To Right",
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
    vertAlignText: "Vertical Alignment",
    advancedParagraphText: "Text Advanced Settings"
});