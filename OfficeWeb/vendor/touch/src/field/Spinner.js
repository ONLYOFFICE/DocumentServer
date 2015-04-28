/**
 * @aside guide forms
 *
 * Wraps an HTML5 number field. Example usage:
 *
 *     @example miniphone
 *     var spinner = Ext.create('Ext.field.Spinner', {
 *         label: 'Spinner Field',
 *         minValue: 0,
 *         maxValue: 100,
 *         increment: 2,
 *         cycle: true
 *     });
 *     Ext.Viewport.add({ xtype: 'container', items: [spinner] });
 *
 */
Ext.define('Ext.field.Spinner', {
    extend: 'Ext.field.Number',
    xtype: 'spinnerfield',
    alternateClassName: 'Ext.form.Spinner',
    requires: ['Ext.util.TapRepeater'],

    /**
     * @event spin
     * Fires when the value is changed via either spinner buttons.
     * @param {Ext.field.Spinner} this
     * @param {Number} value
     * @param {String} direction 'up' or 'down'.
     */

    /**
     * @event spindown
     * Fires when the value is changed via the spinner down button.
     * @param {Ext.field.Spinner} this
     * @param {Number} value
     */

    /**
     * @event spinup
     * Fires when the value is changed via the spinner up button.
     * @param {Ext.field.Spinner} this
     * @param {Number} value
     */

    /**
     * @event change
     * Fires just before the field blurs if the field value has changed.
     * @param {Ext.field.Text} this This field.
     * @param {Number} newValue The new value.
     * @param {Number} oldValue The original value.
     */

    /**
     * @event updatedata
     * @hide
     */

    /**
     * @event action
     * @hide
     */

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        cls: Ext.baseCSSPrefix + 'spinner',

        /**
         * @cfg {Number} [minValue=-infinity] The minimum allowed value.
         * @accessor
         */
        minValue: Number.NEGATIVE_INFINITY,

        /**
         * @cfg {Number} [maxValue=infinity] The maximum allowed value.
         * @accessor
         */
        maxValue: Number.MAX_VALUE,

        /**
         * @cfg {Number} stepValue Value that is added or subtracted from the current value when a spinner is used.
         * @accessor
         */
        stepValue: 0.1,

        /**
         * @cfg {Boolean} accelerateOnTapHold True if autorepeating should start slowly and accelerate.
         * @accessor
         */
        accelerateOnTapHold: true,

        /**
         * @cfg {Boolean} cycle When set to `true`, it will loop the values of a minimum or maximum is reached.
         * If the maximum value is reached, the value will be set to the minimum.
         * @accessor
         */
        cycle: false,

        /**
         * @cfg {Boolean} clearIcon
         * @hide
         * @accessor
         */
        clearIcon: false,

        /**
         * @cfg {Number} defaultValue The default value for this field when no value has been set.
         * It is also used when the value is set to `NaN`.
         */
        defaultValue: 0,

        /**
         * @cfg {Number} tabIndex
         * @hide
         */
        tabIndex: -1,

        /**
         * @cfg {Boolean} groupButtons
         * `true` if you want to group the buttons to the right of the fields. `false` if you want the buttons
         * to be at either side of the field.
         */
        groupButtons: true,

        /**
         * @cfg
         * @inheritdoc
         */
        component: {
            disabled: true
        }
    },

    constructor: function() {
        var me = this;

        me.callParent(arguments);

        if (!me.getValue()) {
            me.suspendEvents();
            me.setValue(me.getDefaultValue());
            me.resumeEvents();
        }
    },

    syncEmptyCls: Ext.emptyFn,

    /**
     * Updates the {@link #component} configuration
     */
    updateComponent: function(newComponent) {
        this.callParent(arguments);

        var innerElement = this.innerElement,
            cls = this.getCls();

        if (newComponent) {
            this.spinDownButton = Ext.Element.create({
                cls : cls + '-button ' + cls + '-button-down',
                html: '-'
            });

            this.spinUpButton = Ext.Element.create({
                cls : cls + '-button ' + cls + '-button-up',
                html: '+'
            });

            this.downRepeater = this.createRepeater(this.spinDownButton, this.onSpinDown);
            this.upRepeater = this.createRepeater(this.spinUpButton,     this.onSpinUp);
        }
    },

    updateGroupButtons: function(newGroupButtons, oldGroupButtons) {
        var me = this,
            innerElement = me.innerElement,
            cls = me.getBaseCls() + '-grouped-buttons';

        me.getComponent();

        if (newGroupButtons != oldGroupButtons) {
            if (newGroupButtons) {
                this.addCls(cls);
                innerElement.appendChild(me.spinDownButton);
                innerElement.appendChild(me.spinUpButton);
            } else {
                this.removeCls(cls);
                innerElement.insertFirst(me.spinDownButton);
                innerElement.appendChild(me.spinUpButton);
            }
        }
    },

    applyValue: function(value) {
        value = parseFloat(value);
        if (isNaN(value) || value === null) {
            value = this.getDefaultValue();
        }

        //round the value to 1 decimal
        value = Math.round(value * 10) / 10;

        return this.callParent([value]);
    },

    // @private
    createRepeater: function(el, fn) {
        var me = this,
            repeater = Ext.create('Ext.util.TapRepeater', {
                el: el,
                accelerate: me.getAccelerateOnTapHold()
            });

        repeater.on({
            tap: fn,
            touchstart: 'onTouchStart',
            touchend: 'onTouchEnd',
            scope: me
        });

        return repeater;
    },

    // @private
    onSpinDown: function() {
        if (!this.getDisabled() && !this.getReadOnly()) {
            this.spin(true);
        }
    },

    // @private
    onSpinUp: function() {
        if (!this.getDisabled() && !this.getReadOnly()) {
            this.spin(false);
        }
    },

    // @private
    onTouchStart: function(repeater) {
        if (!this.getDisabled() && !this.getReadOnly()) {
            repeater.getEl().addCls(Ext.baseCSSPrefix + 'button-pressed');
        }
    },

    // @private
    onTouchEnd: function(repeater) {
        repeater.getEl().removeCls(Ext.baseCSSPrefix + 'button-pressed');
    },

    // @private
    spin: function(down) {
        var me = this,
            originalValue = me.getValue(),
            stepValue = me.getStepValue(),
            direction = down ? 'down' : 'up',
            minValue = me.getMinValue(),
            maxValue = me.getMaxValue(),
            value;

        if (down) {
            value = originalValue - stepValue;
        }
        else {
            value = originalValue + stepValue;
        }

        //if cycle is true, then we need to check fi the value hasn't changed and we cycle the value
        if (me.getCycle()) {
            if (originalValue == minValue && value < minValue) {
                value = maxValue;
            }

            if (originalValue == maxValue && value > maxValue) {
                value = minValue;
            }
        }

        me.setValue(value);
        value = me.getValue();

        me.fireEvent('spin', me, value, direction);
        me.fireEvent('spin' + direction, me, value);
    },

    /**
     * @private
     */
    doSetDisabled: function(disabled) {
        Ext.Component.prototype.doSetDisabled.apply(this, arguments);
    },

    /**
     * @private
     */
    setDisabled: function() {
        Ext.Component.prototype.setDisabled.apply(this, arguments);
    },

    reset: function() {
        this.setValue(this.getDefaultValue());
    },

    // @private
    destroy: function() {
        var me = this;
        Ext.destroy(me.downRepeater, me.upRepeater, me.spinDownButton, me.spinUpButton);
        me.callParent(arguments);
    }
}, function() {
    //<deprecated product=touch since=2.0>
    this.override({
        constructor: function(config) {
            if (config) {
                /**
                 * @cfg {String} incrementValue
                 * The increment value of this spinner field.
                 * @deprecated 2.0.0 Please use {@link #increment} instead
                 */
                if (config.hasOwnProperty('incrementValue')) {
                    //<debug warn>
                    Ext.Logger.deprecate("'incrementValue' config is deprecated, please use 'stepValue' config instead", this);
                    //</debug>
                    config.stepValue = config.incrementValue;
                    delete config.incrementValue;
                }

                /**
                 * @cfg {String} increment
                 * The increment value of this spinner field.
                 * @deprecated 2.0.0 Please use {@link #stepValue} instead
                 */
                if (config.hasOwnProperty('increment')) {
                    //<debug warn>
                    Ext.Logger.deprecate("'increment' config is deprecated, please use 'stepValue' config instead", this);
                    //</debug>
                    config.stepValue = config.increment;
                    delete config.increment;
                }
            }

            this.callParent([config]);
        }
    });
    //</deprecated>
});
