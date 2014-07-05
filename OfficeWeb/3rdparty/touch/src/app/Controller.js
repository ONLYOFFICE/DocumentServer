/**
 * @author Ed Spencer
 *
 * @aside guide controllers
 * @aside guide apps_intro
 * @aside guide history_support
 * @aside video mvc-part-1
 * @aside video mvc-part-2
 *
 * Controllers are responsible for responding to events that occur within your app. If your app contains a Logout
 * {@link Ext.Button button} that your user can tap on, a Controller would listen to the Button's tap event and take
 * the appropriate action. It allows the View classes to handle the display of data and the Model classes to handle the
 * loading and saving of data - the Controller is the glue that binds them together.
 *
 * ## Relation to Ext.app.Application
 *
 * Controllers exist within the context of an {@link Ext.app.Application Application}. An Application usually consists
 * of a number of Controllers, each of which handle a specific part of the app. For example, an Application that
 * handles the orders for an online shopping site might have controllers for Orders, Customers and Products.
 *
 * All of the Controllers that an Application uses are specified in the Application's
 * {@link Ext.app.Application#controllers} config. The Application automatically instantiates each Controller and keeps
 * references to each, so it is unusual to need to instantiate Controllers directly. By convention each Controller is
 * named after the thing (usually the Model) that it deals with primarily, usually in the plural - for example if your
 * app is called 'MyApp' and you have a Controller that manages Products, convention is to create a
 * MyApp.controller.Products class in the file app/controller/Products.js.
 *
 * ## Refs and Control
 *
 * The centerpiece of Controllers is the twin configurations {@link #refs} and {@link #cfg-control}. These are used to
 * easily gain references to Components inside your app and to take action on them based on events that they fire.
 * Let's look at {@link #refs} first:
 *
 * ### Refs
 *
 * Refs leverage the powerful {@link Ext.ComponentQuery ComponentQuery} syntax to easily locate Components on your
 * page. We can define as many refs as we like for each Controller, for example here we define a ref called 'nav' that
 * finds a Component on the page with the ID 'mainNav'. We then use that ref in the addLogoutButton beneath it:
 *
 *     Ext.define('MyApp.controller.Main', {
 *         extend: 'Ext.app.Controller',
 *
 *         config: {
 *             refs: {
 *                 nav: '#mainNav'
 *             }
 *         },
 *
 *         addLogoutButton: function() {
 *             this.getNav().add({
 *                 text: 'Logout'
 *             });
 *         }
 *     });
 *
 * Usually, a ref is just a key/value pair - the key ('nav' in this case) is the name of the reference that will be
 * generated, the value ('#mainNav' in this case) is the {@link Ext.ComponentQuery ComponentQuery} selector that will
 * be used to find the Component.
 *
 * Underneath that, we have created a simple function called addLogoutButton which uses this ref via its generated
 * 'getNav' function. These getter functions are generated based on the refs you define and always follow the same
 * format - 'get' followed by the capitalized ref name. In this case we're treating the nav reference as though it's a
 * {@link Ext.Toolbar Toolbar}, and adding a Logout button to it when our function is called. This ref would recognize
 * a Toolbar like this:
 *
 *     Ext.create('Ext.Toolbar', {
 *         id: 'mainNav',
 *
 *         items: [
 *             {
 *                 text: 'Some Button'
 *             }
 *         ]
 *     });
 *
 * Assuming this Toolbar has already been created by the time we run our 'addLogoutButton' function (we'll see how that
 * is invoked later), it will get the second button added to it.
 *
 * ### Advanced Refs
 *
 * Refs can also be passed a couple of additional options, beyond name and selector. These are autoCreate and xtype,
 * which are almost always used together:
 *
 *     Ext.define('MyApp.controller.Main', {
 *         extend: 'Ext.app.Controller',
 *
 *         config: {
 *             refs: {
 *                 nav: '#mainNav',
 *
 *                 infoPanel: {
 *                     selector: 'tabpanel panel[name=fish] infopanel',
 *                     xtype: 'infopanel',
 *                     autoCreate: true
 *                 }
 *             }
 *         }
 *     });
 *
 * We've added a second ref to our Controller. Again the name is the key, 'infoPanel' in this case, but this time we've
 * passed an object as the value instead. This time we've used a slightly more complex selector query - in this example
 * imagine that your app contains a {@link Ext.tab.Panel tab panel} and that one of the items in the tab panel has been
 * given the name 'fish'. Our selector matches any Component with the xtype 'infopanel' inside that tab panel item.
 *
 * The difference here is that if that infopanel does not exist already inside the 'fish' panel, it will be
 * automatically created when you call this.getInfoPanel inside your Controller. The Controller is able to do this
 * because we provided the xtype to instantiate with in the event that the selector did not return anything.
 *
 * ### Control
 *
 * The sister config to {@link #refs} is {@link #cfg-control}. {@link #cfg-control Control} is the means by which your listen
 * to events fired by Components and have your Controller react in some way. Control accepts both ComponentQuery
 * selectors and refs as its keys, and listener objects as values - for example:
 *
 *     Ext.define('MyApp.controller.Main', {
 *         extend: 'Ext.app.Controller',
 *
 *         config: {
 *             control: {
 *                 loginButton: {
 *                     tap: 'doLogin'
 *                 },
 *                 'button[action=logout]': {
 *                     tap: 'doLogout'
 *                 }
 *             },
 *
 *             refs: {
 *                 loginButton: 'button[action=login]'
 *             }
 *         },
 *
 *         doLogin: function() {
 *             //called whenever the Login button is tapped
 *         },
 *
 *         doLogout: function() {
 *             //called whenever any Button with action=logout is tapped
 *         }
 *     });
 *
 * Here we have set up two control declarations - one for our loginButton ref and the other for any Button on the page
 * that has been given the action 'logout'. For each declaration we passed in a single event handler - in each case
 * listening for the 'tap' event, specifying the action that should be called when that Button fires the tap event.
 * Note that we specified the 'doLogin' and 'doLogout' methods as strings inside the control block - this is important.
 *
 * You can listen to as many events as you like in each control declaration, and mix and match ComponentQuery selectors
 * and refs as the keys.
 *
 * ## Routes
 *
 * As of Sencha Touch 2, Controllers can now directly specify which routes they are interested in. This enables us to
 * provide history support within our app, as well as the ability to deeply link to any part of the application that we
 * provide a route for.
 *
 * For example, let's say we have a Controller responsible for logging in and viewing user profiles, and want to make
 * those screens accessible via urls. We could achieve that like this:
 *
 *     Ext.define('MyApp.controller.Users', {
 *         extend: 'Ext.app.Controller',
 *
 *         config: {
 *             routes: {
 *                 'login': 'showLogin',
 *                 'user/:id': 'showUserById'
 *             },
 *
 *             refs: {
 *                 main: '#mainTabPanel'
 *             }
 *         },
 *
 *         //uses our 'main' ref above to add a loginpanel to our main TabPanel (note that
 *         //'loginpanel' is a custom xtype created for this application)
 *         showLogin: function() {
 *             this.getMain().add({
 *                 xtype: 'loginpanel'
 *             });
 *         },
 *
 *         //Loads the User then adds a 'userprofile' view to the main TabPanel
 *         showUserById: function(id) {
 *             MyApp.model.User.load(id, {
 *                 scope: this,
 *                 success: function(user) {
 *                     this.getMain().add({
 *                         xtype: 'userprofile',
 *                         user: user
 *                     });
 *                 }
 *             });
 *         }
 *     });
 *
 * The routes we specified above simply map the contents of the browser address bar to a Controller function to call
 * when that route is matched. The routes can be simple text like the login route, which matches against
 * http://myapp.com/#login, or contain wildcards like the 'user/:id' route, which matches urls like
 * http://myapp.com/#user/123. Whenever the address changes the Controller automatically calls the function specified.
 *
 * Note that in the showUserById function we had to first load the User instance. Whenever you use a route, the
 * function that is called by that route is completely responsible for loading its data and restoring state. This is
 * because your user could either send that url to another person or simply refresh the page, which we wipe clear any
 * cached data you had already loaded. There is a more thorough discussion of restoring state with routes in the
 * application architecture guides.
 *
 * ## Advanced Usage
 *
 * See [the Controllers guide](#!/guide/controllers) for advanced Controller usage including before filters
 * and customizing for different devices.
 */
