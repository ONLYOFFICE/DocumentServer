/**
 * @private
 */
Ext.define('Ext.device.connection.PhoneGap', {
    extend: 'Ext.device.connection.Abstract',

    syncOnline: function() {
        var type = navigator.network.connection.type;
        this._type = type;
        this._online = type != Connection.NONE;
    },

    getOnline: function() {
        this.syncOnline();
        return this._online;
    },

    getType: function() {
        this.syncOnline();
        return this._type;
    }
});
