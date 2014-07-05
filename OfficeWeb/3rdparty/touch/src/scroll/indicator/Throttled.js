/**
 * @private
 */
Ext.define('Ext.scroll.indicator.Throttled', {
    extend:'Ext.scroll.indicator.Default',
    config: {
        cls: 'throttled'
    },
    constructor: function() {
        this.callParent(arguments);
        this.updateLength = Ext.Function.createThrottled(this.updateLength, 75, this);
        this.setOffset = Ext.Function.createThrottled(this.setOffset, 50, this);
    },

    doSetHidden: function(hidden) {
        if (hidden) {
            this.setOffset(-10000);
        } else {
            delete this.lastLength;
            delete this.lastOffset;
            this.updateValue(this.getValue());
        }
    },
    updateLength: function(length) {
        length = Math.round(length);
        if (this.lastLength === length || this.lastOffset === -10000) {
            return;
        }
        this.lastLength = length;
        Ext.TaskQueue.requestWrite('doUpdateLength', this,[length]);
    },

    doUpdateLength: function(length){
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
        offset = Math.round(offset);
        if (this.lastOffset === offset || this.lastOffset === -10000) {
            return;
        }
        this.lastOffset = offset;
        Ext.TaskQueue.requestWrite('doSetOffset', this,[offset]);
    },

    doSetOffset: function(offset) {
        if (!this.isDestroyed) {
            var axis = this.getAxis(),
                domStyle = this.element.dom.style;

            if (axis === 'x') {
                domStyle.webkitTransform = 'translate3d(' + offset + 'px, 0, 0)';
            }
            else {
                domStyle.webkitTransform = 'translate3d(0, ' + offset + 'px, 0)';
            }
        }
    }
});