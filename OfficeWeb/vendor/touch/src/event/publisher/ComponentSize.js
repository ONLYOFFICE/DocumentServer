/**
 * @private
 */
Ext.define('Ext.event.publisher.ComponentSize', {

    extend: 'Ext.event.publisher.Publisher',

    requires: [
        'Ext.ComponentManager'
    ],

    targetType: 'component',

    handledEvents: ['resize', 'innerresize'],

    constructor: function() {
        this.callParent(arguments);

        this.sizeMonitors = {};
    },

    getSubscribers: function(target, createIfNotExist) {
        var subscribers = this.subscribers;

        if (!subscribers.hasOwnProperty(target)) {
            if (!createIfNotExist) {
                return null;
            }

            subscribers[target] = {
                $length: 0
            };
        }

        return subscribers[target];
    },

    subscribe: function(target, eventName) {
        var match = target.match(this.idSelectorRegex),
            sizeMonitors = this.sizeMonitors,
            dispatcher = this.dispatcher,
            targetType = this.targetType,
            subscribers, component, id;

        if (!match) {
            return false;
        }

        id = match[1];
        subscribers = this.getSubscribers(target, true);
        subscribers.$length++;

        if (subscribers.hasOwnProperty(eventName)) {
            subscribers[eventName]++;
            return true;
        }

        if (subscribers.$length === 1) {
            dispatcher.addListener(targetType, target, 'painted', 'onComponentPainted', this, null, 'before');
        }

        component = Ext.ComponentManager.get(id);

        //<debug error>
        if (!component) {
            Ext.Logger.error("Adding a listener to the 'resize' event of a non-existing component");
        }
        //</debug>

        if (!sizeMonitors[target]) {
            sizeMonitors[target] = {};
        }

        sizeMonitors[target][eventName] = new Ext.util.SizeMonitor({
            element: eventName === 'resize' ? component.element : component.innerElement,
            callback: this.onComponentSizeChange,
            scope: this,
            args: [this, target, eventName]
        });

        subscribers[eventName] = 1;
        return true;
    },

    unsubscribe: function(target, eventName, all) {
        var match = target.match(this.idSelectorRegex),
            dispatcher = this.dispatcher,
            targetType = this.targetType,
            sizeMonitors = this.sizeMonitors,
            subscribers,
            id;

        if (!match || !(subscribers = this.getSubscribers(target))) {
            return false;
        }

        id = match[1];

        if (!subscribers.hasOwnProperty(eventName) || (!all && --subscribers[eventName] > 0)) {
            return true;
        }

        delete subscribers[eventName];

        sizeMonitors[target][eventName].destroy();
        delete sizeMonitors[target][eventName];

        if (--subscribers.$length === 0) {
            delete sizeMonitors[target];
            delete this.subscribers[target];
            dispatcher.removeListener(targetType, target, 'painted', 'onComponentPainted', this, 'before');
        }

        return true;
    },

    onComponentPainted: function(component) {
        var target = component.getObservableId(),
            sizeMonitors = this.sizeMonitors[target];

        if (sizeMonitors.resize) {
            sizeMonitors.resize.refresh();
        }

        if (sizeMonitors.innerresize) {
            sizeMonitors.innerresize.refresh();
        }
    },

    onComponentSizeChange: function(component, observableId, eventName) {
        this.dispatcher.doDispatchEvent(this.targetType, observableId, eventName, [component]);
    }
});
