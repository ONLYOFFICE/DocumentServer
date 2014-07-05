
Ext.data.SyncStore = Ext.extend(Object, {
	
	constructor: function(config) {
		Ext.data.utilities.check('SyncStore', 'constructor', 'config', config, ['database_name','localStorageProxy']);
		this.local= config.localStorageProxy;
		this.readConfig('index',function(data) {
			this.index= data||{};
		},this);
  },

  create: function(records, callback, scope) {
		//console.log('SyncStore - create -',records[0].getId(),Ext.encode(records[0].data))
		var operation= new Ext.data.Operation({records:records});
		this.local.create(operation,callback,scope);
  },

  read: function(oid, callback, scope) {
		//console.log('SyncStore - read -',oid)
		var operation= new Ext.data.Operation({action:'read',id:oid});
		this.local.read(operation,function(operation2) {
			var record;
			if (operation2.resultSet.count==1) {
				record= operation2.resultSet.records[0];
				Ext.apply(record,Ext.data.SyncModel);
				//console.log('SyncStore - read -',oid,'=>',Ext.encode(record.data));
			} else {
				//console.log('SyncStore - read -',oid,'=> not_found')
			}
			callback.call(scope,record);
		},this);
  },

  update: function(records, callback, scope) {
		//console.log('SyncStore - update',Ext.encode(records))
		var operation= new Ext.data.Operation({action:'update',records:records});
		this.local.update(operation,callback,scope);
  },

  destroy: function(oid, callback, scope) {
		//console.log('SyncStore - destroy -',oid)
		var data= {};
		data[Ext.data.SyncModel.OID]= oid;
		var records= [new this.local.model(data)];
		var operation= new Ext.data.Operation({action:'destroy',records:records});
		this.local.destroy(operation,callback,scope);
  },

	clear: function(callback, scope) {
		this.local.clear();
		callback.call(scope);
	},

  setModel: function(model, setOnStore) {
		//console.log('SyncStore - setModel',model)
		this.model= model;
		this.local.setModel(model, setOnStore);
  },

	readConfig: function(oid, callback, scope) {
		var item= this.local.getStorageObject().getItem(this.local.id+"-"+oid);
		var data= item ? Ext.decode(item) : {};
		callback.call(scope,data);
	},
	
	writeConfig: function(oid, data, callback, scope) {
		this.local.getStorageObject().setItem(this.local.id+"-"+oid,Ext.encode(data));
		callback.call(scope,data);
	},

	indexUpdate: function(id, oid, callback, scope) {
		if (!callback) { throw "ERROR - SyncStore - indexUpdate - no callback provided"; }
		console.log('SyncStore - indexUpdate -',id,'=>',oid);
		this.index[id]= oid;
		this.writeConfig('index',this.index,callback,scope);
	},

	indexLookup: function(id, callback, scope) {
		if (!callback) { throw "ERROR - SyncStore - indexLookup - no callback provided"; }
		var oid= this.index[id];
		console.log('SyncStore - indexLookup -',id,'=>',oid);
		callback.call(scope,oid);
	},
	
	readValue: function(key, callback, scope) {
		var value= this.local.getStorageObject().getItem(key);
		callback.call(scope,value);
	},
	
	writeValue: function(key, value, callback, scope) {
		this.local.getStorageObject().setItem(key,value);
		callback.call(scope);
	},
	
	forEachRecordAsync: function(each_callback, each_scope, done_callback, done_scope) { // JCM this is expensive... nothing should really call this.....
		//console.log('SyncStore - forEachRecordAsync')
		if (!each_callback) { throw "ERROR - SyncStore - forEachRecordAsync - no 'each' callback provided"; }
		if (!done_callback) { throw "ERROR - SyncStore - forEachRecordAsync - no 'done' callback provided"; }
		var operation= new Ext.data.Operation({action:'read'});
		var ids= this.local.getIds();
		Ext.data.array.forEachAsync(ids,function(id,next_callback,next_scope){
			operation.id= id;
			this.local.read(operation,function(operation){
				if (operation.resultSet.count==1) {
					var record= operation.resultSet.records[0];
					//console.log('SyncStore - forEachRecordAsync - record',Ext.encode(record))
					each_callback.call(each_scope,record,next_callback,next_scope);
				} else {
					throw "ERROR - SyncStore - forEachRecordAsync - no record for id "+id;
					next_callback.call(next_scope);
				}
			},this);
		},this,done_callback,done_scope);
	}
});

