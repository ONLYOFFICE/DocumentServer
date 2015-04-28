/**
 * The Form panel presents a set of form fields and provides convenient ways to load and save data. Usually a form
 * panel just contains the set of fields you want to display, ordered inside the items configuration like this:
 *
 *     @example
 *     var form = Ext.create('Ext.form.Panel', {
 *         fullscreen: true,
 *         items: [
 *             {
 *                 xtype: 'textfield',
 *                 name: 'name',
 *                 label: 'Name'
 *             },
 *             {
 *                 xtype: 'emailfield',
 *                 name: 'email',
 *                 label: 'Email'
 *             },
 *             {
 *                 xtype: 'passwordfield',
 *                 name: 'password',
 *                 label: 'Password'
 *             }
 *         ]
 *     });
 *
 * Here we just created a simple form panel which could be used as a registration form to sign up to your service. We
 * added a plain {@link Ext.field.Text text field} for the user's Name, an {@link Ext.field.Email email field} and
 * finally a {@link Ext.field.Password password field}. In each case we provided a {@link Ext.field.Field#name name}
 * config on the field so that we can identify it later on when we load and save data on the form.
 *
 * ##Loading data
 *
 * Using the form we created above, we can load data into it in a few different ways, the easiest is to use
 * {@link #setValues}:
 *
 *     form.setValues({
 *         name: 'Ed',
 *         email: 'ed@sencha.com',
 *         password: 'secret'
 *     });
 *
 * It's also easy to load {@link Ext.data.Model Model} instances into a form - let's say we have a User model and want
 * to load a particular instance into our form:
 *
 *     Ext.define('MyApp.model.User', {
 *         extend: 'Ext.data.Model',
 *         config: {
 *             fields: ['name', 'email', 'password']
 *         }
 *     });
 *
 *     var ed = Ext.create('MyApp.model.User', {
 *         name: 'Ed',
 *         email: 'ed@sencha.com',
 *         password: 'secret'
 *     });
 *
 *     form.setRecord(ed);
 *
 * ##Retrieving form data
 *
 * Getting data out of the form panel is simple and is usually achieve via the {@link #getValues} method:
 *
 *     var values = form.getValues();
 *
 *     //values now looks like this:
 *     {
 *         name: 'Ed',
 *         email: 'ed@sencha.com',
 *         password: 'secret'
 *     }
 *
 * It's also possible to listen to the change events on individual fields to get more timely notification of changes
 * that the user is making. Here we expand on the example above with the User model, updating the model as soon as
 * any of the fields are changed:
 *
 *     var form = Ext.create('Ext.form.Panel', {
 *         listeners: {
 *             '> field': {
 *                 change: function(field, newValue, oldValue) {
 *                     ed.set(field.getName(), newValue);
 *                 }
 *             }
 *         },
 *         items: [
 *             {
 *                 xtype: 'textfield',
 *                 name: 'name',
 *                 label: 'Name'
 *             },
 *             {
 *                 xtype: 'emailfield',
 *                 name: 'email',
 *                 label: 'Email'
 *             },
 *             {
 *                 xtype: 'passwordfield',
 *                 name: 'password',
 *                 label: 'Password'
 *             }
 *         ]
 *     });
 *
 * The above used a new capability of Sencha Touch 2.0, which enables you to specify listeners on child components of any
 * container. In this case, we attached a listener to the {@link Ext.field.Text#change change} event of each form
 * field that is a direct child of the form panel. Our listener gets the name of the field that fired the change event,
 * and updates our {@link Ext.data.Model Model} instance with the new value. For example, changing the email field
 * in the form will update the Model's email field.
 *
 * ##Submitting forms
 *
 * There are a few ways to submit form data. In our example above we have a Model instance that we have updated, giving
 * us the option to use the Model's {@link Ext.data.Model#save save} method to persist the changes back to our server,
 * without using a traditional form submission. Alternatively, we can send a normal browser form submit using the
 * {@link #method} method:
 *
 *     form.submit({
 *         url: 'url/to/submit/to',
 *         method: 'POST',
 *         success: function() {
 *             alert('form submitted successfully!');
 *         }
 *     });
 *
 * In this case we provided the `url` to submit the form to inside the submit call - alternatively you can just set the
 * {@link #url} configuration when you create the form. We can specify other parameters (see {@link #method} for a
 * full list), including callback functions for success and failure, which are called depending on whether or not the
 * form submission was successful. These functions are usually used to take some action in your app after your data
 * has been saved to the server side.
 *
 * @aside guide forms
 * @aside example forms
 * @aside example forms-toolbars
 */
