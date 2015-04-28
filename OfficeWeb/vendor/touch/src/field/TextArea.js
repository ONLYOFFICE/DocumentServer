/**
 * @aside guide forms
 *
 * Creates an HTML textarea field on the page. This is useful whenever you need the user to enter large amounts of text
 * (i.e. more than a few words). Typically, text entry on mobile devices is not a pleasant experience for the user so
 * it's good to limit your use of text areas to only those occasions when free form text is required or alternative
 * input methods like select boxes or radio buttons are not possible. Text Areas are usually created inside forms, like
 * this:
 *
 *     @example
 *     Ext.create('Ext.form.Panel', {
 *         fullscreen: true,
 *         items: [
 *             {
 *                 xtype: 'fieldset',
 *                 title: 'About you',
 *                 items: [
 *                     {
 *                         xtype: 'textfield',
 *                         label: 'Name',
 *                         name: 'name'
 *                     },
 *                     {
 *                         xtype: 'textareafield',
 *                         label: 'Bio',
 *                         maxRows: 4,
 *                         name: 'bio'
 *                     }
 *                 ]
 *             }
 *         ]
 *     });
 *
 * In the example above we're creating a form with a {@link Ext.field.Text text field} for the user's name and a text
 * area for their bio. We used the {@link #maxRows} configuration on the text area to tell it to grow to a maximum of 4
 * rows of text before it starts using a scroll bar inside the text area to scroll the text.
 *
 * We can also create a text area outside the context of a form, like this:
 *
 * This creates two text fields inside a form. Text Fields can also be created outside of a Form, like this:
 *
 *     Ext.create('Ext.field.TextArea', {
 *         label: 'About You',
 *         {@link #placeHolder}: 'Tell us about yourself...'
 *     });
 */
Ext.define('Ext.field.TextArea', {
    extend: 'Ext.field.Text',
    xtype: 'textareafield',
    requires: ['Ext.field.TextAreaInput'],
    alternateClassName: 'Ext.form.TextArea',

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        ui: 'textarea',

        /**
         * @cfg
         * @inheritdoc
         */
        autoCapitalize: false,

        /**
         * @cfg
         * @inheritdoc
         */
        component: {
            xtype: 'textareainput'
        },

        /**
         * @cfg {Number} maxRows The maximum number of lines made visible by the input.
         * @accessor
         */
        maxRows: null
    },

    // @private
    updateMaxRows: function(newRows) {
        this.getComponent().setMaxRows(newRows);
    },

    doSetHeight: function(newHeight) {
        this.callParent(arguments);
        var component = this.getComponent();
        component.input.setHeight(newHeight);
    },

    doSetWidth: function(newWidth) {
        this.callParent(arguments);
        var component = this.getComponent();
        component.input.setWidth(newWidth);
    },

    /**
     * Called when a key has been pressed in the `<input>`
     * @private
     */
    doKeyUp: function(me) {
        // getValue to ensure that we are in sync with the dom
        var value = me.getValue();

        // show the {@link #clearIcon} if it is being used
        me[value ? 'showClearIcon' : 'hideClearIcon']();
    }
});
