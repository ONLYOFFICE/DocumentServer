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
define(["common/main/lib/component/Window"], function () {
    Common.Views.CopyWarningDialog = Common.UI.Window.extend(_.extend({
        options: {
            width: 500,
            height: 325,
            cls: "modal-dlg copy-warning"
        },
        initialize: function (options) {
            _.extend(this.options, {
                title: this.textTitle
            },
            options || {});
            this.template = ['<div class="box">', '<p class="message">' + this.textMsg + "</p>", '<div class="hotkeys">', "<div>", '<p class="hotkey">' + Common.Utils.String.platformKey("Ctrl+C", "{0}") + "</p>", '<p class="message">' + this.textToCopy + "</p>", "</div>", "<div>", '<p class="hotkey">' + Common.Utils.String.platformKey("Ctrl+X", "{0}") + "</p>", '<p class="message">' + this.textToCut + "</p>", "</div>", "<div>", '<p class="hotkey">' + Common.Utils.String.platformKey("Ctrl+V", "{0}") + "</p>", '<p class="message">' + this.textToPaste + "</p>", "</div>", "</div>", '<div id="copy-warning-checkbox" style="margin-top: 20px; text-align: left;"></div>', "</div>", '<div class="separator horizontal"/>', '<div class="footer center">', '<button class="btn normal dlg-btn primary">' + this.okButtonText + "</button>", "</div>"].join("");
            this.options.tpl = _.template(this.template, this.options);
            Common.UI.Window.prototype.initialize.call(this, this.options);
        },
        render: function () {
            Common.UI.Window.prototype.render.call(this);
            this.chDontShow = new Common.UI.CheckBox({
                el: $("#copy-warning-checkbox"),
                labelText: this.textDontShow
            });
            this.getChild().find(".btn").on("click", _.bind(this.onBtnClick, this));
            this.autoSize();
            Common.NotificationCenter.trigger("copywarning:show");
        },
        autoSize: function () {
            var text_cnt = this.getChild(".box"),
            footer = this.getChild(".footer"),
            header = this.getChild(".header"),
            body = this.getChild(".body");
            body.height(parseInt(text_cnt.height()) + parseInt(footer.css("height")));
            this.setHeight(parseInt(body.css("height")) + parseInt(header.css("height")));
        },
        onBtnClick: function (event) {
            if (this.options.handler) {
                this.options.handler.call(this, this.chDontShow.getValue() == "checked");
            }
            this.close();
        },
        onKeyPress: function (event) {
            if (event.keyCode == Common.UI.Keys.RETURN) {
                if (this.options.handler) {
                    this.options.handler.call(this, this.chDontShow.getValue() == "checked");
                }
                this.close();
            }
        },
        getSettings: function () {
            return (this.chDontShow.getValue() == "checked");
        },
        textTitle: "Copy, Cut and Paste Actions",
        textMsg: "Copy, cut and paste actions using the editor toolbar buttons and context menu actions will be performed within this editor tab only.<br><br>.To copy or paste to or from applications outside the editor tab use the following keyboard combinations:",
        textToCopy: "for Copy",
        textToPaste: "for Paste",
        textToCut: "for Cut",
        textDontShow: "Don't show this message again"
    },
    Common.Views.CopyWarningDialog || {}));
});