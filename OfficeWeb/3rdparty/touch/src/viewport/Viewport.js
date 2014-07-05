/**
 * This class acts as a factory for environment-specific viewport implementations.
 *
 * Please refer to the {@link Ext.Viewport} documentation about using the global instance.
 * @private
 */
Ext.define('Ext.viewport.Viewport', {
    requires: [
        'Ext.viewport.Ios',
        'Ext.viewport.Android'
    ],

    constructor: function(config) {
        var osName = Ext.os.name,
            viewportName, viewport;

        switch (osName) {
            case 'Android':
                viewportName = (Ext.browser.name == 'ChromeMobile') ? 'Default' : 'Android';
                break;
            case 'iOS':
                viewportName = 'Ios';
                break;
            default:
                viewportName = 'Default';
        }

        viewport = Ext.create('Ext.viewport.' + viewportName, config);

        return viewport;
    }
});

// Docs for the singleton instance created by above factory:

/**
 * @class Ext.Viewport
 * @extends Ext.viewport.Default
 * @singleton
 *
 * Ext.Viewport is a instance created when you use {@link Ext#setup}. Because {@link Ext.Viewport} extends from
 * {@link Ext.Container}, it has as {@link #layout} (which defaults to {@link Ext.layout.Card}). This means you
 * can add items to it at any time, from anywhere in your code. The {@link Ext.Viewport} {@link #cfg-fullscreen}
 * configuration is `true` by default, so it will take up your whole screen.
 *
 *     @example raw
 *     Ext.setup({
 *         onReady: function() {
 *             Ext.Viewport.add({
 *                 xtype: 'container',
 *                 html: 'My new container!'
 *             });
 *         }
 *     });
 *
 * If you want to customize anything about this {@link Ext.Viewport} instance, you can do so by adding a property
 * called `viewport` into your {@link Ext#setup} object:
 *
 *     @example raw
 *     Ext.setup({
 *         viewport: {
 *             layout: 'vbox'
 *         },
 *         onReady: function() {
 *             //do something
 *         }
 *     });
 *
 * **Note** if you use {@link Ext#onReady}, this instance of {@link Ext.Viewport} will **not** be created. Though, in most cases,
 * you should **not** use {@link Ext#onReady}.
 */
