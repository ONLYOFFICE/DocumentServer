/**
 * @author Ed Spencer
 *
 * WebStorageProxy is simply a superclass for the {@link Ext.data.proxy.LocalStorage LocalStorage} proxy. It uses the
 * new HTML5 key/value client-side storage objects to save {@link Ext.data.Model model instances} for offline use.
 * @private
 */
Ext.define('Ext.data.proxy.WebStorage', {
    extend: 'Ext.data.proxy.Client',
    alternateClassName: 'Ext.data.WebStorageProxy',

    requires: 'Ext.Date',

    config: {
        /**
         * @cfg {String} id
         * The unique ID used as the key in which all record data are stored in the local storage object.
         */
        id: undefined,

        // WebStorage proxies dont use readers and writers
        /**
         * @cfg
         * @hide
         */
        reader: null,
        /**
         * @cfg
         * @hide
         */
        writer: null,

        /**
         * @cfg {Boolean} enablePagingParams This can be set to true if you want the webstorage proxy to comply
         * to the paging params set on the store.
         */
        enablePagingParams: false
    },

    /**
     * Creates the proxy, throws an error if local storage is not supported in the current browser.
     * @param {Object} config (optional) Config object.
     */
    constructor: function(config) {
        this.callParent(arguments);

        /**
         * @property {Object} cache
         * Cached map of records already retrieved by this Proxy. Ensures that the same instance is always retrieved.
         */
        this.cache = {};

        //<debug>
        if (this.getStorageObject() === undefined) {
            Ext.Logger.error("Local Storage is not supported in this browser, please use another type of data proxy");
        }
        //</debug>
    },

    updateModel: function(model) {
        if (!this.getId()) {
            this.setId(model.modelName);
        }
    },

    //inherit docs
    create: function(operation, callback, scope) {
        var records = operation.getRecords(),
            length  = records.length,
            ids     = this.getIds(),
            id, record, i;

        operation.setStarted();

        for (i = 0; i < length; i++) {
            record = records[i];
            // <debug>
            if (!this.getModel().getIdentifier().isUnique) {
                Ext.Logger.warn('Your identifier generation strategy for the model does not ensure unique id\'s. Please use the UUID strategy, or implement your own identifier strategy with the flag isUnique.');

            }
            // </debug>
            id = record.getId();

            this.setRecord(record);
            ids.push(id);
        }

        this.setIds(ids);

        operation.setCompleted();
        operation.setSuccessful();

        if (typeof callback == 'function') {
            callback.call(scope || this, operation);
        }
    },

    //inherit docs
    read: function(operation, callback, scope) {
        var records    = [],
            ids        = this.getIds(),
            model      = this.getModel(),
            idProperty = model.getIdProperty(),
            params     = operation.getParams() || {},
            sorters = operation.getSorters(),
            filters = operation.getFilters(),
            start = operation.getStart(),
            limit = operation.getLimit(),
            length     = ids.length,
            i, record, collection;

        //read a single record
        if (params[idProperty] !== undefined) {
            record = this.getRecord(params[idProperty]);
            if (record) {
                records.push(record);
                operation.setSuccessful();
            }
        } else {
            for (i = 0; i < length; i++) {
                records.push(this.getRecord(ids[i]));
            }

            collection = Ext.create('Ext.util.Collection');

            // First we comply to filters
            if (filters && filters.length) {
                collection.setFilters(filters);
            }
            // Then we comply to sorters
            if (sorters && sorters.length) {
                collection.setSorters(sorters);
            }

            collection.addAll(records);

            if (this.getEnablePagingParams() && start !== undefined && limit !== undefined) {
                records = collection.items.slice(start, start + limit);
            } else {
                records = collection.items.slice();
            }

            operation.setSuccessful();
        }

        operation.setCompleted();

        operation.setResultSet(Ext.create('Ext.data.ResultSet', {
            records: records,
            total  : records.length,
            loaded : true
        }));
        operation.setRecords(records);

        if (typeof callback == 'function') {
            callback.call(scope || this, operation);
        }
    },

    //inherit docs
    update: function(operation, callback, scope) {
        var records = operation.getRecords(),
            length  = records.length,
            ids     = this.getIds(),
            record, id, i;

        operation.setStarted();

        for (i = 0; i < length; i++) {
            record = records[i];
            this.setRecord(record);

            //we need to update the set of ids here because it's possible that a non-phantom record was added
            //to this proxy - in which case the record's id would never have been added via the normal 'create' call
            id = record.getId();
            if (id !== undefined && Ext.Array.indexOf(ids, id) == -1) {
                ids.push(id);
            }
        }
        this.setIds(ids);

        operation.setCompleted();
        operation.setSuccessful();

        if (typeof callback == 'function') {
            callback.call(scope || this, operation);
        }
    },

    //inherit
    destroy: function(operation, callback, scope) {
        var records = operation.getRecords(),
            length  = records.length,
            ids     = this.getIds(),

            //newIds is a copy of ids, from which we remove the destroyed records
            newIds  = [].concat(ids),
            i;

        operation.setStarted();

        for (i = 0; i < length; i++) {
            Ext.Array.remove(newIds, records[i].getId());
            this.removeRecord(records[i], false);
        }

        this.setIds(newIds);

        operation.setCompleted();
        operation.setSuccessful();

        if (typeof callback == 'function') {
            callback.call(scope || this, operation);
        }
    },

    /**
     * @private
     * Fetches a model instance from the Proxy by ID. Runs each field's decode function (if present) to decode the data.
     * @param {String} id The record's unique ID
     * @return {Ext.data.Model} The model instance or undefined if the record did not exist in the storage.
     */
    getRecord: function(id) {
        if (this.cache[id] === undefined) {
            var recordKey = this.getRecordKey(id),
                item = this.getStorageObject().getItem(recordKey),
                data    = {},
                Model   = this.getModel(),
                fields  = Model.getFields().items,
                length  = fields.length,
                i, field, name, record, rawData, dateFormat;

            if (!item) {
                return undefined;
            }

            rawData = Ext.decode(item);

            for (i = 0; i < length; i++) {
                field = fields[i];
                name  = field.getName();

                if (typeof field.getDecode() == 'function') {
                    data[name] = field.getDecode()(rawData[name]);
                } else {
                    if (field.getType().type == 'date') {
                        dateFormat = field.getDateFormat();
                        if (dateFormat) {
                            data[name] = Ext.Date.parse(rawData[name], dateFormat);
                        } else {
                            data[name] = new Date(rawData[name]);
                        }
                    } else {
                        data[name] = rawData[name];
                    }
                }
            }

            record = new Model(data, id);
            this.cache[id] = record;
        }

        return this.cache[id];
    },

    /**
     * Saves the given record in the Proxy. Runs each field's encode function (if present) to encode the data.
     * @param {Ext.data.Model} record The model instance
     * @param {String} [id] The id to save the record under (defaults to the value of the record's getId() function)
     */
    setRecord: function(record, id) {
        if (id) {
            record.setId(id);
        } else {
            id = record.getId();
        }

        var me = this,
            rawData = record.getData(),
            data    = {},
            Model   = me.getModel(),
            fields  = Model.getFields().items,
            length  = fields.length,
            i = 0,
            field, name, obj, key, dateFormat;

        for (; i < length; i++) {
            field = fields[i];
            name  = field.getName();

            if (field.getPersist() === false) {
                continue;
            }

            if (typeof field.getEncode() == 'function') {
                data[name] = field.getEncode()(rawData[name], record);
            } else {
                if (field.getType().type == 'date' && Ext.isDate(rawData[name])) {
                    dateFormat = field.getDateFormat();
                    if (dateFormat) {
                        data[name] = Ext.Date.format(rawData[name], dateFormat);
                    } else {
                        data[name] = rawData[name].getTime();
                    }
                } else {
                    data[name] = rawData[name];
                }
            }
        }

        obj = me.getStorageObject();
        key = me.getRecordKey(id);

        //keep the cache up to date
        me.cache[id] = record;

        //iPad bug requires that we remove the item before setting it
        obj.removeItem(key);
        try {
            obj.setItem(key, Ext.encode(data));
        } catch(e){
            this.fireEvent('exception', this, e);
        }

        record.commit();
    },

    /**
     * @private
     * Physically removes a given record from the local storage. Used internally by {@link #destroy}, which you should
     * use instead because it updates the list of currently-stored record ids
     * @param {String/Number/Ext.data.Model} id The id of the record to remove, or an Ext.data.Model instance
     */
    removeRecord: function(id, updateIds) {
        var me = this,
            ids;

        if (id.isModel) {
            id = id.getId();
        }

        if (updateIds !== false) {
            ids = me.getIds();
            Ext.Array.remove(ids, id);
            me.setIds(ids);
        }

        me.getStorageObject().removeItem(me.getRecordKey(id));
    },

    /**
     * @private
     * Given the id of a record, returns a unique string based on that id and the id of this proxy. This is used when
     * storing data in the local storage object and should prevent naming collisions.
     * @param {String/Number/Ext.data.Model} id The record id, or a Model instance
     * @return {String} The unique key for this record
     */
    getRecordKey: function(id) {
        if (id.isModel) {
            id = id.getId();
        }

        return Ext.String.format("{0}-{1}", this.getId(), id);
    },

    /**
     * @private
     * Returns the array of record IDs stored in this Proxy
     * @return {Number[]} The record IDs. Each is cast as a Number
     */
    getIds: function() {
        var ids    = (this.getStorageObject().getItem(this.getId()) || "").split(","),
            length = ids.length,
            i;

        if (length == 1 && ids[0] === "") {
            ids = [];
        }

        return ids;
    },

    /**
     * @private
     * Saves the array of ids representing the set of all records in the Proxy
     * @param {Number[]} ids The ids to set
     */
    setIds: function(ids) {
        var obj = this.getStorageObject(),
            str = ids.join(","),
            id  = this.getId();

        obj.removeItem(id);

        if (!Ext.isEmpty(str)) {
            try {
                obj.setItem(id, str);
            } catch(e){
                this.fireEvent('exception', this, e);
            }
        }
    },

    /**
     * @private
     * Sets up the Proxy by claiming the key in the storage object that corresponds to the unique id of this Proxy. Called
     * automatically by the constructor, this should not need to be called again unless {@link #clear} has been called.
     */
    initialize: function() {
        this.callParent(arguments);
        var storageObject = this.getStorageObject();
        try {
            storageObject.setItem(this.getId(), storageObject.getItem(this.getId()) || "");
        } catch(e){
            this.fireEvent('exception', this, e);
        }
    },

    /**
     * Destroys all records stored in the proxy and removes all keys and values used to support the proxy from the
     * storage object.
     */
    clear: function() {
        var obj = this.getStorageObject(),
            ids = this.getIds(),
            len = ids.length,
            i;

        //remove all the records
        for (i = 0; i < len; i++) {
            this.removeRecord(ids[i], false);
        }

        //remove the supporting objects
        obj.removeItem(this.getId());
    },

    /**
     * @private
     * Abstract function which should return the storage object that data will be saved to. This must be implemented
     * in each subclass.
     * @return {Object} The storage object
     */
    getStorageObject: function() {
        //<debug>
        Ext.Logger.error("The getStorageObject function has not been defined in your Ext.data.proxy.WebStorage subclass");
        //</debug>
    }
});