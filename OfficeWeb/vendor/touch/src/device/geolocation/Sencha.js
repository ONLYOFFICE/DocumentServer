/**
 * @private
 */
Ext.define('Ext.device.geolocation.Sencha', {
    extend: 'Ext.device.geolocation.Abstract',

    getCurrentPosition: function(config) {
        config = this.callParent([config]);

        Ext.apply(config, {
            command: 'Geolocation#getCurrentPosition',
            callbacks: {
                success: config.success,
                failure: config.failure
            }
        });

        Ext.applyIf(config, {
            scope: this
        });

        delete config.success;
        delete config.failure;

        Ext.device.Communicator.send(config);

        return config;
    },

    watchPosition: function(config) {
        config = this.callParent([config]);

        Ext.apply(config, {
            command: 'Geolocation#watchPosition',
            callbacks: {
                success: config.callback,
                failure: config.failure
            }
        });

        Ext.applyIf(config, {
            scope: this
        });

        delete config.callback;
        delete config.failure;

        Ext.device.Communicator.send(config);

        return config;
    },

    clearWatch: function() {
        Ext.device.Communicator.send({
            command: 'Geolocation#clearWatch'
        });
    }
});
