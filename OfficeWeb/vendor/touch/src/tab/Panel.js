/**
 * @aside guide tabs
 * @aside video tabs-toolbars
 * @aside example tabs
 * @aside example tabs-bottom
 *
 * Tab Panels are a great way to allow the user to switch between several pages that are all full screen. Each
 * Component in the Tab Panel gets its own Tab, which shows the Component when tapped on. Tabs can be positioned at
 * the top or the bottom of the Tab Panel, and can optionally accept title and icon configurations.
 *
 * Here's how we can set up a simple Tab Panel with tabs at the bottom. Use the controls at the top left of the example
 * to toggle between code mode and live preview mode (you can also edit the code and see your changes in the live
 * preview):
 *
 *     @example miniphone preview
 *     Ext.create('Ext.TabPanel', {
 *         fullscreen: true,
 *         tabBarPosition: 'bottom',
 *
 *         defaults: {
 *             styleHtmlContent: true
 *         },
 *
 *         items: [
 *             {
 *                 title: 'Home',
 *                 iconCls: 'home',
 *                 html: 'Home Screen'
 *             },
 *             {
 *                 title: 'Contact',
 *                 iconCls: 'user',
 *                 html: 'Contact Screen'
 *             }
 *         ]
 *     });
 * One tab was created for each of the {@link Ext.Panel panels} defined in the items array. Each tab automatically uses
 * the title and icon defined on the item configuration, and switches to that item when tapped on. We can also position
 * the tab bar at the top, which makes our Tab Panel look like this:
 *
 *     @example miniphone preview
 *     Ext.create('Ext.TabPanel', {
 *         fullscreen: true,
 *
 *         defaults: {
 *             styleHtmlContent: true
 *         },
 *
 *         items: [
 *             {
 *                 title: 'Home',
 *                 html: 'Home Screen'
 *             },
 *             {
 *                 title: 'Contact',
 *                 html: 'Contact Screen'
 *             }
 *         ]
 *     });
 *
 */
