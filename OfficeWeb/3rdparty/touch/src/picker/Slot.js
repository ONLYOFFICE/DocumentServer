/**
 * @private
 *
 * A general {@link Ext.picker.Picker} slot class.  Slots are used to organize multiple scrollable slots into
 * a single {@link Ext.picker.Picker}.
 *
 *     {
 *         name : 'limit_speed',
 *         title: 'Speed Limit',
 *         data : [
 *             {text: '50 KB/s', value: 50},
 *             {text: '100 KB/s', value: 100},
 *             {text: '200 KB/s', value: 200},
 *             {text: '300 KB/s', value: 300}
 *         ]
 *     }
 *
 * See the {@link Ext.picker.Picker} documentation on how to use slots.
 */
Ext.define('Ext.picker.Slot', {
    extend: 'Ext.dataview.DataView',
    xtype : 'pickerslot',
    alternateClassName: 'Ext.Picker.Slot',
    requires: [
        'Ext.XTemplate',
        'Ext.data.Store',
        'Ext.Component',
        'Ext.data.StoreManager'
    ],

    /**
     * @event slotpick
     * Fires whenever an slot is picked
     * @param {Ext.picker.Slot} this
     * @param {Mixed} value The value of the pick
     * @param {HTMLElement} node The node element of the pick
     */

    isSlot: true,

    config: {
        /**
         * @cfg {String} title The title to use for this slot, or `null` for no title.
         * @accessor
         */
        title: null,

        /**
         * @private
         * @cfg {Boolean} showTitle
         * @accessor
         */
        showTitle: true,

        /**
         * @private
         * @cfg {String} cls The main component class
         * @accessor
         */
        cls: Ext.baseCSSPrefix + 'picker-slot',

        /**
         * @cfg {String} name (required) The name of this slot.
         * @accessor
         */
        name: null,

        /**
         * @cfg {Number} value The value of this slot
         * @accessor
         */
        value: null,

        /**
         * @cfg {Number} flex
         * @accessor
         * @private
         */
        flex: 1,

        /**
         * @cfg {String} align The horizontal alignment of the slot's contents.
         *
         * Valid values are: "left", "center", and "right".
         * @accessor
         */
        align: 'left',

        /**
         * @cfg {String} displayField The display field in the store.
         * @accessor
         */
        displayField: 'text',

        /**
         * @cfg {String} valueField The value field in the store.
         * @accessor
         */
        valueField: 'value',

        /**
         * @cfg {Object} scrollable
         * @accessor
         * @hide
         */
        scrollable: {
            direction: 'vertical',
            indicators: false,
            momentumEasing: {
                minVelocity: 2
            },
            slotSnapEasing: {
                duration: 100
            }
        }
    },

    constructor: function() {
        /**
         * @property selectedIndex
         * @type Number
         * The current `selectedIndex` of the picker slot.
         * @private
         */
        this.selectedIndex = 0;

        /**
         * @property picker
         * @type Ext.picker.Picker
         * A reference to the owner Picker.
         * @private
         */

        this.callParent(arguments);
    },

    /**
     * Sets the title for this dataview by creating element.
     * @param {String} title
     * @return {String}
     */
    applyTitle: function(title) {
        //check if the title isnt defined
        if (title) {
            //create a new title element
            title = Ext.create('Ext.Component', {
                cls: Ext.baseCSSPrefix + 'picker-slot-title',
                docked      : 'top',
                html        : title
            });
        }

        return title;
    },

    updateTitle: function(newTitle, oldTitle) {
        if (newTitle) {
            this.add(newTitle);
            this.setupBar();
        }

        if (oldTitle) {
            this.remove(oldTitle);
        }
    },

    updateShowTitle: function(showTitle) {
        var title = this.getTitle();
        if (title) {
            title[showTitle ? 'show' : 'hide']();

            this.setupBar();
        }
    },

    updateDisplayField: function(newDisplayField) {
        this.setItemTpl('<div class="' + Ext.baseCSSPrefix + 'picker-item {cls} <tpl if="extra">' + Ext.baseCSSPrefix + 'picker-invalid</tpl>">{' + newDisplayField + '}</div>');
    },

    /**
     * Updates the {@link #align} configuration
     */
    updateAlign: function(newAlign, oldAlign) {
        var element = this.element;
        element.addCls(Ext.baseCSSPrefix + 'picker-' + newAlign);
        element.removeCls(Ext.baseCSSPrefix + 'picker-' + oldAlign);
    },

    /**
     * Looks at the {@link #data} configuration and turns it into {@link #store}.
     * @param {Object} data
     * @return {Object}
     */
    applyData: function(data) {
        var parsedData = [],
            ln = data && data.length,
            i, item, obj;

        if (data && Ext.isArray(data) && ln) {
            for (i = 0; i < ln; i++) {
                item = data[i];
                obj = {};
                if (Ext.isArray(item)) {
                    obj[this.valueField] = item[0];
                    obj[this.displayField] = item[1];
                }
                else if (Ext.isString(item)) {
                    obj[this.valueField] = item;
                    obj[this.displayField] = item;
                }
                else if (Ext.isObject(item)) {
                    obj = item;
                }
                parsedData.push(obj);
            }
        }

        return data;
    },

    updateData: function(data) {
        this.setStore(Ext.create('Ext.data.Store', {
            fields: ['text', 'value'],
            data : data
        }));
    },

    // @private
    initialize: function() {
        this.callParent();

        var scroller = this.getScrollable().getScroller();

        this.on({
            scope: this,
            painted: 'onPainted',
            itemtap: 'doItemTap'
        });

        scroller.on({
            scope: this,
            scrollend: 'onScrollEnd'
        });
    },

    // @private
    onPainted: function() {
        this.setupBar();
    },

    /**
     * Returns an instance of the owner picker.
     * @return {Object}
     * @private
     */
    getPicker: function() {
        if (!this.picker) {
            this.picker = this.getParent();
        }

        return this.picker;
    },

    // @private
    setupBar: function() {
        if (!this.rendered) {
            //if the component isnt rendered yet, there is no point in calculating the padding just eyt
            return;
        }

        var element = this.element,
            innerElement = this.innerElement,
            picker = this.getPicker(),
            bar = picker.bar,
            value = this.getValue(),
            showTitle = this.getShowTitle(),
            title = this.getTitle(),
            scrollable = this.getScrollable(),
            scroller = scrollable.getScroller(),
            titleHeight = 0,
            barHeight, padding;

        barHeight = bar.getHeight();

        if (showTitle && title) {
            titleHeight = title.element.getHeight();
        }

        padding = Math.ceil((element.getHeight() - titleHeight - barHeight) / 2);

        innerElement.setStyle({
            padding: padding + 'px 0 ' + (padding) + 'px'
        });

        scroller.refresh();
        scroller.setSlotSnapSize(barHeight);

        this.setValue(value);
    },

    // @private
    doItemTap: function(list, index, item, e) {
        var me = this;
        me.selectedIndex = index;
        me.selectedNode = item;
        me.scrollToItem(item, true);
    },

    // @private
    scrollToItem: function(item, animated) {
        var y = item.getY(),
            parentEl = item.parent(),
            parentY = parentEl.getY(),
            scrollView = this.getScrollable(),
            scroller = scrollView.getScroller(),
            difference;

        difference = y - parentY;

        scroller.scrollTo(0, difference, animated);
    },

    // @private
    onScrollEnd: function(scroller, x, y) {
        var me = this,
            index = Math.round(y / me.picker.bar.getHeight()),
            viewItems = me.getViewItems(),
            item = viewItems[index];

        if (item) {
            me.selectedIndex = index;
            me.selectedNode = item;

            me.fireEvent('slotpick', me, me.getValue(), me.selectedNode);
        }
    },

    /**
     * Returns the value of this slot
     * @private
     */
    getValue: function(useDom) {
        var store = this.getStore(),
            record, value;

        if (!store) {
            return;
        }

        if (!this.rendered || !useDom) {
            return this._value;
        }

        //if the value is ever false, that means we do not want to return anything
        if (this._value === false) {
            return null;
        }

        record = store.getAt(this.selectedIndex);

        value = record ? record.get(this.getValueField()) : null;
//        this._value = value;

        return value;
    },

    /**
     * Sets the value of this slot
     * @private
     */
    setValue: function(value) {
        if (!Ext.isDefined(value)) {
            return;
        }

        if (!this.rendered) {
            //we don't want to call this until the slot has been rendered
            this._value = value;
            return;
        }

        var store = this.getStore(),
            viewItems = this.getViewItems(),
            valueField = this.getValueField(),
            index, item;

        index = store.findExact(valueField, value);
        if (index != -1) {
            item = Ext.get(viewItems[index]);

            this.selectedIndex = index;
            if (item) {
                this.scrollToItem(item);
            }

            this._value = value;
        }
    },

    /**
     * Sets the value of this slot
     * @private
     */
    setValueAnimated: function(value) {
        if (!this.rendered) {
            //we don't want to call this until the slot has been rendered
            this._value = value;
            return;
        }

        var store = this.getStore(),
            viewItems = this.getViewItems(),
            valueField = this.getValueField(),
            index, item;

        index = store.find(valueField, value);
        if (index != -1) {
            item = Ext.get(viewItems[index]);
            this.selectedIndex = index;

            if (item) {
                this.scrollToItem(item, {
                    duration: 100
                });
            }

            this._value = value;
        }
    }
});
