/**
 * @private
 * Base class for iOS and Android viewports.
 */
Ext.define('Ext.viewport.Default', {
    extend: 'Ext.Container',

    xtype: 'viewport',

    PORTRAIT: 'portrait',

    LANDSCAPE: 'landscape',

    requires: [
        'Ext.LoadMask',
        'Ext.layout.Card'
    ],

    /**
     * @event ready
     * Fires when the Viewport is in the DOM and ready.
     * @param {Ext.Viewport} this
     */

    /**
     * @event maximize
     * Fires when the Viewport is maximized.
     * @param {Ext.Viewport} this
     */

    /**
     * @event orientationchange
     * Fires when the Viewport orientation has changed.
     * @param {Ext.Viewport} this
     * @param {String} newOrientation The new orientation.
     * @param {Number} width The width of the Viewport.
     * @param {Number} height The height of the Viewport.
     */

    config: {
        /**
         * @cfg {Boolean} autoMaximize
         * Whether or not to always automatically maximize the viewport on first load and all subsequent orientation changes.
         *
         * This is set to `false` by default for a number of reasons:
         *
         * - Orientation change performance is drastically reduced when this is enabled, on all devices.
         * - On some devices (mostly Android) this can sometimes cause issues when the default browser zoom setting is changed.
         * - When wrapping your phone in a native shell, you may get a blank screen.
         * - When bookmarked to the homescreen (iOS), you may get a blank screen.
         *
         * @accessor
         */
        autoMaximize: false,

        /**
         * @private
         */
        autoBlurInput: true,

        /**
         * @cfg {Boolean} preventPanning
         * Whether or not to always prevent default panning behavior of the
         * browser's viewport.
         * @accessor
         */
        preventPanning: true,

        /**
         * @cfg {Boolean} preventZooming
         * `true` to attempt to stop zooming when you double tap on the screen on mobile devices,
         * typically HTC devices with HTC Sense UI.
         * @accessor
         */
        preventZooming: false,

        /**
         * @cfg
         * @private
         */
        autoRender: true,

        /**
         * @cfg {Object/String} layout Configuration for this Container's layout. Example:
         *
         *     Ext.create('Ext.Container', {
         *         layout: {
         *             type: 'hbox',
         *             align: 'middle'
         *         },
         *         items: [
         *             {
         *                 xtype: 'panel',
         *                 flex: 1,
         *                 style: 'background-color: red;'
         *             },
         *             {
         *                 xtype: 'panel',
         *                 flex: 2,
         *                 style: 'background-color: green'
         *             }
         *         ]
         *     });
         *
         * See the [layouts guide](#!/guides/layouts) for more information.
         *
         * @accessor
         */
        layout: 'card',

        /**
         * @cfg
         * @private
         */
        width: '100%',

        /**
         * @cfg
         * @private
         */
        height: '100%',

        useBodyElement: true
    },

    /**
     * @property {Boolean} isReady
     * `true` if the DOM is ready.
     */
    isReady: false,

    isViewport: true,

    isMaximizing: false,

    id: 'ext-viewport',

    isInputRegex: /^(input|textarea|select|a)$/i,

    focusedElement: null,

    /**
     * @private
     */
    fullscreenItemCls: Ext.baseCSSPrefix + 'fullscreen',

    constructor: function(config) {
        var bind = Ext.Function.bind;

        this.doPreventPanning = bind(this.doPreventPanning, this);
        this.doPreventZooming = bind(this.doPreventZooming, this);
        this.doBlurInput = bind(this.doBlurInput, this);

        this.maximizeOnEvents = ['ready', 'orientationchange'];

        this.orientation = this.determineOrientation();
        this.windowWidth = this.getWindowWidth();
        this.windowHeight = this.getWindowHeight();
        this.windowOuterHeight = this.getWindowOuterHeight();

        if (!this.stretchHeights) {
            this.stretchHeights = {};
        }

        this.callParent([config]);

        // Android is handled separately
        if (!Ext.os.is.Android || Ext.browser.name == 'ChromeMobile') {
            if (this.supportsOrientation()) {
                this.addWindowListener('orientationchange', bind(this.onOrientationChange, this));
            }
            else {
                this.addWindowListener('resize', bind(this.onResize, this));
            }
        }

        document.addEventListener('focus', bind(this.onElementFocus, this), true);
        document.addEventListener('blur', bind(this.onElementBlur, this), true);

        Ext.onDocumentReady(this.onDomReady, this);

        this.on('ready', this.onReady, this, {single: true});

        this.getEventDispatcher().addListener('component', '*', 'fullscreen', 'onItemFullscreenChange', this);

        return this;
    },

    onDomReady: function() {
        this.isReady = true;
        this.updateSize();
        this.fireEvent('ready', this);
    },

    onReady: function() {
        if (this.getAutoRender()) {
            this.render();
        }
    },

    onElementFocus: function(e) {
        this.focusedElement = e.target;
    },

    onElementBlur: function() {
        this.focusedElement = null;
    },

    render: function() {
        if (!this.rendered) {
            var body = Ext.getBody(),
                clsPrefix = Ext.baseCSSPrefix,
                classList = [],
                osEnv = Ext.os,
                osName = osEnv.name.toLowerCase(),
                browserName = Ext.browser.name.toLowerCase(),
                osMajorVersion = osEnv.version.getMajor(),
                orientation = this.getOrientation();

            this.renderTo(body);

            classList.push(clsPrefix + osEnv.deviceType.toLowerCase());

            if (osEnv.is.iPad) {
                classList.push(clsPrefix + 'ipad');
            }

            classList.push(clsPrefix + osName);
            classList.push(clsPrefix + browserName);

            if (osMajorVersion) {
                classList.push(clsPrefix + osName + '-' + osMajorVersion);
            }

            if (osEnv.is.BlackBerry) {
                classList.push(clsPrefix + 'bb');
            }

            if (Ext.browser.is.Standalone) {
                classList.push(clsPrefix + 'standalone');
            }

            classList.push(clsPrefix + orientation);

            body.addCls(classList);
        }
    },

    applyAutoBlurInput: function(autoBlurInput) {
        var touchstart = (Ext.feature.has.Touch) ? 'touchstart' : 'mousedown';

        if (autoBlurInput) {
            this.addWindowListener(touchstart, this.doBlurInput, false);
        }
        else {
            this.removeWindowListener(touchstart, this.doBlurInput, false);
        }

        return autoBlurInput;
    },

    applyAutoMaximize: function(autoMaximize) {
        if (Ext.browser.is.WebView) {
            autoMaximize = false;
        }
        if (autoMaximize) {
            this.on('ready', 'doAutoMaximizeOnReady', this, { single: true });
            this.on('orientationchange', 'doAutoMaximizeOnOrientationChange', this);
        }
        else {
            this.un('ready', 'doAutoMaximizeOnReady', this);
            this.un('orientationchange', 'doAutoMaximizeOnOrientationChange', this);
        }

        return autoMaximize;
    },

    applyPreventPanning: function(preventPanning) {
        if (preventPanning) {
            this.addWindowListener('touchmove', this.doPreventPanning, false);
        }
        else {
            this.removeWindowListener('touchmove', this.doPreventPanning, false);
        }

        return preventPanning;
    },

    applyPreventZooming: function(preventZooming) {
        var touchstart = (Ext.feature.has.Touch) ? 'touchstart' : 'mousedown';

        if (preventZooming) {
            this.addWindowListener(touchstart, this.doPreventZooming, false);
        }
        else {
            this.removeWindowListener(touchstart, this.doPreventZooming, false);
        }

        return preventZooming;
    },

    doAutoMaximizeOnReady: function() {
        var controller = arguments[arguments.length - 1];

        controller.pause();

        this.isMaximizing = true;

        this.on('maximize', function() {
            this.isMaximizing = false;

            this.updateSize();

            controller.resume();

            this.fireEvent('ready', this);
        }, this, { single: true });

        this.maximize();
    },

    doAutoMaximizeOnOrientationChange: function() {
        var controller = arguments[arguments.length - 1],
            firingArguments = controller.firingArguments;

        controller.pause();

        this.isMaximizing = true;

        this.on('maximize', function() {
            this.isMaximizing = false;

            this.updateSize();

            firingArguments[2] = this.windowWidth;
            firingArguments[3] = this.windowHeight;

            controller.resume();
        }, this, { single: true });

        this.maximize();
    },

    doBlurInput: function(e) {
        var target = e.target,
            focusedElement = this.focusedElement;

        if (focusedElement && !this.isInputRegex.test(target.tagName)) {
            delete this.focusedElement;
            focusedElement.blur();
        }
    },

    doPreventPanning: function(e) {
        e.preventDefault();
    },

    doPreventZooming: function(e) {
        // Don't prevent right mouse event
        if ('button' in e && e.button !== 0) {
            return;
        }

        var target = e.target;

        if (target && target.nodeType === 1 && !this.isInputRegex.test(target.tagName)) {
            e.preventDefault();
        }
    },

    addWindowListener: function(eventName, fn, capturing) {
        window.addEventListener(eventName, fn, Boolean(capturing));
    },

    removeWindowListener: function(eventName, fn, capturing) {
        window.removeEventListener(eventName, fn, Boolean(capturing));
    },

    doAddListener: function(eventName, fn, scope, options) {
        if (eventName === 'ready' && this.isReady && !this.isMaximizing) {
            fn.call(scope);
            return this;
        }

        return this.callSuper(arguments);
    },

    supportsOrientation: function() {
        return Ext.feature.has.Orientation;
    },

    onResize: function() {
        var oldWidth = this.windowWidth,
            oldHeight = this.windowHeight,
            width = this.getWindowWidth(),
            height = this.getWindowHeight(),
            currentOrientation = this.getOrientation(),
            newOrientation = this.determineOrientation();

        // Determine orientation change via resize. BOTH width AND height much change, otherwise
        // this is a keyboard popping up.
        if ((oldWidth !== width && oldHeight !== height) && currentOrientation !== newOrientation) {
            this.fireOrientationChangeEvent(newOrientation, currentOrientation);
        }
    },

    onOrientationChange: function() {
        var currentOrientation = this.getOrientation(),
            newOrientation = this.determineOrientation();

        if (newOrientation !== currentOrientation) {
            this.fireOrientationChangeEvent(newOrientation, currentOrientation);
        }
    },

    fireOrientationChangeEvent: function(newOrientation, oldOrientation) {
        var clsPrefix = Ext.baseCSSPrefix;
        Ext.getBody().replaceCls(clsPrefix + oldOrientation, clsPrefix + newOrientation);

        this.orientation = newOrientation;

        this.updateSize();
        this.fireEvent('orientationchange', this, newOrientation, this.windowWidth, this.windowHeight);
    },

    updateSize: function(width, height) {
        this.windowWidth = width !== undefined ? width : this.getWindowWidth();
        this.windowHeight = height !== undefined ? height : this.getWindowHeight();

        return this;
    },

    waitUntil: function(condition, onSatisfied, onTimeout, delay, timeoutDuration) {
        if (!delay) {
            delay = 50;
        }

        if (!timeoutDuration) {
            timeoutDuration = 2000;
        }

        var scope = this,
            elapse = 0;

        setTimeout(function repeat() {
            elapse += delay;

            if (condition.call(scope) === true) {
                if (onSatisfied) {
                    onSatisfied.call(scope);
                }
            }
            else {
                if (elapse >= timeoutDuration) {
                    if (onTimeout) {
                        onTimeout.call(scope);
                    }
                }
                else {
                    setTimeout(repeat, delay);
                }
            }
        }, delay);
    },

    maximize: function() {
        this.fireMaximizeEvent();
    },

    fireMaximizeEvent: function() {
        this.updateSize();
        this.fireEvent('maximize', this);
    },

    doSetHeight: function(height) {
        Ext.getBody().setHeight(height);

        this.callParent(arguments);
    },

    doSetWidth: function(width) {
        Ext.getBody().setWidth(width);

        this.callParent(arguments);
    },

    scrollToTop: function() {
        window.scrollTo(0, -1);
    },

    /**
     * Retrieves the document width.
     * @return {Number} width in pixels.
     */
    getWindowWidth: function() {
        return window.innerWidth;
    },

    /**
     * Retrieves the document height.
     * @return {Number} height in pixels.
     */
    getWindowHeight: function() {
        return window.innerHeight;
    },

    getWindowOuterHeight: function() {
        return window.outerHeight;
    },

    getWindowOrientation: function() {
        return window.orientation;
    },

    /**
     * Returns the current orientation.
     * @return {String} `portrait` or `landscape`
     */
    getOrientation: function() {
        return this.orientation;
    },

    getSize: function() {
        return {
            width: this.windowWidth,
            height: this.windowHeight
        };
    },

    determineOrientation: function() {
        var portrait = this.PORTRAIT,
            landscape = this.LANDSCAPE;

        if (this.supportsOrientation()) {
            if (this.getWindowOrientation() % 180 === 0) {
                return portrait;
            }

            return landscape;
        }
        else {
            if (this.getWindowHeight() >= this.getWindowWidth()) {
                return portrait;
            }

            return landscape;
        }
    },

    onItemFullscreenChange: function(item) {
        item.addCls(this.fullscreenItemCls);
        this.add(item);
    }
});
