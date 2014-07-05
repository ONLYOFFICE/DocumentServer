/**
 * @aside guide ajax
 * @singleton
 *
 * This class is used to create JsonP requests. JsonP is a mechanism that allows for making requests for data cross
 * domain. More information is available [here](http://en.wikipedia.org/wiki/JSONP).
 *
 * ## Example
 *
 *     @example preview
 *     Ext.Viewport.add({
 *         xtype: 'button',
 *         text: 'Make JsonP Request',
 *         centered: true,
 *         handler: function(button) {
 *             // Mask the viewport
 *             Ext.Viewport.mask();
 *
 *             // Remove the button
 *             button.destroy();
 *
 *             // Make the JsonP request
 *             Ext.data.JsonP.request({
 *                 url: 'http://free.worldweatheronline.com/feed/weather.ashx',
 *                 callbackKey: 'callback',
 *                 params: {
 *                     key: '23f6a0ab24185952101705',
 *                     q: '94301', // Palo Alto
 *                     format: 'json',
 *                     num_of_days: 5
 *                 },
 *                 success: function(result, request) {
 *                     // Unmask the viewport
 *                     Ext.Viewport.unmask();
 *
 *                     // Get the weather data from the json object result
 *                     var weather = result.data.weather;
 *                     if (weather) {
 *                         // Style the viewport html, and set the html of the max temperature
 *                         Ext.Viewport.setStyleHtmlContent(true);
 *                         Ext.Viewport.setHtml('The temperature in Palo Alto is <b>' + weather[0].tempMaxF + '° F</b>');
 *                     }
 *                 }
 *             });
 *         }
 *     });
 *
 * See the {@link #request} method for more details on making a JsonP request.
 */
