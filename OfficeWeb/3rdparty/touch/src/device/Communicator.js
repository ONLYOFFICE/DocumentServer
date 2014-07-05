/**
 * @private
 */
Ext.define('Ext.device.Communicator', {
    requires: [
        'Ext.device.communicator.Default',
        'Ext.device.communicator.Android'
    ],

    singleton: true,

    constructor: function() {
        if (Ext.os.is.Android) {
            return new Ext.device.communicator.Android();
        }

        return new Ext.device.communicator.Default();
    }
});
