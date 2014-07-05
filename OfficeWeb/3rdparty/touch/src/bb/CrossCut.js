/**
 * A class to replicate the behavior of the Contextual menu in BlackBerry 10.
 * 
 * More information: http://docs.blackberry.com/en/developers/deliverables/41577/contextual_menus.jsp
 *
 *     var menu = Ext.create('Ext.bb.CrossCut', {
 *         items: [
 *             {
 *                 text: 'New',
 *                 iconMask: true,
 *                 iconCls: 'compose'
 *             },
 *             {
 *                 text: 'Reply',
 *                 iconMask: true,
 *                 iconCls: 'reply'
 *             },
 *             {
 *                 text: 'Settings',
 *                 iconMask: true,
 *                 iconCls: 'settings'
 *             }
 *         ]
 *     });
 */
Ext.define('Ext.bb.CrossCut', {
    extend: 'Ext.Sheet',
    xtype: 'crosscut',

    requires: [
        'Ext.Button'
    ],

    config: {
        /**
         * @hide
         */
        top: 0,

        /**
         * @hide
         */
        right: 0,

        /**
         * @hide
         */
        bottom: 0,

        /**
         * @hide
         */
        left: null,

        /**
         * @hide
         */
        enter: 'right',

        /**
         * @hide
         */
        exit: 'right',

        /**
         * @hide
         */
        hideOnMaskTap: true,

        /**
         * @hide
         */
        baseCls: 'bb-crosscut',

        /**
         * @hide
         */
        layout: {
            type: 'vbox',
            pack: 'middle'
        },

        /**
         * @hide
         */
        defaultType: 'button',

        /**
         * @hide
         */
        showAnimation: {
            preserveEndState: true,
            to: {
                width: 275
            }
        },

        /**
         * @hide
         */
        hideAnimation: {
            preserveEndState: true,
            to: {
                width: 68
            }
        },

        defaults: {
            baseCls: 'bb-crosscut-item'
        }
    }
});
