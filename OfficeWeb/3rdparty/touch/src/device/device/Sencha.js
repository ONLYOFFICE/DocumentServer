/**
 * @private
 */
Ext.define('Ext.device.device.Sencha', {
    extend: 'Ext.device.device.Abstract',

    constructor: function() {
        this.name = device.name;
        this.uuid = device.uuid;
        this.platform = device.platformName || Ext.os.name;

        this.initURL();
    },

    openURL: function(url) {
        Ext.device.Communicator.send({
            command: 'OpenURL#open',
            url: url
        });
    },

    /**
     * @private
     */
    initURL: function() {
        Ext.device.Communicator.send({
            command: "OpenURL#watch",
            callbacks: {
                callback: this.updateURL
            },
            scope: this
        });
    },

    /**
     * @private
     */
    updateURL: function() {
        this.scheme = device.scheme || false;
        this.fireEvent('schemeupdate', this, this.scheme);
    }
});
