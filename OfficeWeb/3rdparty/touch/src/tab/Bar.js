/**
 * Ext.tab.Bar is used internally by {@link Ext.tab.Panel} to create the bar of tabs that appears at the top of the tab
 * panel. It's unusual to use it directly, instead see the {@link Ext.tab.Panel tab panel docs} for usage instructions.
 *
 * Used in the {@link Ext.tab.Panel} component to display {@link Ext.tab.Tab} components.
 *
 * @private
 */
Ext.define('Ext.tab.Bar', {
    extend: 'Ext.Toolbar',
    alternateClassName: 'Ext.TabBar',
    xtype : 'tabbar',

    requires: ['Ext.tab.Tab'],

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        baseCls: Ext.baseCSSPrefix + 'tabbar',

        // @private
        defaultType: 'tab',

        // @private
        layout: {
            type: 'hbox',
            align: 'middle'
        }
    },

    eventedConfig: {
        /**
         * @cfg {Number/String/Ext.Component} activeTab
         * The initially activated tab. Can be specified as numeric index,
         * component ID or as the component instance itself.
         * @accessor
         * @evented
         */
        activeTab: null
    },

    /**
     * @event tabchange
     * Fired when active tab changes.
     * @param {Ext.tab.Bar} this
     * @param {Ext.tab.Tab} newTab The new Tab
     * @param {Ext.tab.Tab} oldTab The old Tab
     */

    initialize: function() {
        var me = this;
        me.callParent();

        me.on({
            tap: 'onTabTap',

            delegate: '> tab',
            scope   : me
        });
    },

    // @private
    onTabTap: function(tab) {
        this.setActiveTab(tab);
    },

    /**
     * @private
     */
    applyActiveTab: function(newActiveTab, oldActiveTab) {
        if (!newActiveTab && newActiveTab !== 0) {
            return;
        }

        var newTabInstance = this.parseActiveTab(newActiveTab);

        if (!newTabInstance) {
            // <debug warn>
            if (oldActiveTab) {
                Ext.Logger.warn('Trying to set a non-existent activeTab');
            }
            // </debug>
            return;
        }
        return newTabInstance;
    },

    /**
     * @private
     * Default pack to center when docked to the bottom, otherwise default pack to left
     */
    doSetDocked: function(newDocked) {
        var layout = this.getLayout(),
            initialConfig = this.getInitialConfig(),
            pack;

        if (!initialConfig.layout || !initialConfig.layout.pack) {
            pack = (newDocked == 'bottom') ? 'center' : 'left';
            //layout isn't guaranteed to be instantiated so must test
            if (layout.isLayout) {
                layout.setPack(pack);
            } else {
                layout.pack = (layout && layout.pack) ? layout.pack : pack;
            }
        }
    },

    /**
     * @private
     * Sets the active tab
     */
    doSetActiveTab: function(newTab, oldTab) {
        if (newTab) {
            newTab.setActive(true);
        }

        //Check if the parent is present, if not it is destroyed
        if (oldTab && oldTab.parent) {
            oldTab.setActive(false);
        }
    },

    /**
     * @private
     * Parses the active tab, which can be a number or string
     */
    parseActiveTab: function(tab) {
        //we need to call getItems to initialize the items, otherwise they will not exist yet.
        if (typeof tab == 'number') {
            return this.getInnerItems()[tab];
        }
        else if (typeof tab == 'string') {
            tab = Ext.getCmp(tab);
        }
        return tab;
    }
});
