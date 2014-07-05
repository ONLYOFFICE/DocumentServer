/**
 * @class Ext.chart.axis.segmenter.Numeric
 * @extends Ext.chart.axis.segmenter.Segmenter
 * 
 * Numeric data type.
 */
Ext.define("Ext.chart.axis.segmenter.Numeric", {
    extend: 'Ext.chart.axis.segmenter.Segmenter',
    alias: 'segmenter.numeric',

    renderer: function (value, context) {
        return value.toFixed(Math.max(0, context.majorTicks.unit.fixes));
    },

    diff: function (min, max, unit) {
        return Math.floor((max - min) / unit.scale);
    },

    align: function (value, step, unit) {
        return Math.floor(value / (unit.scale * step)) * unit.scale * step;
    },


    add: function (value, step, unit) {
        return value + step * (unit.scale);
    },

    preferredStep: function (min, estStepSize) {
        var logs = Math.floor(Math.log(estStepSize) * Math.LOG10E),
            scale = Math.pow(10, logs);
        estStepSize /= scale;
        if (estStepSize < 2) {
            estStepSize = 2;
        } else if (estStepSize < 5) {
            estStepSize = 5;
        } else if (estStepSize < 10) {
            estStepSize = 10;
            logs++;
        }
        return {
            unit: { fixes: -logs, scale: scale },
            step: estStepSize
        };
    }
});