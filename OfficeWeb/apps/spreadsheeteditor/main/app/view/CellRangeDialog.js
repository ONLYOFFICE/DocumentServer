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
define(["common/main/lib/component/InputField", "common/main/lib/component/Window"], function () {
    SSE.Views.CellRangeDialog = Common.UI.Window.extend(_.extend({
        options: {
            width: 350,
            cls: "modal-dlg",
            modal: false
        },
        initialize: function (options) {
            _.extend(this.options, {
                title: this.txtTitle
            },
            options);
            this.template = ['<div class="box">', '<div id="id-dlg-cell-range" class="input-row" style="margin-bottom: 5px;"></div>', "</div>", '<div class="footer right">', '<button class="btn normal dlg-btn primary" result="ok" style="margin-right: 10px;">' + this.okButtonText + "</button>", '<button class="btn normal dlg-btn" result="cancel">' + this.cancelButtonText + "</button>", "</div>"].join("");
            this.options.tpl = _.template(this.template, this.options);
            Common.UI.Window.prototype.initialize.call(this, this.options);
        },
        render: function () {
            Common.UI.Window.prototype.render.call(this);
            var $window = this.getChild(),
            me = this;
            me.inputRange = new Common.UI.InputField({
                el: $("#id-dlg-cell-range"),
                name: "range",
                style: "width: 100%;",
                allowBlank: false,
                blankError: this.txtEmpty,
                validateOnChange: true
            });
            $window.find(".dlg-btn").on("click", _.bind(this.onBtnClick, this));
            me.inputRange.cmpEl.find("input").on("keypress", _.bind(this.onKeyPress, this));
            this.on("close", _.bind(this.onClose, this));
        },
        onPrimary: function () {
            this._handleInput("ok");
            return false;
        },
        setSettings: function (settings) {
            var me = this;
            this.inputRange.setValue(settings.range ? settings.range : "");
            if (settings.api) {
                me.api = settings.api;
                me.api.asc_setSelectionDialogMode(c_oAscSelectionDialogType.Chart, settings.range ? settings.range : "");
                me.api.asc_registerCallback("asc_onSelectionRangeChanged", _.bind(me.onApiRangeChanged, me));
                Common.NotificationCenter.trigger("cells:range", c_oAscSelectionDialogType.Chart);
            }
            me.inputRange.validation = function (value) {
                var isvalid = me.api.asc_checkDataRange(c_oAscSelectionDialogType.Chart, value, false);
                return (isvalid == c_oAscError.ID.DataRangeError) ? me.txtInvalidRange : true;
            };
        },
        getSettings: function () {
            return this.inputRange.getValue();
        },
        onApiRangeChanged: function (info) {
            this.inputRange.setValue(info);
            if (this.inputRange.cmpEl.hasClass("error")) {
                this.inputRange.cmpEl.removeClass("error");
            }
        },
        onBtnClick: function (event) {
            this._handleInput(event.currentTarget.attributes["result"].value);
        },
        onClose: function (event) {
            if (this.api) {
                this.api.asc_setSelectionDialogMode(c_oAscSelectionDialogType.None);
            }
            Common.NotificationCenter.trigger("cells:range", c_oAscSelectionDialogType.None);
        },
        onKeyPress: function (event) {
            if (event.keyCode == Common.UI.Keys.RETURN) {
                this._handleInput("ok");
            }
        },
        _handleInput: function (state) {
            if (this.options.handler) {
                if (state == "ok") {
                    if (this.inputRange.checkValidate() !== true) {
                        return;
                    }
                }
                this.options.handler.call(this, this, state);
            }
            this.close();
        },
        txtTitle: "Select Data Range",
        textCancel: "Cancel",
        txtEmpty: "This field is required",
        txtInvalidRange: "ERROR! Invalid cells range",
        errorMaxRows: "ERROR! The maximum number of data series per chart is 255."
    },
    SSE.Views.CellRangeDialog || {}));
});