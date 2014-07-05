/**
 * @aside guide models
 *
 * Represents a one to one association with another model. The owner model is expected to have
 * a foreign key which references the primary key of the associated model:
 *
 *     Ext.define('Person', {
 *         extend: 'Ext.data.Model',
 *         config: {
 *             fields: [
 *                 { name: 'id', type: 'int' },
 *                 { name: 'name', type: 'string' },
 *                 { name: 'address_id', type: 'int'}
 *             ],
 *
 *             // we can use the hasOne shortcut on the model to create a hasOne association
 *             associations: { type: 'hasOne', model: 'Address' }
 *         }
 *     });
 *
 *     Ext.define('Address', {
 *         extend: 'Ext.data.Model',
 *         config: {
 *             fields: [
 *                 { name: 'id', type: 'int' },
 *                 { name: 'number', type: 'string' },
 *                 { name: 'street', type: 'string' },
 *                 { name: 'city', type: 'string' },
 *                 { name: 'zip', type: 'string' }
 *             ]
 *         }
 *     });
 *
 * In the example above we have created models for People and Addresses, and linked them together
 * by saying that each Person has a single Address. This automatically links each Person to an Address
 * based on the Persons address_id, and provides new functions on the Person model:
 *
 * ## Generated getter function
 *
 * The first function that is added to the owner model is a getter function:
 *
 *     var person = Ext.create('Person', {
 *         id: 100,
 *         address_id: 20,
 *         name: 'John Smith'
 *     });
 *
 *     person.getAddress(function(address, operation) {
 *         // do something with the address object
 *         alert(address.get('id')); // alerts 20
 *     }, this);
 *
 * The getAddress function was created on the Person model when we defined the association. This uses the
 * Persons configured {@link Ext.data.proxy.Proxy proxy} to load the Address asynchronously, calling the provided
 * callback when it has loaded.
 *
 * The new getAddress function will also accept an object containing success, failure and callback properties
 * - callback will always be called, success will only be called if the associated model was loaded successfully
 * and failure will only be called if the associated model could not be loaded:
 *
 *     person.getAddress({
 *         reload: true, // force a reload if the owner model is already cached
 *         callback: function(address, operation) {}, // a function that will always be called
 *         success : function(address, operation) {}, // a function that will only be called if the load succeeded
 *         failure : function(address, operation) {}, // a function that will only be called if the load did not succeed
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
 *     person.setAddress(10);
 *
 *     // is equivalent to this call:
 *     person.set('address_id', 10);
 *
 * An instance of the owner model can also be passed as a parameter.
 *
 * If we pass in a second argument, the model will be automatically saved and the second argument passed to
 * the owner model's {@link Ext.data.Model#save save} method:
 *
 *     person.setAddress(10, function(address, operation) {
 *         // the address has been saved
 *         alert(address.get('address_id')); //now alerts 10
 *     });
 *
 *     //alternative syntax:
 *     person.setAddress(10, {
 *         callback: function(address, operation) {}, // a function that will always be called
 *         success : function(address, operation) {}, // a function that will only be called if the load succeeded
 *         failure : function(address, operation) {}, // a function that will only be called if the load did not succeed
 *         scope   : this //optionally pass in a scope object to execute the callbacks in
 *     });
 *
 * ## Customization
 *
 * Associations reflect on the models they are linking to automatically set up properties such as the
 * {@link #primaryKey} and {@link #foreignKey}. These can alternatively be specified:
 *
 *     Ext.define('Person', {
 *         extend: 'Ext.data.Model',
 *         config: {
 *             fields: [
 *                 // ...
 *             ],
 *
 *             associations: [
 *                 { type: 'hasOne', model: 'Address', primaryKey: 'unique_id', foreignKey: 'addr_id' }
 *             ]
 *         }
 *     });
 *
 * Here we replaced the default primary key (defaults to 'id') and foreign key (calculated as 'address_id')
 * with our own settings. Usually this will not be needed.
 */
