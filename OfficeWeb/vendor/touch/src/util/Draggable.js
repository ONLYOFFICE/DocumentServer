/**
 * A core util class to bring Draggable behavior to any DOM element
 */
Ext.define('Ext.util.Draggable', {
    isDraggable: true,

    mixins: [
        'Ext.mixin.Observable'
    ],

    requires: [
        'Ext.util.Translatable'
    ],

    /**
     * @event dragstart
     * @preventable initDragStart
     * Fires whenever the component starts to be dragged
     * @param {Ext.util.Draggable} this
     * @param {Ext.event.Event} e the event object
     * @param {Number} offsetX The current offset value on the x axis
     * @param {Number} offsetY The current offset value on the y axis
     */

    /**
     * @event drag
     * Fires whenever the component is dragged
     * @param {Ext.util.Draggable} this
     * @param {Ext.event.Event} e the event object
     * @param {Number} offsetX The new offset value on the x axis
     * @param {Number} offsetY The new offset value on the y axis
     */

    /**
     * @event dragend
     * Fires whenever the component is dragged
     * @param {Ext.util.Draggable} this
     * @param {Ext.event.Event} e the event object
     * @param {Number} offsetX The current offset value on the x axis
     * @param {Number} offsetY The current offset value on the y axis
     */

    config: {
        cls: Ext.baseCSSPrefix + 'draggable',

        draggingCls: Ext.baseCSSPrefix + 'dragging',

        element: null,

        constraint: 'container',

        disabled: null,

        /**
         * @cfg {String} direction
         * Possible values: 'vertical', 'horizontal', or 'both'
         * @accessor
         */
        direction: 'both',

        /**
         * @cfg {Object/Number} initialOffset
         * The initial draggable offset.  When specified as Number,
         * both x and y will be set to that value.
         */
        initialOffset: {
            x: 0,
            y: 0
        },

        translatable: {}
    },

    DIRECTION_BOTH: 'both',

    DIRECTION_VERTICAL: 'vertical',

    DIRECTION_HORIZONTAL: 'horizontal',

    defaultConstraint: {
        min: { x: -Infinity, y: -Infinity },
        max: { x: Infinity, y: Infinity }
    },

    containerWidth: 0,

    containerHeight: 0,

    width: 0,

    height: 0,

    /**
     * Creates new Draggable.
     * @param {Object} config The configuration object for this Draggable.
     */
    constructor: function(config) {
        var element;

        this.extraConstraint = {};

        this.initialConfig = config;

        this.offset = {
            x: 0,
            y: 0
        };

        this.listeners = {
            dragstart: 'onDragStart',
            drag     : 'onDrag',
            dragend  : 'onDragEnd',
            resize   : 'onElementResize',
            scope: this
        };

        if (config && config.element) {
            element = config.element;
            delete config.element;

            this.setElement(element);
        }

        return this;
    },

    applyElement: function(element) {
        if (!element) {
            return;
        }

        return Ext.get(element);
    },

    updateElement: function(element) {
        element.on(this.listeners);

        this.initConfig(this.initialConfig);
    },

    updateInitialOffset: function(initialOffset) {
        if (typeof initialOffset == 'number') {
            initialOffset = {
                x: initialOffset,
                y: initialOffset
            };
        }

        var offset = this.offset,
            x, y;

        offset.x = x = initialOffset.x;
        offset.y = y = initialOffset.y;

        this.getTranslatable().translate(x, y);
    },

    updateCls: function(cls) {
        this.getElement().addCls(cls);
    },

    applyTranslatable: function(translatable, currentInstance) {
        translatable = Ext.factory(translatable, Ext.util.Translatable, currentInstance);
        translatable.setElement(this.getElement());

        return translatable;
    },

    setExtraConstraint: function(constraint) {
        this.extraConstraint = constraint || {};

        this.refreshConstraint();

        return this;
    },

    addExtraConstraint: function(constraint) {
        Ext.merge(this.extraConstraint, constraint);

        this.refreshConstraint();

        return this;
    },

    applyConstraint: function(newConstraint) {
        this.currentConstraint = newConstraint;

        if (!newConstraint) {
            newConstraint = this.defaultConstraint;
        }

        if (newConstraint === 'container') {
            return Ext.merge(this.getContainerConstraint(), this.extraConstraint);
        }

        return Ext.merge({}, this.extraConstraint, newConstraint);
    },

    updateConstraint: function() {
        this.refreshOffset();
    },

    getContainerConstraint: function() {
        var container = this.getContainer(),
            element = this.getElement();

        if (!container || !element.dom) {
            return this.defaultConstraint;
        }

        return {
            min: { x: 0, y: 0 },
            max: { x: this.containerWidth - this.width, y: this.containerHeight - this.height }
        };
    },

    getContainer: function() {
        var container = this.container;

        if (!container) {
            container = this.getElement().getParent();

            if (container) {
                this.container = container;

                container.on({
                    resize: 'onContainerResize',
                    destroy: 'onContainerDestroy',
                    scope: this
                });
            }
        }

        return container;
    },

    onElementResize: function(element, info) {
        this.width = info.width;
        this.height = info.height;

        this.refresh();
    },

    onContainerResize: function(container, info) {
        this.containerWidth = info.width;
        this.containerHeight = info.height;

        this.refresh();
    },

    onContainerDestroy: function() {
        delete this.container;
        delete this.containerSizeMonitor;
    },

    detachListeners: function() {
        this.getElement().un(this.listeners);
    },

    isAxisEnabled: function(axis) {
        var direction = this.getDirection();

        if (axis === 'x') {
            return (direction === this.DIRECTION_BOTH || direction === this.DIRECTION_HORIZONTAL);
        }

        return (direction === this.DIRECTION_BOTH || direction === this.DIRECTION_VERTICAL);
    },

    onDragStart: function(e) {
        if (this.getDisabled()) {
            return false;
        }

        var offset = this.offset;

        this.fireAction('dragstart', [this, e, offset.x, offset.y], this.initDragStart);
    },

    initDragStart: function(me, e, offsetX, offsetY) {
        this.dragStartOffset = {
            x: offsetX,
            y: offsetY
        };

        this.isDragging = true;

        this.getElement().addCls(this.getDraggingCls());
    },

    onDrag: function(e) {
        if (!this.isDragging) {
            return;
        }

        var startOffset = this.dragStartOffset;

        this.fireAction('drag', [this, e, startOffset.x + e.deltaX, startOffset.y + e.deltaY], this.doDrag);
    },

    doDrag: function(me, e, offsetX, offsetY) {
        me.setOffset(offsetX, offsetY);
    },

    onDragEnd: function(e) {
        if (!this.isDragging) {
            return;
        }

        this.onDrag(e);

        this.isDragging = false;

        this.getElement().removeCls(this.getDraggingCls());

        this.fireEvent('dragend', this, e, this.offset.x, this.offset.y);
    },

    setOffset: function(x, y, animation) {
        var currentOffset = this.offset,
            constraint = this.getConstraint(),
            minOffset = constraint.min,
            maxOffset = constraint.max,
            min = Math.min,
            max = Math.max;

        if (this.isAxisEnabled('x') && typeof x == 'number') {
            x = min(max(x, minOffset.x), maxOffset.x);
        }
        else {
            x = currentOffset.x;
        }

        if (this.isAxisEnabled('y') && typeof y == 'number') {
            y = min(max(y, minOffset.y), maxOffset.y);
        }
        else {
            y = currentOffset.y;
        }

        currentOffset.x = x;
        currentOffset.y = y;

        this.getTranslatable().translate(x, y, animation);
    },

    getOffset: function() {
        return this.offset;
    },

    refreshConstraint: function() {
        this.setConstraint(this.currentConstraint);
    },

    refreshOffset: function() {
        var offset = this.offset;

        this.setOffset(offset.x, offset.y);
    },

    refresh: function() {
        this.refreshConstraint();
        this.getTranslatable().refresh();
        this.refreshOffset();
    },

    /**
     * Enable the Draggable.
     * @return {Ext.util.Draggable} This Draggable instance
     */
    enable: function() {
        return this.setDisabled(false);
    },

    /**
     * Disable the Draggable.
     * @return {Ext.util.Draggable} This Draggable instance
     */
    disable: function() {
        return this.setDisabled(true);
    },

    destroy: function() {
        var translatable = this.getTranslatable();

        var element = this.getElement();
        if (element && !element.isDestroyed) {
            element.removeCls(this.getCls());
        }

        this.detachListeners();

        if (translatable) {
            translatable.destroy();
        }
    }

}, function() {
    //<deprecated product=touch since=2.0>
    this.override({
        constructor: function(config) {
            if (config && config.constrain) {
                //<debug warn>
                Ext.Logger.deprecate("'constrain' config is deprecated, please use 'contraint' instead");
                //</debug>
                config.contraint = config.constrain;
                delete config.constrain;
            }

            return this.callOverridden(arguments);
        }
    });
    //</deprecated>
});

