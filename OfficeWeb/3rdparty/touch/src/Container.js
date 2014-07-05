/**
 * A Container has all of the abilities of {@link Ext.Component Component}, but lets you nest other Components inside
 * it. Applications are made up of lots of components, usually nested inside one another. Containers allow you to
 * render and arrange child Components inside them. Most apps have a single top-level Container called a Viewport,
 * which takes up the entire screen. Inside of this are child components, for example in a mail app the Viewport
 * Container's two children might be a message List and an email preview pane.
 *
 * Containers give the following extra functionality:
 *
 * - Adding child Components at instantiation and run time
 * - Removing child Components
 * - Specifying a [Layout](#!/guide/layouts)
 *
 * Layouts determine how the child Components should be laid out on the screen. In our mail app example we'd use an
 * HBox layout so that we can pin the email list to the left hand edge of the screen and allow the preview pane to
 * occupy the rest. There are several layouts in Sencha Touch 2, each of which help you achieve your desired
 * application structure, further explained in the [Layout guide](#!/guide/layouts).
 *
 * ## Adding Components to Containers
 *
 * As we mentioned above, Containers are special Components that can have child Components arranged by a Layout. One of
 * the code samples above showed how to create a Panel with 2 child Panels already defined inside it but it's easy to
 * do this at run time too:
 *
 *     @example miniphone
 *     //this is the Panel we'll be adding below
 *     var aboutPanel = Ext.create('Ext.Panel', {
 *         html: 'About this app'
 *     });
 *
 *     //this is the Panel we'll be adding to
 *     var mainPanel = Ext.create('Ext.Panel', {
 *         fullscreen: true,
 *
 *         layout: 'hbox',
 *         defaults: {
 *             flex: 1
 *         },
 *
 *         items: {
 *             html: 'First Panel',
 *             style: 'background-color: #5E99CC;'
 *         }
 *     });
 *
 *     //now we add the first panel inside the second
 *     mainPanel.add(aboutPanel);
 *
 * Here we created three Panels in total. First we made the aboutPanel, which we might use to tell the user a little
 * about the app. Then we create one called mainPanel, which already contains a third Panel in its
 * {@link Ext.Container#cfg-items items} configuration, with some dummy text ("First Panel"). Finally, we add the first
 * panel to the second by calling the {@link Ext.Container#method-add add} method on `mainPanel`.
 *
 * In this case we gave our mainPanel another hbox layout, but we also introduced some
 * {@link Ext.Container#defaults defaults}. These are applied to every item in the Panel, so in this case every child
 * inside `mainPanel` will be given a `flex: 1` configuration. The effect of this is that when we first render the screen
 * only a single child is present inside `mainPanel`, so that child takes up the full width available to it. Once the
 * `mainPanel.add` line is called though, the `aboutPanel` is rendered inside of it and also given a `flex` of 1, which will
 * cause it and the first panel to both receive half the full width of the `mainPanel`.
 *
 * Likewise, it's easy to remove items from a Container:
 *
 *     mainPanel.remove(aboutPanel);
 *
 * After this line is run everything is back to how it was, with the first child panel once again taking up the full
 * width inside `mainPanel`.
 *
 * ## Further Reading
 *
 * See the [Component & Container Guide](#!/guide/components) for more information, and check out the
 * {@link Ext.Container} class docs also.
 *
 * @aside guide components
 * @aside guide layouts
 */
