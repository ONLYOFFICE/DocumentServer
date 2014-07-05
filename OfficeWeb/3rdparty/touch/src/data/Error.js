/**
 * @author Ed Spencer
 * @class Ext.data.Error
 *
 * This is used when validating a record. The validate method will return an {@link Ext.data.Errors} collection
 * containing Ext.data.Error instances. Each error has a field and a message.
 *
 * Usually this class does not need to be instantiated directly - instances are instead created
 * automatically when {@link Ext.data.Model#validate validate} on a model instance.
 */

Ext.define('Ext.data.Error', {
    config: {
        /**
         * @cfg {String} field
         * The name of the field this error belongs to.
         */
        field: null,

        /**
         * @cfg {String} message
         * The message containing the description of the error.
         */
        message: ''
    },

    constructor: function(config) {
        this.initConfig(config);
    }
});
