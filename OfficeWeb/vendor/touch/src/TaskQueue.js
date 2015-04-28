(function() {
    var lastTime = 0,
        vendors = ['ms', 'moz', 'webkit', 'o'],
        ln = vendors.length,
        i, vendor;

    for (i = 0; i < ln && !window.requestAnimationFrame; ++i) {
        vendor = vendors[i];
        window.requestAnimationFrame = window[vendor + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendor + 'CancelAnimationFrame'] || window[vendor + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime(),
                timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                id = window.setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());

/**
 * @private
 * Handle batch read / write of DOMs, currently used in SizeMonitor + PaintMonitor
 */
Ext.define('Ext.TaskQueue', {
    singleton: true,

    pending: false,

    mode: true,

    constructor: function() {
        this.readQueue = [];
        this.writeQueue = [];

        this.run = Ext.Function.bind(this.run, this);
    },

    requestRead: function(fn, scope, args) {
        this.request(true);
        this.readQueue.push(arguments);
    },

    requestWrite: function(fn, scope, args) {
        this.request(false);
        this.writeQueue.push(arguments);
    },

    request: function(mode) {
        if (!this.pending) {
            this.pending = true;
            this.mode = mode;

            requestAnimationFrame(this.run);
        }
    },

    run: function() {
        this.pending = false;

        var readQueue = this.readQueue,
            writeQueue = this.writeQueue,
            request = null,
            queue;

        if (this.mode) {
            queue = readQueue;

            if (writeQueue.length > 0) {
                request = false;
            }
        }
        else {
            queue = writeQueue;

            if (readQueue.length > 0) {
                request = true;
            }
        }

        var tasks = queue.slice(),
            i, ln, task, fn, scope;

        queue.length = 0;

        for (i = 0, ln = tasks.length; i < ln; i++) {
            task = tasks[i];
            fn = task[0];
            scope = task[1];

            if (typeof fn == 'string') {
                fn = scope[fn];
            }

            if (task.length > 2) {
                fn.apply(scope, task[2]);
            }
            else {
                fn.call(scope);
            }
        }

        tasks.length = 0;

        if (request !== null) {
            this.request(request);
        }
    }
});
