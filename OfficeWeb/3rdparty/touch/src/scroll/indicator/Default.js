/**
 * @private
 */
Ext.define('Ext.scroll.indicator.Default', {
    extend: 'Ext.scroll.indicator.Abstract',

    config: {
        cls: 'default'
    },

    setOffset: function(offset) {
        var axis = this.getAxis(),
            domStyle = this.element.dom.style;

        if (axis === 'x') {
            domStyle.webkitTransform = 'translate3d(' + offset + 'px, 0, 0)';
        }
        else {
            domStyle.webkitTransform = 'translate3d(0, ' + offset + 'px, 0)';
        }
    },

    updateValue: function(value) {
        var barLength = this.barLength,
            gapLength = this.gapLength,
            length = this.getLength(),
            newLength, offset, extra;

        if (value <= 0) {
            offset = 0;
            this.updateLength(this.applyLength(length + value * barLength));
        }
        else if (value >= 1) {
            extra = Math.round((value - 1) * barLength);
            newLength = this.applyLength(length - extra);
            extra = length - newLength;
            this.updateLength(newLength);
            offset = gapLength + extra;
        }
        else {
            offset = gapLength * value;
        }

        this.setOffset(offset);
    }
});
