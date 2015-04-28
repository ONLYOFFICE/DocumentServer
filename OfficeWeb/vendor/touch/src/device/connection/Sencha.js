/**
 * @private
 */
Ext.define('Ext.device.connection.Sencha', {
    extend: 'Ext.device.connection.Abstract',

    /**
     * @event onlinechange
     * Fires when the connection status changes.
     * @param {Boolean} online True if you are {@link Ext.device.Connection#isOnline online}
     * @param {String} type The new online {@link Ext.device.Connection#getType type}
     */

    initialize: function() {
        Ext.device.Communicator.send({
            command: 'Connection#watch',
            callbacks: {
                callback: this.onConnectionChange
            },
            scope: this
        });
    },

    onConnectionChange: function(e) {
        this.setOnline(Boolean(e.online));
        this.setType(this[e.type]);

        this.fireEvent('onlinechange', this.getOnline(), this.getType());
    }
});
