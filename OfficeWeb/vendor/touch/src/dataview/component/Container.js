/**
 * @private
 */
Ext.define('Ext.dataview.component.Container', {
    extend: 'Ext.Container',

    requires: [
        'Ext.dataview.component.DataItem'
    ],

    /**
     * @event itemtouchstart
     * Fires whenever an item is touched
     * @param {Ext.dataview.component.Container} this
     * @param {Ext.dataview.component.DataItem} item The item touched
     * @param {Number} index The index of the item touched
     * @param {Ext.EventObject} e The event object
     */

    /**
     * @event itemtouchmove
     * Fires whenever an item is moved
     * @param {Ext.dataview.component.Container} this
     * @param {Ext.dataview.component.DataItem} item The item moved
     * @param {Number} index The index of the item moved
     * @param {Ext.EventObject} e The event object
     */

    /**
     * @event itemtouchend
     * Fires whenever an item is touched
     * @param {Ext.dataview.component.Container} this
     * @param {Ext.dataview.component.DataItem} item The item touched
     * @param {Number} index The index of the item touched
     * @param {Ext.EventObject} e The event object
     */

    /**
     * @event itemtap
     * Fires whenever an item is tapped
     * @param {Ext.dataview.component.Container} this
     * @param {Ext.dataview.component.DataItem} item The item tapped
     * @param {Number} index The index of the item tapped
     * @param {Ext.EventObject} e The event object
     */

    /**
     * @event itemtaphold
     * Fires whenever an item is tapped
     * @param {Ext.dataview.component.Container} this
     * @param {Ext.dataview.component.DataItem} item The item tapped
     * @param {Number} index The index of the item tapped
     * @param {Ext.EventObject} e The event object
     */

    /**
     * @event itemsingletap
     * Fires whenever an item is doubletapped
     * @param {Ext.dataview.component.Container} this
     * @param {Ext.dataview.component.DataItem} item The item singletapped
     * @param {Number} index The index of the item singletapped
     * @param {Ext.EventObject} e The event object
     */

    /**
     * @event itemdoubletap
     * Fires whenever an item is doubletapped
     * @param {Ext.dataview.component.Container} this
     * @param {Ext.dataview.component.DataItem} item The item doubletapped
     * @param {Number} index The index of the item doubletapped
     * @param {Ext.EventObject} e The event object
     */

    /**
     * @event itemswipe
     * Fires whenever an item is swiped
     * @param {Ext.dataview.component.Container} this
     * @param {Ext.dataview.component.DataItem} item The item swiped
     * @param {Number} index The index of the item swiped
     * @param {Ext.EventObject} e The event object
     */

    constructor: function() {
        this.itemCache = [];
        this.callParent(arguments);
    },

    //@private
    doInitialize: function() {
        this.innerElement.on({
            touchstart: 'onItemTouchStart',
            touchend: 'onItemTouchEnd',
            tap: 'onItemTap',
            taphold: 'onItemTapHold',
            touchmove: 'onItemTouchMove',
            singletap: 'onItemSingleTap',
            doubletap: 'onItemDoubleTap',
            swipe: 'onItemSwipe',
            delegate: '> .' + Ext.baseCSSPrefix + 'data-item',
            scope: this
        });
    },

    //@private
    initialize: function() {
        this.callParent();
        this.doInitialize();
    },

    onItemTouchStart: function(e) {
        var me = this,
            target = e.getTarget(),
            item = Ext.getCmp(target.id);

        item.on({
            touchmove: 'onItemTouchMove',
            scope   : me,
            single: true
        });

        me.fireEvent('itemtouchstart', me, item, me.indexOf(item), e);
    },

    onItemTouchMove: function(e) {
        var me = this,
            target = e.getTarget(),
            item = Ext.getCmp(target.id);
        me.fireEvent('itemtouchmove', me, item, me.indexOf(item), e);
    },

    onItemTouchEnd: function(e) {
        var me = this,
            target = e.getTarget(),
            item = Ext.getCmp(target.id);

        item.un({
            touchmove: 'onItemTouchMove',
            scope   : me
        });

        me.fireEvent('itemtouchend', me, item, me.indexOf(item), e);
    },

    onItemTap: function(e) {
        var me = this,
            target = e.getTarget(),
            item = Ext.getCmp(target.id);
        me.fireEvent('itemtap', me, item, me.indexOf(item), e);
    },

    onItemTapHold: function(e) {
        var me = this,
            target = e.getTarget(),
            item = Ext.getCmp(target.id);
        me.fireEvent('itemtaphold', me, item, me.indexOf(item), e);
    },

    onItemSingleTap: function(e) {
        var me = this,
            target = e.getTarget(),
            item = Ext.getCmp(target.id);
        me.fireEvent('itemsingletap', me, item, me.indexOf(item), e);
    },

    onItemDoubleTap: function(e) {
        var me = this,
            target = e.getTarget(),
            item = Ext.getCmp(target.id);
        me.fireEvent('itemdoubletap', me, item, me.indexOf(item), e);
    },

    onItemSwipe: function(e) {
        var me = this,
            target = e.getTarget(),
            item = Ext.getCmp(target.id);
        me.fireEvent('itemswipe', me, item, me.indexOf(item), e);
    },

    moveItemsToCache: function(from, to) {
        var me = this,
            dataview = me.dataview,
            maxItemCache = dataview.getMaxItemCache(),
            items = me.getViewItems(),
            itemCache = me.itemCache,
            cacheLn = itemCache.length,
            pressedCls = dataview.getPressedCls(),
            selectedCls = dataview.getSelectedCls(),
            i = to - from,
            item;

        for (; i >= 0; i--) {
            item = items[from + i];
            if (cacheLn !== maxItemCache) {
                me.remove(item, false);
                item.removeCls([pressedCls, selectedCls]);
                itemCache.push(item);
                cacheLn++;
            }
            else {
                item.destroy();
            }
        }

        if (me.getViewItems().length == 0) {
            this.dataview.showEmptyText();
        }
    },

    moveItemsFromCache: function(records) {
        var me = this,
            dataview = me.dataview,
            store = dataview.getStore(),
            ln = records.length,
            xtype = dataview.getDefaultType(),
            itemConfig = dataview.getItemConfig(),
            itemCache = me.itemCache,
            cacheLn = itemCache.length,
            items = [],
            i, item, record;

        if (ln) {
            dataview.hideEmptyText();
        }

        for (i = 0; i < ln; i++) {
            records[i]._tmpIndex = store.indexOf(records[i]);
        }

        Ext.Array.sort(records, function(record1, record2) {
            return record1._tmpIndex > record2._tmpIndex ? 1 : -1;
        });

        for (i = 0; i < ln; i++) {
            record = records[i];
            if (cacheLn) {
                cacheLn--;
                item = itemCache.pop();
                this.updateListItem(record, item);
            }
            else {
                item = me.getDataItemConfig(xtype, record, itemConfig);
            }
            item = this.insert(record._tmpIndex, item);
            delete record._tmpIndex;
        }
        return items;
    },

    getViewItems: function() {
        return this.getInnerItems();
    },

    updateListItem: function(record, item) {
        if (item.updateRecord) {
            if (item.getRecord() === record) {
                item.updateRecord(record);
            } else {
                item.setRecord(record);
            }
        }
    },

    getDataItemConfig: function(xtype, record, itemConfig) {
        var dataview = this.dataview,
            dataItemConfig = {
                xtype: xtype,
                record: record,
                itemCls: dataview.getItemCls(),
                defaults: itemConfig,
                dataview: dataview
            };
        return Ext.merge(dataItemConfig, itemConfig);
    },

    doRemoveItemCls: function(cls) {
        var items = this.getViewItems(),
            ln = items.length,
            i = 0;

        for (; i < ln; i++) {
            items[i].removeCls(cls);
        }
    },

    doAddItemCls: function(cls) {
        var items = this.getViewItems(),
            ln = items.length,
            i = 0;

        for (; i < ln; i++) {
            items[i].addCls(cls);
        }
    },

    updateAtNewIndex: function(oldIndex, newIndex, record) {
        this.moveItemsToCache(oldIndex, oldIndex);
        this.moveItemsFromCache([record]);
    },

    destroy: function() {
        var me = this,
            itemCache = me.itemCache,
            ln = itemCache.length,
            i = 0;

        for (; i < ln; i++) {
            itemCache[i].destroy();
        }
        this.callParent();
    }
});
