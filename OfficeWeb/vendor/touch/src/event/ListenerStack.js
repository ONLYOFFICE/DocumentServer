//@require @core

/**
 * @private
 */
Ext.define('Ext.event.ListenerStack', {

    currentOrder: 'current',

    length: 0,

    constructor: function() {
        this.listeners = {
            before: [],
            current: [],
            after: []
        };

        this.lateBindingMap = {};

        return this;
    },

    add: function(fn, scope, options, order) {
        var lateBindingMap = this.lateBindingMap,
            listeners = this.getAll(order),
            i = listeners.length,
            bindingMap, listener, id;

        if (typeof fn == 'string' && scope.isIdentifiable) {
            id = scope.getId();

            bindingMap = lateBindingMap[id];

            if (bindingMap) {
                if (bindingMap[fn]) {
                    return false;
                }
                else {
                    bindingMap[fn] = true;
                }
            }
            else {
                lateBindingMap[id] = bindingMap = {};
                bindingMap[fn] = true;
            }
        }
        else {
            if (i > 0) {
                while (i--) {
                    listener = listeners[i];

                    if (listener.fn === fn && listener.scope === scope) {
                        listener.options = options;
                        return false;
                    }
                }
            }
        }

        listener = this.create(fn, scope, options, order);

        if (options && options.prepend) {
            delete options.prepend;
            listeners.unshift(listener);
        }
        else {
            listeners.push(listener);
        }

        this.length++;

        return true;
    },

    getAt: function(index, order) {
        return this.getAll(order)[index];
    },

    getAll: function(order) {
        if (!order) {
            order = this.currentOrder;
        }

        return this.listeners[order];
    },

    count: function(order) {
        return this.getAll(order).length;
    },

    create: function(fn, scope, options, order) {
        return {
            stack: this,
            fn: fn,
            firingFn: false,
            boundFn: false,
            isLateBinding: typeof fn == 'string',
            scope: scope,
            options: options || {},
            order: order
        };
    },

    remove: function(fn, scope, order) {
        var listeners = this.getAll(order),
            i = listeners.length,
            isRemoved = false,
            lateBindingMap = this.lateBindingMap,
            listener, id;

        if (i > 0) {
            // Start from the end index, faster than looping from the
            // beginning for "single" listeners,
            // which are normally LIFO
            while (i--) {
                listener = listeners[i];

                if (listener.fn === fn && listener.scope === scope) {
                    listeners.splice(i, 1);
                    isRemoved = true;
                    this.length--;

                    if (typeof fn == 'string' && scope.isIdentifiable) {
                        id = scope.getId();

                        if (lateBindingMap[id] && lateBindingMap[id][fn]) {
                            delete lateBindingMap[id][fn];
                        }
                    }
                    break;
                }
            }
        }

        return isRemoved;
    }
});