Ext.define('Ext.Container', {
    extend: 'Ext.Component',

    alternateClassName: 'Ext.lib.Container',

    requires: [
        'Ext.layout.*',
        'Ext.ItemCollection',
        'Ext.behavior.Scrollable',
        'Ext.Mask'
    ],

    xtype: 'container',

    /**
     * @event add
     * Fires whenever item added to the Container.
     * @param {Ext.Container} this The Container instance.
     * @param {Object} item The item added to the Container.
     * @param {Number} index The index of the item within the Container.
     */

    /**
     * @event remove
     * Fires whenever item removed from the Container.
     * @param {Ext.Container} this The Container instance.
     * @param {Object} item The item removed from the Container.
     * @param {Number} index The index of the item that was removed.
     */

    /**
     * @event move
     * Fires whenever item moved within the Container.
     * @param {Ext.Container} this The Container instance.
     * @param {Object} item The item moved within the Container.
     * @param {Number} toIndex The new index of the item.
     * @param {Number} fromIndex The old index of the item.
     */

    /**
     * @private
     * @event renderedchange
     * Fires whenever an item is rendered into a container or derendered
     * from a Container.
     * @param {Ext.Container} this The Container instance.
     * @param {Object} item The item in the Container.
     * @param {Boolean} rendered The current rendered status of the item.
     */

    /**
     * @event activate
     * Fires whenever item within the Container is activated.
     * @param {Ext.Container} this The Container instance.
     * @param {Object} newActiveItem The new active item within the container.
     * @param {Object} oldActiveItem The old active item within the container.
     */

    /**
     * @event deactivate
     * Fires whenever item within the Container is deactivated.
     * @param {Ext.Container} this The Container instance.
     * @param {Object} newActiveItem The new active item within the container.
     * @param {Object} oldActiveItem The old active item within the container.
     */

    eventedConfig: {
        /**
         * @cfg {Object/String/Number} activeItem The item from the {@link #cfg-items} collection that will be active first. This is
         * usually only meaningful in a {@link Ext.layout.Card card layout}, where only one item can be active at a
         * time. If passes a string, it will be assumed to be a {@link Ext.ComponentQuery} selector.
         * @accessor
         * @evented
         */
        activeItem: 0,

        /**
         * @cfg {Boolean/String/Object} scrollable
         * Configuration options to make this Container scrollable. Acceptable values are:
         *
         * - `'horizontal'`, `'vertical'`, `'both'` to enabling scrolling for that direction.
         * - `true`/`false` to explicitly enable/disable scrolling.
         *
         * Alternatively, you can give it an object which is then passed to the scroller instance:
         *
         *     scrollable: {
         *         direction: 'vertical',
         *         directionLock: true
         *     }
         *
         * Please look at the {@link Ext.scroll.Scroller} documentation for more example on how to use this.
         * @accessor
         * @evented
         */
        scrollable: null
    },

    config: {
        /**
         * @cfg {String/Object/Boolean} cardSwitchAnimation
         * Animation to be used during transitions of cards.
         * @removed 2.0.0 Please use {@link Ext.layout.Card#animation} instead
         */

        /**
         * @cfg {Object/String} layout Configuration for this Container's layout. Example:
         *
         *     Ext.create('Ext.Container', {
         *         layout: {
         *             type: 'hbox',
         *             align: 'middle'
         *         },
         *         items: [
         *             {
         *                 xtype: 'panel',
         *                 flex: 1,
         *                 style: 'background-color: red;'
         *             },
         *             {
         *                 xtype: 'panel',
         *                 flex: 2,
         *                 style: 'background-color: green'
         *             }
         *         ]
         *     });
         *
         * See the [Layouts Guide](#!/guide/layouts) for more information.
         *
         * @accessor
         */
        layout: null,

        /**
         * @cfg {Object} control Enables you to easily control Components inside this Container by listening to their
         * events and taking some action. For example, if we had a container with a nested Disable button, and we
         * wanted to hide the Container when the Disable button is tapped, we could do this:
         *
         *     Ext.create('Ext.Container', {
         *         control: {
         *            'button[text=Disable]': {
         *                tap: 'hideMe'
         *            }
         *         },
         *
         *         hideMe: function () {
         *             this.hide();
         *         }
         *     });
         *
         * We used a {@link Ext.ComponentQuery} selector to listen to the {@link Ext.Button#tap tap} event on any
         * {@link Ext.Button button} anywhere inside the Container that has the {@link Ext.Button#text text} 'Disable'.
         * Whenever a Component matching that selector fires the `tap` event our `hideMe` function is called. `hideMe` is
         * called with scope: `this` (e.g. `this` is the Container instance).
         *
         */
        control: {},

        /**
         * @cfg {Object} defaults A set of default configurations to apply to all child Components in this Container.
         * It's often useful to specify defaults when creating more than one items with similar configurations. For
         * example here we can specify that each child is a panel and avoid repeating the xtype declaration for each
         * one:
         *
         *     Ext.create('Ext.Container', {
         *         defaults: {
         *             xtype: 'panel'
         *         },
         *         items: [
         *             {
         *                 html: 'Panel 1'
         *             },
         *             {
         *                 html: 'Panel 2'
         *             }
         *         ]
         *     });
         *
         * @accessor
         */
        defaults: null,

        /**
         * @cfg {Array/Object} items The child items to add to this Container. This is usually an array of Component
         * configurations or instances, for example:
         *
         *     Ext.create('Ext.Container', {
         *         items: [
         *             {
         *                 xtype: 'panel',
         *                 html: 'This is an item'
         *             }
         *         ]
         *     });
         * @accessor
         */
        items: null,

        /**
         * @cfg {Boolean} autoDestroy If `true`, child items will be destroyed as soon as they are {@link #method-remove removed}
         * from this container.
         * @accessor
         */
        autoDestroy: true,

        /** @cfg {String} defaultType
         * The default {@link Ext.Component xtype} of child Components to create in this Container when a child item
         * is specified as a raw configuration object, rather than as an instantiated Component.
         * @accessor
         */
        defaultType: null,

        //@private
        useBodyElement: null,

        /**
         * @cfg {Boolean/Object/Ext.Mask/Ext.LoadMask} masked
         * A configuration to allow you to mask this container.
         * You can optionally pass an object block with and xtype of `loadmask`, and an optional `message` value to
         * display a loading mask. Please refer to the {@link Ext.LoadMask} component to see other configurations.
         *
         *     masked: {
         *         xtype: 'loadmask',
         *         message: 'My message'
         *     }
         *
         * Alternatively, you can just call the setter at any time with `true`/`false` to show/hide the mask:
         *
         *     setMasked(true); //show the mask
         *     setMasked(false); //hides the mask
         *
         * There are also two convenient methods, {@link #method-mask} and {@link #unmask}, to allow you to mask and unmask
         * this container at any time.
         *
         * Remember, the {@link Ext.Viewport} is always a container, so if you want to mask your whole application at anytime,
         * can call:
         *
         *     Ext.Viewport.setMasked({
         *         xtype: 'loadmask',
         *         message: 'Hello'
         *     });
         *
         * @accessor
         */
        masked: null,

        /**
         * @cfg {Boolean} modal `true` to make this Container modal. This will create a mask underneath the Container
         * that covers its parent and does not allow the user to interact with any other Components until this
         * Container is dismissed.
         * @accessor
         */
        modal: null,

        /**
         * @cfg {Boolean} hideOnMaskTap When using a {@link #modal} Component, setting this to `true` will hide the modal
         * mask and the Container when the mask is tapped on.
         * @accessor
         */
        hideOnMaskTap: null
    },

    isContainer: true,

    constructor: function(config) {
        var me = this;

        me._items = me.items = new Ext.ItemCollection();
        me.innerItems = [];

        me.onItemAdd = me.onFirstItemAdd;

        me.callParent(arguments);
    },

    getElementConfig: function() {
        return {
            reference: 'element',
            classList: ['x-container', 'x-unsized'],
            children: [{
                reference: 'innerElement',
                className: 'x-inner'
            }]
        };
    },

    /**
     * Changes the {@link #masked} configuration when its setter is called, which will convert the value
     * into a proper object/instance of {@link Ext.Mask}/{@link Ext.LoadMask}. If a mask already exists,
     * it will use that instead.
     * @param masked
     * @param currentMask
     * @return {Object}
     */
    applyMasked: function(masked, currentMask) {
        var isVisible = true;

        if (masked === false) {
            masked = true;
            isVisible = false;
        }

        currentMask = Ext.factory(masked, Ext.Mask, currentMask);

        if (currentMask) {
            this.add(currentMask);
            currentMask.setHidden(!isVisible);
        }

        return currentMask;
    },

    /**
     * Convenience method which calls {@link #setMasked} with a value of `true` (to show the mask). For additional
     * functionality, call the {@link #setMasked} function direction (See the {@link #masked} configuration documentation
     * for more information).
     */
    mask: function(mask) {
        this.setMasked(mask || true);
    },

    /**
     * Convenience method which calls {@link #setMasked} with a value of false (to hide the mask). For additional
     * functionality, call the {@link #setMasked} function direction (See the {@link #masked} configuration documentation
     * for more information).
     */
    unmask: function() {
        this.setMasked(false);
    },


    setParent: function(container) {
        this.callSuper(arguments);

        if (container) {
            var modal = this.getModal();

            if (modal) {
                container.insertBefore(modal, this);
                modal.setZIndex(this.getZIndex() - 1);
            }
        }
    },

    applyModal: function(modal, currentModal) {
        var isVisible = true;

        if (modal === false) {
            modal = true;
            isVisible = false;
        }

        currentModal = Ext.factory(modal, Ext.Mask, currentModal);

        if (currentModal) {
            currentModal.setVisibility(isVisible);
        }

        return currentModal;
    },

    updateModal: function(modal) {
        var container = this.getParent();

        if (container) {
            if (modal) {
                container.insertBefore(modal, this);
                modal.setZIndex(this.getZIndex() - 1);
            }
            else {
                container.remove(modal);
            }
        }
    },

    updateHideOnMaskTap : function(hide) {
        var mask = this.getModal();

        if (mask) {
            mask[hide ? 'on' : 'un'].call(mask, 'tap', 'hide', this);
        }
    },

    updateZIndex: function(zIndex) {
        var modal = this.getModal();

        this.callParent(arguments);

        if (modal) {
            modal.setZIndex(zIndex - 1);
        }
    },

    updateBaseCls: function(newBaseCls, oldBaseCls) {
        var me = this,
            ui = me.getUi();

        if (newBaseCls) {
            this.element.addCls(newBaseCls);
            this.innerElement.addCls(newBaseCls, null, 'inner');

            if (ui) {
                this.element.addCls(newBaseCls, null, ui);
            }
        }

        if (oldBaseCls) {
            this.element.removeCls(oldBaseCls);
            this.innerElement.removeCls(newBaseCls, null, 'inner');

            if (ui) {
                this.element.removeCls(oldBaseCls, null, ui);
            }
        }
    },

    updateUseBodyElement: function(useBodyElement) {
        if (useBodyElement) {
            this.link('bodyElement', this.innerElement.wrap({
                cls: 'x-body'
            }));
        }
    },

    applyItems: function(items, collection) {
        if (items) {
            var me = this;

            me.getDefaultType();
            me.getDefaults();

            if (me.initialized && collection.length > 0) {
                me.removeAll();
            }

            me.add(items);

            //Don't need to call setActiveItem when Container is first initialized
            if (me.initialized) {
                var activeItem = me.initialConfig.activeItem || me.config.activeItem || 0;

                me.setActiveItem(activeItem);
            }
        }
    },

    /**
     * @private
     */
     applyControl: function(selectors) {
         var selector, key, listener, listeners;

         for (selector in selectors) {
             listeners = selectors[selector];

             for (key in listeners) {
                 listener = listeners[key];

                 if (Ext.isObject(listener)) {
                     listener.delegate = selector;
                 }
             }

             listeners.delegate = selector;

             this.addListener(listeners);
         }

         return selectors;
     },

    /**
     * Initialize layout and event listeners the very first time an item is added
     * @private
     */
    onFirstItemAdd: function() {
        delete this.onItemAdd;

        if (this.innerHtmlElement && !this.getHtml()) {
            this.innerHtmlElement.destroy();
            delete this.innerHtmlElement;
        }

        this.on('innerstatechange', 'onItemInnerStateChange', this, {
            delegate: '> component'
        });

        return this.onItemAdd.apply(this, arguments);
    },

    //<debug error>
    updateLayout: function(newLayout, oldLayout) {
        if (oldLayout && oldLayout.isLayout) {
            Ext.Logger.error('Replacing a layout after one has already been initialized is not currently supported.');
        }
    },
    //</debug>

    getLayout: function() {
        var layout = this.layout;
        if (!layout) {
            layout = this.link('_layout', this.link('layout', Ext.factory(this._layout || 'default', Ext.layout.Default, null, 'layout')));
            layout.setContainer(this);
        }

        return layout;
    },

    updateDefaultType: function(defaultType) {
        // Cache the direct reference to the default item class here for performance
        this.defaultItemClass = Ext.ClassManager.getByAlias('widget.' + defaultType);

        //<debug error>
        if (!this.defaultItemClass) {
            Ext.Logger.error("Invalid defaultType of: '" + defaultType + "', must be a valid component xtype");
        }
        //</debug>
    },

    applyDefaults: function(defaults) {
        if (defaults) {
            this.factoryItem = this.factoryItemWithDefaults;
            return defaults;
        }
    },

    factoryItem: function(item) {
        //<debug error>
        if (!item) {
            Ext.Logger.error("Invalid item given: " + item + ", must be either the config object to factory a new item, " +
                "or an existing component instance");
        }
        //</debug>

        return Ext.factory(item, this.defaultItemClass);
    },

    factoryItemWithDefaults: function(item) {
        //<debug error>
        if (!item) {
            Ext.Logger.error("Invalid item given: " + item + ", must be either the config object to factory a new item, " +
                "or an existing component instance");
        }
        //</debug>

        var me = this,
            defaults = me.getDefaults(),
            instance;

        if (!defaults) {
            return Ext.factory(item, me.defaultItemClass);
        }

        // Existing instance
        if (item.isComponent) {
            instance = item;

            // Apply defaults only if this is not already an item of this container
            if (defaults && item.isInnerItem() && !me.has(instance)) {
                instance.setConfig(defaults, true);
            }
        }
        // Config object
        else {
            if (defaults && !item.ignoreDefaults) {
                // Note:
                // - defaults is only applied to inner items
                // - we merge the given config together with defaults into a new object so that the original object stays intact
                if (!(
                        item.hasOwnProperty('left') &&
                        item.hasOwnProperty('right') &&
                        item.hasOwnProperty('top') &&
                        item.hasOwnProperty('bottom') &&
                        item.hasOwnProperty('docked') &&
                        item.hasOwnProperty('centered')
                    )) {
                    item = Ext.mergeIf({}, item, defaults);
                }
            }

            instance = Ext.factory(item, me.defaultItemClass);
        }

        return instance;
    },

    /**
     * Adds one or more Components to this Container. Example:
     *
     *     var myPanel = Ext.create('Ext.Panel', {
     *         html: 'This will be added to a Container'
     *     });
     *
     *     myContainer.add([myPanel]);
     *
     * @param {Object/Object[]/Ext.Component/Ext.Component[]} newItems The new items to add to the Container.
     * @return {Ext.Component} The last item added to the Container from the `newItems` array.
     */
    add: function(newItems) {
        var me = this,
            i, ln, item, newActiveItem;

        newItems = Ext.Array.from(newItems);

        ln = newItems.length;

        for (i = 0; i < ln; i++) {
            item = me.factoryItem(newItems[i]);
            this.doAdd(item);
            if (!newActiveItem && !this.getActiveItem() && this.innerItems.length > 0 && item.isInnerItem()) {
                newActiveItem = item;
            }
        }
        if (newActiveItem) {
            this.setActiveItem(newActiveItem);
        }

        return item;
    },

    /**
     * @private
     * @param item
     */
    doAdd: function(item) {
        var me = this,
            items = me.getItems(),
            index;

        if (!items.has(item)) {
            index = items.length;
            items.add(item);

            if (item.isInnerItem()) {
                me.insertInner(item);
            }

            item.setParent(me);

            me.onItemAdd(item, index);
        }
    },

    /**
     * Removes an item from this Container, optionally destroying it.
     * @param {Object} item The item to remove.
     * @param {Boolean} destroy Calls the Component's {@link Ext.Component#destroy destroy} method if `true`.
     * @return {Ext.Component} this
     */
    remove: function(item, destroy) {
        var me = this,
            index = me.indexOf(item),
            innerItems = me.getInnerItems();

        if (destroy === undefined) {
            destroy = me.getAutoDestroy();
        }

        if (index !== -1) {
            if (!me.removingAll && innerItems.length > 1 && item === me.getActiveItem()) {
                me.on({
                    activeitemchange: 'doRemove',
                    scope: me,
                    single: true,
                    order: 'after',
                    args: [item, index, destroy]
                });

                me.doResetActiveItem(innerItems.indexOf(item));
            }
            else {
                me.doRemove(item, index, destroy);
                if (innerItems.length === 0) {
                    me.setActiveItem(null);
                }
            }
        }

        return me;
    },

    doResetActiveItem: function(innerIndex) {
        if (innerIndex === 0) {
            this.setActiveItem(1);
        }
        else {
            this.setActiveItem(0);
        }
    },

    doRemove: function(item, index, destroy) {
        var me = this;

        me.items.remove(item);

        if (item.isInnerItem()) {
            me.removeInner(item);
        }

        me.onItemRemove(item, index, destroy);

        item.setParent(null);

        if (destroy) {
            item.destroy();
        }
    },

    /**
     * Removes all items currently in the Container, optionally destroying them all.
     * @param {Boolean} destroy If `true`, {@link Ext.Component#destroy destroys} each removed Component.
     * @param {Boolean} everything If `true`, completely remove all items including docked / centered and floating items.
     * @return {Ext.Component} this
     */
    removeAll: function(destroy, everything) {
        var items = this.items,
            ln = items.length,
            i = 0,
            item;

        if (destroy === undefined) {
            destroy = this.getAutoDestroy();
        }

        everything = Boolean(everything);

        // removingAll flag is used so we don't unnecessarily change activeItem while removing all items.
        this.removingAll = true;

        for (; i < ln; i++) {
            item = items.getAt(i);

            if (item && (everything || item.isInnerItem())) {
                this.doRemove(item, i, destroy);

                i--;
                ln--;
            }
        }
        this.setActiveItem(null);

        this.removingAll = false;

        return this;
    },

    /**
     * Returns the Component for a given index in the Container's {@link #property-items}.
     * @param {Number} index The index of the Component to return.
     * @return {Ext.Component} The item at the specified `index`, if found.
     */
    getAt: function(index) {
        return this.items.getAt(index);
    },

    getInnerAt: function(index) {
        return this.innerItems[index];
    },

    /**
     * Removes the Component at the specified index:
     *
     *     myContainer.removeAt(0); // removes the first item
     *
     * @param {Number} index The index of the Component to remove.
     */
    removeAt: function(index) {
        var item = this.getAt(index);

        if (item) {
            this.remove(item);
        }

        return this;
    },

    /**
     * Removes an inner Component at the specified index:
     *
     *     myContainer.removeInnerAt(0); // removes the first item of the innerItems property
     *
     * @param {Number} index The index of the Component to remove.
     */
    removeInnerAt: function(index) {
        var item = this.getInnerItems()[index];

        if (item) {
            this.remove(item);
        }

        return this;
    },

    /**
     * @private
     */
    has: function(item) {
        return this.getItems().indexOf(item) != -1;
    },

    /**
     * @private
     */
    hasInnerItem: function(item) {
        return this.innerItems.indexOf(item) != -1;
    },

    /**
     * @private
     */
    indexOf: function(item) {
        return this.getItems().indexOf(item);
    },

    innerIndexOf: function(item) {
        return this.innerItems.indexOf(item);
    },

    /**
     * @private
     * @param item
     * @param index
     */
    insertInner: function(item, index) {
        var items = this.getItems().items,
            innerItems = this.innerItems,
            currentInnerIndex = innerItems.indexOf(item),
            newInnerIndex = -1,
            nextSibling;

        if (currentInnerIndex !== -1) {
            innerItems.splice(currentInnerIndex, 1);
        }

        if (typeof index == 'number') {
            do {
                nextSibling = items[++index];
            } while (nextSibling && !nextSibling.isInnerItem());

            if (nextSibling) {
                newInnerIndex = innerItems.indexOf(nextSibling);
                innerItems.splice(newInnerIndex, 0, item);
            }
        }

        if (newInnerIndex === -1) {
            innerItems.push(item);
            newInnerIndex = innerItems.length - 1;
        }

        if (currentInnerIndex !== -1) {
            this.onInnerItemMove(item, newInnerIndex, currentInnerIndex);
        }

        return this;
    },

    onInnerItemMove: Ext.emptyFn,

    /**
     * @private
     * @param item
     */
    removeInner: function(item) {
        Ext.Array.remove(this.innerItems, item);

        return this;
    },

    /**
     * Adds a child Component at the given index. For example, here's how we can add a new item, making it the first
     * child Component of this Container:
     *
     *     myContainer.insert(0, {xtype: 'panel', html: 'new item'});
     *
     * @param {Number} index The index to insert the Component at.
     * @param {Object} item The Component to insert.
     */
    insert: function(index, item) {
        var me = this,
            i;

        if (Ext.isArray(item)) {
            for (i = item.length - 1; i >= 0; i--) {
                me.insert(index, item[i]);
            }

            return me;
        }

        item = this.factoryItem(item);

        this.doInsert(index, item);

        return item;
    },

    /**
     * @private
     * @param index
     * @param item
     */
    doInsert: function(index, item) {
        var me = this,
            items = me.items,
            itemsLength = items.length,
            currentIndex, isInnerItem;

        isInnerItem = item.isInnerItem();

        if (index > itemsLength) {
            index = itemsLength;
        }

        if (items[index - 1] === item) {
            return me;
        }

        currentIndex = me.indexOf(item);

        if (currentIndex !== -1) {
            if (currentIndex < index) {
                index -= 1;
            }

            items.removeAt(currentIndex);
        }
        else {
            item.setParent(me);
        }

        items.insert(index, item);

        if (isInnerItem) {
            me.insertInner(item, index);
        }

        if (currentIndex !== -1) {
            me.onItemMove(item, index, currentIndex);
        }
        else {
            me.onItemAdd(item, index);
        }
    },

    /**
     * @private
     */
    insertFirst: function(item) {
        return this.insert(0, item);
    },

    /**
     * @private
     */
    insertLast: function(item) {
        return this.insert(this.getItems().length, item);
    },

    /**
     * @private
     */
    insertBefore: function(item, relativeToItem) {
        var index = this.indexOf(relativeToItem);

        if (index !== -1) {
            this.insert(index, item);
        }
        return this;
    },

    /**
     * @private
     */
    insertAfter: function(item, relativeToItem) {
        var index = this.indexOf(relativeToItem);

        if (index !== -1) {
            this.insert(index + 1, item);
        }
        return this;
    },

    /**
     * @private
     */
    onItemAdd: function(item, index) {
        this.doItemLayoutAdd(item, index);

        if (this.initialized) {
            this.fireEvent('add', this, item, index);
        }
    },

    doItemLayoutAdd: function(item, index) {
        var layout = this.getLayout();

        if (this.isRendered() && item.setRendered(true)) {
            item.fireAction('renderedchange', [this, item, true], 'onItemAdd', layout, { args: [item, index] });
        }
        else {
            layout.onItemAdd(item, index);
        }
    },

    /**
     * @private
     */
    onItemRemove: function(item, index) {
        this.doItemLayoutRemove(item, index);

        this.fireEvent('remove', this, item, index);
    },

    doItemLayoutRemove: function(item, index) {
        var layout = this.getLayout();

        if (this.isRendered() && item.setRendered(false)) {
            item.fireAction('renderedchange', [this, item, false], 'onItemRemove', layout, { args: [item, index, undefined] });
        }
        else {
            layout.onItemRemove(item, index);
        }
    },

    /**
     * @private
     */
    onItemMove: function(item, toIndex, fromIndex) {
        if (item.isDocked()) {
            item.setDocked(null);
        }

        this.doItemLayoutMove(item, toIndex, fromIndex);

        this.fireEvent('move', this, item, toIndex, fromIndex);
    },

    doItemLayoutMove: function(item, toIndex, fromIndex) {
        this.getLayout().onItemMove(item, toIndex, fromIndex);
    },

    onItemInnerStateChange: function(item, isInner) {
        var layout = this.getLayout();

        if (isInner) {
            this.insertInner(item, this.items.indexOf(item));
        }
        else {
            this.removeInner(item);
        }

        layout.onItemInnerStateChange.apply(layout, arguments);
    },

    /**
     * Returns all inner {@link #property-items} of this container. `inner` means that the item is not `docked` or
     * `floating`.
     * @return {Array} The inner items of this container.
     */
    getInnerItems: function() {
        return this.innerItems;
    },

    /**
     * Returns all the {@link Ext.Component#docked} items in this container.
     * @return {Array} The docked items of this container.
     */
    getDockedItems: function() {
        var items = this.getItems().items,
            dockedItems = [],
            ln = items.length,
            item, i;

        for (i = 0; i < ln; i++) {
            item = items[i];
            if (item.isDocked()) {
                dockedItems.push(item);
            }
        }

        return dockedItems;
    },

    /**
     * @private
     */
    applyActiveItem: function(activeItem, currentActiveItem) {
        var innerItems = this.getInnerItems();

        // Make sure the items are already initialized
        this.getItems();

        // No items left to be active, reset back to 0 on falsy changes
        if (!activeItem && innerItems.length === 0) {
            return 0;
        }
        else if (typeof activeItem == 'number') {
            activeItem = Math.max(0, Math.min(activeItem, innerItems.length - 1));
            activeItem = innerItems[activeItem];

            if (activeItem) {
                return activeItem;
            }
            else if (currentActiveItem) {
                return null;
            }
        }
        else if (activeItem) {
            var item;

            //ComponentQuery selector?
            if (typeof activeItem == 'string') {
                item = this.child(activeItem);

                activeItem = {
                    xtype : activeItem
                };
            }

            if (!item || !item.isComponent) {
                item = this.factoryItem(activeItem);
            }
            this.pendingActiveItem = item;

            //<debug error>
            if (!item.isInnerItem()) {
                Ext.Logger.error("Setting activeItem to be a non-inner item");
            }
            //</debug>

            if (!this.has(item)) {
                this.add(item);
            }

            return item;
        }
    },

    /**
     * Animates to the supplied `activeItem` with a specified animation. Currently this only works
     * with a Card layout.  This passed animation will override any default animations on the
     * container, for a single card switch. The animation will be destroyed when complete.
     * @param {Object/Number} activeItem The item or item index to make active.
     * @param {Object/Ext.fx.layout.Card} animation Card animation configuration or instance.
     */
    animateActiveItem: function(activeItem, animation) {
        var layout = this.getLayout(),
            defaultAnimation;

        if (this.activeItemAnimation) {
            this.activeItemAnimation.destroy();
        }
        this.activeItemAnimation = animation = new Ext.fx.layout.Card(animation);
        if (animation && layout.isCard) {
            animation.setLayout(layout);
            defaultAnimation = layout.getAnimation();
            if (defaultAnimation) {
                defaultAnimation.disable();
                animation.on('animationend', function() {
                    defaultAnimation.enable();
                    animation.destroy();
                }, this);
            }
        }
        return this.setActiveItem(activeItem);
    },

    /**
     * @private
     */
    doSetActiveItem: function(newActiveItem, oldActiveItem) {
        delete this.pendingActiveItem;
        if (oldActiveItem) {
            oldActiveItem.fireEvent('deactivate', oldActiveItem, this, newActiveItem);
        }

        if (newActiveItem) {
            newActiveItem.fireEvent('activate', newActiveItem, this, oldActiveItem);
        }
    },

    doSetHidden: function(hidden) {
        var modal = this.getModal();

        if (modal) {
            modal.setHidden(hidden);
        }

        this.callSuper(arguments);
    },

    /**
     * @private
     */
    setRendered: function(rendered) {
        if (this.callParent(arguments)) {
            var items = this.items.items,
                i, ln;

            for (i = 0,ln = items.length; i < ln; i++) {
                items[i].setRendered(rendered);
            }

            return true;
        }

        return false;
    },

    /**
     * @private
     */
    getScrollableBehavior: function() {
        var behavior = this.scrollableBehavior;

        if (!behavior) {
            behavior = this.scrollableBehavior = new Ext.behavior.Scrollable(this);
        }

        return behavior;
    },

    /**
     * @private
     */
    applyScrollable: function(config) {
        if (config && !config.isObservable) {
            this.getScrollableBehavior().setConfig(config);
        }
        return config;
    },

    doSetScrollable: function() {
        // Used for plugins when they need to reinitialize scroller listeners
    },

    /**
     * Returns an the scrollable instance for this container, which is a {@link Ext.scroll.View} class.
     *
     * Please checkout the documentation for {@link Ext.scroll.View}, {@link Ext.scroll.View#getScroller}
     * and {@link Ext.scroll.Scroller} for more information.
     * @return {Ext.scroll.View} The scroll view.
     */
    getScrollable: function() {
        return this.getScrollableBehavior().getScrollView();
    },

    // Used by ComponentQuery to retrieve all of the items
    // which can potentially be considered a child of this Container.
    // This should be overridden by components which have child items
    // that are not contained in items. For example `dockedItems`, `menu`, etc
    // @private
    getRefItems: function(deep) {
        var items = this.getItems().items.slice(),
            ln = items.length,
            i, item;

        if (deep) {
            for (i = 0; i < ln; i++) {
                item = items[i];

                if (item.getRefItems) {
                    items = items.concat(item.getRefItems(true));
                }
            }
        }

        return items;
    },

    /**
     * Examines this container's `{@link #property-items}` property
     * and gets a direct child component of this container.
     * @param {String/Number} component This parameter may be any of the following:
     *
     * - {String} : representing the `itemId`
     * or `{@link Ext.Component#getId id}` of the child component.
     * - {Number} : representing the position of the child component
     * within the `{@link #property-items}` property.
     *
     * For additional information see {@link Ext.util.MixedCollection#get}.
     * @return {Ext.Component} The component (if found).
     */
    getComponent: function(component) {
        if (Ext.isObject(component)) {
            component = component.getItemId();
        }

        return this.getItems().get(component);
    },

    /**
     * Finds a docked item of this container using a reference, `id `or an `index` of its location
     * in {@link #getDockedItems}.
     * @param {String/Number} component The `id` or `index` of the component to find.
     * @return {Ext.Component/Boolean} The docked component, if found.
     */
    getDockedComponent: function(component) {
        if (Ext.isObject(component)) {
            component = component.getItemId();
        }

        var dockedItems = this.getDockedItems(),
            ln = dockedItems.length,
            item, i;

        if (Ext.isNumber(component)) {
            return dockedItems[component];
        }

        for (i = 0; i < ln; i++) {
            item = dockedItems[i];
            if (item.id == component) {
                return item;
            }
        }

        return false;
    },

    /**
     * Retrieves all descendant components which match the passed selector.
     * Executes an Ext.ComponentQuery.query using this container as its root.
     * @param {String} selector Selector complying to an Ext.ComponentQuery selector.
     * @return {Array} Ext.Component's which matched the selector.
     */
    query: function(selector) {
        return Ext.ComponentQuery.query(selector, this);
    },

    /**
     * Retrieves the first direct child of this container which matches the passed selector.
     * The passed in selector must comply with an {@link Ext.ComponentQuery} selector.
     * @param {String} selector An {@link Ext.ComponentQuery} selector.
     * @return {Ext.Component}
     */
    child: function(selector) {
        return this.query('> ' + selector)[0] || null;
    },

    /**
     * Retrieves the first descendant of this container which matches the passed selector.
     * The passed in selector must comply with an {@link Ext.ComponentQuery} selector.
     * @param {String} selector An {@link Ext.ComponentQuery} selector.
     * @return {Ext.Component}
     */
    down: function(selector) {
        return this.query(selector)[0] || null;
    },


    //<deprecated product=touch since=2.0>
    onClassExtended: function(Class, members) {
        if ('onAdd' in members || 'onRemove' in members) {
            throw new Error("["+Class.$className+"] 'onAdd()' and 'onRemove()' methods " +
                            "no longer exist in Ext.Container, please use 'onItemAdd()' " +
                            "and 'onItemRemove()' instead }");
        }
    },
    //</deprecated>

    destroy: function() {
        var me = this,
            modal = me.getModal();

        if (modal) {
            modal.destroy();
        }

        me.removeAll(true, true);
        me.unlink('_scrollable');
        Ext.destroy(me.items);

        me.callSuper();
    }

}, function() {
    this.addMember('defaultItemClass', this);

    //<deprecated product=touch since=2.0>
    /**
     * @method addAll
     * Adds an array of Components to this Container.
     * @deprecated 2.0.0 Please use {@link #method-add} instead.
     * @param {Array} items The array of items to add to this container.
     * @return {Array} The array of items after they have been added.
     */
    Ext.deprecateClassMethod(this, 'addAll', 'add');

    /**
     * @method removeDocked
     * Removes a docked item from this Container.
     * @deprecated 2.0.0 Please use {@link #method-remove} instead.
     * @param {Object} item The item to remove.
     * @param {Boolean} destroy Calls the Component's {@link Ext.Component#destroy destroy} method if `true`.
     * @return {Ext.Component} this
     */
    Ext.deprecateClassMethod(this, 'removeDocked', 'remove');

    /**
     * @member Ext.Container
     * @property items
     * @type Ext.util.MixedCollection
     * The set of all items in this Container.
     * @deprecated 2.0.0 Please use {@link #getItems} method instead.
     */
    this.override({
        constructor: function(config) {
            config = config || {};

            var dockedItems = config.dockedItems,
                i, ln, item;

            /**
             * @cfg {Boolean/String/Object} scroll
             * @inheritdoc Ext.Container#scrollable
             * @deprecated 2.0.0 Please use the {@link #scrollable} configuration.
             */
            if (config.scroll) {
                //<debug warn>
                Ext.Logger.deprecate("'scroll' config is deprecated, please use 'scrollable' instead.", this);
                //</debug>

                config.scrollable = config.scroll;
                delete config.scroll;
            }

            this.callOverridden(arguments);

            if (dockedItems) {
                //<debug warn>
                Ext.Logger.deprecate("'dockedItems' config is deprecated, please add all docked items inside the 'items' config with a 'docked' property indicating the docking position instead, i.e { /*...*/ docked: 'top' /*...*/ }");
                //</debug>

                dockedItems = Ext.Array.from(dockedItems);

                for (i = 0,ln = dockedItems.length; i < ln; i++) {
                    item = dockedItems[i];
                    if ('dock' in item) {
                        //<debug warn>
                        Ext.Logger.deprecate("'dock' config for docked items is deprecated, please use 'docked' instead");
                        //</debug>
                        item.docked = item.dock;
                    }
                }

                this.add(dockedItems);
            }
        },

        add: function() {
            var args = arguments;

            if (args.length > 1) {
                if (typeof args[0] == 'number') {
                    //<debug warn>
                    Ext.Logger.deprecate("add(index, item) method signature is deprecated, please use insert(index, item) instead");
                    //</debug>
                    return this.insert(args[0], args[1]);
                }
                //<debug warn>
                Ext.Logger.deprecate("Passing items as multiple arguments is deprecated, please use one single array of items instead");
                //</debug>
                args = [Array.prototype.slice.call(args)];
            }

            return this.callOverridden(args);
        },

        doAdd: function(item) {
            var docked = item.getDocked(),
                overlay = item.overlay,
                position;

            if (overlay && docked) {
                //<debug>
                Ext.Logger.deprecate("'overlay' config is deprecated on docked items, please set the top/left/right/bottom configurations instead.", this);
                //</debug>

                if (docked == "top") {
                    position = {
                        top: 0,
                        bottom: 'auto',
                        left: 0,
                        right: 0
                    };
                } else if (docked == "bottom") {
                    position = {
                        top: null,
                        bottom: 0,
                        left: 0,
                        right: 0
                    };
                }

                if (position) {
                    item.setDocked(false);

                    item.setTop(position.top);
                    item.setBottom(position.bottom);
                    item.setLeft(position.left);
                    item.setRight(position.right);
                }
            }

            return this.callOverridden(arguments);
        },

        applyDefaults: function(defaults) {
            if (typeof defaults == 'function') {
                //<debug warn>
                Ext.Logger.deprecate("Passing a function as 'defaults' is deprecated. To add custom logics when " +
                    "'defaults' is applied to each item, have your own factoryItem() method in your sub-class instead");
                //</debug>
            }

            return this.callOverridden(arguments);
        },

        factoryItemWithDefaults: function(item) {
            var defaults = this.getDefaults(),
            customDefaults, ret;

            // Defaults is a function (must return a string, object, or class instance)
            if (typeof defaults == 'function') {
                customDefaults = defaults.call(this, item);
            }

            // String (must be the id of an existent component)
            if (typeof item == 'string') {
                //<debug warn>
                Ext.Logger.deprecate("Passing a string id of item ('"+item+"') is deprecated, please pass a reference to that item instead");
                //</debug>

                item = Ext.getCmp(item);
            }

            if (customDefaults) {
                this._defaults = customDefaults;
            }

            ret = this.callParent([item]);

            if (customDefaults) {
                this._defaults = defaults;
            }

            return ret;
        },

        applyMasked: function(masked) {
            if (Ext.isObject(masked) && !masked.isInstance && 'message' in masked && !('xtype' in masked) && !('xclass' in masked)) {
                masked.xtype = 'loadmask';

                //<debug warn>
                Ext.Logger.deprecate("Using a 'message' config without specify an 'xtype' or 'xclass' will no longer implicitly set 'xtype' to 'loadmask'. Please set that explicitly.");
                //</debug>
            }

            return this.callOverridden(arguments);
        }
    });

    Ext.deprecateClassMethod(this, 'setMask', 'setMasked');
    //</deprecated>
});


