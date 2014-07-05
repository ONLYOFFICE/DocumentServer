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
 var c_oHyperlinkType = {
    InternalLink: 0,
    WebLink: 1
};
Ext.define("PE.view.HyperlinkSettings", {
    extend: "Ext.window.Window",
    alias: "widget.pehyperlinksettings",
    requires: ["Ext.window.Window", "Ext.form.field.ComboBox", "Ext.form.field.Text", "Ext.Array", "Ext.form.field.Radio", "Common.plugin.ComboBoxScrollPane"],
    cls: "asc-advanced-settings-window",
    modal: true,
    resizable: false,
    plain: true,
    constrain: true,
    height: 410,
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
        this.isTextChanged = false;
        this._spacer = Ext.create("Ext.toolbar.Spacer", {
            width: "100%",
            height: 10,
            html: '<div style="width: 100%; height: 40%; border-bottom: 1px solid #C7C7C7"></div>'
        });
        this.cmbLinkType = Ext.widget("combo", {
            store: Ext.create("Ext.data.Store", {
                fields: ["description", "type"],
                data: [{
                    type: c_oHyperlinkType.InternalLink,
                    description: me.textInternalLink
                },
                {
                    type: c_oHyperlinkType.WebLink,
                    description: me.textExternalLink
                }]
            }),
            displayField: "description",
            valueField: "type",
            queryMode: "local",
            editable: false,
            value: me.textExternalLink,
            listeners: {
                change: function (o, nV, oV) {
                    var isinter = nV == c_oHyperlinkType.InternalLink;
                    me.contIntLink.setVisible(isinter);
                    me.contExtLink.setVisible(!isinter);
                }
            }
        });
        this.cmbSlides = Ext.create("Ext.form.field.ComboBox", {
            store: this.slides,
            mode: "local",
            triggerAction: "all",
            editable: false,
            width: 50,
            listConfig: {
                maxHeight: 200
            },
            listeners: {
                select: Ext.bind(function (combo, records, eOpts) {
                    this.slideNum = records[0].index + 1;
                    combo.blur();
                    me.radioSlide.setValue(true);
                },
                this)
            },
            plugins: [{
                ptype: "comboboxscrollpane",
                pluginId: "scrollpane",
                settings: {
                    enableKeyboardNavigation: true
                }
            }]
        });
        this.txtLink = Ext.widget("textfield", {
            allowBlank: false,
            blankText: me.txtEmpty,
            emptyText: me.textEmptyLink,
            validateOnChange: false,
            msgTarget: "side",
            regex: /(([\-\wа-яё]+\.)+[\wа-яё]{2,3}(\/[%\-\wа-яё]+(\.[\wа-яё]{2,})?)*(([\wа-яё\-\.\?\\\/+@&#;`~=%!]*)(\.[\wа-яё]{2,})?)*\/?)/i,
            regexText: me.txtNotUrl,
            listeners: {
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        me.btnOk.fireEvent("click");
                    } else {
                        if (e.getKey() == e.ESC) {
                            me.btnCancel.fireEvent("click");
                        }
                    }
                }
            }
        });
        this.txtLinkText = Ext.widget("textfield", {
            allowBlank: false,
            blankText: me.txtEmpty,
            msgTarget: "side",
            emptyText: me.textEmptyDesc,
            listeners: {
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        me.btnOk.fireEvent("click");
                    } else {
                        if (e.getKey() == e.ESC) {
                            me.btnCancel.fireEvent("click");
                        }
                    }
                },
                change: function (field, newValue, oldValue) {
                    me.isTextChanged = true;
                },
                scope: this
            }
        });
        this.txtLinkTip = Ext.widget("textfield", {
            emptyText: me.textEmptyTooltip,
            listeners: {
                specialkey: function (field, e) {
                    if (e.getKey() == e.ENTER) {
                        me.btnOk.fireEvent("click");
                    } else {
                        if (e.getKey() == e.ESC) {
                            me.btnCancel.fireEvent("click");
                        }
                    }
                }
            }
        });
        this.label = Ext.widget("label", {
            width: "100%",
            margin: "0 0 2 0",
            style: "font-weight: bold;"
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
            height: 120,
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
                items: [this.radioNext = Ext.create("Ext.form.field.Radio", {
                    boxLabel: this.txtNext,
                    name: "asc-radio-slide",
                    checked: true
                }), this.radioPrev = Ext.create("Ext.form.field.Radio", {
                    boxLabel: this.txtPrev,
                    name: "asc-radio-slide"
                }), this.radioFirst = Ext.create("Ext.form.field.Radio", {
                    boxLabel: this.txtFirst,
                    name: "asc-radio-slide"
                }), this.radioLast = Ext.create("Ext.form.field.Radio", {
                    boxLabel: this.txtLast,
                    name: "asc-radio-slide"
                }), {
                    xtype: "container",
                    flex: 1,
                    layout: {
                        type: "hbox",
                        align: "stretch"
                    },
                    items: [this.radioSlide = Ext.create("Ext.form.field.Radio", {
                        boxLabel: this.txtSlide,
                        name: "asc-radio-slide"
                    }), {
                        xtype: "tbspacer",
                        width: 10
                    },
                    this.cmbSlides]
                }]
            }]
        });
        this.items = [{
            xtype: "container",
            height: 316,
            padding: "18 25",
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
        this._spacer.cloneConfig(), {
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
                    text: this.okButtonText,
                    listeners: {
                        click: function (btn) {
                            if (me.cmbLinkType.getValue() == c_oHyperlinkType.WebLink && !me.txtLink.isValid()) {
                                me.txtLink.focus(true, 500);
                                return;
                            }
                            if (!me.txtLinkText.isValid()) {
                                me.txtLinkText.focus(true, 500);
                                return;
                            }
                            this.fireEvent("onmodalresult", 1);
                            this.close();
                        },
                        scope: this
                    }
                }), this.btnCancel = Ext.widget("button", {
                    cls: "asc-darkgray-button",
                    width: 86,
                    height: 22,
                    text: this.cancelButtonText,
                    listeners: {
                        click: function (btn) {
                            this.fireEvent("onmodalresult", 0);
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
    setSettings: function (props, currentPage) {
        if (props) {
            var type = this.parseUrl(props.get_Value());
            this.cmbLinkType.setValue(type);
            if (props.get_Text() !== null) {
                this.txtLinkText.setValue(props.get_Text());
                this.txtLinkText.setDisabled(false);
            } else {
                this.txtLinkText.setValue(this.textDefault);
                this.txtLinkText.setDisabled(true);
            }
            this.isTextChanged = false;
            this.txtLinkTip.setValue(props.get_ToolTip());
        }
    },
    getSettings: function () {
        var props = new CHyperlinkProperty();
        if (this.cmbLinkType.getValue() == c_oHyperlinkType.InternalLink) {
            var url = "ppaction://hlink";
            var tip = "";
            var txttip = this.txtLinkTip.getValue();
            if (this.radioSlide.getValue()) {
                url = url + "sldjumpslide" + (this.cmbSlides.getValue() - 1);
                tip = this.txtSlide + " " + this.cmbSlides.getValue();
            } else {
                if (this.radioFirst.getValue()) {
                    url = url + "showjump?jump=firstslide";
                    tip = this.txtFirst;
                } else {
                    if (this.radioLast.getValue()) {
                        url = url + "showjump?jump=lastslide";
                        tip = this.txtLast;
                    } else {
                        if (this.radioNext.getValue()) {
                            url = url + "showjump?jump=nextslide";
                            tip = this.txtNext;
                        } else {
                            if (this.radioPrev.getValue()) {
                                url = url + "showjump?jump=previousslide";
                                tip = this.txtPrev;
                            }
                        }
                    }
                }
            }
            props.put_Value(url);
            props.put_ToolTip((txttip !== "") ? txttip : tip);
        } else {
            var url = this.txtLink.getValue();
            if (!/(((^https?)|(^ftp)):\/\/)/i.test(url)) {
                url = "http://" + url;
            }
            props.put_Value(url);
            props.put_ToolTip(this.txtLinkTip.getValue());
        }
        if (!this.txtLinkText.isDisabled() && this.isTextChanged) {
            props.put_Text(this.txtLinkText.getValue());
        } else {
            props.put_Text(null);
        }
        return props;
    },
    parseUrl: function (url) {
        if (url === null || url === undefined || url == "") {
            return c_oHyperlinkType.WebLink;
        }
        var indAction = url.indexOf("ppaction://hlink");
        if (0 == indAction) {
            if (url == "ppaction://hlinkshowjump?jump=firstslide") {
                this.radioFirst.setValue(true);
            } else {
                if (url == "ppaction://hlinkshowjump?jump=lastslide") {
                    this.radioLast.setValue(true);
                } else {
                    if (url == "ppaction://hlinkshowjump?jump=nextslide") {
                        this.radioNext.setValue(true);
                    } else {
                        if (url == "ppaction://hlinkshowjump?jump=previousslide") {
                            this.radioPrev.setValue(true);
                        } else {
                            this.radioSlide.setValue(true);
                            var mask = "ppaction://hlinksldjumpslide";
                            var indSlide = url.indexOf(mask);
                            if (0 == indSlide) {
                                var slideNum = parseInt(url.substring(mask.length));
                                if (slideNum >= 0 && slideNum < this.slides.length) {
                                    this.cmbSlides.setValue(slideNum + 1);
                                }
                            }
                        }
                    }
                }
            }
            return c_oHyperlinkType.InternalLink;
        } else {
            this.txtLink.setValue(url ? url : "");
            return c_oHyperlinkType.WebLink;
        }
    },
    textTitle: "Hyperlink Settings",
    textInternalLink: "Place In This Document",
    textExternalLink: "File or Web Page",
    textEmptyLink: "Enter link here",
    textEmptyDesc: "Enter caption here",
    textEmptyTooltip: "Enter tooltip here",
    txtSlide: "Slide",
    textLinkType: "Link Type",
    strDisplay: "Display",
    textTipText: "Screen Tip Text",
    strLinkTo: "Link To",
    txtEmpty: "This field is required",
    textInvalidRange: "ERROR! Invalid cells range",
    txtNotUrl: 'This field should be a URL in the format "http://www.example.com"',
    strPlaceInDocument: "Select a Place in This Document",
    cancelButtonText: "Cancel",
    okButtonText: "Ok",
    txtNext: "Next Slide",
    txtPrev: "Previous Slide",
    txtFirst: "First Slide",
    txtLast: "Last Slide"
});