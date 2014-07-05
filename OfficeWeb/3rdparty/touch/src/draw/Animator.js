/**
 * @class Ext.draw.Animator
 * 
 * Singleton class that manages the animation pool.
 */
Ext.define('Ext.draw.Animator', {
    uses: ['Ext.draw.Draw'],
    singleton: true,

    frameCallbacks: {},
    frameCallbackId: 0,
    scheduled: 0,
    frameStartTimeOffset: Ext.frameStartTime,
    animations: [],

    /**
     *  Cross platform `animationTime` implementation.
     *  @return {Number}
     */
    animationTime: function () {
        return Ext.frameStartTime - this.frameStartTimeOffset;
    },

    /**
     * Adds an animated object to the animation pool.
     *
     * @param {Object} animation The animation descriptor to add to the pool.
     */
    add: function (animation) {
        if (!this.contains(animation)) {
            this.animations.push(animation);
            Ext.draw.Animator.ignite();
            if ('fireEvent' in animation) {
                animation.fireEvent('animationstart', animation);
            }
        }
    },

    /**
     * Removes an animation from the pool.
     * TODO: This is broken when called within `step` method.
     * @param {Object} animation The animation to remove from the pool.
     */
    remove: function (animation) {
        var me = this,
            animations = me.animations,
            i = 0,
            l = animations.length;

        for (; i < l; ++i) {
            if (animations[i] === animation) {
                animations.splice(i, 1);
                if ('fireEvent' in animation) {
                    animation.fireEvent('animationend', animation);
                }
                return;
            }
        }
    },

    /**
     * Returns `true` or `false` whether it contains the given animation or not.
     *
     * @param {Object} animation The animation to check for.
     * @return {Boolean}
     */
    contains: function (animation) {
        return this.animations.indexOf(animation) > -1;
    },

    /**
     * Returns `true` or `false` whether the pool is empty or not.
     * @return {Boolean}
     */
    empty: function () {
        return this.animations.length === 0;
    },

    /**
     * Given a frame time it will filter out finished animations from the pool.
     *
     * @param {Number} frameTime The frame's start time, in milliseconds.
     */
    step: function (frameTime) {
        var me = this,
        // TODO: Try to find a way to get rid of this copy
            animations = me.animations.slice(),
            animation,
            i = 0, j = 0,
            l = animations.length;

        for (; i < l; ++i) {
            animation = animations[i];
            animation.step(frameTime);
            if (animation.animating) {
                animations[j++] = animation;
            } else {
                me.animations.splice(j, 1);
                if (animation.fireEvent) {
                    animation.fireEvent('animationend');
                }
            }
        }
    },

    /**
     * Register an one-time callback that will be called at the next frame.
     * @param callback
     * @param scope
     * @return {String}
     */
    schedule: function (callback, scope) {
        scope = scope || this;
        var id = 'frameCallback' + (this.frameCallbackId++);

        if (Ext.isString(callback)) {
            callback = scope[callback];
        }
        Ext.draw.Animator.frameCallbacks[id] = {fn: callback, scope: scope, once: true};
        this.scheduled++;
        Ext.draw.Animator.ignite();
        return id;
    },

    /**
     * Cancel a registered one-time callback
     * @param id
     */
    cancel: function (id) {
        if (Ext.draw.Animator.frameCallbacks[id] && Ext.draw.Animator.frameCallbacks[id].once) {
            this.scheduled--;
            delete Ext.draw.Animator.frameCallbacks[id];
        }
    },

    /**
     * Register a recursive callback that will be called at every frame.
     *
     * @param callback
     * @param scope
     * @return {String}
     */
    addFrameCallback: function (callback, scope) {
        scope = scope || this;
        if (Ext.isString(callback)) {
            callback = scope[callback];
        }
        var id = 'frameCallback' + (this.frameCallbackId++);

        Ext.draw.Animator.frameCallbacks[id] = {fn: callback, scope: scope};
        return id;
    },

    /**
     * Unregister a recursive callback.
     * @param id
     */
    removeFrameCallback: function (id) {
        delete Ext.draw.Animator.frameCallbacks[id];
    },

    /**
     * @private
     */
    fireFrameCallbacks: function () {
        var callbacks = this.frameCallbacks,
            once = [],
            id, i, ln, fn, cb;

        for (id in callbacks) {
            cb = callbacks[id];
            fn = cb.fn;
            if (Ext.isString(fn)) {
                fn = cb.scope[fn];
            }
            fn.call(cb.scope);
            if (cb.once) {
                once.push(id);
            }
        }
        for (i = 0, ln = once.length; i < ln; i++) {
            this.scheduled--;
            delete callbacks[once[i]];
        }
    }
}, function () {
    //Initialize the endless animation loop.
    var looping = false,
        frame = Ext.draw.Animator,
        requestAnimationFramePolyfill = (function (global) {
            return global.requestAnimationFrame ||
                global.webkitRequestAnimationFrame ||
                global.mozAnimationFrame ||
                global.oAnimationFrame ||
                global.msAnimationFrame ||
                function (callback) { setTimeout(callback, 1); };
        })(Ext.global),
        animationStartTimePolyfill = (function (global) {
            return (global.animationStartTime ? function () { return global.animationStartTime; } : null) ||
                (global.webkitAnimationStartTime ? function () { return global.webkitAnimationStartTime; } : null) ||
                (global.mozAnimationStartTime ? function () { return global.mozAnimationStartTime; } : null) ||
                (global.oAnimationStartTime ? function () { return global.oAnimationStartTime; } : null) ||
                (global.msAnimationStartTime ? function () { return global.msAnimationStartTime; } : null) ||
                (Date.now ? function () { return Date.now(); } :
                    function () { return +new Date(); });

        })(Ext.global);

    // <debug>
    var startLooping, frames;
    // </debug>

    function animationLoop() {
        Ext.frameStartTime = animationStartTimePolyfill();

        // <debug>
        if (startLooping === undefined) {
            startLooping = Ext.frameStartTime;
        }
        // </debug>
        frame.step(frame.animationTime());
        frame.fireFrameCallbacks();
        if (frame.scheduled || !frame.empty()) {
            requestAnimationFramePolyfill(animationLoop);
            // <debug>
            frames++;
            // </debug>
        } else {
            looping = false;
            // <debug>
            startLooping = undefined;
            // </debug>
        }
        // <debug>
        frame.framerate = frames * 1000 / (frame.animationTime() - startLooping);
        // </debug>

    }

    // <debug>
    frame.clearCounter = function () {
        startLooping = frame.animationTime();
        frames = 0;
    };
    // </debug>

    frame.ignite = function () {
        if (!looping) {
            // <debug>
            frames = 0;
            // </debug>
            looping = true;
            requestAnimationFramePolyfill(animationLoop);
            Ext.draw.Draw.updateIOS();
        }
    };

});
