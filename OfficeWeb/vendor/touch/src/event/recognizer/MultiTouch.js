/**
 * @private
 */
Ext.define('Ext.event.recognizer.MultiTouch', {
    extend: 'Ext.event.recognizer.Touch',

    requiredTouchesCount: 2,

    isTracking: false,

    isStarted: false,

    onTouchStart: function(e) {
        var requiredTouchesCount = this.requiredTouchesCount,
            touches = e.touches,
            touchesCount = touches.length;

        if (touchesCount === requiredTouchesCount) {
            this.start(e);
        }
        else if (touchesCount > requiredTouchesCount) {
            this.end(e);
        }
    },

    onTouchEnd: function(e) {
        this.end(e);
    },

    start: function() {
        if (!this.isTracking) {
            this.isTracking = true;
            this.isStarted = false;
        }
    },

    end: function(e) {
        if (this.isTracking) {
            this.isTracking = false;

            if (this.isStarted) {
                this.isStarted = false;

                this.fireEnd(e);
            }
        }
    }
});
