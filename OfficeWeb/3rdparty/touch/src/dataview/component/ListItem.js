/**
 * A DataItem is a container for {@link Ext.dataview.DataView} with useComponents: true. It ties together
 * {@link Ext.data.Model records} to its contained Components via a {@link #dataMap dataMap} configuration.
 *
 * For example, lets say you have a `text` configuration which, when applied, gets turned into an instance of an
 * Ext.Component. We want to update the {@link #html} of a sub-component when the 'text' field of the record gets
 * changed.
 *
 * As you can see below, it is simply a matter of setting the key of the object to be the getter of the config
 * (`getText`), and then give that property a value of an object, which then has 'setHtml' (the `html` setter) as the key,
 * and 'text' (the field name) as the value. You can continue this for a as many sub-components as you wish.
 *
 *     dataMap: {
 *         // When the record is updated, get the text configuration, and
 *         // call {@link #setHtml} with the 'text' field of the record.
 *         getText: {
 *             setHtml: 'text'
 *         },
 *
 *         // When the record is updated, get the userName configuration, and
 *         // call {@link #setHtml} with the 'from_user' field of the record.
 *         getUserName: {
 *             setHtml: 'from_user'
 *         },
 *
 *         // When the record is updated, get the avatar configuration, and
 *         // call `setSrc` with the 'profile_image_url' field of the record.
 *         getAvatar: {
 *             setSrc: 'profile_image_url'
 *         }
 *     }
 */
Ext.define('Ext.dataview.component.ListItem', {
    extend: 'Ext.dataview.component.DataItem',
    xtype : 'listitem',

    config: {
        baseCls: Ext.baseCSSPrefix + 'list-item',

        dataMap: null,

        body: {
            xtype: 'component',
            cls: 'x-list-item-body'
        },

        disclosure: {
            xtype: 'component',
            cls: 'x-list-disclosure',
            hidden: true,
            docked: 'right'
        },

        header: {
            xtype: 'component',
            cls: 'x-list-header',
            html: ' ',
            hidden: true
        },

        tpl: null,
        items: null
    },

    applyBody: function(body) {
        if (body && !body.isComponent) {
            body = Ext.factory(body, Ext.Component, this.getBody());
        }
        return body;
    },

    updateBody: function(body, oldBody) {
        if (body) {
            this.add(body);
        } else if (oldBody) {
            oldBody.destroy();
        }
    },

    applyHeader: function(header) {
        if (header && !header.isComponent) {
            header = Ext.factory(header, Ext.Component, this.getHeader());
        }
        return header;
    },

    updateHeader: function(header, oldHeader) {
        if (header) {
            this.element.getFirstChild().insertFirst(header.element);
        } else if (oldHeader) {
            oldHeader.destroy();
        }
    },

    applyDisclosure: function(disclosure) {
        if (disclosure && !disclosure.isComponent) {
            disclosure = Ext.factory(disclosure, Ext.Component, this.getDisclosure());
        }
        return disclosure;
    },

    updateDisclosure: function(disclosure, oldDisclosure) {
        if (disclosure) {
            this.add(disclosure);
        } else if (oldDisclosure) {
            oldDisclosure.destroy();
        }
    },

    updateTpl: function(tpl) {
        this.getBody().setTpl(tpl);
    },

    updateRecord: function(record) {
        var me = this,
            dataview = me.dataview || this.getDataview(),
            data = record && dataview.prepareData(record.getData(true), dataview.getStore().indexOf(record), record),
            dataMap = me.getDataMap(),
            body = this.getBody(),
            disclosure = this.getDisclosure();

        me._record = record;

        if (dataMap) {
            me.doMapData(dataMap, data, body);
        } else if (body) {
            body.updateData(data || null);
        }

        if (disclosure && record && dataview.getOnItemDisclosure()) {
            var disclosureProperty = dataview.getDisclosureProperty();
            disclosure[(data.hasOwnProperty(disclosureProperty) && data[disclosureProperty] === false) ? 'hide' : 'show']();
        }

        /**
         * @event updatedata
         * Fires whenever the data of the DataItem is updated.
         * @param {Ext.dataview.component.DataItem} this The DataItem instance.
         * @param {Object} newData The new data.
         */
        me.fireEvent('updatedata', me, data);
    }
});
