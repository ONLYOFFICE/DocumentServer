/**
 * Reusable data formatting functions
 */
Ext.define('Ext.util.Format', {
    requires: [
        'Ext.DateExtras'
    ],

    singleton: true,

    /**
     * The global default date format.
     */
    defaultDateFormat: 'm/d/Y',

    escapeRe: /('|\\)/g,
    trimRe: /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g,
    formatRe: /\{(\d+)\}/g,
    escapeRegexRe: /([-.*+?^${}()|[\]\/\\])/g,
    dashesRe: /-/g,
    iso8601TestRe: /\d\dT\d\d/,
    iso8601SplitRe: /[- :T\.Z\+]/,

    /**
     * Truncate a string and add an ellipsis ('...') to the end if it exceeds the specified length.
     * @param {String} value The string to truncate.
     * @param {Number} length The maximum length to allow before truncating.
     * @param {Boolean} word True to try to find a common word break.
     * @return {String} The converted text.
     */
    ellipsis: function(value, len, word) {
        if (value && value.length > len) {
            if (word) {
                var vs = value.substr(0, len - 2),
                index = Math.max(vs.lastIndexOf(' '), vs.lastIndexOf('.'), vs.lastIndexOf('!'), vs.lastIndexOf('?'));
                if (index != -1 && index >= (len - 15)) {
                    return vs.substr(0, index) + "...";
                }
            }
            return value.substr(0, len - 3) + "...";
        }
        return value;
    },

    /**
     * Escapes the passed string for use in a regular expression.
     * @param {String} str
     * @return {String}
     */
    escapeRegex: function(s) {
        return s.replace(Ext.util.Format.escapeRegexRe, "\\$1");
    },

    /**
     * Escapes the passed string for ' and \.
     * @param {String} string The string to escape.
     * @return {String} The escaped string.
     */
    escape: function(string) {
        return string.replace(Ext.util.Format.escapeRe, "\\$1");
    },

    /**
     * Utility function that allows you to easily switch a string between two alternating values.  The passed value
     * is compared to the current string, and if they are equal, the other value that was passed in is returned.  If
     * they are already different, the first value passed in is returned.
     *
     * __Note:__ This method returns the new value but does not change the current string.
     *
     *     // alternate sort directions
     *     sort = Ext.util.Format.toggle(sort, 'ASC', 'DESC');
     *
     *     // instead of conditional logic:
     *     sort = (sort === 'ASC' ? 'DESC' : 'ASC');
     *
     * @param {String} string The current string
     * @param {String} value The value to compare to the current string
     * @param {String} other The new value to use if the string already equals the first value passed in
     * @return {String} The new value
     */
    toggle: function(string, value, other) {
        return string == value ? other : value;
    },

    /**
     * Trims whitespace from either end of a string, leaving spaces within the string intact.  Example:
     *
     *     var s = '  foo bar  ';
     *     alert('-' + s + '-'); // alerts "-  foo bar  -"
     *     alert('-' + Ext.util.Format.trim(s) + '-'); // alerts "-foo bar-"
     *
     * @param {String} string The string to escape
     * @return {String} The trimmed string
     */
    trim: function(string) {
        return string.replace(Ext.util.Format.trimRe, "");
    },

    /**
     * Pads the left side of a string with a specified character.  This is especially useful
     * for normalizing number and date strings.  Example usage:
     *
     *     var s = Ext.util.Format.leftPad('123', 5, '0');
     *     // s now contains the string: '00123'
     *
     * @param {String} string The original string.
     * @param {Number} size The total length of the output string.
     * @param {String} [char=' '] (optional) The character with which to pad the original string.
     * @return {String} The padded string.
     */
    leftPad: function (val, size, ch) {
        var result = String(val);
        ch = ch || " ";
        while (result.length < size) {
            result = ch + result;
        }
        return result;
    },

    /**
     * Allows you to define a tokenized string and pass an arbitrary number of arguments to replace the tokens.  Each
     * token must be unique, and must increment in the format {0}, {1}, etc.  Example usage:
     *
     *     var cls = 'my-class', text = 'Some text';
     *     var s = Ext.util.Format.format('<div class="{0}">{1}</div>', cls, text);
     *     // s now contains the string: '<div class="my-class">Some text</div>'
     *
     * @param {String} string The tokenized string to be formatted.
     * @param {String...} values The values to replace token {0}, {1}, etc.
     * @return {String} The formatted string.
     */
    format: function (format) {
        var args = Ext.toArray(arguments, 1);
        return format.replace(Ext.util.Format.formatRe, function(m, i) {
            return args[i];
        });
    },

    /**
     * Convert certain characters (&, <, >, and ') to their HTML character equivalents for literal display in web pages.
     * @param {String} value The string to encode.
     * @return {String} The encoded text.
     */
    htmlEncode: function(value) {
        return ! value ? value: String(value).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
    },

    /**
     * Convert certain characters (&, <, >, and ') from their HTML character equivalents.
     * @param {String} value The string to decode.
     * @return {String} The decoded text.
     */
    htmlDecode: function(value) {
        return ! value ? value: String(value).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
    },

    /**
     * Parse a value into a formatted date using the specified format pattern.
     * @param {String/Date} value The value to format. Strings must conform to the format expected by the JavaScript
     * Date object's [parse() method](http://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/parse).
     * @param {String} [format='m/d/Y'] (optional) Any valid date format string.
     * @return {String} The formatted date string.
     */
    date: function(value, format) {
        var date = value;
        if (!value) {
            return "";
        }
        if (!Ext.isDate(value)) {
            date = new Date(Date.parse(value));
            if (isNaN(date)) {
                // Dates with ISO 8601 format are not well supported by mobile devices, this can work around the issue.
                if (this.iso8601TestRe.test(value)) {
                    date = value.split(this.iso8601SplitRe);
                    date = new Date(date[0], date[1]-1, date[2], date[3], date[4], date[5]);
                }
                if (isNaN(date)) {
                    // Dates with the format "2012-01-20" fail, but "2012/01/20" work in some browsers. We'll try and
                    // get around that.
                    date = new Date(Date.parse(value.replace(this.dashesRe, "/")));
                    //<debug>
                    if (isNaN(date)) {
                        Ext.Logger.error("Cannot parse the passed value " + value + " into a valid date");
                    }
                    //</debug>
                }
            }
            value = date;
        }
        return Ext.Date.format(value, format || Ext.util.Format.defaultDateFormat);
    }
});
