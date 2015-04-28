/**
 * @class Ext.chart.series.sprite.Cartesian
 * @extends Ext.draw.sprite.Sprite
 *
 * Cartesian sprite.
 */
Ext.define("Ext.chart.series.sprite.Cartesian", {
    extend: 'Ext.draw.sprite.Sprite',
    mixins: {
        markerHolder: "Ext.chart.MarkerHolder"
    },
    homogeneous: true,
    ascending: true,
    inheritableStatics: {
        def: {
            processors: {
                /**
                 * @cfg {Number} [dataMinX=0] Data minimum on the x-axis.
                 */
                dataMinX: 'number',

                /**
                 * @cfg {Number} [dataMaxX=1] Data maximum on the x-axis.
                 */
                dataMaxX: 'number',

                /**
                 * @cfg {Number} [dataMinY=0] Data minimum on the y-axis.
                 */
                dataMinY: 'number',

                /**
                 * @cfg {Number} [dataMaxY=2] Data maximum on the y-axis.
                 */
                dataMaxY: 'number',

                /**
                 * @cfg {Object} [dataY=null] Data items on the y-axis.
                 */
                dataY: 'data',

                /**
                 * @cfg {Object} [dataX=null] Data items on the x-axis.
                 */
                dataX: 'data',

                /**
                 * @cfg {Object} [labels=null] Labels used in the series.
                 */
                labels: 'default',

                /**
                 * @cfg {Number} [labelOverflowPadding=10] Padding around labels to determine overlap.
                 */
                labelOverflowPadding: 'number',

                /**
                 * @cfg {Boolean} [flipXY=true] 'true' if the series is flipped
                 */
                flipXY: 'bool',
                renderer: 'default',

                // PanZoom information
                visibleMinX: 'number',
                visibleMinY: 'number',
                visibleMaxX: 'number',
                visibleMaxY: 'number',
                innerWidth: 'number',
                innerHeight: 'number'
            },
            defaults: {
                dataY: null,
                dataX: null,
                dataMinX: 0,
                dataMaxX: 1,
                dataMinY: 0,
                dataMaxY: 1,
                labels: null,
                labelOverflowPadding: 10,
                flipXY: false,
                renderer: null,
                transformFillStroke: false,

                visibleMinX: 0,
                visibleMinY: 0,
                visibleMaxX: 1,
                visibleMaxY: 1,
                innerWidth: 1,
                innerHeight: 1
            },
            dirtyTriggers: {
                dataX: 'dataX,bbox',
                dataY: 'dataY,bbox',
                dataMinX: 'bbox',
                dataMaxX: 'bbox',
                dataMinY: 'bbox',
                dataMaxY: 'bbox',
                visibleMinX: 'panzoom',
                visibleMinY: 'panzoom',
                visibleMaxX: 'panzoom',
                visibleMaxY: 'panzoom',
                innerWidth: 'panzoom',
                innerHeight: 'panzoom'
            },
            updaters: {
                'dataX': function (attrs) {
                    this.processDataX();
                    if (!attrs.dirtyFlags.dataY) {
                        attrs.dirtyFlags.dataY = [];
                    }
                    attrs.dirtyFlags.dataY.push('dataY');
                },

                'dataY': function () {
                    this.processDataY();
                },

                'panzoom': function (attrs) {
                    var dx = attrs.visibleMaxX - attrs.visibleMinX,
                        dy = attrs.visibleMaxY - attrs.visibleMinY,
                        innerWidth = attrs.flipXY ? attrs.innerHeight : attrs.innerWidth,
                        innerHeight = !attrs.flipXY ? attrs.innerHeight : attrs.innerWidth;
                    attrs.translationX = -attrs.visibleMinX * innerWidth / dx;
                    attrs.translationY = -attrs.visibleMinY * innerHeight / dy;
                    attrs.scalingX = innerWidth / dx;
                    attrs.scalingY = innerHeight / dy;
                    attrs.scalingCenterX = 0;
                    attrs.scalingCenterY = 0;
                    this.applyTransformations(true);
                }
            }
        }
    },

    config: {
        /**
         * @cfg {Boolean} flipXY 'true' if the series is flipped
         */
        flipXY: false,

        /**
         * @private
         * @cfg {Object} dataItems Store items that are passed to the renderer.
         */
        dataItems: null,

        /**
         * @cfg {String} field The store field used by the series.
         */
        field: null
    },

    processDataY: Ext.emptyFn,

    processDataX: Ext.emptyFn,

    updatePlainBBox: function (plain) {
        var attr = this.attr;
        plain.x = attr.dataMinX;
        plain.y = attr.dataMinY;
        plain.width = attr.dataMaxX - attr.dataMinX;
        plain.height = attr.dataMaxY - attr.dataMinY;
    },

    /**
     * Does a binary search of the data on the x-axis using the given key.
     * @param key
     * @return {*}
     */
    binarySearch: function (key) {
        var dx = this.attr.dataX,
            start = 0,
            end = dx.length;
        if (key <= dx[0]) {
            return start;
        }
        if (key >= dx[end - 1]) {
            return end - 1;
        }
        while (start + 1 < end) {
            var mid = (start + end) >> 1,
                val = dx[mid];
            if (val === key) {
                return mid;
            } else if (val < key) {
                start = mid;
            } else {
                end = mid;
            }
        }
        return start;
    },

    render: function (surface, ctx, region) {
        var me = this,
            flipXY = me.getFlipXY(),
            attr = me.attr,
            inverseMatrix = attr.inverseMatrix.clone();

        inverseMatrix.appendMatrix(surface.inverseMatrix);

        if (attr.dataX === null) {
            return;
        }
        if (attr.dataY === null) {
            return;
        }

        if (inverseMatrix.getXX() * inverseMatrix.getYX() || inverseMatrix.getXY() * inverseMatrix.getYY()) {
            console.log('Cartesian Series sprite does not support rotation/sheering');
            return;
        }

        var clip = inverseMatrix.transformList([
            [region[0] - 1, region[3] + 1],
            [region[0] + region[2] + 1, -1]
        ]);

        clip = clip[0].concat(clip[1]);

        if (clip[2] < clip[0]) {
            console.log('Cartesian Series sprite does not supports flipped X.');
            // TODO: support it
            return;
        }
        me.renderClipped(surface, ctx, clip, region);
    },

    /**
     * Render the given visible clip range.
     * @param surface
     * @param ctx
     * @param clip
     * @param region
     */
    renderClipped: Ext.emptyFn,

    /**
     * Get the nearest item index from point (x, y). -1 as not found.
     * @param {Number} x
     * @param {Number} y
     * @return {Number} The index
     */
    getIndexNearPoint: function (x, y) {
        var sprite = this,
            mat = sprite.attr.matrix,
            dataX = sprite.attr.dataX,
            dataY = sprite.attr.dataY,
            minX, minY, index = -1,
            imat = mat.clone().prependMatrix(this.surfaceMatrix).inverse(),
            center = imat.transformPoint([x, y]),
            positionLB = imat.transformPoint([x - 22, y - 22]),
            positionTR = imat.transformPoint([x + 22, y + 22]),
            left = Math.min(positionLB[0], positionTR[0]),
            right = Math.max(positionLB[0], positionTR[0]),
            top = Math.min(positionLB[1], positionTR[1]),
            bottom = Math.max(positionLB[1], positionTR[1]);

        for (var i = 0; i < dataX.length; i++) {
            if (left < dataX[i] && dataX[i] < right && top < dataY[i] && dataY[i] < bottom) {
                if (index === -1 || Math.abs(dataX[i] - center[0]) < minX &&
                    Math.abs(dataY[i] - center[1]) < minY) {
                    minX = Math.abs(dataX[i] - center[0]);
                    minY = Math.abs(dataY[i] - center[1]);
                    index = i;
                }
            }
        }

        return index;
    }
});