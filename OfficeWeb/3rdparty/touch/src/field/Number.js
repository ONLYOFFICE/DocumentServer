/**
 * @aside guide forms
 *
 * The Number field creates an HTML5 number input and is usually created inside a form. Because it creates an HTML
 * number input field, most browsers will show a specialized virtual keyboard for entering numbers. The Number field
 * only accepts numerical input and also provides additional spinner UI that increases or decreases the current value
 * by a configured {@link #stepValue step value}. Here's how we might use one in a form:
 *
 *     @example
 *     Ext.create('Ext.form.Panel', {
 *         fullscreen: true,
 *         items: [
 *             {
 *                 xtype: 'fieldset',
 *                 title: 'How old are you?',
 *                 items: [
 *                     {
 *                         xtype: 'numberfield',
 *                         label: 'Age',
 *                         minValue: 18,
 *                         maxValue: 150,
 *                         name: 'age'
 *                     }
 *                 ]
 *             }
 *         ]
 *     });
 *
 * Or on its own, outside of a form:
 *
 *     Ext.create('Ext.field.Number', {
 *         label: 'Age',
 *         value: '26'
 *     });
 *
 * ## minValue, maxValue and stepValue
 *
 * The {@link #minValue} and {@link #maxValue} configurations are self-explanatory and simply constrain the value
 * entered to the range specified by the configured min and max values. The other option exposed by this component
 * is {@link #stepValue}, which enables you to set how much the value changes every time the up and down spinners
 * are tapped on. For example, to create a salary field that ticks up and down by $1,000 each tap we can do this:
 *
 *     @example
 *     Ext.create('Ext.form.Panel', {
 *         fullscreen: true,
 *         items: [
 *             {
 *                 xtype: 'fieldset',
 *                 title: 'Are you rich yet?',
 *                 items: [
 *                     {
 *                         xtype: 'numberfield',
 *                         label: 'Salary',
 *                         value: 30000,
 *                         minValue: 25000,
 *                         maxValue: 50000,
 *                         stepValue: 1000
 *                     }
 *                 ]
 *             }
 *         ]
 *     });
 *
 * This creates a field that starts with a value of $30,000, steps up and down in $1,000 increments and will not go
 * beneath $25,000 or above $50,000.
 *
 * Because number field inherits from {@link Ext.field.Text textfield} it gains all of the functionality that text
 * fields provide, including getting and setting the value at runtime, validations and various events that are fired as
 * the user interacts with the component. Check out the {@link Ext.field.Text} docs to see the additional functionality
 * available.
 */
Ext.define('Ext.field.Number', {
    extend: 'Ext.field.Text',
    xtype: 'numberfield',
    alternateClassName: 'Ext.form.Number',

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        component: {
            type: 'number'
        },

        /**
         * @cfg
         * @inheritdoc
         */
        ui: 'number'
    },

    proxyConfig: {
        /**
         * @cfg {Number} minValue The minimum value that this Number field can accept
         * @accessor
         */
        minValue: null,

        /**
         * @cfg {Number} maxValue The maximum value that this Number field can accept
         * @accessor
         */
        maxValue: null,

        /**
         * @cfg {Number} stepValue The amount by which the field is incremented or decremented each time the spinner is tapped.
         * Defaults to undefined, which means that the field goes up or down by 1 each time the spinner is tapped
         * @accessor
         */
        stepValue: null
    },

    applyValue: function(value) {
        var minValue = this.getMinValue(),
            maxValue = this.getMaxValue();

        if (Ext.isNumber(minValue)) {
            value = Math.max(value, minValue);
        }

        if (Ext.isNumber(maxValue)) {
            value = Math.min(value, maxValue);
        }

        value = parseFloat(value);
        return (isNaN(value)) ? '' : value;
    },

    getValue: function() {
        var value = parseFloat(this.callParent(), 10);
        return (isNaN(value)) ? null : value;
    },

    doClearIconTap: function(me, e) {
        me.getComponent().setValue('');
        me.getValue();
        me.hideClearIcon();
    }
});
