//@tag dom,core
//@define Ext.Element-all
//@define Ext.Element-style
//@require Ext.Element-position

/**
 * @class Ext.dom.Element
 */

Ext.dom.Element.addMembers({
    WIDTH: 'width',
    HEIGHT: 'height',
    MIN_WIDTH: 'min-width',
    MIN_HEIGHT: 'min-height',
    MAX_WIDTH: 'max-width',
    MAX_HEIGHT: 'max-height',
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left',
    /**
     * @property VISIBILITY
     * Visibility mode constant for use with {@link #setVisibilityMode}. Use `visibility` to hide element.
     */
    VISIBILITY: 1,

    /**
     * @property DISPLAY
     * Visibility mode constant for use with {@link #setVisibilityMode}. Use `display` to hide element.
     */
    DISPLAY: 2,

    /**
     * @property OFFSETS
     * Visibility mode constant for use with {@link #setVisibilityMode}. Use offsets to hide element.
     */
    OFFSETS: 3,

    SEPARATOR: '-',

    trimRe: /^\s+|\s+$/g,
    wordsRe: /\w/g,
    spacesRe: /\s+/,
    styleSplitRe: /\s*(?::|;)\s*/,
    transparentRe: /^(?:transparent|(?:rgba[(](?:\s*\d+\s*[,]){3}\s*0\s*[)]))$/i,
    classNameSplitRegex: /[\s]+/,

    borders: {
        t: 'border-top-width',
        r: 'border-right-width',
        b: 'border-bottom-width',
        l: 'border-left-width'
    },

    paddings: {
        t: 'padding-top',
        r: 'padding-right',
        b: 'padding-bottom',
        l: 'padding-left'
    },

    margins: {
        t: 'margin-top',
        r: 'margin-right',
        b: 'margin-bottom',
        l: 'margin-left'
    },

    /**
     * @property {String} defaultUnit
     * The default unit to append to CSS values where a unit isn't provided.
     */
    defaultUnit: "px",

    isSynchronized: false,

    /**
     * @private
     */
    synchronize: function() {
        var dom = this.dom,
            hasClassMap = {},
            className = dom.className,
            classList, i, ln, name;

        if (className.length > 0) {
            classList = dom.className.split(this.classNameSplitRegex);

            for (i = 0, ln = classList.length; i < ln; i++) {
                name = classList[i];
                hasClassMap[name] = true;
            }
        }
        else {
            classList = [];
        }

        this.classList = classList;

        this.hasClassMap = hasClassMap;

        this.isSynchronized = true;

        return this;
    },

    /**
     * Adds the given CSS class(es) to this Element.
     * @param {String} names The CSS class(es) to add to this element.
     * @param {String} [prefix] (optional) Prefix to prepend to each class.
     * @param {String} [suffix] (optional) Suffix to append to each class.
     */
    addCls: function(names, prefix, suffix) {
        if (!names) {
            return this;
        }

        if (!this.isSynchronized) {
            this.synchronize();
        }

        var dom = this.dom,
            map = this.hasClassMap,
            classList = this.classList,
            SEPARATOR = this.SEPARATOR,
            i, ln, name;

        prefix = prefix ? prefix + SEPARATOR : '';
        suffix = suffix ? SEPARATOR + suffix : '';

        if (typeof names == 'string') {
            names = names.split(this.spacesRe);
        }

        for (i = 0, ln = names.length; i < ln; i++) {
            name = prefix + names[i] + suffix;

            if (!map[name]) {
                map[name] = true;
                classList.push(name);
            }
        }

        dom.className = classList.join(' ');

        return this;
    },

    /**
     * Removes the given CSS class(es) from this Element.
     * @param {String} names The CSS class(es) to remove from this element.
     * @param {String} [prefix=''] (optional) Prefix to prepend to each class to be removed.
     * @param {String} [suffix=''] (optional) Suffix to append to each class to be removed.
     */
    removeCls: function(names, prefix, suffix) {
        if (!names) {
            return this;
        }

        if (!this.isSynchronized) {
            this.synchronize();
        }

        if (!suffix) {
            suffix = '';
        }

        var dom = this.dom,
            map = this.hasClassMap,
            classList = this.classList,
            SEPARATOR = this.SEPARATOR,
            i, ln, name;

        prefix = prefix ? prefix + SEPARATOR : '';
        suffix = suffix ? SEPARATOR + suffix : '';

        if (typeof names == 'string') {
            names = names.split(this.spacesRe);
        }

        for (i = 0, ln = names.length; i < ln; i++) {
            name = prefix + names[i] + suffix;

            if (map[name]) {
                delete map[name];
                Ext.Array.remove(classList, name);
            }
        }

        dom.className = classList.join(' ');

        return this;
    },

    /**
     * Replaces a CSS class on the element with another.  If the old name does not exist, the new name will simply be added.
     * @param {String} oldClassName The CSS class to replace.
     * @param {String} newClassName The replacement CSS class.
     * @return {Ext.dom.Element} this
     */
    replaceCls: function(oldName, newName, prefix, suffix) {
        return this.removeCls(oldName, prefix, suffix).addCls(newName, prefix, suffix);
    },

    /**
     * Checks if the specified CSS class exists on this element's DOM node.
     * @param {String} className The CSS class to check for.
     * @return {Boolean} `true` if the class exists, else `false`.
     */
    hasCls: function(name) {
        if (!this.isSynchronized) {
            this.synchronize();
        }

        return this.hasClassMap.hasOwnProperty(name);
    },

    /**
     * Toggles the specified CSS class on this element (removes it if it already exists, otherwise adds it).
     * @param {String} className The CSS class to toggle.
     * @return {Ext.dom.Element} this
     */
    toggleCls: function(className, force){
        if (typeof force !== 'boolean') {
            force = !this.hasCls(className);
        }

   		return (force) ? this.addCls(className) : this.removeCls(className);
   	},

    /**
     * @private
     * @param firstClass
     * @param secondClass
     * @param flag
     * @param prefix
     * @return {Mixed}
     */
    swapCls: function(firstClass, secondClass, flag, prefix) {
        if (flag === undefined) {
            flag = true;
        }

        var addedClass = flag ? firstClass : secondClass,
            removedClass = flag ? secondClass : firstClass;

        if (removedClass) {
            this.removeCls(prefix ? prefix + '-' + removedClass : removedClass);
        }

        if (addedClass) {
            this.addCls(prefix ? prefix + '-' + addedClass : addedClass);
        }

        return this;
    },

    /**
     * Set the width of this Element.
     * @param {Number/String} width The new width.
     * @return {Ext.dom.Element} this
     */
    setWidth: function(width) {
        return this.setLengthValue(this.WIDTH, width);
    },

    /**
     * Set the height of this Element.
     * @param {Number/String} height The new height.
     * @return {Ext.dom.Element} this
     */
    setHeight: function(height) {
        return this.setLengthValue(this.HEIGHT, height);
    },

    /**
     * Set the size of this Element.
     *
     * @param {Number/String} width The new width. This may be one of:
     *
     * - A Number specifying the new width in this Element's {@link #defaultUnit}s (by default, pixels).
     * - A String used to set the CSS width style. Animation may **not** be used.
     * - A size object in the format `{width: widthValue, height: heightValue}`.
     *
     * @param {Number/String} height The new height. This may be one of:
     *
     * - A Number specifying the new height in this Element's {@link #defaultUnit}s (by default, pixels).
     * - A String used to set the CSS height style. Animation may **not** be used.
     * @return {Ext.dom.Element} this
     */
    setSize: function(width, height) {
        if (Ext.isObject(width)) {
            // in case of object from getSize()
            height = width.height;
            width = width.width;
        }

        this.setWidth(width);
        this.setHeight(height);

        return this;
    },

    /**
     * Set the minimum width of this Element.
     * @param {Number/String} width The new minimum width.
     * @return {Ext.dom.Element} this
     */
    setMinWidth: function(width) {
        return this.setLengthValue(this.MIN_WIDTH, width);
    },

    /**
     * Set the minimum height of this Element.
     * @param {Number/String} height The new minimum height.
     * @return {Ext.dom.Element} this
     */
    setMinHeight: function(height) {
        return this.setLengthValue(this.MIN_HEIGHT, height);
    },

    /**
     * Set the maximum width of this Element.
     * @param {Number/String} width The new maximum width.
     * @return {Ext.dom.Element} this
     */
    setMaxWidth: function(width) {
        return this.setLengthValue(this.MAX_WIDTH, width);
    },

    /**
     * Set the maximum height of this Element.
     * @param {Number/String} height The new maximum height.
     * @return {Ext.dom.Element} this
     */
    setMaxHeight: function(height) {
        return this.setLengthValue(this.MAX_HEIGHT, height);
    },

    /**
     * Sets the element's top position directly using CSS style (instead of {@link #setY}).
     * @param {String} top The top CSS property value.
     * @return {Ext.dom.Element} this
     */
    setTop: function(top) {
        return this.setLengthValue(this.TOP, top);
    },

    /**
     * Sets the element's CSS right style.
     * @param {String} right The right CSS property value.
     * @return {Ext.dom.Element} this
     */
    setRight: function(right) {
        return this.setLengthValue(this.RIGHT, right);
    },

    /**
     * Sets the element's CSS bottom style.
     * @param {String} bottom The bottom CSS property value.
     * @return {Ext.dom.Element} this
     */
    setBottom: function(bottom) {
        return this.setLengthValue(this.BOTTOM, bottom);
    },

    /**
     * Sets the element's left position directly using CSS style (instead of {@link #setX}).
     * @param {String} left The left CSS property value.
     * @return {Ext.dom.Element} this
     */
    setLeft: function(left) {
        return this.setLengthValue(this.LEFT, left);
    },

    setMargin: function(margin) {
        var domStyle = this.dom.style;

        if (margin || margin === 0) {
            margin = this.self.unitizeBox((margin === true) ? 5 : margin);
            domStyle.setProperty('margin', margin, 'important');
        }
        else {
            domStyle.removeProperty('margin-top');
            domStyle.removeProperty('margin-right');
            domStyle.removeProperty('margin-bottom');
            domStyle.removeProperty('margin-left');
        }
    },

    setPadding: function(padding) {
        var domStyle = this.dom.style;

        if (padding || padding === 0) {
            padding = this.self.unitizeBox((padding === true) ? 5 : padding);
            domStyle.setProperty('padding', padding, 'important');
        }
        else {
            domStyle.removeProperty('padding-top');
            domStyle.removeProperty('padding-right');
            domStyle.removeProperty('padding-bottom');
            domStyle.removeProperty('padding-left');
        }
    },

    setBorder: function(border) {
        var domStyle = this.dom.style;

        if (border || border === 0) {
            border = this.self.unitizeBox((border === true) ? 1 : border);
            domStyle.setProperty('border-width', border, 'important');
        }
        else {
            domStyle.removeProperty('border-top-width');
            domStyle.removeProperty('border-right-width');
            domStyle.removeProperty('border-bottom-width');
            domStyle.removeProperty('border-left-width');
        }
    },

    setLengthValue: function(name, value) {
        var domStyle = this.dom.style;

        if (value === null) {
            domStyle.removeProperty(name);
            return this;
        }

        if (typeof value == 'number') {
            value = value + 'px';
        }

        domStyle.setProperty(name, value, 'important');
        return this;
    },

    /**
     * Sets the visibility of the element (see details). If the `visibilityMode` is set to `Element.DISPLAY`, it will use
     * the display property to hide the element, otherwise it uses visibility. The default is to hide and show using the `visibility` property.
     * @param {Boolean} visible Whether the element is visible.
     * @return {Ext.Element} this
     */
    setVisible: function(visible) {
        var mode = this.getVisibilityMode(),
            method = visible ? 'removeCls' : 'addCls';

        switch (mode) {
            case this.VISIBILITY:
                this.removeCls(['x-hidden-display', 'x-hidden-offsets']);
                this[method]('x-hidden-visibility');
                break;

            case this.DISPLAY:
                this.removeCls(['x-hidden-visibility', 'x-hidden-offsets']);
                this[method]('x-hidden-display');
                break;

            case this.OFFSETS:
                this.removeCls(['x-hidden-visibility', 'x-hidden-display']);
                this[method]('x-hidden-offsets');
                break;
        }

        return this;
    },

    getVisibilityMode: function() {
        var dom = this.dom,
            mode = Ext.dom.Element.data(dom, 'visibilityMode');

        if (mode === undefined) {
            Ext.dom.Element.data(dom, 'visibilityMode', mode = this.DISPLAY);
        }

        return mode;
    },

    /**
     * Use this to change the visibility mode between {@link #VISIBILITY}, {@link #DISPLAY} or {@link #OFFSETS}.
     */
    setVisibilityMode: function(mode) {
        this.self.data(this.dom, 'visibilityMode', mode);

        return this;
    },

    /**
     * Shows this element.
     * Uses display mode to determine whether to use "display" or "visibility". See {@link #setVisible}.
     */
    show: function() {
        var dom = this.dom;
        if (dom) {
            dom.style.removeProperty('display');
        }
    },

    /**
     * Hides this element.
     * Uses display mode to determine whether to use "display" or "visibility". See {@link #setVisible}.
     */
    hide: function() {
        this.dom.style.setProperty('display', 'none', 'important');
    },

    setVisibility: function(isVisible) {
        var domStyle = this.dom.style;

        if (isVisible) {
            domStyle.removeProperty('visibility');
        }
        else {
            domStyle.setProperty('visibility', 'hidden', 'important');
        }
    },

    /**
     * This shared object is keyed by style name (e.g., 'margin-left' or 'marginLeft'). The
     * values are objects with the following properties:
     *
     *  * `name` (String) : The actual name to be presented to the DOM. This is typically the value
     *      returned by {@link #normalize}.
     *  * `get` (Function) : A hook function that will perform the get on this style. These
     *      functions receive "(dom, el)" arguments. The `dom` parameter is the DOM Element
     *      from which to get the style. The `el` argument (may be `null`) is the Ext.Element.
     *  * `set` (Function) : A hook function that will perform the set on this style. These
     *      functions receive "(dom, value, el)" arguments. The `dom` parameter is the DOM Element
     *      from which to get this style. The `value` parameter is the new value for the style. The
     *      `el` argument (may be `null`) is the Ext.Element.
     *
     * The `this` pointer is the object that contains `get` or `set`, which means that
     * `this.name` can be accessed if needed. The hook functions are both optional.
     * @private
     */
    styleHooks: {},

    // @private
    addStyles: function(sides, styles) {
        var totalSize = 0,
            sidesArr = sides.match(this.wordsRe),
            i = 0,
            len = sidesArr.length,
            side, size;
        for (; i < len; i++) {
            side = sidesArr[i];
            size = side && parseInt(this.getStyle(styles[side]), 10);
            if (size) {
                totalSize += Math.abs(size);
            }
        }
        return totalSize;
    },

    /**
     * Checks if the current value of a style is equal to a given value.
     * @param {String} style property whose value is returned.
     * @param {String} value to check against.
     * @return {Boolean} `true` for when the current value equals the given value.
     */
    isStyle: function(style, val) {
        return this.getStyle(style) == val;
    },

    getStyleValue: function(name) {
        return this.dom.style.getPropertyValue(name);
    },

    /**
     * Normalizes `currentStyle` and `computedStyle`.
     * @param {String} prop The style property whose value is returned.
     * @return {String} The current value of the style property for this element.
     */
    getStyle: function(prop) {
        var me = this,
            dom = me.dom,
            hook = me.styleHooks[prop],
            cs, result;

        if (dom == document) {
            return null;
        }
        if (!hook) {
            me.styleHooks[prop] = hook = { name: Ext.dom.Element.normalize(prop) };
        }
        if (hook.get) {
            return hook.get(dom, me);
        }

        cs = window.getComputedStyle(dom, '');

        // why the dom.style lookup? It is not true that "style == computedStyle" as
        // well as the fact that 0/false are valid answers...
        result = (cs && cs[hook.name]); // || dom.style[hook.name];

        // WebKit returns rgb values for transparent, how does this work n IE9+
        //        if (!supportsTransparentColor && result == 'rgba(0, 0, 0, 0)') {
        //            result = 'transparent';
        //        }

        return result;
    },

    /**
     * Wrapper for setting style properties, also takes single object parameter of multiple styles.
     * @param {String/Object} property The style property to be set, or an object of multiple styles.
     * @param {String} [value] The value to apply to the given property, or `null` if an object was passed.
     * @return {Ext.dom.Element} this
     */
    setStyle: function(prop, value) {
        var me = this,
            dom = me.dom,
            hooks = me.styleHooks,
            style = dom.style,
            valueFrom = Ext.valueFrom,
            name, hook;

        // we don't promote the 2-arg form to object-form to avoid the overhead...
        if (typeof prop == 'string') {
            hook = hooks[prop];

            if (!hook) {
                hooks[prop] = hook = { name: Ext.dom.Element.normalize(prop) };
            }
            value = valueFrom(value, '');

            if (hook.set) {
                hook.set(dom, value, me);
            } else {
                style[hook.name] = value;
            }
        }
        else {
            for (name in prop) {
                if (prop.hasOwnProperty(name)) {
                    hook = hooks[name];

                    if (!hook) {
                        hooks[name] = hook = { name: Ext.dom.Element.normalize(name) };
                    }

                    value = valueFrom(prop[name], '');

                    if (hook.set) {
                        hook.set(dom, value, me);
                    }
                    else {
                        style[hook.name] = value;
                    }
                }
            }
        }

        return me;
    },

    /**
     * Returns the offset height of the element.
     * @param {Boolean} [contentHeight] `true` to get the height minus borders and padding.
     * @return {Number} The element's height.
     */
    getHeight: function(contentHeight) {
        var dom = this.dom,
            height = contentHeight ? (dom.clientHeight - this.getPadding("tb")) : dom.offsetHeight;
        return height > 0 ? height : 0;
    },

    /**
     * Returns the offset width of the element.
     * @param {Boolean} [contentWidth] `true` to get the width minus borders and padding.
     * @return {Number} The element's width.
     */
    getWidth: function(contentWidth) {
        var dom = this.dom,
            width = contentWidth ? (dom.clientWidth - this.getPadding("lr")) : dom.offsetWidth;
        return width > 0 ? width : 0;
    },

    /**
     * Gets the width of the border(s) for the specified side(s)
     * @param {String} side Can be t, l, r, b or any combination of those to add multiple values. For example,
     * passing `'lr'` would get the border **l**eft width + the border **r**ight width.
     * @return {Number} The width of the sides passed added together
     */
    getBorderWidth: function(side) {
        return this.addStyles(side, this.borders);
    },

    /**
     * Gets the width of the padding(s) for the specified side(s).
     * @param {String} side Can be t, l, r, b or any combination of those to add multiple values. For example,
     * passing `'lr'` would get the padding **l**eft + the padding **r**ight.
     * @return {Number} The padding of the sides passed added together.
     */
    getPadding: function(side) {
        return this.addStyles(side, this.paddings);
    },

    /**
     * More flexible version of {@link #setStyle} for setting style properties.
     * @param {String/Object/Function} styles A style specification string, e.g. "width:100px", or object in the form `{width:"100px"}`, or
     * a function which returns such a specification.
     * @return {Ext.dom.Element} this
     */
    applyStyles: function(styles) {
        if (styles) {
            var dom = this.dom,
                styleType, i, len;

            if (typeof styles == 'function') {
                styles = styles.call();
            }
            styleType = typeof styles;
            if (styleType == 'string') {
                styles = Ext.util.Format.trim(styles).split(this.styleSplitRe);
                for (i = 0, len = styles.length; i < len;) {
                    dom.style[Ext.dom.Element.normalize(styles[i++])] = styles[i++];
                }
            }
            else if (styleType == 'object') {
                this.setStyle(styles);
            }
        }
    },

    /**
     * Returns the size of the element.
     * @param {Boolean} [contentSize] `true` to get the width/size minus borders and padding.
     * @return {Object} An object containing the element's size:
     * @return {Number} return.width
     * @return {Number} return.height
     */
    getSize: function(contentSize) {
        var dom = this.dom;
        return {
            width: Math.max(0, contentSize ? (dom.clientWidth - this.getPadding("lr")) : dom.offsetWidth),
            height: Math.max(0, contentSize ? (dom.clientHeight - this.getPadding("tb")) : dom.offsetHeight)
        };
    },

    /**
     * Forces the browser to repaint this element.
     * @return {Ext.dom.Element} this
     */
    repaint: function() {
        var dom = this.dom;
        this.addCls(Ext.baseCSSPrefix + 'repaint');
        setTimeout(function() {
            Ext.fly(dom).removeCls(Ext.baseCSSPrefix + 'repaint');
        }, 1);
        return this;
    },

    /**
     * Returns an object with properties top, left, right and bottom representing the margins of this element unless sides is passed,
     * then it returns the calculated width of the sides (see {@link #getPadding}).
     * @param {String} [sides] Any combination of 'l', 'r', 't', 'b' to get the sum of those sides.
     * @return {Object/Number}
     */
    getMargin: function(side) {
        var me = this,
            hash = {t: "top", l: "left", r: "right", b: "bottom"},
            o = {},
            key;

        if (!side) {
            for (key in me.margins) {
                o[hash[key]] = parseFloat(me.getStyle(me.margins[key])) || 0;
            }
            return o;
        } else {
            return me.addStyles.call(me, side, me.margins);
        }
    }
});

