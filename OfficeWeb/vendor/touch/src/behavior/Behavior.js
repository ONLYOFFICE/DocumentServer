/**
 * @private
 */
Ext.define('Ext.behavior.Behavior', {
    constructor: function(component) {
        this.component = component;

        component.on('destroy', 'onComponentDestroy', this);
    },

    onComponentDestroy: Ext.emptyFn
});
