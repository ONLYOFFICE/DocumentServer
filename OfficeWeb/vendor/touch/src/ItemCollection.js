/**
 * @private
 */
Ext.define('Ext.ItemCollection', {
    extend: 'Ext.util.MixedCollection',

    getKey: function(item) {
        return item.getItemId();
    },

    has: function(item) {
        return this.map.hasOwnProperty(item.getId());
    }
});
