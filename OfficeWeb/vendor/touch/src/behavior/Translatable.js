/**
 * @private
 */
Ext.define('Ext.behavior.Translatable', {

    extend: 'Ext.behavior.Behavior',

    requires: [
        'Ext.util.Translatable'
    ],

    setConfig: function(config) {
        var translatable = this.translatable,
            component = this.component;

        if (config) {
            if (!translatable) {
                this.translatable = translatable = new Ext.util.Translatable(config);
                translatable.setElement(component.renderElement);
                translatable.on('destroy', 'onTranslatableDestroy', this);
            }
            else if (Ext.isObject(config)) {
                translatable.setConfig(config);
            }
        }
        else if (translatable) {
            translatable.destroy();
        }

        return this;
    },

    getTranslatable: function() {
        return this.translatable;
    },

    onTranslatableDestroy: function() {
        delete this.translatable;
    },

    onComponentDestroy: function() {
        var translatable = this.translatable;

        if (translatable) {
            translatable.destroy();
        }
    }
});
