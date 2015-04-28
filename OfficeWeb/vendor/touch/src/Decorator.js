/**
 * @class Ext.Decorator
 * @extends Ext.Component
 *
 * In a few words, a Decorator is a Component that wraps around another Component. A typical example of a Decorator is a
 * {@link Ext.field.Field Field}. A form field is nothing more than a decorator around another component, and gives the
 * component a label, as well as extra styling to make it look good in a form.
 *
 * A Decorator can be thought of as a lightweight Container that has only one child item, and no layout overhead.
 * The look and feel of decorators can be styled purely in CSS.
 *
 * Another powerful feature that Decorator provides is config proxying. For example: all config items of a
 * {@link Ext.slider.Slider Slider} also exist in a {@link Ext.field.Slider Slider Field} for API convenience.
 * The {@link Ext.field.Slider Slider Field} simply proxies all corresponding getters and setters
 * to the actual {@link Ext.slider.Slider Slider} instance. Writing out all the setters and getters to do that is a tedious task
 * and a waste of code space. Instead, when you sub-class Ext.Decorator, all you need to do is to specify those config items
 * that you want to proxy to the Component using a special 'proxyConfig' class property. Here's how it may look like
 * in a Slider Field class:
 *
 *     Ext.define('My.field.Slider', {
 *         extend: 'Ext.Decorator',
 *
 *         config: {
 *             component: {
 *                 xtype: 'slider'
 *             }
 *         },
 *
 *         proxyConfig: {
 *             minValue: 0,
 *             maxValue: 100,
 *             increment: 1
 *         }
 *
 *         // ...
 *     });
 *
 * Once `My.field.Slider` class is created, it will have all setters and getters methods for all items listed in `proxyConfig`
 * automatically generated. These methods all proxy to the same method names that exist within the Component instance.
 */
Ext.define('Ext.Decorator', {
    extend: 'Ext.Component',

    isDecorator: true,

    config: {
        /**
         * @cfg {Object} component The config object to factory the Component that this Decorator wraps around
         */
        component: {}
    },

    statics: {
        generateProxySetter: function(name) {
            return function(value) {
                var component = this.getComponent();
                component[name].call(component, value);

                return this;
            }
        },
        generateProxyGetter: function(name) {
            return function() {
                var component = this.getComponent();
                return component[name].call(component);
            }
        }
    },

    onClassExtended: function(Class, members) {
        if (!members.hasOwnProperty('proxyConfig')) {
            return;
        }

        var ExtClass = Ext.Class,
            proxyConfig = members.proxyConfig,
            config = members.config;

        members.config = (config) ? Ext.applyIf(config, proxyConfig) : proxyConfig;

        var name, nameMap, setName, getName;

        for (name in proxyConfig) {
            if (proxyConfig.hasOwnProperty(name)) {
                nameMap = ExtClass.getConfigNameMap(name);
                setName = nameMap.set;
                getName = nameMap.get;

                members[setName] = this.generateProxySetter(setName);
                members[getName] = this.generateProxyGetter(getName);
            }
        }
    },

    // @private
    applyComponent: function(config) {
        return Ext.factory(config, Ext.Component);
    },

    // @private
    updateComponent: function(newComponent, oldComponent) {
        if (oldComponent) {
            if (this.isRendered() && oldComponent.setRendered(false)) {
                oldComponent.fireAction('renderedchange', [this, oldComponent, false],
                    'doUnsetComponent', this, { args: [oldComponent] });
            }
            else {
                this.doUnsetComponent(oldComponent);
            }
        }

        if (newComponent) {
            if (this.isRendered() && newComponent.setRendered(true)) {
                newComponent.fireAction('renderedchange', [this, newComponent, true],
                    'doSetComponent', this, { args: [newComponent] });
            }
            else {
                this.doSetComponent(newComponent);
            }
        }
    },

    // @private
    doUnsetComponent: function(component) {
        if (component.renderElement.dom) {
            component.setLayoutSizeFlags(0);
            this.innerElement.dom.removeChild(component.renderElement.dom);
        }
    },

    // @private
    doSetComponent: function(component) {
        if (component.renderElement.dom) {
            component.setLayoutSizeFlags(this.getSizeFlags());
            this.innerElement.dom.appendChild(component.renderElement.dom);
        }
    },

    // @private
    setRendered: function(rendered) {
        var component;

        if (this.callParent(arguments)) {
            component = this.getComponent();

            if (component) {
                component.setRendered(rendered);
            }

            return true;
        }

        return false;
    },

    // @private
    setDisabled: function(disabled) {
        this.callParent(arguments);
        this.getComponent().setDisabled(disabled);
    },

    destroy: function() {
        Ext.destroy(this.getComponent());
        this.callParent();
    }
});
