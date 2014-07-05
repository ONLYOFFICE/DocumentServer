/**
 * @author Ed Spencer
 * @aside guide proxies
 *
 * Proxies are used by {@link Ext.data.Store Stores} to handle the loading and saving of {@link Ext.data.Model Model}
 * data. Usually developers will not need to create or interact with proxies directly.
 *
 * # Types of Proxy
 *
 * There are two main types of Proxy - {@link Ext.data.proxy.Client Client} and {@link Ext.data.proxy.Server Server}.
 * The Client proxies save their data locally and include the following subclasses:
 *
 * - {@link Ext.data.proxy.LocalStorage LocalStorageProxy} - saves its data to localStorage if the browser supports it
 * - {@link Ext.data.proxy.Memory MemoryProxy} - holds data in memory only, any data is lost when the page is refreshed
 *
 * The Server proxies save their data by sending requests to some remote server. These proxies include:
 *
 * - {@link Ext.data.proxy.Ajax Ajax} - sends requests to a server on the same domain
 * - {@link Ext.data.proxy.JsonP JsonP} - uses JSON-P to send requests to a server on a different domain
 *
 * Proxies operate on the principle that all operations performed are either Create, Read, Update or Delete. These four
 * operations are mapped to the methods {@link #create}, {@link #read}, {@link #update} and {@link #destroy}
 * respectively. Each Proxy subclass implements these functions.
 *
 * The CRUD methods each expect an {@link Ext.data.Operation Operation} object as the sole argument. The Operation
 * encapsulates information about the action the Store wishes to perform, the {@link Ext.data.Model model} instances
 * that are to be modified, etc. See the {@link Ext.data.Operation Operation} documentation for more details. Each CRUD
 * method also accepts a callback function to be called asynchronously on completion.
 *
 * Proxies also support batching of Operations via a {@link Ext.data.Batch batch} object, invoked by the {@link #batch}
 * method.
 */
