/**
 * @aside example pickers
 * A general picker class. {@link Ext.picker.Slot}s are used to organize multiple scrollable slots into a single picker. {@link #slots} is
 * the only necessary configuration.
 *
 * The {@link #slots} configuration with a few key values:
 *
 * - `name`: The name of the slot (will be the key when using {@link #getValues} in this {@link Ext.picker.Picker}).
 * - `title`: The title of this slot (if {@link #useTitles} is set to `true`).
 * - `data`/`store`: The data or store to use for this slot.
 *
 * Remember, {@link Ext.picker.Slot} class extends from {@link Ext.dataview.DataView}.
 *
 * ## Examples
 *
 *     @example miniphone preview
 *     var picker = Ext.create('Ext.Picker', {
 *         slots: [
 *             {
 *                 name : 'limit_speed',
 *                 title: 'Speed',
 *                 data : [
 *                     {text: '50 KB/s', value: 50},
 *                     {text: '100 KB/s', value: 100},
 *                     {text: '200 KB/s', value: 200},
 *                     {text: '300 KB/s', value: 300}
 *                 ]
 *             }
 *         ]
 *     });
 *     Ext.Viewport.add(picker);
 *     picker.show();
 *
 * You can also customize the top toolbar on the {@link Ext.picker.Picker} by changing the {@link #doneButton} and {@link #cancelButton} configurations:
 *
 *     @example miniphone preview
 *     var picker = Ext.create('Ext.Picker', {
 *         doneButton: 'I\'m done!',
 *         cancelButton: false,
 *         slots: [
 *             {
 *                 name : 'limit_speed',
 *                 title: 'Speed',
 *                 data : [
 *                     {text: '50 KB/s', value: 50},
 *                     {text: '100 KB/s', value: 100},
 *                     {text: '200 KB/s', value: 200},
 *                     {text: '300 KB/s', value: 300}
 *                 ]
 *             }
 *         ]
 *     });
 *     Ext.Viewport.add(picker);
 *     picker.show();
 *
 * Or by passing a custom {@link #toolbar} configuration:
 *
 *     @example miniphone preview
 *     var picker = Ext.create('Ext.Picker', {
 *         doneButton: false,
 *         cancelButton: false,
 *         toolbar: {
 *             ui: 'light',
 *             title: 'My Picker!'
 *         },
 *         slots: [
 *             {
 *                 name : 'limit_speed',
 *                 title: 'Speed',
 *                 data : [
 *                     {text: '50 KB/s', value: 50},
 *                     {text: '100 KB/s', value: 100},
 *                     {text: '200 KB/s', value: 200},
 *                     {text: '300 KB/s', value: 300}
 *                 ]
 *             }
 *         ]
 *     });
 *     Ext.Viewport.add(picker);
 *     picker.show();
 */
