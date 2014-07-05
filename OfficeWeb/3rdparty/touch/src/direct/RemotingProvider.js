/**
 * @class Ext.direct.RemotingProvider
 *
 * The {@link Ext.direct.RemotingProvider RemotingProvider} exposes access to
 * server side methods on the client (a remote procedure call (RPC) type of
 * connection where the client can initiate a procedure on the server).
 *
 * This allows for code to be organized in a fashion that is maintainable,
 * while providing a clear path between client and server, something that is
 * not always apparent when using URLs.
 *
 * To accomplish this the server-side needs to describe what classes and methods
 * are available on the client-side. This configuration will typically be
 * outputted by the server-side Ext.Direct stack when the API description is built.
 */
Ext.define('Ext.direct.RemotingProvider', {
    alias: 'direct.remotingprovider',

    extend: 'Ext.direct.JsonProvider',

    requires: [
        'Ext.util.MixedCollection',
        'Ext.util.DelayedTask',
        'Ext.direct.Transaction',
        'Ext.direct.RemotingMethod'
    ],

    config: {
        /**
         * @cfg {String/Object} namespace
         * Namespace for the Remoting Provider (defaults to the browser global scope of _window_).
         * Explicitly specify the namespace Object, or specify a String to have a
         * {@link Ext#namespace namespace created} implicitly.
         */
        namespace: undefined,

        /**
         * @cfg {String} url (required) The url to connect to the {@link Ext.direct.Manager} server-side router.
         */
        url: null,

        /**
         * @cfg {String} enableUrlEncode
         * Specify which param will hold the arguments for the method.
         */
        enableUrlEncode: null,

        /**
         * @cfg {Number/Boolean} enableBuffer
         *
         * `true` or `false` to enable or disable combining of method
         * calls. If a number is specified this is the amount of time in milliseconds
         * to wait before sending a batched request.
         *
         * Calls which are received within the specified timeframe will be
         * concatenated together and sent in a single request, optimizing the
         * application by reducing the amount of round trips that have to be made
         * to the server.
         */
        enableBuffer: 10,

        /**
         * @cfg {Number} maxRetries
         * Number of times to re-attempt delivery on failure of a call.
         */
        maxRetries: 1,

        /**
         * @cfg {Number} timeout
         * The timeout to use for each request.
         */
        timeout: undefined,

        /**
         * @cfg {Object} actions
         * Object literal defining the server side actions and methods. For example, if
         * the Provider is configured with:
         *
         *     actions: { // each property within the 'actions' object represents a server side Class
         *         // array of methods within each server side Class to be stubbed out on client
         *         TestAction: [{
         *             name: "doEcho",
         *             len: 1
         *         }, {
         *             "name": "multiply", // name of method
         *             "len": 2            // The number of parameters that will be used to create an
         *                                 // array of data to send to the server side function.
         *                                 // Ensure the server sends back a Number, not a String.
         *         }, {
         *             name: "doForm",
         *             formHandler: true, // direct the client to use specialized form handling method
         *             len: 1
         *         }]
         *     }
         *
         * __Note:__ A Store is not required, a server method can be called at any time.
         * In the following example a **client side** handler is used to call the
         * server side method "multiply" in the server-side "TestAction" Class:
         *
         *     TestAction.multiply(
         *         2, 4, // pass two arguments to server, so specify len=2
         *         // callback function after the server is called
         *         //     result: the result returned by the server
         *         //     e: Ext.direct.RemotingEvent object
         *         function(result, e) {
         *             var t = e.getTransaction();
         *             var action = t.action; // server side Class called
         *             var method = t.method; // server side method called
         *             if (e.getStatus()) {
         *                 var answer = Ext.encode(result); // 8
         *             } else {
         *                 var msg = e.getMessage(); // failure message
         *             }
         *         }
         *     );
         *
         * In the example above, the server side "multiply" function will be passed two
         * arguments (2 and 4).  The "multiply" method should return the value 8 which will be
         * available as the `result` in the example above.
         */
        actions: {}
    },

    /**
     * @event beforecall
     * Fires immediately before the client-side sends off the RPC call.
     * By returning `false` from an event handler you can prevent the call from
     * executing.
     * @param {Ext.direct.RemotingProvider} provider
     * @param {Ext.direct.Transaction} transaction
     * @param {Object} meta The meta data.
     */

    /**
     * @event call
     * Fires immediately after the request to the server-side is sent. This does
     * NOT fire after the response has come back from the call.
     * @param {Ext.direct.RemotingProvider} provider
     * @param {Ext.direct.Transaction} transaction
     * @param {Object} meta The meta data.
     */

    constructor : function(config) {
        var me = this;

        me.callParent(arguments);

        me.transactions = Ext.create('Ext.util.Collection', function(item) {
            return item.getId();
        });
        me.callBuffer = [];
    },

    applyNamespace: function(namespace) {
        if (Ext.isString(namespace)) {
            return Ext.ns(namespace);
        }
        return namespace || window;
    },

    /**
     * Initialize the API
     * @private
     */
    initAPI : function() {
        var actions = this.getActions(),
            namespace = this.getNamespace(),
            action, cls, methods,
            i, ln, method;

        for (action in actions) {
            if (actions.hasOwnProperty(action)) {
                cls = namespace[action];
                if (!cls) {
                    cls = namespace[action] = {};
                }
                methods = actions[action];

                for (i = 0, ln = methods.length; i < ln; ++i) {
                    method = Ext.create('Ext.direct.RemotingMethod', methods[i]);
                    cls[method.getName()] = this.createHandler(action, method);
                }
            }
        }
    },

    /**
     * Create a handler function for a direct call.
     * @private
     * @param {String} action The action the call is for.
     * @param {Object} method The details of the method.
     * @return {Function} A JavaScript function that will kick off the call.
     */
    createHandler : function(action, method) {
        var me = this,
            handler;

        if (!method.getFormHandler()) {
            handler = function() {
                me.configureRequest(action, method, Array.prototype.slice.call(arguments, 0));
            };
        } else {
            handler = function(form, callback, scope) {
                me.configureFormRequest(action, method, form, callback, scope);
            };
        }
        handler.directCfg = {
            action: action,
            method: method
        };
        return handler;
    },

    // @inheritdoc
    isConnected: function() {
        return !!this.connected;
    },

    // @inheritdoc
    connect: function() {
        var me = this;

        if (me.getUrl()) {
            me.initAPI();
            me.connected = true;
            me.fireEvent('connect', me);
        } else {
            //<debug>
            Ext.Error.raise('Error initializing RemotingProvider, no url configured.');
            //</debug>
        }
    },

    // @inheritdoc
    disconnect: function() {
        var me = this;

        if (me.connected) {
            me.connected = false;
            me.fireEvent('disconnect', me);
        }
    },

    /**
     * Run any callbacks related to the transaction.
     * @private
     * @param {Ext.direct.Transaction} transaction The transaction
     * @param {Ext.direct.Event} event The event
     */
    runCallback: function(transaction, event) {
        var success = !!event.getStatus(),
            functionName = success ? 'success' : 'failure',
            callback = transaction && transaction.getCallback(),
            result;

        if (callback) {
            // this doesnt make any sense. why do we have both result and data?
            // result = Ext.isDefined(event.getResult()) ? event.result : event.data;
            result = event.getResult();
            if (Ext.isFunction(callback)) {
                callback(result, event, success);
            } else {
                Ext.callback(callback[functionName], callback.scope, [result, event, success]);
                Ext.callback(callback.callback, callback.scope, [result, event, success]);
            }
        }
    },

    /**
     * React to the AJAX request being completed.
     * @private
     */
    onData: function(options, success, response) {
        var me = this,
            i = 0,
            ln, events, event,
            transaction, transactions;

        if (success) {
            events = me.createEvents(response);
            for (ln = events.length; i < ln; ++i) {
                event = events[i];
                transaction = me.getTransaction(event);
                me.fireEvent('data', me, event);
                if (transaction) {
                    me.runCallback(transaction, event, true);
                    Ext.direct.Manager.removeTransaction(transaction);
                }
            }
        } else {
            transactions = [].concat(options.transaction);
            for (ln = transactions.length; i < ln; ++i) {
                transaction = me.getTransaction(transactions[i]);
                if (transaction && transaction.getRetryCount() < me.getMaxRetries()) {
                    transaction.retry();
                } else {
                    event = Ext.create('Ext.direct.ExceptionEvent', {
                        data: null,
                        transaction: transaction,
                        code: Ext.direct.Manager.exceptions.TRANSPORT,
                        message: 'Unable to connect to the server.',
                        xhr: response
                    });

                    me.fireEvent('data', me, event);
                    if (transaction) {
                        me.runCallback(transaction, event, false);
                        Ext.direct.Manager.removeTransaction(transaction);
                    }
                }
            }
        }
    },

    /**
     * Get transaction from XHR options.
     * @private
     * @param {Object} options The options sent to the AJAX request.
     * @return {Ext.direct.Transaction/null} The transaction, `null` if not found.
     */
    getTransaction: function(options) {
        return options && options.getTid ? Ext.direct.Manager.getTransaction(options.getTid()) : null;
    },

    /**
     * Configure a direct request.
     * @private
     * @param {String} action The action being executed.
     * @param {Object} method The being executed.
     */
    configureRequest: function(action, method, args) {
        var me = this,
            callData = method.getCallData(args),
            data = callData.data,
            callback = callData.callback,
            scope = callData.scope,
            transaction;

        transaction = Ext.create('Ext.direct.Transaction', {
            provider: me,
            args: args,
            action: action,
            method: method.getName(),
            data: data,
            callback: scope && Ext.isFunction(callback) ? Ext.Function.bind(callback, scope) : callback
        });

        if (me.fireEvent('beforecall', me, transaction, method) !== false) {
            Ext.direct.Manager.addTransaction(transaction);
            me.queueTransaction(transaction);
            me.fireEvent('call', me, transaction, method);
        }
    },

    /**
     * Gets the AJAX call info for a transaction.
     * @private
     * @param {Ext.direct.Transaction} transaction The transaction.
     * @return {Object} The call params.
     */
    getCallData: function(transaction) {
        return {
            action: transaction.getAction(),
            method: transaction.getMethod(),
            data: transaction.getData(),
            type: 'rpc',
            tid: transaction.getId()
        };
    },

    /**
     * Sends a request to the server.
     * @private
     * @param {Object/Array} data The data to send.
     */
    sendRequest : function(data) {
        var me = this,
            request = {
                url: me.getUrl(),
                callback: me.onData,
                scope: me,
                transaction: data,
                timeout: me.getTimeout()
            }, callData,
            enableUrlEncode = me.getEnableUrlEncode(),
            i = 0,
            ln, params;


        if (Ext.isArray(data)) {
            callData = [];
            for (ln = data.length; i < ln; ++i) {
                callData.push(me.getCallData(data[i]));
            }
        } else {
            callData = me.getCallData(data);
        }

        if (enableUrlEncode) {
            params = {};
            params[Ext.isString(enableUrlEncode) ? enableUrlEncode : 'data'] = Ext.encode(callData);
            request.params = params;
        } else {
            request.jsonData = callData;
        }
        Ext.Ajax.request(request);
    },

    /**
     * Add a new transaction to the queue.
     * @private
     * @param {Ext.direct.Transaction} transaction The transaction.
     */
    queueTransaction: function(transaction) {
        var me = this,
            enableBuffer = me.getEnableBuffer();

        if (transaction.getForm()) {
            me.sendFormRequest(transaction);
            return;
        }

        me.callBuffer.push(transaction);
        if (enableBuffer) {
            if (!me.callTask) {
                me.callTask = Ext.create('Ext.util.DelayedTask', me.combineAndSend, me);
            }
            me.callTask.delay(Ext.isNumber(enableBuffer) ? enableBuffer : 10);
        } else {
            me.combineAndSend();
        }
    },

    /**
     * Combine any buffered requests and send them off.
     * @private
     */
    combineAndSend : function() {
        var buffer = this.callBuffer,
            ln = buffer.length;

        if (ln > 0) {
            this.sendRequest(ln == 1 ? buffer[0] : buffer);
            this.callBuffer = [];
        }
    }

//    /**
//     * Configure a form submission request.
//     * @private
//     * @param {String} action The action being executed.
//     * @param {Object} method The method being executed.
//     * @param {HTMLElement} form The form being submitted.
//     * @param {Function} callback (optional) A callback to run after the form submits.
//     * @param {Object} scope (optional) A scope to execute the callback in.
//     */
//    configureFormRequest : function(action, method, form, callback, scope){
//        var me = this,
//            transaction = new Ext.direct.Transaction({
//                provider: me,
//                action: action,
//                method: method.name,
//                args: [form, callback, scope],
//                callback: scope && Ext.isFunction(callback) ? Ext.Function.bind(callback, scope) : callback,
//                isForm: true
//            }),
//            isUpload,
//            params;
//
//        if (me.fireEvent('beforecall', me, transaction, method) !== false) {
//            Ext.direct.Manager.addTransaction(transaction);
//            isUpload = String(form.getAttribute("enctype")).toLowerCase() == 'multipart/form-data';
//
//            params = {
//                extTID: transaction.id,
//                extAction: action,
//                extMethod: method.name,
//                extType: 'rpc',
//                extUpload: String(isUpload)
//            };
//
//            // change made from typeof callback check to callback.params
//            // to support addl param passing in DirectSubmit EAC 6/2
//            Ext.apply(transaction, {
//                form: Ext.getDom(form),
//                isUpload: isUpload,
//                params: callback && Ext.isObject(callback.params) ? Ext.apply(params, callback.params) : params
//            });
//            me.fireEvent('call', me, transaction, method);
//            me.sendFormRequest(transaction);
//        }
//    },
//
//    /**
//     * Sends a form request
//     * @private
//     * @param {Ext.direct.Transaction} transaction The transaction to send
//     */
//    sendFormRequest: function(transaction){
//        Ext.Ajax.request({
//            url: this.url,
//            params: transaction.params,
//            callback: this.onData,
//            scope: this,
//            form: transaction.form,
//            isUpload: transaction.isUpload,
//            transaction: transaction
//        });
//    }

});
