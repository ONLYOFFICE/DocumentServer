/**
 * 
 *
 * @mixins Ext.device.purchases.Sencha
 * 
 * @aside guide native_apis
 */
Ext.define('Ext.device.Purchases', {
    singleton: true,

    requires: [
        'Ext.device.purchases.Sencha'
    ],

    constructor: function() {
        return Ext.create('Ext.device.purchases.Sencha');
    }
});
