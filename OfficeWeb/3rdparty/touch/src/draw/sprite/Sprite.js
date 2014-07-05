/**
 * A Sprite is an object rendered in a Drawing surface. There are different options and types of sprites.
 * The configuration of a Sprite is an object with the following properties:
 *
 * Additionally there are three transform objects that can be set with `setAttributes` which are `translate`, `rotate` and
 * `scale`.
 *
 * For translate, the configuration object contains `x` and `y` attributes that indicate where to
 * translate the object. For example:
 *
 *     sprite.setAttributes({
 *       translate: {
 *        x: 10,
 *        y: 10
 *       }
 *     }, true);
 *
 * For rotation, the configuration object contains `x` and `y` attributes for the center of the rotation (which are optional),
 * and a `degrees` attribute that specifies the rotation in degrees. For example:
 *
 *     sprite.setAttributes({
 *       rotate: {
 *        degrees: 90
 *       }
 *     }, true);
 *
 * For scaling, the configuration object contains `x` and `y` attributes for the x-axis and y-axis scaling. For example:
 *
 *     sprite.setAttributes({
 *       scale: {
 *        x: 10,
 *        y: 3
 *       }
 *     }, true);
 *
 * Sprites can be created with a reference to a {@link Ext.draw.Surface}
 *
 *      var drawComponent = Ext.create('Ext.draw.Component', {
 *          // ...
 *      });
 *
 *      var sprite = Ext.create('Ext.draw.sprite.Sprite', {
 *          type: 'circle',
 *          fill: '#ff0',
 *          surface: drawComponent.surface,
 *          radius: 5
 *      });
 *
 * Sprites can also be added to the surface as a configuration object:
 *
 *      var sprite = drawComponent.surface.add({
 *          type: 'circle',
 *          fill: '#ff0',
 *          radius: 5
 *      });
 *
 * In order to properly apply properties and render the sprite we have to
 * `show` the sprite setting the option `redraw` to `true`:
 *
 *      sprite.show(true);
 *
 * The constructor configuration object of the Sprite can also be used and passed into the {@link Ext.draw.Surface}
 * `add` method to append a new sprite to the canvas. For example:
 *
 *     drawComponent.surface.add({
 *         type: 'circle',
 *         fill: '#ffc',
 *         radius: 100,
 *         x: 100,
 *         y: 100
 *     });
 */
