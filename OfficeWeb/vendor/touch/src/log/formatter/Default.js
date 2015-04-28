//<feature logger>
Ext.define('Ext.log.formatter.Default', {
    extend: 'Ext.log.formatter.Formatter',

    config: {
        messageFormat: "[{priorityName}][{callerDisplayName}] {message}"
    },

    format: function(event) {
        var event = Ext.merge({}, event, {
                priorityName: event.priorityName.toUpperCase()
            });

        return this.callParent([event]);
    }
});
//</feature>
