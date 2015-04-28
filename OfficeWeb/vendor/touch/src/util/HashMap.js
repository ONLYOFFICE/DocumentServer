/**
 * Represents a collection of a set of key and value pairs. Each key in the HashMap must be unique, the same
 * key cannot exist twice. Access to items is provided via the key only. Sample usage:
 *
 *     var map = Ext.create('Ext.util.HashMap');
 *     map.add('key1', 1);
 *     map.add('key2', 2);
 *     map.add('key3', 3);
 *
 *     map.each(function(key, value, length){
 *         console.log(key, value, length);
 *     });
 *
 * The HashMap is an unordered class, there is no guarantee when iterating over the items that they will be in
 * any particular order. If this is required, then use a {@link Ext.util.MixedCollection}.
 */
Ext.define('Ext.util.HashMap', {
    mixins: {
        observable: 'Ext.mixin.Observable'
    },

    /**
     * @cfg {Function} keyFn
     * A function that is used to retrieve a default key for a passed object.
     * A default is provided that returns the **id** property on the object.
     * This function is only used if the add method is called with a single argument.
     */

    /**
     * Creates new HashMap.
     * @param {Object} config The configuration options
     */
    constructor: function(config) {
        /**
         * @event add
         * Fires when a new item is added to the hash.
         * @param {Ext.util.HashMap} this
         * @param {String} key The key of the added item.
         * @param {Object} value The value of the added item.
         */
        /**
         * @event clear
         * Fires when the hash is cleared.
         * @param {Ext.util.HashMap} this
         */
        /**
         * @event remove
         * Fires when an item is removed from the hash.
         * @param {Ext.util.HashMap} this
         * @param {String} key The key of the removed item.
         * @param {Object} value The value of the removed item.
         */
        /**
         * @event replace
         * Fires when an item is replaced in the hash.
         * @param {Ext.util.HashMap} this
         * @param {String} key The key of the replaced item.
         * @param {Object} value The new value for the item.
         * @param {Object} old The old value for the item.
         */

        this.callParent();

        this.mixins.observable.constructor.call(this);

        this.clear(true);
    },

    /**
     * Gets the number of items in the hash.
     * @return {Number} The number of items in the hash.
     */
    getCount: function() {
        return this.length;
    },

    /**
     * Implementation for being able to extract the key from an object if only
     * a single argument is passed.
     * @private
     * @param {String} key The key
     * @param {Object} value The value
     * @return {Array} [key, value]
     */
    getData: function(key, value) {
        // if we have no value, it means we need to get the key from the object
        if (value === undefined) {
            value = key;
            key = this.getKey(value);
        }

        return [key, value];
    },

    /**
     * Extracts the key from an object. This is a default implementation, it may be overridden.
     * @private
     * @param {Object} o The object to get the key from.
     * @return {String} The key to use.
     */
    getKey: function(o) {
        return o.id;
    },

    /**
     * Add a new item to the hash. An exception will be thrown if the key already exists.
     * @param {String} key The key of the new item.
     * @param {Object} value The value of the new item.
     * @return {Object} The value of the new item added.
     */
    add: function(key, value) {
        var me = this,
            data;

        if (me.containsKey(key)) {
            throw new Error('This key already exists in the HashMap');
        }

        data = this.getData(key, value);
        key = data[0];
        value = data[1];
        me.map[key] = value;
        ++me.length;
        me.fireEvent('add', me, key, value);
        return value;
    },

    /**
     * Replaces an item in the hash. If the key doesn't exist, the
     * `{@link #method-add}` method will be used.
     * @param {String} key The key of the item.
     * @param {Object} value The new value for the item.
     * @return {Object} The new value of the item.
     */
    replace: function(key, value) {
        var me = this,
            map = me.map,
            old;

        if (!me.containsKey(key)) {
            me.add(key, value);
        }
        old = map[key];
        map[key] = value;
        me.fireEvent('replace', me, key, value, old);
        return value;
    },

    /**
     * Remove an item from the hash.
     * @param {Object} o The value of the item to remove.
     * @return {Boolean} `true` if the item was successfully removed.
     */
    remove: function(o) {
        var key = this.findKey(o);
        if (key !== undefined) {
            return this.removeByKey(key);
        }
        return false;
    },

    /**
     * Remove an item from the hash.
     * @param {String} key The key to remove.
     * @return {Boolean} `true` if the item was successfully removed.
     */
    removeByKey: function(key) {
        var me = this,
            value;

        if (me.containsKey(key)) {
            value = me.map[key];
            delete me.map[key];
            --me.length;
            me.fireEvent('remove', me, key, value);
            return true;
        }
        return false;
    },

    /**
     * Retrieves an item with a particular key.
     * @param {String} key The key to lookup.
     * @return {Object} The value at that key. If it doesn't exist, `undefined` is returned.
     */
    get: function(key) {
        return this.map[key];
    },

    /**
     * Removes all items from the hash.
     * @return {Ext.util.HashMap} this
     */
    clear: function(/* private */ initial) {
        var me = this;
        me.map = {};
        me.length = 0;
        if (initial !== true) {
            me.fireEvent('clear', me);
        }
        return me;
    },

    /**
     * Checks whether a key exists in the hash.
     * @param {String} key The key to check for.
     * @return {Boolean} `true` if they key exists in the hash.
     */
    containsKey: function(key) {
        return this.map[key] !== undefined;
    },

    /**
     * Checks whether a value exists in the hash.
     * @param {Object} value The value to check for.
     * @return {Boolean} `true` if the value exists in the dictionary.
     */
    contains: function(value) {
        return this.containsKey(this.findKey(value));
    },

    /**
     * Return all of the keys in the hash.
     * @return {Array} An array of keys.
     */
    getKeys: function() {
        return this.getArray(true);
    },

    /**
     * Return all of the values in the hash.
     * @return {Array} An array of values.
     */
    getValues: function() {
        return this.getArray(false);
    },

    /**
     * Gets either the keys/values in an array from the hash.
     * @private
     * @param {Boolean} isKey `true` to extract the keys, otherwise, the value.
     * @return {Array} An array of either keys/values from the hash.
     */
    getArray: function(isKey) {
        var arr = [],
            key,
            map = this.map;
        for (key in map) {
            if (map.hasOwnProperty(key)) {
                arr.push(isKey ? key : map[key]);
            }
        }
        return arr;
    },

    /**
     * Executes the specified function once for each item in the hash.
     *
     * @param {Function} fn The function to execute.
     * @param {String} fn.key The key of the item.
     * @param {Number} fn.value The value of the item.
     * @param {Number} fn.length The total number of items in the hash.
     * @param {Boolean} fn.return Returning `false` from the function will cease the iteration.
     * @param {Object} [scope=this] The scope to execute in.
     * @return {Ext.util.HashMap} this
     */
    each: function(fn, scope) {
        // copy items so they may be removed during iteration.
        var items = Ext.apply({}, this.map),
            key,
            length = this.length;

        scope = scope || this;
        for (key in items) {
            if (items.hasOwnProperty(key)) {
                if (fn.call(scope, key, items[key], length) === false) {
                    break;
                }
            }
        }
        return this;
    },

    /**
     * Performs a shallow copy on this hash.
     * @return {Ext.util.HashMap} The new hash object.
     */
    clone: function() {
        var hash = new Ext.util.HashMap(),
            map = this.map,
            key;

        hash.suspendEvents();
        for (key in map) {
            if (map.hasOwnProperty(key)) {
                hash.add(key, map[key]);
            }
        }
        hash.resumeEvents();
        return hash;
    },

    /**
     * @private
     * Find the key for a value.
     * @param {Object} value The value to find.
     * @return {Object} The value of the item. Returns `undefined` if not found.
     */
    findKey: function(value) {
        var key,
            map = this.map;

        for (key in map) {
            if (map.hasOwnProperty(key) && map[key] === value) {
                return key;
            }
        }
        return undefined;
    }
});