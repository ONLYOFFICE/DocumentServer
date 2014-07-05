/**
 * A simple event recognizer which knows when you double tap.
 *
 * @private
 */
Ext.define('Ext.event.recognizer.DoubleTap', {

    extend: 'Ext.event.recognizer.SingleTouch',

    inheritableStatics: {
        DIFFERENT_TARGET: 0x03
    },

    config: {
        maxDuration: 300
    },

    handledEvents: ['singletap', 'doubletap'],

    /**
     * @member Ext.dom.Element
     * @event singletap
     * Fires when there is a single tap.
     * @param {Ext.event.Event} event The {@link Ext.event.Event} event encapsulating the DOM event.
     * @param {HTMLElement} node The target of the event.
     * @param {Object} options The options object passed to Ext.mixin.Observable.addListener.
     */

    /**
     * @member Ext.dom.Element
     * @event doubletap
     * Fires when there is a double tap.
     * @param {Ext.event.Event} event The {@link Ext.event.Event} event encapsulating the DOM event.
     * @param {HTMLElement} node The target of the event.
     * @param {Object} options The options object passed to Ext.mixin.Observable.addListener.
     */

    singleTapTimer: null,

    startTime: 0,

    lastTapTime: 0,

    onTouchStart: function(e) {
        if (this.callParent(arguments) === false) {
            return false;
        }

        this.startTime = e.time;

        clearTimeout(this.singleTapTimer);
    },

    onTouchMove: function() {
        return this.fail(this.self.TOUCH_MOVED);
    },

    onEnd: function(e) {
        var me = this,
            maxDuration = this.getMaxDuration(),
            touch = e.changedTouches[0],
            time = e.time,
            target = e.target,
            lastTapTime = this.lastTapTime,
            lastTarget = this.lastTarget,
            duration;

        this.lastTapTime = time;
        this.lastTarget = target;

        if (lastTapTime) {
            duration = time - lastTapTime;

            if (duration <= maxDuration) {
                if (target !== lastTarget) {
                    return this.fail(this.self.DIFFERENT_TARGET);
                }

                this.lastTarget = null;
                this.lastTapTime = 0;

                this.fire('doubletap', e, [touch], {
                    touch: touch,
                    duration: duration
                });

                return;
            }
        }

        if (time - this.startTime > maxDuration) {
            this.fireSingleTap(e, touch);
        }
        else {
            this.singleTapTimer = setTimeout(function() {
                me.fireSingleTap(e, touch);
            }, maxDuration);
        }
    },

    fireSingleTap: function(e, touch) {
        this.fire('singletap', e, [touch], {
            touch: touch
        });
    }
});
