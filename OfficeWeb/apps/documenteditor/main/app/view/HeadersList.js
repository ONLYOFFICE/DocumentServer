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
 Ext.define("DE.view.TreeHeaderModel", {
    extend: "Ext.data.Model",
    fields: [{
        name: "text",
        type: "string"
    },
    {
        name: "url",
        type: "string"
    },
    {
        name: "expanded",
        type: "boolean",
        defaultValue: false
    },
    {
        name: "leaf",
        type: "boolean",
        defaultValue: false
    }],
    hasMany: {
        model: "DE.view.TreeHeaderModel",
        name: "headers"
    }
});
Ext.define("DE.view.TreeHeaderModel2", {
    extend: "Ext.data.Model",
    fields: [{
        name: "headerText",
        type: "string"
    },
    {
        name: "headerLevel",
        type: "int",
        defaultValue: 0
    },
    {
        name: "headerId",
        type: "int",
        defaultValue: 0
    },
    {
        name: "treeLevel",
        type: "int",
        defaultValue: 0
    },
    {
        name: "expanded",
        type: "boolean",
        defaultValue: false
    },
    {
        name: "leaf",
        type: "boolean",
        defaultValue: false
    }],
    hasMany: {
        model: "DE.view.TreeHeaderModel2",
        name: "headers"
    }
});
Ext.define("DE.view.HeadersList", {
    extend: "Ext.panel.Panel",
    alias: "widget.deheaderslist",
    cls: "de-headerslist",
    bodyCls: "de-headerslist-body",
    requires: ["Ext.tree.Panel", "Ext.data.TreeStore"],
    layoutConfig: {
        type: "vbox",
        align: "stretch"
    },
    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    initComponent: function () {
        var data = {
            text: "MainHeader",
            headers: [{
                text: "Header 1",
                url: "some url",
                expanded: false,
                headers: [{
                    text: "Header 2",
                    leaf: true
                },
                {
                    text: "Header 3",
                    expanded: false,
                    headers: [{
                        text: "Header 4",
                        leaf: true
                    }]
                }]
            },
            {
                text: "Header 5",
                url: "some url",
                leaf: true
            },
            {
                text: "Header 6",
                url: "some url",
                expanded: false,
                headers: [{
                    text: "Header 7",
                    leaf: true
                },
                {
                    text: "Header 8",
                    expanded: false,
                    headers: [{
                        text: "Very Very Very Very Long Header 3",
                        leaf: true
                    }]
                }]
            }]
        };
        var data2 = {
            headerText: "MainHeader",
            headerLevel: 0,
            headers: [{
                headerText: "Header 1",
                headerLevel: 0,
                expanded: false,
                headers: [{
                    headerText: "Header 2",
                    headerLevel: 0,
                    leaf: true
                },
                {
                    headerText: "Header 3",
                    headerLevel: 0,
                    expanded: false,
                    headers: [{
                        headerText: "Header 4",
                        headerLevel: 0,
                        leaf: true
                    }]
                }]
            },
            {
                headerText: "Header 5",
                headerLevel: 0,
                leaf: true
            },
            {
                headerText: "Header 6",
                headerLevel: 0,
                expanded: false,
                headers: [{
                    headerText: "Header 7",
                    headerLevel: 0,
                    leaf: true
                },
                {
                    headerText: "Header 8",
                    headerLevel: 0,
                    expanded: false,
                    headers: [{
                        headerText: "Very Very Very Very Long Header 3",
                        headerLevel: 0,
                        leaf: true
                    }]
                }]
            }]
        };
        this._treestore = Ext.create("Ext.data.TreeStore", {
            model: "DE.view.TreeHeaderModel2",
            proxy: {
                type: "memory",
                reader: {
                    type: "json",
                    root: "headers"
                }
            }
        });
        this.headerListPanel = Ext.create("Ext.tree.Panel", {
            preventHeader: true,
            store: this._treestore,
            rootVisible: false,
            frame: false,
            layout: "fit",
            flex: 1,
            emptyText: "",
            cls: "x-headerslist-panel-context",
            lines: false,
            columns: [{
                xtype: "treecolumn",
                flex: 1,
                dataIndex: "headerText",
                renderer: function (value, metaData, record, rowIdx, colIdx, store, view) {
                    var _value = value || record.data.headerText;
                    var str = Ext.String.format('<span class="caption-inner">{0}</span><span class="caption-right-border"></span><span class="caption-right-border-padding"></span>', _value);
                    return str;
                }
            }],
            hideHeaders: true,
            viewConfig: {
                autoScroll: true,
                store: this._treestore,
                singleSelect: true,
                hideHeaders: true,
                rootVisible: false,
                listeners: {
                    itemupdate: function (record, index, node, eOpts) {
                        if (record.data.headerLevel - record.data.treeLevel > 0) {
                            var btn = node.querySelector("div.x-grid-cell-inner");
                            if (btn) {
                                for (var i = 0; i < (record.data.headerLevel - record.data.treeLevel); i++) {
                                    Ext.DomHelper.insertFirst(btn, {
                                        tag: "span",
                                        cls: "caption-add-left-padding"
                                    });
                                }
                            }
                        }
                    },
                    itemadd: function (records, index, nodes, eOpts) {
                        for (var j = 0; j < records.length; j++) {
                            if (records[j].data.headerLevel - records[j].data.treeLevel > 0) {
                                var btn = nodes[j].querySelector("div.x-grid-cell-inner");
                                if (btn) {
                                    for (var i = 0; i < (records[j].data.headerLevel - records[j].data.treeLevel); i++) {
                                        Ext.DomHelper.insertFirst(btn, {
                                            tag: "span",
                                            cls: "caption-add-left-padding"
                                        });
                                    }
                                }
                            }
                        }
                    },
                    refresh: function (view, eOpts) {
                        var nodes = view.getNodes();
                        var records = view.getRecords(nodes);
                        for (var i = 0; i < nodes.length; i++) {
                            var record = view.getRecord(nodes[i]);
                            if (record.data.headerLevel - record.data.treeLevel > 0) {
                                var btn = nodes[i].querySelector("div.x-grid-cell-inner");
                                if (btn) {
                                    for (var k = 0; k < (record.data.headerLevel - record.data.treeLevel); k++) {
                                        Ext.DomHelper.insertFirst(btn, {
                                            tag: "span",
                                            cls: "caption-add-left-padding"
                                        });
                                    }
                                }
                            }
                        }
                    },
                    scope: this
                }
            }
        });
        this.items = [{
            xtype: "label",
            cls: "de-headerslist-header",
            text: this.textHeaderList,
            margin: "0 0 0 20px"
        },
        {
            xtype: "tbspacer",
            height: 12
        },
        this.headerListPanel];
        this.addListener("resize", this._onResize, this);
        this.addListener("afterrender", this._onAfterRender, this);
        this.callParent(arguments);
    },
    setApi: function (api) {
        if (api == undefined) {
            return;
        }
        if (api) {
            this.api = api;
            this.api.asc_registerCallback("asc_onChangeHeaderList", Ext.bind(this._refreshHeaderList, this));
            this.api.asc_registerCallback("asc_onReturnHeaders", Ext.bind(this._refreshHeaderList, this));
            this.api.CollectHeaders();
        }
    },
    _refreshHeaderList: function (headers) {
        if (headers) {
            this._apiHeaders2Tree(headers);
            this._treestore.setRootNode(this._treeHeaders);
        }
    },
    moveToDocPosition: function (url) {
        if (this.api) {
            this.api.moveToDocPosition(url);
        }
    },
    _onResize: function (panel, adjWidth, adjHeight, eOpts) {
        var _height = this.getHeight() - 45;
        if (this.headerListPanel.getHeight() != _height && _height > 0) {
            this.headerListPanel.setHeight(_height);
        }
    },
    _onAfterRender: function (panel, eOpts) {},
    _apiHeaders2Tree: function (headers) {
        this._fakeHeaders = headers;
        this._treeHeaders = {
            headerText: "MainHeader",
            headerLevel: 0,
            headerId: -1,
            headers: []
        };
        this.index = 0;
        var level = 0;
        var parentNode = this._createNodeFromApiHeaders(this._fakeHeaders[this.index], this.index, level);
        this._treeHeaders.headers.push(parentNode);
        this.index++;
        while (this.index < this._fakeHeaders.length) {
            var nextNode = this._fakeHeaders[this.index];
            if (nextNode.get_Level() > parentNode.headerLevel) {
                this._fillChildHeaders(parentNode);
            } else {
                if (parentNode.headers == undefined) {
                    parentNode.leaf = true;
                }
                parentNode = this._createNodeFromApiHeaders(this._fakeHeaders[this.index], this.index, level);
                this._treeHeaders.headers.push(parentNode);
                this.index++;
            }
        }
        if (parentNode.headers == undefined) {
            parentNode.leaf = true;
        }
    },
    _createNodeFromApiHeaders: function (apiNode, index, level) {
        var treeNode = {
            headerText: apiNode.get_headerText(),
            headerLevel: apiNode.get_Level(),
            headerId: index,
            treeLevel: level
        };
        return treeNode;
    },
    _fillChildHeaders: function (parentNode) {
        if (parentNode.headers == undefined) {
            parentNode.expanded = true;
            parentNode.headers = [];
        }
        var newNode = this._createNodeFromApiHeaders(this._fakeHeaders[this.index], this.index, parentNode.treeLevel + 1);
        parentNode.headers.push(newNode);
        parentNode = newNode;
        this.index++;
        while (this.index < this._fakeHeaders.length) {
            var nextNode = this._fakeHeaders[this.index];
            if (nextNode.get_Level() > parentNode.headerLevel) {
                this._fillChildHeaders(parentNode);
            } else {
                if (parentNode.headers == undefined) {
                    parentNode.leaf = true;
                }
                break;
            }
        }
        if (parentNode.headers == undefined) {
            parentNode.leaf = true;
        }
    },
    textHeaderList: "Document Titles Navigation"
});