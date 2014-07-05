
Ext.data.SyncProxy = Ext.extend(Ext.data.Proxy, {

	definition: undefined,
	csv: undefined,
	generator: undefined,
	model: undefined,
	store: undefined,
	idProperty: undefined,
	idDefaultProperty: undefined,

	// JCM constructor should not be async, delay until first operation

	constructor: function(config,callback,scope) {
		//
		Ext.data.utilities.check('SyncProxy', 'constructor', 'config', config, ['store','database_name','key']);
		//
		Ext.data.SyncProxy.superclass.constructor.call(this, config);
		this.store= config.store;
		//
		// System Name
		//
		this.store.readValue('Sencha.Sync.system_name',function(system_name){
			config.system_name= system_name || Ext.data.UUIDGenerator.generate();
			this.store.writeValue('Sencha.Sync.system_name',config.system_name,function(){
				//
				// Load Configuration
				//
				Ext.data.utilities.apply(this,[
					'readConfig_DatabaseDefinition',
					'readConfig_CSV',
					'readConfig_Generator'],[config],function(){
					if (this.definition.system_name===undefined) {
						this.definition.set({system_name:Ext.data.UUIDGenerator.generate()});
					}
					console.log("SyncProxy - Opened database '"+config.key+"/"+config.database_name+"/"+config.datastore_name+"'")
					if (callback) { callback.call(scope,this) }
				},this);
			},this);
		},this);
  },

  create: function(operation, callback, scope) {
		operation.records.forEach(function(record) {
			record.setCreateState(this.makeGenerator());
			// if there's no user id, then use the oid.
			if (record.get(this.idProperty)===this.idPropertyDefaultValue) {
				var p= record.getPair(Ext.data.SyncModel.OID);
				record.data[this.idProperty]= p.v;
			}
			// JCM check that the id is unique
		},this)
		var records= this.encodeRecords(operation.records)
		return this.store.create(records,function() {
			this.indexCreatedRecords(records,function(){
				//console.log('create',operation);
				this.doCallback(callback,scope,operation);
			},this);
		},this);
  },

  read: function(operation, callback, scope) {

		function makeResultSet(operation,records,no_system_records) {
			records= this.decodeRecords(records);
			records= Ext.data.array.select(records,function(record){
				return record.isNotDestroyed() && !record.phantom && (!no_system_records || !record.isSystemModel());
			},this);
	    operation.resultSet = new Ext.data.ResultSet({
	        records: records,
	        total  : records.length,
	        loaded : true
	    });
		};

		if (operation.id!==undefined) {
			this.store.indexLookup(operation.id,function(oid) {
				// JCM if the id is not in the index, then it doesn't exist, so we can return now...
				this.store.read(oid,function(record) {
					makeResultSet.call(this,operation,[record],true);
					this.doCallback(callback,scope,operation);
				},this);
			},this);
		} else if (operation[Ext.data.SyncModel.OID]!==undefined) {
				this.store.read(operation[Ext.data.SyncModel.OID],function(record) {
					makeResultSet.call(this,operation,[record],false);
					this.doCallback(callback,scope,operation);
				},this);
		} else {
			var records= [];
			this.store.forEachRecordAsync(function(record,next_callback,next_scope) {
				//console.log(Ext.encode(record))
				records.push(record);
				next_callback.call(next_scope);
			},this,function(){
				makeResultSet.call(this,operation,records,true);
				this.doCallback(callback,scope,operation);
			},this);
		}
  },

  update: function(operation, callback, scope) {
		operation.records.forEach(function(record) {
			record.setUpdateState(this.makeGenerator());
		},this)
		// JCM make sure that the id has not been changed.
		var records= this.encodeRecords(operation.records);
		return this.store.update(records,function(operation) {
			this.doCallback(callback,scope,operation);
		},this);
  },

  destroy: function(operation, callback, scope) {
		var records= [];
		Ext.data.array.forEachAsync(operation.records,function(record,next_callback,next_scope){
			record.setDestroyState(this.makeGenerator());
			var oid= record.oid();
			if (!oid) {
				var id= record.data[this.idProperty];
				this.store.indexLookup(id,function(oid) {
					// JCM if the id is not in the index, then it doesn't exist, so we don't need to try deleting it.
					if (oid) {
						record.data[Ext.data.SyncModel.OID]= oid;
						records.push(record);
					}
					next_callback.call(next_scope);
				},this);
			} else {
				records.push(record);
				next_callback.call(next_scope);
			}
		},this,function(){
			records= this.encodeRecords(records);
			this.store.update(records,function(operation) {
				operation.action= 'destroy';
				this.indexDestroyedRecords(records,function(){
					this.doCallback(callback,scope,operation);
				},this);
			},this);
		},this);
  },

	clear: function(callback, scope) {
		this.store.clear(callback, scope);
	},

  setModel: function(model, setOnStore) {
		this.model= model;
		this.idProperty= this.model.prototype.idProperty;
		var fields = this.model.prototype.fields.items,
	      length = fields.length,
	      field, i;
	  for (i = 0; i < length; i++) {
	      field = fields[i];
				if (field.name===this.idProperty) {
					this.idPropertyDefaultValue= field.defaultValue;
				}
	  }
		this.definition.set({idProperty:this.idProperty,idPropertyDefaultValue:this.idPropertyDefaultValue},function(){},this);
		// extend the user's model with the replication state data,
		Ext.apply(model.prototype, Ext.data.SyncModel);
		// and create a local storage model, based on the user's model.
		this.storageModel= model.prototype.createReplStorageModel(this.modelName); // JCM shouldn't need to pass the name in
		this.store.setModel(this.storageModel, setOnStore);
  },

	replicaNumber: function() {
		return this.generator.r;
	},

	addReplicaNumbers: function(csv,callback,scope) {
		this.csv.addReplicaNumbers(csv,callback,scope);
	},

	setReplicaNumber: function(new_replica_number,callback,scope) {
		if (!callback) { throw "ERROR - SyncProxy - setReplicaNumber - no callback provided." }
  	var old_replica_number= this.replicaNumber();
		console.log('SyncProxy.setReplicaNumber from',old_replica_number,'to',new_replica_number)
    this.changeReplicaNumber(old_replica_number,new_replica_number,function(){
			this.definition.setReplicaNumber(new_replica_number,function(){
		  	this.csv.changeReplicaNumber(old_replica_number,new_replica_number,function(){
				  this.generator.setReplicaNumber(new_replica_number,callback,scope);
				},this);
			},this);
		},this);
	},

  changeReplicaNumber: function(old_replica_number,new_replica_number,callback,scope) {
		console.log('SyncProxy.changeReplicaNumber from',old_replica_number,'to',new_replica_number)
		if (!callback) { throw "ERROR - SyncProxy - changeReplicaNumber - no callback provided." }
		this.forEachRecordAsync(function(record,next_callback,next_scope) {
			if (!record.isSystemModel()){
				var old_oid= record.oid();
				if (record.changeReplicaNumber(old_replica_number,new_replica_number)) {
					var records= this.encodeRecords([record])
					this.store.create(records,function(){
						this.indexCreatedRecords(records,function(){
							this.store.destroy(old_oid,next_callback,next_scope);
						},this);
					},this);
				} else {
					next_callback.call(next_scope);
				}
			} else {
				next_callback.call(next_scope);
			}
		},this,callback,scope);
	},

	getUpdates: function(csv,callback,scope) {
		this.csv.addReplicaNumbers(csv,function(){
	    csv.addReplicaNumbers(this.csv,function(){
				// JCM full scan - expensive - maintain a cs index?
				// JCM might also be too big... perhaps there should be a limit on the number
				// JCM of updates that can be collected...
				// JCM could also exhaust the stack
				// JCM could have a fixed sized list, discarding newest to add older
				// JCM could have a full update protocol as well as an incremental protocol
				var updates= [];
				this.forEachRecordAsync(function(record,next_callback,next_scope) {
					updates= updates.concat(record.getUpdates(csv));
					next_callback.call(next_scope);
				},this,function(){
			    callback.call(scope,new Ext.data.Updates(updates));
				},this);
			},this);
		},this);
  },

	putUpdates: function(updates,callback,scope) {
		//
		// JCM could batch updates by object, to save on wasteful repeated gets and sets of the same object
		//
		// A client or server could receive a large number of updates, which
		// because of the recursive nature of the following code, could
		// exhaust the stack. (Most browsers have a limit of 1000 frames.)
		// Also, on the client, hogging the cpu can cause the UI to feel
		// unresponsive to the user. So, we chunk the updates and process
		// each in turn, yielding the cpu between them.
		//
		var chunks= updates.chunks(10);
		Ext.data.array.forEachYielding(chunks,function(chunk,next_callback,next_scope){
			Ext.data.array.forEachAsync(chunk.updates,function(update,next_callback2,next_scope2) {
				this.applyUpdate(update,function() {
					// make sure to bump forward our clock, just in case one of our peers has run ahead
					this.generator.seen(update.c);
					// update the local csv, after the update has been processed.
					this.csv.add(update.c,next_callback2,next_scope2);
				},this);
			},this,next_callback,next_scope);
		},this,callback,scope);
	},

  applyUpdate: function(update,callback,scope,last_ref) { // Attribute Value - Conflict Detection and Resolution
		if (last_ref) {
			console.log('ref ==> ',this.us(update));
		} else {
			console.log('applyUpdate',this.us(update));
		}
		this.store.read(update.i,function(record) {
			if (record) {
				var ref= record.ref();
				if (ref && update.p[0]!='_') { // JCM this is a bit sneaky
					if (update.i===ref) {
						console.log("Error - applyUpdate - Infinite loop following reference. ",ref);
						callback.call(scope);
					} else {
						update.i= ref;
						this.applyUpdate(update,callback,scope,ref);
					}
				} else {
					if (update.p===this.idProperty) {
						this.applyUpdateToRecordForUniqueID(record,update,callback,scope);
					} else {
						this.applyUpdateToRecord(record,update,callback,scope);
					}
				}
			} else {
				this.applyUpdateCreatingNewRecord(update,callback,scope);
			}
		},this);
  },

	applyUpdateCreatingNewRecord: function(update,callback,scope) {
		// no record with that oid is in the local store...
		if (update.p===Ext.data.SyncModel.OID) {
			// ...which is ok, because the update is intending to create it
			var record= this.createNewRecord(update.v,update.c);
			//console.log('applyUpdate',Ext.encode(record.data),'( create )');
			this.store.create([record],callback,scope);
		} else {
			// ...which is not ok, because given the strict ordering of updates
			// by change stamp the update creating the object must be sent first.
			// But, let's be forgiving and create the record to receive the update.
			console.log("Warning - Update received for unknown record "+update.i,update)
			var record= this.createNewRecord(update.i,update.i);
			record.setPair(update.p,update.v,update.c);
			this.store.create([record],callback,scope);
		}
	},

	applyUpdateToRecordForUniqueID: function(record,update,callback,scope) {
		// update is to the id, for which we maintain uniqueness
		if (record.data[update.p]===update.v) {
			// re-asserting same value for the id
			this.applyUpdateToRecordForUniqueId(record,update,callback,scope);
		} else {
			// different value for the id, so check if a record already exists with that value
			this.store.indexLookup(update.v,function(existing_record_oid) {
				//console.log(this.us(update),'id already exists')
				if (existing_record_oid) {
					//console.log('existing_record_oid',existing_record_oid)
					this.readById(update.v,existing_record_oid,function(existing_record) {
						//console.log('existing_record',Ext.encode(existing_record.data))
						// JCM if the process were to fail part way through these updates...
						// JCM would the system be hoarked?
						this.applyUpdateToRecordForUniqueId(record,update,function(){
							var r_cs= new Ext.data.CS(record.oid());
							var er_cs= new Ext.data.CS(existing_record.oid());
							var r_before, r_after;
							if (r_cs.greaterThan(er_cs)) {
								// the record being updated is more recent then the existing record
								//console.log(this.us(update),'existing record is older');
								r_before= existing_record;
								r_after= record;
							} else {
								// the existing record is more recent than the record being updated
								//console.log(this.us(update),'existing record is newer');
								r_before= record;
								r_after= existing_record;
							}
							this.resolveUniqueIDConflict(r_before,r_after,function() {
								this.store.indexUpdate(update.v,r_before.oid(),callback,scope);
							},this);
						},this);
					},this);
				} else {
					// the new id value did not exist at the time of the update
					this.applyUpdateToRecordForUniqueId(record,update,callback,scope);
				}
			},this);
		}
	},

	applyUpdatesToRecord: function(record,updates,callback,scope) {
		if (updates.length>0) {
			Ext.data.array.forEachAsync(updates,function(update,next_callback,next_scope) {
				this.applyUpdateToRecord(record,update,next_callback,next_scope);
			},this,callback,scope);
		} else {
			callback.call(scope);
		}
	},

	applyUpdateToRecordForUniqueId: function(record,update,callback,scope) {
		var value_before= record.data[update.p];
		var value_after= update.v;
		this.applyUpdateToRecord(record,update,function(changed){
			if (changed) {
				this.store.indexUpdate(value_after,record.oid(),function(){
					if (value_before) {
						this.store.indexUpdate(value_before,undefined,function(){
							callback.call(scope,changed);
						},this);
					} else {
						callback.call(scope,changed);
					}
				},this);
			} else {
				callback.call(scope,changed);
			}
		},this);
	},

	applyUpdateToRecord: function(record,update,callback,scope) {
		if (record.putUpdate(update)) {
			//console.log(this.us(update),'accepted')
			this.store.update([record],function() {
				callback.call(scope,true);
			},scope);
		} else {
			//console.log(this.us(update),'rejected')
			callback.call(scope,false);
		}
	},

	readById: function(id,oid,callback,scope) { // JCM move into applyUpdateToUniqueID?
		this.store.read(oid,function(record) {
			if (record) {
				callback.call(scope,record);
			} else {
				console.log('ERROR - SyncProxy - applyUpdateToUniqueID - ID Index refers to an non-existant object:',id,'=>',oid,'(This should not be possible.)');
			}
		},this);
	},

	resolveUniqueIDConflict: function(r1,r2,callback,scope) { // JCM move into applyUpdateToUniqueID?
		var updates= this.updatesForMergeRecords(r1,r2);
		this.applyUpdatesToRecord(r1,updates,function() {
			var updates= this.updatesForMakeReference(r2,r1);
			this.applyUpdatesToRecord(r2,updates,function() {
				callback.call(scope);
			},this);
		},this);
	},

	updatesForMergeRecords: function(r1,r2) { // merge r2 into r1 // JCM move into applyUpdateToUniqueID?
		// r1 receives all updates from r2
		var csv= r1.getCSV();
		var updates1= r2.getUpdates(csv);
		var updates2= [];
		var r1_oid= r1.oid();
		updates1.forEach(function(update) {
			if (update.p!==this.idProperty && update.p!==Ext.data.SyncModel.OID) {
				update.i= r1_oid;
				updates2.push(update);
			}
		},this);
		//console.log('updatesForMergeRecords - csv',csv);
		//console.log('updatesForMergeRecords - r1',r1.data);
		//console.log('updatesForMergeRecords - r2',r2.data);
		//console.log('updatesForMergeRecords - updates',updates2);
		return updates2;
	},

	updatesForMakeReference: function(r1,r2) { // JCM move into applyUpdateToUniqueID?
		if (r1.oid()===r2.oid()) {
			console.log('updatesForMakeReference',r1.data,r2.data);
			throw "Error - SyncProxy - Tried to create reference to self."
		}
		var cs1= this.generateChangeStamp();
		var cs2= this.generateChangeStamp();
		var updates= [{
			i: r1.oid(),
			p: Ext.data.SyncModel.REF,
			v: r2.oid(),
			c: cs1
		},{
			i: r1.oid(),
			p: Ext.data.SyncModel.TOMBSTONE,
			v: cs2.to_s(),
			c: cs2
		}];
		//console.log('updatesForMakeReference',updates);
		return updates;
	},

	createNewRecord: function(oid,cs) {
		var record= new this.storageModel();
		record.phantom= false;
		Ext.apply(record,Ext.data.SyncModel);
		record.setPair(Ext.data.SyncModel.OID,oid,cs);
		return record;
	},

	indexCreatedRecords: function(records, callback, scope) {
		//console.log('indexCreatedRecords');
		Ext.data.array.forEachAsync(records,function(record,next_callback,next_scope){
			var record_id= record.data[this.idProperty];
			if (record_id) {
				this.store.indexUpdate(record_id,record.data[Ext.data.SyncModel.OID],next_callback,next_scope);
			} else {
				next_callback.call(next_scope);
			}
		},this,callback,scope);
	},

	indexDestroyedRecords: function(records, callback, scope) {
		//console.log('indexDestroyedRecords');
		Ext.data.array.forEachAsync(records,function(record,next_callback,next_scope){
			var record_id= record.data[this.idProperty];
			if (record_id) {
				this.store.indexUpdate(record_id,undefined,next_callback,next_scope);
			} else {
				next_callback.call(next_scope);
			}
		},this,callback,scope);
	},

	makeGenerator: function() {
		var me= this;
		return function() { return me.generateChangeStamp() }
	},

  generateChangeStamp: function() {
		var cs= this.generator.get();
		this.csv.add(cs);
		return cs;
	},

	equals: function(x,callback,scope) { // for testing
		if (this.csv.equals(x.csv)) {
			this.hasSameRecords(x,function(r){
				if (r) {
					x.hasSameRecords(this,callback,scope)
				} else {
					callback.call(scope,false)
				}
			},this)
		} else {
			callback.call(scope,false)
		}
	},

	hasSameRecords: function(x,callback,scope) { // for testing
		this.forEachRecordAsync(function(r1,next_callback,next_scope){
			this.store.read(r1.oid(),function(r2) {
				if (r2) {
					var r= r1.equals(r2);
					if (r) {
						next_callback.call(next_scope);
					} else {
						console.log('hasSameRecords - false - ',this.replicaNumber(),x.replicaNumber())
						callback.call(scope,false);
					}
				} else {
					console.log('hasSameRecords - false - ',this.replicaNumber(),x.replicaNumber())
					callback.call(scope,false);
				}
			},this);
		},this,function(){
			callback.call(scope,true);
		},this);
	},

	console_log: function(text,callback,scope) { // for testing
		console.log('---- ',text);
		this.forEachRecordAsync(function(r1,next_callback,next_scope){
			console.log(Ext.encode(r1.data));
			next_callback.call(next_scope);
		},this,function(){
			console.log('----');
			callback.call(scope);
		},this);
	},

	forEachRecordAsync: function(each_callback, each_scope, done_callback, done_scope) { // JCM this is expensive... nothing should really call this.....
		var Model= this.model;
		this.store.forEachRecordAsync(function(record,next_callback,next_scope){
			each_callback.call(each_scope,new Model(record.data),next_callback,next_scope);
		},this,done_callback,done_scope);
	},

	encodeRecords: function(records) {
		var Model= this.storageModel;
		return Ext.data.array.collect(records,function(){
			var record= new Model(this.data);
			record.internalId= this.internalId;
			record.phantom= false;
			return record;
		});
	},

	decodeRecords: function(records) {
		var Model= this.model;
		return Ext.data.array.collect(records,function(){
			var record= new Model(this.data);
			record.internalId= this.internalId;
			record.phantom= false;
			return record;
		});
	},

	readConfig_DatabaseDefinition: function(config,callback,scope) {
		var default_data= {
			key: config.key,
			system_name: config.system_name,
			generation: 0,
			replica_number: 0
		};
		var overwrite_data= {
			database_name: config.database_name,
			replica_type: config.replica_type
		};
		this.readConfig(Ext.data.DatabaseDefinition,'definition',default_data,overwrite_data,function(definition) {
			this.definition= definition;
			callback.call(scope);
		},this);
	},

	readConfig_Generator: function(config,callback,scope) {
		var overwrite_data= {
			r: this.definition.replica_number,
			clock: config.clock
		};
		this.readConfig(Ext.data.CSGenerator,'generator',{},overwrite_data,function(generator){
			this.generator= generator;
			callback.call(scope);
		},this);
	},

	readConfig_CSV: function(config,callback,scope) {
		this.readConfig(Ext.data.CSV,'csv',{},{},function(csv){
			this.csv= csv;
			callback.call(scope);
		},this);
	},

	writeConfig: function(id, object, callback, scope) {
		this.store.writeConfig(id,object.as_data(),function(data){
			object.set(data);
			callback.call(scope)
		},this);
	},

	readConfig: function(Klass, id, default_data, overwrite_data, callback, scope) {
        var changed, name;
		this.store.readConfig(id,function(data) {
			if (default_data!==undefined) {
				if (data===undefined) {
					data= default_data;
				} else {
					for(name in default_data) {
						if (data[name]===undefined) {
							data[name]= default_data[name];
							changed= true;
						}
					}
				}
			}
			if (overwrite_data!==undefined) {
				if (data===undefined) {
					data= overwrite_data;
				} else {
					for(name in overwrite_data) {
						if (data[name]!==overwrite_data[name]) {
							data[name]= overwrite_data[name];
							changed= true;
						}
					}
				}
			}
			var me= this;
			data.config_id= id;
			data.write_fn= function(object, write_callback, write_scope) {
				me.writeConfig.call(me,id,object,write_callback,write_scope);
			};
			callback.call(scope,new Klass(data));
		},this);
	},

	doCallback: function(callback, scope, operation) {
    if (typeof callback == 'function') {
			callback.call(scope || this, operation);
    }
	},

	us: function(u) {
		var p= Ext.isArray(u.p) ? u.p.join() : u.p;
		var v= u.v;
		switch (typeof u.v) {
			case 'object':
				v= Ext.encode(u.v);
		}
		return '('+u.i+' . '+p+' = \''+v+'\' @ '+u.c.to_s()+')';
	}

});

