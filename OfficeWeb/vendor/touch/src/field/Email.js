/**
 * @aside guide forms
 *
 * The Email field creates an HTML5 email input and is usually created inside a form. Because it creates an HTML email
 * input field, most browsers will show a specialized virtual keyboard for email address input. Aside from that, the
 * email field is just a normal text field. Here's an example of how to use it in a form:
 *
 *     @example
 *     Ext.create('Ext.form.Panel', {
 *         fullscreen: true,
 *         items: [
 *             {
 *                 xtype: 'fieldset',
 *                 title: 'Register',
 *                 items: [
 *                     {
 *                         xtype: 'emailfield',
 *                         label: 'Email',
 *                         name: 'email'
 *                     },
 *                     {
 *                         xtype: 'passwordfield',
 *                         label: 'Password',
 *                         name: 'password'
 *                     }
 *                 ]
 *             }
 *         ]
 *     });
 *
 * Or on its own, outside of a form:
 *
 *     Ext.create('Ext.field.Email', {
 *         label: 'Email address',
 *         value: 'prefilled@email.com'
 *     });
 *
 * Because email field inherits from {@link Ext.field.Text textfield} it gains all of the functionality that text fields
 * provide, including getting and setting the value at runtime, validations and various events that are fired as the
 * user interacts with the component. Check out the {@link Ext.field.Text} docs to see the additional functionality
 * available.
 */
Ext.define('Ext.field.Email', {
    extend: 'Ext.field.Text',
    alternateClassName: 'Ext.form.Email',
    xtype: 'emailfield',

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        component: {
	        type: 'email'
	    },

        /**
         * @cfg
         * @inheritdoc
         */
        autoCapitalize: false
    }
});





