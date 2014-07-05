/**
 * @aside guide forms
 * @aside example forms
 * @aside example forms-toolbars
 *
 * A FieldSet is a great way to visually separate elements of a form. It's normally used when you have a form with
 * fields that can be divided into groups - for example a customer's billing details in one fieldset and their shipping
 * address in another. A fieldset can be used inside a form or on its own elsewhere in your app. Fieldsets can
 * optionally have a title at the top and instructions at the bottom. Here's how we might create a FieldSet inside a
 * form:
 *
 *     @example
 *     Ext.create('Ext.form.Panel', {
 *         fullscreen: true,
 *         items: [
 *             {
 *                 xtype: 'fieldset',
 *                 title: 'About You',
 *                 instructions: 'Tell us all about yourself',
 *                 items: [
 *                     {
 *                         xtype: 'textfield',
 *                         name : 'firstName',
 *                         label: 'First Name'
 *                     },
 *                     {
 *                         xtype: 'textfield',
 *                         name : 'lastName',
 *                         label: 'Last Name'
 *                     }
 *                 ]
 *             }
 *         ]
 *     });
 *
 * Above we created a {@link Ext.form.Panel form} with a fieldset that contains two text fields. In this case, all
 * of the form fields are in the same fieldset, but for longer forms we may choose to use multiple fieldsets. We also
 * configured a {@link #title} and {@link #instructions} to give the user more information on filling out the form if
 * required.
 */
Ext.define('Ext.form.FieldSet', {
    extend  : 'Ext.Container',
    alias   : 'widget.fieldset',
    requires: ['Ext.Title'],

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        baseCls: Ext.baseCSSPrefix + 'form-fieldset',

        /**
         * @cfg {String} title
         * Optional fieldset title, rendered just above the grouped fields.
         *
         * ## Example
         *
         *     Ext.create('Ext.form.Fieldset', {
         *         fullscreen: true,
         *
         *         title: 'Login',
         *
         *         items: [{
         *             xtype: 'textfield',
         *             label: 'Email'
         *         }]
         *     });
         * 
         * @accessor
         */
        title: null,

        /**
         * @cfg {String} instructions
         * Optional fieldset instructions, rendered just below the grouped fields.
         *
         * ## Example
         *
         *     Ext.create('Ext.form.Fieldset', {
         *         fullscreen: true,
         *
         *         instructions: 'Please enter your email address.',
         *
         *         items: [{
         *             xtype: 'textfield',
         *             label: 'Email'
         *         }]
         *     });
         * 
         * @accessor
         */
        instructions: null
    },

    // @private
    applyTitle: function(title) {
        if (typeof title == 'string') {
            title = {title: title};
        }

        Ext.applyIf(title, {
            docked : 'top',
            baseCls: this.getBaseCls() + '-title'
        });

        return Ext.factory(title, Ext.Title, this._title);
    },

    // @private
    updateTitle: function(newTitle, oldTitle) {
        if (newTitle) {
            this.add(newTitle);
        }
        if (oldTitle) {
            this.remove(oldTitle);
        }
    },

    // @private
    getTitle: function() {
        var title = this._title;

        if (title && title instanceof Ext.Title) {
            return title.getTitle();
        }

        return title;
    },

    // @private
    applyInstructions: function(instructions) {
        if (typeof instructions == 'string') {
            instructions = {title: instructions};
        }

        Ext.applyIf(instructions, {
            docked : 'bottom',
            baseCls: this.getBaseCls() + '-instructions'
        });

        return Ext.factory(instructions, Ext.Title, this._instructions);
    },

    // @private
    updateInstructions: function(newInstructions, oldInstructions) {
        if (newInstructions) {
            this.add(newInstructions);
        }
        if (oldInstructions) {
            this.remove(oldInstructions);
        }
    },

    // @private
    getInstructions: function() {
        var instructions = this._instructions;

        if (instructions && instructions instanceof Ext.Title) {
            return instructions.getTitle();
        }

        return instructions;
    },

    /**
     * A convenient method to disable all fields in this FieldSet
     * @return {Ext.form.FieldSet} This FieldSet
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
    }
});
