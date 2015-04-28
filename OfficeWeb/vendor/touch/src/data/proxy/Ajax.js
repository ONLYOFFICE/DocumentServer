/**
 * @author Ed Spencer
 * @aside guide proxies
 *
 * AjaxProxy is one of the most widely-used ways of getting data into your application. It uses AJAX
 * requests to load data from the server, usually to be placed into a {@link Ext.data.Store Store}.
 * Let's take a look at a typical setup. Here we're going to set up a Store that has an AjaxProxy.
 * To prepare, we'll also set up a {@link Ext.data.Model Model}:
 *
 *     Ext.define('User', {
 *         extend: 'Ext.data.Model',
 *         config: {
 *             fields: ['id', 'name', 'email']
 *         }
 *     });
 *
 *     // The Store contains the AjaxProxy as an inline configuration
 *     var store = Ext.create('Ext.data.Store', {
 *         model: 'User',
 *         proxy: {
 *             type: 'ajax',
 *             url : 'users.json'
 *         }
 *     });
 *
 *     store.load();
 *
 * Our example is going to load user data into a Store, so we start off by defining a
 * {@link Ext.data.Model Model} with the fields that we expect the server to return. Next we set up
 * the Store itself, along with a {@link Ext.data.Store#proxy proxy} configuration. This
 * configuration was automatically turned into an Ext.data.proxy.Ajax instance, with the url we
 * specified being passed into AjaxProxy's constructor. It's as if we'd done this:
 *
 *     Ext.create('Ext.data.proxy.Ajax', {
 *         config: {
 *             url: 'users.json',
 *             model: 'User',
 *             reader: 'json'
 *         }
 *     });
 *
 * A couple of extra configurations appeared here - {@link #model} and {@link #reader}. These are
 * set by default when we create the proxy via the Store - the Store already knows about the Model,
 * and Proxy's default {@link Ext.data.reader.Reader Reader} is {@link Ext.data.reader.Json JsonReader}.
 *
 * Now when we call store.load(), the AjaxProxy springs into action, making a request to the url we
 * configured ('users.json' in this case). As we're performing a read, it sends a GET request to
 * that url (see {@link #actionMethods} to customize this - by default any kind of read will be sent
 * as a GET request and any kind of write will be sent as a POST request).
 *
 * ## Limitations
 *
 * AjaxProxy cannot be used to retrieve data from other domains. If your application is running on
 * http://domainA.com it cannot load data from http://domainB.com because browsers have a built-in
 * security policy that prohibits domains talking to each other via AJAX.
 *
 * If you need to read data from another domain and can't set up a proxy server (some software that
 * runs on your own domain's web server and transparently forwards requests to http://domainB.com,
 * making it look like they actually came from http://domainA.com), you can use
 * {@link Ext.data.proxy.JsonP} and a technique known as JSON-P (JSON with Padding), which can help
 * you get around the problem so long as the server on http://domainB.com is set up to support
 * JSON-P responses. See {@link Ext.data.proxy.JsonP JsonPProxy}'s introduction docs for more details.
 *
 * ## Readers and Writers
 *
 * AjaxProxy can be configured to use any type of {@link Ext.data.reader.Reader Reader} to decode
 * the server's response. If no Reader is supplied, AjaxProxy will default to using a
 * {@link Ext.data.reader.Json JsonReader}. Reader configuration can be passed in as a simple
 * object, which the Proxy automatically turns into a {@link Ext.data.reader.Reader Reader} instance:
 *
 *     var proxy = Ext.create('Ext.data.proxy.Ajax', {
 *         config: {
 *             model: 'User',
 *             reader: {
 *                 type: 'xml',
 *                 root: 'users'
 *             }
 *         }
 *     });
 *
 *     proxy.getReader(); //returns an {@link Ext.data.reader.Xml XmlReader} instance based on the config we supplied
 *
 * ## Url generation
 *
 * AjaxProxy automatically inserts any sorting, filtering, paging and grouping options into the url
 * it generates for each request. These are controlled with the following configuration options:
 *
 * - {@link #pageParam} - controls how the page number is sent to the server (see also
 *   {@link #startParam} and {@link #limitParam})
 * - {@link #sortParam} - controls how sort information is sent to the server
 * - {@link #groupParam} - controls how grouping information is sent to the server
 * - {@link #filterParam} - controls how filter information is sent to the server
 *
 * Each request sent by AjaxProxy is described by an {@link Ext.data.Operation Operation}. To see
 * how we can customize the generated urls, let's say we're loading the Proxy with the following
 * Operation:
 *
 *     var operation = Ext.create('Ext.data.Operation', {
 *         action: 'read',
 *         page  : 2
 *     });
 *
 * Now we'll issue the request for this Operation by calling {@link #read}:
 *
 *     var proxy = Ext.create('Ext.data.proxy.Ajax', {
 *         url: '/users'
 *     });
 *
 *     proxy.read(operation); // GET /users?page=2
 *
 * Easy enough - the Proxy just copied the page property from the Operation. We can customize how
 * this page data is sent to the server:
 *
 *     var proxy = Ext.create('Ext.data.proxy.Ajax', {
 *         url: '/users',
 *         pageParam: 'pageNumber'
 *     });
 *
 *     proxy.read(operation); // GET /users?pageNumber=2
 *
 * Alternatively, our Operation could have been configured to send start and limit parameters
 * instead of page:
 *
 *     var operation = Ext.create('Ext.data.Operation', {
 *         action: 'read',
 *         start : 50,
 *         limit : 25
 *     });
 *
 *     var proxy = Ext.create('Ext.data.proxy.Ajax', {
 *         url: '/users'
 *     });
 *
 *     proxy.read(operation); // GET /users?start=50&limit;=25
 *
 * Again we can customize this url:
 *
 *     var proxy = Ext.create('Ext.data.proxy.Ajax', {
 *         url: '/users',
 *         startParam: 'startIndex',
 *         limitParam: 'limitIndex'
 *     });
 *
 *     proxy.read(operation); // GET /users?startIndex=50&limitIndex;=25
 *
 * AjaxProxy will also send sort and filter information to the server. Let's take a look at how this
 * looks with a more expressive Operation object:
 *
 *     var operation = Ext.create('Ext.data.Operation', {
 *         action: 'read',
 *         sorters: [
 *             Ext.create('Ext.util.Sorter', {
 *                 property : 'name',
 *                 direction: 'ASC'
 *             }),
 *             Ext.create('Ext.util.Sorter', {
 *                 property : 'age',
 *                 direction: 'DESC'
 *             })
 *         ],
 *         filters: [
 *             Ext.create('Ext.util.Filter', {
 *                 property: 'eyeColor',
 *                 value   : 'brown'
 *             })
 *         ]
 *     });
 *
 * This is the type of object that is generated internally when loading a {@link Ext.data.Store Store}
 * with sorters and filters defined. By default the AjaxProxy will JSON encode the sorters and
 * filters, resulting in something like this (note that the url is escaped before sending the
 * request, but is left unescaped here for clarity):
 *
 *     var proxy = Ext.create('Ext.data.proxy.Ajax', {
 *         url: '/users'
 *     });
 *
 *     proxy.read(operation); // GET /users?sort=[{"property":"name","direction":"ASC"},{"property":"age","direction":"DESC"}]&filter;=[{"property":"eyeColor","value":"brown"}]
 *
 * We can again customize how this is created by supplying a few configuration options. Let's say
 * our server is set up to receive sorting information is a format like "sortBy=name#ASC,age#DESC".
 * We can configure AjaxProxy to provide that format like this:
 *
 *      var proxy = Ext.create('Ext.data.proxy.Ajax', {
 *          url: '/users',
 *          sortParam: 'sortBy',
 *          filterParam: 'filterBy',
 *
 *          // our custom implementation of sorter encoding - turns our sorters into "name#ASC,age#DESC"
 *          encodeSorters: function(sorters) {
 *              var length   = sorters.length,
 *                  sortStrs = [],
 *                  sorter, i;
 *
 *              for (i = 0; i < length; i++) {
 *                  sorter = sorters[i];
 *
 *                  sortStrs[i] = sorter.property + '#' + sorter.direction;
 *              }
 *
 *              return sortStrs.join(",");
 *          }
 *      });
 *
 *      proxy.read(operation); // GET /users?sortBy=name#ASC,age#DESC&filterBy;=[{"property":"eyeColor","value":"brown"}]
 *
 * We can also provide a custom {@link #encodeFilters} function to encode our filters.
 *
 * @constructor
 * Note that if this HttpProxy is being used by a {@link Ext.data.Store Store}, then the Store's
 * call to {@link Ext.data.Store#method-load load} will override any specified callback and params
 * options. In this case, use the {@link Ext.data.Store Store}'s events to modify parameters, or
 * react to loading events.
 *
 * @param {Object} config (optional) Config object.
 * If an options parameter is passed, the singleton {@link Ext.Ajax} object will be used to
 * make the request.
 */
