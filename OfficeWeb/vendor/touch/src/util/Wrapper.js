/**
 *
 */
Ext.define('Ext.util.Wrapper', {
    mixins: ['Ext.mixin.Bindable'],

    constructor: function(elementConfig, wrappedElement) {
        var element = this.link('element', Ext.Element.create(elementConfig));

        if (wrappedElement) {
            element.insertBefore(wrappedElement);
            this.wrap(wrappedElement);
        }
    },

    bindSize: function(sizeName) {
        var wrappedElement = this.wrappedElement,
            boundMethodName;

        this.boundSizeName = sizeName;
        this.boundMethodName = boundMethodName = sizeName === 'width' ? 'setWidth' : 'setHeight';

        this.bind(wrappedElement, boundMethodName, 'onBoundSizeChange');
        wrappedElement[boundMethodName].call(wrappedElement, wrappedElement.getStyleValue(sizeName));
    },

    onBoundSizeChange: function(size, args) {
        var element = this.element;

        if (typeof size === 'string' && size.substr(-1) === '%') {
            args[0] = '100%';
        }
        else {
            size = '';
        }

        element[this.boundMethodName].call(element, size);
    },

    wrap: function(wrappedElement) {
        var element = this.element,
            innerDom;

        this.wrappedElement = wrappedElement;

        innerDom = element.dom;

        while (innerDom.firstElementChild !== null) {
            innerDom = innerDom.firstElementChild;
        }

        innerDom.appendChild(wrappedElement.dom);
    },

    destroy: function() {
        var element = this.element,
            dom = element.dom,
            wrappedElement = this.wrappedElement,
            boundMethodName = this.boundMethodName,
            parentNode = dom.parentNode,
            size;

        if (boundMethodName) {
            this.unbind(wrappedElement, boundMethodName, 'onBoundSizeChange');
            size = element.getStyle(this.boundSizeName);

            if (size) {
                wrappedElement[boundMethodName].call(wrappedElement, size);
            }
        }

        if (parentNode) {
            if (!wrappedElement.isDestroyed) {
                parentNode.replaceChild(dom.firstElementChild, dom);
            }
            delete this.wrappedElement;
        }

        this.callSuper();
    }
});
