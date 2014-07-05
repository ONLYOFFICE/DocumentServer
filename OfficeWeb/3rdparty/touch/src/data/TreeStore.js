/**
 * @aside guide stores
 *
 * The TreeStore is a store implementation that allows for nested data.
 *
 * It provides convenience methods for loading nodes, as well as the ability to use
 * the hierarchical tree structure combined with a store. This class also relays many events from
 * the Tree for convenience.
 *
 * # Using Models
 *
 * If no Model is specified, an implicit model will be created that implements {@link Ext.data.NodeInterface}.
 * The standard Tree fields will also be copied onto the Model for maintaining their state. These fields are listed
 * in the {@link Ext.data.NodeInterface} documentation.
 *
 * # Reading Nested Data
 *
 * For the tree to read nested data, the {@link Ext.data.reader.Reader} must be configured with a root property,
 * so the reader can find nested data for each node. If a root is not specified, it will default to
 * 'children'.
 */
Ext.define('Ext.data.TreeStore', {
    extend: 'Ext.data.NodeStore',
    alias: 'store.tree',

    config: {
        /**
         * @cfg {Ext.data.Model/Ext.data.NodeInterface/Object} root
         * The root node for this store. For example:
         *
         *     root: {
         *         expanded: true,
         *         text: "My Root",
         *         children: [
         *             { text: "Child 1", leaf: true },
         *             { text: "Child 2", expanded: true, children: [
         *                 { text: "GrandChild", leaf: true }
         *             ] }
         *         ]
         *     }
         *
         * Setting the `root` config option is the same as calling {@link #setRootNode}.
         * @accessor
         */
        root: undefined,

        /**
         * @cfg {Boolean} clearOnLoad
         * Remove previously existing child nodes before loading. Default to true.
         * @accessor
         */
        clearOnLoad : true,

        /**
         * @cfg {String} nodeParam
         * The name of the parameter sent to the server which contains the identifier of the node.
         * Defaults to 'node'.
         * @accessor
         */
        nodeParam: 'node',

        /**
         * @cfg {String} defaultRootId
         * The default root id. Defaults to 'root'
         * @accessor
         */
        defaultRootId: 'root',

        /**
         * @cfg {String} defaultRootProperty
         * The root property to specify on the reader if one is not explicitly defined.
         * @accessor
         */
        defaultRootProperty: 'children',

        /**
         * @cfg {Boolean} recursive
         * @private
         * @hide
         */
        recursive: true

        /**
         * @cfg {Object} node
         * @private
         * @hide
         */
    },

    applyProxy: function() {
        return Ext.data.Store.prototype.applyProxy.apply(this, arguments);
    },

    applyRoot: function(root) {
        var me = this;
        root = root || {};
        root = Ext.apply({}, root);

        if (!root.isModel) {
            Ext.applyIf(root, {
                id: me.getStoreId() + '-' + me.getDefaultRootId(),
                text: 'Root',
                allowDrag: false
            });

            root = Ext.data.ModelManager.create(root, me.getModel());
        }

        Ext.data.NodeInterface.decorate(root);
        root.set(root.raw);

        return root;
    },

    handleTreeInsertionIndex: function(items, item, collection, originalFn) {
        if (item.parentNode) {
            item.parentNode.sort(collection.getSortFn(), true, true);
        }
        return this.callParent(arguments);
    },

    handleTreeSort: function(data, collection) {
        if (this._sorting) {
            return data;
        }

        this._sorting = true;
        this.getNode().sort(collection.getSortFn(), true, true);
        delete this._sorting;
        return this.callParent(arguments);
    },

    updateRoot: function(root, oldRoot) {
        if (oldRoot) {
            oldRoot.unBefore({
                expand: 'onNodeBeforeExpand',
                scope: this
            });
            oldRoot.unjoin(this);
        }

        root.onBefore({
            expand: 'onNodeBeforeExpand',
            scope: this
        });

        this.onNodeAppend(null, root);
        this.setNode(root);

        if (!root.isLoaded() && !root.isLoading() && root.isExpanded()) {
            this.load({
                node: root
            });
        }

        /**
         * @event rootchange
         * Fires whenever the root node changes on this TreeStore.
         * @param {Ext.data.TreeStore} store This tree Store
         * @param {Ext.data.Model} newRoot The new root node
         * @param {Ext.data.Model} oldRoot The old root node
         */
        this.fireEvent('rootchange', this, root, oldRoot);
    },

    /**
     * Returns the record node by id
     * @return {Ext.data.NodeInterface}
     */
    getNodeById: function(id) {
        return this.data.getByKey(id);
    },

    onNodeBeforeExpand: function(node, options, e) {
        if (node.isLoading()) {
            e.pause();
            this.on('load', function() {
                e.resume();
            }, this, {single: true});
        }
        else if (!node.isLoaded()) {
            e.pause();
            this.load({
                node: node,
                callback: function() {
                    e.resume();
                }
            });
        }
    },

    onNodeAppend: function(parent, node) {
        var proxy = this.getProxy(),
            reader = proxy.getReader(),
            Model = this.getModel(),
            data = node.raw,
            records = [],
            rootProperty = reader.getRootProperty(),
            dataRoot, processedData, i, ln, processedDataItem;

        if (!node.isLeaf()) {
            dataRoot = reader.getRoot(data);
            if (dataRoot) {
                processedData = reader.extractData(dataRoot);
                for (i = 0, ln = processedData.length; i < ln; i++) {
                    processedDataItem = processedData[i];
                    records.push(new Model(processedDataItem.data, processedDataItem.id, processedDataItem.node));
                }

                if (records.length) {
                    this.fillNode(node, records);
                } else {
                    node.set('loaded', true);
                }
                // If the child record is not a leaf, and it has a data root (e.g. items: [])
                // and there are items in this data root, then we call fillNode to automatically
                // add these items. fillNode sets the loaded property on the node, meaning that
                // the next time you expand that node, it's not going to the server to request the
                // children. If however you pass back an empty array as items, we have to set the
                // loaded property to true here as well to prevent the items from being be loaded
                // from the server the next time you expand it.
                // If you want to have the items loaded on the next expand, then the data for the
                // node should not contain the items: [] array.
                delete data[rootProperty];
            }
        }
    },

    updateAutoLoad: function(autoLoad) {
        if (autoLoad) {
            var root = this.getRoot();
            if (!root.isLoaded() && !root.isLoading()) {
                this.load({node: root});
            }
        }
    },

    /**
     * Loads the Store using its configured {@link #proxy}.
     * @param {Object} options (Optional) config object. This is passed into the {@link Ext.data.Operation Operation}
     * object that is created and then sent to the proxy's {@link Ext.data.proxy.Proxy#read} function.
     * The options can also contain a node, which indicates which node is to be loaded. If not specified, it will
     * default to the root node.
     * @return {Object}
     */
    load: function(options) {
        options = options || {};
        options.params = options.params || {};

        var me = this,
            node = options.node = options.node || me.getRoot();

        options.params[me.getNodeParam()] = node.getId();

        if (me.getClearOnLoad()) {
            node.removeAll(true);
        }
        node.set('loading', true);

        return me.callParent([options]);
    },

    updateProxy: function(proxy) {
        this.callParent(arguments);

        var reader = proxy.getReader();
        if (!reader.getRootProperty()) {
            reader.setRootProperty(this.getDefaultRootProperty());
            reader.buildExtractors();
        }
    },

    /**
     * @inheritdoc
     */
    removeAll: function() {
        this.getRoot().removeAll(true);
        this.callParent(arguments);
    },

    /**
     * @inheritdoc
     */
    onProxyLoad: function(operation) {
        var me = this,
            records = operation.getRecords(),
            successful = operation.wasSuccessful(),
            node = operation.getNode();

        node.beginEdit();
        node.set('loading', false);
        if (successful) {
            records = me.fillNode(node, records);
        }
        node.endEdit();

        me.loading = false;
        me.loaded = true;

        node.fireEvent('load', node, records, successful);
        me.fireEvent('load', this, records, successful, operation);

        //this is a callback that would have been passed to the 'read' function and is optional
        Ext.callback(operation.getCallback(), operation.getScope() || me, [records, operation, successful]);
    },

    /**
     * Fills a node with a series of child records.
     * @private
     * @param {Ext.data.NodeInterface} node The node to fill.
     * @param {Ext.data.Model[]} records The records to add.
     */
    fillNode: function(node, records) {
        var ln = records ? records.length : 0,
            i, child;

        for (i = 0; i < ln; i++) {
            // true/true to suppress any events fired by the node, or the new child node
            child = node.appendChild(records[i], true, true);
            this.onNodeAppend(node, child);
        }
        node.set('loaded', true);

        return records;
    }

    // <deprecated product=touch since=2.0>
}, function() {
    this.override({
        /**
         * Sets the root node for this tree.
         * @param {Ext.data.Model} node
         * @return {Ext.data.Model}
         * @deprecated Use {@link #setRoot} instead.
         */
        setRootNode: function(node) {
            // <debug>
            Ext.Logger.warn('setRootNode has been deprecated. Please use setRoot instead.');
            // </debug>
            return this.setRoot(node);
        },

        /**
         * Returns the root node for this tree.
         * @return {Ext.data.Model}
         * @deprecated Use {@link #setRoot} instead.
         */
        getRootNode: function(node) {
            // <debug>
            Ext.Logger.warn('getRootNode has been deprecated. Please use getRoot instead.');
            // </debug>
            return this.getRoot();
        }
    });
    // </deprecated>
});
