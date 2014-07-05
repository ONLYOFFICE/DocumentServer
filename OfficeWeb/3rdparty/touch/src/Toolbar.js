/**
 * @aside video tabs-toolbars
 *
 * {@link Ext.Toolbar}s are most commonly used as docked items as within a {@link Ext.Container}. They can be docked either `top` or `bottom` using the {@link #docked} configuration.
 *
 * They allow you to insert items (normally {@link Ext.Button buttons}) and also add a {@link #title}.
 *
 * The {@link #defaultType} of {@link Ext.Toolbar} is {@link Ext.Button}.
 *
 * You can alternatively use {@link Ext.TitleBar} if you want the title to automatically adjust the size of its items.
 *
 * ## Examples
 *
 *     @example miniphone preview
 *     Ext.create('Ext.Container', {
 *         fullscreen: true,
 *         layout: {
 *             type: 'vbox',
 *             pack: 'center'
 *         },
 *         items: [
 *             {
 *                 xtype : 'toolbar',
 *                 docked: 'top',
 *                 title: 'My Toolbar'
 *             },
 *             {
 *                 xtype: 'container',
 *                 defaults: {
 *                     xtype: 'button',
 *                     margin: '10 10 0 10'
 *                 },
 *                 items: [
 *                     {
 *                         text: 'Toggle docked',
 *                         handler: function() {
 *                             var toolbar = Ext.ComponentQuery.query('toolbar')[0],
 *                                 newDocked = (toolbar.getDocked() === 'top') ? 'bottom' : 'top';
 *
 *                             toolbar.setDocked(newDocked);
 *                         }
 *                     },
 *                     {
 *                         text: 'Toggle UI',
 *                         handler: function() {
 *                             var toolbar = Ext.ComponentQuery.query('toolbar')[0],
 *                                 newUi = (toolbar.getUi() === 'light') ? 'dark' : 'light';
 *
 *                             toolbar.setUi(newUi);
 *                         }
 *                     },
 *                     {
 *                         text: 'Change title',
 *                         handler: function() {
 *                             var toolbar = Ext.ComponentQuery.query('toolbar')[0],
 *                                 titles = ['My Toolbar', 'Ext.Toolbar', 'Configurations are awesome!', 'Beautiful.'],
                                   //internally, the title configuration gets converted into a {@link Ext.Title} component,
                                   //so you must get the title configuration of that component
 *                                 title = toolbar.getTitle().getTitle(),
 *                                 newTitle = titles[titles.indexOf(title) + 1] || titles[0];
 *
 *                             toolbar.setTitle(newTitle);
 *                         }
 *                     }
 *                 ]
 *             }
 *         ]
 *     });
 *
 * ## Notes
 *
 * You must use a HTML5 doctype for {@link #docked} `bottom` to work. To do this, simply add the following code to the HTML file:
 *
 *     <!doctype html>
 *
 * So your index.html file should look a little like this:
 *
 *     <!doctype html>
 *     <html>
 *         <head>
 *             <title>MY application title</title>
 *             ...
 *
 */
Ext.define('Ext.Toolbar', {
    extend: 'Ext.Container',
    xtype : 'toolbar',

    requires: [
        'Ext.Button',
        'Ext.Title',
        'Ext.Spacer',
        'Ext.layout.HBox'
    ],

    // @private
    isToolbar: true,

    config: {
        /**
         * @cfg baseCls
         * @inheritdoc
         */
        baseCls: Ext.baseCSSPrefix + 'toolbar',

        /**
         * @cfg {String} ui
         * The ui for this {@link Ext.Toolbar}. Either 'light' or 'dark'. You can create more UIs by using using the CSS Mixin {@link #sencha-toolbar-ui}
         * @accessor
         */
        ui: 'dark',

        /**
         * @cfg {String/Ext.Title} title
         * The title of the toolbar.
         * @accessor
         */
        title: null,

        /**
         * @cfg {String} defaultType
         * The default xtype to create.
         * @accessor
         */
        defaultType: 'button',

        /**
         * @cfg {String} docked
         * The docked position for this {@link Ext.Toolbar}.
         * If you specify `left` or `right`, the {@link #layout} configuration will automatically change to a `vbox`. It's also
         * recommended to adjust the {@link #width} of the toolbar if you do this.
         * @accessor
         */

        /**
         * @cfg {String} minHeight
         * The minimum height height of the Toolbar.
         * @accessor
         */
        minHeight: '2.6em',

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
         * See the [layouts guide](#!/guides/layouts) for more information
         *
         * __Note:__ If you set the {@link #docked} configuration to `left` or `right`, the default layout will change from the
         * `hbox` to a `vbox`.
         *
         * @accessor
         */
        layout: {
            type: 'hbox',
            align: 'center'
        }
    },

    constructor: function(config) {
        config = config || {};

        if (config.docked == "left" || config.docked == "right") {
            config.layout = {
                type: 'vbox',
                align: 'stretch'
            };
        }

        this.callParent([config]);
    },

    // @private
    applyTitle: function(title) {
        if (typeof title == 'string') {
            title = {
                title: title,
                centered: true
            };
        }

        return Ext.factory(title, Ext.Title, this.getTitle());
    },

    // @private
    updateTitle: function(newTitle, oldTitle) {
        if (newTitle) {
            this.add(newTitle);
        }

        if (oldTitle) {
            oldTitle.destroy();
        }
    },

    /**
     * Shows the title, if it exists.
     */
    showTitle: function() {
        var title = this.getTitle();

        if (title) {
            title.show();
        }
    },

    /**
     * Hides the title, if it exists.
     */
    hideTitle: function() {
        var title = this.getTitle();

        if (title) {
            title.hide();
        }
    }

    /**
     * Returns an {@link Ext.Title} component.
     * @member Ext.Toolbar
     * @method getTitle
     * @return {Ext.Title}
     */

    /**
     * Use this to update the {@link #title} configuration.
     * @member Ext.Toolbar
     * @method setTitle
     * @param {String/Ext.Title} title You can either pass a String, or a config/instance of {@link Ext.Title}.
     */

}, function() {
    //<deprecated product=touch since=2.0>
    /**
     * @member Ext.Toolbar
     * @cfg {Boolean} titleCls
     * The CSS class to apply to the `titleEl`.
     * @removed 2.0.0 Title class is now a config option of the title
     */
    Ext.deprecateProperty(this, 'titleCls', null, "Ext.Toolbar.titleCls has been removed. Use #cls config of title instead.");
    //</deprecated>
});

