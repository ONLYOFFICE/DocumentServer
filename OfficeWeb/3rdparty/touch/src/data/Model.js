/**
 * @author Ed Spencer
 * @aside guide models
 *
 * A Model represents some object that your application manages. For example, one might define a Model for Users,
 * Products, Cars, or any other real-world object that we want to model in the system. Models are registered via the
 * {@link Ext.data.ModelManager model manager}, and are used by {@link Ext.data.Store stores}, which are in turn used by many
 * of the data-bound components in Ext.
 *
 * Models are defined as a set of fields and any arbitrary methods and properties relevant to the model. For example:
 *
 *     Ext.define('User', {
 *         extend: 'Ext.data.Model',
 *
 *         config: {
 *             fields: [
 *                 {name: 'name',  type: 'string'},
 *                 {name: 'age',   type: 'int'},
 *                 {name: 'phone', type: 'string'},
 *                 {name: 'alive', type: 'boolean', defaultValue: true}
 *             ]
 *         },
 *
 *         changeName: function() {
 *             var oldName = this.get('name'),
 *                 newName = oldName + " The Barbarian";
 *
 *             this.set('name', newName);
 *         }
 *     });
 *
 * The fields array is turned into a {@link Ext.util.MixedCollection MixedCollection} automatically by the {@link
 * Ext.data.ModelManager ModelManager}, and all other functions and properties are copied to the new Model's prototype.
 *
 * Now we can create instances of our User model and call any model logic we defined:
 *
 *     var user = Ext.create('User', {
 *         name : 'Conan',
 *         age  : 24,
 *         phone: '555-555-5555'
 *     });
 *
 *     user.changeName();
 *     user.get('name'); // returns "Conan The Barbarian"
 *
 * # Validations
 *
 * Models have built-in support for validations, which are executed against the validator functions in {@link
 * Ext.data.validations} ({@link Ext.data.validations see all validation functions}). Validations are easy to add to
 * models:
 *
 *     Ext.define('User', {
 *         extend: 'Ext.data.Model',
 *
 *         config: {
 *             fields: [
 *                 {name: 'name',     type: 'string'},
 *                 {name: 'age',      type: 'int'},
 *                 {name: 'phone',    type: 'string'},
 *                 {name: 'gender',   type: 'string'},
 *                 {name: 'username', type: 'string'},
 *                 {name: 'alive',    type: 'boolean', defaultValue: true}
 *             ],
 *
 *             validations: [
 *                 {type: 'presence',  field: 'age'},
 *                 {type: 'length',    field: 'name',     min: 2},
 *                 {type: 'inclusion', field: 'gender',   list: ['Male', 'Female']},
 *                 {type: 'exclusion', field: 'username', list: ['Admin', 'Operator']},
 *                 {type: 'format',    field: 'username', matcher: /([a-z]+)[0-9]{2,3}/}
 *             ]
 *         }
 *     });
 *
 * The validations can be run by simply calling the {@link #validate} function, which returns a {@link Ext.data.Errors}
 * object:
 *
 *     var instance = Ext.create('User', {
 *         name: 'Ed',
 *         gender: 'Male',
 *         username: 'edspencer'
 *     });
 *
 *     var errors = instance.validate();
 *
 * # Associations
 *
 * Models can have associations with other Models via {@link Ext.data.association.HasOne},
 * {@link Ext.data.association.BelongsTo belongsTo} and {@link Ext.data.association.HasMany hasMany} associations.
 * For example, let's say we're writing a blog administration application which deals with Users, Posts and Comments.
 * We can express the relationships between these models like this:
 *
 *     Ext.define('Post', {
 *         extend: 'Ext.data.Model',
 *
 *         config: {
 *             fields: ['id', 'user_id'],
 *             belongsTo: 'User',
 *             hasMany  : {model: 'Comment', name: 'comments'}
 *         }
 *     });
 *
 *     Ext.define('Comment', {
 *         extend: 'Ext.data.Model',
 *
 *         config: {
 *             fields: ['id', 'user_id', 'post_id'],
 *             belongsTo: 'Post'
 *         }
 *     });
 *
 *     Ext.define('User', {
 *         extend: 'Ext.data.Model',
 *
 *         config: {
 *             fields: ['id'],
 *             hasMany: [
 *                 'Post',
 *                 {model: 'Comment', name: 'comments'}
 *             ]
 *         }
 *     });
 *
 * See the docs for {@link Ext.data.association.HasOne}, {@link Ext.data.association.BelongsTo} and
 * {@link Ext.data.association.HasMany} for details on the usage and configuration of associations.
 * Note that associations can also be specified like this:
 *
 *     Ext.define('User', {
 *         extend: 'Ext.data.Model',
 *
 *         config: {
 *             fields: ['id'],
 *             associations: [
 *                 {type: 'hasMany', model: 'Post',    name: 'posts'},
 *                 {type: 'hasMany', model: 'Comment', name: 'comments'}
 *             ]
 *         }
 *     });
 *
 * # Using a Proxy
 *
 * Models are great for representing types of data and relationships, but sooner or later we're going to want to load or
 * save that data somewhere. All loading and saving of data is handled via a {@link Ext.data.proxy.Proxy Proxy}, which
 * can be set directly on the Model:
 *
 *     Ext.define('User', {
 *         extend: 'Ext.data.Model',
 *
 *         config: {
 *             fields: ['id', 'name', 'email'],
 *             proxy: {
 *                 type: 'rest',
 *                 url : '/users'
 *             }
 *         }
 *     });
 *
 * Here we've set up a {@link Ext.data.proxy.Rest Rest Proxy}, which knows how to load and save data to and from a
 * RESTful backend. Let's see how this works:
 *
 *     var user = Ext.create('User', {name: 'Ed Spencer', email: 'ed@sencha.com'});
 *
 *     user.save(); //POST /users
 *
 * Calling {@link #save} on the new Model instance tells the configured RestProxy that we wish to persist this Model's
 * data onto our server. RestProxy figures out that this Model hasn't been saved before because it doesn't have an id,
 * and performs the appropriate action - in this case issuing a POST request to the url we configured (/users). We
 * configure any Proxy on any Model and always follow this API - see {@link Ext.data.proxy.Proxy} for a full list.
 *
 * Loading data via the Proxy is equally easy:
 *
 *     //get a reference to the User model class
 *     var User = Ext.ModelManager.getModel('User');
 *
 *     //Uses the configured RestProxy to make a GET request to /users/123
 *     User.load(123, {
 *         success: function(user) {
 *             console.log(user.getId()); //logs 123
 *         }
 *     });
 *
 * Models can also be updated and destroyed easily:
 *
 *     //the user Model we loaded in the last snippet:
 *     user.set('name', 'Edward Spencer');
 *
 *     //tells the Proxy to save the Model. In this case it will perform a PUT request to /users/123 as this Model already has an id
 *     user.save({
 *         success: function() {
 *             console.log('The User was updated');
 *         }
 *     });
 *
 *     //tells the Proxy to destroy the Model. Performs a DELETE request to /users/123
 *     user.erase({
 *         success: function() {
 *             console.log('The User was destroyed!');
 *         }
 *     });
 *
 * # Usage in Stores
 *
 * It is very common to want to load a set of Model instances to be displayed and manipulated in the UI. We do this by
 * creating a {@link Ext.data.Store Store}:
 *
 *     var store = Ext.create('Ext.data.Store', {
 *         model: 'User'
 *     });
 *
 *     //uses the Proxy we set up on Model to load the Store data
 *     store.load();
 *
 * A Store is just a collection of Model instances - usually loaded from a server somewhere. Store can also maintain a
 * set of added, updated and removed Model instances to be synchronized with the server via the Proxy. See the {@link
 * Ext.data.Store Store docs} for more information on Stores.
 */
