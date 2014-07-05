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
 Ext.define("Common.component.GroupedDataView", {
    extend: "Ext.DataView",
    alias: "widget.cmdgroupeddataview",
    requires: (["Common.model.GroupItem", "Common.model.Group", "Ext.XTemplate"]),
    selModel: {
        enableKeyNav: false
    },
    tpl: new Ext.XTemplate('<tpl for=".">', '<div class="asc-grouped-data">', '<div class="group-description">', '<span class="description-text">{[values[this.fieldGroupName]]}</span>', "</div>", '<div class="group-items-container">', '<tpl for="getGroupItems">', '<div class="group-item">', '<span class="{iconcls}"></span>', "</div>", "</tpl>", "</div>", "</div>", '<div class="asc-grouped-data-selector"></div>', "</tpl>", {
        compiled: true,
        fieldGroupName: "groupname"
    }),
    itemSelector: "div.group-item",
    trackOver: true,
    overItemCls: "group-item-over",
    cls: "grouped-data-view",
    listeners: {
        beforecontainerclick: function (o, e, eOpts) {
            return false;
        },
        viewready: function () {
            if (this.delayedSelection) {
                this.getSelectionModel().doSingleSelect(this.delayedSelection);
                this.delayedSelection = undefined;
            }
        }
    },
    constructor: function (config) {
        if (config.selModel) {
            config.selModel.enableKeyNav = false;
        }
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    initComponent: function () {
        this.callParent(arguments);
    },
    updateIndexes: function (startIndex, endIndex) {
        var ns = this.all.elements,
        records = [],
        i;
        this.store.each(function (item, index, count) {
            Ext.Array.insert(records, records.length, item.getGroupItems().getRange());
        });
        startIndex = startIndex || 0;
        endIndex = endIndex || ((endIndex === 0) ? 0 : (ns.length - 1));
        for (i = startIndex; i <= endIndex; i++) {
            ns[i].viewIndex = i;
            ns[i].viewRecordId = records[i].internalId;
            if (!ns[i].boundView) {
                ns[i].boundView = this.id;
            }
        }
    },
    getRecord: function (node) {
        var record_out, record, i = -1,
        c = this.store.getCount();
        while (!record_out && ++i < c) {
            record = this.store.getAt(i);
            if (record) {
                record_out = record.getGroupItems().data.getByKey(Ext.getDom(node).viewRecordId);
            }
        }
        return record_out;
    },
    onRender: function (cmp) {
        this.callParent(arguments);
        var me = this;
        me.el.set({
            tabIndex: -1
        });
        me.keyNav = Ext.create("Ext.util.KeyNav", me.el, {
            down: Ext.pass(me.onNavKey, [1, 1], me),
            right: Ext.pass(me.onNavKey, [1, null], me),
            left: Ext.pass(me.onNavKey, [-1, null], me),
            up: Ext.pass(me.onNavKey, [-1, -1], me),
            scope: me
        });
    },
    onNavKey: function (step, shift) {
        step = step || 1;
        var selected = this.getSelectionModel().getSelection()[0],
        numRecords = this.all.elements.length,
        idx;
        if (selected) {
            if (shift) {
                var info = this.getIndexInStore(selected);
                step = this.getShiftedStep(info, shift);
            }
            idx = this.indexOf(this.getNode(selected)) + step;
        } else {
            idx = 0;
        }
        if (idx < 0) {
            idx = numRecords - 1;
        } else {
            if (idx >= numRecords) {
                idx = 0;
            }
        }
        var record = this.getRecord(this.all.elements[idx]);
        this.getSelectionModel().doSingleSelect(record);
    },
    getIndexInStore: function (record) {
        var out = [],
        group,
        localindex,
        groupindex = -1,
        c = this.store.getCount();
        while (++groupindex < c) {
            group = this.store.getAt(groupindex);
            localindex = group.getGroupItems().indexOf(record);
            if (! (localindex < 0)) {
                out = [groupindex, localindex, group.getGroupItems().getCount()];
                break;
            }
        }
        return out;
    },
    getShiftedStep: function (info, direct) {
        var groupindex = info[0] + direct;
        if (groupindex < 0) {
            groupindex = this.store.getCount() - 1;
        } else {
            if (! (groupindex < this.store.getCount())) {
                groupindex = 0;
            }
        }
        var group = this.store.getAt(groupindex);
        if (direct > 0) {
            var newindex = info[1] < group.getGroupItems().getCount() ? info[1] : group.getGroupItems().getCount() - 1;
            newindex += info[2] - info[1];
        } else {
            newindex = info[1] < group.getGroupItems().getCount() ? info[1] - group.getGroupItems().getCount() : -1;
            newindex -= info[1];
        }
        return newindex;
    },
    refresh: function () {
        this.callParent(arguments);
    },
    selectGroupItem: function (group, item) {
        var record = this.store.findRecord("group", group);
        if (record) {
            record = record.getGroupItems().findRecord("groupitem", item);
            if (!this.rendered) {
                this.delayedSelection = record;
            } else {
                if (record) {
                    this.getSelectionModel().doSingleSelect(record);
                }
            }
        }
        return record;
    },
    getSelected: function () {
        return this.delayedSelection || this.getSelectionModel().getSelection()[0];
    }
});