
// JCM this 'class' could help with batching updates to be sent to the server

Ext.data.Updates = Ext.extend(Object, {

	updates: undefined,
	
	constructor: function(x) {
		//
		// sort the updates into change stamp order,
		// as they have to be transmitted this way
		//
		this.updates= x||[];
		this.updates.forEach(function(update) {
			if (!(update.c instanceof Ext.data.CS)) {
				update.c= new Ext.data.CS(update.c);
			}
		});
		this.updates.sort(function(a,b) {return a.c.compare(b.c);});
	},
	
	push: function(update) {
		// update must have a cs greater than the last element
		var last= this.updates[this.updates.length];
		if (update.c.lessThan(last)) { throw "Error - Updates - Tried to push updates in wrong order. "+last+" "+update; }
		this.updates.push(update);
	},
	
	isEmpty: function() {
		return this.updates.length<1;
	},

	forEach: function(callback,scope) {
		this.updates.forEach(callback,scope);
	},

	forEachAsync: function(each_callback,each_scope,done_callback,done_scope) {
		Ext.data.array.forEachAsync(this.updates,each_callback,each_scope,done_callback,done_scope);
	},
	
	limit: function(n) {
		var r= Math.max(0,this.updates.length-n);
		if (r>0) {
			this.updates= this.updates.slice(0,n);
		}
		return r;
	},
	
	chunks: function(chunk_size) {
		var r= [];
		var l= this.updates.length;
		var n= (l/chunk_size)+1;
		for(var i=0;i<n;i++) {
			var start= i*chunk_size;
			var end= start+chunk_size;
			var t= new Ext.data.Updates();
			t.updates= this.updates.slice(start,end);
			r.push(t);
		}
		return r;
	},

	decode: function(x) {
		this.updates= [];
		if (x) {
			var l= x.length;
			var update, prev_i, id, p, v, c;
			for(var i=0;i<l;i++) {
				update= x[i];
				switch(update.length) {
					case 3:
						id= prev_i;
						p= update[0];
						v= update[1];
						c= update[2];
						break;
					case 4:
						id= update[0];
						p= update[1];
						v= update[2];
						c= update[3];
						prev_i= id;
						break;
				}
				c= ((c instanceof Ext.data.CS) ? c : new Ext.data.CS(c));
				this.updates.push({i:id,p:p,v:v,c:c});
			}
		}
		return this;
	},
	
	encode: function() {
		// JCM optimize - "" around i and p and cs is not needed
		// JCM optimize - diff encode cs 1-123, +1-0, +0-1, 1-136-4, +1-0, ...
		var r= [];
		var l= this.updates.length;
		var prev_i, update, cs;
		for(var i=0;i<l;i++) {
			update= this.updates[i];
			cs= ((update.c instanceof Ext.data.CS) ? update.c.to_s() : update.c);
			if (update.i===prev_i) {
				r.push([update.p, update.v, cs]);
			} else {
				r.push([update.i, update.p, update.v, cs]);
				prev_i= update.i;
			}
		}
		return r;
	}
		
});
