/**
 * @class Ext.chart.CartesianChart
 * @extends Ext.chart.AbstractChart
 *
 * Represents a chart that uses cartesian coordinates.
 * A cartesian chart have two directions, X direction and Y direction.
 * The series and axes are coordinated along these directions.
 * By default the x direction is horizontal and y direction is vertical,
 * You can swap the by setting {@link #flipXY} config to `true`.
 *
 * Cartesian series often treats x direction an y direction differently.
 * In most cases, data on x direction are assumed to be monotonically increasing.
 * Based on this property, cartesian series can be trimmed and summarized properly
 * to gain a better performance.
 *
 * @xtype chart
 */

Ext.define('Ext.chart.CartesianChart', {
    extend: 'Ext.chart.AbstractChart',
    alternateClassName: 'Ext.chart.Chart',
    requires: ['Ext.chart.grid.HorizontalGrid', 'Ext.chart.grid.VerticalGrid'],
    config: {
        /**
         * @cfg {Boolean} flipXY Flip the direction of X and Y axis.
         * If flipXY is true, the X axes will be vertical and Y axes will be horizontal.
         */
        flipXY: false,

        innerRegion: [0, 0, 1, 1]
    },
    xtype: 'chart',
    alias: 'Ext.chart.Chart',

    getDirectionForAxis: function (position) {
        var flipXY = this.getFlipXY();
        if (position === 'left' || position === 'right') {
            if (flipXY) {
                return 'X';
            } else {
                return 'Y';
            }
        } else {
            if (flipXY) {
                return 'Y';
            } else {
                return 'X';
            }
        }
    },

    /**
     * Layout the axes and series.
     */
    performLayout: function () {
        try {
            this.resizing++;
            this.suspendThicknessChanged();
            var me = this,
                axes = me.getAxes(), axis,
                serieses = me.getSeries(), series,
                axisSurface, thickness,
                size = me.element.getSize(),
                width = size.width,
                height = size.height,
                insetPadding = me.getInsetPadding(),
                innerPadding = me.getInnerPadding(),
                surface,
                shrinkBox = {
                    top: insetPadding.top,
                    left: insetPadding.left,
                    right: insetPadding.right,
                    bottom: insetPadding.bottom
                },
                gridSurface,
                mainRegion, innerWidth, innerHeight,
                elements, floating, matrix, i, ln,
                flipXY = me.getFlipXY();

            if (width <= 0 || height <= 0) {
                return;
            }

            for (i = 0; i < axes.length; i++) {
                axis = axes[i];
                axisSurface = axis.getSurface();
                floating = axis.getStyle && axis.getStyle() && axis.getStyle().floating;
                thickness = axis.getThickness();
                switch (axis.getPosition()) {
                    case 'top':
                        axisSurface.setRegion([0, shrinkBox.top, width, thickness]);
                        break;
                    case 'bottom':
                        axisSurface.setRegion([0, height - (shrinkBox.bottom + thickness), width, thickness]);
                        break;
                    case 'left':
                        axisSurface.setRegion([shrinkBox.left, 0, thickness, height]);
                        break;
                    case 'right':
                        axisSurface.setRegion([width - (shrinkBox.right + thickness), 0, thickness, height]);
                        break;
                }
                if (!floating) {
                    shrinkBox[axis.getPosition()] += thickness;
                }
            }

            width -= shrinkBox.left + shrinkBox.right;
            height -= shrinkBox.top + shrinkBox.bottom;

            mainRegion = [shrinkBox.left, shrinkBox.top, width, height];

            shrinkBox.left += innerPadding.left;
            shrinkBox.top += innerPadding.top;
            shrinkBox.right += innerPadding.right;
            shrinkBox.bottom += innerPadding.bottom;

            innerWidth = width - innerPadding.left - innerPadding.right;
            innerHeight = height - innerPadding.top - innerPadding.bottom;

            me.setInnerRegion([shrinkBox.left, shrinkBox.top, innerWidth, innerHeight]);

            if (innerWidth <= 0 || innerHeight <= 0) {
                return;
            }

            me.setMainRegion(mainRegion);
            me.getSurface('main').setRegion(mainRegion);

            for (i = 0, ln = me.surfaceMap.grid && me.surfaceMap.grid.length; i < ln; i++) {
                gridSurface = me.surfaceMap.grid[i];
                gridSurface.setRegion(mainRegion);
                gridSurface.matrix.set(1, 0, 0, 1, innerPadding.left, innerPadding.top);
                gridSurface.matrix.inverse(gridSurface.inverseMatrix);
            }

            for (i = 0; i < axes.length; i++) {
                axis = axes[i];
                axisSurface = axis.getSurface();
                matrix = axisSurface.matrix;
                elements = matrix.elements;
                switch (axis.getPosition()) {
                    case 'top':
                    case 'bottom':
                        elements[4] = shrinkBox.left;
                        axis.setLength(innerWidth);
                        break;
                    case 'left':
                    case 'right':
                        elements[5] = shrinkBox.top;
                        axis.setLength(innerHeight);
                        break;
                }
                axis.updateTitleSprite();
                matrix.inverse(axisSurface.inverseMatrix);
            }

            for (i = 0, ln = serieses.length; i < ln; i++) {
                series = serieses[i];
                surface = series.getSurface();
                surface.setRegion(mainRegion);
                if (flipXY) {
                    surface.matrix.set(0, -1, 1, 0, innerPadding.left, innerHeight + innerPadding.top);
                } else {
                    surface.matrix.set(1, 0, 0, -1, innerPadding.left, innerHeight + innerPadding.top);
                }
                surface.matrix.inverse(surface.inverseMatrix);
                series.getOverlaySurface().setRegion(mainRegion);
            }
            me.redraw();
            me.onPlaceWatermark();
        } finally {
            this.resizing--;
            this.resumeThicknessChanged();
        }
    },

    redraw: function () {
        var me = this,
            series = me.getSeries(),
            axes = me.getAxes(),
            region = me.getMainRegion(),
            innerWidth, innerHeight,
            innerPadding = me.getInnerPadding(),
            left, right, top, bottom, i, j,
            sprites, xRange, yRange, isSide, attr,
            axisX, axisY, range, visibleRange,
            flipXY = me.getFlipXY();

        if (!region) {
            return;
        }

        innerWidth = region[2] - innerPadding.left - innerPadding.right;
        innerHeight = region[3] - innerPadding.top - innerPadding.bottom;
        for (i = 0; i < series.length; i++) {
            if ((axisX = series[i].getXAxis())) {
                visibleRange = axisX.getVisibleRange();
                xRange = axisX.getRange();
                xRange = [xRange[0] + (xRange[1] - xRange[0]) * visibleRange[0], xRange[0] + (xRange[1] - xRange[0]) * visibleRange[1]];
            } else {
                xRange = series[i].getXRange();
            }

            if ((axisY = series[i].getYAxis())) {
                visibleRange = axisY.getVisibleRange();
                yRange = axisY.getRange();
                yRange = [yRange[0] + (yRange[1] - yRange[0]) * visibleRange[0], yRange[0] + (yRange[1] - yRange[0]) * visibleRange[1]];
            } else {
                yRange = series[i].getYRange();
            }

            left = xRange[0];
            right = xRange[1];
            top = yRange[0];
            bottom = yRange[1];

            attr = {
                visibleMinX: xRange[0],
                visibleMaxX: xRange[1],
                visibleMinY: yRange[0],
                visibleMaxY: yRange[1],
                innerWidth: innerWidth,
                innerHeight: innerHeight,
                flipXY: flipXY
            };

            sprites = series[i].getSprites();
            for (j = 0; j < sprites.length; j++) {
                sprites[j].setAttributes(attr, true);
            }
        }

        for (i = 0; i < axes.length; i++) {
            isSide = axes[i].isSide();
            sprites = axes[i].getSprites();
            range = axes[i].getRange();
            visibleRange = axes[i].getVisibleRange();
            attr = {
                dataMin: range[0],
                dataMax: range[1],
                visibleMin: visibleRange[0],
                visibleMax: visibleRange[1]
            };
            if (isSide) {
                attr.length = innerHeight;
                attr.startGap = innerPadding.bottom;
                attr.endGap = innerPadding.top;
            } else {
                attr.length = innerWidth;
                attr.startGap = innerPadding.left;
                attr.endGap = innerPadding.right;
            }
            for (j = 0; j < sprites.length; j++) {
                sprites[j].setAttributes(attr, true);
            }
        }
        me.renderFrame();
        me.callSuper(arguments);
    },

    onPlaceWatermark: function () {
        var region0 = this.element.getBox(),
            region = this.getSurface ? this.getSurface('main').getRegion() : this.getItems().get(0).getRegion();
        if (region) {
            this.watermarkElement.setStyle({
                right: Math.round(region0.width - (region[2] + region[0])) + 'px',
                bottom: Math.round(region0.height - (region[3] + region[1])) + 'px'
            });
        }
    }
});