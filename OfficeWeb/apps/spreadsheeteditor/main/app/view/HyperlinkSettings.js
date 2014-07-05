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
 Ext.define("SSE.view.HyperlinkSettings", {
    extend: "Ext.window.Window",
    alias: "widget.ssehyperlinksettings",
    requires: ["Ext.window.Window", "Ext.form.field.ComboBox", "Ext.form.field.Text", "Ext.Array"],
    cls: "asc-advanced-settings-window",
    modal: true,
    resizable: false,
    plain: true,
    constrain: true,
    height: 348,
    width: 366,
    layout: {
        type: "vbox",
        align: "stretch"
    },
    listeners: {
        show: function () {
            if (this.contExtLink.isVisible()) {
                this.txtLink.focus(false, 500);
            } else {
                this.txtLinkText.focus(false, 500);
            }
        }
    },
    initComponent: function () {
        var me = this;
        this.addEvents("onmodalresult");
        this._spacer = Ext.create("Ext.toolbar.Spacer", {
            width: "100%",
            height: 10,
            html: '<div style="width: 100%; height: 40%; border-bottom: 1px solid #C7C7C7"></div>'
        });
        this.cmbLinkType = Ext.widget("combo", {
            store: Ext.create("Ext.data.Store", {
                fields: ["description", "type"],
                data: [{
                    type: c_oAscHyperlinkType.RangeLink,
                    description: me.textInternalLink
                },
                {
                    type: c_oAscHyperlinkType.WebLink,
                    description: me.textExternalLink
                }]
            }),
            displayField: "description",
            valueField: "type",
            queryMode: "local",
            editable: false,
            listeners: {
                change: function (o, nV, oV) {
                    var isinter = nV == c_oAscHyperlinkType.RangeLink;
                    me.contIntLink.setVisible(isinter);
                    me.contExtLink.setVisible(!isinter);
                }
            }
        });
        this.cmbSheets = Ext.widget("combo", {
            store: Ext.create("Ext.data.ArrayStore", {
                fields: ["name"],
                data: this.sheets
            }),
            displayField: "name",
            queryMode: "local",
            editable: false
        });
        this.txtDataRange = Ext.widget("textfield", {
            allowBlank: false,
            check: false,
            blankText: me.txtEmpty,
            msgTarget: "side",
            validator: function (value) {
                if (!this.check) {
                    return true;
                }
                var isvalid = /^[A-Z]+[1-9]\d*:[A-Z]+[1-9]\d*$/.test(value); ! isvalid && (isvalid = /^[A-Z]+[1-9]\d*$/.test(value));
                if (isvalid) {
                    $("#" + this.id + " input").css("color", "black");
                    return true;
                } else {
                    $("#" + this.id + " input").css("color", "red");
                    return me.textInvalidRange;
                }
            },
            listeners: {
                blur: function (o) {
                    this.check = true;
                    this.check = !this.validate();
                }
            }
        });
        this.txtLink = Ext.widget("textfield", {
            allowBlank: false,
            blankText: me.txtEmpty,
            emptyText: me.textEmptyLink,
            validateOnChange: false,
            msgTarget: "side",
            regex: /(([\-\wа-яё]+\.)+[\wа-яё]{2,3}(\/[%\-\wа-яё]+(\.[\wа-яё]{2,})?)*(([\wа-яё\-\.\?\\\/+@&#;`~=%!]*)(\.[\wа-яё]{2,})?)*\/?)/i,
            regexText: me.txtNotUrl
        });
        this.txtLinkText = Ext.widget("textfield", {
            allowBlank: false,
            blankText: me.txtEmpty,
            msgTarget: "side",
            emptyText: me.textEmptyDesc
        });
        this.txtLinkTip = Ext.widget("textfield", {
            emptyText: me.textEmptyTooltip
        });
        this.label = Ext.widget("label", {
            width: "100%",
            margin: "0 0 3 0"
        });
        this.contExtLink = Ext.widget("container", {
            height: 44,
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [this.label.cloneConfig({
                text: me.strLinkTo
            }), this.txtLink]
        });
        this.contIntLink = Ext.widget("container", {
            height: 44,
            hidden: true,
            layout: {
                type: "hbox",
                align: "stretch"
            },
            items: [{
                xtype: "container",
                flex: 1,
                layout: {
                    type: "vbox",
                    align: "stretch"
                },
                items: [this.label.cloneConfig({
                    text: me.strSheet
                }), this.cmbSheets]
            },
            {
                xtype: "tbspacer",
                width: 18
            },
            {
                xtype: "container",
                flex: 1,
                layout: {
                    type: "vbox",
                    align: "stretch"
                },
                items: [this.label.cloneConfig({
                    text: me.strRange
                }), this.txtDataRange]
            }]
        });
        this.items = [{
            xtype: "container",
            height: 254,
            padding: "18",
            layout: {
                type: "vbox",
                align: "stretch"
            },
            items: [this.label.cloneConfig({
                text: me.textLinkType
            }), this.cmbLinkType, {
                xtype: "tbspacer",
                height: 10
            },
            this.contExtLink, this.contIntLink, {
                xtype: "tbspacer",
                height: 10
            },
            this.labelDisplay = this.label.cloneConfig({
                text: me.strDisplay
            }), this.txtLinkText, {
                xtype: "tbspacer",
                height: 10
            },
            this.label.cloneConfig({
                text: me.textTipText
            }), this.txtLinkTip]
        },
        this._spacer.cloneConfig({
            style: "margin: 0 18px"
        }), {
            xtype: "container",
            height: 40,
            layout: {
                type: "vbox",
                align: "center",
                pack: "center"
            },
            items: [{
                xtype: "container",
                width: 182,
                height: 24,
                layout: {
                    type: "hbox",
                    align: "middle"
                },
                items: [this.btnOk = Ext.widget("button", {
                    cls: "asc-blue-button",
                    width: 86,
                    height: 22,
                    margin: "0 5px 0 0",
                    text: Ext.Msg.buttonText.ok,
                    listeners: {
                        click: function (btn) {
                            if (me.cmbLinkType.getValue() == c_oAscHyperlinkType.RangeLink) {
                                me.txtDataRange.check = true;
                                if (!me.txtDataRange.validate()) {
                                    me.txtDataRange.focus(true, 500);
                                    return;
                                }
                            } else {
                                if (!me.txtLink.isValid()) {
                                    me.txtLink.focus(true, 500);
                                    return;
                                }
                            }
                            if (!me.txtLinkText.isValid()) {
                                me.txtLinkText.focus(true, 500);
                                return;
                            }
                            this.fireEvent("onmodalresult", this, 1);
                            this.close();
                        },
                        scope: this
                    }
                }), this.btnCancel = Ext.widget("button", {
                    cls: "asc-darkgray-button",
                    width: 86,
                    height: 22,
                    text: me.cancelButtonText,
                    listeners: {
                        click: function (btn) {
                            this.fireEvent("onmodalresult", this, 0);
                            this.close();
                        },
                        scope: this
                    }
                })]
            }]
        }];
        this.callParent(arguments);
        this.setTitle(this.textTitle);
    },
    afterRender: function () {
        this.callParent(arguments);
    },
    setSettings: function (props, text, islock) {
        if (!props) {
            this.cmbLinkType.select(this.cmbLinkType.getStore().getAt(1));
            this.txtLinkText.setValue(text);
        } else {
            var index = this.cmbLinkType.getStore().find("type", props.asc_getType());
            this.cmbLinkType.select(this.cmbLinkType.getStore().getAt(index));
            if (props.asc_getType() == c_oAscHyperlinkType.RangeLink) {
                index = this.cmbSheets.getStore().find("name", props.asc_getSheet());
                if (! (index < 0)) {
                    this.cmbSheets.select(this.cmbSheets.getStore().getAt(index));
                }
                this.txtDataRange.setValue(props.asc_getRange());
            } else {
                this.txtLink.setValue(props.asc_getHyperlinkUrl());
            }
            this.txtLinkText.setValue(props.asc_getText());
            this.txtLinkTip.setValue(props.asc_getTooltip());
        }
        this.txtLinkText.setDisabled(islock);
        this.labelDisplay.setDisabled(islock);
    },
    getSettings: function () {
        var props = new Asc.asc_CHyperlink();
        props.asc_setType(this.cmbLinkType.getValue());
        if (this.cmbLinkType.getValue() == c_oAscHyperlinkType.RangeLink) {
            props.asc_setSheet(this.cmbSheets.getValue());
            props.asc_setRange(this.txtDataRange.getValue());
        } else {
            var url = this.txtLink.getValue().replace(/^\s+|\s+$/g, "");
            if (!/(((^https?)|(^ftp)):\/\/)/i.test(url)) {
                url = "http://" + url;
            }
            props.asc_setHyperlinkUrl(url);
        }
        props.asc_setText(this.txtLinkText.isDisabled() ? null : this.txtLinkText.getValue());
        props.asc_setTooltip(this.txtLinkTip.getValue());
        return props;
    },
    textTitle: "Hyperlink Settings",
    textInternalLink: "Internal Data Range",
    textExternalLink: "Web Link",
    textEmptyLink: "Enter link here",
    textEmptyDesc: "Enter caption here",
    textEmptyTooltip: "Enter tooltip here",
    strSheet: "Sheet",
    strRange: "Range",
    textLinkType: "Link Type",
    strDisplay: "Display",
    textTipText: "Screen Tip Text",
    strLinkTo: "Link To",
    txtEmpty: "This field is required",
    textInvalidRange: "ERROR! Invalid cells range",
    txtNotUrl: 'This field should be a URL in the format "http://www.example.com"',
    cancelButtonText: "Cancel"
});