/**
 * @private
 */
Ext.define('Ext.device.contacts.Sencha', {
    extend: 'Ext.device.contacts.Abstract',

    getContacts: function(config) {
        var includeImages = this.getIncludeImages();
        if (typeof config.includeImages != "undefined") {
            includeImages = config.includeImages;
        }

        if (!config) {
            Ext.Logger.warn('Ext.device.Contacts#getContacts: You must specify a `config` object.');
            return false;
        }

        if (!config.success) {
            Ext.Logger.warn('Ext.device.Contacts#getContacts: You must specify a `success` method.');
            return false;
        }

        Ext.device.Communicator.send({
            command: 'Contacts#all',
            callbacks: {
                success: function(contacts) {
                    config.success.call(config.scope || this, contacts);
                },
                failure: function() {
                    if (config.failure) {
                        config.failure.call(config.scope || this);
                    }
                }
            },
            includeImages: includeImages,
            scope: this
        });
    },

    getThumbnail: function(config) {
        if (!config || typeof config.id == "undefined") {
            Ext.Logger.warn('Ext.device.Contacts#getThumbnail: You must specify an `id` of the contact.');
            return false;
        }

        if (!config || !config.callback) {
            Ext.Logger.warn('Ext.device.Contacts#getThumbnail: You must specify a `callback`.');
            return false;
        }

        Ext.device.Communicator.send({
            command: 'Contacts#getThumbnail',
            callbacks: {
                success: function(src) {
                    this.set('thumbnail', src);

                    if (config.callback) {
                        config.callback.call(config.scope || this, this);
                    }
                }
            },
            id: id,
            scope: this
        });
    },

    getLocalizedLabel: function(config) {
        if (!config || typeof config.label == "undefined") {
            Ext.Logger.warn('Ext.device.Contacts#getLocalizedLabel: You must specify an `label` to be localized.');
            return false;
        }

        if (!config || !config.callback) {
            Ext.Logger.warn('Ext.device.Contacts#getLocalizedLabel: You must specify a `callback`.');
            return false;
        }

        Ext.device.Communicator.send({
            command: 'Contacts#getLocalizedLabel',
            callbacks: {
                callback: function(label) {
                    config.callback.call(config.scope || this, label, config.label);
                }
            },
            label: config.label,
            scope: this
        });
    }
});
