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
 Ext.define("SSE.ux.BoxReorderer", {
    mixins: {
        observable: "Ext.util.Observable"
    },
    itemSelector: ".x-box-item",
    animate: 100,
    constructor: function () {
        this.addEvents("startdrag", "drag", "changeindex", "drop");
        this.mixins.observable.constructor.apply(this, arguments);
    },
    init: function (container) {
        this.container = container;
        this.container.afterLayout = Ext.Function.createSequence(this.container.afterLayout, this.afterFirstLayout, this);
        container.destroy = Ext.Function.createSequence(container.destroy, this.onContainerDestroy, this);
    },
    onContainerDestroy: function () {
        if (this.dd) {
            this.dd.unreg();
        }
    },
    afterFirstLayout: function () {
        var me = this,
        l = me.container.getLayout();
        delete me.container.afterLayout;
        me.dd = Ext.create("Ext.dd.DD", l.innerCt, me.container.id + "-reorderer");
        Ext.apply(me.dd, {
            animate: me.animate,
            reorderer: me,
            container: me.container,
            getDragCmp: this.getDragCmp,
            clickValidator: Ext.Function.createInterceptor(me.dd.clickValidator, me.clickValidator, me, false),
            onMouseDown: me.onMouseDown,
            startDrag: me.startDrag,
            onDrag: me.onDrag,
            endDrag: me.endDrag,
            getNewIndex: me.getNewIndex,
            doSwap: me.doSwap,
            findReorderable: me.findReorderable
        });
        me.dd.dim = l.parallelPrefix;
        me.dd.startAttr = l.parallelBefore;
        me.dd.endAttr = l.parallelAfter;
    },
    getDragCmp: function (e) {
        return this.container.getChildByElement(e.getTarget(this.itemSelector, 10));
    },
    clickValidator: function (e) {
        var cmp = this.getDragCmp(e);
        return !! (cmp && cmp.reorderable !== false);
    },
    onMouseDown: function (e) {
        var me = this,
        container = me.container,
        containerBox, cmpEl, cmpBox;
        me.dragCmp = me.getDragCmp(e);
        if (me.dragCmp) {
            cmpEl = me.dragCmp.getEl();
            me.startIndex = me.curIndex = container.items.indexOf(me.dragCmp);
            cmpBox = cmpEl.getPageBox();
            me.lastPos = cmpBox[this.startAttr];
            containerBox = container.el.getPageBox();
            if (me.dim === "width") {
                me.minX = containerBox.left;
                me.maxX = containerBox.right - cmpBox.width;
                me.minY = me.maxY = cmpBox.top;
                me.deltaX = e.getPageX() - cmpBox.left;
            } else {
                me.minY = containerBox.top;
                me.maxY = containerBox.bottom - cmpBox.height;
                me.minX = me.maxX = cmpBox.left;
                me.deltaY = e.getPageY() - cmpBox.top;
            }
            me.constrainY = me.constrainX = true;
        }
    },
    startDrag: function () {
        var me = this;
        if (me.dragCmp) {
            me.dragCmp.setPosition = Ext.emptyFn;
            if (!me.container.layout.animate && me.animate) {
                me.container.layout.animate = me.animate;
                me.removeAnimate = true;
            }
            me.dragElId = me.dragCmp.getEl().id;
            me.reorderer.fireEvent("StartDrag", me, me.container, me.dragCmp, me.curIndex);
            me.dragCmp.suspendEvents();
            me.dragCmp.disabled = true;
            me.dragCmp.el.setStyle("zIndex", 100);
        } else {
            me.dragElId = null;
        }
    },
    findReorderable: function (newIndex) {
        var me = this,
        items = me.container.items,
        newItem;
        if (items.getAt(newIndex).reorderable === false) {
            newItem = items.getAt(newIndex);
            if (newIndex > me.startIndex) {
                while (newItem && newItem.reorderable === false) {
                    newIndex++;
                    newItem = items.getAt(newIndex);
                }
            } else {
                while (newItem && newItem.reorderable === false) {
                    newIndex--;
                    newItem = items.getAt(newIndex);
                }
            }
        }
        newIndex = Math.min(Math.max(newIndex, 0), items.getCount() - 1);
        if (items.getAt(newIndex).reorderable === false) {
            return -1;
        }
        return newIndex;
    },
    doSwap: function (newIndex) {
        var me = this,
        items = me.container.items,
        orig, dest, tmpIndex;
        newIndex = me.findReorderable(newIndex);
        if (newIndex === -1) {
            return;
        }
        me.reorderer.fireEvent("ChangeIndex", me, me.container, me.dragCmp, me.startIndex, newIndex);
        orig = items.getAt(me.curIndex);
        dest = items.getAt(newIndex);
        items.remove(orig);
        tmpIndex = Math.min(Math.max(newIndex, 0), items.getCount() - 1);
        items.insert(tmpIndex, orig);
        items.remove(dest);
        items.insert(me.curIndex, dest);
        me.container.layout.layout();
        me.curIndex = newIndex;
    },
    onDrag: function (e) {
        var me = this,
        newIndex;
        newIndex = me.getNewIndex(e.getPoint());
        if ((newIndex !== undefined)) {
            me.reorderer.fireEvent("Drag", me, me.container, me.dragCmp, me.startIndex, me.curIndex);
            me.doSwap(newIndex);
        }
    },
    endDrag: function (e) {
        e.stopEvent();
        var me = this;
        if (me.dragCmp) {
            delete me.dragElId;
            if (me.animate) {
                me.container.layout.animate = {
                    callback: Ext.Function.bind(me.reorderer.afterBoxReflow, me)
                };
            }
            delete me.dragCmp.setPosition;
            me.container.layout.layout();
            if (me.removeAnimate) {
                delete me.removeAnimate;
                delete me.container.layout.animate;
            } else {
                me.reorderer.afterBoxReflow.call(me);
            }
            me.reorderer.fireEvent("drop", me, me.container, me.dragCmp, me.startIndex, me.curIndex);
        }
    },
    afterBoxReflow: function () {
        var me = this;
        me.dragCmp.el.setStyle("zIndex", "");
        me.dragCmp.disabled = false;
        me.dragCmp.resumeEvents();
    },
    getNewIndex: function (pointerPos) {
        var me = this,
        dragEl = me.getDragEl(),
        dragBox = Ext.fly(dragEl).getPageBox(),
        targetEl,
        targetBox,
        targetMidpoint,
        i = 0,
        it = me.container.items.items,
        ln = it.length,
        lastPos = me.lastPos;
        me.lastPos = dragBox[me.startAttr];
        for (; i < ln; i++) {
            targetEl = it[i].getEl();
            if (targetEl.is(me.reorderer.itemSelector)) {
                targetBox = targetEl.getPageBox();
                targetMidpoint = targetBox[me.startAttr] + (targetBox[me.dim] >> 1);
                if (i < me.curIndex) {
                    if ((dragBox[me.startAttr] < lastPos) && (dragBox[me.startAttr] < (targetMidpoint - 5))) {
                        return i;
                    }
                } else {
                    if (i > me.curIndex) {
                        if ((dragBox[me.startAttr] > lastPos) && (dragBox[me.endAttr] > (targetMidpoint + 5))) {
                            return i;
                        }
                    }
                }
            }
        }
    }
});