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
 define(["common/main/lib/component/Window", "common/main/lib/component/LoadMask"], function () {
    Common.Views.DocumentAccessDialog = Common.UI.Window.extend(_.extend({
        initialize: function (options) {
            var _options = {};
            _.extend(_options, {
                title: this.textTitle,
                width: 850,
                height: 534,
                header: true
            },
            options);
            this.template = ['<div id="id-sharing-placeholder"></div>'].join("");
            _options.tpl = _.template(this.template, _options);
            this.settingsurl = options.settingsurl || "";
            Common.UI.Window.prototype.initialize.call(this, _options);
        },
        render: function () {
            Common.UI.Window.prototype.render.call(this);
            this.$window.find("> .body").css({
                height: "auto",
                overflow: "hidden"
            });
            var iframe = document.createElement("iframe");
            iframe.width = "100%";
            iframe.height = 500;
            iframe.align = "top";
            iframe.frameBorder = 0;
            iframe.scrolling = "no";
            iframe.onload = _.bind(this._onLoad, this);
            $("#id-sharing-placeholder").append(iframe);
            this.loadMask = new Common.UI.LoadMask({
                owner: $("#id-sharing-placeholder")
            });
            this.loadMask.setTitle(this.textLoading);
            this.loadMask.show();
            iframe.src = this.settingsurl;
            this._bindWindowEvents.call(this);
        },
        _bindWindowEvents: function () {
            var me = this;
            if (window.addEventListener) {
                window.addEventListener("message", function (msg) {
                    me._onWindowMessage(msg);
                },
                false);
            } else {
                if (window.attachEvent) {
                    window.attachEvent("onmessage", function (msg) {
                        me._onWindowMessage(msg);
                    });
                }
            }
        },
        _onWindowMessage: function (msg) {
            if (msg && window.JSON) {
                try {
                    this._onMessage.call(this, window.JSON.parse(msg.data));
                } catch(e) {}
            }
        },
        _onMessage: function (msg) {
            if (msg && msg.needUpdate) {
                this.trigger("accessrights", this, msg.sharingSettings);
            }
            this.close();
        },
        _onLoad: function () {
            if (this.loadMask) {
                this.loadMask.hide();
            }
        },
        textTitle: "Sharing Settings",
        textLoading: "Loading"
    },
    Common.Views.DocumentAccessDialog || {}));
});