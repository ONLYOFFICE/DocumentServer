/**
 * The ItemInfo interaction allows displaying detailed information about a series data
 * point in a popup panel.
 *
 * To attach this interaction to a chart, include an entry in the chart's
 * {@link Ext.chart.AbstractChart#interactions interactions} config with the `iteminfo` type:
 *
 *     new Ext.chart.AbstractChart({
 *         renderTo: Ext.getBody(),
 *         width: 800,
 *         height: 600,
 *         store: store1,
 *         axes: [ ...some axes options... ],
 *         series: [ ...some series options... ],
 *         interactions: [{
 *             type: 'iteminfo',
 *             listeners: {
 *                 show: function(me, item, panel) {
 *                     panel.setHtml('Stock Price: $' + item.record.get('price'));
 *                 }
 *             }
 *         }]
 *     });
 */
Ext.define('Ext.chart.interactions.ItemInfo', {

    extend: 'Ext.chart.interactions.Abstract',

    type: 'iteminfo',
    alias: 'interaction.iteminfo',

    /**
     * @event show
     * Fires when the info panel is shown.
     * @param {Ext.chart.interactions.ItemInfo} this The interaction instance
     * @param {Object} item The item whose info is being displayed
     * @param {Ext.Panel} panel The panel for displaying the info
     */

    config: {
        /**
         * @cfg {String} gesture
         * Defines the gesture type that should trigger the item info panel to be displayed.
         */
        gesture: 'itemtap',

        /**
         * @cfg {Object} panel
         * An optional set of configuration overrides for the {@link Ext.Panel} that gets
         * displayed. This object will be merged with the default panel configuration.
         */
        panel: {
            modal: true,
            centered: true,
            width: 250,
            height: 300,
            styleHtmlContent: true,
            scrollable: 'vertical',
            hideOnMaskTap: true,
            fullscreen: false,
            hidden: true,
            zIndex: 30,
            items: [
                {
                    docked: 'top',
                    xtype: 'toolbar',
                    title: 'Item Detail'
                }
            ]
        }
    },

    applyPanel: function (panel, oldPanel) {
        return Ext.factory(panel, 'Ext.Panel', oldPanel);
    },

    updatePanel: function (panel, oldPanel) {
        if (panel) {
            panel.on('hide', "reset", this);
        }
        if (oldPanel) {
            oldPanel.un('hide', "reset", this);
        }
    },

    onGesture: function (series, item) {
        var me = this,
            panel = me.getPanel();
        me.item = item;
        me.fireEvent('show', me, item, panel);
        Ext.Viewport.add(panel);
        panel.show('pop');
        series.setAttributesForItem(item, { highlighted: true });
        me.sync();
    },

    reset: function () {
        var me = this,
            item = me.item;
        if (item) {
            item.series.setAttributesForItem(item, { highlighted: false });
            delete me.item;
            me.sync();
        }
    }
});
