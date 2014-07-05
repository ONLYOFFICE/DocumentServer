/**
 * @private
 */
Ext.define('Ext.device.geolocation.Simulator', {
    extend: 'Ext.device.geolocation.Abstract',
    requires: ['Ext.util.Geolocation'],

    getCurrentPosition: function(config) {
        config = this.callParent([config]);

        Ext.apply(config, {
            autoUpdate: false,
            listeners: {
                scope: this,
                locationupdate: function(geolocation) {
                    if (config.success) {
                        config.success.call(config.scope || this, geolocation.position);
                    }
                },
                locationerror: function() {
                    if (config.failure) {
                        config.failure.call(config.scope || this);
                    }
                }
            }
        });

        this.geolocation = Ext.create('Ext.util.Geolocation', config);
        this.geolocation.updateLocation();

        return config;
    },

    watchPosition: function(config) {
        config = this.callParent([config]);

        Ext.apply(config, {
            listeners: {
                scope: this,
                locationupdate: function(geolocation) {
                    if (config.callback) {
                        config.callback.call(config.scope || this, geolocation.position);
                    }
                },
                locationerror: function() {
                    if (config.failure) {
                        config.failure.call(config.scope || this);
                    }
                }
            }
        });

        this.geolocation = Ext.create('Ext.util.Geolocation', config);

        return config;
    },

    clearWatch: function() {
        if (this.geolocation) {
            this.geolocation.destroy();
        }

        this.geolocation = null;
    }
});