Ext.define('Ext.data.association.HasOne', {
    extend: 'Ext.data.association.Association',
    alternateClassName: 'Ext.data.HasOneAssociation',

    alias: 'association.hasone',

    config: {
        /**
         * @cfg {String} foreignKey The name of the foreign key on the owner model that links it to the associated
         * model. Defaults to the lowercased name of the associated model plus "_id", e.g. an association with a
         * model called Person would set up a address_id foreign key.
         *
         *     Ext.define('Person', {
         *         extend: 'Ext.data.Model',
         *         fields: ['id', 'name', 'address_id'], // refers to the id of the address object
         *         hasOne: 'Address'
         *     });
         *
         *     Ext.define('Address', {
         *         extend: 'Ext.data.Model',
         *         fields: ['id', 'number', 'street', 'city', 'zip'],
         *         belongsTo: 'Person'
         *     });
         *     var Person = new Person({
         *         id: 1,
         *         name: 'John Smith',
         *         address_id: 13
         *     }, 1);
         *     person.getAddress(); // Will make a call to the server asking for address_id 13
         *
         */
        foreignKey: undefined,

        /**
         * @cfg {String} getterName The name of the getter function that will be added to the local model's prototype.
         * Defaults to 'get' + the name of the foreign model, e.g. getAddress
         */
        getterName: undefined,

        /**
         * @cfg {String} setterName The name of the setter function that will be added to the local model's prototype.
         * Defaults to 'set' + the name of the foreign model, e.g. setAddress
         */
        setterName: undefined,

        instanceName: undefined
    },

    applyForeignKey: function(foreignKey) {
        if (!foreignKey) {
            var inverse = this.getInverseAssociation();
            if (inverse) {
                foreignKey = inverse.getForeignKey();
            } else {
                foreignKey = this.getAssociatedName().toLowerCase() + '_id';
            }
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
                fields.remove(field);
                fields.isDirty = true;
            }
        }
    },

    applyInstanceName: function(instanceName) {
        if (!instanceName) {
            instanceName = this.getAssociatedName() + 'HasOneInstance';
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
        var me              = this,
            foreignKey      = me.getForeignKey(),
            instanceName    = me.getInstanceName(),
            associatedModel = me.getAssociatedModel();

        //'this' refers to the Model instance inside this function
        return function(value, options, scope) {
            var Model = Ext.data.Model,
                record;

            if (value && value.isModel) {
                value = value.getId();
            }

            this.set(foreignKey, value);

            record = Model.cache[Model.generateCacheId(associatedModel.modelName, value)];
            if (record) {
                this[instanceName] = record;
            }

            if (Ext.isFunction(options)) {
                options = {
                    callback: options,
                    scope: scope || this
                };
            }

            if (Ext.isObject(options)) {
                return this.save(options);
            }

            return this;
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
                success, instance, args;

            if (options.reload === true || model[instanceName] === undefined) {
                if (typeof options == 'function') {
                    options = {
                        callback: options,
                        scope: scope || model
                    };
                }

                // Overwrite the success handler so we can assign the current instance
                success = options.success;
                options.success = function(rec){
                    model[instanceName] = rec;
                    if (success) {
                        success.call(this, arguments);
                    }
                };

                associatedModel.load(foreignKeyId, options);
            } else {
                instance = model[instanceName];
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
    read: function(record, reader, associationData) {
        var inverse = this.getInverseAssociation(),
            newRecord = reader.read([associationData]).getRecords()[0];

        record[this.getInstanceName()] = newRecord;

        //if the inverse association was found, set it now on each record we've just created
        if (inverse) {
            newRecord[inverse.getInstanceName()] = record;
        }
    },

    getInverseAssociation: function() {
        var ownerName = this.getOwnerModel().modelName;

        return this.getAssociatedModel().associations.findBy(function(assoc) {
            return assoc.getType().toLowerCase() === 'belongsto' && assoc.getAssociatedModel().modelName === ownerName;
        });
    }
});
