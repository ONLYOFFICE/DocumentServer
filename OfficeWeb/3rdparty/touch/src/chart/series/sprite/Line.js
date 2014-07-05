/**
 * @class Ext.chart.series.sprite.Line
 * @extends Ext.chart.series.sprite.Aggregative
 *
 * Line series sprite.
 */
Ext.define("Ext.chart.series.sprite.Line", {
    alias: 'sprite.lineSeries',
    extend: 'Ext.chart.series.sprite.Aggregative',

    inheritableStatics: {
        def: {
            processors: {
                /**
                 * @cfg {Boolean} [smooth=false] 'true' if the sprite uses line smoothing.
                 */
                smooth: 'bool',

                /**
                 * @cfg {Boolean} [step=false] 'true' if the line uses step.
                 */
                step: 'bool',
                
                /**
                 * @cfg {Boolean} [preciseStroke=false] 'true' if the line uses precise stroke.
                 */
                preciseStroke: 'bool'
            },

            defaults: {
                smooth: false,
                step: false,
                preciseStroke: false
            },

            dirtyTriggers: {
                dataX: 'dataX,bbox,smooth',
                dataY: 'dataY,bbox,smooth',
                smooth: 'smooth'
            },

            updaters: {
                "smooth": function (attr) {
                    if (attr.smooth && attr.dataX && attr.dataY) {
                        this.smoothX = Ext.draw.Draw.spline(attr.dataX);
                        this.smoothY = Ext.draw.Draw.spline(attr.dataY);
                    } else {
                        delete this.smoothX;
                        delete this.smoothY;
                    }
                }
            }
        }
    },

    list: null,

    updatePlainBBox: function (plain) {
        var attr = this.attr,
            ymin = Math.min(0, attr.dataMinY),
            ymax = Math.max(0, attr.dataMaxY);
        plain.x = attr.dataMinX;
        plain.y = ymin;
        plain.width = attr.dataMaxX - attr.dataMinX;
        plain.height = ymax - ymin;
    },

    drawStroke: function (surface, ctx, list) {
        var attr = this.attr,
            matrix = attr.matrix,
            xx = matrix.getXX(),
            yy = matrix.getYY(),
            dx = matrix.getDX(),
            dy = matrix.getDY(),
            smooth = attr.smooth,
            step = attr.step,
            start = list[2],
            smoothX = this.smoothX,
            smoothY = this.smoothY,
            i, j;
        ctx.beginPath();
        if (smooth) {
            ctx.moveTo(smoothX[start * 3] * xx + dx, smoothY[start * 3] * yy + dy);
            for (i = 0, j = start * 3 + 1; i < list.length - 3; i += 3, j += 3) {
                ctx.bezierCurveTo(
                    smoothX[j] * xx + dx, smoothY[j] * yy + dy,
                    smoothX[j + 1] * xx + dx, smoothY[j + 1] * yy + dy,
                    list[i + 3], list[i + 4]
                );
            }
        } else if (step) {
            ctx.moveTo(list[0], list[1]);
            for (i = 3; i < list.length; i += 3) {
                ctx.lineTo(list[i], list[i - 2]);
                ctx.lineTo(list[i], list[i + 1]);
            }
        } else {
            ctx.moveTo(list[0], list[1]);
            for (i = 3; i < list.length; i += 3) {
                ctx.lineTo(list[i], list[i + 1]);
            }
        }
    },

    renderAggregates: function (aggregates, start, end, surface, ctx, clip, region) {
        var me = this,
            attr = me.attr,
            dataX = attr.dataX,
            matrix = attr.matrix,
            first = true,
            dataY = attr.dataY,
            pixel = surface.devicePixelRatio,
            xx = matrix.getXX(),
            yy = matrix.getYY(),
            dx = matrix.getDX(),
            dy = matrix.getDY(),
            markerCfg = {},
            list = this.list || (this.list = []),
            x, y,
            minXs = aggregates.minX,
            maxXs = aggregates.maxX,
            minYs = aggregates.minY,
            maxYs = aggregates.maxY,
            idx = aggregates.startIdx,
            surfaceMatrix = surface.matrix;

        list.length = 0;
        for (var i = start; i < end; i++) {
            var minX = minXs[i],
                maxX = maxXs[i],
                minY = minYs[i],
                maxY = maxYs[i];

            if (minX < maxX) {
                list.push(minX * xx + dx, minY * yy + dy, idx[i]);
                list.push(maxX * xx + dx, maxY * yy + dy, idx[i]);
            } else if (minX > maxX) {
                list.push(maxX * xx + dx, maxY * yy + dy, idx[i]);
                list.push(minX * xx + dx, minY * yy + dy, idx[i]);
            } else {
                list.push(maxX * xx + dx, maxY * yy + dy, idx[i]);
            }
            first = false;
        }

        if (list.length) {
            for (i = 0; i < list.length; i += 3) {
                x = list[i];
                y = list[i + 1];
                if (attr.renderer) {
                    attr.renderer.call(this, markerCfg, this, i, this.getDataItems().items[i]);
                }
                markerCfg.translationX = surfaceMatrix.x(x, y);
                markerCfg.translationY = surfaceMatrix.y(x, y);
                me.putMarker("markers", markerCfg, list[i + 2], !attr.renderer);
            }
            me.drawStroke(surface, ctx, list);
            ctx.lineTo(dataX[dataX.length - 1] * xx + dx + pixel, dataY[dataY.length - 1] * yy + dy);
            ctx.lineTo(dataX[dataX.length - 1] * xx + dx + pixel, region[1] - pixel);
            ctx.lineTo(dataX[0] * xx + dx - pixel, region[1] - pixel);
            ctx.lineTo(dataX[0] * xx + dx - pixel, dataY[0] * yy + dy);
            ctx.closePath();
            if (attr.transformFillStroke) {
                attr.matrix.toContext(ctx);
            }
            if (attr.preciseStroke) {
                ctx.fill();
                if (attr.transformFillStroke) {
                    attr.inverseMatrix.toContext(ctx);
                }
                me.drawStroke(surface, ctx, list);
                if (attr.transformFillStroke) {
                    attr.matrix.toContext(ctx);
                }
                ctx.stroke();
            } else {
                // Prevent the reverse transform to fix floating point err.
                ctx.fillStroke(attr, true);
            }
        }
    }
});