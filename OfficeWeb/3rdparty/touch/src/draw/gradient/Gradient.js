/**
 * @class Ext.draw.gradient.Gradient
 * 
 * Creates a gradient.
 */
Ext.define("Ext.draw.gradient.Gradient", {
    requires: ["Ext.draw.LimitedCache"],
    mixins: {
        identifiable: 'Ext.mixin.Identifiable'
    },
    identifiablePrefix: 'ext-gradient-',
    isGradient: true,
    statics: {
        gradientCache: null
    },

    config: {
        /**
         * @cfg {Array/Object} Defines the stops of the gradient.
         */
        stops: []
    },

    applyStops: function (newStops) {
        var stops = [],
            ln = newStops.length,
            i, stop, color;

        for (i = 0; i < ln; i++) {
            stop = newStops[i];
            color = Ext.draw.Color.fly(stop.color || 'none');
            stops.push({
                offset: Math.min(1, Math.max(0, 'offset' in stop ? stop.offset : stop.position || 0)),
                color: color.toString()
            });
        }
        stops.sort(function (a, b) {
            return a.offset - b.offset;
        });
        return stops;
    },

    onClassExtended: function (subClass, member) {
        if (!member.alias && member.type) {
            member.alias = 'gradient.' + member.type;
        }
    },
    
    constructor: function (config) {
        config = config || {};
        this.gradientCache = new Ext.draw.LimitedCache({
            feeder: function (gradient, ctx, bbox) {
                return gradient.generateGradient(ctx, bbox);
            },
            scope: this
        });
        this.initConfig(config);
        this.id = config.id;
        this.getId();
    },

    /**
     * @protected
     * Generates the gradient for the given context.
     * @param ctx The context.
     * @param bbox 
     * @return {Object}
     */
    generateGradient: Ext.emptyFn,

    /**
     * @private
     * @param ctx
     * @param bbox
     * @return {*}
     */
    getGradient: function (ctx, bbox) {
        return this.gradientCache.get(this.id + ',' + bbox.x + ',' + bbox.y + ',' + bbox.width + ',' + bbox.height, this, ctx, bbox);
    },

    /**
     * @private
     */
    clearCache: function () {
        this.gradientCache.clear();
    }

});