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
        //<if nonBrowser>
        isNonBrowser = typeof window == 'undefined',
        isNodeJS = isNonBrowser && (typeof require == 'function'),
        isJsdb = isNonBrowser && typeof system != 'undefined' && system.program.search(/jsdb/) !== -1,
        //</if>
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

    //<if nonBrowser>
    if (isNonBrowser) {
        if (isNodeJS) {
            Ext.apply(Loader, {
                syncModeEnabled: true,
                setPath: flexSetter(function(name, path) {
                    path = require('fs').realpathSync(path);
                    this.config.paths[name] = path;

                    return this;
                }),

                loadScriptFile: function(filePath, onLoad, onError, scope, synchronous) {
                    require(filePath);
                    onLoad.call(scope);
                }
            });
        }
        else if (isJsdb) {
            Ext.apply(Loader, {
                syncModeEnabled: true,
                loadScriptFile: function(filePath, onLoad, onError, scope, synchronous) {
                    load(filePath);
                    onLoad.call(scope);
                }
            });
        }
    }
    //</if>
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
