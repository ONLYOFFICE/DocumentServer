/**
 * @class Ext.direct.JsonProvider
 *
 * A base provider for communicating using JSON. This is an abstract class
 * and should not be instanced directly.
 * @abstract
 */

Ext.define('Ext.direct.JsonProvider', {
    extend: 'Ext.direct.Provider',

    alias: 'direct.jsonprovider',

    uses: ['Ext.direct.ExceptionEvent'],

    /**
     * Parse the JSON response.
     * @private
     * @param {Object} response The XHR response object.
     * @return {Object} The data in the response.
     */
    parseResponse: function(response) {
        if (!Ext.isEmpty(response.responseText)) {
            if (Ext.isObject(response.responseText)) {
                return response.responseText;
            }
            return Ext.decode(response.responseText);
        }
        return null;
    },

    /**
     * Creates a set of events based on the XHR response.
     * @private
     * @param {Object} response The XHR response.
     * @return {Ext.direct.Event[]} An array of {@link Ext.direct.Event} objects.
     */
    createEvents: function(response) {
        var data = null,
            events = [],
            i = 0,
            ln, event;

        try {
            data = this.parseResponse(response);
        } catch(e) {
            event = Ext.create('Ext.direct.ExceptionEvent', {
                data: e,
                xhr: response,
                code: Ext.direct.Manager.exceptions.PARSE,
                message: 'Error parsing json response: \n\n ' + data
            });
            return [event];
        }

        if (Ext.isArray(data)) {
            for (ln = data.length; i < ln; ++i) {
                events.push(this.createEvent(data[i]));
            }
        } else {
            events.push(this.createEvent(data));
        }
        return events;
    },

    /**
     * Create an event from a response object.
     * @param {Object} response The XHR response object.
     * @return {Ext.direct.Event} The event.
     */
    createEvent: function(response) {
        return Ext.create('direct.' + response.type, response);
    }
});