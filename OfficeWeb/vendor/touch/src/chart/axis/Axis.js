/**
 * @class Ext.chart.axis.Axis
 *
 * Defines axis for charts.
 *
 * Using the current model, the type of axis can be easily extended. By default, Sencha Touch provides three different
 * type of axis:
 *
 *  * **Numeric**: the data attached with this axes are considered to be numeric and continuous.
 *  * **Time**: the data attached with this axes are considered (or get converted into) date/time and they are continuous.
 *  * **Category**: the data attached with this axes conforms a finite set. They be evenly placed on the axis and displayed in the same form they were provided.
 *
 * The behavior of axis can be easily changed by setting different types of axis layout and axis segmenter to the axis.
 *
 * Axis layout defines how the data points are places. Using continuous layout, the data points will be distributed by
 * there numeric value. Using discrete layout the data points will be spaced evenly, Furthermore, if you want to combine
 * the data points with the duplicate values in a discrete layout, you should use combinedDuplicate layout.
 *
 * Segmenter defines the way to segment data range. For example, if you have a Date-type data range from Jan 1, 1997 to
 * Jan 1, 2017, the segmenter will segement the data range into years, months or days based on the current zooming
 * level.
 *
 * It is possible to write custom axis layouts and segmenters to extends this behavior by simply implement interfaces
 * {@link Ext.chart.axis.layout.Layout} and {@link Ext.chart.axis.segmenter.Segmenter}.
 *
 * Here's an example for the axes part of a chart definition:
 * An example of axis for a series (in this case for an area chart that has multiple layers of yFields) could be:
 *
 *     axes: [{
 *         type: 'Numeric',
 *         position: 'left',
 *         title: 'Number of Hits',
 *         grid: {
 *             odd: {
 *                 opacity: 1,
 *                 fill: '#ddd',
 *                 stroke: '#bbb',
 *                 lineWidth: 1
 *             }
 *         },
 *         minimum: 0
 *     }, {
 *         type: 'Category',
 *         position: 'bottom',
 *         title: 'Month of the Year',
 *         grid: true,
 *         label: {
 *             rotate: {
 *                 degrees: 315
 *             }
 *         }
 *     }]
 *
 * In this case we use a `Numeric` axis for displaying the values of the Area series and a `Category` axis for displaying the names of
 * the store elements. The numeric axis is placed on the left of the screen, while the category axis is placed at the bottom of the chart.
 * Both the category and numeric axes have `grid` set, which means that horizontal and vertical lines will cover the chart background. In the
 * category axis the labels will be rotated so they can fit the space better.
 */
