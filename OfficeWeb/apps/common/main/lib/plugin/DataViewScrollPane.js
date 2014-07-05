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
 Ext.define("Common.plugin.DataViewScrollPane", {
    extend: "Common.plugin.ScrollPane",
    alias: "plugin.dataviewscrollpane",
    areaSelector: ".x-component",
    init: function (cmp) {
        var me = this,
        store;
        me.callParent(arguments);
        store = me.cmp.getStore();
        if (store) {
            store.on("datachanged", function () {
                me.cmp && me.cmp.rendered && me.cmp.getWidth() > 0 && me.cmp.getHeight() > 0 && me.updateScrollPane();
            },
            me, {
                buffer: 10
            });
        }
        me.cmp.on("viewready", me.onViewReady, me, {
            single: true
        });
    },
    onKeyDown: function (e, eOpts) {
        var me = this;
        var store = me.cmp.getStore();
        var highlightAt = function (index) {
            var item = me.cmp.getNode(store.getAt(index)),
            itemEl = Ext.create("Ext.Element", item);
            if (item) {
                var container = Ext.getDom(me.cmp.getTargetEl()) || Ext.getBody().dom;
                var offsets = itemEl.getOffsetsTo(container),
                top = offsets[1] + container.scrollTop,
                bottom = top + item.offsetHeight,
                ctClientHeight = container.clientHeight,
                ctScrollTop = parseInt(container.scrollTop, 10),
                ctBottom = ctScrollTop + ctClientHeight;
                if (item.offsetHeight > ctClientHeight || top < ctScrollTop) {
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
            case e.DOWN:
            var currItem = me.cmp.getSelectionModel().getLastSelected(),
            currItemIdx = currItem ? store.indexOf(currItem) : -1;
            highlightAt(currItemIdx);
            break;
        case e.PAGE_UP:
            case e.PAGE_DOWN:
            break;
        case e.HOME:
            me.cmp.select(0);
            highlightAt(0);
            break;
        case e.END:
            me.cmp.select(store.count() - 1);
            highlightAt(store.count() - 1);
            break;
        }
    },
    onViewReady: function () {
        var me = this;
        me.cmp.getEl().on("keydown", me.onKeyDown, me);
    }
});