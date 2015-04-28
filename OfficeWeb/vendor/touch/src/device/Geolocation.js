/**
 * Provides access to the native Geolocation API when running on a device. There are three implementations of this API:
 *
 * - Sencha Packager
 * - [PhoneGap](http://docs.phonegap.com/en/1.4.1/phonegap_device_device.md.html)
 * - Browser
 *
 * This class will automatically select the correct implementation depending on the device your application is running on.
 *
 * ## Examples
 *
 * Getting the current location:
 *
 *     Ext.device.Geolocation.getCurrentPosition({
 *         success: function(position) {
 *             console.log(position.coords);
 *         },
 *         failure: function() {
 *             console.log('something went wrong!');
 *         }
 *     });
 *
 * Watching the current location:
 *
 *     Ext.device.Geolocation.watchPosition({
 *         frequency: 3000, // Update every 3 seconds
 *         callback: function(position) {
 *             console.log('Position updated!', position.coords);
 *         },
 *         failure: function() {
 *             console.log('something went wrong!');
 *         }
 *     });
 *
 * @mixins Ext.device.geolocation.Abstract
 *
 * @aside guide native_apis
 */
Ext.define('Ext.device.Geolocation', {
    singleton: true,

    requires: [
        'Ext.device.Communicator',
        'Ext.device.geolocation.Sencha',
        'Ext.device.geolocation.Simulator'
    ],

    constructor: function() {
        var browserEnv = Ext.browser.is;

        if (browserEnv.WebView && browserEnv.Sencha) {
            return Ext.create('Ext.device.geolocation.Sencha');
        }
        else {
            return Ext.create('Ext.device.geolocation.Simulator');
        }
    }
});
