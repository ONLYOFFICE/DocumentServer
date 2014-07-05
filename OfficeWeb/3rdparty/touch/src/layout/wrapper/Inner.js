/**
 *
 */
Ext.define('Ext.layout.wrapper.Inner', {
    config: {
        sizeState: null,
        container: null
    },

    constructor: function(config) {
        this.initConfig(config);
    },

    getElement: function() {
        return this.getContainer().bodyElement;
    },

    setInnerWrapper: Ext.emptyFn,

    getInnerWrapper: Ext.emptyFn
});
