/*
This file is part of Sencha Touch 2.1

Copyright (c) 2011-2012 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as
published by the Free Software Foundation and appearing in the file LICENSE included in the
packaging of this file.

Please review the following information to ensure the GNU General Public License version 3.0
requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department
at http://www.sencha.com/contact.

Build date: 2012-11-05 22:31:29 (08c91901ae8449841ff23e5d3fb404d6128d3b0b)
*/
//@tag foundation,core
//@define Ext

/**
 * @class Ext
 * @singleton
 */
(function() {
    var global = this,
        objectPrototype = Object.prototype,
        toString = objectPrototype.toString,
        enumerables = true,
        enumerablesTest = { toString: 1 },
        emptyFn = function(){},
        i;

    if (typeof Ext === 'undefined') {
        global.Ext = {};
    }

    Ext.global = global;

    for (i in enumerablesTest) {
        enumerables = null;
    }

    if (enumerables) {
        enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
                       'toLocaleString', 'toString', 'constructor'];
    }

    /**
     * An array containing extra enumerables for old browsers.
     * @property {String[]}
     */
    Ext.enumerables = enumerables;

    /**
     * Copies all the properties of config to the specified object.
     * Note that if recursive merging and cloning without referencing the original objects / arrays is needed, use
     * {@link Ext.Object#merge} instead.
     * @param {Object} object The receiver of the properties.
     * @param {Object} config The source of the properties.
     * @param {Object} [defaults] A different object that will also be applied for default values.
     * @return {Object} returns obj
     */
    Ext.apply = function(object, config, defaults) {
        if (defaults) {
            Ext.apply(object, defaults);
        }

        if (object && config && typeof config === 'object') {
            var i, j, k;

            for (i in config) {
                object[i] = config[i];
            }

            if (enumerables) {
                for (j = enumerables.length; j--;) {
                    k = enumerables[j];
                    if (config.hasOwnProperty(k)) {
                        object[k] = config[k];
                    }
                }
            }
        }

        return object;
    };

    Ext.buildSettings = Ext.apply({
        baseCSSPrefix: 'x-',
        scopeResetCSS: false
    }, Ext.buildSettings || {});

    Ext.apply(Ext, {
        /**
         * @property {Function}
         * A reusable empty function
         */
        emptyFn: emptyFn,

        baseCSSPrefix: Ext.buildSettings.baseCSSPrefix,

        /**
         * Copies all the properties of config to object if they don't already exist.
         * @param {Object} object The receiver of the properties.
         * @param {Object} config The source of the properties.
         * @return {Object} returns obj
         */
        applyIf: function(object, config) {
            var property;

            if (object) {
                for (property in config) {
                    if (object[property] === undefined) {
                        object[property] = config[property];
                    }
                }
            }

            return object;
        },

        /**
         * Iterates either an array or an object. This method delegates to
         * {@link Ext.Array#each Ext.Array.each} if the given value is iterable, and {@link Ext.Object#each Ext.Object.each} otherwise.
         *
         * @param {Object/Array} object The object or array to be iterated.
         * @param {Function} fn The function to be called for each iteration. See and {@link Ext.Array#each Ext.Array.each} and
         * {@link Ext.Object#each Ext.Object.each} for detailed lists of arguments passed to this function depending on the given object
         * type that is being iterated.
         * @param {Object} scope (Optional) The scope (`this` reference) in which the specified function is executed.
         * Defaults to the object being iterated itself.
         */
        iterate: function(object, fn, scope) {
            if (Ext.isEmpty(object)) {
                return;
            }

            if (scope === undefined) {
                scope = object;
            }

            if (Ext.isIterable(object)) {
                Ext.Array.each.call(Ext.Array, object, fn, scope);
            }
            else {
                Ext.Object.each.call(Ext.Object, object, fn, scope);
            }
        }
    });

    Ext.apply(Ext, {

        /**
         * This method deprecated. Use {@link Ext#define Ext.define} instead.
         * @method
         * @param {Function} superclass
         * @param {Object} overrides
         * @return {Function} The subclass constructor from the `overrides` parameter, or a generated one if not provided.
         * @deprecated 4.0.0 Please use {@link Ext#define Ext.define} instead
         */
        extend: function() {
            // inline overrides
            var objectConstructor = objectPrototype.constructor,
                inlineOverrides = function(o) {
                for (var m in o) {
                    if (!o.hasOwnProperty(m)) {
                        continue;
                    }
                    this[m] = o[m];
                }
            };

            return function(subclass, superclass, overrides) {
                // First we check if the user passed in just the superClass with overrides
                if (Ext.isObject(superclass)) {
                    overrides = superclass;
                    superclass = subclass;
                    subclass = overrides.constructor !== objectConstructor ? overrides.constructor : function() {
                        superclass.apply(this, arguments);
                    };
                }

                //<debug>
                if (!superclass) {
                    Ext.Error.raise({
                        sourceClass: 'Ext',
                        sourceMethod: 'extend',
                        msg: 'Attempting to extend from a class which has not been loaded on the page.'
                    });
                }
                //</debug>

                // We create a new temporary class
                var F = function() {},
                    subclassProto, superclassProto = superclass.prototype;

                F.prototype = superclassProto;
                subclassProto = subclass.prototype = new F();
                subclassProto.constructor = subclass;
                subclass.superclass = superclassProto;

                if (superclassProto.constructor === objectConstructor) {
                    superclassProto.constructor = superclass;
                }

                subclass.override = function(overrides) {
                    Ext.override(subclass, overrides);
                };

                subclassProto.override = inlineOverrides;
                subclassProto.proto = subclassProto;

                subclass.override(overrides);
                subclass.extend = function(o) {
                    return Ext.extend(subclass, o);
                };

                return subclass;
            };
        }(),

        /**
         * Proxy to {@link Ext.Base#override}. Please refer {@link Ext.Base#override} for further details.
         *
         * @param {Object} cls The class to override
         * @param {Object} overrides The properties to add to `origClass`. This should be specified as an object literal
         * containing one or more properties.
         * @method override
         * @deprecated 4.1.0 Please use {@link Ext#define Ext.define} instead.
         */
        override: function(cls, overrides) {
            if (cls.$isClass) {
                return cls.override(overrides);
            }
            else {
                Ext.apply(cls.prototype, overrides);
            }
        }
    });

    // A full set of static methods to do type checking
    Ext.apply(Ext, {

        /**
         * Returns the given value itself if it's not empty, as described in {@link Ext#isEmpty}; returns the default
         * value (second argument) otherwise.
         *
         * @param {Object} value The value to test.
         * @param {Object} defaultValue The value to return if the original value is empty.
         * @param {Boolean} [allowBlank=false] (optional) `true` to allow zero length strings to qualify as non-empty.
         * @return {Object} `value`, if non-empty, else `defaultValue`.
         */
        valueFrom: function(value, defaultValue, allowBlank){
            return Ext.isEmpty(value, allowBlank) ? defaultValue : value;
        },

        /**
         * Returns the type of the given variable in string format. List of possible values are:
         *
         * - `undefined`: If the given value is `undefined`
         * - `null`: If the given value is `null`
         * - `string`: If the given value is a string
         * - `number`: If the given value is a number
         * - `boolean`: If the given value is a boolean value
         * - `date`: If the given value is a `Date` object
         * - `function`: If the given value is a function reference
         * - `object`: If the given value is an object
         * - `array`: If the given value is an array
         * - `regexp`: If the given value is a regular expression
         * - `element`: If the given value is a DOM Element
         * - `textnode`: If the given value is a DOM text node and contains something other than whitespace
         * - `whitespace`: If the given value is a DOM text node and contains only whitespace
         *
         * @param {Object} value
         * @return {String}
         */
        typeOf: function(value) {
            if (value === null) {
                return 'null';
            }

            var type = typeof value;

            if (type === 'undefined' || type === 'string' || type === 'number' || type === 'boolean') {
                return type;
            }

            var typeToString = toString.call(value);

            switch(typeToString) {
                case '[object Array]':
                    return 'array';
                case '[object Date]':
                    return 'date';
                case '[object Boolean]':
                    return 'boolean';
                case '[object Number]':
                    return 'number';
                case '[object RegExp]':
                    return 'regexp';
            }

            if (type === 'function') {
                return 'function';
            }

            if (type === 'object') {
                if (value.nodeType !== undefined) {
                    if (value.nodeType === 3) {
                        return (/\S/).test(value.nodeValue) ? 'textnode' : 'whitespace';
                    }
                    else {
                        return 'element';
                    }
                }

                return 'object';
            }

            //<debug error>
            Ext.Error.raise({
                sourceClass: 'Ext',
                sourceMethod: 'typeOf',
                msg: 'Failed to determine the type of the specified value "' + value + '". This is most likely a bug.'
            });
            //</debug>
        },

        /**
         * Returns `true` if the passed value is empty, `false` otherwise. The value is deemed to be empty if it is either:
         *
         * - `null`
         * - `undefined`
         * - a zero-length array.
         * - a zero-length string (Unless the `allowEmptyString` parameter is set to `true`).
         *
         * @param {Object} value The value to test.
         * @param {Boolean} [allowEmptyString=false] (optional) `true` to allow empty strings.
         * @return {Boolean}
         */
        isEmpty: function(value, allowEmptyString) {
            return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (Ext.isArray(value) && value.length === 0);
        },

        /**
         * Returns `true` if the passed value is a JavaScript Array, `false` otherwise.
         *
         * @param {Object} target The target to test.
         * @return {Boolean}
         * @method
         */
        isArray: ('isArray' in Array) ? Array.isArray : function(value) {
            return toString.call(value) === '[object Array]';
        },

        /**
         * Returns `true` if the passed value is a JavaScript Date object, `false` otherwise.
         * @param {Object} object The object to test.
         * @return {Boolean}
         */
        isDate: function(value) {
            return toString.call(value) === '[object Date]';
        },

        /**
         * Returns `true` if the passed value is a JavaScript Object, `false` otherwise.
         * @param {Object} value The value to test.
         * @return {Boolean}
         * @method
         */
        isObject: (toString.call(null) === '[object Object]') ?
        function(value) {
            // check ownerDocument here as well to exclude DOM nodes
            return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
        } :
        function(value) {
            return toString.call(value) === '[object Object]';
        },

        /**
         * @private
         */
        isSimpleObject: function(value) {
            return value instanceof Object && value.constructor === Object;
        },
        /**
         * Returns `true` if the passed value is a JavaScript 'primitive', a string, number or Boolean.
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isPrimitive: function(value) {
            var type = typeof value;

            return type === 'string' || type === 'number' || type === 'boolean';
        },

        /**
         * Returns `true` if the passed value is a JavaScript Function, `false` otherwise.
         * @param {Object} value The value to test.
         * @return {Boolean}
         * @method
         */
        isFunction:
        // Safari 3.x and 4.x returns 'function' for typeof <NodeList>, hence we need to fall back to using
        // Object.prorotype.toString (slower)
        (typeof document !== 'undefined' && typeof document.getElementsByTagName('body') === 'function') ? function(value) {
            return toString.call(value) === '[object Function]';
        } : function(value) {
            return typeof value === 'function';
        },

        /**
         * Returns `true` if the passed value is a number. Returns `false` for non-finite numbers.
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isNumber: function(value) {
            return typeof value === 'number' && isFinite(value);
        },

        /**
         * Validates that a value is numeric.
         * @param {Object} value Examples: 1, '1', '2.34'
         * @return {Boolean} `true` if numeric, `false` otherwise.
         */
        isNumeric: function(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        },

        /**
         * Returns `true` if the passed value is a string.
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isString: function(value) {
            return typeof value === 'string';
        },

        /**
         * Returns `true` if the passed value is a Boolean.
         *
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isBoolean: function(value) {
            return typeof value === 'boolean';
        },

        /**
         * Returns `true` if the passed value is an HTMLElement.
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isElement: function(value) {
            return value ? value.nodeType === 1 : false;
        },

        /**
         * Returns `true` if the passed value is a TextNode.
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isTextNode: function(value) {
            return value ? value.nodeName === "#text" : false;
        },

        /**
         * Returns `true` if the passed value is defined.
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isDefined: function(value) {
            return typeof value !== 'undefined';
        },

        /**
         * Returns `true` if the passed value is iterable, `false` otherwise.
         * @param {Object} value The value to test.
         * @return {Boolean}
         */
        isIterable: function(value) {
            return (value && typeof value !== 'string') ? value.length !== undefined : false;
        }
    });

    Ext.apply(Ext, {

        /**
         * Clone almost any type of variable including array, object, DOM nodes and Date without keeping the old reference.
         * @param {Object} item The variable to clone.
         * @return {Object} clone
         */
        clone: function(item) {
            if (item === null || item === undefined) {
                return item;
            }

            // DOM nodes
            if (item.nodeType && item.cloneNode) {
                return item.cloneNode(true);
            }

            // Strings
            var type = toString.call(item);

            // Dates
            if (type === '[object Date]') {
                return new Date(item.getTime());
            }

            var i, j, k, clone, key;

            // Arrays
            if (type === '[object Array]') {
                i = item.length;

                clone = [];

                while (i--) {
                    clone[i] = Ext.clone(item[i]);
                }
            }
            // Objects
            else if (type === '[object Object]' && item.constructor === Object) {
                clone = {};

                for (key in item) {
                    clone[key] = Ext.clone(item[key]);
                }

                if (enumerables) {
                    for (j = enumerables.length; j--;) {
                        k = enumerables[j];
                        clone[k] = item[k];
                    }
                }
            }

            return clone || item;
        },

        /**
         * @private
         * Generate a unique reference of Ext in the global scope, useful for sandboxing.
         */
        getUniqueGlobalNamespace: function() {
            var uniqueGlobalNamespace = this.uniqueGlobalNamespace;

            if (uniqueGlobalNamespace === undefined) {
                var i = 0;

                do {
                    uniqueGlobalNamespace = 'ExtBox' + (++i);
                } while (Ext.global[uniqueGlobalNamespace] !== undefined);

                Ext.global[uniqueGlobalNamespace] = Ext;
                this.uniqueGlobalNamespace = uniqueGlobalNamespace;
            }

            return uniqueGlobalNamespace;
        },

        /**
         * @private
         */
        functionFactory: function() {
            var args = Array.prototype.slice.call(arguments),
                ln = args.length;

            if (ln > 0) {
                args[ln - 1] = 'var Ext=window.' + this.getUniqueGlobalNamespace() + ';' + args[ln - 1];
            }

            return Function.prototype.constructor.apply(Function.prototype, args);
        },

        /**
         * @private
         */
        globalEval: ('execScript' in global) ? function(code) {
            global.execScript(code)
        } : function(code) {
            (function(){
                eval(code);
            })();
        }

        //<feature logger>
        /**
         * @private
         * @property
         */
        ,Logger: {
            log: function(message, priority) {
                if ('console' in global) {
                    if (!priority || !(priority in global.console)) {
                        priority = 'log';
                    }
                    message = '[' + priority.toUpperCase() + '] ' + message;
                    global.console[priority](message);
                }
            },
            verbose: function(message) {
                this.log(message, 'verbose');
            },
            info: function(message) {
                this.log(message, 'info');
            },
            warn: function(message) {
                this.log(message, 'warn');
            },
            error: function(message) {
                throw new Error(message);
            },
            deprecate: function(message) {
                this.log(message, 'warn');
            }
        }
        //</feature>
    });

    /**
     * Old alias to {@link Ext#typeOf}.
     * @deprecated 4.0.0 Please use {@link Ext#typeOf} instead.
     * @method
     * @alias Ext#typeOf
     */
    Ext.type = Ext.typeOf;

})();

//@tag foundation,core
//@define Ext.Version
//@require Ext

/**
 * @author Jacky Nguyen <jacky@sencha.com>
 * @docauthor Jacky Nguyen <jacky@sencha.com>
 * @class Ext.Version
 *
 * A utility class that wrap around a string version number and provide convenient
 * method to perform comparison. See also: {@link Ext.Version#compare compare}. Example:
 *
 *     var version = new Ext.Version('1.0.2beta');
 *     console.log("Version is " + version); // Version is 1.0.2beta
 *
 *     console.log(version.getMajor()); // 1
 *     console.log(version.getMinor()); // 0
 *     console.log(version.getPatch()); // 2
 *     console.log(version.getBuild()); // 0
 *     console.log(version.getRelease()); // beta
 *
 *     console.log(version.isGreaterThan('1.0.1')); // true
 *     console.log(version.isGreaterThan('1.0.2alpha')); // true
 *     console.log(version.isGreaterThan('1.0.2RC')); // false
 *     console.log(version.isGreaterThan('1.0.2')); // false
 *     console.log(version.isLessThan('1.0.2')); // true
 *
 *     console.log(version.match(1.0)); // true
 *     console.log(version.match('1.0.2')); // true
 */
(function() {

// Current core version
var version = '4.1.0', Version;
    Ext.Version = Version = Ext.extend(Object, {

        /**
         * Creates new Version object.
         * @param {String/Number} version The version number in the follow standard format: major[.minor[.patch[.build[release]]]]
         * Examples: 1.0 or 1.2.3beta or 1.2.3.4RC
         * @return {Ext.Version} this
         */
        constructor: function(version) {
            var toNumber = this.toNumber,
                parts, releaseStartIndex;

            if (version instanceof Version) {
                return version;
            }

            this.version = this.shortVersion = String(version).toLowerCase().replace(/_/g, '.').replace(/[\-+]/g, '');

            releaseStartIndex = this.version.search(/([^\d\.])/);

            if (releaseStartIndex !== -1) {
                this.release = this.version.substr(releaseStartIndex, version.length);
                this.shortVersion = this.version.substr(0, releaseStartIndex);
            }

            this.shortVersion = this.shortVersion.replace(/[^\d]/g, '');

            parts = this.version.split('.');

            this.major = toNumber(parts.shift());
            this.minor = toNumber(parts.shift());
            this.patch = toNumber(parts.shift());
            this.build = toNumber(parts.shift());

            return this;
        },

        /**
         * @param value
         * @return {Number}
         */
        toNumber: function(value) {
            value = parseInt(value || 0, 10);

            if (isNaN(value)) {
                value = 0;
            }

            return value;
        },

        /**
         * Override the native `toString()` method.
         * @private
         * @return {String} version
         */
        toString: function() {
            return this.version;
        },

        /**
         * Override the native `valueOf()` method.
         * @private
         * @return {String} version
         */
        valueOf: function() {
            return this.version;
        },

        /**
         * Returns the major component value.
         * @return {Number} major
         */
        getMajor: function() {
            return this.major || 0;
        },

        /**
         * Returns the minor component value.
         * @return {Number} minor
         */
        getMinor: function() {
            return this.minor || 0;
        },

        /**
         * Returns the patch component value.
         * @return {Number} patch
         */
        getPatch: function() {
            return this.patch || 0;
        },

        /**
         * Returns the build component value.
         * @return {Number} build
         */
        getBuild: function() {
            return this.build || 0;
        },

        /**
         * Returns the release component value.
         * @return {Number} release
         */
        getRelease: function() {
            return this.release || '';
        },

        /**
         * Returns whether this version if greater than the supplied argument.
         * @param {String/Number} target The version to compare with.
         * @return {Boolean} `true` if this version if greater than the target, `false` otherwise.
         */
        isGreaterThan: function(target) {
            return Version.compare(this.version, target) === 1;
        },

        /**
         * Returns whether this version if greater than or equal to the supplied argument.
         * @param {String/Number} target The version to compare with.
         * @return {Boolean} `true` if this version if greater than or equal to the target, `false` otherwise.
         */
        isGreaterThanOrEqual: function(target) {
            return Version.compare(this.version, target) >= 0;
        },

        /**
         * Returns whether this version if smaller than the supplied argument.
         * @param {String/Number} target The version to compare with.
         * @return {Boolean} `true` if this version if smaller than the target, `false` otherwise.
         */
        isLessThan: function(target) {
            return Version.compare(this.version, target) === -1;
        },

        /**
         * Returns whether this version if less than or equal to the supplied argument.
         * @param {String/Number} target The version to compare with.
         * @return {Boolean} `true` if this version if less than or equal to the target, `false` otherwise.
         */
        isLessThanOrEqual: function(target) {
            return Version.compare(this.version, target) <= 0;
        },

        /**
         * Returns whether this version equals to the supplied argument.
         * @param {String/Number} target The version to compare with.
         * @return {Boolean} `true` if this version equals to the target, `false` otherwise.
         */
        equals: function(target) {
            return Version.compare(this.version, target) === 0;
        },

        /**
         * Returns whether this version matches the supplied argument. Example:
         * 
         *     var version = new Ext.Version('1.0.2beta');
         *     console.log(version.match(1)); // true
         *     console.log(version.match(1.0)); // true
         *     console.log(version.match('1.0.2')); // true
         *     console.log(version.match('1.0.2RC')); // false
         * 
         * @param {String/Number} target The version to compare with.
         * @return {Boolean} `true` if this version matches the target, `false` otherwise.
         */
        match: function(target) {
            target = String(target);
            return this.version.substr(0, target.length) === target;
        },

        /**
         * Returns this format: [major, minor, patch, build, release]. Useful for comparison.
         * @return {Number[]}
         */
        toArray: function() {
            return [this.getMajor(), this.getMinor(), this.getPatch(), this.getBuild(), this.getRelease()];
        },

        /**
         * Returns shortVersion version without dots and release.
         * @return {String}
         */
        getShortVersion: function() {
            return this.shortVersion;
        },

        /**
         * Convenient alias to {@link Ext.Version#isGreaterThan isGreaterThan}
         * @param {String/Number} target
         * @return {Boolean}
         */
        gt: function() {
            return this.isGreaterThan.apply(this, arguments);
        },

        /**
         * Convenient alias to {@link Ext.Version#isLessThan isLessThan}
         * @param {String/Number} target
         * @return {Boolean}
         */
        lt: function() {
            return this.isLessThan.apply(this, arguments);
        },

        /**
         * Convenient alias to {@link Ext.Version#isGreaterThanOrEqual isGreaterThanOrEqual}
         * @param {String/Number} target
         * @return {Boolean}
         */
        gtEq: function() {
            return this.isGreaterThanOrEqual.apply(this, arguments);
        },

        /**
         * Convenient alias to {@link Ext.Version#isLessThanOrEqual isLessThanOrEqual}
         * @param {String/Number} target
         * @return {Boolean}
         */
        ltEq: function() {
            return this.isLessThanOrEqual.apply(this, arguments);
        }
    });

    Ext.apply(Version, {
        // @private
        releaseValueMap: {
            'dev': -6,
            'alpha': -5,
            'a': -5,
            'beta': -4,
            'b': -4,
            'rc': -3,
            '#': -2,
            'p': -1,
            'pl': -1
        },

        /**
         * Converts a version component to a comparable value.
         *
         * @static
         * @param {Object} value The value to convert
         * @return {Object}
         */
        getComponentValue: function(value) {
            return !value ? 0 : (isNaN(value) ? this.releaseValueMap[value] || value : parseInt(value, 10));
        },

        /**
         * Compare 2 specified versions, starting from left to right. If a part contains special version strings,
         * they are handled in the following order:
         * 'dev' < 'alpha' = 'a' < 'beta' = 'b' < 'RC' = 'rc' < '#' < 'pl' = 'p' < 'anything else'
         *
         * @static
         * @param {String} current The current version to compare to.
         * @param {String} target The target version to compare to.
         * @return {Number} Returns -1 if the current version is smaller than the target version, 1 if greater, and 0 if they're equivalent.
         */
        compare: function(current, target) {
            var currentValue, targetValue, i;

            current = new Version(current).toArray();
            target = new Version(target).toArray();

            for (i = 0; i < Math.max(current.length, target.length); i++) {
                currentValue = this.getComponentValue(current[i]);
                targetValue = this.getComponentValue(target[i]);

                if (currentValue < targetValue) {
                    return -1;
                } else if (currentValue > targetValue) {
                    return 1;
                }
            }

            return 0;
        }
    });

    Ext.apply(Ext, {
        /**
         * @private
         */
        versions: {},

        /**
         * @private
         */
        lastRegisteredVersion: null,

        /**
         * Set version number for the given package name.
         *
         * @param {String} packageName The package name, for example: 'core', 'touch', 'extjs'.
         * @param {String/Ext.Version} version The version, for example: '1.2.3alpha', '2.4.0-dev'.
         * @return {Ext}
         */
        setVersion: function(packageName, version) {
            Ext.versions[packageName] = new Version(version);
            Ext.lastRegisteredVersion = Ext.versions[packageName];

            return this;
        },

        /**
         * Get the version number of the supplied package name; will return the last registered version
         * (last `Ext.setVersion()` call) if there's no package name given.
         *
         * @param {String} packageName (Optional) The package name, for example: 'core', 'touch', 'extjs'.
         * @return {Ext.Version} The version.
         */
        getVersion: function(packageName) {
            if (packageName === undefined) {
                return Ext.lastRegisteredVersion;
            }

            return Ext.versions[packageName];
        },

        /**
         * Create a closure for deprecated code.
         *
         *     // This means Ext.oldMethod is only supported in 4.0.0beta and older.
         *     // If Ext.getVersion('extjs') returns a version that is later than '4.0.0beta', for example '4.0.0RC',
         *     // the closure will not be invoked
         *     Ext.deprecate('extjs', '4.0.0beta', function() {
         *         Ext.oldMethod = Ext.newMethod;
         *         // ...
         *     });
         *
         * @param {String} packageName The package name.
         * @param {String} since The last version before it's deprecated.
         * @param {Function} closure The callback function to be executed with the specified version is less than the current version.
         * @param {Object} scope The execution scope (`this`) if the closure
         */
        deprecate: function(packageName, since, closure, scope) {
            if (Version.compare(Ext.getVersion(packageName), since) < 1) {
                closure.call(scope);
            }
        }
    }); // End Versioning

    Ext.setVersion('core', version);

})();

//@tag foundation,core
//@define Ext.String
//@require Ext.Version

/**
 * @class Ext.String
 *
 * A collection of useful static methods to deal with strings.
 * @singleton
 */

Ext.String = {
    trimRegex: /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g,
    escapeRe: /('|\\)/g,
    formatRe: /\{(\d+)\}/g,
    escapeRegexRe: /([-.*+?^${}()|[\]\/\\])/g,

    /**
     * Convert certain characters (&, <, >, and ") to their HTML character equivalents for literal display in web pages.
     * @param {String} value The string to encode.
     * @return {String} The encoded text.
     * @method
     */
    htmlEncode: (function() {
        var entities = {
            '&': '&amp;',
            '>': '&gt;',
            '<': '&lt;',
            '"': '&quot;'
        }, keys = [], p, regex;

        for (p in entities) {
            keys.push(p);
        }

        regex = new RegExp('(' + keys.join('|') + ')', 'g');

        return function(value) {
            return (!value) ? value : String(value).replace(regex, function(match, capture) {
                return entities[capture];
            });
        };
    })(),

    /**
     * Convert certain characters (&, <, >, and ") from their HTML character equivalents.
     * @param {String} value The string to decode.
     * @return {String} The decoded text.
     * @method
     */
    htmlDecode: (function() {
        var entities = {
            '&amp;': '&',
            '&gt;': '>',
            '&lt;': '<',
            '&quot;': '"'
        }, keys = [], p, regex;

        for (p in entities) {
            keys.push(p);
        }

        regex = new RegExp('(' + keys.join('|') + '|&#[0-9]{1,5};' + ')', 'g');

        return function(value) {
            return (!value) ? value : String(value).replace(regex, function(match, capture) {
                if (capture in entities) {
                    return entities[capture];
                } else {
                    return String.fromCharCode(parseInt(capture.substr(2), 10));
                }
            });
        };
    })(),

    /**
     * Appends content to the query string of a URL, handling logic for whether to place
     * a question mark or ampersand.
     * @param {String} url The URL to append to.
     * @param {String} string The content to append to the URL.
     * @return {String} The resulting URL.
     */
    urlAppend : function(url, string) {
        if (!Ext.isEmpty(string)) {
            return url + (url.indexOf('?') === -1 ? '?' : '&') + string;
        }

        return url;
    },

    /**
     * Trims whitespace from either end of a string, leaving spaces within the string intact.  Example:
     *
     *     @example
     *     var s = '  foo bar  ';
     *     alert('-' + s + '-'); // alerts "-  foo bar  -"
     *     alert('-' + Ext.String.trim(s) + '-'); // alerts "-foo bar-"
     *
     * @param {String} string The string to escape
     * @return {String} The trimmed string
     */
    trim: function(string) {
        return string.replace(Ext.String.trimRegex, "");
    },

    /**
     * Capitalize the given string.
     * @param {String} string
     * @return {String}
     */
    capitalize: function(string) {
        return string.charAt(0).toUpperCase() + string.substr(1);
    },

    /**
     * Truncate a string and add an ellipsis ('...') to the end if it exceeds the specified length.
     * @param {String} value The string to truncate.
     * @param {Number} length The maximum length to allow before truncating.
     * @param {Boolean} word `true` to try to find a common word break.
     * @return {String} The converted text.
     */
    ellipsis: function(value, len, word) {
        if (value && value.length > len) {
            if (word) {
                var vs = value.substr(0, len - 2),
                index = Math.max(vs.lastIndexOf(' '), vs.lastIndexOf('.'), vs.lastIndexOf('!'), vs.lastIndexOf('?'));
                if (index !== -1 && index >= (len - 15)) {
                    return vs.substr(0, index) + "...";
                }
            }
            return value.substr(0, len - 3) + "...";
        }
        return value;
    },

    /**
     * Escapes the passed string for use in a regular expression.
     * @param {String} string
     * @return {String}
     */
    escapeRegex: function(string) {
        return string.replace(Ext.String.escapeRegexRe, "\\$1");
    },

    /**
     * Escapes the passed string for ' and \.
     * @param {String} string The string to escape.
     * @return {String} The escaped string.
     */
    escape: function(string) {
        return string.replace(Ext.String.escapeRe, "\\$1");
    },

    /**
     * Utility function that allows you to easily switch a string between two alternating values.  The passed value
     * is compared to the current string, and if they are equal, the other value that was passed in is returned.  If
     * they are already different, the first value passed in is returned.  Note that this method returns the new value
     * but does not change the current string.
     *
     *     // alternate sort directions
     *     sort = Ext.String.toggle(sort, 'ASC', 'DESC');
     *
     *     // instead of conditional logic:
     *     sort = (sort == 'ASC' ? 'DESC' : 'ASC');
     *
     * @param {String} string The current string.
     * @param {String} value The value to compare to the current string.
     * @param {String} other The new value to use if the string already equals the first value passed in.
     * @return {String} The new value.
     */
    toggle: function(string, value, other) {
        return string === value ? other : value;
    },

    /**
     * Pads the left side of a string with a specified character.  This is especially useful
     * for normalizing number and date strings.  Example usage:
     *
     *     var s = Ext.String.leftPad('123', 5, '0');
     *     alert(s); // '00123'
     *
     * @param {String} string The original string.
     * @param {Number} size The total length of the output string.
     * @param {String} [character= ] (optional) The character with which to pad the original string (defaults to empty string " ").
     * @return {String} The padded string.
     */
    leftPad: function(string, size, character) {
        var result = String(string);
        character = character || " ";
        while (result.length < size) {
            result = character + result;
        }
        return result;
    },

    /**
     * Allows you to define a tokenized string and pass an arbitrary number of arguments to replace the tokens.  Each
     * token must be unique, and must increment in the format {0}, {1}, etc.  Example usage:
     *
     *     var cls = 'my-class',
     *         text = 'Some text';
     *     var s = Ext.String.format('<div class="{0}">{1}</div>', cls, text);
     *     alert(s); // '<div class="my-class">Some text</div>'
     *
     * @param {String} string The tokenized string to be formatted.
     * @param {String} value1 The value to replace token {0}.
     * @param {String} value2 Etc...
     * @return {String} The formatted string.
     */
    format: function(format) {
        var args = Ext.Array.toArray(arguments, 1);
        return format.replace(Ext.String.formatRe, function(m, i) {
            return args[i];
        });
    },

    /**
     * Returns a string with a specified number of repetitions a given string pattern.
     * The pattern be separated by a different string.
     *
     *     var s = Ext.String.repeat('---', 4); // '------------'
     *     var t = Ext.String.repeat('--', 3, '/'); // '--/--/--'
     *
     * @param {String} pattern The pattern to repeat.
     * @param {Number} count The number of times to repeat the pattern (may be 0).
     * @param {String} sep An option string to separate each pattern.
     */
    repeat: function(pattern, count, sep) {
        for (var buf = [], i = count; i--; ) {
            buf.push(pattern);
        }
        return buf.join(sep || '');
    }
};

/**
 * Old alias to {@link Ext.String#htmlEncode}.
 * @deprecated Use {@link Ext.String#htmlEncode} instead.
 * @method
 * @member Ext
 * @alias Ext.String#htmlEncode
 */
Ext.htmlEncode = Ext.String.htmlEncode;


/**
 * Old alias to {@link Ext.String#htmlDecode}.
 * @deprecated Use {@link Ext.String#htmlDecode} instead.
 * @method
 * @member Ext
 * @alias Ext.String#htmlDecode
 */
Ext.htmlDecode = Ext.String.htmlDecode;

/**
 * Old alias to {@link Ext.String#urlAppend}.
 * @deprecated Use {@link Ext.String#urlAppend} instead.
 * @method
 * @member Ext
 * @alias Ext.String#urlAppend
 */
Ext.urlAppend = Ext.String.urlAppend;

//@tag foundation,core
//@define Ext.Array
//@require Ext.String

/**
 * @class Ext.Array
 * @singleton
 * @author Jacky Nguyen <jacky@sencha.com>
 * @docauthor Jacky Nguyen <jacky@sencha.com>
 *
 * A set of useful static methods to deal with arrays; provide missing methods for older browsers.
 */
(function() {

    var arrayPrototype = Array.prototype,
        slice = arrayPrototype.slice,
        supportsSplice = function () {
            var array = [],
                lengthBefore,
                j = 20;

            if (!array.splice) {
                return false;
            }

            // This detects a bug in IE8 splice method:
            // see http://social.msdn.microsoft.com/Forums/en-US/iewebdevelopment/thread/6e946d03-e09f-4b22-a4dd-cd5e276bf05a/

            while (j--) {
                array.push("A");
            }

            array.splice(15, 0, "F", "F", "F", "F", "F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F");

            lengthBefore = array.length; //41
            array.splice(13, 0, "XXX"); // add one element

            if (lengthBefore+1 != array.length) {
                return false;
            }
            // end IE8 bug

            return true;
        }(),
        supportsForEach = 'forEach' in arrayPrototype,
        supportsMap = 'map' in arrayPrototype,
        supportsIndexOf = 'indexOf' in arrayPrototype,
        supportsEvery = 'every' in arrayPrototype,
        supportsSome = 'some' in arrayPrototype,
        supportsFilter = 'filter' in arrayPrototype,
        supportsSort = function() {
            var a = [1,2,3,4,5].sort(function(){ return 0; });
            return a[0] === 1 && a[1] === 2 && a[2] === 3 && a[3] === 4 && a[4] === 5;
        }(),
        supportsSliceOnNodeList = true,
        ExtArray;

    try {
        // IE 6 - 8 will throw an error when using Array.prototype.slice on NodeList
        if (typeof document !== 'undefined') {
            slice.call(document.getElementsByTagName('body'));
        }
    } catch (e) {
        supportsSliceOnNodeList = false;
    }

    function fixArrayIndex (array, index) {
        return (index < 0) ? Math.max(0, array.length + index)
                           : Math.min(array.length, index);
    }

    /*
    Does the same work as splice, but with a slightly more convenient signature. The splice
    method has bugs in IE8, so this is the implementation we use on that platform.

    The rippling of items in the array can be tricky. Consider two use cases:

                  index=2
                  removeCount=2
                 /=====\
        +---+---+---+---+---+---+---+---+
        | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
        +---+---+---+---+---+---+---+---+
                         /  \/  \/  \/  \
                        /   /\  /\  /\   \
                       /   /  \/  \/  \   +--------------------------+
                      /   /   /\  /\   +--------------------------+   \
                     /   /   /  \/  +--------------------------+   \   \
                    /   /   /   /+--------------------------+   \   \   \
                   /   /   /   /                             \   \   \   \
                  v   v   v   v                               v   v   v   v
        +---+---+---+---+---+---+       +---+---+---+---+---+---+---+---+---+
        | 0 | 1 | 4 | 5 | 6 | 7 |       | 0 | 1 | a | b | c | 4 | 5 | 6 | 7 |
        +---+---+---+---+---+---+       +---+---+---+---+---+---+---+---+---+
        A                               B        \=========/
                                                 insert=[a,b,c]

    In case A, it is obvious that copying of [4,5,6,7] must be left-to-right so
    that we don't end up with [0,1,6,7,6,7]. In case B, we have the opposite; we
    must go right-to-left or else we would end up with [0,1,a,b,c,4,4,4,4].
    */
    function replaceSim (array, index, removeCount, insert) {
        var add = insert ? insert.length : 0,
            length = array.length,
            pos = fixArrayIndex(array, index);

        // we try to use Array.push when we can for efficiency...
        if (pos === length) {
            if (add) {
                array.push.apply(array, insert);
            }
        } else {
            var remove = Math.min(removeCount, length - pos),
                tailOldPos = pos + remove,
                tailNewPos = tailOldPos + add - remove,
                tailCount = length - tailOldPos,
                lengthAfterRemove = length - remove,
                i;

            if (tailNewPos < tailOldPos) { // case A
                for (i = 0; i < tailCount; ++i) {
                    array[tailNewPos+i] = array[tailOldPos+i];
                }
            } else if (tailNewPos > tailOldPos) { // case B
                for (i = tailCount; i--; ) {
                    array[tailNewPos+i] = array[tailOldPos+i];
                }
            } // else, add == remove (nothing to do)

            if (add && pos === lengthAfterRemove) {
                array.length = lengthAfterRemove; // truncate array
                array.push.apply(array, insert);
            } else {
                array.length = lengthAfterRemove + add; // reserves space
                for (i = 0; i < add; ++i) {
                    array[pos+i] = insert[i];
                }
            }
        }

        return array;
    }

    function replaceNative (array, index, removeCount, insert) {
        if (insert && insert.length) {
            if (index < array.length) {
                array.splice.apply(array, [index, removeCount].concat(insert));
            } else {
                array.push.apply(array, insert);
            }
        } else {
            array.splice(index, removeCount);
        }
        return array;
    }

    function eraseSim (array, index, removeCount) {
        return replaceSim(array, index, removeCount);
    }

    function eraseNative (array, index, removeCount) {
        array.splice(index, removeCount);
        return array;
    }

    function spliceSim (array, index, removeCount) {
        var pos = fixArrayIndex(array, index),
            removed = array.slice(index, fixArrayIndex(array, pos+removeCount));

        if (arguments.length < 4) {
            replaceSim(array, pos, removeCount);
        } else {
            replaceSim(array, pos, removeCount, slice.call(arguments, 3));
        }

        return removed;
    }

    function spliceNative (array) {
        return array.splice.apply(array, slice.call(arguments, 1));
    }

    var erase = supportsSplice ? eraseNative : eraseSim,
        replace = supportsSplice ? replaceNative : replaceSim,
        splice = supportsSplice ? spliceNative : spliceSim;

    // NOTE: from here on, use erase, replace or splice (not native methods)...
    ExtArray = Ext.Array = {
        /**
         * Iterates an array or an iterable value and invoke the given callback function for each item.
         *
         *     var countries = ['Vietnam', 'Singapore', 'United States', 'Russia'];
         *
         *     Ext.Array.each(countries, function(name, index, countriesItSelf) {
         *         console.log(name);
         *     });
         *
         *     var sum = function() {
         *         var sum = 0;
         *
         *         Ext.Array.each(arguments, function(value) {
         *             sum += value;
         *         });
         *
         *         return sum;
         *     };
         *
         *     sum(1, 2, 3); // returns 6
         *
         * The iteration can be stopped by returning false in the function callback.
         *
         *     Ext.Array.each(countries, function(name, index, countriesItSelf) {
         *         if (name === 'Singapore') {
         *             return false; // break here
         *         }
         *     });
         *
         * {@link Ext#each Ext.each} is alias for {@link Ext.Array#each Ext.Array.each}
         *
         * @param {Array/NodeList/Object} iterable The value to be iterated. If this
         * argument is not iterable, the callback function is called once.
         * @param {Function} fn The callback function. If it returns `false`, the iteration stops and this method returns
         * the current `index`.
         * @param {Object} fn.item The item at the current `index` in the passed `array`
         * @param {Number} fn.index The current `index` within the `array`
         * @param {Array} fn.allItems The `array` itself which was passed as the first argument
         * @param {Boolean} fn.return Return false to stop iteration.
         * @param {Object} scope (Optional) The scope (`this` reference) in which the specified function is executed.
         * @param {Boolean} [reverse=false] (Optional) Reverse the iteration order (loop from the end to the beginning).
         * @return {Boolean} See description for the `fn` parameter.
         */
        each: function(array, fn, scope, reverse) {
            array = ExtArray.from(array);

            var i,
                ln = array.length;

            if (reverse !== true) {
                for (i = 0; i < ln; i++) {
                    if (fn.call(scope || array[i], array[i], i, array) === false) {
                        return i;
                    }
                }
            }
            else {
                for (i = ln - 1; i > -1; i--) {
                    if (fn.call(scope || array[i], array[i], i, array) === false) {
                        return i;
                    }
                }
            }

            return true;
        },

        /**
         * Iterates an array and invoke the given callback function for each item. Note that this will simply
         * delegate to the native `Array.prototype.forEach` method if supported. It doesn't support stopping the
         * iteration by returning `false` in the callback function like {@link Ext.Array#each}. However, performance
         * could be much better in modern browsers comparing with {@link Ext.Array#each}
         *
         * @param {Array} array The array to iterate.
         * @param {Function} fn The callback function.
         * @param {Object} fn.item The item at the current `index` in the passed `array`.
         * @param {Number} fn.index The current `index` within the `array`.
         * @param {Array}  fn.allItems The `array` itself which was passed as the first argument.
         * @param {Object} scope (Optional) The execution scope (`this`) in which the specified function is executed.
         */
        forEach: supportsForEach ? function(array, fn, scope) {
                return array.forEach(fn, scope);
        } : function(array, fn, scope) {
            var i = 0,
                ln = array.length;

            for (; i < ln; i++) {
                fn.call(scope, array[i], i, array);
            }
        },

        /**
         * Get the index of the provided `item` in the given `array`, a supplement for the
         * missing arrayPrototype.indexOf in Internet Explorer.
         *
         * @param {Array} array The array to check.
         * @param {Object} item The item to look for.
         * @param {Number} from (Optional) The index at which to begin the search.
         * @return {Number} The index of item in the array (or -1 if it is not found).
         */
        indexOf: (supportsIndexOf) ? function(array, item, from) {
            return array.indexOf(item, from);
        } : function(array, item, from) {
            var i, length = array.length;

            for (i = (from < 0) ? Math.max(0, length + from) : from || 0; i < length; i++) {
                if (array[i] === item) {
                    return i;
                }
            }

            return -1;
        },

        /**
         * Checks whether or not the given `array` contains the specified `item`.
         *
         * @param {Array} array The array to check.
         * @param {Object} item The item to look for.
         * @return {Boolean} `true` if the array contains the item, `false` otherwise.
         */
        contains: supportsIndexOf ? function(array, item) {
            return array.indexOf(item) !== -1;
        } : function(array, item) {
            var i, ln;

            for (i = 0, ln = array.length; i < ln; i++) {
                if (array[i] === item) {
                    return true;
                }
            }

            return false;
        },

        /**
         * Converts any iterable (numeric indices and a length property) into a true array.
         *
         *     function test() {
         *         var args = Ext.Array.toArray(arguments),
         *             fromSecondToLastArgs = Ext.Array.toArray(arguments, 1);
         *
         *         alert(args.join(' '));
         *         alert(fromSecondToLastArgs.join(' '));
         *     }
         *
         *     test('just', 'testing', 'here'); // alerts 'just testing here';
         *                                      // alerts 'testing here';
         *
         *     Ext.Array.toArray(document.getElementsByTagName('div')); // will convert the NodeList into an array
         *     Ext.Array.toArray('splitted'); // returns ['s', 'p', 'l', 'i', 't', 't', 'e', 'd']
         *     Ext.Array.toArray('splitted', 0, 3); // returns ['s', 'p', 'l', 'i']
         *
         * {@link Ext#toArray Ext.toArray} is alias for {@link Ext.Array#toArray Ext.Array.toArray}
         *
         * @param {Object} iterable the iterable object to be turned into a true Array.
         * @param {Number} [start=0] (Optional) a zero-based index that specifies the start of extraction.
         * @param {Number} [end=-1] (Optional) a zero-based index that specifies the end of extraction.
         * @return {Array}
         */
        toArray: function(iterable, start, end){
            if (!iterable || !iterable.length) {
                return [];
            }

            if (typeof iterable === 'string') {
                iterable = iterable.split('');
            }

            if (supportsSliceOnNodeList) {
                return slice.call(iterable, start || 0, end || iterable.length);
            }

            var array = [],
                i;

            start = start || 0;
            end = end ? ((end < 0) ? iterable.length + end : end) : iterable.length;

            for (i = start; i < end; i++) {
                array.push(iterable[i]);
            }

            return array;
        },

        /**
         * Plucks the value of a property from each item in the Array. Example:
         *
         *     Ext.Array.pluck(Ext.query("p"), "className"); // [el1.className, el2.className, ..., elN.className]
         *
         * @param {Array/NodeList} array The Array of items to pluck the value from.
         * @param {String} propertyName The property name to pluck from each element.
         * @return {Array} The value from each item in the Array.
         */
        pluck: function(array, propertyName) {
            var ret = [],
                i, ln, item;

            for (i = 0, ln = array.length; i < ln; i++) {
                item = array[i];

                ret.push(item[propertyName]);
            }

            return ret;
        },

        /**
         * Creates a new array with the results of calling a provided function on every element in this array.
         *
         * @param {Array} array
         * @param {Function} fn Callback function for each item.
         * @param {Object} scope Callback function scope.
         * @return {Array} results
         */
        map: supportsMap ? function(array, fn, scope) {
            return array.map(fn, scope);
        } : function(array, fn, scope) {
            var results = [],
                i = 0,
                len = array.length;

            for (; i < len; i++) {
                results[i] = fn.call(scope, array[i], i, array);
            }

            return results;
        },

        /**
         * Executes the specified function for each array element until the function returns a falsy value.
         * If such an item is found, the function will return `false` immediately.
         * Otherwise, it will return `true`.
         *
         * @param {Array} array
         * @param {Function} fn Callback function for each item.
         * @param {Object} scope Callback function scope.
         * @return {Boolean} `true` if no `false` value is returned by the callback function.
         */
        every: function(array, fn, scope) {
            //<debug>
            if (!fn) {
                Ext.Error.raise('Ext.Array.every must have a callback function passed as second argument.');
            }
            //</debug>
            if (supportsEvery) {
                return array.every(fn, scope);
            }

            var i = 0,
                ln = array.length;

            for (; i < ln; ++i) {
                if (!fn.call(scope, array[i], i, array)) {
                    return false;
                }
            }

            return true;
        },

        /**
         * Executes the specified function for each array element until the function returns a truthy value.
         * If such an item is found, the function will return `true` immediately. Otherwise, it will return `false`.
         *
         * @param {Array} array
         * @param {Function} fn Callback function for each item.
         * @param {Object} scope Callback function scope.
         * @return {Boolean} `true` if the callback function returns a truthy value.
         */
        some: function(array, fn, scope) {
            //<debug>
            if (!fn) {
                Ext.Error.raise('Ext.Array.some must have a callback function passed as second argument.');
            }
            //</debug>
            if (supportsSome) {
                return array.some(fn, scope);
            }

            var i = 0,
                ln = array.length;

            for (; i < ln; ++i) {
                if (fn.call(scope, array[i], i, array)) {
                    return true;
                }
            }

            return false;
        },

        /**
         * Filter through an array and remove empty item as defined in {@link Ext#isEmpty Ext.isEmpty}.
         *
         * See {@link Ext.Array#filter}
         *
         * @param {Array} array
         * @return {Array} results
         */
        clean: function(array) {
            var results = [],
                i = 0,
                ln = array.length,
                item;

            for (; i < ln; i++) {
                item = array[i];

                if (!Ext.isEmpty(item)) {
                    results.push(item);
                }
            }

            return results;
        },

        /**
         * Returns a new array with unique items.
         *
         * @param {Array} array
         * @return {Array} results
         */
        unique: function(array) {
            var clone = [],
                i = 0,
                ln = array.length,
                item;

            for (; i < ln; i++) {
                item = array[i];

                if (ExtArray.indexOf(clone, item) === -1) {
                    clone.push(item);
                }
            }

            return clone;
        },

        /**
         * Creates a new array with all of the elements of this array for which
         * the provided filtering function returns `true`.
         *
         * @param {Array} array
         * @param {Function} fn Callback function for each item.
         * @param {Object} scope Callback function scope.
         * @return {Array} results
         */
        filter: function(array, fn, scope) {
            if (supportsFilter) {
                return array.filter(fn, scope);
            }

            var results = [],
                i = 0,
                ln = array.length;

            for (; i < ln; i++) {
                if (fn.call(scope, array[i], i, array)) {
                    results.push(array[i]);
                }
            }

            return results;
        },

        /**
         * Converts a value to an array if it's not already an array; returns:
         *
         * - An empty array if given value is `undefined` or `null`
         * - Itself if given value is already an array
         * - An array copy if given value is {@link Ext#isIterable iterable} (arguments, NodeList and alike)
         * - An array with one item which is the given value, otherwise
         *
         * @param {Object} value The value to convert to an array if it's not already is an array.
         * @param {Boolean} [newReference=false] (Optional) `true` to clone the given array and return a new reference if necessary.
         * @return {Array} array
         */
        from: function(value, newReference) {
            if (value === undefined || value === null) {
                return [];
            }

            if (Ext.isArray(value)) {
                return (newReference) ? slice.call(value) : value;
            }

            if (value && value.length !== undefined && typeof value !== 'string') {
                return ExtArray.toArray(value);
            }

            return [value];
        },

        /**
         * Removes the specified item from the array if it exists.
         *
         * @param {Array} array The array.
         * @param {Object} item The item to remove.
         * @return {Array} The passed array itself.
         */
        remove: function(array, item) {
            var index = ExtArray.indexOf(array, item);

            if (index !== -1) {
                erase(array, index, 1);
            }

            return array;
        },

        /**
         * Push an item into the array only if the array doesn't contain it yet.
         *
         * @param {Array} array The array.
         * @param {Object} item The item to include.
         */
        include: function(array, item) {
            if (!ExtArray.contains(array, item)) {
                array.push(item);
            }
        },

        /**
         * Clone a flat array without referencing the previous one. Note that this is different
         * from `Ext.clone` since it doesn't handle recursive cloning. It's simply a convenient, easy-to-remember method
         * for `Array.prototype.slice.call(array)`.
         *
         * @param {Array} array The array
         * @return {Array} The clone array
         */
        clone: function(array) {
            return slice.call(array);
        },

        /**
         * Merge multiple arrays into one with unique items.
         *
         * {@link Ext.Array#union} is alias for {@link Ext.Array#merge}
         *
         * @param {Array} array1
         * @param {Array} array2
         * @param {Array} etc
         * @return {Array} merged
         */
        merge: function() {
            var args = slice.call(arguments),
                array = [],
                i, ln;

            for (i = 0, ln = args.length; i < ln; i++) {
                array = array.concat(args[i]);
            }

            return ExtArray.unique(array);
        },

        /**
         * Merge multiple arrays into one with unique items that exist in all of the arrays.
         *
         * @param {Array} array1
         * @param {Array} array2
         * @param {Array} etc
         * @return {Array} intersect
         */
        intersect: function() {
            var intersect = [],
                arrays = slice.call(arguments),
                i, j, k, minArray, array, x, y, ln, arraysLn, arrayLn;

            if (!arrays.length) {
                return intersect;
            }

            // Find the smallest array
            for (i = x = 0,ln = arrays.length; i < ln,array = arrays[i]; i++) {
                if (!minArray || array.length < minArray.length) {
                    minArray = array;
                    x = i;
                }
            }

            minArray = ExtArray.unique(minArray);
            erase(arrays, x, 1);

            // Use the smallest unique'd array as the anchor loop. If the other array(s) do contain
            // an item in the small array, we're likely to find it before reaching the end
            // of the inner loop and can terminate the search early.
            for (i = 0,ln = minArray.length; i < ln,x = minArray[i]; i++) {
                var count = 0;

                for (j = 0,arraysLn = arrays.length; j < arraysLn,array = arrays[j]; j++) {
                    for (k = 0,arrayLn = array.length; k < arrayLn,y = array[k]; k++) {
                        if (x === y) {
                            count++;
                            break;
                        }
                    }
                }

                if (count === arraysLn) {
                    intersect.push(x);
                }
            }

            return intersect;
        },

        /**
         * Perform a set difference A-B by subtracting all items in array B from array A.
         *
         * @param {Array} arrayA
         * @param {Array} arrayB
         * @return {Array} difference
         */
        difference: function(arrayA, arrayB) {
            var clone = slice.call(arrayA),
                ln = clone.length,
                i, j, lnB;

            for (i = 0,lnB = arrayB.length; i < lnB; i++) {
                for (j = 0; j < ln; j++) {
                    if (clone[j] === arrayB[i]) {
                        erase(clone, j, 1);
                        j--;
                        ln--;
                    }
                }
            }

            return clone;
        },

        /**
         * Returns a shallow copy of a part of an array. This is equivalent to the native
         * call `Array.prototype.slice.call(array, begin, end)`. This is often used when "array"
         * is "arguments" since the arguments object does not supply a slice method but can
         * be the context object to `Array.prototype.slice()`.
         *
         * @param {Array} array The array (or arguments object).
         * @param {Number} begin The index at which to begin. Negative values are offsets from
         * the end of the array.
         * @param {Number} end The index at which to end. The copied items do not include
         * end. Negative values are offsets from the end of the array. If end is omitted,
         * all items up to the end of the array are copied.
         * @return {Array} The copied piece of the array.
         */
        slice: function(array, begin, end) {
            return slice.call(array, begin, end);
        },

        /**
         * Sorts the elements of an Array.
         * By default, this method sorts the elements alphabetically and ascending.
         *
         * @param {Array} array The array to sort.
         * @param {Function} sortFn (optional) The comparison function.
         * @return {Array} The sorted array.
         */
        sort: function(array, sortFn) {
            if (supportsSort) {
                if (sortFn) {
                    return array.sort(sortFn);
                } else {
                    return array.sort();
                }
            }

            var length = array.length,
                i = 0,
                comparison,
                j, min, tmp;

            for (; i < length; i++) {
                min = i;
                for (j = i + 1; j < length; j++) {
                    if (sortFn) {
                        comparison = sortFn(array[j], array[min]);
                        if (comparison < 0) {
                            min = j;
                        }
                    } else if (array[j] < array[min]) {
                        min = j;
                    }
                }
                if (min !== i) {
                    tmp = array[i];
                    array[i] = array[min];
                    array[min] = tmp;
                }
            }

            return array;
        },

        /**
         * Recursively flattens into 1-d Array. Injects Arrays inline.
         *
         * @param {Array} array The array to flatten
         * @return {Array} The 1-d array.
         */
        flatten: function(array) {
            var worker = [];

            function rFlatten(a) {
                var i, ln, v;

                for (i = 0, ln = a.length; i < ln; i++) {
                    v = a[i];

                    if (Ext.isArray(v)) {
                        rFlatten(v);
                    } else {
                        worker.push(v);
                    }
                }

                return worker;
            }

            return rFlatten(array);
        },

        /**
         * Returns the minimum value in the Array.
         *
         * @param {Array/NodeList} array The Array from which to select the minimum value.
         * @param {Function} comparisonFn (optional) a function to perform the comparison which determines minimization.
         * If omitted the "<" operator will be used.
         * __Note:__ gt = 1; eq = 0; lt = -1
         * @return {Object} minValue The minimum value.
         */
        min: function(array, comparisonFn) {
            var min = array[0],
                i, ln, item;

            for (i = 0, ln = array.length; i < ln; i++) {
                item = array[i];

                if (comparisonFn) {
                    if (comparisonFn(min, item) === 1) {
                        min = item;
                    }
                }
                else {
                    if (item < min) {
                        min = item;
                    }
                }
            }

            return min;
        },

        /**
         * Returns the maximum value in the Array.
         *
         * @param {Array/NodeList} array The Array from which to select the maximum value.
         * @param {Function} comparisonFn (optional) a function to perform the comparison which determines maximization.
         * If omitted the ">" operator will be used.
         * __Note:__ gt = 1; eq = 0; lt = -1
         * @return {Object} maxValue The maximum value
         */
        max: function(array, comparisonFn) {
            var max = array[0],
                i, ln, item;

            for (i = 0, ln = array.length; i < ln; i++) {
                item = array[i];

                if (comparisonFn) {
                    if (comparisonFn(max, item) === -1) {
                        max = item;
                    }
                }
                else {
                    if (item > max) {
                        max = item;
                    }
                }
            }

            return max;
        },

        /**
         * Calculates the mean of all items in the array.
         *
         * @param {Array} array The Array to calculate the mean value of.
         * @return {Number} The mean.
         */
        mean: function(array) {
            return array.length > 0 ? ExtArray.sum(array) / array.length : undefined;
        },

        /**
         * Calculates the sum of all items in the given array.
         *
         * @param {Array} array The Array to calculate the sum value of.
         * @return {Number} The sum.
         */
        sum: function(array) {
            var sum = 0,
                i, ln, item;

            for (i = 0,ln = array.length; i < ln; i++) {
                item = array[i];

                sum += item;
            }

            return sum;
        },

        //<debug>
        _replaceSim: replaceSim, // for unit testing
        _spliceSim: spliceSim,
        //</debug>

        /**
         * Removes items from an array. This is functionally equivalent to the splice method
         * of Array, but works around bugs in IE8's splice method and does not copy the
         * removed elements in order to return them (because very often they are ignored).
         *
         * @param {Array} array The Array on which to replace.
         * @param {Number} index The index in the array at which to operate.
         * @param {Number} removeCount The number of items to remove at index.
         * @return {Array} The array passed.
         * @method
         */
        erase: erase,

        /**
         * Inserts items in to an array.
         *
         * @param {Array} array The Array on which to replace.
         * @param {Number} index The index in the array at which to operate.
         * @param {Array} items The array of items to insert at index.
         * @return {Array} The array passed.
         */
        insert: function (array, index, items) {
            return replace(array, index, 0, items);
        },

        /**
         * Replaces items in an array. This is functionally equivalent to the splice method
         * of Array, but works around bugs in IE8's splice method and is often more convenient
         * to call because it accepts an array of items to insert rather than use a variadic
         * argument list.
         *
         * @param {Array} array The Array on which to replace.
         * @param {Number} index The index in the array at which to operate.
         * @param {Number} removeCount The number of items to remove at index (can be 0).
         * @param {Array} insert (optional) An array of items to insert at index.
         * @return {Array} The array passed.
         * @method
         */
        replace: replace,

        /**
         * Replaces items in an array. This is equivalent to the splice method of Array, but
         * works around bugs in IE8's splice method. The signature is exactly the same as the
         * splice method except that the array is the first argument. All arguments following
         * removeCount are inserted in the array at index.
         *
         * @param {Array} array The Array on which to replace.
         * @param {Number} index The index in the array at which to operate.
         * @param {Number} removeCount The number of items to remove at index (can be 0).
         * @return {Array} An array containing the removed items.
         * @method
         */
        splice: splice
    };

    /**
     * @method
     * @member Ext
     * @alias Ext.Array#each
     */
    Ext.each = ExtArray.each;

    /**
     * @method
     * @member Ext.Array
     * @alias Ext.Array#merge
     */
    ExtArray.union = ExtArray.merge;

    /**
     * Old alias to {@link Ext.Array#min}
     * @deprecated 4.0.0 Please use {@link Ext.Array#min} instead
     * @method
     * @member Ext
     * @alias Ext.Array#min
     */
    Ext.min = ExtArray.min;

    /**
     * Old alias to {@link Ext.Array#max}
     * @deprecated 4.0.0 Please use {@link Ext.Array#max} instead
     * @method
     * @member Ext
     * @alias Ext.Array#max
     */
    Ext.max = ExtArray.max;

    /**
     * Old alias to {@link Ext.Array#sum}
     * @deprecated 4.0.0 Please use {@link Ext.Array#sum} instead
     * @method
     * @member Ext
     * @alias Ext.Array#sum
     */
    Ext.sum = ExtArray.sum;

    /**
     * Old alias to {@link Ext.Array#mean}
     * @deprecated 4.0.0 Please use {@link Ext.Array#mean} instead
     * @method
     * @member Ext
     * @alias Ext.Array#mean
     */
    Ext.mean = ExtArray.mean;

    /**
     * Old alias to {@link Ext.Array#flatten}
     * @deprecated 4.0.0 Please use {@link Ext.Array#flatten} instead
     * @method
     * @member Ext
     * @alias Ext.Array#flatten
     */
    Ext.flatten = ExtArray.flatten;

    /**
     * Old alias to {@link Ext.Array#clean}
     * @deprecated 4.0.0 Please use {@link Ext.Array#clean} instead
     * @method
     * @member Ext
     * @alias Ext.Array#clean
     */
    Ext.clean = ExtArray.clean;

    /**
     * Old alias to {@link Ext.Array#unique}
     * @deprecated 4.0.0 Please use {@link Ext.Array#unique} instead
     * @method
     * @member Ext
     * @alias Ext.Array#unique
     */
    Ext.unique = ExtArray.unique;

    /**
     * Old alias to {@link Ext.Array#pluck Ext.Array.pluck}
     * @deprecated 4.0.0 Please use {@link Ext.Array#pluck Ext.Array.pluck} instead
     * @method
     * @member Ext
     * @alias Ext.Array#pluck
     */
    Ext.pluck = ExtArray.pluck;

    /**
     * @method
     * @member Ext
     * @alias Ext.Array#toArray
     */
    Ext.toArray = function() {
        return ExtArray.toArray.apply(ExtArray, arguments);
    };
})();

//@tag foundation,core
//@define Ext.Number
//@require Ext.Array

/**
 * @class Ext.Number
 *
 * A collection of useful static methods to deal with numbers
 * @singleton
 */

(function() {

var isToFixedBroken = (0.9).toFixed() !== '1';

Ext.Number = {
    /**
     * Checks whether or not the passed number is within a desired range.  If the number is already within the
     * range it is returned, otherwise the min or max value is returned depending on which side of the range is
     * exceeded. Note that this method returns the constrained value but does not change the current number.
     * @param {Number} number The number to check
     * @param {Number} min The minimum number in the range
     * @param {Number} max The maximum number in the range
     * @return {Number} The constrained value if outside the range, otherwise the current value
     */
    constrain: function(number, min, max) {
        number = parseFloat(number);

        if (!isNaN(min)) {
            number = Math.max(number, min);
        }
        if (!isNaN(max)) {
            number = Math.min(number, max);
        }
        return number;
    },

    /**
     * Snaps the passed number between stopping points based upon a passed increment value.
     * @param {Number} value The unsnapped value.
     * @param {Number} increment The increment by which the value must move.
     * @param {Number} minValue The minimum value to which the returned value must be constrained. Overrides the increment..
     * @param {Number} maxValue The maximum value to which the returned value must be constrained. Overrides the increment..
     * @return {Number} The value of the nearest snap target.
     */
    snap : function(value, increment, minValue, maxValue) {
        var newValue = value,
            m;

        if (!(increment && value)) {
            return value;
        }
        m = value % increment;
        if (m !== 0) {
            newValue -= m;
            if (m * 2 >= increment) {
                newValue += increment;
            } else if (m * 2 < -increment) {
                newValue -= increment;
            }
        }
        return Ext.Number.constrain(newValue, minValue,  maxValue);
    },

    /**
     * Formats a number using fixed-point notation
     * @param {Number} value The number to format
     * @param {Number} precision The number of digits to show after the decimal point
     */
    toFixed: function(value, precision) {
        if (isToFixedBroken) {
            precision = precision || 0;
            var pow = Math.pow(10, precision);
            return (Math.round(value * pow) / pow).toFixed(precision);
        }

        return value.toFixed(precision);
    },

    /**
     * Validate that a value is numeric and convert it to a number if necessary. Returns the specified default value if
     * it is not.

Ext.Number.from('1.23', 1); // returns 1.23
Ext.Number.from('abc', 1); // returns 1

     * @param {Object} value
     * @param {Number} defaultValue The value to return if the original value is non-numeric
     * @return {Number} value, if numeric, defaultValue otherwise
     */
    from: function(value, defaultValue) {
        if (isFinite(value)) {
            value = parseFloat(value);
        }

        return !isNaN(value) ? value : defaultValue;
    }
};

})();

/**
 * This method is deprecated, please use {@link Ext.Number#from Ext.Number.from} instead
 *
 * @deprecated 4.0.0 Replaced by Ext.Number.from
 * @member Ext
 * @method num
 */
Ext.num = function() {
    return Ext.Number.from.apply(this, arguments);
};

//@tag foundation,core
//@define Ext.Object
//@require Ext.Number

/**
 * @author Jacky Nguyen <jacky@sencha.com>
 * @docauthor Jacky Nguyen <jacky@sencha.com>
 * @class Ext.Object
 *
 * A collection of useful static methods to deal with objects.
 *
 * @singleton
 */

(function() {

// The "constructor" for chain:
var TemplateClass = function(){};

var ExtObject = Ext.Object = {

    /**
     * Returns a new object with the given object as the prototype chain.
     * @param {Object} object The prototype chain for the new object.
     */
    chain: ('create' in Object) ? function(object){
        return Object.create(object);
    } : function (object) {
        TemplateClass.prototype = object;
        var result = new TemplateClass();
        TemplateClass.prototype = null;
        return result;
    },

    /**
     * Convert a `name` - `value` pair to an array of objects with support for nested structures; useful to construct
     * query strings. For example:
     *
     * Non-recursive:
     *
     *     var objects = Ext.Object.toQueryObjects('hobbies', ['reading', 'cooking', 'swimming']);
     *
     *     // objects then equals:
     *     [
     *         { name: 'hobbies', value: 'reading' },
     *         { name: 'hobbies', value: 'cooking' },
     *         { name: 'hobbies', value: 'swimming' }
     *     ]
     *
     * Recursive:
     *
     *     var objects = Ext.Object.toQueryObjects('dateOfBirth', {
     *         day: 3,
     *         month: 8,
     *         year: 1987,
     *         extra: {
     *             hour: 4,
     *             minute: 30
     *         }
     *     }, true);
     *
     *     // objects then equals:
     *     [
     *         { name: 'dateOfBirth[day]', value: 3 },
     *         { name: 'dateOfBirth[month]', value: 8 },
     *         { name: 'dateOfBirth[year]', value: 1987 },
     *         { name: 'dateOfBirth[extra][hour]', value: 4 },
     *         { name: 'dateOfBirth[extra][minute]', value: 30 }
     *     ]
     *
     * @param {String} name
     * @param {Object} value
     * @param {Boolean} [recursive=false] `true` to recursively encode any sub-objects.
     * @return {Object[]} Array of objects with `name` and `value` fields.
     */
    toQueryObjects: function(name, value, recursive) {
        var self = ExtObject.toQueryObjects,
            objects = [],
            i, ln;

        if (Ext.isArray(value)) {
            for (i = 0, ln = value.length; i < ln; i++) {
                if (recursive) {
                    objects = objects.concat(self(name + '[' + i + ']', value[i], true));
                }
                else {
                    objects.push({
                        name: name,
                        value: value[i]
                    });
                }
            }
        }
        else if (Ext.isObject(value)) {
            for (i in value) {
                if (value.hasOwnProperty(i)) {
                    if (recursive) {
                        objects = objects.concat(self(name + '[' + i + ']', value[i], true));
                    }
                    else {
                        objects.push({
                            name: name,
                            value: value[i]
                        });
                    }
                }
            }
        }
        else {
            objects.push({
                name: name,
                value: value
            });
        }

        return objects;
    },

    /**
     * Takes an object and converts it to an encoded query string.
     *
     * Non-recursive:
     *
     *     Ext.Object.toQueryString({foo: 1, bar: 2}); // returns "foo=1&bar=2"
     *     Ext.Object.toQueryString({foo: null, bar: 2}); // returns "foo=&bar=2"
     *     Ext.Object.toQueryString({'some price': '$300'}); // returns "some%20price=%24300"
     *     Ext.Object.toQueryString({date: new Date(2011, 0, 1)}); // returns "date=%222011-01-01T00%3A00%3A00%22"
     *     Ext.Object.toQueryString({colors: ['red', 'green', 'blue']}); // returns "colors=red&colors=green&colors=blue"
     *
     * Recursive:
     *
     *     Ext.Object.toQueryString({
     *         username: 'Jacky',
     *         dateOfBirth: {
     *             day: 1,
     *             month: 2,
     *             year: 1911
     *         },
     *         hobbies: ['coding', 'eating', 'sleeping', ['nested', 'stuff']]
     *     }, true);
     *
     *     // returns the following string (broken down and url-decoded for ease of reading purpose):
     *     // username=Jacky
     *     //    &dateOfBirth[day]=1&dateOfBirth[month]=2&dateOfBirth[year]=1911
     *     //    &hobbies[0]=coding&hobbies[1]=eating&hobbies[2]=sleeping&hobbies[3][0]=nested&hobbies[3][1]=stuff
     *
     * @param {Object} object The object to encode.
     * @param {Boolean} [recursive=false] Whether or not to interpret the object in recursive format.
     * (PHP / Ruby on Rails servers and similar).
     * @return {String} queryString
     */
    toQueryString: function(object, recursive) {
        var paramObjects = [],
            params = [],
            i, j, ln, paramObject, value;

        for (i in object) {
            if (object.hasOwnProperty(i)) {
                paramObjects = paramObjects.concat(ExtObject.toQueryObjects(i, object[i], recursive));
            }
        }

        for (j = 0, ln = paramObjects.length; j < ln; j++) {
            paramObject = paramObjects[j];
            value = paramObject.value;

            if (Ext.isEmpty(value)) {
                value = '';
            }
            else if (Ext.isDate(value)) {
                value = Ext.Date.toString(value);
            }

            params.push(encodeURIComponent(paramObject.name) + '=' + encodeURIComponent(String(value)));
        }

        return params.join('&');
    },

    /**
     * Converts a query string back into an object.
     *
     * Non-recursive:
     *
     *     Ext.Object.fromQueryString("foo=1&bar=2"); // returns {foo: 1, bar: 2}
     *     Ext.Object.fromQueryString("foo=&bar=2"); // returns {foo: null, bar: 2}
     *     Ext.Object.fromQueryString("some%20price=%24300"); // returns {'some price': '$300'}
     *     Ext.Object.fromQueryString("colors=red&colors=green&colors=blue"); // returns {colors: ['red', 'green', 'blue']}
     *
     * Recursive:
     *
     *     Ext.Object.fromQueryString("username=Jacky&dateOfBirth[day]=1&dateOfBirth[month]=2&dateOfBirth[year]=1911&hobbies[0]=coding&hobbies[1]=eating&hobbies[2]=sleeping&hobbies[3][0]=nested&hobbies[3][1]=stuff", true);
     *
     *     // returns
     *     {
     *         username: 'Jacky',
     *         dateOfBirth: {
     *             day: '1',
     *             month: '2',
     *             year: '1911'
     *         },
     *         hobbies: ['coding', 'eating', 'sleeping', ['nested', 'stuff']]
     *     }
     *
     * @param {String} queryString The query string to decode.
     * @param {Boolean} [recursive=false] Whether or not to recursively decode the string. This format is supported by
     * PHP / Ruby on Rails servers and similar.
     * @return {Object}
     */
    fromQueryString: function(queryString, recursive) {
        var parts = queryString.replace(/^\?/, '').split('&'),
            object = {},
            temp, components, name, value, i, ln,
            part, j, subLn, matchedKeys, matchedName,
            keys, key, nextKey;

        for (i = 0, ln = parts.length; i < ln; i++) {
            part = parts[i];

            if (part.length > 0) {
                components = part.split('=');
                name = decodeURIComponent(components[0]);
                value = (components[1] !== undefined) ? decodeURIComponent(components[1]) : '';

                if (!recursive) {
                    if (object.hasOwnProperty(name)) {
                        if (!Ext.isArray(object[name])) {
                            object[name] = [object[name]];
                        }

                        object[name].push(value);
                    }
                    else {
                        object[name] = value;
                    }
                }
                else {
                    matchedKeys = name.match(/(\[):?([^\]]*)\]/g);
                    matchedName = name.match(/^([^\[]+)/);

                    //<debug error>
                    if (!matchedName) {
                        throw new Error('[Ext.Object.fromQueryString] Malformed query string given, failed parsing name from "' + part + '"');
                    }
                    //</debug>

                    name = matchedName[0];
                    keys = [];

                    if (matchedKeys === null) {
                        object[name] = value;
                        continue;
                    }

                    for (j = 0, subLn = matchedKeys.length; j < subLn; j++) {
                        key = matchedKeys[j];
                        key = (key.length === 2) ? '' : key.substring(1, key.length - 1);
                        keys.push(key);
                    }

                    keys.unshift(name);

                    temp = object;

                    for (j = 0, subLn = keys.length; j < subLn; j++) {
                        key = keys[j];

                        if (j === subLn - 1) {
                            if (Ext.isArray(temp) && key === '') {
                                temp.push(value);
                            }
                            else {
                                temp[key] = value;
                            }
                        }
                        else {
                            if (temp[key] === undefined || typeof temp[key] === 'string') {
                                nextKey = keys[j+1];

                                temp[key] = (Ext.isNumeric(nextKey) || nextKey === '') ? [] : {};
                            }

                            temp = temp[key];
                        }
                    }
                }
            }
        }

        return object;
    },

    /**
     * Iterate through an object and invoke the given callback function for each iteration. The iteration can be stop
     * by returning `false` in the callback function. For example:
     *
     *     var person = {
     *         name: 'Jacky',
     *         hairColor: 'black',
     *         loves: ['food', 'sleeping', 'wife']
     *     };
     *
     *     Ext.Object.each(person, function(key, value, myself) {
     *         console.log(key + ":" + value);
     *
     *         if (key === 'hairColor') {
     *             return false; // stop the iteration
     *         }
     *     });
     *
     * @param {Object} object The object to iterate
     * @param {Function} fn The callback function.
     * @param {String} fn.key
     * @param {Mixed} fn.value
     * @param {Object} fn.object The object itself
     * @param {Object} [scope] The execution scope (`this`) of the callback function
     */
    each: function(object, fn, scope) {
        for (var property in object) {
            if (object.hasOwnProperty(property)) {
                if (fn.call(scope || object, property, object[property], object) === false) {
                    return;
                }
            }
        }
    },

    /**
     * Merges any number of objects recursively without referencing them or their children.
     *
     *     var extjs = {
     *         companyName: 'Ext JS',
     *         products: ['Ext JS', 'Ext GWT', 'Ext Designer'],
     *         isSuperCool: true,
     *         office: {
     *             size: 2000,
     *             location: 'Palo Alto',
     *             isFun: true
     *         }
     *     };
     *
     *     var newStuff = {
     *         companyName: 'Sencha Inc.',
     *         products: ['Ext JS', 'Ext GWT', 'Ext Designer', 'Sencha Touch', 'Sencha Animator'],
     *         office: {
     *             size: 40000,
     *             location: 'Redwood City'
     *         }
     *     };
     *
     *     var sencha = Ext.Object.merge({}, extjs, newStuff);
     *
     *     // sencha then equals to
     *     {
     *         companyName: 'Sencha Inc.',
     *         products: ['Ext JS', 'Ext GWT', 'Ext Designer', 'Sencha Touch', 'Sencha Animator'],
     *         isSuperCool: true
     *         office: {
     *             size: 40000,
     *             location: 'Redwood City'
     *             isFun: true
     *         }
     *     }
     *
     * @param {Object} source The first object into which to merge the others.
     * @param {Object...} objs One or more objects to be merged into the first.
     * @return {Object} The object that is created as a result of merging all the objects passed in.
     */
    merge: function(source) {
        var i = 1,
            ln = arguments.length,
            mergeFn = ExtObject.merge,
            cloneFn = Ext.clone,
            object, key, value, sourceKey;

        for (; i < ln; i++) {
            object = arguments[i];

            for (key in object) {
                value = object[key];
                if (value && value.constructor === Object) {
                    sourceKey = source[key];
                    if (sourceKey && sourceKey.constructor === Object) {
                        mergeFn(sourceKey, value);
                    }
                    else {
                        source[key] = cloneFn(value);
                    }
                }
                else {
                    source[key] = value;
                }
            }
        }

        return source;
    },

    /**
     * @private
     * @param source
     */
    mergeIf: function(source) {
        var i = 1,
            ln = arguments.length,
            cloneFn = Ext.clone,
            object, key, value;

        for (; i < ln; i++) {
            object = arguments[i];

            for (key in object) {
                if (!(key in source)) {
                    value = object[key];

                    if (value && value.constructor === Object) {
                        source[key] = cloneFn(value);
                    }
                    else {
                        source[key] = value;
                    }
                }
            }
        }

        return source;
    },

    /**
     * Returns the first matching key corresponding to the given value.
     * If no matching value is found, `null` is returned.
     *
     *     var person = {
     *         name: 'Jacky',
     *         loves: 'food'
     *     };
     *
     *     alert(Ext.Object.getKey(sencha, 'food')); // alerts 'loves'
     *
     * @param {Object} object
     * @param {Object} value The value to find
     */
    getKey: function(object, value) {
        for (var property in object) {
            if (object.hasOwnProperty(property) && object[property] === value) {
                return property;
            }
        }

        return null;
    },

    /**
     * Gets all values of the given object as an array.
     *
     *     var values = Ext.Object.getValues({
     *         name: 'Jacky',
     *         loves: 'food'
     *     }); // ['Jacky', 'food']
     *
     * @param {Object} object
     * @return {Array} An array of values from the object.
     */
    getValues: function(object) {
        var values = [],
            property;

        for (property in object) {
            if (object.hasOwnProperty(property)) {
                values.push(object[property]);
            }
        }

        return values;
    },

    /**
     * Gets all keys of the given object as an array.
     *
     *     var values = Ext.Object.getKeys({
     *         name: 'Jacky',
     *         loves: 'food'
     *     }); // ['name', 'loves']
     *
     * @param {Object} object
     * @return {String[]} An array of keys from the object.
     * @method
     */
    getKeys: ('keys' in Object) ? Object.keys : function(object) {
        var keys = [],
            property;

        for (property in object) {
            if (object.hasOwnProperty(property)) {
                keys.push(property);
            }
        }

        return keys;
    },

    /**
     * Gets the total number of this object's own properties.
     *
     *     var size = Ext.Object.getSize({
     *         name: 'Jacky',
     *         loves: 'food'
     *     }); // size equals 2
     *
     * @param {Object} object
     * @return {Number} size
     */
    getSize: function(object) {
        var size = 0,
            property;

        for (property in object) {
            if (object.hasOwnProperty(property)) {
                size++;
            }
        }

        return size;
    },

    /**
     * @private
     */
    classify: function(object) {
        var objectProperties = [],
            arrayProperties = [],
            propertyClassesMap = {},
            objectClass = function() {
                var i = 0,
                    ln = objectProperties.length,
                    property;

                for (; i < ln; i++) {
                    property = objectProperties[i];
                    this[property] = new propertyClassesMap[property];
                }

                ln = arrayProperties.length;

                for (i = 0; i < ln; i++) {
                    property = arrayProperties[i];
                    this[property] = object[property].slice();
                }
            },
            key, value, constructor;

        for (key in object) {
            if (object.hasOwnProperty(key)) {
                value = object[key];

                if (value) {
                    constructor = value.constructor;

                    if (constructor === Object) {
                        objectProperties.push(key);
                        propertyClassesMap[key] = ExtObject.classify(value);
                    }
                    else if (constructor === Array) {
                        arrayProperties.push(key);
                    }
                }
            }
        }

        objectClass.prototype = object;

        return objectClass;
    },

    defineProperty: ('defineProperty' in Object) ? Object.defineProperty : function(object, name, descriptor) {
        if (descriptor.get) {
            object.__defineGetter__(name, descriptor.get);
        }

        if (descriptor.set) {
            object.__defineSetter__(name, descriptor.set);
        }
    }
};

/**
 * A convenient alias method for {@link Ext.Object#merge}.
 *
 * @member Ext
 * @method merge
 */
Ext.merge = Ext.Object.merge;

/**
 * @private
 */
Ext.mergeIf = Ext.Object.mergeIf;

/**
 * A convenient alias method for {@link Ext.Object#toQueryString}.
 *
 * @member Ext
 * @method urlEncode
 * @deprecated 4.0.0 Please use `{@link Ext.Object#toQueryString Ext.Object.toQueryString}` instead
 */
Ext.urlEncode = function() {
    var args = Ext.Array.from(arguments),
        prefix = '';

    // Support for the old `pre` argument
    if ((typeof args[1] === 'string')) {
        prefix = args[1] + '&';
        args[1] = false;
    }

    return prefix + ExtObject.toQueryString.apply(ExtObject, args);
};

/**
 * A convenient alias method for {@link Ext.Object#fromQueryString}.
 *
 * @member Ext
 * @method urlDecode
 * @deprecated 4.0.0 Please use {@link Ext.Object#fromQueryString Ext.Object.fromQueryString} instead
 */
Ext.urlDecode = function() {
    return ExtObject.fromQueryString.apply(ExtObject, arguments);
};

})();

//@tag foundation,core
//@define Ext.Function
//@require Ext.Object

/**
 * @class Ext.Function
 *
 * A collection of useful static methods to deal with function callbacks.
 * @singleton
 * @alternateClassName Ext.util.Functions
 */
Ext.Function = {

    /**
     * A very commonly used method throughout the framework. It acts as a wrapper around another method
     * which originally accepts 2 arguments for `name` and `value`.
     * The wrapped function then allows "flexible" value setting of either:
     *
     * - `name` and `value` as 2 arguments
     * - one single object argument with multiple key - value pairs
     *
     * For example:
     *
     *     var setValue = Ext.Function.flexSetter(function(name, value) {
     *         this[name] = value;
     *     });
     *
     *     // Afterwards
     *     // Setting a single name - value
     *     setValue('name1', 'value1');
     *
     *     // Settings multiple name - value pairs
     *     setValue({
     *         name1: 'value1',
     *         name2: 'value2',
     *         name3: 'value3'
     *     });
     *
     * @param {Function} setter
     * @return {Function} flexSetter
     */
    flexSetter: function(fn) {
        return function(a, b) {
            var k, i;

            if (a === null) {
                return this;
            }

            if (typeof a !== 'string') {
                for (k in a) {
                    if (a.hasOwnProperty(k)) {
                        fn.call(this, k, a[k]);
                    }
                }

                if (Ext.enumerables) {
                    for (i = Ext.enumerables.length; i--;) {
                        k = Ext.enumerables[i];
                        if (a.hasOwnProperty(k)) {
                            fn.call(this, k, a[k]);
                        }
                    }
                }
            } else {
                fn.call(this, a, b);
            }

            return this;
        };
    },

    /**
     * Create a new function from the provided `fn`, change `this` to the provided scope, optionally
     * overrides arguments for the call. Defaults to the arguments passed by the caller.
     *
     * {@link Ext#bind Ext.bind} is alias for {@link Ext.Function#bind Ext.Function.bind}
     *
     * @param {Function} fn The function to delegate.
     * @param {Object} scope (optional) The scope (`this` reference) in which the function is executed.
     * **If omitted, defaults to the browser window.**
     * @param {Array} args (optional) Overrides arguments for the call. (Defaults to the arguments passed by the caller)
     * @param {Boolean/Number} appendArgs (optional) if `true` args are appended to call args instead of overriding,
     * if a number the args are inserted at the specified position.
     * @return {Function} The new function.
     */
    bind: function(fn, scope, args, appendArgs) {
        if (arguments.length === 2) {
            return function() {
                return fn.apply(scope, arguments);
            }
        }

        var method = fn,
            slice = Array.prototype.slice;

        return function() {
            var callArgs = args || arguments;

            if (appendArgs === true) {
                callArgs = slice.call(arguments, 0);
                callArgs = callArgs.concat(args);
            }
            else if (typeof appendArgs == 'number') {
                callArgs = slice.call(arguments, 0); // copy arguments first
                Ext.Array.insert(callArgs, appendArgs, args);
            }

            return method.apply(scope || window, callArgs);
        };
    },

    /**
     * Create a new function from the provided `fn`, the arguments of which are pre-set to `args`.
     * New arguments passed to the newly created callback when it's invoked are appended after the pre-set ones.
     * This is especially useful when creating callbacks.
     *
     * For example:
     *
     *     var originalFunction = function(){
     *         alert(Ext.Array.from(arguments).join(' '));
     *     };
     *
     *     var callback = Ext.Function.pass(originalFunction, ['Hello', 'World']);
     *
     *     callback(); // alerts 'Hello World'
     *     callback('by Me'); // alerts 'Hello World by Me'
     *
     * {@link Ext#pass Ext.pass} is alias for {@link Ext.Function#pass Ext.Function.pass}
     *
     * @param {Function} fn The original function.
     * @param {Array} args The arguments to pass to new callback.
     * @param {Object} scope (optional) The scope (`this` reference) in which the function is executed.
     * @return {Function} The new callback function.
     */
    pass: function(fn, args, scope) {
        if (!Ext.isArray(args)) {
            args = Ext.Array.clone(args);
        }

        return function() {
            args.push.apply(args, arguments);
            return fn.apply(scope || this, args);
        };
    },

    /**
     * Create an alias to the provided method property with name `methodName` of `object`.
     * Note that the execution scope will still be bound to the provided `object` itself.
     *
     * @param {Object/Function} object
     * @param {String} methodName
     * @return {Function} aliasFn
     */
    alias: function(object, methodName) {
        return function() {
            return object[methodName].apply(object, arguments);
        };
    },

    /**
     * Create a "clone" of the provided method. The returned method will call the given
     * method passing along all arguments and the "this" pointer and return its result.
     *
     * @param {Function} method
     * @return {Function} cloneFn
     */
    clone: function(method) {
        return function() {
            return method.apply(this, arguments);
        };
    },

    /**
     * Creates an interceptor function. The passed function is called before the original one. If it returns false,
     * the original one is not called. The resulting function returns the results of the original function.
     * The passed function is called with the parameters of the original function. Example usage:
     *
     *     var sayHi = function(name){
     *         alert('Hi, ' + name);
     *     };
     *
     *     sayHi('Fred'); // alerts "Hi, Fred"
     *
     *     // create a new function that validates input without
     *     // directly modifying the original function:
     *     var sayHiToFriend = Ext.Function.createInterceptor(sayHi, function(name){
     *         return name === 'Brian';
     *     });
     *
     *     sayHiToFriend('Fred');  // no alert
     *     sayHiToFriend('Brian'); // alerts "Hi, Brian"
     *
     * @param {Function} origFn The original function.
     * @param {Function} newFn The function to call before the original.
     * @param {Object} scope (optional) The scope (`this` reference) in which the passed function is executed.
     * **If omitted, defaults to the scope in which the original function is called or the browser window.**
     * @param {Object} [returnValue=null] (optional) The value to return if the passed function return `false`.
     * @return {Function} The new function.
     */
    createInterceptor: function(origFn, newFn, scope, returnValue) {
        var method = origFn;
        if (!Ext.isFunction(newFn)) {
            return origFn;
        }
        else {
            return function() {
                var me = this,
                    args = arguments;
                newFn.target = me;
                newFn.method = origFn;
                return (newFn.apply(scope || me || window, args) !== false) ? origFn.apply(me || window, args) : returnValue || null;
            };
        }
    },

    /**
     * Creates a delegate (callback) which, when called, executes after a specific delay.
     *
     * @param {Function} fn The function which will be called on a delay when the returned function is called.
     * Optionally, a replacement (or additional) argument list may be specified.
     * @param {Number} delay The number of milliseconds to defer execution by whenever called.
     * @param {Object} scope (optional) The scope (`this` reference) used by the function at execution time.
     * @param {Array} args (optional) Override arguments for the call. (Defaults to the arguments passed by the caller)
     * @param {Boolean/Number} appendArgs (optional) if True args are appended to call args instead of overriding,
     * if a number the args are inserted at the specified position.
     * @return {Function} A function which, when called, executes the original function after the specified delay.
     */
    createDelayed: function(fn, delay, scope, args, appendArgs) {
        if (scope || args) {
            fn = Ext.Function.bind(fn, scope, args, appendArgs);
        }

        return function() {
            var me = this,
                args = Array.prototype.slice.call(arguments);

            setTimeout(function() {
                fn.apply(me, args);
            }, delay);
        }
    },

    /**
     * Calls this function after the number of milliseconds specified, optionally in a specific scope. Example usage:
     *
     *     var sayHi = function(name){
     *         alert('Hi, ' + name);
     *     };
     *
     *     // executes immediately:
     *     sayHi('Fred');
     *
     *     // executes after 2 seconds:
     *     Ext.Function.defer(sayHi, 2000, this, ['Fred']);
     *
     *     // this syntax is sometimes useful for deferring
     *     // execution of an anonymous function:
     *     Ext.Function.defer(function(){
     *         alert('Anonymous');
     *     }, 100);
     *
     * {@link Ext#defer Ext.defer} is alias for {@link Ext.Function#defer Ext.Function.defer}
     *
     * @param {Function} fn The function to defer.
     * @param {Number} millis The number of milliseconds for the `setTimeout()` call.
     * If less than or equal to 0 the function is executed immediately.
     * @param {Object} scope (optional) The scope (`this` reference) in which the function is executed.
     * If omitted, defaults to the browser window.
     * @param {Array} args (optional) Overrides arguments for the call. Defaults to the arguments passed by the caller.
     * @param {Boolean/Number} appendArgs (optional) if `true`, args are appended to call args instead of overriding,
     * if a number the args are inserted at the specified position.
     * @return {Number} The timeout id that can be used with `clearTimeout()`.
     */
    defer: function(fn, millis, scope, args, appendArgs) {
        fn = Ext.Function.bind(fn, scope, args, appendArgs);
        if (millis > 0) {
            return setTimeout(fn, millis);
        }
        fn();
        return 0;
    },

    /**
     * Create a combined function call sequence of the original function + the passed function.
     * The resulting function returns the results of the original function.
     * The passed function is called with the parameters of the original function. Example usage:
     *
     *     var sayHi = function(name){
     *         alert('Hi, ' + name);
     *     };
     *
     *     sayHi('Fred'); // alerts "Hi, Fred"
     *
     *     var sayGoodbye = Ext.Function.createSequence(sayHi, function(name){
     *         alert('Bye, ' + name);
     *     });
     *
     *     sayGoodbye('Fred'); // both alerts show
     *
     * @param {Function} originalFn The original function.
     * @param {Function} newFn The function to sequence.
     * @param {Object} scope (optional) The scope (`this` reference) in which the passed function is executed.
     * If omitted, defaults to the scope in which the original function is called or the browser window.
     * @return {Function} The new function.
     */
    createSequence: function(originalFn, newFn, scope) {
        if (!newFn) {
            return originalFn;
        }
        else {
            return function() {
                var result = originalFn.apply(this, arguments);
                newFn.apply(scope || this, arguments);
                return result;
            };
        }
    },

    /**
     * Creates a delegate function, optionally with a bound scope which, when called, buffers
     * the execution of the passed function for the configured number of milliseconds.
     * If called again within that period, the impending invocation will be canceled, and the
     * timeout period will begin again.
     *
     * @param {Function} fn The function to invoke on a buffered timer.
     * @param {Number} buffer The number of milliseconds by which to buffer the invocation of the
     * function.
     * @param {Object} scope (optional) The scope (`this` reference) in which
     * the passed function is executed. If omitted, defaults to the scope specified by the caller.
     * @param {Array} args (optional) Override arguments for the call. Defaults to the arguments
     * passed by the caller.
     * @return {Function} A function which invokes the passed function after buffering for the specified time.
     */

    createBuffered: function(fn, buffer, scope, args) {
        var timerId;

        return function() {
            var callArgs = args || Array.prototype.slice.call(arguments, 0),
                me = scope || this;

            if (timerId) {
                clearTimeout(timerId);
            }

            timerId = setTimeout(function(){
                fn.apply(me, callArgs);
            }, buffer);
        };
    },

    /**
     * Creates a throttled version of the passed function which, when called repeatedly and
     * rapidly, invokes the passed function only after a certain interval has elapsed since the
     * previous invocation.
     *
     * This is useful for wrapping functions which may be called repeatedly, such as
     * a handler of a mouse move event when the processing is expensive.
     *
     * @param {Function} fn The function to execute at a regular time interval.
     * @param {Number} interval The interval, in milliseconds, on which the passed function is executed.
     * @param {Object} scope (optional) The scope (`this` reference) in which
     * the passed function is executed. If omitted, defaults to the scope specified by the caller.
     * @return {Function} A function which invokes the passed function at the specified interval.
     */
    createThrottled: function(fn, interval, scope) {
        var lastCallTime, elapsed, lastArgs, timer, execute = function() {
            fn.apply(scope || this, lastArgs);
            lastCallTime = new Date().getTime();
        };

        return function() {
            elapsed = new Date().getTime() - lastCallTime;
            lastArgs = arguments;

            clearTimeout(timer);
            if (!lastCallTime || (elapsed >= interval)) {
                execute();
            } else {
                timer = setTimeout(execute, interval - elapsed);
            }
        };
    },

    interceptBefore: function(object, methodName, fn) {
        var method = object[methodName] || Ext.emptyFn;

        return object[methodName] = function() {
            var ret = fn.apply(this, arguments);
            method.apply(this, arguments);

            return ret;
        };
    },

    interceptAfter: function(object, methodName, fn) {
        var method = object[methodName] || Ext.emptyFn;

        return object[methodName] = function() {
            method.apply(this, arguments);
            return fn.apply(this, arguments);
        };
    }
};

/**
 * @method
 * @member Ext
 * @alias Ext.Function#defer
 */
Ext.defer = Ext.Function.alias(Ext.Function, 'defer');

/**
 * @method
 * @member Ext
 * @alias Ext.Function#pass
 */
Ext.pass = Ext.Function.alias(Ext.Function, 'pass');

/**
 * @method
 * @member Ext
 * @alias Ext.Function#bind
 */
Ext.bind = Ext.Function.alias(Ext.Function, 'bind');

//@tag foundation,core
//@define Ext.JSON
//@require Ext.Function

/**
 * @class Ext.JSON
 * Modified version of Douglas Crockford's json.js that doesn't
 * mess with the Object prototype.
 * [http://www.json.org/js.html](http://www.json.org/js.html)
 * @singleton
 */
Ext.JSON = new(function() {
    var useHasOwn = !! {}.hasOwnProperty,
    isNative = function() {
        var useNative = null;

        return function() {
            if (useNative === null) {
                useNative = Ext.USE_NATIVE_JSON && window.JSON && JSON.toString() == '[object JSON]';
            }

            return useNative;
        };
    }(),
    pad = function(n) {
        return n < 10 ? "0" + n : n;
    },
    doDecode = function(json) {
        return eval("(" + json + ')');
    },
    doEncode = function(o) {
        if (!Ext.isDefined(o) || o === null) {
            return "null";
        } else if (Ext.isArray(o)) {
            return encodeArray(o);
        } else if (Ext.isDate(o)) {
            return Ext.JSON.encodeDate(o);
        } else if (Ext.isString(o)) {
            return encodeString(o);
        } else if (typeof o == "number") {
            //don't use isNumber here, since finite checks happen inside isNumber
            return isFinite(o) ? String(o) : "null";
        } else if (Ext.isBoolean(o)) {
            return String(o);
        } else if (Ext.isObject(o)) {
            return encodeObject(o);
        } else if (typeof o === "function") {
            return "null";
        }
        return 'undefined';
    },
    m = {
        "\b": '\\b',
        "\t": '\\t',
        "\n": '\\n',
        "\f": '\\f',
        "\r": '\\r',
        '"': '\\"',
        "\\": '\\\\',
        '\x0b': '\\u000b' //ie doesn't handle \v
    },
    charToReplace = /[\\\"\x00-\x1f\x7f-\uffff]/g,
    encodeString = function(s) {
        return '"' + s.replace(charToReplace, function(a) {
            var c = m[a];
            return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"';
    },
    encodeArray = function(o) {
        var a = ["[", ""],
        // Note empty string in case there are no serializable members.
        len = o.length,
        i;
        for (i = 0; i < len; i += 1) {
            a.push(doEncode(o[i]), ',');
        }
        // Overwrite trailing comma (or empty string)
        a[a.length - 1] = ']';
        return a.join("");
    },
    encodeObject = function(o) {
        var a = ["{", ""],
        // Note empty string in case there are no serializable members.
        i;
        for (i in o) {
            if (!useHasOwn || o.hasOwnProperty(i)) {
                a.push(doEncode(i), ":", doEncode(o[i]), ',');
            }
        }
        // Overwrite trailing comma (or empty string)
        a[a.length - 1] = '}';
        return a.join("");
    };

    /**
     * Encodes a Date. This returns the actual string which is inserted into the JSON string as the literal expression.
     * __The returned value includes enclosing double quotation marks.__
     *
     * The default return format is "yyyy-mm-ddThh:mm:ss".
     * 
     * To override this:
     *
     *     Ext.JSON.encodeDate = function(d) {
     *         return Ext.Date.format(d, '"Y-m-d"');
     *     };
     *
     * @param {Date} d The Date to encode.
     * @return {String} The string literal to use in a JSON string.
     */
    this.encodeDate = function(o) {
        return '"' + o.getFullYear() + "-" 
        + pad(o.getMonth() + 1) + "-"
        + pad(o.getDate()) + "T"
        + pad(o.getHours()) + ":"
        + pad(o.getMinutes()) + ":"
        + pad(o.getSeconds()) + '"';
    };

    /**
     * Encodes an Object, Array or other value.
     * @param {Object} o The variable to encode.
     * @return {String} The JSON string.
     * @method
     */
    this.encode = function() {
        var ec;
        return function(o) {
            if (!ec) {
                // setup encoding function on first access
                ec = isNative() ? JSON.stringify : doEncode;
            }
            return ec(o);
        };
    }();


    /**
     * Decodes (parses) a JSON string to an object. If the JSON is invalid, this function throws a Error unless the safe option is set.
     * @param {String} json The JSON string.
     * @param {Boolean} safe (optional) Whether to return `null` or throw an exception if the JSON is invalid.
     * @return {Object/null} The resulting object.
     * @method
     */
    this.decode = function() {
        var dc;
        return function(json, safe) {
            if (!dc) {
                // setup decoding function on first access
                dc = isNative() ? JSON.parse : doDecode;
            }
            try {
                return dc(json);
            } catch (e) {
                if (safe === true) {
                    return null;
                }
                Ext.Error.raise({
                    sourceClass: "Ext.JSON",
                    sourceMethod: "decode",
                    msg: "You're trying to decode an invalid JSON String: " + json
                });
            }
        };
    }();

})();
/**
 * Shorthand for {@link Ext.JSON#encode}.
 * @member Ext
 * @method encode
 * @alias Ext.JSON#encode
 */
Ext.encode = Ext.JSON.encode;
/**
 * Shorthand for {@link Ext.JSON#decode}.
 * @member Ext
 * @method decode
 * @alias Ext.JSON#decode
 */
Ext.decode = Ext.JSON.decode;


//@tag foundation,core
//@define Ext.Error
//@require Ext.JSON

Ext.Error = {
    raise: function(object) {
        throw new Error(object.msg);
    }
};

//@tag foundation,core
//@define Ext.Date
//@require Ext.Error

/**
 *
 */
Ext.Date = {
    /** @ignore */
    now: Date.now,

    /**
     * @private
     * Private for now
     */
    toString: function(date) {
        if (!date) {
            date = new Date();
        }

        var pad = Ext.String.leftPad;

        return date.getFullYear() + "-"
            + pad(date.getMonth() + 1, 2, '0') + "-"
            + pad(date.getDate(), 2, '0') + "T"
            + pad(date.getHours(), 2, '0') + ":"
            + pad(date.getMinutes(), 2, '0') + ":"
            + pad(date.getSeconds(), 2, '0');
    }
};


//@tag foundation,core
//@define Ext.Base
//@require Ext.Date

/**
 * @class Ext.Base
 *
 * @author Jacky Nguyen <jacky@sencha.com>
 * @aside guide class_system
 * @aside video class-system
 *
 * The root of all classes created with {@link Ext#define}.
 *
 * Ext.Base is the building block of all Ext classes. All classes in Ext inherit from Ext.Base. All prototype and static
 * members of this class are inherited by all other classes.
 *
 * See the [Class System Guide](#!/guide/class_system) for more.
 *
 */
(function(flexSetter) {

var noArgs = [],
    Base = function(){};

    // These static properties will be copied to every newly created class with {@link Ext#define}
    Ext.apply(Base, {
        $className: 'Ext.Base',

        $isClass: true,

        /**
         * Create a new instance of this Class.
         *
         *     Ext.define('My.cool.Class', {
         *         // ...
         *     });
         *
         *     My.cool.Class.create({
         *         someConfig: true
         *     });
         *
         * All parameters are passed to the constructor of the class.
         *
         * @return {Object} the created instance.
         * @static
         * @inheritable
         */
        create: function() {
            return Ext.create.apply(Ext, [this].concat(Array.prototype.slice.call(arguments, 0)));
        },

        /**
         * @private
         * @static
         * @inheritable
         */
        extend: function(parent) {
            var parentPrototype = parent.prototype,
                prototype, i, ln, name, statics;

            prototype = this.prototype = Ext.Object.chain(parentPrototype);
            prototype.self = this;

            this.superclass = prototype.superclass = parentPrototype;

            if (!parent.$isClass) {
                Ext.apply(prototype, Ext.Base.prototype);
                prototype.constructor = function() {
                    parentPrototype.constructor.apply(this, arguments);
                };
            }

            //<feature classSystem.inheritableStatics>
            // Statics inheritance
            statics = parentPrototype.$inheritableStatics;

            if (statics) {
                for (i = 0,ln = statics.length; i < ln; i++) {
                    name = statics[i];

                    if (!this.hasOwnProperty(name)) {
                        this[name] = parent[name];
                    }
                }
            }
            //</feature>

            if (parent.$onExtended) {
                this.$onExtended = parent.$onExtended.slice();
            }

            //<feature classSystem.config>
            prototype.config = prototype.defaultConfig = new prototype.configClass;
            prototype.initConfigList = prototype.initConfigList.slice();
            prototype.initConfigMap = Ext.Object.chain(prototype.initConfigMap);
            //</feature>
        },

        /**
         * @private
         * @static
         * @inheritable
         */
        '$onExtended': [],

        /**
         * @private
         * @static
         * @inheritable
         */
        triggerExtended: function() {
            var callbacks = this.$onExtended,
                ln = callbacks.length,
                i, callback;

            if (ln > 0) {
                for (i = 0; i < ln; i++) {
                    callback = callbacks[i];
                    callback.fn.apply(callback.scope || this, arguments);
                }
            }
        },

        /**
         * @private
         * @static
         * @inheritable
         */
        onExtended: function(fn, scope) {
            this.$onExtended.push({
                fn: fn,
                scope: scope
            });

            return this;
        },

        /**
         * @private
         * @static
         * @inheritable
         */
        addConfig: function(config, fullMerge) {
            var prototype = this.prototype,
                initConfigList = prototype.initConfigList,
                initConfigMap = prototype.initConfigMap,
                defaultConfig = prototype.defaultConfig,
                hasInitConfigItem, name, value;

            fullMerge = Boolean(fullMerge);

            for (name in config) {
                if (config.hasOwnProperty(name) && (fullMerge || !(name in defaultConfig))) {
                    value = config[name];
                    hasInitConfigItem = initConfigMap[name];

                    if (value !== null) {
                        if (!hasInitConfigItem) {
                            initConfigMap[name] = true;
                            initConfigList.push(name);
                        }
                    }
                    else if (hasInitConfigItem) {
                        initConfigMap[name] = false;
                        Ext.Array.remove(initConfigList, name);
                    }
                }
            }

            if (fullMerge) {
                Ext.merge(defaultConfig, config);
            }
            else {
                Ext.mergeIf(defaultConfig, config);
            }

            prototype.configClass = Ext.Object.classify(defaultConfig);
        },

        /**
         * Add / override static properties of this class.
         *
         *     Ext.define('My.cool.Class', {
         *         // this.se
         *     });
         *
         *     My.cool.Class.addStatics({
         *         someProperty: 'someValue',      // My.cool.Class.someProperty = 'someValue'
         *         method1: function() {  },    // My.cool.Class.method1 = function() { ... };
         *         method2: function() {  }     // My.cool.Class.method2 = function() { ... };
         *     });
         *
         * @param {Object} members
         * @return {Ext.Base} this
         * @static
         * @inheritable
         */
        addStatics: function(members) {
            var member, name;
            //<debug>
            var className = Ext.getClassName(this);
            //</debug>

            for (name in members) {
                if (members.hasOwnProperty(name)) {
                    member = members[name];
                    //<debug>
                    if (typeof member == 'function') {
                        member.displayName = className + '.' + name;
                    }
                    //</debug>
                    this[name] = member;
                }
            }

            return this;
        },

        /**
         * @private
         * @static
         * @inheritable
         */
        addInheritableStatics: function(members) {
            var inheritableStatics,
                hasInheritableStatics,
                prototype = this.prototype,
                name, member;

            inheritableStatics = prototype.$inheritableStatics;
            hasInheritableStatics = prototype.$hasInheritableStatics;

            if (!inheritableStatics) {
                inheritableStatics = prototype.$inheritableStatics = [];
                hasInheritableStatics = prototype.$hasInheritableStatics = {};
            }

            //<debug>
            var className = Ext.getClassName(this);
            //</debug>

            for (name in members) {
                if (members.hasOwnProperty(name)) {
                    member = members[name];
                    //<debug>
                    if (typeof member == 'function') {
                        member.displayName = className + '.' + name;
                    }
                    //</debug>
                    this[name] = member;

                    if (!hasInheritableStatics[name]) {
                        hasInheritableStatics[name] = true;
                        inheritableStatics.push(name);
                    }
                }
            }

            return this;
        },

        /**
         * Add methods / properties to the prototype of this class.
         *
         *     @example
         *     Ext.define('My.awesome.Cat', {
         *         constructor: function() {
         *             // ...
         *         }
         *     });
         *
         *      My.awesome.Cat.addMembers({
         *          meow: function() {
         *             alert('Meowww...');
         *          }
         *      });
         *
         *      var kitty = new My.awesome.Cat();
         *      kitty.meow();
         *
         * @param {Object} members
         * @static
         * @inheritable
         */
        addMembers: function(members) {
            var prototype = this.prototype,
                names = [],
                name, member;

            //<debug>
            var className = this.$className || '';
            //</debug>

            for (name in members) {
                if (members.hasOwnProperty(name)) {
                    member = members[name];

                    if (typeof member == 'function' && !member.$isClass && member !== Ext.emptyFn) {
                        member.$owner = this;
                        member.$name = name;
                        //<debug>
                        member.displayName = className + '#' + name;
                        //</debug>
                    }

                    prototype[name] = member;
                }
            }

            return this;
        },

        /**
         * @private
         * @static
         * @inheritable
         */
        addMember: function(name, member) {
            if (typeof member == 'function' && !member.$isClass && member !== Ext.emptyFn) {
                member.$owner = this;
                member.$name = name;
                //<debug>
                member.displayName = (this.$className || '') + '#' + name;
                //</debug>
            }

            this.prototype[name] = member;

            return this;
        },

        /**
         * @private
         * @static
         * @inheritable
         */
        implement: function() {
            this.addMembers.apply(this, arguments);
        },

        /**
         * Borrow another class' members to the prototype of this class.
         *
         *     Ext.define('Bank', {
         *         money: '$$$',
         *         printMoney: function() {
         *             alert('$$$$$$$');
         *         }
         *     });
         *
         *     Ext.define('Thief', {
         *         // ...
         *     });
         *
         *     Thief.borrow(Bank, ['money', 'printMoney']);
         *
         *     var steve = new Thief();
         *
         *     alert(steve.money); // alerts '$$$'
         *     steve.printMoney(); // alerts '$$$$$$$'
         *
         * @param {Ext.Base} fromClass The class to borrow members from
         * @param {Array/String} members The names of the members to borrow
         * @return {Ext.Base} this
         * @static
         * @inheritable
         * @private
         */
        borrow: function(fromClass, members) {
            var prototype = this.prototype,
                fromPrototype = fromClass.prototype,
                //<debug>
                className = Ext.getClassName(this),
                //</debug>
                i, ln, name, fn, toBorrow;

            members = Ext.Array.from(members);

            for (i = 0,ln = members.length; i < ln; i++) {
                name = members[i];

                toBorrow = fromPrototype[name];

                if (typeof toBorrow == 'function') {
                    fn = function() {
                        return toBorrow.apply(this, arguments);
                    };

                    //<debug>
                    if (className) {
                        fn.displayName = className + '#' + name;
                    }
                    //</debug>

                    fn.$owner = this;
                    fn.$name = name;

                    prototype[name] = fn;
                }
                else {
                    prototype[name] = toBorrow;
                }
            }

            return this;
        },

        /**
         * Override members of this class. Overridden methods can be invoked via
         * {@link Ext.Base#callParent}.
         *
         *     Ext.define('My.Cat', {
         *         constructor: function() {
         *             alert("I'm a cat!");
         *         }
         *     });
         *
         *     My.Cat.override({
         *         constructor: function() {
         *             alert("I'm going to be a cat!");
         *
         *             var instance = this.callParent(arguments);
         *
         *             alert("Meeeeoooowwww");
         *
         *             return instance;
         *         }
         *     });
         *
         *     var kitty = new My.Cat(); // alerts "I'm going to be a cat!"
         *                               // alerts "I'm a cat!"
         *                               // alerts "Meeeeoooowwww"
         *
         * As of 2.1, direct use of this method is deprecated. Use {@link Ext#define Ext.define}
         * instead:
         *
         *     Ext.define('My.CatOverride', {
         *         override: 'My.Cat',
         *         
         *         constructor: function() {
         *             alert("I'm going to be a cat!");
         *
         *             var instance = this.callParent(arguments);
         *
         *             alert("Meeeeoooowwww");
         *
         *             return instance;
         *         }
         *     });
         *
         * The above accomplishes the same result but can be managed by the {@link Ext.Loader}
         * which can properly order the override and its target class and the build process
         * can determine whether the override is needed based on the required state of the
         * target class (My.Cat).
         *
         * @param {Object} members The properties to add to this class. This should be
         * specified as an object literal containing one or more properties.
         * @return {Ext.Base} this class
         * @static
         * @inheritable
         * @deprecated 2.1.0 Please use {@link Ext#define Ext.define} instead
         */
        override: function(members) {
            var me = this,
                enumerables = Ext.enumerables,
                target = me.prototype,
                cloneFunction = Ext.Function.clone,
                name, index, member, statics, names, previous;

            if (arguments.length === 2) {
                name = members;
                members = {};
                members[name] = arguments[1];
                enumerables = null;
            }

            do {
                names = []; // clean slate for prototype (1st pass) and static (2nd pass)
                statics = null; // not needed 1st pass, but needs to be cleared for 2nd pass

                for (name in members) { // hasOwnProperty is checked in the next loop...
                    if (name == 'statics') {
                        statics = members[name];
                    }
                    else if (name == 'config') {
                        me.addConfig(members[name], true);
                    }
                    else {
                        names.push(name);
                    }
                }

                if (enumerables) {
                    names.push.apply(names, enumerables);
                }

                for (index = names.length; index--; ) {
                    name = names[index];

                    if (members.hasOwnProperty(name)) {
                        member = members[name];

                        if (typeof member == 'function' && !member.$className && member !== Ext.emptyFn) {
                            if (typeof member.$owner != 'undefined') {
                                member = cloneFunction(member);
                            }

                            //<debug>
                            var className = me.$className;
                            if (className) {
                                member.displayName = className + '#' + name;
                            }
                            //</debug>

                            member.$owner = me;
                            member.$name = name;

                            previous = target[name];
                            if (previous) {
                                member.$previous = previous;
                            }
                        }

                        target[name] = member;
                    }
                }

                target = me; // 2nd pass is for statics
                members = statics; // statics will be null on 2nd pass
            } while (members);

            return this;
        },

        /**
         * @protected
         * @static
         * @inheritable
         */
        callParent: function(args) {
            var method;

            // This code is intentionally inlined for the least amount of debugger stepping
            return (method = this.callParent.caller) && (method.$previous ||
                  ((method = method.$owner ? method : method.caller) &&
                        method.$owner.superclass.$class[method.$name])).apply(this, args || noArgs);
        },

        //<feature classSystem.mixins>
        /**
         * Used internally by the mixins pre-processor
         * @private
         * @static
         * @inheritable
         */
        mixin: function(name, mixinClass) {
            var mixin = mixinClass.prototype,
                prototype = this.prototype,
                key;

            if (typeof mixin.onClassMixedIn != 'undefined') {
                mixin.onClassMixedIn.call(mixinClass, this);
            }

            if (!prototype.hasOwnProperty('mixins')) {
                if ('mixins' in prototype) {
                    prototype.mixins = Ext.Object.chain(prototype.mixins);
                }
                else {
                    prototype.mixins = {};
                }
            }

            for (key in mixin) {
                if (key === 'mixins') {
                    Ext.merge(prototype.mixins, mixin[key]);
                }
                else if (typeof prototype[key] == 'undefined' && key != 'mixinId' && key != 'config') {
                    prototype[key] = mixin[key];
                }
            }

            //<feature classSystem.config>
            if ('config' in mixin) {
                this.addConfig(mixin.config, false);
            }
            //</feature>

            prototype.mixins[name] = mixin;
        },
        //</feature>

        /**
         * Get the current class' name in string format.
         *
         *     Ext.define('My.cool.Class', {
         *         constructor: function() {
         *             alert(this.self.getName()); // alerts 'My.cool.Class'
         *         }
         *     });
         *
         *     My.cool.Class.getName(); // 'My.cool.Class'
         *
         * @return {String} className
         * @static
         * @inheritable
         */
        getName: function() {
            return Ext.getClassName(this);
        },

        /**
         * Create aliases for existing prototype methods. Example:
         *
         *     Ext.define('My.cool.Class', {
         *         method1: function() {  },
         *         method2: function() {  }
         *     });
         *
         *     var test = new My.cool.Class();
         *
         *     My.cool.Class.createAlias({
         *         method3: 'method1',
         *         method4: 'method2'
         *     });
         *
         *     test.method3(); // test.method1()
         *
         *     My.cool.Class.createAlias('method5', 'method3');
         *
         *     test.method5(); // test.method3() -> test.method1()
         *
         * @param {String/Object} alias The new method name, or an object to set multiple aliases. See
         * {@link Ext.Function#flexSetter flexSetter}
         * @param {String/Object} origin The original method name
         * @static
         * @inheritable
         * @method
         */
        createAlias: flexSetter(function(alias, origin) {
            this.override(alias, function() {
                return this[origin].apply(this, arguments);
            });
        }),

        /**
         * @private
         * @static
         * @inheritable
         */
        addXtype: function(xtype) {
            var prototype = this.prototype,
                xtypesMap = prototype.xtypesMap,
                xtypes = prototype.xtypes,
                xtypesChain = prototype.xtypesChain;

            if (!prototype.hasOwnProperty('xtypesMap')) {
                xtypesMap = prototype.xtypesMap = Ext.merge({}, prototype.xtypesMap || {});
                xtypes = prototype.xtypes = prototype.xtypes ? [].concat(prototype.xtypes) : [];
                xtypesChain = prototype.xtypesChain = prototype.xtypesChain ? [].concat(prototype.xtypesChain) : [];
                prototype.xtype = xtype;
            }

            if (!xtypesMap[xtype]) {
                xtypesMap[xtype] = true;
                xtypes.push(xtype);
                xtypesChain.push(xtype);
                Ext.ClassManager.setAlias(this, 'widget.' + xtype);
            }

            return this;
        }
    });

    Base.implement({
        isInstance: true,

        $className: 'Ext.Base',

        configClass: Ext.emptyFn,

        initConfigList: [],

        initConfigMap: {},

        /**
         * Get the reference to the class from which this object was instantiated. Note that unlike {@link Ext.Base#self},
         * `this.statics()` is scope-independent and it always returns the class from which it was called, regardless of what
         * `this` points to during run-time
         *
         *     Ext.define('My.Cat', {
         *         statics: {
         *             totalCreated: 0,
         *             speciesName: 'Cat' // My.Cat.speciesName = 'Cat'
         *         },
         *
         *         constructor: function() {
         *             var statics = this.statics();
         *
         *             alert(statics.speciesName);     // always equals to 'Cat' no matter what 'this' refers to
         *                                             // equivalent to: My.Cat.speciesName
         *
         *             alert(this.self.speciesName);   // dependent on 'this'
         *
         *             statics.totalCreated++;
         *         },
         *
         *         clone: function() {
         *             var cloned = new this.self();                    // dependent on 'this'
         *
         *             cloned.groupName = this.statics().speciesName;   // equivalent to: My.Cat.speciesName
         *
         *             return cloned;
         *         }
         *     });
         *
         *
         *     Ext.define('My.SnowLeopard', {
         *         extend: 'My.Cat',
         *
         *         statics: {
         *             speciesName: 'Snow Leopard'     // My.SnowLeopard.speciesName = 'Snow Leopard'
         *         },
         *
         *         constructor: function() {
         *             this.callParent();
         *         }
         *     });
         *
         *     var cat = new My.Cat();                 // alerts 'Cat', then alerts 'Cat'
         *
         *     var snowLeopard = new My.SnowLeopard(); // alerts 'Cat', then alerts 'Snow Leopard'
         *
         *     var clone = snowLeopard.clone();
         *     alert(Ext.getClassName(clone));         // alerts 'My.SnowLeopard'
         *     alert(clone.groupName);                 // alerts 'Cat'
         *
         *     alert(My.Cat.totalCreated);             // alerts 3
         *
         * @protected
         * @return {Ext.Class}
         */
        statics: function() {
            var method = this.statics.caller,
                self = this.self;

            if (!method) {
                return self;
            }

            return method.$owner;
        },

        /**
         * Call the "parent" method of the current method. That is the method previously
         * overridden by derivation or by an override (see {@link Ext#define}).
         *
         *      Ext.define('My.Base', {
         *          constructor: function (x) {
         *              this.x = x;
         *          },
         *
         *          statics: {
         *              method: function (x) {
         *                  return x;
         *              }
         *          }
         *      });
         *
         *      Ext.define('My.Derived', {
         *          extend: 'My.Base',
         *
         *          constructor: function () {
         *              this.callParent([21]);
         *          }
         *      });
         *
         *      var obj = new My.Derived();
         *
         *      alert(obj.x);  // alerts 21
         *
         * This can be used with an override as follows:
         *
         *      Ext.define('My.DerivedOverride', {
         *          override: 'My.Derived',
         *
         *          constructor: function (x) {
         *              this.callParent([x*2]); // calls original My.Derived constructor
         *          }
         *      });
         *
         *      var obj = new My.Derived();
         *
         *      alert(obj.x);  // now alerts 42
         *
         * This also works with static methods.
         *
         *      Ext.define('My.Derived2', {
         *          extend: 'My.Base',
         *
         *          statics: {
         *              method: function (x) {
         *                  return this.callParent([x*2]); // calls My.Base.method
         *              }
         *          }
         *      });
         *
         *      alert(My.Base.method(10));     // alerts 10
         *      alert(My.Derived2.method(10)); // alerts 20
         *
         * Lastly, it also works with overridden static methods.
         *
         *      Ext.define('My.Derived2Override', {
         *          override: 'My.Derived2',
         *
         *          statics: {
         *              method: function (x) {
         *                  return this.callParent([x*2]); // calls My.Derived2.method
         *              }
         *          }
         *      });
         *
         *      alert(My.Derived2.method(10)); // now alerts 40
         * 
         * To override a method and replace it and also call the superclass method, use
         * {@link #callSuper}. This is often done to patch a method to fix a bug.
         *
         * @protected
         * @param {Array/Arguments} args The arguments, either an array or the `arguments` object
         * from the current method, for example: `this.callParent(arguments)`
         * @return {Object} Returns the result of calling the parent method
         */
        callParent: function(args) {
            // NOTE: this code is deliberately as few expressions (and no function calls)
            // as possible so that a debugger can skip over this noise with the minimum number
            // of steps. Basically, just hit Step Into until you are where you really wanted
            // to be.
            var method,
                superMethod = (method = this.callParent.caller) && (method.$previous ||
                        ((method = method.$owner ? method : method.caller) &&
                                method.$owner.superclass[method.$name]));

            //<debug error>
            if (!superMethod) {
                method = this.callParent.caller;
                var parentClass, methodName;

                if (!method.$owner) {
                    if (!method.caller) {
                        throw new Error("Attempting to call a protected method from the public scope, which is not allowed");
                    }

                    method = method.caller;
                }

                parentClass = method.$owner.superclass;
                methodName = method.$name;

                if (!(methodName in parentClass)) {
                    throw new Error("this.callParent() was called but there's no such method (" + methodName +
                                ") found in the parent class (" + (Ext.getClassName(parentClass) || 'Object') + ")");
                }
            }
            //</debug>

            return superMethod.apply(this, args || noArgs);
        },

        /**
         * This method is used by an override to call the superclass method but bypass any
         * overridden method. This is often done to "patch" a method that contains a bug
         * but for whatever reason cannot be fixed directly.
         * 
         * Consider:
         * 
         *      Ext.define('Ext.some.Class', {
         *          method: function () {
         *              console.log('Good');
         *          }
         *      });
         * 
         *      Ext.define('Ext.some.DerivedClass', {
         *          method: function () {
         *              console.log('Bad');
         * 
         *              // ... logic but with a bug ...
         *              
         *              this.callParent();
         *          }
         *      });
         * 
         * To patch the bug in `DerivedClass.method`, the typical solution is to create an
         * override:
         * 
         *      Ext.define('App.paches.DerivedClass', {
         *          override: 'Ext.some.DerivedClass',
         *          
         *          method: function () {
         *              console.log('Fixed');
         * 
         *              // ... logic but with bug fixed ...
         *
         *              this.callSuper();
         *          }
         *      });
         * 
         * The patch method cannot use `callParent` to call the superclass `method` since
         * that would call the overridden method containing the bug. In other words, the
         * above patch would only produce "Fixed" then "Good" in the console log, whereas,
         * using `callParent` would produce "Fixed" then "Bad" then "Good".
         *
         * @protected
         * @param {Array/Arguments} args The arguments, either an array or the `arguments` object
         * from the current method, for example: `this.callSuper(arguments)`
         * @return {Object} Returns the result of calling the superclass method
         */
        callSuper: function(args) {
            var method,
                superMethod = (method = this.callSuper.caller) && ((method = method.$owner ? method : method.caller) &&
                                method.$owner.superclass[method.$name]);

            //<debug error>
            if (!superMethod) {
                method = this.callSuper.caller;
                var parentClass, methodName;

                if (!method.$owner) {
                    if (!method.caller) {
                        throw new Error("Attempting to call a protected method from the public scope, which is not allowed");
                    }

                    method = method.caller;
                }

                parentClass = method.$owner.superclass;
                methodName = method.$name;

                if (!(methodName in parentClass)) {
                    throw new Error("this.callSuper() was called but there's no such method (" + methodName +
                                ") found in the parent class (" + (Ext.getClassName(parentClass) || 'Object') + ")");
                }
            }
            //</debug>

            return superMethod.apply(this, args || noArgs);
        },

        /**
         * Call the original method that was previously overridden with {@link Ext.Base#override},
         * 
         * This method is deprecated as {@link #callParent} does the same thing.
         *
         *     Ext.define('My.Cat', {
         *         constructor: function() {
         *             alert("I'm a cat!");
         *         }
         *     });
         *
         *     My.Cat.override({
         *         constructor: function() {
         *             alert("I'm going to be a cat!");
         *
         *             var instance = this.callOverridden();
         *
         *             alert("Meeeeoooowwww");
         *
         *             return instance;
         *         }
         *     });
         *
         *     var kitty = new My.Cat(); // alerts "I'm going to be a cat!"
         *                               // alerts "I'm a cat!"
         *                               // alerts "Meeeeoooowwww"
         *
         * @param {Array/Arguments} args The arguments, either an array or the `arguments` object
         * from the current method, for example: `this.callOverridden(arguments)`
         * @return {Object} Returns the result of calling the overridden method
         * @protected
         * @deprecated Use callParent instead
         */
        callOverridden: function(args) {
            var method;

            return (method = this.callOverridden.caller) && method.$previous.apply(this, args || noArgs);
        },

        /**
         * @property {Ext.Class} self
         *
         * Get the reference to the current class from which this object was instantiated. Unlike {@link Ext.Base#statics},
         * `this.self` is scope-dependent and it's meant to be used for dynamic inheritance. See {@link Ext.Base#statics}
         * for a detailed comparison
         *
         *     Ext.define('My.Cat', {
         *         statics: {
         *             speciesName: 'Cat' // My.Cat.speciesName = 'Cat'
         *         },
         *
         *         constructor: function() {
         *             alert(this.self.speciesName); // dependent on 'this'
         *         },
         *
         *         clone: function() {
         *             return new this.self();
         *         }
         *     });
         *
         *
         *     Ext.define('My.SnowLeopard', {
         *         extend: 'My.Cat',
         *         statics: {
         *             speciesName: 'Snow Leopard'         // My.SnowLeopard.speciesName = 'Snow Leopard'
         *         }
         *     });
         *
         *     var cat = new My.Cat();                     // alerts 'Cat'
         *     var snowLeopard = new My.SnowLeopard();     // alerts 'Snow Leopard'
         *
         *     var clone = snowLeopard.clone();
         *     alert(Ext.getClassName(clone));             // alerts 'My.SnowLeopard'
         *
         * @protected
         */
        self: Base,

        // Default constructor, simply returns `this`
        constructor: function() {
            return this;
        },

        //<feature classSystem.config>

        wasInstantiated: false,

        /**
         * Initialize configuration for this class. a typical example:
         *
         *     Ext.define('My.awesome.Class', {
         *         // The default config
         *         config: {
         *             name: 'Awesome',
         *             isAwesome: true
         *         },
         *
         *         constructor: function(config) {
         *             this.initConfig(config);
         *         }
         *     });
         *
         *     var awesome = new My.awesome.Class({
         *         name: 'Super Awesome'
         *     });
         *
         *     alert(awesome.getName()); // 'Super Awesome'
         *
         * @protected
         * @param {Object} instanceConfig
         * @return {Object} mixins The mixin prototypes as key - value pairs
         */
        initConfig: function(instanceConfig) {
            //<debug>
//            if (instanceConfig && instanceConfig.breakOnInitConfig) {
//                debugger;
//            }
            //</debug>
            var configNameCache = Ext.Class.configNameCache,
                prototype = this.self.prototype,
                initConfigList = this.initConfigList,
                initConfigMap = this.initConfigMap,
                config = new this.configClass,
                defaultConfig = this.defaultConfig,
                i, ln, name, value, nameMap, getName;

            this.initConfig = Ext.emptyFn;

            this.initialConfig = instanceConfig || {};

            if (instanceConfig) {
                Ext.merge(config, instanceConfig);
            }

            this.config = config;

            // Optimize initConfigList *once* per class based on the existence of apply* and update* methods
            // Happens only once during the first instantiation
            if (!prototype.hasOwnProperty('wasInstantiated')) {
                prototype.wasInstantiated = true;

                for (i = 0,ln = initConfigList.length; i < ln; i++) {
                    name = initConfigList[i];
                    nameMap = configNameCache[name];
                    value = defaultConfig[name];

                    if (!(nameMap.apply in prototype)
                        && !(nameMap.update in prototype)
                        && prototype[nameMap.set].$isDefault
                        && typeof value != 'object') {
                        prototype[nameMap.internal] = defaultConfig[name];
                        initConfigMap[name] = false;
                        Ext.Array.remove(initConfigList, name);
                        i--;
                        ln--;
                    }
                }
            }

            if (instanceConfig) {
                initConfigList = initConfigList.slice();

                for (name in instanceConfig) {
                    if (name in defaultConfig && !initConfigMap[name]) {
                        initConfigList.push(name);
                    }
                }
            }

            // Point all getters to the initGetters
            for (i = 0,ln = initConfigList.length; i < ln; i++) {
                name = initConfigList[i];
                nameMap = configNameCache[name];
                this[nameMap.get] = this[nameMap.initGet];
            }

            this.beforeInitConfig(config);

            for (i = 0,ln = initConfigList.length; i < ln; i++) {
                name = initConfigList[i];
                nameMap = configNameCache[name];
                getName = nameMap.get;

                if (this.hasOwnProperty(getName)) {
                    this[nameMap.set].call(this, config[name]);
                    delete this[getName];
                }
            }

            return this;
        },

        beforeInitConfig: Ext.emptyFn,

        /**
         * @private
         */
        getCurrentConfig: function() {
            var defaultConfig = this.defaultConfig,
                configNameCache = Ext.Class.configNameCache,
                config = {},
                name, nameMap;

            for (name in defaultConfig) {
                nameMap = configNameCache[name];
                config[name] = this[nameMap.get].call(this);
            }

            return config;
        },

        /**
         * @private
         */
        setConfig: function(config, applyIfNotSet) {
            if (!config) {
                return this;
            }

            var configNameCache = Ext.Class.configNameCache,
                currentConfig = this.config,
                defaultConfig = this.defaultConfig,
                initialConfig = this.initialConfig,
                configList = [],
                name, i, ln, nameMap;

            applyIfNotSet = Boolean(applyIfNotSet);

            for (name in config) {
                if ((applyIfNotSet && (name in initialConfig))) {
                    continue;
                }

                currentConfig[name] = config[name];

                if (name in defaultConfig) {
                    configList.push(name);
                    nameMap = configNameCache[name];
                    this[nameMap.get] = this[nameMap.initGet];
                }
            }

            for (i = 0,ln = configList.length; i < ln; i++) {
                name = configList[i];
                nameMap = configNameCache[name];
                this[nameMap.set].call(this, config[name]);
                delete this[nameMap.get];
            }

            return this;
        },

        set: function(name, value) {
            return this[Ext.Class.configNameCache[name].set].call(this, value);
        },

        get: function(name) {
            return this[Ext.Class.configNameCache[name].get].call(this);
        },

        /**
         * @private
         */
        getConfig: function(name) {
            return this[Ext.Class.configNameCache[name].get].call(this);
        },

        /**
         * @private
         */
        hasConfig: function(name) {
            return (name in this.defaultConfig);
        },

        /**
         * Returns the initial configuration passed to constructor.
         *
         * @param {String} [name] When supplied, value for particular configuration
         * option is returned, otherwise the full config object is returned.
         * @return {Object/Mixed}
         */
        getInitialConfig: function(name) {
            var config = this.config;

            if (!name) {
                return config;
            }
            else {
                return config[name];
            }
        },

        /**
         * @private
         */
        onConfigUpdate: function(names, callback, scope) {
            var self = this.self,
                //<debug>
                className = self.$className,
                //</debug>
                i, ln, name,
                updaterName, updater, newUpdater;

            names = Ext.Array.from(names);

            scope = scope || this;

            for (i = 0,ln = names.length; i < ln; i++) {
                name = names[i];
                updaterName = 'update' + Ext.String.capitalize(name);
                updater = this[updaterName] || Ext.emptyFn;
                newUpdater = function() {
                    updater.apply(this, arguments);
                    scope[callback].apply(scope, arguments);
                };
                newUpdater.$name = updaterName;
                newUpdater.$owner = self;
                //<debug>
                newUpdater.displayName = className + '#' + updaterName;
                //</debug>

                this[updaterName] = newUpdater;
            }
        },
        //</feature>

        /**
         * @private
         * @param name
         * @param value
         * @return {Mixed}
         */
        link: function(name, value) {
            this.$links = {};
            this.link = this.doLink;
            return this.link.apply(this, arguments);
        },

        doLink: function(name, value) {
            this.$links[name] = true;

            this[name] = value;

            return value;
        },

        /**
         * @private
         */
        unlink: function() {
            var i, ln, link, value;

            for (i = 0, ln = arguments.length; i < ln; i++) {
                link = arguments[i];
                if (this.hasOwnProperty(link)) {
                    value = this[link];
                    if (value) {
                        if (value.isInstance && !value.isDestroyed) {
                            value.destroy();
                        }
                        else if (value.parentNode && 'nodeType' in value) {
                            value.parentNode.removeChild(value);
                        }
                    }
                    delete this[link];
                }
            }

            return this;
        },

        /**
         * @protected
         */
        destroy: function() {
            this.destroy = Ext.emptyFn;
            this.isDestroyed = true;

            if (this.hasOwnProperty('$links')) {
                this.unlink.apply(this, Ext.Object.getKeys(this.$links));
                delete this.$links;
            }
        }
    });

    Ext.Base = Base;

})(Ext.Function.flexSetter);

//@tag foundation,core
//@define Ext.Class
//@require Ext.Base

/**
 * @class Ext.Class
 *
 * @author Jacky Nguyen <jacky@sencha.com>
 * @aside guide class_system
 * @aside video class-system
 *
 * Handles class creation throughout the framework. This is a low level factory that is used by Ext.ClassManager and generally
 * should not be used directly. If you choose to use Ext.Class you will lose out on the namespace, aliasing and dependency loading
 * features made available by Ext.ClassManager. The only time you would use Ext.Class directly is to create an anonymous class.
 *
 * If you wish to create a class you should use {@link Ext#define Ext.define} which aliases
 * {@link Ext.ClassManager#create Ext.ClassManager.create} to enable namespacing and dynamic dependency resolution.
 *
 * Ext.Class is the factory and **not** the superclass of everything. For the base class that **all** Ext classes inherit
 * from, see {@link Ext.Base}.
 */
(function() {
    var ExtClass,
        Base = Ext.Base,
        baseStaticMembers = [],
        baseStaticMember, baseStaticMemberLength;

    for (baseStaticMember in Base) {
        if (Base.hasOwnProperty(baseStaticMember)) {
            baseStaticMembers.push(baseStaticMember);
        }
    }

    baseStaticMemberLength = baseStaticMembers.length;

    /**
     * @method constructor
     * Creates a new anonymous class.
     *
     * @param {Object} data An object represent the properties of this class.
     * @param {Function} onCreated (optional) The callback function to be executed when this class is fully created.
     * Note that the creation process can be asynchronous depending on the pre-processors used.
     *
     * @return {Ext.Base} The newly created class
     */
    Ext.Class = ExtClass = function(Class, data, onCreated) {
        if (typeof Class != 'function') {
            onCreated = data;
            data = Class;
            Class = null;
        }

        if (!data) {
            data = {};
        }

        Class = ExtClass.create(Class);

        ExtClass.process(Class, data, onCreated);

        return Class;
    };

    Ext.apply(ExtClass, {
        /**
         * @private
         * @static
         */
        onBeforeCreated: function(Class, data, hooks) {
            Class.addMembers(data);

            hooks.onCreated.call(Class, Class);
        },

        /**
         * @private
         * @static
         */
        create: function(Class) {
            var name, i;

            if (!Class) {
                Class = function() {
                    return this.constructor.apply(this, arguments);
                };
            }

            for (i = 0; i < baseStaticMemberLength; i++) {
                name = baseStaticMembers[i];
                Class[name] = Base[name];
            }

            return Class;
        },

        /**
         * @private
         * @static
         */
        process: function(Class, data, onCreated) {
            var preprocessorStack = data.preprocessors || ExtClass.defaultPreprocessors,
                preprocessors = this.preprocessors,
                hooks = {
                    onBeforeCreated: this.onBeforeCreated,
                    onCreated: onCreated || Ext.emptyFn
                },
                index = 0,
                name, preprocessor, properties,
                i, ln, fn, property, process;

            delete data.preprocessors;

            process = function(Class, data, hooks) {
                fn = null;

                while (fn === null) {
                    name = preprocessorStack[index++];

                    if (name) {
                        preprocessor = preprocessors[name];
                        properties = preprocessor.properties;

                        if (properties === true) {
                            fn = preprocessor.fn;
                        }
                        else {
                            for (i = 0,ln = properties.length; i < ln; i++) {
                                property = properties[i];

                                if (data.hasOwnProperty(property)) {
                                    fn = preprocessor.fn;
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        hooks.onBeforeCreated.apply(this, arguments);
                        return;
                    }
                }

                if (fn.call(this, Class, data, hooks, process) !== false) {
                    process.apply(this, arguments);
                }
            };

            process.call(this, Class, data, hooks);
        },

        /**
         * @private
         * @static
         */
        preprocessors: {},

        /**
         * Register a new pre-processor to be used during the class creation process.
         *
         * @private
         * @static
         * @param {String} name The pre-processor's name.
         * @param {Function} fn The callback function to be executed. Typical format:
         *
         *     function(cls, data, fn) {
         *         // Your code here
         *
         *         // Execute this when the processing is finished.
         *         // Asynchronous processing is perfectly OK
         *         if (fn) {
         *             fn.call(this, cls, data);
         *         }
         *     });
         *
         * @param {Function} fn.cls The created class.
         * @param {Object} fn.data The set of properties passed in {@link Ext.Class} constructor.
         * @param {Function} fn.fn The callback function that __must__ to be executed when this pre-processor finishes,
         * regardless of whether the processing is synchronous or asynchronous.
         *
         * @return {Ext.Class} this
         */
        registerPreprocessor: function(name, fn, properties, position, relativeTo) {
            if (!position) {
                position = 'last';
            }

            if (!properties) {
                properties = [name];
            }

            this.preprocessors[name] = {
                name: name,
                properties: properties || false,
                fn: fn
            };

            this.setDefaultPreprocessorPosition(name, position, relativeTo);

            return this;
        },

        /**
         * Retrieve a pre-processor callback function by its name, which has been registered before.
         *
         * @private
         * @static
         * @param {String} name
         * @return {Function} preprocessor
         */
        getPreprocessor: function(name) {
            return this.preprocessors[name];
        },

        /**
         * @private
         * @static
         */
        getPreprocessors: function() {
            return this.preprocessors;
        },

        /**
         * @private
         * @static
         */
        defaultPreprocessors: [],

        /**
         * Retrieve the array stack of default pre-processors.
         * @private
         * @static
         * @return {Function} defaultPreprocessors
         */
        getDefaultPreprocessors: function() {
            return this.defaultPreprocessors;
        },

        /**
         * Set the default array stack of default pre-processors.
         *
         * @private
         * @static
         * @param {Array} preprocessors
         * @return {Ext.Class} this
         */
        setDefaultPreprocessors: function(preprocessors) {
            this.defaultPreprocessors = Ext.Array.from(preprocessors);

            return this;
        },

        /**
         * Insert this pre-processor at a specific position in the stack, optionally relative to
         * any existing pre-processor. For example:
         *
         *     Ext.Class.registerPreprocessor('debug', function(cls, data, fn) {
         *         // Your code here
         *
         *         if (fn) {
         *             fn.call(this, cls, data);
         *         }
         *     }).insertDefaultPreprocessor('debug', 'last');
         *
         * @private
         * @static
         * @param {String} name The pre-processor name. Note that it needs to be registered with
         * {@link Ext.Class#registerPreprocessor registerPreprocessor} before this.
         * @param {String} offset The insertion position. Four possible values are:
         * 'first', 'last', or: 'before', 'after' (relative to the name provided in the third argument).
         * @param {String} relativeName
         * @return {Ext.Class} this
         */
        setDefaultPreprocessorPosition: function(name, offset, relativeName) {
            var defaultPreprocessors = this.defaultPreprocessors,
                index;

            if (typeof offset == 'string') {
                if (offset === 'first') {
                    defaultPreprocessors.unshift(name);

                    return this;
                }
                else if (offset === 'last') {
                    defaultPreprocessors.push(name);

                    return this;
                }

                offset = (offset === 'after') ? 1 : -1;
            }

            index = Ext.Array.indexOf(defaultPreprocessors, relativeName);

            if (index !== -1) {
                Ext.Array.splice(defaultPreprocessors, Math.max(0, index + offset), 0, name);
            }

            return this;
        },

        /**
         * @private
         * @static
         */
        configNameCache: {},

        /**
         * @private
         * @static
         */
        getConfigNameMap: function(name) {
            var cache = this.configNameCache,
                map = cache[name],
                capitalizedName;

            if (!map) {
                capitalizedName = name.charAt(0).toUpperCase() + name.substr(1);

                map = cache[name] = {
                    name: name,
                    internal: '_' + name,
                    initializing: 'is' + capitalizedName + 'Initializing',
                    apply: 'apply' + capitalizedName,
                    update: 'update' + capitalizedName,
                    set: 'set' + capitalizedName,
                    get: 'get' + capitalizedName,
                    initGet: 'initGet' + capitalizedName,
                    doSet : 'doSet' + capitalizedName,
                    changeEvent: name.toLowerCase() + 'change'
                }
            }

            return map;
        },

        /**
         * @private
         * @static
         */
        generateSetter: function(nameMap) {
            var internalName = nameMap.internal,
                getName = nameMap.get,
                applyName = nameMap.apply,
                updateName = nameMap.update,
                setter;

            setter = function(value) {
                var oldValue = this[internalName],
                    applier = this[applyName],
                    updater = this[updateName];

                delete this[getName];

                if (applier) {
                    value = applier.call(this, value, oldValue);
                }

                if (typeof value != 'undefined') {
                    this[internalName] = value;

                    if (updater && value !== oldValue) {
                        updater.call(this, value, oldValue);
                    }
                }

                return this;
            };

            setter.$isDefault = true;

            return setter;
        },

        /**
         * @private
         * @static
         */
        generateInitGetter: function(nameMap) {
            var name = nameMap.name,
                setName = nameMap.set,
                getName = nameMap.get,
                initializingName = nameMap.initializing;

            return function() {
                this[initializingName] = true;
                delete this[getName];

                this[setName].call(this, this.config[name]);
                delete this[initializingName];

                return this[getName].apply(this, arguments);
            }
        },

        /**
         * @private
         * @static
         */
        generateGetter: function(nameMap) {
            var internalName = nameMap.internal;

            return function() {
                return this[internalName];
            }
        }
    });

    /**
     * @cfg {String} extend
     * The parent class that this class extends. For example:
     *
     *     @example
     *     Ext.define('Person', {
     *         say: function(text) {
     *             alert(text);
     *         }
     *     });
     *
     *     Ext.define('Developer', {
     *         extend: 'Person',
     *         say: function(text) {
     *             this.callParent(["print " + text]);
     *         }
     *     });
     *
     *     var person1 = Ext.create("Person");
     *     person1.say("Bill");
     *
     *     var developer1 = Ext.create("Developer");
     *     developer1.say("Ted");
     */
    ExtClass.registerPreprocessor('extend', function(Class, data) {
        var Base = Ext.Base,
            extend = data.extend,
            Parent;

        delete data.extend;

        if (extend && extend !== Object) {
            Parent = extend;
        }
        else {
            Parent = Base;
        }

        Class.extend(Parent);

        Class.triggerExtended.apply(Class, arguments);

        if (data.onClassExtended) {
            Class.onExtended(data.onClassExtended, Class);
            delete data.onClassExtended;
        }

    }, true);

    //<feature classSystem.statics>
    /**
     * @cfg {Object} statics
     * List of static methods for this class. For example:
     *
     *     Ext.define('Computer', {
     *          statics: {
     *              factory: function(brand) {
     *                  // 'this' in static methods refer to the class itself
     *                  return new this(brand);
     *              }
     *          },
     *
     *          constructor: function() {
     *              // ...
     *          }
     *     });
     *
     *     var dellComputer = Computer.factory('Dell');
     */
    ExtClass.registerPreprocessor('statics', function(Class, data) {
        Class.addStatics(data.statics);

        delete data.statics;
    });
    //</feature>

    //<feature classSystem.inheritableStatics>
    /**
     * @cfg {Object} inheritableStatics
     * List of inheritable static methods for this class.
     * Otherwise just like {@link #statics} but subclasses inherit these methods.
     */
    ExtClass.registerPreprocessor('inheritableStatics', function(Class, data) {
        Class.addInheritableStatics(data.inheritableStatics);

        delete data.inheritableStatics;
    });
    //</feature>

    //<feature classSystem.config>
    /**
     * @cfg {Object} config
     *
     * List of configuration options with their default values.
     *
     * __Note:__ You need to make sure {@link Ext.Base#initConfig} is called from your constructor if you are defining
     * your own class or singleton, unless you are extending a Component. Otherwise the generated getter and setter
     * methods will not be initialized.
     *
     * Each config item will have its own setter and getter method automatically generated inside the class prototype
     * during class creation time, if the class does not have those methods explicitly defined.
     *
     * As an example, let's convert the name property of a Person class to be a config item, then add extra age and
     * gender items.
     *
     *     Ext.define('My.sample.Person', {
     *         config: {
     *             name: 'Mr. Unknown',
     *             age: 0,
     *             gender: 'Male'
     *         },
     *
     *         constructor: function(config) {
     *             this.initConfig(config);
     *
     *             return this;
     *         }
     *
     *         // ...
     *     });
     *
     * Within the class, this.name still has the default value of "Mr. Unknown". However, it's now publicly accessible
     * without sacrificing encapsulation, via setter and getter methods.
     *
     *     var jacky = new Person({
     *         name: "Jacky",
     *         age: 35
     *     });
     *
     *     alert(jacky.getAge());      // alerts 35
     *     alert(jacky.getGender());   // alerts "Male"
     *
     *     jacky.walk(10);             // alerts "Jacky is walking 10 steps"
     *
     *     jacky.setName("Mr. Nguyen");
     *     alert(jacky.getName());     // alerts "Mr. Nguyen"
     *
     *     jacky.walk(10);             // alerts "Mr. Nguyen is walking 10 steps"
     *
     * Notice that we changed the class constructor to invoke this.initConfig() and pass in the provided config object.
     * Two key things happened:
     *
     *  - The provided config object when the class is instantiated is recursively merged with the default config object.
     *  - All corresponding setter methods are called with the merged values.
     *
     * Beside storing the given values, throughout the frameworks, setters generally have two key responsibilities:
     *
     *  - Filtering / validation / transformation of the given value before it's actually stored within the instance.
     *  - Notification (such as firing events) / post-processing after the value has been set, or changed from a
     *    previous value.
     *
     * By standardize this common pattern, the default generated setters provide two extra template methods that you
     * can put your own custom logics into, i.e: an "applyFoo" and "updateFoo" method for a "foo" config item, which are
     * executed before and after the value is actually set, respectively. Back to the example class, let's validate that
     * age must be a valid positive number, and fire an 'agechange' if the value is modified.
     *
     *     Ext.define('My.sample.Person', {
     *         config: {
     *             // ...
     *         },
     *
     *         constructor: {
     *             // ...
     *         },
     *
     *         applyAge: function(age) {
     *             if (typeof age !== 'number' || age < 0) {
     *                 console.warn("Invalid age, must be a positive number");
     *                 return;
     *             }
     *
     *             return age;
     *         },
     *
     *         updateAge: function(newAge, oldAge) {
     *             // age has changed from "oldAge" to "newAge"
     *             this.fireEvent('agechange', this, newAge, oldAge);
     *         }
     *
     *         // ...
     *     });
     *
     *     var jacky = new Person({
     *         name: "Jacky",
     *         age: 'invalid'
     *     });
     *
     *     alert(jacky.getAge());      // alerts 0
     *
     *     alert(jacky.setAge(-100));  // alerts 0
     *     alert(jacky.getAge());      // alerts 0
     *
     *     alert(jacky.setAge(35));    // alerts 0
     *     alert(jacky.getAge());      // alerts 35
     *
     * In other words, when leveraging the config feature, you mostly never need to define setter and getter methods
     * explicitly. Instead, "apply*" and "update*" methods should be implemented where necessary. Your code will be
     * consistent throughout and only contain the minimal logic that you actually care about.
     *
     * When it comes to inheritance, the default config of the parent class is automatically, recursively merged with
     * the child's default config. The same applies for mixins.
     */
    ExtClass.registerPreprocessor('config', function(Class, data) {
        var config = data.config,
            prototype = Class.prototype,
            defaultConfig = prototype.config,
            nameMap, name, setName, getName, initGetName, internalName, value;

        delete data.config;

        for (name in config) {
            // Once per config item, per class hierarchy
            if (config.hasOwnProperty(name) && !(name in defaultConfig)) {
                value = config[name];
                nameMap = this.getConfigNameMap(name);
                setName = nameMap.set;
                getName = nameMap.get;
                initGetName = nameMap.initGet;
                internalName = nameMap.internal;

                data[initGetName] = this.generateInitGetter(nameMap);

                if (value === null && !data.hasOwnProperty(internalName)) {
                    data[internalName] = null;
                }

                if (!data.hasOwnProperty(getName)) {
                    data[getName] = this.generateGetter(nameMap);
                }

                if (!data.hasOwnProperty(setName)) {
                    data[setName] = this.generateSetter(nameMap);
                }
            }
        }

        Class.addConfig(config, true);
    });
    //</feature>

    //<feature classSystem.mixins>
    /**
     * @cfg {Object} mixins
     * List of classes to mix into this class. For example:
     *
     *     Ext.define('CanSing', {
     *          sing: function() {
     *              alert("I'm on the highway to hell...");
     *          }
     *     });
     *
     *     Ext.define('Musician', {
     *          extend: 'Person',
     *
     *          mixins: {
     *              canSing: 'CanSing'
     *          }
     *     });
     */
    ExtClass.registerPreprocessor('mixins', function(Class, data, hooks) {
        var mixins = data.mixins,
            name, mixin, i, ln;

        delete data.mixins;

        Ext.Function.interceptBefore(hooks, 'onCreated', function() {
            if (mixins instanceof Array) {
                for (i = 0,ln = mixins.length; i < ln; i++) {
                    mixin = mixins[i];
                    name = mixin.prototype.mixinId || mixin.$className;

                    Class.mixin(name, mixin);
                }
            }
            else {
                for (name in mixins) {
                    if (mixins.hasOwnProperty(name)) {
                        Class.mixin(name, mixins[name]);
                    }
                }
            }
        });
    });
    //</feature>

    //<feature classSystem.backwardsCompatible>
    // Backwards compatible
    Ext.extend = function(Class, Parent, members) {
        if (arguments.length === 2 && Ext.isObject(Parent)) {
            members = Parent;
            Parent = Class;
            Class = null;
        }

        var cls;

        if (!Parent) {
            throw new Error("[Ext.extend] Attempting to extend from a class which has not been loaded on the page.");
        }

        members.extend = Parent;
        members.preprocessors = [
            'extend'
            //<feature classSystem.statics>
            ,'statics'
            //</feature>
            //<feature classSystem.inheritableStatics>
            ,'inheritableStatics'
            //</feature>
            //<feature classSystem.mixins>
            ,'mixins'
            //</feature>
            //<feature classSystem.config>
            ,'config'
            //</feature>
        ];

        if (Class) {
            cls = new ExtClass(Class, members);
        }
        else {
            cls = new ExtClass(members);
        }

        cls.prototype.override = function(o) {
            for (var m in o) {
                if (o.hasOwnProperty(m)) {
                    this[m] = o[m];
                }
            }
        };

        return cls;
    };
    //</feature>
})();

//@tag foundation,core
//@define Ext.ClassManager
//@require Ext.Class

/**
 * @class  Ext.ClassManager
 *
 * @author Jacky Nguyen <jacky@sencha.com>
 * @aside guide class_system
 * @aside video class-system
 *
 * Ext.ClassManager manages all classes and handles mapping from string class name to
 * actual class objects throughout the whole framework. It is not generally accessed directly, rather through
 * these convenient shorthands:
 *
 * - {@link Ext#define Ext.define}
 * - {@link Ext.ClassManager#create Ext.create}
 * - {@link Ext#widget Ext.widget}
 * - {@link Ext#getClass Ext.getClass}
 * - {@link Ext#getClassName Ext.getClassName}
 *
 * ## Basic syntax:
 *
 *     Ext.define(className, properties);
 *
 * in which `properties` is an object represent a collection of properties that apply to the class. See
 * {@link Ext.ClassManager#create} for more detailed instructions.
 *
 *     @example
 *     Ext.define('Person', {
 *          name: 'Unknown',
 *
 *          constructor: function(name) {
 *              if (name) {
 *                  this.name = name;
 *              }
 *
 *              return this;
 *          },
 *
 *          eat: function(foodType) {
 *              alert("I'm eating: " + foodType);
 *
 *              return this;
 *          }
 *     });
 *
 *     var aaron = new Person("Aaron");
 *     aaron.eat("Sandwich"); // alert("I'm eating: Sandwich");
 *
 * Ext.Class has a powerful set of extensible {@link Ext.Class#registerPreprocessor pre-processors} which takes care of
 * everything related to class creation, including but not limited to inheritance, mixins, configuration, statics, etc.
 *
 * ## Inheritance:
 *
 *     Ext.define('Developer', {
 *          extend: 'Person',
 *
 *          constructor: function(name, isGeek) {
 *              this.isGeek = isGeek;
 *
 *              // Apply a method from the parent class' prototype
 *              this.callParent([name]);
 *
 *              return this;
 *
 *          },
 *
 *          code: function(language) {
 *              alert("I'm coding in: " + language);
 *
 *              this.eat("Bugs");
 *
 *              return this;
 *          }
 *     });
 *
 *     var jacky = new Developer("Jacky", true);
 *     jacky.code("JavaScript"); // alert("I'm coding in: JavaScript");
 *                               // alert("I'm eating: Bugs");
 *
 * See {@link Ext.Base#callParent} for more details on calling superclass' methods
 *
 * ## Mixins:
 *
 *     Ext.define('CanPlayGuitar', {
 *          playGuitar: function() {
 *             alert("F#...G...D...A");
 *          }
 *     });
 *
 *     Ext.define('CanComposeSongs', {
 *          composeSongs: function() { }
 *     });
 *
 *     Ext.define('CanSing', {
 *          sing: function() {
 *              alert("I'm on the highway to hell...");
 *          }
 *     });
 *
 *     Ext.define('Musician', {
 *          extend: 'Person',
 *
 *          mixins: {
 *              canPlayGuitar: 'CanPlayGuitar',
 *              canComposeSongs: 'CanComposeSongs',
 *              canSing: 'CanSing'
 *          }
 *     });
 *
 *     Ext.define('CoolPerson', {
 *          extend: 'Person',
 *
 *          mixins: {
 *              canPlayGuitar: 'CanPlayGuitar',
 *              canSing: 'CanSing'
 *          },
 *
 *          sing: function() {
 *              alert("Ahem...");
 *
 *              this.mixins.canSing.sing.call(this);
 *
 *              alert("[Playing guitar at the same time...]");
 *
 *              this.playGuitar();
 *          }
 *     });
 *
 *     var me = new CoolPerson("Jacky");
 *
 *     me.sing(); // alert("Ahem...");
 *                // alert("I'm on the highway to hell...");
 *                // alert("[Playing guitar at the same time...]");
 *                // alert("F#...G...D...A");
 *
 * ## Config:
 *
 *     Ext.define('SmartPhone', {
 *          config: {
 *              hasTouchScreen: false,
 *              operatingSystem: 'Other',
 *              price: 500
 *          },
 *
 *          isExpensive: false,
 *
 *          constructor: function(config) {
 *              this.initConfig(config);
 *
 *              return this;
 *          },
 *
 *          applyPrice: function(price) {
 *              this.isExpensive = (price > 500);
 *
 *              return price;
 *          },
 *
 *          applyOperatingSystem: function(operatingSystem) {
 *              if (!(/^(iOS|Android|BlackBerry)$/i).test(operatingSystem)) {
 *                  return 'Other';
 *              }
 *
 *              return operatingSystem;
 *          }
 *     });
 *
 *     var iPhone = new SmartPhone({
 *          hasTouchScreen: true,
 *          operatingSystem: 'iOS'
 *     });
 *
 *     iPhone.getPrice(); // 500;
 *     iPhone.getOperatingSystem(); // 'iOS'
 *     iPhone.getHasTouchScreen(); // true;
 *
 *     iPhone.isExpensive; // false;
 *     iPhone.setPrice(600);
 *     iPhone.getPrice(); // 600
 *     iPhone.isExpensive; // true;
 *
 *     iPhone.setOperatingSystem('AlienOS');
 *     iPhone.getOperatingSystem(); // 'Other'
 *
 * ## Statics:
 *
 *     Ext.define('Computer', {
 *          statics: {
 *              factory: function(brand) {
 *                 // 'this' in static methods refer to the class itself
 *                  return new this(brand);
 *              }
 *          },
 *
 *          constructor: function() { }
 *     });
 *
 *     var dellComputer = Computer.factory('Dell');
 *
 * Also see {@link Ext.Base#statics} and {@link Ext.Base#self} for more details on accessing
 * static properties within class methods
 *
 * @singleton
 */
(function(Class, alias, arraySlice, arrayFrom, global) {
    var Manager = Ext.ClassManager = {

        /**
         * @property classes
         * @type Object
         * All classes which were defined through the ClassManager. Keys are the
         * name of the classes and the values are references to the classes.
         * @private
         */
        classes: {},

        /**
         * @private
         */
        existCache: {},

        /**
         * @private
         */
        namespaceRewrites: [{
            from: 'Ext.',
            to: Ext
        }],

        /**
         * @private
         */
        maps: {
            alternateToName: {},
            aliasToName: {},
            nameToAliases: {},
            nameToAlternates: {}
        },

        /** @private */
        enableNamespaceParseCache: true,

        /** @private */
        namespaceParseCache: {},

        /** @private */
        instantiators: [],

        /**
         * Checks if a class has already been created.
         *
         * @param {String} className
         * @return {Boolean} exist
         */
        isCreated: function(className) {
            var existCache = this.existCache,
                i, ln, part, root, parts;

            //<debug error>
            if (typeof className != 'string' || className.length < 1) {
                throw new Error("[Ext.ClassManager] Invalid classname, must be a string and must not be empty");
            }
            //</debug>

            if (this.classes[className] || existCache[className]) {
                return true;
            }

            root = global;
            parts = this.parseNamespace(className);

            for (i = 0, ln = parts.length; i < ln; i++) {
                part = parts[i];

                if (typeof part != 'string') {
                    root = part;
                } else {
                    if (!root || !root[part]) {
                        return false;
                    }

                    root = root[part];
                }
            }

            existCache[className] = true;

            this.triggerCreated(className);

            return true;
        },

        /**
         * @private
         */
        createdListeners: [],

        /**
         * @private
         */
        nameCreatedListeners: {},

        /**
         * @private
         */
        triggerCreated: function(className) {
            var listeners = this.createdListeners,
                nameListeners = this.nameCreatedListeners,
                alternateNames = this.maps.nameToAlternates[className],
                names = [className],
                i, ln, j, subLn, listener, name;

            for (i = 0,ln = listeners.length; i < ln; i++) {
                listener = listeners[i];
                listener.fn.call(listener.scope, className);
            }

            if (alternateNames) {
                names.push.apply(names, alternateNames);
            }

            for (i = 0,ln = names.length; i < ln; i++) {
                name = names[i];
                listeners = nameListeners[name];

                if (listeners) {
                    for (j = 0,subLn = listeners.length; j < subLn; j++) {
                        listener = listeners[j];
                        listener.fn.call(listener.scope, name);
                    }
                    delete nameListeners[name];
                }
            }
        },

        /**
         * @private
         */
        onCreated: function(fn, scope, className) {
            var listeners = this.createdListeners,
                nameListeners = this.nameCreatedListeners,
                listener = {
                    fn: fn,
                    scope: scope
                };

            if (className) {
                if (this.isCreated(className)) {
                    fn.call(scope, className);
                    return;
                }

                if (!nameListeners[className]) {
                    nameListeners[className] = [];
                }

                nameListeners[className].push(listener);
            }
            else {
                listeners.push(listener);
            }
        },

        /**
         * Supports namespace rewriting.
         * @private
         */
        parseNamespace: function(namespace) {
            //<debug error>
            if (typeof namespace != 'string') {
                throw new Error("[Ext.ClassManager] Invalid namespace, must be a string");
            }
            //</debug>

            var cache = this.namespaceParseCache;

            if (this.enableNamespaceParseCache) {
                if (cache.hasOwnProperty(namespace)) {
                    return cache[namespace];
                }
            }

            var parts = [],
                rewrites = this.namespaceRewrites,
                root = global,
                name = namespace,
                rewrite, from, to, i, ln;

            for (i = 0, ln = rewrites.length; i < ln; i++) {
                rewrite = rewrites[i];
                from = rewrite.from;
                to = rewrite.to;

                if (name === from || name.substring(0, from.length) === from) {
                    name = name.substring(from.length);

                    if (typeof to != 'string') {
                        root = to;
                    } else {
                        parts = parts.concat(to.split('.'));
                    }

                    break;
                }
            }

            parts.push(root);

            parts = parts.concat(name.split('.'));

            if (this.enableNamespaceParseCache) {
                cache[namespace] = parts;
            }

            return parts;
        },

        /**
         * Creates a namespace and assign the `value` to the created object.
         *
         *     Ext.ClassManager.setNamespace('MyCompany.pkg.Example', someObject);
         *     alert(MyCompany.pkg.Example === someObject); // alerts true
         *
         * @param {String} name
         * @param {Mixed} value
         */
        setNamespace: function(name, value) {
            var root = global,
                parts = this.parseNamespace(name),
                ln = parts.length - 1,
                leaf = parts[ln],
                i, part;

            for (i = 0; i < ln; i++) {
                part = parts[i];

                if (typeof part != 'string') {
                    root = part;
                } else {
                    if (!root[part]) {
                        root[part] = {};
                    }

                    root = root[part];
                }
            }

            root[leaf] = value;

            return root[leaf];
        },

        /**
         * The new Ext.ns, supports namespace rewriting.
         * @private
         */
        createNamespaces: function() {
            var root = global,
                parts, part, i, j, ln, subLn;

            for (i = 0, ln = arguments.length; i < ln; i++) {
                parts = this.parseNamespace(arguments[i]);

                for (j = 0, subLn = parts.length; j < subLn; j++) {
                    part = parts[j];

                    if (typeof part != 'string') {
                        root = part;
                    } else {
                        if (!root[part]) {
                            root[part] = {};
                        }

                        root = root[part];
                    }
                }
            }

            return root;
        },

        /**
         * Sets a name reference to a class.
         *
         * @param {String} name
         * @param {Object} value
         * @return {Ext.ClassManager} this
         */
        set: function(name, value) {
            var me = this,
                maps = me.maps,
                nameToAlternates = maps.nameToAlternates,
                targetName = me.getName(value),
                alternates;

            me.classes[name] = me.setNamespace(name, value);

            if (targetName && targetName !== name) {
                maps.alternateToName[name] = targetName;
                alternates = nameToAlternates[targetName] || (nameToAlternates[targetName] = []);
                alternates.push(name);
            }

            return this;
        },

        /**
         * Retrieve a class by its name.
         *
         * @param {String} name
         * @return {Ext.Class} class
         */
        get: function(name) {
            var classes = this.classes;

            if (classes[name]) {
                return classes[name];
            }

            var root = global,
                parts = this.parseNamespace(name),
                part, i, ln;

            for (i = 0, ln = parts.length; i < ln; i++) {
                part = parts[i];

                if (typeof part != 'string') {
                    root = part;
                } else {
                    if (!root || !root[part]) {
                        return null;
                    }

                    root = root[part];
                }
            }

            return root;
        },

        /**
         * Register the alias for a class.
         *
         * @param {Ext.Class/String} cls a reference to a class or a `className`.
         * @param {String} alias Alias to use when referring to this class.
         */
        setAlias: function(cls, alias) {
            var aliasToNameMap = this.maps.aliasToName,
                nameToAliasesMap = this.maps.nameToAliases,
                className;

            if (typeof cls == 'string') {
                className = cls;
            } else {
                className = this.getName(cls);
            }

            if (alias && aliasToNameMap[alias] !== className) {
                //<debug info>
                if (aliasToNameMap[alias]) {
                    Ext.Logger.info("[Ext.ClassManager] Overriding existing alias: '" + alias + "' " +
                        "of: '" + aliasToNameMap[alias] + "' with: '" + className + "'. Be sure it's intentional.");
                }
                //</debug>

                aliasToNameMap[alias] = className;
            }

            if (!nameToAliasesMap[className]) {
                nameToAliasesMap[className] = [];
            }

            if (alias) {
                Ext.Array.include(nameToAliasesMap[className], alias);
            }

            return this;
        },

        /**
         * Adds a batch of class name to alias mappings
         * @param {Object} aliases The set of mappings of the form
         * className : [values...]
         */
        addNameAliasMappings: function(aliases){
            var aliasToNameMap = this.maps.aliasToName,
                nameToAliasesMap = this.maps.nameToAliases,
                className, aliasList, alias, i;

            for (className in aliases) {
                aliasList = nameToAliasesMap[className] ||
                    (nameToAliasesMap[className] = []);

                for (i = 0; i < aliases[className].length; i++) {
                    alias = aliases[className][i];
                    if (!aliasToNameMap[alias]) {
                        aliasToNameMap[alias] = className;
                        aliasList.push(alias);
                    }
                }

            }
            return this;
        },

        /**
         *
         * @param {Object} alternates The set of mappings of the form
         * className : [values...]
         */
        addNameAlternateMappings: function(alternates) {
            var alternateToName = this.maps.alternateToName,
                nameToAlternates = this.maps.nameToAlternates,
                className, aliasList, alternate, i;

            for (className in alternates) {
                aliasList = nameToAlternates[className] ||
                    (nameToAlternates[className] = []);

                for (i  = 0; i < alternates[className].length; i++) {
                    alternate = alternates[className];
                    if (!alternateToName[alternate]) {
                        alternateToName[alternate] = className;
                        aliasList.push(alternate);
                    }
                }

            }
            return this;
        },

        /**
         * Get a reference to the class by its alias.
         *
         * @param {String} alias
         * @return {Ext.Class} class
         */
        getByAlias: function(alias) {
            return this.get(this.getNameByAlias(alias));
        },

        /**
         * Get the name of a class by its alias.
         *
         * @param {String} alias
         * @return {String} className
         */
        getNameByAlias: function(alias) {
            return this.maps.aliasToName[alias] || '';
        },

        /**
         * Get the name of a class by its alternate name.
         *
         * @param {String} alternate
         * @return {String} className
         */
        getNameByAlternate: function(alternate) {
            return this.maps.alternateToName[alternate] || '';
        },

        /**
         * Get the aliases of a class by the class name
         *
         * @param {String} name
         * @return {Array} aliases
         */
        getAliasesByName: function(name) {
            return this.maps.nameToAliases[name] || [];
        },

        /**
         * Get the name of the class by its reference or its instance;
         * usually invoked by the shorthand {@link Ext#getClassName Ext.getClassName}
         *
         *     Ext.ClassManager.getName(Ext.Action); // returns "Ext.Action"
         *
         * @param {Ext.Class/Object} object
         * @return {String} className
         */
        getName: function(object) {
            return object && object.$className || '';
        },

        /**
         * Get the class of the provided object; returns null if it's not an instance
         * of any class created with Ext.define. This is usually invoked by the shorthand {@link Ext#getClass Ext.getClass}.
         *
         *     var component = new Ext.Component();
         *
         *     Ext.ClassManager.getClass(component); // returns Ext.Component
         *
         * @param {Object} object
         * @return {Ext.Class} class
         */
        getClass: function(object) {
            return object && object.self || null;
        },

        /**
         * @private
         */
        create: function(className, data, createdFn) {
            //<debug error>
            if (typeof className != 'string') {
                throw new Error("[Ext.define] Invalid class name '" + className + "' specified, must be a non-empty string");
            }
            //</debug>

            data.$className = className;

            return new Class(data, function() {
                var postprocessorStack = data.postprocessors || Manager.defaultPostprocessors,
                    registeredPostprocessors = Manager.postprocessors,
                    index = 0,
                    postprocessors = [],
                    postprocessor, process, i, ln, j, subLn, postprocessorProperties, postprocessorProperty;

                delete data.postprocessors;

                for (i = 0,ln = postprocessorStack.length; i < ln; i++) {
                    postprocessor = postprocessorStack[i];

                    if (typeof postprocessor == 'string') {
                        postprocessor = registeredPostprocessors[postprocessor];
                        postprocessorProperties = postprocessor.properties;

                        if (postprocessorProperties === true) {
                            postprocessors.push(postprocessor.fn);
                        }
                        else if (postprocessorProperties) {
                            for (j = 0,subLn = postprocessorProperties.length; j < subLn; j++) {
                                postprocessorProperty = postprocessorProperties[j];

                                if (data.hasOwnProperty(postprocessorProperty)) {
                                    postprocessors.push(postprocessor.fn);
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        postprocessors.push(postprocessor);
                    }
                }

                process = function(clsName, cls, clsData) {
                    postprocessor = postprocessors[index++];

                    if (!postprocessor) {
                        Manager.set(className, cls);

                        if (createdFn) {
                            createdFn.call(cls, cls);
                        }

                        Manager.triggerCreated(className);
                        return;
                    }

                    if (postprocessor.call(this, clsName, cls, clsData, process) !== false) {
                        process.apply(this, arguments);
                    }
                };

                process.call(Manager, className, this, data);
            });
        },

        createOverride: function(className, data) {
            var overriddenClassName = data.override,
                requires = Ext.Array.from(data.requires);

            delete data.override;
            delete data.requires;

            this.existCache[className] = true;

            Ext.require(requires, function() {
                // Override the target class right after it's created
                this.onCreated(function() {
                    this.get(overriddenClassName).override(data);

                    // This push the overridding file itself into Ext.Loader.history
                    // Hence if the target class never exists, the overriding file will
                    // never be included in the build
                    this.triggerCreated(className);
                }, this, overriddenClassName);
            }, this);

            return this;
        },

        /**
         * Instantiate a class by its alias; usually invoked by the convenient shorthand {@link Ext#createByAlias Ext.createByAlias}
         * If {@link Ext.Loader} is {@link Ext.Loader#setConfig enabled} and the class has not been defined yet, it will
         * attempt to load the class via synchronous loading.
         *
         *     var window = Ext.ClassManager.instantiateByAlias('widget.window', { width: 600, height: 800 });
         *
         * @param {String} alias
         * @param {Mixed...} args Additional arguments after the alias will be passed to the class constructor.
         * @return {Object} instance
         */
        instantiateByAlias: function() {
            var alias = arguments[0],
                args = arraySlice.call(arguments),
                className = this.getNameByAlias(alias);

            if (!className) {
                className = this.maps.aliasToName[alias];

                //<debug error>
                if (!className) {
                    throw new Error("[Ext.createByAlias] Cannot create an instance of unrecognized alias: " + alias);
                }
                //</debug>

                //<debug warn>
                Ext.Logger.warn("[Ext.Loader] Synchronously loading '" + className + "'; consider adding " +
                     "Ext.require('" + alias + "') above Ext.onReady");
                //</debug>

                Ext.syncRequire(className);
            }

            args[0] = className;

            return this.instantiate.apply(this, args);
        },

        /**
         * Instantiate a class by either full name, alias or alternate name; usually invoked by the convenient
         * shorthand {@link Ext.ClassManager#create Ext.create}.
         *
         * If {@link Ext.Loader} is {@link Ext.Loader#setConfig enabled} and the class has not been defined yet, it will
         * attempt to load the class via synchronous loading.
         *
         * For example, all these three lines return the same result:
         *
         *     // alias
         *     var formPanel = Ext.create('widget.formpanel', { width: 600, height: 800 });
         *
         *     // alternate name
         *     var formPanel = Ext.create('Ext.form.FormPanel', { width: 600, height: 800 });
         *
         *     // full class name
         *     var formPanel = Ext.create('Ext.form.Panel', { width: 600, height: 800 });
         *
         * @param {String} name
         * @param {Mixed} args Additional arguments after the name will be passed to the class' constructor.
         * @return {Object} instance
         */
        instantiate: function() {
            var name = arguments[0],
                args = arraySlice.call(arguments, 1),
                alias = name,
                possibleName, cls;

            if (typeof name != 'function') {
                //<debug error>
                if ((typeof name != 'string' || name.length < 1)) {
                    throw new Error("[Ext.create] Invalid class name or alias '" + name + "' specified, must be a non-empty string");
                }
                //</debug>

                cls = this.get(name);
            }
            else {
                cls = name;
            }

            // No record of this class name, it's possibly an alias, so look it up
            if (!cls) {
                possibleName = this.getNameByAlias(name);

                if (possibleName) {
                    name = possibleName;

                    cls = this.get(name);
                }
            }

            // Still no record of this class name, it's possibly an alternate name, so look it up
            if (!cls) {
                possibleName = this.getNameByAlternate(name);

                if (possibleName) {
                    name = possibleName;

                    cls = this.get(name);
                }
            }

            // Still not existing at this point, try to load it via synchronous mode as the last resort
            if (!cls) {
                //<debug warn>
                Ext.Logger.warn("[Ext.Loader] Synchronously loading '" + name + "'; consider adding '" +
                    ((possibleName) ? alias : name) + "' explicitly as a require of the corresponding class");
                //</debug>

                Ext.syncRequire(name);

                cls = this.get(name);
            }

            //<debug error>
            if (!cls) {
                throw new Error("[Ext.create] Cannot create an instance of unrecognized class name / alias: " + alias);
            }

            if (typeof cls != 'function') {
                throw new Error("[Ext.create] '" + name + "' is a singleton and cannot be instantiated");
            }
            //</debug>

            return this.getInstantiator(args.length)(cls, args);
        },

        /**
         * @private
         * @param name
         * @param args
         */
        dynInstantiate: function(name, args) {
            args = arrayFrom(args, true);
            args.unshift(name);

            return this.instantiate.apply(this, args);
        },

        /**
         * @private
         * @param length
         */
        getInstantiator: function(length) {
            var instantiators = this.instantiators,
                instantiator;

            instantiator = instantiators[length];

            if (!instantiator) {
                var i = length,
                    args = [];

                for (i = 0; i < length; i++) {
                    args.push('a[' + i + ']');
                }

                instantiator = instantiators[length] = new Function('c', 'a', 'return new c(' + args.join(',') + ')');
                //<debug>
                instantiator.displayName = "Ext.ClassManager.instantiate" + length;
                //</debug>
            }

            return instantiator;
        },

        /**
         * @private
         */
        postprocessors: {},

        /**
         * @private
         */
        defaultPostprocessors: [],

        /**
         * Register a post-processor function.
         *
         * @private
         * @param {String} name
         * @param {Function} postprocessor
         */
        registerPostprocessor: function(name, fn, properties, position, relativeTo) {
            if (!position) {
                position = 'last';
            }

            if (!properties) {
                properties = [name];
            }

            this.postprocessors[name] = {
                name: name,
                properties: properties || false,
                fn: fn
            };

            this.setDefaultPostprocessorPosition(name, position, relativeTo);

            return this;
        },

        /**
         * Set the default post processors array stack which are applied to every class.
         *
         * @private
         * @param {String/Array} The name of a registered post processor or an array of registered names.
         * @return {Ext.ClassManager} this
         */
        setDefaultPostprocessors: function(postprocessors) {
            this.defaultPostprocessors = arrayFrom(postprocessors);

            return this;
        },

        /**
         * Insert this post-processor at a specific position in the stack, optionally relative to
         * any existing post-processor
         *
         * @private
         * @param {String} name The post-processor name. Note that it needs to be registered with
         * {@link Ext.ClassManager#registerPostprocessor} before this
         * @param {String} offset The insertion position. Four possible values are:
         * 'first', 'last', or: 'before', 'after' (relative to the name provided in the third argument)
         * @param {String} relativeName
         * @return {Ext.ClassManager} this
         */
        setDefaultPostprocessorPosition: function(name, offset, relativeName) {
            var defaultPostprocessors = this.defaultPostprocessors,
                index;

            if (typeof offset == 'string') {
                if (offset === 'first') {
                    defaultPostprocessors.unshift(name);

                    return this;
                }
                else if (offset === 'last') {
                    defaultPostprocessors.push(name);

                    return this;
                }

                offset = (offset === 'after') ? 1 : -1;
            }

            index = Ext.Array.indexOf(defaultPostprocessors, relativeName);

            if (index !== -1) {
                Ext.Array.splice(defaultPostprocessors, Math.max(0, index + offset), 0, name);
            }

            return this;
        },

        /**
         * Converts a string expression to an array of matching class names. An expression can either refers to class aliases
         * or class names. Expressions support wildcards:
         *
         *      // returns ['Ext.window.Window']
         *     var window = Ext.ClassManager.getNamesByExpression('widget.window');
         *
         *     // returns ['widget.panel', 'widget.window', ...]
         *     var allWidgets = Ext.ClassManager.getNamesByExpression('widget.*');
         *
         *     // returns ['Ext.data.Store', 'Ext.data.ArrayProxy', ...]
         *     var allData = Ext.ClassManager.getNamesByExpression('Ext.data.*');
         *
         * @param {String} expression
         * @return {Array} classNames
         */
        getNamesByExpression: function(expression) {
            var nameToAliasesMap = this.maps.nameToAliases,
                names = [],
                name, alias, aliases, possibleName, regex, i, ln;

            //<debug error>
            if (typeof expression != 'string' || expression.length < 1) {
                throw new Error("[Ext.ClassManager.getNamesByExpression] Expression " + expression + " is invalid, must be a non-empty string");
            }
            //</debug>

            if (expression.indexOf('*') !== -1) {
                expression = expression.replace(/\*/g, '(.*?)');
                regex = new RegExp('^' + expression + '$');

                for (name in nameToAliasesMap) {
                    if (nameToAliasesMap.hasOwnProperty(name)) {
                        aliases = nameToAliasesMap[name];

                        if (name.search(regex) !== -1) {
                            names.push(name);
                        }
                        else {
                            for (i = 0, ln = aliases.length; i < ln; i++) {
                                alias = aliases[i];

                                if (alias.search(regex) !== -1) {
                                    names.push(name);
                                    break;
                                }
                            }
                        }
                    }
                }

            } else {
                possibleName = this.getNameByAlias(expression);

                if (possibleName) {
                    names.push(possibleName);
                } else {
                    possibleName = this.getNameByAlternate(expression);

                    if (possibleName) {
                        names.push(possibleName);
                    } else {
                        names.push(expression);
                    }
                }
            }

            return names;
        }
    };

    //<feature classSystem.alias>
    /**
     * @cfg {String[]} alias
     * @member Ext.Class
     * List of short aliases for class names.  Most useful for defining xtypes for widgets:
     *
     *     Ext.define('MyApp.CoolPanel', {
     *         extend: 'Ext.panel.Panel',
     *         alias: ['widget.coolpanel'],
     *         title: 'Yeah!'
     *     });
     *
     *     // Using Ext.create
     *     Ext.create('widget.coolpanel');
     *
     *     // Using the shorthand for widgets and in xtypes
     *     Ext.widget('panel', {
     *         items: [
     *             {xtype: 'coolpanel', html: 'Foo'},
     *             {xtype: 'coolpanel', html: 'Bar'}
     *         ]
     *     });
     */
    Manager.registerPostprocessor('alias', function(name, cls, data) {
        var aliases = data.alias,
            i, ln;

        for (i = 0,ln = aliases.length; i < ln; i++) {
            alias = aliases[i];

            this.setAlias(cls, alias);
        }

    }, ['xtype', 'alias']);
    //</feature>

    //<feature classSystem.singleton>
    /**
     * @cfg {Boolean} singleton
     * @member Ext.Class
     * When set to true, the class will be instantiated as singleton.  For example:
     *
     *     Ext.define('Logger', {
     *         singleton: true,
     *         log: function(msg) {
     *             console.log(msg);
     *         }
     *     });
     *
     *     Logger.log('Hello');
     */
    Manager.registerPostprocessor('singleton', function(name, cls, data, fn) {
        fn.call(this, name, new cls(), data);
        return false;
    });
    //</feature>

    //<feature classSystem.alternateClassName>
    /**
     * @cfg {String/String[]} alternateClassName
     * @member Ext.Class
     * Defines alternate names for this class.  For example:
     *
     *     @example
     *     Ext.define('Developer', {
     *         alternateClassName: ['Coder', 'Hacker'],
     *         code: function(msg) {
     *             alert('Typing... ' + msg);
     *         }
     *     });
     *
     *     var joe = Ext.create('Developer');
     *     joe.code('stackoverflow');
     *
     *     var rms = Ext.create('Hacker');
     *     rms.code('hack hack');
     */
    Manager.registerPostprocessor('alternateClassName', function(name, cls, data) {
        var alternates = data.alternateClassName,
            i, ln, alternate;

        if (!(alternates instanceof Array)) {
            alternates = [alternates];
        }

        for (i = 0, ln = alternates.length; i < ln; i++) {
            alternate = alternates[i];

            //<debug error>
            if (typeof alternate != 'string') {
                throw new Error("[Ext.define] Invalid alternate of: '" + alternate + "' for class: '" + name + "'; must be a valid string");
            }
            //</debug>

            this.set(alternate, cls);
        }
    });
    //</feature>

    Ext.apply(Ext, {
        /**
         * Instantiate a class by either full name, alias or alternate name.
         *
         * If {@link Ext.Loader} is {@link Ext.Loader#setConfig enabled} and the class has not been defined yet, it will
         * attempt to load the class via synchronous loading.
         *
         * For example, all these three lines return the same result:
         *
         *     // alias
         *     var formPanel = Ext.create('widget.formpanel', { width: 600, height: 800 });
         *
         *     // alternate name
         *     var formPanel = Ext.create('Ext.form.FormPanel', { width: 600, height: 800 });
         *
         *     // full class name
         *     var formPanel = Ext.create('Ext.form.Panel', { width: 600, height: 800 });
         *
         * @param {String} name
         * @param {Mixed} args Additional arguments after the name will be passed to the class' constructor.
         * @return {Object} instance
         * @member Ext
         */
        create: alias(Manager, 'instantiate'),

        /**
         * Convenient shorthand to create a widget by its xtype, also see {@link Ext.ClassManager#instantiateByAlias}
         *
         *     var button = Ext.widget('button'); // Equivalent to Ext.create('widget.button')
         *     var panel = Ext.widget('panel'); // Equivalent to Ext.create('widget.panel')
         *
         * @member Ext
         * @method widget
         */
        widget: function(name) {
            var args = arraySlice.call(arguments);
            args[0] = 'widget.' + name;

            return Manager.instantiateByAlias.apply(Manager, args);
        },

        /**
         * Convenient shorthand, see {@link Ext.ClassManager#instantiateByAlias}.
         * @member Ext
         * @method createByAlias
         */
        createByAlias: alias(Manager, 'instantiateByAlias'),

        /**
         * Defines a class or override. A basic class is defined like this:
         *
         *      Ext.define('My.awesome.Class', {
         *          someProperty: 'something',
         *
         *          someMethod: function(s) {
         *              console.log(s + this.someProperty);
         *          }
         *      });
         *
         *      var obj = new My.awesome.Class();
         *
         *      obj.someMethod('Say '); // logs 'Say something' to the console
         *
         * To defines an override, include the `override` property. The content of an
         * override is aggregated with the specified class in order to extend or modify
         * that class. This can be as simple as setting default property values or it can
         * extend and/or replace methods. This can also extend the statics of the class.
         *
         * One use for an override is to break a large class into manageable pieces.
         *
         *      // File: /src/app/Panel.js
         *      Ext.define('My.app.Panel', {
         *          extend: 'Ext.panel.Panel',
         *          requires: [
         *              'My.app.PanelPart2',
         *              'My.app.PanelPart3'
         *          ],
         *
         *          constructor: function (config) {
         *              this.callParent(arguments); // calls Ext.panel.Panel's constructor
         *              // ...
         *          },
         *
         *          statics: {
         *              method: function () {
         *                  return 'abc';
         *              }
         *          }
         *      });
         *
         *      // File: /src/app/PanelPart2.js
         *      Ext.define('My.app.PanelPart2', {
         *          override: 'My.app.Panel',
         *
         *          constructor: function (config) {
         *              this.callParent(arguments); // calls My.app.Panel's constructor
         *              // ...
         *          }
         *      });
         *
         * Another use for an override is to provide optional parts of classes that can be
         * independently required. In this case, the class may even be unaware of the
         * override altogether.
         *
         *      Ext.define('My.ux.CoolTip', {
         *          override: 'Ext.tip.ToolTip',
         *
         *          constructor: function (config) {
         *              this.callParent(arguments); // calls Ext.tip.ToolTip's constructor
         *              // ...
         *          }
         *      });
         *
         * The above override can now be required as normal.
         *
         *      Ext.define('My.app.App', {
         *          requires: [
         *              'My.ux.CoolTip'
         *          ]
         *      });
         *
         * Overrides can also contain statics:
         *
         *      Ext.define('My.app.BarMod', {
         *          override: 'Ext.foo.Bar',
         *
         *          statics: {
         *              method: function (x) {
         *                  return this.callParent([x * 2]); // call Ext.foo.Bar.method
         *              }
         *          }
         *      });
         *
         * __IMPORTANT:__ An override is only included in a build if the class it overrides is
         * required. Otherwise, the override, like the target class, is not included.
         *
         * @param {String} className The class name to create in string dot-namespaced format, for example:
         * 'My.very.awesome.Class', 'FeedViewer.plugin.CoolPager'
         *
         * It is highly recommended to follow this simple convention:
         *  - The root and the class name are 'CamelCased'
         *  - Everything else is lower-cased
         *
         * @param {Object} data The key - value pairs of properties to apply to this class. Property names can be of
         * any valid strings, except those in the reserved listed below:
         *
         *  - `mixins`
         *  - `statics`
         *  - `config`
         *  - `alias`
         *  - `self`
         *  - `singleton`
         *  - `alternateClassName`
         *  - `override`
         *
         * @param {Function} [createdFn] Optional callback to execute after the class (or override)
         * is created. The execution scope (`this`) will be the newly created class itself.
         * @return {Ext.Base}
         *
         * @member Ext
         * @method define
         */
        define: function (className, data, createdFn) {
            if ('override' in data) {
                return Manager.createOverride.apply(Manager, arguments);
            }

            return Manager.create.apply(Manager, arguments);
        },

        /**
         * Convenient shorthand for {@link Ext.ClassManager#getName}.
         * @member Ext
         * @method getClassName
         * @inheritdoc Ext.ClassManager#getName
         */
        getClassName: alias(Manager, 'getName'),

        /**
         * Returns the display name for object.  This name is looked for in order from the following places:
         *
         * - `displayName` field of the object.
         * - `$name` and `$class` fields of the object.
         * - '$className` field of the object.
         *
         * This method is used by {@link Ext.Logger#log} to display information about objects.
         *
         * @param {Mixed} [object] The object who's display name to determine.
         * @return {String} The determined display name, or "Anonymous" if none found.
         * @member Ext
         */
        getDisplayName: function(object) {
            if (object) {
                if (object.displayName) {
                    return object.displayName;
                }

                if (object.$name && object.$class) {
                    return Ext.getClassName(object.$class) + '#' + object.$name;
                }

                if (object.$className) {
                    return object.$className;
                }
            }

            return 'Anonymous';
        },

        /**
         * Convenient shorthand, see {@link Ext.ClassManager#getClass}.
         * @member Ext
         * @method getClass
         */
        getClass: alias(Manager, 'getClass'),

        /**
         * Creates namespaces to be used for scoping variables and classes so that they are not global.
         * Specifying the last node of a namespace implicitly creates all other nodes. Usage:
         *
         *     Ext.namespace('Company', 'Company.data');
         *
         *      // equivalent and preferable to the above syntax
         *     Ext.namespace('Company.data');
         *
         *     Company.Widget = function() {
         *         // ...
         *     };
         *
         *     Company.data.CustomStore = function(config) {
         *         // ...
         *     };
         *
         * @param {String} namespace1
         * @param {String} namespace2
         * @param {String} etc
         * @return {Object} The namespace object. If multiple arguments are passed, this will be the last namespace created.
         * @member Ext
         * @method namespace
         */
        namespace: alias(Manager, 'createNamespaces')
    });

    /**
     * Old name for {@link Ext#widget}.
     * @deprecated 4.0.0 Please use {@link Ext#widget} instead.
     * @method createWidget
     * @member Ext
     */
    Ext.createWidget = Ext.widget;

    /**
     * Convenient alias for {@link Ext#namespace Ext.namespace}.
     * @member Ext
     * @method ns
     */
    Ext.ns = Ext.namespace;

    Class.registerPreprocessor('className', function(cls, data) {
        if (data.$className) {
            cls.$className = data.$className;
            //<debug>
            cls.displayName = cls.$className;
            //</debug>
        }
    }, true, 'first');

    Class.registerPreprocessor('alias', function(cls, data) {
        var prototype = cls.prototype,
            xtypes = arrayFrom(data.xtype),
            aliases = arrayFrom(data.alias),
            widgetPrefix = 'widget.',
            widgetPrefixLength = widgetPrefix.length,
            xtypesChain = Array.prototype.slice.call(prototype.xtypesChain || []),
            xtypesMap = Ext.merge({}, prototype.xtypesMap || {}),
            i, ln, alias, xtype;

        for (i = 0,ln = aliases.length; i < ln; i++) {
            alias = aliases[i];

            //<debug error>
            if (typeof alias != 'string' || alias.length < 1) {
                throw new Error("[Ext.define] Invalid alias of: '" + alias + "' for class: '" + name + "'; must be a valid string");
            }
            //</debug>

            if (alias.substring(0, widgetPrefixLength) === widgetPrefix) {
                xtype = alias.substring(widgetPrefixLength);
                Ext.Array.include(xtypes, xtype);
            }
        }

        cls.xtype = data.xtype = xtypes[0];
        data.xtypes = xtypes;

        for (i = 0,ln = xtypes.length; i < ln; i++) {
            xtype = xtypes[i];

            if (!xtypesMap[xtype]) {
                xtypesMap[xtype] = true;
                xtypesChain.push(xtype);
            }
        }

        data.xtypesChain = xtypesChain;
        data.xtypesMap = xtypesMap;

        Ext.Function.interceptAfter(data, 'onClassCreated', function() {
            var mixins = prototype.mixins,
                key, mixin;

            for (key in mixins) {
                if (mixins.hasOwnProperty(key)) {
                    mixin = mixins[key];

                    xtypes = mixin.xtypes;

                    if (xtypes) {
                        for (i = 0,ln = xtypes.length; i < ln; i++) {
                            xtype = xtypes[i];

                            if (!xtypesMap[xtype]) {
                                xtypesMap[xtype] = true;
                                xtypesChain.push(xtype);
                            }
                        }
                    }
                }
            }
        });

        for (i = 0,ln = xtypes.length; i < ln; i++) {
            xtype = xtypes[i];

            //<debug error>
            if (typeof xtype != 'string' || xtype.length < 1) {
                throw new Error("[Ext.define] Invalid xtype of: '" + xtype + "' for class: '" + name + "'; must be a valid non-empty string");
            }
            //</debug>

            Ext.Array.include(aliases, widgetPrefix + xtype);
        }

        data.alias = aliases;

    }, ['xtype', 'alias']);

})(Ext.Class, Ext.Function.alias, Array.prototype.slice, Ext.Array.from, Ext.global);

//@tag foundation,core
//@define Ext.Loader
//@require Ext.ClassManager

/**
 * @class Ext.Loader
 *
 * @author Jacky Nguyen <jacky@sencha.com>
 * @docauthor Jacky Nguyen <jacky@sencha.com>
 * @aside guide mvc_dependencies
 *
 * Ext.Loader is the heart of the new dynamic dependency loading capability in Ext JS 4+. It is most commonly used
 * via the {@link Ext#require} shorthand. Ext.Loader supports both asynchronous and synchronous loading
 * approaches, and leverage their advantages for the best development flow.
 * We'll discuss about the pros and cons of each approach.
 *
 * __Note:__ The Loader is only enabled by default in development versions of the library (eg sencha-touch-debug.js). To
 * explicitly enable the loader, use `Ext.Loader.setConfig({ enabled: true });` before the start of your script.
 *
 * ## Asynchronous Loading
 *
 * - Advantages:
 * 	+ Cross-domain
 * 	+ No web server needed: you can run the application via the file system protocol (i.e: `file://path/to/your/index
 *  .html`)
 * 	+ Best possible debugging experience: error messages come with the exact file name and line number
 *
 * - Disadvantages:
 * 	+ Dependencies need to be specified before-hand
 *
 * ### Method 1: Explicitly include what you need: ###
 *
 *     // Syntax
 *     // Ext.require({String/Array} expressions);
 *
 *     // Example: Single alias
 *     Ext.require('widget.window');
 *
 *     // Example: Single class name
 *     Ext.require('Ext.window.Window');
 *
 *     // Example: Multiple aliases / class names mix
 *     Ext.require(['widget.window', 'layout.border', 'Ext.data.Connection']);
 *
 *     // Wildcards
 *     Ext.require(['widget.*', 'layout.*', 'Ext.data.*']);
 *
 * ### Method 2: Explicitly exclude what you don't need: ###
 *
 *     // Syntax: Note that it must be in this chaining format.
 *     // Ext.exclude({String/Array} expressions)
 *     //    .require({String/Array} expressions);
 *
 *     // Include everything except Ext.data.*
 *     Ext.exclude('Ext.data.*').require('*');
 *
 *     // Include all widgets except widget.checkbox*,
 *     // which will match widget.checkbox, widget.checkboxfield, widget.checkboxgroup, etc.
 *     Ext.exclude('widget.checkbox*').require('widget.*');
 *
 * # Synchronous Loading on Demand #
 *
 * - *Advantages:*
 * 	+ There's no need to specify dependencies before-hand, which is always the convenience of including ext-all.js
 *  before
 *
 * - *Disadvantages:*
 * 	+ Not as good debugging experience since file name won't be shown (except in Firebug at the moment)
 * 	+ Must be from the same domain due to XHR restriction
 * 	+ Need a web server, same reason as above
 *
 * There's one simple rule to follow: Instantiate everything with Ext.create instead of the `new` keyword
 *
 *     Ext.create('widget.window', {}); // Instead of new Ext.window.Window({...});
 *
 *     Ext.create('Ext.window.Window', {}); // Same as above, using full class name instead of alias
 *
 *     Ext.widget('window', {}); // Same as above, all you need is the traditional `xtype`
 *
 * Behind the scene, {@link Ext.ClassManager} will automatically check whether the given class name / alias has already
 *  existed on the page. If it's not, Ext.Loader will immediately switch itself to synchronous mode and automatic load the given
 *  class and all its dependencies.
 *
 * # Hybrid Loading - The Best of Both Worlds #
 *
 * It has all the advantages combined from asynchronous and synchronous loading. The development flow is simple:
 *
 * ### Step 1: Start writing your application using synchronous approach. ###
 * Ext.Loader will automatically fetch all dependencies on demand as they're 
 * needed during run-time. For example:
 *
 *     Ext.onReady(function(){
 *         var window = Ext.createWidget('window', {
 *             width: 500,
 *             height: 300,
 *             layout: {
 *                 type: 'border',
 *                 padding: 5
 *             },
 *             title: 'Hello Dialog',
 *             items: [{
 *                 title: 'Navigation',
 *                 collapsible: true,
 *                 region: 'west',
 *                 width: 200,
 *                 html: 'Hello',
 *                 split: true
 *             }, {
 *                 title: 'TabPanel',
 *                 region: 'center'
 *             }]
 *         });
 *
 *         window.show();
 *     });
 *
 * ### Step 2: Along the way, when you need better debugging ability, watch the console for warnings like these: ###
 *
 *     [Ext.Loader] Synchronously loading 'Ext.window.Window'; consider adding Ext.require('Ext.window.Window') before your application's code
 *     ClassManager.js:432
 *     [Ext.Loader] Synchronously loading 'Ext.layout.container.Border'; consider adding Ext.require('Ext.layout.container.Border') before your application's code
 *
 * Simply copy and paste the suggested code above `Ext.onReady`, i.e:
 *
 *     Ext.require('Ext.window.Window');
 *     Ext.require('Ext.layout.container.Border');
 *
 *     Ext.onReady(function () {
 *         // ...
 *     });
 *
 * Everything should now load via asynchronous mode.
 *
 * # Deployment #
 *
 * It's important to note that dynamic loading should only be used during development on your local machines.
 * During production, all dependencies should be combined into one single JavaScript file. Ext.Loader makes
 * the whole process of transitioning from / to between development / maintenance and production as easy as
 * possible. Internally {@link Ext.Loader#history Ext.Loader.history} maintains the list of all dependencies your application
 * needs in the exact loading sequence. It's as simple as concatenating all files in this array into one,
 * then include it on top of your application.
 *
 * This process will be automated with Sencha Command, to be released and documented towards Ext JS 4 Final.
 *
 * @singleton
 */
(function(Manager, Class, flexSetter, alias, pass, arrayFrom, arrayErase, arrayInclude) {

    var
        dependencyProperties = ['extend', 'mixins', 'requires'],
        Loader,
        setPathCount = 0;;

    Loader = Ext.Loader = {

        /**
         * @private
         */
        isInHistory: {},

        /**
         * An array of class names to keep track of the dependency loading order.
         * This is not guaranteed to be the same every time due to the asynchronous
         * nature of the Loader.
         *
         * @property history
         * @type Array
         */
        history: [],

        /**
         * Configuration
         * @private
         */
        config: {
            /**
             * Whether or not to enable the dynamic dependency loading feature.
             * @cfg {Boolean} enabled
             */
            enabled: true,

            /**
             * @cfg {Boolean} disableCaching
             * Appends current timestamp to script files to prevent caching.
             */
            disableCaching: true,

            /**
             * @cfg {String} disableCachingParam
             * The get parameter name for the cache buster's timestamp.
             */
            disableCachingParam: '_dc',

            /**
             * @cfg {Object} paths
             * The mapping from namespaces to file paths.
             *
             *     {
             *         'Ext': '.', // This is set by default, Ext.layout.container.Container will be
             *                     // loaded from ./layout/Container.js
             *
             *         'My': './src/my_own_folder' // My.layout.Container will be loaded from
             *                                     // ./src/my_own_folder/layout/Container.js
             *     }
             *
             * Note that all relative paths are relative to the current HTML document.
             * If not being specified, for example, `Other.awesome.Class`
             * will simply be loaded from `./Other/awesome/Class.js`.
             */
            paths: {
                'Ext': '.'
            }
        },

        /**
         * Set the configuration for the loader. This should be called right after ext-(debug).js
         * is included in the page, and before Ext.onReady. i.e:
         *
         *     <script type="text/javascript" src="ext-core-debug.js"></script>
         *     <script type="text/javascript">
         *         Ext.Loader.setConfig({
         *           enabled: true,
         *           paths: {
         *               'My': 'my_own_path'
         *           }
         *         });
         *     <script>
         *     <script type="text/javascript">
         *         Ext.require(...);
         *
         *         Ext.onReady(function() {
         *           // application code here
         *         });
         *     </script>
         *
         * Refer to config options of {@link Ext.Loader} for the list of possible properties.
         *
         * @param {Object} config The config object to override the default values.
         * @return {Ext.Loader} this
         */
        setConfig: function(name, value) {
            if (Ext.isObject(name) && arguments.length === 1) {
                Ext.merge(this.config, name);
            }
            else {
                this.config[name] = (Ext.isObject(value)) ? Ext.merge(this.config[name], value) : value;
            }
            setPathCount += 1;
            return this;
        },

        /**
         * Get the config value corresponding to the specified name. If no name is given, will return the config object.
         * @param {String} name The config property name.
         * @return {Object/Mixed}
         */
        getConfig: function(name) {
            if (name) {
                return this.config[name];
            }

            return this.config;
        },

        /**
         * Sets the path of a namespace.
         * For example:
         *
         *     Ext.Loader.setPath('Ext', '.');
         *
         * @param {String/Object} name See {@link Ext.Function#flexSetter flexSetter}
         * @param {String} [path] See {@link Ext.Function#flexSetter flexSetter}
         * @return {Ext.Loader} this
         * @method
         */
        setPath: flexSetter(function(name, path) {
            this.config.paths[name] = path;
            setPathCount += 1;
            return this;
        }),

        /**
         * Sets a batch of path entries
         *
         * @param {Object } paths a set of className: path mappings
         * @return {Ext.Loader} this
         */
        addClassPathMappings: function(paths) {
            var name;

            if(setPathCount == 0){
                Loader.config.paths = paths;
            } else {
                for(name in paths){
                    Loader.config.paths[name] = paths[name];
                }
            }
            setPathCount++;
            return Loader;
        },

        /**
         * Translates a className to a file path by adding the
         * the proper prefix and converting the .'s to /'s. For example:
         *
         *     Ext.Loader.setPath('My', '/path/to/My');
         *
         *     alert(Ext.Loader.getPath('My.awesome.Class')); // alerts '/path/to/My/awesome/Class.js'
         *
         * Note that the deeper namespace levels, if explicitly set, are always resolved first. For example:
         *
         *     Ext.Loader.setPath({
         *         'My': '/path/to/lib',
         *         'My.awesome': '/other/path/for/awesome/stuff',
         *         'My.awesome.more': '/more/awesome/path'
         *     });
         *
         *     alert(Ext.Loader.getPath('My.awesome.Class')); // alerts '/other/path/for/awesome/stuff/Class.js'
         *
         *     alert(Ext.Loader.getPath('My.awesome.more.Class')); // alerts '/more/awesome/path/Class.js'
         *
         *     alert(Ext.Loader.getPath('My.cool.Class')); // alerts '/path/to/lib/cool/Class.js'
         *
         *     alert(Ext.Loader.getPath('Unknown.strange.Stuff')); // alerts 'Unknown/strange/Stuff.js'
         *
         * @param {String} className
         * @return {String} path
         */
        getPath: function(className) {
            var path = '',
                paths = this.config.paths,
                prefix = this.getPrefix(className);

            if (prefix.length > 0) {
                if (prefix === className) {
                    return paths[prefix];
                }

                path = paths[prefix];
                className = className.substring(prefix.length + 1);
            }

            if (path.length > 0) {
                path += '/';
            }

            return path.replace(/\/\.\//g, '/') + className.replace(/\./g, "/") + '.js';
        },

        /**
         * @private
         * @param {String} className
         */
        getPrefix: function(className) {
            var paths = this.config.paths,
                prefix, deepestPrefix = '';

            if (paths.hasOwnProperty(className)) {
                return className;
            }

            for (prefix in paths) {
                if (paths.hasOwnProperty(prefix) && prefix + '.' === className.substring(0, prefix.length + 1)) {
                    if (prefix.length > deepestPrefix.length) {
                        deepestPrefix = prefix;
                    }
                }
            }

            return deepestPrefix;
        },

        /**
         * Loads all classes by the given names and all their direct dependencies; optionally executes the given callback function when
         * finishes, within the optional scope. This method is aliased by {@link Ext#require Ext.require} for convenience.
         * @param {String/Array} expressions Can either be a string or an array of string.
         * @param {Function} fn (optional) The callback function.
         * @param {Object} scope (optional) The execution scope (`this`) of the callback function.
         * @param {String/Array} excludes (optional) Classes to be excluded, useful when being used with expressions.
         */
        require: function(expressions, fn, scope, excludes) {
            if (fn) {
                fn.call(scope);
            }
        },

        /**
         * Synchronously loads all classes by the given names and all their direct dependencies; optionally executes the given callback function when finishes, within the optional scope. This method is aliased by {@link Ext#syncRequire} for convenience
         * @param {String/Array} expressions Can either be a string or an array of string
         * @param {Function} fn (optional) The callback function
         * @param {Object} scope (optional) The execution scope (`this`) of the callback function
         * @param {String/Array} excludes (optional) Classes to be excluded, useful when being used with expressions
         */
        syncRequire: function() {},

        /**
         * Explicitly exclude files from being loaded. Useful when used in conjunction with a broad include expression.
         * Can be chained with more `require` and `exclude` methods, eg:
         *
         *     Ext.exclude('Ext.data.*').require('*');
         *
         *     Ext.exclude('widget.button*').require('widget.*');
         *
         * @param {Array} excludes
         * @return {Object} object contains `require` method for chaining.
         */
        exclude: function(excludes) {
            var me = this;

            return {
                require: function(expressions, fn, scope) {
                    return me.require(expressions, fn, scope, excludes);
                },

                syncRequire: function(expressions, fn, scope) {
                    return me.syncRequire(expressions, fn, scope, excludes);
                }
            };
        },

        /**
         * Add a new listener to be executed when all required scripts are fully loaded.
         *
         * @param {Function} fn The function callback to be executed.
         * @param {Object} scope The execution scope (`this`) of the callback function.
         * @param {Boolean} withDomReady Whether or not to wait for document DOM ready as well.
         */
        onReady: function(fn, scope, withDomReady, options) {
            var oldFn;

            if (withDomReady !== false && Ext.onDocumentReady) {
                oldFn = fn;

                fn = function() {
                    Ext.onDocumentReady(oldFn, scope, options);
                };
            }

            fn.call(scope);
        }
    };

    //<feature classSystem.loader>
    Ext.apply(Loader, {
        /**
         * @private
         */
        documentHead: typeof document != 'undefined' && (document.head || document.getElementsByTagName('head')[0]),

        /**
         * Flag indicating whether there are still files being loaded
         * @private
         */
        isLoading: false,

        /**
         * Maintain the queue for all dependencies. Each item in the array is an object of the format:
         * 
         *     {
         *         requires: [...], // The required classes for this queue item
         *         callback: function() { ... } // The function to execute when all classes specified in requires exist
         *     }
         * @private
         */
        queue: [],

        /**
         * Maintain the list of files that have already been handled so that they never get double-loaded
         * @private
         */
        isClassFileLoaded: {},

        /**
         * @private
         */
        isFileLoaded: {},

        /**
         * Maintain the list of listeners to execute when all required scripts are fully loaded
         * @private
         */
        readyListeners: [],

        /**
         * Contains optional dependencies to be loaded last
         * @private
         */
        optionalRequires: [],

        /**
         * Map of fully qualified class names to an array of dependent classes.
         * @private
         */
        requiresMap: {},

        /**
         * @private
         */
        numPendingFiles: 0,

        /**
         * @private
         */
        numLoadedFiles: 0,

        /** @private */
        hasFileLoadError: false,

        /**
         * @private
         */
        classNameToFilePathMap: {},

        /**
         * @private
         */
        syncModeEnabled: false,

        scriptElements: {},

        /**
         * Refresh all items in the queue. If all dependencies for an item exist during looping,
         * it will execute the callback and call refreshQueue again. Triggers onReady when the queue is
         * empty
         * @private
         */
        refreshQueue: function() {
            var queue = this.queue,
                ln = queue.length,
                i, item, j, requires, references;

            if (ln === 0) {
                this.triggerReady();
                return;
            }

            for (i = 0; i < ln; i++) {
                item = queue[i];

                if (item) {
                    requires = item.requires;
                    references = item.references;

                    // Don't bother checking when the number of files loaded
                    // is still less than the array length
                    if (requires.length > this.numLoadedFiles) {
                        continue;
                    }

                    j = 0;

                    do {
                        if (Manager.isCreated(requires[j])) {
                            // Take out from the queue
                            arrayErase(requires, j, 1);
                        }
                        else {
                            j++;
                        }
                    } while (j < requires.length);

                    if (item.requires.length === 0) {
                        arrayErase(queue, i, 1);
                        item.callback.call(item.scope);
                        this.refreshQueue();
                        break;
                    }
                }
            }

            return this;
        },

        /**
         * Inject a script element to document's head, call onLoad and onError accordingly
         * @private
         */
        injectScriptElement: function(url, onLoad, onError, scope) {
            var script = document.createElement('script'),
                me = this,
                onLoadFn = function() {
                    me.cleanupScriptElement(script);
                    onLoad.call(scope);
                },
                onErrorFn = function() {
                    me.cleanupScriptElement(script);
                    onError.call(scope);
                };

            script.type = 'text/javascript';
            script.src = url;
            script.onload = onLoadFn;
            script.onerror = onErrorFn;
            script.onreadystatechange = function() {
                if (this.readyState === 'loaded' || this.readyState === 'complete') {
                    onLoadFn();
                }
            };

            this.documentHead.appendChild(script);

            return script;
        },

        removeScriptElement: function(url) {
            var scriptElements = this.scriptElements;

            if (scriptElements[url]) {
                this.cleanupScriptElement(scriptElements[url], true);
                delete scriptElements[url];
            }

            return this;
        },

        /**
         * @private
         */
        cleanupScriptElement: function(script, remove) {
            script.onload = null;
            script.onreadystatechange = null;
            script.onerror = null;

            if (remove) {
                this.documentHead.removeChild(script);
            }

            return this;
        },

        /**
         * Load a script file, supports both asynchronous and synchronous approaches
         *
         * @param {String} url
         * @param {Function} onLoad
         * @param {Object} scope
         * @param {Boolean} synchronous
         * @private
         */
        loadScriptFile: function(url, onLoad, onError, scope, synchronous) {
            var me = this,
                isFileLoaded = this.isFileLoaded,
                scriptElements = this.scriptElements,
                noCacheUrl = url + (this.getConfig('disableCaching') ? ('?' + this.getConfig('disableCachingParam') + '=' + Ext.Date.now()) : ''),
                xhr, status, content, onScriptError;

            if (isFileLoaded[url]) {
                return this;
            }

            scope = scope || this;

            this.isLoading = true;

            if (!synchronous) {
                onScriptError = function() {
                    //<debug error>
                    onError.call(scope, "Failed loading '" + url + "', please verify that the file exists", synchronous);
                    //</debug>
                };

                if (!Ext.isReady && Ext.onDocumentReady) {
                    Ext.onDocumentReady(function() {
                        if (!isFileLoaded[url]) {
                            scriptElements[url] = me.injectScriptElement(noCacheUrl, onLoad, onScriptError, scope);
                        }
                    });
                }
                else {
                    scriptElements[url] = this.injectScriptElement(noCacheUrl, onLoad, onScriptError, scope);
                }
            }
            else {
                if (typeof XMLHttpRequest != 'undefined') {
                    xhr = new XMLHttpRequest();
                } else {
                    xhr = new ActiveXObject('Microsoft.XMLHTTP');
                }

                try {
                    xhr.open('GET', noCacheUrl, false);
                    xhr.send(null);
                }
                catch (e) {
                    //<debug error>
                    onError.call(this, "Failed loading synchronously via XHR: '" + url + "'; It's likely that the file is either " +
                                       "being loaded from a different domain or from the local file system whereby cross origin " +
                                       "requests are not allowed due to security reasons. Use asynchronous loading with " +
                                       "Ext.require instead.", synchronous);
                    //</debug>
                }

                status = (xhr.status == 1223) ? 204 : xhr.status;
                content = xhr.responseText;

                if ((status >= 200 && status < 300) || status == 304 || (status == 0 && content.length > 0)) {
                    // Debugger friendly, file names are still shown even though they're eval'ed code
                    // Breakpoints work on both Firebug and Chrome's Web Inspector
                    Ext.globalEval(content + "\n//@ sourceURL=" + url);
                    onLoad.call(scope);
                }
                else {
                    //<debug>
                    onError.call(this, "Failed loading synchronously via XHR: '" + url + "'; please " +
                                       "verify that the file exists. " +
                                       "XHR status code: " + status, synchronous);
                    //</debug>
                }

                // Prevent potential IE memory leak
                xhr = null;
            }
        },

        // documented above
        syncRequire: function() {
            var syncModeEnabled = this.syncModeEnabled;

            if (!syncModeEnabled) {
                this.syncModeEnabled = true;
            }

            this.require.apply(this, arguments);

            if (!syncModeEnabled) {
                this.syncModeEnabled = false;
            }

            this.refreshQueue();
        },

        // documented above
        require: function(expressions, fn, scope, excludes) {
            var excluded = {},
                included = {},
                queue = this.queue,
                classNameToFilePathMap = this.classNameToFilePathMap,
                isClassFileLoaded = this.isClassFileLoaded,
                excludedClassNames = [],
                possibleClassNames = [],
                classNames = [],
                references = [],
                callback,
                syncModeEnabled,
                filePath, expression, exclude, className,
                possibleClassName, i, j, ln, subLn;

            if (excludes) {
                excludes = arrayFrom(excludes);

                for (i = 0,ln = excludes.length; i < ln; i++) {
                    exclude = excludes[i];

                    if (typeof exclude == 'string' && exclude.length > 0) {
                        excludedClassNames = Manager.getNamesByExpression(exclude);

                        for (j = 0,subLn = excludedClassNames.length; j < subLn; j++) {
                            excluded[excludedClassNames[j]] = true;
                        }
                    }
                }
            }

            expressions = arrayFrom(expressions);

            if (fn) {
                if (fn.length > 0) {
                    callback = function() {
                        var classes = [],
                            i, ln, name;

                        for (i = 0,ln = references.length; i < ln; i++) {
                            name = references[i];
                            classes.push(Manager.get(name));
                        }

                        return fn.apply(this, classes);
                    };
                }
                else {
                    callback = fn;
                }
            }
            else {
                callback = Ext.emptyFn;
            }

            scope = scope || Ext.global;

            for (i = 0,ln = expressions.length; i < ln; i++) {
                expression = expressions[i];

                if (typeof expression == 'string' && expression.length > 0) {
                    possibleClassNames = Manager.getNamesByExpression(expression);
                    subLn = possibleClassNames.length;

                    for (j = 0; j < subLn; j++) {
                        possibleClassName = possibleClassNames[j];

                        if (excluded[possibleClassName] !== true) {
                            references.push(possibleClassName);

                            if (!Manager.isCreated(possibleClassName) && !included[possibleClassName]) {
                                included[possibleClassName] = true;
                                classNames.push(possibleClassName);
                            }
                        }
                    }
                }
            }

            // If the dynamic dependency feature is not being used, throw an error
            // if the dependencies are not defined
            if (classNames.length > 0) {
                if (!this.config.enabled) {
                    throw new Error("Ext.Loader is not enabled, so dependencies cannot be resolved dynamically. " +
                             "Missing required class" + ((classNames.length > 1) ? "es" : "") + ": " + classNames.join(', '));
                }
            }
            else {
                callback.call(scope);
                return this;
            }

            syncModeEnabled = this.syncModeEnabled;

            if (!syncModeEnabled) {
                queue.push({
                    requires: classNames.slice(), // this array will be modified as the queue is processed,
                                                  // so we need a copy of it
                    callback: callback,
                    scope: scope
                });
            }

            ln = classNames.length;

            for (i = 0; i < ln; i++) {
                className = classNames[i];

                filePath = this.getPath(className);

                // If we are synchronously loading a file that has already been asynchronously loaded before
                // we need to destroy the script tag and revert the count
                // This file will then be forced loaded in synchronous
                if (syncModeEnabled && isClassFileLoaded.hasOwnProperty(className)) {
                    this.numPendingFiles--;
                    this.removeScriptElement(filePath);
                    delete isClassFileLoaded[className];
                }

                if (!isClassFileLoaded.hasOwnProperty(className)) {
                    isClassFileLoaded[className] = false;

                    classNameToFilePathMap[className] = filePath;

                    this.numPendingFiles++;

                    this.loadScriptFile(
                        filePath,
                        pass(this.onFileLoaded, [className, filePath], this),
                        pass(this.onFileLoadError, [className, filePath]),
                        this,
                        syncModeEnabled
                    );
                }
            }

            if (syncModeEnabled) {
                callback.call(scope);

                if (ln === 1) {
                    return Manager.get(className);
                }
            }

            return this;
        },

        /**
         * @private
         * @param {String} className
         * @param {String} filePath
         */
        onFileLoaded: function(className, filePath) {
            this.numLoadedFiles++;

            this.isClassFileLoaded[className] = true;
            this.isFileLoaded[filePath] = true;

            this.numPendingFiles--;

            if (this.numPendingFiles === 0) {
                this.refreshQueue();
            }

            //<debug>
            if (!this.syncModeEnabled && this.numPendingFiles === 0 && this.isLoading && !this.hasFileLoadError) {
                var queue = this.queue,
                    missingClasses = [],
                    missingPaths = [],
                    requires,
                    i, ln, j, subLn;

                for (i = 0,ln = queue.length; i < ln; i++) {
                    requires = queue[i].requires;

                    for (j = 0,subLn = requires.length; j < subLn; j++) {
                        if (this.isClassFileLoaded[requires[j]]) {
                            missingClasses.push(requires[j]);
                        }
                    }
                }

                if (missingClasses.length < 1) {
                    return;
                }

                missingClasses = Ext.Array.filter(Ext.Array.unique(missingClasses), function(item) {
                    return !this.requiresMap.hasOwnProperty(item);
                }, this);

                for (i = 0,ln = missingClasses.length; i < ln; i++) {
                    missingPaths.push(this.classNameToFilePathMap[missingClasses[i]]);
                }

                throw new Error("The following classes are not declared even if their files have been " +
                            "loaded: '" + missingClasses.join("', '") + "'. Please check the source code of their " +
                            "corresponding files for possible typos: '" + missingPaths.join("', '"));
            }
            //</debug>
        },

        /**
         * @private
         */
        onFileLoadError: function(className, filePath, errorMessage, isSynchronous) {
            this.numPendingFiles--;
            this.hasFileLoadError = true;

            //<debug error>
            throw new Error("[Ext.Loader] " + errorMessage);
            //</debug>
        },

        /**
         * @private
         */
        addOptionalRequires: function(requires) {
            var optionalRequires = this.optionalRequires,
                i, ln, require;

            requires = arrayFrom(requires);

            for (i = 0, ln = requires.length; i < ln; i++) {
                require = requires[i];

                arrayInclude(optionalRequires, require);
            }

            return this;
        },

        /**
         * @private
         */
        triggerReady: function(force) {
            var readyListeners = this.readyListeners,
                optionalRequires = this.optionalRequires,
                listener;

            if (this.isLoading || force) {
                this.isLoading = false;

                if (optionalRequires.length !== 0) {
                    // Clone then empty the array to eliminate potential recursive loop issue
                    optionalRequires = optionalRequires.slice();

                    // Empty the original array
                    this.optionalRequires.length = 0;

                    this.require(optionalRequires, pass(this.triggerReady, [true], this), this);
                    return this;
                }

                while (readyListeners.length) {
                    listener = readyListeners.shift();
                    listener.fn.call(listener.scope);

                    if (this.isLoading) {
                        return this;
                    }
                }
            }

            return this;
        },

        // duplicate definition (documented above)
        onReady: function(fn, scope, withDomReady, options) {
            var oldFn;

            if (withDomReady !== false && Ext.onDocumentReady) {
                oldFn = fn;

                fn = function() {
                    Ext.onDocumentReady(oldFn, scope, options);
                };
            }

            if (!this.isLoading) {
                fn.call(scope);
            }
            else {
                this.readyListeners.push({
                    fn: fn,
                    scope: scope
                });
            }
        },

        /**
         * @private
         * @param {String} className
         */
        historyPush: function(className) {
            var isInHistory = this.isInHistory;

            if (className && this.isClassFileLoaded.hasOwnProperty(className) && !isInHistory[className]) {
                isInHistory[className] = true;
                this.history.push(className);
            }

            return this;
        }
    });

    //</feature>

    /**
     * Convenient alias of {@link Ext.Loader#require}. Please see the introduction documentation of
     * {@link Ext.Loader} for examples.
     * @member Ext
     * @method require
     * @inheritdoc Ext.Loader#require
     */
    Ext.require = alias(Loader, 'require');

    /**
     * Synchronous version of {@link Ext#require}, convenient alias of {@link Ext.Loader#syncRequire}.
     * @member Ext
     * @method syncRequire
     * @inheritdoc Ext.Loader#syncRequire
     */
    Ext.syncRequire = alias(Loader, 'syncRequire');

    /**
     * Convenient shortcut to {@link Ext.Loader#exclude}.
     * @member Ext
     * @method exclude
     * @inheritdoc Ext.Loader#exclude
     */
    Ext.exclude = alias(Loader, 'exclude');

    /**
     * Adds a listener to be notified when the document is ready and all dependencies are loaded.
     *
     * @param {Function} fn The method the event invokes.
     * @param {Object} [scope] The scope in which the handler function executes. Defaults to the browser window.
     * @param {Boolean} [options] Options object as passed to {@link Ext.Element#addListener}. It is recommended
     * that the options `{single: true}` be used so that the handler is removed on first invocation.
     * @member Ext
     * @method onReady
     */
    Ext.onReady = function(fn, scope, options) {
        Loader.onReady(fn, scope, true, options);
    };

    Class.registerPreprocessor('loader', function(cls, data, hooks, continueFn) {
        var me = this,
            dependencies = [],
            className = Manager.getName(cls),
            i, j, ln, subLn, value, propertyName, propertyValue;

        /*
        Loop through the dependencyProperties, look for string class names and push
        them into a stack, regardless of whether the property's value is a string, array or object. For example:
        {
              extend: 'Ext.MyClass',
              requires: ['Ext.some.OtherClass'],
              mixins: {
                  observable: 'Ext.mixin.Observable';
              }
        }
        which will later be transformed into:
        {
              extend: Ext.MyClass,
              requires: [Ext.some.OtherClass],
              mixins: {
                  observable: Ext.mixin.Observable;
              }
        }
        */

        for (i = 0,ln = dependencyProperties.length; i < ln; i++) {
            propertyName = dependencyProperties[i];

            if (data.hasOwnProperty(propertyName)) {
                propertyValue = data[propertyName];

                if (typeof propertyValue == 'string') {
                    dependencies.push(propertyValue);
                }
                else if (propertyValue instanceof Array) {
                    for (j = 0, subLn = propertyValue.length; j < subLn; j++) {
                        value = propertyValue[j];

                        if (typeof value == 'string') {
                            dependencies.push(value);
                        }
                    }
                }
                else if (typeof propertyValue != 'function') {
                    for (j in propertyValue) {
                        if (propertyValue.hasOwnProperty(j)) {
                            value = propertyValue[j];

                            if (typeof value == 'string') {
                                dependencies.push(value);
                            }
                        }
                    }
                }
            }
        }

        if (dependencies.length === 0) {
            return;
        }

        //<feature classSystem.loader>
        //<debug error>
        var deadlockPath = [],
            requiresMap = Loader.requiresMap,
            detectDeadlock;

        /*
        Automatically detect deadlocks before-hand,
        will throw an error with detailed path for ease of debugging. Examples of deadlock cases:

        - A extends B, then B extends A
        - A requires B, B requires C, then C requires A

        The detectDeadlock function will recursively transverse till the leaf, hence it can detect deadlocks
        no matter how deep the path is.
        */

        if (className) {
            requiresMap[className] = dependencies;
            //<debug>
            if (!Loader.requiredByMap) Loader.requiredByMap = {};
            Ext.Array.each(dependencies, function(dependency){
                if (!Loader.requiredByMap[dependency]) Loader.requiredByMap[dependency] = [];
                Loader.requiredByMap[dependency].push(className);
            });
            //</debug>
            detectDeadlock = function(cls) {
                deadlockPath.push(cls);

                if (requiresMap[cls]) {
                    if (Ext.Array.contains(requiresMap[cls], className)) {
                        throw new Error("Deadlock detected while loading dependencies! '" + className + "' and '" +
                                deadlockPath[1] + "' " + "mutually require each other. Path: " +
                                deadlockPath.join(' -> ') + " -> " + deadlockPath[0]);
                    }

                    for (i = 0,ln = requiresMap[cls].length; i < ln; i++) {
                        detectDeadlock(requiresMap[cls][i]);
                    }
                }
            };

            detectDeadlock(className);
        }

        //</debug>
        //</feature>

        Loader.require(dependencies, function() {
            for (i = 0,ln = dependencyProperties.length; i < ln; i++) {
                propertyName = dependencyProperties[i];

                if (data.hasOwnProperty(propertyName)) {
                    propertyValue = data[propertyName];

                    if (typeof propertyValue == 'string') {
                        data[propertyName] = Manager.get(propertyValue);
                    }
                    else if (propertyValue instanceof Array) {
                        for (j = 0, subLn = propertyValue.length; j < subLn; j++) {
                            value = propertyValue[j];

                            if (typeof value == 'string') {
                                data[propertyName][j] = Manager.get(value);
                            }
                        }
                    }
                    else if (typeof propertyValue != 'function') {
                        for (var k in propertyValue) {
                            if (propertyValue.hasOwnProperty(k)) {
                                value = propertyValue[k];

                                if (typeof value == 'string') {
                                    data[propertyName][k] = Manager.get(value);
                                }
                            }
                        }
                    }
                }
            }

            continueFn.call(me, cls, data, hooks);
        });

        return false;
    }, true, 'after', 'className');

    //<feature classSystem.loader>
    /**
     * @cfg {String[]} uses
     * @member Ext.Class
     * List of optional classes to load together with this class. These aren't necessarily loaded before
     * this class is created, but are guaranteed to be available before Ext.onReady listeners are
     * invoked
     */
    Manager.registerPostprocessor('uses', function(name, cls, data) {
        var uses = arrayFrom(data.uses),
            items = [],
            i, ln, item;

        for (i = 0,ln = uses.length; i < ln; i++) {
            item = uses[i];

            if (typeof item == 'string') {
                items.push(item);
            }
        }

        Loader.addOptionalRequires(items);
    });

    Manager.onCreated(function(className) {
        this.historyPush(className);
    }, Loader);
    //</feature>

})(Ext.ClassManager, Ext.Class, Ext.Function.flexSetter, Ext.Function.alias,
   Ext.Function.pass, Ext.Array.from, Ext.Array.erase, Ext.Array.include);

// initalize the default path of the framework
// trimmed down version of sench-touch-debug-suffix.js
// with alias / alternates removed, as those are handled separately by
// compiler-generated metadata
(function() {
    var scripts = document.getElementsByTagName('script'),
        currentScript = scripts[scripts.length - 1],
        src = currentScript.src,
        path = src.substring(0, src.lastIndexOf('/') + 1),
        Loader = Ext.Loader;

    //<debug>
    // if we're running in dev mode out of the repo src tree, then this
    // file will potentially be loaded from the touch/src/core/class folder
    // so we'll need to adjust for that
    if(src.indexOf("src/core/class/") != -1) {
        path = path + "../../../";
    }
    //</debug>
    

    Loader.setConfig({
        enabled: true,
        disableCaching: !/[?&](cache|breakpoint)/i.test(location.search),
        paths: {
            'Ext' : path + 'src'
        }
    });
    
})();

//@tag dom,core
//@define Ext.EventManager
//@define Ext.core.EventManager
//@require Ext.Loader

/**
 * @class Ext.EventManager
 *
 * This object has been deprecated in Sencha Touch 2.0.0. Please refer to the method documentation for specific alternatives.
 *
 * @deprecated 2.0.0
 * @singleton
 * @private
 */


//@tag dom,core
//@define Ext-more
//@require Ext.EventManager

/**
 * @class Ext
 *
 * Ext is the global namespace for the whole Sencha Touch framework. Every class, function and configuration for the
 * whole framework exists under this single global variable. The Ext singleton itself contains a set of useful helper
 * functions (like {@link #apply}, {@link #min} and others), but most of the framework that you use day to day exists
 * in specialized classes (for example {@link Ext.Panel}, {@link Ext.Carousel} and others).
 *
 * If you are new to Sencha Touch we recommend starting with the [Getting Started Guide][getting_started] to
 * get a feel for how the framework operates. After that, use the more focused guides on subjects like panels, forms and data
 * to broaden your understanding. The MVC guides take you through the process of building full applications using the
 * framework, and detail how to deploy them to production.
 *
 * The functions listed below are mostly utility functions used internally by many of the classes shipped in the
 * framework, but also often useful in your own apps.
 *
 * A method that is crucial to beginning your application is {@link #setup Ext.setup}. Please refer to it's documentation, or the
 * [Getting Started Guide][getting_started] as a reference on beginning your application.
 *
 *     Ext.setup({
 *         onReady: function() {
 *             Ext.Viewport.add({
 *                 xtype: 'component',
 *                 html: 'Hello world!'
 *             });
 *         }
 *     });
 *
 * [getting_started]: #!/guide/getting_started
 */
Ext.setVersion('touch', '2.1.0');

Ext.apply(Ext, {
    /**
     * The version of the framework
     * @type String
     */
    version: Ext.getVersion('touch'),

    /**
     * @private
     */
    idSeed: 0,

    /**
     * Repaints the whole page. This fixes frequently encountered painting issues in mobile Safari.
     */
    repaint: function() {
        var mask = Ext.getBody().createChild({
            cls: Ext.baseCSSPrefix + 'mask ' + Ext.baseCSSPrefix + 'mask-transparent'
        });
        setTimeout(function() {
            mask.destroy();
        }, 0);
    },

    /**
     * Generates unique ids. If the element already has an `id`, it is unchanged.
     * @param {Mixed} el (optional) The element to generate an id for.
     * @param {String} [prefix=ext-gen] (optional) The `id` prefix.
     * @return {String} The generated `id`.
     */
    id: function(el, prefix) {
        if (el && el.id) {
            return el.id;
        }

        el = Ext.getDom(el) || {};

        if (el === document || el === document.documentElement) {
            el.id = 'ext-application';
        }
        else if (el === document.body) {
            el.id = 'ext-viewport';
        }
        else if (el === window) {
            el.id = 'ext-window';
        }

        el.id = el.id || ((prefix || 'ext-element-') + (++Ext.idSeed));

        return el.id;
    },

    /**
     * Returns the current document body as an {@link Ext.Element}.
     * @return {Ext.Element} The document body.
     */
    getBody: function() {
        if (!Ext.documentBodyElement) {
            if (!document.body) {
                throw new Error("[Ext.getBody] document.body does not exist at this point");
            }

            Ext.documentBodyElement = Ext.get(document.body);
        }

        return Ext.documentBodyElement;
    },

    /**
     * Returns the current document head as an {@link Ext.Element}.
     * @return {Ext.Element} The document head.
     */
    getHead: function() {
        if (!Ext.documentHeadElement) {
            Ext.documentHeadElement = Ext.get(document.head || document.getElementsByTagName('head')[0]);
        }

        return Ext.documentHeadElement;
    },

    /**
     * Returns the current HTML document object as an {@link Ext.Element}.
     * @return {Ext.Element} The document.
     */
    getDoc: function() {
        if (!Ext.documentElement) {
            Ext.documentElement = Ext.get(document);
        }

        return Ext.documentElement;
    },

    /**
     * This is shorthand reference to {@link Ext.ComponentMgr#get}.
     * Looks up an existing {@link Ext.Component Component} by {@link Ext.Component#getId id}
     * @param {String} id The component {@link Ext.Component#getId id}
     * @return {Ext.Component} The Component, `undefined` if not found, or `null` if a
     * Class was found.
    */
    getCmp: function(id) {
        return Ext.ComponentMgr.get(id);
    },

    /**
     * Copies a set of named properties from the source object to the destination object.
     *
     * Example:
     *
     *     ImageComponent = Ext.extend(Ext.Component, {
     *         initComponent: function() {
     *             this.autoEl = { tag: 'img' };
     *             MyComponent.superclass.initComponent.apply(this, arguments);
     *             this.initialBox = Ext.copyTo({}, this.initialConfig, 'x,y,width,height');
     *         }
     *     });
     *
     * Important note: To borrow class prototype methods, use {@link Ext.Base#borrow} instead.
     *
     * @param {Object} dest The destination object.
     * @param {Object} source The source object.
     * @param {String/String[]} names Either an Array of property names, or a comma-delimited list
     * of property names to copy.
     * @param {Boolean} [usePrototypeKeys=false] (optional) Pass `true` to copy keys off of the prototype as well as the instance.
     * @return {Object} The modified object.
     */
    copyTo : function(dest, source, names, usePrototypeKeys) {
        if (typeof names == 'string') {
            names = names.split(/[,;\s]/);
        }
        Ext.each (names, function(name) {
            if (usePrototypeKeys || source.hasOwnProperty(name)) {
                dest[name] = source[name];
            }
        }, this);
        return dest;
    },

    /**
     * Attempts to destroy any objects passed to it by removing all event listeners, removing them from the
     * DOM (if applicable) and calling their destroy functions (if available).  This method is primarily
     * intended for arguments of type {@link Ext.Element} and {@link Ext.Component}.
     * Any number of elements and/or components can be passed into this function in a single
     * call as separate arguments.
     * @param {Mixed...} args An {@link Ext.Element}, {@link Ext.Component}, or an Array of either of these to destroy.
     */
    destroy: function() {
        var args = arguments,
            ln = args.length,
            i, item;

        for (i = 0; i < ln; i++) {
            item = args[i];

            if (item) {
                if (Ext.isArray(item)) {
                    this.destroy.apply(this, item);
                }
                else if (Ext.isFunction(item.destroy)) {
                    item.destroy();
                }
            }
        }
    },

    /**
     * Return the dom node for the passed String (id), dom node, or Ext.Element.
     * Here are some examples:
     *
     *     // gets dom node based on id
     *     var elDom = Ext.getDom('elId');
     *
     *     // gets dom node based on the dom node
     *     var elDom1 = Ext.getDom(elDom);
     *
     *     // If we don't know if we are working with an
     *     // Ext.Element or a dom node use Ext.getDom
     *     function(el){
     *         var dom = Ext.getDom(el);
     *         // do something with the dom node
     *     }
     *
     * __Note:__ the dom node to be found actually needs to exist (be rendered, etc)
     * when this method is called to be successful.
     * @param {Mixed} el
     * @return {HTMLElement}
     */
    getDom: function(el) {
        if (!el || !document) {
            return null;
        }

        return el.dom ? el.dom : (typeof el == 'string' ? document.getElementById(el) : el);
    },

    /**
     * Removes this element from the document, removes all DOM event listeners, and deletes the cache reference.
     * All DOM event listeners are removed from this element.
     * @param {HTMLElement} node The node to remove.
     */
    removeNode: function(node) {
        if (node && node.parentNode && node.tagName != 'BODY') {
            Ext.get(node).clearListeners();
            node.parentNode.removeChild(node);
            delete Ext.cache[node.id];
        }
    },

    /**
     * @private
     */
    defaultSetupConfig: {
        eventPublishers: {
            dom: {
                xclass: 'Ext.event.publisher.Dom'
            },
            touchGesture: {
                xclass: 'Ext.event.publisher.TouchGesture',
                recognizers: {
                    drag: {
                        xclass: 'Ext.event.recognizer.Drag'
                    },
                    tap: {
                        xclass: 'Ext.event.recognizer.Tap'
                    },
                    doubleTap: {
                        xclass: 'Ext.event.recognizer.DoubleTap'
                    },
                    longPress: {
                        xclass: 'Ext.event.recognizer.LongPress'
                    },
                    swipe: {
                        xclass: 'Ext.event.recognizer.HorizontalSwipe'
                    },
                    pinch: {
                        xclass: 'Ext.event.recognizer.Pinch'
                    },
                    rotate: {
                        xclass: 'Ext.event.recognizer.Rotate'
                    }
                }
            },
            componentDelegation: {
                xclass: 'Ext.event.publisher.ComponentDelegation'
            },
            componentPaint: {
                xclass: 'Ext.event.publisher.ComponentPaint'
            },
//            componentSize: {
//                xclass: 'Ext.event.publisher.ComponentSize'
//            },
            elementPaint: {
                xclass: 'Ext.event.publisher.ElementPaint'
            },
            elementSize: {
                xclass: 'Ext.event.publisher.ElementSize'
            }
            //<feature charts>
            ,seriesItemEvents: {
                xclass: 'Ext.chart.series.ItemPublisher'
            }
            //</feature>
        },

        //<feature logger>
        logger: {
            enabled: true,
            xclass: 'Ext.log.Logger',
            minPriority: 'deprecate',
            writers: {
                console: {
                    xclass: 'Ext.log.writer.Console',
                    throwOnErrors: true,
                    formatter: {
                        xclass: 'Ext.log.formatter.Default'
                    }
                }
            }
        },
        //</feature>

        animator: {
            xclass: 'Ext.fx.Runner'
        },

        viewport: {
            xclass: 'Ext.viewport.Viewport'
        }
    },

    /**
     * @private
     */
    isSetup: false,

    /**
     * This indicate the start timestamp of current cycle.
     * It is only reliable during dom-event-initiated cycles and
     * {@link Ext.draw.Animator} initiated cycles.
     */
    frameStartTime: +new Date(),

    /**
     * @private
     */
    setupListeners: [],

    /**
     * @private
     */
    onSetup: function(fn, scope) {
        if (Ext.isSetup) {
            fn.call(scope);
        }
        else {
            Ext.setupListeners.push({
                fn: fn,
                scope: scope
            });
        }
    },

    /**
     * Ext.setup() is the entry-point to initialize a Sencha Touch application. Note that if your application makes
     * use of MVC architecture, use {@link Ext#application} instead.
     *
     * This method accepts one single argument in object format. The most basic use of Ext.setup() is as follows:
     *
     *     Ext.setup({
     *         onReady: function() {
     *             // ...
     *         }
     *     });
     *
     * This sets up the viewport, initializes the event system, instantiates a default animation runner, and a default
     * logger (during development). When all of that is ready, it invokes the callback function given to the `onReady` key.
     *
     * The default scope (`this`) of `onReady` is the main viewport. By default the viewport instance is stored in
     * {@link Ext.Viewport}. For example, this snippet adds a 'Hello World' button that is centered on the screen:
     *
     *     Ext.setup({
     *         onReady: function() {
     *             this.add({
     *                 xtype: 'button',
     *                 centered: true,
     *                 text: 'Hello world!'
     *             }); // Equivalent to Ext.Viewport.add(...)
     *         }
     *     });
     *
     * @param {Object} config An object with the following config options:
     *
     * @param {Function} config.onReady
     * A function to be called when the application is ready. Your application logic should be here.
     *
     * @param {Object} config.viewport
     * A custom config object to be used when creating the global {@link Ext.Viewport} instance. Please refer to the
     * {@link Ext.Viewport} documentation for more information.
     *
     *     Ext.setup({
     *         viewport: {
     *             width: 500,
     *             height: 500
     *         },
     *         onReady: function() {
     *             // ...
     *         }
     *     });
     *
     * @param {String/Object} config.icon
     * Specifies a set of URLs to the application icon for different device form factors. This icon is displayed
     * when the application is added to the device's Home Screen.
     *
     *     Ext.setup({
     *         icon: {
     *             57: 'resources/icons/Icon.png',
     *             72: 'resources/icons/Icon~ipad.png',
     *             114: 'resources/icons/Icon@2x.png',
     *             144: 'resources/icons/Icon~ipad@2x.png'
     *         },
     *         onReady: function() {
     *             // ...
     *         }
     *     });
     *
     * Each key represents the dimension of the icon as a square shape. For example: '57' is the key for a 57 x 57
     * icon image. Here is the breakdown of each dimension and its device target:
     *
     * - 57: Non-retina iPhone, iPod touch, and all Android devices
     * - 72: Retina iPhone and iPod touch
     * - 114: Non-retina iPad (first and second generation)
     * - 144: Retina iPad (third generation)
     *
     * Note that the dimensions of the icon images must be exactly 57x57, 72x72, 114x114 and 144x144 respectively.
     *
     * It is highly recommended that you provide all these different sizes to accommodate a full range of
     * devices currently available. However if you only have one icon in one size, make it 57x57 in size and
     * specify it as a string value. This same icon will be used on all supported devices.
     *
     *     Ext.setup({
     *         icon: 'resources/icons/Icon.png',
     *         onReady: function() {
     *             // ...
     *         }
     *     });
     *
     * @param {Object} config.startupImage
     * Specifies a set of URLs to the application startup images for different device form factors. This image is
     * displayed when the application is being launched from the Home Screen icon. Note that this currently only applies
     * to iOS devices.
     *
     *     Ext.setup({
     *         startupImage: {
     *             '320x460': 'resources/startup/320x460.jpg',
     *             '640x920': 'resources/startup/640x920.png',
     *             '640x1096': 'resources/startup/640x1096.png',
     *             '768x1004': 'resources/startup/768x1004.png',
     *             '748x1024': 'resources/startup/748x1024.png',
     *             '1536x2008': 'resources/startup/1536x2008.png',
     *             '1496x2048': 'resources/startup/1496x2048.png'
     *         },
     *         onReady: function() {
     *             // ...
     *         }
     *     });
     *
     * Each key represents the dimension of the image. For example: '320x460' is the key for a 320px x 460px image.
     * Here is the breakdown of each dimension and its device target:
     *
     * - 320x460: Non-retina iPhone, iPod touch, and all Android devices
     * - 640x920: Retina iPhone and iPod touch
     * - 640x1096: iPhone 5 and iPod touch (fifth generation)
     * - 768x1004: Non-retina iPad (first and second generation) in portrait orientation
     * - 748x1024: Non-retina iPad (first and second generation) in landscape orientation
     * - 1536x2008: Retina iPad (third generation) in portrait orientation
     * - 1496x2048: Retina iPad (third generation) in landscape orientation
     *
     * Please note that there's no automatic fallback mechanism for the startup images. In other words, if you don't specify
     * a valid image for a certain device, nothing will be displayed while the application is being launched on that device.
     *
     * @param {Boolean} isIconPrecomposed
     * True to not having a glossy effect added to the icon by the OS, which will preserve its exact look. This currently
     * only applies to iOS devices.
     *
     * @param {String} statusBarStyle
     * The style of status bar to be shown on applications added to the iOS home screen. Valid options are:
     *
     * * `default`
     * * `black`
     * * `black-translucent`
     *
     * @param {String[]} config.requires
     * An array of required classes for your application which will be automatically loaded before `onReady` is invoked.
     * Please refer to {@link Ext.Loader} and {@link Ext.Loader#require} for more information.
     *
     *     Ext.setup({
     *         requires: ['Ext.Button', 'Ext.tab.Panel'],
     *         onReady: function() {
     *             // ...
     *         }
     *     });
     *
     * @param {Object} config.eventPublishers
     * Sencha Touch, by default, includes various {@link Ext.event.recognizer.Recognizer} subclasses to recognize events fired
     * in your application. The list of default recognizers can be found in the documentation for
     * {@link Ext.event.recognizer.Recognizer}.
     *
     * To change the default recognizers, you can use the following syntax:
     *
     *     Ext.setup({
     *         eventPublishers: {
     *             touchGesture: {
     *                 recognizers: {
     *                     swipe: {
     *                         // this will include both vertical and horizontal swipe recognizers
     *                         xclass: 'Ext.event.recognizer.Swipe'
     *                     }
     *                 }
     *             }
     *         },
     *         onReady: function() {
     *             // ...
     *         }
     *     });
     *
     * You can also disable recognizers using this syntax:
     *
     *     Ext.setup({
     *         eventPublishers: {
     *             touchGesture: {
     *                 recognizers: {
     *                     swipe: null,
     *                     pinch: null,
     *                     rotate: null
     *                 }
     *             }
     *         },
     *         onReady: function() {
     *             // ...
     *         }
     *     });
     */
    setup: function(config) {
        var defaultSetupConfig = Ext.defaultSetupConfig,
            emptyFn = Ext.emptyFn,
            onReady = config.onReady || emptyFn,
            onUpdated = config.onUpdated || emptyFn,
            scope = config.scope,
            requires = Ext.Array.from(config.requires),
            extOnReady = Ext.onReady,
            head = Ext.getHead(),
            callback, viewport, precomposed;

        Ext.setup = function() {
            throw new Error("Ext.setup has already been called before");
        };

        delete config.requires;
        delete config.onReady;
        delete config.onUpdated;
        delete config.scope;

        Ext.require(['Ext.event.Dispatcher']);

        callback = function() {
            var listeners = Ext.setupListeners,
                ln = listeners.length,
                i, listener;

            delete Ext.setupListeners;
            Ext.isSetup = true;

            for (i = 0; i < ln; i++) {
                listener = listeners[i];
                listener.fn.call(listener.scope);
            }

            Ext.onReady = extOnReady;
            Ext.onReady(onReady, scope);
        };

        Ext.onUpdated = onUpdated;
        Ext.onReady = function(fn, scope) {
            var origin = onReady;

            onReady = function() {
                origin();
                Ext.onReady(fn, scope);
            };
        };

        config = Ext.merge({}, defaultSetupConfig, config);

        Ext.onDocumentReady(function() {
            Ext.factoryConfig(config, function(data) {
                Ext.event.Dispatcher.getInstance().setPublishers(data.eventPublishers);

                if (data.logger) {
                    Ext.Logger = data.logger;
                }

                if (data.animator) {
                    Ext.Animator = data.animator;
                }

                if (data.viewport) {
                    Ext.Viewport = viewport = data.viewport;

                    if (!scope) {
                        scope = viewport;
                    }

                    Ext.require(requires, function() {
                        Ext.Viewport.on('ready', callback, null, {single: true});
                    });
                }
                else {
                    Ext.require(requires, callback);
                }
            });
        });

        function addMeta(name, content) {
            var meta = document.createElement('meta');
            meta.setAttribute('name', name);
            meta.setAttribute('content', content);
            head.append(meta);
        }

        function addIcon(href, sizes, precomposed) {
            var link = document.createElement('link');
            link.setAttribute('rel', 'apple-touch-icon' + (precomposed ? '-precomposed' : ''));
            link.setAttribute('href', href);
            if (sizes) {
                link.setAttribute('sizes', sizes);
            }
            head.append(link);
        }

        function addStartupImage(href, media) {
            var link = document.createElement('link');
            link.setAttribute('rel', 'apple-touch-startup-image');
            link.setAttribute('href', href);
            if (media) {
                link.setAttribute('media', media);
            }
            head.append(link);
        }

        var icon = config.icon,
            isIconPrecomposed = Boolean(config.isIconPrecomposed),
            startupImage = config.startupImage || {},
            statusBarStyle = config.statusBarStyle,
            devicePixelRatio = window.devicePixelRatio || 1;

        if (navigator.standalone) {
            addMeta('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0');
        }
        else {
            addMeta('viewport', 'initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0');
        }
        addMeta('apple-mobile-web-app-capable', 'yes');
        addMeta('apple-touch-fullscreen', 'yes');

        // status bar style
        if (statusBarStyle) {
            addMeta('apple-mobile-web-app-status-bar-style', statusBarStyle);
        }

        if (Ext.isString(icon)) {
            icon = {
                57: icon,
                72: icon,
                114: icon,
                144: icon
            };
        }
        else if (!icon) {
            icon = {};
        }


        if (Ext.os.is.iPad) {
            if (devicePixelRatio >= 2) {
                // Retina iPad - Landscape
                if ('1496x2048' in startupImage) {
                    addStartupImage(startupImage['1496x2048'], '(orientation: landscape)');
                }
                // Retina iPad - Portrait
                if ('1536x2008' in startupImage) {
                    addStartupImage(startupImage['1536x2008'], '(orientation: portrait)');
                }

                // Retina iPad
                if ('144' in icon) {
                    addIcon(icon['144'], '144x144', isIconPrecomposed);
                }
            }
            else {
                // Non-Retina iPad - Landscape
                if ('748x1024' in startupImage) {
                    addStartupImage(startupImage['748x1024'], '(orientation: landscape)');
                }
                // Non-Retina iPad - Portrait
                if ('768x1004' in startupImage) {
                    addStartupImage(startupImage['768x1004'], '(orientation: portrait)');
                }

                // Non-Retina iPad
                if ('72' in icon) {
                    addIcon(icon['72'], '72x72', isIconPrecomposed);
                }
            }
        }
        else {
            // Retina iPhone, iPod touch with iOS version >= 4.3
            if (devicePixelRatio >= 2 && Ext.os.version.gtEq('4.3')) {
                if (Ext.os.is.iPhone5) {
                    addStartupImage(startupImage['640x1096']);
                } else {
                    addStartupImage(startupImage['640x920']);
                }

                // Retina iPhone and iPod touch
                if ('114' in icon) {
                    addIcon(icon['114'], '114x114', isIconPrecomposed);
                }
            }
            else {
                addStartupImage(startupImage['320x460']);

                // Non-Retina iPhone, iPod touch, and Android devices
                if ('57' in icon) {
                    addIcon(icon['57'], null, isIconPrecomposed);
                }
            }
        }
    },

    /**
     * @member Ext
     * @method application
     *
     * Loads Ext.app.Application class and starts it up with given configuration after the page is ready.
     *
     *     Ext.application({
     *         launch: function() {
     *             alert('Application launched!');
     *         }
     *     });
     *
     * See {@link Ext.app.Application} for details.
     *
     * @param {Object} config An object with the following config options:
     *
     * @param {Function} config.launch
     * A function to be called when the application is ready. Your application logic should be here. Please see {@link Ext.app.Application}
     * for details.
     *
     * @param {Object} config.viewport
     * An object to be used when creating the global {@link Ext.Viewport} instance. Please refer to the {@link Ext.Viewport}
     * documentation for more information.
     *
     *     Ext.application({
     *         viewport: {
     *             layout: 'vbox'
     *         },
     *         launch: function() {
     *             Ext.Viewport.add({
     *                 flex: 1,
     *                 html: 'top (flex: 1)'
     *             });
     *
     *             Ext.Viewport.add({
     *                 flex: 4,
     *                 html: 'bottom (flex: 4)'
     *             });
     *         }
     *     });
     *
     * @param {String/Object} config.icon
     * Specifies a set of URLs to the application icon for different device form factors. This icon is displayed
     * when the application is added to the device's Home Screen.
     *
     *     Ext.application({
     *         icon: {
     *             57: 'resources/icons/Icon.png',
     *             72: 'resources/icons/Icon~ipad.png',
     *             114: 'resources/icons/Icon@2x.png',
     *             144: 'resources/icons/Icon~ipad@2x.png'
     *         },
     *         launch: function() {
     *             // ...
     *         }
     *     });
     *
     * Each key represents the dimension of the icon as a square shape. For example: '57' is the key for a 57 x 57
     * icon image. Here is the breakdown of each dimension and its device target:
     *
     * - 57: Non-retina iPhone, iPod touch, and all Android devices
     * - 72: Retina iPhone and iPod touch
     * - 114: Non-retina iPad (first and second generation)
     * - 144: Retina iPad (third generation)
     *
     * Note that the dimensions of the icon images must be exactly 57x57, 72x72, 114x114 and 144x144 respectively.
     *
     * It is highly recommended that you provide all these different sizes to accommodate a full range of
     * devices currently available. However if you only have one icon in one size, make it 57x57 in size and
     * specify it as a string value. This same icon will be used on all supported devices.
     *
     *     Ext.setup({
     *         icon: 'resources/icons/Icon.png',
     *         onReady: function() {
     *             // ...
     *         }
     *     });
     *
     * @param {Object} config.startupImage
     * Specifies a set of URLs to the application startup images for different device form factors. This image is
     * displayed when the application is being launched from the Home Screen icon. Note that this currently only applies
     * to iOS devices.
     *
     *     Ext.application({
     *         startupImage: {
     *             '320x460': 'resources/startup/320x460.jpg',
     *             '640x920': 'resources/startup/640x920.png',
     *             '640x1096': 'resources/startup/640x1096.png',
     *             '768x1004': 'resources/startup/768x1004.png',
     *             '748x1024': 'resources/startup/748x1024.png',
     *             '1536x2008': 'resources/startup/1536x2008.png',
     *             '1496x2048': 'resources/startup/1496x2048.png'
     *         },
     *         launch: function() {
     *             // ...
     *         }
     *     });
     *
     * Each key represents the dimension of the image. For example: '320x460' is the key for a 320px x 460px image.
     * Here is the breakdown of each dimension and its device target:
     *
     * - 320x460: Non-retina iPhone, iPod touch, and all Android devices
     * - 640x920: Retina iPhone and iPod touch
     * - 640x1096: iPhone 5 and iPod touch (fifth generation)
     * - 768x1004: Non-retina iPad (first and second generation) in portrait orientation
     * - 748x1024: Non-retina iPad (first and second generation) in landscape orientation
     * - 1536x2008: Retina iPad (third generation) in portrait orientation
     * - 1496x2048: Retina iPad (third generation) in landscape orientation
     *
     * Please note that there's no automatic fallback mechanism for the startup images. In other words, if you don't specify
     * a valid image for a certain device, nothing will be displayed while the application is being launched on that device.
     *
     * @param {Boolean} config.isIconPrecomposed
     * True to not having a glossy effect added to the icon by the OS, which will preserve its exact look. This currently
     * only applies to iOS devices.
     *
     * @param {String} config.statusBarStyle
     * The style of status bar to be shown on applications added to the iOS home screen. Valid options are:
     *
     * * `default`
     * * `black`
     * * `black-translucent`
     *
     * @param {String[]} config.requires
     * An array of required classes for your application which will be automatically loaded if {@link Ext.Loader#enabled} is set
     * to `true`. Please refer to {@link Ext.Loader} and {@link Ext.Loader#require} for more information.
     *
     *     Ext.application({
     *         requires: ['Ext.Button', 'Ext.tab.Panel'],
     *         launch: function() {
     *             // ...
     *         }
     *     });
     *
     * @param {Object} config.eventPublishers
     * Sencha Touch, by default, includes various {@link Ext.event.recognizer.Recognizer} subclasses to recognize events fired
     * in your application. The list of default recognizers can be found in the documentation for {@link Ext.event.recognizer.Recognizer}.
     *
     * To change the default recognizers, you can use the following syntax:
     *
     *     Ext.application({
     *         eventPublishers: {
     *             touchGesture: {
     *                 recognizers: {
     *                     swipe: {
     *                         // this will include both vertical and horizontal swipe recognizers
     *                         xclass: 'Ext.event.recognizer.Swipe'
     *                     }
     *                 }
     *             }
     *         },
     *         launch: function() {
     *             // ...
     *         }
     *     });
     *
     * You can also disable recognizers using this syntax:
     *
     *     Ext.application({
     *         eventPublishers: {
     *             touchGesture: {
     *                 recognizers: {
     *                     swipe: null,
     *                     pinch: null,
     *                     rotate: null
     *                 }
     *             }
     *         },
     *         launch: function() {
     *             // ...
     *         }
     *     });
     */
    application: function(config) {
        var appName = config.name,
            onReady, scope, requires;

        if (!config) {
            config = {};
        }

        if (!Ext.Loader.config.paths[appName]) {
            Ext.Loader.setPath(appName, config.appFolder || 'app');
        }

        requires = Ext.Array.from(config.requires);
        config.requires = ['Ext.app.Application'];

        onReady = config.onReady;
        scope = config.scope;

        config.onReady = function() {
            config.requires = requires;
            new Ext.app.Application(config);

            if (onReady) {
                onReady.call(scope);
            }
        };

        Ext.setup(config);
    },

    /**
     * @private
     * @param config
     * @param callback
     * @member Ext
     */
    factoryConfig: function(config, callback) {
        var isSimpleObject = Ext.isSimpleObject(config);

        if (isSimpleObject && config.xclass) {
            var className = config.xclass;

            delete config.xclass;

            Ext.require(className, function() {
                Ext.factoryConfig(config, function(cfg) {
                    callback(Ext.create(className, cfg));
                });
            });

            return;
        }

        var isArray = Ext.isArray(config),
            keys = [],
            key, value, i, ln;

        if (isSimpleObject || isArray) {
            if (isSimpleObject) {
                for (key in config) {
                    if (config.hasOwnProperty(key)) {
                        value = config[key];
                        if (Ext.isSimpleObject(value) || Ext.isArray(value)) {
                            keys.push(key);
                        }
                    }
                }
            }
            else {
                for (i = 0,ln = config.length; i < ln; i++) {
                    value = config[i];

                    if (Ext.isSimpleObject(value) || Ext.isArray(value)) {
                        keys.push(i);
                    }
                }
            }

            i = 0;
            ln = keys.length;

            if (ln === 0) {
                callback(config);
                return;
            }

            function fn(value) {
                config[key] = value;
                i++;
                factory();
            }

            function factory() {
                if (i >= ln) {
                    callback(config);
                    return;
                }

                key = keys[i];
                value = config[key];

                Ext.factoryConfig(value, fn);
            }

            factory();
            return;
        }

        callback(config);
    },

    /**
     * A global factory method to instantiate a class from a config object. For example, these two calls are equivalent:
     *
     *     Ext.factory({ text: 'My Button' }, 'Ext.Button');
     *     Ext.create('Ext.Button', { text: 'My Button' });
     *
     * If an existing instance is also specified, it will be updated with the supplied config object. This is useful
     * if you need to either create or update an object, depending on if an instance already exists. For example:
     *
     *     var button;
     *     button = Ext.factory({ text: 'New Button' }, 'Ext.Button', button);     // Button created
     *     button = Ext.factory({ text: 'Updated Button' }, 'Ext.Button', button); // Button updated
     *
     * @param {Object} config  The config object to instantiate or update an instance with.
     * @param {String} classReference  The class to instantiate from.
     * @param {Object} [instance]  The instance to update.
     * @param [aliasNamespace]
     * @member Ext
     */
    factory: function(config, classReference, instance, aliasNamespace) {
        var manager = Ext.ClassManager,
            newInstance;

        // If config is falsy or a valid instance, destroy the current instance
        // (if it exists) and replace with the new one
        if (!config || config.isInstance) {
            if (instance && instance !== config) {
                instance.destroy();
            }

            return config;
        }

        if (aliasNamespace) {
             // If config is a string value, treat it as an alias
            if (typeof config == 'string') {
                return manager.instantiateByAlias(aliasNamespace + '.' + config);
            }
            // Same if 'type' is given in config
            else if (Ext.isObject(config) && 'type' in config) {
                return manager.instantiateByAlias(aliasNamespace + '.' + config.type, config);
            }
        }

        if (config === true) {
            return instance || manager.instantiate(classReference);
        }

        //<debug error>
        if (!Ext.isObject(config)) {
            Ext.Logger.error("Invalid config, must be a valid config object");
        }
        //</debug>

        if ('xtype' in config) {
            newInstance = manager.instantiateByAlias('widget.' + config.xtype, config);
        }
        else if ('xclass' in config) {
            newInstance = manager.instantiate(config.xclass, config);
        }

        if (newInstance) {
            if (instance) {
                instance.destroy();
            }

            return newInstance;
        }

        if (instance) {
            return instance.setConfig(config);
        }

        return manager.instantiate(classReference, config);
    },

    /**
     * @private
     * @member Ext
     */
    deprecateClassMember: function(cls, oldName, newName, message) {
        return this.deprecateProperty(cls.prototype, oldName, newName, message);
    },

    /**
     * @private
     * @member Ext
     */
    deprecateClassMembers: function(cls, members) {
       var prototype = cls.prototype,
           oldName, newName;

       for (oldName in members) {
           if (members.hasOwnProperty(oldName)) {
               newName = members[oldName];

               this.deprecateProperty(prototype, oldName, newName);
           }
       }
    },

    /**
     * @private
     * @member Ext
     */
    deprecateProperty: function(object, oldName, newName, message) {
        if (!message) {
            message = "'" + oldName + "' is deprecated";
        }
        if (newName) {
            message += ", please use '" + newName + "' instead";
        }

        if (newName) {
            Ext.Object.defineProperty(object, oldName, {
                get: function() {
                    //<debug warn>
                    Ext.Logger.deprecate(message, 1);
                    //</debug>
                    return this[newName];
                },
                set: function(value) {
                    //<debug warn>
                    Ext.Logger.deprecate(message, 1);
                    //</debug>

                    this[newName] = value;
                },
                configurable: true
            });
        }
    },

    /**
     * @private
     * @member Ext
     */
    deprecatePropertyValue: function(object, name, value, message) {
        Ext.Object.defineProperty(object, name, {
            get: function() {
                //<debug warn>
                Ext.Logger.deprecate(message, 1);
                //</debug>
                return value;
            },
            configurable: true
        });
    },

    /**
     * @private
     * @member Ext
     */
    deprecateMethod: function(object, name, method, message) {
        object[name] = function() {
            //<debug warn>
            Ext.Logger.deprecate(message, 2);
            //</debug>
            if (method) {
                return method.apply(this, arguments);
            }
        };
    },

    /**
     * @private
     * @member Ext
     */
    deprecateClassMethod: function(cls, name, method, message) {
        if (typeof name != 'string') {
            var from, to;

            for (from in name) {
                if (name.hasOwnProperty(from)) {
                    to = name[from];
                    Ext.deprecateClassMethod(cls, from, to);
                }
            }
            return;
        }

        var isLateBinding = typeof method == 'string',
            member;

        if (!message) {
            message = "'" + name + "()' is deprecated, please use '" + (isLateBinding ? method : method.name) +
                "()' instead";
        }

        if (isLateBinding) {
            member = function() {
                //<debug warn>
                Ext.Logger.deprecate(message, this);
                //</debug>

                return this[method].apply(this, arguments);
            };
        }
        else {
            member = function() {
                //<debug warn>
                Ext.Logger.deprecate(message, this);
                //</debug>

                return method.apply(this, arguments);
            };
        }

        if (name in cls.prototype) {
            Ext.Object.defineProperty(cls.prototype, name, {
                value: null,
                writable: true,
                configurable: true
            });
        }

        cls.addMember(name, member);
    },

    //<debug>
    /**
     * Useful snippet to show an exact, narrowed-down list of top-level Components that are not yet destroyed.
     * @private
     */
    showLeaks: function() {
        var map = Ext.ComponentManager.all.map,
            leaks = [],
            parent;

        Ext.Object.each(map, function(id, component) {
            while ((parent = component.getParent()) && map.hasOwnProperty(parent.getId())) {
                component = parent;
            }

            if (leaks.indexOf(component) === -1) {
                leaks.push(component);
            }
        });

        console.log(leaks);
    },
    //</debug>

    /**
     * True when the document is fully initialized and ready for action
     * @type Boolean
     * @member Ext
     * @private
     */
    isReady : false,

    /**
     * @private
     * @member Ext
     */
    readyListeners: [],

    /**
     * @private
     * @member Ext
     */
    triggerReady: function() {
        var listeners = Ext.readyListeners,
            i, ln, listener;

        if (!Ext.isReady) {
            Ext.isReady = true;

            for (i = 0,ln = listeners.length; i < ln; i++) {
                listener = listeners[i];
                listener.fn.call(listener.scope);
            }
            delete Ext.readyListeners;
        }
    },

    /**
     * @private
     * @member Ext
     */
    onDocumentReady: function(fn, scope) {
        if (Ext.isReady) {
            fn.call(scope);
        }
        else {
            var triggerFn = Ext.triggerReady;

            Ext.readyListeners.push({
                fn: fn,
                scope: scope
            });

            if (Ext.browser.is.PhoneGap && !Ext.os.is.Desktop) {
                if (!Ext.readyListenerAttached) {
                    Ext.readyListenerAttached = true;
                    document.addEventListener('deviceready', triggerFn, false);
                }
            }
            else {
                if (document.readyState.match(/interactive|complete|loaded/) !== null) {
                    triggerFn();
                }
                else if (!Ext.readyListenerAttached) {
                    Ext.readyListenerAttached = true;
                    window.addEventListener('DOMContentLoaded', triggerFn, false);
                }
            }
        }
    },

    /**
     * Calls function after specified delay, or right away when delay == 0.
     * @param {Function} callback The callback to execute.
     * @param {Object} scope (optional) The scope to execute in.
     * @param {Array} args (optional) The arguments to pass to the function.
     * @param {Number} delay (optional) Pass a number to delay the call by a number of milliseconds.
     * @member Ext
     */
    callback: function(callback, scope, args, delay) {
        if (Ext.isFunction(callback)) {
            args = args || [];
            scope = scope || window;
            if (delay) {
                Ext.defer(callback, delay, scope, args);
            } else {
                callback.apply(scope, args);
            }
        }
    }
});

//<debug>
Ext.Object.defineProperty(Ext, 'Msg', {
    get: function() {
        Ext.Logger.error("Using Ext.Msg without requiring Ext.MessageBox");
        return null;
    },
    set: function(value) {
        Ext.Object.defineProperty(Ext, 'Msg', {
            value: value
        });
        return value;
    },
    configurable: true
});
//</debug>


//@tag dom,core
//@require Ext-more

/**
 * Provides information about browser.
 *
 * Should not be manually instantiated unless for unit-testing.
 * Access the global instance stored in {@link Ext.browser} instead.
 * @private
 */
Ext.define('Ext.env.Browser', {
    requires: ['Ext.Version'],

    statics: {
        browserNames: {
            ie: 'IE',
            firefox: 'Firefox',
            safari: 'Safari',
            chrome: 'Chrome',
            opera: 'Opera',
            dolfin: 'Dolfin',
            webosbrowser: 'webOSBrowser',
            chromeMobile: 'ChromeMobile',
            silk: 'Silk',
            other: 'Other'
        },
        engineNames: {
            webkit: 'WebKit',
            gecko: 'Gecko',
            presto: 'Presto',
            trident: 'Trident',
            other: 'Other'
        },
        enginePrefixes: {
            webkit: 'AppleWebKit/',
            gecko: 'Gecko/',
            presto: 'Presto/',
            trident: 'Trident/'
        },
        browserPrefixes: {
            ie: 'MSIE ',
            firefox: 'Firefox/',
            chrome: 'Chrome/',
            safari: 'Version/',
            opera: 'Opera/',
            dolfin: 'Dolfin/',
            webosbrowser: 'wOSBrowser/',
            chromeMobile: 'CrMo/',
            silk: 'Silk/'
        }
    },

    styleDashPrefixes: {
        WebKit: '-webkit-',
        Gecko: '-moz-',
        Trident: '-ms-',
        Presto: '-o-',
        Other: ''
    },

    stylePrefixes: {
        WebKit: 'Webkit',
        Gecko: 'Moz',
        Trident: 'ms',
        Presto: 'O',
        Other: ''
    },

    propertyPrefixes: {
        WebKit: 'webkit',
        Gecko: 'moz',
        Trident: 'ms',
        Presto: 'o',
        Other: ''
    },

    // scope: Ext.env.Browser.prototype

    /**
     * A "hybrid" property, can be either accessed as a method call, for example:
     *
     *     if (Ext.browser.is('IE')) {
     *         // ...
     *     }
     *
     * Or as an object with Boolean properties, for example:
     *
     *     if (Ext.browser.is.IE) {
     *         // ...
     *     }
     *
     * Versions can be conveniently checked as well. For example:
     *
     *     if (Ext.browser.is.IE6) {
     *         // Equivalent to (Ext.browser.is.IE && Ext.browser.version.equals(6))
     *     }
     *
     * __Note:__ Only {@link Ext.Version#getMajor major component}  and {@link Ext.Version#getShortVersion simplified}
     * value of the version are available via direct property checking.
     *
     * Supported values are:
     *
     * - IE
     * - Firefox
     * - Safari
     * - Chrome
     * - Opera
     * - WebKit
     * - Gecko
     * - Presto
     * - Trident
     * - WebView
     * - Other
     *
     * @param {String} value The OS name to check.
     * @return {Boolean}
     */
    is: Ext.emptyFn,

    /**
     * The full name of the current browser.
     * Possible values are:
     *
     * - IE
     * - Firefox
     * - Safari
     * - Chrome
     * - Opera
     * - Other
     * @type String
     * @readonly
     */
    name: null,

    /**
     * Refer to {@link Ext.Version}.
     * @type Ext.Version
     * @readonly
     */
    version: null,

    /**
     * The full name of the current browser's engine.
     * Possible values are:
     *
     * - WebKit
     * - Gecko
     * - Presto
     * - Trident
     * - Other
     * @type String
     * @readonly
     */
    engineName: null,

    /**
     * Refer to {@link Ext.Version}.
     * @type Ext.Version
     * @readonly
     */
    engineVersion: null,

    setFlag: function(name, value) {
        if (typeof value == 'undefined') {
            value = true;
        }

        this.is[name] = value;
        this.is[name.toLowerCase()] = value;

        return this;
    },

    constructor: function(userAgent) {
        /**
         * @property {String}
         * Browser User Agent string.
         */
        this.userAgent = userAgent;

        is = this.is = function(name) {
            return is[name] === true;
        };

        var statics = this.statics(),
            browserMatch = userAgent.match(new RegExp('((?:' + Ext.Object.getValues(statics.browserPrefixes).join(')|(?:') + '))([\\w\\._]+)')),
            engineMatch = userAgent.match(new RegExp('((?:' + Ext.Object.getValues(statics.enginePrefixes).join(')|(?:') + '))([\\w\\._]+)')),
            browserNames = statics.browserNames,
            browserName = browserNames.other,
            engineNames = statics.engineNames,
            engineName = engineNames.other,
            browserVersion = '',
            engineVersion = '',
            isWebView = false,
            is, i, name;

        if (browserMatch) {
            browserName = browserNames[Ext.Object.getKey(statics.browserPrefixes, browserMatch[1])];

            browserVersion = new Ext.Version(browserMatch[2]);
        }

        if (engineMatch) {
            engineName = engineNames[Ext.Object.getKey(statics.enginePrefixes, engineMatch[1])];
            engineVersion = new Ext.Version(engineMatch[2]);
        }

        // Facebook changes the userAgent when you view a website within their iOS app. For some reason, the strip out information
        // about the browser, so we have to detect that and fake it...
        if (userAgent.match(/FB/) && browserName == "Other") {
            browserName = browserNames.safari;
            engineName = engineNames.webkit;
        }

        if (userAgent.match(/Android.*Chrome/g)) {
            browserName = 'ChromeMobile';
        }

        Ext.apply(this, {
            engineName: engineName,
            engineVersion: engineVersion,
            name: browserName,
            version: browserVersion
        });

        this.setFlag(browserName);

        if (browserVersion) {
            this.setFlag(browserName + (browserVersion.getMajor() || ''));
            this.setFlag(browserName + browserVersion.getShortVersion());
        }

        for (i in browserNames) {
            if (browserNames.hasOwnProperty(i)) {
                name = browserNames[i];

                this.setFlag(name, browserName === name);
            }
        }

        this.setFlag(name);

        if (engineVersion) {
            this.setFlag(engineName + (engineVersion.getMajor() || ''));
            this.setFlag(engineName + engineVersion.getShortVersion());
        }

        for (i in engineNames) {
            if (engineNames.hasOwnProperty(i)) {
                name = engineNames[i];

                this.setFlag(name, engineName === name);
            }
        }

        this.setFlag('Standalone', !!navigator.standalone);

        if (typeof window.PhoneGap != 'undefined' || typeof window.Cordova != 'undefined' || typeof window.cordova != 'undefined') {
            isWebView = true;
            this.setFlag('PhoneGap');
        }
        else if (!!window.isNK) {
            isWebView = true;
            this.setFlag('Sencha');
        }

        // Check if running in UIWebView
        if (/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)(?!.*FBAN)/i.test(userAgent)) {
            isWebView = true;
        }

        // Flag to check if it we are in the WebView
        this.setFlag('WebView', isWebView);

        /**
         * @property {Boolean}
         * `true` if browser is using strict mode.
         */
        this.isStrict = document.compatMode == "CSS1Compat";

        /**
         * @property {Boolean}
         * `true` if page is running over SSL.
         */
        this.isSecure = /^https/i.test(window.location.protocol);

        return this;
    },

    getStyleDashPrefix: function() {
        return this.styleDashPrefixes[this.engineName];
    },

    getStylePrefix: function() {
        return this.stylePrefixes[this.engineName];
    },

    getVendorProperyName: function(name) {
        var prefix = this.propertyPrefixes[this.engineName];

        if (prefix.length > 0) {
            return prefix + Ext.String.capitalize(name);
        }

        return name;
    }

}, function() {
    /**
     * @class Ext.browser
     * @extends Ext.env.Browser
     * @singleton
     * Provides useful information about the current browser.
     *
     * Example:
     *
     *     if (Ext.browser.is.IE) {
     *         // IE specific code here
     *     }
     *
     *     if (Ext.browser.is.WebKit) {
     *         // WebKit specific code here
     *     }
     *
     *     console.log("Version " + Ext.browser.version);
     *
     * For a full list of supported values, refer to {@link #is} property/method.
     *
     * @aside guide environment_package
     */
    var browserEnv = Ext.browser = new this(Ext.global.navigator.userAgent);

});

//@tag dom,core
//@require Ext.env.Browser

/**
 * Provides information about operating system environment.
 *
 * Should not be manually instantiated unless for unit-testing.
 * Access the global instance stored in {@link Ext.os} instead.
 * @private
 */
Ext.define('Ext.env.OS', {

    requires: ['Ext.Version'],

    statics: {
        names: {
            ios: 'iOS',
            android: 'Android',
            webos: 'webOS',
            blackberry: 'BlackBerry',
            rimTablet: 'RIMTablet',
            mac: 'MacOS',
            win: 'Windows',
            linux: 'Linux',
            bada: 'Bada',
            other: 'Other'
        },
        prefixes: {
            ios: 'i(?:Pad|Phone|Pod)(?:.*)CPU(?: iPhone)? OS ',
            android: '(Android |HTC_|Silk/)', // Some HTC devices ship with an OSX userAgent by default,
                                        // so we need to add a direct check for HTC_
            blackberry: 'BlackBerry(?:.*)Version\/',
            rimTablet: 'RIM Tablet OS ',
            webos: '(?:webOS|hpwOS)\/',
            bada: 'Bada\/'
        }
    },

    /**
     * A "hybrid" property, can be either accessed as a method call, i.e:
     *
     *     if (Ext.os.is('Android')) {
     *         // ...
     *     }
     *
     * or as an object with boolean properties, i.e:
     *
     *     if (Ext.os.is.Android) {
     *         // ...
     *     }
     *
     * Versions can be conveniently checked as well. For example:
     *
     *     if (Ext.os.is.Android2) {
     *         // Equivalent to (Ext.os.is.Android && Ext.os.version.equals(2))
     *     }
     *
     *     if (Ext.os.is.iOS32) {
     *         // Equivalent to (Ext.os.is.iOS && Ext.os.version.equals(3.2))
     *     }
     *
     * Note that only {@link Ext.Version#getMajor major component} and {@link Ext.Version#getShortVersion simplified}
     * value of the version are available via direct property checking. Supported values are:
     *
     * - iOS
     * - iPad
     * - iPhone
     * - iPhone5 (also true for 4in iPods).
     * - iPod
     * - Android
     * - WebOS
     * - BlackBerry
     * - Bada
     * - MacOS
     * - Windows
     * - Linux
     * - Other
     * @param {String} value The OS name to check.
     * @return {Boolean}
     */
    is: Ext.emptyFn,

    /**
     * @property {String} [name=null]
     * @readonly
     * The full name of the current operating system. Possible values are:
     *
     * - iOS
     * - Android
     * - WebOS
     * - BlackBerry,
     * - MacOS
     * - Windows
     * - Linux
     * - Other
     */
    name: null,

    /**
     * @property {Ext.Version} [version=null]
     * Refer to {@link Ext.Version}
     * @readonly
     */
    version: null,

    setFlag: function(name, value) {
        if (typeof value == 'undefined') {
            value = true;
        }

        this.is[name] = value;
        this.is[name.toLowerCase()] = value;

        return this;
    },

    constructor: function(userAgent, platform) {
        var statics = this.statics(),
            names = statics.names,
            prefixes = statics.prefixes,
            name,
            version = '',
            i, prefix, match, item, is;

        is = this.is = function(name) {
            return this.is[name] === true;
        };

        for (i in prefixes) {
            if (prefixes.hasOwnProperty(i)) {
                prefix = prefixes[i];

                match = userAgent.match(new RegExp('(?:'+prefix+')([^\\s;]+)'));

                if (match) {
                    name = names[i];

                    // This is here because some HTC android devices show an OSX Snow Leopard userAgent by default.
                    // And the Kindle Fire doesn't have any indicator of Android as the OS in its User Agent
                    if (match[1] && (match[1] == "HTC_" || match[1] == "Silk/")) {
                        version = new Ext.Version("2.3");
                    } else {
                        version = new Ext.Version(match[match.length - 1]);
                    }

                    break;
                }
            }
        }

        if (!name) {
            name = names[(userAgent.toLowerCase().match(/mac|win|linux/) || ['other'])[0]];
            version = new Ext.Version('');
        }

        this.name = name;
        this.version = version;

        if (platform) {
            this.setFlag(platform.replace(/ simulator$/i, ''));
        }

        this.setFlag(name);

        if (version) {
            this.setFlag(name + (version.getMajor() || ''));
            this.setFlag(name + version.getShortVersion());
        }

        for (i in names) {
            if (names.hasOwnProperty(i)) {
                item = names[i];

                if (!is.hasOwnProperty(name)) {
                    this.setFlag(item, (name === item));
                }
            }
        }

        // Detect if the device is the iPhone 5.
        if (this.name == "iOS" && window.screen.height == 568) {
            this.setFlag('iPhone5');
        }

        return this;
    }

}, function() {

    var navigation = Ext.global.navigator,
        userAgent = navigation.userAgent,
        osEnv, osName, deviceType;


    /**
     * @class Ext.os
     * @extends Ext.env.OS
     * @singleton
     * Provides useful information about the current operating system environment.
     *
     * Example:
     *
     *     if (Ext.os.is.Windows) {
     *         // Windows specific code here
     *     }
     *
     *     if (Ext.os.is.iOS) {
     *         // iPad, iPod, iPhone, etc.
     *     }
     *
     *     console.log("Version " + Ext.os.version);
     *
     * For a full list of supported values, refer to the {@link #is} property/method.
     *
     * @aside guide environment_package
     */
    Ext.os = osEnv = new this(userAgent, navigation.platform);

    osName = osEnv.name;

    var search = window.location.search.match(/deviceType=(Tablet|Phone)/),
        nativeDeviceType = window.deviceType;

    // Override deviceType by adding a get variable of deviceType. NEEDED FOR DOCS APP.
    // E.g: example/kitchen-sink.html?deviceType=Phone
    if (search && search[1]) {
        deviceType = search[1];
    }
    else if (nativeDeviceType === 'iPhone') {
        deviceType = 'Phone';
    }
    else if (nativeDeviceType === 'iPad') {
        deviceType = 'Tablet';
    }
    else {
        if (!osEnv.is.Android && !osEnv.is.iOS && /Windows|Linux|MacOS/.test(osName)) {
            deviceType = 'Desktop';

            // always set it to false when you are on a desktop
            Ext.browser.is.WebView = false;
        }
        else if (osEnv.is.iPad || osEnv.is.Android3 || (osEnv.is.Android4 && userAgent.search(/mobile/i) == -1)) {
            deviceType = 'Tablet';
        }
        else {
            deviceType = 'Phone';
        }
    }

    /**
     * @property {String} deviceType
     * The generic type of the current device.
     *
     * Possible values:
     *
     * - Phone
     * - Tablet
     * - Desktop
     *
     * For testing purposes the deviceType can be overridden by adding
     * a deviceType parameter to the URL of the page, like so:
     *
     *     http://localhost/mypage.html?deviceType=Tablet
     *
     */
    osEnv.setFlag(deviceType, true);
    osEnv.deviceType = deviceType;


    /**
     * @class Ext.is
     * Used to detect if the current browser supports a certain feature, and the type of the current browser.
     * @deprecated 2.0.0
     * Please refer to the {@link Ext.browser}, {@link Ext.os} and {@link Ext.feature} classes instead.
     */
});

//@tag dom,core

/**
 * Provides information about browser.
 * 
 * Should not be manually instantiated unless for unit-testing.
 * Access the global instance stored in {@link Ext.browser} instead.
 * @private
 */
Ext.define('Ext.env.Feature', {

    requires: ['Ext.env.Browser', 'Ext.env.OS'],

    constructor: function() {
        this.testElements = {};

        this.has = function(name) {
            return !!this.has[name];
        };

        return this;
    },

    getTestElement: function(tag, createNew) {
        if (tag === undefined) {
            tag = 'div';
        }
        else if (typeof tag !== 'string') {
            return tag;
        }

        if (createNew) {
            return document.createElement(tag);
        }

        if (!this.testElements[tag]) {
            this.testElements[tag] = document.createElement(tag);
        }

        return this.testElements[tag];
    },

    isStyleSupported: function(name, tag) {
        var elementStyle = this.getTestElement(tag).style,
            cName = Ext.String.capitalize(name);

        if (typeof elementStyle[name] !== 'undefined'
            || typeof elementStyle[Ext.browser.getStylePrefix(name) + cName] !== 'undefined') {
            return true;
        }

        return false;
    },

    isEventSupported: function(name, tag) {
        if (tag === undefined) {
            tag = window;
        }

        var element = this.getTestElement(tag),
            eventName = 'on' + name.toLowerCase(),
            isSupported = (eventName in element);

        if (!isSupported) {
            if (element.setAttribute && element.removeAttribute) {
                element.setAttribute(eventName, '');
                isSupported = typeof element[eventName] === 'function';

                if (typeof element[eventName] !== 'undefined') {
                    element[eventName] = undefined;
                }

                element.removeAttribute(eventName);
            }
        }

        return isSupported;
    },

    getSupportedPropertyName: function(object, name) {
        var vendorName = Ext.browser.getVendorProperyName(name);

        if (vendorName in object) {
            return vendorName;
        }
        else if (name in object) {
            return name;
        }

        return null;
    },

    registerTest: Ext.Function.flexSetter(function(name, fn) {
        this.has[name] = fn.call(this);

        return this;
    })

}, function() {

    /**
     * @class Ext.feature
     * @extend Ext.env.Feature
     * @singleton
     *
     * A simple class to verify if a browser feature exists or not on the current device.
     *
     *     if (Ext.feature.has.Canvas) {
     *         // do some cool things with canvas here
     *     }
     *
     * See the {@link #has} property/method for details of the features that can be detected.
     * 
     * @aside guide environment_package
     */
    Ext.feature = new this;

    var has = Ext.feature.has;

    /**
     * @method has
     * @member Ext.feature
     * Verifies if a browser feature exists or not on the current device.
     * 
     * A "hybrid" property, can be either accessed as a method call, i.e:
     *
     *     if (Ext.feature.has('Canvas')) {
     *         // ...
     *     }
     *
     * or as an object with boolean properties, i.e:
     *
     *     if (Ext.feature.has.Canvas) {
     *         // ...
     *     }
     * 
     * Possible properties/parameter values:
     *
     * - Canvas
     * - Svg
     * - Vml
     * - Touch - supports touch events (`touchstart`).
     * - Orientation - supports different orientations.
     * - OrientationChange - supports the `orientationchange` event.
     * - DeviceMotion - supports the `devicemotion` event.
     * - Geolocation
     * - SqlDatabase
     * - WebSockets
     * - Range - supports [DOM document fragments.][1]
     * - CreateContextualFragment - supports HTML fragment parsing using [range.createContextualFragment()][2].
     * - History - supports history management with [history.pushState()][3].
     * - CssTransforms
     * - Css3dTransforms
     * - CssAnimations
     * - CssTransitions
     * - Audio - supports the `<audio>` tag.
     * - Video - supports the `<video>` tag.
     * - ClassList - supports the HTML5 classList API.
     * - LocalStorage - LocalStorage is supported and can be written to.
     * 
     * [1]: https://developer.mozilla.org/en/DOM/range
     * [2]: https://developer.mozilla.org/en/DOM/range.createContextualFragment
     * [3]: https://developer.mozilla.org/en/DOM/Manipulating_the_browser_history#The_pushState().C2.A0method
     *
     * @param {String} value The feature name to check.
     * @return {Boolean}
     */
    Ext.feature.registerTest({
        Canvas: function() {
            var element = this.getTestElement('canvas');
            return !!(element && element.getContext && element.getContext('2d'));
        },

        Svg: function() {
            var doc = document;

            return !!(doc.createElementNS && !!doc.createElementNS("http:/" + "/www.w3.org/2000/svg", "svg").createSVGRect);
        },

        Vml: function() {
            var element = this.getTestElement(),
                ret = false;

            element.innerHTML = "<!--[if vml]><br><![endif]-->";
            ret = (element.childNodes.length === 1);
            element.innerHTML = "";

            return ret;
        },

        Touch: function() {
            return this.isEventSupported('touchstart') && !(Ext.os && Ext.os.name.match(/Windows|MacOS|Linux/) && !Ext.os.is.BlackBerry6);
        },

        Orientation: function() {
            return ('orientation' in window) && this.isEventSupported('orientationchange');
        },

        OrientationChange: function() {
            return this.isEventSupported('orientationchange');
        },

        DeviceMotion: function() {
            return this.isEventSupported('devicemotion');
        },

        Geolocation: function() {
            return 'geolocation' in window.navigator;
        },

        SqlDatabase: function() {
            return 'openDatabase' in window;
        },

        WebSockets: function() {
            return 'WebSocket' in window;
        },

        Range: function() {
            return !!document.createRange;
        },

        CreateContextualFragment: function() {
            var range = !!document.createRange ? document.createRange() : false;
            return range && !!range.createContextualFragment;
        },

        History: function() {
            return ('history' in window && 'pushState' in window.history);
        },

        CssTransforms: function() {
            return this.isStyleSupported('transform');
        },

        Css3dTransforms: function() {
            // See https://sencha.jira.com/browse/TOUCH-1544
            return this.has('CssTransforms') && this.isStyleSupported('perspective') && !Ext.os.is.Android2;
        },

        CssAnimations: function() {
            return this.isStyleSupported('animationName');
        },

        CssTransitions: function() {
            return this.isStyleSupported('transitionProperty');
        },

        Audio: function() {
            return !!this.getTestElement('audio').canPlayType;
        },

        Video: function() {
            return !!this.getTestElement('video').canPlayType;
        },

        ClassList: function() {
            return "classList" in this.getTestElement();
        },

        LocalStorage : function() {
            var supported = false;

            try {
                if ('localStorage' in window && window['localStorage'] !== null) {
                    //this should throw an error in private browsing mode in iOS
                    localStorage.setItem('sencha-localstorage-test', 'test success');
                    //clean up if setItem worked
                    localStorage.removeItem('sencha-localstorage-test');
                    supported = true;
                }
            } catch ( e ) {}

            return supported;
        }
    });

});

//@tag dom,core
//@define Ext.DomQuery
//@define Ext.core.DomQuery
//@require Ext.env.Feature

/**
 * @class Ext.DomQuery
 * @alternateClassName Ext.dom.Query
 *
 * Provides functionality to select elements on the page based on a CSS selector. Delegates to
 * document.querySelectorAll. More information can be found at
 * [http://www.w3.org/TR/css3-selectors/](http://www.w3.org/TR/css3-selectors/)
 *
 * All selectors, attribute filters and pseudos below can be combined infinitely in any order. For example
 * `div.foo:nth-child(odd)[@foo=bar].bar:first` would be a perfectly valid selector.
 *
 * ## Element Selectors:
 *
 * * \* any element
 * * E an element with the tag E
 * * E F All descendant elements of E that have the tag F
 * * E > F or E/F all direct children elements of E that have the tag F
 * * E + F all elements with the tag F that are immediately preceded by an element with the tag E
 * * E ~ F all elements with the tag F that are preceded by a sibling element with the tag E
 *
 * ## Attribute Selectors:
 *
 * The use of @ and quotes are optional. For example, div[@foo='bar'] is also a valid attribute selector.
 *
 * * E[foo] has an attribute "foo"
 * * E[foo=bar] has an attribute "foo" that equals "bar"
 * * E[foo^=bar] has an attribute "foo" that starts with "bar"
 * * E[foo$=bar] has an attribute "foo" that ends with "bar"
 * * E[foo*=bar] has an attribute "foo" that contains the substring "bar"
 * * E[foo%=2] has an attribute "foo" that is evenly divisible by 2
 * * E[foo!=bar] has an attribute "foo" that does not equal "bar"
 *
 * ## Pseudo Classes:
 *
 * * E:first-child E is the first child of its parent
 * * E:last-child E is the last child of its parent
 * * E:nth-child(n) E is the nth child of its parent (1 based as per the spec)
 * * E:nth-child(odd) E is an odd child of its parent
 * * E:nth-child(even) E is an even child of its parent
 * * E:only-child E is the only child of its parent
 * * E:checked E is an element that is has a checked attribute that is true (e.g. a radio or checkbox)
 * * E:first the first E in the resultset
 * * E:last the last E in the resultset
 * * E:nth(n) the nth E in the resultset (1 based)
 * * E:odd shortcut for :nth-child(odd)
 * * E:even shortcut for :nth-child(even)
 * * E:not(S) an E element that does not match simple selector S
 * * E:has(S) an E element that has a descendant that matches simple selector S
 * * E:next(S) an E element whose next sibling matches simple selector S
 * * E:prev(S) an E element whose previous sibling matches simple selector S
 * * E:any(S1|S2|S2) an E element which matches any of the simple selectors S1, S2 or S3//\\
 *
 * ## CSS Value Selectors:
 *
 * * E{display=none} CSS value "display" that equals "none"
 * * E{display^=none} CSS value "display" that starts with "none"
 * * E{display$=none} CSS value "display" that ends with "none"
 * * E{display*=none} CSS value "display" that contains the substring "none"
 * * E{display%=2} CSS value "display" that is evenly divisible by 2
 * * E{display!=none} CSS value "display" that does not equal "none"
 */
Ext.define('Ext.dom.Query', {
    /**
     * Selects a group of elements.
     * @param {String} selector The selector/xpath query (can be a comma separated list of selectors)
     * @param {HTMLElement/String} [root] The start of the query (defaults to document).
     * @return {HTMLElement[]} An Array of DOM elements which match the selector. If there are
     * no matches, and empty Array is returned.
     */
    select: function(q, root) {
        var results = [],
            nodes,
            i,
            j,
            qlen,
            nlen;

        root = root || document;

        if (typeof root == 'string') {
            root = document.getElementById(root);
        }

        q = q.split(",");

        for (i = 0,qlen = q.length; i < qlen; i++) {
            if (typeof q[i] == 'string') {

                //support for node attribute selection
                if (q[i][0] == '@') {
                    nodes = root.getAttributeNode(q[i].substring(1));
                    results.push(nodes);
                }
                else {
                    nodes = root.querySelectorAll(q[i]);

                    for (j = 0,nlen = nodes.length; j < nlen; j++) {
                        results.push(nodes[j]);
                    }
                }
            }
        }

        return results;
    },

    /**
     * Selects a single element.
     * @param {String} selector The selector/xpath query
     * @param {HTMLElement/String} [root] The start of the query (defaults to document).
     * @return {HTMLElement} The DOM element which matched the selector.
     */
    selectNode: function(q, root) {
        return this.select(q, root)[0];
    },

    /**
     * Returns true if the passed element(s) match the passed simple selector (e.g. div.some-class or span:first-child)
     * @param {String/HTMLElement/Array} el An element id, element or array of elements
     * @param {String} selector The simple selector to test
     * @return {Boolean}
     */
    is: function(el, q) {
        if (typeof el == "string") {
            el = document.getElementById(el);
        }
        return this.select(q).indexOf(el) !== -1;
    },

    isXml: function(el) {
        var docEl = (el ? el.ownerDocument || el : 0).documentElement;
        return docEl ? docEl.nodeName !== "HTML" : false;
    }

}, function() {
    Ext.ns('Ext.core');
    Ext.core.DomQuery = Ext.DomQuery = new this();
    Ext.query = Ext.Function.alias(Ext.DomQuery, 'select');
});

//@tag dom,core
//@define Ext.DomHelper
//@require Ext.dom.Query

/**
 * @class Ext.DomHelper
 * @alternateClassName Ext.dom.Helper
 *
 * The DomHelper class provides a layer of abstraction from DOM and transparently supports creating elements via DOM or
 * using HTML fragments. It also has the ability to create HTML fragment templates from your DOM building code.
 *
 * ## DomHelper element specification object
 *
 * A specification object is used when creating elements. Attributes of this object are assumed to be element
 * attributes, except for 4 special attributes:
 *
 * * **tag**: The tag name of the element
 * * **children (or cn)**: An array of the same kind of element definition objects to be created and appended. These
 * can be nested as deep as you want.
 * * **cls**: The class attribute of the element. This will end up being either the "class" attribute on a HTML
 * fragment or className for a DOM node, depending on whether DomHelper is using fragments or DOM.
 * * **html**: The innerHTML for the element
 *
 * ## Insertion methods
 *
 * Commonly used insertion methods:
 *
 * * {@link #append}
 * * {@link #insertBefore}
 * * {@link #insertAfter}
 * * {@link #overwrite}
 * * {@link #insertHtml}
 *
 * ## Example
 *
 * This is an example, where an unordered list with 3 children items is appended to an existing element with id
 * 'my-div':
 *
 *     var dh = Ext.DomHelper; // create shorthand alias
 *     // specification object
 *     var spec = {
 *         id: 'my-ul',
 *         tag: 'ul',
 *         cls: 'my-list',
 *         // append children after creating
 *         children: [     // may also specify 'cn' instead of 'children'
 *             {tag: 'li', id: 'item0', html: 'List Item 0'},
 *             {tag: 'li', id: 'item1', html: 'List Item 1'},
 *             {tag: 'li', id: 'item2', html: 'List Item 2'}
 *         ]
 *     };
 *     var list = dh.append(
 *         'my-div', // the context element 'my-div' can either be the id or the actual node
 *         spec      // the specification object
 *     );
 *
 * Element creation specification parameters in this class may also be passed as an Array of specification objects.
 * This can be used to insert multiple sibling nodes into an existing container very efficiently. For example, to add
 * more list items to the example above:
 *
 *     dh.append('my-ul', [
 *         {tag: 'li', id: 'item3', html: 'List Item 3'},
 *         {tag: 'li', id: 'item4', html: 'List Item 4'}
 *     ]);
 *
 * ## Templating
 *
 * The real power is in the built-in templating. Instead of creating or appending any elements, createTemplate returns
 * a Template object which can be used over and over to insert new elements. Revisiting the example above, we could
 * utilize templating this time:
 *
 *     // create the node
 *     var list = dh.append('my-div', {tag: 'ul', cls: 'my-list'});
 *     // get template
 *     var tpl = dh.createTemplate({tag: 'li', id: 'item{0}', html: 'List Item {0}'});
 *
 *     for(var i = 0; i < 5; i++){
 *         tpl.append(list, i); // use template to append to the actual node
 *     }
 *
 * An example using a template:
 *
 *     var html = '"{0}" href="{1}" class="nav">{2}';
 *
 *     var tpl = new Ext.DomHelper.createTemplate(html);
 *     tpl.append('blog-roll', ['link1', 'http://www.tommymaintz.com/', "Tommy's Site"]);
 *     tpl.append('blog-roll', ['link2', 'http://www.avins.org/', "Jamie's Site"]);
 *
 * The same example using named parameters:
 *
 *     var html = '"{id}" href="{url}" class="nav">{text}';
 *
 *     var tpl = new Ext.DomHelper.createTemplate(html);
 *     tpl.append('blog-roll', {
 *         id: 'link1',
 *         url: 'http://www.tommymaintz.com/',
 *         text: "Tommy's Site"
 *     });
 *     tpl.append('blog-roll', {
 *         id: 'link2',
 *         url: 'http://www.avins.org/',
 *         text: "Jamie's Site"
 *     });
 *
 * ## Compiling Templates
 *
 * Templates are applied using regular expressions. The performance is great, but if you are adding a bunch of DOM
 * elements using the same template, you can increase performance even further by "compiling" the template. The way
 * "compile()" works is the template is parsed and broken up at the different variable points and a dynamic function is
 * created and eval'ed. The generated function performs string concatenation of these parts and the passed variables
 * instead of using regular expressions.
 *
 *     var html = '"{id}" href="{url}" class="nav">{text}';
 *
 *     var tpl = new Ext.DomHelper.createTemplate(html);
 *     tpl.compile();
 *
 *     // ... use template like normal
 *
 * ## Performance Boost
 *
 * DomHelper will transparently create HTML fragments when it can. Using HTML fragments instead of DOM can
 * significantly boost performance.
 *
 * Element creation specification parameters may also be strings. If useDom is false, then the string is used as
 * innerHTML. If useDom is true, a string specification results in the creation of a text node. Usage:
 *
 *     Ext.DomHelper.useDom = true; // force it to use DOM; reduces performance
 *
 */
Ext.define('Ext.dom.Helper', {
    emptyTags : /^(?:br|frame|hr|img|input|link|meta|range|spacer|wbr|area|param|col)$/i,
    confRe : /tag|children|cn|html|tpl|tplData$/i,
    endRe : /end/i,

    attribXlat: { cls : 'class', htmlFor : 'for' },

    closeTags: {},

    decamelizeName : function () {
        var camelCaseRe = /([a-z])([A-Z])/g,
            cache = {};

        function decamel (match, p1, p2) {
            return p1 + '-' + p2.toLowerCase();
        }

        return function (s) {
            return cache[s] || (cache[s] = s.replace(camelCaseRe, decamel));
        };
    }(),

    generateMarkup: function(spec, buffer) {
        var me = this,
            attr, val, tag, i, closeTags;

        if (typeof spec == "string") {
            buffer.push(spec);
        } else if (Ext.isArray(spec)) {
            for (i = 0; i < spec.length; i++) {
                if (spec[i]) {
                    me.generateMarkup(spec[i], buffer);
                }
            }
        } else {
            tag = spec.tag || 'div';
            buffer.push('<', tag);

            for (attr in spec) {
                if (spec.hasOwnProperty(attr)) {
                    val = spec[attr];
                    if (!me.confRe.test(attr)) {
                        if (typeof val == "object") {
                            buffer.push(' ', attr, '="');
                            me.generateStyles(val, buffer).push('"');
                        } else {
                            buffer.push(' ', me.attribXlat[attr] || attr, '="', val, '"');
                        }
                    }
                }
            }

            // Now either just close the tag or try to add children and close the tag.
            if (me.emptyTags.test(tag)) {
                buffer.push('/>');
            } else {
                buffer.push('>');

                // Apply the tpl html, and cn specifications
                if ((val = spec.tpl)) {
                    val.applyOut(spec.tplData, buffer);
                }
                if ((val = spec.html)) {
                    buffer.push(val);
                }
                if ((val = spec.cn || spec.children)) {
                    me.generateMarkup(val, buffer);
                }

                // we generate a lot of close tags, so cache them rather than push 3 parts
                closeTags = me.closeTags;
                buffer.push(closeTags[tag] || (closeTags[tag] = '</' + tag + '>'));
            }
        }

        return buffer;
    },

    /**
     * Converts the styles from the given object to text. The styles are CSS style names
     * with their associated value.
     *
     * The basic form of this method returns a string:
     *
     *      var s = Ext.DomHelper.generateStyles({
     *          backgroundColor: 'red'
     *      });
     *
     *      // s = 'background-color:red;'
     *
     * Alternatively, this method can append to an output array.
     *
     *      var buf = [];
     *
     *      // ...
     *
     *      Ext.DomHelper.generateStyles({
     *          backgroundColor: 'red'
     *      }, buf);
     *
     * In this case, the style text is pushed on to the array and the array is returned.
     *
     * @param {Object} styles The object describing the styles.
     * @param {String[]} [buffer] The output buffer.
     * @return {String/String[]} If buffer is passed, it is returned. Otherwise the style
     * string is returned.
     */
    generateStyles: function (styles, buffer) {
        var a = buffer || [],
            name;

        for (name in styles) {
            if (styles.hasOwnProperty(name)) {
                a.push(this.decamelizeName(name), ':', styles[name], ';');
            }
        }

        return buffer || a.join('');
    },

    /**
     * Returns the markup for the passed Element(s) config.
     * @param {Object} spec The DOM object spec (and children).
     * @return {String}
     */
    markup: function(spec) {
        if (typeof spec == "string") {
            return spec;
        }

        var buf = this.generateMarkup(spec, []);
        return buf.join('');
    },

    /**
     * Applies a style specification to an element.
     * @param {String/HTMLElement} el The element to apply styles to
     * @param {String/Object/Function} styles A style specification string e.g. 'width:100px', or object in the form {width:'100px'}, or
     * a function which returns such a specification.
     */
    applyStyles: function(el, styles) {
        Ext.fly(el).applyStyles(styles);
    },

    /**
     * @private
     * Fix for browsers which no longer support createContextualFragment
     */
    createContextualFragment: function(html){
        var div = document.createElement("div"),
            fragment = document.createDocumentFragment(),
            i = 0,
            length, childNodes;

        div.innerHTML = html;
        childNodes = div.childNodes;
        length = childNodes.length;

        for (; i < length; i++) {
            fragment.appendChild(childNodes[i].cloneNode(true));
        }

        return fragment;
    },

    /**
     * Inserts an HTML fragment into the DOM.
     * @param {String} where Where to insert the html in relation to el - beforeBegin, afterBegin, beforeEnd, afterEnd.
     *
     * For example take the following HTML: `<div>Contents</div>`
     *
     * Using different `where` values inserts element to the following places:
     *
     * - beforeBegin: `<HERE><div>Contents</div>`
     * - afterBegin: `<div><HERE>Contents</div>`
     * - beforeEnd: `<div>Contents<HERE></div>`
     * - afterEnd: `<div>Contents</div><HERE>`
     *
     * @param {HTMLElement/TextNode} el The context element
     * @param {String} html The HTML fragment
     * @return {HTMLElement} The new node
     */
    insertHtml: function(where, el, html) {
        var setStart, range, frag, rangeEl, isBeforeBegin, isAfterBegin;

        where = where.toLowerCase();

        if (Ext.isTextNode(el)) {
            if (where == 'afterbegin' ) {
                where = 'beforebegin';
            }
            else if (where == 'beforeend') {
                where = 'afterend';
            }
        }

        isBeforeBegin = where == 'beforebegin';
        isAfterBegin = where == 'afterbegin';

        range = Ext.feature.has.CreateContextualFragment ? el.ownerDocument.createRange() : undefined;
        setStart = 'setStart' + (this.endRe.test(where) ? 'After' : 'Before');

        if (isBeforeBegin || where == 'afterend') {
            if (range) {
                range[setStart](el);
                frag = range.createContextualFragment(html);
            }
            else {
                frag = this.createContextualFragment(html);
            }
            el.parentNode.insertBefore(frag, isBeforeBegin ? el : el.nextSibling);
            return el[(isBeforeBegin ? 'previous' : 'next') + 'Sibling'];
        }
        else {
            rangeEl = (isAfterBegin ? 'first' : 'last') + 'Child';
            if (el.firstChild) {
                if (range) {
                    range[setStart](el[rangeEl]);
                    frag = range.createContextualFragment(html);
                } else {
                    frag = this.createContextualFragment(html);
                }

                if (isAfterBegin) {
                    el.insertBefore(frag, el.firstChild);
                } else {
                    el.appendChild(frag);
                }
            } else {
                el.innerHTML = html;
            }
            return el[rangeEl];
        }
    },

    /**
     * Creates new DOM element(s) and inserts them before el.
     * @param {String/HTMLElement/Ext.Element} el The context element
     * @param {Object/String} o The DOM object spec (and children) or raw HTML blob
     * @param {Boolean} [returnElement] true to return a Ext.Element
     * @return {HTMLElement/Ext.Element} The new node
     */
    insertBefore: function(el, o, returnElement) {
        return this.doInsert(el, o, returnElement, 'beforebegin');
    },

    /**
     * Creates new DOM element(s) and inserts them after el.
     * @param {String/HTMLElement/Ext.Element} el The context element
     * @param {Object} o The DOM object spec (and children)
     * @param {Boolean} [returnElement] true to return a Ext.Element
     * @return {HTMLElement/Ext.Element} The new node
     */
    insertAfter: function(el, o, returnElement) {
        return this.doInsert(el, o, returnElement, 'afterend');
    },

    /**
     * Creates new DOM element(s) and inserts them as the first child of el.
     * @param {String/HTMLElement/Ext.Element} el The context element
     * @param {Object/String} o The DOM object spec (and children) or raw HTML blob
     * @param {Boolean} [returnElement] true to return a Ext.Element
     * @return {HTMLElement/Ext.Element} The new node
     */
    insertFirst: function(el, o, returnElement) {
        return this.doInsert(el, o, returnElement, 'afterbegin');
    },

    /**
     * Creates new DOM element(s) and appends them to el.
     * @param {String/HTMLElement/Ext.Element} el The context element
     * @param {Object/String} o The DOM object spec (and children) or raw HTML blob
     * @param {Boolean} [returnElement] true to return a Ext.Element
     * @return {HTMLElement/Ext.Element} The new node
     */
    append: function(el, o, returnElement) {
        return this.doInsert(el, o, returnElement, 'beforeend');
    },

    /**
     * Creates new DOM element(s) and overwrites the contents of el with them.
     * @param {String/HTMLElement/Ext.Element} el The context element
     * @param {Object/String} o The DOM object spec (and children) or raw HTML blob
     * @param {Boolean} [returnElement] true to return a Ext.Element
     * @return {HTMLElement/Ext.Element} The new node
     */
    overwrite: function(el, o, returnElement) {
        el = Ext.getDom(el);
        el.innerHTML = this.markup(o);
        return returnElement ? Ext.get(el.firstChild) : el.firstChild;
    },

    doInsert: function(el, o, returnElement, pos) {
        var newNode = this.insertHtml(pos, Ext.getDom(el), this.markup(o));
        return returnElement ? Ext.get(newNode, true) : newNode;
    },

    /**
     * Creates a new Ext.Template from the DOM object spec.
     * @param {Object} o The DOM object spec (and children)
     * @return {Ext.Template} The new template
     */
    createTemplate: function(o) {
        var html = this.markup(o);
        return new Ext.Template(html);
    }
}, function() {
    Ext.ns('Ext.core');
    Ext.core.DomHelper = Ext.DomHelper = new this;
});

//@tag dom,core
//@require Ext.dom.Helper

/**
 * An Identifiable mixin.
 * @private
 */
Ext.define('Ext.mixin.Identifiable', {
    statics: {
        uniqueIds: {}
    },

    isIdentifiable: true,

    mixinId: 'identifiable',

    idCleanRegex: /\.|[^\w\-]/g,

    defaultIdPrefix: 'ext-',

    defaultIdSeparator: '-',

    getOptimizedId: function() {
        return this.id;
    },

    getUniqueId: function() {
        var id = this.id,
            prototype, separator, xtype, uniqueIds, prefix;

        if (!id) {
            prototype = this.self.prototype;
            separator = this.defaultIdSeparator;

            uniqueIds = Ext.mixin.Identifiable.uniqueIds;

            if (!prototype.hasOwnProperty('identifiablePrefix')) {
                xtype = this.xtype;

                if (xtype) {
                    prefix = this.defaultIdPrefix + xtype + separator;
                }
                else {
                    prefix = prototype.$className.replace(this.idCleanRegex, separator).toLowerCase() + separator;
                }

                prototype.identifiablePrefix = prefix;
            }

            prefix = this.identifiablePrefix;

            if (!uniqueIds.hasOwnProperty(prefix)) {
                uniqueIds[prefix] = 0;
            }

            id = this.id = prefix + (++uniqueIds[prefix]);
        }

        this.getUniqueId = this.getOptimizedId;

        return id;
    },

    setId: function(id) {
        this.id = id;
    },

    /**
     * Retrieves the id of this component. Will autogenerate an id if one has not already been set.
     * @return {String} id
     */
    getId: function() {
        var id = this.id;

        if (!id) {
            id = this.getUniqueId();
        }

        this.getId = this.getOptimizedId;

        return id;
    }
});

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


});

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


//@tag dom,core
//@define Ext.Element-all
//@define Ext.Element-alignment
//@require Ext.Element-static

/**
 * @class Ext.dom.Element
 */

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

//@tag dom,core
//@define Ext.Element-all
//@define Ext.Element-position
//@require Ext.Element-insertion

/**
 * @class Ext.dom.Element
 */
Ext.dom.Element.override({

    /**
     * Gets the current X position of the element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (`display:none` or elements not appended return `false`).
     * @return {Number} The X position of the element
     */
    getX: function(el) {
        return this.getXY(el)[0];
    },

    /**
     * Gets the current Y position of the element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (`display:none` or elements not appended return `false`).
     * @return {Number} The Y position of the element
     */
    getY: function(el) {
        return this.getXY(el)[1];
    },

    /**
     * Gets the current position of the element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (`display:none` or elements not appended return `false`).
     * @return {Array} The XY position of the element
     */

    getXY: function() {
        var rect = this.dom.getBoundingClientRect(),
            round = Math.round;

        return [round(rect.left + window.pageXOffset), round(rect.top + window.pageYOffset)];
    },

    /**
     * Returns the offsets of this element from the passed element. Both element must be part of the DOM tree
     * and not have `display:none` to have page coordinates.
     * @param {Mixed} element The element to get the offsets from.
     * @return {Array} The XY page offsets (e.g. [100, -200])
     */
    getOffsetsTo: function(el) {
        var o = this.getXY(),
            e = Ext.fly(el, '_internal').getXY();
        return [o[0] - e[0], o[1] - e[1]];
    },

    /**
     * Sets the X position of the element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (`display:none` or elements not appended return `false`).
     * @param {Number} The X position of the element
     * @param {Boolean/Object} animate (optional) `true` for the default animation, or a standard Element animation config object.
     * @return {Ext.dom.Element} this
     */
    setX: function(x) {
        return this.setXY([x, this.getY()]);
    },

    /**
     * Sets the Y position of the element based on page coordinates.  Element must be part of the DOM tree to have page coordinates (`display:none` or elements not appended return `false`).
     * @param {Number} The Y position of the element.
     * @param {Boolean/Object} animate (optional) `true` for the default animation, or a standard Element animation config object.
     * @return {Ext.dom.Element} this
     */
    setY: function(y) {
        return this.setXY([this.getX(), y]);
    },

    /**
     * Sets the position of the element in page coordinates, regardless of how the element is positioned.
     * The element must be part of the DOM tree to have page coordinates (`display:none` or elements not appended return `false`).
     * @param {Array} pos Contains X & Y [x, y] values for new position (coordinates are page-based).
     * @param {Boolean/Object} animate (optional) `true` for the default animation, or a standard Element animation config object.
     * @return {Ext.dom.Element} this
     */
    setXY: function(pos) {
        var me = this;

        if (arguments.length > 1) {
            pos = [pos, arguments[1]];
        }

        // me.position();
        var pts = me.translatePoints(pos),
            style = me.dom.style;

        for (pos in pts) {
            if (!pts.hasOwnProperty(pos)) {
                continue;
            }
            if (!isNaN(pts[pos])) style[pos] = pts[pos] + "px";
        }
        return me;
    },

    /**
     * Gets the left X coordinate.
     * @return {Number}
     */
    getLeft: function() {
        return parseInt(this.getStyle('left'), 10) || 0;
    },

    /**
     * Gets the right X coordinate of the element (element X position + element width).
     * @return {Number}
     */
    getRight: function() {
        return parseInt(this.getStyle('right'), 10) || 0;
    },

    /**
     * Gets the top Y coordinate.
     * @return {Number}
     */
    getTop: function() {
        return parseInt(this.getStyle('top'), 10) || 0;
    },

    /**
     * Gets the bottom Y coordinate of the element (element Y position + element height).
     * @return {Number}
     */
    getBottom: function() {
        return parseInt(this.getStyle('bottom'), 10) || 0;
    },

    /**
     * Translates the passed page coordinates into left/top CSS values for this element.
     * @param {Number/Array} x The page `x` or an array containing [x, y].
     * @param {Number} y (optional) The page `y`, required if `x` is not an array.
     * @return {Object} An object with `left` and `top` properties. e.g. `{left: (value), top: (value)}`.
     */
    translatePoints: function(x, y) {
        y = isNaN(x[1]) ? y : x[1];
        x = isNaN(x[0]) ? x : x[0];

        var me = this,
            relative = me.isStyle('position', 'relative'),
            o = me.getXY(),
            l = parseInt(me.getStyle('left'), 10),
            t = parseInt(me.getStyle('top'), 10);

        l = !isNaN(l) ? l : (relative ? 0 : me.dom.offsetLeft);
        t = !isNaN(t) ? t : (relative ? 0 : me.dom.offsetTop);

        return {left: (x - o[0] + l), top: (y - o[1] + t)};
    },

    /**
     * Sets the element's box. Use {@link #getBox} on another element to get a box object.
     * @param {Object} box The box to fill, for example:
     *
     *     {
     *         left: ...,
     *         top: ...,
     *         width: ...,
     *         height: ...
     *     }
     *
     * @return {Ext.dom.Element} this
     */
    setBox: function(box) {
        var me = this,
            width = box.width,
            height = box.height,
            top = box.top,
            left = box.left;

        if (left !== undefined) {
            me.setLeft(left);
        }
        if (top !== undefined) {
            me.setTop(top);
        }
        if (width !== undefined) {
            me.setWidth(width);
        }
        if (height !== undefined) {
            me.setHeight(height);
        }

        return this;
    },

    /**
     * Return an object defining the area of this Element which can be passed to {@link #setBox} to
     * set another Element's size/location to match this element.
     *
     * The returned object may also be addressed as an Array where index 0 contains the X position
     * and index 1 contains the Y position. So the result may also be used for {@link #setXY}.
     *
     * @param {Boolean} contentBox (optional) If `true` a box for the content of the element is returned.
     * @param {Boolean} local (optional) If `true` the element's left and top are returned instead of page x/y.
     * @return {Object} An object in the format
     * @return {Number} return.x The element's X position.
     * @return {Number} return.y The element's Y position.
     * @return {Number} return.width The element's width.
     * @return {Number} return.height The element's height.
     * @return {Number} return.bottom The element's lower bound.
     * @return {Number} return.right The element's rightmost bound.
     */
    getBox: function(contentBox, local) {
        var me = this,
            dom = me.dom,
            width = dom.offsetWidth,
            height = dom.offsetHeight,
            xy, box, l, r, t, b;

        if (!local) {
            xy = me.getXY();
        }
        else if (contentBox) {
            xy = [0, 0];
        }
        else {
            xy = [parseInt(me.getStyle("left"), 10) || 0, parseInt(me.getStyle("top"), 10) || 0];
        }

        if (!contentBox) {
            box = {
                x: xy[0],
                y: xy[1],
                0: xy[0],
                1: xy[1],
                width: width,
                height: height
            };
        }
        else {
            l = me.getBorderWidth.call(me, "l") + me.getPadding.call(me, "l");
            r = me.getBorderWidth.call(me, "r") + me.getPadding.call(me, "r");
            t = me.getBorderWidth.call(me, "t") + me.getPadding.call(me, "t");
            b = me.getBorderWidth.call(me, "b") + me.getPadding.call(me, "b");
            box = {
                x: xy[0] + l,
                y: xy[1] + t,
                0: xy[0] + l,
                1: xy[1] + t,
                width: width - (l + r),
                height: height - (t + b)
            };
        }

        box.left = box.x;
        box.top = box.y;
        box.right = box.x + box.width;
        box.bottom = box.y + box.height;

        return box;
    },

    /**
     * Return an object defining the area of this Element which can be passed to {@link #setBox} to
     * set another Element's size/location to match this element.
     * @param {Boolean} asRegion (optional) If `true` an {@link Ext.util.Region} will be returned.
     * @return {Object} box An object in the format:
     *
     *     {
     *         x: <Element's X position>,
     *         y: <Element's Y position>,
     *         width: <Element's width>,
     *         height: <Element's height>,
     *         bottom: <Element's lower bound>,
     *         right: <Element's rightmost bound>
     *     }
     *
     * The returned object may also be addressed as an Array where index 0 contains the X position
     * and index 1 contains the Y position. So the result may also be used for {@link #setXY}.
     */
    getPageBox: function(getRegion) {
        var me = this,
            el = me.dom,
            w = el.offsetWidth,
            h = el.offsetHeight,
            xy = me.getXY(),
            t = xy[1],
            r = xy[0] + w,
            b = xy[1] + h,
            l = xy[0];

        if (!el) {
            return new Ext.util.Region();
        }

        if (getRegion) {
            return new Ext.util.Region(t, r, b, l);
        }
        else {
            return {
                left: l,
                top: t,
                width: w,
                height: h,
                right: r,
                bottom: b
            };
        }
    }
});

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

//@tag dom,core
//@require Ext.Element-all

/**
 * This class encapsulates a *collection* of DOM elements, providing methods to filter members, or to perform collective
 * actions upon the whole set.
 *
 * Although they are not listed, this class supports all of the methods of {@link Ext.dom.Element} and
 * {@link Ext.Anim}. The methods from these classes will be performed on all the elements in this collection.
 *
 * Example:
 *
 *     var els = Ext.select("#some-el div.some-class");
 *     // or select directly from an existing element
 *     var el = Ext.get('some-el');
 *     el.select('div.some-class');
 *
 *     els.setWidth(100); // all elements become 100 width
 *     els.hide(true); // all elements fade out and hide
 *     // or
 *     els.setWidth(100).hide(true);
 *
 * @mixins Ext.dom.Element
 */
Ext.define('Ext.dom.CompositeElementLite', {
    alternateClassName: ['Ext.CompositeElementLite', 'Ext.CompositeElement'],

    requires: ['Ext.dom.Element'],
    
    // We use the @mixins tag above to document that CompositeElement has
    // all the same methods as Element, but the @mixins tag also pulls in
    // configs and properties which we don't want, so hide them explicitly:
    /** @cfg bubbleEvents @hide */
    /** @cfg listeners @hide */
    /** @property DISPLAY @hide */
    /** @property OFFSETS @hide */
    /** @property VISIBILITY @hide */
    /** @property defaultUnit @hide */
    /** @property dom @hide */
    /** @property id @hide */
    // Also hide the static #get method that also gets inherited
    /** @method get @static @hide */

    statics: {
        /**
         * @private
         * @static
         * Copies all of the functions from Ext.dom.Element's prototype onto CompositeElementLite's prototype.
         */
        importElementMethods: function() {

        }
    },

    constructor: function(elements, root) {
        /**
         * @property {HTMLElement[]} elements
         * @readonly
         * The Array of DOM elements which this CompositeElement encapsulates.
         *
         * This will not *usually* be accessed in developers' code, but developers wishing to augment the capabilities
         * of the CompositeElementLite class may use it when adding methods to the class.
         *
         * For example to add the `nextAll` method to the class to **add** all following siblings of selected elements,
         * the code would be
         *
         *     Ext.override(Ext.dom.CompositeElementLite, {
         *         nextAll: function() {
         *             var elements = this.elements, i, l = elements.length, n, r = [], ri = -1;
         *
         *             // Loop through all elements in this Composite, accumulating
         *             // an Array of all siblings.
         *             for (i = 0; i < l; i++) {
         *                 for (n = elements[i].nextSibling; n; n = n.nextSibling) {
         *                     r[++ri] = n;
         *                 }
         *             }
         *
         *             // Add all found siblings to this Composite
         *             return this.add(r);
         *         }
         *     });
         */
        this.elements = [];
        this.add(elements, root);
        this.el = new Ext.dom.Element.Fly();
    },

    isComposite: true,

    // @private
    getElement: function(el) {
        // Set the shared flyweight dom property to the current element
        return this.el.attach(el).synchronize();
    },

    // @private
    transformElement: function(el) {
        return Ext.getDom(el);
    },

    /**
     * Returns the number of elements in this Composite.
     * @return {Number}
     */
    getCount: function() {
        return this.elements.length;
    },

    /**
     * Adds elements to this Composite object.
     * @param {HTMLElement[]/Ext.dom.CompositeElementLite} els Either an Array of DOM elements to add, or another Composite
     * object who's elements should be added.
     * @param {HTMLElement/String} [root] The root element of the query or id of the root.
     * @return {Ext.dom.CompositeElementLite} This Composite object.
     */
    add: function(els, root) {
        var elements = this.elements,
            i, ln;

        if (!els) {
            return this;
        }

        if (typeof els == "string") {
            els = Ext.dom.Element.selectorFunction(els, root);
        }
        else if (els.isComposite) {
            els = els.elements;
        }
        else if (!Ext.isIterable(els)) {
            els = [els];
        }

        for (i = 0, ln = els.length; i < ln; ++i) {
            elements.push(this.transformElement(els[i]));
        }

        return this;
    },

    invoke: function(fn, args) {
        var elements = this.elements,
            ln = elements.length,
            element,
            i;

        for (i = 0; i < ln; i++) {
            element = elements[i];

            if (element) {
                Ext.dom.Element.prototype[fn].apply(this.getElement(element), args);
            }
        }
        return this;
    },

    /**
     * Returns a flyweight Element of the dom element object at the specified index.
     * @param {Number} index
     * @return {Ext.dom.Element}
     */
    item: function(index) {
        var el = this.elements[index],
            out = null;

        if (el) {
            out = this.getElement(el);
        }

        return out;
    },

    // fixes scope with flyweight.
    addListener: function(eventName, handler, scope, opt) {
        var els = this.elements,
                len = els.length,
                i, e;

        for (i = 0; i < len; i++) {
            e = els[i];
            if (e) {
                e.on(eventName, handler, scope || e, opt);
            }
        }
        return this;
    },
    /**
     * Calls the passed function for each element in this composite.
     * @param {Function} fn The function to call.
     * @param {Ext.dom.Element} fn.el The current Element in the iteration. **This is the flyweight
     * (shared) Ext.dom.Element instance, so if you require a a reference to the dom node, use el.dom.**
     * @param {Ext.dom.CompositeElementLite} fn.c This Composite object.
     * @param {Number} fn.index The zero-based index in the iteration.
     * @param {Object} [scope] The scope (this reference) in which the function is executed.
     * Defaults to the Element.
     * @return {Ext.dom.CompositeElementLite} this
     */
    each: function(fn, scope) {
        var me = this,
                els = me.elements,
                len = els.length,
                i, e;

        for (i = 0; i < len; i++) {
            e = els[i];
            if (e) {
                e = this.getElement(e);
                if (fn.call(scope || e, e, me, i) === false) {
                    break;
                }
            }
        }
        return me;
    },

    /**
     * Clears this Composite and adds the elements passed.
     * @param {HTMLElement[]/Ext.dom.CompositeElementLite} els Either an array of DOM elements, or another Composite from which
     * to fill this Composite.
     * @return {Ext.dom.CompositeElementLite} this
     */
    fill: function(els) {
        var me = this;
        me.elements = [];
        me.add(els);
        return me;
    },

    /**
     * Filters this composite to only elements that match the passed selector.
     * @param {String/Function} selector A string CSS selector or a comparison function. The comparison function will be
     * called with the following arguments:
     * @param {Ext.dom.Element} selector.el The current DOM element.
     * @param {Number} selector.index The current index within the collection.
     * @return {Ext.dom.CompositeElementLite} this
     */
    filter: function(selector) {
        var els = [],
                me = this,
                fn = Ext.isFunction(selector) ? selector
                        : function(el) {
                    return el.is(selector);
                };

        me.each(function(el, self, i) {
            if (fn(el, i) !== false) {
                els[els.length] = me.transformElement(el);
            }
        });

        me.elements = els;
        return me;
    },

    /**
     * Find the index of the passed element within the composite collection.
     * @param {String/HTMLElement/Ext.Element/Number} el The id of an element, or an Ext.dom.Element, or an HtmlElement
     * to find within the composite collection.
     * @return {Number} The index of the passed Ext.dom.Element in the composite collection, or -1 if not found.
     */
    indexOf: function(el) {
        return Ext.Array.indexOf(this.elements, this.transformElement(el));
    },

    /**
     * Replaces the specified element with the passed element.
     * @param {String/HTMLElement/Ext.Element/Number} el The id of an element, the Element itself, the index of the
     * element in this composite to replace.
     * @param {String/Ext.Element} replacement The id of an element or the Element itself.
     * @param {Boolean} [domReplace] `true` to remove and replace the element in the document too.
     * @return {Ext.dom.CompositeElementLite} this
     */
    replaceElement: function(el, replacement, domReplace) {
        var index = !isNaN(el) ? el : this.indexOf(el),
                d;
        if (index > -1) {
            replacement = Ext.getDom(replacement);
            if (domReplace) {
                d = this.elements[index];
                d.parentNode.insertBefore(replacement, d);
                Ext.removeNode(d);
            }
            Ext.Array.splice(this.elements, index, 1, replacement);
        }
        return this;
    },

    /**
     * Removes all elements.
     */
    clear: function() {
        this.elements = [];
    },

    addElements: function(els, root) {
        if (!els) {
            return this;
        }

        if (typeof els == "string") {
            els = Ext.dom.Element.selectorFunction(els, root);
        }

        var yels = this.elements;

        Ext.each(els, function(e) {
            yels.push(Ext.get(e));
        });

        return this;
    },

    /**
     * Returns the first Element
     * @return {Ext.dom.Element}
     */
    first: function() {
        return this.item(0);
    },

    /**
     * Returns the last Element
     * @return {Ext.dom.Element}
     */
    last: function() {
        return this.item(this.getCount() - 1);
    },

    /**
     * Returns `true` if this composite contains the passed element
     * @param {String/HTMLElement/Ext.Element/Number} el The id of an element, or an Ext.Element, or an HtmlElement to
     * find within the composite collection.
     * @return {Boolean}
     */
    contains: function(el) {
        return this.indexOf(el) != -1;
    },

    /**
     * Removes the specified element(s).
     * @param {String/HTMLElement/Ext.Element/Number} el The id of an element, the Element itself, the index of the
     * element in this composite or an array of any of those.
     * @param {Boolean} [removeDom] `true` to also remove the element from the document
     * @return {Ext.dom.CompositeElementLite} this
     */
    removeElement: function(keys, removeDom) {
        var me = this,
                elements = this.elements,
                el;

        Ext.each(keys, function(val) {
            if ((el = (elements[val] || elements[val = me.indexOf(val)]))) {
                if (removeDom) {
                    if (el.dom) {
                        el.remove();
                    }
                    else {
                        Ext.removeNode(el);
                    }
                }
                Ext.Array.erase(elements, val, 1);
            }
        });

        return this;
    }

}, function() {
    var Element = Ext.dom.Element,
        elementPrototype = Element.prototype,
        prototype = this.prototype,
        name;

    for (name in elementPrototype) {
        if (typeof elementPrototype[name] == 'function'){
            (function(key) {
                prototype[key] = prototype[key] || function() {
                    return this.invoke(key, arguments);
                };
            }).call(prototype, name);
        }
    }

    prototype.on = prototype.addListener;

    if (Ext.DomQuery){
        Element.selectorFunction = Ext.DomQuery.select;
    }

    /**
     * Selects elements based on the passed CSS selector to enable {@link Ext.Element Element} methods
     * to be applied to many related elements in one statement through the returned
     * {@link Ext.dom.CompositeElementLite CompositeElementLite} object.
     * @param {String/HTMLElement[]} selector The CSS selector or an array of elements
     * @param {HTMLElement/String} [root] The root element of the query or id of the root
     * @return {Ext.dom.CompositeElementLite}
     * @member Ext.dom.Element
     * @method select
     */
   Element.select = function(selector, root) {
        var elements;

        if (typeof selector == "string") {
            elements = Element.selectorFunction(selector, root);
        }
        else if (selector.length !== undefined) {
            elements = selector;
        }
        else {
            //<debug>
            throw new Error("[Ext.select] Invalid selector specified: " + selector);
            //</debug>
        }

        return new Ext.CompositeElementLite(elements);
    };

    /**
     * @member Ext
     * @method select
     * @alias Ext.dom.Element#select
     */
    Ext.select = function() {
        return Element.select.apply(Element, arguments);
    };
});

Ext.ClassManager.addNameAlternateMappings({
  "Ext.app.Profile": [],
  "Ext.event.recognizer.MultiTouch": [],
  "Ext.fx.Runner": [],
  "Ext.chart.grid.CircularGrid": [],
  "Ext.mixin.Templatable": [],
  "Ext.event.recognizer.Pinch": [],
  "Ext.util.Format": [],
  "Ext.direct.JsonProvider": [],
  "Ext.data.identifier.Simple": [],
  "Ext.dataview.DataView": [
    "Ext.DataView"
  ],
  "Ext.field.Hidden": [
    "Ext.form.Hidden"
  ],
  "Ext.field.Number": [
    "Ext.form.Number"
  ],
  "Ext.chart.series.CandleStick": [],
  "Ext.device.Connection": [],
  "Ext.data.Model": [
    "Ext.data.Record"
  ],
  "Ext.data.reader.Reader": [
    "Ext.data.Reader",
    "Ext.data.DataReader"
  ],
  "Ext.Sheet": [],
  "Ext.tab.Tab": [
    "Ext.Tab"
  ],
  "Ext.chart.series.sprite.StackedCartesian": [],
  "Ext.util.Grouper": [],
  "Ext.util.translatable.CssPosition": [],
  "Ext.util.paintmonitor.Abstract": [],
  "Ext.direct.RemotingProvider": [],
  "Ext.data.NodeInterface": [
    "Ext.data.Node"
  ],
  "Ext.chart.interactions.PanZoom": [],
  "Ext.util.PositionMap": [],
  "Ext.chart.series.ItemPublisher": [],
  "Ext.util.Sortable": [],
  "Ext.chart.series.sprite.AbstractRadial": [],
  "Ext.fx.runner.Css": [],
  "Ext.fx.runner.CssTransition": [],
  "Ext.draw.Group": [],
  "Ext.XTemplateCompiler": [],
  "Ext.util.Wrapper": [],
  "Ext.app.Router": [],
  "Ext.direct.Transaction": [
    "Ext.Direct.Transaction"
  ],
  "Ext.util.Offset": [],
  "Ext.device.device.Abstract": [],
  "Ext.mixin.Mixin": [],
  "Ext.fx.animation.FadeOut": [],
  "Ext.util.Geolocation": [
    "Ext.util.GeoLocation"
  ],
  "Ext.ComponentManager": [
    "Ext.ComponentMgr"
  ],
  "Ext.util.sizemonitor.OverflowChange": [],
  "Ext.event.publisher.ElementSize": [],
  "Ext.tab.Bar": [
    "Ext.TabBar"
  ],
  "Ext.event.Dom": [],
  "Ext.app.Application": [],
  "Ext.dataview.List": [
    "Ext.List"
  ],
  "Ext.util.translatable.Dom": [],
  "Ext.fx.layout.card.Scroll": [],
  "Ext.draw.LimitedCache": [],
  "Ext.device.geolocation.Sencha": [],
  "Ext.dataview.ListItemHeader": [],
  "Ext.event.publisher.TouchGesture": [],
  "Ext.data.SortTypes": [],
  "Ext.device.contacts.Abstract": [],
  "Ext.device.push.Sencha": [],
  "Ext.fx.animation.WipeOut": [],
  "Ext.slider.Slider": [],
  "Ext.Component": [
    "Ext.lib.Component"
  ],
  "Ext.device.communicator.Default": [],
  "Ext.fx.runner.CssAnimation": [],
  "Ext.chart.axis.Axis": [],
  "Ext.fx.animation.Cube": [],
  "Ext.chart.Markers": [],
  "Ext.chart.series.sprite.Radar": [],
  "Ext.device.device.Simulator": [],
  "Ext.Ajax": [],
  "Ext.dataview.component.ListItem": [],
  "Ext.util.Filter": [],
  "Ext.layout.wrapper.Inner": [],
  "Ext.draw.Animator": [],
  "Ext.device.geolocation.Simulator": [],
  "Ext.data.association.BelongsTo": [
    "Ext.data.BelongsToAssociation"
  ],
  "Ext.draw.Surface": [],
  "Ext.scroll.indicator.ScrollPosition": [],
  "Ext.field.Email": [
    "Ext.form.Email"
  ],
  "Ext.fx.layout.card.Abstract": [],
  "Ext.event.Controller": [],
  "Ext.dataview.component.Container": [],
  "Ext.log.writer.Remote": [],
  "Ext.fx.layout.card.Style": [],
  "Ext.device.purchases.Sencha": [],
  "Ext.chart.axis.segmenter.Segmenter": [],
  "Ext.viewport.Android": [],
  "Ext.log.formatter.Identity": [],
  "Ext.chart.interactions.ItemHighlight": [],
  "Ext.picker.Picker": [
    "Ext.Picker"
  ],
  "Ext.data.Batch": [],
  "Ext.draw.modifier.Animation": [],
  "Ext.chart.AbstractChart": [],
  "Ext.tab.Panel": [
    "Ext.TabPanel"
  ],
  "Ext.draw.Path": [],
  "Ext.scroll.indicator.Throttled": [],
  "Ext.fx.animation.SlideOut": [],
  "Ext.device.connection.Sencha": [],
  "Ext.fx.layout.card.Pop": [],
  "Ext.chart.axis.layout.Discrete": [],
  "Ext.data.Field": [],
  "Ext.chart.series.Gauge": [],
  "Ext.data.StoreManager": [
    "Ext.StoreMgr",
    "Ext.data.StoreMgr",
    "Ext.StoreManager"
  ],
  "Ext.fx.animation.PopOut": [],
  "Ext.chart.label.Callout": [],
  "Ext.device.push.Abstract": [],
  "Ext.util.DelayedTask": [],
  "Ext.fx.easing.Momentum": [],
  "Ext.fx.easing.Abstract": [],
  "Ext.Title": [],
  "Ext.event.recognizer.Drag": [],
  "Ext.field.TextArea": [
    "Ext.form.TextArea"
  ],
  "Ext.fx.Easing": [],
  "Ext.chart.series.sprite.Scatter": [],
  "Ext.data.reader.Array": [
    "Ext.data.ArrayReader"
  ],
  "Ext.picker.Date": [
    "Ext.DatePicker"
  ],
  "Ext.data.proxy.JsonP": [
    "Ext.data.ScriptTagProxy"
  ],
  "Ext.device.communicator.Android": [],
  "Ext.chart.series.Area": [],
  "Ext.device.device.PhoneGap": [],
  "Ext.field.Checkbox": [
    "Ext.form.Checkbox"
  ],
  "Ext.chart.Legend": [],
  "Ext.Media": [],
  "Ext.TitleBar": [],
  "Ext.chart.interactions.RotatePie3D": [],
  "Ext.draw.gradient.Linear": [],
  "Ext.util.TapRepeater": [],
  "Ext.event.Touch": [],
  "Ext.mixin.Bindable": [],
  "Ext.data.proxy.Server": [
    "Ext.data.ServerProxy"
  ],
  "Ext.chart.series.Cartesian": [],
  "Ext.util.sizemonitor.Scroll": [],
  "Ext.data.ResultSet": [],
  "Ext.data.association.HasMany": [
    "Ext.data.HasManyAssociation"
  ],
  "Ext.draw.TimingFunctions": [],
  "Ext.draw.engine.Canvas": [],
  "Ext.data.proxy.Ajax": [
    "Ext.data.HttpProxy",
    "Ext.data.AjaxProxy"
  ],
  "Ext.fx.animation.Fade": [
    "Ext.fx.animation.FadeIn"
  ],
  "Ext.layout.Default": [],
  "Ext.util.paintmonitor.CssAnimation": [],
  "Ext.data.writer.Writer": [
    "Ext.data.DataWriter",
    "Ext.data.Writer"
  ],
  "Ext.event.recognizer.Recognizer": [],
  "Ext.form.FieldSet": [],
  "Ext.scroll.Indicator": [
    "Ext.util.Indicator"
  ],
  "Ext.XTemplateParser": [],
  "Ext.behavior.Scrollable": [],
  "Ext.chart.series.sprite.CandleStick": [],
  "Ext.data.JsonP": [
    "Ext.util.JSONP"
  ],
  "Ext.device.connection.PhoneGap": [],
  "Ext.event.publisher.Dom": [],
  "Ext.fx.layout.card.Fade": [],
  "Ext.app.Controller": [],
  "Ext.fx.State": [],
  "Ext.layout.wrapper.BoxDock": [],
  "Ext.chart.series.sprite.Pie3DPart": [],
  "Ext.viewport.Default": [],
  "Ext.layout.HBox": [],
  "Ext.ux.auth.model.Session": [],
  "Ext.scroll.indicator.Default": [],
  "Ext.data.ModelManager": [
    "Ext.ModelMgr",
    "Ext.ModelManager"
  ],
  "Ext.data.Validations": [
    "Ext.data.validations"
  ],
  "Ext.util.translatable.Abstract": [],
  "Ext.scroll.indicator.Abstract": [],
  "Ext.Button": [],
  "Ext.field.Radio": [
    "Ext.form.Radio"
  ],
  "Ext.util.HashMap": [],
  "Ext.field.Input": [],
  "Ext.device.Camera": [],
  "Ext.mixin.Filterable": [],
  "Ext.draw.TextMeasurer": [],
  "Ext.dataview.element.Container": [],
  "Ext.chart.series.sprite.PieSlice": [],
  "Ext.data.Connection": [],
  "Ext.direct.ExceptionEvent": [],
  "Ext.Panel": [
    "Ext.lib.Panel"
  ],
  "Ext.data.association.HasOne": [
    "Ext.data.HasOneAssociation"
  ],
  "Ext.device.geolocation.Abstract": [],
  "Ext.ActionSheet": [],
  "Ext.layout.Box": [],
  "Ext.bb.CrossCut": [],
  "Ext.Video": [],
  "Ext.ux.auth.Session": [],
  "Ext.chart.series.Line": [],
  "Ext.fx.layout.card.Cube": [],
  "Ext.event.recognizer.HorizontalSwipe": [],
  "Ext.data.writer.Json": [
    "Ext.data.JsonWriter"
  ],
  "Ext.layout.Fit": [],
  "Ext.fx.animation.Slide": [
    "Ext.fx.animation.SlideIn"
  ],
  "Ext.device.Purchases.Purchase": [],
  "Ext.table.Row": [],
  "Ext.log.formatter.Formatter": [],
  "Ext.Container": [
    "Ext.lib.Container"
  ],
  "Ext.fx.animation.Pop": [
    "Ext.fx.animation.PopIn"
  ],
  "Ext.draw.sprite.Circle": [],
  "Ext.fx.layout.card.Reveal": [],
  "Ext.fx.layout.card.Cover": [],
  "Ext.log.Base": [],
  "Ext.data.reader.Xml": [
    "Ext.data.XmlReader"
  ],
  "Ext.event.publisher.ElementPaint": [],
  "Ext.chart.axis.Category": [],
  "Ext.data.reader.Json": [
    "Ext.data.JsonReader"
  ],
  "Ext.Decorator": [],
  "Ext.data.TreeStore": [],
  "Ext.device.Purchases": [],
  "Ext.device.orientation.HTML5": [],
  "Ext.draw.gradient.Gradient": [],
  "Ext.event.recognizer.DoubleTap": [],
  "Ext.log.Logger": [],
  "Ext.picker.Slot": [
    "Ext.Picker.Slot"
  ],
  "Ext.device.notification.Simulator": [],
  "Ext.field.Field": [
    "Ext.form.Field"
  ],
  "Ext.log.filter.Priority": [],
  "Ext.util.sizemonitor.Abstract": [],
  "Ext.chart.series.sprite.Polar": [],
  "Ext.util.paintmonitor.OverflowChange": [],
  "Ext.util.LineSegment": [],
  "Ext.SegmentedButton": [],
  "Ext.Sortable": [],
  "Ext.fx.easing.Linear": [],
  "Ext.chart.series.sprite.Aggregative": [],
  "Ext.dom.CompositeElement": [
    "Ext.CompositeElement"
  ],
  "Ext.data.identifier.Uuid": [],
  "Ext.data.proxy.Client": [
    "Ext.proxy.ClientProxy"
  ],
  "Ext.fx.easing.Bounce": [],
  "Ext.data.Types": [],
  "Ext.chart.series.sprite.Cartesian": [],
  "Ext.app.Action": [],
  "Ext.util.Translatable": [],
  "Ext.device.camera.PhoneGap": [],
  "Ext.draw.sprite.Path": [],
  "Ext.LoadMask": [],
  "Ext.data.association.Association": [
    "Ext.data.Association"
  ],
  "Ext.chart.axis.sprite.Axis": [],
  "Ext.behavior.Draggable": [],
  "Ext.chart.grid.RadialGrid": [],
  "Ext.util.TranslatableGroup": [],
  "Ext.fx.Animation": [],
  "Ext.draw.sprite.Ellipse": [],
  "Ext.util.Inflector": [],
  "Ext.Map": [],
  "Ext.XTemplate": [],
  "Ext.data.NodeStore": [],
  "Ext.draw.sprite.AttributeParser": [],
  "Ext.form.Panel": [
    "Ext.form.FormPanel"
  ],
  "Ext.chart.series.Series": [],
  "Ext.data.Request": [],
  "Ext.draw.sprite.Text": [],
  "Ext.layout.Float": [],
  "Ext.dataview.component.DataItem": [],
  "Ext.chart.CartesianChart": [
    "Ext.chart.Chart"
  ],
  "Ext.data.proxy.WebStorage": [
    "Ext.data.WebStorageProxy"
  ],
  "Ext.log.writer.Writer": [],
  "Ext.device.Communicator": [],
  "Ext.fx.animation.Flip": [],
  "Ext.util.Point": [],
  "Ext.chart.series.StackedCartesian": [],
  "Ext.fx.layout.card.Slide": [],
  "Ext.Anim": [],
  "Ext.data.DirectStore": [],
  "Ext.dataview.NestedList": [
    "Ext.NestedList"
  ],
  "Ext.app.Route": [],
  "Ext.device.connection.Simulator": [],
  "Ext.chart.PolarChart": [],
  "Ext.event.publisher.ComponentSize": [],
  "Ext.slider.Toggle": [],
  "Ext.data.identifier.Sequential": [],
  "Ext.Template": [],
  "Ext.AbstractComponent": [],
  "Ext.device.Push": [],
  "Ext.fx.easing.BoundMomentum": [],
  "Ext.viewport.Viewport": [],
  "Ext.chart.series.Polar": [],
  "Ext.event.recognizer.VerticalSwipe": [],
  "Ext.event.Event": [
    "Ext.EventObject"
  ],
  "Ext.behavior.Behavior": [],
  "Ext.chart.grid.VerticalGrid": [],
  "Ext.chart.label.Label": [],
  "Ext.draw.sprite.EllipticalArc": [],
  "Ext.fx.easing.EaseOut": [],
  "Ext.Toolbar": [],
  "Ext.event.recognizer.LongPress": [],
  "Ext.device.notification.Sencha": [],
  "Ext.chart.series.sprite.Line": [],
  "Ext.data.ArrayStore": [],
  "Ext.data.proxy.SQL": [],
  "Ext.mixin.Sortable": [],
  "Ext.fx.layout.card.Flip": [],
  "Ext.chart.interactions.CrossZoom": [],
  "Ext.event.publisher.ComponentPaint": [],
  "Ext.event.recognizer.Rotate": [],
  "Ext.util.TranslatableList": [],
  "Ext.carousel.Item": [],
  "Ext.event.recognizer.Swipe": [],
  "Ext.util.translatable.ScrollPosition": [],
  "Ext.device.camera.Simulator": [],
  "Ext.chart.series.sprite.Area": [],
  "Ext.event.recognizer.Touch": [],
  "Ext.plugin.ListPaging": [],
  "Ext.draw.sprite.Sector": [],
  "Ext.chart.axis.segmenter.Names": [],
  "Ext.mixin.Observable": [
    "Ext.util.Observable"
  ],
  "Ext.carousel.Infinite": [],
  "Ext.draw.Matrix": [],
  "Ext.Mask": [],
  "Ext.event.publisher.Publisher": [],
  "Ext.layout.wrapper.Dock": [],
  "Ext.app.History": [],
  "Ext.data.proxy.Direct": [
    "Ext.data.DirectProxy"
  ],
  "Ext.chart.axis.layout.Continuous": [],
  "Ext.table.Cell": [],
  "Ext.fx.layout.card.ScrollCover": [],
  "Ext.device.orientation.Sencha": [],
  "Ext.util.Droppable": [],
  "Ext.draw.sprite.Composite": [],
  "Ext.chart.series.Pie": [],
  "Ext.device.Purchases.Product": [],
  "Ext.device.Orientation": [],
  "Ext.direct.Provider": [],
  "Ext.draw.sprite.Arc": [],
  "Ext.chart.axis.segmenter.Time": [],
  "Ext.util.Draggable": [],
  "Ext.device.contacts.Sencha": [],
  "Ext.chart.grid.HorizontalGrid": [],
  "Ext.mixin.Traversable": [],
  "Ext.util.AbstractMixedCollection": [],
  "Ext.data.JsonStore": [],
  "Ext.draw.SegmentTree": [],
  "Ext.direct.RemotingEvent": [],
  "Ext.plugin.PullRefresh": [],
  "Ext.log.writer.Console": [],
  "Ext.field.Spinner": [
    "Ext.form.Spinner"
  ],
  "Ext.chart.axis.segmenter.Numeric": [],
  "Ext.data.proxy.LocalStorage": [
    "Ext.data.LocalStorageProxy"
  ],
  "Ext.fx.animation.Wipe": [
    "Ext.fx.animation.WipeIn"
  ],
  "Ext.fx.layout.Card": [],
  "Ext.TaskQueue": [],
  "Ext.Label": [],
  "Ext.util.translatable.CssTransform": [],
  "Ext.viewport.Ios": [],
  "Ext.Spacer": [],
  "Ext.mixin.Selectable": [],
  "Ext.draw.sprite.Image": [],
  "Ext.data.proxy.Rest": [
    "Ext.data.RestProxy"
  ],
  "Ext.Img": [],
  "Ext.chart.series.sprite.Bar": [],
  "Ext.log.writer.DocumentTitle": [],
  "Ext.data.Error": [],
  "Ext.util.Sorter": [],
  "Ext.draw.gradient.Radial": [],
  "Ext.layout.Abstract": [],
  "Ext.device.notification.Abstract": [],
  "Ext.log.filter.Filter": [],
  "Ext.device.camera.Sencha": [],
  "Ext.draw.sprite.Sprite": [],
  "Ext.draw.Color": [],
  "Ext.chart.series.Bar": [],
  "Ext.field.Slider": [
    "Ext.form.Slider"
  ],
  "Ext.field.Search": [
    "Ext.form.Search"
  ],
  "Ext.chart.series.Scatter": [],
  "Ext.device.Device": [],
  "Ext.event.Dispatcher": [],
  "Ext.data.Store": [],
  "Ext.draw.modifier.Highlight": [],
  "Ext.behavior.Translatable": [],
  "Ext.direct.Manager": [
    "Ext.Direct"
  ],
  "Ext.data.proxy.Proxy": [
    "Ext.data.DataProxy",
    "Ext.data.Proxy"
  ],
  "Ext.draw.modifier.Modifier": [],
  "Ext.navigation.View": [
    "Ext.NavigationView"
  ],
  "Ext.draw.modifier.Target": [],
  "Ext.draw.sprite.AttributeDefinition": [],
  "Ext.device.Notification": [],
  "Ext.draw.Component": [],
  "Ext.layout.VBox": [],
  "Ext.slider.Thumb": [],
  "Ext.MessageBox": [],
  "Ext.ux.Faker": [],
  "Ext.dataview.IndexBar": [
    "Ext.IndexBar"
  ],
  "Ext.dataview.element.List": [],
  "Ext.layout.FlexBox": [],
  "Ext.field.Url": [
    "Ext.form.Url"
  ],
  "Ext.draw.Solver": [],
  "Ext.data.proxy.Memory": [
    "Ext.data.MemoryProxy"
  ],
  "Ext.chart.axis.Time": [],
  "Ext.layout.Card": [],
  "Ext.ComponentQuery": [],
  "Ext.chart.series.Pie3D": [],
  "Ext.device.camera.Abstract": [],
  "Ext.device.device.Sencha": [],
  "Ext.scroll.View": [
    "Ext.util.ScrollView"
  ],
  "Ext.draw.sprite.Rect": [],
  "Ext.util.Region": [],
  "Ext.field.Select": [
    "Ext.form.Select"
  ],
  "Ext.draw.Draw": [],
  "Ext.ItemCollection": [],
  "Ext.log.formatter.Default": [],
  "Ext.navigation.Bar": [],
  "Ext.chart.axis.layout.CombineDuplicate": [],
  "Ext.device.Geolocation": [],
  "Ext.chart.SpaceFillingChart": [],
  "Ext.data.proxy.SessionStorage": [
    "Ext.data.SessionStorageProxy"
  ],
  "Ext.fx.easing.EaseIn": [],
  "Ext.draw.sprite.AnimationParser": [],
  "Ext.field.Password": [
    "Ext.form.Password"
  ],
  "Ext.device.connection.Abstract": [],
  "Ext.direct.Event": [],
  "Ext.direct.RemotingMethod": [],
  "Ext.Evented": [
    "Ext.EventedBase"
  ],
  "Ext.carousel.Indicator": [
    "Ext.Carousel.Indicator"
  ],
  "Ext.util.Collection": [],
  "Ext.chart.interactions.ItemInfo": [],
  "Ext.chart.MarkerHolder": [],
  "Ext.carousel.Carousel": [
    "Ext.Carousel"
  ],
  "Ext.Audio": [],
  "Ext.device.Contacts": [],
  "Ext.table.Table": [],
  "Ext.draw.engine.SvgContext.Gradient": [],
  "Ext.chart.axis.layout.Layout": [],
  "Ext.data.Errors": [],
  "Ext.field.Text": [
    "Ext.form.Text"
  ],
  "Ext.field.TextAreaInput": [],
  "Ext.field.DatePicker": [
    "Ext.form.DatePicker"
  ],
  "Ext.draw.engine.Svg": [],
  "Ext.event.recognizer.Tap": [],
  "Ext.device.orientation.Abstract": [],
  "Ext.AbstractManager": [],
  "Ext.chart.series.Radar": [],
  "Ext.chart.interactions.Abstract": [],
  "Ext.scroll.indicator.CssTransform": [],
  "Ext.util.PaintMonitor": [],
  "Ext.direct.PollingProvider": [],
  "Ext.device.notification.PhoneGap": [],
  "Ext.data.writer.Xml": [
    "Ext.data.XmlWriter"
  ],
  "Ext.event.recognizer.SingleTouch": [],
  "Ext.draw.sprite.Instancing": [],
  "Ext.event.publisher.ComponentDelegation": [],
  "Ext.chart.axis.Numeric": [],
  "Ext.field.Toggle": [
    "Ext.form.Toggle"
  ],
  "Ext.fx.layout.card.ScrollReveal": [],
  "Ext.data.Operation": [],
  "Ext.fx.animation.Abstract": [],
  "Ext.chart.interactions.Rotate": [],
  "Ext.draw.engine.SvgContext": [],
  "Ext.scroll.Scroller": [],
  "Ext.util.SizeMonitor": [],
  "Ext.event.ListenerStack": [],
  "Ext.util.MixedCollection": []
});Ext.ClassManager.addNameAliasMappings({
  "Ext.app.Profile": [],
  "Ext.event.recognizer.MultiTouch": [],
  "Ext.fx.Runner": [],
  "Ext.chart.grid.CircularGrid": [
    "grid.circular"
  ],
  "Ext.mixin.Templatable": [],
  "Ext.event.recognizer.Pinch": [],
  "Ext.util.Format": [],
  "Ext.direct.JsonProvider": [
    "direct.jsonprovider"
  ],
  "Ext.data.identifier.Simple": [
    "data.identifier.simple"
  ],
  "Ext.dataview.DataView": [
    "widget.dataview"
  ],
  "Ext.field.Hidden": [
    "widget.hiddenfield"
  ],
  "Ext.field.Number": [
    "widget.numberfield"
  ],
  "Ext.chart.series.CandleStick": [
    "series.candlestick"
  ],
  "Ext.device.Connection": [],
  "Ext.data.Model": [],
  "Ext.data.reader.Reader": [],
  "Ext.Sheet": [
    "widget.sheet"
  ],
  "Ext.tab.Tab": [
    "widget.tab"
  ],
  "Ext.chart.series.sprite.StackedCartesian": [],
  "Ext.util.Grouper": [],
  "Ext.util.translatable.CssPosition": [],
  "Ext.util.paintmonitor.Abstract": [],
  "Ext.direct.RemotingProvider": [
    "direct.remotingprovider"
  ],
  "Ext.data.NodeInterface": [],
  "Ext.chart.interactions.PanZoom": [
    "interaction.panzoom"
  ],
  "Ext.util.PositionMap": [],
  "Ext.chart.series.ItemPublisher": [],
  "Ext.util.Sortable": [],
  "Ext.chart.series.sprite.AbstractRadial": [],
  "Ext.fx.runner.Css": [],
  "Ext.fx.runner.CssTransition": [],
  "Ext.draw.Group": [],
  "Ext.XTemplateCompiler": [],
  "Ext.util.Wrapper": [],
  "Ext.app.Router": [],
  "Ext.direct.Transaction": [
    "direct.transaction"
  ],
  "Ext.util.Offset": [],
  "Ext.device.device.Abstract": [],
  "Ext.mixin.Mixin": [],
  "Ext.fx.animation.FadeOut": [
    "animation.fadeOut"
  ],
  "Ext.util.Geolocation": [],
  "Ext.ComponentManager": [],
  "Ext.util.sizemonitor.OverflowChange": [],
  "Ext.event.publisher.ElementSize": [],
  "Ext.tab.Bar": [
    "widget.tabbar"
  ],
  "Ext.event.Dom": [],
  "Ext.app.Application": [],
  "Ext.dataview.List": [
    "widget.list"
  ],
  "Ext.util.translatable.Dom": [],
  "Ext.fx.layout.card.Scroll": [
    "fx.layout.card.scroll"
  ],
  "Ext.draw.LimitedCache": [],
  "Ext.device.geolocation.Sencha": [],
  "Ext.dataview.ListItemHeader": [
    "widget.listitemheader"
  ],
  "Ext.event.publisher.TouchGesture": [],
  "Ext.data.SortTypes": [],
  "Ext.device.contacts.Abstract": [],
  "Ext.device.push.Sencha": [],
  "Ext.fx.animation.WipeOut": [],
  "Ext.slider.Slider": [
    "widget.slider"
  ],
  "Ext.Component": [
    "widget.component"
  ],
  "Ext.device.communicator.Default": [],
  "Ext.fx.runner.CssAnimation": [],
  "Ext.chart.axis.Axis": [
    "widget.axis"
  ],
  "Ext.fx.animation.Cube": [
    "animation.cube"
  ],
  "Ext.chart.Markers": [],
  "Ext.chart.series.sprite.Radar": [
    "sprite.radar"
  ],
  "Ext.device.device.Simulator": [],
  "Ext.Ajax": [],
  "Ext.dataview.component.ListItem": [
    "widget.listitem"
  ],
  "Ext.util.Filter": [],
  "Ext.layout.wrapper.Inner": [],
  "Ext.draw.Animator": [],
  "Ext.device.geolocation.Simulator": [],
  "Ext.data.association.BelongsTo": [
    "association.belongsto"
  ],
  "Ext.draw.Surface": [
    "widget.surface"
  ],
  "Ext.scroll.indicator.ScrollPosition": [],
  "Ext.field.Email": [
    "widget.emailfield"
  ],
  "Ext.fx.layout.card.Abstract": [],
  "Ext.event.Controller": [],
  "Ext.dataview.component.Container": [],
  "Ext.log.writer.Remote": [],
  "Ext.fx.layout.card.Style": [],
  "Ext.device.purchases.Sencha": [],
  "Ext.chart.axis.segmenter.Segmenter": [],
  "Ext.viewport.Android": [],
  "Ext.log.formatter.Identity": [],
  "Ext.chart.interactions.ItemHighlight": [
    "interaction.itemhighlight"
  ],
  "Ext.picker.Picker": [
    "widget.picker"
  ],
  "Ext.data.Batch": [],
  "Ext.draw.modifier.Animation": [
    "modifier.animation"
  ],
  "Ext.chart.AbstractChart": [],
  "Ext.tab.Panel": [
    "widget.tabpanel"
  ],
  "Ext.draw.Path": [],
  "Ext.scroll.indicator.Throttled": [],
  "Ext.fx.animation.SlideOut": [
    "animation.slideOut"
  ],
  "Ext.device.connection.Sencha": [],
  "Ext.fx.layout.card.Pop": [
    "fx.layout.card.pop"
  ],
  "Ext.chart.axis.layout.Discrete": [
    "axisLayout.discrete"
  ],
  "Ext.data.Field": [
    "data.field"
  ],
  "Ext.chart.series.Gauge": [
    "series.gauge"
  ],
  "Ext.data.StoreManager": [],
  "Ext.fx.animation.PopOut": [
    "animation.popOut"
  ],
  "Ext.chart.label.Callout": [],
  "Ext.device.push.Abstract": [],
  "Ext.util.DelayedTask": [],
  "Ext.fx.easing.Momentum": [],
  "Ext.fx.easing.Abstract": [],
  "Ext.Title": [
    "widget.title"
  ],
  "Ext.event.recognizer.Drag": [],
  "Ext.field.TextArea": [
    "widget.textareafield"
  ],
  "Ext.fx.Easing": [],
  "Ext.chart.series.sprite.Scatter": [
    "sprite.scatterSeries"
  ],
  "Ext.data.reader.Array": [
    "reader.array"
  ],
  "Ext.picker.Date": [
    "widget.datepicker"
  ],
  "Ext.data.proxy.JsonP": [
    "proxy.jsonp",
    "proxy.scripttag"
  ],
  "Ext.device.communicator.Android": [],
  "Ext.chart.series.Area": [
    "series.area"
  ],
  "Ext.device.device.PhoneGap": [],
  "Ext.field.Checkbox": [
    "widget.checkboxfield"
  ],
  "Ext.chart.Legend": [
    "widget.legend"
  ],
  "Ext.Media": [
    "widget.media"
  ],
  "Ext.TitleBar": [
    "widget.titlebar"
  ],
  "Ext.chart.interactions.RotatePie3D": [
    "interaction.rotatePie3d"
  ],
  "Ext.draw.gradient.Linear": [],
  "Ext.util.TapRepeater": [],
  "Ext.event.Touch": [],
  "Ext.mixin.Bindable": [],
  "Ext.data.proxy.Server": [
    "proxy.server"
  ],
  "Ext.chart.series.Cartesian": [],
  "Ext.util.sizemonitor.Scroll": [],
  "Ext.data.ResultSet": [],
  "Ext.data.association.HasMany": [
    "association.hasmany"
  ],
  "Ext.draw.TimingFunctions": [],
  "Ext.draw.engine.Canvas": [],
  "Ext.data.proxy.Ajax": [
    "proxy.ajax"
  ],
  "Ext.fx.animation.Fade": [
    "animation.fade",
    "animation.fadeIn"
  ],
  "Ext.layout.Default": [
    "layout.default",
    "layout.auto"
  ],
  "Ext.util.paintmonitor.CssAnimation": [],
  "Ext.data.writer.Writer": [
    "writer.base"
  ],
  "Ext.event.recognizer.Recognizer": [],
  "Ext.form.FieldSet": [
    "widget.fieldset"
  ],
  "Ext.scroll.Indicator": [],
  "Ext.XTemplateParser": [],
  "Ext.behavior.Scrollable": [],
  "Ext.chart.series.sprite.CandleStick": [
    "sprite.candlestickSeries"
  ],
  "Ext.data.JsonP": [],
  "Ext.device.connection.PhoneGap": [],
  "Ext.event.publisher.Dom": [],
  "Ext.fx.layout.card.Fade": [
    "fx.layout.card.fade"
  ],
  "Ext.app.Controller": [],
  "Ext.fx.State": [],
  "Ext.layout.wrapper.BoxDock": [],
  "Ext.chart.series.sprite.Pie3DPart": [
    "sprite.pie3dPart"
  ],
  "Ext.viewport.Default": [
    "widget.viewport"
  ],
  "Ext.layout.HBox": [
    "layout.hbox"
  ],
  "Ext.ux.auth.model.Session": [],
  "Ext.scroll.indicator.Default": [],
  "Ext.data.ModelManager": [],
  "Ext.data.Validations": [],
  "Ext.util.translatable.Abstract": [],
  "Ext.scroll.indicator.Abstract": [],
  "Ext.Button": [
    "widget.button"
  ],
  "Ext.field.Radio": [
    "widget.radiofield"
  ],
  "Ext.util.HashMap": [],
  "Ext.field.Input": [
    "widget.input"
  ],
  "Ext.device.Camera": [],
  "Ext.mixin.Filterable": [],
  "Ext.draw.TextMeasurer": [],
  "Ext.dataview.element.Container": [],
  "Ext.chart.series.sprite.PieSlice": [
    "sprite.pieslice"
  ],
  "Ext.data.Connection": [],
  "Ext.direct.ExceptionEvent": [
    "direct.exception"
  ],
  "Ext.Panel": [
    "widget.panel"
  ],
  "Ext.data.association.HasOne": [
    "association.hasone"
  ],
  "Ext.device.geolocation.Abstract": [],
  "Ext.ActionSheet": [
    "widget.actionsheet"
  ],
  "Ext.layout.Box": [
    "layout.tablebox"
  ],
  "Ext.bb.CrossCut": [
    "widget.crosscut"
  ],
  "Ext.Video": [
    "widget.video"
  ],
  "Ext.ux.auth.Session": [],
  "Ext.chart.series.Line": [
    "series.line"
  ],
  "Ext.fx.layout.card.Cube": [
    "fx.layout.card.cube"
  ],
  "Ext.event.recognizer.HorizontalSwipe": [],
  "Ext.data.writer.Json": [
    "writer.json"
  ],
  "Ext.layout.Fit": [
    "layout.fit"
  ],
  "Ext.fx.animation.Slide": [
    "animation.slide",
    "animation.slideIn"
  ],
  "Ext.device.Purchases.Purchase": [],
  "Ext.table.Row": [
    "widget.tablerow"
  ],
  "Ext.log.formatter.Formatter": [],
  "Ext.Container": [
    "widget.container"
  ],
  "Ext.fx.animation.Pop": [
    "animation.pop",
    "animation.popIn"
  ],
  "Ext.draw.sprite.Circle": [
    "sprite.circle"
  ],
  "Ext.fx.layout.card.Reveal": [
    "fx.layout.card.reveal"
  ],
  "Ext.fx.layout.card.Cover": [
    "fx.layout.card.cover"
  ],
  "Ext.log.Base": [],
  "Ext.data.reader.Xml": [
    "reader.xml"
  ],
  "Ext.event.publisher.ElementPaint": [],
  "Ext.chart.axis.Category": [
    "axis.category"
  ],
  "Ext.data.reader.Json": [
    "reader.json"
  ],
  "Ext.Decorator": [],
  "Ext.data.TreeStore": [
    "store.tree"
  ],
  "Ext.device.Purchases": [],
  "Ext.device.orientation.HTML5": [],
  "Ext.draw.gradient.Gradient": [],
  "Ext.event.recognizer.DoubleTap": [],
  "Ext.log.Logger": [],
  "Ext.picker.Slot": [
    "widget.pickerslot"
  ],
  "Ext.device.notification.Simulator": [],
  "Ext.field.Field": [
    "widget.field"
  ],
  "Ext.log.filter.Priority": [],
  "Ext.util.sizemonitor.Abstract": [],
  "Ext.chart.series.sprite.Polar": [],
  "Ext.util.paintmonitor.OverflowChange": [],
  "Ext.util.LineSegment": [],
  "Ext.SegmentedButton": [
    "widget.segmentedbutton"
  ],
  "Ext.Sortable": [],
  "Ext.fx.easing.Linear": [
    "easing.linear"
  ],
  "Ext.chart.series.sprite.Aggregative": [],
  "Ext.dom.CompositeElement": [],
  "Ext.data.identifier.Uuid": [
    "data.identifier.uuid"
  ],
  "Ext.data.proxy.Client": [],
  "Ext.fx.easing.Bounce": [],
  "Ext.data.Types": [],
  "Ext.chart.series.sprite.Cartesian": [],
  "Ext.app.Action": [],
  "Ext.util.Translatable": [],
  "Ext.device.camera.PhoneGap": [],
  "Ext.draw.sprite.Path": [
    "sprite.path"
  ],
  "Ext.LoadMask": [
    "widget.loadmask"
  ],
  "Ext.data.association.Association": [],
  "Ext.chart.axis.sprite.Axis": [],
  "Ext.behavior.Draggable": [],
  "Ext.chart.grid.RadialGrid": [
    "grid.radial"
  ],
  "Ext.util.TranslatableGroup": [],
  "Ext.fx.Animation": [],
  "Ext.draw.sprite.Ellipse": [
    "sprite.ellipse"
  ],
  "Ext.util.Inflector": [],
  "Ext.Map": [
    "widget.map"
  ],
  "Ext.XTemplate": [],
  "Ext.data.NodeStore": [
    "store.node"
  ],
  "Ext.draw.sprite.AttributeParser": [],
  "Ext.form.Panel": [
    "widget.formpanel"
  ],
  "Ext.chart.series.Series": [],
  "Ext.data.Request": [],
  "Ext.draw.sprite.Text": [
    "sprite.text"
  ],
  "Ext.layout.Float": [
    "layout.float"
  ],
  "Ext.dataview.component.DataItem": [
    "widget.dataitem"
  ],
  "Ext.chart.CartesianChart": [
    "widget.chart",
    "Ext.chart.Chart"
  ],
  "Ext.data.proxy.WebStorage": [],
  "Ext.log.writer.Writer": [],
  "Ext.device.Communicator": [],
  "Ext.fx.animation.Flip": [
    "animation.flip"
  ],
  "Ext.util.Point": [],
  "Ext.chart.series.StackedCartesian": [],
  "Ext.fx.layout.card.Slide": [
    "fx.layout.card.slide"
  ],
  "Ext.Anim": [],
  "Ext.data.DirectStore": [
    "store.direct"
  ],
  "Ext.dataview.NestedList": [
    "widget.nestedlist"
  ],
  "Ext.app.Route": [],
  "Ext.device.connection.Simulator": [],
  "Ext.chart.PolarChart": [
    "widget.polar"
  ],
  "Ext.event.publisher.ComponentSize": [],
  "Ext.slider.Toggle": [],
  "Ext.data.identifier.Sequential": [
    "data.identifier.sequential"
  ],
  "Ext.Template": [],
  "Ext.AbstractComponent": [],
  "Ext.device.Push": [],
  "Ext.fx.easing.BoundMomentum": [],
  "Ext.viewport.Viewport": [],
  "Ext.chart.series.Polar": [],
  "Ext.event.recognizer.VerticalSwipe": [],
  "Ext.event.Event": [],
  "Ext.behavior.Behavior": [],
  "Ext.chart.grid.VerticalGrid": [
    "grid.vertical"
  ],
  "Ext.chart.label.Label": [],
  "Ext.draw.sprite.EllipticalArc": [
    "sprite.ellipticalArc"
  ],
  "Ext.fx.easing.EaseOut": [
    "easing.ease-out"
  ],
  "Ext.Toolbar": [
    "widget.toolbar"
  ],
  "Ext.event.recognizer.LongPress": [],
  "Ext.device.notification.Sencha": [],
  "Ext.chart.series.sprite.Line": [
    "sprite.lineSeries"
  ],
  "Ext.data.ArrayStore": [
    "store.array"
  ],
  "Ext.data.proxy.SQL": [
    "proxy.sql"
  ],
  "Ext.mixin.Sortable": [],
  "Ext.fx.layout.card.Flip": [
    "fx.layout.card.flip"
  ],
  "Ext.chart.interactions.CrossZoom": [
    "interaction.crosszoom"
  ],
  "Ext.event.publisher.ComponentPaint": [],
  "Ext.event.recognizer.Rotate": [],
  "Ext.util.TranslatableList": [],
  "Ext.carousel.Item": [],
  "Ext.event.recognizer.Swipe": [],
  "Ext.util.translatable.ScrollPosition": [],
  "Ext.device.camera.Simulator": [],
  "Ext.chart.series.sprite.Area": [
    "sprite.areaSeries"
  ],
  "Ext.event.recognizer.Touch": [],
  "Ext.plugin.ListPaging": [
    "plugin.listpaging"
  ],
  "Ext.draw.sprite.Sector": [
    "sprite.sector"
  ],
  "Ext.chart.axis.segmenter.Names": [
    "segmenter.names"
  ],
  "Ext.mixin.Observable": [],
  "Ext.carousel.Infinite": [],
  "Ext.draw.Matrix": [],
  "Ext.Mask": [
    "widget.mask"
  ],
  "Ext.event.publisher.Publisher": [],
  "Ext.layout.wrapper.Dock": [],
  "Ext.app.History": [],
  "Ext.data.proxy.Direct": [
    "proxy.direct"
  ],
  "Ext.chart.axis.layout.Continuous": [
    "axisLayout.continuous"
  ],
  "Ext.table.Cell": [
    "widget.tablecell"
  ],
  "Ext.fx.layout.card.ScrollCover": [
    "fx.layout.card.scrollcover"
  ],
  "Ext.device.orientation.Sencha": [],
  "Ext.util.Droppable": [],
  "Ext.draw.sprite.Composite": [
    "sprite.composite"
  ],
  "Ext.chart.series.Pie": [
    "series.pie"
  ],
  "Ext.device.Purchases.Product": [],
  "Ext.device.Orientation": [],
  "Ext.direct.Provider": [
    "direct.provider"
  ],
  "Ext.draw.sprite.Arc": [
    "sprite.arc"
  ],
  "Ext.chart.axis.segmenter.Time": [
    "segmenter.time"
  ],
  "Ext.util.Draggable": [],
  "Ext.device.contacts.Sencha": [],
  "Ext.chart.grid.HorizontalGrid": [
    "grid.horizontal"
  ],
  "Ext.mixin.Traversable": [],
  "Ext.util.AbstractMixedCollection": [],
  "Ext.data.JsonStore": [
    "store.json"
  ],
  "Ext.draw.SegmentTree": [],
  "Ext.direct.RemotingEvent": [
    "direct.rpc"
  ],
  "Ext.plugin.PullRefresh": [
    "plugin.pullrefresh"
  ],
  "Ext.log.writer.Console": [],
  "Ext.field.Spinner": [
    "widget.spinnerfield"
  ],
  "Ext.chart.axis.segmenter.Numeric": [
    "segmenter.numeric"
  ],
  "Ext.data.proxy.LocalStorage": [
    "proxy.localstorage"
  ],
  "Ext.fx.animation.Wipe": [],
  "Ext.fx.layout.Card": [],
  "Ext.TaskQueue": [],
  "Ext.Label": [
    "widget.label"
  ],
  "Ext.util.translatable.CssTransform": [],
  "Ext.viewport.Ios": [],
  "Ext.Spacer": [
    "widget.spacer"
  ],
  "Ext.mixin.Selectable": [],
  "Ext.draw.sprite.Image": [
    "sprite.image"
  ],
  "Ext.data.proxy.Rest": [
    "proxy.rest"
  ],
  "Ext.Img": [
    "widget.img",
    "widget.image"
  ],
  "Ext.chart.series.sprite.Bar": [
    "sprite.barSeries"
  ],
  "Ext.log.writer.DocumentTitle": [],
  "Ext.data.Error": [],
  "Ext.util.Sorter": [],
  "Ext.draw.gradient.Radial": [],
  "Ext.layout.Abstract": [],
  "Ext.device.notification.Abstract": [],
  "Ext.log.filter.Filter": [],
  "Ext.device.camera.Sencha": [],
  "Ext.draw.sprite.Sprite": [
    "sprite.sprite"
  ],
  "Ext.draw.Color": [],
  "Ext.chart.series.Bar": [
    "series.bar"
  ],
  "Ext.field.Slider": [
    "widget.sliderfield"
  ],
  "Ext.field.Search": [
    "widget.searchfield"
  ],
  "Ext.chart.series.Scatter": [
    "series.scatter"
  ],
  "Ext.device.Device": [],
  "Ext.event.Dispatcher": [],
  "Ext.data.Store": [
    "store.store"
  ],
  "Ext.draw.modifier.Highlight": [
    "modifier.highlight"
  ],
  "Ext.behavior.Translatable": [],
  "Ext.direct.Manager": [],
  "Ext.data.proxy.Proxy": [
    "proxy.proxy"
  ],
  "Ext.draw.modifier.Modifier": [],
  "Ext.navigation.View": [
    "widget.navigationview"
  ],
  "Ext.draw.modifier.Target": [
    "modifier.target"
  ],
  "Ext.draw.sprite.AttributeDefinition": [],
  "Ext.device.Notification": [],
  "Ext.draw.Component": [
    "widget.draw"
  ],
  "Ext.layout.VBox": [
    "layout.vbox"
  ],
  "Ext.slider.Thumb": [
    "widget.thumb"
  ],
  "Ext.MessageBox": [],
  "Ext.ux.Faker": [],
  "Ext.dataview.IndexBar": [],
  "Ext.dataview.element.List": [],
  "Ext.layout.FlexBox": [
    "layout.box"
  ],
  "Ext.field.Url": [
    "widget.urlfield"
  ],
  "Ext.draw.Solver": [],
  "Ext.data.proxy.Memory": [
    "proxy.memory"
  ],
  "Ext.chart.axis.Time": [
    "axis.time"
  ],
  "Ext.layout.Card": [
    "layout.card"
  ],
  "Ext.ComponentQuery": [],
  "Ext.chart.series.Pie3D": [
    "series.pie3d"
  ],
  "Ext.device.camera.Abstract": [],
  "Ext.device.device.Sencha": [],
  "Ext.scroll.View": [],
  "Ext.draw.sprite.Rect": [
    "sprite.rect"
  ],
  "Ext.util.Region": [],
  "Ext.field.Select": [
    "widget.selectfield"
  ],
  "Ext.draw.Draw": [],
  "Ext.ItemCollection": [],
  "Ext.log.formatter.Default": [],
  "Ext.navigation.Bar": [],
  "Ext.chart.axis.layout.CombineDuplicate": [
    "axisLayout.combineDuplicate"
  ],
  "Ext.device.Geolocation": [],
  "Ext.chart.SpaceFillingChart": [
    "widget.spacefilling"
  ],
  "Ext.data.proxy.SessionStorage": [
    "proxy.sessionstorage"
  ],
  "Ext.fx.easing.EaseIn": [
    "easing.ease-in"
  ],
  "Ext.draw.sprite.AnimationParser": [],
  "Ext.field.Password": [
    "widget.passwordfield"
  ],
  "Ext.device.connection.Abstract": [],
  "Ext.direct.Event": [
    "direct.event"
  ],
  "Ext.direct.RemotingMethod": [],
  "Ext.Evented": [],
  "Ext.carousel.Indicator": [
    "widget.carouselindicator"
  ],
  "Ext.util.Collection": [],
  "Ext.chart.interactions.ItemInfo": [
    "interaction.iteminfo"
  ],
  "Ext.chart.MarkerHolder": [],
  "Ext.carousel.Carousel": [
    "widget.carousel"
  ],
  "Ext.Audio": [
    "widget.audio"
  ],
  "Ext.device.Contacts": [],
  "Ext.table.Table": [
    "widget.table"
  ],
  "Ext.draw.engine.SvgContext.Gradient": [],
  "Ext.chart.axis.layout.Layout": [],
  "Ext.data.Errors": [],
  "Ext.field.Text": [
    "widget.textfield"
  ],
  "Ext.field.TextAreaInput": [
    "widget.textareainput"
  ],
  "Ext.field.DatePicker": [
    "widget.datepickerfield"
  ],
  "Ext.draw.engine.Svg": [],
  "Ext.event.recognizer.Tap": [],
  "Ext.device.orientation.Abstract": [],
  "Ext.AbstractManager": [],
  "Ext.chart.series.Radar": [
    "series.radar"
  ],
  "Ext.chart.interactions.Abstract": [
    "widget.interaction"
  ],
  "Ext.scroll.indicator.CssTransform": [],
  "Ext.util.PaintMonitor": [],
  "Ext.direct.PollingProvider": [
    "direct.pollingprovider"
  ],
  "Ext.device.notification.PhoneGap": [],
  "Ext.data.writer.Xml": [
    "writer.xml"
  ],
  "Ext.event.recognizer.SingleTouch": [],
  "Ext.draw.sprite.Instancing": [
    "sprite.instancing"
  ],
  "Ext.event.publisher.ComponentDelegation": [],
  "Ext.chart.axis.Numeric": [
    "axis.numeric"
  ],
  "Ext.field.Toggle": [
    "widget.togglefield"
  ],
  "Ext.fx.layout.card.ScrollReveal": [
    "fx.layout.card.scrollreveal"
  ],
  "Ext.data.Operation": [],
  "Ext.fx.animation.Abstract": [],
  "Ext.chart.interactions.Rotate": [
    "interaction.rotate"
  ],
  "Ext.draw.engine.SvgContext": [],
  "Ext.scroll.Scroller": [],
  "Ext.util.SizeMonitor": [],
  "Ext.event.ListenerStack": [],
  "Ext.util.MixedCollection": []
});