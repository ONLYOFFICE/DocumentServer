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
 Ext.define("Common.view.CollapsedContainer", {
    extend: "Ext.container.Container",
    alias: "widget.commoncollapsedcontainer",
    layout: "vbox",
    layoutConfig: {
        align: "stretch"
    },
    requires: ["Ext.button.Button", "Ext.container.Container", "Ext.form.Label"],
    constructor: function (config) {
        this.callParent(arguments);
        this.initConfig(config);
        return this;
    },
    initComponent: function () {
        this.collapseButton = Ext.create("Ext.Button", {
            id: this.headerBtnId,
            cls: "asc-right-panel-btn-collapse",
            iconCls: (this.contentCollapsed) ? "asc-right-panel-img-collapsed" : "asc-right-panel-img-expanded",
            text: "",
            listeners: {
                click: Ext.bind(this._ShowHidePanel, this, [this.contentPanel], true)
            }
        });
        this.contentPanel.setVisible(!this.contentCollapsed);
        var headeritems = [];
        headeritems.push({
            xtype: "label",
            style: "font-weight: bold;margin-top: 1px;",
            text: this.headerText,
            listeners: {
                afterrender: Ext.bind(function (ct) {
                    if (this.disableCollapse === undefined || !this.disableCollapse) {
                        ct.getEl().on("dblclick", Ext.bind(this._ShowHidePanel, this, [this.collapseButton, {},
                        {},
                        this.contentPanel]), this);
                    }
                },
                this)
            }
        });
        if (this.disableCollapse === undefined || !this.disableCollapse) {
            headeritems.push(this.collapseButton);
        }
        this.items = [];
        if (this.disableHeader === undefined || !this.disableHeader) {
            this.items.push({
                xtype: "container",
                height: 15,
                width: this.width,
                layout: "hbox",
                align: "middle",
                items: headeritems
            });
        }
        this.items.push(this.contentPanel);
        this.height = (this.disableHeader === undefined || !this.disableHeader) ? 15 : 0;
        this.height += (this.contentCollapsed) ? 0 : (this.contentPanel.height);
        this.addEvents("aftercollapsed");
        this.callParent(arguments);
    },
    _ShowHidePanel: function (btn, e, eOpts, panel) {
        var diff_height = 0;
        if (btn.iconCls == "asc-right-panel-img-expanded") {
            btn.setIconCls("asc-right-panel-img-collapsed");
            this.setHeight(this.getHeight() - panel.getHeight());
            diff_height = -panel.getHeight();
            panel.hide();
        } else {
            btn.setIconCls("asc-right-panel-img-expanded");
            panel.show();
            this.setHeight(this.getHeight() + panel.getHeight());
            diff_height = panel.getHeight();
        }
        this.contentCollapsed = !panel.isVisible();
        this.fireEvent("aftercollapsed", this, diff_height);
    }
});