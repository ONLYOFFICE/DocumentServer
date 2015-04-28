/**
 * NestedList provides a miller column interface to navigate between nested sets
 * and provide a clean interface with limited screen real-estate.
 *
 *     @example miniphone preview
 *      var data = {
 *          text: 'Groceries',
 *          items: [{
 *              text: 'Drinks',
 *              items: [{
 *                  text: 'Water',
 *                  items: [{
 *                      text: 'Sparkling',
 *                      leaf: true
 *                  }, {
 *                      text: 'Still',
 *                      leaf: true
 *                  }]
 *              }, {
 *                  text: 'Coffee',
 *                  leaf: true
 *              }, {
 *                  text: 'Espresso',
 *                  leaf: true
 *              }, {
 *                  text: 'Redbull',
 *                  leaf: true
 *              }, {
 *                  text: 'Coke',
 *                  leaf: true
 *              }, {
 *                  text: 'Diet Coke',
 *                  leaf: true
 *              }]
 *          }, {
 *              text: 'Fruit',
 *              items: [{
 *                  text: 'Bananas',
 *                  leaf: true
 *              }, {
 *                  text: 'Lemon',
 *                  leaf: true
 *              }]
 *          }, {
 *              text: 'Snacks',
 *              items: [{
 *                  text: 'Nuts',
 *                  leaf: true
 *              }, {
 *                  text: 'Pretzels',
 *                  leaf: true
 *              }, {
 *                  text: 'Wasabi Peas',
 *                  leaf: true
 *              }]
 *          }]
 *      };
 *
 *      Ext.define('ListItem', {
 *          extend: 'Ext.data.Model',
 *          config: {
 *              fields: [{
 *                  name: 'text',
 *                  type: 'string'
 *              }]
 *          }
 *      });
 *
 *      var store = Ext.create('Ext.data.TreeStore', {
 *          model: 'ListItem',
 *          defaultRootProperty: 'items',
 *          root: data
 *      });
 *
 *      var nestedList = Ext.create('Ext.NestedList', {
 *          fullscreen: true,
 *          title: 'Groceries',
 *          displayField: 'text',
 *          store: store
 *      });
 *
 * @aside guide nested_list
 * @aside example nested-list
 * @aside example navigation-view
 */
