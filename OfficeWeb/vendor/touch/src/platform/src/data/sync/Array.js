
Ext.data.array= {
	
	select: function(a,fn,scope) {
		var r= [];
		if (a) {
			a.forEach(function(i) {
				if (i!==undefined && fn.call(scope||i,i)) { r.push(i) } 
			})
		}
		return r;
	},

	index: function(a,fn,scope) {
		if (a) {
			var j, l= a.length;
			for(var i= 0;i<l;i++) {
				j= a[i];
				if(fn.call(scope||j,j)) { return i }
			}
		}
	},

	collect: function(a,fn,scope) {
		var r= [];
		if (a) {
			a.forEach(function(i){ if (i!==undefined) { r.push(fn.call(scope||i,i)) }})
		}
		return r;
	},
	
	includes: function(a,v) {
		if (a) {
			var l= a.length;
			for(var i= 0;i<l;i++) {
				if(a[i]===v) { return true }
			}
		}
		return false;
	},

	remove: function(a,v) {
		var r= [];
		if (a) {
			var j, l= a.length;
			for(var i= 0;i<l;i++) {
				j= a[i];
				if(j!==v) { r.push(j) }
			}
		}
		return r;
	},

	any: function(a,fn,scope) {
		var j, l= a.length;
		for(var i= 0;i<l;i++) {
			j= a[i];
			if(fn.call(scope||j,j)) { return true }
		}
		return false
	},

	all: function(a,fn,scope) {
		var j, l= a.length;
		for(var i= 0;i<l;i++) {
			var j= a[i];
			if(!fn.call(scope||j,j)) { return false }
		}
		return true
	},
	
	forEachAsync: function(a,each_fn,each_scope,done_fn,done_scope) {
		if (!each_fn) { throw "ERROR - Ext.data.Array - forEachAsync - no 'each' function provided" }
		if (!done_fn) { throw "ERROR - Ext.data.Array - forEachAsync - no 'done' function provided" }
		var i= 0;
		var l= a.length;
		var f= function f() {
			if (i<l) {
				var j= a[i];
				var scope= each_scope||j;
				i= i+1;
				each_fn.call(scope,j,f,scope);
			} else {
				done_fn.call(done_scope);
			}
		};
		f();
	},

	forEachYielding: function(a,each_fn,each_scope,done_fn,done_scope) {
		var i= 0;
		var l= a.length;
		function f() {
			if (i<l) {
				each_fn.call(each_scope,a[i],function(){
					i= i+1;
					setTimeout(f,20); // ms
				},this);
			} else {
				done_fn.call(done_scope);
			}
		};
		f();
	}	
};


