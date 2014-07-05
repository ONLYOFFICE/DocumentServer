/**
 * @author Ed Spencer
 * @aside guide models
 *
 * Associations enable you to express relationships between different {@link Ext.data.Model Models}. Let's say we're
 * writing an ecommerce system where Users can make Orders - there's a relationship between these Models that we can
 * express like this:
 *
 *     Ext.define('MyApp.model.User', {
 *         extend: 'Ext.data.Model',
 *
 *         config: {
 *             fields: ['id', 'name', 'email'],
 *             hasMany: {
 *                 model: 'MyApp.model.Order',
 *                 name: 'orders'
 *             }
 *         }
 *     });
 *
 *     Ext.define('MyApp.model.Order', {
 *         extend: 'Ext.data.Model',
 *
 *         config: {
 *             fields: ['id', 'user_id', 'status', 'price'],
 *             belongsTo: 'MyApp.model.User'
 *         }
 *     });
 *
 * We've set up two models - User and Order - and told them about each other. You can set up as many associations on
 * each Model as you need using the two default types - {@link Ext.data.association.HasMany hasMany} and
 * {@link Ext.data.association.BelongsTo belongsTo}. There's much more detail on the usage of each of those inside their
 * documentation pages. If you're not familiar with Models already, {@link Ext.data.Model there is plenty on those too}.
 *
 * ## Further Reading
 *
 * - {@link Ext.data.association.HasMany hasMany associations}
 * - {@link Ext.data.association.BelongsTo belongsTo associations}
 * - {@link Ext.data.association.HasOne hasOne associations}
 * - {@link Ext.data.Model using Models}
 *
 * ### Self-associating Models
 *
 * We can also have models that create parent/child associations between the same type. Below is an example, where
 * groups can be nested inside other groups:
 *
 *     // Server Data
 *     {
 *         "groups": {
 *             "id": 10,
 *             "parent_id": 100,
 *             "name": "Main Group",
 *             "parent_group": {
 *                 "id": 100,
 *                 "parent_id": null,
 *                 "name": "Parent Group"
 *             },
 *             "nested" : {
 *                 "child_groups": [{
 *                     "id": 2,
 *                     "parent_id": 10,
 *                     "name": "Child Group 1"
 *                 },{
 *                     "id": 3,
 *                     "parent_id": 10,
 *                     "name": "Child Group 2"
 *                 },{
 *                     "id": 4,
 *                     "parent_id": 10,
 *                     "name": "Child Group 3"
 *                 }]
 *             }
 *         }
 *     }
 *
 *     // Client code
 *     Ext.define('MyApp.model.Group', {
 *         extend: 'Ext.data.Model',
 *         config: {
 *             fields: ['id', 'parent_id', 'name'],
 *             proxy: {
 *                 type: 'ajax',
 *                 url: 'data.json',
 *                 reader: {
 *                     type: 'json',
 *                     root: 'groups'
 *                 }
 *             },
 *             associations: [{
 *                 type: 'hasMany',
 *                 model: 'MyApp.model.Group',
 *                 primaryKey: 'id',
 *                 foreignKey: 'parent_id',
 *                 autoLoad: true,
 *                 associationKey: 'nested.child_groups' // read child data from nested.child_groups
 *             }, {
 *                 type: 'belongsTo',
 *                 model: 'MyApp.model.Group',
 *                 primaryKey: 'id',
 *                 foreignKey: 'parent_id',
 *                 associationKey: 'parent_group' // read parent data from parent_group
 *             }]
 *         }
 *     });
 *
 *
 *     Ext.onReady(function(){
 *         MyApp.model.Group.load(10, {
 *             success: function(group){
 *                 console.log(group.getGroup().get('name'));
 *
 *                 group.groups().each(function(rec){
 *                     console.log(rec.get('name'));
 *                 });
 *             }
 *         });
 *
 *     });
 */
