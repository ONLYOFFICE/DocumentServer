/**
 * @class Ext.draw.sprite.Path
 * @extends Ext.draw.sprite.Sprite
 *
 * A sprite that represents a path.
 *
 *     @example preview miniphone
 *     var component = new Ext.draw.Component({
 *       items: [{
 *         type: 'path',
 *         path: 'M75,75 c0,-25 50,25 50,0 c0,-25 -50,25 -50,0',
 *         fillStyle: 'blue'
 *       }]
 *     });
 *     Ext.Viewport.setLayout('fit');
 *     Ext.Viewport.add(component);
 */
Ext.define("Ext.draw.sprite.Path", {
    extend: "Ext.draw.sprite.Sprite",
    requires: ['Ext.draw.Draw', 'Ext.draw.Path'],
    alias: 'sprite.path',
    type: 'path',
    inheritableStatics: {
        def: {
            processors: {
                /**
                 * @cfg {String} path The SVG based path string used by the sprite.
                 */
                path: function (n, o) {
                    if (!(n instanceof Ext.draw.Path)) {
                        n = new Ext.draw.Path(n);
                    }
                    return n;
                }
            },
            aliases: {
                "d": "path"
            },
            dirtyTriggers: {
                path: 'bbox'
            },
            updaters: {
                "path": function (attr) {
                    var path = attr.path;
                    if (!path || path.bindAttr !== attr) {
                        path = new Ext.draw.Path();
                        path.bindAttr = attr;
                        attr.path = path;
                    }
                    path.clear();
                    this.updatePath(path, attr);
                    attr.dirtyFlags.bbox = ['path'];
                }
            }
        }
    },

    updatePlainBBox: function (plain) {
        if (this.attr.path) {
            this.attr.path.getDimension(plain);
        }
    },

    updateTransformedBBox: function (transform) {
        if (this.attr.path) {
            this.attr.path.getDimensionWithTransform(this.attr.matrix, transform);
        }
    },

    render: function (surface, ctx) {
        var mat = this.attr.matrix,
            attr = this.attr;
        if (!attr.path || attr.path.coords.length === 0) {
            return;
        }
        mat.toContext(ctx);
        ctx.appendPath(attr.path);
        ctx.fillStroke(attr);
    },

    /**
     * Update the path.
     * @param {Ext.draw.Path} path An empty path to draw on using path API.
     * @param {Object} attr The attribute object. Note: DO NOT use the `sprite.attr` instead of this
     * if you want to work with instancing.
     */
    updatePath: function (path, attr) {}
});