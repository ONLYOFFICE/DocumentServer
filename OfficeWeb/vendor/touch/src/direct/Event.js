/**
 * @class Ext.direct.Event
 * A base class for all Ext.direct events. An event is
 * created after some kind of interaction with the server.
 * The event class is essentially just a data structure
 * to hold a Direct response.
 */
Ext.define('Ext.direct.Event', {
    alias: 'direct.event',

    requires: ['Ext.direct.Manager'],

    config: {
        status: true,

        /**
         * @cfg {Object} data The raw data for this event.
         * @accessor
         */
        data: null,

        /**
         * @cfg {String} name The name of this Event.
         * @accessor
         */
        name: 'event',

        xhr: null,

        code: null,

        message: '',

        result: null,

        transaction: null
    },

    constructor: function(config) {
        this.initConfig(config)
    }
});