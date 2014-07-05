
Ext.data.DatabaseDefinition = Ext.extend(Ext.data.Config, {

	key: undefined, // the developer's api key
	database_name: undefined,
	generation: undefined, // of the database
	system_name: undefined, // this system
	system_names: {}, // other systems
	replica_number: undefined,
	idProperty: undefined,
	idPropertyDefaultValue: undefined,
	version: 1, // of the storage scheme
	
	// JCM include the epoch of the clock here?
	
	constructor: function(config,callback,scope) {
		//
		Ext.data.utilities.check('DatabaseDefinition', 'constructor', 'config', config, ['key','database_name','generation','system_name','replica_number']);
		//
		this.set(config);
		config.config_id= 'definition';
		Ext.data.DatabaseDefinition.superclass.constructor.call(this, config);
	},

	setReplicaNumber: function(replica_number,callback,scope) {
		var changed= (this.replica_number!=replica_number); 
		this.replica_number= replica_number;
		this.writeAndCallback(changed,callback,scope);
	},
	
	addSystemName: function(system_name) {
		this.system_names[system_name]= true;
		// JCM this.writeAndCallback(changed,callback,scope);
	},
	
	isKnownOf: function(system_name) {
		return this.system_name===system_name || Ext.data.array.includes(this.system_names,system_name);
	},

	set: function(config,callback,scope) {
		var changed= Ext.data.utilities.copy(config,this,[
			'key',
			'database_name',
			'generation',
			'system_name',
			'system_names',
			'replica_number',
			'idProperty',
			'idPropertyDefaultValue',
			'version',
			'_id']);
		this.writeAndCallback(changed,callback,scope);
	},

	as_data: function() { // to store on the disk
		var data= {
			key: this.key,
			database_name: this.database_name,
			generation: this.generation,
			system_name: this.system_name,
			system_names: this.system_names,
			replica_number: this.replica_number,
			idProperty: this.idProperty,
			idPropertyDefaultValue: this.idPropertyDefaultValue,
			version: this.version
		};
		data[Ext.data.SyncModel.MODEL]= 'Ext.data.DatabaseDefinition';
		return Ext.data.DatabaseDefinition.superclass.as_data.call(this, data);
	},

	encode: function() { // to send over the wire
		return {
			key: this.key,
			database_name: this.database_name,
			generation: this.generation,
			system_name: this.system_name,
			replica_number: this.replica_number,
			idProperty: this.idProperty,
			idPropertyDefaultValue: this.idPropertyDefaultValue
		};
	}

	// JCM perhaps an explicit decode would be better than the constructor?

});
