/**
 * Polar series.
 */
Ext.define('Ext.chart.series.Polar', {

    extend: 'Ext.chart.series.Series',

    config: {
        /**
         * @cfg {Number} rotation
         * The angle in degrees at which the first polar series item should start.
         */
        rotation: 0,

        /**
         * @cfg {Number} radius
         * The radius of the polar series. Set to `null` will fit the polar series to the boundary.
         */
        radius: null,

        /**
         * @cfg {Array} center for the polar series.
         */
        center: [0, 0],

        /**
         * @cfg {Number} offsetX
         * The x-offset of center of the polar series related to the center of the boundary.
         */
        offsetX: 0,

        /**
         * @cfg {Number} offsetY
         * The y-offset of center of the polar series related to the center of the boundary.
         */
        offsetY: 0,

        /**
         * @cfg {Boolean} showInLegend
         * Whether to add the series elements as legend items.
         */
        showInLegend: true,

        /**
         * @cfg {String} xField
         * The store record field name for the labels used in the radar series.
         */
        xField: null,

        /**
         * @cfg {String} yField
         * The store record field name for the deflection of the graph in the radar series.
         */
        yField: null,

        xAxis: null,

        yAxis: null
    },

    directions: ['X', 'Y'],

    fieldCategoryX: ['X'],
    fieldCategoryY: ['Y'],

    getDefaultSpriteConfig: function () {
        return {
            type: this.seriesType,
            centerX: 0,
            centerY: 0,
            rotationCenterX: 0,
            rotationCenterY: 0,
            fx: {
                customDuration: {
                    translationX: 0,
                    translationY: 0,
                    centerX: 0,
                    centerY: 0,
                    startRho: 0,
                    endRho: 0,
                    baseRotation: 0,
                    rotationCenterX: 0,
                    rotationCenterY: 0,
                    rotationRads: 0
                }
            }
        };
    },

    applyRotation: function (rotation) {
        var twoPie = Math.PI * 2;
        return (rotation % twoPie + Math.PI) % twoPie - Math.PI;
    },

    updateRotation: function (rotation) {
        var sprites = this.getSprites();
        if (sprites && sprites[0]) {
            sprites[0].setAttributes({
                baseRotation: rotation
            });
        }
    }
});