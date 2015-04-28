/**
 * @private
 */
Ext.define('Ext.device.push.Sencha', {
    extend: 'Ext.device.push.Abstract',

    register: function() {
        var config = this.callParent(arguments);

        Ext.apply(config, {
            command: 'PushNotification#Register',
            callbacks: {
                success: config.success,
                failure: config.failure,
                received: config.received
            },
            type: config.type
        });

        Ext.device.Communicator.send(config);
    }
});
