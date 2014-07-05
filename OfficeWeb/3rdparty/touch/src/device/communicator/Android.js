/**
 * @private
 */
Ext.define('Ext.device.communicator.Android', {
    extend: 'Ext.device.communicator.Default',

    doSend: function(args) {
        window.Sencha.action(JSON.stringify(args));
    }
});
