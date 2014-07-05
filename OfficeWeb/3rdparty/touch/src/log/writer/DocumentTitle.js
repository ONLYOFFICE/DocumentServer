//<feature logger>
Ext.define('Ext.log.writer.DocumentTitle', {

    extend: 'Ext.log.writer.Writer',

    doWrite: function(event) {
        var message = event.message;

        document.title = message;
    }
});
//</feature>
