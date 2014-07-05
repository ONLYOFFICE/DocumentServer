//@tag dom,core
//@require Ext-more

/**
 * Provides information about browser.
 *
 * Should not be manually instantiated unless for unit-testing.
 * Access the global instance stored in {@link Ext.browser} instead.
 * @private
 */
Ext.define('Ext.env.Browser', {
    requires: ['Ext.Version'],

    statics: {
        browserNames: {
            ie: 'IE',
            firefox: 'Firefox',
            safari: 'Safari',
            chrome: 'Chrome',
            opera: 'Opera',
            dolfin: 'Dolfin',
            webosbrowser: 'webOSBrowser',
            chromeMobile: 'ChromeMobile',
            silk: 'Silk',
            other: 'Other'
        },
        engineNames: {
            webkit: 'WebKit',
            gecko: 'Gecko',
            presto: 'Presto',
            trident: 'Trident',
            other: 'Other'
        },
        enginePrefixes: {
            webkit: 'AppleWebKit/',
            gecko: 'Gecko/',
            presto: 'Presto/',
            trident: 'Trident/'
        },
        browserPrefixes: {
            ie: 'MSIE ',
            firefox: 'Firefox/',
            chrome: 'Chrome/',
            safari: 'Version/',
            opera: 'Opera/',
            dolfin: 'Dolfin/',
            webosbrowser: 'wOSBrowser/',
            chromeMobile: 'CrMo/',
            silk: 'Silk/'
        }
    },

    styleDashPrefixes: {
        WebKit: '-webkit-',
        Gecko: '-moz-',
        Trident: '-ms-',
        Presto: '-o-',
        Other: ''
    },

    stylePrefixes: {
        WebKit: 'Webkit',
        Gecko: 'Moz',
        Trident: 'ms',
        Presto: 'O',
        Other: ''
    },

    propertyPrefixes: {
        WebKit: 'webkit',
        Gecko: 'moz',
        Trident: 'ms',
        Presto: 'o',
        Other: ''
    },

    // scope: Ext.env.Browser.prototype

    /**
     * A "hybrid" property, can be either accessed as a method call, for example:
     *
     *     if (Ext.browser.is('IE')) {
     *         // ...
     *     }
     *
     * Or as an object with Boolean properties, for example:
     *
     *     if (Ext.browser.is.IE) {
     *         // ...
     *     }
     *
     * Versions can be conveniently checked as well. For example:
     *
     *     if (Ext.browser.is.IE6) {
     *         // Equivalent to (Ext.browser.is.IE && Ext.browser.version.equals(6))
     *     }
     *
     * __Note:__ Only {@link Ext.Version#getMajor major component}  and {@link Ext.Version#getShortVersion simplified}
     * value of the version are available via direct property checking.
     *
     * Supported values are:
     *
     * - IE
     * - Firefox
     * - Safari
     * - Chrome
     * - Opera
     * - WebKit
     * - Gecko
     * - Presto
     * - Trident
     * - WebView
     * - Other
     *
     * @param {String} value The OS name to check.
     * @return {Boolean}
     */
    is: Ext.emptyFn,

    /**
     * The full name of the current browser.
     * Possible values are:
     *
     * - IE
     * - Firefox
     * - Safari
     * - Chrome
     * - Opera
     * - Other
     * @type String
     * @readonly
     */
    name: null,

    /**
     * Refer to {@link Ext.Version}.
     * @type Ext.Version
     * @readonly
     */
    version: null,

    /**
     * The full name of the current browser's engine.
     * Possible values are:
     *
     * - WebKit
     * - Gecko
     * - Presto
     * - Trident
     * - Other
     * @type String
     * @readonly
     */
    engineName: null,

    /**
     * Refer to {@link Ext.Version}.
     * @type Ext.Version
     * @readonly
     */
    engineVersion: null,

    setFlag: function(name, value) {
        if (typeof value == 'undefined') {
            value = true;
        }

        this.is[name] = value;
        this.is[name.toLowerCase()] = value;

        return this;
    },

    constructor: function(userAgent) {
        /**
         * @property {String}
         * Browser User Agent string.
         */
        this.userAgent = userAgent;

        is = this.is = function(name) {
            return is[name] === true;
        };

        var statics = this.statics(),
            browserMatch = userAgent.match(new RegExp('((?:' + Ext.Object.getValues(statics.browserPrefixes).join(')|(?:') + '))([\\w\\._]+)')),
            engineMatch = userAgent.match(new RegExp('((?:' + Ext.Object.getValues(statics.enginePrefixes).join(')|(?:') + '))([\\w\\._]+)')),
            browserNames = statics.browserNames,
            browserName = browserNames.other,
            engineNames = statics.engineNames,
            engineName = engineNames.other,
            browserVersion = '',
            engineVersion = '',
            isWebView = false,
            is, i, name;

        if (browserMatch) {
            browserName = browserNames[Ext.Object.getKey(statics.browserPrefixes, browserMatch[1])];

            browserVersion = new Ext.Version(browserMatch[2]);
        }

        if (engineMatch) {
            engineName = engineNames[Ext.Object.getKey(statics.enginePrefixes, engineMatch[1])];
            engineVersion = new Ext.Version(engineMatch[2]);
        }

        // Facebook changes the userAgent when you view a website within their iOS app. For some reason, the strip out information
        // about the browser, so we have to detect that and fake it...
        if (userAgent.match(/FB/) && browserName == "Other") {
            browserName = browserNames.safari;
            engineName = engineNames.webkit;
        }

        if (userAgent.match(/Android.*Chrome/g)) {
            browserName = 'ChromeMobile';
        }

        Ext.apply(this, {
            engineName: engineName,
            engineVersion: engineVersion,
            name: browserName,
            version: browserVersion
        });

        this.setFlag(browserName);

        if (browserVersion) {
            this.setFlag(browserName + (browserVersion.getMajor() || ''));
            this.setFlag(browserName + browserVersion.getShortVersion());
        }

        for (i in browserNames) {
            if (browserNames.hasOwnProperty(i)) {
                name = browserNames[i];

                this.setFlag(name, browserName === name);
            }
        }

        this.setFlag(name);

        if (engineVersion) {
            this.setFlag(engineName + (engineVersion.getMajor() || ''));
            this.setFlag(engineName + engineVersion.getShortVersion());
        }

        for (i in engineNames) {
            if (engineNames.hasOwnProperty(i)) {
                name = engineNames[i];

                this.setFlag(name, engineName === name);
            }
        }

        this.setFlag('Standalone', !!navigator.standalone);

        if (typeof window.PhoneGap != 'undefined' || typeof window.Cordova != 'undefined' || typeof window.cordova != 'undefined') {
            isWebView = true;
            this.setFlag('PhoneGap');
        }
        else if (!!window.isNK) {
            isWebView = true;
            this.setFlag('Sencha');
        }

        // Check if running in UIWebView
        if (/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)(?!.*FBAN)/i.test(userAgent)) {
            isWebView = true;
        }

        // Flag to check if it we are in the WebView
        this.setFlag('WebView', isWebView);

        /**
         * @property {Boolean}
         * `true` if browser is using strict mode.
         */
        this.isStrict = document.compatMode == "CSS1Compat";

        /**
         * @property {Boolean}
         * `true` if page is running over SSL.
         */
        this.isSecure = /^https/i.test(window.location.protocol);

        return this;
    },

    getStyleDashPrefix: function() {
        return this.styleDashPrefixes[this.engineName];
    },

    getStylePrefix: function() {
        return this.stylePrefixes[this.engineName];
    },

    getVendorProperyName: function(name) {
        var prefix = this.propertyPrefixes[this.engineName];

        if (prefix.length > 0) {
            return prefix + Ext.String.capitalize(name);
        }

        return name;
    }

}, function() {
    /**
     * @class Ext.browser
     * @extends Ext.env.Browser
     * @singleton
     * Provides useful information about the current browser.
     *
     * Example:
     *
     *     if (Ext.browser.is.IE) {
     *         // IE specific code here
     *     }
     *
     *     if (Ext.browser.is.WebKit) {
     *         // WebKit specific code here
     *     }
     *
     *     console.log("Version " + Ext.browser.version);
     *
     * For a full list of supported values, refer to {@link #is} property/method.
     *
     * @aside guide environment_package
     */
    var browserEnv = Ext.browser = new this(Ext.global.navigator.userAgent);

    //<deprecated product=touch since=2.0>
    var flags = browserEnv.is,
        name;

    if (!Ext.is) {
        Ext.is = {};
    }

    for (name in flags) {
        if (flags.hasOwnProperty(name)) {
            Ext.deprecatePropertyValue(Ext.is, name, flags[name], "Ext.is." + name + " is deprecated, " +
                "please use Ext.browser.is." + name + " instead");
        }
    }

    Ext.deprecatePropertyValue(Ext, 'isStrict', browserEnv.isStrict, "Ext.isStrict is deprecated, " +
        "please use Ext.browser.isStrict instead");
    Ext.deprecatePropertyValue(Ext, 'userAgent', browserEnv.userAgent, "Ext.userAgent is deprecated, " +
        "please use Ext.browser.userAgent instead");
    //</deprecated>
});
