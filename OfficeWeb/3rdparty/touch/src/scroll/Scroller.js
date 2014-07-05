/**
 * @class Ext.scroll.Scroller
 * @author Jacky Nguyen <jacky@sencha.com>
 *
 * Momentum scrolling is one of the most important part of the framework's UI layer. In Sencha Touch there are
 * several scroller implementations so we can have the best performance on all mobile devices and browsers.
 *
 * Scroller settings can be changed using the {@link Ext.Container#scrollable scrollable} configuration in
 * {@link Ext.Container}. Anything you pass to that method will be passed to the scroller when it is
 * instantiated in your container.
 *
 * Please note that the {@link Ext.Container#getScrollable} method returns an instance of {@link Ext.scroll.View}.
 * So if you need to get access to the scroller after your container has been instantiated, you must used the
 * {@link Ext.scroll.View#getScroller} method.
 *
 *     // lets assume container is a container you have
 *     // created which is scrollable
 *     container.getScrollable().getScroller().setFps(10);
 *
 * ## Example
 *
 * Here is a simple example of how to adjust the scroller settings when using a {@link Ext.Container} (or anything
 * that extends it).
 *
 *     @example
 *     var container = Ext.create('Ext.Container', {
 *         fullscreen: true,
 *         html: 'This container is scrollable!',
 *         scrollable: {
 *             direction: 'vertical'
 *         }
 *     });
 *
 * As you can see, we are passing the {@link #direction} configuration into the scroller instance in our container.
 *
 * You can pass any of the configs below in that {@link Ext.Container#scrollable scrollable} configuration and it will
 * just work.
 *
 * Go ahead and try it in the live code editor above!
 */
