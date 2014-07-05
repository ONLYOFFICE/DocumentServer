//@tag dom,core
//@define Ext.Element-all
//@define Ext.Element-static
//@require Ext.Element

/**
 * @class Ext.dom.Element
 */
Ext.dom.Element.addStatics({
    numberRe: /\d+$/,
    unitRe: /\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i,
    camelRe: /(-[a-z])/gi,
    cssRe: /([a-z0-9-]+)\s*:\s*([^;\s]+(?:\s*[^;\s]+)*);?/gi,
    opacityRe: /alpha\(opacity=(.*)\)/i,
    propertyCache: {},
    defaultUnit: "px",
    borders: {l: 'border-left-width', r: 'border-right-width', t: 'border-top-width', b: 'border-bottom-width'},
    paddings: {l: 'padding-left', r: 'padding-right', t: 'padding-top', b: 'padding-bottom'},
    margins: {l: 'margin-left', r: 'margin-right', t: 'margin-top', b: 'margin-bottom'},

    /**
     * Test if size has a unit, otherwise appends the passed unit string, or the default for this Element.
     * @param {Object} size The size to set.
     * @param {String} units The units to append to a numeric size value.
     * @return {String}
     * @private
     * @static
     */
    addUnits: function(size, units) {
        // Size set to a value which means "auto"
        if (size === "" || size == "auto" || size === undefined || size === null) {
            return size || '';
        }

        // Otherwise, warn if it's not a valid CSS measurement
        if (Ext.isNumber(size) || this.numberRe.test(size)) {
            return size + (units || this.defaultUnit || 'px');
        }
        else if (!this.unitRe.test(size)) {
            //<debug>
            Ext.Logger.warn("Warning, size detected (" + size + ") not a valid property value on Element.addUnits.");
            //</debug>
            return size || '';
        }

        return size;
    },

    /**
     * @static
     * @return {Boolean}
     * @private
     */
    isAncestor: function(p, c) {
        var ret = false;

        p = Ext.getDom(p);
        c = Ext.getDom(c);
        if (p && c) {
            if (p.contains) {
                return p.contains(c);
            } else if (p.compareDocumentPosition) {
                return !!(p.compareDocumentPosition(c) & 16);
            } else {
                while ((c = c.parentNode)) {
                    ret = c == p || ret;
                }
            }
        }
        return ret;
    },

    /**
     * Parses a number or string representing margin sizes into an object. Supports CSS-style margin declarations
     * (e.g. 10, "10", "10 10", "10 10 10" and "10 10 10 10" are all valid options and would return the same result)
     * @static
     * @param {Number/String} box The encoded margins
     * @return {Object} An object with margin sizes for top, right, bottom and left containing the unit
     */
    parseBox: function(box) {
        if (typeof box != 'string') {
            box = box.toString();
        }

        var parts = box.split(' '),
            ln = parts.length;

        if (ln == 1) {
            parts[1] = parts[2] = parts[3] = parts[0];
        }
        else if (ln == 2) {
            parts[2] = parts[0];
            parts[3] = parts[1];
        }
        else if (ln == 3) {
            parts[3] = parts[1];
        }

        return {
            top: parts[0] || 0,
            right: parts[1] || 0,
            bottom: parts[2] || 0,
            left: parts[3] || 0
        };
    },

    /**
     * Parses a number or string representing margin sizes into an object. Supports CSS-style margin declarations
     * (e.g. 10, "10", "10 10", "10 10 10" and "10 10 10 10" are all valid options and would return the same result)
     * @static
     * @param {Number/String} box The encoded margins
     * @param {String} units The type of units to add
     * @return {String} An string with unitized (px if units is not specified) metrics for top, right, bottom and left
     */
    unitizeBox: function(box, units) {
        var me = this;
        box = me.parseBox(box);

        return me.addUnits(box.top, units) + ' ' +
               me.addUnits(box.right, units) + ' ' +
               me.addUnits(box.bottom, units) + ' ' +
               me.addUnits(box.left, units);
    },

    // @private
    camelReplaceFn: function(m, a) {
        return a.charAt(1).toUpperCase();
    },

    /**
     * Normalizes CSS property keys from dash delimited to camel case JavaScript Syntax.
     * For example:
     *
     * - border-width -> borderWidth
     * - padding-top -> paddingTop
     *
     * @static
     * @param {String} prop The property to normalize
     * @return {String} The normalized string
     */
    normalize: function(prop) {
        // TODO: Mobile optimization?
//        if (prop == 'float') {
//            prop = Ext.supports.Float ? 'cssFloat' : 'styleFloat';
//        }
        return this.propertyCache[prop] || (this.propertyCache[prop] = prop.replace(this.camelRe, this.camelReplaceFn));
    },

    /**
     * Returns the top Element that is located at the passed coordinates
     * @static
     * @param {Number} x The x coordinate
     * @param {Number} y The y coordinate
     * @return {String} The found Element
     */
    fromPoint: function(x, y) {
        return Ext.get(document.elementFromPoint(x, y));
    },

    /**
     * Converts a CSS string into an object with a property for each style.
     *
     * The sample code below would return an object with 2 properties, one
     * for background-color and one for color.
     *
     *     var css = 'background-color: red;color: blue; ';
     *     console.log(Ext.dom.Element.parseStyles(css));
     *
     * @static
     * @param {String} styles A CSS string
     * @return {Object} styles
     */
    parseStyles: function(styles) {
        var out = {},
            cssRe = this.cssRe,
            matches;

        if (styles) {
            // Since we're using the g flag on the regex, we need to set the lastIndex.
            // This automatically happens on some implementations, but not others, see:
            // http://stackoverflow.com/questions/2645273/javascript-regular-expression-literal-persists-between-function-calls
            // http://blog.stevenlevithan.com/archives/fixing-javascript-regexp
            cssRe.lastIndex = 0;
            while ((matches = cssRe.exec(styles))) {
                out[matches[1]] = matches[2];
            }
        }
        return out;
    }
});

