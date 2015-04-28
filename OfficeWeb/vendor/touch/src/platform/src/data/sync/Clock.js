
Ext.data.Clock = Ext.extend(Object, {
	
	constructor: function() {
		this.epoch= new Date(2011,0,1);
	},
	
  now: function() {
		return this.ms_to_s(new Date().getTime()-this.epoch);	
	},
	
	ms_to_s: function(ms) {
		return Math.floor(ms/1000);
	}
 
});