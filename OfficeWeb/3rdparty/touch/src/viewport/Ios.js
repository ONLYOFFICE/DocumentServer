/**
 * @private
 * iOS version of viewport.
 */
Ext.define('Ext.viewport.Ios', {
    extend: 'Ext.viewport.Default',

    isFullscreen: function() {
        return this.isHomeScreen();
    },

    isHomeScreen: function() {
        return window.navigator.standalone === true;
    },

    constructor: function() {
        this.callParent(arguments);

        if (this.getAutoMaximize() && !this.isFullscreen()) {
            this.addWindowListener('touchstart', Ext.Function.bind(this.onTouchStart, this));
        }
    },

    maximize: function() {
        if (this.isFullscreen()) {
            return this.callParent();
        }

        var stretchHeights = this.stretchHeights,
            orientation = this.orientation,
            currentHeight = this.getWindowHeight(),
            height = stretchHeights[orientation];

        if (window.scrollY > 0) {
            this.scrollToTop();

            if (!height) {
                stretchHeights[orientation] = height = this.getWindowHeight();
            }

            this.setHeight(height);
            this.fireMaximizeEvent();
        }
        else {
            if (!height) {
                height = this.getScreenHeight();
            }

            this.setHeight(height);

            this.waitUntil(function() {
                this.scrollToTop();
                return currentHeight !== this.getWindowHeight();
            }, function() {
                if (!stretchHeights[orientation]) {
                    height = stretchHeights[orientation] = this.getWindowHeight();
                    this.setHeight(height);
                }

                this.fireMaximizeEvent();
            }, function() {
                //<debug error>
                Ext.Logger.error("Timeout waiting for window.innerHeight to change", this);
                //</debug>
                height = stretchHeights[orientation] = this.getWindowHeight();
                this.setHeight(height);
                this.fireMaximizeEvent();
            }, 50, 1000);
        }
    },

    getScreenHeight: function() {
        return window.screen[this.orientation === this.PORTRAIT ? 'height' : 'width'];
    },

    onElementFocus: function() {
        if (this.getAutoMaximize() && !this.isFullscreen()) {
            clearTimeout(this.scrollToTopTimer);
        }

        this.callParent(arguments);
    },

    onElementBlur: function() {
        if (this.getAutoMaximize() && !this.isFullscreen()) {
            this.scrollToTopTimer = setTimeout(this.scrollToTop, 500);
        }

        this.callParent(arguments);
    },

    onTouchStart: function() {
        if (this.focusedElement === null) {
            this.scrollToTop();
        }
    },

    scrollToTop: function() {
        window.scrollTo(0, 0);
    }

}, function() {
    if (!Ext.os.is.iOS) {
        return;
    }

    if (Ext.os.version.lt('3.2')) {
        this.override({
            constructor: function() {
                var stretchHeights = this.stretchHeights = {};

                stretchHeights[this.PORTRAIT] = 416;
                stretchHeights[this.LANDSCAPE] = 268;

                return this.callOverridden(arguments);
            }
        });
    }

    if (Ext.os.version.lt('5')) {
        this.override({
            fieldMaskClsTest: '-field-mask',

            doPreventZooming: function(e) {
                var target = e.target;

                if (target && target.nodeType === 1 &&
                    !this.isInputRegex.test(target.tagName) &&
                    target.className.indexOf(this.fieldMaskClsTest) == -1) {
                    e.preventDefault();
                }
            }
        });
    }

    if (Ext.os.is.iPad) {
        this.override({
            isFullscreen: function() {
                return true;
            }
        });
    }
});