Ext.define('Ext.data.association.Association', {
    alternateClassName: 'Ext.data.Association',

    requires: ['Ext.data.ModelManager'],

    config: {
        /**
         * @cfg {Ext.data.Model/String} ownerModel (required) The full class name or reference to the class that owns this
         * associations. This is a required configuration on every association.
         * @accessor
         */
        ownerModel: null,

        /*
         * @cfg {String} ownerName The name for the owner model. This defaults to the last part
         * of the class name of the {@link #ownerModel}.
         */
        ownerName: undefined,

        /**
         * @cfg {String} associatedModel (required) The full class name or reference to the class that the {@link #ownerModel}
         * is being associated with. This is a required configuration on every association.
         * @accessor
         */
        associatedModel: null,

        /**
         * @cfg {String} associatedName The name for the associated model. This defaults to the last part
         * of the class name of the {@link #associatedModel}.
         * @accessor
         */
        associatedName: undefined,


        /**
         * @cfg {String} associationKey The name of the property in the data to read the association from.
         * Defaults to the {@link #associatedName} plus '_id'.
         */
        associationKey: undefined,

        /**
         * @cfg {String} primaryKey The name of the primary key on the associated model.
         * In general this will be the {@link Ext.data.Model#idProperty} of the Model.
         */
        primaryKey: 'id',

        /**
         * @cfg {Ext.data.reader.Reader} reader A special reader to read associated data.
         */
        reader: null,

        /**
         * @cfg {String} type The type configuration can be used when creating associations using a configuration object.
         * Use `hasMany` to create a HasMany association.
         *
         *     associations: [{
         *         type: 'hasMany',
         *         model: 'User'
         *     }]
         */
        type: null,

        name: undefined
    },

    statics: {
        create: function(association) {
            if (!association.isAssociation) {
                if (Ext.isString(association)) {
                    association = {
                        type: association
                    };
                }
                association.type = association.type.toLowerCase();
                return Ext.factory(association, Ext.data.association.Association, null, 'association');
            }

            return association;
        }
    },

    /**
     * Creates the Association object.
     * @param {Object} config (optional) Config object.
     */
    constructor: function(config) {
        this.initConfig(config);
    },

    applyName: function(name) {
        if (!name) {
            name = this.getAssociatedName();
        }
        return name;
    },

    applyOwnerModel: function(ownerName) {
        var ownerModel = Ext.data.ModelManager.getModel(ownerName);
        if (ownerModel === undefined) {
            Ext.Logger.error('The configured ownerModel was not valid (you tried ' + ownerName + ')');
        }
        return ownerModel;
    },

    applyOwnerName: function(ownerName) {
        if (!ownerName) {
            ownerName = this.getOwnerModel().modelName;
        }
        ownerName = ownerName.slice(ownerName.lastIndexOf('.')+1);
        return ownerName;
    },

    updateOwnerModel: function(ownerModel, oldOwnerModel) {
        if (oldOwnerModel) {
            this.setOwnerName(ownerModel.modelName);
        }
    },

    applyAssociatedModel: function(associatedName) {
        var associatedModel = Ext.data.ModelManager.types[associatedName];
        if (associatedModel === undefined) {
            Ext.Logger.error('The configured associatedModel was not valid (you tried ' + associatedName + ')');
        }
        return associatedModel;
    },

    applyAssociatedName: function(associatedName) {
        if (!associatedName) {
            associatedName = this.getAssociatedModel().modelName;
        }
        associatedName = associatedName.slice(associatedName.lastIndexOf('.')+1);
        return associatedName;
    },

    updateAssociatedModel: function(associatedModel, oldAssociatedModel) {
        if (oldAssociatedModel) {
            this.setAssociatedName(associatedModel.modelName);
        }
    },

    applyReader: function(reader) {
        if (reader) {
            if (Ext.isString(reader)) {
                reader = {
                    type: reader
                };
            }

            if (!reader.isReader) {
                Ext.applyIf(reader, {
                    type: 'json'
                });
            }
        }

        return Ext.factory(reader, Ext.data.Reader, this.getReader(), 'reader');
    },

    updateReader: function(reader) {
        reader.setModel(this.getAssociatedModel());
    }

    // Convert old properties in data into a config object
    // <deprecated product=touch since=2.0>
    ,onClassExtended: function(cls, data, hooks) {
        var Component = this,
            defaultConfig = Component.prototype.config,
            config = data.config || {},
            key;


        for (key in defaultConfig) {
            if (key in data) {
                config[key] = data[key];
                delete data[key];
                // <debug warn>
                Ext.Logger.deprecate(key + ' is deprecated as a property directly on the Association prototype. ' +
                    'Please put it inside the config object.');
                // </debug>
            }
        }

        data.config = config;
    }
    // </deprecated>
});
