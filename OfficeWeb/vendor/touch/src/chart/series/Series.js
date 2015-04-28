/**
 * Series is the abstract class containing the common logic to all chart series. Series includes
 * methods from Labels, Highlights, Tips and Callouts mixins. This class implements the logic of
 * animating, hiding, showing all elements and returning the color of the series to be used as a legend item.
 *
 * ## Listeners
 *
 * The series class supports listeners via the Observable syntax. Some of these listeners are:
 *
 *  - `itemmouseup` When the user interacts with a marker.
 *  - `itemmousedown` When the user interacts with a marker.
 *  - `itemmousemove` When the user interacts with a marker.
 *  - (similar `item*` events occur for many raw mouse and touch events)
 *  - `afterrender` Will be triggered when the animation ends or when the series has been rendered completely.
 *
 * For example:
 *
 *     series: [{
 *         type: 'column',
 *         axis: 'left',
 *         listeners: {
 *             'afterrender': function() {
 *                 console('afterrender');
 *             }
 *         },
 *         xField: 'category',
 *         yField: 'data1'
 *     }]
 *
 */
Ext.define('Ext.chart.series.Series', {

    requires: ['Ext.chart.Markers', 'Ext.chart.label.Label'],

    mixins: {
        observable: 'Ext.mixin.Observable'
    },

    /**
     * @property {String} type
     * The type of series. Set in subclasses.
     * @protected
     */
    type: null,

    /**
     * @property {String} seriesType
     * Default series sprite type.
     */
    seriesType: 'sprite',

    identifiablePrefix: 'ext-line-',

    observableType: 'series',

    config: {
        /**
         * @private
         * @cfg {Object} chart The chart that the series is bound.
         */
        chart: null,

        /**
         * @cfg {String} title
         * The human-readable name of the series.
         */
        title: null,

        /**
         * @cfg {Function} renderer
         * A function that can be overridden to set custom styling properties to each rendered element.
         * Passes in (sprite, record, attributes, index, store) to the function.
         * 
         * @param sprite The sprite affected by the renderer.
         * @param record The store record associated with the sprite.
         * @param attributes The list of attributes to be applied to the sprite.
         * @param index The index of the sprite.
         * @param store The store used by the series.
         * @return {*} The resultant attributes.
         */
        renderer: function (sprite, record, attributes, index, store) {
            return attributes;
        },

        /**
         * @cfg {Boolean} showInLegend
         * Whether to show this series in the legend.
         */
        showInLegend: true,

        //@private triggerdrawlistener flag
        triggerAfterDraw: false,

        /**
         * @private
         * Not supported.
         */
        themeStyle: {},

        /**
         * @cfg {Object} style Custom style configuration for the sprite used in the series.
         */
        style: {},

        /**
         * @cfg {Object} subStyle This is the cyclic used if the series has multiple sprites.
         */
        subStyle: {},

        /**
         * @cfg {Array} colors
         * An array of color values which will be used, in order, as the pie slice fill colors.
         */
        colors: null,

        /**
         * @protected
         * @cfg {Object} store The store of values used in the series.
         */
        store: null,

        /**
         * @cfg {Object} label
         * The style object for labels.
         */
        label: {textBaseline: 'middle', textAlign: 'center', font: '14px Helvetica'},

        /**
         * @cfg {Number} labelOverflowPadding
         * Extra distance value for which the labelOverflow listener is triggered.
         */
        labelOverflowPadding: 5,

        /**
         * @cfg {String} labelField
         * The store record field name to be used for the series labels.
         */
        labelField: null,

        /**
         * @cfg {Object} marker
         * The sprite template used by marker instances on the series.
         */
        marker: null,

        /**
         * @cfg {Object} markerSubStyle
         * This is cyclic used if series have multiple marker sprites.
         */
        markerSubStyle: null,

        /**
         * @protected
         * @cfg {Object} itemInstancing The sprite template used to create sprite instances in the series.
         */
        itemInstancing: null,

        /**
         * @cfg {Object} background Sets the background of the surface the series is attached.
         */
        background: null,

        /**
         * @cfg {Object} highlightItem The item currently highlighted in the series.
         */
        highlightItem: null,

        /**
         * @protected
         * @cfg {Object} surface The surface that the series is attached.
         */
        surface: null,

        /**
         * @protected
         * @cfg {Object} overlaySurface The surface that series markers are attached.
         */
        overlaySurface: null,

        /**
         * @cfg {Boolean|Array} hidden
         */
        hidden: false,

        /**
         * @cfg {Object} highlightCfg The sprite configuration used when highlighting items in the series.
         */
        highlightCfg: null
    },

    directions: [],

    sprites: null,

    getFields: function (fieldCategory) {
        var me = this,
            fields = [], fieldsItem,
            i, ln;
        for (i = 0, ln = fieldCategory.length; i < ln; i++) {
            fieldsItem = me['get' + fieldCategory[i] + 'Field']();
            fields.push(fieldsItem);
        }
        return fields;
    },

    updateColors: function (colorSet) {
        this.setSubStyle({fillStyle: colorSet});
        this.doUpdateStyles();
    },

    applyHighlightCfg: function (highlight, oldHighlight) {
        return Ext.apply(oldHighlight || {}, highlight);
    },

    applyItemInstancing: function (instancing, oldInstancing) {
        return Ext.merge(oldInstancing || {}, instancing);
    },

    setAttributesForItem: function (item, change) {
        if (item && item.sprite) {
            if (item.sprite.itemsMarker && item.category === 'items') {
                item.sprite.putMarker(item.category, change, item.index, false, true);
            }
            if (item.sprite.isMarkerHolder && item.category === 'markers') {
                item.sprite.putMarker(item.category, change, item.index, false, true);
            } else if (item.sprite instanceof Ext.draw.sprite.Instancing) {
                item.sprite.setAttributesFor(item.index, change);
            } else {

                item.sprite.setAttributes(change);
            }
        }
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
        this.setAttributesForItem(oldHighlightItem, {highlighted: false});
        this.setAttributesForItem(newHighlightItem, {highlighted: true});
    },

    constructor: function (config) {
        var me = this;
        me.getId();
        me.sprites = [];
        me.dataRange = [];
        Ext.ComponentManager.register(me);
        me.mixins.observable.constructor.apply(me, arguments);
    },

    applyStore: function (store) {
        return Ext.StoreManager.lookup(store);
    },

    getStore: function () {
        return this._store || this.getChart() && this.getChart().getStore();
    },

    updateStore: function (newStore, oldStore) {
        var me = this,
            chartStore = this.getChart() && this.getChart().getStore();
        newStore = newStore || chartStore;
        oldStore = oldStore || chartStore;

        if (oldStore) {
            oldStore.un('updaterecord', 'onUpdateRecord', me);
            oldStore.un('refresh', 'refresh', me);
        }
        if (newStore) {
            newStore.on('updaterecord', 'onUpdateRecord', me);
            newStore.on('refresh', 'refresh', me);
            me.refresh();
        }
    },

    onStoreChanged: function () {
        var store = this.getStore();
        if (store) {
            this.refresh();
        }
    },

    coordinateStacked: function (direction, directionOffset, directionCount) {
        var me = this,
            store = me.getStore(),
            items = store.getData().items,
            axis = me['get' + direction + 'Axis'](),
            hidden = me.getHidden(),
            range = {min: 0, max: 0},
            directions = me['fieldCategory' + direction],
            fieldCategoriesItem,
            i, j, k, fields, field, data, dataStart = [], style = {},
            stacked = me.getStacked(),
            sprites = me.getSprites();

        if (sprites.length > 0) {
            for (i = 0; i < directions.length; i++) {
                fieldCategoriesItem = directions[i];
                fields = me.getFields([fieldCategoriesItem]);
                for (j = 0; j < items.length; j++) {
                    dataStart[j] = 0;
                }
                for (j = 0; j < fields.length; j++) {
                    style = {};
                    field = fields[j];
                    if (hidden[j]) {
                        style['dataStart' + fieldCategoriesItem] = dataStart;
                        style['data' + fieldCategoriesItem] = dataStart;
                        sprites[j].setAttributes(style);
                        continue;
                    }
                    data = me.coordinateData(items, field, axis);
                    if (stacked) {
                        style['dataStart' + fieldCategoriesItem] = dataStart;
                        dataStart = dataStart.slice(0);
                        for (k = 0; k < items.length; k++) {
                            dataStart[k] += data[k];
                        }
                        style['data' + fieldCategoriesItem] = dataStart;
                    } else {
                        style['dataStart' + fieldCategoriesItem] = dataStart;
                        style['data' + fieldCategoriesItem] = data;
                    }
                    sprites[j].setAttributes(style);
                    if (stacked) {
                        me.getRangeOfData(dataStart, range);
                    } else {
                        me.getRangeOfData(data, range);
                    }
                }
            }
            me.dataRange[directionOffset] = range.min;
            me.dataRange[directionOffset + directionCount] = range.max;
            style = {};
            style['dataMin' + direction] = range.min;
            style['dataMax' + direction] = range.max;
            for (i = 0; i < sprites.length; i++) {
                sprites[i].setAttributes(style);
            }
        }
    },

    coordinate: function (direction, directionOffset, directionCount) {
        var me = this,
            store = me.getStore(),
            items = store.getData().items,
            axis = me['get' + direction + 'Axis'](),
            range = {min: Infinity, max: -Infinity},
            fieldCategory = me['fieldCategory' + direction] || [direction],
            fields = me.getFields(fieldCategory),
            i, field, data, style = {},
            sprites = me.getSprites();
        if (sprites.length > 0) {
            for (i = 0; i < fieldCategory.length; i++) {
                field = fields[i];
                data = me.coordinateData(items, field, axis);
                me.getRangeOfData(data, range);
                style['data' + fieldCategory[i]] = data;
            }
            me.dataRange[directionOffset] = range.min;
            me.dataRange[directionOffset + directionCount] = range.max;
            style['dataMin' + direction] = range.min;
            style['dataMax' + direction] = range.max;
            for (i = 0; i < sprites.length; i++) {
                sprites[i].setAttributes(style);
            }
        }
    },

    /**
     * @private
     * This method will return an array containing data coordinated by a specific axis.
     * @param items
     * @param field
     * @param axis
     * @return {Array}
     */
    coordinateData: function (items, field, axis) {
        var data = [],
            length = items.length,
            layout = axis && axis.getLayout(),
            coord = axis ? function (x, field, idx, items) {
                return layout.getCoordFor(x, field, idx, items);
            } : function (x) { return +x; },
            i;
        for (i = 0; i < length; i++) {
            data[i] = coord(items[i].data[field], field, i, items);
        }
        return data;
    },

    getRangeOfData: function (data, range) {
        var i, length = data.length,
            value, min = range.min, max = range.max;
        for (i = 0; i < length; i++) {
            value = data[i];
            if (value < min) {
                min = value;
            }
            if (value > max) {
                max = value;
            }
        }
        range.min = min;
        range.max = max;
    },

    updateLabelData: function () {
        var me = this,
            store = me.getStore(),
            items = store.getData().items,
            sprites = me.getSprites(),
            labelField = me.getLabelField(),
            i, ln, labels;
        if (sprites.length > 0 && labelField) {
            labels = [];
            for (i = 0, ln = items.length; i < ln; i++) {
                labels.push(items[i].get(labelField));
            }
            for (i = 0, ln = sprites.length; i < ln; i++) {
                sprites[i].setAttributes({labels: labels});
            }
        }
    },

    processData: function () {
        if (!this.getStore()) {
            return;
        }

        var me = this,
            directions = this.directions,
            i, ln = directions.length,
            fieldCategory, axis;
        for (i = 0; i < ln; i++) {
            fieldCategory = directions[i];
            if (me['get' + fieldCategory + 'Axis']) {
                axis = me['get' + fieldCategory + 'Axis']();
                if (axis) {
                    axis.processData(me);
                    continue;
                }
            }
            if (me['coordinate' + fieldCategory]) {
                me['coordinate' + fieldCategory]();
            }
        }
        me.updateLabelData();
    },

    applyBackground: function (background) {
        if (this.getChart()) {
            this.getSurface().setBackground(background);
            return this.getSurface().getBackground();
        } else {
            return background;
        }
    },

    updateChart: function (newChart, oldChart) {
        var me = this;
        if (oldChart) {
            oldChart.un("axeschanged", 'onAxesChanged', me);
            // TODO: destroy them
            me.sprites = [];
            me.setSurface(null);
            me.setOverlaySurface(null);
            me.onChartDetached(oldChart);
        }
        if (newChart) {
            me.setSurface(newChart.getSurface(this.getId() + '-surface', 'series'));
            me.setOverlaySurface(newChart.getSurface(me.getId() + '-overlay-surface', 'overlay'));
            me.getOverlaySurface().waitFor(me.getSurface());

            newChart.on("axeschanged", 'onAxesChanged', me);
            if (newChart.getAxes()) {
                me.onAxesChanged(newChart);
            }
            me.onChartAttached(newChart);
        }

        me.updateStore(me._store, null);
    },

    onAxesChanged: function (chart) {
        var me = this,
            axes = chart.getAxes(), axis,
            directionMap = {}, directionMapItem,
            fieldMap = {}, fieldMapItem,
            directions = this.directions, direction,
            i, ln, j, ln2, k, ln3;

        for (i = 0, ln = directions.length; i < ln; i++) {
            direction = directions[i];
            fieldMap[direction] = me.getFields(me['fieldCategory' + direction]);
        }

        for (i = 0, ln = axes.length; i < ln; i++) {
            axis = axes[i];
            if (!directionMap[axis.getDirection()]) {
                directionMap[axis.getDirection()] = [axis];
            } else {
                directionMap[axis.getDirection()].push(axis);
            }
        }

        for (i = 0, ln = directions.length; i < ln; i++) {
            direction = directions[i];
            if (directionMap[direction]) {
                directionMapItem = directionMap[direction];
                for (j = 0, ln2 = directionMapItem.length; j < ln2; j++) {
                    axis = directionMapItem[j];
                    if (axis.getFields().length === 0) {
                        me['set' + direction + 'Axis'](axis);
                    } else {
                        fieldMapItem = fieldMap[direction];
                        if (fieldMapItem) {
                            for (k = 0, ln3 = fieldMapItem.length; k < ln3; k++) {
                                if (axis.fieldsMap[fieldMapItem[k]]) {
                                    me['set' + direction + 'Axis'](axis);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    onChartDetached: function (oldChart) {
        this.fireEvent("chartdetached", oldChart);
    },

    onChartAttached: function (chart) {
        var me = this;
        me.setBackground(me.getBackground());
        me.fireEvent("chartattached", chart);
        me.processData();
    },

    updateOverlaySurface: function (overlaySurface) {
        var me = this;
        if (overlaySurface) {
            if (me.getLabel()) {
                me.getOverlaySurface().add(me.getLabel());
            }
        }
    },

    applyLabel: function (newLabel, oldLabel) {
        if (!oldLabel) {
            oldLabel = new Ext.chart.Markers({zIndex: 10});
            oldLabel.setTemplate(new Ext.chart.label.Label(newLabel));
        } else {
            oldLabel.getTemplate().setAttributes(newLabel);
        }
        return oldLabel;
    },

    createItemInstancingSprite: function (sprite, itemInstancing) {
        var me = this,
            template,
            markers = new Ext.chart.Markers();

        markers.setAttributes({zIndex: 1e100});
        var config = Ext.apply({}, itemInstancing);
        if (me.getHighlightCfg()) {
            config.highlightCfg = me.getHighlightCfg();
            config.modifiers = ['highlight'];
        }
        markers.setTemplate(config);
        template = markers.getTemplate();
        template.setAttributes(me.getStyle());
        template.fx.on('animationstart', 'onSpriteAnimationStart', this);
        template.fx.on('animationend', 'onSpriteAnimationEnd', this);
        sprite.bindMarker("items", markers);

        me.getSurface().add(markers);
        return markers;
    },

    getDefaultSpriteConfig: function () {
        return {
            type: this.seriesType
        };
    },

    createSprite: function () {
        var me = this,
            surface = me.getSurface(),
            itemInstancing = me.getItemInstancing(),
            marker, config,
            sprite = surface.add(me.getDefaultSpriteConfig());

        sprite.setAttributes(this.getStyle());

        if (itemInstancing) {
            sprite.itemsMarker = me.createItemInstancingSprite(sprite, itemInstancing);
        }

        if (sprite.bindMarker) {
            if (me.getMarker()) {
                marker = new Ext.chart.Markers();
                config = Ext.merge({}, me.getMarker());
                if (me.getHighlightCfg()) {
                    config.highlightCfg = me.getHighlightCfg();
                    config.modifiers = ['highlight'];
                }
                marker.setTemplate(config);
                marker.getTemplate().fx.setCustomDuration({
                    translationX: 0,
                    translationY: 0
                });
                sprite.dataMarker = marker;
                sprite.bindMarker("markers", marker);
                me.getOverlaySurface().add(marker);
            }
            if (me.getLabelField()) {
                sprite.bindMarker("labels", me.getLabel());
            }
        }

        if (sprite.setDataItems) {
            sprite.setDataItems(me.getStore().getData());
        }

        sprite.fx.on('animationstart', 'onSpriteAnimationStart', me);
        sprite.fx.on('animationend', 'onSpriteAnimationEnd', me);

        me.sprites.push(sprite);

        return sprite;
    },

    /**
     * Performs drawing of this series.
     */
    getSprites: Ext.emptyFn,

    onUpdateRecord: function () {
        // TODO: do something REALLY FAST.
        this.processData();
    },

    refresh: function () {
        this.processData();
    },

    isXType: function (xtype) {
        return xtype === 'series';
    },

    getItemId: function () {
        return this.getId();
    },

    applyStyle: function (style, oldStyle) {
        // TODO: Incremental setter
        var cls = Ext.ClassManager.get(Ext.ClassManager.getNameByAlias('sprite.' + this.seriesType));
        if (cls && cls.def) {
            style = cls.def.normalize(style);
        }
        return Ext.apply(oldStyle || Ext.Object.chain(this.getThemeStyle()), style);
    },

    applyMarker: function (marker, oldMarker) {
        var type = (marker && marker.type) || (oldMarker && oldMarker.type) || this.seriesType,
            cls;
        if (type) {
            cls = Ext.ClassManager.get(Ext.ClassManager.getNameByAlias('sprite.' + type));
            if (cls && cls.def) {
                marker = cls.def.normalize(marker, true);
                marker.type = type;
                return Ext.merge(oldMarker || {}, marker);
            }
            return Ext.merge(oldMarker || {}, marker);
        }
    },

    applyMarkerSubStyle: function (marker, oldMarker) {
        var type = (marker && marker.type) || (oldMarker && oldMarker.type) || this.seriesType,
            cls;
        if (type) {
            cls = Ext.ClassManager.get(Ext.ClassManager.getNameByAlias('sprite.' + type));
            if (cls && cls.def) {
                marker = cls.def.batchedNormalize(marker, true);
                return Ext.merge(oldMarker || {}, marker);
            }
            return Ext.merge(oldMarker || {}, marker);
        }
    },

    applySubStyle: function (subStyle, oldSubStyle) {
        var cls = Ext.ClassManager.get(Ext.ClassManager.getNameByAlias('sprite.' + this.seriesType));
        if (cls && cls.def) {
            subStyle = cls.def.batchedNormalize(subStyle, true);
            return Ext.merge(oldSubStyle || {}, subStyle);
        }
        return Ext.merge(oldSubStyle || {}, subStyle);
    },

    updateHidden: function (hidden) {
        // TODO: remove this when jacky fix the problem.
        this.getColors();
        this.getSubStyle();
        this.setSubStyle({hidden: hidden});
        this.processData();
        this.doUpdateStyles();
    },

    /**
     *
     * @param {Number} index
     * @param {Boolean} value
     */
    setHiddenByIndex: function (index, value) {
        if (Ext.isArray(this.getHidden())) {
            this.getHidden()[index] = value;
            this.updateHidden(this.getHidden());
        } else {
            this.setHidden(value);
        }
    },

    updateStyle: function () {
        this.doUpdateStyles();
    },

    updateSubStyle: function () {
        this.doUpdateStyles();
    },

    doUpdateStyles: function () {
        var sprites = this.sprites,
            itemInstancing = this.getItemInstancing(),
            i = 0, ln = sprites && sprites.length,
            markerCfg = this.getMarker(),
            style;
        for (; i < ln; i++) {
            style = this.getStyleByIndex(i);
            if (itemInstancing) {
                sprites[i].itemsMarker.getTemplate().setAttributes(style);
            } else {
                sprites[i].setAttributes(style);
            }
            if (markerCfg && sprites[i].dataMarker) {
                sprites[i].dataMarker.getTemplate().setAttributes(this.getMarkerStyleByIndex(i));
            }
        }
    },

    getMarkerStyleByIndex: function (i) {
        return this.getOverriddenStyleByIndex(i, this.getOverriddenStyleByIndex(i, this.getMarkerSubStyle(), this.getMarker()), this.getStyleByIndex(i));
    },

    getStyleByIndex: function (i) {
        return this.getOverriddenStyleByIndex(i, this.getSubStyle(), this.getStyle());
    },

    getOverriddenStyleByIndex: function (i, subStyle, baseStyle) {
        var subStyleItem,
            result = Ext.Object.chain(baseStyle || {});
        for (var name in subStyle) {
            subStyleItem = subStyle[name];
            if (Ext.isArray(subStyleItem)) {
                result[name] = subStyleItem[i % subStyle[name].length];
            } else {
                result[name] = subStyleItem;
            }
        }
        return result;
    },

    /**
     * For a given x/y point relative to the main region, find a corresponding item from this
     * series, if any.
     * @param {Number} x
     * @param {Number} y
     * @param {Object} [target] optional target to receive the result
     * @return {Object} An object describing the item, or null if there is no matching item. The exact contents of
     * this object will vary by series type, but should always contain at least the following:
     *
     * @return {Ext.data.Model} return.record the record of the item.
     * @return {Array} return.point the x/y coordinates relative to the chart box of a single point
     * for this data item, which can be used as e.g. a tooltip anchor point.
     * @return {Ext.draw.sprite.Sprite} return.sprite the item's rendering Sprite.
     * @return {Number} return.subSprite the index if sprite is an instancing sprite.
     */
    getItemForPoint: Ext.emptyFn,

    onSpriteAnimationStart: function (sprite) {
        this.fireEvent('animationstart', sprite);
    },

    onSpriteAnimationEnd: function (sprite) {
        this.fireEvent('animationend', sprite);
    },

    /**
     * Provide legend information to target array.
     *
     * @param {Array} target
     *
     * The information consists:
     * @param {String} target.name
     * @param {String} target.markColor
     * @param {Boolean} target.disabled
     * @param {String} target.series
     * @param {Number} target.index
     */
    provideLegendInfo: function (target) {
        target.push({
            name: this.getTitle() || this.getId(),
            mark: 'black',
            disabled: false,
            series: this.getId(),
            index: 0
        });
    },

    destroy: function () {
        Ext.ComponentManager.unregister(this);
        var store = this.getStore();
        if (store && store.getAutoDestroy()) {
            Ext.destroy(store);
        }
        this.setStore(null);
        this.callSuper();
    }
});
