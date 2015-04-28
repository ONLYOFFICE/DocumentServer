/**
 * @author Ed Spencer
 *
 * A Profile represents a range of devices that fall under a common category. For the vast majority of apps that use
 * device profiles, the app defines a Phone profile and a Tablet profile. Doing this enables you to easily customize
 * the experience for the different sized screens offered by those device types.
 *
 * Only one Profile can be active at a time, and each Profile defines a simple {@link #isActive} function that should
 * return either true or false. The first Profile to return true from its isActive function is set as your Application's
 * {@link Ext.app.Application#currentProfile current profile}.
 *
 * A Profile can define any number of {@link #models}, {@link #views}, {@link #controllers} and {@link #stores} which
 * will be loaded if the Profile is activated. It can also define a {@link #launch} function that will be called after
 * all of its dependencies have been loaded, just before the {@link Ext.app.Application#launch application launch}
 * function is called.
 *
 * ## Sample Usage
 *
 * First you need to tell your Application about your Profile(s):
 *
 *     Ext.application({
 *         name: 'MyApp',
 *         profiles: ['Phone', 'Tablet']
 *     });
 *
 * This will load app/profile/Phone.js and app/profile/Tablet.js. Here's how we might define the Phone profile:
 *
 *     Ext.define('MyApp.profile.Phone', {
 *         extend: 'Ext.app.Profile',
 *
 *         views: ['Main'],
 *
 *         isActive: function() {
 *             return Ext.os.is.Phone;
 *         }
 *     });
 *
 * The isActive function returns true if we detect that we are running on a phone device. If that is the case the
 * Application will set this Profile active and load the 'Main' view specified in the Profile's {@link #views} config.
 *
 * ## Class Specializations
 *
 * Because Profiles are specializations of an application, all of the models, views, controllers and stores defined
 * in a Profile are expected to be namespaced under the name of the Profile. Here's an expanded form of the example
 * above:
 *
 *     Ext.define('MyApp.profile.Phone', {
 *         extend: 'Ext.app.Profile',
 *
 *         views: ['Main'],
 *         controllers: ['Signup'],
 *         models: ['MyApp.model.Group'],
 *
 *         isActive: function() {
 *             return Ext.os.is.Phone;
 *         }
 *     });
 *
 * In this case, the Profile is going to load *app/view/phone/Main.js*, *app/controller/phone/Signup.js* and
 * *app/model/Group.js*. Notice that in each of the first two cases the name of the profile ('phone' in this case) was
 * injected into the class names. In the third case we specified the full Model name (for Group) so the Profile name
 * was not injected.
 *
 * For a fuller understanding of the ideas behind Profiles and how best to use them in your app, we suggest you read
 * the [device profiles guide](#!/guide/profiles).
 * 
 * @aside guide profiles
 */