Ext.define('Ext.picker.Picker', {
    extend: 'Ext.Sheet',
    alias : 'widget.picker',
    alternateClassName: 'Ext.Picker',
    requires: ['Ext.picker.Slot', 'Ext.TitleBar', 'Ext.data.Model'],

    isPicker: true,

    /**
     * @event pick
     * Fired when a slot has been picked
     * @param {Ext.Picker} this This Picker.
     * @param {Object} The values of this picker's slots, in `{name:'value'}` format.
     * @param {Ext.Picker.Slot} slot An instance of Ext.Picker.Slot that has been picked.
     */

    /**
     * @event change
     * Fired when the value of this picker has changed the Done button has been pressed.
     * @param {Ext.picker.Picker} this This Picker.
     * @param {Object} value The values of this picker's slots, in `{name:'value'}` format.
     */

    /**
     * @event cancel
     * Fired when the cancel button is tapped and the values are reverted back to
     * what they were.
     * @param {Ext.Picker} this This Picker.
     */

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        cls: Ext.baseCSSPrefix + 'picker',

        /**
         * @cfg {String/Mixed} doneButton
         * Can be either:
         *
         * - A {String} text to be used on the Done button.
         * - An {Object} as config for {@link Ext.Button}.
         * - `false` or `null` to hide it.
         * @accessor
         */
        doneButton: true,

        /**
         * @cfg {String/Mixed} cancelButton
         * Can be either:
         *
         * - A {String} text to be used on the Cancel button.
         * - An {Object} as config for {@link Ext.Button}.
         * - `false` or `null` to hide it.
         * @accessor
         */
        cancelButton: true,

        /**
         * @cfg {Boolean} useTitles
         * Generate a title header for each individual slot and use
         * the title configuration of the slot.
         * @accessor
         */
        useTitles: false,

        /**
         * @cfg {Array} slots
         * An array of slot configurations.
         *
         * - `name` {String} - Name of the slot
         * - `data` {Array} - An array of text/value pairs in the format `{text: 'myKey', value: 'myValue'}`
         * - `title` {String} - Title of the slot. This is used in conjunction with `useTitles: true`.
         *
         * @accessor
         */
        slots: null,

        /**
         * @cfg {String/Number} value The value to initialize the picker with.
         * @accessor
         */
        value: null,

        /**
         * @cfg {Number} height
         * The height of the picker.
         * @accessor
         */
        height: 220,

        /**
         * @cfg
         * @inheritdoc
         */
        layout: {
            type : 'hbox',
            align: 'stretch'
        },

        /**
         * @cfg
         * @hide
         */
        centered: false,

        /**
         * @cfg
         * @inheritdoc
         */
        left : 0,

        /**
         * @cfg
         * @inheritdoc
         */
        right: 0,

        /**
         * @cfg
         * @inheritdoc
         */
        bottom: 0,

        // @private
        defaultType: 'pickerslot',

        /**
         * @cfg {Ext.TitleBar/Ext.Toolbar/Object} toolbar
         * The toolbar which contains the {@link #doneButton} and {@link #cancelButton} buttons.
         * You can override this if you wish, and add your own configurations. Just ensure that you take into account
         * the {@link #doneButton} and {@link #cancelButton} configurations.
         *
         * The default xtype is a {@link Ext.TitleBar}:
         *
         *     toolbar: {
         *         items: [
         *             {
         *                 xtype: 'button',
         *                 text: 'Left',
         *                 align: 'left'
         *             },
         *             {
         *                 xtype: 'button',
         *                 text: 'Right',
         *                 align: 'left'
         *             }
         *         ]
         *     }
         *
         * Or to use a {@link Ext.Toolbar instead}:
         *
         *     toolbar: {
         *         xtype: 'toolbar',
         *         items: [
         *             {
         *                 xtype: 'button',
         *                 text: 'Left'
         *             },
         *             {
         *                 xtype: 'button',
         *                 text: 'Left Two'
         *             }
         *         ]
         *     }
         *
         * @accessor
         */
        toolbar: true
    },

    initElement: function() {
        this.callParent(arguments);

        var me = this,
            clsPrefix = Ext.baseCSSPrefix,
            innerElement = this.innerElement;

        //insert the mask, and the picker bar
        this.mask = innerElement.createChild({
            cls: clsPrefix + 'picker-mask'
        });

        this.bar = this.mask.createChild({
            cls: clsPrefix + 'picker-bar'
        });

        me.on({
            scope   : this,
            delegate: 'pickerslot',
            slotpick: 'onSlotPick'
        });

        me.on({
            scope: this,
            show: 'onShow'
        });
    },

    /**
     * @private
     */
    applyToolbar: function(config) {
        if (config === true) {
            config = {};
        }

        Ext.applyIf(config, {
            docked: 'top'
        });

        return Ext.factory(config, 'Ext.TitleBar', this.getToolbar());
    },

    /**
     * @private
     */
    updateToolbar: function(newToolbar, oldToolbar) {
        if (newToolbar) {
            this.add(newToolbar);
        }

        if (oldToolbar) {
            this.remove(oldToolbar);
        }
    },

    /**
     * Updates the {@link #doneButton} configuration. Will change it into a button when appropriate, or just update the text if needed.
     * @param {Object} config
     * @return {Object}
     */
    applyDoneButton: function(config) {
        if (config) {
            if (Ext.isBoolean(config)) {
                config = {};
            }

            if (typeof config == "string") {
                config = {
                    text: config
                };
            }

            Ext.applyIf(config, {
                ui: 'action',
                align: 'right',
                text: 'Done'
            });
        }

        return Ext.factory(config, 'Ext.Button', this.getDoneButton());
    },

    updateDoneButton: function(newDoneButton, oldDoneButton) {
        var toolbar = this.getToolbar();

        if (newDoneButton) {
            toolbar.add(newDoneButton);
            newDoneButton.on('tap', this.onDoneButtonTap, this);
        } else if (oldDoneButton) {
            toolbar.remove(oldDoneButton);
        }
    },

    /**
     * Updates the {@link #cancelButton} configuration. Will change it into a button when appropriate, or just update the text if needed.
     * @param {Object} config
     * @return {Object}
     */
    applyCancelButton: function(config) {
        if (config) {
            if (Ext.isBoolean(config)) {
                config = {};
            }

            if (typeof config == "string") {
                config = {
                    text: config
                };
            }

            Ext.applyIf(config, {
                align: 'left',
                text: 'Cancel'
            });
        }

        return Ext.factory(config, 'Ext.Button', this.getCancelButton());
    },

    updateCancelButton: function(newCancelButton, oldCancelButton) {
        var toolbar = this.getToolbar();

        if (newCancelButton) {
            toolbar.add(newCancelButton);
            newCancelButton.on('tap', this.onCancelButtonTap, this);
        } else if (oldCancelButton) {
            toolbar.remove(oldCancelButton);
        }
    },

    /**
     * @private
     */
    updateUseTitles: function(useTitles) {
        var innerItems = this.getInnerItems(),
            ln = innerItems.length,
            cls = Ext.baseCSSPrefix + 'use-titles',
            i, innerItem;

        //add a cls onto the picker
        if (useTitles) {
            this.addCls(cls);
        } else {
            this.removeCls(cls);
        }

        //show the time on each of the slots
        for (i = 0; i < ln; i++) {
            innerItem = innerItems[i];

            if (innerItem.isSlot) {
                innerItem.setShowTitle(useTitles);
            }
        }
    },

    applySlots: function(slots) {
        //loop through each of the slots and add a reference to this picker
        if (slots) {
            var ln = slots.length,
                i;

            for (i = 0; i < ln; i++) {
                slots[i].picker = this;
            }
        }

        return slots;
    },

    /**
     * Adds any new {@link #slots} to this picker, and removes existing {@link #slots}
     * @private
     */
    updateSlots: function(newSlots) {
        var bcss = Ext.baseCSSPrefix,
            innerItems;

        this.removeAll();

        if (newSlots) {
            this.add(newSlots);
        }

        innerItems = this.getInnerItems();
        if (innerItems.length > 0) {
            innerItems[0].addCls(bcss + 'first');
            innerItems[innerItems.length - 1].addCls(bcss + 'last');
        }

        this.updateUseTitles(this.getUseTitles());
    },

    /**
     * @private
     * Called when the done button has been tapped.
     */
    onDoneButtonTap: function() {
        var oldValue = this._value,
            newValue = this.getValue(true);

        if (newValue != oldValue) {
            this.fireEvent('change', this, newValue);
        }

        this.hide();
    },

    /**
     * @private
     * Called when the cancel button has been tapped.
     */
    onCancelButtonTap: function() {
        this.fireEvent('cancel', this);
        this.hide();
    },

    /**
     * @private
     * Called when a slot has been picked.
     */
    onSlotPick: function(slot) {
        this.fireEvent('pick', this, this.getValue(true), slot);
    },

    onShow: function() {
        if (!this.isHidden()) {
            this.setValue(this._value);
        }
    },

    /**
     * Sets the values of the pickers slots.
     * @param {Object} values The values in a {name:'value'} format.
     * @param {Boolean} animated `true` to animate setting the values.
     * @return {Ext.Picker} this This picker.
     */
    setValue: function(values, animated) {
        var me = this,
            slots = me.getInnerItems(),
            ln = slots.length,
            key, slot, loopSlot, i, value;

        if (!values) {
            values = {};
            for (i = 0; i < ln; i++) {
                //set the value to false so the slot will return null when getValue is called
                values[slots[i].config.name] = null;
            }
        }

        for (key in values) {
            slot = null;
            value = values[key];
            for (i = 0; i < slots.length; i++) {
                loopSlot = slots[i];
                if (loopSlot.config.name == key) {
                    slot = loopSlot;
                    break;
                }
            }

            if (slot) {
                if (animated) {
                    slot.setValueAnimated(value);
                } else {
                    slot.setValue(value);
                }
            }
        }

        me._values = me._value = values;

        return me;
    },

    setValueAnimated: function(values) {
        this.setValue(values, true);
    },

    /**
     * Returns the values of each of the pickers slots
     * @return {Object} The values of the pickers slots
     */
    getValue: function(useDom) {
        var values = {},
            items = this.getItems().items,
            ln = items.length,
            item, i;

        if (useDom) {
            for (i = 0; i < ln; i++) {
                item = items[i];
                if (item && item.isSlot) {
                    values[item.getName()] = item.getValue(useDom);
                }
            }

            this._values = values;
        }

        return this._values;
    },

    /**
     * Returns the values of each of the pickers slots.
     * @return {Object} The values of the pickers slots.
     */
    getValues: function() {
        return this.getValue();
    },

    destroy: function() {
        this.callParent();
        Ext.destroy(this.mask, this.bar);
    }
}, function() {
    //<deprecated product=touch since=2.0>
    /**
     * @member Ext.picker.Picker
     * @cfg {String} activeCls
     * CSS class to be applied to individual list items when they have been chosen.
     * @removed 2.0.0
     */
    Ext.deprecateProperty(this, 'activeCls', null, "Ext.picker.Picker.activeCls has been removed");

    /**
     * @method getCard
     * @inheritdoc Ext.picker.Picker#getActiveItem
     * @deprecated 2.0.0 Please use {@link #getActiveItem} instead
     */
    Ext.deprecateClassMethod(this, 'getCard', 'getActiveItem');

    /**
     * @method setCard
     * @inheritdoc Ext.picker.Picker#setActiveItem
     * @deprecated 2.0.0 Please use {@link #setActiveItem} instead
     */
    Ext.deprecateClassMethod(this, 'setCard', 'setActiveItem');
    //</deprecated>
});

