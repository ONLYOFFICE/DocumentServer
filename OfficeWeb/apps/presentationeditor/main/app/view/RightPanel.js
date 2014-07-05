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
 Ext.define("PE.model.PatternDataModel", {
    extend: "Ext.data.Model",
    fields: [{
        name: "imageUrl"
    },
    {
        name: "imageStyle"
    },
    {
        name: "imageCls"
    },
    {
        name: "title"
    },
    {
        name: "data"
    },
    {
        name: "uid"
    }]
});
Ext.define("PE.view.RightPanel", {
    extend: "Ext.container.Container",
    alias: "widget.perightpanel",
    width: 220,
    layout: {
        type: "auto"
    },
    autoScroll: true,
    cls: "asc-right-panel-container",
    preventHeader: true,
    requires: ["Ext.toolbar.Toolbar", "Ext.container.Container", "Common.plugin.ScrollPane", "PE.view.TableSettings", "PE.view.ParagraphSettings", "PE.view.ImageSettings", "PE.view.ShapeSettings", "PE.view.SlideSettings", "Ext.button.Button", "Ext.panel.Panel"],
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
        this.hideMenus();
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
                this._settings[i].locked = undefined;
            }
        }
        this._settings[c_oAscTypeSelectElement.Slide].hidden = 0;
        for (i = 0; i < SelectedObjects.length; i++) {
            var type = SelectedObjects[i].get_ObjectType();
            if (type >= this._settings.length || this._settings[type] === undefined) {
                continue;
            }
            this._settings[type].props = SelectedObjects[i].get_ObjectValue();
            this._settings[type].hidden = 0;
            if (type == c_oAscTypeSelectElement.Slide) {
                this._settings[type].locked = this._settings[type].props.get_LockDelete();
                this._settings[type].lockedBackground = this._settings[type].props.get_LockBackground();
                this._settings[type].lockedEffects = this._settings[type].props.get_LockTranzition();
                this._settings[type].lockedTiming = this._settings[type].props.get_LockTiming();
            } else {
                this._settings[type].locked = this._settings[type].props.get_Locked();
            }
        }
        if (this._settings[c_oAscTypeSelectElement.Slide].locked) {
            for (i = 0; i < this._settings.length; i++) {
                if (this._settings[i]) {
                    this._settings[i].locked = true;
                }
            }
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
                if (i != c_oAscTypeSelectElement.Slide) {
                    lastactive = i;
                }
                if (this._settings[i].needShow) {
                    this._settings[i].needShow = false;
                    priorityactive = i;
                } else {
                    if (i != c_oAscTypeSelectElement.Slide || this._settings[i].isCurrent) {
                        if (this.TabPanel.getLayout().getActiveItem() == this._settings[i].panel) {
                            currentactive = i;
                        }
                    }
                }
                if (i == c_oAscTypeSelectElement.Slide) {
                    if (this._settings[i].locked !== undefined) {
                        this._settings[i].panel.setSlideDisabled(this._settings[i].lockedBackground || this._settings[i].locked, this._settings[i].lockedEffects || this._settings[i].locked, this._settings[i].lockedTiming || this._settings[i].locked);
                    }
                } else {
                    if (this._settings[i].panel.isDisabled() !== this._settings[i].locked) {
                        this._settings[i].panel.setDisabled(this._settings[i].locked);
                    }
                }
            }
        }
        if (!this.minimizedMode) {
            var active;
            if (priorityactive > -1) {
                active = priorityactive;
            } else {
                if (currentactive >= 0) {
                    active = currentactive;
                } else {
                    if (lastactive >= 0) {
                        active = lastactive;
                    } else {
                        active = c_oAscTypeSelectElement.Slide;
                    }
                }
            }
            if (active !== undefined) {
                if (!this._settings[active].btn.pressed) {
                    this._settings[active].btn.toggle();
                } else {
                    this._settings[active].panel.ChangeSettings.call(this._settings[active].panel, this._settings[active].props);
                }
            }
        }
        this._settings[c_oAscTypeSelectElement.Image].needShow = false;
        this._settings[c_oAscTypeSelectElement.Shape].needShow = false;
    },
    onInsertTable: function () {
        this._settings[c_oAscTypeSelectElement.Table].needShow = true;
    },
    onInsertImage: function () {
        this._settings[c_oAscTypeSelectElement.Image].needShow = true;
    },
    onInsertShape: function () {
        this._settings[c_oAscTypeSelectElement.Shape].needShow = true;
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
        if (this._settings) {
            for (var i = 0; i < this._settings.length; i++) {
                if (this._settings[i] === undefined) {
                    continue;
                }
                if (Ext.isDefined(this._settings[i].panel.hideMenus)) {
                    this._settings[i].panel.hideMenus();
                }
            }
        }
    },
    updateMetricUnit: function () {
        this.ParagraphPanel.updateMetricUnit();
        this.ImagePanel.updateMetricUnit();
    },
    SendThemeColors: function (effectcolors, standartcolors) {
        this.effectcolors = effectcolors;
        if (standartcolors && standartcolors.length > 0) {
            this.standartcolors = standartcolors;
        }
        if (this.ShapePanel && this.TablePanel && this.SlidePanel) {
            this.ShapePanel.SendThemeColors(effectcolors, standartcolors);
            this.TablePanel.SendThemeColors(effectcolors, standartcolors);
            this.SlidePanel.SendThemeColors(effectcolors, standartcolors);
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
                items: [me.SlidePanel = Ext.create("PE.view.SlideSettings", {
                    id: "view-slide-settings",
                    cls: "asc-right-panel",
                    type: c_oAscTypeSelectElement.Slide
                }), me.ShapePanel = Ext.create("PE.view.ShapeSettings", {
                    id: "view-shape-settings",
                    cls: "asc-right-panel",
                    type: c_oAscTypeSelectElement.Shape
                }), me.ParagraphPanel = Ext.create("PE.view.ParagraphSettings", {
                    id: "view-paragraph-settings",
                    cls: "asc-right-panel",
                    type: c_oAscTypeSelectElement.Paragraph
                }), me.TablePanel = Ext.create("PE.view.TableSettings", {
                    id: "view-table-settings",
                    cls: "asc-right-panel",
                    type: c_oAscTypeSelectElement.Table
                }), me.ImagePanel = Ext.create("PE.view.ImageSettings", {
                    id: "view-image-settings",
                    cls: "asc-right-panel",
                    type: c_oAscTypeSelectElement.Image
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
        me._settings = [];
        me._settings[c_oAscTypeSelectElement.Paragraph] = {
            panel: me.ParagraphPanel,
            btn: me.btnText,
            hidden: 1,
            locked: false
        };
        me._settings[c_oAscTypeSelectElement.Table] = {
            panel: me.TablePanel,
            btn: me.btnTable,
            hidden: 1,
            locked: false
        };
        me._settings[c_oAscTypeSelectElement.Image] = {
            panel: me.ImagePanel,
            btn: me.btnImage,
            hidden: 1,
            locked: false
        };
        me._settings[c_oAscTypeSelectElement.Shape] = {
            panel: me.ShapePanel,
            btn: me.btnShape,
            hidden: 1,
            locked: false
        };
        me._settings[c_oAscTypeSelectElement.Slide] = {
            panel: me.SlidePanel,
            btn: me.btnSlide,
            hidden: 1,
            locked: false
        };
        if (this.api) {
            this.ShapePanel.setApi(this.api);
            this.ImagePanel.setApi(this.api);
            this.ParagraphPanel.setApi(this.api);
            this.TablePanel.setApi(this.api);
            this.SlidePanel.setApi(this.api);
        }
        if (this.editMode && this.api) {
            var selectedElements = this.api.getSelectedElements();
            if (selectedElements.length > 0) {
                this.onFocusObject(selectedElements);
            }
        }
        if (this.effectcolors && this.standartcolors) {
            this.ShapePanel.SendThemeColors(this.effectcolors, this.standartcolors);
            this.TablePanel.SendThemeColors(this.effectcolors, this.standartcolors);
            this.SlidePanel.SendThemeColors(this.effectcolors, this.standartcolors);
        }
    }
});