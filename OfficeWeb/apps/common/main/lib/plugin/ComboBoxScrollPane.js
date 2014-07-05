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
 Ext.define("Common.plugin.ComboBoxScrollPane", {
    extend: "Common.plugin.ScrollPane",
    alias: "plugin.comboboxscrollpane",
    areaSelector: ".list-ct",
    init: function (comboBox) {
        comboBox.on("expand", this.onExpand, this);
    },
    onExpand: function (comboBox) {
        var me = this;
        if (!me.picker) {
            me.picker = comboBox.getPicker();
            me.picker.on({
                viewready: me.onViewReady,
                resize: function () {
                    me.updateScrollPane();
                },
                beforecontainerclick: function () {
                    return false;
                },
                beforeitemmouseenter: function (picker, record, item, index, event, opts) {
                    if (comboBox.scrolllocked) {
                        return false;
                    }
                },
                scope: me
            });
            me.cmp.on("afterlayout", me.onViewReady, me, {
                single: true
            });
            comboBox.on("keydown", me.onKeyDown, me);
            var store = comboBox.getStore();
            store.on("datachanged", me.onDataChanged, me, {
                buffer: 10
            });
        }
    },
    onKeyDown: function (cmp, e, eOpts) {
        var me = this;
        var highlightAt = function (index) {
            var boundList = me.picker,
            item = boundList.all.item(index);
            if (item) {
                var container = Ext.getDom(boundList.getTargetEl()) || Ext.getBody().dom;
                var el = item.dom,
                offsets = item.getOffsetsTo(container),
                top = offsets[1] + container.scrollTop,
                bottom = top + el.offsetHeight,
                ctClientHeight = container.clientHeight,
                ctScrollTop = parseInt(container.scrollTop, 10),
                ctBottom = ctScrollTop + ctClientHeight;
                if (el.offsetHeight > ctClientHeight || top < ctScrollTop) {
                    if (me.jspApi) {
                        me.jspApi.scrollByY(top, false);
                    }
                } else {
                    if (bottom > ctBottom) {
                        if (me.jspApi) {
                            me.jspApi.scrollByY(bottom - ctClientHeight, false);
                        }
                    }
                }
            }
        };
        switch (e.getKey()) {
        case e.UP:
            var boundList = me.picker,
            allItems = boundList.all,
            oldItem = boundList.highlightedItem,
            oldItemIdx = oldItem ? boundList.indexOf(oldItem) : -1,
            newItemIdx = oldItemIdx > 0 ? oldItemIdx - 1 : allItems.getCount() - 1;
            highlightAt(newItemIdx);
            break;
        case e.DOWN:
            var boundList = me.picker,
            allItems = boundList.all,
            oldItem = boundList.highlightedItem,
            oldItemIdx = oldItem ? boundList.indexOf(oldItem) : -1,
            newItemIdx = oldItemIdx < allItems.getCount() - 1 ? oldItemIdx + 1 : 0;
            highlightAt(newItemIdx);
            break;
        case e.PAGE_UP:
            case e.PAGE_DOWN:
            break;
        case e.HOME:
            highlightAt(0);
            break;
        case e.END:
            highlightAt(me.picker.all.getCount() - 1);
            break;
        }
    },
    onViewReady: function () {
        var me = this;
        me.initScrollPane(me.picker.getEl().dom);
    },
    onDataChanged: function () {
        var me = this;
        if (me.picker.getWidth() && me.picker.getHeight()) {
            me.initScrollPane(me.picker.getEl().dom);
        }
    }
});