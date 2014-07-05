//@tag dom,core
//@define Ext.Element-all
//@define Ext.Element-traversal
//@require Ext.Element-style

/**
 * @class Ext.dom.Element
 */
Ext.dom.Element.addMembers({
    getParent: function() {
        return Ext.get(this.dom.parentNode);
    },

    getFirstChild: function() {
        return Ext.get(this.dom.firstElementChild);
    },

    /**
     * Returns `true` if this element is an ancestor of the passed element.
     * @param {HTMLElement/String} element The element to check.
     * @return {Boolean} `true` if this element is an ancestor of `el`, else `false`.
     */
    contains: function(element) {
        if (!element) {
            return false;
        }

        var dom = Ext.getDom(element);

        // we need el-contains-itself logic here because isAncestor does not do that:
        return (dom === this.dom) || this.self.isAncestor(this.dom, dom);
    },

    /**
     * Looks at this node and then at parent nodes for a match of the passed simple selector (e.g. 'div.some-class' or 'span:first-child')
     * @param {String} selector The simple selector to test.
     * @param {Number/String/HTMLElement/Ext.Element} maxDepth (optional)
     * The max depth to search as a number or element (defaults to `50 || document.body`)
     * @param {Boolean} returnEl (optional) `true` to return a Ext.Element object instead of DOM node.
     * @return {HTMLElement/null} The matching DOM node (or `null` if no match was found).
     */
    findParent: function(simpleSelector, maxDepth, returnEl) {
        var p = this.dom,
            b = document.body,
            depth = 0,
            stopEl;

        maxDepth = maxDepth || 50;
        if (isNaN(maxDepth)) {
            stopEl = Ext.getDom(maxDepth);
            maxDepth = Number.MAX_VALUE;
        }
        while (p && p.nodeType == 1 && depth < maxDepth && p != b && p != stopEl) {
            if (Ext.DomQuery.is(p, simpleSelector)) {
                return returnEl ? Ext.get(p) : p;
            }
            depth++;
            p = p.parentNode;
        }
        return null;
    },

    /**
     * Looks at parent nodes for a match of the passed simple selector (e.g. 'div.some-class' or 'span:first-child').
     * @param {String} selector The simple selector to test.
     * @param {Number/String/HTMLElement/Ext.Element} maxDepth (optional)
     * The max depth to search as a number or element (defaults to `10 || document.body`).
     * @param {Boolean} returnEl (optional) `true` to return a Ext.Element object instead of DOM node.
     * @return {HTMLElement/null} The matching DOM node (or `null` if no match was found).
     */
    findParentNode: function(simpleSelector, maxDepth, returnEl) {
        var p = Ext.fly(this.dom.parentNode, '_internal');
        return p ? p.findParent(simpleSelector, maxDepth, returnEl) : null;
    },

    /**
     * Walks up the dom looking for a parent node that matches the passed simple selector (e.g. 'div.some-class' or 'span:first-child').
     * This is a shortcut for `findParentNode()` that always returns an Ext.dom.Element.
     * @param {String} selector The simple selector to test
     * @param {Number/String/HTMLElement/Ext.Element} maxDepth (optional)
     * The max depth to search as a number or element (defaults to `10 || document.body`).
     * @return {Ext.dom.Element/null} The matching DOM node (or `null` if no match was found).
     */
    up: function(simpleSelector, maxDepth) {
        return this.findParentNode(simpleSelector, maxDepth, true);
    },

    select: function(selector, composite) {
        return Ext.dom.Element.select(selector, this.dom, composite);
    },

    /**
     * Selects child nodes based on the passed CSS selector (the selector should not contain an id).
     * @param {String} selector The CSS selector.
     * @return {HTMLElement[]} An array of the matched nodes.
     */
    query: function(selector) {
        return Ext.DomQuery.select(selector, this.dom);
    },

    /**
     * Selects a single child at any depth below this element based on the passed CSS selector (the selector should not contain an id).
     * @param {String} selector The CSS selector.
     * @param {Boolean} [returnDom=false] (optional) `true` to return the DOM node instead of Ext.dom.Element.
     * @return {HTMLElement/Ext.dom.Element} The child Ext.dom.Element (or DOM node if `returnDom` is `true`).
     */
    down: function(selector, returnDom) {
        var n = Ext.DomQuery.selectNode(selector, this.dom);
        return returnDom ? n : Ext.get(n);
    },

    /**
     * Selects a single *direct* child based on the passed CSS selector (the selector should not contain an id).
     * @param {String} selector The CSS selector.
     * @param {Boolean} [returnDom=false] (optional) `true` to return the DOM node instead of Ext.dom.Element.
     * @return {HTMLElement/Ext.dom.Element} The child Ext.dom.Element (or DOM node if `returnDom` is `true`)
     */
    child: function(selector, returnDom) {
        var node,
            me = this,
            id;
        id = Ext.get(me).id;
        // Escape . or :
        id = id.replace(/[\.:]/g, "\\$0");
        node = Ext.DomQuery.selectNode('#' + id + " > " + selector, me.dom);
        return returnDom ? node : Ext.get(node);
    },

     /**
     * Gets the parent node for this element, optionally chaining up trying to match a selector.
     * @param {String} selector (optional) Find a parent node that matches the passed simple selector.
     * @param {Boolean} returnDom (optional) `true` to return a raw DOM node instead of an Ext.dom.Element.
     * @return {Ext.dom.Element/HTMLElement/null} The parent node or `null`.
     */
    parent: function(selector, returnDom) {
        return this.matchNode('parentNode', 'parentNode', selector, returnDom);
    },

     /**
     * Gets the next sibling, skipping text nodes.
     * @param {String} selector (optional) Find the next sibling that matches the passed simple selector.
     * @param {Boolean} returnDom (optional) `true` to return a raw dom node instead of an Ext.dom.Element.
     * @return {Ext.dom.Element/HTMLElement/null} The next sibling or `null`.
     */
    next: function(selector, returnDom) {
        return this.matchNode('nextSibling', 'nextSibling', selector, returnDom);
    },

    /**
     * Gets the previous sibling, skipping text nodes.
     * @param {String} selector (optional) Find the previous sibling that matches the passed simple selector.
     * @param {Boolean} returnDom (optional) `true` to return a raw DOM node instead of an Ext.dom.Element
     * @return {Ext.dom.Element/HTMLElement/null} The previous sibling or `null`.
     */
    prev: function(selector, returnDom) {
        return this.matchNode('previousSibling', 'previousSibling', selector, returnDom);
    },


    /**
     * Gets the first child, skipping text nodes.
     * @param {String} selector (optional) Find the next sibling that matches the passed simple selector.
     * @param {Boolean} returnDom (optional) `true` to return a raw DOM node instead of an Ext.dom.Element.
     * @return {Ext.dom.Element/HTMLElement/null} The first child or `null`.
     */
    first: function(selector, returnDom) {
        return this.matchNode('nextSibling', 'firstChild', selector, returnDom);
    },

    /**
     * Gets the last child, skipping text nodes.
     * @param {String} selector (optional) Find the previous sibling that matches the passed simple selector.
     * @param {Boolean} returnDom (optional) `true` to return a raw DOM node instead of an Ext.dom.Element.
     * @return {Ext.dom.Element/HTMLElement/null} The last child or `null`.
     */
    last: function(selector, returnDom) {
        return this.matchNode('previousSibling', 'lastChild', selector, returnDom);
    },

    matchNode: function(dir, start, selector, returnDom) {
        if (!this.dom) {
            return null;
        }

        var n = this.dom[start];
        while (n) {
            if (n.nodeType == 1 && (!selector || Ext.DomQuery.is(n, selector))) {
                return !returnDom ? Ext.get(n) : n;
            }
            n = n[dir];
        }
        return null;
    },

    isAncestor: function(element) {
        return this.self.isAncestor.call(this.self, this.dom, element);
    }
});
