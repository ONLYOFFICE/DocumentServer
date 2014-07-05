//@require @core

/**
 * @private
 */
Ext.define('Ext.event.Dispatcher', {

    requires: [
        'Ext.event.ListenerStack',
        'Ext.event.Controller'
    ],

    statics: {
        getInstance: function() {
            if (!this.instance) {
                this.instance = new this();
            }

            return this.instance;
        },

        setInstance: function(instance) {
            this.instance = instance;

            return this;
        }
    },

    config: {
        publishers: {}
    },

    wildcard: '*',

    constructor: function(config) {
        this.listenerStacks = {};

        this.activePublishers = {};

        this.publishersCache = {};

        this.noActivePublishers = [];

        this.controller = null;

        this.initConfig(config);

        return this;
    },

    getListenerStack: function(targetType, target, eventName, createIfNotExist) {
        var listenerStacks = this.listenerStacks,
            map = listenerStacks[targetType],
            listenerStack;

        createIfNotExist = Boolean(createIfNotExist);

        if (!map) {
            if (createIfNotExist) {
                listenerStacks[targetType] = map = {};
            }
            else {
                return null;
            }
        }

        map = map[target];

        if (!map) {
            if (createIfNotExist) {
                listenerStacks[targetType][target] = map = {};
            }
            else {
                return null;
            }
        }

        listenerStack = map[eventName];

        if (!listenerStack) {
            if (createIfNotExist) {
                map[eventName] = listenerStack = new Ext.event.ListenerStack();
            }
            else {
                return null;
            }
        }

        return listenerStack;
    },

    getController: function(targetType, target, eventName, connectedController) {
        var controller = this.controller,
            info = {
                targetType: targetType,
                target: target,
                eventName: eventName
            };

        if (!controller) {
            this.controller = controller = new Ext.event.Controller();
        }

        if (controller.isFiring) {
            controller = new Ext.event.Controller();
        }

        controller.setInfo(info);

        if (connectedController && controller !== connectedController) {
            controller.connect(connectedController);
        }

        return controller;
    },

    applyPublishers: function(publishers) {
        var i, publisher;

        this.publishersCache = {};

        for (i in publishers) {
            if (publishers.hasOwnProperty(i)) {
                publisher = publishers[i];

                this.registerPublisher(publisher);
            }
        }

        return publishers;
    },

    registerPublisher: function(publisher) {
        var activePublishers = this.activePublishers,
            targetType = publisher.getTargetType(),
            publishers = activePublishers[targetType];

        if (!publishers) {
            activePublishers[targetType] = publishers = [];
        }

        publishers.push(publisher);

        publisher.setDispatcher(this);

        return this;
    },

    getCachedActivePublishers: function(targetType, eventName) {
        var cache = this.publishersCache,
            publishers;

        if ((publishers = cache[targetType]) && (publishers = publishers[eventName])) {
            return publishers;
        }

        return null;
    },

    cacheActivePublishers: function(targetType, eventName, publishers) {
        var cache = this.publishersCache;

        if (!cache[targetType]) {
            cache[targetType] = {};
        }

        cache[targetType][eventName] = publishers;

        return publishers;
    },

    getActivePublishers: function(targetType, eventName) {
        var publishers, activePublishers,
            i, ln, publisher;

        if ((publishers = this.getCachedActivePublishers(targetType, eventName))) {
            return publishers;
        }

        activePublishers = this.activePublishers[targetType];

        if (activePublishers) {
            publishers = [];

            for (i = 0,ln = activePublishers.length; i < ln; i++) {
                publisher = activePublishers[i];

                if (publisher.handles(eventName)) {
                    publishers.push(publisher);
                }
            }
        }
        else {
            publishers = this.noActivePublishers;
        }

        return this.cacheActivePublishers(targetType, eventName, publishers);
    },

    hasListener: function(targetType, target, eventName) {
        var listenerStack = this.getListenerStack(targetType, target, eventName);

        if (listenerStack) {
            return listenerStack.count() > 0;
        }

        return false;
    },

    addListener: function(targetType, target, eventName) {
        var publishers = this.getActivePublishers(targetType, eventName),
            ln = publishers.length,
            i;

        if (ln > 0) {
            for (i = 0; i < ln; i++) {
                publishers[i].subscribe(target, eventName);
            }
        }

        return this.doAddListener.apply(this, arguments);
    },

    doAddListener: function(targetType, target, eventName, fn, scope, options, order) {
        var listenerStack = this.getListenerStack(targetType, target, eventName, true);

        return listenerStack.add(fn, scope, options, order);
    },

    removeListener: function(targetType, target, eventName) {
        var publishers = this.getActivePublishers(targetType, eventName),
            ln = publishers.length,
            i;

        if (ln > 0) {
            for (i = 0; i < ln; i++) {
                publishers[i].unsubscribe(target, eventName);
            }
        }

        return this.doRemoveListener.apply(this, arguments);
    },

    doRemoveListener: function(targetType, target, eventName, fn, scope, order) {
        var listenerStack = this.getListenerStack(targetType, target, eventName);

        if (listenerStack === null) {
            return false;
        }

        return listenerStack.remove(fn, scope, order);
    },

    clearListeners: function(targetType, target, eventName) {
        var listenerStacks = this.listenerStacks,
            ln = arguments.length,
            stacks, publishers, i, publisherGroup;

        if (ln === 3) {
            if (listenerStacks[targetType] && listenerStacks[targetType][target]) {
                this.removeListener(targetType, target, eventName);
                delete listenerStacks[targetType][target][eventName];
            }
        }
        else if (ln === 2) {
            if (listenerStacks[targetType]) {
                stacks = listenerStacks[targetType][target];

                if (stacks) {
                    for (eventName in stacks) {
                        if (stacks.hasOwnProperty(eventName)) {
                            publishers = this.getActivePublishers(targetType, eventName);

                            for (i = 0,ln = publishers.length; i < ln; i++) {
                                publishers[i].unsubscribe(target, eventName, true);
                            }
                        }
                    }

                    delete listenerStacks[targetType][target];
                }
            }
        }
        else if (ln === 1) {
            publishers = this.activePublishers[targetType];

            for (i = 0,ln = publishers.length; i < ln; i++) {
                publishers[i].unsubscribeAll();
            }

            delete listenerStacks[targetType];
        }
        else {
            publishers = this.activePublishers;

            for (targetType in publishers) {
                if (publishers.hasOwnProperty(targetType)) {
                    publisherGroup = publishers[targetType];

                    for (i = 0,ln = publisherGroup.length; i < ln; i++) {
                        publisherGroup[i].unsubscribeAll();
                    }
                }
            }

            delete this.listenerStacks;
            this.listenerStacks = {};
        }

        return this;
    },

    dispatchEvent: function(targetType, target, eventName) {
        var publishers = this.getActivePublishers(targetType, eventName),
            ln = publishers.length,
            i;

        if (ln > 0) {
            for (i = 0; i < ln; i++) {
                publishers[i].notify(target, eventName);
            }
        }

        return this.doDispatchEvent.apply(this, arguments);
    },

    doDispatchEvent: function(targetType, target, eventName, args, action, connectedController) {
        var listenerStack = this.getListenerStack(targetType, target, eventName),
            wildcardStacks = this.getWildcardListenerStacks(targetType, target, eventName),
            controller;

        if ((listenerStack === null || listenerStack.length == 0)) {
            if (wildcardStacks.length == 0 && !action) {
                return;
            }
        }
        else {
            wildcardStacks.push(listenerStack);
        }

        controller = this.getController(targetType, target, eventName, connectedController);
        controller.setListenerStacks(wildcardStacks);
        controller.fire(args, action);

        return !controller.isInterrupted();
    },

    getWildcardListenerStacks: function(targetType, target, eventName) {
        var stacks = [],
            wildcard = this.wildcard,
            isEventNameNotWildcard = eventName !== wildcard,
            isTargetNotWildcard = target !== wildcard,
            stack;

        if (isEventNameNotWildcard && (stack = this.getListenerStack(targetType, target, wildcard))) {
            stacks.push(stack);
        }

        if (isTargetNotWildcard && (stack = this.getListenerStack(targetType, wildcard, eventName))) {
            stacks.push(stack);
        }

        return stacks;
    }
});
