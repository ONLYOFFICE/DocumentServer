/**
 * @author Ed Spencer
 *
 * Readers are used to interpret data to be loaded into a {@link Ext.data.Model Model} instance or a {@link
 * Ext.data.Store Store} - often in response to an AJAX request. In general there is usually no need to create
 * a Reader instance directly, since a Reader is almost always used together with a {@link Ext.data.proxy.Proxy Proxy},
 * and is configured using the Proxy's {@link Ext.data.proxy.Proxy#cfg-reader reader} configuration property:
 *
 *     Ext.define("User", {
 *         extend: "Ext.data.Model",
 *         config: {
 *             fields: [
 *                 "id",
 *                 "name"
 *             ]
 *         }
 *     });
 *
 *     Ext.create("Ext.data.Store", {
 *         model: "User",
 *         autoLoad: true,
 *         storeId: "usersStore",
 *         proxy: {
 *             type: "ajax",
 *             url : "users.json",
 *             reader: {
 *                 type: "json",
 *                 rootProperty: "users"
 *             }
 *         }
 *     });
 *
 *     Ext.create("Ext.List", {
 *         fullscreen: true,
 *         itemTpl: "{name} (id: '{id}')",
 *         store: "usersStore"
 *     });
 *
 * The above reader is configured to consume a JSON string that looks something like this:
 *
 *     {
 *         "success": true,
 *         "users": [
 *             { "name": "User 1" },
 *             { "name": "User 2" }
 *         ]
 *     }
 *
 *
 * # Loading Nested Data
 *
 * Readers have the ability to automatically load deeply-nested data objects based on the {@link Ext.data.association.Association
 * associations} configured on each Model. Below is an example demonstrating the flexibility of these associations in a
 * fictional CRM system which manages a User, their Orders, OrderItems and Products. First we'll define the models:
 *
 *     Ext.define("User", {
 *         extend: "Ext.data.Model",
 *         config: {
 *             fields: [
 *                 "id",
 *                 "name"
 *             ],
 *             hasMany: {
 *                 model: "Order",
 *                 name: "orders"
 *             },
 *             proxy: {
 *                 type: "rest",
 *                 url : "users.json",
 *                 reader: {
 *                     type: "json",
 *                     rootProperty: "users"
 *                 }
 *             }
 *         }
 *     });
 *
 *     Ext.define("Order", {
 *         extend: "Ext.data.Model",
 *         config: {
 *             fields: [
 *                 "id", "total"
 *             ],
 *             hasMany: {
 *                 model: "OrderItem",
 *                 name: "orderItems",
 *                 associationKey: "order_items"
 *             },
 *             belongsTo: "User"
 *         }
 *     });
 *
 *     Ext.define("OrderItem", {
 *         extend: "Ext.data.Model",
 *         config: {
 *             fields: [
 *                 "id",
 *                 "price",
 *                 "quantity",
 *                 "order_id",
 *                 "product_id"
 *             ],
 *             belongsTo: [
 *                 "Order", {
 *                     model: "Product",
 *                     associationKey: "product"
 *                 }
 *             ]
 *         }
 *     });
 *
 *     Ext.define("Product", {
 *         extend: "Ext.data.Model",
 *         config: {
 *             fields: [
 *                 "id",
 *                 "name"
 *             ]
 *         },
 *         hasMany: "OrderItem"
 *     });
 *
 *     var store = Ext.create('Ext.data.Store', {
 *         model: "User"
 *     });
 *
 *     store.load({
 *         callback: function() {
 *             var output = [];
 *
 *             // the user that was loaded
 *             var user = store.first();
 *
 *             output.push("Orders for " + user.get('name') + ":");
 *
 *             // iterate over the Orders for each User
 *             user.orders().each(function(order) {
 *                 output.push("Order ID: " + order.get('id') + ", which contains items:");
 *
 *                 // iterate over the OrderItems for each Order
 *                 order.orderItems().each(function(orderItem) {
 *                     // We know that the Product data is already loaded, so we can use the
 *                     // synchronous getProduct() method. Usually, we would use the 
 *                     // asynchronous version (see Ext.data.association.BelongsTo).
 *                     var product = orderItem.getProduct();
 *                     output.push(orderItem.get("quantity") + " orders of " + product.get("name"));
 *                 });
 *             });
 *             Ext.Msg.alert('Output:', output.join("<br/>"));
 *         }
 *     });
 *
 * This may be a lot to take in - basically a User has many Orders, each of which is composed of several OrderItems.
 * Finally, each OrderItem has a single Product. This allows us to consume data like this (_users.json_):
 *
 *     {
 *         "users": [
 *             {
 *                 "id": 123,
 *                 "name": "Ed",
 *                 "orders": [
 *                     {
 *                         "id": 50,
 *                         "total": 100,
 *                         "order_items": [
 *                             {
 *                                 "id"      : 20,
 *                                 "price"   : 40,
 *                                 "quantity": 2,
 *                                 "product" : {
 *                                     "id": 1000,
 *                                     "name": "MacBook Pro"
 *                                 }
 *                             },
 *                             {
 *                                 "id"      : 21,
 *                                 "price"   : 20,
 *                                 "quantity": 3,
 *                                 "product" : {
 *                                     "id": 1001,
 *                                     "name": "iPhone"
 *                                 }
 *                             }
 *                         ]
 *                     }
 *                 ]
 *             }
 *         ]
 *     }
 *
 * The JSON response is deeply nested - it returns all Users (in this case just 1 for simplicity's sake), all of the
 * Orders for each User (again just 1 in this case), all of the OrderItems for each Order (2 order items in this case),
 * and finally the Product associated with each OrderItem.
 *
 * Running the code above results in the following:
 *
 *     Orders for Ed:
 *     Order ID: 50, which contains items:
 *     2 orders of MacBook Pro
 *     3 orders of iPhone
 */
