/**
 * A Surface is an interface to render methods inside a draw {@link Ext.draw.Component}.
 * A Surface contains methods to render sprites, get bounding boxes of sprites, add
 * sprites to the canvas, initialize other graphic components, etc. One of the most used
 * methods for this class is the `add` method, to add Sprites to the surface.
 *
 * Most of the Surface methods are abstract and they have a concrete implementation
 * in VML or SVG engines.
 *
 * A Surface instance can be accessed as a property of a draw component. For example:
 *
 *     drawComponent.getSurface('main').add({
 *         type: 'circle',
 *         fill: '#ffc',
 *         radius: 100,
 *         x: 100,
 *         y: 100
 *     });
 *
 * The configuration object passed in the `add` method is the same as described in the {@link Ext.draw.sprite.Sprite}
 * class documentation.
 *
 * ## Example
 *
 *     drawComponent.getSurface('main').add([
 *         {
 *             type: 'circle',
 *             radius: 10,
 *             fill: '#f00',
 *             x: 10,
 *             y: 10,
 *             group: 'circles'
 *         },
 *         {
 *             type: 'circle',
 *             radius: 10,
 *             fill: '#0f0',
 *             x: 50,
 *             y: 50,
 *             group: 'circles'
 *         },
 *         {
 *             type: 'circle',
 *             radius: 10,
 *             fill: '#00f',
 *             x: 100,
 *             y: 100,
 *             group: 'circles'
 *         },
 *         {
 *             type: 'rect',
 *             radius: 10,
 *             x: 10,
 *             y: 10,
 *             group: 'rectangles'
 *         },
 *         {
 *             type: 'rect',
 *             radius: 10,
 *             x: 50,
 *             y: 50,
 *             group: 'rectangles'
 *         },
 *         {
 *             type: 'rect',
 *             radius: 10,
 *             x: 100,
 *             y: 100,
 *             group: 'rectangles'
 *         }
 *     ]);
 *
 */
