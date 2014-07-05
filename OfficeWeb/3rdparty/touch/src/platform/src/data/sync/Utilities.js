
Ext.data.utilities= {

	delegate: function(from_instance, to_instance, methods) {
		if (to_instance===undefined) { throw "Error - Tried to delegate '"+methods+"' to undefined instance."; }
		methods.forEach(function(method){
			var to_method= to_instance[method];
			if (to_method===undefined) { throw "Error - Tried to delegate undefined method '"+method+"' to "+to_instance; }
			from_instance[method]= function() {
				return to_method.apply(to_instance, arguments);
			};
		});
	},
	
	apply: function(instance,methods,a,done_callback,done_scope) {
		var first= true;
		Ext.data.array.forEachAsync(methods,function(method,next_callback,next_scope){
			if (first) {
				a.push(next_callback);
				a.push(next_scope);
				first= false;
			}
			instance[method].apply(instance,a);
		},instance,done_callback,done_scope);
	},

	copy: function(from_instance,to_instance,properties) {
		var changed= false;
		properties.forEach(function(property){
			var from_v= from_instance[property];
			var to_v= to_instance[property];
			if (from_v!==undefined && from_v!==to_v) {
				to_instance[property]= from_v;
				changed= true;
			}
		});
		return changed;
	},

	copyIfUndefined: function(from_instance,to_instance,properties) {
		var changed= false;
		properties.forEach(function(property){
			var from_v= from_instance[property];
			var to_v= to_instance[property];
			if (from_v!==undefined && to_v===undefined) {
				to_instance[property]= from_v;
				changed= true;
			}
		});
		return changed;
	},

	check: function(class_name, method_name, instance_name, instance, properties) {
		if (instance===undefined) {
			var message= "Error - "+class_name+"."+method_name+" - "+instance_name+" not provided.";
			console.log(message);
			throw message;
		} else {
			properties.forEach(function(property) {
				var value= instance[property];
				if (value===undefined) {
					var message= "Error - "+class_name+"."+method_name+" - "+instance_name+"."+property+" not provided.";
					console.log(message);
					throw message;
				}
			});
		}
	},

	minus: function(a,b) { // minus(a,b) is all the name value pairs in a that are not in b 
		var n, r= {};
		for(n in a) {
			if (a.hasOwnProperty(n)) {
				if (b[n]===undefined) {
					r[n]= a[n];
				}
			}
		}
		return r;
	},
	
	intersection: function(a,b) { 
		var n, r= {};
		for(n in a) {
			if (a.hasOwnProperty(n)) {
				if (b[n]!==undefined) {
					r[n]= a[n];
				}
			}
		}
		return r;
	}	
};

