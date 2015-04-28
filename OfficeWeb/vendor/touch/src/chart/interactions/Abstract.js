/**
 * @class Ext.chart.interactions.Abstract
 *
 * Defines a common abstract parent class for all interactions.
 *
 */
Ext.define('Ext.chart.interactions.Abstract', {

    xtype: 'interaction',

    mixins: {
        observable: "Ext.mixin.Observable"
    },

    config: {
        /**
         * @cfg {String} gesture
         * Specifies which gesture type should be used for starting the interaction.
         */
        gesture: 'tap',

        /**
         * @cfg {Ext.chart.AbstractChart} chart The chart that the interaction is bound.
         */
        chart: null,

        /**
         * @cfg {Boolean} enabled 'true' if the interaction is enabled.
         */
        enabled: true
    },

    /**
     * Android device is emerging too many events so if we re-render every frame it will take for-ever to finish a frame.
     * This throttle technique will limit the timespan between two frames.
     */
    throttleGap: 0,

    stopAnimationBeforeSync: false,

    constructor: function (config) {
        var me = this;
        me.initConfig(config);
        Ext.ComponentManager.register(this);
    },

    /**
     * @protected
     * A method to be implemented by subclasses where all event attachment should occur.
     */
    initialize: Ext.emptyFn,

    updateChart: function (newChart, oldChart) {
        var me = this, gestures = me.getGestures();
        if (oldChart === newChart) {
            return;
        }
        if (oldChart) {
            me.removeChartListener(oldChart);
        }
        if (newChart) {
            me.addChartListener();
        }
    },

    getGestures: function () {
        var gestures = {};
        gestures[this.getGesture()] = this.onGesture;
        return gestures;
    },

    /**
     * @protected
     * Placeholder method.
     */
    onGesture: Ext.emptyFn,

    /**
     * @protected Find and return a single series item corresponding to the given event,
     * or null if no matching item is found.
     * @param {Event} e
     * @return {Object} the item object or null if none found.
     */
    getItemForEvent: function (e) {
        var me = this,
            chart = me.getChart(),
            chartXY = chart.getEventXY(e);
        return chart.getItemForPoint(chartXY[0], chartXY[1]);
    },

    /**
     * @protected Find and return all series items corresponding to the given event.
     * @param {Event} e
     * @return {Array} array of matching item objects
     */
    getItemsForEvent: function (e) {
        var me = this,
            chart = me.getChart(),
            chartXY = chart.getEventXY(e);
        return chart.getItemsForPoint(chartXY[0], chartXY[1]);
    },

    /**
     * @private
     */
    addChartListener: function () {
        var me = this,
            chart = me.getChart(),
            gestures = me.getGestures(),
            gesture, fn;
        me.listeners = me.listeners || {};

        function insertGesture(name, fn) {
            chart.on(
                name,
                // wrap the handler so it does not fire if the event is locked by another interaction
                me.listeners[name] = function (e) {
                    var locks = me.getLocks();
                    if (!(name in locks) || locks[name] === me) {
                        if (e && e.stopPropagation) {
                            e.stopPropagation();
                            e.preventDefault();
                        }
                        return (Ext.isFunction(fn) ? fn : me[fn]).apply(this, arguments);
                    }
                },
                me
            );
        }

        for (gesture in gestures) {
            insertGesture(gesture, gestures[gesture]);
        }
    },

    removeChartListener: function (chart) {
        var me = this,
            gestures = me.getGestures(),
            gesture, fn;

        function removeGesture(name) {
            chart.un(name, me.listeners[name]);
            delete me.listeners[name];
        }

        for (gesture in gestures) {
            removeGesture(gesture);
        }
    },

    lockEvents: function () {
        var me = this,
            locks = me.getLocks(),
            args = Array.prototype.slice.call(arguments),
            i = args.length;
        while (i--) {
            locks[args[i]] = me;
        }
    },

    unlockEvents: function () {
        var locks = this.getLocks(),
            args = Array.prototype.slice.call(arguments),
            i = args.length;
        while (i--) {
            delete locks[args[i]];
        }
    },

    getLocks: function () {
        var chart = this.getChart();
        return chart.lockedEvents || (chart.lockedEvents = {});
    },

    isMultiTouch: function () {
        return !(Ext.os.is.MultiTouch === false || (Ext.os.is.Android3 || Ext.os.is.Android2) || Ext.os.is.Desktop);
    },

    initializeDefaults: Ext.emptyFn,

    doSync: function () {
        var chart = this.getChart();
        if (this.syncTimer) {
            clearTimeout(this.syncTimer);
            this.syncTimer = null;
        }
        if (this.stopAnimationBeforeSync) {
            chart.resizing = true;
        }
        chart.redraw();
        if (this.stopAnimationBeforeSync) {
            chart.resizing = false;
        }
        this.syncThrottle = +new Date() + this.throttleGap;
    },

    sync: function () {
        var me = this;
        if (me.throttleGap && Ext.frameStartTime < me.syncThrottle) {
            if (me.syncTimer) {
                return;
            }
            me.syncTimer = setTimeout(function () {
                me.doSync();
            }, me.throttleGap);
        } else {
            me.doSync();
        }
    },

    getItemId: function () {
        return this.getId();
    },

    isXType: function (xtype) {
        return xtype === 'interaction';
    },

    destroy: function () {
        Ext.ComponentManager.unregister(this);
        this.listeners = [];
        this.callSuper();
    }
}, function () {
    if (Ext.os.is.Android2) {
        this.prototype.throttleGap = 20;
    } else if (Ext.os.is.Android4) {
        this.prototype.throttleGap = 40;
    }
});
