//<feature logger>
Ext.define('Ext.log.formatter.Identity', {
    extend: 'Ext.log.formatter.Default',

    config: {
        messageFormat: "[{osIdentity}][{browserIdentity}][{timestamp}][{priorityName}][{callerDisplayName}] {message}"
    },

    format: function(event) {
        event.timestamp = Ext.Date.toString();
        event.browserIdentity = Ext.browser.name + ' ' + Ext.browser.version;
        event.osIdentity = Ext.os.name + ' ' + Ext.os.version;

        return this.callParent(arguments);
    }
});
//</feature>
