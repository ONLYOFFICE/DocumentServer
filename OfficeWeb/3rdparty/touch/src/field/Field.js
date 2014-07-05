/**
 * @aside guide forms
 *
 * Field is the base class for all form fields used in Sencha Touch. It provides a lot of shared functionality to all
 * field subclasses (for example labels, simple validation, {@link #clearIcon clearing} and tab index management), but
 * is rarely used directly. Instead, it is much more common to use one of the field subclasses:
 *
 *     xtype            Class
 *     ---------------------------------------
 *     textfield        {@link Ext.field.Text}
 *     numberfield      {@link Ext.field.Number}
 *     textareafield    {@link Ext.field.TextArea}
 *     hiddenfield      {@link Ext.field.Hidden}
 *     radiofield       {@link Ext.field.Radio}
 *     checkboxfield    {@link Ext.field.Checkbox}
 *     selectfield      {@link Ext.field.Select}
 *     togglefield      {@link Ext.field.Toggle}
 *     fieldset         {@link Ext.form.FieldSet}
 *
 * Fields are normally used within the context of a form and/or fieldset. See the {@link Ext.form.Panel FormPanel}
 * and {@link Ext.form.FieldSet FieldSet} docs for examples on how to put those together, or the list of links above
 * for usage of individual field types. If you wish to create your own Field subclasses you can extend this class,
 * though it is sometimes more useful to extend {@link Ext.field.Text} as this provides additional text entry
 * functionality.
 */
