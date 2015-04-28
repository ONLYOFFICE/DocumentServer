/**
 * @private
 */
Ext.define('Ext.event.publisher.TouchGesture', {

    extend: 'Ext.event.publisher.Dom',

    requires: [
        'Ext.util.Point',
        'Ext.event.Touch'
    ],

    handledEvents: ['touchstart', 'touchmove', 'touchend', 'touchcancel'],

    moveEventName: 'touchmove',

    config: {
        moveThrottle: 1,
        buffering: {
            enabled: false,
            interval: 10
        },
        recognizers: {}
    },

    currentTouchesCount: 0,

    constructor: function(config) {
        this.processEvents = Ext.Function.bind(this.processEvents, this);

        this.eventProcessors = {
            touchstart: this.onTouchStart,
            touchmove: this.onTouchMove,
            touchend: this.onTouchEnd,
            touchcancel: this.onTouchEnd
        };

        this.eventToRecognizerMap = {};

        this.activeRecognizers = [];

        this.currentRecognizers = [];

        this.currentTargets = {};

        this.currentTouches = {};

        this.buffer = [];

        this.initConfig(config);

        return this.callParent();
    },

    applyBuffering: function(buffering) {
        if (buffering.enabled === true) {
            this.bufferTimer = setInterval(this.processEvents, buffering.interval);
        }
        else {
            clearInterval(this.bufferTimer);
        }

        return buffering;
    },

    applyRecognizers: function(recognizers) {
        var i, recognizer;

        for (i in recognizers) {
            if (recognizers.hasOwnProperty(i)) {
                recognizer = recognizers[i];

                if (recognizer) {
                    this.registerRecognizer(recognizer);
                }
            }
        }

        return recognizers;
    },

    handles: function(eventName) {
        return this.callParent(arguments) || this.eventToRecognizerMap.hasOwnProperty(eventName);
    },

    doesEventBubble: function() {
        // All touch events bubble
        return true;
    },

    eventLogs: [],

    onEvent: function(e) {
        var buffering = this.getBuffering();

        e = new Ext.event.Touch(e);

        if (buffering.enabled) {
            this.buffer.push(e);
        }
        else {
            this.processEvent(e);
        }
    },

    processEvents: function() {
        var buffer = this.buffer,
            ln = buffer.length,
            moveEvents = [],
            events, event, i;

        if (ln > 0) {
            events = buffer.slice(0);
            buffer.length = 0;

            for (i = 0; i < ln; i++) {
                event = events[i];
                if (event.type === this.moveEventName) {
                    moveEvents.push(event);
                }
                else {
                    if (moveEvents.length > 0) {
                        this.processEvent(this.mergeEvents(moveEvents));
                        moveEvents.length = 0;
                    }

                    this.processEvent(event);
                }
            }

            if (moveEvents.length > 0) {
                this.processEvent(this.mergeEvents(moveEvents));
                moveEvents.length = 0;
            }
        }
    },

    mergeEvents: function(events) {
        var changedTouchesLists = [],
            ln = events.length,
            i, event, targetEvent;

        targetEvent = events[ln - 1];

        if (ln === 1) {
            return targetEvent;
        }

        for (i = 0; i < ln; i++) {
            event = events[i];
            changedTouchesLists.push(event.changedTouches);
        }

        targetEvent.changedTouches = this.mergeTouchLists(changedTouchesLists);

        return targetEvent;
    },

    mergeTouchLists: function(touchLists) {
        var touches = {},
            list = [],
            i, ln, touchList, j, subLn, touch, identifier;

        for (i = 0,ln = touchLists.length; i < ln; i++) {
            touchList = touchLists[i];

            for (j = 0,subLn = touchList.length; j < subLn; j++) {
                touch = touchList[j];
                identifier = touch.identifier;
                touches[identifier] = touch;
            }
        }

        for (identifier in touches) {
            if (touches.hasOwnProperty(identifier)) {
                list.push(touches[identifier]);
            }
        }

        return list;
    },

    registerRecognizer: function(recognizer) {
        var map = this.eventToRecognizerMap,
            activeRecognizers = this.activeRecognizers,
            handledEvents = recognizer.getHandledEvents(),
            i, ln, eventName;

        recognizer.setOnRecognized(this.onRecognized);
        recognizer.setCallbackScope(this);

        for (i = 0,ln = handledEvents.length; i < ln; i++) {
            eventName = handledEvents[i];

            map[eventName] = recognizer;
        }

        activeRecognizers.push(recognizer);

        return this;
    },

    onRecognized: function(eventName, e, touches, info) {
        var targetGroups = [],
            ln = touches.length,
            targets, i, touch;

        if (ln === 1) {
            return this.publish(eventName, touches[0].targets, e, info);
        }

        for (i = 0; i < ln; i++) {
            touch = touches[i];
            targetGroups.push(touch.targets);
        }

        targets = this.getCommonTargets(targetGroups);

        this.publish(eventName, targets, e, info);
    },

    publish: function(eventName, targets, event, info) {
        event.set(info);

        return this.callParent([eventName, targets, event]);
    },

    getCommonTargets: function(targetGroups) {
        var firstTargetGroup = targetGroups[0],
            ln = targetGroups.length;

        if (ln === 1) {
            return firstTargetGroup;
        }

        var commonTargets = [],
            i = 1,
            target, targets, j;

        while (true) {
            target = firstTargetGroup[firstTargetGroup.length - i];

            if (!target) {
                return commonTargets;
            }

            for (j = 1; j < ln; j++) {
                targets = targetGroups[j];

                if (targets[targets.length - i] !== target) {
                    return commonTargets;
                }
            }

            commonTargets.unshift(target);
            i++;
        }

        return commonTargets;
    },

    invokeRecognizers: function(methodName, e) {
        var recognizers = this.activeRecognizers,
            ln = recognizers.length,
            i, recognizer;

        if (methodName === 'onStart') {
            for (i = 0; i < ln; i++) {
                recognizers[i].isActive = true;
            }
        }

        for (i = 0; i < ln; i++) {
            recognizer = recognizers[i];
            if (recognizer.isActive && recognizer[methodName].call(recognizer, e) === false) {
                recognizer.isActive = false;
            }
        }
    },

    getActiveRecognizers: function() {
        return this.activeRecognizers;
    },

    processEvent: function(e) {
        this.eventProcessors[e.type].call(this, e);
    },

    onTouchStart: function(e) {
        var currentTargets = this.currentTargets,
            currentTouches = this.currentTouches,
            currentTouchesCount = this.currentTouchesCount,
            currentIdentifiers = {},
            changedTouches = e.changedTouches,
            changedTouchedLn = changedTouches.length,
            touches = e.touches,
            touchesLn = touches.length,
            i, touch, identifier, fakeEndEvent;

        currentTouchesCount += changedTouchedLn;

        if (currentTouchesCount > touchesLn) {
            for (i = 0; i < touchesLn; i++) {
                touch = touches[i];
                identifier = touch.identifier;
                currentIdentifiers[identifier] = true;
            }

            if (!Ext.os.is.Android3 && !Ext.os.is.Android4) {
                for (identifier in currentTouches) {
                    if (currentTouches.hasOwnProperty(identifier)) {
                        if (!currentIdentifiers[identifier]) {
                            currentTouchesCount--;
                            fakeEndEvent = e.clone();
                            touch = currentTouches[identifier];
                            touch.targets = this.getBubblingTargets(this.getElementTarget(touch.target));
                            fakeEndEvent.changedTouches = [touch];
                            this.onTouchEnd(fakeEndEvent);
                        }
                    }
                }
            }

            // Fix for a bug found in Motorola Droid X (Gingerbread) and similar
            // where there are 2 touchstarts but just one touchend
            if (Ext.os.is.Android2 && currentTouchesCount > touchesLn) {
                return;
            }
        }

        for (i = 0; i < changedTouchedLn; i++) {
            touch = changedTouches[i];
            identifier = touch.identifier;

            if (!currentTouches.hasOwnProperty(identifier)) {
                this.currentTouchesCount++;
            }

            currentTouches[identifier] = touch;
            currentTargets[identifier] = this.getBubblingTargets(this.getElementTarget(touch.target));
        }

        e.setTargets(currentTargets);

        for (i = 0; i < changedTouchedLn; i++) {
            touch = changedTouches[i];

            this.publish('touchstart', touch.targets, e, {touch: touch});
        }

        if (!this.isStarted) {
            this.isStarted = true;
            this.invokeRecognizers('onStart', e);
        }

        this.invokeRecognizers('onTouchStart', e);
    },

    onTouchMove: function(e) {
        if (!this.isStarted) {
            return;
        }

        var currentTargets = this.currentTargets,
            currentTouches = this.currentTouches,
            moveThrottle = this.getMoveThrottle(),
            changedTouches = e.changedTouches,
            stillTouchesCount = 0,
            i, ln, touch, point, oldPoint, identifier;

        e.setTargets(currentTargets);

        for (i = 0,ln = changedTouches.length; i < ln; i++) {
            touch = changedTouches[i];
            identifier = touch.identifier;
            point = touch.point;

            oldPoint = currentTouches[identifier].point;

            if (moveThrottle && point.isCloseTo(oldPoint, moveThrottle)) {
                stillTouchesCount++;
                continue;
            }

            currentTouches[identifier] = touch;

            this.publish('touchmove', touch.targets, e, {touch: touch});
        }

        if (stillTouchesCount < ln) {
            this.invokeRecognizers('onTouchMove', e);
        }
    },

    onTouchEnd: function(e) {
        if (!this.isStarted) {
            return;
        }

        var currentTargets = this.currentTargets,
            currentTouches = this.currentTouches,
            changedTouches = e.changedTouches,
            ln = changedTouches.length,
            isEnded, identifier, i, touch;

        e.setTargets(currentTargets);

        this.currentTouchesCount -= ln;

        isEnded = (this.currentTouchesCount === 0);

        if (isEnded) {
            this.isStarted = false;
        }

        for (i = 0; i < ln; i++) {
            touch = changedTouches[i];
            identifier = touch.identifier;

            delete currentTouches[identifier];
            delete currentTargets[identifier];

            this.publish('touchend', touch.targets, e, {touch: touch});
        }

        this.invokeRecognizers('onTouchEnd', e);

        if (isEnded) {
            this.invokeRecognizers('onEnd', e);
        }
    }

}, function() {
    if (!Ext.feature.has.Touch) {
        this.override({
            moveEventName: 'mousemove',

            map: {
                mouseToTouch: {
                    mousedown: 'touchstart',
                    mousemove: 'touchmove',
                    mouseup: 'touchend'
                },

                touchToMouse: {
                    touchstart: 'mousedown',
                    touchmove: 'mousemove',
                    touchend: 'mouseup'
                }
            },

            attachListener: function(eventName) {
                eventName = this.map.touchToMouse[eventName];

                if (!eventName) {
                    return;
                }

                return this.callOverridden([eventName]);
            },

            lastEventType: null,

            onEvent: function(e) {
                if ('button' in e && e.button !== 0) {
                    return;
                }

                var type = e.type,
                    touchList = [e];

                // Temporary fix for a recent Chrome bugs where events don't seem to bubble up to document
                // when the element is being animated
                // with webkit-transition (2 mousedowns without any mouseup)
                if (type === 'mousedown' && this.lastEventType && this.lastEventType !== 'mouseup') {
                    var fixedEvent = document.createEvent("MouseEvent");
                        fixedEvent.initMouseEvent('mouseup', e.bubbles, e.cancelable,
                            document.defaultView, e.detail, e.screenX, e.screenY, e.clientX,
                            e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.metaKey,
                            e.button, e.relatedTarget);

                    this.onEvent(fixedEvent);
                }

                if (type !== 'mousemove') {
                    this.lastEventType = type;
                }

                e.identifier = 1;
                e.touches = (type !== 'mouseup') ? touchList : [];
                e.targetTouches = (type !== 'mouseup') ? touchList : [];
                e.changedTouches = touchList;

                return this.callOverridden([e]);
            },

            processEvent: function(e) {
                this.eventProcessors[this.map.mouseToTouch[e.type]].call(this, e);
            }
        });
    }
});
