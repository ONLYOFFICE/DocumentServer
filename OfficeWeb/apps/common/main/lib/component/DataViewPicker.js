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
 Ext.define("Common.component.DataViewPicker", {
    extend: "Ext.container.Container",
    requires: (["Ext.data.Store", "Ext.data.Model", "Ext.view.View", "Ext.XTemplate", "Ext.container.Container", "Common.plugin.DataViewScrollPane"]),
    uses: ["Common.component.GroupedDataView"],
    alias: "widget.cmddataviewpicker",
    layout: {
        type: "fit"
    },
    constructor: function (config) {
        if (!config || !config.viewData) {
            throw Error("Common.component.DataViewPicker creation failed: required parameters are missing.");
        }
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    initComponent: function () {
        var me = this,
        cfg = Ext.apply({},
        me.initialConfig);
        me.selectedRec = null;
        Ext.define("DataModel", {
            extend: "Ext.data.Model",
            fields: [{
                name: "imageUrl"
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
        me.store = (Ext.isDefined(cfg.store)) ? cfg.store : Ext.create("Ext.data.Store", {
            storeId: Ext.id(),
            model: "DataModel",
            data: cfg.viewData
        });
        var dataTpl = (Ext.isDefined(cfg.dataTpl)) ? cfg.dataTpl : Ext.create("Ext.XTemplate", '<tpl for=".">', '<div class="thumb-wrap">', (me.itemWidth !== undefined && me.itemHeight !== undefined) ? '<img src="{imageUrl}" width="' + me.itemWidth + '" height="' + me.itemHeight + '"/>' : '<img src="{imageUrl}" />', '<tpl if="title">', '<span class="title">{title}</span>', "</tpl>", "</div>", "</tpl>");
        if (me.isGroupedDataView) {
            var dataListView = Ext.create("Common.component.GroupedDataView", {
                store: me.store,
                listeners: {
                    itemclick: function (view, record, htmlItem, index, event, eOpts) {
                        me.selectedRec = record;
                        me.fireEvent("select", me, record, htmlItem, index);
                    },
                    beforecontainerclick: function (view, event, eOpts) {
                        return false;
                    },
                    selectionchange: function (view, selections, eOpts) {
                        var plugin = dataListView.getPlugin("scrollpane"),
                        node = dataListView.getNode(selections[0]);
                        if (plugin && node) {
                            plugin.scrollToElement(node);
                        }
                        me.fireEvent("selectionchange", me, view, selections);
                    },
                    itemkeydown: function (picker, record, item, index, e, opts) {
                        if (e.getKey() == e.ENTER) {
                            picker.fireEvent("itemclick", picker, record, item, index, e, opts);
                        }
                    }
                },
                plugins: [{
                    ptype: "dataviewscrollpane",
                    areaSelector: ".grouped-data-view",
                    pluginId: "scrollpane",
                    settings: {
                        enableKeyboardNavigation: true,
                        keyboardSpeed: 0.001,
                        contentWidth: me.contentWidth
                    }
                }]
            });
        } else {
            var dataListView = Ext.create("Ext.view.View", {
                store: me.store,
                tpl: dataTpl,
                singleSelect: true,
                trackOver: true,
                autoScroll: true,
                overItemCls: "x-item-over",
                itemSelector: "div.thumb-wrap",
                emptyText: "",
                cls: "storage-data-view",
                listeners: {
                    itemclick: function (view, record, htmlItem, index, event, eOpts) {
                        me.selectedRec = record;
                        me.fireEvent("select", me, record, htmlItem, index);
                    },
                    beforecontainerclick: function (view, event, eOpts) {
                        return false;
                    },
                    selectionchange: function (view, selections, eOpts) {
                        me.fireEvent("selectionchange", me, view, selections);
                    },
                    itemkeydown: function (picker, record, item, index, e, opts) {
                        if (e.getKey() == e.ENTER) {
                            picker.fireEvent("itemclick", picker, record, item, index, e, opts);
                        }
                    },
                    itemmouseenter: function (obj, record, item, index, e, eOpts) {
                        me.fireEvent("itemmouseenter", me, record, item, index, e, eOpts);
                    },
                    itemmouseleave: function (obj, record, item, index, e, eOpts) {
                        me.fireEvent("itemmouseleave", me, record, item, index, e, eOpts);
                    }
                },
                plugins: [{
                    ptype: "dataviewscrollpane",
                    areaSelector: ".storage-data-view",
                    pluginId: "scrollpane",
                    settings: {
                        enableKeyboardNavigation: true,
                        keyboardSpeed: 0.001,
                        contentWidth: me.contentWidth
                    }
                }]
            });
        }
        me.addEvents("select", "itemmouseenter", "itemmouseleave");
        if (me.handler) {
            me.on("select", me.handler, me.scope, me);
        }
        me.getSelectedRec = function () {
            return (me.isGroupedDataView) ? dataListView.getSelected() : dataListView.getSelectionModel().getSelection()[0];
        };
        me.selectByIndex = function (index, fireevent) {
            if (dataListView.rendered) {
                if (index < 0) {
                    dataListView.getSelectionModel().deselectAll(false);
                    me.selectedRec = null;
                } else {
                    var fire = Ext.isDefined(fireevent) ? fireevent : true;
                    me.selectedRec = me.store.getAt(index);
                    dataListView.getSelectionModel().select(me.store.getAt(index), false, fire);
                }
            } else {
                dataListView.on("afterrender", Ext.bind(function (idx) {
                    me.selectByIndex(idx);
                },
                this, [index]), {
                    single: true
                });
            }
        };
        me.selectGroupItem = function (group, item) {
            if (!me.isGroupedDataView || !dataListView) {
                return null;
            }
            me.selectedRec = dataListView.selectGroupItem(group, item);
            return me.selectedRec;
        };
        me.updateScrollPane = function () {
            var plugin = dataListView.getPlugin("scrollpane");
            if (plugin && dataListView.getEl() && dataListView.getEl().getWidth() > 0) {
                if (plugin.settings) {
                    plugin.settings.contentWidth = me.contentWidth;
                }
                plugin.updateScrollPane(dataListView.getEl().dom);
                me.checkScrolls();
                if (me.arrangeItems) {
                    me.arrangeItems.call(me);
                }
            }
        };
        me.checkScrolls = function () {
            var plugin = dataListView.getPlugin("scrollpane");
            if (plugin && dataListView.getEl()) {
                var jspElem = me.getEl().down(".jspPane");
                if (jspElem.getHeight() > 0 && me.getEl().getHeight() > 0) {
                    var i = 0;
                    var updatescroll = setInterval(function () {
                        if (jspElem.getHeight() > me.getEl().getHeight()) {
                            if (me.getEl().down(".jspVerticalBar")) {
                                clearInterval(updatescroll);
                            } else {
                                plugin.updateScrollPane(dataListView.getEl().dom);
                                clearInterval(updatescroll);
                            }
                        }
                        if (i++>3) {
                            clearInterval(updatescroll);
                        }
                    },
                    100);
                }
            }
        };
        me.showUpdated = function () {
            me.updateScrollPane();
            if (dataListView && dataListView.getEl()) {
                dataListView.getEl().focus(50);
                if (me.selectedRec) {
                    dataListView.getSelectionModel().select(me.selectedRec, false, false);
                } else {
                    dataListView.getSelectionModel().deselectAll(false);
                }
            }
        };
        dataListView.getStore().on("datachanged", me.updateScrollPane, me, {
            buffer: 10
        });
        dataListView.on("viewready", me.updateScrollPane, me);
        me.on("resize", me.updateScrollPane, me);
        me.on("afterlayout", me.updateScrollPane, me);
        me.items = [dataListView];
        this.callParent(arguments);
    }
});