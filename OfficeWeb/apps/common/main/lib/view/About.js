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
 Ext.define("Common.view.About", {
    extend: "Ext.container.Container",
    alias: "widget.commonabout",
    cls: "common-about-body",
    requires: ["Ext.container.Container", "Ext.form.Label"],
    constructor: function (config) {
        this.initConfig(config);
        this.callParent(arguments);
        return this;
    },
    initComponent: function () {
        var txtVersionNum = "2.5";
        var txtAscMail = "support@onlyoffice.com";
        var txtAscTelNum = "+371 660-16425";
        var txtAscUrl = "www.onlyoffice.com";
        var txtAscName = "Ascensio System SIA";
        this.items = [{
            xtype: "container",
            layout: {
                type: "table",
                columns: 1,
                tableAttrs: {
                    style: "width: 100%;"
                },
                tdAttrs: {
                    align: "center"
                }
            },
            items: [{
                xtype: "container",
                cls: "asc-about-office"
            },
            {
                xtype: "tbspacer",
                height: 5
            },
            {
                xtype: "label",
                cls: "asc-about-version",
                text: this.txtVersion + txtVersionNum
            },
            {
                xtype: "tbspacer",
                height: 40
            }]
        },
        {
            xtype: "container",
            layout: {
                type: "table",
                columns: 3,
                tableAttrs: {
                    style: "width: 100%;"
                }
            },
            items: [{
                cellCls: "about-separator-cell",
                xtype: "tbspacer",
                width: "100%",
                html: '<div style="width: 100%; height: 3px !important; background-color: #e1e1e1"></div>'
            },
            {
                xtype: "label",
                cls: "asc-about-header",
                text: this.txtLicensor
            },
            {
                cellCls: "about-separator-cell",
                xtype: "tbspacer",
                width: "100%",
                html: '<div style="width: 100%; height: 3px !important; background-color: #e1e1e1"></div>'
            }]
        },
        {
            xtype: "container",
            layout: {
                type: "table",
                columns: 1,
                tableAttrs: {
                    style: "width: 100%;"
                },
                tdAttrs: {
                    align: "center"
                }
            },
            items: [{
                xtype: "tbspacer",
                height: 20
            },
            {
                xtype: "label",
                cls: "asc-about-companyname",
                text: txtAscName
            },
            {
                xtype: "tbspacer",
                height: 10
            },
            {
                xtype: "container",
                items: [{
                    xtype: "label",
                    cls: "asc-about-desc-name",
                    text: this.txtAddress
                },
                {
                    xtype: "label",
                    cls: "asc-about-desc",
                    text: this.txtAscAddress
                }]
            },
            {
                xtype: "tbspacer",
                height: 10
            },
            {
                xtype: "container",
                items: [{
                    xtype: "label",
                    cls: "asc-about-desc-name",
                    text: this.txtMail
                },
                {
                    xtype: "label",
                    cls: "asc-about-desc",
                    html: Ext.String.format('<a href="mailto:{0}">{0}</a>', txtAscMail)
                }]
            },
            {
                xtype: "tbspacer",
                height: 10
            },
            {
                xtype: "container",
                items: [{
                    xtype: "label",
                    cls: "asc-about-desc-name",
                    text: this.txtTel
                },
                {
                    xtype: "label",
                    cls: "asc-about-desc",
                    text: txtAscTelNum
                }]
            },
            {
                xtype: "tbspacer",
                height: 10
            },
            {
                xtype: "label",
                cls: "asc-about-desc",
                html: Ext.String.format('<a href="http://{0}" target="_blank">{0}</a>', txtAscUrl)
            },
            {
                xtype: "tbspacer",
                height: 40
            }]
        },
        {
            xtype: "container",
            layout: {
                type: "table",
                columns: 3,
                tableAttrs: {
                    style: "width: 100%;"
                }
            },
            items: [{
                cellCls: "about-separator-cell",
                xtype: "tbspacer",
                width: "100%",
                html: '<div style="width: 100%; height: 3px !important; background-color: #e1e1e1"></div>'
            },
            {
                xtype: "label",
                cls: "asc-about-header",
                text: this.txtLicensee
            },
            {
                cellCls: "about-separator-cell",
                xtype: "tbspacer",
                width: "100%",
                html: '<div style="width: 100%; height: 3px !important; background-color: #e1e1e1"></div>'
            }]
        },
        this.cntLicenseeInfo = Ext.create("Ext.Container", {
            layout: {
                type: "table",
                columns: 1,
                tableAttrs: {
                    style: "width: 100%;"
                },
                tdAttrs: {
                    align: "center"
                }
            },
            items: [{
                xtype: "tbspacer",
                height: 20
            },
            this.imgCompanyLogo = Ext.create("Ext.Container", {
                html: '<img src="" />'
            }), {
                xtype: "tbspacer",
                height: 10
            },
            this.lblCompanyName = Ext.create("Ext.form.Label", {
                cls: "asc-about-companyname",
                text: ""
            }), {
                xtype: "tbspacer",
                height: 10
            },
            {
                xtype: "container",
                items: [{
                    xtype: "label",
                    cls: "asc-about-desc-name",
                    text: this.txtAddress
                },
                this.lblCompanyAddress = Ext.create("Ext.form.Label", {
                    cls: "asc-about-desc",
                    text: ""
                })]
            },
            {
                xtype: "tbspacer",
                height: 10
            },
            {
                xtype: "container",
                items: [{
                    xtype: "label",
                    cls: "asc-about-desc-name",
                    text: this.txtMail
                },
                this.lblCompanyMail = Ext.create("Ext.form.Label", {
                    cls: "asc-about-desc",
                    text: ""
                })]
            },
            {
                xtype: "tbspacer",
                height: 10
            },
            this.lblCompanyUrl = Ext.create("Ext.form.Label", {
                cls: "asc-about-desc",
                text: ""
            }), {
                xtype: "tbspacer",
                height: 10
            },
            this.lblCompanyLic = Ext.create("Ext.form.Label", {
                cls: "asc-about-lic",
                text: ""
            })]
        })];
        this.callParent(arguments);
        this.items.items[3].hide();
        this.cntLicenseeInfo.hide();
    },
    setLicInfo: function (data) {
        if (data && typeof(data) == "object") {
            this.items.items[3].show();
            this.cntLicenseeInfo.show();
            this.lblCompanyName.setText(data.asc_getCustomer());
            var value = data.asc_getCustomerAddr();
            if (value && value.length) {
                this.lblCompanyAddress.setText(value);
            } else {
                this.cntLicenseeInfo.items.getAt(5).hide();
                this.cntLicenseeInfo.items.getAt(6).hide();
            }
            value = data.asc_getCustomerMail();
            if (value && value.length) {
                this.lblCompanyMail.update(Ext.String.format('<a href="mailto:{0}">{0}</a>', value));
            } else {
                this.cntLicenseeInfo.items.getAt(7).hide();
                this.cntLicenseeInfo.items.getAt(8).hide();
            }
            value = data.asc_getCustomerWww();
            if (value && value.length) {
                var islicense = /^label:(.+);url:(.+)/.exec(value);
                if (islicense) {
                    href = islicense[2];
                    value = islicense[1];
                } else {
                    var href = /^https?:\/\//.test(value) ? value : "http://" + value;
                }
                this.lblCompanyUrl.update(Ext.String.format('<a href="{0}" target="_blank">{1}</a>', href, value));
            } else {
                this.cntLicenseeInfo.items.getAt(9).hide();
                this.cntLicenseeInfo.items.getAt(10).hide();
            } (value = data.asc_getCustomerInfo()) && value.length ? this.lblCompanyLic.setText(value) : this.cntLicenseeInfo.items.getAt(11).hide();
            if ((value = data.asc_getCustomerLogo()) && value.length) {
                this.imgCompanyLogo.html = '<img src="' + value + '" />';
            } else {
                this.imgCompanyLogo.hide();
                this.cntLicenseeInfo.items.getAt(2).hide();
            }
        } else {
            this.items.items[3].hide();
            this.cntLicenseeInfo.hide();
        }
    },
    txtVersion: "Version ",
    txtLicensor: "LICENSOR",
    txtLicensee: "LICENSEE",
    txtAddress: "address: ",
    txtAscAddress: "Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021",
    txtMail: "email: ",
    txtTel: "tel.: "
});