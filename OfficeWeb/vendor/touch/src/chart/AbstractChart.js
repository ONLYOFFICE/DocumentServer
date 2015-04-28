/**
 * The Ext.chart package provides the capability to visualize data.
 * Each chart binds directly to an {@link Ext.data.Store} enabling automatic updates of the chart.
 * A chart configuration object has some overall styling options as well as an array of axes
 * and series. A chart instance example could look like:
 *
 *     new Ext.chart.CartesianChart({
 *         width: 800,
 *         height: 600,
 *         animate: true,
 *         store: store1,
 *         legend: {
 *             position: 'right'
 *         },
 *         axes: [
 *             // ...some axes options...
 *         ],
 *         series: [
 *             // ...some series options...
 *         ]
 *     });
 *
 * In this example we set the `width` and `height` of a cartesian chart; We decide whether our series are
 * animated or not and we select a store to be bound to the chart; We also set the legend to the right part of the
 * chart.
 *
 * You can register certain interactions such as {@link Ext.chart.interactions.PanZoom} on the chart by specify an
 * array of names or more specific config objects. All the events will be wired automatically.
 *
 * You can also listen to `itemXXX` events directly on charts. That case all the contained series will relay this event to the
 * chart.
 *
 * For more information about the axes and series configurations please check the documentation of
 * each series (Line, Bar, Pie, etc).
 *
 */

