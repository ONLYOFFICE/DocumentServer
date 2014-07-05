//@require Ext.Class
//@require Ext.ClassManager
//@require Ext.Loader

/**
 * Base class for all mixins.
 * @private
 */
Ext.define('Ext.mixin.Mixin', {
    onClassExtended: function(cls, data) {
        var mixinConfig = data.mixinConfig,
            parentClassMixinConfig,
            beforeHooks, afterHooks;

        if (mixinConfig) {
            parentClassMixinConfig = cls.superclass.mixinConfig;

            if (parentClassMixinConfig) {
                mixinConfig = data.mixinConfig = Ext.merge({}, parentClassMixinConfig, mixinConfig);
            }

            data.mixinId = mixinConfig.id;

            beforeHooks = mixinConfig.beforeHooks;
            afterHooks = mixinConfig.hooks || mixinConfig.afterHooks;

            if (beforeHooks || afterHooks) {
                Ext.Function.interceptBefore(data, 'onClassMixedIn', function(targetClass) {
                    var mixin = this.prototype;

                    if (beforeHooks) {
                        Ext.Object.each(beforeHooks, function(from, to) {
                            targetClass.override(to, function() {
                                if (mixin[from].apply(this, arguments) !== false) {
                                    return this.callOverridden(arguments);
                                }
                            });
                        });
                    }

                    if (afterHooks) {
                        Ext.Object.each(afterHooks, function(from, to) {
                            targetClass.override(to, function() {
                                var ret = this.callOverridden(arguments);

                                mixin[from].apply(this, arguments);

                                return ret;
                            });
                        });
                    }
                });
            }
        }
    }
});
