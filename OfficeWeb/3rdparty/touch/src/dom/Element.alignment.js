//@tag dom,core
//@define Ext.Element-all
//@define Ext.Element-alignment
//@require Ext.Element-static

/**
 * @class Ext.dom.Element
 */
//<deprecated product=touch since=2.0>
Ext.dom.Element.addMembers({
    /**
     * Gets the x,y coordinates specified by the anchor position on the element.
     *
     * @deprecated 2.0.0 This method is no longer available for Ext.Element. Please see {@link Ext.Component#showBy}
     * to do anchoring at Component level instead.
     *
     * @param {String} [anchor=c] (optional) The specified anchor position.
     * @param {Boolean} local (optional) `true` to get the local (element top/left-relative) anchor position instead
     * of page coordinates.
     * @param {Object} size (optional) An object containing the size to use for calculating anchor position.
     * `{width: (target width), height: (target height)}` (defaults to the element's current size)
     * @return {Array} [x, y] An array containing the element's x and y coordinates.
     */
    getAnchorXY: function(anchor, local, size) {
        //<debug warn>
        Ext.Logger.deprecate("getAnchorXY() is no longer available for Ext.Element. Please see Ext.Component#showBy() " +
            "to do anchoring at Component level instead", this);
        //</debug>

        //Passing a different size is useful for pre-calculating anchors,
        //especially for anchored animations that change the el size.
        anchor = (anchor || "tl").toLowerCase();
        size = size || {};

        var me = this,
            vp = me.dom == document.body || me.dom == document,
            width = size.width || vp ? window.innerWidth: me.getWidth(),
            height = size.height || vp ? window.innerHeight: me.getHeight(),
            xy,
            rnd = Math.round,
            myXY = me.getXY(),
            extraX = vp ? 0: !local ? myXY[0] : 0,
            extraY = vp ? 0: !local ? myXY[1] : 0,
            hash = {
                c: [rnd(width * 0.5), rnd(height * 0.5)],
                t: [rnd(width * 0.5), 0],
                l: [0, rnd(height * 0.5)],
                r: [width, rnd(height * 0.5)],
                b: [rnd(width * 0.5), height],
                tl: [0, 0],
                bl: [0, height],
                br: [width, height],
                tr: [width, 0]
            };

        xy = hash[anchor];
        return [xy[0] + extraX, xy[1] + extraY];
    },

    alignToRe: /^([a-z]+)-([a-z]+)(\?)?$/,

    /**
     * Gets the x,y coordinates to align this element with another element.
     * @param {Mixed} element The element to align to.
     * @param {String} [position=tl-bl] (optional) The position to align to.
     * @param {Array} offsets (optional) Offset the positioning by [x, y].
     * @return {Array} [x, y]
     */
    getAlignToXY: function(el, position, offsets, local) {
        //<debug warn>
        Ext.Logger.deprecate("getAlignToXY() is no longer available for Ext.Element. Please see Ext.Component#showBy() " +
            "to do anchoring at Component level instead", this);
        //</debug>

        local = !!local;
        el = Ext.get(el);

        //<debug>
        if (!el || !el.dom) {
            throw new Error("Element.alignToXY with an element that doesn't exist");
        }
        //</debug>
        offsets = offsets || [0, 0];

        if (!position || position == '?') {
            position = 'tl-bl?';
        }
        else if (! (/-/).test(position) && position !== "") {
            position = 'tl-' + position;
        }
        position = position.toLowerCase();

        var me = this,
            matches = position.match(this.alignToRe),
            dw = window.innerWidth,
            dh = window.innerHeight,
            p1 = "",
            p2 = "",
            a1,
            a2,
            x,
            y,
            swapX,
            swapY,
            p1x,
            p1y,
            p2x,
            p2y,
            width,
            height,
            region,
            constrain;

        if (!matches) {
            throw "Element.alignTo with an invalid alignment " + position;
        }

        p1 = matches[1];
        p2 = matches[2];
        constrain = !!matches[3];

        //Subtract the aligned el's internal xy from the target's offset xy
        //plus custom offset to get the aligned el's new offset xy
        a1 = me.getAnchorXY(p1, true);
        a2 = el.getAnchorXY(p2, local);

        x = a2[0] - a1[0] + offsets[0];
        y = a2[1] - a1[1] + offsets[1];

        if (constrain) {
            width = me.getWidth();
            height = me.getHeight();

            region = el.getPageBox();

            //If we are at a viewport boundary and the aligned el is anchored on a target border that is
            //perpendicular to the vp border, allow the aligned el to slide on that border,
            //otherwise swap the aligned el to the opposite border of the target.
            p1y = p1.charAt(0);
            p1x = p1.charAt(p1.length - 1);
            p2y = p2.charAt(0);
            p2x = p2.charAt(p2.length - 1);

            swapY = ((p1y == "t" && p2y == "b") || (p1y == "b" && p2y == "t"));
            swapX = ((p1x == "r" && p2x == "l") || (p1x == "l" && p2x == "r"));

            if (x + width > dw) {
                x = swapX ? region.left - width: dw - width;
            }
            if (x < 0) {
                x = swapX ? region.right: 0;
            }
            if (y + height > dh) {
                y = swapY ? region.top - height: dh - height;
            }
            if (y < 0) {
                y = swapY ? region.bottom: 0;
            }
        }

        return [x, y];
    },

    // @private
    getAnchor: function(){
        var dom = this.dom;
            if (!dom) {
                return;
            }
            var anchor = this.self.data.call(this.self, dom, '_anchor');

        if(!anchor){
            anchor = this.self.data.call(this.self, dom, '_anchor', {});
        }
        return anchor;
    },

    // @private
    // used outside of core
    adjustForConstraints: function(xy, parent) {
        var vector = this.getConstrainVector(parent, xy);
        if (vector) {
            xy[0] += vector[0];
            xy[1] += vector[1];
        }
        return xy;
    }

});
//</deprecated>
