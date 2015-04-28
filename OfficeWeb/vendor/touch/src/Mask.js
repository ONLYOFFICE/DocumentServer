/**
 * A simple class used to mask any {@link Ext.Container}.
 *
 * This should rarely be used directly, instead look at the {@link Ext.Container#masked} configuration.
 *
 * ## Example
 *
 *     @example miniphone
 *     // Create our container
 *     var container = Ext.create('Ext.Container', {
 *         html: 'My container!'
 *     });
 *
 *     // Add the container to the Viewport
 *     Ext.Viewport.add(container);
 *
 *     // Mask the container
 *     container.setMasked(true);
 */
Ext.define('Ext.Mask', {
    extend: 'Ext.Component',
    xtype: 'mask',

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        baseCls: Ext.baseCSSPrefix + 'mask',

        /**
         * @cfg {Boolean} transparent True to make this mask transparent.
         */
        transparent: false,

        /**
         * @cfg
         * @hide
         */
        top: 0,

        /**
         * @cfg
         * @hide
         */
        left: 0,

        /**
         * @cfg
         * @hide
         */
        right: 0,

        /**
         * @cfg
         * @hide
         */
        bottom: 0
    },

    /**
     * @event tap
     * A tap event fired when a user taps on this mask
     * @param {Ext.Mask} this The mask instance
     * @param {Ext.EventObject} e The event object
     */
    initialize: function() {
        this.callSuper();

        this.element.on('*', 'onEvent', this);
    },

    onEvent: function(e) {
        var controller = arguments[arguments.length - 1];

        if (controller.info.eventName === 'tap') {
            this.fireEvent('tap', this, e);
            return false;
        }

        if (e && e.stopEvent) {
            e.stopEvent();
        }

        return false;
    },

    updateTransparent: function(newTransparent) {
        this[newTransparent ? 'addCls' : 'removeCls'](this.getBaseCls() + '-transparent');
    }
});
