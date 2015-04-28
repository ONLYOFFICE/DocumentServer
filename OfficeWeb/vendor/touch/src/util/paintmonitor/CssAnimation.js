/**
 * @private
 */
Ext.define('Ext.util.paintmonitor.CssAnimation', {

    extend: 'Ext.util.paintmonitor.Abstract',

    eventName: 'webkitAnimationEnd',

    monitorClass: 'cssanimation',

    onElementPainted: function(e) {
        if (e.animationName === 'x-paint-monitor-helper') {
            this.getCallback().apply(this.getScope(), this.getArgs());
        }
    }
});
