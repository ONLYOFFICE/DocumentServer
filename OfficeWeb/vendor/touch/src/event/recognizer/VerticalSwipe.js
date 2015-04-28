/**
 * A event recognizer created to recognize vertical swipe movements.
 * 
 * This is disabled by default in Sencha Touch as it has a performance impact when your application
 * has vertical scrollers, plus, in most cases it is not very useful.
 * 
 * If you wish to recognize vertical swipe movements in your application, please refer to the documentation of
 * {@link Ext.event.recognizer.Recognizer} and {@link Ext#setup}.
 * 
 * @private
 */
Ext.define('Ext.event.recognizer.VerticalSwipe', {
    extend: 'Ext.event.recognizer.Swipe',

    onTouchStart: function(e) {
        if (this.callParent(arguments) === false) {
            return false;
        }

        var touch = e.changedTouches[0];

        this.startTime = e.time;

        this.startX = touch.pageX;
        this.startY = touch.pageY;
    },

    onTouchMove: function(e) {
        var touch = e.changedTouches[0],
            x = touch.pageX,
            absDeltaX = Math.abs(x - this.startX),
            maxDuration = this.getMaxDuration(),
            maxOffset = this.getMaxOffset(),
            time = e.time;

        if (time - this.startTime > maxDuration) {
            return this.fail(this.self.MAX_DURATION_EXCEEDED);
        }

        if (absDeltaX > maxOffset) {
            return this.fail(this.self.MAX_OFFSET_EXCEEDED);
        }
    },

    onTouchEnd: function(e) {
        if (this.onTouchMove(e) !== false) {
            var touch = e.changedTouches[0],
                y = touch.pageY,
                deltaY = y - this.startY,
                distance = Math.abs(deltaY),
                duration = e.time - this.startTime,
                minDistance = this.getMinDistance(),
                direction;

            if (distance < minDistance) {
                return this.fail(this.self.DISTANCE_NOT_ENOUGH);
            }

            direction = (deltaY < 0) ? 'up' : 'down';

            this.fire('swipe', e, [touch], {
                touch: touch,
                distance: distance,
                duration: duration,
                duration: duration
            });
        }
    }
});
