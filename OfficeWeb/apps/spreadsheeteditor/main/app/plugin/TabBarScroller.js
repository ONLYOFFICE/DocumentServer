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
 Ext.define("SSE.plugin.TabBarScroller", {
    alias: "plugin.tabbarscroller",
    constructor: function (config) {
        config = config || {};
        Ext.apply(this, config);
    },
    init: function (tabBar) {
        var me = this;
        Ext.apply(tabBar, me.parentOverrides);
        me.tabBar = tabBar;
        tabBar.on({
            render: function () {
                me.layout = me.tabBar.layout;
                if (me.lastButton) {
                    me.lastButton.on("click", me.scrollToLast, me);
                }
                if (me.firstButton) {
                    me.firstButton.on("click", me.scrollToFirst, me);
                }
                if (me.prevButton) {
                    me.beforeRepeater = Ext.create("Ext.util.ClickRepeater", me.prevButton.getEl(), {
                        interval: me.layout.overflowHandler.scrollRepeatInterval,
                        handler: me.layout.overflowHandler.scrollLeft,
                        scope: me.layout.overflowHandler
                    });
                }
                if (me.nextButton) {
                    me.afterRepeater = Ext.create("Ext.util.ClickRepeater", me.nextButton.getEl(), {
                        interval: me.layout.overflowHandler.scrollRepeatInterval,
                        handler: me.layout.overflowHandler.scrollRight,
                        scope: me.layout.overflowHandler
                    });
                }
                me.tabBar.addCls("asc-page-scroller");
                me.layout.overflowHandler.updateScrollButtons = Ext.Function.createSequence(me.layout.overflowHandler.updateScrollButtons, me.updateButtons, me);
                me.layout.overflowHandler.handleOverflow = Ext.Function.createSequence(me.layout.overflowHandler.handleOverflow, me.updateButtons, me);
                me.layout.overflowHandler.clearOverflow = Ext.Function.createSequence(me.layout.overflowHandler.clearOverflow, me.disableButtons, me);
            },
            single: true
        });
    },
    disableButtons: function () {
        var me = this;
        if (me.lastButton) {
            me.lastButton.addClsWithUI("disabled");
            me.lastButton.addCls("x-item-disabled");
            me.lastButton.disabled = true;
        }
        if (me.firstButton) {
            me.firstButton.addClsWithUI("disabled");
            me.firstButton.addCls("x-item-disabled");
            me.firstButton.disabled = true;
        }
        if (me.prevButton) {
            me.prevButton.addClsWithUI("disabled");
            me.prevButton.addCls("x-item-disabled");
            me.prevButton.disabled = true;
        }
        if (me.nextButton) {
            me.nextButton.addClsWithUI("disabled");
            me.nextButton.addCls("x-item-disabled");
            me.nextButton.disabled = true;
        }
    },
    scrollToFirst: function (e) {
        var me = this;
        me.layout.overflowHandler.scrollTo(0);
    },
    scrollToLast: function (e) {
        var me = this;
        me.layout.overflowHandler.scrollTo(me.layout.overflowHandler.getMaxScrollPosition());
    },
    updateButtons: function () {
        var me = this;
        var beforeMethAll = me.layout.overflowHandler.atExtremeBefore() ? "addClsWithUI" : "removeClsWithUI",
        afterMethAll = me.layout.overflowHandler.atExtremeAfter() ? "addClsWithUI" : "removeClsWithUI",
        beforeMeth = me.layout.overflowHandler.atExtremeBefore() ? "addCls" : "removeCls",
        afterMeth = me.layout.overflowHandler.atExtremeAfter() ? "addCls" : "removeCls",
        beforeDisabled = (beforeMeth == "addCls"),
        afterDisabled = (afterMeth == "addCls");
        if (me.lastButton) {
            me.lastButton[afterMethAll]("disabled");
            me.lastButton[afterMeth]("x-item-disabled");
            me.lastButton.disabled = afterDisabled;
        }
        if (me.nextButton) {
            me.nextButton[afterMethAll]("disabled");
            me.nextButton[afterMeth]("x-item-disabled");
            me.nextButton.disabled = afterDisabled;
        }
        if (me.firstButton) {
            me.firstButton[beforeMethAll]("disabled");
            me.firstButton[beforeMeth]("x-item-disabled");
            me.firstButton.disabled = beforeDisabled;
        }
        if (me.prevButton) {
            me.prevButton[beforeMethAll]("disabled");
            me.prevButton[beforeMeth]("x-item-disabled");
            me.prevButton.disabled = beforeDisabled;
        }
    }
});