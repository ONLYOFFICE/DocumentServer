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
 Ext.define("SSE.view.DocumentSettings", {
    extend: "Ext.container.Container",
    alias: "widget.ssedocumentsettings",
    cls: "sse-documentsettings-panel",
    autoScroll: true,
    requires: ["Ext.container.Container", "Ext.XTemplate", "Ext.view.View", "Ext.data.Model", "Ext.data.Store", "Common.plugin.DataViewScrollPane", "SSE.view.MainSettingsGeneral", "SSE.view.MainSettingsPrint"],
    listeners: {
        show: function (cmp, eOpts) {
            cmp.updateSettings();
        }
    },
    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    initComponent: function () {
        var me = this;
        me.addEvents("savedocsettings");
        this.addEvents("changemeasureunit");
        me.generalSettings = Ext.widget("ssemainsettingsgeneral");
        me.printSettings = Ext.widget("ssemainsettingsprint");
        me.printSettings.updateMetricUnit();
        var settingsPanels = [me.generalSettings, me.printSettings, 1];
        me.generalSettings.addListener("savedocsettings", function () {
            me.fireEvent("savedocsettings", me);
        });
        me.generalSettings.addListener("changemeasureunit", function () {
            var value = window.localStorage.getItem("sse-settings-unit");
            Common.MetricSettings.setCurrentMetric((value !== null) ? parseInt(value) : Common.MetricSettings.c_MetricUnits.cm);
            me.printSettings.updateMetricUnit();
            me.fireEvent("changemeasureunit", me);
        });
        this.menuStore = Ext.create("Ext.data.Store", {
            fields: ["name", {
                type: "int",
                name: "panelindex"
            },
            "iconCls"],
            data: [{
                name: me.txtGeneral,
                panelindex: 0,
                iconCls: "mnu-settings-general"
            },
            {
                name: me.txtPrint,
                panelindex: 1,
                iconCls: "mnu-print"
            }]
        });
        var menuTpl = new Ext.XTemplate('<tpl for=".">', '<div class="thumb-wrap">', '<img class="icon {iconCls}" src="' + Ext.BLANK_IMAGE_URL + '" />', '<span class="caption">{name}</span>', "</div>", "</tpl>", '<div class="x-clear"></div>');
        this.cntMenu = Ext.create("Ext.container.Container", {
            layout: "fit",
            cls: "help-menu-container",
            width: 200,
            items: [this.menuView = Ext.create("Ext.view.View", {
                store: this.menuStore,
                tpl: menuTpl,
                singleSelect: true,
                trackOver: true,
                style: "overflow:visible;",
                width: "100%",
                overItemCls: "x-item-over",
                itemSelector: "div.thumb-wrap",
                cls: "help-menu-view",
                listeners: {
                    afterrender: function (view) {
                        view.getSelectionModel().deselectOnContainerClick = false;
                        view.select(0);
                    },
                    selectionchange: function (model, selections) {
                        var record = model.getLastSelected();
                        if (record) {
                            if (settingsPanels[record.data.panelindex].updateSettings) {
                                settingsPanels[record.data.panelindex].updateSettings();
                            }
                            settingsPanels[record.data.panelindex].setVisible(true);
                            settingsPanels[settingsPanels[settingsPanels.length - 1]].setVisible(false);
                            settingsPanels[settingsPanels.length - 1] = record.data.panelindex;
                        }
                    }
                },
                plugins: [{
                    ptype: "dataviewscrollpane",
                    areaSelector: ".help-menu-view",
                    pluginId: "docHelpPluginId",
                    settings: {
                        enableKeyboardNavigation: true,
                        keyboardSpeed: 0.001
                    }
                }]
            })]
        });
        this.items = [{
            xtype: "container",
            layout: {
                type: "hbox",
                align: "stretch"
            },
            height: "100%",
            items: [this.cntMenu, {
                xtype: "tbspacer",
                width: 2,
                style: "border-left: 1px solid #C7C7C7"
            },
            {
                xtype: "container",
                flex: 1,
                layout: "fit",
                items: [me.generalSettings, me.printSettings],
                listeners: {}
            }]
        }];
        this.callParent(arguments);
    },
    setApi: function (o) {
        if (o) {
            this.api = o;
        }
    },
    updateSettings: function () {
        this.generalSettings && this.generalSettings.updateSettings();
    },
    setMode: function (mode) {
        this.mode = mode;
        this.generalSettings && this.generalSettings.setMode(this.mode);
    },
    txtGeneral: "General",
    txtPrint: "Print"
});