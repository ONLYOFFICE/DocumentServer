//@tag dom,core
//@define Ext.Element-all
//@define Ext.Element-insertion
//@require Ext.Element-alignment

/**
 * @class Ext.dom.Element
 */
Ext.dom.Element.addMembers({

    /**
     * Appends the passed element(s) to this element.
     * @param {HTMLElement/Ext.dom.Element} element a DOM Node or an existing Element.
     * @return {Ext.dom.Element} This element.
     */
    appendChild: function(element) {
        this.dom.appendChild(Ext.getDom(element));

        return this;
    },

    removeChild: function(element) {
        this.dom.removeChild(Ext.getDom(element));

        return this;
    },

    append: function() {
        this.appendChild.apply(this, arguments);
    },

    /**
     * Appends this element to the passed element.
     * @param {String/HTMLElement/Ext.dom.Element} el The new parent element.
     * The id of the node, a DOM Node or an existing Element.
     * @return {Ext.dom.Element} This element.
     */
    appendTo: function(el) {
        Ext.getDom(el).appendChild(this.dom);
        return this;
    },

    /**
     * Inserts this element before the passed element in the DOM.
     * @param {String/HTMLElement/Ext.dom.Element} el The element before which this element will be inserted.
     * The id of the node, a DOM Node or an existing Element.
     * @return {Ext.dom.Element} This element.
     */
    insertBefore: function(el) {
        el = Ext.getDom(el);
        el.parentNode.insertBefore(this.dom, el);
        return this;
    },

    /**
     * Inserts this element after the passed element in the DOM.
     * @param {String/HTMLElement/Ext.dom.Element} el The element to insert after.
     * The `id` of the node, a DOM Node or an existing Element.
     * @return {Ext.dom.Element} This element.
     */
    insertAfter: function(el) {
        el = Ext.getDom(el);
        el.parentNode.insertBefore(this.dom, el.nextSibling);
        return this;
    },


    /**
     * Inserts an element as the first child of this element.
     * @param {String/HTMLElement/Ext.dom.Element} element The `id` or element to insert.
     * @return {Ext.dom.Element} this
     */
    insertFirst: function(element) {
        var elementDom = Ext.getDom(element),
            dom = this.dom,
            firstChild = dom.firstChild;

        if (!firstChild) {
            dom.appendChild(elementDom);
        }
        else {
            dom.insertBefore(elementDom, firstChild);
        }

        return this;
    },

    /**
     * Inserts (or creates) the passed element (or DomHelper config) as a sibling of this element
     * @param {String/HTMLElement/Ext.dom.Element/Object/Array} el The id, element to insert or a DomHelper config
     * to create and insert *or* an array of any of those.
     * @param {String} [where=before] (optional) 'before' or 'after'.
     * @param {Boolean} returnDom (optional) `true` to return the raw DOM element instead of Ext.dom.Element.
     * @return {Ext.dom.Element} The inserted Element. If an array is passed, the last inserted element is returned.
     */
    insertSibling: function(el, where, returnDom) {
        var me = this, rt,
            isAfter = (where || 'before').toLowerCase() == 'after',
            insertEl;

        if (Ext.isArray(el)) {
            insertEl = me;
            Ext.each(el, function(e) {
                rt = Ext.fly(insertEl, '_internal').insertSibling(e, where, returnDom);
                if (isAfter) {
                    insertEl = rt;
                }
            });
            return rt;
        }

        el = el || {};

        if (el.nodeType || el.dom) {
            rt = me.dom.parentNode.insertBefore(Ext.getDom(el), isAfter ? me.dom.nextSibling : me.dom);
            if (!returnDom) {
                rt = Ext.get(rt);
            }
        } else {
            if (isAfter && !me.dom.nextSibling) {
                rt = Ext.core.DomHelper.append(me.dom.parentNode, el, !returnDom);
            } else {
                rt = Ext.core.DomHelper[isAfter ? 'insertAfter' : 'insertBefore'](me.dom, el, !returnDom);
            }
        }
        return rt;
    },

    /**
     * Replaces the passed element with this element.
     * @param {String/HTMLElement/Ext.dom.Element} el The element to replace.
     * The id of the node, a DOM Node or an existing Element.
     * @return {Ext.dom.Element} This element.
     */
    replace: function(element) {
        element = Ext.getDom(element);

        element.parentNode.replaceChild(this.dom, element);

        return this;
    },

    /**
     * Replaces this element with the passed element.
     * @param {String/HTMLElement/Ext.dom.Element/Object} el The new element (id of the node, a DOM Node
     * or an existing Element) or a DomHelper config of an element to create.
     * @return {Ext.dom.Element} This element.
     */
    replaceWith: function(el) {
        var me = this;

        if (el.nodeType || el.dom || typeof el == 'string') {
            el = Ext.get(el);
            me.dom.parentNode.insertBefore(el, me.dom);
        } else {
            el = Ext.core.DomHelper.insertBefore(me.dom, el);
        }

        delete Ext.cache[me.id];
        Ext.removeNode(me.dom);
        me.id = Ext.id(me.dom = el);
        Ext.dom.Element.addToCache(me.isFlyweight ? new Ext.dom.Element(me.dom) : me);
        return me;
    },

    doReplaceWith: function(element) {
        var dom = this.dom;
        dom.parentNode.replaceChild(Ext.getDom(element), dom);
    },

    /**
     * Creates the passed DomHelper config and appends it to this element or optionally inserts it before the passed child element.
     * @param {Object} config DomHelper element config object.  If no tag is specified (e.g., `{tag:'input'}`) then a div will be
     * automatically generated with the specified attributes.
     * @param {HTMLElement} insertBefore (optional) a child element of this element.
     * @param {Boolean} returnDom (optional) `true` to return the dom node instead of creating an Element.
     * @return {Ext.dom.Element} The new child element.
     */
    createChild: function(config, insertBefore, returnDom) {
        config = config || {tag: 'div'};
        if (insertBefore) {
            return Ext.core.DomHelper.insertBefore(insertBefore, config, returnDom !== true);
        }
        else {
            return Ext.core.DomHelper[!this.dom.firstChild ? 'insertFirst' : 'append'](this.dom, config, returnDom !== true);
        }
    },

    /**
     * Creates and wraps this element with another element.
     * @param {Object} [config] (optional) DomHelper element config object for the wrapper element or `null` for an empty div
     * @param {Boolean} [domNode] (optional) `true` to return the raw DOM element instead of Ext.dom.Element.
     * @return {HTMLElement/Ext.dom.Element} The newly created wrapper element.
     */
    wrap: function(config, domNode) {
        var dom = this.dom,
            wrapper = this.self.create(config, domNode),
            wrapperDom = (domNode) ? wrapper : wrapper.dom,
            parentNode = dom.parentNode;

        if (parentNode) {
            parentNode.insertBefore(wrapperDom, dom);
        }

        wrapperDom.appendChild(dom);

        return wrapper;
    },

    wrapAllChildren: function(config) {
        var dom = this.dom,
            children = dom.childNodes,
            wrapper = this.self.create(config),
            wrapperDom = wrapper.dom;

        while (children.length > 0) {
            wrapperDom.appendChild(dom.firstChild);
        }

        dom.appendChild(wrapperDom);

        return wrapper;
    },

    unwrapAllChildren: function() {
        var dom = this.dom,
            children = dom.childNodes,
            parentNode = dom.parentNode;

        if (parentNode) {
            while (children.length > 0) {
                parentNode.insertBefore(dom, dom.firstChild);
            }

            this.destroy();
        }
    },

    unwrap: function() {
        var dom = this.dom,
            parentNode = dom.parentNode,
            grandparentNode;

        if (parentNode) {
            grandparentNode = parentNode.parentNode;
            grandparentNode.insertBefore(dom, parentNode);
            grandparentNode.removeChild(parentNode);
        }
        else {
            grandparentNode = document.createDocumentFragment();
            grandparentNode.appendChild(dom);
        }

        return this;
    },

    detach: function() {
        var dom = this.dom;

        if (dom && dom.parentNode && dom.tagName !== 'BODY') {
            dom.parentNode.removeChild(dom);
        }

        return this;
    },

    /**
     * Inserts an HTML fragment into this element.
     * @param {String} where Where to insert the HTML in relation to this element - 'beforeBegin', 'afterBegin', 'beforeEnd', 'afterEnd'.
     * See {@link Ext.DomHelper#insertHtml} for details.
     * @param {String} html The HTML fragment
     * @param {Boolean} [returnEl=false] (optional) `true` to return an Ext.dom.Element.
     * @return {HTMLElement/Ext.dom.Element} The inserted node (or nearest related if more than 1 inserted).
     */
    insertHtml: function(where, html, returnEl) {
        var el = Ext.core.DomHelper.insertHtml(where, this.dom, html);
        return returnEl ? Ext.get(el) : el;
    }
});
