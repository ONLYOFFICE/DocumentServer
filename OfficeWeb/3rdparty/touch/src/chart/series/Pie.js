/**
 * @class Ext.chart.series.Pie
 * @extends Ext.chart.series.Polar
 *
 * Creates a Pie Chart. A Pie Chart is a useful visualization technique to display quantitative information for different
 * categories that also have a meaning as a whole.
 * As with all other series, the Pie Series must be appended in the *series* Chart array configuration. See the Chart
 * documentation for more information. A typical configuration object for the pie series could be:
 *
 *     @example preview
 *     var chart = new Ext.chart.PolarChart({
 *         animate: true,
 *         interactions: ['rotate'],
 *         colors: ["#115fa6", "#94ae0a", "#a61120", "#ff8809", "#ffd13e"],
 *         store: {
 *           fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5'],
 *           data: [
 *               {'name':'metric one', 'data1':10, 'data2':12, 'data3':14, 'data4':8, 'data5':13},
 *               {'name':'metric two', 'data1':7, 'data2':8, 'data3':16, 'data4':10, 'data5':3},
 *               {'name':'metric three', 'data1':5, 'data2':2, 'data3':14, 'data4':12, 'data5':7},
 *               {'name':'metric four', 'data1':2, 'data2':14, 'data3':6, 'data4':1, 'data5':23},
 *               {'name':'metric five', 'data1':27, 'data2':38, 'data3':36, 'data4':13, 'data5':33}
 *           ]
 *         },
 *         series: [{
 *             type: 'pie',
 *             labelField: 'name',
 *             xField: 'data3',
 *             donut: 30
 *         }]
 *     });
 *     Ext.Viewport.setLayout('fit');
 *     Ext.Viewport.add(chart);
 *
 * In this configuration we set `pie` as the type for the series, set an object with specific style properties for highlighting options
 * (triggered when hovering elements). We also set true to `showInLegend` so all the pie slices can be represented by a legend item.
 * We set `data1` as the value of the field to determine the angle span for each pie slice. We also set a label configuration object
 * where we set the field name of the store field to be renderer as text for the label. The labels will also be displayed rotated.
 * We set `contrast` to `true` to flip the color of the label if it is to similar to the background color. Finally, we set the font family
 * and size through the `font` parameter.
 *
 */
