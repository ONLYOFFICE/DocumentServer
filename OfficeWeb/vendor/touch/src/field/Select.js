/**
 * @aside guide forms
 *
 * Simple Select field wrapper. Example usage:
 *
 *     @example
 *     Ext.create('Ext.form.Panel', {
 *         fullscreen: true,
 *         items: [
 *             {
 *                 xtype: 'fieldset',
 *                 title: 'Select',
 *                 items: [
 *                     {
 *                         xtype: 'selectfield',
 *                         label: 'Choose one',
 *                         options: [
 *                             {text: 'First Option',  value: 'first'},
 *                             {text: 'Second Option', value: 'second'},
 *                             {text: 'Third Option',  value: 'third'}
 *                         ]
 *                     }
 *                 ]
 *             }
 *         ]
 *     });
 */
Ext.define('Ext.field.Select', {
    extend: 'Ext.field.Text',
    xtype: 'selectfield',
    alternateClassName: 'Ext.form.Select',
    requires: [
        'Ext.Panel',
        'Ext.picker.Picker',
        'Ext.data.Store',
        'Ext.data.StoreManager',
        'Ext.dataview.List'
    ],

    /**
     * @event change
     * Fires when an option selection has changed
     * @param {Ext.field.Select} this
     * @param {Mixed} newValue The new value
     * @param {Mixed} oldValue The old value
     */

    /**
     * @event focus
     * Fires when this field receives input focus. This happens both when you tap on the field and when you focus on the field by using
     * 'next' or 'tab' on a keyboard.
     *
     * Please note that this event is not very reliable on Android. For example, if your Select field is second in your form panel,
     * you cannot use the Next button to get to this select field. This functionality works as expected on iOS.
     * @param {Ext.field.Select} this This field
     * @param {Ext.event.Event} e
     */

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        ui: 'select',

        /**
         * @cfg {Boolean} useClearIcon
         * @hide
         */

        /**
         * @cfg {String/Number} valueField The underlying {@link Ext.data.Field#name data value name} (or numeric Array index) to bind to this
         * Select control.
         * @accessor
         */
        valueField: 'value',

        /**
         * @cfg {String/Number} displayField The underlying {@link Ext.data.Field#name data value name} (or numeric Array index) to bind to this
         * Select control. This resolved value is the visibly rendered value of the available selection options.
         * @accessor
         */
        displayField: 'text',

        /**
         * @cfg {Ext.data.Store/Object/String} store The store to provide selection options data.
         * Either a Store instance, configuration object or store ID.
         * @accessor
         */
        store: null,

        /**
         * @cfg {Array} options An array of select options.
         *
         *     [
         *         {text: 'First Option',  value: 'first'},
         *         {text: 'Second Option', value: 'second'},
         *         {text: 'Third Option',  value: 'third'}
         *     ]
         *
         * __Note:__ Option object member names should correspond with defined {@link #valueField valueField} and {@link #displayField displayField} values.
         * This config will be ignored if a {@link #store store} instance is provided.
         * @accessor
         */
        options: null,

        /**
         * @cfg {String} hiddenName Specify a `hiddenName` if you're using the {@link Ext.form.Panel#standardSubmit standardSubmit} option.
         * This name will be used to post the underlying value of the select to the server.
         * @accessor
         */
        hiddenName: null,

        /**
         * @cfg {Object} component
         * @accessor
         * @hide
         */
        component: {
            useMask: true
        },

        /**
         * @cfg {Boolean} clearIcon
         * @hide
         * @accessor
         */
        clearIcon: false,

        /**
         * @cfg {String/Boolean} usePicker
         * `true` if you want this component to always use a {@link Ext.picker.Picker}.
         * `false` if you want it to use a popup overlay {@link Ext.List}.
         * `auto` if you want to show a {@link Ext.picker.Picker} only on phones.
         */
        usePicker: 'auto',

        /**
         * @cfg {Boolean} autoSelect
         * `true` to auto select the first value in the {@link #store} or {@link #options} when they are changed. Only happens when
         * the {@link #value} is set to `null`.
         */
        autoSelect: true,

        /**
         * @cfg {Object} defaultPhonePickerConfig
         * The default configuration for the picker component when you are on a phone.
         */
        defaultPhonePickerConfig: null,

        /**
         * @cfg {Object} defaultTabletPickerConfig
         * The default configuration for the picker component when you are on a tablet.
         */
        defaultTabletPickerConfig: null,

        /**
         * @cfg
         * @inheritdoc
         */
        name: 'picker'
    },

    // @private
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

    /**
     * @private
     */
    updateDefaultPhonePickerConfig: function(newConfig) {
        var picker = this.picker;
        if (picker) {
            picker.setConfig(newConfig);
        }
    },

    /**
     * @private
     */
    updateDefaultTabletPickerConfig: function(newConfig) {
        var listPanel = this.listPanel;
        if (listPanel) {
            listPanel.setConfig(newConfig);
        }
    },

    /**
     * @private
     * Checks if the value is `auto`. If it is, it only uses the picker if the current device type
     * is a phone.
     */
    applyUsePicker: function(usePicker) {
        if (usePicker == "auto") {
            usePicker = (Ext.os.deviceType == 'Phone');
        }

        return Boolean(usePicker);
    },

    syncEmptyCls: Ext.emptyFn,

    /**
     * @private
     */
    applyValue: function(value) {
        var record = value,
            index, store;

        //we call this so that the options configruation gets intiailized, so that a store exists, and we can
        //find the correct value
        this.getOptions();

        store = this.getStore();

        if ((value != undefined && !value.isModel) && store) {
            index = store.find(this.getValueField(), value, null, null, null, true);

            if (index == -1) {
                index = store.find(this.getDisplayField(), value, null, null, null, true);
            }

            record = store.getAt(index);
        }

        return record;
    },

    updateValue: function(newValue, oldValue) {
        this.record = newValue;

        this.callParent([(newValue && newValue.isModel) ? newValue.get(this.getDisplayField()) : '']);
    },

    getValue: function() {
        var record = this.record;
        return (record && record.isModel) ? record.get(this.getValueField()) : null;
    },

    /**
     * Returns the current selected {@link Ext.data.Model record} instance selected in this field.
     * @return {Ext.data.Model} the record.
     */
    getRecord: function() {
        return this.record;
    },

    // @private
    getPhonePicker: function() {
        var config = this.getDefaultPhonePickerConfig();

        if (!this.picker) {
            this.picker = Ext.create('Ext.picker.Picker', Ext.apply({
                slots: [{
                    align       : 'center',
                    name        : this.getName(),
                    valueField  : this.getValueField(),
                    displayField: this.getDisplayField(),
                    value       : this.getValue(),
                    store       : this.getStore()
                }],
                listeners: {
                    change: this.onPickerChange,
                    scope: this
                }
            }, config));
        }

        return this.picker;
    },

    // @private
    getTabletPicker: function() {
        var config = this.getDefaultTabletPickerConfig();

        if (!this.listPanel) {
            this.listPanel = Ext.create('Ext.Panel', Ext.apply({
                left: 0,
                top: 0,
                modal: true,
                cls: Ext.baseCSSPrefix + 'select-overlay',
                layout: 'fit',
                hideOnMaskTap: true,
                width: Ext.os.is.Phone ? '14em' : '18em',
                height: Ext.os.is.Phone ? '12.5em' : '22em',
                items: {
                    xtype: 'list',
                    store: this.getStore(),
                    itemTpl: '<span class="x-list-label">{' + this.getDisplayField() + ':htmlEncode}</span>',
                    listeners: {
                        select : this.onListSelect,
                        itemtap: this.onListTap,
                        scope  : this
                    }
                }
            }, config));
        }

        return this.listPanel;
    },

    // @private
    onMaskTap: function() {
        if (this.getDisabled()) {
            return false;
        }

        this.onFocus();

        return false;
    },

    /**
     * Shows the picker for the select field, whether that is a {@link Ext.picker.Picker} or a simple
     * {@link Ext.List list}.
     */
    showPicker: function() {
        var store = this.getStore();
        //check if the store is empty, if it is, return
        if (!store || store.getCount() === 0) {
            return;
        }

        if (this.getReadOnly()) {
            return;
        }

        this.isFocused = true;

        if (this.getUsePicker()) {
            var picker = this.getPhonePicker(),
                name   = this.getName(),
                value  = {};

            value[name] = this.getValue();
            picker.setValue(value);
            if (!picker.getParent()) {
                Ext.Viewport.add(picker);
            }
            picker.show();
        } else {
            var listPanel = this.getTabletPicker(),
                list = listPanel.down('list'),
                index, record;

            store = list.getStore();
            index = store.find(this.getValueField(), this.getValue(), null, null, null, true);
            record = store.getAt((index == -1) ? 0 : index);

            if (!listPanel.getParent()) {
                Ext.Viewport.add(listPanel);
            }

            listPanel.showBy(this.getComponent());
            list.select(record, null, true);
        }
    },

    // @private
    onListSelect: function(item, record) {
        var me = this;
        if (record) {
            me.setValue(record);
        }
    },

    onListTap: function() {
        this.listPanel.hide({
            type : 'fade',
            out  : true,
            scope: this
        });
    },

    // @private
    onPickerChange: function(picker, value) {
        var me = this,
            newValue = value[me.getName()],
            store = me.getStore(),
            index = store.find(me.getValueField(), newValue, null, null, null, true),
            record = store.getAt(index);

        me.setValue(record);
    },

    onChange: function(component, newValue, oldValue) {
        var me = this,
            store = me.getStore(),
            index = (store) ? store.find(me.getDisplayField(), oldValue) : -1,
            valueField = me.getValueField(),
            record = (store) ? store.getAt(index) : null;

        oldValue = (record) ? record.get(valueField) : null;

        me.fireEvent('change', me, me.getValue(), oldValue);
    },

    /**
     * Updates the underlying `<options>` list with new values.
     * @param {Array} options An array of options configurations to insert or append.
     *
     *     selectBox.setOptions([
     *         {text: 'First Option',  value: 'first'},
     *         {text: 'Second Option', value: 'second'},
     *         {text: 'Third Option',  value: 'third'}
     *     ]).setValue('third');
     *
     * __Note:__ option object member names should correspond with defined {@link #valueField valueField} and
     * {@link #displayField displayField} values.
     * @return {Ext.field.Select} this
     */
    updateOptions: function(newOptions) {
        var store = this.getStore();

        if (!store) {
            this.setStore(true);
            store = this._store;
        }

        if (!newOptions) {
            store.clearData();
        }
        else {
            store.setData(newOptions);
            this.onStoreDataChanged(store);
        }
        return this;
    },

    applyStore: function(store) {
        if (store === true) {
            store = Ext.create('Ext.data.Store', {
                fields: [this.getValueField(), this.getDisplayField()],
                autoDestroy: true
            });
        }

        if (store) {
            store = Ext.data.StoreManager.lookup(store);

            store.on({
                scope: this,
                addrecords: 'onStoreDataChanged',
                removerecords: 'onStoreDataChanged',
                updaterecord: 'onStoreDataChanged',
                refresh: 'onStoreDataChanged'
            });
        }

        return store;
    },

    updateStore: function(newStore) {
        if (newStore) {
            this.onStoreDataChanged(newStore);
        }

        if (this.getUsePicker() && this.picker) {
            this.picker.down('pickerslot').setStore(newStore);
        } else if (this.listPanel) {
            this.listPanel.down('dataview').setStore(newStore);
        }
    },

    /**
     * Called when the internal {@link #store}'s data has changed.
     */
    onStoreDataChanged: function(store) {
        var initialConfig = this.getInitialConfig(),
            value = this.getValue();

        if (value || value == 0) {
            this.updateValue(this.applyValue(value));
        }

        if (this.getValue() === null) {
            if (initialConfig.hasOwnProperty('value')) {
                this.setValue(initialConfig.value);
            }

            if (this.getValue() === null && this.getAutoSelect()) {
                if (store.getCount() > 0) {
                    this.setValue(store.getAt(0));
                }
            }
        }
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

    /**
     * Resets the Select field to the value of the first record in the store.
     * @return {Ext.field.Select} this
     * @chainable
     */
    reset: function() {
        var store = this.getStore(),
            record = (this.originalValue) ? this.originalValue : store.getAt(0);

        if (store && record) {
            this.setValue(record);
        }

        return this;
    },

    onFocus: function(e) {
        var component = this.getComponent();
        this.fireEvent('focus', this, e);

        if (Ext.os.is.Android4) {
            component.input.dom.focus();
        }
        component.input.dom.blur();

        this.isFocused = true;

        this.showPicker();
    },

    destroy: function () {
        this.callParent(arguments);
        var store = this.getStore();

        if (store && store.getAutoDestroy()) {
            Ext.destroy(store);
        }
    }
});
