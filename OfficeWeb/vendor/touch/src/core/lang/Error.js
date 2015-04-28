//@tag foundation,core
//@define Ext.Error
//@require Ext.JSON

Ext.Error = {
    raise: function(object) {
        throw new Error(object.msg);
    }
};
