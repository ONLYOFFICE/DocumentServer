//@tag dom,core
//@define Ext.Element-all
//@define Ext.Element-position
//@require Ext.Element-insertion

/**
 * @class Ext.dom.Element
 */
Ext.dom.Element.override({

    /**
     * Gets the current X position of the element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (`display:none` or elements not appended return `false`).
     * @return {Number} The X position of the element
     */
    getX: function(el) {
        return this.getXY(el)[0];
    },

    /**
     * Gets the current Y position of the element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (`display:none` or elements not appended return `false`).
     * @return {Number} The Y position of the element
     */
    getY: function(el) {
        return this.getXY(el)[1];
    },

    /**
     * Gets the current position of the element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (`display:none` or elements not appended return `false`).
     * @return {Array} The XY position of the element
     */

    getXY: function() {
        var rect = this.dom.getBoundingClientRect(),
            round = Math.round;

        return [round(rect.left + window.pageXOffset), round(rect.top + window.pageYOffset)];
    },

    /**
     * Returns the offsets of this element from the passed element. Both element must be part of the DOM tree
     * and not have `display:none` to have page coordinates.
     * @param {Mixed} element The element to get the offsets from.
     * @return {Array} The XY page offsets (e.g. [100, -200])
     */
    getOffsetsTo: function(el) {
        var o = this.getXY(),
            e = Ext.fly(el, '_internal').getXY();
        return [o[0] - e[0], o[1] - e[1]];
    },

    /**
     * Sets the X position of the element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (`display:none` or elements not appended return `false`).
     * @param {Number} The X position of the element
     * @param {Boolean/Object} animate (optional) `true` for the default animation, or a standard Element animation config object.
     * @return {Ext.dom.Element} this
     */
    setX: function(x) {
        return this.setXY([x, this.getY()]);
    },

    /**
     * Sets the Y position of the element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (`display:none` or elements not appended return `false`).
     * @param {Number} The Y position of the element.
     * @param {Boolean/Object} animate (optional) `true` for the default animation, or a standard Element animation config object.
     * @return {Ext.dom.Element} this
     */
    setY: function(y) {
        return this.setXY([this.getX(), y]);
    },

    /**
     * Sets the position of the element in page coordinates, regardless of how the element is positioned.
     * The element must be part of the DOM tree to have page coordinates (`display:none` or elements not appended return `false`).
     * @param {Array} pos Contains X & Y [x, y] values for new position (coordinates are page-based).
     * @param {Boolean/Object} animate (optional) `true` for the default animation, or a standard Element animation config object.
     * @return {Ext.dom.Element} this
     */
    setXY: function(pos) {
        var me = this;

        if (arguments.length > 1) {
            pos = [pos, arguments[1]];
        }

        // me.position();
        var pts = me.translatePoints(pos),
            style = me.dom.style;

        for (pos in pts) {
            if (!pts.hasOwnProperty(pos)) {
                continue;
            }
            if (!isNaN(pts[pos])) style[pos] = pts[pos] + "px";
        }
        return me;
    },

    /**
     * Gets the left X coordinate.
     * @return {Number}
     */
    getLeft: function() {
        return parseInt(this.getStyle('left'), 10) || 0;
    },

    /**
     * Gets the right X coordinate of the element (element X position + element width).
     * @return {Number}
     */
    getRight: function() {
        return parseInt(this.getStyle('right'), 10) || 0;
    },

    /**
     * Gets the top Y coordinate.
     * @return {Number}
     */
    getTop: function() {
        return parseInt(this.getStyle('top'), 10) || 0;
    },

    /**
     * Gets the bottom Y coordinate of the element (element Y position + element height).
     * @return {Number}
     */
    getBottom: function() {
        return parseInt(this.getStyle('bottom'), 10) || 0;
    },

    /**
     * Translates the passed page coordinates into left/top CSS values for this element.
     * @param {Number/Array} x The page `x` or an array containing [x, y].
     * @param {Number} y (optional) The page `y`, required if `x` is not an array.
     * @return {Object} An object with `left` and `top` properties. e.g. `{left: (value), top: (value)}`.
     */
    translatePoints: function(x, y) {
        y = isNaN(x[1]) ? y : x[1];
        x = isNaN(x[0]) ? x : x[0];

        var me = this,
            relative = me.isStyle('position', 'relative'),
            o = me.getXY(),
            l = parseInt(me.getStyle('left'), 10),
            t = parseInt(me.getStyle('top'), 10);

        l = !isNaN(l) ? l : (relative ? 0 : me.dom.offsetLeft);
        t = !isNaN(t) ? t : (relative ? 0 : me.dom.offsetTop);

        return {left: (x - o[0] + l), top: (y - o[1] + t)};
    },

    /**
     * Sets the element's box. Use {@link #getBox} on another element to get a box object.
     * @param {Object} box The box to fill, for example:
     *
     *     {
     *         left: ...,
     *         top: ...,
     *         width: ...,
     *         height: ...
     *     }
     *
     * @return {Ext.dom.Element} this
     */
    setBox: function(box) {
        var me = this,
            width = box.width,
            height = box.height,
            top = box.top,
            left = box.left;

        if (left !== undefined) {
            me.setLeft(left);
        }
        if (top !== undefined) {
            me.setTop(top);
        }
        if (width !== undefined) {
            me.setWidth(width);
        }
        if (height !== undefined) {
            me.setHeight(height);
        }

        return this;
    },

    /**
     * Return an object defining the area of this Element which can be passed to {@link #setBox} to
     * set another Element's size/location to match this element.
     *
     * The returned object may also be addressed as an Array where index 0 contains the X position
     * and index 1 contains the Y position. So the result may also be used for {@link #setXY}.
     *
     * @param {Boolean} contentBox (optional) If `true` a box for the content of the element is returned.
     * @param {Boolean} local (optional) If `true` the element's left and top are returned instead of page x/y.
     * @return {Object} An object in the format
     * @return {Number} return.x The element's X position.
     * @return {Number} return.y The element's Y position.
     * @return {Number} return.width The element's width.
     * @return {Number} return.height The element's height.
     * @return {Number} return.bottom The element's lower bound.
     * @return {Number} return.right The element's rightmost bound.
     */
    getBox: function(contentBox, local) {
        var me = this,
            dom = me.dom,
            width = dom.offsetWidth,
            height = dom.offsetHeight,
            xy, box, l, r, t, b;

        if (!local) {
            xy = me.getXY();
        }
        else if (contentBox) {
            xy = [0, 0];
        }
        else {
            xy = [parseInt(me.getStyle("left"), 10) || 0, parseInt(me.getStyle("top"), 10) || 0];
        }

        if (!contentBox) {
            box = {
                x: xy[0],
                y: xy[1],
                0: xy[0],
                1: xy[1],
                width: width,
                height: height
            };
        }
        else {
            l = me.getBorderWidth.call(me, "l") + me.getPadding.call(me, "l");
            r = me.getBorderWidth.call(me, "r") + me.getPadding.call(me, "r");
            t = me.getBorderWidth.call(me, "t") + me.getPadding.call(me, "t");
            b = me.getBorderWidth.call(me, "b") + me.getPadding.call(me, "b");
            box = {
                x: xy[0] + l,
                y: xy[1] + t,
                0: xy[0] + l,
                1: xy[1] + t,
                width: width - (l + r),
                height: height - (t + b)
            };
        }

        box.left = box.x;
        box.top = box.y;
        box.right = box.x + box.width;
        box.bottom = box.y + box.height;

        return box;
    },

    /**
     * Return an object defining the area of this Element which can be passed to {@link #setBox} to
     * set another Element's size/location to match this element.
     * @param {Boolean} asRegion (optional) If `true` an {@link Ext.util.Region} will be returned.
     * @return {Object} box An object in the format:
     *
     *     {
     *         x: <Element's X position>,
     *         y: <Element's Y position>,
     *         width: <Element's width>,
     *         height: <Element's height>,
     *         bottom: <Element's lower bound>,
     *         right: <Element's rightmost bound>
     *     }
     *
     * The returned object may also be addressed as an Array where index 0 contains the X position
     * and index 1 contains the Y position. So the result may also be used for {@link #setXY}.
     */
    getPageBox: function(getRegion) {
        var me = this,
            el = me.dom,
            w = el.offsetWidth,
            h = el.offsetHeight,
            xy = me.getXY(),
            t = xy[1],
            r = xy[0] + w,
            b = xy[1] + h,
            l = xy[0];

        if (!el) {
            return new Ext.util.Region();
        }

        if (getRegion) {
            return new Ext.util.Region(t, r, b, l);
        }
        else {
            return {
                left: l,
                top: t,
                width: w,
                height: h,
                right: r,
                bottom: b
            };
        }
    }
});