Ext.define('Ext.chart.AbstractChart', {

    extend: 'Ext.draw.Component',

    requires: [
        'Ext.chart.series.Series',
        'Ext.chart.interactions.Abstract',
        'Ext.chart.axis.Axis',
        'Ext.data.StoreManager',
        'Ext.chart.Legend',
        'Ext.data.Store'
    ],
    /**
     * @event beforerefresh
     * Fires before a refresh to the chart data is called.  If the `beforerefresh` handler returns
     * `false` the {@link #refresh} action will be canceled.
     * @param {Ext.chart.AbstractChart} this
     */

    /**
     * @event refresh
     * Fires after the chart data has been refreshed.
     * @param {Ext.chart.AbstractChart} this
     */

    /**
     * @event redraw
     * Fires after the chart is redrawn.
     * @param {Ext.chart.AbstractChart} this
     */

    /**
     * @event itemmousemove
     * Fires when the mouse is moved on a series item.
     * @param {Ext.chart.series.Series} series
     * @param {Object} item
     * @param {Event} event
     */
    /**
     * @event itemmouseup
     * Fires when a mouseup event occurs on a series item.
     * @param {Ext.chart.series.Series} series
     * @param {Object} item
     * @param {Event} event
     */
    /**
     * @event itemmousedown
     * Fires when a mousedown event occurs on a series item.
     * @param {Ext.chart.series.Series} series
     * @param {Object} item
     * @param {Event} event
     */
    /**
     * @event itemmouseover
     * Fires when the mouse enters a series item.
     * @param {Ext.chart.series.Series} series
     * @param {Object} item
     * @param {Event} event
     */
    /**
     * @event itemmouseout
     * Fires when the mouse exits a series item.
     * @param {Ext.chart.series.Series} series
     * @param {Object} item
     * @param {Event} event
     */
    /**
     * @event itemclick
     * Fires when a click event occurs on a series item.
     * @param {Ext.chart.series.Series} series
     * @param {Object} item
     * @param {Event} event
     */
    /**
     * @event itemdoubleclick
     * Fires when a doubleclick event occurs on a series item.
     * @param {Ext.chart.series.Series} series
     * @param {Object} item
     * @param {Event} event
     */
    /**
     * @event itemtap
     * Fires when a tap event occurs on a series item.
     * @param {Ext.chart.series.Series} series
     * @param {Object} item
     * @param {Event} event
     */
    /**
     * @event itemtapstart
     * Fires when a tapstart event occurs on a series item.
     * @param {Ext.chart.series.Series} series
     * @param {Object} item
     * @param {Event} event
     */
    /**
     * @event itemtapend
     * Fires when a tapend event occurs on a series item.
     * @param {Ext.chart.series.Series} series
     * @param {Object} item
     * @param {Event} event
     */
    /**
     * @event itemtapcancel
     * Fires when a tapcancel event occurs on a series item.
     * @param {Ext.chart.series.Series} series
     * @param {Object} item
     * @param {Event} event
     */
    /**
     * @event itemtaphold
     * Fires when a taphold event occurs on a series item.
     * @param {Ext.chart.series.Series} series
     * @param {Object} item
     * @param {Event} event
     */
    /**
     * @event itemdoubletap
     * Fires when a doubletap event occurs on a series item.
     * @param {Ext.chart.series.Series} series
     * @param {Object} item
     * @param {Event} event
     */
    /**
     * @event itemsingletap
     * Fires when a singletap event occurs on a series item.
     * @param {Ext.chart.series.Series} series
     * @param {Object} item
     * @param {Event} event
     */
    /**
     * @event itemtouchstart
     * Fires when a touchstart event occurs on a series item.
     * @param {Ext.chart.series.Series} series
     * @param {Object} item
     * @param {Event} event
     */
    /**
     * @event itemtouchmove
     * Fires when a touchmove event occurs on a series item.
     * @param {Ext.chart.series.Series} series
     * @param {Object} item
     * @param {Event} event
     */
    /**
     * @event itemtouchend
     * Fires when a touchend event occurs on a series item.
     * @param {Ext.chart.series.Series} series
     * @param {Object} item
     * @param {Event} event
     */
    /**
     * @event itemdragstart
     * Fires when a dragstart event occurs on a series item.
     * @param {Ext.chart.series.Series} series
     * @param {Object} item
     * @param {Event} event
     */
    /**
     * @event itemdrag
     * Fires when a drag event occurs on a series item.
     * @param {Ext.chart.series.Series} series
     * @param {Object} item
     * @param {Event} event
     */
    /**
     * @event itemdragend
     * Fires when a dragend event occurs on a series item.
     * @param {Ext.chart.series.Series} series
     * @param {Object} item
     * @param {Event} event
     */
    /**
     * @event itempinchstart
     * Fires when a pinchstart event occurs on a series item.
     * @param {Ext.chart.series.Series} series
     * @param {Object} item
     * @param {Event} event
     */
    /**
     * @event itempinch
     * Fires when a pinch event occurs on a series item.
     * @param {Ext.chart.series.Series} series
     * @param {Object} item
     * @param {Event} event
     */
    /**
     * @event itempinchend
     * Fires when a pinchend event occurs on a series item.
     * @param {Ext.chart.series.Series} series
     * @param {Object} item
     * @param {Event} event
     */
    /**
     * @event itemswipe
     * Fires when a swipe event occurs on a series item.
     * @param {Ext.chart.series.Series} series
     * @param {Object} item
     * @param {Event} event
     */

    /**
     * @property version Current Version of Touch Charts
     * @type {String}
     */
    version: '2.0.0',

    // @ignore
    viewBox: false,

    delegationRegex: /^item([a-z]+)$/i,

    domEvents: /click|focus|blur|paste|input|mousemove|mousedown|mouseup|mouseover|mouseout|keyup|keydown|keypress|submit|pinch|pinchstart|pinchend|touchstart|touchend|rotate|rotatestart|rotateend|drag|dragstart|dragend|tap|doubletap|singletap/,

    config: {

        /**
         * @cfg {Ext.data.Store} store
         * The store that supplies data to this chart.
         */
        store: null,

        /**
         * @cfg {Boolean/Object} shadow (optional) `true` for the default shadow configuration `{shadowOffsetX: 2, shadowOffsetY: 2, shadowBlur: 3, shadowColor: '#444'}`
         * or a standard shadow config object to be used for default chart shadows.
         */
        shadow: false,

        /**
         * @cfg {Boolean/Object} animate (optional) `true` for the default animation (easing: 'ease' and duration: 500)
         * or a standard animation config object to be used for default chart animations.
         */
        animate: true,

        /**
         * @cfg {Ext.chart.series.Series/Array} series
         * Array of {@link Ext.chart.series.Series Series} instances or config objects. For example:
         *
         *     series: [{
         *         type: 'column',
         *         axis: 'left',
         *         listeners: {
         *             'afterrender': function() {
         *                 console.log('afterrender');
         *             }
         *         },
         *         xField: 'category',
         *         yField: 'data1'
         *     }]
         */
        series: [],

        /**
         * @cfg {Ext.chart.axis.Axis/Array/Object} axes
         * Array of {@link Ext.chart.axis.Axis Axis} instances or config objects. For example:
         *
         *     axes: [{
         *         type: 'Numeric',
         *         position: 'left',
         *         fields: ['data1'],
         *         title: 'Number of Hits',
         *         minimum: 0,
         *         // one minor tick between two major ticks
         *         minorTickSteps: 1
         *     }, {
         *         type: 'Category',
         *         position: 'bottom',
         *         fields: ['name'],
         *         title: 'Month of the Year'
         *     }]
         */
        axes: [],

        /**
         * @cfg {Ext.chart.Legend/Object} legend
         */
        legend: null,

        /**
         * @cfg {Boolean/Array} colors Array of colors/gradients to override the color of items and legends.
         */
        colors: null,

        /**
         * @cfg {Object|Number} insetPadding The amount of inset padding in pixels for the chart. Inset padding is
         * the padding from the boundary of the chart to any of its contents.
         * @cfg {Number} insetPadding.top
         */
        insetPadding: {
            top: 10,
            left: 10,
            right: 10,
            bottom: 10
        },

        /**
         * @cfg {Object} innerPadding The amount of inner padding in pixel. Inner padding is the padding from
         * axis to the series.
         */
        innerPadding: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        },

        /**
         * @cfg {Object|Boolean} background (optional) Set the chart background. This can be a gradient object, image, or color.
         *
         * For example, if `background` were to be a color we could set the object as
         *
         *     background: {
         *         //color string
         *         fill: '#ccc'
         *     }
         *
         * You can specify an image by using:
         *
         *     background: {
         *         image: 'http://path.to.image/'
         *     }
         *
         * Also you can specify a gradient by using the gradient object syntax:
         *
         *     background: {
         *         gradient: {
         *             id: 'gradientId',
         *             angle: 45,
         *             stops: {
         *                 0: {
         *                     color: '#555'
         *                 },
         *                 100: {
         *                     color: '#ddd'
         *                 }
         *             }
         *         }
         *     }
         */
        background: null,

        /**
         * @cfg {Array} interactions
         * Interactions are optional modules that can be plugged in to a chart to allow the user to interact
         * with the chart and its data in special ways. The `interactions` config takes an Array of Object
         * configurations, each one corresponding to a particular interaction class identified by a `type` property:
         *
         *     new Ext.chart.AbstractChart({
         *         renderTo: Ext.getBody(),
         *         width: 800,
         *         height: 600,
         *         store: store1,
         *         axes: [
         *             // ...some axes options...
         *         ],
         *         series: [
         *             // ...some series options...
         *         ],
         *         interactions: [{
         *             type: 'interactiontype'
         *             // ...additional configs for the interaction...
         *         }]
         *     });
         *
         * When adding an interaction which uses only its default configuration (no extra properties other than `type`),
         * you can alternately specify only the type as a String rather than the full Object:
         *
         *     interactions: ['reset', 'rotate']
         *
         * The current supported interaction types include:
         *
         * - {@link Ext.chart.interactions.PanZoom panzoom} - allows pan and zoom of axes
         * - {@link Ext.chart.interactions.ItemHighlight itemhighlight} - allows highlighting of series data points
         * - {@link Ext.chart.interactions.ItemInfo iteminfo} - allows displaying details of a data point in a popup panel
         * - {@link Ext.chart.interactions.Rotate rotate} - allows rotation of pie and radar series
         *
         * See the documentation for each of those interaction classes to see how they can be configured.
         *
         * Additional custom interactions can be registered using `'interactions.'` alias prefix.
         */
        interactions: [],

        /**
         * @private
         * The main region of the chart.
         */
        mainRegion: null,

        /**
         * @private
         * Override value
         */
        autoSize: false,

        /**
         * @private
         * Override value
         */
        viewBox: false,

        /**
         * @private
         * Override value
         */
        fitSurface: false,

        /**
         * @private
         * Override value
         */
        resizeHandler: null,

        /**
         * @readonly
         * @cfg {Object} highlightItem
         * The current highlight item in the chart.
         * The object must be the one that you get from item events.
         *
         * Note that series can also own highlight items.
         * This notion is separate from this one and should not be used at the same time.
         */
        highlightItem: null
    },

    /**
     * @private
     */
    resizing: 0,

    /**
     * @private The z-indexes to use for the various surfaces
     */
    surfaceZIndexes: {
        main: 0,
        grid: 1,
        series: 2,
        axis: 3,
        overlay: 4,
        events: 5
    },

    animating: 0,

    applyAnimate: function (newAnimate, oldAnimate) {
        if (!newAnimate) {
            newAnimate = {
                duration: 0
            };
        } else if (newAnimate === true) {
            newAnimate = {
                easing: 'easeInOut',
                duration: 500
            };
        }
        if (!oldAnimate) {
            return newAnimate;
        } else {
            oldAnimate = Ext.apply({}, newAnimate, oldAnimate);
        }
        return oldAnimate;
    },

    applyInsetPadding: function (padding, oldPadding) {
        if (Ext.isNumber(padding)) {
            return {
                top: padding,
                left: padding,
                right: padding,
                bottom: padding
            };
        } else if (!oldPadding) {
            return padding;
        } else {
            return Ext.apply(oldPadding, padding);
        }
    },

    applyInnerPadding: function (padding, oldPadding) {
        if (Ext.isNumber(padding)) {
            return {
                top: padding,
                left: padding,
                right: padding,
                bottom: padding
            };
        } else if (!oldPadding) {
            return padding;
        } else {
            return Ext.apply(oldPadding, padding);
        }
    },

    scheduleLayout: function () {
        if (!this.scheduledLayoutId) {
            this.scheduledLayoutId = Ext.draw.Animator.schedule('doScheduleLayout', this);
        }
    },

    doScheduleLayout: function () {
        this.scheduledLayoutId = null;
        this.performLayout();
    },

    getAnimate: function () {
        if (this.resizing) {
            return {
                duration: 0
            };
        } else {
            return this._animate;
        }
    },

    constructor: function () {
        var me = this;
        me.itemListeners = {};
        me.surfaceMap = {};
        me.legendStore = new Ext.data.Store({
            storeId: this.getId() + '-legendStore',
            fields: [
                'id', 'name', 'mark', 'disabled', 'series', 'index'
            ]
        });
        me.callSuper(arguments);
        me.refreshLegendStore();
        me.getLegendStore().on('updaterecord', 'onUpdateLegendStore', me);
    },

    /**
     * Return the legend store that contains all the legend information. These
     * information are collected from all the series.
     * @return {Ext.data.Store} 
     */
    getLegendStore: function () {
        return this.legendStore;
    },

    refreshLegendStore: function () {
        if (this.getLegendStore()) {
            var i, ln,
                series = this.getSeries(), seriesItem,
                legendData = [];
            if (series) {
                for (i = 0, ln = series.length; i < ln; i++) {
                    seriesItem = series[i];
                    if (seriesItem.getShowInLegend()) {
                        seriesItem.provideLegendInfo(legendData);
                    }
                }
            }
            this.getLegendStore().setData(legendData);
        }
    },

    onUpdateLegendStore: function (store, record) {
        var series = this.getSeries(), seriesItem;
        if (record && series) {
            seriesItem = series.map[record.get('series')];
            if (seriesItem) {
                seriesItem.setHiddenByIndex(record.get('index'), record.get('disabled'));
                this.redraw();
            }
        }
    },

    initialized: function () {
        var me = this;
        me.callSuper();
        me.getSurface('main');
        me.getSurface('overlay');
        me.applyStyles();
    },

    resizeHandler: function (size) {
        var me = this;
        me.getSurface('overlay').setRegion([0, 0, size.width, size.height]);
        me.performLayout();
    },

    applyMainRegion: function (newRegion, region) {
        if (!region) {
            return newRegion;
        }
        this.getSeries();
        this.getAxes();
        if (newRegion[0] === region[0] &&
            newRegion[1] === region[1] &&
            newRegion[2] === region[2] &&
            newRegion[3] === region[3]) {
            return region;
        } else {
            return newRegion;
        }
    },

    getSurface: function (name, type) {
        name = name || 'main';
        type = type || name;
        var me = this,
            surface = this.callSuper([name]),
            zIndexes = me.surfaceZIndexes;
        if (type in zIndexes) {
            surface.element.setStyle('zIndex', zIndexes[type]);
        }
        if (!me.surfaceMap[type]) {
            me.surfaceMap[type] = [];
        }
        surface.type = type;
        me.surfaceMap[type].push(surface);
        return surface;
    },

    updateColors: function (colors) {
        var series = this.getSeries(),
            seriesItem;
        for (var i = 0; i < series.length; i++) {
            seriesItem = series[i];
            if (!seriesItem.getColors()) {
                seriesItem.updateColors(colors);
            }
        }
    },

    applyAxes: function (newAxes, oldAxes) {
        this.resizing++;
        try {
            if (!oldAxes) {
                oldAxes = [];
                oldAxes.map = {};
            }
            var result = [], i, ln, axis, oldAxis, oldMap = oldAxes.map;
            result.map = {};
            newAxes = Ext.Array.from(newAxes, true);
            for (i = 0, ln = newAxes.length; i < ln; i++) {
                axis = newAxes[i];
                if (!axis) {
                    continue;
                }
                axis = Ext.factory(axis, null, oldAxis = oldMap[axis.getId && axis.getId() || axis.id], 'axis');
                axis.setChart(this);
                if (axis) {
                    result.push(axis);
                    result.map[axis.getId()] = axis;
                    if (!oldAxis) {
                        axis.on('animationstart', 'onAnimationStart', this);
                        axis.on('animationend', 'onAnimationEnd', this);
                    }
                }
            }

            for (i in oldMap) {
                if (!result.map[oldMap[i]]) {
                    oldMap[i].destroy();
                }
            }
            return result;
        } finally {
            this.resizing--;
        }
    },

    updateAxes: function (newAxes) {
        var i, ln, axis;
        for (i = 0, ln = newAxes.length; i < ln; i++) {
            axis = newAxes[i];
            axis.setChart(this);
        }
    },

    applySeries: function (newSeries, oldSeries) {
        this.resizing++;
        try {
            this.getAxes();
            if (!oldSeries) {
                oldSeries = [];
                oldSeries.map = {};
            }
            var me = this,
                result = [],
                i, ln, series, oldMap = oldSeries.map, oldSeriesItem;
            result.map = {};
            newSeries = Ext.Array.from(newSeries, true);
            for (i = 0, ln = newSeries.length; i < ln; i++) {
                series = newSeries[i];
                if (!series) {
                    continue;
                }
                oldSeriesItem = oldSeries.map[series.getId && series.getId() || series.id];
                if (series instanceof Ext.chart.series.Series) {
                    if (oldSeriesItem !== series) {
                        // Replacing
                        if (oldSeriesItem) {
                            oldSeriesItem.destroy();
                        }
                        me.addItemListenersToSeries(series);
                    }
                    series.setChart(this);
                } else if (Ext.isObject(series)) {
                    if (oldSeriesItem) {
                        // Update
                        oldSeriesItem.setConfig(series);
                        series = oldSeriesItem;
                    } else {
                        if (Ext.isString(series)) {
                            series = Ext.create(series.xclass || ("series." + series), {chart: this});
                        } else {
                            series.chart = this;
                            series = Ext.create(series.xclass || ("series." + series.type), series);
                        }
                        series.on('animationstart', 'onAnimationStart', this);
                        series.on('animationend', 'onAnimationEnd', this);
                        me.addItemListenersToSeries(series);
                    }
                }

                result.push(series);
                result.map[series.getId()] = series;
            }

            for (i in oldMap) {
                if (!result.map[oldMap[i]]) {
                    oldMap[i].destroy();
                }
            }
            return result;
        } finally {
            this.resizing--;
        }
    },

    applyLegend: function (newLegend, oldLegend) {
        return Ext.factory(newLegend, Ext.chart.Legend, oldLegend);
    },

    updateLegend: function (legend) {
        if (legend) {
            // On create
            legend.setStore(this.getLegendStore());
            if (!legend.getDocked()) {
                legend.setDocked('bottom');
            }
            if (this.getParent()) {
                this.getParent().add(legend);
            }
        }
    },

    setParent: function (parent) {
        this.callSuper(arguments);
        if (parent && this.getLegend()) {
            parent.add(this.getLegend());
        }
    },

    updateSeries: function (newSeries, oldSeries) {
        this.resizing++;
        try {
            this.fireEvent('serieschanged', this, newSeries, oldSeries);
            var i, ln, seriesItem;
            for (i = 0, ln = newSeries.length; i < ln; i++) {
                seriesItem = newSeries[i];
            }
            this.refreshLegendStore();
        } finally {
            this.resizing--;
        }
    },

    applyInteractions: function (interations, oldInterations) {
        if (!oldInterations) {
            oldInterations = [];
            oldInterations.map = {};
        }
        var me = this,
            result = [], oldMap = oldInterations.map;
        result.map = {};
        interations = Ext.Array.from(interations, true);
        for (var i = 0, ln = interations.length; i < ln; i++) {
            var interation = interations[i];
            if (!interation) {
                continue;
            }
            interation = Ext.factory(interation, null, oldMap[interation.getId && interation.getId() || interation.id], 'interaction');
            interation.setChart(me);
            if (interation) {
                result.push(interation);
                result.map[interation.getId()] = interation;
            }
        }

        for (i in oldMap) {
            if (!result.map[oldMap[i]]) {
                oldMap[i].destroy();
            }
        }
        return result;
    },

    applyStore: function (store) {
        return Ext.StoreManager.lookup(store);
    },

    updateStore: function (newStore, oldStore) {
        var me = this;
        if (oldStore) {
            oldStore.un('refresh', 'onRefresh', me, null, 'after');
            if (oldStore.autoDestroy) {
                oldStore.destroy();
            }
        }
        if (newStore) {
            newStore.on('refresh', 'onRefresh', me, null, 'after');
            me.fireEvent('storechanged', newStore, oldStore);
            me.onRefresh();
        }
    },

    /**
     * Redraw the chart. If animations are set this will animate the chart too.
     */
    redraw: function () {
        this.fireEvent('redraw');
    },

    getEventXY: function (e) {
        e = (e.changedTouches && e.changedTouches[0]) || e.event || e.browserEvent || e;
        var me = this,
            xy = me.element.getXY(),
            region = me.getMainRegion();
        return [e.pageX - xy[0] - region[0], e.pageY - xy[1] - region[1]];
    },

    /**
     * Given an x/y point relative to the chart, find and return the first series item that
     * matches that point.
     * @param {Number} x
     * @param {Number} y
     * @return {Object} An object with `series` and `item` properties, or `false` if no item found.
     */
    getItemForPoint: function (x, y) {
        var me = this,
            i = 0,
            items = me.getSeries(),
            l = items.length,
            series, item;

        for (; i < l; i++) {
            series = items[i];
            item = series.getItemForPoint(x, y);
            if (item) {
                return item;
            }
        }

        return null;
    },

    /**
     * Given an x/y point relative to the chart, find and return all series items that match that point.
     * @param {Number} x
     * @param {Number} y
     * @return {Array} An array of objects with `series` and `item` properties.
     */
    getItemsForPoint: function (x, y) {
        var me = this,
            series = me.getSeries(),
            seriesItem,
            items = [];

        for (var i = 0; i < series.length; i++) {
            seriesItem = series[i];
            var item = seriesItem.getItemForPoint(x, y);
            if (item) {
                items.push(item);
            }
        }

        return items;
    },

    /**
     * @private
     */
    delayThicknessChanged: 0,

    /**
     * @private
     */
    thicknessChanged: false,

    /**
     * Suspend the layout initialized by thickness change
     */
    suspendThicknessChanged: function () {
        this.delayThicknessChanged++;
    },

    /**
     * Resume the layout initialized by thickness change
     */
    resumeThicknessChanged: function () {
        this.delayThicknessChanged--;
        if (this.delayThicknessChanged === 0 && this.thicknessChanged) {
            this.onThicknessChanged();
        }
    },

    onAnimationStart: function () {
        this.fireEvent("animationstart", this);   
    },

    onAnimationEnd: function () {
        this.fireEvent("animationend", this);
    },

    onThicknessChanged: function () {
        if (this.delayThicknessChanged === 0) {
            this.thicknessChanged = false;
            this.performLayout();
        } else {
            this.thicknessChanged = true;
        }
    },

    /**
     * @private
     */
    onRefresh: function () {
        var region = this.getMainRegion(),
            axes = this.getAxes(),
            store = this.getStore(),
            series = this.getSeries();
        if (!store || !axes || !series || !region) {
            return;
        }
        this.redraw();
    },

    /**
     * Changes the data store bound to this chart and refreshes it.
     * @param {Ext.data.Store} store The store to bind to this chart.
     */
    bindStore: function (store) {
        this.setStore(store);
    },

    applyHighlightItem: function (newHighlightItem, oldHighlightItem) {
        if (newHighlightItem === oldHighlightItem) {
            return;
        }
        if (Ext.isObject(newHighlightItem) && Ext.isObject(oldHighlightItem)) {
            if (newHighlightItem.sprite === oldHighlightItem.sprite &&
                newHighlightItem.index === oldHighlightItem.index
                ) {
                return;
            }
        }
        return newHighlightItem;
    },

    updateHighlightItem: function (newHighlightItem, oldHighlightItem) {
        if (oldHighlightItem) {
            oldHighlightItem.series.setAttributesForItem(oldHighlightItem, {highlighted: false});
        }
        if (newHighlightItem) {
            newHighlightItem.series.setAttributesForItem(newHighlightItem, {highlighted: true});
        }
    },

    /**
     * Reset the chart back to its initial state, before any user interaction.
     * @param {Boolean} skipRedraw If `true`, redrawing of the chart will be skipped.
     */
    reset: function (skipRedraw) {
        var me = this,
            i, ln,
            axes = me.getAxes(), axis,
            series = me.getSeries(), seriesItem;

        for (i = 0, ln = axes.length; i < ln; i++) {
            axis = axes[i];
            if (axis.reset) {
                axis.reset();
            }
        }

        for (i = 0, ln = series.length; i < ln; i++) {
            seriesItem = series[i];
            if (seriesItem.reset) {
                seriesItem.reset();
            }
        }

        if (!skipRedraw) {
            me.redraw();
        }
    },

    addItemListenersToSeries: function (series) {
        for (var name in this.itemListeners) {
            var listenerMap = this.itemListeners[name], i, ln;
            for (i = 0, ln = listenerMap.length; i < ln; i++) {
                series.addListener.apply(series, listenerMap[i]);
            }
        }
    },

    addItemListener: function (name, fn, scope, options, order) {
        var listenerMap = this.itemListeners[name] || (this.itemListeners[name] = []),
            series = this.getSeries(), seriesItem,
            i, ln;
        listenerMap.push([name, fn, scope, options, order]);
        if (series) {
            for (i = 0, ln = series.length; i < ln; i++) {
                seriesItem = series[i];
                seriesItem.addListener(name, fn, scope, options, order);
            }
        }
    },

    remoteItemListener: function (name, fn, scope, options, order) {
        var listenerMap = this.itemListeners[name],
            series = this.getSeries(), seriesItem,
            i, ln;
        if (listenerMap) {
            for (i = 0, ln = listenerMap.length; i < ln; i++) {
                if (listenerMap[i].fn === fn) {
                    listenerMap.splice(i, 1);
                    if (series) {
                        for (i = 0, ln = series.length; i < ln; i++) {
                            seriesItem = series[i];
                            seriesItem.removeListener(name, fn, scope, options, order);
                        }
                    }
                    break;
                }
            }
        }
    },

    doAddListener: function (name, fn, scope, options, order) {
        if (name.match(this.delegationRegex)) {
            return this.addItemListener(name, fn, scope || this, options, order);
        } else if (name.match(this.domEvents)) {
            return this.element.doAddListener.apply(this.element, arguments);
        } else {
            return this.callSuper(arguments);
        }
    },

    doRemoveListener: function (name, fn, scope, options, order) {
        if (name.match(this.delegationRegex)) {
            return this.remoteItemListener(name, fn, scope || this, options, order);
        } else if (name.match(this.domEvents)) {
            return this.element.doRemoveListener.apply(this.element, arguments);
        } else {
            return this.callSuper(arguments);
        }
    },

    onItemRemove: function (item) {
        this.callSuper(arguments);
        if (this.surfaceMap) {
            Ext.Array.remove(this.surfaceMap[item.type], item);
            if (this.surfaceMap[item.type].length === 0) {
                delete this.surfaceMap[item.type];
            }
        }
    },

    // @private remove gently.
    destroy: function () {
        var me = this,
            emptyArray = [];
        me.surfaceMap = null;
        me.setHighlightItem(null);
        me.setSeries(emptyArray);
        me.setAxes(emptyArray);
        me.setInteractions(emptyArray);
        me.setStore(null);
        Ext.Viewport.un('orientationchange', me.redraw, me);
        this.callSuper(arguments);
    },

    /* ---------------------------------
     Methods needed for ComponentQuery
     ----------------------------------*/

    /**
     * @private
     * @param deep
     * @return {Array}
     */
    getRefItems: function (deep) {
        var me = this,
            series = me.getSeries(),
            axes = me.getAxes(),
            interaction = me.getInteractions(),
            ans = [], i, ln;

        for (i = 0, ln = series.length; i < ln; i++) {
            ans.push(series[i]);
            if (series[i].getRefItems) {
                ans.push.apply(ans, series[i].getRefItems(deep));
            }
        }

        for (i = 0, ln = axes.length; i < ln; i++) {
            ans.push(axes[i]);
            if (axes[i].getRefItems) {
                ans.push.apply(ans, axes[i].getRefItems(deep));
            }
        }

        for (i = 0, ln = interaction.length; i < ln; i++) {
            ans.push(interaction[i]);
            if (interaction[i].getRefItems) {
                ans.push.apply(ans, interaction[i].getRefItems(deep));
            }
        }

        return ans;
    }
});