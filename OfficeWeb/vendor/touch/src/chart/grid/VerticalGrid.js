/**
 * @class Ext.chart.grid.VerticalGrid
 * @extends Ext.draw.sprite.Sprite
 * 
 * Vertical Grid sprite. Used in Cartesian Charts.
 */
Ext.define("Ext.chart.grid.VerticalGrid", {
    extend: 'Ext.draw.sprite.Sprite',
    alias: 'grid.vertical',

    inheritableStatics: {
        def: {
            processors: {
                x: 'number',
                y: 'number',
                width: 'number',
                height: 'number'
            },

            defaults: {
                x: 0,
                y: 0,
                width: 1,
                height: 1,
                strokeStyle: '#DDD'
            }
        }
    },

    render: function (surface, ctx, clipRegion) {
        var attr = this.attr,
            x = surface.roundPixel(attr.x),
            halfLineWidth = ctx.lineWidth * 0.5;
        ctx.beginPath();
        ctx.rect(x - halfLineWidth, clipRegion[1] - surface.matrix.getDY(), attr.width, clipRegion[3]);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x - halfLineWidth, clipRegion[1] - surface.matrix.getDY());
        ctx.lineTo(x - halfLineWidth, clipRegion[1] + clipRegion[3] - surface.matrix.getDY());
        ctx.stroke();
    }
});