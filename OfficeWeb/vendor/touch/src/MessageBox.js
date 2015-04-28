/**
 * Utility class for generating different styles of message boxes. The framework provides a global singleton
 * {@link Ext.Msg} for common usage which you should use in most cases.
 *
 * If you want to use {@link Ext.MessageBox} directly, just think of it as a modal {@link Ext.Container}.
 *
 * Note that the MessageBox is asynchronous. Unlike a regular JavaScript `alert` (which will halt browser execution),
 * showing a MessageBox will not cause the code to stop. For this reason, if you have code that should only run _after_
 * some user feedback from the MessageBox, you must use a callback function (see the `fn` configuration option parameter
 * for the {@link #method-show show} method for more details).
 *
 *     @example preview
 *     Ext.Msg.alert('Title', 'The quick brown fox jumped over the lazy dog.', Ext.emptyFn);
 *
 * Checkout {@link Ext.Msg} for more examples.
 *
 */
Ext.define('Ext.MessageBox', {
    extend  : 'Ext.Sheet',
    requires: [
        'Ext.Toolbar',
        'Ext.field.Text',
        'Ext.field.TextArea'
    ],

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        ui: 'dark',

        /**
         * @cfg
         * @inheritdoc
         */
        baseCls: Ext.baseCSSPrefix + 'msgbox',

        /**
         * @cfg {String} iconCls
         * CSS class for the icon. The icon should be 40px x 40px.
         * @accessor
         */
        iconCls: null,

        /**
         * @cfg
         * @inheritdoc
         */
        showAnimation: {
            type: 'popIn',
            duration: 250,
            easing: 'ease-out'
        },

        /**
         * @cfg
         * @inheritdoc
         */
        hideAnimation: {
            type: 'popOut',
            duration: 250,
            easing: 'ease-out'
        },

        /**
         * Override the default `zIndex` so it is normally always above floating components.
         */
        zIndex: 999,

        /**
         * @cfg {Number} defaultTextHeight
         * The default height in pixels of the message box's multiline textarea if displayed.
         * @accessor
         */
        defaultTextHeight: 75,

        /**
         * @cfg {String} title
         * The title of this {@link Ext.MessageBox}.
         * @accessor
         */
        title: null,

        /**
         * @cfg {Array/Object} buttons
         * An array of buttons, or an object of a button to be displayed in the toolbar of this {@link Ext.MessageBox}.
         */
        buttons: null,

        /**
         * @cfg {String} message
         * The message to be displayed in the {@link Ext.MessageBox}.
         * @accessor
         */
        message: null,

        /**
         * @cfg {String} msg
         * The message to be displayed in the {@link Ext.MessageBox}.
         * @removed 2.0.0 Please use {@link #message} instead.
         */

        /**
         * @cfg {Object} prompt
         * The configuration to be passed if you want an {@link Ext.field.Text} or {@link Ext.field.TextArea} field
         * in your {@link Ext.MessageBox}.
         *
         * Pass an object with the property `multiLine` with a value of `true`, if you want the prompt to use a TextArea.
         *
         * Alternatively, you can just pass in an object which has an xtype/xclass of another component.
         *
         *     prompt: {
         *         xtype: 'textareafield',
         *         value: 'test'
         *     }
         *
         * @accessor
         */
        prompt: null,

        /**
         * @private
         */
        modal: true,

        /**
         * @cfg
         * @inheritdoc
         */
        layout: {
            type: 'vbox',
            pack: 'center'
        }
    },

    statics: {
        OK    : {text: 'OK',     itemId: 'ok',  ui: 'action'},
        YES   : {text: 'Yes',    itemId: 'yes', ui: 'action'},
        NO    : {text: 'No',     itemId: 'no'},
        CANCEL: {text: 'Cancel', itemId: 'cancel'},

        INFO    : Ext.baseCSSPrefix + 'msgbox-info',
        WARNING : Ext.baseCSSPrefix + 'msgbox-warning',
        QUESTION: Ext.baseCSSPrefix + 'msgbox-question',
        ERROR   : Ext.baseCSSPrefix + 'msgbox-error',

        OKCANCEL: [
            {text: 'Cancel', itemId: 'cancel'},
            {text: 'OK',     itemId: 'ok',  ui : 'action'}
        ],
        YESNOCANCEL: [
            {text: 'Cancel', itemId: 'cancel'},
            {text: 'No',     itemId: 'no'},
            {text: 'Yes',    itemId: 'yes', ui: 'action'}
        ],
        YESNO: [
            {text: 'No',  itemId: 'no'},
            {text: 'Yes', itemId: 'yes', ui: 'action'}
        ]
    },

    constructor: function(config) {
        config = config || {};

        if (config.hasOwnProperty('promptConfig')) {
            //<debug warn>
            Ext.Logger.deprecate("'promptConfig' config is deprecated, please use 'prompt' config instead", this);
            //</debug>

            Ext.applyIf(config, {
                prompt: config.promptConfig
            });

            delete config.promptConfig;
        }

        if (config.hasOwnProperty('multiline') || config.hasOwnProperty('multiLine')) {
            config.prompt = config.prompt || {};
            Ext.applyIf(config.prompt, {
                multiLine: config.multiline || config.multiLine
            });

            delete config.multiline;
            delete config.multiLine;
        }

        this.defaultAllowedConfig = {};
        var allowedConfigs = ['ui', 'showAnimation', 'hideAnimation', 'title', 'message', 'prompt', 'iconCls', 'buttons', 'defaultTextHeight'],
            ln = allowedConfigs.length,
            i, allowedConfig;

        for (i = 0; i < ln; i++) {
            allowedConfig = allowedConfigs[i];
            this.defaultAllowedConfig[allowedConfig] = this.defaultConfig[allowedConfig];
        }

        this.callParent([config]);
    },

    /**
     * Creates a new {@link Ext.Toolbar} instance using {@link Ext#factory}.
     * @private
     */
    applyTitle: function(config) {
        if (typeof config == "string") {
            config = {
                title: config
            };
        }

        Ext.applyIf(config, {
            docked: 'top',
            minHeight: '1.3em',
            cls   : this.getBaseCls() + '-title'
        });

        return Ext.factory(config, Ext.Toolbar, this.getTitle());
    },

    /**
     * Adds the new {@link Ext.Toolbar} instance into this container.
     * @private
     */
    updateTitle: function(newTitle) {
        if (newTitle) {
            this.add(newTitle);
        }
    },

    /**
     * Adds the new {@link Ext.Toolbar} instance into this container.
     * @private
     */
    updateButtons: function(newButtons) {
        var me = this;

        if (newButtons) {
            if (me.buttonsToolbar) {
                me.buttonsToolbar.removeAll();
                me.buttonsToolbar.setItems(newButtons);
            } else {
                me.buttonsToolbar = Ext.create('Ext.Toolbar', {
                    docked     : 'bottom',
                    defaultType: 'button',
                    layout     : {
                        type: 'hbox',
                        pack: 'center'
                    },
                    ui         : me.getUi(),
                    cls        : me.getBaseCls() + '-buttons',
                    items      : newButtons
                });

                me.add(me.buttonsToolbar);
            }
        }
    },

    /**
     * @private
     */
    applyMessage: function(config) {
        config = {
            html : config,
            cls  : this.getBaseCls() + '-text'
        };

        return Ext.factory(config, Ext.Component, this._message);
    },

    /**
     * @private
     */
    updateMessage: function(newMessage) {
        if (newMessage) {
            this.add(newMessage);
        }
    },

    getMessage: function() {
        if (this._message) {
            return this._message.getHtml();
        }

        return null;
    },

    /**
     * @private
     */
    applyIconCls: function(config) {
        config = {
            xtype : 'component',
            docked: 'left',
            width : 40,
            height: 40,
            baseCls: Ext.baseCSSPrefix + 'icon',
            hidden: (config) ? false : true,
            cls: config
        };

        return Ext.factory(config, Ext.Component, this._iconCls);
    },

    /**
     * @private
     */
    updateIconCls: function(newIconCls, oldIconCls) {
        var me = this;

        //ensure the title and button elements are added first
        this.getTitle();
        this.getButtons();

        if (newIconCls) {
            this.add(newIconCls);
        } else {
            this.remove(oldIconCls);
        }
    },

    getIconCls: function() {
        var icon = this._iconCls,
            iconCls;

        if (icon) {
            iconCls = icon.getCls();
            return (iconCls) ? iconCls[0] : null;
        }

        return null;
    },

    /**
     * @private
     */
    applyPrompt: function(prompt) {
        if (prompt) {
            var config = {
                label: false
            };

            if (Ext.isObject(prompt)) {
                Ext.apply(config, prompt);
            }

            if (config.multiLine) {
                config.height = Ext.isNumber(config.multiLine) ? parseFloat(config.multiLine) : this.getDefaultTextHeight();
                return Ext.factory(config, Ext.field.TextArea, this.getPrompt());
            } else {
                return Ext.factory(config, Ext.field.Text, this.getPrompt());
            }
        }

        return prompt;
    },

    /**
     * @private
     */
    updatePrompt: function(newPrompt, oldPrompt) {
        if (newPrompt) {
            this.add(newPrompt);
        }

        if (oldPrompt) {
            this.remove(oldPrompt);
        }
    },

    // @private
    // pass `fn` config to show method instead
    onClick: function(button) {
        if (button) {
            var config = button.config.userConfig || {},
                initialConfig = button.getInitialConfig(),
                prompt = this.getPrompt();

            if (typeof config.fn == 'function') {
                this.on({
                    hiddenchange: function() {
                        config.fn.call(
                            config.scope || null,
                            initialConfig.itemId || initialConfig.text,
                            prompt ? prompt.getValue() : null,
                            config
                        );
                    },
                    single: true,
                    scope: this
                });
            }

            if (config.input) {
                config.input.dom.blur();
            }
        }

        this.hide();
    },

    /**
     * Displays the {@link Ext.MessageBox} with a specified configuration. All
     * display functions (e.g. {@link #method-prompt}, {@link #alert}, {@link #confirm})
     * on MessageBox call this function internally, although those calls
     * are basic shortcuts and do not support all of the config options allowed here.
     *
     * Example usage:
     *
     *     @example
     *     Ext.Msg.show({
     *        title: 'Address',
     *        message: 'Please enter your address:',
     *        width: 300,
     *        buttons: Ext.MessageBox.OKCANCEL,
     *        multiLine: true,
     *        prompt : { maxlength : 180, autocapitalize : true },
     *        fn: function(buttonId) {
     *            alert('You pressed the "' + buttonId + '" button.');
     *        }
     *     });
     *
     * @param {Object} config An object with the following config options:
     *
     * @param {Object/Array} [config.buttons=false]
     * A button config object or Array of the same(e.g., `Ext.MessageBox.OKCANCEL` or `{text:'Foo', itemId:'cancel'}`),
     * or false to not show any buttons.
     *
     * @param {String} config.cls
     * A custom CSS class to apply to the message box's container element.
     *
     * @param {Function} config.fn
     * A callback function which is called when the dialog is dismissed by clicking on the configured buttons.
     *
     * @param {String} config.fn.buttonId The `itemId` of the button pressed, one of: 'ok', 'yes', 'no', 'cancel'.
     * @param {String} config.fn.value Value of the input field if either `prompt` or `multiline` option is `true`.
     * @param {Object} config.fn.opt The config object passed to show.
     *
     * @param {Number} [config.width=auto]
     * A fixed width for the MessageBox.
     *
     * @param {Number} [config.height=auto]
     * A fixed height for the MessageBox.
     *
     * @param {Object} config.scope
     * The scope of the callback function
     *
     * @param {String} config.icon
     * A CSS class that provides a background image to be used as the body icon for the dialog
     * (e.g. Ext.MessageBox.WARNING or 'custom-class').
     *
     * @param {Boolean} [config.modal=true]
     * `false` to allow user interaction with the page while the message box is displayed.
     *
     * @param {String} [config.message=&#160;]
     * A string that will replace the existing message box body text.
     * Defaults to the XHTML-compliant non-breaking space character `&#160;`.
     *
     * @param {Number} [config.defaultTextHeight=75]
     * The default height in pixels of the message box's multiline textarea if displayed.
     *
     * @param {Boolean} [config.prompt=false]
     * `true` to prompt the user to enter single-line text. Please view the {@link Ext.MessageBox#method-prompt} documentation in {@link Ext.MessageBox}.
     * for more information.
     *
     * @param {Boolean} [config.multiline=false]
     * `true` to prompt the user to enter multi-line text.
     *
     * @param {String} config.title
     * The title text.
     *
     * @param {String} config.value
     * The string value to set into the active textbox element if displayed.
     *
     * @return {Ext.MessageBox} this
     */
    show: function(initialConfig) {
        //if it has not been added to a container, add it to the Viewport.
        if (!this.getParent() && Ext.Viewport) {
            Ext.Viewport.add(this);
        }

        if (!initialConfig) {
            return this.callParent();
        }

        var config = Ext.Object.merge({}, {
            value: ''
        }, initialConfig);

        var buttons        = initialConfig.buttons || Ext.MessageBox.OK || [],
            buttonBarItems = [],
            userConfig     = initialConfig;

        Ext.each(buttons, function(buttonConfig) {
            if (!buttonConfig) {
                return;
            }

            buttonBarItems.push(Ext.apply({
                userConfig: userConfig,
                scope     : this,
                handler   : 'onClick'
            }, buttonConfig));
        }, this);

        config.buttons = buttonBarItems;

        if (config.promptConfig) {
            //<debug warn>
            Ext.Logger.deprecate("'promptConfig' config is deprecated, please use 'prompt' config instead", this);
            //</debug>
        }
        config.prompt = (config.promptConfig || config.prompt) || null;

        if (config.multiLine) {
            config.prompt = config.prompt || {};
            config.prompt.multiLine = config.multiLine;
            delete config.multiLine;
        }

        config = Ext.merge({}, this.defaultAllowedConfig, config);

        this.setConfig(config);

        var prompt = this.getPrompt();
        if (prompt) {
            prompt.setValue(initialConfig.value || '');
        }

        this.callParent();

        return this;
    },

    /**
     * Displays a standard read-only message box with an OK button (comparable to the basic JavaScript alert prompt). If
     * a callback function is passed it will be called after the user clicks the button, and the `itemId` of the button
     * that was clicked will be passed as the only parameter to the callback.
     *
     * @param {String} title The title bar text.
     * @param {String} message The message box body text.
     * @param {Function} fn A callback function which is called when the dialog is dismissed by clicking on the configured buttons.
     * @param {String} fn.buttonId The `itemId` of the button pressed, one of: 'ok', 'yes', 'no', 'cancel'.
     * @param {String} fn.value Value of the input field if either `prompt` or `multiLine` option is `true`.
     * @param {Object} fn.opt The config object passed to show.
     * @param {Object} scope The scope (`this` reference) in which the callback is executed.
     * Defaults to: the browser window
     *
     * @return {Ext.MessageBox} this
     */
    alert: function(title, message, fn, scope) {
        return this.show({
            title: title || null,
            message: message || null,
            buttons: Ext.MessageBox.OK,
            promptConfig: false,
            fn: function() {
                if (fn) {
                    fn.apply(scope, arguments);
                }
            },
            scope: scope
        });
    },

    /**
     * Displays a confirmation message box with Yes and No buttons (comparable to JavaScript's confirm). If a callback
     * function is passed it will be called after the user clicks either button, and the id of the button that was
     * clicked will be passed as the only parameter to the callback (could also be the top-right close button).
     *
     * @param {String} title The title bar text.
     * @param {String} message The message box body text.
     * @param {Function} fn A callback function which is called when the dialog is dismissed by clicking on the configured buttons.
     * @param {String} fn.buttonId The `itemId` of the button pressed, one of: 'ok', 'yes', 'no', 'cancel'.
     * @param {String} fn.value Value of the input field if either `prompt` or `multiLine` option is `true`.
     * @param {Object} fn.opt The config object passed to show.
     * @param {Object} [scope] The scope (`this` reference) in which the callback is executed.
     *
     * Defaults to: the browser window
     *
     * @return {Ext.MessageBox} this
     */
    confirm: function(title, message, fn, scope) {
        return this.show({
            title       : title || null,
            message     : message || null,
            buttons     : Ext.MessageBox.YESNO,
            promptConfig: false,
            scope       : scope,
            fn: function() {
                if (fn) {
                    fn.apply(scope, arguments);
                }
            }
        });
    },

    /**
     * Displays a message box with OK and Cancel buttons prompting the user to enter some text (comparable to
     * JavaScript's prompt). The prompt can be a single-line or multi-line textbox. If a callback function is passed it
     * will be called after the user clicks either button, and the id of the button that was clicked (could also be the
     * top-right close button) and the text that was entered will be passed as the two parameters to the callback.
     *
     * Example usage:
     *
     *     @example
     *     Ext.Msg.prompt(
     *         'Welcome!',
     *         'What\'s your name going to be today?',
     *         function (buttonId, value) {
     *             console.log(value);
     *         },
     *         null,
     *         false,
     *         null,
     *         {
     *             autoCapitalize: true,
     *             placeHolder: 'First-name please...'
     *         }
     *     );
     *
     * @param {String} title The title bar text.
     * @param {String} message The message box body text.
     * @param {Function} fn A callback function which is called when the dialog is dismissed by clicking on the configured buttons.
     * @param {String} fn.buttonId The `itemId` of the button pressed, one of: 'ok', 'yes', 'no', 'cancel'.
     * @param {String} fn.value Value of the input field if either `prompt` or `multiLine` option is `true`.
     * @param {Object} fn.opt The config object passed to show.
     * @param {Object} scope The scope (`this` reference) in which the callback is executed.
     *
     * Defaults to: the browser window.
     *
     * @param {Boolean/Number} [multiLine=false] `true` to create a multiline textbox using the `defaultTextHeight` property,
     * or the height in pixels to create the textbox.
     *
     * @param {String} [value] Default value of the text input element.
     *
     * @param {Object} [prompt=true]
     * The configuration for the prompt. See the {@link Ext.MessageBox#cfg-prompt prompt} documentation in {@link Ext.MessageBox}
     * for more information.
     *
     * @return {Ext.MessageBox} this
     */
    prompt: function(title, message, fn, scope, multiLine, value, prompt) {
        return this.show({
            title    : title || null,
            message  : message || null,
            buttons  : Ext.MessageBox.OKCANCEL,
            scope    : scope,
            prompt   : prompt || true,
            multiLine: multiLine,
            value    : value,
            fn: function() {
                if (fn) {
                    fn.apply(scope, arguments);
                }
            }
        });
    }
}, function(MessageBox) {
    // <deprecated product=touch since=2.0>
    this.override({
        /**
         * @cfg {String} icon
         * Sets CSS class for icon.
         * @removed 2.0 Use #iconCls instead.
         */

        /**
         * Sets #icon.
         * @deprecated 2.0 Please use #setIconCls instead.
         * @param {String} icon A CSS class name or empty string to clear the icon.
         * @return {Ext.MessageBox} this
         */
        setIcon: function(iconCls, doLayout){
            //<debug warn>
            Ext.Logger.deprecate("Ext.MessageBox#setIcon is deprecated, use setIconCls instead", 2);
            //</debug>
            this.setIconCls(iconCls);

            return this;
        },

        /**
         * @inheritdoc Ext.MessageBox#setMessage
         * @deprecated 2.0.0 Please use #setMessage instead.
         */
        updateText: function(text){
            //<debug warn>
            Ext.Logger.deprecate("Ext.MessageBox#updateText is deprecated, use setMessage instead", 2);
            //</debug>
            this.setMessage(text);

            return this;
        }
    });
    // </deprecated>

    Ext.onSetup(function() {
        /**
         * @class Ext.Msg
         * @extends Ext.MessageBox
         * @singleton
         *
         * A global shared singleton instance of the {@link Ext.MessageBox} class.
         *
         * Allows for simple creation of various different alerts and notifications.
         *
         * To change any configurations on this singleton instance, you must change the
         * `defaultAllowedConfig` object.  For example to remove all animations on `Msg`:
         *
         *     Ext.Msg.defaultAllowedConfig.showAnimation = false;
         *     Ext.Msg.defaultAllowedConfig.hideAnimation = false;
         *
         * ## Examples
         *
         * ### Alert
         * Use the {@link #alert} method to show a basic alert:
         *
         *     @example preview
         *     Ext.Msg.alert('Title', 'The quick brown fox jumped over the lazy dog.', Ext.emptyFn);
         *
         * ### Prompt
         * Use the {@link #method-prompt} method to show an alert which has a textfield:
         *
         *     @example preview
         *     Ext.Msg.prompt('Name', 'Please enter your name:', function(text) {
         *         // process text value and close...
         *     });
         *
         * ### Confirm
         * Use the {@link #confirm} method to show a confirmation alert (shows yes and no buttons).
         *
         *     @example preview
         *     Ext.Msg.confirm("Confirmation", "Are you sure you want to do that?", Ext.emptyFn);
         */
        Ext.Msg = new MessageBox;
    });
});

