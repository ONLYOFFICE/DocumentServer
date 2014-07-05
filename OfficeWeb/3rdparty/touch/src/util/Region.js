/**
 * Represents a rectangular region and provides a number of utility methods
 * to compare regions.
 */
Ext.define('Ext.util.Region', {

    requires: ['Ext.util.Offset'],

    statics: {
        /**
         * @static
         * Retrieves an Ext.util.Region for a particular element.
         * @param {String/HTMLElement/Ext.Element} el The element or its ID.
         * @return {Ext.util.Region} region
         */
        getRegion: function(el) {
            return Ext.fly(el).getPageBox(true);
        },

        /**
         * @static
         * Creates new Region from an object:
         *
         *     Ext.util.Region.from({top: 0, right: 5, bottom: 3, left: -1});
         *     // the above is equivalent to:
         *     new Ext.util.Region(0, 5, 3, -1);
         *
         * @param {Object} o An object with `top`, `right`, `bottom`, and `left` properties.
         * @param {Number} o.top
         * @param {Number} o.right
         * @param {Number} o.bottom
         * @param {Number} o.left
         * @return {Ext.util.Region} The region constructed based on the passed object.
         */
        from: function(o) {
            return new this(o.top, o.right, o.bottom, o.left);
        }
    },

    /**
     * Creates new Region.
     * @param {Number} top Top
     * @param {Number} right Right
     * @param {Number} bottom Bottom
     * @param {Number} left Left
     */
    constructor: function(top, right, bottom, left) {
        var me = this;
        me.top = top;
        me[1] = top;
        me.right = right;
        me.bottom = bottom;
        me.left = left;
        me[0] = left;
    },

    /**
     * Checks if this region completely contains the region that is passed in.
     * @param {Ext.util.Region} region
     * @return {Boolean}
     */
    contains: function(region) {
        var me = this;
        return (region.left >= me.left &&
                region.right <= me.right &&
                region.top >= me.top &&
                region.bottom <= me.bottom);

    },

    /**
     * Checks if this region intersects the region passed in.
     * @param {Ext.util.Region} region
     * @return {Ext.util.Region/Boolean} Returns the intersected region or `false` if there is no intersection.
     */
    intersect: function(region) {
        var me = this,
            t = Math.max(me.top, region.top),
            r = Math.min(me.right, region.right),
            b = Math.min(me.bottom, region.bottom),
            l = Math.max(me.left, region.left);

        if (b > t && r > l) {
            return new Ext.util.Region(t, r, b, l);
        }
        else {
            return false;
        }
    },

    /**
     * Returns the smallest region that contains the current AND `targetRegion`.
     * @param {Ext.util.Region} region
     * @return {Ext.util.Region}
     */
    union: function(region) {
        var me = this,
            t = Math.min(me.top, region.top),
            r = Math.max(me.right, region.right),
            b = Math.max(me.bottom, region.bottom),
            l = Math.min(me.left, region.left);

        return new Ext.util.Region(t, r, b, l);
    },

    /**
     * Modifies the current region to be constrained to the `targetRegion`.
     * @param {Ext.util.Region} targetRegion
     * @return {Ext.util.Region} this
     */
    constrainTo: function(targetRegion) {
        var me = this,
            constrain = Ext.util.Numbers.constrain;
        me.top = constrain(me.top, targetRegion.top, targetRegion.bottom);
        me.bottom = constrain(me.bottom, targetRegion.top, targetRegion.bottom);
        me.left = constrain(me.left, targetRegion.left, targetRegion.right);
        me.right = constrain(me.right, targetRegion.left, targetRegion.right);
        return me;
    },

    /**
     * Modifies the current region to be adjusted by offsets.
     * @param {Number} top Top offset
     * @param {Number} right Right offset
     * @param {Number} bottom Bottom offset
     * @param {Number} left Left offset
     * @return {Ext.util.Region} this
     * @chainable
     */
    adjust: function(top, right, bottom, left) {
        var me = this;
        me.top += top;
        me.left += left;
        me.right += right;
        me.bottom += bottom;
        return me;
    },

    /**
     * Get the offset amount of a point outside the region.
     * @param {String/Object} axis optional.
     * @param {Ext.util.Point} p The point.
     * @return {Ext.util.Region}
     */
    getOutOfBoundOffset: function(axis, p) {
        if (!Ext.isObject(axis)) {
            if (axis == 'x') {
                return this.getOutOfBoundOffsetX(p);
            } else {
                return this.getOutOfBoundOffsetY(p);
            }
        } else {
            var d = new Ext.util.Offset();
                d.x = this.getOutOfBoundOffsetX(axis.x);
                d.y = this.getOutOfBoundOffsetY(axis.y);
            return d;
        }

    },

    /**
     * Get the offset amount on the x-axis.
     * @param {Number} p The offset.
     * @return {Number}
     */
    getOutOfBoundOffsetX: function(p) {
        if (p <= this.left) {
            return this.left - p;
        } else if (p >= this.right) {
            return this.right - p;
        }

        return 0;
    },

    /**
     * Get the offset amount on the y-axis.
     * @param {Number} p The offset.
     * @return {Number}
     */
    getOutOfBoundOffsetY: function(p) {
        if (p <= this.top) {
            return this.top - p;
        } else if (p >= this.bottom) {
            return this.bottom - p;
        }

        return 0;
    },

    /**
     * Check whether the point / offset is out of bounds.
     * @param {String} axis optional
     * @param {Ext.util.Point/Number} p The point / offset.
     * @return {Boolean}
     */
    isOutOfBound: function(axis, p) {
        if (!Ext.isObject(axis)) {
            if (axis == 'x') {
                return this.isOutOfBoundX(p);
            } else {
                return this.isOutOfBoundY(p);
            }
        } else {
            p = axis;
            return (this.isOutOfBoundX(p.x) || this.isOutOfBoundY(p.y));
        }
    },

    /**
     * Check whether the offset is out of bound in the x-axis.
     * @param {Number} p The offset.
     * @return {Boolean}
     */
    isOutOfBoundX: function(p) {
        return (p < this.left || p > this.right);
    },

    /**
     * Check whether the offset is out of bound in the y-axis.
     * @param {Number} p The offset.
     * @return {Boolean}
     */
    isOutOfBoundY: function(p) {
        return (p < this.top || p > this.bottom);
    },

    /*
     * Restrict a point within the region by a certain factor.
     * @param {String} axis Optional
     * @param {Ext.util.Point/Ext.util.Offset/Object} p
     * @param {Number} factor
     * @return {Ext.util.Point/Ext.util.Offset/Object/Number}
     */
    restrict: function(axis, p, factor) {
        if (Ext.isObject(axis)) {
            var newP;

            factor = p;
            p = axis;

            if (p.copy) {
                newP = p.copy();
            }
            else {
                newP = {
                    x: p.x,
                    y: p.y
                };
            }

            newP.x = this.restrictX(p.x, factor);
            newP.y = this.restrictY(p.y, factor);
            return newP;
        } else {
            if (axis == 'x') {
                return this.restrictX(p, factor);
            } else {
                return this.restrictY(p, factor);
            }
        }
    },

    /*
     * Restrict an offset within the region by a certain factor, on the x-axis.
     * @param {Number} p
     * @param {Number} [factor=1] (optional) The factor.
     * @return {Number}
     */
    restrictX: function(p, factor) {
        if (!factor) {
            factor = 1;
        }

        if (p <= this.left) {
            p -= (p - this.left) * factor;
        }
        else if (p >= this.right) {
            p -= (p - this.right) * factor;
        }
        return p;
    },

    /*
     * Restrict an offset within the region by a certain factor, on the y-axis.
     * @param {Number} p
     * @param {Number} [factor=1] (optional) The factor.
     * @return {Number}
     */
    restrictY: function(p, factor) {
        if (!factor) {
            factor = 1;
        }

        if (p <= this.top) {
            p -= (p - this.top) * factor;
        }
        else if (p >= this.bottom) {
            p -= (p - this.bottom) * factor;
        }
        return p;
    },

    /*
     * Get the width / height of this region.
     * @return {Object} An object with `width` and `height` properties.
     * @return {Number} return.width
     * @return {Number} return.height
     */
    getSize: function() {
        return {
            width: this.right - this.left,
            height: this.bottom - this.top
        };
    },

    /**
     * Copy a new instance.
     * @return {Ext.util.Region}
     */
    copy: function() {
        return new Ext.util.Region(this.top, this.right, this.bottom, this.left);
    },

    /**
     * Dump this to an eye-friendly string, great for debugging.
     * @return {String} For example `Region[0,1,3,2]`.
     */
    toString: function() {
        return "Region[" + this.top + "," + this.right + "," + this.bottom + "," + this.left + "]";
    },


    /**
     * Translate this region by the given offset amount.
     * @param {Object} offset
     * @return {Ext.util.Region} This Region.
     * @chainable
     */
    translateBy: function(offset) {
        this.left += offset.x;
        this.right += offset.x;
        this.top += offset.y;
        this.bottom += offset.y;

        return this;
    },

    /**
     * Round all the properties of this region.
     * @return {Ext.util.Region} This Region.
     * @chainable
     */
    round: function() {
        this.top = Math.round(this.top);
        this.right = Math.round(this.right);
        this.bottom = Math.round(this.bottom);
        this.left = Math.round(this.left);

        return this;
    },

    /**
     * Check whether this region is equivalent to the given region.
     * @param {Ext.util.Region} region The region to compare with.
     * @return {Boolean}
     */
    equals: function(region) {
        return (this.top == region.top && this.right == region.right && this.bottom == region.bottom && this.left == region.left)
    }
});
