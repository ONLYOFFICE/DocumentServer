/**
 * @class Ext.chart.interactions.CrossZoom
 * @extends Ext.chart.interactions.Abstract
 *
 * The CrossZoom interaction allows the user to zoom in on a selected area of the chart.
 *
 *     @example preview
 *     var lineChart = new Ext.chart.CartesianChart({
 *         interactions: [{
 *             type: 'crosszoom'
 *         }],
 *         animate: true,
 *         store: {
 *           fields: ['name', 'data1', 'data2', 'data3', 'data4', 'data5'],
 *           data: [
 *               {'name':'metric one', 'data1':10, 'data2':12, 'data3':14, 'data4':8, 'data5':13},
 *               {'name':'metric two', 'data1':7, 'data2':8, 'data3':16, 'data4':10, 'data5':3},
 *               {'name':'metric three', 'data1':5, 'data2':2, 'data3':14, 'data4':12, 'data5':7},
 *               {'name':'metric four', 'data1':2, 'data2':14, 'data3':6, 'data4':1, 'data5':23},
 *               {'name':'metric five', 'data1':27, 'data2':38, 'data3':36, 'data4':13, 'data5':33}
 *           ]
 *         },
 *         axes: [{
 *             type: 'numeric',
 *             position: 'left',
 *             fields: ['data1'],
 *             title: {
 *                 text: 'Sample Values',
 *                 fontSize: 15
 *             },
 *             grid: true,
 *             minimum: 0
 *         }, {
 *             type: 'category',
 *             position: 'bottom',
 *             fields: ['name'],
 *             title: {
 *                 text: 'Sample Values',
 *                 fontSize: 15
 *             }
 *         }],
 *         series: [{
 *             type: 'line',
 *             highlight: {
 *                 size: 7,
 *                 radius: 7
 *             },
 *             style: {
 *                 stroke: 'rgb(143,203,203)'
 *             },
 *             xField: 'name',
 *             yField: 'data1',
 *             marker: {
 *                 type: 'path',
 *                 path: ['M', -2, 0, 0, 2, 2, 0, 0, -2, 'Z'],
 *                 stroke: 'blue',
 *                 lineWidth: 0
 *             }
 *         }, {
 *             type: 'line',
 *             highlight: {
 *                 size: 7,
 *                 radius: 7
 *             },
 *             fill: true,
 *             xField: 'name',
 *             yField: 'data3',
 *             marker: {
 *                 type: 'circle',
 *                 radius: 4,
 *                 lineWidth: 0
 *             }
 *         }]
 *     });
 *     Ext.Viewport.setLayout('fit');
 *     Ext.Viewport.add(lineChart);
 */
