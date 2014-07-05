/**
 * @private
 */
Ext.define('Ext.device.camera.PhoneGap', {

    extend: 'Ext.device.camera.Abstract',

    capture: function(args) {
        var onSuccess = args.success,
            onError = args.failure,
            scope = args.scope,
            sources = this.source,
            destinations = this.destination,
            encodings = this.encoding,
            source = args.source,
            destination = args.destination,
            encoding = args.encoding,
            options = {};

        if (scope) {
            onSuccess = Ext.Function.bind(onSuccess, scope);
            onError = Ext.Function.bind(onError, scope);
        }

        if (source !== undefined) {
            options.sourceType = sources.hasOwnProperty(source) ? sources[source] : source;
        }

        if (destination !== undefined) {
            options.destinationType = destinations.hasOwnProperty(destination) ? destinations[destination] : destination;
        }

        if (encoding !== undefined) {
            options.encodingType = encodings.hasOwnProperty(encoding) ? encodings[encoding] : encoding;
        }

        if ('quality' in args) {
            options.quality = args.quality;
        }

        if ('width' in args) {
            options.targetWidth = args.width;
        }

        if ('height' in args) {
            options.targetHeight = args.height;
        }

        try {
            navigator.camera.getPicture(onSuccess, onError, options);
        }
        catch (e) {
            alert(e);
        }
    }
});
