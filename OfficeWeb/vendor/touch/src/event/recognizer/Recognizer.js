/**
 * A base class for all event recognizers in Sencha Touch.
 *
 * Sencha Touch, by default, includes various different {@link Ext.event.recognizer.Recognizer} subclasses to recognize
 * events happening in your application.
 *
 * ## Default recognizers
 *
 * * {@link Ext.event.recognizer.Tap}
 * * {@link Ext.event.recognizer.DoubleTap}
 * * {@link Ext.event.recognizer.LongPress}
 * * {@link Ext.event.recognizer.Drag}
 * * {@link Ext.event.recognizer.HorizontalSwipe}
 * * {@link Ext.event.recognizer.Pinch}
 * * {@link Ext.event.recognizer.Rotate}
 *
 * ## Additional recognizers
 *
 * * {@link Ext.event.recognizer.VerticalSwipe}
 *
 * If you want to create custom recognizers, or disable recognizers in your Sencha Touch application, please refer to the
 * documentation in {@link Ext#setup}.
 *
 * @private
 */
Ext.define('Ext.event.recognizer.Recognizer', {
    mixins: ['Ext.mixin.Identifiable'],

    handledEvents: [],

    config: {
        onRecognized: Ext.emptyFn,
        onFailed: Ext.emptyFn,
        callbackScope: null
    },

    constructor: function(config) {
        this.initConfig(config);

        return this;
    },

    getHandledEvents: function() {
        return this.handledEvents;
    },

    onStart: Ext.emptyFn,

    onEnd: Ext.emptyFn,

    fail: function() {
        this.getOnFailed().apply(this.getCallbackScope(), arguments);

        return false;
    },

    fire: function() {
        this.getOnRecognized().apply(this.getCallbackScope(), arguments);
    }
});
