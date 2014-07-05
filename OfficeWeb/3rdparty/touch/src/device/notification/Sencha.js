/**
 * @private
 */
Ext.define('Ext.device.notification.Sencha', {
    extend: 'Ext.device.notification.Abstract',
    requires: ['Ext.device.Communicator'],

    show: function() {
        var config = this.callParent(arguments);

        Ext.device.Communicator.send({
            command: 'Notification#show',
            callbacks: {
                callback: config.callback
            },
            scope  : config.scope,
            title  : config.title,
            message: config.message,
            buttons: config.buttons.join(',') //@todo fix this
        });
    },

    vibrate: function() {
        Ext.device.Communicator.send({
            command: 'Notification#vibrate'
        });
    }
});
