
Ext.data.CSV = Ext.extend(Ext.data.Config, {

	v: undefined, // array of change stamps

	constructor: function(config,callback,scope) {
		var changed= false;
		if (config) {
			config.config_id= 'csv';
			Ext.data.CSV.superclass.constructor.call(this, config);
			if (config.v) {
				this.v= [];
				this.do_add(config.v);
			}
		}
		if (this.v===undefined) {
			this.v= [];
			changed= true;
		}
		this.writeAndCallback(changed,callback,scope);
	},

	add: function(x,callback,scope) {
		var changed= this.do_add(x);
		this.writeAndCallback(changed,callback,scope);
		return this; // JCM should force use of callback?
	},

	get: function(cs) {
		return this.v[cs.r];
	},

	setReplicaNumber: function(replica_number,callback,scope) {
		this.addReplicaNumbers([replica_number],callback,scope);
	},

	addReplicaNumbers: function(x,callback,scope) {
		var t= [];
		if (x instanceof Array) {
			t= Ext.data.array.collect(x,function(r){return this.do_add(new Ext.data.CS({r:r}));},this);
		} else if (x instanceof Ext.data.CSV) {
			t= Ext.data.array.collect(x.v,function(cs){return this.do_add(new Ext.data.CS({r:cs.r}));},this);
		}
		var changed= Ext.data.array.includes(t,true);
		this.writeAndCallback(changed,callback,scope);
	},

	do_add: function(x) { // CSV, CS, '1-2-3', [x]
		var changed= false;
		if (x instanceof Ext.data.CSV) {
			var t= Ext.data.array.collect(x.v,this.do_add,this);
			changed= Ext.data.array.includes(t,true);
		} else if (x instanceof Ext.data.CS) {
			var r= x.r;
			var t= this.v[r];
			if (!t || x.greaterThan(t)) {
			  this.v[r]= new Ext.data.CS({r:x.r,t:x.t,s:x.s});
				changed= true;
			}
		} else if (typeof x == 'string' || x instanceof String) {
			changed= this.do_add(new Ext.data.CS(x));
		} else if (x instanceof Array) {
			var t= Ext.data.array.collect(x,this.do_add,this);
			changed= Ext.data.array.includes(t,true);
		} else {
			throw "Error - CSV - do_add - Unknown type: "+(typeof x)+": "+x;
		}
		return changed;
	},

	changeReplicaNumber: function(old_replica_number,new_replica_number,callback,scope) {
		var t= this.v[old_replica_number];
		var changed= false;
		if (t) {
			t.r= new_replica_number;
			this.v[old_replica_number]= undefined;
			this.v[new_replica_number]= t;
			changed= true;
		}
		this.writeAndCallback(changed,function(){
			callback.call(scope,this,changed);
		},this);
	},

	isEmpty: function() {
		return this.v.length<1;
	},

	maxChangeStamp: function() {
		if (!this.isEmpty()) {
			var r= new Ext.data.CS();
			this.v.forEach(function(cs){
				var t= new Ext.data.CS({t:cs.t,s:cs.s});
				r= (t.greaterThan(r) ? cs : r);
			},this);
			return r;
		}
	},

	dominates: function(x) {
		return Ext.data.array.any(this.compare(x),function(i){ return i>0; });
	},

	equals: function(x) {
		return Ext.data.array.all(this.compare(x),function(i){ return i===0; });
	},

	compare: function(x) {
        var i, cs, r;
		if (x instanceof Ext.data.CS) {
			cs= this.get(x);
			return [cs ? cs.compare(x) : -1];
		} else if (x instanceof Ext.data.CSV) {
			r= [];
			for(i in this.v) {
				cs= this.v[i];
				if (cs instanceof Ext.data.CS) {
					var cs2= x.get(cs);
					r.push(cs2 ? cs.compare(cs2) : 1);
				}
			}
			return r;
		} else {
			throw "Error - CSV - compare - Unknown type: "+(typeof x)+": "+x;
		}
		return [-1];
	},

	forEach: function(fn,scope) {
		this.v.forEach(fn,scope||this);
	},

	encode: function() { // for the wire
		return Ext.data.array.collect(this.v,function(){
			// JCM can we safely ignore replicas with CS of 0... except for the highest known replica number...
			return this.to_s();
		});
	},

	decode: function(x) { // from the wire
		this.do_add(x);
		return this;
	},

	to_s: function(indent) {
		var r= "CSV: ";
		this.v.forEach(function(cs){
			r+= cs.to_s()+", ";
		},this);
		return r;
	},

	as_data: function() { // for the disk
		var data= {
			v: Ext.data.array.collect(this.v,function(){return this.to_s();})
		};
		data[Ext.data.SyncModel.MODEL]= 'Ext.data.CSV';
		return Ext.data.CSV.superclass.as_data.call(this, data);
	}

});