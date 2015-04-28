/**
 * This device API allows you to access a users contacts using a {@link Ext.data.Store}. This allows you to search, filter
 * and sort through all the contacts using its methods.
 *
 * To use this API, all you need to do is require this class (`Ext.device.Contacts`) and then use `Ext.device.Contacts.getContacts()`
 * to retrieve an array of contacts.
 *
 * **Please note that this will *only* work using the Sencha Native Packager.**
 * 
 * # Example
 *
 *     Ext.application({
 *         name: 'Sencha',
 *         requires: 'Ext.device.Contacts',
 *
 *         launch: function() {
 *             Ext.Viewport.add({
 *                 xtype: 'list',
 *                 itemTpl: '{First} {Last}',
 *                 store: {
 *                     fields: ['First', 'Last'],
 *                     data: Ext.device.Contacts.getContacts()
 *                 }
 *             });
 *         }
 *     });
 *
 * @mixins Ext.device.contacts.Abstract
 * @mixins Ext.device.contacts.Sencha
 *
 * @aside guide native_apis
 */
Ext.define('Ext.device.Contacts', {
    singleton: true,

    requires: [
        'Ext.device.Communicator',
        'Ext.device.contacts.Sencha'
    ],

    constructor: function() {
        var browserEnv = Ext.browser.is;

        if (browserEnv.WebView && !browserEnv.PhoneGap) {
            return Ext.create('Ext.device.contacts.Sencha');
        } else {
            return Ext.create('Ext.device.contacts.Abstract');
        }
    }
});