//<deprecated product=touch since=2.0>
Ext.dom.Element.addMembers({
    /**
     * Returns the dimensions of the element available to lay content out in.
     *
     * If the element (or any ancestor element) has CSS style `display: none`, the dimensions will be zero.
     *
     * Example:
     *
     *     var vpSize = Ext.getBody().getViewSize();
     *
     *     // all Windows created afterwards will have a default value of 90% height and 95% width
     *     Ext.Window.override({
     *         width: vpSize.width * 0.9,
     *         height: vpSize.height * 0.95
     *     });
     *     // To handle window resizing you would have to hook onto onWindowResize.
     *
     * `getViewSize` utilizes `clientHeight`/`clientWidth` which excludes sizing of scrollbars.
     * To obtain the size including scrollbars, use {@link #getStyleSize}.
     *
     * Sizing of the document body is handled at the adapter level which handles special cases for IE and strict modes, etc.
     *
     * @deprecated 2.0.0
     * @return {Object} Object describing `width` and `height`:
     * @return {Number} return.width
     * @return {Number} return.height
     */
    getViewSize: function() {
        //<debug warn>
        Ext.Logger.deprecate("Ext.dom.Element.getViewSize() is deprecated", this);
        //</debug>

        var doc = document,
            dom = this.dom;

        if (dom == doc || dom == doc.body) {
            return {
                width: Element.getViewportWidth(),
                height: Element.getViewportHeight()
            };
        }
        else {
            return {
                width: dom.clientWidth,
                height: dom.clientHeight
            };
        }
    },

    /**
     * Returns `true` if the value of the given property is visually transparent. This
     * may be due to a 'transparent' style value or an rgba value with 0 in the alpha
     * component.
     * @deprecated 2.0.0
     * @param {String} prop The style property whose value is to be tested.
     * @return {Boolean} `true` if the style property is visually transparent.
     */
    isTransparent: function(prop) {
        //<debug warn>
        Ext.Logger.deprecate("Ext.dom.Element.isTransparent() is deprecated", this);
        //</debug>

        var value = this.getStyle(prop);

        return value ? this.transparentRe.test(value) : false;
    },


    /**
     * Adds one or more CSS classes to this element and removes the same class(es) from all siblings.
     * @deprecated 2.0.0
     * @param {String/String[]} className The CSS class to add, or an array of classes.
     * @return {Ext.dom.Element} this
     */
    radioCls: function(className) {
        //<debug warn>
        Ext.Logger.deprecate("Ext.dom.Element.radioCls() is deprecated", this);
        //</debug>

        var cn = this.dom.parentNode.childNodes,
            v;
        className = Ext.isArray(className) ? className : [className];
        for (var i = 0, len = cn.length; i < len; i++) {
            v = cn[i];
            if (v && v.nodeType == 1) {
                Ext.fly(v, '_internal').removeCls(className);
            }
        }
        return this.addCls(className);
    }
});
//</deprecated>
