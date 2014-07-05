
Ext.data.Config = Ext.extend(Object, {

	config_id: undefined,
	write_fn: undefined,
	_id: undefined,
	
	constructor: function(config) {
		this.config_id= config.config_id;
		this.write_fn= config.write_fn;
		this._id= config._id;
	},
	
	set: function(data) {
		this._id= data._id;
	},
	
	to_s: function(indent) {
		return this.config_id+": "+Ext.encode(this);
	},

	as_data: function(data) {
		data.id= this.config_id;
		data._id= this._id;
		data[Ext.data.SyncModel.OID]= data[Ext.data.SyncModel.OID] || this.config_id;
		return data;
	},
	
	writeAndCallback: function(changed,callback,scope) {
		if (changed) {
			this.write(function(){
				if (callback) {
					callback.call(scope,this);
				}
			},this);
		} else {
			if (callback) {
				callback.call(scope,this);
			}
		}
	},
	
	write: function(callback,scope) {
		if (this.write_fn) {
			this.write_fn(this,function(){
				if (callback) {
					callback.call(scope,this);
				}
			},this);
		} else {
			if (callback) {
				callback.call(scope,this);
			}
		}
	}
});

