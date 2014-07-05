/**
 * @class Ext.draw.engine.Canvas
 * @extends Ext.draw.Surface
 *
 * Provides specific methods to draw with 2D Canvas element.
 */
Ext.define('Ext.draw.engine.Canvas', {
    extend: 'Ext.draw.Surface',
    config: {
        /**
         * @cfg {Boolean} highPrecision
         * True to have the canvas use JavaScript Number instead of single precision floating point for transforms.
         *
         * For example, when using huge data to plot line series, the transform matrix of the canvas will have
         * a big element. Due to the implementation of SVGMatrix, the elements are restored by 32-bits floats, which
         * will work incorrectly. To compensate that, we enable the canvas context to perform all the transform by
         * JavaScript. Do not use it if you are not encountering 32-bits floating point errors problem since it will
         * have a performance penalty.
         */
        highPrecision: false
    },
    requires: ['Ext.draw.Animator'],

    statics: {
        contextOverrides: {
            setGradientBBox: function (bbox) {
                this.bbox = bbox;
            },

            /**
             * Fills the subpaths of the current default path or the given path with the current fill style.
             */
            fill: function () {
                var fillStyle = this.fillStyle,
                    fillGradient = this.fillGradient,
                    fillOpacity = this.fillOpacity,
                    rgba = 'rgba(0, 0, 0, 0)',
                    rgba0 = 'rgba(0, 0, 0, 0.0)',
                    bbox = this.bbox,
                    alpha = this.globalAlpha;

                if (fillStyle !== rgba && fillStyle !== rgba0 && fillOpacity !== 0) {
                    if (fillGradient && bbox) {
                        this.fillStyle = fillGradient.getGradient(this, bbox);
                    }

                    if (fillOpacity !== 1) {
                        this.globalAlpha = alpha * fillOpacity;
                    }
                    this.$fill();
                    if (fillOpacity !== 1) {
                        this.globalAlpha = alpha;
                    }

                    if (fillGradient && bbox) {
                        this.fillStyle = fillStyle;
                    }
                }
            },

            /**
             * Strokes the subpaths of the current default path or the given path with the current stroke style.
             */
            stroke: function (transformFillStroke) {
                var strokeStyle = this.strokeStyle,
                    strokeGradient = this.strokeGradient,
                    strokeOpacity = this.strokeOpacity,
                    rgba = 'rgba(0, 0, 0, 0)',
                    rgba0 = 'rgba(0, 0, 0, 0.0)',
                    bbox = this.bbox,
                    alpha = this.globalAlpha;

                if (strokeStyle !== rgba && strokeStyle !== rgba0 && strokeOpacity !== 0) {
                    if (strokeGradient && bbox) {
                        this.strokeStyle = strokeGradient.getGradient(this, bbox);
                    }

                    if (strokeOpacity !== 1) {
                        this.globalAlpha = alpha * strokeOpacity;
                    }
                    this.$stroke();
                    if (strokeOpacity !== 1) {
                        this.globalAlpha = alpha;
                    }

                    if (strokeGradient && bbox) {
                        this.strokeStyle = strokeStyle;
                    }
                }
            },

            fillStroke: function (attr, transformFillStroke) {
                var ctx = this,
                    fillStyle = this.fillStyle,
                    fillOpacity = this.fillOpacity,
                    strokeStyle = this.strokeStyle,
                    strokeOpacity = this.strokeOpacity,
                    shadowColor = ctx.shadowColor,
                    shadowBlur = ctx.shadowBlur,
                    rgba = 'rgba(0, 0, 0, 0)',
                    rgba0 = 'rgba(0, 0, 0, 0.0)';

                if (transformFillStroke === undefined) {
                    transformFillStroke = attr.transformFillStroke;
                }

                if (!transformFillStroke) {
                    attr.inverseMatrix.toContext(ctx);
                }
                if (fillStyle !== rgba && fillStyle !== rgba0 && fillOpacity !== 0) {
                    ctx.fill();
                    ctx.shadowColor = 'rgba(0,0,0,0)';
                    ctx.shadowBlur = 0;
                }
                if (strokeStyle !== rgba && strokeStyle !== rgba0 && strokeOpacity !== 0) {
                    ctx.stroke();
                }
                ctx.shadowColor = shadowColor;
                ctx.shadowBlur = shadowBlur;
            },

            /**
             * Adds points to the subpath such that the arc described by the circumference of the ellipse described by the arguments, starting at the given start angle and ending at the given end angle, going in the given direction (defaulting to clockwise), is added to the path, connected to the previous point by a straight line.
             * @param cx
             * @param cy
             * @param rx
             * @param ry
             * @param rotation
             * @param start
             * @param end
             * @param anticlockwise
             */
            ellipse: function (cx, cy, rx, ry, rotation, start, end, anticlockwise) {
                var cos = Math.cos(rotation),
                    sin = Math.sin(rotation);
                this.transform(cos * rx, sin * rx, -sin * ry, cos * ry, cx, cy);
                this.arc(0, 0, 1, start, end, anticlockwise);
                this.transform(
                    cos / rx, -sin / ry,
                    sin / rx, cos / ry,
                    -(cos * cx + sin * cy) / rx, (sin * cx - cos * cy) / ry);
            },

            /**
             * Uses the given path commands to begin a new path on the canvas.
             * @param path
             */
            appendPath: function (path) {
                var me = this,
                    i = 0, j = 0,
                    types = path.types,
                    coords = path.coords,
                    ln = path.types.length;
                me.beginPath();
                for (; i < ln; i++) {
                    switch (types[i]) {
                        case "M":
                            me.moveTo(coords[j], coords[j + 1]);
                            j += 2;
                            break;
                        case "L":
                            me.lineTo(coords[j], coords[j + 1]);
                            j += 2;
                            break;
                        case "C":
                            me.bezierCurveTo(
                                coords[j], coords[j + 1],
                                coords[j + 2], coords[j + 3],
                                coords[j + 4], coords[j + 5]
                            );
                            j += 6;
                            break;
                        case "Z":
                            me.closePath();
                            break;
                        default:
                    }
                }
            }
        }
    },

    splitThreshold: 1800,

    getElementConfig: function () {
        return {
            reference: 'element',
            style: {
                position: 'absolute'
            },
            children: [
                {
                    reference: 'innerElement',
                    style: {
                        width: '100%',
                        height: '100%',
                        position: 'relative'
                    }
                }
            ]
        };
    },

    /**
     * @private
     *
     * Creates the canvas element.
     */
    createCanvas: function () {
        var canvas = Ext.Element.create({
                tag: 'canvas',
                cls: 'x-surface'
            }), name, overrides = Ext.draw.engine.Canvas.contextOverrides,
            ctx = canvas.dom.getContext('2d'),
            backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                ctx.mozBackingStorePixelRatio ||
                ctx.msBackingStorePixelRatio ||
                ctx.oBackingStorePixelRatio ||
                ctx.backingStorePixelRatio || 1;

        this.devicePixelRatio /= backingStoreRatio;

        if (ctx.ellipse) {
            delete overrides.ellipse;
        }

        for (name in overrides) {
            ctx['$' + name] = ctx[name];
        }
        Ext.apply(ctx, overrides);

        if (this.getHighPrecision()) {
            this.enablePrecisionCompensation(ctx);
        } else {
            this.disablePrecisionCompensation(ctx);
        }

        this.innerElement.appendChild(canvas);
        this.canvases.push(canvas);
        this.contexts.push(ctx);
    },

    /**
     * Initialize the canvas element.
     */
    initElement: function () {
        this.callSuper();
        this.canvases = [];
        this.contexts = [];
        this.createCanvas();
        this.activeCanvases = 0;
    },

    updateHighPrecision: function (pc) {
        var contexts = this.contexts,
            ln = contexts.length,
            i, context;

        for (i = 0; i < ln; i++) {
            context = contexts[i];
            if (pc) {
                this.enablePrecisionCompensation(context);
            } else {
                this.disablePrecisionCompensation(context);
            }
        }
    },

    precisionMethods: {
        rect: false,
        fillRect: false,
        strokeRect: false,
        clearRect: false,
        moveTo: false,
        lineTo: false,
        arc: false,
        arcTo: false,
        save: false,
        restore: false,
        updatePrecisionCompensate: false,
        setTransform: false,
        transform: false,
        scale: false,
        translate: false,
        rotate: false,
        quadraticCurveTo: false,
        bezierCurveTo: false,
        createLinearGradient: false,
        createRadialGradient: false,
        fillText: false,
        strokeText: false,
        drawImage: false
    },

    /**
     * @private
     * Clears canvas of compensation for canvas' use of single precision floating point.
     * @param {CanvasRenderingContext2D} ctx The canvas context.
     */
    disablePrecisionCompensation: function (ctx) {
        var precisionMethods = this.precisionMethods,
            name;

        for (name in precisionMethods) {
            delete ctx[name];
        }

        this.setDirty(true);
    },

    /**
     * @private
     * Compensate for canvas' use of single precision floating point.
     * @param {CanvasRenderingContext2D} ctx The canvas context.
     */
    enablePrecisionCompensation: function (ctx) {
        var surface = this,
            xx = 1, yy = 1,
            dx = 0, dy = 0,
            matrix = new Ext.draw.Matrix(),
            transStack = [],
            comp = {},
            originalCtx = ctx.constructor.prototype;

        var override = {
            /**
             * Adds a new closed subpath to the path, representing the given rectangle.
             * @param x
             * @param y
             * @param w
             * @param h
             * @return {*}
             */
            rect: function (x, y, w, h) {
                return originalCtx.rect.call(this, x * xx + dx, y * yy + dy, w * xx, h * yy);
            },

            /**
             * Paints the given rectangle onto the canvas, using the current fill style.
             * @param x
             * @param y
             * @param w
             * @param h
             */
            fillRect: function (x, y, w, h) {
                this.updatePrecisionCompensateRect();
                originalCtx.fillRect.call(this, x * xx + dx, y * yy + dy, w * xx, h * yy);
                this.updatePrecisionCompensate();
            },

            /**
             * Paints the box that outlines the given rectangle onto the canvas, using the current stroke style.
             * @param x
             * @param y
             * @param w
             * @param h
             */
            strokeRect: function (x, y, w, h) {
                this.updatePrecisionCompensateRect();
                originalCtx.strokeRect.call(this, x * xx + dx, y * yy + dy, w * xx, h * yy);
                this.updatePrecisionCompensate();
            },

            /**
             * Clears all pixels on the canvas in the given rectangle to transparent black.
             * @param x
             * @param y
             * @param w
             * @param h
             */
            clearRect: function (x, y, w, h) {
                return originalCtx.clearRect.call(this, x * xx + dx, y * yy + dy, w * xx, h * yy);
            },

            /**
             * Creates a new subpath with the given point.
             * @param x
             * @param y
             */
            moveTo: function (x, y) {
                return originalCtx.moveTo.call(this, x * xx + dx, y * yy + dy);
            },

            /**
             * Adds the given point to the current subpath, connected to the previous one by a straight line.
             * @param x
             * @param y
             */
            lineTo: function (x, y) {
                return originalCtx.lineTo.call(this, x * xx + dx, y * yy + dy);
            },

            /**
             * Adds points to the subpath such that the arc described by the circumference of the circle described by the arguments, starting at the given start angle and ending at the given end angle, going in the given direction (defaulting to clockwise), is added to the path, connected to the previous point by a straight line.
             * @param x
             * @param y
             * @param radius
             * @param startAngle
             * @param endAngle
             * @param anticlockwise
             */
            arc: function (x, y, radius, startAngle, endAngle, anticlockwise) {
                this.updatePrecisionCompensateRect();
                originalCtx.arc.call(this, x * xx + dx, y * xx + dy, radius * xx, startAngle, endAngle, anticlockwise);
                this.updatePrecisionCompensate();
            },

            /**
             * Adds an arc with the given control points and radius to the current subpath, connected to the previous point by a straight line.
             * If two radii are provided, the first controls the width of the arc's ellipse, and the second controls the height. If only one is provided, or if they are the same, the arc is from a circle.
             * In the case of an ellipse, the rotation argument controls the clockwise inclination of the ellipse relative to the x-axis.
             * @param x1
             * @param y1
             * @param x2
             * @param y2
             * @param radius
             */
            arcTo: function (x1, y1, x2, y2, radius) {
                this.updatePrecisionCompensateRect();
                originalCtx.arcTo.call(this, x1 * xx + dx, y1 * yy + dy, x2 * xx + dx, y2 * yy + dy, radius * xx);
                this.updatePrecisionCompensate();
            },

            /**
             * Pushes the context state to the state stack.
             */
            save: function () {
                transStack.push(matrix);
                matrix = matrix.clone();
                return originalCtx.save.call(this);
            },

            /**
             * Pops the state stack and restores the state.
             */
            restore: function () {
                matrix = transStack.pop();
                originalCtx.restore.call(this);
                this.updatePrecisionCompensate();
            },
            updatePrecisionCompensate: function () {
                matrix.precisionCompensate(surface.devicePixelRatio, comp);
                xx = comp.xx;
                yy = comp.yy;
                dx = comp.dx;
                dy = comp.dy;
                return originalCtx.setTransform.call(this, surface.devicePixelRatio, comp.b, comp.c, comp.d, 0, 0);
            },
            updatePrecisionCompensateRect: function () {
                matrix.precisionCompensateRect(surface.devicePixelRatio, comp);
                xx = comp.xx;
                yy = comp.yy;
                dx = comp.dx;
                dy = comp.dy;
                return originalCtx.setTransform.call(this, surface.devicePixelRatio, comp.b, comp.c, comp.d, 0, 0);
            },

            /**
             * Changes the transformation matrix to the matrix given by the arguments as described below.
             * @param x2x
             * @param x2y
             * @param y2x
             * @param y2y
             * @param newDx
             * @param newDy
             */
            setTransform: function (x2x, x2y, y2x, y2y, newDx, newDy) {
                matrix.set(x2x, x2y, y2x, y2y, newDx, newDy);
                this.updatePrecisionCompensate();
            },

            /**
             * Changes the transformation matrix to apply the matrix given by the arguments as described below.
             * @param x2x
             * @param x2y
             * @param y2x
             * @param y2y
             * @param newDx
             * @param newDy
             */
            transform: function (x2x, x2y, y2x, y2y, newDx, newDy) {
                matrix.append(x2x, x2y, y2x, y2y, newDx, newDy);
                this.updatePrecisionCompensate();
            },

            /**
             * Scales the transformation matrix.
             * @param sx
             * @param sy
             * @return {*}
             */
            scale: function (sx, sy) {
                return this.transform(sx, 0, 0, sy, 0, 0);
            },

            /**
             * Translates the transformation matrix.
             * @param dx
             * @param dy
             * @return {*}
             */
            translate: function (dx, dy) {
                return this.transform(1, 0, 0, 1, dx, dy);
            },

            /**
             * Rotates the transformation matrix.
             * @param radians
             * @return {*}
             */
            rotate: function (radians) {
                var cos = Math.cos(radians),
                    sin = Math.sin(radians);
                return this.transform(cos, sin, -sin, cos, 0, 0);
            },

            /**
             * Adds the given point to the current subpath, connected to the previous one by a quadratic Bézier curve with the given control point.
             * @param cx
             * @param cy
             * @param x
             * @param y
             * @return {*}
             */
            quadraticCurveTo: function (cx, cy, x, y) {
                return originalCtx.quadraticCurveTo.call(this,
                    cx * xx + dx,
                    cy * yy + dy,
                    x * xx + dx,
                    y * yy + dy
                );
            },

            /**
             * Adds the given point to the current subpath, connected to the previous one by a cubic Bézier curve with the given control points.
             * @param c1x
             * @param c1y
             * @param c2x
             * @param c2y
             * @param x
             * @param y
             * @return {*}
             */
            bezierCurveTo: function (c1x, c1y, c2x, c2y, x, y) {
                return originalCtx.bezierCurveTo.call(this,
                    c1x * xx + dx,
                    c1y * yy + dy,
                    c2x * xx + dx,
                    c2y * yy + dy,
                    x * xx + dx,
                    y * yy + dy
                );
            },

            /**
             * Returns an object that represents a linear gradient that paints along the line given by the coordinates represented by the arguments.
             * @param x0
             * @param y0
             * @param x1
             * @param y1
             * @return {*}
             */
            createLinearGradient: function (x0, y0, x1, y1) {
                this.updatePrecisionCompensateRect();
                var grad = originalCtx.createLinearGradient.call(this,
                    x0 * xx + dx,
                    y0 * yy + dy,
                    x1 * xx + dx,
                    y1 * yy + dy
                );
                this.updatePrecisionCompensate();
                return grad;
            },

            /**
             * Returns a CanvasGradient object that represents a radial gradient that paints along the cone given by the circles represented by the arguments.
             * If either of the radii are negative, throws an IndexSizeError exception.
             * @param x0
             * @param y0
             * @param r0
             * @param x1
             * @param y1
             * @param r1
             * @return {*}
             */
            createRadialGradient: function (x0, y0, r0, x1, y1, r1) {
                this.updatePrecisionCompensateRect();
                var grad = originalCtx.createLinearGradient.call(this,
                    x0 * xx + dx,
                    y0 * xx + dy,
                    r0 * xx,
                    x1 * xx + dx,
                    y1 * xx + dy,
                    r1 * xx
                );
                this.updatePrecisionCompensate();
                return grad;
            },

            /**
             * Fills the given text at the given position. If a maximum width is provided, the text will be scaled to fit that width if necessary.
             * @param text
             * @param x
             * @param y
             * @param maxWidth
             */
            fillText: function (text, x, y, maxWidth) {
                originalCtx.setTransform.apply(this, matrix.elements);
                if (typeof maxWidth === 'undefined') {
                    originalCtx.fillText.call(this, text, x, y);
                } else {
                    originalCtx.fillText.call(this, text, x, y, maxWidth);
                }
                this.updatePrecisionCompensate();
            },

            /**
             * Strokes the given text at the given position. If a maximum width is provided, the text will be scaled to fit that width if necessary.
             * @param text
             * @param x
             * @param y
             * @param maxWidth
             */
            strokeText: function (text, x, y, maxWidth) {
                originalCtx.setTransform.apply(this, matrix.elements);
                if (typeof maxWidth === 'undefined') {
                    originalCtx.strokeText.call(this, text, x, y);
                } else {
                    originalCtx.strokeText.call(this, text, x, y, maxWidth);
                }
                this.updatePrecisionCompensate();
            },

            /**
             * Fills the subpaths of the current default path or the given path with the current fill style.
             */
            fill: function () {
                this.updatePrecisionCompensateRect();
                originalCtx.fill.call(this);
                this.updatePrecisionCompensate();
            },

            /**
             * Strokes the subpaths of the current default path or the given path with the current stroke style.
             */
            stroke: function () {
                this.updatePrecisionCompensateRect();
                originalCtx.stroke.call(this);
                this.updatePrecisionCompensate();
            },

            /**
             * Draws the given image onto the canvas.
             * If the first argument isn't an img, canvas, or video element, throws a TypeMismatchError exception. If the image has no image data, throws an InvalidStateError exception. If the one of the source rectangle dimensions is zero, throws an IndexSizeError exception. If the image isn't yet fully decoded, then nothing is drawn.
             * @param img_elem
             * @param arg1
             * @param arg2
             * @param arg3
             * @param arg4
             * @param dst_x
             * @param dst_y
             * @param dw
             * @param dh
             * @return {*}
             */
            drawImage: function (img_elem, arg1, arg2, arg3, arg4, dst_x, dst_y, dw, dh) {
                switch (arguments.length) {
                    case 3:
                        return originalCtx.drawImage.call(this, img_elem, arg1 * xx + dx, arg2 * yy + dy);
                    case 5:
                        return originalCtx.drawImage.call(this, img_elem, arg1 * xx + dx, arg2 * yy + dy, arg3 * xx, arg4 * yy);
                    case 9:
                        return originalCtx.drawImage.call(this, img_elem, arg1, arg2, arg3, arg4, dst_x * xx + dx, dst_y * yy * dy, dw * xx, dh * yy);
                }
            }
        };
        Ext.apply(ctx, override);
        this.setDirty(true);
    },

    updateRegion: function (region) {
        this.callSuper([region]);

        var me = this,
            l = Math.floor(region[0]),
            t = Math.floor(region[1]),
            r = Math.ceil(region[0] + region[2]),
            b = Math.ceil(region[1] + region[3]),
            devicePixelRatio = me.devicePixelRatio,
            w = r - l,
            h = b - t,
            splitThreshold = Math.round(me.splitThreshold / devicePixelRatio),
            splits = Math.ceil(w / splitThreshold),
            activeCanvases = me.activeCanvases,
            i, offsetX, dom, leftWidth;

        for (i = 0, offsetX = 0; i < splits; i++, offsetX += splitThreshold) {
            if (i >= me.canvases.length) {
                me.createCanvas();
            }
            dom = me.canvases[i].dom;
            dom.style.left = offsetX + 'px';
            if (h * devicePixelRatio !== dom.height) {
                dom.height = h * devicePixelRatio;
                dom.style.height = h + 'px';
            }
            leftWidth = Math.min(splitThreshold, w - offsetX);
            if (leftWidth * devicePixelRatio !== dom.width) {
                dom.width = leftWidth * devicePixelRatio;
                dom.style.width = leftWidth + 'px';
            }
            me.applyDefaults(me.contexts[i]);
        }

        for (; i < activeCanvases; i++) {
            dom = me.canvases[i].dom;
            dom.width = 0;
            dom.height = 0;
        }
        me.activeCanvases = splits;
        me.clear();
    },

    /**
     * @inheritdoc
     */
    clearTransform: function () {
        var me = this,
            activeCanvases = me.activeCanvases,
            i, ctx;

        for (i = 0; i < activeCanvases; i++) {
            ctx = me.contexts[i];
            ctx.translate(-me.splitThreshold * i, 0);
            ctx.scale(me.devicePixelRatio, me.devicePixelRatio);
            me.matrix.toContext(ctx);
        }

    },

    /**
     * @private
     * @inheritdoc
     */
    renderSprite: function (sprite) {
        var me = this,
            region = me._region,
            surfaceMatrix = me.matrix,
            parent = sprite._parent,
            matrix = Ext.draw.Matrix.fly([1, 0, 0, 1, 0, 0]),
            bbox, i, offsetX, ctx, width, left = 0, top, right = region[2], bottom;

        while (parent && (parent !== me)) {
            matrix.prependMatrix(parent.matrix || parent.attr && parent.attr.matrix);
            parent = parent.getParent();
        }
        matrix.prependMatrix(surfaceMatrix);
        bbox = sprite.getBBox();
        if (bbox) {
            bbox = matrix.transformBBox(bbox);
        }

        sprite.preRender(me);

        if (sprite.attr.hidden || sprite.attr.globalAlpha === 0) {
            sprite.setDirty(false);
            return;
        }

        top = 0;
        bottom = top + region[3];

        for (i = 0, offsetX = 0; i < me.activeCanvases; i++, offsetX += me.splitThreshold / me.devicePixelRatio) {
            ctx = me.contexts[i];
            width = Math.min(region[2] - offsetX, me.splitThreshold / me.devicePixelRatio);
            left = offsetX;
            right = left + width;

            if (bbox) {
                if (bbox.x > right ||
                    bbox.x + bbox.width < left ||
                    bbox.y > bottom ||
                    bbox.y + bbox.height < top) {
                    continue;
                }
            }

            try {
                ctx.save();
                // Set attributes to context.
                sprite.useAttributes(ctx);
                // Render shape
                if (false === sprite.render(me, ctx, [left, top, width, bottom - top])) {
                    return false;
                }
            } finally {
                ctx.restore();
            }
        }
        sprite.setDirty(false);
    },

    applyDefaults: function (ctx) {
        ctx.strokeStyle = 'rgba(0,0,0,0)';
        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.textAlign = 'start';
        ctx.textBaseline = 'top';
        ctx.miterLimit = 1;
    },

    /**
     * @inheritdoc
     */
    clear: function () {
        var me = this,
            activeCanvases = this.activeCanvases,
            i, canvas, ctx, width, height;
        for (i = 0; i < activeCanvases; i++) {
            canvas = me.canvases[i].dom;
            ctx = me.contexts[i];
            width = canvas.width;
            height = canvas.height;
            if (Ext.os.is.Android && !Ext.os.is.Android4) {
                // TODO: Verify this is the proper check (Chrome)
                // On chrome this is faster:
                //noinspection SillyAssignmentJS
                canvas.width = canvas.width;
                // Fill the gap between surface defaults and canvas defaults
                me.applyDefaults(ctx);
            } else {
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, width, height);
            }
        }
        me.setDirty(true);
    },

    /**
     * Destroys the Canvas element and prepares it for Garbage Collection.
     */
    destroy: function () {
        var me = this,
            i, ln = me.canvases.length;
        for (i = 0; i < ln; i++) {
            me.contexts[i] = null;
            me.canvases[i].destroy();
            me.canvases[i] = null;
        }
        delete me.contexts;
        delete me.canvases;
        me.callSuper(arguments);
    }
}, function () {
    if (Ext.os.is.Android4 && Ext.browser.is.Chrome) {
        this.prototype.splitThreshold = 3000;
    } else if (Ext.os.is.Android) {
        this.prototype.splitThreshold = 1e10;
    }
});