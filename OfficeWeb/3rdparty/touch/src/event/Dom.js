/**
 * @private
 * @extends Object
 * DOM event. This class really extends {@link Ext.event.Event}, but for documentation
 * purposes it's members are listed inside {@link Ext.event.Event}.
 */
Ext.define('Ext.event.Dom', {
    extend: 'Ext.event.Event',

    constructor: function(event) {
        var target = event.target,
            touches;

        if (target && target.nodeType !== 1) {
            target = target.parentNode;
        }
        touches = event.changedTouches;
        if (touches) {
            touches = touches[0];
            this.pageX = touches.pageX;
            this.pageY = touches.pageY;
        }
        else {
            this.pageX = event.pageX;
            this.pageY = event.pageY;
        }

        this.browserEvent = this.event = event;
        this.target = this.delegatedTarget = target;
        this.type = event.type;

        this.timeStamp = this.time = event.timeStamp;

        if (typeof this.time != 'number') {
            this.time = new Date(this.time).getTime();
        }

        return this;
    },

    /**
     * @property {Number} distance
     * The distance of the event.
     *
     * **This is only available when the event type is `swipe` and `pinch`.**
     */

    /**
     * @property {HTMLElement} target
     * The target HTMLElement for this event. For example; if you are listening to a tap event and you tap on a `<div>` element,
     * this will return that `<div>` element.
     */

    /**
     * @property {Number} pageX The browsers x coordinate of the event.
     */

    /**
     * @property {Number} pageY The browsers y coordinate of the event.
     */

    stopEvent: function() {
        this.preventDefault();

        return this.callParent();
    },

    /**
     * Prevents the browsers default handling of the event.
     */
    preventDefault: function() {
        this.browserEvent.preventDefault();
    },

    /**
     * Gets the x coordinate of the event.
     * @deprecated 2.0 Please use {@link #pageX} property directly.
     * @return {Number}
     */
    getPageX: function() {
        return this.browserEvent.pageX;
    },

    /**
     * Gets the y coordinate of the event.
     * @deprecated 2.0 Please use {@link #pageX} property directly.
     * @return {Number}
     */
    getPageY: function() {
        return this.browserEvent.pageY;
    },

    /**
     * Gets the X and Y coordinates of the event.
     * @deprecated 2.0 Please use the {@link #pageX} and {@link #pageY} properties directly.
     * @return {Array}
     */
    getXY: function() {
        if (!this.xy) {
            this.xy = [this.getPageX(), this.getPageY()];
        }

        return this.xy;
    },

    /**
     * Gets the target for the event. Unlike {@link #target}, this returns the main element for your event. So if you are
     * listening to a tap event on Ext.Viewport.element, and you tap on an inner element of Ext.Viewport.element, this will
     * return Ext.Viewport.element.
     *
     * If you want the element you tapped on, then use {@link #target}.
     *
     * @param {String} selector (optional) A simple selector to filter the target or look for an ancestor of the target
     * @param {Number/Mixed} [maxDepth=10||document.body] (optional) The max depth to
     * search as a number or element (defaults to 10 || document.body)
     * @param {Boolean} returnEl (optional) `true` to return a Ext.Element object instead of DOM node.
     * @return {HTMLElement}
     */
    getTarget: function(selector, maxDepth, returnEl) {
        if (arguments.length === 0) {
            return this.delegatedTarget;
        }

        return selector ? Ext.fly(this.target).findParent(selector, maxDepth, returnEl) : (returnEl ? Ext.get(this.target) : this.target);
    },

    /**
     * Returns the time of the event.
     * @return {Date}
     */
    getTime: function() {
        return this.time;
    },

    setDelegatedTarget: function(target) {
        this.delegatedTarget = target;
    },

    makeUnpreventable: function() {
        this.browserEvent.preventDefault = Ext.emptyFn;
    }
});
