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
 Ext.define("Common.plugin.MenuExpand", {
    extend: "Ext.AbstractPlugin",
    alias: "plugin.menuexpand",
    init: function (cmp) {
        var me = this,
        originLeave = cmp.onMouseLeave;
        cmp.onMouseLeave = function (e) {
            originLeave.apply(cmp, arguments);
            if (cmp.parentItem) {
                cmp.parentItem.menuEntered = false;
            }
        };
        cmp.onMouseOver = me.onMouseOver;
        cmp.checkItemMenuEntered = me.checkItemMenuEntered;
        me.callParent(arguments);
    },
    checkItemMenuEntered: function () {
        var me = this;
        if (me.activeItem && me.activeItem.menuEntered && me.MouseOverInterval) {
            clearInterval(me.MouseOverInterval);
            me.MouseOverInterval = undefined;
            me.activeItem.menuEntered = false;
            if (me.checkeditem) {
                me.checkeditem.el.removeCls(me.checkeditem.activeCls);
            }
            me.activeItem.el.addCls(me.activeItem.activeCls);
        }
    },
    onMouseOver: function (e) {
        var me = this,
        fromEl = e.getRelatedTarget(),
        mouseEnter = !me.el.contains(fromEl),
        item = me.getItemFromEvent(e);
        if (mouseEnter && me.parentMenu) {
            me.parentMenu.setActiveItem(me.parentItem);
            me.parentMenu.mouseMonitor.mouseenter();
        }
        if (me.disabled) {
            return;
        }
        if (me.checkeditem && item != me.checkeditem) {
            me.checkeditem.el.removeCls(me.checkeditem.activeCls);
        }
        if (me.checkeditem = item) {
            me.checkeditem.el.addCls(me.checkeditem.activeCls);
        }
        if (me.activeItem && me.activeItem.menu) {
            if (item && (item != me.activeItem && item != me.focusedItem) && me.MouseOverInterval === undefined) {
                var counter = 0;
                me.activeItem.menuEntered = false;
                me.MouseOverInterval = setInterval(function () {
                    me.checkItemMenuEntered();
                    if (counter++>8) {
                        clearInterval(me.MouseOverInterval);
                        me.MouseOverInterval = undefined;
                        if (me.checkeditem) {
                            me.setActiveItem(me.checkeditem);
                            if (me.checkeditem.activated && me.checkeditem.expandMenu) {
                                me.checkeditem.expandMenu();
                            }
                        }
                    }
                },
                20);
            }
        } else {
            if (item) {
                me.setActiveItem(item);
                if (item.activated && item.expandMenu) {
                    item.expandMenu();
                }
            }
        }
        if (mouseEnter) {
            if (me.parentItem) {
                me.parentItem.menuEntered = true;
            }
            me.fireEvent("mouseenter", me, e);
        }
        me.fireEvent("mouseover", me, item, e);
    }
});