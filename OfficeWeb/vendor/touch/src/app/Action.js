/**
 * @author Ed Spencer
 * @private
 *
 * Represents a single action as {@link Ext.app.Application#dispatch dispatched} by an Application. This is typically
 * generated as a result of a url change being matched by a Route, triggering Application's dispatch function.
 *
 * This is a private class and its functionality and existence may change in the future. Use at your own risk.
 *
 */
Ext.define('Ext.app.Action', {
    config: {
        /**
         * @cfg {Object} scope The scope in which the {@link #action} should be called.
         */
        scope: null,

        /**
         * @cfg {Ext.app.Application} application The Application that this Action is bound to.
         */
        application: null,

        /**
         * @cfg {Ext.app.Controller} controller The {@link Ext.app.Controller controller} whose {@link #action} should
         * be called.
         */
        controller: null,

        /**
         * @cfg {String} action The name of the action on the {@link #controller} that should be called.
         */
        action: null,

        /**
         * @cfg {Array} args The set of arguments that will be passed to the controller's {@link #action}.
         */
        args: [],

        /**
         * @cfg {String} url The url that was decoded into the controller/action/args in this Action.
         */
        url: undefined,
        data: {},
        title: null,

        /**
         * @cfg {Array} beforeFilters The (optional) set of functions to call before the {@link #action} is called.
         * This is usually handled directly by the Controller or Application when an Ext.app.Action instance is
         * created, but is alterable before {@link #resume} is called.
         * @accessor
         */
        beforeFilters: [],

        /**
         * @private
         * Keeps track of which before filter is currently being executed by {@link #resume}
         */
        currentFilterIndex: -1
    },

    constructor: function(config) {
        this.initConfig(config);

        this.getUrl();
    },

    /**
     * Starts execution of this Action by calling each of the {@link #beforeFilters} in turn (if any are specified),
     * before calling the Controller {@link #action}. Same as calling {@link #resume}.
     */
    execute: function() {
        this.resume();
    },

    /**
     * Resumes the execution of this Action (or starts it if it had not been started already). This iterates over all
     * of the configured {@link #beforeFilters} and calls them. Each before filter is called with this Action as the
     * sole argument, and is expected to call `action.resume()` in order to allow the next filter to be called, or if
     * this is the final filter, the original {@link Ext.app.Controller Controller} function.
     */
    resume: function() {
        var index   = this.getCurrentFilterIndex() + 1,
            filters = this.getBeforeFilters(),
            controller = this.getController(),
            nextFilter = filters[index];

        if (nextFilter) {
            this.setCurrentFilterIndex(index);
            nextFilter.call(controller, this);
        } else {
            controller[this.getAction()].apply(controller, this.getArgs());
        }
    },

    /**
     * @private
     */
    applyUrl: function(url) {
        if (url === null || url === undefined) {
            url = this.urlEncode();
        }

        return url;
    },

    /**
     * @private
     * If the controller config is a string, swap it for a reference to the actual controller instance.
     * @param {String} controller The controller name.
     */
    applyController: function(controller) {
        var app = this.getApplication(),
            profile = app.getCurrentProfile();

        if (Ext.isString(controller)) {
            controller = app.getController(controller, profile ? profile.getNamespace() : null);
        }

        return controller;
    },

    /**
     * @private
     */
    urlEncode: function() {
        var controller = this.getController(),
            splits;

        if (controller instanceof Ext.app.Controller) {
            splits = controller.$className.split('.');
            controller = splits[splits.length - 1];
        }

        return controller + "/" + this.getAction();
    }
});