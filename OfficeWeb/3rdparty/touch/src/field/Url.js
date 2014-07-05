/**
 * @aside guide forms
 *
 * The Url field creates an HTML5 url input and is usually created inside a form. Because it creates an HTML url input
 * field, most browsers will show a specialized virtual keyboard for web address input. Aside from that, the url field
 * is just a normal text field. Here's an example of how to use it in a form:
 *
 *     @example
 *     Ext.create('Ext.form.Panel', {
 *         fullscreen: true,
 *         items: [
 *             {
 *                 xtype: 'fieldset',
 *                 title: 'Add Bookmark',
 *                 items: [
 *                     {
 *                         xtype: 'urlfield',
 *                         label: 'Url',
 *                         name: 'url'
 *                     }
 *                 ]
 *             }
 *         ]
 *     });
 *
 * Or on its own, outside of a form:
 *
 *     Ext.create('Ext.field.Url', {
 *         label: 'Web address',
 *         value: 'http://sencha.com'
 *     });
 *
 * Because url field inherits from {@link Ext.field.Text textfield} it gains all of the functionality that text fields
 * provide, including getting and setting the value at runtime, validations and various events that are fired as the
 * user interacts with the component. Check out the {@link Ext.field.Text} docs to see the additional functionality
 * available.
 */
Ext.define('Ext.field.Url', {
    extend: 'Ext.field.Text',
    xtype: 'urlfield',
    alternateClassName: 'Ext.form.Url',

    config: {
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
	        type: 'url'
	    }
    }
});
