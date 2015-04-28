Ext.define("Ext.chart.series.sprite.AbstractRadial", {
    extend: 'Ext.draw.sprite.Sprite',
    inheritableStatics: {
        def: {
            processors: {
                rotation: 'number',
                x: 'number',
                y: 'number'
            },
            defaults: {
                rotation: 0,
                x: 0,
                y: 0
            }
        }
    }
});