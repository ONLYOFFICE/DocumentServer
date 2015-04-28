/**
 * Provides a cross browser class for retrieving location information.
 *
 * Based on the [Geolocation API Specification](http://dev.w3.org/geo/api/spec-source.html)
 *
 * When instantiated, by default this class immediately begins tracking location information,
 * firing a {@link #locationupdate} event when new location information is available.  To disable this
 * location tracking (which may be battery intensive on mobile devices), set {@link #autoUpdate} to `false`.
 *
 * When this is done, only calls to {@link #updateLocation} will trigger a location retrieval.
 *
 * A {@link #locationerror} event is raised when an error occurs retrieving the location, either due to a user
 * denying the application access to it, or the browser not supporting it.
 *
 * The below code shows a GeoLocation making a single retrieval of location information.
 *
 *     var geo = Ext.create('Ext.util.Geolocation', {
 *         autoUpdate: false,
 *         listeners: {
 *             locationupdate: function(geo) {
 *                 alert('New latitude: ' + geo.getLatitude());
 *             },
 *             locationerror: function(geo, bTimeout, bPermissionDenied, bLocationUnavailable, message) {
 *                 if(bTimeout){
 *                     alert('Timeout occurred.');
 *                 } else {
 *                     alert('Error occurred.');
 *                 }
 *             }
 *         }
 *     });
 *     geo.updateLocation();
 */
