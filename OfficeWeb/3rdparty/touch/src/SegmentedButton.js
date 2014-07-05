/**
 * SegmentedButton is a container for a group of {@link Ext.Button}s. Generally a SegmentedButton would be
 * a child of a {@link Ext.Toolbar} and would be used to switch between different views.
 *
 * ## Example usage:
 *
 *     @example
 *     var segmentedButton = Ext.create('Ext.SegmentedButton', {
 *         allowMultiple: true,
 *         items: [
 *             {
 *                 text: 'Option 1'
 *             },
 *             {
 *                 text: 'Option 2',
 *                 pressed: true
 *             },
 *             {
 *                 text: 'Option 3'
 *             }
 *         ],
 *         listeners: {
 *             toggle: function(container, button, pressed){
 *                 alert("User toggled the '" + button.getText() + "' button: " + (pressed ? 'on' : 'off'));
 *             }
 *         }
 *     });
 *     Ext.Viewport.add({ xtype: 'container', padding: 10, items: [segmentedButton] });
 */
Ext.define('Ext.SegmentedButton', {
    extend: 'Ext.Container',
    xtype : 'segmentedbutton',
    requires: ['Ext.Button'],

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        baseCls: Ext.baseCSSPrefix + 'segmentedbutton',

        /**
         * @cfg {String} pressedCls
         * CSS class when a button is in pressed state.
         * @accessor
         */
        pressedCls: Ext.baseCSSPrefix + 'button-pressed',

        /**
         * @cfg {Boolean} allowMultiple
         * Allow multiple pressed buttons.
         * @accessor
         */
        allowMultiple: false,

        /**
         * @cfg {Boolean} allowDepress
         * Allow toggling the pressed state of each button.
         * Defaults to `true` when {@link #allowMultiple} is `true`.
         * @accessor
         */
        allowDepress: false,

        /**
         * @cfg {Boolean} allowToggle Allow child buttons to be pressed when tapped on. Set to `false` to allow tapping but not toggling of the buttons.
         * @accessor
         */
        allowToggle: true,

        /**
         * @cfg {Array} pressedButtons
         * The pressed buttons for this segmented button.
         *
         * You can remove all pressed buttons by calling {@link #setPressedButtons} with an empty array.
         * @accessor
         */
        pressedButtons: [],

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
         * @inheritdoc
         */
        defaultType: 'button'
    },

    /**
     * @event toggle
     * Fires when any child button's pressed state has changed.
     * @param {Ext.SegmentedButton} this
     * @param {Ext.Button} button The toggled button.
     * @param {Boolean} isPressed Boolean to indicate if the button was pressed or not.
     */

    initialize: function() {
        var me = this;

        me.callParent();

        me.on({
            delegate: '> button',
            scope   : me,
            tap: 'onButtonRelease'
        });

        me.onAfter({
            delegate: '> button',
            scope   : me,
            hiddenchange: 'onButtonHiddenChange'
        });
    },

    updateAllowMultiple: function(allowMultiple) {
        if (!this.initialized && !this.getInitialConfig().hasOwnProperty('allowDepress') && allowMultiple) {
            this.setAllowDepress(true);
        }
    },

    /**
     * We override `initItems` so we can check for the pressed config.
     */
    applyItems: function() {
        var me = this,
            pressedButtons = [],
            ln, i, item, items;

        //call the parent first so the items get converted into a MixedCollection
        me.callParent(arguments);

        items = this.getItems();
        ln = items.length;

        for (i = 0; i < ln; i++) {
            item = items.items[i];
            if (item.getInitialConfig('pressed')) {
                pressedButtons.push(items.items[i]);
            }
        }

        me.updateFirstAndLastCls(items);

        me.setPressedButtons(pressedButtons);
    },

    /**
     * Button sets a timeout of 10ms to remove the {@link #pressedCls} on the release event.
     * We don't want this to happen, so lets return `false` and cancel the event.
     * @private
     */
    onButtonRelease: function(button) {
        if (!this.getAllowToggle()) {
            return;
        }
        var me             = this,
            pressedButtons = me.getPressedButtons() || [],
            buttons        = [],
            alreadyPressed;

        if (!me.getDisabled() && !button.getDisabled()) {
            //if we allow for multiple pressed buttons, use the existing pressed buttons
            if (me.getAllowMultiple()) {
                buttons = pressedButtons.concat(buttons);
            }

            alreadyPressed = (buttons.indexOf(button) !== -1) || (pressedButtons.indexOf(button) !== -1);

            //if we allow for depressing buttons, and the new pressed button is currently pressed, remove it
            if (alreadyPressed && me.getAllowDepress()) {
                Ext.Array.remove(buttons, button);
            } else if (!alreadyPressed || !me.getAllowDepress()) {
                buttons.push(button);
            }

            me.setPressedButtons(buttons);
        }
    },

    onItemAdd: function() {
        this.callParent(arguments);
        this.updateFirstAndLastCls(this.getItems());
    },

    onItemRemove: function() {
        this.callParent(arguments);
        this.updateFirstAndLastCls(this.getItems());
    },

    // @private
    onButtonHiddenChange: function() {
        this.updateFirstAndLastCls(this.getItems());
    },

    // @private
    updateFirstAndLastCls: function(items) {
        var ln = items.length,
            basePrefix = Ext.baseCSSPrefix,
            firstCls = basePrefix + 'first',
            lastCls = basePrefix + 'last',
            item, i;

        //remove all existing classes
        for (i = 0; i < ln; i++) {
            item = items.items[i];
            item.removeCls(firstCls);
            item.removeCls(lastCls);
        }

        //add a first cls to the first non-hidden button
        for (i = 0; i < ln; i++) {
            item = items.items[i];
            if (!item.isHidden()) {
                item.addCls(firstCls);
                break;
            }
        }

        //add a last cls to the last non-hidden button
        for (i = ln - 1; i >= 0; i--) {
            item = items.items[i];
            if (!item.isHidden()) {
                item.addCls(lastCls);
                break;
            }
        }
    },

    /**
     * @private
     */
    applyPressedButtons: function(newButtons) {
        var me    = this,
            array = [],
            button, ln, i;

        if (me.getAllowToggle()) {
            if (Ext.isArray(newButtons)) {
                ln = newButtons.length;
                for (i = 0; i< ln; i++) {
                    button = me.getComponent(newButtons[i]);
                    if (button && array.indexOf(button) === -1) {
                        array.push(button);
                    }
                }
            } else {
                button = me.getComponent(newButtons);
                if (button && array.indexOf(button) === -1) {
                    array.push(button);
                }
            }
        }

        return array;
    },

    /**
     * Updates the pressed buttons.
     * @private
     */
    updatePressedButtons: function(newButtons, oldButtons) {
        var me    = this,
            items = me.getItems(),
            pressedCls = me.getPressedCls(),
            events = [],
            item, button, ln, i, e;

        //loop through existing items and remove the pressed cls from them
        ln = items.length;
        if (oldButtons && oldButtons.length) {
            for (i = 0; i < ln; i++) {
                item = items.items[i];

                if (oldButtons.indexOf(item) != -1 && newButtons.indexOf(item) == -1) {
                    item.removeCls([pressedCls, item.getPressedCls()]);
                    events.push({
                        item: item,
                        toggle: false
                    });
                }
            }
        }

        //loop through the new pressed buttons and add the pressed cls to them
        ln = newButtons.length;
        for (i = 0; i < ln; i++) {
            button = newButtons[i];
            if (!oldButtons || oldButtons.indexOf(button) == -1) {
                button.addCls(pressedCls);
                events.push({
                    item: button,
                    toggle: true
                });
            }
        }

        //loop through each of the events and fire them after a delay
        ln = events.length;
        if (ln && oldButtons !== undefined) {
            Ext.defer(function() {
                for (i = 0; i < ln; i++) {
                    e = events[i];
                    me.fireEvent('toggle', me, e.item, e.toggle);
                }
            }, 50);
        }
    },

    /**
     * Returns `true` if a specified {@link Ext.Button} is pressed.
     * @param {Ext.Button} button The button to check if pressed.
     * @return {Boolean} pressed
     */
    isPressed: function(button) {
        var pressedButtons = this.getPressedButtons();
        return pressedButtons.indexOf(button) != -1;
    },

    /**
     * @private
     */
    doSetDisabled: function(disabled) {
        var me = this;

        me.items.each(function(item) {
            item.setDisabled(disabled);
        }, me);

        me.callParent(arguments);
    }
}, function() {
    //<deprecated product=touch since=2.0>
    var me = this;

    /**
     * Activates a button.
     * @param {Number/String/Ext.Button} button The button to activate.
     * @param {Boolean} pressed If defined, sets the pressed state of the button,
     * otherwise the pressed state is toggled.
     * @param {Boolean} suppressEvents `true` to suppress toggle events during the action.
     * If {@link #allowMultiple} is `true`, then {@link #setPressed} will toggle the button state.
     * @method setPressed
     * @deprecated 2.0.0 Please use {@link #setPressedButtons} instead
     */
    Ext.deprecateClassMethod(me, 'setPressed', 'setPressedButtons');

    /**
     * Gets the currently pressed button(s).
     * @method getPressed
     * @deprecated 2.0.0 Please use {@link #getPressedButtons} instead
     */
    Ext.deprecateClassMethod(me, 'getPressed', 'getPressedButtons');

    //</deprecated>
});
