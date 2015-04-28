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
var c_oHyperlinkType = {
    InternalLink: 0,
    WebLink: 1
};
define(["common/main/lib/util/utils", "common/main/lib/component/InputField", "common/main/lib/component/ComboBox", "common/main/lib/component/RadioBox", "common/main/lib/component/Window"], function () {
    PE.Views.HyperlinkSettingsDialog = Common.UI.Window.extend(_.extend({
        options: {
            width: 350,
            style: "min-width: 230px;",
            cls: "modal-dlg",
            id: "window-hyperlink-settings"
        },
        initialize: function (options) {
            _.extend(this.options, {
                title: this.textTitle
            },
            options || {});
            this.template = ['<div class="box" style="height: 270px;">', '<div class="input-row">', '<label style="font-weight: bold;">' + this.textLinkType + "</label>", "</div>", '<div id="id-dlg-hyperlink-type" class="input-row" style="margin-bottom: 5px;"></div>', '<div id="id-external-link">', '<div class="input-row">', '<label style="font-weight: bold;">' + this.strLinkTo + " *</label>", "</div>", '<div id="id-dlg-hyperlink-url" class="input-row" style="margin-bottom: 5px;"></div>', "</div>", '<div id="id-internal-link" class="hidden" style="margin-top: 15px;">', '<div id="id-dlg-hyperlink-radio-next" style="display: block;margin-bottom: 5px;"></div>', '<div id="id-dlg-hyperlink-radio-prev" style="display: block;margin-bottom: 5px;"></div>', '<div id="id-dlg-hyperlink-radio-first" style="display: block;margin-bottom: 5px;"></div>', '<div id="id-dlg-hyperlink-radio-last"  style="display: block;margin-bottom: 5px;"></div>', '<div id="id-dlg-hyperlink-radio-slide" style="display: inline-block;margin-bottom: 5px;margin-right: 10px;"></div>', '<div id="id-dlg-hyperlink-slide" style="display: inline-block;margin-bottom: 10px;"></div>', "</div>", '<div class="input-row">', '<label style="font-weight: bold;">' + this.strDisplay + "</label>", "</div>", '<div id="id-dlg-hyperlink-display" class="input-row" style="margin-bottom: 5px;"></div>', '<div class="input-row">', '<label style="font-weight: bold;">' + this.textTipText + "</label>", "</div>", '<div id="id-dlg-hyperlink-tip" class="input-row" style="margin-bottom: 5px;"></div>', "</div>", '<div class="footer right">', '<button class="btn normal dlg-btn primary" result="ok" style="margin-right: 10px;">' + this.okButtonText + "</button>", '<button class="btn normal dlg-btn" result="cancel">' + this.cancelButtonText + "</button>", "</div>"].join("");
            this.options.tpl = _.template(this.template, this.options);
            this.slides = this.options.slides;
            Common.UI.Window.prototype.initialize.call(this, this.options);
        },
        render: function () {
            Common.UI.Window.prototype.render.call(this);
            var me = this,
            $window = this.getChild();
            me._arrTypeSrc = [{
                displayValue: me.textInternalLink,
                value: c_oHyperlinkType.InternalLink
            },
            {
                displayValue: me.textExternalLink,
                value: c_oHyperlinkType.WebLink
            }];
            me.cmbLinkType = new Common.UI.ComboBox({
                el: $("#id-dlg-hyperlink-type"),
                cls: "input-group-nr",
                style: "width: 100%;",
                menuStyle: "min-width: 318px;",
                editable: false,
                data: this._arrTypeSrc
            });
            me.cmbLinkType.setValue(me._arrTypeSrc[1].value);
            me.cmbLinkType.on("selected", _.bind(function (combo, record) {
                this.ShowHideElem(record.value);
            },
            me));
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
            me.inputDisplay = new Common.UI.InputField({
                el: $("#id-dlg-hyperlink-display"),
                allowBlank: true,
                validateOnBlur: false,
                style: "width: 100%;"
            }).on("changed:after", function () {
                me.isTextChanged = true;
            });
            me.inputTip = new Common.UI.InputField({
                el: $("#id-dlg-hyperlink-tip"),
                style: "width: 100%;"
            });
            me.radioNext = new Common.UI.RadioBox({
                el: $("#id-dlg-hyperlink-radio-next"),
                labelText: this.txtNext,
                name: "asc-radio-slide",
                checked: true
            });
            me.radioPrev = new Common.UI.RadioBox({
                el: $("#id-dlg-hyperlink-radio-prev"),
                labelText: this.txtPrev,
                name: "asc-radio-slide"
            });
            me.radioFirst = new Common.UI.RadioBox({
                el: $("#id-dlg-hyperlink-radio-first"),
                labelText: this.txtFirst,
                name: "asc-radio-slide"
            });
            me.radioLast = new Common.UI.RadioBox({
                el: $("#id-dlg-hyperlink-radio-last"),
                labelText: this.txtLast,
                name: "asc-radio-slide"
            });
            me.radioSlide = new Common.UI.RadioBox({
                el: $("#id-dlg-hyperlink-radio-slide"),
                labelText: this.txtSlide,
                name: "asc-radio-slide"
            });
            me.cmbSlides = new Common.UI.ComboBox({
                el: $("#id-dlg-hyperlink-slide"),
                cls: "input-group-nr",
                style: "width: 50px;",
                menuStyle: "min-width: 50px; max-height: 200px;",
                editable: false,
                data: this.slides
            });
            me.cmbSlides.setValue(0);
            me.cmbSlides.on("selected", _.bind(function (combo, record) {
                me.radioSlide.setValue(true);
            },
            me));
            $window.find(".dlg-btn").on("click", _.bind(this.onBtnClick, this));
            $window.find("input").on("keypress", _.bind(this.onKeyPress, this));
            me.externalPanel = $window.find("#id-external-link");
            me.internalPanel = $window.find("#id-internal-link");
        },
        setSettings: function (props) {
            if (props) {
                var me = this;
                var type = me.parseUrl(props.get_Value());
                me.cmbLinkType.setValue(type);
                me.ShowHideElem(type);
                if (props.get_Text() !== null) {
                    me.inputDisplay.setValue(props.get_Text());
                    me.inputDisplay.setDisabled(false);
                } else {
                    this.inputDisplay.setValue(this.textDefault);
                    this.inputDisplay.setDisabled(true);
                }
                this.isTextChanged = false;
                this.inputTip.setValue(props.get_ToolTip());
                if (type == c_oHyperlinkType.WebLink) {
                    me.inputUrl.cmpEl.find("input").focus();
                }
            }
        },
        getSettings: function () {
            var me = this,
            props = new CHyperlinkProperty();
            var def_display = "";
            if (me.cmbLinkType.getValue() == c_oHyperlinkType.InternalLink) {
                var url = "ppaction://hlink";
                var tip = "";
                var txttip = me.inputTip.getValue();
                if (this.radioSlide.getValue()) {
                    url = url + "sldjumpslide" + (this.cmbSlides.getValue());
                    tip = this.txtSlide + " " + (this.cmbSlides.getValue() + 1);
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
                props.put_ToolTip(_.isEmpty(txttip) ? tip : txttip);
                def_display = tip;
            } else {
                var url = $.trim(me.inputUrl.getValue());
                if (!/(((^https?)|(^ftp)):\/\/)|(^mailto:)/i.test(url)) {
                    url = ((me.isEmail) ? "mailto:": "http://") + url;
                }
                props.put_Value(url);
                props.put_ToolTip(me.inputTip.getValue());
                def_display = url;
            }
            if (!me.inputDisplay.isDisabled() && (me.isTextChanged || _.isEmpty(me.inputDisplay.getValue()))) {
                if (_.isEmpty(me.inputDisplay.getValue())) {
                    me.inputDisplay.setValue(def_display);
                }
                props.put_Text(me.inputDisplay.getValue());
            } else {
                props.put_Text(null);
            }
            return props;
        },
        onBtnClick: function (event) {
            if (event.currentTarget && event.currentTarget.attributes["result"]) {
                this._handleInput(event.currentTarget.attributes["result"].value);
            }
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
                    var checkurl = (this.cmbLinkType.getValue() == c_oHyperlinkType.WebLink) ? this.inputUrl.checkValidate() : true,
                    checkdisp = this.inputDisplay.checkValidate();
                    if (checkurl !== true) {
                        this.inputUrl.cmpEl.find("input").focus();
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
        ShowHideElem: function (value) {
            this.externalPanel.toggleClass("hidden", value !== c_oHyperlinkType.WebLink);
            this.internalPanel.toggleClass("hidden", value !== c_oHyperlinkType.InternalLink);
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
                                        this.cmbSlides.setValue(slideNum);
                                    }
                                }
                            }
                        }
                    }
                }
                return c_oHyperlinkType.InternalLink;
            } else {
                this.inputUrl.setValue(url ? url : "");
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
        txtNotUrl: 'This field should be a URL in the format "http://www.example.com"',
        strPlaceInDocument: "Select a Place in This Document",
        cancelButtonText: "Cancel",
        okButtonText: "Ok",
        txtNext: "Next Slide",
        txtPrev: "Previous Slide",
        txtFirst: "First Slide",
        txtLast: "Last Slide",
        textDefault: "Selected text"
    },
    PE.Views.HyperlinkSettingsDialog || {}));
});