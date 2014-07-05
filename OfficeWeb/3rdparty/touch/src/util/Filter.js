/**
 * Represents a filter that can be applied to a {@link Ext.util.MixedCollection MixedCollection}. Can either simply
 * filter on a property/value pair or pass in a filter function with custom logic. Filters are always used in the
 * context of MixedCollections, though {@link Ext.data.Store Store}s frequently create them when filtering and searching
 * on their records. Example usage:
 *
 *     // Set up a fictional MixedCollection containing a few people to filter on
 *     var allNames = new Ext.util.MixedCollection();
 *     allNames.addAll([
 *         { id: 1, name: 'Ed',    age: 25 },
 *         { id: 2, name: 'Jamie', age: 37 },
 *         { id: 3, name: 'Abe',   age: 32 },
 *         { id: 4, name: 'Aaron', age: 26 },
 *         { id: 5, name: 'David', age: 32 }
 *     ]);
 *
 *     var ageFilter = new Ext.util.Filter({
 *         property: 'age',
 *         value   : 32
 *     });
 *
 *     var longNameFilter = new Ext.util.Filter({
 *         filterFn: function(item) {
 *             return item.name.length > 4;
 *         }
 *     });
 *
 *     // a new MixedCollection with the 3 names longer than 4 characters
 *     var longNames = allNames.filter(longNameFilter);
 *
 *     // a new MixedCollection with the 2 people of age 32:
 *     var youngFolk = allNames.filter(ageFilter);
 */
Ext.define('Ext.util.Filter', {
    isFilter: true,

    config: {
        /**
         * @cfg {String} [property=null]
         * The property to filter on. Required unless a `filter` is passed
         */
        property: null,

        /**
         * @cfg {RegExp/Mixed} [value=null]
         * The value you want to match against. Can be a regular expression which will be used as matcher or any other
         * value.
         */
        value: null,

        /**
         * @cfg {Function} filterFn
         * A custom filter function which is passed each item in the {@link Ext.util.MixedCollection} in turn. Should
         * return true to accept each item or false to reject it
         */
        filterFn: Ext.emptyFn,

        /**
         * @cfg {Boolean} [anyMatch=false]
         * True to allow any match - no regex start/end line anchors will be added.
         */
        anyMatch: false,

        /**
         * @cfg {Boolean} [exactMatch=false]
         * True to force exact match (^ and $ characters added to the regex). Ignored if anyMatch is true.
         */
        exactMatch: false,

        /**
         * @cfg {Boolean} [caseSensitive=false]
         * True to make the regex case sensitive (adds 'i' switch to regex).
         */
        caseSensitive: false,

        /**
         * @cfg {String} [root=null]
         * Optional root property. This is mostly useful when filtering a Store, in which case we set the root to 'data'
         * to make the filter pull the {@link #property} out of the data object of each item
         */
        root: null,

        /**
         * @cfg {String} id
         * An optional id this filter can be keyed by in Collections. If no id is specified it will generate an id by
         * first trying a combination of property-value, and if none if these were specified (like when having a
         * filterFn) it will generate a random id.
         */
        id: undefined,

        /**
         * @cfg {Object} [scope=null]
         * The scope in which to run the filterFn
         */
        scope: null
    },

    applyId: function(id) {
        if (!id) {
            if (this.getProperty()) {
                id = this.getProperty() + '-' + String(this.getValue());
            }
            if (!id) {
                id = Ext.id(null, 'ext-filter-');
            }
        }

        return id;
    },

    /**
     * Creates new Filter.
     * @param {Object} config Config object
     */
    constructor: function(config) {
        this.initConfig(config);
    },

    applyFilterFn: function(filterFn) {
        if (filterFn === Ext.emptyFn) {
            filterFn = this.getInitialConfig('filter');
            if (filterFn) {
                return filterFn;
            }

            var value = this.getValue();
            if (!this.getProperty() && !value && value !== 0) {
                // <debug>
                Ext.Logger.error('A Filter requires either a property and value, or a filterFn to be set');
                // </debug>
                return Ext.emptyFn;
            }
            else {
                return this.createFilterFn();
            }
        }
        return filterFn;
    },

    /**
     * @private
     * Creates a filter function for the configured property/value/anyMatch/caseSensitive options for this Filter
     */
    createFilterFn: function() {
        var me       = this,
            matcher  = me.createValueMatcher();

        return function(item) {
            var root     = me.getRoot(),
                property = me.getProperty();

            if (root) {
                item = item[root];
            }

            return matcher.test(item[property]);
        };
    },

    /**
     * @private
     * Returns a regular expression based on the given value and matching options
     */
    createValueMatcher: function() {
        var me            = this,
            value         = me.getValue(),
            anyMatch      = me.getAnyMatch(),
            exactMatch    = me.getExactMatch(),
            caseSensitive = me.getCaseSensitive(),
            escapeRe      = Ext.String.escapeRegex;

        if (value === null || value === undefined || !value.exec) { // not a regex
            value = String(value);

            if (anyMatch === true) {
                value = escapeRe(value);
            } else {
                value = '^' + escapeRe(value);
                if (exactMatch === true) {
                    value += '$';
                }
            }
            value = new RegExp(value, caseSensitive ? '' : 'i');
         }

         return value;
    }
});
