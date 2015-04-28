/**
 * @class Ext.carousel.Infinite
 * @author Jacky Nguyen <jacky@sencha.com>
 * @private
 *
 * The true infinite implementation of Carousel, private for now until it's stable to be public
 */
Ext.define('Ext.carousel.Infinite', {
    extend: 'Ext.carousel.Carousel',

    config: {
        indicator: null,

        maxItemIndex: Infinity,

        innerItemConfig: {}
    },

    applyIndicator: function(indicator) {
        //<debug error>
        if (indicator) {
            Ext.Logger.error("'indicator' in Infinite Carousel implementation is not currently supported", this);
        }
        //</debug>
        return;
    },

    updateBufferSize: function(size) {
        this.callParent(arguments);

        var total = size * 2 + 1,
            ln = this.innerItems.length,
            innerItemConfig = this.getInnerItemConfig(),
            i;

        this.isItemsInitializing = true;

        for (i = ln; i < total; i++) {
            this.doAdd(this.factoryItem(innerItemConfig));
        }

        this.isItemsInitializing = false;

        this.rebuildInnerIndexes();
        this.refreshActiveItem();
    },

    updateMaxItemIndex: function(maxIndex, oldMaxIndex) {
        if (oldMaxIndex !== undefined) {
            var activeIndex = this.getActiveIndex();

            if (activeIndex > maxIndex) {
                this.setActiveItem(maxIndex);
            }
            else {
                this.rebuildInnerIndexes(activeIndex);
                this.refreshActiveItem();
            }

        }
    },

    rebuildInnerIndexes: function(activeIndex) {
        var indexToItem = this.innerIndexToItem,
            idToIndex = this.innerIdToIndex,
            items = this.innerItems.slice(),
            ln = items.length,
            bufferSize = this.getBufferSize(),
            maxIndex = this.getMaxItemIndex(),
            changedIndexes = [],
            i, oldIndex, index, id, item;


        if (activeIndex === undefined) {
            this.innerIndexToItem = indexToItem = {};
            this.innerIdToIndex = idToIndex = {};

            for (i = 0; i < ln; i++) {
                item = items[i];
                id = item.getId();
                idToIndex[id] = i;
                indexToItem[i] = item;
                this.fireEvent('itemindexchange', this, item, i, -1);
            }
        }
        else {
            for (i = activeIndex - bufferSize; i <= activeIndex + bufferSize; i++) {
                if (i >= 0 && i <= maxIndex) {
                    if (indexToItem.hasOwnProperty(i)) {
                        Ext.Array.remove(items, indexToItem[i]);
                        continue;
                    }
                    changedIndexes.push(i);
                }
            }

            for (i = 0,ln = changedIndexes.length; i < ln; i++) {
                item = items[i];
                id = item.getId();
                index = changedIndexes[i];
                oldIndex = idToIndex[id];

                delete indexToItem[oldIndex];

                idToIndex[id] = index;
                indexToItem[index] = item;
                this.fireEvent('itemindexchange', this, item, index, oldIndex);
            }
        }
    },

    reset: function() {
        this.rebuildInnerIndexes();
        this.setActiveItem(0);
    },

    refreshItems: function() {
        var items = this.innerItems,
            idToIndex = this.innerIdToIndex,
            index, item, i, ln;

        for (i = 0,ln = items.length; i < ln; i++) {
            item = items[i];
            index = idToIndex[item.getId()];
            this.fireEvent('itemindexchange', this, item, index, -1);
        }
    },

    getInnerItemIndex: function(item) {
        var index = this.innerIdToIndex[item.getId()];

        return (typeof index == 'number') ? index : -1;
    },

    getInnerItemAt: function(index) {
        return this.innerIndexToItem[index];
    },

    applyActiveItem: function(activeItem) {
        this.getItems();
        this.getBufferSize();

        var maxIndex = this.getMaxItemIndex(),
            currentActiveIndex = this.getActiveIndex();

        if (typeof activeItem == 'number') {
            activeItem = Math.max(0, Math.min(activeItem, maxIndex));

            if (activeItem === currentActiveIndex) {
                return;
            }

            this.activeIndex = activeItem;

            this.rebuildInnerIndexes(activeItem);

            activeItem = this.getInnerItemAt(activeItem);
        }

        if (activeItem) {
            return this.callParent([activeItem]);
        }
    }
});
