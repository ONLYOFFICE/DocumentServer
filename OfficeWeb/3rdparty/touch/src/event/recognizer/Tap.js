/**
 * A simple event recognizer which knows when you tap.
 *
 * @private
 */
Ext.define('Ext.event.recognizer.Tap', {

    handledEvents: ['tap'],

    /**
     * @member Ext.dom.Element
     * @event tap
     * Fires when you tap
     * @param {Ext.event.Event} event The {@link Ext.event.Event} event encapsulating the DOM event.
     * @param {HTMLElement} node The target of the event.
     * @param {Object} options The options object passed to Ext.mixin.Observable.addListener.
     */

    /**
     * @member Ext.dom.Element
     * @event touchstart
     * Fires when touch starts.
     * @param {Ext.event.Event} event The {@link Ext.event.Event} event encapsulating the DOM event.
     * @param {HTMLElement} node The target of the event.
     * @param {Object} options The options object passed to Ext.mixin.Observable.addListener.
     */

    /**
     * @member Ext.dom.Element
     * @event tapstart
     * @inheritdoc Ext.dom.Element#touchstart
     * @deprecated 2.0.0 Please add listener to 'touchstart' event instead
     */

    /**
     * @member Ext.dom.Element
     * @event touchmove
     * Fires when movement while touching.
     * @param {Ext.event.Event} event The {@link Ext.event.Event} event encapsulating the DOM event.
     * @param {HTMLElement} node The target of the event.
     * @param {Object} options The options object passed to Ext.mixin.Observable.addListener.
     */

    /**
     * @member Ext.dom.Element
     * @event tapcancel
     * @inheritdoc Ext.dom.Element#touchmove
     * @deprecated 2.0.0 Please add listener to 'touchmove' event instead
     */

    extend: 'Ext.event.recognizer.SingleTouch',

    onTouchMove: function() {
        return this.fail(this.self.TOUCH_MOVED);
    },

    onTouchEnd: function(e) {
        var touch = e.changedTouches[0];

        this.fire('tap', e, [touch]);
    }

}, function() {
    //<deprecated product=touch since=2.0>
    this.override({
        handledEvents: ['tap', 'tapstart', 'tapcancel'],

        onTouchStart: function(e) {
            if (this.callOverridden(arguments) === false) {
                return false;
            }

            this.fire('tapstart', e, [e.changedTouches[0]]);
        },

        onTouchMove: function(e) {
            this.fire('tapcancel', e, [e.changedTouches[0]]);

            return this.callOverridden(arguments);
        }
    });
    //</deprecated>
});
