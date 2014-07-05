//@tag dom,core
//@define Ext.Element-all
//@define Ext.Element

/**
 * Encapsulates a DOM element, adding simple DOM manipulation facilities, normalizing for browser differences.
 *
 * All instances of this class inherit the methods of Ext.Fx making visual effects easily available to all DOM elements.
 *
 * Note that the events documented in this class are not Ext events, they encapsulate browser events. To access the
 * underlying browser event, see {@link Ext.EventObject#browserEvent}. Some older browsers may not support the full range of
 * events. Which events are supported is beyond the control of Sencha Touch.
 *
 * ## Usage
 *
 *     // by id
 *     var el = Ext.get("my-div");
 *
 *     // by DOM element reference
 *     var el = Ext.get(myDivElement);
 *
 * ## Composite (Collections of) Elements
 *
 * For working with collections of Elements, see {@link Ext.CompositeElement}.
 *
 * @mixins Ext.mixin.Observable
 */
Ext.define('Ext.dom.Element', {
    alternateClassName: 'Ext.Element',

    mixins: [
        'Ext.mixin.Identifiable'
    ],

    requires: [
        'Ext.dom.Query',
        'Ext.dom.Helper'
    ],

    observableType: 'element',

    xtype: 'element',

    statics: {
        CREATE_ATTRIBUTES: {
            style: 'style',
            className: 'className',
            cls: 'cls',
            classList: 'classList',
            text: 'text',
            hidden: 'hidden',
            html: 'html',
            children: 'children'
        },

        create: function(attributes, domNode) {
            var ATTRIBUTES = this.CREATE_ATTRIBUTES,
                element, elementStyle, tag, value, name, i, ln;

            if (!attributes) {
                attributes = {};
            }

            if (attributes.isElement) {
                return attributes.dom;
            }
            else if ('nodeType' in attributes) {
                return attributes;
            }

            if (typeof attributes == 'string') {
                return document.createTextNode(attributes);
            }

            tag = attributes.tag;

            if (!tag) {
                tag = 'div';
            }
            if (attributes.namespace) {
                element = document.createElementNS(attributes.namespace, tag);
            } else {
                element = document.createElement(tag);
            }
            elementStyle = element.style;

            for (name in attributes) {
                if (name != 'tag') {
                    value = attributes[name];

                    switch (name) {
                        case ATTRIBUTES.style:
                                if (typeof value == 'string') {
                                    element.setAttribute(name, value);
                                }
                                else {
                                    for (i in value) {
                                        if (value.hasOwnProperty(i)) {
                                            elementStyle[i] = value[i];
                                        }
                                    }
                                }
                            break;

                        case ATTRIBUTES.className:
                        case ATTRIBUTES.cls:
                            element.className = value;
                            break;

                        case ATTRIBUTES.classList:
                            element.className = value.join(' ');
                            break;

                        case ATTRIBUTES.text:
                            element.textContent = value;
                            break;

                        case ATTRIBUTES.hidden:
                            if (value) {
                                element.style.display = 'none';
                            }
                            break;

                        case ATTRIBUTES.html:
                            element.innerHTML = value;
                            break;

                        case ATTRIBUTES.children:
                            for (i = 0,ln = value.length; i < ln; i++) {
                                element.appendChild(this.create(value[i], true));
                            }
                            break;

                        default:
                            element.setAttribute(name, value);
                    }
                }
            }

            if (domNode) {
                return element;
            }
            else {
                return this.get(element);
            }
        },

        documentElement: null,

        cache: {},

        /**
         * Retrieves Ext.dom.Element objects. {@link Ext#get} is alias for {@link Ext.dom.Element#get}.
         *
         * **This method does not retrieve {@link Ext.Element Element}s.** This method retrieves Ext.dom.Element
         * objects which encapsulate DOM elements. To retrieve a Element by its ID, use {@link Ext.ElementManager#get}.
         *
         * Uses simple caching to consistently return the same object. Automatically fixes if an object was recreated with
         * the same id via AJAX or DOM.
         *
         * @param {String/HTMLElement/Ext.Element} el The `id` of the node, a DOM Node or an existing Element.
         * @return {Ext.dom.Element} The Element object (or `null` if no matching element was found).
         * @static
         * @inheritable
         */
        get: function(element) {
            var cache = this.cache,
                instance, dom, id;

            if (!element) {
                return null;
            }

            if (typeof element == 'string') {
                if (cache.hasOwnProperty(element)) {
                    return cache[element];
                }

                if (!(dom = document.getElementById(element))) {
                    return null;
                }

                cache[element] = instance = new this(dom);

                return instance;
            }

            if ('tagName' in element) { // dom element
                id = element.id;

                if (cache.hasOwnProperty(id)) {
                    return cache[id];
                }

                instance = new this(element);
                cache[instance.getId()] = instance;

                return instance;
            }

            if (element.isElement) {
                return element;
            }

            if (element.isComposite) {
                return element;
            }

            if (Ext.isArray(element)) {
                return this.select(element);
            }

            if (element === document) {
                // create a bogus element object representing the document object
                if (!this.documentElement) {
                    this.documentElement = new this(document.documentElement);
                    this.documentElement.setId('ext-application');
                }

                return this.documentElement;
            }

            return null;
        },

        data: function(element, key, value) {
            var cache = Ext.cache,
                id, data;

            element = this.get(element);

            if (!element) {
                return null;
            }

            id = element.id;

            data = cache[id].data;

            if (!data) {
                cache[id].data = data = {};
            }

            if (arguments.length == 2) {
                return data[key];
            }
            else {
                return (data[key] = value);
            }
        }
    },

    isElement: true,


    /**
     * @event painted
     * Fires whenever this Element actually becomes visible (painted) on the screen. This is useful when you need to
     * perform 'read' operations on the DOM element, i.e: calculating natural sizes and positioning.
     *
     * __Note:__ This event is not available to be used with event delegation. Instead `painted` only fires if you explicitly
     * add at least one listener to it, for performance reasons.
     *
     * @param {Ext.Element} this The component instance.
     */

    /**
     * @event resize
     * Important note: For the best performance on mobile devices, use this only when you absolutely need to monitor
     * a Element's size.
     *
     * __Note:__ This event is not available to be used with event delegation. Instead `resize` only fires if you explicitly
     * add at least one listener to it, for performance reasons.
     *
     * @param {Ext.Element} this The component instance.
     */

    constructor: function(dom) {
        if (typeof dom == 'string') {
            dom = document.getElementById(dom);
        }

        if (!dom) {
            throw new Error("Invalid domNode reference or an id of an existing domNode: " + dom);
        }

        /**
         * The DOM element
         * @property dom
         * @type HTMLElement
         */
        this.dom = dom;

        this.getUniqueId();
    },

    attach: function (dom) {
        this.dom = dom;
        this.id = dom.id;
        return this;
    },

    getUniqueId: function() {
        var id = this.id,
            dom;

        if (!id) {
            dom = this.dom;

            if (dom.id.length > 0) {
                this.id = id = dom.id;
            }
            else {
                dom.id = id = this.mixins.identifiable.getUniqueId.call(this);
            }

            this.self.cache[id] = this;
        }

        return id;
    },

    setId: function(id) {
        var currentId = this.id,
            cache = this.self.cache;

        if (currentId) {
            delete cache[currentId];
        }

        this.dom.id = id;

        /**
         * The DOM element ID
         * @property id
         * @type String
         */
        this.id = id;

        cache[id] = this;

        return this;
    },

    /**
     * Sets the `innerHTML` of this element.
     * @param {String} html The new HTML.
     */
    setHtml: function(html) {
        this.dom.innerHTML = html;
    },

    /**
     * Returns the `innerHTML` of an element.
     * @return {String}
     */
    getHtml: function() {
        return this.dom.innerHTML;
    },

    setText: function(text) {
        this.dom.textContent = text;
    },

    redraw: function() {
        var dom = this.dom,
            domStyle = dom.style;

        domStyle.display = 'none';
        dom.offsetHeight;
        domStyle.display = '';
    },

    isPainted: function() {
        var dom = this.dom;
        return Boolean(dom && dom.offsetParent);
    },

    /**
     * Sets the passed attributes as attributes of this element (a style attribute can be a string, object or function).
     * @param {Object} attributes The object with the attributes.
     * @param {Boolean} [useSet=true] `false` to override the default `setAttribute` to use expandos.
     * @return {Ext.dom.Element} this
     */
    set: function(attributes, useSet) {
        var dom = this.dom,
            attribute, value;

        for (attribute in attributes) {
            if (attributes.hasOwnProperty(attribute)) {
                value = attributes[attribute];

                if (attribute == 'style') {
                    this.applyStyles(value);
                }
                else if (attribute == 'cls') {
                    dom.className = value;
                }
                else if (useSet !== false) {
                    if (value === undefined) {
                        dom.removeAttribute(attribute);
                    } else {
                        dom.setAttribute(attribute, value);
                    }
                }
                else {
                    dom[attribute] = value;
                }
            }
        }

        return this;
    },

    /**
     * Returns `true` if this element matches the passed simple selector (e.g. 'div.some-class' or 'span:first-child').
     * @param {String} selector The simple selector to test.
     * @return {Boolean} `true` if this element matches the selector, else `false`.
     */
    is: function(selector) {
        return Ext.DomQuery.is(this.dom, selector);
    },

    /**
     * Returns the value of the `value` attribute.
     * @param {Boolean} asNumber `true` to parse the value as a number.
     * @return {String/Number}
     */
    getValue: function(asNumber) {
        var value = this.dom.value;

        return asNumber ? parseInt(value, 10) : value;
    },

    /**
     * Returns the value of an attribute from the element's underlying DOM node.
     * @param {String} name The attribute name.
     * @param {String} [namespace] The namespace in which to look for the attribute.
     * @return {String} The attribute value.
     */
    getAttribute: function(name, namespace) {
        var dom = this.dom;

        return dom.getAttributeNS(namespace, name) || dom.getAttribute(namespace + ":" + name)
               || dom.getAttribute(name) || dom[name];
    },

    setSizeState: function(state) {
        var classes = ['x-sized', 'x-unsized', 'x-stretched'],
            states = [true, false, null],
            index = states.indexOf(state),
            addedClass;

        if (index !== -1) {
            addedClass = classes[index];
            classes.splice(index, 1);
            this.addCls(addedClass);
        }

        this.removeCls(classes);

        return this;
    },

    /**
     * Removes this element's DOM reference. Note that event and cache removal is handled at {@link Ext#removeNode}
     */
    destroy: function() {
        this.isDestroyed = true;

        var cache = Ext.Element.cache,
            dom = this.dom;

        if (dom && dom.parentNode && dom.tagName != 'BODY') {
            dom.parentNode.removeChild(dom);
        }

        delete cache[this.id];
        delete this.dom;
    }

}, function(Element) {
    Ext.elements = Ext.cache = Element.cache;

    this.addStatics({
        Fly: new Ext.Class({
            extend: Element,

            constructor: function(dom) {
                this.dom = dom;
            }
        }),

        _flyweights: {},

        /**
         * Gets the globally shared flyweight Element, with the passed node as the active element. Do not store a reference
         * to this element - the dom node can be overwritten by other code. {@link Ext#fly} is alias for
         * {@link Ext.dom.Element#fly}.
         *
         * Use this to make one-time references to DOM elements which are not going to be accessed again either by
         * application code, or by Ext's classes. If accessing an element which will be processed regularly, then {@link
         * Ext#get Ext.get} will be more appropriate to take advantage of the caching provided by the {@link Ext.dom.Element}
         * class.
         *
         * @param {String/HTMLElement} element The DOM node or `id`.
         * @param {String} [named] Allows for creation of named reusable flyweights to prevent conflicts (e.g.
         * internally Ext uses "_global").
         * @return {Ext.dom.Element} The shared Element object (or `null` if no matching element was found).
         * @static
         */
        fly: function(element, named) {
            var fly = null,
                flyweights = Element._flyweights,
                cachedElement;

            named = named || '_global';

            element = Ext.getDom(element);

            if (element) {
                fly = flyweights[named] || (flyweights[named] = new Element.Fly());
                fly.dom = element;
                fly.isSynchronized = false;
                cachedElement = Ext.cache[element.id];
                if (cachedElement && cachedElement.isElement) {
                    cachedElement.isSynchronized = false;
                }
            }

            return fly;
        }
    });

    /**
     * @member Ext
     * @method get
     * @alias Ext.dom.Element#get
     */
    Ext.get = function(element) {
        return Element.get.call(Element, element);
    };

    /**
     * @member Ext
     * @method fly
     * @alias Ext.dom.Element#fly
     */
    Ext.fly = function() {
        return Element.fly.apply(Element, arguments);
    };

    Ext.ClassManager.onCreated(function() {
        Element.mixin('observable', Ext.mixin.Observable);
    }, null, 'Ext.mixin.Observable');

    //<deprecated product=touch since=2.0>
    Ext.deprecateClassMethod(this, {
        /**
         * @member Ext.dom.Element
         * @method remove
         * @inheritdoc Ext.dom.Element#destroy
         * @deprecated 2.0.0 Please use {@link #destroy} instead.
         */
        remove: 'destroy',
        /**
         * @member Ext.dom.Element
         * @method setHTML
         * @inheritdoc Ext.dom.Element#setHtml
         * @deprecated 2.0.0 Please use {@link #setHtml} instead.
         */
        setHTML: 'setHtml',
        /**
         * @member Ext.dom.Element
         * @method update
         * @inheritdoc Ext.dom.Element#setHtml
         * @deprecated 2.0.0 Please use {@link #setHtml} instead.
         */
        update: 'setHtml',
        /**
         * @member Ext.dom.Element
         * @method getHTML
         * @inheritdoc Ext.dom.Element#getHtml
         * @deprecated 2.0.0 Please use {@link #getHtml} instead.
         */
        getHTML: 'getHtml',
        /**
         * @member Ext.dom.Element
         * @method purgeAllListeners
         * @inheritdoc Ext.dom.Element#clearListeners
         * @deprecated 2.0.0 Please use {@link #clearListeners} instead.
         */
        purgeAllListeners: 'clearListeners',
        /**
         * @member Ext.dom.Element
         * @method removeAllListeners
         * @inheritdoc Ext.dom.Element#clearListeners
         * @deprecated 2.0.0 Please use {@link #clearListeners} instead.
         */
        removeAllListeners: 'clearListeners'
    });

    /**
     * @member Ext.dom.Element
     * @method cssTranslate
     * Translates an element using CSS 3 in 2D.
     * @removed 2.0.0
     */
    Ext.deprecateMethod(Ext.dom.Element, 'cssTranslate', null, "Ext.dom.Element.cssTranslate() has been removed");

    /**
     * @member Ext.dom.Element
     * @method getOuterHeight
     * Retrieves the height of the element account for the top and bottom margins.
     * @removed 2.0.0
     */
    Ext.deprecateMethod(Ext.dom.Element, 'getOuterHeight', null, "Ext.dom.Element.getOuterHeight() has been removed");

    /**
     * @member Ext.dom.Element
     * @method getOuterWidth
     * Retrieves the width of the element accounting for the left and right margins.
     * @removed 2.0.0
     */
    Ext.deprecateMethod(Ext.dom.Element, 'getOuterWidth', null, "Ext.dom.Element.getOuterWidth() has been removed");

    /**
     * @member Ext.dom.Element
     * @method getScrollParent
     * Gets the Scroller instance of the first parent that has one.
     * @removed 2.0.0
     */
    Ext.deprecateMethod(Ext.dom.Element, 'getScrollParent', null, "Ext.dom.Element.getScrollParent() has been removed");

    /**
     * @member Ext.dom.Element
     * @method isDescendent
     * Determines if this element is a descendant of the passed in Element.
     * @removed 2.0.0
     */
    Ext.deprecateMethod(Ext.dom.Element, 'isDescendent', null, "Ext.dom.Element.isDescendent() has been removed");

    /**
     * @member Ext.dom.Element
     * @method mask
     * Puts a mask over this element to disable user interaction.
     * @removed 2.0.0
     */
    Ext.deprecateMethod(Ext.dom.Element, 'mask', null, "Ext.dom.Element.mask() has been removed");

    /**
     * @member Ext.dom.Element
     * @method setTopLeft
     * Sets the element's top and left positions directly using CSS style.
     * @removed 2.0.0
     */
    Ext.deprecateMethod(Ext.dom.Element, 'setTopLeft', null, "Ext.dom.Element.setTopLeft() has been removed");

    /**
     * @member Ext.dom.Element
     * @method unmask
     * Removes a previously applied mask.
     * @removed 2.0.0
     */
    Ext.deprecateMethod(Ext.dom.Element, 'unmask', null, "Ext.dom.Element.unmask() has been removed");
    //</deprecated>

});
