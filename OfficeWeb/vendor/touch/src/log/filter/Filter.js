//<feature logger>
Ext.define('Ext.log.filter.Filter', {
    extend: 'Ext.log.Base',

    accept: function(event) {
        return true;
    }
});
//</feature>