Ext.define('Ext.form.Panel', {
    alternateClassName: 'Ext.form.FormPanel',
    extend  : 'Ext.Panel',
    xtype   : 'formpanel',
    requires: ['Ext.XTemplate', 'Ext.field.Checkbox', 'Ext.Ajax'],

    /**
     * @event submit
     * @preventable doSubmit
     * Fires upon successful (Ajax-based) form submission.
     * @param {Ext.form.Panel} this This FormPanel.
     * @param {Object} result The result object as returned by the server.
     * @param {Ext.EventObject} e The event object.
     */

    /**
     * @event beforesubmit
     * @preventable doBeforeSubmit
     * Fires immediately preceding any Form submit action.
     * Implementations may adjust submitted form values or options prior to execution.
     * A return value of `false` from this listener will abort the submission
     * attempt (regardless of `standardSubmit` configuration).
     * @param {Ext.form.Panel} this This FormPanel.
     * @param {Object} values A hash collection of the qualified form values about to be submitted.
     * @param {Object} options Submission options hash (only available when `standardSubmit` is `false`).
     */

    /**
     * @event exception
     * Fires when either the Ajax HTTP request reports a failure OR the server returns a `success:false`
     * response in the result payload.
     * @param {Ext.form.Panel} this This FormPanel.
     * @param {Object} result Either a failed Ext.data.Connection request object or a failed (logical) server.
     * response payload.
     */

    config: {
        /**
         * @cfg {String} baseCls
         * @inheritdoc
         */
        baseCls: Ext.baseCSSPrefix + 'form',

        /**
         * @cfg {Boolean} standardSubmit
         * Whether or not we want to perform a standard form submit.
         * @accessor
         */
        standardSubmit: false,

        /**
         * @cfg {String} url
         * The default url for submit actions.
         * @accessor
         */
        url: null,

        /**
         * @cfg {Object} baseParams
         * Optional hash of params to be sent (when `standardSubmit` configuration is `false`) on every submit.
         * @accessor
         */
        baseParams : null,

        /**
         * @cfg {Object} submitOnAction
         * When this is set to `true`, the form will automatically submit itself whenever the `action`
         * event fires on a field in this form. The action event usually fires whenever you press
         * go or enter inside a textfield.
         * @accessor
         */
        submitOnAction: false,

        /**
         * @cfg {Ext.data.Model} record The model instance of this form. Can by dynamically set at any time.
         * @accessor
         */
        record: null,

        /**
         * @cfg {String} method
         * The method which this form will be submitted. `post` or `get`.
         */
        method: 'post',

        /**
         * @cfg {Object} scrollable
         * @inheritdoc
         */
        scrollable: {
            translatable: {
                translationMethod: 'scrollposition'
            }
        }
    },

    getElementConfig: function() {
        var config = this.callParent();
        config.tag = "form";

        return config;
    },

    // @private
    initialize: function() {
        var me = this;
        me.callParent();

        me.element.on({
            submit: 'onSubmit',
            scope : me
        });
    },

    updateRecord: function(newRecord) {
        var fields, values, name;

        if (newRecord && (fields = newRecord.fields)) {
            values = this.getValues();
            for (name in values) {
                if (values.hasOwnProperty(name) && fields.containsKey(name)) {
                    newRecord.set(name, values[name]);
                }
            }
        }
        return this;
    },

    /**
     * Loads matching fields from a model instance into this form.
     * @param {Ext.data.Model} instance The model instance.
     * @return {Ext.form.Panel} This form.
     */
    setRecord: function(record) {
        var me = this;

        if (record && record.data) {
            me.setValues(record.data);
        }

        me._record = record;

        return this;
    },

    // @private
    onSubmit: function(e) {
        var me = this;
        if (e && !me.getStandardSubmit()) {
            e.stopEvent();
        } else {
            this.submit();
        }
    },

    updateSubmitOnAction: function(newSubmitOnAction) {
        if (newSubmitOnAction) {
            this.on({
                action: 'onFieldAction',
                scope: this
            });
        } else {
            this.un({
                action: 'onFieldAction',
                scope: this
            });
        }
    },

    // @private
    onFieldAction: function(field) {
        if (this.getSubmitOnAction()) {
            field.blur();
            this.submit();
        }
    },

    /**
     * Performs a Ajax-based submission of form values (if `standardSubmit` is `false`) or otherwise
     * executes a standard HTML Form submit action.
     *
     * @param {Object} options
     * The configuration when submitting this form.
     *
     * @param {String} options.url
     * The url for the action (defaults to the form's {@link #url}).
     *
     * @param {String} options.method
     * The form method to use (defaults to the form's {@link #method}, or POST if not defined).
     *
     * @param {String/Object} params
     * The params to pass when submitting this form (defaults to this forms {@link #baseParams}).
     * Parameters are encoded as standard HTTP parameters using {@link Ext#urlEncode}.
     *
     * @param {Object} headers
     * Request headers to set for the action.
     *
     * @param {Boolean} [autoAbort=false]
     * `true` to abort any pending Ajax request prior to submission.
     * __Note:__ Has no effect when `{@link #standardSubmit}` is enabled.
     *
     * @param {Boolean} [options.submitDisabled=false]
     * `true` to submit all fields regardless of disabled state.
     * __Note:__ Has no effect when `{@link #standardSubmit}` is enabled.
     *
     * @param {String/Object} [waitMsg]
     * If specified, the value which is passed to the loading {@link #masked mask}. See {@link #masked} for
     * more information.
     *
     * @param {Function} options.success
     * The callback that will be invoked after a successful response. A response is successful if
     * a response is received from the server and is a JSON object where the `success` property is set
     * to `true`, `{"success": true}`.
     *
     * The function is passed the following parameters:
     *
     * @param {Ext.form.Panel} options.success.form
     * The form that requested the action.
     *
     * @param {Ext.form.Panel} options.success.result
     * The result object returned by the server as a result of the submit request.
     *
     * @param {Function} options.failure
     * The callback that will be invoked after a failed transaction attempt.
     *
     * The function is passed the following parameters:
     *
     * @param {Ext.form.Panel} options.failure.form
     * The {@link Ext.form.Panel} that requested the submit.
     *
     * @param {Ext.form.Panel} options.failure.result
     * The failed response or result object returned by the server which performed the operation.
     *
     * @param {Object} options.scope
     * The scope in which to call the callback functions (The `this` reference for the callback functions).
     *
     * @return {Ext.data.Connection} The request object.
     */
    submit: function(options) {
        var me = this,
            form = me.element.dom || {},
            formValues;

        options = Ext.apply({
            url : me.getUrl() || form.action,
            submit: false,
            method : me.getMethod() || form.method || 'post',
            autoAbort : false,
            params : null,
            waitMsg : null,
            headers : null,
            success : null,
            failure : null
        }, options || {});

        formValues = me.getValues(me.getStandardSubmit() || !options.submitDisabled);

        return me.fireAction('beforesubmit', [me, formValues, options], 'doBeforeSubmit');
    },

    doBeforeSubmit: function(me, formValues, options) {
        var form = me.element.dom || {};

        if (me.getStandardSubmit()) {
            if (options.url && Ext.isEmpty(form.action)) {
                form.action = options.url;
            }

            // Spinner fields must have their components enabled *before* submitting or else the value
            // will not be posted.
            var fields = this.query('spinnerfield'),
                ln = fields.length,
                i, field;

            for (i = 0; i < ln; i++) {
                field = fields[i];
                if (!field.getDisabled()) {
                    field.getComponent().setDisabled(false);
                }
            }

            form.method = (options.method || form.method).toLowerCase();
            form.submit();
        }
        else {
            if (options.waitMsg) {
                me.setMasked(options.waitMsg);
            }

            return Ext.Ajax.request({
                url: options.url,
                method: options.method,
                rawData: Ext.urlEncode(Ext.apply(
                    Ext.apply({}, me.getBaseParams() || {}),
                    options.params || {},
                    formValues
                )),
                autoAbort: options.autoAbort,
                headers: Ext.apply(
                    {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    options.headers || {}
                ),
                scope: me,
                callback: function(callbackOptions, success, response) {
                    var me = this,
                        responseText = response.responseText,
                        failureFn;

                    me.setMasked(false);

                    failureFn = function() {
                        if (Ext.isFunction(options.failure)) {
                            options.failure.call(options.scope || me, me, response, responseText);
                        }
                        me.fireEvent('exception', me, response);
                    };

                    if (success) {
                        response = Ext.decode(responseText);
                        success = !!response.success;
                        if (success) {
                            if (Ext.isFunction(options.success)) {
                                options.success.call(options.scope || me, me, response, responseText);
                            }
                            me.fireEvent('submit', me, response);
                        } else {
                            failureFn();
                        }
                    }
                    else {
                        failureFn();
                    }
                }
            });
        }
    },

    /**
     * Sets the values of form fields in bulk. Example usage:
     *
     *     myForm.setValues({
     *         name: 'Ed',
     *         crazy: true,
     *         username: 'edspencer'
     *     });
     *
     * If there groups of checkbox fields with the same name, pass their values in an array. For example:
     *
     *     myForm.setValues({
     *         name: 'Jacky',
     *         crazy: false,
     *         hobbies: [
     *             'reading',
     *             'cooking',
     *             'gaming'
     *         ]
     *     });
     *
     * @param {Object} values field name => value mapping object.
     * @return {Ext.form.Panel} This form.
     */
    setValues: function(values) {
        var fields = this.getFields(),
            name, field, value, ln, i, f;

        values = values || {};

        for (name in values) {
            if (values.hasOwnProperty(name)) {
                field = fields[name];
                value = values[name];

                if (field) {
                    // If there are multiple fields with the same name. Checkboxes, radio fields and maybe event just normal fields..
                    if (Ext.isArray(field)) {
                        ln = field.length;

                        // Loop through each of the fields
                        for (i = 0; i < ln; i++) {
                            f = field[i];

                            if (f.isRadio) {
                                // If it is a radio field just use setGroupValue which will handle all of the radio fields
                                f.setGroupValue(value);
                                break;
                            } else if (f.isCheckbox) {
                                if (Ext.isArray(value)) {
                                   f.setChecked((value.indexOf(f._value) != -1));
                               } else {
                                   f.setChecked((value == f._value));
                               }
                            } else {
                                // If it is a bunch of fields with the same name, check if the value is also an array, so we can map it
                                // to each field
                                if (Ext.isArray(value)) {
                                    f.setValue(value[i]);
                                }
                            }
                        }
                    } else {
                        if (field.isRadio || field.isCheckbox) {
                            // If the field is a radio or a checkbox
                            field.setChecked(value);
                        } else {
                            // If just a normal field
                            field.setValue(value);
                        }
                    }
                }
            }
        }

        return this;
    },

    /**
     * Returns an object containing the value of each field in the form, keyed to the field's name.
     * For groups of checkbox fields with the same name, it will be arrays of values. For example:
     *
     *     {
     *         name: "Jacky Nguyen", // From a TextField
     *         favorites: [
     *             'pizza',
     *             'noodle',
     *             'cake'
     *         ]
     *     }
     *
     * @param {Boolean} enabled `true` to return only enabled fields.
     * @param {Boolean} all `true` to return all fields even if they don't have a
     * {@link Ext.field.Field#name name} configured.
     * @return {Object} Object mapping field name to its value.
     */
    getValues: function(enabled, all) {
        var fields = this.getFields(),
            values = {},
            isArray = Ext.isArray,
            field, value, addValue, bucket, name, ln, i;

        // Function which you give a field and a name, and it will add it into the values
        // object accordingly
        addValue = function(field, name) {
            if (!all && (!name || name === 'null')) {
                return;
            }

            if (field.isCheckbox) {
                value = field.getSubmitValue();
            } else {
                value = field.getValue();
            }


            if (!(enabled && field.getDisabled())) {
                // RadioField is a special case where the value returned is the fields valUE
                // ONLY if it is checked
                if (field.isRadio) {
                    if (field.isChecked()) {
                        values[name] = value;
                    }
                } else {
                    // Check if the value already exists
                    bucket = values[name];
                    if (bucket) {
                        // if it does and it isn't an array, we need to make it into an array
                        // so we can push more
                        if (!isArray(bucket)) {
                            bucket = values[name] = [bucket];
                        }

                        // Check if it is an array
                        if (isArray(value)) {
                            // Concat it into the other values
                            bucket = values[name] = bucket.concat(value);
                        } else {
                            // If it isn't an array, just pushed more values
                            bucket.push(value);
                        }
                    } else {
                        values[name] = value;
                    }
                }
            }
        };

        // Loop through each of the fields, and add the values for those fields.
        for (name in fields) {
            if (fields.hasOwnProperty(name)) {
                field = fields[name];

                if (isArray(field)) {
                    ln = field.length;
                    for (i = 0; i < ln; i++) {
                        addValue(field[i], name);
                    }
                } else {
                    addValue(field, name);
                }
            }
        }

        return values;
    },

    /**
     * Resets all fields in the form back to their original values.
     * @return {Ext.form.Panel} This form.
     */
    reset: function() {
        this.getFieldsAsArray().forEach(function(field) {
            field.reset();
        });

        return this;
    },

    /**
     * A convenient method to disable all fields in this form.
     * @return {Ext.form.Panel} This form.
     */
    doSetDisabled: function(newDisabled) {
        this.getFieldsAsArray().forEach(function(field) {
            field.setDisabled(newDisabled);
        });

        return this;
    },

    /**
     * @private
     */
    getFieldsAsArray: function() {
        var fields = [],
            getFieldsFrom = function(item) {
                if (item.isField) {
                    fields.push(item);
                }

                if (item.isContainer) {
                    item.getItems().each(getFieldsFrom);
                }
            };

        this.getItems().each(getFieldsFrom);

        return fields;
    },

    /**
     * @private
     * Returns all {@link Ext.field.Field field} instances inside this form.
     * @param byName return only fields that match the given name, otherwise return all fields.
     * @return {Object/Array} All field instances, mapped by field name; or an array if `byName` is passed.
     */
    getFields: function(byName) {
        var fields = {},
            itemName;

        var getFieldsFrom = function(item) {
            if (item.isField) {
                itemName = item.getName();

                if ((byName && itemName == byName) || typeof byName == 'undefined') {
                    if (fields.hasOwnProperty(itemName)) {
                        if (!Ext.isArray(fields[itemName])) {
                            fields[itemName] = [fields[itemName]];
                        }

                        fields[itemName].push(item);
                    } else {
                        fields[itemName] = item;
                    }
                }

            }

            if (item.isContainer) {
                item.items.each(getFieldsFrom);
            }
        };

        this.getItems().each(getFieldsFrom);

        return (byName) ? (fields[byName] || []) : fields;
    },

    /**
     * Returns an array of fields in this formpanel.
     * @return {Ext.field.Field[]} An array of fields in this form panel.
     * @private
     */
    getFieldsArray: function() {
        var fields = [];

        var getFieldsFrom = function(item) {
            if (item.isField) {
                fields.push(item);
            }

            if (item.isContainer) {
                item.items.each(getFieldsFrom);
            }
        };

        this.items.each(getFieldsFrom);

        return fields;
    },

    getFieldsFromItem: Ext.emptyFn,

    /**
     * Shows a generic/custom mask over a designated Element.
     * @param {String/Object} cfg Either a string message or a configuration object supporting
     * the following options:
     *
     *     {
     *         message : 'Please Wait',
     *         cls : 'form-mask'
     *     }
     *
     * @param {Object} target
     * @return {Ext.form.Panel} This form
     * @deprecated 2.0.0 Please use {@link #setMasked} instead.
     */
    showMask: function(cfg, target) {
        //<debug>
        Ext.Logger.warn('showMask is now deprecated. Please use Ext.form.Panel#setMasked instead');
        //</debug>

        cfg = Ext.isObject(cfg) ? cfg.message : cfg;

        if (cfg) {
            this.setMasked({
                xtype: 'loadmask',
                message: cfg
            });
        } else {
            this.setMasked(true);
        }

        return this;
    },

    /**
     * Hides a previously shown wait mask (See {@link #showMask}).
     * @return {Ext.form.Panel} this
     * @deprecated 2.0.0 Please use {@link #unmask} or {@link #setMasked} instead.
     */
    hideMask: function() {
        this.setMasked(false);
        return this;
    },

    /**
     * Returns the currently focused field
     * @return {Ext.field.Field} The currently focused field, if one is focused or `null`.
     * @private
     */
    getFocusedField: function() {
        var fields = this.getFieldsArray(),
            ln = fields.length,
            field, i;

        for (i = 0; i < ln; i++) {
            field = fields[i];
            if (field.isFocused) {
                return field;
            }
        }

        return null;
    },

    /**
     * @private
     * @return {Boolean/Ext.field.Field} The next field if one exists, or `false`.
     * @private
     */
    getNextField: function() {
        var fields = this.getFieldsArray(),
            focusedField = this.getFocusedField(),
            index;

        if (focusedField) {
            index = fields.indexOf(focusedField);

            if (index !== fields.length - 1) {
                index++;
                return fields[index];
            }
        }

        return false;
    },

    /**
     * Tries to focus the next field in the form, if there is currently a focused field.
     * @return {Boolean/Ext.field.Field} The next field that was focused, or `false`.
     * @private
     */
    focusNextField: function() {
        var field = this.getNextField();
        if (field) {
            field.focus();
            return field;
        }

        return false;
    },

    /**
     * @private
     * @return {Boolean/Ext.field.Field} The next field if one exists, or `false`.
     */
    getPreviousField: function() {
        var fields = this.getFieldsArray(),
            focusedField = this.getFocusedField(),
            index;

        if (focusedField) {
            index = fields.indexOf(focusedField);

            if (index !== 0) {
                index--;
                return fields[index];
            }
        }

        return false;
    },

    /**
     * Tries to focus the previous field in the form, if there is currently a focused field.
     * @return {Boolean/Ext.field.Field} The previous field that was focused, or `false`.
     * @private
     */
    focusPreviousField: function() {
        var field = this.getPreviousField();
        if (field) {
            field.focus();
            return field;
        }

        return false;
    }
}, function() {

    //<deprecated product=touch since=2.0>
    Ext.deprecateClassMethod(this, {
        /**
         * @method
         * @inheritdoc Ext.form.Panel#setRecord
         * @deprecated 2.0.0 Please use #setRecord instead.
         */
        loadRecord: 'setRecord',
        /**
         * @method
         * @inheritdoc Ext.form.Panel#setRecord
         * @deprecated 2.0.0 Please use #setRecord instead.
         */
        loadModel: 'setRecord',
        /**
         * @method
         * @inheritdoc Ext.form.Panel#setRecord
         * @deprecated 2.0.0 Please use #setRecord instead.
         */
        load: 'setRecord'
    });

    this.override({
        constructor: function(config) {
            /**
             * @cfg {Ext.XTemplate/String/String[]} waitTpl
             * The defined waitMsg template.  Used for precise control over the masking agent used
             * to mask the FormPanel (or other Element) during form Ajax/submission actions. For more options, see
             * {@link #showMask} method.
             * @removed 2.0.0 Please use a custom {@link Ext.LoadMask} class and the {@link #masked} configuration
             * when {@link #method submitting} your form.
             */

            /**
             * @cfg {Ext.dom.Element} waitMsgTarget The target of any mask shown on this form.
             * @removed 2.0.0 There is no need to set a mask target anymore. Please see the {@link #masked} configuration instead.
             */
            if (config && config.hasOwnProperty('waitMsgTarget')) {
                delete config.waitMsgTarget;
            }

            this.callParent([config]);
        }
    });
    //</deprecated>
});
