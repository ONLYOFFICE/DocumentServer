/**
 * @private
 */
Ext.define('Ext.device.camera.Sencha', {

    extend: 'Ext.device.camera.Abstract',

    requires: [
        'Ext.device.Communicator'
    ],

    capture: function(options) {
        var sources = this.source,
            destinations = this.destination,
            encodings = this.encoding,
            source = options.source,
            destination = options.destination,
            encoding = options.encoding;

        if (sources.hasOwnProperty(source)) {
            source = sources[source];
        }

        if (destinations.hasOwnProperty(destination)) {
            destination = destinations[destination];
        }

        if (encodings.hasOwnProperty(encoding)) {
            encoding = encodings[encoding];
        }

        Ext.device.Communicator.send({
            command: 'Camera#capture',
            callbacks: {
                success: options.success,
                failure: options.failure
            },
            scope: options.scope,
            quality: options.quality,
            width: options.width,
            height: options.height,
            source: source,
            destination: destination,
            encoding: encoding
        });
    }
});
