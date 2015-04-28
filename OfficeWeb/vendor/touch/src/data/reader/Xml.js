/**
 * @author Ed Spencer
 * @class Ext.data.reader.Xml
 * @extends Ext.data.reader.Reader
 *
 * The XML Reader is used by a Proxy to read a server response that is sent back in XML format. This usually
 * happens as a result of loading a Store - for example we might create something like this:
 *
 *     Ext.define('User', {
 *         extend: 'Ext.data.Model',
 *         config: {
 *             fields: ['id', 'name', 'email']
 *         }
 *     });
 *
 *     var store = Ext.create('Ext.data.Store', {
 *         model: 'User',
 *         proxy: {
 *             type: 'ajax',
 *             url : 'users.xml',
 *             reader: {
 *                 type: 'xml',
 *                 record: 'user'
 *             }
 *         }
 *     });
 *
 * The example above creates a 'User' model. Models are explained in the {@link Ext.data.Model Model} docs if you're
 * not already familiar with them.
 *
 * We created the simplest type of XML Reader possible by simply telling our {@link Ext.data.Store Store}'s
 * {@link Ext.data.proxy.Proxy Proxy} that we want a XML Reader. The Store automatically passes the configured model to the
 * Store, so it is as if we passed this instead:
 *
 *     reader: {
 *         type : 'xml',
 *         model: 'User',
 *         record: 'user'
 *     }
 *
 * The reader we set up is ready to read data from our server - at the moment it will accept a response like this:
 *
 *     <?xml version="1.0" encoding="UTF-8"?>
 *     <user>
 *         <id>1</id>
 *         <name>Ed Spencer</name>
 *         <email>ed@sencha.com</email>
 *     </user>
 *     <user>
 *         <id>2</id>
 *         <name>Abe Elias</name>
 *         <email>abe@sencha.com</email>
 *     </user>
 *
 * The XML Reader uses the configured {@link #record} option to pull out the data for each record - in this case we
 * set record to 'user', so each `<user>` above will be converted into a User model.
 *
 * ## Reading other XML formats
 *
 * If you already have your XML format defined and it doesn't look quite like what we have above, you can usually
 * pass XmlReader a couple of configuration options to make it parse your format. For example, we can use the
 * {@link #rootProperty} configuration to parse data that comes back like this:
 *
 *     <?xml version="1.0" encoding="UTF-8"?>
 *     <users>
 *         <user>
 *             <id>1</id>
 *             <name>Ed Spencer</name>
 *             <email>ed@sencha.com</email>
 *         </user>
 *         <user>
 *             <id>2</id>
 *             <name>Abe Elias</name>
 *             <email>abe@sencha.com</email>
 *         </user>
 *     </users>
 *
 * To parse this we just pass in a {@link #rootProperty} configuration that matches the 'users' above:
 *
 *     reader: {
 *         type: 'xml',
 *         record: 'user',
 *         rootProperty: 'users'
 *     }
 *
 * Note that XmlReader doesn't care whether your {@link #rootProperty} and {@link #record} elements are nested deep
 * inside a larger structure, so a response like this will still work:
 *
 *     <?xml version="1.0" encoding="UTF-8"?>
 *     <deeply>
 *         <nested>
 *             <xml>
 *                 <users>
 *                     <user>
 *                         <id>1</id>
 *                         <name>Ed Spencer</name>
 *                         <email>ed@sencha.com</email>
 *                     </user>
 *                     <user>
 *                         <id>2</id>
 *                         <name>Abe Elias</name>
 *                         <email>abe@sencha.com</email>
 *                     </user>
 *                 </users>
 *             </xml>
 *         </nested>
 *     </deeply>
 *
 * ## Response metadata
 *
 * The server can return additional data in its response, such as the {@link #totalProperty total number of records}
 * and the {@link #successProperty success status of the response}. These are typically included in the XML response
 * like this:
 *
 *     <?xml version="1.0" encoding="UTF-8"?>
 *     <total>100</total>
 *     <success>true</success>
 *     <users>
 *         <user>
 *             <id>1</id>
 *             <name>Ed Spencer</name>
 *             <email>ed@sencha.com</email>
 *         </user>
 *         <user>
 *             <id>2</id>
 *             <name>Abe Elias</name>
 *             <email>abe@sencha.com</email>
 *         </user>
 *     </users>
 *
 * If these properties are present in the XML response they can be parsed out by the XmlReader and used by the
 * Store that loaded it. We can set up the names of these properties by specifying a final pair of configuration
 * options:
 *
 *     reader: {
 *         type: 'xml',
 *         rootProperty: 'users',
 *         totalProperty  : 'total',
 *         successProperty: 'success'
 *     }
 *
 * These final options are not necessary to make the Reader work, but can be useful when the server needs to report
 * an error or if it needs to indicate that there is a lot of data available of which only a subset is currently being
 * returned.
 *
 * ## Response format
 *
 * __Note:__ In order for the browser to parse a returned XML document, the Content-Type header in the HTTP
 * response must be set to "text/xml" or "application/xml". This is very important - the XmlReader will not
 * work correctly otherwise.
 */
