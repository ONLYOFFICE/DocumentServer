/**
 * @aside guide layouts
 * @aside video layouts
 *
 * Sometimes you want to show several screens worth of information but you've only got a small screen to work with.
 * TabPanels and Carousels both enable you to see one screen of many at a time, and underneath they both use a Card
 * Layout.
 *
 * Card Layout takes the size of the Container it is applied to and sizes the currently active item to fill the
 * Container completely. It then hides the rest of the items, allowing you to change which one is currently visible but
 * only showing one at once:
 *
 * {@img ../guides/layouts/card.jpg}
 *
 *
 * Here the gray box is our Container, and the blue box inside it is the currently active card. The three other cards
 * are hidden from view, but can be swapped in later. While it's not too common to create Card layouts directly, you
 * can do so like this:
 *
 *     var panel = Ext.create('Ext.Panel', {
 *         layout: 'card',
 *         items: [
 *             {
 *                 html: "First Item"
 *             },
 *             {
 *                 html: "Second Item"
 *             },
 *             {
 *                 html: "Third Item"
 *             },
 *             {
 *                 html: "Fourth Item"
 *             }
 *         ]
 *     });
 *
 *     panel.{@link Ext.Container#setActiveItem setActiveItem}(1);
 *
 * Here we create a Panel with a Card Layout and later set the second item active (the active item index is zero-based,
 * so 1 corresponds to the second item). Normally you're better off using a {@link Ext.tab.Panel tab panel} or a
 * {@link Ext.carousel.Carousel carousel}.
 *
 * For a more detailed overview of what layouts are and the types of layouts shipped with Sencha Touch 2, check out the
 * [Layout Guide](#!/guide/layouts).
 */


Ext.define('Ext.layout.Card', {
    extend: 'Ext.layout.Default',

    alias: 'layout.card',

    isCard: true,

    /**
     * @event activeitemchange
     * @preventable doActiveItemChange
     * Fires when an card is made active
     * @param {Ext.layout.Card} this The layout instance
     * @param {Mixed} newActiveItem The new active item
     * @param {Mixed} oldActiveItem The old active item
     */
        
    layoutClass: 'x-layout-card',

    itemClass: 'x-layout-card-item',

    requires: [
        'Ext.fx.layout.Card'
    ],

    /**
     * @private
     */
    applyAnimation: function(animation) {
        return new Ext.fx.layout.Card(animation);
    },

    /**
     * @private
     */
    updateAnimation: function(animation, oldAnimation) {
        if (animation && animation.isAnimation) {
            animation.setLayout(this);
        }

        if (oldAnimation) {
            oldAnimation.destroy();
        }
    },

    setContainer: function(container) {
        this.callSuper(arguments);

        container.innerElement.addCls(this.layoutClass);
        container.onInitialized('onContainerInitialized', this);
    },

    onContainerInitialized: function() {
        var container = this.container,
            activeItem = container.getActiveItem();

        if (activeItem) {
            activeItem.show();
        }

        container.on('activeitemchange', 'onContainerActiveItemChange', this);
    },

    /**
     * @private
     */
    onContainerActiveItemChange: function(container) {
        this.relayEvent(arguments, 'doActiveItemChange');
    },

    onItemInnerStateChange: function(item, isInner, destroying) {
        this.callSuper(arguments);
        var container = this.container,
            activeItem = container.getActiveItem();

        item.toggleCls(this.itemClass, isInner);
        item.setLayoutSizeFlags(isInner ? container.LAYOUT_BOTH : 0);

        if (isInner) {
            if (activeItem !== container.innerIndexOf(item) && activeItem !== item && item !== container.pendingActiveItem) {
                item.hide();
            }
        }
        else {
            if (!destroying && !item.isDestroyed && item.isDestroying !== true) {
                item.show();
            }
        }
    },

    /**
     * @private
     */
    doActiveItemChange: function(me, newActiveItem, oldActiveItem) {
        if (oldActiveItem) {
            oldActiveItem.hide();
        }

        if (newActiveItem) {
            newActiveItem.show();
        }
    },

    destroy:  function () {
        this.callParent(arguments);
        Ext.destroy(this.getAnimation());
    }
});
