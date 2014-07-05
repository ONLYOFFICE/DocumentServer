/**
 * @private
 */
Ext.define('Ext.device.connection.Abstract', {
    extend: 'Ext.Evented',

    config: {
        online: false,
        type: null
    },

    /**
     * @property {String} UNKNOWN
     * Text label for a connection type.
     */
    UNKNOWN: 'Unknown connection',

    /**
     * @property {String} ETHERNET
     * Text label for a connection type.
     */
    ETHERNET: 'Ethernet connection',

    /**
     * @property {String} WIFI
     * Text label for a connection type.
     */
    WIFI: 'WiFi connection',

    /**
     * @property {String} CELL_2G
     * Text label for a connection type.
     */
    CELL_2G: 'Cell 2G connection',

    /**
     * @property {String} CELL_3G
     * Text label for a connection type.
     */
    CELL_3G: 'Cell 3G connection',

    /**
     * @property {String} CELL_4G
     * Text label for a connection type.
     */
    CELL_4G: 'Cell 4G connection',

    /**
     * @property {String} NONE
     * Text label for a connection type.
     */
    NONE: 'No network connection',

    /**
     * True if the device is currently online
     * @return {Boolean} online
     */
    isOnline: function() {
        return this.getOnline();
    }

    /**
     * @method getType
     * Returns the current connection type.
     * @return {String} type
     */
});