Ext.define('Ext.data.reader.Xml', {
    extend: 'Ext.data.reader.Reader',
    alternateClassName: 'Ext.data.XmlReader',
    alias : 'reader.xml',

    config: {
        /**
         * @cfg {String} record The DomQuery path to the repeated element which contains record information.
         */
        record: null
    },

    /**
     * @private
     * Creates a function to return some particular key of data from a response. The {@link #totalProperty} and
     * {@link #successProperty} are treated as special cases for type casting, everything else is just a simple selector.
     * @param {String} expr
     * @return {Function}
     */
    createAccessor: function(expr) {
        var me = this;

        if (Ext.isEmpty(expr)) {
            return Ext.emptyFn;
        }

        if (Ext.isFunction(expr)) {
            return expr;
        }

        return function(root) {
            return me.getNodeValue(Ext.DomQuery.selectNode(expr, root));
        };
    },

    getNodeValue: function(node) {
        if (node && node.firstChild) {
            return node.firstChild.nodeValue;
        }
        return undefined;
    },

    //inherit docs
    getResponseData: function(response) {
        // Check to see if the response is already an xml node.
        if (response.nodeType === 1 || response.nodeType === 9) {
            return response;
        }

        var xml = response.responseXML;

        //<debug>
        if (!xml) {
            /**
             * @event exception Fires whenever the reader is unable to parse a response.
             * @param {Ext.data.reader.Xml} reader A reference to this reader.
             * @param {XMLHttpRequest} response The XMLHttpRequest response object.
             * @param {String} error The error message.
             */
            this.fireEvent('exception', this, response, 'XML data not found in the response');

            Ext.Logger.warn('XML data not found in the response');
        }
        //</debug>

        return xml;
    },

    /**
     * Normalizes the data object.
     * @param {Object} data The raw data object.
     * @return {Object} Returns the `documentElement` property of the data object if present, or the same object if not.
     */
    getData: function(data) {
        return data.documentElement || data;
    },

    /**
     * @private
     * Given an XML object, returns the Element that represents the root as configured by the Reader's meta data.
     * @param {Object} data The XML data object.
     * @return {XMLElement} The root node element.
     */
    getRoot: function(data) {
        var nodeName = data.nodeName,
            root     = this.getRootProperty();

        if (!root || (nodeName && nodeName == root)) {
            return data;
        } else if (Ext.DomQuery.isXml(data)) {
            // This fix ensures we have XML data
            // Related to TreeStore calling getRoot with the root node, which isn't XML
            // Probably should be resolved in TreeStore at some point
            return Ext.DomQuery.selectNode(root, data);
        }
    },

    /**
     * @private
     * We're just preparing the data for the superclass by pulling out the record nodes we want.
     * @param {XMLElement} root The XML root node.
     * @return {Ext.data.Model[]} The records.
     */
    extractData: function(root) {
        var recordName = this.getRecord();

        //<debug>
        if (!recordName) {
            Ext.Logger.error('Record is a required parameter');
        }
        //</debug>

        if (recordName != root.nodeName && recordName !== root.localName) {
            root = Ext.DomQuery.select(recordName, root);
        } else {
            root = [root];
        }
        return this.callParent([root]);
    },

    /**
     * @private
     * See {@link Ext.data.reader.Reader#getAssociatedDataRoot} docs.
     * @param {Object} data The raw data object.
     * @param {String} associationName The name of the association to get data for (uses {@link Ext.data.association.Association#associationKey} if present).
     * @return {XMLElement} The root.
     */
    getAssociatedDataRoot: function(data, associationName) {
        return Ext.DomQuery.select(associationName, data)[0];
    },

    /**
     * Parses an XML document and returns a ResultSet containing the model instances.
     * @param {Object} doc Parsed XML document.
     * @return {Ext.data.ResultSet} The parsed result set.
     */
    readRecords: function(doc) {
        //it's possible that we get passed an array here by associations. Make sure we strip that out (see Ext.data.reader.Reader#readAssociated)
        if (Ext.isArray(doc)) {
            doc = doc[0];
        }
        return this.callParent([doc]);
    },

    /**
     * @private
     * Returns an accessor expression for the passed Field from an XML element using either the Field's mapping, or
     * its ordinal position in the fields collection as the index.
     *
     * This is used by `buildExtractors` to create optimized on extractor function which converts raw data into model instances.
     */
    createFieldAccessExpression: function(field, fieldVarName, dataName) {
        var selector = field.getMapping() || field.getName(),
            result;

        if (typeof selector === 'function') {
            result = fieldVarName + '.getMapping()(' + dataName + ', this)';
        } else {
            selector = selector.split('@');

            if (selector.length === 2 && selector[0]) {
                result = 'me.getNodeValue(Ext.DomQuery.selectNode("@' + selector[1] + '", Ext.DomQuery.selectNode("' + selector[0] + '", ' + dataName + ')))';
            } else if (selector.length === 2) {
                result = 'me.getNodeValue(Ext.DomQuery.selectNode("@' + selector[1] + '", ' + dataName + '))';
            } else if (selector.length === 1) {
                result = 'me.getNodeValue(Ext.DomQuery.selectNode("' + selector[0] + '", ' + dataName + '))';
            } else {
                throw "Unsupported query - too many queries for attributes in " + selector.join('@');
            }
        }
        return result;
    }
});
