/**
 *
 */
Ext.define('Ext.layout.Default', {
    extend: 'Ext.layout.Abstract',

    isAuto: true,

    alias: ['layout.default', 'layout.auto'],

    requires: [
        'Ext.util.Wrapper',
        'Ext.layout.wrapper.BoxDock',
        'Ext.layout.wrapper.Inner'
    ],

    config: {
        /**
         * @cfg {Ext.fx.layout.Card} animation Layout animation configuration
         * Controls how layout transitions are animated.  Currently only available for
         * Card Layouts.
         *
         * Possible values are:
         *
         * - cover
         * - cube
         * - fade
         * - flip
         * - pop
         * - reveal
         * - scroll
         * - slide
         * @accessor
         */
        animation: null
    },

    centerWrapperClass: 'x-center',

    dockWrapperClass: 'x-dock',

    positionMap: {
        top: 'start',
        left: 'start',
        middle: 'center',
        bottom: 'end',
        right: 'end'
    },

    positionDirectionMap: {
        top: 'vertical',
        bottom: 'vertical',
        left: 'horizontal',
        right: 'horizontal'
    },

    setContainer: function(container) {
        var options = {
            delegate: '> component'
        };

        this.dockedItems = [];

        this.callSuper(arguments);

        container.on('centeredchange', 'onItemCenteredChange', this, options, 'before')
                 .on('floatingchange', 'onItemFloatingChange', this, options, 'before')
                 .on('dockedchange', 'onBeforeItemDockedChange', this, options, 'before')
                 .on('dockedchange', 'onAfterItemDockedChange', this, options);
    },

    monitorSizeStateChange: function() {
        this.monitorSizeStateChange = Ext.emptyFn;
        this.container.on('sizestatechange', 'onContainerSizeStateChange', this);
    },

    monitorSizeFlagsChange: function() {
        this.monitorSizeFlagsChange = Ext.emptyFn;
        this.container.on('sizeflagschange', 'onContainerSizeFlagsChange', this);
    },

    onItemAdd: function(item) {
        var docked = item.getDocked();

        if (docked !== null) {
            this.dockItem(item);
        }
        else if (item.isCentered()) {
            this.onItemCenteredChange(item, true);
        }
        else if (item.isFloating()) {
            this.onItemFloatingChange(item, true);
        }
        else {
            this.onItemInnerStateChange(item, true);
        }
    },

    /**
     *
     * @param item
     * @param isInner
     * @param [destroying]
     */
    onItemInnerStateChange: function(item, isInner, destroying) {
        if (isInner) {
            this.insertInnerItem(item, this.container.innerIndexOf(item));
        }
        else {
            this.removeInnerItem(item);
        }
    },

    insertInnerItem: function(item, index) {
        var container = this.container,
            containerDom = container.innerElement.dom,
            itemDom = item.element.dom,
            nextSibling = container.getInnerAt(index + 1),
            nextSiblingDom = nextSibling ? nextSibling.element.dom : null;

        containerDom.insertBefore(itemDom, nextSiblingDom);

        return this;
    },

    insertBodyItem: function(item) {
        var container = this.container.setUseBodyElement(true),
            bodyDom = container.bodyElement.dom;

        if (item.getZIndex() === null) {
            item.setZIndex((container.indexOf(item) + 1) * 2);
        }

        bodyDom.insertBefore(item.element.dom, bodyDom.firstChild);

        return this;
    },

    removeInnerItem: function(item) {
        item.element.detach();
    },

    removeBodyItem: function(item) {
        item.setZIndex(null);
        item.element.detach();
    },

    onItemRemove: function(item, index, destroying) {
        var docked = item.getDocked();

        if (docked) {
            this.undockItem(item);
        }
        else if (item.isCentered()) {
            this.onItemCenteredChange(item, false);
        }
        else if (item.isFloating()) {
            this.onItemFloatingChange(item, false);
        }
        else {
            this.onItemInnerStateChange(item, false, destroying);
        }
    },

    onItemMove: function(item, toIndex, fromIndex) {
        if (item.isCentered() || item.isFloating()) {
            item.setZIndex((toIndex + 1) * 2);
        }
        else if (item.isInnerItem()) {
            this.insertInnerItem(item, this.container.innerIndexOf(item));
        }
        else {
            this.undockItem(item);
            this.dockItem(item);
        }
    },

    onItemCenteredChange: function(item, centered) {
        var wrapperName = '$centerWrapper';

        if (centered) {
            this.insertBodyItem(item);
            item.link(wrapperName, new Ext.util.Wrapper({
                className: this.centerWrapperClass
            }, item.element));
        }
        else {
            item.unlink(wrapperName);
            this.removeBodyItem(item);
        }
    },

    onItemFloatingChange: function(item, floating) {
        if (floating) {
            this.insertBodyItem(item);
        }
        else {
            this.removeBodyItem(item);
        }
    },

    onBeforeItemDockedChange: function(item, docked, oldDocked) {
        if (oldDocked) {
            this.undockItem(item);
        }
    },

    onAfterItemDockedChange: function(item, docked, oldDocked) {
        if (docked) {
            this.dockItem(item);
        }
    },

    onContainerSizeStateChange: function() {
        var dockWrapper = this.getDockWrapper();

        if (dockWrapper) {
            dockWrapper.setSizeState(this.container.getSizeState());
        }
    },

    onContainerSizeFlagsChange: function() {
        var items = this.dockedItems,
            i, ln, item;

        for (i = 0, ln = items.length; i < ln; i++) {
            item = items[i];
            this.refreshDockedItemLayoutSizeFlags(item);
        }
    },

    refreshDockedItemLayoutSizeFlags: function(item) {
        var container = this.container,
            dockedDirection = this.positionDirectionMap[item.getDocked()],
            binaryMask = (dockedDirection === 'horizontal') ? container.LAYOUT_HEIGHT : container.LAYOUT_WIDTH,
            flags = (container.getSizeFlags() & binaryMask);

        item.setLayoutSizeFlags(flags);
    },

    dockItem: function(item) {
        var DockClass = Ext.layout.wrapper.BoxDock,
            dockedItems = this.dockedItems,
            ln = dockedItems.length,
            container = this.container,
            itemIndex = container.indexOf(item),
            positionDirectionMap = this.positionDirectionMap,
            direction = positionDirectionMap[item.getDocked()],
            dockInnerWrapper = this.dockInnerWrapper,
            referenceDirection, i, dockedItem, index, previousItem, slice,
            referenceItem, referenceDocked, referenceWrapper, newWrapper, nestedWrapper;

        this.monitorSizeStateChange();
        this.monitorSizeFlagsChange();

        if (!dockInnerWrapper) {
            dockInnerWrapper = this.link('dockInnerWrapper', new Ext.layout.wrapper.Inner({
                container: this.container
            }));
        }

        if (ln === 0) {
            dockedItems.push(item);

            newWrapper = new DockClass({
                container: this.container,
                direction: direction
            });

            newWrapper.addItem(item);
            newWrapper.getElement().replace(dockInnerWrapper.getElement());
            newWrapper.setInnerWrapper(dockInnerWrapper);
            container.onInitialized('onContainerSizeStateChange', this);
        }
        else {
            for (i = 0; i < ln; i++) {
                dockedItem = dockedItems[i];
                index = container.indexOf(dockedItem);

                if (index > itemIndex) {
                    referenceItem = previousItem || dockedItems[0];
                    dockedItems.splice(i, 0, item);
                    break;
                }

                previousItem = dockedItem;
            }

            if (!referenceItem) {
                referenceItem = dockedItems[ln - 1];
                dockedItems.push(item);
            }

            referenceDocked = referenceItem.getDocked();
            referenceWrapper = referenceItem.$dockWrapper;
            referenceDirection = positionDirectionMap[referenceDocked];

            if (direction === referenceDirection) {
                referenceWrapper.addItem(item);
            }
            else {
                slice = referenceWrapper.getItemsSlice(itemIndex);

                newWrapper = new DockClass({
                    container: this.container,
                    direction: direction
                });

                if (slice.length > 0) {
                    if (slice.length === referenceWrapper.itemsCount) {
                        nestedWrapper = referenceWrapper;
                        newWrapper.setSizeState(nestedWrapper.getSizeState());
                        newWrapper.getElement().replace(nestedWrapper.getElement());
                    }
                    else {
                        nestedWrapper = new DockClass({
                            container: this.container,
                            direction: referenceDirection
                        });
                        nestedWrapper.setInnerWrapper(referenceWrapper.getInnerWrapper());
                        nestedWrapper.addItems(slice);
                        referenceWrapper.setInnerWrapper(newWrapper);
                    }

                    newWrapper.setInnerWrapper(nestedWrapper);
                }
                else {
                    newWrapper.setInnerWrapper(referenceWrapper.getInnerWrapper());
                    referenceWrapper.setInnerWrapper(newWrapper);
                }

                newWrapper.addItem(item);
            }
        }

        container.onInitialized('refreshDockedItemLayoutSizeFlags', this, [item]);
    },

    getDockWrapper: function() {
        var dockedItems = this.dockedItems;

        if (dockedItems.length > 0) {
            return dockedItems[0].$dockWrapper;
        }

        return null;
    },

    undockItem: function(item) {
        var dockedItems = this.dockedItems;

        if (item.$dockWrapper) {
            item.$dockWrapper.removeItem(item);
        }

        Ext.Array.remove(dockedItems, item);

        item.setLayoutSizeFlags(0);
    },

    destroy: function() {
        this.dockedItems.length = 0;

        delete this.dockedItems;

        this.callSuper();
    }
});
