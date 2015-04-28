/**
 * @deprecated
 * A collection of sprites that delegates sprite functions to its elements.
 * 
 * Avoid using this multiple groups in a surface as it is error prone.
 * The group notion may be remove in future releases.
 * 
 */
Ext.define("Ext.draw.Group", {
    mixins: {
        observable: 'Ext.mixin.Observable'
    },

    config: {
        surface: null
    },

    statics: {
        /**
         * @private
         * @param name
         * @return {Function}
         */
        createRelayEvent: function (name) {
            return (function (e) {
                this.fireEvent(name, e);
            });
        },

        /**
         * @private
         * @param name
         * @return {Function}
         */
        createDispatcherMethod: function (name) {
            return function () {
                var args = Array.prototype.slice.call(arguments, 0), items = this.items, i = 0, ln = items.length, item;
                while (i < ln) {
                    item = items[i++];
                    item[name].apply(item, args);
                }
            };
        }
    },

    autoDestroy: false,

    constructor: function (config) {
        this.initConfig(config);
        this.map = {};
        this.items = [];
        this.length = 0;
    },

    /**
     * Add sprite to group.
     * @param {Ext.draw.sprite.Sprite} sprite
     */
    add: function (sprite) {
        var id = sprite.getId(),
            oldSprite = this.map[id];
        if (!oldSprite) {
            sprite.group.push(this.id);
            this.map[id] = sprite;
            this.items.push(sprite);
            this.length++;
        } else if (sprite !== oldSprite) {
            Ext.Logger.error('Sprite with duplicated id.');
        }
    },

    /**
     * Remote sprite from group.
     * @param {Ext.draw.sprite.Sprite} sprite
     * @param {Boolean} [destroySprite]
     */
    remove: function (sprite, destroySprite) {
        var id = sprite.getId(),
            oldSprite = this.map[id];

        destroySprite = destroySprite || this.autoDestroy;
        if (oldSprite) {
            if (oldSprite === sprite) {
                delete this.map[id];
                this.length--;
                Ext.Array.remove(this.items, sprite);
                if (destroySprite) {
                    oldSprite.destroy();
                } else {
                    Ext.Array.remove(sprite.group, this);
                }
            } else if (sprite !== oldSprite) {
                Ext.Logger.error('Sprite with duplicated id.');
            }
        }
    },

    /**
     * Add a list of sprites to group.
     * @param {Array|Ext.draw.sprite.Sprite} sprites
     */
    addAll: function (sprites) {
        if (sprites.isSprite) {
            this.add(sprites);
        } else if (Ext.isArray(sprites)) {
            var i = 0;
            while (i < sprites.length) {
                this.add(sprites[i++]);
            }
        }
    },

    /**
     * Iterate all sprites with specific function.
     * __Note:__ Avoid using this for performance consideration.
     * @param {Function} fn Function to iterate.
     */
    each: function (fn) {
        var i = 0,
            items = this.items,
            ln = items.length;
        while (i < ln) {
            if (false === fn(items[i])) {
                return;
            }
        }
    },

    /**
     * Clear the group
     * @param {Boolean} [destroySprite]
     */
    clear: function (destroySprite) {
        var i, ln, sprite, items;

        if (destroySprite || this.autoDestroy) {
            items = this.items.slice(0);
            for (i = 0, ln = items.length; i < ln; i++) {
                items[i].destroy();
            }
        } else {
            items = this.items.slice(0);
            for (i = 0, ln = items.length; i < ln; i++) {
                sprite = items[i];
                Ext.Array.remove(sprite.group, this);
            }
        }
        this.length = 0;
        this.map = {};
        this.items.length = 0;
    },

    /**
     * Get the i-th sprite of the group.
     * __Note:__ Do not reply on the order of the sprite. It could be changed by {@link Ext.draw.Surface#stableSort}. 
     * @param {Number}  index
     * @return {Ext.draw.sprite.Sprite}
     */
    getAt: function (index) {
        return this.items[index];
    },

    /**
     * Get the sprite with id or index.
     * It will first find sprite with given id, otherwise will try to use the id as an index.
     * @param {String|Number} id
     * @return {Ext.draw.sprite.Sprite}
     */
    get: function (id) {
        return this.map[id] || this.items[id];
    },

    /**
     * Destroy the group and remove it from surface.
     */
    destroy: function () {
        this.clear();
        this.getSurface().getGroups().remove(this);
    }
}, function () {

    this.addMembers({
        /**
         * Set attributes to all sprites in the group.
         *
         * @param {Object} o Sprite attribute options just like in {@link Ext.draw.sprite.Sprite}.
         * @method
         */
        setAttributes: this.createDispatcherMethod('setAttributes'),

        /**
         * Display all sprites in the group.
         *
         * @param {Boolean} o Whether to re-render the frame.
         * @method
         */
        show: this.createDispatcherMethod('show'),

        /**
         * Hide all sprites in the group.
         *
         * @param {Boolean} o Whether to re-render the frame.
         * @method
         */
        hide: this.createDispatcherMethod('hide'),

        /**
         * Set dirty flag for all sprites in the group
         * @method
         */
        setDirty: this.createDispatcherMethod('setDirty'),

        /**
         * Return the minimal bounding box that contains all the sprites bounding boxes in this group.
         * 
         * Bad performance. Avoid using it.
         */
        getBBox: function (isWithTransform) {
            if (this.length === 0) {
                return {x: 0, y: 0, width: 0, height: 0};
            }
            var i, ln, l = Infinity, r = -Infinity, t = Infinity, b = -Infinity, bbox;
            for (i = 0, ln = this.items.length; i < ln; i++) {
                bbox = this.items[i].getBBox(isWithTransform);
                if (!bbox) {
                    continue;
                }
                if (bbox.x + bbox.width > r) {
                    r = bbox.x + bbox.width;
                }
                if (bbox.x < l) {
                    l = bbox.x;
                }
                if (bbox.y + bbox.height > b) {
                    b = bbox.y + bbox.height;
                }
                if (bbox.y < t) {
                    t = bbox.y;
                }
            }
            return {
                x: l,
                y: t,
                height: b - t,
                width: r - l
            };
        }
    });
});