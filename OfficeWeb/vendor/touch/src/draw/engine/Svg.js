/**
 * @class Ext.draw.engine.Svg
 * @extends Ext.draw.Surface
 *
 * SVG engine.
 */
Ext.define('Ext.draw.engine.Svg', {
    extend: 'Ext.draw.Surface',
    requires: ['Ext.draw.engine.SvgContext'],

    statics: {
        BBoxTextCache: {}
    },

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
                    },
                    children: [
                        {
                            tag: 'svg',
                            reference: 'svgElement',
                            namespace: "http://www.w3.org/2000/svg",
                            version: 1.1,
                            cls: 'x-surface'
                        }
                    ]
                }
            ]
        };
    },

    constructor: function (config) {
        var me = this;
        me.callSuper([config]);
        me.mainGroup = me.createSvgNode("g");
        me.defElement = me.createSvgNode("defs");
        // me.svgElement is assigned in element creation of Ext.Component.
        me.svgElement.appendChild(me.mainGroup);
        me.svgElement.appendChild(me.defElement);
        me.ctx = new Ext.draw.engine.SvgContext(me);
    },

    /**
     * Creates a DOM element under the SVG namespace of the given type.
     * @param type The type of the SVG DOM element.
     * @return {*} The created element.
     */
    createSvgNode: function (type) {
        var node = document.createElementNS("http://www.w3.org/2000/svg", type);
        return Ext.get(node);
    },

    /**
     * @private
     * Returns the SVG DOM element at the given position. If it does not already exist or is a different element tag
     * it will be created and inserted into the DOM.
     * @param group The parent DOM element.
     * @param tag The SVG element tag.
     * @param position The position of the element in the DOM.
     * @return {Ext.dom.Element} The SVG element.
     */
    getSvgElement: function (group, tag, position) {
        var element;
        if (group.dom.childNodes.length > position) {
            element = group.dom.childNodes[position];
            if (element.tagName === tag) {
                return Ext.get(element);
            } else {
                Ext.destroy(element);
            }
        }

        element = Ext.get(this.createSvgNode(tag));
        if (position === 0) {
            group.insertFirst(element);
        } else {
            element.insertAfter(Ext.fly(group.dom.childNodes[position - 1]));
        }
        element.cache = {};
        return element;
    },

    /**
     * @private
     * Applies attributes to the given element.
     * @param element The DOM element to be applied.
     * @param attributes The attributes to apply to the element.
     */
    setElementAttributes: function (element, attributes) {
        var dom = element.dom,
            cache = element.cache,
            name, value;
        for (name in attributes) {
            value = attributes[name];
            if (cache[name] !== value) {
                cache[name] = value;
                dom.setAttribute(name, value);
            }
        }
    },

    /**
     * @private
     * Gets the next reference element under the SVG 'defs' tag.
     * @param tagName The type of reference element.
     * @return {Ext.dom.Element} The reference element.
     */
    getNextDef: function (tagName) {
        return this.getSvgElement(this.defElement, tagName, this.defPosition++);
    },

    /**
     * @inheritdoc
     */
    clearTransform: function () {
        var me = this;
        me.mainGroup.set({transform: me.matrix.toSvg()});
    },

    /**
     * @inheritdoc
     */
    clear: function () {
        this.ctx.clear();
        this.defPosition = 0;
    },

    /**
     * @inheritdoc
     */
    renderSprite: function (sprite) {
        var me = this,
            region = me.getRegion(),
            ctx = me.ctx;
        if (sprite.attr.hidden || sprite.attr.opacity === 0) {
            ctx.save();
            ctx.restore();
            return;
        }
        try {
            ctx.save();
            sprite.preRender(this);
            sprite.applyTransformations();
            sprite.useAttributes(ctx);
            if (false === sprite.render(this, ctx, [0, 0, region[2], region[3]])) {
                return false;
            }
            sprite.setDirty(false);
        } finally {
            ctx.restore();
        }
    },

    /**
     * Destroys the Canvas element and prepares it for Garbage Collection.
     */
    destroy: function (path, matrix, band) {
        var me = this;
        me.ctx.destroy();
        me.mainGroup.destroy();
        delete me.mainGroup;
        delete me.ctx;
        me.callSuper(arguments);
    }
});
