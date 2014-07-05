/**
 * @author Ed Spencer
 * @private
 *
 * The Router is an ordered set of route definitions that decode a url into a controller function to execute. Each
 * route defines a type of url to match, along with the controller function to call if it is matched. The Router is
 * usually managed exclusively by an {@link Ext.app.Application Application}, which also uses a
 * {@link Ext.app.History History} instance to find out when the browser's url has changed.
 *
 * Routes are almost always defined inside a {@link Ext.app.Controller Controller}, as opposed to on the Router itself.
 * End-developers should not usually need to interact directly with the Router as the Application and Controller
 * classes manage everything automatically. See the {@link Ext.app.Controller Controller documentation} for more
 * information on specifying routes.
 */
Ext.define('Ext.app.Router', {
    requires: ['Ext.app.Route'],

    config: {
        /**
         * @cfg {Array} routes The set of routes contained within this Router.
         * @readonly
         */
        routes: [],

        /**
         * @cfg {Object} defaults Default configuration options for each Route connected to this Router.
         */
        defaults: {
            action: 'index'
        }
    },

    constructor: function(config) {
        this.initConfig(config);
    },

    /**
     * Connects a url-based route to a controller/action pair plus additional params.
     * @param {String} url The url to recognize.
     */
    connect: function(url, params) {
        params = Ext.apply({url: url}, params || {}, this.getDefaults());
        var route = Ext.create('Ext.app.Route', params);

        this.getRoutes().push(route);

        return route;
    },

    /**
     * Recognizes a url string connected to the Router, return the controller/action pair plus any additional
     * config associated with it.
     * @param {String} url The url to recognize.
     * @return {Object/undefined} If the url was recognized, the controller and action to call, else `undefined`.
     */
    recognize: function(url) {
        var routes = this.getRoutes(),
            length = routes.length,
            i, result;

        for (i = 0; i < length; i++) {
            result = routes[i].recognize(url);

            if (result !== undefined) {
                return result;
            }
        }

        return undefined;
    },

    /**
     * Convenience method which just calls the supplied function with the Router instance. Example usage:
     *
     *     Ext.Router.draw(function(map) {
     *         map.connect('activate/:token', {controller: 'users', action: 'activate'});
     *         map.connect('home',            {controller: 'index', action: 'home'});
     *     });
     *
     * @param {Function} fn The fn to call
     */
    draw: function(fn) {
        fn.call(this, this);
    },

    /**
     * @private
     */
    clear: function() {
        this.setRoutes([]);
    }
}, function() {
    //<deprecated product=touch since=2.0>
    /**
     * Restores compatibility for the old `Ext.Router.draw` syntax. This needs to be here because apps often include
     * _routes.js_ just after _app.js_, so this is our only opportunity to hook this in. There is a small piece of code
     * inside Application's {@link Ext.app.Application#onDependenciesLoaded onDependenciesLoaded} that sets up the other end of this.
     * @singleton
     * @private
     */
    Ext.Router = {};

    var drawStack = [];

    /**
     * Application's {@link Ext.app.Application#onDependenciesLoaded onDependenciesLoaded} has a deprecated-wrapped line that calls this. Basic idea is that once an
     * app has been instantiated we set that at Ext.Router's `appInstance` and then redirect any calls to
     * {@link Ext.app.Router#draw Ext.Router.draw} to that app's Router. We keep a `drawStack` above so that we can call {@link Ext.app.Router#draw Ext.Router.draw} one or
     * more times before the application is even instantiated and it will simply link it up once everything is
     * present.
     */
    Ext.Router.setAppInstance = function(app) {
        Ext.Router.appInstance = app;

        if (drawStack.length > 0) {
            Ext.each(drawStack, Ext.Router.draw);
        }
    };

    Ext.Router.draw = function(mapperFn) {
        Ext.Logger.deprecate(
            'Ext.Router.map is deprecated, please define your routes inline inside each Controller. ' +
            'Please see the 1.x -> 2.x migration guide for more details.'
        );

        var app = Ext.Router.appInstance,
            router;

        if (app) {
            router = app.getRouter();
            mapperFn(router);
        } else {
            drawStack.push(mapperFn);
        }
    };
    //</deprecated>
});
