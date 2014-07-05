/**
 * Supporting Class for Ext.Direct (not intended to be used directly).
 */
Ext.define('Ext.direct.Transaction', {
    alias: 'direct.transaction',
    alternateClassName: 'Ext.Direct.Transaction',

    statics: {
        TRANSACTION_ID: 0
    },

    config: {
        id: undefined,
        provider: null,
        retryCount: 0,
        args: null,
        action: null,
        method: null,
        data: null,
        callback: null,
        form: null
    },

    constructor: function(config) {
        this.initConfig(config);
    },

    applyId: function(id) {
        if (id === undefined) {
            id = ++this.self.TRANSACTION_ID;
        }
        return id;
    },

    updateId: function(id) {
        this.id = this.tid = id;
    },

    getTid: function() {
        return this.tid;
    },

    send: function(){
         this.getProvider().queueTransaction(this);
    },

    retry: function(){
        this.setRetryCount(this.getRetryCount() + 1);
        this.send();
    }
});