(function(clsPrefix) {

/**
 * Most of the visual classes you interact with in Sencha Touch are Components. Every Component in Sencha Touch is a
 * subclass of Ext.Component, which means they can all:
 *
 * * Render themselves onto the page using a template
 * * Show and hide themselves at any time
 * * Center themselves on the screen
 * * Enable and disable themselves
 *
 * They can also do a few more advanced things:
 *
 * * Float above other components (windows, message boxes and overlays)
 * * Change size and position on the screen with animation
 * * Dock other Components inside themselves (useful for toolbars)
 * * Align to other components, allow themselves to be dragged around, make their content scrollable & more
 *
 * ## Available Components
 *
 * There are many components available in Sencha Touch, separated into 4 main groups:
 *
 * ### Navigation components
 * * {@link Ext.Toolbar}
 * * {@link Ext.Button}
 * * {@link Ext.TitleBar}
 * * {@link Ext.SegmentedButton}
 * * {@link Ext.Title}
 * * {@link Ext.Spacer}
 *
 * ### Store-bound components
 * * {@link Ext.dataview.DataView}
 * * {@link Ext.Carousel}
 * * {@link Ext.List}
 * * {@link Ext.NestedList}
 *
 * ### Form components
 * * {@link Ext.form.Panel}
 * * {@link Ext.form.FieldSet}
 * * {@link Ext.field.Checkbox}
 * * {@link Ext.field.Hidden}
 * * {@link Ext.field.Slider}
 * * {@link Ext.field.Text}
 * * {@link Ext.picker.Picker}
 * * {@link Ext.picker.Date}
 *
 * ### General components
 * * {@link Ext.Panel}
 * * {@link Ext.tab.Panel}
 * * {@link Ext.Viewport Ext.Viewport}
 * * {@link Ext.Img}
 * * {@link Ext.Map}
 * * {@link Ext.Audio}
 * * {@link Ext.Video}
 * * {@link Ext.Sheet}
 * * {@link Ext.ActionSheet}
 * * {@link Ext.MessageBox}
 *
 *
 * ## Instantiating Components
 *
 * Components are created the same way as all other classes in Sencha Touch - using Ext.create. Here's how we can
 * create a Text field:
 *
 *     var panel = Ext.create('Ext.Panel', {
 *         html: 'This is my panel'
 *     });
 *
 * This will create a {@link Ext.Panel Panel} instance, configured with some basic HTML content. A Panel is just a
 * simple Component that can render HTML and also contain other items. In this case we've created a Panel instance but
 * it won't show up on the screen yet because items are not rendered immediately after being instantiated. This allows
 * us to create some components and move them around before rendering and laying them out, which is a good deal faster
 * than moving them after rendering.
 *
 * To show this panel on the screen now we can simply add it to the global Viewport:
 *
 *     Ext.Viewport.add(panel);
 *
 * Panels are also Containers, which means they can contain other Components, arranged by a layout. Let's revisit the
 * above example now, this time creating a panel with two child Components and a hbox layout:
 *
 *     @example
 *     var panel = Ext.create('Ext.Panel', {
 *         layout: 'hbox',
 *
 *         items: [
 *             {
 *                 xtype: 'panel',
 *                 flex: 1,
 *                 html: 'Left Panel, 1/3rd of total size',
 *                  style: 'background-color: #5E99CC;'
 *             },
 *             {
 *                 xtype: 'panel',
 *                 flex: 2,
 *                 html: 'Right Panel, 2/3rds of total size',
 *                  style: 'background-color: #759E60;'
 *             }
 *         ]
 *     });
 *
 *     Ext.Viewport.add(panel);
 *
 * This time we created 3 Panels - the first one is created just as before but the inner two are declared inline using
 * an xtype. Xtype is a convenient way of creating Components without having to go through the process of using
 * Ext.create and specifying the full class name, instead you can just provide the xtype for the class inside an object
 * and the framework will create the components for you.
 *
 * We also specified a layout for the top level panel - in this case hbox, which splits the horizontal width of the
 * parent panel based on the 'flex' of each child. For example, if the parent Panel above is 300px wide then the first
 * child will be flexed to 100px wide and the second to 200px because the first one was given `flex: 1` and the second
 * `flex: 2`.
 *
 * ## Using xtype
 *
 * xtype is an easy way to create Components without using the full class name. This is especially useful when creating
 * a {@link Ext.Container Container} that contains child Components. An xtype is simply a shorthand way of specifying a
 * Component - for example you can use `xtype: 'panel'` instead of typing out Ext.panel.Panel.
 *
 * Sample usage:
 *
 *     @example miniphone
 *     Ext.create('Ext.Container', {
 *         fullscreen: true,
 *         layout: 'fit',
 *
 *         items: [
 *             {
 *                 xtype: 'panel',
 *                 html: 'This panel is created by xtype'
 *             },
 *             {
 *                 xtype: 'toolbar',
 *                 title: 'So is the toolbar',
 *                 docked: 'top'
 *             }
 *         ]
 *     });
 *
 *
 * ### Common xtypes
 *
 * These are the xtypes that are most commonly used. For an exhaustive list please see the
 * [Components Guide](#!/guide/components).
 *
 * <pre>
 xtype                   Class
 -----------------       ---------------------
 actionsheet             Ext.ActionSheet
 audio                   Ext.Audio
 button                  Ext.Button
 image                   Ext.Img
 label                   Ext.Label
 loadmask                Ext.LoadMask
 map                     Ext.Map
 panel                   Ext.Panel
 segmentedbutton         Ext.SegmentedButton
 sheet                   Ext.Sheet
 spacer                  Ext.Spacer
 titlebar                Ext.TitleBar
 toolbar                 Ext.Toolbar
 video                   Ext.Video
 carousel                Ext.carousel.Carousel
 navigationview          Ext.navigation.View
 datepicker              Ext.picker.Date
 picker                  Ext.picker.Picker
 slider                  Ext.slider.Slider
 thumb                   Ext.slider.Thumb
 tabpanel                Ext.tab.Panel
 viewport                Ext.viewport.Default

 DataView Components
 ---------------------------------------------
 dataview                Ext.dataview.DataView
 list                    Ext.dataview.List
 nestedlist              Ext.dataview.NestedList

 Form Components
 ---------------------------------------------
 checkboxfield           Ext.field.Checkbox
 datepickerfield         Ext.field.DatePicker
 emailfield              Ext.field.Email
 hiddenfield             Ext.field.Hidden
 numberfield             Ext.field.Number
 passwordfield           Ext.field.Password
 radiofield              Ext.field.Radio
 searchfield             Ext.field.Search
 selectfield             Ext.field.Select
 sliderfield             Ext.field.Slider
 spinnerfield            Ext.field.Spinner
 textfield               Ext.field.Text
 textareafield           Ext.field.TextArea
 togglefield             Ext.field.Toggle
 urlfield                Ext.field.Url
 fieldset                Ext.form.FieldSet
 formpanel               Ext.form.Panel
 * </pre>
 *
 * ## Configuring Components
 *
 * Whenever you create a new Component you can pass in configuration options. All of the configurations for a given
 * Component are listed in the "Config options" section of its class docs page. You can pass in any number of
 * configuration options when you instantiate the Component, and modify any of them at any point later. For example, we
 * can easily modify the {@link Ext.Panel#html html content} of a Panel after creating it:
 *
 *     @example miniphone
 *     // we can configure the HTML when we instantiate the Component
 *     var panel = Ext.create('Ext.Panel', {
 *         fullscreen: true,
 *         html: 'This is a Panel'
 *     });
 *
 *     // we can update the HTML later using the setHtml method:
 *     panel.setHtml('Some new HTML');
 *
 *     // we can retrieve the current HTML using the getHtml method:
 *     Ext.Msg.alert(panel.getHtml()); // displays "Some new HTML"
 *
 * Every config has a getter method and a setter method - these are automatically generated and always follow the same
 * pattern. For example, a config called `html` will receive `getHtml` and `setHtml` methods, a config called `defaultType`
 * will receive `getDefaultType` and `setDefaultType` methods, and so on.
 *
 * ## Further Reading
 *
 * See the [Component & Container Guide](#!/guide/components) for more information, and check out the
 * {@link Ext.Container} class docs also.
 *
 * @aside guide components
 * @aside guide events
 *
 */
Ext.define('Ext.Component', {

    extend: 'Ext.AbstractComponent',

    alternateClassName: 'Ext.lib.Component',

    mixins: ['Ext.mixin.Traversable'],

    requires: [
        'Ext.ComponentManager',
        'Ext.XTemplate',
        'Ext.dom.Element',
        'Ext.behavior.Translatable',
        'Ext.behavior.Draggable'
    ],

    /**
     * @cfg {String} xtype
     * The `xtype` configuration option can be used to optimize Component creation and rendering. It serves as a
     * shortcut to the full component name. For example, the component `Ext.button.Button` has an xtype of `button`.
     *
     * You can define your own xtype on a custom {@link Ext.Component component} by specifying the
     * {@link Ext.Class#alias alias} config option with a prefix of `widget`. For example:
     *
     *     Ext.define('PressMeButton', {
     *         extend: 'Ext.button.Button',
     *         alias: 'widget.pressmebutton',
     *         text: 'Press Me'
     *     });
     *
     * Any Component can be created implicitly as an object config with an xtype specified, allowing it to be
     * declared and passed into the rendering pipeline without actually being instantiated as an object. Not only is
     * rendering deferred, but the actual creation of the object itself is also deferred, saving memory and resources
     * until they are actually needed. In complex, nested layouts containing many Components, this can make a
     * noticeable improvement in performance.
     *
     *     // Explicit creation of contained Components:
     *     var panel = new Ext.Panel({
     *        // ...
     *        items: [
     *           Ext.create('Ext.button.Button', {
     *              text: 'OK'
     *           })
     *        ]
     *     });
     *
     *     // Implicit creation using xtype:
     *     var panel = new Ext.Panel({
     *        // ...
     *        items: [{
     *           xtype: 'button',
     *           text: 'OK'
     *        }]
     *     });
     *
     * In the first example, the button will always be created immediately during the panel's initialization. With
     * many added Components, this approach could potentially slow the rendering of the page. In the second example,
     * the button will not be created or rendered until the panel is actually displayed in the browser. If the panel
     * is never displayed (for example, if it is a tab that remains hidden) then the button will never be created and
     * will never consume any resources whatsoever.
     */
    xtype: 'component',

    observableType: 'component',

    cachedConfig: {
        /**
         * @cfg {String} baseCls
         * The base CSS class to apply to this component's element. This will also be prepended to
         * other elements within this component. To add specific styling for sub-classes, use the {@link #cls} config.
         * @accessor
         */
        baseCls: null,

        /**
         * @cfg {String/String[]} cls The CSS class to add to this component's element, in addition to the {@link #baseCls}
         * @accessor
         */
        cls: null,

        /**
         * @cfg {String} [floatingCls="x-floating"] The CSS class to add to this component when it is floatable.
         * @accessor
         */
        floatingCls: clsPrefix + 'floating',

        /**
         * @cfg {String} [hiddenCls="x-item-hidden"] The CSS class to add to the component when it is hidden
         * @accessor
         */
        hiddenCls: clsPrefix + 'item-hidden',

        /**
         * @cfg {String} ui The ui to be used on this Component
         */
        ui: null,

        /**
         * @cfg {Number/String} margin The margin to use on this Component. Can be specified as a number (in which case
         * all edges get the same margin) or a CSS string like '5 10 10 10'
         * @accessor
         */
        margin: null,

        /**
         * @cfg {Number/String} padding The padding to use on this Component. Can be specified as a number (in which
         * case all edges get the same padding) or a CSS string like '5 10 10 10'
         * @accessor
         */
        padding: null,

        /**
         * @cfg {Number/String} border The border width to use on this Component. Can be specified as a number (in which
         * case all edges get the same border width) or a CSS string like '5 10 10 10'.
         *
         * Please note that this will not add
         * a `border-color` or `border-style` CSS property to the component; you must do that manually using either CSS or
         * the {@link #style} configuration.
         *
         * ## Using {@link #style}:
         *
         *     Ext.Viewport.add({
         *         centered: true,
         *         width: 100,
         *         height: 100,
         *
         *         border: 3,
         *         style: 'border-color: blue; border-style: solid;'
         *         // ...
         *     });
         *
         * ## Using CSS:
         *
         *     Ext.Viewport.add({
         *         centered: true,
         *         width: 100,
         *         height: 100,
         *
         *         border: 3,
         *         cls: 'my-component'
         *         // ...
         *     });
         *
         * And your CSS file:
         *
         *     .my-component {
         *         border-color: red;
         *         border-style: solid;
         *     }
         *
         * @accessor
         */
        border: null,

        /**
         * @cfg {String} [styleHtmlCls="x-html"]
         * The class that is added to the content target when you set `styleHtmlContent` to `true`.
         * @accessor
         */
        styleHtmlCls: clsPrefix + 'html',

        /**
         * @cfg {Boolean} [styleHtmlContent=false]
         * `true` to automatically style the HTML inside the content target of this component (body for panels).
         * @accessor
         */
        styleHtmlContent: null
    },

    eventedConfig: {
        /**
         * @cfg {Number} flex
         * The flex of this item *if* this item item is inside a {@link Ext.layout.HBox} or {@link Ext.layout.VBox}
         * layout.
         *
         * You can also update the flex of a component dynamically using the {@link Ext.layout.FlexBox#setItemFlex}
         * method.
         */
        flex: null,

        /**
         * @cfg {Number/String} left
         * The absolute left position of this Component; must be a valid CSS length value, e.g: `300`, `100px`, `30%`, etc.
         * Explicitly setting this value will make this Component become 'floating', which means its layout will no
         * longer be affected by the Container that it resides in.
         * @accessor
         * @evented
         */
        left: null,

        /**
         * @cfg {Number/String} top
         * The absolute top position of this Component; must be a valid CSS length value, e.g: `300`, `100px`, `30%`, etc.
         * Explicitly setting this value will make this Component become 'floating', which means its layout will no
         * longer be affected by the Container that it resides in.
         * @accessor
         * @evented
         */
        top: null,

        /**
         * @cfg {Number/String} right
         * The absolute right position of this Component; must be a valid CSS length value, e.g: `300`, `100px`, `30%`, etc.
         * Explicitly setting this value will make this Component become 'floating', which means its layout will no
         * longer be affected by the Container that it resides in.
         * @accessor
         * @evented
         */
        right: null,

        /**
         * @cfg {Number/String} bottom
         * The absolute bottom position of this Component; must be a valid CSS length value, e.g: `300`, `100px`, `30%`, etc.
         * Explicitly setting this value will make this Component become 'floating', which means its layout will no
         * longer be affected by the Container that it resides in.
         * @accessor
         * @evented
         */
        bottom: null,

        /**
         * @cfg {Number/String} width
         * The width of this Component; must be a valid CSS length value, e.g: `300`, `100px`, `30%`, etc.
         * By default, if this is not explicitly set, this Component's element will simply have its own natural size.
         * @accessor
         * @evented
         */
        width: null,

        /**
         * @cfg {Number/String} height
         * The height of this Component; must be a valid CSS length value, e.g: `300`, `100px`, `30%`, etc.
         * By default, if this is not explicitly set, this Component's element will simply have its own natural size.
         * @accessor
         * @evented
         */
        height: null,

        /**
         * @cfg {Number/String} minWidth
         * The minimum width of this Component; must be a valid CSS length value, e.g: `300`, `100px`, `30%`, etc.
         * @accessor
         * @evented
         */
        minWidth: null,

        /**
         * @cfg {Number/String} minHeight
         * The minimum height of this Component; must be a valid CSS length value, e.g: `300`, `100px`, `30%`, etc.
         * @accessor
         * @evented
         */
        minHeight: null,

        /**
         * @cfg {Number/String} maxWidth
         * The maximum width of this Component; must be a valid CSS length value, e.g: `300`, `100px`, `30%`, etc.
         * Note that this config will not apply if the Component is 'floating' (absolutely positioned or centered)
         * @accessor
         * @evented
         */
        maxWidth: null,

        /**
         * @cfg {Number/String} maxHeight
         * The maximum height of this Component; must be a valid CSS length value, e.g: `300`, `100px`, `30%`, etc.
         * Note that this config will not apply if the Component is 'floating' (absolutely positioned or centered)
         * @accessor
         * @evented
         */
        maxHeight: null,

        /**
         * @cfg {String} docked
         * The dock position of this component in its container. Can be `left`, `top`, `right` or `bottom`.
         *
         * __Notes__
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
         * @accessor
         * @evented
         */
        docked: null,

        /**
         * @cfg {Boolean} centered
         * Whether or not this Component is absolutely centered inside its Container
         * @accessor
         * @evented
         */
        centered: null,

        /**
         * @cfg {Boolean} hidden
         * Whether or not this Component is hidden (its CSS `display` property is set to `none`)
         * @accessor
         * @evented
         */
        hidden: null,

        /**
         * @cfg {Boolean} disabled
         * Whether or not this component is disabled
         * @accessor
         * @evented
         */
        disabled: null
    },

    config: {
        /**
         * @cfg {String/Object} style Optional CSS styles that will be rendered into an inline style attribute when the
         * Component is rendered.
         *
         * You can pass either a string syntax:
         *
         *     style: 'background:red'
         *
         * Or by using an object:
         *
         *     style: {
         *         background: 'red'
         *     }
         *
         * When using the object syntax, you can define CSS Properties by using a string:
         *
         *     style: {
         *         'border-left': '1px solid red'
         *     }
         *
         * Although the object syntax is much easier to read, we suggest you to use the string syntax for better performance.
         *
         * @accessor
         */
        style: null,

        /**
         * @cfg {String/Ext.Element/HTMLElement} html Optional HTML content to render inside this Component, or a reference
         * to an existing element on the page.
         * @accessor
         */
        html: null,

        /**
         * @cfg {Object} draggable Configuration options to make this Component draggable
         * @accessor
         */
        draggable: null,

        /**
         * @cfg {Object} translatable
         * @private
         * @accessor
         */
        translatable: null,

        /**
         * @cfg {Ext.Element} renderTo Optional element to render this Component to. Usually this is not needed because
         * a Component is normally full screen or automatically rendered inside another {@link Ext.Container Container}
         * @accessor
         */
        renderTo: null,

        /**
         * @cfg {Number} zIndex The z-index to give this Component when it is rendered
         * @accessor
         */
        zIndex: null,

        /**
         * @cfg {String/String[]/Ext.Template[]/Ext.XTemplate[]} tpl
         * A {@link String}, {@link Ext.Template}, {@link Ext.XTemplate} or an {@link Array} of strings to form an {@link Ext.XTemplate}.
         * Used in conjunction with the {@link #data} and {@link #tplWriteMode} configurations.
         *
         * __Note__
         * The {@link #data} configuration _must_ be set for any content to be shown in the component when using this configuration.
         * @accessor
         */
        tpl: null,

        /**
         * @cfg {String/Mixed} enterAnimation
         * Animation effect to apply when the Component is being shown.  Typically you want to use an
         * inbound animation type such as 'fadeIn' or 'slideIn'.
         * @deprecated 2.0.0 Please use {@link #showAnimation} instead.
         * @accessor
         */
        enterAnimation: null,

        /**
         * @cfg {String/Mixed} exitAnimation
         * Animation effect to apply when the Component is being hidden.
         * @deprecated 2.0.0 Please use {@link #hideAnimation} instead.  Typically you want to use an
         * outbound animation type such as 'fadeOut' or 'slideOut'.
         * @accessor
         */
        exitAnimation: null,

        /**
         * @cfg {String/Mixed} showAnimation
         * Animation effect to apply when the Component is being shown.  Typically you want to use an
         * inbound animation type such as 'fadeIn' or 'slideIn'.
         * @accessor
         */
        showAnimation: null,

        /**
         * @cfg {String/Mixed} hideAnimation
         * Animation effect to apply when the Component is being hidden.  Typically you want to use an
         * outbound animation type such as 'fadeOut' or 'slideOut'.
         * @accessor
         */
        hideAnimation: null,

        /**
         * @cfg {String} tplWriteMode The Ext.(X)Template method to use when
         * updating the content area of the Component.
         * Valid modes are:
         *
         * - append
         * - insertAfter
         * - insertBefore
         * - insertFirst
         * - overwrite
         * @accessor
         */
        tplWriteMode: 'overwrite',

        /**
         * @cfg {Mixed} data
         * The initial set of data to apply to the `{@link #tpl}` to
         * update the content area of the Component.
         * @accessor
         */
        data: null,

        /**
         * @cfg {String} [disabledCls="x-item-disabled"] The CSS class to add to the component when it is disabled
         * @accessor
         */
        disabledCls: clsPrefix + 'item-disabled',

        /**
         * @cfg {Ext.Element/HTMLElement/String} contentEl The configured element will automatically be
         * added as the content of this component. When you pass a string, we expect it to be an element id.
         * If the content element is hidden, we will automatically show it.
         * @accessor
         */
        contentEl: null,

        /**
         * @cfg {String} id
         * The **unique id of this component instance.**
         *
         * It should not be necessary to use this configuration except for singleton objects in your application. Components
         * created with an id may be accessed globally using {@link Ext#getCmp Ext.getCmp}.
         *
         * Instead of using assigned ids, use the {@link #itemId} config, and {@link Ext.ComponentQuery ComponentQuery}
         * which provides selector-based searching for Sencha Components analogous to DOM querying. The
         * {@link Ext.Container} class contains {@link Ext.Container#down shortcut methods} to query
         * its descendant Components by selector.
         *
         * Note that this id will also be used as the element id for the containing HTML element that is rendered to the
         * page for this component. This allows you to write id-based CSS rules to style the specific instance of this
         * component uniquely, and also to select sub-elements using this component's id as the parent.
         *
         * **Note**: to avoid complications imposed by a unique id also see `{@link #itemId}`.
         *
         * Defaults to an auto-assigned id.
         */

        /**
         * @cfg {String} itemId
         * An itemId can be used as an alternative way to get a reference to a component when no object reference is
         * available. Instead of using an `{@link #id}` with {@link Ext#getCmp}, use `itemId` with
         * {@link Ext.Container#getComponent} which will retrieve `itemId`'s or {@link #id}'s. Since `itemId`'s are an
         * index to the container's internal MixedCollection, the `itemId` is scoped locally to the container - avoiding
         * potential conflicts with {@link Ext.ComponentManager} which requires a **unique** `{@link #id}`.
         *
         * Also see {@link #id}, {@link Ext.Container#query}, {@link Ext.Container#down} and {@link Ext.Container#child}.
         *
         * @accessor
         */
        itemId: undefined,

        /**
         * @cfg {Ext.data.Model} record A model instance which updates the Component's html based on it's tpl. Similar to the data
         * configuration, but tied to to a record to make allow dynamic updates.  This must be a model
         * instance and not a configuration of one.
         * @accessor
         */
        record: null,

        /**
         * @cfg {Object/Array} plugins
         * @accessor
         * An object or array of objects that will provide custom functionality for this component.  The only
         * requirement for a valid plugin is that it contain an init method that accepts a reference of type Ext.Component.
         *
         * When a component is created, if any plugins are available, the component will call the init method on each
         * plugin, passing a reference to itself.  Each plugin can then call methods or respond to events on the
         * component as needed to provide its functionality.
         *
         * For examples of plugins, see Ext.plugin.PullRefresh and Ext.plugin.ListPaging
         *
         * ## Example code
         *
         * A plugin by alias:
         *
         *     Ext.create('Ext.dataview.List', {
         *         config: {
         *             plugins: 'listpaging',
         *             itemTpl: '<div class="item">{title}</div>',
         *             store: 'Items'
         *         }
         *     });
         *
         * Multiple plugins by alias:
         *
         *     Ext.create('Ext.dataview.List', {
         *         config: {
         *             plugins: ['listpaging', 'pullrefresh'],
         *             itemTpl: '<div class="item">{title}</div>',
         *             store: 'Items'
         *         }
         *     });
         *
         * Single plugin by class name with config options:
         *
         *     Ext.create('Ext.dataview.List', {
         *         config: {
         *             plugins: {
         *                 xclass: 'Ext.plugin.ListPaging', // Reference plugin by class
         *                 autoPaging: true
         *             },
         *
         *             itemTpl: '<div class="item">{title}</div>',
         *             store: 'Items'
         *         }
         *     });
         *
         * Multiple plugins by class name with config options:
         *
         *     Ext.create('Ext.dataview.List', {
         *         config: {
         *             plugins: [
         *                 {
         *                     xclass: 'Ext.plugin.PullRefresh',
         *                     pullRefreshText: 'Pull to refresh...'
         *                 },
         *                 {
         *                     xclass: 'Ext.plugin.ListPaging',
         *                     autoPaging: true
         *                 }
         *             ],
         *
         *             itemTpl: '<div class="item">{title}</div>',
         *             store: 'Items'
         *         }
         *     });
         *
         */
        plugins: null
    },

    /**
     * @event show
     * Fires whenever the Component is shown
     * @param {Ext.Component} this The component instance
     */

    /**
     * @event hide
     * Fires whenever the Component is hidden
     * @param {Ext.Component} this The component instance
     */

    /**
     * @event fullscreen
     * Fires whenever a Component with the fullscreen config is instantiated
     * @param {Ext.Component} this The component instance
     */

    /**
     * @event floatingchange
     * Fires whenever there is a change in the floating status of a component
     * @param {Ext.Component} this The component instance
     * @param {Boolean} floating The component's new floating state
     */

    /**
     * @event beforeorientationchange
     * Fires before orientation changes.
     * @removed 2.0.0 This event is now only available `onBefore` the Viewport's {@link Ext.Viewport#orientationchange}
     */

    /**
     * @event orientationchange
     * Fires when orientation changes.
     * @removed 2.0.0 This event is now only available on the Viewport's {@link Ext.Viewport#orientationchange}
     */

    /**
     * @event initialize
     * Fires when the component has been initialized
     * @param {Ext.Component} this The component instance
     */

    /**
     * @event painted
     * @inheritdoc Ext.dom.Element#painted
     */

    /**
     * @event erased
     * Fires when the component is no longer displayed in the DOM.  Listening to this event will
     * degrade performance not recommend for general use.
     * @param {Ext.Component} this The component instance
     */

    /**
     * @event resize
     * @inheritdoc Ext.dom.Element#resize
     */

    /**
     * @private
     */
    listenerOptionsRegex: /^(?:delegate|single|delay|buffer|args|prepend|element)$/,

    /**
     * @private
     */
    alignmentRegex: /^([a-z]+)-([a-z]+)(\?)?$/,

    /**
     * @private
     */
    isComponent: true,

    /**
     * @private
     */
    floating: false,

    /**
     * @private
     */
    rendered: false,

    /**
     * @private
     */
    isInner: true,

    /**
     * @readonly
     * @private
     */
    dockPositions: {
        top: true,
        right: true,
        bottom: true,
        left: true
    },

    innerElement: null,

    element: null,

    template: [],

    widthLayoutSized: false,

    heightLayoutSized: false,

    layoutStretched: false,

    sizeState: false,

    sizeFlags: 0x0,

    LAYOUT_WIDTH: 0x1,

    LAYOUT_HEIGHT: 0x2,

    LAYOUT_BOTH: 0x3,

    LAYOUT_STRETCHED: 0x4,

    /**
     * Creates new Component.
     * @param {Object} config The standard configuration object.
     */
    constructor: function(config) {
        var me = this,
            currentConfig = me.config,
            id;

        me.onInitializedListeners = [];
        me.initialConfig = config;

        if (config !== undefined && 'id' in config) {
            id = config.id;
        }
        else if ('id' in currentConfig) {
            id = currentConfig.id;
        }
        else {
            id = me.getId();
        }

        me.id = id;
        me.setId(id);

        Ext.ComponentManager.register(me);

        me.initElement();

        me.initConfig(me.initialConfig);

        me.refreshSizeState = me.doRefreshSizeState;
        me.refreshFloating = me.doRefreshFloating;

        if (me.refreshSizeStateOnInitialized) {
            me.refreshSizeState();
        }

        if (me.refreshFloatingOnInitialized) {
            me.refreshFloating();
        }

        me.initialize();

        me.triggerInitialized();
        /**
         * Force the component to take up 100% width and height available, by adding it to {@link Ext.Viewport}.
         * @cfg {Boolean} fullscreen
         */
        if (me.config.fullscreen) {
            me.fireEvent('fullscreen', me);
        }

        me.fireEvent('initialize', me);
    },

    beforeInitConfig: function(config) {
        this.beforeInitialize.apply(this, arguments);
    },

    /**
     * @private
     */
    beforeInitialize: Ext.emptyFn,

    /**
     * Allows addition of behavior to the rendering phase.
     * @protected
     * @template
     */
    initialize: Ext.emptyFn,

    getTemplate: function() {
        return this.template;
    },

    /**
     * @private
     * @return {Object}
     * @return {String} return.reference
     * @return {Array} return.classList
     * @return {Object} return.children
     */
    getElementConfig: function() {
        return {
            reference: 'element',
            classList: ['x-unsized'],
            children: this.getTemplate()
        };
    },

    /**
     * @private
     */
    triggerInitialized: function() {
        var listeners = this.onInitializedListeners,
            ln = listeners.length,
            listener, fn, scope, args, i;

        if (!this.initialized) {
            this.initialized = true;

            if (ln > 0) {
                for (i = 0; i < ln; i++) {
                    listener = listeners[i];
                    fn = listener.fn;
                    scope = listener.scope;
                    args = listener.args;

                    if (typeof fn == 'string') {
                        scope[fn].apply(scope, args);
                    }
                    else {
                        fn.apply(scope, args);
                    }
                }

                listeners.length = 0;
            }
        }
    },

    /**
     * @private
     * @param fn
     * @param scope
     */
    onInitialized: function(fn, scope, args) {
        var listeners = this.onInitializedListeners;

        if (!scope) {
            scope = this;
        }

        if (this.initialized) {
            if (typeof fn == 'string') {
                scope[fn].apply(scope, args);
            }
            else {
                fn.apply(scope, args);
            }
        }
        else {
            listeners.push({
                fn: fn,
                scope: scope,
                args: args
            });
        }
    },

    renderTo: function(container, insertBeforeElement) {
        var dom = this.renderElement.dom,
            containerDom = Ext.getDom(container),
            insertBeforeChildDom = Ext.getDom(insertBeforeElement);

        if (containerDom) {
            if (insertBeforeChildDom) {
                containerDom.insertBefore(dom, insertBeforeChildDom);
            }
            else {
                containerDom.appendChild(dom);
            }

            this.setRendered(Boolean(dom.offsetParent));
        }
    },

    /**
     * @private
     * @chainable
     */
    setParent: function(parent) {
        var currentParent = this.parent;

        if (parent && currentParent && currentParent !== parent) {
            currentParent.remove(this, false);
        }

        this.parent = parent;

        return this;
    },

    applyPlugins: function(config) {
        var ln, i, configObj;

        if (!config) {
            return config;
        }

        config = [].concat(config);

        for (i = 0, ln = config.length; i < ln; i++) {
            configObj = config[i];
           //<deprecated product=touch since=2.0>
                if (Ext.isObject(configObj) && configObj.ptype) {
                    //<debug warn>
                        Ext.Logger.deprecate('Using a ptype is now deprecated, please use type instead', 1);
                    //</debug>
                    configObj.type = configObj.ptype;
                }
           //</deprecated>
            config[i] = Ext.factory(configObj, 'Ext.plugin.Plugin', null, 'plugin');
        }

        return config;
    },

    updatePlugins: function(newPlugins, oldPlugins) {
        var ln, i;

        if (newPlugins) {
            for (i = 0, ln = newPlugins.length; i < ln; i++) {
                newPlugins[i].init(this);
            }
        }

        if (oldPlugins) {
            for (i = 0, ln = oldPlugins.length; i < ln; i++) {
                Ext.destroy(oldPlugins[i]);
            }
        }
    },

    updateRenderTo: function(newContainer) {
        this.renderTo(newContainer);
    },

    updateStyle: function(style) {
        this.element.applyStyles(style);
    },

    updateBorder: function(border) {
        this.element.setBorder(border);
    },

    updatePadding: function(padding) {
       this.innerElement.setPadding(padding);
    },

    updateMargin: function(margin) {
        this.element.setMargin(margin);
    },

    updateUi: function(newUi, oldUi) {
        var baseCls = this.getBaseCls();

        if (baseCls) {
            if (oldUi) {
                this.element.removeCls(oldUi, baseCls);
            }

            if (newUi) {
                this.element.addCls(newUi, baseCls);
            }
        }
    },

    applyBaseCls: function(baseCls) {
        return baseCls || clsPrefix + this.xtype;
    },

    updateBaseCls: function(newBaseCls, oldBaseCls) {
        var me = this,
            ui = me.getUi();

        if (newBaseCls) {
            this.element.addCls(newBaseCls);

            if (ui) {
                this.element.addCls(newBaseCls, null, ui);
            }
        }

        if (oldBaseCls) {
            this.element.removeCls(oldBaseCls);

            if (ui) {
                this.element.removeCls(oldBaseCls, null, ui);
            }
        }
    },

    /**
     * Adds a CSS class (or classes) to this Component's rendered element.
     * @param {String} cls The CSS class to add.
     * @param {String} [prefix=""] Optional prefix to add to each class.
     * @param {String} [suffix=""] Optional suffix to add to each class.
     */
    addCls: function(cls, prefix, suffix) {
        var oldCls = this.getCls(),
            newCls = (oldCls) ? oldCls.slice() : [],
            ln, i, cachedCls;

        prefix = prefix || '';
        suffix = suffix || '';

        if (typeof cls == "string") {
            cls = [cls];
        }

        ln = cls.length;

        //check if there is currently nothing in the array and we don't need to add a prefix or a suffix.
        //if true, we can just set the newCls value to the cls property, because that is what the value will be
        //if false, we need to loop through each and add them to the newCls array
        if (!newCls.length && prefix === '' && suffix === '') {
            newCls = cls;
        } else {
            for (i = 0; i < ln; i++) {
                cachedCls = prefix + cls[i] + suffix;
                if (newCls.indexOf(cachedCls) == -1) {
                    newCls.push(cachedCls);
                }
            }
        }

        this.setCls(newCls);
    },

    /**
     * Removes the given CSS class(es) from this Component's rendered element.
     * @param {String} cls The class(es) to remove.
     * @param {String} [prefix=""] Optional prefix to prepend before each class.
     * @param {String} [suffix=""] Optional suffix to append to each class.
     */
    removeCls: function(cls, prefix, suffix) {
        var oldCls = this.getCls(),
            newCls = (oldCls) ? oldCls.slice() : [],
            ln, i;

        prefix = prefix || '';
        suffix = suffix || '';

        if (typeof cls == "string") {
            newCls = Ext.Array.remove(newCls, prefix + cls + suffix);
        } else {
            ln = cls.length;
            for (i = 0; i < ln; i++) {
                newCls = Ext.Array.remove(newCls, prefix + cls[i] + suffix);
            }
        }

        this.setCls(newCls);
    },

    /**
     * Replaces specified classes with the newly specified classes.
     * It uses the {@link #addCls} and {@link #removeCls} methods, so if the class(es) you are removing don't exist, it will
     * still add the new classes.
     * @param {String} oldCls The class(es) to remove.
     * @param {String} newCls The class(es) to add.
     * @param {String} [prefix=""] Optional prefix to prepend before each class.
     * @param {String} [suffix=""] Optional suffix to append to each class.
     */
    replaceCls: function(oldCls, newCls, prefix, suffix) {
        // We could have just called {@link #removeCls} and {@link #addCls}, but that would mean {@link #updateCls}
        // would get called twice, which would have performance implications because it will update the dom.

        var cls = this.getCls(),
            array = (cls) ? cls.slice() : [],
            ln, i, cachedCls;

        prefix = prefix || '';
        suffix = suffix || '';

        //remove all oldCls
        if (typeof oldCls == "string") {
            array = Ext.Array.remove(array, prefix + oldCls + suffix);
        } else if (oldCls) {
            ln = oldCls.length;
            for (i = 0; i < ln; i++) {
                array = Ext.Array.remove(array, prefix + oldCls[i] + suffix);
            }
        }

        //add all newCls
        if (typeof newCls == "string") {
            array.push(prefix + newCls + suffix);
        } else if (newCls) {
            ln = newCls.length;

            //check if there is currently nothing in the array and we don't need to add a prefix or a suffix.
            //if true, we can just set the array value to the newCls property, because that is what the value will be
            //if false, we need to loop through each and add them to the array
            if (!array.length && prefix === '' && suffix === '') {
                array = newCls;
            } else {
                for (i = 0; i < ln; i++) {
                    cachedCls = prefix + newCls[i] + suffix;
                    if (array.indexOf(cachedCls) == -1) {
                        array.push(cachedCls);
                    }
                }
            }
        }

        this.setCls(array);
    },

    /**
     * @private
     * @chainable
     */
    toggleCls: function(className, force) {
        this.element.toggleCls(className, force);

        return this;
    },

    /**
     * @private
     * Checks if the `cls` is a string. If it is, changed it into an array.
     * @param {String/Array} cls
     * @return {Array/null}
     */
    applyCls: function(cls) {
        if (typeof cls == "string") {
            cls = [cls];
        }

        //reset it back to null if there is nothing.
        if (!cls || !cls.length) {
            cls = null;
        }

        return cls;
    },

    /**
     * @private
     * All cls methods directly report to the {@link #cls} configuration, so anytime it changes, {@link #updateCls} will be called
     */
    updateCls: function(newCls, oldCls) {
        if (oldCls != newCls && this.element) {
            this.element.replaceCls(oldCls, newCls);
        }
    },

    /**
     * Updates the {@link #styleHtmlCls} configuration
     */
    updateStyleHtmlCls: function(newHtmlCls, oldHtmlCls) {
        var innerHtmlElement = this.innerHtmlElement,
            innerElement = this.innerElement;

        if (this.getStyleHtmlContent() && oldHtmlCls) {
            if (innerHtmlElement) {
                innerHtmlElement.replaceCls(oldHtmlCls, newHtmlCls);
            } else {
                innerElement.replaceCls(oldHtmlCls, newHtmlCls);
            }
        }
    },

    applyStyleHtmlContent: function(config) {
        return Boolean(config);
    },

    updateStyleHtmlContent: function(styleHtmlContent) {
        var htmlCls = this.getStyleHtmlCls(),
            innerElement = this.innerElement,
            innerHtmlElement = this.innerHtmlElement;

        if (styleHtmlContent) {
            if (innerHtmlElement) {
                innerHtmlElement.addCls(htmlCls);
            } else {
                innerElement.addCls(htmlCls);
            }
        } else {
            if (innerHtmlElement) {
                innerHtmlElement.removeCls(htmlCls);
            } else {
                innerElement.addCls(htmlCls);
            }
        }
    },

    applyContentEl: function(contentEl) {
        if (contentEl) {
            return Ext.get(contentEl);
        }
    },

    updateContentEl: function(newContentEl, oldContentEl) {
        if (oldContentEl) {
            oldContentEl.hide();
            Ext.getBody().append(oldContentEl);
        }

        if (newContentEl) {
            this.setHtml(newContentEl.dom);
            newContentEl.show();
        }
    },

    /**
     * Returns the height and width of the Component.
     * @return {Object} The current `height` and `width` of the Component.
     * @return {Number} return.width
     * @return {Number} return.height
     */
    getSize: function() {
        return {
            width: this.getWidth(),
            height: this.getHeight()
        };
    },

    /**
     * @private
     * @return {Boolean}
     */
    isCentered: function() {
        return Boolean(this.getCentered());
    },

    isFloating: function() {
        return this.floating;
    },

    isDocked: function() {
        return Boolean(this.getDocked());
    },

    isInnerItem: function() {
        return this.isInner;
    },

    setIsInner: function(isInner) {
        if (isInner !== this.isInner) {
            this.isInner = isInner;

            if (this.initialized) {
                this.fireEvent('innerstatechange', this, isInner);
            }
        }
    },

    filterPositionValue: function(value) {
        if (value === '' || value === 'auto') {
            value = null;
        }

        return value;
    },

    filterLengthValue: function(value) {
        if (value === 'auto' || (!value && value !== 0)) {
            return null;
        }

        return value;
    },

    applyTop: function(top) {
        return this.filterPositionValue(top);
    },

    applyRight: function(right) {
        return this.filterPositionValue(right);
    },

    applyBottom: function(bottom) {
        return this.filterPositionValue(bottom);
    },

    applyLeft: function(left) {
        return this.filterPositionValue(left);
    },

    applyWidth: function(width) {
        return this.filterLengthValue(width);
    },

    applyHeight: function(height) {
        return this.filterLengthValue(height);
    },

    applyMinWidth: function(width) {
        return this.filterLengthValue(width);
    },

    applyMinHeight: function(height) {
        return this.filterLengthValue(height);
    },

    applyMaxWidth: function(width) {
        return this.filterLengthValue(width);
    },

    applyMaxHeight: function(height) {
        return this.filterLengthValue(height);
    },

    doSetTop: function(top) {
        this.element.setTop(top);
        this.refreshFloating();
    },

    doSetRight: function(right) {
        this.element.setRight(right);
        this.refreshFloating();
    },

    doSetBottom: function(bottom) {
        this.element.setBottom(bottom);
        this.refreshFloating();
    },

    doSetLeft: function(left) {
        this.element.setLeft(left);
        this.refreshFloating();
    },

    doSetWidth: function(width) {
        this.element.setWidth(width);
        this.refreshSizeState();
    },

    doSetHeight: function(height) {
        this.element.setHeight(height);
        this.refreshSizeState();
    },

    applyFlex: function(flex) {
        if (flex) {
            flex = Number(flex);

            if (isNaN(flex)) {
                flex = null;
            }
        }
        else {
            flex = null
        }

        return flex;
    },

    doSetFlex: Ext.emptyFn,

    refreshSizeState: function() {
        this.refreshSizeStateOnInitialized = true;
    },

    doRefreshSizeState: function() {
        var hasWidth = this.getWidth() !== null || this.widthLayoutSized || (this.getLeft() !== null && this.getRight() !== null),
            hasHeight = this.getHeight() !== null || this.heightLayoutSized || (this.getTop() !== null && this.getBottom() !== null),
            stretched = this.layoutStretched || (!hasHeight && this.getMinHeight() !== null),
            state = hasWidth && hasHeight,
            flags = (hasWidth && this.LAYOUT_WIDTH) | (hasHeight && this.LAYOUT_HEIGHT) | (stretched && this.LAYOUT_STRETCHED);

        if (!state && stretched) {
            state = null;
        }

        this.setSizeState(state);
        this.setSizeFlags(flags);
    },

    setLayoutSizeFlags: function(flags) {
        this.layoutStretched = !!(flags & this.LAYOUT_STRETCHED);
        this.widthLayoutSized = !!(flags & this.LAYOUT_WIDTH);
        this.heightLayoutSized = !!(flags & this.LAYOUT_HEIGHT);

        this.refreshSizeState();
    },

    setSizeFlags: function(flags) {
        if (flags !== this.sizeFlags) {
            this.sizeFlags = flags;

            if (this.initialized) {
                this.fireEvent('sizeflagschange', this, flags);
            }
        }
    },

    getSizeFlags: function() {
        if (!this.initialized) {
            this.doRefreshSizeState();
        }

        return this.sizeFlags;
    },

    setSizeState: function(state) {
        if (state !== this.sizeState) {
            this.sizeState = state;

            this.element.setSizeState(state);

            if (this.initialized) {
                this.fireEvent('sizestatechange', this, state);
            }
        }
    },

    getSizeState: function() {
        if (!this.initialized) {
            this.doRefreshSizeState();
        }

        return this.sizeState;
    },


    doSetMinWidth: function(width) {
        this.element.setMinWidth(width);
    },

    doSetMinHeight: function(height) {
        this.element.setMinHeight(height);
        this.refreshSizeState();
    },

    doSetMaxWidth: function(width) {
        this.element.setMaxWidth(width);
    },

    doSetMaxHeight: function(height) {
        this.element.setMaxHeight(height);
    },

    /**
     * @private
     * @param {Boolean} centered
     * @return {Boolean}
     */
    applyCentered: function(centered) {
        centered = Boolean(centered);

        if (centered) {
            this.refreshInnerState = Ext.emptyFn;

            if (this.isFloating()) {
                this.resetFloating();
            }

            if (this.isDocked()) {
                this.setDocked(false);
            }

            this.setIsInner(false);
            delete this.refreshInnerState;
        }

        return centered;
    },

    doSetCentered: function(centered) {
        this.toggleCls(this.getFloatingCls(), centered);

        if (!centered) {
            this.refreshInnerState();
        }
    },

    applyDocked: function(docked) {
        if (!docked) {
            return null;
        }

        //<debug error>
        if (!/^(top|right|bottom|left)$/.test(docked)) {
            Ext.Logger.error("Invalid docking position of '" + docked.position + "', must be either 'top', 'right', 'bottom', " +
                "'left' or `null` (for no docking)", this);
            return;
        }
        //</debug>

        this.refreshInnerState = Ext.emptyFn;

        if (this.isFloating()) {
            this.resetFloating();
        }

        if (this.isCentered()) {
            this.setCentered(false);
        }

        this.setIsInner(false);

        delete this.refreshInnerState;

        return docked;
    },

    doSetDocked: function(docked) {
        if (!docked) {
            this.refreshInnerState();
        }
    },

    /**
     * Resets {@link #top}, {@link #right}, {@link #bottom} and {@link #left} configurations to `null`, which
     * will un-float this component.
     */
    resetFloating: function() {
        this.setTop(null);
        this.setRight(null);
        this.setBottom(null);
        this.setLeft(null);
    },


    refreshInnerState: function() {
        this.setIsInner(!this.isCentered() && !this.isFloating() && !this.isDocked());
    },

    refreshFloating: function() {
        this.refreshFloatingOnInitialized = true;
    },

    doRefreshFloating: function() {
        var floating = true,
            floatingCls = this.getFloatingCls();

        if (this.getTop() === null && this.getBottom() === null &&
            this.getRight() === null && this.getLeft() === null) {
            floating = false;
        }
        else {
            this.refreshSizeState();
        }

        if (floating !== this.floating) {
            this.floating = floating;
            this.element.toggleCls(floatingCls, floating);

            if (floating) {
                this.refreshInnerState = Ext.emptyFn;

                if (this.isCentered()) {
                    this.setCentered(false);
                }

                if (this.isDocked()) {
                    this.setDocked(false);
                }

                this.setIsInner(false);

                delete this.refreshInnerState;
            }

            if (this.initialized) {
                this.fireEvent('floatingchange', this, floating);
            }

            if (!floating) {
                this.refreshInnerState();
            }
        }
    },

    /**
     * Updates the floatingCls if the component is currently floating
     * @private
     */
    updateFloatingCls: function(newFloatingCls, oldFloatingCls) {
        if (this.isFloating()) {
            this.replaceCls(oldFloatingCls, newFloatingCls);
        }
    },

    applyDisabled: function(disabled) {
        return Boolean(disabled);
    },

    doSetDisabled: function(disabled) {
        this.element[disabled ? 'addCls' : 'removeCls'](this.getDisabledCls());
    },

    updateDisabledCls: function(newDisabledCls, oldDisabledCls) {
        if (this.isDisabled()) {
            this.element.replaceCls(oldDisabledCls, newDisabledCls);
        }
    },

    /**
     * Disables this Component
     */
    disable: function() {
       this.setDisabled(true);
    },

    /**
     * Enables this Component
     */
    enable: function() {
        this.setDisabled(false);
    },

    /**
     * Returns `true` if this Component is currently disabled.
     * @return {Boolean} `true` if currently disabled.
     */
    isDisabled: function() {
        return this.getDisabled();
    },

    applyZIndex: function(zIndex) {
        if (!zIndex && zIndex !== 0) {
            zIndex = null;
        }

        if (zIndex !== null) {
            zIndex = Number(zIndex);

            if (isNaN(zIndex)) {
                zIndex = null;
            }
        }

        return zIndex;
    },

    updateZIndex: function(zIndex) {
        var element = this.element,
            domStyle;

        if (element && !element.isDestroyed) {
            domStyle = element.dom.style;
            if (zIndex !== null) {
                domStyle.setProperty('z-index', zIndex, 'important');
            }
            else {
                domStyle.removeProperty('z-index');
            }
        }
    },

    getInnerHtmlElement: function() {
        var innerHtmlElement = this.innerHtmlElement,
            styleHtmlCls = this.getStyleHtmlCls();

        if (!innerHtmlElement || !innerHtmlElement.dom || !innerHtmlElement.dom.parentNode) {
            this.innerHtmlElement = innerHtmlElement = this.innerElement.createChild({ cls: 'x-innerhtml ' });

            if (this.getStyleHtmlContent()) {
                this.innerHtmlElement.addCls(styleHtmlCls);
                this.innerElement.removeCls(styleHtmlCls);
            }
        }

        return innerHtmlElement;
    },

    updateHtml: function(html) {
        var innerHtmlElement = this.getInnerHtmlElement();

        if (Ext.isElement(html)){
            innerHtmlElement.setHtml('');
            innerHtmlElement.append(html);
        }
        else {
            innerHtmlElement.setHtml(html);
        }
    },

    applyHidden: function(hidden) {
        return Boolean(hidden);
    },

    doSetHidden: function(hidden) {
        var element = this.renderElement;

        if (element.isDestroyed) {
            return;
        }

        if (hidden) {
            element.hide();
        }
        else {
            element.show();
        }

        if (this.element) {
            this.element[hidden ? 'addCls' : 'removeCls'](this.getHiddenCls());
        }

        this.fireEvent(hidden ? 'hide' : 'show', this);
    },

    updateHiddenCls: function(newHiddenCls, oldHiddenCls) {
        if (this.isHidden()) {
            this.element.replaceCls(oldHiddenCls, newHiddenCls);
        }
    },

    /**
     * Returns `true` if this Component is currently hidden.
     * @return {Boolean} `true` if currently hidden.
     */
    isHidden: function() {
        return this.getHidden();
    },

    /**
     * Hides this Component
     * @param {Object/Boolean} animation (optional)
     * @return {Ext.Component}
     * @chainable
     */
    hide: function(animation) {
        if (!this.getHidden()) {
            if (animation === undefined || (animation && animation.isComponent)) {
                animation = this.getHideAnimation();
            }
            if (animation) {
                if (animation === true) {
                    animation = 'fadeOut';
                }
                this.onBefore({
                    hiddenchange: 'animateFn',
                    scope: this,
                    single: true,
                    args: [animation]
                });
            }
            this.setHidden(true);
        }
        return this;
    },

    /**
     * Shows this component.
     * @param {Object/Boolean} animation (optional)
     * @return {Ext.Component}
     * @chainable
     */
    show: function(animation) {
        var hidden = this.getHidden();
        if (hidden || hidden === null) {
            if (animation === true) {
                animation = 'fadeIn';
            }
            else if (animation === undefined || (animation && animation.isComponent)) {
                animation = this.getShowAnimation();
            }

            if (animation) {
                this.onBefore({
                    hiddenchange: 'animateFn',
                    scope: this,
                    single: true,
                    args: [animation]
                });
            }

            this.setHidden(false);
        }

        return this;
    },

    animateFn: function(animation, component, newState, oldState, options, controller) {
        if (animation && (!newState || (newState && this.isPainted()))) {
            var anim = new Ext.fx.Animation(animation);

            anim.setElement(component.element);

            if (newState) {
                anim.setOnEnd(function() {
                    controller.resume();
                });

                controller.pause();
            }
            Ext.Animator.run(anim);
        }
    },

    /**
     * @private
     */
    setVisibility: function(isVisible) {
        this.renderElement.setVisibility(isVisible);
    },

    /**
     * @private
     */
    isRendered: function() {
        return this.rendered;
    },

    /**
     * @private
     */
    isPainted: function() {
        return this.renderElement.isPainted();
    },

    /**
     * @private
     */
    applyTpl: function(config) {
        return (Ext.isObject(config) && config.isTemplate) ? config : new Ext.XTemplate(config);
    },

    applyData: function(data) {
        if (Ext.isObject(data)) {
            return Ext.apply({}, data);
        } else if (!data) {
            data = {};
        }

        return data;
    },

    /**
     * @private
     */
    updateData: function(newData) {
        var me = this;
        if (newData) {
            var tpl = me.getTpl(),
                tplWriteMode = me.getTplWriteMode();

            if (tpl) {
                tpl[tplWriteMode](me.getInnerHtmlElement(), newData);
            }

            /**
             * @event updatedata
             * Fires whenever the data of the component is updated
             * @param {Ext.Component} this The component instance
             * @param {Object} newData The new data
             */
            this.fireEvent('updatedata', me, newData);
        }
    },

    applyRecord: function(config) {
        if (config && Ext.isObject(config) && config.isModel) {
            return config;
        }
        return  null;
    },

    updateRecord: function(newRecord, oldRecord) {
        var me = this;

        if (oldRecord) {
            oldRecord.unjoin(me);
        }

        if (!newRecord) {
            me.updateData('');
        }
        else {
            newRecord.join(me);
            me.updateData(newRecord.getData(true));
        }
    },

    // @private Used to handle joining of a record to a tpl
    afterEdit: function() {
        this.updateRecord(this.getRecord());
    },

    // @private Used to handle joining of a record to a tpl
    afterErase: function() {
        this.setRecord(null);
    },

    applyItemId: function(itemId) {
        return itemId || this.getId();
    },

    /**
     * Tests whether or not this Component is of a specific xtype. This can test whether this Component is descended
     * from the xtype (default) or whether it is directly of the xtype specified (`shallow = true`).
     * __If using your own subclasses, be aware that a Component must register its own xtype
     * to participate in determination of inherited xtypes.__
     *
     * For a list of all available xtypes, see the {@link Ext.Component} header.
     *
     * Example usage:
     *
     *     var t = new Ext.field.Text();
     *     var isText = t.isXType('textfield'); // true
     *     var isBoxSubclass = t.isXType('field'); // true, descended from Ext.field.Field
     *     var isBoxInstance = t.isXType('field', true); // false, not a direct Ext.field.Field instance
     *
     * @param {String} xtype The xtype to check for this Component.
     * @param {Boolean} shallow (optional) `false` to check whether this Component is descended from the xtype (this is
     * the default), or `true` to check whether this Component is directly of the specified xtype.
     * @return {Boolean} `true` if this component descends from the specified xtype, `false` otherwise.
     */
    isXType: function(xtype, shallow) {
        if (shallow) {
            return this.xtypes.indexOf(xtype) != -1;
        }

        return Boolean(this.xtypesMap[xtype]);
    },

    /**
     * Returns this Component's xtype hierarchy as a slash-delimited string. For a list of all
     * available xtypes, see the {@link Ext.Component} header.
     *
     * __Note:__ If using your own subclasses, be aware that a Component must register its own xtype
     * to participate in determination of inherited xtypes.
     *
     * Example usage:
     *
     *     var t = new Ext.field.Text();
     *     alert(t.getXTypes());  // alerts 'component/field/textfield'
     *
     * @return {String} The xtype hierarchy string.
     */
    getXTypes: function() {
        return this.xtypesChain.join('/');
    },

    getDraggableBehavior: function() {
        var behavior = this.draggableBehavior;

        if (!behavior) {
            behavior = this.draggableBehavior = new Ext.behavior.Draggable(this);
        }

        return behavior;
    },

    applyDraggable: function(config) {
        this.getDraggableBehavior().setConfig(config);
    },

    getDraggable: function() {
        return this.getDraggableBehavior().getDraggable();
    },

    getTranslatableBehavior: function() {
        var behavior = this.translatableBehavior;

        if (!behavior) {
            behavior = this.translatableBehavior = new Ext.behavior.Translatable(this);
        }

        return behavior;
    },

    applyTranslatable: function(config) {
        this.getTranslatableBehavior().setConfig(config);
    },

    getTranslatable: function() {
        return this.getTranslatableBehavior().getTranslatable();
    },

    translateAxis: function(axis, value, animation) {
        var x, y;

        if (axis === 'x') {
            x = value;
        }
        else {
            y = value;
        }

        return this.translate(x, y, animation);
    },

    translate: function() {
        var translatable = this.getTranslatable();

        if (!translatable) {
            this.setTranslatable(true);
            translatable = this.getTranslatable();
        }

        translatable.translate.apply(translatable, arguments);
    },

    /**
     * @private
     * @param rendered
     */
    setRendered: function(rendered) {
        var wasRendered = this.rendered;

        if (rendered !== wasRendered) {
            this.rendered = rendered;

            return true;
        }

        return false;
    },

    /**
     * Sets the size of the Component.
     * @param {Number} width The new width for the Component.
     * @param {Number} height The new height for the Component.
     */
    setSize: function(width, height) {
        if (width != undefined) {
            this.setWidth(width);
        }
        if (height != undefined) {
            this.setHeight(height);
        }
    },

    //@private
    doAddListener: function(name, fn, scope, options, order) {
        if (options && 'element' in options) {
            //<debug error>
            if (this.referenceList.indexOf(options.element) === -1) {
                Ext.Logger.error("Adding event listener with an invalid element reference of '" + options.element +
                    "' for this component. Available values are: '" + this.referenceList.join("', '") + "'", this);
            }
            //</debug>

            // The default scope is this component
            return this[options.element].doAddListener(name, fn, scope || this, options, order);
        }
        if (name == 'painted' || name == 'resize') {
            return this.element.doAddListener(name, fn, scope || this, options, order);
        }

        return this.callParent(arguments);
    },

    //@private
    doRemoveListener: function(name, fn, scope, options, order) {
        if (options && 'element' in options) {
            //<debug error>
            if (this.referenceList.indexOf(options.element) === -1) {
                Ext.Logger.error("Removing event listener with an invalid element reference of '" + options.element +
                    "' for this component. Available values are: '" + this.referenceList.join('", "') + "'", this);
            }
            //</debug>

            // The default scope is this component
            this[options.element].doRemoveListener(name, fn, scope || this, options, order);
        }
        //<deprecated product=touch since=2.1>
        if (name == 'painted' || name == 'resize') {
            return this.element.doRemoveListener(name, fn, scope, options, order);
        }
        //</deprecated>

        return this.callParent(arguments);
    },

    /**
     * Shows this component by another component. If you specify no alignment, it will automatically
     * position this component relative to the reference component.
     *
     * For example, say we are aligning a Panel next to a Button, the alignment string would look like this:
     *
     *     [panel-vertical (t/b/c)][panel-horizontal (l/r/c)]-[button-vertical (t/b/c)][button-horizontal (l/r/c)]
     *
     * where t = top, b = bottom, c = center, l = left, r = right.
     *
     * ## Examples
     *
     *  - `tl-tr` means top-left corner of the Panel to the top-right corner of the Button
     *  - `tc-bc` means top-center of the Panel to the bottom-center of the Button
     *
     * You can put a '?' at the end of the alignment string to constrain the floating element to the
     * {@link Ext.Viewport Viewport}
     *
     *     // show `panel` by `button` using the default positioning (auto fit)
     *     panel.showBy(button);
     *
     *     // align the top left corner of `panel` with the top right corner of `button` (constrained to viewport)
     *     panel.showBy(button, "tl-tr?");
     *
     *     // align the bottom right corner of `panel` with the center left edge of `button` (not constrained by viewport)
     *     panel.showBy(button, "br-cl");
     *
     * @param {Ext.Component} component The target component to show this component by.
     * @param {String} alignment (optional) The specific alignment.
     */
    showBy: function(component, alignment) {
        var me = this,
            viewport = Ext.Viewport,
            parent = me.getParent();

        me.setVisibility(false);

        if (parent !== viewport) {
            viewport.add(me);
        }

        me.show();

        me.on({
            hide: 'onShowByErased',
            destroy: 'onShowByErased',
            single: true,
            scope: me
        });
        viewport.on('resize', 'alignTo', me, { args: [component, alignment] });

        me.alignTo(component, alignment);
        me.setVisibility(true);
    },

    /**
     * @private
     * @param component
     */
    onShowByErased: function() {
        Ext.Viewport.un('resize', 'alignTo', this);
    },

    /**
     * @private
     */
    alignTo: function(component, alignment) {
        var alignToElement = component.isComponent ? component.renderElement : component,
            element = this.renderElement,
            alignToBox = alignToElement.getPageBox(),
            constrainBox = this.getParent().element.getPageBox(),
            box = element.getPageBox(),
            alignToHeight = alignToBox.height,
            alignToWidth = alignToBox.width,
            height = box.height,
            width = box.width;

        // Keep off the sides...
        constrainBox.bottom -= 5;
        constrainBox.height -= 10;
        constrainBox.left += 5;
        constrainBox.right -= 5;
        constrainBox.top += 5;
        constrainBox.width -= 10;

        if (!alignment || alignment === 'auto') {
            if (constrainBox.bottom - alignToBox.bottom < height) {
                if (alignToBox.top - constrainBox.top < height) {
                    if (alignToBox.left - constrainBox.left < width) {
                        alignment = 'cl-cr?';
                    }
                    else {
                        alignment = 'cr-cl?';
                    }
                }
                else {
                    alignment = 'bc-tc?';
                }
            }
            else {
                alignment = 'tc-bc?';
            }
        }

        var matches = alignment.match(this.alignmentRegex);
        //<debug error>
        if (!matches) {
            Ext.Logger.error("Invalid alignment value of '" + alignment + "'");
        }
        //</debug>

        var from = matches[1].split(''),
            to = matches[2].split(''),
            constrained = (matches[3] === '?'),
            fromVertical = from[0],
            fromHorizontal = from[1] || fromVertical,
            toVertical = to[0],
            toHorizontal = to[1] || toVertical,
            top = alignToBox.top,
            left = alignToBox.left,
            halfAlignHeight = alignToHeight / 2,
            halfAlignWidth = alignToWidth / 2,
            halfWidth = width / 2,
            halfHeight = height / 2,
            maxLeft, maxTop;

        switch (fromVertical) {
            case 't':
                switch (toVertical) {
                    case 'c':
                        top += halfAlignHeight;
                        break;
                    case 'b':
                        top += alignToHeight;
                }
                break;

            case 'b':
                switch (toVertical) {
                    case 'c':
                        top -= (height - halfAlignHeight);
                        break;
                    case 't':
                        top -= height;
                        break;
                    case 'b':
                        top -= height - alignToHeight;
                }
                break;

            case 'c':
                switch (toVertical) {
                    case 't':
                        top -= halfHeight;
                        break;
                    case 'c':
                        top -= (halfHeight - halfAlignHeight);
                        break;
                    case 'b':
                        top -= (halfHeight - alignToHeight);
                }
                break;
        }

        switch (fromHorizontal) {
            case 'l':
                switch (toHorizontal) {
                    case 'c':
                        left += halfAlignHeight;
                        break;
                    case 'r':
                        left += alignToWidth;
                }
                break;

            case 'r':
                switch (toHorizontal) {
                    case 'r':
                        left -= (width - alignToWidth);
                        break;
                    case 'c':
                        left -= (width - halfWidth);
                        break;
                    case 'l':
                        left -= width;
                }
                break;

            case 'c':
                switch (toHorizontal) {
                    case 'l':
                        left -= halfWidth;
                        break;
                    case 'c':
                        left -= (halfWidth - halfAlignWidth);
                        break;
                    case 'r':
                        left -= (halfWidth - alignToWidth);
                }
                break;
        }

        if (constrained) {
            maxLeft = (constrainBox.left + constrainBox.width) - width;
            maxTop = (constrainBox.top + constrainBox.height) - height;

            left = Math.max(constrainBox.left, Math.min(maxLeft, left));
            top = Math.max(constrainBox.top, Math.min(maxTop, top));
        }

        this.setLeft(left);
        this.setTop(top);
    },

    /**
     * Walks up the `ownerCt` axis looking for an ancestor Container which matches
     * the passed simple selector.
     *
     * Example:
     *
     *     var owningTabPanel = grid.up('tabpanel');
     *
     * @param {String} selector (optional) The simple selector to test.
     * @return {Ext.Container} The matching ancestor Container (or `undefined` if no match was found).
     */
    up: function(selector) {
        var result = this.parent;

        if (selector) {
            for (; result; result = result.parent) {
                if (Ext.ComponentQuery.is(result, selector)) {
                    return result;
                }
            }
        }
        return result;
    },

    getBubbleTarget: function() {
        return this.getParent();
    },

    /**
     * Destroys this Component. If it is currently added to a Container it will first be removed from that Container.
     * All Ext.Element references are also deleted and the Component is de-registered from Ext.ComponentManager
     */
    destroy: function() {
        this.destroy = Ext.emptyFn;

        var parent = this.getParent(),
            referenceList = this.referenceList,
            i, ln, reference;

        this.isDestroying = true;
        Ext.destroy(this.getTranslatable(), this.getPlugins());

        // Remove this component itself from the container if it's currently contained
        if (parent) {
            parent.remove(this, false);
        }

        // Destroy all element references
        for (i = 0, ln = referenceList.length; i < ln; i++) {
            reference = referenceList[i];
            this[reference].destroy();
            delete this[reference];
        }

        Ext.destroy(this.innerHtmlElement);
        this.setRecord(null);

        this.callSuper();

        Ext.ComponentManager.unregister(this);
    }

    // Convert old properties in data into a config object
    // <deprecated product=touch since=2.0>
    ,onClassExtended: function(cls, data) {
        var Component = this,
            defaultConfig = Component.prototype.config,
            config = data.config || {},
            key;

        for (key in defaultConfig) {
            if (key in data) {
                config[key] = data[key];
                delete data[key];
                // <debug warn>
                Ext.Logger.deprecate(key + ' is deprecated as a property directly on the Component. ' +
                    'Please put it inside the config object, and retrieve it using "this.config.' + key + '"');
                // </debug>
            }
        }

        data.config = config;
    }
    // </deprecated>

}, function() {
    //<deprecated product=touch since=2.0>
    var emptyFn = Ext.emptyFn;

    this.override({
        constructor: function(config) {
            var name;

            if (config) {
                if (config.enabled) {
                    //<debug warn>
                    Ext.Logger.deprecate("'enabled' config is deprecated, please use 'disabled' config instead", this);
                    //</debug>
                    config.disabled = !config.enabled;
                }

                /**
                 * @member Ext.Component
                 * @cfg {Boolean/String/Object} scroll
                 * This configuration has moved to {@link Ext.Container#scrollable Ext.Container}. You can no longer use it in a Ext.Component.
                 * @removed 2.0.0 This method has been moved from {@link Ext.Component} to {@link Ext.Container#scrollable Ext.Container}
                 */
                if ((config.scroll || this.config.scroll || this.scrollable || this.config.scrollable) && !this.isContainer) {
                    //<debug warn>
                    Ext.Logger.deprecate("You are no longer able to scroll a component. Please use a Ext.Container instead.", this);
                    //</debug>
                    delete config.scrollable;
                    delete config.scroll;
                }

                /**
                 * @member Ext.Component
                 * @cfg {Boolean} hideOnMaskTap
                 * This configuration has moved to {@link Ext.Container#hideOnMaskTap Ext.Container}. You can no longer use it in a Ext.Component.
                 * @removed 2.0.0 This method has been moved from {@link Ext.Component} to {@link Ext.Container#hideOnMaskTap Ext.Container}
                 */
                if ((config.hideOnMaskTap || this.config.hideOnMaskTap) && !this.isContainer) {
                    //<debug warn>
                    Ext.Logger.deprecate("You are no longer able use hideOnMaskTap on a component. Please use a Ext.Container instead.", this);
                    //</debug>
                    delete config.hideOnMaskTap;
                }

                /**
                 * @member Ext.Component
                 * @cfg {Boolean} modal
                 * This configuration has moved to {@link Ext.Container#modal Ext.Container}. You can no longer use it in a Ext.Component.
                 * @removed 2.0.0 This method has been moved from {@link Ext.Component} to {@link Ext.Container#modal Ext.Container}
                 */
                if ((config.modal || this.config.modal) && !this.isContainer) {
                    //<debug warn>
                    Ext.Logger.deprecate("You are no longer able use modal on a component. Please use a Ext.Container instead.", this);
                    //</debug>
                    delete config.modal;
                }

                /**
                 * @cfg {String} dock
                 * The dock position of this component in its container. Can be `left`, `top`, `right` or `bottom`.
                 *
                 * __Notes__
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
                 * @deprecated 2.0.0 This has been deprecated. Please use {@link #docked} instead.
                 */
                if (config.dock) {
                    //<debug warn>
                    Ext.Logger.deprecate("'dock' config for docked items is deprecated, please use 'docked' instead");
                    //</debug>
                    config.docked = config.dock;
                    delete config.dock;
                }

                if (config.enterAnimation) {
                    //<debug warn>
                    Ext.Logger.deprecate("'enterAnimation' config for Components is deprecated, please use 'showAnimation' instead");
                    //</debug>
                    config.showAnimation = config.enterAnimation;
                    delete config.enterAnimation;
                }

                if (config.exitAnimation) {
                    //<debug warn>
                    Ext.Logger.deprecate("'exitAnimation' config for Components is deprecated, please use 'hideAnimation' instead");
                    //</debug>
                    config.hideAnimation = config.exitAnimation;
                    delete config.exitAnimation;
                }

                /**
                 * @member Ext.Component
                 * @cfg {String} componentCls CSS class to add to this Component. Deprecated, please use {@link #cls} instead
                 * @deprecated 2.0.0
                 */
                if (config.componentCls) {
                    //<debug warn>
                    Ext.Logger.deprecate("'componentCls' config is deprecated, please use 'cls' config instead", this);
                    //</debug>
                    config.cls = config.componentCls;
                }

                /**
                 * @member Ext.Component
                 * @cfg {Boolean} floating Deprecated, please use {@link #left}, {@link #top}, {@link #right} or
                 * {@link #bottom} instead.
                 *
                 *     Ext.Viewport.add({
                 *         top: 100,
                 *         left: 100,
                 *         width: 500,
                 *         height: 200,
                 *         html: 'Floating component!'
                 *     });
                 *
                 * @deprecated 2.0.0
                 */
                if (config.floating) {
                    //<debug warn>
                    Ext.Logger.deprecate("'floating' config is deprecated, please set 'left', 'right', " +
                        "'top' or 'bottom' config instead", this);
                    //</debug>
                    config.left = config.left || 0;
                }

                for (name in config) {
                    if (config.hasOwnProperty(name) && name !== 'xtype' && name !== 'xclass' && !this.hasConfig(name)) {
                        this[name] = config[name];
                    }
                }

                /**
                 * @member Ext.Component
                 * @cfg {Boolean} layoutOnOrientationChange
                 * `true` to automatically re-layout this component on orientation change.
                 * @removed 2.0.0
                 */
                if (config.layoutOnOrientationChange) {
                    //<debug warn>
                    Ext.Logger.deprecate("'layoutOnOrientationChange' has been fully removed and no longer used");
                    //</debug>
                    delete config.layoutOnOrientationChange;
                }

                /**
                 * @member Ext.Component
                 * @cfg {Boolean} monitorOrientation
                 * `true` to monitor Orientation change.
                 * @removed 2.0.0
                 */
                if (config.monitorOrientation) {
                    //<debug warn>
                    Ext.Logger.deprecate("'monitorOrientation' has been removed. If you need to monitor the orientation, please use the 'resize' event.");
                    //</debug>
                    delete config.monitorOrientation;
                }

                /**
                 * @member Ext.Component
                 * @cfg {Boolean} stopMaskTapEvent
                 * `true` to stop the event that fires when you click outside the floating component.
                 * @removed 2.0.0
                 */
                if (config.stopMaskTapEvent) {
                    //<debug warn>
                    Ext.Logger.deprecate("'stopMaskTapEvent' has been removed.");
                    //</debug>
                    delete config.stopMaskTapEvent;
                }
            }

            this.callParent(arguments);

            if (this.onRender !== emptyFn) {
                //<debug warn>
                Ext.Logger.deprecate("onRender() is deprecated, please put your code inside initialize() instead", this);
                //</debug>
                this.onRender();
            }

            if (this.afterRender !== emptyFn) {
                //<debug warn>
                Ext.Logger.deprecate("afterRender() is deprecated, please put your code inside initialize() instead", this);
                //</debug>
                this.afterRender();
            }

            if (this.initEvents !== emptyFn) {
                //<debug warn>
                Ext.Logger.deprecate("initEvents() is deprecated, please put your code inside initialize() instead", this);
                //</debug>
                this.initEvents();
            }

            if (this.initComponent !== emptyFn) {
                //<debug warn>
                Ext.Logger.deprecate("initComponent() is deprecated, please put your code inside initialize() instead", this);
                //</debug>
                this.initComponent();
            }

            if (this.setOrientation !== emptyFn) {
                //<debug warn>
                Ext.Logger.deprecate("setOrientation() is deprecated", this);
                //</debug>
                this.setOrientation();
            }
        },

        onRender: emptyFn,

        afterRender: emptyFn,

        initEvents: emptyFn,

        initComponent: emptyFn,

        setOrientation: emptyFn,

        show: function() {
            if (this.renderElement.dom) {
                var containerDom = this.renderElement.dom.parentNode;

                if (containerDom && containerDom.nodeType == 11) {
                    //<debug warn>
                    Ext.Logger.deprecate("Call show() on a component that doesn't currently belong to any container. " +
                        "Please add it to the the Viewport first, i.e: Ext.Viewport.add(component);", this);
                    //</debug>
                    Ext.Viewport.add(this);
                }
            }

            return this.callParent(arguments);
        },

        doAddListener: function(name, fn, scope, options, order) {
            // <debug>
            switch(name) {
                case 'render':
                    Ext.Logger.warn("The render event on Components is deprecated. Please use the painted event. " +
                        "Please refer to: http://bit.ly/xgv3K1 for more details.", this);
                    return this;
                break;
            }
            // </debug>

            return this.callOverridden(arguments);
        },

        addListener: function(options) {
            if (arguments.length === 1 && Ext.isObject(options) && (('el' in options) || ('body' in options))) {
                Ext.Logger.error("Adding component element listeners using the old format is no longer supported. " +
                    "Please refer to: http://bit.ly/xHCyfa for more details.", this);
            }

            return this.callOverridden(arguments);
        },

        /**
         * Retrieves the top level element representing this component.
         * @deprecated 2.0.0 Please access the Component's element from the `element` property instead, i.e:
         *
         *      var element = component.element;
         *
         * @return {Ext.dom.Element}
         */
        getEl: function() {
            //<debug warn>
            Ext.Logger.deprecate("getEl() is deprecated, please access the Component's element from " +
                "the 'element' property instead", this);
            //</debug>
            return this.renderElement;
        },

        /**
         * @member Ext.Component
         * @method setFloating
         * Used to update the floating state of this component.
         * @param {Boolean} floating `true` if you want to float this component.
         * @deprecated 2.0.0 This has been deprecated. Please use {@link #setTop}, {@link #setRight}, {@link #setBottom} and {@link #setLeft} instead.
         */
        setFloating: function(floating) {
            var isFloating = this.isFloating();
            if (floating && !isFloating) {
                this.setTop(0);
            } else if (isFloating) {
                this.resetFloating();
            }
        },

        /**
         * @member Ext.Component
         * This method has moved to {@link Ext.Container#setScrollable Ext.Container}. You can no longer use it in a Ext.Component.
         * @removed 2.0.0 This method has been moved from {@link Ext.Component} to {@link Ext.Container#setScrollable Ext.Container}
         */
        setScrollable: function() {
            //<debug warn>
            Ext.Logger.deprecate("Ext.Component cannot be scrollable. Please use Ext.Container#setScrollable on a Ext.Container.", this);
            //</debug>
            return false;
        }
    });

    /**
     * @member Ext.Component
     * @method update
     * Updates the HTML content of the Component.
     * @deprecated 2.0.0 Please use {@link #setHtml}, {@link #setTpl} or {@link #setData} instead.
     */

    Ext.deprecateClassMembers(this, {
        el: 'element',
        body: 'element',
        outer: 'renderElement',
        ownerCt: 'parent',
        update: 'setHtml'
    });
    //</deprecated>
});

})(Ext.baseCSSPrefix);
