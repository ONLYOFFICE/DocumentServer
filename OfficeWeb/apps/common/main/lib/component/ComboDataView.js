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
 Ext.define("Common.component.ComboDataView", {
    extend: "Ext.container.Container",
    requires: (["Ext.data.Model", "Ext.data.Store", "Ext.view.View", "Ext.XTemplate"]),
    alias: "widget.commoncombodataview",
    padding: 4,
    itemWidth: 80,
    itemHeight: 40,
    menuHeight: 100,
    menuMaxHeight: 500,
    minWidth: 150,
    emptyComboText: "No styles",
    handleGlobalResize: false,
    constructor: function (config) {
        if (!config || !config.viewData || !config.itemWidth || !config.itemHeight) {
            throw Error("ComboDataView creation failed: required parameters are missing.");
        }
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    initComponent: function () {
        var me = this,
        cfg = Ext.apply({},
        me.initialConfig);
        var borderSize = 0;
        var paddingLeftDV = 0;
        var paddingRightDV = 0;
        var paddingLeftItem = 0;
        var paddingRightItem = 0;
        var marginRightItem = 0;
        var initCSSRules = true;
        var borderRule = Ext.util.CSS.getRule(".storage-combodataview");
        if (borderRule) {
            borderSize = parseInt(borderRule.style.borderWidth);
            if (isNaN(borderSize)) {
                borderSize = 0;
            }
        }
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
        var fieldStore = Ext.create("Ext.data.Store", {
            storeId: Ext.id(),
            model: (Ext.isDefined(cfg.store)) ? cfg.store.model : "DataModel",
            data: cfg.viewData
        });
        var dataTpl = (Ext.isDefined(cfg.dataTpl)) ? cfg.dataTpl : Ext.create("Ext.XTemplate", '<tpl for=".">', '<div class="thumb-wrap">', '<img src="{imageUrl}" width="' + me.itemWidth + '" height="' + me.itemHeight + '"/>', '<tpl if="title">', '<span class="title">{title}</span>', "</tpl>", "</div>", "</tpl>");
        this.dataMenu = Ext.widget("cmdmenudataviewpicker", {
            width: me.width,
            height: me.menuHeight,
            cls: "x-dataview-combo-menu",
            viewData: cfg.viewData,
            dataTpl: cfg.dataTpl,
            store: cfg.store,
            itemWidth: me.itemWidth,
            itemHeight: me.itemHeight,
            constrain: false,
            pickerpadding: (me.padding - 1),
            listeners: {
                hide: function (ct, eOpts) {
                    me.fireEvent("menuhide", me, ct);
                }
            }
        });
        var fieldDataView = Ext.widget("dataview", {
            store: fieldStore,
            tpl: dataTpl,
            singleSelect: true,
            trackOver: true,
            style: "overflow:auto",
            overItemCls: "x-item-over",
            itemSelector: "div.thumb-wrap",
            emptyText: '<div class="emptyText">' + me.emptyComboText + "</div>",
            deferEmptyText: false,
            cls: "x-view-context",
            listeners: {
                itemclick: function (view, record, item, index, event, eOpts) {
                    if (cfg.repeatedselect && view.getSelectionModel().getLastSelected() !== null && view.getSelectionModel().getLastSelected().id == record.id) {
                        me.fireEvent("select", me, record);
                    }
                },
                afterrender: Ext.bind(function (ct, eOpts) {
                    if (fieldStore.getCount() > 0) {
                        ct.select(fieldStore.getAt(0));
                        this.dataMenu.picker.selectByIndex(0);
                    }
                },
                this),
                beforecontainerclick: function (view, event, eOpts) {
                    return false;
                },
                itemdblclick: function (view, record, item, index, event, eOpts) {
                    me.fireEvent("releasecapture", me);
                }
            }
        });
        var fieldContainer = Ext.widget("container", {
            flex: 1,
            height: me.height - 2 * (me.padding + borderSize),
            items: [fieldDataView]
        });
        var btnMenu = Ext.widget("button", {
            cls: "x-btn-combodataview",
            height: me.height - 2 * (me.padding + borderSize),
            handler: Ext.bind(function (btn, e) {
                if (initCSSRules) {
                    me.getDataViewCSSRules();
                }
                var maxViewCount = Math.floor((me.getEl().getWidth()) / (me.itemWidth + paddingLeftItem + paddingRightItem));
                var countRec = me.dataMenu.picker.store.getCount();
                var menuRowsCount = Math.ceil(countRec / maxViewCount);
                if (menuRowsCount > 1) {
                    var height = menuRowsCount * (me.itemHeight + 2 * marginRightItem + paddingLeftItem + paddingRightItem) + 6,
                    maxHeight = Math.min(me.menuMaxHeight, Ext.Element.getViewportHeight() - this.getPosition()[1] - 6);
                    if (height > maxHeight) {
                        height = maxHeight;
                    }
                    me.dataMenu.show();
                    me.dataMenu.setSize(me.getEl().getWidth(), height);
                    me.dataMenu.showBy(fieldContainer, "tl-tl", [-me.padding + borderSize, -me.padding + borderSize]);
                }
            },
            this)
        });
        this.fillComboView = function (record, forceSelect, forceFill) {
            if (Ext.isDefined(record)) {
                var store = me.dataMenu.picker.store;
                if (store) {
                    if (forceFill || fieldStore.find("uid", record.data.uid) < 0) {
                        if (initCSSRules) {
                            me.getDataViewCSSRules();
                        }
                        fieldStore.removeAll();
                        var indexRec = store.indexOf(record),
                        countRec = store.getCount(),
                        maxViewCount = Math.floor((fieldContainer.getWidth()) / (me.itemWidth + paddingLeftItem + paddingRightItem)),
                        newStyles = [];
                        if (fieldContainer.getHeight() / me.itemHeight > 2) {
                            maxViewCount *= Math.floor(fieldContainer.getHeight() / me.itemHeight);
                        }
                        if (indexRec < 0) {
                            return;
                        }
                        indexRec = Math.floor(indexRec / maxViewCount) * maxViewCount;
                        for (var index = indexRec, viewCount = 0; index < countRec && viewCount < maxViewCount; index++, viewCount++) {
                            var rec = store.getAt(index);
                            var obj = {};
                            for (var i = 0; i < rec.fields.length; i++) {
                                obj[rec.fields.items[i].name] = rec.data[rec.fields.items[i].name];
                            }
                            newStyles.push(obj);
                        }
                        fieldStore.add(newStyles);
                    }
                    if (forceSelect) {
                        var selectIndex = fieldStore.find("uid", record.data.uid);
                        if (selectIndex > -1) {
                            fieldDataView.select(fieldStore.getAt(selectIndex), false, true);
                        }
                    }
                }
            }
        };
        this.selectByIndex = function (index) {
            if (index < 0) {
                fieldDataView.getSelectionModel().deselectAll(false);
            }
            me.dataMenu.picker.selectByIndex(index, false);
        };
        var onMenuSelect = function (picker, record) {
            me.fillComboView(record, true);
            if (record) {
                me.fireEvent("select", me, record);
            }
        };
        var onSelectionChange = function (view, selections, eOpts) {
            var record = selections[0];
            if (record) {
                me.dataMenu.picker.selectByIndex(me.dataMenu.picker.store.findExact("uid", record.get("uid")), false);
                me.fireEvent("select", me, record);
            }
        };
        var onPickerSelectionChange = function (picker, view, selections) {
            me.fillComboView(selections[0], true);
        };
        var doResizeCmp = function (width, height) {
            if (me.dataMenu) {
                me.dataMenu.setWidth(width);
                me.dataMenu.hide();
                var picker = me.dataMenu.picker;
                if (picker) {
                    var record = picker.getSelectedRec();
                    me.fillComboView(record || picker.store.getAt(0), !!record, true);
                }
            }
        };
        if (me.handleGlobalResize) {
            me.on("afterrender", function (cmp) {
                var innerBoxEl = cmp.getEl().down(".x-box-inner");
                if (innerBoxEl) {
                    innerBoxEl.addCls("combodataview-auto-width");
                }
            },
            this);
            Ext.EventManager.onWindowResize(function () {
                var cmpEl = me.getEl();
                if (cmpEl) {
                    me.doLayout();
                    doResizeCmp(cmpEl.getWidth());
                }
            },
            this);
        } else {
            me.on("resize", function (o, adjw, adjh) {
                doResizeCmp(adjw, adjh);
            },
            this);
        }
        this.dataMenu.addListener("select", onMenuSelect, me);
        this.dataMenu.picker.addListener("selectionchange", onPickerSelectionChange, me);
        fieldDataView.addListener("selectionchange", onSelectionChange, me);
        me.addEvents("select", "menuhide", "releasecapture");
        me.addListener("afterrender", function () {
            Ext.util.CSS.refreshCache();
            var menuDataViewItemRule = Ext.util.CSS.getRule(".x-dataview-combo-menu .storage-data-view .thumb-wrap");
            if (menuDataViewItemRule) {
                paddingLeftItem = parseInt(menuDataViewItemRule.style.paddingLeft);
                if (isNaN(paddingLeftItem)) {
                    paddingLeftItem = 0;
                }
                paddingRightItem = parseInt(menuDataViewItemRule.style.paddingRight);
                if (isNaN(paddingRightItem)) {
                    paddingRightItem = 0;
                }
                marginRightItem = parseInt(menuDataViewItemRule.style.marginRight);
                if (isNaN(marginRightItem)) {
                    marginRightItem = 0;
                }
                initCSSRules = false;
            }
            Ext.defer(function () {
                me.dataMenu.showAt([-10000, -10000]);
                me.fireEvent("releasecapture", me);
            },
            100);
        },
        this);
        me.getDataViewCSSRules = function () {
            if (me.dataMenu.picker.getEl()) {
                var thumb = me.dataMenu.picker.getEl().down(".thumb-wrap");
                if (thumb) {
                    paddingLeftItem = parseInt(thumb.getStyle("paddingLeft"));
                    if (isNaN(paddingLeftItem)) {
                        paddingLeftItem = 0;
                    }
                    paddingRightItem = parseInt(thumb.getStyle("paddingRight"));
                    if (isNaN(paddingRightItem)) {
                        paddingRightItem = 0;
                    }
                    marginRightItem = parseInt(thumb.getStyle("marginRight"));
                    if (isNaN(marginRightItem)) {
                        marginRightItem = 0;
                    }
                    initCSSRules = false;
                }
            }
        };
        Ext.apply(me, {
            layout: {
                type: "hbox",
                align: "stretch"
            },
            cls: "storage-combodataview",
            items: [fieldContainer, btnMenu]
        },
        cfg);
        this.callParent(arguments);
    }
});