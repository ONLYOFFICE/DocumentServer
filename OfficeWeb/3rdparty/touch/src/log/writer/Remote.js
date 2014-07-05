//<feature logger>
Ext.define('Ext.log.writer.Remote', {
    extend: 'Ext.log.writer.Writer',

    requires: [
        'Ext.Ajax'
    ],

    config: {
        batchSendDelay: 100,
        onFailureRetryDelay: 500,
        url: ''
    },

    isSending: false,

    sendingTimer: null,

    constructor: function() {
        this.queue = [];

        this.send = Ext.Function.bind(this.send, this);

        return this.callParent(arguments);
    },

    doWrite: function(event) {
        var queue = this.queue;
        queue.push(event.message);

        if (!this.isSending && this.sendingTimer === null) {
            this.sendingTimer = setTimeout(this.send, this.getBatchSendDelay());
        }
    },

    send: function() {
        var queue = this.queue,
            messages = queue.slice();

        queue.length = 0;

        this.sendingTimer = null;

        if (messages.length > 0) {
            this.doSend(messages);
        }
    },

    doSend: function(messages) {
        var me = this;

        me.isSending = true;

        Ext.Ajax.request({
            url: me.getUrl(),
            method: 'POST',
            params: {
                messages: messages.join("\n")
            },
            success: function(){
                me.isSending = false;
                me.send();
            },
            failure: function() {
                setTimeout(function() {
                    me.doSend(messages);
                }, me.getOnFailureRetryDelay());
            },
            scope: me
        });
    }
});
//</feature>
