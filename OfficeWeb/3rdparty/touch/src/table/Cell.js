Ext.define('Ext.table.Cell', {
    extend: 'Ext.Container',

    xtype: 'tablecell',

    config: {
        baseCls: 'x-table-cell'
    },

    getElementConfig: function() {
        var config = this.callParent();

        config.children.length = 0;

        return config;
    }
});
