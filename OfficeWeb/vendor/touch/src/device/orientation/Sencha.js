/**
 * @private
 */
Ext.define('Ext.device.orientation.Sencha', {
    extend: 'Ext.device.orientation.Abstract',

    requires: [
        'Ext.device.Communicator'
    ],

    /**
     * From the native shell, the callback needs to be invoked infinitely using a timer, ideally 50 times per second.
     * The callback expects one event object argument, the format of which should looks like this:
     *
     *     {
     *          alpha: 0,
     *          beta: 0,
     *          gamma: 0
     *     }
     *
     * Refer to [Safari DeviceOrientationEvent Class Reference][1] for more details.
     * 
     * [1]: http://developer.apple.com/library/safari/#documentation/SafariDOMAdditions/Reference/DeviceOrientationEventClassRef/DeviceOrientationEvent/DeviceOrientationEvent.html
     */
    initialize: function() {
        Ext.device.Communicator.send({
            command: 'Orientation#watch',
            callbacks: {
                callback: this.onDeviceOrientation
            },
            scope: this
        });
    }
});
