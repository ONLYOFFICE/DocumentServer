/**
 * @aside guide forms
 *
 * The radio field is an enhanced version of the native browser radio controls and is a good way of allowing your user
 * to choose one option out of a selection of several (for example, choosing a favorite color):
 *
 *     @example
 *     var form = Ext.create('Ext.form.Panel', {
 *         fullscreen: true,
 *         items: [
 *             {
 *                 xtype: 'radiofield',
 *                 name : 'color',
 *                 value: 'red',
 *                 label: 'Red',
 *                 checked: true
 *             },
 *             {
 *                 xtype: 'radiofield',
 *                 name : 'color',
 *                 value: 'green',
 *                 label: 'Green'
 *             },
 *             {
 *                 xtype: 'radiofield',
 *                 name : 'color',
 *                 value: 'blue',
 *                 label: 'Blue'
 *             }
 *         ]
 *     });
 *
 * Above we created a simple form which allows the user to pick a color from the options red, green and blue. Because
 * we gave each of the fields above the same {@link #name}, the radio field ensures that only one of them can be
 * checked at a time. When we come to get the values out of the form again or submit it to the server, only 1 value
 * will be sent for each group of radio fields with the same name:
 *
 *     form.getValues(); //looks like {color: 'red'}
 *     form.submit(); //sends a single field back to the server (in this case color: red)
 *
 */
Ext.define('Ext.field.Radio', {
    extend: 'Ext.field.Checkbox',
    xtype: 'radiofield',
    alternateClassName: 'Ext.form.Radio',

    isRadio: true,

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        ui: 'radio',

        /**
         * @cfg
         * @inheritdoc
         */
        component: {
            type: 'radio',
            cls: Ext.baseCSSPrefix + 'input-radio'
        }
    },

    getValue: function() {
        return (this._value) ? this._value : null;
    },

    setValue: function(value) {
        this._value = value;
        return this;
    },

    getSubmitValue: function() {
        var value = this._value;
        if (typeof value == "undefined" || value == null) {
            value = true;
        }
        return (this.getChecked()) ? value : null;
    },

    updateChecked: function(newChecked) {
        this.getComponent().setChecked(newChecked);

        if (this.initialized) {
            this.refreshGroupValues();
        }
    },

    // @private
    onMaskTap: function(component, e) {
        var me = this,
            dom = component.input.dom;

        if (me.getDisabled()) {
            return false;
        }

        if (!me.getChecked()) {
            dom.checked = true;
        }

        me.refreshGroupValues();

        //return false so the mask does not disappear
        return false;
    },

    /**
     * Returns the selected value if this radio is part of a group (other radio fields with the same name, in the same FormPanel),
     * @return {String}
     */
    getGroupValue: function() {
        var fields = this.getSameGroupFields(),
            ln = fields.length,
            i = 0,
            field;

        for (; i < ln; i++) {
            field = fields[i];
            if (field.getChecked()) {
                return field.getValue();
            }
        }

        return null;
    },

    /**
     * Set the matched radio field's status (that has the same value as the given string) to checked.
     * @param {String} value The value of the radio field to check.
     * @return {Ext.field.Radio} The field that is checked.
     */
    setGroupValue: function(value) {
        var fields = this.getSameGroupFields(),
            ln = fields.length,
            i = 0,
            field;

        for (; i < ln; i++) {
            field = fields[i];
            if (field.getValue() === value) {
                field.setChecked(true);
                return field;
            }
        }
    },

    /**
     * Loops through each of the fields this radiofield is linked to (has the same name) and
     * calls `onChange` on those fields so the appropriate event is fired.
     * @private
     */
    refreshGroupValues: function() {
        var fields = this.getSameGroupFields(),
            ln = fields.length,
            i = 0,
            field;

        for (; i < ln; i++) {
            field = fields[i];
            field.onChange();
        }
    }
});
