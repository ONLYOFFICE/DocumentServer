/**
 *
 */
Ext.define('Ext.layout.Fit', {
    extend: 'Ext.layout.Default',

    isFit: true,

    alias: 'layout.fit',

    layoutClass: 'x-layout-fit',

    itemClass: 'x-layout-fit-item',

    setContainer: function(container) {
        this.callSuper(arguments);

        container.innerElement.addCls(this.layoutClass);
        this.onContainerSizeFlagsChange();
        this.monitorSizeFlagsChange();
    },

    onContainerSizeFlagsChange: function() {
        var container = this.container,
            sizeFlags = container.getSizeFlags(),
            stretched = Boolean(sizeFlags & container.LAYOUT_STRETCHED),
            innerItems = container.innerItems,
            i, ln, item;

        this.callSuper();

        for (i = 0,ln = innerItems.length; i < ln; i++) {
            item = innerItems[i];
            item.setLayoutSizeFlags(sizeFlags);
        }

        container.innerElement.toggleCls('x-stretched', stretched);
    },

    onItemInnerStateChange: function(item, isInner) {
        this.callSuper(arguments);
        item.toggleCls(this.itemClass, isInner);
        item.setLayoutSizeFlags(isInner ? this.container.getSizeFlags() : 0);
    }
});
