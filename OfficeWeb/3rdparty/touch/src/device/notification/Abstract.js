/**
 * @private
 */
Ext.define('Ext.device.notification.Abstract', {
    /**
     * A simple way to show a notification.
     *
     *     Ext.device.Notification.show({
     *        title: 'Verification',
     *        message: 'Is your email address is: test@sencha.com',
     *        buttons: Ext.MessageBox.OKCANCEL,
     *        callback: function(button) {
     *            if (button == "ok") {
     *                console.log('Verified');
     *            } else {
     *                console.log('Nope.');
     *            }
     *        }
     *     });
     *
     * @param {Object} config An object which contains the following config options:
     *
     * @param {String} config.title The title of the notification
     *
     * @param {String} config.message The message to be displayed on the notification
     *
     * @param {String/String[]} [config.buttons="OK"]
     * The buttons to be displayed on the notification. It can be a string, which is the title of the button, or an array of multiple strings.
     * Please not that you should not use more than 2 buttons, as they may not be displayed correct on all devices.
     *
     * @param {Function} config.callback
     * A callback function which is called when the notification is dismissed by clicking on the configured buttons.
     * @param {String} config.callback.buttonId The id of the button pressed, one of: 'ok', 'yes', 'no', 'cancel'.
     *
     * @param {Object} config.scope The scope of the callback function
     */
    show: function(config) {
        if (!config.message) {
            throw('[Ext.device.Notification#show] You passed no message');
        }

        if (!config.buttons) {
            config.buttons = "OK";
        }

        if (!Ext.isArray(config.buttons)) {
            config.buttons = [config.buttons];
        }

        if (!config.scope) {
            config.scope = this;
        }

        return config;
    },

    /**
     * Vibrates the device.
     */
    vibrate: Ext.emptyFn
});
