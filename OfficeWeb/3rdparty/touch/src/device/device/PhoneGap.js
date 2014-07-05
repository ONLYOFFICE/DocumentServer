/**
 * @private
 */
Ext.define('Ext.device.device.PhoneGap', {
    extend: 'Ext.device.device.Abstract',

    constructor: function() {
        // We can't get the device details until the device is ready, so lets wait.
        if (Ext.Viewport.isReady) {
            this.onReady();
        } else {
            Ext.Viewport.on('ready', this.onReady, this, {single: true});
        }
    },

    onReady: function() {
        this.name = device.name;
        this.uuid = device.uuid;
        this.platform = device.platformName || Ext.os.name;
    }
});
