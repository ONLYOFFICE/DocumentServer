/**
 * @class Ext.chart.grid.CircularGrid
 * @extends Ext.draw.sprite.Circle
 * 
 * Circular Grid sprite.
 */
Ext.define("Ext.chart.grid.CircularGrid", {
    extend: 'Ext.draw.sprite.Circle',
    alias: 'grid.circular',
    
    inheritableStatics: {
        def: {
            defaults: {
                r: 1,
                strokeStyle: '#DDD'
            }
        }
    }
});