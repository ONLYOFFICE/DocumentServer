/**
 * @private
 */
Ext.define('Ext.scroll.indicator.CssTransform', {
    extend: 'Ext.scroll.indicator.Abstract',

    config: {
        cls: 'csstransform'
    },

    getElementConfig: function() {
        var config = this.callParent();

        config.children[0].children = [
            {
                reference: 'startElement'
            },
            {
                reference: 'middleElement'
            },
            {
                reference: 'endElement'
            }
        ];

        return config;
    },

    refresh: function() {
        var axis = this.getAxis(),
            startElementDom = this.startElement.dom,
            endElementDom = this.endElement.dom,
            middleElement = this.middleElement,
            startElementLength, endElementLength;

        if (axis === 'x') {
            startElementLength = startElementDom.offsetWidth;
            endElementLength = endElementDom.offsetWidth;
            middleElement.setLeft(startElementLength);
        }
        else {
            startElementLength = startElementDom.offsetHeight;
            endElementLength = endElementDom.offsetHeight;
            middleElement.setTop(startElementLength);
        }

        this.startElementLength = startElementLength;
        this.endElementLength = endElementLength;

        this.callParent();
    },

    updateLength: function(length) {
        var axis = this.getAxis(),
            endElementStyle = this.endElement.dom.style,
            middleElementStyle = this.middleElement.dom.style,
            endElementLength = this.endElementLength,
            endElementOffset = length - endElementLength,
            middleElementLength = endElementOffset - this.startElementLength;

        if (axis === 'x') {
            endElementStyle.webkitTransform = 'translate3d(' + endElementOffset + 'px, 0, 0)';
            middleElementStyle.webkitTransform = 'translate3d(0, 0, 0) scaleX(' + middleElementLength + ')';
        }
        else {
            endElementStyle.webkitTransform = 'translate3d(0, ' + endElementOffset + 'px, 0)';
            middleElementStyle.webkitTransform = 'translate3d(0, 0, 0) scaleY(' + middleElementLength + ')';
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
    },

    setOffset: function(offset) {
        var axis = this.getAxis(),
            elementStyle = this.element.dom.style;

        offset = Math.round(offset);

        if (axis === 'x') {
            elementStyle.webkitTransform = 'translate3d(' + offset + 'px, 0, 0)';
        }
        else {
            elementStyle.webkitTransform = 'translate3d(0, ' + offset + 'px, 0)';
        }
    }
});
