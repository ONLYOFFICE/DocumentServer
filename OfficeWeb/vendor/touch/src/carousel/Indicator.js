/**
 * A private utility class used by Ext.Carousel to create indicators.
 * @private
 */
Ext.define('Ext.carousel.Indicator', {
    extend: 'Ext.Component',
    xtype : 'carouselindicator',
    alternateClassName: 'Ext.Carousel.Indicator',

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        baseCls: Ext.baseCSSPrefix + 'carousel-indicator',

        direction: 'horizontal'
    },

    /**
     * @event previous
     * Fires when this indicator is tapped on the left half
     * @param {Ext.carousel.Indicator} this
     */

    /**
     * @event next
     * Fires when this indicator is tapped on the right half
     * @param {Ext.carousel.Indicator} this
     */

    initialize: function() {
        this.callParent();

        this.indicators = [];

        this.element.on({
            tap: 'onTap',
            scope: this
        });
    },

    updateDirection: function(newDirection, oldDirection) {
        var baseCls = this.getBaseCls();

        this.element.replaceCls(oldDirection, newDirection, baseCls);

        if (newDirection === 'horizontal') {
            this.setBottom(0);
            this.setRight(null);
        }
        else {
            this.setRight(0);
            this.setBottom(null);
        }
    },

    addIndicator: function() {
        this.indicators.push(this.element.createChild({
            tag: 'span'
        }));
    },

    removeIndicator: function() {
        var indicators = this.indicators;

        if (indicators.length > 0) {
            indicators.pop().destroy();
        }
    },

    setActiveIndex: function(index) {
        var indicators = this.indicators,
            currentActiveIndex = this.activeIndex,
            currentActiveItem = indicators[currentActiveIndex],
            activeItem = indicators[index],
            baseCls = this.getBaseCls();

        if (currentActiveItem) {
            currentActiveItem.removeCls(baseCls, null, 'active');
        }

        if (activeItem) {
            activeItem.addCls(baseCls, null, 'active');
        }

        this.activeIndex = index;

        return this;
    },

    // @private
    onTap: function(e) {
        var touch = e.touch,
            box = this.element.getPageBox(),
            centerX = box.left + (box.width / 2),
            centerY = box.top + (box.height / 2),
            direction = this.getDirection();

        if ((direction === 'horizontal' && touch.pageX >= centerX) || (direction === 'vertical' && touch.pageY >= centerY)) {
            this.fireEvent('next', this);
        }
        else {
            this.fireEvent('previous', this);
        }
    },

    destroy: function() {
        var indicators = this.indicators,
            i, ln, indicator;

        for (i = 0,ln = indicators.length; i < ln; i++) {
            indicator = indicators[i];
            indicator.destroy();
        }

        indicators.length = 0;

        this.callParent();
    }
});
