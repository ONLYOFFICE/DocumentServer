/**
 * @class Ext.chart.series.sprite.StackedCartesian
 * @extends Ext.chart.series.sprite.Cartesian
 * 
 * Stacked cartesian sprite.
 */
Ext.define("Ext.chart.series.sprite.StackedCartesian", {
    extend: 'Ext.chart.series.sprite.Cartesian',
    inheritableStatics: {
        def: {
            processors: {
                /**
                 * @private
                 * @cfg {Number} [groupCount=1] The number of groups in the series.
                 */
                groupCount: 'number',

                /**
                 * @private
                 * @cfg {Number} [groupOffset=0] The group index of the series sprite.
                 */
                groupOffset: 'number',

                /**
                 * @private
                 * @cfg {Object} [dataStartY=null] The starting point of the data used in the series.
                 */
                dataStartY: 'data'
            },
            defaults: {
                groupCount: 1,
                groupOffset: 0,
                dataStartY: null
            },
            dirtyTriggers: {
                dataStartY: 'dataY,bbox'
            }
        }
    },

    //@inheritdoc
    getIndexNearPoint: function (x, y) {
        var sprite = this,
            mat = sprite.attr.matrix,
            dataX = sprite.attr.dataX,
            dataY = sprite.attr.dataY,
            dataStartY = sprite.attr.dataStartY,
            minX, minY, index = -1,
            imat = mat.clone().prependMatrix(this.surfaceMatrix).inverse(),
            center = imat.transformPoint([x, y]),
            positionLB = imat.transformPoint([x - 22, y - 22]),
            positionTR = imat.transformPoint([x + 22, y + 22]),
            dx, dy,
            left = Math.min(positionLB[0], positionTR[0]),
            right = Math.max(positionLB[0], positionTR[0]);

        for (var i = 0; i < dataX.length; i++) {
            if (left <= dataX[i] && dataX[i] <= right && dataStartY[i] <= center[1] && center[1] <= dataY[i]) {
                dx = Math.abs(dataX[i] - center[0]);
                dy = Math.max(-Math.min(dataY[i] - center[1], center[1] - dataStartY[i]), 0);
                if (index === -1 || dx < minX && dy <= minY) {
                    minX = dx;
                    minY = dy;
                    index = i;
                }
            }
        }

        return index;
    }
});