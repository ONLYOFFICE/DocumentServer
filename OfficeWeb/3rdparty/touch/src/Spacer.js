/**
The {@link Ext.Spacer} component is generally used to put space between items in {@link Ext.Toolbar} components.

## Examples

By default the {@link #flex} configuration is set to 1:

    @example miniphone preview
    Ext.create('Ext.Container', {
        fullscreen: true,
        items: [
            {
                xtype : 'toolbar',
                docked: 'top',
                items: [
                    {
                        xtype: 'button',
                        text : 'Button One'
                    },
                    {
                        xtype: 'spacer'
                    },
                    {
                        xtype: 'button',
                        text : 'Button Two'
                    }
                ]
            }
        ]
    });

Alternatively you can just set the {@link #width} configuration which will get the {@link Ext.Spacer} a fixed width:

    @example preview
    Ext.create('Ext.Container', {
        fullscreen: true,
        layout: {
            type: 'vbox',
            pack: 'center',
            align: 'stretch'
        },
        items: [
            {
                xtype : 'toolbar',
                docked: 'top',
                items: [
                    {
                        xtype: 'button',
                        text : 'Button One'
                    },
                    {
                        xtype: 'spacer',
                        width: 50
                    },
                    {
                        xtype: 'button',
                        text : 'Button Two'
                    }
                ]
            },
            {
                xtype: 'container',
                items: [
                    {
                        xtype: 'button',
                        text : 'Change Ext.Spacer width',
                        handler: function() {
                            //get the spacer using ComponentQuery
                            var spacer = Ext.ComponentQuery.query('spacer')[0],
                                from = 10,
                                to = 250;

                            //set the width to a random number
                            spacer.setWidth(Math.floor(Math.random() * (to - from + 1) + from));
                        }
                    }
                ]
            }
        ]
    });

You can also insert multiple {@link Ext.Spacer}'s:

    @example preview
    Ext.create('Ext.Container', {
        fullscreen: true,
        items: [
            {
                xtype : 'toolbar',
                docked: 'top',
                items: [
                    {
                        xtype: 'button',
                        text : 'Button One'
                    },
                    {
                        xtype: 'spacer'
                    },
                    {
                        xtype: 'button',
                        text : 'Button Two'
                    },
                    {
                        xtype: 'spacer',
                        width: 20
                    },
                    {
                        xtype: 'button',
                        text : 'Button Three'
                    }
                ]
            }
        ]
    });
 */
Ext.define('Ext.Spacer', {
    extend: 'Ext.Component',
    alias : 'widget.spacer',

    config: {
        /**
         * @cfg {Number} flex
         * The flex value of this spacer. This defaults to 1, if no width has been set.
         * @accessor
         */
        
        /**
         * @cfg {Number} width
         * The width of this spacer. If this is set, the value of {@link #flex} will be ignored.
         * @accessor
         */
    },

    // @private
    constructor: function(config) {
        config = config || {};

        if (!config.width) {
            config.flex = 1;
        }

        this.callParent([config]);
    }
});
