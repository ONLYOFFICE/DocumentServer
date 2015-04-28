//@tag dom,core
//@require Ext.dom.Helper

/**
 * An Identifiable mixin.
 * @private
 */
Ext.define('Ext.mixin.Identifiable', {
    statics: {
        uniqueIds: {}
    },

    isIdentifiable: true,

    mixinId: 'identifiable',

    idCleanRegex: /\.|[^\w\-]/g,

    defaultIdPrefix: 'ext-',

    defaultIdSeparator: '-',

    getOptimizedId: function() {
        return this.id;
    },

    getUniqueId: function() {
        var id = this.id,
            prototype, separator, xtype, uniqueIds, prefix;

        if (!id) {
            prototype = this.self.prototype;
            separator = this.defaultIdSeparator;

            uniqueIds = Ext.mixin.Identifiable.uniqueIds;

            if (!prototype.hasOwnProperty('identifiablePrefix')) {
                xtype = this.xtype;

                if (xtype) {
                    prefix = this.defaultIdPrefix + xtype + separator;
                }
                else {
                    prefix = prototype.$className.replace(this.idCleanRegex, separator).toLowerCase() + separator;
                }

                prototype.identifiablePrefix = prefix;
            }

            prefix = this.identifiablePrefix;

            if (!uniqueIds.hasOwnProperty(prefix)) {
                uniqueIds[prefix] = 0;
            }

            id = this.id = prefix + (++uniqueIds[prefix]);
        }

        this.getUniqueId = this.getOptimizedId;

        return id;
    },

    setId: function(id) {
        this.id = id;
    },

    /**
     * Retrieves the id of this component. Will autogenerate an id if one has not already been set.
     * @return {String} id
     */
    getId: function() {
        var id = this.id;

        if (!id) {
            id = this.getUniqueId();
        }

        this.getId = this.getOptimizedId;

        return id;
    }
});
