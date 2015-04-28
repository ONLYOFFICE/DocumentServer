/**
 * @aside guide forms
 *
 * The Search field creates an HTML5 search input and is usually created inside a form. Because it creates an HTML
 * search input type, the visual styling of this input is slightly different to normal text input controls (the corners
 * are rounded), though the virtual keyboard displayed by the operating system is the standard keyboard control.
 *
 * As with all other form fields in Sencha Touch, the search field gains a "clear" button that appears whenever there
 * is text entered into the form, and which removes that text when tapped.
 *
 *     @example
 *     Ext.create('Ext.form.Panel', {
 *         fullscreen: true,
 *         items: [
 *             {
 *                 xtype: 'fieldset',
 *                 title: 'Search',
 *                 items: [
 *                     {
 *                         xtype: 'searchfield',
 *                         label: 'Query',
 *                         name: 'query'
 *                     }
 *                 ]
 *             }
 *         ]
 *     });
 *
 * Or on its own, outside of a form:
 *
 *     Ext.create('Ext.field.Search', {
 *         label: 'Search:',
 *         value: 'query'
 *     });
 *
 * Because search field inherits from {@link Ext.field.Text textfield} it gains all of the functionality that text
 * fields provide, including getting and setting the value at runtime, validations and various events that are fired
 * as the user interacts with the component. Check out the {@link Ext.field.Text} docs to see the additional
 * functionality available.
 */
Ext.define('Ext.field.Search', {
    extend: 'Ext.field.Text',
    xtype: 'searchfield',
    alternateClassName: 'Ext.form.Search',

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        component: {
	        type: 'search'
	    },

        /**
         * @cfg
         * @inheritdoc
         */
	    ui: 'search'
    }
});
