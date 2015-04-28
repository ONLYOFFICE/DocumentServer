Ext.define('Ext.ux.auth.Session', {
    
    constructor: function(credentials) {
        credentials = {
            username: 'ed',
            password: 'secret'
        }
    },
    
    validate: function(options) {
        options = {
            success: function(session) {
                
            },
            failure: function(session) {
                
            },
            callback: function(session) {
                
            },
            scope: me
        }
    },
    
    destroy: function() {
        
    }
});