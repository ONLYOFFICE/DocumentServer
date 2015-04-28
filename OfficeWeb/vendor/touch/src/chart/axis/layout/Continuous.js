/**
 * @class Ext.chart.axis.layout.Continuous
 * @extends Ext.chart.axis.layout.Layout
 * 
 * Processor for axis data that can be interpolated.
 */
Ext.define("Ext.chart.axis.layout.Continuous", {
    extend: 'Ext.chart.axis.layout.Layout',
    alias: 'axisLayout.continuous',
    config: {
        adjustMinimumByMajorUnit: false,
        adjustMaximumByMajorUnit: false
    },
    
    getCoordFor: function (value, field, idx, items) {
        return +value;
    },

    //@inheritdoc
    snapEnds: function (context, min, max, estStepSize) {
        var segmenter = context.segmenter,
            out = context.segmenter.preferredStep(min, estStepSize),
            unit = out.unit,
            step = out.step,
            from = segmenter.align(min, step, unit),
            steps = segmenter.diff(min, max, unit) + 1;
        return {
            min: segmenter.from(min),
            max: segmenter.from(max),
            from: from,
            to: segmenter.add(from, steps * step, unit),
            step: step,
            steps: steps,
            unit: unit,
            get: function (current) {
                return segmenter.add(this.from, this.step * current, unit);
            }
        };
    }
});