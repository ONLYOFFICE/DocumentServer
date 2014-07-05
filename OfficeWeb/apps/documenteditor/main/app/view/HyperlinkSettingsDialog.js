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
 Ext.define("DE.view.HyperlinkSettingsDialog", {
    extend: "Ext.window.Window",
    alias: "widget.dehyperlinksettingsdialog",
    requires: ["Ext.window.Window"],
    modal: true,
    closable: true,
    resizable: false,
    preventHeader: true,
    plain: true,
    height: 216,
    width: 350,
    padding: "20px 20px 18px 20px",
    layout: "vbox",
    layoutConfig: {
        align: "stretch"
    },
    listeners: {
        show: function () {
            this.txtUrl.focus(false, 500);
        }
    },
    constructor: function (config) {
        this.callParent(arguments);
        this.initConfig(config);
        return this;
    },
    initComponent: function () {
        this.isTextChanged = false;
        var _btnOk = Ext.create("Ext.Button", {
            id: "addhyperlink-button-ok",
            text: this.okButtonText,
            width: 80,
            cls: "asc-blue-button",
            listeners: {
                click: function () {
                    if (!this.txtUrl.isValid() || !this.txtDisplay.isValid()) {
                        return;
                    }
                    this._modalresult = 1;
                    this.fireEvent("onmodalresult", this._modalresult);
                    this.close();
                },
                scope: this
            }
        });
        var _btnCancel = Ext.create("Ext.Button", {
            id: "addhyperlink-button-cancel",
            text: this.cancelButtonText,
            width: 80,
            cls: "asc-darkgray-button",
            listeners: {
                click: function () {
                    this._modalresult = 0;
                    this.fireEvent("onmodalresult", this._modalresult);
                    this.close();
                },
                scope: this
            }
        });
        this.txtUrl = Ext.create("Ext.form.Text", {
            id: "addhyperlink-text-url",
            width: 310,
            msgTarget: "side",
            validateOnChange: false,
            allowBlank: false,
            value: "http://",
            blankText: this.txtEmpty,
            regex: /(([\-\wа-яё]+\.)+[\wа-яё]{2,3}(\/[%\-\wа-яё]+(\.[\wа-яё]{2,})?)*(([\wа-яё\-\.\?\\\/+@&#;`~=%!]*)(\.[\wа-яё]{2,})?)*\/?)/i,
            regexText: this.txtNotUrl,
            listeners: {
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        _btnOk.fireEvent("click");
                    } else {
                        if (e.getKey() == e.ESC) {
                            _btnCancel.fireEvent("click");
                        }
                    }
                }
            }
        });
        this.txtDisplay = Ext.create("Ext.form.Text", {
            id: "addhyperlink-text-display",
            width: 310,
            msgTarget: "side",
            validateOnBlur: false,
            allowBlank: false,
            blankText: this.txtEmpty,
            value: "",
            listeners: {
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        _btnOk.fireEvent("click");
                    } else {
                        if (e.getKey() == e.ESC) {
                            _btnCancel.fireEvent("click");
                        }
                    }
                },
                change: function (field, newValue, oldValue) {
                    this.isTextChanged = true;
                },
                scope: this
            }
        });
        this.txtTooltip = Ext.create("Ext.form.Text", {
            id: "addhyperlink-text-tooltip",
            width: 310,
            msgTarget: "side",
            validateOnBlur: false,
            allowBlank: true,
            value: "",
            listeners: {
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        _btnOk.fireEvent("click");
                    } else {
                        if (e.getKey() == e.ESC) {
                            _btnCancel.fireEvent("click");
                        }
                    }
                }
            }
        });
        this.addEvents("onmodalresult");
        this.items = [{
            xtype: "label",
            text: this.textUrl,
            width: "100%",
            style: "text-align:left"
        },
        {
            xtype: "tbspacer",
            height: 3
        },
        this.txtUrl, {
            xtype: "tbspacer",
            height: 3
        },
        {
            xtype: "label",
            text: this.textDisplay,
            width: "100%",
            style: "text-align:left"
        },
        {
            xtype: "tbspacer",
            height: 3
        },
        this.txtDisplay, {
            xtype: "tbspacer",
            height: 3
        },
        {
            xtype: "label",
            text: this.textTooltip,
            width: "100%",
            style: "text-align:left"
        },
        {
            xtype: "tbspacer",
            height: 3
        },
        this.txtTooltip, {
            xtype: "tbspacer",
            height: 8
        },
        {
            xtype: "container",
            width: 310,
            layout: "hbox",
            layoutConfig: {
                align: "stretch"
            },
            items: [{
                xtype: "tbspacer",
                flex: 1
            },
            _btnOk, {
                xtype: "tbspacer",
                width: 5
            },
            _btnCancel]
        }];
        this.callParent(arguments);
    },
    setSettings: function (props) {
        if (props) {
            if (props.get_Value()) {
                this.txtUrl.setValue(props.get_Value());
            } else {
                this.txtUrl.setValue("");
            }
            if (props.get_Text() !== null) {
                this.txtDisplay.setValue(props.get_Text());
                this.txtDisplay.setDisabled(false);
            } else {
                this.txtDisplay.setValue(this.textDefault);
                this.txtDisplay.setDisabled(true);
            }
            this.isTextChanged = false;
            this.txtTooltip.setValue(props.get_ToolTip());
        }
    },
    getSettings: function () {
        var props = new CHyperlinkProperty();
        var url = this.txtUrl.getValue().trim();
        if (!/(((^https?)|(^ftp)):\/\/)/i.test(url)) {
            url = "http://" + url;
        }
        props.put_Value(url);
        if (!this.txtDisplay.isDisabled() && this.isTextChanged) {
            props.put_Text(this.txtDisplay.getValue());
        } else {
            props.put_Text(null);
        }
        props.put_ToolTip(this.txtTooltip.getValue());
        return props;
    },
    textUrl: "Link to",
    textDisplay: "Display",
    cancelButtonText: "Cancel",
    okButtonText: "Ok",
    txtEmpty: "This field is required",
    txtNotUrl: 'This field should be a URL in the format "http://www.example.com"',
    textTooltip: "ScreenTip text",
    textDefault: "Selected text"
});