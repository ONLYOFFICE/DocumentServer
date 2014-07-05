/**
 * This is a simple container that is used to compile content and a {@link Ext.scroll.View} instance. It also
 * provides scroll indicators.
 *
 * 99% of the time all you need to use in this class is {@link #getScroller}.
 *
 * This should never should be extended.
 */
Ext.define('Ext.scroll.View', {
    extend: 'Ext.Evented',

    alternateClassName: 'Ext.util.ScrollView',

    requires: [
        'Ext.scroll.Scroller',
        'Ext.scroll.Indicator'
    ],

    config: {
        /**
         * @cfg {String} indicatorsUi
         * The style of the indicators of this view. Available options are `dark` or `light`.
         */
        indicatorsUi: 'dark',

        element: null,

        scroller: {},

        indicators: {
            x: {
                axis: 'x'
            },
            y: {
                axis: 'y'
            }
        },

        indicatorsHidingDelay: 100,

        cls: Ext.baseCSSPrefix + 'scroll-view'
    },

    /**
     * @method getScroller
     * Returns the scroller instance in this view. Checkout the documentation of {@link Ext.scroll.Scroller} and
     * {@link Ext.Container#getScrollable} for more information.
     * @return {Ext.scroll.View} The scroller
     */

    /**
     * @private
     */
    processConfig: function(config) {
        if (!config) {
            return null;
        }

        if (typeof config == 'string') {
            config = {
                direction: config
            };
        }

        config = Ext.merge({}, config);

        var scrollerConfig = config.scroller,
            name;

        if (!scrollerConfig) {
            config.scroller = scrollerConfig = {};
        }

        for (name in config) {
            if (config.hasOwnProperty(name)) {
                if (!this.hasConfig(name)) {
                    scrollerConfig[name] = config[name];
                    delete config[name];
                }
            }
        }

        return config;
    },

    constructor: function(config) {
        config = this.processConfig(config);

        this.useIndicators = { x: true, y: true };

        this.doHideIndicators = Ext.Function.bind(this.doHideIndicators, this);

        this.initConfig(config);
    },

    setConfig: function(config) {
        return this.callParent([this.processConfig(config)]);
    },

    updateIndicatorsUi: function(newUi) {
        var indicators = this.getIndicators();
        indicators.x.setUi(newUi);
        indicators.y.setUi(newUi);
    },

    applyScroller: function(config, currentScroller) {
        return Ext.factory(config, Ext.scroll.Scroller, currentScroller);
    },

    applyIndicators: function(config, indicators) {
        var defaultClass = Ext.scroll.Indicator,
            useIndicators = this.useIndicators;

        if (!config) {
            config = {};
        }

        if (!config.x) {
            useIndicators.x = false;
            config.x = {};
        }

        if (!config.y) {
            useIndicators.y = false;
            config.y = {};
        }

        return {
            x: Ext.factory(config.x, defaultClass, indicators && indicators.x),
            y: Ext.factory(config.y, defaultClass, indicators && indicators.y)
        };
    },

    updateIndicators: function(indicators) {
        this.indicatorsGrid = Ext.Element.create({
            className: 'x-scroll-bar-grid-wrapper',
            children: [{
                className: 'x-scroll-bar-grid',
                children: [
                    {
                        children: [{}, {
                            children: [indicators.y.barElement]
                        }]
                    },
                    {
                        children: [{
                            children: [indicators.x.barElement]
                        }, {}]
                    }
                ]
            }]
        });
    },

    updateScroller: function(scroller) {
        scroller.on({
            scope: this,
            scrollstart: 'onScrollStart',
            scroll: 'onScroll',
            scrollend: 'onScrollEnd',
            refresh: 'refreshIndicators'
        });
    },

    isAxisEnabled: function(axis) {
        return this.getScroller().isAxisEnabled(axis) && this.useIndicators[axis];
    },

    applyElement: function(element) {
        if (element) {
            return Ext.get(element);
        }
    },

    updateElement: function(element) {
        var scrollerElement = element.getFirstChild().getFirstChild(),
            scroller = this.getScroller();

        element.addCls(this.getCls());
        element.insertFirst(this.indicatorsGrid);

        scroller.setElement(scrollerElement);

        this.refreshIndicators();

        return this;
    },

    showIndicators: function() {
        var indicators = this.getIndicators();

        if (this.hasOwnProperty('indicatorsHidingTimer')) {
            clearTimeout(this.indicatorsHidingTimer);
            delete this.indicatorsHidingTimer;
        }

        if (this.isAxisEnabled('x')) {
            indicators.x.show();
        }

        if (this.isAxisEnabled('y')) {
            indicators.y.show();
        }
    },

    hideIndicators: function() {
        var delay = this.getIndicatorsHidingDelay();

        if (delay > 0) {
            this.indicatorsHidingTimer = setTimeout(this.doHideIndicators, delay);
        }
        else {
            this.doHideIndicators();
        }
    },

    doHideIndicators: function() {
        var indicators = this.getIndicators();

        if (this.isAxisEnabled('x')) {
            indicators.x.hide();
        }

        if (this.isAxisEnabled('y')) {
            indicators.y.hide();
        }
    },

    onScrollStart: function() {
        this.onScroll.apply(this, arguments);
        this.showIndicators();
    },

    onScrollEnd: function() {
        this.hideIndicators();
    },

    onScroll: function(scroller, x, y) {
        this.setIndicatorValue('x', x);
        this.setIndicatorValue('y', y);

        //<debug>
        if (this.isBenchmarking) {
            this.framesCount++;
        }
        //</debug>
    },

    //<debug>
    isBenchmarking: false,

    framesCount: 0,

    getCurrentFps: function() {
        var now = Date.now(),
            fps;

        if (!this.isBenchmarking) {
            this.isBenchmarking = true;
            fps = 0;
        }
        else {
            fps = Math.round(this.framesCount * 1000 / (now - this.framesCountStartTime));
        }

        this.framesCountStartTime = now;
        this.framesCount = 0;

        return fps;
    },
    //</debug>

    setIndicatorValue: function(axis, scrollerPosition) {
        if (!this.isAxisEnabled(axis)) {
            return this;
        }

        var scroller = this.getScroller(),
            scrollerMaxPosition = scroller.getMaxPosition()[axis],
            scrollerContainerSize = scroller.getContainerSize()[axis],
            value;

        if (scrollerMaxPosition === 0) {
            value = scrollerPosition / scrollerContainerSize;

            if (scrollerPosition >= 0) {
                value += 1;
            }
        }
        else {
            if (scrollerPosition > scrollerMaxPosition) {
                value = 1 + ((scrollerPosition - scrollerMaxPosition) / scrollerContainerSize);
            }
            else if (scrollerPosition < 0) {
                value = scrollerPosition / scrollerContainerSize;
            }
            else {
                value = scrollerPosition / scrollerMaxPosition;
            }
        }

        this.getIndicators()[axis].setValue(value);
    },

    refreshIndicator: function(axis) {
        if (!this.isAxisEnabled(axis)) {
            return this;
        }

        var scroller = this.getScroller(),
            indicator = this.getIndicators()[axis],
            scrollerContainerSize = scroller.getContainerSize()[axis],
            scrollerSize = scroller.getSize()[axis],
            ratio = scrollerContainerSize / scrollerSize;

        indicator.setRatio(ratio);
        indicator.refresh();
    },

    refresh: function() {
        return this.getScroller().refresh();
    },

    refreshIndicators: function() {
        var indicators = this.getIndicators();

        indicators.x.setActive(this.isAxisEnabled('x'));
        indicators.y.setActive(this.isAxisEnabled('y'));

        this.refreshIndicator('x');
        this.refreshIndicator('y');
    },

    destroy: function() {
        var element = this.getElement(),
            indicators = this.getIndicators();

        Ext.destroy(this.getScroller(), this.indicatorsGrid);

        if (this.hasOwnProperty('indicatorsHidingTimer')) {
            clearTimeout(this.indicatorsHidingTimer);
            delete this.indicatorsHidingTimer;
        }

        if (element && !element.isDestroyed) {
            element.removeCls(this.getCls());
        }

        indicators.x.destroy();
        indicators.y.destroy();

        delete this.indicatorsGrid;

        this.callParent(arguments);
    }
});
