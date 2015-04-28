
Ext.data.CSGenerator = Ext.extend(Ext.data.Config, {

	r: undefined, // replica_number
	t: undefined, // time, in seconds since epoch
	s: undefined, // sequence number
	
	clock: undefined,
	local_offset: undefined,
	global_offset: undefined,
	
	constructor: function(config,callback,scope) {
		Ext.apply(this, config);
		config.config_id= 'generator';
		Ext.data.CSGenerator.superclass.constructor.call(this, config);
		this.clock= this.clock || new Ext.data.Clock();
	  this.t= this.t || this.clock.now();
	  this.s= this.s || -1; // so that the next tick gets us to 0
	  this.local_offset= this.local_offset || 0;
	  this.global_offset= this.global_offset || 0;
		this.writeAndCallback(true,callback,scope);
	},
	
  get: function(callback,scope) { // the next change stamp
    var current_time= this.clock.now();
    this.update_local_offset(current_time);
    this.s+= 1;
    if (this.s>255) { // JCM This is totally arbitrary, and it's hard coded too....
      this.t= current_time;
      this.local_offset+= 1;
      this.s= 0;
    }
		this.writeAndCallback(true,callback,scope);
		// JCM it seems wrong to use the CS until it has been committed to disk...
    return new Ext.data.CS({r:this.r,t:this.global_time(),s:this.s}); // JCM return in the callback 
  },

  seen: function(cs,callback,scope) { // a change stamp we just received
		var changed= false;
    var current_time= this.clock.now();
		if (current_time>this.t) {
	    changed= this.update_local_offset(current_time);
		}
    changed= changed||this.update_global_offset(cs);
		this.writeAndCallback(changed,callback,scope);
  },
  
  setReplicaNumber: function(replica_number,callback,scope) {
		var changed= this.r!==replica_number;
		this.r= replica_number;
		this.writeAndCallback(changed,callback,scope);
  },

	// @private
  
  update_local_offset: function(current_time) {
		var changed= false;
    var delta= current_time-this.t;
    if (delta>0) { // local clock moved forwards
      var local_time= this.global_time();
      this.t= current_time;
      if (delta>this.local_offset) {
        this.local_offset= 0;
      } else {
        this.local_offset-= delta;
      }
      var local_time_after= this.global_time();
			if (local_time_after>local_time) {
      	this.s= -1;
			}
			changed= true;
    } else if (delta<0) { // local clock moved backwards
      // JCM if delta is too big, then complain
      this.t= current_time;
      this.local_offset+= -delta;
			changed= true;
    }
		return changed;
	},
	
	update_global_offset: function(remote_cs) {
		var changed= false;
    var local_cs= new Ext.data.CS({r:this.r,t:this.global_time(),s:this.s+1});
    var local_t= local_cs.t;
    var local_s= local_cs.s;
    var remote_t= remote_cs.t;
    var remote_s= remote_cs.s;
    if (remote_t==local_t && remote_s>=local_s) {
		  this.s= remote_s;
			changed= true;
    } else if (remote_t>local_t) {
      var delta= remote_t-local_t;
  		if (delta>this.global_offset) { // remote clock moved forwards
  		  // JCM guard against moving too far forward
      	this.global_offset+= delta;
    		this.s= remote_s;
				changed= true;
      }
  	}
		return changed; 
  },

  global_time: function() {
    return this.t+this.local_offset+this.global_offset;
	},
	
	as_data: function() {
		var data= {
			r: this.r,
			t: this.t,
			s: this.s,
			local_offset: this.local_offset,
			global_offset: this.global_offset
		};
		data[Ext.data.SyncModel.MODEL]= 'Ext.data.CSGenerator';
		return Ext.data.CSGenerator.superclass.as_data.call(this, data);
	}
});
