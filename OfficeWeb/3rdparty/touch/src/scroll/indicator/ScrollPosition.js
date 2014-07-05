/**
 * @private
 */
Ext.define('Ext.scroll.indicator.ScrollPosition', {
    extend: 'Ext.scroll.indicator.Abstract',

    config: {
        cls: 'scrollposition'
    },

    getElementConfig: function() {
        var config = this.callParent(arguments);

        config.children.unshift({
            className: 'x-scroll-bar-stretcher'
        });

        return config;
    },

    updateValue: function(value) {
        if (this.gapLength === 0) {
            if (value > 1) {
                value = value - 1;
            }

            this.setOffset(this.barLength * value);
        }
        else {
            this.setOffset(this.gapLength * value);
        }
    },

    updateLength: function() {
        var scrollOffset = this.barLength,
            barDom = this.barElement.dom,
            element = this.element;

        this.callParent(arguments);

        if (this.getAxis() === 'x') {
            barDom.scrollLeft = scrollOffset;
            element.setLeft(scrollOffset);
        }
        else {
            barDom.scrollTop = scrollOffset;
            element.setTop(scrollOffset);
        }
    },

    setOffset: function(offset) {
        var barLength = this.barLength,
            minLength = this.getMinLength(),
            barDom = this.barElement.dom;

        offset = Math.min(barLength - minLength, Math.max(offset, minLength - this.getLength()));
        offset = barLength - offset;

        if (this.getAxis() === 'x') {
            barDom.scrollLeft = offset;
        }
        else {
            barDom.scrollTop = offset;
        }
    }
});
