//<feature logger>
Ext.define('Ext.log.writer.Writer', {
    extend: 'Ext.log.Base',

    requires: ['Ext.log.formatter.Formatter'],

    config: {
        formatter: null,
        filters: {}
    },

    constructor: function() {
        this.activeFilters = [];

        return this.callParent(arguments);
    },

    updateFilters: function(filters) {
        var activeFilters = this.activeFilters,
            i, filter;

        activeFilters.length = 0;

        for (i in filters) {
            if (filters.hasOwnProperty(i)) {
                filter = filters[i];
                activeFilters.push(filter);
            }
        }
    },

    write: function(event) {
        var filters = this.activeFilters,
            formatter = this.getFormatter(),
            i, ln, filter;

        for (i = 0,ln = filters.length; i < ln; i++) {
            filter = filters[i];

            if (!filters[i].accept(event)) {
                return this;
            }
        }

        if (formatter) {
            event.message = formatter.format(event);
        }

        this.doWrite(event);

        return this;
    },

    // @private
    doWrite: Ext.emptyFn
});
//</feature>
