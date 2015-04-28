//@tag foundation,core
//@define Ext.Date
//@require Ext.Error

/**
 *
 */
Ext.Date = {
    /** @ignore */
    now: Date.now,

    /**
     * @private
     * Private for now
     */
    toString: function(date) {
        if (!date) {
            date = new Date();
        }

        var pad = Ext.String.leftPad;

        return date.getFullYear() + "-"
            + pad(date.getMonth() + 1, 2, '0') + "-"
            + pad(date.getDate(), 2, '0') + "T"
            + pad(date.getHours(), 2, '0') + ":"
            + pad(date.getMinutes(), 2, '0') + ":"
            + pad(date.getSeconds(), 2, '0');
    }
};

//<deprecated product=touch since="2.0">
Ext.merge(Ext, {
	util: {
		Date: Ext.Date
	}
});
//</deprecated>
