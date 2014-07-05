/**
 * @class Ext.chart.label.Callout
 * @extends Ext.draw.modifier.Modifier
 * 
 * This is a modifier to place labels and callouts by additional attributes.
 */
Ext.define("Ext.chart.label.Callout", {
    extend: 'Ext.draw.modifier.Modifier',

    prepareAttributes: function (attr) {
        if (!attr.hasOwnProperty('calloutOriginal')) {
            attr.calloutOriginal = Ext.Object.chain(attr);
        }
        if (this._previous) {
            this._previous.prepareAttributes(attr.calloutOriginal);
        }
    },

    setAttrs: function (attr, changes) {
        var callout = attr.callout,
            origin = attr.calloutOriginal,
            bbox = attr.bbox.plain,
            width = (bbox.width || 0) + attr.labelOverflowPadding,
            height = (bbox.height || 0) + attr.labelOverflowPadding,
            dx, dy, r;

        if ('callout' in changes) {
            callout = changes.callout;
        }

        if ('callout' in changes || 'calloutPlaceX' in changes || 'calloutPlaceY' in changes || 'x' in changes || 'y' in changes) {
            var rotationRads = 'rotationRads' in changes ? origin.rotationRads = changes.rotationRads : origin.rotationRads,
                x = 'x' in changes ? (origin.x = changes.x) : origin.x,
                y = 'y' in changes ? (origin.y = changes.y) : origin.y,
                calloutPlaceX = 'calloutPlaceX' in changes ? changes.calloutPlaceX : attr.calloutPlaceX,
                calloutPlaceY = 'calloutPlaceY' in changes ? changes.calloutPlaceY : attr.calloutPlaceY,
                calloutVertical = 'calloutVertical' in changes ? changes.calloutVertical : attr.calloutVertical,
                temp;

            // Normalize Rotations
            rotationRads %= Math.PI * 2;
            if (Math.cos(rotationRads) < 0) {
                rotationRads = (rotationRads + Math.PI) % (Math.PI * 2);
            }

            if (rotationRads > Math.PI) {
                rotationRads -= Math.PI * 2;
            }

            if (calloutVertical) {
                rotationRads = rotationRads * (1 - callout) + Math.PI / 2 * callout;
                temp = width;
                width = height;
                height = temp;
            } else {
                rotationRads = rotationRads * (1 - callout);
            }
            changes.rotationRads = rotationRads;


            // Placing label.
            changes.x = x * (1 - callout) + calloutPlaceX * callout;
            changes.y = y * (1 - callout) + calloutPlaceY * callout;


            // Placing the end of the callout line.
            dx = calloutPlaceX - x;
            dy = calloutPlaceY - y;
            if (Math.abs(dy * width) > Math.abs(height * dx)) {
                // on top/bottom
                if (dy > 0) {
                    changes.calloutEndX = changes.x - (height / (dy * 2) * dx) * callout;
                    changes.calloutEndY = changes.y - height / 2 * callout;
                } else {
                    changes.calloutEndX = changes.x + (height / (dy * 2) * dx) * callout;
                    changes.calloutEndY = changes.y + height / 2 * callout;
                }
            } else {
                // on left/right
                if (dx > 0) {
                    changes.calloutEndX = changes.x - width / 2;
                    changes.calloutEndY = changes.y - (width / (dx * 2) * dy) * callout;
                } else {
                    changes.calloutEndX = changes.x + width / 2;
                    changes.calloutEndY = changes.y + (width / (dx * 2) * dy) * callout;
                }
            }
        }

        return changes;
    },

    pushDown: function (attr, changes) {
        changes = Ext.draw.modifier.Modifier.prototype.pushDown.call(this, attr.calloutOriginal, changes);
        return this.setAttrs(attr, changes);
    },

    popUp: function (attr, changes) {
        attr = attr.__proto__;
        changes = this.setAttrs(attr, changes);
        if (this._next) {
            return this._next.popUp(attr, changes);
        } else {
            return Ext.apply(attr, changes);
        }
    }
});