/**
 * @class Ext.draw.sprite.Instancing
 * @extends Ext.draw.sprite.Sprite
 *
 * Sprite that represents multiple instances based on the given template.
 */
Ext.define("Ext.draw.sprite.Instancing", {
    extend: "Ext.draw.sprite.Sprite",
    alias: 'sprite.instancing',
    type: 'instancing',
    config: {
        
        /**
         * @cfg {Object} [template=null] The sprite template used by all instances.
         */
        template: null
    },
    instances: null,
    constructor: function (config) {
        this.instances = [];
        this.callSuper([config]);
        if (config && config.template) {
            this.setTemplate(config.template);
        }
    },

    applyTemplate: function (template) {
        if (!(template instanceof Ext.draw.sprite.Sprite)) {
            template = Ext.create(template.xclass || "sprite." + template.type, template);
        }
        template.setParent(this);
        template.attr.children = [];
        this.instances = [];
        this.position = 0;
        return template;
    },

    /**
     * Creates a new sprite instance.
     * 
     * @param {Object} config The configuration of the instance.
     * @param {Object} [data]
     * @param {Boolean} [bypassNormalization] 'true' to bypass attribute normalization.
     * @param {Boolean} [avoidCopy] 'true' to avoid copying.
     * @return {Object} The attributes of the instance.
     */
    createInstance: function (config, data, bypassNormalization, avoidCopy) {
        var template = this.getTemplate(),
            originalAttr = template.attr,
            attr = Ext.Object.chain(originalAttr);
        template.topModifier.prepareAttributes(attr);
        template.attr = attr;
        template.setAttributes(config, bypassNormalization, avoidCopy);
        attr.data = data;
        this.instances.push(attr);
        template.attr = originalAttr;
        this.position++;
        originalAttr.children.push(attr);
        return attr;
    },

    /**
     * Not supported.
     * 
     * @return {null}
     */
    getBBox: function () { return null; },

    /**
     * Returns the bounding box for the instance at the given index.
     *
     * @param {Number} index The index of the instance.
     * @param {Boolean} [isWithoutTransform] 'true' to not apply sprite transforms to the bounding box.
     * @return {Object} The bounding box for the instance.
     */
    getBBoxFor: function (index, isWithoutTransform) {
        var template = this.getTemplate(),
            originalAttr = template.attr,
            bbox;
        template.attr = this.instances[index];
        bbox = template.getBBox(isWithoutTransform);
        template.attr = originalAttr;
        return bbox;
    },

    render: function (surface, ctx, clipRegion) {
        var me = this,
            mat = me.attr.matrix,
            template = me.getTemplate(),
            originalAttr = template.attr,
            instances = me.instances,
            i, ln = me.position;

        mat.toContext(ctx);
        template.preRender(surface, ctx, clipRegion);
        template.useAttributes(ctx);
        for (i = 0; i < ln; i++) {
            if (instances[i].dirtyZIndex) {
                break;
            }
        }
        for (i = 0; i < ln; i++) {
            if (instances[i].hidden) {
                continue;
            }
            ctx.save();
            template.attr = instances[i];
            template.applyTransformations();
            template.useAttributes(ctx);
            template.render(surface, ctx, clipRegion);
            ctx.restore();
        }
        template.attr = originalAttr;
    },

    /**
     * Sets the attributes for the instance at the given index.
     * 
     * @param {Number} index the index of the instance
     * @param {Object} changes the attributes to change
     * @param {Boolean} [bypassNormalization] 'true' to avoid attribute normalization
     */
    setAttributesFor: function (index, changes, bypassNormalization) {
        var template = this.getTemplate(),
            originalAttr = template.attr,
            attr = this.instances[index];
        template.attr = attr;
        try {
            if (bypassNormalization) {
                changes = Ext.apply({}, changes);
            } else {
                changes = template.self.def.normalize(changes);
            }
            template.topModifier.pushDown(attr, changes);
            template.updateDirtyFlags(attr);
        } finally {
            template.attr = originalAttr;
        }
    },

    destroy: function () {
        this.callSuper();
        this.instances.length = 0;
        this.instances = null;
        if (this.getTemplate()) {
            this.getTemplate().destroy();
        }
    }
});