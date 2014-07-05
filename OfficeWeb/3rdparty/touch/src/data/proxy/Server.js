/**
 * @author Ed Spencer
 *
 * ServerProxy is a superclass of {@link Ext.data.proxy.JsonP JsonPProxy} and {@link Ext.data.proxy.Ajax AjaxProxy}, and
 * would not usually be used directly.
 * @private
 */
Ext.define('Ext.data.proxy.Server', {
    extend: 'Ext.data.proxy.Proxy',
    alias : 'proxy.server',
    alternateClassName: 'Ext.data.ServerProxy',
    requires  : ['Ext.data.Request'],

    config: {
        /**
         * @cfg {String} url
         * The URL from which to request the data object.
         */
        url: null,

        /**
         * @cfg {String} pageParam
         * The name of the `page` parameter to send in a request. Set this to `false` if you don't
         * want to send a page parameter.
         */
        pageParam: 'page',

        /**
         * @cfg {String} startParam
         * The name of the `start` parameter to send in a request. Set this to `false` if you don't
         * want to send a start parameter.
         */
        startParam: 'start',

        /**
         * @cfg {String} limitParam
         * The name of the `limit` parameter to send in a request. Set this to `false` if you don't
         * want to send a limit parameter.
         */
        limitParam: 'limit',

        /**
         * @cfg {String} groupParam
         * The name of the `group` parameter to send in a request. Set this to `false` if you don't
         * want to send a group parameter.
         */
        groupParam: 'group',

        /**
         * @cfg {String} sortParam
         * The name of the `sort` parameter to send in a request. Set this to `undefined` if you don't
         * want to send a sort parameter.
         */
        sortParam: 'sort',

        /**
         * @cfg {String} filterParam
         * The name of the 'filter' parameter to send in a request. Set this to `undefined` if you don't
         * want to send a filter parameter.
         */
        filterParam: 'filter',

        /**
         * @cfg {String} directionParam
         * The name of the direction parameter to send in a request.
         *
         * __Note:__ This is only used when `simpleSortMode` is set to `true`.
         */
        directionParam: 'dir',

        /**
         * @cfg {Boolean} enablePagingParams This can be set to `false` if you want to prevent the paging params to be
         * sent along with the requests made by this proxy.
         */
        enablePagingParams: true,

        /**
         * @cfg {Boolean} simpleSortMode
         * Enabling `simpleSortMode` in conjunction with `remoteSort` will only send one sort property and a direction when a
         * remote sort is requested. The `directionParam` and `sortParam` will be sent with the property name and either 'ASC'
         * or 'DESC'.
         */
        simpleSortMode: false,

        /**
         * @cfg {Boolean} noCache
         * Disable caching by adding a unique parameter name to the request. Set to `false` to allow caching.
         */
        noCache : true,

        /**
         * @cfg {String} cacheString
         * The name of the cache param added to the url when using `noCache`.
         */
        cacheString: "_dc",

        /**
         * @cfg {Number} timeout
         * The number of milliseconds to wait for a response.
         */
        timeout : 30000,

        /**
         * @cfg {Object} api
         * Specific urls to call on CRUD action methods "create", "read", "update" and "destroy". Defaults to:
         *
         *     api: {
         *         create  : undefined,
         *         read    : undefined,
         *         update  : undefined,
         *         destroy : undefined
         *     }
         *
         * The url is built based upon the action being executed [create|read|update|destroy] using the commensurate
         * {@link #api} property, or if undefined default to the configured
         * {@link Ext.data.Store}.{@link Ext.data.proxy.Server#url url}.
         *
         * For example:
         *
         *     api: {
         *         create  : '/controller/new',
         *         read    : '/controller/load',
         *         update  : '/controller/update',
         *         destroy : '/controller/destroy_action'
         *     }
         *
         * If the specific URL for a given CRUD action is undefined, the CRUD action request will be directed to the
         * configured {@link Ext.data.proxy.Server#url url}.
         */
        api: {
            create  : undefined,
            read    : undefined,
            update  : undefined,
            destroy : undefined
        },

        /**
         * @cfg {Object} extraParams
         * Extra parameters that will be included on every request. Individual requests with params of the same name
         * will override these params when they are in conflict.
         */
        extraParams: {}
    },

    constructor: function(config) {
        config = config || {};
        if (config.nocache !== undefined) {
            config.noCache = config.nocache;
            // <debug>
            Ext.Logger.warn('nocache configuration on Ext.data.proxy.Server has been deprecated. Please use noCache.');
            // </debug>
        }
        this.callParent([config]);
    },

    //in a ServerProxy all four CRUD operations are executed in the same manner, so we delegate to doRequest in each case
    create: function() {
        return this.doRequest.apply(this, arguments);
    },

    read: function() {
        return this.doRequest.apply(this, arguments);
    },

    update: function() {
        return this.doRequest.apply(this, arguments);
    },

    destroy: function() {
        return this.doRequest.apply(this, arguments);
    },

    /**
     * Sets a value in the underlying {@link #extraParams}.
     * @param {String} name The key for the new value
     * @param {Object} value The value
     */
    setExtraParam: function(name, value) {
        this.getExtraParams()[name] = value;
    },

    /**
     * Creates and returns an Ext.data.Request object based on the options passed by the {@link Ext.data.Store Store}
     * that this Proxy is attached to.
     * @param {Ext.data.Operation} operation The {@link Ext.data.Operation Operation} object to execute
     * @return {Ext.data.Request} The request object
     */
    buildRequest: function(operation) {
        var me = this,
            params = Ext.applyIf(operation.getParams() || {}, me.getExtraParams() || {}),
            request;

        //copy any sorters, filters etc into the params so they can be sent over the wire
        params = Ext.applyIf(params, me.getParams(operation));

        request = Ext.create('Ext.data.Request', {
            params   : params,
            action   : operation.getAction(),
            records  : operation.getRecords(),
            url      : operation.getUrl(),
            operation: operation,
            proxy    : me
        });

        request.setUrl(me.buildUrl(request));
        operation.setRequest(request);

        return request;
    },

    /**
     * This method handles the processing of the response and is usually overridden by subclasses to
     * do additional processing.
     * @param {Boolean} success Whether or not this request was successful
     * @param {Ext.data.Operation} operation The operation we made this request for
     * @param {Ext.data.Request} request The request that was made
     * @param {Object} response The response that we got
     * @param {Function} callback The callback to be fired onces the response is processed
     * @param {Object} scope The scope in which we call the callback
     * @protected
     */
    processResponse: function(success, operation, request, response, callback, scope) {
        var me = this,
            action = operation.getAction(),
            reader, resultSet;

        if (success === true) {
            reader = me.getReader();

            try {
                resultSet = reader.process(response);
            } catch(e) {
                operation.setException(e.message);

                me.fireEvent('exception', this, response, operation);
                return;
            }

            // This could happen if the model was configured using metaData
            if (!operation.getModel()) {
                operation.setModel(this.getModel());
            }

            if (operation.process(action, resultSet, request, response) === false) {
                this.fireEvent('exception', this, response, operation);
            }
        } else {
            me.setException(operation, response);
            /**
             * @event exception
             * Fires when the server returns an exception
             * @param {Ext.data.proxy.Proxy} this
             * @param {Object} response The response from the AJAX request
             * @param {Ext.data.Operation} operation The operation that triggered request
             */
            me.fireEvent('exception', this, response, operation);
        }

        //this callback is the one that was passed to the 'read' or 'write' function above
        if (typeof callback == 'function') {
            callback.call(scope || me, operation);
        }

        me.afterRequest(request, success);
    },

    /**
     * Sets up an exception on the operation
     * @private
     * @param {Ext.data.Operation} operation The operation
     * @param {Object} response The response
     */
    setException: function(operation, response) {
        if (Ext.isObject(response)) {
            operation.setException({
                status: response.status,
                statusText: response.statusText
            });
        }
    },

    /**
     * Encode any values being sent to the server. Can be overridden in subclasses.
     * @private
     * @param {Array} value An array of sorters/filters.
     * @return {Object} The encoded value
     */
    applyEncoding: function(value) {
        return Ext.encode(value);
    },

    /**
     * Encodes the array of {@link Ext.util.Sorter} objects into a string to be sent in the request url. By default,
     * this simply JSON-encodes the sorter data
     * @param {Ext.util.Sorter[]} sorters The array of {@link Ext.util.Sorter Sorter} objects
     * @return {String} The encoded sorters
     */
    encodeSorters: function(sorters) {
        var min = [],
            length = sorters.length,
            i = 0;

        for (; i < length; i++) {
            min[i] = {
                property : sorters[i].getProperty(),
                direction: sorters[i].getDirection()
            };
        }
        return this.applyEncoding(min);

    },

    /**
     * Encodes the array of {@link Ext.util.Filter} objects into a string to be sent in the request url. By default,
     * this simply JSON-encodes the filter data
     * @param {Ext.util.Filter[]} filters The array of {@link Ext.util.Filter Filter} objects
     * @return {String} The encoded filters
     */
    encodeFilters: function(filters) {
        var min = [],
            length = filters.length,
            i = 0;

        for (; i < length; i++) {
            min[i] = {
                property: filters[i].getProperty(),
                value   : filters[i].getValue()
            };
        }
        return this.applyEncoding(min);
    },

    /**
     * @private
     * Copy any sorters, filters etc into the params so they can be sent over the wire
     */
    getParams: function(operation) {
        var me = this,
            params = {},
            grouper = operation.getGrouper(),
            sorters = operation.getSorters(),
            filters = operation.getFilters(),
            page = operation.getPage(),
            start = operation.getStart(),
            limit = operation.getLimit(),

            simpleSortMode = me.getSimpleSortMode(),

            pageParam = me.getPageParam(),
            startParam = me.getStartParam(),
            limitParam = me.getLimitParam(),
            groupParam = me.getGroupParam(),
            sortParam = me.getSortParam(),
            filterParam = me.getFilterParam(),
            directionParam = me.getDirectionParam();

        if (me.getEnablePagingParams()) {
            if (pageParam && page !== null) {
                params[pageParam] = page;
            }

            if (startParam && start !== null) {
                params[startParam] = start;
            }

            if (limitParam && limit !== null) {
                params[limitParam] = limit;
            }
        }

        if (groupParam && grouper) {
            // Grouper is a subclass of sorter, so we can just use the sorter method
            params[groupParam] = me.encodeSorters([grouper]);
        }

        if (sortParam && sorters && sorters.length > 0) {
            if (simpleSortMode) {
                params[sortParam] = sorters[0].getProperty();
                params[directionParam] = sorters[0].getDirection();
            } else {
                params[sortParam] = me.encodeSorters(sorters);
            }
        }

        if (filterParam && filters && filters.length > 0) {
            params[filterParam] = me.encodeFilters(filters);
        }

        return params;
    },

    /**
     * Generates a url based on a given Ext.data.Request object. By default, ServerProxy's buildUrl will add the
     * cache-buster param to the end of the url. Subclasses may need to perform additional modifications to the url.
     * @param {Ext.data.Request} request The request object
     * @return {String} The url
     */
    buildUrl: function(request) {
        var me = this,
            url = me.getUrl(request);

        //<debug>
        if (!url) {
            Ext.Logger.error("You are using a ServerProxy but have not supplied it with a url.");
        }
        //</debug>

        if (me.getNoCache()) {
            url = Ext.urlAppend(url, Ext.String.format("{0}={1}", me.getCacheString(), Ext.Date.now()));
        }

        return url;
    },

    /**
     * Get the url for the request taking into account the order of priority,
     * - The request
     * - The api
     * - The url
     * @private
     * @param {Ext.data.Request} request The request
     * @return {String} The url
     */
    getUrl: function(request) {
        return request ? request.getUrl() || this.getApi()[request.getAction()] || this._url : this._url;
    },

    /**
     * In ServerProxy subclasses, the {@link #create}, {@link #read}, {@link #update} and {@link #destroy} methods all
     * pass through to doRequest. Each ServerProxy subclass must implement the doRequest method - see {@link
     * Ext.data.proxy.JsonP} and {@link Ext.data.proxy.Ajax} for examples. This method carries the same signature as
     * each of the methods that delegate to it.
     *
     * @param {Ext.data.Operation} operation The Ext.data.Operation object
     * @param {Function} callback The callback function to call when the Operation has completed
     * @param {Object} scope The scope in which to execute the callback
     * @protected
     * @template
     */
    doRequest: function(operation, callback, scope) {
        //<debug>
        Ext.Logger.error("The doRequest function has not been implemented on your Ext.data.proxy.Server subclass. See src/data/ServerProxy.js for details");
        //</debug>
    },

    /**
     * Optional callback function which can be used to clean up after a request has been completed.
     * @param {Ext.data.Request} request The Request object
     * @param {Boolean} success True if the request was successful
     * @method
     */
    afterRequest: Ext.emptyFn
});
