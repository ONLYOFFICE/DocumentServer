/**
 *
 */
Ext.define('Ext.layout.Float', {
    extend: 'Ext.layout.Default',

    alias: 'layout.float',

    config: {
        direction: 'left'
    },

    layoutClass: 'layout-float',

    itemClass: 'layout-float-item',

    setContainer: function(container) {
        this.callSuper(arguments);

        container.innerElement.addCls(this.layoutClass);
    },

    onItemInnerStateChange: function(item, isInner) {
        this.callSuper(arguments);
        item.toggleCls(this.itemClass, isInner);
    },

    updateDirection: function(direction, oldDirection) {
        var prefix = 'direction-';

        this.container.innerElement.swapCls(prefix + direction, prefix + oldDirection);
    }
});
