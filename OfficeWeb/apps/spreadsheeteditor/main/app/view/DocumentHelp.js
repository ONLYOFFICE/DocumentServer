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
 Ext.define("SSE.model.ModelHelpMenu", {
    extend: "Ext.data.Model",
    fields: [{
        type: "string",
        name: "name"
    },
    {
        type: "string",
        name: "src"
    },
    {
        type: "string",
        name: "headername"
    }]
});
Ext.define("SSE.view.DocumentHelp", {
    extend: "Ext.container.Container",
    alias: "widget.ssedocumenthelp",
    cls: "sse-documenthelp-body",
    autoScroll: true,
    requires: ["Ext.container.Container", "Ext.XTemplate", "Ext.view.View", "Ext.data.Model", "Ext.data.Store", "Common.plugin.DataViewScrollPane"],
    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    initComponent: function () {
        var me = this;
        this.urlPref = "resources/help/en/";
        var en_data = [{
            src: "UsageInstructions/OpenCreateNew.htm",
            name: "Create a new spreadsheet or open an existing one",
            headername: "Usage Instructions"
        },
        {
            src: "UsageInstructions/ManageSheets.htm",
            name: "Manage sheets"
        },
        {
            src: "UsageInstructions/InsertDeleteCells.htm",
            name: "Insert or delete cells, rows, and columns"
        },
        {
            src: "UsageInstructions/CopyPasteData.htm",
            name: "Copy and paste data"
        },
        {
            src: "UsageInstructions/FontTypeSizeStyle.htm",
            name: "Set font type, size, style, and colors"
        },
        {
            src: "UsageInstructions/AlignText.htm",
            name: "Align data in cells"
        },
        {
            src: "UsageInstructions/AddBorders.htm",
            name: "Add borders"
        },
        {
            src: "UsageInstructions/MergeCells.htm",
            name: "Merge cells"
        },
        {
            src: "UsageInstructions/ClearFormatting.htm",
            name: "Clear text, format in a cell"
        },
        {
            src: "UsageInstructions/SortData.htm",
            name: "Sort data"
        },
        {
            src: "UsageInstructions/InsertFunction.htm",
            name: "Insert function"
        },
        {
            src: "UsageInstructions/ChangeNumberFormat.htm",
            name: "Change number format"
        },
        {
            src: "UsageInstructions/UndoRedo.htm",
            name: "Undo/redo your actions"
        },
        {
            src: "UsageInstructions/ViewDocInfo.htm",
            name: "View file information"
        },
        {
            src: "UsageInstructions/SavePrintDownload.htm",
            name: "Save/print/download your spreadsheet"
        },
        {
            src: "HelpfulHints/About.htm",
            name: "About ONLYOFFICE Spreadsheet Editor",
            headername: "Helpful Hints"
        },
        {
            src: "HelpfulHints/SupportedFormats.htm",
            name: "Supported Formats of Spreadsheets"
        },
        {
            src: "HelpfulHints/Navigation.htm",
            name: "Navigation through Your Spreadsheet"
        },
        {
            src: "HelpfulHints/Search.htm",
            name: "Search Function"
        },
        {
            src: "HelpfulHints/KeyboardShortcuts.htm",
            name: "Keyboard Shortcuts"
        }];
        this.menuStore = Ext.create("Ext.data.Store", {
            model: "SSE.model.ModelHelpMenu",
            proxy: {
                type: "ajax",
                url: "help/Contents.json",
                noCache: false
            },
            listeners: {
                load: function (store, records, successful) {
                    if (!successful) {
                        if (me.urlPref.indexOf("resources/help/en/") < 0) {
                            me.urlPref = "resources/help/en/";
                            store.getProxy().url = "resources/help/en/Contents.json";
                            store.load();
                        } else {
                            me.urlPref = "resources/help/en/";
                            store.loadData(en_data);
                        }
                    }
                }
            }
        });
        var menuTpl = new Ext.XTemplate('<tpl for=".">', '<tpl if="headername">', '<div class="header-wrap">', '<span class="header">{headername}</span>', "</div>", "</tpl>", '<div class="thumb-wrap">', '<span class="caption">{name}</span>', "</div>", "</tpl>", '<div class="x-clear"></div>');
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
                        if (view.getStore().getCount()) {
                            view.select(0);
                            me.iFrame.src = me.urlPref + view.getStore().getAt(0).data.src;
                        }
                    },
                    selectionchange: function (model, selections) {
                        var record = model.getLastSelected();
                        if (record) {
                            me.iFrame.src = me.urlPref + record.data.src;
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
        this.iFrame = document.createElement("iframe");
        this.iFrame.src = "";
        this.iFrame.align = "top";
        this.iFrame.frameBorder = "0";
        this.iFrame.width = "100%";
        this.iFrame.height = "100%";
        this.iFrame.onload = Ext.bind(function () {
            var src = arguments[0].currentTarget.contentDocument.URL;
            Ext.each(this.menuStore.data.items, function (item, index) {
                var res = src.indexOf(item.data.src);
                if (res > 0) {
                    this.menuView.select(index);
                    var node = this.menuView.getNode(index),
                    plugin = this.menuView.getPlugin("docHelpPluginId");
                    if (plugin) {
                        plugin.scrollToElement(node);
                    }
                    return false;
                }
            },
            this);
        },
        this);
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
                listeners: {
                    afterrender: function (cmp) {
                        cmp.getEl().appendChild(me.iFrame);
                    }
                }
            }]
        }];
        this.callParent(arguments);
    },
    setApi: function (o) {
        if (o) {
            this.api = o;
        }
    },
    setLangConfig: function (lang) {
        if (lang) {
            lang = lang.split("-")[0];
            this.menuStore.getProxy().url = "resources/help/" + lang + "/Contents.json";
            this.menuStore.load();
            this.urlPref = "resources/help/" + lang + "/";
        }
    }
});