Ext.define('Ext.util.Geolocation', {
    extend: 'Ext.Evented',
    alternateClassName: ['Ext.util.GeoLocation'],

    config: {
        /**
         * @event locationerror
         * Raised when a location retrieval operation failed.
         *
         * In the case of calling updateLocation, this event will be raised only once.
         *
         * If {@link #autoUpdate} is set to `true`, this event could be raised repeatedly.
         * The first error is relative to the moment {@link #autoUpdate} was set to `true`
         * (or this {@link Ext.util.Geolocation} was initialized with the {@link #autoUpdate} config option set to `true`).
         * Subsequent errors are relative to the moment when the device determines that it's position has changed.
         * @param {Ext.util.Geolocation} this
         * @param {Boolean} timeout
         * Boolean indicating a timeout occurred
         * @param {Boolean} permissionDenied
         * Boolean indicating the user denied the location request
         * @param {Boolean} locationUnavailable
         * Boolean indicating that the location of the device could not be determined.
         * For instance, one or more of the location providers used in the location acquisition
         * process reported an internal error that caused the process to fail entirely.
         * @param {String} message An error message describing the details of the error encountered.
         *
         * This attribute is primarily intended for debugging and should not be used
         * directly in an application user interface.
         */

        /**
         * @event locationupdate
         * Raised when a location retrieval operation has been completed successfully.
         * @param {Ext.util.Geolocation} this
         * Retrieve the current location information from the GeoLocation object by using the read-only
         * properties: {@link #latitude}, {@link #longitude}, {@link #accuracy}, {@link #altitude}, {@link #altitudeAccuracy}, {@link #heading}, and {@link #speed}.
         */

        /**
         * @cfg {Boolean} autoUpdate
         * When set to `true`, continually monitor the location of the device (beginning immediately)
         * and fire {@link #locationupdate} and {@link #locationerror} events.
         */
        autoUpdate: true,

        /**
         * @cfg {Number} frequency
         * The frequency of each update if {@link #autoUpdate} is set to `true`.
         */
        frequency: 10000,

        /**
         * Read-only property representing the last retrieved
         * geographical coordinate specified in degrees.
         * @type Number
         * @readonly
         */
        latitude: null,

        /**
         * Read-only property representing the last retrieved
         * geographical coordinate specified in degrees.
         * @type Number
         * @readonly
         */
        longitude: null,

        /**
         * Read-only property representing the last retrieved
         * accuracy level of the latitude and longitude coordinates,
         * specified in meters.
         *
         * This will always be a non-negative number.
         *
         * This corresponds to a 95% confidence level.
         * @type Number
         * @readonly
         */
        accuracy: null,

        /**
         * Read-only property representing the last retrieved
         * height of the position, specified in meters above the ellipsoid
         * [WGS84](http://dev.w3.org/geo/api/spec-source.html#ref-wgs).
         * @type Number
         * @readonly
         */
        altitude: null,

        /**
         * Read-only property representing the last retrieved
         * accuracy level of the altitude coordinate, specified in meters.
         *
         * If altitude is not null then this will be a non-negative number.
         * Otherwise this returns `null`.
         *
         * This corresponds to a 95% confidence level.
         * @type Number
         * @readonly
         */
        altitudeAccuracy: null,

        /**
         * Read-only property representing the last retrieved
         * direction of travel of the hosting device,
         * specified in non-negative degrees between 0 and 359,
         * counting clockwise relative to the true north.
         *
         * If speed is 0 (device is stationary), then this returns `NaN`.
         * @type Number
         * @readonly
         */
        heading: null,

        /**
         * Read-only property representing the last retrieved
         * current ground speed of the device, specified in meters per second.
         *
         * If this feature is unsupported by the device, this returns `null`.
         *
         * If the device is stationary, this returns 0,
         * otherwise it returns a non-negative number.
         * @type Number
         * @readonly
         */
        speed: null,

        /**
         * Read-only property representing when the last retrieved
         * positioning information was acquired by the device.
         * @type Date
         * @readonly
         */
        timestamp: null,

        //PositionOptions interface
        /**
         * @cfg {Boolean} allowHighAccuracy
         * When set to `true`, provide a hint that the application would like to receive
         * the best possible results. This may result in slower response times or increased power consumption.
         * The user might also deny this capability, or the device might not be able to provide more accurate
         * results than if this option was set to `false`.
         */
        allowHighAccuracy: false,

        /**
         * @cfg {Number} timeout
         * The maximum number of milliseconds allowed to elapse between a location update operation
         * and the corresponding {@link #locationupdate} event being raised.  If a location was not successfully
         * acquired before the given timeout elapses (and no other internal errors have occurred in this interval),
         * then a {@link #locationerror} event will be raised indicating a timeout as the cause.
         *
         * Note that the time that is spent obtaining the user permission is **not** included in the period
         * covered by the timeout.  The `timeout` attribute only applies to the location acquisition operation.
         *
         * In the case of calling `updateLocation`, the {@link #locationerror} event will be raised only once.
         *
         * If {@link #autoUpdate} is set to `true`, the {@link #locationerror} event could be raised repeatedly.
         * The first timeout is relative to the moment {@link #autoUpdate} was set to `true`
         * (or this {@link Ext.util.Geolocation} was initialized with the {@link #autoUpdate} config option set to `true`).
         * Subsequent timeouts are relative to the moment when the device determines that it's position has changed.
         */

        timeout: Infinity,

        /**
         * @cfg {Number} maximumAge
         * This option indicates that the application is willing to accept cached location information whose age
         * is no greater than the specified time in milliseconds. If `maximumAge` is set to 0, an attempt to retrieve
         * new location information is made immediately.
         *
         * Setting the `maximumAge` to Infinity returns a cached position regardless of its age.
         *
         * If the device does not have cached location information available whose age is no
         * greater than the specified `maximumAge`, then it must acquire new location information.
         *
         * For example, if location information no older than 10 minutes is required, set this property to 600000.
         */
        maximumAge: 0,

        // @private
        provider : undefined
    },

    updateMaximumAge: function() {
        if (this.watchOperation) {
            this.updateWatchOperation();
        }
    },

    updateTimeout: function() {
        if (this.watchOperation) {
            this.updateWatchOperation();
        }
    },

    updateAllowHighAccuracy: function() {
        if (this.watchOperation) {
            this.updateWatchOperation();
        }
    },

    applyProvider: function(config) {
        if (Ext.feature.has.Geolocation) {
            if (!config) {
                if (navigator && navigator.geolocation) {
                    config = navigator.geolocation;
                }
                else if (window.google) {
                    config = google.gears.factory.create('beta.geolocation');
                }
            }
        }
        else {
            this.fireEvent('locationerror', this, false, false, true, 'This device does not support Geolocation.');
        }
        return config;
    },

    updateAutoUpdate: function(newAutoUpdate, oldAutoUpdate) {
        var me = this,
            provider = me.getProvider();

        if (oldAutoUpdate && provider) {
            clearInterval(me.watchOperationId);
            me.watchOperationId = null;
        }

        if (newAutoUpdate) {
            if (!provider) {
                me.fireEvent('locationerror', me, false, false, true, null);
                return;
            }

            try {
                me.updateWatchOperation();
            }
            catch(e) {
                me.fireEvent('locationerror', me, false, false, true, e.message);
            }
        }
    },

    // @private
    updateWatchOperation: function() {
        var me = this,
            provider = me.getProvider();

        // The native watchPosition method is currently broken in iOS5...

        if (me.watchOperationId) {
            clearInterval(me.watchOperationId);
        }

        function pollPosition() {
            provider.getCurrentPosition(
                Ext.bind(me.fireUpdate, me),
                Ext.bind(me.fireError, me),
                me.parseOptions()
            );
        }

        pollPosition();
        me.watchOperationId = setInterval(pollPosition, this.getFrequency());
    },

    /**
     * Executes a onetime location update operation,
     * raising either a {@link #locationupdate} or {@link #locationerror} event.
     *
     * Does not interfere with or restart ongoing location monitoring.
     * @param {Function} callback
     * A callback method to be called when the location retrieval has been completed.
     *
     * Will be called on both success and failure.
     *
     * The method will be passed one parameter, {@link Ext.util.Geolocation} (**this** reference),
     * set to `null` on failure.
     *
     *     geo.updateLocation(function (geo) {
     *         alert('Latitude: ' + (geo !== null ? geo.latitude : 'failed'));
     *     });
     *
     * @param {Object} scope (optional) The scope (**this** reference) in which the handler function is executed.
     *
     * **If omitted, defaults to the object which fired the event.**
     * <!--positonOptions undocumented param, see W3C spec-->
     */
    updateLocation: function(callback, scope, positionOptions) {
        var me = this,
            provider = me.getProvider();

        var failFunction = function(message, error) {
            if (error) {
                me.fireError(error);
            }
            else {
                me.fireEvent('locationerror', me, false, false, true, message);
            }
            if (callback) {
                callback.call(scope || me, null, me); //last parameter for legacy purposes
            }
        };

        if (!provider) {
            failFunction(null);
            return;
        }

        try {
            provider.getCurrentPosition(
                //success callback
                function(position) {
                    me.fireUpdate(position);
                    if (callback) {
                        callback.call(scope || me, me, me); //last parameter for legacy purposes
                    }
                },
                //error callback
                function(error) {
                    failFunction(null, error);
                },
                positionOptions || me.parseOptions()
            );
        }
        catch(e) {
            failFunction(e.message);
        }
    },

    // @private
    fireUpdate: function(position) {
        var me = this,
            coords = position.coords;

        this.position = position;

        me.setConfig({
            timestamp: position.timestamp,
            latitude: coords.latitude,
            longitude: coords.longitude,
            accuracy: coords.accuracy,
            altitude: coords.altitude,
            altitudeAccuracy: coords.altitudeAccuracy,
            heading: coords.heading,
            speed: coords.speed
        });

        me.fireEvent('locationupdate', me);
    },

    // @private
    fireError: function(error) {
        var errorCode = error.code;
        this.fireEvent('locationerror', this,
            errorCode == error.TIMEOUT,
            errorCode == error.PERMISSION_DENIED,
            errorCode == error.POSITION_UNAVAILABLE,
            error.message == undefined ? null : error.message
        );
    },

    // @private
    parseOptions: function() {
        var timeout = this.getTimeout(),
            ret = {
                maximumAge: this.getMaximumAge(),
                enableHighAccuracy: this.getAllowHighAccuracy()
            };

        //Google doesn't like Infinity
        if (timeout !== Infinity) {
            ret.timeout = timeout;
        }
        return ret;
    },

    destroy : function() {
        this.setAutoUpdate(false);
    }
});