Ext.define('Ext.draw.Surface', {
    extend: 'Ext.Component',
    xtype: 'surface',

    requires: [
        'Ext.draw.sprite.*',
        'Ext.draw.gradient.*',
        'Ext.draw.sprite.AttributeDefinition',
        'Ext.draw.Matrix',
        'Ext.draw.Draw',
        'Ext.draw.Group'
    ],

    uses: [
        "Ext.draw.engine.Canvas"
    ],

    defaultIdPrefix: 'ext-surface-',

    /**
     * The reported device pixel density.
     */
    devicePixelRatio: window.devicePixelRatio,

    statics: {
        /**
         * Stably sort the list of sprites by their zIndex.
         * TODO: Improve the performance. Reduce gc impact.
         * @param list
         */
        stableSort: function (list) {
            if (list.length < 2) {
                return;
            }
            var keys = {}, sortedKeys, result = [], i, ln, zIndex;

            for (i = 0, ln = list.length; i < ln; i++) {
                zIndex = list[i].attr.zIndex;
                if (!keys[zIndex]) {
                    keys[zIndex] = [list[i]];
                } else {
                    keys[zIndex].push(list[i]);
                }
            }
            sortedKeys = Object.keys(keys).sort(function (a, b) {return a - b;});
            for (i = 0, ln = sortedKeys.length; i < ln; i++) {
                result.push.apply(result, keys[sortedKeys[i]]);
            }
            for (i = 0, ln = list.length; i < ln; i++) {
                list[i] = result[i];
            }
        }
    },

    config: {
        /**
         * @cfg {Array}
         * The region of the surface related to its component.
         */
        region: null,

        /**
         * @cfg {Object}
         * The config of a background sprite of current surface
         */
        background: null,

        /**
         * @cfg {Ext.draw.Group}
         * The default group of the surfaces.
         */
        items: [],

        /**
         * @cfg {Array}
         * An array of groups.
         */
        groups: [],

        /**
         * @cfg {Boolean}
         * Indicates whether the surface needs redraw.
         */
        dirty: false
    },

    dirtyPredecessor: 0,

    constructor: function (config) {
        var me = this;

        me.predecessors = [];
        me.successors = [];
        me.pendingRenderFrame = false;

        me.callSuper([config]);
        me.matrix = new Ext.draw.Matrix();
        me.inverseMatrix = me.matrix.inverse(me.inverseMatrix);
        me.resetTransform();
    },

    /**
     * Round the number to align to the pixels on device.
     * @param num The number to align.
     * @return {Number} The resultant alignment.
     */
    roundPixel: function (num) {
        return Math.round(this.devicePixelRatio * num) / this.devicePixelRatio;
    },

    /**
     * Mark the surface to render after another surface is updated.
     * @param surface The surface to wait for.
     */
    waitFor: function (surface) {
        var me = this,
            predecessors = me.predecessors;
        if (!Ext.Array.contains(predecessors, surface)) {
            predecessors.push(surface);
            surface.successors.push(me);
            if (surface._dirty) {
                me.dirtyPredecessor++;
            }
        }
    },

    setDirty: function (dirty) {
        if (this._dirty !== dirty) {
            var successors = this.successors, successor,
                i, ln = successors.length;
            for (i = 0; i < ln; i++) {
                successor = successors[i];
                if (dirty) {
                    successor.dirtyPredecessor++;
                    successor.setDirty(true);
                } else {
                    successor.dirtyPredecessor--;
                    if (successor.dirtyPredecessor === 0 && successor.pendingRenderFrame) {
                        successor.renderFrame();
                    }
                }
            }
            this._dirty = dirty;
        }
    },

    applyElement: function (newElement, oldElement) {
        if (oldElement) {
            oldElement.set(newElement);
        } else {
            oldElement = Ext.Element.create(newElement);
        }
        this.setDirty(true);
        return oldElement;
    },

    applyBackground: function (background, oldBackground) {
        this.setDirty(true);
        if (Ext.isString(background)) {
            background = { fillStyle: background };
        }
        return Ext.factory(background, Ext.draw.sprite.Rect, oldBackground);
    },

    applyRegion: function (region, oldRegion) {
        if (oldRegion && region[0] === oldRegion[0] && region[1] === oldRegion[1] && region[2] === oldRegion[2] && region[3] === oldRegion[3]) {
            return;
        }
        if (Ext.isArray(region)) {
            return [region[0], region[1], region[2], region[3]];
        } else if (Ext.isObject(region)) {
            return [
                region.x || region.left,
                region.y || region.top,
                region.width || (region.right - region.left),
                region.height || (region.bottom - region.top)
            ];
        }
    },

    updateRegion: function (region) {
        var me = this,
            l = region[0],
            t = region[1],
            r = l + region[2],
            b = t + region[3],
            background = this.getBackground(),
            element = me.element;

        element.setBox({
            top: Math.floor(t),
            left: Math.floor(l),
            width: Math.ceil(r - Math.floor(l)),
            height: Math.ceil(b - Math.floor(t))
        });

        if (background) {
            background.setAttributes({
                x: 0,
                y: 0,
                width: Math.ceil(r - Math.floor(l)),
                height: Math.ceil(b - Math.floor(t))
            });
        }
        me.setDirty(true);
    },

    /**
     * Reset the matrix of the surface.
     */
    resetTransform: function () {
        this.matrix.set(1, 0, 0, 1, 0, 0);
        this.inverseMatrix.set(1, 0, 0, 1, 0, 0);
        this.setDirty(true);
    },

    updateComponent: function (component, oldComponent) {
        if (component) {
            component.element.dom.appendChild(this.element.dom);
        }
    },
    /**
     * Add a Sprite to the surface.
     * You can put any number of object as parameter.
     * See {@link Ext.draw.sprite.Sprite} for the configuration object to be passed into this method.
     *
     * For example:
     *
     *     drawComponent.surface.add({
     *         type: 'circle',
     *         fill: '#ffc',
     *         radius: 100,
     *         x: 100,
     *         y: 100
     *     });
     *
     */
    add: function () {
        var me = this,
            args = Array.prototype.slice.call(arguments),
            argIsArray = Ext.isArray(args[0]),
            sprite, items, i, ln, results, group, groups;

        items = argIsArray ? args[0] : args;
        results = [];
        for (i = 0, ln = items.length; i < ln; i++) {
            sprite = items[i];
            if (!items[i]) {
                continue;
            }
            sprite = me.prepareItems(args[0])[0];
            groups = sprite.group;
            if (groups.length) {
                for (i = 0, ln = groups.length; i < ln; i++) {
                    group = groups[i];
                    me.getGroup(group).add(sprite);
                }
            }

            me.getItems().add(sprite);
            results.push(sprite);
            sprite.setParent(this);
            me.onAdd(sprite);
        }

        me.dirtyZIndex = true;
        me.setDirty(true);
        if (!argIsArray && results.length === 1) {
            return results[0];
        } else {
            return results;
        }
    },

    /**
     * @protected
     * Invoked when a sprite is adding to the surface.
     * @param {Ext.draw.sprite.Sprite} sprite The sprite to be added.
     */
    onAdd: Ext.emptyFn,

    /**
     * Remove a given sprite from the surface, optionally destroying the sprite in the process.
     * You can also call the sprite own `remove` method.
     *
     * For example:
     *
     *      drawComponent.surface.remove(sprite);
     *      // or...
     *      sprite.remove();
     *
     * @param {Ext.draw.sprite.Sprite} sprite
     * @param {Boolean} destroySprite
     */
    remove: function (sprite, destroySprite) {
        if (sprite) {
            if (destroySprite === true) {
                sprite.destroy();
            } else {
                this.getGroups().each(function (item) {
                    item.remove(sprite);
                });
                this.getItems().remove(sprite);
            }
            this.dirtyZIndex = true;
            this.setDirty(true);
        }
    },

    /**
     * Remove all sprites from the surface, optionally destroying the sprites in the process.
     *
     * For example:
     *
     *      drawComponent.surface.removeAll();
     *
     */
    removeAll: function () {
        this.getItems().clear();
        this.dirtyZIndex = true;
    },

    // @private
    applyItems: function (items, oldItems) {
        var result;

        if (items instanceof Ext.draw.Group) {
            result = items;
        } else {
            result = new Ext.draw.Group({surface: this});
            result.autoDestroy = true;
            result.addAll(this.prepareItems(items));
        }
        this.setDirty(true);
        return result;
    },

    /**
     * @private
     * Initialize and apply defaults to surface items.
     */
    prepareItems: function (items) {
        items = [].concat(items);
        // Make sure defaults are applied and item is initialized
        var me = this,
            item, i, ln, j,
            removeSprite = function (sprite) {
                this.remove(sprite, false);
            };

        for (i = 0, ln = items.length; i < ln; i++) {
            item = items[i];
            if (!(item instanceof Ext.draw.sprite.Sprite)) {
                // Temporary, just take in configs...
                item = items[i] = me.createItem(item);
            }
            for (j = 0; j < item.group.length; j++) {
                me.getGroup(item.group[i]).add(item);
            }
            item.on('beforedestroy', removeSprite, me);
        }
        return items;
    },

    applyGroups: function (groups, oldGroups) {
        var result;

        if (groups instanceof Ext.util.MixedCollection) {
            result = groups;
        } else {
            result = new Ext.util.MixedCollection();
            result.addAll(groups);
        }
        if (oldGroups) {
            oldGroups.each(function (group) {
                if (!result.contains()) {
                    group.destroy();
                }
            });
            oldGroups.destroy();
        }
        this.setDirty(true);
        return result;
    },

    /**
     * @deprecated Do not use groups directly
     * Returns a new group or an existent group associated with the current surface.
     * The group returned is a {@link Ext.draw.Group} group.
     *
     * For example:
     *
     *      var spriteGroup = drawComponent.surface.getGroup('someGroupId');
     *
     * @param {String} id The unique identifier of the group.
     * @return {Ext.draw.Group} The group.
     */
    getGroup: function (id) {
        var group;
        if (typeof id === "string") {
            group = this.getGroups().get(id);
            if (!group) {
                group = this.createGroup(id);
            }
        } else {
            group = id;
        }
        return group;
    },

    /**
     * @private
     * @deprecated Do not use groups directly
     * @param id
     * @return {Ext.draw.Group} The group.
     */
    createGroup: function (id) {
        var group = this.getGroups().get(id);

        if (!group) {
            group = new Ext.draw.Group({surface: this});
            group.id = id || Ext.id(null, 'ext-surface-group-');
            this.getGroups().add(group);
        }
        this.setDirty(true);
        return group;
    },

    /**
     * @private
     * @deprecated Do not use groups directly
     * @param group
     */
    removeGroup: function (group) {
        if (Ext.isString(group)) {
            group = this.getGroups().get(group);
        }
        if (group) {
            this.getGroups().remove(group);
            group.destroy();
        }
        this.setDirty(true);
    },

    /**
     * @private Creates an item and appends it to the surface. Called
     * as an internal method when calling `add`.
     */
    createItem: function (config) {
        var sprite = Ext.create(config.xclass || 'sprite.' + config.type, config);
        return sprite;
    },

    /**
     * @deprecated Use the `sprite.getBBox(isWithoutTransform)` directly.
     * @param sprite
     * @param isWithoutTransform
     * @return {Object}
     */
    getBBox: function (sprite, isWithoutTransform) {
        return sprite.getBBox(isWithoutTransform);
    },

    /**
     * Empty the surface content (without touching the sprites.)
     */
    clear: Ext.emptyFn,

    /**
     * @private
     * Order the items by their z-index if any of that has been changed since last sort.
     */
    orderByZIndex: function () {
        var me = this,
            items = me.getItems().items,
            dirtyZIndex = false,
            i, ln;

        if (me.getDirty()) {
            for (i = 0, ln = items.length; i < ln; i++) {
                if (items[i].attr.dirtyZIndex) {
                    dirtyZIndex = true;
                    break;
                }
            }
            if (dirtyZIndex) {
                // sort by zIndex
                Ext.draw.Surface.stableSort(items);
                this.setDirty(true);
            }

            for (i = 0, ln = items.length; i < ln; i++) {
                items[i].attr.dirtyZIndex = false;
            }
        }
    },

    /**
     * Force the element to redraw.
     */
    repaint: function () {
        var me = this;
        me.repaint = Ext.emptyFn;
        setTimeout(function () {
            delete me.repaint;
            me.element.repaint();
        }, 1);
    },

    /**
     * Triggers the re-rendering of the canvas.
     */
    renderFrame: function () {
        if (!this.element) {
            return;
        }
        if (this.dirtyPredecessor > 0) {
            this.pendingRenderFrame = true;
        }

        var me = this,
            region = this.getRegion(),
            background = me.getBackground(),
            items = me.getItems().items,
            item, i, ln;

        // Cannot render before the surface is placed.
        if (!region) {
            return;
        }

        // This will also check the dirty flags of the sprites.
        me.orderByZIndex();
        if (me.getDirty()) {
            me.clear();
            me.clearTransform();

            if (background) {
                me.renderSprite(background);
            }

            for (i = 0, ln = items.length; i < ln; i++) {
                item = items[i];
                item.applyTransformations();
                if (false === me.renderSprite(item)) {
                    return;
                }
                item.attr.textPositionCount = me.textPosition;
            }

            me.setDirty(false);
        }
    },

    /**
     * @private
     * Renders a single sprite into the surface.
     * Do not call it from outside `renderFrame` method.
     *
     * @param {Ext.draw.sprite.Sprite} sprite The Sprite to be rendered.
     * @return {Boolean} returns `false` to stop the rendering to continue.
     */
    renderSprite: Ext.emptyFn,

    /**
     * @private
     * Clears the current transformation state on the surface.
     */
    clearTransform: Ext.emptyFn,

    /**
     * Returns 'true' if the surface is dirty.
     * @return {Boolean} 'true' if the surface is dirty
     */
    getDirty: function () {
        return this._dirty;
    },

    /**
     * Destroys the surface. This is done by removing all components from it and
     * also removing its reference to a DOM element.
     *
     * For example:
     *
     *      drawComponent.surface.destroy();
     */
    destroy: function () {
        var me = this;
        me.removeAll();
        me.setBackground(null);
        me.setGroups([]);
        me.getGroups().destroy();
        me.predecessors = null;
        me.successors = null;
        me.callSuper();
    }
});


