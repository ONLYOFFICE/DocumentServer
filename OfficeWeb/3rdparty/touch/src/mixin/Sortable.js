/**
 * @private
 */
Ext.define('Ext.mixin.Sortable', {
    extend: 'Ext.mixin.Mixin',

    requires: [
        'Ext.util.Sorter'
    ],

    mixinConfig: {
        id: 'sortable'
    },

    config: {
        /**
         * @cfg {Array} sorters
         * An array with sorters. A sorter can be an instance of {@link Ext.util.Sorter}, a string
         * indicating a property name, an object representing an Ext.util.Sorter configuration,
         * or a sort function.
         */
        sorters: null,

        /**
         * @cfg {String} defaultSortDirection
         * The default sort direction to use if one is not specified.
         */
        defaultSortDirection: "ASC",

        /**
         * @cfg {String} sortRoot
         * The root inside each item in which the properties exist that we want to sort on.
         * This is useful for sorting records in which the data exists inside a `data` property.
         */
        sortRoot: null
    },

    /**
     * @property {Boolean} dirtySortFn
     * A flag indicating whether the currently cashed sort function is still valid.
     * @readonly
     */
    dirtySortFn: false,

    /**
     * @property currentSortFn
     * This is the cached sorting function which is a generated function that calls all the
     * configured sorters in the correct order.
     * @readonly
     */
    sortFn: null,

    /**
     * @property {Boolean} sorted
     * A read-only flag indicating if this object is sorted.
     * @readonly
     */
    sorted: false,

    applySorters: function(sorters, collection) {
        if (!collection) {
            collection = this.createSortersCollection();
        }

        collection.clear();
        this.sorted = false;

        if (sorters) {
            this.addSorters(sorters);
        }

        return collection;
    },

    createSortersCollection: function() {
        this._sorters = Ext.create('Ext.util.Collection', function(sorter) {
            return sorter.getId();
        });
        return this._sorters;
    },

    /**
     * This method adds a sorter.
     * @param {Ext.util.Sorter/String/Function/Object} sorter Can be an instance of
     * Ext.util.Sorter, a string indicating a property name, an object representing an Ext.util.Sorter
     * configuration, or a sort function.
     * @param {String} defaultDirection The default direction for each sorter in the array. Defaults
     * to the value of {@link #defaultSortDirection}. Can be either 'ASC' or 'DESC'.
     */
    addSorter: function(sorter, defaultDirection) {
        this.addSorters([sorter], defaultDirection);
    },

    /**
     * This method adds all the sorters in a passed array.
     * @param {Array} sorters An array with sorters. A sorter can be an instance of Ext.util.Sorter, a string
     * indicating a property name, an object representing an Ext.util.Sorter configuration,
     * or a sort function.
     * @param {String} defaultDirection The default direction for each sorter in the array. Defaults
     * to the value of {@link #defaultSortDirection}. Can be either 'ASC' or 'DESC'.
     */
    addSorters: function(sorters, defaultDirection) {
        var currentSorters = this.getSorters();
        return this.insertSorters(currentSorters ? currentSorters.length : 0, sorters, defaultDirection);
    },

    /**
     * This method adds a sorter at a given index.
     * @param {Number} index The index at which to insert the sorter.
     * @param {Ext.util.Sorter/String/Function/Object} sorter Can be an instance of Ext.util.Sorter,
     * a string indicating a property name, an object representing an Ext.util.Sorter configuration,
     * or a sort function.
     * @param {String} defaultDirection The default direction for each sorter in the array. Defaults
     * to the value of {@link #defaultSortDirection}. Can be either 'ASC' or 'DESC'.
     */
    insertSorter: function(index, sorter, defaultDirection) {
        return this.insertSorters(index, [sorter], defaultDirection);
    },

    /**
     * This method inserts all the sorters in the passed array at the given index.
     * @param {Number} index The index at which to insert the sorters.
     * @param {Array} sorters Can be an instance of Ext.util.Sorter, a string indicating a property name,
     * an object representing an Ext.util.Sorter configuration, or a sort function.
     * @param {String} defaultDirection The default direction for each sorter in the array. Defaults
     * to the value of {@link #defaultSortDirection}. Can be either 'ASC' or 'DESC'.
     */
    insertSorters: function(index, sorters, defaultDirection) {
        // We begin by making sure we are dealing with an array of sorters
        if (!Ext.isArray(sorters)) {
            sorters = [sorters];
        }

        var ln = sorters.length,
            direction = defaultDirection || this.getDefaultSortDirection(),
            sortRoot = this.getSortRoot(),
            currentSorters = this.getSorters(),
            newSorters = [],
            sorterConfig, i, sorter, currentSorter;

        if (!currentSorters) {
            // This will guarantee that we get the collection
            currentSorters = this.createSortersCollection();
        }

        // We first have to convert every sorter into a proper Sorter instance
        for (i = 0; i < ln; i++) {
            sorter = sorters[i];
            sorterConfig = {
                direction: direction,
                root: sortRoot
            };

            // If we are dealing with a string we assume it is a property they want to sort on.
            if (typeof sorter === 'string') {
                currentSorter = currentSorters.get(sorter);

                if (!currentSorter) {
                    sorterConfig.property = sorter;
                } else {
                    if (defaultDirection) {
                        currentSorter.setDirection(defaultDirection);
                    } else {
                        // If we already have a sorter for this property we just toggle its direction.
                        currentSorter.toggle();
                    }
                    continue;
                }
            }
            // If it is a function, we assume its a sorting function.
            else if (Ext.isFunction(sorter)) {
                sorterConfig.sorterFn = sorter;
            }
            // If we are dealing with an object, we assume its a Sorter configuration. In this case
            // we create an instance of Sorter passing this configuration.
            else if (Ext.isObject(sorter)) {
                if (!sorter.isSorter) {
                    if (sorter.fn) {
                        sorter.sorterFn = sorter.fn;
                        delete sorter.fn;
                    }

                    sorterConfig = Ext.apply(sorterConfig, sorter);
                }
                else {
                    newSorters.push(sorter);
                    if (!sorter.getRoot()) {
                        sorter.setRoot(sortRoot);
                    }
                    continue;
                }
            }
            // Finally we get to the point where it has to be invalid
            // <debug>
            else {
                Ext.Logger.warn('Invalid sorter specified:', sorter);
            }
            // </debug>

            // If a sorter config was created, make it an instance
            sorter = Ext.create('Ext.util.Sorter', sorterConfig);
            newSorters.push(sorter);
        }

        // Now lets add the newly created sorters.
        for (i = 0, ln = newSorters.length; i < ln; i++) {
            currentSorters.insert(index + i, newSorters[i]);
        }

        this.dirtySortFn = true;

        if (currentSorters.length) {
            this.sorted = true;
        }
        return currentSorters;
    },

    /**
     * This method removes a sorter.
     * @param {Ext.util.Sorter/String/Function/Object} sorter Can be an instance of Ext.util.Sorter,
     * a string indicating a property name, an object representing an Ext.util.Sorter configuration,
     * or a sort function.
     */
    removeSorter: function(sorter) {
        return this.removeSorters([sorter]);
    },

    /**
     * This method removes all the sorters in a passed array.
     * @param {Array} sorters Each value in the array can be a string (property name),
     * function (sorterFn) or {@link Ext.util.Sorter Sorter} instance.
     */
    removeSorters: function(sorters) {
        // We begin by making sure we are dealing with an array of sorters
        if (!Ext.isArray(sorters)) {
            sorters = [sorters];
        }

        var ln = sorters.length,
            currentSorters = this.getSorters(),
            i, sorter;

        for (i = 0; i < ln; i++) {
            sorter = sorters[i];

            if (typeof sorter === 'string') {
                currentSorters.removeAtKey(sorter);
            }
            else if (typeof sorter === 'function') {
                currentSorters.each(function(item) {
                    if (item.getSorterFn() === sorter) {
                        currentSorters.remove(item);
                    }
                });
            }
            else if (sorter.isSorter) {
                currentSorters.remove(sorter);
            }
        }

        if (!currentSorters.length) {
            this.sorted = false;
        }
    },

    /**
     * This updates the cached sortFn based on the current sorters.
     * @return {Function} The generated sort function.
     * @private
     */
    updateSortFn: function() {
        var sorters = this.getSorters().items;

        this.sortFn = function(r1, r2) {
            var ln = sorters.length,
                result, i;

            // We loop over each sorter and check if r1 should be before or after r2
            for (i = 0; i < ln; i++) {
                result = sorters[i].sort.call(this, r1, r2);

                // If the result is -1 or 1 at this point it means that the sort is done.
                // Only if they are equal (0) we continue to see if a next sort function
                // actually might find a winner.
                if (result !== 0) {
                    break;
                }
            }

            return result;
        };

        this.dirtySortFn = false;
        return this.sortFn;
    },

    /**
     * Returns an up to date sort function.
     * @return {Function} The sort function.
     */
    getSortFn: function() {
        if (this.dirtySortFn) {
            return this.updateSortFn();
        }
        return this.sortFn;
    },

    /**
     * This method will sort an array based on the currently configured {@link #sorters}.
     * @param {Array} data The array you want to have sorted.
     * @return {Array} The array you passed after it is sorted.
     */
    sort: function(data) {
        Ext.Array.sort(data, this.getSortFn());
        return data;
    },

    /**
     * This method returns the index that a given item would be inserted into a given array based
     * on the current sorters.
     * @param {Array} items The array that you want to insert the item into.
     * @param {Mixed} item The item that you want to insert into the items array.
     * @return {Number} The index for the given item in the given array based on the current sorters.
     */
    findInsertionIndex: function(items, item, sortFn) {
        var start = 0,
            end   = items.length - 1,
            sorterFn = sortFn || this.getSortFn(),
            middle,
            comparison;

        while (start <= end) {
            middle = (start + end) >> 1;
            comparison = sorterFn(item, items[middle]);
            if (comparison >= 0) {
                start = middle + 1;
            } else if (comparison < 0) {
                end = middle - 1;
            }
        }

        return start;
    }
});
