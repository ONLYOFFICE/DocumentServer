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