Ext.define('Ext.app.Controller', {
    mixins: {
        observable: "Ext.mixin.Observable"
    },

    config: {
        /**
         * @cfg {Object} refs A collection of named {@link Ext.ComponentQuery ComponentQuery} selectors that makes it
         * easy to get references to key Components on your page. Example usage:
         *
         *     refs: {
         *         main: '#mainTabPanel',
         *         loginButton: '#loginWindow button[action=login]',
         *
         *         infoPanel: {
         *             selector: 'infopanel',
         *             xtype: 'infopanel',
         *             autoCreate: true
         *         }
         *     }
         *
         * The first two are simple ComponentQuery selectors, the third (infoPanel) also passes in the autoCreate and
         * xtype options, which will first run the ComponentQuery to see if a Component matching that selector exists
         * on the page. If not, it will automatically create one using the xtype provided:
         *
         *     someControllerFunction: function() {
         *         //if the info panel didn't exist before, calling its getter will instantiate
         *         //it automatically and return the new instance
         *         this.getInfoPanel().show();
         *     }
         *
         * @accessor
         */
        refs: {},

        /**
         * @cfg {Object} routes Provides a mapping of urls to Controller actions. Whenever the specified url is matched
         * in the address bar, the specified Controller action is called. Example usage:
         *
         *     routes: {
         *         'login': 'showLogin',
         *         'users/:id': 'showUserById'
         *     }
         *
         * The first route will match against http://myapp.com/#login and call the Controller's showLogin function. The
         * second route contains a wildcard (':id') and will match all urls like http://myapp.com/#users/123, calling
         * the showUserById function with the matched ID as the first argument.
         *
         * @accessor
         */
        routes: {},

        /**
         * @cfg {Object} control Provides a mapping of Controller functions that should be called whenever certain
         * Component events are fired. The Components can be specified using {@link Ext.ComponentQuery ComponentQuery}
         * selectors or {@link #refs}. Example usage:
         *
         *     control: {
         *         'button[action=logout]': {
         *             tap: 'doLogout'
         *         },
         *         main: {
         *             activeitemchange: 'doUpdate'
         *         }
         *     }
         *
         * The first item uses a ComponentQuery selector to run the Controller's doLogout function whenever any Button
         * with action=logout is tapped on. The second calls the Controller's doUpdate function whenever the
         * activeitemchange event is fired by the Component referenced by our 'main' ref. In this case main is a tab
         * panel (see {@link #refs} for how to set that reference up).
         *
         * @accessor
         */
        control: {},

        /**
         * @cfg {Object} before Provides a mapping of Controller functions to filter functions that are run before them
         * when dispatched to from a route. These are usually used to run pre-processing functions like authentication
         * before a certain function is executed. They are only called when dispatching from a route. Example usage:
         *
         *     Ext.define('MyApp.controller.Products', {
         *         config: {
         *             before: {
         *                 editProduct: 'authenticate'
         *             },
         *
         *             routes: {
         *                 'product/edit/:id': 'editProduct'
         *             }
         *         },
         *
         *         //this is not directly because our before filter is called first
         *         editProduct: function() {
         *             //... performs the product editing logic
         *         },
         *
         *         //this is run before editProduct
         *         authenticate: function(action) {
         *             MyApp.authenticate({
         *                 success: function() {
         *                     action.resume();
         *                 },
         *                 failure: function() {
         *                     Ext.Msg.alert('Not Logged In', "You can't do that, you're not logged in");
         *                 }
         *             });
         *         }
         *     });
         *
         * @accessor
         */
        before: {},

        /**
         * @cfg {Ext.app.Application} application The Application instance this Controller is attached to. This is
         * automatically provided when using the MVC architecture so should rarely need to be set directly.
         * @accessor
         */
        application: {},

        /**
         * @cfg {String[]} stores The set of stores to load for this Application. Each store is expected to
         * exist inside the *app/store* directory and define a class following the convention
         * AppName.store.StoreName. For example, in the code below, the *AppName.store.Users* class will be loaded.
         * Note that we are able to specify either the full class name (as with *AppName.store.Groups*) or just the
         * final part of the class name and leave Application to automatically prepend *AppName.store.'* to each:
         *
         *     stores: [
         *         'Users',
         *         'AppName.store.Groups',
         *         'SomeCustomNamespace.store.Orders'
         *     ]
         * @accessor
         */
        stores: [],

        /**
         * @cfg {String[]} models The set of models to load for this Application. Each model is expected to exist inside the
         * *app/model* directory and define a class following the convention AppName.model.ModelName. For example, in the
         * code below, the classes *AppName.model.User*, *AppName.model.Group* and *AppName.model.Product* will be loaded.
         * Note that we are able to specify either the full class name (as with *AppName.model.Product*) or just the
         * final part of the class name and leave Application to automatically prepend *AppName.model.* to each:
         *
         *     models: [
         *         'User',
         *         'Group',
         *         'AppName.model.Product',
         *         'SomeCustomNamespace.model.Order'
         *     ]
         * @accessor
         */
        models: [],

        /**
         * @cfg {Array} views The set of views to load for this Application. Each view is expected to exist inside the
         * *app/view* directory and define a class following the convention AppName.view.ViewName. For example, in the
         * code below, the classes *AppName.view.Users*, *AppName.view.Groups* and *AppName.view.Products* will be loaded.
         * Note that we are able to specify either the full class name (as with *AppName.view.Products*) or just the
         * final part of the class name and leave Application to automatically prepend *AppName.view.* to each:
         *
         *     views: [
         *         'Users',
         *         'Groups',
         *         'AppName.view.Products',
         *         'SomeCustomNamespace.view.Orders'
         *     ]
         * @accessor
         */
        views: []
    },

    /**
     * Constructs a new Controller instance
     */
    constructor: function(config) {
        this.initConfig(config);

        this.mixins.observable.constructor.call(this, config);
    },

    /**
     * @cfg
     * Called by the Controller's {@link #application} to initialize the Controller. This is always called before the
     * {@link Ext.app.Application Application} launches, giving the Controller a chance to run any pre-launch logic.
     * See also {@link #launch}, which is called after the {@link Ext.app.Application#launch Application's launch function}
     */
    init: Ext.emptyFn,

    /**
     * @cfg
     * Called by the Controller's {@link #application} immediately after the Application's own
     * {@link Ext.app.Application#launch launch function} has been called. This is usually a good place to run any
     * logic that has to run after the app UI is initialized. See also {@link #init}, which is called before the
     * {@link Ext.app.Application#launch Application's launch function}.
     */
    launch: Ext.emptyFn,

    /**
     * Convenient way to redirect to a new url. See {@link Ext.app.Application#redirectTo} for full usage information.
     * @return {Object}
     */
    redirectTo: function(place) {
        return this.getApplication().redirectTo(place);
    },

    /**
     * @private
     * Executes an Ext.app.Action by giving it the correct before filters and kicking off execution
     */
    execute: function(action, skipFilters) {
        action.setBeforeFilters(this.getBefore()[action.getAction()]);
        action.execute();
    },

    /**
     * @private
     * Massages the before filters into an array of function references for each controller action
     */
    applyBefore: function(before) {
        var filters, name, length, i;

        for (name in before) {
            filters = Ext.Array.from(before[name]);
            length  = filters.length;

            for (i = 0; i < length; i++) {
                filters[i] = this[filters[i]];
            }

            before[name] = filters;
        }

        return before;
    },

    /**
     * @private
     */
    applyControl: function(config) {
        this.control(config, this);

        return config;
    },

    /**
     * @private
     */
    applyRefs: function(refs) {
        //<debug>
        if (Ext.isArray(refs)) {
            Ext.Logger.deprecate("In Sencha Touch 2 the refs config accepts an object but you have passed it an array.");
        }
        //</debug>

        this.ref(refs);

        return refs;
    },

    /**
     * @private
     * Adds any routes specified in this Controller to the global Application router
     */
    applyRoutes: function(routes) {
        var app    = this instanceof Ext.app.Application ? this : this.getApplication(),
            router = app.getRouter(),
            route, url, config;

        for (url in routes) {
            route = routes[url];

            config = {
                controller: this.$className
            };

            if (Ext.isString(route)) {
                config.action = route;
            } else {
                Ext.apply(config, route);
            }

            router.connect(url, config);
        }

        return routes;
    },

    /**
     * @private
     * As a convenience developers can locally qualify store names (e.g. 'MyStore' vs
     * 'MyApp.store.MyStore'). This just makes sure everything ends up fully qualified
     */
    applyStores: function(stores) {
        return this.getFullyQualified(stores, 'store');
    },

    /**
     * @private
     * As a convenience developers can locally qualify model names (e.g. 'MyModel' vs
     * 'MyApp.model.MyModel'). This just makes sure everything ends up fully qualified
     */
    applyModels: function(models) {
        return this.getFullyQualified(models, 'model');
    },

    /**
     * @private
     * As a convenience developers can locally qualify view names (e.g. 'MyView' vs
     * 'MyApp.view.MyView'). This just makes sure everything ends up fully qualified
     */
    applyViews: function(views) {
        return this.getFullyQualified(views, 'view');
    },

    /**
     * @private
     * Returns the fully qualified name for any class name variant. This is used to find the FQ name for the model,
     * view, controller, store and profiles listed in a Controller or Application.
     * @param {String[]} items The array of strings to get the FQ name for
     * @param {String} namespace If the name happens to be an application class, add it to this namespace
     * @return {String} The fully-qualified name of the class
     */
    getFullyQualified: function(items, namespace) {
        var length  = items.length,
            appName = this.getApplication().getName(),
            name, i;

        for (i = 0; i < length; i++) {
            name = items[i];

            //we check name === appName to allow MyApp.profile.MyApp to exist
            if (Ext.isString(name) && (Ext.Loader.getPrefix(name) === "" || name === appName)) {
                items[i] = appName + '.' + namespace + '.' + name;
            }
        }

        return items;
    },

    /**
     * @private
     */
    control: function(selectors) {
        this.getApplication().control(selectors, this);
    },

    /**
     * @private
     * 1.x-inspired ref implementation
     */
    ref: function(refs) {
        var me = this,
            refName, getterName, selector, info;

        for (refName in refs) {
            selector = refs[refName];
            getterName = "get" + Ext.String.capitalize(refName);

            if (!this[getterName]) {
                if (Ext.isString(refs[refName])) {
                    info = {
                        ref: refName,
                        selector: selector
                    };
                } else {
                    info = refs[refName];
                }

                this[getterName] = function(refName, info) {
                    var args = [refName, info];
                    return function() {
                        return me.getRef.apply(me, args.concat.apply(args, arguments));
                    };
                }(refName, info);
            }

            this.references = this.references || [];
            this.references.push(refName.toLowerCase());
        }
    },

    /**
     * @private
     */
    getRef: function(ref, info, config) {
        this.refCache = this.refCache || {};
        info = info || {};
        config = config || {};

        Ext.apply(info, config);

        if (info.forceCreate) {
            return Ext.ComponentManager.create(info, 'component');
        }

        var me = this,
            cached = me.refCache[ref];

        if (!cached) {
            me.refCache[ref] = cached = Ext.ComponentQuery.query(info.selector)[0];
            if (!cached && info.autoCreate) {
                me.refCache[ref] = cached = Ext.ComponentManager.create(info, 'component');
            }
            if (cached) {
                cached.on('destroy', function() {
                    me.refCache[ref] = null;
                });
            }
        }

        return cached;
    },

    /**
     * @private
     */
    hasRef: function(ref) {
        return this.references && this.references.indexOf(ref.toLowerCase()) !== -1;
    }

    // <deprecated product=touch since=2.0>
    ,onClassExtended: function(cls, members) {
        var prototype = this.prototype,
            defaultConfig = prototype.config,
            config = members.config || {},
            arrayRefs = members.refs,
            objectRefs = {},
            stores = members.stores,
            views = members.views,
            format = Ext.String.format,
            refItem, key, length, i, functionName;

        // Convert deprecated properties in application into a config object
        for (key in defaultConfig) {
            if (key in members && key != "control") {
                if (key == "refs") {
                    //we need to convert refs from the 1.x array-style to 2.x object-style
                    for (i = 0; i < arrayRefs.length; i++) {
                        refItem = arrayRefs[i];

                        objectRefs[refItem.ref] = refItem;
                    }

                    config.refs = objectRefs;
                } else {
                    config[key] = members[key];
                }

                delete members[key];
                // <debug warn>
                Ext.Logger.deprecate(key + ' is deprecated as a property directly on the ' + this.$className + ' prototype. Please put it inside the config object.');
                // </debug>
            }
        }

        if (stores) {
            length = stores.length;
            config.stores = stores;
            for (i = 0; i < length; i++) {
                functionName = format("get{0}Store", Ext.String.capitalize(stores[i]));

                prototype[functionName] = function(name) {
                    return function() {
                        return Ext.StoreManager.lookup(name);
                    };
                }(stores[i]);
            }
        }

        if (views) {
            length = views.length;
            config.views = views;
            for (i = 0; i < length; i++) {
                functionName = format("get{0}View", views[i]);

                prototype[functionName] = function(name) {
                    return function() {
                        return Ext.ClassManager.classes[format("{0}.view.{1}", this.getApplication().getName(), name)];
                    };
                }(views[i]);
            }
        }

        members.config = config;
    },

    /**
     * Returns a reference to a Model.
     * @param modelName
     * @return {Object}
     * @deprecated 2.0.0 Considered bad practice - please just use the Model name instead
     * (e.g. `MyApp.model.User` vs `this.getModel('User')`).
     */
    getModel: function(modelName) {
        //<debug warn>
        Ext.Logger.deprecate("getModel() is deprecated and considered bad practice - please just use the Model " +
            "name instead (e.g. MyApp.model.User vs this.getModel('User'))");
        //</debug>

        var appName = this.getApplication().getName(),
            classes = Ext.ClassManager.classes;

        return classes[appName + '.model.' + modelName];
    },

    /**
     * Returns a reference to another Controller.
     * @param controllerName
     * @param profile
     * @return {Object}
     * @deprecated 2.0.0 Considered bad practice - if you need to do this
     * please use this.getApplication().getController() instead
     */
    getController: function(controllerName, profile) {
        //<debug warn>
        Ext.Logger.deprecate("Ext.app.Controller#getController is deprecated and considered bad practice - " +
            "please use this.getApplication().getController('someController') instead");
        //</debug>

        return this.getApplication().getController(controllerName, profile);
    }
    // </deprecated>
}, function() {
    // <deprecated product=touch since=2.0>
    Ext.regController = function(name, config) {
        Ext.apply(config, {
            extend: 'Ext.app.Controller'
        });

        Ext.Logger.deprecate(
            '[Ext.app.Controller] Ext.regController is deprecated, please use Ext.define to define a Controller as ' +
            'with any other class. For more information see the Touch 1.x -> 2.x migration guide'
        );
        Ext.define('controller.' + name, config);
    };
    // </deprecated>
});
