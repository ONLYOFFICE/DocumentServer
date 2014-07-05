/**
 * @author Ed Spencer
 *
 * @aside guide apps_intro
 * @aside guide first_app
 * @aside video mvc-part-1
 * @aside video mvc-part-2
 *
 * Ext.app.Application defines the set of {@link Ext.data.Model Models}, {@link Ext.app.Controller Controllers},
 * {@link Ext.app.Profile Profiles}, {@link Ext.data.Store Stores} and {@link Ext.Component Views} that an application
 * consists of. It automatically loads all of those dependencies and can optionally specify a {@link #launch} function
 * that will be called when everything is ready.
 *
 * Sample usage:
 *
 *     Ext.application({
 *         name: 'MyApp',
 *
 *         models: ['User', 'Group'],
 *         stores: ['Users'],
 *         controllers: ['Users'],
 *         views: ['Main', 'ShowUser'],
 *
 *         launch: function() {
 *             Ext.create('MyApp.view.Main');
 *         }
 *     });
 *
 * Creating an Application instance is the only time in Sencha Touch 2 that we don't use Ext.create to create the new
 * instance. Instead, the {@link Ext#application} function instantiates an Ext.app.Application internally,
 * automatically loading the Ext.app.Application class if it is not present on the page already and hooking in to
 * {@link Ext#onReady} before creating the instance itself. An alternative is to use Ext.create inside an Ext.onReady
 * callback, but Ext.application is preferred.
 *
 * ## Dependencies
 *
 * Application follows a simple convention when it comes to specifying the controllers, views, models, stores and
 * profiles it requires. By default it expects each of them to be found inside the *app/controller*, *app/view*,
 * *app/model*, *app/store* and *app/profile* directories in your app - if you follow this convention you can just
 * specify the last part of each class name and Application will figure out the rest for you:
 *
 *     Ext.application({
 *         name: 'MyApp',
 *
 *         controllers: ['Users'],
 *         models: ['User', 'Group'],
 *         stores: ['Users'],
 *         views: ['Main', 'ShowUser']
 *     });
 *
 * The example above will load 6 files:
 *
 * - app/model/User.js
 * - app/model/Group.js
 * - app/store/Users.js
 * - app/controller/Users.js
 * - app/view/Main.js
 * - app/view/ShowUser.js
 *
 * ### Nested Dependencies
 *
 * For larger apps it's common to split the models, views and controllers into subfolders so keep the project
 * organized. This is especially true of views - it's not unheard of for large apps to have over a hundred separate
 * view classes so organizing them into folders can make maintenance much simpler.
 *
 * To specify dependencies in subfolders just use a period (".") to specify the folder:
 *
 *     Ext.application({
 *         name: 'MyApp',
 *
 *         controllers: ['Users', 'nested.MyController'],
 *         views: ['products.Show', 'products.Edit', 'user.Login']
 *     });
 *
 * In this case these 5 files will be loaded:
 *
 * - app/controller/Users.js
 * - app/controller/nested/MyController.js
 * - app/view/products/Show.js
 * - app/view/products/Edit.js
 * - app/view/user/Login.js
 *
 * Note that we can mix and match within each configuration here - for each model, view, controller, profile or store
 * you can specify either just the final part of the class name (if you follow the directory conventions), or the full
 * class name.
 *
 * ### External Dependencies
 *
 * Finally, we can specify application dependencies from outside our application by fully-qualifying the classes we
 * want to load. A common use case for this is sharing authentication logic between multiple applications. Perhaps you
 * have several apps that login via a common user database and you want to share that code between them. An easy way to
 * do this is to create a folder alongside your app folder and then add its contents as dependencies for your app.
 *
 * For example, let's say our shared login code contains a login controller, a user model and a login form view. We
 * want to use all of these in our application:
 *
 *     Ext.Loader.setPath({
 *         'Auth': 'Auth'
 *     });
 *
 *     Ext.application({
 *         views: ['Auth.view.LoginForm', 'Welcome'],
 *         controllers: ['Auth.controller.Sessions', 'Main'],
 *         models: ['Auth.model.User']
 *     });
 *
 * This will load the following files:
 *
 * - Auth/view/LoginForm.js
 * - Auth/controller/Sessions.js
 * - Auth/model/User.js
 * - app/view/Welcome.js
 * - app/controller/Main.js
 *
 * The first three were loaded from outside our application, the last two from the application itself. Note how we can
 * still mix and match application files and external dependency files.
 *
 * Note that to enable the loading of external dependencies we just have to tell the Loader where to find those files,
 * which is what we do with the Ext.Loader.setPath call above. In this case we're telling the Loader to find any class
 * starting with the 'Auth' namespace inside our 'Auth' folder. This means we can drop our common Auth code into our
 * application alongside the app folder and the framework will be able to figure out how to load everything.
 *
 * ## Launching
 *
 * Each Application can define a {@link Ext.app.Application#launch launch} function, which is called as soon as all of
 * your app's classes have been loaded and the app is ready to be launched. This is usually the best place to put any
 * application startup logic, typically creating the main view structure for your app.
 *
 * In addition to the Application launch function, there are two other places you can put app startup logic. Firstly,
 * each Controller is able to define an {@link Ext.app.Controller#init init} function, which is called before the
 * Application launch function. Secondly, if you are using Device Profiles, each Profile can define a
 * {@link Ext.app.Profile#launch launch} function, which is called after the Controller init functions but before the
 * Application launch function.
 *
 * Note that only the active Profile has its launch function called - for example if you define profiles for Phone and
 * Tablet and then launch the app on a tablet, only the Tablet Profile's launch function is called.
 *
 * 1. Controller#init functions called
 * 2. Profile#launch function called
 * 3. Application#launch function called
 * 4. Controller#launch functions called
 *
 * When using Profiles it is common to place most of the bootup logic inside the Profile launch function because each
 * Profile has a different set of views that need to be constructed at startup.
 *
 * ## Adding to Home Screen
 *
 * iOS devices allow your users to add your app to their home screen for easy access. iOS allows you to customize
 * several aspects of this, including the icon that will appear on the home screen and the startup image. These can be
 * specified in the Ext.application setup block:
 *
 *     Ext.application({
 *         name: 'MyApp',
 *
 *         {@link #icon}: 'resources/img/icon.png',
 *         {@link #isIconPrecomposed}: false,
 *         {@link #startupImage}: {
 *             '320x460': 'resources/startup/320x460.jpg',
 *             '640x920': 'resources/startup/640x920.png',
 *             '640x1096': 'resources/startup/640x1096.png',
 *             '768x1004': 'resources/startup/768x1004.png',
 *             '748x1024': 'resources/startup/748x1024.png',
 *             '1536x2008': 'resources/startup/1536x2008.png',
 *             '1496x2048': 'resources/startup/1496x2048.png'
 *         }
 *     });
 *
 * When the user adds your app to the home screen, your resources/img/icon.png file will be used as the application
 * {@link #icon}. We also used the {@link #isIconPrecomposed} configuration to turn off the gloss effect that is automatically added
 * to icons in iOS. Finally we used the {@link #startupImage} configuration to provide the images that will be displayed 
 * while your application is starting up. See also {@link #statusBarStyle}.
 *
 * ## Find out more
 *
 * If you are not already familiar with writing applications with Sencha Touch 2 we recommend reading the
 * [intro to applications guide](#!/guide/apps_intro), which lays out the core principles of writing apps
 * with Sencha Touch 2.
 */