Ext.define('Ext.tab.Panel', {
    extend: 'Ext.Container',
    xtype : 'tabpanel',
    alternateClassName: 'Ext.TabPanel',

    requires: ['Ext.tab.Bar'],

    config: {
        /**
         * @cfg {String} ui
         * Sets the UI of this component.
         * Available values are: `light` and `dark`.
         * @accessor
         */
        ui: 'dark',

        /**
         * @cfg {Object} tabBar
         * An Ext.tab.Bar configuration.
         * @accessor
         */
        tabBar: true,

        /**
         * @cfg {String} tabBarPosition
         * The docked position for the {@link #tabBar} instance.
         * Possible values are 'top' and 'bottom'.
         * @accessor
         */
        tabBarPosition: 'top',

        /**
         * @cfg layout
         * @inheritdoc
         */
        layout: {
            type: 'card',
            animation: {
                type: 'slide',
                direction: 'left'
            }
        },

        /**
         * @cfg cls
         * @inheritdoc
         */
        cls: Ext.baseCSSPrefix + 'tabpanel'

        /**
         * @cfg {Boolean/String/Object} scrollable
         * @accessor
         * @hide
         */

        /**
         * @cfg {Boolean/String/Object} scroll
         * @hide
         */
    },

    delegateListeners: {
        delegate: '> component',
        centeredchange: 'onItemCenteredChange',
        dockedchange: 'onItemDockedChange',
        floatingchange: 'onItemFloatingChange',
        disabledchange: 'onItemDisabledChange'
    },

    initialize: function() {
        this.callParent();

        this.on({
            order: 'before',
            activetabchange: 'doTabChange',
            delegate: '> tabbar',
            scope   : this
        });
    },

    /**
     * Tab panels should not be scrollable. Instead, you should add scrollable to any item that
     * you want to scroll.
     * @private
     */
    applyScrollable: function() {
        return false;
    },

    /**
     * Updates the Ui for this component and the {@link #tabBar}.
     */
    updateUi: function(newUi, oldUi) {
        this.callParent(arguments);

        if (this.initialized) {
            this.getTabBar().setUi(newUi);
        }
    },

    /**
     * @private
     */
    doSetActiveItem: function(newActiveItem, oldActiveItem) {
        if (newActiveItem) {
            var items = this.getInnerItems(),
                oldIndex = items.indexOf(oldActiveItem),
                newIndex = items.indexOf(newActiveItem),
                reverse = oldIndex > newIndex,
                animation = this.getLayout().getAnimation(),
                tabBar = this.getTabBar(),
                oldTab = tabBar.parseActiveTab(oldIndex),
                newTab = tabBar.parseActiveTab(newIndex);

            if (animation && animation.setReverse) {
                animation.setReverse(reverse);
            }

            this.callParent(arguments);

            if (newIndex != -1) {
                this.forcedChange = true;
                tabBar.setActiveTab(newIndex);
                this.forcedChange = false;

                if (oldTab) {
                    oldTab.setActive(false);
                }

                if (newTab) {
                    newTab.setActive(true);
                }
            }
        }
    },

    /**
     * Updates this container with the new active item.
     * @param {Object} tabBar
     * @param {Object} newTab
     * @return {Boolean}
     */
    doTabChange: function(tabBar, newTab) {
        var oldActiveItem = this.getActiveItem(),
            newActiveItem;

        this.setActiveItem(tabBar.indexOf(newTab));
        newActiveItem = this.getActiveItem();
        return this.forcedChange || oldActiveItem !== newActiveItem;
    },

    /**
     * Creates a new {@link Ext.tab.Bar} instance using {@link Ext#factory}.
     * @param {Object} config
     * @return {Object}
     * @private
     */
    applyTabBar: function(config) {
        if (config === true) {
            config = {};
        }

        if (config) {
            Ext.applyIf(config, {
                ui: this.getUi(),
                docked: this.getTabBarPosition()
            });
        }

        return Ext.factory(config, Ext.tab.Bar, this.getTabBar());
    },

    /**
     * Adds the new {@link Ext.tab.Bar} instance into this container.
     * @private
     */
    updateTabBar: function(newTabBar) {
        if (newTabBar) {
            this.add(newTabBar);
            this.setTabBarPosition(newTabBar.getDocked());
        }
    },

    /**
     * Updates the docked position of the {@link #tabBar}.
     * @private
     */
    updateTabBarPosition: function(position) {
        var tabBar = this.getTabBar();
        if (tabBar) {
            tabBar.setDocked(position);
        }
    },

    onItemAdd: function(card) {
        var me = this;

        if (!card.isInnerItem()) {
            return me.callParent(arguments);
        }

        var tabBar = me.getTabBar(),
            initialConfig = card.getInitialConfig(),
            tabConfig = initialConfig.tab || {},
            tabTitle = (card.getTitle) ? card.getTitle() : initialConfig.title,
            tabIconCls = (card.getIconCls) ? card.getIconCls() : initialConfig.iconCls,
            tabHidden = (card.getHidden) ? card.getHidden() : initialConfig.hidden,
            tabDisabled = (card.getDisabled) ? card.getDisabled() : initialConfig.disabled,
            tabBadgeText = (card.getBadgeText) ? card.getBadgeText() : initialConfig.badgeText,
            innerItems = me.getInnerItems(),
            index = innerItems.indexOf(card),
            tabs = tabBar.getItems(),
            activeTab = tabBar.getActiveTab(),
            currentTabInstance = (tabs.length >= innerItems.length) && tabs.getAt(index),
            tabInstance;

        if (tabTitle && !tabConfig.title) {
            tabConfig.title = tabTitle;
        }

        if (tabIconCls && !tabConfig.iconCls) {
            tabConfig.iconCls = tabIconCls;
        }

        if (tabHidden && !tabConfig.hidden) {
            tabConfig.hidden = tabHidden;
        }

        if (tabDisabled && !tabConfig.disabled) {
            tabConfig.disabled = tabDisabled;
        }

        if (tabBadgeText && !tabConfig.badgeText) {
            tabConfig.badgeText = tabBadgeText;
        }

        //<debug warn>
        if (!currentTabInstance && !tabConfig.title && !tabConfig.iconCls) {
            if (!tabConfig.title && !tabConfig.iconCls) {
                Ext.Logger.error('Adding a card to a tab container without specifying any tab configuration');
            }
        }
        //</debug>

        tabInstance = Ext.factory(tabConfig, Ext.tab.Tab, currentTabInstance);

        if (!currentTabInstance) {
            tabBar.insert(index, tabInstance);
        }

        card.tab = tabInstance;

        me.callParent(arguments);

        if (!activeTab && activeTab !== 0) {
            tabBar.setActiveTab(tabBar.getActiveItem());
        }
    },

    /**
     * If an item gets enabled/disabled and it has an tab, we should also enable/disable that tab
     * @private
     */
    onItemDisabledChange: function(item, newDisabled) {
        if (item && item.tab) {
            item.tab.setDisabled(newDisabled);
        }
    },

    // @private
    onItemRemove: function(item, index) {
        this.getTabBar().remove(item.tab, this.getAutoDestroy());

        this.callParent(arguments);
    }
}, function() {
    //<deprecated product=touch since=2.0>
    /**
     * @cfg {Boolean} tabBarDock
     * @inheritdoc Ext.tab.Panel#tabBarPosition
     * @deprecated 2.0.0 Please use {@link #tabBarPosition} instead.
     */
    Ext.deprecateProperty(this, 'tabBarDock', 'tabBarPosition');
    //</deprecated>
});
