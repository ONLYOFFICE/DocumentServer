/**
 * @class Ext.chart.label.Label
 * @extends Ext.draw.sprite.Text
 * 
 * Sprite used to represent labels in series.
 */
Ext.define("Ext.chart.label.Label", {
    extend: "Ext.draw.sprite.Text",
    requires: ['Ext.chart.label.Callout'],

    inheritableStatics: {
        def: {
            processors: {
                callout: 'limited01',
                calloutPlaceX: 'number',
                calloutPlaceY: 'number',
                calloutStartX: 'number',
                calloutStartY: 'number',
                calloutEndX: 'number',
                calloutEndY: 'number',
                calloutColor: 'color',
                calloutVertical: 'bool',
                labelOverflowPadding: 'number'
            },
            defaults: {
                callout: 0,
                calloutPlaceX: 0,
                calloutPlaceY: 0,
                calloutStartX: 0,
                calloutStartY: 0,
                calloutEndX: 0,
                calloutEndY: 0,
                calloutVertical: false,
                calloutColor: 'black',
                labelOverflowPadding: 5
            },

            dirtyTriggers: {
                callout: 'transform',
                calloutPlaceX: 'transform',
                calloutPlaceY: 'transform',
                labelOverflowPadding: 'transform',
                calloutRotation: 'transform'
            }
        }
    },

    config: {
        /**
         * @cfg {Object} fx Animation configuration.
         */
        fx: {
            customDuration: {
                callout: 200
            }
        }
    },

    prepareModifiers: function () {
        this.callSuper(arguments);
        this.calloutModifier = new Ext.chart.label.Callout({sprite: this});
        this.fx.setNext(this.calloutModifier);
        this.calloutModifier.setNext(this.topModifier);
    },

    render: function (surface, ctx, clipRegion) {
        var me = this,
            attr = me.attr;
        ctx.save();
        ctx.globalAlpha *= Math.max(0, attr.callout - 0.5) * 2;
        if (ctx.globalAlpha > 0) {
            ctx.strokeStyle = attr.calloutColor;
            ctx.fillStyle = attr.calloutColor;
            ctx.beginPath();
            ctx.moveTo(me.attr.calloutStartX, me.attr.calloutStartY);
            ctx.lineTo(me.attr.calloutEndX, me.attr.calloutEndY);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(me.attr.calloutStartX, me.attr.calloutStartY, 1, 0, 2 * Math.PI, true);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(me.attr.calloutEndX, me.attr.calloutEndY, 1, 0, 2 * Math.PI, true);
            ctx.fill();
        }
        ctx.restore();

        Ext.draw.sprite.Text.prototype.render.apply(this, arguments);
    }
});