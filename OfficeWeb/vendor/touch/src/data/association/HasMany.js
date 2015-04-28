/**
 * @aside guide models
 *
 * Represents a one-to-many relationship between two models. Usually created indirectly via a model definition:
 *
 *     Ext.define('Product', {
 *         extend: 'Ext.data.Model',
 *         config: {
 *             fields: [
 *                 {name: 'id',      type: 'int'},
 *                 {name: 'user_id', type: 'int'},
 *                 {name: 'name',    type: 'string'}
 *             ]
 *         }
 *     });
 *
 *     Ext.define('User', {
 *         extend: 'Ext.data.Model',
 *         config: {
 *             fields: [
 *                 {name: 'id',   type: 'int'},
 *                 {name: 'name', type: 'string'}
 *             ],
 *             // we can use the hasMany shortcut on the model to create a hasMany association
 *             hasMany: {model: 'Product', name: 'products'}
 *         }
 *     });
 *
 * `
 *
 * Above we created Product and User models, and linked them by saying that a User hasMany Products. This gives us a new
 * function on every User instance, in this case the function is called 'products' because that is the name we specified
 * in the association configuration above.
 *
 * This new function returns a specialized {@link Ext.data.Store Store} which is automatically filtered to load only
 * Products for the given model instance:
 *
 *     //first, we load up a User with id of 1
 *     var user = Ext.create('User', {id: 1, name: 'Ed'});
 *
 *     //the user.products function was created automatically by the association and returns a {@link Ext.data.Store Store}
 *     //the created store is automatically scoped to the set of Products for the User with id of 1
 *     var products = user.products();
 *
 *     //we still have all of the usual Store functions, for example it's easy to add a Product for this User
 *     products.add({
 *         name: 'Another Product'
 *     });
 *
 *     //saves the changes to the store - this automatically sets the new Product's user_id to 1 before saving
 *     products.sync();
 *
 * The new Store is only instantiated the first time you call products() to conserve memory and processing time, though
 * calling products() a second time returns the same store instance.
 *
 * _Custom filtering_
 *
 * The Store is automatically furnished with a filter - by default this filter tells the store to only return records
 * where the associated model's foreign key matches the owner model's primary key. For example, if a User with ID = 100
 * hasMany Products, the filter loads only Products with user_id == 100.
 *
 * Sometimes we want to filter by another field - for example in the case of a Twitter search application we may have
 * models for Search and Tweet:
 *
 *     Ext.define('Search', {
 *         extend: 'Ext.data.Model',
 *         config: {
 *             fields: [
 *                 'id', 'query'
 *             ],
 *
 *             hasMany: {
 *                 model: 'Tweet',
 *                 name : 'tweets',
 *                 filterProperty: 'query'
 *             }
 *         }
 *     });
 *
 *     Ext.define('Tweet', {
 *         extend: 'Ext.data.Model',
 *         config: {
 *             fields: [
 *                 'id', 'text', 'from_user'
 *             ]
 *         }
 *     });
 *
 *     //returns a Store filtered by the filterProperty
 *     var store = new Search({query: 'Sencha Touch'}).tweets();
 *
 * The tweets association above is filtered by the query property by setting the {@link #filterProperty}, and is
 * equivalent to this:
 *
 *     var store = Ext.create('Ext.data.Store', {
 *         model: 'Tweet',
 *         filters: [
 *             {
 *                 property: 'query',
 *                 value   : 'Sencha Touch'
 *             }
 *         ]
 *     });
 */
