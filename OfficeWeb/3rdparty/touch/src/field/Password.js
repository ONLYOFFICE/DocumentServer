/**
 * @aside guide forms
 *
 * The Password field creates a password input and is usually created inside a form. Because it creates a password
 * field, when the user enters text it will show up as stars. Aside from that, the password field is just a normal text
 * field. Here's an example of how to use it in a form:
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
 *     Ext.create('Ext.field.Password', {
 *         label: 'Password',
 *         value: 'existingPassword'
 *     });
 *
 * Because the password field inherits from {@link Ext.field.Text textfield} it gains all of the functionality that text
 * fields provide, including getting and setting the value at runtime, validations and various events that are fired as
 * the user interacts with the component. Check out the {@link Ext.field.Text} docs to see the additional functionality
 * available.
 */
Ext.define('Ext.field.Password', {
    extend: 'Ext.field.Text',
    xtype: 'passwordfield',
    alternateClassName: 'Ext.form.Password',

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
	        type: 'password'
	    }
    }
});
