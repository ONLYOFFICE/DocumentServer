/**
 * @aside guide list
 * @aside video list
 *
 * List is a custom styled DataView which allows Grouping, Indexing, Icons, and a Disclosure. See the
 * [Guide](#!/guide/list) and [Video](#!/video/list) for more.
 *
 *     @example miniphone preview
 *     Ext.create('Ext.List', {
 *         fullscreen: true,
 *         itemTpl: '{title}',
 *         data: [
 *             { title: 'Item 1' },
 *             { title: 'Item 2' },
 *             { title: 'Item 3' },
 *             { title: 'Item 4' }
 *         ]
 *     });
 *
 * A more advanced example showing a list of people groped by last name:
 *
 *     @example miniphone preview
 *     Ext.define('Contact', {
 *         extend: 'Ext.data.Model',
 *         config: {
 *             fields: ['firstName', 'lastName']
 *         }
 *     });
 *
 *     var store = Ext.create('Ext.data.Store', {
 *        model: 'Contact',
 *        sorters: 'lastName',
 *
 *        grouper: {
 *            groupFn: function(record) {
 *                return record.get('lastName')[0];
 *            }
 *        },
 *
 *        data: [
 *            { firstName: 'Tommy',   lastName: 'Maintz'  },
 *            { firstName: 'Rob',     lastName: 'Dougan'  },
 *            { firstName: 'Ed',      lastName: 'Spencer' },
 *            { firstName: 'Jamie',   lastName: 'Avins'   },
 *            { firstName: 'Aaron',   lastName: 'Conran'  },
 *            { firstName: 'Dave',    lastName: 'Kaneda'  },
 *            { firstName: 'Jacky',   lastName: 'Nguyen'  },
 *            { firstName: 'Abraham', lastName: 'Elias'   },
 *            { firstName: 'Jay',     lastName: 'Robinson'},
 *            { firstName: 'Nigel',   lastName: 'White'   },
 *            { firstName: 'Don',     lastName: 'Griffin' },
 *            { firstName: 'Nico',    lastName: 'Ferrero' },
 *            { firstName: 'Jason',   lastName: 'Johnston'}
 *        ]
 *     });
 *
 *     Ext.create('Ext.List', {
 *        fullscreen: true,
 *        itemTpl: '<div class="contact">{firstName} <strong>{lastName}</strong></div>',
 *        store: store,
 *        grouped: true
 *     });
 */
