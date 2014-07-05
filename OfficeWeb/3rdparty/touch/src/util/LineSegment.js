/**
 * @class Ext.util.LineSegment
 *
 * Utility class that represents a line segment, constructed by two {@link Ext.util.Point}
 */
Ext.define('Ext.util.LineSegment', {
    requires: ['Ext.util.Point'],

    /**
     * Creates new LineSegment out of two points.
     * @param {Ext.util.Point} point1
     * @param {Ext.util.Point} point2
     */
    constructor: function(point1, point2) {
        var Point = Ext.util.Point;

        this.point1 = Point.from(point1);
        this.point2 = Point.from(point2);
    },

    /**
     * Returns the point where two lines intersect.
     * @param {Ext.util.LineSegment} lineSegment The line to intersect with.
     * @return {Ext.util.Point}
     */
    intersects: function(lineSegment) {
        var point1 = this.point1,
            point2 = this.point2,
            point3 = lineSegment.point1,
            point4 = lineSegment.point2,
            x1 = point1.x,
            x2 = point2.x,
            x3 = point3.x,
            x4 = point4.x,
            y1 = point1.y,
            y2 = point2.y,
            y3 = point3.y,
            y4 = point4.y,
            d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4),
            xi, yi;

        if (d == 0) {
            return null;
        }

        xi = ((x3 - x4) * (x1 * y2 - y1 * x2) - (x1 - x2) * (x3 * y4 - y3 * x4)) / d;
        yi = ((y3 - y4) * (x1 * y2 - y1 * x2) - (y1 - y2) * (x3 * y4 - y3 * x4)) / d;

        if (xi < Math.min(x1, x2) || xi > Math.max(x1, x2)
            || xi < Math.min(x3, x4) || xi > Math.max(x3, x4)
            || yi < Math.min(y1, y2) || yi > Math.max(y1, y2)
            || yi < Math.min(y3, y4) || yi > Math.max(y3, y4)) {
            return null;
        }

        return new Ext.util.Point(xi, yi);
    },

    /**
     * Returns string representation of the line. Useful for debugging.
     * @return {String} For example `Point[12,8] Point[0,0]`
     */
    toString: function() {
        return this.point1.toString() + " " + this.point2.toString();
    }
});
