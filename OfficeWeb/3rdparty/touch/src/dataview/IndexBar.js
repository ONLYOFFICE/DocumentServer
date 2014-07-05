/**
 * @aside video list
 * @aside guide list
 *
 * IndexBar is a component used to display a list of data (primarily an alphabet) which can then be used to quickly
 * navigate through a list (see {@link Ext.List}) of data. When a user taps on an item in the {@link Ext.IndexBar},
 * it will fire the {@link #index} event.
 *
 * Here is an example of the usage in a {@link Ext.List}:
 *
 *     @example phone portrait preview
 *     Ext.define('Contact', {
 *         extend: 'Ext.data.Model',
 *         config: {
 *             fields: ['firstName', 'lastName']
 *         }
 *     });
 *
 *     var store = new Ext.data.JsonStore({
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
 *            {firstName: 'Tommy',   lastName: 'Maintz'},
 *            {firstName: 'Rob',     lastName: 'Dougan'},
 *            {firstName: 'Ed',      lastName: 'Spencer'},
 *            {firstName: 'Jamie',   lastName: 'Avins'},
 *            {firstName: 'Aaron',   lastName: 'Conran'},
 *            {firstName: 'Dave',    lastName: 'Kaneda'},
 *            {firstName: 'Jacky',   lastName: 'Nguyen'},
 *            {firstName: 'Abraham', lastName: 'Elias'},
 *            {firstName: 'Jay',     lastName: 'Robinson'},
 *            {firstName: 'Nigel',   lastName: 'White'},
 *            {firstName: 'Don',     lastName: 'Griffin'},
 *            {firstName: 'Nico',    lastName: 'Ferrero'},
 *            {firstName: 'Jason',   lastName: 'Johnston'}
 *        ]
 *     });
 *
 *     var list = new Ext.List({
 *        fullscreen: true,
 *        itemTpl: '<div class="contact">{firstName} <strong>{lastName}</strong></div>',
 *
 *        grouped     : true,
 *        indexBar    : true,
 *        store: store,
 *        hideOnMaskTap: false
 *     });
 *
*/
Ext.define('Ext.dataview.IndexBar', {
    extend: 'Ext.Component',
    alternateClassName: 'Ext.IndexBar',

    /**
     * @event index
     * Fires when an item in the index bar display has been tapped.
     * @param {Ext.dataview.IndexBar} this The IndexBar instance
     * @param {String} html The HTML inside the tapped node.
     * @param {Ext.dom.Element} target The node on the indexbar that has been tapped.
     */

    config: {
        baseCls: Ext.baseCSSPrefix + 'indexbar',

        /**
         * @cfg {String} direction
         * Layout direction, can be either 'vertical' or 'horizontal'
         * @accessor
         */
        direction: 'vertical',

        /**
         * @cfg {Array} letters
         * The letters to show on the index bar.
         * @accessor
         */
        letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],

        ui: 'alphabet',

        /**
         * @cfg {String} listPrefix
         * The prefix string to be used at the beginning of the list.
         * E.g: useful to add a "#" prefix before numbers.
         * @accessor
         */
        listPrefix: null
    },

    // @private
    itemCls: Ext.baseCSSPrefix + '',

    updateDirection: function(newDirection, oldDirection) {
        var baseCls = this.getBaseCls();

        this.element.replaceCls(baseCls + '-' + oldDirection, baseCls + '-' + newDirection);
    },

    getElementConfig: function() {
        return {
            reference: 'wrapper',
            classList: ['x-centered', 'x-indexbar-wrapper'],
            children: [this.callParent()]
        };
    },

    updateLetters: function(letters) {
        this.innerElement.setHtml('');

        if (letters) {
            var ln = letters.length,
                i;

            for (i = 0; i < ln; i++) {
                this.innerElement.createChild({
                    html: letters[i]
                });
            }
        }
    },

    updateListPrefix: function(listPrefix) {
        if (listPrefix && listPrefix.length) {
            this.innerElement.createChild({
                html: listPrefix
            }, 0);
        }
    },

    // @private
    initialize: function() {
        this.callParent();

        this.innerElement.on({
            touchstart: this.onTouchStart,
            touchend: this.onTouchEnd,
            touchmove: this.onTouchMove,
            scope: this
        });
    },

    // @private
    onTouchStart: function(e, t) {
        e.stopPropagation();
        this.innerElement.addCls(this.getBaseCls() + '-pressed');
        this.pageBox = this.innerElement.getPageBox();
        this.onTouchMove(e);
    },

    // @private
    onTouchEnd: function(e, t) {
        this.innerElement.removeCls(this.getBaseCls() + '-pressed');
    },

    // @private
    onTouchMove: function(e) {
        var point = Ext.util.Point.fromEvent(e),
            target,
            pageBox = this.pageBox;

        if (!pageBox) {
            pageBox = this.pageBox = this.el.getPageBox();
        }

        if (this.getDirection() === 'vertical') {
            if (point.y > pageBox.bottom || point.y < pageBox.top) {
                return;
            }
            target = Ext.Element.fromPoint(pageBox.left + (pageBox.width / 2), point.y);
        }
        else {
            if (point.x > pageBox.right || point.x < pageBox.left) {
                return;
            }
            target = Ext.Element.fromPoint(point.x, pageBox.top + (pageBox.height / 2));
        }

        if (target) {
            this.fireEvent('index', this, target.dom.innerHTML, target);
        }
    },

    destroy: function() {
        var me = this,
            elements = Array.prototype.slice.call(me.innerElement.dom.childNodes),
            ln = elements.length,
            i = 0;

        for (; i < ln; i++) {
            Ext.removeNode(elements[i]);
        }
        this.callParent();
    }

}, function() {
    //<deprecated product=touch since=2.0>

    /**
     * @member Ext.dataview.IndexBar
     * @method isHorizontal
     * Returns `true` when direction is horizontal.
     * @removed 2.0.0
     */
    Ext.deprecateMethod(this, 'isHorizontal', null, "Ext.dataview.IndexBar.isHorizontal() has been removed");

    /**
     * @member Ext.dataview.IndexBar
     * @method isVertical
     * Returns `true` when direction is vertical.
     * @removed 2.0.0
     */
    Ext.deprecateMethod(this, 'isVertical', null, "Ext.dataview.IndexBar.isVertical() has been removed");

    /**
     * @member Ext.dataview.IndexBar
     * @method refresh
     * Refreshes the view by reloading the data from the store and re-rendering the template.
     * @removed 2.0.0
     */
    Ext.deprecateMethod(this, 'refresh', null, "Ext.dataview.IndexBar.refresh() has been removed");

    /**
     * @member Ext.dataview.IndexBar
     * @cfg {Boolean} alphabet
     * `true` to use the letters property to show a list of the alphabet.
     * @removed 2.0.0
     */
    Ext.deprecateProperty(this, 'alphabet', null, "Ext.dataview.IndexBar.alphabet has been removed");

    /**
     * @member Ext.dataview.IndexBar
     * @cfg {Boolean} itemSelector
     * A simple CSS selector for items.
     * @removed 2.0.0
     */
    Ext.deprecateProperty(this, 'itemSelector', null, "Ext.dataview.IndexBar.itemSelector has been removed");

    /**
     * @member Ext.dataview.IndexBar
     * @cfg {Boolean} store
     * The store to be used for displaying data on the index bar.
     * @removed 2.0.0
     */
    Ext.deprecateProperty(this, 'store', null, "Ext.dataview.IndexBar.store has been removed");

    //</deprecated>
});
