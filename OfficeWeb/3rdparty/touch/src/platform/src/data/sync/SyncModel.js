
// this model is used to extend the user's own model.
// it adds the replication state.

Ext.data.SyncModel= {

	STATE: '_state',
	TOMBSTONE: '_ts',
	OID: '_oid',
	REF: '_ref',
	MODEL: '_model',

	state: undefined,

	createReplStorageModel: function(modelName) { // create the storage model, based on the user model

		var augmented_fields= this.fields.items.slice(0);
		augmented_fields= augmented_fields.concat([
			{name: '_state'},
			{name: '_ts'},
			{name: '_oid'},
			{name: '_ref'},
			{name: '_model'}
		]);

		// JCM could the local storage proxy be added to the storage model...?

		var StorageModel= Ext.regModel("Sencha.StorageModel."+modelName, {
			fields: augmented_fields,
			idProperty: Ext.data.SyncModel.OID
		});

		return StorageModel;
  },

	oid: function() {
		return this.data[Ext.data.SyncModel.OID];
	},

	ref: function() {
		return this.data[Ext.data.SyncModel.REF];
	},

	userData: function() {
		var r= {};
		for(var i in this.data) {
			if (i[0]!=="_") {
				r[i]= this.data[i];
			}
		}
		return r;
	},

	isSystemModel: function() {
		var model_name= this.data[Ext.data.SyncModel.MODEL];
		return model_name!==undefined && model_name.indexOf("Ext.data.",0)===0;
	},

	changeReplicaNumber: function(old_replica_number,new_replica_number) {
		this.setup();
		var changed= false;
		this.forEachCS(this.state,function(cs) {
			var t= cs.changeReplicaNumber(old_replica_number,new_replica_number)
			changed= changed || t;
			return cs;
		},this);
		var v= this.oid();
		if (v) {
			var id_cs= new Ext.data.CS(v);
			if (id_cs.changeReplicaNumber(old_replica_number,new_replica_number)) {
				this.data[Ext.data.SyncModel.OID]= id_cs.to_s();
				changed= true;
			}
		}
		return changed;
	},

	setCreateState: function(generator) {
		this.state= {};
		var cs= generator();
		this.setPair(Ext.data.SyncModel.OID,cs.to_s(),cs);
		this.forEachValue(this.data,[],function(path,value) {
			if (path[0]!==Ext.data.SyncModel.OID) {
				this.setCS(path,generator());
			}
		},this);
	},

	setUpdateState: function(generator) {
		var changes= this.getChanges(),
            name;
		for (name in changes) {
			if (name!==Ext.data.SyncModel.STATE && name!==Ext.data.SyncModel.OID) {
				this.setUpdateStateValue([name],this.modified[name],changes[name],generator);
			}
		}
	},

	setUpdateStateValue: function(path,before_value,after_value,generator) {
		//console.log('setUpdateStateValue',path,before_value,after_value)
		if (this.isComplexValueType(after_value)) {
			if (before_value) {
				var added= {};
				if (this.isComplexValueType(before_value)) {
					if (this.valueType(before_value)===this.valueType(after_value)) {
						added= Ext.data.utilities.minus(after_value,before_value);
						var changed= Ext.data.utilities.intersection(after_value,before_value);
						for(var name2 in changed) {
							if (changed.hasOwnProperty(name2)) {
								if (before_value[name2]!==after_value[name2]) {
									added[name2]= after_value[name2]
								}
							}
						}
					} else {
						added= after_value;
						this.setCS(path,generator()); // value had a different type before, a complex type
					}
				} else {
					added= after_value;
					this.setCS(path,generator()); // value had a different type before, a primitive type
				}
			} else {
				added= after_value;
				this.setCS(path,generator()); // value didn't exist before
			}
			for(var name2 in added) {
				if (added.hasOwnProperty(name2)) {
					var next_before_value= before_value ? before_value[name2] : undefined;
					this.setUpdateStateValue(path.concat(name2),next_before_value,after_value[name2],generator);
				}
			}
		} else {
			this.setCS(path,generator()); // value has a primitive type
		}
	},

	setDestroyState: function(generator) {
		var cs= generator();
		this.data[Ext.data.SyncModel.TOMBSTONE]= cs.to_s();
		this.setCS(Ext.data.SyncModel.TOMBSTONE,cs);
	},

	isNotDestroyed: function() { // test if a record has been deleted
		var t= this.data[Ext.data.SyncModel.TOMBSTONE]
		return (t===undefined || t==='');
	},

	getUpdates: function(csv) {
		//console.log('updates',Ext.encode(csv))
		this.setup();
		var updates= [];
		var oid= this.oid();
		this.forEachPair(this.data,this.state,[],[],function(path,values,cs){
			if (cs) {
				var cs2= csv.get(cs);
				if (!cs2 || cs2.lessThan(cs)) {
					updates.push({
						i: oid,
						p: path.length==1 ? path[0] : path,
						v: values.length==1 ? values[0] : values,
						c: cs
					});
				}
			}
		},this);
		//console.log('updates =>',Ext.encode(updates))
		return updates;
	},

	putUpdate: function(update) {
		//console.log('applyUpdate',update)
		return this.setPair(update.p,update.v,update.c);
	},

	equals: function(r) {
		this.forEachPair(this.data,this.state,[],[],function(path,values,cs) {
			var p= r.getPair(path);
			var value= values[values.length-1];
			if (!(cs.equals(r.c) && value===r.v)) {
				return false;
			}
		},this);
		return true;
	},

	forEachPair: function(data,state,path,values,callback,scope) {
		//console.log('forEachPair',Ext.encode(data),Ext.encode(state),Ext.encode(path),Ext.encode(values));
		this.setup();
		for(var name in state) {
			if (state.hasOwnProperty(name)) {
				var new_state= state[name];
				var new_data= data[name];
				var new_path= path.concat(name);
				var new_data_type= this.valueType(new_data);
				var new_value;
				switch (new_data_type) {
					case 'object':
						new_value= {};
						break;
					case 'array':
						new_value= [[]];
						break;
					default:
						new_value= new_data;
				}
				var new_values= values.concat(new_value);
				switch (this.valueType(new_state)) {
					case 'string':
						callback.call(scope,new_path,new_values,new Ext.data.CS(new_state));
						break;
					case 'array':
						switch (new_data_type) {
							case 'undefined':
								console.log('Warning - There was no data for the state at path',new_path);
								console.log('Warning -',Ext.encode(this.data));
								break;
							case 'object':
							case 'array':
								callback.call(scope,new_path,new_values,new Ext.data.CS(new_state[0])); // [cs,state]
								this.forEachPair(new_data,new_state[1],new_path,new_values,callback,scope); // [cs,state]
								break;
							default:
								callback.call(scope,new_path,new_values,new Ext.data.CS(new_state[0])); // [cs,state]
								break;
						}
						break;
				}
			}
		}
	},

	forEachValue: function(data,path,callback,scope) {
    var n, v;
		for(n in data) {
			if (data.hasOwnProperty(n)) {
				v= data[n];
				if (v!==this.state) {
					var path2= path.concat(n);
					callback.call(scope,path2,v);
					if (this.isComplexValueType(v)) {
						this.forEachValue(v,path2,callback,scope);
					}
				}
			}
		}
	},

	getCSV: function() {
		var csv= new Ext.data.CSV();
		this.forEachCS(this.state,function(cs) {
			csv.add(cs);
		},this);
		return csv;
	},

	forEachCS: function(state,callback,scope) {
        var name, next_state, cs;
		for(name in state) {
			if (state.hasOwnProperty(name)) {
				next_state= state[name];
				switch (this.valueType(next_state)) {
					case 'string':
						cs= callback.call(scope,new Ext.data.CS(next_state));
						if (cs) { state[name]= cs.to_s(); }
						break;
					case 'array':
						cs= callback.call(scope,new Ext.data.CS(next_state[0]));
						if (cs) { state[name][0]= cs.to_s(); } // [cs,state]
						this.forEachCS(next_state[1],callback,scope); // [cs,state]
						break;
				}
			}
		}
	},

	getCS: function(path) {
		this.setup();
		var state= this.state;
		if (Ext.isArray(path)) {
			var l= path.length;
			var e= l-1;
			for(var i=0;i<l;i++) {
				var name= path[i];
				if (i===e) {
					return this.do_getCS(state,name);
				} else {
					state= this.do_getState(state,name);
				}
			}
		} else {
			return this.do_getCS(state,path);
		}
	},

	do_getCS: function(state,name) {
		var cs= undefined;
		state= state[name];
		if (state) {
			switch (this.valueType(state)) {
				case 'string':
					cs= new Ext.data.CS(state);
					break;
				case 'array':
					cs= new Ext.data.CS(state[0]); // [cs,state]
					break;
				default:
					console.log("Error - SyncModel - do_getCS - unexpected type in state for",name,":",typeof state,state);
					console.log('state',Ext.encode(this.data));
					cs= new Ext.data.CS();
					break;
			}
		} // else undefined
		return cs;
	},

	setCS: function(path,cs) {
		//console.log('setCS',Ext.isArray(path) ? path.join() : path,cs.to_s())
		this.setup();
		var state= this.state;
		if (Ext.isArray(path)) {
			var l= path.length;
			var e= l-1;
			for(var i=0;i<l;i++) {
				var name= path[i];
				if (i===e) {
					this.do_setCS(state,name,cs);
				} else {
					state= this.do_getState(state,name);
				}
			}
		} else {
			this.do_setCS(state,path,cs);
		}
	},

	do_setCS: function(state,name,cs) {
		var cs_s= (cs instanceof Ext.data.CS) ? cs.to_s() : cs;
		var state2= state[name];
		if (state2) {
			switch (this.valueType(state2)) {
				case 'string':
					state[name]= cs_s;
					break;
				case 'array':
					state2[0]= cs_s; // [cs,state]
					break;
				default:
					console.log("Error - SyncModel - do_setCS - unexpected type in state for",name,":",typeof state2,state2);
					console.log('state',Ext.encode(state));
					console.log('name',name,'cs',cs_s);
					state[name]= cs_s;
			}
		} else {
			state[name]= cs_s;
		}
		//console.log('do_setCS',name,cs_s,Ext.encode(state))
	},

	getPair: function(path) {
		this.setup();
		var data= this.data;
		var state= this.state;
		if (Ext.isArray(path)) {
			var l= path.length;
			var e= l-1;
			for(var i=0;i<l;i++) {
				var name= path[i];
				if (i===e) {
					return {
						v: data ? data[name] : data,
						c: this.do_getCS(state,name)
					};
				} else {
					state= this.do_getState(state,name);
					data= data ? data[name] : data;
				}
			}
		} else {
			return {
				v: data[path],
				c: this.do_getCS(state,path)
			};
		}
	},

	setPair: function(path,values,new_cs) {
		//console.log('setPair',Ext.encode(path),Ext.encode(values),Ext.encode(new_cs));
		//console.log('setPair',Ext.encode(this.data));
		var changed= false;
		this.setup();
		if (!Ext.isArray(path)) {
			path= [path];
			values= [values];
		}
		var data= this.data;
		var state= this.state;
		var l= path.length;
		var e= l-1;
		for(var i=0;i<l;i++) {
			var name= path[i];
			var new_value= values[i];
			var old_cs= this.do_getCS(state,name);
			var old_value= data[name];
			var old_value_type= this.valueType(old_value);
			var new_value_type= this.valueType(new_value);
			var sameComplexType=
				((old_value_type==='object' && new_value_type==='object') ||
				(old_value_type==='array' && new_value_type==='array'));
			if (old_cs) {
				if (new_cs.greaterThan(old_cs)) {
					if (sameComplexType) {
						new_value= undefined; // re-assert, don't overwrite
					}
					// new_cs is gt old_cs, so accept update
					if (this.do_setPair(data,state,name,new_value,new_cs)) {
						changed= true;
					}
				} else {
					// new_cs is not gt old_cs
					if (sameComplexType) {
						// but this value type along the path is the same, so keep going...
					} else {
						// and this type along the path is not the same, so reject the update.
						return changed;
					}
				}
			} else {
				// no old_cs, so accept update
				if (this.do_setPair(data,state,name,new_value,new_cs)) {
					changed= true;
				}
			}
			if (i!==e) {
				data= this.do_getData(data,name);
				state= this.do_getState(state,name,new_cs);
			}
		}
		//console.log('setPair => ',Ext.encode(this.data));
		return changed;
	},

	do_getState: function(state,name,cs) {
		var next_state= state[name];
		switch (this.valueType(next_state)) {
			case 'undefined':
				var new_state= {};
				state[name]= [cs,new_state];
				state= new_state;
				break;
			case 'string':
				var new_state= {};
				state[name]= [next_state,new_state];
				state= new_state;
				break;
			case 'array':
				state= next_state[1];
				break;
			default:
				throw "Error - SyncModel - do_getState - unexpected type in state: "+(typeof next_state)+" "+next_state
		}
		return state;
	},

	do_setPair: function(data,state,name,new_value,new_cs) {
		var changed= false;
		if (new_value!==undefined) {
			this.do_setData(data,name,new_value)
			changed= true;
		}
		if (new_cs!==undefined) {
			this.do_setCS(state,name,new_cs);
			changed= true;
		}
		return changed;
	},

	do_getData: function(data,name) {
		return data[name];
	},

	do_setData: function(data,name,value) {
		//console.log(Ext.encode(data),"[",name,"]=",Ext.encode(value));
		data[name]= value;
	},

	valueType: function(value) { // returns undefined, number, boolean, string, object, array
		var t= typeof value;
		if (t==='object' && (value instanceof Array)) {
			t= 'array';
		}
		return t;
	},

	valueEquals: function(v1,v2) {
		var r= false;
		var t1= this.valueType(v1);
		var t2= this.valueType(v2);
		if (t1===t2) {
			switch (t1) {
			case 'object':
			case 'array':
				r= Ext.encode(v1)===Ext.encode(v2); // JCM I'm sure there's a better way to do this...
				break;
			default:
				r= v1===v2;
			}
		}
		return r;
	},

	isComplexValueType: function(value) { // return true for an object or an array
		return (typeof value==='object');
	},

	setup: function() {
		this.data[Ext.data.SyncModel.STATE]= this.data[Ext.data.SyncModel.STATE] || {};
		this.state= this.data[Ext.data.SyncModel.STATE];
	}

};

