/**
 * Wraps a Google Map in an Ext.Component using the [Google Maps API](http://code.google.com/apis/maps/documentation/v3/introduction.html).
 *
 * To use this component you must include an additional JavaScript file from Google:
 *
 *     <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script>
 *
 * ## Example
 *
 *     Ext.Viewport.add({
 *         xtype: 'map',
 *         useCurrentLocation: true
 *     });
 *
 * @aside example maps
 */
Ext.define('Ext.Map', {
    extend: 'Ext.Container',
    xtype : 'map',
    requires: ['Ext.util.Geolocation'],

    isMap: true,

    config: {
        /**
         * @event maprender
         * Fired when Map initially rendered.
         * @param {Ext.Map} this
         * @param {google.maps.Map} map The rendered google.map.Map instance
         */

        /**
         * @event centerchange
         * Fired when map is panned around.
         * @param {Ext.Map} this
         * @param {google.maps.Map} map The rendered google.map.Map instance
         * @param {google.maps.LatLng} center The current LatLng center of the map
         */

        /**
         * @event typechange
         * Fired when display type of the map changes.
         * @param {Ext.Map} this
         * @param {google.maps.Map} map The rendered google.map.Map instance
         * @param {Number} mapType The current display type of the map
         */

        /**
         * @event zoomchange
         * Fired when map is zoomed.
         * @param {Ext.Map} this
         * @param {google.maps.Map} map The rendered google.map.Map instance
         * @param {Number} zoomLevel The current zoom level of the map
         */

        /**
         * @cfg {String} baseCls
         * The base CSS class to apply to the Map's element
         * @accessor
         */
        baseCls: Ext.baseCSSPrefix + 'map',

        /**
         * @cfg {Boolean/Ext.util.Geolocation} useCurrentLocation
         * Pass in true to center the map based on the geolocation coordinates or pass a
         * {@link Ext.util.Geolocation GeoLocation} config to have more control over your GeoLocation options
         * @accessor
         */
        useCurrentLocation: false,

        /**
         * @cfg {google.maps.Map} map
         * The wrapped map.
         * @accessor
         */
        map: null,

        /**
         * @cfg {Ext.util.Geolocation} geo
         * Geolocation provider for the map.
         * @accessor
         */
        geo: null,

        /**
         * @cfg {Object} mapOptions
         * MapOptions as specified by the Google Documentation:
         * [http://code.google.com/apis/maps/documentation/v3/reference.html](http://code.google.com/apis/maps/documentation/v3/reference.html)
         * @accessor
         */
        mapOptions: {}
    },

    constructor: function() {
        this.callParent(arguments);
        // this.element.setVisibilityMode(Ext.Element.OFFSETS);

        if (!(window.google || {}).maps) {
            this.setHtml('Google Maps API is required');
        }
    },

    initialize: function() {
        this.callParent();
        this.on({
            painted: 'doResize',
            scope: this
        });
        this.innerElement.on('touchstart', 'onTouchStart', this);
    },

    getElementConfig: function() {
        return {
            reference: 'element',
            className: 'x-container',
            children: [{
                reference: 'innerElement',
                className: 'x-inner',
                children: [{
                    reference: 'mapContainer',
                    className: Ext.baseCSSPrefix + 'map-container'
                }]
            }]
        };
    },

    onTouchStart: function(e) {
        e.makeUnpreventable();
    },

    applyMapOptions: function(options) {
        return Ext.merge({}, this.options, options);
    },

    updateMapOptions: function(newOptions) {
        var me = this,
            gm = (window.google || {}).maps,
            map = this.getMap();

        if (gm && map) {
            map.setOptions(newOptions);
        }
        if (newOptions.center && !me.isPainted()) {
            me.un('painted', 'setMapCenter', this);
            me.on('painted', 'setMapCenter', this, { delay: 150, single: true, args: [newOptions.center] });
        }
    },

    getMapOptions: function() {
        return Ext.merge({}, this.options || this.getInitialConfig('mapOptions'));
    },

    updateUseCurrentLocation: function(useCurrentLocation) {
        this.setGeo(useCurrentLocation);
        if (!useCurrentLocation) {
            this.renderMap();
        }
    },

    applyGeo: function(config) {
        return Ext.factory(config, Ext.util.Geolocation, this.getGeo());
    },

    updateGeo: function(newGeo, oldGeo) {
        var events = {
            locationupdate : 'onGeoUpdate',
            locationerror : 'onGeoError',
            scope : this
        };

        if (oldGeo) {
            oldGeo.un(events);
        }

        if (newGeo) {
            newGeo.on(events);
            newGeo.updateLocation();
        }
    },

    doResize: function() {
        var gm = (window.google || {}).maps,
            map = this.getMap();

        if (gm && map) {
            gm.event.trigger(map, "resize");
        }
    },

    // @private
    renderMap: function() {
        var me = this,
            gm = (window.google || {}).maps,
            element = me.mapContainer,
            mapOptions = me.getMapOptions(),
            map = me.getMap(),
            event;

        if (gm) {
            if (Ext.os.is.iPad) {
                Ext.merge({
                    navigationControlOptions: {
                        style: gm.NavigationControlStyle.ZOOM_PAN
                    }
                }, mapOptions);
            }

            mapOptions = Ext.merge({
                zoom: 12,
                mapTypeId: gm.MapTypeId.ROADMAP
            }, mapOptions);

            // This is done separately from the above merge so we don't have to instantiate
            // a new LatLng if we don't need to
            if (!mapOptions.hasOwnProperty('center')) {
                mapOptions.center = new gm.LatLng(37.381592, -122.135672); // Palo Alto
            }

            if (element.dom.firstChild) {
                Ext.fly(element.dom.firstChild).destroy();
            }

            if (map) {
                gm.event.clearInstanceListeners(map);
            }

            me.setMap(new gm.Map(element.dom, mapOptions));
            map = me.getMap();

            //Track zoomLevel and mapType changes
            event = gm.event;
            event.addListener(map, 'zoom_changed', Ext.bind(me.onZoomChange, me));
            event.addListener(map, 'maptypeid_changed', Ext.bind(me.onTypeChange, me));
            event.addListener(map, 'center_changed', Ext.bind(me.onCenterChange, me));

            me.fireEvent('maprender', me, map);
        }
    },

    // @private
    onGeoUpdate: function(geo) {
        if (geo) {
            this.setMapCenter(new google.maps.LatLng(geo.getLatitude(), geo.getLongitude()));
        }
    },

    // @private
    onGeoError: Ext.emptyFn,

    /**
     * Moves the map center to the designated coordinates hash of the form:
     *
     *     { latitude: 37.381592, longitude: -122.135672 }
     *
     * or a google.maps.LatLng object representing to the target location.
     *
     * @param {Object/google.maps.LatLng} coordinates Object representing the desired Latitude and
     * longitude upon which to center the map.
     */
    setMapCenter: function(coordinates) {
        var me = this,
            map = me.getMap(),
            gm = (window.google || {}).maps;

        if (gm) {
            if (!me.isPainted()) {
                me.un('painted', 'setMapCenter', this);
                me.on('painted', 'setMapCenter', this, { delay: 150, single: true, args: [coordinates] });
                return;
            }
            coordinates = coordinates || new gm.LatLng(37.381592, -122.135672);

            if (coordinates && !(coordinates instanceof gm.LatLng) && 'longitude' in coordinates) {
                coordinates = new gm.LatLng(coordinates.latitude, coordinates.longitude);
            }

            if (!map) {
                me.renderMap();
                map = me.getMap();
            }

            if (map && coordinates instanceof gm.LatLng) {
                map.panTo(coordinates);
            }
            else {
                this.options = Ext.apply(this.getMapOptions(), {
                    center: coordinates
                });
            }
        }
    },

    // @private
    onZoomChange : function() {
        var mapOptions = this.getMapOptions(),
            map = this.getMap(),
            zoom;

        zoom = (map && map.getZoom) ? map.getZoom() : mapOptions.zoom || 10;

        this.options = Ext.apply(mapOptions, {
            zoom: zoom
        });

        this.fireEvent('zoomchange', this, map, zoom);
    },

    // @private
    onTypeChange : function() {
        var mapOptions = this.getMapOptions(),
            map = this.getMap(),
            mapTypeId;

        mapTypeId = (map && map.getMapTypeId) ? map.getMapTypeId() : mapOptions.mapTypeId;

        this.options = Ext.apply(mapOptions, {
            mapTypeId: mapTypeId
        });

        this.fireEvent('typechange', this, map, mapTypeId);
    },

    // @private
    onCenterChange: function() {
        var mapOptions = this.getMapOptions(),
            map = this.getMap(),
            center;

        center = (map && map.getCenter) ? map.getCenter() : mapOptions.center;

        this.options = Ext.apply(mapOptions, {
            center: center
        });

        this.fireEvent('centerchange', this, map, center);

    },

    // @private
    destroy: function() {
        Ext.destroy(this.getGeo());
        var map = this.getMap();

        if (map && (window.google || {}).maps) {
            google.maps.event.clearInstanceListeners(map);
        }

        this.callParent();
    }
}, function() {
    //<deprecated product=touch since=2.0>

    /**
     * @cfg {Boolean} maskMap
     * Masks the map
     * @removed 2.0.0 Please mask this components container instead.
     */

    /**
     * @cfg {String} maskMapCls
     * CSS class to add to the map when maskMap is set to true.
     * @removed 2.0.0 Please mask this components container instead.
     */

    /**
     * @method getState
     * Returns the state of the Map.
     * @deprecated 2.0.0 Please use {@link #getMapOptions} instead.
     * @return {Object} mapOptions
     */
    Ext.deprecateClassMethod(this, 'getState', 'getMapOptions');

    /**
     * @method update
     * Moves the map center to the designated coordinates hash of the form:
     *
     *     { latitude: 37.381592, longitude: -122.135672 }
     *
     * or a google.maps.LatLng object representing to the target location.
     *
     * @deprecated 2.0.0 Please use the {@link #setMapCenter}
     * @param {Object/google.maps.LatLng} coordinates Object representing the desired Latitude and
     * longitude upon which to center the map.
     */
    Ext.deprecateClassMethod(this, 'update', 'setMapCenter');

    //</deprecated>
});
