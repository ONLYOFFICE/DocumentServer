/**
 * @private
 */
Ext.define('Ext.mixin.Filterable', {
    extend: 'Ext.mixin.Mixin',

    requires: [
        'Ext.util.Filter'
    ],

    mixinConfig: {
        id: 'filterable'
    },

    config: {
        /**
         * @cfg {Array} filters
         * An array with filters. A filter can be an instance of Ext.util.Filter,
         * an object representing an Ext.util.Filter configuration, or a filter function.
         */
        filters: null,

        /**
         * @cfg {String} filterRoot
         * The root inside each item in which the properties exist that we want to filter on.
         * This is useful for filtering records in which the data exists inside a 'data' property.
         */
        filterRoot: null
    },

    /**
     * @property {Boolean} dirtyFilterFn
     * A flag indicating whether the currently cashed filter function is still valid.
     * @readonly
     */
    dirtyFilterFn: false,

    /**
     * @property currentSortFn
     * This is the cached sorting function which is a generated function that calls all the
     * configured sorters in the correct order.
     * @readonly
     */
    filterFn: null,

    /**
     * @property {Boolean} filtered
     * A read-only flag indicating if this object is filtered.
     * @readonly
     */
    filtered: false,

    applyFilters: function(filters, collection) {
        if (!collection) {
            collection = this.createFiltersCollection();
        }

        collection.clear();

        this.filtered = false;
        this.dirtyFilterFn = true;

        if (filters) {
            this.addFilters(filters);
        }

        return collection;
    },

    createFiltersCollection: function() {
        this._filters = Ext.create('Ext.util.Collection', function(filter) {
            return filter.getId();
        });
        return this._filters;
    },

    /**
     * This method adds a filter.
     * @param {Ext.util.Sorter/Function/Object} filter Can be an instance of Ext.util.Filter,
     * an object representing an Ext.util.Filter configuration, or a filter function.
     */
    addFilter: function(filter) {
        this.addFilters([filter]);
    },

    /**
     * This method adds all the filters in a passed array.
     * @param {Array} filters An array with filters. A filter can be an instance of {@link Ext.util.Filter},
     * an object representing an Ext.util.Filter configuration, or a filter function.
     * @return {Object}
     */
    addFilters: function(filters) {
        var currentFilters = this.getFilters();
        return this.insertFilters(currentFilters ? currentFilters.length : 0, filters);
    },

    /**
     * This method adds a filter at a given index.
     * @param {Number} index The index at which to insert the filter.
     * @param {Ext.util.Sorter/Function/Object} filter Can be an instance of {@link Ext.util.Filter},
     * an object representing an Ext.util.Filter configuration, or a filter function.
     * @return {Object}
     */
    insertFilter: function(index, filter) {
        return this.insertFilters(index, [filter]);
    },

    /**
     * This method inserts all the filters in the passed array at the given index.
     * @param {Number} index The index at which to insert the filters.
     * @param {Array} filters Each filter can be an instance of {@link Ext.util.Filter},
     * an object representing an Ext.util.Filter configuration, or a filter function.
     * @return {Array}
     */
    insertFilters: function(index, filters) {
        // We begin by making sure we are dealing with an array of sorters
        if (!Ext.isArray(filters)) {
            filters = [filters];
        }

        var ln = filters.length,
            filterRoot = this.getFilterRoot(),
            currentFilters = this.getFilters(),
            newFilters = [],
            filterConfig, i, filter;

        if (!currentFilters) {
            currentFilters = this.createFiltersCollection();
        }

        // We first have to convert every sorter into a proper Sorter instance
        for (i = 0; i < ln; i++) {
            filter = filters[i];
            filterConfig = {
                root: filterRoot
            };

            if (Ext.isFunction(filter)) {
                filterConfig.filterFn = filter;
            }
            // If we are dealing with an object, we assume its a Sorter configuration. In this case
            // we create an instance of Sorter passing this configuration.
            else if (Ext.isObject(filter)) {
                if (!filter.isFilter) {
                    if (filter.fn) {
                        filter.filterFn = filter.fn;
                        delete filter.fn;
                    }

                    filterConfig = Ext.apply(filterConfig, filter);
                }
                else {
                    newFilters.push(filter);
                    if (!filter.getRoot()) {
                        filter.setRoot(filterRoot);
                    }
                    continue;
                }
            }
            // Finally we get to the point where it has to be invalid
            // <debug>
            else {
                Ext.Logger.warn('Invalid filter specified:', filter);
            }
            // </debug>

            // If a sorter config was created, make it an instance
            filter = Ext.create('Ext.util.Filter', filterConfig);
            newFilters.push(filter);
        }

        // Now lets add the newly created sorters.
        for (i = 0, ln = newFilters.length; i < ln; i++) {
            currentFilters.insert(index + i, newFilters[i]);
        }

        this.dirtyFilterFn = true;

        if (currentFilters.length) {
            this.filtered = true;
        }

        return currentFilters;
    },

    /**
     * This method removes all the filters in a passed array.
     * @param {Array} filters Each value in the array can be a string (property name),
     * function (sorterFn), an object containing a property and value keys or
     * {@link Ext.util.Sorter Sorter} instance.
     */
    removeFilters: function(filters) {
        // We begin by making sure we are dealing with an array of sorters
        if (!Ext.isArray(filters)) {
            filters = [filters];
        }

        var ln = filters.length,
            currentFilters = this.getFilters(),
            i, filter;

        for (i = 0; i < ln; i++) {
            filter = filters[i];

            if (typeof filter === 'string') {
                currentFilters.each(function(item) {
                    if (item.getProperty() === filter) {
                        currentFilters.remove(item);
                    }
                });
            }
            else if (typeof filter === 'function') {
                currentFilters.each(function(item) {
                    if (item.getFilterFn() === filter) {
                        currentFilters.remove(item);
                    }
                });
            }
            else {
                if (filter.isFilter) {
                    currentFilters.remove(filter);
                }
                else if (filter.property !== undefined && filter.value !== undefined) {
                    currentFilters.each(function(item) {
                        if (item.getProperty() === filter.property && item.getValue() === filter.value) {
                            currentFilters.remove(item);
                        }
                    });
                }
            }
        }

        if (!currentFilters.length) {
            this.filtered = false;
        }
    },

    /**
     * This updates the cached sortFn based on the current sorters.
     * @return {Function} sortFn The generated sort function.
     * @private
     */
    updateFilterFn: function() {
        var filters = this.getFilters().items;

        this.filterFn = function(item) {
            var isMatch = true,
                length = filters.length,
                i;

            for (i = 0; i < length; i++) {
                var filter = filters[i],
                    fn     = filter.getFilterFn(),
                    scope  = filter.getScope() || this;

                isMatch = isMatch && fn.call(scope, item);
            }

            return isMatch;
        };

        this.dirtyFilterFn = false;
        return this.filterFn;
    },

    /**
     * This method will sort an array based on the currently configured {@link Ext.data.Store#sorters sorters}.
     * @param {Array} data The array you want to have sorted.
     * @return {Array} The array you passed after it is sorted.
     */
    filter: function(data) {
        return this.getFilters().length ? Ext.Array.filter(data, this.getFilterFn()) : data;
    },

    isFiltered: function(item) {
        return this.getFilters().length ? !this.getFilterFn()(item) : false;
    },

    /**
     * Returns an up to date sort function.
     * @return {Function} sortFn The sort function.
     */
    getFilterFn: function() {
        if (this.dirtyFilterFn) {
            return this.updateFilterFn();
        }
        return this.filterFn;
    }
});
