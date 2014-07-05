/**
 * A event recognizer created to recognize horizontal swipe movements.
 *
 * @private
 */
Ext.define('Ext.event.recognizer.HorizontalSwipe', {
    extend: 'Ext.event.recognizer.Swipe',

    handledEvents: ['swipe'],

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
            y = touch.pageY,
            absDeltaY = Math.abs(y - this.startY),
            time = e.time,
            maxDuration = this.getMaxDuration(),
            maxOffset = this.getMaxOffset();

        if (time - this.startTime > maxDuration) {
            return this.fail(this.self.MAX_DURATION_EXCEEDED);
        }

        if (absDeltaY > maxOffset) {
            return this.fail(this.self.MAX_OFFSET_EXCEEDED);
        }
    },

    onTouchEnd: function(e) {
        if (this.onTouchMove(e) !== false) {
            var touch = e.changedTouches[0],
                x = touch.pageX,
                deltaX = x - this.startX,
                distance = Math.abs(deltaX),
                duration = e.time - this.startTime,
                minDistance = this.getMinDistance(),
                direction;

            if (distance < minDistance) {
                return this.fail(this.self.DISTANCE_NOT_ENOUGH);
            }

            direction = (deltaX < 0) ? 'left' : 'right';

            this.fire('swipe', e, [touch], {
                touch: touch,
                direction: direction,
                distance: distance,
                duration: duration
            });
        }
    }
});
