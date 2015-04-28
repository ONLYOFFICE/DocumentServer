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
 define(["core", "spreadsheeteditor/main/app/view/RightMenu"], function () {
    SSE.Controllers.RightMenu = Backbone.Controller.extend({
        models: [],
        collections: [],
        views: ["RightMenu"],
        initialize: function () {
            this.editMode = true;
            this._state = {};
            this.addListeners({
                "RightMenu": {
                    "rightmenuclick": this.onRightMenuClick
                }
            });
        },
        onLaunch: function () {
            this.rightmenu = this.createView("RightMenu");
            this.rightmenu.on("render:after", _.bind(this.onRightMenuAfterRender, this));
        },
        onRightMenuAfterRender: function (rightMenu) {
            rightMenu.shapeSettings.application = this.getApplication();
            this._settings = [];
            this._settings[c_oAscTypeSelectElement.Paragraph] = {
                panelId: "id-paragraph-settings",
                panel: rightMenu.paragraphSettings,
                btn: rightMenu.btnText,
                hidden: 1,
                locked: false
            };
            this._settings[c_oAscTypeSelectElement.Image] = {
                panelId: "id-image-settings",
                panel: rightMenu.imageSettings,
                btn: rightMenu.btnImage,
                hidden: 1,
                locked: false
            };
            this._settings[c_oAscTypeSelectElement.Shape] = {
                panelId: "id-shape-settings",
                panel: rightMenu.shapeSettings,
                btn: rightMenu.btnShape,
                hidden: 1,
                locked: false
            };
            this._settings[c_oAscTypeSelectElement.Chart] = {
                panelId: "id-chart-settings",
                panel: rightMenu.chartSettings,
                btn: rightMenu.btnChart,
                hidden: 1,
                locked: false
            };
        },
        setApi: function (api) {
            this.api = api;
            this.api.asc_registerCallback("asc_onСoAuthoringDisconnect", _.bind(this.onCoAuthoringDisconnect, this));
            Common.NotificationCenter.on("api:disconnect", _.bind(this.onCoAuthoringDisconnect, this));
        },
        setMode: function (mode) {
            this.editMode = mode.isEdit;
        },
        onRightMenuClick: function (menu, type, minimized) {
            if (!minimized && this.editMode) {
                var panel = this._settings[type].panel;
                var props = this._settings[type].props;
                if (props && panel) {
                    panel.ChangeSettings.call(panel, props);
                }
            }
            Common.NotificationCenter.trigger("layout:changed", "rightmenu");
            Common.NotificationCenter.trigger("edit:complete", this.rightmenu);
        },
        onSelectionChanged: function (info) {
            var SelectedObjects = [],
            selectType = info.asc_getFlags().asc_getSelectionType();
            if (selectType == c_oAscSelectionType.RangeImage || selectType == c_oAscSelectionType.RangeShape || selectType == c_oAscSelectionType.RangeChart || selectType == c_oAscSelectionType.RangeChartText || selectType == c_oAscSelectionType.RangeShapeText) {
                SelectedObjects = this.api.asc_getGraphicObjectProps();
            }
            if (SelectedObjects.length <= 0 && !this.rightmenu.minimizedMode) {
                this.rightmenu.clearSelection();
            }
            this.onFocusObject(SelectedObjects);
            var need_disable = info.asc_getLocked(),
            me = this;
            if (this._state.prevDisabled != need_disable) {
                this._state.prevDisabled = need_disable;
                _.each(this._settings, function (item) {
                    item.panel.setLocked(need_disable);
                });
            }
        },
        onFocusObject: function (SelectedObjects) {
            if (!this.editMode) {
                return;
            }
            for (var i = 0; i < this._settings.length; ++i) {
                if (this._settings[i]) {
                    this._settings[i].hidden = 1;
                    this._settings[i].locked = false;
                }
            }
            for (i = 0; i < SelectedObjects.length; ++i) {
                var type = SelectedObjects[i].asc_getObjectType();
                if (type >= this._settings.length || this._settings[type] === undefined) {
                    continue;
                }
                var value = SelectedObjects[i].asc_getObjectValue();
                if (type == c_oAscTypeSelectElement.Image) {
                    if (value.asc_getChartProperties() !== null) {
                        type = c_oAscTypeSelectElement.Chart;
                    } else {
                        if (value.asc_getShapeProperties() !== null) {
                            type = c_oAscTypeSelectElement.Shape;
                        }
                    }
                }
                this._settings[type].props = value;
                this._settings[type].hidden = 0;
                this._settings[type].locked = value.asc_getLocked();
            }
            var lastactive = -1,
            currentactive, priorityactive = -1;
            for (i = 0; i < this._settings.length; ++i) {
                var pnl = this._settings[i];
                if (pnl === undefined) {
                    continue;
                }
                if (pnl.hidden) {
                    if (!pnl.btn.isDisabled()) {
                        pnl.btn.setDisabled(true);
                    }
                    if (this.rightmenu.GetActivePane() == pnl.panelId) {
                        currentactive = -1;
                    }
                } else {
                    if (pnl.btn.isDisabled()) {
                        pnl.btn.setDisabled(false);
                    }
                    lastactive = i;
                    if (pnl.needShow) {
                        pnl.needShow = false;
                        priorityactive = i;
                    } else {
                        if (this.rightmenu.GetActivePane() == pnl.panelId) {
                            currentactive = i;
                        }
                    }
                    pnl.panel.setLocked(pnl.locked);
                }
            }
            if (!this.rightmenu.minimizedMode) {
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
                    this.rightmenu.SetActivePane(active);
                    this._settings[active].panel.ChangeSettings.call(this._settings[active].panel, this._settings[active].props);
                }
            }
            this._settings[c_oAscTypeSelectElement.Image].needShow = false;
            this._settings[c_oAscTypeSelectElement.Chart].needShow = false;
        },
        onCoAuthoringDisconnect: function () {
            if (this.rightmenu) {
                this.rightmenu.SetDisabled("", true, true);
            }
            this.setMode({
                isEdit: false
            });
        },
        onInsertImage: function () {
            this._settings[c_oAscTypeSelectElement.Image].needShow = true;
        },
        onInsertChart: function () {
            this._settings[c_oAscTypeSelectElement.Chart].needShow = true;
        },
        onInsertShape: function () {
            this._settings[c_oAscTypeSelectElement.Shape].needShow = true;
        },
        UpdateThemeColors: function () {
            this.rightmenu.shapeSettings.UpdateThemeColors();
        },
        updateMetricUnit: function () {
            this.rightmenu.paragraphSettings.updateMetricUnit();
            this.rightmenu.chartSettings.updateMetricUnit();
            this.rightmenu.imageSettings.updateMetricUnit();
        },
        createDelayedElements: function () {
            var me = this;
            if (this.api) {
                this.api.asc_registerCallback("asc_onFocusObject", _.bind(this.onFocusObject, this));
                this.api.asc_registerCallback("asc_onSelectionChanged", _.bind(this.onSelectionChanged, this));
                this.api.asc_registerCallback("asc_doubleClickOnObject", _.bind(this.onDoubleClickOnObject, this));
            }
        },
        onDoubleClickOnObject: function (obj) {
            if (!this.editMode) {
                return;
            }
            var type = obj.asc_getObjectType();
            if (type >= this._settings.length || this._settings[type] === undefined) {
                return;
            }
            var value = obj.asc_getObjectValue();
            if (type == c_oAscTypeSelectElement.Image) {
                if (value.asc_getChartProperties() !== null) {
                    type = c_oAscTypeSelectElement.Chart;
                } else {
                    if (value.asc_getShapeProperties() !== null) {
                        type = c_oAscTypeSelectElement.Shape;
                    }
                }
            }
            if (type !== c_oAscTypeSelectElement.Paragraph) {
                this.rightmenu.SetActivePane(type, true);
                this._settings[type].panel.ChangeSettings.call(this._settings[type].panel, this._settings[type].props);
            }
        }
    });
});