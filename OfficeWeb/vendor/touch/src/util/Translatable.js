/**
 * The utility class to abstract different implementations to have the best performance when applying 2D translation
 * on any DOM element.
 *
 * @private
 */
Ext.define('Ext.util.Translatable', {
    requires: [
        'Ext.util.translatable.CssTransform',
        'Ext.util.translatable.ScrollPosition'
    ],

    constructor: function(config) {
        var namespace = Ext.util.translatable,
            CssTransform = namespace.CssTransform,
            ScrollPosition = namespace.ScrollPosition,
            classReference;

        if (typeof config == 'object' && 'translationMethod' in config) {
            if (config.translationMethod === 'scrollposition') {
                classReference = ScrollPosition;
            }
            else if (config.translationMethod === 'csstransform') {
                classReference = CssTransform;
            }
        }

        if (!classReference) {
            if (Ext.os.is.Android2 || Ext.browser.is.ChromeMobile) {
                classReference = ScrollPosition;
            }
            else {
                classReference = CssTransform;
            }
        }

        return new classReference(config);
    }
});
