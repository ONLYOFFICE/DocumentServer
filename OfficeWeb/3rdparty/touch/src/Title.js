/**
 * {@link Ext.Title} is used for the {@link Ext.Toolbar#title} configuration in the {@link Ext.Toolbar} component.
 * @private
 */
Ext.define('Ext.Title', {
    extend: 'Ext.Component',
    xtype: 'title',

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        baseCls: 'x-title',

        /**
         * @cfg {String} title The title text
         */
        title: ''
    },

    // @private
    updateTitle: function(newTitle) {
        this.setHtml(newTitle);
    }
});
