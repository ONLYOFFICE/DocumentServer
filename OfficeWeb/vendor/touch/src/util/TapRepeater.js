/**
 * A wrapper class which can be applied to any element. Fires a "tap" event while
 * touching the device. The interval between firings may be specified in the config but
 * defaults to 20 milliseconds.
 */
Ext.define('Ext.util.TapRepeater', {
    requires: ['Ext.DateExtras'],

    mixins: {
        observable: 'Ext.mixin.Observable'
    },

    /**
     * @event touchstart
     * Fires when the touch is started.
     * @param {Ext.util.TapRepeater} this
     * @param {Ext.event.Event} e
     */

    /**
     * @event tap
     * Fires on a specified interval during the time the element is pressed.
     * @param {Ext.util.TapRepeater} this
     * @param {Ext.event.Event} e
     */

    /**
     * @event touchend
     * Fires when the touch is ended.
     * @param {Ext.util.TapRepeater} this
     * @param {Ext.event.Event} e
     */

    config: {
        el: null,
        accelerate: true,
        interval: 10,
        delay: 250,
        preventDefault: true,
        stopDefault: false,
        timer: 0,
        pressCls: null
    },

    /**
     * Creates new TapRepeater.
     * @param {Mixed} el The element to listen on
     * @param {Object} config
     */
    constructor: function(config) {
        var me = this;
        //<debug warn>
        for (var configName in config) {
            if (me.self.prototype.config && !(configName in me.self.prototype.config)) {
                me[configName] = config[configName];
                Ext.Logger.warn('Applied config as instance property: "' + configName + '"', me);
            }
        }
        //</debug>
        me.initConfig(config);
    },

    updateEl: function(newEl, oldEl) {
        var eventCfg = {
                touchstart: 'onTouchStart',
                touchend: 'onTouchEnd',
                tap: 'eventOptions',
                scope: this
            };
        if (oldEl) {
            oldEl.un(eventCfg)
        }
        newEl.on(eventCfg);
    },

    // @private
    eventOptions: function(e) {
        if (this.getPreventDefault()) {
            e.preventDefault();
        }
        if (this.getStopDefault()) {
            e.stopEvent();
        }
    },

    // @private
    destroy: function() {
        this.clearListeners();
        Ext.destroy(this.el);
    },

    // @private
    onTouchStart: function(e) {
        var me = this,
            pressCls = me.getPressCls();
        clearTimeout(me.getTimer());
        if (pressCls) {
            me.getEl().addCls(pressCls);
        }
        me.tapStartTime = new Date();

        me.fireEvent('touchstart', me, e);
        me.fireEvent('tap', me, e);

        // Do not honor delay or interval if acceleration wanted.
        if (me.getAccelerate()) {
            me.delay = 400;
        }
        me.setTimer(Ext.defer(me.tap, me.getDelay() || me.getInterval(), me, [e]));
    },

    // @private
    tap: function(e) {
        var me = this;
        me.fireEvent('tap', me, e);
        me.setTimer(Ext.defer(me.tap, me.getAccelerate() ? me.easeOutExpo(Ext.Date.getElapsed(me.tapStartTime),
            400,
            -390,
            12000) : me.getInterval(), me, [e]));
    },

    // Easing calculation
    // @private
    easeOutExpo: function(t, b, c, d) {
        return (t == d) ? b + c : c * ( - Math.pow(2, -10 * t / d) + 1) + b;
    },

    // @private
    onTouchEnd: function(e) {
        var me = this;
        clearTimeout(me.getTimer());
        me.getEl().removeCls(me.getPressCls());
        me.fireEvent('touchend', me, e);
    }
});
