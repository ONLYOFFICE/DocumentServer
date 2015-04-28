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
 define(["common/main/lib/component/Window", "common/main/lib/component/ComboBox"], function () {
    SSE.Views.SetValueDialog = Common.UI.Window.extend(_.extend({
        options: {
            width: 214,
            header: true,
            style: "min-width: 214px;",
            cls: "modal-dlg"
        },
        initialize: function (options) {
            _.extend(this.options, {
                title: this.textTitle
            },
            options || {});
            this.template = ['<div class="box">', '<div class="input-row">', '<div id="id-spin-set-value"></div>', "</div>", '<div class="footer center">', '<button class="btn normal dlg-btn primary" result="ok" style="margin-right: 10px;">' + this.okButtonText + "</button>", '<button class="btn normal dlg-btn" result="cancel">' + this.cancelButtonText + "</button>", "</div>"].join("");
            this.options.tpl = _.template(this.template, this.options);
            this.startvalue = this.options.startvalue;
            this.maxvalue = this.options.maxvalue;
            this.defaultUnit = this.options.defaultUnit;
            this.step = this.options.step;
            Common.UI.Window.prototype.initialize.call(this, this.options);
        },
        render: function () {
            Common.UI.Window.prototype.render.call(this);
            this.spnSize = new Common.UI.MetricSpinner({
                el: $("#id-spin-set-value"),
                width: 182,
                step: this.step,
                defaultUnit: this.defaultUnit,
                minValue: 0,
                maxValue: this.maxvalue,
                value: this.startvalue + " " + this.defaultUnit
            });
            var $window = this.getChild();
            $window.find(".dlg-btn").on("click", _.bind(this.onBtnClick, this));
            this.spnSize.on("entervalue", _.bind(this.onEnterValue, this));
            this.spnSize.on("change", _.bind(this.onChange, this));
            this.spnSize.$el.find("input").focus();
        },
        _handleInput: function (state) {
            if (this.options.handler) {
                this.options.handler.call(this, this, state);
            }
            this.close();
        },
        onBtnClick: function (event) {
            this._handleInput(event.currentTarget.attributes["result"].value);
        },
        onEnterValue: function (event) {
            this._handleInput("ok");
        },
        onChange: function () {
            var val = this.spnSize.getNumberValue();
            val = val / this.step;
            val = (val | val) * this.step;
            this.spnSize.setValue(val, true);
        },
        getSettings: function () {
            return this.spnSize.getNumberValue();
        },
        cancelButtonText: "Cancel",
        okButtonText: "Ok",
        txtMinText: "The minimum value for this field is {0}",
        txtMaxText: "The maximum value for this field is {0}"
    },
    SSE.Views.SetValueDialog || {}));
});