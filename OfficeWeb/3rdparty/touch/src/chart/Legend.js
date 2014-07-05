/**
 * @class Ext.chart.Legend
 * @extends Ext.dataview.DataView
 * 
 * A default legend for charts.
 *
 *     @example preview
 *     var chart = new Ext.chart.Chart({
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
 *         legend: {
 *           position: 'bottom'
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
 *             type: 'area',
 *             title: ['Data1', 'Data2', 'Data3'],
 *             subStyle: {
 *                 fill: ['blue', 'green', 'red']
 *             },
 *             xField: 'name',
 *             yField: ['data1', 'data2', 'data3']
 *         
 *         }]
 *     });
 *     Ext.Viewport.setLayout('fit');
 *     Ext.Viewport.add(chart);
 */
Ext.define("Ext.chart.Legend", {
    xtype: 'legend',
    extend: "Ext.dataview.DataView",
    config: {
        itemTpl: [
            "<span class=\"x-legend-item-marker {[values.disabled?\'x-legend-inactive\':\'\']}\" style=\"background:{mark};\"></span>{name}"
        ],
        baseCls: 'x-legend',
        padding: 5,
        disableSelection: true,
        inline: true,
        /**
         * @cfg {String} position
         * @deprecated Use `docked` instead.
         * Delegates to `docked`
         */
        position: 'top',
        horizontalHeight: 48,
        verticalWidth: 150
    },

    constructor: function () {
        this.callSuper(arguments);

        var scroller = this.getScrollable().getScroller(),
            onDrag = scroller.onDrag;
        scroller.onDrag = function (e) {
            e.stopPropagation();
            onDrag.call(this, e);
        };
    },

    doSetDocked: function (docked) {
        this.callSuper(arguments);
        if (docked === 'top' || docked === 'bottom') {
            this.setLayout({type: 'hbox', pack: 'center'});
            this.setInline(true);
            // TODO: Remove this when possible
            this.setWidth(null);
            this.setHeight(this.getHorizontalHeight());
            this.setScrollable({direction: 'horizontal' });
        } else {
            this.setLayout({pack: 'center'});
            this.setInline(false);
            // TODO: Remove this when possible
            this.setWidth(this.getVerticalWidth());
            this.setHeight(null);
            this.setScrollable({direction: 'vertical' });
        }
    },

    updatePosition: function (position) {
        this.setDocked(position);
    },

    onItemTap: function (container, target, index, e) {
        this.callSuper(arguments);
        var me = this,
            store = me.getStore(),
            record = store && store.getAt(index);
        record.beginEdit();
        record.set('disabled', !record.get('disabled'));
        record.commit();
    }
});