/**
 * @private
 *
 * Provides a registry of all Components (instances of {@link Ext.Component} or any subclass
 * thereof) on a page so that they can be easily accessed by {@link Ext.Component component}
 * {@link Ext.Component#getId id} (see {@link #get}, or the convenience method {@link Ext#getCmp Ext.getCmp}).
 *
 * This object also provides a registry of available Component _classes_
 * indexed by a mnemonic code known as the Component's `xtype`.
 * The `xtype` provides a way to avoid instantiating child Components
 * when creating a full, nested config object for a complete Ext page.
 *
 * A child Component may be specified simply as a _config object_
 * as long as the correct `xtype` is specified so that if and when the Component
 * needs rendering, the correct type can be looked up for lazy instantiation.
 *
 * For a list of all available `xtype`, see {@link Ext.Component}.
 */
Ext.define('Ext.ComponentManager', {
    alternateClassName: 'Ext.ComponentMgr',
    singleton: true,

    constructor: function() {
        var map = {};

        // The sole reason for this is just to support the old code of ComponentQuery
        this.all = {
            map: map,

            getArray: function() {
                var list = [],
                    id;

                for (id in map) {
                    list.push(map[id]);
                }

                return list;
            }
        };

        this.map = map;
    },

    /**
     * Registers an item to be managed.
     * @param {Object} component The item to register.
     */
    register: function(component) {
        var id = component.getId();

        // <debug>
        if (this.map[id]) {
            Ext.Logger.warn('Registering a component with a id (`' + id + '`) which has already been used. Please ensure the existing component has been destroyed (`Ext.Component#destroy()`.');
        }
        // </debug>

        this.map[component.getId()] = component;
    },

    /**
     * Unregisters an item by removing it from this manager.
     * @param {Object} component The item to unregister.
     */
    unregister: function(component) {
        delete this.map[component.getId()];
    },

    /**
     * Checks if an item type is registered.
     * @param {String} component The mnemonic string by which the class may be looked up.
     * @return {Boolean} Whether the type is registered.
     */
    isRegistered : function(component){
        return this.map[component] !== undefined;
    },

    /**
     * Returns an item by id.
     * For additional details see {@link Ext.util.HashMap#get}.
     * @param {String} id The `id` of the item.
     * @return {Object} The item, or `undefined` if not found.
     */
    get: function(id) {
        return this.map[id];
    },

    /**
     * Creates a new Component from the specified config object using the
     * config object's `xtype` to determine the class to instantiate.
     * @param {Object} config A configuration object for the Component you wish to create.
     * @param {Function} defaultType (optional) The constructor to provide the default Component type if
     * the config object does not contain a `xtype`. (Optional if the config contains an `xtype`).
     * @return {Ext.Component} The newly instantiated Component.
     */
    create: function(component, defaultType) {
        if (component.isComponent) {
            return component;
        }
        else if (Ext.isString(component)) {
            return Ext.createByAlias('widget.' + component);
        }
        else {
            var type = component.xtype || defaultType;

            return Ext.createByAlias('widget.' + type, component);
        }
    },

    registerType: Ext.emptyFn
});
