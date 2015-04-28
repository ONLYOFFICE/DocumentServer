/**
 * A simple label component which allows you to insert content using {@link #html} configuration.
 *
 *     @example miniphone
 *     Ext.Viewport.add({
 *         xtype: 'label',
 *         html: 'My label!'
 *     });
 */
Ext.define('Ext.Label', {
    extend: 'Ext.Component',
    xtype: 'label',

    config: {
        baseCls: Ext.baseCSSPrefix + 'label'

        /**
         * @cfg {String} html
         * The label of this component.
         */
    }
});
