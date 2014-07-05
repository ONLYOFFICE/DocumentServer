/**
 * @class Ext.chart.axis.layout.Discrete
 * @extends Ext.chart.axis.layout.Layout
 * 
 * Simple processor for data that cannot be interpolated.
 */
Ext.define("Ext.chart.axis.layout.Discrete", {
    extend: 'Ext.chart.axis.layout.Layout',
    alias: 'axisLayout.discrete',

    processData: function () {
        var me = this,
            axis = me.getAxis(),
            boundSeries = axis.boundSeries,
            direction = axis.getDirection(),
            i, ln, item;
        this.labels = [];
        this.labelMap = {};
        for (i = 0, ln = boundSeries.length; i < ln; i++) {
            item = boundSeries[i];
            if (item['get' + direction + 'Axis']() === axis) {
                item['coordinate' + direction]();
            }
        }
    },

    // @inheritdoc
    calculateLayout: function (context) {
        context.data = this.labels;
        this.callSuper([context]);
    },

    //@inheritdoc
    calculateMajorTicks: function (context) {
        var me = this,
            attr = context.attr,
            data = context.data,
            range = attr.max - attr.min,
            zoom = range / attr.length * (attr.visibleMax - attr.visibleMin),
            viewMin = attr.min + range * attr.visibleMin,
            viewMax = attr.min + range * attr.visibleMax,
            estStepSize = attr.estStepSize * zoom;
        
        var out = me.snapEnds(context, Math.max(0, attr.min), Math.min(attr.max, data.length - 1), estStepSize);
        if (out) {
            me.trimByRange(context, out, viewMin - zoom * (1 + attr.startGap), viewMax + zoom * (1 + attr.endGap));
            context.majorTicks = out;
        }
    },

    // @inheritdoc
    snapEnds: function (context, min, max, estStepSize) {
        estStepSize = Math.ceil(estStepSize);
        var steps = Math.floor((max - min) / estStepSize),
            data = context.data;
        return {
            min: min,
            max: max,
            from: min,
            to: steps * estStepSize + min,
            step: estStepSize,
            steps: steps,
            unit: 1,
            getLabel: function (current) {
                return data[this.from + this.step * current];
            },
            get: function (current) {
                return this.from + this.step * current;
            }
        };
    },

    // @inheritdoc
    trimByRange: function (context, out, trimMin, trimMax) {
        var unit = out.unit,
            beginIdx = Math.ceil((trimMin - out.from) / unit) * unit,
            endIdx = Math.floor((trimMax - out.from) / unit) * unit,
            begin = Math.max(0, Math.ceil(beginIdx / out.step)),
            end = Math.min(out.steps, Math.floor(endIdx / out.step));

        if (end < out.steps) {
            out.to = end;
        }

        if (out.max > trimMax) {
            out.max = out.to;
        }

        if (out.from < trimMin) {
            out.from = out.from + begin * out.step * unit;
            while (out.from < trimMin) {
                begin++;
                out.from += out.step * unit;
            }
        }

        if (out.min < trimMin) {
            out.min = out.from;
        }

        out.steps = end - begin;
    },

    getCoordFor: function (value, field, idx, items) {
        this.labels.push(value);
        return this.labels.length - 1;
    }
});