/**
 * @class Ext.chart.series.sprite.Bar
 * @extends Ext.chart.series.sprite.StackedCartesian
 *
 * Draws a sprite used in the bar series.
 */
Ext.define("Ext.chart.series.sprite.Bar", {
    alias: 'sprite.barSeries',
    extend: 'Ext.chart.series.sprite.StackedCartesian',

    inheritableStatics: {
        def: {
            processors: {
                /**
                 * @cfg {Number} [minBarWidth=2] The minimum bar width.
                 */
                minBarWidth: 'number',

                /**
                 * @cfg {Number} [maxBarWidth=100] The maximum bar width.
                 */
                maxBarWidth: 'number',

                /**
                 * @cfg {Number} [minGapWidth=5] The minimum gap between bars.
                 */
                minGapWidth: 'number',

                /**
                 * @cfg {Number} [radius=0] The degree of rounding for rounded bars.
                 */
                radius: 'number',

                /**
                 * @cfg {Number} [inGroupGapWidth=3] The gap between grouped bars.
                 */
                inGroupGapWidth: 'number',
                renderer: 'default'
            },
            defaults: {
                minBarWidth: 2,
                maxBarWidth: 100,
                minGapWidth: 5,
                inGroupGapWidth: 3,
                radius: 0,
                renderer: null
            }
        }
    },

    // TODO: design this more carefully
    drawLabel: function (text, dataX, dataStartY, dataY, labelId) {
        var me = this,
            attr = me.attr,
            labelCfg = me.labelCfg || (me.labelCfg = {}),
            surfaceMatrix = me.surfaceMatrix,
            labelX, labelY,
            labelOverflowPadding = attr.labelOverflowPadding,
            halfWidth,
            labelBox;

        labelBox = this.getMarkerBBox('labels', labelId, true);
        labelCfg.text = text;
        if (!labelBox) {
            me.putMarker('labels', labelCfg, labelId);
            labelBox = this.getMarkerBBox('labels', labelId, true);
        }
        if (!attr.flipXY) {
            labelCfg.rotationRads = Math.PI * 0.5;
        } else {
            labelCfg.rotationRads = 0;
        }
        labelCfg.calloutVertical = !attr.flipXY;

        halfWidth = (labelBox.width / 2 + labelOverflowPadding);
        if (dataStartY > dataY) {
            halfWidth = -halfWidth;
        }
        labelX = dataX;
        labelY = dataY - halfWidth;
        labelCfg.x = surfaceMatrix.x(labelX, labelY);
        labelCfg.y = surfaceMatrix.y(labelX, labelY);
        labelX = dataX;
        labelY = dataY + halfWidth;
        labelCfg.calloutPlaceX = surfaceMatrix.x(labelX, labelY);
        labelCfg.calloutPlaceY = surfaceMatrix.y(labelX, labelY);
        labelX = dataX;
        labelY = dataY;
        labelCfg.calloutStartX = surfaceMatrix.x(labelX, labelY);
        labelCfg.calloutStartY = surfaceMatrix.y(labelX, labelY);
        if (dataStartY > dataY) {
            halfWidth = -halfWidth;
        }
        if (Math.abs(dataY - dataStartY) > halfWidth * 2) {
            labelCfg.callout = 0;
        } else {
            labelCfg.callout = 1;
        }
        me.putMarker('labels', labelCfg, labelId);
    },

    drawBar: function (ctx, surface, clip, left, top, right, bottom, index) {
        var itemCfg = this.itemCfg || (this.itemCfg = {});
        itemCfg.x = left;
        itemCfg.y = top;
        itemCfg.width = right - left;
        itemCfg.height = bottom - top;
        itemCfg.radius = this.attr.radius;
        if (this.attr.renderer) {
            this.attr.renderer.call(this, itemCfg, this, index, this.getDataItems().items[index]);
        }
        this.putMarker("items", itemCfg, index, !this.attr.renderer);
    },

    //@inheritdoc
    renderClipped: function (surface, ctx, clip) {
        if (this.cleanRedraw) {
            return;
        }
        var me = this,
            attr = me.attr,
            dataX = attr.dataX,
            dataY = attr.dataY,
            dataText = attr.labels,
            dataStartY = attr.dataStartY,
            groupCount = attr.groupCount,
            groupOffset = attr.groupOffset - (groupCount - 1) * 0.5,
            inGroupGapWidth = attr.inGroupGapWidth,
            yLow, yHi,
            lineWidth = ctx.lineWidth,
            matrix = attr.matrix,
            maxBarWidth = matrix.getXX() - attr.minGapWidth,
            barWidth = surface.roundPixel(Math.max(attr.minBarWidth, (Math.min(maxBarWidth, attr.maxBarWidth) - inGroupGapWidth * (groupCount - 1)) / groupCount)),
            surfaceMatrix = this.surfaceMatrix,
            left, right, bottom, top, i, center,
            halfLineWidth = 0.5 * attr.lineWidth,
            xx = matrix.elements[0],
            dx = matrix.elements[4],
            yy = matrix.elements[3],
            dy = surface.roundPixel(matrix.elements[5]) - 1,
            start = Math.max(0, Math.floor(clip[0])),
            end = Math.min(dataX.length - 1, Math.ceil(clip[2])),
            drawMarkers = dataText && !!this.getBoundMarker("labels");

        for (i = start; i <= end; i++) {
            yLow = dataStartY ? dataStartY[i] : 0;
            yHi = dataY[i];

            center = dataX[i] * xx + dx + groupOffset * (barWidth + inGroupGapWidth);
            left = surface.roundPixel(center - barWidth / 2) + halfLineWidth;
            top = surface.roundPixel(yHi * yy + lineWidth + dy);
            right = surface.roundPixel(center + barWidth / 2) - halfLineWidth;
            bottom = surface.roundPixel(yLow * yy + lineWidth + dy);

            me.drawBar(ctx, surface, clip, left, top - halfLineWidth, right, bottom - halfLineWidth, i);

            if (drawMarkers && dataText[i]) {
                this.drawLabel(dataText[i], center, bottom, top, i);
            }
            me.putMarker("markers", {
                translationX: surfaceMatrix.x(center, top),
                translationY: surfaceMatrix.y(center, top)
            }, i, true);
        }
    }
});
