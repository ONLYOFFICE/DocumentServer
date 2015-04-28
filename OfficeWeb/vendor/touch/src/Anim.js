/**
 * Ext.Anim is used to execute simple animations defined in {@link Ext.anims}. The {@link #run} method can take any of the
 * properties defined below.
 *
 *     Ext.Anim.run(this, 'fade', {
 *         out: false,
 *         autoClear: true
 *     });
 *
 * When using {@link Ext.Anim#run}, ensure you require {@link Ext.Anim} in your application. Either do this using {@link Ext#require}:
 *
 *     Ext.requires('Ext.Anim');
 *
 * when using {@link Ext#setup}:
 *
 *     Ext.setup({
 *         requires: ['Ext.Anim'],
 *         onReady: function() {
 *             //do something
 *         }
 *     });
 *
 * or when using {@link Ext#application}:
 *
 *     Ext.application({
 *         requires: ['Ext.Anim'],
 *         launch: function() {
 *             //do something
 *         }
 *     });
 *
 * @singleton
 */

Ext.define('Ext.Anim', {
    isAnim: true,

    /**
     * @cfg {Boolean} disableAnimations
     * `true` to disable animations.
     */
    disableAnimations: false,

    defaultConfig: {
        /**
         * @cfg {Object} from
         * An object of CSS values which the animation begins with. If you define a CSS property here, you must also
         * define it in the {@link #to} config.
         */
        from: {},

        /**
         * @cfg {Object} to
         * An object of CSS values which the animation ends with. If you define a CSS property here, you must also
         * define it in the {@link #from} config.
         */
        to: {},

        /**
         * @cfg {Number} duration
         * Time in milliseconds for the animation to last.
         */
        duration: 250,

        /**
         * @cfg {Number} delay Time to delay before starting the animation.
         */
        delay: 0,

        /**
         * @cfg {String} easing
         * Valid values are 'ease', 'linear', ease-in', 'ease-out', 'ease-in-out', or a cubic-bezier curve as defined by CSS.
         */
        easing: 'ease-in-out',

        /**
         * @cfg {Boolean} autoClear
         * `true` to remove all custom CSS defined in the {@link #to} config when the animation is over.
         */
        autoClear: true,

        /**
         * @cfg {Boolean} out
         * `true` if you want the animation to slide out of the screen.
         */
        out: true,

        /**
         * @cfg {String} direction
         * Valid values are: 'left', 'right', 'up', 'down', and `null`.
         */
        direction: null,

        /**
         * @cfg {Boolean} reverse
         * `true` to reverse the animation direction. For example, if the animation direction was set to 'left', it would
         * then use 'right'.
         */
        reverse: false
    },

    /**
     * @cfg {Function} before
     * Code to execute before starting the animation.
     */

    /**
     * @cfg {Function} after
     * Code to execute after the animation ends.
     */

    /**
     * @cfg {Object} scope
     * Scope to run the {@link #before} function in.
     */

    opposites: {
        'left': 'right',
        'right': 'left',
        'up': 'down',
        'down': 'up'
    },

    constructor: function(config) {
        config = Ext.apply({}, config || {}, this.defaultConfig);
        this.config = config;

        this.callSuper([config]);

        this.running = [];
    },

    initConfig: function(el, runConfig) {
        var me = this,
            config = Ext.apply({}, runConfig || {}, me.config);

        config.el = el = Ext.get(el);

        if (config.reverse && me.opposites[config.direction]) {
            config.direction = me.opposites[config.direction];
        }

        if (me.config.before) {
            me.config.before.call(config, el, config);
        }

        if (runConfig.before) {
            runConfig.before.call(config.scope || config, el, config);
        }

        return config;
    },

    /**
     * @ignore
     */
    run: function(el, config) {
        el = Ext.get(el);
        config = config || {};


        var me = this,
            style = el.dom.style,
            property,
            after = config.after;

        if (me.running[el.id]) {
            me.onTransitionEnd(null, el, {
                config: config,
                after: after
            });
        }

        config = this.initConfig(el, config);

        if (this.disableAnimations) {
            for (property in config.to) {
                if (!config.to.hasOwnProperty(property)) {
                    continue;
                }
                style[property] = config.to[property];
            }
            this.onTransitionEnd(null, el, {
                config: config,
                after: after
            });
            return me;
        }

        el.un('transitionend', me.onTransitionEnd, me);

        style.webkitTransitionDuration = '0ms';
        for (property in config.from) {
            if (!config.from.hasOwnProperty(property)) {
                continue;
            }
            style[property] = config.from[property];
        }

        setTimeout(function() {
            // If this element has been destroyed since the timeout started, do nothing
            if (!el.dom) {
                return;
            }

            // If this is a 3d animation we have to set the perspective on the parent
            if (config.is3d === true) {
                el.parent().setStyle({
                    // See https://sencha.jira.com/browse/TOUCH-1498
                    '-webkit-perspective': '1200',
                    '-webkit-transform-style': 'preserve-3d'
                });
            }

            style.webkitTransitionDuration = config.duration + 'ms';
            style.webkitTransitionProperty = 'all';
            style.webkitTransitionTimingFunction = config.easing;

            // Bind our listener that fires after the animation ends
            el.on('transitionend', me.onTransitionEnd, me, {
                single: true,
                config: config,
                after: after
            });

            for (property in config.to) {
                if (!config.to.hasOwnProperty(property)) {
                    continue;
                }
                style[property] = config.to[property];
            }
        }, config.delay || 5);

        me.running[el.id] = config;
        return me;
    },

    onTransitionEnd: function(ev, el, o) {
        el = Ext.get(el);

        if (this.running[el.id] === undefined) {
            return;
        }

        var style = el.dom.style,
            config = o.config,
            me = this,
            property;

        if (config.autoClear) {
            for (property in config.to) {
                if (!config.to.hasOwnProperty(property) || config[property] === false) {
                    continue;
                }
                style[property] = '';
            }
        }

        style.webkitTransitionDuration = null;
        style.webkitTransitionProperty = null;
        style.webkitTransitionTimingFunction = null;

        if (config.is3d) {
            el.parent().setStyle({
                '-webkit-perspective': '',
                '-webkit-transform-style': ''
            });
        }

        if (me.config.after) {
            me.config.after.call(config, el, config);
        }

        if (o.after) {
            o.after.call(config.scope || me, el, config);
        }

        delete me.running[el.id];
    }
}, function() {

    Ext.Anim.seed = 1000;

    /**
     * Used to run an animation on a specific element. Use the config argument to customize the animation.
     * @param {Ext.Element/HTMLElement} el The element to animate.
     * @param {String} anim The animation type, defined in {@link Ext.anims}.
     * @param {Object} config The config object for the animation.
     * @method run
     */
    Ext.Anim.run = function(el, anim, config) {
        if (el.isComponent) {
            el = el.element;
        }

        config = config || {};

        if (anim.isAnim) {
            anim.run(el, config);
        }
        else {
            if (Ext.isObject(anim)) {
                if (config.before && anim.before) {
                    config.before = Ext.createInterceptor(config.before, anim.before, anim.scope);
                }
                if (config.after && anim.after) {
                    config.after = Ext.createInterceptor(config.after, anim.after, anim.scope);
                }
                config = Ext.apply({}, config, anim);
                anim = anim.type;
            }

            if (!Ext.anims[anim]) {
                throw anim + ' is not a valid animation type.';
            }
            else {
                // add el check to make sure dom exists.
                if (el && el.dom) {
                    Ext.anims[anim].run(el, config);
                }
            }
        }
    };

    /**
     * @class Ext.anims
     * Defines different types of animations.
     *
     * __Note:__ _flip_, _cube_, and _wipe_ animations do not work on Android.
     *
     * Please refer to {@link Ext.Anim} on how to use animations.
     * @singleton
     */
    Ext.anims = {
        /**
         * Fade Animation
         */
        fade: new Ext.Anim({
            type: 'fade',
            before: function(el) {
                var fromOpacity = 1,
                    toOpacity = 1,
                    curZ = el.getStyle('z-index') == 'auto' ? 0 : el.getStyle('z-index'),
                    zIndex = curZ;

                if (this.out) {
                    toOpacity = 0;
                } else {
                    zIndex = Math.abs(curZ) + 1;
                    fromOpacity = 0;
                }

                this.from = {
                    'opacity': fromOpacity,
                    'z-index': zIndex
                };
                this.to = {
                    'opacity': toOpacity,
                    'z-index': zIndex
                };
            }
        }),

        /**
         * Slide Animation
         */
        slide: new Ext.Anim({
            direction: 'left',
            cover: false,
            reveal: false,
            opacity: false,
            'z-index': false,

            before: function(el) {
                var currentZIndex = el.getStyle('z-index') == 'auto' ? 0 : el.getStyle('z-index'),
                    currentOpacity = el.getStyle('opacity'),
                    zIndex = currentZIndex + 1,
                    out = this.out,
                    direction = this.direction,
                    toX = 0,
                    toY = 0,
                    fromX = 0,
                    fromY = 0,
                    elH = el.getHeight(),
                    elW = el.getWidth();

                if (direction == 'left' || direction == 'right') {
                    if (out) {
                        toX = -elW;
                    }
                    else {
                        fromX = elW;
                    }
                }
                else if (direction == 'up' || direction == 'down') {
                    if (out) {
                        toY = -elH;
                    }
                    else {
                        fromY = elH;
                    }
                }

                if (direction == 'right' || direction == 'down') {
                    toY *= -1;
                    toX *= -1;
                    fromY *= -1;
                    fromX *= -1;
                }

                if (this.cover && out) {
                    toX = 0;
                    toY = 0;
                    zIndex = currentZIndex;
                }
                else if (this.reveal && !out) {
                    fromX = 0;
                    fromY = 0;
                    zIndex = currentZIndex;
                }

                this.from = {
                    '-webkit-transform': 'translate3d(' + fromX + 'px, ' + fromY + 'px, 0)',
                    'z-index': zIndex,
                    'opacity': currentOpacity - 0.01
                };
                this.to = {
                    '-webkit-transform': 'translate3d(' + toX + 'px, ' + toY + 'px, 0)',
                    'z-index': zIndex,
                    'opacity': currentOpacity
                };
            }
        }),

        /**
         * Pop Animation
         */
        pop: new Ext.Anim({
            scaleOnExit: true,
            before: function(el) {
                var fromScale = 1,
                    toScale = 1,
                    fromOpacity = 1,
                    toOpacity = 1,
                    curZ = el.getStyle('z-index') == 'auto' ? 0 : el.getStyle('z-index'),
                    fromZ = curZ,
                    toZ = curZ;

                if (!this.out) {
                    fromScale = 0.01;
                    fromZ = curZ + 1;
                    toZ = curZ + 1;
                    fromOpacity = 0;
                }
                else {
                    if (this.scaleOnExit) {
                        toScale = 0.01;
                        toOpacity = 0;
                    } else {
                        toOpacity = 0.8;
                    }
                }

                this.from = {
                    '-webkit-transform': 'scale(' + fromScale + ')',
                    '-webkit-transform-origin': '50% 50%',
                    'opacity': fromOpacity,
                    'z-index': fromZ
                };

                this.to = {
                    '-webkit-transform': 'scale(' + toScale + ')',
                    '-webkit-transform-origin': '50% 50%',
                    'opacity': toOpacity,
                    'z-index': toZ
                };
            }
        }),

        /**
         * Flip Animation
         */
        flip: new Ext.Anim({
            is3d: true,
            direction: 'left',
            before: function(el) {
                var rotateProp = 'Y',
                    fromScale = 1,
                    toScale = 1,
                    fromRotate = 0,
                    toRotate = 0;

                if (this.out) {
                    toRotate = -180;
                    toScale = 0.8;
                }
                else {
                    fromRotate = 180;
                    fromScale = 0.8;
                }

                if (this.direction == 'up' || this.direction == 'down') {
                    rotateProp = 'X';
                }

                if (this.direction == 'right' || this.direction == 'left') {
                    toRotate *= -1;
                    fromRotate *= -1;
                }

                this.from = {
                    '-webkit-transform': 'rotate' + rotateProp + '(' + fromRotate + 'deg) scale(' + fromScale + ')',
                    '-webkit-backface-visibility': 'hidden'
                };
                this.to = {
                    '-webkit-transform': 'rotate' + rotateProp + '(' + toRotate + 'deg) scale(' + toScale + ')',
                    '-webkit-backface-visibility': 'hidden'
                };
            }
        }),

        /**
         * Cube Animation
         */
        cube: new Ext.Anim({
            is3d: true,
            direction: 'left',
            style: 'outer',
            before: function(el) {
                var origin = '0% 0%',
                    fromRotate = 0,
                    toRotate = 0,
                    rotateProp = 'Y',
                    fromZ = 0,
                    toZ = 0,
                    elW = el.getWidth(),
                    elH = el.getHeight(),
                    showTranslateZ = true,
                    fromTranslate = ' translateX(0)',
                    toTranslate = '';

                if (this.direction == 'left' || this.direction == 'right') {
                    if (this.out) {
                        origin = '100% 100%';
                        toZ = elW;
                        toRotate = -90;
                    } else {
                        origin = '0% 0%';
                        fromZ = elW;
                        fromRotate = 90;
                    }
                } else if (this.direction == 'up' || this.direction == 'down') {
                    rotateProp = 'X';
                    if (this.out) {
                        origin = '100% 100%';
                        toZ = elH;
                        toRotate = 90;
                    } else {
                        origin = '0% 0%';
                        fromZ = elH;
                        fromRotate = -90;
                    }
                }

                if (this.direction == 'down' || this.direction == 'right') {
                    fromRotate *= -1;
                    toRotate *= -1;
                    origin = (origin == '0% 0%') ? '100% 100%': '0% 0%';
                }

                if (this.style == 'inner') {
                    fromZ *= -1;
                    toZ *= -1;
                    fromRotate *= -1;
                    toRotate *= -1;

                    if (!this.out) {
                        toTranslate = ' translateX(0px)';
                        origin = '0% 50%';
                    } else {
                        toTranslate = fromTranslate;
                        origin = '100% 50%';
                    }
                }

                this.from = {
                    '-webkit-transform': 'rotate' + rotateProp + '(' + fromRotate + 'deg)' + (showTranslateZ ? ' translateZ(' + fromZ + 'px)': '') + fromTranslate,
                    '-webkit-transform-origin': origin
                };
                this.to = {
                    '-webkit-transform': 'rotate' + rotateProp + '(' + toRotate + 'deg) translateZ(' + toZ + 'px)' + toTranslate,
                    '-webkit-transform-origin': origin
                };
            },
            duration: 250
        }),


        /**
         * Wipe Animation.
         * Because of the amount of calculations involved, this animation is best used on small display
         * changes or specifically for phone environments. Does not currently accept any parameters.
         */
        wipe: new Ext.Anim({
            before: function(el) {
                var curZ = el.getStyle('z-index'),
                    zIndex,
                    mask = '';

                if (!this.out) {
                    zIndex = curZ + 1;
                    mask = '-webkit-gradient(linear, left bottom, right bottom, from(transparent), to(#000), color-stop(66%, #000), color-stop(33%, transparent))';

                    this.from = {
                        '-webkit-mask-image': mask,
                        '-webkit-mask-size': el.getWidth() * 3 + 'px ' + el.getHeight() + 'px',
                        'z-index': zIndex,
                        '-webkit-mask-position-x': 0
                    };
                    this.to = {
                        '-webkit-mask-image': mask,
                        '-webkit-mask-size': el.getWidth() * 3 + 'px ' + el.getHeight() + 'px',
                        'z-index': zIndex,
                        '-webkit-mask-position-x': -el.getWidth() * 2 + 'px'
                    };
                }
            },
            duration: 500
        })
    };
});
