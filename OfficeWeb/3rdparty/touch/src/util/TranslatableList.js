/**
 * @private
 */
Ext.define('Ext.util.TranslatableList', {
    extend: 'Ext.util.translatable.Abstract',

    config: {
        items: []
    },

    applyItems: function(items) {
        return Ext.Array.from(items);
    },

    doTranslate: function(x, y) {
        var items = this.getItems(),
            offset = 0,
            i, ln, item, translateY;

        for (i = 0, ln = items.length; i < ln; i++) {
            item = items[i];

            if (item && !item._list_hidden) {
                translateY = y + offset;
                offset += item.$height;
                item.translate(0, translateY);
            }
        }
    }
});