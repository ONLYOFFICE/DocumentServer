//<feature logger>
/**
 * @class Ext.Logger
 * Logs messages to help with debugging.
 *
 * ## Example
 *
 *     Ext.Logger.deprecate('This method is no longer supported.');
 *
 * @singleton
 */
(function() {
var Logger = Ext.define('Ext.log.Logger', {

    extend: 'Ext.log.Base',

    statics: {
        defaultPriority: 'info',

        priorities: {
            /**
             * @method verbose
             * Convenience method for {@link #log} with priority 'verbose'.
             */
            verbose:    0,
            /**
             * @method info
             * Convenience method for {@link #log} with priority 'info'.
             */
            info:       1,
            /**
             * @method deprecate
             * Convenience method for {@link #log} with priority 'deprecate'.
             */
            deprecate:  2,
            /**
             * @method warn
             * Convenience method for {@link #log} with priority 'warn'.
             */
            warn:       3,
            /**
             * @method error
             * Convenience method for {@link #log} with priority 'error'.
             */
            error:      4
        }
    },

    config: {
        enabled: true,
        minPriority: 'deprecate',
        writers: {}
    },

    /**
     * Logs a message to help with debugging.
     * @param {String} message  Message to log.
     * @param {Number} priority Priority of the log message.
     */
    log: function(message, priority, callerId) {
        if (!this.getEnabled()) {
            return this;
        }

        var statics = Logger,
            priorities = statics.priorities,
            priorityValue = priorities[priority],
            caller = this.log.caller,
            callerDisplayName = '',
            writers = this.getWriters(),
            event, i, originalCaller;

        if (!priority) {
            priority = 'info';
        }

        if (priorities[this.getMinPriority()] > priorityValue) {
            return this;
        }

        if (!callerId) {
            callerId = 1;
        }

        if (Ext.isArray(message)) {
            message = message.join(" ");
        }
        else {
            message = String(message);
        }

        if (typeof callerId == 'number') {
            i = callerId;

            do {
                i--;

                caller = caller.caller;

                if (!caller) {
                    break;
                }

                if (!originalCaller) {
                    originalCaller = caller.caller;
                }

                if (i <= 0 && caller.displayName) {
                    break;
                }
            }
            while (caller !== originalCaller);

            callerDisplayName = Ext.getDisplayName(caller);
        }
        else {
            caller = caller.caller;
            callerDisplayName = Ext.getDisplayName(callerId) + '#' + caller.$name;
        }

        event = {
            time: Ext.Date.now(),
            priority: priorityValue,
            priorityName: priority,
            message: message,
            caller: caller,
            callerDisplayName: callerDisplayName
        };

        for (i in writers) {
            if (writers.hasOwnProperty(i)) {
                writers[i].write(Ext.merge({}, event));
            }
        }

        return this;
    }

}, function() {
    Ext.Object.each(this.priorities, function(priority) {
        this.override(priority, function(message, callerId) {
            if (!callerId) {
                callerId = 1;
            }

            if (typeof callerId == 'number') {
                callerId += 1;
            }

            this.log(message, priority, callerId);
        });
    }, this);
});

})();
//</feature>
