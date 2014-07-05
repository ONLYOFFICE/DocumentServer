/**
 * A base class used for both {@link Ext.event.recognizer.VerticalSwipe} and {@link Ext.event.recognizer.HorizontalSwipe}
 * event recognizers.
 *
 * @private
 */
Ext.define('Ext.event.recognizer.Swipe', {
    extend: 'Ext.event.recognizer.SingleTouch',

    handledEvents: ['swipe'],

    /**
     * @member Ext.dom.Element
     * @event swipe
     * Fires when there is a swipe
     * When listening to this, ensure you know about the {@link Ext.event.Event#direction} property in the `event` object.
     * @param {Ext.event.Event} event The {@link Ext.event.Event} event encapsulating the DOM event.
     * @param {HTMLElement} node The target of the event.
     * @param {Object} options The options object passed to Ext.mixin.Observable.addListener.
     */

    /**
     * @property {Number} direction
     * The direction of the swipe. Available options are:
     *
     * - up
     * - down
     * - left
     * - right
     *
     * __Note:__ In order to recognize swiping up and down, you must enable the vertical swipe recognizer.
     *
     * **This is only available when the event type is `swipe`**
     * @member Ext.event.Event
     */

    /**
     * @property {Number} duration
     * The duration of the swipe.
     *
     * **This is only available when the event type is `swipe`**
     * @member Ext.event.Event
     */

    inheritableStatics: {
        MAX_OFFSET_EXCEEDED: 0x10,
        MAX_DURATION_EXCEEDED: 0x11,
        DISTANCE_NOT_ENOUGH: 0x12
    },

    config: {
        minDistance: 80,
        maxOffset: 35,
        maxDuration: 1000
    },

    onTouchStart: function(e) {
        if (this.callParent(arguments) === false) {
            return false;
        }

        var touch = e.changedTouches[0];

        this.startTime = e.time;

        this.isHorizontal = true;
        this.isVertical = true;

        this.startX = touch.pageX;
        this.startY = touch.pageY;
    },

    onTouchMove: function(e) {
        var touch = e.changedTouches[0],
            x = touch.pageX,
            y = touch.pageY,
            absDeltaX = Math.abs(x - this.startX),
            absDeltaY = Math.abs(y - this.startY),
            time = e.time;

        if (time - this.startTime > this.getMaxDuration()) {
            return this.fail(this.self.MAX_DURATION_EXCEEDED);
        }

        if (this.isVertical && absDeltaX > this.getMaxOffset()) {
            this.isVertical = false;
        }

        if (this.isHorizontal && absDeltaY > this.getMaxOffset()) {
            this.isHorizontal = false;
        }

        if (!this.isHorizontal && !this.isVertical) {
            return this.fail(this.self.MAX_OFFSET_EXCEEDED);
        }
    },

    onTouchEnd: function(e) {
        if (this.onTouchMove(e) === false) {
            return false;
        }

        var touch = e.changedTouches[0],
            x = touch.pageX,
            y = touch.pageY,
            deltaX = x - this.startX,
            deltaY = y - this.startY,
            absDeltaX = Math.abs(deltaX),
            absDeltaY = Math.abs(deltaY),
            minDistance = this.getMinDistance(),
            duration = e.time - this.startTime,
            direction, distance;

        if (this.isVertical && absDeltaY < minDistance) {
            this.isVertical = false;
        }

        if (this.isHorizontal && absDeltaX < minDistance) {
            this.isHorizontal = false;
        }

        if (this.isHorizontal) {
            direction = (deltaX < 0) ? 'left' : 'right';
            distance = absDeltaX;
        }
        else if (this.isVertical) {
            direction = (deltaY < 0) ? 'up' : 'down';
            distance = absDeltaY;
        }
        else {
            return this.fail(this.self.DISTANCE_NOT_ENOUGH);
        }

        this.fire('swipe', e, [touch], {
            touch: touch,
            direction: direction,
            distance: distance,
            duration: duration
        });
    }
});
