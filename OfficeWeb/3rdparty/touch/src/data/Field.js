/**
 * @author Ed Spencer
 * @aside guide models
 *
 * Fields are used to define what a Model is. They aren't instantiated directly - instead, when we create a class that
 * extends {@link Ext.data.Model}, it will automatically create a Field instance for each field configured in a {@link
 * Ext.data.Model Model}. For example, we might set up a model like this:
 *
 *     Ext.define('User', {
 *         extend: 'Ext.data.Model',
 *         config: {
 *             fields: [
 *                 'name', 'email',
 *                 {name: 'age', type: 'int'},
 *                 {name: 'gender', type: 'string', defaultValue: 'Unknown'}
 *             ]
 *         }
 *     });
 *
 * Four fields will have been created for the User Model - name, email, age, and gender. Note that we specified a couple
 * of different formats here; if we only pass in the string name of the field (as with name and email), the field is set
 * up with the 'auto' type. It's as if we'd done this instead:
 *
 *     Ext.define('User', {
 *         extend: 'Ext.data.Model',
 *         config: {
 *             fields: [
 *                 {name: 'name', type: 'auto'},
 *                 {name: 'email', type: 'auto'},
 *                 {name: 'age', type: 'int'},
 *                 {name: 'gender', type: 'string', defaultValue: 'Unknown'}
 *             ]
 *         }
 *     });
 *
 * # Types and conversion
 *
 * The {@link #type} is important - it's used to automatically convert data passed to the field into the correct format.
 * In our example above, the name and email fields used the 'auto' type and will just accept anything that is passed
 * into them. The 'age' field had an 'int' type however, so if we passed 25.4 this would be rounded to 25.
 *
 * Sometimes a simple type isn't enough, or we want to perform some processing when we load a Field's data. We can do
 * this using a {@link #convert} function. Here, we're going to create a new field based on another:
 *
 *     Ext.define('User', {
 *         extend: 'Ext.data.Model',
 *         config: {
 *             fields: [
 *                 'name', 'email',
 *                 {name: 'age', type: 'int'},
 *                 {name: 'gender', type: 'string', defaultValue: 'Unknown'},
 *
 *                 {
 *                     name: 'firstName',
 *                     convert: function(value, record) {
 *                         var fullName  = record.get('name'),
 *                             splits    = fullName.split(" "),
 *                             firstName = splits[0];
 *
 *                         return firstName;
 *                     }
 *                 }
 *             ]
 *         }
 *     });
 *
 * Now when we create a new User, the firstName is populated automatically based on the name:
 *
 *     var ed = Ext.create('User', {name: 'Ed Spencer'});
 *
 *     console.log(ed.get('firstName')); //logs 'Ed', based on our convert function
 *
 * In fact, if we log out all of the data inside ed, we'll see this:
 *
 *     console.log(ed.data);
 *
 *     //outputs this:
 *     {
 *         age: 0,
 *         email: "",
 *         firstName: "Ed",
 *         gender: "Unknown",
 *         name: "Ed Spencer"
 *     }
 *
 * The age field has been given a default of zero because we made it an int type. As an auto field, email has defaulted
 * to an empty string. When we registered the User model we set gender's {@link #defaultValue} to 'Unknown' so we see
 * that now. Let's correct that and satisfy ourselves that the types work as we expect:
 *
 *     ed.set('gender', 'Male');
 *     ed.get('gender'); //returns 'Male'
 *
 *     ed.set('age', 25.4);
 *     ed.get('age'); //returns 25 - we wanted an int, not a float, so no decimal places allowed
 */