Ext.define('Ext.data.reader.Reader', {
    requires: [
        'Ext.data.ResultSet'
    ],
    alternateClassName: ['Ext.data.Reader', 'Ext.data.DataReader'],

    mixins: ['Ext.mixin.Observable'],

    // @private
    isReader: true,

    config: {
        /**
         * @cfg {String} idProperty
         * Name of the property within a raw object that contains a record identifier value. Defaults to The id of the
         * model. If an `idProperty` is explicitly specified it will override that of the one specified on the model
         */
        idProperty: undefined,

        /**
         * @cfg {String} clientIdProperty
         * The name of the property with a response that contains the existing client side id for a record that we are reading.
         */
        clientIdProperty: 'clientId',

        /**
         * @cfg {String} totalProperty
         * Name of the property from which to retrieve the total number of records in the dataset. This is only needed if
         * the whole dataset is not passed in one go, but is being paged from the remote server.
         */
        totalProperty: 'total',

        /**
         * @cfg {String} successProperty
         * Name of the property from which to retrieve the success attribute. See
         * {@link Ext.data.proxy.Server}.{@link Ext.data.proxy.Server#exception exception} for additional information.
         */
        successProperty: 'success',

        /**
         * @cfg {String} messageProperty (optional)
         * The name of the property which contains a response message. This property is optional.
         */
        messageProperty: null,

        /**
         * @cfg {String} rootProperty
         * The name of the property which contains the Array of row objects.  For JSON reader it's dot-separated list
         * of property names.  For XML reader it's a CSS selector.  For array reader it's not applicable.
         *
         * By default the natural root of the data will be used.  The root JSON array, the root XML element, or the array.
         *
         * The data packet value for this property should be an empty array to clear the data or show no data.
         */
        rootProperty: '',

        /**
         * @cfg {Boolean} implicitIncludes
         * `true` to automatically parse models nested within other models in a response object. See the
         * {@link Ext.data.reader.Reader} intro docs for full explanation.
         */
        implicitIncludes: true,

        model: undefined
    },

    constructor: function(config) {
        this.initConfig(config);
    },

    /**
     * @property {Object} metaData
     * The raw meta data that was most recently read, if any. Meta data can include existing
     * Reader config options like {@link #idProperty}, {@link #totalProperty}, etc. that get
     * automatically applied to the Reader, and those can still be accessed directly from the Reader
     * if needed. However, meta data is also often used to pass other custom data to be processed
     * by application code. For example, it is common when reconfiguring the data model of a grid to
     * also pass a corresponding column model config to be applied to the grid. Any such data will
     * not get applied to the Reader directly (it just gets passed through and is ignored by Ext).
     * This `metaData` property gives you access to all meta data that was passed, including any such
     * custom data ignored by the reader.
     *
     * This is a read-only property, and it will get replaced each time a new meta data object is
     * passed to the reader.
     * @readonly
     */

    fieldCount: 0,

    applyModel: function(model) {
        if (typeof model == 'string') {
            model = Ext.data.ModelManager.getModel(model);

            if (!model) {
                Ext.Logger.error('Model with name ' + arguments[0] + ' doesnt exist.');
            }
        }

        if (model && !model.prototype.isModel && Ext.isObject(model)) {
            model = Ext.data.ModelManager.registerType(model.storeId || model.id || Ext.id(), model);
        }

        return model;
    },

    applyIdProperty: function(idProperty) {
        if (!idProperty && this.getModel()) {
            idProperty = this.getModel().getIdProperty();
        }
        return idProperty;
    },

    updateModel: function(model) {
        if (model) {
            if (!this.getIdProperty()) {
                this.setIdProperty(model.getIdProperty());
            }
            this.buildExtractors();
        }
    },

    createAccessor: Ext.emptyFn,

    createFieldAccessExpression: function() {
        return 'undefined';
    },

    /**
     * @private
     * This builds optimized functions for retrieving record data and meta data from an object.
     * Subclasses may need to implement their own getRoot function.
     */
    buildExtractors: function() {
        if (!this.getModel()) {
            return;
        }

        var me = this,
            totalProp = me.getTotalProperty(),
            successProp = me.getSuccessProperty(),
            messageProp = me.getMessageProperty();

        //build the extractors for all the meta data
        if (totalProp) {
            me.getTotal = me.createAccessor(totalProp);
        }

        if (successProp) {
            me.getSuccess = me.createAccessor(successProp);
        }

        if (messageProp) {
            me.getMessage = me.createAccessor(messageProp);
        }

        me.extractRecordData = me.buildRecordDataExtractor();
    },

    /**
     * @private
     * Return a function which will read a raw row object in the format this Reader accepts, and populates
     * a record's data object with converted data values.
     *
     * The returned function must be passed the following parameters:
     *
     * - `dest` - A record's empty data object into which the new field value properties are injected.
     * - `source` - A raw row data object of whatever type this Reader consumes
     * - `record - The record which is being populated.
     */
    buildRecordDataExtractor: function() {
        var me = this,
            model = me.getModel(),
            fields = model.getFields(),
            ln = fields.length,
            fieldVarName = [],
            clientIdProp = me.getModel().getClientIdProperty(),
            prefix = '__field',
            code = [
                'var me = this,\n',
                '    fields = me.getModel().getFields(),\n',
                '    idProperty = me.getIdProperty(),\n',
                '    idPropertyIsFn = (typeof idProperty == "function"),',
                '    value,\n',
                '    internalId'
            ], i, field, varName, fieldName;

        fields = fields.items;

        for (i = 0; i < ln; i++) {
            field = fields[i];
            fieldName = field.getName();
            if (fieldName === model.getIdProperty()) {
                fieldVarName[i] = 'idField';
            } else {
                fieldVarName[i] = prefix + i;
            }
            code.push(',\n    ', fieldVarName[i], ' = fields.get("', field.getName(), '")');
        }

        code.push(';\n\n    return function(source) {\n        var dest = {};\n');

        code.push('        if (idPropertyIsFn) {\n');
        code.push('            idField.setMapping(idProperty);\n');
        code.push('        }\n');

        for (i = 0; i < ln; i++) {
            field = fields[i];
            varName = fieldVarName[i];
            fieldName = field.getName();
            if (fieldName === model.getIdProperty() && field.getMapping() === null && model.getIdProperty() !== this.getIdProperty()) {
                field.setMapping(this.getIdProperty());
            }
            // createFieldAccessExpression must be implemented in subclasses to extract data from the source object in the correct way.
            code.push('        try {\n');
            code.push('            value = ', me.createFieldAccessExpression(field, varName, 'source'), ';\n');
            code.push('            if (value !== undefined) {\n');
            code.push('                dest["' + field.getName() + '"] = value;\n');
            code.push('            }\n');
            code.push('        } catch(e){}\n');
        }

        // set the client id as the internalId of the record.
        // clientId handles the case where a client side record did not previously exist on the server,
        // so the server is passing back a client id that can be used to pair the server side record up with the client record
        if (clientIdProp) {
            code.push('        internalId = ' + me.createFieldAccessExpression(Ext.create('Ext.data.Field', {name: clientIdProp}), null, 'source') + ';\n');
            code.push('        if (internalId !== undefined) {\n');
            code.push('            dest["_clientId"] = internalId;\n        }\n');
        }

        code.push('        return dest;\n');
        code.push('    };');

        // Here we are creating a new Function and invoking it immediately in the scope of this Reader
        // It declares several vars capturing the configured context of this Reader, and returns a function
        // which, when passed a record data object, a raw data row in the format this Reader is configured to read,
        // and the record which is being created, will populate the record's data object from the raw row data.
        return Ext.functionFactory(code.join('')).call(me);
    },

    getFields: function() {
        return this.getModel().getFields().items;
    },

    /**
     * @private
     * By default this function just returns what is passed to it. It can be overridden in a subclass
     * to return something else. See XmlReader for an example.
     * @param {Object} data The data object
     * @return {Object} The normalized data object
     */
    getData: function(data) {
        return data;
    },

    /**
     * Takes a raw response object (as passed to this.read) and returns the useful data segment of it.
     * This must be implemented by each subclass
     * @param {Object} response The response object
     * @return {Object} The useful data from the response
     */
    getResponseData: function(response) {
        return response;
    },

    /**
     * @private
     * This will usually need to be implemented in a subclass. Given a generic data object (the type depends on the type
     * of data we are reading), this function should return the object as configured by the Reader's 'rootProperty' meta data config.
     * See XmlReader's getRoot implementation for an example. By default the same data object will simply be returned.
     * @param {Object} data The data object
     * @return {Object} The same data object
     */
    getRoot: function(data) {
        return data;
    },

    /**
     * Reads the given response object. This method normalizes the different types of response object that may be passed
     * to it, before handing off the reading of records to the {@link #readRecords} function.
     * @param {Object} response The response object. This may be either an XMLHttpRequest object or a plain JS object
     * @return {Ext.data.ResultSet} The parsed ResultSet object
     */
    read: function(response) {
        var data = response,
            Model = this.getModel(),
            resultSet, records, i, ln, record;

        if (response) {
            data = this.getResponseData(response);
        }

        if (data) {
            resultSet = this.readRecords(data);
            records = resultSet.getRecords();
            for (i = 0, ln = records.length; i < ln; i++) {
                record = records[i];
                records[i] = new Model(record.data, record.id, record.node);
            }
            return resultSet;
        } else {
            return this.nullResultSet;
        }
    },

    process: function(response) {
        var data = response;

        if (response) {
            data = this.getResponseData(response);
        }

        if (data) {
            return this.readRecords(data);
        } else {
            return this.nullResultSet;
        }
    },

    /**
     * Abstracts common functionality used by all Reader subclasses. Each subclass is expected to call this function
     * before running its own logic and returning the Ext.data.ResultSet instance. For most Readers additional
     * processing should not be needed.
     * @param {Object} data The raw data object
     * @return {Ext.data.ResultSet} A ResultSet object
     */
    readRecords: function(data) {
        var me  = this;

        /**
         * @property {Object} rawData
         * The raw data object that was last passed to readRecords. Stored for further processing if needed
         */
        me.rawData = data;

        data = me.getData(data);

        if (data.metaData) {
            me.onMetaChange(data.metaData);
        }

        // <debug>
        if (!me.getModel()) {
            Ext.Logger.warn('In order to read record data, a Reader needs to have a Model defined on it.');
        }
        // </debug>

        // If we pass an array as the data, we don't use getRoot on the data.
        // Instead the root equals to the data.
        var isArray = Ext.isArray(data),
            root = isArray ? data : me.getRoot(data),
            success = true,
            recordCount = 0,
            total, value, records, message;

        if (isArray && !data.length) {
            return me.nullResultSet;
        }

        // buildExtractors should have put getTotal, getSuccess, or getMessage methods on the instance.
        // So we can check them directly
        if (me.getTotal) {
            value = parseInt(me.getTotal(data), 10);
            if (!isNaN(value)) {
                total = value;
            }
        }

        if (me.getSuccess) {
            value = me.getSuccess(data);
            if (value === false || value === 'false') {
                success = false;
            }
        }

        if (me.getMessage) {
            message = me.getMessage(data);
        }

        if (root) {
            records = me.extractData(root);
            recordCount = records.length;
        } else {
            recordCount = 0;
            records = [];
        }

        return new Ext.data.ResultSet({
            total  : total,
            count  : recordCount,
            records: records,
            success: success,
            message: message
        });
    },

    /**
     * Returns extracted, type-cast rows of data.
     * @param {Object[]/Object} root from server response
     * @private
     */
    extractData : function(root) {
        var me = this,
            records = [],
            length  = root.length,
            model = me.getModel(),
            idProperty = model.getIdProperty(),
            fieldsCollection = model.getFields(),
            node, i, data, id, clientId;

        /*
         * We check here whether the fields are dirty since the last read.
         * This works around an issue when a Model is used for both a Tree and another
         * source, because the tree decorates the model with extra fields and it causes
         * issues because the readers aren't notified.
         */
        if (fieldsCollection.isDirty) {
            me.buildExtractors(true);
            delete fieldsCollection.isDirty;
        }

        if (!root.length && Ext.isObject(root)) {
            root = [root];
            length = 1;
        }

        for (i = 0; i < length; i++) {
            clientId = null;
            id = null;

            node = root[i];

            // When you use a Memory proxy, and you set data: [] to contain record instances
            // this node will already be a record. In this case we should not try to extract
            // the record data from the object, but just use the record data attribute.
            if (node.isModel) {
                data = node.data;
            } else {
                data = me.extractRecordData(node);
            }

            if (data._clientId !== undefined) {
                clientId = data._clientId;
                delete data._clientId;
            }

            if (data[idProperty] !== undefined) {
                id = data[idProperty];
            }

            if (me.getImplicitIncludes()) {
                 me.readAssociated(data, node);
            }

            records.push({
                clientId: clientId,
                id: id,
                data: data,
                node: node
            });
        }

        return records;
    },

    /**
     * @private
     * Loads a record's associations from the data object. This pre-populates `hasMany` and `belongsTo` associations
     * on the record provided.
     * @param {Ext.data.Model} record The record to load associations for
     * @param {Object} data The data object
     */
    readAssociated: function(record, data) {
        var associations = this.getModel().associations.items,
            length = associations.length,
            i = 0,
            association, associationData, associationKey;

        for (; i < length; i++) {
            association = associations[i];
            associationKey = association.getAssociationKey();
            associationData = this.getAssociatedDataRoot(data, associationKey);

            if (associationData) {
                record[associationKey] = associationData;
            }
        }
    },

    /**
     * @private
     * Used internally by `readAssociated`. Given a data object (which could be json, xml etc) for a specific
     * record, this should return the relevant part of that data for the given association name. If a complex
     * mapping, this will traverse arrays and objects to resolve the data.
     * @param {Object} data The raw data object
     * @param {String} associationName The name of the association to get data for (uses associationKey if present)
     * @return {Object} The root
     */
    getAssociatedDataRoot: function(data, associationName) {
        var re = /[\[\.]/,
            i  = String(associationName).search(re);

        if (i >= 0) {
            return Ext.functionFactory('obj', 'return obj' + (i > 0 ? '.' : '') + associationName)(data);
        }

        return data[associationName];
    },

    /**
     * @private
     * Reconfigures the meta data tied to this Reader
     */
    onMetaChange : function(meta) {
        var fields = meta.fields,
            me = this,
            newModel, config, idProperty;

        // save off the raw meta data
        me.metaData = meta;

        // set any reader-specific configs from meta if available
        if (meta.rootProperty !== undefined) {
            me.setRootProperty(meta.rootProperty);
        }
        else if (meta.root !== undefined) {
            me.setRootProperty(meta.root);
        }

        if (meta.idProperty !== undefined) {
            me.setIdProperty(meta.idProperty);
        }
        if (meta.totalProperty !== undefined) {
            me.setTotalProperty(meta.totalProperty);
        }
        if (meta.successProperty !== undefined) {
            me.setSuccessProperty(meta.successProperty);
        }
        if (meta.messageProperty !== undefined) {
            me.setMessageProperty(meta.messageProperty);
        }

        if (fields) {
            if (me.getModel()) {
                me.getModel().setFields(fields);
                me.buildExtractors();
            }
            else {
                idProperty = me.getIdProperty();
                config = {fields: fields};

                if (idProperty) {
                    config.idProperty = idProperty;
                }

                newModel = Ext.define("Ext.data.reader.MetaModel" + Ext.id(), {
                    extend: 'Ext.data.Model',
                    config: config
                });

                me.setModel(newModel);
            }
        }
        else {
            me.buildExtractors();
        }
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
                Ext.Logger.deprecate(key + ' is deprecated as a property directly on the Reader prototype. ' +
                    'Please put it inside the config object.');
                // </debug>
            }
        }

        data.config = config;
    }
    // </deprecated>
}, function() {
    Ext.apply(this.prototype, {
        // @private
        // Empty ResultSet to return when response is falsy (null|undefined|empty string)
        nullResultSet: new Ext.data.ResultSet({
            total  : 0,
            count  : 0,
            records: [],
            success: false
        })
    });

    //<deprecated product=touch since=2.0>
    /**
     * @cfg {String} root
     * The name of the property which contains the Array of row objects.  For JSON reader it's dot-separated list
     * of property names.  For XML reader it's a CSS selector.  For array reader it's not applicable.
     *
     * By default the natural root of the data will be used.  The root Json array, the root XML element, or the array.
     *
     * The data packet value for this property should be an empty array to clear the data or show no data.
     *
     * @deprecated 2.0.0 Please use the {@link #rootProperty} configuration instead.
     */
    this.override({
        constructor: function(config) {
            config = config || {};

            if (config.root) {
                // <debug>
                Ext.Logger.deprecate('root has been deprecated as a configuration on Reader. Please use rootProperty instead.');
                // </debug>

                config.rootProperty = config.root;
                delete config.root;
            }

            this.callOverridden([config]);
        }
    });
    //</deprecated>
});
