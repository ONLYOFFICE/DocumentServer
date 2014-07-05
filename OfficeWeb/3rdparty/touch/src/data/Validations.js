/**
 * @author Ed Spencer
 * @aside guide models
 *
 * This singleton contains a set of validation functions that can be used to validate any type of data. They are most
 * often used in {@link Ext.data.Model Models}, where they are automatically set up and executed.
 */
Ext.define('Ext.data.Validations', {
    alternateClassName: 'Ext.data.validations',

    singleton: true,

    config: {
        /**
         * @property {String} presenceMessage
         * The default error message used when a presence validation fails.
         */
        presenceMessage: 'must be present',

        /**
         * @property {String} lengthMessage
         * The default error message used when a length validation fails.
         */
        lengthMessage: 'is the wrong length',

        /**
         * @property {Boolean} formatMessage
         * The default error message used when a format validation fails.
         */
        formatMessage: 'is the wrong format',

        /**
         * @property {String} inclusionMessage
         * The default error message used when an inclusion validation fails.
         */
        inclusionMessage: 'is not included in the list of acceptable values',

        /**
         * @property {String} exclusionMessage
         * The default error message used when an exclusion validation fails.
         */
        exclusionMessage: 'is not an acceptable value',

        /**
         * @property {String} emailMessage
         * The default error message used when an email validation fails
         */
        emailMessage: 'is not a valid email address'
    },

    constructor: function(config) {
        this.initConfig(config);
    },

    /**
     * Returns the configured error message for any of the validation types.
     * @param {String} type The type of validation you want to get the error message for.
     * @return {Object}
     */
    getMessage: function(type) {
        var getterFn = this['get' + type[0].toUpperCase() + type.slice(1) + 'Message'];
        if (getterFn) {
            return getterFn.call(this);
        }
        return '';
    },

    /**
     * The regular expression used to validate email addresses
     * @property emailRe
     * @type RegExp
     */
    emailRe: /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/,

    /**
     * Validates that the given value is present.
     * For example:
     *
     *     validations: [{type: 'presence', field: 'age'}]
     *
     * @param {Object} config Config object.
     * @param {Object} value The value to validate.
     * @return {Boolean} `true` if validation passed.
     */
    presence: function(config, value) {
        if (arguments.length === 1) {
            value = config;
        }
        return !!value || value === 0;
    },

    /**
     * Returns `true` if the given value is between the configured min and max values.
     * For example:
     *
     *     validations: [{type: 'length', field: 'name', min: 2}]
     *
     * @param {Object} config Config object.
     * @param {String} value The value to validate.
     * @return {Boolean} `true` if the value passes validation.
     */
    length: function(config, value) {
        if (value === undefined || value === null) {
            return false;
        }

        var length = value.length,
            min    = config.min,
            max    = config.max;

        if ((min && length < min) || (max && length > max)) {
            return false;
        } else {
            return true;
        }
    },

    /**
     * Validates that an email string is in the correct format.
     * @param {Object} config Config object.
     * @param {String} email The email address.
     * @return {Boolean} `true` if the value passes validation.
     */
    email: function(config, email) {
        return Ext.data.validations.emailRe.test(email);
    },

    /**
     * Returns `true` if the given value passes validation against the configured `matcher` regex.
     * For example:
     *
     *     validations: [{type: 'format', field: 'username', matcher: /([a-z]+)[0-9]{2,3}/}]
     *
     * @param {Object} config Config object.
     * @param {String} value The value to validate.
     * @return {Boolean} `true` if the value passes the format validation.
     */
    format: function(config, value) {
        if (value === undefined || value === null) {
            value = '';
        }
        return !!(config.matcher && config.matcher.test(value));
    },

    /**
     * Validates that the given value is present in the configured `list`.
     * For example:
     *
     *     validations: [{type: 'inclusion', field: 'gender', list: ['Male', 'Female']}]
     *
     * @param {Object} config Config object.
     * @param {String} value The value to validate.
     * @return {Boolean} `true` if the value is present in the list.
     */
    inclusion: function(config, value) {
        return config.list && Ext.Array.indexOf(config.list,value) != -1;
    },

    /**
     * Validates that the given value is present in the configured `list`.
     * For example:
     *
     *     validations: [{type: 'exclusion', field: 'username', list: ['Admin', 'Operator']}]
     *
     * @param {Object} config Config object.
     * @param {String} value The value to validate.
     * @return {Boolean} `true` if the value is not present in the list.
     */
    exclusion: function(config, value) {
        return config.list && Ext.Array.indexOf(config.list,value) == -1;
    }
});
