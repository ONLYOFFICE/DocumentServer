/**
 * @private
 */
Ext.define('Ext.util.Collection', {
    /**
     * @cfg {Object[]} filters
     * Array of {@link Ext.util.Filter Filters} for this collection.
     */

    /**
     * @cfg {Object[]} sorters
     * Array of {@link Ext.util.Sorter Sorters} for this collection.
     */

    config: {
        autoFilter: true,
        autoSort: true
    },

    mixins: {
        sortable: 'Ext.mixin.Sortable',
        filterable: 'Ext.mixin.Filterable'
    },

    constructor: function(keyFn, config) {
        var me = this;

        /**
         * @property {Array} [all=[]]
         * An array containing all the items (unsorted, unfiltered)
         */
        me.all = [];

        /**
         * @property {Array} [items=[]]
         * An array containing the filtered items (sorted)
         */
        me.items = [];

        /**
         * @property {Array} [keys=[]]
         * An array containing all the filtered keys (sorted)
         */
        me.keys = [];

        /**
         * @property {Object} [indices={}]
         * An object used as map to get a sorted and filtered index of an item
         */
        me.indices = {};

        /**
         * @property {Object} [map={}]
         * An object used as map to get an object based on its key
         */
        me.map = {};

        /**
         * @property {Number} [length=0]
         * The count of items in the collection filtered and sorted
         */
        me.length = 0;

        if (keyFn) {
            me.getKey = keyFn;
        }

        this.initConfig(config);
    },

    updateAutoSort: function(autoSort, oldAutoSort) {
        if (oldAutoSort === false && autoSort && this.items.length) {
            this.sort();
        }
    },

    updateAutoFilter: function(autoFilter, oldAutoFilter) {
        if (oldAutoFilter === false && autoFilter && this.all.length) {
            this.filter();
        }
    },

    insertSorters: function() {
        // We override the insertSorters method that exists on the Sortable mixin. This method always
        // gets called whenever you add or insert a new sorter. We do this because we actually want
        // to sort right after this happens.
        this.mixins.sortable.insertSorters.apply(this, arguments);
        if (this.getAutoSort() && this.items.length) {
            this.sort();
        }
        return this;
    },

    removeSorters: function(sorters) {
        // We override the removeSorters method that exists on the Sortable mixin. This method always
        // gets called whenever you remove a sorter. If we are still sorted after we removed this sorter,
        // then we have to resort the whole collection.
        this.mixins.sortable.removeSorters.call(this, sorters);
        if (this.sorted && this.getAutoSort() && this.items.length) {
            this.sort();
        }
        return this;
    },

    applyFilters: function(filters) {
        var collection = this.mixins.filterable.applyFilters.call(this, filters);
        if (!filters && this.all.length && this.getAutoFilter()) {
            this.filter();
        }
        return collection;
    },

    addFilters: function(filters) {
        // We override the insertFilters method that exists on the Filterable mixin. This method always
        // gets called whenever you add or insert a new filter. We do this because we actually want
        // to filter right after this happens.
        this.mixins.filterable.addFilters.call(this, filters);
        if (this.items.length && this.getAutoFilter()) {
            this.filter();
        }
        return this;
    },

    removeFilters: function(filters) {
        // We override the removeFilters method that exists on the Filterable mixin. This method always
        // gets called whenever you remove a filter. If we are still filtered after we removed this filter,
        // then we have to re-filter the whole collection.
        this.mixins.filterable.removeFilters.call(this, filters);
        if (this.filtered && this.all.length && this.getAutoFilter()) {
            this.filter();
        }
        return this;
    },

    /**
     * This method will sort a collection based on the currently configured sorters.
     * @param {Object} property
     * @param {Object} value
     * @param {Object} anyMatch
     * @param {Object} caseSensitive
     * @return {Array}
     */
    filter: function(property, value, anyMatch, caseSensitive) {
        // Support for the simple case of filtering by property/value
        if (property) {
            if (Ext.isString(property)) {
                this.addFilters({
                    property     : property,
                    value        : value,
                    anyMatch     : anyMatch,
                    caseSensitive: caseSensitive
                });
                return this.items;
            }
            else {
                this.addFilters(property);
                return this.items;
            }
        }

        this.items = this.mixins.filterable.filter.call(this, this.all.slice());
        this.updateAfterFilter();

        if (this.sorted && this.getAutoSort()) {
            this.sort();
        }
    },

    updateAfterFilter: function() {
        var items = this.items,
            keys = this.keys,
            indices = this.indices = {},
            ln = items.length,
            i, item, key;

        keys.length = 0;

        for (i = 0; i < ln; i++) {
            item = items[i];
            key = this.getKey(item);
            indices[key] = i;
            keys[i] = key;
        }

        this.length = items.length;
        this.dirtyIndices = false;
    },

    sort: function(sorters, defaultDirection) {
        var items = this.items,
            keys = this.keys,
            indices = this.indices,
            ln = items.length,
            i, item, key;

        // If we pass sorters to this method we have to add them first.
        // Because adding a sorter automatically sorts the items collection
        // we can just return items after we have added the sorters
        if (sorters) {
            this.addSorters(sorters, defaultDirection);
            return this.items;
        }

        // We save the keys temporarily on each item
        for (i = 0; i < ln; i++) {
            items[i]._current_key = keys[i];
        }

        // Now we sort our items array
        this.handleSort(items);

        // And finally we update our keys and indices
        for (i = 0; i < ln; i++) {
            item = items[i];
            key = item._current_key;

            keys[i] = key;
            indices[key] = i;

            delete item._current_key;
        }

        this.dirtyIndices = true;
    },

    handleSort: function(items) {
        this.mixins.sortable.sort.call(this, items);
    },

    /**
     * Adds an item to the collection. Fires the {@link #add} event when complete.
     * @param {String} key
     *
     * The key to associate with the item, or the new item.
     *
     * If a {@link #getKey} implementation was specified for this MixedCollection, or if the key of the stored items is
     * in a property called **id**, the MixedCollection will be able to _derive_ the key for the new item. In this case
     * just pass the new item in this parameter.
     * @param {Object} item The item to add.
     * @return {Object} The item added.
     */
    add: function(key, item) {
        var me = this,
            filtered = this.filtered,
            sorted = this.sorted,
            all = this.all,
            items = this.items,
            keys = this.keys,
            indices = this.indices,
            filterable = this.mixins.filterable,
            currentLength = items.length,
            index = currentLength;

        if (arguments.length == 1) {
            item = key;
            key = me.getKey(item);
        }

        if (typeof key != 'undefined' && key !== null) {
            if (typeof me.map[key] != 'undefined') {
                return me.replace(key, item);
            }
            me.map[key] = item;
        }

        all.push(item);

        if (filtered && this.getAutoFilter() && filterable.isFiltered.call(me, item)) {
            return null;
        }

        me.length++;

        if (sorted && this.getAutoSort()) {
            index = this.findInsertionIndex(items, item);
        }

        if (index !== currentLength) {
            this.dirtyIndices = true;

            Ext.Array.splice(keys, index, 0, key);
            Ext.Array.splice(items, index, 0, item);
        } else {
            indices[key] = currentLength;

            keys.push(key);
            items.push(item);
        }

        return item;
    },

    /**
     * MixedCollection has a generic way to fetch keys if you implement getKey. The default implementation simply
     * returns **`item.id`** but you can provide your own implementation to return a different value as in the following
     * examples:
     *
     *     // normal way
     *     var mc = new Ext.util.MixedCollection();
     *     mc.add(someEl.dom.id, someEl);
     *     mc.add(otherEl.dom.id, otherEl);
     *     //and so on
     *
     *     // using getKey
     *     var mc = new Ext.util.MixedCollection();
     *     mc.getKey = function(el){
     *        return el.dom.id;
     *     };
     *     mc.add(someEl);
     *     mc.add(otherEl);
     *
     *     // or via the constructor
     *     var mc = new Ext.util.MixedCollection(false, function(el){
     *        return el.dom.id;
     *     });
     *     mc.add(someEl);
     *     mc.add(otherEl);
     * @param {Object} item The item for which to find the key.
     * @return {Object} The key for the passed item.
     */
    getKey: function(item) {
         return item.id;
    },

    /**
     * Replaces an item in the collection. Fires the {@link #replace} event when complete.
     * @param {String} oldKey
     *
     * The key associated with the item to replace, or the replacement item.
     *
     * If you supplied a {@link #getKey} implementation for this MixedCollection, or if the key of your stored items is
     * in a property called **id**, then the MixedCollection will be able to _derive_ the key of the replacement item.
     * If you want to replace an item with one having the same key value, then just pass the replacement item in this
     * parameter.
     * @param {Object} item {Object} item (optional) If the first parameter passed was a key, the item to associate with
     * that key.
     * @return {Object} The new item.
     */
    replace: function(oldKey, item) {
        var me = this,
            sorted = me.sorted,
            filtered = me.filtered,
            filterable = me.mixins.filterable,
            items = me.items,
            keys = me.keys,
            all = me.all,
            map = me.map,
            returnItem = null,
            oldItemsLn = items.length,
            oldItem, index, newKey;

        if (arguments.length == 1) {
            item = oldKey;
            oldKey = newKey = me.getKey(item);
        } else {
            newKey = me.getKey(item);
        }

        oldItem = map[oldKey];
        if (typeof oldKey == 'undefined' || oldKey === null || typeof oldItem == 'undefined') {
             return me.add(newKey, item);
        }

        me.map[newKey] = item;
        if (newKey !== oldKey) {
            delete me.map[oldKey];
        }

        if (sorted && me.getAutoSort()) {
            Ext.Array.remove(items, oldItem);
            Ext.Array.remove(keys, oldKey);
            Ext.Array.remove(all, oldItem);

            all.push(item);

            me.dirtyIndices = true;

            if (filtered && me.getAutoFilter()) {
                // If the item is now filtered we check if it was not filtered
                // before. If that is the case then we subtract from the length
                if (filterable.isFiltered.call(me, item)) {
                    if (oldItemsLn !== items.length) {
                        me.length--;
                    }
                    return null;
                }
                // If the item was filtered, but now it is not anymore then we
                // add to the length
                else if (oldItemsLn === items.length) {
                    me.length++;
                    returnItem = item;
                }
            }

            index = this.findInsertionIndex(items, item);

            Ext.Array.splice(keys, index, 0, newKey);
            Ext.Array.splice(items, index, 0, item);
        } else {
            if (filtered) {
                if (me.getAutoFilter() && filterable.isFiltered.call(me, item)) {
                    if (items.indexOf(oldItem) !== -1) {
                        Ext.Array.remove(items, oldItem);
                        Ext.Array.remove(keys, oldKey);
                        me.length--;
                        me.dirtyIndices = true;
                    }
                    return null;
                }
                else if (items.indexOf(oldItem) === -1) {
                    items.push(item);
                    keys.push(newKey);
                    me.indices[newKey] = me.length;
                    me.length++;
                    return item;
                }
            }

            index = me.items.indexOf(oldItem);

            keys[index] = newKey;
            items[index] = item;
            this.dirtyIndices = true;
        }

        return returnItem;
    },

    /**
     * Adds all elements of an Array or an Object to the collection.
     * @param {Object/Array} objs An Object containing properties which will be added to the collection, or an Array of
     * values, each of which are added to the collection. Functions references will be added to the collection if {@link
     * Ext.util.MixedCollection#allowFunctions allowFunctions} has been set to `true`.
     */
    addAll: function(addItems) {
        var me = this,
            filtered = me.filtered,
            sorted = me.sorted,
            all = me.all,
            items = me.items,
            keys = me.keys,
            map = me.map,
            autoFilter = me.getAutoFilter(),
            autoSort = me.getAutoSort(),
            newKeys = [],
            newItems = [],
            filterable = me.mixins.filterable,
            addedItems = [],
            ln, key, i, item;

        if (Ext.isObject(addItems)) {
            for (key in addItems) {
                if (addItems.hasOwnProperty(key)) {
                    newItems.push(items[key]);
                    newKeys.push(key);
                }
            }
        } else {
            newItems = addItems;
            ln = addItems.length;
            for (i = 0; i < ln; i++) {
                newKeys.push(me.getKey(addItems[i]));
            }
        }

        for (i = 0; i < ln; i++) {
            key = newKeys[i];
            item = newItems[i];

            if (typeof key != 'undefined' && key !== null) {
                if (typeof map[key] != 'undefined') {
                    me.replace(key, item);
                    continue;
                }
                map[key] = item;
            }

            all.push(item);

            if (filtered && autoFilter && filterable.isFiltered.call(me, item)) {
                continue;
            }

            me.length++;

            keys.push(key);
            items.push(item);

            addedItems.push(item);
        }

        if (addedItems.length) {
            me.dirtyIndices = true;

            if (sorted && autoSort) {
                me.sort();
            }

            return addedItems;
        }

        return null;
    },

    /**
     * Executes the specified function once for every item in the collection.
     * The function should return a Boolean value. Returning `false` from the function will stop the iteration.
     * @param {Function} fn The function to execute for each item.
     * @param {Mixed} fn.item The collection item.
     * @param {Number} fn.index The item's index.
     * @param {Number} fn.length The total number of items in the collection.
     * @param {Object} scope The scope (`this` reference) in which the function is executed. Defaults to the current
     * item in the iteration.
     */
    each: function(fn, scope) {
        var items = this.items.slice(), // each safe for removal
            i = 0,
            len = items.length,
            item;

        for (; i < len; i++) {
            item = items[i];
            if (fn.call(scope || item, item, i, len) === false) {
                break;
            }
        }
    },

    /**
     * Executes the specified function once for every key in the collection, passing each key, and its associated item
     * as the first two parameters.
     * @param {Function} fn The function to execute for each item.
     * @param {Object} scope The scope (`this` reference) in which the function is executed. Defaults to the browser
     * window.
     */
    eachKey: function(fn, scope) {
        var keys = this.keys,
            items = this.items,
            ln = keys.length, i;

        for (i = 0; i < ln; i++) {
            fn.call(scope || window, keys[i], items[i], i, ln);
        }
    },

    /**
     * Returns the first item in the collection which elicits a `true` return value from the passed selection function.
     * @param {Function} fn The selection function to execute for each item.
     * @param {Object} scope The scope (`this` reference) in which the function is executed. Defaults to the browser
     * window.
     * @return {Object} The first item in the collection which returned `true` from the selection function.
     */
    findBy: function(fn, scope) {
        var keys = this.keys,
            items = this.items,
            i = 0,
            len = items.length;

        for (; i < len; i++) {
            if (fn.call(scope || window, items[i], keys[i])) {
                return items[i];
            }
        }
        return null;
    },

    /**
     * Filter by a function. Returns a _new_ collection that has been filtered. The passed function will be called with
     * each object in the collection. If the function returns `true`, the value is included otherwise it is filtered.
     * @param {Function} fn The function to be called.
     * @param fn.o The object.
     * @param fn.k The key.
     * @param {Object} scope The scope (`this` reference) in which the function is executed. Defaults to this
     * MixedCollection.
     * @return {Ext.util.MixedCollection} The new filtered collection
     */
    filterBy: function(fn, scope) {
        var me = this,
            newCollection = new this.self(),
            keys   = me.keys,
            items  = me.all,
            length = items.length,
            i;

        newCollection.getKey = me.getKey;

        for (i = 0; i < length; i++) {
            if (fn.call(scope || me, items[i], me.getKey(items[i]))) {
                newCollection.add(keys[i], items[i]);
            }
        }

        return newCollection;
    },

    /**
     * Inserts an item at the specified index in the collection. Fires the {@link #add} event when complete.
     * @param {Number} index The index to insert the item at.
     * @param {String} key The key to associate with the new item, or the item itself.
     * @param {Object} item If the second parameter was a key, the new item.
     * @return {Object} The item inserted.
     */
    insert: function(index, key, item) {
        var me = this,
            sorted = this.sorted,
            map = this.map,
            filtered = this.filtered;

        if (arguments.length == 2) {
            item = key;
            key = me.getKey(item);
        }

        if (index >= me.length || (sorted && me.getAutoSort())) {
            return me.add(key, item);
        }

        if (typeof key != 'undefined' && key !== null) {
            if (typeof map[key] != 'undefined') {
                me.replace(key, item);
                return false;
            }
            map[key] = item;
        }

        this.all.push(item);

        if (filtered && this.getAutoFilter() && this.mixins.filterable.isFiltered.call(me, item)) {
            return null;
        }

        me.length++;

        Ext.Array.splice(me.items, index, 0, item);
        Ext.Array.splice(me.keys, index, 0, key);

        me.dirtyIndices = true;

        return item;
    },

    insertAll: function(index, insertItems) {
        if (index >= this.items.length || (this.sorted && this.getAutoSort())) {
            return this.addAll(insertItems);
        }

        var me = this,
            filtered = this.filtered,
            sorted = this.sorted,
            all = this.all,
            items = this.items,
            keys = this.keys,
            map = this.map,
            autoFilter = this.getAutoFilter(),
            autoSort = this.getAutoSort(),
            newKeys = [],
            newItems = [],
            addedItems = [],
            filterable = this.mixins.filterable,
            insertedUnfilteredItem = false,
            ln, key, i, item;

        if (sorted && this.getAutoSort()) {
            // <debug>
            Ext.Logger.error('Inserting a collection of items into a sorted Collection is invalid. Please just add these items or remove the sorters.');
            // </debug>
        }

        if (Ext.isObject(insertItems)) {
            for (key in insertItems) {
                if (insertItems.hasOwnProperty(key)) {
                    newItems.push(items[key]);
                    newKeys.push(key);
                }
            }
        } else {
            newItems = insertItems;
            ln = insertItems.length;
            for (i = 0; i < ln; i++) {
                newKeys.push(me.getKey(insertItems[i]));
            }
        }

        for (i = 0; i < ln; i++) {
            key = newKeys[i];
            item = newItems[i];

            if (typeof key != 'undefined' && key !== null) {
                if (typeof map[key] != 'undefined') {
                    me.replace(key, item);
                    continue;
                }
                map[key] = item;
            }

            all.push(item);

            if (filtered && autoFilter && filterable.isFiltered.call(me, item)) {
                continue;
            }

            me.length++;

            Ext.Array.splice(items, index + i, 0, item);
            Ext.Array.splice(keys, index + i, 0, key);

            insertedUnfilteredItem = true;
            addedItems.push(item);
        }

        if (insertedUnfilteredItem) {
            this.dirtyIndices = true;

            if (sorted && autoSort) {
                this.sort();
            }

            return addedItems;
        }

        return null;
    },

    /**
     * Remove an item from the collection.
     * @param {Object} item The item to remove.
     * @return {Object} The item removed or `false` if no item was removed.
     */
    remove: function(item) {
        var index = this.items.indexOf(item);
        if (index === -1) {
            Ext.Array.remove(this.all, item);

            if (typeof this.getKey == 'function') {
                var key = this.getKey(item);
                if (key !== undefined) {
                    delete this.map[key];
                }
            }

            return item;
        }
        return this.removeAt(this.items.indexOf(item));
    },

    /**
     * Remove all items in the passed array from the collection.
     * @param {Array} items An array of items to be removed.
     * @return {Ext.util.MixedCollection} this object
     */
    removeAll: function(items) {
        if (items) {
            var ln = items.length, i;

            for (i = 0; i < ln; i++) {
                this.remove(items[i]);
            }
        }

        return this;
    },

    /**
     * Remove an item from a specified index in the collection. Fires the {@link #remove} event when complete.
     * @param {Number} index The index within the collection of the item to remove.
     * @return {Object} The item removed or `false` if no item was removed.
     */
    removeAt: function(index) {
        var me = this,
            items = me.items,
            keys = me.keys,
            all = me.all,
            item, key;

        if (index < me.length && index >= 0) {
            item = items[index];
            key = keys[index];

            if (typeof key != 'undefined') {
                delete me.map[key];
            }

            Ext.Array.erase(items, index, 1);
            Ext.Array.erase(keys, index, 1);
            Ext.Array.remove(all, item);

            delete me.indices[key];

            me.length--;

            this.dirtyIndices = true;

            return item;
        }

        return false;
    },

    /**
     * Removed an item associated with the passed key from the collection.
     * @param {String} key The key of the item to remove.
     * @return {Object/Boolean} The item removed or `false` if no item was removed.
     */
    removeAtKey: function(key) {
        return this.removeAt(this.indexOfKey(key));
    },

    /**
     * Returns the number of items in the collection.
     * @return {Number} the number of items in the collection.
     */
    getCount: function() {
        return this.length;
    },

    /**
     * Returns index within the collection of the passed Object.
     * @param {Object} item The item to find the index of.
     * @return {Number} Index of the item. Returns -1 if not found.
     */
    indexOf: function(item) {
        if (this.dirtyIndices) {
            this.updateIndices();
        }

        var index = this.indices[this.getKey(item)];
        return (index === undefined) ? -1 : index;
    },

    /**
     * Returns index within the collection of the passed key.
     * @param {String} key The key to find the index of.
     * @return {Number} Index of the key.
     */
    indexOfKey: function(key) {
        if (this.dirtyIndices) {
            this.updateIndices();
        }

        var index = this.indices[key];
        return (index === undefined) ? -1 : index;
    },

    updateIndices: function() {
        var items = this.items,
            ln = items.length,
            indices = this.indices = {},
            i, item, key;

        for (i = 0; i < ln; i++) {
            item = items[i];
            key = this.getKey(item);
            indices[key] = i;
        }

        this.dirtyIndices = false;
    },

    /**
     * Returns the item associated with the passed key OR index. Key has priority over index. This is the equivalent of
     * calling {@link #getByKey} first, then if nothing matched calling {@link #getAt}.
     * @param {String/Number} key The key or index of the item.
     * @return {Object} If the item is found, returns the item. If the item was not found, returns `undefined`. If an item
     * was found, but is a Class, returns `null`.
     */
    get: function(key) {
        var me = this,
            fromMap = me.map[key],
            item;

        if (fromMap !== undefined) {
            item = fromMap;
        }
        else if (typeof key == 'number') {
            item = me.items[key];
        }

        return typeof item != 'function' || me.getAllowFunctions() ? item : null; // for prototype!
    },

    /**
     * Returns the item at the specified index.
     * @param {Number} index The index of the item.
     * @return {Object} The item at the specified index.
     */
    getAt: function(index) {
        return this.items[index];
    },

    /**
     * Returns the item associated with the passed key.
     * @param {String/Number} key The key of the item.
     * @return {Object} The item associated with the passed key.
     */
    getByKey: function(key) {
        return this.map[key];
    },

    /**
     * Returns `true` if the collection contains the passed Object as an item.
     * @param {Object} item The Object to look for in the collection.
     * @return {Boolean} `true` if the collection contains the Object as an item.
     */
    contains: function(item) {
        var key = this.getKey(item);
        if (key) {
            return this.containsKey(key);
        } else {
            return Ext.Array.contains(this.items, item);
        }
    },

    /**
     * Returns `true` if the collection contains the passed Object as a key.
     * @param {String} key The key to look for in the collection.
     * @return {Boolean} `true` if the collection contains the Object as a key.
     */
    containsKey: function(key) {
        return typeof this.map[key] != 'undefined';
    },

    /**
     * Removes all items from the collection. Fires the {@link #clear} event when complete.
     */
    clear: function(){
        var me = this;

        me.length = 0;
        me.items.length = 0;
        me.keys.length = 0;
        me.all.length = 0;
        me.dirtyIndices = true;
        me.indices = {};
        me.map = {};
    },

    /**
     * Returns the first item in the collection.
     * @return {Object} the first item in the collection.
     */
    first: function() {
        return this.items[0];
    },

    /**
     * Returns the last item in the collection.
     * @return {Object} the last item in the collection.
     */
    last: function() {
        return this.items[this.length - 1];
    },

    /**
     * Returns a range of items in this collection
     * @param {Number} [startIndex=0] The starting index.
     * @param {Number} [endIndex=-1] The ending index. Defaults to the last item.
     * @return {Array} An array of items.
     */
    getRange: function(start, end) {
        var me = this,
            items = me.items,
            range = [],
            i;

        if (items.length < 1) {
            return range;
        }

        start = start || 0;
        end = Math.min(typeof end == 'undefined' ? me.length - 1 : end, me.length - 1);
        if (start <= end) {
            for (i = start; i <= end; i++) {
                range[range.length] = items[i];
            }
        } else {
            for (i = start; i >= end; i--) {
                range[range.length] = items[i];
            }
        }

        return range;
    },

    /**
     * Find the index of the first matching object in this collection by a function. If the function returns `true` it
     * is considered a match.
     * @param {Function} fn The function to be called.
     * @param fn.o The object.
     * @param fn.k The key.
     * @param {Object} scope The scope (`this` reference) in which the function is executed. Defaults to this
     * MixedCollection.
     * @param {Number} [start=0] The index to start searching at.
     * @return {Number} The matched index, or -1 if the item was not found.
     */
    findIndexBy: function(fn, scope, start) {
        var me = this,
            keys = me.keys,
            items = me.items,
            i = start || 0,
            ln = items.length;

        for (; i < ln; i++) {
            if (fn.call(scope || me, items[i], keys[i])) {
                return i;
            }
        }

        return -1;
    },

    /**
     * Creates a shallow copy of this collection
     * @return {Ext.util.MixedCollection}
     */
    clone: function() {
        var me = this,
            copy = new this.self(),
            keys = me.keys,
            items = me.items,
            i = 0,
            ln = items.length;

        for(; i < ln; i++) {
            copy.add(keys[i], items[i]);
        }

        copy.getKey = me.getKey;
        return copy;
    },

    destroy: function() {
        this.callSuper();
        this.clear();
    }
});
