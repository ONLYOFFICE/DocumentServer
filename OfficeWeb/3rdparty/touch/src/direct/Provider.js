/**
 * Ext.direct.Provider is an abstract class meant to be extended.
 *
 * For example Ext JS implements the following subclasses:
 *
 *     Provider
 *     |
 *     +---{@link Ext.direct.JsonProvider JsonProvider}
 *         |
 *         +---{@link Ext.direct.PollingProvider PollingProvider}
 *         |
 *         +---{@link Ext.direct.RemotingProvider RemotingProvider}
 *
 * @abstract
 */
Ext.define('Ext.direct.Provider', {
    alias: 'direct.provider',

    mixins: {
        observable: 'Ext.mixin.Observable'
    },

    config: {
        /**
         * @cfg {String} id
         * The unique id of the provider (defaults to an auto-assigned id).
         * You should assign an id if you need to be able to access the provider later and you do
         * not have an object reference available, for example:
         *
         *     Ext.direct.Manager.addProvider({
         *         type: 'polling',
         *         url:  'php/poll.php',
         *         id:   'poll-provider'
         *     });
         *     var p = {@link Ext.direct.Manager}.{@link Ext.direct.Manager#getProvider getProvider}('poll-provider');
         *     p.disconnect();
         *
         */
        id: undefined
    },

    /**
     * @event connect
     * Fires when the Provider connects to the server-side
     * @param {Ext.direct.Provider} provider The {@link Ext.direct.Provider Provider}.
     */

    /**
     * @event disconnect
     * Fires when the Provider disconnects from the server-side
     * @param {Ext.direct.Provider} provider The {@link Ext.direct.Provider Provider}.
     */

    /**
     * @event data
     * Fires when the Provider receives data from the server-side
     * @param {Ext.direct.Provider} provider The {@link Ext.direct.Provider Provider}.
     * @param {Ext.direct.Event} e The Ext.direct.Event type that occurred.
     */

    /**
     * @event exception
     * Fires when the Provider receives an exception from the server-side
     */

    constructor : function(config){
        this.initConfig(config);
    },

    applyId: function(id) {
        if (id === undefined) {
            id = this.getUniqueId();
        }
        return id;
    },

    /**
     * Returns whether or not the server-side is currently connected.
     * Abstract method for subclasses to implement.
     * @return {Boolean}
     */
    isConnected: function() {
        return false;
    },

    /**
     * Abstract methods for subclasses to implement.
     * @method
     */
    connect: Ext.emptyFn,

    /**
     * Abstract methods for subclasses to implement.
     * @method
     */
    disconnect: Ext.emptyFn
});
