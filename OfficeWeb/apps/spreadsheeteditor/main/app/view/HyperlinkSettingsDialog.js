/*
 * (c) Copyright Ascensio System SIA 2010-2015
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
 if (Common === undefined) {
    var Common = {};
}
define(["common/main/lib/util/utils", "common/main/lib/component/ComboBox", "common/main/lib/component/InputField", "common/main/lib/component/Window"], function () {
    SSE.Views.HyperlinkSettingsDialog = Common.UI.Window.extend(_.extend({
        options: {
            width: 350,
            style: "min-width: 230px;",
            cls: "modal-dlg"
        },
        initialize: function (options) {
            _.extend(this.options, {
                title: this.textTitle
            },
            options || {});
            this.template = ['<div class="box">', '<div class="input-row">', "<label>" + this.textLinkType + "</label>", "</div>", '<div class="input-row" id="id-dlg-hyperlink-type" style="margin-bottom: 5px;">', "</div>", '<div id="id-dlg-hyperlink-external">', '<div class="input-row">', "<label>" + this.strLinkTo + " *</label>", "</div>", '<div id="id-dlg-hyperlink-url" class="input-row" style="margin-bottom: 5px;"></div>', "</div>", '<div id="id-dlg-hyperlink-internal" style="display: none;">', '<div class="input-row">', '<label style="width: 50%;">' + this.strSheet + "</label>", '<label style="width: 50%;">' + this.strRange + " *</label>", "</div>", '<div class="input-row" style="margin-bottom: 5px;">', '<div id="id-dlg-hyperlink-sheet" style="display: inline-block; width: 50%; padding-right: 10px; float: left;"></div>', '<div id="id-dlg-hyperlink-range" style="display: inline-block; width: 50%;"></div>', "</div>", "</div>", '<div class="input-row">', "<label>" + this.strDisplay + "</label>", "</div>", '<div id="id-dlg-hyperlink-display" class="input-row" style="margin-bottom: 5px;"></div>', '<div class="input-row">', "<label>" + this.textTipText + "</label>", "</div>", '<div id="id-dlg-hyperlink-tip" class="input-row" style="margin-bottom: 5px;"></div>', "</div>", '<div class="footer right">', '<button class="btn normal dlg-btn primary" result="ok" style="margin-right: 10px;">' + this.okButtonText + "</button>", '<button class="btn normal dlg-btn" result="cancel">' + this.cancelButtonText + "</button>", "</div>"].join("");
            this.options.tpl = _.template(this.template, this.options);
            Common.UI.Window.prototype.initialize.call(this, this.options);
        },
        render: function () {
            Common.UI.Window.prototype.render.call(this);
            var $window = this.getChild(),
            me = this;
            me.cmbLinkType = new Common.UI.ComboBox({
                el: $("#id-dlg-hyperlink-type"),
                cls: "input-group-nr",
                editable: false,
                menuStyle: "min-width: 100%;",
                data: [{
                    displayValue: this.textInternalLink,
                    value: c_oAscHyperlinkType.RangeLink
                },
                {
                    displayValue: this.textExternalLink,
                    value: c_oAscHyperlinkType.WebLink
                }]
            }).on("selected", function (combo, record) {
                $("#id-dlg-hyperlink-external")[record.value == c_oAscHyperlinkType.WebLink ? "show" : "hide"]();
                $("#id-dlg-hyperlink-internal")[record.value != c_oAscHyperlinkType.WebLink ? "show" : "hide"]();
            });
            me.cmbLinkType.setValue(c_oAscHyperlinkType.WebLink);
            me.cmbSheets = new Common.UI.ComboBox({
                el: $("#id-dlg-hyperlink-sheet"),
                cls: "input-group-nr",
                editable: false,
                menuStyle: "min-width: 100%;max-height: 150px;"
            });
            me.inputUrl = new Common.UI.InputField({
                el: $("#id-dlg-hyperlink-url"),
                allowBlank: false,
                blankError: me.txtEmpty,
                validateOnBlur: false,
                style: "width: 100%;",
                validation: function (value) {
                    me.isEmail = false;
                    var isvalid = value.strongMatch(Common.Utils.hostnameRe); ! isvalid && (me.isEmail = isvalid = value.strongMatch(Common.Utils.emailRe)); ! isvalid && (isvalid = value.strongMatch(Common.Utils.ipRe)); ! isvalid && (isvalid = value.strongMatch(Common.Utils.localRe));
                    if (isvalid) {
                        return true;
                    } else {
                        return me.txtNotUrl;
                    }
                }
            });
            me.inputRange = new Common.UI.InputField({
                el: $("#id-dlg-hyperlink-range"),
                allowBlank: false,
                blankError: me.txtEmpty,
                style: "width: 100%;",
                validateOnChange: true,
                validateOnBlur: false,
                validation: function (value) {
                    var isvalid = /^[A-Z]+[1-9]\d*:[A-Z]+[1-9]\d*$/.test(value);
                    if (!isvalid) {
                        isvalid = /^[A-Z]+[1-9]\d*$/.test(value);
                    }
                    if (isvalid) {
                        return true;
                    } else {
                        return me.textInvalidRange;
                    }
                }
            });
            me.inputDisplay = new Common.UI.InputField({
                el: $("#id-dlg-hyperlink-display"),
                allowBlank: true,
                validateOnBlur: false,
                style: "width: 100%;"
            });
            me.inputTip = new Common.UI.InputField({
                el: $("#id-dlg-hyperlink-tip"),
                style: "width: 100%;"
            });
            $window.find(".dlg-btn").on("click", _.bind(this.onBtnClick, this));
            $window.find("input").on("keypress", _.bind(this.onKeyPress, this));
        },
        show: function () {
            Common.UI.Window.prototype.show.apply(this, arguments);
            var me = this;
            _.delay(function () {
                if (me.focusedInput) {
                    me.focusedInput.focus();
                }
            },
            500);
        },
        setSettings: function (settings) {
            if (settings) {
                var me = this;
                this.cmbSheets.setData(settings.sheets);
                if (!settings.props) {
                    this.cmbLinkType.setValue(c_oAscHyperlinkType.WebLink);
                    this.cmbLinkType.setDisabled(!settings.allowInternal);
                    this.inputDisplay.setValue(settings.isLock ? this.textDefault : settings.text);
                    this.focusedInput = this.inputUrl.cmpEl.find("input");
                    this.cmbSheets.setValue(settings.currentSheet);
                } else {
                    this.cmbLinkType.setValue(settings.props.asc_getType());
                    this.cmbLinkType.setDisabled(!settings.allowInternal);
                    if (settings.props.asc_getType() == c_oAscHyperlinkType.RangeLink) {
                        $("#id-dlg-hyperlink-external").hide();
                        $("#id-dlg-hyperlink-internal").show();
                        this.cmbSheets.setValue(settings.props.asc_getSheet());
                        this.inputRange.setValue(settings.props.asc_getRange());
                        this.focusedInput = this.inputRange.cmpEl.find("input");
                    } else {
                        this.inputUrl.setValue(settings.props.asc_getHyperlinkUrl());
                        this.focusedInput = this.inputUrl.cmpEl.find("input");
                        this.cmbSheets.setValue(settings.currentSheet);
                    }
                    this.inputDisplay.setValue(settings.isLock ? this.textDefault : settings.props.asc_getText());
                    this.inputTip.setValue(settings.props.asc_getTooltip());
                }
                this.inputDisplay.setDisabled(settings.isLock);
            }
        },
        getSettings: function () {
            var props = new Asc.asc_CHyperlink(),
            def_display = "";
            props.asc_setType(this.cmbLinkType.getValue());
            if (this.cmbLinkType.getValue() == c_oAscHyperlinkType.RangeLink) {
                props.asc_setSheet(this.cmbSheets.getValue());
                props.asc_setRange(this.inputRange.getValue());
                def_display = this.cmbSheets.getValue() + "!" + this.inputRange.getValue();
            } else {
                var url = this.inputUrl.getValue().replace(/^\s+|\s+$/g, "");
                if (!/(((^https?)|(^ftp)):\/\/)|(^mailto:)/i.test(url)) {
                    url = ((this.isEmail) ? "mailto:": "http://") + url;
                }
                props.asc_setHyperlinkUrl(url);
                def_display = url;
            }
            if (this.inputDisplay.isDisabled()) {
                props.asc_setText(null);
            } else {
                if (_.isEmpty(this.inputDisplay.getValue())) {
                    this.inputDisplay.setValue(def_display);
                }
                props.asc_setText(this.inputDisplay.getValue());
            }
            props.asc_setTooltip(this.inputTip.getValue());
            return props;
        },
        onBtnClick: function (event) {
            this._handleInput(event.currentTarget.attributes["result"].value);
        },
        onKeyPress: function (event) {
            if (event.keyCode == Common.UI.Keys.RETURN) {
                this._handleInput("ok");
                return false;
            }
        },
        _handleInput: function (state) {
            if (this.options.handler) {
                if (state == "ok") {
                    var checkurl = (this.cmbLinkType.getValue() === c_oAscHyperlinkType.WebLink) ? this.inputUrl.checkValidate() : true,
                    checkrange = (this.cmbLinkType.getValue() === c_oAscHyperlinkType.RangeLink) ? this.inputRange.checkValidate() : true,
                    checkdisp = this.inputDisplay.checkValidate();
                    if (checkurl !== true) {
                        this.inputUrl.cmpEl.find("input").focus();
                        return;
                    }
                    if (checkrange !== true) {
                        this.inputRange.cmpEl.find("input").focus();
                        return;
                    }
                    if (checkdisp !== true) {
                        this.inputDisplay.cmpEl.find("input").focus();
                        return;
                    }
                }
                this.options.handler.call(this, this, state);
            }
            this.close();
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
        cancelButtonText: "Cancel",
        textDefault: "Selected range"
    },
    SSE.Views.HyperlinkSettingsDialog || {}));
});