/**
 *
 */
Ext.define('Ext.layout.Box', {
    extend: 'Ext.layout.Default',

    config: {
        orient: 'horizontal',

        align: 'start',

        pack: 'start'
    },

    alias: 'layout.tablebox',

    layoutBaseClass: 'x-layout-tablebox',

    itemClass: 'x-layout-tablebox-item',

    setContainer: function(container) {
        this.callSuper(arguments);

        container.innerElement.addCls(this.layoutBaseClass);

        container.on('flexchange', 'onItemFlexChange', this, {
            delegate: '> component'
        });
    },

    onItemInnerStateChange: function(item, isInner) {
        this.callSuper(arguments);

        item.toggleCls(this.itemClass, isInner);
    },

    onItemFlexChange: function() {

    }
});
