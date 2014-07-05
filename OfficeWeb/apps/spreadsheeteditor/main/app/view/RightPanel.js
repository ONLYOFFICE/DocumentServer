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
 Ext.define("SSE.view.RightPanel", {
    extend: "Ext.container.Container",
    alias: "widget.sserightpanel",
    width: 220,
    layout: {
        type: "auto"
    },
    autoScroll: true,
    cls: "asc-right-panel-container",
    preventHeader: true,
    requires: ["Ext.toolbar.Toolbar", "Ext.container.Container", "Common.plugin.ScrollPane", "SSE.view.ImageSettings", "SSE.view.ShapeSettings", "SSE.view.ParagraphSettings", "Ext.button.Button", "Ext.panel.Panel"],
    uses: ["Ext.DomHelper", "Ext.util.Cookies"],
    listeners: {
        afterrender: function () {
            var owner = this.ownerCt;
            if (Ext.isDefined(owner)) {
                owner.addListener("resize", Ext.bind(this.resizeRightPanels, this));
            }
        }
    },
    resizeRightPanels: function (cnt) {
        this.doComponentLayout();
    },
    constructor: function (config) {
        this.callParent(arguments);
        this.initConfig(config);
        return this;
    },
    initComponent: function () {
        var me = this;
        me.editMode = true;
        me.minimizedMode = true;
        me.plugins = [{
            ptype: "scrollpane",
            pluginId: "scrollpane",
            areaSelector: ".x-container",
            settings: {
                enableKeyboardNavigation: true,
                verticalGutter: 0
            }
        }];
        me.callParent(arguments);
    },
    updateScrollPane: function () {
        var me = this;
        me.getPlugin("scrollpane").updateScrollPane();
    },
    onFocusObject: function (SelectedObjects) {
        if (!this.editMode) {
            return;
        }
        for (var i = 0; i < this._settings.length; i++) {
            if (this._settings[i]) {
                this._settings[i].hidden = 1;
            }
        }
        for (i = 0; i < SelectedObjects.length; i++) {
            var type = SelectedObjects[i].asc_getObjectType();
            if (type >= this._settings.length || this._settings[type] === undefined) {
                continue;
            }
            var value = SelectedObjects[i].asc_getObjectValue();
            if (type == c_oAscTypeSelectElement.Image) {
                if (value.asc_getShapeProperties() !== null) {
                    type = c_oAscTypeSelectElement.Shape;
                }
            }
            this._settings[type].props = value;
            this._settings[type].hidden = 0;
        }
        var lastactive = -1,
        currentactive, priorityactive = -1;
        for (i = 0; i < this._settings.length; i++) {
            if (this._settings[i] === undefined) {
                continue;
            }
            if (this._settings[i].hidden) {
                if (!this._settings[i].btn.isDisabled()) {
                    this._settings[i].btn.setDisabled(true);
                }
                if (this.TabPanel.getLayout().getActiveItem() == this._settings[i].panel) {
                    currentactive = -1;
                }
            } else {
                if (this._settings[i].btn.isDisabled()) {
                    this._settings[i].btn.setDisabled(false);
                }
                lastactive = i;
                if (this._settings[i].needShow) {
                    this._settings[i].needShow = false;
                    priorityactive = i;
                } else {
                    if (this.TabPanel.getLayout().getActiveItem() == this._settings[i].panel) {
                        currentactive = i;
                    }
                }
            }
        }
        if (!this.minimizedMode) {
            var active;
            if (priorityactive > -1) {
                active = priorityactive;
            } else {
                if (lastactive >= 0 && currentactive < 0) {
                    active = lastactive;
                } else {
                    if (currentactive >= 0) {
                        active = currentactive;
                    }
                }
            }
            if (active !== undefined) {
                if (!this._settings[active].btn.pressed) {
                    this._settings[active].btn.toggle();
                } else {
                    if (this._settings[active].panel.ChangeSettings) {
                        this._settings[active].panel.ChangeSettings.call(this._settings[active].panel, this._settings[active].props);
                    }
                }
            }
        }
        this._settings[c_oAscTypeSelectElement.Image].needShow = false;
    },
    onInsertImage: function () {
        this._settings[c_oAscTypeSelectElement.Image].needShow = true;
    },
    SendThemeColors: function (effectcolors, standartcolors) {
        this.effectcolors = effectcolors;
        if (standartcolors && standartcolors.length > 0) {
            this.standartcolors = standartcolors;
        }
        if (this.ShapePanel) {
            this.ShapePanel.SendThemeColors(effectcolors, standartcolors);
        }
    },
    setApi: function (api) {
        this.api = api;
        return this;
    },
    setMode: function (mode) {
        this.editMode = mode.isEdit;
    },
    FillAutoShapes: function () {
        this.ShapePanel.FillAutoShapes();
    },
    hideMenus: function () {
        for (var i = 0; i < this._settings.length; i++) {
            if (this._settings[i] === undefined) {
                continue;
            }
            if (Ext.isDefined(this._settings[i].panel.hideMenus)) {
                this._settings[i].panel.hideMenus();
            }
        }
    },
    updateMetricUnit: function () {
        this.ImagePanel.updateMetricUnit();
        this.ParagraphPanel.updateMetricUnit();
    },
    _onSelectionChanged: function (info) {
        var need_disable = info.asc_getLocked();
        if (this._settings.prevDisabled != need_disable) {
            this._settings.prevDisabled = need_disable;
            this._settings.forEach(function (item) {
                item.panel[need_disable ? "disable" : "enable"]();
            });
        }
    },
    createDelayedElements: function () {
        var me = this;
        me.panelHolder = Ext.create("Ext.container.Container", {
            layout: {
                type: "anchor"
            },
            items: [me.TabPanel = Ext.create("Ext.panel.Panel", {
                hidden: true,
                id: "view-tab-panel",
                cls: "asc-right-tabpanel",
                preventHeader: true,
                layout: "card",
                items: [me.ShapePanel = Ext.create("SSE.view.ShapeSettings", {
                    id: "view-shape-settings",
                    cls: "asc-right-panel",
                    type: c_oAscTypeSelectElement.Shape
                }), me.ImagePanel = Ext.create("SSE.view.ImageSettings", {
                    id: "view-image-settings",
                    cls: "asc-right-panel",
                    type: c_oAscTypeSelectElement.Image
                }), me.ParagraphPanel = Ext.create("SSE.view.ParagraphSettings", {
                    id: "view-paragraph-settings",
                    cls: "asc-right-panel",
                    type: c_oAscTypeSelectElement.Paragraph
                })],
                listeners: {
                    afterlayout: function () {
                        me.updateScrollPane();
                    }
                }
            })],
            listeners: {
                afterlayout: function () {
                    me.updateScrollPane();
                }
            }
        });
        me.add(me.panelHolder);
        me.ShapePanel.setApi(me.api);
        me.ImagePanel.setApi(me.api);
        me.ParagraphPanel.setApi(me.api);
        me.api.asc_registerCallback("asc_onSelectionChanged", Ext.bind(me._onSelectionChanged, me));
        me._settings = [];
        me._settings[c_oAscTypeSelectElement.Image] = {
            panel: me.ImagePanel,
            btn: me.btnImage,
            hidden: 1
        };
        me._settings[c_oAscTypeSelectElement.Shape] = {
            panel: me.ShapePanel,
            btn: me.btnShape,
            hidden: 1
        };
        me._settings[c_oAscTypeSelectElement.Paragraph] = {
            panel: me.ParagraphPanel,
            btn: me.btnText,
            hidden: 1
        };
        if (this.effectcolors && this.standartcolors) {
            this.ShapePanel.SendThemeColors(this.effectcolors, this.standartcolors);
        }
    }
});