Ext.define('Ext.dataview.List', {
    alternateClassName: 'Ext.List',
    extend: 'Ext.dataview.DataView',
    xtype: 'list',

    mixins: ['Ext.mixin.Bindable'],

    requires: [
        'Ext.dataview.IndexBar',
        'Ext.dataview.ListItemHeader',
        'Ext.dataview.component.ListItem',
        'Ext.util.TranslatableList',
        'Ext.util.PositionMap'
    ],

    /**
     * @event disclose
     * @preventable doDisclose
     * Fires whenever a disclosure is handled
     * @param {Ext.dataview.List} this The List instance
     * @param {Ext.data.Model} record The record associated to the item
     * @param {HTMLElement} target The element disclosed
     * @param {Number} index The index of the item disclosed
     * @param {Ext.EventObject} e The event object
     */

    config: {
        /**
         * @cfg layout
         * Hide layout config in DataView. It only causes confusion.
         * @accessor
         * @private
         */
        layout: 'fit',

        /**
         * @cfg {Boolean/Object} indexBar
         * `true` to render an alphabet IndexBar docked on the right.
         * This can also be a config object that will be passed to {@link Ext.IndexBar}.
         * @accessor
         */
        indexBar: false,

        icon: null,

        /**
         * @cfg {Boolean} clearSelectionOnDeactivate
         * `true` to clear any selections on the list when the list is deactivated.
         * @removed 2.0.0
         */

        /**
         * @cfg {Boolean} preventSelectionOnDisclose `true` to prevent the item selection when the user
         * taps a disclose icon.
         * @accessor
         */
        preventSelectionOnDisclose: true,

        /**
         * @cfg baseCls
         * @inheritdoc
         */
        baseCls: Ext.baseCSSPrefix + 'list',

        /**
         * @cfg {Boolean} pinHeaders
         * Whether or not to pin headers on top of item groups while scrolling for an iPhone native list experience.
         * @accessor
         */
        pinHeaders: true,

        /**
         * @cfg {Boolean} grouped
         * Whether or not to group items in the provided Store with a header for each item.
         * @accessor
         */
        grouped: false,

        /**
         * @cfg {Boolean/Function/Object} onItemDisclosure
         * `true` to display a disclosure icon on each list item.
         * The list will still fire the disclose event, and the event can be stopped before itemtap.
         * By setting this config to a function, the function passed will be called when the disclosure
         * is tapped.
         * Finally you can specify an object with a 'scope' and 'handler'
         * property defined. This will also be bound to the tap event listener
         * and is useful when you want to change the scope of the handler.
         * @accessor
         */
        onItemDisclosure: null,

        /**
         * @cfg {String} disclosureProperty
         * A property to check on each record to display the disclosure on a per record basis.  This
         * property must be false to prevent the disclosure from being displayed on the item.
         * @accessor
         */
        disclosureProperty: 'disclosure',

        /**
         * @cfg {String} ui
         * The style of this list. Available options are `normal` and `round`.
         */
        ui: 'normal',

        /**
         * @cfg {Boolean} useComponents
         * Flag the use a component based DataView implementation.  This allows the full use of components in the
         * DataView at the cost of some performance.
         *
         * Checkout the [DataView Guide](#!/guide/dataview) for more information on using this configuration.
         * @accessor
         * @private
         */

        /**
         * @cfg {Object} itemConfig
         * A configuration object that is passed to every item created by a component based DataView. Because each
         * item that a DataView renders is a Component, we can pass configuration options to each component to
         * easily customize how each child component behaves.
         * Note this is only used when useComponents is true.
         * @accessor
         * @private
         */

        /**
         * @cfg {Number} maxItemCache
         * Maintains a cache of reusable components when using a component based DataView.  Improving performance at
         * the cost of memory.
         * Note this is currently only used when useComponents is true.
         * @accessor
         * @private
         */

        /**
         * @cfg {String} defaultType
         * The xtype used for the component based DataView. Defaults to dataitem.
         * Note this is only used when useComponents is true.
         * @accessor
         */
        defaultType: 'listitem',

        /**
         * @cfg {Object} itemMap
         * @private
         */
        itemMap: {
            minimumHeight: 47
        },

        /**
         * @cfg {Boolean} variableHeights
         * Whether or not this list contains items with variable heights. If you want to force the
         * items in the list to have a fixed height, set the {@link #itemHeight} configuration.
         * If you also variableHeights to false, the scrolling performance of the list will be
         * improved.
         */
        variableHeights: true,

        /**
         * @cfg {Number} itemHeight
         * This allows you to set the default item height and is used to roughly calculate the amount
         * of items needed to fill the list. By default items are around 50px high. If you set this
         * configuration in combination with setting the {@link #variableHeights} to false you
         * can improve the scrolling speed
         */
        itemHeight: 47,

        /**
         * @cfg {Boolean} refreshHeightOnUpdate
         * Set this to false if you make many updates to your list (like in an interval), but updates
         * won't affect the item's height. Doing this will increase the performance of these updates.
         * Note that if you have {@link #variableHeights} set to false, this configuration option has
         * no effect.
         */
        refreshHeightOnUpdate: true,

        scrollable: false
    },

    constructor: function(config) {
        var me = this,
            layout;
        me.callParent(arguments);

        if (Ext.os.is.Android4 && !Ext.browser.is.ChromeMobile) {
            me.headerTranslateFn = Ext.Function.createThrottled(me.headerTranslateFn, 50, me);
        }

        //<debug>
        layout = this.getLayout();
        if (layout && !layout.isFit) {
            Ext.Logger.error('The base layout for a DataView must always be a Fit Layout');
        }
        //</debug>
    },

    topItemIndex: 0,
    topItemPosition: 0,

    updateItemHeight: function(itemHeight) {
        this.getItemMap().setMinimumHeight(itemHeight);
    },

    applyItemMap: function(itemMap) {
        return Ext.factory(itemMap, Ext.util.PositionMap, this.getItemMap());
    },

    // apply to the selection model to maintain visual UI cues
//    onItemTrigger: function(me, index, target, record, e) {
//        if (!(this.getPreventSelectionOnDisclose() && Ext.fly(e.target).hasCls(this.getBaseCls() + '-disclosure'))) {
//            this.callParent(arguments);
//        }
//    },

    beforeInitialize: function() {
        var me = this,
            container;

        me.listItems = [];
        me.scrollDockItems = {
            top: [],
            bottom: []
        };

        container = me.container = me.add(new Ext.Container({
            scrollable: {
                scroller: {
                    autoRefresh: false,
                    direction: 'vertical',
                    translatable: {
                        xclass: 'Ext.util.TranslatableList'
                    }
                }
            }
        }));

        container.getScrollable().getScroller().getTranslatable().setItems(me.listItems);

        // Tie List's scroller to its container's scroller
        me.setScrollable(container.getScrollable());
        me.scrollableBehavior = container.getScrollableBehavior();
    },

    initialize: function() {
        var me = this,
            container = me.container,
            i, ln;

        me.updatedItems = [];
        me.headerMap = [];

        me.on(me.getTriggerCtEvent(), me.onContainerTrigger, me);
        me.on(me.getTriggerEvent(), me.onItemTrigger, me);

        me.header = Ext.factory({
            xclass: 'Ext.dataview.ListItemHeader',
            html: '&nbsp;',
            translatable: true,
            role: 'globallistheader',
            cls: ['x-list-header', 'x-list-header-swap']
        });
        me.container.innerElement.insertFirst(me.header.element);

        me.headerTranslate = me.header.getTranslatable();
        me.headerTranslate.translate(0, -10000);

        if (!me.getGrouped()) {
            me.updatePinHeaders(null);
        }

        container.element.on({
            delegate: '.' + me.getBaseCls() + '-disclosure',
            tap: 'handleItemDisclosure',
            scope: me
        });

        container.element.on({
            resize: 'onResize',
            scope: me
        });

        // Android 2.x not a direct child
        container.innerElement.on({
            touchstart: 'onItemTouchStart',
            touchend: 'onItemTouchEnd',
            tap: 'onItemTap',
            taphold: 'onItemTapHold',
            singletap: 'onItemSingleTap',
            doubletap: 'onItemDoubleTap',
            swipe: 'onItemSwipe',
            delegate: '.' + Ext.baseCSSPrefix + 'list-item-body',
            scope: me
        });

        for (i = 0, ln = me.scrollDockItems.top.length; i < ln; i++) {
            container.add(me.scrollDockItems.top[i]);
        }

        for (i = 0, ln = me.scrollDockItems.bottom.length; i < ln; i++) {
            container.add(me.scrollDockItems.bottom[i]);
        }

        if (me.getStore()) {
            me.refresh();
        }
    },

    updateInline: function(newInline) {
        var me = this;
        me.callParent(arguments);
        if (newInline) {
            me.setOnItemDisclosure(false);
            me.setIndexBar(false);
            me.setGrouped(false);
        }
    },

    applyIndexBar: function(indexBar) {
        return Ext.factory(indexBar, Ext.dataview.IndexBar, this.getIndexBar());
    },

    updateIndexBar: function(indexBar) {
        var me = this;
        if (indexBar && me.getScrollable()) {
            me.indexBarElement = me.getScrollableBehavior().getScrollView().getElement().appendChild(indexBar.renderElement);

            indexBar.on({
                index: 'onIndex',
                scope: me
            });

            me.element.addCls(me.getBaseCls() + '-indexed');
        }
    },

    updateGrouped: function(grouped) {
        var me = this,
            baseCls = this.getBaseCls(),
            cls = baseCls + '-grouped',
            unCls = baseCls + '-ungrouped';

        if (grouped) {
            me.addCls(cls);
            me.removeCls(unCls);
            me.updatePinHeaders(me.getPinHeaders());
        }
        else {
            me.addCls(unCls);
            me.removeCls(cls);
            me.updatePinHeaders(null);
        }

        if (me.isPainted() && me.listItems.length) {
            me.setItemsCount(me.listItems.length);
        }
    },

    updatePinHeaders: function(pinnedHeaders) {
        if (this.headerTranslate) {
            this.headerTranslate.translate(0, -10000);
        }
    },

    updateScrollerSize: function() {
        var me = this,
            totalHeight = me.getItemMap().getTotalHeight(),
            scroller = me.container.getScrollable().getScroller();

        if (totalHeight > 0) {
            scroller.givenSize = totalHeight;
            scroller.refresh();
        }
    },

    onResize: function() {
        var me = this,
            container = me.container,
            element = container.element,
            minimumHeight = me.getItemMap().getMinimumHeight(),
            containerSize;

        if (!me.listItems.length) {
            me.bind(container.getScrollable().getScroller().getTranslatable(), 'doTranslate', 'onTranslate');
        }

        me.containerSize = containerSize = element.getHeight();
        me.setItemsCount(Math.ceil(containerSize / minimumHeight) + 1);
    },

    scrollDockHeightRefresh: function() {
        var items = this.listItems,
            scrollDockItems = this.scrollDockItems,
            ln = items.length,
            i, item;

        for (i = 0; i < ln; i++) {
            item = items[i];
            if ((item.isFirst && scrollDockItems.top.length) || (item.isLast && scrollDockItems.bottom.length)) {
                this.updatedItems.push(item);
            }
        }
        this.refreshScroller();
    },

    headerTranslateFn: function(record, transY, headerTranslate) {
        var headerString = this.getStore().getGroupString(record);

        if (this.currentHeader !== headerString) {
            this.currentHeader = headerString;
            this.header.setHtml(headerString);
        }
        headerTranslate.translate(0, transY);
    },

    onTranslate: function(x, y, args) {
        var me = this,
            listItems = me.listItems,
            itemsCount = listItems.length,
            currentTopIndex = me.topItemIndex,
            itemMap = me.getItemMap(),
            store = me.getStore(),
            storeCount = store.getCount(),
            info = me.getListItemInfo(),
            grouped = me.getGrouped(),
            storeGroups = me.groups,
            headerMap = me.headerMap,
            headerTranslate = me.headerTranslate,
            pinHeaders = me.getPinHeaders(),
            maxIndex = storeCount - itemsCount + 1,
            topIndex, changedCount, i, index, item,
            closestHeader, record, pushedHeader, transY, element;

        if (me.updatedItems.length) {
            me.updateItemHeights();
        }

        me.topItemPosition = itemMap.findIndex(-y) || 0;
        me.indexOffset = me.topItemIndex = topIndex = Math.max(0, Math.min(me.topItemPosition, maxIndex));

        if (grouped && headerTranslate && storeGroups.length && pinHeaders) {
            closestHeader = itemMap.binarySearch(headerMap, -y);
            record = storeGroups[closestHeader].children[0];
            if (record) {
                pushedHeader = y + headerMap[closestHeader + 1] - me.headerHeight;
                // Top of the list or above (hide the floating header offscreen)
                if (y >= 0) {
                    transY = -10000;
                }
                // Scroll the floating header a bit
                else if (pushedHeader < 0) {
                    transY = pushedHeader;
                }
                // Stick to the top of the screen
                else {
                    transY = Math.max(0, y);
                }
                this.headerTranslateFn(record, transY, headerTranslate);

            }
        }

        args[1] = (itemMap.map[topIndex] || 0) + y;
        if (currentTopIndex !== topIndex && topIndex <= maxIndex) {
            // Scroll up
            if (currentTopIndex > topIndex) {
                changedCount = Math.min(itemsCount, currentTopIndex - topIndex);
                for (i = changedCount - 1; i >= 0; i--) {
                    item = listItems.pop();
                    listItems.unshift(item);
                    me.updateListItem(item, i + topIndex, info);
                }
            }
            else {
                // Scroll down
                changedCount = Math.min(itemsCount, topIndex - currentTopIndex);
                for (i = 0; i < changedCount; i++) {
                    item = listItems.shift();
                    listItems.push(item);
                    index = i + topIndex + itemsCount - changedCount;
                    me.updateListItem(item, index, info);
                }
            }
        }

        if (listItems.length && grouped && pinHeaders) {
            if (me.headerIndices[topIndex]) {
                element = listItems[0].getHeader().element;
                if (y < itemMap.map[topIndex]) {
                    element.setVisibility(false);
                }
                else {
                    element.setVisibility(true);
                }
            }
            for (i = 1; i <= changedCount; i++) {
                if (listItems[i]) {
                    listItems[i].getHeader().element.setVisibility(true);
                }
            }
        }
    },

    setItemsCount: function(itemsCount) {
        var me = this,
            listItems = me.listItems,
            minimumHeight = me.getItemMap().getMinimumHeight(),
            config = {
                xtype: me.getDefaultType(),
                itemConfig: me.getItemConfig(),
                tpl: me.getItemTpl(),
                minHeight: minimumHeight,
                cls: me.getItemCls()
            },
            info = me.getListItemInfo(),
            i, item;

        for (i = 0; i < itemsCount; i++) {
            // We begin by checking if we already have an item for this length
            item = listItems[i];

            // If we don't have an item yet at this index then create one
            if (!item) {
                item = Ext.factory(config);
                item.dataview = me;
                item.$height = minimumHeight;
                me.container.doAdd(item);
                listItems.push(item);
            }
            item.dataIndex = null;
            if (info.store) {
                me.updateListItem(item, i + me.topItemIndex, info);
            }
        }

        me.updateScrollerSize();
    },

    getListItemInfo: function() {
        var me = this,
            baseCls = me.getBaseCls();

        return {
            store: me.getStore(),
            grouped: me.getGrouped(),
            baseCls: baseCls,
            selectedCls: me.getSelectedCls(),
            headerCls: baseCls + '-header-wrap',
            footerCls: baseCls + '-footer-wrap',
            firstCls: baseCls + '-item-first',
            lastCls: baseCls + '-item-last',
            itemMap: me.getItemMap(),
            variableHeights: me.getVariableHeights(),
            defaultItemHeight: me.getItemHeight()
        };
    },

    updateListItem: function(item, index, info) {
        var record = info.store.getAt(index);
        if (this.isSelected(record)) {
            item.addCls(info.selectedCls);
        }
        else {
            item.removeCls(info.selectedCls);
        }

        item.removeCls([info.headerCls, info.footerCls, info.firstCls, info.lastCls]);
        this.replaceItemContent(item, index, info)
    },

    taskRunner: function() {
        delete this.intervalId;
        if (this.scheduledTasks && this.scheduledTasks.length > 0) {
            var task = this.scheduledTasks.shift();
            this.doUpdateListItem(task.item, task.index, task.info);

            if (this.scheduledTasks.length === 0 && this.getVariableHeights() && !this.container.getScrollable().getScroller().getTranslatable().isAnimating) {
                this.refreshScroller();
            } else if (this.scheduledTasks.length > 0) {
                this.intervalId = requestAnimationFrame(Ext.Function.bind(this.taskRunner, this));
            }
        }
    },

    scheduledTasks: null,

    replaceItemContent: function(item, index, info) {
        var translatable = this.container.getScrollable().getScroller().getTranslatable();

        // This falls apart when scrolling up. Turning off for now.
        if (Ext.os.is.Android4
            && !Ext.browser.is.Chrome
            && !info.variableHeights
            && !info.grouped
            && translatable.isAnimating
            && translatable.activeEasingY
            && Math.abs(translatable.activeEasingY._startVelocity) > .75) {
            if (!this.scheduledTasks) {
                this.scheduledTasks = [];
            }
            for (var i = 0; i < this.scheduledTasks.length; i++) {
                if (this.scheduledTasks[i].item === item) {
                    Ext.Array.remove(this.scheduledTasks, this.scheduledTasks[i]);
                    break;
                }
            }
            this.scheduledTasks.push({
                item: item,
                index: index,
                info: info
            });

            if (!this.intervalId) {
                this.intervalId = requestAnimationFrame(Ext.Function.bind(this.taskRunner, this));
            }
        } else {
            this.doUpdateListItem(item, index, info);
        }
    },

    doUpdateListItem: function(item, index, info) {
        var record = info.store.getAt(index),
            headerIndices = this.headerIndices,
            footerIndices = this.footerIndices,
            headerItem = item.getHeader(),
            scrollDockItems = this.scrollDockItems,
            updatedItems = this.updatedItems,
            itemHeight = info.itemMap.getItemHeight(index),
            ln, i, scrollDockItem;

        if (!record) {
            item.setRecord(null);
            item.translate(0, -10000);
            item._list_hidden = true;
            return;
        }
        item._list_hidden = false;

        if (item.isFirst && scrollDockItems.top.length) {
            for (i = 0, ln = scrollDockItems.top.length; i < ln; i++) {
                scrollDockItem = scrollDockItems.top[i];
                scrollDockItem.addCls(Ext.baseCSSPrefix + 'list-scrolldock-hidden');
                item.remove(scrollDockItem, false);
            }
            item.isFirst = false;
        }

        if (item.isLast && scrollDockItems.bottom.length) {
            for (i = 0, ln = scrollDockItems.bottom.length; i < ln; i++) {
                scrollDockItem = scrollDockItems.bottom[i];
                scrollDockItem.addCls(Ext.baseCSSPrefix + 'list-scrolldock-hidden');
                item.remove(scrollDockItem, false);
            }
            item.isLast = false;
        }

        if (item.getRecord) {
            if (item.dataIndex !== index) {
                item.dataIndex = index;
                this.fireEvent('itemindexchange', this, record, index, item);
            }
            if (item.getRecord() === record) {
                item.updateRecord(record);
            } else {
                item.setRecord(record);
            }
        }

        if (this.isSelected(record)) {
            item.addCls(info.selectedCls);
        }
        else {
            item.removeCls(info.selectedCls);
        }

        item.removeCls([info.headerCls, info.footerCls, info.firstCls, info.lastCls]);

        if (info.grouped) {
            if (headerIndices[index]) {
                item.addCls(info.headerCls);
                headerItem.setHtml(info.store.getGroupString(record));
                headerItem.show();
                headerItem.element.setVisibility(true);

                // If this record is a group header, and the items height is still the default height
                // we need to read the actual size of the item (including the header)
                if (!info.variableHeights && itemHeight === info.defaultItemHeight) {
                    Ext.Array.include(updatedItems, item);
                }
            }
            else {
                headerItem.hide();

                // If this record is not a header (anymore) and its height is unequal to the default item height
                // it means the item must have gotten a different height because being a header before and now needs
                // to become the default height again
                if (!info.variableHeights && !footerIndices[index] && itemHeight !== info.defaultItemHeight) {
                    info.itemMap.setItemHeight(index, info.defaultItemHeight);
                    info.itemMap.update();
                }
            }

            if (footerIndices[index]) {
                item.addCls(info.footerCls);

                // If this record is a footer and its height is still the same as the default item height, we have
                // to make sure to read this items height to see if adding the foot cls effects its height
                if (!info.variableHeights && itemHeight === info.defaultItemHeight) {
                    Ext.Array.include(updatedItems, item);
                }
            }
        } else if (!info.variableHeights && itemHeight !== info.defaultItemHeight) {
            // If this list is not grouped, the only thing that can change the height of an item
            // can be scroll dock items. If an items height is not equal to the default item height
            // it means it must have had scroll dock items. In this case we set the items height
            // to become the default height again.
            info.itemMap.setItemHeight(index, info.defaultItemHeight);
            info.itemMap.update();
        }

        if (index === 0) {
            item.isFirst = true;
            item.addCls(info.firstCls);

            if (!info.grouped) {
                item.addCls(info.headerCls);
            }

            for (i = 0, ln = scrollDockItems.top.length; i < ln; i++) {
                scrollDockItem = scrollDockItems.top[i];
                item.insert(0, scrollDockItem);
                scrollDockItem.removeCls(Ext.baseCSSPrefix + 'list-scrolldock-hidden');
            }

            // If an item gets scrolldock items inside of it, we need to always read the height
            // in the next frame so we add it to the updatedItems array
            if (ln && !info.variableHeights) {
                Ext.Array.include(updatedItems, item);
            }
        }

        if (index === info.store.getCount() - 1) {
            item.isLast = true;
            item.addCls(info.lastCls);

            if (!info.grouped) {
                item.addCls(info.footerCls);
            }

            for (i = 0, ln = scrollDockItems.bottom.length; i < ln; i++) {
                scrollDockItem = scrollDockItems.bottom[i];
                item.insert(0, scrollDockItem);
                scrollDockItem.removeCls(Ext.baseCSSPrefix + 'list-scrolldock-hidden');
            }

            // If an item gets scrolldock items inside of it, we need to always read the height
            // in the next frame so we add it to the updatedItems array
            if (ln && !info.variableHeights) {
                Ext.Array.include(updatedItems, item);
            }
        }

        item.$height = info.itemMap.getItemHeight(index);

        if (info.variableHeights) {
            updatedItems.push(item);
        }
    },

    updateItemHeights: function() {
        if (!this.isPainted()) {
            this.pendingHeightUpdate = true;
            if (!this.pendingHeightUpdate) {
                this.on('painted', this.updateItemHeights, this, {single: true});
            }
            return;
        }

        var updatedItems = this.updatedItems,
            ln = updatedItems.length,
            itemMap = this.getItemMap(),
            scroller = this.container.getScrollable().getScroller(),
            minimumHeight = itemMap.getMinimumHeight(),
            headerIndices = this.headerIndices,
            headerMap = this.headerMap,
            translatable = scroller.getTranslatable(),
            itemIndex, i, item, height;

        this.pendingHeightUpdate = false;

        // First we do all the reads
        for (i = 0; i < ln; i++) {
            item = updatedItems[i];
            itemIndex = item.dataIndex;
            // itemIndex may not be set yet if the store is still being loaded
            if (itemIndex !== null) {
                height = item.element.getFirstChild().getHeight();
                height = Math.max(height, minimumHeight);

                if (headerIndices && !this.headerHeight && headerIndices[itemIndex]) {
                    this.headerHeight = parseInt(item.getHeader().element.getHeight(), 10);
                }

                itemMap.setItemHeight(itemIndex, height);
            }
        }

        itemMap.update();
        height = itemMap.getTotalHeight();

        headerMap.length = 0;
        for (i in headerIndices) {
            headerMap.push(itemMap.map[i]);
        }

        // Now do the dom writes
        for (i = 0; i < ln; i++) {
            item = updatedItems[i];
            itemIndex = item.dataIndex;
            item.$height = itemMap.getItemHeight(itemIndex);
        }

        if (height != scroller.givenSize) {
            scroller.setSize(height);
            scroller.refreshMaxPosition();

            if (translatable.isAnimating) {
                translatable.activeEasingY.setMinMomentumValue(-scroller.getMaxPosition().y);
            }
        }

        this.updatedItems.length = 0;

    },

    /**
     * Returns an item at the specified index.
     * @param {Number} index Index of the item.
     * @return {Ext.dom.Element/Ext.dataview.component.DataItem} item Item at the specified index.
     */
    getItemAt: function(index) {
        var listItems = this.listItems,
            ln = listItems.length,
            i, listItem;

        for (i = 0; i < ln; i++) {
            listItem = listItems[i];
            if (listItem.dataIndex === index) {
                return listItem;
            }
        }
    },

    /**
     * Returns an index for the specified item.
     * @param {Number} item The item to locate.
     * @return {Number} Index for the specified item.
     */
    getItemIndex: function(item) {
        var index = item.dataIndex;
        return (index === -1) ? index : this.indexOffset + index;
    },

    /**
     * Returns an array of the current items in the DataView.
     * @return {Ext.dom.Element[]/Ext.dataview.component.DataItem[]} Array of Items.
     */
    getViewItems: function() {
        return this.listItems;
    },

    doRefresh: function(list) {
        if (this.intervalId) {
            cancelAnimationFrame(this.intervalId);
            delete this.intervalId;
        }
        if (this.scheduledTasks) {
            this.scheduledTasks.length = 0;
        }
        var me = this,
            store = me.getStore(),
            scrollable = me.container.getScrollable(),
            scroller = scrollable && scrollable.getScroller(),
            painted = me.isPainted(),
            storeCount = store.getCount();

        me.getItemMap().populate(storeCount, this.topItemPosition);

        if (me.getGrouped()) {
            me.findGroupHeaderIndices();
        }

        // This will refresh the items on the screen with the new data
        if (me.listItems.length) {
            me.setItemsCount(me.listItems.length);
            if (painted) {
                me.refreshScroller(scroller);
            }
        }

        if (painted && this.getScrollToTopOnRefresh() && scroller && list) {
            scroller.scrollToTop();
        }

        // No items, hide all the items from the collection.
        if (storeCount < 1) {
            me.onStoreClear();
            return;
        } else {
            me.hideEmptyText();
        }
    },

    findGroupHeaderIndices: function() {
        var me = this,
            store = me.getStore(),
            storeLn = store.getCount(),
            groups = store.getGroups(),
            groupLn = groups.length,
            headerIndices = me.headerIndices = {},
            footerIndices = me.footerIndices = {},
            i, previousIndex, firstGroupedRecord, storeIndex;

        me.groups = groups;

        for (i = 0; i < groupLn; i++) {
            firstGroupedRecord = groups[i].children[0];
            storeIndex = store.indexOf(firstGroupedRecord);
            headerIndices[storeIndex] = true;

            previousIndex = storeIndex - 1;
            if (previousIndex) {
                footerIndices[previousIndex] = true;
            }
        }

        footerIndices[storeLn - 1] = true;

        return headerIndices;
    },

    // Handling adds and removes like this is fine for now. It should not perform much slower then a dedicated solution
    onStoreAdd: function() {
        this.doRefresh();
    },

    onStoreRemove: function() {
        this.doRefresh();
    },

    onStoreUpdate: function(store, record, newIndex, oldIndex) {
        var me = this,
            scroller = me.container.getScrollable().getScroller(),
            item;

        oldIndex = (typeof oldIndex === 'undefined') ? newIndex : oldIndex;

        if (oldIndex !== newIndex) {
            // Just refreshing the list here saves a lot of code and shouldnt be much slower
            me.doRefresh();
        }
        else {
            if (newIndex >= me.topItemIndex && newIndex < me.topItemIndex + me.listItems.length) {
                item = me.getItemAt(newIndex);
                me.doUpdateListItem(item, newIndex, me.getListItemInfo());

                // Bypassing setter because sometimes we pass the same record (different data)
                //me.updateListItem(me.getItemAt(newIndex), newIndex, me.getListItemInfo());
                if (me.getVariableHeights() && me.getRefreshHeightOnUpdate()) {
                    me.updatedItems.push(item);
                    me.updateItemHeights();
                    me.refreshScroller(scroller);
                }
            }
        }
    },

    /*
     * @private
     * This is to fix the variable heights again since the item height might have changed after the update
     */

    refreshScroller: function(scroller) {
        if (!scroller) {
            scroller = this.container.getScrollable().getScroller()
        }
        scroller.scrollTo(0, scroller.position.y + 1);
        scroller.scrollTo(0, scroller.position.y - 1);
    },

    onStoreClear: function() {
        if (this.headerTranslate) {
            this.headerTranslate.translate(0, -10000);
        }
        this.showEmptyText();
    },

    onIndex: function(indexBar, index) {
        var me = this,
            key = index.toLowerCase(),
            store = me.getStore(),
            groups = store.getGroups(),
            ln = groups.length,
            scrollable = me.container.getScrollable(),
            scroller, group, i, closest, id;

        if (scrollable) {
            scroller = scrollable.getScroller();
        }
        else {
            return;
        }

        for (i = 0; i < ln; i++) {
            group = groups[i];
            id = group.name.toLowerCase();
            if (id == key || id > key) {
                closest = group;
                break;
            }
            else {
                closest = group;
            }
        }

        if (scrollable && closest) {
            index = store.indexOf(closest.children[0]);

            //stop the scroller from scrolling
            scroller.stopAnimation();

            //make sure the new offsetTop is not out of bounds for the scroller
            var containerSize = scroller.getContainerSize().y,
                size = scroller.getSize().y,
                maxOffset = size - containerSize,
                offsetTop = me.getItemMap().map[index],
                offset = (offsetTop > maxOffset) ? maxOffset : offsetTop;

            // This is kind of hacky, but since there might be variable heights we have to render the frame
            // twice. First to update all the content, then to read the heights and translate items accordingly
            scroller.scrollTo(0, offset);
            if (this.updatedItems.length > 0 && (!this.scheduledTasks || this.scheduledTasks.length === 0)) {
                this.refreshScroller();
            }
            //scroller.scrollTo(0, offset);
        }
    },

    applyOnItemDisclosure: function(config) {
        if (Ext.isFunction(config)) {
            return {
                scope: this,
                handler: config
            };
        }
        return config;
    },

    handleItemDisclosure: function(e) {
        var me = this,
            item = Ext.getCmp(Ext.get(e.getTarget()).up('.x-list-item').id),
            index = item.dataIndex,
            record = me.getStore().getAt(index);

        me.fireAction('disclose', [me, record, item, index, e], 'doDisclose');
    },

    doDisclose: function(me, record, item, index, e) {
        var onItemDisclosure = me.getOnItemDisclosure();

        if (onItemDisclosure && onItemDisclosure.handler) {
            onItemDisclosure.handler.call(onItemDisclosure.scope || me, record, item, index, e);
        }
    },

    updateItemCls: function(newCls, oldCls) {
        var items = this.listItems,
            ln = items.length,
            i, item;

        for (i = 0; i < ln; i++) {
            item = items[i];
            item.removeCls(oldCls);
            item.addCls(newCls);
        }
    },

    onItemTouchStart: function(e) {
        this.container.innerElement.on({
            touchmove: 'onItemTouchMove',
            delegate: '.' + Ext.baseCSSPrefix + 'list-item-body',
            single: true,
            scope: this
        });
        this.callParent(this.parseEvent(e));
    },

    onItemTouchMove: function(e) {
        this.callParent(this.parseEvent(e));
    },

    onItemTouchEnd: function(e) {
        this.container.innerElement.un({
            touchmove: 'onItemTouchMove',
            delegate: '.' + Ext.baseCSSPrefix + 'list-item-body',
            scope: this
        });
        this.callParent(this.parseEvent(e));
    },

    onItemTap: function(e) {
        this.callParent(this.parseEvent(e));
    },

    onItemTapHold: function(e) {
        this.callParent(this.parseEvent(e));
    },

    onItemSingleTap: function(e) {
        this.callParent(this.parseEvent(e));
    },

    onItemDoubleTap: function(e) {
        this.callParent(this.parseEvent(e));
    },

    onItemSwipe: function(e) {
        this.callParent(this.parseEvent(e));
    },

    parseEvent: function(e) {
        var me = this,
            target = Ext.fly(e.getTarget()).findParent('.' + Ext.baseCSSPrefix + 'list-item', 8),
            item = Ext.getCmp(target.id);

        return [me, item, item.dataIndex, e];
    },

    onItemAdd: function(item) {
        var me = this,
            config = item.config;

        if (config.scrollDock) {
            if (config.scrollDock == 'bottom') {
                me.scrollDockItems.bottom.push(item);
            } else {
                me.scrollDockItems.top.push(item);
            }
            item.addCls(Ext.baseCSSPrefix + 'list-scrolldock-hidden');
            if (me.container) {
                me.container.add(item);
            }
        } else {
            me.callParent(arguments);
        }
    },

    destroy: function() {
        Ext.destroy(this.getIndexBar(), this.indexBarElement, this.header);
        if (this.intervalId) {
            cancelAnimationFrame(this.intervalId);
            delete this.intervalId;
        }
        this.callParent();
    }
});