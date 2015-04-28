/**
 *
 */
Ext.define('Ext.layout.wrapper.BoxDock', {
    config: {
        direction: 'horizontal',
        element: {
            className: 'x-dock'
        },
        bodyElement: {
            className: 'x-dock-body'
        },
        innerWrapper: null,
        sizeState: false,
        container: null
    },

    positionMap: {
        top: 'start',
        left: 'start',
        bottom: 'end',
        right: 'end'
    },

    constructor: function(config) {
        this.items = {
            start: [],
            end: []
        };

        this.itemsCount = 0;

        this.initConfig(config);
    },

    addItems: function(items) {
        var i, ln, item;

        for (i = 0, ln = items.length; i < ln; i++) {
            item = items[i];
            this.addItem(item);
        }
    },

    addItem: function(item) {
        var docked = item.getDocked(),
            position = this.positionMap[docked],
            wrapper = item.$dockWrapper,
            container = this.getContainer(),
            index = container.indexOf(item),
            element = item.element,
            items = this.items,
            sideItems = items[position],
            i, ln, sibling, referenceElement, siblingIndex;

        if (wrapper) {
            wrapper.removeItem(item);
        }

        item.$dockWrapper = this;
        item.addCls('x-dock-item');
        item.addCls('x-docked-' + docked);

        for (i = 0, ln = sideItems.length; i < ln; i++) {
            sibling = sideItems[i];
            siblingIndex = container.indexOf(sibling);

            if (siblingIndex > index) {
                referenceElement = sibling.element;
                sideItems.splice(i, 0, item);
                break;
            }
        }

        if (!referenceElement) {
            sideItems.push(item);
            referenceElement = this.getBodyElement();
        }

        this.itemsCount++;

        if (position === 'start') {
            element.insertBefore(referenceElement);
        }
        else {
            element.insertAfter(referenceElement);
        }
    },

    removeItem: function(item) {
        var position = item.getDocked(),
            items = this.items[this.positionMap[position]];

        Ext.Array.remove(items, item);
        item.element.detach();
        delete item.$dockWrapper;
        item.removeCls('x-dock-item');
        item.removeCls('x-docked-' + position);

        if (--this.itemsCount === 0) {
            this.destroy();
        }
    },

    getItemsSlice: function(index) {
        var container = this.getContainer(),
            items = this.items,
            slice = [],
            sideItems, i, ln, item;

        for (sideItems = items.start, i = 0, ln = sideItems.length; i < ln; i++) {
            item = sideItems[i];
            if (container.indexOf(item) > index) {
                slice.push(item);
            }
        }

        for (sideItems = items.end, i = 0, ln = sideItems.length; i < ln; i++) {
            item = sideItems[i];
            if (container.indexOf(item) > index) {
                slice.push(item);
            }
        }

        return slice;
    },

    applyElement: function(element) {
        return Ext.Element.create(element);
    },

    updateElement: function(element) {
        element.addCls('x-dock-' + this.getDirection());
    },

    applyBodyElement: function(bodyElement) {
        return Ext.Element.create(bodyElement);
    },

    updateBodyElement: function(bodyElement) {
        this.getElement().append(bodyElement);
    },

    updateInnerWrapper: function(innerWrapper, oldInnerWrapper) {
        var bodyElement = this.getBodyElement();

        if (oldInnerWrapper && oldInnerWrapper.$outerWrapper === this) {
            oldInnerWrapper.getElement().detach();
            delete oldInnerWrapper.$outerWrapper;
        }

        if (innerWrapper) {
            innerWrapper.setSizeState(this.getSizeState());
            innerWrapper.$outerWrapper = this;
            bodyElement.append(innerWrapper.getElement());
        }
    },

    updateSizeState: function(state) {
        var innerWrapper = this.getInnerWrapper();

        this.getElement().setSizeState(state);

        if (innerWrapper) {
            innerWrapper.setSizeState(state);
        }
    },

    destroy: function() {
        var innerWrapper = this.getInnerWrapper(),
            outerWrapper = this.$outerWrapper,
            innerWrapperElement;

        if (innerWrapper) {
            if (outerWrapper) {
                outerWrapper.setInnerWrapper(innerWrapper);
            }
            else {
                innerWrapperElement = innerWrapper.getElement();
                if (!innerWrapperElement.isDestroyed) {
                    innerWrapperElement.replace(this.getElement());
                }
                delete innerWrapper.$outerWrapper;
            }
        }

        delete this.$outerWrapper;

        this.setInnerWrapper(null);

        this.unlink('_bodyElement', '_element');

        this.callSuper();
    }
});