Ext.define('Ext.field.Field', {
    extend: 'Ext.Decorator',
    alternateClassName: 'Ext.form.Field',
    xtype: 'field',
    requires: [
        'Ext.field.Input'
    ],

    /**
     * Set to `true` on all Ext.field.Field subclasses. This is used by {@link Ext.form.Panel#getValues} to determine which
     * components inside a form are fields.
     * @property isField
     * @type Boolean
     */
    isField: true,

    // @private
    isFormField: true,

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        baseCls: Ext.baseCSSPrefix + 'field',

        /**
         * The label of this field
         * @cfg {String} label
         * @accessor
         */
        label: null,

        /**
         * @cfg {String} labelAlign The position to render the label relative to the field input.
         * Available options are: 'top', 'left', 'bottom' and 'right'
         * @accessor
         */
        labelAlign: 'left',

        /**
         * @cfg {Number/String} labelWidth The width to make this field's label.
         * @accessor
         */
        labelWidth: '30%',

        /**
         * @cfg {Boolean} labelWrap `true` to allow the label to wrap. If set to `false`, the label will be truncated with
         * an ellipsis.
         * @accessor
         */
        labelWrap: false,

        /**
         * @cfg {Boolean} clearIcon `true` to use a clear icon in this field.
         * @accessor
         */
        clearIcon: null,

        /**
         * @cfg {Boolean} required `true` to make this field required.
         *
         * __Note:__ this only causes a visual indication.
         *
         * Doesn't prevent user from submitting the form.
         * @accessor
         */
        required: false,

        /**
         * The label Element associated with this Field.
         *
         * __Note:__ Only available if a {@link #label} is specified.
         * @type Ext.Element
         * @property labelEl
         * @deprecated 2.0
         */

        /**
         * @cfg {String} [inputType='text'] The type attribute for input fields -- e.g. radio, text, password, file.
         * The types 'file' and 'password' must be used to render those field types currently -- there are
         * no separate Ext components for those.
         * @deprecated 2.0 Please use `input.type` instead.
         * @accessor
         */
        inputType: null,

        /**
         * @cfg {String} name The field's HTML name attribute.
         *
         * __Note:__ this property must be set if this field is to be automatically included with.
         * {@link Ext.form.Panel#method-submit form submit()}.
         * @accessor
         */
        name: null,

        /**
         * @cfg {Mixed} value A value to initialize this field with.
         * @accessor
         */
        value: null,

        /**
         * @cfg {Number} tabIndex The `tabIndex` for this field. Note this only applies to fields that are rendered,
         * not those which are built via `applyTo`.
         * @accessor
         */
        tabIndex: null

        /**
         * @cfg {Object} component The inner component for this field.
         */

        /**
         * @cfg {Boolean} fullscreen
         * @hide
         */
    },

    cachedConfig: {
        /**
         * @cfg {String} labelCls Optional CSS class to add to the Label element.
         * @accessor
         */
        labelCls: null,

        /**
         * @cfg {String} requiredCls The `className` to be applied to this Field when the {@link #required} configuration is set to `true`.
         * @accessor
         */
        requiredCls: Ext.baseCSSPrefix + 'field-required',

        /**
         * @cfg {String} inputCls CSS class to add to the input element of this fields {@link #component}
         */
        inputCls: null
    },

    /**
     * @cfg {Boolean} isFocused
     * `true` if this field is currently focused.
     * @private
     */

    getElementConfig: function() {
        var prefix = Ext.baseCSSPrefix;

        return {
            reference: 'element',
            className: 'x-container',
            children: [
                {
                    reference: 'label',
                    cls: prefix + 'form-label',
                    children: [{
                        reference: 'labelspan',
                        tag: 'span'
                    }]
                },
                {
                    reference: 'innerElement',
                    cls: prefix + 'component-outer'
                }
            ]
        };
    },

    // @private
    updateLabel: function(newLabel, oldLabel) {
        var renderElement = this.renderElement,
            prefix = Ext.baseCSSPrefix;

        if (newLabel) {
            this.labelspan.setHtml(newLabel);
            renderElement.addCls(prefix + 'field-labeled');
        } else {
            renderElement.removeCls(prefix + 'field-labeled');
        }
    },

    // @private
    updateLabelAlign: function(newLabelAlign, oldLabelAlign) {
        var renderElement = this.renderElement,
            prefix = Ext.baseCSSPrefix;

        if (newLabelAlign) {
            renderElement.addCls(prefix + 'label-align-' + newLabelAlign);

            if (newLabelAlign == "top" || newLabelAlign == "bottom") {
                this.label.setWidth('100%');
            } else {
                this.updateLabelWidth(this.getLabelWidth());
            }
        }

        if (oldLabelAlign) {
            renderElement.removeCls(prefix + 'label-align-' + oldLabelAlign);
        }
    },

    // @private
    updateLabelCls: function(newLabelCls, oldLabelCls) {
        if (newLabelCls) {
            this.label.addCls(newLabelCls);
        }

        if (oldLabelCls) {
            this.label.removeCls(oldLabelCls);
        }
    },

    // @private
    updateLabelWidth: function(newLabelWidth) {
        var labelAlign = this.getLabelAlign();

        if (newLabelWidth) {
            if (labelAlign == "top" || labelAlign == "bottom") {
                this.label.setWidth('100%');
            } else {
                this.label.setWidth(newLabelWidth);
            }
        }
    },

    // @private
    updateLabelWrap: function(newLabelWrap, oldLabelWrap) {
        var cls = Ext.baseCSSPrefix + 'form-label-nowrap';

        if (!newLabelWrap) {
            this.addCls(cls);
        } else {
            this.removeCls(cls);
        }
    },

    /**
     * Updates the {@link #required} configuration.
     * @private
     */
    updateRequired: function(newRequired) {
        this.renderElement[newRequired ? 'addCls' : 'removeCls'](this.getRequiredCls());
    },

    /**
     * Updates the {@link #required} configuration
     * @private
     */
    updateRequiredCls: function(newRequiredCls, oldRequiredCls) {
        if (this.getRequired()) {
            this.renderElement.replaceCls(oldRequiredCls, newRequiredCls);
        }
    },

    // @private
    initialize: function() {
        var me = this;
        me.callParent();

        me.doInitValue();
    },

    /**
     * @private
     */
    doInitValue: function() {
        /**
         * @property {Mixed} originalValue
         * The original value of the field as configured in the {@link #value} configuration.
         * setting is `true`.
         */
        this.originalValue = this.getInitialConfig().value;
    },

    /**
     * Resets the current field value back to the original value on this field when it was created.
     *
     *     // This will create a field with an original value
     *     var field = Ext.Viewport.add({
     *         xtype: 'textfield',
     *         value: 'first value'
     *     });
     *
     *     // Update the value
     *     field.setValue('new value');
     *
     *     // Now you can reset it back to the `first value`
     *     field.reset();
     *
     * @return {Ext.field.Field} this
     */
    reset: function() {
        this.setValue(this.originalValue);

        return this;
    },

    /**
     * Returns `true` if the value of this Field has been changed from its {@link #originalValue}.
     * Will return `false` if the field is disabled or has not been rendered yet.
     *
     * @return {Boolean} `true` if this field has been changed from its original value (and
     * is not disabled), `false` otherwise.
     */
    isDirty: function() {
        return false;
    }
}, function() {
    //<deprecated product=touch since=2.0>
    var prototype = this.prototype;

    this.override({
        constructor: function(config) {
            config = config || {};

            // helper method for deprecating a property
            var deprecateProperty = function(property, obj, newProperty) {
                if (config.hasOwnProperty(property)) {
                    if (obj) {
                        config[obj] = config[obj] || {};
                        config[obj][(newProperty) ? newProperty : property] = config[obj][(newProperty) ? newProperty : property] || config[property];
                    } else {
                        config[newProperty] = config[property];
                    }

                    delete config[property];

                    //<debug warn>
                    Ext.Logger.deprecate("'" + property + "' config is deprecated, use the '" + ((obj) ? obj + "." : "") + ((newProperty) ? newProperty : property) + "' config instead", 2);
                    //</debug>
                }
            };

			// See https://sencha.jira.com/browse/TOUCH-1184

            /**
             * @member Ext.field.Field
             * @cfg {String} fieldCls CSS class to add to the field.
             * @deprecated 2.0.0 Please use the {@link #inputCls} configuration instead.
             */
            deprecateProperty('fieldCls', null, 'inputCls');

            /**
             * @member Ext.field.Field
             * @cfg {String} fieldLabel The label for this Field.
             * @deprecated 2.0.0 Please use the {@link #label} configuration instead.
             */
            deprecateProperty('fieldLabel', null, 'label');

            /**
             * @member Ext.field.Field
             * @cfg {String} useClearIcon `true` to use a clear icon in this field.
             * @deprecated 2.0.0 Please use the {@link #clearIcon} configuration instead.
             */
            deprecateProperty('useClearIcon', null, 'clearIcon');

            //<debug warn>
            if (config.hasOwnProperty('autoCreateField')) {
                Ext.Logger.deprecate("'autoCreateField' config is deprecated. If you are subclassing Ext.field.Field and you do not want a Ext.field.Input, set the 'input' config to false.", this);
            }
            //</debug>

            this.callOverridden(arguments);
        }
    });

    Ext.Object.defineProperty(prototype, 'fieldEl', {
        get: function() {
            //<debug warn>
            Ext.Logger.deprecate("'fieldEl' is deprecated, please use getInput() to get an instance of Ext.field.Field instead", this);
            //</debug>

            return this.getInput().input;
        }
    });

    Ext.Object.defineProperty(prototype, 'labelEl', {
        get: function() {
            //<debug warn>
            Ext.Logger.deprecate("'labelEl' is deprecated", this);
            //</debug>

            return this.getLabel().element;
        }
    });
    //</deprecated>
});
