/**
 * @private
 */
Ext.define('Ext.event.recognizer.SingleTouch', {
    extend: 'Ext.event.recognizer.Touch',

    inheritableStatics: {
        NOT_SINGLE_TOUCH: 0x01,
        TOUCH_MOVED:  0x02
    },

    onTouchStart: function(e) {
        if (e.touches.length > 1) {
            return this.fail(this.self.NOT_SINGLE_TOUCH);
        }
    }
});

