/**
 * @private
 */
Ext.define('Ext.event.publisher.ComponentDelegation', {
    extend: 'Ext.event.publisher.Publisher',

    requires: [
        'Ext.Component',
        'Ext.ComponentQuery'
    ],

    targetType: 'component',

    optimizedSelectorRegex: /^#([\w\-]+)((?:[\s]*)>(?:[\s]*)|(?:\s*))([\w\-]+)$/i,

    handledEvents: ['*'],

    getSubscribers: function(eventName, createIfNotExist) {
        var subscribers = this.subscribers,
            eventSubscribers = subscribers[eventName];

        if (!eventSubscribers && createIfNotExist) {
            eventSubscribers = subscribers[eventName] = {
                type: {
                    $length: 0
                },
                selector: [],
                $length: 0
            }
        }

        return eventSubscribers;
    },

    subscribe: function(target, eventName) {
        // Ignore id-only selectors since they are already handled
        if (this.idSelectorRegex.test(target)) {
            return false;
        }

        var optimizedSelector = target.match(this.optimizedSelectorRegex),
            subscribers = this.getSubscribers(eventName, true),
            typeSubscribers = subscribers.type,
            selectorSubscribers = subscribers.selector,
            id, isDescendant, type, map, subMap;

        if (optimizedSelector !== null) {
            id = optimizedSelector[1];
            isDescendant = optimizedSelector[2].indexOf('>') === -1;
            type = optimizedSelector[3];

            map = typeSubscribers[type];

            if (!map) {
                typeSubscribers[type] = map = {
                    descendents: {
                        $length: 0
                    },
                    children: {
                        $length: 0
                    },
                    $length: 0
                }
            }

            subMap = isDescendant ? map.descendents : map.children;

            if (subMap.hasOwnProperty(id)) {
                subMap[id]++;
                return true;
            }

            subMap[id] = 1;
            subMap.$length++;
            map.$length++;
            typeSubscribers.$length++;
        }
        else {
            if (selectorSubscribers.hasOwnProperty(target)) {
                selectorSubscribers[target]++;
                return true;
            }

            selectorSubscribers[target] = 1;
            selectorSubscribers.push(target);
        }

        subscribers.$length++;

        return true;
    },

    unsubscribe: function(target, eventName, all) {
        var subscribers = this.getSubscribers(eventName);

        if (!subscribers) {
            return false;
        }

        var match = target.match(this.optimizedSelectorRegex),
            typeSubscribers = subscribers.type,
            selectorSubscribers = subscribers.selector,
            id, isDescendant, type, map, subMap;

        all = Boolean(all);

        if (match !== null) {
            id = match[1];
            isDescendant = match[2].indexOf('>') === -1;
            type = match[3];

            map = typeSubscribers[type];

            if (!map) {
                return true;
            }

            subMap = isDescendant ? map.descendents : map.children;

            if (!subMap.hasOwnProperty(id) || (!all && --subMap[id] > 0)) {
                return true;
            }

            delete subMap[id];
            subMap.$length--;
            map.$length--;
            typeSubscribers.$length--;
        }
        else {
            if (!selectorSubscribers.hasOwnProperty(target) || (!all && --selectorSubscribers[target] > 0)) {
                return true;
            }

            delete selectorSubscribers[target];
            Ext.Array.remove(selectorSubscribers, target);
        }

        if (--subscribers.$length === 0) {
            delete this.subscribers[eventName];
        }

        return true;
    },

    notify: function(target, eventName) {
        var subscribers = this.getSubscribers(eventName),
            id, component;

        if (!subscribers || subscribers.$length === 0) {
            return false;
        }

        id = target.substr(1);
        component = Ext.ComponentManager.get(id);

        if (component) {
            this.dispatcher.doAddListener(this.targetType, target, eventName, 'publish', this, {
                args: [eventName, component]
            }, 'before');
        }
    },

    matchesSelector: function(component, selector) {
        return Ext.ComponentQuery.is(component, selector);
    },

    dispatch: function(target, eventName, args, connectedController) {
        this.dispatcher.doDispatchEvent(this.targetType, target, eventName, args, null, connectedController);
    },

    publish: function(eventName, component) {
        var subscribers = this.getSubscribers(eventName);

        if (!subscribers) {
            return;
        }

        var eventController = arguments[arguments.length - 1],
            typeSubscribers = subscribers.type,
            selectorSubscribers = subscribers.selector,
            args = Array.prototype.slice.call(arguments, 2, -2),
            types = component.xtypesChain,
            descendentsSubscribers, childrenSubscribers,
            parentId, ancestorIds, ancestorId, parentComponent,
            selector,
            i, ln, type, j, subLn;

        for (i = 0, ln = types.length; i < ln; i++) {
            type = types[i];

            subscribers = typeSubscribers[type];

            if (subscribers && subscribers.$length > 0) {
                descendentsSubscribers = subscribers.descendents;

                if (descendentsSubscribers.$length > 0) {
                    if (!ancestorIds) {
                        ancestorIds = component.getAncestorIds();
                    }

                    for (j = 0, subLn = ancestorIds.length; j < subLn; j++) {
                        ancestorId = ancestorIds[j];

                        if (descendentsSubscribers.hasOwnProperty(ancestorId)) {
                            this.dispatch('#' + ancestorId + ' ' + type, eventName, args, eventController);
                        }

                    }
                }

                childrenSubscribers = subscribers.children;

                if (childrenSubscribers.$length > 0) {
                    if (!parentId) {
                        if (ancestorIds) {
                            parentId = ancestorIds[0];
                        }
                        else {
                            parentComponent = component.getParent();
                            if (parentComponent) {
                                parentId = parentComponent.getId();
                            }
                        }
                    }

                    if (parentId) {
                        if (childrenSubscribers.hasOwnProperty(parentId)) {
                            this.dispatch('#' + parentId + ' > ' + type, eventName, args, eventController);
                        }
                    }
                }
            }
        }

        ln = selectorSubscribers.length;

        if (ln > 0) {
            for (i = 0; i < ln; i++) {
                selector = selectorSubscribers[i];

                if (this.matchesSelector(component, selector)) {
                    this.dispatch(selector, eventName, args, eventController);
                }
            }
        }
    }
});