//<deprecated product=touch since=2.0>
Ext.dom.Element.addStatics({
    /**
     * Serializes a DOM form into a url encoded string
     * @deprecated 2.0.0 Please see {@link Ext.form.Panel#getValues} instead
     * @param {Object} form The form
     * @return {String} The url encoded form
     */
    serializeForm: function(form) {
        var fElements = form.elements || (document.forms[form] || Ext.getDom(form)).elements,
            hasSubmit = false,
            encoder = encodeURIComponent,
            name,
            data = '',
            type,
            hasValue;

        Ext.each(fElements, function(element) {
            name = element.name;
            type = element.type;

            if (!element.disabled && name) {
                if (/select-(one|multiple)/i.test(type)) {
                    Ext.each(element.options, function(opt) {
                        if (opt.selected) {
                            hasValue = opt.hasAttribute ? opt.hasAttribute('value') : opt.getAttributeNode('value').specified;
                            data += Ext.String.format("{0}={1}&", encoder(name), encoder(hasValue ? opt.value : opt.text));
                        }
                    });
                } else if (!(/file|undefined|reset|button/i.test(type))) {
                    if (!(/radio|checkbox/i.test(type) && !element.checked) && !(type == 'submit' && hasSubmit)) {
                        data += encoder(name) + '=' + encoder(element.value) + '&';
                        hasSubmit = /submit/i.test(type);
                    }
                }
            }
        });

        return data.substr(0, data.length - 1);
    },

    /**
     * Retrieves the document height
     * @deprecated 2.0.0 Please use {@link Ext.Viewport#getWindowHeight} instead
     * @static
     * @return {Number} documentHeight
     */
    getDocumentHeight: function() {
        //<debug warn>
        Ext.Logger.deprecate("Ext.Element.getDocumentHeight() is no longer supported. " +
            "Please use Ext.Viewport#getWindowHeight() instead", this);
        //</debug>
        return Math.max(!Ext.isStrict ? document.body.scrollHeight : document.documentElement.scrollHeight, this.getViewportHeight());
    },

    /**
     * Retrieves the document width
     * @deprecated 2.0.0 Please use {@link Ext.Viewport#getWindowWidth} instead
     * @static
     * @return {Number} documentWidth
     */
    getDocumentWidth: function() {
        //<debug warn>
        Ext.Logger.deprecate("Ext.Element.getDocumentWidth() is no longer supported. " +
            "Please use Ext.Viewport#getWindowWidth() instead", this);
        //</debug>
        return Math.max(!Ext.isStrict ? document.body.scrollWidth : document.documentElement.scrollWidth, this.getViewportWidth());
    },

    /**
     * Retrieves the viewport height of the window.
     * @deprecated 2.0.0 Please use {@link Ext.Viewport#getWindowHeight} instead
     * @static
     * @return {Number} viewportHeight
     */
    getViewportHeight: function() {
        //<debug warn>
        Ext.Logger.deprecate("Ext.Element.getDocumentHeight() is no longer supported. " +
            "Please use Ext.Viewport#getWindowHeight() instead", this);
        //</debug>
        return window.innerHeight;
    },

    /**
     * Retrieves the viewport width of the window.
     * @deprecated 2.0.0 Please use {@link Ext.Viewport#getWindowWidth} instead
     * @static
     * @return {Number} viewportWidth
     */
    getViewportWidth: function() {
        //<debug warn>
        Ext.Logger.deprecate("Ext.Element.getDocumentWidth() is no longer supported. " +
            "Please use Ext.Viewport#getWindowWidth() instead", this);
        //</debug>
        return window.innerWidth;
    },

    /**
     * Retrieves the viewport size of the window.
     * @deprecated 2.0.0 Please use {@link Ext.Viewport#getSize} instead
     * @static
     * @return {Object} object containing width and height properties
     */
    getViewSize: function() {
        //<debug warn>
        Ext.Logger.deprecate("Ext.Element.getViewSize() is no longer supported. " +
            "Please use Ext.Viewport#getSize() instead", this);
        //</debug>
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    },

    /**
     * Retrieves the current orientation of the window. This is calculated by
     * determining if the height is greater than the width.
     * @deprecated 2.0.0 Please use {@link Ext.Viewport#getOrientation} instead
     * @static
     * @return {String} Orientation of window: 'portrait' or 'landscape'
     */
    getOrientation: function() {
        //<debug warn>
        Ext.Logger.deprecate("Ext.Element.getOrientation() is no longer supported. " +
            "Please use Ext.Viewport#getOrientation() instead", this);
        //</debug>
        if (Ext.supports.OrientationChange) {
            return (window.orientation == 0) ? 'portrait' : 'landscape';
        }

        return (window.innerHeight > window.innerWidth) ? 'portrait' : 'landscape';
    }
});
//</deprecated>
