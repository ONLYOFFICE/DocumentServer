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
 define(["common/main/lib/component/BaseView", "common/main/lib/component/Scroller"], function () {
    Common.Views.About = Common.UI.BaseView.extend(_.extend({
        menu: undefined,
        options: {
            alias: "Common.Views.About"
        },
        initialize: function (options) {
            Common.UI.BaseView.prototype.initialize.call(this, arguments);
            this.txtVersionNum = "3.0";
            this.txtAscMail = "support@onlyoffice.com";
            this.txtAscTelNum = "+371 660-16425";
            this.txtAscUrl = "www.onlyoffice.com";
            this.txtAscName = "Ascensio System SIA";
            this.template = _.template(['<table id="id-about-licensor-logo" cols="1" style="width: 100%; margin-top: 20px;">', "<tr>", '<td align="center"><div class="asc-about-office"/></td>', "</tr>", "<tr>", '<td align="center"><label class="asc-about-version">' + options.appName.toUpperCase() + "</label></td>", "</tr>", "<tr>", '<td align="center"><label class="asc-about-version">' + this.txtVersion + this.txtVersionNum + "</label></td>", "</tr>", "</table>", '<table id="id-about-licensor-info" cols="3" style="width: 100%;" class="margin-bottom">', "<tr>", '<td colspan="3" align="center" style="padding: 20px 0 10px 0;"><label class="asc-about-companyname">' + this.txtAscName + "</label></td>", "</tr>", "<tr>", '<td colspan="3" align="center" class="padding-small">', '<label class="asc-about-desc-name">' + this.txtAddress + "</label>", '<label class="asc-about-desc">' + this.txtAscAddress + "</label>", "</td>", "</tr>", "<tr>", '<td colspan="3" align="center" class="padding-small">', '<label class="asc-about-desc-name">' + this.txtMail + "</label>", '<a href="mailto:' + this.txtAscMail + '">' + this.txtAscMail + "</a>", "</td>", "</tr>", "<tr>", '<td colspan="3" align="center" class="padding-small">', '<label class="asc-about-desc-name">' + this.txtTel + "</label>", '<label class="asc-about-desc">' + this.txtAscTelNum + "</label>", "</td>", "</tr>", "<tr>", '<td colspan="3" align="center">', '<a href="http://' + this.txtAscUrl + '" target="_blank">' + this.txtAscUrl + "</a>", "</td>", "</tr>", "</table>", '<table id="id-about-licensee-info" cols="1" style="width: 100%; margin-top: 20px;" class="hidden margin-bottom"><tbody>', "<tr>", '<td align="center" class="padding-small"><div id="id-about-company-logo"/></td>', "</tr>", "<tr>", '<td align="center"><label class="asc-about-version">' + options.appName.toUpperCase() + "</label></td>", "</tr>", "<tr>", '<td align="center"><label style="padding-bottom: 29px;" class="asc-about-version">' + this.txtVersion + this.txtVersionNum + "</label></td>", "</tr>", "<tr>", '<td align="center" class="padding-small">', '<label class="asc-about-companyname" id="id-about-company-name"></label>', "</td>", "</tr>", "<tr>", '<td align="center" class="padding-small">', '<label class="asc-about-desc-name">' + this.txtAddress + "</label>", '<label class="asc-about-desc" id="id-about-company-address"></label>', "</td>", "</tr>", "<tr>", '<td align="center" class="padding-small">', '<label class="asc-about-desc-name">' + this.txtMail + "</label>", '<a href="mailto:" id="id-about-company-mail"></a>', "</td>", "</tr>", "<tr>", '<td align="center" class="padding-small">', '<a href="" target="_blank" id="id-about-company-url"></a>', "</td>", "</tr>", "<tr>", '<td align="center">', '<label class="asc-about-lic" id="id-about-company-lic"></label>', "</td>", "</tr>", "</table>", '<table id="id-about-licensor-short" cols="1" style="width: 100%; margin-top: 31px;" class="hidden"><tbody>', "<tr>", '<td style="width:50%;"><div class="separator horizontal short left"/></td>', '<td align="center"><label class="asc-about-header">' + this.txtPoweredBy + "</label></td>", '<td style="width:50%;"><div class="separator horizontal short"/></td>', "</tr>", "<tr>", '<td colspan="3" align="center" style="padding: 9px 0 10px;"><label class="asc-about-companyname">' + this.txtAscName + "</label></td>", "</tr>", "<tr>", '<td colspan="3" align="center">', '<a href="http://' + this.txtAscUrl + '" target="_blank">' + this.txtAscUrl + "</a>", "</td>", "</tr>", "</table>"].join(""));
            this.menu = options.menu;
        },
        render: function () {
            var el = $(this.el);
            el.html(this.template({
                scope: this
            }));
            el.addClass("about-dlg");
            this.cntLicenseeInfo = $("#id-about-licensee-info");
            this.cntLicensorInfo = $("#id-about-licensor-info");
            this.divCompanyLogo = $("#id-about-company-logo");
            this.lblCompanyName = $("#id-about-company-name");
            this.lblCompanyAddress = $("#id-about-company-address");
            this.lblCompanyMail = $("#id-about-company-mail");
            this.lblCompanyUrl = $("#id-about-company-url");
            this.lblCompanyLic = $("#id-about-company-lic");
            if (_.isUndefined(this.scroller)) {
                this.scroller = new Common.UI.Scroller({
                    el: $(this.el),
                    suppressScrollX: true
                });
            }
            return this;
        },
        setLicInfo: function (data) {
            if (data && typeof(data) == "object" && typeof(data.customer) == "object") {
                var customer = data.customer;
                $("#id-about-licensor-logo").addClass("hidden");
                $("#id-about-licensor-short").removeClass("hidden");
                this.cntLicensorInfo.addClass("hidden");
                this.cntLicenseeInfo.removeClass("hidden");
                this.cntLicensorInfo.removeClass("margin-bottom");
                var value = customer.name;
                value && value.length ? this.lblCompanyName.text(value) : this.lblCompanyName.parents("tr").addClass("hidden");
                value = customer.address;
                value && value.length ? this.lblCompanyAddress.text(value) : this.lblCompanyAddress.parents("tr").addClass("hidden");
                (value = customer.mail) && value.length ? this.lblCompanyMail.attr("href", "mailto:" + value).text(value) : this.lblCompanyMail.parents("tr").addClass("hidden");
                if ((value = customer.www) && value.length) {
                    var http = !/^https?:\/{2}/i.test(value) ? "http://": "";
                    this.lblCompanyUrl.attr("href", http + value).text(value);
                } else {
                    this.lblCompanyUrl.parents("tr").addClass("hidden");
                } (value = customer.info) && value.length ? this.lblCompanyLic.text(value) : this.lblCompanyLic.parents("tr").addClass("hidden");
                (value = customer.logo) && value.length ? this.divCompanyLogo.html('<img src="' + value + '" />') : this.divCompanyLogo.parents("tr").addClass("hidden");
            } else {
                this.cntLicenseeInfo.addClass("hidden");
                this.cntLicensorInfo.addClass("margin-bottom");
            }
        },
        show: function () {
            Common.UI.BaseView.prototype.show.call(this, arguments);
            this.fireEvent("show", this);
        },
        hide: function () {
            Common.UI.BaseView.prototype.hide.call(this, arguments);
            this.fireEvent("hide", this);
        },
        txtPoweredBy: "Powered by",
        txtVersion: "Version ",
        txtLicensor: "LICENSOR",
        txtLicensee: "LICENSEE",
        txtAddress: "address: ",
        txtAscAddress: "Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021",
        txtMail: "email: ",
        txtTel: "tel.: "
    },
    Common.Views.About || {}));
});