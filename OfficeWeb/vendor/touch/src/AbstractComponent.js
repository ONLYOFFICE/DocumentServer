/**
 * @private
 * This is the abstract class for {@link Ext.Component}.
 *
 * This should never be overridden.
 */
Ext.define('Ext.AbstractComponent', {
    extend: 'Ext.Evented',

    onClassExtended: function(Class, members) {
        if (!members.hasOwnProperty('cachedConfig')) {
            return;
        }

        var prototype = Class.prototype,
            config = members.config,
            cachedConfig = members.cachedConfig,
            cachedConfigList = prototype.cachedConfigList,
            hasCachedConfig = prototype.hasCachedConfig,
            name, value;

        delete members.cachedConfig;

        prototype.cachedConfigList = cachedConfigList = (cachedConfigList) ? cachedConfigList.slice() : [];
        prototype.hasCachedConfig = hasCachedConfig = (hasCachedConfig) ? Ext.Object.chain(hasCachedConfig) : {};

        if (!config) {
            members.config = config = {};
        }

        for (name in cachedConfig) {
            if (cachedConfig.hasOwnProperty(name)) {
                value = cachedConfig[name];

                if (!hasCachedConfig[name]) {
                    hasCachedConfig[name] = true;
                    cachedConfigList.push(name);
                }

                config[name] = value;
            }
        }
    },

    getElementConfig: Ext.emptyFn,

    referenceAttributeName: 'reference',

    referenceSelector: '[reference]',

    /**
     * @private
     * Significantly improve instantiation time for Component with multiple references
     * Ext.Element instance of the reference domNode is only created the very first time
     * it's ever used.
     */
    addReferenceNode: function(name, domNode) {
        Ext.Object.defineProperty(this, name, {
            get: function() {
                var reference;

                delete this[name];
                this[name] = reference = new Ext.Element(domNode);
                return reference;
            },
            configurable: true
        });
    },

    initElement: function() {
        var prototype = this.self.prototype,
            id = this.getId(),
            referenceList = [],
            cleanAttributes = true,
            referenceAttributeName = this.referenceAttributeName,
            needsOptimization = false,
            renderTemplate, renderElement, element,
            referenceNodes, i, ln, referenceNode, reference,
            configNameCache, defaultConfig, cachedConfigList, initConfigList, initConfigMap, configList,
            elements, name, nameMap, internalName;

        if (prototype.hasOwnProperty('renderTemplate')) {
            renderTemplate = this.renderTemplate.cloneNode(true);
            renderElement = renderTemplate.firstChild;
        }
        else {
            cleanAttributes = false;
            needsOptimization = true;
            renderTemplate = document.createDocumentFragment();
            renderElement = Ext.Element.create(this.getElementConfig(), true);
            renderTemplate.appendChild(renderElement);
        }

        referenceNodes = renderTemplate.querySelectorAll(this.referenceSelector);

        for (i = 0,ln = referenceNodes.length; i < ln; i++) {
            referenceNode = referenceNodes[i];
            reference = referenceNode.getAttribute(referenceAttributeName);

            if (cleanAttributes) {
                referenceNode.removeAttribute(referenceAttributeName);
            }

            if (reference == 'element') {
                referenceNode.id = id;
                this.element = element = new Ext.Element(referenceNode);
            }
            else {
                this.addReferenceNode(reference, referenceNode);
            }

            referenceList.push(reference);
        }

        this.referenceList = referenceList;

        if (!this.innerElement) {
            this.innerElement = element;
        }

        if (!this.bodyElement) {
            this.bodyElement = this.innerElement;
        }

        if (renderElement === element.dom) {
            this.renderElement = element;
        }
        else {
            this.addReferenceNode('renderElement', renderElement);
        }

        // This happens only *once* per class, during the very first instantiation
        // to optimize renderTemplate based on cachedConfig
        if (needsOptimization) {
            configNameCache = Ext.Class.configNameCache;
            defaultConfig = this.config;
            cachedConfigList = this.cachedConfigList;
            initConfigList = this.initConfigList;
            initConfigMap = this.initConfigMap;
            configList = [];

            for (i = 0,ln = cachedConfigList.length; i < ln; i++) {
                name = cachedConfigList[i];
                nameMap = configNameCache[name];

                if (initConfigMap[name]) {
                    initConfigMap[name] = false;
                    Ext.Array.remove(initConfigList, name);
                }

                if (defaultConfig[name] !== null) {
                    configList.push(name);
                    this[nameMap.get] = this[nameMap.initGet];
                }
            }

            for (i = 0,ln = configList.length; i < ln; i++) {
                name = configList[i];
                nameMap = configNameCache[name];
                internalName = nameMap.internal;

                this[internalName] = null;
                this[nameMap.set].call(this, defaultConfig[name]);
                delete this[nameMap.get];

                prototype[internalName] = this[internalName];
            }

            renderElement = this.renderElement.dom;
            prototype.renderTemplate = renderTemplate = document.createDocumentFragment();
            renderTemplate.appendChild(renderElement.cloneNode(true));

            elements = renderTemplate.querySelectorAll('[id]');

            for (i = 0,ln = elements.length; i < ln; i++) {
                element = elements[i];
                element.removeAttribute('id');
            }

            for (i = 0,ln = referenceList.length; i < ln; i++) {
                reference = referenceList[i];
                this[reference].dom.removeAttribute('reference');
            }
        }

        return this;
    }
});
