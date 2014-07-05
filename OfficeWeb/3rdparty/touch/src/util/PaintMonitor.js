/**
 *
 */
Ext.define('Ext.util.PaintMonitor', {
    requires: [
        'Ext.util.paintmonitor.CssAnimation',
        'Ext.util.paintmonitor.OverflowChange'
    ],

    constructor: function(config) {
        if (Ext.browser.engineVersion.gtEq('536')) {
            return new Ext.util.paintmonitor.OverflowChange(config);
        }
        else {
            return new Ext.util.paintmonitor.CssAnimation(config);
        }
    }
});
