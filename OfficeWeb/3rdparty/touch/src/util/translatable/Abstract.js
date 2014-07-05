/**
 * @private
 *
 * The abstract class. Sub-classes are expected, at the very least, to implement translation logics inside
 * the 'translate' method
 */
Ext.define('Ext.util.translatable.Abstract', {
    extend: 'Ext.Evented',

    requires: ['Ext.fx.easing.Linear'],

    config: {
        easing: null,

        easingX: null,

        easingY: null,

        fps: Ext.os.is.Android4 ? 50 : 60
    },

    /**
     * @event animationstart
     * Fires whenever the animation is started
     * @param {Ext.util.translatable.Abstract} this
     * @param {Number} x The current translation on the x axis
     * @param {Number} y The current translation on the y axis
     */

    /**
     * @event animationframe
     * Fires for each animation frame
     * @param {Ext.util.translatable.Abstract} this
     * @param {Number} x The new translation on the x axis
     * @param {Number} y The new translation on the y axis
     */

    /**
     * @event animationend
     * Fires whenever the animation is ended
     * @param {Ext.util.translatable.Abstract} this
     * @param {Number} x The current translation on the x axis
     * @param {Number} y The current translation on the y axis
     */

    x: 0,

    y: 0,

    activeEasingX: null,

    activeEasingY: null,

    isAnimating: false,

    isTranslatable: true,

    constructor: function(config) {
        this.doAnimationFrame = Ext.Function.bind(this.doAnimationFrame, this);

        this.initConfig(config);
    },

    factoryEasing: function(easing) {
        return Ext.factory(easing, Ext.fx.easing.Linear, null, 'easing');
    },

    applyEasing: function(easing) {
        if (!this.getEasingX()) {
            this.setEasingX(this.factoryEasing(easing));
        }

        if (!this.getEasingY()) {
            this.setEasingY(this.factoryEasing(easing));
        }
    },

    applyEasingX: function(easing) {
        return this.factoryEasing(easing);
    },

    applyEasingY: function(easing) {
        return this.factoryEasing(easing);
    },

    updateFps: function(fps) {
        this.animationInterval = 1000 / fps;
    },

    doTranslate: Ext.emptyFn,

    translate: function(x, y, animation) {
        if (animation) {
            return this.translateAnimated(x, y, animation);
        }

        if (this.isAnimating) {
            this.stopAnimation();
        }

        if (!isNaN(x) && typeof x == 'number') {
            this.x = x;
        }

        if (!isNaN(y) && typeof y == 'number') {
            this.y = y;
        }
        this.doTranslate(x, y);
    },

    translateAxis: function(axis, value, animation) {
        var x, y;

        if (axis == 'x') {
            x = value;
        }
        else {
            y = value;
        }

        return this.translate(x, y, animation);
    },

    animate: function(easingX, easingY) {
        this.activeEasingX = easingX;
        this.activeEasingY = easingY;

        this.isAnimating = true;
        this.lastX = null;
        this.lastY = null;

        this.animationFrameId = requestAnimationFrame(this.doAnimationFrame);

        this.fireEvent('animationstart', this, this.x, this.y);
        return this;
    },

    translateAnimated: function(x, y, animation) {
        if (!Ext.isObject(animation)) {
            animation = {};
        }

        if (this.isAnimating) {
            this.stopAnimation();
        }

        var now = Ext.Date.now(),
            easing = animation.easing,
            easingX = (typeof x == 'number') ? (animation.easingX || easing || this.getEasingX() || true) : null,
            easingY = (typeof y == 'number') ? (animation.easingY || easing || this.getEasingY() || true) : null;

        if (easingX) {
            easingX = this.factoryEasing(easingX);
            easingX.setStartTime(now);
            easingX.setStartValue(this.x);
            easingX.setEndValue(x);

            if ('duration' in animation) {
                easingX.setDuration(animation.duration);
            }
        }

        if (easingY) {
            easingY = this.factoryEasing(easingY);
            easingY.setStartTime(now);
            easingY.setStartValue(this.y);
            easingY.setEndValue(y);

            if ('duration' in animation) {
                easingY.setDuration(animation.duration);
            }
        }

        return this.animate(easingX, easingY);
    },

    doAnimationFrame: function() {
        var me = this,
            easingX = me.activeEasingX,
            easingY = me.activeEasingY,
            now = Date.now(),
            x, y;

        this.animationFrameId = requestAnimationFrame(this.doAnimationFrame);

        if (!me.isAnimating) {
            return;
        }

        me.lastRun = now;

        if (easingX === null && easingY === null) {
            me.stopAnimation();
            return;
        }

        if (easingX !== null) {
            me.x = x = Math.round(easingX.getValue());

            if (easingX.isEnded) {
                me.activeEasingX = null;
                me.fireEvent('axisanimationend', me, 'x', x);
            }
        }
        else {
            x = me.x;
        }

        if (easingY !== null) {
            me.y = y = Math.round(easingY.getValue());

            if (easingY.isEnded) {
                me.activeEasingY = null;
                me.fireEvent('axisanimationend', me, 'y', y);
            }
        }
        else {
            y = me.y;
        }

        if (me.lastX !== x || me.lastY !== y) {
            me.doTranslate(x, y);

            me.lastX = x;
            me.lastY = y;
        }

        me.fireEvent('animationframe', me, x, y);
    },


    stopAnimation: function() {
        if (!this.isAnimating) {
            return;
        }

        this.activeEasingX = null;
        this.activeEasingY = null;

        this.isAnimating = false;

        cancelAnimationFrame(this.animationFrameId);
        this.fireEvent('animationend', this, this.x, this.y);
    },

    refresh: function() {
        this.translate(this.x, this.y);
    },

    destroy: function() {
        if (this.isAnimating) {
            this.stopAnimation();
        }

        this.callParent(arguments);
    }
});