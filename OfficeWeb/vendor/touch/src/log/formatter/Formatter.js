//<feature logger>
Ext.define('Ext.log.formatter.Formatter', {
    extend: 'Ext.log.Base',

    config: {
        messageFormat: "{message}"
    },

    format: function(event) {
        return this.substitute(this.getMessageFormat(), event);
    },

    substitute: function(template, data) {
        var name, value;

        for (name in data) {
            if (data.hasOwnProperty(name)) {
                value = data[name];

                template = template.replace(new RegExp("\\{" + name + "\\}", "g"), value);
            }
        }

        return template;
    }
});
//</feature>
