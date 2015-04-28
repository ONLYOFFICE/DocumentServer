/**
 * @private
 *
 * Scroll position implementation
 */
Ext.define('Ext.util.translatable.ScrollPosition', {
    extend: 'Ext.util.translatable.Dom',

    wrapperWidth: 0,

    wrapperHeight: 0,

    config: {
        useWrapper: true
    },

    getWrapper: function() {
        var wrapper = this.wrapper,
            element = this.getElement(),
            container;

        if (!wrapper) {
            container = element.getParent();

            if (!container) {
                return null;
            }

            if (this.getUseWrapper()) {
                wrapper = element.wrap();
            }
            else {
                wrapper = container;
            }

            element.addCls('x-translatable');
            wrapper.addCls('x-translatable-container');

            this.wrapper = wrapper;

            wrapper.on('resize', 'onWrapperResize', this);
            wrapper.on('painted', 'refresh', this);

            this.refresh();
        }

        return wrapper;
    },

    doTranslate: function(x, y) {
        var wrapper = this.getWrapper(),
            dom;

        if (wrapper) {
            dom = wrapper.dom;

            if (typeof x == 'number') {
                dom.scrollLeft = this.wrapperWidth - x;
            }

            if (typeof y == 'number') {
                dom.scrollTop = this.wrapperHeight - y;
            }
        }
    },

    onWrapperResize: function(wrapper, info) {
        this.wrapperWidth = info.width;
        this.wrapperHeight = info.height;

        this.refresh();
    },

    destroy: function() {
        var element = this.getElement(),
            wrapper = this.wrapper;

        if (wrapper) {
            if (!element.isDestroyed) {
                if (this.getUseWrapper()) {
                    wrapper.doReplaceWith(element);
                }
                element.removeCls('x-translatable');
            }

            wrapper.removeCls('x-translatable-container');
            wrapper.un('resize', 'onWrapperResize', this);
            wrapper.un('painted', 'refresh', this);

            delete this.wrapper;
            delete this._element;
        }

        this.callSuper();
    }

});
