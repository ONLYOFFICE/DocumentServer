/**
 * @class Ext.chart.interactions.RotatePie3D
 * @extends Ext.chart.interactions.Rotate
 *
 * A special version of the Rotate interaction used by Pie3D Chart.
 */
Ext.define('Ext.chart.interactions.RotatePie3D', {

    extend: 'Ext.chart.interactions.Rotate',

    type: 'rotatePie3d',

    alias: 'interaction.rotatePie3d',

    getAngle: function (e) {
        var me = this,
            chart = me.getChart(),
            xy = chart.element.getXY(),
            region = chart.getMainRegion();
        return Math.atan2(e.pageY - xy[1] - region[3] * 0.5, e.pageX - xy[0] - region[2] * 0.5);
    }
});
