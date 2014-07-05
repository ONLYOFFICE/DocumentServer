/**
 * @private
 * Android version of viewport.
 */
Ext.define('Ext.viewport.Android', {
    extend: 'Ext.viewport.Default',

    constructor: function() {
        this.on('orientationchange', 'doFireOrientationChangeEvent', this, { prepend: true });
        this.on('orientationchange', 'hideKeyboardIfNeeded', this, { prepend: true });

        this.callParent(arguments);

        this.addWindowListener('resize', Ext.Function.bind(this.onResize, this));
    },

    getDummyInput: function() {
        var input = this.dummyInput,
            focusedElement = this.focusedElement,
            box = Ext.fly(focusedElement).getPageBox();

        if (!input) {
            this.dummyInput = input = document.createElement('input');
            input.style.position = 'absolute';
            input.style.opacity = '0';
            document.body.appendChild(input);
        }

        input.style.left = box.left + 'px';
        input.style.top = box.top + 'px';
        input.style.display = '';

        return input;
    },

    doBlurInput: function(e) {
        var target = e.target,
            focusedElement = this.focusedElement,
            dummy;

        if (focusedElement && !this.isInputRegex.test(target.tagName)) {
            dummy = this.getDummyInput();
            delete this.focusedElement;
            dummy.focus();

            setTimeout(function() {
                dummy.style.display = 'none';
            }, 100);
        }
    },

    hideKeyboardIfNeeded: function() {
        var eventController = arguments[arguments.length - 1],
            focusedElement = this.focusedElement;

        if (focusedElement) {
            delete this.focusedElement;
            eventController.pause();

            if (Ext.os.version.lt('4')) {
                focusedElement.style.display = 'none';
            }
            else {
                focusedElement.blur();
            }

            setTimeout(function() {
                focusedElement.style.display = '';
                eventController.resume();
            }, 1000);
        }
    },

    doFireOrientationChangeEvent: function() {
        var eventController = arguments[arguments.length - 1];

        this.orientationChanging = true;

        eventController.pause();

        this.waitUntil(function() {
            return this.getWindowOuterHeight() !== this.windowOuterHeight;
        }, function() {
            this.windowOuterHeight = this.getWindowOuterHeight();
            this.updateSize();

            eventController.firingArguments[2] = this.windowWidth;
            eventController.firingArguments[3] = this.windowHeight;
            eventController.resume();
            this.orientationChanging = false;

        }, function() {
            //<debug error>
            Ext.Logger.error("Timeout waiting for viewport's outerHeight to change before firing orientationchange", this);
            //</debug>
        });

        return this;
    },

    applyAutoMaximize: function(autoMaximize) {
        autoMaximize = this.callParent(arguments);

        this.on('add', 'fixSize', this, { single: true });
        if (!autoMaximize) {
            this.on('ready', 'fixSize', this, { single: true });
            this.onAfter('orientationchange', 'doFixSize', this, { buffer: 100 });
        }
        else {
            this.un('ready', 'fixSize', this);
            this.unAfter('orientationchange', 'doFixSize', this);
        }
    },

    fixSize: function() {
        this.doFixSize();
    },

    doFixSize: function() {
        this.setHeight(this.getWindowHeight());
    },

    determineOrientation: function() {
        return (this.getWindowHeight() >= this.getWindowWidth()) ? this.PORTRAIT : this.LANDSCAPE;
    },

    getActualWindowOuterHeight: function() {
        return Math.round(this.getWindowOuterHeight() / window.devicePixelRatio);
    },

    maximize: function() {
        var stretchHeights = this.stretchHeights,
            orientation = this.orientation,
            height;

        height = stretchHeights[orientation];

        if (!height) {
            stretchHeights[orientation] = height = this.getActualWindowOuterHeight();
        }

        if (!this.addressBarHeight) {
            this.addressBarHeight = height - this.getWindowHeight();
        }

        this.setHeight(height);

        var isHeightMaximized = Ext.Function.bind(this.isHeightMaximized, this, [height]);

        this.scrollToTop();
        this.waitUntil(isHeightMaximized, this.fireMaximizeEvent, this.fireMaximizeEvent);
    },

    isHeightMaximized: function(height) {
        this.scrollToTop();
        return this.getWindowHeight() === height;
    }

}, function() {
    if (!Ext.os.is.Android) {
        return;
    }

    var version = Ext.os.version,
        userAgent = Ext.browser.userAgent,
        // These Android devices have a nasty bug which causes JavaScript timers to be completely frozen
        // when the browser's viewport is being panned.
        isBuggy = /(htc|desire|incredible|ADR6300)/i.test(userAgent) && version.lt('2.3');

    if (isBuggy) {
        this.override({
            constructor: function(config) {
                if (!config) {
                    config = {};
                }

                config.autoMaximize = false;

                this.watchDogTick = Ext.Function.bind(this.watchDogTick, this);

                setInterval(this.watchDogTick, 1000);

                return this.callParent([config]);
            },

            watchDogTick: function() {
                this.watchDogLastTick = Ext.Date.now();
            },

            doPreventPanning: function() {
                var now = Ext.Date.now(),
                    lastTick = this.watchDogLastTick,
                    deltaTime = now - lastTick;

                // Timers are frozen
                if (deltaTime >= 2000) {
                    return;
                }

                return this.callParent(arguments);
            },

            doPreventZooming: function() {
                var now = Ext.Date.now(),
                    lastTick = this.watchDogLastTick,
                    deltaTime = now - lastTick;

                // Timers are frozen
                if (deltaTime >= 2000) {
                    return;
                }

                return this.callParent(arguments);
            }
        });
    }

    if (version.match('2')) {
        this.override({
            onReady: function() {
                this.addWindowListener('resize', Ext.Function.bind(this.onWindowResize, this));

                this.callParent(arguments);
            },

            scrollToTop: function() {
                document.body.scrollTop = 100;
            },

            onWindowResize: function() {
                var oldWidth = this.windowWidth,
                    oldHeight = this.windowHeight,
                    width = this.getWindowWidth(),
                    height = this.getWindowHeight();

                if (this.getAutoMaximize() && !this.isMaximizing && !this.orientationChanging
                    && window.scrollY === 0
                    && oldWidth === width
                    && height < oldHeight
                    && ((height >= oldHeight - this.addressBarHeight) || !this.focusedElement)) {
                        this.scrollToTop();
                }
            },

            fixSize: function() {
                var orientation = this.getOrientation(),
                    outerHeight = window.outerHeight,
                    outerWidth = window.outerWidth,
                    actualOuterHeight;

                // On some Android 2 devices such as the Kindle Fire, outerWidth and outerHeight are reported wrongly
                // when navigating from another page that has larger size.
                if (orientation === 'landscape' && (outerHeight < outerWidth)
                    || orientation === 'portrait' && (outerHeight >= outerWidth)) {
                    actualOuterHeight = this.getActualWindowOuterHeight();
                }
                else {
                    actualOuterHeight = this.getWindowHeight();
                }

                this.waitUntil(function() {
                    return actualOuterHeight > this.getWindowHeight();
                }, this.doFixSize, this.doFixSize, 50, 1000);
            }
        });
    }
    else if (version.gtEq('3.1')) {
        this.override({
            isHeightMaximized: function(height) {
                this.scrollToTop();
                return this.getWindowHeight() === height - 1;
            }
        });
    }
    else if (version.match('3')) {
        this.override({
            isHeightMaximized: function() {
                this.scrollToTop();
                return true;
            }
        })
    }

    if (version.gtEq('4')) {
        this.override({
            doBlurInput: Ext.emptyFn
        });
    }
});
