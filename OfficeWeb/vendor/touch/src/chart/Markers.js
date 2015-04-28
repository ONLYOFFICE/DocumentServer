/**
 * @class Ext.chart.Markers
 * @extends Ext.draw.sprite.Instancing
 * 
 * Marker sprite. A specialized version of instancing sprite that groups instances.
 * Putting a marker is grouped by its category id. Clearing removes that category.
 */
Ext.define("Ext.chart.Markers", {
    extend: 'Ext.draw.sprite.Instancing',
    revisions: 0,

    constructor: function () {
        this.callSuper(arguments);
        this.map = {};
        this.revisions = {};
    },

    /**
     * Clear the markers in the category
     * @param {String} category
     */
    clear: function (category) {
        category = category || 'default';
        if (!(category in this.revisions)) {
            this.revisions[category] = 1;
        } else {
            this.revisions[category]++;
        }
    },

    /**
     * Put a marker in the category with additional
     * attributes.
     * @param {String} category
     * @param {Object} markerAttr
     * @param {String|Number} index
     * @param {Boolean} [canonical]
     * @param {Boolean} [keepRevision]
     */
    putMarkerFor: function (category, markerAttr, index, canonical, keepRevision) {
        category = category || 'default';

        var me = this,
            map = me.map[category] || (me.map[category] = {});
        if (index in map) {
            me.setAttributesFor(map[index], markerAttr, canonical);
        } else {
            map[index] = me.instances.length;
            me.createInstance(markerAttr, null, canonical);
        }
        me.instances[map[index]].category = category;
        if (!keepRevision) {
            me.instances[map[index]].revision = me.revisions[category] || (me.revisions[category] = 1);
        }
    },

    /**
     *
     * @param {String} id
     * @param {Mixed} index
     * @param {Boolean} [isWithoutTransform]
     */
    getMarkerBBoxFor: function (category, index, isWithoutTransform) {
        if (category in this.map) {
            if (index in this.map[category]) {
                return this.getBBoxFor(this.map[category][index], isWithoutTransform);
            }
        }
    },

    getBBox: function () { return null; },

    render: function (surface, ctx, clipRegion) {
        var me = this,
            revisions = me.revisions,
            mat = me.attr.matrix,
            template = me.getTemplate(),
            originalAttr = template.attr,
            instances = me.instances,
            i, ln = me.instances.length;
        mat.toContext(ctx);
        template.preRender(surface, ctx, clipRegion);
        template.useAttributes(ctx);
        for (i = 0; i < ln; i++) {
            if (instances[i].hidden || instances[i].revision !== revisions[instances[i].category]) {
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
    }
});