Ext.define('Ext.data.proxy.Ajax', {
    extend: 'Ext.data.proxy.Server',

    requires: ['Ext.util.MixedCollection', 'Ext.Ajax'],
    alias: 'proxy.ajax',
    alternateClassName: ['Ext.data.HttpProxy', 'Ext.data.AjaxProxy'],

    config: {
        /**
         * @cfg {Boolean} withCredentials
         * This configuration is sometimes necessary when using cross-origin resource sharing.
         * @accessor
         */
        withCredentials: false,

        /**
         * @cfg {String} username
         * Most oData feeds require basic HTTP authentication. This configuration allows
         * you to specify the username.
         * @accessor
         */
        username: null,

        /**
         * @cfg {String} password
         * Most oData feeds require basic HTTP authentication. This configuration allows
         * you to specify the password.
         * @accessor
         */
        password: null,

        /**
         * @property {Object} actionMethods
         * Mapping of action name to HTTP request method. In the basic AjaxProxy these are set to
         * 'GET' for 'read' actions and 'POST' for 'create', 'update' and 'destroy' actions.
         * The {@link Ext.data.proxy.Rest} maps these to the correct RESTful methods.
         */
        actionMethods: {
            create : 'POST',
            read   : 'GET',
            update : 'POST',
            destroy: 'POST'
        },

        /**
         * @cfg {Object} [headers=undefined]
         * Any headers to add to the Ajax request.
         */
        headers: {}
    },

    /**
     * Performs Ajax request.
     * @protected
     * @param operation
     * @param callback
     * @param scope
     * @return {Object}
     */
    doRequest: function(operation, callback, scope) {
        var me = this,
            writer  = me.getWriter(),
            request = me.buildRequest(operation);

        request.setConfig({
            headers  : me.getHeaders(),
            timeout  : me.getTimeout(),
            method   : me.getMethod(request),
            callback : me.createRequestCallback(request, operation, callback, scope),
            scope    : me,
            proxy    : me
        });

        if (operation.getWithCredentials() || me.getWithCredentials()) {
            request.setWithCredentials(true);
            request.setUsername(me.getUsername());
            request.setPassword(me.getPassword());
        }

        // We now always have the writer prepare the request
        request = writer.write(request);

        Ext.Ajax.request(request.getCurrentConfig());

        return request;
    },

    /**
     * Returns the HTTP method name for a given request. By default this returns based on a lookup on
     * {@link #actionMethods}.
     * @param {Ext.data.Request} request The request object.
     * @return {String} The HTTP method to use (should be one of 'GET', 'POST', 'PUT' or 'DELETE').
     */
    getMethod: function(request) {
        return this.getActionMethods()[request.getAction()];
    },

    /**
     * @private
     * @param {Ext.data.Request} request The Request object.
     * @param {Ext.data.Operation} operation The Operation being executed.
     * @param {Function} callback The callback function to be called when the request completes.
     * This is usually the callback passed to `doRequest`.
     * @param {Object} scope The scope in which to execute the callback function.
     * @return {Function} The callback function.
     */
    createRequestCallback: function(request, operation, callback, scope) {
        var me = this;

        return function(options, success, response) {
            me.processResponse(success, operation, request, response, callback, scope);
        };
    }
});
