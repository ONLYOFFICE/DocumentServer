/**
 * @class Ext.chart.SpaceFillingChart
 * @extends Ext.chart.AbstractChart
 * 
 * Creates a chart that fills the entire area of the chart.
 * e.g. Treemap
 */
Ext.define('Ext.chart.SpaceFillingChart', {

    extend: 'Ext.chart.AbstractChart',
    xtype: 'spacefilling',

    config: {

    },

    performLayout: function () {
        try {
            this.resizing++;
            var me = this,
                size = me.element.getSize(),
                series = me.getSeries(), seriesItem,
                padding = me.getInsetPadding(),
                width = size.width - padding.left - padding.right,
                height = size.height - padding.top - padding.bottom,
                region = [padding.left, padding.top, width, height],
                i, ln;
            me.getSurface().setRegion(region);
            me.setMainRegion(region);
            for (i = 0, ln = series.length; i < ln; i++) {
                seriesItem = series[i];
                seriesItem.getSurface().setRegion(region);
                seriesItem.setRegion(region);
            }
            me.redraw();
        } finally {
            this.resizing--;
        }
    },

    redraw: function () {
        var me = this,
            series = me.getSeries(), seriesItem,
            i, ln;

        for (i = 0, ln = series.length; i < ln; i++) {
            seriesItem = series[i];
            seriesItem.getSprites();
        }
        this.renderFrame();
    }
});