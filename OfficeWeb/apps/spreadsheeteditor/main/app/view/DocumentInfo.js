/*
 * (c) Copyright Ascensio System SIA 2010-2014
 *
 * This program is a free software product. You can redistribute it and/or 
 * modify it under the terms of the GNU Affero General Public License (AGPL) 
 * version 3 as published by the Free Software Foundation. In accordance with 
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect 
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied 
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For 
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under 
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */
 Ext.define("SSE.view.DocumentInfo", {
    extend: "Ext.container.Container",
    alias: "widget.ssedocumentinfo",
    cls: "sse-documentinfo-body",
    autoScroll: true,
    requires: ["Ext.button.Button", "Ext.container.Container", "Common.plugin.ScrollPane", "Ext.form.Label", "Ext.XTemplate", "Ext.Date"],
    uses: ["Common.view.DocumentAccessDialog"],
    listeners: {
        afterrender: function (cmp, eOpts) {
            cmp.updateInfo(cmp.doc);
        }
    },
    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    initComponent: function () {
        this.infoObj = {
            PageCount: 0,
            WordsCount: 0,
            ParagraphCount: 0,
            SymbolsCount: 0,
            SymbolsWSCount: 0
        };
        this.inProgress = false;
        this.lblTitle = Ext.create("Ext.form.Label", {
            text: "-",
            height: 14
        });
        this.lblPlacement = Ext.create("Ext.form.Label", {
            text: "-",
            width: 150,
            height: 14,
            style: "text-align:left",
            hideId: "element-to-hide"
        });
        this.lblDate = Ext.create("Ext.form.Label", {
            text: "-",
            width: 150,
            height: 14,
            style: "text-align:left",
            hideId: "element-to-hide"
        });
        var userTpl = Ext.create("Ext.XTemplate", '<span class="userLink">{text:htmlEncode}</span>');
        this.cntAuthor = Ext.create("Ext.container.Container", {
            tpl: userTpl,
            data: {
                text: "-"
            },
            hideId: "element-to-hide"
        });
        var rightsTpl = Ext.create("Ext.XTemplate", "<table>", '<tpl for=".">', "<tr>", '<td style="padding: 0 20px 5px 0;"><span class="userLink">{user:htmlEncode}</span></td>', '<td style="padding: 0 20px 5px 0;">{permissions:htmlEncode}</td>', "</tr>", "</tpl>", "</table>");
        this.cntRights = Ext.create("Ext.container.Container", {
            tpl: rightsTpl,
            hideId: "element-to-hide"
        });
        this.items = [{
            xtype: "tbspacer",
            height: 30
        },
        {
            xtype: "container",
            layout: {
                type: "table",
                columns: 2,
                tableAttrs: {
                    style: "width: 100%;"
                },
                tdAttrs: {
                    style: "padding: 5px 10px;vertical-align: top;"
                }
            },
            items: [{
                xtype: "label",
                cellCls: "doc-info-label-cell",
                text: this.txtTitle,
                style: "display: block;text-align: right;",
                width: "100%"
            },
            this.lblTitle, {
                xtype: "label",
                cellCls: "doc-info-label-cell",
                text: this.txtAuthor,
                style: "display: block;text-align: right;",
                width: "100%"
            },
            this.cntAuthor, {
                xtype: "label",
                cellCls: "doc-info-label-cell",
                text: this.txtPlacement,
                style: "display: block;text-align: right;",
                width: "100%"
            },
            this.lblPlacement, {
                xtype: "label",
                cellCls: "doc-info-label-cell",
                text: this.txtDate,
                style: "display: block;text-align: right;",
                width: "100%"
            },
            this.lblDate, {
                xtype: "tbspacer",
                colspan: 2,
                height: 5
            },
            {
                xtype: "label",
                cellCls: "doc-info-label-cell",
                text: this.txtRights,
                style: "display: block;text-align: right;",
                width: "100%"
            },
            this.cntRights, this.tbsRights = Ext.create("Ext.toolbar.Spacer", {
                colspan: 2,
                height: 5,
                hideId: "element-to-hide"
            }), {
                xtype: "box"
            },
            this.btnEditRights = Ext.widget("button", {
                id: "doc-info-set-rights",
                cls: "asc-blue-button",
                text: this.txtBtnAccessRights,
                hideId: "element-to-hide",
                listeners: {
                    click: Ext.bind(this._changeAccessRights, this)
                }
            })]
        }];
        Ext.apply(this, {
            plugins: [{
                ptype: "scrollpane",
                areaSelector: ".x-container",
                pluginId: "docInfoPluginId",
                settings: {
                    enableKeyboardNavigation: true
                }
            }]
        });
        this.callParent(arguments);
    },
    updateInfo: function (doc) {
        this.doc = doc;
        if (!this.rendered) {
            return;
        }
        doc = doc || {};
        this.lblTitle.setText((doc.title) ? doc.title : "-");
        if (doc.info) {
            if (doc.info.author) {
                this.cntAuthor.update({
                    text: doc.info.author
                });
            }
            this._ShowHideInfoItem(this.cntAuthor, doc.info.author !== undefined && doc.info.author !== null);
            if (doc.info.created) {
                this.lblDate.setText(doc.info.created);
            }
            this._ShowHideInfoItem(this.lblDate, doc.info.created !== undefined && doc.info.created !== null);
            if (doc.info.folder) {
                this.lblPlacement.setText(doc.info.folder);
            }
            this._ShowHideInfoItem(this.lblPlacement, doc.info.folder !== undefined && doc.info.folder !== null);
            if (doc.info.sharingSettings) {
                this.cntRights.update(doc.info.sharingSettings);
            }
            this._ShowHideInfoItem(this.cntRights, doc.info.sharingSettings !== undefined && doc.info.sharingSettings !== null && this._readonlyRights !== true);
            this._ShowHideInfoItem(this.tbsRights, doc.info.sharingSettings !== undefined && doc.info.sharingSettings !== null && this._readonlyRights !== true);
            this._ShowHideInfoItem(this.btnEditRights, !!this.sharingSettingsUrl && this.sharingSettingsUrl.length && this._readonlyRights !== true);
        } else {
            this._ShowHideDocInfo(false);
        }
    },
    _ShowHideInfoItem: function (cmp, visible) {
        var tr = cmp.getEl().up("tr");
        if (tr) {
            tr.setDisplayed(visible);
        }
    },
    _ShowHideDocInfo: function (visible) {
        var components = Ext.ComponentQuery.query('[hideId="element-to-hide"]', this);
        for (var i = 0; i < components.length; i++) {
            this._ShowHideInfoItem(components[i], visible);
        }
    },
    stopUpdatingStatisticInfo: function () {},
    setApi: function (o) {},
    loadConfig: function (data) {
        this.sharingSettingsUrl = data.config.sharingSettingsUrl;
        return this;
    },
    _changeAccessRights: function (btn, event, opts) {
        var win = Ext.widget("commondocumentaccessdialog", {
            settingsurl: this.sharingSettingsUrl
        });
        var me = this;
        win.on("accessrights", function (obj, rights) {
            me.doc.info.sharingSettings = rights;
            me.cntRights.update(rights);
        });
        win.show();
    },
    onLostEditRights: function () {
        this._readonlyRights = true;
        if (!this.rendered) {
            return;
        }
        this._ShowHideInfoItem(this.cntRights, false);
        this._ShowHideInfoItem(this.tbsRights, false);
        this._ShowHideInfoItem(this.btnEditRights, false);
    },
    txtTitle: "Document Title",
    txtAuthor: "Author",
    txtPlacement: "Placement",
    txtDate: "Creation Date",
    txtRights: "Persons who have rights",
    txtBtnAccessRights: "Change access rights"
});