/**
 * @author Ed Spencer
 * @class Ext.data.Errors
 * @extends Ext.util.Collection
 *
 * Wraps a collection of validation error responses and provides convenient functions for
 * accessing and errors for specific fields.
 *
 * Usually this class does not need to be instantiated directly - instances are instead created
 * automatically when {@link Ext.data.Model#validate validate} on a model instance:
 *
 *     //validate some existing model instance - in this case it returned two failures messages
 *     var errors = myModel.validate();
 *
 *     errors.isValid(); // false
 *
 *     errors.length; // 2
 *     errors.getByField('name');  // [{field: 'name',  message: 'must be present'}]
 *     errors.getByField('title'); // [{field: 'title', message: 'is too short'}]
 */
Ext.define('Ext.data.Errors', {
    extend: 'Ext.util.Collection',

    requires: 'Ext.data.Error',

    /**
     * Returns `true` if there are no errors in the collection.
     * @return {Boolean}
     */
    isValid: function() {
        return this.length === 0;
    },

    /**
     * Returns all of the errors for the given field.
     * @param {String} fieldName The field to get errors for.
     * @return {Object[]} All errors for the given field.
     */
    getByField: function(fieldName) {
        var errors = [],
            error, i;

        for (i = 0; i < this.length; i++) {
            error = this.items[i];

            if (error.getField() == fieldName) {
                errors.push(error);
            }
        }

        return errors;
    },
    
    add: function() {
        var obj = arguments.length == 1 ? arguments[0] : arguments[1];
        
        if (!(obj instanceof Ext.data.Error)) {
            obj = Ext.create('Ext.data.Error', {
                field: obj.field || obj.name,
                message: obj.error || obj.message
            });
        }
        
        return this.callParent([obj]);
    }
});
