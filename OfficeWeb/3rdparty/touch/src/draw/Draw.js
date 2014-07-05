(function () {
    if (!Ext.global.Float32Array) {
        // Typed Array polyfill
        var Float32Array = function (array) {
            if (typeof array === 'number') {
                this.length = array;
            } else if ('length' in array) {
                this.length = array.length;
                for (var i = 0, len = array.length; i < len; i++) {
                    this[i] = +array[i];
                }
            }
        };

        Float32Array.prototype = [];
        Ext.global.Float32Array = Float32Array;
    }
})();

/**
 * Utility class providing mathematics functionalities through all the draw package.
 */
Ext.define('Ext.draw.Draw', {
    singleton: true,

    radian: Math.PI / 180,
    pi2: Math.PI * 2,

    /**
     * Function that returns its first element.
     * @param {Mixed} a
     * @return {Mixed}
     */
    reflectFn: function (a) {
        return a;
    },

    /**
     * Converting degrees to radians.
     * @param {Number} degrees
     * @return {Number}
     */
    rad: function (degrees) {
        return degrees % 360 * Math.PI / 180;
    },

    /**
     * Converting radians to degrees.
     * @param {Number} radian
     * @return {Number}
     */
    degrees: function (radian) {
        return radian * 180 / Math.PI % 360;
    },

    /**
     *
     * @param bbox1
     * @param bbox2
     * @param [padding]
     * @return {Boolean}
     */
    isBBoxIntersect: function (bbox1, bbox2, padding) {
        padding = padding || 0;
        return (Math.max(bbox1.x, bbox2.x) - padding > Math.min(bbox1.x + bbox1.width, bbox2.x + bbox2.width)) ||
            (Math.max(bbox1.y, bbox2.y) - padding > Math.min(bbox1.y + bbox1.height, bbox2.y + bbox2.height));
    },

    /**
     * Natural cubic spline interpolation.
     * This algorithm runs in linear time.
     *
     * @param {Array} points Array of numbers.
     */
    spline: function (points) {
        var i, j, ln = points.length,
            nd, d, y, ny,
            r = 0,
            zs = new Float32Array(points.length),
            result = new Float32Array(points.length * 3 - 2);

        zs[0] = 0;
        zs[ln - 1] = 0;

        for (i = 1; i < ln - 1; i++) {
            zs[i] = (points[i + 1] + points[i - 1] - 2 * points[i]) - zs[i - 1];
            r = 1 / (4 - r);
            zs[i] *= r;
        }

        for (i = ln - 2; i > 0; i--) {
            r = 3.732050807568877 + 48.248711305964385 / (-13.928203230275537 + Math.pow(0.07179676972449123, i));
            zs[i] -= zs[i + 1] * r;
        }

        ny = points[0];
        nd = ny - zs[0];
        for (i = 0, j = 0; i < ln - 1; j += 3) {
            y = ny;
            d = nd;
            i++;
            ny = points[i];
            nd = ny - zs[i];
            result[j] = y;
            result[j + 1] = (nd + 2 * d) / 3;
            result[j + 2] = (nd * 2 + d) / 3;
        }
        result[j] = ny;
        return result;
    },

    /**
     * @method
     * @private
     * Work around for iOS.
     * Nested 3d-transforms seems to prevent the redraw inside it until some event is fired.
     */
    updateIOS: Ext.os.is.iOS ? function () {
        Ext.getBody().createChild({id: 'frame-workaround', style: 'position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px; background: rgba(0,0,0,0.001); z-index: 100000'});
        Ext.draw.Animator.schedule(function () {Ext.get('frame-workaround').destroy();});
    } : Ext.emptyFn
});