Ext.define('Ext.app.Application', {
    extend: 'Ext.app.Controller',

    requires: [
        'Ext.app.History',
        'Ext.app.Profile',
        'Ext.app.Router',
        'Ext.app.Action'
    ],

    config: {
        /**
         * @cfg {String/Object} icon
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
         *     Ext.application({
         *         icon: 'resources/icons/Icon.png',
         *         launch: function() {
         *             // ...
         *         }
         *     });
         */
        
        /**
         * @cfg {Object} startupImage
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
         */
        
        /**
         * @cfg {Boolean} isIconPrecomposed
         * `true` to not having a glossy effect added to the icon by the OS, which will preserve its exact look. This currently
         * only applies to iOS devices.
         */

        /**
         * @cfg {String} [statusBarStyle='black'] Allows you to set the style of the status bar when your app is added to the
         * home screen on iOS devices. Alternative is to set to 'black-translucent', which turns
         * the status bar semi-transparent and overlaps the app content. This is usually not a good option for web apps
         */
        
        /**
         * @cfg {String} tabletIcon Path to the _.png_ image file to use when your app is added to the home screen on an
         * iOS **tablet** device (iPad).
         * @deprecated 2.0.0 Please use the {@link #icon} configuration instead.
         */

        /**
         * @cfg {String} phoneIcon Path to the _.png_ image file to use when your app is added to the home screen on an
         * iOS **phone** device (iPhone or iPod).
         * @deprecated 2.0.0 Please use the {@link #icon} configuration instead.
         */

        /**
         * @cfg {Boolean} glossOnIcon If set to `false`, the 'gloss' effect added to home screen {@link #icon icons} on
         * iOS devices will be removed.
         * @deprecated 2.0.0 Please use the {@link #isIconPrecomposed} configuration instead.
         */

        /**
         * @cfg {String} phoneStartupScreen Path to the _.png_ image file that will be displayed while the app is
         * starting up once it has been added to the home screen of an iOS phone device (iPhone or iPod). This _.png_
         * file should be 320px wide and 460px high.
         * @deprecated 2.0.0 Please use the {@link #startupImage} configuration instead.
         */

        /**
         * @cfg {String} tabletStartupScreen Path to the _.png_ image file that will be displayed while the app is
         * starting up once it has been added to the home screen of an iOS tablet device (iPad). This _.png_ file should
         * be 768px wide and 1004px high.
         * @deprecated 2.0.0 Please use the {@link #startupImage} configuration instead.
         */

        /**
         * @cfg {Array} profiles The set of profiles to load for this Application. Each profile is expected to
         * exist inside the *app/profile* directory and define a class following the convention
         * AppName.profile.ProfileName. For example, in the code below, the classes *AppName.profile.Phone*
         * and *AppName.profile.Tablet* will be loaded. Note that we are able to specify
         * either the full class name (as with *AppName.profile.Tablet*) or just the final part of the class name
         * and leave Application to automatically prepend *AppName.profile.'* to each:
         *
         *     profiles: [
         *         'Phone',
         *         'AppName.profile.Tablet',
         *         'SomeCustomNamespace.profile.Desktop'
         *     ]
         * @accessor
         */
        profiles: [],

        /**
         * @cfg {Array} controllers The set of controllers to load for this Application. Each controller is expected to
         * exist inside the *app/controller* directory and define a class following the convention
         * AppName.controller.ControllerName. For example, in the code below, the classes *AppName.controller.Users*,
         * *AppName.controller.Groups* and *AppName.controller.Products* will be loaded. Note that we are able to specify
         * either the full class name (as with *AppName.controller.Products*) or just the final part of the class name
         * and leave Application to automatically prepend *AppName.controller.'* to each:
         *
         *     controllers: [
         *         'Users',
         *         'Groups',
         *         'AppName.controller.Products',
         *         'SomeCustomNamespace.controller.Orders'
         *     ]
         * @accessor
         */
        controllers: [],

        /**
         * @cfg {Ext.app.History} history The global {@link Ext.app.History History} instance attached to this
         * Application.
         * @accessor
         * @readonly
         */
        history: {},

        /**
         * @cfg {String} name The name of the Application. This should be a single word without spaces or periods
         * because it is used as the Application's global namespace. All classes in your application should be
         * namespaced undef the Application's name - for example if your application name is 'MyApp', your classes
         * should be named 'MyApp.model.User', 'MyApp.controller.Users', 'MyApp.view.Main' etc
         * @accessor
         */
        name: null,

        /**
         * @cfg {String} appFolder The path to the directory which contains all application's classes.
         * This path will be registered via {@link Ext.Loader#setPath} for the namespace specified in the {@link #name name} config.
         * @accessor
         */
        appFolder : 'app',

        /**
         * @cfg {Ext.app.Router} router The global {@link Ext.app.Router Router} instance attached to this Application.
         * @accessor
         * @readonly
         */
        router: {},

        /**
         * @cfg {Array} controllerInstances Used internally as the collection of instantiated controllers. Use {@link #getController} instead.
         * @private
         * @accessor
         */
        controllerInstances: [],

        /**
         * @cfg {Array} profileInstances Used internally as the collection of instantiated profiles.
         * @private
         * @accessor
         */
        profileInstances: [],

        /**
         * @cfg {Ext.app.Profile} currentProfile The {@link Ext.app.Profile Profile} that is currently active for the
         * Application. This is set once, automatically by the Application before launch.
         * @accessor
         * @readonly
         */
        currentProfile: null,

        /**
         * @cfg {Function} launch An optional function that will be called when the Application is ready to be
         * launched. This is normally used to render any initial UI required by your application
         * @accessor
         */
        launch: Ext.emptyFn,

        /**
         * @private
         * @cfg {Boolean} enableLoader Private config to disable loading of Profiles at application construct time.
         * This is used by Sencha's unit test suite to test _Application.js_ in isolation and is likely to be removed
         * in favor of a more pleasing solution by the time you use it.
         * @accessor
         */
        enableLoader: true,

        /**
         * @private
         * @cfg {String[]} requires An array of extra dependencies, to be required after this application's {@link #name} config
         * has been processed properly, but before anything else to ensure overrides get executed first.
         * @accessor
         */
        requires: []
    },

    /**
     * Constructs a new Application instance.
     */
    constructor: function(config) {
        config = config || {};

        Ext.applyIf(config, {
            application: this
        });

        this.initConfig(config);

        //it's common to pass in functions to an application but because they are not predictable config names they
        //aren't ordinarily placed onto this so we need to do it manually
        for (var key in config) {
            this[key] = config[key];
        }

        // <deprecated product=touch since=2.0>
        if (config.autoCreateViewport) {
            Ext.Logger.deprecate(
                '[Ext.app.Application] autoCreateViewport has been deprecated in Sencha Touch 2. Please implement a ' +
                'launch function on your Application instead and use Ext.create("MyApp.view.Main") to create your initial UI.'
            );
        }
        // </deprecated>

        //<debug>
        Ext.Loader.setConfig({ enabled: true });
        //</debug>

        Ext.require(this.getRequires(), function() {
            if (this.getEnableLoader() !== false) {
                Ext.require(this.getProfiles(), this.onProfilesLoaded, this);
            }
        }, this);
    },

    /**
     * Dispatches a given {@link Ext.app.Action} to the relevant Controller instance. This is not usually called
     * directly by the developer, instead Sencha Touch's History support picks up on changes to the browser's url
     * and calls dispatch automatically.
     * @param {Ext.app.Action} action The action to dispatch.
     * @param {Boolean} [addToHistory=true] Sets the browser's url to the action's url.
     */
    dispatch: function(action, addToHistory) {
        action = action || {};
        Ext.applyIf(action, {
            application: this
        });

        action = Ext.factory(action, Ext.app.Action);

        if (action) {
            var profile    = this.getCurrentProfile(),
                profileNS  = profile ? profile.getNamespace() : undefined,
                controller = this.getController(action.getController(), profileNS);

            if (controller) {
                if (addToHistory !== false) {
                    this.getHistory().add(action, true);
                }

                controller.execute(action);
            }
        }
    },

    /**
     * Redirects the browser to the given url. This only affects the url after the '#'. You can pass in either a String
     * or a Model instance - if a Model instance is defined its {@link Ext.data.Model#toUrl toUrl} function is called,
     * which returns a string representing the url for that model. Internally, this uses your application's
     * {@link Ext.app.Router Router} to decode the url into a matching controller action and then calls
     * {@link #dispatch}.
     * @param {String/Ext.data.Model} url The String url to redirect to.
     */
    redirectTo: function(url) {
        if (Ext.data && Ext.data.Model && url instanceof Ext.data.Model) {
            var record = url;

            url = record.toUrl();
        }

        var decoded = this.getRouter().recognize(url);

        if (decoded) {
            decoded.url = url;
            if (record) {
                decoded.data = {};
                decoded.data.record = record;
            }
            return this.dispatch(decoded);
        }
    },

    /**
     * @private
     * (documented on Controller's control config)
     */
    control: function(selectors, controller) {
        //if the controller is not defined, use this instead (the application instance)
        controller = controller || this;

        var dispatcher = this.getEventDispatcher(),
            refs = (controller) ? controller.getRefs() : {},
            selector, eventName, listener, listeners, ref;

        for (selector in selectors) {
            if (selectors.hasOwnProperty(selector)) {
                listeners = selectors[selector];
                ref = refs[selector];

                //refs can be used in place of selectors
                if (ref) {
                    selector = ref.selector || ref;
                }
                for (eventName in listeners) {
                    listener = listeners[eventName];

                    if (Ext.isString(listener)) {
                        listener = controller[listener];
                    }

                    dispatcher.addListener('component', selector, eventName, listener, controller);
                }
            }
        }
    },

    /**
     * Returns the Controller instance for the given controller name.
     * @param {String} name The name of the Controller.
     * @param {String} [profileName] Optional profile name. If passed, this is the same as calling
     * `getController('profileName.controllerName')`.
     */
    getController: function(name, profileName) {
        var instances = this.getControllerInstances(),
            appName   = this.getName(),
            format    = Ext.String.format,
            topLevelName;

        if (name instanceof Ext.app.Controller) {
            return name;
        }

        if (instances[name]) {
            return instances[name];
        } else {
            topLevelName = format("{0}.controller.{1}", appName, name);
            profileName  = format("{0}.controller.{1}.{2}", appName, profileName, name);

            return instances[profileName] || instances[topLevelName];
        }
    },

    /**
     * @private
     * Callback that is invoked when all of the configured Profiles have been loaded. Detects the current profile and
     * gathers any additional dependencies from that profile, then loads all of those dependencies.
     */
    onProfilesLoaded: function() {
        var profiles  = this.getProfiles(),
            length    = profiles.length,
            instances = [],
            requires  = this.gatherDependencies(),
            current, i, profileDeps;

        for (i = 0; i < length; i++) {
            instances[i] = Ext.create(profiles[i], {
                application: this
            });

            /*
             * Note that we actually require all of the dependencies for all Profiles - this is so that we can produce
             * a single build file that will work on all defined Profiles. Although the other classes will be loaded,
             * the correct Profile will still be identified and the other classes ignored. While this feels somewhat
             * inefficient, the majority of the bulk of an application is likely to be the framework itself. The bigger
             * the app though, the bigger the effect of this inefficiency so ideally we will create a way to create and
             * load Profile-specific builds in a future release.
             */
            profileDeps = instances[i].getDependencies();
            requires = requires.concat(profileDeps.all);

            if (instances[i].isActive() && !current) {
                current = instances[i];

                this.setCurrentProfile(current);

                this.setControllers(this.getControllers().concat(profileDeps.controller));
                this.setModels(this.getModels().concat(profileDeps.model));
                this.setViews(this.getViews().concat(profileDeps.view));
                this.setStores(this.getStores().concat(profileDeps.store));
            }
        }

        this.setProfileInstances(instances);
        Ext.require(requires, this.loadControllerDependencies, this);
    },

    /**
     * @private
     * Controllers can also specify dependencies, so we grab them all here and require them.
     */
    loadControllerDependencies: function() {
        this.instantiateControllers();

        var controllers = this.getControllerInstances(),
            classes = [],
            stores = [],
            i, controller, controllerStores, name;

        for (name in controllers) {
            controller = controllers[name];
            controllerStores = controller.getStores();
            stores = stores.concat(controllerStores);

            classes = classes.concat(controller.getModels().concat(controller.getViews()).concat(controllerStores));
        }

        this.setStores(this.getStores().concat(stores));

        Ext.require(classes, this.onDependenciesLoaded, this);
    },

    /**
     * @private
     * Callback that is invoked when all of the Application, Controller and Profile dependencies have been loaded.
     * Launches the controllers, then the profile and application.
     */
    onDependenciesLoaded: function() {
        var me = this,
            profile = this.getCurrentProfile(),
            launcher = this.getLaunch(),
            controllers, name;

        this.instantiateStores();

        //<deprecated product=touch since=2.0>
        Ext.app.Application.appInstance = this;

        if (Ext.Router) {
            Ext.Router.setAppInstance(this);
        }
        //</deprecated>

        controllers = this.getControllerInstances();

        for (name in controllers) {
            controllers[name].init(this);
        }

        if (profile) {
            profile.launch();
        }

        launcher.call(me);

        for (name in controllers) {
            //<debug warn>
            if (controllers[name] && !(controllers[name] instanceof Ext.app.Controller)) {
                Ext.Logger.warn("The controller '" + name + "' doesn't have a launch method. Are you sure it extends from Ext.app.Controller?");
            } else {
            //</debug>
                controllers[name].launch(this);
            //<debug warn>
            }
            //</debug>
        }

        me.redirectTo(window.location.hash.substr(1));
    },

    /**
     * @private
     * Gathers up all of the previously computed MVCS dependencies into a single array that we can pass to {@link Ext#require}.
     */
    gatherDependencies: function() {
        var classes = this.getModels().concat(this.getViews()).concat(this.getControllers());

        Ext.each(this.getStores(), function(storeName) {
            if (Ext.isString(storeName)) {
                classes.push(storeName);
            }
        }, this);

        return classes;
    },

    /**
     * @private
     * Should be called after dependencies are loaded, instantiates all of the Stores specified in the {@link #stores}
     * config. For each item in the stores array we make sure the Store is instantiated. When strings are specified,
     * the corresponding _app/store/StoreName.js_ was loaded so we now instantiate a `MyApp.store.StoreName`, giving it the
     * id `StoreName`.
     */
    instantiateStores: function() {
        var stores  = this.getStores(),
            length  = stores.length,
            store, storeClass, storeName, splits, i;

        for (i = 0; i < length; i++) {
            store = stores[i];

            if (Ext.data && Ext.data.Store && !(store instanceof Ext.data.Store)) {
                if (Ext.isString(store)) {
                    storeName = store;
                    storeClass = Ext.ClassManager.classes[store];

                    store = {
                        xclass: store
                    };

                    //we don't want to wipe out a configured storeId in the app's Store subclass so need
                    //to check for this first
                    if (storeClass.prototype.defaultConfig.storeId === undefined) {
                        splits = storeName.split('.');
                        store.id = splits[splits.length - 1];
                    }
                }

                stores[i] = Ext.factory(store, Ext.data.Store);
            }
        }

        this.setStores(stores);
    },

    /**
     * @private
     * Called once all of our controllers have been loaded
     */
    instantiateControllers: function() {
        var controllerNames = this.getControllers(),
            instances = {},
            length = controllerNames.length,
            name, i;

        for (i = 0; i < length; i++) {
            name = controllerNames[i];

            instances[name] = Ext.create(name, {
                application: this
            });
        }

        return this.setControllerInstances(instances);
    },

    /**
     * @private
     * As a convenience developers can locally qualify controller names (e.g. 'MyController' vs
     * 'MyApp.controller.MyController'). This just makes sure everything ends up fully qualified
     */
    applyControllers: function(controllers) {
        return this.getFullyQualified(controllers, 'controller');
    },

    /**
     * @private
     * As a convenience developers can locally qualify profile names (e.g. 'MyProfile' vs
     * 'MyApp.profile.MyProfile'). This just makes sure everything ends up fully qualified
     */
    applyProfiles: function(profiles) {
        return this.getFullyQualified(profiles, 'profile');
    },

    /**
     * @private
     * Checks that the name configuration has any whitespace, and trims them if found.
     */
    applyName: function(name) {
        var oldName;
        if (name && name.match(/ /g)) {
            oldName = name;
            name = name.replace(/ /g, "");

            // <debug>
            Ext.Logger.warn('Attempting to create an application with a name which contains whitespace ("' + oldName + '"). Renamed to "' + name + '".');
            // </debug>
        }

        return name;
    },

    /**
     * @private
     * Makes sure the app namespace exists, sets the `app` property of the namespace to this application and sets its
     * loading path (checks to make sure the path hadn't already been set via Ext.Loader.setPath)
     */
    updateName: function(newName) {
        Ext.ClassManager.setNamespace(newName + '.app', this);

        if (!Ext.Loader.config.paths[newName]) {
            Ext.Loader.setPath(newName, this.getAppFolder());
        }
    },

    /**
     * @private
     */
    applyRouter: function(config) {
        return Ext.factory(config, Ext.app.Router, this.getRouter());
    },

    /**
     * @private
     */
    applyHistory: function(config) {
        var history = Ext.factory(config, Ext.app.History, this.getHistory());

        history.on('change', this.onHistoryChange, this);

        return history;
    },

    /**
     * @private
     */
    onHistoryChange: function(url) {
        this.dispatch(this.getRouter().recognize(url), false);
    }
}, function() {
    // <deprecated product=touch since=2.0>
    Ext.regApplication = function(config) {
        Ext.Logger.deprecate(
            '[Ext.app.Application] Ext.regApplication() is deprecated, please replace it with Ext.application()'
        );

        var appName = config.name,
            format  = Ext.String.format;

        Ext.ns(
            appName,
            format("{0}.controllers", appName),
            format("{0}.models", appName),
            format("{0}.views", appName)
        );

        Ext.application(config);
    };

    Ext.define('Ext.data.ProxyMgr', {
        singleton: true,

        registerType: function(name, cls) {
            Ext.Logger.deprecate(
                'Ext.data.ProxyMgr no longer exists - instead of calling Ext.data.ProxyMgr.registerType just update ' +
                'your custom Proxy class to set alias: "proxy.' + name + '"'
            );

            Ext.ClassManager.setAlias(cls, "proxy." + name);
        }
    });

    Ext.reg = function(alias, cls) {
        Ext.Logger.deprecate(
            'Ext.reg is deprecated, please set xtype: "' + alias + '" directly in your subclass instead'
        );

        Ext.ClassManager.setAlias(cls, alias);
    };

    Ext.redirect = function() {
        var app = Ext.app.Application.appInstance;

        Ext.Logger.deprecate('[Ext.app.Application] Ext.redirect is deprecated, please use YourApp.redirectTo instead');

        if (app) {
            app.redirectTo.apply(app, arguments);
        }
    };

    Ext.dispatch = function() {
        var app = Ext.app.Application.appInstance;

        Ext.Logger.deprecate('[Ext.app.Application] Ext.dispatch is deprecated, please use YourApp.dispatch instead');

        if (app) {
            app.dispatch.apply(app, arguments);
        }
    };

    // </deprecated>
});
