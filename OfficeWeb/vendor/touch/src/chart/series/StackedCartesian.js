/**
 * @abstract
 * @extends Ext.chart.series.Cartesian
 * Abstract class for all the stacked cartesian series including area series
 * and bar series.
 */
Ext.define('Ext.chart.series.StackedCartesian', {

    extend: 'Ext.chart.series.Cartesian',

    config: {
        /**
         * @cfg {Boolean}
         * 'true' to display the series in its stacked configuration.
         */
        stacked: true,

        /**
         * @cfg {Array} hidden
         */
        hidden: []
    },

    animatingSprites: 0,

    updateStacked: function () {
        this.processData();
    },

    coordinateY: function () {
        return this.coordinateStacked('Y', 1, 2);
    },

    getFields: function (fieldCategory) {
        var me = this,
            fields = [], fieldsItem,
            i, ln;
        for (i = 0, ln = fieldCategory.length; i < ln; i++) {
            fieldsItem = me['get' + fieldCategory[i] + 'Field']();
            if (Ext.isArray(fieldsItem)) {
                fields.push.apply(fields, fieldsItem);
            } else {
                fields.push(fieldsItem);
            }
        }
        return fields;
    },

    updateLabelOverflowPadding: function (labelOverflowPadding) {
        this.getLabel().setAttributes({labelOverflowPadding: labelOverflowPadding});
    },

    getSprites: function () {
        var me = this,
            chart = this.getChart(),
            animation = chart && chart.getAnimate(),
            fields = me.getFields(me.fieldCategoryY),
            itemInstancing = me.getItemInstancing(),
            sprites = me.sprites, sprite,
            hidden = me.getHidden(),
            spritesCreated = false,
            i, length = fields.length;

        if (!chart) {
            return [];
        }

        for (i = 0; i < length; i++) {
            sprite = sprites[i];
            if (!sprite) {
                sprite = me.createSprite();
                if (chart.getFlipXY()) {
                    sprite.setAttributes({zIndex: i});
                } else {
                    sprite.setAttributes({zIndex: -i});
                }
                sprite.setField(fields[i]);
                spritesCreated = true;
                hidden.push(false);
                if (itemInstancing) {
                    sprite.itemsMarker.getTemplate().setAttributes(me.getOverriddenStyleByIndex(i));
                } else {
                    sprite.setAttributes(me.getStyleByIndex(i));
                }
            }
            if (animation) {
                if (itemInstancing) {
                    sprite.itemsMarker.getTemplate().fx.setConfig(animation);
                }
                sprite.fx.setConfig(animation);
            }
        }

        if (spritesCreated) {
            me.updateHidden(hidden);
        }
        return sprites;
    },

    getItemForPoint: function (x, y) {
        if (this.getSprites()) {
            var me = this,
                i, ln, sprite,
                itemInstancing = me.getItemInstancing(),
                sprites = me.getSprites(),
                store = me.getStore(),
                item;

            for (i = 0, ln = sprites.length; i < ln; i++) {
                sprite = sprites[i];
                var index = sprite.getIndexNearPoint(x, y);
                if (index !== -1) {
                    item = {
                        series: me,
                        index: index,
                        category: itemInstancing ? 'items' : 'markers',
                        record: store.getData().items[index],
                        field: this.getYField()[i],
                        sprite: sprite
                    };
                    return item;
                }
            }
        }
    },

    provideLegendInfo: function (target) {
        var sprites = this.getSprites(),
            title = this.getTitle(),
            field = this.getYField(),
            hidden = this.getHidden();
        for (var i = 0; i < sprites.length; i++) {
            target.push({
                name: this.getTitle() ? this.getTitle()[i] : (field && field[i]) || this.getId(),
                mark: this.getStyleByIndex(i).fillStyle || this.getStyleByIndex(i).strokeStyle || 'black',
                disabled: hidden[i],
                series: this.getId(),
                index: i
            });
        }
    },

    onSpriteAnimationStart: function (sprite) {
        this.animatingSprites++;
        if (this.animatingSprites === 1) {
            this.fireEvent('animationstart');
        }
    },

    onSpriteAnimationEnd: function (sprite) {
        this.animatingSprites--;
        if (this.animatingSprites === 0) {
            this.fireEvent('animationend');
        }
    }
});