Ext.define('Ext.chart.axis.Axis', {
    xtype: 'axis',

    mixins: {
        observable: 'Ext.mixin.Observable'
    },

    requires: [
        'Ext.chart.axis.sprite.Axis',
        'Ext.chart.axis.segmenter.*',
        'Ext.chart.axis.layout.*'
    ],

    config: {
        /**
         * @cfg {String} position
         * Where to set the axis. Available options are `left`, `bottom`, `right`, `top`, `radial` and `angular`.
         */
        position: 'bottom',

        /**
         * @cfg {Array} fields
         * An array containing the names of the record fields which should be mapped along the axis.
         * This is optional if the binding between series and fields is clear.
         */
        fields: [],

        /**
         * @cfg {Object} label
         *
         * The label configuration object for the Axis. This object may include style attributes
         * like `spacing`, `padding`, `font` that receives a string or number and
         * returns a new string with the modified values.
         */
        label: { x: 0, y: 0, textBaseline: 'middle', textAlign: 'center', fontSize: 12, fontFamily: 'Helvetica' },

        /**
         * @cfg {Object} grid
         * The grid configuration object for the Axis style. Can contain `stroke` or `fill` attributes.
         * Also may contain an `odd` or `even` property in which you only style things on odd or even rows.
         * For example:
         *
         *
         *     grid {
         *         odd: {
         *             stroke: '#555'
         *         },
         *         even: {
         *             stroke: '#ccc'
         *         }
         *     }
         */
        grid: false,

        /**
         * @cfg {Function} renderer Allows direct customisation of rendered axis sprites.
         */
        renderer: null,

        /**
         * @protected
         * @cfg {Ext.chart.AbstractChart} chart The Chart that the Axis is bound.
         */
        chart: null,

        /**
         * @cfg {Object} style
         * The style for the axis line and ticks.
         * Refer to the {@link Ext.chart.axis.sprite.Axis}
         */
        style: null,

        /**
         * @cfg {Number} titleMargin
         * The margin between axis title and axis.
         */
        titleMargin: 4,

        /**
         * @cfg {Object} background
         * The background config for the axis surface.
         */
        background: null,

        /**
         * @cfg {Number} minimum
         * The minimum value drawn by the axis. If not set explicitly, the axis
         * minimum will be calculated automatically.
         */
        minimum: NaN,

        /**
         * @cfg {Number} maximum
         * The maximum value drawn by the axis. If not set explicitly, the axis
         * maximum will be calculated automatically.
         */
        maximum: NaN,

        /**
         * @cfg {Number} minZoom
         * The minimum zooming level for axis.
         */
        minZoom: 1,

        /**
         * @cfg {Number} maxZoom
         * The maximum zooming level for axis
         */
        maxZoom: 10000,

        /**
         * @cfg {Object|Ext.chart.axis.layout.Layout} layout
         * The axis layout config. See {@link Ext.chart.axis.layout.Layout}
         */
        layout: 'continuous',

        /**
         * @cfg {Object|Ext.chart.axis.segmenter.Segmenter} segmenter
         * The segmenter config. See {@link Ext.chart.axis.segmenter.Segmenter}
         */
        segmenter: 'numeric',

        /**
         * @cfg {Boolean} hidden
         * Indicate whether to hide the axis.
         * If the axis is hidden, one of the axis line, ticks, labels or the title will be shown and
         * no margin will be taken.
         * The coordination mechanism works fine no matter if the axis is hidden.
         */
        hidden: false,

        /**
         * @private
         * @cfg {Number} majorTickSteps
         * Will be supported soon.
         * If `minimum` and `maximum` are specified it forces the number of major ticks to the specified value.
         */
        majorTickSteps: false,

        /**
         * @private
         * @cfg {Number} [minorTickSteps=0]
         * Will be supported soon.
         * The number of small ticks between two major ticks.
         */
        minorTickSteps: false,

        /**
         * @private
         * @cfg {Boolean} adjustMaximumByMajorUnit
         * Will be supported soon.
         */
        adjustMaximumByMajorUnit: false,

        /**
         * @private
         * @cfg {Boolean} adjustMinimumByMajorUnit
         * Will be supported soon.
         *
         */
        adjustMinimumByMajorUnit: false,

        /**
         * @cfg {String|Object} title
         * The title for the Axis.
         * If given a String, the text style of the title sprite will be set,
         * otherwise the style will be set.
         */
        title: { fontSize: 18, fontFamily: 'Helvetica'},

        /**
         * @cfg {Number} increment
         * Given a minimum and maximum bound for the series to be rendered (that can be obtained
         * automatically or by manually setting `minimum` and `maximum`) tick marks will be added
         * on each `increment` from the minimum value to the maximum one.
         */
        increment: 0.5,

        /**
         * @private
         * @cfg {Number} length
         * Length of the axis position. Equals to the size of inner region on the docking side of this axis.
         * WARNING: Meant to be set automatically by chart. Do not set it manually.
         */
        length: 0,

        /**
         * @private
         * @cfg {Array} center
         * Center of the polar axis.
         * WARNING: Meant to be set automatically by chart. Do not set it manually.
         */
        center: null,

        /**
         * @private
         * @cfg {Number} radius
         * Radius of the polar axis.
         * WARNING: Meant to be set automatically by chart. Do not set it manually.
         */
        radius: null,

        /**
         * @private
         * @cfg {Number} rotation
         * Rotation of the polar axis.
         * WARNING: Meant to be set automatically by chart. Do not set it manually.
         */
        rotation: null,

        /**
         * @cfg {Boolean} [labelInSpan]
         * Draws the labels in the middle of the spans.
         */
        labelInSpan: null,

        /**
         * @cfg {Array} visibleRange
         * Specify the proportion of the axis to be rendered. The series bound to
         * this axis will be synchronized and transformed.
         */
        visibleRange: [0, 1],

        /**
         * @private
         * @cfg {Boolean} needHighPrecision
         */
        needHighPrecision: false
    },

    observableType: 'component',

    titleOffset: 0,

    animating: 0,

    prevMin: 0,

    prevMax: 1,

    boundSeries: [],

    sprites: null,

    /**
     * @private
     * @property {Array} The full data range of the axis. Should not be set directly, clear it to `null` and use
     * `getRange` to update.
     */
    range: null,

    xValues: [],

    yValues: [],

    applyRotation: function (rotation) {
        var twoPie = Math.PI * 2;
        return (rotation % twoPie + Math.PI) % twoPie - Math.PI;
    },

    updateRotation: function (rotation) {
        var sprites = this.getSprites(),
            position = this.getPosition();
        if (!this.getHidden() && position === 'angular' && sprites[0]) {
            sprites[0].setAttributes({
                baseRotation: rotation
            });
        }
    },

    applyTitle: function (title, oldTitle) {
        var surface;

        if (Ext.isString(title)) {
            title = { text: title };
        }

        if (!oldTitle) {
            oldTitle = Ext.create('sprite.text', title);
            if ((surface = this.getSurface())) {
                surface.add(oldTitle);
            }
        } else {
            oldTitle.setAttributes(title);
        }
        return oldTitle;
    },

    constructor: function (config) {
        var me = this;
        me.sprites = [];
        this.labels = [];
        this.initConfig(config);
        me.getId();
        me.mixins.observable.constructor.apply(me, arguments);
        Ext.ComponentManager.register(me);
    },

    /**
     * @private
     * @return {String}
     */
    getAlignment: function () {
        switch (this.getPosition()) {
            case 'left':
            case 'right':
                return "vertical";
            case 'top':
            case 'bottom':
                return "horizontal";
            case 'radial':
                return "radial";
            case 'angular':
                return "angular";
        }
    },

    /**
     * @private
     * @return {String}
     */
    getGridAlignment: function () {
        switch (this.getPosition()) {
            case 'left':
            case 'right':
                return "horizontal";
            case 'top':
            case 'bottom':
                return "vertical";
            case 'radial':
                return "circular";
            case 'angular':
                return "radial";
        }
    },

    /**
     * @private
     * Get the surface for drawing the series sprites
     */
    getSurface: function () {
        if (!this.surface) {
            var chart = this.getChart();
            if (!chart) {
                return null;
            }
            var surface = this.surface = chart.getSurface(this.getId(), 'axis'),
                gridSurface = this.gridSurface = chart.getSurface("grid-" + this.getId(), 'grid'),
                sprites = this.getSprites(),
                sprite = sprites[0],
                grid = this.getGrid(),
                gridAlignment = this.getGridAlignment(),
                gridSprite;
            if (grid) {
                gridSprite = this.gridSpriteEven = new Ext.chart.Markers();
                gridSprite.setTemplate({xclass: 'grid.' + gridAlignment});
                if (Ext.isObject(grid)) {
                    gridSprite.getTemplate().setAttributes(grid);
                    if (Ext.isObject(grid.even)) {
                        gridSprite.getTemplate().setAttributes(grid.even);
                    }
                }
                gridSurface.add(gridSprite);
                sprite.bindMarker(gridAlignment + '-even', gridSprite);

                gridSprite = this.gridSpriteOdd = new Ext.chart.Markers();
                gridSprite.setTemplate({xclass: 'grid.' + gridAlignment});
                if (Ext.isObject(grid)) {
                    gridSprite.getTemplate().setAttributes(grid);
                    if (Ext.isObject(grid.odd)) {
                        gridSprite.getTemplate().setAttributes(grid.odd);
                    }
                }
                gridSurface.add(gridSprite);
                sprite.bindMarker(gridAlignment + '-odd', gridSprite);

                gridSurface.waitFor(surface);
            }
        }
        return this.surface;
    },

    /**
     *
     * Mapping data value into coordinate.
     *
     * @param {*} value
     * @param {String} field
     * @param {Number} [idx]
     * @param {Ext.util.MixedCollection} [items]
     * @return {Number}
     */
    getCoordFor: function (value, field, idx, items) {
        return this.getLayout().getCoordFor(value, field, idx, items);
    },

    applyPosition: function (pos) {
        return pos.toLowerCase();
    },

    applyLabel: function (newText, oldText) {
        if (!oldText) {
            oldText = new Ext.draw.sprite.Text({});
        }
        oldText.setAttributes(newText);
        return oldText;
    },

    applyLayout: function (layout, oldLayout) {
        // TODO: finish this
        layout = Ext.factory(layout, null, oldLayout, 'axisLayout');
        layout.setAxis(this);
        return layout;
    },

    applySegmenter: function (segmenter, oldSegmenter) {
        // TODO: finish this
        segmenter = Ext.factory(segmenter, null, oldSegmenter, 'segmenter');
        segmenter.setAxis(this);
        return segmenter;
    },

    updateMinimum: function () {
        this.range = null;
    },

    updateMaximum: function () {
        this.range = null;
    },

    hideLabels: function () {
        this.getSprites()[0].setDirty(true);
        this.setLabel({hidden: true});
    },

    showLabels: function () {
        this.getSprites()[0].setDirty(true);
        this.setLabel({hidden: false});
    },

    /**
     * @private
     * Reset the axis to its original state, before any user interaction.
     *
     */
    reset: function () {
        // TODO: finish this
    },

    /**
     * Invokes renderFrame on this axis's surface(s)
     */
    renderFrame: function () {
        this.getSurface().renderFrame();
    },

    updateChart: function (newChart, oldChart) {
        var me = this, surface;
        if (oldChart) {
            oldChart.un("serieschanged", me.onSeriesChanged, me);
        }
        if (newChart) {
            newChart.on("serieschanged", me.onSeriesChanged, me);
            if (newChart.getSeries()) {
                me.onSeriesChanged(newChart);
            }
            me.surface = null;
            surface = me.getSurface();
            surface.add(me.getSprites());
            surface.add(me.getTitle());
        }
    },

    applyBackground: function (background) {
        var rect = Ext.ClassManager.getByAlias('sprite.rect');
        return rect.def.normalize(background);
    },

    /**
     * @protected
     * Invoked when data has changed.
     */
    processData: function () {
        this.getLayout().processData();
        this.range = null;
    },

    getDirection: function () {
        return this.getChart().getDirectionForAxis(this.getPosition());
    },

    isSide: function () {
        var position = this.getPosition();
        return position === 'left' || position === 'right';
    },

    applyFields: function (fields) {
        return [].concat(fields);
    },

    updateFields: function (fields) {
        this.fieldsMap = {};
        for (var i = 0; i < fields.length; i++) {
            this.fieldsMap[fields[i]] = true;
        }
    },

    applyVisibleRange: function (visibleRange, oldVisibleRange) {
        // If it is in reversed order swap them
        if (visibleRange[0] > visibleRange[1]) {
            var temp = visibleRange[0];
            visibleRange[0] = visibleRange[1];
            visibleRange[0] = temp;
        }
        if (visibleRange[1] === visibleRange[0]) {
            visibleRange[1] += 1 / this.getMaxZoom();
        }
        if (visibleRange[1] > visibleRange[0] + 1) {
            visibleRange[0] = 0;
            visibleRange[1] = 1;
        } else if (visibleRange[0] < 0) {
            visibleRange[1] -= visibleRange[0];
            visibleRange[0] = 0;
        } else if (visibleRange[1] > 1) {
            visibleRange[0] -= visibleRange[1] - 1;
            visibleRange[1] = 1;
        }

        if (oldVisibleRange && visibleRange[0] === oldVisibleRange[0] && visibleRange[1] === oldVisibleRange[1]) {
            return undefined;
        }

        return visibleRange;
    },

    updateVisibleRange: function (visibleRange) {
        this.fireEvent('transformed', this, visibleRange);
    },

    onSeriesChanged: function (chart) {
        var me = this,
            series = chart.getSeries(),
            getAxisMethod = 'get' + me.getDirection() + 'Axis',
            boundSeries = [], i, ln = series.length;
        for (i = 0; i < ln; i++) {
            if (this === series[i][getAxisMethod]()) {
                boundSeries.push(series[i]);
            }
        }

        me.boundSeries = boundSeries;
        me.getLayout().processData();
    },

    applyRange: function (newRange) {
        if (!newRange) {
            return this.dataRange.slice(0);
        } else {
            return [
                newRange[0] === null ? this.dataRange[0] : newRange[0],
                newRange[1] === null ? this.dataRange[1] : newRange[1]
            ];
        }
    },

    /**
     * Get the range derived from all the bound series.
     * @return {Array}
     */
    getRange: function () {
        var me = this,
            getRangeMethod = 'get' + me.getDirection() + 'Range';

        if (me.range) {
            return me.range;
        }
        if (!isNaN(me.getMinimum()) && !isNaN(me.getMaximum())) {
            return this.range = [me.getMinimum(), me.getMaximum()];
        }
        var min = Infinity,
            max = -Infinity,
            boundSeries = me.boundSeries,
            series, i, ln;

        // For each series bound to this axis, ask the series for its min/max values
        // and use them to find the overall min/max.
        for (i = 0, ln = boundSeries.length; i < ln; i++) {
            series = boundSeries[i];
            var minMax = series[getRangeMethod]();

            if (minMax) {
                if (minMax[0] < min) {
                    min = minMax[0];
                }
                if (minMax[1] > max) {
                    max = minMax[1];
                }
            }
        }
        if (!isFinite(max)) {
            max = me.prevMax;
        }

        if (!isFinite(min)) {
            min = me.prevMin;
        }

        if (this.getLabelInSpan()) {
            max += this.getIncrement();
            min -= this.getIncrement();
        }

        if (!isNaN(me.getMinimum())) {
            min = me.getMinimum();
        } else {
            me.prevMin = min;
        }

        if (!isNaN(me.getMaximum())) {
            max = me.getMaximum();
        } else {
            me.prevMax = max;
        }

        return this.range = [min, max];
    },

    applyStyle: function (style, oldStyle) {
        var cls = Ext.ClassManager.getByAlias('sprite.' + this.seriesType);
        if (cls && cls.def) {
            style = cls.def.normalize(style);
        }
        oldStyle = Ext.apply(oldStyle || {}, style);
        return oldStyle;
    },

    updateCenter: function (center) {
        var sprites = this.getSprites(),
            axisSprite = sprites[0],
            centerX = center[0],
            centerY = center[1];
        if (axisSprite) {
            axisSprite.setAttributes({
                centerX: centerX,
                centerY: centerY
            });
        }
        if (this.gridSpriteEven) {
            this.gridSpriteEven.getTemplate().setAttributes({
                translationX: centerX,
                translationY: centerY,
                rotationCenterX: centerX,
                rotationCenterY: centerY
            });
        }
        if (this.gridSpriteOdd) {
            this.gridSpriteOdd.getTemplate().setAttributes({
                translationX: centerX,
                translationY: centerY,
                rotationCenterX: centerX,
                rotationCenterY: centerY
            });
        }
    },

    getSprites: function () {
        if (!this.getChart()) {
            return;
        }
        var me = this,
            range = me.getRange(),
            position = me.getPosition(),
            chart = me.getChart(),
            animation = chart.getAnimate(),
            baseSprite, style,
            gridAlignment = me.getGridAlignment(),
            length = me.getLength();

        // If animation is false, then stop animation.
        if (animation === false) {
            animation = {
                duration: 0
            };
        }
        if (range) {
            style = Ext.applyIf({
                position: position,
                axis: me,
                min: range[0],
                max: range[1],
                length: length,
                grid: me.getGrid(),
                hidden: me.getHidden(),
                titleOffset: me.titleOffset,
                layout: me.getLayout(),
                segmenter: me.getSegmenter(),
                label: me.getLabel()
            }, me.getStyle());

            // If the sprites are not created.
            if (!me.sprites.length) {
                baseSprite = new Ext.chart.axis.sprite.Axis(style);
                baseSprite.fx.setCustomDuration({
                    baseRotation: 0
                });
                baseSprite.fx.on("animationstart", "onAnimationStart", me);
                baseSprite.fx.on("animationend", "onAnimationEnd", me);
                me.sprites.push(baseSprite);
                me.updateTitleSprite();
            } else {
                baseSprite = me.sprites[0];
                baseSprite.fx.setConfig(animation);
                baseSprite.setAttributes(style);
                baseSprite.setLayout(me.getLayout());
                baseSprite.setSegmenter(me.getSegmenter());
                baseSprite.setLabel(me.getLabel());
            }

            if (me.getRenderer()) {
                baseSprite.setRenderer(me.getRenderer());
            }
        }

        return me.sprites;
    },

    updateTitleSprite: function () {
        if (!this.sprites[0]) {
            return;
        }
        var me = this,
            thickness = this.sprites[0].thickness,
            surface = me.getSurface(),
            title = this.getTitle(),
            position = me.getPosition(),
            titleMargin = me.getTitleMargin(),
            length = me.getLength(),
            anchor = surface.roundPixel(length / 2);

        if (title) {
            switch (position) {
                case 'top':
                    title.setAttributes({
                        x: anchor,
                        y: titleMargin / 2,
                        textBaseline: 'top',
                        textAlign: 'center'
                    }, true, true);
                    title.applyTransformations();
                    me.titleOffset = title.getBBox().height + titleMargin;
                    break;
                case 'bottom':
                    title.setAttributes({
                        x: anchor,
                        y: thickness + titleMargin,
                        textBaseline: 'top',
                        textAlign: 'center'
                    }, true, true);
                    title.applyTransformations();
                    me.titleOffset = title.getBBox().height + titleMargin;
                    break;
                case 'left':
                    title.setAttributes({
                        x: titleMargin / 2,
                        y: anchor,
                        textBaseline: 'top',
                        textAlign: 'center',
                        rotationCenterX: titleMargin / 2,
                        rotationCenterY: anchor,
                        rotationRads: -Math.PI / 2
                    }, true, true);
                    title.applyTransformations();
                    me.titleOffset = title.getBBox().width + titleMargin;
                    break;
                case 'right':
                    title.setAttributes({
                        x: thickness - titleMargin / 2,
                        y: anchor,
                        textBaseline: 'bottom',
                        textAlign: 'center',
                        rotationCenterX: thickness,
                        rotationCenterY: anchor,
                        rotationRads: Math.PI / 2
                    }, true, true);
                    title.applyTransformations();
                    me.titleOffset = title.getBBox().width + titleMargin;
                    break;
            }
        }
    },

    onThicknessChanged: function () {
        var me = this;
        me.getChart().onThicknessChanged();
    },

    getThickness: function () {
        if (this.getHidden()) {
            return 0;
        }
        return (this.sprites[0] && this.sprites[0].thickness || 1) + this.titleOffset;
    },

    onAnimationStart: function () {
        this.animating++;
        if (this.animating === 1) {
            this.fireEvent("animationstart");
        }
    },

    onAnimationEnd: function () {
        this.animating--;
        if (this.animating === 0) {
            this.fireEvent("animationend");
        }
    },

    // Methods used in ComponentQuery and controller
    getItemId: function () {
        return this.getId();
    },

    getAncestorIds: function () {
        return [this.getChart().getId()];
    },

    isXType: function (xtype) {
        return xtype === 'axis';
    },

    destroy: function () {
        Ext.ComponentManager.unregister(this);
        this.callSuper();
    }
});

