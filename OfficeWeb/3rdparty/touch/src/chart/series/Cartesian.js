/**
 * @abstract
 * @class Ext.chart.series.Cartesian
 * @extends Ext.chart.series.Series
 *
 * Common base class for series implementations which plot values using x/y coordinates.
 *
 * @constructor
 */
Ext.define('Ext.chart.series.Cartesian', {
    extend: 'Ext.chart.series.Series',
    config: {
        /**
         * The field used to access the x axis value from the items from the data
         * source.
         *
         * @cfg {String} xField
         */
        xField: null,

        /**
         * The field used to access the y-axis value from the items from the data
         * source.
         *
         * @cfg {String} yField
         */
        yField: null,

        /**
         * @cfg {Ext.chart.axis.Axis} xAxis The chart axis bound to the series on the x-axis.
         */
        xAxis: null,

        /**
         * @cfg {Ext.chart.axis.Axis} yAxis The chart axis bound to the series on the y-axis.
         */
        yAxis: null
    },

    directions: ['X', 'Y'],
    fieldCategoryX: ['X'],
    fieldCategoryY: ['Y'],

    updateXAxis: function (axis) {
        axis.processData(this);
    },

    updateYAxis: function (axis) {
        axis.processData(this);
    },

    coordinateX: function () {
        return this.coordinate('X', 0, 2);
    },

    coordinateY: function () {
        return this.coordinate('Y', 1, 2);
    },

    getItemForPoint: function (x, y) {
        if (this.getSprites()) {
            var me = this,
                sprite = me.getSprites()[0],
                store = me.getStore(),
                item;

            if (sprite) {
                var index = sprite.getIndexNearPoint(x, y);
                if (index !== -1) {
                    item = {
                        series: this,
                        category: this.getItemInstancing() ? 'items' : 'markers',
                        index: index,
                        record: store.getData().items[index],
                        field: this.getYField(),
                        sprite: sprite
                    };
                    return item;
                }
            }
        }
    },

    createSprite: function () {
        var sprite = this.callSuper(),
            xAxis = this.getXAxis();
        sprite.setFlipXY(this.getChart().getFlipXY());
        if (sprite.setAggregator && xAxis && xAxis.getAggregator) {
            if (xAxis.getAggregator) {
                sprite.setAggregator({strategy: xAxis.getAggregator()});
            } else {
                sprite.setAggregator({});
            }
        }
        return sprite;
    },

    getSprites: function () {
        var me = this,
            chart = this.getChart(),
            animation = chart && chart.getAnimate(),
            itemInstancing = me.getItemInstancing(),
            sprites = me.sprites, sprite;

        if (!chart) {
            return [];
        }

        if (!sprites.length) {
            sprite = me.createSprite();
        } else {
            sprite = sprites[0];
        }

        if (animation) {
            me.getLabel().getTemplate().fx.setConfig(animation);
            if (itemInstancing) {
                sprite.itemsMarker.getTemplate().fx.setConfig(animation);
            }
            sprite.fx.setConfig(animation);
        }
        return sprites;
    },

    provideLegendInfo: function (target) {
        var style = this.getStyle();
        target.push({
            name: this.getTitle() || this.getYField() || this.getId(),
            mark: style.fillStyle || style.strokeStyle || 'black',
            disabled: false,
            series: this.getId(),
            index: 0
        });
    },

    getXRange: function () {
        return [this.dataRange[0], this.dataRange[2]];
    },

    getYRange: function () {
        return [this.dataRange[1], this.dataRange[3]];
    }
})
;