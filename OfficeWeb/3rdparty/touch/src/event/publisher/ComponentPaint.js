/**
 * @private
 */
Ext.define('Ext.event.publisher.ComponentPaint', {

    extend: 'Ext.event.publisher.Publisher',

    targetType: 'component',

    handledEvents: ['erased'],

    eventNames: {
        painted: 'painted',
        erased: 'erased'
    },

    constructor: function() {
        this.callParent(arguments);

        this.hiddenQueue = {};
        this.renderedQueue = {};
    },

    getSubscribers: function(eventName, createIfNotExist) {
        var subscribers = this.subscribers;

        if (!subscribers.hasOwnProperty(eventName)) {
            if (!createIfNotExist) {
                return null;
            }

            subscribers[eventName] = {
                $length: 0
            };
        }

        return subscribers[eventName];
    },

    setDispatcher: function(dispatcher) {
        var targetType = this.targetType;

        dispatcher.doAddListener(targetType, '*', 'renderedchange', 'onBeforeComponentRenderedChange', this, null, 'before');
        dispatcher.doAddListener(targetType, '*', 'hiddenchange', 'onBeforeComponentHiddenChange', this, null, 'before');
        dispatcher.doAddListener(targetType, '*', 'renderedchange', 'onComponentRenderedChange', this, null, 'after');
        dispatcher.doAddListener(targetType, '*', 'hiddenchange', 'onComponentHiddenChange', this, null, 'after');

        return this.callParent(arguments);
    },

    subscribe: function(target, eventName) {
        var match = target.match(this.idSelectorRegex),
            subscribers,
            id;

        if (!match) {
            return false;
        }

        id = match[1];

        subscribers = this.getSubscribers(eventName, true);

        if (subscribers.hasOwnProperty(id)) {
            subscribers[id]++;
            return true;
        }

        subscribers[id] = 1;
        subscribers.$length++;

        return true;
    },

    unsubscribe: function(target, eventName, all) {
        var match = target.match(this.idSelectorRegex),
            subscribers,
            id;

        if (!match || !(subscribers = this.getSubscribers(eventName))) {
            return false;
        }

        id = match[1];

        if (!subscribers.hasOwnProperty(id) || (!all && --subscribers[id] > 0)) {
            return true;
        }

        delete subscribers[id];

        if (--subscribers.$length === 0) {
            delete this.subscribers[eventName];
        }

        return true;
    },

    onBeforeComponentRenderedChange: function(container, component, rendered) {
        var eventNames = this.eventNames,
            eventName = rendered ? eventNames.painted : eventNames.erased,
            subscribers = this.getSubscribers(eventName),
            queue;

        if (subscribers && subscribers.$length > 0) {
            this.renderedQueue[component.getId()] = queue = [];
            this.publish(subscribers, component, eventName, queue);
        }
    },

    onBeforeComponentHiddenChange: function(component, hidden) {
        var eventNames = this.eventNames,
            eventName = hidden ? eventNames.erased : eventNames.painted,
            subscribers = this.getSubscribers(eventName),
            queue;

        if (subscribers && subscribers.$length > 0) {
            this.hiddenQueue[component.getId()] = queue = [];
            this.publish(subscribers, component, eventName, queue);
        }
    },

    onComponentRenderedChange: function(container, component) {
        var renderedQueue = this.renderedQueue,
            id = component.getId(),
            queue;

        if (!renderedQueue.hasOwnProperty(id)) {
            return;
        }

        queue = renderedQueue[id];
        delete renderedQueue[id];

        if (queue.length > 0) {
            this.dispatchQueue(queue);
        }
    },

    onComponentHiddenChange: function(component) {
        var hiddenQueue = this.hiddenQueue,
            id = component.getId(),
            queue;

        if (!hiddenQueue.hasOwnProperty(id)) {
            return;
        }

        queue = hiddenQueue[id];
        delete hiddenQueue[id];

        if (queue.length > 0) {
            this.dispatchQueue(queue);
        }
    },

    dispatchQueue: function(dispatchingQueue) {
        var dispatcher = this.dispatcher,
            targetType = this.targetType,
            eventNames = this.eventNames,
            queue = dispatchingQueue.slice(),
            ln = queue.length,
            i, item, component, eventName, isPainted;

        dispatchingQueue.length = 0;

        if (ln > 0) {
            for (i = 0; i < ln; i++) {
                item = queue[i];
                component = item.component;
                eventName = item.eventName;
                isPainted = component.isPainted();

                if ((eventName === eventNames.painted && isPainted) || eventName === eventNames.erased && !isPainted) {
                    dispatcher.doDispatchEvent(targetType, '#' + item.id, eventName, [component]);
                }
            }
            queue.length = 0;
        }

    },

    publish: function(subscribers, component, eventName, dispatchingQueue) {
        var id = component.getId(),
            needsDispatching = false,
            eventNames, items, i, ln, isPainted;

        if (subscribers[id]) {
            eventNames = this.eventNames;

            isPainted = component.isPainted();

            if ((eventName === eventNames.painted && !isPainted) || eventName === eventNames.erased && isPainted) {
                needsDispatching = true;
            }
            else {
                return this;
            }
        }

        if (component.isContainer) {
            items = component.getItems().items;

            for (i = 0,ln = items.length; i < ln; i++) {
                this.publish(subscribers, items[i], eventName, dispatchingQueue);
            }
        }
        else if (component.isDecorator) {
            this.publish(subscribers, component.getComponent(), eventName, dispatchingQueue);
        }

        if (needsDispatching) {
            dispatchingQueue.push({
                id: id,
                eventName: eventName,
                component: component
            });
        }
    }
});
