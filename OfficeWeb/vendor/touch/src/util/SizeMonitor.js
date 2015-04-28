/**
 *
 */
Ext.define('Ext.util.SizeMonitor', {
    requires: [
        'Ext.util.sizemonitor.Scroll',
        'Ext.util.sizemonitor.OverflowChange'
    ],

    constructor: function(config) {
        if (Ext.browser.engineVersion.gtEq('535')) {
            return new Ext.util.sizemonitor.OverflowChange(config);
        }
        else {
            return new Ext.util.sizemonitor.Scroll(config);
        }
    }
});
