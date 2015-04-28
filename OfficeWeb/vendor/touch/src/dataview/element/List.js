/**
 * @private
*/
Ext.define('Ext.dataview.element.List', {
    extend: 'Ext.dataview.element.Container',

    updateBaseCls: function(newBaseCls) {
        var me = this;

        me.itemClsShortCache = newBaseCls + '-item';

        me.headerClsShortCache = newBaseCls + '-header';
        me.headerClsCache = '.' + me.headerClsShortCache;

        me.headerItemClsShortCache = newBaseCls + '-header-item';

        me.footerClsShortCache = newBaseCls + '-footer-item';
        me.footerClsCache = '.' + me.footerClsShortCache;

        me.labelClsShortCache = newBaseCls + '-item-label';
        me.labelClsCache = '.' + me.labelClsShortCache;

        me.disclosureClsShortCache = newBaseCls + '-disclosure';
        me.disclosureClsCache = '.' + me.disclosureClsShortCache;

        me.iconClsShortCache = newBaseCls + '-icon';
        me.iconClsCache = '.' + me.iconClsShortCache;

        this.callParent(arguments);
    },

    hiddenDisplayCache: Ext.baseCSSPrefix + 'hidden-display',

    getItemElementConfig: function(index, data) {
        var me = this,
            dataview = me.dataview,
            itemCls = dataview.getItemCls(),
            cls = me.itemClsShortCache,
            config, iconSrc;

        if (itemCls) {
            cls += ' ' + itemCls;
        }

        config = {
            cls: cls,
            children: [{
                cls: me.labelClsShortCache,
                html: dataview.getItemTpl().apply(data)
            }]
        };

        if (dataview.getIcon()) {
            iconSrc = data.iconSrc;
            config.children.push({
                cls: me.iconClsShortCache,
                style: 'background-image: ' + iconSrc ? 'url("' + newSrc + '")' : ''
            });
        }

        if (dataview.getOnItemDisclosure()) {
            config.children.push({
                cls: me.disclosureClsShortCache + ' ' + ((data[dataview.getDisclosureProperty()] === false) ? me.hiddenDisplayCache : '')
            });
        }
        return config;
    },

    updateListItem: function(record, item) {
        var me = this,
            dataview = me.dataview,
            extItem = Ext.fly(item),
            innerItem = extItem.down(me.labelClsCache, true),
            data = dataview.prepareData(record.getData(true), dataview.getStore().indexOf(record), record),
            disclosureProperty = dataview.getDisclosureProperty(),
            hasDisclosureProperty = data && data.hasOwnProperty(disclosureProperty),
            iconSrc = data && data.hasOwnProperty('iconSrc'),
            disclosureEl, iconEl;

        innerItem.innerHTML = dataview.getItemTpl().apply(data);

        if (hasDisclosureProperty) {
            disclosureEl = extItem.down(me.disclosureClsCache);
            disclosureEl[data[disclosureProperty] === false ? 'addCls' : 'removeCls'](me.hiddenDisplayCache);
        }

        if (dataview.getIcon()) {
            iconEl = extItem.down(me.iconClsCache, true);
            iconEl.style.backgroundImage = iconSrc ? 'url("' + iconSrc + '")' : '';
        }
    },

    doRemoveHeaders: function() {
        var me = this,
            headerClsShortCache = me.headerItemClsShortCache,
            existingHeaders = me.element.query(me.headerClsCache),
            existingHeadersLn = existingHeaders.length,
            i = 0,
            item;

        for (; i < existingHeadersLn; i++) {
            item = existingHeaders[i];
            Ext.fly(item.parentNode).removeCls(headerClsShortCache);
            Ext.get(item).destroy();
        }
    },

    doRemoveFooterCls: function() {
        var me = this,
            footerClsShortCache = me.footerClsShortCache,
            existingFooters = me.element.query(me.footerClsCache),
            existingFootersLn = existingFooters.length,
            i = 0;

        for (; i < existingFootersLn; i++) {
            Ext.fly(existingFooters[i]).removeCls(footerClsShortCache);
        }
    },

    doAddHeader: function(item, html) {
        item = Ext.fly(item);
        if (html) {
            item.insertFirst(Ext.Element.create({
                cls: this.headerClsShortCache,
                html: html
            }));
        }
        item.addCls(this.headerItemClsShortCache);
    },

    destroy: function() {
        this.doRemoveHeaders();
        this.callParent();
    }
});
