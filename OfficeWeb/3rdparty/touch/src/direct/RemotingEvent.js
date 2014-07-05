/**
 * @class Ext.direct.RemotingEvent
 * An event that is fired when data is received from a
 * {@link Ext.direct.RemotingProvider}. Contains a method to the
 * related transaction for the direct request, see {@link #getTransaction}
 */
Ext.define('Ext.direct.RemotingEvent', {
    extend: 'Ext.direct.Event',

    alias: 'direct.rpc',

    config: {
        name: 'remoting',
        tid: null,
        transaction: null
    },

    /**
     * Get the transaction associated with this event.
     * @return {Ext.direct.Transaction} The transaction
     */
    getTransaction: function() {
        return this._transaction || Ext.direct.Manager.getTransaction(this.getTid());
    }
});