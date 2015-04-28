/*
 * (c) Copyright Ascensio System SIA 2010-2015
 *
 * This program is a free software product. You can redistribute it and/or 
 * modify it under the terms of the GNU Affero General Public License (AGPL) 
 * version 3 as published by the Free Software Foundation. In accordance with 
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect 
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied 
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For 
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under 
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */
 (function () {
    var resolveNamespace = function (className, root) {
        var parts = className.split("."),
        current = root || window;
        for (var a = 0, b = parts.length; a < b; a++) {
            current = current[parts[a]] || {};
        }
        return current;
    };
    var Application = function (options) {
        _.extend(this, options || {});
        this.eventbus = new EventBus({
            application: this
        });
        this.createApplicationNamespace();
        this.initialize.apply(this, arguments);
        if (this.autoCreate !== false) {
            $($.proxy(this.onReady, this));
        }
    };
    _.extend(Application.prototype, {
        nameSpace: "Application",
        models: {},
        collections: {},
        controllers: {},
        allocationMap: {
            model: "Models",
            collection: "Collections",
            controller: "Controllers",
            view: "Views"
        },
        createApplicationNamespace: function () {
            var nameSpace = window;
            if (this.nameSpace) {
                if (typeof nameSpace[this.nameSpace] == "undefined") {
                    nameSpace[this.nameSpace] = {};
                }
            }
            nameSpace[this.nameSpace] = this;
            _.each(this.allocationMap, function (name, key) {
                this[name] = this[name] || {};
            },
            this);
        },
        initialize: function () {},
        onReady: function () {
            this.start();
        },
        start: function () {
            this.initializeControllers(this.controllers || {});
            this.launchControllers();
            this.launch.call(this);
        },
        getClasseRefs: function (type, classes) {
            var hashMap = {},
            allocationMap = this.allocationMap[type],
            root = this[allocationMap];
            _.each(classes, function (cls) {
                hashMap[cls] = resolveNamespace(cls, (cls.indexOf(".") > -1) ? window : root);
            },
            this);
            return hashMap;
        },
        initializeControllers: function (controllers) {
            this.controllers = {};
            _.each(controllers, function (ctrl) {
                var root = (ctrl.indexOf(".") > -1) ? window : this[this.allocationMap.controller],
                classReference = resolveNamespace(ctrl, root),
                id = ctrl.split(".").pop();
                var controller = new classReference({
                    id: ctrl,
                    application: this
                });
                controller.views = this.getClasseRefs("view", controller.views || []);
                _.extend(this.models, this.getClasseRefs("model", controller.models || []));
                _.extend(this.collections, this.getClasseRefs("collection", controller.collections || {}));
                this.buildCollections();
                this.controllers[ctrl] = controller;
            },
            this);
        },
        launchControllers: function () {
            _.each(this.controllers, function (ctrl, id) {
                ctrl.onLaunch(this);
            },
            this);
        },
        launch: function () {},
        addListeners: function (listeners, controller) {
            this.eventbus.addListeners(listeners, controller);
        },
        getController: function (name) {
            return this.controllers[name];
        },
        getModel: function (name) {
            this._modelsCache = this._modelsCache || {};
            var model = this._modelsCache[name],
            modelClass = this.getModelConstructor(name);
            if (!model && modelClass) {
                model = this.createModel(name);
                this._modelsCache[name] = model;
            }
            return model || null;
        },
        getModelConstructor: function (name) {
            return this.models[name];
        },
        createModel: function (name, options) {
            var modelClass = this.getModelConstructor(name),
            model = null;
            if (modelClass) {
                model = new modelClass(_.extend(options || {}));
            }
            return model;
        },
        getCollection: function (name) {
            this._collectionsCache = this._collectionsCache || {};
            var collection = this._collectionsCache[name],
            collectionClass = this.getCollectionConstructor(name);
            if (!collection && collectionClass) {
                collection = this.createCollection(name);
                this._collectionsCache[name] = collection;
            }
            return collection || null;
        },
        getCollectionConstructor: function (name) {
            return this.collections[name];
        },
        createCollection: function (name) {
            var collectionClass = this.getCollectionConstructor(name),
            collection = null;
            if (collectionClass) {
                collection = new collectionClass();
            }
            return collection;
        },
        buildCollections: function () {
            _.each(this.collections, function (collection, alias) {
                this.getCollection(alias);
            },
            this);
        }
    });
    if (typeof Backbone.Application == "undefined") {
        Backbone.Application = Application;
        Backbone.Application.extend = Backbone.Model.extend;
    } else {
        throw ("Native Backbone.Application instance already defined.");
    }
    var Controller = function (options) {
        _.extend(this, options || {});
        this.initialize.apply(this, arguments);
    };
    _.extend(Controller.prototype, {
        name: null,
        views: {},
        models: {},
        collections: {},
        initialize: function (options) {},
        addListeners: function (listeners) {
            this.getApplication().addListeners(listeners, this);
        },
        onLaunch: function (application) {},
        getApplication: function () {
            return this.application;
        },
        getView: function (name) {
            return this._viewsCache[name];
        },
        getViewConstructor: function (name) {
            return this.views[name];
        },
        createView: function (name, options) {
            var view = this.getViewConstructor(name),
            viewOptions = _.extend(options || {},
            {
                alias: name
            });
            this._viewsCache = this._viewsCache || {};
            this._viewsCache[name] = new view(viewOptions);
            this._viewsCache[name].options = _.extend({},
            viewOptions);
            return this._viewsCache[name];
        },
        getModel: function (name) {
            return this.application.getModel(name);
        },
        getModelConstructor: function (name) {
            return this.application.getModelConstructor(name);
        },
        createModel: function (name, options) {
            return this.application.createModel(name);
        },
        getCollection: function (name) {
            return this.application.getCollection(name);
        },
        getCollectionConstructor: function (name) {
            return this.application.getCollectionConstructor(name);
        },
        createCollection: function (name) {
            return this.application.createCollection(name);
        },
        fireEvent: function (selector, event, args) {
            this.application.eventbus.fireEvent(selector, event, args);
        },
        bindViewEvents: function (view, events) {
            this.unbindViewEvents(view);
            events = _.isFunction(events) ? events.call(this) : events;
            for (var key in events) {
                var method = events[key];
                if (!_.isFunction(method)) {
                    method = this[events[key]];
                }
                var match = key.match(/^(\S+)\s*(.*)$/);
                var eventName = match[1],
                selector = match[2];
                method = _.bind(method, this);
                eventName += ".bindViewEvents" + view.cid;
                view.$el.on(eventName, selector, method);
            }
            return this;
        },
        unbindViewEvents: function (view) {
            view.$el.off(".bindViewEvents" + view.cid);
            return this;
        }
    });
    if (typeof Backbone.Controller == "undefined") {
        Backbone.Controller = Controller;
        Backbone.Controller.extend = Backbone.Model.extend;
    } else {
        throw ("Native Backbone.Controller instance already defined.");
    }
    var EventBus = function (options) {
        var me = this;
        _.extend(this, options || {});
        _.extend(Backbone.View.prototype, {
            alias: null,
            hidden: false,
            getAlias: function () {
                return this.options.alias;
            },
            fireEvent: function (event, args) {
                this.trigger.apply(this, arguments);
                me.fireEvent(this.getAlias(), event, args);
            },
            hide: function () {
                this.$el.hide();
                this.hidden = true;
            },
            show: function () {
                this.$el.show();
                this.hidden = false;
            }
        });
    };
    _.extend(EventBus.prototype, {
        pool: {},
        addListeners: function (selectors, controller) {
            this.pool[controller.id] = this.pool[controller.id] || {};
            var pool = this.pool[controller.id];
            if (_.isArray(selectors)) {
                _.each(selectors, function (selector) {
                    this.addListeners(selector, controller);
                },
                this);
            } else {
                if (_.isObject(selectors)) {
                    _.each(selectors, function (listeners, selector) {
                        _.each(listeners, function (listener, event) {
                            pool[selector] = pool[selector] || {};
                            pool[selector][event] = pool[selector][event] || [];
                            pool[selector][event].push(listener);
                        },
                        this);
                    },
                    this);
                }
            }
        },
        fireEvent: function (selector, event, args) {
            var application = this.getApplication();
            _.each(this.pool, function (eventsPoolByAlias, controllerId) {
                var events = eventsPoolByAlias[selector];
                if (events) {
                    var listeners = events[event],
                    controller = application.getController(controllerId);
                    _.each(listeners, function (fn) {
                        fn.apply(controller, args);
                    });
                }
            },
            this);
        },
        getApplication: function () {
            return this.application;
        }
    });
    if (typeof Backbone.EventBus == "undefined") {
        Backbone.EventBus = EventBus;
    } else {
        throw ("Native Backbone.Application instance already defined.");
    }
})();