Ext.define('Ext.data.Field', {
    requires: ['Ext.data.Types', 'Ext.data.SortTypes'],
    alias: 'data.field',

    isField: true,

    config: {
        /**
         * @cfg {String} name
         *
         * The name by which the field is referenced within the Model. This is referenced by, for example, the `dataIndex`
         * property in column definition objects passed to Ext.grid.property.HeaderContainer.
         *
         * Note: In the simplest case, if no properties other than `name` are required, a field definition may consist of
         * just a String for the field name.
         */
        name: null,

        /**
         * @cfg {String/Object} type
         *
         * The data type for automatic conversion from received data to the *stored* value if
         * `{@link Ext.data.Field#convert convert}` has not been specified. This may be specified as a string value.
         * Possible values are
         *
         * - auto (Default, implies no conversion)
         * - string
         * - int
         * - float
         * - boolean
         * - date
         *
         * This may also be specified by referencing a member of the {@link Ext.data.Types} class.
         *
         * Developers may create their own application-specific data types by defining new members of the {@link
         * Ext.data.Types} class.
         */
        type: 'auto',

        /**
         * @cfg {Function} convert
         *
         * A function which converts the value provided by the Reader into an object that will be stored in the Model.
         * It is passed the following parameters:
         *
         * - **v** : Mixed
         *
         *   The data value as read by the Reader, if undefined will use the configured `{@link Ext.data.Field#defaultValue
         *   defaultValue}`.
         *
         * - **rec** : Ext.data.Model
         *
         *   The data object containing the Model as read so far by the Reader. Note that the Model may not be fully populated
         *   at this point as the fields are read in the order that they are defined in your
         *   {@link Ext.data.Model#cfg-fields fields} array.
         *
         * Example of convert functions:
         *
         *     function fullName(v, record) {
         *         return record.name.last + ', ' + record.name.first;
         *     }
         *
         *     function location(v, record) {
         *         return !record.city ? '' : (record.city + ', ' + record.state);
         *     }
         *
         *     Ext.define('Dude', {
         *         extend: 'Ext.data.Model',
         *         fields: [
         *             {name: 'fullname',  convert: fullName},
         *             {name: 'firstname', mapping: 'name.first'},
         *             {name: 'lastname',  mapping: 'name.last'},
         *             {name: 'city', defaultValue: 'homeless'},
         *             'state',
         *             {name: 'location',  convert: location}
         *         ]
         *     });
         *
         *     // create the data store
         *     var store = Ext.create('Ext.data.Store', {
         *         reader: {
         *             type: 'json',
         *             model: 'Dude',
         *             idProperty: 'key',
         *             rootProperty: 'daRoot',
         *             totalProperty: 'total'
         *         }
         *     });
         *
         *     var myData = [
         *         { key: 1,
         *           name: { first: 'Fat',    last:  'Albert' }
         *           // notice no city, state provided in data2 object
         *         },
         *         { key: 2,
         *           name: { first: 'Barney', last:  'Rubble' },
         *           city: 'Bedrock', state: 'Stoneridge'
         *         },
         *         { key: 3,
         *           name: { first: 'Cliff',  last:  'Claven' },
         *           city: 'Boston',  state: 'MA'
         *         }
         *     ];
         */
        convert: undefined,

        /**
         * @cfg {String} dateFormat
         *
         * Used when converting received data into a Date when the {@link #type} is specified as `"date"`.
         *
         * A format string for the {@link Ext.Date#parse Ext.Date.parse} function, or "timestamp" if the value provided by
         * the Reader is a UNIX timestamp, or "time" if the value provided by the Reader is a JavaScript millisecond
         * timestamp. See {@link Ext.Date}.
         */
        dateFormat: null,

        /**
         * @cfg {Boolean} allowNull
         *
         * Use when converting received data into a boolean, string or number type (either int or float). If the value cannot be
         * parsed, `null` will be used if `allowNull` is `true`, otherwise the value will be 0.
         */
        allowNull: true,

        /**
         * @cfg {Object} [defaultValue='']
         *
         * The default value used **when a Model is being created by a {@link Ext.data.reader.Reader Reader}**
         * when the item referenced by the `{@link Ext.data.Field#mapping mapping}` does not exist in the data object
         * (i.e. `undefined`).
         */
        defaultValue: undefined,

        /**
         * @cfg {String/Number} mapping
         *
         * (Optional) A path expression for use by the {@link Ext.data.reader.Reader} implementation that is creating the
         * {@link Ext.data.Model Model} to extract the Field value from the data object. If the path expression is the same
         * as the field name, the mapping may be omitted.
         *
         * The form of the mapping expression depends on the Reader being used.
         *
         * - {@link Ext.data.reader.Json}
         *
         *   The mapping is a string containing the JavaScript expression to reference the data from an element of the data2
         *   item's {@link Ext.data.reader.Json#rootProperty rootProperty} Array. Defaults to the field name.
         *
         * - {@link Ext.data.reader.Xml}
         *
         *   The mapping is an {@link Ext.DomQuery} path to the data item relative to the DOM element that represents the
         *   {@link Ext.data.reader.Xml#record record}. Defaults to the field name.
         *
         * - {@link Ext.data.reader.Array}
         *
         *   The mapping is a number indicating the Array index of the field's value. Defaults to the field specification's
         *   Array position.
         *
         * If a more complex value extraction strategy is required, then configure the Field with a {@link #convert}
         * function. This is passed the whole row object, and may interrogate it in whatever way is necessary in order to
         * return the desired data.
         */
        mapping: null,

        /**
         * @cfg {Function} sortType
         *
         * A function which converts a Field's value to a comparable value in order to ensure correct sort ordering.
         * Predefined functions are provided in {@link Ext.data.SortTypes}. A custom sort example:
         *
         *     // current sort     after sort we want
         *     // +-+------+          +-+------+
         *     // |1|First |          |1|First |
         *     // |2|Last  |          |3|Second|
         *     // |3|Second|          |2|Last  |
         *     // +-+------+          +-+------+
         *
         *     sortType: function(value) {
         *        switch (value.toLowerCase()) // native toLowerCase():
         *        {
         *           case 'first': return 1;
         *           case 'second': return 2;
         *           default: return 3;
         *        }
         *     }
         */
        sortType : undefined,

        /**
         * @cfg {String} sortDir
         *
         * Initial direction to sort (`"ASC"` or `"DESC"`).
         */
        sortDir : "ASC",

        /**
         * @cfg {Boolean} allowBlank
         * @private
         *
         * Used for validating a {@link Ext.data.Model model}. An empty value here will cause
         * {@link Ext.data.Model}.{@link Ext.data.Model#isValid isValid} to evaluate to `false`.
         */
        allowBlank : true,

        /**
         * @cfg {Boolean} persist
         *
         * `false` to exclude this field from being synchronized with the server or localStorage.
         * This option is useful when model fields are used to keep state on the client but do
         * not need to be persisted to the server.
         */
        persist: true,

        // Used in LocalStorage stuff
        encode: null,
        decode: null,

        bubbleEvents: 'action'
    },

    constructor : function(config) {
        // This adds support for just passing a string used as the field name
        if (Ext.isString(config)) {
            config = {name: config};
        }

        this.initConfig(config);
    },

    applyType: function(type) {
        var types = Ext.data.Types,
            autoType = types.AUTO;

        if (type) {
            if (Ext.isString(type)) {
                return types[type.toUpperCase()] || autoType;
            } else {
                // At this point we expect an actual type
                return type;
            }
        }

        return autoType;
    },

    updateType: function(newType, oldType) {
        var convert = this.getConvert();
        if (oldType && convert === oldType.convert) {
            this.setConvert(newType.convert);
        }
    },

    applySortType: function(sortType) {
        var sortTypes = Ext.data.SortTypes,
            type = this.getType(),
            defaultSortType = type.sortType;

        if (sortType) {
            if (Ext.isString(sortType)) {
                return sortTypes[sortType] || defaultSortType;
            } else {
                // At this point we expect a function
                return sortType;
            }
        }

        return defaultSortType;
    },

    applyConvert: function(convert) {
        var defaultConvert = this.getType().convert;
        if (convert && convert !== defaultConvert) {
            this._hasCustomConvert = true;
            return convert;
        } else {
            this._hasCustomConvert = false;
            return defaultConvert;
        }
    },

    hasCustomConvert: function() {
        return this._hasCustomConvert;
    }

    // <deprecated product=touch since=2.0>
}, function() {
    /**
     * @member Ext.data.Field
     * @cfg {Boolean} useNull
     * @inheritdoc Ext.data.Field#allowNull
     * @deprecated 2.0.0 Please use {@link #allowNull} instead.
     */
    Ext.deprecateProperty(this, 'useNull', 'allowNull');
    // </deprecated>
});
