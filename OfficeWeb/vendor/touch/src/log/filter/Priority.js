//<feature logger>
Ext.define('Ext.log.filter.Priority', {
    extend: 'Ext.log.filter.Filter',

    config: {
        minPriority: 1
    },

    accept: function(event) {
        return event.priority >= this.getMinPriority();
    }
});
//</feature>
