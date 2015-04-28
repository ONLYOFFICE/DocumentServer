/**
 * This class provides you with a cross platform way of listening to when the the orientation changes on the
 * device your application is running on.
 *
 * The {@link Ext.device.Orientation#orientationchange orientationchange} event gets passes the `alpha`, `beta` and
 * `gamma` values.
 *
 * You can find more information about these values and how to use them on the [W3C device orientation specification](http://dev.w3.org/geo/api/spec-source-orientation.html#deviceorientation).
 *
 * ## Example
 *
 * To listen to the device orientation, you can do the following:
 *
*     Ext.device.Orientation.on({
*         scope: this,
*         orientationchange: function(e) {
*             console.log('Alpha: ', e.alpha);
*             console.log('Beta: ', e.beta);
*             console.log('Gamma: ', e.gamma);
*         }
*     });
 *
 * @mixins Ext.device.orientation.Abstract
 * 
 * @aside guide native_apis
 */
Ext.define('Ext.device.Orientation', {
    singleton: true,

    requires: [
        'Ext.device.Communicator',
        'Ext.device.orientation.HTML5',
        'Ext.device.orientation.Sencha'
    ],

    constructor: function() {
        var browserEnv = Ext.browser.is;

        if (browserEnv.Sencha) {
            return Ext.create('Ext.device.orientation.Sencha');
        }
        else {
            return Ext.create('Ext.device.orientation.HTML5');
        }
    }
});