Ext.define('Ext.scroll.Scroller', {

    extend: 'Ext.Evented',

    requires: [
        'Ext.fx.easing.BoundMomentum',
        'Ext.fx.easing.EaseOut',
        'Ext.util.Translatable'
    ],

    /**
     * @event maxpositionchange
     * Fires whenever the maximum position has changed.
     * @param {Ext.scroll.Scroller} this
     * @param {Number} maxPosition The new maximum position.
     */

    /**
     * @event refresh
     * Fires whenever the Scroller is refreshed.
     * @param {Ext.scroll.Scroller} this
     */

    /**
     * @event scrollstart
     * Fires whenever the scrolling is started.
     * @param {Ext.scroll.Scroller} this
     * @param {Number} x The current x position.
     * @param {Number} y The current y position.
     */

    /**
     * @event scrollend
     * Fires whenever the scrolling is ended.
     * @param {Ext.scroll.Scroller} this
     * @param {Number} x The current x position.
     * @param {Number} y The current y position.
     */

    /**
     * @event scroll
     * Fires whenever the Scroller is scrolled.
     * @param {Ext.scroll.Scroller} this
     * @param {Number} x The new x position.
     * @param {Number} y The new y position.
     */

    config: {
        /**
         * @cfg element
         * @private
         */
        element: null,

        /**
         * @cfg {String} direction
         * Possible values: 'auto', 'vertical', 'horizontal', or 'both'.
         * @accessor
         */
        direction: 'auto',

        /**
         * @cfg fps
         * @private
         */
        fps: 'auto',

        /**
         * @cfg {Boolean} disabled
         * Whether or not this component is disabled.
         * @accessor
         */
        disabled: null,

        /**
         * @cfg {Boolean} directionLock
         * `true` to lock the direction of the scroller when the user starts scrolling.
         * This is useful when putting a scroller inside a scroller or a {@link Ext.Carousel}.
         * @accessor
         */
        directionLock: false,

        /**
         * @cfg {Object} momentumEasing
         * A valid config for {@link Ext.fx.easing.BoundMomentum}. The default value is:
         *
         *     {
         *         momentum: {
         *             acceleration: 30,
         *             friction: 0.5
         *         },
         *         bounce: {
         *             acceleration: 30,
         *             springTension: 0.3
         *         }
         *     }
         *
         * Note that supplied object will be recursively merged with the default object. For example, you can simply
         * pass this to change the momentum acceleration only:
         *
         *     {
         *         momentum: {
         *             acceleration: 10
         *         }
         *     }
         *
         * @accessor
         */
        momentumEasing: {
            momentum: {
                acceleration: 30,
                friction: 0.5
            },

            bounce: {
                acceleration: 30,
                springTension: 0.3
            },

            minVelocity: 1
        },

        /**
         * @cfg bounceEasing
         * @private
         */
        bounceEasing: {
            duration: 400
        },

        /**
         * @cfg outOfBoundRestrictFactor
         * @private
         */
        outOfBoundRestrictFactor: 0.5,

        /**
         * @cfg startMomentumResetTime
         * @private
         */
        startMomentumResetTime: 300,

        /**
         * @cfg maxAbsoluteVelocity
         * @private
         */
        maxAbsoluteVelocity: 6,

        /**
         * @cfg containerSize
         * @private
         */
        containerSize: 'auto',

        /**
         * @cfg size
         * @private
         */
        size: 'auto',

        /**
         * @cfg autoRefresh
         * @private
         */
        autoRefresh: true,

        /**
         * @cfg {Object/Number} initialOffset
         * The initial scroller position.  When specified as Number,
         * both x and y will be set to that value.
         */
        initialOffset: {
            x: 0,
            y: 0
        },

        /**
         * @cfg {Number/Object} slotSnapSize
         * The size of each slot to snap to in 'px', can be either an object with `x` and `y` values, i.e:
         *
         *      {
         *          x: 50,
         *          y: 100
         *      }
         *
         * or a number value to be used for both directions. For example, a value of `50` will be treated as:
         *
         *      {
         *          x: 50,
         *          y: 50
         *      }
         *
         * @accessor
         */
        slotSnapSize: {
            x: 0,
            y: 0
        },

        /**
         * @cfg slotSnapOffset
         * @private
         */
        slotSnapOffset: {
            x: 0,
            y: 0
        },

        slotSnapEasing: {
            duration: 150
        },

        translatable: {
            translationMethod: 'auto',
            useWrapper: false
        }
    },

    cls: Ext.baseCSSPrefix + 'scroll-scroller',

    containerCls: Ext.baseCSSPrefix + 'scroll-container',

    dragStartTime: 0,

    dragEndTime: 0,

    isDragging: false,

    isAnimating: false,

    /**
     * @private
     * @constructor
     * @chainable
     */
    constructor: function(config) {
        var element = config && config.element;

        if (Ext.os.is.Android4 && !Ext.browser.is.Chrome) {
            this.onDrag = Ext.Function.createThrottled(this.onDrag, 20, this);
        }

        this.listeners = {
            scope: this,
            touchstart: 'onTouchStart',
            touchend: 'onTouchEnd',
            dragstart: 'onDragStart',
            drag: 'onDrag',
            dragend: 'onDragEnd'
        };

        this.minPosition = { x: 0, y: 0 };

        this.startPosition = { x: 0, y: 0 };

        this.position = { x: 0, y: 0 };

        this.velocity = { x: 0, y: 0 };

        this.isAxisEnabledFlags = { x: false, y: false };

        this.flickStartPosition = { x: 0, y: 0 };

        this.flickStartTime = { x: 0, y: 0 };

        this.lastDragPosition = { x: 0, y: 0 };

        this.dragDirection = { x: 0, y: 0};

        this.initialConfig = config;

        if (element) {
            this.setElement(element);
        }

        return this;
    },

    /**
     * @private
     */
    applyElement: function(element) {
        if (!element) {
            return;
        }

        return Ext.get(element);
    },

    /**
     * @private
     * @chainable
     */
    updateElement: function(element) {
        this.initialize();

        element.addCls(this.cls);

        if (!this.getDisabled()) {
            this.attachListeneners();
        }

        this.onConfigUpdate(['containerSize', 'size'], 'refreshMaxPosition');

        this.on('maxpositionchange', 'snapToBoundary');
        this.on('minpositionchange', 'snapToBoundary');

        return this;
    },

    applyTranslatable: function(config, translatable) {
        return Ext.factory(config, Ext.util.Translatable, translatable);
    },

    updateTranslatable: function(translatable) {
        translatable.setConfig({
            element: this.getElement(),
            listeners: {
                animationframe: 'onAnimationFrame',
                animationend: 'onAnimationEnd',
                scope: this
            }
        });
    },

    updateFps: function(fps) {
        if (fps !== 'auto') {
            this.getTranslatable().setFps(fps);
        }
    },

    /**
     * @private
     */
    attachListeneners: function() {
        this.getContainer().on(this.listeners);
    },

    /**
     * @private
     */
    detachListeners: function() {
        this.getContainer().un(this.listeners);
    },

    /**
     * @private
     */
    updateDisabled: function(disabled) {
        if (disabled) {
            this.detachListeners();
        }
        else {
            this.attachListeneners();
        }
    },

    updateInitialOffset: function(initialOffset) {
        if (typeof initialOffset == 'number') {
            initialOffset = {
                x: initialOffset,
                y: initialOffset
            };
        }

        var position = this.position,
            x, y;

        position.x = x = initialOffset.x;
        position.y = y = initialOffset.y;

        this.getTranslatable().translate(-x, -y);
    },

    /**
     * @private
     * @return {String}
     */
    applyDirection: function(direction) {
        var minPosition = this.getMinPosition(),
            maxPosition = this.getMaxPosition(),
            isHorizontal, isVertical;

        this.givenDirection = direction;

        if (direction === 'auto') {
            isHorizontal = maxPosition.x > minPosition.x;
            isVertical = maxPosition.y > minPosition.y;

            if (isHorizontal && isVertical) {
                direction = 'both';
            }
            else if (isHorizontal) {
                direction = 'horizontal';
            }
            else {
                direction = 'vertical';
            }
        }

        return direction;
    },

    /**
     * @private
     */
    updateDirection: function(direction) {
        var isAxisEnabled = this.isAxisEnabledFlags;

        isAxisEnabled.x = (direction === 'both' || direction === 'horizontal');
        isAxisEnabled.y = (direction === 'both' || direction === 'vertical');
    },

    /**
     * Returns `true` if a specified axis is enabled.
     * @param {String} axis The axis to check (`x` or `y`).
     * @return {Boolean} `true` if the axis is enabled.
     */
    isAxisEnabled: function(axis) {
        this.getDirection();

        return this.isAxisEnabledFlags[axis];
    },

    /**
     * @private
     * @return {Object}
     */
    applyMomentumEasing: function(easing) {
        var defaultClass = Ext.fx.easing.BoundMomentum;

        return {
            x: Ext.factory(easing, defaultClass),
            y: Ext.factory(easing, defaultClass)
        };
    },

    /**
     * @private
     * @return {Object}
     */
    applyBounceEasing: function(easing) {
        var defaultClass = Ext.fx.easing.EaseOut;

        return {
            x: Ext.factory(easing, defaultClass),
            y: Ext.factory(easing, defaultClass)
        };
    },

    updateBounceEasing: function(easing) {
        this.getTranslatable().setEasingX(easing.x).setEasingY(easing.y);
    },

    /**
     * @private
     * @return {Object}
     */
    applySlotSnapEasing: function(easing) {
        var defaultClass = Ext.fx.easing.EaseOut;

        return {
            x: Ext.factory(easing, defaultClass),
            y: Ext.factory(easing, defaultClass)
        };
    },

    /**
     * @private
     * @return {Object}
     */
    getMinPosition: function() {
        var minPosition = this.minPosition;

        if (!minPosition) {
            this.minPosition = minPosition = {
                x: 0,
                y: 0
            };

            this.fireEvent('minpositionchange', this, minPosition);
        }

        return minPosition;
    },

    /**
     * @private
     * @return {Object}
     */
    getMaxPosition: function() {
        var maxPosition = this.maxPosition,
            size, containerSize;

        if (!maxPosition) {
            size = this.getSize();
            containerSize = this.getContainerSize();

            this.maxPosition = maxPosition = {
                x: Math.max(0, size.x - containerSize.x),
                y: Math.max(0, size.y - containerSize.y)
            };

            this.fireEvent('maxpositionchange', this, maxPosition);
        }

        return maxPosition;
    },

    /**
     * @private
     */
    refreshMaxPosition: function() {
        this.maxPosition = null;
        this.getMaxPosition();
    },

    /**
     * @private
     * @return {Object}
     */
    applyContainerSize: function(size) {
        var containerDom = this.getContainer().dom,
            x, y;

        if (!containerDom) {
            return;
        }

        this.givenContainerSize = size;

        if (size === 'auto') {
            x = containerDom.offsetWidth;
            y = containerDom.offsetHeight;
        }
        else {
            x = size.x;
            y = size.y;
        }

        return {
            x: x,
            y: y
        };
    },

    /**
     * @private
     * @param {String/Object} size
     * @return {Object}
     */
    applySize: function(size) {
        var dom = this.getElement().dom,
            x, y;

        if (!dom) {
            return;
        }

        this.givenSize = size;

        if (size === 'auto') {
            x = dom.offsetWidth;
            y = dom.offsetHeight;
        }
        else if (typeof size == 'number') {
            x = size;
            y = size;
        }
        else {
            x = size.x;
            y = size.y;
        }

        return {
            x: x,
            y: y
        };
    },

    /**
     * @private
     */
    updateAutoRefresh: function(autoRefresh) {
        this.getElement().toggleListener(autoRefresh, 'resize', 'onElementResize', this);
        this.getContainer().toggleListener(autoRefresh, 'resize', 'onContainerResize', this);
    },

    applySlotSnapSize: function(snapSize) {
        if (typeof snapSize == 'number') {
            return {
                x: snapSize,
                y: snapSize
            };
        }

        return snapSize;
    },

    applySlotSnapOffset: function(snapOffset) {
        if (typeof snapOffset == 'number') {
            return {
                x: snapOffset,
                y: snapOffset
            };
        }

        return snapOffset;
    },

    /**
     * @private
     * Returns the container for this scroller
     */
    getContainer: function() {
        var container = this.container;

        if (!container) {
            this.container = container = this.getElement().getParent();
            //<debug error>
            if (!container) {
                Ext.Logger.error("Making an element scrollable that doesn't have any container");
            }
            //</debug>
            container.addCls(this.containerCls);
        }

        return container;
    },

    /**
     * @private
     * @return {Ext.scroll.Scroller} this
     * @chainable
     */
    refresh: function() {
        this.stopAnimation();

        this.getTranslatable().refresh();
        this.setSize(this.givenSize);
        this.setContainerSize(this.givenContainerSize);
        this.setDirection(this.givenDirection);

        this.fireEvent('refresh', this);

        return this;
    },

    onElementResize: function(element, info) {
        this.setSize({
            x: info.width,
            y: info.height
        });

        this.refresh();
    },

    onContainerResize: function(container, info) {
        this.setContainerSize({
            x: info.width,
            y: info.height
        });

        this.refresh();
    },

    /**
     * Scrolls to the given location.
     *
     * @param {Number} x The scroll position on the x axis.
     * @param {Number} y The scroll position on the y axis.
     * @param {Boolean/Object} animation (optional) Whether or not to animate the scrolling to the new position.
     *
     * @return {Ext.scroll.Scroller} this
     * @chainable
     */
    scrollTo: function(x, y, animation) {
        //<deprecated product=touch since=2.0>
        if (typeof x != 'number' && arguments.length === 1) {
            //<debug warn>
            Ext.Logger.deprecate("Calling scrollTo() with an object argument is deprecated, " +
                "please pass x and y arguments instead", this);
            //</debug>

            y = x.y;
            x = x.x;
        }
        //</deprecated>

        var translatable = this.getTranslatable(),
            position = this.position,
            positionChanged = false,
            translationX, translationY;

        if (this.isAxisEnabled('x')) {
            if (typeof x != 'number') {
                x = position.x;
            }
            else {
                if (position.x !== x) {
                    position.x = x;
                    positionChanged = true;
                }
            }

            translationX = -x;
        }

        if (this.isAxisEnabled('y')) {
            if (typeof y != 'number') {
                y = position.y;
            }
            else {
                if (position.y !== y) {
                    position.y = y;
                    positionChanged = true;
                }
            }

            translationY = -y;
        }

        if (positionChanged) {
            if (animation !== undefined) {
                translatable.translateAnimated(translationX, translationY, animation);
            }
            else {
                this.fireEvent('scroll', this, position.x, position.y);
                translatable.translate(translationX, translationY);
            }
        }

        return this;
    },

    /**
     * @private
     * @return {Ext.scroll.Scroller} this
     * @chainable
     */
    scrollToTop: function(animation) {
        var initialOffset = this.getInitialOffset();

        return this.scrollTo(initialOffset.x, initialOffset.y, animation);
    },

    /**
     * Scrolls to the end of the scrollable view.
     * @return {Ext.scroll.Scroller} this
     * @chainable
     */
    scrollToEnd: function(animation) {
        var size    = this.getSize(),
            cntSize = this.getContainerSize();

        return this.scrollTo(size.x - cntSize.x, size.y - cntSize.y, animation);
    },

    /**
     * Change the scroll offset by the given amount.
     * @param {Number} x The offset to scroll by on the x axis.
     * @param {Number} y The offset to scroll by on the y axis.
     * @param {Boolean/Object} animation (optional) Whether or not to animate the scrolling to the new position.
     * @return {Ext.scroll.Scroller} this
     * @chainable
     */
    scrollBy: function(x, y, animation) {
        var position = this.position;

        x = (typeof x == 'number') ? x + position.x : null;
        y = (typeof y == 'number') ? y + position.y : null;

        return this.scrollTo(x, y, animation);
    },

    /**
     * @private
     */
    onTouchStart: function() {
        this.isTouching = true;
        this.stopAnimation();
    },

    /**
     * @private
     */
    onTouchEnd: function() {
        var position = this.position;

        this.isTouching = false;

        if (!this.isDragging && this.snapToSlot()) {
            this.fireEvent('scrollstart', this, position.x, position.y);
        }
    },

    /**
     * @private
     */
    onDragStart: function(e) {
        var direction = this.getDirection(),
            absDeltaX = e.absDeltaX,
            absDeltaY = e.absDeltaY,
            directionLock = this.getDirectionLock(),
            startPosition = this.startPosition,
            flickStartPosition = this.flickStartPosition,
            flickStartTime = this.flickStartTime,
            lastDragPosition = this.lastDragPosition,
            currentPosition = this.position,
            dragDirection = this.dragDirection,
            x = currentPosition.x,
            y = currentPosition.y,
            now = Ext.Date.now();

        this.isDragging = true;

        if (directionLock && direction !== 'both') {
            if ((direction === 'horizontal' && absDeltaX > absDeltaY)
                    || (direction === 'vertical' && absDeltaY > absDeltaX)) {
                e.stopPropagation();
            }
            else {
                this.isDragging = false;
                return;
            }
        }

        lastDragPosition.x = x;
        lastDragPosition.y = y;

        flickStartPosition.x = x;
        flickStartPosition.y = y;

        startPosition.x = x;
        startPosition.y = y;

        flickStartTime.x = now;
        flickStartTime.y = now;

        dragDirection.x = 0;
        dragDirection.y = 0;

        this.dragStartTime = now;

        this.isDragging = true;

        this.fireEvent('scrollstart', this, x, y);
    },

    /**
     * @private
     */
    onAxisDrag: function(axis, delta) {
        if (!this.isAxisEnabled(axis)) {
            return;
        }

        var flickStartPosition = this.flickStartPosition,
            flickStartTime = this.flickStartTime,
            lastDragPosition = this.lastDragPosition,
            dragDirection = this.dragDirection,
            old = this.position[axis],
            min = this.getMinPosition()[axis],
            max = this.getMaxPosition()[axis],
            start = this.startPosition[axis],
            last = lastDragPosition[axis],
            current = start - delta,
            lastDirection = dragDirection[axis],
            restrictFactor = this.getOutOfBoundRestrictFactor(),
            startMomentumResetTime = this.getStartMomentumResetTime(),
            now = Ext.Date.now(),
            distance;

        if (current < min) {
            current *= restrictFactor;
        }
        else if (current > max) {
            distance = current - max;
            current = max + distance * restrictFactor;
        }

        if (current > last) {
            dragDirection[axis] = 1;
        }
        else if (current < last) {
            dragDirection[axis] = -1;
        }

        if ((lastDirection !== 0 && (dragDirection[axis] !== lastDirection))
                || (now - flickStartTime[axis]) > startMomentumResetTime) {
            flickStartPosition[axis] = old;
            flickStartTime[axis] = now;
        }

        lastDragPosition[axis] = current;
    },

    /**
     * @private
     */
    onDrag: function(e) {
        if (!this.isDragging) {
            return;
        }

        var lastDragPosition = this.lastDragPosition;

        this.onAxisDrag('x', e.deltaX);
        this.onAxisDrag('y', e.deltaY);

        this.scrollTo(lastDragPosition.x, lastDragPosition.y);
    },

    /**
     * @private
     */
    onDragEnd: function(e) {
        var easingX, easingY;

        if (!this.isDragging) {
            return;
        }

        this.dragEndTime = Ext.Date.now();

        this.onDrag(e);

        this.isDragging = false;

        easingX = this.getAnimationEasing('x');
        easingY = this.getAnimationEasing('y');

        if (easingX || easingY) {
            this.getTranslatable().animate(easingX, easingY);
        }
        else {
            this.onScrollEnd();
        }
    },

    /**
     * @private
     */
    getAnimationEasing: function(axis) {
        if (!this.isAxisEnabled(axis)) {
            return null;
        }

        var currentPosition = this.position[axis],
            flickStartPosition = this.flickStartPosition[axis],
            flickStartTime = this.flickStartTime[axis],
            minPosition = this.getMinPosition()[axis],
            maxPosition = this.getMaxPosition()[axis],
            maxAbsVelocity = this.getMaxAbsoluteVelocity(),
            boundValue = null,
            dragEndTime = this.dragEndTime,
            easing, velocity, duration;

        if (currentPosition < minPosition) {
            boundValue = minPosition;
        }
        else if (currentPosition > maxPosition) {
            boundValue = maxPosition;
        }

        // Out of bound, to be pulled back
        if (boundValue !== null) {
            easing = this.getBounceEasing()[axis];
            easing.setConfig({
                startTime: dragEndTime,
                startValue: -currentPosition,
                endValue: -boundValue
            });

            return easing;
        }

        // Still within boundary, start deceleration
        duration = dragEndTime - flickStartTime;

        if (duration === 0) {
            return null;
        }

        velocity = (currentPosition - flickStartPosition) / (dragEndTime - flickStartTime);

        if (velocity === 0) {
            return null;
        }

        if (velocity < -maxAbsVelocity) {
            velocity = -maxAbsVelocity;
        }
        else if (velocity > maxAbsVelocity) {
            velocity = maxAbsVelocity;
        }

        easing = this.getMomentumEasing()[axis];
        easing.setConfig({
            startTime: dragEndTime,
            startValue: -currentPosition,
            startVelocity: -velocity,
            minMomentumValue: -maxPosition,
            maxMomentumValue: 0
        });

        return easing;
    },

    /**
     * @private
     */
    onAnimationFrame: function(translatable, x, y) {
        var position = this.position;

        position.x = -x;
        position.y = -y;

        this.fireEvent('scroll', this, position.x, position.y);
    },

    /**
     * @private
     */
    onAnimationEnd: function() {
        this.snapToBoundary();
        this.onScrollEnd();
    },

    /**
     * @private
     * Stops the animation of the scroller at any time.
     */
    stopAnimation: function() {
        this.getTranslatable().stopAnimation();
    },

    /**
     * @private
     */
    onScrollEnd: function() {
        var position = this.position;

        if (this.isTouching || !this.snapToSlot()) {
            this.fireEvent('scrollend', this, position.x, position.y);
        }
    },

    /**
     * @private
     * @return {Boolean}
     */
    snapToSlot: function() {
        var snapX = this.getSnapPosition('x'),
            snapY = this.getSnapPosition('y'),
            easing = this.getSlotSnapEasing();

        if (snapX !== null || snapY !== null) {
            this.scrollTo(snapX, snapY, {
                easingX: easing.x,
                easingY: easing.y
            });

            return true;
        }

        return false;
    },

    /**
     * @private
     * @return {Number/null}
     */
    getSnapPosition: function(axis) {
        var snapSize = this.getSlotSnapSize()[axis],
            snapPosition = null,
            position, snapOffset, maxPosition, mod;

        if (snapSize !== 0 && this.isAxisEnabled(axis)) {
            position = this.position[axis];
            snapOffset = this.getSlotSnapOffset()[axis];
            maxPosition = this.getMaxPosition()[axis];

            mod = (position - snapOffset) % snapSize;

            if (mod !== 0) {
                if (Math.abs(mod) > snapSize / 2) {
                    snapPosition = position + ((mod > 0) ? snapSize - mod : mod - snapSize);

                    if (snapPosition > maxPosition) {
                        snapPosition = position - mod;
                    }
                }
                else {
                    snapPosition = position - mod;
                }
            }
        }

        return snapPosition;
    },

    /**
     * @private
     */
    snapToBoundary: function() {
        var position = this.position,
            minPosition = this.getMinPosition(),
            maxPosition = this.getMaxPosition(),
            minX = minPosition.x,
            minY = minPosition.y,
            maxX = maxPosition.x,
            maxY = maxPosition.y,
            x = Math.round(position.x),
            y = Math.round(position.y);

        if (x < minX) {
            x = minX;
        }
        else if (x > maxX) {
            x = maxX;
        }

        if (y < minY) {
            y = minY;
        }
        else if (y > maxY) {
            y = maxY;
        }

        this.scrollTo(x, y);
    },

    destroy: function() {
        var element = this.getElement(),
            sizeMonitors = this.sizeMonitors;

        if (sizeMonitors) {
            sizeMonitors.element.destroy();
            sizeMonitors.container.destroy();
        }

        if (element && !element.isDestroyed) {
            element.removeCls(this.cls);
            this.getContainer().removeCls(this.containerCls);
        }

        Ext.destroy(this.getTranslatable());

        this.callParent(arguments);
    }

}, function() {
    //<deprecated product=touch since=2.0>
    this.override({
        constructor: function(config) {
            var element, acceleration, slotSnapOffset, friction, springTension, minVelocity;

            if (!config) {
                config = {};
            }

            if (typeof config == 'string') {
                config = {
                    direction: config
                };
            }

            if (arguments.length == 2) {
                //<debug warn>
                Ext.Logger.deprecate("Passing element as the first argument is deprecated, pass it as the " +
                    "'element' property of the config object instead");
                //</debug>
                element = config;
                config = arguments[1];

                if (!config) {
                    config = {};
                }

                config.element = element;
            }

            /**
             * @cfg {Number} acceleration A higher acceleration gives the scroller more initial velocity.
             * @deprecated 2.0.0 Please use {@link #momentumEasing}.momentum.acceleration and {@link #momentumEasing}.bounce.acceleration instead.
             */
            if (config.hasOwnProperty('acceleration')) {
                acceleration = config.acceleration;
                delete config.acceleration;
                //<debug warn>
                Ext.Logger.deprecate("'acceleration' config is deprecated, set momentumEasing.momentum.acceleration and momentumEasing.bounce.acceleration configs instead");
                //</debug>

                Ext.merge(config, {
                    momentumEasing: {
                        momentum: { acceleration: acceleration },
                        bounce: { acceleration: acceleration }
                    }
                });
            }

            if (config.hasOwnProperty('snap')) {
                config.slotSnapOffset = config.snap;
                //<debug warn>
                Ext.Logger.deprecate("'snap' config is deprecated, please use the 'slotSnapOffset' config instead");
                //</debug>
            }

            /**
             * @cfg {Number} friction The friction of the scroller. By raising this value the length that momentum scrolls
             * becomes shorter. This value is best kept between 0 and 1.
             * @deprecated 2.0.0 Please set the {@link #momentumEasing}.momentum.friction configuration instead
             */
            if (config.hasOwnProperty('friction')) {
                friction = config.friction;
                delete config.friction;
                //<debug warn>
                Ext.Logger.deprecate("'friction' config is deprecated, set momentumEasing.momentum.friction config instead");
                //</debug>

                Ext.merge(config, {
                    momentumEasing: {
                        momentum: { friction: friction }
                    }
                });
            }

            if (config.hasOwnProperty('springTension')) {
                springTension = config.springTension;
                delete config.springTension;
                //<debug warn>
                Ext.Logger.deprecate("'springTension' config is deprecated, set momentumEasing.momentum.springTension config instead");
                //</debug>

                Ext.merge(config, {
                    momentumEasing: {
                        momentum: { springTension: springTension }
                    }
                });
            }

            if (config.hasOwnProperty('minVelocityForAnimation')) {
                minVelocity = config.minVelocityForAnimation;
                delete config.minVelocityForAnimation;
                //<debug warn>
                Ext.Logger.deprecate("'minVelocityForAnimation' config is deprecated, set momentumEasing.minVelocity config instead");
                //</debug>

                Ext.merge(config, {
                    momentumEasing: {
                        minVelocity: minVelocity
                    }
                });
            }

            this.callOverridden(arguments);
        },

        scrollToAnimated: function(x, y, animation) {
            //<debug warn>
            Ext.Logger.deprecate("scrollToAnimated() is deprecated, please use `scrollTo()` and pass 'animation' as " +
                "the third argument instead");
            //</debug>

            return this.scrollTo.apply(this, arguments);
        },

        scrollBy: function(x, y, animation) {
            if (Ext.isObject(x)) {
                //<debug warn>
                Ext.Logger.deprecate("calling `scrollBy()` with an object of `x` and `y` properties is no longer supported. " +
                        "Please pass `x` and `y` values as two separate arguments instead");
                //</debug>
                y = x.y;
                x = x.x;
            }

            return this.callOverridden([x, y, animation]);
        },

        /**
         * Sets the offset of this scroller.
         * @param {Object} offset The offset to move to.
         * @param {Number} offset.x The x-axis offset.
         * @param {Number} offset.y The y-axis offset.
         * @deprecated 2.0.0 Please use `{@link #scrollTo}` instead.
         * @return {Ext.scroll.Scroller} this
         * @chainable
         */
        setOffset: function(offset) {
            return this.scrollToAnimated(-offset.x, -offset.y);
        }
    });

    /**
     * @method updateBoundary
     * Updates the boundary information for this scroller.
     * @return {Ext.scroll.Scroller} this
     * @removed 2.0.0 Please use {@link #method-refresh} instead.
     * @chainable
     */
//    Ext.deprecateClassMethod('updateBoundary', 'refresh');
    //</deprecated>
});
