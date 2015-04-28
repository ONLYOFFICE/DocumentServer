/**
 * @private
 */
Ext.define('Ext.scroll.indicator.Abstract', {
    extend: 'Ext.Component',

    config: {
        baseCls: 'x-scroll-indicator',

        axis: 'x',

        value: 0,

        length: null,

        minLength: 6,

        hidden: true,

        ui: 'dark'
    },

    cachedConfig: {
        ratio: 1,

        barCls: 'x-scroll-bar',

        active: true
    },

    barElement: null,

    barLength: 0,

    gapLength: 0,

    getElementConfig: function() {
        return {
            reference: 'barElement',
            children: [this.callParent()]
        };
    },

    applyRatio: function(ratio) {
        if (isNaN(ratio)) {
            ratio = 1;
        }

        return ratio;
    },

    refresh: function() {
        var bar = this.barElement,
            barDom = bar.dom,
            ratio = this.getRatio(),
            axis = this.getAxis(),
            barLength = (axis === 'x') ? barDom.offsetWidth : barDom.offsetHeight,
            length = barLength * ratio;

        this.barLength = barLength;

        this.gapLength = barLength - length;

        this.setLength(length);

        this.updateValue(this.getValue());
    },

    updateBarCls: function(barCls) {
        this.barElement.addCls(barCls);
    },

    updateAxis: function(axis) {
        this.element.addCls(this.getBaseCls(), null, axis);
        this.barElement.addCls(this.getBarCls(), null, axis);
    },

    updateValue: function(value) {
        this.setOffset(this.gapLength * value);
    },

    updateActive: function(active) {
        this.barElement[active ? 'addCls' : 'removeCls']('active');
    },

    doSetHidden: function(hidden) {
        var elementDomStyle = this.element.dom.style;

        if (hidden) {
            elementDomStyle.opacity = '0';
        }
        else {
            elementDomStyle.opacity = '';
        }
    },

    applyLength: function(length) {
        return Math.max(this.getMinLength(), length);
    },

    updateLength: function(length) {
        if (!this.isDestroyed) {
            var axis = this.getAxis(),
                element = this.element;

            if (axis === 'x') {
                element.setWidth(length);
            }
            else {
                element.setHeight(length);
            }
        }
    },

    setOffset: function(offset) {
        var axis = this.getAxis(),
            element = this.element;

        if (axis === 'x') {
            element.setLeft(offset);
        }
        else {
            element.setTop(offset);
        }
    }
});