Ext.define('Ext.dataview.NestedList', {
    alternateClassName: 'Ext.NestedList',
    extend: 'Ext.Container',
    xtype: 'nestedlist',
    requires: [
        'Ext.List',
        'Ext.TitleBar',
        'Ext.Button',
        'Ext.XTemplate',
        'Ext.data.StoreManager',
        'Ext.data.NodeStore',
        'Ext.data.TreeStore'
    ],

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        cls: Ext.baseCSSPrefix + 'nested-list',

        /**
         * @cfg {String/Object/Boolean} cardSwitchAnimation
         * Animation to be used during transitions of cards.
         * @removed 2.0.0 please use {@link Ext.layout.Card#animation}
         */

        /**
         * @cfg {String} backText
         * The label to display for the back button.
         * @accessor
         */
        backText: 'Back',

        /**
         * @cfg {Boolean} useTitleAsBackText
         * `true` to use title as a label for back button.
         * @accessor
         */
        useTitleAsBackText: true,

        /**
         * @cfg {Boolean} updateTitleText
         * Update the title with the currently selected category.
         * @accessor
         */
        updateTitleText: true,

        /**
         * @cfg {String} displayField
         * Display field to use when setting item text and title.
         * This configuration is ignored when overriding {@link #getItemTextTpl} or
         * {@link #getTitleTextTpl} for the item text or title.
         * @accessor
         */
        displayField: 'text',

        /**
         * @cfg {String} loadingText
         * Loading text to display when a subtree is loading.
         * @accessor
         */
        loadingText: 'Loading...',

        /**
         * @cfg {String} emptyText
         * Empty text to display when a subtree is empty.
         * @accessor
         */
        emptyText: 'No items available.',

        /**
         * @cfg {Boolean/Function} onItemDisclosure
         * Maps to the {@link Ext.List#onItemDisclosure} configuration for individual lists.
         * @accessor
         */
        onItemDisclosure: false,

        /**
         * @cfg {Boolean} allowDeselect
         * Set to `true` to allow the user to deselect leaf items via interaction.
         * @accessor
         */
        allowDeselect: false,

        /**
         * @deprecated 2.0.0 Please set the {@link #toolbar} configuration to `false` instead
         * @cfg {Boolean} useToolbar `true` to show the header toolbar.
         * @accessor
         */
        useToolbar: null,

        /**
         * @cfg {Ext.Toolbar/Object/Boolean} toolbar
         * The configuration to be used for the toolbar displayed in this nested list.
         * @accessor
         */
        toolbar: {
            docked: 'top',
            xtype: 'titlebar',
            ui: 'light',
            inline: true
        },

        /**
         * @cfg {String} title The title of the toolbar
         * @accessor
         */
        title: '',

        /**
         * @cfg {String} layout
         * @hide
         * @accessor
         */
        layout: {
            type: 'card',
            animation: {
                type: 'slide',
                duration: 250,
                direction: 'left'
            }
        },

        /**
         * @cfg {Ext.data.TreeStore/String} store The tree store to be used for this nested list.
         */
        store: null,

        /**
         * @cfg {Ext.Container} detailContainer The container of the `detailCard`.
         * @accessor
         */
        detailContainer: undefined,

        /**
         * @cfg {Ext.Component} detailCard to provide a final card for leaf nodes.
         * @accessor
         */
        detailCard: null,

        /**
         * @cfg {Object} backButton The configuration for the back button used in the nested list.
         */
        backButton: {
            ui: 'back',
            hidden: true
        },

        /**
         * @cfg {Object} listConfig An optional config object which is merged with the default
         * configuration used to create each nested list.
         */
        listConfig: null,

        // @private
        lastNode: null,

        // @private
        lastActiveList: null
    },

    /**
     * @event itemtap
     * Fires when a node is tapped on.
     * @param {Ext.dataview.NestedList} this
     * @param {Ext.dataview.List} list The Ext.dataview.List that is currently active.
     * @param {Number} index The index of the item tapped.
     * @param {Ext.dom.Element} target The element tapped.
     * @param {Ext.data.Record} record The record tapped.
     * @param {Ext.event.Event} e The event object.
     */

    /**
     * @event itemdoubletap
     * Fires when a node is double tapped on.
     * @param {Ext.dataview.NestedList} this
     * @param {Ext.dataview.List} list The Ext.dataview.List that is currently active.
     * @param {Number} index The index of the item that was tapped.
     * @param {Ext.dom.Element} target The element tapped.
     * @param {Ext.data.Record} record The record tapped.
     * @param {Ext.event.Event} e The event object.
     */

    /**
     * @event containertap
     * Fires when a tap occurs and it is not on a template node.
     * @param {Ext.dataview.NestedList} this
     * @param {Ext.dataview.List} list The Ext.dataview.List that is currently active.
     * @param {Ext.event.Event} e The raw event object.
     */

    /**
     * @event selectionchange
     * Fires when the selected nodes change.
     * @param {Ext.dataview.NestedList} this
     * @param {Ext.dataview.List} list The Ext.dataview.List that is currently active.
     * @param {Array} selections Array of the selected nodes.
     */

    /**
     * @event beforeselectionchange
     * Fires before a selection is made.
     * @param {Ext.dataview.NestedList} this
     * @param {Ext.dataview.List} list The Ext.dataview.List that is currently active.
     * @param {HTMLElement} node The node to be selected.
     * @param {Array} selections Array of currently selected nodes.
     * @deprecated 2.0.0 Please listen to the {@link #selectionchange} event with an order of `before` instead.
     */

    /**
     * @event listchange
     * Fires when the user taps a list item.
     * @param {Ext.dataview.NestedList} this
     * @param {Object} listitem The new active list.
     */

    /**
     * @event leafitemtap
     * Fires when the user taps a leaf list item.
     * @param {Ext.dataview.NestedList} this
     * @param {Ext.List} list The subList the item is on.
     * @param {Number} index The index of the item tapped.
     * @param {Ext.dom.Element} target The element tapped.
     * @param {Ext.data.Record} record The record tapped.
     * @param {Ext.event.Event} e The event.
     */

    /**
     * @event back
     * @preventable doBack
     * Fires when the user taps Back.
     * @param {Ext.dataview.NestedList} this
     * @param {HTMLElement} node The node to be selected.
     * @param {Ext.dataview.List} lastActiveList The Ext.dataview.List that was last active.
     * @param {Boolean} detailCardActive Flag set if the detail card is currently active.
     */

    /**
     * @event beforeload
     * Fires before a request is made for a new data object.
     * @param {Ext.dataview.NestedList} this
     * @param {Ext.data.Store} store The store instance.
     * @param {Ext.data.Operation} operation The Ext.data.Operation object that will be passed to the Proxy to
     * load the Store.
     */

    /**
     * @event load
     * Fires whenever records have been loaded into the store.
     * @param {Ext.dataview.NestedList} this
     * @param {Ext.data.Store} store The store instance.
     * @param {Ext.util.Grouper[]} records An array of records.
     * @param {Boolean} successful `true` if the operation was successful.
     * @param {Ext.data.Operation} operation The associated operation.
     */
    constructor: function (config) {
        if (Ext.isObject(config)) {
            if (config.getTitleTextTpl) {
                this.getTitleTextTpl = config.getTitleTextTpl;
            }
            if (config.getItemTextTpl) {
                this.getItemTextTpl = config.getItemTextTpl;
            }
        }
        this.callParent(arguments);
    },

    onItemInteraction: function () {
        if (this.isGoingTo) {
            return false;
        }
    },

    applyDetailContainer: function (config) {
        if (!config) {
            config = this;
        }

        return config;
    },

    updateDetailContainer: function (newContainer, oldContainer) {
        if (newContainer) {
            newContainer.onBefore('activeitemchange', 'onBeforeDetailContainerChange', this);
            newContainer.onAfter('activeitemchange', 'onDetailContainerChange', this);
        }
    },

    onBeforeDetailContainerChange: function () {
        this.isGoingTo = true;
    },

    onDetailContainerChange: function () {
        this.isGoingTo = false;
    },

    /**
     * Called when an list item has been tapped.
     * @param {Ext.List} list The subList the item is on.
     * @param {Number} index The id of the item tapped.
     * @param {Ext.Element} target The list item tapped.
     * @param {Ext.data.Record} record The record which as tapped.
     * @param {Ext.event.Event} e The event.
     */
    onItemTap: function (list, index, target, record, e) {
        var me = this,
            store = list.getStore(),
            node = store.getAt(index);

        me.fireEvent('itemtap', this, list, index, target, record, e);
        if (node.isLeaf()) {
            me.fireEvent('leafitemtap', this, list, index, target, record, e);
            me.goToLeaf(node);
        }
        else {
            this.goToNode(node);
        }
    },

    onBeforeSelect: function () {
        this.fireEvent.apply(this, [].concat('beforeselect', this, Array.prototype.slice.call(arguments)));
    },

    onContainerTap: function () {
        this.fireEvent.apply(this, [].concat('containertap', this, Array.prototype.slice.call(arguments)));
    },

    onSelectionChange: function () {
        this.fireEvent.apply(this, [].concat('selectionchange', this, Array.prototype.slice.call(arguments)));
    },

    onItemDoubleTap: function () {
        this.fireEvent.apply(this, [].concat('itemdoubletap', this, Array.prototype.slice.call(arguments)));
    },

    onStoreBeforeLoad: function () {
        var loadingText = this.getLoadingText(),
            scrollable = this.getScrollable();

        if (loadingText) {
            this.setMasked({
                xtype: 'loadmask',
                message: loadingText
            });

            //disable scrolling while it is masked
            if (scrollable) {
                scrollable.getScroller().setDisabled(true);
            }
        }

        this.fireEvent.apply(this, [].concat('beforeload', this, Array.prototype.slice.call(arguments)));
    },

    onStoreLoad: function (store, records, successful, operation) {
        this.setMasked(false);
        this.fireEvent.apply(this, [].concat('load', this, Array.prototype.slice.call(arguments)));

        if (store.indexOf(this.getLastNode()) === -1) {
            this.goToNode(store.getRoot());
        }
    },

    /**
     * Called when the backButton has been tapped.
     */
    onBackTap: function () {
        var me = this,
            node = me.getLastNode(),
            detailCard = me.getDetailCard(),
            detailCardActive = detailCard && me.getActiveItem() == detailCard,
            lastActiveList = me.getLastActiveList();

        this.fireAction('back', [this, node, lastActiveList, detailCardActive], 'doBack');
    },

    doBack: function (me, node, lastActiveList, detailCardActive) {
        var layout = me.getLayout(),
            animation = (layout) ? layout.getAnimation() : null;

        if (detailCardActive && lastActiveList) {
            if (animation) {
                animation.setReverse(true);
            }
            me.setActiveItem(lastActiveList);
            me.setLastNode(node.parentNode);
            me.syncToolbar();
        }
        else {
            this.goToNode(node.parentNode);
        }
    },

    updateData: function (data) {
        if (!this.getStore()) {
            this.setStore(new Ext.data.TreeStore({
                root: data
            }));
        }
    },

    applyStore: function (store) {
        if (store) {
            if (Ext.isString(store)) {
                // store id
                store = Ext.data.StoreManager.get(store);
            } else {
                // store instance or store config
                if (!(store instanceof Ext.data.TreeStore)) {
                    store = Ext.factory(store, Ext.data.TreeStore, null);
                }
            }

            // <debug>
            if (!store) {
                Ext.Logger.warn("The specified Store cannot be found", this);
            }
            //</debug>
        }

        return store;
    },

    storeListeners: {
        rootchange: 'onStoreRootChange',
        load: 'onStoreLoad',
        beforeload: 'onStoreBeforeLoad'
    },

    updateStore: function (newStore, oldStore) {
        var me = this,
            listeners = this.storeListeners;

        listeners.scope = me;

        if (oldStore && Ext.isObject(oldStore) && oldStore.isStore) {
            if (oldStore.autoDestroy) {
                oldStore.destroy();
            }
            oldStore.un(listeners);
        }

        if (newStore) {
            me.goToNode(newStore.getRoot());
            newStore.on(listeners);
        }
    },

    onStoreRootChange: function (store, node) {
        this.goToNode(node);
    },

    applyBackButton: function (config) {
        return Ext.factory(config, Ext.Button, this.getBackButton());
    },

    applyDetailCard: function (config, oldDetailCard) {
        if (config === null) {
            return Ext.factory(config, Ext.Component, oldDetailCard);
        } else {
            return Ext.factory(config, Ext.Component);
        }
    },

    updateBackButton: function (newButton, oldButton) {
        if (newButton) {
            var me = this;
            newButton.on('tap', me.onBackTap, me);
            newButton.setText(me.getBackText());
            me.getToolbar().insert(0, newButton);
        }
        else if (oldButton) {
            oldButton.destroy();
        }
    },

    applyToolbar: function (config) {
        return Ext.factory(config, Ext.TitleBar, this.getToolbar());
    },

    updateToolbar: function (newToolbar, oldToolbar) {
        var me = this;
        if (newToolbar) {
            newToolbar.setTitle(me.getTitle());
            if (!newToolbar.getParent()) {
                me.add(newToolbar);
            }
        }
        else if (oldToolbar) {
            oldToolbar.destroy();
        }
    },

    updateUseToolbar: function (newUseToolbar, oldUseToolbar) {
        if (!newUseToolbar) {
            this.setToolbar(false);
        }
    },

    updateTitle: function (newTitle) {
        var me = this,
            toolbar = me.getToolbar();
        if (toolbar) {
            if (me.getUpdateTitleText()) {
                toolbar.setTitle(newTitle);
            }
        }
    },

    /**
     * Override this method to provide custom template rendering of individual
     * nodes. The template will receive all data within the Record and will also
     * receive whether or not it is a leaf node.
     * @param {Ext.data.Record} node
     * @return {String}
     */
    getItemTextTpl: function (node) {
        return '{' + this.getDisplayField() + '}';
    },

    /**
     * Override this method to provide custom template rendering of titles/back
     * buttons when {@link #useTitleAsBackText} is enabled.
     * @param {Ext.data.Record} node
     * @return {String}
     */
    getTitleTextTpl: function (node) {
        return '{' + this.getDisplayField() + '}';
    },

    /**
     * @private
     */
    renderTitleText: function (node, forBackButton) {
        if (!node.titleTpl) {
            node.titleTpl = Ext.create('Ext.XTemplate', this.getTitleTextTpl(node));
        }

        if (node.isRoot()) {
            var initialTitle = this.getInitialConfig('title');
            return (forBackButton && initialTitle === '') ? this.getInitialConfig('backText') : initialTitle;
        }

        return  node.titleTpl.applyTemplate(node.data);
    },

    /**
     * Method to handle going to a specific node within this nested list. Node must be part of the
     * internal {@link #store}.
     * @param {Ext.data.NodeInterface} node The specified node to navigate to.
     */
    goToNode: function (node) {
        if (!node) {
            return;
        }

        var me = this,
            activeItem = me.getActiveItem(),
            detailCard = me.getDetailCard(),
            detailCardActive = detailCard && me.getActiveItem() == detailCard,
            reverse = me.goToNodeReverseAnimation(node),
            firstList = me.firstList,
            secondList = me.secondList,
            layout = me.getLayout(),
            animation = (layout) ? layout.getAnimation() : null,
            list;

        //if the node is a leaf, throw an error
        if (node.isLeaf()) {
            throw new Error('goToNode: passed a node which is a leaf.');
        }

        //if we are currently at the passed node, do nothing.
        if (node == me.getLastNode() && !detailCardActive) {
            return;
        }

        if (detailCardActive) {
            if (animation) {
                animation.setReverse(true);
            }
            list = me.getLastActiveList();
            list.getStore().setNode(node);
            node.expand();
            me.setActiveItem(list);
        }
        else {
            if (firstList && secondList) {
                //firstList and secondList have both been created
                activeItem = me.getActiveItem();

                me.setLastActiveList(activeItem);
                list = (activeItem == firstList) ? secondList : firstList;
                list.getStore().setNode(node);
                node.expand();

                if (animation) {
                    animation.setReverse(reverse);
                }
                me.setActiveItem(list);
                list.deselectAll();
            }
            else if (firstList) {
                //only firstList has been created
                me.setLastActiveList(me.getActiveItem());
                me.setActiveItem(me.getList(node));
                me.secondList = me.getActiveItem();
            }
            else {
                //no lists have been created
                me.setActiveItem(me.getList(node));
                me.firstList = me.getActiveItem();
            }
        }

        me.fireEvent('listchange', this, me.getActiveItem());

        me.setLastNode(node);

        me.syncToolbar();
    },


    /**
     * The leaf you want to navigate to. You should pass a node instance.
     * @param {Ext.data.NodeInterface} node The specified node to navigate to.
     */
    goToLeaf: function (node) {
        if (!node.isLeaf()) {
            throw new Error('goToLeaf: passed a node which is not a leaf.');
        }

        var me = this,
            card = me.getDetailCard(node),
            container = me.getDetailContainer(),
            sharedContainer = container == this,
            layout = me.getLayout(),
            animation = (layout) ? layout.getAnimation() : false;

        if (card) {
            if (container.getItems().indexOf(card) === -1) {
                container.add(card);
            }
            if (sharedContainer) {
                if (me.getActiveItem() instanceof Ext.dataview.List) {
                    me.setLastActiveList(me.getActiveItem());
                }
                me.setLastNode(node);
            }
            if (animation) {
                animation.setReverse(false);
            }
            container.setActiveItem(card);
            me.syncToolbar();
        }
    },

    /**
     * @private
     * Method which updates the {@link #backButton} and {@link #toolbar} with the latest information from
     * the current node.
     */
    syncToolbar: function (forceDetail) {
        var me = this,
            detailCard = me.getDetailCard(),
            node = me.getLastNode(),
            detailActive = forceDetail || (detailCard && (me.getActiveItem() == detailCard)),
            parentNode = (detailActive) ? node : node.parentNode,
            backButton = me.getBackButton();

        //show/hide the backButton, and update the backButton text, if one exists
        if (backButton) {
            backButton[parentNode ? 'show' : 'hide']();
            if (parentNode && me.getUseTitleAsBackText()) {
                backButton.setText(me.renderTitleText(node.parentNode, true));
            }
        }

        if (node) {
            me.setTitle(me.renderTitleText(node));
        }
    },

    updateBackText: function (newText) {
        this.getBackButton().setText(newText);
    },

    /**
     * @private
     * Returns `true` if the passed node should have a reverse animation from the previous current node.
     * @param {Ext.data.NodeInterface} node
     */
    goToNodeReverseAnimation: function (node) {
        var me = this,
            lastNode = me.getLastNode();
        if (!lastNode) {
            return false;
        }

        return (!lastNode.contains(node) && lastNode.isAncestor(node)) ? true : false;
    },

    /**
     * @private
     * Returns the list config for a specified node.
     * @param {HTMLElement} node The node for the list config.
     */
    getList: function (node) {
        var me = this,
            nodeStore = Ext.create('Ext.data.NodeStore', {
                recursive: false,
                node: node,
                rootVisible: false,
                model: me.getStore().getModel()
            });

        node.expand();

        return Ext.Object.merge({
            xtype: 'list',
            pressedDelay: 250,
            autoDestroy: true,
            store: nodeStore,
            onItemDisclosure: me.getOnItemDisclosure(),
            allowDeselect: me.getAllowDeselect(),
            variableHeights: false,
            listeners: [
                { event: 'itemdoubletap', fn: 'onItemDoubleTap', scope: me },
                { event: 'itemtap', fn: 'onItemInteraction', scope: me, order: 'before'},
                { event: 'itemtouchstart', fn: 'onItemInteraction', scope: me, order: 'before'},
                { event: 'itemtap', fn: 'onItemTap', scope: me },
                { event: 'beforeselectionchange', fn: 'onBeforeSelect', scope: me },
                { event: 'containertap', fn: 'onContainerTap', scope: me },
                { event: 'selectionchange', fn: 'onSelectionChange', order: 'before', scope: me }
            ],
            itemTpl: '<span<tpl if="leaf == true"> class="x-list-item-leaf"</tpl>>' + me.getItemTextTpl(node) + '</span>'
        }, this.getListConfig());
    }

}, function () {
    //<deprecated product=touch since=2.0>

    /**
     * @member Ext.dataview.NestedList
     * @method getSubList
     * Returns the subList for a specified node.
     * @removed 2.0.0
     */
    Ext.deprecateMethod(this, 'getSubList', null, "Ext.dataview.NestedList.getSubList() has been removed");

    /**
     * @member Ext.dataview.NestedList
     * @cfg {Number} clearSelectionDelay
     * Number of milliseconds to show the highlight when going back in a list.
     * @removed 2.0.0
     */
    Ext.deprecateProperty(this, 'clearSelectionDelay', null, "Ext.dataview.NestedList.clearSelectionDelay has been removed");
    //</deprecated>
});

