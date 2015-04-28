/**
 * @aside guide forms
 *
 * This is a specialized field which shows a {@link Ext.picker.Date} when tapped. If it has a predefined value,
 * or a value is selected in the {@link Ext.picker.Date}, it will be displayed like a normal {@link Ext.field.Text}
 * (but not selectable/changable).
 *
 *     Ext.create('Ext.field.DatePicker', {
 *         label: 'Birthday',
 *         value: new Date()
 *     });
 *
 * {@link Ext.field.DatePicker} fields are very simple to implement, and have no required configurations.
 *
 * ## Examples
 *
 * It can be very useful to set a default {@link #value} configuration on {@link Ext.field.DatePicker} fields. In
 * this example, we set the {@link #value} to be the current date. You can also use the {@link #setValue} method to
 * update the value at any time.
 *
 *     @example miniphone preview
 *     Ext.create('Ext.form.Panel', {
 *         fullscreen: true,
 *         items: [
 *             {
 *                 xtype: 'fieldset',
 *                 items: [
 *                     {
 *                         xtype: 'datepickerfield',
 *                         label: 'Birthday',
 *                         name: 'birthday',
 *                         value: new Date()
 *                     }
 *                 ]
 *             },
 *             {
 *                 xtype: 'toolbar',
 *                 docked: 'bottom',
 *                 items: [
 *                     { xtype: 'spacer' },
 *                     {
 *                         text: 'setValue',
 *                         handler: function() {
 *                             var datePickerField = Ext.ComponentQuery.query('datepickerfield')[0];
 *
 *                             var randomNumber = function(from, to) {
 *                                 return Math.floor(Math.random() * (to - from + 1) + from);
 *                             };
 *
 *                             datePickerField.setValue({
 *                                 month: randomNumber(0, 11),
 *                                 day  : randomNumber(0, 28),
 *                                 year : randomNumber(1980, 2011)
 *                             });
 *                         }
 *                     },
 *                     { xtype: 'spacer' }
 *                 ]
 *             }
 *         ]
 *     });
 *
 * When you need to retrieve the date from the {@link Ext.field.DatePicker}, you can either use the {@link #getValue} or
 * {@link #getFormattedValue} methods:
 *
 *     @example preview
 *     Ext.create('Ext.form.Panel', {
 *         fullscreen: true,
 *         items: [
 *             {
 *                 xtype: 'fieldset',
 *                 items: [
 *                     {
 *                         xtype: 'datepickerfield',
 *                         label: 'Birthday',
 *                         name: 'birthday',
 *                         value: new Date()
 *                     }
 *                 ]
 *             },
 *             {
 *                 xtype: 'toolbar',
 *                 docked: 'bottom',
 *                 items: [
 *                     {
 *                         text: 'getValue',
 *                         handler: function() {
 *                             var datePickerField = Ext.ComponentQuery.query('datepickerfield')[0];
 *                             Ext.Msg.alert(null, datePickerField.getValue());
 *                         }
 *                     },
 *                     { xtype: 'spacer' },
 *                     {
 *                         text: 'getFormattedValue',
 *                         handler: function() {
 *                             var datePickerField = Ext.ComponentQuery.query('datepickerfield')[0];
 *                             Ext.Msg.alert(null, datePickerField.getFormattedValue());
 *                         }
 *                     }
 *                 ]
 *             }
 *         ]
 *     });
 *
 *
 */
