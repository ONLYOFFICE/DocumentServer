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
Common.Views = Common.Views || {};
define(["backbone", "text!common/main/lib/template/Header.template", "core"], function (Backbone, headerTemplate) {
    Common.Views.Header = Backbone.View.extend(_.extend({
        options: {
            branding: {},
            headerCaption: "Default Caption",
            documentCaption: "",
            canBack: false
        },
        el: "#header",
        template: _.template(headerTemplate),
        events: {
            "click #header-logo": function (e) {
                var newDocumentPage = window.open("http://www.onlyoffice.com");
                newDocumentPage && newDocumentPage.focus();
            }
        },
        initialize: function (options) {
            this.options = this.options ? _({}).extend(this.options, options) : options;
            this.headerCaption = this.options.headerCaption;
            this.documentCaption = this.options.documentCaption;
            this.canBack = this.options.canBack;
            this.branding = this.options.customization;
        },
        render: function () {
            $(this.el).html(this.template({
                headerCaption: this.headerCaption,
                documentCaption: Common.Utils.String.htmlEncode(this.documentCaption),
                canBack: this.canBack,
                textBack: this.textBack
            }));
        },
        setVisible: function (visible) {
            visible ? this.show() : this.hide();
        },
        setBranding: function (value) {
            var element;
            this.branding = value;
            if (value && value.logoUrl) {
                element = $("#header-logo");
                if (element) {
                    element.css("background-image", 'url("' + value.logoUrl + '")');
                }
            }
        },
        setHeaderCaption: function (value) {
            this.headerCaption = value;
            var caption = $("#header-caption > div");
            if (caption) {
                caption.html(value);
            }
            return value;
        },
        getHeaderCaption: function () {
            return this.headerCaption;
        },
        setDocumentCaption: function (value, applyOnly) {
            if (_.isUndefined(applyOnly)) {
                this.documentCaption = value;
            }
            if (!value) {
                value = "";
            }
            var dc = $("#header-documentcaption");
            if (dc) {
                dc.html(Common.Utils.String.htmlEncode(value));
            }
            return value;
        },
        getDocumentCaption: function () {
            return this.documentCaption;
        },
        setCanBack: function (value) {
            this.canBack = value;
            var back = $("#header-back");
            if (back) {
                back.off("click");
                back.css("display", value ? "table-cell" : "none");
                if (value) {
                    back.on("click", _.bind(this.onBackClick, this));
                }
            }
        },
        getCanBack: function () {
            return this.canBack;
        },
        onBackClick: function (e) {
            Common.Gateway.goBack(e.which == 2);
            Common.component.Analytics.trackEvent("Back to Folder");
        },
        textBack: "Go to Documents"
    },
    Common.Views.Header || {}));
});