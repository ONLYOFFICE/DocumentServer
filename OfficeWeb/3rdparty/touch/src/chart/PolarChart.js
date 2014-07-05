/**
 * @class Ext.chart.PolarChart
 * @extends Ext.chart.AbstractChart
 * 
 * Creates a chart that uses polar coordinates.
 */
Ext.define('Ext.chart.PolarChart', {

    requires: [
        'Ext.chart.grid.CircularGrid',
        'Ext.chart.grid.RadialGrid'
    ],

    extend: 'Ext.chart.AbstractChart',
    xtype: 'polar',

    config: {
        /**
         * @cfg {Array} center Determines the center of the polar chart.
         * Updated when the chart performs layout.
         */
        center: [0, 0],
        /**
         * @cfg {Number} radius Determines the radius of the polar chart.
         * Updated when the chart performs layout.
         */
        radius: 0
    },

    getDirectionForAxis: function (position) {
        if (position === 'radial') {
            return 'Y';
        } else {
            return 'X';
        }
    },

    applyCenter: function (center, oldCenter) {
        if (oldCenter && center[0] === oldCenter[0] && center[1] === oldCenter[1]) {
            return;
        }
        return [+center[0], +center[1]];
    },

    updateCenter: function (center) {
        var me = this,
            axes = me.getAxes(), axis,
            series = me.getSeries(), seriesItem,
            i, ln;
        for (i = 0, ln = axes.length; i < ln; i++) {
            axis = axes[i];
            axis.setCenter(center);
        }

        for (i = 0, ln = series.length; i < ln; i++) {
            seriesItem = series[i];
            seriesItem.setCenter(center);
        }
    },

    updateRadius: function (radius) {
        var me = this,
            axes = me.getAxes(), axis,
            series = me.getSeries(), seriesItem,
            i, ln;
        for (i = 0, ln = axes.length; i < ln; i++) {
            axis = axes[i];
            axis.setMinimum(0);
            axis.setLength(radius);
            axis.getSprites();
        }

        for (i = 0, ln = series.length; i < ln; i++) {
            seriesItem = series[i];
            seriesItem.setRadius(radius);
        }
    },

    doSetSurfaceRegion: function (surface, region) {
        var mainRegion = this.getMainRegion();
        surface.setRegion(region);
        surface.matrix.set(1, 0, 0, 1, mainRegion[0] - region[0], mainRegion[1] - region[1]);
        surface.inverseMatrix.set(1, 0, 0, 1, region[0] - mainRegion[0], region[1] - mainRegion[1]);
    },

    performLayout: function () {
        try {
            this.resizing++;
            var me = this,
                size = me.element.getSize(),
                fullRegion = [0, 0, size.width, size.height],

                inset = me.getInsetPadding(),
                inner = me.getInnerPadding(),

                left = inset.left,
                top = inset.top,
                width = size.width - left - inset.right,
                height = size.height - top - inset.bottom,
                region = [inset.left, inset.top, width, height],

                innerWidth = width - inner.left - inner.right,
                innerHeight = height - inner.top - inner.bottom,

                center = [innerWidth * 0.5 + inner.left, innerHeight * 0.5 + inner.top],
                radius = Math.min(innerWidth, innerHeight) * 0.5,
                axes = me.getAxes(), axis,
                series = me.getSeries(), seriesItem,
                i, ln;

            me.setMainRegion(region);

            for (i = 0, ln = series.length; i < ln; i++) {
                seriesItem = series[i];
                me.doSetSurfaceRegion(seriesItem.getSurface(), region);
                me.doSetSurfaceRegion(seriesItem.getOverlaySurface(), fullRegion);
            }

            me.doSetSurfaceRegion(me.getSurface(), fullRegion);
            for (i = 0, ln = me.surfaceMap.grid && me.surfaceMap.grid.length; i < ln; i++) {
                me.doSetSurfaceRegion(me.surfaceMap.grid[i], fullRegion);
            }
            for (i = 0, ln = axes.length; i < ln; i++) {
                axis = axes[i];
                me.doSetSurfaceRegion(axis.getSurface(), fullRegion);
            }

            me.setRadius(radius);
            me.setCenter(center);
            me.redraw();
        } finally {
            this.resizing--;
        }
    },

    getEventXY: function (e) {
        e = (e.changedTouches && e.changedTouches[0]) || e.event || e.browserEvent || e;
        var me = this,
            xy = me.element.getXY(),
            padding = me.getInsetPadding();
        return [e.pageX - xy[0] - padding.left, e.pageY - xy[1] - padding.top];
    },

    redraw: function () {
        var me = this,
            axes = me.getAxes(), axis,
            series = me.getSeries(), seriesItem,
            i, ln;

        for (i = 0, ln = axes.length; i < ln; i++) {
            axis = axes[i];
            axis.getSprites();
        }

        for (i = 0, ln = series.length; i < ln; i++) {
            seriesItem = series[i];
            seriesItem.getSprites();
        }
        this.renderFrame();
    }
});