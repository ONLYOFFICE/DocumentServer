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
 define(["common/main/lib/component/Window"], function () {
    Common.Views.ImageFromUrlDialog = Common.UI.Window.extend(_.extend({
        options: {
            width: 330,
            header: false,
            cls: "modal-dlg"
        },
        initialize: function (options) {
            _.extend(this.options, options || {});
            this.template = ['<div class="box">', '<div class="input-row">', "<label>" + this.textUrl + "</label>", "</div>", '<div id="id-dlg-url" class="input-row"></div>', "</div>", '<div class="footer right">', '<button class="btn normal dlg-btn primary" result="ok" style="margin-right: 10px;">' + this.okButtonText + "</button>", '<button class="btn normal dlg-btn" result="cancel">' + this.cancelButtonText + "</button>", "</div>"].join("");
            this.options.tpl = _.template(this.template, this.options);
            Common.UI.Window.prototype.initialize.call(this, this.options);
        },
        render: function () {
            Common.UI.Window.prototype.render.call(this);
            var me = this;
            me.inputUrl = new Common.UI.InputField({
                el: $("#id-dlg-url"),
                allowBlank: false,
                blankError: me.txtEmpty,
                style: "width: 100%;",
                validateOnBlur: false,
                validation: function (value) {
                    return (/((^https?)|(^ftp)):\/\/.+/i.test(value)) ? true : me.txtNotUrl;
                }
            });
            var $window = this.getChild();
            $window.find(".btn").on("click", _.bind(this.onBtnClick, this));
            $window.find("input").on("keypress", _.bind(this.onKeyPress, this));
        },
        show: function () {
            Common.UI.Window.prototype.show.apply(this, arguments);
            var me = this;
            _.delay(function () {
                me.getChild("input").focus();
            },
            500);
        },
        onKeyPress: function (event) {
            if (event.keyCode == Common.UI.Keys.RETURN) {
                this._handleInput("ok");
            }
        },
        onBtnClick: function (event) {
            this._handleInput(event.currentTarget.attributes["result"].value);
        },
        _handleInput: function (state) {
            if (this.options.handler) {
                if (state == "ok") {
                    if (this.inputUrl.checkValidate() !== true) {
                        this.inputUrl.cmpEl.find("input").focus();
                        return;
                    }
                }
                this.options.handler.call(this, state, this.inputUrl.getValue());
            }
            this.close();
        },
        textUrl: "Paste an image URL:",
        cancelButtonText: "Cancel",
        okButtonText: "Ok",
        txtEmpty: "This field is required",
        txtNotUrl: 'This field should be a URL in the format "http://www.example.com"'
    },
    Common.Views.ImageFromUrlDialog || {}));
});