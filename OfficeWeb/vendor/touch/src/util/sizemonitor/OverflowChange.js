/**
 * @private
 */
Ext.define('Ext.util.sizemonitor.OverflowChange', {

    extend: 'Ext.util.sizemonitor.Abstract',

    constructor: function(config) {
        this.onExpand = Ext.Function.bind(this.onExpand, this);
        this.onShrink = Ext.Function.bind(this.onShrink, this);

        this.callSuper(arguments);
    },

    getElementConfig: function() {
        return {
            reference: 'detectorsContainer',
            classList: ['x-size-monitors', 'overflowchanged'],
            children: [
                {
                    reference: 'expandMonitor',
                    className: 'expand',
                    children: [{
                        reference: 'expandHelper'
                    }]
                },
                {
                    reference: 'shrinkMonitor',
                    className: 'shrink',
                    children: [{
                        reference: 'shrinkHelper'
                    }]
                }
            ]
        }
    },

    bindListeners: function(bind) {
        var method = bind ? 'addEventListener' : 'removeEventListener';

        this.expandMonitor[method]('overflowchanged', this.onExpand, true);
        this.shrinkMonitor[method]('overflowchanged', this.onShrink, true);
    },

    onExpand: function(e) {
        if (e.horizontalOverflow && e.verticalOverflow) {
            return;
        }

        Ext.TaskQueue.requestRead('refresh', this);
    },

    onShrink: function(e) {
        if (!e.horizontalOverflow && !e.verticalOverflow) {
            return;
        }

        Ext.TaskQueue.requestRead('refresh', this);
    },

    refreshMonitors: function() {
        var expandHelper = this.expandHelper,
            shrinkHelper = this.shrinkHelper,
            width = this.contentWidth,
            height = this.contentHeight;

        if (expandHelper && !expandHelper.isDestroyed) {
            expandHelper.style.width = (width + 1) + 'px';
            expandHelper.style.height = (height + 1) + 'px';
        }
        if (shrinkHelper && !shrinkHelper.isDestroyed) {
            shrinkHelper.style.width = width + 'px';
            shrinkHelper.style.height = height + 'px';
        }

        Ext.TaskQueue.requestRead('refresh', this);
    }
});
