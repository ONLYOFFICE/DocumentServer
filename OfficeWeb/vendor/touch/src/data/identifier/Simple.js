/**
 * @author Tommy Maintz
 *
 * This class is the simple default id generator for Model instances.
 *
 * An example of a configured simple generator would be:
 *
 *     Ext.define('MyApp.data.MyModel', {
 *         extend: 'Ext.data.Model',
 *         config: {
 *             identifier: {
 *                 type: 'simple',
 *                 prefix: 'ID_'
 *             }
 *         }
 *     });
 *     // assign id's of ID_1, ID_2, ID_3, etc.
 *
 */
Ext.define('Ext.data.identifier.Simple', {
    alias: 'data.identifier.simple',
    
    statics: {
        AUTO_ID: 1
    },

    config: {
        prefix: 'ext-record-'
    },

    constructor: function(config) {
        this.initConfig(config);
    },

    generate: function(record) {
        return this._prefix + this.self.AUTO_ID++;
    }
});