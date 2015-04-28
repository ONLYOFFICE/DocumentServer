//@tag dom,core
//@require Ext.env.Browser

/**
 * Provides information about operating system environment.
 *
 * Should not be manually instantiated unless for unit-testing.
 * Access the global instance stored in {@link Ext.os} instead.
 * @private
 */
Ext.define('Ext.env.OS', {

    requires: ['Ext.Version'],

    statics: {
        names: {
            ios: 'iOS',
            android: 'Android',
            webos: 'webOS',
            blackberry: 'BlackBerry',
            rimTablet: 'RIMTablet',
            mac: 'MacOS',
            win: 'Windows',
            linux: 'Linux',
            bada: 'Bada',
            other: 'Other'
        },
        prefixes: {
            ios: 'i(?:Pad|Phone|Pod)(?:.*)CPU(?: iPhone)? OS ',
            android: '(Android |HTC_|Silk/)', // Some HTC devices ship with an OSX userAgent by default,
                                        // so we need to add a direct check for HTC_
            blackberry: 'BlackBerry(?:.*)Version\/',
            rimTablet: 'RIM Tablet OS ',
            webos: '(?:webOS|hpwOS)\/',
            bada: 'Bada\/'
        }
    },

    /**
     * A "hybrid" property, can be either accessed as a method call, i.e:
     *
     *     if (Ext.os.is('Android')) {
     *         // ...
     *     }
     *
     * or as an object with boolean properties, i.e:
     *
     *     if (Ext.os.is.Android) {
     *         // ...
     *     }
     *
     * Versions can be conveniently checked as well. For example:
     *
     *     if (Ext.os.is.Android2) {
     *         // Equivalent to (Ext.os.is.Android && Ext.os.version.equals(2))
     *     }
     *
     *     if (Ext.os.is.iOS32) {
     *         // Equivalent to (Ext.os.is.iOS && Ext.os.version.equals(3.2))
     *     }
     *
     * Note that only {@link Ext.Version#getMajor major component} and {@link Ext.Version#getShortVersion simplified}
     * value of the version are available via direct property checking. Supported values are:
     *
     * - iOS
     * - iPad
     * - iPhone
     * - iPhone5 (also true for 4in iPods).
     * - iPod
     * - Android
     * - WebOS
     * - BlackBerry
     * - Bada
     * - MacOS
     * - Windows
     * - Linux
     * - Other
     * @param {String} value The OS name to check.
     * @return {Boolean}
     */
    is: Ext.emptyFn,

    /**
     * @property {String} [name=null]
     * @readonly
     * The full name of the current operating system. Possible values are:
     *
     * - iOS
     * - Android
     * - WebOS
     * - BlackBerry,
     * - MacOS
     * - Windows
     * - Linux
     * - Other
     */
    name: null,

    /**
     * @property {Ext.Version} [version=null]
     * Refer to {@link Ext.Version}
     * @readonly
     */
    version: null,

    setFlag: function(name, value) {
        if (typeof value == 'undefined') {
            value = true;
        }

        this.is[name] = value;
        this.is[name.toLowerCase()] = value;

        return this;
    },

    constructor: function(userAgent, platform) {
        var statics = this.statics(),
            names = statics.names,
            prefixes = statics.prefixes,
            name,
            version = '',
            i, prefix, match, item, is;

        is = this.is = function(name) {
            return this.is[name] === true;
        };

        for (i in prefixes) {
            if (prefixes.hasOwnProperty(i)) {
                prefix = prefixes[i];

                match = userAgent.match(new RegExp('(?:'+prefix+')([^\\s;]+)'));

                if (match) {
                    name = names[i];

                    // This is here because some HTC android devices show an OSX Snow Leopard userAgent by default.
                    // And the Kindle Fire doesn't have any indicator of Android as the OS in its User Agent
                    if (match[1] && (match[1] == "HTC_" || match[1] == "Silk/")) {
                        version = new Ext.Version("2.3");
                    } else {
                        version = new Ext.Version(match[match.length - 1]);
                    }

                    break;
                }
            }
        }

        if (!name) {
            name = names[(userAgent.toLowerCase().match(/mac|win|linux/) || ['other'])[0]];
            version = new Ext.Version('');
        }

        this.name = name;
        this.version = version;

        if (platform) {
            this.setFlag(platform.replace(/ simulator$/i, ''));
        }

        this.setFlag(name);

        if (version) {
            this.setFlag(name + (version.getMajor() || ''));
            this.setFlag(name + version.getShortVersion());
        }

        for (i in names) {
            if (names.hasOwnProperty(i)) {
                item = names[i];

                if (!is.hasOwnProperty(name)) {
                    this.setFlag(item, (name === item));
                }
            }
        }

        // Detect if the device is the iPhone 5.
        if (this.name == "iOS" && window.screen.height == 568) {
            this.setFlag('iPhone5');
        }

        return this;
    }

}, function() {

    var navigation = Ext.global.navigator,
        userAgent = navigation.userAgent,
        osEnv, osName, deviceType;

    //<deprecated product=touch since=2.0>
    this.override('constructor', function() {
        this.callOverridden(arguments);

        var is = this.is;

        if (is.MacOS) {
            Ext.deprecatePropertyValue(is, 'Mac', true, "Ext.is.Mac is deprecated, please use Ext.os.is.MacOS instead");
            Ext.deprecatePropertyValue(is, 'mac', true, "Ext.is.Mac is deprecated, please use Ext.os.is.MacOS instead");
        }

        if (is.BlackBerry) {
            Ext.deprecatePropertyValue(is, 'Blackberry', true, "Ext.is.Blackberry is deprecated, please use Ext.os.is.BlackBerry instead");
        }

        return this;
    });
    //</deprecated>

    /**
     * @class Ext.os
     * @extends Ext.env.OS
     * @singleton
     * Provides useful information about the current operating system environment.
     *
     * Example:
     *
     *     if (Ext.os.is.Windows) {
     *         // Windows specific code here
     *     }
     *
     *     if (Ext.os.is.iOS) {
     *         // iPad, iPod, iPhone, etc.
     *     }
     *
     *     console.log("Version " + Ext.os.version);
     *
     * For a full list of supported values, refer to the {@link #is} property/method.
     *
     * @aside guide environment_package
     */
    Ext.os = osEnv = new this(userAgent, navigation.platform);

    osName = osEnv.name;

    var search = window.location.search.match(/deviceType=(Tablet|Phone)/),
        nativeDeviceType = window.deviceType;

    // Override deviceType by adding a get variable of deviceType. NEEDED FOR DOCS APP.
    // E.g: example/kitchen-sink.html?deviceType=Phone
    if (search && search[1]) {
        deviceType = search[1];
    }
    else if (nativeDeviceType === 'iPhone') {
        deviceType = 'Phone';
    }
    else if (nativeDeviceType === 'iPad') {
        deviceType = 'Tablet';
    }
    else {
        if (!osEnv.is.Android && !osEnv.is.iOS && /Windows|Linux|MacOS/.test(osName)) {
            deviceType = 'Desktop';

            // always set it to false when you are on a desktop
            Ext.browser.is.WebView = false;
        }
        else if (osEnv.is.iPad || osEnv.is.Android3 || (osEnv.is.Android4 && userAgent.search(/mobile/i) == -1)) {
            deviceType = 'Tablet';
        }
        else {
            deviceType = 'Phone';
        }
    }

    /**
     * @property {String} deviceType
     * The generic type of the current device.
     *
     * Possible values:
     *
     * - Phone
     * - Tablet
     * - Desktop
     *
     * For testing purposes the deviceType can be overridden by adding
     * a deviceType parameter to the URL of the page, like so:
     *
     *     http://localhost/mypage.html?deviceType=Tablet
     *
     */
    osEnv.setFlag(deviceType, true);
    osEnv.deviceType = deviceType;

    //<deprecated product=touch since=2.0>
    var flags = Ext.os.is,
        name;

    if (!Ext.is) {
        Ext.is = {};
    }

    for (name in flags) {
        if (flags.hasOwnProperty(name)) {
            Ext.deprecatePropertyValue(Ext.is, name, flags[name], "Ext.is." + name + " is deprecated, please use Ext.os.is." + name + " instead");
        }
    }
    //</deprecated>

    /**
     * @class Ext.is
     * Used to detect if the current browser supports a certain feature, and the type of the current browser.
     * @deprecated 2.0.0
     * Please refer to the {@link Ext.browser}, {@link Ext.os} and {@link Ext.feature} classes instead.
     */
});