Ext.define('Ext.data.JsonP', {
    alternateClassName: 'Ext.util.JSONP',

    /* Begin Definitions */

    singleton: true,


    /* End Definitions */

    /**
     * Number of requests done so far.
     * @private
     */
    requestCount: 0,

    /**
     * Hash of pending requests.
     * @private
     */
    requests: {},

    /**
     * @property {Number} [timeout=30000]
     * A default timeout (in milliseconds) for any JsonP requests. If the request has not completed in this time the failure callback will
     * be fired.
     */
    timeout: 30000,

    /**
     * @property {Boolean} disableCaching
     * `true` to add a unique cache-buster param to requests.
     */
    disableCaching: true,

    /**
     * @property {String} disableCachingParam
     * Change the parameter which is sent went disabling caching through a cache buster.
     */
    disableCachingParam: '_dc',

    /**
     * @property {String} callbackKey
     * Specifies the GET parameter that will be sent to the server containing the function name to be executed when the
     * request completes. Thus, a common request will be in the form of: 
     * `url?callback=Ext.data.JsonP.callback1`
     */
    callbackKey: 'callback',

    /**
     * Makes a JSONP request.
     * @param {Object} options An object which may contain the following properties. Note that options will take
     * priority over any defaults that are specified in the class.
     *
     * @param {String} options.url  The URL to request.
     * @param {Object} [options.params]  An object containing a series of key value pairs that will be sent along with the request.
     * @param {Number} [options.timeout]  See {@link #timeout}
     * @param {String} [options.callbackKey]  See {@link #callbackKey}
     * @param {String} [options.callbackName]  See {@link #callbackKey}
     *   The function name to use for this request. By default this name will be auto-generated: Ext.data.JsonP.callback1,
     *   Ext.data.JsonP.callback2, etc. Setting this option to "my_name" will force the function name to be
     *   Ext.data.JsonP.my_name. Use this if you want deterministic behavior, but be careful - the callbackName should be
     *   different in each JsonP request that you make.
     * @param {Boolean}  [options.disableCaching]  See {@link #disableCaching}
     * @param {String}   [options.disableCachingParam]  See {@link #disableCachingParam}
     * @param {Function} [options.success]  A function to execute if the request succeeds.
     * @param {Function} [options.failure]  A function to execute if the request fails.
     * @param {Function} [options.callback]  A function to execute when the request completes, whether it is a success or failure.
     * @param {Object}   [options.scope]  The scope in which to execute the callbacks: The "this" object for the
     *   callback function. Defaults to the browser window.
     *
     * @return {Object}  request An object containing the request details.
     */
    request: function(options){
        options = Ext.apply({}, options);

        //<debug>
        if (!options.url) {
            Ext.Logger.error('A url must be specified for a JSONP request.');
        }
        //</debug>

        var me = this,
            disableCaching = Ext.isDefined(options.disableCaching) ? options.disableCaching : me.disableCaching,
            cacheParam = options.disableCachingParam || me.disableCachingParam,
            id = ++me.requestCount,
            callbackName = options.callbackName || 'callback' + id,
            callbackKey = options.callbackKey || me.callbackKey,
            timeout = Ext.isDefined(options.timeout) ? options.timeout : me.timeout,
            params = Ext.apply({}, options.params),
            url = options.url,
            name = Ext.isSandboxed ? Ext.getUniqueGlobalNamespace() : 'Ext',
            request,
            script;

        params[callbackKey] = name + '.data.JsonP.' + callbackName;
        if (disableCaching) {
            params[cacheParam] = new Date().getTime();
        }

        script = me.createScript(url, params, options);

        me.requests[id] = request = {
            url: url,
            params: params,
            script: script,
            id: id,
            scope: options.scope,
            success: options.success,
            failure: options.failure,
            callback: options.callback,
            callbackKey: callbackKey,
            callbackName: callbackName
        };

        if (timeout > 0) {
            request.timeout = setTimeout(Ext.bind(me.handleTimeout, me, [request]), timeout);
        }

        me.setupErrorHandling(request);
        me[callbackName] = Ext.bind(me.handleResponse, me, [request], true);
        me.loadScript(request);
        return request;
    },

    /**
     * Abort a request. If the request parameter is not specified all open requests will be aborted.
     * @param {Object/String} request The request to abort.
     */
    abort: function(request){
        var requests = this.requests,
            key;

        if (request) {
            if (!request.id) {
                request = requests[request];
            }
            this.handleAbort(request);
        } else {
            for (key in requests) {
                if (requests.hasOwnProperty(key)) {
                    this.abort(requests[key]);
                }
            }
        }
    },

    /**
     * Sets up error handling for the script.
     * @private
     * @param {Object} request The request.
     */
    setupErrorHandling: function(request){
        request.script.onerror = Ext.bind(this.handleError, this, [request]);
    },

    /**
     * Handles any aborts when loading the script.
     * @private
     * @param {Object} request The request.
     */
    handleAbort: function(request){
        request.errorType = 'abort';
        this.handleResponse(null, request);
    },

    /**
     * Handles any script errors when loading the script.
     * @private
     * @param {Object} request The request.
     */
    handleError: function(request){
        request.errorType = 'error';
        this.handleResponse(null, request);
    },

    /**
     * Cleans up any script handling errors.
     * @private
     * @param {Object} request The request.
     */
    cleanupErrorHandling: function(request){
        request.script.onerror = null;
    },

    /**
     * Handle any script timeouts.
     * @private
     * @param {Object} request The request.
     */
    handleTimeout: function(request){
        request.errorType = 'timeout';
        this.handleResponse(null, request);
    },

    /**
     * Handle a successful response
     * @private
     * @param {Object} result The result from the request
     * @param {Object} request The request
     */
    handleResponse: function(result, request){
        var success = true;

        if (request.timeout) {
            clearTimeout(request.timeout);
        }

        delete this[request.callbackName];
        delete this.requests[request.id];

        this.cleanupErrorHandling(request);
        Ext.fly(request.script).destroy();

        if (request.errorType) {
            success = false;
            Ext.callback(request.failure, request.scope, [request.errorType, request]);
        } else {
            Ext.callback(request.success, request.scope, [result, request]);
        }
        Ext.callback(request.callback, request.scope, [success, result, request.errorType, request]);
    },

    /**
     * Create the script tag given the specified url, params and options. The options
     * parameter is passed to allow an override to access it.
     * @private
     * @param {String} url The url of the request
     * @param {Object} params Any extra params to be sent
     * @param {Object} options The object passed to {@link #request}.
     */
    createScript: function(url, params, options) {
        var script = document.createElement('script');
        script.setAttribute("src", Ext.urlAppend(url, Ext.Object.toQueryString(params)));
        script.setAttribute("async", true);
        script.setAttribute("type", "text/javascript");
        return script;
    },

    /**
     * Loads the script for the given request by appending it to the HEAD element. This is
     * its own method so that users can override it (as well as {@link #createScript}).
     * @private
     * @param request The request object.
     */
    loadScript: function (request) {
        Ext.getHead().appendChild(request.script);
    }
});
