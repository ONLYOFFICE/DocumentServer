/**
 * Adds a Load More button at the bottom of the list. When the user presses this button,
 * the next page of data will be loaded into the store and appended to the List.
 *
 * By specifying `{@link #autoPaging}: true`, an 'infinite scroll' effect can be achieved,
 * i.e., the next page of content will load automatically when the user scrolls to the
 * bottom of the list.
 *
 * ## Example
 *
 *     Ext.create('Ext.dataview.List', {
 *
 *         store: Ext.create('TweetStore'),
 *
 *         plugins: [
 *             {
 *                 xclass: 'Ext.plugin.ListPaging',
 *                 autoPaging: true
 *             }
 *         ],
 *
 *         itemTpl: [
 *             '<img src="{profile_image_url}" />',
 *             '<div class="tweet">{text}</div>'
 *         ]
 *     });
 */
Ext.define('Ext.plugin.ListPaging', {
    extend: 'Ext.Component',
    alias: 'plugin.listpaging',

    config: {
        /**
         * @cfg {Boolean} autoPaging
         * True to automatically load the next page when you scroll to the bottom of the list.
         */
        autoPaging: false,

        /**
         * @cfg {String} loadMoreText The text used as the label of the Load More button.
         */
        loadMoreText: 'Load More...',

        /**
         * @cfg {String} noMoreRecordsText The text used as the label of the Load More button when the Store's
         * {@link Ext.data.Store#totalCount totalCount} indicates that all of the records available on the server are
         * already loaded
         */
        noMoreRecordsText: 'No More Records',

        /**
         * @private
         * @cfg {String} loadTpl The template used to render the load more text
         */
        loadTpl: [
            '<div class="{cssPrefix}loading-spinner" style="font-size: 180%; margin: 10px auto;">',
                 '<span class="{cssPrefix}loading-top"></span>',
                 '<span class="{cssPrefix}loading-right"></span>',
                 '<span class="{cssPrefix}loading-bottom"></span>',
                 '<span class="{cssPrefix}loading-left"></span>',
            '</div>',
            '<div class="{cssPrefix}list-paging-msg">{message}</div>'
        ].join(''),

        /**
         * @cfg {Object} loadMoreCmp
         * @private
         */
        loadMoreCmp: {
            xtype: 'component',
            baseCls: Ext.baseCSSPrefix + 'list-paging',
            scrollDock: 'bottom',
            docked: 'bottom',
            hidden: true
        },

        /**
         * @private
         * @cfg {Boolean} loadMoreCmpAdded Indicates whether or not the load more component has been added to the List
         * yet.
         */
        loadMoreCmpAdded: false,

        /**
         * @private
         * @cfg {String} loadingCls The CSS class that is added to the {@link #loadMoreCmp} while the Store is loading
         */
        loadingCls: Ext.baseCSSPrefix + 'loading',

        /**
         * @private
         * @cfg {Ext.List} list Local reference to the List this plugin is bound to
         */
        list: null,

        /**
         * @private
         * @cfg {Ext.scroll.Scroller} scroller Local reference to the List's Scroller
         */
        scroller: null,

        /**
         * @private
         * @cfg {Boolean} loading True if the plugin has initiated a Store load that has not yet completed
         */
        loading: false
    },

    /**
     * @private
     * Sets up all of the references the plugin needs
     */
    init: function(list) {
        var scroller = list.getScrollable().getScroller(),
            store    = list.getStore();

        this.setList(list);
        this.setScroller(scroller);
        this.bindStore(list.getStore());

        list.setScrollToTopOnRefresh(false);
        this.addLoadMoreCmp();

        // We provide our own load mask so if the Store is autoLoading already disable the List's mask straight away,
        // otherwise if the Store loads later allow the mask to show once then remove it thereafter
        if (store) {
            this.disableDataViewMask(store);
        }

        // The List's Store could change at any time so make sure we are informed when that happens
        list.updateStore = Ext.Function.createInterceptor(list.updateStore, this.bindStore, this);

        if (this.getAutoPaging()) {
            scroller.on({
                scrollend: this.onScrollEnd,
                scope: this
            });
        }
    },

    /**
     * @private
     */
    bindStore: function(newStore, oldStore) {
        if (oldStore) {
            oldStore.un({
                beforeload: this.onStoreBeforeLoad,
                load: this.onStoreLoad,
                scope: this
            });
        }

        if (newStore) {
            newStore.on({
                beforeload: this.onStoreBeforeLoad,
                load: this.onStoreLoad,
                scope: this
            });
        }
    },

    /**
     * @private
     * Removes the List/DataView's loading mask because we show our own in the plugin. The logic here disables the
     * loading mask immediately if the store is autoloading. If it's not autoloading, allow the mask to show the first
     * time the Store loads, then disable it and use the plugin's loading spinner.
     * @param {Ext.data.Store} store The store that is bound to the DataView
     */
    disableDataViewMask: function(store) {
        var list = this.getList();

        if (store.isAutoLoading()) {
            list.setLoadingText(null);
        } else {
            store.on({
                load: {
                    single: true,
                    fn: function() {
                        list.setLoadingText(null);
                    }
                }
            });
        }
    },

    /**
     * @private
     */
    applyLoadTpl: function(config) {
        return (Ext.isObject(config) && config.isTemplate) ? config : new Ext.XTemplate(config);
    },

    /**
     * @private
     */
    applyLoadMoreCmp: function(config) {
        config = Ext.merge(config, {
            html: this.getLoadTpl().apply({
                cssPrefix: Ext.baseCSSPrefix,
                message: this.getLoadMoreText()
            }),
            listeners: {
                tap: {
                    fn: this.loadNextPage,
                    scope: this,
                    element: 'element'
                }
            }
        });

        return Ext.factory(config, Ext.Component, this.getLoadMoreCmp());
    },

    /**
     * @private
     * If we're using autoPaging and detect that the user has scrolled to the bottom, kick off loading of the next page
     */
    onScrollEnd: function(scroller, x, y) {
        if (!this.getLoading() && y >= scroller.maxPosition.y) {
            this.loadNextPage();
        }
    },

    /**
     * @private
     * Makes sure we add/remove the loading CSS class while the Store is loading
     */
    updateLoading: function(isLoading) {
        var loadMoreCmp = this.getLoadMoreCmp(),
            loadMoreCls = this.getLoadingCls();

        if (isLoading) {
            loadMoreCmp.addCls(loadMoreCls);
        } else {
            loadMoreCmp.removeCls(loadMoreCls);
        }
    },

    /**
     * @private
     * If the Store is just about to load but it's currently empty, we hide the load more button because this is
     * usually an outcome of setting a new Store on the List so we don't want the load more button to flash while
     * the new Store loads
     */
    onStoreBeforeLoad: function(store) {
        if (store.getCount() === 0) {
            this.getLoadMoreCmp().hide();
        }
    },

    /**
     * @private
     */
    onStoreLoad: function(store) {
        var loadCmp  = this.getLoadMoreCmp(),
            template = this.getLoadTpl(),
            message  = this.storeFullyLoaded() ? this.getNoMoreRecordsText() : this.getLoadMoreText();

        if (store.getCount()) {
            loadCmp.show();
            this.getList().scrollDockHeightRefresh();
        }
        this.setLoading(false);

        //if we've reached the end of the data set, switch to the noMoreRecordsText
        loadCmp.setHtml(template.apply({
            cssPrefix: Ext.baseCSSPrefix,
            message: message
        }));
    },

    /**
     * @private
     * Because the attached List's inner list element is rendered after our init function is called,
     * we need to dynamically add the loadMoreCmp later. This does this once and caches the result.
     */
    addLoadMoreCmp: function() {
        var list = this.getList(),
            cmp  = this.getLoadMoreCmp();

        if (!this.getLoadMoreCmpAdded()) {
            list.add(cmp);

            /**
             * @event loadmorecmpadded  Fired when the Load More component is added to the list. Fires on the List.
             * @param {Ext.plugin.ListPaging} this The list paging plugin
             * @param {Ext.List} list The list
             */
            list.fireEvent('loadmorecmpadded', this, list);
            this.setLoadMoreCmpAdded(true);
        }

        return cmp;
    },

    /**
     * @private
     * Returns true if the Store is detected as being fully loaded, or the server did not return a total count, which
     * means we're in 'infinite' mode
     * @return {Boolean}
     */
    storeFullyLoaded: function() {
        var store = this.getList().getStore(),
            total = store.getTotalCount();

        return total !== null ? store.getTotalCount() <= (store.currentPage * store.getPageSize()) : false;
    },

    /**
     * @private
     */
    loadNextPage: function() {
        var me = this;
        if (!me.storeFullyLoaded()) {
            me.setLoading(true);
            me.getList().getStore().nextPage({ addRecords: true });
        }
    }
});