Ext.define('Ext.data.association.HasMany', {
    extend: 'Ext.data.association.Association',
    alternateClassName: 'Ext.data.HasManyAssociation',
    requires: ['Ext.util.Inflector'],

    alias: 'association.hasmany',

    config: {
        /**
         * @cfg {String} foreignKey
         * The name of the foreign key on the associated model that links it to the owner model. Defaults to the
         * lowercased name of the owner model plus "_id", e.g. an association with a model called Group hasMany Users
         * would create 'group_id' as the foreign key. When the remote store is loaded, the store is automatically
         * filtered so that only records with a matching foreign key are included in the resulting child store. This can
         * be overridden by specifying the {@link #filterProperty}.
         *
         *     Ext.define('Group', {
         *         extend: 'Ext.data.Model',
         *         fields: ['id', 'name'],
         *         hasMany: 'User'
         *     });
         *
         *     Ext.define('User', {
         *         extend: 'Ext.data.Model',
         *         fields: ['id', 'name', 'group_id'], // refers to the id of the group that this user belongs to
         *         belongsTo: 'Group'
         *     });
         */
        foreignKey: undefined,

        /**
         * @cfg {String} name
         * The name of the function to create on the owner model to retrieve the child store. If not specified, the
         * pluralized name of the child model is used.
         *
         *     // This will create a users() method on any Group model instance
         *     Ext.define('Group', {
         *         extend: 'Ext.data.Model',
         *         fields: ['id', 'name'],
         *         hasMany: 'User'
         *     });
         *     var group = new Group();
         *     console.log(group.users());
         *
         *     // The method to retrieve the users will now be getUserList
         *     Ext.define('Group', {
         *         extend: 'Ext.data.Model',
         *         fields: ['id', 'name'],
         *         hasMany: {model: 'User', name: 'getUserList'}
         *     });
         *     var group = new Group();
         *     console.log(group.getUserList());
         */

        /**
         * @cfg {Object} store
         * Optional configuration object that will be passed to the generated Store. Defaults to an empty Object.
         */
        store: undefined,

        /**
         * @cfg {String} storeName
         * Optional The name of the store by which you can reference it on this class as a property.
         */
        storeName: undefined,

        /**
         * @cfg {String} filterProperty
         * Optionally overrides the default filter that is set up on the associated Store. If this is not set, a filter
         * is automatically created which filters the association based on the configured {@link #foreignKey}. See intro
         * docs for more details.
         */
        filterProperty: null,

        /**
         * @cfg {Boolean} autoLoad
         * `true` to automatically load the related store from a remote source when instantiated.
         */
        autoLoad: false,

        /**
         * @cfg {Boolean} autoSync
         * true to automatically synchronize the related store with the remote source
         */
        autoSync: false
    },

    constructor: function(config) {
        config = config || {};

        if (config.storeConfig) {
            // <debug>
            Ext.Logger.warn('storeConfig is deprecated on an association. Instead use the store configuration.');
            // </debug>
            config.store = config.storeConfig;
            delete config.storeConfig;
        }

        this.callParent([config]);
    },

    applyName: function(name) {
        if (!name) {
            name = Ext.util.Inflector.pluralize(this.getAssociatedName().toLowerCase());
        }
        return name;
    },

    applyStoreName: function(name) {
        if (!name) {
            name = this.getName() + 'Store';
        }
        return name;
    },

    applyForeignKey: function(foreignKey) {
        if (!foreignKey) {
            var inverse = this.getInverseAssociation();
            if (inverse) {
                foreignKey = inverse.getForeignKey();
            } else {
                foreignKey = this.getOwnerName().toLowerCase() + '_id';
            }
        }
        return foreignKey;
    },

    applyAssociationKey: function(associationKey) {
        if (!associationKey) {
            var associatedName = this.getAssociatedName();
            associationKey = Ext.util.Inflector.pluralize(associatedName[0].toLowerCase() + associatedName.slice(1));
        }
        return associationKey;
    },

    updateForeignKey: function(foreignKey, oldForeignKey) {
        var fields = this.getAssociatedModel().getFields(),
            field = fields.get(foreignKey);

        if (!field) {
            field = new Ext.data.Field({
                name: foreignKey
            });
            fields.add(field);
            fields.isDirty = true;
        }

        if (oldForeignKey) {
            field = fields.get(oldForeignKey);
            if (field) {
                fields.remove(field);
                fields.isDirty = true;
            }
        }
    },

    /**
     * @private
     * Creates a function that returns an Ext.data.Store which is configured to load a set of data filtered
     * by the owner model's primary key - e.g. in a `hasMany` association where Group `hasMany` Users, this function
     * returns a Store configured to return the filtered set of a single Group's Users.
     * @return {Function} The store-generating function.
     */
    applyStore: function(storeConfig) {
        var me = this,
            association     = me,
            associatedModel = me.getAssociatedModel(),
            storeName       = me.getStoreName(),
            foreignKey      = me.getForeignKey(),
            primaryKey      = me.getPrimaryKey(),
            filterProperty  = me.getFilterProperty(),
            autoLoad        = me.getAutoLoad(),
            autoSync        = me.getAutoSync();

        return function() {
            var record = this,
                config, filter, store,
                modelDefaults = {},
                listeners = {
                    addrecords: me.onAddRecords,
                    removerecords: me.onRemoveRecords,
                    scope: me
                };

            if (record[storeName] === undefined) {
                if (filterProperty) {
                    filter = {
                        property  : filterProperty,
                        value     : record.get(filterProperty),
                        exactMatch: true
                    };
                } else {
                    filter = {
                        property  : foreignKey,
                        value     : record.get(primaryKey),
                        exactMatch: true
                    };
                }

                modelDefaults[foreignKey] = record.get(primaryKey);

                config = Ext.apply({}, storeConfig, {
                    model        : associatedModel,
                    filters      : [filter],
                    remoteFilter : true,
                    autoSync     : autoSync,
                    modelDefaults: modelDefaults,
                    listeners    : listeners
                });

                store = record[storeName] = Ext.create('Ext.data.Store', config);
                store.boundTo = record;

                if (autoLoad) {
                    record[storeName].load();
                }
            }

            return record[storeName];
        };
    },

    onAddRecords: function(store, records) {
        var ln = records.length,
            id = store.boundTo.getId(),
            i, record;

        for (i = 0; i < ln; i++) {
            record = records[i];
            record.set(this.getForeignKey(), id);
        }
        this.updateInverseInstances(store.boundTo);
    },

    onRemoveRecords: function(store, records) {
        var ln = records.length,
            i, record;
        for (i = 0; i < ln; i++) {
            record = records[i];
            record.set(this.getForeignKey(), null);
        }
    },

    updateStore: function(store) {
        this.getOwnerModel().prototype[this.getName()] = store;
    },

    /**
     * Read associated data
     * @private
     * @param {Ext.data.Model} record The record we're writing to.
     * @param {Ext.data.reader.Reader} reader The reader for the associated model.
     * @param {Object} associationData The raw associated data.
     */
    read: function(record, reader, associationData) {
        var store = record[this.getName()](),
            records = reader.read(associationData).getRecords();

        store.add(records);
    },

    updateInverseInstances: function(record) {
        var store = record[this.getName()](),
            inverse = this.getInverseAssociation();

        //if the inverse association was found, set it now on each record we've just created
        if (inverse) {
            store.each(function(associatedRecord) {
                associatedRecord[inverse.getInstanceName()] = record;
            });
        }
    },

    getInverseAssociation: function() {
        var ownerName = this.getOwnerModel().modelName;

        //now that we've added the related records to the hasMany association, set the inverse belongsTo
        //association on each of them if it exists
        return this.getAssociatedModel().associations.findBy(function(assoc) {
            return assoc.getType().toLowerCase() === 'belongsto' && assoc.getAssociatedModel().modelName === ownerName;
        });
    }

    // <deprecated product=touch since=2.0>
}, function() {
    /**
     * @cfg {Object} storeConfig
     * @deprecated 2.0.0 Use `store` instead.
     */
    Ext.deprecateProperty(this, 'storeConfig', 'store');
    // </deprecated>
});
