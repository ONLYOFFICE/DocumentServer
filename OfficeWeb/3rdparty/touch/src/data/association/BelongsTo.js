/**
 * @author Ed Spencer
 * @aside guide models
 *
 * Represents a many to one association with another model. The owner model is expected to have
 * a foreign key which references the primary key of the associated model:
 *
 *     Ext.define('Category', {
 *         extend: 'Ext.data.Model',
 *         config: {
 *             fields: [
 *                 { name: 'id',   type: 'int' },
 *                 { name: 'name', type: 'string' }
 *             ]
 *         }
 *     });
 *
 *     Ext.define('Product', {
 *         extend: 'Ext.data.Model',
 *         config: {
 *             fields: [
 *                 { name: 'id',          type: 'int' },
 *                 { name: 'category_id', type: 'int' },
 *                 { name: 'name',        type: 'string' }
 *             ],
 *             // we can use the belongsTo shortcut on the model to create a belongsTo association
 *             associations: { type: 'belongsTo', model: 'Category' }
 *         }
 *     });
 *
 * In the example above we have created models for Products and Categories, and linked them together
 * by saying that each Product belongs to a Category. This automatically links each Product to a Category
 * based on the Product's category_id, and provides new functions on the Product model:
 *
 * ## Generated getter function
 *
 * The first function that is added to the owner model is a getter function:
 *
 *     var product = new Product({
 *         id: 100,
 *         category_id: 20,
 *         name: 'Sneakers'
 *     });
 *
 *     product.getCategory(function(category, operation) {
 *         // do something with the category object
 *         alert(category.get('id')); // alerts 20
 *     }, this);
 *
 * The getCategory function was created on the Product model when we defined the association. This uses the
 * Category's configured {@link Ext.data.proxy.Proxy proxy} to load the Category asynchronously, calling the provided
 * callback when it has loaded.
 *
 * The new getCategory function will also accept an object containing success, failure and callback properties
 * - callback will always be called, success will only be called if the associated model was loaded successfully
 * and failure will only be called if the associated model could not be loaded:
 *
 *     product.getCategory({
 *         reload: true, // force a reload if the owner model is already cached
 *         callback: function(category, operation) {}, // a function that will always be called
 *         success : function(category, operation) {}, // a function that will only be called if the load succeeded
 *         failure : function(category, operation) {}, // a function that will only be called if the load did not succeed
 *         scope   : this // optionally pass in a scope object to execute the callbacks in
 *     });
 *
 * In each case above the callbacks are called with two arguments - the associated model instance and the
 * {@link Ext.data.Operation operation} object that was executed to load that instance. The Operation object is
 * useful when the instance could not be loaded.
 *
 * Once the getter has been called on the model, it will be cached if the getter is called a second time. To
 * force the model to reload, specify reload: true in the options object.
 *
 * ## Generated setter function
 *
 * The second generated function sets the associated model instance - if only a single argument is passed to
 * the setter then the following two calls are identical:
 *
 *     // this call...
 *     product.setCategory(10);
 *
 *     // is equivalent to this call:
 *     product.set('category_id', 10);
 *
 * An instance of the owner model can also be passed as a parameter.
 *
 * If we pass in a second argument, the model will be automatically saved and the second argument passed to
 * the owner model's {@link Ext.data.Model#save save} method:
 *
 *     product.setCategory(10, function(product, operation) {
 *         // the product has been saved
 *         alert(product.get('category_id')); //now alerts 10
 *     });
 *
 *     //alternative syntax:
 *     product.setCategory(10, {
 *         callback: function(product, operation) {}, // a function that will always be called
 *         success : function(product, operation) {}, // a function that will only be called if the load succeeded
 *         failure : function(product, operation) {}, // a function that will only be called if the load did not succeed
 *         scope   : this //optionally pass in a scope object to execute the callbacks in
 *     });
 *
 * ## Customization
 *
 * Associations reflect on the models they are linking to automatically set up properties such as the
 * {@link #primaryKey} and {@link #foreignKey}. These can alternatively be specified:
 *
 *     Ext.define('Product', {
 *         extend: 'Ext.data.Model',
 *         config: {
 *             fields: [
 *                 // ...
 *             ],
 *
 *             associations: [
 *                 { type: 'belongsTo', model: 'Category', primaryKey: 'unique_id', foreignKey: 'cat_id' }
 *             ]
 *         }
 *     });
 *
 * Here we replaced the default primary key (defaults to 'id') and foreign key (calculated as 'category_id')
 * with our own settings. Usually this will not be needed.
 */
