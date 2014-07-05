//@require @core

/**
 * @private
 */
Ext.define('Ext.event.Controller', {

    isFiring: false,

    listenerStack: null,

    constructor: function(info) {
        this.firingListeners = [];
        this.firingArguments = [];

        this.setInfo(info);

        return this;
    },

    setInfo: function(info) {
        this.info = info;
    },

    getInfo: function() {
        return this.info;
    },

    setListenerStacks: function(listenerStacks) {
        this.listenerStacks = listenerStacks;
    },

    fire: function(args, action) {
        var listenerStacks = this.listenerStacks,
            firingListeners = this.firingListeners,
            firingArguments = this.firingArguments,
            push = firingListeners.push,
            ln = listenerStacks.length,
            listeners, beforeListeners, currentListeners, afterListeners,
            isActionBefore = false,
            isActionAfter = false,
            i;

        firingListeners.length = 0;

        if (action) {
            if (action.order !== 'after') {
                isActionBefore = true;
            }
            else {
                isActionAfter = true;
            }
        }

        if (ln === 1) {
            listeners = listenerStacks[0].listeners;
            beforeListeners = listeners.before;
            currentListeners = listeners.current;
            afterListeners = listeners.after;

            if (beforeListeners.length > 0) {
                push.apply(firingListeners, beforeListeners);
            }

            if (isActionBefore) {
                push.call(firingListeners, action);
            }

            if (currentListeners.length > 0) {
                push.apply(firingListeners, currentListeners);
            }

            if (isActionAfter) {
                push.call(firingListeners, action);
            }

            if (afterListeners.length > 0) {
                push.apply(firingListeners, afterListeners);
            }
        }
        else {
            for (i = 0; i < ln; i++) {
                beforeListeners = listenerStacks[i].listeners.before;
                if (beforeListeners.length > 0) {
                    push.apply(firingListeners, beforeListeners);
                }
            }

            if (isActionBefore) {
                push.call(firingListeners, action);
            }

            for (i = 0; i < ln; i++) {
                currentListeners = listenerStacks[i].listeners.current;
                if (currentListeners.length > 0) {
                    push.apply(firingListeners, currentListeners);
                }
            }

            if (isActionAfter) {
                push.call(firingListeners, action);
            }

            for (i = 0; i < ln; i++) {
                afterListeners = listenerStacks[i].listeners.after;
                if (afterListeners.length > 0) {
                    push.apply(firingListeners, afterListeners);
                }
            }
        }

        if (firingListeners.length === 0) {
            return this;
        }

        if (!args) {
            args = [];
        }

        firingArguments.length = 0;
        firingArguments.push.apply(firingArguments, args);

        // Backwards compatibility
        firingArguments.push(null, this);

        this.doFire();

        return this;
    },

    doFire: function() {
        var firingListeners = this.firingListeners,
            firingArguments = this.firingArguments,
            optionsArgumentIndex = firingArguments.length - 2,
            i, ln, listener, options, fn, firingFn,
            boundFn, isLateBinding, scope, args, result;

        this.isPausing = false;
        this.isPaused = false;
        this.isStopped = false;
        this.isFiring = true;

        for (i = 0,ln = firingListeners.length; i < ln; i++) {
            listener = firingListeners[i];
            options = listener.options;
            fn = listener.fn;
            firingFn = listener.firingFn;
            boundFn = listener.boundFn;
            isLateBinding = listener.isLateBinding;
            scope = listener.scope;

            // Re-bind the callback if it has changed since the last time it's bound (overridden)
            if (isLateBinding && boundFn && boundFn !== scope[fn]) {
                boundFn = false;
                firingFn = false;
            }

            if (!boundFn) {
                if (isLateBinding) {
                    boundFn = scope[fn];

                    if (!boundFn) {
                        continue;
                    }
                }
                else {
                    boundFn = fn;
                }

                listener.boundFn = boundFn;
            }

            if (!firingFn) {
                firingFn = boundFn;

                if (options.buffer) {
                    firingFn = Ext.Function.createBuffered(firingFn, options.buffer, scope);
                }

                if (options.delay) {
                    firingFn = Ext.Function.createDelayed(firingFn, options.delay, scope);
                }

                listener.firingFn = firingFn;
            }

            firingArguments[optionsArgumentIndex] = options;

            args = firingArguments;

            if (options.args) {
                args = options.args.concat(args);
            }

            if (options.single === true) {
                listener.stack.remove(fn, scope, listener.order);
            }

            result = firingFn.apply(scope, args);

            if (result === false) {
                this.stop();
            }

            if (this.isStopped) {
                break;
            }

            if (this.isPausing) {
                this.isPaused = true;
                firingListeners.splice(0, i + 1);
                return;
            }
        }

        this.isFiring = false;
        this.listenerStacks = null;
        firingListeners.length = 0;
        firingArguments.length = 0;
        this.connectingController = null;
    },

    connect: function(controller) {
        this.connectingController = controller;
    },

    resume: function() {
        var connectingController = this.connectingController;

        this.isPausing = false;

        if (this.isPaused && this.firingListeners.length > 0) {
            this.isPaused = false;
            this.doFire();
        }

        if (connectingController) {
            connectingController.resume();
        }

        return this;
    },

    isInterrupted: function() {
        return this.isStopped || this.isPaused;
    },

    stop: function() {
        var connectingController = this.connectingController;

        this.isStopped = true;

        if (connectingController) {
            this.connectingController = null;
            connectingController.stop();
        }

        this.isFiring = false;

        this.listenerStacks = null;

        return this;
    },

    pause: function() {
        var connectingController = this.connectingController;

        this.isPausing = true;

        if (connectingController) {
            connectingController.pause();
        }

        return this;
    }
});
