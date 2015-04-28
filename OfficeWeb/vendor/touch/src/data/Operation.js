/**
 * @author Ed Spencer
 *
 * Represents a single read or write operation performed by a {@link Ext.data.proxy.Proxy Proxy}. Operation objects are
 * used to enable communication between Stores and Proxies. Application developers should rarely need to interact with
 * Operation objects directly.
 *
 * Note that when you define an Operation directly, you need to specify at least the {@link #model} configuration.
 *
 * Several Operations can be batched together in a {@link Ext.data.Batch batch}.
 */
Ext.define('Ext.data.Operation', {
    config: {
        /**
         * @cfg {Boolean} synchronous
         * True if this Operation is to be executed synchronously. This property is inspected by a
         * {@link Ext.data.Batch Batch} to see if a series of Operations can be executed in parallel or not.
         * @accessor
         */
        synchronous: true,

        /**
         * @cfg {String} action
         * The action being performed by this Operation. Should be one of 'create', 'read', 'update' or 'destroy'.
         * @accessor
         */
        action: null,

        /**
         * @cfg {Ext.util.Filter[]} filters
         * Optional array of filter objects. Only applies to 'read' actions.
         * @accessor
         */
        filters: null,

        /**
         * @cfg {Ext.util.Sorter[]} sorters
         * Optional array of sorter objects. Only applies to 'read' actions.
         * @accessor
         */
        sorters: null,

        /**
         * @cfg {Ext.util.Grouper} grouper
         * Optional grouping configuration. Only applies to 'read' actions where grouping is desired.
         * @accessor
         */
        grouper: null,

        /**
         * @cfg {Number} start
         * The start index (offset), used in paging when running a 'read' action.
         * @accessor
         */
        start: null,

        /**
         * @cfg {Number} limit
         * The number of records to load. Used on 'read' actions when paging is being used.
         * @accessor
         */
        limit: null,

        /**
         * @cfg {Ext.data.Batch} batch
         * The batch that this Operation is a part of.
         * @accessor
         */
        batch: null,

        /**
         * @cfg {Function} callback
         * Function to execute when operation completed.
         * @cfg {Ext.data.Model[]} callback.records Array of records.
         * @cfg {Ext.data.Operation} callback.operation The Operation itself.
         * @accessor
         */
        callback: null,

        /**
         * @cfg {Object} scope
         * Scope for the {@link #callback} function.
         * @accessor
         */
        scope: null,

        /**
         * @cfg {Ext.data.ResultSet} resultSet
         * The ResultSet for this operation.
         * @accessor
         */
        resultSet: null,

        /**
         * @cfg {Array} records
         * The records associated to this operation. Before an operation starts, these
         * are the records you are updating, creating, or destroying. After an operation
         * is completed, a Proxy usually sets these records on the Operation to become
         * the processed records. If you don't set these records on your operation in
         * your proxy, then the getter will return the ones defined on the {@link #resultSet}
         * @accessor
         */
        records: null,

        /**
         * @cfg {Ext.data.Request} request
         * The request used for this Operation. Operations don't usually care about Request and Response data, but in the
         * ServerProxy and any of its subclasses they may be useful for further processing.
         * @accessor
         */
        request: null,

        /**
         * @cfg {Object} response
         * The response that was gotten from the server if there was one.
         * @accessor
         */
        response: null,

        /**
         * @cfg {Boolean} withCredentials
         * This field is necessary when using cross-origin resource sharing.
         * @accessor
         */
        withCredentials: null,

        /**
         * @cfg {Object} params
         * The params send along with this operation. These usually apply to a Server proxy if you are
         * creating your own custom proxy,
         * @accessor
         */
        params: null,
        url: null,
        page: null,
        node: null,

        /**
         * @cfg {Ext.data.Model} model
         * The Model that this Operation will be dealing with. This configuration is required when defining any Operation.
         * Since Operations take care of creating, updating, destroying and reading records, it needs access to the Model.
         * @accessor
         */
        model: undefined,

        addRecords: false
    },

    /**
     * @property {Boolean} started
     * Property tracking the start status of this Operation. Use {@link #isStarted}.
     * @private
     * @readonly
     */
    started: false,

    /**
     * @property {Boolean} running
     * Property tracking the run status of this Operation. Use {@link #isRunning}.
     * @private
     * @readonly
     */
    running: false,

    /**
     * @property {Boolean} complete
     * Property tracking the completion status of this Operation. Use {@link #isComplete}.
     * @private
     * @readonly
     */
    complete: false,

    /**
     * @property {Boolean} success
     * Property tracking whether the Operation was successful or not. This starts as undefined and is set to `true`
     * or `false` by the Proxy that is executing the Operation. It is also set to false by {@link #setException}. Use
     * {@link #wasSuccessful} to query success status.
     * @private
     * @readonly
     */
    success: undefined,

    /**
     * @property {Boolean} exception
     * Property tracking the exception status of this Operation. Use {@link #hasException} and see {@link #getError}.
     * @private
     * @readonly
     */
    exception: false,

    /**
     * @property {String/Object} error
     * The error object passed when {@link #setException} was called. This could be any object or primitive.
     * @private
     */
    error: undefined,

    /**
     * Creates new Operation object.
     * @param {Object} config (optional) Config object.
     */
    constructor: function(config) {
        this.initConfig(config);
    },

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

        // <debug>
        if (!model) {
            Ext.Logger.warn('Unless you define your model using metadata, an Operation needs to have a model defined.');
        }
        // </debug>

        return model;
    },

    getRecords: function() {
        var resultSet = this.getResultSet();
        return this._records || (resultSet ? resultSet.getRecords() : []);
    },

    /**
     * Marks the Operation as started.
     */
    setStarted: function() {
        this.started = true;
        this.running = true;
    },

    /**
     * Marks the Operation as completed.
     */
    setCompleted: function() {
        this.complete = true;
        this.running  = false;
    },

    /**
     * Marks the Operation as successful.
     */
    setSuccessful: function() {
        this.success = true;
    },

    /**
     * Marks the Operation as having experienced an exception. Can be supplied with an option error message/object.
     * @param {String/Object} error (optional) error string/object
     */
    setException: function(error) {
        this.exception = true;
        this.success = false;
        this.running = false;
        this.error = error;
    },

    /**
     * Returns `true` if this Operation encountered an exception (see also {@link #getError}).
     * @return {Boolean} `true` if there was an exception.
     */
    hasException: function() {
        return this.exception === true;
    },

    /**
     * Returns the error string or object that was set using {@link #setException}.
     * @return {String/Object} The error object.
     */
    getError: function() {
        return this.error;
    },

    /**
     * Returns `true` if the Operation has been started. Note that the Operation may have started AND completed, see
     * {@link #isRunning} to test if the Operation is currently running.
     * @return {Boolean} `true` if the Operation has started
     */
    isStarted: function() {
        return this.started === true;
    },

    /**
     * Returns `true` if the Operation has been started but has not yet completed.
     * @return {Boolean} `true` if the Operation is currently running
     */
    isRunning: function() {
        return this.running === true;
    },

    /**
     * Returns `true` if the Operation has been completed
     * @return {Boolean} `true` if the Operation is complete
     */
    isComplete: function() {
        return this.complete === true;
    },

    /**
     * Returns `true` if the Operation has completed and was successful
     * @return {Boolean} `true` if successful
     */
    wasSuccessful: function() {
        return this.isComplete() && this.success === true;
    },

    /**
     * Checks whether this operation should cause writing to occur.
     * @return {Boolean} Whether the operation should cause a write to occur.
     */
    allowWrite: function() {
        return this.getAction() != 'read';
    },

    process: function(action, resultSet, request, response) {
        if (resultSet.getSuccess() !== false) {
            this.setResponse(response);
            this.setResultSet(resultSet);
            this.setCompleted();
            this.setSuccessful();
        } else {
            return false;
        }

        return this['process' + Ext.String.capitalize(action)].call(this, resultSet, request, response);
    },

    processRead: function(resultSet) {
        var records = resultSet.getRecords(),
            processedRecords = [],
            Model = this.getModel(),
            ln = records.length,
            i, record;

        for (i = 0; i < ln; i++) {
            record = records[i];
            processedRecords.push(new Model(record.data, record.id, record.node));
        }

        this.setRecords(processedRecords);
        resultSet.setRecords(processedRecords);
        return true;
    },

    processCreate: function(resultSet) {
        var updatedRecords = resultSet.getRecords(),
            currentRecords = this.getRecords(),
            ln = updatedRecords.length,
            i, currentRecord, updatedRecord;

        for (i = 0; i < ln; i++) {
            updatedRecord = updatedRecords[i];

            if (updatedRecord.clientId === null && currentRecords.length == 1 && updatedRecords.length == 1) {
                currentRecord = currentRecords[i];
            } else {
                currentRecord = this.findCurrentRecord(updatedRecord.clientId);
            }

            if (currentRecord) {
                this.updateRecord(currentRecord, updatedRecord);
            }
            // <debug>
            else {
                Ext.Logger.warn('Unable to match the record that came back from the server.');
            }
            // </debug>
        }

        return true;
    },

    processUpdate: function(resultSet) {
        var updatedRecords = resultSet.getRecords(),
            currentRecords = this.getRecords(),
            ln = updatedRecords.length,
            i, currentRecord, updatedRecord;

        for (i = 0; i < ln; i++) {
            updatedRecord = updatedRecords[i];
            currentRecord = currentRecords[i];

            if (currentRecord) {
                this.updateRecord(currentRecord, updatedRecord);
            }
            // <debug>
            else {
                Ext.Logger.warn('Unable to match the updated record that came back from the server.');
            }
            // </debug>
        }

        return true;
    },

    processDestroy: function(resultSet) {
        var updatedRecords = resultSet.getRecords(),
            ln = updatedRecords.length,
            i, currentRecord, updatedRecord;

        for (i = 0; i < ln; i++) {
            updatedRecord = updatedRecords[i];
            currentRecord = this.findCurrentRecord(updatedRecord.id);

            if (currentRecord) {
                currentRecord.setIsErased(true);
                currentRecord.notifyStores('afterErase', currentRecord);
            }
            // <debug>
            else {
                Ext.Logger.warn('Unable to match the destroyed record that came back from the server.');
            }
            // </debug>
        }
    },

    findCurrentRecord: function(clientId) {
        var currentRecords = this.getRecords(),
            ln = currentRecords.length,
            i, currentRecord;

        for (i = 0; i < ln; i++) {
            currentRecord = currentRecords[i];
            if (currentRecord.getId() === clientId) {
                return currentRecord;
            }
        }
    },

    updateRecord: function(currentRecord, updatedRecord) {
        var recordData = updatedRecord.data,
            recordId = updatedRecord.id;

        currentRecord.beginEdit();

        currentRecord.set(recordData);
        if (recordId !== null) {
            currentRecord.setId(recordId);
        }

        // We call endEdit with silent: true because the commit below already makes
        // sure any store is notified of the record being updated.
        currentRecord.endEdit(true);

        currentRecord.commit();
    }
    // <deprecated product=touch since=2.0>
}, function() {
    /**
     * @member Ext.data.Operation
     * @cfg {Boolean} group
     * @inheritdoc Ext.data.Operation#grouper
     * @deprecated 2.0.0 Please use {@link #grouper} instead.
     */
    Ext.deprecateProperty(this, 'group', 'grouper');
    // </deprecated>
});
