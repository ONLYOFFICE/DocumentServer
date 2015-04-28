/**
 * @docauthor Evan Trimboli <evan@sencha.com>
 * @aside guide stores
 *
 * Contains a collection of all stores that are created that have an identifier. An identifier can be assigned by
 * setting the {@link Ext.data.Store#storeId storeId} property. When a store is in the StoreManager, it can be
 * referred to via it's identifier:
 *
 *     Ext.create('Ext.data.Store', {
 *         model: 'SomeModel',
 *         storeId: 'myStore'
 *     });
 *
 *     var store = Ext.data.StoreManager.lookup('myStore');
 *
 * Also note that the {@link #lookup} method is aliased to {@link Ext#getStore} for convenience.
 *
 * If a store is registered with the StoreManager, you can also refer to the store by it's identifier when registering
 * it with any Component that consumes data from a store:
 *
 *     Ext.create('Ext.data.Store', {
 *         model: 'SomeModel',
 *         storeId: 'myStore'
 *     });
 *
 *     Ext.create('Ext.view.View', {
 *         store: 'myStore'
 *         // other configuration here
 *     });
 */
Ext.define('Ext.data.StoreManager', {
    extend: 'Ext.util.Collection',
    alternateClassName: ['Ext.StoreMgr', 'Ext.data.StoreMgr', 'Ext.StoreManager'],
    singleton: true,
    uses: ['Ext.data.ArrayStore', 'Ext.data.Store'],

    /**
     * Registers one or more Stores with the StoreManager. You do not normally need to register stores manually. Any
     * store initialized with a {@link Ext.data.Store#storeId} will be auto-registered.
     * @param {Ext.data.Store...} stores Any number of Store instances.
     */
    register : function() {
        for (var i = 0, s; (s = arguments[i]); i++) {
            this.add(s);
        }
    },

    /**
     * Unregisters one or more Stores with the StoreManager.
     * @param {String/Object...} stores Any number of Store instances or ID-s.
     */
    unregister : function() {
        for (var i = 0, s; (s = arguments[i]); i++) {
            this.remove(this.lookup(s));
        }
    },

    /**
     * Gets a registered Store by id.
     * @param {String/Object} store The `id` of the Store, or a Store instance, or a store configuration.
     * @return {Ext.data.Store}
     */
    lookup : function(store) {
        // handle the case when we are given an array or an array of arrays.
        if (Ext.isArray(store)) {
            var fields = ['field1'],
                expand = !Ext.isArray(store[0]),
                data = store,
                i,
                len;

            if (expand) {
                data = [];
                for (i = 0, len = store.length; i < len; ++i) {
                    data.push([store[i]]);
                }
            } else {
                for(i = 2, len = store[0].length; i <= len; ++i){
                    fields.push('field' + i);
                }
            }
            return Ext.create('Ext.data.ArrayStore', {
                data  : data,
                fields: fields,
                // See https://sencha.jira.com/browse/TOUCH-1541
                autoDestroy: true,
                autoCreated: true,
                expanded: expand
            });
        }

        if (Ext.isString(store)) {
            // store id
            return this.get(store);
        } else {
            // store instance or store config
            if (store instanceof Ext.data.Store) {
                return store;
            } else {
                return Ext.factory(store, Ext.data.Store, null, 'store');
            }
        }
    },

    // getKey implementation for MixedCollection
    getKey : function(o) {
         return o.getStoreId();
    }
}, function() {
    /**
     * Creates a new store for the given id and config, then registers it with the {@link Ext.data.StoreManager Store Manager}.
     * Sample usage:
     *
     *     Ext.regStore('AllUsers', {
     *         model: 'User'
     *     });
     *
     *     // the store can now easily be used throughout the application
     *     new Ext.List({
     *         store: 'AllUsers'
     *         // ...
     *     });
     *
     * @param {String} id The id to set on the new store.
     * @param {Object} config The store config.
     * @member Ext
     * @method regStore
     */
    Ext.regStore = function(name, config) {
        var store;

        if (Ext.isObject(name)) {
            config = name;
        } else {
            if (config instanceof Ext.data.Store) {
                config.setStoreId(name);
            } else {
                config.storeId = name;
            }
        }

        if (config instanceof Ext.data.Store) {
            store = config;
        } else {
            store = Ext.create('Ext.data.Store', config);
        }

        return Ext.data.StoreManager.register(store);
    };

    /**
     * Shortcut to {@link Ext.data.StoreManager#lookup}.
     * @member Ext
     * @method getStore
     * @alias Ext.data.StoreManager#lookup
     */
    Ext.getStore = function(name) {
        return Ext.data.StoreManager.lookup(name);
    };
});
