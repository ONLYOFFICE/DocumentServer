Ext.define('Ext.table.Table', {
    extend: 'Ext.Container',

    requires: ['Ext.table.Row'],

    xtype: 'table',

    config: {
        baseCls: 'x-table',
        defaultType: 'tablerow'
    },

    cachedConfig: {
        fixedLayout: false
    },

    fixedLayoutCls: 'x-table-fixed',

    updateFixedLayout: function(fixedLayout) {
        this.innerElement[fixedLayout ? 'addCls' : 'removeCls'](this.fixedLayoutCls);
    }
});