Ext.define('Ext.data.association.BelongsTo', {
    extend: 'Ext.data.association.Association',
    alternateClassName: 'Ext.data.BelongsToAssociation',
    alias: 'association.belongsto',

    config: {
        /**
         * @cfg {String} foreignKey The name of the foreign key on the owner model that links it to the associated
         * model. Defaults to the lowercased name of the associated model plus "_id", e.g. an association with a
         * model called Product would set up a product_id foreign key.
         *
         *     Ext.define('Order', {
         *         extend: 'Ext.data.Model',
         *         fields: ['id', 'date'],
         *         hasMany: 'Product'
         *     });
         *
         *     Ext.define('Product', {
         *         extend: 'Ext.data.Model',
         *         fields: ['id', 'name', 'order_id'], // refers to the id of the order that this product belongs to
         *         belongsTo: 'Group'
         *     });
         *     var product = new Product({
         *         id: 1,
         *         name: 'Product 1',
         *         order_id: 22
         *     }, 1);
         *     product.getOrder(); // Will make a call to the server asking for order_id 22
         *
         */
        foreignKey: undefined,

        /**
         * @cfg {String} getterName The name of the getter function that will be added to the local model's prototype.
         * Defaults to 'get' + the name of the foreign model, e.g. getCategory
         */
        getterName: undefined,

        /**
         * @cfg {String} setterName The name of the setter function that will be added to the local model's prototype.
         * Defaults to 'set' + the name of the foreign model, e.g. setCategory
         */
        setterName: undefined,

        instanceName: undefined
    },

    applyForeignKey: function(foreignKey) {
        if (!foreignKey) {
            foreignKey = this.getAssociatedName().toLowerCase() + '_id';
        }
        return foreignKey;
    },

    updateForeignKey: function(foreignKey, oldForeignKey) {
        var fields = this.getOwnerModel().getFields(),
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
                fields.isDirty = true;
                fields.remove(field);
            }
        }
    },

    applyInstanceName: function(instanceName) {
        if (!instanceName) {
            instanceName = this.getAssociatedName() + 'BelongsToInstance';
        }
        return instanceName;
    },

    applyAssociationKey: function(associationKey) {
        if (!associationKey) {
            var associatedName = this.getAssociatedName();
            associationKey = associatedName[0].toLowerCase() + associatedName.slice(1);
        }
        return associationKey;
    },

    applyGetterName: function(getterName) {
        if (!getterName) {
            var associatedName = this.getAssociatedName();
            getterName = 'get' + associatedName[0].toUpperCase() + associatedName.slice(1);
        }
        return getterName;
    },

    applySetterName: function(setterName) {
        if (!setterName) {
            var associatedName = this.getAssociatedName();
            setterName = 'set' + associatedName[0].toUpperCase() + associatedName.slice(1);
        }
        return setterName;
    },

    updateGetterName: function(getterName, oldGetterName) {
        var ownerProto = this.getOwnerModel().prototype;
        if (oldGetterName) {
            delete ownerProto[oldGetterName];
        }
        if (getterName) {
            ownerProto[getterName] = this.createGetter();
        }
    },

    updateSetterName: function(setterName, oldSetterName) {
        var ownerProto = this.getOwnerModel().prototype;
        if (oldSetterName) {
            delete ownerProto[oldSetterName];
        }
        if (setterName) {
            ownerProto[setterName] = this.createSetter();
        }
    },

    /**
     * @private
     * Returns a setter function to be placed on the owner model's prototype
     * @return {Function} The setter function
     */
    createSetter: function() {
        var me = this,
            foreignKey = me.getForeignKey(),
            associatedModel = me.getAssociatedModel(),
            currentOwner, newOwner, store;

        //'this' refers to the Model instance inside this function
        return function(value, options, scope) {
            var inverse = me.getInverseAssociation(),
                record = this;

            // If we pass in an instance, pull the id out
            if (value && value.isModel) {
                value = value.getId();
            }

            if (Ext.isFunction(options)) {
                options = {
                    callback: options,
                    scope: scope || record
                };
            }

            // Remove the current belongsToInstance
            delete record[me.getInstanceName()];

            currentOwner = Ext.data.Model.cache[Ext.data.Model.generateCacheId(associatedModel.modelName, this.get(foreignKey))];
            newOwner     = Ext.data.Model.cache[Ext.data.Model.generateCacheId(associatedModel.modelName, value)];

            record.set(foreignKey, value);

            if (inverse) {
                // We first add it to the new owner so that the record wouldnt be destroyed if it was the last store it was in
                if (newOwner) {
                    if (inverse.getType().toLowerCase() === 'hasmany') {
                        store = newOwner[inverse.getName()]();
                        store.add(record);
                    } else {
                        newOwner[inverse.getInstanceName()] = record;
                    }
                }

                if (currentOwner) {
                    if (inverse.getType().toLowerCase() === 'hasmany') {
                        store = currentOwner[inverse.getName()]();
                        store.remove(record);
                    } else {
                        delete value[inverse.getInstanceName()];
                    }
                }
            }

            if (newOwner) {
                record[me.getInstanceName()] = newOwner;
            }

            if (Ext.isObject(options)) {
                return record.save(options);
            }

            return record;
        };
    },

    /**
     * @private
     * Returns a getter function to be placed on the owner model's prototype. We cache the loaded instance
     * the first time it is loaded so that subsequent calls to the getter always receive the same reference.
     * @return {Function} The getter function
     */
    createGetter: function() {
        var me              = this,
            associatedModel = me.getAssociatedModel(),
            foreignKey      = me.getForeignKey(),
            instanceName    = me.getInstanceName();

        //'this' refers to the Model instance inside this function
        return function(options, scope) {
            options = options || {};

            var model = this,
                foreignKeyId = model.get(foreignKey),
                success,
                instance,
                args;

            instance = model[instanceName];

            if (!instance) {
                instance = Ext.data.Model.cache[Ext.data.Model.generateCacheId(associatedModel.modelName, foreignKeyId)];
                if (instance) {
                    model[instanceName] = instance;
                }
            }

            if (options.reload === true || instance === undefined) {
                if (typeof options == 'function') {
                    options = {
                        callback: options,
                        scope: scope || model
                    };
                }

                // Overwrite the success handler so we can assign the current instance
                success = options.success;
                options.success = function(rec) {
                    model[instanceName] = rec;
                    if (success) {
                        success.apply(this, arguments);
                    }
                };

                associatedModel.load(foreignKeyId, options);
            } else {
                args = [instance];
                scope = scope || model;

                Ext.callback(options, scope, args);
                Ext.callback(options.success, scope, args);
                Ext.callback(options.failure, scope, args);
                Ext.callback(options.callback, scope, args);

                return instance;
            }
        };
    },

    /**
     * Read associated data
     * @private
     * @param {Ext.data.Model} record The record we're writing to
     * @param {Ext.data.reader.Reader} reader The reader for the associated model
     * @param {Object} associationData The raw associated data
     */
    read: function(record, reader, associationData){
        record[this.getInstanceName()] = reader.read([associationData]).getRecords()[0];
    },

    getInverseAssociation: function() {
        var ownerName = this.getOwnerModel().modelName,
            foreignKey = this.getForeignKey();

        return this.getAssociatedModel().associations.findBy(function(assoc) {
            var type = assoc.getType().toLowerCase();
            return (type === 'hasmany' || type === 'hasone') && assoc.getAssociatedModel().modelName === ownerName && assoc.getForeignKey() === foreignKey;
        });
    }
});
