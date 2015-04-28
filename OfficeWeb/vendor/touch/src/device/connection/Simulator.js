/**
 * @private
 */
Ext.define('Ext.device.connection.Simulator', {
    extend: 'Ext.device.connection.Abstract',

    getOnline: function() {
        this._online = navigator.onLine;
        this._type = Ext.device.Connection.UNKNOWN;
        return this._online;
    }
});