Ext.define('Ext.chart.series.Pie', {
    extend: 'Ext.chart.series.Polar',
    requires: [
        "Ext.chart.series.sprite.PieSlice"
    ],
    type: 'pie',
    alias: 'series.pie',
    seriesType: 'pieslice',

    config: {
        /**
         * @cfg {String} labelField
         * The store record field name to be used for the pie slice labels.
         */
        labelField: false,

        /**
         * @cfg {Boolean/Number} donut Whether to set the pie chart as donut chart.
         * Can be set to a particular percentage to set the radius of the donut chart.
         */
        donut: false,

        /**
         * @cfg {String} field
         * @deprecated Use xField directly
         */
        field: null,

        /**
         * @cfg {Number} rotation The starting angle of the pie slices.
         */
        rotation: 0,

        /**
         * @cfg {Number} [totalAngle=2*PI] The total angle of the pie series.
         */
        totalAngle: Math.PI * 2,

        /**
         * @cfg {Array} hidden Determines which pie slices are hidden.
         */
        hidden: [],

        style: {

        }
    },

    directions: ['X'],

    setField: function (f) {
        return this.setXField(f);
    },

    getField: function () {
        return this.getXField();
    },

    updateLabelData: function () {
        var me = this,
            store = me.getStore(),
            items = store.getData().items,
            sprites = me.getSprites(),
            labelField = me.getLabelField(),
            i, ln, labels;
        if (sprites.length > 0 && labelField) {
            labels = [];
            for (i = 0, ln = items.length; i < ln; i++) {
                labels.push(items[i].get(labelField));
            }
            for (i = 0, ln = sprites.length; i < ln; i++) {
                sprites[i].setAttributes({label: labels[i]});
            }
        }
    },

    coordinateX: function () {
        var me = this,
            store = me.getStore(),
            items = store.getData().items,
            length = items.length,
            field = me.getXField(),
            value, sum = 0,
            hidden = me.getHidden(),
            summation = [], i,
            lastAngle = 0,
            totalAngle = me.getTotalAngle(),
            sprites = me.getSprites();

        if (!sprites) {
            return;
        }

        for (i = 0; i < length; i++) {
            value = items[i].get(field);
            if (!hidden[i]) {
                sum += value;
            }
            summation[i] = sum;
            if (i >= hidden.length) {
                hidden[i] = false;
            }
        }

        if (sum === 0) {
            return;
        }
        sum = totalAngle / sum;
        for (i = 0; i < length; i++) {
            sprites[i].setAttributes({
                startAngle: lastAngle,
                endAngle: lastAngle = summation[i] * sum,
                globalAlpha: 1
            });
        }
        for (; i < me.sprites.length; i++) {
            sprites[i].setAttributes({
                startAngle: totalAngle,
                endAngle: totalAngle,
                globalAlpha: 0
            });
        }
        me.getChart().refreshLegendStore();
    },

    updateCenter: function (center) {
        this.setStyle({
            translationX: center[0] + this.getOffsetX(),
            translationY: center[1] + this.getOffsetY()
        });
        this.doUpdateStyles();
    },

    updateRadius: function (radius) {
        this.setStyle({
            startRho: radius * this.getDonut() * 0.01, // Percentage
            endRho: radius
        });
        this.doUpdateStyles();
    },

    updateDonut: function (donut) {
        var radius = this.getRadius();
        this.setStyle({
            startRho: radius * donut * 0.01, // Percentage
            endRho: radius
        });
        this.doUpdateStyles();
    },

    updateRotation: function (rotation) {
        this.setStyle({
            rotationRads: rotation
        });
        this.doUpdateStyles();
    },

    updateTotalAngle: function (totalAngle) {
        this.processData();
    },

    getSprites: function () {
        var me = this,
            chart = this.getChart(),
            store = me.getStore();
        if (!chart || !store) {
            return[];
        }
        me.getColors();
        me.getSubStyle();
        var items = store.getData().items,
            length = items.length,
            animation = chart && chart.getAnimate(),
            center = me.getCenter(),
            offsetX = me.getOffsetX(),
            offsetY = me.getOffsetY(),
            sprites = me.sprites, sprite,
            i, spriteCreated = false;

        for (i = 0; i < length; i++) {
            sprite = sprites[i];
            if (!sprite) {
                sprite = me.createSprite();
                if (me.getHighlightCfg()) {
                    sprite.config.highlightCfg = me.getHighlightCfg();
                    sprite.addModifier('highlight', true);
                }
                if (me.getLabelField()) {
                    me.getLabel().getTemplate().setAttributes({
                        labelOverflowPadding: this.getLabelOverflowPadding()
                    });
                    me.getLabel().getTemplate().fx.setCustomDuration({'callout': 200});
                    sprite.bindMarker('labels', me.getLabel());
                }
                sprite.setAttributes(this.getStyleByIndex(i));
                spriteCreated = true;
            }
            sprite.fx.setConfig(animation);
        }
        if (spriteCreated) {
            me.doUpdateStyles();
        }
        return me.sprites;
    },

    betweenAngle: function (x, a, b) {
        b -= a;
        x -= a;
        x %= Math.PI * 2;
        b %= Math.PI * 2;
        x += Math.PI * 2;
        b += Math.PI * 2;
        x %= Math.PI * 2;
        b %= Math.PI * 2;
        return x < b;
    },

    getItemForPoint: function (x, y) {
        var me = this,
            sprites = me.getSprites();
        if (sprites) {
            var center = me.getCenter(),
                offsetX = me.getOffsetX(),
                offsetY = me.getOffsetY(),
                originalX = x - center[0] + offsetX,
                originalY = y - center[1] + offsetY,
                store = me.getStore(),
                donut = me.getDonut(),
                items = store.getData().items,
                direction = Math.atan2(originalY, originalX) - me.getRotation(),
                donutLimit = Math.sqrt(originalX * originalX + originalY * originalY),
                endRadius = me.getRadius(),
                startRadius = donut / 100 * endRadius,
                i, ln, attr;

            for (i = 0, ln = items.length; i < ln; i++) {
                // Fortunately, the id of items equals the index of it in instances list.
                attr = sprites[i].attr;
                if (startRadius + attr.margin <= donutLimit && donutLimit + attr.margin <= endRadius) {
                    if (this.betweenAngle(direction, attr.startAngle, attr.endAngle)) {
                        return {
                            series: this,
                            sprite: sprites[i],
                            index: i,
                            record: items[i],
                            field: this.getXField()
                        };
                    }
                }
            }
        }
    },

    provideLegendInfo: function (target) {
        var store = this.getStore();
        if (store) {
            var items = store.getData().items,
                labelField = this.getLabelField(),
                field = this.getField(),
                hidden = this.getHidden();
            for (var i = 0; i < items.length; i++) {
                target.push({
                    name: labelField ? String(items[i].get(labelField))  : (field && field[i]) || this.getId(),
                    mark: this.getStyleByIndex(i).fillStyle || this.getStyleByIndex(i).strokeStyle || 'black',
                    disabled: hidden[i],
                    series: this.getId(),
                    index: i
                });
            }
        }
    }
});