Ext.define('Ext.data.Model', {
    alternateClassName: 'Ext.data.Record',

    mixins: {
        observable: 'Ext.mixin.Observable'
    },

    /**
     * Provides an easy way to quickly determine if a given class is a Model
     * @property isModel
     * @type Boolean
     * @private
     */
    isModel: true,

    requires: [
        'Ext.util.Collection',
        'Ext.data.Field',
        'Ext.data.identifier.Simple',
        'Ext.data.ModelManager',
        'Ext.data.proxy.Ajax',
        'Ext.data.association.HasMany',
        'Ext.data.association.BelongsTo',
        'Ext.data.association.HasOne',
        'Ext.data.Errors'
    ],

    config: {
        /**
         * @cfg {String} idProperty
         * The name of the field treated as this Model's unique `id`. Note that this field
         * needs to have a type of 'auto'. Setting the field type to anything else will be undone by the
         * framework. This is because new records that are created without an `id`, will have one generated.
         */
        idProperty: 'id',

        data: null,

        /**
         * @cfg {Object[]/String[]} fields
         * The {@link Ext.data.Model field} definitions for all instances of this Model.
         *
         * __Note:__ this does not set the *values* of each
         * field on an instance, it sets the collection of fields itself.
         *
         * Sample usage:
         *
         *     Ext.define('MyApp.model.User', {
         *         extend: 'Ext.data.Model',
         *
         *         config: {
         *             fields: [
         *                 'id',
         *                 {name: 'age', type: 'int'},
         *                 {name: 'taxRate', type: 'float'}
         *             ]
         *         }
         *     });
         * @accessor
         */
        fields: undefined,

        /**
         * @cfg {Object[]} validations
         * An array of {@link Ext.data.Validations validations} for this model.
         */
        validations: null,

        /**
         * @cfg {Object[]} associations
         * An array of {@link Ext.data.association.Association associations} for this model.
         */
        associations: null,

        /**
         * @cfg {String/Object/String[]/Object[]} hasMany
         * One or more {@link Ext.data.association.HasMany HasMany associations} for this model.
         */
        hasMany: null,

        /**
         * @cfg {String/Object/String[]/Object[]} hasOne
         * One or more {@link Ext.data.association.HasOne HasOne associations} for this model.
         */
        hasOne: null,

        /**
         * @cfg {String/Object/String[]/Object[]} belongsTo
         * One or more {@link Ext.data.association.BelongsTo BelongsTo associations} for this model.
         */
        belongsTo: null,

        /**
         * @cfg {Object/Ext.data.Proxy} proxy
         * The string type of the default Model Proxy.
         * @accessor
         */
        proxy: null,


        /**
         * @cfg {Object/String} identifier
         * The identifier strategy used when creating new instances of this Model that don't have an id defined.
         * By default this uses the simple identifier strategy that generates id's like 'ext-record-12'. If you are
         * saving these records in localstorage using a LocalStorage proxy you need to ensure that this identifier
         * strategy is set to something that always generates unique id's. We provide one strategy by default that
         * generates these unique id's which is the uuid strategy.
         */
        identifier: {
            type: 'simple'
        },

        /**
         * @cfg {String} clientIdProperty
         * The name of a property that is used for submitting this Model's unique client-side identifier
         * to the server when multiple phantom records are saved as part of the same {@link Ext.data.Operation Operation}.
         * In such a case, the server response should include the client id for each record
         * so that the server response data can be used to update the client-side records if necessary.
         * This property cannot have the same name as any of this Model's fields.
         * @accessor
         */
        clientIdProperty: 'clientId',

        /**
         * @method getIsErased Returns `true` if the record has been erased on the server.
         */
        isErased: false,

        /**
         * @cfg {Boolean} useCache
         * Change this to `false` if you want to ensure that new instances are created for each id. For example,
         * this is needed when adding the same tree nodes to multiple trees.
         */
        useCache: true
    },

    staticConfigs: [
        'idProperty',
        'fields',
        'validations',
        'associations',
        'hasMany',
        'hasOne',
        'belongsTo',
        'clientIdProperty',
        'identifier',
        'useCache',
        'proxy'
    ],

    statics: {
        EDIT   : 'edit',
        REJECT : 'reject',
        COMMIT : 'commit',

        cache: {},

        generateProxyMethod: function(name) {
            return function() {
                var prototype = this.prototype;
                return prototype[name].apply(prototype, arguments);
            };
        },

        generateCacheId: function(record, id) {
            var modelName;

            if (record && record.isModel) {
                modelName = record.modelName;
                if (id === undefined) {
                    id = record.getId();
                }
            } else {
                modelName = record;
            }

            return modelName.replace(/\./g, '-').toLowerCase() + '-' + id;
        }
    },

    inheritableStatics: {
        /**
         * Asynchronously loads a model instance by id. Sample usage:
         *
         *     MyApp.User = Ext.define('User', {
         *         extend: 'Ext.data.Model',
         *         fields: [
         *             {name: 'id', type: 'int'},
         *             {name: 'name', type: 'string'}
         *         ]
         *     });
         *
         *     MyApp.User.load(10, {
         *         scope: this,
         *         failure: function(record, operation) {
         *             //do something if the load failed
         *         },
         *         success: function(record, operation) {
         *             //do something if the load succeeded
         *         },
         *         callback: function(record, operation) {
         *             //do something whether the load succeeded or failed
         *         }
         *     });
         *
         * @param {Number} id The id of the model to load
         * @param {Object} config (optional) config object containing success, failure and callback functions, plus
         * optional scope
         * @static
         * @inheritable
         */
        load: function(id, config, scope) {
            var proxy = this.getProxy(),
                idProperty = this.getIdProperty(),
                record = null,
                params = {},
                callback, operation;

            scope = scope || (config && config.scope) || this;
            if (Ext.isFunction(config)) {
                config = {
                    callback: config,
                    scope: scope
                };
            }

            params[idProperty] = id;
            config = Ext.apply({}, config);
            config = Ext.applyIf(config, {
                action: 'read',
                params: params,
                model: this
            });

            operation  = Ext.create('Ext.data.Operation', config);

            if (!proxy) {
                Ext.Logger.error('You are trying to load a model that doesn\'t have a Proxy specified');
            }

            callback = function(operation) {
                if (operation.wasSuccessful()) {
                    record = operation.getRecords()[0] || null;
                    Ext.callback(config.success, scope, [record, operation]);
                } else {
                    Ext.callback(config.failure, scope, [record, operation]);
                }
                Ext.callback(config.callback, scope, [record, operation]);
            };

            proxy.read(operation, callback, this);
        }
    },

    /**
     * @property {Boolean} editing
     * @readonly
     * Internal flag used to track whether or not the model instance is currently being edited.
     */
    editing : false,

    /**
     * @property {Boolean} dirty
     * @readonly
     * `true` if this Record has been modified.
     */
    dirty : false,

    /**
     * @property {Boolean} phantom
     * `true` when the record does not yet exist in a server-side database (see {@link #setDirty}).
     * Any record which has a real database pk set as its id property is NOT a phantom -- it's real.
     */
    phantom : false,

    /**
     * Creates new Model instance.
     * @param {Object} data An object containing keys corresponding to this model's fields, and their associated values.
     * @param {Number} id (optional) Unique ID to assign to this model instance.
     * @param [raw]
     * @param [convertedData]
     */
    constructor: function(data, id, raw, convertedData) {
        var me = this,
            cached = null,
            useCache = me.getUseCache(),
            idProperty = me.getIdProperty();


        /**
         * @property {Object} modified key/value pairs of all fields whose values have changed.
         * The value is the original value for the field.
         */
        me.modified = {};

        /**
         * @property {Object} raw The raw data used to create this model if created via a reader.
         */
        me.raw = raw || data || {};

        /**
         * @property {Array} stores
         * An array of {@link Ext.data.Store} objects that this record is bound to.
         */
        me.stores = [];

        data = data || convertedData || {};

        // We begin by checking if an id is passed to the constructor. If this is the case we override
        // any possible id value that was passed in the data.
        if (id || id === 0) {
            // Lets skip using set here since it's so much faster
            data[idProperty] = me.internalId = id;
        }

        id = data[idProperty];
        if (useCache && (id || id === 0)) {
            cached = Ext.data.Model.cache[Ext.data.Model.generateCacheId(this, id)];
            if (cached) {
                return cached.mergeData(convertedData || data || {});
            }
        }

        if (convertedData) {
            me.setConvertedData(data);
        } else {
            me.setData(data);
        }

        // If it does not have an id at this point, we generate it using the id strategy. This means
        // that we will treat this record as a phantom record from now on
        id = me.data[idProperty];
        if (!id && id !== 0) {
            me.data[idProperty] = me.internalId = me.id = me.getIdentifier().generate(me);
            me.phantom = true;

            if (this.associations.length) {
                this.handleInlineAssociationData(data);
            }
        } else {
            me.id = me.getIdentifier().generate(me);
        }

        if (useCache) {
            Ext.data.Model.cache[Ext.data.Model.generateCacheId(me)] = me;
        }

        if (this.init && typeof this.init == 'function') {
            this.init();
        }
    },

    /**
     * Private function that is used when you create a record that already exists in the model cache.
     * In this case we loop over each field, and apply any data to the current instance that is not already
     * marked as being dirty on that instance.
     * @param data
     * @return {Ext.data.Model} This record.
     * @private
     */
    mergeData: function(rawData) {
        var me = this,
            fields = me.getFields().items,
            ln = fields.length,
            modified = me.modified,
            data = me.data,
            i, field, fieldName, value, id;

        for (i = 0; i < ln; i++) {
            field = fields[i];
            fieldName = field._name;
            value = rawData[fieldName];

            if (value !== undefined && !modified.hasOwnProperty(fieldName)) {
                if (field._convert) {
                    value = field._convert(value, me);
                }

                data[fieldName] = value;
            }
        }

        if (me.associations.length) {
            me.handleInlineAssociationData(rawData);
        }

        return this;
    },

    /**
     * This method is used to set the data for this Record instance.
     * Note that the existing data is removed. If a field is not specified
     * in the passed data it will use the field's default value. If a convert
     * method is specified for the field it will be called on the value.
     * @param rawData
     * @return {Ext.data.Model} This record.
     */
    setData: function(rawData) {
        var me = this,
            fields = me.fields.items,
            ln = fields.length,
            isArray = Ext.isArray(rawData),
            data = me._data = me.data = {},
            i, field, name, value, convert, id;

        if (!rawData) {
            return me;
        }

        for (i = 0; i < ln; i++) {
            field = fields[i];
            name = field._name;
            convert = field._convert;

            if (isArray) {
                value = rawData[i];
            }
            else {
                value = rawData[name];
                if (typeof value == 'undefined') {
                    value = field._defaultValue;
                }
            }

            if (convert) {
                value = field._convert(value, me);
            }

            data[name] = value;
        }

        id = me.getId();
        if (me.associations.length && (id || id === 0)) {
            me.handleInlineAssociationData(rawData);
        }

        return me;
    },

    handleInlineAssociationData: function(data) {
        var associations = this.associations.items,
            ln = associations.length,
            i, association, associationData, reader, proxy, associationKey;

        for (i = 0; i < ln; i++) {
            association = associations[i];
            associationKey = association.getAssociationKey();
            associationData = data[associationKey];

            if (associationData) {
                reader = association.getReader();
                if (!reader) {
                    proxy = association.getAssociatedModel().getProxy();
                    // if the associated model has a Reader already, use that, otherwise attempt to create a sensible one
                    if (proxy) {
                        reader = proxy.getReader();
                    } else {
                        reader = new Ext.data.JsonReader({
                            model: association.getAssociatedModel()
                        });
                    }
                }
                association.read(this, reader, associationData);
            }
        }
    },

    /**
     * Sets the model instance's id field to the given id.
     * @param {Number/String} id The new id
     */
    setId: function(id) {
        var currentId = this.getId();

        // Lets use the direct property instead of getter here
        this.set(this.getIdProperty(), id);

        // We don't update the this.id since we don't want to break listeners that already
        // exist on the record instance.
        this.internalId = id;

        if (this.getUseCache()) {
            delete Ext.data.Model.cache[Ext.data.Model.generateCacheId(this, currentId)];
            Ext.data.Model.cache[Ext.data.Model.generateCacheId(this)] = this;
        }
    },

    /**
     * Returns the unique ID allocated to this model instance as defined by {@link #idProperty}.
     * @return {Number/String} The `id`.
     */
    getId: function() {
        // Lets use the direct property instead of getter here
        return this.get(this.getIdProperty());
    },

    /**
     * This sets the data directly without converting and applying default values.
     * This method is used when a Record gets instantiated by a Reader. Only use
     * this when you are sure you are passing correctly converted data.
     * @param data
     * @return {Ext.data.Model} This Record.
     */
    setConvertedData: function(data) {
        this._data = this.data = data;
        return this;
    },

    /**
     * Returns the value of the given field.
     * @param {String} fieldName The field to fetch the value for.
     * @return {Object} The value.
     */
    get: function(fieldName) {
        return this.data[fieldName];
    },

    /**
     * Sets the given field to the given value, marks the instance as dirty.
     * @param {String/Object} fieldName The field to set, or an object containing key/value pairs.
     * @param {Object} value The value to set.
     */
    set: function(fieldName, value) {
        var me = this,
            // We are using the fields map since it saves lots of function calls
            fieldMap = me.fields.map,
            modified = me.modified,
            notEditing = !me.editing,
            modifiedCount = 0,
            modifiedFieldNames = [],
            field, key, i, currentValue, ln, convert;

        /*
         * If we're passed an object, iterate over that object. NOTE: we pull out fields with a convert function and
         * set those last so that all other possible data is set before the convert function is called
         */
        if (arguments.length == 1) {
            for (key in fieldName) {
                if (fieldName.hasOwnProperty(key)) {
                    //here we check for the custom convert function. Note that if a field doesn't have a convert function,
                    //we default it to its type's convert function, so we have to check that here. This feels rather dirty.
                    field = fieldMap[key];
                    if (field && field.hasCustomConvert()) {
                        modifiedFieldNames.push(key);
                        continue;
                    }

                    if (!modifiedCount && notEditing) {
                        me.beginEdit();
                    }
                    ++modifiedCount;
                    me.set(key, fieldName[key]);
                }
            }

            ln = modifiedFieldNames.length;
            if (ln) {
                if (!modifiedCount && notEditing) {
                    me.beginEdit();
                }
                modifiedCount += ln;
                for (i = 0; i < ln; i++) {
                    field = modifiedFieldNames[i];
                    me.set(field, fieldName[field]);
                }
            }

            if (notEditing && modifiedCount) {
                me.endEdit(false, modifiedFieldNames);
            }
        } else {
            field = fieldMap[fieldName];
            convert = field && field.getConvert();
            if (convert) {
                value = convert.call(field, value, me);
            }

            currentValue = me.data[fieldName];
            me.data[fieldName] = value;

            if (field && !me.isEqual(currentValue, value)) {
                if (modified.hasOwnProperty(fieldName)) {
                    if (me.isEqual(modified[fieldName], value)) {
                        // the original value in me.modified equals the new value, so the
                        // field is no longer modified
                        delete modified[fieldName];
                        // we might have removed the last modified field, so check to see if
                        // there are any modified fields remaining and correct me.dirty:
                        me.dirty = false;
                        for (key in modified) {
                            if (modified.hasOwnProperty(key)) {
                                me.dirty = true;
                                break;
                            }
                        }
                    }
                } else {
                    me.dirty = true;
                    // We only go one level back?
                    modified[fieldName] = currentValue;
                }
            }

            if (notEditing) {
                me.afterEdit([fieldName], modified);
            }
        }
    },

    /**
     * Checks if two values are equal, taking into account certain
     * special factors, for example dates.
     * @private
     * @param {Object} a The first value.
     * @param {Object} b The second value.
     * @return {Boolean} `true` if the values are equal.
     */
    isEqual: function(a, b){
        if (Ext.isDate(a) && Ext.isDate(b)) {
            return a.getTime() === b.getTime();
        }
        return a === b;
    },

    /**
     * Begins an edit. While in edit mode, no events (e.g. the `update` event) are relayed to the containing store.
     * When an edit has begun, it must be followed by either {@link #endEdit} or {@link #cancelEdit}.
     */
    beginEdit: function() {
        var me = this;
        if (!me.editing) {
            me.editing      = true;

            // We save the current states of dirty, data and modified so that when we
            // cancel the edit, we can put it back to this state
            me.dirtySave    = me.dirty;
            me.dataSave     = Ext.apply({}, me.data);
            me.modifiedSave = Ext.apply({}, me.modified);
        }
    },

    /**
     * Cancels all changes made in the current edit operation.
     */
    cancelEdit: function() {
        var me = this;
        if (me.editing) {
            me.editing = false;

            // Reset the modified state, nothing changed since the edit began
            me.modified = me.modifiedSave;
            me.data = me.dataSave;
            me.dirty = me.dirtySave;

            // Delete the saved states
            delete me.modifiedSave;
            delete me.dataSave;
            delete me.dirtySave;
        }
    },

    /**
     * Ends an edit. If any data was modified, the containing store is notified (ie, the store's `update` event will
     * fire).
     * @param {Boolean} silent `true` to not notify the store of the change.
     * @param {String[]} modifiedFieldNames Array of field names changed during edit.
     */
    endEdit: function(silent, modifiedFieldNames) {
        var me = this;

        if (me.editing) {
            me.editing = false;

            if (silent !== true && (me.changedWhileEditing())) {
                me.afterEdit(modifiedFieldNames || Ext.Object.getKeys(this.modified), this.modified);
            }

            delete me.modifiedSave;
            delete me.dataSave;
            delete me.dirtySave;
        }
    },

    /**
     * Checks if the underlying data has changed during an edit. This doesn't necessarily
     * mean the record is dirty, however we still need to notify the store since it may need
     * to update any views.
     * @private
     * @return {Boolean} `true` if the underlying data has changed during an edit.
     */
    changedWhileEditing: function() {
        var me = this,
            saved = me.dataSave,
            data = me.data,
            key;

        for (key in data) {
            if (data.hasOwnProperty(key)) {
                if (!me.isEqual(data[key], saved[key])) {
                    return true;
                }
            }
        }

        return false;
    },

    /**
     * Gets a hash of only the fields that have been modified since this Model was created or committed.
     * @return {Object}
     */
    getChanges : function() {
        var modified = this.modified,
            changes  = {},
            field;

        for (field in modified) {
            if (modified.hasOwnProperty(field)) {
                changes[field] = this.get(field);
            }
        }

        return changes;
    },

    /**
     * Returns `true` if the passed field name has been `{@link #modified}` since the load or last commit.
     * @param {String} fieldName {@link Ext.data.Field#name}
     * @return {Boolean}
     */
    isModified : function(fieldName) {
        return this.modified.hasOwnProperty(fieldName);
    },

    /**
     * Saves the model instance using the configured proxy.
     *
     * @param {Object/Function} options Options to pass to the proxy. Config object for {@link Ext.data.Operation}.
     * If you pass a function, this will automatically become the callback method. For convenience the config
     * object may also contain `success` and `failure` methods in addition to `callback` - they will all be invoked
     * with the Model and Operation as arguments.
     * @param {Object} scope The scope to run your callback method in. This is only used if you passed a function
     * as the first argument.
     * @return {Ext.data.Model} The Model instance
     */
    save: function(options, scope) {
        var me     = this,
            action = me.phantom ? 'create' : 'update',
            proxy  = me.getProxy(),
            operation,
            callback;

        if (!proxy) {
            Ext.Logger.error('You are trying to save a model instance that doesn\'t have a Proxy specified');
        }

        options = options || {};
        scope = scope || me;

        if (Ext.isFunction(options)) {
            options = {
                callback: options,
                scope: scope
            };
        }

        Ext.applyIf(options, {
            records: [me],
            action : action,
            model: me.self
        });

        operation = Ext.create('Ext.data.Operation', options);

        callback = function(operation) {
            if (operation.wasSuccessful()) {
                Ext.callback(options.success, scope, [me, operation]);
            } else {
                Ext.callback(options.failure, scope, [me, operation]);
            }

            Ext.callback(options.callback, scope, [me, operation]);
        };

        proxy[action](operation, callback, me);

        return me;
    },

    /**
     * Destroys the record using the configured proxy. This will create a 'destroy' operation.
     * Note that this doesn't destroy this instance after the server comes back with a response.
     * It will however call `afterErase` on any Stores it is joined to. Stores by default will
     * automatically remove this instance from their data collection.
     *
     * @param {Object/Function} options Options to pass to the proxy. Config object for {@link Ext.data.Operation}.
     * If you pass a function, this will automatically become the callback method. For convenience the config
     * object may also contain `success` and `failure` methods in addition to `callback` - they will all be invoked
     * with the Model and Operation as arguments.
     * @param {Object} scope The scope to run your callback method in. This is only used if you passed a function
     * as the first argument.
     * @return {Ext.data.Model} The Model instance.
     */
    erase: function(options, scope) {
        var me     = this,
            proxy  = this.getProxy(),
            operation,
            callback;

        if (!proxy) {
            Ext.Logger.error('You are trying to erase a model instance that doesn\'t have a Proxy specified');
        }

        options = options || {};
        scope = scope || me;

        if (Ext.isFunction(options)) {
            options = {
                callback: options,
                scope: scope
            };
        }

        Ext.applyIf(options, {
            records: [me],
            action : 'destroy',
            model: this.self
        });

        operation = Ext.create('Ext.data.Operation', options);

        callback = function(operation) {
            if (operation.wasSuccessful()) {
                Ext.callback(options.success, scope, [me, operation]);
            } else {
                Ext.callback(options.failure, scope, [me, operation]);
            }

            Ext.callback(options.callback, scope, [me, operation]);
        };

        proxy.destroy(operation, callback, me);

        return me;
    },

    /**
     * Usually called by the {@link Ext.data.Store} to which this model instance has been {@link #join joined}. Rejects
     * all changes made to the model instance since either creation, or the last commit operation. Modified fields are
     * reverted to their original values.
     *
     * Developers should subscribe to the {@link Ext.data.Store#update} event to have their code notified of reject
     * operations.
     *
     * @param {Boolean} [silent=false] (optional) `true` to skip notification of the owning store of the change.
     */
    reject: function(silent) {
        var me = this,
            modified = me.modified,
            field;

        for (field in modified) {
            if (modified.hasOwnProperty(field)) {
                if (typeof modified[field] != "function") {
                    me.data[field] = modified[field];
                }
            }
        }

        me.dirty = false;
        me.editing = false;
        me.modified = {};

        if (silent !== true) {
            me.afterReject();
        }
    },

    /**
     * Usually called by the {@link Ext.data.Store} which owns the model instance. Commits all changes made to the
     * instance since either creation or the last commit operation.
     *
     * Developers should subscribe to the {@link Ext.data.Store#update} event to have their code notified of commit
     * operations.
     *
     * @param {Boolean} [silent=false] (optional) `true` to skip notification of the owning store of the change.
     */
    commit: function(silent) {
        var me = this,
            modified = this.modified;

        me.phantom = me.dirty = me.editing = false;
        me.modified = {};

        if (silent !== true) {
            me.afterCommit(modified);
        }
    },

    /**
     * @private
     * If this Model instance has been {@link #join joined} to a {@link Ext.data.Store store}, the store's
     * `afterEdit` method is called.
     * @param {String[]} modifiedFieldNames Array of field names changed during edit.
     */
    afterEdit : function(modifiedFieldNames, modified) {
        this.notifyStores('afterEdit', modifiedFieldNames, modified);
    },

    /**
     * @private
     * If this Model instance has been {@link #join joined} to a {@link Ext.data.Store store}, the store's
     * `afterReject` method is called.
     */
    afterReject : function() {
        this.notifyStores("afterReject");
    },

    /**
     * @private
     * If this Model instance has been {@link #join joined} to a {@link Ext.data.Store store}, the store's
     * `afterCommit` method is called.
     */
    afterCommit: function(modified) {
        this.notifyStores('afterCommit', Ext.Object.getKeys(modified || {}), modified);
    },

    /**
     * @private
     * Helper function used by {@link #afterEdit}, {@link #afterReject}, and {@link #afterCommit}. Calls the given method on the
     * {@link Ext.data.Store store} that this instance has {@link #join join}ed, if any. The store function
     * will always be called with the model instance as its single argument.
     * @param {String} fn The function to call on the store.
     */
    notifyStores: function(fn) {
        var args = Ext.Array.clone(arguments),
            stores = this.stores,
            ln = stores.length,
            i, store;

        args[0] = this;
        for (i = 0; i < ln; ++i) {
            store = stores[i];
            if (store !== undefined && typeof store[fn] == "function") {
                store[fn].apply(store, args);
            }
        }
    },

    /**
     * Creates a copy (clone) of this Model instance.
     *
     * @param {String} id A new `id`. If you don't specify this a new `id` will be generated for you.
     * To generate a phantom instance with a new `id` use:
     *
     *     var rec = record.copy(); // clone the record with a new id
     *
     * @return {Ext.data.Model}
     */
    copy: function(newId) {
        var me = this,
            idProperty = me.getIdProperty(),
            raw = Ext.apply({}, me.raw),
            data = Ext.apply({}, me.data);

        delete raw[idProperty];
        delete data[idProperty];

        return new me.self(null, newId, raw, data);
    },

    /**
     * Returns an object containing the data set on this record. This method also allows you to
     * retrieve all the associated data. Note that if you should always use this method if you
     * need all the associated data, since the data property on the record instance is not
     * ensured to be updated at all times.
     * @param {Boolean} includeAssociated `true` to include the associated data.
     * @return {Object} The data.
     */
    getData: function(includeAssociated) {
        var data = this.data;

        if (includeAssociated === true) {
            Ext.apply(data, this.getAssociatedData());
        }

        return data;
    },

    /**
     * Gets all of the data from this Models *loaded* associations. It does this recursively - for example if we have a
     * User which `hasMany` Orders, and each Order `hasMany` OrderItems, it will return an object like this:
     *
     *     {
     *         orders: [
     *             {
     *                 id: 123,
     *                 status: 'shipped',
     *                 orderItems: [
     *                     // ...
     *                 ]
     *             }
     *         ]
     *     }
     *
     * @return {Object} The nested data set for the Model's loaded associations.
     */
    getAssociatedData: function() {
        return this.prepareAssociatedData(this, [], null);
    },

    /**
     * @private
     * This complex-looking method takes a given Model instance and returns an object containing all data from
     * all of that Model's *loaded* associations. See {@link #getAssociatedData}
     * @param {Ext.data.Model} record The Model instance
     * @param {String[]} ids PRIVATE. The set of Model instance `internalIds` that have already been loaded
     * @param {String} associationType (optional) The name of the type of association to limit to.
     * @return {Object} The nested data set for the Model's loaded associations.
     */
    prepareAssociatedData: function(record, ids, associationType) {
        //we keep track of all of the internalIds of the models that we have loaded so far in here
        var associations     = record.associations.items,
            associationCount = associations.length,
            associationData  = {},
            associatedStore, associationName, associatedRecords, associatedRecord,
            associatedRecordCount, association, id, i, j, type, allow;

        for (i = 0; i < associationCount; i++) {
            association = associations[i];
            associationName = association.getName();
            type = association.getType();
            allow = true;

            if (associationType) {
                allow = type == associationType;
            }

            if (allow && type.toLowerCase() == 'hasmany') {
                //this is the hasMany store filled with the associated data
                associatedStore = record[association.getStoreName()];

                //we will use this to contain each associated record's data
                associationData[associationName] = [];

                //if it's loaded, put it into the association data
                if (associatedStore && associatedStore.getCount() > 0) {
                    associatedRecords = associatedStore.data.items;
                    associatedRecordCount = associatedRecords.length;

                    //now we're finally iterating over the records in the association. We do this recursively
                    for (j = 0; j < associatedRecordCount; j++) {
                        associatedRecord = associatedRecords[j];
                        // Use the id, since it is prefixed with the model name, guaranteed to be unique
                        id = associatedRecord.id;

                        //when we load the associations for a specific model instance we add it to the set of loaded ids so that
                        //we don't load it twice. If we don't do this, we can fall into endless recursive loading failures.
                        if (Ext.Array.indexOf(ids, id) == -1) {
                            ids.push(id);

                            associationData[associationName][j] = associatedRecord.getData();
                            Ext.apply(associationData[associationName][j], this.prepareAssociatedData(associatedRecord, ids, associationType));
                        }
                    }
                }
            } else if (allow && (type.toLowerCase() == 'belongsto' || type.toLowerCase() == 'hasone')) {
                associatedRecord = record[association.getInstanceName()];
                if (associatedRecord !== undefined) {
                    id = associatedRecord.id;
                    if (Ext.Array.indexOf(ids, id) === -1) {
                        ids.push(id);
                        associationData[associationName] = associatedRecord.getData();
                        Ext.apply(associationData[associationName], this.prepareAssociatedData(associatedRecord, ids, associationType));
                    }
                }
            }
        }

        return associationData;
    },

    /**
     * By joining this model to an instance of a class, this model will automatically try to
     * call certain template methods on that instance ({@link #afterEdit}, {@link #afterCommit}, {@link Ext.data.Store#afterErase}).
     * For example, a Store calls join and unjoin whenever you add or remove a record to it's data collection.
     * This way a Store can get notified of any changes made to this record.
     * This functionality is usually only required when creating custom components.
     * @param {Ext.data.Store} store The store to which this model has been added.
     */
    join: function(store) {
        Ext.Array.include(this.stores, store);
    },

    /**
     * This un-joins this record from an instance of a class. Look at the documentation for {@link #join}
     * for more information about joining records to class instances.
     * @param {Ext.data.Store} store The store from which this model has been removed.
     */
    unjoin: function(store) {
        Ext.Array.remove(this.stores, store);
    },

    /**
     * Marks this **Record** as `{@link #dirty}`. This method is used internally when adding `{@link #phantom}` records
     * to a {@link Ext.data.proxy.Server#writer writer enabled store}.
     *
     * Marking a record `{@link #dirty}` causes the phantom to be returned by {@link Ext.data.Store#getUpdatedRecords}
     * where it will have a create action composed for it during {@link Ext.data.Model#save model save} operations.
     */
    setDirty : function() {
        var me = this,
            name;

        me.dirty = true;

        me.fields.each(function(field) {
            if (field.getPersist()) {
                name = field.getName();
                me.modified[name] = me.get(name);
            }
        });
    },

    /**
     * Validates the current data against all of its configured {@link #cfg-validations}.
     * @return {Ext.data.Errors} The errors object.
     */
    validate: function() {
        var errors      = Ext.create('Ext.data.Errors'),
            validations = this.getValidations().items,
            validators  = Ext.data.Validations,
            length, validation, field, valid, type, i;

        if (validations) {
            length = validations.length;

            for (i = 0; i < length; i++) {
                validation = validations[i];
                field = validation.field || validation.name;
                type  = validation.type;
                valid = validators[type](validation, this.get(field));

                if (!valid) {
                    errors.add(Ext.create('Ext.data.Error', {
                        field  : field,
                        message: validation.message || validators.getMessage(type)
                    }));
                }
            }
        }

        return errors;
    },

    /**
     * Checks if the model is valid. See {@link #validate}.
     * @return {Boolean} `true` if the model is valid.
     */
    isValid: function(){
        return this.validate().isValid();
    },

    /**
     * Returns a url-suitable string for this model instance. By default this just returns the name of the Model class
     * followed by the instance ID - for example an instance of MyApp.model.User with ID 123 will return 'user/123'.
     * @return {String} The url string for this model instance.
     */
    toUrl: function() {
        var pieces = this.$className.split('.'),
            name   = pieces[pieces.length - 1].toLowerCase();

        return name + '/' + this.getId();
    },

    /**
     * Destroys this model instance. Note that this doesn't do a 'destroy' operation. If you want to destroy
     * the record in your localStorage or on the server you should use the {@link #erase} method.
     */
    destroy: function() {
        var me = this;
        me.notifyStores('afterErase', me);
        if (me.getUseCache()) {
            delete Ext.data.Model.cache[Ext.data.Model.generateCacheId(me)];
        }
        me.raw = me.stores = me.modified = null;
        me.callParent(arguments);
    },

    //<debug>
    markDirty : function() {
        if (Ext.isDefined(Ext.Logger)) {
            Ext.Logger.deprecate('Ext.data.Model: markDirty has been deprecated. Use setDirty instead.');
        }
        return this.setDirty.apply(this, arguments);
    },
    //</debug>

    applyProxy: function(proxy, currentProxy) {
        return Ext.factory(proxy, Ext.data.Proxy, currentProxy, 'proxy');
    },

    updateProxy: function(proxy) {
        if (proxy) {
            proxy.setModel(this.self);
        }
    },

    applyAssociations: function(associations) {
        if (associations) {
            this.addAssociations(associations, 'hasMany');
        }
    },

    applyBelongsTo: function(belongsTo) {
        if (belongsTo) {
            this.addAssociations(belongsTo, 'belongsTo');
        }
    },

    applyHasMany: function(hasMany) {
        if (hasMany) {
            this.addAssociations(hasMany, 'hasMany');
        }
    },

    applyHasOne: function(hasOne) {
        if (hasOne) {
            this.addAssociations(hasOne, 'hasOne');
        }
    },

    addAssociations: function(associations, defaultType) {
        var ln, i, association,
            name = this.self.modelName,
            associationsCollection = this.self.associations,
            onCreatedFn;

        associations = Ext.Array.from(associations);

        for (i = 0, ln = associations.length; i < ln; i++) {
            association = associations[i];
            if (!Ext.isObject(association)) {
                association = {model: association};
            }

            Ext.applyIf(association, {
                type: defaultType,
                ownerModel: name,
                associatedModel: association.model
            });

            delete association.model;

            onCreatedFn = Ext.Function.bind(function(associationName) {
                associationsCollection.add(Ext.data.association.Association.create(this));
            }, association);

            Ext.ClassManager.onCreated(onCreatedFn, this, (typeof association.associatedModel === 'string') ? association.associatedModel : Ext.getClassName(association.associatedModel));
        }
    },

    applyValidations: function(validations) {
        if (validations) {
            if (!Ext.isArray(validations)) {
                validations = [validations];
            }
            this.addValidations(validations);
        }
    },

    addValidations: function(validations) {
        this.self.validations.addAll(validations);
    },

    /**
     * @method setFields
     * Updates the collection of Fields that all instances of this Model use. **Does not** update field values in a Model
     * instance (use {@link #set} for that), instead this updates which fields are available on the Model class. This
     * is normally used when creating or updating Model definitions dynamically, for example if you allow your users to
     * define their own Models and save the fields configuration to a database, this method allows you to change those
     * fields later.
     * @return {Array}
     */

    applyFields: function(fields) {
        var superFields = this.superclass.fields;
        if (superFields) {
            fields = superFields.items.concat(fields || []);
        }
        return fields || [];
    },

    updateFields: function(fields) {
        var ln = fields.length,
            me = this,
            prototype = me.self.prototype,
            idProperty = this.getIdProperty(),
            idField, fieldsCollection, field, i;

        /**
         * @property {Ext.util.MixedCollection} fields
         * The fields defined on this model.
         */
        fieldsCollection = me._fields = me.fields = new Ext.util.Collection(prototype.getFieldName);

        for (i = 0; i < ln; i++) {
            field = fields[i];
            if (!field.isField) {
                field = new Ext.data.Field(fields[i]);
            }
            fieldsCollection.add(field);
        }

        // We want every Model to have an id property field
        idField = fieldsCollection.get(idProperty);
        if (!idField) {
            fieldsCollection.add(new Ext.data.Field(idProperty));
        } else {
            idField.setType('auto');
        }

        fieldsCollection.addSorter(prototype.sortConvertFields);
    },

    applyIdentifier: function(identifier) {
        if (typeof identifier === 'string') {
            identifier = {
                type: identifier
            };
        }
        return Ext.factory(identifier, Ext.data.identifier.Simple, this.getIdentifier(), 'data.identifier');
    },

    /**
     * This method is used by the fields collection to retrieve the key for a field
     * based on it's name.
     * @param field
     * @return {String}
     * @private
     */
    getFieldName: function(field) {
        return field.getName();
    },

    /**
     * This method is being used to sort the fields based on their convert method. If
     * a field has a custom convert method, we ensure its more to the bottom of the collection.
     * @param field1
     * @param field2
     * @return {Number}
     * @private
     */
    sortConvertFields: function(field1, field2) {
        var f1SpecialConvert = field1.hasCustomConvert(),
            f2SpecialConvert = field2.hasCustomConvert();

        if (f1SpecialConvert && !f2SpecialConvert) {
            return 1;
        }
        if (!f1SpecialConvert && f2SpecialConvert) {
            return -1;
        }
        return 0;
    },

    /**
     * @private
     */
    onClassExtended: function(cls, data, hooks) {
        var onBeforeClassCreated = hooks.onBeforeCreated,
            Model = this,
            prototype = Model.prototype,
            configNameCache = Ext.Class.configNameCache,
            staticConfigs = prototype.staticConfigs.concat(data.staticConfigs || []),
            defaultConfig = prototype.config,
            config = data.config || {},
            key;

        // Convert old properties in data into a config object
        // <deprecated product=touch since=2.0>
        if (data.idgen || config.idgen) {
            config.identifier = data.idgen || config.idgen;
            // <debug warn>
            Ext.Logger.deprecate('idgen is deprecated as a property. Please put it inside the config object' +
                ' under the new "identifier" configuration');
            // </debug>
        }

        for (key in defaultConfig) {
            if (key in data) {
                config[key] = data[key];
                delete data[key];
                // <debug warn>
                Ext.Logger.deprecate(key + ' is deprecated as a property directly on the Model prototype. ' +
                    'Please put it inside the config object.');
                // </debug>
            }
        }
        // </deprecated>
        data.config = config;

        hooks.onBeforeCreated = function(cls, data) {
            var dependencies = [],
                prototype = cls.prototype,
                statics = {},
                config = prototype.config,
                staticConfigsLn = staticConfigs.length,
                copyMethods = ['set', 'get'],
                copyMethodsLn = copyMethods.length,
                associations = config.associations || [],
                name = Ext.getClassName(cls),
                key, methodName, i, j, ln;

            // Create static setters and getters for each config option
            for (i = 0; i < staticConfigsLn; i++) {
                key = staticConfigs[i];

                for (j = 0; j < copyMethodsLn; j++) {
                    methodName = configNameCache[key][copyMethods[j]];
                    if (methodName in prototype) {
                        statics[methodName] = Model.generateProxyMethod(methodName);
                    }
                }
            }

            cls.addStatics(statics);

            // Save modelName on class and its prototype
            cls.modelName = name;
            prototype.modelName = name;

            // Take out dependencies on other associations and the proxy type
            if (config.belongsTo) {
                dependencies.push('association.belongsto');
            }
            if (config.hasMany) {
                dependencies.push('association.hasmany');
            }
            if (config.hasOne) {
                dependencies.push('association.hasone');
            }

            for (i = 0,ln = associations.length; i < ln; ++i) {
                dependencies.push('association.' + associations[i].type.toLowerCase());
            }

            if (config.identifier) {
                if (typeof config.identifier === 'string') {
                    dependencies.push('data.identifier.' + config.identifier);
                }
                else if (typeof config.identifier.type === 'string') {
                    dependencies.push('data.identifier.' + config.identifier.type);
                }
            }

            if (config.proxy) {
                if (typeof config.proxy === 'string') {
                    dependencies.push('proxy.' + config.proxy);
                }
                else if (typeof config.proxy.type === 'string') {
                    dependencies.push('proxy.' + config.proxy.type);
                }
            }

            if (config.validations) {
                dependencies.push('Ext.data.Validations');
            }

            Ext.require(dependencies, function() {
                Ext.Function.interceptBefore(hooks, 'onCreated', function() {
                    Ext.data.ModelManager.registerType(name, cls);

                    var superCls = cls.prototype.superclass;

                    /**
                     * @property {Ext.util.Collection} associations
                     * The associations defined on this model.
                     */
                    cls.prototype.associations = cls.associations = cls.prototype._associations = (superCls && superCls.associations)
                        ? superCls.associations.clone()
                        : new Ext.util.Collection(function(association) {
                            return association.getName();
                        });

                    /**
                     * @property {Ext.util.Collection} validations
                     * The validations defined on this model.
                     */
                    cls.prototype.validations = cls.validations = cls.prototype._validations = (superCls && superCls.validations)
                        ? superCls.validations.clone()
                        : new Ext.util.Collection(function(validation) {
                            return validation.field ? (validation.field + '-' + validation.type) : (validation.name + '-' + validation.type);
                        });

                    cls.prototype = Ext.Object.chain(cls.prototype);
                    cls.prototype.initConfig.call(cls.prototype, config);

                    delete cls.prototype.initConfig;
                });

                onBeforeClassCreated.call(Model, cls, data, hooks);
            });
        };
    }
});
