/**
 * Represents a collection of a set of key and value pairs. Each key in the MixedCollection must be unique, the same key
 * cannot exist twice. This collection is ordered, items in the collection can be accessed by index or via the key.
 * Newly added items are added to the end of the collection. This class is similar to {@link Ext.util.HashMap} however
 * it is heavier and provides more functionality. Sample usage:
 *
 *     @example
 *     var coll = new Ext.util.MixedCollection();
 *     coll.add('key1', 'val1');
 *     coll.add('key2', 'val2');
 *     coll.add('key3', 'val3');
 *
 *     alert(coll.get('key1')); // 'val1'
 *     alert(coll.indexOfKey('key3')); // 2
 *
 * The MixedCollection also has support for sorting and filtering of the values in the collection.
 *
 *     @example
 *     var coll = new Ext.util.MixedCollection();
 *     coll.add('key1', 100);
 *     coll.add('key2', -100);
 *     coll.add('key3', 17);
 *     coll.add('key4', 0);
 *     var biggerThanZero = coll.filterBy(function(value){
 *         return value > 0;
 *     });
 *     alert(biggerThanZero.getCount()); // 2
 */
Ext.define('Ext.util.MixedCollection', {
    extend: 'Ext.util.AbstractMixedCollection',
    mixins: {
        sortable: 'Ext.util.Sortable'
    },

    /**
     * @event sort
     * Fires whenever MixedCollection is sorted.
     * @param {Ext.util.MixedCollection} this
     */

    constructor: function() {
        var me = this;
        me.callParent(arguments);
        me.mixins.sortable.initSortable.call(me);
    },

    doSort: function(sorterFn) {
        this.sortBy(sorterFn);
    },

    /**
     * @private
     * Performs the actual sorting based on a direction and a sorting function. Internally,
     * this creates a temporary array of all items in the MixedCollection, sorts it and then writes
     * the sorted array data back into `this.items` and `this.keys`.
     * @param {String} property Property to sort by ('key', 'value', or 'index')
     * @param {String} [dir=ASC] (optional) Direction to sort 'ASC' or 'DESC'.
     * @param {Function} fn (optional) Comparison function that defines the sort order.
     * Defaults to sorting by numeric value.
     */
    _sort: function(property, dir, fn){
        var me = this,
            i, len,
            dsc   = String(dir).toUpperCase() == 'DESC' ? -1 : 1,

            //this is a temporary array used to apply the sorting function
            c     = [],
            keys  = me.keys,
            items = me.items;

        //default to a simple sorter function if one is not provided
        fn = fn || function(a, b) {
            return a - b;
        };

        //copy all the items into a temporary array, which we will sort
        for(i = 0, len = items.length; i < len; i++){
            c[c.length] = {
                key  : keys[i],
                value: items[i],
                index: i
            };
        }

        //sort the temporary array
        Ext.Array.sort(c, function(a, b){
            var v = fn(a[property], b[property]) * dsc;
            if(v === 0){
                v = (a.index < b.index ? -1 : 1);
            }
            return v;
        });

        //copy the temporary array back into the main this.items and this.keys objects
        for(i = 0, len = c.length; i < len; i++){
            items[i] = c[i].value;
            keys[i]  = c[i].key;
        }

        me.fireEvent('sort', me);
    },

    /**
     * Sorts the collection by a single sorter function.
     * @param {Function} sorterFn The function to sort by.
     */
    sortBy: function(sorterFn) {
        var me     = this,
            items  = me.items,
            keys   = me.keys,
            length = items.length,
            temp   = [],
            i;

        //first we create a copy of the items array so that we can sort it
        for (i = 0; i < length; i++) {
            temp[i] = {
                key  : keys[i],
                value: items[i],
                index: i
            };
        }

        Ext.Array.sort(temp, function(a, b) {
            var v = sorterFn(a.value, b.value);
            if (v === 0) {
                v = (a.index < b.index ? -1 : 1);
            }

            return v;
        });

        //copy the temporary array back into the main this.items and this.keys objects
        for (i = 0; i < length; i++) {
            items[i] = temp[i].value;
            keys[i]  = temp[i].key;
        }

        me.fireEvent('sort', me, items, keys);
    },

    /**
     * Reorders each of the items based on a mapping from old index to new index. Internally this just translates into a
     * sort. The `sort` event is fired whenever reordering has occured.
     * @param {Object} mapping Mapping from old item index to new item index.
     */
    reorder: function(mapping) {
        var me = this,
            items = me.items,
            index = 0,
            length = items.length,
            order = [],
            remaining = [],
            oldIndex;

        me.suspendEvents();

        //object of {oldPosition: newPosition} reversed to {newPosition: oldPosition}
        for (oldIndex in mapping) {
            order[mapping[oldIndex]] = items[oldIndex];
        }

        for (index = 0; index < length; index++) {
            if (mapping[index] == undefined) {
                remaining.push(items[index]);
            }
        }

        for (index = 0; index < length; index++) {
            if (order[index] == undefined) {
                order[index] = remaining.shift();
            }
        }

        me.clear();
        me.addAll(order);

        me.resumeEvents();
        me.fireEvent('sort', me);
    },

    /**
     * Sorts this collection by **key**s.
     * @param {String} [direction=ASC] 'ASC' or 'DESC'.
     * @param {Function} [fn] Comparison function that defines the sort order. Defaults to sorting by case insensitive
     * string.
     */
    sortByKey: function(dir, fn){
        this._sort('key', dir, fn || function(a, b){
            var v1 = String(a).toUpperCase(), v2 = String(b).toUpperCase();
            return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
        });
    }
});
