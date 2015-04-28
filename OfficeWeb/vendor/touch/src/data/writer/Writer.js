/**
 * @author Ed Spencer
 *
 * Base Writer class used by most subclasses of {@link Ext.data.proxy.Server}. This class is
 * responsible for taking a set of {@link Ext.data.Operation} objects and a {@link Ext.data.Request}
 * object and modifying that request based on the Operations.
 *
 * For example a Ext.data.writer.Json would format the Operations and their {@link Ext.data.Model}
 * instances based on the config options passed to the JsonWriter's constructor.
 *
 * Writers are not needed for any kind of local storage - whether via a
 * {@link Ext.data.proxy.WebStorage Web Storage proxy} (see {@link Ext.data.proxy.LocalStorage localStorage})
 * or just in memory via a {@link Ext.data.proxy.Memory MemoryProxy}.
 */
Ext.define('Ext.data.writer.Writer', {
    alias: 'writer.base',
    alternateClassName: ['Ext.data.DataWriter', 'Ext.data.Writer'],

    config: {
        /**
         * @cfg {Boolean} writeAllFields `true` to write all fields from the record to the server. If set to `false` it
         * will only send the fields that were modified. Note that any fields that have
         * {@link Ext.data.Field#persist} set to false will still be ignored.
         */
        writeAllFields: true,

        /**
         * @cfg {String} nameProperty This property is used to read the key for each value that will be sent to the server.
         * For example:
         *
         *     Ext.define('Person', {
         *         extend: 'Ext.data.Model',
         *         fields: [{
         *             name: 'first',
         *             mapping: 'firstName'
         *         }, {
         *             name: 'last',
         *             mapping: 'lastName'
         *         }, {
         *             name: 'age'
         *         }]
         *     });
         *
         *     new Ext.data.writer.Writer({
         *         writeAllFields: true,
         *         nameProperty: 'mapping'
         *     });
         *
         * The following data will be sent to the server:
         * 
         *     {
         *         firstName: 'first name value',
         *         lastName: 'last name value',
         *         age: 1
         *     }
         *
         * If the value is not present, the field name will always be used.
         */
        nameProperty: 'name'
    },

    /**
     * Creates new Writer.
     * @param {Object} config (optional) Config object.
     */
    constructor: function(config) {
        this.initConfig(config);
    },

    /**
     * Prepares a Proxy's Ext.data.Request object.
     * @param {Ext.data.Request} request The request object.
     * @return {Ext.data.Request} The modified request object.
     */
    write: function(request) {
        var operation = request.getOperation(),
            records   = operation.getRecords() || [],
            len       = records.length,
            i         = 0,
            data      = [];

        for (; i < len; i++) {
            data.push(this.getRecordData(records[i]));
        }
        return this.writeRecords(request, data);
    },

    writeDate: function(field, date) {
        var dateFormat = field.getDateFormat() || 'timestamp';
        switch (dateFormat) {
            case 'timestamp':
                return date.getTime()/1000;
            case 'time':
                return date.getTime();
            default:
                return Ext.Date.format(date, dateFormat);
        }
    },

    /**
     * Formats the data for each record before sending it to the server. This
     * method should be overridden to format the data in a way that differs from the default.
     * @param {Object} record The record that we are writing to the server.
     * @return {Object} An object literal of name/value keys to be written to the server.
     * By default this method returns the data property on the record.
     */
    getRecordData: function(record) {
        var isPhantom = record.phantom === true,
            writeAll = this.getWriteAllFields() || isPhantom,
            nameProperty = this.getNameProperty(),
            fields = record.getFields(),
            data = {},
            changes, name, field, key, value;

        if (writeAll) {
            fields.each(function(field) {
                if (field.getPersist()) {
                    name = field.config[nameProperty] || field.getName();
                    value = record.get(field.getName());
                    if (field.getType().type == 'date') {
                        value = this.writeDate(field, value);
                    }
                    data[name] = value;
                }
            }, this);
        } else {
            // Only write the changes
            changes = record.getChanges();
            for (key in changes) {
                if (changes.hasOwnProperty(key)) {
                    field = fields.get(key);
                    if (field.getPersist()) {
                        name = field.config[nameProperty] || field.getName();
                        value = changes[key];
                        if (field.getType().type == 'date') {
                            value = this.writeDate(field, value);
                        }
                        data[name] = value;
                    }
                }
            }
            if (!isPhantom) {
                // always include the id for non phantoms
                data[record.getIdProperty()] = record.getId();
            }
        }
        return data;
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
                Ext.Logger.deprecate(key + ' is deprecated as a property directly on the Writer prototype. ' +
                    'Please put it inside the config object.');
                // </debug>
            }
        }

        data.config = config;
    }
    // </deprecated>
});
