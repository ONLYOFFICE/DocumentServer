/**
 * @class Ext.data.SortTypes
 * This class defines a series of static methods that are used on a
 * {@link Ext.data.Field} for performing sorting. The methods cast the
 * underlying values into a data type that is appropriate for sorting on
 * that particular field.  If a {@link Ext.data.Field#type} is specified,
 * the `sortType` will be set to a sane default if the `sortType` is not
 * explicitly defined on the field. The `sortType` will make any necessary
 * modifications to the value and return it.
 *
 * - `asText` - Removes any tags and converts the value to a string.
 * - `asUCText` - Removes any tags and converts the value to an uppercase string.
 * - `asUCString` - Converts the value to an uppercase string.
 * - `asDate` - Converts the value into Unix epoch time.
 * - `asFloat` - Converts the value to a floating point number.
 * - `asInt` - Converts the value to an integer number.
 *
 * It is also possible to create a custom `sortType` that can be used throughout
 * an application.
 *
 *     Ext.apply(Ext.data.SortTypes, {
 *         asPerson: function(person){
 *             // expects an object with a first and last name property
 *             return person.lastName.toUpperCase() + person.firstName.toLowerCase();
 *         }
 *     });
 *
 *     Ext.define('Employee', {
 *         extend: 'Ext.data.Model',
 *         config: {
 *             fields: [{
 *                 name: 'person',
 *                 sortType: 'asPerson'
 *             }, {
 *                 name: 'salary',
 *                 type: 'float' // sortType set to asFloat
 *             }]
 *         }
 *     });
 *
 * @singleton
 * @docauthor Evan Trimboli <evan@sencha.com>
 */
Ext.define('Ext.data.SortTypes', {
    singleton: true,

    /**
     * The regular expression used to strip tags.
     * @type {RegExp}
     * @property
     */
    stripTagsRE : /<\/?[^>]+>/gi,

    /**
     * Default sort that does nothing.
     * @param {Object} value The value being converted.
     * @return {Object} The comparison value.
     */
    none : function(value) {
        return value;
    },

    /**
     * Strips all HTML tags to sort on text only.
     * @param {Object} value The value being converted.
     * @return {String} The comparison value.
     */
    asText : function(value) {
        return String(value).replace(this.stripTagsRE, "");
    },

    /**
     * Strips all HTML tags to sort on text only - case insensitive.
     * @param {Object} value The value being converted.
     * @return {String} The comparison value.
     */
    asUCText : function(value) {
        return String(value).toUpperCase().replace(this.stripTagsRE, "");
    },

    /**
     * Case insensitive string.
     * @param {Object} value The value being converted.
     * @return {String} The comparison value.
     */
    asUCString : function(value) {
        return String(value).toUpperCase();
    },

    /**
     * Date sorting.
     * @param {Object} value The value being converted.
     * @return {Number} The comparison value.
     */
    asDate : function(value) {
        if (!value) {
            return 0;
        }
        if (Ext.isDate(value)) {
            return value.getTime();
        }
        return Date.parse(String(value));
    },

    /**
     * Float sorting.
     * @param {Object} value The value being converted.
     * @return {Number} The comparison value.
     */
    asFloat : function(value) {
        value = parseFloat(String(value).replace(/,/g, ""));
        return isNaN(value) ? 0 : value;
    },

    /**
     * Integer sorting.
     * @param {Object} value The value being converted.
     * @return {Number} The comparison value.
     */
    asInt : function(value) {
        value = parseInt(String(value).replace(/,/g, ""), 10);
        return isNaN(value) ? 0 : value;
    }
});