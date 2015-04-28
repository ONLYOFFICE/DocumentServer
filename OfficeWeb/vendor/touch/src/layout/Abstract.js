/**
 *
 */
Ext.define('Ext.layout.Abstract', {
    mixins: ['Ext.mixin.Observable'],
    
    isLayout: true,

    constructor: function(config) {
        this.initialConfig = config;
    },

    setContainer: function(container) {
        this.container = container;

        this.initConfig(this.initialConfig);

        return this;
    },

    onItemAdd: function() {},

    onItemRemove: function() {},

    onItemMove: function() {},

    onItemCenteredChange: function() {},

    onItemFloatingChange: function() {},

    onItemDockedChange: function() {},

    onItemInnerStateChange: function() {}
});