Ext.define('Ext.chart.interactions.CrossZoom', {

    extend: 'Ext.chart.interactions.Abstract',

    type: 'crosszoom',
    alias: 'interaction.crosszoom',

    config: {
        /**
         * @cfg {Object/Array} axes
         * Specifies which axes should be made navigable. The config value can take the following formats:
         *
         * - An Object whose keys correspond to the {@link Ext.chart.axis.Axis#position position} of each
         *   axis that should be made navigable. Each key's value can either be an Object with further
         *   configuration options for each axis or simply `true` for a default set of options.
         *       {
         *           type: 'crosszoom',
         *           axes: {
         *               left: {
         *                   maxZoom: 5,
         *                   allowPan: false
         *               },
         *               bottom: true
         *           }
         *       }
         *
         *   If using the full Object form, the following options can be specified for each axis:
         *
         *   - minZoom (Number) A minimum zoom level for the axis. Defaults to `1` which is its natural size.
         *   - maxZoom (Number) A maximum zoom level for the axis. Defaults to `10`.
         *   - startZoom (Number) A starting zoom level for the axis. Defaults to `1`.
         *   - allowZoom (Boolean) Whether zooming is allowed for the axis. Defaults to `true`.
         *   - allowPan (Boolean) Whether panning is allowed for the axis. Defaults to `true`.
         *   - startPan (Boolean) A starting panning offset for the axis. Defaults to `0`.
         *
         * - An Array of strings, each one corresponding to the {@link Ext.chart.axis.Axis#position position}
         *   of an axis that should be made navigable. The default options will be used for each named axis.
         *
         *       {
         *           type: 'crosszoom',
         *           axes: ['left', 'bottom']
         *       }
         *
         * If the `axes` config is not specified, it will default to making all axes navigable with the
         * default axis options.
         */
        axes: true,

        gesture: 'drag',

        undoButton: {}
    },

    stopAnimationBeforeSync: false,

    constructor: function () {
        this.callSuper(arguments);
        this.zoomHistory = [];
    },

    applyAxes: function (axesConfig) {
        var result = {};
        if (axesConfig === true) {
            return {
                top: {},
                right: {},
                bottom: {},
                left: {}
            };
        } else if (Ext.isArray(axesConfig)) {
            // array of axis names - translate to full object form
            result = {};
            Ext.each(axesConfig, function (axis) {
                result[axis] = {};
            });
        } else if (Ext.isObject(axesConfig)) {
            Ext.iterate(axesConfig, function (key, val) {
                // axis name with `true` value -> translate to object
                if (val === true) {
                    result[key] = {};
                } else if (val !== false) {
                    result[key] = val;
                }
            });
        }
        return result;
    },

    applyUndoButton: function (button, oldButton) {
        var me = this;
        if (button) {
            if (oldButton) {
                oldButton.destroy();
            }
            return Ext.create('Ext.Button', Ext.apply({
                cls: [],
                iconCls: 'refresh',
                text: 'Undo Zoom',
                iconMask: true,
                disabled: true,
                handler: function () {
                    me.undoZoom();
                }
            }, button));
        } else if (oldButton) {
            oldButton.destroy();
        }
    },

    getGestures: function () {
        var me = this,
            gestures = {};
        gestures[me.getGesture()] = 'onGesture';
        gestures[me.getGesture() + 'start'] = 'onGestureStart';
        gestures[me.getGesture() + 'end'] = 'onGestureEnd';
        gestures.doubletap = 'onDoubleTap';
        return gestures;
    },

    getSurface: function () {
        return this.getChart() && this.getChart().getSurface("overlay");
    },

    onGestureStart: function (e) {
        var me = this,
            chart = me.getChart(),
            region = chart.getInnerRegion(),
            xy = chart.element.getXY(),
            x = e.pageX - xy[0],
            y = e.pageY - xy[1],
            surface = this.getSurface();
        if (region[0] < x && x < region[0] + region[2] && region[1] < y && y < region[1] + region[3]) {
            me.lockEvents(me.getGesture());
            me.startX = x;
            me.startY = y;
            me.selectionRect = surface.add({
                type: 'rect',
                globalAlpha: 0.3,
                fillStyle: 'rgba(80,80,140,0.3)',
                strokeStyle: 'rgba(80,80,140,1)',
                lineWidth: 2,
                x: x,
                y: y,
                width: 0,
                height: 0,
                zIndex: 1000
            });
        }
    },

    onGesture: function (e) {
        var me = this;
        if (me.getLocks()[me.getGesture()] === me) {
            var chart = me.getChart(),
                surface = me.getSurface(),
                region = chart.getInnerRegion(),
                xy = chart.element.getXY(),
                x = e.pageX - xy[0],
                y = e.pageY - xy[1];
            if (x < region[0]) {
                x = region[0];
            } else if (x > region[0] + region[2]) {
                x = region[0] + region[2];
            }

            if (y < region[1]) {
                y = region[1];
            } else if (y > region[1] + region[3]) {
                y = region[1] + region[3];
            }
            me.selectionRect.setAttributes({
                width: x - me.startX,
                height: y - me.startY
            });
            if (Math.abs(me.startX - x) < 11 || Math.abs(me.startY - y) < 11) {
                me.selectionRect.setAttributes({globalAlpha: 0.3});
            } else {
                me.selectionRect.setAttributes({globalAlpha: 1});
            }
            surface.renderFrame();
        }
    },

    onGestureEnd: function (e) {
        var me = this;
        if (me.getLocks()[me.getGesture()] === me) {
            var chart = me.getChart(),
                surface = me.getSurface(),
                region = chart.getInnerRegion(),
                selectionRect = me.selectionRect,
                xy = chart.element.getXY(),
                x = e.pageX - xy[0],
                y = e.pageY - xy[1];
            if (x < region[0]) {
                x = region[0];
            } else if (x > region[0] + region[2]) {
                x = region[0] + region[2];
            }

            if (y < region[1]) {
                y = region[1];
            } else if (y > region[1] + region[3]) {
                y = region[1] + region[3];
            }

            if (Math.abs(me.startX - x) < 11 || Math.abs(me.startY - y) < 11) {
                surface.remove(me.selectionRect);
            } else {
                me.zoomBy([
                    (Math.min(me.startX, x) - region[0]) / region[2],
                    1 - (Math.max(me.startY, y) - region[1]) / region[3],
                    (Math.max(me.startX, x) - region[0]) / region[2],
                    1 - (Math.min(me.startY, y) - region[1]) / region[3]
                ]);

                selectionRect.setAttributes({
                    x: Math.min(me.startX, x),
                    y: Math.min(me.startY, y),
                    width: Math.abs(me.startX - x),
                    height: Math.abs(me.startY - y)
                });

                selectionRect.fx.setConfig(chart.getAnimate() || {duration: 0});
                selectionRect.setAttributes({
                    globalAlpha: 0,
                    x: region[0],
                    y: region[1],
                    width: region[2],
                    height: region[3]
                });
                chart.suspendThicknessChanged();
                selectionRect.fx.on('animationend', function () {
                    chart.resumeThicknessChanged();
                    surface.remove(me.selectionRect);
                });
            }

            this.selectionRect = null;
            surface.renderFrame();
            me.sync();
            me.unlockEvents(me.getGesture());
        }
    },

    zoomBy: function (region) {
        var me = this,
            axisConfigs = me.getAxes(),
            axes = me.getChart().getAxes(),
            config,
            zoomMap = {};

        for (var i = 0; i < axes.length; i++) {
            var axis = axes[i];
            config = axisConfigs[axis.getPosition()];
            if (config && config.allowZoom !== false) {
                var isSide = axis.isSide(),
                    oldRange = axis.getVisibleRange();
                zoomMap[axis.getId()] = oldRange.slice(0);
                if (!isSide) {
                    axis.setVisibleRange([
                        (oldRange[1] - oldRange[0]) * region[0] + oldRange[0],
                        (oldRange[1] - oldRange[0]) * region[2] + oldRange[0]
                    ]);
                } else {
                    axis.setVisibleRange([
                        (oldRange[1] - oldRange[0]) * region[1] + oldRange[0],
                        (oldRange[1] - oldRange[0]) * region[3] + oldRange[0]
                    ]);
                }
            }
        }

        me.zoomHistory.push(zoomMap);
        me.getUndoButton().setDisabled(false);
    },

    undoZoom: function () {
        var zoomMap = this.zoomHistory.pop(),
            axes = this.getChart().getAxes();
        if (zoomMap) {
            for (var i = 0; i < axes.length; i++) {
                var axis = axes[i];
                if (zoomMap[axis.getId()]) {
                    axis.setVisibleRange(zoomMap[axis.getId()]);
                }
            }
        }
        this.getUndoButton().setDisabled(this.zoomHistory.length === 0);
        this.sync();
    },

    onDoubleTap: function (e) {
        this.undoZoom();
    }
});