/**
 * A simple event recognizer which knows when you drag.
 *
 * @private
 */
Ext.define('Ext.event.recognizer.Drag', {
    extend: 'Ext.event.recognizer.SingleTouch',

    isStarted: false,

    startPoint: null,

    previousPoint: null,

    lastPoint: null,

    handledEvents: ['dragstart', 'drag', 'dragend'],

    /**
     * @member Ext.dom.Element
     * @event dragstart
     * Fired once when a drag has started.
     * @param {Ext.event.Event} event The {@link Ext.event.Event} event encapsulating the DOM event.
     * @param {HTMLElement} node The target of the event.
     * @param {Object} options The options object passed to Ext.mixin.Observable.addListener.
     */

    /**
     * @member Ext.dom.Element
     * @event drag
     * Fires continuously when there is dragging (the touch must move for this to be fired).
     * @param {Ext.event.Event} event The {@link Ext.event.Event} event encapsulating the DOM event.
     * @param {HTMLElement} node The target of the event.
     * @param {Object} options The options object passed to Ext.mixin.Observable.addListener.
     */

    /**
     * @member Ext.dom.Element
     * @event dragend
     * Fires when a drag has ended.
     * @param {Ext.event.Event} event The {@link Ext.event.Event} event encapsulating the DOM event.
     * @param {HTMLElement} node The target of the event.
     * @param {Object} options The options object passed to Ext.mixin.Observable.addListener.
     */

    onTouchStart: function(e) {
        var startTouches,
            startTouch;

        if (this.callParent(arguments) === false) {
            if (this.isStarted && this.lastMoveEvent !== null) {
                this.onTouchEnd(this.lastMoveEvent);
            }
            return false;
        }

        this.startTouches = startTouches = e.changedTouches;
        this.startTouch = startTouch = startTouches[0];
        this.startPoint = startTouch.point;
    },

    onTouchMove: function(e) {
        var touches = e.changedTouches,
            touch = touches[0],
            point = touch.point,
            time = e.time;

        if (this.lastPoint) {
            this.previousPoint = this.lastPoint;
        }

        if (this.lastTime) {
            this.previousTime = this.lastTime;
        }

        this.lastTime = time;
        this.lastPoint = point;
        this.lastMoveEvent = e;

        if (!this.isStarted) {
            this.isStarted = true;

            this.startTime = time;
            this.previousTime = time;

            this.previousPoint = this.startPoint;

            this.fire('dragstart', e, this.startTouches, this.getInfo(e, this.startTouch));
        }
        else {
            this.fire('drag', e, touches, this.getInfo(e, touch));
        }
    },

    onTouchEnd: function(e) {
        if (this.isStarted) {
            var touches = e.changedTouches,
                touch = touches[0],
                point = touch.point;

            this.isStarted = false;

            this.lastPoint = point;

            this.fire('dragend', e, touches, this.getInfo(e, touch));

            this.startTime = 0;
            this.previousTime = 0;
            this.lastTime = 0;

            this.startPoint = null;
            this.previousPoint = null;
            this.lastPoint = null;
            this.lastMoveEvent = null;
        }
    },

    getInfo: function(e, touch) {
        var time = e.time,
            startPoint = this.startPoint,
            previousPoint = this.previousPoint,
            startTime = this.startTime,
            previousTime = this.previousTime,
            point = this.lastPoint,
            deltaX = point.x - startPoint.x,
            deltaY = point.y - startPoint.y,
            info = {
                touch: touch,
                startX: startPoint.x,
                startY: startPoint.y,
                previousX: previousPoint.x,
                previousY: previousPoint.y,
                pageX: point.x,
                pageY: point.y,
                deltaX: deltaX,
                deltaY: deltaY,
                absDeltaX: Math.abs(deltaX),
                absDeltaY: Math.abs(deltaY),
                previousDeltaX: point.x - previousPoint.x,
                previousDeltaY: point.y - previousPoint.y,
                time: time,
                startTime: startTime,
                previousTime: previousTime,
                deltaTime: time - startTime,
                previousDeltaTime: time - previousTime
            };

        return info;
    }
});
