
Ext.data.Protocol = Ext.extend(Object, {

	constructor: function(config) {
			this.remote = config.remoteStorageProxy;
			this.remote.on('exception',function(proxy,request,operation){
				console.log('EXCEPTION'); // JCM should handle this properly...
				console.log(request);
				console.log(operation);
			});
  },

	sync: function(local, callback, scope) {
		//
		// JCM callback if something is going to take a long time...
		// JCM like changing the replica number
		// JCM or clearing after a generation change
		//
		if (callback===undefined) { callback= function(){}; } // JCM maybe should warn the caller...
	  this.send_create_database(local.definition,function(operation) {
			var response= operation.response;
			switch (response.r) {
			case 'ok':
				//
				// The remote CSV describes the state of updated-ness of the
				// server this client is talking to. We add any replica numbers
				// that are new to us to our local CSV.
				//
			  var remote_csv= response.csv;
			  local.addReplicaNumbers(remote_csv);
				this.sync_datastore(local,remote_csv,callback,scope);
				break;
			case 'new_replica_number':
				//
				// A replica number collision, or re-initialization, has occured. 
				// In either case we must change our local replica number.
				//
		    local.setReplicaNumber(response.replica_number,function(){
					this.sync(local,callback,scope); // JCM beware of infinite loop
				},this);
				break;
			case 'new_generation_number':
				//
				// The database generation has changed. We clear out the database,
				// and update the definition. 
				//
				if (response.generation>local.definition.generation) {
					local.definition.set({generation:response.generation},function(){
						local.clear(function(){
							this.sync(local,callback,scope); // JCM beware of infinite loop
						},this);
					},this);
				} else {
					// local is the same, or greater than the server.
				}
				break;
			default:
				callback.call(scope);
				break;
			}
		},this);
	},
	
	// @private
	sync_datastore: function(local, remote_csv, callback, scope) {
		//
		// JCM In theory... we could send and receive at the same time...
		//
	  local.getUpdates(remote_csv,function(updates){
		  this.put_database_updates(local.definition,updates,function(operation){
		  	if (remote_csv.dominates(local.csv)) {
			  	this.get_database_updates(local,callback,scope);
				} else {
					callback.call(scope);
				}
			},this);
		},this);
	},

	send_create_database: function(definition,callback,scope) {
	  var request= definition.encode();
	  this.sendRequest(definition.database_name,'edit',request,function(operation){
			var response= operation.response;
			if (response.csv) {
				response.csv= new Ext.data.CSV().decode(response.csv);
			}
			callback.call(scope, operation);
		},this);
	},

	put_database_updates: function(definition,updates,callback,scope) {
		//
		// When sending updates through the ScriptTagProxy the data is
		// encoded as a URL, so there is a browser imposed limit on the
		// length of that URL. So, let's be prudent and limit the amount
		// of data sent at a time.  
		//
		var chunks= updates.chunks(1000); // JCM count of updates... should be K?
		Ext.data.array.forEachYielding(chunks,function(chunk,next_callback,next_scope){
			this.send_put_database_updates(definition,chunk,function(operation){
				//if (operation.response.r=='ok') {
				//   keep going
				//} else {
				//   JCM abort... but how?
				//}
				next_callback.call(next_scope);
			},this);
		},this,callback,scope);
	},

	send_put_database_updates: function(definition,updates,callback,scope) {
	  if (!updates.isEmpty()) {
	    var request= {
	      updates: Ext.encode(updates.encode())
	    };
	    this.sendRequest(definition.database_name,'put_updates',request,callback,scope);
	  } else {
			var operation= this.encodeRequest({});
			operation.response= {r:"ok"};
			callback.call(scope, operation);
	  }
	},

	get_database_updates: function(local,callback,scope) {
		this.send_get_database_updates(local.definition,local.csv,function(operation){
			//
			// JCM perhaps an 'event' should be fired for each object changed
			// JCM which serves as a trigger for the UI to update
			//
			var response= operation.response;
			if (response.r=='ok') {
			  local.putUpdates(response.updates,function() {
					if (response.remaining>0 && !response.updates.isEmpty()) {
						this.get_database_updates(local,callback,scope);
					} else {
						callback.call(scope);
					}
				},this);
			} else {
				callback.call(scope);
			}
		},this);
	},

	send_get_database_updates: function(definition,csv,callback,scope) {
	  var request= {
	    csv: csv.encode()
	  };
	  this.sendRequest(definition.database_name,'get_updates',request,function(operation){
			var response= operation.response;
			response.updates= new Ext.data.Updates().decode(response.updates);
			callback.call(scope, operation);
		},this);
	},

  sendRequest: function(database_name,method,request,callback,scope) {
		var operation= this.encodeRequest(database_name,method,request);
		var debug= true; // JCM
    if (debug) {
	    console.log("local ->",this.remote.url,method,Ext.encode(request));
		}
		this.remote.read(operation,function(operation){
	    if (debug) {
		    console.log("  sent",operation.request.url.length,"bytes -",operation.request.url);
				console.log("  <= ",method,Ext.encode(operation.response));
	  	}
			callback.call(scope, operation);
		},this);
	},
	  
  encodeRequest: function(database_name,method,request) {
		var text= Ext.encode(request);
		var url= this.remote.url+"database/"+database_name+"/"+method;
		return new Ext.data.Operation({
			filters: [],
			action: 'read',
			url: url,
			params: request
		});
    return operation;
	}

});
