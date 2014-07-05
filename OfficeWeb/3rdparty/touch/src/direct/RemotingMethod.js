/**
 * Small utility class used internally to represent a Direct method.
 * @class Ext.direct.RemotingMethod
 * @private
 */
Ext.define('Ext.direct.RemotingMethod', {
    config: {
        name: null,
        params: null,
        formHandler: null,
        len: null,
        ordered: true
    },

    constructor: function(config) {
        this.initConfig(config);
    },

    applyParams: function(params) {
        if (Ext.isNumber(params)) {
            this.setLen(params);
        } else if (Ext.isArray(params)) {
            this.setOrdered(false);

            var ln = params.length,
                ret = [],
                i, param, name;

            for (i = 0; i < ln; i++) {
                param = params[i];
                name = Ext.isObject(param) ? param.name : param;
                ret.push(name);
            }

            return ret;
        }
    },

    getArgs: function(params, paramOrder, paramsAsHash) {
        var args = [],
            i, ln;

        if (this.getOrdered()) {
            if (this.getLen() > 0) {
                // If a paramOrder was specified, add the params into the argument list in that order.
                if (paramOrder) {
                    for (i = 0, ln = paramOrder.length; i < ln; i++) {
                        args.push(params[paramOrder[i]]);
                    }
                } else if (paramsAsHash) {
                    // If paramsAsHash was specified, add all the params as a single object argument.
                    args.push(params);
                }
            }
        } else {
            args.push(params);
        }

        return args;
    },

    /**
     * Takes the arguments for the Direct function and splits the arguments
     * from the scope and the callback.
     * @param {Array} args The arguments passed to the direct call
     * @return {Object} An object with 3 properties, args, callback & scope.
     */
    getCallData: function(args) {
        var me = this,
            data = null,
            len  = me.getLen(),
            params = me.getParams(),
            callback, scope, name;

        if (me.getOrdered()) {
            callback = args[len];
            scope = args[len + 1];
            if (len !== 0) {
                data = args.slice(0, len);
            }
        } else {
            data = Ext.apply({}, args[0]);
            callback = args[1];
            scope = args[2];

            for (name in data) {
                if (data.hasOwnProperty(name)) {
                    if (!Ext.Array.contains(params, name)) {
                        delete data[name];
                    }
                }
            }
        }

        return {
            data: data,
            callback: callback,
            scope: scope
        };
    }
});
