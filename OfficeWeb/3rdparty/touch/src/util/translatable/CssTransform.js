/**
 * @private
 *
 * CSS Transform implementation
 */
Ext.define('Ext.util.translatable.CssTransform', {
    extend: 'Ext.util.translatable.Dom',

    doTranslate: function() {
        this.getElement().dom.style.webkitTransform = 'translate3d(' + this.x + 'px, ' + this.y + 'px, 0px)';
    },

    destroy: function() {
        var element = this.getElement();

        if (element && !element.isDestroyed) {
            element.dom.style.webkitTransform = null;
        }

        this.callSuper();
    }
});
