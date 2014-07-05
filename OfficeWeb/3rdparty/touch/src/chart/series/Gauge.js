/**
 * @class Ext.chart.series.Gauge
 * @extends Ext.chart.series.Series
 * 
 * Creates a Gauge Chart.
 *
 *     @example preview
 *     var chart = new Ext.chart.SpaceFillingChart({
 *         series: [{
 *             type: 'gauge',
 *             minimum: 100,
 *             maximum: 800,
 *             value: 400,
 *             donut: 30,
 *             subStyle: {
 *               fillStyle: ["#115fa6", "lightgrey"]
 *             }
 *         }]
 *     });
 *     Ext.Viewport.setLayout('fit');
 *     Ext.Viewport.add(chart);
 */
Ext.define('Ext.chart.series.Gauge', {
    alias: 'series.gauge',
    extend: 'Ext.chart.series.Series',
    type: "gauge",
    seriesType: 'sector',

    requires: [
        'Ext.draw.sprite.Sector'
    ],

    config: {
        /**
         * @cfg {String} angleField
         * @deprecated Use field directly
         * The store record field name to be used for the gauge angles.
         * The values bound to this field name must be positive real numbers.
         */
        angleField: null,

        /**
         * @cfg {String} field
         * The store record field name to be used for the gauge angles.
         * The values bound to this field name must be positive real numbers.
         */
        field: null,

        /**
         * @cfg {Boolean} needle
         * Use the Gauge Series as an area series or add a needle to it.
         */
        needle: false,

        /**
         * @cfg {Number} needleLengthRatio
         * The length ratio between the length of needle and the radius of background section.
         */
        needleLengthRatio: 0.8,

        /**
         * @cfg {Boolean/Number} donut
         * Use the entire disk or just a fraction of it for the gauge.
         */
        donut: 30,

        /**
         * @cfg {Boolean} showInLegend
         * Whether to add the gauge chart elements as legend items.
         */
        showInLegend: false,

        /**
         * @cfg {Number} value
         * Directly sets the displayed value of the gauge.
         */
        value: null,

        /**
         * @cfg {Number} minimum
         * The minimum value of the gauge.
         */
        minimum: 0,

        /**
         * @cfg {Number} maximum
         * The maximum value of the gauge.
         */
        maximum: 100,

        rotation: 0,

        totalAngle: Math.PI / 2,

        region: [0, 0, 1, 1],

        center: [0.5, 0.75],

        radius: 0.5,

        /**
         * @cfg {Boolean} wholeDisk Indicates whether to show the whole disk or only the marked part.
         */
        wholeDisk: false
    },

    updateAngleField: function (angleField) {
        this.setField(angleField);
    },

    updateRegion: function (region) {
        var wholeDisk = this.getWholeDisk(),
            halfTotalAngle = wholeDisk ? Math.PI : this.getTotalAngle() / 2,
            donut = this.getDonut() / 100,
            width, height, radius;
        if (halfTotalAngle <= Math.PI / 2) {
            width = 2 * Math.sin(halfTotalAngle);
            height = 1 - donut * Math.cos(halfTotalAngle);
        } else {
            width = 2;
            height = 1 - Math.cos(halfTotalAngle);
        }

        radius = Math.min(region[2] / width, region[3] / height);
        this.setRadius(radius);
        this.setCenter([region[2] / 2, radius + (region[3] - height * radius) / 2]);
    },

    updateCenter: function (center) {
        this.setStyle({
            centerX: center[0],
            centerY: center[1],
            rotationCenterX: center[0],
            rotationCenterY: center[1]
        });
        this.doUpdateStyles();
    },

    updateRotation: function (rotation) {
        this.setStyle({
            rotationRads: rotation - (this.getTotalAngle() + Math.PI) / 2
        });
        this.doUpdateStyles();
    },

    updateRadius: function (radius) {
        var donut = this.getDonut(),
            needle = this.getNeedle(),
            needleLengthRatio = needle ? this.getNeedleLengthRatio() : 1;
        this.setSubStyle({
            endRho: [radius * needleLengthRatio, radius],
            startRho: radius / 100 * donut
        });
        this.doUpdateStyles();
    },

    updateDonut: function (donut) {
        var radius = this.getRadius(),
            needle = this.getNeedle(),
            needleLengthRatio = needle ? this.getNeedleLengthRatio() : 1;
        this.setSubStyle({
            endRho: [radius * needleLengthRatio, radius],
            startRho: radius / 100 * donut
        });
        this.doUpdateStyles();
    },

    applyValue: function (value) {
        return Math.min(this.getMaximum(), Math.max(value, this.getMinimum()));
    },

    updateValue: function (value) {
        var needle = this.getNeedle(),
            pos = (value - this.getMinimum()) / (this.getMaximum() - this.getMinimum()),
            total = this.getTotalAngle(),
            angle = pos * total,
            sprites = this.getSprites();

        if (needle) {
            sprites[0].setAttributes({
                startAngle: angle,
                endAngle: angle
            });
        } else {
            sprites[0].setAttributes({
                endAngle: angle
            });
        }
        this.doUpdateStyles();
    },

    processData: function () {
        var store = this.getStore();
        if (!store) {
            return;
        }
        var field = this.getField();
        if (!field) {
            return;
        }
        if (!store.getData().items.length) {
            return;
        }
        this.setValue(store.getData().items[0].get(field));
    },

    getDefaultSpriteConfig: function () {
        return {
            type: 'sector',
            fx: {
                customDuration: {
                    translationX: 0,
                    translationY: 0,
                    rotationCenterX: 0,
                    rotationCenterY: 0,
                    centerX: 0,
                    centerY: 0,
                    startRho: 0,
                    endRho: 0,
                    baseRotation: 0
                }
            }
        };
    },

    getSprites: function () {
        //initialize store
        if(!this.getStore() && !Ext.isNumber(this.getValue())) {
            return null;
        }
        var me = this,
            sprite,
            animate = this.getChart().getAnimate(),
            sprites = me.sprites;

        if (sprites && sprites.length) {
            sprites[0].fx.setConfig(animate);
            return sprites;
        }

        // The needle
        sprite = me.createSprite();
        sprite.setAttributes({
            zIndex: 10
        });

        // The background
        sprite = me.createSprite();
        sprite.setAttributes({
            startAngle: 0,
            endAngle: me.getTotalAngle()
        });
        me.doUpdateStyles();
        return sprites;
    }
});