Ext.define('Ext.field.DatePicker', {
    extend: 'Ext.field.Text',
    alternateClassName: 'Ext.form.DatePicker',
    xtype: 'datepickerfield',
    requires: [
        'Ext.picker.Date',
        'Ext.DateExtras'
    ],

    /**
     * @event change
     * Fires when a date is selected
     * @param {Ext.field.DatePicker} this
     * @param {Date} newDate The new date
     * @param {Date} oldDate The old date
     */

    config: {
        ui: 'select',

        /**
         * @cfg {Object/Ext.picker.Date} picker
         * An object that is used when creating the internal {@link Ext.picker.Date} component or a direct instance of {@link Ext.picker.Date}.
         * @accessor
         */
        picker: true,

        /**
         * @cfg {Boolean}
         * @hide
         * @accessor
         */
        clearIcon: false,

        /**
         * @cfg {Object/Date} value
         * Default value for the field and the internal {@link Ext.picker.Date} component. Accepts an object of 'year',
         * 'month' and 'day' values, all of which should be numbers, or a {@link Date}.
         *
         * Example: {year: 1989, day: 1, month: 5} = 1st May 1989 or new Date()
         * @accessor
         */

        /**
         * @cfg {Boolean} destroyPickerOnHide
         * Whether or not to destroy the picker widget on hide. This save memory if it's not used frequently,
         * but increase delay time on the next show due to re-instantiation.
         * @accessor
         */
        destroyPickerOnHide: false,

        /**
         * @cfg {String} [dateFormat=Ext.util.Format.defaultDateFormat] The format to be used when displaying the date in this field.
         * Accepts any valid date format. You can view formats over in the {@link Ext.Date} documentation.
         */
        dateFormat: null,

        /**
         * @cfg {Object}
         * @hide
         */
        component: {
            useMask: true
        }
    },

    initialize: function() {
        var me = this,
            component = me.getComponent();

        me.callParent();

        component.on({
            scope: me,
            masktap: 'onMaskTap'
        });

        if (Ext.os.is.Android2) {
            component.input.dom.disabled = true;
        }
    },

    syncEmptyCls: Ext.emptyFn,

    applyValue: function(value) {
        if (!Ext.isDate(value) && !Ext.isObject(value)) {
            return null;
        }

        if (Ext.isObject(value)) {
            return new Date(value.year, value.month - 1, value.day);
        }

        return value;
    },

    updateValue: function(newValue, oldValue) {
        var me     = this,
            picker = me._picker;

        if (picker && picker.isPicker) {
            picker.setValue(newValue);
        }

        // Ext.Date.format expects a Date
        if (newValue !== null) {
            me.getComponent().setValue(Ext.Date.format(newValue, me.getDateFormat() || Ext.util.Format.defaultDateFormat));
        } else {
            me.getComponent().setValue('');
        }

        if (newValue !== oldValue) {
            me.fireEvent('change', me, newValue, oldValue);
        }
    },

    /**
     * Updates the date format in the field.
     * @private
     */
    updateDateFormat: function(newDateFormat, oldDateFormat) {
        var value = this.getValue();
        if (newDateFormat != oldDateFormat && Ext.isDate(value)) {
            this.getComponent().setValue(Ext.Date.format(value, newDateFormat || Ext.util.Format.defaultDateFormat));
        }
    },

    /**
     * Returns the {@link Date} value of this field.
     * If you wanted a formated date
     * @return {Date} The date selected
     */
    getValue: function() {
        if (this._picker && this._picker instanceof Ext.picker.Date) {
            return this._picker.getValue();
        }

        return this._value;
    },

    /**
     * Returns the value of the field formatted using the specified format. If it is not specified, it will default to
     * {@link #dateFormat} and then {@link Ext.util.Format#defaultDateFormat}.
     * @param {String} format The format to be returned.
     * @return {String} The formatted date.
     */
    getFormattedValue: function(format) {
        var value = this.getValue();
        return (Ext.isDate(value)) ? Ext.Date.format(value, format || this.getDateFormat() || Ext.util.Format.defaultDateFormat) : value;
    },

    applyPicker: function(picker, pickerInstance) {
        if (pickerInstance && pickerInstance.isPicker) {
            picker = pickerInstance.setConfig(picker);
        }

        return picker;
    },

    getPicker: function() {
        var picker = this._picker,
            value = this.getValue();

        if (picker && !picker.isPicker) {
            picker = Ext.factory(picker, Ext.picker.Date);
            if (value != null) {
                picker.setValue(value);
            }
        }

        picker.on({
            scope: this,
            change: 'onPickerChange',
            hide  : 'onPickerHide'
        });
        Ext.Viewport.add(picker);
        this._picker = picker;

        return picker;
    },

    /**
     * @private
     * Listener to the tap event of the mask element. Shows the internal DatePicker component when the button has been tapped.
     */
    onMaskTap: function() {
        if (this.getDisabled()) {
            return false;
        }

        this.onFocus();

        return false;
    },

    /**
     * Called when the picker changes its value.
     * @param {Ext.picker.Date} picker The date picker.
     * @param {Object} value The new value from the date picker.
     * @private
     */
    onPickerChange: function(picker, value) {
        var me = this,
            oldValue = me.getValue();

        me.setValue(value);
        me.fireEvent('select', me, value);
        me.onChange(me, value, oldValue);
    },

    /**
     * Override this or change event will be fired twice. change event is fired in updateValue
     * for this field. TOUCH-2861
     */
    onChange: Ext.emptyFn,

    /**
     * Destroys the picker when it is hidden, if
     * {@link Ext.field.DatePicker#destroyPickerOnHide destroyPickerOnHide} is set to `true`.
     * @private
     */
    onPickerHide: function() {
        var me     = this,
            picker = me.getPicker();

        if (me.getDestroyPickerOnHide() && picker) {
            picker.destroy();
            me._picker = me.getInitialConfig().picker || true;
        }
    },

    reset: function() {
        this.setValue(this.originalValue);
    },

    onFocus: function(e) {
        var component = this.getComponent();
        this.fireEvent('focus', this, e);

        if (Ext.os.is.Android4) {
            component.input.dom.focus();
        }
        component.input.dom.blur();

        if (this.getReadOnly()) {
            return false;
        }

        this.isFocused = true;

        this.getPicker().show();
    },

    // @private
    destroy: function() {
        var picker = this._picker;

        if (picker && picker.isPicker) {
            picker.destroy();
        }

        this.callParent(arguments);
    }
    //<deprecated product=touch since=2.0>
}, function() {
    this.override({
        getValue: function(format) {
            if (format) {
                //<debug warn>
                Ext.Logger.deprecate("format argument of the getValue method is deprecated, please use getFormattedValue instead", this);
                //</debug>
                return this.getFormattedValue(format);
            }
            return this.callOverridden();
        }
    });

    /**
     * @method getDatePicker
     * @inheritdoc Ext.field.DatePicker#getPicker
     * @deprecated 2.0.0 Please use #getPicker instead
     */
    Ext.deprecateMethod(this, 'getDatePicker', 'getPicker');
    //</deprecated>
});
