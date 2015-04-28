/**
 * This class is used to write {@link Ext.data.Model} data to the server in a JSON format.
 * The {@link #allowSingle} configuration can be set to false to force the records to always be
 * encoded in an array, even if there is only a single record being sent.
 */
Ext.define('Ext.data.writer.Json', {
    extend: 'Ext.data.writer.Writer',
    alternateClassName: 'Ext.data.JsonWriter',
    alias: 'writer.json',

    config: {
        /**
         * @cfg {String} rootProperty
         * The key under which the records in this Writer will be placed. If you specify {@link #encode} to be true,
         * we default this to 'records'.
         *
         * Example generated request, using root: 'records':
         *
         *     {'records': [{name: 'my record'}, {name: 'another record'}]}
         *
         */
        rootProperty: undefined,

        /**
         * @cfg {Boolean} encode
         * True to use Ext.encode() on the data before sending. The encode option should only be set to true when a
         * {@link #root} is defined, because the values will be sent as part of the request parameters as opposed to
         * a raw post. The root will be the name of the parameter sent to the server.
         */
        encode: false,

        /**
         * @cfg {Boolean} allowSingle
         * False to ensure that records are always wrapped in an array, even if there is only one record being sent.
         * When there is more than one record, they will always be encoded into an array.
         *
         * Example:
         *
         *     // with allowSingle: true
         *     "root": {
         *         "first": "Mark",
         *         "last": "Corrigan"
         *     }
         *
         *     // with allowSingle: false
         *     "root": [{
         *         "first": "Mark",
         *         "last": "Corrigan"
         *     }]
         */
        allowSingle: true,

        encodeRequest: false
    },

    applyRootProperty: function(root) {
        if (!root && (this.getEncode() || this.getEncodeRequest())) {
            root = 'data';
        }
        return root;
    },

    //inherit docs
    writeRecords: function(request, data) {
        var root = this.getRootProperty(),
            params = request.getParams(),
            allowSingle = this.getAllowSingle(),
            jsonData;

        if (this.getAllowSingle() && data && data.length == 1) {
            // convert to single object format
            data = data[0];
        }

        if (this.getEncodeRequest()) {
            jsonData = request.getJsonData() || {};
            if (data && (data.length || (allowSingle && Ext.isObject(data)))) {
                jsonData[root] = data;
            }
            request.setJsonData(Ext.apply(jsonData, params || {}));
            request.setParams(null);
            request.setMethod('POST');
            return request;
        }

        if (!data || !(data.length || (allowSingle && Ext.isObject(data)))) {
            return request;
        }

        if (this.getEncode()) {
            if (root) {
                // sending as a param, need to encode
                params[root] = Ext.encode(data);
            } else {
                //<debug>
                Ext.Logger.error('Must specify a root when using encode');
                //</debug>
            }
        } else {
            // send as jsonData
            jsonData = request.getJsonData() || {};
            if (root) {
                jsonData[root] = data;
            } else {
                jsonData = data;
            }
            request.setJsonData(jsonData);
        }
        return request;
    }

    //<deprecated product=touch since=2.0.1>
}, function() {
    /**
     * @cfg {String} root
     * The key under which the records in this Writer will be placed. If you specify {@link #encode} to be true,
     * we default this to 'records'.
     *
     * Example generated request, using root: 'records':
     *
     *     {'records': [{name: 'my record'}, {name: 'another record'}]}
     *
     * @deprecated 2.0.1 Please use the {@link #rootProperty} configuration instead.
     */
    this.override({
        constructor: function(config) {
            config = config || {};

            if (config.root) {
                // <debug>
                Ext.Logger.deprecate('root has been deprecated as a configuration on Writer. Please use rootProperty instead.');
                // </debug>

                config.rootProperty = config.root;
                delete config.root;
            }

            this.callOverridden([config]);
        }
    });
    //</deprecated>
});


/*
 * @allowSingle: true
 * @encodeRequest: false
 * Url: update.json?param1=test
 * {'field1': 'test': 'field2': 'test'}
 *
 * @allowSingle: false
 * @encodeRequest: false
 * Url: update.json?param1=test
 * [{'field1': 'test', 'field2': 'test'}]
 *
 * @allowSingle: true
 * @root: 'data'
 * @encodeRequest: true
 * Url: update.json
 * {
 *    'param1': 'test',
 *    'data': {'field1': 'test', 'field2': 'test'}
 * }
 *
 * @allowSingle: false
 * @root: 'data'
 * @encodeRequest: true
 * Url: update.json
 * {
 *     'param1': 'test',
 *     'data': [{'field1': 'test', 'field2': 'test'}]
 * }
 *
 * @allowSingle: true
 * @root: data
 * @encodeRequest: false
 * Url: update.json
 * param1=test&data={'field1': 'test', 'field2': 'test'}
 *
 * @allowSingle: false
 * @root: data
 * @encodeRequest: false
 * @ncode: true
 * Url: update.json
 * param1=test&data=[{'field1': 'test', 'field2': 'test'}]
 *
 * @allowSingle: true
 * @root: data
 * @encodeRequest: false
 * Url: update.json?param1=test&data={'field1': 'test', 'field2': 'test'}
 *
 * @allowSingle: false
 * @root: data
 * @encodeRequest: false
 * Url: update.json?param1=test&data=[{'field1': 'test', 'field2': 'test'}]
 */
