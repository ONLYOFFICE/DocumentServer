/**
 * @private
 */
Ext.define('Ext.device.camera.Simulator', {
    extend: 'Ext.device.camera.Abstract',

    config: {
        samples: [
            {
                success: 'http://www.sencha.com/img/sencha-large.png'
            }
        ]
    },

    constructor: function(config) {
        this.initConfig(config);
    },

    updateSamples: function(samples) {
        this.sampleIndex = 0;
    },

    capture: function(options) {
        var index = this.sampleIndex,
            samples = this.getSamples(),
            samplesCount = samples.length,
            sample = samples[index],
            scope = options.scope,
            success = options.success,
            failure = options.failure;

        if ('success' in sample) {
            if (success) {
                success.call(scope, sample.success);
            }
        }
        else {
            if (failure) {
                failure.call(scope, sample.failure);
            }
        }

        if (++index > samplesCount - 1) {
            index = 0;
        }

        this.sampleIndex = index;
    }
});
