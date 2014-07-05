/**
 * @private
 */
Ext.define('Ext.util.TranslatableGroup', {
    extend: 'Ext.util.translatable.Abstract',

    config: {
        items: [],

        activeIndex: 0,

        itemLength: {
            x: 0,
            y: 0
        }
    },

    applyItems: function(items) {
        return Ext.Array.from(items);
    },

    doTranslate: function(x, y) {
        var items = this.getItems(),
            activeIndex = this.getActiveIndex(),
            itemLength = this.getItemLength(),
            itemLengthX = itemLength.x,
            itemLengthY = itemLength.y,
            useX = typeof x == 'number',
            useY = typeof y == 'number',
            offset, i, ln, item, translateX, translateY;

        for (i = 0, ln = items.length; i < ln; i++) {
            item = items[i];

            if (item) {
                offset = (i - activeIndex);

                if (useX) {
                    translateX = x + offset * itemLengthX;
                }

                if (useY) {
                    translateY = y + offset * itemLengthY;
                }

                item.translate(translateX, translateY);
            }
        }
    }
});