Ext.define('Ext.app.Profile', {
    mixins: {
        observable: "Ext.mixin.Observable"
    },

    config: {
        /**
         * @cfg {String} namespace The namespace that this Profile's classes can be found in. Defaults to the lowercased
         * Profile {@link #name}, for example a Profile called MyApp.profile.Phone will by default have a 'phone'
         * namespace, which means that this Profile's additional models, stores, views and controllers will be loaded
         * from the MyApp.model.phone.*, MyApp.store.phone.*, MyApp.view.phone.* and MyApp.controller.phone.* namespaces
         * respectively.
         * @accessor
         */
        namespace: 'auto',

        /**
         * @cfg {String} name The name of this Profile. Defaults to the last section of the class name (e.g. a profile
         * called MyApp.profile.Phone will default the name to 'Phone').
         * @accessor
         */
        name: 'auto',

        /**
         * @cfg {Array} controllers Any additional {@link Ext.app.Application#controllers Controllers} to load for this
         * profile. Note that each item here will be prepended with the Profile namespace when loaded. Example usage:
         *
         *     controllers: [
         *         'Users',
         *         'MyApp.controller.Products'
         *     ]
         *
         * This will load *MyApp.controller.tablet.Users* and *MyApp.controller.Products*.
         * @accessor
         */
        controllers: [],

        /**
         * @cfg {Array} models Any additional {@link Ext.app.Application#models Models} to load for this profile. Note
         * that each item here will be prepended with the Profile namespace when loaded. Example usage:
         *
         *     models: [
         *         'Group',
         *         'MyApp.model.User'
         *     ]
         *
         * This will load *MyApp.model.tablet.Group* and *MyApp.model.User*.
         * @accessor
         */
        models: [],

        /**
         * @cfg {Array} views Any additional {@link Ext.app.Application#views views} to load for this profile. Note
         * that each item here will be prepended with the Profile namespace when loaded. Example usage:
         *
         *     views: [
         *         'Main',
         *         'MyApp.view.Login'
         *     ]
         *
         * This will load *MyApp.view.tablet.Main* and *MyApp.view.Login*.
         * @accessor
         */
        views: [],

        /**
         * @cfg {Array} stores Any additional {@link Ext.app.Application#stores Stores} to load for this profile. Note
         * that each item here will be prepended with the Profile namespace when loaded. Example usage:
         *
         *     stores: [
         *         'Users',
         *         'MyApp.store.Products'
         *     ]
         *
         * This will load *MyApp.store.tablet.Users* and *MyApp.store.Products*.
         * @accessor
         */
        stores: [],

        /**
         * @cfg {Ext.app.Application} application The {@link Ext.app.Application Application} instance that this
         * Profile is bound to. This is set automatically.
         * @accessor
         * @readonly
         */
        application: null
    },

    /**
     * Creates a new Profile instance
     */
    constructor: function(config) {
        this.initConfig(config);

        this.mixins.observable.constructor.apply(this, arguments);
    },

    /**
     * Determines whether or not this Profile is active on the device isActive is executed on. Should return true if
     * this profile is meant to be active on this device, false otherwise. Each Profile should implement this function
     * (the default implementation just returns false).
     * @return {Boolean} True if this Profile should be activated on the device it is running on, false otherwise
     */
    isActive: function() {
        return false;
    },

    /**
     * @method
     * The launch function is called by the {@link Ext.app.Application Application} if this Profile's {@link #isActive}
     * function returned true. This is typically the best place to run any profile-specific app launch code. Example
     * usage:
     *
     *     launch: function() {
     *         Ext.create('MyApp.view.tablet.Main');
     *     }
     */
    launch: Ext.emptyFn,

    /**
     * @private
     */
    applyNamespace: function(name) {
        if (name == 'auto') {
            name = this.getName();
        }

        return name.toLowerCase();
    },

    /**
     * @private
     */
    applyName: function(name) {
        if (name == 'auto') {
            var pieces = this.$className.split('.');
            name = pieces[pieces.length - 1];
        }

        return name;
    },

    /**
     * @private
     * Computes the full class names of any specified model, view, controller and store dependencies, returns them in
     * an object map for easy loading
     */
    getDependencies: function() {
        var allClasses = [],
            format = Ext.String.format,
            appName = this.getApplication().getName(),
            namespace = this.getNamespace(),
            map = {
                model: this.getModels(),
                view: this.getViews(),
                controller: this.getControllers(),
                store: this.getStores()
            },
            classType, classNames, fullyQualified;

        for (classType in map) {
            classNames = [];

            Ext.each(map[classType], function(className) {
                if (Ext.isString(className)) {
                    //we check name === appName to allow MyApp.profile.MyApp to exist
                    if (Ext.isString(className) && (Ext.Loader.getPrefix(className) === "" || className === appName)) {
                        className = appName + '.' + classType + '.' + namespace + '.' + className;
                    }

                    classNames.push(className);
                    allClasses.push(className);
                }
            }, this);

            map[classType] = classNames;
        }

        map.all = allClasses;

        return map;
    }
});