Ext.define('Ext.draw.sprite.Sprite', {
    alias: 'sprite.sprite',

    mixins: {
        observable: 'Ext.mixin.Observable'
    },

    requires: [
        'Ext.draw.Draw',
        'Ext.draw.gradient.Gradient',
        'Ext.draw.sprite.AttributeDefinition',
        'Ext.draw.sprite.AttributeParser',
        'Ext.draw.modifier.Target',
        'Ext.draw.modifier.Animation',
        'Ext.draw.modifier.Highlight'
    ],

    isSprite: true,

    inheritableStatics: {
        def: {
            processors: {
                /**
                 * @cfg {String} [strokeStyle="none"] The color of the stroke (a CSS color value).
                 */
                strokeStyle: "color",

                /**
                 * @cfg {String} [fillStyle="none"] The color of the shadow (a CSS color value).
                 */
                fillStyle: "color",

                /**
                 * @cfg {Number} [strokeOpacity=1] The opacity of the stroke. Limited from 0 to 1.
                 */
                strokeOpacity: "limited01",

                /**
                 * @cfg {Number} [fillOpacity=1] The opacity of the fill. Limited from 0 to 1.
                 */
                fillOpacity: "limited01",

                /**
                 * @cfg {Number} [lineWidth=1] The width of the line stroke.
                 */
                lineWidth: "number",

                /**
                 * @cfg {String} [lineCap="butt"] The style of the line caps.
                 */
                lineCap: "enums(butt,round,square)",

                /**
                 * @cfg {String} [lineJoin="miter"] The style of the line join.
                 */
                lineJoin: "enums(round,bevel,miter)",

                /**
                 * @cfg {Number} [miterLimit=1] Sets the distance between the inner corner and the outer corner where two lines meet.
                 */
                miterLimit: "number",

                /**
                 * @cfg {String} [shadowColor="none"] The color of the shadow (a CSS color value).
                 */
                shadowColor: "color",

                /**
                 * @cfg {Number} [shadowOffsetX=0] The offset of the sprite's shadow on the x-axis.
                 */
                shadowOffsetX: "number",

                /**
                 * @cfg {Number} [shadowOffsetY=0] The offset of the sprite's shadow on the y-axis.
                 */
                shadowOffsetY: "number",

                /**
                 * @cfg {Number} [shadowBlur=0] The amount blur used on the shadow.
                 */
                shadowBlur: "number",

                /**
                 * @cfg {Number} [globalAlpha=1] The opacity of the sprite. Limited from 0 to 1.
                 */
                globalAlpha: "limited01",
                globalCompositeOperation: "enums(source-over,destination-over,source-in,destination-in,source-out,destination-out,source-atop,destination-atop,lighter,xor,copy)",

                /**
                 * @cfg {Boolean} [hidden=false] Determines whether or not the sprite is hidden.
                 */
                hidden: "bool",

                /**
                 * @cfg {Boolean} [transformFillStroke=false] Determines whether the fill and stroke are affected by sprite transformations.
                 */
                transformFillStroke: "bool",

                /**
                 * @cfg {Number} [zIndex=0] The stacking order of the sprite.
                 */
                zIndex: "number",

                /**
                 * @cfg {Number} [translationX=0] The translation of the sprite on the x-axis.
                 */
                translationX: "number",

                /**
                 * @cfg {Number} [translationY=0] The translation of the sprite on the y-axis.
                 */
                translationY: "number",

                /**
                 * @cfg {Number} [rotationRads=0] The degree of rotation of the sprite.
                 */
                rotationRads: "number",

                /**
                 * @cfg {Number} [rotationCenterX=null] The central coordinate of the sprite's scale operation on the x-axis.
                 */
                rotationCenterX: "number",

                /**
                 * @cfg {Number} [rotationCenterY=null] The central coordinate of the sprite's rotate operation on the y-axis.
                 */
                rotationCenterY: "number",

                /**
                 * @cfg {Number} [scalingX=1] The scaling of the sprite on the x-axis.
                 */
                scalingX: "number",

                /**
                 * @cfg {Number} [scalingY=1] The scaling of the sprite on the y-axis.
                 */
                scalingY: "number",

                /**
                 * @cfg {Number} [scalingCenterX=null] The central coordinate of the sprite's scale operation on the x-axis.
                 */
                scalingCenterX: "number",

                /**
                 * @cfg {Number} [scalingCenterY=null] The central coordinate of the sprite's scale operation on the y-axis.
                 */
                scalingCenterY: "number"
            },

            aliases: {
                "stroke": "strokeStyle",
                "fill": "fillStyle",
                "color": "fillStyle",
                "stroke-width": "lineWidth",
                "stroke-linecap": "lineCap",
                "stroke-linejoin": "lineJoin",
                "stroke-miterlimit": "miterLimit",
                "text-anchor": "textAlign",
                "opacity": "globalAlpha",

                translateX: "translationX",
                translateY: "translationY",
                rotateRads: "rotationRads",
                rotateCenterX: "rotationCenterX",
                rotateCenterY: "rotationCenterY",
                scaleX: "scalingX",
                scaleY: "scalingY",
                scaleCenterX: "scalingCenterX",
                scaleCenterY: "scalingCenterY"
            },

            defaults: {
                hidden: false,
                zIndex: 0,

                strokeStyle: "none",
                fillStyle: "none",
                lineWidth: 1,
                lineCap: "butt",
                lineJoin: "miter",
                miterLimit: 1,

                shadowColor: "none",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 0,

                globalAlpha: 1,
                strokeOpacity: 1,
                fillOpacity: 1,
                transformFillStroke: false,

                translationX: 0,
                translationY: 0,
                rotationRads: 0,
                rotationCenterX: null,
                rotationCenterY: null,
                scalingX: 1,
                scalingY: 1,
                scalingCenterX: null,
                scalingCenterY: null
            },

            dirtyTriggers: {
                hidden: "canvas",
                zIndex: "zIndex",

                globalAlpha: "canvas",
                globalCompositeOperation: "canvas",

                transformFillStroke: "canvas",
                strokeStyle: "canvas",
                fillStyle: "canvas",
                strokeOpacity: "canvas",
                fillOpacity: "canvas",

                lineWidth: "canvas",
                lineCap: "canvas",
                lineJoin: "canvas",
                miterLimit: "canvas",

                shadowColor: "canvas",
                shadowOffsetX: "canvas",
                shadowOffsetY: "canvas",
                shadowBlur: "canvas",

                translationX: "transform",
                translationY: "transform",
                rotationRads: "transform",
                rotationCenterX: "transform",
                rotationCenterY: "transform",
                scalingX: "transform",
                scalingY: "transform",
                scalingCenterX: "transform",
                scalingCenterY: "transform"
            },

            updaters: {
                "bbox": function (attrs) {
                    attrs.bbox.plain.dirty = true;
                    attrs.bbox.transform.dirty = true;
                    if (
                        attrs.rotationRads !== 0 && (attrs.rotationCenterX === null || attrs.rotationCenterY === null) ||
                            ((attrs.scalingX !== 1 || attrs.scalingY !== 1) &&
                                (attrs.scalingCenterX === null || attrs.scalingCenterY === null)
                                )
                        ) {
                        if (!attrs.dirtyFlags.transform) {
                            attrs.dirtyFlags.transform = [];
                        }
                    }
                },

                "zIndex": function (attrs) {
                    attrs.dirtyZIndex = true;
                },

                "transform": function (attrs) {
                    attrs.dirtyTransform = true;
                    attrs.bbox.transform.dirty = true;
                }
            }
        }
    },

    config: {
        parent: null
    },

    onClassExtended: function (Class, member) {
        var initCfg = Class.superclass.self.def.initialConfig,
            cfg;

        if (member.inheritableStatics && member.inheritableStatics.def) {
            cfg = Ext.merge({}, initCfg, member.inheritableStatics.def);
            Class.def = Ext.create("Ext.draw.sprite.AttributeDefinition", cfg);
            delete member.inheritableStatics.def;
        } else {
            Class.def = Ext.create("Ext.draw.sprite.AttributeDefinition", initCfg);
        }
    },

    constructor: function (config) {
        if (this.$className === 'Ext.draw.sprite.Sprite') {
            throw 'Ext.draw.sprite.Sprite is an abstract class';
        }
        config = config || {};
        var me = this,
            groups = [].concat(config.group || []),
            i, ln;

        me.id = config.id || Ext.id(null, 'ext-sprite-');
        me.group = new Array(groups.length);

        for (i = 0, ln = groups.length; i < ln; i++) {
            me.group[i] = groups[i].id || groups[i].toString();
        }

        me.attr = {};
        me.initConfig(config);
        var modifiers = Ext.Array.from(config.modifiers, true);
        me.prepareModifiers(modifiers);
        me.initializeAttributes();
        me.setAttributes(me.self.def.getDefaults(), true);
        me.setAttributes(config);
    },

    getDirty: function () {
        return this.attr.dirty;
    },

    setDirty: function (dirty) {
        if ((this.attr.dirty = dirty)) {
            if (this._parent) {
                this._parent.setDirty(true);
            }
        }
    },

    addModifier: function (modifier, reinitializeAttributes) {
        var me = this;
        if (!(modifier instanceof Ext.draw.modifier.Modifier)) {
            modifier = Ext.factory(modifier, null, null, 'modifier');
        }
        modifier.setSprite(this);
        if (modifier.preFx || modifier.config && modifier.config.preFx) {
            if (me.fx.getPrevious()) {
                me.fx.getPrevious().setNext(modifier);
            }
            modifier.setNext(me.fx);
        } else {
            me.topModifier.getPrevious().setNext(modifier);
            modifier.setNext(me.topModifier);
        }
        if (reinitializeAttributes) {
            me.initializeAttributes();
        }
        return modifier;
    },

    prepareModifiers: function (additionalModifiers) {
        // Set defaults
        var me = this,
            modifier, i, ln;

        me.topModifier = new Ext.draw.modifier.Target({sprite: me});

        // Link modifiers
        me.fx = new Ext.draw.modifier.Animation({sprite: me});
        me.fx.setNext(me.topModifier);

        for (i = 0, ln = additionalModifiers.length; i < ln; i++) {
            me.addModifier(additionalModifiers[i], false);
        }
    },

    initializeAttributes: function () {
        var me = this;
        me.topModifier.prepareAttributes(me.attr);
    },

    updateDirtyFlags: function (attrs) {
        var me = this,
            dirtyFlags = attrs.dirtyFlags, flags,
            updaters = me.self.def._updaters,
            any = false,
            dirty = false,
            flag;

        do {
            any = false;
            for (flag in dirtyFlags) {
                me.updateDirtyFlags = Ext.emptyFn;
                flags = dirtyFlags[flag];
                delete dirtyFlags[flag];
                if (updaters[flag]) {
                    updaters[flag].call(me, attrs, flags);
                }
                any = true;
                delete me.updateDirtyFlags;
            }
            dirty = dirty || any;
        } while (any);

        if (dirty) {
            me.setDirty(true);
        }
    },

    /**
     * Set attributes of the sprite.
     *
     * @param {Object} changes The content of the change.
     * @param {Boolean} [bypassNormalization] `true` to avoid normalization of the given changes.
     * @param {Boolean} [avoidCopy] `true` to avoid copying the `changes` object.
     * The content of object may be destroyed.
     */
    setAttributes: function (changes, bypassNormalization, avoidCopy) {
        var attributes = this.attr;
        if (bypassNormalization) {
            if (avoidCopy) {
                this.topModifier.pushDown(attributes, changes);
            } else {
                this.topModifier.pushDown(attributes, Ext.apply({}, changes));
            }
        } else {
            this.topModifier.pushDown(attributes, this.self.def.normalize(changes));
        }
    },

    /**
     * Set attributes of the sprite, assuming the names and values have already been
     * normalized.
     *
     * @deprecated Use setAttributes directy with bypassNormalization argument being `true`.
     * @param {Object} changes The content of the change.
     * @param {Boolean} [avoidCopy] `true` to avoid copying the `changes` object.
     * The content of object may be destroyed.
     */
    setAttributesBypassingNormalization: function (changes, avoidCopy) {
        return this.setAttributes(changes, true, avoidCopy);
    },

    /**
     * Returns the bounding box for the given Sprite as calculated with the Canvas engine.
     *
     * @param {Boolean} [isWithoutTransform] Whether to calculate the bounding box with the current transforms or not.
     */
    getBBox: function (isWithoutTransform) {
        var me = this,
            attr = me.attr,
            bbox = attr.bbox,
            plain = bbox.plain,
            transform = bbox.transform;
        if (plain.dirty) {
            me.updatePlainBBox(plain);
            plain.dirty = false;
        }
        if (isWithoutTransform) {
            return plain;
        } else {
            me.applyTransformations();
            if (transform.dirty) {
                me.updateTransformedBBox(transform, plain);
                transform.dirty = false;
            }
            return transform;
        }
    },

    /**
     * @protected
     * @function
     * Subclass will fill the plain object with `x`, `y`, `width`, `height` information of the plain bounding box of
     * this sprite.
     *
     * @param {Object} plain Target object.
     */
    updatePlainBBox: Ext.emptyFn,

    /**
     * @protected
     * Subclass will fill the plain object with `x`, `y`, `width`, `height` information of the transformed
     * bounding box of this sprite.
     *
     * @param {Object} transform Target object.
     * @param {Object} plain Auxilary object providing information of plain object.
     */
    updateTransformedBBox: function (transform, plain) {
        this.attr.matrix.transformBBox(plain, 0, transform);
    },

    /**
     * Subclass can rewrite this function to gain better performance.
     * @param {Boolean} isWithoutTransform
     * @return {Array}
     */
    getBBoxCenter: function (isWithoutTransform) {
        var bbox = this.getBBox(isWithoutTransform);
        if (bbox) {
            return [
                bbox.x + bbox.width * 0.5,
                bbox.y + bbox.height * 0.5
            ];
        } else {
            return [0, 0];
        }
    },

    /**
     * Hide the sprite.
     * @return {Ext.draw.sprite.Sprite} this
     * @chainable
     */
    hide: function () {
        this.attr.hidden = true;
        this.setDirty(true);
        return this;
    },

    /**
     * Show the sprite.
     * @return {Ext.draw.sprite.Sprite} this
     * @chainable
     */
    show: function () {
        this.attr.hidden = false;
        this.setDirty(true);
        return this;
    },

    useAttributes: function (ctx) {
        this.applyTransformations();
        var attrs = this.attr,
            canvasAttributes = attrs.canvasAttributes,
            strokeStyle = canvasAttributes.strokeStyle,
            fillStyle = canvasAttributes.fillStyle,
            id;

        if (strokeStyle) {
            if (strokeStyle.isGradient) {
                ctx.strokeStyle = 'black';
                ctx.strokeGradient = strokeStyle;
            } else {
                ctx.strokeGradient = false;
            }
        }

        if (fillStyle) {
            if (fillStyle.isGradient) {
                ctx.fillStyle = 'black';
                ctx.fillGradient = fillStyle;
            } else {
                ctx.fillGradient = false;
            }
        }

        for (id in canvasAttributes) {
            if (canvasAttributes[id] !== undefined && canvasAttributes[id] !== ctx[id]) {
                ctx[id] = canvasAttributes[id];
            }
        }

        ctx.setGradientBBox(this.getBBox(this.attr.transformFillStroke));
    },

    // @private
    applyTransformations: function (force) {
        if (!force && !this.attr.dirtyTransform) {
            return;
        }
        var me = this,
            attr = me.attr,
            center = me.getBBoxCenter(true),
            centerX = center[0],
            centerY = center[1],

            x = attr.translationX,
            y = attr.translationY,

            sx = attr.scalingX,
            sy = attr.scalingY === null ? attr.scalingX : attr.scalingY,
            scx = attr.scalingCenterX === null ? centerX : attr.scalingCenterX,
            scy = attr.scalingCenterY === null ? centerY : attr.scalingCenterY,

            rad = attr.rotationRads,
            rcx = attr.rotationCenterX === null ? centerX : attr.rotationCenterX,
            rcy = attr.rotationCenterY === null ? centerY : attr.rotationCenterY,

            cos = Math.cos(rad),
            sin = Math.sin(rad);

        if (sx === 1 && sy === 1) {
            scx = 0;
            scy = 0;
        }

        if (rad === 0) {
            rcx = 0;
            rcy = 0;
        }

        attr.matrix.elements = [
            cos * sx, sin * sy,
            -sin * sx, cos * sy,
            scx + (rcx - cos * rcx - scx + rcy * sin) * sx + x,
            scy + (rcy - cos * rcy - scy + rcx * -sin) * sy + y
        ];
        attr.matrix.inverse(attr.inverseMatrix);
        attr.dirtyTransform = false;
        attr.bbox.transform.dirty = true;
    },

    /**
     * Called before rendering.
     */
    preRender: Ext.emptyFn,

    /**
     * Render method.
     * @param {Ext.draw.Surface} surface The surface.
     * @param {Object} ctx A context object compatible with CanvasRenderingContext2D.
     * @param {Array} region The clip region (or called dirty rect) of the current rendering. Not be confused
     * with `surface.getRegion()`.
     *
     * @return {*} returns `false` to stop rendering in this frame. All the sprite haven't been rendered
     * will have their dirty flag untouched.
     */
    render: Ext.emptyFn,

    repaint: function () {
        var parent = this.getParent();
        while (parent && !(parent instanceof Ext.draw.Surface)) {
            parent = parent.getParent();
        }
        if (parent) {
            parent.renderFrame();
        }
    },

    /**
     * Removes the sprite and clears all listeners.
     */
    destroy: function () {
        var me = this, modifier = me.topModifier, curr;
        while (modifier) {
            curr = modifier;
            modifier = modifier.getPrevious();
            curr.destroy();
        }
        delete me.attr;

        me.destroy = Ext.emptyFn;
        if (me.fireEvent('beforedestroy', me) !== false) {
            me.fireEvent('destroy', me);
        }
        this.callSuper();
    }
}, function () {
    this.def = Ext.create("Ext.draw.sprite.AttributeDefinition", this.def);
});

