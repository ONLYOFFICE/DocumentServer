/**
 * @author Ed Spencer
 * @aside guide proxies
 *
 * In-memory proxy. This proxy simply uses a local variable for data storage/retrieval, so its contents are lost on
 * every page refresh.
 *
 * Usually this Proxy isn't used directly, serving instead as a helper to a {@link Ext.data.Store Store} where a reader
 * is required to load data. For example, say we have a Store for a User model and have some inline data we want to
 * load, but this data isn't in quite the right format: we can use a MemoryProxy with a JsonReader to read it into our
 * Store:
 *
 *     //this is the model we will be using in the store
 *     Ext.define('User', {
 *         extend: 'Ext.data.Model',
 *         config: {
 *             fields: [
 *                 {name: 'id',    type: 'int'},
 *                 {name: 'name',  type: 'string'},
 *                 {name: 'phone', type: 'string', mapping: 'phoneNumber'}
 *             ]
 *         }
 *     });
 *
 *     //this data does not line up to our model fields - the phone field is called phoneNumber
 *     var data = {
 *         users: [
 *             {
 *                 id: 1,
 *                 name: 'Ed Spencer',
 *                 phoneNumber: '555 1234'
 *             },
 *             {
 *                 id: 2,
 *                 name: 'Abe Elias',
 *                 phoneNumber: '666 1234'
 *             }
 *         ]
 *     };
 *
 *     //note how we set the 'root' in the reader to match the data structure above
 *     var store = Ext.create('Ext.data.Store', {
 *         autoLoad: true,
 *         model: 'User',
 *         data : data,
 *         proxy: {
 *             type: 'memory',
 *             reader: {
 *                 type: 'json',
 *                 root: 'users'
 *             }
 *         }
 *     });
 */
Ext.define('Ext.data.proxy.Memory', {
    extend: 'Ext.data.proxy.Client',
    alias: 'proxy.memory',
    alternateClassName: 'Ext.data.MemoryProxy',

    isMemoryProxy: true,

    config: {
        /**
         * @cfg {Object} data
         * Optional data to pass to configured Reader.
         */
        data: []
    },

    /**
     * @private
     * Fake processing function to commit the records, set the current operation
     * to successful and call the callback if provided. This function is shared
     * by the create, update and destroy methods to perform the bare minimum
     * processing required for the proxy to register a result from the action.
     */
    finishOperation: function(operation, callback, scope) {
        if (operation) {
            var i = 0,
                recs = operation.getRecords(),
                len = recs.length;

            for (i; i < len; i++) {
                recs[i].commit();
            }

            operation.setCompleted();
            operation.setSuccessful();

            Ext.callback(callback, scope || this, [operation]);
        }
    },

    /**
     * Currently this is a hard-coded method that simply commits any records and sets the operation to successful,
     * then calls the callback function, if provided. It is essentially mocking a server call in memory, but since
     * there is no real back end in this case there's not much else to do. This method can be easily overridden to
     * implement more complex logic if needed.
     * @param {Ext.data.Operation} operation The Operation to perform
     * @param {Function} callback Callback function to be called when the Operation has completed (whether
     * successful or not)
     * @param {Object} scope Scope to execute the callback function in
     * @method
     */
    create: function() {
        this.finishOperation.apply(this, arguments);
    },

    /**
     * Currently this is a hard-coded method that simply commits any records and sets the operation to successful,
     * then calls the callback function, if provided. It is essentially mocking a server call in memory, but since
     * there is no real back end in this case there's not much else to do. This method can be easily overridden to
     * implement more complex logic if needed.
     * @param {Ext.data.Operation} operation The Operation to perform
     * @param {Function} callback Callback function to be called when the Operation has completed (whether
     * successful or not)
     * @param {Object} scope Scope to execute the callback function in
     * @method
     */
    update: function() {
        this.finishOperation.apply(this, arguments);
    },

    /**
     * Currently this is a hard-coded method that simply commits any records and sets the operation to successful,
     * then calls the callback function, if provided. It is essentially mocking a server call in memory, but since
     * there is no real back end in this case there's not much else to do. This method can be easily overridden to
     * implement more complex logic if needed.
     * @param {Ext.data.Operation} operation The Operation to perform
     * @param {Function} callback Callback function to be called when the Operation has completed (whether
     * successful or not)
     * @param {Object} scope Scope to execute the callback function in
     * @method
     */
    destroy: function() {
        this.finishOperation.apply(this, arguments);
    },

    /**
     * Reads data from the configured {@link #data} object. Uses the Proxy's {@link #reader}, if present.
     * @param {Ext.data.Operation} operation The read Operation
     * @param {Function} callback The callback to call when reading has completed
     * @param {Object} scope The scope to call the callback function in
     */
    read: function(operation, callback, scope) {
        var me     = this,
            reader = me.getReader();

        if (operation.process('read', reader.process(me.getData())) === false) {
            this.fireEvent('exception', this, null, operation);
        }

        Ext.callback(callback, scope || me, [operation]);
    },

    clear: Ext.emptyFn
});
