/**
 * Utility class used by Ext.field.Slider.
 * @private
 */
Ext.define('Ext.slider.Slider', {
    extend: 'Ext.Container',
    xtype: 'slider',

    requires: [
        'Ext.slider.Thumb',
        'Ext.fx.easing.EaseOut'
    ],

    /**
    * @event change
    * Fires when the value changes
    * @param {Ext.slider.Slider} this
    * @param {Ext.slider.Thumb} thumb The thumb being changed
    * @param {Number} newValue The new value
    * @param {Number} oldValue The old value
    */

    /**
    * @event dragstart
    * Fires when the slider thumb starts a drag
    * @param {Ext.slider.Slider} this
    * @param {Ext.slider.Thumb} thumb The thumb being dragged
    * @param {Array} value The start value
    * @param {Ext.EventObject} e
    */

    /**
    * @event drag
    * Fires when the slider thumb starts a drag
    * @param {Ext.slider.Slider} this
    * @param {Ext.slider.Thumb} thumb The thumb being dragged
    * @param {Ext.EventObject} e
    */

    /**
    * @event dragend
    * Fires when the slider thumb starts a drag
    * @param {Ext.slider.Slider} this
    * @param {Ext.slider.Thumb} thumb The thumb being dragged
    * @param {Array} value The end value
    * @param {Ext.EventObject} e
    */
    config: {
        baseCls: 'x-slider',

        /**
         * @cfg {Object} thumbConfig The config object to factory {@link Ext.slider.Thumb} instances
         * @accessor
         */
        thumbConfig: {
            draggable: {
                translatable: {
                    easingX: {
                        duration: 300,
                        type: 'ease-out'
                    }
                }
            }
        },

        /**
         * @cfg {Number} increment The increment by which to snap each thumb when its value changes. Any thumb movement
         * will be snapped to the nearest value that is a multiple of the increment (e.g. if increment is 10 and the user
         * tries to move the thumb to 67, it will be snapped to 70 instead)
         * @accessor
         */
        increment : 1,

        /**
         * @cfg {Number/Number[]} value The value(s) of this slider's thumbs. If you pass
         * a number, it will assume you have just 1 thumb.
         * @accessor
         */
        value: 0,

        /**
         * @cfg {Number} minValue The lowest value any thumb on this slider can be set to.
         * @accessor
         */
        minValue: 0,

        /**
         * @cfg {Number} maxValue The highest value any thumb on this slider can be set to.
         * @accessor
         */
        maxValue: 100,

        /**
         * @cfg {Boolean} allowThumbsOverlapping Whether or not to allow multiple thumbs to overlap each other.
         * Setting this to true guarantees the ability to select every possible value in between {@link #minValue}
         * and {@link #maxValue} that satisfies {@link #increment}
         * @accessor
         */
        allowThumbsOverlapping: false,

        /**
         * @cfg {Boolean/Object} animation
         * The animation to use when moving the slider. Possible properties are:
         *
         * - duration
         * - easingX
         * - easingY
         *
         * @accessor
         */
        animation: true,

        /**
         * Will make this field read only, meaning it cannot be changed with used interaction.
         * @cfg {Boolean} readOnly
         * @accessor
         */
        readOnly: false
    },

    /**
     * @cfg {Number/Number[]} values Alias to {@link #value}
     */

    elementWidth: 0,

    offsetValueRatio: 0,

    activeThumb: null,

    constructor: function(config) {
        config = config || {};

        if (config.hasOwnProperty('values')) {
            config.value = config.values;
        }

        this.callParent([config]);
    },

    // @private
    initialize: function() {
        var element = this.element;

        this.callParent();

        element.on({
            scope: this,
            tap: 'onTap',
            resize: 'onResize'
        });

        this.on({
            scope: this,
            delegate: '> thumb',
            dragstart: 'onThumbDragStart',
            drag: 'onThumbDrag',
            dragend: 'onThumbDragEnd'
        });
    },

    /**
     * @private
     */
    factoryThumb: function() {
        return Ext.factory(this.getThumbConfig(), Ext.slider.Thumb);
    },

    /**
     * Returns the Thumb instances bound to this Slider
     * @return {Ext.slider.Thumb[]} The thumb instances
     */
    getThumbs: function() {
        return this.innerItems;
    },

    /**
     * Returns the Thumb instance bound to this Slider
     * @param {Number} [index=0] The index of Thumb to return.
     * @return {Ext.slider.Thumb} The thumb instance
     */
    getThumb: function(index) {
        if (typeof index != 'number') {
            index = 0;
        }

        return this.innerItems[index];
    },

    refreshOffsetValueRatio: function() {
        var valueRange = this.getMaxValue() - this.getMinValue(),
            trackWidth = this.elementWidth - this.thumbWidth;

        this.offsetValueRatio = trackWidth / valueRange;
    },

    onResize: function(element, info) {
        var thumb = this.getThumb(0);
        if (thumb) {
            this.thumbWidth = thumb.getElementWidth();
        }
        this.elementWidth = info.width;
        this.refresh();
    },

    refresh: function() {
        this.refreshValue();
    },

    setActiveThumb: function(thumb) {
        var oldActiveThumb = this.activeThumb;

        if (oldActiveThumb && oldActiveThumb !== thumb) {
            oldActiveThumb.setZIndex(null);
        }

        this.activeThumb = thumb;
        thumb.setZIndex(2);

        return this;
    },

    onThumbDragStart: function(thumb, e) {
        if (e.absDeltaX <= e.absDeltaY || this.getReadOnly()) {
            return false;
        }
        else {
            e.stopPropagation();
        }

        if (this.getAllowThumbsOverlapping()) {
            this.setActiveThumb(thumb);
        }

        this.dragStartValue = this.getValue()[this.getThumbIndex(thumb)];
        this.fireEvent('dragstart', this, thumb, this.dragStartValue, e);
    },

    onThumbDrag: function(thumb, e, offsetX) {
        var index = this.getThumbIndex(thumb),
            offsetValueRatio = this.offsetValueRatio,
            constrainedValue = this.constrainValue(this.getMinValue() + offsetX / offsetValueRatio);

        e.stopPropagation();

        this.setIndexValue(index, constrainedValue);

        this.fireEvent('drag', this, thumb, this.getValue(), e);

        return false;
    },

    setIndexValue: function(index, value, animation) {
        var thumb = this.getThumb(index),
            values = this.getValue(),
            offsetValueRatio = this.offsetValueRatio,
            draggable = thumb.getDraggable();

        draggable.setOffset((value - this.getMinValue()) * offsetValueRatio, null, animation);

        values[index] = value;
    },

    onThumbDragEnd: function(thumb, e) {
        this.refreshThumbConstraints(thumb);
        var index = this.getThumbIndex(thumb),
            newValue = this.getValue()[index],
            oldValue = this.dragStartValue;

        this.fireEvent('dragend', this, thumb, this.getValue(), e);
        if (oldValue !== newValue) {
            this.fireEvent('change', this, thumb, newValue, oldValue);
        }
    },

    getThumbIndex: function(thumb) {
        return this.getThumbs().indexOf(thumb);
    },

    refreshThumbConstraints: function(thumb) {
        var allowThumbsOverlapping = this.getAllowThumbsOverlapping(),
            offsetX = thumb.getDraggable().getOffset().x,
            thumbs = this.getThumbs(),
            index = this.getThumbIndex(thumb),
            previousThumb = thumbs[index - 1],
            nextThumb = thumbs[index + 1],
            thumbWidth = this.thumbWidth;

        if (previousThumb) {
            previousThumb.getDraggable().addExtraConstraint({
                max: {
                    x: offsetX - ((allowThumbsOverlapping) ? 0 : thumbWidth)
                }
            });
        }

        if (nextThumb) {
            nextThumb.getDraggable().addExtraConstraint({
                min: {
                    x: offsetX + ((allowThumbsOverlapping) ? 0 : thumbWidth)
                }
            });
        }
    },

    // @private
    onTap: function(e) {
        if (this.isDisabled()) {
            return;
        }

        var targetElement = Ext.get(e.target);

        if (!targetElement || targetElement.hasCls('x-thumb')) {
            return;
        }

        var touchPointX = e.touch.point.x,
            element = this.element,
            elementX = element.getX(),
            offset = touchPointX - elementX - (this.thumbWidth / 2),
            value = this.constrainValue(this.getMinValue() + offset / this.offsetValueRatio),
            values = this.getValue(),
            minDistance = Infinity,
            ln = values.length,
            i, absDistance, testValue, closestIndex, oldValue, thumb;

        if (ln === 1) {
            closestIndex = 0;
        }
        else {
            for (i = 0; i < ln; i++) {
                testValue = values[i];
                absDistance = Math.abs(testValue - value);

                if (absDistance < minDistance) {
                    minDistance = absDistance;
                    closestIndex = i;
                }
            }
        }

        oldValue = values[closestIndex];
        thumb = this.getThumb(closestIndex);

        this.setIndexValue(closestIndex, value, this.getAnimation());
        this.refreshThumbConstraints(thumb);

        if (oldValue !== value) {
            this.fireEvent('change', this, thumb, value, oldValue);
        }
    },

    // @private
    updateThumbs: function(newThumbs) {
        this.add(newThumbs);
    },

    applyValue: function(value) {
        var values = Ext.Array.from(value || 0),
            filteredValues = [],
            previousFilteredValue = this.getMinValue(),
            filteredValue, i, ln;

        for (i = 0,ln = values.length; i < ln; i++) {
            filteredValue = this.constrainValue(values[i]);

            if (filteredValue < previousFilteredValue) {
                //<debug warn>
                Ext.Logger.warn("Invalid values of '"+Ext.encode(values)+"', values at smaller indexes must " +
                    "be smaller than or equal to values at greater indexes");
                //</debug>
                filteredValue = previousFilteredValue;
            }

            filteredValues.push(filteredValue);

            previousFilteredValue = filteredValue;
        }

        return filteredValues;
    },

    /**
     * Updates the sliders thumbs with their new value(s)
     */
    updateValue: function(newValue, oldValue) {
        var thumbs = this.getThumbs(),
            ln = newValue.length,
            minValue = this.getMinValue(),
            offset = this.offsetValueRatio,
            i;

        this.setThumbsCount(ln);

        for (i = 0; i < ln; i++) {
            thumbs[i].getDraggable().setExtraConstraint(null).setOffset((newValue[i] - minValue) * offset);
        }

        for (i = 0; i < ln; i++) {
            this.refreshThumbConstraints(thumbs[i]);
        }
    },

    /**
     * @private
     */
    refreshValue: function() {
        this.refreshOffsetValueRatio();

        this.setValue(this.getValue());
    },

    /**
     * @private
     * Takes a desired value of a thumb and returns the nearest snap value. e.g if minValue = 0, maxValue = 100, increment = 10 and we
     * pass a value of 67 here, the returned value will be 70. The returned number is constrained within {@link #minValue} and {@link #maxValue},
     * so in the above example 68 would be returned if {@link #maxValue} was set to 68.
     * @param {Number} value The value to snap
     * @return {Number} The snapped value
     */
    constrainValue: function(value) {
        var me = this,
            minValue  = me.getMinValue(),
            maxValue  = me.getMaxValue(),
            increment = me.getIncrement(),
            remainder;

        value = parseFloat(value);

        if (isNaN(value)) {
            value = minValue;
        }

        remainder = (value - minValue) % increment;
        value -= remainder;

        if (Math.abs(remainder) >= (increment / 2)) {
            value += (remainder > 0) ? increment : -increment;
        }

        value = Math.max(minValue, value);
        value = Math.min(maxValue, value);

        return value;
    },

    setThumbsCount: function(count) {
        var thumbs = this.getThumbs(),
            thumbsCount = thumbs.length,
            i, ln, thumb;

        if (thumbsCount > count) {
            for (i = 0,ln = thumbsCount - count; i < ln; i++) {
                thumb = thumbs[thumbs.length - 1];
                thumb.destroy();
            }
        }
        else if (thumbsCount < count) {
            for (i = 0,ln = count - thumbsCount; i < ln; i++) {
                this.add(this.factoryThumb());
            }
        }

        return this;
    },

    /**
     * Convenience method. Calls {@link #setValue}.
     */
    setValues: function(value) {
        this.setValue(value);
    },

    /**
     * Convenience method. Calls {@link #getValue}.
     * @return {Object}
     */
    getValues: function() {
        return this.getValue();
    },

    /**
     * Sets the {@link #increment} configuration.
     * @param  {Number} increment
     * @return {Number}
     */
    applyIncrement: function(increment) {
        if (increment === 0) {
            increment = 1;
        }

        return Math.abs(increment);
    },

    // @private
    updateAllowThumbsOverlapping: function(newValue, oldValue) {
        if (typeof oldValue != 'undefined') {
            this.refreshValue();
        }
    },

    // @private
    updateMinValue: function(newValue, oldValue) {
        if (typeof oldValue != 'undefined') {
            this.refreshValue();
        }
    },

    // @private
    updateMaxValue: function(newValue, oldValue) {
        if (typeof oldValue != 'undefined') {
            this.refreshValue();
        }
    },

    // @private
    updateIncrement: function(newValue, oldValue) {
        if (typeof oldValue != 'undefined') {
            this.refreshValue();
        }
    },

    doSetDisabled: function(disabled) {
        this.callParent(arguments);

        var items = this.getItems().items,
            ln = items.length,
            i;

        for (i = 0; i < ln; i++) {
            items[i].setDisabled(disabled);
        }
    }

}, function() {
    //<deprecated product=touch since=2.0>
    /**
     * @cfg {Boolean} animationDuration
     * Animation duration in ms.
     * @removed 2.0.0 Use the duration property on the animation config instead.
     */
    Ext.deprecateProperty(this, 'animationDuration', null, "Ext.slider.Slider.animationDuration has been removed");
    //</deprecated>
});
