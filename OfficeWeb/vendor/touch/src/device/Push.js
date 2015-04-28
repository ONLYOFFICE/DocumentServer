/**
 * Provides a way to send push notifications to a device. Currently only available on iOS.
 *
 * # Example
 *
 *     Ext.device.Push.register({
 *         type: Ext.device.Push.ALERT|Ext.device.Push.BADGE|Ext.device.Push.SOUND,
 *         success: function(token) {
 *             console.log('# Push notification registration successful:');
 *             console.log('    token: ' + token);
 *         },
 *         failure: function(error) {
 *             console.log('# Push notification registration unsuccessful:');
 *             console.log('     error: ' + error);
 *         },
 *         received: function(notifications) {
 *             console.log('# Push notification received:');
 *             console.log('    ' + JSON.stringify(notifications));
 *         }
 *     });
 *
 * @mixins Ext.device.push.Abstract
 *
 * @aside guide native_apis
 */
Ext.define('Ext.device.Push', {
    singleton: true,

    requires: [
        'Ext.device.Communicator',
        'Ext.device.push.Sencha'
    ],

    constructor: function() {
        var browserEnv = Ext.browser.is;

        if (browserEnv.WebView) {
            if (!browserEnv.PhoneGap) {
                return Ext.create('Ext.device.push.Sencha');
            }
            else {
                return Ext.create('Ext.device.push.Abstract');
            }
        }
        else {
            return Ext.create('Ext.device.push.Abstract');
        }
    }
});
