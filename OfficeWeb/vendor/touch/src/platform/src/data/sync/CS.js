
Ext.data.CS = Ext.extend(Object, { // Change Stamp

	r: 0, // replica_number
	t: 0, // time, in seconds since the epoch
	s: 0, // sequence number

	constructor: function(config) {
		this.set(config);
	},
	
	set: function(x) {
		if (typeof x === 'string' || x instanceof String) {
			this.from_s(x)
		} else if (typeof x === 'object') {
			this.r= x.r||0;
			this.t= x.t||0;
			this.s= x.s||0;
		}
	},

	changeReplicaNumber: function(old_replica_number,new_replica_number) {
		if (this.r==old_replica_number) {
			this.r= new_replica_number;
			return true;
		}
		return false;
	},

 	greaterThan: function(x) { return this.compare(x)>0; },
 	lessThan: function(x) { return this.compare(x)<0; },
	equals: function(x) { return this.compare(x)===0 },
	compare: function(x) {
		var r= this.t-x.t
		if (r==0) {
			r= this.s-x.s;
			if (r==0) {
				r= this.r-x.r
			}
		}
		return r;
	},
	
	from_s: function(t) {
    var m= t.match(/(\d+)-(\d+)-?(\d+)?/)
		if (m && m.length>0) {
	    this.r= parseInt(m[1])
	    this.t= parseInt(m[2])
	    this.s= m[3] ? parseInt(m[3]) : 0
		} else {
			throw "Error - CS - Bad change stamp '"+t+"'."
		}
		return this;
	},
	
	to_s: function() {
		return this.r+"-"+this.t+(this.s>0 ? "-"+this.s : "");		
	}

});