Ext.define('Ext.data.proxy.Proxy', {
    extend: 'Ext.Evented',

    alias: 'proxy.proxy',

    alternateClassName: ['Ext.data.DataProxy', 'Ext.data.Proxy'],

    requires: [
        'Ext.data.reader.Json',
        'Ext.data.writer.Json',
        'Ext.data.Batch',
        'Ext.data.Operation'
    ],

    config: {
        /**
         * @cfg {String} batchOrder
         * Comma-separated ordering 'create', 'update' and 'destroy' actions when batching. Override this to set a different
         * order for the batched CRUD actions to be executed in.
         * @accessor
         */
        batchOrder: 'create,update,destroy',

        /**
         * @cfg {Boolean} batchActions
         * True to batch actions of a particular type when synchronizing the store.
         * @accessor
         */
        batchActions: true,

        /**
         * @cfg {String/Ext.data.Model} model (required)
         * The name of the Model to tie to this Proxy. Can be either the string name of the Model, or a reference to the
         * Model constructor.
         * @accessor
         */
        model: null,

        /**
         * @cfg {Object/String/Ext.data.reader.Reader} reader
         * The Ext.data.reader.Reader to use to decode the server's response or data read from client. This can either be a
         * Reader instance, a config object or just a valid Reader type name (e.g. 'json', 'xml').
         * @accessor
         */
        reader: {
            type: 'json'
        },

        /**
         * @cfg {Object/String/Ext.data.writer.Writer} writer
         * The Ext.data.writer.Writer to use to encode any request sent to the server or saved to client. This can either be
         * a Writer instance, a config object or just a valid Writer type name (e.g. 'json', 'xml').
         * @accessor
         */
        writer: {
            type: 'json'
        }
    },

    isProxy: true,

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

    updateModel: function(model) {
        if (model) {
            var reader = this.getReader();
            if (reader && !reader.getModel()) {
                reader.setModel(model);
            }
        }
    },

    applyReader: function(reader, currentReader) {
        return Ext.factory(reader, Ext.data.Reader, currentReader, 'reader');
    },

    updateReader: function(reader) {
        if (reader) {
            var model = this.getModel();
            if (!model) {
                model = reader.getModel();
                if (model) {
                    this.setModel(model);
                }
            } else {
                reader.setModel(model);
            }

            if (reader.onMetaChange) {
                 reader.onMetaChange = Ext.Function.createSequence(reader.onMetaChange, this.onMetaChange, this);
            }
        }
    },

    onMetaChange: function(data) {
        var model = this.getReader().getModel();
        if (!this.getModel() && model) {
            this.setModel(model);
        }

        /**
         * @event metachange
         * Fires whenever the server has sent back new metadata to reconfigure the Reader.
         * @param {Ext.data.Proxy} this
         * @param {Object} data The metadata sent back from the server
         */
        this.fireEvent('metachange', this, data);
    },

    applyWriter: function(writer, currentWriter) {
        return Ext.factory(writer, Ext.data.Writer, currentWriter, 'writer');
    },

    /**
     * Performs the given create operation. If you override this method in a custom Proxy, remember to always call the provided
     * callback method when you are done with your operation.
     * @param {Ext.data.Operation} operation The Operation to perform
     * @param {Function} callback Callback function to be called when the Operation has completed (whether successful or not)
     * @param {Object} scope Scope to execute the callback function in
     * @method
     */
    create: Ext.emptyFn,

    /**
     * Performs the given read operation. If you override this method in a custom Proxy, remember to always call the provided
     * callback method when you are done with your operation.
     * @param {Ext.data.Operation} operation The Operation to perform
     * @param {Function} callback Callback function to be called when the Operation has completed (whether successful or not)
     * @param {Object} scope Scope to execute the callback function in
     * @method
     */
    read: Ext.emptyFn,

    /**
     * Performs the given update operation. If you override this method in a custom Proxy, remember to always call the provided
     * callback method when you are done with your operation.
     * @param {Ext.data.Operation} operation The Operation to perform
     * @param {Function} callback Callback function to be called when the Operation has completed (whether successful or not)
     * @param {Object} scope Scope to execute the callback function in
     * @method
     */
    update: Ext.emptyFn,

    /**
     * Performs the given destroy operation. If you override this method in a custom Proxy, remember to always call the provided
     * callback method when you are done with your operation.
     * @param {Ext.data.Operation} operation The Operation to perform
     * @param {Function} callback Callback function to be called when the Operation has completed (whether successful or not)
     * @param {Object} scope Scope to execute the callback function in
     * @method
     */
    destroy: Ext.emptyFn,

    onDestroy: function() {
        Ext.destroy(this.getReader(), this.getWriter());
    },

    /**
     * Performs a batch of {@link Ext.data.Operation Operations}, in the order specified by {@link #batchOrder}. Used
     * internally by {@link Ext.data.Store}'s {@link Ext.data.Store#sync sync} method. Example usage:
     *
     *     myProxy.batch({
     *         create : [myModel1, myModel2],
     *         update : [myModel3],
     *         destroy: [myModel4, myModel5]
     *     });
     *
     * Where the myModel* above are {@link Ext.data.Model Model} instances - in this case 1 and 2 are new instances and
     * have not been saved before, 3 has been saved previously but needs to be updated, and 4 and 5 have already been
     * saved but should now be destroyed.
     *
     * @param {Object} options Object containing one or more properties supported by the batch method:
     *
     * @param {Object} options.operations Object containing the Model instances to act upon, keyed by action name
     *
     * @param {Object} [options.listeners] Event listeners object passed straight through to the Batch -
     * see {@link Ext.data.Batch} for details
     *
     * @param {Ext.data.Batch/Object} [options.batch] A {@link Ext.data.Batch} object (or batch config to apply
     * to the created batch). If unspecified a default batch will be auto-created.
     *
     * @param {Function} [options.callback] The function to be called upon completion of processing the batch.
     * The callback is called regardless of success or failure and is passed the following parameters:
     * @param {Ext.data.Batch} options.callback.batch The {@link Ext.data.Batch batch} that was processed,
     * containing all operations in their current state after processing
     * @param {Object} options.callback.options The options argument that was originally passed into batch
     *
     * @param {Function} [options.success] The function to be called upon successful completion of the batch. The
     * success function is called only if no exceptions were reported in any operations. If one or more exceptions
     * occurred then the `failure` function will be called instead. The success function is called
     * with the following parameters:
     * @param {Ext.data.Batch} options.success.batch The {@link Ext.data.Batch batch} that was processed,
     * containing all operations in their current state after processing
     * @param {Object} options.success.options The options argument that was originally passed into batch
     *
     * @param {Function} [options.failure] The function to be called upon unsuccessful completion of the batch. The
     * failure function is called when one or more operations returns an exception during processing (even if some
     * operations were also successful). The failure function is called with the following parameters:
     * @param {Ext.data.Batch} options.failure.batch The {@link Ext.data.Batch batch} that was processed,
     * containing all operations in their current state after processing
     * @param {Object} options.failure.options The options argument that was originally passed into batch
     *
     * @param {Object} [options.scope] The scope in which to execute any callbacks (i.e. the `this` object inside
     * the callback, success and/or failure functions). Defaults to the proxy.
     *
     * @return {Ext.data.Batch} The newly created Batch
     */
    batch: function(options, /* deprecated */listeners) {
        var me = this,
            useBatch = me.getBatchActions(),
            model = me.getModel(),
            batch,
            records;

        if (options.operations === undefined) {
            // the old-style (operations, listeners) signature was called
            // so convert to the single options argument syntax
            options = {
                operations: options,
                listeners: listeners
            };

            // <debug warn>
            Ext.Logger.deprecate('Passes old-style signature to Proxy.batch (operations, listeners). Please convert to single options argument syntax.');
            // </debug>
        }

        if (options.batch && options.batch.isBatch) {
            batch = options.batch;
        } else {
            batch = new Ext.data.Batch(options.batch || {});
        }

        batch.setProxy(me);

        batch.on('complete', Ext.bind(me.onBatchComplete, me, [options], 0));
        if (options.listeners) {
            batch.on(options.listeners);
        }

        Ext.each(me.getBatchOrder().split(','), function(action) {
             records = options.operations[action];
             if (records) {
                 if (useBatch) {
                     batch.add(new Ext.data.Operation({
                         action: action,
                         records: records,
                         model: model
                     }));
                 } else {
                     Ext.each(records, function(record) {
                         batch.add(new Ext.data.Operation({
                             action : action,
                             records: [record],
                             model: model
                         }));
                     });
                 }
             }
        }, me);

        batch.start();
        return batch;
    },

    /**
      * @private
      * The internal callback that the proxy uses to call any specified user callbacks after completion of a batch
      */
    onBatchComplete: function(batchOptions, batch) {
         var scope = batchOptions.scope || this;

         if (batch.hasException) {
             if (Ext.isFunction(batchOptions.failure)) {
                 Ext.callback(batchOptions.failure, scope, [batch, batchOptions]);
             }
         } else if (Ext.isFunction(batchOptions.success)) {
             Ext.callback(batchOptions.success, scope, [batch, batchOptions]);
         }

         if (Ext.isFunction(batchOptions.callback)) {
             Ext.callback(batchOptions.callback, scope, [batch, batchOptions]);
         }
    }

    // <deprecated product=touch since=2.0>
    ,onClassExtended: function(cls, data) {
        var prototype = this.prototype,
            defaultConfig = prototype.config,
            config = data.config || {},
            key;

        // Convert deprecated properties in application into a config object
        for (key in defaultConfig) {
            if (key != "control" && key in data) {
                config[key] = data[key];
                delete data[key];
                // <debug warn>
                Ext.Logger.warn(key + ' is deprecated as a property directly on the ' + this.$className + ' prototype. Please put it inside the config object.');
                // </debug>
            }
        }
        data.config = config;
    }
    // </deprecated>
}, function() {
    // Ext.data2.proxy.ProxyMgr.registerType('proxy', this);

    //backwards compatibility
    // Ext.data.DataProxy = this;
    // Ext.deprecate('platform', '2.0', function() {
    //     Ext.data2.DataProxy = this;
    // }, this);
});
