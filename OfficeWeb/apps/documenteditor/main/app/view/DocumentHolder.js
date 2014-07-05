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
 var c_pageNumPosition = {
    PAGE_NUM_POSITION_TOP: 1,
    PAGE_NUM_POSITION_BOTTOM: 2,
    PAGE_NUM_POSITION_RIGHT: 0,
    PAGE_NUM_POSITION_LEFT: 1,
    PAGE_NUM_POSITION_CENTER: 2
};
var c_paragraphLinerule = {
    LINERULE_LEAST: 0,
    LINERULE_AUTO: 1,
    LINERULE_EXACT: 2
};
var c_tableWrap = {
    TABLE_WRAP_NONE: 0,
    TABLE_WRAP_PARALLEL: 1
};
var c_tableAlign = {
    TABLE_ALIGN_LEFT: 0,
    TABLE_ALIGN_CENTER: 1,
    TABLE_ALIGN_RIGHT: 2
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
Ext.define("DE.view.DocumentHolder", {
    extend: "Ext.container.Container",
    alias: "widget.dedocumentholder",
    cls: "de-documentholder",
    requires: ["Ext.String", "Ext.util.Cookies", "Common.component.util.LanguageName"],
    uses: ["Ext.menu.Menu", "Ext.menu.Manager", "DE.view.InsertTableDialog", "DE.view.ImageSettingsAdvanced", "DE.view.TableSettingsAdvanced", "DE.view.ParagraphSettingsAdvanced", "DE.view.DropcapSettingsAdvanced", "DE.view.HyperlinkSettingsDialog", "Common.plugin.MenuExpand"],
    layout: "fit",
    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    initComponent: function () {
        var me = this;
        me.addEvents("editcomplete");
        var usersStore = Ext.getStore("Common.store.Users");
        var value = window.localStorage.getItem("de-settings-livecomment");
        me.isLiveCommenting = !(value !== null && parseInt(value) == 0);
        me.html = "";
        me.usertips = [];
        me._TtHeight = 20;
        me._currentSpellObj = undefined;
        me._currLang = {};
        var showPopupMenu = function (menu, value, event, docElement, eOpts) {
            if (Ext.isDefined(menu)) {
                Ext.menu.Manager.hideAll();
                var showPoint = [event.get_X(), event.get_Y()];
                var XY = me.getEl().getXY();
                showPoint[1] += (XY[1] + 1);
                showPoint[0] += (XY[0] + 1);
                if (Ext.isFunction(menu.initMenu)) {
                    menu.initMenu(value);
                }
                me.currentMenu = menu;
                menu.layout.autoSize = true;
                menu.showAt(showPoint);
            }
        };
        var showObjectMenu = function (event, docElement, eOpts) {
            if (me.api && me.mode.isEdit) {
                var menu_props = {};
                var menu_to_show = this.textMenu;
                var noobject = true;
                var selectedElements = me.api.getSelectedElements();
                if (selectedElements && Ext.isArray(selectedElements)) {
                    for (var i = 0; i < selectedElements.length; i++) {
                        var elType = selectedElements[i].get_ObjectType();
                        var elValue = selectedElements[i].get_ObjectValue();
                        if (c_oAscTypeSelectElement.Image == elType) {
                            menu_to_show = this.pictureMenu;
                            menu_props.imgProps = {};
                            menu_props.imgProps.value = elValue;
                            menu_props.imgProps.locked = (elValue) ? elValue.get_Locked() : false;
                            noobject = false;
                            if (elValue.get_ShapeProperties() === undefined || elValue.get_ShapeProperties() === null) {
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
                                    if (menu_props.imgProps && menu_props.imgProps.value && menu_props.imgProps.value.get_ShapeProperties() && menu_props.tableProps === undefined) {
                                        menu_to_show = this.textMenu;
                                    }
                                    noobject = false;
                                } else {
                                    if (c_oAscTypeSelectElement.Hyperlink == elType) {
                                        menu_props.hyperProps = {};
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
            if (event.get_Type() == 0) {
                showObjectMenu.call(this, event);
            } else {
                showPopupMenu.call(this, me.hdrMenu, {
                    Header: event.is_Header(),
                    PageNum: event.get_PageNum()
                },
                event);
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
            me._XY = me.getEl().getXY();
            me._Height = me.getEl().getHeight();
            me._BodyWidth = Ext.getBody().getWidth();
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
                        if (el.localName == "canvas") {
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
            if (me._XY === undefined) {
                me._XY = me.getEl().getXY();
                me._Height = me.getEl().getHeight();
                me._BodyWidth = Ext.getBody().getWidth();
            }
            if (moveData) {
                var showPoint, ToolTip;
                if (moveData.get_Type() == 1) {
                    var hyperProps = moveData.get_Hyperlink();
                    var recalc = false;
                    if (hyperProps) {
                        screenTip.isHidden = false;
                        ToolTip = (Ext.isEmpty(hyperProps.get_ToolTip())) ? hyperProps.get_Value() : hyperProps.get_ToolTip();
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
                    }
                }
            }
        };
        var onDialogAddHyperlink = function () {
            var win, props, text;
            if (me.api) {
                text = me.api.can_AddHyperlink();
                if (text !== false) {
                    win = Ext.create("DE.view.HyperlinkSettingsDialog");
                    props = new CHyperlinkProperty();
                    props.put_Text(text);
                    win.setSettings(props);
                } else {
                    var selectedElements = me.api.getSelectedElements();
                    if (selectedElements && Ext.isArray(selectedElements)) {
                        for (var i = 0; i < selectedElements.length; i++) {
                            if (selectedElements[i].get_ObjectType() == c_oAscTypeSelectElement.Hyperlink) {
                                props = selectedElements[i].get_ObjectValue();
                            }
                        }
                    }
                    if (props) {
                        win = Ext.create("DE.view.HyperlinkSettingsDialog");
                        win.setSettings(props);
                    }
                }
            }
            if (win) {
                win.on({
                    "onmodalresult": function (mr) {
                        if (mr == 1) {
                            props = win.getSettings();
                            (text !== false) ? me.api.add_Hyperlink(props) : me.api.change_Hyperlink(props);
                        }
                    },
                    "close": function (o) {
                        me.fireEvent("editcomplete", me);
                    }
                });
                win.show();
            }
        };
        var onCoAuthoringDisconnect = function () {
            me.mode.isEdit = false;
        };
        var onTextLanguage = function (langid) {
            me._currLang.id = langid;
        };
        this.changeLanguageMenu = function (menu) {
            if (me._currLang.id === null || me._currLang.id === undefined) {
                for (var i = 0; i < menu.items.length; i++) {
                    menu.items.items[i].setChecked(false);
                }
                menu.currentCheckedItem = undefined;
            } else {
                for (var i = 0; i < menu.items.length; i++) {
                    if (menu.items.items[i].langid === me._currLang.id) {
                        menu.currentCheckedItem = menu.items.items[i];
                        if (!menu.items.items[i].checked) {
                            menu.items.items[i].setChecked(true);
                        }
                        break;
                    } else {
                        if (menu.items.items[i].checked) {
                            menu.items.items[i].setChecked(false);
                        }
                    }
                }
            }
        };
        var onSpellCheckVariantsFound = function () {
            var selectedElements = me.api.getSelectedElements(true);
            var props;
            if (selectedElements && Ext.isArray(selectedElements)) {
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
                    var y = me.textMenu.el.getY();
                    var h = me.textMenu.getHeight();
                    var maxHeight = Ext.Element.getViewportHeight();
                    if (y + h > maxHeight) {
                        y = maxHeight - h;
                    }
                    me.textMenu.el.setY(y);
                }
            }
        };
        this.addWordVariants = function (isParagraph) {
            if (isParagraph === undefined) {
                isParagraph = me.textMenu.isVisible();
            }
            me.clearWordVariants(isParagraph);
            var moreMenu = (isParagraph) ? me.menuSpellMorePara : me.menuSpellMoreTable;
            var spellMenu = (isParagraph) ? me.menuSpellPara : me.menuSpellTable;
            var arr = [];
            var arrMore = [];
            var variants = me._currentSpellObj.get_Variants();
            if (variants.length > 0) {
                moreMenu.setVisible(variants.length > 5);
                for (var i = 0; i < variants.length; i++) {
                    var mnu = Ext.widget("menuitem", {
                        text: variants[i],
                        spellword: true,
                        listeners: {
                            click: function (item, e, eOpt) {
                                if (me.api) {
                                    me.api.asc_replaceMisspelledWord(item.text, me._currentSpellObj);
                                    me.fireEvent("editcomplete", me);
                                }
                            }
                        }
                    });
                    (i < 5) ? arr.push(mnu) : arrMore.push(mnu);
                }
                if (arr.length > 0) {
                    (isParagraph) ? me.textMenu.insert(0, arr) : me.menuSpellCheckTable.menu.insert(0, arr);
                }
                if (arrMore.length > 0) {
                    moreMenu.menu.insert(0, arrMore);
                }
                spellMenu.setVisible(false);
            } else {
                moreMenu.setVisible(false);
                spellMenu.setVisible(true);
                spellMenu.setText(me.noSpellVariantsText);
            }
        };
        this.clearWordVariants = function (isParagraph) {
            var spellMenu = (isParagraph) ? me.textMenu : me.menuSpellCheckTable.menu;
            for (var i = 0; i < spellMenu.items.length; i++) {
                if (spellMenu.items.items[i].spellword) {
                    if (spellMenu.checkeditem == spellMenu.items.items[i]) {
                        spellMenu.checkeditem = undefined;
                        spellMenu.activeItem = undefined;
                    }
                    spellMenu.remove(spellMenu.items.items[i], true);
                    i--;
                }
            } (isParagraph) ? me.menuSpellMorePara.menu.removeAll() : me.menuSpellMoreTable.menu.removeAll();
            me.menuSpellMorePara.menu.checkeditem = undefined;
            me.menuSpellMorePara.menu.activeItem = undefined;
            me.menuSpellMoreTable.menu.checkeditem = undefined;
            me.menuSpellMoreTable.menu.activeItem = undefined;
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
        this.checkCanHotKey = function () {
            var winElements = Ext.getDoc().query(".x-window");
            for (var i = 0; i < winElements.length; i++) {
                var cmp = Ext.getCmp(winElements[i].id);
                if (cmp && cmp.isVisible() && cmp.modal) {
                    return false;
                }
            }
            return true;
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
                this.api.asc_registerCallback("asc_onHyperlinkClick", Ext.bind(onHyperlinkClick, this));
                this.api.asc_registerCallback("asc_onMouseMove", Ext.bind(onMouseMove, this));
                if (this.mode.isEdit === true) {
                    this.api.asc_registerCallback("asc_onImgWrapStyleChanged", Ext.bind(this.onImgWrapStyleChanged, this));
                    this.api.asc_registerCallback("asc_onDialogAddHyperlink", onDialogAddHyperlink);
                    this.api.asc_registerCallback("asc_onSpellCheckVariantsFound", Ext.bind(onSpellCheckVariantsFound, this));
                }
                this.api.asc_registerCallback("asc_onСoAuthoringDisconnect", Ext.bind(onCoAuthoringDisconnect, this));
                this.api.asc_registerCallback("asc_onTextLanguage", Ext.bind(onTextLanguage, this));
            }
            return this;
        };
        this.mode = {};
        this.setMode = function (m) {
            if (this.api && m.isEdit) {
                this.api.asc_registerCallback("asc_onImgWrapStyleChanged", Ext.bind(this.onImgWrapStyleChanged, this));
                this.api.asc_registerCallback("asc_onDialogAddHyperlink", onDialogAddHyperlink);
                this.api.asc_registerCallback("asc_onSpellCheckVariantsFound", Ext.bind(onSpellCheckVariantsFound, this));
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
    onImgWrapStyleChanged: function (type) {
        switch (type) {
        case c_oAscWrapStyle2.Inline:
            this.menuImageWrap.menu.items.items[0].setChecked(true);
            break;
        case c_oAscWrapStyle2.Square:
            this.menuImageWrap.menu.items.items[1].setChecked(true);
            break;
        case c_oAscWrapStyle2.Tight:
            this.menuImageWrap.menu.items.items[2].setChecked(true);
            break;
        case c_oAscWrapStyle2.Through:
            this.menuImageWrap.menu.items.items[3].setChecked(true);
            break;
        case c_oAscWrapStyle2.TopAndBottom:
            this.menuImageWrap.menu.items.items[4].setChecked(true);
            break;
        case c_oAscWrapStyle2.Behind:
            this.menuImageWrap.menu.items.items[6].setChecked(true);
            break;
        case c_oAscWrapStyle2.InFront:
            this.menuImageWrap.menu.items.items[5].setChecked(true);
            break;
        }
    },
    _applyTableWrap: function (wrap, align) {
        var selectedElements = this.api.getSelectedElements();
        if (selectedElements && Ext.isArray(selectedElements)) {
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
            if (selectedElements && Ext.isArray(selectedElements)) {
                for (var i = selectedElements.length - 1; i >= 0; i--) {
                    var elType, elValue;
                    elType = selectedElements[i].get_ObjectType();
                    elValue = selectedElements[i].get_ObjectValue();
                    if (c_oAscTypeSelectElement.Paragraph == elType) {
                        var paragraph_config = {
                            tableStylerRows: 2,
                            tableStylerColumns: 1
                        };
                        win = Ext.create("DE.view.ParagraphSettingsAdvanced", paragraph_config);
                        win.updateMetricUnit();
                        win.setSettings({
                            paragraphProps: elValue,
                            borderProps: me.borderAdvancedProps,
                            api: me.api,
                            colorProps: [me.effectcolors, me.standartcolors]
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
                        me.borderAdvancedProps = s.borderProps;
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
    advancedFrameClick: function (item, e, eOpt) {
        var win, me = this;
        if (me.api) {
            var selectedElements = me.api.getSelectedElements();
            if (selectedElements && Ext.isArray(selectedElements)) {
                for (var i = selectedElements.length - 1; i >= 0; i--) {
                    var elType, elValue;
                    elType = selectedElements[i].get_ObjectType();
                    elValue = selectedElements[i].get_ObjectValue();
                    if (c_oAscTypeSelectElement.Paragraph == elType) {
                        var paragraph_config = {
                            tableStylerRows: 2,
                            tableStylerColumns: 1
                        };
                        win = Ext.create("DE.view.DropcapSettingsAdvanced", paragraph_config);
                        win.updateMetricUnit();
                        win.setSettings({
                            paragraphProps: elValue,
                            borderProps: me.borderAdvancedProps,
                            api: me.api,
                            colorProps: [me.effectcolors, me.standartcolors],
                            isFrame: true
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
                        me.borderAdvancedProps = s.borderProps;
                        if (s.paragraphProps && s.paragraphProps.get_Wrap() === c_oAscFrameWrap.None) {
                            me.api.removeDropcap(false);
                        } else {
                            me.api.put_FramePr(s.paragraphProps);
                        }
                    }
                },
                "close": function (o) {
                    me.fireEvent("editcomplete", me);
                }
            });
            win.show();
        }
    },
    editHyperlink: function (item, e, eOpt) {
        var win, me = this;
        if (me.api) {
            win = Ext.create("DE.view.HyperlinkSettingsDialog");
            win.setSettings(item.hyperProps.value);
        }
        if (win) {
            win.on({
                "onmodalresult": function (mr) {
                    if (mr == 1) {
                        me.api.change_Hyperlink(win.getSettings());
                    }
                },
                "close": function (o) {
                    me.fireEvent("editcomplete", me);
                }
            });
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
                if (!me.isLiveCommenting) {
                    var mainMenuCmp = Ext.getCmp("view-main-menu");
                    mainMenuCmp && mainMenuCmp.selectMenu("menuComments");
                }
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
    addHyperlink: function (item, e, eOpt) {
        var win, me = this;
        if (me.api) {
            win = Ext.create("DE.view.HyperlinkSettingsDialog");
            win.setSettings(item.hyperProps.value);
        }
        if (win) {
            win.on({
                "onmodalresult": function (mr) {
                    if (mr == 1) {
                        me.api.add_Hyperlink(win.getSettings());
                    }
                },
                "close": function (o) {
                    me.fireEvent("editcomplete", me);
                }
            });
            win.show();
        }
    },
    SendThemeColors: function (effectcolors, standartcolors) {
        this.effectcolors = effectcolors;
        if (standartcolors && standartcolors.length > 0) {
            this.standartcolors = standartcolors;
        }
    },
    createDelayedElements: function () {
        var me = this;
        var menuImageAlign = Ext.widget("menuitem", {
            text: me.textAlign,
            hideOnClick: false,
            menu: {
                showSeparator: false,
                defaults: {
                    cls: "toolbar-menu-icon-item",
                    listeners: {
                        click: function (item, e) {
                            if (me.api) {
                                var properties = new CImgProperty();
                                if (item.halign !== undefined) {
                                    properties.put_PositionH(new CImagePositionH());
                                    properties.get_PositionH().put_UseAlign(true);
                                    properties.get_PositionH().put_Align(item.halign);
                                    properties.get_PositionH().put_RelativeFrom(c_oAscRelativeFromH.Margin);
                                } else {
                                    properties.put_PositionV(new CImagePositionV());
                                    properties.get_PositionV().put_UseAlign(true);
                                    properties.get_PositionV().put_Align(item.valign);
                                    properties.get_PositionV().put_RelativeFrom(c_oAscRelativeFromV.Margin);
                                }
                                me.api.ImgApply(properties);
                            }
                            me.fireEvent("editcomplete", me);
                        },
                        scope: me
                    }
                },
                items: [{
                    iconCls: "mnu-icon-item mnu-img-align-left",
                    text: this.textShapeAlignLeft,
                    halign: c_oAscAlignH.Left
                },
                {
                    iconCls: "mnu-icon-item mnu-img-align-center",
                    text: this.textShapeAlignCenter,
                    halign: c_oAscAlignH.Center
                },
                {
                    iconCls: "mnu-icon-item mnu-img-align-right",
                    text: this.textShapeAlignRight,
                    halign: c_oAscAlignH.Right
                },
                {
                    iconCls: "mnu-icon-item mnu-align-top",
                    text: this.textShapeAlignTop,
                    valign: c_oAscAlignV.Top
                },
                {
                    iconCls: "mnu-icon-item mnu-align-middle",
                    text: this.textShapeAlignMiddle,
                    valign: c_oAscAlignV.Center
                },
                {
                    iconCls: "mnu-icon-item mnu-align-bottom",
                    text: this.textShapeAlignBottom,
                    valign: c_oAscAlignV.Bottom
                }],
                plugins: [{
                    ptype: "menuexpand"
                }]
            }
        });
        var mnuGroup = Ext.create("Ext.menu.Item", {
            iconCls: "mnu-icon-item mnu-arrange-group",
            text: this.txtGroup,
            listeners: {
                click: function (item, e) {
                    if (me.api) {
                        var properties = new CImgProperty();
                        properties.put_Group(1);
                        me.api.ImgApply(properties);
                    }
                    me.fireEvent("editcomplete", this);
                },
                scope: me
            }
        });
        var mnuUnGroup = Ext.create("Ext.menu.Item", {
            iconCls: "mnu-icon-item mnu-arrange-ungroup",
            text: this.txtUngroup,
            listeners: {
                click: function (item, e) {
                    if (me.api) {
                        var properties = new CImgProperty();
                        properties.put_Group(-1);
                        me.api.ImgApply(properties);
                    }
                    me.fireEvent("editcomplete", this);
                },
                scope: me
            }
        });
        var menuImageArrange = Ext.widget("menuitem", {
            text: me.textArrange,
            hideOnClick: false,
            menu: {
                showSeparator: false,
                defaults: {
                    cls: "toolbar-menu-icon-item",
                    listeners: {
                        click: function (item, e) {
                            if (me.api) {
                                var properties = new CImgProperty();
                                properties.put_ChangeLevel(item.levelType);
                                me.api.ImgApply(properties);
                            }
                            me.fireEvent("editcomplete", me);
                        },
                        scope: me
                    }
                },
                items: [{
                    iconCls: "mnu-icon-item mnu-arrange-front",
                    text: this.textArrangeFront,
                    levelType: c_oAscChangeLevel.BringToFront
                },
                {
                    iconCls: "mnu-icon-item mnu-arrange-back",
                    text: this.textArrangeBack,
                    levelType: c_oAscChangeLevel.SendToBack
                },
                {
                    iconCls: "mnu-icon-item mnu-arrange-forward",
                    text: this.textArrangeForward,
                    levelType: c_oAscChangeLevel.BringForward
                },
                {
                    iconCls: "mnu-icon-item mnu-arrange-backward",
                    text: this.textArrangeBackward,
                    levelType: c_oAscChangeLevel.BringBackward
                },
                {
                    xtype: "menuseparator"
                },
                mnuGroup, mnuUnGroup],
                plugins: [{
                    ptype: "menuexpand"
                }]
            }
        });
        var menuWrapPolygon = Ext.widget("menuitem", {
            text: me.textEditWrapBoundary,
            cls: "no-icon-wrap-item",
            listeners: {
                click: function (item, e) {
                    if (me.api) {
                        me.api.StartChangeWrapPolygon();
                    }
                    me.fireEvent("editcomplete", me);
                },
                scope: me
            }
        });
        this.menuImageWrap = Ext.widget("menuitem", {
            text: me.textWrap,
            hideOnClick: false,
            menu: {
                showSeparator: false,
                defaults: {
                    cls: "toolbar-menu-icon-item",
                    group: "popuppicturewrapping",
                    checked: false,
                    listeners: {
                        click: function (item, e) {
                            if (me.api) {
                                var properties = new CImgProperty();
                                properties.put_WrappingStyle(item.wrapType);
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
                        },
                        scope: me
                    }
                },
                items: [{
                    iconCls: "mnu-icon-item mnu-wrap-inline",
                    text: this.txtInline,
                    wrapType: c_oAscWrapStyle2.Inline,
                    checked: true
                },
                {
                    iconCls: "mnu-icon-item mnu-wrap-square",
                    text: this.txtSquare,
                    wrapType: c_oAscWrapStyle2.Square
                },
                {
                    iconCls: "mnu-icon-item mnu-wrap-tight",
                    text: this.txtTight,
                    wrapType: c_oAscWrapStyle2.Tight
                },
                {
                    iconCls: "mnu-icon-item mnu-wrap-through",
                    text: this.txtThrough,
                    wrapType: c_oAscWrapStyle2.Through
                },
                {
                    iconCls: "mnu-icon-item mnu-wrap-topAndBottom",
                    text: this.txtTopAndBottom,
                    wrapType: c_oAscWrapStyle2.TopAndBottom
                },
                {
                    iconCls: "mnu-icon-item mnu-wrap-inFront",
                    text: this.txtInFront,
                    wrapType: c_oAscWrapStyle2.InFront
                },
                {
                    iconCls: "mnu-icon-item mnu-wrap-behind",
                    text: this.txtBehind,
                    wrapType: c_oAscWrapStyle2.Behind
                },
                {
                    xtype: "menuseparator"
                },
                menuWrapPolygon],
                plugins: [{
                    ptype: "menuexpand"
                }]
            }
        });
        var menuImageAdvanced = Ext.widget("menuitem", {
            text: me.advancedText,
            listeners: {
                click: function (item, e, eOpt) {
                    var win;
                    var elType, elValue;
                    if (me.api) {
                        var selectedElements = me.api.getSelectedElements();
                        if (selectedElements && Ext.isArray(selectedElements)) {
                            for (var i = selectedElements.length - 1; i >= 0; i--) {
                                elType = selectedElements[i].get_ObjectType();
                                elValue = selectedElements[i].get_ObjectValue();
                                if (c_oAscTypeSelectElement.Image == elType) {
                                    win = Ext.create("DE.view.ImageSettingsAdvanced", {});
                                    win.updateMetricUnit();
                                    win.setSettings(elValue);
                                    break;
                                }
                            }
                        }
                    }
                    if (win) {
                        var imgsize = me.api.GetSectionInfo();
                        win.setSizeMax({
                            width: imgsize.get_PageWidth() - (imgsize.get_MarginLeft() + imgsize.get_MarginRight()),
                            height: imgsize.get_PageHeight() - (imgsize.get_MarginTop() + imgsize.get_MarginBottom())
                        });
                        if (!elValue.get_ShapeProperties() && !me.menuOriginalSize.isDisabled()) {
                            imgsize = me.api.get_OriginalSizeImage();
                            if (imgsize) {
                                win.setSizeOriginal({
                                    width: imgsize.get_ImageWidth(),
                                    height: imgsize.get_ImageHeight()
                                });
                            }
                        }
                        win.on({
                            "onmodalresult": function (o, mr, s) {
                                if (mr == 1 && s) {
                                    me.api.ImgApply(s);
                                }
                            },
                            "close": function (o) {
                                me.fireEvent("editcomplete", me);
                            }
                        });
                        win.show();
                    }
                }
            }
        });
        this.menuOriginalSize = Ext.widget("menuitem", {
            text: me.originalSizeText,
            listeners: {
                click: function (item, e, eOpt) {
                    if (me.api) {
                        var originalImageSize = me.api.get_OriginalSizeImage();
                        var properties = new CImgProperty();
                        properties.put_Width(originalImageSize.get_ImageWidth());
                        properties.put_Height(originalImageSize.get_ImageHeight());
                        me.api.ImgApply(properties);
                        me.fireEvent("editcomplete", this);
                    }
                }
            }
        });
        this.pictureMenu = Ext.widget("menu", {
            showSeparator: false,
            bodyCls: "no-icons",
            listeners: {
                hide: function (cnt, eOpt) {
                    me.fireEvent("editcomplete", me);
                    me.currentMenu = null;
                }
            },
            initMenu: function (value) {
                if (value.imgProps === undefined) {
                    return;
                }
                var notflow = !value.imgProps.value.get_CanBeFlow();
                var wrapping = value.imgProps.value.get_WrappingStyle();
                me.menuImageWrap._originalProps = value.imgProps.value;
                if (notflow) {
                    me.menuImageWrap.menu.items.items[0].setChecked(true);
                } else {
                    switch (wrapping) {
                    case c_oAscWrapStyle2.Inline:
                        me.menuImageWrap.menu.items.items[0].setChecked(true);
                        break;
                    case c_oAscWrapStyle2.Square:
                        me.menuImageWrap.menu.items.items[1].setChecked(true);
                        break;
                    case c_oAscWrapStyle2.Tight:
                        me.menuImageWrap.menu.items.items[2].setChecked(true);
                        break;
                    case c_oAscWrapStyle2.Through:
                        me.menuImageWrap.menu.items.items[3].setChecked(true);
                        break;
                    case c_oAscWrapStyle2.TopAndBottom:
                        me.menuImageWrap.menu.items.items[4].setChecked(true);
                        break;
                    case c_oAscWrapStyle2.Behind:
                        me.menuImageWrap.menu.items.items[6].setChecked(true);
                        break;
                    case c_oAscWrapStyle2.InFront:
                        me.menuImageWrap.menu.items.items[5].setChecked(true);
                        break;
                    default:
                        for (var i = 0; i < 6; i++) {
                            me.menuImageWrap.menu.items.items[i].setChecked(false);
                        }
                        break;
                    }
                }
                for (var i = 1; i < me.menuImageWrap.menu.items.length; i++) {
                    me.menuImageWrap.menu.items.items[i].setDisabled(notflow);
                }
                me.menuOriginalSize.setVisible(value.imgProps.value.get_ShapeProperties() === null);
                me.pictureMenu.items.items[3].setVisible(me.menuOriginalSize.isVisible());
                for (var i = 0; i < me.pictureMenu.items.length; i++) {
                    me.pictureMenu.items.items[i].setDisabled(value.imgProps.locked || (value.headerProps !== undefined && value.headerProps.locked));
                }
                me.menuImageWrap.setDisabled(me.menuImageWrap.isDisabled() || value.imgProps.value.get_FromGroup());
                me.menuOriginalSize.setDisabled(me.menuOriginalSize.isDisabled() || value.imgProps.value.get_ImageUrl() === null || value.imgProps.value.get_ImageUrl() === undefined);
                menuImageArrange.setDisabled(menuImageArrange.isDisabled() || (wrapping == c_oAscWrapStyle2.Inline));
                menuImageAlign.setDisabled(menuImageAlign.isDisabled() || (wrapping == c_oAscWrapStyle2.Inline));
                if (me.api) {
                    mnuUnGroup.setDisabled(!me.api.CanUnGroup());
                    mnuGroup.setDisabled(!me.api.CanGroup());
                    menuWrapPolygon.setDisabled(!me.api.CanChangeWrapPolygon());
                }
            },
            items: [menuImageArrange, menuImageAlign, me.menuImageWrap, {
                xtype: "menuseparator"
            },
            me.menuOriginalSize, {
                xtype: "menuseparator"
            },
            menuImageAdvanced],
            plugins: [{
                ptype: "menuexpand"
            }]
        });
        var _btnAlignLeft = Ext.create("Ext.Button", {
            cls: "asc-right-panel-btn btn-table-align-left",
            posId: c_tableAlign.TABLE_ALIGN_LEFT,
            margin: "2px 2px 2px 0",
            text: "",
            tooltip: this.leftText,
            enableToggle: true,
            allowDepress: false,
            pressed: true,
            toggleGroup: "popuptablealign",
            listeners: {
                afterrender: function (btn, eOpts) {
                    if (btn.pressed) {
                        btn.toggle(true, true);
                    }
                },
                click: function (item, e, eOpt) {
                    if (item.pressed) {
                        me._applyTableWrap(c_tableWrap.TABLE_WRAP_NONE, c_tableAlign.TABLE_ALIGN_LEFT);
                    }
                    Ext.menu.Manager.hideAll();
                }
            }
        });
        var _btnAlignCenter = Ext.create("Ext.Button", {
            cls: "asc-right-panel-btn btn-table-align-center",
            posId: c_tableAlign.TABLE_ALIGN_CENTER,
            margin: "2px",
            text: "",
            tooltip: this.centerText,
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "popuptablealign",
            listeners: {
                afterrender: function (btn, eOpts) {
                    if (btn.pressed) {
                        btn.toggle(true, true);
                    }
                },
                click: function (item, e, eOpt) {
                    if (item.pressed) {
                        me._applyTableWrap(c_tableWrap.TABLE_WRAP_NONE, c_tableAlign.TABLE_ALIGN_CENTER);
                    }
                    Ext.menu.Manager.hideAll();
                }
            }
        });
        var _btnAlignRight = Ext.create("Ext.Button", {
            cls: "asc-right-panel-btn btn-table-align-right",
            posId: c_tableAlign.TABLE_ALIGN_RIGHT,
            margin: "2px",
            text: "",
            tooltip: this.rightText,
            enableToggle: true,
            allowDepress: false,
            toggleGroup: "popuptablealign",
            listeners: {
                afterrender: function (btn, eOpts) {
                    if (btn.pressed) {
                        btn.toggle(true, true);
                    }
                },
                click: function (item, e, eOpt) {
                    if (item.pressed) {
                        me._applyTableWrap(c_tableWrap.TABLE_WRAP_NONE, c_tableAlign.TABLE_ALIGN_RIGHT);
                    }
                    Ext.menu.Manager.hideAll();
                }
            }
        });
        var menuTableWrapInline = Ext.widget("menucheckitem", {
            text: me.inlineText,
            group: "popuptablewrapping",
            listeners: {
                click: function (item, e, eOpt) {
                    if (_btnAlignLeft.pressed) {
                        me._applyTableWrap(c_tableWrap.TABLE_WRAP_NONE, c_tableAlign.TABLE_ALIGN_LEFT);
                    } else {
                        if (_btnAlignCenter.pressed) {
                            me._applyTableWrap(c_tableWrap.TABLE_WRAP_NONE, c_tableAlign.TABLE_ALIGN_CENTER);
                        } else {
                            me._applyTableWrap(c_tableWrap.TABLE_WRAP_NONE, c_tableAlign.TABLE_ALIGN_RIGHT);
                        }
                    }
                }
            },
            menu: {
                showSeparator: false,
                items: [{
                    xtype: "container",
                    style: "font-size:11px;font-weight:bold;padding: 8px 0 0 0;",
                    items: [{
                        xtype: "label",
                        margin: "6px 0 0 10px",
                        text: me.alignmentText
                    },
                    {
                        xtype: "container",
                        height: 50,
                        width: 160,
                        layout: "hbox",
                        align: "middle",
                        padding: "0 10",
                        items: [_btnAlignLeft, {
                            xtype: "tbspacer",
                            width: 3
                        },
                        _btnAlignCenter, {
                            xtype: "tbspacer",
                            width: 3
                        },
                        _btnAlignRight]
                    }]
                }]
            }
        });
        var menuTableWrapFlow = Ext.widget("menucheckitem", {
            text: me.flowoverText,
            group: "popuptablewrapping",
            checked: true,
            listeners: {
                click: function (item, e, eOpt) {
                    me._applyTableWrap(c_tableWrap.TABLE_WRAP_PARALLEL);
                }
            }
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
                        var win = Ext.create("DE.view.InsertTableDialog", {
                            labelTitle: this.splitCellTitleText
                        });
                        win.on({
                            "onmodalresult": function (o, mr, s) {
                                if (mr) {
                                    me.api.SplitCell(s[0], s[1]);
                                }
                            },
                            "close": function (o) {
                                me.fireEvent("editcomplete", me);
                            }
                        });
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
                                    var table_config = {
                                        tableStylerRows: (elValue.get_CellBorders().get_InsideH() === null && elValue.get_CellSelect() == true) ? 1 : 2,
                                        tableStylerColumns: (elValue.get_CellBorders().get_InsideV() === null && elValue.get_CellSelect() == true) ? 1 : 2
                                    };
                                    win = Ext.create("DE.view.TableSettingsAdvanced", table_config);
                                    win.updateMetricUnit();
                                    win.setSettings({
                                        tableProps: elValue,
                                        borderProps: me.borderAdvancedProps,
                                        colorProps: [me.effectcolors, me.standartcolors]
                                    });
                                    break;
                                }
                            }
                        }
                    }
                    if (win) {
                        win.on({
                            "onmodalresult": function (o, mr, s) {
                                if (mr == 1) {
                                    var props = win.getSettings();
                                    me.borderAdvancedProps = props.borderProps;
                                    me.api.tblApply(props.tableProps);
                                }
                            },
                            "close": function (o) {
                                me.fireEvent("editcomplete", me);
                            }
                        });
                        win.show();
                    }
                }
            }
        });
        var menuParagraphKeepLinesInTable = Ext.widget("menucheckitem", {
            text: me.keepLinesText,
            checkedCls: "asc-menu-item-checked",
            uncheckedCls: "asc-menu-item-unchecked",
            listeners: {
                click: function (item, e, eOpt) {
                    me.api.put_KeepLines(item.checked);
                    Ext.menu.Manager.hideAll();
                }
            }
        });
        var menuParagraphAdvancedInTable = Ext.widget("menuitem", {
            text: me.advancedParagraphText,
            listeners: {
                click: this.advancedParagraphClick,
                scope: this
            }
        });
        var menuParagraphTable = Ext.widget("menuitem", {
            text: me.paragraphText,
            hideOnClick: false,
            menu: {
                showSeparator: false,
                bodyCls: "no-icons",
                items: [menuParagraphKeepLinesInTable, menuParagraphAdvancedInTable]
            }
        });
        var menuHyperlinkSeparator = Ext.widget("menuseparator");
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
                    me.api.remove_Hyperlink();
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
        var menuAddCommentTable = Ext.widget("menuitem", {
            text: me.addCommentText,
            listeners: {
                click: this.addComment,
                scope: this
            }
        });
        var menuAddHyperlinkTable = Ext.widget("menuitem", {
            text: me.hyperlinkText,
            listeners: {
                click: this.addHyperlink,
                scope: this
            }
        });
        me.menuSpellTable = Ext.widget("menuitem", {
            text: me.loadSpellText,
            hideOnClick: false,
            disabled: true
        });
        me.menuSpellMoreTable = Ext.widget("menuitem", {
            text: me.moreText,
            hideOnClick: false,
            menu: {
                showSeparator: false,
                bodyCls: "no-icons",
                items: [],
                plugins: [{
                    ptype: "menuexpand"
                }]
            }
        });
        me.langTableMenu = Ext.widget("menuitem", {
            text: me.langText,
            hideOnClick: false,
            menu: {
                showSeparator: false,
                bodyCls: "no-icons",
                maxHeight: 300,
                items: [],
                plugins: [{
                    ptype: "menuexpand"
                }],
                onShow: function () {
                    var self = this;
                    self.el.show();
                    self.callParent(arguments);
                    if (self.floating && self.constrain) {
                        var y = self.el.getY();
                        self.doConstrain();
                        var h = self.getHeight();
                        var maxHeight = Ext.Element.getViewportHeight();
                        if (y + h > maxHeight) {
                            y = maxHeight - h;
                        }
                        self.el.setY(y);
                        if (self.currentCheckedItem !== undefined) {
                            self.currentCheckedItem.getEl().scrollIntoView(self.layout.getRenderTarget());
                        }
                    }
                }
            }
        });
        var menuIgnoreSpellTable = Ext.widget("menuitem", {
            text: me.ignoreSpellText,
            listeners: {
                click: function (item, e, eOpt) {
                    me.api.asc_ignoreMisspelledWord(me._currentSpellObj, false);
                    me.fireEvent("editcomplete", me);
                }
            }
        });
        var menuIgnoreAllSpellTable = Ext.widget("menuitem", {
            text: me.ignoreAllSpellText,
            listeners: {
                click: function (item, e, eOpt) {
                    me.api.asc_ignoreMisspelledWord(me._currentSpellObj, true);
                    me.fireEvent("editcomplete", me);
                }
            }
        });
        var menuIgnoreSpellTableSeparator = Ext.widget("menuseparator");
        var menuSpellcheckTableSeparator = Ext.widget("menuseparator");
        me.menuSpellCheckTable = Ext.widget("menuitem", {
            text: me.spellcheckText,
            hideOnClick: false,
            menu: {
                showSeparator: false,
                bodyCls: "no-icons",
                items: [me.menuSpellTable, me.menuSpellMoreTable, menuIgnoreSpellTableSeparator, menuIgnoreSpellTable, menuIgnoreAllSpellTable, {
                    xtype: "menuseparator"
                },
                me.langTableMenu],
                plugins: [{
                    ptype: "menuexpand"
                }]
            }
        });
        this.tableMenu = Ext.widget("menu", {
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
                me.menuTableCellTop.setChecked(value.tableProps.value.get_CellsVAlign() == c_oAscVertAlignJc.Top);
                me.menuTableCellCenter.setChecked(value.tableProps.value.get_CellsVAlign() == c_oAscVertAlignJc.Center);
                me.menuTableCellBottom.setChecked(value.tableProps.value.get_CellsVAlign() == c_oAscVertAlignJc.Bottom);
                if (value.tableProps.value.get_TableWrap() == c_tableWrap.TABLE_WRAP_PARALLEL) {
                    menuTableWrapFlow.setChecked(true);
                } else {
                    menuTableWrapInline.setChecked(true);
                }
                var align = value.tableProps.value.get_TableAlignment();
                if (align !== null) {
                    if (!_btnAlignLeft.rendered || !_btnAlignCenter.rendered || !_btnAlignRight.rendered) {
                        _btnAlignLeft.pressed = (align == c_tableAlign.TABLE_ALIGN_LEFT);
                        _btnAlignCenter.pressed = (align == c_tableAlign.TABLE_ALIGN_CENTER);
                        _btnAlignRight.pressed = (align == c_tableAlign.TABLE_ALIGN_RIGHT);
                    } else {
                        _btnAlignLeft.toggle(align == c_tableAlign.TABLE_ALIGN_LEFT, true);
                        _btnAlignCenter.toggle(align == c_tableAlign.TABLE_ALIGN_CENTER, true);
                        _btnAlignRight.toggle(align == c_tableAlign.TABLE_ALIGN_RIGHT, true);
                    }
                }
                for (var i = 3; i < 6; i++) {
                    me.tableMenu.items.items[i].setDisabled(value.tableProps.locked || (value.headerProps !== undefined && value.headerProps.locked));
                }
                if (me.api) {
                    mnuTableMerge.setDisabled(value.tableProps.locked || (value.headerProps !== undefined && value.headerProps.locked) || !me.api.CheckBeforeMergeCells());
                    mnuTableSplit.setDisabled(value.tableProps.locked || (value.headerProps !== undefined && value.headerProps.locked) || !me.api.CheckBeforeSplitCells());
                }
                menuTableCellAlign.setDisabled(value.tableProps.locked || (value.headerProps !== undefined && value.headerProps.locked));
                menuTableWrapInline.setDisabled(value.tableProps.locked || (value.headerProps !== undefined && value.headerProps.locked));
                menuTableWrapFlow.setDisabled(value.tableProps.locked || (value.headerProps !== undefined && value.headerProps.locked) || !value.tableProps.value.get_CanBeFlow());
                menuTableAdvanced.setDisabled(value.tableProps.locked || (value.headerProps !== undefined && value.headerProps.locked));
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
                menuAddCommentTable.setVisible(me.api.can_AddQuotedComment() !== false && me.mode.canCoAuthoring);
                menuParagraphTable.setVisible(value.paraProps !== undefined);
                if (value.paraProps) {
                    menuParagraphKeepLinesInTable.setChecked(value.paraProps.value.get_KeepLines());
                }
                menuAddHyperlinkTable.setDisabled(value.paraProps.locked || (value.headerProps !== undefined && value.headerProps.locked));
                menuHyperlinkTable.setDisabled(value.paraProps.locked || (value.headerProps !== undefined && value.headerProps.locked));
                menuParagraphKeepLinesInTable.setDisabled(value.paraProps.locked || (value.headerProps !== undefined && value.headerProps.locked));
                menuParagraphAdvancedInTable.setDisabled(value.paraProps.locked || (value.headerProps !== undefined && value.headerProps.locked));
                me.menuSpellCheckTable.setVisible(value.spellProps !== undefined && value.spellProps.value.get_Checked() === false);
                menuSpellcheckTableSeparator.setVisible(value.spellProps !== undefined && value.spellProps.value.get_Checked() === false);
                if (value.spellProps !== undefined && value.spellProps.value.get_Checked() === false && value.spellProps.value.get_Variants() !== null && value.spellProps.value.get_Variants() !== undefined) {
                    me.addWordVariants(false);
                } else {
                    me.menuSpellTable.setText(me.loadSpellText);
                    me.clearWordVariants(false);
                    me.menuSpellMoreTable.setVisible(false);
                }
                if (me.menuSpellCheckTable.isVisible() && me._currLang.id !== me._currLang.tableid) {
                    me.changeLanguageMenu(me.langTableMenu.menu);
                    me._currLang.tableid = me._currLang.id;
                }
            },
            items: [me.menuSpellCheckTable, menuSpellcheckTableSeparator, {
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
            menuTableWrapInline, menuTableWrapFlow, {
                xtype: "menuseparator"
            },
            menuTableAdvanced, {
                xtype: "menuseparator"
            },
            menuAddCommentTable, menuAddHyperlinkTable, menuHyperlinkTable, menuHyperlinkSeparator, menuParagraphTable],
            plugins: [{
                ptype: "menuexpand"
            }]
        });
        var menuParagraphBreakBefore = Ext.widget("menucheckitem", {
            text: me.breakBeforeText,
            checkedCls: "asc-menu-item-checked",
            uncheckedCls: "asc-menu-item-unchecked",
            listeners: {
                click: function (item, e, eOpt) {
                    me.api.put_PageBreak(item.checked);
                    Ext.menu.Manager.hideAll();
                }
            }
        });
        var menuParagraphKeepLines = Ext.widget("menucheckitem", {
            text: me.keepLinesText,
            checkedCls: "asc-menu-item-checked",
            uncheckedCls: "asc-menu-item-unchecked",
            listeners: {
                click: function (item, e, eOpt) {
                    me.api.put_KeepLines(item.checked);
                    Ext.menu.Manager.hideAll();
                }
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
        var menuParagraphAdvanced = Ext.widget("menuitem", {
            text: me.advancedParagraphText,
            listeners: {
                click: this.advancedParagraphClick,
                scope: this
            }
        });
        var menuFrameAdvanced = Ext.widget("menuitem", {
            text: me.advancedFrameText,
            listeners: {
                click: this.advancedFrameClick,
                scope: this
            }
        });
        var menuCommentSeparatorPara = Ext.widget("menuseparator");
        var menuAddCommentPara = Ext.widget("menuitem", {
            text: me.addCommentText,
            listeners: {
                click: this.addComment,
                scope: this
            }
        });
        var menuHyperlinkParaSeparator = Ext.widget("menuseparator");
        var menuAddHyperlinkPara = Ext.widget("menuitem", {
            text: me.hyperlinkText,
            listeners: {
                click: this.addHyperlink,
                scope: this
            }
        });
        var menuEditHyperlinkPara = Ext.widget("menuitem", {
            text: me.editHyperlinkText,
            listeners: {
                click: this.editHyperlink,
                scope: this
            }
        });
        var menuRemoveHyperlinkPara = Ext.widget("menuitem", {
            text: me.removeHyperlinkText,
            listeners: {
                click: function (item, e, eOpt) {
                    me.api.remove_Hyperlink();
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
        me.menuSpellPara = Ext.widget("menuitem", {
            text: me.loadSpellText,
            hideOnClick: false,
            disabled: true
        });
        me.menuSpellMorePara = Ext.widget("menuitem", {
            text: me.moreText,
            hideOnClick: false,
            menu: {
                showSeparator: false,
                bodyCls: "no-icons",
                maxHeight: 300,
                items: [],
                plugins: [{
                    ptype: "menuexpand"
                }],
                onShow: function () {
                    var self = this;
                    self.el.show();
                    self.callParent(arguments);
                    if (self.floating && self.constrain) {
                        var y = self.el.getY();
                        self.doConstrain();
                        var h = self.getHeight();
                        var maxHeight = Ext.Element.getViewportHeight();
                        if (y + h > maxHeight) {
                            y = maxHeight - h;
                        }
                        self.el.setY(y);
                    }
                }
            }
        });
        me.langParaMenu = Ext.widget("menuitem", {
            text: me.langText,
            hideOnClick: false,
            menu: {
                showSeparator: false,
                bodyCls: "no-icons",
                maxHeight: 300,
                items: [],
                plugins: [{
                    ptype: "menuexpand"
                }],
                onShow: function () {
                    var self = this;
                    self.el.show();
                    self.callParent(arguments);
                    if (self.floating && self.constrain) {
                        var y = self.el.getY();
                        self.doConstrain();
                        var h = self.getHeight();
                        var maxHeight = Ext.Element.getViewportHeight();
                        if (y + h > maxHeight) {
                            y = maxHeight - h;
                        }
                        self.el.setY(y);
                        if (self.currentCheckedItem !== undefined) {
                            self.currentCheckedItem.getEl().scrollIntoView(self.layout.getRenderTarget());
                        }
                    }
                }
            }
        });
        var menuIgnoreSpellPara = Ext.widget("menuitem", {
            text: me.ignoreSpellText,
            listeners: {
                click: function (item, e, eOpt) {
                    me.api.asc_ignoreMisspelledWord(me._currentSpellObj, false);
                    me.fireEvent("editcomplete", me);
                }
            }
        });
        var menuIgnoreAllSpellPara = Ext.widget("menuitem", {
            text: me.ignoreAllSpellText,
            listeners: {
                click: function (item, e, eOpt) {
                    me.api.asc_ignoreMisspelledWord(me._currentSpellObj, true);
                    me.fireEvent("editcomplete", me);
                }
            }
        });
        var menuIgnoreSpellParaSeparator = Ext.widget("menuseparator");
        var menuSpellcheckParaSeparator = Ext.widget("menuseparator");
        this.textMenu = Ext.widget("menu", {
            showSeparator: false,
            bodyCls: "no-icons",
            listeners: {
                hide: function (cnt, eOpt) {
                    me.fireEvent("editcomplete", me);
                    me.currentMenu = null;
                }
            },
            initMenu: function (value) {
                if (value.paraProps) {
                    menuParagraphBreakBefore.setChecked(value.paraProps.value.get_PageBreakBefore());
                    menuParagraphKeepLines.setChecked(value.paraProps.value.get_KeepLines());
                }
                var isInShape = (value.imgProps && value.imgProps.value && value.imgProps.value.get_ShapeProperties());
                menuParagraphVAlign.setVisible(isInShape);
                if (isInShape) {
                    var align = value.imgProps.value.get_VerticalTextAlign();
                    me.menuParagraphTop.setChecked(align == c_oAscVerticalTextAlign.TEXT_ALIGN_TOP);
                    me.menuParagraphCenter.setChecked(align == c_oAscVerticalTextAlign.TEXT_ALIGN_CTR);
                    me.menuParagraphBottom.setChecked(align == c_oAscVerticalTextAlign.TEXT_ALIGN_BOTTOM);
                }
                var text = null;
                if (me.api) {
                    text = me.api.can_AddHyperlink();
                }
                menuCommentSeparatorPara.setVisible(me.api.can_AddQuotedComment() !== false && me.mode.canCoAuthoring);
                menuAddCommentPara.setVisible(me.api.can_AddQuotedComment() !== false && me.mode.canCoAuthoring);
                me.menuSpellPara.setVisible(value.spellProps !== undefined && value.spellProps.value.get_Checked() === false);
                menuSpellcheckParaSeparator.setVisible(value.spellProps !== undefined && value.spellProps.value.get_Checked() === false);
                menuIgnoreSpellPara.setVisible(value.spellProps !== undefined && value.spellProps.value.get_Checked() === false);
                menuIgnoreAllSpellPara.setVisible(value.spellProps !== undefined && value.spellProps.value.get_Checked() === false);
                me.langParaMenu.setVisible(value.spellProps !== undefined && value.spellProps.value.get_Checked() === false);
                menuIgnoreSpellParaSeparator.setVisible(value.spellProps !== undefined && value.spellProps.value.get_Checked() === false);
                if (value.spellProps !== undefined && value.spellProps.value.get_Checked() === false && value.spellProps.value.get_Variants() !== null && value.spellProps.value.get_Variants() !== undefined) {
                    me.addWordVariants(true);
                } else {
                    me.menuSpellPara.setText(me.loadSpellText);
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
                menuHyperlinkPara.setDisabled(disabled);
                menuParagraphBreakBefore.setDisabled(disabled);
                menuParagraphKeepLines.setDisabled(disabled);
                menuParagraphAdvanced.setDisabled(disabled);
                menuFrameAdvanced.setDisabled(disabled);
                menuParagraphVAlign.setDisabled(disabled);
                menuFrameAdvanced.setVisible(value.paraProps.value.get_FramePr() !== undefined);
            },
            items: [me.menuSpellPara, me.menuSpellMorePara, menuSpellcheckParaSeparator, menuIgnoreSpellPara, menuIgnoreAllSpellPara, me.langParaMenu, menuIgnoreSpellParaSeparator, menuParagraphBreakBefore, menuParagraphKeepLines, menuParagraphVAlign, menuParagraphAdvanced, menuFrameAdvanced, menuCommentSeparatorPara, menuAddCommentPara, menuHyperlinkParaSeparator, menuAddHyperlinkPara, menuHyperlinkPara],
            plugins: [{
                ptype: "menuexpand"
            }]
        });
        var menuEditHeaderFooter = Ext.widget("menuitem", {
            text: me.editHeaderText
        });
        this.hdrMenu = Ext.widget("menu", {
            showSeparator: false,
            bodyCls: "no-icons",
            listeners: {
                hide: function (cnt, eOpt) {
                    me.fireEvent("editcomplete", me);
                    me.currentMenu = null;
                }
            },
            initMenu: function (value) {
                menuEditHeaderFooter.setText(value.Header ? me.editHeaderText : me.editFooterText);
                menuEditHeaderFooter.setHandler(function () {
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
        });
    },
    setLanguages: function (langs) {
        var me = this,
        arrpara = [],
        arrtable = [];
        if (langs && langs.length > 0) {
            Ext.each(langs, function (lang, index) {
                var mnu = Ext.widget("menucheckitem", {
                    text: Common.util.LanguageName.getLocalLanguageName(lang.asc_getId())[1],
                    langid: lang.asc_getId(),
                    checked: false,
                    group: "popupparalang",
                    listeners: {
                        click: function (item, e, eOpt) {
                            if (me.api) {
                                if (item.langid !== undefined) {
                                    me.api.put_TextPrLang(item.langid);
                                }
                                me._currLang.paraid = item.langid;
                                me.langParaMenu.menu.currentCheckedItem = item;
                                me.fireEvent("editcomplete", me);
                            }
                        }
                    }
                });
                arrpara.push(mnu);
                arrtable.push(mnu.cloneConfig({
                    group: "popuptablelang",
                    listeners: {
                        click: function (item, e, eOpt) {
                            if (me.api) {
                                if (item.langid !== undefined) {
                                    me.api.put_TextPrLang(item.langid);
                                }
                                me._currLang.tableid = item.langid;
                                me.langTableMenu.menu.currentCheckedItem = item;
                                me.fireEvent("editcomplete", me);
                            }
                        }
                    }
                }));
            });
            me.langParaMenu.menu.insert(0, arrpara);
            me.langTableMenu.menu.insert(0, arrtable);
        }
    },
    alignmentText: "Alignment",
    leftText: "Left",
    rightText: "Right",
    centerText: "Center",
    selectRowText: "Select Row",
    selectColumnText: "Select Column",
    selectCellText: "Select Cell",
    selectTableText: "Select Table",
    insertRowAboveText: "Insert Row Above",
    insertRowBelowText: "Insert Row Below",
    insertColumnLeftText: "To Left",
    insertColumnRightText: "To Right",
    deleteText: "Delete",
    deleteRowText: "Delete Row",
    deleteColumnText: "Delete Column",
    deleteTableText: "Delete Table",
    mergeCellsText: "Merge Cells",
    splitCellsText: "Split Cell...",
    splitCellTitleText: "Split Cell",
    wrappingText: "Wrapping",
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
    tipIsLocked: "This element is being edited by another user."
});