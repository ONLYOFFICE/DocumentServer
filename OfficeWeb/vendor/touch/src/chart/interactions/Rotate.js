/**
 * @class Ext.chart.interactions.Rotate
 * @extends Ext.chart.interactions.Abstract
 * 
 * The Rotate interaction allows the user to rotate a polar chart about its central point.
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
 */
Ext.define('Ext.chart.interactions.Rotate', {

    extend: 'Ext.chart.interactions.Abstract',

    type: 'rotate',

    alias: 'interaction.rotate',

    config: {
        /**
         * @cfg {String} gesture
         * Defines the gesture type that will be used to rotate the chart. Currently only
         * supports `pinch` for two-finger rotation and `drag` for single-finger rotation.
         */
        gesture: 'rotate'
    },

    oldRotations: null,

    getGestures: function () {
        var gestures = {};
        gestures.rotate = 'onRotate';
        gestures.rotateend = 'onRotate';
        gestures.dragstart = 'onGestureStart';
        gestures.drag = 'onGesture';
        gestures.dragend = 'onGesture';
        return gestures;
    },

    getAngle: function (e) {
        var me = this,
            chart = me.getChart(),
            xy = chart.getEventXY(e),
            center = chart.getCenter();
        return Math.atan2(xy[1] - center[1],
            xy[0] - center[0]);
    },

    onGestureStart: function (e) {
        this.angle = this.getAngle(e);
        this.oldRotations = {};
    },

    onGesture: function (e) {
        var me = this,
            chart = me.getChart(),
            angle = this.getAngle(e) - this.angle,
            axes = chart.getAxes(), axis,
            series = chart.getSeries(), seriesItem,
            center = chart.getCenter(),
            oldRotations = this.oldRotations,
            oldRotation, i, ln;
        for (i = 0, ln = axes.length; i < ln; i++) {
            axis = axes[i];
            oldRotation = oldRotations[axis.getId()] || (oldRotations[axis.getId()] = axis.getRotation());
            axis.setRotation(angle + oldRotation);
        }

        for (i = 0, ln = series.length; i < ln; i++) {
            seriesItem = series[i];
            oldRotation = oldRotations[seriesItem.getId()] || (oldRotations[seriesItem.getId()] = seriesItem.getRotation());
            seriesItem.setRotation(angle + oldRotation);
        }
        me.sync();
    },

    onRotate: function (e) {

    }
});
