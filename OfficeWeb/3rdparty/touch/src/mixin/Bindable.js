/**
 *
 */
Ext.define('Ext.mixin.Bindable', {
    extend: 'Ext.mixin.Mixin',

    mixinConfig: {
        id: 'bindable'
    },

    bind: function(instance, boundMethod, bindingMethod, preventDefault) {
        if (!bindingMethod) {
            bindingMethod = boundMethod;
        }

        var boundFn = instance[boundMethod],
            fn;

        instance[boundMethod] = fn = function() {
            var binding = fn.$binding,
                scope = binding.bindingScope,
                args = Array.prototype.slice.call(arguments);

            args.push(arguments);

            if (!binding.preventDefault && scope[binding.bindingMethod].apply(scope, args) !== false) {
                return binding.boundFn.apply(this, arguments);
            }
        };
        fn.$binding = {
            preventDefault: !!preventDefault,
            boundFn: boundFn,
            bindingMethod: bindingMethod,
            bindingScope: this
        };

        return this;
    },

    unbind: function(instance, boundMethod, bindingMethod) {
        if (!bindingMethod) {
            bindingMethod = boundMethod;
        }

        var fn = instance[boundMethod],
            binding = fn.$binding,
            boundFn, currentBinding;

        while (binding) {
            boundFn = binding.boundFn;

            if (binding.bindingMethod === bindingMethod && binding.bindingScope === this) {
                if (currentBinding) {
                    currentBinding.boundFn = boundFn;
                }
                else {
                    instance[boundMethod] = boundFn;
                }

                return this;
            }

            currentBinding = binding;
            binding = binding.boundFn;
        }

        return this;
    }
});
