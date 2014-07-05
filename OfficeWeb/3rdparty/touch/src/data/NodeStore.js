/**
 * @private
 */
Ext.define('Ext.data.NodeStore', {
    extend: 'Ext.data.Store',
    alias: 'store.node',
    requires: ['Ext.data.NodeInterface'],

    config: {
        /**
         * @cfg {Ext.data.Model} node The Record you want to bind this Store to. Note that
         * this record will be decorated with the {@link Ext.data.NodeInterface} if this is not the
         * case yet.
         * @accessor
         */
        node: null,

        /**
         * @cfg {Boolean} recursive Set this to `true` if you want this NodeStore to represent
         * all the descendants of the node in its flat data collection. This is useful for
         * rendering a tree structure to a DataView and is being used internally by
         * the TreeView. Any records that are moved, removed, inserted or appended to the
         * node at any depth below the node this store is bound to will be automatically
         * updated in this Store's internal flat data structure.
         * @accessor
         */
        recursive: false,

        /**
         * @cfg {Boolean} rootVisible `false` to not include the root node in this Stores collection.
         * @accessor
         */
        rootVisible: false,

        sorters: undefined,
        filters: undefined,

        /**
         * @cfg {Boolean} folderSort
         * Set to `true` to automatically prepend a leaf sorter.
         */
        folderSort: false
    },

    afterEdit: function(record, modifiedFields) {
        if (modifiedFields) {
            if (modifiedFields.indexOf('loaded') !== -1) {
                return this.add(this.retrieveChildNodes(record));
            }
            if (modifiedFields.indexOf('expanded') !== -1) {
                return this.filter();
            }
            if (modifiedFields.indexOf('sorted') !== -1) {
                return this.sort();
            }
        }
        this.callParent(arguments);
    },

    onNodeAppend: function(parent, node) {
        this.add([node].concat(this.retrieveChildNodes(node)));
    },

    onNodeInsert: function(parent, node) {
        this.add([node].concat(this.retrieveChildNodes(node)));
    },

    onNodeRemove: function(parent, node) {
        this.remove([node].concat(this.retrieveChildNodes(node)));
    },

    onNodeSort: function() {
        this.sort();
    },

    updateFolderSort: function(folderSort) {
        if (folderSort) {
            this.setGrouper(function(node) {
                if (node.isLeaf()) {
                    return 1;
                }
                return 0;
            });
        } else {
            this.setGrouper(null);
        }
    },

    createDataCollection: function() {
        var collection = this.callParent();
        collection.handleSort = Ext.Function.bind(this.handleTreeSort, this, [collection], true);
        collection.findInsertionIndex = Ext.Function.bind(this.handleTreeInsertionIndex, this, [collection, collection.findInsertionIndex], true);
        return collection;
    },

    handleTreeInsertionIndex: function(items, item, collection, originalFn) {
        return originalFn.call(collection, items, item, this.treeSortFn);
    },

    handleTreeSort: function(data) {
        Ext.Array.sort(data, this.treeSortFn);
        return data;
    },

    /**
     * This is a custom tree sorting algorithm. It uses the index property on each node to determine
     * how to sort siblings. It uses the depth property plus the index to create a weight for each node.
     * This weight algorithm has the limitation of not being able to go more then 80 levels in depth, or
     * more then 10k nodes per parent. The end result is a flat collection being correctly sorted based
     * on this one single sort function.
     * @param node1
     * @param node2
     * @return {Number}
     * @private
     */
    treeSortFn: function(node1, node2) {
        // A shortcut for siblings
        if (node1.parentNode === node2.parentNode) {
            return (node1.data.index < node2.data.index) ? -1 : 1;
        }

        // @NOTE: with the following algorithm we can only go 80 levels deep in the tree
        // and each node can contain 10000 direct children max
        var weight1 = 0,
            weight2 = 0,
            parent1 = node1,
            parent2 = node2;

        while (parent1) {
            weight1 += (Math.pow(10, (parent1.data.depth+1) * -4) * (parent1.data.index+1));
            parent1 = parent1.parentNode;
        }
        while (parent2) {
            weight2 += (Math.pow(10, (parent2.data.depth+1) * -4) * (parent2.data.index+1));
            parent2 = parent2.parentNode;
        }

        if (weight1 > weight2) {
            return 1;
        } else if (weight1 < weight2) {
            return -1;
        }
        return (node1.data.index > node2.data.index) ? 1 : -1;
    },

    applyFilters: function(filters) {
        var me = this;
        return function(item) {
            return me.isVisible(item);
        };
    },

    applyProxy: function(proxy) {
        //<debug>
        if (proxy) {
            Ext.Logger.warn("A NodeStore cannot be bound to a proxy. Instead bind it to a record " +
                            "decorated with the NodeInterface by setting the node config.");
        }
        //</debug>
    },

    applyNode: function(node) {
        if (node) {
            node = Ext.data.NodeInterface.decorate(node);
        }
        return node;
    },

    updateNode: function(node, oldNode) {
        if (oldNode && !oldNode.isDestroyed) {
            oldNode.un({
                append  : 'onNodeAppend',
                insert  : 'onNodeInsert',
                remove  : 'onNodeRemove',
                load    : 'onNodeLoad',
                scope: this
            });
            oldNode.unjoin(this);
        }

        if (node) {
            node.on({
                scope   : this,
                append  : 'onNodeAppend',
                insert  : 'onNodeInsert',
                remove  : 'onNodeRemove',
                load    : 'onNodeLoad'
            });

            node.join(this);

            var data = [];
            if (node.childNodes.length) {
                data = data.concat(this.retrieveChildNodes(node));
            }
            if (this.getRootVisible()) {
                data.push(node);
            } else if (node.isLoaded() || node.isLoading()) {
                node.set('expanded', true);
            }

            this.data.clear();
            this.fireEvent('clear', this);

            this.suspendEvents();
            this.add(data);
            this.resumeEvents();

            this.fireEvent('refresh', this, this.data);
        }
    },

    /**
     * Private method used to deeply retrieve the children of a record without recursion.
     * @private
     * @param root
     * @return {Array}
     */
    retrieveChildNodes: function(root) {
        var node = this.getNode(),
            recursive = this.getRecursive(),
            added = [],
            child = root;

        if (!root.childNodes.length || (!recursive && root !== node)) {
            return added;
        }

        if (!recursive) {
            return root.childNodes;
        }

        while (child) {
            if (child._added) {
                delete child._added;
                if (child === root) {
                    break;
                } else {
                    child = child.nextSibling || child.parentNode;
                }
            } else {
                if (child !== root) {
                    added.push(child);
                }
                if (child.firstChild) {
                    child._added = true;
                    child = child.firstChild;
                } else {
                    child = child.nextSibling || child.parentNode;
                }
            }
        }

        return added;
    },

    /**
     * @param {Object} node
     * @return {Boolean}
     */
    isVisible: function(node) {
        var parent = node.parentNode;

        if (!this.getRecursive() && parent !== this.getNode()) {
            return false;
        }

        while (parent) {
            if (!parent.isExpanded()) {
                return false;
            }

            //we need to check this because for a nodestore the node is not likely to be the root
            //so we stop going up the chain when we hit the original node as we don't care about any
            //ancestors above the configured node
            if (parent === this.getNode()) {
                break;
            }

            parent = parent.parentNode;
        }
        return true;
    }
});
